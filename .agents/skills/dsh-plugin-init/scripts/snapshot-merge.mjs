import { snapshotSelection } from './research-selection.mjs';
import { normalizeCatalogSnapshot, writeSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { readWork } from '../../_shared/scripts/work-storage.mjs';
import { writeFileSync, openSync, closeSync, unlinkSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import {
    ROOT,
    digest,
    analysisDigest,
    validateObservations,
    plan as planCatalog
} from '../../_shared/scripts/plugin-data.mjs';
import { pluginDirectory } from '../../_shared/scripts/data-paths.mjs';
import { selectedItems } from './session-state.mjs';
import { validateWork, recordFor, validateSnapshot, readSnapshot, snapshotFile, local } from './snapshot-state.mjs';
function assemble(base, work, root = ROOT) {
    if (work.base_digest !== digest(base) || work.session.base_digest !== work.base_digest)
        throw Error('snapshot baseline changed; replan work explicitly');
    validateWork(work, root);
    const selection = work.session.selection;
    const expectedSelection = snapshotSelection(
        base,
        selection?.suppressed_ids === undefined ? null : work.session.items,
        selection?.retry_ids ?? [],
        selection?.metadata_only_ids !== undefined,
        selection?.cooldown_ids !== undefined ? work.session.checked_at : null,
        selection?.heat ?? null
    );
    if (selection && digest(selection) !== digest(expectedSelection))
        throw Error('incremental selection baseline differs from snapshot');
    const next = structuredClone(base);
    for (const item of selectedItems(work.session))
        if (item.block) (next.research_blocks ??= {})[item.id] = structuredClone(item.block);
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
        if (next.research_blocks) delete next.research_blocks[id];
        next.catalog = candidate;
        next.registry[id] ??= pluginDirectory(plugin, root);
        next.reports[id] = entry.report;
        if (next.retained_documents) delete next.retained_documents[id];
        next.metadata[id] = entry.metadata;
        for (const [name, artifact] of Object.entries(entry.artifacts)) next.artifacts[name] = artifact;
        records.set(id, recordFor(item, plugin, work.session.checked_at));
        for (const field of ['summaries', 'capabilities', 'advice']) next.publication[field][id] = entry[field];
        next.publication.metadata[id] = `data/catalog/${next.registry[id].split('/').at(-1)}/meta.json`;
    }
    // Dependency invalidation can affect an unselected published record; do not publish obsolete conclusions.
    for (const [id, record] of records) {
        const plugin = next.catalog.plugins.find((p) => p.id === id);
        if (
            plugin.findings.some((f) => f.status === 'needs_review') ||
            plugin.innovation_scores?.status === 'needs_review'
        ) {
            records.delete(id);
        } else if (!work.records[id] && analysisDigest(plugin) !== record.analysis_sha256) {
            if (plugin.recommendation?.status === 'needs_review') record.analysis_sha256 = analysisDigest(plugin);
            else throw Error('unselected analysis changed unexpectedly');
        }
    }
    // Keep the evidence needed by today's conclusions, rather than accumulating completed rounds.
    const referencedEvidence = new Set(
        next.catalog.plugins.flatMap((p) => [
            ...p.findings.flatMap((f) => f.evidence_ids),
            ...(p.innovation_scores?.technical.evidence_ids ?? []),
            ...(p.innovation_scores?.business.evidence_ids ?? []),
            ...(p.recommendation?.evidence_ids ?? [])
        ])
    );
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
    delete next.publication.recommendations;
    next.checked_at = work.session.checked_at;
    next.publication.checked_at = next.checked_at;
    next.publication.scope = `本轮所选 ${selected.size}，完成 ${Object.keys(work.records).length}，受阻 ${selectedItems(work.session).filter((i) => i.status === 'blocked').length}；已知同版本受阻跳过 ${work.session.selection?.suppressed_ids?.length ?? 0}；频繁更新窗口内跳过 ${work.session.selection?.cooldown_ids?.filter((id) => !selected.has(id) && !work.session.selection?.suppressed_ids?.includes(id)).length ?? 0}；当前发布 ${records.size}`;
    // Directory scans remain exclusively in this round; compare future rounds with completed research.
    next.discovery.sources = structuredClone(work.input.sources);
    next.transaction = { id: work.session.id, work_digest: digest(work) };
    return validateSnapshot(normalizeCatalogSnapshot(next), root);
}
export function assertMergeReady(work) {
    if (selectedItems(work.session).some((item) => item.status === 'pending'))
        throw Error('selected pending items must be completed or blocked before merging');
}
export function planSnapshot(workPath, root = ROOT) {
    const base = readSnapshot(root),
        work = validateWork(readWork(workPath), root);
    if (
        selectedItems(work.session).length &&
        !Object.keys(work.records).length &&
        !selectedItems(work.session).some((item) => item.block)
    )
        throw Error('no successful records to merge');
    assertMergeReady(work);
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
        const work = validateWork(readWork(local(root, plan.work_path)), root);
        if (digest(work) !== plan.work_digest) throw Error('work changed since planning');
        assertMergeReady(work);
        const rebuilt = assemble(current, work, root);
        if (digest(rebuilt) !== plan.result_digest) throw Error('plan does not match validated staged work');
        writeSnapshotStorage(file, rebuilt);
        if (digest(readSnapshot(root)) !== plan.result_digest) throw Error('snapshot readback failed');
        return 'applied';
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}

export { assemble };
