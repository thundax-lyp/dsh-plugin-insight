import { resolve } from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { ROOT, read } from './plugin-data.mjs';
const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);
const metadataSchema = read(resolve(ROOT, '.agents/skills/_shared/schemas/github-meta.schema.json'));
ajv.addSchema(metadataSchema, 'github-meta.schema.json');
const check = ajv.getSchema('github-meta.schema.json');
const checkNpmResult = ajv.compile(read(resolve(ROOT, '.agents/skills/_shared/schemas/npm-meta-result.schema.json')));
export function validateNpmResult(value) {
    if (!checkNpmResult(value)) throw Error(ajv.errorsText(checkNpmResult.errors));
    validatePublicationFields(value.npm.publication);
    return value;
}
function validatePublicationFields(publication) {
    if (publication?.latest_version != null || publication?.latest_published_at != null) {
        if (!publication.latest_version || !publication.latest_published_at || publication.latest_error !== null)
            throw Error('latest npm release requires version, date and successful capture');
    } else if (publication && Object.hasOwn(publication, 'latest_error') && publication.latest_error === null) {
        throw Error('missing latest npm release requires an explicit error');
    }
}
export function validateMetadata(value) {
    if (!check(value)) throw Error(ajv.errorsText(check.errors));
    validatePublicationFields(value.npm?.publication);
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

// META 缓存与冻结指标共用的时间语义。
// 统一校验 META 的 UTC 时间格式与真实日历日期；缓存是否可用由各业务字段决定。
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
