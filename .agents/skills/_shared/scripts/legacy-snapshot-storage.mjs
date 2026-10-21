import { existsSync, realpathSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import { ROOT, read, digest } from './plugin-data.mjs';

const schema = read(resolve(ROOT, '.agents/skills/_shared/schemas/legacy-snapshot-storage.schema.json'));
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
