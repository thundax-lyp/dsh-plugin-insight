import {
    existsSync,
    mkdirSync,
    readFileSync,
    realpathSync,
    openSync,
    closeSync,
    writeFileSync,
    unlinkSync
} from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import Ajv from 'ajv/dist/2020.js';
import { ROOT, read, digest, atomicWrite } from './plugin-data.mjs';

const schema = read(resolve(ROOT, '.agents/skills/_shared/schemas/snapshot-storage.schema.json'));
const check = new Ajv({ allErrors: true, strict: true }).compile(schema);
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
    artifacts: 'map',
    'discovery.plugins': 'keyed-array'
};
const sha = (text) => createHash('sha256').update(text).digest('hex');
const get = (value, key) => key.split('.').reduce((parent, field) => parent?.[field], value);
const set = (value, key, part) => {
    const fields = key.split('.');
    const target = fields.slice(0, -1).reduce((parent, field) => parent[field], value);
    target[fields.at(-1)] = part;
};
const assertIndex = (value) => {
    if (!check(value)) throw Error('invalid snapshot index: ' + new Ajv().errorsText(check.errors));
    for (const [name, section] of Object.entries(value.parts))
        if (sections[name] !== section.kind) throw Error(`unexpected snapshot section: ${name}`);
};
export function hydrateSnapshot(index, load) {
    if (index.schema_version === 1) return index;
    assertIndex(index);
    const fetch = (ref) => {
        if (!ref.path.endsWith(`/${ref.sha256}.json`) || ref.path.split('/').at(-2) !== ref.sha256.slice(0, 2))
            throw Error(`snapshot reference name differs from digest: ${ref.path}`);
        const object = load(ref.path);
        if (digest(object) !== ref.sha256) throw Error(`snapshot object digest mismatch: ${ref.path}`);
        return object;
    };
    const snapshot = structuredClone(fetch(index.head));
    if (snapshot.schema_version !== 1) throw Error('invalid logical snapshot version');
    for (const [name, section] of Object.entries(index.parts)) {
        let value;
        if (section.kind === 'array') value = section.refs.map(fetch);
        else if (section.kind === 'map')
            value = Object.fromEntries(Object.entries(section.refs).map(([key, ref]) => [key, fetch(ref)]));
        else {
            const entries = Object.values(section.refs).flatMap(fetch);
            const byId = new Map(entries.map((item) => [item.id, item]));
            if (
                byId.size !== entries.length ||
                section.order.length !== byId.size ||
                section.order.some((id) => !byId.has(id))
            )
                throw Error('snapshot discovery identity/order mismatch');
            value = section.order.map((id) => byId.get(id));
        }
        set(snapshot, name, value);
    }
    if (digest(snapshot) !== index.snapshot_digest) throw Error('snapshot semantic digest mismatch');
    return snapshot;
}
function objectPath(indexPath, name) {
    if (!/^snapshot\/[a-z-]+\/[a-f0-9]{2}\/[a-f0-9]{64}\.json$/.test(name))
        throw Error('invalid snapshot reference path');
    const folder = dirname(resolve(indexPath));
    const path = resolve(folder, name);
    let existing = path;
    while (!existsSync(existing)) existing = dirname(existing);
    const rel = relative(realpathSync(folder), realpathSync(existing));
    if (rel === '..' || rel.startsWith('../') || rel.startsWith('..\\'))
        throw Error('snapshot reference escapes catalog');
    return path;
}
export function readSnapshotStorage(path) {
    return hydrateSnapshot(read(path), (name) => read(objectPath(path, name)));
}
// Caller owns SNAPSHOT.json.lock. All immutable objects are durable before the index commit point.
export function writeSnapshotStorage(path, snapshot) {
    mkdirSync(dirname(resolve(path)), { recursive: true });
    if (snapshot.schema_version !== 1) throw Error('expected logical snapshot');
    const head = structuredClone(snapshot),
        parts = {};
    const put = (section, value) => {
        const hash = digest(value);
        const name = `snapshot/${section}/${hash.slice(0, 2)}/${hash}.json`;
        const target = objectPath(path, name);
        if (existsSync(target)) {
            if (digest(read(target)) !== hash) throw Error(`immutable snapshot object corrupted: ${name}`);
        } else atomicWrite(target, value);
        return { path: name, sha256: hash };
    };
    for (const [name, kind] of Object.entries(sections)) {
        const value = get(snapshot, name);
        if (value === undefined) continue;
        const label = name.replace(/[._]/g, '-');
        if (kind === 'array') parts[name] = { kind, refs: value.map((item) => put(label, item)) };
        else if (kind === 'map')
            parts[name] = {
                kind,
                refs: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, put(label, item)]))
            };
        else {
            const buckets = new Map();
            for (const item of value) {
                const bucket = sha(item.id).slice(0, 2);
                if (!buckets.has(bucket)) buckets.set(bucket, []);
                buckets.get(bucket).push(item);
            }
            parts[name] = {
                kind,
                order: value.map((item) => item.id),
                refs: Object.fromEntries(
                    [...buckets].sort().map(([key, items]) => [
                        key,
                        put(
                            label,
                            items.sort((a, b) => a.id.localeCompare(b.id))
                        )
                    ])
                )
            };
        }
        set(head, name, kind === 'map' ? {} : []);
    }
    const index = { schema_version: 2, snapshot_digest: digest(snapshot), head: put('head', head), parts };
    assertIndex(index);
    // Read every prepared reference before replacing the only authoritative pointer.
    hydrateSnapshot(index, (name) => read(objectPath(path, name)));
    atomicWrite(path, index);
    return index;
}
export function migrateSnapshotStorage(path, backup) {
    if (resolve(path) === resolve(backup)) throw Error('migration backup must differ from snapshot');
    const fd = openSync(path + '.lock', 'wx', 0o600);
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        const source = read(path);
        if (source.schema_version === 2) {
            readSnapshotStorage(path);
            return { status: 'already_split', digest: source.snapshot_digest };
        }
        const bytes = readFileSync(path);
        mkdirSync(dirname(backup), { recursive: true });
        if (existsSync(backup)) {
            if (!readFileSync(backup).equals(bytes)) throw Error('migration backup differs');
        } else writeFileSync(backup, bytes, { flag: 'wx' });
        const before = digest(source);
        writeSnapshotStorage(path, source);
        if (digest(readSnapshotStorage(path)) !== before) throw Error('snapshot migration semantic mismatch');
        return { status: 'migrated', digest: before, backup };
    } finally {
        closeSync(fd);
        unlinkSync(path + '.lock');
    }
}
