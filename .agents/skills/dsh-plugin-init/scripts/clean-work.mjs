import { readWork, workStorageFiles } from '../../_shared/scripts/work-storage.mjs';
import { existsSync, unlinkSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { ROOT, digest } from '../../_shared/scripts/plugin-data.mjs';
import { selectedItems } from './session-state.mjs';
import { readSnapshot, local } from './snapshot-state.mjs';
import { renderSnapshot } from './render-snapshot.mjs';
export function cleanWork(path, root = ROOT, apply = false) {
    const rel = relative(root, resolve(path)).split('\\').join('/');
    if (!/^data\/runs\/\d{4}-\d{2}-\d{2}-\d{2,}\/WORK\.json$/.test(rel)) throw Error('invalid cleanup work path');
    if (existsSync(path + '.lock')) throw Error('active work lock; cleanup refused');
    const work = readWork(path),
        snapshot = readSnapshot(root);
    if (snapshot.transaction?.id !== work.session.id || snapshot.transaction.work_digest !== digest(work))
        throw Error('work not confirmed merged');
    if (selectedItems(work.session).some((p) => p.status !== 'complete'))
        throw Error('incomplete work must be retained');
    renderSnapshot(root, true);
    const folder = dirname(resolve(path));
    const names = new Set([
        path,
        resolve(folder, 'SESSION.json'),
        resolve(folder, 'INPUT.json'),
        ...workStorageFiles(path)
    ]);
    for (const record of Object.values(work.records)) {
        for (const file of record.files ?? []) names.add(local(root, file));
        for (const file of Object.keys(record.artifacts)) names.add(local(root, file));
    }
    const files = [...names]
        .map((p) => resolve(p))
        .filter(
            (p) =>
                p.startsWith(folder + '/') &&
                !p.startsWith(resolve(folder, 'migration-originals') + '/') &&
                p !== resolve(folder, 'WORK-MIGRATION.json') &&
                existsSync(p)
        );
    const result = {
        remove: files.map((p) => relative(root, p)),
        apply,
        note: 'unknown files and failure material are retained'
    };
    if (apply) for (const file of files) unlinkSync(file);
    return result;
}
