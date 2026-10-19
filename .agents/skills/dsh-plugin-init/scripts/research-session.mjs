#!/usr/bin/env node
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
import { createHash } from 'node:crypto';
import { resolve, relative, isAbsolute, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { CATALOG, REGISTRY, pluginDirectory } from '../../_shared/scripts/data-paths.mjs';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
    ROOT,
    read,
    digest,
    atomicWrite,
    validate as validateCatalog,
    validateObservations
} from '../../_shared/scripts/plugin-data.mjs';
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const schema = read(resolve(ROOT, '.agents/skills/_shared/schemas/research-session.schema.json'));
const check = ajv.compile(schema);
const manifestSchema = read(resolve(ROOT, '.agents/skills/_shared/schemas/run-manifest.schema.json'));
const manifestCheck = ajv.compile(manifestSchema);
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
export function validateManifest(manifest) {
    if (!manifestCheck(manifest)) throw new Error(ajv.errorsText(manifestCheck.errors));
    const roundDate = manifest.round.slice(0, 10);
    if (
        new Date(`${roundDate}T00:00:00Z`).toISOString().slice(0, 10) !== roundDate ||
        Number(manifest.round.slice(11)) < 1
    )
        throw new Error('invalid manifest round');
    if (manifest.summary.listed < manifest.summary.selected || manifest.summary.selected !== manifest.items.length)
        throw new Error('invalid manifest selection counts');
    if (manifest.summary.complete + manifest.summary.blocked + manifest.summary.pending !== manifest.summary.selected)
        throw new Error('invalid manifest status counts');
    if (manifest.summary.deferred !== manifest.summary.listed - manifest.summary.selected)
        throw new Error('invalid manifest deferred count');
    if (new Set(manifest.items.map((item) => item.id)).size !== manifest.items.length)
        throw new Error('duplicate manifest plugin');
    const sourceUrls = new Set(manifest.sources.map((source) => source.url));
    if (sourceUrls.size !== manifest.sources.length) throw new Error('duplicate manifest source');
    for (const item of manifest.items) {
        if (item.path.startsWith('/') || item.path.split('/').includes('..'))
            throw new Error('unsafe manifest component path');
        if (item.source_urls.some((url) => !sourceUrls.has(url))) throw new Error('unknown manifest source');
    }
    return manifest;
}
export function validateSession(session, root = ROOT) {
    if (!check(session)) throw new Error(ajv.errorsText(check.errors));
    if (
        session.research_limit !== undefined &&
        (session.selected_ids.length !== Math.min(session.research_limit, session.items.length) ||
            session.selected_ids.some((id, index) => session.items[index]?.id !== id))
    )
        throw new Error('invalid research selection');
    const ids = new Set();
    const selected = session.selected_ids ? new Set(session.selected_ids) : null;
    const urls = new Set(session.sources.map((s) => s.url));
    if (urls.size !== session.sources.length) throw new Error('duplicate source');
    for (const item of session.items) {
        if (ids.has(item.id)) throw new Error('duplicate plugin');
        ids.add(item.id);
        if (item.path.startsWith('/') || item.path.split('/').includes('..')) throw new Error('unsafe component path');
        if (item.source_urls.some((url) => !urls.has(url))) throw new Error('unknown source');
        if (
            selected &&
            !selected.has(item.id) &&
            (item.status !== 'pending' || item.reason !== undefined || item.checkpoint !== undefined)
        )
            throw new Error('deferred item must remain pending without completion state');
        if (item.status === 'complete') {
            const obs = read(artifact(root, item.checkpoint.observations));
            validateObservations(obs);
            if (digest(obs) !== item.checkpoint.observations_digest || obs.run_id !== item.checkpoint.run_id)
                throw new Error('checkpoint observations changed');
            const plugin = obs.plugins.find((p) => p.id === item.id);
            if (
                !plugin ||
                plugin.repository !== item.repository ||
                plugin.path !== item.path ||
                !plugin.evidence.some((e) => e.kind === 'source_inspection' && e.revision === item.revision)
            )
                throw new Error('checkpoint identity or revision differs');
            for (const evidence of plugin.evidence) if (evidence.artifact) artifact(root, evidence.artifact);
            const report = readFileSync(artifact(root, item.checkpoint.report), 'utf8');
            if (!report.trim() || digest(report) !== item.checkpoint.report_digest)
                throw new Error('checkpoint report changed');
        }
    }
    return session;
}
function artifact(root, name) {
    const path = resolve(root, name);
    if (isAbsolute(name) || relative(root, path).startsWith('..')) throw new Error('artifact must be inside project');
    if (!existsSync(path)) throw new Error(`missing artifact: ${name}`);
    return path;
}
export function startSession(input, previous = null, limit = undefined) {
    if (limit !== undefined && (!Number.isSafeInteger(limit) || limit < 1))
        throw new Error('limit must be a positive safe integer');
    const session = {
        schema_version: 1,
        id: input.id,
        checked_at: input.checked_at,
        sources: input.sources,
        previous_digest: previous ? digest(previous) : null,
        items: input.plugins.map((p) => ({ ...p, changes: ['unknown'], status: 'pending' }))
    };
    // Validate before comparing; no duplicate identity may be silently collapsed.
    validateSession(session);
    if (previous) {
        validateSession(previous);
        if (previous.id === session.id || Date.parse(previous.checked_at) >= Date.parse(session.checked_at))
            throw new Error('new round needs a new id and later cutoff');
    }
    const old = new Map((previous?.items ?? []).map((p) => [p.id, p]));
    const compareFields = ['repository', 'path', 'revision', 'fingerprints', 'source_urls'];
    for (const item of session.items) {
        item.changes = [];
        const before = old.get(item.id);
        if (!before) item.changes = ['added'];
        else {
            if (before.repository !== item.repository || before.path !== item.path) item.changes.push('moved');
            if (!item.revision || !before.revision) item.changes.push('unknown');
            else if (before.revision !== item.revision || digest(before.fingerprints) !== digest(item.fingerprints))
                item.changes.push('content_changed');
            if (digest([...before.source_urls].sort()) !== digest([...item.source_urls].sort()))
                item.changes.push('sources_changed');
            if (!item.changes.length) item.changes.push('unchanged');
        }
        old.delete(item.id);
    }
    const sources = new Map(session.sources.map((s) => [s.url, s]));
    for (const before of old.values()) {
        const removed = before.source_urls.every((url) => sources.get(url)?.complete === true);
        // Keep provenance for absent candidates, without claiming an unqueried source was checked.
        for (const url of before.source_urls)
            if (!sources.has(url)) {
                const source = { url, revision: null, complete: false };
                session.sources.push(source);
                sources.set(url, source);
            }
        session.items.push({
            ...Object.fromEntries(['id', ...compareFields].map((key) => [key, before[key]])),
            changes: [removed ? 'removed_from_source' : 'unknown'],
            status: 'pending'
        });
    }
    if (limit !== undefined) {
        session.research_limit = limit;
        session.selected_ids = session.items.slice(0, limit).map((item) => item.id);
    }
    return validateSession(session);
}
export function selectedItems(session) {
    return session.items.filter((item) => !session.selected_ids || session.selected_ids.includes(item.id));
}
export function createManifest(session, sessionPath, root = ROOT) {
    validateSession(session, root);
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
        '.agents/skills/_shared/scripts/github-batch.mjs',
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
    const items = selected.map((item) => ({
        ...Object.fromEntries(
            ['id', 'repository', 'path', 'revision', 'fingerprints', 'source_urls', 'changes', 'status'].map((key) => [
                key,
                item[key]
            ])
        ),
        ...(item.reason ? { reason: item.reason } : {}),
        ...(item.checkpoint
            ? {
                  checkpoint: {
                      run_id: item.checkpoint.run_id,
                      observations_sha256: item.checkpoint.observations_digest,
                      report_sha256: item.checkpoint.report_digest
                  }
              }
            : {})
    }));
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
            'npm run prepare:plugin -- --session data/runs/<round>/SESSION.json --plugin <plugin-id> --checkout <readonly-checkout> --inventory <local-inventory.json> --out data/runs/<round>/snapshots/<plugin-slug>/MATERIALS.json',
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
export function completeItem(session, id, obsPath, reportPath, catalog, root = ROOT) {
    validateSession(session, root);
    validateCatalog(catalog);
    const item = session.items.find((p) => p.id === id);
    if (!item || !selectedItems(session).includes(item) || item.status === 'complete')
        throw new Error('item missing or already complete');
    const obs = read(artifact(root, obsPath));
    validateObservations(obs);
    const plugin = obs.plugins.find((p) => p.id === id);
    const run = catalog.runs.find((r) => r.id === obs.run_id);
    if (!plugin || !run || !catalog.plugins.some((p) => p.id === id))
        throw new Error('apply observations before checkpoint');
    // A run ID alone is not proof that this exact batch was applied.
    if (run.checked_at !== obs.checked_at || digest(run.errors) !== digest(obs.errors))
        throw new Error('applied run differs');
    const current = catalog.plugins.find((p) => p.id === id);
    if (
        plugin.repository !== item.repository ||
        plugin.path !== item.path ||
        ['sources', 'evidence'].some((key) =>
            plugin[key].some((value) => !current[key].some((saved) => digest(saved) === digest(value)))
        )
    )
        throw new Error('applied artifacts or component differ');
    if (
        plugin.last_checked_at !== current.last_checked_at ||
        Object.entries(plugin.fingerprints).some(([k, v]) => current.fingerprints[k] !== v)
    )
        throw new Error('catalog does not match observations');
    if (
        Date.parse(plugin.last_checked_at) < Date.parse(session.checked_at) ||
        !plugin.findings.length ||
        plugin.findings.some(
            (f) =>
                Date.parse(f.reviewed_at) < Date.parse(session.checked_at) ||
                !current.findings.some((c) => digest(c) === digest(f))
        )
    )
        throw new Error('fresh analysis required for every round');
    if (!item.revision || !plugin.evidence.some((e) => e.kind === 'source_inspection' && e.revision === item.revision))
        throw new Error('analysis must match pinned revision');
    for (const e of plugin.evidence) if (e.artifact) artifact(root, e.artifact);
    const report = readFileSync(artifact(root, reportPath), 'utf8');
    if (!report.trim()) throw new Error('report is empty');
    item.status = 'complete';
    delete item.reason;
    item.checkpoint = {
        observations: obsPath,
        observations_digest: digest(obs),
        report: reportPath,
        report_digest: digest(report),
        run_id: obs.run_id
    };
    return validateSession(session, root);
}
export function saveSession(path, action) {
    mkdirSync(dirname(path), { recursive: true });
    const lock = `${path}.lock`;
    const fd = openSync(lock, 'wx', 0o600);
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        const value = action();
        atomicWrite(path, value);
        return value;
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
export function publishItem(session, id, out, root = ROOT) {
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
                v.previous ? read(v.previous) : null,
                v.limit === undefined ? undefined : /^[1-9][0-9]*$/.test(v.limit) ? Number(v.limit) : NaN
            );
        });
    } else if (['next', 'validate'].includes(command)) {
        const s = validateSession(read(need('session')));
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
        atomicWrite(resolve(out), createManifest(read(sessionPath), sessionPath));
    } else if (command === 'publish') {
        publishItem(read(need('session')), need('plugin'), need('out'));
    } else if (command === 'checkpoint' || command === 'block' || command === 'retry') {
        saveSession(need('session'), () => {
            const s = validateSession(read(v.session));
            if (command === 'checkpoint')
                return completeItem(
                    s,
                    need('plugin'),
                    need('observations'),
                    need('report'),
                    read(v.catalog ?? resolve(ROOT, CATALOG))
                );
            const item = s.items.find((p) => p.id === need('plugin'));
            if (!item || !selectedItems(s).includes(item) || item.status === 'complete')
                throw new Error('item missing or already complete');
            item.status = command === 'block' ? 'blocked' : 'pending';
            if (command === 'block') item.reason = need('reason');
            else delete item.reason;
            return validateSession(s);
        });
    } else throw new Error('Usage: research-session.mjs start|next|checkpoint|block|retry|validate|manifest|publish');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        main();
    } catch (e) {
        console.error(e.message);
        process.exitCode = 1;
    }
}
