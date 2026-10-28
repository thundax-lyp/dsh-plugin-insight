#!/usr/bin/env node
import { readSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { readResearchSession } from '../../_shared/scripts/work-storage.mjs';
import {
    existsSync,
    readFileSync,
    openSync,
    closeSync,
    unlinkSync,
    writeFileSync,
    mkdirSync,
    renameSync
} from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { CATALOG, REGISTRY, pluginDirectory } from '../../_shared/scripts/data-paths.mjs';
import {
    ROOT,
    read,
    digest,
    analysisDigest,
    atomicWrite,
    validate as validateCatalog
} from '../../_shared/scripts/plugin-data.mjs';
import {
    validateSession,
    selectedItems,
    sha256,
    validateManifest,
    artifact,
    startSession,
    completeItem,
    hasFreshAnalysis
} from './session-state.mjs';
function currentCatalog(root = ROOT) {
    const index = resolve(root, 'data/catalog/index.jsonl');
    return existsSync(index) ? readSnapshotStorage(index).catalog : read(resolve(root, CATALOG));
}
export function createManifest(session, sessionPath, root = ROOT) {
    validateSession(session, root);
    const catalog = currentCatalog(root);
    validateCatalog(catalog);
    const catalogById = new Map(catalog.plugins.map((plugin) => [plugin.id, plugin]));
    const relativeSession = relative(root, resolve(sessionPath)).split('\\').join('/');
    const match = relativeSession.match(/^data\/runs\/(\d{4}-\d{2}-\d{2}-\d{2,})\/SESSION\.json$/);
    if (!match) throw new Error('manifest requires a local data/runs/<round>/SESSION.json');
    const selected = selectedItems(session);
    const changes = {};
    for (const item of session.items) for (const change of item.changes) changes[change] = (changes[change] ?? 0) + 1;
    const workflowFiles = [
        '.node-version',
        'package-lock.json',
        '.agents/skills/_shared/schemas/catalog.schema.json',
        '.agents/skills/_shared/schemas/observations.schema.json',
        '.agents/skills/_shared/schemas/research-session.schema.json',
        '.agents/skills/_shared/schemas/run-manifest.schema.json',
        '.agents/skills/_shared/scripts/capture-github.mjs',
        '.agents/skills/_shared/scripts/github-client.mjs',
        '.agents/skills/_shared/scripts/plugin-data.mjs',
        '.agents/skills/dsh-plugin-init/scripts/build-research-input.mjs',
        '.agents/skills/dsh-plugin-init/scripts/publication-data.mjs',
        '.agents/skills/dsh-plugin-init/scripts/research-session.mjs',
        '.agents/skills/dsh-plugin-init/scripts/render-research.mjs',
        '.agents/skills/dsh-plugin-init/SKILL.md',
        '.agents/skills/dsh-plugin-init/references/OUTPUT-STANDARD.md',
        '.agents/skills/dsh-plugin-insight/SKILL.md',
        '.agents/skills/dsh-plugin-insight/references/RESEARCH-STANDARD.md',
        '.agents/skills/dsh-plugin-insight/scripts/capture-plugin-meta.mjs',
        '.agents/skills/dsh-plugin-insight/scripts/prepare-plugin-materials.mjs',
        '.agents/skills/dsh-plugin-insight/scripts/plugin-inventory.mjs',
        '.agents/skills/_shared/references/DATA-CONTRACT.md'
    ];
    const workflow = workflowFiles.map((path) => ({ path, sha256: sha256(readFileSync(resolve(root, path))) }));
    const items = selected.map((item) => {
        const plugin = catalogById.get(item.id);
        if (item.status === 'complete' && !plugin)
            throw new Error(`complete manifest item missing from catalog: ${item.id}`);
        return {
            ...Object.fromEntries(
                ['id', 'repository', 'path', 'revision', 'fingerprints', 'source_urls', 'changes', 'status'].map(
                    (key) => [key, item[key]]
                )
            ),
            ...(item.reason ? { reason: item.reason } : {}),
            ...(item.status === 'complete' ? { analysis_sha256: analysisDigest(plugin) } : {}),
            ...(item.checkpoint
                ? {
                      checkpoint: {
                          run_id: item.checkpoint.run_id,
                          observations_sha256: item.checkpoint.observations_digest,
                          report_sha256: item.checkpoint.report_digest
                      }
                  }
                : {})
        };
    });
    return validateManifest({
        schema_version: 1,
        round: match[1],
        session_id: session.id,
        checked_at: session.checked_at,
        previous_session_sha256: session.previous_digest,
        sources: session.sources,
        summary: {
            listed: session.items.length,
            selected: selected.length,
            complete: selected.filter((item) => item.status === 'complete').length,
            blocked: selected.filter((item) => item.status === 'blocked').length,
            pending: selected.filter((item) => item.status === 'pending').length,
            deferred: session.items.length - selected.length,
            changes
        },
        items,
        tooling: {
            node_version: readFileSync(resolve(root, '.node-version'), 'utf8').trim(),
            package_lock_sha256: sha256(readFileSync(resolve(root, 'package-lock.json'))),
            workflow_sha256: digest(workflow)
        },
        reproducibility: {
            level: 'workflow',
            limitations: [
                'Git 清单保存固定来源、所选对象、工具链和命令，不保存完整候选输入与原始响应。',
                '精确恢复中断或逐字节审计仍需要 session_sha256 对应的本地或外部归档。',
                '外部来源即使固定 revision 也可能被删除或变得不可访问。'
            ]
        },
        commands: [
            'npm ci --ignore-scripts',
            'npm run research:input -- --source-awesome <checkout> --source-harness <checkout> --id <session-id> --checked-at <iso-time> --out data/runs/<round>/INPUT.json --problems data/runs/<round>/INPUT-PROBLEMS.json',
            'npm run research -- start --input <local-input.json> [--previous <local-previous-session>] [--limit N] --out data/runs/<round>/SESSION.json',
            'npm run prepare:plugin -- --session data/runs/<round>/SESSION.json --plugin <plugin-id> --checkout <readonly-checkout> --inventory <local-inventory.json> --out data/runs/<round>/<plugin-slug>/MATERIALS.json',
            'node .agents/skills/_shared/scripts/plugin-data.mjs plan --mode <init-or-update> --observations <local-observations.json> --out <local-plan.json>',
            'node .agents/skills/_shared/scripts/plugin-data.mjs apply --plan <local-plan.json>',
            'npm run research -- checkpoint --session data/runs/<round>/SESSION.json --plugin <plugin-id> --observations <local-observations.json> --report <local-report.md>',
            'npm run research -- publish --session data/runs/<round>/SESSION.json --plugin <plugin-id> --out data/plugins/<plugin-slug>/INSIGHT.md',
            'npm run research -- manifest --session data/runs/<round>/SESSION.json --out data/manifests/<round>.json',
            'npm run publication -- plan --manifest data/manifests/<round>.json --input data/runs/<round>/PUBLICATION-INPUT.json --out <local-plan.json>',
            'npm run publication -- apply --plan <local-plan.json>'
        ],
        local_artifacts: { root: `data/runs/${match[1]}`, session_sha256: digest(session) }
    });
}
export function saveSession(path, action) {
    mkdirSync(dirname(path), { recursive: true });
    const lock = `${path}.lock`;
    const fd = openSync(lock, 'wx', 0o600);
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        if (existsSync(path) && read(path).schema_version === 2)
            throw Error('linked session must be mutated through snapshot WORK');
        const sibling = resolve(dirname(path), 'WORK.json');
        if (existsSync(sibling) && read(sibling).schema_version === 2)
            throw Error('split work must be mutated through snapshot WORK');
        if (existsSync(resolve(dirname(path), 'WORK.json.lock'))) throw Error('active work lock');
        const value = action();
        atomicWrite(path, value);
        return value;
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
export function publishItem(session, id, out, root = ROOT) {
    if (existsSync(resolve(root, 'data/catalog/index.jsonl')))
        throw Error('formal details are derived from snapshot; stage records and merge instead');
    const current = validateSession(session, root);
    const item = current.items.find((item) => item.id === id && item.status === 'complete');
    if (!item) throw new Error('publish requires a complete session item');
    const registry = read(resolve(root, REGISTRY));
    if (!registry[item.id]) throw new Error('publish requires a registered plugin directory');
    const outputPath = relative(root, resolve(out)).split('\\').join('/');
    const expected = `${pluginDirectory(item, root)}/INSIGHT.md`;
    if (outputPath !== expected) throw new Error(`publish output must equal ${expected}`);
    const report = readFileSync(artifact(root, item.checkpoint.report), 'utf8');
    if (!report.trim()) throw new Error('report is empty');
    mkdirSync(dirname(resolve(out)), { recursive: true });
    const temporary = `${resolve(out)}.tmp`;
    writeFileSync(temporary, report);
    renameSync(temporary, resolve(out));
}
export function main(args = process.argv.slice(2)) {
    const [command, ...rest] = args;
    const { values: v } = parseArgs({
        args: rest,
        options: Object.fromEntries(
            [
                'input',
                'previous',
                'session',
                'plugin',
                'observations',
                'report',
                'catalog',
                'out',
                'reason',
                'limit'
            ].map((k) => [k, { type: 'string' }])
        )
    });
    const need = (key) => {
        if (!v[key]) throw new Error(`--${key} required`);
        return v[key];
    };
    if (command === 'start') {
        const path = need('out');
        const runPath = relative(ROOT, resolve(path)).split('\\').join('/');
        if (
            !/^data\/runs\/\d{4}-\d{2}-\d{2}-\d{2,}\/SESSION\.json$/.test(runPath) ||
            Number(runPath.split('/')[2].slice(11)) < 1
        )
            throw Error('new session requires data/runs/YYYY-MM-DD-NN/SESSION.json');
        const date = runPath.split('/')[2].slice(0, 10);
        if (new Date(date + 'T00:00:00Z').toISOString().slice(0, 10) !== date) throw Error('invalid run date');
        saveSession(path, () => {
            if (existsSync(path)) throw new Error('session exists; resume it or choose new id');
            return startSession(
                read(need('input')),
                v.previous ? readResearchSession(v.previous) : null,
                v.limit === undefined ? 40 : /^[1-9][0-9]*$/.test(v.limit) ? Number(v.limit) : NaN
            );
        });
    } else if (['next', 'validate'].includes(command)) {
        const s = validateSession(readResearchSession(need('session')));
        const selected = selectedItems(s);
        console.log(
            JSON.stringify(
                command === 'next'
                    ? {
                          next: selected.find((p) => p.status === 'pending') ?? null,
                          complete: selected.filter((p) => p.status === 'complete').length,
                          blocked: selected.filter((p) => p.status === 'blocked').length,
                          total: selected.length,
                          listed: s.items.length,
                          deferred: s.items.length - selected.length
                      }
                    : { valid: true }
            )
        );
    } else if (command === 'manifest') {
        const sessionPath = need('session');
        const out = need('out');
        const outputPath = relative(ROOT, resolve(out)).split('\\').join('/');
        if (!/^data\/manifests\/\d{4}-\d{2}-\d{2}-\d{2,}\.json$/.test(outputPath))
            throw new Error('manifest output requires data/manifests/<round>.json');
        atomicWrite(resolve(out), createManifest(readResearchSession(sessionPath), sessionPath));
    } else if (command === 'publish') {
        publishItem(readResearchSession(need('session')), need('plugin'), need('out'));
    } else if (command === 'checkpoint' || command === 'block' || command === 'retry' || command === 'invalidate') {
        saveSession(need('session'), () => {
            const s = validateSession(readResearchSession(v.session));
            if (command === 'checkpoint')
                return completeItem(
                    s,
                    need('plugin'),
                    need('observations'),
                    need('report'),
                    v.catalog ? read(v.catalog) : currentCatalog()
                );
            const item = s.items.find((p) => p.id === need('plugin'));
            if (!item || !selectedItems(s).includes(item)) throw new Error('item missing or deferred');
            if (command === 'invalidate') {
                if (item.status !== 'complete') throw new Error('invalidate requires a complete item');
                const catalog = v.catalog ? read(v.catalog) : currentCatalog();
                validateCatalog(catalog);
                if (
                    hasFreshAnalysis(
                        catalog.plugins.find((plugin) => plugin.id === item.id),
                        s.checked_at
                    )
                )
                    throw new Error('cannot invalidate an item with fresh analysis');
                item.status = 'pending';
                delete item.checkpoint;
                return validateSession(s);
            }
            if (item.status === 'complete') throw new Error('item already complete');
            item.status = command === 'block' ? 'blocked' : 'pending';
            if (command === 'block') item.reason = need('reason');
            else delete item.reason;
            return validateSession(s);
        });
    } else
        throw new Error(
            'Usage: research-session.mjs start|next|checkpoint|block|retry|invalidate|validate|manifest|publish'
        );
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        main();
    } catch (e) {
        console.error(e.message);
        process.exitCode = 1;
    }
}

export { validateManifest, validateSession, startSession, selectedItems, completeItem } from './session-state.mjs';

export { incrementalSelection } from './research-selection.mjs';
