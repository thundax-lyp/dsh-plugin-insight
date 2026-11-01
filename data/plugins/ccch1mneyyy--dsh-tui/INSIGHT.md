# DSH TUI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2701218](https://github.com/ccch1mneyyy/dsh-TUI/tree/270121896ec391e5f113d5bb39e4ca048aa31037)

<!-- BEGIN META -->
[![GitHub ★ 6,458](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C458&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ccch1mneyyy/dsh-TUI) [![npm 30d 53,368](https://img.shields.io/static/v1?label=npm+30d&message=53%2C368&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供交互式终端客户端、会话投影及审批界面。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示终端入口组合宿主 channel 与 UI，提供集中状态视图；用户效率未测。

> **主要限制**：[Q03](#research-q03) 和 [Q04](#research-q04) 显示恢复与实时存在有意差异，救援 profile 仍共享 home 与环境；不能视为完全等价或安全沙箱。

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
  - [Q01 · 谁需要终端客户端，它相对于原生 CLI 或 Web 的增量是什么？](#detail-section-11)
  - [Q02 · 宿主如何加载 channel 和 UI 并清理？](#detail-section-12)
  - [Q03 · 实时事件与历史重放如何投影，是否等价？](#detail-section-13)
  - [Q04 · 审批和安全 profile 是否提供完整隔离？](#detail-section-14)
  - [Q05 · 试用成本与退出条件是什么？](#detail-section-15)
  - [Q06 · 共享投影能否让实时和恢复视图保持可解释一致？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望在终端内处理 DSH 会话和状态的用户。

现有 DSH CLI 或 Web 已提供会话入口；该客户端增加终端内状态和交互，收益未量化。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 终端会话 | 呈现交互和状态 | 需兼容宿主与终端 |
| 历史恢复 | 重放已提交事件 | 与实时副作用有区别 |
| 审批 | 接收请求并允许一次或拒绝 | 来源标记不构成隔离 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19 或 >=24 | 是 | 执行客户端 | 启动不可依赖 |
| 兼容宿主和终端 | 对 DSH 会话必需 | 组合 channel、交互 | 可能无法启动或显示 |
| 模型配置与凭据 | 视后端而定 | 请求模型 | 无法完成对应请求 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份 home 并核对宿主和 Node | 隔离测试环境可恢复 |
| 试用 | 用户打开会话并核对状态与审批 | 核对审批内容和来源 |
| 恢复 | 用户重启并比较历史 | 出现丢行或误归属则停用并回退 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 包下载及模型调用费用未知 | 检查宿主、备份 home | Node 版本受限 |
| 持续 | 终端和模型资源未知 | 维护配置与审批 | 用户效率未知 |
| 恢复 | 备份与排查成本未知 | 对照历史和权限 | 救援仍共享 home |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 终端交互 | 源码挂载 channel 与 UI | 任务效率和可访问性 |
| 恢复展示 | 历史与实时共享投影 | 最终状态完全一致 |
| 审批 | 条件监听并展示来源标记 | 端到端安全性 |

> **思考**：[Q03](#research-q03) 和 [Q04](#research-q04) 显示恢复与实时存在有意差异，救援 profile 仍共享 home 与环境；不能视为完全等价或安全沙箱。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示终端入口组合宿主 channel 与 UI，提供集中状态视图；用户效率未测。

[Q02](#research-q02) 处理异步启动和注销，[Q03](#research-q03) 在历史迟到时防止错序；这些静态措施尚未验证整体可靠性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 和 [Q04](#research-q04) 显示恢复与实时存在有意差异，救援 profile 仍共享 home 与环境；不能视为完全等价或安全沙箱。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议在隔离环境小范围试用并保留原入口；出现丢行、误归属或审批来源异常时停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码已检查；目标宿主、终端交互和实际收益未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、bin/dsh-tui.js、src/dsh-adapter/index.ts、src/dsh-adapter/plugin.ts、src/dsh-adapter/approvals.ts、src/dsh-adapter/channel/core/binding-feed.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交的入口、投影、审批和启动器；未运行项目、宿主、终端、第三方插件或模型，未穷尽全部界面。 旧研究基线 29572774890a4a89ae1fa562dd15a1ae21bb3593 的包版本为 0.17.0，当前固定版本为 0.18.0；限定入口、审批、投影和启动器的差异检查中，入口与 binding-feed 有改动，审批及启动器无差异。该比较不代表全仓变更审计。
- 下一步：在固定宿主和隔离 home 中验证启动、退出、重连、历史迟到与审批取消，并按 [Q06](#research-q06) 对比事件身份及最终行。

**分析版本**

- **仓库**：[ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI)
- **版本号**：0.18.0（[固定提交 2701218](https://github.com/ccch1mneyyy/dsh-TUI/tree/270121896ec391e5f113d5bb39e4ca048aa31037)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提议比较同一事件序列的最终稳定行，以检验恢复一致性；这仍是假设。

在固定宿主和隔离 home 中验证启动、退出、重连、历史迟到与审批取消，并按 [Q06](#research-q06) 对比事件身份及最终行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 131 | 31850 | — | — | 466226 |
| .mjs | source | 225 | 52547 | 40910 | 9002 | — |
| .js | source | 5 | 2294 | 1710 | 493 | — |
| .mjs | test | 6 | 1293 | 1183 | 26 | — |
| .mjs | example | 3 | 252 | 194 | 46 | — |
| .cjs | source | 5 | 482 | 329 | 131 | — |
| .ts | source | 1847 | 242399 | 167361 | 61321 | — |
| .tsx | source | 454 | 168469 | 131455 | 30392 | — |
| .ts | example | 4 | 753 | 558 | 143 | — |
| .js | example | 1 | 66 | 21 | 40 | — |
| .md | example | 1 | 39 | — | — | 383 |
| .mts | source | 2 | 168 | 120 | 39 | — |
| .ts | test | 5 | 291 | 172 | 102 | — |
| .js | test | 5 | 676 | 577 | 63 | — |

</details>

**活跃度**

[![Issue 未关闭 96](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=96&color=737b86&logo=github)](https://github.com/ccch1mneyyy/dsh-TUI/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 264](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=264&color=737b86&logo=github)](https://github.com/ccch1mneyyy/dsh-TUI/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 255](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=255&color=737b86&logo=github)](https://github.com/ccch1mneyyy/dsh-TUI/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查终端客户端的宿主接入、事件恢复、审批和采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要终端客户端，它相对于原生 CLI 或 Web 的增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README.md:20-25 将其描述为 DeepSeek Harness 的交互终端、流状态和自有组合入口。对偏好终端内会话的用户，它提供持续状态和交互面；原生 CLI 或 Web 已可作为会话入口，是否值得增加一套前端取决于场景和可访问性。源码入口支持客户端分类，但 README 功能并非独立用户效果验证；用户频率和任务效率未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-25](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/README.md#L20-L25)

作者描述终端客户端及其 DSH 组合入口。

```text
> An interactive terminal UI for DeepSeek Harness. It ships a pixel-whale
> header, live work status, streaming thinking, double-Esc time rewind, a
> context progress bar, and a TPS gauge. Zero core changes: it consumes only
> DSH's public exports, and is moving from a mounted plugin to an app with its
> own entry and composition root, where DSH loads in process as the first-party
> backend. Install to enable; uninstall leaves no patches behind.
```

#### 缺口

- 缺少固定版本宿主和终端运行验证
  **影响**：不能证明行为在真实配置和异常下成立
  **进一步探讨**：在隔离宿主固定版本运行并记录结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主如何加载 channel 和 UI 并清理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

src/dsh-adapter/index.ts:472-502 在已有 entry slot 时连接该入口，否则等待 loader 后创建 Cordis 子插件，disposed 后不启动并捕获启动错误。src/dsh-adapter/plugin.ts:1089-1093 根据后端或 DSH 选择启动会话；1224-1230 注册 channel、通过 effect 注销并挂载 UI。源码覆盖一条生命周期，不等于所有退出和重载场景已通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-adapter/index.ts:472-502](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/src/dsh-adapter/index.ts#L472-L502)

入口分支、异步加载与 disposed 检查。

<details>
<summary>查看原文（31行）</summary>

```text
export async function apply(ctx: Context, config: RuntimeConfig<Config>): Promise<void> {
  // The entry already mounted the screen in this process (./entry-slot.ts):
  // the row only runs the DSH side and hands the session to that screen.
  const entrySlot = peekEntrySlot()
  if (entrySlot !== undefined) {
    entrySlot.rowSeen = true
    attachToEntry(ctx, config)
    return
  }
  // Upstream drift is NO LONGER spammed to stderr here: per-package
  // console.warn lines interleave with the TUI frame redraw and arrive
  // garbled (typewriter animation repaints over them). The merged,
  // natural-language notice now renders in the logo header under the
  // startup tip (LogoV2 ← upstreamDriftSummary); CI keeps the hard gate
  // via scripts/verify-upstream-contract.ts.
  const { apply: tuiApply, handleStartupError } = await import('./plugin.js')
  let disposed = false
  ctx.effect(() => () => { disposed = true })
  // Registry diagnostics can await the whole Loader. Do not make this Host
  // row await the runtime in return. Let Host providers settle before starting
  // a Cordis-owned child; the original row still owns volatile Config.
  const loader = ctx.get('loader') as { await(): Promise<unknown> } | undefined
  void (loader?.await() ?? ctx.fiber.await()).then(() => {
    if (disposed) return
    return ctx.plugin({
      name: 'dsh-tui-runtime',
      apply: (runtimeCtx: Context) => tuiApply(runtimeCtx, config, ctx),
    })
  }).catch(error => {
    if (!disposed) handleStartupError(ctx, error)
  })
```

</details>

**依据 2 · 源码核查**：[src/dsh-adapter/plugin.ts:1224-1230](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/src/dsh-adapter/plugin.ts#L1224-L1230)

注册 channel、注销与 UI 挂载。

```text
  const unregisterTuiChannel = registerTuiChannel(compositionRoot(ctx), rawChannel)
  ctx.effect(() => () => { unregisterTuiChannel() })
  const adapterRuntime = adapterRuntimeFor(ctx)
  // Looked up per probe: the plugin-host row can compose after the mount.
  const uiMount = mountChannelUi(ctx, rawChannel, ctx.get('tuiPluginHost'), adapterRuntime.mode, () => ctx.get('tuiPluginHost'))
  const channel = uiMount.channel
  bindChannelCommands(rawChannel, channel)
```

#### 缺口

- 缺少固定版本宿主和终端运行验证
  **影响**：不能证明行为在真实配置和异常下成立
  **进一步探讨**：在隔离宿主固定版本运行并记录结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 实时事件与历史重放如何投影，是否等价？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

src/dsh-adapter/channel/core/binding-feed.ts:195-216 将实时批次送 projector，355-365 同时重置投影和翻译账本，并用 replay 标记投影历史后结束流式状态；377-388 异步历史迟于实时行时不再绘制以防错序。共享投影器不意味着逐帧、通知或恢复效果完全相同；例如 replay 不触发 live reset 回调。未执行交错、取消和错误场景。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-adapter/channel/core/binding-feed.ts:195-216](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/src/dsh-adapter/channel/core/binding-feed.ts#L195-L216)

实时批次投影且重放不调用实时 reset。

<details>
<summary>查看原文（22行）</summary>

```text
    const events = admitted ?? batch
    if (progressOnly) {
      // Pure summary progress: frame-coalesced like the stream it counts.
      if (events.length === 0) return
      deps.projector.apply(events, meta)
      deps.state.emitStream()
      return
    }
    // The one writer of the foreground transcript. A live conversation
    // reset splits the batch: what came before it is projected first.
    const onReset = meta.replay ? undefined : deps.onReset
    if (onReset !== undefined && events.some(event => event.type === 'session.reset')) {
      let start = 0
      events.forEach((event, index) => {
        if (event.type !== 'session.reset') return
        if (index > start) deps.projector.apply(events.slice(start, index), meta)
        onReset(event)
        start = index + 1
      })
      if (start < events.length) deps.projector.apply(events.slice(start), meta)
    } else {
      deps.projector.apply(events, meta)
```

</details>

**依据 2 · 源码核查**：[src/dsh-adapter/channel/core/binding-feed.ts:353-388](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/src/dsh-adapter/channel/core/binding-feed.ts#L353-L388)

重置账本、历史投影及迟到保护。

<details>
<summary>查看原文（36行）</summary>

```text
  /** Forget every per-session projection ledger: the projector's and the
   *  bound session translator's, together. */
  const resetProjection = (): void => {
    projector.reset()
    deps.hooks().resetTranslation?.()
  }

  /** Paint a settled history: no live toasts, no open turn left behind. */
  const paintHistory = (events: readonly AgentEvent[]): void => {
    if (events.length === 0) return
    projector.apply(events, { replay: true })
    projector.settleStreaming()
    state.working = false
    state.cancelPending = false
  }

  /**
   * Fallback for a bind without a history read ahead of it (an embedder
   * handing `createChannel` a session whose history it never read): read it
   * once, asynchronously, and paint it only if nothing live has painted yet.
   * Painting it after live rows that already arrived would misorder both.
   * Every core adoption (`/new`, `/resume`, a rewind's fork) and the plugin's
   * startup session pass the history in instead.
   */
  const replayHistory = (capture: BindingCapture, current: () => boolean): void => {
    void capture.session.history().then(events => {
      if (events.length === 0 || !current()) return
      if (state.rows.length > 0) {
        logForDebugging('channel: history arrived after live rows; not replayed')
        return
      }
      paintHistory(events)
      state.emit()
    }).catch((error: unknown) => {
      logForDebugging(`channel: history failed (${error instanceof Error ? error.message : String(error)})`)
    })
```

</details>

#### 缺口

- 缺少固定版本宿主和终端运行验证
  **影响**：不能证明行为在真实配置和异常下成立
  **进一步探讨**：在隔离宿主固定版本运行并记录结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 审批和安全 profile 是否提供完整隔离？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

src/dsh-adapter/plugin.ts:2180-2198 在 DSH approval 服务存在时监听 approval/request，异常才调用 next，销毁时取消等待；approvals.ts:442-469 将未锚定实时工具调用或重复 callId 的请求标为 external，524-533 校验 panel key 并仅允许一次或拒绝。标记是提示，并非证明来源可信或替代宿主权限控制。bin/dsh-tui.js:84-92 和 897-903 显示救援 profile 仍共享 home 的模块回退链接并继承凭据等环境，不能当成沙箱。未验证真实宿主或第三方插件对抗。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-adapter/plugin.ts:2180-2198](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/src/dsh-adapter/plugin.ts#L2180-L2198)

有条件挂接审批请求及销毁清理。

<details>
<summary>查看原文（19行）</summary>

```text
  const approvalStore = new ApprovalStore(adapterRuntimeFor(ctx))
  bindApprovalStore(ctx, approvalStore)
  // A non-DSH backend answers its own permission prompts: the DSH answerer
  // is not registered for it.
  // The in-process DSH kernel installs it in `attachDsh`.
  const mountDshApprovals = (dshCtx: Context): void => {
    if (dshCtx.get('approval') !== undefined && backendStart === undefined) {
      dshCtx.on('approval/request', (req, next) =>
        approvalStore.park(req).catch(() => next()))
      // Badge-flip push (P-4): React does not know the session log appended —
      // a source-badge verdict that only flips inside getSnapshot() surfaces
      // solely when something else re-renders. Feed the session firehose to
      // the store: it reacts only to tool/result (the sole verdict-flipping
      // event type), and its internal log-length memo skips appends from any
      // session other than the active ask's, so no agent filtering is needed
      // here. The firehose fires post-commit, after the event entered
      // session.events, so the recheck sees the settled result.
      dshCtx.on('session/event', (session, event) => approvalStore.noteSessionEvent(session.id, event))
      dshCtx.effect(() => () => approvalStore.settleAll('cancelled'))
```

</details>

**依据 2 · 源码核查**：[src/dsh-adapter/approvals.ts:442-469](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/src/dsh-adapter/approvals.ts#L442-L469)

标记不明或重复来源。

<details>
<summary>查看原文（28行）</summary>

```text
  park(req: ApprovalRequest): Promise<ApprovalOutcome> {
    assertCapabilityShadowPolicy('host.presentation.approve', this.runtime.mode, this.runtime.slices)
    return new Promise<ApprovalOutcome>(resolve => {
      const command = commandOf(req)
      const reason = reasonOf(req)
      // Source badge: park() is reached through the approval/request
      // waterfall, which any in-process plugin can dispatch — the agent-id
      // gate in plugin.ts says whose SESSION it names, not that a live tool
      // call actually raised it. Mark everything not anchored to an
      // unresolved tool call, plus any ask reusing a callId that is already
      // in flight or already consumed (a legitimate call is asked about
      // exactly once). A duplicate callId marks EVERY ask on it ambiguous
      // (attacker-first: a forged ask parked before the genuine one looks
      // clean on its own — see markCallIdAmbiguous), so the panel can warn.
      const duplicate = this.isCallIdInFlight(req)
      if (duplicate) this.markCallIdAmbiguous(req.agent.id, req.callId)
      const external = !isLiveToolApproval(req) || duplicate
        || (req.callId !== undefined && this.consumedCallIds.has(consumedKey(req.agent.id, req.callId)))
      const pending: PendingApproval = {
        key: String(++this.seq),
        request: req,
        snapshot: {
          agentId: String(req.agent.id),
          toolName: req.toolName,
          ...(reason !== undefined ? { reason } : {}),
          ...(command !== undefined ? { command } : {}),
          ...(external ? { external: true } : {}),
        },
```

</details>

**依据 3 · 源码核查**：[src/dsh-adapter/approvals.ts:524-533](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/src/dsh-adapter/approvals.ts#L524-L533)

当前面板键校验与一次允许或拒绝。

<details>
<summary>查看原文（10行）</summary>

```text
  decide(outcome: PermissionPanelOutcome, decision?: PermissionPanelDecision): void {
    const pending = this.active
    if (pending === undefined) return
    // A keystroke the withdrawn panel still handled answers nothing.
    if (decision?.key !== undefined && decision.key !== pending.key) return
    this.noteConsumed(pending)
    this.active = undefined
    this.rebuildSnapshot()
    pending.resolve(outcome === 'allowed-once' ? 'allowed-once' : 'rejected')
    this.startNext()
```

</details>

**依据 4 · 源码核查**：[bin/dsh-tui.js:84-92](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/bin/dsh-tui.js#L84-L92)

救援 profile 共享 home 模块回退链接。

```text
// 救援 profile（最小可用）：同 home 下的空白 profile（仅 base+TUI，无第三方
// 插件），是主 profile 装炸时的干净启动通道——创建走官方 dsh plugin add
// （钉当前版本，同 bootstrap 语义）。
// 「干净」在这里是启动器必须先证明的断言，不是宣传语：profile 维度由
// rescueProfileState() 校验根 manifest，home 维度由 homePatchFile 门禁
// 把关（见 createRescueProfile）。注意：即便救援自身的安装只落在
// profileDir 这个新目录里，任何一次 dsh 启动都会维护**共享**的
// `$DSH_HOME/profiles/node_modules` 模块回退链接（上游 dsh 的
// healProfilesModuleFallback，无开关），救援启动也不例外。
```

**依据 5 · 源码核查**：[bin/dsh-tui.js:897-903](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/bin/dsh-tui.js#L897-L903)

继承环境和凭据。

```text
// 救援子进程的环境：显式构造，而不是把宿主 process.env 原样交给它。救援的
// 语义是「干净冷启动」，而启动器自己写进 process.env 的会话控制变量会把刚
// 崩掉的主 profile 的会话 id / 工作区目标带进救援——救援 profile 里并不存在
// 那个会话，dsh 会在恢复时再报一次错，正好污染最该干净的通道。其余宿主变量
// （PATH / DSH_HOME / 凭据…）是救援能工作的前提，照常继承。
// home 层补丁不在此列：它由 createRescueProfile 的干净性门禁单独把关。
const RESCUE_DROPPED_ENV = ['DSH_TUI_RESUME_SESSION', 'DSH_TUI_RESUME_BACKEND', 'DSH_TUI_WORKSPACE_TARGET']
```

#### 缺口

- 缺少固定版本宿主和终端运行验证
  **影响**：不能证明行为在真实配置和异常下成立
  **进一步探讨**：在隔离宿主固定版本运行并记录结果

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 试用成本与退出条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:131-132 要求 Node ^22.19 或 >=24，终端还依赖兼容宿主、安装和可用模型配置；bin/dsh-tui.js:1-17 的启动流程涉及 profile 安装和转发。试用前应备份 home 并隔离测试凭据，验证启动、审批和恢复；遇到身份混淆、会话丢失或宿主不兼容，应停止使用并返回既有 CLI/Web。安装时间、迁移、网络及维护成本均未实测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:131-132](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/package.json#L131-L132)

Node 运行版本约束。

```text
  "engines": {
    "node": "^22.19 || >=24"
```

**依据 2 · 源码核查**：[bin/dsh-tui.js:1-17](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/bin/dsh-tui.js#L1-L17)

启动器查找、安装与转发流程。

<details>
<summary>查看原文（17行）</summary>

```text
#!/usr/bin/env node
/**
 * dsh-tui — 双态启动器（delegating launcher，0.9.3）。
 *
 * 同一个文件按“自己住在哪”决定扮演的角色：
 *
 *   全局安装副本（npm i -g 得到的 `dsh-tui` 命令）→ 瘦壳：
 *     1. 找到 $DSH_HOME/profiles/dsh-tui 里的同包 bin；
 *     2. 可读 → 原样转发 argv 委托它执行（完整逻辑永远来自 profile 副本，
 *        版本随 /update 一起前进，启动器滞后问题从结构上消失）；
 *     3. 不可读（首次运行）→ 探测 dsh/pnpm 后自举
 *        `dsh plugin --profile dsh-tui add <本包>@<本包版本>`，成功后委托。
 *
 *   profile 内副本（被委托执行，或 junction/源码目录里直接运行）→ 完整
 *   启动逻辑（与 0.8.6 及之前一致）：
 *     dsh 预检 / profile 版本核对 / --resume 与工作区目标拦截 /
 *     `dsh --profile dsh-tui` 启动与退出码透传。
```

</details>

#### 缺口

- 缺少固定版本宿主和终端运行验证
  **影响**：不能证明行为在真实配置和异常下成立
  **进一步探讨**：在隔离宿主固定版本运行并记录结果

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 共享投影能否让实时和恢复视图保持可解释一致？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

假设把同一已提交事件序列分别通过实时投影和 history 重放，最终持久会话行的身份和顺序可一致；实时 toast、流中间帧等不应纳入相等断言。Q03 已显示共享 projector 和迟到保护，但尚无运行证明。可在隔离宿主覆盖重连、重复事件、reset、历史迟到和审批取消，按稳定身份比较最终行；若漏行、重排或跨会话串行，则否定假设并保留重放差异记录。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-adapter/channel/core/binding-feed.ts:353-388](https://github.com/ccch1mneyyy/dsh-TUI/blob/270121896ec391e5f113d5bb39e4ca048aa31037/src/dsh-adapter/channel/core/binding-feed.ts#L353-L388)

历史与实时共享投影但历史有专门处理。

<details>
<summary>查看原文（36行）</summary>

```text
  /** Forget every per-session projection ledger: the projector's and the
   *  bound session translator's, together. */
  const resetProjection = (): void => {
    projector.reset()
    deps.hooks().resetTranslation?.()
  }

  /** Paint a settled history: no live toasts, no open turn left behind. */
  const paintHistory = (events: readonly AgentEvent[]): void => {
    if (events.length === 0) return
    projector.apply(events, { replay: true })
    projector.settleStreaming()
    state.working = false
    state.cancelPending = false
  }

  /**
   * Fallback for a bind without a history read ahead of it (an embedder
   * handing `createChannel` a session whose history it never read): read it
   * once, asynchronously, and paint it only if nothing live has painted yet.
   * Painting it after live rows that already arrived would misorder both.
   * Every core adoption (`/new`, `/resume`, a rewind's fork) and the plugin's
   * startup session pass the history in instead.
   */
  const replayHistory = (capture: BindingCapture, current: () => boolean): void => {
    void capture.session.history().then(events => {
      if (events.length === 0 || !current()) return
      if (state.rows.length > 0) {
        logForDebugging('channel: history arrived after live rows; not replayed')
        return
      }
      paintHistory(events)
      state.emit()
    }).catch((error: unknown) => {
      logForDebugging(`channel: history failed (${error instanceof Error ? error.message : String(error)})`)
    })
```

</details>

#### 缺口

- 缺少固定版本宿主和终端运行验证
  **影响**：不能证明行为在真实配置和异常下成立
  **进一步探讨**：在隔离宿主固定版本运行并记录结果

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
