# dsh-context

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[4d8fb8a](https://github.com/bowenliang123/dsh-context/tree/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef)

<!-- BEGIN META -->
[![GitHub ★ 4,948](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C948&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bowenliang123/dsh-context) [![npm 30d 433,565](https://img.shields.io/static/v1?label=npm+30d&message=433%2C565&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context)
<!-- END META -->

> **功能**：为 DSH 会话展示上下文组成、历史趋势和用量，提供 Context 标签及 /context 入口。

> **亮点**：[Q01](#research-q01) 将总体压力与历史来源联系起来。[Q02](#research-q02) 通过活动投影、冷读和按版本缓存提供可回查的明细。

> **主要限制**：[Q02](#research-q02) 的空结果可以来自服务未就绪、兼容降级或冷读限制。[Q03](#research-q03) 的成本是估计，宿主授权和非空提示词配置需分别核对。

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
  - [Q01 · 哪类会话诊断比原生压力提示多获得什么？](#detail-section-11)
  - [Q02 · 历史明细从宿主取得的路径与失败边界是什么？](#detail-section-12)
  - [Q03 · 哪些数据与提示词行为影响试用？](#detail-section-13)
  - [Q04 · 如何验证分项和明细能否更快找到膨胀来源？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向调试长会话的人，把上下文压力与分项、历史步骤放在一个分析视图中。

原生压力提示加手工读日志是可用基线。插件保留宿主计量并增加分项、历史与跳转路径。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话上下文分析 | 核对压力来源与组成 | 沿用宿主标准投影 |
| 按需历史明细 | 回查不活动会话的事件 | 受观察服务、冷读门和权限约束 |
| 提示词首尾 | 按配置加入文字 | 默认空，依赖宿主 systemPrompt |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 宿主 Web 与 sessionProjections | 必需 | 上下文投影和视图 | 旧版本降级，检查实际加载 |
| connection 和 sessions | 明细需要 | 读取活动会话和历史 | 缺失时查原生日志 |
| systemPrompt | 前后缀按需 | 注册可选提示文字 | 诊断试用留空 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选隔离会话并保留空提示词 | 已有事件可对照 |
| 定位 | 用户由压力进入 Context 明细 | 能定位已知事件和步骤 |
| 退出 | 用户停用并查原生会话 | 缺失数据不视为零 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 环境成本未知 | 核宿主版本和权限 | 兼容未运行 |
| 持续 | 历史读取和缓存占用未知 | 检查事件和估算口径 | 账单单独核对 |
| 恢复和退出 | 重读和回归开销未知 | 停用并核对提示词 | 共享部署授权未验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 上下文定位 | 宿主分项和历史明细 | 准确率及节时 |
| 历史请求 | 限量冷读和版本缓存 | 长历史下稳定性 |
| 用量成本 | 目录价估算并保留缺口 | 真实收费 |

> **思考**：[Q02](#research-q02) 的空结果可以来自服务未就绪、兼容降级或冷读限制。[Q03](#research-q03) 的成本是估计，宿主授权和非空提示词配置需分别核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将总体压力与历史来源联系起来。[Q02](#research-q02) 通过活动投影、冷读和按版本缓存提供可回查的明细。

[Q02](#research-q02) 的历史读会复用匹配观察修订的缓存，并在读取结束释放观察。堆阈值拒绝读取不等于资源占用已测试。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的空结果可以来自服务未就绪、兼容降级或冷读限制。[Q03](#research-q03) 的成本是估计，宿主授权和非空提示词配置需分别核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在个人隔离 Web profile 检查一个已知大工具结果，保持提示词首尾为空并确认明细归属。遇到空值、授权疑问或文字变化，停用并用原始日志排查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持分析视图、明细和可选提示词接线。兼容、会话访问隔离及真实效益待验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/sessionData.ts、src/client/index.ts、src/client/command.ts、package.json、src/host/index.ts、src/host/detail.ts、src/host/coldRead.ts、src/host/postRoute.ts、src/host/cost.ts、src/host/config.ts、src/host/promptInjection.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查宿主挂载、会话视图、代表明细通道、估价与提示词入口。未运行宿主、未全面审计共享权限或其他通道。
- 下一步：按 [Q04](#research-q04) 做已知会话对照，再按不同用户身份补查历史和活动会话读取边界。

**分析版本**

- **仓库**：[bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context)
- **版本号**：0.83.1（[固定提交 4d8fb8a](https://github.com/bowenliang123/dsh-context/tree/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提议用已知大工具结果和历史缺失样本比较插件与原生状态。如果归因准确性下降或复核时间更长，就不支持常用。

按 [Q04](#research-q04) 做已知会话对照，再按不同用户身份补查历史和活动会话读取边界。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 2418 | — | — | 43743 |
| .ts | source | 164 | 30422 | 28262 | 133 | — |
| .mjs | source | 4 | 242 | 216 | 0 | — |
| .tsx | source | 61 | 13562 | 12870 | 67 | — |
| .ts | test | 112 | 65051 | 59890 | 246 | — |
| .tsx | test | 1 | 113 | 103 | 0 | — |
| .js | example | 3 | 9 | 9 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 70](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=70&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 70](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=70&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 使用者能否从上下文分项和历史明细定位长会话膨胀，哪些数字、权限和提示词修改须另行核对？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类会话诊断比原生压力提示多获得什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合经常把多个工具调用放进同一长会话的工程师。看到原生上下文压力升高时，用户可以打开 Context 或输入 /context，按分项和历史明细找是哪一步注入或工具结果使窗口变重。Web 侧压力、组成和用量直接取宿主标准投影，额外提供的是分析视图与会话内定位，不应把相同数字算作独立校验。作为替代，可以看原生压力提示后手工翻会话和日志。短会话或无需定位原因时，原生提示通常足够。合格诊断应明确会话和步骤，能回查相关事件，并区分历史请求与当前窗口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-20](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/README.md#L15-L20)

作者描述总览、会话标签和命令。

```text
[`dsh-context`](https://www.npmjs.com/package/dsh-context) 提供完整的上下文生命周期管理功能。
- **上下文洞察页面** — 跨会话总览，作为一级侧边栏面板（与 Plugins 和 Automation tasks 并列）：包含 7 天 Token/成本使用图表的 KPI 栏、活动热力图、汇总组成环形图，以及可筛选并可直接跳转至任一会话的会话卡片。
- **Context 标签页** — DeepSeek Harness 上下文统计、组成、趋势、事件、消息和命令执行的 UI 上下文仪表板。
- **Fleet 标签页** — Agent 家族专属页面：当前 Agent、它的父级，以及每个子 Agent 各自显示为一张实时卡片。
- **Context 面板** — 同一仪表板也可作为右侧边栏标签页：在侧边栏指南页面选择 **Context**，面板便会在聊天旁打开，并包含 Agent 网络。
- **`/context` 命令** — 斜杠命令会显示当前上下文组成模型和近期上下文演变。
```

**依据 2 · 源码核查**：[src/client/sessionData.ts:13-21](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/client/sessionData.ts#L13-L21)

读取官方压力、组成、用量投影。

```text
export function useContextSession(props: SessionStandardProps): ContextSession {
  const source = useTimelineSource(props)
  return {
    source,
    data: source.data,
    pressure: projectionOf(props, 'contextPressure', contextPressureOf),
    breakdown: projectionOf(props, 'contextBreakdown', contextBreakdownOf),
    usage: projectionOf(props, 'tokenUsage', tokenUsageOf),
  }
```

**依据 3 · 源码核查**：[src/client/index.ts:90-125](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/client/index.ts#L90-L125)

注册视图、消息动作、命令和输入框弹层。

<details>
<summary>查看原文（36行）</summary>

```text
  const ContextView = makeContextView(ctx, kit, settings, heads)
  const FleetView = makeFleetView(ctx, kit, heads)

  ctx.effect(() => watchPlacement(settings, {
    tab: () => ctx.slots.inject('conversation.view', () => ctx.slots.register(
      { name: 'conversation.view', id: CONTEXT_VIEW_ID, order: 20, locale: NS, label: () => t('tab.context') },
      props => h(ContextView, props),
    )),
    sidebar: () => watchSidebarContextTab(ctx, ContextView, t, NS),
  }), 'dsh-context: placement')

  ctx.effect(() => watchFleetTab(
    ctx,
    settings,
    props => h(FleetView, props as unknown as Parameters<typeof FleetView>[0]),
    t,
    NS,
  ), 'dsh-context: fleet tab')

  const ContextJump = makeContextJumpButton(ctx, kit, settings)
  ctx.slots.inject(JUMP_SLOT, () => {
    return ctx.slots.register(
      { name: JUMP_SLOT, id: JUMP_ID, order: 20, locale: NS },
      props => h(ContextJump, props),
    )
  })

  registerContextCommand(ctx, kit)
  const ContextModal = makeContextModal(ctx, kit, settings)
  ctx.slots.inject('conversation.input.overlay', () => {
    return ctx.slots.register(
      { name: 'conversation.input.overlay',
        id: 'context-modal',
        order: 10,
        locale: NS,
        inject: (sessionId = '') => ({ hooks: { contextModal: modalStoreOf(sessionId) }, warm: true }) },
```

</details>

**依据 4 · 源码核查**：[src/client/command.ts:29-40](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/client/command.ts#L29-L40)

命令消费输入、打开当前会话弹层。

<details>
<summary>查看原文（12行）</summary>

```text
      onPick: (pick) => {
        setPendingConsume(pick.session.sessionId, { kind: 'span', span: pick.span })
        modalStoreOf(pick.session.sessionId).set(true)
        return 'handled'
      },
      matchEnter: (session, line) => {
        if (line !== LINE) return Promise.resolve(undefined)
        setPendingConsume(session.sessionId, { kind: 'bare-token', token: LINE })
        modalStoreOf(session.sessionId).set(true)
        return Promise.resolve<'handled'>('handled')
      },
    }), 'dsh-context: /context command')
```

</details>

#### 缺口

- 诊断准确率和人工用时未比较。
  **影响**：不能证明更容易定位膨胀来源。
  **进一步探讨**：用已知哪一步造成大结果的会话比较两个流程。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 历史明细从宿主取得的路径与失败边界是什么？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

宿主由 bundle 挂载并要求 sessionProjections。发现已知宿主版本低于插件基线时注册降级 timeline、headers 与 activity 并提前退出。正常分支注册这三类投影和明细通道，Web 界面负责选择展示位置。明细 POST 需要 connection 与 sessions。会话仍活动时读取现有投影或明细镜像；离线会话走观察服务取得事件后折叠。冷读经过串行门，V8 堆占用达到阈值时跳过。缓存只有会话身份、观察版本及持久化服务匹配时才使用，观察租约在 finally 释放。无观察服务、投影未就绪或准入受阻都可能表现为返回空值，不能把空面板解读为会话没有上下文。堆阈值和条目上限用于控制工作范围，缺少在长历史与并发下的实际资源数字。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:56-70](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/package.json#L56-L70)

宿主补丁和浏览器依赖。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:35-77](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/host/index.ts#L35-L77)

启动、降级、注册投影与通道。

<details>
<summary>查看原文（43行）</summary>

```text
export const name = 'dsh-context'

export const inject = ['sessionProjections']

export { Config } from './config'
export function apply(ctx: Context, config: Config): void {
  const coldReads = makeColdReadGate()
  const catalog = createCatalogService()
  const pricing = createCostSource(catalog)
  const harnessVersion = detectHarnessVersion(ctx)
  ctx.effect(() => () => { catalog.dispose() }, 'dsh-context: catalog cache')
  watchVersionChannel(ctx, catalog)
  watchBalanceChannel(ctx, harnessVersion ?? '0.0.0')
  watchRecomChannel(ctx)
  watchSkillCatalog(ctx)
  watchFleetChannel(ctx, coldReads)
  watchAttachmentChannel(ctx, coldReads)
  if (harnessVersion !== undefined && !meetsBaseline(harnessVersion)) {
    ctx.sessionProjections.register(createFallbackTimelineDefinition(harnessVersion) as never)
    ctx.sessionProjections.register(createFallbackHeadersDefinition() as never)
    ctx.sessionProjections.register(createFallbackActivityDefinition() as never)
    return
  }
  const attribution = createToolAttribution(ctx, harnessVersion)
  watchStepIdentity(ctx)
  const gate = createDetailGate(ctx)
  const bounds = resolveBounds(config)
  const shadow = new DetailShadow(ctx, bounds, coldReads, () => observeOf(ctx))
  watchDetailChannel(ctx, bounds, coldReads, gate, shadow, pricing)
  const deltaGate: DetailChannelGate = { ...gate, live: false }
  watchDeltaChannel(ctx, bounds, coldReads, deltaGate, shadow, attribution.ownerOf.bind(attribution))
  watchFactsChannel(ctx, bounds, { gates: gate, coldReads, detailState: id => shadow.stateOf(id), cost: pricing })
  watchCommandPageChannel(ctx, resolveBounds(config), coldReads)
  watchHeadsChannel(ctx, { bounds, coldReads, cost: pricing })
  gate.retain('contextTimeline', ctx.sessionProjections.register(createContextTimelineDefinition(config, () => gate.live, pricing)))
  ctx.sessionProjections.register(createContextHeadersDefinition(name => attribution.ownerOf(name)))
  ctx.sessionProjections.register(createContextActivityDefinition())
  watchTimelineRowSweep(ctx)
  const cache = createOverviewCache()
  const backfill = watchActivityBackfill(ctx, coldReads, undefined, { ownCache: cache, config })
  watchSnapshotRoute(ctx, backfill)
  watchOverviewRoute(ctx, pricing, backfill, { cache })
  watchPromptInjection(ctx, config)
```

</details>

**依据 3 · 源码核查**：[src/host/detail.ts:81-115](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/host/detail.ts#L81-L115)

明细路由、参数检查和活动会话分支。

<details>
<summary>查看原文（35行）</summary>

```text
): DetailChannelGate {
  const payloads = makeFoldCache<ColdPayload>(ctx, { maxEntries: PAYLOAD_CACHE_MAX, idleMs: options.idleSweepMs })
  mountPostRoute({
    ctx,
    deps: ['connection', 'sessions'],
    path: DETAIL_ROUTE,
    label: 'dsh-context: detail route',
    gate,
    handler: (c) => {
      const sessions = c.get('sessions') as SessionsHostFace | undefined
      const getSession = typeof sessions?.get === 'function' ? sessions.get.bind(sessions) : undefined
      if (getSession === undefined) return undefined

      return async (request: Request): Promise<Response> => {
        payloads.touch()
        const read = await readBody(request)
        if (!read.ok) return read.response
        const body = read.body
        const sessionId = body !== null && typeof body === 'object'
          ? (body as { sessionId?: unknown }).sessionId
          : undefined
        const headOnly = body !== null && typeof body === 'object' && (body as { head?: unknown }).head === true
        if (typeof sessionId !== 'string' || sessionId === '') {
          return failure('dsh-context/bad-request', 'missing sessionId')
        }
        try {
          const session = getSession(sessionId)
          if (session !== undefined && session !== null) {
            const state = gate.stateOf(session, 'contextTimeline') as TimelineState | undefined
            if (state === undefined) return reply({ ok: true, value: null })
            if (headOnly) return reply({ ok: true, value: headPayloadOf(state, cost) })
            const detailState = await shadow.stateOf(sessionId)
            if (detailState === null) return reply({ ok: true, value: null })
            return reply({ ok: true, value: withDetailCost(cost, buildTimelineDetail(detailState, bounds)) })
          }
```

</details>

**依据 4 · 源码核查**：[src/host/detail.ts:116-150](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/host/detail.ts#L116-L150)

观察、缓存匹配、事件折叠与释放。

<details>
<summary>查看原文（35行）</summary>

```text
          const observe = observeOf(ctx)
          if (observe === undefined) return reply({ ok: true, value: null })
          const value = await coldReads.admit(async () => {
            const observation = await observe(sessionId, { projectionMode: 'none' })
            const release = leaseOf(observation)
            try {
              const persistence = serviceIdentityOf(ctx.get('sessionPersistence'))
              const revision = revisionOf(observation)
              if (revision !== undefined) {
                const hit = payloads.get(sessionId, cached => cached.revision === revision && cached.persistence === persistence)
                if (hit !== undefined) {
                  if (headOnly) {
                    /* v8 ignore next 1 */
                    return hit.value.head === undefined
                      ? { rev: hit.value.rev }
                      : { rev: hit.value.rev, head: withCost(cost, hit.value.head) }
                  }
                  return withDetailCost(cost, hit.value)
                }
              }
              const events = asRecord(observation)?.events
              if (!Array.isArray(events)) return null
              const state = (await foldLog(events, bounds)).state
              if (headOnly) return headPayloadOf(state, cost)
              const detail = buildTimelineDetail(state, bounds)
              if (revision === undefined) return withDetailCost(cost, detail)
              payloads.set(sessionId, { persistence, revision, value: detail })
              return withDetailCost(cost, detail)
            } finally {
              release()
            }
          })
          return reply({ ok: true, value: value ?? null })
        } catch (err) {
          return failure('gateway/internal', err instanceof Error ? err.message : String(err))
```

</details>

**依据 5 · 源码核查**：[src/host/coldRead.ts:12-38](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/host/coldRead.ts#L12-L38)

V8 阈值和串行队列。

<details>
<summary>查看原文（27行）</summary>

```text
const HIGH_WATER = 2 / 3

function v8Reading(): HeapReading {
  const stats = getHeapStatistics()
  return { used: stats.used_heap_size, limit: stats.heap_size_limit }
}

const noop = (): void => {}

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
      const run = tail.then(() => (clear() ? read() : undefined))
      tail = run.then(noop, noop)
      return run
    },
  }
```

</details>

#### 缺口

- 未量化并行历史查询、堆占用和界面加载。
  **影响**：缓存和阈值不能替代性能验收。
  **进一步探讨**：在长短已知会话中注入重复历史请求并记录内存和等待。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些数据与提示词行为影响试用？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

先用个人隔离 Web profile 和无敏感内容的会话，验证一笔已知的长工具结果。明细路由通过宿主 connection.fetch 注册，代表分支验证 sessionId 并进入会话服务。源码可确认这一挂载和查询路径，宿主如何给请求授权以及不同用户能否读取对方会话需要另查。成本视图使用目录价格估计费用，遇到无目录或不匹配项时保留未就绪或缺失信息，不能直接用于核账。

插件还有独立的提示词首尾配置，默认空。宿主 systemPrompt 服务提供所需方法时，非空文字在指定核心段落前后注册，且不做插值。诊断试用先保持空，避免同时改变模型收到的系统提示。环境配置和检查授权属于首次人力，持续有历史重建与页面资源，误读成本或误配提示词会增加排查。若出现跨会话数据不符、空明细或未预期的提示文字，移除对应配置或停用插件，再回到原生会话、原始日志及账单；实际耗时和资源未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/postRoute.ts:61-71](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/host/postRoute.ts#L61-L71)

通过宿主连接注册及路由作用域。

<details>
<summary>查看原文（11行）</summary>

```text
export function mountPostRoute(mount: PostRouteMount): unknown {
  const { ctx, deps, path, label, gate } = mount
  return ctx.inject(deps, (c) => {
    const fetch = mount.handler(c)
    if (fetch === undefined) return
    const connection = c.get('connection') as ConnectionHostFace | undefined
    if (!registerPostRoute(c, connection, path, fetch, label)) return
    if (gate === undefined) return
    gate.live = true
    return () => { gate.live = false }
  })
```

</details>

**依据 2 · 源码核查**：[src/host/detail.ts:94-117](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/host/detail.ts#L94-L117)

按 sessionId 进入代表查询路径。

<details>
<summary>查看原文（24行）</summary>

```text
      return async (request: Request): Promise<Response> => {
        payloads.touch()
        const read = await readBody(request)
        if (!read.ok) return read.response
        const body = read.body
        const sessionId = body !== null && typeof body === 'object'
          ? (body as { sessionId?: unknown }).sessionId
          : undefined
        const headOnly = body !== null && typeof body === 'object' && (body as { head?: unknown }).head === true
        if (typeof sessionId !== 'string' || sessionId === '') {
          return failure('dsh-context/bad-request', 'missing sessionId')
        }
        try {
          const session = getSession(sessionId)
          if (session !== undefined && session !== null) {
            const state = gate.stateOf(session, 'contextTimeline') as TimelineState | undefined
            if (state === undefined) return reply({ ok: true, value: null })
            if (headOnly) return reply({ ok: true, value: headPayloadOf(state, cost) })
            const detailState = await shadow.stateOf(sessionId)
            if (detailState === null) return reply({ ok: true, value: null })
            return reply({ ok: true, value: withDetailCost(cost, buildTimelineDetail(detailState, bounds)) })
          }
          const observe = observeOf(ctx)
          if (observe === undefined) return reply({ ok: true, value: null })
```

</details>

**依据 3 · 源码核查**：[src/host/cost.ts:38-73](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/host/cost.ts#L38-L73)

使用目录价格估算并记录缺失。

<details>
<summary>查看原文（36行）</summary>

```text
export function createCostSource(catalog: CatalogService): CostSource {
  return {
    ready(): boolean {
      return catalog.book() !== null
    },
    read(usage: SessionCostUsage | null | undefined): SessionCostRead | undefined {
      if (usage === null || usage === undefined) return undefined
      catalog.ensure()
      const book = catalog.book()
      if (book === null) return { usd: null, ready: false }
      const usd = calculateSessionCost(usage, book)
      const faces: CostPriceFace[] = []
      const misses: CostPriceMiss[] = []
      for (const lookup of priceLookupsOf(usage, book)) {
        if (lookup.face !== null) faces.push(faceOf(lookup.provider, lookup.model, lookup.face))
        else misses.push(missOf(lookup.provider, lookup.model, lookup.miss))
      }
      return {
        usd,
        ready: true,
        ...(faces.length === 0 ? {} : { faces }),
        ...(misses.length === 0 ? {} : { misses }),
      }
    },
    usd(usage: SessionCostUsage | null | undefined): number | null {
      if (usage === null || usage === undefined) return null
      catalog.ensure()
      return calculateSessionCost(usage, catalog.book())
    },
    complete(usage: SessionCostUsage | null | undefined): boolean {
      if (usage === null || usage === undefined) return false
      catalog.ensure()
      const book = catalog.book()
      if (book === null) return false
      const lookups = priceLookupsOf(usage, book)
      return lookups.length > 0 && lookups.every(lookup => lookup.face !== null)
```

</details>

**依据 4 · 源码核查**：[src/host/config.ts:45-51](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/host/config.ts#L45-L51)

提示词前后缀缺省为空。

```text
  insightsEntry: volatileField(z.union(['show', 'hide']).default('show').loose()),
  defaultDurationCurve: volatileField(z.union(['show', 'hide']).default('show').loose()),
  overviewAutoSteps: volatileField(z.union(['100', '200', '300', 'off']).default('100').loose()),
  defaultOverviewRange: volatileField(z.union(['today', '7d', '30d', 'all']).default('30d').loose()),
  fleetTab: volatileField(z.union(['show', 'hide']).default('show').loose()),
  promptPrefix: volatileField(z.string().default('').loose()),
  promptSuffix: volatileField(z.string().default('').loose()),
```

**依据 5 · 源码核查**：[src/host/promptInjection.ts:26-53](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/host/promptInjection.ts#L26-L53)

空白处理、可选服务与首尾段落注册。

<details>
<summary>查看原文（28行）</summary>

```text
function sectionText(read: () => string): (context: unknown) => string {
  return () => {
    const text = read()
    return text.trim().length === 0 ? '' : text
  }
}

const ORDER_CLEARANCE = 1000

export function watchPromptInjection(ctx: Context, config: Config): void {
  ctx.inject(['systemPrompt'] as never, (inner: Context) => {
    const systemPrompt = (inner as { systemPrompt?: SystemPromptFace | null }).systemPrompt
    if (systemPrompt === null || systemPrompt === undefined
      || typeof systemPrompt.section !== 'function'
      || typeof systemPrompt.getSectionOrder !== 'function') return
    systemPrompt.section({
      name: 'dsh-context:prompt-prefix',
      order: systemPrompt.getSectionOrder('HARNESS_IDENTITY') - ORDER_CLEARANCE,
      text: sectionText(liveText(config.promptPrefix)),
      interpolate: false,
    })
    systemPrompt.section({
      name: 'dsh-context:prompt-suffix',
      order: systemPrompt.getSectionOrder('DEPLOYMENT_PERSONA_SUFFIX') + ORDER_CLEARANCE,
      text: sectionText(liveText(config.promptSuffix)),
      interpolate: false,
    })
  })
```

</details>

#### 缺口

- 尚未独立验收不同身份和远程连接的明细访问边界。
  **影响**：个人会话机制不足以支持共享部署的授权结论。
  **进一步探讨**：用不同身份按会话 ID 分别测试活动、历史和不存在会话。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证分项和明细能否更快找到膨胀来源？

**研究主题**：新假设与验证

#### 完整回答

假设额外的时间线和分项可减少从压力告警到定位正确工具结果的时间。准备四份等量的会话回放，交错埋入大工具结果、长用户消息和一个记录不全的旧会话。让同一个人交叉使用原生压力加日志与插件分析两种流程，提交源事件、发生步骤和覆盖缺口。比较正确定位率、错误归因、诊断时间和复核耗时。若时间差来自直接猜测、错误归因上升，或历史明细经常缺失到妨碍复核，则不支持采用。试验保持提示词配置为空。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/sessionData.ts:13-21](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/client/sessionData.ts#L13-L21)

共同的原生压力和用量基线。

```text
export function useContextSession(props: SessionStandardProps): ContextSession {
  const source = useTimelineSource(props)
  return {
    source,
    data: source.data,
    pressure: projectionOf(props, 'contextPressure', contextPressureOf),
    breakdown: projectionOf(props, 'contextBreakdown', contextBreakdownOf),
    usage: projectionOf(props, 'tokenUsage', tokenUsageOf),
  }
```

**依据 2 · 源码核查**：[src/host/detail.ts:116-150](https://github.com/bowenliang123/dsh-context/blob/4d8fb8a6b8c9e5df4e11878d655fc8f6ba5a33ef/src/host/detail.ts#L116-L150)

历史明细可能缺失，适合设反例。

<details>
<summary>查看原文（35行）</summary>

```text
          const observe = observeOf(ctx)
          if (observe === undefined) return reply({ ok: true, value: null })
          const value = await coldReads.admit(async () => {
            const observation = await observe(sessionId, { projectionMode: 'none' })
            const release = leaseOf(observation)
            try {
              const persistence = serviceIdentityOf(ctx.get('sessionPersistence'))
              const revision = revisionOf(observation)
              if (revision !== undefined) {
                const hit = payloads.get(sessionId, cached => cached.revision === revision && cached.persistence === persistence)
                if (hit !== undefined) {
                  if (headOnly) {
                    /* v8 ignore next 1 */
                    return hit.value.head === undefined
                      ? { rev: hit.value.rev }
                      : { rev: hit.value.rev, head: withCost(cost, hit.value.head) }
                  }
                  return withDetailCost(cost, hit.value)
                }
              }
              const events = asRecord(observation)?.events
              if (!Array.isArray(events)) return null
              const state = (await foldLog(events, bounds)).state
              if (headOnly) return headPayloadOf(state, cost)
              const detail = buildTimelineDetail(state, bounds)
              if (revision === undefined) return withDetailCost(cost, detail)
              payloads.set(sessionId, { persistence, revision, value: detail })
              return withDetailCost(cost, detail)
            } finally {
              release()
            }
          })
          return reply({ ok: true, value: value ?? null })
        } catch (err) {
          return failure('gateway/internal', err instanceof Error ? err.message : String(err))
```

</details>

#### 缺口

- 未执行对照。
  **影响**：不能把观察面板的结构换算成效率提升。
  **进一步探讨**：对固定回放保存答案和用时，按已知事件逐份核对。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
