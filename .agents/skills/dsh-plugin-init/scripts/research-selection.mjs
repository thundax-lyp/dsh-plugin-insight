import { sortByHeat } from '../../_shared/scripts/heat-score.mjs';
// Resolve explicit inputs before defaults; updates never have an independent default.
export function resolveResearchCounts({ limit, newLimit, updateLimit } = {}) {
    for (const [name, value] of Object.entries({ limit, newLimit, updateLimit }))
        if (value !== undefined && (!Number.isSafeInteger(value) || value < (name === 'limit' ? 1 : 0)))
            throw Error(`${name} must be a ${name === 'limit' ? 'positive' : 'non-negative'} safe integer`);
    const total = limit ?? (newLimit !== undefined && updateLimit !== undefined ? newLimit + updateLimit : 40);
    const additions = newLimit ?? (updateLimit !== undefined ? total - updateLimit : Math.floor(total / 2));
    const updates = total - additions;
    if (!Number.isSafeInteger(total) || total < 1 || additions < 0 || updates < 0)
        throw Error('research counts must have a positive safe total and non-negative quotas');
    return {
        total,
        additions,
        updates,
        update_adjusted: updateLimit !== undefined && updateLimit !== updates
    };
}
const conclusionDependencies = (base) =>
    base.catalog.plugins.flatMap((plugin) => [
        ...plugin.findings.flatMap((finding) => finding.dependencies),
        ...(plugin.innovation_scores?.dependencies ?? []),
        ...(plugin.recommendation?.dependencies ?? [])
    ]);
// Compare only observed dimensions; omitted fingerprints retain their research baseline.
// Current scan state stays in WORK; META is refreshed independently.
export function metadataOnlyIds(base, items) {
    const plugins = new Map(base.catalog.plugins.map((plugin) => [plugin.id, plugin]));
    const records = new Map(base.publication.records.map((record) => [record.id, record]));
    const dependencies = conclusionDependencies(base);
    return items
        .filter((item) => {
            const before = records.get(item.id) ?? plugins.get(item.id);
            if (
                !before ||
                !base.reports[item.id] ||
                item.changes.every((change) => change === 'unchanged') ||
                !item.revision ||
                item.revision !== before.fingerprints.code ||
                item.repository !== before.repository ||
                item.path !== before.path ||
                item.changes.some((change) => ['unknown', 'moved', 'removed_from_source'].includes(change))
            )
                return false;
            const areas = Object.keys(item.fingerprints).filter(
                (area) => before.fingerprints[area] !== item.fingerprints[area]
            );
            return (
                areas.every((area) => ['directory', 'maintenance'].includes(area)) &&
                !dependencies.some((dependency) => dependency.plugin_id === item.id && areas.includes(dependency.area))
            );
        })
        .map((item) => item.id);
}
// INIT's frequent-update filter uses the fixed round cutoff, never wall time.
export function cooldownIds(base, items, checkedAt) {
    const dependencies = conclusionDependencies(base);
    const records = new Map(base.publication.records.map((record) => [record.id, record]));
    const plugins = new Map(base.catalog.plugins.map((plugin) => [plugin.id, plugin]));
    return items
        .filter((item) => {
            const plugin = plugins.get(item.id),
                record = records.get(item.id);
            const before = record ?? plugin;
            // A code revision alone is the intended cooldown trigger. Changes to
            // other declared dependencies must retain full research eligibility.
            const changedAreas = new Set(
                Object.keys(item.fingerprints).filter(
                    (area) => area !== 'code' && before?.fingerprints[area] !== item.fingerprints[area]
                )
            );
            const age = Date.parse(checkedAt) - Date.parse(record?.checked_at ?? plugin?.last_checked_at);
            return Boolean(
                base.reports[item.id] &&
                before &&
                item.revision &&
                before.fingerprints.code &&
                item.revision !== before.fingerprints.code &&
                item.repository === before.repository &&
                item.path === before.path &&
                item.changes.includes('content_changed') &&
                !dependencies.some(
                    (dependency) => dependency.plugin_id === item.id && changedAreas.has(dependency.area)
                ) &&
                !item.changes.some((change) => ['unknown', 'moved', 'removed_from_source'].includes(change)) &&
                Number.isFinite(age) &&
                age >= 0 &&
                age < 5 * 24 * 60 * 60 * 1000
            );
        })
        .map((item) => item.id);
}
export function snapshotSelection(
    base,
    items = null,
    retryIds = [],
    metadataPolicy = true,
    cooldownCheckedAt = null,
    heat = null,
    quotas = null
) {
    const published = new Set(base.publication.records.map((record) => record.id));
    const researched = [
        ...new Set([
            ...published,
            ...base.catalog.plugins.filter((plugin) => base.reports[plugin.id]).map((plugin) => plugin.id)
        ])
    ];
    const researchedSet = new Set(researched);
    const blockedSelection = {};
    if (items) {
        const incoming = new Map(items.map((item) => [item.id, item]));
        if (
            new Set(retryIds).size !== retryIds.length ||
            retryIds.some((id) => !incoming.has(id) || !base.research_blocks?.[id])
        )
            throw Error('retry must name distinct known blocked candidates');
        blockedSelection.retry_ids = [...retryIds];
        blockedSelection.suppressed_ids = items
            .filter(
                (item) =>
                    item.revision &&
                    base.research_blocks?.[item.id]?.revision === item.revision &&
                    !retryIds.includes(item.id)
            )
            .map((item) => item.id);
    }
    return {
        mode: 'incremental',
        ...(quotas ? { quotas } : {}),
        ...(heat ? { heat } : {}),
        ...blockedSelection,
        ...(metadataPolicy ? { metadata_only_ids: metadataOnlyIds(base, items ?? []) } : {}),
        ...(cooldownCheckedAt !== null ? { cooldown_ids: cooldownIds(base, items ?? [], cooldownCheckedAt) } : {}),
        researched_ids: researched,
        review_required_ids: base.catalog.plugins
            .filter(
                (plugin) =>
                    researchedSet.has(plugin.id) &&
                    (!published.has(plugin.id) ||
                        plugin.findings.some((finding) => finding.status === 'needs_review') ||
                        plugin.innovation_scores?.status === 'needs_review' ||
                        plugin.recommendation?.status === 'needs_review')
            )
            .map((plugin) => plugin.id)
    };
}

// Discovery membership is not completed research; quotas classify against completed research.
export function incrementalSelection(session) {
    const researched = new Set(session.selection.researched_ids);
    const required = new Set(session.selection.review_required_ids);
    const suppressed = new Set(session.selection.suppressed_ids ?? []);
    const retries = new Set(session.selection.retry_ids ?? []);
    const metadataOnly = new Set(session.selection.metadata_only_ids ?? []);
    const cooldown = new Set(session.selection.cooldown_ids ?? []);
    const eligible = session.items.filter(
        (item) => !suppressed.has(item.id) && (!cooldown.has(item.id) || required.has(item.id) || retries.has(item.id))
    );
    const updates = eligible.filter(
        (item) =>
            researched.has(item.id) &&
            (retries.has(item.id) ||
                required.has(item.id) ||
                (!metadataOnly.has(item.id) && item.changes.some((change) => change !== 'unchanged')))
    );
    const additions = eligible.filter((item) => !researched.has(item.id));
    const priority = eligible.filter((item) => retries.has(item.id));
    if (session.selection.quotas) {
        const { additions: newLimit, updates: updateLimit } = session.selection.quotas;
        const pick = (items, count) =>
            [
                ...priority.filter((item) => items.some((candidate) => candidate.id === item.id)),
                ...sortByHeat(
                    items.filter((item) => !retries.has(item.id)),
                    session.selection.heat
                )
            ].slice(0, count);
        const selected = [...pick(updates, updateLimit), ...pick(additions, newLimit)];
        return [
            ...priority.filter((item) => selected.includes(item)),
            ...selected.filter((item) => !retries.has(item.id))
        ].map((item) => item.id);
    }
    // Historical WORK without quotas retains its original update-first selection.
    return [
        ...priority,
        ...sortByHeat(
            updates.filter((item) => !retries.has(item.id)),
            session.selection.heat
        ),
        ...sortByHeat(
            additions.filter((item) => !retries.has(item.id)),
            session.selection.heat
        )
    ]
        .slice(0, session.research_limit)
        .map((item) => item.id);
}
