#!/usr/bin/env node
import { heatScores } from '../../_shared/scripts/heat-score.mjs';
import { captureHeat } from '../../_shared/scripts/research-metrics.mjs';
import {
    migrateSnapshotStorage,
    recoverSnapshotStorage,
    reindexSnapshotStorage
} from '../../_shared/scripts/snapshot-storage.mjs';
import { readWork, migrateWork } from '../../_shared/scripts/work-storage.mjs';
import { existsSync, openSync, closeSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { ROOT, read, digest, atomicWrite } from '../../_shared/scripts/plugin-data.mjs';
import { validateSession, selectedItems } from './session-state.mjs';
import { assessRecommendations } from './assess-recommendations.mjs';
import { renderSnapshot } from './render-snapshot.mjs';
import { snapshotFile, readSnapshot, validateWork } from './snapshot-state.mjs';
import { bootstrap } from './bootstrap-snapshot.mjs';
import { forgetResearch } from './forget-research.mjs';
import {
    startWork,
    stageRecords,
    stageRecord,
    changeBlockRecords,
    reopenRecord,
    changeBlockRecord
} from './research-work.mjs';
import { planSnapshot, applySnapshot } from './snapshot-merge.mjs';
import { cleanWork } from './clean-work.mjs';
export async function main(args = process.argv.slice(2)) {
    const [command, ...rest] = args;
    const { values: v } = parseArgs({
        args: rest,
        options: Object.fromEntries(
            ['input', 'work', 'limit', 'plugin', 'observations', 'report', 'display', 'out', 'plan', 'backup']
                .map((k) => [k, { type: 'string' }])
                .concat([
                    ['apply', { type: 'boolean', default: false }],
                    ['retry-plugin', { type: 'string', multiple: true }]
                ])
        )
    });
    const need = (k) => {
        if (!v[k]) throw Error(`--${k} required`);
        return resolve(v[k]);
    };
    if (command === 'assess-recommendations') {
        console.log(JSON.stringify(assessRecommendations(read(need('input')), ROOT, v.apply)));
        if (v.apply) renderSnapshot();
    } else if (command === 'migrate-storage') {
        const backup = need('backup');
        const file = snapshotFile(ROOT);
        const fd = openSync(file + '.lock', 'wx', 0o600);
        try {
            console.log(JSON.stringify(migrateSnapshotStorage(file, backup)));
        } finally {
            closeSync(fd);
            unlinkSync(file + '.lock');
        }
    } else if (command === 'reindex') {
        const file = snapshotFile(ROOT);
        const fd = openSync(file + '.lock', 'wx', 0o600);
        try {
            console.log(JSON.stringify(reindexSnapshotStorage(file)));
        } finally {
            closeSync(fd);
            unlinkSync(file + '.lock');
        }
    } else if (command === 'recover-storage') {
        const file = snapshotFile(ROOT);
        const fd = openSync(file + '.lock', 'wx', 0o600);
        try {
            console.log(recoverSnapshotStorage(file));
        } finally {
            closeSync(fd);
            unlinkSync(file + '.lock');
        }
    } else if (command === 'bootstrap') {
        bootstrap();
        renderSnapshot();
    } else if (command === 'start') {
        const n = v.limit === undefined ? undefined : Number(v.limit);
        const input = read(need('input'));
        if (existsSync(need('work'))) throw Error('work already exists; resume it');
        const baseline = readSnapshot(ROOT);
        const items = [
            ...new Map([...baseline.catalog.plugins, ...input.plugins].map((item) => [item.id, item])).values()
        ];
        const heat = {
            ...(await captureHeat({ items, metadata: baseline.metadata, checked_at: input.checked_at })),
            base_digest: digest(baseline)
        };
        const w = startWork(input, need('work'), n, ROOT, v['retry-plugin'] ?? [], heat);
        const scores = heatScores(w.session.selection.heat);
        console.log(
            JSON.stringify({
                selected: selectedItems(w.session).length,
                listed: w.session.items.length,
                suppressed: w.session.selection.suppressed_ids.length,
                retry_ids: w.session.selection.retry_ids,
                heat: {
                    version: w.session.selection.heat.version,
                    sources: w.session.selection.heat.sources,
                    coverage: {
                        candidates: Object.keys(w.session.selection.heat.rows).length,
                        stars: Object.values(w.session.selection.heat.rows).filter((row) => row.stars !== null).length,
                        downloads: Object.values(w.session.selection.heat.rows).filter(
                            (row) => row.downloads_30d !== null
                        ).length,
                        both: Object.values(w.session.selection.heat.rows).filter(
                            (row) => row.stars !== null && row.downloads_30d !== null
                        ).length
                    },
                    unknown: Object.values(w.session.selection.heat.rows).filter(
                        (row) => row.stars === null && row.downloads_30d === null
                    ).length,
                    selected: selectedItems(w.session).map((item) => ({
                        id: item.id,
                        score: scores.get(item.id)
                    }))
                }
            })
        );
    } else if (command === 'next') {
        const w = validateWork(readWork(need('work')));
        validateSession(w.session);
        console.log(JSON.stringify(selectedItems(w.session).find((p) => p.status === 'pending') ?? null));
    } else if (command === 'stage-batch') {
        stageRecords(need('work'), read(need('input')));
        console.log('Batch staged; formal snapshot unchanged');
    } else if (command === 'stage') {
        if (!v.plugin) throw Error('--plugin required');
        stageRecord(need('work'), v.plugin, need('observations'), need('report'), need('display'));
        console.log('Record staged; formal snapshot unchanged');
    } else if (command === 'forget') {
        console.log(JSON.stringify(forgetResearch(read(need('input')), ROOT, v.apply)));
        if (v.apply) renderSnapshot();
    } else if (command === 'block-batch') {
        changeBlockRecords(need('work'), read(need('input')));
        console.log('Block batch saved; formal snapshot unchanged');
    } else if (command === 'reopen') {
        console.log(JSON.stringify(reopenRecord(need('work'), read(need('input')), ROOT, v.apply), null, 2));
    } else if (command === 'block' || command === 'retry') {
        if (!v.plugin) throw Error('--plugin required');
        changeBlockRecord(need('work'), v.plugin, command === 'block' ? read(need('input')) : null);
    } else if (command === 'plan') {
        atomicWrite(need('out'), planSnapshot(need('work')));
    } else if (command === 'apply') {
        console.log(applySnapshot(read(need('plan'))));
        renderSnapshot();
    } else if (command === 'render') console.log(JSON.stringify(renderSnapshot()));
    else if (command === 'validate') {
        if (v.work) validateWork(readWork(need('work')));
        else {
            readSnapshot(ROOT);
            renderSnapshot(ROOT, true);
        }
    } else if (command === 'migrate-work') {
        console.log(JSON.stringify(migrateWork(need('work'), validateWork, v.apply)));
    } else if (command === 'clean') console.log(JSON.stringify(cleanWork(need('work'), ROOT, v.apply)));
    else
        throw Error(
            'Usage: snapshot bootstrap|start|next|stage|stage-batch|block|block-batch|reopen|forget|plan|apply|render|validate|assess-recommendations|migrate-storage|reindex|recover-storage|migrate-work|clean'
        );
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
    try {
        await main();
    } catch (e) {
        console.error(e.stack);
        process.exitCode = 1;
    }

export { SNAPSHOT, validateWork, readSnapshot, validateSnapshot } from './snapshot-state.mjs';
export { bootstrap } from './bootstrap-snapshot.mjs';
export { forgetResearch } from './forget-research.mjs';
export {
    startWork,
    stageRecord,
    stageRecords,
    reopenRecord,
    changeBlockRecord,
    changeBlockRecords
} from './research-work.mjs';
export { assertMergeReady, planSnapshot, applySnapshot } from './snapshot-merge.mjs';
export { renderSnapshot } from './render-snapshot.mjs';
export { cleanWork } from './clean-work.mjs';
export { assessRecommendations } from './assess-recommendations.mjs';

export { metadataOnlyIds, cooldownIds } from './research-selection.mjs';
