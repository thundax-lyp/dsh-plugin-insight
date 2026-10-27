# dsh-context

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d957dd5](https://github.com/bowenliang123/dsh-context/tree/d957dd56045958e7c72c214d9e94450f19f5fcf8)

<!-- BEGIN META -->
[![GitHub ★ 3,566](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C566&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bowenliang123/dsh-context) [![npm 30d 145,261](https://img.shields.io/static/v1?label=npm+30d&message=145%2C261&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context)
<!-- END META -->

> **功能**：展示DSH上下文组成、请求趋势、事件与会话网络，提供诊断视图和提示前后缀配置。

> **亮点**：[Q03](#research-q03)识别出从总量环到逐请求来源定位的可观察性贡献，头/明细分离把重集合按需读取。相对手查日志改善定位组织，不把宿主投影或估算规则当原创，也不宣称自动提高模型效果。

> **主要限制**：[Q04](#research-q04)说明密度估算、有界保留与冷读跳过会收窄“完整”含义，全局prompt设置又可改变被观察对象；诊断试用应先保持空前后缀并明确数据来源。

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
  - [Q01 · 上下文诊断具体帮助谁做哪类排查，什么不算效果？](#detail-section-11)
  - [Q02 · host投影、轻头部和按需明细如何实现？](#detail-section-12)
  - [Q03 · 相对宿主token环和手查日志，增量在哪里？](#detail-section-13)
  - [Q04 · 哪些估算、保留和副作用会让“完整上下文”误读？](#detail-section-14)
  - [Q05 · 哪些宿主条件和配置需要先确认？](#detail-section-15)
  - [Q06 · 首次、持续和退出的实际负担如何？](#detail-section-16)
  - [Q07 · 哪些观测设计值得借鉴，移植要付什么？](#detail-section-17)
  - [Q08 · 能否让诊断页同时显示“有多少是未知”？](#detail-section-18)
  - [Q09 · 谁可从哪项诊断开始，何时应回到原始日志？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向长会话、多工具和子Agent较多、需要知道上下文为何膨胀或压缩的DSH开发者。合格结果是能定位某请求的组成、注入、文件/命令活动与相关会话，再决定精简什么；不是图表本身越多越好。简单办法是看宿主token环和原始日志；插件把总量和逐请求来源连起来，但诊断并不自动改善模型回答或降低账单。

增量是把宿主总量投影、逐请求组成与来源回溯组织成同一诊断界面，再用头/明细拆分避免每次广播全部重集合。原生token环已告诉占用，总量不是此插件原创；手查日志可以得到事件但定位负担更高。具体贡献在可观察性和查看工作流，而非新tokenizer或自动上下文压缩；只有排查复杂上下文时才相对简单环图更值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 请求组成 | 定位上下文来源 | 含估算与保留限制 |
| 会话诊断 | 聚合趋势、事件和网络 | 冷读可能压力跳过 |
| 按需明细 | 减少广播重集合 | 依赖宿主投影/revision |
| 提示前后缀 | 配置全局提示段 | 空默认；会改变模型输入 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配宿主及sessionProjections | 必需 | 投影注册 | 挂起或fallback |
| connection/sessions | 明细必需 | live/cold访问 | 视图降级 |
| Node范围与客户端API | 必需 | Host与UI | 需按兼容矩阵核对 |
| systemPrompt | 修改提示必需 | 前后缀 | 特征检测后no-op |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 核对版本并加载 | 非fallback且入口出现 |
| 2 | 保持空prompt核对已知请求 | 来源与日志可对应 |
| 3 | 需要时读跨会话明细 | 缺数据回原始日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主与本地资源 | 版本/空prompt核对 | 时间未知 |
| 持续 | 投影及整日志冷读 | 解释估算和裁剪 | 峰值内存未测 |
| 失败恢复 | 保留宿主日志 | 区分无数据与无事件 | 原日志可接管 |
| 退出 | 诊断视图停止 | 清空改过的prompt | 不自动回滚历史模型行为 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 来源定位 | 投影和按需明细存在 | 排查正确率/净节时 |
| 资源约束 | 窗口、队列和堆门槛 | 超长会话峰值 |
| token/费用 | 有估算及provider指标 | 全部分类不等于精确账单 |

> **思考**：[Q04](#research-q04)说明密度估算、有界保留与冷读跳过会收窄“完整”含义，全局prompt设置又可改变被观察对象；诊断试用应先保持空前后缀并明确数据来源。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03)识别出从总量环到逐请求来源定位的可观察性贡献，头/明细分离把重集合按需读取。相对手查日志改善定位组织，不把宿主投影或估算规则当原创，也不宣称自动提高模型效果。

轻头部/按需明细、缓存绑定持久revision、单主机冷读取队列是可借鉴的重状态观测设计。请求错误返回typed failure，不把缺数据伪装为空历史；缓存随config remount重建，避免不同bounds混用。移植需要目标宿主提供投影、不可变revision和准入服务，估算规则还要与上游口径同步，不能复制UI就保持一致。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04)说明密度估算、有界保留与冷读跳过会收窄“完整”含义，全局prompt设置又可改变被观察对象；诊断试用应先保持空前后缀并明确数据来源。

<a id="detail-section-6"></a>

### 1.5 使用建议

需要排查上下文膨胀的DSH用户，可在匹配宿主上保持prompt前后缀为空，从一个已知请求核对token环、Context Browser与原始日志。只有能回指具体来源才扩大到跨会话统计；遇版本fallback、压力无数据、历史裁剪或估算与账单不符，应停止把图表当完整审计，改看宿主日志/供应商usage。若不需细粒度来源，原生token环足够，无须增加观测层。 依据 [Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前贡献由固定源码支持并含解释判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/host/index.ts、src/host/detail.ts、src/host/coldRead.ts、src/host/pricing.ts、src/host/config.ts、src/host/promptInjection.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定提交源码、README、配置与相关测试定义；未安装或执行目标代码，未进行真实宿主验收。
- 下一步：未验证假设是每个诊断视图显示来源覆盖条，区分provider精确、密度估算、保留裁剪和压力跳过。由估算与冷读无数据同时存在推得，这可能比更细图表更能避免误判。用同一批含超长、中文、压缩和压力跳过的会话，对照普通图和覆盖条，测用户是否正确识别数据不足与来源，若正确率不提高或提示负担过重则否定。

**分析版本**

- **仓库**：[bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context)
- **版本号**：0.77.0（[固定提交 d957dd5](https://github.com/bowenliang123/dsh-context/tree/d957dd56045958e7c72c214d9e94450f19f5fcf8)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08)提出未验证的来源覆盖条，把精确值、估算、裁剪与跳过分开，按用户识别缺数据正确率和提示负担检验，不能将该假设计为本版能力。

未验证假设是每个诊断视图显示来源覆盖条，区分provider精确、密度估算、保留裁剪和压力跳过。由估算与冷读无数据同时存在推得，这可能比更细图表更能避免误判。用同一批含超长、中文、压缩和压力跳过的会话，对照普通图和覆盖条，测用户是否正确识别数据不足与来源，若正确率不提高或提示负担过重则否定。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 811 | — | — | 13661 |
| .ts | source | 104 | 16577 | 13830 | 1545 | — |
| .tsx | source | 56 | 13048 | 11474 | 949 | — |
| .ts | test | 196 | 43905 | 39373 | 1279 | — |
| .js | example | 3 | 15 | 9 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 69](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=69&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+created%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z) [![近30天关闭 71](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=71&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本判断dsh-context的贡献、关键质疑与可控采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 上下文诊断具体帮助谁做哪类排查，什么不算效果？

**研究主题**：场景与需求

#### 完整回答

面向长会话、多工具和子Agent较多、需要知道上下文为何膨胀或压缩的DSH开发者。合格结果是能定位某请求的组成、注入、文件/命令活动与相关会话，再决定精简什么；不是图表本身越多越好。简单办法是看宿主token环和原始日志；插件把总量和逐请求来源连起来，但诊断并不自动改善模型回答或降低账单。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-94](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/README.md#L48-L94)

不同诊断视图及宿主token投影声明

<details>
<summary>查看原文（47行）</summary>

```text
Five surfaces, one story — what your agent is carrying, how it got there, and what it did with it:

| Where | What you get |
| --- | --- |
| **Context Insights page** | Every session at a glance: usage, cost, cache hit, daily activity, and per-session context profiles — filtered by range, day, group, or search, one click to jump in. |
| **Context tab** | The full dashboard: stats, composition, per-request trend, events, file activity, and command executions — in every session. |
| **Fleet tab** | The agent network: the current agent, its parents, and every subagent, live. |
| **`/context` command** | A centered modal with the same composition and context browser, without leaving the chat. |
| **Preferences card** | Per-user defaults: the panel entry, Insights range, trend and sort defaults, and the system prompt prefix/suffix joined around every session. |

## 🗂️ The Context Insights page

Click **Context Insights / 上下文洞察** in the sidebar's panel list — the same row level as **Plugins** and **Automation tasks** — and the page opens as a full center-column panel:

![The Context Insights page](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-dashboard.png)

| Section | The question it answers |
| --- | --- |
| **KPI band** | How much am I using — sessions active in the picked range (7d / 30d / all), with billed tokens, estimated cost, cache-hit rate and turns folded by the day each step started; tool runs and active time cover those sessions and their subagents' whole lifetime, matching the timing card. |
| **7-day usage chart** | When did I spend what — each of the last 7 days' billed tokens and estimated cost as a bar pair, folded per turn off the sessions' own request times (not the session's last-active day). |
| **Activity heatmap** | When do I actually work — the last 8 weeks of daily billed tokens; click a day to filter the sessions that were active on it. |
| **Settings entry** | One row under the heatmap — the same guarded jump to this plugin's preferences as the Context tab's Plugin Info card. |
| **Context Composition** | Where the picked range's billed tokens went, split by the Context tab's composition categories. |
| **Session cards** | Each session's profile: composition ring, billed tokens, turns, cost, and its workspace-group / project breadcrumb — sorted by recency, tokens, or context size, searchable, grouped by workspace. A card click opens the session. |


## 📊 The Context tab

Open any session and click the **Context / 上下文** tab:

![Context panel overview](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-overview.png)

| Card | The question it answers |
| --- | --- |
| **Context Stats** | Turns, steps, human inputs, live tool calls — plus a cost estimated from the models.dev list prices (hover the `?` for per-1M rates; only DeepSeek splits peak/off-peak: its listed rates are the off-peak tier, and peak windows bill at 2×). |
| **Token Stats** | Where the billed tokens went — the same total as the chat stats line under the composer, split by composition (system, tools, messages…) with the provider-exact output closing the ring, and the session's cache-hit rate in the corner. |
| **Timing Stats** | How active time split across model calls, tool runs, and overhead. |
| **Current Context** | What's in the window *right now*. |
| **Context Trend** | Every request's size — and its story. |
| **Context Browser** | What any request was *actually* assembled from. |
| **Context Events** | When and why the window changed. |
| **File Activity** | What the agent *did* to your files. |
| **Command Executions** | What the agent ran, how each run ended, and which programs it leaned on. |

The cost estimate follows one documented rule set: [How model pricing is mapped](docs/model-pricing-mapping.md).

The headline occupancy and composition read the **same official token-meter projections as the chat composer's context ring** (`contextPressure` / `contextBreakdown`), so the figures always match what the ring tells you — the card's percentage is that same occupancy, printed with one decimal.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · host投影、轻头部和按需明细如何实现？

**研究主题**：功能与机制

#### 完整回答

Host必须等待sessionProjections，注册timeline、headers、activity；detail channel可用时wire只发轻头部。明细请求先取live registry当前状态，冷会话从不可变日志重折叠，缓存键包含后端身份与revision；主机级FIFO cold-read gate限制同时全日志读取，堆使用超过2/3返回无数据。它减少传输/冷读并发，不代表永不占用大内存。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:26-58](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/index.ts#L26-L58)

baseline与投影注册

<details>
<summary>查看原文（33行）</summary>

```text
export const inject = ['sessionProjections']

/** Re-exported as both value (the cordis validator) and type (the resolved config shape). */
export { Config } from './config'
export function apply(ctx: Context, config: Config): void {
  // One host-wide cold-read gate: every on-demand log read shares one FIFO admission. Routes MUST arm before the baseline gate's early
  // return below — they work on either side of it.
  const coldReads = makeColdReadGate()
  watchBalanceChannel(ctx)
  watchSkillCatalog(ctx)
  watchFleetChannel(ctx, coldReads)
  watchAttachmentChannel(ctx, coldReads)
  // Below the baseline: fallback units serve zeroed data plus the gate record, never the real folds; an undetectable version fails open
  // into the normal composition below (docs/compatibility.md §2).
  const harnessVersion = detectHarnessVersion(ctx)
  if (harnessVersion !== undefined && !meetsBaseline(harnessVersion)) {
    // register() constrains state to the declared SessionProjectionStateMap entry; the gate's opaque empty state is deliberately neither
    // (nothing is folded) — cast through.
    ctx.sessionProjections.register(createFallbackTimelineDefinition(harnessVersion) as never)
    ctx.sessionProjections.register(createFallbackHeadersDefinition() as never)
    ctx.sessionProjections.register(createFallbackActivityDefinition() as never)
    return
  }
  // Additive over toolSources.ts's static chain; an unsupported cordis or a missed read degrades to it.
  const attribution = createToolAttribution(ctx)
  watchStepIdentity(ctx)
  // The unit's view reads the gate per serve: slim wire while the detail channel is live, inline otherwise.
  const gate = watchDetailChannel(ctx, resolveBounds(config), coldReads)
  ctx.sessionProjections.register(createContextTimelineDefinition(config, () => gate.live))
  ctx.sessionProjections.register(createContextHeadersDefinition(name => attribution.ownerOf(name)))
  ctx.sessionProjections.register(createContextActivityDefinition())
  watchActivityBackfill(ctx, coldReads)
  watchPromptInjection(ctx, config)
```

</details>

**依据 2 · 源码核查**：[src/host/detail.ts:20-35](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/detail.ts#L20-L35)

冷缓存信任元组

<details>
<summary>查看原文（16行）</summary>

```text
/** Cold payload cache: one payload is bounded by the fold bounds (≲1MB), and the durable revision in the key makes a stale serve
 * structurally impossible, so a page reload re-serves instead of refolding the whole log. */
const PAYLOAD_CACHE_MAX = 4

/** One cached cold payload: the same `(identity, id, revision)` trust tuple dsh's own observation reader keys its cache on, so a swapped
 * backend can never alias a stale serve. */
interface ColdPayload {
  persistence: unknown
  revision: string
  value: ContextTimelineDetail
}

/** The durable change token; absent on a live observation, a moving target that must never key the cache. */
function revisionOf(observation: unknown): string | undefined {
  const revision = (observation as { revision?: unknown } | null)?.revision
  return typeof revision === 'string' && revision !== '' ? revision : undefined
```

</details>

**依据 3 · 源码核查**：[src/host/detail.ts:68-103](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/detail.ts#L68-L103)

live明细不二次fold

<details>
<summary>查看原文（36行）</summary>

```text
/** Either service unloading withdraws the route and closes the gate. */
export function watchDetailChannel(ctx: Context, bounds: FoldBounds, coldReads: ColdReadGate = makeColdReadGate()): DetailChannelGate {
  const gate = { live: false }
  // The cold payload cache lives in this closure: a config remount re-runs the watch, so a bounds change never serves a payload folded
  // under different bounds.
  const payloads = new Map<string, ColdPayload>()
  ctx.inject(['connection', 'sessions'], (c) => {
    const sessions = c.get('sessions') as SessionsHostFace | undefined
    const getSession = typeof sessions?.get === 'function' ? sessions.get.bind(sessions) : undefined
    if (getSession === undefined) return
    const projections = ctx.sessionProjections

    const handler = async (request: Request): Promise<Response> => {
      let sessionId: unknown
      let headOnly = false
      try {
        const body: unknown = await request.json()
        sessionId = body !== null && typeof body === 'object'
          ? (body as { sessionId?: unknown }).sessionId
          : undefined
        headOnly = body !== null && typeof body === 'object' && (body as { head?: unknown }).head === true
      } catch {
        return failure('dsh-context/bad-request', 'body is not JSON')
      }
      if (typeof sessionId !== 'string' || sessionId === '') {
        return failure('dsh-context/bad-request', 'missing sessionId')
      }
      try {
        const session = getSession(sessionId)
        if (session !== undefined && session !== null) {
          // Live session: the registry's current fold state — no second fold, and it is never mutated.
          const state = projections.stateOf(session as never, 'contextTimeline')
          if (state === undefined) return reply({ ok: true, value: null })
          // A head read (the agent cards) serves the envelope scalars only: the collections are ~200× the bytes and
          // the reader discards them.
          return reply({ ok: true, value: headOnly ? headPayloadOf(state) : buildTimelineDetail(state, bounds) })
```

</details>

**依据 4 · 源码核查**：[src/host/coldRead.ts:28-45](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/coldRead.ts#L28-L45)

FIFO及压力跳过

<details>
<summary>查看原文（18行）</summary>

```text
export function makeColdReadGate(reading: () => HeapReading = v8Reading): ColdReadGate {
  const clear = (): boolean => {
    try {
      const { used, limit } = reading()
      if (!Number.isFinite(used) || !Number.isFinite(limit) || limit <= 0) return true
      return used < limit * HIGH_WATER
    } catch {
      return true
    }
  }
  let tail: Promise<unknown> = Promise.resolve()
  return {
    admit<T>(read: () => Promise<T>): Promise<T | undefined> {
      // The headroom check runs at the front of the queue, not at queue time — pressure changes while waiting.
      const run = tail.then(() => (clear() ? read() : undefined))
      tail = run.then(noop, noop)
      return run
    },
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主token环和手查日志，增量在哪里？

**研究主题**：贡献与相对优势

#### 完整回答

增量是把宿主总量投影、逐请求组成与来源回溯组织成同一诊断界面，再用头/明细拆分避免每次广播全部重集合。原生token环已告诉占用，总量不是此插件原创；手查日志可以得到事件但定位负担更高。具体贡献在可观察性和查看工作流，而非新tokenizer或自动上下文压缩；只有排查复杂上下文时才相对简单环图更值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:82-94](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/README.md#L82-L94)

与原生投影相同并扩展浏览

<details>
<summary>查看原文（13行）</summary>

```text
| **Context Stats** | Turns, steps, human inputs, live tool calls — plus a cost estimated from the models.dev list prices (hover the `?` for per-1M rates; only DeepSeek splits peak/off-peak: its listed rates are the off-peak tier, and peak windows bill at 2×). |
| **Token Stats** | Where the billed tokens went — the same total as the chat stats line under the composer, split by composition (system, tools, messages…) with the provider-exact output closing the ring, and the session's cache-hit rate in the corner. |
| **Timing Stats** | How active time split across model calls, tool runs, and overhead. |
| **Current Context** | What's in the window *right now*. |
| **Context Trend** | Every request's size — and its story. |
| **Context Browser** | What any request was *actually* assembled from. |
| **Context Events** | When and why the window changed. |
| **File Activity** | What the agent *did* to your files. |
| **Command Executions** | What the agent ran, how each run ended, and which programs it leaned on. |

The cost estimate follows one documented rule set: [How model pricing is mapped](docs/model-pricing-mapping.md).

The headline occupancy and composition read the **same official token-meter projections as the chat composer's context ring** (`contextPressure` / `contextBreakdown`), so the figures always match what the ring tells you — the card's percentage is that same occupancy, printed with one decimal.
```

</details>

**依据 2 · 作者声明**：[README.md:129-149](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/README.md#L129-L149)

来源、内容与历史重建边界

<details>
<summary>查看原文（21行）</summary>

```text
### 🧭 Context Browser — open the box of any request

Pick **Live (next request)** or any retained step, and browse what that request was assembled from: seven collapsible categories expand into one row per element with its token price, and every element expands again into its **actual content** — the system prompt, each tool's JSON schema, message text, reasoning, tool arguments, and tool outputs. Skill content (the available-skills catalog, `/skill` invocations, and `skill`-tool loads) has its own **Skill Injections** category, so a stealthy skill's context footprint can't hide inside the injected-context and tool-result buckets.

- **Who provides each tool** — every tool-schema row carries a best-effort source chip: `tool-*` first-party packages, `dsh-*` capability packages, `mcp:<server>` proxies, or the exact plugin watched live from `tools.register()`. Sort by **size / name**, and filter every category by its own searchable fields:

![Tool schemas with source chips, filter, and sort](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-browser-tools.png)

- **Filter assistant replies by kind** — the assistant category's search box carries **Thinking / Tools / Answer** chips, each counting the replies of that kind in the current search results (one reply can carry several); click one to keep only the matching replies, click again to clear:

![Assistant replies with kind filter chips](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-browser-assistant-kinds.png)

- **Tool results open into the full call** — the tool name and arguments with its **OK/error** status, the result body with line count and a **Raw / Markdown** toggle:

![A tool result expanded with Raw/Markdown toggle](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-browser-tool-result.png)

- **Attachments render as ordered cards** — a message's `image` and `file` blocks sit together in the order the message carries them, one card each: images with a thumbnail plus their dimensions, stored size, and the official DeepSeek image-token estimate; other files with their type glyph, extension, and stored size. One click opens the attachment in dsh's own preview column (markdown, code, PDF, office, and image viewers), under the file's real name:

![Image attachment cards with their dimensions, stored size, and token estimate](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/context-browser-images.png)

- **Diff against the previous turn** — signed delta badges per category (`+N` items, `±Nk` tokens) tell you what a turn added or reclaimed at one glance. Steps older than a compaction are reconstructed from the removed-message archive — and the card says so when a step's makeup is only approximate.
```

</details>

**依据 3 · 源码核查**：[src/host/detail.ts:95-103](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/detail.ts#L95-L103)

live按需明细实现

```text
      try {
        const session = getSession(sessionId)
        if (session !== undefined && session !== null) {
          // Live session: the registry's current fold state — no second fold, and it is never mutated.
          const state = projections.stateOf(session as never, 'contextTimeline')
          if (state === undefined) return reply({ ok: true, value: null })
          // A head read (the agent cards) serves the envelope scalars only: the collections are ~200× the bytes and
          // the reader discards them.
          return reply({ ok: true, value: headOnly ? headPayloadOf(state) : buildTimelineDetail(state, bounds) })
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些估算、保留和副作用会让“完整上下文”误读？

**研究主题**：缺陷与关键质疑

#### 完整回答

组成token按4字符约1token的密度估算，工具和图像又有各自规则，不能与供应商精确计费混为一谈。maxRequestSteps/turns/events等会裁剪保留范围，冷读压力可返回无数据，因此缺记录不等于从未发生。插件还允许全局prompt prefix/suffix，并在下一模型步生效，诊断工具也可改变系统提示；空白默认关闭而非自动有文本。未知宿主版本的baseline检测fail-open，不能视为兼容已证。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/pricing.ts:1-15](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/pricing.ts#L1-L15)

固定密度与图像差异

<details>
<summary>查看原文（15行）</summary>

```text
/** Token pricing: the harness token-meter's fixed-density heuristic (`dsh-token-meter/estimate.ts`) — 4 chars ≈ 1
 * token, +4 per content block, +4 role framing. One divergence: `image` blocks price by pixel dimensions through the
 * vision docs calculator (shared/imageTokens.ts), falling back to the meter's JSON price. */

import { estimateTextTokens } from '../shared/estimate'
import { estimateImageTokens } from '../shared/imageTokens'

const CHARS_PER_TOKEN = 4
const BLOCK_OVERHEAD = 4
const ROLE_OVERHEAD = 4

export function estimateToolsTotal(tools: unknown[]): number {
  return tools.length > 0
    ? Math.ceil(JSON.stringify(tools).length / CHARS_PER_TOKEN) + BLOCK_OVERHEAD
    : 0
```

</details>

**依据 2 · 源码核查**：[src/host/config.ts:10-22](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/config.ts#L10-L22)

有界历史

<details>
<summary>查看原文（13行）</summary>

```text
export const DEFAULT_BOUNDS = {
  maxRequestSteps: 1500,
  /** Newest whole-turn window kept; trimming crosses whole turns, never mid-turn. */
  maxKeptTurns: 300,
  maxEvents: 400,
  /** Pathological-session backstop only: each push ships the whole value (~150B/node). */
  maxNodes: 2000,
  maxArchiveNodes: 400,
  maxFileOps: 400,
  maxCommands: 400,
  /** The command text caps per record; the card offers the full text through the browser's message body. */
  maxCommandChars: 4096,
}
```

</details>

**依据 3 · 源码核查**：[src/host/promptInjection.ts:45-65](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/promptInjection.ts#L45-L65)

全局prompt前后缀实际注册

<details>
<summary>查看原文（21行）</summary>

```text
export function watchPromptInjection(ctx: Context, config: Config): void {
  // Fires wherever the prompt registry exists, before or after this entry mounts; without it the entry is a no-op.
  ctx.inject(['systemPrompt'] as never, (inner: Context) => {
    const systemPrompt = (inner as { systemPrompt?: SystemPromptFace | null }).systemPrompt
    if (systemPrompt === null || systemPrompt === undefined
      || typeof systemPrompt.section !== 'function'
      || typeof systemPrompt.getSectionOrder !== 'function') return
    systemPrompt.section({
      name: 'dsh-context:prompt-prefix',
      // Ahead of every allocated slot, anchored through the harness's own order registry so a central renumbering keeps the prefix first.
      order: systemPrompt.getSectionOrder('HARNESS_IDENTITY') - ORDER_CLEARANCE,
      text: sectionText(liveText(config.promptPrefix)),
      // Literal text: a user's `{{...}}` must never reach the strict variable interpolation.
      interpolate: false,
    })
    systemPrompt.section({
      name: 'dsh-context:prompt-suffix',
      order: systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_SUFFIX') + ORDER_CLEARANCE,
      text: sectionText(liveText(config.promptSuffix)),
      interpolate: false,
    })
```

</details>

**依据 4 · 源码核查**：[src/host/index.ts:38-47](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/index.ts#L38-L47)

版本未知正常路径

<details>
<summary>查看原文（10行）</summary>

```text
  // Below the baseline: fallback units serve zeroed data plus the gate record, never the real folds; an undetectable version fails open
  // into the normal composition below (docs/compatibility.md §2).
  const harnessVersion = detectHarnessVersion(ctx)
  if (harnessVersion !== undefined && !meetsBaseline(harnessVersion)) {
    // register() constrains state to the declared SessionProjectionStateMap entry; the gate's opaque empty state is deliberately neither
    // (nothing is folded) — cast through.
    ctx.sessionProjections.register(createFallbackTimelineDefinition(harnessVersion) as never)
    ctx.sessionProjections.register(createFallbackHeadersDefinition() as never)
    ctx.sessionProjections.register(createFallbackActivityDefinition() as never)
    return
```

</details>

#### 缺口

- 各语言/模型的组成估算误差与裁剪后诊断失真未知
  **影响**：不能将全部分类数字解释为精确账单或完整历史
  **进一步探讨**：对照固定请求的供应商usage与保留前后日志，分离估算、账款和丢弃范围

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些宿主条件和配置需要先确认？

**研究主题**：依赖、兼容与流程

#### 完整回答

需Node声明范围、sessionProjections以及匹配宿主API；包明确列兼容发行0.2.0-rc.2和0.2.1-rc.2，通用engines范围不应替代矩阵。detail还需connection和sessions，缺服务时回退机制不同；prompt注入只有systemPrompt具section/getSectionOrder才生效。用户应先保留空前后缀，仅做诊断，避免把排查配置混为行为修改。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:15-18](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/package.json#L15-L18)

runtime范围

```text
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.2 || >=0.2.1-rc.2"
```

**依据 2 · 源码核查**：[package.json:56-75](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/package.json#L56-L75)

客户端依赖与兼容矩阵

<details>
<summary>查看原文（20行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar-right"
      ],
      "platform": "web"
    },
    "compatibility": {
      "dshReleases": {
        "0.2.0-rc.2": "compatible",
        "0.2.1-rc.2": "compatible"
      }
```

</details>

**依据 3 · 源码核查**：[src/host/index.ts:26-58](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/index.ts#L26-L58)

必须及可选服务

<details>
<summary>查看原文（33行）</summary>

```text
export const inject = ['sessionProjections']

/** Re-exported as both value (the cordis validator) and type (the resolved config shape). */
export { Config } from './config'
export function apply(ctx: Context, config: Config): void {
  // One host-wide cold-read gate: every on-demand log read shares one FIFO admission. Routes MUST arm before the baseline gate's early
  // return below — they work on either side of it.
  const coldReads = makeColdReadGate()
  watchBalanceChannel(ctx)
  watchSkillCatalog(ctx)
  watchFleetChannel(ctx, coldReads)
  watchAttachmentChannel(ctx, coldReads)
  // Below the baseline: fallback units serve zeroed data plus the gate record, never the real folds; an undetectable version fails open
  // into the normal composition below (docs/compatibility.md §2).
  const harnessVersion = detectHarnessVersion(ctx)
  if (harnessVersion !== undefined && !meetsBaseline(harnessVersion)) {
    // register() constrains state to the declared SessionProjectionStateMap entry; the gate's opaque empty state is deliberately neither
    // (nothing is folded) — cast through.
    ctx.sessionProjections.register(createFallbackTimelineDefinition(harnessVersion) as never)
    ctx.sessionProjections.register(createFallbackHeadersDefinition() as never)
    ctx.sessionProjections.register(createFallbackActivityDefinition() as never)
    return
  }
  // Additive over toolSources.ts's static chain; an unsupported cordis or a missed read degrades to it.
  const attribution = createToolAttribution(ctx)
  watchStepIdentity(ctx)
  // The unit's view reads the gate per serve: slim wire while the detail channel is live, inline otherwise.
  const gate = watchDetailChannel(ctx, resolveBounds(config), coldReads)
  ctx.sessionProjections.register(createContextTimelineDefinition(config, () => gate.live))
  ctx.sessionProjections.register(createContextHeadersDefinition(name => attribution.ownerOf(name)))
  ctx.sessionProjections.register(createContextActivityDefinition())
  watchActivityBackfill(ctx, coldReads)
  watchPromptInjection(ctx, config)
```

</details>

**依据 4 · 源码核查**：[src/host/promptInjection.ts:45-65](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/promptInjection.ts#L45-L65)

prompt特征检测

<details>
<summary>查看原文（21行）</summary>

```text
export function watchPromptInjection(ctx: Context, config: Config): void {
  // Fires wherever the prompt registry exists, before or after this entry mounts; without it the entry is a no-op.
  ctx.inject(['systemPrompt'] as never, (inner: Context) => {
    const systemPrompt = (inner as { systemPrompt?: SystemPromptFace | null }).systemPrompt
    if (systemPrompt === null || systemPrompt === undefined
      || typeof systemPrompt.section !== 'function'
      || typeof systemPrompt.getSectionOrder !== 'function') return
    systemPrompt.section({
      name: 'dsh-context:prompt-prefix',
      // Ahead of every allocated slot, anchored through the harness's own order registry so a central renumbering keeps the prefix first.
      order: systemPrompt.getSectionOrder('HARNESS_IDENTITY') - ORDER_CLEARANCE,
      text: sectionText(liveText(config.promptPrefix)),
      // Literal text: a user's `{{...}}` must never reach the strict variable interpolation.
      interpolate: false,
    })
    systemPrompt.section({
      name: 'dsh-context:prompt-suffix',
      order: systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_SUFFIX') + ORDER_CLEARANCE,
      text: sectionText(liveText(config.promptSuffix)),
      interpolate: false,
    })
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续和退出的实际负担如何？

**研究主题**：效果与总成本

#### 完整回答

首次只需按匹配宿主安装并核对界面、默认边界及空prompt设置。持续读取已有日志和维护投影，冷读取有FIFO与堆门槛，但每次仍可实体化整份日志；增加保留窗口会换取资源负担。停用诊断不修改项目文件，若设置过全局prompt应恢复空值再退出；日志本身仍由宿主管理。金额、排查耗时和最大会话内存未测，不能称无限历史或零成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/coldRead.ts:1-17](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/coldRead.ts#L1-L17)

冷读取仍实体化整份日志

<details>
<summary>查看原文（17行）</summary>

```text
/** The host-wide cold-read governor: every cold read materializes a whole durable log, so the gate admits one at a time (FIFO) and only
 * below the heap ceiling; a skipped read takes the caller's designed no-data path, never a visible failure. */

import { getHeapStatistics } from 'node:v8'

export interface HeapReading {
  used: number
  limit: number
}

export interface ColdReadGate {
  /** Resolves `undefined` when the read was skipped under pressure — the caller's no-data path answers instead. */
  admit<T>(read: () => Promise<T>): Promise<T | undefined>
}

/** Two-thirds of the process's own V8 ceiling; the top third is headroom for the read and the harness's own logs. */
const HIGH_WATER = 2 / 3
```

</details>

**依据 2 · 源码核查**：[src/host/config.ts:10-22](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/config.ts#L10-L22)

窗口限制

<details>
<summary>查看原文（13行）</summary>

```text
export const DEFAULT_BOUNDS = {
  maxRequestSteps: 1500,
  /** Newest whole-turn window kept; trimming crosses whole turns, never mid-turn. */
  maxKeptTurns: 300,
  maxEvents: 400,
  /** Pathological-session backstop only: each push ships the whole value (~150B/node). */
  maxNodes: 2000,
  maxArchiveNodes: 400,
  maxFileOps: 400,
  maxCommands: 400,
  /** The command text caps per record; the card offers the full text through the browser's message body. */
  maxCommandChars: 4096,
}
```

</details>

**依据 3 · 源码核查**：[src/host/config.ts:61-63](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/config.ts#L61-L63)

前后缀空默认

```text
  // Loose: a stale persisted value (or a non-string) degrades to the empty default instead of failing the entry.
  promptPrefix: volatileField(z.string().default('').loose()),
  promptSuffix: volatileField(z.string().default('').loose()),
```

**依据 4 · 源码核查**：[src/host/promptInjection.ts:45-65](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/promptInjection.ts#L45-L65)

全局设置生效

<details>
<summary>查看原文（21行）</summary>

```text
export function watchPromptInjection(ctx: Context, config: Config): void {
  // Fires wherever the prompt registry exists, before or after this entry mounts; without it the entry is a no-op.
  ctx.inject(['systemPrompt'] as never, (inner: Context) => {
    const systemPrompt = (inner as { systemPrompt?: SystemPromptFace | null }).systemPrompt
    if (systemPrompt === null || systemPrompt === undefined
      || typeof systemPrompt.section !== 'function'
      || typeof systemPrompt.getSectionOrder !== 'function') return
    systemPrompt.section({
      name: 'dsh-context:prompt-prefix',
      // Ahead of every allocated slot, anchored through the harness's own order registry so a central renumbering keeps the prefix first.
      order: systemPrompt.getSectionOrder('HARNESS_IDENTITY') - ORDER_CLEARANCE,
      text: sectionText(liveText(config.promptPrefix)),
      // Literal text: a user's `{{...}}` must never reach the strict variable interpolation.
      interpolate: false,
    })
    systemPrompt.section({
      name: 'dsh-context:prompt-suffix',
      order: systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_SUFFIX') + ORDER_CLEARANCE,
      text: sectionText(liveText(config.promptSuffix)),
      interpolate: false,
    })
```

</details>

#### 缺口

- 目标长会话的冷读峰值内存与人工定位耗时未知
  **影响**：不能证明资源代价与诊断收益相称
  **进一步探讨**：用不同日志规模比较原生环/手查日志和插件定位正确率、内存及时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些观测设计值得借鉴，移植要付什么？

**研究主题**：工程质量与复用

#### 完整回答

轻头部/按需明细、缓存绑定持久revision、单主机冷读取队列是可借鉴的重状态观测设计。请求错误返回typed failure，不把缺数据伪装为空历史；缓存随config remount重建，避免不同bounds混用。移植需要目标宿主提供投影、不可变revision和准入服务，估算规则还要与上游口径同步，不能复制UI就保持一致。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/detail.ts:20-35](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/detail.ts#L20-L35)

缓存身份/revision

<details>
<summary>查看原文（16行）</summary>

```text
/** Cold payload cache: one payload is bounded by the fold bounds (≲1MB), and the durable revision in the key makes a stale serve
 * structurally impossible, so a page reload re-serves instead of refolding the whole log. */
const PAYLOAD_CACHE_MAX = 4

/** One cached cold payload: the same `(identity, id, revision)` trust tuple dsh's own observation reader keys its cache on, so a swapped
 * backend can never alias a stale serve. */
interface ColdPayload {
  persistence: unknown
  revision: string
  value: ContextTimelineDetail
}

/** The durable change token; absent on a live observation, a moving target that must never key the cache. */
function revisionOf(observation: unknown): string | undefined {
  const revision = (observation as { revision?: unknown } | null)?.revision
  return typeof revision === 'string' && revision !== '' ? revision : undefined
```

</details>

**依据 2 · 源码核查**：[src/host/detail.ts:60-103](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/detail.ts#L60-L103)

typed结果与live路径

<details>
<summary>查看原文（44行）</summary>

```text
function reply(value: unknown): Response {
  return Response.json(value, { headers: { 'cache-control': 'no-store' } })
}

function failure(code: string, message: string): Response {
  return reply({ ok: false, error: { code, message } })
}

/** Either service unloading withdraws the route and closes the gate. */
export function watchDetailChannel(ctx: Context, bounds: FoldBounds, coldReads: ColdReadGate = makeColdReadGate()): DetailChannelGate {
  const gate = { live: false }
  // The cold payload cache lives in this closure: a config remount re-runs the watch, so a bounds change never serves a payload folded
  // under different bounds.
  const payloads = new Map<string, ColdPayload>()
  ctx.inject(['connection', 'sessions'], (c) => {
    const sessions = c.get('sessions') as SessionsHostFace | undefined
    const getSession = typeof sessions?.get === 'function' ? sessions.get.bind(sessions) : undefined
    if (getSession === undefined) return
    const projections = ctx.sessionProjections

    const handler = async (request: Request): Promise<Response> => {
      let sessionId: unknown
      let headOnly = false
      try {
        const body: unknown = await request.json()
        sessionId = body !== null && typeof body === 'object'
          ? (body as { sessionId?: unknown }).sessionId
          : undefined
        headOnly = body !== null && typeof body === 'object' && (body as { head?: unknown }).head === true
      } catch {
        return failure('dsh-context/bad-request', 'body is not JSON')
      }
      if (typeof sessionId !== 'string' || sessionId === '') {
        return failure('dsh-context/bad-request', 'missing sessionId')
      }
      try {
        const session = getSession(sessionId)
        if (session !== undefined && session !== null) {
          // Live session: the registry's current fold state — no second fold, and it is never mutated.
          const state = projections.stateOf(session as never, 'contextTimeline')
          if (state === undefined) return reply({ ok: true, value: null })
          // A head read (the agent cards) serves the envelope scalars only: the collections are ~200× the bytes and
          // the reader discards them.
          return reply({ ok: true, value: headOnly ? headPayloadOf(state) : buildTimelineDetail(state, bounds) })
```

</details>

**依据 3 · 源码核查**：[src/host/coldRead.ts:28-45](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/coldRead.ts#L28-L45)

共享队列

<details>
<summary>查看原文（18行）</summary>

```text
export function makeColdReadGate(reading: () => HeapReading = v8Reading): ColdReadGate {
  const clear = (): boolean => {
    try {
      const { used, limit } = reading()
      if (!Number.isFinite(used) || !Number.isFinite(limit) || limit <= 0) return true
      return used < limit * HIGH_WATER
    } catch {
      return true
    }
  }
  let tail: Promise<unknown> = Promise.resolve()
  return {
    admit<T>(read: () => Promise<T>): Promise<T | undefined> {
      // The headroom check runs at the front of the queue, not at queue time — pressure changes while waiting.
      const run = tail.then(() => (clear() ? read() : undefined))
      tail = run.then(noop, noop)
      return run
    },
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否让诊断页同时显示“有多少是未知”？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是每个诊断视图显示来源覆盖条，区分provider精确、密度估算、保留裁剪和压力跳过。由估算与冷读无数据同时存在推得，这可能比更细图表更能避免误判。用同一批含超长、中文、压缩和压力跳过的会话，对照普通图和覆盖条，测用户是否正确识别数据不足与来源，若正确率不提高或提示负担过重则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/pricing.ts:1-15](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/pricing.ts#L1-L15)

估算依据

<details>
<summary>查看原文（15行）</summary>

```text
/** Token pricing: the harness token-meter's fixed-density heuristic (`dsh-token-meter/estimate.ts`) — 4 chars ≈ 1
 * token, +4 per content block, +4 role framing. One divergence: `image` blocks price by pixel dimensions through the
 * vision docs calculator (shared/imageTokens.ts), falling back to the meter's JSON price. */

import { estimateTextTokens } from '../shared/estimate'
import { estimateImageTokens } from '../shared/imageTokens'

const CHARS_PER_TOKEN = 4
const BLOCK_OVERHEAD = 4
const ROLE_OVERHEAD = 4

export function estimateToolsTotal(tools: unknown[]): number {
  return tools.length > 0
    ? Math.ceil(JSON.stringify(tools).length / CHARS_PER_TOKEN) + BLOCK_OVERHEAD
    : 0
```

</details>

**依据 2 · 源码核查**：[src/host/config.ts:10-22](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/config.ts#L10-L22)

历史裁剪边界

<details>
<summary>查看原文（13行）</summary>

```text
export const DEFAULT_BOUNDS = {
  maxRequestSteps: 1500,
  /** Newest whole-turn window kept; trimming crosses whole turns, never mid-turn. */
  maxKeptTurns: 300,
  maxEvents: 400,
  /** Pathological-session backstop only: each push ships the whole value (~150B/node). */
  maxNodes: 2000,
  maxArchiveNodes: 400,
  maxFileOps: 400,
  maxCommands: 400,
  /** The command text caps per record; the card offers the full text through the browser's message body. */
  maxCommandChars: 4096,
}
```

</details>

**依据 3 · 源码核查**：[src/host/coldRead.ts:28-45](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/coldRead.ts#L28-L45)

压力跳过

<details>
<summary>查看原文（18行）</summary>

```text
export function makeColdReadGate(reading: () => HeapReading = v8Reading): ColdReadGate {
  const clear = (): boolean => {
    try {
      const { used, limit } = reading()
      if (!Number.isFinite(used) || !Number.isFinite(limit) || limit <= 0) return true
      return used < limit * HIGH_WATER
    } catch {
      return true
    }
  }
  let tail: Promise<unknown> = Promise.resolve()
  return {
    admit<T>(read: () => Promise<T>): Promise<T | undefined> {
      // The headroom check runs at the front of the queue, not at queue time — pressure changes while waiting.
      const run = tail.then(() => (clear() ? read() : undefined))
      tail = run.then(noop, noop)
      return run
    },
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 谁可从哪项诊断开始，何时应回到原始日志？

**研究主题**：采用判断

#### 完整回答

需要排查上下文膨胀的DSH用户，可在匹配宿主上保持prompt前后缀为空，从一个已知请求核对token环、Context Browser与原始日志。只有能回指具体来源才扩大到跨会话统计；遇版本fallback、压力无数据、历史裁剪或估算与账单不符，应停止把图表当完整审计，改看宿主日志/供应商usage。若不需细粒度来源，原生token环足够，无须增加观测层。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:82-94](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/README.md#L82-L94)

诊断与原生总量基线

<details>
<summary>查看原文（13行）</summary>

```text
| **Context Stats** | Turns, steps, human inputs, live tool calls — plus a cost estimated from the models.dev list prices (hover the `?` for per-1M rates; only DeepSeek splits peak/off-peak: its listed rates are the off-peak tier, and peak windows bill at 2×). |
| **Token Stats** | Where the billed tokens went — the same total as the chat stats line under the composer, split by composition (system, tools, messages…) with the provider-exact output closing the ring, and the session's cache-hit rate in the corner. |
| **Timing Stats** | How active time split across model calls, tool runs, and overhead. |
| **Current Context** | What's in the window *right now*. |
| **Context Trend** | Every request's size — and its story. |
| **Context Browser** | What any request was *actually* assembled from. |
| **Context Events** | When and why the window changed. |
| **File Activity** | What the agent *did* to your files. |
| **Command Executions** | What the agent ran, how each run ended, and which programs it leaned on. |

The cost estimate follows one documented rule set: [How model pricing is mapped](docs/model-pricing-mapping.md).

The headline occupancy and composition read the **same official token-meter projections as the chat composer's context ring** (`contextPressure` / `contextBreakdown`), so the figures always match what the ring tells you — the card's percentage is that same occupancy, printed with one decimal.
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:38-58](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/index.ts#L38-L58)

fallback与服务边界

<details>
<summary>查看原文（21行）</summary>

```text
  // Below the baseline: fallback units serve zeroed data plus the gate record, never the real folds; an undetectable version fails open
  // into the normal composition below (docs/compatibility.md §2).
  const harnessVersion = detectHarnessVersion(ctx)
  if (harnessVersion !== undefined && !meetsBaseline(harnessVersion)) {
    // register() constrains state to the declared SessionProjectionStateMap entry; the gate's opaque empty state is deliberately neither
    // (nothing is folded) — cast through.
    ctx.sessionProjections.register(createFallbackTimelineDefinition(harnessVersion) as never)
    ctx.sessionProjections.register(createFallbackHeadersDefinition() as never)
    ctx.sessionProjections.register(createFallbackActivityDefinition() as never)
    return
  }
  // Additive over toolSources.ts's static chain; an unsupported cordis or a missed read degrades to it.
  const attribution = createToolAttribution(ctx)
  watchStepIdentity(ctx)
  // The unit's view reads the gate per serve: slim wire while the detail channel is live, inline otherwise.
  const gate = watchDetailChannel(ctx, resolveBounds(config), coldReads)
  ctx.sessionProjections.register(createContextTimelineDefinition(config, () => gate.live))
  ctx.sessionProjections.register(createContextHeadersDefinition(name => attribution.ownerOf(name)))
  ctx.sessionProjections.register(createContextActivityDefinition())
  watchActivityBackfill(ctx, coldReads)
  watchPromptInjection(ctx, config)
```

</details>

**依据 3 · 源码核查**：[src/host/coldRead.ts:28-45](https://github.com/bowenliang123/dsh-context/blob/d957dd56045958e7c72c214d9e94450f19f5fcf8/src/host/coldRead.ts#L28-L45)

无数据退路

<details>
<summary>查看原文（18行）</summary>

```text
export function makeColdReadGate(reading: () => HeapReading = v8Reading): ColdReadGate {
  const clear = (): boolean => {
    try {
      const { used, limit } = reading()
      if (!Number.isFinite(used) || !Number.isFinite(limit) || limit <= 0) return true
      return used < limit * HIGH_WATER
    } catch {
      return true
    }
  }
  let tail: Promise<unknown> = Promise.resolve()
  return {
    admit<T>(read: () => Promise<T>): Promise<T | undefined> {
      // The headroom check runs at the front of the queue, not at queue time — pressure changes while waiting.
      const run = tail.then(() => (clear() ? read() : undefined))
      tail = run.then(noop, noop)
      return run
    },
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
