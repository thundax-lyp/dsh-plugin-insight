# dsh-context

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[9a48892](https://github.com/bowenliang123/dsh-context/tree/9a4889246ef83d2de0be32554a7c74c7d72674b7)

<!-- BEGIN META -->
[![GitHub ★ 4,246](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C246&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bowenliang123/dsh-context) [![npm 30d 361,079](https://img.shields.io/static/v1?label=npm+30d&message=361%2C079&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-context)
<!-- END META -->

> **功能**：为DSH提供上下文组成、请求趋势与Agent家族诊断，并支持系统提示词前后缀配置。

> **亮点**：[Q02](#research-q02)把事件分类、请求/来源与按需详情接到同屏诊断；[Q03](#research-q03)摘要/冷读门控/裁剪/失败提示帮助控制部分负担。

> **主要限制**：[Q03](#research-q03)估算、部分价格覆盖、冷读缺失与旧Host零值不可当账单；[Q04](#research-q04)提示词会改变行为，接口/配置权限继承Host未验。

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
  - [Q01 · 什么用户需要它，原生计量与插件贡献怎样区分？](#detail-section-11)
  - [Q02 · 事件怎样到达请求详情，何处会返回缺失？](#detail-section-12)
  - [Q03 · 分类token、费用与冷读降级有哪些具体边界？](#detail-section-13)
  - [Q04 · 它只是读诊断吗，谁控制提示词与详情访问？](#detail-section-14)
  - [Q05 · 如何用一次诊断决定是否保留，失败与退出成本是什么？](#detail-section-15)
  - [Q06 · 比继续加图表更值得验证的方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-context 0.82.0是DSH原生上下文诊断插件，宿主半部注册会话投影、Web半部挂Context/Fleet/侧栏及命令；不是独立Agent或模型。需要解释长会话为何膨胀、哪个请求/工具/技能贡献占用的DSH用户，可按请求查构成和变化。成功是能回指日志与usage解释已知异常，而不是环形图好看、显示费用就等账单。

宿主官方压力/组成/usage，原始日志与供应商用量手工核查；相同投影不是独立测量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 请求/构成诊断 | 查膨胀来源 | 估算与官方usage分开 |
| 按需详情 | 减摘要负担 | 日志/门控/保留限制 |
| 费用参考 | 模型价格映射 | 部分覆盖非账单 |
| 系统前后缀 | 部署行为设定 | Host scope/权限待核 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| Node/匹配DSH与sessionProjections | 必需 | 加载/官方事件投影 | 旧版unsupported，未知版本非保证 |
| Web slots/locale/ConfigForms | 对应UI/配置必需 | 界面/设置 | Host服务/权限另核 |
| sessionObserve/持久日志 | 冷详情必需 | 重折叠来源 | 缺失/高水位返回null |
| 模型价格簿/网络 | 费用参考必需 | usage映射 | 部分匹配非总账单 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 准备 | 私有profile/备份/核版本与权限 | prefix/suffix空 |
| 诊断 | 已知技能/工具/压缩请求 | 同seq比日志/usage/细节 |
| 判断 | 核价格覆盖/缺失/分类口径 | 不用部分值结算 |
| 退出 | 清prefix核下一请求，再卸载 | 查Host撤注册/留存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/包资源未知 | 配置/权限/样本核对 | 无安装验收 |
| 持续 | 投影/日志/价格网络/内存未知 | 归因/对账 | 不保证节省token |
| 故障 | 冷读/回退资源未知 | 查缺失/shape/价格 | 门控非硬内存限 |
| 退出 | 配置/日志留存未知 | 清前后缀/还原 | 不能撤已发送内容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 请求解释 | 投影/fold/细节UI | 分类误差/诊断节时 |
| 费用参考 | usage/价格映射 | 当前价格与完整账单 |
| 资源控制 | 裁剪/串行/缓存 | 峰值/长会话体验 |
| 提示词配置 | 真section动态读取 | Host跨会话/用户作用域 |

> **思考**：[Q03](#research-q03)估算、部分价格覆盖、冷读缺失与旧Host零值不可当账单；[Q04](#research-q04)提示词会改变行为，接口/配置权限继承Host未验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)把事件分类、请求/来源与按需详情接到同屏诊断；[Q03](#research-q03)摘要/冷读门控/裁剪/失败提示帮助控制部分负担。

[Q02](#research-q02)head/按需详情与revision释放有用；[Q03](#research-q03)覆盖和缺失需解释；[Q04](#research-q04)观察界面与行为注入须分开核。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)估算、部分价格覆盖、冷读缺失与旧Host零值不可当账单；[Q04](#research-q04)提示词会改变行为，接口/配置权限继承Host未验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)私有隔离profile、空前后缀做单请求对照，缺失/权限不明回日志；共享Host先核外部认证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持事件诊断与系统提示词配置接线；仅私有隔离环境受限试用，精度/收益/共享Host边界待验。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/client/components/contextView.tsx、src/client/components/detailNote.tsx、src/client/cost.ts、src/client/index.ts、src/client/modelPrices.ts、src/client/sessionData.ts、src/client/settings.ts、src/client/timelineSource.ts、src/host/coldRead.ts、src/host/config.ts、src/host/connection.ts、src/host/detail.ts、src/host/fallback.ts、src/host/fold.ts、src/host/foldState.ts、src/host/index.ts、src/host/promptInjection.ts、src/host/snapshotRoute.ts、src/host/timeline.ts、src/shared/estimate.ts、src/shared/version.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧12findings重核；本轮核host加载/投影、assistant事件折叠、代表detail/snapshot POST、客户端取数/浏览器及缺失提示、估算/usage/代表价格计算/冷读裁剪、ConfigForms与prompt section；未全审396文件、Fleet/附件/余额/所有外部请求、DSH认证/配置/系统提示词内部或发行物。
- 下一步：只读固定源码，不安装/执行目标、Host、请求/模型或测试；无计量误差、账单、资源/收益和共享部署安全独立验证。

**分析版本**

- **仓库**：[bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context)
- **版本号**：0.82.0（[固定提交 9a48892](https://github.com/bowenliang123/dsh-context/tree/9a4889246ef83d2de0be32554a7c74c7d72674b7)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)在已有提示基础上补逐请求覆盖收据，先对比人工核查清单/小修是否降误判，非已有验证。

只读固定源码，不安装/执行目标、Host、请求/模型或测试；无计量误差、账单、资源/收益和共享部署安全独立验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 886 | — | — | 16134 |
| .ts | source | 115 | 18342 | 16791 | 121 | — |
| .mjs | source | 4 | 209 | 187 | 0 | — |
| .tsx | source | 58 | 13080 | 12375 | 89 | — |
| .ts | test | 210 | 49494 | 45546 | 231 | — |
| .js | example | 3 | 9 | 9 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 73](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=73&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 77](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=77&color=737b86&logo=github)](https://github.com/bowenliang123/dsh-context/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核官方投影/事件折叠/按需详情和计费缺口，区分诊断与提示词副作用、Host安全继承。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么用户需要它，原生计量与插件贡献怎样区分？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

dsh-context 0.82.0是DSH原生上下文诊断插件，宿主半部注册会话投影、Web半部挂Context/Fleet/侧栏及命令；不是独立Agent或模型。需要解释长会话为何膨胀、哪个请求/工具/技能贡献占用的DSH用户，可按请求查构成和变化。成功是能回指日志与usage解释已知异常，而不是环形图好看、显示费用就等账单。

基线是宿主原有contextPressure/contextBreakdown/tokenUsage及原始日志/供应商usage手工核查；这些官方计量是继承能力。插件增量是事件折叠、摘要/按需详情及同屏导航，不主张创造精确tokenizer、真实省钱或完整治理生命周期。包声明Node^22.19或>=24、DSH版本/peer条件、Apache-2.0，DSH/client服务和日志是必要依赖；发行物及当前Host组合未运行。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-29](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/package.json#L1-L29)

当前身份/版本/Node/DSH入口。

<details>
<summary>查看原文（29行）</summary>

```text
{
  "name": "dsh-context",
  "version": "0.82.0",
  "description": "A DeepSeek Harness plugin for context insight and management, with context dashboard and context command, for understanding how the context is made of, and how it evolves.",
  "icon": "icon.svg",
  "author": "bowenliang123",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/bowenliang123/dsh-context.git"
  },
  "homepage": "https://github.com/bowenliang123/dsh-context",
  "bugs": {
    "url": "https://github.com/bowenliang123/dsh-context/issues"
  },
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.2 || >=0.2.1-rc.2 || >=0.2.2-rc.1"
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

**依据 2 · 源码核查**：[package.json:56-98](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/package.json#L56-L98)

DSH bundle/client/许可及peer条件。

<details>
<summary>查看原文（43行）</summary>

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
        "0.2.0-rc.2+": "compatible",
        "0.2.1-rc.2+": "compatible",
        "0.2.2-rc.1+": "compatible"
      }
    }
  },
  "keywords": [
    "deepseek-harness",
    "dsh",
    "cordis",
    "plugin",
    "context",
    "token",
    "ui"
  ],
  "license": "Apache-2.0",
  "dependencies": {
    "zod": "4.4.3"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4 || >=4.0.6-alpha.2 <5.0.0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.2.0-rc.2 || >=0.2.1-rc.2 || >=0.2.2-rc.1",
    "@deepseek-ai/dsh-session": ">=0.2.0-rc.2 || >=0.2.1-rc.2 || >=0.2.2-rc.1",
    "@deepseek-ai/schemastery": "^3.18.2 || >=3.18.6-alpha.2 <4.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-6](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/cordis.patch.yml#L1-L6)

实际host包加载patch。

```text
# Bundle patch layer: the row loads the package's main entry as the host half
# (a plain Cordis plugin); the `dsh.client` declaration makes the web app load
# its ./client bundle as the browser half.
- insert:
    - id: dsh-context
      name: dsh-context
```

**依据 4 · 源码核查**：[src/host/index.ts:24-55](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/index.ts#L24-L55)

宿主实际服务/注册/版本与注入链。

<details>
<summary>查看原文（32行）</summary>

```text
export const name = 'dsh-context'

export const inject = ['sessionProjections']

export { Config } from './config'
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
  const gate = createDetailGate(ctx)
  watchDetailChannel(ctx, resolveBounds(config), coldReads, gate)
  watchCommandPageChannel(ctx, resolveBounds(config), coldReads)
  gate.retain('contextTimeline', ctx.sessionProjections.register(createContextTimelineDefinition(config, () => gate.live)))
  ctx.sessionProjections.register(createContextHeadersDefinition(name => attribution.ownerOf(name)))
  ctx.sessionProjections.register(createContextActivityDefinition())
  watchTimelineRowSweep(ctx)
  watchActivityBackfill(ctx, coldReads)
  watchSnapshotRoute(ctx)
  watchPromptInjection(ctx, config)
}
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:61-108](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/index.ts#L61-L108)

实际tab/sidebar/Fleet/命令/modal/overview挂载。

<details>
<summary>查看原文（48行）</summary>

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
      props => h(ContextModal, props),
    )
  })

  const OverviewPanel = makeOverviewPanel(ctx, kit, settings)
  ctx.effect(() => watchInsightPage(
    ctx,
    settings,
    props => h(OverviewPanel, props as unknown as Parameters<typeof OverviewPanel>[0]),
    t,
    NS,
  ), 'dsh-context: insight page')
```

</details>

**依据 6 · 源码核查**：[src/client/sessionData.ts:13-21](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/sessionData.ts#L13-L21)

官方压力/拆分/usage来自宿主投影。

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

#### 缺口

- 实际宿主、发行物、诊断需求与节时未独立验证。
  **影响**：源码接线不等已安装可用或净收益。
  **进一步探讨**：隔离profile用一个已知膨胀请求对照原生总量与日志。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 事件怎样到达请求详情，何处会返回缺失？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

host apply注册contextTimeline：init状态，applyTimeline折叠SessionEvent，wire按详情通道是否就绪输出精简head或完整view。assistant/message真实把估算分类快照和usage独立记到requests，按模型/供应商累积费用桶；不是截获网络原始请求或服务商账单。

客户端ContextView使用useContextSession，读取官方投影及useTimelineSource；按sessionId POST detail。host对活跃session用gate状态/DetailShadow，冷session走sessionObserve projectionMode:none→foldLog→buildTimelineDetail，revision+persistence缓存最多4份并finally dispose observation。JSON坏/无ID有错误，未知服务或无state/null读数返回value:null，不表示真实零使用量。

客户端区分HTTP/协议失败、null与合法详情，用版本接受/追赶和加载失败重试，实际ContextBrowser接data/headers/content函数，趋势空数据时显示loading/failed或真正empty。这是诊断接线的工程贡献；细节内容仍受宿主日志/投影保留及shape限制，未全审Fleet/所有附件/外部内容通道。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/timeline.ts:319-332](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/timeline.ts#L319-L332)

真实init/apply/wire投影。

<details>
<summary>查看原文（14行）</summary>

```text
export function createContextTimelineDefinition(config: Config, slim: () => boolean): WiredProjection<'contextTimeline', TimelineState> {
  const bounds = resolveBounds(config)
  const headBounds: FoldBounds = { ...bounds, headOnly: true }
  const view = (state: TimelineState): ContextTimeline =>
    slim() ? buildTimelineHead(state) : buildTimelineView(state, bounds)
  const definition: WiredProjection<'contextTimeline', TimelineState> = {
    key: 'contextTimeline',
    stateSchema: timelineStateSchema,
    wire: { viewSchema: contextTimelineSchema, view, summary: false },
    init: () => createTimelineState(),
    apply: (state: TimelineState, event: SessionEvent) => applyTimeline(state, event as Parameters<typeof applyTimeline>[1], headBounds),
    stateVersion: TIMELINE_STATE_VERSION,
  }
  return definition
```

</details>

**依据 2 · 源码核查**：[src/host/fold.ts:746-788](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/fold.ts#L746-L788)

实际请求估算与供应商usage分开记录。

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

**依据 3 · 源码核查**：[src/host/detail.ts:100-162](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/detail.ts#L100-L162)

真实活跃/冷读/缓存/释放/失败返回。

<details>
<summary>查看原文（63行）</summary>

```text
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
          const state = gate.stateOf(session, 'contextTimeline') as TimelineState | undefined
          if (state === undefined) return reply({ ok: true, value: null })
          if (headOnly) return reply({ ok: true, value: headPayloadOf(state) })
          const detailState = await shadow.stateOf(sessionId)
          if (detailState === null) return reply({ ok: true, value: null })
          return reply({ ok: true, value: buildTimelineDetail(detailState, bounds) })
        }
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
              const detail = buildTimelineDetail(state, bounds)
              payloads.delete(sessionId)
              payloads.set(sessionId, { persistence, revision, value: detail })
              for (const oldest of payloads.keys()) {
                if (payloads.size <= PAYLOAD_CACHE_MAX) break
                payloads.delete(oldest)
              }
              return headOnly ? headOfDetail(detail) : detail
            }
            if (headOnly) return headPayloadOf(state)
            return buildTimelineDetail(state, bounds)
          } finally {
            const dispose = (observation as { [Symbol.dispose]?: unknown } | null)?.[Symbol.dispose]
            if (typeof dispose === 'function') dispose.call(observation)
          }
        })
        return reply({ ok: true, value: value ?? null })
      } catch (err) {
        return failure('gateway/internal', err instanceof Error ? err.message : String(err))
```

</details>

**依据 4 · 源码核查**：[src/client/components/contextView.tsx:121-126](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/components/contextView.tsx#L121-L126)

实际view使用session数据。

```text
  function ContextViewBody(props: ContextViewProps): ReactElement {
    const sessionId = props.sessionId
    const inSidebar = props.host === 'sidebar'
    const { source, data, pressure, breakdown, usage } = useContextSession(props)
    const headers = projectionOf(props, 'contextHeaders', headersOf)
    const [selectedSeq, setSelectedSeq] = useState<number | null>(null)
```

**依据 5 · 源码核查**：[src/client/sessionData.ts:13-21](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/sessionData.ts#L13-L21)

session数据真实合成。

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

**依据 6 · 源码核查**：[src/client/timelineSource.ts:19-36](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/timelineSource.ts#L19-L36)

真实POST及错误/null解析。

<details>
<summary>查看原文（18行）</summary>

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
  }
```

</details>

**依据 7 · 源码核查**：[src/client/timelineSource.ts:201-245](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/timelineSource.ts#L201-L245)

实际版本接受/追赶及失败状态。

<details>
<summary>查看原文（45行）</summary>

```text
  private async fire(): Promise<void> {
    if (this.inFlight) return
    if (this.fetcher === undefined) {
      this.failed = true
      this.emit()
      return
    }
    this.inFlight = true
    this.targetRev = this.wantedRev
    const background = this.background
    const generation = this.generation
    this.emit()
    try {
      const d = await this.fetcher()
      if (generation !== this.generation) return
      if (d !== null) {
        if (d.rev >= this.acceptedRev || d.rev === this.targetRev) {
          this.detail = d
          this.bytes = detailBytesOf(d)
          this.acceptedRev = d.rev
        }
        if (d.rev >= this.acceptedRev && d.rev < this.targetRev) {
          this.wantedRev = d.rev
          if (this.listeners.size > 0 && this.catchUpTarget !== this.targetRev) {
            this.catchUpTarget = this.targetRev
            this.clearCatchUp()
            const target = this.targetRev
            this.catchUp = setTimeout(() => {
              this.catchUp = null
              if (this.detail === null || this.acceptedRev < target) {
                this.wantedRev = target
                void this.fire()
              }
            }, CATCH_UP_MS)
          }
        }
        this.failures = 0
        this.failed = false
      } else {
        this.wantedRev = this.acceptedRev
        this.failed = this.detail === null
        this.failures++
      }
    } catch {
      if (generation === this.generation) {
```

</details>

**依据 8 · 源码核查**：[src/client/components/contextView.tsx:696-701](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/components/contextView.tsx#L696-L701)

实际区分empty与loading/failed。

```text
        {displayRequests.length === 0
          ? (detailReady
            ? <TrendReserved catLabel={catLabel}><div className="lc-empty">{t('trend.empty')}</div></TrendReserved>
            : <TrendReserved catLabel={catLabel}>
              <DetailNote state={source.detailState === 'failed' ? 'failed' : 'loading'} onRetry={source.retryDetail} />
            </TrendReserved>)
```

**依据 9 · 源码核查**：[src/client/components/contextView.tsx:750-766](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/components/contextView.tsx#L750-L766)

浏览器实际接受数据与内容函数。

<details>
<summary>查看原文（17行）</summary>

```text
    const browserCard = (
      <ContextBrowser
        data={data}
        headers={headers}
        convNodes={convNodes}
        fetchContent={fetchContent}
        fetchHeader={fetchHeader}
        previewSeq={hoveredSeq}
        pinSeq={pinnedReq !== null ? pinnedReq.seq : null}
        hoverKey={hoverCat}
        onHoverKey={handleHoverKey}
        onOpenCat={setFocusCat}
        nodeFocus={nodeFocus}
        onNodeFocusHandled={clearNodeFocus}
        loadImage={loadImage}
        openAttachment={openAttachment}
        detailState={source.detailState}
```

</details>

#### 缺口

- 未跑Host/长会话，未全核所有事件及内容/附件通道。
  **影响**：不能保证所有provider请求被完整解释或内容确实无缺。
  **进一步探讨**：固定一项技能/工具/压缩请求，按seq逐条对照日志与UI，记录缺失。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 分类token、费用与冷读降级有哪些具体边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

分类文本按每4字符加overhead估算，assistant事件另读供应商usage；估算分布、计费量和当前窗口压力不可互换。cost用模型价格簿映射，真实加载@opencode-ai/models providers；失败保failed并指数重试。价格计算跳过无匹配模型，只有全无可计时才返回null，所以混合匹配时可只覆盖一部分usage，不能把显示总费用当完整账单。DeepSeek峰时乘2与固定美元/人民币0.15是源码规则，不独立验证当前合约/价格/汇率。

冷读gate单队列串行，V8 heap达到limit的2/3就跳过，测量异常反而放行；这是压力折中，不是硬内存上限。trimState确实裁请求/事件/文件等数组，默认1500step/300turn/400event等，详情可不完整；不能把缺失当零。

能识别且低于baseline的宿主返回unsupported+零值空数组并提前退出主要诊断/提示词注册；未知/不可解析版本不一定阻止（meetsBaseline返回true）。界面已有UpgradeGate和加载失败/重试提示，不能把已有缺失标记说成全无，但也不证明每项缺失来源都足够可见。

#### 证据与依据

**依据 1 · 源码核查**：[src/shared/estimate.ts:1-31](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/shared/estimate.ts#L1-L31)

实际字符密度/overhead估算。

<details>
<summary>查看原文（31行）</summary>

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
}

export function estimateSystemContent(blocks: unknown): number {
  if (!Array.isArray(blocks) || blocks.length === 0) return 0
  let characters = 0
  for (const block of blocks) {
    const text = block !== null && typeof block === 'object' && (block as { type?: unknown }).type === 'text'
      ? (block as { text?: unknown }).text
      : undefined
    if (typeof text === 'string') {
      characters += text.length
      continue
    }
    try {
      const json: unknown = JSON.stringify(block)
      if (typeof json === 'string') characters += json.length
    } catch {
    }
  }
  return Math.ceil(characters / CHARS_PER_TOKEN) + ROLE_OVERHEAD
```

</details>

**依据 2 · 源码核查**：[src/host/fold.ts:769-785](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/fold.ts#L769-L785)

真实供应商usage与费用桶输入。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/client/modelPrices.ts:53-88](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/modelPrices.ts#L53-L88)

真实外部模型价格加载/失败重试。

<details>
<summary>查看原文（36行）</summary>

```text
const defaultLoader: Loader = () => Models.make().providers()

const RETRY_BASE_MS = 30_000

let loader: Loader = defaultLoader
let snap: ModelPricesSnap = { book: null, failed: false }
let inFlight = false
let failures = 0
let timer: ReturnType<typeof setTimeout> | null = null
const listeners = new Set<() => void>()

function fail(): void {
  snap = { ...snap, failed: true }
  failures++
  timer = setTimeout(() => {
    timer = null
    if (listeners.size === 0) return
    void fire()
  }, RETRY_BASE_MS * 2 ** Math.min(failures - 1, 3))
}

async function fire(): Promise<void> {
  inFlight = true
  try {
    const book = pricesBookOf(await loader())
    if (book !== null) {
      snap = { book, failed: false }
      failures = 0
    } else {
      fail()
    }
  } catch {
    fail()
  }
  inFlight = false
  for (const fn of listeners) fn()
```

</details>

**依据 4 · 源码核查**：[src/client/cost.ts:15-19](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/cost.ts#L15-L19)

固定换算/峰时因子。

```text
export type CostCurrency = 'usd' | 'cny'

const USD_PER_CNY = 0.15

const PEAK_FACTOR = 2
```

**依据 5 · 源码核查**：[src/client/cost.ts:361-387](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/cost.ts#L361-L387)

实际跳过未匹配价格与部分总计。

<details>
<summary>查看原文（27行）</summary>

```text
export function estimateSessionCost(
  usage: SessionCostUsage | null | undefined,
  book: ModelBook | null | undefined,
  currency: CostCurrency,
): number | null {
  if (usage === null || usage === undefined || book === null || book === undefined) return null
  let total = 0
  let any = false
  for (const provider of Object.keys(usage)) {
    const models = asRecord(usage[provider])
    if (models === null) continue
    const deepseek = isDeepSeekProvider(provider)
    for (const model of Object.keys(models)) {
      const rate = priceOf(book, provider, model)
      const periods = asRecord(models[model])
      if (rate === null || periods === null) continue
      for (const period of ['peak', 'off'] as const) {
        const bucket = asRecord(periods[period])
        if (bucket === null) continue
        const price = (numOf(bucket.cacheRead) * rate.hit + numOf(bucket.uncached) * rate.miss
          + numOf(bucket.cacheWrite) * rate.write + numOf(bucket.output) * rate.out) / 1e6
        total += deepseek && period === 'peak' ? price * PEAK_FACTOR : price
        any = true
      }
    }
  }
  return any ? toCurrency(total, currency) : null
```

</details>

**依据 6 · 源码核查**：[src/host/coldRead.ts:12-37](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/coldRead.ts#L12-L37)

真实2/3高水位/串行与异常放行。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 7 · 源码核查**：[src/host/config.ts:4-13](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/config.ts#L4-L13)

默认保留上限。

<details>
<summary>查看原文（10行）</summary>

```text
export const DEFAULT_BOUNDS = {
  maxRequestSteps: 1500,
  maxKeptTurns: 300,
  maxEvents: 400,
  maxNodes: 2000,
  maxArchiveNodes: 400,
  maxFileOps: 400,
  maxCommands: 400,
  maxCommandChars: 4096,
}
```

</details>

**依据 8 · 源码核查**：[src/host/foldState.ts:217-232](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/foldState.ts#L217-L232)

真实裁请求/事件/文件记录。

<details>
<summary>查看原文（16行）</summary>

```text
export function trimState(st: TimelineState, bounds: FoldBounds): void {
  st.turnRuns = st.turnRuns ?? countTurnRuns(st.requests)
  if (st.turnRuns > bounds.maxKeptTurns) {
    st.requests = trimToLastTurns(st.requests, bounds.maxKeptTurns)
    st.turnRuns = countTurnRuns(st.requests)
  }
  if (st.requests.length > bounds.maxRequestSteps) {
    st.requests = st.requests.slice(-bounds.maxRequestSteps)
    st.turnRuns = countTurnRuns(st.requests)
  }
  if (st.events.length > bounds.maxEvents) st.events = st.events.slice(-bounds.maxEvents)
  if (st.spans.length > TIMING_SPANS_MAX) st.spans = st.spans.slice(-TIMING_SPANS_MAX)
  if (st.fileOps.length > bounds.maxFileOps) {
    const drop = st.fileOps.length - bounds.maxFileOps
    st.fileOpsFloor = Math.max(st.fileOpsFloor ?? 0, st.fileOps[drop - 1].seq)
    st.fileOps = st.fileOps.slice(drop)
```

</details>

**依据 9 · 源码核查**：[src/host/fallback.ts:35-53](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/fallback.ts#L35-L53)

实际unsupported/零值空数组。

<details>
<summary>查看原文（19行）</summary>

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
}

export function createFallbackHeadersDefinition() {
  return fallbackDefinition('contextHeaders', contextHeadersSchema, { headers: [] })
}

export function createFallbackActivityDefinition() {
  return fallbackDefinition('contextActivity', contextActivitySchema, { days: {} })
```

</details>

**依据 10 · 源码核查**：[src/host/index.ts:36-42](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/index.ts#L36-L42)

识别旧宿主提前返回。

```text
  const harnessVersion = detectHarnessVersion(ctx)
  if (harnessVersion !== undefined && !meetsBaseline(harnessVersion)) {
    ctx.sessionProjections.register(createFallbackTimelineDefinition(harnessVersion) as never)
    ctx.sessionProjections.register(createFallbackHeadersDefinition() as never)
    ctx.sessionProjections.register(createFallbackActivityDefinition() as never)
    return
  }
```

**依据 11 · 源码核查**：[src/shared/version.ts:37-41](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/shared/version.ts#L37-L41)

无法解析版本放行。

```text
export function meetsBaseline(version: string, baseline: string = BASELINE_DSH_VERSION): boolean {
  const v = parseVersion(version)
  const b = parseVersion(baseline)
  if (v === null || b === null) return true
  return compareParsed(v, b) >= 0
```

**依据 12 · 源码核查**：[src/client/components/contextView.tsx:875-879](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/components/contextView.tsx#L875-L879)

真实升级提示挂载。

```text
        <div className="lc-foot">{t('footer')}</div>

        {gate !== null && (
          <UpgradeGate sessionId={sessionId} current={gate.current} minimum={gate.minimum} />
        )}
```

**依据 13 · 源码核查**：[src/client/components/detailNote.tsx:15-23](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/components/detailNote.tsx#L15-L23)

实际loading/failed重试展示。

```text
    const cls = props.className ?? 'lc-empty'
    if (props.state === 'loading') return <div className={cls}>{t('detail.loading')}</div>
    return (
      <div className={cls}>
        {props.onRetry !== undefined
          ? <button type="button" className="lc-br-retry hover:brightness-[1.15]" onClick={props.onRetry}>{t('detail.loadFailed')}</button>
          : t('detail.loadFailed')}
      </div>
    )
```

#### 缺口

- 分类误差、混合模型费用覆盖率、Host兼容与资源峰值未测。
  **影响**：不能用于财务结算、硬预算或无缺失保证。
  **进一步探讨**：对照服务商usage/账单，加入无价格模型和高水位/旧Host样本，明确覆盖范围。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 它只是读诊断吗，谁控制提示词与详情访问？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

不只是观察：Config的promptPrefix/promptSuffix默认空，watchPromptInjection在systemPrompt服务存在时注册prefix/suffix section，分别排HARNESS_IDENTITY前/DEPLOYMENT_PERSONA_SUFFIX后，liveText动态读配置，空白变空且interpolate:false。它把配置文本交给宿主系统提示词组装，不是每次人审；作者说明对所有Agent含子Agent、下一轮生效，实际跨会话作用由宿主systemPrompt/config语义决定，本轮未全审Host。

客户端设置先乐观publish，再通过所附ConfigForms scope.set写，失败sync真值；不是另建按会话隔离的提示词存储。隐藏Context/Fleet入口只是显示开关，不等停host投影或清prefix。撤销先清空两项并核下一请求，既往请求/日志不会被改回。

详情/快照路由经宿主connection.fetch.register POST注册，插件handler自身无request用户/principal检查：detail按输入sessionId取活跃/持久会话，snapshot调用listSessions并返回挑选keys。接口是否只供授权用户、sessionQuery/Observe是否带可见性，依赖外部Host，不能据插件没有检查直接断言公网越权，也不能替宿主保证多用户隔离。内容含系统/消息/工具细节，应先私有profile、空prefix并确认宿主边界；未全审balance等外部通道。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/config.ts:39-51](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/config.ts#L39-L51)

显示选项与提示词默认空。

<details>
<summary>查看原文（13行）</summary>

```text
  defaultPlacement: volatileField(z.union(['all', 'tab', 'sidebar', 'hide']).default('all').loose()),
  defaultGranularity: volatileField(z.union(['step', 'turn']).default('step').loose()),
  defaultTrendMode: volatileField(z.union(['total', 'delta']).default('total').loose()),
  defaultDeltaBase: volatileField(z.union(['step', 'turn']).default('step').loose()),
  defaultToolSort: volatileField(z.union(['size', 'count', 'name']).default('count').loose()),
  defaultFileSort: volatileField(z.union(['count', 'lines', 'latest', 'path', 'name']).default('lines').loose()),
  insightsEntry: volatileField(z.union(['show', 'hide']).default('show').loose()),
  defaultDurationCurve: volatileField(z.union(['show', 'hide']).default('show').loose()),
  overviewAutoSteps: volatileField(z.union(['100', '200', '300', 'off']).default('100').loose()),
  defaultOverviewRange: volatileField(z.union(['today', '7d', '30d', 'all']).default('30d').loose()),
  fleetTab: volatileField(z.union(['show', 'hide']).default('show').loose()),
  promptPrefix: volatileField(z.string().default('').loose()),
  promptSuffix: volatileField(z.string().default('').loose()),
```

</details>

**依据 2 · 源码核查**：[src/host/promptInjection.ts:14-52](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/promptInjection.ts#L14-L52)

真实动态读取/空白处理和systemPrompt section注册。

<details>
<summary>查看原文（39行）</summary>

```text
function liveText(value: unknown): () => string {
  if (value !== null && typeof value === 'object' && typeof (value as { get?: unknown }).get === 'function') {
    const get = (value as { get: () => unknown }).get
    return () => {
      const text = get()
      return typeof text === 'string' ? text : ''
    }
  }
  const text = typeof value === 'string' ? value : ''
  return () => text
}

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

**依据 3 · 源码核查**：[src/client/index.ts:110-129](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/index.ts#L110-L129)

ConfigForms真实绑定/配置卡写入口。

<details>
<summary>查看原文（20行）</summary>

```text
  const cardFace = (): {
    hooks: { contextSettings: typeof settings.store }
    set: (field: SettingsField, value: string) => void
  } => ({
    hooks: { contextSettings: settings.store },
    set: (field, value) => { settings.set(field, value) },
  })

  ctx.inject(['configForms'], (raw) => {
    const c = raw as ClientCtx & { configForms?: ConfigFormsFace }
    const forms = c.configForms
    if (forms === undefined || typeof forms.get !== 'function' || typeof forms.whileServed !== 'function') return
    c.effect(() => settings.attach(forms.get(NS)), 'dsh-context: config forms')
    const PluginConfigCard = makePluginConfigCard(kit)
    c.effect(() => forms.whileServed([NS], () => {
      return c.slots.inject('plugins.bundle.config', () => {
        return c.slots.register(
          { name: 'plugins.bundle.config', key: NS, locale: NS, inject: cardFace },
          props => h(PluginConfigCard, props as unknown as Parameters<typeof PluginConfigCard>[0]),
        )
```

</details>

**依据 4 · 源码核查**：[src/client/settings.ts:150-168](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/settings.ts#L150-L168)

实际乐观更新/宿主scope写失败回读。

<details>
<summary>查看原文（19行）</summary>

```text
      sync(bound)
      const unsubscribe = bound.subscribe(() => { sync(bound) })
      return () => {
        unsubscribe()
        if (scope === bound) scope = undefined
      }
    },
    set(field, value) {
      publish({ ...state, ...prefsOf({ [field]: value }) })
      const bound = scope
      if (bound === undefined) return
      void bound.set(field, value).catch(() => {
        const truth = sync(bound)
        const refused: Partial<SettingsState> = {}
        if (field === 'defaultPlacement' && truth.placement === undefined) refused.placement = 'all'
        else if (field === 'insightsEntry' && truth.insightsEntry === undefined) refused.insightsEntry = 'show'
        else if (field === 'fleetTab' && truth.fleetTab === undefined) refused.fleetTab = 'show'
        if (Object.keys(refused).length > 0) publish({ ...state, ...refused })
      })
```

</details>

**依据 5 · 源码核查**：[src/host/connection.ts:22-36](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/connection.ts#L22-L36)

真实POST注册继承Host。

<details>
<summary>查看原文（15行）</summary>

```text
export function registerPostRoute(
  c: EffectScope,
  connection: ConnectionHostFace | undefined,
  path: string,
  fetch: (request: Request) => Response | Promise<Response>,
  label: string,
): boolean {
  const register = fetchRouteRegistrar(connection)
  if (register === undefined) return false
  try {
    c.effect(() => register({ path, methods: ['POST'], requestBody: 'buffered', fetch }), label)
  } catch {
    return false
  }
  return true
```

</details>

**依据 6 · 源码核查**：[src/host/detail.ts:100-128](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/detail.ts#L100-L128)

真实请求仅解析sessionId后查会话/observe。

<details>
<summary>查看原文（29行）</summary>

```text
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
          const state = gate.stateOf(session, 'contextTimeline') as TimelineState | undefined
          if (state === undefined) return reply({ ok: true, value: null })
          if (headOnly) return reply({ ok: true, value: headPayloadOf(state) })
          const detailState = await shadow.stateOf(sessionId)
          if (detailState === null) return reply({ ok: true, value: null })
          return reply({ ok: true, value: buildTimelineDetail(detailState, bounds) })
        }
        const observe = observeFaceOf(ctx)
        if (observe === undefined) return reply({ ok: true, value: null })
        const value = await coldReads.admit(async () => {
          const observation = await observe(sessionId, { projectionMode: 'none' })
```

</details>

**依据 7 · 源码核查**：[src/host/snapshotRoute.ts:58-97](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/snapshotRoute.ts#L58-L97)

实际listSessions与keys回包，无插件请求身份判断。

<details>
<summary>查看原文（40行）</summary>

```text
    const handler = async (request: Request): Promise<Response> => {
      let wanted: Set<string> | undefined
      try {
        const body = (await request.json()) as unknown
        wanted = body !== null && typeof body === 'object' ? wantedIdsOf(body as Record<string, unknown>) : undefined
      } catch {
        return failure('dsh-context/bad-request', 'body is not JSON')
      }
      try {
        const records = await listSessions()
        if (!Array.isArray(records)) return reply({ ok: true, value: {} })
        const values: Record<string, Record<string, unknown>> = {}
        for (const record of records as (ListRecordLike | null)[]) {
          const header = asRecord(record?.header)
          const id = typeof header?.id === 'string' ? header.id : undefined
          if (id === undefined || (wanted !== undefined && !wanted.has(id))) continue
          let block: SnapshotBlockLike | undefined
          try {
            const session = getSession(id)
            block = session !== undefined
              ? snapshotOf(session, SNAPSHOT_KEYS)
              : cachedOf(header, SNAPSHOT_KEYS)
          } catch {
            continue
          }
          const served = asRecord(block?.values)
          if (served === null) continue
          const picked: Record<string, unknown> = {}
          for (const key of SNAPSHOT_KEYS) {
            if (served[key] !== undefined) picked[key] = served[key]
          }
          if (Object.keys(picked).length > 0) values[id] = picked
        }
        return reply({ ok: true, value: values })
      } catch (err) {
        return failure('gateway/internal', err instanceof Error ? err.message : String(err))
      }
    }

    if (!registerPostRoute(c, c.get('connection') as ConnectionHostFace | undefined, SNAPSHOT_ROUTE, handler, 'dsh-context: snapshot route')) return
```

</details>

**依据 8 · 作者声明**：[README.md:221-221](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/README.md#L221-L221)

作者部署级/全部Agent、下一轮与清空停用说明，Host语义未独立验证。

```text
**System Prompt · Prefix / Suffix** 行用于填写自由文本，并将其拼接到每个会话系统提示词的最前面 / 最后面，对所有 Agent（包括子 Agent）生效——它们是随 Harness 自身提示词组装流程一同应用的部署级角色设定或行为规则。修改从下一轮开始生效；将某行留空即可停用对应设置。
```

#### 缺口

- 当前Host配置权限、路由认证、跨用户session可见性和systemPrompt作用域未独立核查。
  **影响**：不能宣称共享部署安全或前后缀仅改当前会话；采用限私有隔离环境。
  **进一步探讨**：核Host认证/配置scope，两个无敏感测试用户检查不可见会话与prefix生效范围，未清楚先不共享。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何用一次诊断决定是否保留，失败与退出成本是什么？

**研究主题**：采用判断、效果与总成本

#### 完整回答

有长会话构成诊断需求且能读日志的DSH用户可受限试用：备份配置，在私有隔离profile确认宿主版本/路由归属，前后缀保持空；选一条已知含技能/工具/压缩的请求，比较原生压力/usage、日志seq与插件详情/成本覆盖。可解释来源是成功判据，图表一致只说明同源而非独立精度验证。

首次安装/版本/配置/数据核对、持续投影/日志冷读/价格簿网络/浏览器内存及人工归因、故障缺失重读/版本回退，退出清配置/撤注册/日志留存等现金资源与工时未知，不填0或许诺节省。已有串行/裁剪/缓存仅降低部分压力，不保证峰值。

遇unsupported、详情缺失、费用只覆盖部分模型、前后缀意外生效或访问边界不清，停止用显示数值结算/决策并回宿主日志/供应商usage。退出先清空prefix/suffix核后续请求，再按宿主管理卸载/还原配置；旧日志与已发送模型内容不能靠隐藏入口/卸载撤回，清理效果需查宿主。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:29-55](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/index.ts#L29-L55)

注册和版本分支决定功能。

<details>
<summary>查看原文（27行）</summary>

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
  const gate = createDetailGate(ctx)
  watchDetailChannel(ctx, resolveBounds(config), coldReads, gate)
  watchCommandPageChannel(ctx, resolveBounds(config), coldReads)
  gate.retain('contextTimeline', ctx.sessionProjections.register(createContextTimelineDefinition(config, () => gate.live)))
  ctx.sessionProjections.register(createContextHeadersDefinition(name => attribution.ownerOf(name)))
  ctx.sessionProjections.register(createContextActivityDefinition())
  watchTimelineRowSweep(ctx)
  watchActivityBackfill(ctx, coldReads)
  watchSnapshotRoute(ctx)
  watchPromptInjection(ctx, config)
}
```

</details>

**依据 2 · 源码核查**：[src/host/config.ts:39-51](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/config.ts#L39-L51)

空prefix/suffix初值。

<details>
<summary>查看原文（13行）</summary>

```text
  defaultPlacement: volatileField(z.union(['all', 'tab', 'sidebar', 'hide']).default('all').loose()),
  defaultGranularity: volatileField(z.union(['step', 'turn']).default('step').loose()),
  defaultTrendMode: volatileField(z.union(['total', 'delta']).default('total').loose()),
  defaultDeltaBase: volatileField(z.union(['step', 'turn']).default('step').loose()),
  defaultToolSort: volatileField(z.union(['size', 'count', 'name']).default('count').loose()),
  defaultFileSort: volatileField(z.union(['count', 'lines', 'latest', 'path', 'name']).default('lines').loose()),
  insightsEntry: volatileField(z.union(['show', 'hide']).default('show').loose()),
  defaultDurationCurve: volatileField(z.union(['show', 'hide']).default('show').loose()),
  overviewAutoSteps: volatileField(z.union(['100', '200', '300', 'off']).default('100').loose()),
  defaultOverviewRange: volatileField(z.union(['today', '7d', '30d', 'all']).default('30d').loose()),
  fleetTab: volatileField(z.union(['show', 'hide']).default('show').loose()),
  promptPrefix: volatileField(z.string().default('').loose()),
  promptSuffix: volatileField(z.string().default('').loose()),
```

</details>

**依据 3 · 源码核查**：[src/host/detail.ts:125-160](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/detail.ts#L125-L160)

冷读/缓存/释放资源路径。

<details>
<summary>查看原文（36行）</summary>

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
              const detail = buildTimelineDetail(state, bounds)
              payloads.delete(sessionId)
              payloads.set(sessionId, { persistence, revision, value: detail })
              for (const oldest of payloads.keys()) {
                if (payloads.size <= PAYLOAD_CACHE_MAX) break
                payloads.delete(oldest)
              }
              return headOnly ? headOfDetail(detail) : detail
            }
            if (headOnly) return headPayloadOf(state)
            return buildTimelineDetail(state, bounds)
          } finally {
            const dispose = (observation as { [Symbol.dispose]?: unknown } | null)?.[Symbol.dispose]
            if (typeof dispose === 'function') dispose.call(observation)
          }
        })
        return reply({ ok: true, value: value ?? null })
```

</details>

**依据 4 · 源码核查**：[src/client/modelPrices.ts:53-88](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/modelPrices.ts#L53-L88)

价格簿网络/重试。

<details>
<summary>查看原文（36行）</summary>

```text
const defaultLoader: Loader = () => Models.make().providers()

const RETRY_BASE_MS = 30_000

let loader: Loader = defaultLoader
let snap: ModelPricesSnap = { book: null, failed: false }
let inFlight = false
let failures = 0
let timer: ReturnType<typeof setTimeout> | null = null
const listeners = new Set<() => void>()

function fail(): void {
  snap = { ...snap, failed: true }
  failures++
  timer = setTimeout(() => {
    timer = null
    if (listeners.size === 0) return
    void fire()
  }, RETRY_BASE_MS * 2 ** Math.min(failures - 1, 3))
}

async function fire(): Promise<void> {
  inFlight = true
  try {
    const book = pricesBookOf(await loader())
    if (book !== null) {
      snap = { book, failed: false }
      failures = 0
    } else {
      fail()
    }
  } catch {
    fail()
  }
  inFlight = false
  for (const fn of listeners) fn()
```

</details>

**依据 5 · 源码核查**：[src/host/promptInjection.ts:35-52](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/promptInjection.ts#L35-L52)

提示词真实作用注册。

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

- 真实诊断正确率、净节时、费用与卸载撤注册/缓存清理未测。
  **影响**：试用限解释性诊断，不能据热度升级推荐。
  **进一步探讨**：记录一次诊断错误/人时/内存/缺失和人工日志基线，持续净收益才保留。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 比继续加图表更值得验证的方向是什么？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

独立假设：把每次诊断的官方usage、分类估算、价格匹配覆盖及缺失原因/保留边界连成可追溯收据，能减少把部分费用或空明细当完整事实的误判。现有DetailNote/unsupported/price resolution已是基础，不能把“显示缺口”本身当新贡献；增量应是可核覆盖分母与逐请求来源，而非再造计量器。

先比较原插件+人工日志核对清单和小幅补充覆盖标记，再考虑独立产品；固定无价格模型/旧Host/高水位/截断长会话样本，盲测诊断正确率、误以为零/完整的次数和人时。若现有提示已足够、覆盖收据不降错或维护/读日志成本超过收益则推翻，不计本插件已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/cost.ts:361-387](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/cost.ts#L361-L387)

部分可计总量与无匹配跳过带来覆盖问题。

<details>
<summary>查看原文（27行）</summary>

```text
export function estimateSessionCost(
  usage: SessionCostUsage | null | undefined,
  book: ModelBook | null | undefined,
  currency: CostCurrency,
): number | null {
  if (usage === null || usage === undefined || book === null || book === undefined) return null
  let total = 0
  let any = false
  for (const provider of Object.keys(usage)) {
    const models = asRecord(usage[provider])
    if (models === null) continue
    const deepseek = isDeepSeekProvider(provider)
    for (const model of Object.keys(models)) {
      const rate = priceOf(book, provider, model)
      const periods = asRecord(models[model])
      if (rate === null || periods === null) continue
      for (const period of ['peak', 'off'] as const) {
        const bucket = asRecord(periods[period])
        if (bucket === null) continue
        const price = (numOf(bucket.cacheRead) * rate.hit + numOf(bucket.uncached) * rate.miss
          + numOf(bucket.cacheWrite) * rate.write + numOf(bucket.output) * rate.out) / 1e6
        total += deepseek && period === 'peak' ? price * PEAK_FACTOR : price
        any = true
      }
    }
  }
  return any ? toCurrency(total, currency) : null
```

</details>

**依据 2 · 源码核查**：[src/host/detail.ts:125-160](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/detail.ts#L125-L160)

null可能来自服务/数据/门控多种来源。

<details>
<summary>查看原文（36行）</summary>

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
              const detail = buildTimelineDetail(state, bounds)
              payloads.delete(sessionId)
              payloads.set(sessionId, { persistence, revision, value: detail })
              for (const oldest of payloads.keys()) {
                if (payloads.size <= PAYLOAD_CACHE_MAX) break
                payloads.delete(oldest)
              }
              return headOnly ? headOfDetail(detail) : detail
            }
            if (headOnly) return headPayloadOf(state)
            return buildTimelineDetail(state, bounds)
          } finally {
            const dispose = (observation as { [Symbol.dispose]?: unknown } | null)?.[Symbol.dispose]
            if (typeof dispose === 'function') dispose.call(observation)
          }
        })
        return reply({ ok: true, value: value ?? null })
```

</details>

**依据 3 · 源码核查**：[src/client/components/detailNote.tsx:15-23](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/client/components/detailNote.tsx#L15-L23)

已有失败/重试提示，不假装全无。

```text
    const cls = props.className ?? 'lc-empty'
    if (props.state === 'loading') return <div className={cls}>{t('detail.loading')}</div>
    return (
      <div className={cls}>
        {props.onRetry !== undefined
          ? <button type="button" className="lc-br-retry hover:brightness-[1.15]" onClick={props.onRetry}>{t('detail.loadFailed')}</button>
          : t('detail.loadFailed')}
      </div>
    )
```

**依据 4 · 源码核查**：[src/host/fallback.ts:35-45](https://github.com/bowenliang123/dsh-context/blob/9a4889246ef83d2de0be32554a7c74c7d72674b7/src/host/fallback.ts#L35-L45)

已有unsupported标记。

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

- 收据相对现有提示与人工清单的净效果未验证。
  **影响**：只是可证伪方向，不算已实现能力或已证需求。
  **进一步探讨**：用同一故障样本比较误判/人时/资源与维护成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
