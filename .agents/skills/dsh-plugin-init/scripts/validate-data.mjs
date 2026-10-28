#!/usr/bin/env node
import { readSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { readWork, readResearchSession } from '../../_shared/scripts/work-storage.mjs';
import { existsSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { validateManifest, validateSession } from './session-state.mjs';
import { validatePublication } from './publication-data.mjs';
import { validateRunNames } from './maintain-runs.mjs';
import { ROOT, read, validate, validateObservations } from '../../_shared/scripts/plugin-data.mjs';
import { validateMetadata } from '../../_shared/scripts/metadata-validation.mjs';
import { CATALOG, PUBLICATION, REGISTRY, pluginDirectory } from '../../_shared/scripts/data-paths.mjs';
const walk = (path) =>
    existsSync(path)
        ? readdirSync(path, { withFileTypes: true }).flatMap((e) =>
              e.isDirectory() ? walk(resolve(path, e.name)) : [resolve(path, e.name)]
          )
        : [];
try {
    if (existsSync(resolve(ROOT, 'data/catalog/index.jsonl'))) {
        const { validateSnapshot, validateWork } = await import('./snapshot-state.mjs');
        validateSnapshot(readSnapshotStorage(resolve(ROOT, 'data/catalog/index.jsonl')));
        for (const path of walk(resolve(ROOT, 'data/runs')).filter(
            (path) => path.endsWith('/WORK.json') && !path.includes('/migration-originals/')
        ))
            validateWork(readWork(path));
        console.log('Current snapshot and local work valid; historical runs/manifests are optional');
    } else {
        const runsRoot = resolve(ROOT, 'data/runs');
        if (existsSync(runsRoot)) validateRunNames();
        const catalog = read(resolve(ROOT, CATALOG));
        validate(catalog);
        const registry = read(resolve(ROOT, REGISTRY));
        if (new Set(Object.values(registry)).size !== Object.keys(registry).length)
            throw Error('duplicate plugin directory');
        for (const plugin of catalog.plugins) {
            if (!registry[plugin.id]) throw Error(`unregistered plugin directory: ${plugin.id}`);
            const directory = pluginDirectory(plugin, ROOT);
            const metaPath = resolve(ROOT, directory, 'META.json');
            if (existsSync(metaPath)) {
                const meta = validateMetadata(read(metaPath));
                if (meta.repository_id !== null && meta.repository_id !== plugin.repository_id)
                    throw Error('current META identity differs');
            }
            for (const evidence of plugin.evidence)
                if (
                    evidence.artifact &&
                    !evidence.artifact.startsWith('data/runs/') &&
                    !existsSync(resolve(ROOT, evidence.artifact))
                )
                    throw Error(`missing evidence: ${evidence.artifact}`);
        }
        validatePublication(read(resolve(ROOT, PUBLICATION)));
        const manifestsRoot = resolve(ROOT, 'data/manifests');
        for (const path of walk(manifestsRoot).filter((path) => path.endsWith('.json'))) {
            const manifest = validateManifest(read(path));
            if (relative(ROOT, path).split('\\').join('/') !== `data/manifests/${manifest.round}.json`)
                throw Error(`manifest path differs from round: ${path}`);
        }
        for (const path of walk(runsRoot)) {
            if (path.endsWith('/SESSION.json') && !path.includes('/migration-originals/'))
                validateSession(readResearchSession(path));
            if (path.includes('/observations/') && !path.includes('/migration-originals/') && path.endsWith('.json'))
                validateObservations(read(path));
        }
        console.log('Catalog, run manifests, local research data when present, and current outputs valid');
    }
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
}
