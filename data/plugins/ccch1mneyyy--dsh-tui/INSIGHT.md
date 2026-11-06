# dsh-TUI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[224f847](https://github.com/ccch1mneyyy/dsh-TUI/tree/224f847d02c2157f43862d2792cf9d7459222f4c)

<!-- BEGIN META -->
[![GitHub ★ 6,990](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C990&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ccch1mneyyy/dsh-TUI) [![npm 30d 62,591](https://img.shields.io/static/v1?label=npm+30d&message=62%2C591&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供交互式终端客户端、实时状态、会话投影与审批界面。

> **亮点**：[Q02](#research-q02)真实输入捕获session/generation、拒绝/held dock和不同取消回执，[Q03](#research-q03)durable seq/callId投影及同机claim，[Q04](#research-q04)审批陈旧key/重复标记与safe门形成具体终端接线贡献。Host Agent/权限/存储、第三方后端和底层renderer依赖分开归因，不用仓库体量或品牌证明效果。

> **主要限制**：[Q02](#research-q02) accepted/confirmed只到输入与队列，工具副作用不回滚；[Q03](#research-q03)live/history有意不同、迟到fallback会跳过，[Q04](#research-q04)external badge非身份证明且safe仍共享home凭据。若用户把界面状态当执行/隔离完成，就可能误重送或错批。

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
  - [Q01 · 终端应用为谁而设，和 Host、其他后端及原 CLI/Web 是什么关系？](#detail-section-11)
  - [Q02 · 界面输入怎样到真实执行，取消和退出会撤销什么？](#detail-section-12)
  - [Q03 · 实时与历史投影怎样匹配，迟到、重复与切会话有什么取舍？](#detail-section-13)
  - [Q04 · 审批来源标记与安全 profile 是否构成权限隔离？](#detail-section-14)
  - [Q05 · 试用与退出怎样控制版本、数据和资源负担？](#detail-section-15)
  - [Q06 · 现有投影贡献与恢复一致性方向如何独立验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 偏好终端内持续会话、工具/审批和恢复的开发者，需要确认输入属于哪个后端/会话及最终任务结果，原CLI/Web仍可做基线。

[Q01](#research-q01) 原DSH CLI/Web已有会话/模型/工具执行，TUI主要改变交互媒介和组合接缝；共享后端中立投影减少重复视图逻辑，但用户任务增益/可访问性未验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 终端会话 | 流、状态与键盘操作 | client，执行域属Host/后端 |
| 输入/取消 | FIFO提交、pending/dock与回执 | accepted非完成，user cancel保inbox |
| 历史投影 | durable seq/callId恢复与实时共用 | live-only表现不同，迟到fallback可跳过 |
| 审批 | 前台/后台ask、一次批准/拒绝 | external是提醒，非来源认证 |
| safe/退出 | 救援profile与root清理 | 共享home/凭据，5秒fallback非回滚 |

**流程与依赖**

| 依赖或条件 | 具体版本/作用 | 缺失或边界 |
|---|---|---|
| 客户端 | @deepseek-harness-tui/dsh-tui0.19.0，MIT | bin与Cordis入口，非新Agent内核 |
| Node/终端 | ^22.19 或 >=24及合适TTY | 终端宽度/模式需实际验 |
| DSH | contract primary0.2.2-rc.1；旧family映射/peer更宽 | 本轮未验安装/CI，drift不等于兼容成功 |
| Host服务 | Agent/会话/模型/工具/审批/持久化与shell | 权限/副作用仍归实际后端 |
| 其他后端 | Claude SDK/Codex等各自运行/权限 | 本稿不外推DSH契约 |
| home/凭据 | 独立低权限试验根、备份 | safe profile仍同home，不隔离账户 |

| 步骤 | 操作 | 核对与失败处理 |
|---|---|---|
| 准备 | 固定包/Node/Host，独立home与低敏会话 | 保原CLI/Web及备份 |
| 输入 | 一次虚构任务，核session/backend和pending | accepted只入队，拒绝held再决定 |
| 审批 | 核background Agent/工具/参数/来源标记 | external不明先拒，不批真实高权限动作 |
| 恢复/取消 | user/interrupt分开，核稳定行与队列 | 未确认不重送写，异常回CLI/Web查日志 |
| 退出 | 保存草稿/ID，核后台工具和已写内容 | 正常退出优先，safe非沙箱，强退后独立核 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 |
|---|---|---|
| 首次 | 包/渲染依赖/缓存/后端资源未知 | 版本/profile/TTY/备份配置分钟未知 |
| 持续 | 后端模型/工具、终端CPU/缓存日志未知 | 快捷键/审批与状态维护，净节时未测 |
| 失败恢复 | 重连/重试/重复作业资源未知 | 核JSONL/稳定行/ledger/队列，分钟未知 |
| 退出 | 已发生工具/模型用量未知 | 草稿/后台/文件与共享home残留另核 |

| 效果项 | 源码支持 | 尚不能证明 |
|---|---|---|
| 交互 | 真实Host输入/终端挂载 | 相比CLI/Web任务更快/可访问性好 |
| 恢复 | seq/callId/generation、共投影 | 所有迟到/重复最终一致 |
| 取消 | user保inbox、interrupt回执防重送 | 工具/外部进程停止和副作用撤销 |
| 审批 | key/来源badge/一次决定回接 | 来源认证/跨账户隔离 |
| 退出 | disposal/unload/有界fallback | 无残留或home还原 |

> **思考**：[Q02](#research-q02) accepted/confirmed只到输入与队列，工具副作用不回滚；[Q03](#research-q03)live/history有意不同、迟到fallback会跳过，[Q04](#research-q04)external badge非身份证明且safe仍共享home凭据。若用户把界面状态当执行/隔离完成，就可能误重送或错批。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)真实输入捕获session/generation、拒绝/held dock和不同取消回执，[Q03](#research-q03)durable seq/callId投影及同机claim，[Q04](#research-q04)审批陈旧key/重复标记与safe门形成具体终端接线贡献。Host Agent/权限/存储、第三方后端和底层renderer依赖分开归因，不用仓库体量或品牌证明效果。

[Q02](#research-q02)输入generation/FIFO和取消receipt防双送，[Q03](#research-q03)seq/callId/严格ledger与[Q04](#research-q04)面板key/来源标记有局部价值；同步Host输入契约、历史fallback、后台ask和5秒退出各有边界，不由大仓/回归文件数推可靠性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) accepted/confirmed只到输入与队列，工具副作用不回滚；[Q03](#research-q03)live/history有意不同、迟到fallback会跳过，[Q04](#research-q04)external badge非身份证明且safe仍共享home凭据。若用户把界面状态当执行/隔离完成，就可能误重送或错批。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 独立home低敏会话先核输入所属/普通取消保队列，恢复按[Q03](#research-q03)比持久稳定行。审批背景与external先核不明则拒；中断未知先不重送，保存ID后退CLI/Web。safe仅排障组合，后端凭据与已发生副作用另核。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定0.19.0根为终端client；DSH代表输入/恢复/审批及失败链已静态检查，限独立home终端偏好试用。未运行Host/终端/其他后端/模型，不承诺比CLI/Web更有效、审批来源不可伪造或退出回滚。

- 已检查：作者 README、包清单、源码路径 README.md、bin/dsh-tui.js、package.json、src/channel/projection.ts、src/components/approvals/ApprovalPanel.tsx、src/dsh-adapter/approvals.ts、src/dsh-adapter/backend/session.ts、src/dsh-adapter/channel/core/binding-feed.ts、src/dsh-adapter/channel/core/compose.ts、src/dsh-adapter/channel/core/local-actions.ts、src/dsh-adapter/channel/input-actions.ts、src/dsh-adapter/channel/input-delivery.ts、src/dsh-adapter/compat/shell.ts、src/dsh-adapter/contract.ts、src/dsh-adapter/fresh-agent.ts、src/dsh-adapter/index.ts、src/dsh-adapter/plugin.ts、src/dsh-adapter/root-dispose.ts、src/screens/Chat.tsx、src/sessionMounts.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整重核前稿六题/12findings；固定根DSH代表入口/Agent create-resume/真实输入/Host shell及取消、durable/transient译器与投影关键分支、同机claim、审批UI/回执、safe启动和root有界退出。未全审renderer/vendor、所有命令/删除/OAuth/更新/外部后端/插件生态和Host策略，规模非原创统计。
- 下一步：只读固定源码与研究材料装配/结构校验；未安装/运行目标脚本/测试、终端/Host/模型/OAuth或真实资料。未来隔离home按输入/取消/历史/审批/退出故障矩阵核，再比较CLI/Web任务和费用。

**分析版本**

- **仓库**：[ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI)
- **版本号**：0.19.0（[固定提交 224f847](https://github.com/ccch1mneyyy/dsh-TUI/tree/224f847d02c2157f43862d2792cf9d7459222f4c)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)用同durable日志验证并诊断最终稳定行/队列一致，排除刻意live-only帧；对照现有debug+人工JSONL核重复/reset/迟到/切会话/未知取消回执，漏行/误归属/双送或诊断假相等即推翻。已有共享projector不当新发明，无运行原型。

只读固定源码与研究材料装配/结构校验；未安装/运行目标脚本/测试、终端/Host/模型/OAuth或真实资料。未来隔离home按输入/取消/历史/审批/退出故障矩阵核，再比较CLI/Web任务和费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 132 | 32568 | — | — | 481324 |
| .mjs | source | 227 | 56001 | 43832 | 9406 | — |
| .js | source | 5 | 2337 | 1735 | 510 | — |
| .mjs | test | 6 | 1293 | 1183 | 26 | — |
| .mjs | example | 3 | 252 | 194 | 46 | — |
| .cjs | source | 5 | 482 | 329 | 131 | — |
| .ts | source | 1854 | 248225 | 171512 | 62805 | — |
| .tsx | source | 454 | 169481 | 132217 | 30617 | — |
| .ts | example | 4 | 753 | 558 | 143 | — |
| .js | example | 1 | 66 | 21 | 40 | — |
| .md | example | 1 | 39 | — | — | 383 |
| .mts | source | 2 | 168 | 120 | 39 | — |
| .ts | test | 5 | 291 | 172 | 102 | — |
| .js | test | 5 | 676 | 577 | 63 | — |

</details>

**活跃度**

[![Issue 未关闭 102](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=102&color=737b86&logo=github)](https://github.com/ccch1mneyyy/dsh-TUI/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 255](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=255&color=737b86&logo=github)](https://github.com/ccch1mneyyy/dsh-TUI/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 253](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=253&color=737b86&logo=github)](https://github.com/ccch1mneyyy/dsh-TUI/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核终端客户端实际Host输入、取消、历史投影、审批/救援与退出边界，判断终端偏好采用及恢复方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 终端应用为谁而设，和 Host、其他后端及原 CLI/Web 是什么关系？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

固定根为 @deepseek-harness-tui/dsh-tui 0.19.0，MIT，Node ^22.19 || >=24，提供dsh-tui/dst bin与Cordis导出，实际类型client。它从Host挂载界面演进到自己的组合入口，DSH仍是首方后端，Agent/会话/工具/模型/持久化权限域主要由后端提供；不因仓库拥有大量renderer/vendor文件就把Host执行引擎算自身原创。

目标是愿意在终端持续查看流、工具、审批和会话的开发者，成功仍是正确会话提交与后端任务结果。原DSH CLI/Web已经提供会话入口/执行，本项的可确认增量是终端状态/键盘交互及共享后端中立投影、自己的组合接缝；未证明比Web任务完成更快、可访问性更好或更省钱。README所列OAuth/扩展/成本条不是本轮验收效果。

包还有Claude/Codex后端及各自权限/安装条件，不能把DSH的审批或取消契约外推所有后端。contract.primary是0.2.2-rc.1，列出旧family兼容映射，peer范围更宽、运行drift提示与CI合同是作者工程声明，本轮未运行这些关口或安装版本。代表研究范围为DSH入口/Agent创建恢复、真实输入取消、历史实时投影、审批和启动救援/退出；其他后端/OAuth/全部渲染/插件生态不全审。前稿0.18.0六题和全部12findings按固定当前重新核，不继承旧点评评分。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-19](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/package.json#L1-L19)

版本/描述/许可证。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "@deepseek-harness-tui/dsh-tui",
  "version": "0.19.0",
  "description": "Interactive terminal interface for DeepSeek Harness agents, sessions and tools.",
  "keywords": [
    "dsh",
    "dsh-tui",
    "dsh-plugin",
    "deepseek",
    "deepseek-harness",
    "cordis",
    "tui",
    "terminal",
    "cli",
    "ink",
    "agent",
    "coding-agent"
  ],
  "license": "MIT",
```

</details>

**依据 2 · 源码核查**：[package.json:131-132](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/package.json#L131-L132)

当前Node声明。

```text
  "engines": {
    "node": "^22.19 || >=24"
```

**依据 3 · 作者声明**：[README.md:20-25](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/README.md#L20-L25)

作者终端定位和自有组装入口。

```text
> An interactive terminal UI for DeepSeek Harness. It ships a pixel-whale
> header, live work status, streaming thinking, double-Esc time rewind, a
> context progress bar, and a TPS gauge. Zero core changes: it consumes only
> DSH's public exports, and is moving from a mounted plugin to an app with its
> own entry and composition root, where DSH loads in process as the first-party
> backend. Install to enable; uninstall leaves no patches behind.
```

**依据 4 · 源码核查**：[src/dsh-adapter/contract.ts:21-29](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/contract.ts#L21-L29)

primary Host线0.2.2rc1。

```text
/** Primary validated upstream line (newest). */
export const UPSTREAM_VALIDATED_VERSION = '0.2.2-rc.1'

/**
 * The host CLI package whose installation `/update` aligns with the TUI.
 * Re-exported here (the literal stays in host-contract.ts) so engine planning
 * can name it without importing the host-only module.
 */
export const UPSTREAM_HOST_PACKAGE = HOST_PACKAGE
```

**依据 5 · 源码核查**：[src/dsh-adapter/contract.ts:47-65](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/contract.ts#L47-L65)

旧family验证声明与peer范围/运行drift边界。

<details>
<summary>查看原文（19行）</summary>

```text
 * Explicitly supported upstream prerelease lines, oldest first.
 *
 * 0.2.2-rc.1 = primary continuous-CI line (the model-selection projection,
 * Agent.model seam and PromptPresentation split land here); 0.2.1-rc.5 =
 * previous family still source-checked where CI covers it; 0.2.1-rc.4/rc.3/rc.2 = earlier
 * prereleases of the same family (published code compared with the primary);
 * 0.2.0-rc.2/rc.1 = previous family (mapped compatibility);
 * 0.1.7-rc.2/rc.1 = previous family (mapped compatibility);
 * 0.1.5-rc.1/alpha.2/alpha.1 = mapped
 * compatibility lines (source-checked when the primary line moves);
 * 0.1.3-alpha.2 = compatibility line (the only 0.1.3 build on npm);
 * 0.1.2-rc.1 = previous family (full CI coverage); 0.1.2-alpha.3–alpha.5 =
 * mapped compatibility lines; 0.1.1-rc.1/rc.2 = compatibility lines
 * (install- and type-level compatibility); 0.1.0-rc.7/rc.8 = full CI
 * coverage; 0.1.0-rc.6 = legacy line (install- and type-level
 * compatibility, feature surface may lack later additions — new features
 * must degrade gracefully there).
 * The peer range in package.json is deliberately wider than this list: an
 * install on an older or newer line is allowed but reports drift at boot.
```

</details>

**依据 6 · 源码核查**：[src/dsh-adapter/plugin.ts:1124-1130](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/plugin.ts#L1124-L1130)

选择backend session或DSH wrapper。

```text
  // The channel holds a backend session; this DSH one owns the resolved
  // handle (disposed by the binding when a later adoption replaces it).
  let startupSession: AgentSession
  if (backendStart !== undefined) startupSession = backendStart.session
  else if (agent !== undefined) startupSession = createDshSession(ctx, { agent, handle })
  else if (dshInEntry) startupSession = createStartingSession('dsh', sessionCwd)
  else throw new Error('dsh-tui: no startup session was opened')
```

#### 缺口

- 缺同用户CLI/Web对照、安装包/终端兼容与其他后端执行验收。
  **影响**：不能按功能清单承诺任务效率/可访问性或全后端能力一致。
  **进一步探讨**：固定DSH与终端在独立home比较同任务正确会话/恢复/人工负担，其他后端另按版本验。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 界面输入怎样到真实执行，取消和退出会撤销什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

入口apply若已有entry slot就attach，否则惰性import runtime、等loader后创建Cordis子插件，disposed先挡启动，失败交startup handler。runtime选择现有/新DSH Agent或其他后端session，registerTuiChannel并effect unregister，mountChannelUi接实际界面。DSH恢复读取persisted preset/model，reserve挂载失败/不可判占用会明确拒绝，resume失败abandon reservation并报错，不悄悄给新会话；新建实际createFreshAgent→agents.create，返回handle，部分workspace attachment失败仅警告不撤已持久会话。

state.inputActions接createInputDelivery，enqueue时捕获session object和binding generation，FIFO在mention I/O后再验current防旧文本送到新会话。先track pending preview，再await origin.session.submit；拒绝会清预览并按dropped/disposed保留held dock供用户决定，异常清pending并由chain日志后继续下一项。DSH wrapper submit检查disposed，设置pending ID，然后真实agent.steer或followup，now先cancel；accepted:true只说内核方法已同步接收，非模型输出/工具完成。此适配器明确使用同步Host输入契约，不把未await编造成已发生Promise故障。

普通cancel在UI设cancelPending并防重复，调用session.cancel(user)；DSH用keepInbox:true，所以已排队文字仍可下一turn执行。interrupt则drop自有队列，按回执stillQueued/confirmed决定能否保留可重送dock，failed/unknown撤dock重送权并提示以免双发；切会话后旧回执不应用。confirmed在DSH实现表示本地队列bookkeeping同步结果，不能证明外部工具/远端进程已停止或副作用回滚。borrowed Agent无handle的dispose不会主动销毁他人Agent。

!本地命令还经当前工作目录选择workspace/Host shell，真实resolve→execute/result或旧run，30秒；!!会把输出送回原session。它依赖Host shell/workspace策略，不是TUI自己给命令一个沙箱，输出也可能含敏感内容。退出入口卸载UI会走root disposal并unload已加载后端，5秒fallback可强制exit，teardown则只释放贡献/unmount后允许重组；已写文件/会话/远端动作与后台句柄不因关界面自动还原。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-adapter/index.ts:472-502](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/index.ts#L472-L502)

已有entry/loader异步/disposed与失败。

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

**依据 2 · 源码核查**：[src/dsh-adapter/plugin.ts:1255-1267](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/plugin.ts#L1255-L1267)

真实channel注册注销与UI挂载。

<details>
<summary>查看原文（13行）</summary>

```text
  // Register the live Channel for the adapter Kernel. The Channel driver
  // resolves it lazily from the composition root, so this can be called after
  // the plugin-host Kernel started without requiring a re-mount.
  // Normalize to the composition root: the Kernel and its Channel driver
  // query the registry through the root context, never through this plugin's
  // child activation context.
  const unregisterTuiChannel = registerTuiChannel(compositionRoot(ctx), rawChannel)
  ctx.effect(() => () => { unregisterTuiChannel() })
  const adapterRuntime = adapterRuntimeFor(ctx)
  // Looked up per probe: the plugin-host row can compose after the mount.
  const uiMount = mountChannelUi(ctx, rawChannel, ctx.get('tuiPluginHost'), adapterRuntime.mode, () => ctx.get('tuiPluginHost'))
  const channel = uiMount.channel
  bindChannelCommands(rawChannel, channel)
```

</details>

**依据 3 · 源码核查**：[src/dsh-adapter/plugin.ts:3264-3295](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/plugin.ts#L3264-L3295)

实际resume/preset/route与失败abandon。

<details>
<summary>查看原文（32行）</summary>

```text
      const persisted = await resolvePersistedPreset(ctx, resumeId)
      const composed = await composePreset(ctx, persisted)
      const recorded = await resolvePersistedRoute(ctx, resumeId)
      const resumeOptions = {
        provider: recorded?.provider ?? resumeRoute?.provider,
        model: recorded?.model ?? resumeRoute?.model,
      }
      const resumed = await ctx.agents.resume({
        resumeSessionId: resumeId,
        agentOptions: resumeOptions,
        ...(composed.setup === undefined ? {} : { setup: composed.setup }),
      })
      // Status-line route on resume: the route the session actually
      // continues on — its own request/header record, else the complete
      // cordis.yml deployment route (a bare log that pins none falls back to
      // the startup resolution, best effort).
      return {
        agent: resumed.agent,
        handle: resumed,
        agentPreset: composed.agentPreset,
        route: recordedModelRoute(snapshotLiveSessionEvents(resumed.agent.session)) ?? resumeRoute,
      }
    } catch (error) {
      // A claim says "this process is driving the log". A resume that never
      // mounted must not leave one behind for a peer to see and refuse.
      reservation.abandon()
      // A launch-time --resume is an explicit request: silently substituting a
      // fresh session presents a cold conversation as the resumed one (the
      // "resume did nothing" failure mode — the warn below never reached a
      // terminal). Fail the boot loudly instead; the loader surfaces this to
      // stderr. The in-session /resume picker has its own error path.
      const reason = error instanceof Error ? error.message : String(error)
```

</details>

**依据 4 · 源码核查**：[src/dsh-adapter/plugin.ts:3347-3370](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/plugin.ts#L3347-L3370)

新建Agent及reservation结果。

<details>
<summary>查看原文（24行）</summary>

```text
  let created: Awaited<ReturnType<typeof ctx.agents.create>>
  try {
    created = await createFreshAgent(ctx, ctx.agents, {
      sessionId,
      meta: {
        ...meta,
        // Durable header value: a later resume re-mounts exactly this preset.
        ...(composed.agentPreset === undefined ? {} : { agentPreset: composed.agentPreset }),
      },
      agentOptions: route,
      ...(composed.setup === undefined ? {} : { setup: composed.setup }),
    })
  } catch (error: unknown) {
    bootReservation?.abandon()
    // Fail loud with the reason on stderr — a dead TUI with no message is
    // the worst outcome for a misconfigured leaf (unknown provider/model).
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(
      `dsh-tui: failed to create agent (provider=${route.provider}, model=${route.model}): ${message}`,
      { cause: error },
    )
  }
  bootReservation?.settle()
  return { agent: created.agent, handle: created, agentPreset: composed.agentPreset, route }
```

</details>

**依据 5 · 源码核查**：[src/dsh-adapter/fresh-agent.ts:233-262](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/fresh-agent.ts#L233-L262)

callee实际agents.create与jsonl包装/清理。

<details>
<summary>查看原文（30行）</summary>

```text
export async function createFreshAgent(ctx: Context, agents: AgentCreator, options: CreateAgentOptions): Promise<AgentHandle> {
  const service = ctx.get('sessionPersistence') as JsonlPersistence | undefined
  // Legacy id-addressed stores and custom providers retain their own routing.
  if (service?.name !== 'session-persistence-jsonl' || typeof service.open !== 'function') return agents.create(options)
  const source = concreteService(service)
  let writer: SessionWriter | undefined
  let deferred = false
  const defer = (owner: Context, session: FilteredSession): void => {
    if (deferred || writer === undefined || session.seq !== 0) return
    deferInitialPolicy(owner, session, writer, source)
    deferred = true
  }
  const stopCapture = captureWriter(source, String(options.sessionId), value => { writer = value })
  let stopEntry = (): void => {}
  const setup: AgentSetup = async (agentCtx, agent) => {
    const commit = await options.setup?.(agentCtx, agent)
    if (commit === undefined) { defer(agentCtx, agent.session); return }
    // Older stores do not capture a carrier at entry; retain their original
    // post-commit fallback. New stores already own the gate before setup.
    return { commit() { commit.commit(); defer(agentCtx, agent.session) } }
  }
  try {
    const sessions = ctx.get('sessions') as SessionEntryStore | undefined
    if (typeof sessions?.enter === 'function') {
      stopEntry = captureSessionEntry(concreteService(sessions), String(options.sessionId), defer)
    }
    return await agents.create({ ...options, setup })
  } finally {
    try { stopEntry() } finally { stopCapture() }
  }
```

</details>

**依据 6 · 源码核查**：[src/dsh-adapter/plugin.ts:1080-1094](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/plugin.ts#L1080-L1094)

已持久会话workspace attachment失败仅警告。

<details>
<summary>查看原文（15行）</summary>

```text
      const ownershipCwd = agent.session.header.cwd ?? meta.cwd
      const attached = await attachSessionToWorkspace(ctx, ownershipCwd, agent.session.id)
      if (!attached) {
        ctx.logger.warn(
          `dsh-tui: session "${agent.session.id}" has no workspace ownership because workspaceRegistry is not mounted`,
        )
      }
    } catch (error) {
      // The Session is already published and durable, matching Web's partial
      // failure contract. Keep the TUI usable but make the missing ownership
      // loud instead of silently leaving the conversation Ungrouped.
      ctx.logger.warn(
        `dsh-tui: session "${agent.session.id}" workspace attachment failed: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
```

</details>

**依据 7 · 源码核查**：[src/dsh-adapter/channel/core/compose.ts:318-322](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/core/compose.ts#L318-L322)

input delivery实际接线。

```text
  const inputDelivery = createInputDelivery(ctx, owner, binding, () => state,
    (...args) => notify(...args), trackPending, untrackPending, composer,
    () => currentSelection, (messageId, info) => selectionAttachments.remember(messageId, info),
    files.fallbackFs, localImages, () => contextRegistry.consume())
  const { dispatchUserText, withDecisionPending, clearStagedImages } = inputDelivery
```

**依据 8 · 源码核查**：[src/dsh-adapter/channel/input-delivery.ts:147-161](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/input-delivery.ts#L147-L161)

enqueue-time原session/generation。

<details>
<summary>查看原文（15行）</summary>

```text
  /** Stale fence: the submission belongs to the session it was typed in (the
   *  bound session object plus the binding generation every adoption
   *  advances; works for any backend, no DSH agent needed). */
  const current = (origin: UserTextOrigin): boolean =>
    owner.current() && binding.session === origin.session && state().agentBindingGeneration === origin.generation

  /** D-6: bind the submission to the session it was typed in AT ENQUEUE
   *  TIME. The FIFO chain may park this task behind a slow predecessor
   *  while the user /new's away — capturing the agent at run time would
   *  adopt the NEW session as this text's origin and deliver the old
   *  conversation's words into it. */
  const captureOrigin = (): UserTextOrigin => {
    const local = localImages?.()
    return {
    session: binding.session,
```

</details>

**依据 9 · 源码核查**：[src/dsh-adapter/channel/input-delivery.ts:207-212](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/input-delivery.ts#L207-L212)

I/O后stale拒。

```text
    // Mention reads can park for arbitrary I/O. A session switch during that
    // await invalidates the whole submission; neither the old nor the new
    // agent may receive a message assembled for a different conversation.
    if (!current(origin)) {
      notify(t('ext-stale-dropped'), { color: 'warning', timeoutMs: 4000 })
      return
```

**依据 10 · 源码核查**：[src/dsh-adapter/channel/input-delivery.ts:230-268](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/input-delivery.ts#L230-L268)

pending→submit→拒绝/异常实际处理。

<details>
<summary>查看原文（39行）</summary>

```text
    // rolls both the pending preview and this entry back.
    if (attach !== undefined) attachedByMessageId.set(message.id, attach)
    // Track BEFORE the submit: a synchronous throw inside it rolls the
    // preview back; otherwise the backend's pending changes retire it once
    // the message is claimed or discarded.
    trackPending({ id: message.id, text, images, contexts: origin.attachedContexts }, placement)
    try {
      // The message id IS the clientMessageId every ledger above keys on; the
      // DSH session delivers this exact message (steer/followup).
      // A session that takes images itself reads them through their
      // in-memory facades, in block order.
      const local = origin.localImages
      const images = local === undefined ? undefined : expansion.blocks.flatMap(block => {
        if (block.type !== 'image') return []
        const view = local.facade(block.attachment)
        return view === undefined ? [] : [view]
      })
      const result = await origin.session.submit({ text, blocks: message.content, clientMessageId: message.id, native: message, ...(images === undefined || images.length === 0 ? {} : { images }) }, placement)
      // A backend refusal need not emit pending.changed. Retire its preview
      // and attached context here, and show the refusal instead of queuing it.
      // An ended session refuses every retry: its text stays as a held dock
      // row instead (#1651), sent only when the user sends the dock.
      if (!result.accepted) {
        if (attach !== undefined) attachedByMessageId.delete(message.id)
        // A backend that is certain it never ran the input asks for it back
        // (`dropped`), like an ended session: keep the text as a dock row.
        const hold = result.dropped === true || origin.session.status === 'disposed'
        untrackPending(message.id, hold)
        // A refusal with no reason is still a refusal: say so, or the send
        // looks successful while nothing was queued.
        const reason = result.reason !== undefined && result.reason !== '' ? result.reason : t('input-not-accepted')
        if (hold) notify(t('input-refused-held', { reason }), { color: 'warning', timeoutMs: 6000 })
        else notify(reason, { color: 'warning', timeoutMs: 4000 })
        return
      }
    } catch (error) {
      if (attach !== undefined) attachedByMessageId.delete(message.id)
      untrackPending(message.id)
      throw error
```

</details>

**依据 11 · 源码核查**：[src/dsh-adapter/channel/input-delivery.ts:416-440](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/input-delivery.ts#L416-L440)

FIFO捕获与chain错误不终止后续。

<details>
<summary>查看原文（25行）</summary>

```text
  const dispatchUserText = (
    text: string,
    placement: PendingMessage['placement'],
    images: readonly ComposerImageRef[] = [],
    attach?: UserMessage,
    contexts?: readonly AttachedContext[],
  ): void => {
    const captured = captureOrigin()
    // A dock re-send carries the contexts the row saved: the live chips were
    // consumed by the submission that was refused (#1651). `captureOrigin`
    // already took whatever the user staged since, so merge — never replace —
    // or those chips would be neither sent nor kept.
    const origin = contexts === undefined || contexts.length === 0
      ? captured
      : { ...captured, attachedContexts: mergeAttachedContexts(contexts, captured.attachedContexts) }
    const capturedImages = composer.captureDraftImages(text, images)
    dispatched += 1
    inFlight.push(text)
    inputChain = inputChain.then(() => runUserTextDecision(text, placement, capturedImages, origin, attach)).catch((error: unknown) => {
      // The chain must survive a failed decision: log, then continue with
      // the next queued submission.
      ctx.logger.warn('dsh-tui: tui/input dispatch failed: %o', error)
    }).finally(() => {
      settled += 1
      inFlight.shift()
```

</details>

**依据 12 · 源码核查**：[src/dsh-adapter/backend/session.ts:328-364](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/backend/session.ts#L328-L364)

真实steer/followup、cancel队列与borrowed dispose。

<details>
<summary>查看原文（37行）</summary>

```text
    // Synchronous by contract for DSH: steer/followup run before this returns,
    // and a synchronous throw reaches the caller synchronously (the input
    // pipeline rolls its bookkeeping back on it).
    submit(input: AgentInput, placement: SubmitPlacement) {
      // A disposed agent can neither run nor report this input: refuse it
      // instead of queuing a preview nothing will ever retire.
      if (disposed) return Promise.resolve({ accepted: false, reason: t('input-session-disposed') })
      const message = messageFor(input)
      const queued = placement === 'steer' ? 'steer' : 'followup'
      pending.set(message.id, { id: message.id, text: input.text, placement: queued })
      try {
        if (placement === 'now') dropOwn(() => agent.cancel({ kind: 'user' }))
        if (placement === 'steer') agent.steer(message)
        else agent.followup(message)
      } catch (error) {
        pending.delete(message.id)
        throw error
      }
      return Promise.resolve({ accepted: true })
    },

    cancel(cause: CancelCause) {
      // `user` keeps the queue, so queued/steered inputs run as the next turn.
      // Every other cause drops it: after `interrupt` the channel parks those
      // inputs in a dock and re-delivers nothing until the user sends it, and
      // a switch/dispose never resumes the old queue. keepInbox is only for
      // the user-cancel and normal turn-end paths.
      if (cause === 'user') agent.cancel({ kind: 'user' }, { keepInbox: true })
      else dropOwn(() => agent.cancel({ kind: 'user' }))
      // The kernel cancel settles its bookkeeping synchronously: the answer
      // is definitive either way (kept ids for a 'user' cancel, an emptied
      // queue otherwise).
      return Promise.resolve({ stillQueued: cause === 'user' ? [...pending.keys()] : [], outcome: 'confirmed' })
    },

    dispose(): Promise<void> {
      return handle === undefined ? Promise.resolve() : handle.dispose()
```

</details>

**依据 13 · 源码核查**：[src/dsh-adapter/channel/input-actions.ts:125-142](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/input-actions.ts#L125-L142)

user cancel窗口和保队列。

<details>
<summary>查看原文（18行）</summary>

```text
    cancel() {
      owner.assertActive()
      const state = getState()
      const session = getSession()
      // Keep the staged queue: an interrupt aborts the running turn but the
      // queued/steered messages are delivered as the next turn (web parity).
      // Cancellation converges asynchronously; ignore a repeated Esc/Ctrl+C
      // until the aborted turn has produced its terminal event. `cancelPending`
      // mirrors that window for the UI, where a repeated press force-exits.
      if (input.cancelInFlight) return
      input.cancelInFlight = true
      input.cancelCause = 'user'
      state.cancelPending = true
      // Publish the window: the UI needs to show that the interrupt was
      // received (and its watchdog needs the state change) even when the
      // abort never converges and no backend event follows.
      state.emit()
      void session.cancel('user')
```

</details>

**依据 14 · 源码核查**：[src/dsh-adapter/channel/input-actions.ts:202-257](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/input-actions.ts#L202-L257)

interrupt回执/stillQueued/unknown重送防重复。

<details>
<summary>查看原文（56行）</summary>

```text
      const settle = (outcome: CancelOutcome, stillQueued: readonly string[]): void => {
        if (settled) return
        settled = true
        // A newer request owns the bookkeeping once it replaced ours.
        if (input.uncoveredDockIds === uncovered) {
          input.uncoveredDockIds = undefined
          input.interruptReceiptPending = false
        }
        if (input.provisionalDockIds === provisional) input.provisionalDockIds = undefined
        // The channel moved to another session: its dock and its queue are
        // not the ones this receipt speaks about.
        if (getSession() !== session) return
        // The session ended meanwhile: its end held every row and their
        // backend copies went with it, so this answer neither un-docks them
        // nor reports a queue that will still run.
        if (session.status === 'disposed') return
        // Every docked row this receipt cannot confirm dropped: the ids the
        // backend says it kept, plus every row docked after the request
        // fired (outside its snapshot). Those copies are still live: their
        // previews go back to the normal claim/discard retirement and the
        // dock never offers a second send on top of them. Only a confirmed
        // answer graduates the provisional rows; any other verdict un-docks
        // them too, so nothing keeps edit/re-send rights a late revocation
        // could no longer reach.
        const revoke = new Set([...stillQueued, ...uncovered])
        if (outcome !== 'confirmed') for (const id of provisional) revoke.add(id)
        // A newer request that carried our rows over holds them no longer
        // than this answer needs.
        const held = input.provisionalDockIds
        if (outcome === 'confirmed' && held !== undefined && held !== provisional) {
          for (const id of provisional) {
            const index = held.indexOf(id)
            if (index !== -1 && !revoke.has(id)) held.splice(index, 1)
          }
        }
        if (revoke.size > 0) {
          let undocked = false
          state.pending = state.pending.map(item => {
            if (item.docked !== true || !revoke.has(item.id)) return item
            undocked = true
            return { ...item, docked: undefined }
          })
          if (undocked) state.emit()
        }
        // The unconfirmed legs are loud: a failed or answerless interrupt
        // must not leave a success-shaped dock (or a silently failed Esc).
        const notice = outcome === 'failed' ? t('interrupt-failed')
          : revoke.size === 0 ? undefined
          : t('interrupt-unconfirmed')
        if (notice !== undefined) state.notify(notice, { color: 'warning', timeoutMs: 6000 })
      }
      void session.cancel('interrupt')
        .then(receipt => { settle(receipt.outcome, receipt.stillQueued) })
        // A backend that breaks the receipt contract by throwing gets the
        // same revocation; the catch must not keep the dock.
        .catch(() => { settle('failed', dockedNow) })
```

</details>

**依据 15 · 源码核查**：[src/dsh-adapter/channel/core/local-actions.ts:114-144](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/core/local-actions.ts#L114-L144)

真实工作目录shell和!!输出送回。

<details>
<summary>查看原文（31行）</summary>

```text
  async function runLocal(command: string, includeInContext: boolean): Promise<void> {
    const capture = binding.capture()
    const current = (): boolean => owner.current() && binding.isCurrent(capture)
    const cwd = sessionWorkingDirectory(state)
    const target = deps.workspace.describe(cwd)
    state.rows.push({ id: rowIds.value++, kind: 'local', text: command, executionTarget: target.kind === 'local' ? target.badge : `${target.badge} · ${target.label}` })
    state.emit()
    const executor = await deps.workspace.commandShell(cwd) ?? ctx.get('shell') as ForegroundShell | undefined
    if (!current()) return
    if (executor === undefined) {
      deps.unavailable('shell')
      return
    }
    let output: string
    try {
      const result = await runForegroundShell(executor, { command, workdir: cwd, timeoutMs: 30000 })
      output = result.stdout.text.trim() || result.stderr.text.trim() || (result.timedOut ? '(timed out)' : '(no output)')
    } catch (error) {
      output = error instanceof Error ? error.message : String(error)
    }
    if (!current()) return
    state.rows.push({ id: rowIds.value++, kind: 'local-output', text: preview(output, LOCAL_OUTPUT_LIMIT) })
    state.emit()
    if (includeInContext) {
      // This runs detached (`void runLocalCommand`): a session that closed
      // meanwhile (a backend process that exited) must not surface as an
      // unhandled rejection.
      try {
        await capture.session.submit({ text: `<bash-stdout>\n${output}\n</bash-stdout>`, clientMessageId: randomUUID() }, 'followup')
      } catch (error) {
        if (current()) notify(t('send-failed', { err: error instanceof Error ? error.message : String(error) }), { color: 'error', timeoutMs: 8000 })
```

</details>

**依据 16 · 源码核查**：[src/dsh-adapter/compat/shell.ts:20-28](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/compat/shell.ts#L20-L28)

Host resolve→execute/result或run。

```text
/** Resolve through the host so workspace, timeout and sandbox policy survive. */
export async function runForegroundShell(shell: ForegroundShell, request: ShellRequest): Promise<ShellResult> {
  const spec = shell.resolve(request)
  if (typeof shell.execute === 'function') {
    const execution = await shell.execute(spec)
    return execution.result()
  }
  if (typeof shell.run === 'function') return shell.run(spec)
  throw new Error('dsh-tui: shell provides neither execute() nor run()')
```

**依据 17 · 源码核查**：[src/dsh-adapter/plugin.ts:2987-2996](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/plugin.ts#L2987-L2996)

teardown标记/释放贡献/unmount。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.effect(() => () => {
    logMouseDebug('apply teardown')
    funnel.markTeardown()
    // Drop the crash backstop with this mount: a torn-down funnel cannot own
    // the process, so a later fatal error falls back to Node's default crash
    // instead of reaching a disposed ctx.
    registerProcessGuardFatalSink(undefined)
    if (exitSeam?.request === requestProcessExit) exitSeam.request = undefined
    rawChannel.releaseContributions()
    instance?.unmount()
```

</details>

**依据 18 · 源码核查**：[src/dsh-adapter/plugin.ts:3922-3945](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/plugin.ts#L3922-L3945)

root/后端清理与5秒fallback。

<details>
<summary>查看原文（24行）</summary>

```text
function disposeRootAndThen(ctx: Context, done: () => void, fallback: number | (() => void) = 1): void {
  const startedAt = Date.now()
  const timer = setTimeout(() => {
    // Diagnosis for a stalled disposal: without this line the fallback exit
    // is indistinguishable from a successful handoff in the field.
    logRestartEvent('dispose: timeout, taking fallback exit', typeof fallback === 'number' ? { fallbackCode: fallback } : { fallback: 'signal' })
    if (typeof fallback === 'number') process.exit(fallback)
    else fallback()
  }, 5000)
  timer.unref()
  // A composition still running into this root settles first.
  // The pooled, process-wide resources of every backend this process actually
  // loaded are closed here — after the fiber, never before (P0 D4-P2/P3).
  void disposeRootSettled(ctx, () => withHostRootCapability(() => ctx.root.fiber.dispose())).finally(() => unloadBackends()).then(
    () => {
      clearTimeout(timer)
      // The teardown's length, to restart.log only (never the terminal).
      logRestartEvent('dispose: root disposed', { ms: Date.now() - startedAt })
      done()
    },
    () => {
      clearTimeout(timer)
      done()
    },
```

</details>

**依据 19 · 源码核查**：[src/dsh-adapter/root-dispose.ts:38-48](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/root-dispose.ts#L38-L48)

等待组合settle后真正root fiber.dispose。

<details>
<summary>查看原文（11行）</summary>

```text
export async function disposeRootSettled(ctx: Context, dispose: () => Promise<unknown> = () => ctx.root.fiber.dispose()): Promise<unknown> {
  const composition = compositions.get(ctx.root)
  if (composition !== undefined) {
    composition.disposing = true
    try {
      await composition.settle()
    } catch {
      // A failed activation is the composition's to report; dispose anyway.
    }
  }
  return dispose()
```

</details>

#### 缺口

- 未运行真实Host输入/取消/副作用、跨进程挂载与退出恢复。
  **影响**：入队和confirmed不等于任务成功/无残留，异常可能部分会话已持久。
  **进一步探讨**：隔离home用虚构输入核FIFO切会话、user/interrupt区别、Host shell和5秒退出后实际文件/进程状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 实时与历史投影怎样匹配，迟到、重复与切会话有什么取舍？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

DSH session wrapper把durable event交translator.translateEvent，实时assistant frame走同一session译器但用FRAME/QUIET唤醒，监听都验active和subject Agent，compaction还验purpose与sessionId。history()另建throwaway translator读取durable snapshot，不改实时译器open-call/frame ledger；adoption的显式translateReplay/reset才会改变live译器。transient streaming不是持久真相，不能从一帧动画证明最终保存。

binding-feed route对整个batch先current generation门，pending/status等控制更新后送唯一projector。live session.reset会拆batch并调用onReset，replay不调这个live回调；paintHistory replay后settleStreaming、working/cancelPending false。resetProjection同时清projector与译器账本，防旧seq影响新session。fallback异步history只在尚无live rows时绘制，若实时先到就日志后跳过，以避免错序；这是fallback不补旧历史的取舍，不宣称一定漏历史：正常/new/resume/rewind由调用方预读seed，未完整审所有adoption。

共享projector确实有具体输出处理：assistant message按durable seq去重，streaming按seq复用已有sealed row，tool结果按callId找卡/问卷，问卷结果由durable log投影而不是UI乐观助手事实。replay清本次处理ledger、step/attempt和fresh，复用屏幕上行再按历史events折叠。共享折叠减少两个视图逻辑漂移，但不意味着live与replay逐帧、toast、retry动画完全相同，也不证明所有legacy/多后端事件都正确。测一致性应比较稳定行身份、内容、顺序和工具结果，排除刻意live-only装饰。

同机多进程另有sessionMounts ledger：reserve→claim在跨进程lock内严格读ledger、检查活pid占用并写自己的记录，损坏/忙拒；abandon只释放自己新拿的claim。它是同机协调，pid复用可误拒而非证明没人写，Host日志锁仍是权威；不是任意Web/远端进程都遵守的全球写锁或租户权限。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-adapter/backend/session.ts:201-221](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/backend/session.ts#L201-L221)

history独立译器/active监听。

<details>
<summary>查看原文（21行）</summary>

```text
    // A throwaway translator: `history()` is a read, so it must neither reset
    // the live translator's frame fence nor leave the replay's open calls in
    // the live open-call ledger. (Adoption seeds still go through
    // `native.translateReplay`, which is a deliberate live reset.)
    history: () => Promise.resolve(createDshTranslator(translatorDeps).translateReplay(snapshotLiveSessionEvents(agent.session))),

    subscribe(listener) {
      // A callback the bus retained past unsubscription (a dispatch already
      // in flight, an ABA rebind) is inert: nothing is translated for it.
      let active = true
      const disposers: (() => void)[] = [() => { active = false }]
      const own = (dispose: () => void): void => { disposers.push(dispose) }
      try {
        own(ctx.on('agent/status', ({ agent: subject, status }) => {
          if (!active || subject !== agent) return
          listener([{ type: 'session.status', status }], QUIET)
        }))
        own(ctx.on('agent/disposed', ({ agent: subject }) => {
          if (!active || subject !== agent) return
          disposed = true
          listener([{ type: 'session.status', status: 'disposed' }], QUIET)
```

</details>

**依据 2 · 源码核查**：[src/dsh-adapter/backend/session.ts:270-319](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/backend/session.ts#L270-L319)

durable/transient/compaction实际译器与scope门。

<details>
<summary>查看原文（50行）</summary>

```text
        const onEvent = (event: SessionEvent): void => {
          if (!active) return
          if (event.type === 'request/context') {
            // A prepared step can still report A after the next route became B.
            // Keep that record in raw history, but do not publish its capacity
            // into B's live view (or warn on it before a later reconciliation).
            const route = event.data as { provider?: unknown; model?: unknown }
            const model = (agent as { readonly model?: { current?(): { provider: string; model: string } | undefined } }).model
            const selected = typeof model?.current === 'function' ? model.current() : undefined
            if (selected !== undefined && typeof route.provider === 'string' && route.provider !== '' &&
                typeof route.model === 'string' && route.model !== '' &&
                (route.provider !== selected.provider || route.model !== selected.model)) return
          }
          // Legacy per-token chunks arrive as session events; they wake the
          // renderer frame-coalesced like live stream frames.
          listener(translator.translateEvent(event), (event as { type: string }).type === 'assistant/chunk' ? FRAME : SYNC)
        }
        eventListeners.add(onEvent)
        own(() => {
          eventListeners.delete(onEvent)
          untapEvents()
        })
        tapEvents()
        // Live streaming (dsh 0.1.5+; older hosts never emit this): per-token
        // chunks are transient attempt frames on this agent-scoped event, and
        // the durable result still arrives through `session/event`. A start
        // frame alone changes nothing visible, so it does not wake the
        // renderer.
        own(ctx.on('agent/assistant-stream', ({ agent: subject, frame }) => {
          if (!active || subject !== agent) return
          listener(translator.translateFrame(frame), frame.type === 'chunk' ? FRAME : frame.type === 'end' ? SYNC : QUIET)
        }))
        // Live compaction progress. The summarizer is one `ctx.llm.stream()`
        // call, so its chunks are the only sign of work between
        // `compaction/start` and `compaction/end`. dsh-llm tags that call
        // `purpose: 'compaction'`, and a manual compaction runs while the
        // session is idle, so it cannot be mixed up with a turn's stream. Any
        // other purpose or session gets the original iterable back.
        // A summary stream that started while subscribed keeps reporting until
        // it ends; the channel decides what a late report may still touch.
        own(ctx.on('llm/stream', (options, next) => {
          const stream = next()
          if (!active || options.purpose !== 'compaction') return stream
          if (options.sessionId === undefined || String(options.sessionId) !== String(agent.session.id)) return stream
          return (async function* compactionStream() {
            for await (const chunk of stream) {
              if (isTokenDelta(chunk)) listener([{ type: 'compaction.progress', outputChars: tokenDeltaChars(chunk) }], FRAME)
              yield chunk
            }
          })()
```

</details>

**依据 3 · 源码核查**：[src/dsh-adapter/channel/core/binding-feed.ts:159-220](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/core/binding-feed.ts#L159-L220)

全batch generation与live reset/projector实际路由。

<details>
<summary>查看原文（62行）</summary>

```text
  const route = (batch: readonly AgentEvent[], meta: AgentEventMeta, current: () => boolean): void => {
    // The generation fence covers the whole batch, whatever it carries. A
    // callback retained past a rebind (an in-flight dispatch, a compaction
    // summary stream that outlived the binding it started under) must never
    // write the replacement session's transcript.
    if (!current()) return
    let admitted: AgentEvent[] | undefined
    let progressOnly = batch.length > 0
    for (const [index, event] of batch.entries()) {
      switch (event.type) {
        case 'turn.start':
          if (!meta.replay) turnStarts += 1
          break
        case 'turn.end':
          if (!meta.replay) turnEnds += 1
          break
        case 'session.status':
          applyStatus(event.status)
          break
        case 'pending.changed':
          applyPending(event)
          break
        case 'compaction.progress':
          // Summary output only advances a compaction row that is open; a
          // stale stream after the row closed finds nothing to advance.
          if (deps.state.compaction === undefined || deps.ownsCompactionProgress?.()) {
            admitted ??= batch.slice(0, index)
            continue
          }
          break
        default:
          break
      }
      if (event.type !== 'compaction.progress') progressOnly = false
      admitted?.push(event)
    }
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
    }
    if (meta.wake === 'frame') deps.state.emitStream()
    else if (meta.wake !== 'none') deps.state.emit()
    deps.taskCompletion?.(events, meta, current)
```

</details>

**依据 4 · 源码核查**：[src/dsh-adapter/channel/core/binding-feed.ts:353-388](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/core/binding-feed.ts#L353-L388)

reset/replay settle/迟到fallback跳过。

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

**依据 5 · 源码核查**：[src/channel/projection.ts:300-324](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/channel/projection.ts#L300-L324)

seq复用已有assistant streaming行。

<details>
<summary>查看原文（25行）</summary>

```text
  const openStreaming = (seq?: number): ChatRow => {
    // `fresh` is a LIVE-only claim (channel-view.ts): a replay batch folds the
    // session's own durable deltas through this same factory, and a replayed
    // row that claims freshness makes the transcript typewrite history from
    // its first character on every resume.
    streaming = { id: deps.rowIds.value, kind: 'assistant', text: '', streaming: true, fresh: !replaying, ...seq !== undefined ? { seq } : {} }
    deps.rowIds.value += 1
    appendRow(streaming)
    indexAssistantRow(streaming)
    return streaming
  }

  const ensureStreaming = (seq?: number): ChatRow => {
    if (streaming !== undefined) return streaming
    // A reconnect can replay the first delta after the sealed message was
    // already observed. Reuse that durable row instead of opening a second
    // assistant bubble for the same event sequence.
    const existing = seq === undefined ? undefined : assistantRowsBySeq.get(seq)
    if (existing !== undefined) {
      existing.streaming = true
      touchRow(existing)
      streaming = existing
      return existing
    }
    return openStreaming(seq)
```

</details>

**依据 6 · 源码核查**：[src/channel/projection.ts:599-625](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/channel/projection.ts#L599-L625)

durable assistant去重与settle。

<details>
<summary>查看原文（27行）</summary>

```text
  const applyAssistantMessage = (event: AgentEventOf<'assistant.message'>): void => {
    if (handledAssistantMessages.has(event.seq)) return
    handledAssistantMessages.add(event.seq)
    // A canonical settlement embeds its complete attempt; older settlements
    // may omit reasoning that is still durably recorded in legacy deltas.
    const canonical = event.canonical
    const text = textOfBlocks(event.blocks)
    const images = event.images ?? NO_IMAGES
    const reasoningText = event.blocks
      .map(block => (block.type === 'reasoning' ? block.text : ''))
      .join('')
    // A backend's own message anchor beyond the seq (DSH anchors are the
    // seq, so DSH rows carry none) is how "load earlier" finds the durable
    // message a folded row came from.
    const anchor = event.anchor === '' || event.anchor === String(event.seq) ? undefined : event.anchor
    const settledReasoning = lastReasoningRow !== undefined && lastReasoningRow.turn === event.turn && lastReasoningRow.step === event.step
      ? lastReasoningRow.row : reasoning
    if (settledReasoning !== undefined) {
      if (reasoningText === '') {
        // A count-only thinking row (no text was ever recorded) settles as
        // its one-line summary instead of vanishing with the empty block.
        if (canonical && settledReasoning.reasoningTokens === undefined) removeRow(settledReasoning)
        else if (anchor !== undefined && settledReasoning.anchor === undefined) settledReasoning.anchor = anchor
      } else {
        settledReasoning.text = reasoningText
        settledReasoning.seq ??= event.seq
        if (anchor !== undefined) settledReasoning.anchor ??= anchor
```

</details>

**依据 7 · 源码核查**：[src/channel/projection.ts:925-957](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/channel/projection.ts#L925-L957)

callId/问卷结果与失败工具卡。

<details>
<summary>查看原文（33行）</summary>

```text
  const applyToolResult = (event: AgentEventOf<'tool.result'>): void => {
    const callId = event.callId
    const card = toolCards.get(callId)
    const askArguments = askCalls.get(callId)
    // A call with no card is usually a question-presented one (above). Its
    // interaction lives in the panel, but its outcome still belongs in the
    // transcript, projected from the durable log here: consumed before the
    // card branch so the two can never both fire, and deleted so a repeated
    // replay of the same result cannot double the record.
    if (card === undefined && askArguments !== undefined) {
      projectAskResult(event, askArguments)
      askCalls.delete(callId)
      return
    }
    const suppressedTodo = todoCalls.get(callId)
    if (suppressedTodo !== undefined) {
      todoCalls.delete(callId)
      // Success stays in the panel; only a failure needs a visible card.
      if (event.isError) {
        settleLiveReasoning('tool call')
        const errorCard: ChatRow = {
          id: deps.rowIds.value,
          kind: 'tool',
          text: '',
          seq: suppressedTodo.seq,
          fresh: !replaying,
          tool: {
            callId,
            name: suppressedTodo.name,
            argsText: preview(suppressedTodo.argsJson, ARGS_PREVIEW_LIMIT),
            argsFull: suppressedTodo.argsJson,
            status: 'error',
            callView: undefined,
```

</details>

**依据 8 · 源码核查**：[src/channel/projection.ts:1582-1631](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/channel/projection.ts#L1582-L1631)

replay清ledger/fresh并fold历史。

<details>
<summary>查看原文（50行）</summary>

```text
  /**
   * Fold one batch. A `replay` batch is one complete history pass: sequence
   * numbers restart with a replacement session, so the idempotency ledgers
   * and step/attempt bindings reset before it (an old session must not
   * suppress a legitimate message in the new transcript), and it paints
   * settled history (no live toasts, no smooth reveal, no unmatched
   * compaction row).
   */
  const apply = (events: readonly AgentEvent[], meta: AgentEventMeta): void => {
    if (!meta.replay) {
      for (const event of events) applyEvent(event)
      return
    }
    handledAssistantMessages.clear()
    handledUsage.clear()
    contextUsage = undefined
    handledAssistantChunks.clear()
    openStep = undefined
    activeAttempt = undefined
    eventModel = undefined
    assistantRowsByStep.clear()
    lastTextDelta.clear()
    // Rows still on screen when a replay starts keep matching by seq, so a
    // replay over painted history reuses them instead of duplicating them.
    // Everything the replay leaves behind is settled history, so the reused
    // rows drop their live-only `fresh` claim too: a rebind/resume that
    // replays over painted rows would otherwise keep typewriting them.
    assistantRowsBySeq.clear()
    let droppedFresh = false
    for (const row of state.rows) {
      if (row.fresh === true) {
        delete row.fresh
        // Read-view snapshots reuse untouched rows from the previous
        // revision, so dropping the live claim has to move this row's dirty
        // revision with it — otherwise a panel keeps serving `fresh: true`.
        markChannelReadDirty(row)
        droppedFresh = true
      }
      if (row.kind === 'assistant') indexAssistantRow(row)
    }
    // The array itself is reused whole when its revision matches, before any
    // row is inspected; move it too or the rows above stay hidden behind the
    // previous snapshot.
    if (droppedFresh) markChannelReadDirty(state.rows)
    replaying = true
    try {
      for (const event of events) applyEvent(event)
    } finally {
      replaying = false
    }
```

</details>

**依据 9 · 源码核查**：[src/sessionMounts.ts:644-684](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/sessionMounts.ts#L644-L684)

实际lock门、严格读/占用和持久claim。

<details>
<summary>查看原文（41行）</summary>

```text
export function claimMount(sessionId: string): MountClaim {
  const attempt = acquireLock()
  if (!attempt.ok) {
    return attempt.reason === 'busy'
      ? { ok: false, reason: 'busy' }
      : { ok: false, reason: 'unavailable', detail: attempt.detail }
  }
  const lock = attempt.lock
  try {
    // Lost the lock (reclaimed by a peer): the file on disk is no longer the one
    // this claim was derived from, so refuse rather than write a stale merge.
    if (!lockIsHeld(lock)) return { ok: false, reason: 'busy' }
    const read = readMountLedgerStrict()
    if (!read.ok) {
      return read.damaged === true
        ? { ok: false, reason: 'unavailable', detail: read.detail, damaged: true }
        : { ok: false, reason: 'unavailable', detail: read.detail }
    }
    const holders: number[] = []
    for (const owner of read.owners) {
      if (ownerIsSelf(owner) || !pidAlive(owner.pid)) continue
      if (owner.sessionIds.includes(sessionId)) holders.push(owner.pid)
    }
    if (holders.length > 0) return { ok: false, reason: 'occupied', holders }
    // Whether THIS claim is what publishes the session: a session already in
    // our set may have been put there by a parked handle or a publisher beat,
    // and a caller that later gives its reservation back must not take it away.
    const fresh = !ownSessionIds.has(sessionId)
    ownSessionIds.add(sessionId)
    if (ownStartedAt === undefined) ownStartedAt = Date.now()
    const written = writeLedger(ownRecord())
    if (!written.ok) {
      // The claim was not persisted, so it must not be held in memory either:
      // the process must not believe it owns what the ledger does not record.
      ownSessionIds.delete(sessionId)
      return written
    }
    return { ok: true, fresh }
  } finally {
    releaseLock(lock)
  }
```

</details>

**依据 10 · 源码核查**：[src/sessionMounts.ts:811-834](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/sessionMounts.ts#L811-L834)

实际reserve/settle/abandon只释放fresh。

<details>
<summary>查看原文（24行）</summary>

```text
export async function reserveMount(sessionId: string): Promise<MountReservationResult> {
  const claim = await claimMountWithRetry(sessionId)
  if (!claim.ok) return claim
  const releaseOperation = holdMountOperation(sessionId)
  let settled = false
  return {
    ok: true,
    reservation: {
      settle: () => {
        if (settled) return
        settled = true
        releaseOperation()
      },
      abandon: () => {
        if (settled) return
        settled = true
        releaseOperation()
        // Only give back what this reservation took. A claim that inherited the
        // session (already ours) must not release it: this process was driving
        // that log before the attempt and still is.
        if (claim.fresh) releaseMount(sessionId)
      },
    },
  }
```

</details>

**依据 11 · 源码核查**：[src/sessionMounts.ts:14-25](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/sessionMounts.ts#L14-L25)

作者指出pid复用偏拒与同机/Host锁边界。

<details>
<summary>查看原文（12行）</summary>

```text
 * Liveness starts with `process.kill(pid, 0)`: it catches a clean exit and
 * a `kill -9`. On Linux, a surviving id must not be a non-leader thread: a TUI
 * publishes its process id (TGID), but kill also accepts a recycled thread id.
 * There is no heartbeat timestamp, because a timestamp only stays
 * truthful while a timer keeps refreshing it, and the process that cannot
 * refresh it is exactly the one whose record should expire. The cost is pid
 * REUSE — a recycled process id can keep a dead owner's record alive — which
 * errs toward refusing a session that is in fact free until that process exits;
 * the opposite
 * error interleaves two writers into one transcript. This is a same-machine
 * guard only: the host's own session write lock stays the authority that
 * actually separates writers.
```

</details>

#### 缺口

- 缺重连/重复/迟到history、旧Host与双进程故障运行对照。
  **影响**：不能承诺完整恢复、无错序/漏行或跨进程排他可靠性。
  **进一步探讨**：同一durable事件序列注入重复/reset/迟到/切session，比较最终稳定行；另隔离home双进程核ledger坏/忙/pid边界。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 审批来源标记与安全 profile 是否构成权限隔离？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

DSH approval服务存在且当前不是backendStart时才挂approval/request→approvalStore.park，异常才next；DSH重组另安装。实际listener没有旧注释所称前台agentId过滤，store明确接本进程前台与后台ask，Chat把非当前agent标background。这提供后台交互，不等于只批准屏幕当前Agent，更不是不同账户隔离。非DSH后端用自身权限面板，不能外推Host approval行为。

park以callId在req.agent.session找最新tool/call，并检查之后有无同callId tool/result；缺锚、重复in-flight或已消费callId标external，重复会把同ID请求都标模糊。它检查session事件关系，不验证发起插件、toolName/参数与真实执行的密码学来源；同进程插件可dispatch waterfall，标记是给用户辨别而不是拒绝所有external。真正权限执行仍由Host approval/tool策略负责，本轮未审Host全策略。

UI ApprovalPanel把option/key交Chat→store.decide，key提供且不同才拒陈旧按键；普通UI都带key，但并非所有直接调用缺key都会拒。store只解析allowed-once，其余映射rejected，不提供DSH allow-always。真实AbortSignal撤请求并resolve cancelled，伪dispatch abort而signal.aborted仍false只标external不让它替换genuine panel；销毁settleAll取消。以上是实际UI→Promise回执，不证明远端工具从未先有副作用，也不能把来源badge当可信证明。

救援启动器确有门：home cordis.patch存在、救援manifest不可识别/不洁/已有patch就拒，实际dsh plugin --profile dsh-tui-safe add钉本包版本，安装非零或包仍不可读清理半成品。救援仍共享DSH_HOME及profiles/node_modules回退链接，rescueEnv只删三个resume/workspace变量，PATH/home/凭据照继承；正常bin也spawn本机Node并继承env。它是排障组合方式，不是OS沙箱、独立凭据域或对已有数据的撤销。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-adapter/plugin.ts:2217-2235](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/plugin.ts#L2217-L2235)

真实approval注册条件/listener无前台ID过滤及销毁。

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

**依据 2 · 源码核查**：[src/dsh-adapter/approvals.ts:433-469](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/approvals.ts#L433-L469)

接前后台ask、锚/重复/消费external标记。

<details>
<summary>查看原文（37行）</summary>

```text
  /**
   * Answerer entry point — called by the `approval/request` waterfall
   * listener for every ask in this process: the attached session's and any
   * background session's alike, so an unattended session surfaces as
   * "needs input" instead of failing closed with nobody to answer it.
   * @param req - The approval request (agent, tool, callId, reason, signal).
   * @returns A promise settling with the user's decision, or `'cancelled'`
   *   when the ask is withdrawn or the plugin tears down.
   */
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

**依据 3 · 源码核查**：[src/dsh-adapter/approvals.ts:180-198](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/approvals.ts#L180-L198)

实际callId/最新call及result检查。

<details>
<summary>查看原文（19行）</summary>

```text
function isLiveToolApproval(req: ApprovalRequest): boolean {
  if (req.callId === undefined) return false
  const events = snapshotLiveSessionEvents(req.agent.session)
  let callIndex = -1
  for (let i = events.length - 1; i >= 0; i -= 1) {
    const event: SessionEvent = events[i]!
    if (event.type !== 'tool/call') continue
    if (String(event.data.callId) !== String(req.callId)) continue
    callIndex = i
    break
  }
  if (callIndex === -1) return false
  for (let i = callIndex + 1; i < events.length; i += 1) {
    const event: SessionEvent = events[i]!
    if (event.type !== 'tool/result') continue
    const resultCallId = (event.data.message as { source?: { callId?: unknown } } | undefined)?.source?.callId
    if (String(resultCallId) === String(req.callId)) return false
  }
  return true
```

</details>

**依据 4 · 源码核查**：[src/dsh-adapter/approvals.ts:478-499](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/approvals.ts#L478-L499)

真实与伪abort的处理/排队。

<details>
<summary>查看原文（22行）</summary>

```text
          if (req.signal !== undefined && !req.signal.aborted) {
            pending.snapshot.external = true
            this.rebuildSnapshot()
            this.scheduleNotify()
            return
          }
          if (this.active === pending) {
            this.active = undefined
            this.rebuildSnapshot()
            pending.resolve('cancelled')
            this.startNext()
            return
          }
          const at = this.queue.indexOf(pending)
          if (at >= 0) this.queue.splice(at, 1)
          pending.resolve('cancelled')
        },
      }
      req.signal?.addEventListener('abort', pending.onAbort, { once: true })
      this.queue.push(pending)
      this.startNext()
    })
```

</details>

**依据 5 · 源码核查**：[src/components/approvals/ApprovalPanel.tsx:172-186](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/components/approvals/ApprovalPanel.tsx#L172-L186)

UI决定传option/key与拒绝。

<details>
<summary>查看原文（15行）</summary>

```text
  const decide = (index: number, withFeedback: boolean): void => {
    const option = options[index]
    if (option === undefined) return
    const text = withFeedback && option.kind === 'reject' ? feedbackRef.current.trim() : ''
    onDecide(panelOutcomeOf(option.kind), {
      optionId: option.id,
      kind: option.kind,
      key: approval.key,
      ...(text === '' ? {} : { feedback: text }),
    })
  }
  /** Esc / Ctrl+C: the plain rejection (a typed reason is not sent). */
  const reject = (): void => {
    if (rejectIndex >= 0) decide(rejectIndex, false)
    else onDecide('rejected', { optionId: 'reject', kind: 'reject', key: approval.key })
```

</details>

**依据 6 · 源码核查**：[src/screens/Chat.tsx:6011-6017](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/screens/Chat.tsx#L6011-L6017)

背景badge与真实store.decide回接。

```text
  const approvalPanelNode = approvalSnapshot !== null ? (
    <ApprovalPanel
      key={approvalSnapshot.key}
      approval={approvalSnapshot}
      background={approvalSnapshot.agentId !== channel.agentId}
      onDecide={(outcome, decision) => approvals.decide(outcome, decision)}
    />
```

**依据 7 · 源码核查**：[src/dsh-adapter/approvals.ts:524-552](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/approvals.ts#L524-L552)

可选key检查/allowed-once或reject/teardown cancelled。

<details>
<summary>查看原文（29行）</summary>

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
    this.emit()
  }

  /**
   * Settle the active and all queued asks (plugin teardown). The panel
   * unmounts as the snapshot clears.
   * @param outcome - The outcome every pending ask resolves with.
   */
  settleAll(outcome: ApprovalOutcome): void {
    const active = this.active
    this.active = undefined
    if (active !== undefined) this.noteConsumed(active)
    this.rebuildSnapshot()
    active?.resolve(outcome)
    for (const pending of this.queue.splice(0)) {
      this.noteConsumed(pending)
      pending.resolve(outcome)
    }
    this.emit()
```

</details>

**依据 8 · 源码核查**：[bin/dsh-tui.js:99-107](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/bin/dsh-tui.js#L99-L107)

救援同home回退模块边界。

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

**依据 9 · 源码核查**：[bin/dsh-tui.js:912-922](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/bin/dsh-tui.js#L912-L922)

只删三个控制变量、保留凭据环境。

<details>
<summary>查看原文（11行）</summary>

```text
// 救援子进程的环境：显式构造，而不是把宿主 process.env 原样交给它。救援的
// 语义是「干净冷启动」，而启动器自己写进 process.env 的会话控制变量会把刚
// 崩掉的主 profile 的会话 id / 工作区目标带进救援——救援 profile 里并不存在
// 那个会话，dsh 会在恢复时再报一次错，正好污染最该干净的通道。其余宿主变量
// （PATH / DSH_HOME / 凭据…）是救援能工作的前提，照常继承。
// home 层补丁不在此列：它由 createRescueProfile 的干净性门禁单独把关。
const RESCUE_DROPPED_ENV = ['DSH_TUI_RESUME_SESSION', 'DSH_TUI_RESUME_BACKEND', 'DSH_TUI_WORKSPACE_TARGET']
const rescueEnv = () => {
  const env = { ...process.env }
  for (const key of RESCUE_DROPPED_ENV) delete env[key]
  return env
```

</details>

**依据 10 · 源码核查**：[bin/dsh-tui.js:1291-1298](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/bin/dsh-tui.js#L1291-L1298)

真实homepatch/manifest不洁拒绝。

```text
const createRescueProfile = () => {
  if (existsSync(homePatchFile)) return { kind: 'failed', lines: [msg('safeRescueHomePatch')(homePatchFile)] }
  const state = rescueProfileState()
  if (state.state === 'unrecognized') return { kind: 'failed', lines: [msg('safeRescueUnrecognized')(rescueProfileDir)] }
  if (state.state === 'unclean') {
    return { kind: 'failed', lines: [msg('safeRescueUnclean')(rescueProfileDir, state.extras.join(', '))] }
  }
  if (state.state === 'patched') return { kind: 'failed', lines: [msg('safeRescuePatched')(rescuePatchFile)] }
```

**依据 11 · 源码核查**：[bin/dsh-tui.js:1314-1338](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/bin/dsh-tui.js#L1314-L1338)

实际安装调用/失败与no-op清理。

<details>
<summary>查看原文（25行）</summary>

```text
  const probe = spawnSync(...cmd('dsh', ['--version']), { stdio: 'pipe', ...shellOpt })
  if (probe.error || probe.status !== 0) return { kind: 'failed', lines: [msg('safeRescueFailed')('dsh missing')] }
  console.log(msg('safeRescueCreating'))
  const runAdd = extraArgs => spawnSync(
    ...cmd('dsh', ['plugin', '--profile', RESCUE_PROFILE, 'add', ...extraArgs, `${PACKAGE}@${installVersion}`]),
    { stdio: ['inherit', 'pipe', 'pipe'], env: rescueEnv(), ...shellOpt },
  )
  let add = runAdd([])
  if (add.status !== 0) {
    const captured = `${add.stdout ?? ''}${add.stderr ?? ''}`
    process.stderr.write(captured)
    if (captured.includes('ERR_PNPM_ADDING_TO_ROOT')) add = runAdd(['-w'])
  }
  if (add.status !== 0) return { kind: 'failed', lines: [msg('safeRescueFailed')(`exit ${add.status ?? 1}`)] }
  if (readJson(rescueInstalledPkg) === undefined) {
    // no-op 假成功：add 报成功但插件包仍不可读，pnpm 之后每次都「成功」而
    // 启动照旧失败——半成品会永久锁死选项 5。此时目录是本函数刚刚建出来的
    // （或刚通过 rescueDirStrays 检查后重建的），清掉并给出路径，让下一次
    // 尝试真的从零开始（bootstrapUnreadable 的同款处置）。
    const failed = removeRescueDir()
    const lines = [msg('safeRescueFailed')('no-op install')]
    lines.push(failed === undefined ? msg('safeRescueCleanup')(rescueProfileDir) : msg('safeRescueRemoveFailed')(rescueProfileDir, failed.message))
    return { kind: 'failed', lines }
  }
  return { kind: 'created' }
```

</details>

**依据 12 · 源码核查**：[bin/dsh-tui.js:901-908](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/bin/dsh-tui.js#L901-L908)

正常入口spawn及继承环境。

```text
// 本包自己的入口：`node <入口> <应用参数>`。结果模型与 startDshSession 相同。
const startEntrySession = (entry, appArgs, env = process.env) =>
  new Promise(resolve => {
    const child = spawn(process.execPath, [entry, ...appArgs], { stdio: 'inherit', env: withCompileCache(env) })
    child.on('error', err => resolve({ kind: 'error', error: err }))
    child.on('exit', (code, signal) => {
      if (signal) resolve({ kind: 'signal', signal })
      else resolve({ kind: 'exit', code: code ?? 0 })
```

#### 缺口

- 未做Host/第三方插件对抗、真实审批及救援安装/回退实验。
  **影响**：不能保证来源不可伪造、所有工具都走面板或救援无共享影响。
  **进一步探讨**：独立home低权限Host核后台ask/重复callId/陈旧key/真取消与safe路径，审Host策略后再开真实工具。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 试用与退出怎样控制版本、数据和资源负担？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断

#### 完整回答

首次要固定0.19.0、Node ^22.19 或 >=24和实际DSH版本/profile及TTY；primary合同0.2.2-rc.1不代表所有peer范围本轮运行通过。已有CLI/Web可保留，先备份/另建完整home和虚构低敏会话，不把safe profile替代独立home；其他后端/OAuth配置另核。启动器可能安装profile、写compile-cache/last-run/resume与共享模块回退，不能按README“卸载无patch”解释为所有home状态从未改变。

持续现金/资源包括后端模型/工具用量、终端渲染、连接/缓存和日志磁盘，人工包括版本/快捷键、核审批背景Agent/来源、恢复/多进程占用；金额和人时未知。界面token/TPS/cost estimate依赖后端事件/价格规则，本文仅核usage按seq去重及迟到真实token替换估计，不审完整计费器，也不拿显示数字当provider账单或已测经济收益。偏好/后台更新检查和终端能力也有维护负担，未全审所有网络请求。

遇输入误归属、history缺/错序、审批来源不明或Host不兼容，停止该次提交并回原CLI/Web核持久日志，不盲重送同一写任务。user cancel会保留inbox，要明确剩余输入；要重送先看interrupt回执。退出先存草稿/会话ID、核后台Agent及工具/已写文件，再正常关应用；5秒fallback或强杀不保证清理完成，救援继续使用前先确认同home/凭据影响。恢复显示不是回滚，删除历史/远端动作也不在本代表链保证内。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-19](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/package.json#L1-L19)

包与许可/版本。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "@deepseek-harness-tui/dsh-tui",
  "version": "0.19.0",
  "description": "Interactive terminal interface for DeepSeek Harness agents, sessions and tools.",
  "keywords": [
    "dsh",
    "dsh-tui",
    "dsh-plugin",
    "deepseek",
    "deepseek-harness",
    "cordis",
    "tui",
    "terminal",
    "cli",
    "ink",
    "agent",
    "coding-agent"
  ],
  "license": "MIT",
```

</details>

**依据 2 · 源码核查**：[package.json:131-132](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/package.json#L131-L132)

Node范围。

```text
  "engines": {
    "node": "^22.19 || >=24"
```

**依据 3 · 源码核查**：[src/dsh-adapter/contract.ts:21-22](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/contract.ts#L21-L22)

primary Host线。

```text
/** Primary validated upstream line (newest). */
export const UPSTREAM_VALIDATED_VERSION = '0.2.2-rc.1'
```

**依据 4 · 源码核查**：[bin/dsh-tui.js:890-908](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/bin/dsh-tui.js#L890-L908)

compile cache创建与实际入口子进程。

<details>
<summary>查看原文（19行）</summary>

```text
const withCompileCache = env => {
  if (env.NODE_COMPILE_CACHE !== undefined) return env
  const cacheDir = join(homedir(), '.dsh-tui', 'compile-cache')
  try {
    mkdirSync(cacheDir, { recursive: true, mode: 0o700 })
  } catch {
    return env
  }
  return { ...env, NODE_COMPILE_CACHE: cacheDir }
}

// 本包自己的入口：`node <入口> <应用参数>`。结果模型与 startDshSession 相同。
const startEntrySession = (entry, appArgs, env = process.env) =>
  new Promise(resolve => {
    const child = spawn(process.execPath, [entry, ...appArgs], { stdio: 'inherit', env: withCompileCache(env) })
    child.on('error', err => resolve({ kind: 'error', error: err }))
    child.on('exit', (code, signal) => {
      if (signal) resolve({ kind: 'signal', signal })
      else resolve({ kind: 'exit', code: code ?? 0 })
```

</details>

**依据 5 · 源码核查**：[bin/dsh-tui.js:919-939](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/bin/dsh-tui.js#L919-L939)

继承env与last-run状态读取。

<details>
<summary>查看原文（21行）</summary>

```text
const rescueEnv = () => {
  const env = { ...process.env }
  for (const key of RESCUE_DROPPED_ENV) delete env[key]
  return env
}

// ─── 最后运行记录 ────────────────────────────────────────────────────────────
// TUI 把 {backendId,sessionId,cwd,attemptId} 写进 ~/.dsh-tui/last-run.json
// （boot 写一次，退出时刷新，见 src/update.ts 的 writeLastRunRecord）。
// 内核切换后本进程的 env 仍是原内核，安全模式重试若按 env 去读 resume.txt
// 或其他后端偏好，会回到原内核，甚至拿 DSH 的会话 id 跨后端恢复；所以
// 本次启动之后写下的记录优先。
const readLastRunRecord = () => {
  try {
    const parsed = JSON.parse(readFileSync(join(homedir(), '.dsh-tui', 'last-run.json'), 'utf8'))
    if (parsed === null || typeof parsed !== 'object') return undefined
    if (!isBackendIdSyntax(parsed.backendId)) return undefined
    if (typeof parsed.sessionId !== 'string' || typeof parsed.cwd !== 'string' || typeof parsed.attemptId !== 'string') return undefined
    if (typeof parsed.updatedAt !== 'number' || !Number.isFinite(parsed.updatedAt)) return undefined
    return parsed
  } catch {
```

</details>

**依据 6 · 源码核查**：[src/dsh-adapter/plugin.ts:1275-1294](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/plugin.ts#L1275-L1294)

实际计算resumable、调用writeLastRunRecord及首次刷新。

```text
  const refreshLastRunRecord = (): void => {
    // An observational composition (replay/embedding) is not "the instance the
    // user ran last" — it must not overwrite the interactive record.
    if (adapterRuntime.mode === 'passive-shadow' || adapterRuntime.mode === 'replay-shadow') return
    const resumable = backendStart !== undefined
      ? backendStart.persisted(channel.agentId, channel.rows)
      : isExitResumable({
        pendingCount: channel.pending.length,
        liveAgent: liveDshAgent(),
        startupAgent: agent,
      })
    writeLastRunRecord({
      backendId: backendChoice,
      sessionId: resumable ? channel.agentId : '',
      cwd: sessionCwd,
      attemptId: bootAttemptId,
      pid: process.pid,
    })
  }
  refreshLastRunRecord()
```

**依据 7 · 源码核查**：[src/channel/projection.ts:1266-1299](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/channel/projection.ts#L1266-L1299)

usage去重、迟到真实token替换估计。

<details>
<summary>查看原文（34行）</summary>

```text
      case 'usage':
        if (handledUsage.has(event.seq)) return
        handledUsage.add(event.seq)
        bookUsage(event.usage, event)
        // A late real report (Codex meters after the reply settles) names the
        // step it describes: replace that step's estimate in the turn fold so
        // the live tps and the turn-end sample read real tokens, not a guess.
        // The same swap also serves the LAST ended turn (a straggler after
        // turn.end corrects the readout and the pushed sample in place).
        const real = usageOutputTokens(event.usage)
        const swap = (steps: { step: number; tokens: number; estimated: boolean }[], decodeMs: number): number | undefined => {
          const target = steps.find(step => step.step === event.step && step.estimated)
          if (target === undefined || real === undefined) return undefined
          target.tokens = real
          target.estimated = false
          return steps.reduce((sum, step) => sum + step.tokens, 0)
        }
        if (real !== undefined && tpsTurn === event.turn) {
          const total = swap(tpsTurnSteps, tpsTurnDecodeMs)
          if (total !== undefined) {
            tpsTurnDecodeTokens = total
            tpsTurnSampled = true
            if (tpsTurnDecodeMs > 0) state.tps = total / (tpsTurnDecodeMs / 1000)
          }
        } else if (real !== undefined && tpsClosedTurn?.turn === event.turn) {
          const total = swap(tpsClosedTurn.steps, tpsClosedTurn.decodeMs)
          if (total !== undefined && tpsClosedTurn.decodeMs > 0) {
            state.tps = total / (tpsClosedTurn.decodeMs / 1000)
            if (tpsClosedTurn.sample === undefined) {
              tpsClosedTurn.sample = { tps: state.tps, at: tpsClosedTurn.endAt }
              state.tpsSamples.push(tpsClosedTurn.sample)
              if (state.tpsSamples.length > 500) state.tpsSamples.shift()
            } else {
              tpsClosedTurn.sample.tps = state.tps
```

</details>

**依据 8 · 源码核查**：[src/dsh-adapter/backend/session.ts:349-364](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/backend/session.ts#L349-L364)

cancel保inbox/借用handle。

<details>
<summary>查看原文（16行）</summary>

```text
    cancel(cause: CancelCause) {
      // `user` keeps the queue, so queued/steered inputs run as the next turn.
      // Every other cause drops it: after `interrupt` the channel parks those
      // inputs in a dock and re-delivers nothing until the user sends it, and
      // a switch/dispose never resumes the old queue. keepInbox is only for
      // the user-cancel and normal turn-end paths.
      if (cause === 'user') agent.cancel({ kind: 'user' }, { keepInbox: true })
      else dropOwn(() => agent.cancel({ kind: 'user' }))
      // The kernel cancel settles its bookkeeping synchronously: the answer
      // is definitive either way (kept ids for a 'user' cancel, an emptied
      // queue otherwise).
      return Promise.resolve({ stillQueued: cause === 'user' ? [...pending.keys()] : [], outcome: 'confirmed' })
    },

    dispose(): Promise<void> {
      return handle === undefined ? Promise.resolve() : handle.dispose()
```

</details>

**依据 9 · 源码核查**：[src/dsh-adapter/plugin.ts:3922-3945](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/plugin.ts#L3922-L3945)

退出有界fallback不是全部清理成功证明。

<details>
<summary>查看原文（24行）</summary>

```text
function disposeRootAndThen(ctx: Context, done: () => void, fallback: number | (() => void) = 1): void {
  const startedAt = Date.now()
  const timer = setTimeout(() => {
    // Diagnosis for a stalled disposal: without this line the fallback exit
    // is indistinguishable from a successful handoff in the field.
    logRestartEvent('dispose: timeout, taking fallback exit', typeof fallback === 'number' ? { fallbackCode: fallback } : { fallback: 'signal' })
    if (typeof fallback === 'number') process.exit(fallback)
    else fallback()
  }, 5000)
  timer.unref()
  // A composition still running into this root settles first.
  // The pooled, process-wide resources of every backend this process actually
  // loaded are closed here — after the fiber, never before (P0 D4-P2/P3).
  void disposeRootSettled(ctx, () => withHostRootCapability(() => ctx.root.fiber.dispose())).finally(() => unloadBackends()).then(
    () => {
      clearTimeout(timer)
      // The teardown's length, to restart.log only (never the terminal).
      logRestartEvent('dispose: root disposed', { ms: Date.now() - startedAt })
      done()
    },
    () => {
      clearTimeout(timer)
      done()
    },
```

</details>

#### 缺口

- 未测安装/迁移/终端、模型账单、人时和完整退出/恢复效果。
  **影响**：不能保证节时/准确计费/无残留，适合有限偏好试用。
  **进一步探讨**：同任务固定终端宽度/版本，记录输入/审批/稳定行与provider费用，测退出后残留和恢复分钟再对CLI/Web。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现有投影贡献与恢复一致性方向如何独立验证？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

实际贡献是终端组合入口、后端中立AgentSession/投影和DSH适配输入、审批、恢复接缝；seq/callId/generation与队列回执有明确局部正确性措施。DSH的模型、工具/存储权限仍来自Host，Claude/Codex及renderer依赖也不计作本项全新执行内核；终端便利没有自动改变组织责任、既有交付对象或经济模式。

可验证方向不是再做一份history renderer，而是对同一durable记录给最终稳定行一致性的可复核诊断：live与replay刻意不同的toast/中间帧应排除，需比持久用户/assistant/tool身份、顺序、结果和队列状态。当前共享projector及迟到fallback/seq去重只是机制依据，不是完成一致性验收的证据。

在隔离Host固定事件，覆盖重复/乱序、live reset、history晚到、切会话后旧callback、审批取消和interrupt未知回执，并对照现有debug日志+人工核JSONL。若差异仅是明确live-only表现或现有日志已够，新增产品诊断不成立；若漏持久行、误归属、双送或诊断假称相等，则推翻。没有运行实验/用户误判数据，不将候选计已有可靠性或收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-adapter/channel/input-delivery.ts:147-161](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/input-delivery.ts#L147-L161)

session/generation真实输入门。

<details>
<summary>查看原文（15行）</summary>

```text
  /** Stale fence: the submission belongs to the session it was typed in (the
   *  bound session object plus the binding generation every adoption
   *  advances; works for any backend, no DSH agent needed). */
  const current = (origin: UserTextOrigin): boolean =>
    owner.current() && binding.session === origin.session && state().agentBindingGeneration === origin.generation

  /** D-6: bind the submission to the session it was typed in AT ENQUEUE
   *  TIME. The FIFO chain may park this task behind a slow predecessor
   *  while the user /new's away — capturing the agent at run time would
   *  adopt the NEW session as this text's origin and deliver the old
   *  conversation's words into it. */
  const captureOrigin = (): UserTextOrigin => {
    const local = localImages?.()
    return {
    session: binding.session,
```

</details>

**依据 2 · 源码核查**：[src/dsh-adapter/channel/core/binding-feed.ts:353-388](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/core/binding-feed.ts#L353-L388)

现有replay/fallback取舍。

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

**依据 3 · 源码核查**：[src/channel/projection.ts:599-625](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/channel/projection.ts#L599-L625)

已有seq稳定消息折叠。

<details>
<summary>查看原文（27行）</summary>

```text
  const applyAssistantMessage = (event: AgentEventOf<'assistant.message'>): void => {
    if (handledAssistantMessages.has(event.seq)) return
    handledAssistantMessages.add(event.seq)
    // A canonical settlement embeds its complete attempt; older settlements
    // may omit reasoning that is still durably recorded in legacy deltas.
    const canonical = event.canonical
    const text = textOfBlocks(event.blocks)
    const images = event.images ?? NO_IMAGES
    const reasoningText = event.blocks
      .map(block => (block.type === 'reasoning' ? block.text : ''))
      .join('')
    // A backend's own message anchor beyond the seq (DSH anchors are the
    // seq, so DSH rows carry none) is how "load earlier" finds the durable
    // message a folded row came from.
    const anchor = event.anchor === '' || event.anchor === String(event.seq) ? undefined : event.anchor
    const settledReasoning = lastReasoningRow !== undefined && lastReasoningRow.turn === event.turn && lastReasoningRow.step === event.step
      ? lastReasoningRow.row : reasoning
    if (settledReasoning !== undefined) {
      if (reasoningText === '') {
        // A count-only thinking row (no text was ever recorded) settles as
        // its one-line summary instead of vanishing with the empty block.
        if (canonical && settledReasoning.reasoningTokens === undefined) removeRow(settledReasoning)
        else if (anchor !== undefined && settledReasoning.anchor === undefined) settledReasoning.anchor = anchor
      } else {
        settledReasoning.text = reasoningText
        settledReasoning.seq ??= event.seq
        if (anchor !== undefined) settledReasoning.anchor ??= anchor
```

</details>

**依据 4 · 源码核查**：[src/channel/projection.ts:1582-1631](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/channel/projection.ts#L1582-L1631)

已有replay清ledger与live-only区分。

<details>
<summary>查看原文（50行）</summary>

```text
  /**
   * Fold one batch. A `replay` batch is one complete history pass: sequence
   * numbers restart with a replacement session, so the idempotency ledgers
   * and step/attempt bindings reset before it (an old session must not
   * suppress a legitimate message in the new transcript), and it paints
   * settled history (no live toasts, no smooth reveal, no unmatched
   * compaction row).
   */
  const apply = (events: readonly AgentEvent[], meta: AgentEventMeta): void => {
    if (!meta.replay) {
      for (const event of events) applyEvent(event)
      return
    }
    handledAssistantMessages.clear()
    handledUsage.clear()
    contextUsage = undefined
    handledAssistantChunks.clear()
    openStep = undefined
    activeAttempt = undefined
    eventModel = undefined
    assistantRowsByStep.clear()
    lastTextDelta.clear()
    // Rows still on screen when a replay starts keep matching by seq, so a
    // replay over painted history reuses them instead of duplicating them.
    // Everything the replay leaves behind is settled history, so the reused
    // rows drop their live-only `fresh` claim too: a rebind/resume that
    // replays over painted rows would otherwise keep typewriting them.
    assistantRowsBySeq.clear()
    let droppedFresh = false
    for (const row of state.rows) {
      if (row.fresh === true) {
        delete row.fresh
        // Read-view snapshots reuse untouched rows from the previous
        // revision, so dropping the live claim has to move this row's dirty
        // revision with it — otherwise a panel keeps serving `fresh: true`.
        markChannelReadDirty(row)
        droppedFresh = true
      }
      if (row.kind === 'assistant') indexAssistantRow(row)
    }
    // The array itself is reused whole when its revision matches, before any
    // row is inspected; move it too or the rows above stay hidden behind the
    // previous snapshot.
    if (droppedFresh) markChannelReadDirty(state.rows)
    replaying = true
    try {
      for (const event of events) applyEvent(event)
    } finally {
      replaying = false
    }
```

</details>

**依据 5 · 源码核查**：[src/dsh-adapter/channel/input-actions.ts:202-257](https://github.com/ccch1mneyyy/dsh-TUI/blob/224f847d02c2157f43862d2792cf9d7459222f4c/src/dsh-adapter/channel/input-actions.ts#L202-L257)

已有回执与队列防双送，不冒充候选发明。

<details>
<summary>查看原文（56行）</summary>

```text
      const settle = (outcome: CancelOutcome, stillQueued: readonly string[]): void => {
        if (settled) return
        settled = true
        // A newer request owns the bookkeeping once it replaced ours.
        if (input.uncoveredDockIds === uncovered) {
          input.uncoveredDockIds = undefined
          input.interruptReceiptPending = false
        }
        if (input.provisionalDockIds === provisional) input.provisionalDockIds = undefined
        // The channel moved to another session: its dock and its queue are
        // not the ones this receipt speaks about.
        if (getSession() !== session) return
        // The session ended meanwhile: its end held every row and their
        // backend copies went with it, so this answer neither un-docks them
        // nor reports a queue that will still run.
        if (session.status === 'disposed') return
        // Every docked row this receipt cannot confirm dropped: the ids the
        // backend says it kept, plus every row docked after the request
        // fired (outside its snapshot). Those copies are still live: their
        // previews go back to the normal claim/discard retirement and the
        // dock never offers a second send on top of them. Only a confirmed
        // answer graduates the provisional rows; any other verdict un-docks
        // them too, so nothing keeps edit/re-send rights a late revocation
        // could no longer reach.
        const revoke = new Set([...stillQueued, ...uncovered])
        if (outcome !== 'confirmed') for (const id of provisional) revoke.add(id)
        // A newer request that carried our rows over holds them no longer
        // than this answer needs.
        const held = input.provisionalDockIds
        if (outcome === 'confirmed' && held !== undefined && held !== provisional) {
          for (const id of provisional) {
            const index = held.indexOf(id)
            if (index !== -1 && !revoke.has(id)) held.splice(index, 1)
          }
        }
        if (revoke.size > 0) {
          let undocked = false
          state.pending = state.pending.map(item => {
            if (item.docked !== true || !revoke.has(item.id)) return item
            undocked = true
            return { ...item, docked: undefined }
          })
          if (undocked) state.emit()
        }
        // The unconfirmed legs are loud: a failed or answerless interrupt
        // must not leave a success-shaped dock (or a silently failed Esc).
        const notice = outcome === 'failed' ? t('interrupt-failed')
          : revoke.size === 0 ? undefined
          : t('interrupt-unconfirmed')
        if (notice !== undefined) state.notify(notice, { color: 'warning', timeoutMs: 6000 })
      }
      void session.cancel('interrupt')
        .then(receipt => { settle(receipt.outcome, receipt.stillQueued) })
        // A backend that breaks the receipt contract by throwing gets the
        // same revocation; the catch must not keep the dock.
        .catch(() => { settle('failed', dockedNow) })
```

</details>

#### 缺口

- 没有事件矩阵运行、用户误判或诊断原型与替代对照。
  **影响**：不能证明恢复一致或新增诊断值得维护。
  **进一步探讨**：先用同durable日志比最终稳定行和队列；若无真实差异/现有日志足够或诊断假阳性就不做。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
