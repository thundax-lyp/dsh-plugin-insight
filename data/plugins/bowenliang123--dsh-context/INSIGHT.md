# dsh-context

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c1f4598](https://github.com/bowenliang123/dsh-context/tree/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d)

<!-- BEGIN META -->
[![GitHub ★ 3,940](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C940&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bowenliang123/dsh-context) [![npm 30d 255,407](https://img.shields.io/static/v1?label=npm+30d&message=255%2C407&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供上下文仪表盘与命令，查看会话组成和变化。

> **亮点**：[Q02](#research-q02) 将已有宿主事件和估算组织成按请求分类与详情导航，相比只看总量提供可检查的线索；这不是独立网络抓包或已证实的节时。

> **主要限制**：[Q03](#research-q03) 中估算公式、低版本零值降级和冷读门控会改变数值含义或让详情缺失；[Q02](#research-q02) 因而不能保证完整精确账单。

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
  - [Q01 · 面向谁、如何加载及使用？](#detail-section-11)
  - [Q02 · 请求数据如何从捕获流到用户界面？](#detail-section-12)
  - [Q03 · 估算、冷读、兼容和隐私有哪些关键限制？](#detail-section-13)
  - [Q04 · 成本、效果与改进假设是什么？](#detail-section-14)
  - [Q05 · 谁值得试用、怎样验收和退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向需要定位长会话上下文膨胀来源的 DSH 用户；合格结果是能够解释请求构成并核对来源。

不使用插件时可从宿主总量与持久日志、供应商 usage 手动核对；本轮未比较诊断时间或完整性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 上下文视图 | 按请求查看组成和变化 | 依赖 DSH 投影和客户端服务，分类含估算 |
| /context 命令 | 打开当前会话上下文界面 | inputTriggers 服务须可用 |
| 历史详情读取 | 从轻头请求更完整的详情 | 冷读可能被内存门控，缺失不等于零 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 sessionProjections | 必需 | 消费持久事件和注册投影 | 低版本返回不支持的降级数据 |
| web 客户端服务 | 界面必需 | 挂载面板与命令 | 相应入口无法使用 |
| 会话事件和 usage | 相应诊断必需 | 组成与计费参考 | 缺失时无法完整归因 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主版本并备份配置 | 独立 profile 可回退 |
| 加载 | 用户安装插件并打开上下文视图 | 检查是否显示不支持或加载失败 |
| 诊断 | 用户选请求并比较事件和 usage | 分类和来源能解释已知请求 |
| 退出 | 用户通过宿主管理插件 | 核查提示词配置和原入口 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包和宿主资源 | 安装、检查版本与配置 | 时间和费用未知 |
| 持续使用 | 历史读写和内存 | 核对估算和请求来源 | 开销与节省未知 |
| 失败恢复 | 重新读取或宿主日志查询 | 排查版本、内存与缺失事件 | 恢复耗时未知 |
| 退出 | 配置迁移资源未知 | 移除插件并核对配置 | 效果未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 请求组成 | 宿主事件被折叠为分类投影 | 是否涵盖全部 provider 请求 |
| 费用参考 | 存在 usage 和价格计算路径 | 与账单的一致性及诊断节时 |

> **思考**：[Q03](#research-q03) 中估算公式、低版本零值降级和冷读门控会改变数值含义或让详情缺失；[Q02](#research-q02) 因而不能保证完整精确账单。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将已有宿主事件和估算组织成按请求分类与详情导航，相比只看总量提供可检查的线索；这不是独立网络抓包或已证实的节时。

[Q02](#research-q02) 投影和详情拆分使界面能按需读取；[Q03](#research-q03) 冷读串行与高水位门控限制峰值压力，但导致数据暂缺，不能将缺失显示视为真实零值。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 中估算公式、低版本零值降级和冷读门控会改变数值含义或让详情缺失；[Q02](#research-q02) 因而不能保证完整精确账单。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议在隔离 profile、空提示词前后缀下先对照单个请求；低版本降级、冷读缺失或估算无法解释时回到原始事件和供应商 usage。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持投影与界面设计；真实兼容性、计量误差、诊断收益和新假设均待验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/host/index.ts、src/host/timeline.ts、src/host/fold.ts、src/shared/estimate.ts、src/host/fallback.ts、src/host/coldRead.ts、src/host/promptInjection.ts、src/client/index.ts、src/client/timelineSource.ts、src/client/components/contextView.tsx、src/client/command.ts、src/host/detail.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查 DSH host 投影、事件折叠、客户端入口、计量与降级；未审计全部页面、权限和网络链路。
- 下一步：固定 DSH、插件和 provider 版本，比较单次请求的事件、供应商 usage、面板分类及缺失状态；记录诊断正确率、耗时和资源。

**分析版本**

- **仓库**：[bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context)
- **版本号**：0.78.2（[固定提交 c1f4598](https://github.com/bowenliang123/dsh-context/tree/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设将估算、usage 和缺失状态并列显示可减少误判，须以相同请求测正确率和人工时间；尚未验证且不是已实现贡献。

固定 DSH、插件和 provider 版本，比较单次请求的事件、供应商 usage、面板分类及缺失状态；记录诊断正确率、耗时和资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 866 | — | — | 14826 |
| .ts | source | 113 | 17147 | 15720 | 106 | — |
| .mjs | source | 4 | 209 | 187 | 0 | — |
| .tsx | source | 59 | 12606 | 11859 | 86 | — |
| .ts | test | 208 | 47112 | 43203 | 230 | — |
| .js | example | 3 | 9 | 9 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 72](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=72&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 76](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=76&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确定 DSH 用户能否用固定版本追溯一次模型请求的上下文组成，以及可见数据的来源、精度与边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁、如何加载及使用？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

它面向希望找出长会话上下文占用和变化来源的 DSH 用户。合格诊断应能将异常请求的构成映射到可检查内容，并理解估算和遗漏；仅出现总 token 数并不能完成归因。作者给出 web profile 安装及侧栏、标签和 /context 入口；包声明 Node 与 DSH 版本范围、web 客户端依赖，并列出两个兼容版本。源码把插件作为 sessionProjections 注入，客户端在可用的宿主槽位挂载视图；实际可见还取决于宿主服务与构建产物。这里只检查固定源码和作者声明，未安装或验证宿主。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-20](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/README.md#L11-L20)

作者描述目标与入口。

<details>
<summary>查看原文（10行）</summary>

```text
**The best [DeepSeek Harness plugin](https://www.deepseek.com/harness/) for Agent's context insights and management.**

> Recommended and starred by DeepSeek Harness staff [@tianyicui](https://github.com/tianyicui) and [@turtle1999](https://github.com/turtle1999) — see [this post on X](https://x.com/tianyi/status/2105256532657267119).

[`dsh-context`](https://www.npmjs.com/package/dsh-context) provides full context lifecycle management features.
- **Context Insights page** — the cross-session overview as a first-level sidebar panel (beside Plugins and Automation tasks): KPI band with a 7-day token/cost usage chart, activity heatmap, aggregate composition ring, and filterable session cards that jump straight into any session.
- **Context tab** — a UI context dashboard for DeepSeek Harness's context stats, composition, trend, events, messages, and commands.
- **Fleet tab** — the agent family's own page: the current agent, its parents, and every subagent as one live card each.
- **Context panel** — the same dashboard as a right-sidebar tab: pick **Context** on the sidebar's guide page and the panel opens beside the chat, agent network included.
- **`/context` command** — the slash command shows the context model for current context composition and recent context evolution.
```

</details>

**依据 2 · 作者声明**：[README.md:24-41](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/README.md#L24-L41)

作者提供 web profile 安装方式。

<details>
<summary>查看原文（18行）</summary>

````text
### Install on DeepSeek Harness web or desktop

Fill `dsh-context` in the **Add plugin** wizard's search box, and click **Install**:

![Add_plugin_wizard](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/add-plugin-wizard.png)

### Install with `dsh` cli

Install [`dsh-context`](https://www.npmjs.com/package/dsh-context) plugin from [DeepSeek Harness](https://www.npmjs.com/package/@deepseek-ai/dsh):

```sh
dsh plugin --profile web add dsh-context
```

Or update the `dsh-context` plugin:

```sh
dsh plugin --profile web update dsh-context@latest
````

</details>

**依据 3 · 源码核查**：[package.json:15-29](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/package.json#L15-L29)

包声明运行时与宿主条件以及客户端导出。

<details>
<summary>查看原文（15行）</summary>

```text
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.2 || >=0.2.1-rc.2"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./lib/client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
```

</details>

**依据 4 · 源码核查**：[package.json:56-75](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/package.json#L56-L75)

声明所需客户端服务和兼容版本。

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

**依据 5 · 源码核查**：[src/client/index.ts:48-69](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/client/index.ts#L48-L69)

客户端条件挂载视图。

<details>
<summary>查看原文（22行）</summary>

```text
function apply(ctx: ClientCtx): void {
  if (entrySeated(ctx, JUMP_SLOT, JUMP_ID)) return
  ctx.effect(() => {
    return ctx.locale.register(NS, { zh: DICT_ZH, en: DICT_EN })
  }, 'dsh-context: dictionaries')
  const t = ctx.locale.bind(NS)

  const kit = makeViewKit(t, ctx.locale)
  ctx.effect(() => resetSessionWarm, 'dsh-context: warm-up timers')
  watchHistoryFaces(ctx)
  const settings = createContextSettings()
  const heads = makeAgentHeads()
  const ContextView = makeContextView(ctx, kit, settings, heads)
  const FleetView = makeFleetView(ctx, kit, heads)

  ctx.effect(() => watchPlacement(settings, {
    tab: () => ctx.slots.inject('conversation.view', () => ctx.slots.register(
      { name: 'conversation.view', id: CONTEXT_VIEW_ID, order: 20, locale: NS, label: () => t('tab.context') },
      props => h(ContextView, props),
    )),
    sidebar: () => watchSidebarContextTab(ctx, ContextView, t, NS),
  }), 'dsh-context: placement')
```

</details>

#### 缺口

- 具体 DSH 版本、配置和 web 宿主的安装加载结果
  **影响**：决定视图是否可用
  **进一步探讨**：在隔离 profile 安装并检查入口和缺失服务处理

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求数据如何从捕获流到用户界面？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

host 的 apply 在基线满足或版本未知时注册 contextTimeline 投影，并配置详情读取；投影用 applyTimeline 消费宿主持久事件。fold 对 request/header 估算工具，对 system/message 估算系统内容，对 assistant/message 累加现有分类并将 usage 输入、缓存与输出写入请求记录。详情通道注册 POST 路由；活跃会话从投影及 shadow 读取，冷会话在门控允许时读取事件并 fold 后返回。客户端发送会话 ID，HTTP 失败或响应结构无效时抛错。投影的轻头或完整视图再交给客户端；useTimelineSource 读取会话投影，在轻头或冷数据时创建详情存储并请求明细，视图可以显示加载失败和重试。相对只看原生总量或人工读日志，用户有按请求分解与跳转来源的界面；它是对宿主事件和估算的再组织，不是对模型请求字节的独立网络抓包，也不证明省时或逐 token 精确。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:28-51](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/index.ts#L28-L51)

注册投影与详情通道。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const coldReads = makeColdReadGate()
  watchBalanceChannel(ctx)
  watchRecomChannel(ctx)
  watchSkillCatalog(ctx)
  watchFleetChannel(ctx, coldReads)
  watchAttachmentChannel(ctx, coldReads)
  const harnessVersion = detectHarnessVersion(ctx)
  if (harnessVersion !== undefined && !meetsBaseline(harnessVersion)) {
    ctx.sessionProjections.register(createFallbackTimelineDefinition(harnessVersion) as never)
    ctx.sessionProjections.register(createFallbackHeadersDefinition() as never)
    ctx.sessionProjections.register(createFallbackActivityDefinition() as never)
    return
  }
  const attribution = createToolAttribution(ctx)
  watchStepIdentity(ctx)
  const gate = watchDetailChannel(ctx, resolveBounds(config), coldReads)
  watchCommandPageChannel(ctx, resolveBounds(config), coldReads)
  ctx.sessionProjections.register(createContextTimelineDefinition(config, () => gate.live))
  ctx.sessionProjections.register(createContextHeadersDefinition(name => attribution.ownerOf(name)))
  ctx.sessionProjections.register(createContextActivityDefinition())
  watchTimelineRowSweep(ctx)
  watchActivityBackfill(ctx, coldReads)
  watchPromptInjection(ctx, config)
```

</details>

**依据 2 · 源码核查**：[src/host/timeline.ts:317-331](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/timeline.ts#L317-L331)

投影将宿主事件折叠成轻头或完整视图。

<details>
<summary>查看原文（15行）</summary>

```text
export const TIMELINE_STATE_VERSION = 37

export function createContextTimelineDefinition(config: Config, slim: () => boolean): WiredProjection<'contextTimeline', TimelineState> {
  const bounds = resolveBounds(config)
  const headBounds: FoldBounds = { ...bounds, headOnly: true }
  const view = (state: TimelineState): ContextTimeline =>
    slim() ? buildTimelineHead(state) : buildTimelineView(state, bounds)
  const definition: WiredProjection<'contextTimeline', TimelineState> = {
    key: 'contextTimeline',
    stateSchema: timelineStateSchema,
    wire: { viewSchema: contextTimelineSchema, view },
    init: () => createTimelineState(),
    apply: (state: TimelineState, event: SessionEvent) => applyTimeline(state, event as Parameters<typeof applyTimeline>[1], headBounds),
    stateVersion: TIMELINE_STATE_VERSION,
  }
```

</details>

**依据 3 · 源码核查**：[src/host/fold.ts:314-323](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/fold.ts#L314-L323)

请求头中的工具和模型配置进入状态。

<details>
<summary>查看原文（10行）</summary>

```text
      case 'request/header': {
        const header = (data?.header ?? {}) as {
          tools?: unknown[]
          config?: { model?: unknown; provider?: unknown; reasoningEffort?: unknown; maxTokens?: unknown }
        }
        const tools = Array.isArray(header.tools) ? header.tools : []
        const s = ensure(['events'])
        s.toolsTokens = estimateToolsTotal(tools)
        if (header.config && typeof header.config.model === 'string') s.model = header.config.model
        if (header.config && typeof header.config.provider === 'string') s.provider = header.config.provider
```

</details>

**依据 4 · 源码核查**：[src/host/fold.ts:342-365](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/fold.ts#L342-L365)

系统消息估算与请求上下文记录。

<details>
<summary>查看原文（24行）</summary>

```text
      case 'system/message': {
        const s = ensure(['surface', 'sums', 'archived'])
        delete s.pendingShadowedSeqs
        delete s.pendingShadowEventSeq
        const op = replaceRangeOf(event.surfaceOp)
        if (op !== null) {
          const systems = s.systems ?? []
          s.systems = systems.filter(n => n.seq < op.start || n.seq > op.end)
          const claimed = new Set<number>()
          for (const n of s.surface) {
            if (n.seq >= op.start && n.seq <= op.end) claimed.add(n.seq)
          }
          if (removeSurfaceSeqs(s, claimed, event.seq, bounds).length > 0) bumpDetailRev(s)
        }
        pushSystem(s, { seq: event.seq, time: event.time, tokens: estimateSystemContent(messageOf(data)?.content) })
        break
      }
      case 'request/context': {
        const s = ensure([])
        if (data && typeof data.contextWindow === 'number') s.contextWindow = data.contextWindow
        if (data && typeof data.model === 'string') s.model = data.model
        if (data && typeof data.provider === 'string') s.provider = data.provider
        break
      }
```

</details>

**依据 5 · 源码核查**：[src/host/fold.ts:745-787](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/fold.ts#L745-L787)

助手消息形成分类记录并引入 usage。

<details>
<summary>查看原文（43行）</summary>

```text
      case 'assistant/message': {
        const usage = data?.usage as UsageLike | null | undefined
        const s = ensure(['surface', 'sums', 'archived', 'events', 'requests', 'timing'])
        bumpDetailRev(s)
        const total = s.systemTokens + s.toolsTokens + s.sums.user + s.sums.inject + s.sums.skill + s.sums.assistant + s.sums.tool
        const slim: SlimRequestRecord = { time: event.time, seq: event.seq, total }
        const full: RequestRecord | null = bounds.headOnly === true
          ? null
          : {
            ...slim,
            system: s.systemTokens,
            tools: s.toolsTokens,
            user: s.sums.user,
            inject: s.sums.inject,
            skill: s.sums.skill,
            assistant: s.sums.assistant,
            tool: s.sums.tool,
          }
        const record = full ?? slim
        if (data && typeof data.turn === 'number') record.turn = data.turn
        if (data && typeof data.step === 'number') record.step = data.step
        if (state.stepStart !== undefined) s.stepRequestSeq = record.seq
        let output: number | null = null
        if (usage !== null && typeof usage === 'object') {
          const input = tokenCountOf(usage.inputTokens)
          const cacheRead = tokenCountOf(usage.cacheReadTokens)
          const cacheWrite = tokenCountOf(usage.cacheWriteTokens)
          output = tokenCountOf(usage.outputTokens)
          if (input !== null || cacheRead !== null || cacheWrite !== null || output !== null) {
            record.prompt = (input ?? 0) + (cacheRead ?? 0) + (cacheWrite ?? 0)
            if (full !== null) {
              if (cacheRead !== null) full.cacheRead = cacheRead
              if (output !== null) full.output = output
            }
            accumulateCost(s, event.time, {
              uncached: input ?? 0,
              cacheRead: cacheRead ?? 0,
              cacheWrite: cacheWrite ?? 0,
              output: output ?? 0,
            })
          }
        }
        s.requests.push(record)
```

</details>

**依据 6 · 源码核查**：[src/client/timelineSource.ts:338-354](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/client/timelineSource.ts#L338-L354)

客户端读取投影并按需请求详情。

<details>
<summary>查看原文（17行）</summary>

```text
export function useTimelineSource(props: SessionStandardProps): TimelineSource {
  const head = projectionOf(props, 'contextTimeline', timelineOf)
  const sessionId = typeof props.sessionId === 'string' ? props.sessionId : ''
  const headRev = head !== null && typeof head.detailRev === 'number' ? head.detailRev : null
  const slim = headRev !== null
  const cold = head === null
  const store = useMemo(
    () => (sessionId !== '' && (slim || cold) ? detailStoreOf(sessionId) : null),
    [sessionId, slim, cold],
  )
  const snap = useSyncExternalStore(
    store !== null ? store.subscribe : noopSubscribe,
    store !== null ? store.getSnapshot : () => EMPTY_SNAP,
  )
  useEffect(() => {
    if (store !== null) store.request(headRev ?? 0)
  }, [store, headRev])
```

</details>

**依据 7 · 源码核查**：[src/client/components/contextView.tsx:690-696](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/client/components/contextView.tsx#L690-L696)

视图区分详情就绪和加载失败。

```text
          </div>
        </div>
        {displayRequests.length === 0
          ? (detailReady
            ? <TrendReserved catLabel={catLabel}><div className="lc-empty">{t('trend.empty')}</div></TrendReserved>
            : <TrendReserved catLabel={catLabel}>
              <DetailNote state={source.detailState === 'failed' ? 'failed' : 'loading'} onRetry={source.retryDetail} />
```

**依据 8 · 源码核查**：[src/client/timelineSource.ts:19-35](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/client/timelineSource.ts#L19-L35)

客户端按会话请求详情并拒绝错误响应。

<details>
<summary>查看原文（17行）</summary>

```text
export function makeDetailFetcher(
  sessionId: string,
): (() => Promise<ContextTimelineDetail | null>) | undefined {
  if (sessionId === '') return undefined
  return async () => {
    const response = await fetch(DETAIL_ROUTE, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    if (!response.ok) throw new Error(`dsh-context: detail route HTTP ${response.status}`)
    const r = asRecord(await response.json())
    if (r === null || r.ok !== true) throw new Error('dsh-context: detail read failed')
    if (r.value === null) return null
    const detail = detailOf(r.value)
    if (detail === null) throw new Error('dsh-context: detail read malformed')
    return detail
```

</details>

**依据 9 · 源码核查**：[src/host/detail.ts:50-83](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/detail.ts#L50-L83)

注册回调处理活跃会话投影与详情。

<details>
<summary>查看原文（34行）</summary>

```text
export function watchDetailChannel(ctx: Context, bounds: FoldBounds, coldReads: ColdReadGate = makeColdReadGate()): DetailChannelGate {
  const gate = { live: false }
  const payloads = new Map<string, ColdPayload>()
  const shadow = new DetailShadow(ctx, bounds, coldReads, () => observeFaceOf(ctx))
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
          const state = projections.stateOf(session as never, 'contextTimeline')
          if (state === undefined) return reply({ ok: true, value: null })
          if (headOnly) return reply({ ok: true, value: headPayloadOf(state) })
          const detailState = await shadow.stateOf(sessionId)
          if (detailState === null) return reply({ ok: true, value: null })
          return reply({ ok: true, value: buildTimelineDetail(detailState, bounds) })
```

</details>

**依据 10 · 源码核查**：[src/host/detail.ts:85-103](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/detail.ts#L85-L103)

冷会话门控读取事件并重新折叠。

<details>
<summary>查看原文（19行）</summary>

```text
        const observe = observeFaceOf(ctx)
        if (observe === undefined) return reply({ ok: true, value: null })
        const value = await coldReads.admit(async () => {
          const observation = await observe(sessionId, { projectionMode: 'none' })
          try {
            const persistence: unknown = ctx.get('sessionPersistence')
            const revision = revisionOf(observation)
            if (revision !== undefined) {
              const hit = payloads.get(sessionId)
              if (hit !== undefined && hit.revision === revision && hit.persistence === persistence) {
                payloads.delete(sessionId)
                payloads.set(sessionId, hit)
                return headOnly ? headOfDetail(hit.value) : hit.value
              }
            }
            const events = asRecord(observation)?.events
            if (!Array.isArray(events)) return null
            const state = (await foldLog(events, bounds)).state
            if (revision !== undefined) {
```

</details>

**依据 11 · 源码核查**：[src/host/detail.ts:119-127](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/detail.ts#L119-L127)

空值和错误响应及实际路由注册。

```text
        })
        return reply({ ok: true, value: value ?? null })
      } catch (err) {
        return failure('gateway/internal', err instanceof Error ? err.message : String(err))
      }
    }

    if (!registerPostRoute(c, c.get('connection') as ConnectionHostFace | undefined, DETAIL_ROUTE, handler, 'dsh-context: detail route')) return
    gate.live = true
```

#### 缺口

- 宿主事件是否涵盖指定 provider 的全部实际请求
  **影响**：影响请求组成能否完整解释
  **进一步探讨**：以同一请求比较宿主持久事件、供应商 usage 与界面，记录缺失

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 估算、冷读、兼容和隐私有哪些关键限制？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

系统和文本估算按每四个字符加固定开销计算，分类并非供应商精确 tokenizer；助手消息可另外记录供应商 usage，两者口径不能混同。检测到宿主低于基线时注册带 unsupported 的零值降级，不能将其当作真实零消耗；版本检测不到时按源码继续真实分支，不等于兼容已验证。冷读队列串行，堆使用达到阈值会返回 undefined，详情暂缺不可解释为没有历史。插件还可注册提示词前后缀，这会改变会话输入；若只诊断应保持配置为空并核查。需考虑界面或日志展示业务内容的访问边界，但本次没有做权限或安全审计。

#### 证据与依据

**依据 1 · 源码核查**：[src/shared/estimate.ts:1-11](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/shared/estimate.ts#L1-L11)

字符比例与固定开销的估算公式。

<details>
<summary>查看原文（11行）</summary>

```text
const CHARS_PER_TOKEN = 4
const ROLE_OVERHEAD = 4
const BLOCK_OVERHEAD = 4

export function estimateSystemTokens(text: unknown): number {
  if (typeof text !== 'string' || text.length === 0) return 0
  return Math.ceil(text.length / CHARS_PER_TOKEN) + ROLE_OVERHEAD
}

export function estimateTextTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN) + BLOCK_OVERHEAD
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:35-46](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/index.ts#L35-L46)

低版本 fallback，未知版本继续正常路径。

<details>
<summary>查看原文（12行）</summary>

```text
  const harnessVersion = detectHarnessVersion(ctx)
  if (harnessVersion !== undefined && !meetsBaseline(harnessVersion)) {
    ctx.sessionProjections.register(createFallbackTimelineDefinition(harnessVersion) as never)
    ctx.sessionProjections.register(createFallbackHeadersDefinition() as never)
    ctx.sessionProjections.register(createFallbackActivityDefinition() as never)
    return
  }
  const attribution = createToolAttribution(ctx)
  watchStepIdentity(ctx)
  const gate = watchDetailChannel(ctx, resolveBounds(config), coldReads)
  watchCommandPageChannel(ctx, resolveBounds(config), coldReads)
  ctx.sessionProjections.register(createContextTimelineDefinition(config, () => gate.live))
```

</details>

**依据 3 · 源码核查**：[src/host/fallback.ts:35-45](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/fallback.ts#L35-L45)

fallback 标识不支持且返回零值与空记录。

<details>
<summary>查看原文（11行）</summary>

```text
export function createFallbackTimelineDefinition(current: string) {
  return fallbackDefinition('contextTimeline', contextTimelineSchema, {
    ok: true,
    unsupported: { current, minimum: BASELINE_DSH_VERSION },
    current: { system: 0, tools: 0, user: 0, inject: 0, skill: 0, assistant: 0, tool: 0, total: 0 },
    requests: [],
    events: [],
    nodes: [],
    droppedNodes: 0,
    archive: [],
  })
```

</details>

**依据 4 · 源码核查**：[src/host/coldRead.ts:21-36](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/coldRead.ts#L21-L36)

内存门控和串行读取。

<details>
<summary>查看原文（16行）</summary>

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
      const run = tail.then(() => (clear() ? read() : undefined))
      tail = run.then(noop, noop)
      return run
```

</details>

**依据 5 · 源码核查**：[src/host/promptInjection.ts:26-52](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/promptInjection.ts#L26-L52)

前后缀可作为系统提示区段注册。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

#### 缺口

- 访问控制、隐藏细节和界面估算与实际用量的误差
  **影响**：影响是否能用于敏感内容或精确审计
  **进一步探讨**：针对部署权限、目标语言和模型比较，并审查数据路径

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本、效果与改进假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

初次成本包括安装、版本匹配和检查前后缀；持续成本包括读取历史、维护版本以及人工核对估算，冷读在高内存时可能不执行。项目计算计费字段但本插件的诊断节时、内存开销和每个合格诊断成本没有同条件实测，不应推断降费。可提出未验证假设：为每一项分类并列标示估算、供应商 usage 和缺失状态，有助于用户避免将零值或估算当账单；相对当前数值展示会增加界面复杂度。以相同请求记录让两组使用者判断异常归因，测正确率、耗时及误判，若正确率无改善或成本不可接受则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/fold.ts:745-787](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/fold.ts#L745-L787)

分类估算与供应商 usage 同时进入记录。

<details>
<summary>查看原文（43行）</summary>

```text
      case 'assistant/message': {
        const usage = data?.usage as UsageLike | null | undefined
        const s = ensure(['surface', 'sums', 'archived', 'events', 'requests', 'timing'])
        bumpDetailRev(s)
        const total = s.systemTokens + s.toolsTokens + s.sums.user + s.sums.inject + s.sums.skill + s.sums.assistant + s.sums.tool
        const slim: SlimRequestRecord = { time: event.time, seq: event.seq, total }
        const full: RequestRecord | null = bounds.headOnly === true
          ? null
          : {
            ...slim,
            system: s.systemTokens,
            tools: s.toolsTokens,
            user: s.sums.user,
            inject: s.sums.inject,
            skill: s.sums.skill,
            assistant: s.sums.assistant,
            tool: s.sums.tool,
          }
        const record = full ?? slim
        if (data && typeof data.turn === 'number') record.turn = data.turn
        if (data && typeof data.step === 'number') record.step = data.step
        if (state.stepStart !== undefined) s.stepRequestSeq = record.seq
        let output: number | null = null
        if (usage !== null && typeof usage === 'object') {
          const input = tokenCountOf(usage.inputTokens)
          const cacheRead = tokenCountOf(usage.cacheReadTokens)
          const cacheWrite = tokenCountOf(usage.cacheWriteTokens)
          output = tokenCountOf(usage.outputTokens)
          if (input !== null || cacheRead !== null || cacheWrite !== null || output !== null) {
            record.prompt = (input ?? 0) + (cacheRead ?? 0) + (cacheWrite ?? 0)
            if (full !== null) {
              if (cacheRead !== null) full.cacheRead = cacheRead
              if (output !== null) full.output = output
            }
            accumulateCost(s, event.time, {
              uncached: input ?? 0,
              cacheRead: cacheRead ?? 0,
              cacheWrite: cacheWrite ?? 0,
              output: output ?? 0,
            })
          }
        }
        s.requests.push(record)
```

</details>

**依据 2 · 源码核查**：[src/host/coldRead.ts:21-36](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/coldRead.ts#L21-L36)

冷读有堆内存门控。

<details>
<summary>查看原文（16行）</summary>

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
      const run = tail.then(() => (clear() ? read() : undefined))
      tail = run.then(noop, noop)
      return run
```

</details>

**依据 3 · 源码核查**：[src/host/fallback.ts:35-45](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/fallback.ts#L35-L45)

fallback 零值必须结合 unsupported 解释。

<details>
<summary>查看原文（11行）</summary>

```text
export function createFallbackTimelineDefinition(current: string) {
  return fallbackDefinition('contextTimeline', contextTimelineSchema, {
    ok: true,
    unsupported: { current, minimum: BASELINE_DSH_VERSION },
    current: { system: 0, tools: 0, user: 0, inject: 0, skill: 0, assistant: 0, tool: 0, total: 0 },
    requests: [],
    events: [],
    nodes: [],
    droppedNodes: 0,
    archive: [],
  })
```

</details>

#### 缺口

- 同任务诊断正确率、人工时间与实际资源开销
  **影响**：不能计算单位合格诊断成本或节省
  **进一步探讨**：在同一宿主、任务与数据下记录对照和人工耗时

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁值得试用、怎样验收和退出？

**研究主题**：采用判断

#### 完整回答

需要排查长会话膨胀、能够保护会话内容的 DSH 用户可在兼容版本的隔离 profile 试用。保持提示词前后缀为空，选一个有已知 usage 与历史的请求，对照组成、原始事件及显示状态；相对手工查日志它提供按分类导航，但精度和诊断节时没有证明。发现 unsupported、冷读失败、重要分类被裁剪或估算不能解释账单时，应停止将它当完整审计，回到宿主日志和供应商 usage；通过宿主插件管理移除并确认原配置。不能接受读取历史内容或额外配置副作用的用户应先观察。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-41](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/README.md#L24-L41)

安装通道和运行前提。

<details>
<summary>查看原文（18行）</summary>

````text
### Install on DeepSeek Harness web or desktop

Fill `dsh-context` in the **Add plugin** wizard's search box, and click **Install**:

![Add_plugin_wizard](https://raw.githubusercontent.com/bowenliang123/dsh-context/main/docs/add-plugin-wizard.png)

### Install with `dsh` cli

Install [`dsh-context`](https://www.npmjs.com/package/dsh-context) plugin from [DeepSeek Harness](https://www.npmjs.com/package/@deepseek-ai/dsh):

```sh
dsh plugin --profile web add dsh-context
```

Or update the `dsh-context` plugin:

```sh
dsh plugin --profile web update dsh-context@latest
````

</details>

**依据 2 · 源码核查**：[src/host/fallback.ts:35-45](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/fallback.ts#L35-L45)

低版本不代表真实零消耗。

<details>
<summary>查看原文（11行）</summary>

```text
export function createFallbackTimelineDefinition(current: string) {
  return fallbackDefinition('contextTimeline', contextTimelineSchema, {
    ok: true,
    unsupported: { current, minimum: BASELINE_DSH_VERSION },
    current: { system: 0, tools: 0, user: 0, inject: 0, skill: 0, assistant: 0, tool: 0, total: 0 },
    requests: [],
    events: [],
    nodes: [],
    droppedNodes: 0,
    archive: [],
  })
```

</details>

**依据 3 · 源码核查**：[src/host/coldRead.ts:21-36](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/coldRead.ts#L21-L36)

冷读可能返回缺失。

<details>
<summary>查看原文（16行）</summary>

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
      const run = tail.then(() => (clear() ? read() : undefined))
      tail = run.then(noop, noop)
      return run
```

</details>

**依据 4 · 源码核查**：[src/host/promptInjection.ts:35-52](https://github.com/bowenliang123/dsh-context/blob/c1f4598ebde84bf9ccecc7e8aa0e09824a392c0d/src/host/promptInjection.ts#L35-L52)

提示词设置改变宿主系统提示区段。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

#### 缺口

- 实际卸载后配置恢复及目标宿主入口
  **影响**：影响安全退出和试用结论
  **进一步探讨**：在隔离 profile 记录安装前后配置及卸载结果

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
