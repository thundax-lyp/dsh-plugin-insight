#!/usr/bin/env node
import { readSnapshotStorage, writeSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { PUBLICATION, pluginDirectory } from '../../_shared/scripts/data-paths.mjs';
import { ROOT, read, atomicWrite } from '../../_shared/scripts/plugin-data.mjs';
import { api } from '../../_shared/scripts/github-client.mjs';
import { captureMetadata, readGitMetaCache } from '../../_shared/scripts/github-meta.mjs';
import {
    captureNpmPublication,
    captureNpmDownloads,
    cachedNpmPublication,
    readNpmMetaCache,
    resolveNpmMetadata
} from '../../_shared/scripts/npm-meta.mjs';
import { validateMetadata } from '../../_shared/scripts/metadata-validation.mjs';
import { validateManifest } from './session-state.mjs';
import { main as render } from './render-research.mjs';

const scripts = /\.(?:[cm]?[jt]s|[jt]sx)$/i;
export function inspectUpdate(item, request = api, at = new Date().toISOString()) {
    const result = {
        checked_at: at,
        baseline_revision: item.revision,
        current_revision: null,
        script_changed: null,
        changed_files: [],
        error: null
    };
    try {
        const head = request(`repos/${item.repository}/commits?per_page=1`)[0]?.sha;
        if (!head) throw Error('missing default branch head');
        result.current_revision = head;
        if (head === item.revision) {
            result.script_changed = false;
            return result;
        }
        if (!item.revision) throw Error('no research baseline revision');
        const diff = request(`repos/${item.repository}/compare/${item.revision}...${head}`);
        if (!['ahead', 'identical'].includes(diff.status)) throw Error('baseline diverged or default branch rewound');
        // GitHub compare includes at most 300 files. At the cap, never infer absence of changes.
        if (!Array.isArray(diff.files) || diff.files.length >= 300) throw Error('comparison file coverage incomplete');
        const inside = (path) => !item.path || path === item.path || path.startsWith(item.path + '/');
        result.changed_files = diff.files
            .filter(
                (f) =>
                    (inside(f.filename) || (f.previous_filename && inside(f.previous_filename))) &&
                    (scripts.test(f.filename) || scripts.test(f.previous_filename ?? ''))
            )
            .map((f) => f.filename);
        result.script_changed = result.changed_files.length > 0;
    } catch (e) {
        result.error = e.message;
    }
    return result;
}

export async function refresh(
    inputPath,
    {
        request = api,
        downloads = captureNpmDownloads,
        publication = captureNpmPublication,
        metaCache = readNpmMetaCache,
        gitMetaCache = readGitMetaCache,
        publicationOnly = false,
        pluginIds = null,
        at = new Date().toISOString(),
        root = ROOT
    } = {}
) {
    const snapshotPath = resolve(root, 'data/catalog/index.jsonl');
    const snapshot = existsSync(snapshotPath) ? readSnapshotStorage(snapshotPath) : null;
    if (publicationOnly && !snapshot) throw Error('publication-only refresh requires formal snapshot');
    const baseDigest = snapshot ? (await import('../../_shared/scripts/plugin-data.mjs')).digest(snapshot) : null;
    const publicationInput = snapshot?.publication ?? read(resolve(root, inputPath));
    const manifest = snapshot
        ? { items: publicationInput.records, round: at.slice(0, 10) + '-01' }
        : validateManifest(read(resolve(root, publicationInput.manifest)));
    if (
        pluginIds &&
        (new Set(pluginIds).size !== pluginIds.length ||
            pluginIds.some((id) => !manifest.items.some((item) => item.id === id && item.status === 'complete')))
    )
        throw Error('metadata refresh requires distinct published plugin ids');
    const stamp = at.replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    const result = [];
    const mapping = { ...publicationInput.metadata };
    const [npmResult, gitResult] = await Promise.allSettled([
        Promise.resolve().then(metaCache),
        publicationOnly ? Promise.resolve(null) : Promise.resolve().then(gitMetaCache)
    ]);
    const metaCacheError = npmResult.status === 'rejected' ? npmResult.reason.message : null;
    const cache = npmResult.status === 'fulfilled' ? npmResult.value : { records: new Map() };
    const gitCacheError = gitResult.status === 'rejected' ? gitResult.reason.message : null;
    const gitCache = gitResult.status === 'fulfilled' ? gitResult.value : null;
    // Read the fixed list; no discovery, deep analysis, catalog writes or checkpoint edits.
    for (const item of manifest.items.filter(
        (item) => item.status === 'complete' && (!pluginIds || pluginIds.includes(item.id))
    )) {
        const previous = snapshot
            ? snapshot.metadata[item.id]
            : mapping[item.id]
              ? validateMetadata(read(resolve(root, mapping[item.id])))
              : null;
        if (publicationOnly && !previous?.npm) continue;
        const metadata = publicationOnly
            ? structuredClone(previous)
            : captureMetadata(item.repository, request, at, { repositoryId: Number(item.id.split(':')[1]), gitCache });
        if (metadata.repository_id !== null && metadata.repository_id !== Number(item.id.split(':')[1]))
            throw Error(`repository identity changed: ${item.id}`);
        // Only use previously confirmed npm identity. Never derive it from repository name.
        let npmDownloadsSource = null;
        let npmPublicationSource = null;
        if (publicationOnly) {
            const cachedPublication = cachedNpmPublication(
                previous.npm.package_name,
                cache.records.get(previous.npm.package_name),
                at
            );
            metadata.npm.publication =
                cachedPublication ?? (await publication(previous.npm.package_name, undefined, at));
            npmPublicationSource = cachedPublication ? 'github-meta' : 'npm';
        } else {
            if (previous?.npm) {
                const packageName = previous.npm.package_name;
                const resolved = await resolveNpmMetadata(packageName, cache.records.get(packageName), {
                    downloads,
                    publication,
                    at
                });
                metadata.npm = resolved.npm;
                npmDownloadsSource = resolved.downloads_source;
                npmPublicationSource = resolved.publication_source;
            }
            metadata.code_update = inspectUpdate({ ...item, repository: metadata.repository }, request, at);
        }
        validateMetadata(metadata);
        const plugin = { ...item, component_id: item.id.split(':')[2] };
        const directory = pluginDirectory(plugin, root);
        const path = `data/runs/${manifest.round}/${directory.split('/').at(-1)}/META-${stamp}.json`;
        atomicWrite(resolve(root, path), metadata);
        const current = `data/catalog/${directory.split('/').at(-1)}/meta.json`;
        if (snapshot) snapshot.metadata[item.id] = metadata;
        else atomicWrite(resolve(root, current), metadata);
        mapping[item.id] = current;
        result.push({
            id: item.id,
            npm_downloads_source: npmDownloadsSource,
            npm_publication_source: npmPublicationSource,
            meta_cache_error: metaCacheError,
            git_stars_source: publicationOnly
                ? null
                : metadata.git_cache
                  ? 'github-meta'
                  : metadata.stars === null
                    ? null
                    : 'github-api',
            git_archived_source: publicationOnly
                ? null
                : metadata.git_cache
                  ? 'github-meta'
                  : metadata.archived === undefined
                    ? null
                    : 'github-api',
            git_meta_cache: publicationOnly
                ? null
                : {
                      commit_sha: gitCache?.commit_sha ?? null,
                      blob_sha: gitCache?.blob_sha ?? null,
                      errors_blob_sha: gitCache?.errors_blob_sha ?? null,
                      error: gitCacheError
                  },
            script_changed: metadata.code_update?.script_changed ?? null,
            errors: [
                ...metadata.errors.map((e) => e.message),
                ...(metadata.npm?.error ? [metadata.npm.error] : []),
                ...(metadata.npm?.publication?.error ? [metadata.npm.publication.error] : []),
                ...(metadata.code_update?.error ? [metadata.code_update.error] : []),
                ...(metadata.npm?.publication?.latest_error ? [metadata.npm.publication.latest_error] : [])
            ]
        });
    }
    publicationInput.metadata = mapping;
    if (snapshot) {
        const { digest } = await import('../../_shared/scripts/plugin-data.mjs');
        const { validateSnapshot } = await import('./snapshot-state.mjs');
        const { renderSnapshot } = await import('./render-snapshot.mjs');
        validateSnapshot(snapshot, root);
        const { openSync, closeSync, unlinkSync } = await import('node:fs');
        const fd = openSync(snapshotPath + '.lock', 'wx', 0o600);
        try {
            if (digest(readSnapshotStorage(snapshotPath)) !== baseDigest)
                throw Error('snapshot changed during metadata refresh');
            writeSnapshotStorage(snapshotPath, snapshot);
        } finally {
            closeSync(fd);
            unlinkSync(snapshotPath + '.lock');
        }
        renderSnapshot(root);
    } else atomicWrite(resolve(root, inputPath), publicationInput);
    return result;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        const { values: v } = parseArgs({
            options: {
                input: { type: 'string', default: PUBLICATION },
                'npm-publication-only': { type: 'boolean', default: false },
                plugin: { type: 'string', multiple: true }
            }
        });
        const result = await refresh(v.input, {
            publicationOnly: v['npm-publication-only'],
            pluginIds: v.plugin ?? null
        });
        await render(['--input', v.input]);
        console.log(JSON.stringify(result));
    } catch (e) {
        console.error(e.message);
        process.exitCode = 1;
    }
}
