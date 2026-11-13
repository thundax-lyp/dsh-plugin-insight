# dsh-TUI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[de73c6f](https://github.com/ccch1mneyyy/dsh-TUI/tree/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3)

<!-- BEGIN META -->
[![GitHub ★ 7,515](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C515&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ccch1mneyyy/dsh-TUI) [![npm 30d 74,635](https://img.shields.io/static/v1?label=npm+30d&message=74%2C635&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui)
<!-- END META -->

> **功能**：为 DSH 提供交互式终端客户端，显示会话、工具状态、流式输出和上下文。

> **亮点**：[Q01](#research-q01) 将 DSH 工作反馈放进同一终端。[Q02](#research-q02) 明确区分已有屏幕复用和独立挂载。

> **主要限制**：[Q03](#research-q03) 首次启动会写专用 profile，实际兼容和旧会话恢复需要先用固定宿主核对。

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
  - [Q01 · 终端界面为哪些 DSH 任务减少操作？](#detail-section-11)
  - [Q02 · 入口和 profile 如何绑定 DSH，怎样避免重复装载？](#detail-section-12)
  - [Q03 · 首次启动、版本漂移与回退有什么实际负担？](#detail-section-13)
  - [Q04 · 怎样验证切到 TUI 后会话是否更易恢复？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向经常在终端运行 DSH 的用户，用同一屏处理会话和工具活动。

以可用的 DSH 原 CLI 和 Web 界面为比较基线，重点检查同样的审批与会话恢复任务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 终端会话 | 在终端操作 DSH | 需要匹配 profile、宿主和终端 |
| 复用屏幕 | 避免挂载第二个运行时界面 | 按同进程句柄和作用域判断 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配 DSH、Node 及 pnpm | 首次 DSH profile 必需 | 加载专用适配器 | 核版本与安装结果 |
| 合适终端与账号 | 交互按需 | 渲染与模型调用 | 保留原 CLI/Web |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选隔离配置 | 确认安装写入范围 |
| 核对 | 用户启动新会话，再恢复已知会话 | 工作区和会话对应 |
| 退出 | 用户回到原界面 | 保留失败日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 环境与模型费用未知 | 核版本和凭据 | 会写专用 profile |
| 持续 | 模型与终端资源未知 | 检查渲染和状态 | 无耗时对照 |
| 失败及退出 | 重跑成本未知 | 核错会话与兼容 | 原界面作为退路 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 终端接线 | 实际 DSH 适配与服务等待 | 不同终端渲染表现 |
| 恢复 | 启动配置与适配路径 | 续会话身份正确率 |

> **思考**：[Q03](#research-q03) 首次启动会写专用 profile，实际兼容和旧会话恢复需要先用固定宿主核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将 DSH 工作反馈放进同一终端。[Q02](#research-q02) 明确区分已有屏幕复用和独立挂载。

[Q02](#research-q02) 的等待与接入句柄避免 loader 与运行时彼此等待，并抑制已销毁作用域继续挂屏。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 首次启动会写专用 profile，实际兼容和旧会话恢复需要先用固定宿主核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在隔离 DSH home 先试已知新会话，再检查恢复与退出。避免把首次自动初始化用于现有重要配置。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认实际 profile 和 Cordis 运行时，真实安装、账号和终端行为未验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/dsh-adapter/index.ts、package.json、src/index.ts、bin/dsh-tui.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定 DSH 接线及 launcher，未验其他后端、账号、真实终端或兼容矩阵。
- 下一步：按 [Q04](#research-q04) 用已知会话核恢复、退出及重复装载。

**分析版本**

- **仓库**：[ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI)
- **版本号**：0.19.0（[固定提交 de73c6f](https://github.com/ccch1mneyyy/dsh-TUI/tree/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对照终端会话中断后的恢复，出现错会话或准备时间抵消节省时保持原用法。

按 [Q04](#research-q04) 用已知会话核恢复、退出及重复装载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 132 | 32594 | — | — | 485890 |
| .mjs | source | 228 | 56063 | 43855 | 9443 | — |
| .js | source | 5 | 2337 | 1735 | 510 | — |
| .mjs | test | 6 | 1293 | 1183 | 26 | — |
| .mjs | example | 3 | 252 | 194 | 46 | — |
| .cjs | source | 5 | 482 | 329 | 131 | — |
| .ts | source | 1859 | 252086 | 174190 | 63769 | — |
| .tsx | source | 458 | 170507 | 132995 | 30797 | — |
| .ts | example | 4 | 753 | 558 | 143 | — |
| .js | example | 1 | 66 | 21 | 40 | — |
| .md | example | 1 | 39 | — | — | 383 |
| .mts | source | 2 | 168 | 120 | 39 | — |
| .ts | test | 5 | 291 | 172 | 102 | — |
| .js | test | 5 | 676 | 577 | 63 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/ccch1mneyyy/dsh-TUI/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在终端操作 DSH 时，TUI 能怎样承接会话，怎样控制首次安装、恢复和重复装载？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 终端界面为哪些 DSH 任务减少操作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向日常从终端启动 DSH 并需要看到工具、审批和上下文的人。作者描述终端流式文本、工具卡、会话搜索与通知。代码确认该客户端确实挂接 DSH Agent 与工作区并承接会话，界面工作位在终端。相对基本 CLI，它把查看工具状态和交互控件留在同一屏。已有 Web 且需要图形界面的人可能更习惯原工作流。合格任务包括回到正确工作区和会话，辨认工具阶段，并正常退出。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-25](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/README.md#L20-L25)

作者定义产品与后端归属。

```text
> An interactive terminal UI for DeepSeek Harness. It ships a pixel-whale
> header, live work status, streaming thinking, double-Esc time rewind, a
> context progress bar, and a TPS gauge. Zero core changes: it consumes only
> DSH's public exports, and is moving from a mounted plugin to an app with its
> own entry and composition root, where DSH loads in process as the first-party
> backend. Install to enable; uninstall leaves no patches behind.
```

**依据 2 · 作者声明**：[README.md:45-55](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/README.md#L45-L55)

作者描述终端界面与交互。

<details>
<summary>查看原文（11行）</summary>

`````text
- **Launchpad and first-run guide** — every ordinary launch lands on a landing page with a **real input box** (big text + whale + quick actions, dropping whole blocks on short/narrow terminals; whale-girl images use a compact native-canvas footprint instead of leaving a large gap before the title; on by default — /settings `launchpad` off boots straight into chat); command completion matches chat: `Tab` fills the input, `Enter` runs the command and clears it. The first run walks a four-step wizard (accounts & models / language+theme / model+workspace / shortcuts), re-runnable with `/setup`; its first step signs in to a subscription and catches the models it brings in (none → no question, one → that one, several → you choose), or adds an API key through the `/provider` wizard, which asks which of the enabled models to switch to or keeps the current one.
- **Terminal-native UI** — streaming Markdown, tool cards, `/` and `@` completion, `#L12-14` ranges, history search, zh/en UI.
- **Notifications** — one switch covers four system notifications: task completion, a tool approval waiting for your decision, a question waiting for your answer, and a plan review waiting for your decision. Task completion: DSH, Claude and Codex notify after successful live work settles, with no queued follow-up or active goal. The title is “dsh-TUI · Task complete”; the body shows the latest settled reply as a single-line plain-text preview (Markdown formatting removed, up to 200 characters). OSC 777/9 apply an additional 2048-byte sequence budget, including title and protocol bytes, preserving whole graphemes. No reply shows only the title; BEL only rings. `/settings` → Conversation: `taskNotifications` = `unfocused` (default), `always`, or `off`; `notificationMethod` = `auto` (default), `osc9`, `bel`, or `windows`. Auto uses separate title/body fields on Ghostty/WezTerm (OSC 777) and Kitty (OSC 99); iTerm2/Warp and explicit `osc9` use a title prefix; other terminals ring the bell; delivery follows your terminal's notification/bell settings. On local Windows, `auto` resolves to `windows`, the system's native notifications: a task-completion toast. The first toast registers that user's AppUserModelID under HKCU, the toast appears about 3 seconds after the task ends (the PowerShell cold start that buys the no-extra-install route), and for DSH sessions an enabled, active external DSH notification plugin in the running profile makes dsh-TUI yield to it (no toast, no bell); an installed but disabled plugin does not suppress notifications; if that AppUserModelID cannot be written, the notification falls back to the bell instead of going silent. `jumpBack` (Windows, off by default) turns these toasts into a way back to the pane that raised them; it needs the native toast path (`notificationMethod` = `windows`, which `auto` picks on local Windows). With `/settings` → Conversation → `jumpBack` on, the pane title ends with `[dsh-tui:<16 hex>]`, one marker for the life of the process; switching it off removes the suffix at once. While it is on, this process refreshes a marker file at `~/.dsh-tui/notify/jumpback/<session>.json` (`schemaVersion: 1`, `marker`, `pid`, `startedAt`) when the setting is turned on and before each notification it sends, and the first toast that can promise a jump registers the per-user protocol handler (`URL Protocol` plus `shell\open\command`) under `HKCU\Software\Classes\dsh-tui`; a normal exit removes the file, and removes the key once no other live instance still needs it. Only a pre-send probe that finds exactly one target pane (or tab title) puts an activation URI on the toast; clicking it re-runs five checks — same pane, keyboard focus, marker still in the title, foreground window, not minimized — and refuses rather than jumping anywhere else when any of them fails. A click whose target has gone away changes nothing. Layouts that cannot be verified — a pane in an unselected tab that is not that tab's focused pane, profiles using `suppressApplicationTitle`, and terminals other than Windows Terminal (tested on Windows Terminal 1.24) — get a plain toast whose click changes nothing. The probe adds about half a second before each toast; the first one after enabling can also wait for the helper to compile (a few seconds, once), and a machine whose in-box compiler keeps failing retries it at most every five minutes. External notification senders can read the same marker file and point their own toast at `dsh-tui:activate?m=<marker>`; the URI and file format are a read-only contract, and this release ships no plugin-side implementation. SSH sessions keep the attached terminal's notification protocol in `auto` mode; explicit `windows` still selects the host's native transport. tmux requires `set -g allow-passthrough on` for OSC notifications and `set -g focus-events on` for focus reporting. Terminals without focus reporting need `always`. Replay, cancellation and failures do not notify. Works in inline and fullscreen modes. A tool approval adds its own notification: the title is “dsh-TUI · Approval needed”; the body carries the session name, the tool name and the asker's reason. The reason is host-provided text (the model's own justification can appear verbatim), so it is normalized to one plain line and length-capped, but the body makes no redaction promise; the tool call's arguments are never read for it. A native toast still being prepared is dropped if the switch turns off, the session is no longer the attached one, or the approval, question or plan review is no longer waiting. Every approval notifies, and only the current session’s does; background sessions and subagents stay quiet. The switch covers all four, so `off` silences approvals, questions and plan reviews along with completions. An enabled, active external DSH notification plugin still makes dsh-TUI yield for completions, approvals and questions; a plan review never yields, and outside local Windows (or in SSH) the existing terminal notification protocol or bell is used. An ordinary question adds its own notification: the title is “dsh-TUI · Waiting for your answer” and the body carries the first question's header and question; options and detail stay in the panel. Local wizard and sign-in questionnaires announce the same way; a subagent's question stays in the panel in this release; the 0.2.2 approval-intent asks are announced the same way as an ordinary question. A plan review is announced as “dsh-TUI · Plan review” and carries the question header and question, never the plan itself, and it is the one notice that does not yield: an external notifier maps approvals and ordinary questions to its own notification but not a plan review, so yielding would leave only its generic idle notice, which never says a plan review is waiting.
- **Native cursor** — focused text inputs inherit your terminal's cursor shape, color, blinking, and enabled animation or trail effects in both inline and fullscreen modes. The `/model` picker shows the same cursor during movement between provider tabs, model rows, and effort levels, then hides it after **0.5 seconds at rest**; clipped regions fall back to the model row. The session manager also moves this cursor between the workspace rail, session rows, and search box; typing claims the search caret, and navigation returns it to the focused row. Configure animation and trail effects in your terminal.
- **Images** — Kitty/Sixel thumbnails, centered preview with zoom and pan, paste-time fitting, text fallback. Kitty images scale to the reserved cells' physical pixels, including on HiDPI terminals.
- **Mermaid diagrams** — ````mermaid ```` fences drawn as Unicode diagrams.
- **LaTeX math** — `$…$` and `$$…$$` formulas as Unicode text, fractions and limits stacked in display blocks; `mathRendering: image` typesets block and one-row inline formulas as terminal images on graphics terminals.
- **Timeline rail** — every turn clickable; timeline / scrollbar / hidden gutter.
- **Side panel** — `Ctrl+B` splits the chat with a panel column once the terminal is wide enough; drag the divider to resize it. All eight built-in panels are enabled by default, and so are plugin panels registered later (`sidePanel.panels: '*'`; untick a row in `/settings` to switch to an explicit list). The header shows each inactive panel's symbol; hover to see its name. Narrow terminals and inline mode keep full-screen panels. In the `todo` panel a long goal wraps to the panel width with its phase on a separate row; when the content exceeds the viewport, focus the panel and scroll with `↑`/`↓` or the wheel (every todo is reachable too) (the compact goal row above the chat input stays a single truncated line with a hover tooltip).
- **Live state** — activity animation, context bar, TPS, cache hit rate, effort, tokens, session cost estimate (main + subagents), Git and session metadata. Title, trajectory-strip and session-state animations update independently of the transcript and pause when idle or unfocused.
  Context-bar fill follows backend occupancy; colors estimate content composition. Compaction clears obsolete estimates, and missing composition displays a single used block with a measured used count in both hover details.
`````

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:402-411](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/cordis.patch.yml#L402-L411)

实际根 TUI 行和服务依赖。

<details>
<summary>查看原文（10行）</summary>

```text
    # The interactive front door. The plugin creates/resumes its agent at
    # runtime, seeds the startup status line, and disposes the whole app tree
    # (exiting the process) when the TUI unmounts. `dsh-tui --resume`
    # feeds the session id through DSH_TUI_RESUME_SESSION (see
    # src/sessionHistory.ts for the launcher contract).
    - id: dsh-tui
      name: '@deepseek-harness-tui/dsh-tui'
      # The entry-level dependency augments the plugin's `agents` inject and
      # prevents startup Session creation from racing WorkspaceRegistry init.
      inject: [workspaceRegistry, agents, tuiWorkspaces, tuiScenes, tuiPanels, tuiDialogs, tuiStatus, tuiShortcuts, tuiRenderers, tuiThemes]
```

</details>

**依据 4 · 源码核查**：[src/dsh-adapter/index.ts:485-512](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/src/dsh-adapter/index.ts#L485-L512)

宿主行按当前屏幕实例选择实际挂载路径。

<details>
<summary>查看原文（28行）</summary>

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
```

</details>

#### 缺口

- 真实终端交互效果未比较。
  **影响**：不能据界面功能数量推断更快。
  **进一步探讨**：比较同一审批和恢复任务的正确率及动作数。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口和 profile 如何绑定 DSH，怎样避免重复装载？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

根 bundle 在 DSH base 组合之上挂终端适配器，根入口再导出该适配器。补丁还给 TUI 行增加工作区、Agent 和终端扩展依赖。apply 若看见入口已经挂屏幕就标记该行并复用屏幕，等宿主 loader 就绪后领取一次接入句柄，已有接入的重复行会空转并告警。若未见入口，则在 loader 就绪后创建 Cordis 子运行时。两个分支都在作用域结束后检查 disposed，避免旧实例迟到启动。这个防护主要约束同一运行过程里的接线，跨终端重开或版本不匹配需要另验。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:596-599](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/package.json#L596-L599)

根包 bundle 声明。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

**依据 2 · 源码核查**：[src/index.ts:1-5](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/src/index.ts#L1-L5)

根出口到宿主适配器。

```text
import './force-production-react.js'

// Re-export shim: the plugin factory lives in src/dsh-adapter/index.ts
// (the only module tree allowed to import official @deepseek-ai/* packages).
export * from './dsh-adapter/index.js'
```

**依据 3 · 源码核查**：[cordis.patch.yml:407-422](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/cordis.patch.yml#L407-L422)

服务注入和缺少终端扩展的降级说明。

<details>
<summary>查看原文（16行）</summary>

```text
    - id: dsh-tui
      name: '@deepseek-harness-tui/dsh-tui'
      # The entry-level dependency augments the plugin's `agents` inject and
      # prevents startup Session creation from racing WorkspaceRegistry init.
      inject: [workspaceRegistry, agents, tuiWorkspaces, tuiScenes, tuiPanels, tuiDialogs, tuiStatus, tuiShortcuts, tuiRenderers, tuiThemes]
      # `tuiWorkspaces`/`tuiScenes` (and the dsh-tui-extensions services,
      # including `tuiThemes`)
      # live in the entry-level inject ONLY as an ordering (and reload-rebind)
      # guarantee alongside their service rows
      # above — they are deliberately absent from the plugin's code-level
      # inject (issue #183): the dsh CLI may read this patch from an older
      # copy of the package than the plugin module it loads, and a hard
      # code-level inject then deadlocks the tree at boot ("pending (waiting
      # for service: tuiWorkspaces)"). Without the rows the TUI degrades:
      # /workspace falls back to the local-only runtime, plugin scenes never
      # open. (The comment sits below the inject line:
```

</details>

**依据 4 · 源码核查**：[src/dsh-adapter/index.ts:485-515](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/src/dsh-adapter/index.ts#L485-L515)

已有屏幕与无入口的两分支。

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

**依据 5 · 源码核查**：[src/dsh-adapter/index.ts:520-540](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/src/dsh-adapter/index.ts#L520-L540)

就绪后领取接入句柄、重复行及失败提示。

<details>
<summary>查看原文（21行）</summary>

```text
function attachToEntry(ctx: Context, config: RuntimeConfig<Config>): void {
  let disposed = false
  ctx.effect(() => () => { disposed = true })
  const loader = ctx.get('loader') as { await(): Promise<unknown> } | undefined
  void (loader?.await() ?? ctx.fiber.await()).then(() => {
    if (disposed) return
    // Taken only now: a row that unloads before the Loader settled leaves the
    // first attach to the next row. A later row takes over only once the
    // previous one unloaded (#1651).
    const attach = takeEntryAttach() ?? peekEntrySlot()?.reattachDsh?.()
    if (attach === undefined) {
      ctx.logger.warn('dsh-tui: the entry\'s screen already holds a DSH session; this dsh-tui row stays idle')
      return
    }
    return ctx.plugin({
      name: 'dsh-tui-runtime',
      apply: (runtimeCtx: Context) => attach(runtimeCtx, config, ctx),
    })
  }).catch((error: unknown) => {
    ctx.logger.error(`dsh-tui: the DSH side failed to start under the entry's screen: ${error instanceof Error ? error.message : String(error)}`)
  })
```

</details>

#### 缺口

- 未观察同版本宿主重组和并行进程。
  **影响**：不能由 disposed 守卫推出所有启动场景无残留。
  **进一步探讨**：用隔离配置验证正常启动、二次装载和卸载途中重组。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 首次启动、版本漂移与回退有什么实际负担？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

launcher 首次走实际 dsh 和 pnpm 探测，再用 dsh plugin add 写入 dsh-tui profile。默认启动会涉及持久 profile，即使只是看看界面也会改变该隔离配置，准备时应区分已有用户配置和临时测试。作者主要目标为 DSH 0.2.2-rc.1，声明旧版兼容分支与账户设置差异；这不是本轮已验兼容。模型凭据按所选后端设置。成本包括版本对齐、终端能力和账号配置，模型用量与排障成本未知。优先试新会话，确认退出码和工作区，再尝试恢复隔离样本。若初装失败或启动后会话错位，保留失败日志和原配置，回到已可用的 DSH CLI 或 Web。

#### 证据与依据

**依据 1 · 源码核查**：[bin/dsh-tui.js:1380-1408](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/bin/dsh-tui.js#L1380-L1408)

探测 dsh 和 pnpm，再实际执行安装。

<details>
<summary>查看原文（29行）</summary>

```text
    return false
  }
}
const bootstrapProfile = () => {
  const probe = spawnSync(...cmd('dsh', ['--version']), { stdio: 'pipe', ...shellOpt })
  if (probe.error || probe.status !== 0) {
    console.error(msg('noDsh'))
    process.exit(1)
  }
  const pnpmProbe = spawnSync(...cmd('pnpm', ['--version']), { stdio: 'pipe', ...shellOpt })
  if (pnpmProbe.error || pnpmProbe.status !== 0) {
    console.error(msg('noPnpm'))
    process.exit(1)
  }
  console.log(msg('bootstrapStart'))
  const runAdd = (extraArgs, capture) => spawnSync(
    ...cmd('dsh', ['plugin', '--profile', PROFILE, 'add', ...extraArgs, `${PACKAGE}@${installVersion}`]),
    { stdio: capture ? ['inherit', 'pipe', 'pipe'] : 'inherit', ...shellOpt },
  )
  let add = runAdd([], true)
  if (add.status !== 0) {
    const captured = `${add.stdout ?? ''}${add.stderr ?? ''}`
    process.stderr.write(captured)
    if (captured.includes('ERR_PNPM_ADDING_TO_ROOT')) {
      console.log(msg('bootstrapRetryW'))
      add = runAdd(['-w'], false)
    }
  } else {
    process.stdout.write(`${add.stdout ?? ''}${add.stderr ?? ''}`)
```

</details>

**依据 2 · 作者声明**：[README.md:126-149](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/README.md#L126-L149)

作者说明主目标版本、账户与旧版配置。

<details>
<summary>查看原文（24行）</summary>

```text
[deepseek-harness](https://github.com/deepseek-ai/deepseek-harness).
The `deepseek-official` API-key route needs `DEEPSEEK_API_KEY`. On DSH
0.2.0-rc.1+, the standard profile can instead use `/auth login deepseek-account`
and select the separate account route through `/model`. Other supported
accounts can sign in through `/provider` or `/auth` after startup.

The primary compatibility target is DSH `0.2.2-rc.1`. This adapter supports its
Shell API, V4 session messages, declarative presets, and profile-backed settings;
older supported hosts retain their compatibility paths. See [configuration](docs/configuration.en.md).

On DSH 0.2.1-rc.2 and later, `/settings` also selects DeepSeek Search / Fetch APIs and edits their
endpoint and result limits, supporting custom Loader entry IDs and a masked API
key input saved through DSH's credential store. Official Flash model labels show the `1017` release
marker while retaining the `deepseek-flash` model ID.

`/settings` groups its sections into pages: the TUI's own settings sit under
**General**, and plugins that declare a page get their own tab (`Tab` / `Shift+Tab`, or a click on the strip in fullscreen, switches pages; the strip is hidden when only one page exists).

On DSH 0.1.7, `/settings` uses the TUI's actual Loader entry ID, including custom
IDs. It requires matching profile dependencies with `@deepseek-ai/schemastery`
3.18.3 or newer; an incompatible schema stops TUI startup with repair guidance
instead of showing an uneditable settings page. Older hosts keep their legacy settings scope.

The `dsh-tui` section of `/settings` is saved in `~/.dsh-tui/settings.json`, shared by
```

</details>

**依据 3 · 作者声明**：[README.md:154-165](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/README.md#L154-L165)

作者说明初装和手工 profile 路径。

<details>
<summary>查看原文（12行）</summary>

````text
# Install the CLI and this plugin globally (ships the dsh-tui command)
npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui

# Start (first run auto-initializes the profile; needs pnpm)
dsh-tui
# Both `dsh-tui` and the short `dst` alias start the same TUI.
dst
```

Manual alternative: `dsh plugin --profile dsh-tui add @deepseek-harness-tui/dsh-tui`.
The repo's `sh install.sh` runs that step and checks the required commands.
Afterwards `dsh-tui` and `dsh --profile dsh-tui` are equivalent.
````

</details>

#### 缺口

- 未验发行包、账号和真实升级。
  **影响**：无法保证不同平台和版本的持续可用性。
  **进一步探讨**：用固定包与宿主隔离启动并核恢复和退出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证切到 TUI 后会话是否更易恢复？

**研究主题**：新假设与验证

#### 完整回答

假设 TUI 在终端使用者常见的中断恢复场景能减少切换，同时保持会话、工作区和模型选择一致。用两个已知工作区准备具有相同历史的会话，在两个相同终端环境交叉比较原 CLI 和 TUI。记录进入正确会话的用时、恢复后的首条事件与是否出现重复屏幕。加入一次未就绪或版本缺项，核对退回原方式所需操作。若恢复身份错配、重复挂载或额外 setup 时间抵消节省，就不支持切换。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-adapter/index.ts:485-515](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/src/dsh-adapter/index.ts#L485-L515)

运行时屏幕及加载条件。

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

**依据 2 · 源码核查**：[src/dsh-adapter/index.ts:520-540](https://github.com/ccch1mneyyy/dsh-TUI/blob/de73c6f3e5fa8c5b98b7fc87907395f5832c8aa3/src/dsh-adapter/index.ts#L520-L540)

可构造重复装载负例。

<details>
<summary>查看原文（21行）</summary>

```text
function attachToEntry(ctx: Context, config: RuntimeConfig<Config>): void {
  let disposed = false
  ctx.effect(() => () => { disposed = true })
  const loader = ctx.get('loader') as { await(): Promise<unknown> } | undefined
  void (loader?.await() ?? ctx.fiber.await()).then(() => {
    if (disposed) return
    // Taken only now: a row that unloads before the Loader settled leaves the
    // first attach to the next row. A later row takes over only once the
    // previous one unloaded (#1651).
    const attach = takeEntryAttach() ?? peekEntrySlot()?.reattachDsh?.()
    if (attach === undefined) {
      ctx.logger.warn('dsh-tui: the entry\'s screen already holds a DSH session; this dsh-tui row stays idle')
      return
    }
    return ctx.plugin({
      name: 'dsh-tui-runtime',
      apply: (runtimeCtx: Context) => attach(runtimeCtx, config, ctx),
    })
  }).catch((error: unknown) => {
    ctx.logger.error(`dsh-tui: the DSH side failed to start under the entry's screen: ${error instanceof Error ? error.message : String(error)}`)
  })
```

</details>

#### 缺口

- 未运行恢复实验。
  **影响**：保留作为可证伪的使用假设。
  **进一步探讨**：按固定后端与终端做交叉对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
