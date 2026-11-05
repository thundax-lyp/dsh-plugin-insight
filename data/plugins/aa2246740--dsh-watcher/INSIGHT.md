# DSH Watcher

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[e1fae10](https://github.com/aa2246740/dsh-watcher/tree/e1fae1057228bc1b449c872da14192bac23daa29)

<!-- BEGIN META -->
[![GitHub ★ 124](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=124&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/aa2246740/dsh-watcher) [![npm 30d 2,151](https://img.shields.io/static/v1?label=npm+30d&message=2%2C151&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-watcher) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-watcher)
<!-- END META -->

> **功能**：把宿主会话投影整理为可折叠的工作路径与用量估算

> **亮点**：[Q01](#research-q01) 把工作路径、并行调用和费用估算置于同一检查界面。

> **主要限制**：[Q03](#research-q03) 模型可见推理和价格均依赖现有记录，不能补全缺口。

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
  - [Q01 · 什么交付可以核对？](#detail-section-11)
  - [Q02 · 数据如何取得？](#detail-section-12)
  - [Q03 · 哪些数据不能过度解读？](#detail-section-13)
  - [Q04 · 怎样采用和退出？](#detail-section-14)
  - [Q05 · 哪些结果支持或否定采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长会话排障时需要定位慢步骤或失败调用。

读取原会话和官方 Trajectory。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 读取原会话和官方 Trajectory。 | 可直接比较 | 保留人工步骤 |
| DSH Watcher | 把工作路径、并行调用和费用估算置于同一检查界面。 | 模型可见推理和价格均依赖现有记录，不能补全缺口。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 依宿主会话投影计算步骤和成本，客户端注册可折叠视图。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 长会话排障时需要定位慢步骤或失败调用。 | 保留原流程 |
| 试验 | 依宿主会话投影计算步骤和成本，客户端注册可折叠视图。 | 观察固定版本 |
| 复核 | 以虚构会话核对步骤、估算、可选侧栏及退出。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 缩短在长会话里定位失败工具调用的时间 | 可减少定位时长并保持事件与归类可追溯。 | 以虚构会话核对步骤、估算、可选侧栏及退出。 |

> **思考**：[Q03](#research-q03) 模型可见推理和价格均依赖现有记录，不能补全缺口。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把工作路径、并行调用和费用估算置于同一检查界面。

统计与展示分层，价格缺行有显式状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 模型可见推理和价格均依赖现有记录，不能补全缺口。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 以虚构会话核对步骤、估算、可选侧栏及退出。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的缩短在长会话里定位失败工具调用的时间。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/index.tsx、src/dsh-watcher.ts、src/insights/engine.mjs、src/client/Watcher.tsx、src/insights/pricing.mjs、docs/data-handling.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的缩短在长会话里定位失败工具调用的时间。未执行目标代码或实际宿主验证。
- 下一步：保留事件序号、预期统计和操作轨迹。

**分析版本**

- **仓库**：[aa2246740/dsh-watcher](https://github.com/aa2246740/dsh-watcher)
- **版本号**：0.9.1（[固定提交 e1fae10](https://github.com/aa2246740/dsh-watcher/tree/e1fae1057228bc1b449c872da14192bac23daa29)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可减少定位时长并保持事件与归类可追溯。

保留事件序号、预期统计和操作轨迹。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 978 | — | — | 13776 |
| .cjs | source | 1 | 30 | 29 | 1 | — |
| .js | source | 4 | 11491 | 11246 | 1254 | — |
| .mjs | source | 13 | 2115 | 1976 | 86 | — |
| .ts | source | 16 | 3140 | 2786 | 125 | — |
| .tsx | source | 5 | 5471 | 4980 | 277 | — |
| .mjs | test | 21 | 3103 | 2834 | 52 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/aa2246740/dsh-watcher/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/aa2246740/dsh-watcher/issues?q=is%3Aissue+created%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/aa2246740/dsh-watcher/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：缩短在长会话里定位失败工具调用的时间

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么交付可以核对？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

长工具会话里，用户可从标题栏打开聚合视图，以步骤和并行分支定位调用，并用估算费用辅助筛查异常。基线是直接读会话和官方 Trajectory。验收应能定位同一步骤、同一次调用及结果，且原事件顺序可追溯。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:33-49](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/README.md#L33-L49)

作者描述折叠、归类和可见推理范围

<details>
<summary>查看原文（17行）</summary>

```text
需要 DeepSeek Harness **0.2.1-rc.2**（`@deepseek-ai/dsh@0.2.1-rc.2`，`dsh-v0.2.1-rc.2`）。`@deepseek-ai/dsh-*` 的 peer 与 `engines.dsh` 范围是 `>=0.2.1-rc.1 <0.2.2`：接受 **0.2.1-rc.2** 和稳定版 **0.2.1**，拒绝 alpha，也拒绝 **0.2.0-rc.2**。Node `^22.19.0` 或 `>=24`。

DeepSeek Harness Web 的只读插件。点会话标题栏里的眼睛，把 Session 收成一张能折叠的工作路径：这轮走了几步、跑了几次、花了多久；再展开某一步看并行分支、工具结果，或一条默认折着的推理记录。

它不往对话里塞消息，不编隐藏思维链，也不替代官方 Trajectory。

![从逐项切到归类：两次改 package.json 收成 ×2](docs/screenshots/switch-mode.gif)

![三轮都收着，留下阶段数、执行数和 tok/s](docs/screenshots/collapsed-turns.png)

![第三轮展开：并行步骤还在原来的 Step 里](docs/screenshots/overview.png)

![步骤 2：glob 和 grep 两项并行](docs/screenshots/parallel.png)

![归类：修改 package.json ×2，展开仍是步骤 5 和 6](docs/screenshots/grouped.png)

归类只叠能证明相同的调用。两条不同的 bash 不会被捏在一起。模型阶段只显示供应商已经写进 Session 的可见 reasoning；没有记录就写未记录。
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:23-44](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/src/client/index.tsx#L23-L44)

在会话标题栏和设置中注册入口

<details>
<summary>查看原文（22行）</summary>

```text
  registerModelTraceDefinition(ctx)
  ctx.inject(['remote', 'remote.session'], c => {
    c.slots.inject('settings.section', () => c.slots.register({
      name: 'settings.section', id: 'watcher-insights', order: 85,
      label: 'Watcher', inject: () => ({ remote: c.remote }),
    }, InsightsSettings))
  })
  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
    name: 'conversation.session.header.utilities',
    id: 'dsh-watcher',
    order: 50,
    label: 'Watcher',
    inject: (sessionId: SessionId): WatcherInjected => {
      // Workspace Host provides ISessions.binding(); keep runtime behavior.
      const session = (ctx.sessions as any).binding?.(sessionId)?.session as
        | WatcherHistorySession
        | undefined
      if (session === undefined) throw new Error(`dsh-watcher: session "${sessionId}" is unavailable`)
      return {
        loadAllHistory: signal => createCompleteHistoryLoader(ctx.uiConversation, sessionId, session)(signal),
      }
    },
```

</details>

#### 缺口

- 相似调用归并与可追溯性尚未实测。
  **影响**：有望减少逐条翻找时间。
  **进一步探讨**：用带重复和并行调用的虚构会话验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 数据如何取得？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主依赖 sessionProjections 和 sessions 并安装统计投影。引擎维护事件 seq、时间和待处理阶段，客户端注册设置、会话按钮和可选侧栏页。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-watcher.ts:1-10](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/src/dsh-watcher.ts#L1-L10)

宿主注入会话投影与会话服务

<details>
<summary>查看原文（10行）</summary>

```text
import type { Context } from '@deepseek-ai/cordis'
import { installProjection } from './insights/projection.ts'
import { logInfo } from './log.ts'
export const name = 'dsh-watcher'
export const inject = ['sessionProjections', 'sessions']
/** Host-owned replayable statistics; no new transport or model-facing writes. */
export function apply(ctx: Context): void {
  logInfo('[my-plugins/dsh-watcher] loaded')
  installProjection(ctx)
}
```

</details>

**依据 2 · 源码核查**：[src/insights/engine.mjs:424-433](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/src/insights/engine.mjs#L424-L433)

视图包含事件序号、时间和待处理阶段

<details>
<summary>查看原文（10行）</summary>

```text
// viewOf caches by state identity so an unchanged state republishes nothing.
const wireCache = new WeakMap();
function buildView(s) {
  return { version: s.version, sessionId: s.sessionId, seq: s.seq, updatedAt: s.updatedAt,
    totals: s.totals, models: s.models, days: s.days, turn: s.turn,
    pending: s.open ? { turn: s.open.turn, step: s.open.step, start: s.open.start,
      reasoningFirst: s.open.reasoningFirst, reasoningLast: s.open.reasoningLast,
      lastContentAt: s.open.lastContentAt } : null,
    findings: s.findings, findingCount: s.findingCount,
    context: {
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:23-59](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/src/client/index.tsx#L23-L59)

注册入口，额外侧栏服务为条件项

<details>
<summary>查看原文（37行）</summary>

```text
  registerModelTraceDefinition(ctx)
  ctx.inject(['remote', 'remote.session'], c => {
    c.slots.inject('settings.section', () => c.slots.register({
      name: 'settings.section', id: 'watcher-insights', order: 85,
      label: 'Watcher', inject: () => ({ remote: c.remote }),
    }, InsightsSettings))
  })
  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
    name: 'conversation.session.header.utilities',
    id: 'dsh-watcher',
    order: 50,
    label: 'Watcher',
    inject: (sessionId: SessionId): WatcherInjected => {
      // Workspace Host provides ISessions.binding(); keep runtime behavior.
      const session = (ctx.sessions as any).binding?.(sessionId)?.session as
        | WatcherHistorySession
        | undefined
      if (session === undefined) throw new Error(`dsh-watcher: session "${sessionId}" is unavailable`)
      return {
        loadAllHistory: signal => createCompleteHistoryLoader(ctx.uiConversation, sessionId, session)(signal),
      }
    },
  }, Watcher))
  // Optional Better Sidebar tab. `dsh-better-sidebar` is an optional runtime
  // peer: when it is absent the inject never fires and nothing happens. The
  // effect hands registerTab's disposer to cordis, so hot reload unregisters
  // the tab before the plugin re-applies — no duplicate registrations.
  ctx.inject(['betterSidebar'], c => {
    const betterSidebar = betterSidebarServiceOf(c)
    const { registerTab } = betterSidebar ?? {}
    if (typeof registerTab !== 'function') return
    // Better Sidebar renders the tab with its own context. That context does
    // not inject uiConversation, uiSession, or sessions, and Cordis throws on
    // the read. `c` is this plugin's child context, so those services resolve
    // by walking the parent fiber. The descriptor falls back to the host ctx
    // only for a service this context does not expose.
    c.effect(() => registerTab(watcherSidebarDescriptor(c)))
```

</details>

#### 缺口

- 读取的是宿主可提供的信息，事件缺失会改变诊断粒度。
  **影响**：统计可按宿主会话投影重建。
  **进一步探讨**：用截断记录和完整记录分别观察。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些数据不能过度解读？

**研究主题**：缺陷与关键质疑

#### 完整回答

只展示已记录的可见 reasoning，不能补出隐藏推理。价格估算区分零使用、未知、部分和已计价，部分价格只显示已知金额并附注。本机渲染也仍会接触宿主已经拥有的消息和工具结果。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/Watcher.tsx:844-856](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/src/client/Watcher.tsx#L844-L856)

界面根据 trace 指标显示可见推理

<details>
<summary>查看原文（13行）</summary>

```text
  const hasReasoning = hasReasoningEvidence(trace)
  const total = formatDuration(metrics.totalMs)
  const visibleReasoning = formatDuration(metrics.visibleReasoningMs)
  const reasoningAttempts = trace.attempts.filter(attempt => attempt.reasoningText.trim() !== '')
  const summary = [
    total === null ? '时间不完整' : `模型 ${total}`,
    hasReasoning
      ? visibleReasoning === null ? '可见推理已记录' : `可见推理 ${visibleReasoning}`
      : null,
    trace.reasoningTokens === null ? null : `${trace.reasoningTokens.toLocaleString('zh-CN')} 推理 token`,
    metrics.live ? '进行中' : null,
  ].filter((value): value is string => value !== null).join(' · ')
  const bodyId = `watcher-model-stage-${stepId}`
```

</details>

**依据 2 · 源码核查**：[src/insights/pricing.mjs:990-1002](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/src/insights/pricing.mjs#L990-L1002)

汇总保留未知状态

<details>
<summary>查看原文（13行）</summary>

```text
  let anyPositive = false;
  const estimated = list.map(row => {
    const result = estimateModelUsage(row, table);
    totalTokens += result.totalTokens ?? 0;
    if (result.status !== 'zero') anyPositive = true;
    if (result.unknown) unknown = true;
    if (result.usd != null) usd += result.usd;
    return result;
  });
  if (!anyPositive) return { status: 'zero', usd: 0, unknown: false, totalTokens: 0, rows: estimated };
  if (unknown && usd === 0) return { status: 'unknown', usd: null, unknown: true, totalTokens, rows: estimated };
  if (unknown) return { status: 'partial', usd, unknown: true, totalTokens, rows: estimated };
  return { status: 'priced', usd, unknown: false, totalTokens, rows: estimated };
```

</details>

**依据 3 · 源码核查**：[src/insights/pricing.mjs:1024-1036](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/src/insights/pricing.mjs#L1024-L1036)

未知和部分计价分开显示

<details>
<summary>查看原文（13行）</summary>

```text
export function formatEstimate(result, locale = 'zh') {
  const copy = costCopy(locale);
  if (!result || result.status === 'unknown') return copy.unknown;
  if (result.status === 'zero') return formatUsd(0);
  const money = formatUsd(result.usd);
  if (money == null) return copy.unknown;
  return money;
}

/** Quiet footnote for partial rows. Never embed this in the bold main number. */
export function formatEstimateNote(result, locale = 'zh') {
  const copy = costCopy(locale);
  return result?.status === 'partial' ? copy.someUnpriced : '';
```

</details>

**依据 4 · 作者声明**：[docs/data-handling.md:1-8](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/docs/data-handling.md#L1-L8)

作者说明读取内容和本机配置

```text
# Data handling

Watcher reads the session the host already has: prompts, tool calls, tool results, and the token counts the provider wrote into the session. That text can contain personal data. The plugin does not add an account, a cookie banner, or an upload path.

- Rendering stays in the host page. There is no fetch of session text.
- The default price table is the file `pricing/models.yaml`. The settings editor writes only changed rows to `localStorage` key `dsh-watcher:pricing-override:v1`.
- Logs go through `src/log.ts`. `redact` masks `token`, `key`, `secret`, `password`, `authorization`, and `bearer` assignments, including query strings, before `console.debug` / `console.log` / `console.error`.
- The acceptance script may receive a host startup token in `DSH_TEST_URL`. It must not print that URL or save browser storage.
```

#### 缺口

- 账单与估价没有独立对账。
  **影响**：排障只依赖可见事件与有定价桶。
  **进一步探讨**：混合有价及无价模型，核对脚注和总数。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

按作者说明确认 Web CLI 与 Desktop 应用内安装的 profile 区别、宿主与 Node 版本。首次验收会话入口，持续成本包括维护价格覆盖和长会话渲染。退出检查标题栏、设置、侧栏入口清理及本地覆盖留存，必要时先保留自定义价格。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-33](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/README.md#L17-L33)

作者说明宿主与 Web/Desktop 安装范围

<details>
<summary>查看原文（17行）</summary>

````text
从 [DeepSeek Harness](https://www.npmjs.com/package/@deepseek-ai/dsh) 安装 [`dsh-watcher`](https://www.npmjs.com/package/dsh-watcher) 插件：

```sh
dsh plugin --profile web add dsh-watcher
```

更新 `dsh-watcher` 插件：

```sh
dsh plugin --profile web update dsh-watcher@latest
```

然后用 `dsh web` 启动 Web 界面。无需构建、无需重启。

这条官方 CLI 命令只写入 `web` profile，不能修改 Desktop App 的 profile；桌面端请使用上面的应用内“添加插件”向导。本发布已提交 `lib/`；普通使用不需要 clone、构建或安装 DSHX。

需要 DeepSeek Harness **0.2.1-rc.2**（`@deepseek-ai/dsh@0.2.1-rc.2`，`dsh-v0.2.1-rc.2`）。`@deepseek-ai/dsh-*` 的 peer 与 `engines.dsh` 范围是 `>=0.2.1-rc.1 <0.2.2`：接受 **0.2.1-rc.2** 和稳定版 **0.2.1**，拒绝 alpha，也拒绝 **0.2.0-rc.2**。Node `^22.19.0` 或 `>=24`。
````

</details>

**依据 2 · 作者声明**：[README.md:66-74](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/README.md#L66-L74)

作者给出卸载和本地价格覆盖

````text
同样需要 pnpm，然后重新打开该 Web Host 并刷新页面。

```sh
dsh plugin --profile web remove dsh-watcher
```

官方 CLI 只管理 `web` profile；Desktop App 请使用上面的应用内“添加插件”入口。

设置页和会话 HUD 的 Token 总数旁有 **估算费用**（不是「总价值」）。按模型的输入 / 输出 / 缓存桶对照 `pricing/models.yaml` 计价；缺行显示 **未知**，不会当成 $0。部分已知时主数字只显示已标价金额，未标价写在脚注。这是估算，不是账单。默认表含 DeepSeek、MiniMax、OpenAI、Anthropic、Gemini、Grok、GLM、Qwen 主流行，不联网。设置里打开的是当前生效价格表；保存只把改动过的行写入 `localStorage` 键 `dsh-watcher:pricing-override:v1`。欢迎对默认表提 PR。
````

**依据 3 · 源码核查**：[src/client/index.tsx:48-59](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/src/client/index.tsx#L48-L59)

可选侧栏注册交由 effect 管理

<details>
<summary>查看原文（12行）</summary>

```text
  // effect hands registerTab's disposer to cordis, so hot reload unregisters
  // the tab before the plugin re-applies — no duplicate registrations.
  ctx.inject(['betterSidebar'], c => {
    const betterSidebar = betterSidebarServiceOf(c)
    const { registerTab } = betterSidebar ?? {}
    if (typeof registerTab !== 'function') return
    // Better Sidebar renders the tab with its own context. That context does
    // not inject uiConversation, uiSession, or sessions, and Cordis throws on
    // the read. `c` is this plugin's child context, so those services resolve
    // by walking the parent fiber. The descriptor falls back to the host ctx
    // only for a service this context does not expose.
    c.effect(() => registerTab(watcherSidebarDescriptor(c)))
```

</details>

#### 缺口

- 性能与卸载后的浏览器状态未知。
  **影响**：部署适配和留存需要独立确认。
  **进一步探讨**：用同一虚构会话比较启用前后。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些结果支持或否定采用？

**研究主题**：新假设与验证

#### 完整回答

比较原始会话、Trajectory 与 Watcher 定位同一失败调用，记录耗时、错判、定位深度。增加并行重复命令、缺 reasoning、混合价格与没有 Better Sidebar 的场景。若合并了不同命令、缺价被计为零、或定位没有改善，按对应失败缩小采用范围。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-49](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/README.md#L35-L49)

作者说明并行、聚合及无记录处理

<details>
<summary>查看原文（15行）</summary>

```text
DeepSeek Harness Web 的只读插件。点会话标题栏里的眼睛，把 Session 收成一张能折叠的工作路径：这轮走了几步、跑了几次、花了多久；再展开某一步看并行分支、工具结果，或一条默认折着的推理记录。

它不往对话里塞消息，不编隐藏思维链，也不替代官方 Trajectory。

![从逐项切到归类：两次改 package.json 收成 ×2](docs/screenshots/switch-mode.gif)

![三轮都收着，留下阶段数、执行数和 tok/s](docs/screenshots/collapsed-turns.png)

![第三轮展开：并行步骤还在原来的 Step 里](docs/screenshots/overview.png)

![步骤 2：glob 和 grep 两项并行](docs/screenshots/parallel.png)

![归类：修改 package.json ×2，展开仍是步骤 5 和 6](docs/screenshots/grouped.png)

归类只叠能证明相同的调用。两条不同的 bash 不会被捏在一起。模型阶段只显示供应商已经写进 Session 的可见 reasoning；没有记录就写未记录。
```

</details>

**依据 2 · 源码核查**：[src/insights/pricing.mjs:990-1002](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/src/insights/pricing.mjs#L990-L1002)

可构造混合价格对照

<details>
<summary>查看原文（13行）</summary>

```text
  let anyPositive = false;
  const estimated = list.map(row => {
    const result = estimateModelUsage(row, table);
    totalTokens += result.totalTokens ?? 0;
    if (result.status !== 'zero') anyPositive = true;
    if (result.unknown) unknown = true;
    if (result.usd != null) usd += result.usd;
    return result;
  });
  if (!anyPositive) return { status: 'zero', usd: 0, unknown: false, totalTokens: 0, rows: estimated };
  if (unknown && usd === 0) return { status: 'unknown', usd: null, unknown: true, totalTokens, rows: estimated };
  if (unknown) return { status: 'partial', usd, unknown: true, totalTokens, rows: estimated };
  return { status: 'priced', usd, unknown: false, totalTokens, rows: estimated };
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:48-59](https://github.com/aa2246740/dsh-watcher/blob/e1fae1057228bc1b449c872da14192bac23daa29/src/client/index.tsx#L48-L59)

侧栏接入可选

<details>
<summary>查看原文（12行）</summary>

```text
  // effect hands registerTab's disposer to cordis, so hot reload unregisters
  // the tab before the plugin re-applies — no duplicate registrations.
  ctx.inject(['betterSidebar'], c => {
    const betterSidebar = betterSidebarServiceOf(c)
    const { registerTab } = betterSidebar ?? {}
    if (typeof registerTab !== 'function') return
    // Better Sidebar renders the tab with its own context. That context does
    // not inject uiConversation, uiSession, or sessions, and Cordis throws on
    // the read. `c` is this plugin's child context, so those services resolve
    // by walking the parent fiber. The descriptor falls back to the host ctx
    // only for a service this context does not expose.
    c.effect(() => registerTab(watcherSidebarDescriptor(c)))
```

</details>

#### 缺口

- 未完成浏览器或宿主测试。
  **影响**：需同时比较准确率与用时。
  **进一步探讨**：保留事件序号、预期统计和操作轨迹。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
