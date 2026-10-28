import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { ROOT, digest } from '../../_shared/scripts/plugin-data.mjs';
import { renderPublication } from './render-research.mjs';
import { readSnapshot, hash, local } from './snapshot-state.mjs';
export function renderSnapshot(root = ROOT, checkOnly = false) {
    const snapshot = readSnapshot(root),
        before = digest(snapshot),
        result = renderPublication(snapshot.publication, root, snapshot);
    const retained = Object.entries(snapshot.retained_documents ?? {}).map(([id, document]) => {
        const expected = `${snapshot.registry[id]}/INSIGHT.md`;
        if (
            document.path !== expected ||
            hash(document.content) !== document.sha256 ||
            snapshot.publication.records.some((r) => r.id === id)
        )
            throw Error('invalid retained publication');
        return [expected, document.content];
    });
    const outputs = [
        ['README.md', result.readme],
        ...retained,
        [snapshot.publication.catalog_page, result.catalog],
        ...result.details.map((d) => [d.path, d.content]),
        ...result.categoryPages.map((d) => [d.path, d.content])
    ];
    for (const [path, content] of outputs) {
        const full = local(root, path);
        if (checkOnly) {
            if (!existsSync(full) || readFileSync(full, 'utf8') !== content)
                throw Error(`generated snapshot output differs: ${path}`);
        } else {
            mkdirSync(dirname(full), { recursive: true });
            writeFileSync(full, content);
        }
    }
    if (digest(readSnapshot(root)) !== before) throw Error('snapshot changed while rendering; rerun generation');
    return { status: checkOnly ? 'matches' : 'generated', snapshot_digest: before, files: outputs.length };
}
