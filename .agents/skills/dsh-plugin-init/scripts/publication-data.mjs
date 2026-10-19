#!/usr/bin/env node
import { closeSync, openSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { CATALOG, PUBLICATION, pluginDirectory } from '../../_shared/scripts/data-paths.mjs';
import {
    ROOT,
    analysisDigest,
    atomicWrite,
    digest,
    read,
    validate as validateCatalog
} from '../../_shared/scripts/plugin-data.mjs';
import { validateMetadata } from '../../dsh-plugin-insight/scripts/capture-plugin-meta.mjs';
import { validateManifest } from './research-session.mjs';

const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);
const check = ajv.compile(read(resolve(ROOT, '.agents/skills/_shared/schemas/publication.schema.json')));

export function validatePublication(publication) {
    if (!check(publication)) throw new Error(ajv.errorsText(check.errors, { separator: '; ' }));
    return publication;
}

const keys = (value) => Object.keys(value ?? {});
const local = (root, path) => {
    const full = resolve(root, path);
    if (isAbsolute(path) || relative(root, full).startsWith('..')) throw new Error('path must be inside project');
    return full;
};
const roundParts = (round) => {
    const match = /^(\d{4}-\d{2}-\d{2})-(\d+)$/.exec(round);
    return [match[1], Number(match[2])];
};
const newerRound = (candidate, current) => {
    const [candidateDate, candidateSequence] = roundParts(candidate);
    const [currentDate, currentSequence] = roundParts(current);
    return candidateDate > currentDate || (candidateDate === currentDate && candidateSequence > currentSequence);
};
const replaceSelected = (current, replacement, selected) => ({
    ...Object.fromEntries(Object.entries(current ?? {}).filter(([id]) => !selected.has(id))),
    ...replacement
});
const legacyAnalysisMatches = (item, plugin, catalog, checkedAt) => {
    const run = catalog?.runs.find((candidate) => candidate.id === item.checkpoint?.run_id);
    return (
        run &&
        plugin.last_checked_at === run.checked_at &&
        plugin.findings.length > 0 &&
        plugin.findings.every(
            (finding) => finding.status !== 'needs_review' && Date.parse(finding.reviewed_at) >= Date.parse(checkedAt)
        )
    );
};
export function validateManifestPlugin(item, plugin, catalog, checkedAt) {
    if (
        !plugin ||
        plugin.repository !== item.repository ||
        plugin.path !== item.path ||
        digest(plugin.fingerprints) !== digest(item.fingerprints) ||
        (item.analysis_sha256
            ? item.analysis_sha256 !== analysisDigest(plugin)
            : !legacyAnalysisMatches(item, plugin, catalog, checkedAt))
    )
        throw new Error(`manifest and catalog differ: ${item.id}`);
    return plugin;
}
const exactCoverage = (label, value, expected) => {
    const actual = new Set(keys(value));
    const missing = [...expected].filter((id) => !actual.has(id));
    const extra = [...actual].filter((id) => !expected.has(id));
    if (missing.length || extra.length)
        throw new Error(
            `${label} coverage differs; missing=${missing.join(',') || '-'} extra=${extra.join(',') || '-'}`
        );
};

export function planPublication(current, manifest, input, catalog, manifestPath, root = ROOT) {
    validatePublication(current);
    validateManifest(manifest);
    validateCatalog(catalog);
    if (manifestPath !== current.manifest) {
        const currentManifest = validateManifest(read(resolve(root, current.manifest)));
        if (
            !newerRound(manifest.round, currentManifest.round) ||
            Date.parse(manifest.checked_at) <= Date.parse(currentManifest.checked_at)
        )
            throw new Error('publication manifest must be newer than the current manifest');
    }
    if (!input || typeof input !== 'object' || Array.isArray(input))
        throw new Error('publication input must be an object');
    const allowed = new Set(['recommendations', 'metadata', 'summaries', 'capabilities', 'advice']);
    const extra = Object.keys(input).filter((key) => !allowed.has(key));
    if (extra.length) throw new Error(`unknown publication input fields: ${extra.join(', ')}`);
    for (const field of allowed) if (input[field] === undefined) throw new Error(`publication input requires ${field}`);
    const completeItems = manifest.items.filter((item) => item.status === 'complete');
    const selected = new Set(manifest.items.map((item) => item.id));
    const complete = new Set(completeItems.map((item) => item.id));
    const byId = new Map(completeItems.map((item) => [item.id, item]));
    exactCoverage('metadata', input.metadata, complete);
    exactCoverage('summaries', input.summaries, complete);
    exactCoverage('capabilities', input.capabilities, complete);
    exactCoverage('advice', input.advice, complete);
    const catalogById = new Map(catalog.plugins.map((plugin) => [plugin.id, plugin]));
    for (const id of complete) {
        const item = byId.get(id);
        const revision = item.revision;
        const plugin = validateManifestPlugin(item, catalogById.get(id), catalog, manifest.checked_at);
        const report = readFileSync(resolve(root, `${pluginDirectory(plugin, root)}/INSIGHT.md`), 'utf8');
        const metadata = validateMetadata(read(local(root, input.metadata[id])));
        if (metadata.repository_id !== null && metadata.repository_id !== plugin.repository_id)
            throw new Error(`metadata repository identity differs: ${id}`);
        if (metadata.repository.toLowerCase() !== plugin.repository.toLowerCase())
            throw new Error(`metadata repository differs: ${id}`);
        const summary = input.summaries[id];
        if (
            summary?.revision !== revision ||
            !summary.source_url.startsWith(`https://github.com/${item.repository}/blob/${revision}/`)
        )
            throw new Error(`summary revision or source differs: ${id}`);
        if (!report.includes(`> ${summary.text}`)) throw new Error(`detail summary differs: ${id}`);
        if (input.advice[id]?.revision !== revision) throw new Error(`advice revision differs: ${id}`);
        if (input.capabilities[id] && input.capabilities[id].revision !== revision)
            throw new Error(`capability revision differs: ${id}`);
        for (const [name, value] of Object.entries(input.capabilities[id].items))
            if (!report.includes(`- **${name}**：${value}`))
                throw new Error(`detail capability differs: ${id}/${name}`);
        if (!report.includes(input.advice[id].text)) throw new Error(`detail advice differs: ${id}`);
    }
    const recommendationIds = new Set();
    for (const recommendation of input.recommendations) {
        if (!complete.has(recommendation.plugin_id))
            throw new Error(`recommendation target is not complete: ${recommendation.plugin_id}`);
        if (recommendationIds.has(recommendation.plugin_id))
            throw new Error(`duplicate recommendation: ${recommendation.plugin_id}`);
        recommendationIds.add(recommendation.plugin_id);
        const item = byId.get(recommendation.plugin_id);
        const plugin = catalogById.get(recommendation.plugin_id);
        if (
            recommendation.kind === 'install' &&
            (plugin?.research_depth !== 'host_verified' ||
                !plugin.evidence.some(
                    (evidence) =>
                        evidence.kind === 'host_acceptance' &&
                        evidence.revision === item.revision &&
                        evidence.environment &&
                        evidence.artifact
                ))
        )
            throw new Error(`install recommendation lacks pinned host verification: ${recommendation.plugin_id}`);
    }
    const recommendations = [
        ...current.recommendations.filter((recommendation) => !selected.has(recommendation.plugin_id)),
        ...input.recommendations
    ];
    const manifests = [...new Set([...(current.manifests ?? []), current.manifest])].filter(
        (path) => path !== manifestPath
    );
    const result = {
        schema_version: 1,
        ...(manifests.length ? { manifests } : {}),
        manifest: manifestPath,
        scope: `${manifest.summary.selected} 个所选固定源码组件：完成 ${manifest.summary.complete}、受阻 ${manifest.summary.blocked}、待处理 ${manifest.summary.pending}；完整候选 ${manifest.summary.listed}，未选 ${manifest.summary.deferred}`,
        catalog: current.catalog,
        catalog_page: current.catalog_page,
        recommendations,
        metadata: replaceSelected(current.metadata, input.metadata, selected),
        summaries: replaceSelected(current.summaries, input.summaries, selected),
        capabilities: replaceSelected(current.capabilities, input.capabilities, selected),
        advice: replaceSelected(current.advice, input.advice, selected)
    };
    validatePublication(result);
    return {
        plan_version: 1,
        base_digest: digest(current),
        manifest_digest: digest(manifest),
        input_digest: digest(input),
        result_digest: digest(result),
        summary: {
            manifest: manifestPath,
            complete: complete.size,
            recommendations: result.recommendations.length,
            capabilities: keys(result.capabilities).length
        },
        result
    };
}

export function applyPublication(path, plan, root = ROOT) {
    if (plan?.plan_version !== 1) throw new Error('unsupported publication plan version');
    const manifestPath = plan?.summary?.manifest;
    if (!/^data\/manifests\/\d{4}-\d{2}-\d{2}-\d{2,}\.json$/.test(manifestPath ?? ''))
        throw new Error('publication plan manifest path is invalid');
    const lockPath = `${path}.lock`;
    let lock;
    try {
        lock = openSync(lockPath, 'wx', 0o600);
    } catch (error) {
        if (error.code === 'EEXIST') throw new Error(`publication is locked: ${lockPath}`);
        throw error;
    }
    try {
        writeFileSync(lock, JSON.stringify({ pid: process.pid, created_at: new Date().toISOString() }));
        const current = read(path);
        if (digest(current) !== plan.base_digest)
            throw new Error('publication changed since planning; regenerate the plan');
        const manifest = read(resolve(root, manifestPath));
        if (digest(manifest) !== plan.manifest_digest)
            throw new Error('manifest changed since planning; regenerate the plan');
        validateManifest(manifest);
        if (digest(plan.result) !== plan.result_digest) throw new Error('publication plan result digest mismatch');
        validatePublication(plan.result);
        atomicWrite(path, plan.result);
    } finally {
        closeSync(lock);
        unlinkSync(lockPath);
    }
}

export function main(args = process.argv.slice(2)) {
    const [command, ...rest] = args;
    if (!['validate', 'plan', 'apply'].includes(command))
        throw new Error('Usage: publication-data.mjs validate|plan|apply [options]');
    const { values } = parseArgs({
        args: rest,
        options: {
            publication: { type: 'string' },
            manifest: { type: 'string' },
            input: { type: 'string' },
            catalog: { type: 'string' },
            plan: { type: 'string' },
            out: { type: 'string' }
        }
    });
    const publicationPath = resolve(values.publication ?? resolve(ROOT, PUBLICATION));
    const required = (key) => {
        if (!values[key]) throw new Error(`--${key} is required`);
        return values[key];
    };
    if (command === 'validate') {
        validatePublication(read(publicationPath));
        console.log('Publication validation passed');
        return;
    }
    if (command === 'apply') {
        applyPublication(publicationPath, read(resolve(required('plan'))));
        console.log('Publication plan applied');
        return;
    }
    const manifestAbsolute = resolve(required('manifest'));
    const manifestPath = relative(ROOT, manifestAbsolute).split('\\').join('/');
    if (!/^data\/manifests\/\d{4}-\d{2}-\d{2}-\d{2,}\.json$/.test(manifestPath))
        throw new Error('manifest must be data/manifests/<round>.json');
    const manifest = read(manifestAbsolute);
    if (manifestPath !== `data/manifests/${manifest.round}.json`) throw new Error('manifest path differs from round');
    const plan = planPublication(
        read(publicationPath),
        manifest,
        read(resolve(required('input'))),
        read(resolve(values.catalog ?? resolve(ROOT, CATALOG))),
        manifestPath
    );
    atomicWrite(resolve(required('out')), plan);
    console.log(JSON.stringify(plan.summary));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        main();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
    }
}
