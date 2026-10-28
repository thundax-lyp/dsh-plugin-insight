#!/usr/bin/env node
import { validateDisplay } from '../../_shared/scripts/publication-validation.mjs';
import { createGitReference, gitReferenceUrl } from '../../_shared/scripts/git-reference.mjs';
import { validateResearchQuestions, renderResearchQuestions } from './research-questions.mjs';
import { readSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { assembleRecommendation, assembleInnovationScores } from '../../_shared/scripts/research-scoring.mjs';

import { readWork } from '../../_shared/scripts/work-storage.mjs';
// Assemble only an explicitly authored, complete single-plugin analysis; never infer findings from inventory.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { ROOT, read, digest, atomicWrite, validateObservations } from '../../_shared/scripts/plugin-data.mjs';
import { pluginDirectory, researchDataDirectory } from '../../_shared/scripts/data-paths.mjs';
// Read regular blobs at the pinned revision; checkout symlinks are never followed.
export function readPinnedSource(checkout, revision, name) {
    if (
        typeof name !== 'string' ||
        name.startsWith('/') ||
        name.split(/[\\/]/).some((part) => !part || part === '..' || part === '.')
    )
        throw Error('unsafe inspected path');
    const entry = execFileSync('git', ['-C', checkout, 'ls-tree', '-z', revision, '--', name], { encoding: 'utf8' });
    if (!entry) return null;
    const match = /^(100644|100755) blob ([a-f0-9]+)\t([^\0]+)\0$/.exec(entry);
    if (!match || match[3] !== name) throw Error(`inspected path must be a pinned regular file: ${name}`);
    return execFileSync('git', ['-C', checkout, 'cat-file', 'blob', match[2]], {
        encoding: 'utf8',
        maxBuffer: 32 * 1024 * 1024
    });
}
export function sourceMembership(work, item, source) {
    if (work.input.plugins.some((plugin) => plugin.id === item.id && plugin.source_urls.includes(source)))
        return 'present';
    return work.session.sources.find((value) => value.url === source)?.complete ? 'removed' : 'unknown';
}
export function assembleInsight(workPath, pluginId, analysisPath) {
    const work = readWork(resolve(workPath)),
        analysis = read(resolve(analysisPath));
    const required = [
        'research_questions',
        'name',
        'summary',
        'scenario',
        'mechanism',
        'conclusion_status',
        'contribution',
        'critical_question',
        'innovation_hypothesis',
        'conclusion_findings',
        'innovation_scores',
        'recommendation',
        'scope',
        'distribution',
        'cost',
        'adoption',
        'value',
        'engineering',
        'dependencies',
        'workflow',
        'baseline',
        'verification',
        'source_paths',
        'capabilities',
        'technical_category',
        'business_category'
    ];
    if (
        Object.keys(analysis).some((k) => !required.includes(k) && k !== 'capability_table') ||
        required.some((k) => analysis[k] === undefined)
    )
        throw Error('authored single-plugin analysis fields are incomplete or unknown');
    for (const key of required.filter(
        (k) =>
            ![
                'research_questions',
                'source_paths',
                'capabilities',
                'innovation_scores',
                'recommendation',
                'conclusion_findings'
            ].includes(k)
    ))
        if (typeof analysis[key] !== 'string' || !analysis[key].trim()) throw Error(`analysis text required: ${key}`);
    if (
        analysis.capability_table !== undefined &&
        (typeof analysis.capability_table !== 'string' || !analysis.capability_table.trim())
    )
        throw Error('capability_table must be authored nonempty Markdown');
    const conclusions = ['contribution', 'critical_question', 'innovation_hypothesis'];
    const exactKeys = (value, keys) =>
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value).length === keys.length &&
        keys.every((key) => Object.hasOwn(value, key));
    if (
        !exactKeys(analysis.conclusion_findings, conclusions) ||
        conclusions.some((id) => !exactKeys(analysis.conclusion_findings[id], ['topic', 'basis'])) ||
        analysis.conclusion_findings.innovation_hypothesis.basis !== 'unverified'
    )
        throw Error('author topic and basis for all three conclusions; hypotheses must remain unverified');
    if (
        !Array.isArray(analysis.source_paths) ||
        !analysis.source_paths.length ||
        !analysis.capabilities ||
        Array.isArray(analysis.capabilities)
    )
        throw Error('explicit inspected source paths and capabilities object required');
    if ([...analysis.summary].length > 80 || /[\r\n]/.test(analysis.summary))
        throw Error('author summary must be one line, at most 80 characters');
    const item = work.session.items.find((p) => p.id === pluginId);
    if (
        !item ||
        item.status !== 'pending' ||
        (work.session.selected_ids && !work.session.selected_ids.includes(pluginId))
    )
        throw Error('analysis must target one selected pending item');
    const snapshot = readSnapshotStorage(resolve(ROOT, 'data/catalog/index.jsonl'));
    const old = snapshot.catalog.plugins.find((p) => p.id === pluginId);
    const slug = basename(pluginDirectory({ ...item, component_id: item.id.split(':')[2] }, ROOT));
    const folder = resolve(workPath, '..'),
        materials = resolve(folder, slug),
        checkout = resolve(researchDataDirectory(ROOT), `checkouts/${pluginId.split(':')[1]}-${item.revision}`);
    const inventory = read(resolve(materials, 'INVENTORY.json')),
        metadata = read(resolve(materials, 'META.json'));
    const manifest = readPinnedSource(
        checkout,
        item.revision,
        item.path ? `${item.path}/package.json` : 'package.json'
    );
    // JSON permits surrounding whitespace, but JSON.parse rejects a UTF-8 BOM decoded as U+FEFF.
    // Parse the pinned manifest once after removing only that leading marker; preserve all other bytes.
    const manifestData = manifest === null ? null : JSON.parse(manifest.replace(/^\uFEFF/u, ''));
    if (manifestData?.private) delete metadata.npm;
    const version = manifestData?.version ?? '未声明';
    const committedAt = execFileSync('git', ['-C', checkout, 'show', '-s', '--format=%cI', item.revision], {
        encoding: 'utf8'
    }).trim();
    const versionDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' }).format(new Date(committedAt));
    if (inventory.revision !== item.revision || inventory.component !== item.path)
        throw Error('inventory revision or scope differs');
    const pack = [];
    const requested = [
        ...new Set([
            ...(item.path ? [`${item.path}/README.md`, `${item.path}/package.json`] : []),
            'README.md',
            'package.json',
            ...analysis.source_paths
        ])
    ];
    for (const name of requested) {
        const content = readPinnedSource(checkout, item.revision, name);
        if (content === null) {
            if (analysis.source_paths.includes(name)) throw Error(`inspected path missing: ${name}`);
            continue;
        }
        pack.push({ path: name, content });
    }
    const questionContext = {
        repository: item.repository,
        revision: item.revision,
        sourcePaths: pack.map((file) => file.path),
        readSource: (name) => pack.find((file) => file.path === name)?.content
    };
    validateResearchQuestions(analysis.research_questions, questionContext);
    for (const field of ['contribution', 'critical_question', 'innovation_hypothesis', 'adoption']) {
        const linked = analysis.research_questions.questions.some((q) =>
            analysis[field].includes(`[${q.id}](#research-${q.id.toLowerCase()})`)
        );
        if (!linked) throw Error(`synthesis must link a completed research question: ${field}`);
    }
    const questionReport = renderResearchQuestions(analysis.research_questions, questionContext);
    const sourcePath = relative(ROOT, resolve(materials, 'REVIEWED-SOURCE.json')).split('\\').join('/');
    const reviewedSource = {
        repository: item.repository,
        revision: item.revision,
        component: item.path,
        inspected_paths: questionContext.sourcePaths,
        research_questions: analysis.research_questions,
        files: pack,
        inventory: { ...inventory, files: undefined }
    };
    const now = new Date().toISOString(),
        run = `${work.session.id}-${item.id.replace(/:/g, '-')}`;
    const evidenceId = `${run}-source`,
        authorId = `${run}-author`;
    const readme =
        pack.find((f) => f.path === (item.path ? `${item.path}/README.md` : 'README.md')) ??
        pack.find((f) => f.path === 'README.md');
    if (!readme) throw Error('author README required');
    const reference = (path) =>
        createGitReference(`https://github.com/${item.repository}`, item.revision, path, {
            content: questionContext.readSource(path)
        });
    const url = (path) => gitReferenceUrl(reference(path));
    const evidence = [
        {
            id: authorId,
            kind: 'author_claim',
            url: url(readme.path),
            git_refs: [reference(readme.path)],
            revision: item.revision,
            captured_at: now,
            summary: analysis.summary,
            artifact: sourcePath,
            limitations: ['功能摘要根据作者固定版本材料归纳，不是逐字引文或独立效果验证。']
        },
        {
            id: evidenceId,
            kind: 'source_inspection',
            url: url(analysis.source_paths[0]),
            git_refs: [...new Set(analysis.source_paths)].map(reference),
            revision: item.revision,
            captured_at: now,
            summary: `核查 ${analysis.source_paths.join('、')}；${analysis.mechanism}`,
            artifact: sourcePath,
            limitations: [
                analysis.scope,
                '只执行本工程的统计和结构验证；没有执行目标插件、测试、安装或真实宿主验收。',
                'GitHub/npm 活跃度只作采集背景，未核实独立用户采用或同条件收益对照。'
            ]
        }
    ];
    const topics = {
        scenario: 'positioning',
        mechanism: 'mechanism',
        scope: 'limitations',
        distribution: 'engineering',
        dependencies: 'limitations',
        cost: 'limitations',
        adoption: 'adoption',
        value: 'business_value',
        engineering: 'engineering',
        ...Object.fromEntries(conclusions.map((id) => [id, analysis.conclusion_findings[id].topic]))
    };
    if (old?.findings.some((f) => !Object.hasOwn(topics, f.id)))
        throw Error('existing findings need explicit per-ID review; no fallback allowed');
    const findings = Object.entries(topics).map(([id, topic]) => ({
        id,
        topic,
        basis: conclusions.includes(id)
            ? analysis.conclusion_findings[id].basis
            : ['mechanism', 'distribution'].includes(id)
              ? 'supported'
              : 'interpretation',
        text: analysis[id],
        evidence_ids: [evidenceId],
        dependencies: [{ plugin_id: pluginId, area: 'code', fingerprint: item.fingerprints.code }],
        reviewed_at: now,
        status: 'current'
    }));
    const plugin = {
        id: pluginId,
        repository_id: Number(pluginId.split(':')[1]),
        component_id: pluginId.split(':')[2],
        repository: item.repository,
        path: item.path,
        aliases: old?.aliases ?? [],
        name: analysis.name,
        entry_type: old?.entry_type ?? 'plugin',
        technical_category: analysis.technical_category,
        business_category: analysis.business_category,
        tags: old?.tags ?? [],
        availability: 'unknown',
        research_depth: 'source',
        fingerprints: item.fingerprints,
        sources: item.source_urls.map((source, index) => ({
            id: `${run}-directory-${index}`,
            url: source,
            revision: work.session.sources.find((s) => s.url === source)?.revision ?? null,
            retrieved_at: now,
            membership: sourceMembership(work, item, source)
        })),
        evidence,
        findings,
        last_checked_at: now,
        innovation_scores: assembleInnovationScores(
            analysis.innovation_scores,
            pluginId,
            item.revision,
            item.fingerprints.code,
            now,
            evidenceId
        )
    };
    plugin.recommendation = assembleRecommendation(analysis.recommendation, plugin, item.revision, now, [evidenceId]);
    validateObservations({ schema_version: 1, run_id: run, checked_at: now, plugins: [plugin], errors: [] });
    const statistics = [
        '| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |',
        '|---|---|---:|---:|---:|---:|---:|',
        ...inventory.groups.map(
            (g) =>
                `| ${g.extension} | ${g.role} | ${g.files} | ${g.lines} | ${g.code ?? '—'} | ${g.comments ?? '—'} | ${g.words ?? '—'} |`
        )
    ].join('\n');
    const capabilities =
        analysis.capability_table ??
        Object.entries(analysis.capabilities)
            .map(([name, text]) => `- **${name}**：${text}`)
            .join('\n');
    const report = `# ${analysis.name}\n\n> ${analysis.summary}\n\n## 研究范围\n\n- **仓库**：[${item.repository}](https://github.com/${item.repository})\n- **版本号**：${version}（[固定提交 ${item.revision}](https://github.com/${item.repository}/tree/${item.revision})）\n- **版本日期**：${versionDate}（固定提交日期，北京时间；不是包发布日期）\n\n## 结论状态\n\n${analysis.conclusion_status}\n\n## 洞察短评\n\n- **用途**：${analysis.scenario}\n- **亮点**：${analysis.contribution}\n- **思考**：${analysis.critical_question}\n- **建议**：${analysis.innovation_hypothesis}\n\n采用建议：${analysis.adoption}\n\n## 核心贡献\n\n${analysis.contribution}\n\n## 关键质疑\n\n${analysis.critical_question}\n\n<a id="innovation"></a>\n\n## 重点创新推演与最小验证\n\n${analysis.innovation_hypothesis}\n\n${analysis.verification}\n\n## 场景与替代办法\n\n${analysis.scenario}\n\n${analysis.baseline}\n\n## 依赖与流程\n\n${analysis.dependencies}\n\n${analysis.workflow}\n\n## 成本与效果\n\n${analysis.cost}\n\n${analysis.value}\n\n${questionReport}\n\n## 工程统计\n\n统计范围：${inventory.coverage}；组件：${inventory.component || '根'}；内容摘要：${inventory.content_digest}。sloc ${inventory.tools.loc.version}，TypeScript ${inventory.tools.parser.version}。\n\n${statistics}\n\n排除 ${inventory.excluded.length} 项，解析错误 ${inventory.parse_errors.length} 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。\n\n## 能力清单\n\n${capabilities}\n\n## 工程亮点\n\n${analysis.engineering}\n\n## 验证与边界\n\n- 已检查：作者 README、包清单、源码路径 ${analysis.source_paths.join('、')} 及固定范围 inventory；组件：${item.path || '仓库根'}。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。\n- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。\n- 边界：${analysis.scope}\n- 下一步：${analysis.verification}\n`;
    const reportPath = resolve(materials, 'INSIGHT.md'),
        observationPath = resolve(materials, 'OBSERVATIONS.json'),
        displayPath = resolve(materials, 'DISPLAY.json');
    const display = validateDisplay({
        metadata,
        summaries: { text: analysis.summary, revision: item.revision, source_url: url(readme.path) },
        capabilities: {
            revision: item.revision,
            items: analysis.capabilities,
            ...(analysis.capability_table === undefined ? {} : { table: analysis.capability_table })
        },
        advice: { revision: item.revision, text: analysis.adoption }
    });
    mkdirSync(materials, { recursive: true });
    if (existsSync(reportPath) || existsSync(observationPath)) throw Error('refuse overwriting authored record');
    // Writing report after all identity/content checks avoids partially materialized semantic records.
    atomicWrite(resolve(ROOT, sourcePath), reviewedSource);
    writeFileSync(reportPath, report);
    atomicWrite(observationPath, { schema_version: 1, run_id: run, checked_at: now, plugins: [plugin], errors: [] });
    atomicWrite(displayPath, display);
    return {
        report: relative(ROOT, reportPath),
        observations: relative(ROOT, observationPath),
        display: relative(ROOT, displayPath)
    };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
    try {
        const { values: v } = parseArgs({
            options: { work: { type: 'string' }, plugin: { type: 'string' }, analysis: { type: 'string' } }
        });
        if (!v.work || !v.plugin || !v.analysis) throw Error('--work --plugin --analysis required');
        console.log(JSON.stringify(assembleInsight(v.work, v.plugin, v.analysis)));
    } catch (e) {
        console.error(e.stack);
        process.exitCode = 1;
    }
