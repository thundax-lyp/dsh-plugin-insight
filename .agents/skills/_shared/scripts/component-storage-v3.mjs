// Read-only compatibility for the retired v3 storage layout.
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { ROOT, read, digest } from './plugin-data.mjs';
import Ajv from 'ajv/dist/2020.js';

const sha = (text) => createHash('sha256').update(text).digest('hex');
export const componentId = (identity) => {
    if (!/^github:[1-9][0-9]*:.+$/.test(identity)) throw Error(`invalid component identity: ${identity}`);
    return createHash('md5').update(identity, 'utf8').digest('hex');
};
export const componentFile = (id) => {
    if (!/^[a-f0-9]{32}$/.test(id)) throw Error('invalid component ID');
    return `components/${id.slice(0, 2)}/${id}.json`;
};
const json = (value) => JSON.stringify(value, null, 4) + '\n';
const sections = {
    'catalog.plugins': 'array',
    'publication.records': 'array',
    'publication.metadata': 'map',
    'publication.summaries': 'map',
    'publication.capabilities': 'map',
    'publication.advice': 'map',
    registry: 'map',
    research_blocks: 'map',
    reports: 'map',
    metadata: 'map',
    'discovery.plugins': 'array'
};
const get = (obj, path) => path.split('.').reduce((v, k) => v?.[k], obj);
const set = (obj, path, value) => {
    const keys = path.split('.');
    keys.slice(0, -1).reduce((v, k) => v[k], obj)[keys.at(-1)] = value;
};
const schema = read(resolve(ROOT, '.agents/skills/_shared/schemas/component-storage-v3.schema.json'));
const ajv = new Ajv({ strict: true, allErrors: true });
const validateRow = ajv.compile({ ...schema, $ref: '#/$defs/index' });
const validateDetail = ajv.compile({ ...schema, $ref: '#/$defs/detail' });
const validateState = ajv.compile({ ...schema, $ref: '#/$defs/state' });
function checked(validate, value) {
    if (!validate(value)) throw Error(ajv.errorsText(validate.errors));
    return value;
}
export function componentIndex(detail, checksum) {
    const plugin = detail.data['catalog.plugins'];
    const discovery = detail.data['discovery.plugins'];
    const recommendation = plugin?.recommendation;
    return {
        id: detail.id,
        identity: detail.identity,
        repository_id: Number(detail.identity.split(':')[1]),
        component_id: detail.identity.split(':').slice(2).join(':'),
        repository: plugin?.repository ?? discovery?.repository ?? null,
        name: plugin?.name ?? null,
        entry_type: plugin?.entry_type ?? null,
        technical_category: plugin?.technical_category ?? null,
        business_category: plugin?.business_category ?? null,
        tags: plugin?.tags ?? [],
        availability: plugin?.availability ?? null,
        research_depth: plugin?.research_depth ?? null,
        recommendation: recommendation?.decision ?? 'unassessed',
        recommendation_reason: recommendation?.reason ?? null,
        score: recommendation?.score?.total ?? recommendation?.score ?? null,
        recommendation_status: recommendation?.status ?? null,
        published: Object.hasOwn(detail.data, 'publication.records'),
        directory: detail.data.registry ?? null,
        sha256: checksum
    };
}
// Also used for Git-tree reads by the META PR validator. No filesystem assumptions.
export function hydrateComponentStorage(indexText, load) {
    const state = checked(validateState, load('state.json'));
    for (const [name, kind] of Object.entries(sections)) {
        const value = get(state.head, name);
        if (
            value !== undefined &&
            (kind === 'array'
                ? !Array.isArray(value) || value.length !== 0
                : !value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== 0)
        )
            throw Error('state must not duplicate component data');
        if (value !== undefined && !Object.hasOwn(state.orders, name)) throw Error(`missing section order: ${name}`);
    }
    if (Object.keys(state.head.artifacts ?? {}).length) throw Error('state must not duplicate evidence');
    if (state.schema_version !== 3 || state.index_sha256 !== sha(indexText))
        throw Error('catalog state/index mismatch');
    if (!indexText.endsWith('\n')) throw Error('catalog index requires final newline');
    const rows = (indexText === '\n' ? [] : indexText.slice(0, -1).split('\n')).map((line) => {
        const row = checked(validateRow, JSON.parse(line));
        if (JSON.stringify(row) !== line) throw Error('index row must be compact JSON');
        return row;
    });
    const details = new Map();
    let previous = '';
    for (const row of rows) {
        if (row.id <= previous || componentId(row.identity) !== row.id) throw Error('catalog identity/order mismatch');
        previous = row.id;
        const text = load(componentFile(row.id), true);
        if (sha(text) !== row.sha256) throw Error(`component checksum mismatch: ${row.id}`);
        const detail = checked(validateDetail, JSON.parse(text));
        if (json(detail) !== text) throw Error(`component formatting mismatch: ${row.id}`);
        if (
            detail.id !== row.id ||
            detail.identity !== row.identity ||
            digest(componentIndex(detail, row.sha256)) !== digest(row)
        )
            throw Error(`component index differs: ${row.id}`);
        details.set(detail.identity, detail);
    }
    const snapshot = structuredClone(state.head);
    const used = new Set();
    for (const [name, order] of Object.entries(state.orders)) {
        if (!Object.hasOwn(sections, name) || !Array.isArray(order) || new Set(order).size !== order.length)
            throw Error(`invalid catalog section/order: ${name}`);
        const entries = order.map((identity) => {
            const detail = details.get(identity);
            if (!detail || !Object.hasOwn(detail.data, name))
                throw Error(`missing component section: ${identity}/${name}`);
            const value = detail.data[name];
            if (sections[name] === 'array' && value.id !== identity) throw Error('component payload identity mismatch');
            used.add(`${identity}\n${name}`);
            return [identity, value];
        });
        set(snapshot, name, sections[name] === 'array' ? entries.map(([, v]) => v) : Object.fromEntries(entries));
    }
    for (const [identity, detail] of details)
        for (const name of Object.keys(detail.data))
            if (!used.has(`${identity}\n${name}`)) throw Error('unreferenced component section');
    snapshot.artifacts = Object.fromEntries(
        Object.entries(state.artifacts).map(([original, ref]) => {
            if (!/^evidence\/[a-f0-9]{2}\/[a-f0-9]{64}\.json$/.test(ref.path)) throw Error('invalid evidence path');
            if (!ref.path.endsWith(`/${ref.sha256}.json`) || ref.path.split('/')[1] !== ref.sha256.slice(0, 2))
                throw Error('evidence path/digest mismatch');
            const value = load(ref.path);
            if (digest(value) !== ref.sha256 || sha(value.content) !== value.sha256)
                throw Error('evidence checksum mismatch');
            return [original, value];
        })
    );
    if (digest(snapshot) !== state.snapshot_digest) throw Error('catalog semantic digest mismatch');
    return snapshot;
}
