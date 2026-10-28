import { readSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { resolve, relative, isAbsolute } from 'node:path';
import { createHash } from 'node:crypto';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { ROOT, read, digest, analysisDigest, validate as validateCatalog } from '../../_shared/scripts/plugin-data.mjs';
import { validatePublication } from './publication-data.mjs';
import { startSession, validateSession, selectedItems } from './session-state.mjs';
import { renderPublication } from './render-research.mjs';
import { validateMetadata } from '../../_shared/scripts/metadata-validation.mjs';
import { validateResearchQuestionArtifact } from '../../dsh-plugin-insight/scripts/research-questions.mjs';

export const SNAPSHOT = 'data/catalog/index.jsonl';
const hash = (text) => createHash('sha256').update(text).digest('hex');
const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);
ajv.addSchema(read(resolve(ROOT, '.agents/skills/_shared/schemas/research-block.schema.json')));
const check = ajv.compile(read(resolve(ROOT, '.agents/skills/_shared/schemas/snapshot.schema.json')));
const workCheck = ajv.compile(read(resolve(ROOT, '.agents/skills/_shared/schemas/snapshot-work.schema.json')));
export const validateWork = (work, root = ROOT) => {
    if (!workCheck(work)) throw Error(ajv.errorsText(workCheck.errors));
    validateSession(work.session, root, Object.assign({}, ...Object.values(work.records).map((r) => r.artifacts)));
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
    for (const item of selectedItems(work.session))
        if (item.status === 'blocked' && work.session.selection?.suppressed_ids !== undefined && !item.block)
            throw Error('blocked item requires durable reason details');
    return work;
};
const local = (root, name) => {
    const full = resolve(root, name);
    if (isAbsolute(name) || relative(root, full).startsWith('..')) throw Error(`path outside project: ${name}`);
    return full;
};
const snapshotFile = (root) => resolve(root, SNAPSHOT);
export const readSnapshot = (root = ROOT) => validateSnapshot(readSnapshotStorage(snapshotFile(root)), root);
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
    for (const [id, block] of Object.entries(value.research_blocks ?? {}))
        if (id !== block.plugin_id) throw Error('invalid research block identity');
    validateCatalog(value.catalog);
    for (const [id, document] of Object.entries(value.retained_documents ?? {})) {
        if (
            document.path !== `${value.registry[id]}/INSIGHT.md` ||
            hash(document.content) !== document.sha256 ||
            value.publication.records.some((r) => r.id === id)
        )
            throw Error('invalid retained publication');
    }
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
        if (name.endsWith('/REVIEWED-SOURCE.json')) validateResearchQuestionArtifact(JSON.parse(artifact.content));
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

export { local, hash, recordFor, snapshotFile };
