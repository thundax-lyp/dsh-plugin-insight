# DSH Industry Research

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[4a2a320](https://github.com/PerryLink/dsh-industry-research/tree/4a2a320851cffcfe828e648ba05528de453b9ce8)

<!-- BEGIN META -->
[![GitHub ★ 216](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=216&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-industry-research) [![npm 30d 4,124](https://img.shields.io/static/v1?label=npm+30d&message=4%2C124&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-industry-research) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-industry-research)
<!-- END META -->

> **功能**：提供产业链建图、公开动态追踪、公司卡片和带来源及缺口的行业研究报告。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将领域数据、缺口、版本和报告组织起来，降低反复整理负担。

> **主要限制**：[Q03](#research-q03) sourceRef/hash/结构门不证数值真实，E证据常为生成artifact；[Q02](#research-q02)红方/正反方job是确定性note非独立模型研究。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 行业域包比通用搜索/报告增加什么？](#detail-section-11)
  - [Q02 · 输入怎样变成状态、审阅和报告？](#detail-section-12)
  - [Q03 · 来源、hash和交付门证明什么？](#detail-section-13)
  - [Q04 · 依赖与全周期代价在哪里？](#detail-section-14)
  - [Q05 · 具体采用范围及增量怎样证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：研究者反复维护产业链/公司/动态并产可回溯研究稿。

通用搜索/手工笔记和直接报告引擎；领域包增加结构约束与流程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 链图/公司卡 | 领域结构和指标槽位 | caller值仍需原文核证 |
| 动态追踪 | 公共检索/限量快照hash | 未知日期/未抓取明示，不全面监测 |
| 报告交付门 | 结构/引用/日期检查 | 非事实蕴含证明 |
| 引擎/fallback | 封存接线或版本化Markdown | fallback全unverified |
| 版本/审阅note | 回溯字节与缺口 | 无独立模型review/跨进程事务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node^22.19或>=24/匹配DSH | 必需 | 工具/Skill | lib/Host未运行验收 |
| 会话cwd/工作区写权 | 必需 | 领域产物 | 不等symlink隔离 |
| ctx.web | track必需、其余可选 | 公共检索 | 缺口/明确失败 |
| ctx.researchReport/jobs | 可选 | 封存/确定性note | fallback标未验证/跳过 |
| 原始公开文本/人工核值 | 采用前提 | 真实事实交付 | PDF不读/来源标签不证支持 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份并给文本/研究范围 | 可回原文 |
| 建图/卡/追踪 | Agent传值/来源并限量检索 | 缺口/失败不藏 |
| 报告 | 结构门后engine或fallback | 核engine标签/未验证 |
| 复核 | 用户逐值/口径/日期 | 失败保原件回手工 |
| 退出 | 导出/核jobs和文件 | 卸载不删产物 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 原宿主/构建/文本准备 | 配置方法与来源 | 时间未知 |
| 持续 | web/模型/版本存储 | 补证/修订 | 价格/延迟未测 |
| 失败恢复 | 重查/副本/不完整文件 | 分清artifact/ledger/engine | 非整体事务 |
| 退出 | 保留来源/报告 | 导出/治理敏感数据 | 卸载非删除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 领域整理 | 四工具/Skill/槽位 | 净研究节时 |
| 回溯 | hash/来源日期/缺口 | 原文真实支持 |
| 结构交付 | deterministic gate | 事实/行业结论正确 |
| 审阅 | 确定性note/可选引擎 | 独立review或生产验收 |

> **思考**：[Q03](#research-q03) sourceRef/hash/结构门不证数值真实，E证据常为生成artifact；[Q02](#research-q02)红方/正反方job是确定性note非独立模型研究。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将领域数据、缺口、版本和报告组织起来，降低反复整理负担。

[Q02](#research-q02) session cwd、进程内ledger串行和缺口保留可取；[Q03](#research-q03)词法边界/缺记录放过/确定性审阅需明确。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) sourceRef/hash/结构门不证数值真实，E证据常为生成artifact；[Q02](#research-q02)红方/正反方job是确定性note非独立模型研究。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 公开文本/非敏感副本先用unverified fallback，人工逐值核口径/来源；缺正文/冲突停并回手工。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码工作流接线成立，未执行目标/模型/真实web，限定人工审原文的公开资料整理试用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/engine-bridge.ts、src/tools/map.ts、src/tools/company.ts、src/tools/track.ts、src/tools/report.ts、src/report.ts、src/company.ts、src/paths.ts、src/toolkit.ts、src/versions.ts、src/adversarial.ts、src/perspectives.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读声明/入口及map/company/track/report核心链、company扫描/校验、paths/toolkit/versions/adversarial/perspectives关键段；未全面审所有算法/compiled lib/Host权限，不执行目标或金融事实验证。
- 下一步：副本样本比较结构整理到原文盲审，测试错单位/过期/无关source、抓取失败、写档故障与并发恢复，计全程成本。

**分析版本**

- **仓库**：[PerryLink/dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)
- **版本号**：0.3.23（[固定提交 4a2a320](https://github.com/PerryLink/dsh-industry-research/tree/4a2a320851cffcfe828e648ba05528de453b9ce8)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 绑定原文段落/日期/单位与抓取状态的领域证据契约；若手工/现有引擎等效或误配更多即否定。

副本样本比较结构整理到原文盲审，测试错单位/过期/无关source、抓取失败、写档故障与并发恢复，计全程成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 2661 | — | — | 30504 |
| .md | example | 2 | 41 | — | — | 545 |
| .mjs | source | 9 | 539 | 396 | 103 | — |
| .ts | source | 27 | 4266 | 2884 | 1132 | — |
| .ts | test | 27 | 2821 | 2246 | 368 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/PerryLink/dsh-industry-research/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查领域工作流贡献与数据、审阅和报告核证边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 行业域包比通用搜索/报告增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向反复维护行业链、公司资料与政策动态的研究者，四工具把chain、timeline、company card与报告串到工作区，并分发两方法Skill。相对搜索后手抄文档，多了领域结构、显式缺口、来源/日期字段和版本痕迹；相比通用封存引擎，多了行业输入组织而不是新事实验证器。合格交付是每项重要结论可回原材料、日期/口径清楚且未证实项明确，不是报告文件存在。

index真实注册四工具/Skill provider，web/researchReport均执行时可选查找；无引擎仍能产builtin-fallback并标unverified，不应说依赖缺失就完全不可用。自动草稿机械汇总，研究观点来自模型/人提供draft；本轮不提供投资判断或核金融事实，只有工程工作流评价。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:134-160](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/index.ts#L134-L160)

四工具与Skill实际挂载。

<details>
<summary>查看原文（27行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  const resolved = resolveConfig(config)
  const logger = ctx.logger('industry-research')
  if (!resolved.enabled) {
    logger.info('disabled: enabled is false — no research capabilities are mounted')
    return
  }

  const skillsRoot = resolveSkillsRoot(resolved.skillsDir)
  // Service Provider — publishes the packaged methodology skills through
  // ctx.skills.registerProvider and registers the four research tools below.
  ctx.effect(function* () {
    yield ctx.skills.registerProvider(control => new FileSystemSkillProvider(ctx, control, {
      providerName: 'industry-research',
      includeDefaultRoots: false,
      customSkillDirs: [skillsRoot],
      watch: false,
    }))
  })

  // Consumer — at execution time the tool handlers consume the optional
  // ctx.web and ctx.researchReport services (structural lookup, never injected).
  ctx.tools.register(buildIndustryMapTool(ctx, resolved))
  ctx.tools.register(buildIndustryTrackTool(ctx, resolved))
  ctx.tools.register(buildCompanyScanTool(ctx, resolved))
  ctx.tools.register(buildIndustryReportTool(ctx, resolved))
  logger.info(`industry-research ${VERSION} mounted: 4 tools, skills from ${skillsRoot}`)
```

</details>

**依据 2 · 源码核查**：[src/engine-bridge.ts:52-65](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/engine-bridge.ts#L52-L65)

可选引擎形状检查。

<details>
<summary>查看原文（14行）</summary>

```text
function isResearchReportLike(value: unknown): value is ResearchReportLike {
  if (typeof value !== 'object' || value === null) return false
  return typeof (value as { assemble?: unknown }).assemble === 'function'
}

/**
 * Look up the optional report engine.
 * @param ctx - the plugin context.
 * @returns the engine surface, or undefined when no engine is mounted.
 */
export function lookupEngine(ctx: Context): ResearchReportLike | undefined {
  const candidate: unknown = ctx.get('researchReport')
  return isResearchReportLike(candidate) ? candidate : undefined
}
```

</details>

**依据 3 · 源码核查**：[src/tools/report.ts:359-407](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/tools/report.ts#L359-L407)

引擎/诚实fallback分支。

<details>
<summary>查看原文（49行）</summary>

```text
      const engine = lookupEngine(ctx)
      let value: IndustryReportValue
      if (engine !== undefined) {
        const result: AssembleReportResult = await engine.assemble({
          title: draft.title,
          topic: name,
          evidence,
          sections: draft.sections,
          claims: draft.claims,
        })
        value = {
          industry: name,
          engine: 'research-report',
          reportDir: result.reportDir,
          reportPath: null,
          manifestPath: null,
          sealHash: result.sealHash,
          verdicts: result.verdicts,
          claims: draft.claims.length,
          evidence: evidence.length,
          gaps: artifacts.gaps,
          generatedAt,
          machineCheck,
          review,
          perspectives,
        }
      } else {
        const reportsDir = reportsDirOf(dir)
        const dirName = reportDirName(new Date(), candidate => existsSync(join(reportsDir, candidate)))
        const reportDir = join(reportsDir, dirName)
        const { reportPath, manifestPath } = await writeFallbackReport(reportDir, name, draft, evidence, artifacts.gaps, generatedAt, machineCheck, synthesis)
        await recordVersion(versionsPath, rootRelative(root, reportPath), await readFile(reportPath, 'utf8'), generatedAt)
        await recordVersion(versionsPath, rootRelative(root, manifestPath), await readFile(manifestPath, 'utf8'), generatedAt)
        value = {
          industry: name,
          engine: 'builtin-fallback',
          reportDir,
          reportPath,
          manifestPath,
          sealHash: null,
          verdicts: null,
          claims: draft.claims.length,
          evidence: evidence.length,
          gaps: artifacts.gaps,
          generatedAt,
          machineCheck,
          review,
          perspectives,
        }
```

</details>

**依据 4 · 源码核查**：[README.md:78-83](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/README.md#L78-L83)

作者领域能力定位。

```text
- **`industry_map`** — build or update an industry chain map (`chain.json`): upstream/midstream/downstream nodes, edges, and metric slots. A metric with a `value` must carry a `sourceRef`; a value-less slot is an explicit gap. Node `status` assertions carry a `statusAsOf`, and an optional `taxonomyCode` must hit the built-in 国民经济行业分类 大类 table. With `renderSvg: true` it also writes a deterministic, tier-layered `chain.svg` network diagram with funnel/hub bottleneck highlighting. A `depth` argument scales the web assist (quick/standard/comprehensive). Seed notes/files and an optional `ctx.web` digest are registered as citable sources (`S1`, `S2`, …).
- **`industry_track`** — public-source policy/news tracking over the official `ctx.web` seam: per-topic search, host allow/block lists, `since` filtering, bounded snapshot fetches with SHA-256 provenance hashes, and append + dedupe into `timeline.jsonl` with a retention cap. Entries may carry a validated `evidenceCategory`; a `depth` argument scales source counts. Fails loud when the web capability is unreachable.
- **`company_scan`** — company cards (`card.json` + `card.md`) from your workspace data files (SHA-256-hashed, with Markdown outlines and figure-candidate lines so every number cites a file and a line), plus an optional `ctx.web` citation complement. Cards carry a listing `status` (with `statusAsOf`), a format-checked `ticker`, and sourced price/value `metrics` (each with `source` + `asOf`). Batch mode (`companies`) isolates one bad company without aborting the batch; `depth` scales the web complement. Text formats only in v1 (no PDF).
- **`industry_report`** — one auditable report from the map + timeline + cards. Before producing, a deterministic delivery contract checks blocks, status/price assertions, and placeholder residue (fail loud, no half-assembled report). Timeline entries are grouped by `evidenceCategory`. A deterministic bull/bear (正反方) synthesis lists sourced, dated values against declared gaps and data-quality findings, is embedded as the report's multi-perspective section, and is forked as a subagent job writing `perspectives-note.md` into the version ledger. With a mounted `ctx.researchReport` engine the evidence/sections/claims are sealed by its `assemble` and per-claim verdicts come back; without one, the builtin fallback writes versioned `reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` with a SHA-256 source-traceability table and honestly labels `engine: 'builtin-fallback'`.
- **Artifact version ledger** — `industry_map` / `company_scan` / `industry_report` append to `versions.jsonl` (root-relative path + SHA-256 + timestamp + change type) on every artifact write; reads verify the hash and fail loud on mismatch.
- **Two methodology skills** — `industry-research-method` (chain decomposition, supply/demand framework, sourcing discipline, gap-declaration discipline) and `company-research-method` (company framework, public-source list, compliance wording).
```

#### 缺口

- 真实研究任务对照与领域合格率未验。
  **影响**：不能证明减少研究工时或提高事实正确。
  **进一步探讨**：用过期/冲突/缺资料公开样本与手工笔记对照可追溯和修订时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 输入怎样变成状态、审阅和报告？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

map登记seed笔记/文件和web摘要，再校验caller提交chain后落盘/记hash；company扫描文本文件，提标题和含数字行候选，指标仍来自caller metrics而非自动财务理解。track按topic search、allow/block/since过滤、限并发抓取hash，失败/超预算明确note，timeline仍保候选。session.header.cwd必需，避免默认进程cwd；读既有artifact核版本hash。

报告加载artifact→证据E-chain/E-timeline/E-company→自写或机械draft→delivery contract→machineCheck→可选engine assemble/fallback。红方/正反方“subagent job”实际上同步算确定性findings/synthesis，再job写note；没有另派模型独立研究或等待人工验收。kind/label不应被当多Agent推理证明。版本ledger有进程内按path串行避免并发note覆盖，缺记录则verify no-op；不是跨进程事务/不可篡改链。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/map.ts:176-239](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/tools/map.ts#L176-L239)

seed/摘要与caller chain写入。

<details>
<summary>查看原文（64行）</summary>

```text
    async execute(args, exec): Promise<IndustryMapValue> {
      const cwd = workspaceOf(exec)
      const { root, dir, name } = industryDirOf(config, cwd, args.industry)
      const depth = resolveDepth(args.depth)
      const sourcesPath = sourcesPathOf(dir)
      const registry = await loadSources(sourcesPath)
      const now = new Date().toISOString()
      const versionsPath = versionsPathOf(root)
      const seedRefs: string[] = []

      if (args.seed !== undefined && args.seed.trim().length > 0) {
        const notesDir = notesDirOf(dir)
        await mkdir(notesDir, { recursive: true })
        const notePath = join(notesDir, `seed-${now.replaceAll(':', '-')}.md`)
        const noteContent = `# 种子笔记（${now}）\n\n${args.seed.trim()}\n`
        await writeFile(notePath, noteContent, 'utf8')
        seedRefs.push(registerSource(registry, notePath, noteContent, now, 'seed note'))
      }
      for (const file of args.seedFiles ?? []) {
        const absolute = resolveWorkspaceFile(cwd, file)
        const content = await readFile(absolute, 'utf8')
        seedRefs.push(registerSource(registry, absolute, content, now, 'seed file'))
      }

      let webDigest: WebSource[] | null = null
      let webNote: string | null = null
      if (args.web === false) {
        webNote = '调用方指定 web: false'
      } else if (config.offline) {
        webNote = 'config.offline 为 true'
      } else {
        const web = lookupWeb(ctx)
        if (web === undefined) {
          webNote = 'ctx.web 未挂载（可选能力；不影响建图）'
        } else {
          try {
            const outcome = await web.search(
              { query: `${name} 产业链 上游 中游 下游 结构`, maxResults: DEPTH_PROFILES[depth].mapSearchResults },
              requestSignal(exec.signal, config.fetchTimeoutMs),
            )
            webDigest = [...outcome.sources]
            for (const source of outcome.sources) {
              const digest = `${source.title ?? ''}\n${source.snippet ?? ''}`
              seedRefs.push(registerSource(registry, source.url, digest, now, source.title))
            }
          } catch (error) {
            webNote = `web 检索失败：${webErrorMessage(error)}`
          }
        }
      }
      if (seedRefs.length > 0) await saveSources(sourcesPath, registry)

      const chainPath = chainPathOf(dir)
      let updated = false
      if (args.chain !== undefined) {
        const candidate = args.chain as ChainMap
        const problems = validateChainMap(candidate)
        if (problems.length > 0) {
          throw new Error(`chain 校验失败（${problems.length} 项）：${problems.join('；')}`)
        }
        await mkdir(dir, { recursive: true })
        const chainContent = `${JSON.stringify(candidate, null, 2)}\n`
        await writeFile(chainPath, chainContent, 'utf8')
        await recordVersion(versionsPath, rootRelative(root, chainPath), chainContent, now)
```

</details>

**依据 2 · 源码核查**：[src/tools/company.ts:136-163](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/tools/company.ts#L136-L163)

文件扫描/可选web缺口。

<details>
<summary>查看原文（28行）</summary>

```text
async function scanOneCompany(ctx: Context, config: ResolvedConfig, cwd: string, depth: ResearchDepth, signal: AbortSignal, spec: CompanySpec): Promise<CompanyScanValue> {
  const { root, dir, slug } = companyDirOf(config, cwd, spec.name)
  const now = new Date().toISOString()
  const gaps: string[] = []
  const rejected: Array<{ path: string; reason: string }> = []

  const scanned: Awaited<ReturnType<typeof scanFile>>[] = []
  for (const file of spec.dataFiles ?? []) {
    const absolute = resolveWorkspaceFile(cwd, file)
    try {
      scanned.push(await scanFile(absolute, config.scan.maxFileBytes))
    } catch (error) {
      rejected.push({ path: file, reason: error instanceof Error ? error.message : String(error) })
    }
  }
  if ((spec.dataFiles ?? []).length === 0) {
    gaps.push('未提供数据文件（dataFiles）：业务结构 / 财务要点 / 风险点均待补')
  }

  let webSources: CardWebSource[] | null = null
  if (spec.web === false) {
    gaps.push('按调用方要求未做 web 公开源检索')
  } else if (config.offline) {
    gaps.push('config.offline 为 true，未做 web 公开源检索')
  } else {
    const web = lookupWeb(ctx)
    if (web === undefined) {
      gaps.push('ctx.web 未挂载，未做 web 公开源检索')
```

</details>

**依据 3 · 源码核查**：[src/tools/company.ts:191-220](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/tools/company.ts#L191-L220)

指标caller输入与写档。

<details>
<summary>查看原文（30行）</summary>

```text
  const card: CompanyCard = {
    name: spec.name.trim(),
    slug,
    asOf: now,
    sources: scanned.map(file => file.source),
    outline: scanned.flatMap(file => file.outline !== undefined ? [file.outline] : []),
    figureCandidates: figures,
    webSources,
    gaps,
    disclaimer: '仅供研究，不构成投资建议',
    ...(spec.status !== undefined ? { status: spec.status } : {}),
    ...(spec.statusAsOf !== undefined ? { statusAsOf: spec.statusAsOf } : {}),
    ...(spec.ticker !== undefined ? { ticker: spec.ticker } : {}),
    metrics: (spec.metrics ?? []).map(metric => ({
      key: metric.key,
      value: metric.value,
      ...(metric.unit !== undefined ? { unit: metric.unit } : {}),
      asOf: metric.asOf,
      source: metric.source,
    })),
  }
  const problems = validateCompanyCard(card, new Date(), config.scan.strictTicker)
  if (problems.length > 0) {
    throw new Error(`company card 校验失败（${problems.length} 项）：${problems.join('；')}`)
  }
  const { cardJsonPath, cardPath } = await writeCard(dir, card)
  const versionsPath = versionsPathOf(root)
  await recordVersion(versionsPath, rootRelative(root, cardJsonPath), await readFile(cardJsonPath, 'utf8'), now)
  await recordVersion(versionsPath, rootRelative(root, cardPath), await readFile(cardPath, 'utf8'), now)
  return { name: card.name, slug, dir, cardPath, cardJsonPath, card, rejected }
```

</details>

**依据 4 · 源码核查**：[src/company.ts:134-162](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/company.ts#L134-L162)

数字行候选不是语义财务抽取。

<details>
<summary>查看原文（29行）</summary>

```text
export async function scanFile(path: string, maxBytes: number): Promise<ScannedFile> {
  const ext = extname(path).toLowerCase()
  if (!READABLE_EXTENSIONS.has(ext)) {
    throw new Error(`unsupported data-file extension ${JSON.stringify(ext)} (v1 reads ${[...READABLE_EXTENSIONS].join(', ')}; PDF is out of scope)`)
  }
  const info = await stat(path)
  if (!info.isFile()) throw new Error(`not a regular file: ${path}`)
  if (info.size > maxBytes) {
    throw new Error(`file exceeds scan.maxFileBytes (${info.size} > ${maxBytes}): ${path}`)
  }
  const content = await readFile(path, 'utf8')
  const lines = content.split('\n')
  const headings: string[] = []
  const figures: FigureCandidate[] = []
  if (ext === '.md') {
    for (const line of lines) {
      const match = /^#{1,3}\s+(.+?)\s*$/u.exec(line)
      if (match?.[1] !== undefined && headings.length < OUTLINE_CAP) headings.push(match[1])
    }
  }
  lines.forEach((raw, index) => {
    const text = raw.trim()
    if (text.length === 0 || !/\d/u.test(text)) return
    figures.push({ path, line: index + 1, text: text.length > FIGURE_LINE_CAP ? `${text.slice(0, FIGURE_LINE_CAP)}…` : text })
  })
  return {
    source: { path, sha256: sha256Of(content), bytes: info.size, lines: lines.length },
    outline: headings.length > 0 ? { path, headings } : undefined,
    figures,
```

</details>

**依据 5 · 源码核查**：[src/tools/track.ts:141-215](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/tools/track.ts#L141-L215)

检索/快照预算及缺口。

<details>
<summary>查看原文（75行）</summary>

```text
      // Search phase: one web.search per topic.
      interface Candidate { url: string; title: string | null; snippet: string | null; publishedAt: string | null; topics: string[] }
      const byUrl = new Map<string, Candidate>()
      for (const topic of topics) {
        const outcome = await web.search(
          { query: topic, maxResults: maxResultsPerTopic },
          requestSignal(exec.signal, config.fetchTimeoutMs),
        )
        for (const source of outcome.sources) {
          const existing = byUrl.get(source.url)
          if (existing !== undefined) {
            if (!existing.topics.includes(topic)) existing.topics.push(topic)
            continue
          }
          byUrl.set(source.url, {
            url: source.url,
            title: source.title ?? null,
            snippet: source.snippet ?? null,
            publishedAt: source.publishedAt ?? null,
            topics: [topic],
          })
        }
      }

      // Filter phase: allow/block lists, then the since filter.
      let blocked = 0
      let tooOld = 0
      const candidates: Candidate[] = []
      for (const candidate of byUrl.values()) {
        if (!sourceAllowed(candidate.url, config.sourceAllowlist, config.sourceBlocklist)) {
          blocked += 1
          continue
        }
        if (since !== undefined && candidate.publishedAt !== null) {
          const published = Date.parse(candidate.publishedAt)
          if (!Number.isNaN(published) && published < Date.parse(since)) {
            tooOld += 1
            continue
          }
        }
        candidates.push(candidate)
      }

      // Snapshot phase: bounded concurrent fetches within the call budget.
      const now = new Date().toISOString()
      const fetchFailed: Array<{ url: string; note: string }> = []
      const snapshots = new Map<string, string>()
      const fetchable = candidates.slice(0, maxFetchesPerCall)
      await pool(fetchable, FETCH_CONCURRENCY, async (candidate) => {
        try {
          const outcome = await web.fetch({ url: candidate.url }, requestSignal(exec.signal, config.fetchTimeoutMs))
          snapshots.set(candidate.url, sha256Of(outcome.body.content))
        } catch (error) {
          fetchFailed.push({ url: candidate.url, note: webErrorMessage(error) })
        }
      })

      const batch: TimelineEntry[] = candidates.map(candidate => {
        const snapshotHash = snapshots.get(candidate.url) ?? null
        const failure = fetchFailed.find(entry => entry.url === candidate.url)
        const beyondBudget = !fetchable.includes(candidate)
        return {
          date: candidate.publishedAt,
          title: candidate.title ?? candidate.url,
          url: candidate.url,
          summary: candidate.snippet,
          snapshotHash,
          capturedAt: now,
          topics: candidate.topics,
          ...(snapshotHash === null
            ? { note: failure !== undefined ? `快照抓取失败：${failure.note}` : beyondBudget ? '超出本次抓取预算，未抓取快照' : '无快照' }
            : {}),
          ...(args.evidenceCategory !== undefined ? { evidenceCategory: args.evidenceCategory } : {}),
        }
      })
```

</details>

**依据 6 · 源码核查**：[src/toolkit.ts:28-33](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/toolkit.ts#L28-L33)

会话cwd。

```text
export function workspaceOf(exec: ToolRunContext): string {
  const cwd = exec.agent?.session.header.cwd
  if (cwd === undefined || cwd.trim().length === 0) {
    throw new Error('this tool requires an agent-owned session workspace (session.header.cwd is unset)')
  }
  return cwd
```

**依据 7 · 源码核查**：[src/tools/report.ts:268-368](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/tools/report.ts#L268-L368)

实际报告/确定性job/引擎流程。

<details>
<summary>查看原文（101行）</summary>

```text
    async execute(args, exec): Promise<IndustryReportValue> {
      const cwd = workspaceOf(exec)
      const { root, dir, name } = industryDirOf(config, cwd, args.industry)
      const generatedAt = new Date().toISOString()
      const artifacts = await loadArtifacts(config, cwd, name, args.companies)
      const evidence = buildEvidence(artifacts, generatedAt)
      const evidenceIds = new Set(evidence.map(item => item.id))

      let draft: ReportDraft
      if (args.draft !== undefined) {
        draft = {
          title: args.draft.title ?? `${name} 行业研究报告`,
          sections: args.draft.sections,
          claims: args.draft.claims,
        }
        const problems = validateDraft(draft, evidenceIds)
        if (problems.length > 0) {
          throw new Error(`draft 校验失败（${problems.length} 项）：${problems.join('；')}（已登记证据：${[...evidenceIds].join(', ') || '无'}）`)
        }
      } else {
        const sections = (args.sections ?? [...AUTO_SECTIONS]) as AutoSection[]
        draft = autoDraft(name, artifacts, sections)
      }

      // Delivery contract (blue baseline): no half-assembled report is ever emitted.
      const contractProblems = validateDeliveryContract(draft, artifacts, evidenceIds)
      if (contractProblems.length > 0) {
        throw new Error(`交付契约校验失败（${contractProblems.length} 项）：${contractProblems.join('；')}`)
      }

      // Deterministic adversarial check (always runs, machine-check baseline).
      const machineCheck = adversarialCheck(draft, artifacts, evidenceIds)

      // Optional red-team review job: spawn it when a background-job registry exists.
      let review: ReviewOutcome
      const jobs = lookupJobs(ctx)
      const versionsPath = versionsPathOf(root)
      const redNotePath = join(dir, 'red-review-note.md')
      if (jobs === undefined) {
        review = { mode: 'skipped', note: 'jobs unavailable' }
      } else {
        const noteContent = renderRedReviewNote(draft, artifacts, evidenceIds, generatedAt)
        const jobId = jobs.start({
          kind: 'subagent',
          label: '红方对抗审阅（魔鬼代言人）',
          owner: exec.agent?.id,
              toolCall: { callId: exec.callId, rootCallId: exec.rootCallId },
          run: () => {
            let cancelled = false
            const done = (async () => {
              if (!cancelled) {
                await writeFile(redNotePath, noteContent, 'utf8')
                await recordVersion(versionsPath, rootRelative(root, redNotePath), noteContent, generatedAt)
              }
              return { status: cancelled ? 'killed' as const : 'completed' as const, output: machineCheck.length > 0 ? machineCheck.join('；') : 'no findings' }
            })()
            return { cancel: () => { cancelled = true }, done }
          },
        })
        review = { mode: 'job', jobId }
      }

      // Multi-perspective (bull/bear) debate: synthesize deterministically, then
      // fork a subagent job to write the note and append it to the SHA-256 ledger.
      const synthesis = synthesizePerspectives(draft, artifacts, evidenceIds)
      let perspectives: ReviewOutcome
      const perspectivesNotePath = join(dir, 'perspectives-note.md')
      if (jobs === undefined) {
        perspectives = { mode: 'skipped', note: 'jobs unavailable' }
      } else {
        const noteContent = renderPerspectivesNote(name, draft, artifacts, evidenceIds, generatedAt)
        const jobId = jobs.start({
          kind: 'subagent',
          label: '多视角正反方辩论（bull/bear）',
          owner: exec.agent?.id,
              toolCall: { callId: exec.callId, rootCallId: exec.rootCallId },
          run: () => {
            let cancelled = false
            const done = (async () => {
              if (!cancelled) {
                await writeFile(perspectivesNotePath, noteContent, 'utf8')
                await recordVersion(versionsPath, rootRelative(root, perspectivesNotePath), noteContent, generatedAt)
              }
              return { status: cancelled ? 'killed' as const : 'completed' as const, output: `bull ${synthesis.bull.length} 项 / bear ${synthesis.bear.length} 项` }
            })()
            return { cancel: () => { cancelled = true }, done }
          },
        })
        perspectives = { mode: 'job', jobId }
      }

      const engine = lookupEngine(ctx)
      let value: IndustryReportValue
      if (engine !== undefined) {
        const result: AssembleReportResult = await engine.assemble({
          title: draft.title,
          topic: name,
          evidence,
          sections: draft.sections,
          claims: draft.claims,
        })
```

</details>

**依据 8 · 源码核查**：[src/versions.ts:93-128](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/versions.ts#L93-L128)

进程内串行与无记录放过。

<details>
<summary>查看原文（36行）</summary>

```text
const ledgerTails = new Map<string, Promise<void>>()

export async function recordVersion(path: string, artifact: string, content: string, capturedAt: string): Promise<ArtifactChange> {
  const previous = ledgerTails.get(path) ?? Promise.resolve()
  const run = previous.then(async (): Promise<ArtifactChange> => {
    const records = await readVersions(path)
    const change: ArtifactChange = records.some(record => record.artifact === artifact) ? 'updated' : 'created'
    records.push({ artifact, sha256: sha256Of(content), capturedAt, change })
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, `${records.map(record => JSON.stringify(record)).join('\n')}\n`, 'utf8')
    return change
  })
  ledgerTails.set(path, run.then(() => undefined, () => undefined))
  return run
}

/**
 * Verify an artifact's content against its latest ledger record. A missing
 * record is a no-op (unrecorded artifacts are not checked); a hash mismatch
 * fails loud.
 * @param path - absolute path of `versions.jsonl`.
 * @param artifact - root-relative artifact path.
 * @param content - the read-back bytes to verify.
 */
export async function verifyVersion(path: string, artifact: string, content: string): Promise<void> {
  const records = await readVersions(path)
  let latest: VersionRecord | undefined
  for (const record of records) {
    if (record.artifact === artifact) latest = record
  }
  if (latest === undefined) return
  const hash = sha256Of(content)
  if (hash !== latest.sha256) {
    throw new Error(`artifact ${JSON.stringify(artifact)} failed version verification: content hash ${hash} does not match recorded ${latest.sha256}`)
  }
}
```

</details>

#### 缺口

- 真实Host/引擎/并发强退与多进程一致性未验。
  **影响**：不能承诺全部产物事务一致或独立对抗审阅。
  **进一步探讨**：在副本核artifact写后ledger失败、并发进程与job取消，分别记录最终文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 来源、hash和交付门证明什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

delivery检查非空block、claim引用已登记E id、source字段/日期/占位符等，是结构门不是逐数值查证。metric.sourceRef只需非空文本，未在该门解析S1/URL所指正文支持度；汇入引擎的证据是整个生成chain/card，而非必然原始公告。这可能把caller填值与来源标签封存为材料，仍需人工回原文，不能据hash或verified字样认真实。

track快照只保存抓取内容hash于timeline而非此路径完整正文；无日期候选不会被since排掉，抓取失败仍入账并标note。存在来源/保留缺口比静默成功好，但不能称全面实时监测。路径safeSegment/lexical containment阻../等且数据文件限workspace，未realpath，symlink/配置绝对root的边界要另核；不把词法比较当租户隔离或已复现越界。fallback明确claims全部unverified，应保留这一重要区别。

#### 证据与依据

**依据 1 · 源码核查**：[src/report.ts:62-72](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/report.ts#L62-L72)

引擎证据是生成artifact。

<details>
<summary>查看原文（11行）</summary>

```text
  const evidence: EvidenceInput[] = []
  if (artifacts.chain !== undefined) {
    evidence.push({ id: 'E-chain', title: '产业链结构图 chain.json', origin: artifacts.chain.path, content: artifacts.chain.content, capturedAt })
  }
  if (artifacts.timeline !== undefined) {
    evidence.push({ id: 'E-timeline', title: '政策与动态时间线 timeline.jsonl', origin: artifacts.timeline.path, content: artifacts.timeline.content, capturedAt })
  }
  for (const { path, content, card } of artifacts.cards) {
    evidence.push({ id: `E-company-${card.slug}`, title: `公司速览卡 ${card.name}`, origin: path, content, capturedAt })
  }
  return evidence
```

</details>

**依据 2 · 源码核查**：[src/report.ts:125-176](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/report.ts#L125-L176)

交付门为字段/引用/日期。

<details>
<summary>查看原文（52行）</summary>

```text
export function validateDeliveryContract(draft: ReportDraft, artifacts: LoadedArtifacts, evidenceIds: ReadonlySet<string>): string[] {
  const problems: string[] = []
  if (typeof draft.title !== 'string' || draft.title.trim().length === 0) problems.push('delivery contract: draft.title is empty')
  if (draft.sections.length === 0) problems.push('delivery contract: draft has no sections')
  for (const [sectionIndex, section] of draft.sections.entries()) {
    if (typeof section.heading !== 'string' || section.heading.trim().length === 0) {
      problems.push(`delivery contract: section[${sectionIndex}] has an empty heading`)
    }
    if (section.paragraphs.length === 0) problems.push(`delivery contract: section "${section.heading}" has no paragraphs`)
    for (const [paragraphIndex, paragraph] of section.paragraphs.entries()) {
      if (typeof paragraph.text !== 'string' || paragraph.text.trim().length === 0) {
        problems.push(`delivery contract: section "${section.heading}" paragraph[${paragraphIndex}] is empty`)
      }
    }
  }
  for (const claim of draft.claims) {
    if (typeof claim.text !== 'string' || claim.text.trim().length === 0) problems.push(`delivery contract: claim "${claim.id}" has empty text`)
    if (claim.evidenceIds.length === 0) problems.push(`delivery contract: claim "${claim.id}" has no evidence`)
    for (const evidenceId of claim.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) problems.push(`delivery contract: claim "${claim.id}" references unknown evidence "${evidenceId}"`)
    }
  }
  for (const text of [draft.title, ...draft.sections.flatMap(section => section.paragraphs.map(paragraph => paragraph.text)), ...draft.claims.map(claim => claim.text)]) {
    if (PLACEHOLDER_RE.test(text)) problems.push(`delivery contract: placeholder residue in ${JSON.stringify(text.slice(0, 60))}`)
  }
  const now = new Date()
  if (artifacts.chain !== undefined) {
    for (const node of artifacts.chain.map.nodes) {
      problems.push(...validateStatus(node.status, node.statusAsOf, `chain node "${node.id}"`, now))
      for (const [metricIndex, metric] of node.metrics.entries()) {
        if (metric.value !== undefined && (typeof metric.sourceRef !== 'string' || metric.sourceRef.trim().length === 0)) {
          problems.push(`delivery contract: chain node "${node.id}" metric[${metricIndex}] carries a value without a sourceRef`)
        }
      }
    }
  }
  for (const { card } of artifacts.cards) {
    problems.push(...validateStatus(card.status, card.statusAsOf, `company card "${card.name}"`, now))
    for (const [metricIndex, metric] of (card.metrics ?? []).entries()) {
      if (typeof metric.source !== 'string' || metric.source.trim().length === 0) {
        problems.push(`delivery contract: company card "${card.name}" metric[${metricIndex}] carries a value without a source`)
      }
      if (typeof metric.asOf !== 'string' || metric.asOf.trim().length === 0) {
        problems.push(`delivery contract: company card "${card.name}" metric[${metricIndex}] carries a value without an asOf`)
      } else if (!isIsoDate(metric.asOf)) {
        problems.push(`delivery contract: company card "${card.name}" metric[${metricIndex}] asOf ${JSON.stringify(metric.asOf)} is not a valid ISO-8601 date`)
      } else if (Date.parse(metric.asOf) > now.getTime()) {
        problems.push(`delivery contract: company card "${card.name}" metric[${metricIndex}] asOf ${JSON.stringify(metric.asOf)} is in the future`)
      }
    }
  }
  return problems
```

</details>

**依据 3 · 源码核查**：[src/company.ts:314-337](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/company.ts#L314-L337)

source非空/日期而非正文匹配。

<details>
<summary>查看原文（24行）</summary>

```text
export function validateCompanyCard(card: CompanyCard, now: Date, strictTicker: boolean): string[] {
  const problems: string[] = []
  problems.push(...validateStatus(card.status, card.statusAsOf, `company card "${card.name}"`, now))
  problems.push(...validateTicker(card.ticker, strictTicker))
  for (const [index, metric] of (card.metrics ?? []).entries()) {
    const label = `company card "${card.name}" metric[${index}]`
    if (typeof metric.key !== 'string' || metric.key.trim().length === 0) {
      problems.push(`${label} has an empty key`)
    }
    if (typeof metric.value !== 'number' || !Number.isFinite(metric.value)) {
      problems.push(`${label} carries a non-finite value`)
    }
    if (typeof metric.source !== 'string' || metric.source.trim().length === 0) {
      problems.push(`${label} carries a value without a source — every price/value requires a source`)
    }
    if (typeof metric.asOf !== 'string' || metric.asOf.trim().length === 0) {
      problems.push(`${label} carries a value without an asOf — every price/value requires an asOf`)
    } else if (!isIsoDate(metric.asOf)) {
      problems.push(`${label} asOf ${JSON.stringify(metric.asOf)} is not a valid ISO-8601 date`)
    } else if (Date.parse(metric.asOf) > now.getTime()) {
      problems.push(`${label} asOf ${JSON.stringify(metric.asOf)} is in the future (now ${now.toISOString()})`)
    }
  }
  return problems
```

</details>

**依据 4 · 源码核查**：[src/tools/track.ts:174-215](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/tools/track.ts#L174-L215)

未知日期/仅hash/失败候选。

<details>
<summary>查看原文（42行）</summary>

```text
        if (since !== undefined && candidate.publishedAt !== null) {
          const published = Date.parse(candidate.publishedAt)
          if (!Number.isNaN(published) && published < Date.parse(since)) {
            tooOld += 1
            continue
          }
        }
        candidates.push(candidate)
      }

      // Snapshot phase: bounded concurrent fetches within the call budget.
      const now = new Date().toISOString()
      const fetchFailed: Array<{ url: string; note: string }> = []
      const snapshots = new Map<string, string>()
      const fetchable = candidates.slice(0, maxFetchesPerCall)
      await pool(fetchable, FETCH_CONCURRENCY, async (candidate) => {
        try {
          const outcome = await web.fetch({ url: candidate.url }, requestSignal(exec.signal, config.fetchTimeoutMs))
          snapshots.set(candidate.url, sha256Of(outcome.body.content))
        } catch (error) {
          fetchFailed.push({ url: candidate.url, note: webErrorMessage(error) })
        }
      })

      const batch: TimelineEntry[] = candidates.map(candidate => {
        const snapshotHash = snapshots.get(candidate.url) ?? null
        const failure = fetchFailed.find(entry => entry.url === candidate.url)
        const beyondBudget = !fetchable.includes(candidate)
        return {
          date: candidate.publishedAt,
          title: candidate.title ?? candidate.url,
          url: candidate.url,
          summary: candidate.snippet,
          snapshotHash,
          capturedAt: now,
          topics: candidate.topics,
          ...(snapshotHash === null
            ? { note: failure !== undefined ? `快照抓取失败：${failure.note}` : beyondBudget ? '超出本次抓取预算，未抓取快照' : '无快照' }
            : {}),
          ...(args.evidenceCategory !== undefined ? { evidenceCategory: args.evidenceCategory } : {}),
        }
      })
```

</details>

**依据 5 · 源码核查**：[src/paths.ts:61-95](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/paths.ts#L61-L95)

配置root与词法containment。

<details>
<summary>查看原文（35行）</summary>

```text
export function resolveIndustryRoot(cwd: string, industryRoot: string): string {
  return isAbsolute(industryRoot) ? resolve(industryRoot) : resolve(cwd, industryRoot)
}

/**
 * Resolve a user-supplied workspace-relative file path and verify containment
 * inside the workspace. Absolute paths are accepted only when already inside
 * the workspace; everything escaping the cwd is rejected.
 * @param cwd - absolute session workspace root.
 * @param file - the raw path from a tool argument.
 * @returns the absolute, containment-verified path.
 */
export function resolveWorkspaceFile(cwd: string, file: string): string {
  const base = resolve(cwd)
  const target = isAbsolute(file) ? resolve(file) : resolve(base, file)
  if (target !== base && !target.startsWith(base + sep)) {
    throw new Error(`path escapes the session workspace: ${JSON.stringify(file)}`)
  }
  return target
}

/**
 * Resolve one named directory below a root and verify containment (defense in
 * depth after {@link safeSegment}).
 * @param root - absolute parent root.
 * @param segment - an already validated segment.
 * @returns the absolute, containment-verified directory path.
 */
export function resolveContained(root: string, segment: string): string {
  const base = resolve(root)
  const target = resolve(base, segment)
  if (!target.startsWith(base + sep)) {
    throw new Error(`segment escapes its root: ${JSON.stringify(segment)}`)
  }
  return target
```

</details>

**依据 6 · 源码核查**：[src/report.ts:323-330](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/report.ts#L323-L330)

fallback明确unverified。

```text
  for (const item of evidence) {
    lines.push(`| ${item.id} | ${item.title}（\`${item.origin}\`） | \`${sha256Of(item.content)}\` | ${item.capturedAt} |`)
  }
  lines.push('', '## 附录：claims 清单（builtin-fallback，未核查）', '')
  if (draft.claims.length > 0) {
    lines.push('| claim | 内容 | 证据 | 状态 |', '|---|---|---|---|')
    for (const claim of draft.claims) {
      lines.push(`| ${claim.id} | ${claim.text} | ${claim.evidenceIds.join(', ')} | unverified |`)
```

#### 缺口

- 原始正文留存/逐数值蕴含、symlink与Host权限未核。
  **影响**：不能用于无人审查的事实交付或共享隔离。
  **进一步探讨**：构造无关sourceRef/错误口径/未知日期与symlink副本，核是否被识别及人工负担。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖与全周期代价在哪里？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要匹配DSH tools/skills与Node^22.19或>=24、构建lib及工作区写权限；src入口是研究来源，未运行编译/发布包等价验收。web可选建图/公司补充，track需web；引擎可选，fallback能力较弱且不封存核验。没有PDF扫描，数据源需公开文本；深度调整检索数量不是更深推理保证。

首次配置/方法与文本数据、来源披露许可；持续web/模型草稿和文件/ledger增长、缺口补证/修订时间，费用/时延未测。来源hash只验记录字节，不防数据与ledger一起被改；失败写report/manifest或主产物/ledger非整体事务，不能笼统回滚保证。退出先导出产物与来源、核未完成jobs/引擎状态，再卸载；历史文件仍保留需治理，别把插件移除当敏感资料删除。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:67-82](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/README.md#L67-L82)

作者运行依赖/可选服务。

<details>
<summary>查看原文（16行）</summary>

```text
## Compatibility

- DeepSeek Harness `dsh-v0.2.1-alpha.1` (published npm line, verified 2026-09-25; peers `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0`).
0.1.2-rc.1 (adapted 2026-09-02): the session envelope keeps its ignorable field for stored-log read compatibility only - Session.append still cannot stamp it, so audit-gate behavior is unchanged.
Verified 2026-09-24 against the `0.1.7-rc.2` published peers (full gate chain; the real profile install smoke runs in the weekly and per-PR `compat.yml` job).
- Node `^22.19.0 || >=24.0.0`, ESM only (`"type": "module"`).
- Peer dependencies: `@deepseek-ai/cordis ^4.0.2`, `@deepseek-ai/schemastery ^3.18.2`, and `@deepseek-ai/dsh-tools`, `@deepseek-ai/dsh-skill`, `@deepseek-ai/dsh-skill-filesystem` at `>=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0` (all composed by the official `dsh-base` bundle).
- Optional, looked up at execution time (never injected): `ctx.web` (public-source retrieval — composed by `dsh-base`) and `ctx.researchReport` (the sibling `dsh-research-report` sealing engine).

## What you get

- **`industry_map`** — build or update an industry chain map (`chain.json`): upstream/midstream/downstream nodes, edges, and metric slots. A metric with a `value` must carry a `sourceRef`; a value-less slot is an explicit gap. Node `status` assertions carry a `statusAsOf`, and an optional `taxonomyCode` must hit the built-in 国民经济行业分类 大类 table. With `renderSvg: true` it also writes a deterministic, tier-layered `chain.svg` network diagram with funnel/hub bottleneck highlighting. A `depth` argument scales the web assist (quick/standard/comprehensive). Seed notes/files and an optional `ctx.web` digest are registered as citable sources (`S1`, `S2`, …).
- **`industry_track`** — public-source policy/news tracking over the official `ctx.web` seam: per-topic search, host allow/block lists, `since` filtering, bounded snapshot fetches with SHA-256 provenance hashes, and append + dedupe into `timeline.jsonl` with a retention cap. Entries may carry a validated `evidenceCategory`; a `depth` argument scales source counts. Fails loud when the web capability is unreachable.
- **`company_scan`** — company cards (`card.json` + `card.md`) from your workspace data files (SHA-256-hashed, with Markdown outlines and figure-candidate lines so every number cites a file and a line), plus an optional `ctx.web` citation complement. Cards carry a listing `status` (with `statusAsOf`), a format-checked `ticker`, and sourced price/value `metrics` (each with `source` + `asOf`). Batch mode (`companies`) isolates one bad company without aborting the batch; `depth` scales the web complement. Text formats only in v1 (no PDF).
- **`industry_report`** — one auditable report from the map + timeline + cards. Before producing, a deterministic delivery contract checks blocks, status/price assertions, and placeholder residue (fail loud, no half-assembled report). Timeline entries are grouped by `evidenceCategory`. A deterministic bull/bear (正反方) synthesis lists sourced, dated values against declared gaps and data-quality findings, is embedded as the report's multi-perspective section, and is forked as a subagent job writing `perspectives-note.md` into the version ledger. With a mounted `ctx.researchReport` engine the evidence/sections/claims are sealed by its `assemble` and per-claim verdicts come back; without one, the builtin fallback writes versioned `reports/<YYYYMMDD-HHmmss>/report.md` + `manifest.json` with a SHA-256 source-traceability table and honestly labels `engine: 'builtin-fallback'`.
- **Artifact version ledger** — `industry_map` / `company_scan` / `industry_report` append to `versions.jsonl` (root-relative path + SHA-256 + timestamp + change type) on every artifact write; reads verify the hash and fail loud on mismatch.
```

</details>

**依据 2 · 源码核查**：[src/company.ts:134-144](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/company.ts#L134-L144)

文本/大小条件。

<details>
<summary>查看原文（11行）</summary>

```text
export async function scanFile(path: string, maxBytes: number): Promise<ScannedFile> {
  const ext = extname(path).toLowerCase()
  if (!READABLE_EXTENSIONS.has(ext)) {
    throw new Error(`unsupported data-file extension ${JSON.stringify(ext)} (v1 reads ${[...READABLE_EXTENSIONS].join(', ')}; PDF is out of scope)`)
  }
  const info = await stat(path)
  if (!info.isFile()) throw new Error(`not a regular file: ${path}`)
  if (info.size > maxBytes) {
    throw new Error(`file exceeds scan.maxFileBytes (${info.size} > ${maxBytes}): ${path}`)
  }
  const content = await readFile(path, 'utf8')
```

</details>

**依据 3 · 源码核查**：[src/tools/track.ts:132-147](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/tools/track.ts#L132-L147)

depth调预算。

<details>
<summary>查看原文（16行）</summary>

```text
      const maxResultsPerTopic = depth === 'standard' ? config.track.maxResultsPerTopic : DEPTH_PROFILES[depth].trackMaxResultsPerTopic
      const maxFetchesPerCall = depth === 'standard' ? config.track.maxFetchesPerCall : DEPTH_PROFILES[depth].trackMaxFetchesPerCall
      const topics = (args.topics ?? [`${name} 行业 政策`, `${name} 行业 动态 要闻`]).map(topic => topic.trim()).filter(topic => topic.length > 0)
      if (topics.length === 0) throw new Error('topics must contain at least one non-empty topic')
      const since = args.since?.trim()
      if (since !== undefined && Number.isNaN(Date.parse(since))) {
        throw new Error(`since must be an ISO-8601 date, got ${JSON.stringify(args.since)}`)
      }

      // Search phase: one web.search per topic.
      interface Candidate { url: string; title: string | null; snippet: string | null; publishedAt: string | null; topics: string[] }
      const byUrl = new Map<string, Candidate>()
      for (const topic of topics) {
        const outcome = await web.search(
          { query: topic, maxResults: maxResultsPerTopic },
          requestSignal(exec.signal, config.fetchTimeoutMs),
```

</details>

**依据 4 · 源码核查**：[src/versions.ts:95-126](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/versions.ts#L95-L126)

ledger与产物独立写。

<details>
<summary>查看原文（32行）</summary>

```text
export async function recordVersion(path: string, artifact: string, content: string, capturedAt: string): Promise<ArtifactChange> {
  const previous = ledgerTails.get(path) ?? Promise.resolve()
  const run = previous.then(async (): Promise<ArtifactChange> => {
    const records = await readVersions(path)
    const change: ArtifactChange = records.some(record => record.artifact === artifact) ? 'updated' : 'created'
    records.push({ artifact, sha256: sha256Of(content), capturedAt, change })
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, `${records.map(record => JSON.stringify(record)).join('\n')}\n`, 'utf8')
    return change
  })
  ledgerTails.set(path, run.then(() => undefined, () => undefined))
  return run
}

/**
 * Verify an artifact's content against its latest ledger record. A missing
 * record is a no-op (unrecorded artifacts are not checked); a hash mismatch
 * fails loud.
 * @param path - absolute path of `versions.jsonl`.
 * @param artifact - root-relative artifact path.
 * @param content - the read-back bytes to verify.
 */
export async function verifyVersion(path: string, artifact: string, content: string): Promise<void> {
  const records = await readVersions(path)
  let latest: VersionRecord | undefined
  for (const record of records) {
    if (record.artifact === artifact) latest = record
  }
  if (latest === undefined) return
  const hash = sha256Of(content)
  if (hash !== latest.sha256) {
    throw new Error(`artifact ${JSON.stringify(artifact)} failed version verification: content hash ${hash} does not match recorded ${latest.sha256}`)
```

</details>

**依据 5 · 源码核查**：[src/report.ts:387-420](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/report.ts#L387-L420)

fallback两文件写入。

<details>
<summary>查看原文（34行）</summary>

```text
export async function writeFallbackReport(
  reportDir: string,
  industry: string,
  draft: ReportDraft,
  evidence: readonly EvidenceInput[],
  gaps: readonly string[],
  generatedAt: string,
  machineCheck: readonly string[] = [],
  perspectives: PerspectivesSynthesis = { bull: [], bear: [] },
): Promise<{ reportPath: string; manifestPath: string }> {
  await mkdir(reportDir, { recursive: true })
  const reportPath = join(reportDir, 'report.md')
  const manifestPath = join(reportDir, 'manifest.json')
  const manifest: FallbackManifest = {
    engine: 'builtin-fallback',
    industry,
    title: draft.title,
    generatedAt,
    disclaimer: DISCLAIMER,
    evidence: evidence.map(item => ({
      id: item.id,
      title: item.title,
      origin: item.origin,
      sha256: sha256Of(item.content),
      capturedAt: item.capturedAt,
      bytes: Buffer.byteLength(item.content, 'utf8'),
    })),
    claims: draft.claims.map(claim => ({ ...claim, status: 'unverified' as const })),
    gaps: [...gaps],
    machineCheck: [...machineCheck],
    perspectives: { bull: [...perspectives.bull], bear: [...perspectives.bear] },
  }
  await writeFile(reportPath, renderFallbackMarkdown(industry, draft, evidence, generatedAt, machineCheck, perspectives), 'utf8')
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
```

</details>

#### 缺口

- 实际Host/lib一致性、web服务/模型成本与退出恢复未验。
  **影响**：无法估单位合格研究总成本。
  **进一步探讨**：脱敏工作区先离线验证回溯，再固定web/模型比较完整任务成本与恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 具体采用范围及增量怎样证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可试用公开非敏感文本资料的结构整理，并由研究者逐重要值回原文核口径/日期；先用fallback标未验证，不把红方job当独立review，也不把引擎存在当真实核证。碰到缺正文/冲突来源或hash不符先停生成结论，保原件回手工研究，不直接自动发布或作投资依据。

可探索领域证据契约：metric绑定原文段落/日期/单位和候选口径，将track仅hash/未抓取状态区分，报告按原件而非仅生成card登记证据。已有sourceRef/hash/日期/版本门是基线，增量是可验证支持关系。用同值不同单位、过期来源、无关S ref和快照失败样本，比较错误值进入报告率、补证人工时间/存储和版权披露负担；若引擎/人工链接已等效或自动抽段误匹配更多，否定。未实现，不计既有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/report.ts:62-72](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/report.ts#L62-L72)

目前artifact证据粒度。

<details>
<summary>查看原文（11行）</summary>

```text
  const evidence: EvidenceInput[] = []
  if (artifacts.chain !== undefined) {
    evidence.push({ id: 'E-chain', title: '产业链结构图 chain.json', origin: artifacts.chain.path, content: artifacts.chain.content, capturedAt })
  }
  if (artifacts.timeline !== undefined) {
    evidence.push({ id: 'E-timeline', title: '政策与动态时间线 timeline.jsonl', origin: artifacts.timeline.path, content: artifacts.timeline.content, capturedAt })
  }
  for (const { path, content, card } of artifacts.cards) {
    evidence.push({ id: `E-company-${card.slug}`, title: `公司速览卡 ${card.name}`, origin: path, content, capturedAt })
  }
  return evidence
```

</details>

**依据 2 · 源码核查**：[src/report.ts:155-172](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/report.ts#L155-L172)

现有来源日期门基线。

<details>
<summary>查看原文（18行）</summary>

```text
        if (metric.value !== undefined && (typeof metric.sourceRef !== 'string' || metric.sourceRef.trim().length === 0)) {
          problems.push(`delivery contract: chain node "${node.id}" metric[${metricIndex}] carries a value without a sourceRef`)
        }
      }
    }
  }
  for (const { card } of artifacts.cards) {
    problems.push(...validateStatus(card.status, card.statusAsOf, `company card "${card.name}"`, now))
    for (const [metricIndex, metric] of (card.metrics ?? []).entries()) {
      if (typeof metric.source !== 'string' || metric.source.trim().length === 0) {
        problems.push(`delivery contract: company card "${card.name}" metric[${metricIndex}] carries a value without a source`)
      }
      if (typeof metric.asOf !== 'string' || metric.asOf.trim().length === 0) {
        problems.push(`delivery contract: company card "${card.name}" metric[${metricIndex}] carries a value without an asOf`)
      } else if (!isIsoDate(metric.asOf)) {
        problems.push(`delivery contract: company card "${card.name}" metric[${metricIndex}] asOf ${JSON.stringify(metric.asOf)} is not a valid ISO-8601 date`)
      } else if (Date.parse(metric.asOf) > now.getTime()) {
        problems.push(`delivery contract: company card "${card.name}" metric[${metricIndex}] asOf ${JSON.stringify(metric.asOf)} is in the future`)
```

</details>

**依据 3 · 源码核查**：[src/tools/track.ts:188-215](https://github.com/PerryLink/dsh-industry-research/blob/4a2a320851cffcfe828e648ba05528de453b9ce8/src/tools/track.ts#L188-L215)

抓取状态需显式绑定。

<details>
<summary>查看原文（28行）</summary>

```text
      const fetchable = candidates.slice(0, maxFetchesPerCall)
      await pool(fetchable, FETCH_CONCURRENCY, async (candidate) => {
        try {
          const outcome = await web.fetch({ url: candidate.url }, requestSignal(exec.signal, config.fetchTimeoutMs))
          snapshots.set(candidate.url, sha256Of(outcome.body.content))
        } catch (error) {
          fetchFailed.push({ url: candidate.url, note: webErrorMessage(error) })
        }
      })

      const batch: TimelineEntry[] = candidates.map(candidate => {
        const snapshotHash = snapshots.get(candidate.url) ?? null
        const failure = fetchFailed.find(entry => entry.url === candidate.url)
        const beyondBudget = !fetchable.includes(candidate)
        return {
          date: candidate.publishedAt,
          title: candidate.title ?? candidate.url,
          url: candidate.url,
          summary: candidate.snippet,
          snapshotHash,
          capturedAt: now,
          topics: candidate.topics,
          ...(snapshotHash === null
            ? { note: failure !== undefined ? `快照抓取失败：${failure.note}` : beyondBudget ? '超出本次抓取预算，未抓取快照' : '无快照' }
            : {}),
          ...(args.evidenceCategory !== undefined ? { evidenceCategory: args.evidenceCategory } : {}),
        }
      })
```

</details>

#### 缺口

- 领域证据契约未实现或对照。
  **影响**：不能把新设计算事实质量提高。
  **进一步探讨**：先与手工逐值链接原文做盲审对照，再考虑自动化。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
