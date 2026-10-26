#!/usr/bin/env node
import { readWork } from '../../_shared/scripts/work-storage.mjs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { read, atomicWrite, ROOT } from '../../_shared/scripts/plugin-data.mjs';
import { pluginDirectory, researchDataDirectory } from '../../_shared/scripts/data-paths.mjs';
import { selectedItems } from './research-session.mjs';
import {
    captureNpmDownloads,
    captureNpmPublication,
    validateMetadata
} from '../../dsh-plugin-insight/scripts/capture-plugin-meta.mjs';
import { readNpmMetaCache, resolveNpmMetadata } from '../../_shared/scripts/npm-meta-cache.mjs';
import { readGitMetaCache, gitCacheSnapshot } from '../../_shared/scripts/git-meta-cache.mjs';
const execute = promisify(execFile);
const run = async (command, args, options = {}) =>
    (await execute(command, args, { encoding: 'utf8', timeout: 180_000, maxBuffer: 32 * 1024 * 1024, ...options }))
        .stdout;
const succeeds = async (command, args, options = {}) => {
    try {
        await run(command, args, options);
        return true;
    } catch {
        return false;
    }
};
const node = (script, args) => run(process.execPath, [resolve(ROOT, script), ...args]);
const pool = async (items, fn) => {
    let cursor = 0;
    await Promise.all(
        Array.from({ length: Math.min(4, items.length) }, async () => {
            while (cursor < items.length) await fn(items[cursor++]);
        })
    );
};
export async function restoreEolOnlyCheckout(path) {
    const status = (await run('git', ['-C', path, 'status', '--porcelain'])).trimEnd();
    if (
        !status ||
        !status.split('\n').every((line) => line.startsWith(' M ')) ||
        !(await succeeds('git', ['-C', path, 'diff', '--quiet', '--ignore-cr-at-eol', '--']))
    )
        return false;
    await run('git', ['-C', path, 'restore', '--source', 'HEAD', '--worktree', '--', '.']);
    return true;
}
export async function prepareSelected(
    workPath,
    {
        downloads = captureNpmDownloads,
        publication = captureNpmPublication,
        metaCache = readNpmMetaCache,
        gitMetaCache = readGitMetaCache,
        at = new Date().toISOString()
    } = {}
) {
    const work = readWork(resolve(workPath)),
        folder = resolve(workPath, '..');
    const items = selectedItems(work.session).filter((i) => i.status === 'pending');
    const checkouts = new Map(),
        errors = [];
    const [npmResult, gitResult] = await Promise.allSettled([
        Promise.resolve().then(metaCache),
        Promise.resolve().then(gitMetaCache)
    ]);
    const metaCacheError = npmResult.status === 'rejected' ? npmResult.reason.message : null;
    const cache =
        npmResult.status === 'fulfilled'
            ? npmResult.value
            : { records: new Map(), repository: null, branch: null, path: null, blob_sha: null };
    const gitCacheError = gitResult.status === 'rejected' ? gitResult.reason.message : null;
    const gitCache = gitResult.status === 'fulfilled' ? gitResult.value : null;
    const gitCacheFile = resolve(folder, 'GIT-META-CACHE.json');
    if (gitCache) atomicWrite(gitCacheFile, gitCacheSnapshot(gitCache));
    const metaSources = [];
    for (const item of items)
        checkouts.set(item.repository, {
            item,
            path: resolve(researchDataDirectory(ROOT), `checkouts/${item.id.split(':')[1]}-${item.revision}`)
        });
    await pool([...checkouts.values()], async ({ item, path }) => {
        try {
            if (!item.revision) throw Error('no pinned revision');
            if (!existsSync(resolve(path, '.git'))) {
                mkdirSync(path, { recursive: true });
                await run('git', ['init', path]);
                await run('git', ['-C', path, 'remote', 'add', 'origin', `https://github.com/${item.repository}.git`]);
            }
            // Material checkouts must expose the exact committed bytes. Repository attributes such as
            // `text eol=crlf` can otherwise make a mixed-EOL blob dirty immediately after checkout.
            mkdirSync(resolve(path, '.git/info'), { recursive: true });
            writeFileSync(resolve(path, '.git/info/attributes'), '* -text\n');
            await run('git', ['-C', path, 'config', 'core.autocrlf', 'false']);
            let head = '';
            try {
                head = (await run('git', ['-C', path, 'rev-parse', 'HEAD'])).trim();
            } catch {}
            if (head !== item.revision) {
                await run('git', ['-C', path, 'fetch', '--depth', '1', 'origin', item.revision]);
                await run('git', ['-C', path, 'checkout', '--detach', item.revision]);
            } else await restoreEolOnlyCheckout(path);
            if ((await run('git', ['-C', path, 'status', '--porcelain'])).trim()) throw Error('checkout is dirty');
        } catch (e) {
            errors.push({ repository: item.repository, phase: 'checkout', message: e.message });
        }
    });
    await pool(items, async (item) => {
        const checkout = checkouts.get(item.repository).path;
        const slug = basename(pluginDirectory({ ...item, component_id: item.id.split(':')[2] }, ROOT));
        const directory = resolve(folder, slug);
        mkdirSync(directory, { recursive: true });
        try {
            if (errors.some((e) => e.repository === item.repository && e.phase === 'checkout')) return;
            const inventoryPath = resolve(directory, 'INVENTORY.json');
            await node('.agents/skills/dsh-plugin-insight/scripts/plugin-inventory.mjs', [
                '--root',
                checkout,
                '--ref',
                item.revision,
                ...(item.path ? ['--component', item.path] : []),
                '--out',
                inventoryPath
            ]);
            await node('.agents/skills/dsh-plugin-insight/scripts/prepare-plugin-materials.mjs', [
                '--session',
                resolve(folder, 'SESSION.json'),
                '--plugin',
                item.id,
                '--checkout',
                checkout,
                '--inventory',
                inventoryPath,
                '--out',
                resolve(directory, 'MATERIALS.json')
            ]);
            const packagePath = resolve(checkout, item.path, 'package.json');
            let packageName;
            if (existsSync(packagePath))
                try {
                    const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
                    packageName =
                        !pkg.private &&
                        typeof pkg.name === 'string' &&
                        /^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/.test(pkg.name)
                            ? pkg.name
                            : undefined;
                } catch {}
            const metadataPath = resolve(directory, 'META.json');
            await node('.agents/skills/dsh-plugin-insight/scripts/capture-plugin-meta.mjs', [
                item.repository,
                '--out',
                metadataPath,
                '--repository-id',
                item.id.split(':')[1],
                '--at',
                at,
                ...(gitCache ? ['--git-cache-file', gitCacheFile] : ['--skip-git-cache'])
            ]);
            const pluginMetadata = validateMetadata(read(metadataPath));
            const sources = {
                plugin_id: item.id,
                github: 'repository',
                git_stars: pluginMetadata.git_cache
                    ? 'github-meta'
                    : pluginMetadata.stars === null
                      ? null
                      : 'github-api',
                git_archived: pluginMetadata.git_cache
                    ? 'github-meta'
                    : pluginMetadata.archived === undefined
                      ? null
                      : 'github-api',
                npm_downloads: null,
                npm_publication: null
            };
            if (typeof packageName === 'string') {
                const resolved = await resolveNpmMetadata(packageName, cache.records.get(packageName), {
                    downloads,
                    publication,
                    at
                });
                pluginMetadata.npm = resolved.npm;
                sources.npm_downloads = resolved.downloads_source;
                sources.npm_publication = resolved.publication_source;
            }
            validateMetadata(pluginMetadata);
            atomicWrite(metadataPath, pluginMetadata);
            metaSources.push(sources);
            const inventory = read(inventoryPath);
            const files = [];
            let bytes = 0;
            // Mechanical source material only: no findings, scores or reports are generated here.
            const paths = [
                ...new Set([
                    'README.md',
                    'package.json',
                    ...inventory.files.filter((f) => f.role === 'source').map((f) => f.path)
                ])
            ];
            for (const name of paths) {
                const file = resolve(checkout, name);
                if (!file.startsWith(checkout + '/') || !existsSync(file)) continue;
                let content;
                try {
                    content = readFileSync(file, 'utf8');
                } catch {
                    continue;
                }
                if (
                    content.includes('\0') ||
                    Buffer.byteLength(content) > 256 * 1024 ||
                    bytes + Buffer.byteLength(content) > 2 * 1024 * 1024
                )
                    continue;
                files.push({ path: name, content });
                bytes += Buffer.byteLength(content);
            }
            atomicWrite(resolve(directory, 'SOURCE.json'), {
                repository: item.repository,
                revision: item.revision,
                component: item.path,
                coverage: 'bounded source material; see included paths and INVENTORY.json for full static scope',
                files
            });
            console.log(`Prepared ${item.id} ${item.repository} ${item.path}`);
        } catch (e) {
            errors.push({ plugin_id: item.id, repository: item.repository, phase: 'materials', message: e.message });
            console.error(`Preparation failed ${item.id}: ${e.message}`);
        }
    });
    atomicWrite(resolve(folder, 'PREPARATION.json'), {
        checked_at: at,
        selected: items.length,
        meta_cache: {
            repository: cache.repository,
            branch: cache.branch,
            path: cache.path,
            blob_sha: cache.blob_sha,
            records: cache.records.size,
            error: metaCacheError
        },
        git_meta_cache: {
            repository: gitCache?.repository ?? null,
            path: gitCache?.path ?? null,
            commit_sha: gitCache?.commit_sha ?? null,
            blob_sha: gitCache?.blob_sha ?? null,
            errors_blob_sha: gitCache?.errors_blob_sha ?? null,
            records: gitCache?.records.size ?? 0,
            error: gitCacheError
        },
        meta_sources: metaSources.sort((left, right) => left.plugin_id.localeCompare(right.plugin_id)),
        errors
    });
    return errors;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
    try {
        const { values } = parseArgs({ options: { work: { type: 'string' } } });
        if (!values.work) throw Error('--work required');
        const errors = await prepareSelected(values.work);
        if (errors.length) process.exitCode = 1;
    } catch (e) {
        console.error(e.message);
        process.exitCode = 1;
    }
