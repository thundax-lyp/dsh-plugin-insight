#!/usr/bin/env node
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { ROOT, read, atomicWrite } from '../../_shared/scripts/plugin-data.mjs';
import { api } from '../../_shared/scripts/capture-github.mjs';
import { readGitMetaCache, cachedGitMetadata, gitCacheFromSnapshot } from '../../_shared/scripts/git-meta-cache.mjs';
const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);
const check = ajv.compile(read(resolve(ROOT, '.agents/skills/_shared/schemas/github-meta.schema.json')));
export function validateMetadata(value) {
    if (!check(value)) throw Error(ajv.errorsText(check.errors));
    const publication = value.npm?.publication;
    if (publication?.latest_version != null || publication?.latest_published_at != null) {
        if (!publication.latest_version || !publication.latest_published_at || publication.latest_error !== null)
            throw Error('latest npm release requires version, date and successful capture');
    } else if (publication && Object.hasOwn(publication, 'latest_error') && publication.latest_error === null) {
        throw Error('missing latest npm release requires an explicit error');
    }
    if (value.git_cache) {
        const age = Date.parse(value.captured_at) - Date.parse(value.git_cache.captured_at);
        if (
            age < 0 ||
            age > 86400000 ||
            !Number.isSafeInteger(value.stars) ||
            typeof value.archived !== 'boolean' ||
            !Number.isSafeInteger(value.repository_id) ||
            value.repository_id <= 0
        )
            throw Error('invalid Git cache identity, metrics or capture time');
    }
    return value;
}
export function captureMetadata(
    repository,
    request = api,
    at = new Date().toISOString(),
    { repositoryId, gitCache } = {}
) {
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw Error('expected owner/repository');
    const from = new Date(Date.parse(at) - 30 * 86400000).toISOString();
    const result = {
        repository,
        repository_id: null,
        captured_at: at,
        window_start: from,
        stars: null,
        pushed_at: null,
        issues: { open: null, closed: null, created_30d: null, closed_30d: null, updated_30d: null },
        errors: []
    };
    let cached = cachedGitMetadata(repositoryId, gitCache, at);
    let repositoryAvailable = true;
    try {
        const m = request(repositoryId ? `repositories/${repositoryId}` : `repos/${repository}`);
        if (repositoryId && m.id !== repositoryId) {
            const error = Error('GitHub repository identity mismatch');
            error.identityMismatch = true;
            throw error;
        }
        if (!Number.isSafeInteger(m.id) || m.id <= 0) throw Error('invalid GitHub repository ID');
        cached ??= cachedGitMetadata(m.id, gitCache, at);
        result.repository = m.full_name;
        result.repository_id = m.id;
        result.stars = m.stargazers_count;
        result.pushed_at = m.pushed_at;
        if (typeof m.archived === 'boolean') result.archived = m.archived;
    } catch (e) {
        if (e.identityMismatch) throw e;
        result.errors.push({ target: repository, message: e.message });
        if (!cached) return validateMetadata(result);
        result.repository = cached.repository;
        result.repository_id = cached.repository_id;
        repositoryAvailable = false;
    }
    if (cached) {
        result.stars = cached.stars;
        result.archived = cached.archived;
        result.git_cache = cached.provenance;
    }
    if (!repositoryAvailable) return validateMetadata(result);
    const queries = {
        open: 'is:open',
        closed: 'is:closed',
        created_30d: `created:${from}..${at}`,
        closed_30d: `is:closed closed:${from}..${at}`,
        updated_30d: `updated:${from}..${at}`
    };
    for (const [name, filter] of Object.entries(queries)) {
        try {
            const q = `repo:${result.repository} is:issue ${filter}`;
            const r = request(`search/issues?q=${encodeURIComponent(q)}&per_page=1`);
            if (r.incomplete_results || !Number.isSafeInteger(r.total_count)) throw Error('incomplete issue search');
            result.issues[name] = r.total_count;
        } catch (e) {
            result.errors.push({ target: name, message: e.message });
        }
    }
    return validateMetadata(result);
}
export async function captureNpmPublication(
    name,
    request = async (url) => {
        const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
        if (!r.ok) throw Error(`HTTP ${r.status}`);
        return r.json();
    },
    at = new Date().toISOString()
) {
    if (!/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name)) throw Error('invalid npm package name');
    const url = `https://registry.npmjs.org/${encodeURIComponent(name)}`;
    const result = {
        first_published_at: null,
        captured_at: at,
        source_url: url,
        error: null,
        latest_version: null,
        latest_published_at: null,
        latest_error: null
    };
    try {
        const data = await request(url);
        if (data.name !== name) throw Error('npm package identity mismatch');
        const time = Date.parse(data.time?.created);
        if (!Number.isFinite(time) || time > Date.parse(at)) result.error = 'npm first publication time mismatch';
        else result.first_published_at = new Date(time).toISOString();
        const latest = data['dist-tags']?.latest;
        const release = data.versions?.[latest];
        const published = Date.parse(data.time?.[latest]);
        if (
            typeof latest !== 'string' ||
            !latest ||
            release?.version !== latest ||
            release?.name !== name ||
            !Number.isFinite(published) ||
            published > Date.parse(at)
        ) {
            result.latest_error = 'npm latest tag, version identity or publication time mismatch';
        } else {
            result.latest_version = latest;
            result.latest_published_at = new Date(published).toISOString();
        }
    } catch (e) {
        result.error = e.message;
        result.latest_error = e.message;
    }
    return result;
}
export async function captureNpmDownloads(
    name,
    request = async (url) => {
        const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
        if (!r.ok) throw Error(`HTTP ${r.status}`);
        return r.json();
    },
    at = new Date().toISOString(),
    { publication } = {}
) {
    if (!/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name)) throw Error('invalid npm package name');
    const end = new Date(Date.parse(at));
    end.setUTCHours(0, 0, 0, 0);
    end.setUTCDate(end.getUTCDate() - 1);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 29);
    const from = start.toISOString().slice(0, 10),
        to = end.toISOString().slice(0, 10);
    const url = `https://api.npmjs.org/downloads/point/${from}:${to}/${encodeURIComponent(name)}`;
    const result = {
        package_name: name,
        captured_at: at,
        window_start: from,
        window_end: to,
        downloads_30d: null,
        source_url: url,
        error: null
    };
    try {
        const data = await request(url);
        if (
            data.package !== name ||
            data.start !== from ||
            data.end !== to ||
            !Number.isSafeInteger(data.downloads) ||
            data.downloads < 0
        )
            throw Error('npm package, window or count mismatch');
        result.downloads_30d = data.downloads;
    } catch (e) {
        result.error = e.message;
    }
    result.publication = publication ?? (await captureNpmPublication(name, request, at));
    return result;
}
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
        if (values.npm) result.npm = await captureNpmDownloads(values.npm, undefined, at);
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
