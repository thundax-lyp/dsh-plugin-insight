#!/usr/bin/env node
import { existsSync, readFileSync, mkdirSync, writeFileSync, openSync, closeSync, unlinkSync, rmSync } from 'node:fs';
import { resolve, relative, isAbsolute, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { createHash } from 'node:crypto';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
    ROOT,
    read,
    digest,
    analysisDigest,
    atomicWrite,
    validate as validateCatalog,
    validateObservations,
    plan as planCatalog
} from '../../_shared/scripts/plugin-data.mjs';
import { CATALOG, PUBLICATION, REGISTRY, pluginDirectory } from '../../_shared/scripts/data-paths.mjs';
import { validatePublication } from './publication-data.mjs';
import { startSession, validateSession, completeItem, selectedItems } from './research-session.mjs';
import { renderPublication } from './render-research.mjs';
import { validateMetadata } from '../../dsh-plugin-insight/scripts/capture-plugin-meta.mjs';
export const SNAPSHOT = 'data/catalog/SNAPSHOT.json';
const hash = (text) => createHash('sha256').update(text).digest('hex');
const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);
const check = ajv.compile(read(resolve(ROOT, '.agents/skills/_shared/schemas/snapshot.schema.json')));
const workCheck = ajv.compile(read(resolve(ROOT, '.agents/skills/_shared/schemas/snapshot-work.schema.json')));
const validateWork = (work, root = ROOT) => {
    if (!workCheck(work)) throw Error(ajv.errorsText(workCheck.errors));
    validateSession(work.session, root);
    if (
        digest(work.input) !== work.input_digest ||
        work.input.id !== work.session.id ||
        work.input.checked_at !== work.session.checked_at
    )
        throw Error('work input differs from fixed session');
    const keys = ['id', 'repository', 'path', 'revision', 'fingerprints', 'source_urls'];
    const fixed = work.session.items
        .slice(0, work.input.plugins.length)
        .map((item) => Object.fromEntries(keys.map((k) => [k, item[k]])));
    if (digest(fixed) !== digest(work.input.plugins)) throw Error('session candidates differ from fixed input');
    return work;
};
const local = (root, name) => {
    const full = resolve(root, name);
    if (isAbsolute(name) || relative(root, full).startsWith('..')) throw Error(`path outside project: ${name}`);
    return full;
};
const snapshotFile = (root) => resolve(root, SNAPSHOT);
const readSnapshot = (root) => validateSnapshot(read(snapshotFile(root)), root);
const recordFor = (item, plugin, checkedAt) => ({
    ...Object.fromEntries(
        ['id', 'repository', 'path', 'revision', 'fingerprints', 'source_urls'].map((key) => [key, item[key]])
    ),
    fingerprints: structuredClone(plugin.fingerprints),
    status: 'complete',
    checked_at: checkedAt,
    analysis_sha256: analysisDigest(plugin)
});
export function validateSnapshot(value, root = ROOT) {
    if (!check(value)) throw Error(ajv.errorsText(check.errors));
    validateCatalog(value.catalog);
    validatePublication(value.publication);
    startSession(
        {
            id: 'snapshot-discovery',
            checked_at: value.checked_at,
            sources: value.discovery.sources,
            plugins: value.discovery.plugins
        },
        null
    );
    if (value.discovery.complete_baseline && !value.discovery.sources.every((s) => s.complete))
        throw Error('complete discovery baseline requires complete sources');
    if (value.publication.manifest || value.publication.manifests || !value.publication.records)
        throw Error('snapshot cannot depend on manifest');
    const records = value.publication.records;
    if (new Set(records.map((r) => r.id)).size !== records.length) throw Error('duplicate snapshot record');
    if (new Set(Object.values(value.registry)).size !== Object.keys(value.registry).length)
        throw Error('duplicate stable directory');
    for (const plugin of value.catalog.plugins) {
        if (!value.registry[plugin.id]) throw Error(`missing directory: ${plugin.id}`);
        if (!/^data\/plugins\/[a-z0-9][a-z0-9._-]*$/.test(value.registry[plugin.id]))
            throw Error('invalid stable directory');
        for (const evidence of plugin.evidence)
            if (
                evidence.artifact &&
                !value.artifacts[evidence.artifact] &&
                !value.unavailable_artifacts.includes(evidence.artifact)
            )
                throw Error(`snapshot evidence material missing: ${evidence.artifact}`);
    }
    for (const [name, artifact] of Object.entries(value.artifacts)) {
        local(root, name);
        if (hash(artifact.content) !== artifact.sha256) throw Error(`embedded evidence digest differs: ${name}`);
    }
    for (const record of records) {
        if (!value.reports[record.id] || !value.metadata[record.id])
            throw Error(`snapshot report or metadata missing: ${record.id}`);
        validateMetadata(value.metadata[record.id]);
    }
    // Validate content and links against authoritative in-memory reports, not old runs or generated files.
    renderPublication(value.publication, root, value);
    return value;
}
export function bootstrap(root = ROOT) {
    if (existsSync(snapshotFile(root))) throw Error('snapshot already exists');
    const catalog = read(resolve(root, CATALOG));
    const publication = read(resolve(root, PUBLICATION));
    const manifests = [...new Set([...(publication.manifests ?? []), publication.manifest])].map((p) =>
        read(local(root, p))
    );
    const records = new Map();
    for (const manifest of manifests)
        for (const item of manifest.items) records.set(item.id, { item, checked_at: manifest.checked_at });
    const result = {
        schema_version: 1,
        checked_at: manifests.at(-1).checked_at,
        catalog,
        publication: structuredClone(publication),
        registry: read(resolve(root, REGISTRY)),
        discovery: { sources: manifests.at(-1).sources, plugins: [], complete_baseline: false },
        reports: {},
        metadata: {},
        artifacts: {},
        unavailable_artifacts: [],
        limitations: [],
        transaction: null
    };
    result.publication.records = [];
    result.publication.checked_at = result.checked_at;
    delete result.publication.manifest;
    delete result.publication.manifests;
    for (const { item, checked_at } of records.values())
        if (item.status === 'complete') {
            const plugin = catalog.plugins.find((p) => p.id === item.id);
            result.publication.records.push(recordFor(item, plugin, checked_at));
            result.reports[item.id] = readFileSync(
                local(root, `${result.registry[item.id]}/INSIGHT.md`),
                'utf8'
            ).replace(/\[([^\]]+)\]\([^)]*manifests\/[^)]*\)/g, '$1（旧流程记录）');
            result.metadata[item.id] = read(local(root, publication.metadata[item.id]));
        }
    for (const plugin of catalog.plugins)
        for (const evidence of plugin.evidence)
            if (evidence.artifact) {
                const path = local(root, evidence.artifact);
                if (existsSync(path)) {
                    const content = readFileSync(path, 'utf8');
                    result.artifacts[evidence.artifact] = { content, sha256: hash(content) };
                } else result.unavailable_artifacts.push(evidence.artifact);
            }
    result.unavailable_artifacts = [...new Set(result.unavailable_artifacts)];
    if (result.unavailable_artifacts.length)
        result.limitations.push(
            '迁移保留已有分析及证据描述；unavailable_artifacts 中的历史原件当前缺失，未重建、未重新验证，也不作为本轮新证据。'
        );
    result.limitations.push('首次迁移只知道当前研究档案，不拥有历史完整来源成员清单；未入档对象的历史变化为 unknown。');
    result.catalog.runs = [];
    validateSnapshot(result, root);
    atomicWrite(snapshotFile(root), result);
    return result;
}
export function startWork(input, path, limit, root = ROOT) {
    if (existsSync(path)) throw Error('work already exists; resume it');
    const rel = relative(root, resolve(path)).split('\\').join('/');
    if (!/^data\/runs\/\d{4}-\d{2}-\d{2}-\d{2,}\/WORK\.json$/.test(rel))
        throw Error('work must be data/runs/<round>/WORK.json');
    const base = readSnapshot(root);
    if (Date.parse(input.checked_at) <= Date.parse(base.checked_at))
        throw Error('new work cutoff must be later than current snapshot');
    const session = startSession(input, null, limit);
    const known = new Map(
        base.catalog.plugins.map((p) => [
            p.id,
            {
                id: p.id,
                repository: p.repository,
                path: p.path,
                revision: p.fingerprints.code,
                fingerprints: p.fingerprints,
                source_urls: []
            }
        ])
    );
    for (const item of base.discovery.plugins) known.set(item.id, item);
    const incoming = new Set(input.plugins.map((p) => p.id));
    for (const item of session.items) {
        const before = known.get(item.id);
        const changes = [];
        if (!before) changes.push(base.discovery.complete_baseline ? 'added' : 'unknown');
        else {
            if (item.repository !== before.repository || item.path !== before.path) changes.push('moved');
            if (!item.revision || !before.revision) changes.push('unknown');
            else if (item.revision !== before.revision || digest(item.fingerprints) !== digest(before.fingerprints))
                changes.push('content_changed');
            if (
                before.source_urls.length &&
                digest([...item.source_urls].sort()) !== digest([...before.source_urls].sort())
            )
                changes.push('sources_changed');
            if (!changes.length) changes.push('unchanged');
        }
        item.changes = changes;
    }
    for (const before of base.discovery.plugins)
        if (!incoming.has(before.id))
            session.items.push({
                ...before,
                changes: [
                    before.source_urls.length > 0 &&
                    before.source_urls.every((u) => input.sources.some((s) => s.url === u && s.complete))
                        ? 'removed_from_source'
                        : 'unknown'
                ],
                status: 'pending'
            });
    if (limit !== undefined) session.selected_ids = session.items.slice(0, limit).map((p) => p.id);
    session.base_digest = digest(base);
    const work = {
        schema_version: 1,
        base_digest: digest(base),
        session,
        input,
        input_digest: digest(input),
        records: {}
    };
    validateSession(session, root);
    atomicWrite(path, work);
    atomicWrite(resolve(dirname(path), 'SESSION.json'), session);
    return work;
}
function assemble(base, work, root = ROOT) {
    if (work.base_digest !== digest(base) || work.session.base_digest !== work.base_digest)
        throw Error('snapshot baseline changed; replan work explicitly');
    validateWork(work, root);
    const next = structuredClone(base);
    const selected = new Set(selectedItems(work.session).map((p) => p.id));
    const records = new Map(next.publication.records.map((r) => [r.id, r]));
    for (const [id, entry] of Object.entries(work.records)) {
        const item = work.session.items.find((p) => p.id === id);
        if (!selected.has(id) || item?.status !== 'complete') throw Error('only completed selected records can merge');
        const obs = entry.observations;
        validateObservations(obs);
        if (obs.plugins.length !== 1 || obs.plugins[0].id !== id)
            throw Error('observation must contain precisely selected plugin');
        const candidate = planCatalog(next.catalog, obs, 'update').result;
        const plugin = candidate.plugins.find((p) => p.id === id);
        if (
            digest(item.fingerprints) !== digest(obs.plugins[0].fingerprints) ||
            plugin.findings.some(
                (f) => f.status === 'needs_review' || Date.parse(f.reviewed_at) < Date.parse(work.session.checked_at)
            )
        )
            throw Error('fresh full findings and fixed fingerprints required');
        if (
            digest(obs) !== item.checkpoint.observations_digest ||
            digest(entry.report) !== item.checkpoint.report_digest
        )
            throw Error('staged record checkpoint differs');
        next.catalog = candidate;
        next.registry[id] ??= pluginDirectory(plugin, root);
        next.reports[id] = entry.report;
        next.metadata[id] = entry.metadata;
        for (const [name, artifact] of Object.entries(entry.artifacts)) next.artifacts[name] = artifact;
        records.set(id, recordFor(item, plugin, work.session.checked_at));
        for (const field of ['summaries', 'capabilities', 'advice']) next.publication[field][id] = entry[field];
        next.publication.metadata[id] = `${next.registry[id]}/META.json`;
        next.publication.recommendations = next.publication.recommendations.filter((r) => r.plugin_id !== id);
        next.publication.recommendations.push(...entry.recommendations);
    }
    // Dependency invalidation can affect an unselected published record; do not publish obsolete conclusions.
    for (const [id, record] of records) {
        const plugin = next.catalog.plugins.find((p) => p.id === id);
        if (plugin.findings.some((f) => f.status === 'needs_review')) {
            records.delete(id);
            next.publication.recommendations = next.publication.recommendations.filter((r) => r.plugin_id !== id);
        } else if (!work.records[id] && analysisDigest(plugin) !== record.analysis_sha256)
            throw Error('unselected analysis changed unexpectedly');
    }
    // Keep the evidence needed by today's conclusions, rather than accumulating completed rounds.
    const referencedEvidence = new Set(next.catalog.plugins.flatMap((p) => p.findings.flatMap((f) => f.evidence_ids)));
    for (const plugin of next.catalog.plugins) {
        const fresh = work.records[plugin.id]?.observations.plugins[0];
        if (!fresh) continue;
        const freshIds = new Set(fresh.evidence.map((e) => e.id));
        plugin.sources = structuredClone(fresh.sources);
        plugin.evidence = plugin.evidence.filter((e) => freshIds.has(e.id) || referencedEvidence.has(e.id));
    }
    const referencedArtifacts = new Set(
        next.catalog.plugins.flatMap((p) => p.evidence.map((e) => e.artifact).filter(Boolean))
    );
    next.artifacts = Object.fromEntries(
        Object.entries(next.artifacts).filter(([name]) => referencedArtifacts.has(name))
    );
    next.unavailable_artifacts = next.unavailable_artifacts.filter((name) => referencedArtifacts.has(name));
    next.catalog.runs = [];
    next.publication.records = [...records.values()];
    next.checked_at = work.session.checked_at;
    next.publication.checked_at = next.checked_at;
    next.publication.scope = `本轮所选 ${selected.size}，完成 ${Object.keys(work.records).length}，受阻 ${selectedItems(work.session).filter((i) => i.status === 'blocked').length}；当前发布 ${records.size}`;
    const incomingIds = new Set(work.input.plugins.map((p) => p.id));
    const uncertainMissing = base.discovery.plugins.filter(
        (p) =>
            !incomingIds.has(p.id) &&
            (p.source_urls.length === 0 ||
                !p.source_urls.every((url) => work.input.sources.some((s) => s.url === url && s.complete)))
    );
    next.discovery = {
        sources: work.input.sources,
        plugins: [...work.input.plugins, ...uncertainMissing],
        complete_baseline: work.input.sources.every((s) => s.complete) && uncertainMissing.length === 0
    };
    next.transaction = { id: work.session.id, work_digest: digest(work) };
    return validateSnapshot(next, root);
}
export function stageRecord(workPath, id, observationPath, reportPath, displayPath, root = ROOT) {
    const lock = workPath + '.lock';
    const fd = openSync(lock, 'wx', 0o600);
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        return stageRecordUnlocked(workPath, id, observationPath, reportPath, displayPath, root);
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
function stageRecordUnlocked(workPath, id, observationPath, reportPath, displayPath, root = ROOT) {
    const base = readSnapshot(root),
        work = validateWork(read(workPath), root);
    if (work.base_digest !== digest(base)) throw Error('snapshot baseline changed');
    if (work.records[id]) throw Error('record already staged; do not overwrite checkpoint');
    const observations = read(observationPath),
        report = readFileSync(reportPath, 'utf8'),
        display = read(displayPath);
    const expected = ['metadata', 'summaries', 'capabilities', 'advice', 'recommendations'];
    if (Object.keys(display).some((k) => !expected.includes(k)) || expected.some((k) => display[k] === undefined))
        throw Error('display requires metadata, summaries, capabilities, advice and recommendations');
    const plugin = observations.plugins.find((p) => p.id === id);
    if (!plugin || observations.plugins.length !== 1 || observations.errors.length)
        throw Error('stage needs one successful plugin');
    // Reconstruct only the candidate catalog; formal catalog is untouched.
    let catalog = structuredClone(base.catalog);
    for (const entry of Object.values(work.records))
        catalog = planCatalog(catalog, entry.observations, 'update').result;
    catalog = planCatalog(catalog, observations, 'update').result;
    completeItem(
        work.session,
        id,
        relative(root, resolve(observationPath)),
        relative(root, resolve(reportPath)),
        catalog,
        root
    );
    const artifacts = {};
    for (const evidence of plugin.evidence)
        if (evidence.artifact) {
            const content = readFileSync(local(root, evidence.artifact), 'utf8');
            artifacts[evidence.artifact] = { content, sha256: hash(content) };
        }
    work.records[id] = {
        observations,
        report,
        ...display,
        artifacts,
        files: [observationPath, reportPath, displayPath].map((p) => relative(root, resolve(p)))
    };
    assemble(base, work, root);
    atomicWrite(workPath, work);
    atomicWrite(resolve(dirname(workPath), 'SESSION.json'), work.session);
    return work;
}
export function planSnapshot(workPath, root = ROOT) {
    const base = readSnapshot(root),
        work = validateWork(read(workPath), root);
    if (!Object.keys(work.records).length) throw Error('no successful records to merge');
    const result = assemble(base, work, root);
    return {
        plan_version: 1,
        base_digest: digest(base),
        work_path: relative(root, resolve(workPath)),
        work_digest: digest(work),
        result_digest: digest(result),
        result
    };
}
export function applySnapshot(plan, root = ROOT) {
    if (plan?.plan_version !== 1 || digest(plan.result) !== plan.result_digest) throw Error('invalid snapshot plan');
    const file = snapshotFile(root),
        lock = `${file}.lock`;
    const fd = openSync(lock, 'wx', 0o600);
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        const current = readSnapshot(root);
        if (digest(current) === plan.result_digest) return 'already_applied';
        if (digest(current) !== plan.base_digest) throw Error('snapshot baseline changed');
        const work = validateWork(read(local(root, plan.work_path)), root);
        if (digest(work) !== plan.work_digest) throw Error('work changed since planning');
        const rebuilt = assemble(current, work, root);
        if (digest(rebuilt) !== plan.result_digest) throw Error('plan does not match validated staged work');
        atomicWrite(file, rebuilt);
        if (digest(readSnapshot(root)) !== plan.result_digest) throw Error('snapshot readback failed');
        return 'applied';
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
export function renderSnapshot(root = ROOT, checkOnly = false) {
    const snapshot = readSnapshot(root),
        before = digest(snapshot),
        result = renderPublication(snapshot.publication, root, snapshot);
    const outputs = [
        ['README.md', result.readme],
        [snapshot.publication.catalog_page, result.catalog],
        ...result.details.map((d) => [d.path, d.content]),
        ...result.categoryPages.map((d) => [d.path, d.content]),
        [CATALOG, JSON.stringify(snapshot.catalog, null, 2) + '\n'],
        [PUBLICATION, JSON.stringify(snapshot.publication, null, 2) + '\n'],
        [REGISTRY, JSON.stringify(snapshot.registry, null, 2) + '\n'],
        ...Object.entries(snapshot.metadata).map(([id, meta]) => [
            `${snapshot.registry[id]}/META.json`,
            JSON.stringify(meta, null, 2) + '\n'
        ])
    ];
    for (const [path, content] of outputs) {
        const full = local(root, path);
        if (checkOnly) {
            if (!existsSync(full) || readFileSync(full, 'utf8') !== content)
                throw Error(`generated snapshot output differs: ${path}`);
        } else {
            mkdirSync(dirname(full), { recursive: true });
            writeFileSync(full, content);
        }
    }
    if (digest(readSnapshot(root)) !== before) throw Error('snapshot changed while rendering; rerun generation');
    console.log(checkOnly ? 'Snapshot outputs match' : 'Snapshot outputs generated');
}
export function cleanWork(path, root = ROOT, apply = false) {
    const rel = relative(root, resolve(path)).split('\\').join('/');
    if (!/^data\/runs\/\d{4}-\d{2}-\d{2}-\d{2,}\/WORK\.json$/.test(rel)) throw Error('invalid cleanup work path');
    if (existsSync(path + '.lock')) throw Error('active work lock; cleanup refused');
    const work = read(path),
        snapshot = readSnapshot(root);
    if (snapshot.transaction?.id !== work.session.id || snapshot.transaction.work_digest !== digest(work))
        throw Error('work not confirmed merged');
    if (selectedItems(work.session).some((p) => p.status !== 'complete'))
        throw Error('incomplete work must be retained');
    renderSnapshot(root, true);
    const folder = dirname(resolve(path));
    const names = new Set([path, resolve(folder, 'SESSION.json'), resolve(folder, 'INPUT.json')]);
    for (const record of Object.values(work.records)) {
        for (const file of record.files ?? []) names.add(local(root, file));
        for (const file of Object.keys(record.artifacts)) names.add(local(root, file));
    }
    const files = [...names].map((p) => resolve(p)).filter((p) => p.startsWith(folder + '/') && existsSync(p));
    console.log(
        JSON.stringify({
            remove: files.map((p) => relative(root, p)),
            apply,
            note: 'unknown files and failure material are retained'
        })
    );
    if (apply) for (const file of files) unlinkSync(file);
}
export async function main(args = process.argv.slice(2)) {
    const [command, ...rest] = args;
    const { values: v } = parseArgs({
        args: rest,
        options: Object.fromEntries(
            ['input', 'work', 'limit', 'plugin', 'observations', 'report', 'display', 'out', 'plan']
                .map((k) => [k, { type: 'string' }])
                .concat([['apply', { type: 'boolean', default: false }]])
        )
    });
    const need = (k) => {
        if (!v[k]) throw Error(`--${k} required`);
        return resolve(v[k]);
    };
    if (command === 'bootstrap') {
        bootstrap();
        renderSnapshot();
    } else if (command === 'start') {
        const n = v.limit === undefined ? undefined : Number(v.limit);
        const w = startWork(read(need('input')), need('work'), n);
        console.log(JSON.stringify({ selected: selectedItems(w.session).length, listed: w.session.items.length }));
    } else if (command === 'next') {
        const w = read(need('work'));
        validateSession(w.session);
        console.log(JSON.stringify(selectedItems(w.session).find((p) => p.status === 'pending') ?? null));
    } else if (command === 'stage') {
        if (!v.plugin) throw Error('--plugin required');
        stageRecord(need('work'), v.plugin, need('observations'), need('report'), need('display'));
        console.log('Record staged; formal snapshot unchanged');
    } else if (command === 'block') {
        if (!v.plugin) throw Error('--plugin required');
        const path = need('work'),
            lock = path + '.lock',
            fd = openSync(lock, 'wx', 0o600);
        try {
            writeFileSync(fd, JSON.stringify({ pid: process.pid }));
            const w = validateWork(read(path));
            const p = selectedItems(w.session).find((i) => i.id === v.plugin);
            if (!p || p.status !== 'pending') throw Error('only pending selected item can be blocked');
            p.status = 'blocked';
            p.reason = read(need('input')).reason;
            validateSession(w.session);
            atomicWrite(need('work'), w);
            atomicWrite(resolve(dirname(need('work')), 'SESSION.json'), w.session);
        } finally {
            closeSync(fd);
            unlinkSync(lock);
        }
    } else if (command === 'plan') {
        atomicWrite(need('out'), planSnapshot(need('work')));
    } else if (command === 'apply') {
        console.log(applySnapshot(read(need('plan'))));
        renderSnapshot();
    } else if (command === 'render') renderSnapshot();
    else if (command === 'validate') {
        readSnapshot(ROOT);
        renderSnapshot(ROOT, true);
    } else if (command === 'clean') cleanWork(need('work'), ROOT, v.apply);
    else throw Error('Usage: snapshot bootstrap|start|next|stage|block|plan|apply|render|validate|clean');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
    try {
        await main();
    } catch (e) {
        console.error(e.stack);
        process.exitCode = 1;
    }
