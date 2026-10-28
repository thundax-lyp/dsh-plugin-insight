import { normalizeCatalogSnapshot, writeSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { existsSync, readFileSync, mkdirSync, writeFileSync, openSync, closeSync, unlinkSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { ROOT, read, digest } from '../../_shared/scripts/plugin-data.mjs';
import { CATALOG, PUBLICATION, REGISTRY } from '../../_shared/scripts/data-paths.mjs';
import { snapshotFile, local, recordFor, hash, validateSnapshot, readSnapshot } from './snapshot-state.mjs';
export function bootstrap(root = ROOT) {
    if (existsSync(snapshotFile(root))) throw Error('snapshot already exists');
    const catalog = read(resolve(root, CATALOG));
    const publication = read(resolve(root, PUBLICATION));
    const manifests = [...new Set([...(publication.manifests ?? []), publication.manifest])].map((p) =>
        read(local(root, p))
    );
    const records = new Map();
    for (const manifest of manifests)
        for (const item of manifest.items) records.set(item.id, { item, checked_at: manifest.checked_at });
    const result = {
        schema_version: 1,
        checked_at: manifests.at(-1).checked_at,
        catalog,
        publication: structuredClone(publication),
        registry: read(resolve(root, REGISTRY)),
        discovery: { sources: manifests.at(-1).sources, plugins: [], complete_baseline: false },
        reports: {},
        metadata: {},
        artifacts: {},
        unavailable_artifacts: [],
        limitations: [],
        transaction: null
    };
    result.publication.records = [];
    result.publication.checked_at = result.checked_at;
    delete result.publication.manifest;
    delete result.publication.manifests;
    for (const { item, checked_at } of records.values())
        if (item.status === 'complete') {
            const plugin = catalog.plugins.find((p) => p.id === item.id);
            result.publication.records.push(recordFor(item, plugin, checked_at));
            result.reports[item.id] = readFileSync(
                local(root, `${result.registry[item.id]}/INSIGHT.md`),
                'utf8'
            ).replace(/\[([^\]]+)\]\([^)]*manifests\/[^)]*\)/g, '$1（旧流程记录）');
            result.metadata[item.id] = read(local(root, publication.metadata[item.id]));
        }
    for (const plugin of catalog.plugins)
        for (const evidence of plugin.evidence)
            if (evidence.artifact) {
                const path = local(root, evidence.artifact);
                if (existsSync(path)) {
                    const content = readFileSync(path, 'utf8');
                    result.artifacts[evidence.artifact] = { content, sha256: hash(content) };
                } else result.unavailable_artifacts.push(evidence.artifact);
            }
    result.unavailable_artifacts = [...new Set(result.unavailable_artifacts)];
    if (result.unavailable_artifacts.length)
        result.limitations.push(
            '迁移保留已有分析及证据描述；unavailable_artifacts 中的历史原件当前缺失，未重建、未重新验证，也不作为本轮新证据。'
        );
    result.limitations.push('首次迁移只知道当前研究档案，不拥有历史完整来源成员清单；未入档对象的历史变化为 unknown。');
    result.catalog.runs = [];
    validateSnapshot(result, root);
    const file = snapshotFile(root);
    mkdirSync(dirname(file), { recursive: true });
    const fd = openSync(file + '.lock', 'wx', 0o600);
    try {
        if (existsSync(file)) throw Error('snapshot appeared during bootstrap');
        writeSnapshotStorage(file, normalizeCatalogSnapshot(result));
    } finally {
        closeSync(fd);
        unlinkSync(file + '.lock');
    }
    return result;
}
