import {
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync,
    renameSync,
    rmSync,
    realpathSync,
    openSync,
    closeSync,
    fsyncSync,
    readdirSync
} from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { ROOT, read, digest } from './plugin-data.mjs';
import Ajv from 'ajv/dist/2020.js';
import { readSnapshotStorage as readLegacy } from './legacy-snapshot-storage.mjs';

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
const schema = read(resolve(ROOT, '.agents/skills/_shared/schemas/component-storage.schema.json'));
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
function safePath(folder, name) {
    const full = resolve(folder, name);
    const rel = relative(folder, full);
    if (!rel || rel.startsWith('..') || rel.startsWith('/')) throw Error('catalog path escapes root');
    let parent = full;
    while (!existsSync(parent)) parent = dirname(parent);
    const actual = relative(realpathSync(folder), realpathSync(parent));
    if (actual.startsWith('..') || actual.startsWith('/')) throw Error('catalog symlink escapes root');
    return full;
}
export function readSnapshotStorage(path) {
    if (!path.endsWith('.jsonl')) return readLegacy(path);
    const folder = dirname(resolve(path));
    const journal = resolve(folder, '.transaction');
    if (existsSync(journal))
        throw Error('catalog transaction interrupted or active; recover-storage after checking writer');
    const text = readFileSync(path, 'utf8');
    const result = hydrateComponentStorage(text, (name, raw) => {
        const full = safePath(folder, name);
        return raw ? readFileSync(full, 'utf8') : read(full);
    });
    if (existsSync(journal) || readFileSync(path, 'utf8') !== text) throw Error('catalog changed while reading; retry');
    return result;
}
function syncedWrite(path, text) {
    const fd = openSync(path, 'wx', 0o600);
    try {
        writeFileSync(fd, text);
        fsyncSync(fd);
    } finally {
        closeSync(fd);
    }
}
function replace(path, text) {
    mkdirSync(dirname(path), { recursive: true });
    const temp = path + `.tmp-${process.pid}`;
    try {
        syncedWrite(temp, text);
        renameSync(temp, path);
    } finally {
        rmSync(temp, { force: true });
    }
}
// Caller holds index.jsonl.lock. Journal preimages permit explicit rollback after interruption.
export function writeSnapshotStorage(path, snapshot) {
    if (!path.endsWith('/index.jsonl')) throw Error('write target must be catalog/index.jsonl');
    if (snapshot.schema_version !== 1) throw Error('expected logical snapshot');
    if (!existsSync(path + '.lock')) throw Error('catalog writer requires index.jsonl.lock');
    const folder = dirname(resolve(path));
    mkdirSync(folder, { recursive: true });
    const transaction = resolve(folder, '.transaction');
    if (existsSync(transaction)) throw Error('catalog transaction requires recovery');
    const head = structuredClone(snapshot),
        orders = {},
        details = new Map(),
        files = new Map();
    for (const [name, kind] of Object.entries(sections)) {
        const value = get(snapshot, name);
        if (value === undefined) continue;
        const entries = kind === 'array' ? value.map((v) => [v.id, v]) : Object.entries(value);
        orders[name] = entries.map(([id]) => id);
        for (const [identity, data] of entries) {
            if (!details.has(identity))
                details.set(identity, { schema_version: 3, id: componentId(identity), identity, data: {} });
            details.get(identity).data[name] = data;
        }
        set(head, name, kind === 'array' ? [] : {});
    }
    const rows = [...details.values()]
        .map((detail) => {
            checked(validateDetail, detail);
            const text = json(detail);
            files.set(componentFile(detail.id), text);
            return checked(validateRow, componentIndex(detail, sha(text)));
        })
        .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    if (new Set(rows.map((r) => r.id)).size !== rows.length) throw Error('MD5 collision');
    const artifacts = {};
    for (const [original, value] of Object.entries(snapshot.artifacts)) {
        const hash = digest(value),
            name = `evidence/${hash.slice(0, 2)}/${hash}.json`;
        files.set(name, json(value));
        artifacts[original] = { path: name, sha256: hash };
    }
    head.artifacts = {};
    const index = rows.map((r) => JSON.stringify(r)).join('\n') + '\n';
    files.set(
        'state.json',
        json({
            schema_version: 3,
            snapshot_digest: digest(snapshot),
            index_sha256: sha(index),
            head,
            orders,
            artifacts
        })
    );
    files.set('index.jsonl', index);
    hydrateComponentStorage(index, (name, raw) => (raw ? files.get(name) : JSON.parse(files.get(name))));
    // Removed components/evidence participate in the same undo transaction.
    const obsolete = new Set();
    if (existsSync(path)) {
        const previousText = readFileSync(path, 'utf8');
        for (const line of previousText.trimEnd().split('\n').filter(Boolean)) {
            const row = checked(validateRow, JSON.parse(line));
            obsolete.add(componentFile(row.id));
        }
        const previousState = read(resolve(folder, 'state.json'));
        for (const ref of Object.values(previousState.artifacts)) obsolete.add(ref.path);
    }
    const removed = [...obsolete].filter((name) => !files.has(name)).map((name) => [name, null]);
    const changed = [...files].filter(
        ([name, text]) => !existsSync(safePath(folder, name)) || readFileSync(safePath(folder, name), 'utf8') !== text
    );
    changed.push(...removed);
    if (!changed.length) return { status: 'unchanged', components: rows.length };
    mkdirSync(transaction);
    try {
        const entries = changed.map(([name], i) => {
            const full = safePath(folder, name),
                existed = existsSync(full);
            if (existed) syncedWrite(resolve(transaction, String(i)), readFileSync(full));
            return { name, existed, backup: String(i) };
        });
        // No official file is changed until the full undo manifest is durable.
        replace(resolve(transaction, 'UNDO.json'), json(entries));
        for (const [name, text] of changed) {
            if (text === null) rmSync(safePath(folder, name));
            else replace(safePath(folder, name), text);
        }
        const result = hydrateComponentStorage(readFileSync(path, 'utf8'), (name, raw) =>
            raw ? readFileSync(safePath(folder, name), 'utf8') : read(safePath(folder, name))
        );
        if (digest(result) !== digest(snapshot)) throw Error('catalog write readback mismatch');
        rmSync(transaction, { recursive: true });
    } catch (error) {
        recoverSnapshotStorage(path);
        throw error;
    }
    return { status: 'written', components: rows.length };
}
export function recoverSnapshotStorage(path) {
    const folder = dirname(resolve(path)),
        transaction = resolve(folder, '.transaction');
    if (!existsSync(transaction)) return 'no_transaction';
    const manifest = resolve(transaction, 'UNDO.json');
    if (existsSync(manifest)) {
        const entries = read(manifest);
        for (const entry of entries) {
            if (!/^[0-9]+$/.test(entry.backup) || typeof entry.existed !== 'boolean')
                throw Error('invalid catalog undo entry');
            const full = safePath(folder, entry.name);
            if (entry.existed) replace(full, readFileSync(resolve(transaction, entry.backup)));
            else rmSync(full, { force: true });
        }
    }
    rmSync(transaction, { recursive: true });
    return 'rolled_back';
}
export function migrateSnapshotStorage(path, backup) {
    if (existsSync(path)) {
        const snapshot = readSnapshotStorage(path);
        return { status: 'already_migrated', digest: digest(snapshot) };
    }
    const backupLocation = relative(dirname(resolve(path)), resolve(backup));
    if (backupLocation !== '..' && !backupLocation.startsWith('../'))
        throw Error('migration originals must be outside the formal catalog');
    const legacy = resolve(dirname(path), 'SNAPSHOT.json');
    const snapshot = readLegacy(legacy);
    mkdirSync(dirname(backup), { recursive: true });
    const bytes = readFileSync(legacy);
    if (existsSync(backup) && !readFileSync(backup).equals(bytes)) throw Error('migration backup differs');
    if (!existsSync(backup)) writeFileSync(backup, bytes, { flag: 'wx' });
    const saveOriginal = (source, target) => {
        const bytes = readFileSync(source);
        mkdirSync(dirname(target), { recursive: true });
        if (existsSync(target)) {
            if (!readFileSync(target).equals(bytes)) throw Error(`migration original differs: ${target}`);
        } else syncedWrite(target, bytes);
    };
    const copyTree = (source, target) => {
        for (const entry of readdirSync(source, { withFileTypes: true })) {
            if (entry.isDirectory()) copyTree(resolve(source, entry.name), resolve(target, entry.name));
            else if (entry.isFile()) saveOriginal(resolve(source, entry.name), resolve(target, entry.name));
            else throw Error('legacy migration refuses symbolic links');
        }
    };
    const oldObjects = resolve(dirname(path), 'snapshot');
    if (existsSync(oldObjects)) copyTree(oldObjects, resolve(dirname(backup), 'snapshot'));
    for (const name of ['PLUGINS.json', 'PUBLICATION.json', 'PLUGIN-PATHS.json']) {
        const source = resolve(dirname(path), name);
        if (existsSync(source)) saveOriginal(source, resolve(dirname(backup), name));
    }
    writeSnapshotStorage(path, snapshot);
    return { status: 'migrated', digest: digest(snapshot), backup };
}
