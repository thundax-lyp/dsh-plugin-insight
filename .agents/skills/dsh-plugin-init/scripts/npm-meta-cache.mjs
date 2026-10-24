import { META_BRANCH, META_PATH, META_REPOSITORY, readGitHubFile } from './github-file.mjs';

const PACKAGE_NAME = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/;
const META_KEYS = new Set([
    'package',
    'checked_at',
    'window_start',
    'window_end',
    'downloads_30d',
    'first_published_at',
    'latest_version',
    'latest_published_at',
    'error'
]);
const bytewise = (left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right));
const dateTime = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value));
const date = (value) =>
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && dateTime(`${value}T00:00:00Z`);
const DAY_MS = 86400000;
const freshAt = (checkedAt, at) => {
    const age = Date.parse(at) - Date.parse(checkedAt);
    return dateTime(at) && dateTime(checkedAt) && age >= 0 && age <= DAY_MS;
};
const downloadWindowAt = (at) => {
    const end = new Date(Date.parse(at));
    end.setUTCHours(0, 0, 0, 0);
    end.setUTCDate(end.getUTCDate() - 1);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 29);
    return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
};

function validateError(value, line) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error(`invalid META error at line ${line}`);
    const keys = Object.keys(value);
    if (
        keys.some((key) => !['checked_at', 'code', 'message'].includes(key)) ||
        !keys.includes('checked_at') ||
        !keys.includes('code') ||
        !keys.includes('message') ||
        !dateTime(value.checked_at) ||
        typeof value.code !== 'string' ||
        !value.code ||
        typeof value.message !== 'string' ||
        !value.message
    )
        throw Error(`invalid META error at line ${line}`);
}

export function parseNpmMeta(text) {
    if (text === '') return new Map();
    if (!text.endsWith('\n')) throw Error('remote META must end with a newline');
    const records = new Map();
    let previous = null;
    for (const [index, line] of text.slice(0, -1).split('\n').entries()) {
        if (!line) throw Error(`blank META line: ${index + 1}`);
        let record;
        try {
            record = JSON.parse(line);
        } catch (error) {
            throw Error(`invalid META JSON at line ${index + 1}: ${error.message}`);
        }
        if (!record || typeof record !== 'object' || Array.isArray(record))
            throw Error(`invalid META record at line ${index + 1}`);
        if (Object.keys(record).some((key) => !META_KEYS.has(key)))
            throw Error(`unknown META field at line ${index + 1}`);
        const packageName = record.package;
        if (typeof packageName !== 'string' || packageName.length > 214 || !PACKAGE_NAME.test(packageName))
            throw Error(`invalid META package at line ${index + 1}`);
        if (previous !== null && bytewise(previous, packageName) >= 0)
            throw Error('remote META package names must be unique and bytewise sorted');
        previous = packageName;
        if (record.checked_at !== undefined && !dateTime(record.checked_at))
            throw Error(`invalid META checked_at at line ${index + 1}`);
        if (record.window_start !== undefined && !date(record.window_start))
            throw Error(`invalid META window_start at line ${index + 1}`);
        if (record.window_end !== undefined && !date(record.window_end))
            throw Error(`invalid META window_end at line ${index + 1}`);
        if (
            record.downloads_30d !== undefined &&
            (!Number.isSafeInteger(record.downloads_30d) || record.downloads_30d < 0)
        )
            throw Error(`invalid META downloads_30d at line ${index + 1}`);
        if (record.first_published_at !== undefined && !dateTime(record.first_published_at))
            throw Error(`invalid META first_published_at at line ${index + 1}`);
        if (
            record.latest_version !== undefined &&
            (typeof record.latest_version !== 'string' || !record.latest_version)
        )
            throw Error(`invalid META latest_version at line ${index + 1}`);
        if (record.latest_published_at !== undefined && !dateTime(record.latest_published_at))
            throw Error(`invalid META latest_published_at at line ${index + 1}`);
        if (record.error !== undefined) validateError(record.error, index + 1);
        records.set(packageName, record);
    }
    return records;
}

export async function readNpmMetaCache({
    repository = META_REPOSITORY,
    path = META_PATH,
    branch = META_BRANCH,
    token
} = {}) {
    const file = await readGitHubFile(repository, path, branch, token);
    return { ...file, repository, path, branch, records: parseNpmMeta(file.text) };
}

export function cachedNpmDownloads(packageName, record, at = new Date().toISOString()) {
    const expectedWindow = dateTime(at) ? downloadWindowAt(at) : { start: null, end: null };
    if (
        !record ||
        record.package !== packageName ||
        !freshAt(record.checked_at, at) ||
        !date(record.window_start) ||
        !date(record.window_end) ||
        record.window_start !== expectedWindow.start ||
        record.window_end !== expectedWindow.end ||
        !Number.isSafeInteger(record.downloads_30d) ||
        record.downloads_30d < 0
    )
        return null;
    return {
        package_name: packageName,
        captured_at: record.checked_at,
        window_start: record.window_start,
        window_end: record.window_end,
        downloads_30d: record.downloads_30d,
        source_url: `https://api.npmjs.org/downloads/point/${record.window_start}:${record.window_end}/${encodeURIComponent(packageName)}`,
        error: null
    };
}

export function cachedNpmPublication(packageName, record, at = new Date().toISOString()) {
    if (
        !record ||
        record.package !== packageName ||
        !freshAt(record.checked_at, at) ||
        !dateTime(record.first_published_at) ||
        typeof record.latest_version !== 'string' ||
        !record.latest_version ||
        !dateTime(record.latest_published_at)
    )
        return null;
    return {
        first_published_at: record.first_published_at,
        captured_at: record.checked_at,
        source_url: `https://registry.npmjs.org/${encodeURIComponent(packageName)}`,
        error: null,
        latest_version: record.latest_version,
        latest_published_at: record.latest_published_at,
        latest_error: null
    };
}

export async function resolveNpmMetadata(
    packageName,
    record,
    { downloads, publication, at = new Date().toISOString() }
) {
    const cachedDownloads = cachedNpmDownloads(packageName, record, at);
    const cachedPublication = cachedNpmPublication(packageName, record, at);
    if (!cachedDownloads) {
        const npm = await downloads(packageName, undefined, at, { publication: cachedPublication ?? undefined });
        if (cachedPublication) npm.publication = cachedPublication;
        return {
            npm,
            downloads_source: 'npm',
            publication_source: cachedPublication ? 'github-meta' : 'npm'
        };
    }
    return {
        npm: {
            ...cachedDownloads,
            publication: cachedPublication ?? (await publication(packageName, undefined, at))
        },
        downloads_source: 'github-meta',
        publication_source: cachedPublication ? 'github-meta' : 'npm'
    };
}
