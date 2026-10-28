import { metricTimestamp as dateTime } from './metadata-validation.mjs';
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
        for (const [value, time, source, validTime] of [
            [row.stars, row.stars_at, row.stars_source, fresh(row.stars_at, at)],
            [row.downloads_30d, row.downloads_at, row.downloads_source, dateTime(row.downloads_at)]
        ]) {
            if (
                value === null
                    ? time !== null || source !== null
                    : !Number.isSafeInteger(value) || value < 0 || !validTime || !source
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
            (!['npm-meta', 'npm-api', 'formal-meta'].includes(row.downloads_source) ||
                (row.downloads_source === 'npm-meta' && !heat.sources.npm))
        )
            throw Error('missing or invalid heat download provenance');
        if (row.downloads_30d !== null && !row.package_name)
            throw Error('heat downloads require a verified package name');
    }
}
export function heatScores(heat) {
    if (!heat?.rows || typeof heat.rows !== 'object' || Array.isArray(heat.rows)) throw Error('heat rows required');
    const rows = Object.values(heat.rows);
    for (const row of rows) {
        if (
            !row ||
            [row.stars, row.downloads_30d].some(
                (value) => value !== null && (!Number.isSafeInteger(value) || value < 0)
            )
        )
            throw Error('heat metrics must be non-negative integers or null');
    }
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
