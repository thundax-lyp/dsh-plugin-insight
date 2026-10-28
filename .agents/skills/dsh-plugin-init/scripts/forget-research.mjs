import { writeSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { writeFileSync, openSync, closeSync, unlinkSync } from 'node:fs';
import { ROOT, digest } from '../../_shared/scripts/plugin-data.mjs';
import { snapshotFile, readSnapshot, validateSnapshot } from './snapshot-state.mjs';
export function forgetResearch(input, root = ROOT, apply = false) {
    if (!Array.isArray(input.plugin_ids) || !input.plugin_ids.length) throw Error('plugin_ids required');
    const file = snapshotFile(root),
        lock = file + '.lock',
        fd = openSync(lock, 'wx', 0o600);
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        const current = readSnapshot(root);
        if (digest(current) !== input.base_digest) throw Error('snapshot baseline changed');
        const ids = new Set(input.plugin_ids),
            next = structuredClone(current);
        if (
            ids.size !== input.plugin_ids.length ||
            [...ids].some((id) => !current.catalog.plugins.some((p) => p.id === id))
        )
            throw Error('duplicate or unknown research identity');
        const directories = [...ids].map((id) => current.registry[id]).filter(Boolean);
        const removedFindings = [];
        const unpublishedIds = new Set();
        next.catalog.plugins = next.catalog.plugins.filter((p) => !ids.has(p.id));
        for (const plugin of next.catalog.plugins) {
            plugin.findings = plugin.findings.filter((f) => {
                if (!f.dependencies.some((d) => ids.has(d.plugin_id))) return true;
                removedFindings.push({ plugin_id: plugin.id, finding_id: f.id });
                unpublishedIds.add(plugin.id);
                return false;
            });
        }
        for (const name of ['registry', 'reports', 'metadata', 'research_blocks'])
            for (const id of ids) delete next[name]?.[id];
        // The old report still contains the removed conclusions; require a fresh review before publishing it.
        next.publication.records = next.publication.records.filter((r) => !ids.has(r.id) && !unpublishedIds.has(r.id));
        for (const name of ['metadata', 'summaries', 'capabilities', 'advice'])
            for (const id of ids) delete next.publication[name][id];
        delete next.publication.recommendations;
        next.discovery.plugins = next.discovery.plugins.filter((p) => !ids.has(p.id));
        if (next.retained_documents) for (const id of ids) delete next.retained_documents[id];
        next.discovery.complete_baseline = false;
        const artifacts = new Set(
            next.catalog.plugins.flatMap((p) => p.evidence.map((e) => e.artifact).filter(Boolean))
        );
        next.artifacts = Object.fromEntries(Object.entries(next.artifacts).filter(([name]) => artifacts.has(name)));
        next.unavailable_artifacts = next.unavailable_artifacts.filter((name) => artifacts.has(name));
        next.publication.scope = `当前发布 ${next.publication.records.length}；按用户要求移除未完成研究 ${ids.size}`;
        validateSnapshot(next, root);
        if (apply) {
            writeSnapshotStorage(file, next);
            if (digest(readSnapshot(root)) !== digest(next)) throw Error('snapshot readback failed');
        }
        return {
            apply,
            removed: ids.size,
            directories,
            removed_findings: removedFindings,
            unpublished_ids: [...unpublishedIds],
            result_digest: digest(next)
        };
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
