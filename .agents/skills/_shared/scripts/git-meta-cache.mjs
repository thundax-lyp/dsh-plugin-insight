import { META_BRANCH, META_REPOSITORY, githubToken, githubRequest, readGitHubFile } from './github-file.mjs';
const PATH = 'data/GIT-META.jsonl';
const ERRORS_PATH = 'data/GIT-ERRORS.jsonl';
import { metricTimestamp as timestamp } from './metric-time.mjs';
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
