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

// Adoption is assessed from research; popularity and innovation scores do not determine it.
export const RECOMMENDATION_WEIGHTS = { scenario: 30, advantage: 25, evidence: 25, cost: 20 };
export const RECOMMENDATION_RUBRIC = 'adoption-v1';
export function unassessedRecommendation() {
    return {
        rubric: RECOMMENDATION_RUBRIC,
        decision: 'unassessed',
        score: null,
        criteria: null,
        reason: '尚未按采用推荐标准评估；不表示不推荐。',
        revision: null,
        reviewed_at: null,
        status: 'current',
        evaluator: null,
        evidence_ids: [],
        dependencies: []
    };
}
export function assembleRecommendation(authored, plugin, revision, reviewedAt, evidenceIds) {
    if (!authored || Object.keys(authored).sort().join(',') !== 'criteria,decision,reason')
        throw Error('author recommendation decision, reason and four scored criteria explicitly');
    if (authored.decision === 'unassessed') throw Error('completed new research requires an assessed recommendation');
    const criteria = authored.criteria;
    if (!criteria || Object.keys(criteria).sort().join(',') !== Object.keys(RECOMMENDATION_WEIGHTS).sort().join(','))
        throw Error('recommendation needs all four criteria');
    return {
        rubric: RECOMMENDATION_RUBRIC,
        ...authored,
        score: Object.values(criteria).reduce((sum, item) => sum + item.score, 0),
        revision,
        reviewed_at: reviewedAt,
        status: 'current',
        evaluator: 'ai',
        evidence_ids: evidenceIds,
        dependencies: [{ plugin_id: plugin.id, area: 'code', fingerprint: plugin.fingerprints.code }]
    };
}
export function validateRecommendation(plugin, plugins = null) {
    const r = plugin.recommendation;
    if (!r) return; // Historical observations remain readable; migration materializes unassessed records.
    if (r.decision === 'unassessed') {
        if (
            r.score !== null ||
            r.criteria !== null ||
            r.revision !== null ||
            r.reviewed_at !== null ||
            r.evaluator !== null ||
            r.evidence_ids.length ||
            r.dependencies.length ||
            r.status !== 'current'
        )
            throw Error(`unassessed recommendation must not imply an assessment: ${plugin.id}`);
        return;
    }
    if (!r.criteria || !r.revision || !r.reviewed_at || !r.evaluator)
        throw Error(`assessed recommendation needs version, date, evaluator and criteria: ${plugin.id}`);
    let total = 0;
    for (const [key, weight] of Object.entries(RECOMMENDATION_WEIGHTS)) {
        const item = r.criteria[key];
        const bands = [0, 0.25, 0.5, 0.75, 1].map((n) => Math.round(n * weight));
        if (!item || !bands.includes(item.score) || !item.rationale?.trim())
            throw Error(`invalid recommendation criterion: ${plugin.id}/${key}`);
        total += item.score;
    }
    if (r.score !== total) throw Error(`recommendation score differs from criteria: ${plugin.id}`);
    if (!r.reason.trim() || /[\r\n]/.test(r.reason))
        throw Error('recommendation reason must be a nonempty single line');
    const evidence = new Map(plugin.evidence.map((e) => [e.id, e]));
    if (
        !r.evidence_ids.length ||
        r.evidence_ids.some((id) => !evidence.has(id)) ||
        !r.evidence_ids.some(
            (id) => evidence.get(id)?.kind === 'source_inspection' && evidence.get(id)?.revision === r.revision
        )
    )
        throw Error(`recommendation needs pinned source evidence: ${plugin.id}`);
    const hasHost = r.evidence_ids.some(
        (id) => evidence.get(id).kind === 'host_acceptance' && evidence.get(id).revision === r.revision
    );
    const hasTest = r.evidence_ids.some(
        (id) => evidence.get(id).kind === 'local_test' && evidence.get(id).revision === r.revision
    );
    const evidenceCap = hasHost ? 25 : hasTest ? 19 : 13;
    if (r.criteria.evidence.score > evidenceCap)
        throw Error(`recommendation evidence score exceeds verification level: ${plugin.id}`);
    const own = r.dependencies.find((d) => d.plugin_id === plugin.id && d.area === 'code');
    if (!own || (plugins && r.dependencies.some((d) => !plugins.get(d.plugin_id)?.fingerprints[d.area])))
        throw Error(`recommendation needs known code dependency: ${plugin.id}`);
    if (
        r.status === 'current' &&
        (r.revision !== plugin.fingerprints.code ||
            own.fingerprint !== plugin.fingerprints.code ||
            (plugins && r.dependencies.some((d) => plugins.get(d.plugin_id)?.fingerprints[d.area] !== d.fingerprint)))
    )
        throw Error(`current recommendation has stale dependency: ${plugin.id}`);
    if (
        r.decision === 'install' &&
        !r.evidence_ids.some((id) => {
            const e = evidence.get(id);
            return e.kind === 'host_acceptance' && e.revision === r.revision && e.artifact && e.environment;
        })
    )
        throw Error(`install recommendation needs pinned host acceptance: ${plugin.id}`);
}
export function rankedRecommendations(entries) {
    return entries
        .filter((e) => {
            const r = e.plugin.recommendation;
            return (
                r &&
                ['trial', 'install'].includes(r.decision) &&
                r.status === 'current' &&
                r.revision === e.i.revision &&
                Number.isInteger(r.score) &&
                !e.needsReview &&
                !e.plugin.findings.some((f) => f.status !== 'current')
            );
        })
        .map((e) => ({
            plugin_id: e.i.id,
            kind: e.plugin.recommendation.decision,
            score: e.plugin.recommendation.score,
            summary: e.plugin.recommendation.reason
        }))
        .sort((a, b) => b.score - a.score || (a.plugin_id < b.plugin_id ? -1 : a.plugin_id > b.plugin_id ? 1 : 0));
}
