import { readNpmMetaCache, cachedNpmDownloads } from './npm-meta-cache.mjs';
import { readGitMetaCache, cachedGitMetadata } from './git-meta-cache.mjs';

const fresh = (captured, at) => {
    const age = Date.parse(at) - Date.parse(captured);
    return Number.isFinite(age) && age >= 0 && age <= 86400000;
};
export function subsetHeat(heat, items) {
    if (!heat) return null;
    const empty = {
        stars: null,
        downloads_30d: null,
        stars_at: null,
        downloads_at: null,
        package_name: null,
        stars_source: null,
        downloads_source: null
    };
    return { ...heat, rows: Object.fromEntries(items.map((item) => [item.id, heat.rows[item.id] ?? { ...empty }])) };
}
export function validateHeat(heat, items, at) {
    if (!heat) return;
    if (heat.version !== 'heat-v1' || heat.checked_at !== at) throw Error('heat cutoff or version mismatch');
    if (Object.keys(heat.rows).length !== items.length || items.some((item) => !Object.hasOwn(heat.rows, item.id)))
        throw Error('heat scope differs from fixed session');
    for (const row of Object.values(heat.rows)) {
        for (const [value, time, source] of [
            [row.stars, row.stars_at, row.stars_source],
            [row.downloads_30d, row.downloads_at, row.downloads_source]
        ]) {
            if (
                value === null
                    ? time !== null || source !== null
                    : !Number.isSafeInteger(value) || value < 0 || !fresh(time, at) || !source
            )
                throw Error('invalid or stale frozen heat metric');
        }
        if (
            row.stars !== null &&
            (!['git-meta', 'formal-meta'].includes(row.stars_source) ||
                (row.stars_source === 'git-meta' && !heat.sources.git))
        )
            throw Error('missing or invalid heat Star provenance');
        if (
            row.downloads_30d !== null &&
            (!['npm-meta', 'formal-meta'].includes(row.downloads_source) ||
                (row.downloads_source === 'npm-meta' && !heat.sources.npm))
        )
            throw Error('missing or invalid heat download provenance');
        if (row.downloads_30d !== null && !row.package_name)
            throw Error('heat downloads require a verified package name');
    }
}
export function heatScores(heat) {
    const rows = Object.values(heat.rows);
    const starMax = rows.reduce((max, row) => Math.max(max, row.stars ?? 0), 0);
    const downloadMax = rows.reduce((max, row) => Math.max(max, row.downloads_30d ?? 0), 0);
    const normalize = (value, max) => (max === 0 ? 0 : Math.log1p(value) / Math.log1p(max));
    return new Map(
        Object.entries(heat.rows).map(([id, row]) => {
            const signals = [];
            if (row.stars !== null) signals.push(normalize(row.stars, starMax));
            if (row.downloads_30d !== null) signals.push(normalize(row.downloads_30d, downloadMax));
            return [
                id,
                signals.length ? (100 * signals.reduce((sum, value) => sum + value, 0)) / signals.length : null
            ];
        })
    );
}
export function sortByHeat(items, heat) {
    if (!heat) return items;
    const scores = heatScores(heat);
    return [...items].sort((a, b) => {
        const left = scores.get(a.id),
            right = scores.get(b.id);
        if (left == null && right != null) return 1;
        if (right == null && left != null) return -1;
        return (right ?? 0) - (left ?? 0) || Buffer.compare(Buffer.from(a.id), Buffer.from(b.id));
    });
}
export async function captureHeat(
    items,
    metadata,
    at,
    { gitCache = readGitMetaCache, npmCache = readNpmMetaCache } = {}
) {
    const [gitResult, npmResult] = await Promise.allSettled([
        Promise.resolve().then(gitCache),
        Promise.resolve().then(npmCache)
    ]);
    const git = gitResult.status === 'fulfilled' ? gitResult.value : null;
    const npm = npmResult.status === 'fulfilled' ? npmResult.value : null;
    return heatFromCaches(items, metadata, at, {
        git,
        npm,
        errors: [
            ...(gitResult.status === 'rejected' ? [`git: ${gitResult.reason.message}`] : []),
            ...(npmResult.status === 'rejected' ? [`npm: ${npmResult.reason.message}`] : [])
        ]
    });
}
export function heatFromCaches(items, metadata, at, { git = null, npm = null, errors = [] } = {}) {
    const rows = {};
    for (const item of items) {
        const previous = metadata[item.id];
        const id = Number(item.id.split(':')[1]);
        const gitMetric = cachedGitMetadata(id, git, at);
        const formalStarsAt = previous?.git_cache?.captured_at ?? previous?.captured_at;
        const formalStars =
            previous?.repository_id === id &&
            Number.isSafeInteger(previous?.stars) &&
            previous.stars >= 0 &&
            fresh(formalStarsAt, at);
        const name =
            previous?.repository_id != null && previous.repository_id !== id
                ? null
                : (previous?.npm?.package_name ?? null);
        const npmMetric = name ? cachedNpmDownloads(name, npm?.records.get(name), at) : null;
        const formalDownloads = name
            ? cachedNpmDownloads(
                  name,
                  {
                      package: name,
                      checked_at: previous.npm.captured_at,
                      window_start: previous.npm.window_start,
                      window_end: previous.npm.window_end,
                      downloads_30d: previous.npm.downloads_30d
                  },
                  at
              )
            : null;
        const downloads = npmMetric ?? formalDownloads;
        rows[item.id] = {
            stars: gitMetric?.stars ?? (formalStars ? previous.stars : null),
            downloads_30d: downloads?.downloads_30d ?? null,
            stars_at: gitMetric?.provenance.captured_at ?? (formalStars ? formalStarsAt : null),
            downloads_at: downloads?.captured_at ?? null,
            package_name: name,
            stars_source: gitMetric ? 'git-meta' : formalStars ? 'formal-meta' : null,
            downloads_source: npmMetric ? 'npm-meta' : formalDownloads ? 'formal-meta' : null
        };
    }
    return {
        version: 'heat-v1',
        checked_at: at,
        sources: {
            git: git
                ? { commit_sha: git.commit_sha, blob_sha: git.blob_sha, errors_blob_sha: git.errors_blob_sha }
                : null,
            npm: npm ? { blob_sha: npm.blob_sha } : null,
            errors
        },
        rows
    };
}
