// Scores describe existing contributions; research hypotheses are never scored as shipped capabilities.
export const INNOVATION_WEIGHTS = {
    technical: { novelty: 35, mechanism: 30, transferability: 20, simplification: 15 },
    business: { workflow: 35, delivery: 30, reach: 20, economics: 15 }
};
export const INNOVATION_RUBRIC = 'innovation-v1';
const exactKeys = (value, expected) =>
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === expected.length &&
    expected.every((key) => Object.hasOwn(value, key));
export function validateInnovationScores(plugin, plugins = null) {
    const scores = plugin.innovation_scores;
    if (!scores) return;
    if (Date.parse(scores.reviewed_at) > Date.parse(plugin.last_checked_at))
        throw Error(`innovation review is later than plugin check: ${plugin.id}`);
    const ownCode = scores.dependencies.find((d) => d.plugin_id === plugin.id && d.area === 'code');
    if (!ownCode) throw Error(`innovation scores need own code dependency: ${plugin.id}`);
    if (plugins && scores.dependencies.some((d) => !plugins.get(d.plugin_id)?.fingerprints[d.area]))
        throw Error(`unknown innovation dependency: ${plugin.id}`);
    const evidence = new Map(plugin.evidence.map((e) => [e.id, e]));
    for (const [axis, weights] of Object.entries(INNOVATION_WEIGHTS)) {
        const value = scores[axis];
        const criteria = Object.values(value.criteria);
        const expected = criteria.some((n) => n === null) ? null : criteria.reduce((sum, n) => sum + n, 0);
        if (value.score !== expected) throw Error(`innovation score differs from criteria: ${plugin.id}/${axis}`);
        for (const [name, weight] of Object.entries(weights)) {
            const n = value.criteria[name];
            const bands = [0, 0.25, 0.5, 0.75, 1].map((fraction) => Math.round(weight * fraction));
            if (n !== null && !bands.includes(n))
                throw Error(`innovation criterion is outside rubric bands: ${axis}/${name}`);
        }
        if (value.evidence_ids.some((id) => !evidence.has(id)))
            throw Error(`unknown innovation evidence: ${plugin.id}/${axis}`);
        if (value.score !== null && (value.basis === 'unverified' || !value.evidence_ids.length))
            throw Error(`numeric innovation score needs reviewed evidence: ${plugin.id}/${axis}`);
    }
    if (scores.status === 'current') {
        if (!plugin.evidence.some((e) => e.kind === 'source_inspection' && e.revision === scores.revision))
            throw Error(`innovation scores lack pinned source inspection: ${plugin.id}`);
        if (ownCode.fingerprint !== plugin.fingerprints.code)
            throw Error(`innovation own code dependency is stale: ${plugin.id}`);
        if (
            plugins &&
            scores.dependencies.some((d) => plugins.get(d.plugin_id)?.fingerprints[d.area] !== d.fingerprint)
        )
            throw Error(`innovation dependency is stale: ${plugin.id}`);
    }
}
export function assembleInnovationScores(authored, pluginId, revision, fingerprint, reviewedAt, evidenceId) {
    if (!exactKeys(authored, ['technical', 'business'])) throw Error('author both innovation axes explicitly');
    const axes = {};
    for (const [axis, weights] of Object.entries(INNOVATION_WEIGHTS)) {
        const value = authored[axis];
        if (!exactKeys(value, ['criteria', 'rationale', 'basis']) || !exactKeys(value.criteria, Object.keys(weights)))
            throw Error(`explicit innovation criteria, rationale and basis required: ${axis}`);
        const values = Object.values(value.criteria);
        axes[axis] = {
            ...value,
            score: values.some((n) => n === null) ? null : values.reduce((sum, n) => sum + n, 0),
            evidence_ids: [evidenceId]
        };
    }
    return {
        rubric: INNOVATION_RUBRIC,
        revision,
        reviewed_at: reviewedAt,
        status: 'current',
        dependencies: [{ plugin_id: pluginId, area: 'code', fingerprint }],
        ...axes
    };
}
export function currentInnovationScore(plugin, revision, needsReview = false) {
    const s = plugin.innovation_scores;
    if (
        !s ||
        needsReview ||
        s.rubric !== INNOVATION_RUBRIC ||
        s.status !== 'current' ||
        s.revision !== revision ||
        s.technical.score === null ||
        s.business.score === null
    )
        return null;
    return {
        technical: s.technical.score,
        business: s.business.score,
        total: (s.technical.score + s.business.score) / 2
    };
}
