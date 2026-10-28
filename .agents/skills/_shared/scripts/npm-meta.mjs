import { validateNpmResult, metricTimestamp as dateTime, metricDate as date } from './metadata-validation.mjs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { META_BRANCH, META_PATH, META_REPOSITORY, readGitHubFile } from './github-client.mjs';

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

export function cachedNpmDownloads(packageName, record) {
    if (
        !record ||
        record.package !== packageName ||
        !dateTime(record.checked_at) ||
        !date(record.window_start) ||
        !date(record.window_end) ||
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

export function cachedNpmPublication(packageName, record) {
    if (
        !record ||
        record.package !== packageName ||
        !dateTime(record.checked_at) ||
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

const requestNpm = async (url) => {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw Error(`HTTP ${response.status}`);
    return response.json();
};

export async function captureNpmPublication(name, request = requestNpm, at = new Date().toISOString()) {
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
export async function captureNpmDownloads(name, request = requestNpm, at = new Date().toISOString()) {
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
    return result;
}
export async function resolveNpmMetadata(
    packageName,
    record,
    { downloads = captureNpmDownloads, publication = captureNpmPublication, at = new Date().toISOString() } = {}
) {
    if (typeof packageName !== 'string' || packageName.length > 214 || !PACKAGE_NAME.test(packageName))
        throw Error('invalid npm package name');
    if (!dateTime(at)) throw Error('invalid META capture time');
    const cachedDownloads = cachedNpmDownloads(packageName, record);
    const cachedPublication = cachedNpmPublication(packageName, record);
    const [npm, published] = await Promise.all([
        cachedDownloads ?? downloads(packageName, undefined, at),
        cachedPublication ?? publication(packageName, undefined, at)
    ]);
    return {
        npm: { ...npm, publication: published },
        downloads_source: cachedDownloads ? 'github-meta' : 'npm',
        publication_source: cachedPublication ? 'github-meta' : 'npm'
    };
}

export async function getNpmMetadata(packageName, { cache = readNpmMetaCache, at = new Date().toISOString() } = {}) {
    if (typeof packageName !== 'string' || packageName.length > 214 || !PACKAGE_NAME.test(packageName))
        throw Error('invalid npm package name');
    if (!dateTime(at)) throw Error('invalid META capture time');
    let record,
        cacheError = null;
    try {
        record = (await cache()).records.get(packageName);
    } catch (error) {
        cacheError = error.message;
    }
    return validateNpmResult({ ...(await resolveNpmMetadata(packageName, record, { at })), cache_error: cacheError });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        if (process.argv.length !== 3) throw Error('Usage: npm-meta.mjs PACKAGE');
        console.log(JSON.stringify(await getNpmMetadata(process.argv[2])));
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
