import { snapshotSelection, incrementalSelection } from './research-selection.mjs';
import { subsetHeat } from '../../_shared/scripts/heat-score.mjs';
import { heatFromCaches } from '../../_shared/scripts/research-metrics.mjs';
import { validateDisplay } from '../../_shared/scripts/publication-validation.mjs';
import { readWork, saveWork } from '../../_shared/scripts/work-storage.mjs';
import { existsSync, readFileSync, mkdirSync, writeFileSync, openSync, closeSync, unlinkSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { ROOT, read, digest, plan as planCatalog } from '../../_shared/scripts/plugin-data.mjs';
import { startSession, validateSession, completeItem, selectedItems } from './session-state.mjs';

import { readSnapshot, validateWork, local, hash } from './snapshot-state.mjs';
import { assemble } from './snapshot-merge.mjs';
export function startWork(input, path, limit = 40, root = ROOT, retryIds = [], heat = null) {
    mkdirSync(dirname(path), { recursive: true });
    const lock = path + '.lock',
        fd = openSync(lock, 'wx', 0o600);
    try {
        if (existsSync(resolve(dirname(path), 'SESSION.json.lock'))) throw Error('active session lock');
        return startWorkUnlocked(input, path, limit, root, retryIds, heat);
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
function startWorkUnlocked(input, path, limit, root, retryIds, heat) {
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
                source_urls: base.discovery.sources
                    .filter((source) =>
                        p.sources.some(
                            (entry) =>
                                entry.membership && (entry.url === source.url || entry.url.startsWith(source.url + '/'))
                        )
                    )
                    .map((source) => source.url)
            }
        ])
    );
    for (const item of base.discovery.plugins) known.set(item.id, item);
    const discoverySources = new Map(base.discovery.plugins.map((item) => [item.id, item.source_urls]));
    // Compare completed research against its own version, even if discovery was
    // refreshed in an intervening round without researching this object.
    for (const plugin of base.catalog.plugins)
        if (base.reports[plugin.id])
            known.set(plugin.id, {
                ...known.get(plugin.id),
                repository: plugin.repository,
                path: plugin.path,
                revision: plugin.fingerprints.code ?? null,
                fingerprints: plugin.fingerprints
            });
    for (const record of base.publication.records) known.set(record.id, record);
    const incoming = new Set(input.plugins.map((p) => p.id));
    for (const item of session.items) {
        const before = known.get(item.id);
        const changes = [];
        if (!before) changes.push(base.discovery.complete_baseline ? 'added' : 'unknown');
        else {
            if (item.repository !== before.repository || item.path !== before.path) changes.push('moved');
            if (!item.revision || !before.revision) changes.push('unknown');
            else if (
                item.revision !== before.revision ||
                Object.entries(item.fingerprints).some(([area, value]) => before.fingerprints[area] !== value)
            )
                changes.push('content_changed');
            if (
                before.source_urls.length &&
                digest([...item.source_urls].sort()) !== digest([...before.source_urls].sort())
            )
                changes.push('sources_changed');
            const missingSources = (discoverySources.get(item.id) ?? []).filter(
                (url) => !item.source_urls.includes(url)
            );
            if (missingSources.some((url) => !input.sources.some((source) => source.url === url && source.complete))) {
                if (!changes.includes('unknown')) changes.push('unknown');
            } else if (missingSources.length && !changes.includes('sources_changed')) changes.push('sources_changed');
            if (!changes.length) changes.push('unchanged');
        }
        item.changes = changes;
    }
    for (const before of known.values()) {
        const sourceUrls = discoverySources.get(before.id) ?? before.source_urls;
        if (!incoming.has(before.id) && sourceUrls.length)
            session.items.push({
                ...Object.fromEntries(
                    ['id', 'repository', 'path', 'revision', 'fingerprints', 'source_urls'].map((key) => [
                        key,
                        before[key]
                    ])
                ),
                source_urls: sourceUrls,
                changes: [
                    sourceUrls.every((u) => input.sources.some((s) => s.url === u && s.complete))
                        ? 'removed_from_source'
                        : 'unknown'
                ],
                status: 'pending'
            });
    }
    for (const item of session.items)
        for (const url of item.source_urls)
            if (!session.sources.some((source) => source.url === url))
                session.sources.push({ url, revision: null, complete: false });
    if (heat && heat.base_digest !== digest(base)) throw Error('heat baseline changed; capture heat again');
    const fixedHeat = subsetHeat(
        heat ?? { ...heatFromCaches(session.items, base.metadata, session.checked_at), base_digest: digest(base) },
        session.items
    );
    session.selection = snapshotSelection(base, session.items, retryIds, true, session.checked_at, fixedHeat);
    session.selected_ids = incrementalSelection(session);
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
    saveWork(path, work, true);
    return work;
}
export function stageRecord(workPath, id, observationPath, reportPath, displayPath, root = ROOT) {
    const lock = workPath + '.lock';
    const fd = openSync(lock, 'wx', 0o600);
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        if (existsSync(resolve(dirname(workPath), 'SESSION.json.lock'))) throw Error('active session lock');
        return stageRecordUnlocked(workPath, id, observationPath, reportPath, displayPath, root);
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
export function stageRecords(workPath, entries, root = ROOT, verifyRecord = null) {
    if (!Array.isArray(entries) || !entries.length) throw Error('stage batch must be nonempty');
    const lock = workPath + '.lock',
        fd = openSync(lock, 'wx', 0o600);
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        if (existsSync(resolve(dirname(workPath), 'SESSION.json.lock'))) throw Error('active session lock');
        const base = readSnapshot(root),
            work = validateWork(readWork(workPath), root);
        const context = { base, work, catalog: structuredClone(base.catalog) };
        for (const entry of Object.values(work.records))
            context.catalog = planCatalog(context.catalog, entry.observations, 'update').result;
        for (const entry of entries) {
            if (!entry.id || !entry.observations || !entry.report || !entry.display)
                throw Error('batch entry requires id, observations, report and display');
            stageRecordUnlocked(workPath, entry.id, entry.observations, entry.report, entry.display, root, context);
            // Acceptance callers bind the exact in-memory payload read under this lock,
            // rather than trusting a preflight of files that a worker may still change.
            if (verifyRecord) verifyRecord(entry.id, work.records[entry.id], work);
        }
        assemble(base, work, root);
        if (digest(readSnapshot(root)) !== work.base_digest) throw Error('snapshot baseline changed');
        saveWork(workPath, work);
        return work;
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
function stageRecordUnlocked(workPath, id, observationPath, reportPath, displayPath, root = ROOT, context = null) {
    const base = context?.base ?? readSnapshot(root),
        work = context?.work ?? validateWork(readWork(workPath), root);
    if (work.base_digest !== digest(base)) throw Error('snapshot baseline changed');
    if (work.records[id]) throw Error('record already staged; do not overwrite checkpoint');
    const observations = read(observationPath),
        report = readFileSync(reportPath, 'utf8'),
        display = read(displayPath);
    validateDisplay(display);
    const plugin = observations.plugins.find((p) => p.id === id);
    if (!plugin || observations.plugins.length !== 1 || observations.errors.length)
        throw Error('stage needs one successful plugin');
    if (
        !plugin.innovation_scores ||
        plugin.innovation_scores.status !== 'current' ||
        plugin.innovation_scores.revision !== work.session.items.find((item) => item.id === id)?.revision ||
        Date.parse(plugin.innovation_scores.reviewed_at) < Date.parse(work.session.checked_at)
    )
        throw Error('new research stage requires reviewed innovation scores for both axes');
    const recommendation = plugin.recommendation;
    if (
        !recommendation ||
        recommendation.decision === 'unassessed' ||
        recommendation.status !== 'current' ||
        recommendation.revision !== work.session.items.find((item) => item.id === id)?.revision ||
        Date.parse(recommendation.reviewed_at) < Date.parse(work.session.checked_at)
    )
        throw Error('new research stage requires a current scored recommendation and reason');
    // Reconstruct only the candidate catalog; formal catalog is untouched.
    let catalog = context?.catalog ?? structuredClone(base.catalog);
    if (!context)
        for (const entry of Object.values(work.records))
            catalog = planCatalog(catalog, entry.observations, 'update').result;
    catalog = planCatalog(catalog, observations, 'update').result;
    delete work.session.items.find((item) => item.id === id).block;
    const artifacts = {};
    for (const evidence of plugin.evidence)
        if (evidence.artifact) {
            const name = evidence.artifact;
            const saved = base.artifacts[name];
            if (saved) {
                const file = local(root, name);
                if (existsSync(file) && hash(readFileSync(file, 'utf8')) !== saved.sha256)
                    throw Error(`immutable evidence label reused with different content: ${name}`);
                artifacts[name] = structuredClone(saved);
            } else {
                const content = readFileSync(local(root, name), 'utf8');
                artifacts[name] = { content, sha256: hash(content) };
            }
        }
    const embedded = Object.assign({}, ...Object.values(work.records).map((r) => r.artifacts), artifacts);
    completeItem(
        work.session,
        id,
        relative(root, resolve(observationPath)),
        relative(root, resolve(reportPath)),
        catalog,
        root,
        embedded
    );
    work.records[id] = {
        observations,
        report,
        ...display,
        artifacts,
        files: [observationPath, reportPath, displayPath].map((p) => relative(root, resolve(p)))
    };
    if (context) context.catalog = catalog;
    else {
        assemble(base, work, root);
        saveWork(workPath, work);
    }
    return work;
}
export function reopenRecord(workPath, input, root = ROOT, apply = false) {
    if (!input?.id || !/^[a-f0-9]{64}$/.test(input.record_digest) || !input.reason?.trim())
        throw Error('reopen requires id, record_digest and reason');
    const lock = workPath + '.lock',
        fd = openSync(lock, 'wx', 0o600);
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        if (existsSync(resolve(dirname(workPath), 'SESSION.json.lock'))) throw Error('active session lock');
        const work = validateWork(readWork(workPath), root);
        if (work.base_digest !== digest(readSnapshot(root))) throw Error('snapshot baseline changed');
        const item = selectedItems(work.session).find((p) => p.id === input.id);
        const record = work.records[input.id];
        if (item?.status !== 'complete' || !record) throw Error('reopen requires a staged complete item');
        if (digest(record) !== input.record_digest) throw Error('staged record changed');
        const backup = resolve(dirname(workPath), 'reopened', input.record_digest + '.json');
        const saved = { id: input.id, reason: input.reason, record, item: structuredClone(item) };
        delete work.records[input.id];
        item.status = 'pending';
        delete item.checkpoint;
        validateWork(work, root);
        if (apply) {
            mkdirSync(dirname(backup), { recursive: true });
            if (existsSync(backup)) {
                if (digest(read(backup)) !== digest(saved)) throw Error('reopen backup already differs');
            } else writeFileSync(backup, JSON.stringify(saved, null, 2) + '\n', { flag: 'wx' });
            if (digest(readSnapshot(root)) !== work.base_digest) throw Error('snapshot baseline changed');
            saveWork(workPath, work);
        }
        return { apply, id: input.id, status: apply ? 'pending' : 'would_reopen', backup: relative(root, backup) };
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
export function changeBlockRecord(workPath, id, input, root = ROOT) {
    return changeBlockRecords(workPath, [{ id, input }], root);
}
export function changeBlockRecords(workPath, entries, root = ROOT) {
    if (!Array.isArray(entries) || !entries.length) throw Error('block batch must be nonempty');
    const lock = workPath + '.lock',
        fd = openSync(lock, 'wx', 0o600);
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        if (existsSync(resolve(dirname(workPath), 'SESSION.json.lock'))) throw Error('active session lock');
        const work = validateWork(readWork(workPath), root);
        if (work.base_digest !== digest(readSnapshot(root))) throw Error('snapshot baseline changed');
        for (const { id, input } of entries) {
            const item = selectedItems(work.session).find((p) => p.id === id);
            if (input === null) {
                if (!item || item.status !== 'blocked') throw Error('only blocked selected item can be retried');
                item.status = 'pending';
                delete item.reason;
                delete item.block;
            } else {
                if (!item || item.status !== 'pending') throw Error('only pending selected item can be blocked');
                if (
                    (input.plugin_id !== undefined && input.plugin_id !== item.id) ||
                    (input.revision !== undefined && input.revision !== item.revision)
                )
                    throw Error('block input identity or revision differs');
                item.status = 'blocked';
                item.reason = input.reason;
                item.block = {
                    plugin_id: item.id,
                    revision: item.revision,
                    reason_code: input.reason_code,
                    reason: input.reason,
                    details: input,
                    blocked_at: new Date().toISOString(),
                    run_id: work.session.id
                };
            }
        }
        validateWork(work, root);
        saveWork(workPath, work);
        return work;
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
