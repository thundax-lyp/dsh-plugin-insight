import { validateHeat } from '../../_shared/scripts/heat-score.mjs';
import { incrementalSelection } from './research-selection.mjs';
import { readWork } from '../../_shared/scripts/work-storage.mjs';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative, isAbsolute } from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import {
    ROOT,
    read,
    digest,
    validate as validateCatalog,
    validateObservations
} from '../../_shared/scripts/plugin-data.mjs';

const ajv = new Ajv({ allErrors: true, strict: true });
export { incrementalSelection } from './research-selection.mjs';
addFormats(ajv);
ajv.addSchema(read(resolve(ROOT, '.agents/skills/_shared/schemas/research-block.schema.json')));
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
export function validateSession(session, root = ROOT, embeddedArtifacts = null) {
    // Completed WORK owns its embedded evidence; historical artifact names are labels.
    let materials = embeddedArtifacts;
    const requireEvidence = (name) => {
        if (materials === null) {
            const workPath = resolve(root, 'data/runs', session.id, 'WORK.json');
            materials = existsSync(workPath)
                ? Object.assign({}, ...Object.values(readWork(workPath).records).map((r) => r.artifacts))
                : {};
        }
        if (Object.hasOwn(materials, name)) {
            const value = materials[name];
            if (typeof value?.content !== 'string' || sha256(value.content) !== value.sha256)
                throw Error(`embedded evidence checksum differs: ${name}`);
        } else artifact(root, name);
    };
    if (!check(session)) throw new Error(ajv.errorsText(check.errors));
    if (session.selection) {
        const suppressed = new Set(session.selection.suppressed_ids ?? []);
        const retries = new Set(session.selection.retry_ids ?? []);
        const candidates = new Set(session.items.map((item) => item.id));
        if (
            [...suppressed, ...retries].some((id) => !candidates.has(id)) ||
            [...retries].some((id) => suppressed.has(id))
        )
            throw Error('invalid blocked selection');
        if (
            [...(session.selection.metadata_only_ids ?? []), ...(session.selection.cooldown_ids ?? [])].some(
                (id) => !candidates.has(id) || !session.selection.researched_ids.includes(id)
            )
        )
            throw Error('invalid deferred research selection');
        if (session.selection.heat && session.selection.heat.base_digest !== session.base_digest)
            throw Error('heat snapshot baseline mismatch');
        validateHeat(session.selection.heat, session.items, session.checked_at);
        const expected = incrementalSelection(session);
        if ([...retries].some((id) => !expected.includes(id))) throw Error('retry exceeds research limit');
        if (digest(session.selected_ids) !== digest(expected)) throw new Error('invalid incremental selection');
    } else if (
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
            (item.status !== 'pending' ||
                item.reason !== undefined ||
                item.checkpoint !== undefined ||
                item.block !== undefined)
        )
            throw new Error('deferred item must remain pending without completion state');
        if (
            item.block &&
            (item.status !== 'blocked' ||
                item.block.plugin_id !== item.id ||
                item.block.revision !== item.revision ||
                item.block.reason !== item.reason ||
                item.block.run_id !== session.id ||
                Date.parse(item.block.blocked_at) < Date.parse(session.checked_at))
        )
            throw Error('block differs from fixed session item');
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
            for (const evidence of plugin.evidence) if (evidence.artifact) requireEvidence(evidence.artifact);
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
        sources: structuredClone(input.sources),
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
            else if (
                before.revision !== item.revision ||
                Object.entries(item.fingerprints).some(([area, value]) => before.fingerprints[area] !== value)
            )
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
    if (session.selection) {
        const byId = new Map(session.items.map((item) => [item.id, item]));
        return session.selected_ids.map((id) => byId.get(id));
    }
    return session.items.filter((item) => !session.selected_ids || session.selected_ids.includes(item.id));
}
const hasFreshAnalysis = (plugin, checkedAt) =>
    plugin?.findings.length > 0 &&
    plugin.findings.every(
        (finding) => Date.parse(finding.reviewed_at) >= Date.parse(checkedAt) && finding.status !== 'needs_review'
    );
export function completeItem(session, id, obsPath, reportPath, catalog, root = ROOT, embeddedArtifacts = null) {
    validateSession(session, root, embeddedArtifacts);
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
    if (digest(plugin.fingerprints) !== digest(item.fingerprints))
        throw new Error('observations fingerprints differ from fixed session item');
    if (
        Date.parse(plugin.last_checked_at) < Date.parse(session.checked_at) ||
        !plugin.findings.length ||
        !hasFreshAnalysis(current, session.checked_at) ||
        plugin.findings.some((f) => !current.findings.some((c) => digest(c) === digest(f)))
    )
        throw new Error('fresh analysis required for every round');
    if (!item.revision || !plugin.evidence.some((e) => e.kind === 'source_inspection' && e.revision === item.revision))
        throw new Error('analysis must match pinned revision');
    for (const e of plugin.evidence)
        if (e.artifact) {
            const value = embeddedArtifacts?.[e.artifact];
            if (value) {
                if (typeof value.content !== 'string' || sha256(value.content) !== value.sha256)
                    throw Error(`embedded evidence checksum differs: ${e.artifact}`);
            } else artifact(root, e.artifact);
        }
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
    return validateSession(session, root, embeddedArtifacts);
}

export { sha256, artifact, hasFreshAnalysis };
