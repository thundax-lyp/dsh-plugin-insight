import { metricTimestamp, validateMetadata } from './metadata-validation.mjs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { api, META_BRANCH, META_REPOSITORY, githubToken, githubRequest, readGitHubFile } from './github-client.mjs';

const timestamp = metricTimestamp;

const PATH = 'data/GIT-META.jsonl';
const ERRORS_PATH = 'data/GIT-ERRORS.jsonl';

const repositoryName = (value) => typeof value === 'string' && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value);
function parseLines(text, validate) {
    if (text === '') return new Map();
    if (!text.endsWith('\n')) throw Error('Git META JSONL must end with newline');
    const records = new Map();
    let previous = 0;
    for (const [index, line] of text.slice(0, -1).split('\n').entries()) {
        let row;
        try {
            row = JSON.parse(line);
        } catch {
            throw Error(`invalid Git META JSON at line ${index + 1}`);
        }
        if (
            !row ||
            typeof row !== 'object' ||
            Array.isArray(row) ||
            !Number.isSafeInteger(row.repository_id) ||
            row.repository_id <= previous ||
            !validate(row)
        )
            throw Error(`invalid or unsorted Git META record at line ${index + 1}`);
        previous = row.repository_id;
        records.set(row.repository_id, row);
    }
    return records;
}
export const parseGitMeta = (text) =>
    parseLines(
        text,
        (row) =>
            Object.keys(row).sort().join(',') === 'archived,checked_at,repository,repository_id,stars' &&
            repositoryName(row.repository) &&
            timestamp(row.checked_at) &&
            Number.isSafeInteger(row.stars) &&
            row.stars >= 0 &&
            typeof row.archived === 'boolean'
    );
export const parseGitErrors = (text) =>
    parseLines(
        text,
        (row) =>
            Object.keys(row).sort().join(',') === 'error,repository_id' &&
            row.error &&
            Object.keys(row.error).sort().join(',') === 'checked_at,code' &&
            timestamp(row.error.checked_at) &&
            typeof row.error.code === 'string' &&
            row.error.code.length > 0
    );
export function gitCacheFromSnapshot(snapshot) {
    if (
        !repositoryName(snapshot.repository) ||
        snapshot.path !== PATH ||
        snapshot.errors_path !== ERRORS_PATH ||
        !/^[a-f0-9]{40}$/.test(snapshot.commit_sha) ||
        !/^[a-f0-9]{40}$/.test(snapshot.blob_sha) ||
        !/^[a-f0-9]{40}$/.test(snapshot.errors_blob_sha)
    )
        throw Error('invalid Git cache provenance');
    return { ...snapshot, records: parseGitMeta(snapshot.text), errors: parseGitErrors(snapshot.errors_text) };
}
export function gitCacheSnapshot(cache) {
    return Object.fromEntries(
        [
            'repository',
            'branch',
            'path',
            'errors_path',
            'commit_sha',
            'blob_sha',
            'errors_blob_sha',
            'text',
            'errors_text'
        ].map((key) => [key, cache[key]])
    );
}
export async function readGitMetaCache({
    repository = META_REPOSITORY,
    branch = META_BRANCH,
    token = githubToken()
} = {}) {
    const head = await githubRequest(`/repos/${repository}/commits/${encodeURIComponent(branch)}`, token);
    const files = await Promise.all([
        readGitHubFile(repository, PATH, head.sha, token),
        readGitHubFile(repository, ERRORS_PATH, head.sha, token)
    ]);
    return gitCacheFromSnapshot({
        repository,
        branch,
        path: PATH,
        errors_path: ERRORS_PATH,
        commit_sha: head.sha,
        blob_sha: files[0].blob_sha,
        errors_blob_sha: files[1].blob_sha,
        text: files[0].text,
        errors_text: files[1].text
    });
}
export function cachedGitMetadata(repositoryId, cache, at = new Date().toISOString()) {
    const record = cache?.records.get(repositoryId);
    const age = Date.parse(at) - Date.parse(record?.checked_at);
    if (
        !Number.isSafeInteger(repositoryId) ||
        !record ||
        record.repository_id !== repositoryId ||
        !repositoryName(record.repository) ||
        !Number.isSafeInteger(record.stars) ||
        record.stars < 0 ||
        typeof record.archived !== 'boolean' ||
        !Number.isFinite(age) ||
        age < 0 ||
        age > 86400000
    )
        return null;
    return {
        repository_id: repositoryId,
        repository: record.repository,
        stars: record.stars,
        archived: record.archived,
        provenance: {
            captured_at: record.checked_at,
            source_repository: cache.repository,
            path: cache.path,
            errors_path: cache.errors_path,
            commit_sha: cache.commit_sha,
            blob_sha: cache.blob_sha,
            errors_blob_sha: cache.errors_blob_sha,
            latest_error: cache.errors.get(repositoryId)?.error ?? null
        }
    };
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

export async function getGithubMetadata(
    { repository, repository_id: repositoryId, checked_at: at = new Date().toISOString() },
    { request = api, cache = readGitMetaCache } = {}
) {
    if (typeof repository !== 'string' || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository))
        throw Error('expected owner/repository');
    if (repositoryId !== undefined && (!Number.isSafeInteger(repositoryId) || repositoryId <= 0))
        throw Error('invalid repository ID');
    if (!metricTimestamp(at)) throw Error('invalid META capture time');
    let gitCache, cacheError;
    try {
        gitCache = await cache();
    } catch (error) {
        cacheError = error.message;
    }
    const result = captureMetadata(repository, request, at, { repositoryId, gitCache });
    if (cacheError) result.errors.push({ target: 'git_meta_cache', message: cacheError });
    return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        const { values, positionals } = parseArgs({
            options: { 'repository-id': { type: 'string' } },
            allowPositionals: true
        });
        if (positionals.length !== 1) throw Error('Usage: github-meta.mjs OWNER/REPO [--repository-id ID]');
        const repositoryId = values['repository-id'] === undefined ? undefined : Number(values['repository-id']);
        if (repositoryId !== undefined && (!Number.isSafeInteger(repositoryId) || repositoryId <= 0))
            throw Error('invalid repository ID');
        console.log(
            JSON.stringify(await getGithubMetadata({ repository: positionals[0], repository_id: repositoryId }))
        );
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
