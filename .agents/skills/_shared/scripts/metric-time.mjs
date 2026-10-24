// Cache producers emit UTC ISO timestamps; reject Date.parse's permissive
// date-only strings and calendar rollover before a cache can be considered fresh.
export function metricTimestamp(value) {
    if (typeof value !== 'string') return false;
    const match = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(?:\.(\d{1,3}))?Z$/.exec(value);
    if (!match) return false;
    const time = Date.parse(value);
    return Number.isFinite(time) && new Date(time).toISOString() === `${match[1]}.${(match[2] ?? '').padEnd(3, '0')}Z`;
}
export function metricDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    return metricTimestamp(`${value}T00:00:00Z`);
}
