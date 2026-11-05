# DSH Web Search Pro

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[8b6e5c6](https://github.com/anweat/dsh-web-search-pro/tree/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44)

<!-- BEGIN META -->
[![GitHub ★ 84](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=84&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anweat/dsh-web-search-pro) [![npm 30d 6,045](https://img.shields.io/static/v1?label=npm+30d&message=6%2C045&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-search-pro) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-search-pro)
<!-- END META -->

> **功能**：以按需动作和有出处的证据包组织多来源搜索

> **亮点**：[Q01](#research-q01) 提供需求映射、摘录及可追查原块。

> **主要限制**：[Q03](#research-q03) 压缩和评分回退可能漏证，CLI及历史需管理。

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
  - [Q01 · 与搜索列表相比增加什么？](#detail-section-11)
  - [Q02 · 实际调用链和降级怎样连接？](#detail-section-12)
  - [Q03 · 证据包还可能遗漏什么？](#detail-section-13)
  - [Q04 · 如何采用和退出？](#detail-section-14)
  - [Q05 · 什么对照支持继续采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：研究者要按多个要求整理来源证据。

搜索结果列表后人工逐页整理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 按需动作 | 目录发现后调用检索或管理动作 | 须计入额外发现轮次 |
| 证据包 | 按需求返回摘录、来源和块标识 | 评分不是事实真值 |
| 缓存历史 | 复用查询及规则 | 需核对时效和留存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 作者支持的DSH与web接缝 | 必需 | 注册工具及提供方 | 其他组合另验 |
| 来源凭据或公开入口 | 按来源 | 抓取搜索内容 | 失败影响覆盖 |
| 评分模型及CLI | 可选 | 语义评分及登录平台访问 | 失败可退规则，权限独立核查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 公开来源及无敏问题，记原配置 | 禁止把登录平台当首次验证 |
| 对照 | 同页集合运行列表、规则和模型证据包 | 记录漏证与完整成本 |
| 退出 | 恢复provider并清历史和配置 | 按数据保留要求逐项核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 来源与工具资源未知 | key、CLI和公开样例准备耗时未知 | 实际安装未执行 |
| 持续 | 抓取与模型评分资源未知 | 来源可用性、规则维护耗时未知 | 额外调用可能抵消输出压缩 |
| 恢复 | 历史清理资源未知 | 恢复provider与检查缓存耗时未知 | 卸载清理范围未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 需求映射 | 结果包含needIds和出处块 | 真实漏证率未知 |
| 评分回退 | 代码记录规则降级 | 降级后的相关性未知 |
| 上下文 | 默认按需工具曝光存在 | 全过程token和费用未知 |

> **思考**：[Q03](#research-q03) 压缩和评分回退可能漏证，CLI及历史需管理。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供需求映射、摘录及可追查原块。

工具共享调度，管线保留块hash和评分器。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 压缩和评分回退可能漏证，CLI及历史需管理。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 公开来源起步，对照规则和远程评分。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的在有限上下文中交付可复核摘录和未满足需求。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 src/tools.ts、src/pipeline/run.ts、README.md、src/index.ts、src/pipeline/service.ts、src/cli/runner.ts、src/actions/approval.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的在有限上下文中交付可复核摘录和未满足需求。未执行目标代码或实际宿主验证。
- 下一步：保留页面快照、期望需求覆盖及完整用量账。

**分析版本**

- **仓库**：[anweat/dsh-web-search-pro](https://github.com/anweat/dsh-web-search-pro)
- **版本号**：0.2.3（[固定提交 8b6e5c6](https://github.com/anweat/dsh-web-search-pro/tree/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 证据包可在保留关键事实时降低整理负担。

保留页面快照、期望需求覆盖及完整用量账。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 36 | 3124 | — | — | 75419 |
| .ts | source | 169 | 30824 | 23253 | 5159 | — |
| .ts | test | 119 | 22883 | 20257 | 1757 | — |
| .js | source | 159 | 34556 | 30211 | 5159 | — |
| .mjs | source | 5 | 429 | 329 | 70 | — |
| .tsx | source | 15 | 1842 | 1459 | 234 | — |
| .js | test | 1 | 334 | 264 | 63 | — |
| .mjs | test | 1 | 21 | 12 | 9 | — |
| .tsx | test | 1 | 55 | 45 | 6 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/anweat/dsh-web-search-pro/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在有限上下文中交付可复核摘录和未满足需求

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 与搜索列表相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

资料研究者需要按问题逐项找证据，而普通搜索先交URL再由Agent逐页整理。组件的证据管线按任务需求选择摘录并保留URL、blockId、评分和来源；工具默认以目录加调用器按需暴露动作。增量在证据组织和工具披露方式，不能从两个工具直接推出总token更少。验收是摘录忠于页面、需求缺口可见且后续可回源。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:1-14](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/tools.ts#L1-L14)

工具两种曝光模式共享调度

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Model-facing tool surfaces for web-search-pro.
 *
 * Every capability is an action in the registry (`src/actions/`). This module
 * only projects that registry into tools:
 *
 * - `indexed` (default): two small tools, `web_index` for progressive
 *   disclosure and `web_call` to run an action. Constant, tiny context cost.
 * - `flat`: one tool per action, named `web_<group>_<action>`. Every action
 *   is described up front; for comparison and debugging only.
 *
 * Both surfaces dispatch through the same {@link runAction}, so validation,
 * the result envelope and the error codes are identical.
 * @module web-search-pro/tools
```

</details>

**依据 2 · 源码核查**：[src/pipeline/run.ts:620-634](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/pipeline/run.ts#L620-L634)

实际证据项和完整块记录

<details>
<summary>查看原文（15行）</summary>

```text
  for (const s of selection.selected) {
    const evidenceId = 'e_' + crypto.createHash('sha1').update(resultId + ':' + s.block.url + ':' + s.block.block.blockId + ':' + s.excerpt).digest('hex').slice(0, 10)
    const heading = s.block.block.heading
    const scorer = scorerByBlock.get(s.block.block.blockId + '|' + s.block.url) ?? scorerUsed
    evidence.push({
      evidenceId, blockId: s.block.block.blockId, url: s.block.url,
      ...s.block.title ? { title: s.block.title } : {},
      excerpt: s.excerpt,
      ...heading ? { heading } : {},
      ...s.block.publishedAt ? { publishedAt: s.block.publishedAt } : {},
      needIds: s.needIds, grade: Number(s.grade.toFixed(2)), source: s.block.providers.join('+'),
      ...s.block.lowConfidence ? { lowConfidence: true as const } : {},
      ...s.block.origin,
    })
    evidenceBlocks.push({ evidenceId, url: s.block.url, blockId: s.block.block.blockId, ...heading ? { heading } : {}, text: s.block.block.text, hash: s.block.block.hash, grade: Number(s.grade.toFixed(3)), scorer, ...scorer !== 'rule' && scorer !== 'none' && control.rubricRef ? { rubric: control.rubricRef.key } : {}, ...scorer !== 'rule' && scorer !== 'none' && judgeKey(control) ? { judge: judgeKey(control)! } : {} })
```

</details>

**依据 3 · 作者声明**：[README.md:5-12](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/README.md#L5-L12)

作者描述证据包与持久缓存

```text
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）的增强型网页搜索插件：多引擎搜索、平台搜索、持久化缓存和证据包，常驻上下文只有两个工具。

- **证据包模式**：给 `search.run` 一句任务目标，返回的不是结果列表，而是按需求评分后的摘录和未满足的缺口，占用的上下文少得多。
- **多引擎 + 平台来源**：ddg / bing / Exa / Jina 等网页引擎加 GitHub、B站、YouTube、小红书、知乎、Reddit、X、RSS 等平台，统一的探测、冷却、回退与历史；DeepSeek 搜索 / 抓取是“常用”来源（按请求计费）。
- **登录由你自己完成**：需要登录的平台优先走 `opencli`（用你日常 Chrome 的登录态），插件没有登录窗口，也不读 Cookie。
- **两个常驻工具**：`web_index`（目录）→ `web_call`（执行），27 个动作按需披露，约 800 字符常驻。
- **持久化**：SQLite + 内存 LRU 双层缓存、查询历史、可再导入的站点提取规则。
- **可视化设置**：一张设置卡片管理搜索顺序、Key、自定义 CLI 和评分模型，agent 的改动以覆盖层形式出现，可一键采纳或撤销。
```

#### 缺口

- 相对列表的准确率和总上下文用量未测。
  **影响**：筛选可能省输出却漏关键证据或增加评分请求。
  **进一步探讨**：同问题比较列表及证据包，统计全过程用量。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 实际调用链和降级怎样连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根入口构建服务并注册工具及可选web provider。EvidenceService调用runPipeline，后者计划来源、检索和抓取分块，再评分选择与覆盖检查。远程评分异常先检查用户取消，再记录原因并退规则评分；用户abort直抛，管线deadline则用已有材料返回partial。结果包保留原块hash与评分器，支持追查为何保留。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:112-142](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/index.ts#L112-L142)

服务和工具接入

<details>
<summary>查看原文（31行）</summary>

```text
  //    a declared `inject` (Cordis 4.0.4 would hang the plugin without it); without it the web_index
  //    root carries a compact guide instead.
  const skill = registerSkillWhenAvailable(ctx)
  //    One evidence service serves search.run and the ctx.web provider (it keeps no per-call state).
  const evidence = new EvidenceService({ router, fetch: fetchSvc, store, dynamic })
  const providerState = (): ProviderState => readProviderState({ web: ctx.get('web'), registered: providerRegistered, id: dynamic().providerId, evidence: dynamic().provider.evidence })
  registerTools({ ctx, config: resolved, dynamic, store, router, fetch: fetchSvc, browser: getBrowser, evidence, providerState, skillAvailable: skill.isAvailable, overlay, pendingRestart: pending })

  //    Approval is decided per ACTION: web_call (and each flat tool) is resolved to its action first, so the user
  //    is asked about `cache.clear` or `sources.install bili`, not about a generic dispatcher. The old tools were
  //    gated by name from dsh-browser's hook; that hook cannot see inside web_call, so the rules live here and
  //    read dsh-browser's automationMode when the service is present (see actions/approval.ts).
  ctx.on('tools/pre-execute', async (exec, next) => {
    const downstream = await next()
    if (downstream.kind !== 'allow') return downstream
    const call = resolveWebCall(exec.name, exec.arguments)
    if (call?.kind !== 'action') return downstream
    const action = findAction(call.action)
    if (!action || action.approval === 'none') return downstream
    return webCallDecision(call.action, call.args, await automationModeOf(usableBrowser(getBrowser())))
  })

  // 5. Optional ctx.web provider registration (opt-in: `registerProvider`). The Host picks a provider only when the `web`
  //    entry pins its id (`searchProvider` / `fetchProvider`, or DSH_WEB_SEARCH_PROVIDER / DSH_WEB_FETCH_PROVIDER), or when it
  //    is the only usable one; two usable providers without a pin make every built-in web_search fail (WEB_PROVIDER_AMBIGUOUS),
  //    which is why registering is never the default. Once selected, the built-in web_search returns this plugin's evidence
  //    pack (`provider.evidence`) and web_fetch its budgeted pages. Registration is effect-scoped per fiber.
  const web = ctx.get('web')
  let providerRegistered = false
  if (web && resolved.registerProvider) {
    web.registerSearchProvider(createSearchProvider({ router, evidence: () => evidence, dynamic, id: () => dynamic().providerId, surface: resolved.toolSurface }))
```

</details>

**依据 2 · 源码核查**：[src/pipeline/service.ts:210-219](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/pipeline/service.ts#L210-L219)

服务调用实际管线

<details>
<summary>查看原文（10行）</summary>

```text
      ...callOptions && Object.keys(callOptions).length && platformId !== undefined && explicit?.length ? { providerOptions: { [platformId]: callOptions } } : {},
      sourcesCount: request.count,
      maxScoreQuestions: cfg.evidence.maxJevQuestions,
      maxRounds: cfg.evidence.maxRounds,
      maxQueries: cfg.evidence.maxQueries,
    }
    const result = await runPipeline(spec, deps, options)
    result.pack.notes.unshift(...specNotes, ...scorerNotes, ...platformNotes)
    this.persist(result, request)
    const { sources, ...rest } = result.pack
```

</details>

**依据 3 · 源码核查**：[src/pipeline/run.ts:199-208](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/pipeline/run.ts#L199-L208)

deadline与用户signal

<details>
<summary>查看原文（10行）</summary>

```text
export async function runPipeline(task: TaskSpec, deps: PipelineDeps, options: PipelineOptions = {}): Promise<PipelineResult> {
  const deadlineMs = options.deadlineMs ?? task.budget.deadlineMs ?? DEFAULT_DEADLINE_MS
  const deadlineAt = Date.now() + deadlineMs
  const deadlineSignal = AbortSignal.timeout(deadlineMs)
  const stage = options.signal ? AbortSignal.any([options.signal, deadlineSignal]) : deadlineSignal
  const checkUser = (): void => { if (options.signal?.aborted) throw abortReason(options.signal) }
  const notes: string[] = []
  const now = deps.now?.() ?? new Date()

  // S1
```

</details>

**依据 4 · 源码核查**：[src/pipeline/run.ts:459-474](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/pipeline/run.ts#L459-L474)

评分失败降级

<details>
<summary>查看原文（16行）</summary>

```text
    if (fullJobs.length) {
      if (control.id !== 'rule' && !ctx.stage.aborted) {
        // The hybrid scorer picks (and caps) the pairs it sends to Jev itself; a plain remote scorer gets the first `maxScoreQuestions`.
        const limited = control.id === 'hybrid' ? fullJobs : limitQuestions(fullJobs, options.maxScoreQuestions ?? 64)
        try {
          outcome = await control.score(task, limited, scoreCtx)
          if (outcome.usage) jevUsage = addUsage(jevUsage, { requests: outcome.usage.requests, questions: outcome.usage.questions + outcome.usage.cacheHits, inputTokens: outcome.usage.inputTokens, outputTokens: outcome.usage.outputTokens, mode: control.id === 'hybrid' ? 'hybrid' : 'control', ...rubricStats(control), ...providerStats(control), ...usageStats(outcome.usage) })
          if (outcome.notes?.length) notes.push(...outcome.notes.map(n => control.id + ': ' + n))
        } catch (error) {
          checkUser()
          notes.push('scorer ' + control.id + ' failed, used the rule scorer: ' + (error instanceof Error ? error.message : String(error)))
          outcome = undefined
        }
      } else if (control.id !== 'rule') notes.push('scorer ' + control.id + ' skipped after the deadline, used the rule scorer')
      if (!outcome) { outcome = await (control.id === 'rule' ? control : rule).score(task, fullJobs, scoreCtx); used = 'rule' }
      capDiscussionGrades(ctx.plan.profile, fullJobs, outcome)
```

</details>

**依据 5 · 源码核查**：[src/pipeline/run.ts:620-634](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/pipeline/run.ts#L620-L634)

结果归因和原块hash

<details>
<summary>查看原文（15行）</summary>

```text
  for (const s of selection.selected) {
    const evidenceId = 'e_' + crypto.createHash('sha1').update(resultId + ':' + s.block.url + ':' + s.block.block.blockId + ':' + s.excerpt).digest('hex').slice(0, 10)
    const heading = s.block.block.heading
    const scorer = scorerByBlock.get(s.block.block.blockId + '|' + s.block.url) ?? scorerUsed
    evidence.push({
      evidenceId, blockId: s.block.block.blockId, url: s.block.url,
      ...s.block.title ? { title: s.block.title } : {},
      excerpt: s.excerpt,
      ...heading ? { heading } : {},
      ...s.block.publishedAt ? { publishedAt: s.block.publishedAt } : {},
      needIds: s.needIds, grade: Number(s.grade.toFixed(2)), source: s.block.providers.join('+'),
      ...s.block.lowConfidence ? { lowConfidence: true as const } : {},
      ...s.block.origin,
    })
    evidenceBlocks.push({ evidenceId, url: s.block.url, blockId: s.block.block.blockId, ...heading ? { heading } : {}, text: s.block.block.text, hash: s.block.block.hash, grade: Number(s.grade.toFixed(3)), scorer, ...scorer !== 'rule' && scorer !== 'none' && control.rubricRef ? { rubric: control.rubricRef.key } : {}, ...scorer !== 'rule' && scorer !== 'none' && judgeKey(control) ? { judge: judgeKey(control)! } : {} })
```

</details>

#### 缺口

- 实际各阶段预算、错误及partial呈现未运行。
  **影响**：远程评分和规则结果差异可能改变保留证据。
  **进一步探讨**：冻结同页材料，对照评分失败前后输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 证据包还可能遗漏什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

管线把页面变为块并按评分和选择压缩，分数不是事实真实性概率。远程失败改用规则评分时来源可用但相关性判断已变。CLI适配会访问用户环境与登录态，源码runner限制传递环境且不主动登录，这不能证明所有第三方CLI只读或不接触私有平台数据。

#### 证据与依据

**依据 1 · 源码核查**：[src/pipeline/run.ts:459-474](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/pipeline/run.ts#L459-L474)

规则回退改变评分器

<details>
<summary>查看原文（16行）</summary>

```text
    if (fullJobs.length) {
      if (control.id !== 'rule' && !ctx.stage.aborted) {
        // The hybrid scorer picks (and caps) the pairs it sends to Jev itself; a plain remote scorer gets the first `maxScoreQuestions`.
        const limited = control.id === 'hybrid' ? fullJobs : limitQuestions(fullJobs, options.maxScoreQuestions ?? 64)
        try {
          outcome = await control.score(task, limited, scoreCtx)
          if (outcome.usage) jevUsage = addUsage(jevUsage, { requests: outcome.usage.requests, questions: outcome.usage.questions + outcome.usage.cacheHits, inputTokens: outcome.usage.inputTokens, outputTokens: outcome.usage.outputTokens, mode: control.id === 'hybrid' ? 'hybrid' : 'control', ...rubricStats(control), ...providerStats(control), ...usageStats(outcome.usage) })
          if (outcome.notes?.length) notes.push(...outcome.notes.map(n => control.id + ': ' + n))
        } catch (error) {
          checkUser()
          notes.push('scorer ' + control.id + ' failed, used the rule scorer: ' + (error instanceof Error ? error.message : String(error)))
          outcome = undefined
        }
      } else if (control.id !== 'rule') notes.push('scorer ' + control.id + ' skipped after the deadline, used the rule scorer')
      if (!outcome) { outcome = await (control.id === 'rule' ? control : rule).score(task, fullJobs, scoreCtx); used = 'rule' }
      capDiscussionGrades(ctx.plan.profile, fullJobs, outcome)
```

</details>

**依据 2 · 源码核查**：[src/pipeline/run.ts:624-634](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/pipeline/run.ts#L624-L634)

等级与摘录非完整页面

<details>
<summary>查看原文（11行）</summary>

```text
    evidence.push({
      evidenceId, blockId: s.block.block.blockId, url: s.block.url,
      ...s.block.title ? { title: s.block.title } : {},
      excerpt: s.excerpt,
      ...heading ? { heading } : {},
      ...s.block.publishedAt ? { publishedAt: s.block.publishedAt } : {},
      needIds: s.needIds, grade: Number(s.grade.toFixed(2)), source: s.block.providers.join('+'),
      ...s.block.lowConfidence ? { lowConfidence: true as const } : {},
      ...s.block.origin,
    })
    evidenceBlocks.push({ evidenceId, url: s.block.url, blockId: s.block.block.blockId, ...heading ? { heading } : {}, text: s.block.block.text, hash: s.block.block.hash, grade: Number(s.grade.toFixed(3)), scorer, ...scorer !== 'rule' && scorer !== 'none' && control.rubricRef ? { rubric: control.rubricRef.key } : {}, ...scorer !== 'rule' && scorer !== 'none' && judgeKey(control) ? { judge: judgeKey(control)! } : {} })
```

</details>

**依据 3 · 源码核查**：[src/cli/runner.ts:1-4](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/cli/runner.ts#L1-L4)

runner边界描述

```text
/**
 * The runner of CLI adapter specs (dev-plan M12): spawns the tool without a shell, decodes its output as UTF-8, caps
 * time and size, maps the output to search sources and every failure to a structured error. It never logs or echoes
 * environment values (error text is scrubbed of any value of a variable the spec names) and never runs a login.
```

**依据 4 · 源码核查**：[src/cli/runner.ts:27-48](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/cli/runner.ts#L27-L48)

环境白名单和配置扩展

<details>
<summary>查看原文（22行）</summary>

```text
/** Variables every tool needs to start and reach the network; nothing else of the process environment is handed over. */
const BASE_ENV = [
  'PATH', 'PATHEXT', 'HOME', 'USERPROFILE', 'HOMEDRIVE', 'HOMEPATH', 'APPDATA', 'LOCALAPPDATA', 'SYSTEMROOT', 'SystemRoot', 'COMSPEC', 'WINDIR',
  'TEMP', 'TMP', 'TMPDIR', 'LANG', 'LANGUAGE', 'LC_ALL', 'LC_CTYPE', 'XDG_CONFIG_HOME', 'XDG_DATA_HOME', 'XDG_CACHE_HOME', 'XDG_STATE_HOME',
  'HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'NO_PROXY', 'http_proxy', 'https_proxy', 'all_proxy', 'no_proxy',
  'SSL_CERT_FILE', 'SSL_CERT_DIR', 'REQUESTS_CA_BUNDLE', 'CURL_CA_BUNDLE', 'NODE_EXTRA_CA_CERTS',
] as const

/** UTF-8 for Python tools (the Windows console otherwise answers in the system code page; dev issue #28). */
const UTF8_ENV = { PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' } as const

/**
 * A NO_PROXY list with its IPv6 entries written without brackets (`[::1]` / `[::1]:8080` -> `::1`). Python's httpx (omnireach, and
 * any tool built on it) refuses a bracketed entry with "Invalid port: ':1]'" and the whole search fails; the DSH Host sets
 * `NO_PROXY` with `[::1]`, which a plain terminal does not (found live 2026-10-26). Every tool that takes NO_PROXY accepts the bare form.
 */
export function normalizeNoProxy(list: string): string {
  return list.split(',').map(entry => entry.trim().replace(/^\[([0-9a-fA-F:.]+)\](?::\d+)?$/, '$1')).filter(entry => entry.length > 0).join(',')
}

/** The environment a spec's command runs with: the base set, what the spec lists, and the fixed UTF-8 / `env.set` values. */
export function buildCliEnv(spec: Pick<CliAdapterSpec, 'env'>, source: NodeJS.ProcessEnv = process.env): Record<string, string> {
```

</details>

**依据 5 · 源码核查**：[src/actions/approval.ts:1-8](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/actions/approval.ts#L1-L8)

按动作处理审批

```text
/**
 * Approval, per action.
 *
 * The old tools were gated by name from inside dsh-browser's `tools/pre-execute` hook (`web_deps install`,
 * `web_cache_clear`, `web_rule` writes), under dsh-browser's `automationMode`. With one dispatcher tool that
 * hook can no longer tell the operations apart, so this plugin resolves `web_call` (or a flat tool) to its
 * action itself and applies the same rules, reading `automationMode` from the browser service when it is
 * present. Without it the mode is unknown and the strictest ordinary rule (`standard`: ask) applies.
```

#### 缺口

- 第三方CLI运行行为、页面提示注入和摘要失真未验。
  **影响**：可能把低质量材料压成高可读但不充分证据。
  **进一步探讨**：加入否定词、尾段结论及恶意页面内容。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何采用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先只用公开HTTP来源，固定作者支持的宿主范围，记录缓存目录及原web provider，再启用证据评分或浏览器CLI。首次成本含来源key、CLI和规则，持续含抓取、模型评分、持久缓存及来源维护。退出恢复原provider、停用bundle，清理不需的查询历史和平台访问配置。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-20](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/README.md#L14-L20)

作者兼容范围

```text
## 兼容性

| 项 | 范围 |
|---|---|
| dsh-web-search-pro | `0.2.3` |
| DSH 宿主（peer） | `>=0.2.0-rc.2 <0.2.1-0 \|\| >=0.2.1-rc.2 <0.2.2-0`；实测 `0.2.0-rc.2`、`0.2.1-rc.3`、`0.2.1-rc.4` |
| cordis（peer） | `~4.0.4` |
```

**依据 2 · 源码核查**：[src/tools.ts:1-14](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/tools.ts#L1-L14)

flat/indexed可对照

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Model-facing tool surfaces for web-search-pro.
 *
 * Every capability is an action in the registry (`src/actions/`). This module
 * only projects that registry into tools:
 *
 * - `indexed` (default): two small tools, `web_index` for progressive
 *   disclosure and `web_call` to run an action. Constant, tiny context cost.
 * - `flat`: one tool per action, named `web_<group>_<action>`. Every action
 *   is described up front; for comparison and debugging only.
 *
 * Both surfaces dispatch through the same {@link runAction}, so validation,
 * the result envelope and the error codes are identical.
 * @module web-search-pro/tools
```

</details>

**依据 3 · 源码核查**：[src/cli/runner.ts:27-48](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/cli/runner.ts#L27-L48)

CLI传递环境条件

<details>
<summary>查看原文（22行）</summary>

```text
/** Variables every tool needs to start and reach the network; nothing else of the process environment is handed over. */
const BASE_ENV = [
  'PATH', 'PATHEXT', 'HOME', 'USERPROFILE', 'HOMEDRIVE', 'HOMEPATH', 'APPDATA', 'LOCALAPPDATA', 'SYSTEMROOT', 'SystemRoot', 'COMSPEC', 'WINDIR',
  'TEMP', 'TMP', 'TMPDIR', 'LANG', 'LANGUAGE', 'LC_ALL', 'LC_CTYPE', 'XDG_CONFIG_HOME', 'XDG_DATA_HOME', 'XDG_CACHE_HOME', 'XDG_STATE_HOME',
  'HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'NO_PROXY', 'http_proxy', 'https_proxy', 'all_proxy', 'no_proxy',
  'SSL_CERT_FILE', 'SSL_CERT_DIR', 'REQUESTS_CA_BUNDLE', 'CURL_CA_BUNDLE', 'NODE_EXTRA_CA_CERTS',
] as const

/** UTF-8 for Python tools (the Windows console otherwise answers in the system code page; dev issue #28). */
const UTF8_ENV = { PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' } as const

/**
 * A NO_PROXY list with its IPv6 entries written without brackets (`[::1]` / `[::1]:8080` -> `::1`). Python's httpx (omnireach, and
 * any tool built on it) refuses a bracketed entry with "Invalid port: ':1]'" and the whole search fails; the DSH Host sets
 * `NO_PROXY` with `[::1]`, which a plain terminal does not (found live 2026-10-26). Every tool that takes NO_PROXY accepts the bare form.
 */
export function normalizeNoProxy(list: string): string {
  return list.split(',').map(entry => entry.trim().replace(/^\[([0-9a-fA-F:.]+)\](?::\d+)?$/, '$1')).filter(entry => entry.length > 0).join(',')
}

/** The environment a spec's command runs with: the base set, what the spec lists, and the fixed UTF-8 / `env.set` values. */
export function buildCliEnv(spec: Pick<CliAdapterSpec, 'env'>, source: NodeJS.ProcessEnv = process.env): Record<string, string> {
```

</details>

#### 缺口

- 缓存保留和卸载后来源配置未实测。
  **影响**：持久历史与登录平台可能增加退出核对负担。
  **进一步探讨**：从无登录公开来源验证后再逐项扩展。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么对照支持继续采用？

**研究主题**：新假设与验证

#### 完整回答

对同一任务比较普通来源列表、规则证据包和远程评分证据包，控制页集合和模型。记录需求覆盖、错误引用、漏证、全过程token、费用和时延。注入评分故障、deadline、用户取消及截断页面。若压缩损害关键事实、partial未提示缺口或总成本高于改善，则退回列表模式。

#### 证据与依据

**依据 1 · 源码核查**：[src/pipeline/run.ts:459-474](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/pipeline/run.ts#L459-L474)

可控制评分回退

<details>
<summary>查看原文（16行）</summary>

```text
    if (fullJobs.length) {
      if (control.id !== 'rule' && !ctx.stage.aborted) {
        // The hybrid scorer picks (and caps) the pairs it sends to Jev itself; a plain remote scorer gets the first `maxScoreQuestions`.
        const limited = control.id === 'hybrid' ? fullJobs : limitQuestions(fullJobs, options.maxScoreQuestions ?? 64)
        try {
          outcome = await control.score(task, limited, scoreCtx)
          if (outcome.usage) jevUsage = addUsage(jevUsage, { requests: outcome.usage.requests, questions: outcome.usage.questions + outcome.usage.cacheHits, inputTokens: outcome.usage.inputTokens, outputTokens: outcome.usage.outputTokens, mode: control.id === 'hybrid' ? 'hybrid' : 'control', ...rubricStats(control), ...providerStats(control), ...usageStats(outcome.usage) })
          if (outcome.notes?.length) notes.push(...outcome.notes.map(n => control.id + ': ' + n))
        } catch (error) {
          checkUser()
          notes.push('scorer ' + control.id + ' failed, used the rule scorer: ' + (error instanceof Error ? error.message : String(error)))
          outcome = undefined
        }
      } else if (control.id !== 'rule') notes.push('scorer ' + control.id + ' skipped after the deadline, used the rule scorer')
      if (!outcome) { outcome = await (control.id === 'rule' ? control : rule).score(task, fullJobs, scoreCtx); used = 'rule' }
      capDiscussionGrades(ctx.plan.profile, fullJobs, outcome)
```

</details>

**依据 2 · 源码核查**：[src/pipeline/run.ts:620-634](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/pipeline/run.ts#L620-L634)

可回源块与评分归因

<details>
<summary>查看原文（15行）</summary>

```text
  for (const s of selection.selected) {
    const evidenceId = 'e_' + crypto.createHash('sha1').update(resultId + ':' + s.block.url + ':' + s.block.block.blockId + ':' + s.excerpt).digest('hex').slice(0, 10)
    const heading = s.block.block.heading
    const scorer = scorerByBlock.get(s.block.block.blockId + '|' + s.block.url) ?? scorerUsed
    evidence.push({
      evidenceId, blockId: s.block.block.blockId, url: s.block.url,
      ...s.block.title ? { title: s.block.title } : {},
      excerpt: s.excerpt,
      ...heading ? { heading } : {},
      ...s.block.publishedAt ? { publishedAt: s.block.publishedAt } : {},
      needIds: s.needIds, grade: Number(s.grade.toFixed(2)), source: s.block.providers.join('+'),
      ...s.block.lowConfidence ? { lowConfidence: true as const } : {},
      ...s.block.origin,
    })
    evidenceBlocks.push({ evidenceId, url: s.block.url, blockId: s.block.block.blockId, ...heading ? { heading } : {}, text: s.block.block.text, hash: s.block.block.hash, grade: Number(s.grade.toFixed(3)), scorer, ...scorer !== 'rule' && scorer !== 'none' && control.rubricRef ? { rubric: control.rubricRef.key } : {}, ...scorer !== 'rule' && scorer !== 'none' && judgeKey(control) ? { judge: judgeKey(control)! } : {} })
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:1-14](https://github.com/anweat/dsh-web-search-pro/blob/8b6e5c602739a5624bd1e5d9d7fc7b65101d5d44/src/tools.ts#L1-L14)

两种工具曝光对照

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Model-facing tool surfaces for web-search-pro.
 *
 * Every capability is an action in the registry (`src/actions/`). This module
 * only projects that registry into tools:
 *
 * - `indexed` (default): two small tools, `web_index` for progressive
 *   disclosure and `web_call` to run an action. Constant, tiny context cost.
 * - `flat`: one tool per action, named `web_<group>_<action>`. Every action
 *   is described up front; for comparison and debugging only.
 *
 * Both surfaces dispatch through the same {@link runAction}, so validation,
 * the result envelope and the error codes are identical.
 * @module web-search-pro/tools
```

</details>

#### 缺口

- 未执行搜索和模型对照。
  **影响**：不能确认作者上下文节省主张或排名质量。
  **进一步探讨**：保留页面快照、期望需求覆盖及完整用量账。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
