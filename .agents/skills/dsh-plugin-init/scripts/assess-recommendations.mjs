import { writeSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { assembleRecommendation, unassessedRecommendation } from '../../_shared/scripts/research-scoring.mjs';
import { writeFileSync, openSync, closeSync, unlinkSync } from 'node:fs';
import { ROOT, digest, analysisDigest } from '../../_shared/scripts/plugin-data.mjs';
import { snapshotFile, readSnapshot, validateSnapshot } from './snapshot-state.mjs';
export function assessRecommendations(input, root = ROOT, apply = false) {
    const file = snapshotFile(root),
        lock = file + '.lock';
    const fd = openSync(lock, 'wx', 0o600);
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        const base = readSnapshot(root);
        if (
            !input ||
            Object.keys(input).sort().join(',') !== 'assessments,base_digest,reviewed_at' ||
            !input.assessments ||
            typeof input.assessments !== 'object' ||
            Array.isArray(input.assessments) ||
            !Number.isFinite(Date.parse(input.reviewed_at))
        )
            throw Error('invalid recommendation assessment input');
        if (input.base_digest !== digest(base)) throw Error('recommendation assessment baseline changed');
        const next = structuredClone(base);
        const published = new Map(next.publication.records.map((r) => [r.id, r]));
        const plugins = new Map(next.catalog.plugins.map((p) => [p.id, p]));
        for (const [id, authored] of Object.entries(input.assessments)) {
            const plugin = plugins.get(id),
                record = published.get(id);
            // Retained, unpublished research may be assessed conservatively without restoring publication.
            // A missing report or obsolete version cannot be promoted into a current trial/install candidate.
            const dormant = !record;
            if (
                !plugin ||
                !authored ||
                (record && authored.revision !== record.revision) ||
                (dormant && !['observe', 'not_recommended'].includes(authored.decision)) ||
                Date.parse(input.reviewed_at) < Date.parse(record?.checked_at ?? plugin.last_checked_at)
            )
                throw Error(
                    `assessment requires matching retained research; unpublished items allow only observe/not_recommended: ${id}`
                );
            const { revision, ...assessment } = authored;
            const evidenceIds = plugin.evidence
                .filter(
                    (e) =>
                        e.revision === revision &&
                        ['source_inspection', 'local_test', 'host_acceptance'].includes(e.kind)
                )
                .map((e) => e.id);
            plugin.recommendation = assembleRecommendation(
                assessment,
                plugin,
                revision,
                input.reviewed_at,
                evidenceIds
            );
            if (dormant) plugin.recommendation.status = 'needs_review';
        }
        for (const plugin of next.catalog.plugins) plugin.recommendation ??= unassessedRecommendation();
        for (const record of next.publication.records) record.analysis_sha256 = analysisDigest(plugins.get(record.id));
        delete next.publication.recommendations;
        validateSnapshot(next, root);
        const counts = {};
        for (const p of next.catalog.plugins)
            counts[p.recommendation.decision] = (counts[p.recommendation.decision] ?? 0) + 1;
        if (apply) {
            writeSnapshotStorage(file, next);
            if (digest(readSnapshot(root)) !== digest(next)) throw Error('recommendation snapshot readback failed');
        }
        return { apply, counts, assessed: Object.keys(input.assessments).length, result_digest: digest(next) };
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
