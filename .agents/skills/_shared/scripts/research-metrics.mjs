import { readGitMetaCache, cachedGitMetadata } from './github-meta.mjs';
import { readNpmMetaCache, cachedNpmDownloads, getNpmMetadata } from './npm-meta.mjs';
import { metricTimestamp } from './metadata-validation.mjs';
const fresh = (captured, at) =>
    metricTimestamp(captured) &&
    Date.parse(at) >= Date.parse(captured) &&
    Date.parse(at) - Date.parse(captured) <= 86400000;
export async function captureHeat(
    { items, metadata, checked_at: at },
    { gitCache = readGitMetaCache, npmCache = readNpmMetaCache, npmMetadata = getNpmMetadata } = {}
) {
    if (
        !Array.isArray(items) ||
        !metadata ||
        typeof metadata !== 'object' ||
        !metricTimestamp(at) ||
        items.some((item) => typeof item.id !== 'string' || !/^github:[1-9][0-9]*:[^:]+$/.test(item.id))
    )
        throw Error('invalid fixed metric input');
    const [gitResult, npmResult] = await Promise.allSettled([
        Promise.resolve().then(gitCache),
        Promise.resolve().then(npmCache)
    ]);
    const git = gitResult.status === 'fulfilled' ? gitResult.value : null;
    const npm = npmResult.status === 'fulfilled' ? npmResult.value : null;
    const heat = heatFromCaches(items, metadata, at, {
        git,
        npm,
        errors: [
            ...(gitResult.status === 'rejected' ? [`git: ${gitResult.reason.message}`] : []),
            ...(npmResult.status === 'rejected' ? [`npm: ${npmResult.reason.message}`] : [])
        ]
    });
    const missing = [
        ...new Set(
            Object.values(heat.rows)
                .filter((row) => row.package_name && row.downloads_30d === null)
                .map((row) => row.package_name)
        )
    ];
    const acquired = new Map();
    let cursor = 0;
    await Promise.all(
        Array.from({ length: Math.min(4, missing.length) }, async () => {
            while (cursor < missing.length) {
                const name = missing[cursor++];
                try {
                    const result = await npmMetadata(name, { cache: async () => npm ?? { records: new Map() }, at });
                    if (result.npm.error) heat.sources.errors.push(`npm ${name}: ${result.npm.error}`);
                    else acquired.set(name, result);
                } catch (error) {
                    heat.sources.errors.push(`npm ${name}: ${error.message}`);
                }
            }
        })
    );
    for (const row of Object.values(heat.rows)) {
        const result = acquired.get(row.package_name);
        if (row.downloads_30d === null && result) {
            row.downloads_30d = result.npm.downloads_30d;
            row.downloads_at = result.npm.captured_at;
            row.downloads_source = result.downloads_source === 'github-meta' ? 'npm-meta' : 'npm-api';
        }
    }
    return heat;
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
