# dsh-tianshu-tui

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[dcf2c4b](https://github.com/huiliyi37/dsh-tianshu-tui/tree/dcf2c4bd32b2a726620f38d3f076a0366267cb46)

<!-- BEGIN META -->
[![GitHub ★ 295](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=295&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/huiliyi37/dsh-tianshu-tui) [![npm 30d 1,860](https://img.shields.io/static/v1?label=npm+30d&message=1%2C860&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huiliyi37/dsh-tianshu-tui) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huiliyi37/dsh-tianshu-tui)
<!-- END META -->

> **功能**：在官方 DSH 上装配终端 runner、ANSI 交互与预设/LSP接缝，并带本地审批和启动更新。

> **亮点**：移植渲染核心并将原生Agent状态/输入、会话与工程诊断接到终端工作面，保持展示与会话权威分层。来源映射不等于新Agent算法。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：整个bundle超出展示层：本地快捷模式可自动allowed-once，LSP可npx启动，npm启动更新会改profile；skip在fetch之后判，不能保证完全无查询。见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 谁需要天枢TUI，比默认终端/Web多什么？](#detail-section-11)
  - [Q02 · 输入、事件、渲染和退出如何接线？](#detail-section-12)
  - [Q03 · 审批、预设、LSP与启动更新改变哪些边界？](#detail-section-13)
  - [Q04 · 实际安装和日常使用怎样闭环？](#detail-section-14)
  - [Q05 · 全周期成本和效果有什么依据？](#detail-section-15)
  - [Q06 · 谁可试用，未来方向怎样证伪？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向终端偏好且能管理profile的DSH操作者，合格结果是输入/状态/审批/恢复正确和终端退出正常。见[Q01](#research-q01)。

默认TUI或Web更少额外依赖，天枢增加键盘面板、显示与工程接线；任务效率和终端兼容尚无独立对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：ANSI终端、流式内容/工具和会话面板。
- **Agent/Preset**：bundle装配宿主预设，Agent执行仍由宿主负责。
- **事件监听**：Agent/Session投影与审批answerer。
- **后台**：启动自更新和可选LSP本地进程接缝。
- **用户命令**：/yolo及键盘模式会改变本地审批行为。

**流程与依赖**

官方宿主、fork/官方运行依赖、TTY/宽度、权限及更新/LSP网络各有门槛，不能只装根包或按主题清单验收。详表见[Q04](#research-q04)。

一次性profile先核版本/更新和普通审批，再按已知任务验证输出、切会话、resize/退出与可选桥接。执行者和失败动作见[Q04](#research-q04)。

**效果与成本**

净价值需扣除环境、授权和故障核验；节流参数不等于实测流畅或模型节费。分阶段成本与效果表见[Q05](#research-q05)。

终端偏好者可能减少界面切换和状态查看负担，但正确审批与真实任务验收优先；保留条件见[Q06](#research-q06)。

> **思考**：整个bundle超出展示层：本地快捷模式可自动allowed-once，LSP可npx启动，npm启动更新会改profile；skip在fetch之后判，不能保证完全无查询。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：移植渲染核心并将原生Agent状态/输入、会话与工程诊断接到终端工作面，保持展示与会话权威分层。来源映射不等于新Agent算法。见[Q01](#research-q01)、[Q02](#research-q02)。

输入走Agent、状态走投影、引擎端口和清理有明确分层；整个bundle的权限、进程和依赖变更仍超出显示层。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

整个bundle超出展示层：本地快捷模式可自动allowed-once，LSP可npx启动，npm启动更新会改profile；skip在fetch之后判，不能保证完全无查询。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限试一次性profile/可丢弃目录，先普通模式与固定版本，独立核自动更新、LSP和伴生能力。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持原生runner、输入/投影、渲染节流与清理、审批快捷模式及自动更新；目标终端、权限/更新和任务收益未运行验收。变更条为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、SOURCE-MAP.md、cordis.patch.yml、docs/plugins.md、package.json、src/adapter/live.ts、src/adapter/send.ts、src/controllers/approval-controller.ts、src/engine/live-engine.ts、src/engine/write-batcher.ts、src/index.ts、src/port.ts、src/self-update.ts、src/ui/app.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向审runner/bundle、输入与live投影、ANSI预算/节流、审批controller、会话/终端清理、自更新和LSP装配；未全审全部预设、伴生memory/vision、fork库、外部编辑器或终端协议攻击面。
- 下一步：未运行目标/安装脚本；后续固定宿主终端核状态/审批/恢复、自动更新与skip查询、LSP进程和退出，记录任务正确、帧时/CPU、误放行及维护成本。见[Q04](#research-q04)至[Q06](#research-q06)。

**分析版本**

- **仓库**：[huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui)
- **版本号**：1.0.0-rc.3（[固定提交 dcf2c4b](https://github.com/huiliyi37/dsh-tianshu-tui/tree/dcf2c4bd32b2a726620f38d3f076a0366267cb46)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用可审阅条记录临时授权范围与环境变更，检验能否减少误放行/意外版本变更而不增加过多打断。见[Q06](#research-q06)。

未运行目标/安装脚本；后续固定宿主终端核状态/审批/恢复、自动更新与skip查询、LSP进程和退出，记录任务正确、帧时/CPU、误放行及维护成本。见[Q04](#research-q04)至[Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 33 | 3590 | — | — | 54432 |
| .js | source | 2 | 30873 | 23783 | 7157 | — |
| .ts | source | 185 | 40472 | 26766 | 11071 | — |
| .mjs | source | 4 | 883 | 624 | 209 | — |
| .ts | test | 162 | 39719 | 33193 | 2943 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/huiliyi37/dsh-tianshu-tui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/huiliyi37/dsh-tianshu-tui/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/huiliyi37/dsh-tianshu-tui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：终端交互是否在状态/权限和环境变更可解释下改善coding任务，代价是否值得？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要天枢TUI，比默认终端/Web多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

偏好终端、需要在DSH查看流式Markdown/工具卡、审批、会话和工程诊断的人，是直接对象。替代是宿主默认终端入口或Web界面；本包用ANSI动态区、scrollback、键盘面板和本地偏好重新组织交互，尽量保留原生Agent/Session权威。合格结果是在目标终端正确读到状态、发出意图、审批和恢复会话，退出后终端正常，不是主题数量或截图美观。

它是host runtime的原生tui-runner bundle，不是独立可执行CLI。patch在dsh-base上插runner，还装preset registry、standard等预设、工具与LSP接缝；因此渲染引擎可称展示层，整个安装不能概括成只换外观。真正Agent推理/工具由宿主与装配组件承担。

README称自研极简引擎，SOURCE-MAP更精确说明渲染核心从作者天枢/Rivet移植，列ported/modified/new且不主张字节同一性。本文把增量归为DSH接缝、终端交互和工程整合，不将移植/既有宿主工具算新的Agent算法。只需要浏览器卡片或现有UI够用者，换TUI未必增益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-13](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/README.md#L13-L13)

作者交互终端和能力声明。

```text
**dsh-tianshu-tui**是官方 [DeepSeek Harness] 上的交互式终端 TUI 面板插件。渲染核心为自研极简 ANSI引擎，轻量渲染使用体验极度流畅。（由作者的[天枢 Tianshu-harness] https://github.com/huiliyi37/Tianshu-harness 演进而来。UI 是纯展示层：所有 agent 状态都来自会话事件流，流式 Markdown/工具卡、16+ 主题、slash 命令与选择器、输入历史与本地偏好持久化、LSP 诊断。在此之上做了工程层的改造，如图像与视觉桥接、代码智能检索、memory记忆与跨会话召回等。
```

**依据 2 · 源码核查**：[package.json:2-15](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/package.json#L2-L15)

包版本/入口与无独立bin的主声明。

<details>
<summary>查看原文（14行）</summary>

```text
  "name": "@huiliyi37/dsh-tianshu-tui",
  "description": "dsh-tianshu-tui: an interactive terminal UI plugin for the official DeepSeek Harness — streaming markdown/tool cards, 16+ themes, slash commands, session tabs, LSP diagnostics, cost tracking, self-update (`dsh plugin --profile tui add @huiliyi37/dsh-tianshu-tui`)",
  "version": "1.0.0-rc.3",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./src/*": "./src/*",
    "./package.json": "./package.json"
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1-23](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/index.ts#L1-L23)

runner名称与移植渲染说明。

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * @huiliyi37/dsh-tianshu-tui — interactive terminal UI profile bundle. The bundle
 * patch rides over dsh-base and inserts this runner under the stable
 * `tui-runner` id. Render core: the terminal rendering engine ported from
 * `.rivet/tui-source/tui/` (Apache-2.0 source; see SOURCE-MAP.md for the
 * per-file mapping). The engine is pure presentation — all agent state arrives
 * via {@link TuiPort}.
 *
 * @module @huiliyi37/dsh-tianshu-tui
 */

import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import type { ReadStream, WriteStream } from 'node:tty'
import type { SessionId } from '@deepseek-ai/dsh-session'
import type { KeyName } from './engine/input-handler.js'
import { runSelfUpdate } from './self-update.js'
import { spawnSelfRestart } from './restart.js'
import { loadCustomThemes } from './theme-custom.js'
import { TuiApp } from './ui/app.js'

/** Stable Cordis plugin name the bundle patch inserts. */
export const name = 'tui-runner'
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:12-23](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/cordis.patch.yml#L12-L23)

原生runner及宿主组件装配。

<details>
<summary>查看原文（12行）</summary>

```text
- insert:
    - id: tui-runner
      name: '@huiliyi37/dsh-tianshu-tui'

    # rc.1 起 standard preset 的 tool-subagent 行开 modelSelectionSettings: true，
    # 要求 Host scope 有 model-selection-settings 服务（官方 web-app 有、dsh-base
    # 无）——不挂则 standard 挂载整体失败、会话无工具面。shipped 组成默认关。
    - id: subagent-model-selection-settings
      name: '@deepseek-ai/dsh-tool-subagent/model-selection-settings'

    - id: cordis-host-runner
      name: '@deepseek-ai/dsh-cordis-host-runner'
```

</details>

**依据 5 · 作者声明**：[SOURCE-MAP.md:3-13](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/SOURCE-MAP.md#L3-L13)

作者来源映射及不主张字节同一性。

<details>
<summary>查看原文（11行）</summary>

```text
本包渲染核心移植自天枢（Tianshu，曾用代号 Rivet）终端 UI 引擎，Apache License 2.0：

- 上游：https://github.com/huiliyi37/Tianshu-Tui（`src/tui/` 子树）
- port 时点：本仓提交 `b26ebed`（2026-08-10）自上游 `src/tui` @ `bc2aa2a0c` 移植；上游快照不随仓分发
- 上游版权：Apache License 2.0, Copyright 2025-2026 Tianshu Contributors（许可全文见 `LICENSE`；再分发与修改声明见 `NOTICE`）

状态图例（封闭枚举；`tests/source-map.spec.ts` 校验 src 全覆盖与取值合法，不做同一性核验）：

- `ported` — 自上游对应文件移植，port 后无本地改动。**不主张字节同一性**：上游快照不在仓内，无法机械核验；port 期的 lint 适配若产生差异则该文件归 `modified`。
- `modified` — 移植后为 dsh 接缝适配过；Apache §4(b) 的修改声明集中记录于本表与 `NOTICE`。
- `new` — dsh 原创，非上游作品的一部分（与本包其余部分同按 Apache-2.0 分发）。
```

</details>

#### 缺口

- 目标终端兼容、键盘任务和用户偏好没有对照。
  **影响**：不能把渲染机制或主题数当效率提升。
  **进一步探讨**：同一任务在默认入口/本TUI比较错误、读状态/审批/恢复时间与偏好。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 输入、事件、渲染和退出如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

TuiPort只向引擎提供运行/思考/已输出等展示视图和slash提示；实际输入控制通过Agent公开followup/steer/inject/cancel，不直接伪造会话事件。带图followup先保存附件再投递，旧会话裸Agent的结构所有权由原持有者管理。投递成功意味着进入宿主inbox，不证明最终任务完成。

live projection按agent.id过滤状态、inbox、error、disposed和session tool/call/result事件，维护本地只读投影，dispose解绑。可见图与会话历史是不同层，切换/恢复必须验证没有漏帧、重复或陈旧工具状态，不能用本地UI状态替代Agent事实。

ANSI live区域按visual rows计几何，限制行预算，检测污染后重铺并重新计算宽度；WriteBatcher合并请求，在16ms附近节流，不把每个token都独立重画。源码有消除重复/错位的具体设计，但源码注释承认外来输出污染顶部残留的相对定位限制；“极流畅”仍需终端、SSH、字体宽度与负载测量。

runner预装exit raw-mode恢复、SIGINT去重及dispose：flush持久状态、取消未决审批/提问、解绑订阅，再释放本层持有handle。attach失败也尝试dispose恢复终端。best-effort恢复不是所有崩溃/断电都可恢复的保证，重启后应以宿主日志核真实任务而非scrollback猜测。

#### 证据与依据

**依据 1 · 源码核查**：[src/port.ts:10-35](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/port.ts#L10-L35)

展示端口字段及边界。

<details>
<summary>查看原文（26行）</summary>

```text
/** 会话运行状态（纯展示视图，不含 agent 内部模型）。 */
export interface SessionStatusView {
  /** 当前是否处于 agent 运行中（影响 Ctrl+C / ESC 等键路由）。 */
  isAgentActive: boolean
  /** 是否处于思考（thinking）阶段。 */
  isThinking: boolean
  /** 最近一条助手消息是否已开始输出。 */
  assistantStarted: boolean
}

/** 输入提示区状态（注入给 InputController / InputLine 的数据源）。 */
export interface InputPort {
  /** 可用的 slash 命令提示（Tab 补全目标）；由宿主注入，本包不实现命令。 */
  slashCommands: readonly { name: string; description: string; argsHint?: string }[]
}

/**
 * TUI 渲染引擎端口 — 引擎与宿主（agent loop）之间的注入边界。
 * 宿主实现本接口并提供数据；引擎只做展示与输入路由，不感知 agent 模型。
 */
export interface TuiPort {
  /** 读取当前会话状态。 */
  getSessionStatus(): SessionStatusView
  /** 输入端口。 */
  input: InputPort
}
```

</details>

**依据 2 · 源码核查**：[src/adapter/send.ts:113-143](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/adapter/send.ts#L113-L143)

Agent公开输入/取消，不越权dispose裸Agent。

<details>
<summary>查看原文（31行）</summary>

```text
export function controlsFromHandle(handle: AgentHandle): AgentControls {
  return controlsFromAgent(handle.agent)
}

/**
 * Build controls for a bare agent the caller does NOT own. Never disposes the
 * agent: teardown of a switched-to session belongs to its structural owner.
 * @param agent - a bare agent, e.g. from `ctx.agents.get(id)`.
 * @returns the drive-only control surface over the agent.
 */
export function controlsFromAgent(agent: Agent): AgentControls {
  return {
    followup: (text: string, images?: string[]) => {
      // 无图走同步快路径（与历史行为一致）；有图先经 attachments 持久化再投递。
      if (images === undefined || images.length === 0) {
        agent.followup(toUserMessageSync(text))
        return Promise.resolve()
      }
      return toUserMessage(agent.ctx, text, images).then((message) => {
        agent.followup(message)
      })
    },
    steer: (text: string) =>{  agent.steer(toUserMessageSync(text)) },
    inject: (text: string) =>{  agent.inject(toUserMessageSync(text)) },
    cancel: (cause: AgentCancelCause, options?: CancelOptions) => {
      if (options === undefined) agent.cancel(cause)
      else agent.cancel(cause, options)
    },
    whenIdle: () => agent.whenIdle(),
  }
}
```

</details>

**依据 3 · 源码核查**：[src/adapter/live.ts:164-201](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/adapter/live.ts#L164-L201)

工具事件过滤与订阅清理。

<details>
<summary>查看原文（38行）</summary>

```text
  const onSessionEvent = (owner: { id: SessionId }, event: SessionEvent): void => {
    if (owner.id !== id) return
    switch (event.type) {
      case 'tool/call':
        state = applyLiveEvent(state, {
          type: 'tool-call',
          turn: event.data.turn,
          step: event.data.step,
          callId: event.data.callId,
          name: event.data.name,
          arguments: event.data.arguments,
        })
        break
      case 'tool/result':
        // ToolResultMessage 的 source 恒为 tool 源，callId 直接可取。
        state = applyLiveEvent(state, { type: 'tool-result', callId: event.data.message.source.callId })
        break
      default:
        // 其余 session 事件与活动投影无关。
        break
    }
  }

  const disposers = [
    ctx.on('agent/status', onStatus),
    ctx.on('agent/inbox/inserted', onInserted),
    ctx.on('agent/inbox/claimed', onClaimed),
    ctx.on('agent/inbox/discarded', onDiscarded),
    ctx.on('agent/error', onError),
    ctx.on('agent/disposed', onDisposed),
    ctx.on('session/event', onSessionEvent),
  ]

  return {
    get state(): LiveAgentState { return state },
    dispose(): void {
      for (const dispose of disposers) dispose()
    },
```

</details>

**依据 4 · 源码核查**：[src/engine/live-engine.ts:341-367](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/engine/live-engine.ts#L341-L367)

行预算、宽度和污染重绘。

<details>
<summary>查看原文（27行）</summary>

```text
  render(lines: readonly LiveRegionLine[], opts?: { reservedTail?: number }): void {
    // alt screen 期间主屏 live 区是冻结快照：不写 stdout，也不更新几何。
    if (this.probeSuppressed) return
    const bounded = this.applyRowBudget(this.normalizeLines(lines), opts?.reservedTail)
    const parking = this.computeParking(bounded)

    // 恢复重铺：CPR 检出外来写入污染后，不再信任 lastDisplayRows 的屏上假设
    // （H2 短路会被 lineCache 与屏上不符的内容欺骗，diff 会加剧错位）。
    // 爬升量以「追踪行数」与「最近 CPR 报告行」双封顶——绝不爬出视口顶。
    // 外来行撑高区域的行数不可知，顶部残留 ≤δ 行无法避免（相对寻址的固有限制），
    // 但外来文本被擦除、帧重新锚定，后续帧恢复一致。
    if (this.polluted) {
      this.polluted = false
      // resize 与污染判定常并发（reflow 移动光标即触发）：爬升前先按当前宽度从
      // lineCache 重算屏上行数。否则 lastDisplayRows 仍是旧宽度计数，变窄 reflow
      // 把区域撑高后爬升不足，旧帧顶部残留进 scrollback（resize 输入框叠屏）。
      this.reconcileWidth()
      const newDisplayRows = this.countDisplayRows(bounded)
      let body: string
      if (this.hasRendered && this.lastDisplayRows > 0) {
        const climb = Math.min(Math.max(0, this.lastDisplayRows - 1 - this.parkedRowsUp), Math.max(0, this.cprReportRow - 1))
        body = (climb > 0 ? cursorUp(climb) : '') + '\r' + ANSI.ERASE_SCREEN_END + this.buildAppend(bounded)
      } else {
        body = this.buildAppend(bounded)
      }
      this.stdout.write(ANSI.BEGIN_SYNC + ANSI.HIDE_CURSOR + body + this.buildParkSeq(parking) + ANSI.END_SYNC)
      this.lastDisplayRows = newDisplayRows
```

</details>

**依据 5 · 源码核查**：[src/engine/write-batcher.ts:51-72](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/engine/write-batcher.ts#L51-L72)

刷新合并/节流。

<details>
<summary>查看原文（22行）</summary>

```text
  /** 请求刷新：距上次 flush ≥16ms 走 microtask，否则 16ms 尾沿（窗口内合并）。 */
  schedule(): void {
    if (this.pending) return
    this.pending = true
    const wait = MIN_FRAME_INTERVAL_MS - (Date.now() - this.lastFlushAt)
    if (wait <= 0) {
      const generation = this.generation
      void Promise.resolve().then(() => {
        if (!this.pending || generation !== this.generation) return
        this.pending = false
        this.runFlush()
      })
      return
    }
    this.timer = setTimeout(() => {
      this.timer = null
      if (!this.pending) return
      this.pending = false
      this.runFlush()
    }, wait)
    // 不拖住进程退出（shutdown/测试尾声的 pending 帧可丢弃）。
    this.timer.unref()
```

</details>

**依据 6 · 源码核查**：[src/index.ts:96-103](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/index.ts#L96-L103)

退出raw-mode兜底。

```text
  const stdin = config.stdin ?? process.stdin
  const stdout = config.stdout ?? process.stdout
  // 兜底：任何异常退出路径都恢复终端（raw mode off）——本体（opencode-tui）
  // 同款 best-effort。防止异常跳过 dispose 时残留 raw mode（终端乱/输入框不可见）。
  // exit 时进程将结束，handler 无需卸载。
  process.on('exit', () => {
    try { if (stdin.isTTY && typeof stdin.setRawMode === 'function') stdin.setRawMode(false) } catch { /* best-effort */ }
  })
```

**依据 7 · 源码核查**：[src/index.ts:176-189](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/index.ts#L176-L189)

signal解绑与attach失败清理。

<details>
<summary>查看原文（14行）</summary>

```text
    process.on('SIGINT', onSigint)
    stdin.on('SIGINT', onSigint)
    ctx.effect(() => () => {
      stdin.off('SIGINT', onSigint)
      process.off('SIGINT', onSigint)
      return teardown(false)
    })
    // attach 的 promise 保存下来：更新完成后自动重启需等 attach 落定（避免半初始化重启）。
    // attach 失败标记 attachFailed——新版本持续启动失败时跳过自动重启，避免重启循环。
    let attachFailed = false
    const attachPromise = app.attach().catch((err: unknown) => {
      attachFailed = true
      // attach 失败：恢复终端（dispose 幂等）后上报，避免半初始化终端残留。
      void app.dispose().finally(() => { console.error('[tui-runner] attach failed:', err) })
```

</details>

**依据 8 · 源码核查**：[src/ui/app.ts:4188-4213](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/ui/app.ts#L4188-L4213)

dispose flush、取消审批/提问及清理。

<details>
<summary>查看原文（26行）</summary>

```text
  async dispose(): Promise<void> {
    if (this.disposed) return
    this.disposed = true
    if (this.ticker !== null) { clearInterval(this.ticker); this.ticker = null }
    // 先 flush 再释放本层持有的 handle：flushAll 依赖 live store 未拆，
    // 而 dispose owned handle 会卸载投影/释放 agent，先拆会让 flush 无物可刷。
    try { await flushAll(this.ctx) } catch { /* flush 失败不阻塞退出 */ }
    // Phase 8：解绑 answerer；未决审批 settle 为 cancelled（fail-closed 语义；
    // detachProjections 已清挂起，此处幂等兜底）
    this.approvalDisposer?.()
    this.approvalDisposer = null
    if (this.approval.isPending) this.approval.settle('cancelled')
    // T3.1：释放 userQuestions provider 注册（否则服务侧再次 registerProvider
    // 抛 DUPLICATE_PROVIDER）；挂起提问 reject ASK_CANCELLED（detachProjections
    // 已清挂起，此处幂等兜底）。
    this.interactionDisposer?.()
    this.interactionDisposer = null
    if (this.question.isPending) this.question.cancel()
    // #39：技能展示面随 dispose 解绑订阅（防止 dispose 后事件回调泄漏）。
    this.skillSurface.dispose()
    // overlay 打开期间暂存的 scrollback 条目：退出前按同一协议补写主屏
    // （会话日志是权威数据，scrollback 是展示层——丢条目只影响本次显示，
    // 补写成本低且避免"发了消息但屏上不见"的观感）。
    this.commitSurface.flushDeferred()
    await this.detachProjections()
    // P1：/btw 侧问收尾——未决侧问直接销毁 btw agent（done 态答案未折叠则
```

</details>

#### 缺口

- 真实TTY/SSH/Windows、中文宽度、快速流和异常退出未运行。
  **影响**：不能证明无错位、无漏事件或永不留raw模式。
  **进一步探讨**：固定终端跑长输出/resize/外来stderr/断连/恢复，核日志与显示及退出终端状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审批、预设、LSP与启动更新改变哪些边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

审批不是纯展示。Shift+Tab从Normal→Plan→Always-Approve→Normal，/yolo同样切本地标志；Always-Approve下当前session的approval/request直接返回allowed-once，不挂提示。另有工具/命令前缀会话白名单，也可短路后续请求；非当前会话或已有pending则next委托，abort/超时可cancel。切会话卸载复位全放行、工具/前缀白名单与pending，但本地授权不是同一套持久权限preset，不应因徽标存在就当没有真实放权。

bundle还把模型面工具移进官方预设，并装fork的lsp/lsp-local/tool-lsp；typescript server默认命令为npx -y typescript-language-server --stdio，首次查询可下载和启动本地进程。它超出ANSI渲染，带来网络、进程和代码诊断依赖。文档的vision-ask、视觉桥及其他memory能力有独立伴生组件，根包列表不能证明这些全部内置启用；本轮未审外部组件质量。

启动自更新会查询npm latest（官方源失败可回退镜像），对npm安装profile运行包管理器install/add指定版本。planSelfUpdate仅比较latest字符串是否相同，非semver仅升不降判定；精确npm版本安装也可能被后续latest替换。当前进程不热换模块，默认空白会话attach成功后自动重启，已有工作仅通知。

尤其runSelfUpdate先fetchLatestWithCache再planSelfUpdate；SKIP_UPDATE/CI/非npm条件在plan中才判。所以这些条件可阻止安装，但不能据函数注释“不联网”保证查源完全跳过，缓存过期/缺失仍可能先发查询。这是静态调用时序证据，未执行网络复现。更新安装超时/失败可能已留下部分包管理器状态，需核profile而非只看failed提示。

#### 证据与依据

**依据 1 · 源码核查**：[src/ui/app.ts:2992-3026](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/ui/app.ts#L2992-L3026)

Shift+Tab与/yolo本地全放行入口。

<details>
<summary>查看原文（35行）</summary>

```text
   * C3 项 4：Shift+Tab 三态循环（对齐 grok 的两轴模型，plan 与 permission 正交）：
   * Normal → Plan（planMode.set(true)）→ Always-Approve（plan off + 本地短路）→ Normal。
   * plan 切换经 planMode 服务（投影总线驱动 planState 徽标）；always-approve 是
   * 纯 TUI 本地标志（不持久化，退出即失），对审批 answerer 短路放行。
   * alwaysApprove 优先判断：它是同步本地态；planState 经投影异步更新，
   * 若按投影判断会在 Always-Approve 态误走回 Plan 分支。
   */
  private cycleMode(): void {
    if (this.approval.alwaysApprove) {
      // Always-Approve → Normal
      this.approval.setAlwaysApprove(false)
      this.statusLine?.setAlwaysApprove(false)
      this.flushLiveRender()
    } else if (this.planState.active) {
      // Plan → Always-Approve
      this.setPlanMode(false)
      this.approval.setAlwaysApprove(true)
      this.statusLine?.setAlwaysApprove(true)
      this.flushLiveRender()
    } else {
      // Normal → Plan
      this.setPlanMode(true)
    }
  }

  /**
   * /yolo：全放行模式快捷入口（approval always-approve 的显式开关）。
   * 与 Shift+Tab 循环进 always-approve 同语义（allowed-once 短路），但提供
   * 命令入口；退出会话时 app 侧复位逻辑（setAlwaysApprove(false)）同样覆盖。
   * @param flag - true 开启全放行（后续审批自动放行）；false 关闭。
   */
  private setYoloMode(flag: boolean): void {
    this.approval.setAlwaysApprove(flag)
    this.statusLine?.setAlwaysApprove(flag)
    this.flushLiveRender()
```

</details>

**依据 2 · 源码核查**：[src/controllers/approval-controller.ts:224-256](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/controllers/approval-controller.ts#L224-L256)

当前session快捷授权/白名单/next与abort。

<details>
<summary>查看原文（33行）</summary>

```text
  handle(req: PendingApprovalRequest, next: () => Promise<ApprovalOutcome>): Promise<ApprovalOutcome> {
    const current = this.getCurrentSessionId()
    // C3 项 4：always-approve 短路放行（不挂起提示，不消费 pendingApproval）。
    // 仅限当前会话：非当前会话的请求必须 next() 委托（apiproxy 等链上 answerer），
    // 否则 TUI 会截胡远端转发的审批。
    if (this.alwaysApproveFlag && req.agent.session.id === current) {
      return Promise.resolve('allowed-once')
    }
    // 任务4a：工具级会话白名单短路——`t` 键加过的工具自动放行，其他工具仍
    // 逐卡审批。作用域与 always-approve 相同（仅当前会话）。
    if (this.allowedTools.has(req.toolName) && req.agent.session.id === current) {
      return Promise.resolve('allowed-once')
    }
    // 决策分层阶段 2：命令前缀会话白名单短路——`p` 键加过的前缀自动放行。
    // 前缀在此一次性提取（transcript 查找 + JSON 解析），挂起后缓存复用。
    const prefix = req.agent.session.id === current
      ? this.getCommandPrefix?.(req) ?? null
      : null
    if (prefix !== null && this.allowedPrefixes.has(prefix)) {
      return Promise.resolve('allowed-once')
    }
    if (req.agent.session.id !== current || this.pending !== null) {
      return next()
    }
    return new Promise<ApprovalOutcome>((resolve) => {
      const signal = req.signal
      // 已撤销的请求不呈现、不挂起：asker 侧已把 abort 竞速为 cancelled，
      // 挂起只会让卡片滞留（UI/outcome 不一致）——直接 fail-closed 结算。
      if (signal !== undefined && signal.aborted) {
        resolve('cancelled')
        return
      }
      const onAbort = (): void => { this.settle('cancelled') }
```

</details>

**依据 3 · 源码核查**：[src/controllers/approval-controller.ts:257-274](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/controllers/approval-controller.ts#L257-L274)

超时与signal取消。

<details>
<summary>查看原文（18行）</summary>

```text
      // 挂起超时：超过 timeoutMs 无人应答 → fail-closed 自动结算 cancelled，
      // 卡片不无限挂起（settle 时清除 timer，防用户结算后二次结算）。
      // 有限值守卫：Node setTimeout 对 > 2^31-1 ms 的值溢出为 1ms 立即触发。
      const timer = Number.isFinite(this.timeoutMs)
        ? setTimeout(() => { this.settle('cancelled') }, this.timeoutMs)
        : undefined
      this.pending = {
        req,
        resolve,
        since: Date.now(),
        prefix,
        timer,
        ...(signal !== undefined ? { onAbort } : {}),
      }
      // 挂起时监听请求撤销：agent 取消（abort）→ 自动结算 cancelled，
      // 与 asker 拿到的 cancelled 对齐，卡片经 onChanged 同步消失。
      signal?.addEventListener('abort', onAbort, { once: true })
      this.onChanged?.()
```

</details>

**依据 4 · 源码核查**：[src/ui/app.ts:4149-4158](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/ui/app.ts#L4149-L4158)

卸载时复位alwaysApprove与pending。

<details>
<summary>查看原文（10行）</summary>

```text
    this.taskItems = null
    this.planState = { active: false, pending: false }
    // C3 项 4：always-approve 是会话级本地态——切会话/退出时复位，
    // 防止残留到新会话（planState 同上复位；徽章由 statusLine 重建）。
    this.approval.setAlwaysApprove(false)
    // Phase 8：卸载会话时清挂起审批——否则旧审批仍可被 y/N 结算且阻塞
    // 新会话请求（跨会话残留 bug；fail-closed 结算为 cancelled）。
    if (this.approval.isPending) this.approval.settle('cancelled')
    // T3.1：卸载会话时清挂起提问——否则会话 A 的 plan-review 卡残留在会话
    // B 仍渲染，B 的按键决定 A 的 ask promise（跨会话残留 bug；与 approval
```

</details>

**依据 5 · 源码核查**：[src/controllers/approval-controller.ts:168-174](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/controllers/approval-controller.ts#L168-L174)

工具/前缀会话授权清理。

```text
   * 清空会话级授权（工具白名单 + 命令前缀白名单；会话切换时 app 侧复位——
   * 白名单语义限于单个会话）。
   */
  clearSessionGrants(): void {
    this.allowedTools.clear()
    this.allowedPrefixes.clear()
  }
```

**依据 6 · 源码核查**：[cordis.patch.yml:33-57](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/cordis.patch.yml#L33-L57)

真实LSP组件及npx server配置。

<details>
<summary>查看原文（25行）</summary>

```text
    # seam（ctx.lsp 注册表）+ stdio 本地 provider + 模型工具（单 lsp 工具四操作：
    # goToDefinition / findReferences / goToImplementation / hover）。lsp-local
    # 默认给 typescript-language-server 一个 npx 条目（懒启动；npx 随 node 在场，
    # 加载期解析不炸，首次查询按需拉取）；其他语言由用户照此追加 servers 条目。
    # 无 provider 时模型查询收到结构化 LSP_UNAVAILABLE（schema 稳定）。
    - id: lsp
      name: '@huiliyi37/dsh-lsp'

    - id: lsp-local
      name: '@huiliyi37/dsh-lsp-local'
      config:
        servers:
          typescript:
            command: npx
            args: ['-y', 'typescript-language-server', '--stdio']
            extensionToLanguage:
              .ts: typescript
              .tsx: typescript
              .js: javascript
              .jsx: javascript
              .mjs: javascript
              .cjs: javascript

    - id: tool-lsp
      name: '@huiliyi37/dsh-tool-lsp'
```

</details>

**依据 7 · 源码核查**：[cordis.patch.yml:59-88](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/cordis.patch.yml#L59-L88)

preset registry与standard工具装配。

<details>
<summary>查看原文（30行）</summary>

```text
    # The preset selection registry（对标 web-app 0.2.1 cordis.patch.yml 尾行）。
    - id: agent-preset-registry
      name: '@deepseek-ai/dsh-agent-preset-registry'
      config:
        default: standard

    # ── shipped 预设声明（与官方 web-app 0.2.1-rc.4 presets/ 对齐，schedule 除外）

    - id: preset-standard
      name: '@deepseek-ai/dsh-agent-preset'
      config:
        id: standard
        order: 1
        plugins:
          - id: persona
            name: '@deepseek-ai/dsh-persona'
            config:
              prefix: You are a coding agent powered by the {{model}} model.
          - id: agent-instructions
            name: '@deepseek-ai/dsh-agent-instructions'
            config:
              maxBytes: 65536
          - id: time-context
            name: '@deepseek-ai/dsh-time-context'
          - id: tool-bash
            name: '@deepseek-ai/dsh-tool-bash'
            disabled: !!js process.platform === 'win32'
          - id: tool-pwsh
            name: '@deepseek-ai/dsh-tool-pwsh'
            disabled: !!js process.platform !== 'win32'
```

</details>

**依据 8 · 作者声明**：[docs/plugins.md:9-16](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/docs/plugins.md#L9-L16)

伴生视觉与LSP来源说明。

```text
| 插件 | 包名 | 能力 | 装配 |
|---|---|---|---|
| 视觉副驾 | `@deepseek-ai/dsh-vision-ask`(同仓 `vision-ask/`) | 已发送图片登记为短 id(`img_1` …),模型可经 `ask_image` 反复询问;同图同角度命中 per-image 描述缓存 | 独立装配,细节见 [vision-ask/README.md](../vision-ask/README.md) |
| LSP 模型工具面 | `omdsh-dev/dsh-lsp`(社区独立仓) | 模型可调 `lsp_goto_definition` / `lsp_find_references` / `lsp_diagnostics`;装配后 TUI 展示桥自动消费其 `lsp` 服务,与模型工具面共享同一 LSP server 集 | `dsh plugin --profile tui add github:omdsh-dev/dsh-lsp` |
| 视觉桥 | `dsh-vision-bridge`(harness 侧) | 主模型不识图时,提交前经独立视觉模型生成图片描述 | provide `visionBridge` 服务;TUI 按服务存在性自动探测 |

TUI 展示桥的 LSP 诊断源探测顺序:社区插件服务(getDiagnostics 形状)→ 官方
`ctx.lsp` seam → 内置桥降级。
```

**依据 9 · 源码核查**：[src/self-update.ts:118-138](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/self-update.ts#L118-L138)

skip时点与非semver比较。

<details>
<summary>查看原文（21行）</summary>

```text
export function planSelfUpdate(input: {
  env: NodeJS.ProcessEnv
  currentVersion: string
  profileDir: string | undefined
  installSpec: string | undefined
  latest: string | null
}): UpdatePlan {
  if (!shouldCheckForUpdate(input.env)) {
    return { action: 'skip', reason: input.env.CI !== undefined || input.env.VITEST !== undefined ? 'ci' : 'env' }
  }
  if (input.profileDir === undefined) return { action: 'skip', reason: 'no-profile' }
  if (input.installSpec === undefined || !isNpmVersionSpec(input.installSpec)) {
    return { action: 'skip', reason: 'not-npm' }
  }
  if (input.latest === null || input.latest === '') return { action: 'skip', reason: 'no-latest' }
  if (input.latest === input.currentVersion) return { action: 'skip', reason: 'same' }
  return { action: 'update', latest: input.latest }
}

/** registry 基址链：官方源 → 国内镜像（npmmirror，完整 npm REST 镜像）。
 *  #43：registry.npmjs.org 直连不通的网络下，单源 3s 超时让启动检查恒失败。 */
```

</details>

**依据 10 · 源码核查**：[src/self-update.ts:181-196](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/self-update.ts#L181-L196)

逐registry查latest。

<details>
<summary>查看原文（16行）</summary>

```text
export async function fetchNpmLatest(packageName: string = TUI_PACKAGE, timeoutMs = 3_000, opts: FetchLatestOptions = {}): Promise<string | null> {
  const registries = opts.registries ?? npmRegistryCandidates()
  const fetchImpl = opts.fetchImpl ?? fetch
  let lastError: unknown
  let sawError = false
  for (const baseUrl of registries) {
    try {
      const version = await fetchLatestFromRegistry(baseUrl, packageName, timeoutMs, fetchImpl)
      if (version !== null) return version
    } catch (err) {
      sawError = true
      lastError = err
    }
  }
  if (sawError) throw lastError
  return null
```

</details>

**依据 11 · 源码核查**：[src/self-update.ts:281-309](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/self-update.ts#L281-L309)

实际包管理器命令/进程与超时。

<details>
<summary>查看原文（29行）</summary>

```text
 *  DEP0190 约束保持：shell:false + args 数组）。 */
export function installCommandFor(pm: PackageManager, latest: string): InstallInvocation {
  const spec = `${TUI_PACKAGE}@${latest}`
  const sub = pm === 'npm' ? 'install' : 'add'
  const label = `${pm} ${sub}`
  const isWin = process.platform === 'win32'
  return isWin
    ? { command: process.env.ComSpec ?? 'cmd.exe', args: ['/d', '/c', pm, sub, spec], label }
    : { command: pm, args: [sub, spec], label }
}

export function installNpmVersion(latest: string, profileDir: string, timeoutMs = 60_000): Promise<void> {
  const { command, args, label } = installCommandFor(detectPackageManager(profileDir), latest)
  return new Promise((resolve, reject) => {
    // Windows 上 pnpm/npm/yarn 是 .cmd，spawn 直接执行会 EINVAL（.cmd 不能
    // 不经 shell 启动），传 'pnpm' 又会 ENOENT（无扩展名不在 PATH）。
    // 经 cmd.exe /d /c 显式派发：shell:false 时 args 作为 argv 传给
    // cmd.exe，不触发 Node DEP0190 弃用警告（shell:true + args 数组组合
    // 会把警告经 stderr 渲染进 TUI 输入框区域）。version 来自 npm registry
    // 的 semver 字符串，字符集受限（无空格/引号/&|<> 等元字符），实际注入
    // 面低；cmd /c 对参数数组按 argv 传递，不拼 shell 字符串。
    const child = spawn(command, args, {
      cwd: profileDir,
      stdio: 'ignore',
      windowsHide: true,
    })
    const timer = setTimeout(() => {
      child.kill()
      reject(new Error(`${label} timed out`))
```

</details>

**依据 12 · 源码核查**：[src/self-update.ts:324-349](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/self-update.ts#L324-L349)

查源先于plan/skip再安装。

<details>
<summary>查看原文（26行）</summary>

```text
 * 对照 npm latest；需要时在 profile 里安装。失败不抛（启动不能被更新拖死）。
 */
export async function runSelfUpdate(opts: RunSelfUpdateOptions = {}): Promise<UpdateResult> {
  const env = opts.env ?? process.env
  const startDir = opts.startDir ?? process.cwd()
  const profileDir = opts.profileDir ?? findProfileDir(startDir)
  const currentVersion = opts.currentVersion ?? readOwnVersion(startDir) ?? ''
  const installSpec = opts.installSpec ?? (profileDir === undefined ? undefined : readInstallSpec(profileDir))
  try {
    // 注入缝优先（测试密封化）；真实路径走 1h 磁盘缓存免每启联网
    const latest = opts.fetchLatest !== undefined
      ? await opts.fetchLatest()
      : await fetchLatestWithCache({
          cachePath: opts.cachePath ?? defaultUpdateCachePath(),
          now: opts.now?.() ?? Date.now(),
        })
    const plan = planSelfUpdate({ env, currentVersion, profileDir, installSpec, latest })
    if (plan.action === 'skip') return { kind: 'noop' }
    if (profileDir === undefined) return { kind: 'noop' }
    const install = opts.install ?? installNpmVersion
    await install(plan.latest, profileDir)
    return { kind: 'updated', version: plan.latest }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    return { kind: 'failed', error }
  }
```

</details>

**依据 13 · 源码核查**：[src/index.ts:191-209](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/index.ts#L191-L209)

默认空白会话自动重启与工作中通知。

<details>
<summary>查看原文（19行）</summary>

```text
    // 启动自更新：对照 npm latest，写入 profile。已加载模块不热替换，提示重启。
    // CI/VITEST/非 npm 安装会 noop，不挡 attach。
    const autoRestartOnUpdate = config.autoRestartOnUpdate !== false
    void runSelfUpdate({ startDir: fileURLToPath(new URL('.', import.meta.url)) }).then(async (result) => {
      if (result.kind === 'updated') {
        await attachPromise
        if (attachFailed) return
        if (autoRestartOnUpdate && app.isBlankSession()) {
          app.notifyAutoRestart(result.version)
          // 留 400ms 让提示可见（dispose 不清屏，新进程随后重绘 TUI）
          await new Promise((r) => setTimeout(r, 400))
          void teardown(true, true)
        } else {
          // 会话非空白（用户已开始工作）或自动重启被关闭：只提示，不打断。
          app.notifyPluginUpdated(result.version)
        }
      }
      // P1-1：更新失败不再静默——attach 后回显 warning（附 DSH_TUI_SKIP_UPDATE=1 提示）
      else if (result.kind === 'failed') app.notifyPluginUpdateFailed(result.error)
```

</details>

#### 缺口

- 审批快捷模式、LSP外部进程、更新部分失败与真实skip联网未运行。
  **影响**：不能只按皮肤/显式skip文字评估权限和供应链范围。
  **进一步探讨**：一次性profile核授权切换/复位、pending取消、npx启动及registry探测/安装失败；记录实际配置/网络和包状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 实际安装和日常使用怎样闭环？

**研究主题**：依赖、兼容与流程

#### 完整回答

固定包1.0.0-rc.3、Apache-2.0，Node^22.19或>=24。根包需要官方DSH宿主而无独立bin，README要求至少0.2.1-rc.4；package同时依赖明确版官方preset和@huiliyi37的fork运行库，兼容不是一个peer数字能保证。安装脚本/命令是作者建议，本轮未执行远程脚本或安装。

| 条件 | 实际门槛 | 失败边界 |
|---|---|---|
| DSH tui profile/host服务 | runner、Session/Agent、模型/工具/preset | 不能只npm i根包当独立程序 |
| Node及fork/官方依赖 | 运行和LSP/代码接缝 | 升级需核服务契约，不以能加载代交互通过 |
| 终端ANSI/宽度/TTY | raw input、流式绘制、图像降级 | Windows/SSH/字体及外来输出需分别验收 |
| 工作区/模型/工具权限 | 真实coding任务与审批 | Always-Approve和prefix授权是实际放行 |
| 网络与本地文件 | 更新源/镜像、npx/LSP、prefs/history和附件 | SKIP_UPDATE不保证当前时序无查询；外部桥另核 |

| 步骤/执行者 | 合格结果 | 失败动作 |
|---|---|---|
| 操作者备份并建一次性profile | 版本/宿主/目录明确，预设和自动更新影响可查 | 不在正式profile先试安装脚本 |
| 用户启动并核模式 | 普通输入、审批与退出正常 | 模式异常立即回Normal并停该会话 |
| 用户跑已知coding任务 | 输出/工具与宿主日志一致 | 不以卡片完成替代真实验证 |
| 用户试切会话/恢复/resize | 授权复位、状态无残留，pending取消 | 核原session，避免重复发任务 |
| 用户按需试LSP/图片桥 | 进程/外发模型和降级符合意图 | 单独关闭组件，不推断根包全部能力 |
| 操作者更新/退出 | profile变更和实际加载版本可解释，终端恢复 | 保留锁文件/配置备份，先核包状态再重启 |

若需禁止自动安装，可用显式skip条件，但要把“禁止更新安装”与“完全禁止registry查询”分开验收；不能复制README的skip口径作为无网络承诺。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-26](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/package.json#L2-L26)

版本、主入口/exports与许可。

<details>
<summary>查看原文（25行）</summary>

```text
  "name": "@huiliyi37/dsh-tianshu-tui",
  "description": "dsh-tianshu-tui: an interactive terminal UI plugin for the official DeepSeek Harness — streaming markdown/tool cards, 16+ themes, slash commands, session tabs, LSP diagnostics, cost tracking, self-update (`dsh plugin --profile tui add @huiliyi37/dsh-tianshu-tui`)",
  "version": "1.0.0-rc.3",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/invariant.js",
    "cordis.patch.yml",
    "lib/types/**/*.d.ts",
    "CHANGELOG.md",
    "NOTICE",
    "SOURCE-MAP.md"
  ],
  "license": "Apache-2.0",
```

</details>

**依据 2 · 源码核查**：[package.json:148-166](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/package.json#L148-L166)

官方与fork运行依赖。

<details>
<summary>查看原文（19行）</summary>

```text
    "@deepseek-ai/dsh-agent-preset": "0.2.1-rc.4",
    "@deepseek-ai/dsh-agent-preset-registry": "0.2.1-rc.4",
    "@deepseek-ai/dsh-cordis-host-runner": "0.2.1-rc.4",
    "@deepseek-ai/dsh-plugin-market": "0.2.1-rc.4",
    "@deepseek-ai/dsh-time-context": "0.2.1-rc.4",
    "@deepseek-ai/dsh-tool-cordis": "0.2.1-rc.4",
    "@huiliyi37/cordis": "0.8.0",
    "@huiliyi37/cordis-plugin-include": "0.8.0",
    "@huiliyi37/cordis-plugin-loader": "0.8.0",
    "@huiliyi37/dsh-agent": "0.8.0",
    "@huiliyi37/dsh-brand": "0.8.0",
    "@huiliyi37/dsh-code-runtime": "0.8.0",
    "@huiliyi37/dsh-fs": "0.8.0",
    "@huiliyi37/dsh-invariants": "0.8.0",
    "@huiliyi37/dsh-llm": "0.8.0",
    "@huiliyi37/dsh-lsp": "0.8.0",
    "@huiliyi37/dsh-lsp-local": "0.8.0",
    "@huiliyi37/dsh-sandbox": "0.8.0",
    "@huiliyi37/dsh-scope": "0.8.0",
```

</details>

**依据 3 · 作者声明**：[README.md:33-35](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/README.md#L33-L35)

作者宿主与非独立程序要求。

```text
本包不是独立程序。须先有官方 CLI [`@deepseek-ai/dsh`](https://www.npmjs.com/package/@deepseek-ai/dsh)（当前适配 npm `next` 的 `0.2.1-rc.4`；需 ≥ `0.2.1-rc.4`，peer 依赖对齐）。请显式使用 `@next`，不要落到旧全局 CLI 或较低版本。只 `npm i` 本包跑不起来。

**一键安装（推荐）**：仓库自带跨平台脚本，自动检测 Node/pnpm、经 pnpm 安装官方 CLI + 装配本插件并启动（国内网络默认走 npmmirror 镜像）：
```

**依据 4 · 源码核查**：[src/self-update.ts:54-63](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/self-update.ts#L54-L63)

安装来源与skip条件。

<details>
<summary>查看原文（10行）</summary>

```text
export function isNpmVersionSpec(spec: string): boolean {
  return !/^(github:|git\+|file:|link:|workspace:|https?:)/.test(spec)
}

/** CI、vitest、显式开关下不联网。 */
export function shouldCheckForUpdate(env: NodeJS.ProcessEnv): boolean {
  if (env[SKIP_UPDATE_ENV] === '1' || env[SKIP_UPDATE_ENV] === 'true') return false
  if (env.CI === 'true' || env.CI === '1') return false
  if (env.VITEST === 'true' || env.VITEST === '1') return false
  return true
```

</details>

**依据 5 · 源码核查**：[src/self-update.ts:324-349](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/self-update.ts#L324-L349)

实际查询/skip/安装顺序。

<details>
<summary>查看原文（26行）</summary>

```text
 * 对照 npm latest；需要时在 profile 里安装。失败不抛（启动不能被更新拖死）。
 */
export async function runSelfUpdate(opts: RunSelfUpdateOptions = {}): Promise<UpdateResult> {
  const env = opts.env ?? process.env
  const startDir = opts.startDir ?? process.cwd()
  const profileDir = opts.profileDir ?? findProfileDir(startDir)
  const currentVersion = opts.currentVersion ?? readOwnVersion(startDir) ?? ''
  const installSpec = opts.installSpec ?? (profileDir === undefined ? undefined : readInstallSpec(profileDir))
  try {
    // 注入缝优先（测试密封化）；真实路径走 1h 磁盘缓存免每启联网
    const latest = opts.fetchLatest !== undefined
      ? await opts.fetchLatest()
      : await fetchLatestWithCache({
          cachePath: opts.cachePath ?? defaultUpdateCachePath(),
          now: opts.now?.() ?? Date.now(),
        })
    const plan = planSelfUpdate({ env, currentVersion, profileDir, installSpec, latest })
    if (plan.action === 'skip') return { kind: 'noop' }
    if (profileDir === undefined) return { kind: 'noop' }
    const install = opts.install ?? installNpmVersion
    await install(plan.latest, profileDir)
    return { kind: 'updated', version: plan.latest }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    return { kind: 'failed', error }
  }
```

</details>

**依据 6 · 源码核查**：[src/ui/app.ts:1406-1435](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/ui/app.ts#L1406-L1435)

会话选择、恢复、resize及审批挂载。

<details>
<summary>查看原文（30行）</summary>

```text
    const target = initialSessionId ?? this.initialSessionId ?? this.ctx.sessions.list()[0]?.id
    if (target !== undefined) await this.switchSession(target)
    else {
      // 启动复用：上一个没有任何内容的新对话（标题折叠为「新对话」）复用其
      // session id 而非铸造新 id——空会话随启动目录迁移（见 newSession）。
      const reuse = await findMostRecentEmptySession(this.ctx).catch(() => undefined)
      await this.newSession(reuse)
    }

    // Phase 9b：会话恢复面板——启动时把可恢复会话列表写进 scrollback
    // （当前会话除外；无其他可恢复会话时静默）。live 标注取 live store。
    await this.renderRestorableSessions()

    this.resize.onResize(() => {
      this.live.setMaxRows(liveMaxRowsFor(this.stdout.rows))
      // overlay 激活时主屏 live 不写；resize 只重绘 alt screen 面板。
      if (this.overlay !== null && this.overlay.activeId() !== null) {
        this.overlay.rerender()
        return
      }
      this.flushLiveRender()
    })
    this.input.onAnyKey((key) => { this.handleKey(key) })
    // Phase 8：审批 answerer——waterfall 必须 next() 委托（非当前会话的
    // 请求交给链上其他 answerer；当前会话的请求挂起等用户 y/N。重复
    // attach 先解绑旧 disposer（与 interactionDisposer 对称）。
    this.approvalDisposer?.()
    this.approvalDisposer = this.ctx.on('approval/request', (req: PendingApprovalRequest, next: () => Promise<ApprovalOutcome>) => {
      return this.handleApprovalRequest(req, next)
    })
```

</details>

#### 缺口

- 固定制品/宿主、目标终端、自动更新关闭及伴生组件未验收。
  **影响**：不能给跨平台生产可用或所有能力默认齐备保证。
  **进一步探讨**：按表固定环境分项验收，保留profile/依赖和宿主日志。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 全周期成本和效果有什么依据？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 成本来源 | 当前边界 |
|---|---|---|
| 启用 | host/profile依赖、预设/工具、终端与按键学习 | 多于只换终端配色 |
| 日常 | ANSI刷新/宽度、图像/附件、LSP进程和本地偏好 | 16ms节流不是实测CPU或延迟承诺 |
| 任务执行 | 宿主模型/工具，视觉桥可有额外模型调用 | 引擎本身不降低推理token或错误率 |
| 核对 | 状态/日志一致、审批范围、会话恢复与真实测试 | 快捷授权减少点击也增加误放行核验 |
| 维护 | DSH和fork库、LSP server、npm/mirror自动更新 | 查到latest不证明兼容且可能替换固定版本 |
| 退出/恢复 | raw模式、owned handles、pending、profile包状态 | best-effort终端恢复与任务副作用撤回不同 |

#### 效果

| 效果 | 当前支持 | 未知 |
|---|---|---|
| 终端交互 | 动态区、scrollback、键盘面板与事件投影 | 用户净效率、跨终端一致性 |
| 显示负担 | 刷新合并、visual-row budget和污染重铺 | 真实帧时/CPU/丢帧和阅读错误 |
| 工程接线 | 原生Agent输入、预设和LSP seam | coding任务质量与整体维护收益 |
| 生命周期 | signal/attach失败/dispose清理 | 异常环境和更新部分失败恢复 |

以完整coding任务正确完成计量，包含审批、恢复、环境修复和更新回滚。不要将自研/移植标签、主题数或渲染节流直接转换为开发效率；源码来源映射也不证明上游字节一致或无回归。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine/write-batcher.ts:51-72](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/engine/write-batcher.ts#L51-L72)

刷新节流机制。

<details>
<summary>查看原文（22行）</summary>

```text
  /** 请求刷新：距上次 flush ≥16ms 走 microtask，否则 16ms 尾沿（窗口内合并）。 */
  schedule(): void {
    if (this.pending) return
    this.pending = true
    const wait = MIN_FRAME_INTERVAL_MS - (Date.now() - this.lastFlushAt)
    if (wait <= 0) {
      const generation = this.generation
      void Promise.resolve().then(() => {
        if (!this.pending || generation !== this.generation) return
        this.pending = false
        this.runFlush()
      })
      return
    }
    this.timer = setTimeout(() => {
      this.timer = null
      if (!this.pending) return
      this.pending = false
      this.runFlush()
    }, wait)
    // 不拖住进程退出（shutdown/测试尾声的 pending 帧可丢弃）。
    this.timer.unref()
```

</details>

**依据 2 · 源码核查**：[src/engine/live-engine.ts:341-367](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/engine/live-engine.ts#L341-L367)

行预算及污染恢复有限边界。

<details>
<summary>查看原文（27行）</summary>

```text
  render(lines: readonly LiveRegionLine[], opts?: { reservedTail?: number }): void {
    // alt screen 期间主屏 live 区是冻结快照：不写 stdout，也不更新几何。
    if (this.probeSuppressed) return
    const bounded = this.applyRowBudget(this.normalizeLines(lines), opts?.reservedTail)
    const parking = this.computeParking(bounded)

    // 恢复重铺：CPR 检出外来写入污染后，不再信任 lastDisplayRows 的屏上假设
    // （H2 短路会被 lineCache 与屏上不符的内容欺骗，diff 会加剧错位）。
    // 爬升量以「追踪行数」与「最近 CPR 报告行」双封顶——绝不爬出视口顶。
    // 外来行撑高区域的行数不可知，顶部残留 ≤δ 行无法避免（相对寻址的固有限制），
    // 但外来文本被擦除、帧重新锚定，后续帧恢复一致。
    if (this.polluted) {
      this.polluted = false
      // resize 与污染判定常并发（reflow 移动光标即触发）：爬升前先按当前宽度从
      // lineCache 重算屏上行数。否则 lastDisplayRows 仍是旧宽度计数，变窄 reflow
      // 把区域撑高后爬升不足，旧帧顶部残留进 scrollback（resize 输入框叠屏）。
      this.reconcileWidth()
      const newDisplayRows = this.countDisplayRows(bounded)
      let body: string
      if (this.hasRendered && this.lastDisplayRows > 0) {
        const climb = Math.min(Math.max(0, this.lastDisplayRows - 1 - this.parkedRowsUp), Math.max(0, this.cprReportRow - 1))
        body = (climb > 0 ? cursorUp(climb) : '') + '\r' + ANSI.ERASE_SCREEN_END + this.buildAppend(bounded)
      } else {
        body = this.buildAppend(bounded)
      }
      this.stdout.write(ANSI.BEGIN_SYNC + ANSI.HIDE_CURSOR + body + this.buildParkSeq(parking) + ANSI.END_SYNC)
      this.lastDisplayRows = newDisplayRows
```

</details>

**依据 3 · 源码核查**：[src/adapter/send.ts:123-143](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/adapter/send.ts#L123-L143)

实际模型任务由Agent驱动。

<details>
<summary>查看原文（21行）</summary>

```text
export function controlsFromAgent(agent: Agent): AgentControls {
  return {
    followup: (text: string, images?: string[]) => {
      // 无图走同步快路径（与历史行为一致）；有图先经 attachments 持久化再投递。
      if (images === undefined || images.length === 0) {
        agent.followup(toUserMessageSync(text))
        return Promise.resolve()
      }
      return toUserMessage(agent.ctx, text, images).then((message) => {
        agent.followup(message)
      })
    },
    steer: (text: string) =>{  agent.steer(toUserMessageSync(text)) },
    inject: (text: string) =>{  agent.inject(toUserMessageSync(text)) },
    cancel: (cause: AgentCancelCause, options?: CancelOptions) => {
      if (options === undefined) agent.cancel(cause)
      else agent.cancel(cause, options)
    },
    whenIdle: () => agent.whenIdle(),
  }
}
```

</details>

**依据 4 · 源码核查**：[src/self-update.ts:324-349](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/self-update.ts#L324-L349)

更新与失败的维护成本。

<details>
<summary>查看原文（26行）</summary>

```text
 * 对照 npm latest；需要时在 profile 里安装。失败不抛（启动不能被更新拖死）。
 */
export async function runSelfUpdate(opts: RunSelfUpdateOptions = {}): Promise<UpdateResult> {
  const env = opts.env ?? process.env
  const startDir = opts.startDir ?? process.cwd()
  const profileDir = opts.profileDir ?? findProfileDir(startDir)
  const currentVersion = opts.currentVersion ?? readOwnVersion(startDir) ?? ''
  const installSpec = opts.installSpec ?? (profileDir === undefined ? undefined : readInstallSpec(profileDir))
  try {
    // 注入缝优先（测试密封化）；真实路径走 1h 磁盘缓存免每启联网
    const latest = opts.fetchLatest !== undefined
      ? await opts.fetchLatest()
      : await fetchLatestWithCache({
          cachePath: opts.cachePath ?? defaultUpdateCachePath(),
          now: opts.now?.() ?? Date.now(),
        })
    const plan = planSelfUpdate({ env, currentVersion, profileDir, installSpec, latest })
    if (plan.action === 'skip') return { kind: 'noop' }
    if (profileDir === undefined) return { kind: 'noop' }
    const install = opts.install ?? installNpmVersion
    await install(plan.latest, profileDir)
    return { kind: 'updated', version: plan.latest }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    return { kind: 'failed', error }
  }
```

</details>

#### 缺口

- 无同任务键盘/终端表现、误审批、CPU和总维护时间对照。
  **影响**：不能量化流畅、节时或开发收益。
  **进一步探讨**：默认入口/本TUI跑相同任务并测状态错误、审批错误、帧时、CPU和恢复工时。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁可试用，未来方向怎样证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

终端偏好明确、能管理DSH profile并核工具权限的用户，可先用一次性profile和可丢弃目录有限试用。固定宿主/插件版本，先核自更新影响、普通模式和审批，勿把Shift+Tab的Always-Approve当普通主题切换；再验证会话切换、中文/resize、异常退出和LSP按需进程。

保留条件是用户完成相同任务更容易、状态准确且环境/授权维护可控。若出现状态误读、授权超意图、版本被自动替换或终端恢复失败，应停相关功能并回默认TUI/Web，保留原会话日志、profile和依赖备份；UI重启不等于未执行工具已撤回。

可验证“可审阅的终端权限与环境变更条”假设：把当前会话临时授权、工具/前缀范围、自动更新计划和将启动的外部server以明确记录展示，并在重大变化后要求可核对状态，而非只靠短暂徽标/更新提示。相对当前本地flags与自动安装，可能减少用户无意扩大权限或失去版本可追溯性，代价是打断、额外面板和记录维护。

最小实验覆盖Normal/Plan/Always切换、跨会话、prefix授权、npm latest不同、skip和LSP首次启动，比较误放行、意外版本变化、任务时间和恢复。若提示条只增噪声且不减少错误，应收窄到高影响变化或推翻；当前尚无完整权限/环境变更账方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/ui/app.ts:2992-3026](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/ui/app.ts#L2992-L3026)

当前本地授权模式参照。

<details>
<summary>查看原文（35行）</summary>

```text
   * C3 项 4：Shift+Tab 三态循环（对齐 grok 的两轴模型，plan 与 permission 正交）：
   * Normal → Plan（planMode.set(true)）→ Always-Approve（plan off + 本地短路）→ Normal。
   * plan 切换经 planMode 服务（投影总线驱动 planState 徽标）；always-approve 是
   * 纯 TUI 本地标志（不持久化，退出即失），对审批 answerer 短路放行。
   * alwaysApprove 优先判断：它是同步本地态；planState 经投影异步更新，
   * 若按投影判断会在 Always-Approve 态误走回 Plan 分支。
   */
  private cycleMode(): void {
    if (this.approval.alwaysApprove) {
      // Always-Approve → Normal
      this.approval.setAlwaysApprove(false)
      this.statusLine?.setAlwaysApprove(false)
      this.flushLiveRender()
    } else if (this.planState.active) {
      // Plan → Always-Approve
      this.setPlanMode(false)
      this.approval.setAlwaysApprove(true)
      this.statusLine?.setAlwaysApprove(true)
      this.flushLiveRender()
    } else {
      // Normal → Plan
      this.setPlanMode(true)
    }
  }

  /**
   * /yolo：全放行模式快捷入口（approval always-approve 的显式开关）。
   * 与 Shift+Tab 循环进 always-approve 同语义（allowed-once 短路），但提供
   * 命令入口；退出会话时 app 侧复位逻辑（setAlwaysApprove(false)）同样覆盖。
   * @param flag - true 开启全放行（后续审批自动放行）；false 关闭。
   */
  private setYoloMode(flag: boolean): void {
    this.approval.setAlwaysApprove(flag)
    this.statusLine?.setAlwaysApprove(flag)
    this.flushLiveRender()
```

</details>

**依据 2 · 源码核查**：[src/controllers/approval-controller.ts:224-246](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/controllers/approval-controller.ts#L224-L246)

工具/前缀/全放行真实范围。

<details>
<summary>查看原文（23行）</summary>

```text
  handle(req: PendingApprovalRequest, next: () => Promise<ApprovalOutcome>): Promise<ApprovalOutcome> {
    const current = this.getCurrentSessionId()
    // C3 项 4：always-approve 短路放行（不挂起提示，不消费 pendingApproval）。
    // 仅限当前会话：非当前会话的请求必须 next() 委托（apiproxy 等链上 answerer），
    // 否则 TUI 会截胡远端转发的审批。
    if (this.alwaysApproveFlag && req.agent.session.id === current) {
      return Promise.resolve('allowed-once')
    }
    // 任务4a：工具级会话白名单短路——`t` 键加过的工具自动放行，其他工具仍
    // 逐卡审批。作用域与 always-approve 相同（仅当前会话）。
    if (this.allowedTools.has(req.toolName) && req.agent.session.id === current) {
      return Promise.resolve('allowed-once')
    }
    // 决策分层阶段 2：命令前缀会话白名单短路——`p` 键加过的前缀自动放行。
    // 前缀在此一次性提取（transcript 查找 + JSON 解析），挂起后缓存复用。
    const prefix = req.agent.session.id === current
      ? this.getCommandPrefix?.(req) ?? null
      : null
    if (prefix !== null && this.allowedPrefixes.has(prefix)) {
      return Promise.resolve('allowed-once')
    }
    if (req.agent.session.id !== current || this.pending !== null) {
      return next()
```

</details>

**依据 3 · 源码核查**：[src/self-update.ts:324-349](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/src/self-update.ts#L324-L349)

当前自动环境变更参照。

<details>
<summary>查看原文（26行）</summary>

```text
 * 对照 npm latest；需要时在 profile 里安装。失败不抛（启动不能被更新拖死）。
 */
export async function runSelfUpdate(opts: RunSelfUpdateOptions = {}): Promise<UpdateResult> {
  const env = opts.env ?? process.env
  const startDir = opts.startDir ?? process.cwd()
  const profileDir = opts.profileDir ?? findProfileDir(startDir)
  const currentVersion = opts.currentVersion ?? readOwnVersion(startDir) ?? ''
  const installSpec = opts.installSpec ?? (profileDir === undefined ? undefined : readInstallSpec(profileDir))
  try {
    // 注入缝优先（测试密封化）；真实路径走 1h 磁盘缓存免每启联网
    const latest = opts.fetchLatest !== undefined
      ? await opts.fetchLatest()
      : await fetchLatestWithCache({
          cachePath: opts.cachePath ?? defaultUpdateCachePath(),
          now: opts.now?.() ?? Date.now(),
        })
    const plan = planSelfUpdate({ env, currentVersion, profileDir, installSpec, latest })
    if (plan.action === 'skip') return { kind: 'noop' }
    if (profileDir === undefined) return { kind: 'noop' }
    const install = opts.install ?? installNpmVersion
    await install(plan.latest, profileDir)
    return { kind: 'updated', version: plan.latest }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    return { kind: 'failed', error }
  }
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:41-47](https://github.com/huiliyi37/dsh-tianshu-tui/blob/dcf2c4bd32b2a726620f38d3f076a0366267cb46/cordis.patch.yml#L41-L47)

首次LSP进程/下载来源参照。

```text
    - id: lsp-local
      name: '@huiliyi37/dsh-lsp-local'
      config:
        servers:
          typescript:
            command: npx
            args: ['-y', 'typescript-language-server', '--stdio']
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
