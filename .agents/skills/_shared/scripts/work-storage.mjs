import {
    existsSync,
    realpathSync,
    readFileSync,
    mkdirSync,
    writeFileSync,
    openSync,
    closeSync,
    unlinkSync
} from 'node:fs';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { createHash } from 'node:crypto';
import Ajv from 'ajv/dist/2020.js';
import { ROOT, read, digest, atomicWrite } from './plugin-data.mjs';

const schema = read(resolve(ROOT, '.agents/skills/_shared/schemas/work-storage.schema.json'));
const ajv = new Ajv({ allErrors: true });
const checks = Object.fromEntries(Object.keys(schema.$defs).map((key) => [key, ajv.compile(schema.$defs[key])]));
function shape(kind, value) {
    if (!checks[kind](value)) fail(`invalid ${kind}: ${ajv.errorsText(checks[kind].errors)}`);
    return value;
}
const facts = ['id', 'repository', 'path', 'revision', 'fingerprints', 'source_urls'];
const pick = (value, keys) => Object.fromEntries(keys.map((key) => [key, value[key]]));
const fail = (message) => {
    throw Error(message);
};
function target(folder, path) {
    if (typeof path !== 'string' || isAbsolute(path) || path.split(/[\\/]/).some((p) => p === '..' || !p))
        fail('invalid work reference');
    const file = resolve(folder, path);
    let ancestor = file;
    while (!existsSync(ancestor)) ancestor = dirname(ancestor);
    const rel = relative(realpathSync(folder), realpathSync(ancestor));
    if (rel === '..' || rel.startsWith('../') || isAbsolute(rel)) fail('work reference escapes round');
    return file;
}
function load(folder, ref) {
    if (!ref || Object.keys(ref).sort().join(',') !== 'path,sha256' || !/^[a-f0-9]{64}$/.test(ref.sha256))
        fail('invalid work reference');
    const value = read(target(folder, ref.path));
    if (digest(value) !== ref.sha256) fail(`work reference digest mismatch: ${ref.path}`);
    return value;
}
function hydrate(index, folder) {
    shape('index', index);
    const expected = [
        'schema_version',
        'base_digest',
        'input_digest',
        'semantic_digest',
        'input',
        'queue',
        'session',
        'records'
    ];
    if (Object.keys(index).length !== expected.length || expected.some((k) => !(k in index)))
        fail('invalid work index');
    const input = load(folder, index.input),
        queue = load(folder, index.queue),
        state = load(folder, index.session);
    if (digest(input) !== index.input_digest) fail('input digest mismatch');
    shape('queue', queue);
    shape('state', state);
    const items = [...input.plugins.map((p) => pick(p, facts)), ...queue.appended_items];
    const assigned = new Set();
    for (const group of queue.groups)
        for (const position of group.indices) {
            if (!Number.isInteger(position) || position < 0 || position >= items.length || assigned.has(position))
                fail('invalid queue indices');
            assigned.add(position);
            items[position] = { ...items[position], changes: group.changes, status: 'pending' };
        }
    if (assigned.size !== items.length) fail('incomplete queue indices');
    const byId = new Map(items.map((item) => [item.id, item]));
    for (const [id, value] of Object.entries(state.states)) {
        if (!byId.has(id) || Object.keys(value).some((k) => !['status', 'reason', 'checkpoint'].includes(k)))
            fail('invalid session state');
        Object.assign(byId.get(id), value);
    }
    const records = Object.fromEntries(Object.entries(index.records).map(([id, ref]) => [id, load(folder, ref)]));
    const work = {
        schema_version: 1,
        base_digest: index.base_digest,
        input_digest: index.input_digest,
        input,
        session: { ...state.header, items },
        records
    };
    if (digest(work) !== index.semantic_digest) fail('work semantic digest mismatch');
    return work;
}
export function readWork(path) {
    const value = read(path);
    if (value.schema_version === 1) return value;
    if (value.schema_version !== 2) fail('unsupported work version');
    return hydrate(value, dirname(resolve(path)));
}
export function readResearchSession(path) {
    const work = resolve(dirname(path), 'WORK.json');
    if (existsSync(work) && read(work).schema_version === 2) {
        if (existsSync(path) && read(path).schema_version === 2) shape('link', read(path));
        return readWork(work).session;
    }
    const value = read(path);
    if (value.schema_version === 2) fail('linked session requires split WORK.json');
    return value;
}
function put(folder, path, value) {
    const file = target(folder, path);
    if (existsSync(file)) {
        if (digest(read(file)) !== digest(value)) fail(`immutable process file differs: ${path}`);
    } else atomicWrite(file, value);
    return { path, sha256: digest(value) };
}
function prepare(path, work) {
    const folder = dirname(resolve(path));
    mkdirSync(folder, { recursive: true });
    const object = (kind, value) => put(folder, `process/${kind}/${digest(value)}.json`, value);
    const groups = new Map();
    work.session.items.forEach((item, index) => {
        const key = JSON.stringify(item.changes);
        if (!groups.has(key)) groups.set(key, { changes: item.changes, indices: [] });
        groups.get(key).indices.push(index);
    });
    const queue = {
        appended_items: work.session.items.slice(work.input.plugins.length).map((item) => pick(item, facts)),
        groups: [...groups.values()]
    };
    const { items, ...header } = work.session;
    const states = Object.fromEntries(
        items
            .filter((item) => item.status !== 'pending' || item.reason !== undefined || item.checkpoint !== undefined)
            .map((item) => [
                item.id,
                Object.fromEntries(
                    ['status', 'reason', 'checkpoint'].filter((k) => item[k] !== undefined).map((k) => [k, item[k]])
                )
            ])
    );
    const index = {
        schema_version: 2,
        base_digest: work.base_digest,
        input_digest: work.input_digest,
        semantic_digest: digest(work),
        input: put(folder, 'INPUT.json', work.input),
        queue: object('queues', queue),
        session: object('sessions', { header, states }),
        records: Object.fromEntries(Object.entries(work.records).map(([id, value]) => [id, object('records', value)]))
    };
    hydrate(index, folder);
    return index;
}
export function saveWork(path, work, split = false) {
    const existing = existsSync(path) ? read(path) : null;
    if (!split && existing?.schema_version !== 2) {
        atomicWrite(path, work);
        atomicWrite(resolve(dirname(path), 'SESSION.json'), work.session);
        return;
    }
    const index = prepare(path, work);
    atomicWrite(path, index);
    atomicWrite(resolve(dirname(path), 'SESSION.json'), { schema_version: 2, work: 'WORK.json' });
}
export function workStorageFiles(path) {
    const index = read(path),
        folder = dirname(resolve(path));
    return index.schema_version === 2
        ? [index.input, index.queue, index.session, ...Object.values(index.records)].map((ref) =>
              target(folder, ref.path)
          )
        : [];
}
const bytesHash = (bytes) => createHash('sha256').update(bytes).digest('hex');
export function migrateWork(path, validate, apply = false) {
    path = resolve(path);
    const folder = dirname(path),
        sessionPath = resolve(folder, 'SESSION.json');
    const locks = [path + '.lock', sessionPath + '.lock'];
    if (locks.some(existsSync)) fail('active process lock; migration refused');
    const work = validate(readWork(path));
    const result = {
        apply,
        format: read(path).schema_version,
        semantic_digest: digest(work),
        original_bytes: readFileSync(path).length
    };
    if (!apply) return result;
    const acquired = [];
    try {
        for (const lock of locks) {
            const fd = openSync(lock, 'wx', 0o600);
            acquired.push([lock, fd]);
        }
        const current = validate(readWork(path));
        if (digest(current) !== result.semantic_digest) fail('work changed during migration');
        const backup = target(folder, 'migration-originals/work-storage-v1');
        if (read(path).schema_version === 1) {
            mkdirSync(backup, { recursive: true });
            for (const source of [path, sessionPath])
                if (existsSync(source)) {
                    const dest = resolve(backup, relative(folder, source)),
                        bytes = readFileSync(source);
                    if (existsSync(dest)) {
                        if (!readFileSync(dest).equals(bytes)) fail('migration original differs');
                    } else writeFileSync(dest, bytes, { flag: 'wx', mode: 0o600, flush: true });
                }
        }
        if (
            result.format === 1 &&
            existsSync(resolve(backup, 'WORK.json')) &&
            digest(read(resolve(backup, 'WORK.json'))) !== digest(current)
        )
            fail('migration original semantic digest differs');
        const auditPath = target(folder, 'WORK-MIGRATION.json');
        const audit = existsSync(auditPath) ? read(auditPath) : null;
        if (audit)
            for (const [name, sha] of Object.entries(audit.originals)) {
                if (
                    !['WORK.json', 'SESSION.json'].includes(name) ||
                    bytesHash(readFileSync(resolve(backup, name))) !== sha
                )
                    fail('migration original checksum differs');
            }
        saveWork(path, current, true);
        validate(readWork(path));
        const originals = Object.fromEntries(
            ['WORK.json', 'SESSION.json']
                .filter((name) => existsSync(resolve(backup, name)))
                .map((name) => [name, bytesHash(readFileSync(resolve(backup, name)))])
        );
        if (!audit)
            atomicWrite(auditPath, {
                schema_version: 1,
                semantic_digest: existsSync(resolve(backup, 'WORK.json'))
                    ? digest(read(resolve(backup, 'WORK.json')))
                    : digest(current),
                originals,
                index_digest: digest(read(path)),
                files: workStorageFiles(path).map((file) => relative(folder, file))
            });
        return { ...result, index_bytes: readFileSync(path).length, files: workStorageFiles(path).length };
    } finally {
        for (const [lock, fd] of acquired.reverse()) {
            closeSync(fd);
            unlinkSync(lock);
        }
    }
}
