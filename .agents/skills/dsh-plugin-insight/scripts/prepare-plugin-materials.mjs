#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { ROOT, atomicWrite, digest, read } from '../../_shared/scripts/plugin-data.mjs';
import { pluginDirectory } from '../../_shared/scripts/data-paths.mjs';
import { validateSession } from '../../dsh-plugin-init/scripts/research-session.mjs';

const git = (root, args) =>
    execFileSync('git', ['-C', root, ...args], {
        encoding: 'utf8',
        timeout: 60_000,
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe']
    });

const projectPath = (path) => {
    const absolute = resolve(path);
    const local = relative(ROOT, absolute).split('\\').join('/');
    if (isAbsolute(local) || local.startsWith('../')) throw new Error(`artifact must be inside project: ${path}`);
    return local;
};
const checkoutPath = (path) => {
    const absolute = resolve(path);
    const local = relative(ROOT, absolute).split('\\').join('/');
    return isAbsolute(local) || local.startsWith('../') ? absolute : local;
};

const gitFile = (checkout, revision, path) => {
    try {
        const content = git(checkout, ['show', `${revision}:${path}`]);
        return Buffer.byteLength(content) <= 256 * 1024
            ? { path, content, digest: digest(content) }
            : {
                  path,
                  content: null,
                  digest: digest(content),
                  limitation: 'content exceeds 256 KiB; inspect separately'
              };
    } catch {
        return null;
    }
};

const firstGitFile = (checkout, revision, paths) => {
    for (const path of paths) {
        const value = gitFile(checkout, revision, path);
        if (value) return value;
    }
    return null;
};

export function prepareMaterials({
    session,
    sessionPath,
    pluginId,
    checkout,
    inventory,
    inventoryPath,
    directoryEntries = []
}) {
    validateSession(session);
    const item = session.items.find((candidate) => candidate.id === pluginId);
    if (!item) throw new Error(`plugin is not in session: ${pluginId}`);
    if (session.selected_ids && !session.selected_ids.includes(pluginId))
        throw new Error('deferred plugin cannot be prepared');
    if (item.status === 'complete')
        throw new Error('completed plugin materials are immutable; start a new round to revise them');
    const revision = git(checkout, ['rev-parse', 'HEAD']).trim();
    if (revision !== item.revision)
        throw new Error(`checkout revision differs: expected ${item.revision}, got ${revision}`);
    if (git(checkout, ['status', '--porcelain']).trim()) throw new Error('checkout has tracked or untracked changes');
    if (inventory.revision !== item.revision || inventory.component !== item.path)
        throw new Error('inventory revision or component differs from session');
    const component = item.path ? `${item.path}/` : '';
    const packageFile = firstGitFile(checkout, item.revision, [`${component}package.json`, 'package.json']);
    const readmeFile = firstGitFile(
        checkout,
        item.revision,
        ['README.md', 'README.zh.md', 'README.zh-CN.md', 'README.en.md', 'README_EN.md'].flatMap((name) => [
            `${component}${name}`,
            name
        ])
    );
    const sourceCandidates = inventory.files
        .filter((file) => file.role === 'source' && file.extension !== '.md')
        .map(({ path, extension, lines, code, comments, blank }) => ({
            path,
            extension,
            lines,
            code,
            comments,
            blank
        }));
    const entries = directoryEntries.map((path) => {
        const local = projectPath(path);
        if (!existsSync(resolve(ROOT, local))) throw new Error(`missing directory entry: ${local}`);
        const content = readFileSync(resolve(ROOT, local), 'utf8');
        return { path: local, content, digest: digest(content) };
    });
    return {
        schema_version: 1,
        session: { id: session.id, checked_at: session.checked_at, artifact: projectPath(sessionPath) },
        plugin: {
            id: item.id,
            repository: item.repository,
            path: item.path,
            revision: item.revision,
            fingerprints: item.fingerprints,
            source_urls: item.source_urls
        },
        checkout: { path: checkoutPath(checkout), revision, clean: true },
        inventory: {
            artifact: projectPath(inventoryPath),
            digest: digest(inventory),
            coverage: inventory.coverage,
            files: inventory.files.length,
            excluded: inventory.excluded,
            parse_errors: inventory.parse_errors
        },
        author_materials: [packageFile, readmeFile].filter(Boolean),
        directory_entries: entries,
        source_candidates: sourceCandidates,
        static_capabilities: inventory.capability_summary,
        skill_candidates: inventory.skills,
        limitations: [
            'This file is a mechanical material index, not a research observation or finding.',
            'Static candidates require source and runtime-registration review before publication.',
            'No target code, tests, plugin installation, host, model or external service was executed.'
        ]
    };
}

export function validateMaterialsOutput(session, pluginId, out, round, root = ROOT) {
    validateSession(session);
    const item = session.items.find((candidate) => candidate.id === pluginId);
    if (!item) throw new Error(`plugin is not in session: ${pluginId}`);
    const directory = pluginDirectory({ ...item, component_id: pluginId.split(':')[2] }, root);
    const expected = resolve(root, `data/runs/${round}/snapshots/${basename(directory)}/MATERIALS.json`);
    if (resolve(out) !== expected) throw new Error('materials output path differs from selected plugin');
    if (existsSync(out)) {
        const existing = read(out);
        if (existing.plugin?.id !== pluginId || existing.session?.id !== session.id)
            throw new Error('existing materials belong to another plugin or session');
    }
}

export function main(args = process.argv.slice(2)) {
    const { values } = parseArgs({
        args,
        options: {
            session: { type: 'string' },
            plugin: { type: 'string' },
            checkout: { type: 'string' },
            inventory: { type: 'string' },
            'directory-entry': { type: 'string', multiple: true, default: [] },
            out: { type: 'string' }
        }
    });
    const required = (key) => {
        if (!values[key]) throw new Error(`--${key} is required`);
        return values[key];
    };
    const sessionPath = resolve(required('session'));
    const inventoryPath = resolve(required('inventory'));
    const checkout = resolve(required('checkout'));
    const out = resolve(required('out'));
    const sessionLocal = projectPath(sessionPath);
    const round = sessionLocal.match(/^data\/runs\/(\d{4}-\d{2}-\d{2}-\d{2,})\/SESSION\.json$/)?.[1];
    if (!round) throw new Error('session must be data/runs/<round>/SESSION.json');
    const session = read(sessionPath);
    const pluginId = required('plugin');
    validateMaterialsOutput(session, pluginId, out, round);
    const result = prepareMaterials({
        session,
        sessionPath,
        pluginId,
        checkout,
        inventory: read(inventoryPath),
        inventoryPath,
        directoryEntries: values['directory-entry'].map((path) => resolve(path))
    });
    atomicWrite(out, result);
    console.log(
        JSON.stringify({
            plugin: result.plugin.id,
            revision: result.plugin.revision,
            source_candidates: result.source_candidates.length,
            parse_errors: result.inventory.parse_errors.length
        })
    );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        main();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
    }
}
