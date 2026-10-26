# dsh-TUI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[2957277](https://github.com/ccch1mneyyy/dsh-TUI/tree/29572774890a4a89ae1fa562dd15a1ae21bb3593)

<!-- BEGIN META -->
[![GitHub ★ 5,735](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C735&color=yellow&logo=github&style=flat)](https://github.com/ccch1mneyyy/dsh-TUI) [![npm 30d 44,529](https://img.shields.io/static/v1?label=npm+30d&message=44%2C529&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui)
<!-- END META -->

> **实现功能**：为DSH提供交互终端界面，显示流式回答、工具、审批与会话状态。

> **核心亮点**：[Q02](#research-q02)将宿主适配、共享事件投影与终端显示分离，live/replay同路和生命周期接线比日志抓取更可核对；不是提升模型能力。

> **风险与缺陷**：[Q03](#research-q03)全局与profile副本、终端协议及shared home会影响兼容和恢复；safe profile不代表与当前环境完全隔离。

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
  - [Q01 · 终端UI适合谁，丰富显示能否直接提高编码质量？](#detail-section-11)
  - [Q02 · 入口、会话与显示如何分离而共用事件状态？](#detail-section-12)
  - [Q03 · 安装、终端特性和审批恢复有哪些边界？](#detail-section-13)
  - [Q04 · 换终端前端是否需要迁移所有会话和配置？](#detail-section-14)
  - [Q05 · 如何确认丰富终端展示没有制造重复或误导状态？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合长期在终端/SSH里使用DSH、希望查看流式回答、工具卡与会话状态的开发者。合格结果是输入、审批、历史恢复与当前Agent状态对应，原办法为DSH原生CLI或Web。该项目既有plugin入口也有独立启动与composition root，不是修改DSH核心代码；对主要在浏览器工作的人，换成终端未必更方便。丰富显示改善可见性，但不是代码正确性或任务办结率证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 终端会话 | 流式内容与工具状态 | 终端协议决定显示 |
| 历史恢复 | live/replay共享投影 | 完整状态一致性未实测 |
| 审批显示 | 一次性允许/拒绝 | 依赖宿主approval真正执行 |
| profile启动 | 薄壳委托及safe入口 | 共享home不是隔离 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH与profile包 | 必需 | 后端与终端前端 | 启动/注入失败 |
| 兼容terminal | 必需 | 输入和显示 | 图片/鼠标等降级 |
| provider和宿主权限服务 | 执行必需 | 模型与审批 | 不以UI代替配置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 装测试profile并核对版本 | 终端界面出现 |
| 2 | 输入小任务、工具审批与恢复 | 对应原会话事件 |
| 3 | 核对失败退路 | 不一致回原入口 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 前端/profile依赖 | 终端与provider配置 | 时间未知 |
| 持续 | 宿主模型与显示缓存 | 更新与偏好维护 | 不以状态条当账单 |
| 失败恢复 | 重启与日志 | 原入口核对会话 | shared home仍有耦合 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 状态可见 | 共享projector与channel | 接管节时 |
| 审批显示 | FIFO与external警示 | 真实目标终端全链 |

> **思考**：[Q03](#research-q03)全局与profile副本、终端协议及shared home会影响兼容和恢复；safe profile不代表与当前环境完全隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)将宿主适配、共享事件投影与终端显示分离，live/replay同路和生命周期接线比日志抓取更可核对；不是提升模型能力。

[Q02](#research-q02)将宿主适配、共享事件投影与终端显示分离，live/replay同路和生命周期接线比日志抓取更可核对；不是提升模型能力。

适配器到共享projector的翻译层值得复用，可减少多后端UI重复；依赖顺序放在runtime而非阻塞loader也是明确设计。复用时要保留session生命周期、replay语义与宿主权限事实，不只搬状态动画。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)全局与profile副本、终端协议及shared home会影响兼容和恢复；safe profile不代表与当前环境完全隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

偏好终端或SSH的DSH开发者可先在测试profile试用长会话界面。相比原生CLI，它增加工具卡与状态投影，但任务质量和接管节时尚未实测。若终端渲染、审批或会话恢复不一致，就停用该前端并回到原DSH入口。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、bin/dsh-tui.js、src/index.ts、src/dsh-adapter/index.ts、src/dsh-adapter/plugin.ts、src/dsh-adapter/channel/projection.ts、src/dsh-adapter/approvals.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI)
- **版本号**：0.17.0（[固定提交 2957277](https://github.com/ccch1mneyyy/dsh-TUI/tree/29572774890a4a89ae1fa562dd15a1ae21bb3593)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出固定事件轨迹的实时/重放状态等价检验，假设未验证，以工具行和审批一致性作为否定条件。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 128 | 30769 | — | — | 448228 |
| .mjs | source | 223 | 51928 | 40461 | 8862 | — |
| .js | source | 5 | 2294 | 1710 | 493 | — |
| .mjs | test | 6 | 1278 | 1169 | 26 | — |
| .mjs | example | 3 | 252 | 194 | 46 | — |
| .cjs | source | 5 | 482 | 329 | 131 | — |
| .ts | source | 1833 | 237380 | 163816 | 60069 | — |
| .tsx | source | 453 | 165480 | 129172 | 29733 | — |
| .ts | example | 4 | 753 | 558 | 143 | — |
| .js | example | 1 | 66 | 21 | 40 | — |
| .md | example | 1 | 39 | — | — | 383 |
| .mts | source | 2 | 168 | 120 | 39 | — |
| .ts | test | 5 | 291 | 172 | 102 | — |
| .js | test | 5 | 676 | 577 | 63 | — |

</details>

**活跃度**

[![Issue 未关闭 83](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=83&color=grey&logo=github&style=flat)](https://github.com/ccch1mneyyy/dsh-TUI/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 328](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=328&color=grey&logo=github&style=flat)](https://github.com/ccch1mneyyy/dsh-TUI/issues?q=is%3Aissue+created%3A2026-09-26T09%3A39%3A44.344Z..2026-10-26T09%3A39%3A44.344Z) [![近30天关闭 307](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=307&color=grey&logo=github&style=flat)](https://github.com/ccch1mneyyy/dsh-TUI/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A39%3A44.344Z..2026-10-26T09%3A39%3A44.344Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查dsh-TUI的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 终端UI适合谁，丰富显示能否直接提高编码质量？

**研究主题**：场景与需求、采用判断

#### 完整回答

适合长期在终端/SSH里使用DSH、希望查看流式回答、工具卡与会话状态的开发者。合格结果是输入、审批、历史恢复与当前Agent状态对应，原办法为DSH原生CLI或Web。该项目既有plugin入口也有独立启动与composition root，不是修改DSH核心代码；对主要在浏览器工作的人，换成终端未必更方便。丰富显示改善可见性，但不是代码正确性或任务办结率证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-26](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/README.md#L20-L26)

终端UI和当前独立入口方向

```text
> An interactive terminal UI for DeepSeek Harness. It ships a pixel-whale
> header, live work status, streaming thinking, double-Esc time rewind, a
> context progress bar, and a TPS gauge. Zero core changes: it consumes only
> DSH's public exports, and is moving from a mounted plugin to an app with its
> own entry and composition root, where DSH loads in process as the first-party
> backend. Install to enable; uninstall leaves no patches behind.
The prompt footer hides completed goals once the turn is idle; the Todo side panel retains their history. `Ctrl+Q` folds todos while working and hides/restores the idle goal/todo footer. Clicking its todo header also hides it while idle. Hiding changes only this display: a new goal/todo snapshot or session reveals it again, and `/goal clear` does not clear todos.
```

**依据 2 · 作者声明**：[README.md:44-64](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/README.md#L44-L64)

终端输入、状态与集成声明

<details>
<summary>查看原文（21行）</summary>

`````text
- **Pixel whale pet** — three startup intros, click to wake; freezes after the first task.
- **Launchpad and first-run guide** — every ordinary launch lands on a landing page with a **real input box** (big text + whale + quick actions, dropping whole blocks on short/narrow terminals; whale-girl images use a compact native-canvas footprint instead of leaving a large gap before the title; on by default — /settings `launchpad` off boots straight into chat); command completion matches chat: `Tab` fills the input, `Enter` runs the command and clears it. The first run walks a four-step wizard (API key / language+theme / model+workspace / shortcuts), re-runnable with `/setup`.
- **Terminal-native UI** — streaming Markdown, tool cards, `/` and `@` completion, `#L12-14` ranges, history search, zh/en UI.
- **Task completion notifications** — DSH, Claude and Codex notify after successful live work settles, with no queued follow-up or active goal. The title is “dsh-TUI · Task complete”; the body shows the latest settled reply as a single-line plain-text preview (Markdown formatting removed, up to 200 characters). OSC 777/9 apply an additional 2048-byte sequence budget, including title and protocol bytes, preserving whole graphemes. No reply shows only the title; BEL only rings. `/settings` → Conversation: `taskNotifications` = `unfocused` (default), `always`, or `off`; `notificationMethod` = `auto` (default), `osc9`, `bel`, or `windows`. Auto uses separate title/body fields on Ghostty/WezTerm (OSC 777) and Kitty (OSC 99); iTerm2/Warp and explicit `osc9` use a title prefix; other terminals ring the bell; delivery follows your terminal's notification/bell settings. On local Windows, `auto` resolves to `windows`, the system's native notifications: a task-completion toast. The first toast registers that user's AppUserModelID under HKCU, the toast appears about 3 seconds after the task ends (the PowerShell cold start that buys the no-extra-install route), and for DSH sessions an enabled, active external DSH notification plugin in the running profile makes dsh-TUI yield to it (no toast, no bell); an installed but disabled plugin does not suppress notifications; if that AppUserModelID cannot be written, the notification falls back to the bell instead of going silent. SSH sessions keep the attached terminal's notification protocol in `auto` mode; explicit `windows` still selects the host's native transport. tmux requires `set -g allow-passthrough on` for OSC notifications and `set -g focus-events on` for focus reporting. Terminals without focus reporting need `always`. Replay, cancellation and failures do not notify. Works in inline and fullscreen modes.
- **Native cursor** — focused text inputs inherit your terminal's cursor shape, color, blinking, and enabled animation or trail effects in both inline and fullscreen modes. The `/model` picker shows the same cursor during movement between provider tabs, model rows, and effort levels, then hides it after **0.5 seconds at rest**; clipped regions fall back to the model row. The session manager also moves this cursor between the workspace rail, session rows, and search box; typing claims the search caret, and navigation returns it to the focused row. Configure animation and trail effects in your terminal.
- **Images** — Kitty/Sixel thumbnails, centered preview with zoom and pan, paste-time fitting, text fallback. Kitty images scale to the reserved cells' physical pixels, including on HiDPI terminals.
- **Mermaid diagrams** — ````mermaid ```` fences drawn as Unicode diagrams.
- **LaTeX math** — `$…$` and `$$…$$` formulas as Unicode text, fractions and limits stacked in display blocks; `mathRendering: image` typesets block and one-row inline formulas as terminal images on graphics terminals.
- **Timeline rail** — every turn clickable; timeline / scrollbar / hidden gutter.
- **Side panel** — `Ctrl+B` splits the chat with a panel column once the terminal is wide enough; drag the divider to resize it. All eight built-in panels are enabled by default, and so are plugin panels registered later (`sidePanel.panels: '*'`; untick a row in `/settings` to switch to an explicit list). The header shows each inactive panel's symbol; hover to see its name. Narrow terminals and inline mode keep full-screen panels. In the `todo` panel a long goal wraps to the panel width with its phase on a separate row; when the content exceeds the viewport, focus the panel and scroll with `↑`/`↓` or the wheel (every todo is reachable too) (the compact goal row above the chat input stays a single truncated line with a hover tooltip).
- **Live state** — activity animation, context bar, TPS, cache hit rate, effort, tokens, session cost estimate (main + subagents), Git and session metadata. Title, trajectory-strip and session-state animations update independently of the transcript and pause when idle or unfocused.
  Context-bar fill follows backend occupancy; colors estimate content composition. Compaction clears obsolete estimates, and missing composition displays a single used block with a measured used count in both hover details.
- **One session manager** — `/resume` `/home` `/agentview` `/bg` `⌸`.
- **Session workflow** — `/new` `/compact` `/export` `/btw`, model hot-switch, fork, rewind, vim, fullscreen draft editor.
  `/btw` uses an overlay when its sidebar cannot render. Main-task questionnaires and the fullscreen draft editor take priority while preserving the side question and draft.
- **IDE selection channel** — a VS Code selection lands in the prompt.
- **DSH integrations** — presets, skills, MCP, goals, todos, subagents, questionnaires.
- **Account sign-in** — the standard profile offers pi-ai OAuth for ChatGPT/Codex, Claude, and Grok (plus OpenAI direct and Meta Muse when available), and Host-owned DeepSeek browser sign-in as `deepseek-account` on DSH 0.2.0-rc.1+. Use `/provider` or `/auth` without another plugin.
  A profile-only update from a global TUI patch that already mounts `dsh-tui-auth` can still start the official loopback callback listener on demand; fixed-port SSH forwarding still requires the global package to be aligned.
- **Extensions** — browser interaction, computer use and more.
- **Built for long sessions** — event-driven projection, virtualization, bounded caches.
`````

</details>

#### 缺口

- 长会话用户的误读、接管和节时收益没有同条件实测。
  **影响**：可见性改善不能外推为编码质量或长期采用。
  **进一步探讨**：对终端用户同一长会话任务比较原CLI/Web与TUI，记录误读、接管次数和完成时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、会话与显示如何分离而共用事件状态？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

src/index只re-export dsh-adapter入口。apply若已有entrySlot就attach，否则等待loader稳定后在Cordis子fiber加载runtime，防止互等。plugin创建startup session和channel，随后注册TuiChannel并mountChannelUi；DSH投影器先把原生事件/stream翻译成共享projector输入，对live和replay显式区分，reset同时清两层状态。相对自制终端抓日志，事件模型和生命周期边界更清楚，能复用同一投影处理恢复；并不自动保证所有复杂卡片无重复或丢失。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-adapter/index.ts:472-502](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/src/dsh-adapter/index.ts#L472-L502)

entry attach与loader后runtime

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

**依据 2 · 源码核查**：[src/dsh-adapter/plugin.ts:1108-1139](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/src/dsh-adapter/plugin.ts#L1108-L1139)

channel和backend条件

<details>
<summary>查看原文（32行）</summary>

```text
  const rawChannel = createChannel(ctx, startupSession, {
    // The namespace this boot actually registered the settings section under
    // (the Config owner's Loader id; custom ids are supported). Chat and the
    // channel's own settings reads look the section up by it.
    settingsNs: tuiSettingsNs,
    onTaskComplete: preview => {
      if (!shadow) announceTaskCompletion(preview, rawChannel.sessionRef.backendId)
    },
    settingsService: tuiSettings,
    // The backend reports its model with its first turn (`system/init`);
    // until then the status line names the backend.
    get model() { return rowFacts.route?.model ?? (backendStart !== undefined ? backendStart.label : displayRoute.model) },
    ...(backendStart === undefined || backendPermissions === undefined ? {} : {
      backendLabel: backendStart.label,
      openSession: backendStart.open,
      interaction: { permissions: backendPermissions, questions: questionStore },
      // The session browser, /resume, /fork and rewind.
      sessionCatalog: backendStart.catalog,
      sessionPrefs: backendStart.sessionPrefs,
      initialHistory: backendStart.initialHistory,
      resumeCommand: backendStart.resumeCommand,
      ...(backendStartup === undefined ? {} : { startup: backendStartup }),
    }),
    // The in-process DSH kernel: a DSH placeholder until the row's session.
    ...(dshStartup === undefined ? {} : {
      backendLabel: backendLabel('dsh'),
      startup: dshStartup,
      openSession: async target => {
        if (target.kind !== 'create' || openDshSession === undefined) throw new Error(t('new-session-unavailable'))
        return await openDshSession(target.cwd)
      },
    }),
```

</details>

**依据 3 · 源码核查**：[src/dsh-adapter/channel/projection.ts:39-73](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/src/dsh-adapter/channel/projection.ts#L39-L73)

翻译、投影和live/replay

<details>
<summary>查看原文（35行）</summary>

```text
/** One reducer for both durable replay and live session events. */
export function createChannelProjection(state: ProjectionState, deps: ProjectionDependencies) {
  const translator = createDshTranslator({
    tools: () => deps.tools,
    scope: () => deps.agent(),
    attachments: () => deps.attachments(),
  })
  const projector = createSharedProjection(state, {
    rowIds: deps.rowIds,
    resetContextWarning: () => deps.resetContextWarning(),
    checkContextWarning: () => deps.checkContextWarning(),
    notify: (...args) => deps.notify(...args),
    jobs: deps.jobs,
    inputConvergence: deps.inputConvergence,
    get renderer() { return deps.renderer },
    selectionAttached: messageId => deps.selectionAttached(messageId),
    pricingWindow: dshPricingWindow,
  })
  return {
    /** Forget every per-session ledger on both halves. */
    reset(): void {
      translator.reset()
      projector.reset()
    },
    replayEvents(events: readonly SessionEvent[]): void {
      projector.apply(translator.translateReplay(events), REPLAY)
    },
    renderEvent(event: SessionEvent): void {
      projector.apply(translator.translateEvent(event), LIVE)
    },
    renderStreamFrame(frame: AssistantStreamFrame): void {
      projector.apply(translator.translateFrame(frame), LIVE)
    },
    settleStreaming: projector.settleStreaming,
    updateSpinnerMode: projector.updateSpinnerMode,
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装、终端特性和审批恢复有哪些边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

launcher区分全局薄壳与profile副本，版本错配会涉及自举和profile升级；safe profile仍共享DSH home的module fallback，不能称全机器隔离。终端图片、鼠标与通知依赖具体terminal协议及tmux设置，README的理想画面不能外推所有SSH终端。ApprovalStore设计按FIFO一次性allow/reject、abort/teardown取消，并标记无法与live工具绑定的external请求；显示层的警示不替代宿主真正权限门。启动成功与历史replay正确仍需在目标环境核对。

#### 证据与依据

**依据 1 · 源码核查**：[bin/dsh-tui.js:7-24](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/bin/dsh-tui.js#L7-L24)

双副本launcher策略

<details>
<summary>查看原文（18行）</summary>

```text
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
 *
 * 自举角色判定用 realpath：Windows Junction 轨（profile 指回仓库）与
 * `pnpm run dev` 源码运行都会折叠成同一物理目录 → 走完整逻辑，不会
 * 自己委托自己形成循环。
 *
 * 本文件必须保持零 lib/ 依赖：/update 的启动器迁移只覆写这一个文件
 * （外加 package.json 的版本号），旧全局安装里不存在新 lib 助手时同样
```

</details>

**依据 2 · 源码核查**：[bin/dsh-tui.js:84-92](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/bin/dsh-tui.js#L84-L92)

救援仍共享home fallback

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

**依据 3 · 源码核查**：[src/dsh-adapter/approvals.ts:1-20](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/src/dsh-adapter/approvals.ts#L1-L20)

审批队列和一次性结果

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Approval store — the UI-side answerer half of the DSH approval seam
 * (`ctx.approval`). The harness's permission layer asks
 * `ApprovalService.request()`, which dispatches an `approval/request`
 * waterfall; the listener registered in plugin.ts parks the request here,
 * surfaces one ask at a time to the TUI permission prompt, and settles the
 * harness promise when the user decides, the
 * asker's abort signal fires, or the plugin tears down.
 *
 * Queue semantics mirror QuestionStore: parallel tool calls can trigger
 * several asks before any answer is given, so asks are drained FIFO.
 * Outcomes are the protocol's closed set — `'allowed-once'` and
 * `'rejected'` from the panel, `'cancelled'` on abort/teardown; there is
 * no allow-always or feedback channel in the protocol.
 *
 * The store presents its asks through the shared permission-panel shape
 * (`src/channel/permissions.ts`), so the one approval panel renders DSH and
 * backend prompts alike: a DSH ask offers exactly the protocol's two
 * options (allow once / reject), and the DSH-only facts (the `external`
 * source badge, the background-session id) ride along on the snapshot.
```

</details>

**依据 4 · 源码核查**：[src/dsh-adapter/approvals.ts:49-64](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/src/dsh-adapter/approvals.ts#L49-L64)

external请求边界

<details>
<summary>查看原文（16行）</summary>

```text
  /** The gated command, recovered from the paired tool/call event. */
  readonly command?: string
  /**
   * The request is not anchored to a live tool call of this session (no or
   * unknown callId, the paired call already settled, or the callId is
   * already in flight or consumed by another ask — a genuine approval is
   * asked exactly once per call). A duplicate callId marks EVERY ask on it
   * (the pre-existing one included — attacker-first order) so the verdict
   * can never invert onto the genuine ask). The approval waterfall is an in-process event
   * any plugin can dispatch, so the panel renders a loud warning instead of
   * presenting the text as the agent's own pending command. Verdicts that
   * depend on the session log are re-checked while the ask is queued or on
   * the panel, so they may also appear late — once a same-callId sibling
   * ask is allowed and its tool/result lands (P-4). The in-flight dedup
   * verdict, by contrast, is determined at park() and needs no result to
   * land.
```

</details>

#### 缺口

- 目标终端渲染、审批中断及长会话恢复完整性未实测。
  **影响**：终端协议和恢复组合未知，影响长任务状态可信性。
  **进一步探讨**：在目标terminal/tmux/SSH组合核对live与replay工具行、审批取消和窄屏渲染，不把截图当全环境通过。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 换终端前端是否需要迁移所有会话和配置？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次安装对应包与profile并配置provider，持续维护全局launcher/profile与宿主版本，保存的模型/effort/display偏好也有迁移负担。执行成本仍由所选模型和原宿主工具决定，状态条成本估算不是实际账单。失败可用原DSH入口或safe profile排查，但必须保留会话和home配置；safe不是独立沙箱。对有终端偏好的用户可在测试profile试用，先核对同一会话输入、工具审批和恢复，再迁移长任务。

#### 证据与依据

**依据 1 · 源码核查**：[bin/dsh-tui.js:7-24](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/bin/dsh-tui.js#L7-L24)

启动和更新负担

<details>
<summary>查看原文（18行）</summary>

```text
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
 *
 * 自举角色判定用 realpath：Windows Junction 轨（profile 指回仓库）与
 * `pnpm run dev` 源码运行都会折叠成同一物理目录 → 走完整逻辑，不会
 * 自己委托自己形成循环。
 *
 * 本文件必须保持零 lib/ 依赖：/update 的启动器迁移只覆写这一个文件
 * （外加 package.json 的版本号），旧全局安装里不存在新 lib 助手时同样
```

</details>

**依据 2 · 源码核查**：[src/dsh-adapter/index.ts:57-80](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/src/dsh-adapter/index.ts#L57-L80)

模型路由与effort偏好

<details>
<summary>查看原文（24行）</summary>

```text
  /** LLM provider route. The route resolves atomically (issue #67): the
   *  `/model` choice persisted in `~/.dsh-tui/model.json` — the route the
   *  last session ran — wins whole; otherwise a `provider`+`model` pair named
   *  here is the deployment DEFAULT; otherwise `agentDefaultModel` supplies
   *  the provider-neutral Harness default. A bare embedder without that
   *  service falls back to DeepSeek. A half-pinned pair (only one of the two
   *  keys) is ignored outright and never half-overrides the persisted
   *  choice. */
  provider?: string
  /** Model override passed to the agent; resolved together with `provider`
   *  as one atomic route (see `provider`). */
  model?: string
  /** Session working directory. When absent, the git worktree root
   *  containing the invoking directory wins (the invoking directory itself
   *  outside any worktree) — never a bare launch subdirectory (issue #96). */
  cwd?: string
  /** Absolute local path, file URL, or provider URI resolved before the
   *  initial agent is created. */
  workspace?: string
  /** Reasoning effort applied to every request, validated against the live
   *  route's adapter levels (an unlisted level is ignored and the adapter
   *  default applies). This is the deployment DEFAULT beneath the persisted
   *  `/effort` choice (the level the last session ran); it also seeds the
   *  startup status line until the first request header reports the live
```

</details>

**依据 3 · 源码核查**：[bin/dsh-tui.js:84-92](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/bin/dsh-tui.js#L84-L92)

safe profile边界

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

#### 缺口

- 安装升级时间、长会话资源和配置退出残留未测。
  **影响**：升级和退出偏好残留未知，可能增加持续维护。
  **进一步探讨**：在测试profile记录全局/profile升级、safe启动与移除偏好后恢复原入口的步骤和耗时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何确认丰富终端展示没有制造重复或误导状态？

**研究主题**：新假设与验证

#### 完整回答

由live/replay共享projector和分层reset推导未验证假设：用一份固定会话事件轨迹同时驱动实时输入与重放，比较最终工具行、审批状态和上下文占用，可以比单纯截图测试更早发现状态分叉。加入断流、取消、后台工具和恢复路径，对照原生会话事件真相；如果两种投影不一致，就先修模型而不是补更多动画。该假设以状态等价为目标，不把视觉丰富本身当生产收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-adapter/channel/projection.ts:39-73](https://github.com/ccch1mneyyy/dsh-TUI/blob/29572774890a4a89ae1fa562dd15a1ae21bb3593/src/dsh-adapter/channel/projection.ts#L39-L73)

共享投影和live/replay入口可用于等价检验

<details>
<summary>查看原文（35行）</summary>

```text
/** One reducer for both durable replay and live session events. */
export function createChannelProjection(state: ProjectionState, deps: ProjectionDependencies) {
  const translator = createDshTranslator({
    tools: () => deps.tools,
    scope: () => deps.agent(),
    attachments: () => deps.attachments(),
  })
  const projector = createSharedProjection(state, {
    rowIds: deps.rowIds,
    resetContextWarning: () => deps.resetContextWarning(),
    checkContextWarning: () => deps.checkContextWarning(),
    notify: (...args) => deps.notify(...args),
    jobs: deps.jobs,
    inputConvergence: deps.inputConvergence,
    get renderer() { return deps.renderer },
    selectionAttached: messageId => deps.selectionAttached(messageId),
    pricingWindow: dshPricingWindow,
  })
  return {
    /** Forget every per-session ledger on both halves. */
    reset(): void {
      translator.reset()
      projector.reset()
    },
    replayEvents(events: readonly SessionEvent[]): void {
      projector.apply(translator.translateReplay(events), REPLAY)
    },
    renderEvent(event: SessionEvent): void {
      projector.apply(translator.translateEvent(event), LIVE)
    },
    renderStreamFrame(frame: AssistantStreamFrame): void {
      projector.apply(translator.translateFrame(frame), LIVE)
    },
    settleStreaming: projector.settleStreaming,
    updateSpinnerMode: projector.updateSpinnerMode,
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
