#!/usr/bin/env node
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { ROOT, read, atomicWrite } from '../../_shared/scripts/plugin-data.mjs';
import { api } from '../../_shared/scripts/github-client.mjs';
import { readGitMetaCache, gitCacheFromSnapshot, captureMetadata } from '../../_shared/scripts/github-meta.mjs';

import {
    getNpmMetadata,
    captureNpmDownloads as downloadNpm,
    captureNpmPublication
} from '../../_shared/scripts/npm-meta.mjs';
import { validateMetadata } from '../../_shared/scripts/metadata-validation.mjs';
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        const { values, positionals } = parseArgs({
            options: {
                out: { type: 'string' },
                npm: { type: 'string' },
                'repository-id': { type: 'string' },
                at: { type: 'string' },
                'git-cache-file': { type: 'string' },
                'skip-git-cache': { type: 'boolean', default: false }
            },
            allowPositionals: true
        });
        if (positionals.length !== 1 || !values.out)
            throw Error('Usage: capture-plugin-meta.mjs OWNER/REPO [--npm PACKAGE] --out FILE');
        const at = values.at ?? new Date().toISOString();
        if (!Number.isFinite(Date.parse(at))) throw Error('invalid --at');
        const repositoryId = values['repository-id'] === undefined ? undefined : Number(values['repository-id']);
        if (repositoryId !== undefined && (!Number.isSafeInteger(repositoryId) || repositoryId <= 0))
            throw Error('invalid --repository-id');
        let gitCache;
        let cacheError;
        try {
            if (!values['skip-git-cache'])
                gitCache = values['git-cache-file']
                    ? gitCacheFromSnapshot(read(resolve(values['git-cache-file'])))
                    : await readGitMetaCache();
        } catch (error) {
            cacheError = error.message;
        }
        const result = captureMetadata(positionals[0], api, at, { repositoryId, gitCache });
        if (cacheError) result.errors.push({ target: 'git_meta_cache', message: cacheError });
        if (values.npm) {
            const resolved = await getNpmMetadata(values.npm, { at });
            result.npm = resolved.npm;
            if (resolved.cache_error) result.errors.push({ target: 'npm_meta_cache', message: resolved.cache_error });
        }
        validateMetadata(result);
        atomicWrite(values.out, result);
        console.log(
            `${result.repository}: ${result.errors.length} GitHub errors${result.npm?.error ? ', npm: ' + result.npm.error : ''}`
        );
    } catch (e) {
        console.error(e.message);
        process.exitCode = 1;
    }
}

export { captureMetadata } from '../../_shared/scripts/github-meta.mjs';
export { validateMetadata } from '../../_shared/scripts/metadata-validation.mjs';
export { captureNpmPublication } from '../../_shared/scripts/npm-meta.mjs';
// Preserve the old compound helper; current workers use the fixed npm META entry.
export async function captureNpmDownloads(name, request, at = new Date().toISOString(), { publication } = {}) {
    const result = await downloadNpm(name, request, at);
    result.publication = publication ?? (await captureNpmPublication(name, request, at));
    return result;
}
