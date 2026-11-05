import { openSync, closeSync, unlinkSync, writeFileSync } from 'node:fs';
import { ROOT, digest, analysisDigest } from '../../_shared/scripts/plugin-data.mjs';
import { writeSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { snapshotFile, readSnapshot, validateSnapshot, hash, local } from './snapshot-state.mjs';

// Privacy maintenance only: quoted question evidence must remain byte-identical.
export function redactArtifact(input, root = ROOT, apply = false) {
    const file = snapshotFile(root);
    const lock = file + '.lock';
    const fd = openSync(lock, 'wx', 0o600);
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        const current = readSnapshot(root);
        if (digest(current) !== input.base_digest) throw Error('snapshot baseline changed');
        const next = structuredClone(current);
        const plugin = next.catalog.plugins.find((p) => p.id === input.plugin_id);
        const artifact = next.artifacts[input.artifact];
        if (!plugin || !artifact || !plugin.evidence.some((e) => e.artifact === input.artifact))
            throw Error('artifact must belong to the selected component');
        local(root, input.new_artifact);
        if (!input.new_artifact.endsWith('/REVIEWED-SOURCE.json') || next.artifacts[input.new_artifact])
            throw Error('a new REVIEWED-SOURCE artifact identity is required');
        if (
            next.catalog.plugins.some(
                (p) => p.id !== plugin.id && p.evidence.some((e) => e.artifact === input.artifact)
            )
        )
            throw Error('shared evidence requires a separate review');
        if (!Array.isArray(input.redactions) || !input.redactions.length) throw Error('redactions required');
        const material = JSON.parse(artifact.content);
        const redactions = [];
        const changedLines = new Set();
        for (const entry of input.redactions) {
            const source = material.files.find((f) => f.path === entry.path);
            if (!source || !Number.isSafeInteger(entry.line) || entry.line < 1 || !entry.reason?.trim())
                throw Error('invalid redaction location or reason');
            const key = `${entry.path}:${entry.line}`;
            if (changedLines.has(key)) throw Error('duplicate redaction line');
            changedLines.add(key);
            if (
                material.research_questions.questions.some((q) =>
                    q.evidence.some(
                        (e) => e.source_path === entry.path && entry.line >= e.line_start && entry.line <= e.line_end
                    )
                )
            )
                throw Error('cannot redact quoted evidence; revise the research first');
            const lines = source.content.split('\n');
            if (entry.line > lines.length || !lines[entry.line - 1].trim()) throw Error('invalid source line');
            const original = current.artifacts[input.artifact];
            const originalSource = JSON.parse(original.content).files.find((f) => f.path === entry.path);
            redactions.push({
                path: entry.path,
                line: entry.line,
                reason: entry.reason,
                original_content_sha256:
                    material.redactions?.find((r) => r.path === entry.path)?.original_content_sha256 ??
                    hash(originalSource.content)
            });
            lines[entry.line - 1] = '// [REDACTED: credential omitted; see redactions metadata]';
            source.content = lines.join('\n');
        }
        material.redactions = [...(material.redactions ?? []), ...redactions];
        const content = JSON.stringify(material, null, 2) + '\n';
        next.artifacts[input.new_artifact] = { ...artifact, content, sha256: hash(content) };
        const evidenceIds = new Map();
        for (const evidence of plugin.evidence) {
            if (evidence.artifact !== input.artifact) continue;
            const oldId = evidence.id;
            evidence.id = `${oldId}-redacted-${hash(content).slice(0, 12)}`;
            evidenceIds.set(oldId, evidence.id);
            evidence.artifact = input.new_artifact;
        }
        for (const p of next.catalog.plugins) {
            const claims = [
                ...p.findings,
                p.recommendation,
                p.innovation_scores?.technical,
                p.innovation_scores?.business
            ].filter(Boolean);
            for (const claim of claims) claim.evidence_ids = claim.evidence_ids.map((id) => evidenceIds.get(id) ?? id);
            const record = next.publication.records.find((r) => r.id === p.id);
            if (record) record.analysis_sha256 = analysisDigest(p);
        }
        delete next.artifacts[input.artifact];
        validateSnapshot(next, root);
        if (apply) {
            writeSnapshotStorage(file, next);
            if (digest(readSnapshot(root)) !== digest(next)) throw Error('redaction readback failed');
        }
        return { apply, plugin_id: plugin.id, redactions, result_digest: digest(next) };
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
