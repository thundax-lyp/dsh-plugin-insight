#!/usr/bin/env node
import { closeSync, openSync, unlinkSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { CATALOG, PUBLICATION } from '../../_shared/scripts/data-paths.mjs';
import { ROOT, atomicWrite, digest, read, validate as validateCatalog } from '../../_shared/scripts/plugin-data.mjs';
import { validateManifest } from './research-session.mjs';

const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);
const check = ajv.compile(read(resolve(ROOT, '.agents/skills/_shared/schemas/publication.schema.json')));

export function validatePublication(publication) {
    if (!check(publication)) throw new Error(ajv.errorsText(check.errors, { separator: '; ' }));
    return publication;
}

const keys = (value) => Object.keys(value ?? {});
const replaceSelected = (current, replacement, selected) => ({
    ...Object.fromEntries(Object.entries(current ?? {}).filter(([id]) => !selected.has(id))),
    ...replacement
});
const exactCoverage = (label, value, expected) => {
    const actual = new Set(keys(value));
    const missing = [...expected].filter((id) => !actual.has(id));
    const extra = [...actual].filter((id) => !expected.has(id));
    if (missing.length || extra.length)
        throw new Error(
            `${label} coverage differs; missing=${missing.join(',') || '-'} extra=${extra.join(',') || '-'}`
        );
};

export function planPublication(current, manifest, input, catalog, manifestPath) {
    validatePublication(current);
    validateManifest(manifest);
    validateCatalog(catalog);
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
    exactCoverage('advice', input.advice, complete);
    for (const id of keys(input.capabilities))
        if (!complete.has(id)) throw new Error(`capability target is not complete: ${id}`);
    for (const id of complete) {
        const revision = byId.get(id).revision;
        if (input.summaries[id]?.revision !== revision) throw new Error(`summary revision differs: ${id}`);
        if (input.advice[id]?.revision !== revision) throw new Error(`advice revision differs: ${id}`);
        if (input.capabilities[id] && input.capabilities[id].revision !== revision)
            throw new Error(`capability revision differs: ${id}`);
    }
    const catalogById = new Map(catalog.plugins.map((plugin) => [plugin.id, plugin]));
    const recommendationIds = new Set();
    for (const recommendation of input.recommendations) {
        if (!complete.has(recommendation.plugin_id))
            throw new Error(`recommendation target is not complete: ${recommendation.plugin_id}`);
        if (recommendationIds.has(recommendation.plugin_id))
            throw new Error(`duplicate recommendation: ${recommendation.plugin_id}`);
        recommendationIds.add(recommendation.plugin_id);
        if (
            recommendation.kind === 'install' &&
            catalogById.get(recommendation.plugin_id)?.research_depth !== 'host_verified'
        )
            throw new Error(`install recommendation lacks host verification: ${recommendation.plugin_id}`);
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

export function applyPublication(path, plan) {
    if (plan?.plan_version !== 1) throw new Error('unsupported publication plan version');
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
