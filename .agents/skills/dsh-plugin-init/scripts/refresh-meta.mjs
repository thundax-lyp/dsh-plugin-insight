#!/usr/bin/env node
import { readSnapshotStorage, writeSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { PUBLICATION, pluginDirectory } from '../../_shared/scripts/data-paths.mjs';
import { ROOT, read, atomicWrite } from '../../_shared/scripts/plugin-data.mjs';
import { api } from '../../_shared/scripts/capture-github.mjs';
import {
    captureMetadata,
    captureNpmDownloads,
    validateMetadata
} from '../../dsh-plugin-insight/scripts/capture-plugin-meta.mjs';
import { validateManifest } from './research-session.mjs';
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
    { request = api, downloads = captureNpmDownloads, at = new Date().toISOString(), root = ROOT } = {}
) {
    const snapshotPath = resolve(root, 'data/catalog/SNAPSHOT.json');
    const snapshot = existsSync(snapshotPath) ? readSnapshotStorage(snapshotPath) : null;
    const baseDigest = snapshot ? (await import('../../_shared/scripts/plugin-data.mjs')).digest(snapshot) : null;
    const publication = snapshot?.publication ?? read(resolve(root, inputPath));
    const manifest = snapshot
        ? { items: publication.records, round: at.slice(0, 10) + '-01' }
        : validateManifest(read(resolve(root, publication.manifest)));
    const stamp = at.replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
    const result = [];
    const mapping = { ...publication.metadata };
    // Read the fixed list; no discovery, deep analysis, catalog writes or checkpoint edits.
    for (const item of manifest.items.filter((item) => item.status === 'complete')) {
        const previous = snapshot
            ? snapshot.metadata[item.id]
            : mapping[item.id]
              ? validateMetadata(read(resolve(root, mapping[item.id])))
              : null;
        const metadata = captureMetadata(item.repository, request, at);
        if (metadata.repository_id !== null && metadata.repository_id !== Number(item.id.split(':')[1]))
            throw Error(`repository identity changed: ${item.id}`);
        // Only use previously confirmed npm identity. Never derive it from repository name.
        if (previous?.npm) metadata.npm = await downloads(previous.npm.package_name, undefined, at);
        metadata.code_update = inspectUpdate(item, request, at);
        validateMetadata(metadata);
        const plugin = { ...item, component_id: item.id.split(':')[2] };
        const directory = pluginDirectory(plugin, root);
        const path = `data/runs/${manifest.round}/snapshots/meta-refresh/${stamp}/${directory.split('/').at(-1)}/META.json`;
        atomicWrite(resolve(root, path), metadata);
        const current = directory + '/META.json';
        if (snapshot) snapshot.metadata[item.id] = metadata;
        else atomicWrite(resolve(root, current), metadata);
        mapping[item.id] = current;
        result.push({
            id: item.id,
            script_changed: metadata.code_update.script_changed,
            errors: [
                ...metadata.errors.map((e) => e.message),
                ...(metadata.npm?.error ? [metadata.npm.error] : []),
                ...(metadata.npm?.publication?.error ? [metadata.npm.publication.error] : []),
                ...(metadata.code_update.error ? [metadata.code_update.error] : [])
            ]
        });
    }
    publication.metadata = mapping;
    if (snapshot) {
        const { digest } = await import('../../_shared/scripts/plugin-data.mjs');
        const { validateSnapshot, renderSnapshot } = await import('./snapshot-data.mjs');
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
    } else atomicWrite(resolve(root, inputPath), publication);
    return result;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        const { values: v } = parseArgs({ options: { input: { type: 'string', default: PUBLICATION } } });
        const result = await refresh(v.input);
        await render(['--input', v.input]);
        console.log(JSON.stringify(result));
    } catch (e) {
        console.error(e.message);
        process.exitCode = 1;
    }
}
