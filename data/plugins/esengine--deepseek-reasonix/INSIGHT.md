# Reasonix

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8a1fda4](https://github.com/esengine/DeepSeek-Reasonix/tree/8a1fda41a7fd62654fc8113391f620c57c3ad51d)

<!-- BEGIN META -->
[![GitHub ★ 35,992](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C992&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/esengine/DeepSeek-Reasonix)
<!-- END META -->

> **功能**：独立开源编码 Agent，提供终端、Studio、浏览器和 ACP 入口，读取代码、修改文件并执行命令与测试。

> **亮点**：真实编码工具闭环、干净采样提交、权限/结果证据与条件性恢复接线；多前端和ACP方便整合，未证明新模型算法或净节时。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：普通权限卡不覆盖ACP显式shell输入，远端文本不能因标User就当人类授权；非正轮数不设cap、费用检查有条件，rewind不撤shell/外部动作。所核Host源码与bundle pin亦不同，非默认部署漏洞实证。见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 根项目与DSH集成各是什么，贡献在哪里？](#detail-section-11)
  - [Q02 · 模型如何连续执行工具，何时停止，预算能证明什么？](#detail-section-12)
  - [Q03 · 权限、ACP输入来源、取消和恢复有哪些边界？](#detail-section-13)
  - [Q04 · 依赖、发行、数据与实际使用流程怎样限定？](#detail-section-14)
  - [Q05 · 谁值得付出全周期成本，如何试用和退出？](#detail-section-15)
  - [Q06 · 哪个生产方向有相对现机制的新量，如何推翻？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为能审代码的开发者执行仓库阅读、可逆修改和验证，根组件是独立编码工具而非DSH插件。见[Q01](#research-q01)。

参照聊天建议加手工、现有编码Agent及人工直接Reasonix；多前端/ACP是接线增量，模型/OS能力继承，同条件收益未测。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自主编码 | 模型选择工具、结果回流后继续 | 成果/测试仍需验，费用/轮数按有效配置 |
| 多前端/ACP | 复用同内核及宿主委派 | 根非DSH插件，精确版本与输入来源另核 |
| 权限/交付证据 | 主体规则、卡片及缺项暂停 | 显式shell另路，不将标User当人授权 |
| 预览恢复 | 编辑工具文件/会话回退入口 | 版本/并发冲突可拒绝，不撤shell和远端动作 |

**流程与依赖**

根工具发行线、Go源构建/模型/账户与外部OS隔离；DSH另需精确同版provider、command/home及来源策略。完整表见[Q04](#research-q04)。

先选正确发行/账户和隔离副本，人工普通任务只读→单写验成果→取消/恢复核真实状态；自动ACP另验来源与版本。步骤见[Q04](#research-q04)。

**效果与成本**

模型/重试/命令及审批、配置、恢复成本未知；轮数/三轴预算不等所有费用硬封顶，根工具人工小样外部隔离增加负担。表见[Q05](#research-q05)。

源码证明自主执行、部分权限/预算/恢复与缺项终态；合格率、净人工、全入口授权和同版自动委派未验。表见[Q05](#research-q05)。

> **思考**：普通权限卡不覆盖ACP显式shell输入，远端文本不能因标User就当人类授权；非正轮数不设cap、费用检查有条件，rewind不撤shell/外部动作。所核Host源码与bundle pin亦不同，非默认部署漏洞实证。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：真实编码工具闭环、干净采样提交、权限/结果证据与条件性恢复接线；多前端和ACP方便整合，未证明新模型算法或净节时。见[Q01](#research-q01)、[Q02](#research-q02)。

干净采样才执行、结果配对、主体授权、readiness和恢复预览/提交再验值得复用；输入来源必须跨显式shell与普通模型两入口保真，不能仅复制Gate。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

普通权限卡不覆盖ACP显式shell输入，远端文本不能因标User就当人类授权；非正轮数不设cap、费用检查有条件，rewind不撤shell/外部动作。所核Host源码与bundle pin亦不同，非默认部署漏洞实证。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

能验代码的开发者仅在独立OS副本、无敏感资料和可观察模型额度下人工普通任务试用；先不启DSH自动委派，超资源阈值/来源或停止后状态不明即停并回退原办法。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码沿核心工具闭环、ACP权限/输入与恢复补核；非全产品审计且未运行。根工具只限外部隔离、普通模型入口的人工小样；DSH自动委派先保持关闭，不能以reject保证所有输入只读。未来入口适配仍是假设。

- 已检查：作者 README、包清单、源码路径 README.md、docs/DSH.md、go.mod、integrations/dsh-plugin/cordis.patch.yml、integrations/dsh-plugin/package.json、internal/assembly/boot/build.go、internal/assembly/boot/roles.go、internal/frontend/acp/dispatch.go、internal/frontend/acp/prompt_attachments.go、internal/frontend/acp/service.go、internal/frontend/acp/session.go、internal/frontend/acp/shell_prompt.go、internal/frontend/acp/tool_approval_ceiling.go、internal/runtime/agent/agent.go、internal/runtime/agent/execute_batch.go、internal/runtime/agent/execute_one.go、internal/runtime/agent/finalization.go、internal/runtime/agent/goal_run_boundary.go、internal/runtime/agent/run_budget.go、internal/runtime/agent/run_cost.go、internal/runtime/agent/run_loop.go、internal/runtime/agent/sampling_request.go、internal/safety/permission/verdict.go、internal/safety/permission/write_fence.go、internal/session/control/rewind.go、internal/session/control/shell.go、internal/session/control/turn_entry.go、internal/session/control/turn_orchestrator.go、internal/session/control/turn_projection.go、internal/state/checkpoint/file_revert.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件2465个tracked文件材料不等全审。实际定向核README/Go依赖、DSH配置及文档，ACP/controller核心入口、Agent.Run/采样/工具结果/预算、Gate与subject nil分流、显式shell、取消和恢复预览/提交。外部DSH只核固定委派prompt与权限caller，保存原件/版本依赖；未全审全部前端、扩展/所有工具、OS沙箱/进程树/网络、完整checkpoint事务和凭据日志生命周期，不执行目标。
- 下一步：后续授权后一次性OS副本比现Agent/手工与Reasonix人工任务的diff、真实验证、费用、错误和恢复时间；自动ACP在同版组合先核普通文本/显式命令来源与硬隔离，失败/未知先停，不靠模型提示。

**分析版本**

- **仓库**：[esengine/DeepSeek-Reasonix](https://github.com/esengine/DeepSeek-Reasonix)
- **版本号**：2.x Studio 开发线（README 声明；DSH 配置包 0.1.0 另计）（[固定提交 8a1fda4](https://github.com/esengine/DeepSeek-Reasonix/tree/8a1fda41a7fd62654fc8113391f620c57c3ad51d)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是自动委派与人类命令分开授权的ACP入口适配；对照现reject/前置分流/禁bash/OS隔离，测误授权、误拦及人工，简单上游修正足够即否定独立插件。见[Q06](#research-q06)。

后续授权后一次性OS副本比现Agent/手工与Reasonix人工任务的diff、真实验证、费用、错误和恢复时间；自动ACP在同版组合先核普通文本/显式命令来源与硬隔离，失败/未知先停，不靠模型提示。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 397 | 37460 | — | — | 462251 |
| .js | source | 63 | 5458 | 4358 | 717 | — |
| .js | test | 21 | 2354 | 1979 | 210 | — |
| .mjs | test | 29 | 7740 | 6960 | 249 | — |
| .tsx | source | 398 | 46670 | 40478 | 3947 | — |
| .ts | source | 477 | 48390 | 38750 | 6185 | — |
| .mjs | source | 205 | 20569 | 17271 | 2269 | — |
| .cjs | source | 3 | 301 | 291 | 4 | — |
| .jsx | source | 1 | 24 | 22 | 0 | — |
| .ts | test | 229 | 18390 | 15224 | 1262 | — |
| .tsx | test | 612 | 66917 | 59347 | 1898 | — |
| .md | example | 30 | 1789 | — | — | 10765 |

</details>

**活跃度**

[![Issue 未关闭 545](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=545&color=737b86&logo=github)](https://github.com/esengine/DeepSeek-Reasonix/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1,221](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1%2C221&color=737b86&logo=github)](https://github.com/esengine/DeepSeek-Reasonix/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 796](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=796&color=737b86&logo=github)](https://github.com/esengine/DeepSeek-Reasonix/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：根编码Agent与DSH接入的真实工具闭环、输入来源授权、预算/恢复和可控采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目与DSH集成各是什么，贡献在哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Reasonix 根项目是独立开源编码 Agent 工具，带终端、Studio 桌面、浏览器和 ACP（编辑器/宿主调用助手的协议）入口；本项研究根组件，不把它登记成 DSH 插件。它为能审代码、能验收变更的开发者读取仓库、修改文件、运行命令/测试。相比“聊天给修改建议再手工操作”，增量是实际模型—工具循环及权限、会话与恢复机制；相比已有编码 Agent，其多前端/ACP 接入主要是集成能力，尚无同条件正确率、净人工或费用对照，不能从功能数量推优势。

版本口径必须分开：固定 README 的版本表将当前 studio 分支列作 2.x Active development，npm 的 reasonix 则是 main-v2 的 1.x 维护稳定线。integrations/dsh-plugin/package.json 的 0.1.0 是配置包版本，既不是整个 Reasonix 的版本，也不证明固定提交已有同名可用发行二进制。README 明确模型是用户配置的服务，会收到程序读取的内容；本地程序不等于代码绝不出机。

DSH 配置包只插入 subagent-acp provider（command reasonix、args acp、permission reject）及名为 reasonix 的 tool-subagent，maxDepth=provider-managed。这是复用宿主 ACP 工具的接线，不是新协议或根项目全部能力的原创归因。docs/DSH.md 的真实 DeepSeek 验证绑定 0.2.1-rc.2，是作者报告，本轮未复现。当前 ACP 的 sessionPrompt 实际调用 session controller，Agent.Run 驱动 runToolLoop，并非仅返回计划；详细工具回流与失败提交见 Q02。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:64-74](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/README.md#L64-L74)

本机程序与远端模型、编辑恢复明确范围。

<details>
<summary>查看原文（11行）</summary>

```text
## What it is

Reasonix is an open-source AI coding assistant. The program runs on your computer; the AI model is a service you configure, which receives what it reads. You describe a task in plain language; it reads code, edits files and runs commands and tests inside the project folder you choose, and shows you each step.

You pick the model: a DeepSeek preset is built in, any OpenAI-compatible service is one config entry, and you pay the model provider directly.

## What you get

- **Read, edit, run.** It reads code, edits files and runs tests and commands, all inside your project folder.
- **Permission levels.** Have it ask every time, or let everyday actions run on their own; your forbid rules always hold. To see the approach first, use plan mode: it starts work only once you approve.
- **Rewind.** A file is saved before it changes, so you can rewind by conversation turn without touching your git history. Only files its edit tools changed are covered, not what a shell command did.
```

</details>

**依据 2 · 作者声明**：[README.md:108-122](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/README.md#L108-L122)

2.x开发线与npm1.x维护线区分。

<details>
<summary>查看原文（15行）</summary>

```text
Reasonix ships on two lines. See the [version roadmap announcement](https://github.com/esengine/DeepSeek-Reasonix/discussions/10748) for the reasoning behind the split.

| Line | Branch | Status | Get it |
| --- | --- | --- | --- |
| **Reasonix 2.x** | `studio` (this branch) | Active development | [Studio releases](https://github.com/esengine/DeepSeek-Reasonix/releases?q=studio-v&expanded=true) |
| **Reasonix 1.x** | [`main-v2`](https://github.com/esengine/DeepSeek-Reasonix/tree/main-v2) | Maintenance / stable | `npm i -g reasonix` · [desktop download](https://reasonix.io/?download=desktop#start) |

- **Want something stable?** Stay on 1.x. It keeps receiving bug fixes,
  provider/API compatibility, updater and security fixes; its core architecture
  is no longer being extended.
- **Want the new architecture?** Use 2.x Reasonix Studio. It is still moving
  quickly; reports are welcome.

Valuable fixes, tests and behaviour from 1.x are reviewed one by one and ported
or reimplemented on 2.x where they fit the new architecture.
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-plugin/package.json:1-6](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/integrations/dsh-plugin/package.json#L1-L6)

0.1.0配置包不是根版本。

```text
{
  "name": "dsh-plugin-reasonix",
  "version": "0.1.0",
  "description": "Use Reasonix as a subagent in DeepSeek Harness (dsh) through its ACP provider. Configuration only, no code.",
  "homepage": "https://reasonix.io",
  "author": "Reasonix",
```

**依据 4 · 源码核查**：[integrations/dsh-plugin/package.json:24-35](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/integrations/dsh-plugin/package.json#L24-L35)

宿主及provider精确版本0.2.1-rc.2。

<details>
<summary>查看原文（12行）</summary>

```text
  "engines": {
    "dsh": "0.2.1-rc.2"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "@deepseek-ai/dsh-subagent-acp": "0.2.1-rc.2"
  },
  "private": true
```

</details>

**依据 5 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:1-14](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/integrations/dsh-plugin/cordis.patch.yml#L1-L14)

纯配置ACP接线与reject。

<details>
<summary>查看原文（14行）</summary>

```text
- insert:
    - id: subagent-acp-reasonix
      name: '@deepseek-ai/dsh-subagent-acp'
      config:
        providerName: reasonix
        command: reasonix
        args: ['acp']
        permission: reject
    - id: tool-subagent-reasonix
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: reasonix
        toolName: reasonix
        maxDepth: provider-managed
```

</details>

**依据 6 · 作者声明**：[docs/DSH.md:16-27](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/docs/DSH.md#L16-L27)

作者验证/部署契约而非本轮运行。

<details>
<summary>查看原文（12行）</summary>

```text
## Purpose

DeepSeek Harness (`dsh`) can delegate a task to any Agent Client Protocol agent through its `subagent-acp` provider. Reasonix speaks ACP with `reasonix acp`, so a Harness agent can hand work to Reasonix as a subagent with no code on either side, only configuration.

Verified against `dsh` 0.2.1-rc.2 and `@deepseek-ai/dsh-subagent-acp` 0.2.1-rc.2, with a real DeepSeek model in the Reasonix child.

## Preconditions

1. Reasonix MUST be installed on the machine that runs `dsh`, and its model provider MUST be set up there: run `reasonix setup` once.
2. `reasonix` MUST be reachable by the command you configure (an absolute path is the safest).
3. The provider key MUST live in Reasonix's own home (`<Reasonix home>/.env`, see [CONFIG_PATHS](./CONFIG_PATHS.md)). Reasonix does not read provider keys from environment variables, so the `env` block of the Harness row cannot supply one.
4. The provider package version MUST equal the `dsh` version (`dsh --version`). Name it exactly: the `latest` tag points at an old `0.0.1-rc.1` and `next` may resolve to an older pre-release, and `dsh` refuses both as incompatible.
```

</details>

**依据 7 · 源码核查**：[internal/frontend/acp/session.go:334-353](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/session.go#L334-L353)

真实controller任务调用。

<details>
<summary>查看原文（20行）</summary>

```text
	runCtx, cancel, ok := sess.begin(ctx)
	if !ok {
		return nil, &RPCError{Code: ErrInvalidRequest, Message: "session/prompt: session already has an active prompt"}
	}
	if sess.status == nil {
		sess.status = newStatusTelemetry()
	}
	sess.status.beginTurn()
	s.publishStatus(sess, "phase")
	sess.sink.setTurnContext(runCtx)
	if sess.takeGoalDraftMode() {
		sess.currentCtrl().SetGoal(text)
		sess.saveMetaIfPresent()
	}
	defer func() {
		sess.sink.clearTurnContext()
		s.finishTurn(ctx, sess)
		cancel()
	}()
	runErr := drainACPInbox(runCtx, sess.ctrl, runPrompt(runCtx, sess.ctrl, text, rawText, invokedSkill))
```

</details>

**依据 8 · 源码核查**：[internal/runtime/agent/agent.go:900-911](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/agent.go#L900-L911)

Agent.Run调用真实loop。

<details>
<summary>查看原文（12行）</summary>

```text
	_, state := a.beginRunTurn(ctx, input)
	ctx = a.bindRootTokenBudget(ctx, state)
	if state.snapshot != nil {
		defer state.snapshot.cancel()
	}
	state.runMaxSteps = runMaxSteps
	state.runMaxStepsKey = runMaxStepsKey
	state.runLimitHostOwned = runLimitHostOwned
	state.workDurationMs = workDurationMs
	err := a.runToolLoop(ctx, state)
	report(state.answeredMs, err)
	return err
```

</details>

#### 缺口

- 代表编码任务合格率、跨前端一致性与交接净收益未测
  **影响**：源码整合不证明更少人工或取代现Agent
  **进一步探讨**：同模型同副本比较直接使用、聊天手工与委派的错漏、验证、返工、费用和交接时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型如何连续执行工具，何时停止，预算能证明什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

当前 Go Agent 是真实工具执行循环。ACP 普通 prompt 调 session controller 的 RunTurnWithRaw，进入具体 Agent.Run；boot先agent.New创建executor，无独立planner时role wiring直接把它当runner，controller保存该runner并由runWithRunner调用runner.Run。有独立planner时还有包装，本轮不冒充该多模型路由全审。Run 初始化当次状态后调用 runToolLoop。每轮 streamWithSamplingRecovery 冻结本轮请求，经 streamWithFrozen → streamProviderRequest → a.svc.prov.Stream(ctx, req) 取得模型流。只有已接受的采样结果才把 assistant/tool calls 加入会话；失败流先做有次数限制的重试，不把其未提交工具候选执行两遍。

handleToolRound 调 executeBatch，后者调用 executeOne。普通执行在 recovery/permission 裁决、lease/文件准备等步骤之后，按工具接口走 ExecuteDetailed、媒体执行或 runTool.Execute。结果不是只有 UI 卡：handleToolRound 为每个 call 构造 RoleTool、Content、ToolCallID、Name，并 Add 到同一 conversation；随后 return true。runToolLoop 的 for 重新进入采样，buildSamplingRequest 从 contextManager.Prepare 返回的当前模型可见会话生成 Messages，继而发下一次 provider.Stream。这闭合模型选动作→真实调用→结果→再决策，而不是固定流程或一次生成命令。来源标注、错误/拒绝和部分原始输出也跟随结果，但不能等同业务成果已正确。

轮数护栏有明确条件：runToolLoop 的 for 条件是 runMaxSteps<=0 或 step<runMaxSteps，另允许 grace/recovery round；Agent.Run 可接受宿主 context 的 step limit 覆盖。非正数不提供轮数上限；正上限也不是恰好只发 N 次请求，因为还存在最终总结宽限轮、同轮重试和其它恢复。达到正上限后 armFinalizationRound 要求总结，下一轮工具调用会被拒绝配对，而不是继续执行所有新工具。gracePause 以 maxStepsPause/taskBudgetPause 返回可继续的暂停，不能写成“正常完成且所有工作已验收”。

TaskBudget 有 Tokens、Cost、Wall 三轴，负值归零、仅正值启用，宿主注入值优先于配置。实际 observeRunBudget 汇总用量后，handleToolRound 在工具结果落会话之后检查 exceededTaskBudget，再进入总结宽限轮。Cost 判断只在已有可定价轮次时比较；runCost 对估算用量、缺价格/缺币种或混合 totals 标 incomplete，已知支出不能代表整张厂商账单。未设有效预算不能从“有 budget 类型”推已约束；这些轮后检查与额外总结请求也不能承诺精确现金、总运行时间、外部工具消费上限。root token 等另有控制面，本轮不冒充全费用审计。

终态还看实际交付证据：handleFinalResponse 调 finalReadinessCheckFor，不满足时返回 FinalReadinessError；ACP sessionPrompt 对这种错误仍以协议 end_turn 结束，同时发缺项收据并把 Reasonix 专有 turnOutcome.kind 标成 paused；不能把协议正常结束当已验证交付。其它错误返回 RPC 失败、context取消返回 cancelled。已有收据、验证命令分类和缺项审计是真机制，不能说该产品只看模型“我完成了”；同样，这些内部规则是否覆盖真实任务验收仍未实测。

#### 证据与依据

**依据 1 · 源码核查**：[internal/frontend/acp/shell_prompt.go:17-24](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/shell_prompt.go#L17-L24)

普通prompt进入controller；显式shell另路。

```text
func runPrompt(ctx context.Context, ctrl acpController, text, raw, invokedSkill string) error {
	cmd, ok := strings.CutPrefix(strings.TrimSpace(text), "!")
	if !ok {
		return ctrl.RunTurnWithRaw(ctx, text, raw, invokedSkill)
	}
	ctrl.RunShell(cmd)
	tick := time.NewTicker(shellPollInterval)
	defer tick.Stop()
```

**依据 2 · 源码核查**：[internal/session/control/turn_entry.go:55-59](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/turn_entry.go#L55-L59)

转活动orchestrator。

```text
func (c *Controller) runTurnLoop(ctx context.Context, turn orchestratedTurn) error {
	if err := c.leaveForeignSession(); err != nil {
		return err
	}
	return newTurnOrchestrator(c).runTurnLoop(ctx, turn)
```

**依据 3 · 源码核查**：[internal/session/control/turn_entry.go:79-85](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/turn_entry.go#L79-L85)

同步普通模型入口。

```text
func (c *Controller) RunTurnWithRaw(ctx context.Context, input, raw, invokedSkill string) error {
	return c.runSynchronousTurn(ctx, nil, func(runCtx context.Context) error {
		if invokedSkill != "" {
			runCtx = withInvokedSkills(runCtx, []string{invokedSkill})
		}
		return c.runTurnLoop(runCtx, orchestratedTurn{input: input, raw: raw})
	})
```

**依据 4 · 源码核查**：[internal/session/control/turn_orchestrator.go:258-274](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/turn_orchestrator.go#L258-L274)

运行预算/输入准备后runWithRunner。

<details>
<summary>查看原文（17行）</summary>

```text
	ctx = c.bindTurnScope(ctx, continuation)
	ctx = c.prepareTurnRootBudget(ctx)
	modelInput := input
	if !turn.synthetic {
		modelInput = c.withCapabilityRoute(ctx, input, turn.raw)
	}
	ctx = c.withPlannerTurnMetadata(ctx, turn.raw, turn.synthetic)
	// Real user turns open a fresh Recovery Episode. Goal auto-continues and
	// other synthetic turns inherit the current Episode so budgets accumulate
	// only within one host-owned execution round.
	if !turn.synthetic {
		c.beginRecoveryEpisode()
	}
	err = c.runWithRunner(ctx, modelInput)
	c.captureGoalRunWorkDuration(startMessages)
	c.persistGoalDeliveryCheckpoint()
	if err != nil {
```

</details>

**依据 5 · 源码核查**：[internal/runtime/agent/agent.go:845-856](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/agent.go#L845-L856)

宿主step覆盖。

<details>
<summary>查看原文（12行）</summary>

```text
func (a *Agent) Run(ctx context.Context, input string) (runErr error) {
	ctx = a.compositionContext(ctx)
	ctx, report := takeRunTimeSink(ctx)
	runMaxSteps := a.maxSteps
	runMaxStepsKey := a.maxStepsKey
	runLimitHostOwned := false
	if limit, ok := runStepLimitFromContext(ctx); ok {
		runMaxSteps = limit.steps
		runLimitHostOwned = true
		if limit.key != "" {
			runMaxStepsKey = limit.key
		}
```

</details>

**依据 6 · 源码核查**：[internal/runtime/agent/agent.go:900-911](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/agent.go#L900-L911)

Agent.Run进入loop。

<details>
<summary>查看原文（12行）</summary>

```text
	_, state := a.beginRunTurn(ctx, input)
	ctx = a.bindRootTokenBudget(ctx, state)
	if state.snapshot != nil {
		defer state.snapshot.cancel()
	}
	state.runMaxSteps = runMaxSteps
	state.runMaxStepsKey = runMaxStepsKey
	state.runLimitHostOwned = runLimitHostOwned
	state.workDurationMs = workDurationMs
	err := a.runToolLoop(ctx, state)
	report(state.answeredMs, err)
	return err
```

</details>

**依据 7 · 源码核查**：[internal/runtime/agent/run_loop.go:265-267](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_loop.go#L265-L267)

非正轮数不设cap，另有grace。

```text
func (a *Agent) runToolLoop(ctx context.Context, state *turnRuntime) error {
	ctx = a.withAgentContext(ctx)
	for step := 0; state.runMaxSteps <= 0 || step < state.runMaxSteps || state.graceRound || state.recoveryGraceRound; step++ {
```

**依据 8 · 源码核查**：[internal/runtime/agent/run_loop.go:295-310](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_loop.go#L295-L310)

实际采样与错误返回。

<details>
<summary>查看原文（16行）</summary>

```text
		streamed := a.streamWithSamplingRecovery(ctx, step+1)
		text, reasoning, signature, calls, responsesItems, usage := streamed.text, streamed.reasoning, streamed.signature, streamed.calls, streamed.responsesItems, streamed.usage
		partialCalls, err := streamed.partialCalls, streamed.err
		prefixShape.BodyChain = streamed.bodyChain // what actually went out
		cacheDiagnostics := CompareShape(prevPrefixShape, prefixShape, usage, contentReasons)
		if err != nil {
			quote := a.emitTurnUsage(usage, &cacheDiagnostics, streamed.attemptID)
			a.observeRunBudget(state, usage, quote)
			if msg, ok := finishReasonMessage(usage); ok {
				a.svc.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelWarn, Text: msg})
			}
			// Exhausted stream retries (or a non-retryable error): persist one
			// bounded LocalOnly recovery record for the next real user message.
			// Intermediate failed attempts never wrote session state.
			a.recordInterruptedDisplay(text, reasoning, partialCalls, true, state.workDurationMs(), provider.StreamFailureCauseOf(err))
			return err
```

</details>

**依据 9 · 源码核查**：[internal/runtime/agent/run_loop.go:329-342](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_loop.go#L329-L342)

只提交已接受assistant及calls。

<details>
<summary>查看原文（14行）</summary>

```text
		workMs, committed := state.workDurationMs(), a.callsToCommit(streamed, calls)
		a.sess.conversation.Add(provider.Message{
			Role:               provider.RoleAssistant,
			Content:            text,
			ReasoningContent:   reasoning,
			ReasoningSignature: signature,
			ReasoningID:        streamed.reasoningID,
			ReasoningStatus:    streamed.reasoningStatus,
			ToolCalls:          committed,
			ResponsesItems:     responsesItems,
			WorkDurationMs:     workMs,
			ThoughtMs:          streamed.thoughtMs,
			ModelRef:           a.modelRef,
		})
```

</details>

**依据 10 · 源码核查**：[internal/runtime/agent/run_loop.go:364-379](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_loop.go#L364-L379)

工具结果后继续，耗尽到pause。

<details>
<summary>查看原文（16行）</summary>

```text
		// Invariant: executeBatch only ever receives tool calls from a
		// committed sampling attempt (clean terminal + response intercept).
		cont, terr := a.handleToolRound(planmode.WithAuthority(ctx, authority), state, step, text, reasoning, calls, usage)
		if cont {
			// After the tool results, never between them and their call: the
			// provider requires an unbroken assistant/tool pairing.
			a.recordTruncationFact(boundary)
		}
		if !cont {
			return terr
		}
	}
	// Only reached when a positive maxSteps guard is configured. The work so far
	// is already in the session, so the user can just send another message to pick
	// up where it left off.
	return a.gracePause(ctx, state)
```

</details>

**依据 11 · 源码核查**：[internal/runtime/agent/run_loop.go:407-441](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_loop.go#L407-L441)

冻结每轮请求并有限sampling attempts。

<details>
<summary>查看原文（35行）</summary>

```text
func (a *Agent) streamWithSamplingRecovery(ctx context.Context, turn int) streamedTurn {
	frozen, err := a.prepareSamplingRequest(ctx)
	if err != nil {
		return streamedTurn{err: err}
	}
	// One request counter spans every body attempt; each attempt records only
	// its delta so RequestCount equals real HTTP POSTs (no triangular growth).
	ctx = provider.WithRequestAttemptCounter(ctx)

	var billable *provider.Usage
	var last streamedTurn

	runAttempt := func(attemptID string, sink event.Sink) streamedTurn {
		before := provider.RequestAttemptCount(ctx)
		result := a.streamWithFrozen(ctx, turn, sink, &frozen, attemptID)
		result.attemptID, result.bodyChain = attemptID, BodyChain(frozen.req.Messages)
		delta := max(provider.RequestAttemptCount(ctx)-before, 0)
		// httpRequests=0 means the provider does not use SendWithRetry
		// (extension/custom), or it failed before issuing an HTTP request.
		// Only overwrite RequestCount when the built-in counter observed POSTs;
		// otherwise keep the provider-reported count (zero still means one via
		// usageRequestCount compatibility). estimateFailedAttemptUsage returns nil
		// for zero-output local failures so no invented request appears.
		result.usage = estimateFailedAttemptUsage(result.usage, frozen, result, delta)
		if result.usage != nil {
			if delta > 0 {
				result.usage.RequestCount = delta
			}
		} else if delta > 0 {
			result.usage = &provider.Usage{RequestCount: delta}
		}
		return result
	}

	for attempt := 1; attempt <= maxSamplingAttempts; attempt++ {
```

</details>

**依据 12 · 源码核查**：[internal/runtime/agent/agent.go:1189-1208](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/agent.go#L1189-L1208)

provider流使用自己的child context并取消。

<details>
<summary>查看原文（20行）</summary>

```text
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	var req provider.Request
	var err error
	if frozen != nil {
		req = freezeProviderRequest(frozen.req)
	} else {
		prepared, perr := a.prepareSamplingRequest(ctx)
		if perr != nil {
			return streamedTurn{err: perr}
		}
		req = prepared.req
	}
	// Host stream cancels on generation drain (OpenAI/Anthropic HTTP reads).
	defer TrackPublishedHostStream(ctx, cancel)()
	thought := thoughtClock{begin: time.Now()}
	ch, err := a.streamProviderRequest(ctx, req)
	if err != nil {
		return streamedTurn{usage: provider.UsageWithRequestAttemptCount(ctx, nil), err: err}
```

</details>

**依据 13 · 源码核查**：[internal/runtime/agent/sampling_request.go:30-35](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/sampling_request.go#L30-L35)

实际调用provider.Stream。

```text
func (a *Agent) streamProviderRequest(ctx context.Context, req provider.Request) (<-chan provider.Chunk, error) {
	ch, err := a.svc.prov.Stream(ctx, req)
	if err == nil {
		a.window().rememberSummaryPrefix(req)
	}
	return ch, err
```

**依据 14 · 源码核查**：[internal/runtime/agent/sampling_request.go:116-140](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/sampling_request.go#L116-L140)

当前会话Prepare生成下一请求Messages。

<details>
<summary>查看原文（25行）</summary>

```text
func (a *Agent) buildSamplingRequest(ctx context.Context, trigger string) (samplingRequest, error) {
	// CreatedAt is durable UI metadata, not model input. Strip it from the
	// transport copy so wall-clock differences never invalidate the provider's
	// prompt-cache prefix (and custom providers cannot accidentally send it).
	prepared, err := a.window().contextManager().Prepare(ctx, ContextPreparePolicy{Trigger: trigger})
	if err != nil {
		return samplingRequest{}, err
	}
	// The host tails are already here: Prepare answers from modelVisibleMessages,
	// and the host context tail appends whatever it is given again.
	requestMessages := append([]provider.Message(nil), provider.ModelMessages(prepared.Messages)...)
	requestMessages = a.providerProjectionMessages(requestMessages)
	for i := range requestMessages {
		requestMessages[i].CreatedAt = 0
	}
	// context.prepare: extensions may rewrite the message copy feeding THIS
	// request. The session log is never touched — the replacement is
	// ephemeral, so the next request starts from the unmodified history.
	requestMessages, err = a.interceptContextPrepare(ctx, requestMessages)
	if err != nil {
		return samplingRequest{}, err
	}
	req := provider.Request{
		Messages:       requestMessages,
		Tools:          a.svc.tools.ProviderSchemas(ctx),
```

</details>

**依据 15 · 源码核查**：[internal/runtime/agent/execute_batch.go:172-189](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/execute_batch.go#L172-L189)

batch真实调用executeOne。

<details>
<summary>查看原文（18行）</summary>

```text
	run := func(i int) {
		t, _, ambiguous := a.svc.tools.ResolveCall(calls[i].Name)
		known := t != nil && len(ambiguous) == 0
		writer := known && !t.ReadOnly()
		surfaceWriters[i] = writer
		start := time.Now()
		startedAt[i] = start.UnixMilli()
		if calls[i].Name == "complete_step" && completedStepInBatch {
			output := "blocked: only one successful complete_step is allowed per tool-call round. Continue from the newly promoted in_progress todo in the next round instead of batching sign-offs."
			outcomes[i] = toolOutcome{output: output, blocked: true, errMsg: "blocked: complete_step sign-offs must be serial"}
			if a.task.ledger != nil {
				a.task.ledger.Record(evidence.ReceiptFromToolCall(calls[i].Name, json.RawMessage(calls[i].ExecutionArguments()), false, evidence.ToolFacts{ReadOnly: true}))
			}
			durations[i] = time.Since(start).Milliseconds()
			results[i] = output
			return
		}
		outcomes[i] = a.executeOne(ctx, turn, calls[i])
```

</details>

**依据 16 · 源码核查**：[internal/runtime/agent/execute_one.go:534-558](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/execute_one.go#L534-L558)

普通工具权限拒绝不执行。

<details>
<summary>查看原文（25行）</summary>

```text
	} else if a.svc.gate != nil {
		v, err := permission.VerdictOf(a.originCtx(ctx, plan), a.svc.gate, plan.permName, gateArgs, plan.readOnly)
		if err != nil {
			return toolOutcome{
				output:    fmt.Sprintf("blocked: %s (%v)", v.Reason, err),
				blocked:   true,
				errMsg:    fmt.Sprintf("blocked: %v", err),
				execution: shellRefusal(plan.execTool, plan.execArgs, tool.ShellPhaseAuthorization),
			}, true
		}
		// permission.decision: the host verdict is computed first; the
		// extension ruling may override it in either direction (an allow
		// overriding a host deny is the full-trust contract and is audited).
		if blocked, early := a.interceptExtensionPermission(ctx, plan, &v.Allow); early {
			return blocked, true
		}
		if !v.Allow {
			return toolOutcome{
				output:      "blocked: " + v.Reason,
				blocked:     true,
				errMsg:      "blocked by permission policy",
				refusalCode: v.Code,
				execution:   shellRefusal(plan.execTool, plan.execArgs, tool.ShellPhaseAuthorization),
			}, true
		}
```

</details>

**依据 17 · 源码核查**：[internal/runtime/agent/execute_one.go:756-783](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/execute_one.go#L756-L783)

具体ExecuteDetailed/Execute。

<details>
<summary>查看原文（28行）</summary>

```text
	defer endCall()
	if de, ok := runTool.(tool.DetailedExecutor); ok {
		var detailed tool.DetailedResult
		detailed, err = de.ExecuteDetailed(cctx, runArgs)
		result, media.images, execution = detailed.Output, detailed.Images, detailed.Execution
		// Annotate verification outcome when the host classified this call as a
		// verifier. The exit status answers for the whole command, so it is a
		// verdict about the verifier only when no later stage can decide it.
		if execution != nil && plan.verification {
			execution.Verification = shellVerificationVerdict(bashCommandFromArgs(plan.evidenceArgs),
				bashDeclaredCheck(plan.evidenceArgs) != "", execution.PipeStatus, err)
			result = shellVerificationNotice(result, execution)
		} else if execution != nil && execution.Verification == "" {
			execution.Verification = tool.ShellVerificationNotVerification
		}
		annotateShellSubject(execution, runArgs)
		// Sole opaque inline interpreters are allowed outside Delivery but cannot
		// prove mutation completeness.
		if execution != nil && evidence.BashCommandMayBeOpaqueMutation(runArgs) &&
			execution.MutationRisk == tool.ShellMutationMayHaveCompleted {
			execution.MutationRisk = tool.ShellMutationUnknown
		}
	} else if run, ok := mediaTool(runTool); ok {
		result, media, err = run(cctx, runArgs)
	} else {
		result, err = runTool.Execute(cctx, runArgs)
	}
	return result, media, execution, stoppedByUser(turn, cctx, err)
```

</details>

**依据 18 · 源码核查**：[internal/runtime/agent/run_loop.go:695-707](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_loop.go#L695-L707)

工具结果按callID构造RoleTool。

<details>
<summary>查看原文（13行）</summary>

```text
	state.snapshot.await(ctx, snapshotWait)
	mark := a.markProgressRound()
	batch := a.executeBatch(ctx, state, calls)
	results, images := batch.results, batch.images
	flagged := a.screenExternal(ctx, calls, batch)
	for i, call := range calls {
		msg := provider.Message{
			Role:       provider.RoleTool,
			Content:    results[i],
			Images:     images[i],
			Videos:     batch.videos[i],
			ToolCallID: call.ID,
			Name:       call.Name,
```

</details>

**依据 19 · 源码核查**：[internal/runtime/agent/run_loop.go:723-737](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_loop.go#L723-L737)

结果入会话后取消返回。

<details>
<summary>查看原文（15行）</summary>

```text
		if i < len(batch.executions) {
			msg.ToolExecution = toProviderToolExecution(batch.executions[i])
		}
		if i < len(batch.outcomes) {
			if o := batch.outcomes[i]; o.errMsg != "" || o.blocked || o.refusalCode != "" {
				msg.ToolFailure = &provider.ToolFailure{RefusalCode: o.refusalCode, Blocked: o.blocked}
			}
		}
		a.sess.conversation.Add(msg)
	}
	// If the context was cancelled during tool execution, return after storing
	// the batch results so the session keeps paired tool-call history.
	if ctx.Err() != nil {
		a.recordInterruptedDisplay("", "", nil, true, state.workDurationMs(), "")
		return false, ctx.Err()
```

</details>

**依据 20 · 源码核查**：[internal/runtime/agent/run_loop.go:756-766](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_loop.go#L756-L766)

轮后检查花费并进入总结宽限轮。

<details>
<summary>查看原文（11行）</summary>

```text
	// Spend is checked before rounds: it is the axis a runaway is actually
	// reported in, so on the turns both would catch it should be the one named.
	if axis, detail := a.exceededTaskBudget(ctx, state); axis != "" {
		a.armFinalizationRound(state, landCause{kind: "task_budget", axis: axis, detail: detail})
		return true, nil
	}
	if state.runMaxSteps > 0 && step+1 >= state.runMaxSteps {
		a.armFinalizationRound(state, landCause{kind: "max_steps", detail: fmt.Sprintf(
			"budget (%s=%d) exhausted: one grace round to finalize", state.runMaxStepsKey, state.runMaxSteps)})
	}
	return true, nil
```

</details>

**依据 21 · 源码核查**：[internal/runtime/agent/run_budget.go:18-36](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_budget.go#L18-L36)

负值归零，零轴不启用。

<details>
<summary>查看原文（19行）</summary>

```text
type TaskBudget struct {
	Cost   float64
	Wall   time.Duration
	Tokens int
}

// normalizeTaskBudget reads a negative value as unset, so a disabled axis and
// an unconfigured one behave identically.
func normalizeTaskBudget(b TaskBudget) TaskBudget {
	if b.Cost < 0 {
		b.Cost = 0
	}
	if b.Wall < 0 {
		b.Wall = 0
	}
	if b.Tokens < 0 {
		b.Tokens = 0
	}
	return b
```

</details>

**依据 22 · 源码核查**：[internal/runtime/agent/run_budget.go:96-122](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_budget.go#L96-L122)

预算真实比较和宿主优先级。

<details>
<summary>查看原文（27行）</summary>

```text
func (b *runBudget) exceeded(limit TaskBudget) (axis, detail string) {
	if limit.Tokens > 0 {
		if used := b.tokens; used >= uint64(limit.Tokens) {
			return "token", fmt.Sprintf("task used %d tokens, reaching the %d budget", used, limit.Tokens)
		}
	}
	if limit.Cost > 0 && b.cost.pricedRounds > 0 && b.cost.amount() >= max(pricing.Amount(1), pricing.NewAmountFromFloat(limit.Cost)) {
		return "cost", fmt.Sprintf("task spend %.4f reached the %.4f budget", b.cost.amount().Float64(), limit.Cost)
	}
	if limit.Wall > 0 {
		if elapsed := b.elapsed(); elapsed >= limit.Wall {
			return "time", fmt.Sprintf("task ran %s, past the %s budget",
				elapsed.Round(time.Second), limit.Wall)
		}
	}
	return "", ""
}

// taskBudgetLimit resolves this turn's bound: a host-injected budget wins over
// the configured one, which is how an unattended loop gets a ceiling while
// ordinary chat keeps none.
func (a *Agent) taskBudgetLimit(ctx context.Context) TaskBudget {
	if b, ok := taskBudgetFromContext(ctx); ok {
		return b
	}
	return a.task.budget.limit
}
```

</details>

**依据 23 · 源码核查**：[internal/runtime/agent/run_cost.go:16-48](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_cost.go#L16-L48)

缺价格/估算记incomplete，单币种完整性限制。

<details>
<summary>查看原文（33行）</summary>

```text
	if quote != nil && quote.Original.Currency != "" {
		c.currency = pricing.NormalizeCurrency(quote.Original.Currency)
	}
	if usage == nil || usage.Estimated || quote == nil || pricing.NormalizeCurrency(quote.Original.Currency) == "" || len(quote.OriginalTotals) > 0 {
		c.incomplete = true
		return
	}
	amount, err := pricing.NewAmountFromString(quote.Original.Amount)
	if err != nil || amount < 0 {
		c.incomplete = true
		return
	}
	q := pricing.NormalizeQuote(*quote)
	// An explicitly reported zero retains its known zero subtotal even though
	// the quote layer classifies a no-token record as incomplete usage.
	zero := usage.PromptTokens == 0 && usage.CompletionTokens == 0 && usage.TotalTokens == 0 &&
		usage.CacheHitTokens == 0 && usage.CacheMissTokens == 0 && usage.CacheWriteTokens == 0 && usage.CacheWriteBilledTokens == 0
	if !q.CostComplete && !(zero && q.IncompleteReason == "missing_price_or_usage" && amount == 0) {
		c.incomplete = true
		return
	}
	if c.amounts == nil {
		c.amounts = map[string]pricing.Amount{}
	}
	c.amounts[c.currency] = c.amounts[c.currency].Add(amount)
	c.pricedRounds++
}

func (c *runCost) amount() pricing.Amount { return c.amounts[c.currency] }

func (c *runCost) complete() bool {
	return !c.incomplete && c.pricedRounds > 0 && len(c.amounts) == 1
}
```

</details>

**依据 24 · 源码核查**：[internal/runtime/agent/finalization.go:38-61](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/finalization.go#L38-L61)

真正grace与可继续暂停。

<details>
<summary>查看原文（24行）</summary>

```text
// armFinalizationRound is the single place a turn is told to stop using tools.
// The grace round it sets — not the wording — is what enforces that: unexecuted
// calls in the next round are paired and refused by stopUnexecutedBoundaryCalls.
func (a *Agent) armFinalizationRound(state *turnRuntime, cause landCause) {
	if state.graceRound {
		return
	}
	state.graceRound = true
	state.landCause = cause
	a.sess.conversation.Add(provider.Message{Role: provider.RoleUser, Content: a.withTurnPreferences(cause.nudge(state)), HostAuthored: true})
	a.svc.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelInfo, Code: event.NoticeCodeToolBudget,
		Text: cause.noticeText(), Detail: cause.detail})
}

// gracePause is the resumable stop a finalized turn ends with, chosen by what
// caused the landing. Every host-stopped turn leaves through here, so the
// end-of-turn summary is reported here too: a turn that ran out of rounds is
// the one whose unverified work matters most to report.
func (a *Agent) gracePause(ctx context.Context, state *turnRuntime) error {
	a.emitTurnShadows(ctx, a.turn.turnInput, true)
	if state.landCause.kind == "task_budget" {
		return &taskBudgetPause{axis: state.landCause.axis, detail: state.landCause.detail}
	}
	return &maxStepsPause{steps: state.runMaxSteps, key: state.runMaxStepsKey, hostOwned: state.runLimitHostOwned}
```

</details>

**依据 25 · 源码核查**：[internal/runtime/agent/run_loop.go:581-617](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_loop.go#L581-L617)

已有readiness审核/暂停，不是只看最终文本。

<details>
<summary>查看原文（37行）</summary>

```text
func (a *Agent) handleFinalResponse(ctx context.Context, state *turnRuntime, text, reasoning string, usage *provider.Usage) (cont bool, err error) {
	// A captured criterion is owed until it has run. The run costs a build, so
	// it happens where the turn asks whether it may stop, not per tool call.
	a.evaluateBaselineCriteriaOnce(ctx)
	readiness := a.finalReadinessCheckFor()
	a.turn.lastReadiness = &readiness
	if state.graceRound && (readiness.reason != "" || !hasVisibleFinalAnswer(text)) {
		return false, a.gracePause(ctx, state)
	}
	if state.graceRound && (state.landCause.kind == "task_budget" || !state.runLimitHostOwned) {
		// Explicit max_steps and spend budgets are user-selected boundaries.
		// Preserve the summary, then return a resumable pause so Goal does not
		// immediately open another Run and silently bypass the chosen limit.
		return false, a.gracePause(ctx, state)
	}
	// An executor that has not acted yet gets its one in-turn nudge before the
	// gate ends the run: what it owes is still something this turn can supply.
	if state.executorHandoff && !state.usedAnyTool && state.handoffNudges < maxExecutorHandoffNudges && a.shouldNudgeExecutorHandoff() {
		state.handoffNudges++
		a.svc.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelInfo, Code: event.NoticeCodeExecutorHandoff, Text: executorHandoffNoticeText(), Detail: "executor answered without taking any action; nudging it to use its tools"})
		a.sess.conversation.Add(provider.Message{Role: provider.RoleUser, Content: a.withTurnPreferences(executorHandoffRetryMessage()), HostAuthored: true})
		return true, nil
	}
	if readiness.reason != "" {
		// Delivery no longer retries readiness with hidden model messages: the
		// run ends immediately with the missing requirements, and the host owns
		// what happens next. In Goal mode the FSM auto-continues under budget
		// with the missing list as the next turn; plain Delivery turns surface
		// the recovery card for an explicit user continuation.
		event.RecordReadinessAudit(a.svc.sink, readiness.audit(hostaudit.ReadinessErrored, false))
		a.pending.deliveryRecovery = true
		a.noteObligationsExplained()
		// The blocked turn is the one whose summary matters most — it is where
		// a rewritten check or an unverified mutation is still outstanding —
		// and it was the only turn that never reported one.
		a.emitTurnShadows(ctx, a.turn.turnInput, true)
		return false, &FinalReadinessError{Attempts: 1, Reason: readiness.reason, Missing: readiness.missingIDs(), Signature: readiness.progressSignature()}
```

</details>

**依据 26 · 源码核查**：[internal/frontend/acp/session.go:367-393](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/session.go#L367-L393)

缺验证仍协议end_turn并附专有paused/收据，取消或RPC失败另报。

<details>
<summary>查看原文（27行）</summary>

```text
	stop := StopEndTurn
	vendor := map[string]any{}
	if runErr != nil {
		var readinessErr *agent.FinalReadinessError
		switch {
		case runCtx.Err() != nil:
			stop = StopCancelled
		case errors.As(runErr, &readinessErr):
			outcome := ReasonixTurnOutcome{Kind: "paused", Reason: clipStatusText(readinessErr.Error(), 2_048)}
			sess.sink.send(readinessReceipt(outcome.Reason, readinessErr.Missing))
			vendor["turnOutcome"] = outcome
		default:
			return nil, &RPCError{
				Code:    ErrInternal,
				Message: clipStatusText(runErr.Error(), 2_048),
				Data:    TurnErrorData{Code: TurnFailed},
			}
		}
	}
	if sess.transcript != "" {
		vendor["transcriptPath"] = sess.transcript
	}
	res := SessionPromptResult{StopReason: stop}
	if len(vendor) > 0 {
		res.Meta = map[string]any{"reasonix.io": vendor}
	}
	return res, nil
```

</details>

**依据 27 · 源码核查**：[internal/runtime/agent/goal_run_boundary.go:36-43](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/goal_run_boundary.go#L36-L43)

grace实际配对拒绝所有未执行新调用后pause。

```text
func (a *Agent) stopUnexecutedBoundaryCalls(ctx context.Context, state *turnRuntime, calls []provider.ToolCall, usage *provider.Usage) (error, bool) {
	switch {
	case state.graceRound:
		a.pairUnexecutedGraceCalls(calls, "blocked: the tool-call round budget is exhausted; no more tools will run in this turn")
		return a.gracePause(ctx, state), true
	default:
		return nil, false
	}
```

**依据 28 · 源码核查**：[internal/session/control/turn_projection.go:170-176](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/turn_projection.go#L170-L176)

活动runWithRunner调用runner.Run，缺runner显式失败。

```text
func (c *Controller) runWithRunner(ctx context.Context, input string) error {
	if c.runner == nil {
		return ErrNoRunner
	}
	c.settleProjection()
	return c.runner.Run(ctx, input)
}
```

**依据 29 · 源码核查**：[internal/assembly/boot/build.go:467-475](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/assembly/boot/build.go#L467-L475)

boot创建executor与runner交controller。

```text
func (b *builder) controller() (*control.Controller, error) {
	t := &b.tools
	executor := b.executor()
	runner, label, err := t.roles.planner(b.opts, executor, b.model.entry.Model, b.prompt.memory.StaticContext(), t.caps.runtime)
	if err != nil {
		return nil, err
	}
	ctrlOpts := b.controllerOptions(runner, executor, label)
	ctrl := withWindowPosture(control.New(ctrlOpts), b.cfg, b.opts.StatsSource, b.sink)
```

**依据 30 · 源码核查**：[internal/assembly/boot/build.go:517-525](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/assembly/boot/build.go#L517-L525)

具体agent.New与预算配置。

```text
func (b *builder) executor() *agent.Agent {
	cfg, entry, t := b.cfg, b.model.entry, &b.tools
	triageProv, triageRef, triagePrice := resolveTriage(cfg, b.model.ref, b.proxy)
	ag := agent.New(b.execProv, t.reg, newObservedSession(b.prompt.prompt), agent.Options{
		MaxSteps:       t.maxSteps,
		MaxStepsKey:    b.opts.MaxStepsKey,
		Temperature:    cfg.Agent.Temperature,
		TaskBudget:     taskBudgetFromConfig(cfg),
		ProgressWatch:  control.ProgressWatchFromConfig(cfg),
```

**依据 31 · 源码核查**：[internal/assembly/boot/build.go:576-585](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/assembly/boot/build.go#L576-L585)

controller options实际绑定Runner与Executor。

<details>
<summary>查看原文（10行）</summary>

```text
func (b *builder) controllerOptions(runner agent.Runner, executor *agent.Agent, label string) control.Options {
	opts, cfg, root, entry, t := b.opts, b.cfg, b.root, b.model.entry, &b.tools
	specOptions := t.specOptions
	providerIdentity := ResolveProviderBuildIdentity(entry, b.proxy, nil)
	return control.Options{
		Observe:                        b.observeRun(),
		TaskBudget:                     taskBudgetFromConfig(cfg),
		GoalTokenBudget:                cfg.Agent.GoalTokenBudget,
		Runner:                         runner,
		Executor:                       executor,
```

</details>

**依据 32 · 源码核查**：[internal/assembly/boot/roles.go:44-57](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/assembly/boot/roles.go#L44-L57)

无独立planner/同模型等条件直接返回具体Agent作为runner。

<details>
<summary>查看原文（14行）</summary>

```text
func (w roleWiring) planner(opts Options, executor *agent.Agent, executorModel, staticContext string, capRuntime *usecap.MCPCapabilityRuntime) (agent.Runner, string, error) {
	pm := effectivePlannerModel(w.cfg, opts)
	if pm == "" {
		return executor, executorModel, nil
	}
	pe, ok := resolveOptionalEntry(w.resolver, w.cfg, pm)
	if !ok {
		slog.Warn("planner model is not a configured provider — planning disabled", "model", pm)
		report(w.sink, event.Event{Level: event.LevelWarn,
			Text: fmt.Sprintf("planner_model %q is not a configured provider — continuing with the executor alone", pm)})
		return executor, executorModel, nil
	}
	if pe.Model == executorModel && strings.TrimSpace(w.cfg.Agent.RoleEfforts["planner"]) == "" {
		return executor, executorModel, nil
```

</details>

#### 缺口

- 预算传播、所有provider计价和中断任务实际副作用未全验
  **影响**：轮后预算/重试/总结不是精确总费用硬限，也不能证明暂停可安全续办
  **进一步探讨**：隔离副本核多次流中断、写后取消、预算越线和缺验证退出的请求、账单、产物及停因。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限、ACP输入来源、取消和恢复有哪些边界？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

普通模型工具确有实际权限闸：execute_one调用permission.VerdictOf，拒绝时生成blocked结果而不进具体Execute。ACP创建session后EnableInteractiveApproval、绑定ctrl.Approve；ApprovalRequest事件会异步请求session/request_permission，只有selected且选中allow类option才回准许，RPC失败/取消默认false。DSH配置中的reject保护的是这类权限请求；allow则按协议自动答卡，不是人逐次确认。

nil Approver也不是所有操作一律放行。当前Gate.ask将它交给unattendedAsk：涉及扩写范围、网络放行、付费搜索、MCP登录及特定高风险安装主体等subjectRequiresHuman问题，无人答复就拒绝；其它Ask仍允许，显式Deny另先行。它是按主体和调用类型的规则，不是所有后台动作均禁，也不保证接了一个Approver对象就有真人在场。ACP的approval posture ceiling约束普通工具模式选择，不能把模式名直接等同OS隔离。

关键反证在ACP显式shell入口。sessionPrompt先把text block拼成原文本；resolveSlashPrompt对非“/”文本原样返回。runPrompt对trim后以“!”开头的输入直接ctrl.RunShell，普通文本才走Agent。RunShellWith只在composition明确不含bash时拒绝；所核执行分支用sandbox.Command(sandbox.Spec{}, sh, command)构建未沙箱shell，调用shellrun.RunForeground，并把事件标为IssuedByUser。这是给人类编辑器命令设计的快捷路径，但Issuer标签本身不能证明远端ACP文本来自真人；此分支没有进入模型工具的permission.VerdictOf/request_permission链。因此不能以宿主reject推所有ACP输入都被限制为只读，也不应把cwd当OS隔离边界。

另定向读了正式已研究Host的DSH固定提交22ddee3792402c3e70ec5f86a63c3e3e895a2f60的调用者，而非只凭Reasonix helper猜测：tool-subagent把args.prompt作为单一text block交startActivation；subagent manager startExternal传递spec.request，provider.start→startAcpRun；toAcpPrompt保留block.text，最终session/prompt原样传它。上述两份固定源码组合，在bash可用、子进程可启动且OS账号有相应权限的条件下，存在“模型委派文本被子端按用户shell解释”的静态信任边界。它不依赖先产生一张审批卡。没有运行验证；Reasonix bundle锁0.2.1-rc.2，而这份DSH provider声明0.2.1-rc.3，不能把跨版本源码组合写成当前默认可安装部署已被实证利用。真实发行组合、环境权限及宿主扩展拦截仍须核实；依赖与原件单独保留，不省略宿主版本。固定宿主原文：[模型任务入口](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/packages/subagent/tool-subagent/src/index.ts#L315-L330)、[ACP文本转换](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/packages/subagent/subagent-acp/src/run.ts#L258-L263)、[实际发请求](https://github.com/deepseek-ai/deepseek-harness/blob/22ddee3792402c3e70ec5f86a63c3e3e895a2f60/packages/subagent/subagent-acp/src/run.ts#L564-L568)。

取消与撤销也分开：ACP session/cancel调用sess.abort，prompt有独立cancelable context；取消后返回cancelled，工具结果可先配对保存。主模型stream有自己的child context及defer cancel，减少本地提前返回仍留provider读流，但不能撤销厂商已计费或工具已落地的外部动作。requestId级cancel_request只取消对应flight，不应从存在该helper推所有请求已接线或子进程全回收。本轮只确认会话取消活动路径，不承诺所有MCP/浏览器/子树都同步清零。

rewind有更实质的保守接线：Controller Prepare/Commit在turn正在跑时拒绝，Commit核sessionRevision再调checkpoint store；单文件恢复还要求plan可用、exclusive mutation barrier、恢复状态完整、工作区版本/活跃writer/当前文件未变，再写事务。预览后变化或旧plan会失败，可显式处理冲突；不是盲写旧内容。正面机制不应被缩成“只有回退按钮”，但README明确只覆盖编辑工具，不能追回shell、远端请求、通知或本轮未审的所有副作用，也不能据本轮抽核宣称多文件恢复完全原子。

#### 证据与依据

**依据 1 · 源码核查**：[internal/runtime/agent/execute_one.go:534-558](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/execute_one.go#L534-L558)

普通工具Gate阻止执行。

<details>
<summary>查看原文（25行）</summary>

```text
	} else if a.svc.gate != nil {
		v, err := permission.VerdictOf(a.originCtx(ctx, plan), a.svc.gate, plan.permName, gateArgs, plan.readOnly)
		if err != nil {
			return toolOutcome{
				output:    fmt.Sprintf("blocked: %s (%v)", v.Reason, err),
				blocked:   true,
				errMsg:    fmt.Sprintf("blocked: %v", err),
				execution: shellRefusal(plan.execTool, plan.execArgs, tool.ShellPhaseAuthorization),
			}, true
		}
		// permission.decision: the host verdict is computed first; the
		// extension ruling may override it in either direction (an allow
		// overriding a host deny is the full-trust contract and is audited).
		if blocked, early := a.interceptExtensionPermission(ctx, plan, &v.Allow); early {
			return blocked, true
		}
		if !v.Allow {
			return toolOutcome{
				output:      "blocked: " + v.Reason,
				blocked:     true,
				errMsg:      "blocked by permission policy",
				refusalCode: v.Code,
				execution:   shellRefusal(plan.execTool, plan.execArgs, tool.ShellPhaseAuthorization),
			}, true
		}
```

</details>

**依据 2 · 源码核查**：[internal/frontend/acp/session.go:104-112](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/session.go#L104-L112)

真正启用interactive approval并绑定Approve。

```text
	s.bindClientIO(&sessionParams, id)
	ctrl, err := s.factory.NewSession(ctx, sessionParams)
	if err != nil {
		return nil, newSessionError("session/new", err)
	}
	ctrl.EnableInteractiveApproval()
	ctrl.SetToolApprovalMode(startPosture)
	sink.bindApprove(ctrl.Approve)
	sink.bindAnswer(ctrl.AnswerQuestion)
```

**依据 3 · 源码核查**：[internal/frontend/acp/dispatch.go:235-240](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/dispatch.go#L235-L240)

活动审批事件进入RPC。

```text
	case event.ApprovalRequest:
		// The run loop is now blocked awaiting Approve(id, …). Do the
		// client round-trip off the emit goroutine so Emit returns at once
		// (the agent emits serially); the answer unblocks the loop.
		turnCtx := s.currentTurnContext()
		go s.requestPermission(turnCtx, e.Approval)
```

**依据 4 · 源码核查**：[internal/frontend/acp/dispatch.go:412-450](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/dispatch.go#L412-L450)

请求返回选项决定准许，失败默认false。

<details>
<summary>查看原文（39行）</summary>

```text
func (s *updateSink) requestPermission(ctx context.Context, a event.Approval) {
	if s.approve == nil {
		return
	}
	title := a.Tool
	if a.Subject != "" {
		title = a.Tool + " " + a.Subject
	}
	options := approvalOptions(a.Tool, a.Subject, a.Fresh, a.AllowsPersist)
	params := PermissionRequestParams{
		SessionID: s.sessionID,
		ToolCall: PermissionToolCall{
			ToolCallID: "gate-" + a.ID,
			Name:       a.Tool,
			Title:      title,
			Kind:       toolKindFor(a.Tool),
			Status:     "pending",
			RawInput:   rawJSON(string(a.RawInput)),
			Locations:  s.toolLocations(a.Tool, string(a.RawInput)),
			Meta:       s.permissionMeta(a),
		},
		Options: options,
	}

	allow, session, persist := false, false, false
	if raw, err := s.conn.Request(ctx, "session/request_permission", params); err == nil {
		var res PermissionRequestResult
		if json.Unmarshal(raw, &res) == nil && res.Outcome.Outcome == "selected" {
			switch PermissionOptionKind(res.Outcome.OptionID) {
			case OptAllowOnce:
				allow = true
			case OptAllowAlways:
				allow, session = true, true
			case optAllowPersist:
				allow, session, persist = true, true, true
			}
		}
	}
	s.approve(a.ID, allow, session, persist)
```

</details>

**依据 5 · 源码核查**：[internal/safety/permission/verdict.go:98-131](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/safety/permission/verdict.go#L98-L131)

ReadOnly/Deny/Ask及nil approver分流。

<details>
<summary>查看原文（34行）</summary>

```text
	if g.Policy.ReadOnly && !readOnly && !g.Policy.ExplicitlyDenies(toolName, args) {
		return Verdict{Reason: readOnlyRefusal, Code: RefusalReadOnly}, nil
	}
	decision := g.Policy.Decide(toolName, readOnly, args)
	ruleReason := ""
	if rule, ok := g.Policy.MatchedRule(toolName, decision, args); ok {
		ruleReason = fmt.Sprintf("Matched permission rule: %s %s", decision, rule)
	}
	if ruleReason == "" && programKeys != "" {
		ruleReason = "This git command reads a repository whose own configuration runs programs (" + programKeys + "), so it is not treated as a plain read."
		if decision == Allow && g.Policy.Mode != Allow {
			decision = Ask
		}
	}
	switch decision {
	case Deny:
		return g.denial(ruleReason), nil
	case Ask:
		return g.ask(ctx, toolName, args, ruleReason)
	default:
		if label := OriginFrom(ctx); label != "" && !readOnly && g.Policy.AskOnOrigin && g.Policy.allowedOnlyByMode(toolName, readOnly, args) {
			return g.ConfirmOrigin(ctx, toolName, args, label)
		}
		return Verdict{Allow: true}, nil
	}
}

func (g *Gate) ask(ctx context.Context, toolName string, args json.RawMessage, ruleReason string) (Verdict, error) {
	if g.Approver == nil {
		allow, reason, err := unattendedAsk(toolName, args)
		if !allow {
			return Verdict{Reason: reason, Code: RefusalUnattended}, err
		}
		return Verdict{Allow: true}, err
```

</details>

**依据 6 · 源码核查**：[internal/safety/permission/write_fence.go:28-57](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/safety/permission/write_fence.go#L28-L57)

nil approver仅特定主体需人类则拒绝，其它Ask允许。

<details>
<summary>查看原文（30行）</summary>

```text
// subjectSensitiveTools maps each tool whose authorization reads its subject to
// the question it asks of that subject. Membership is one declaration carrying
// three consequences, so none can arrive without the others: the decision
// returns to a person whatever the fallback says, an unattended session refuses
// rather than answering for them, and a grant must name the subject it covers.
var subjectSensitiveTools = map[string]func(subject string) bool{
	ExtendWritePaths:  func(string) bool { return true },
	NetworkEgress:     func(string) bool { return true },
	PaidSearch:        func(string) bool { return true },
	MCPSignIn:         func(string) bool { return true },
	installSourceTool: func(s string) bool { return strings.HasPrefix(s, selfExtendHumanRisk) },
}

// subjectScopedGrant reports a tool a session grant may not cover by name alone.
// A browser grant names its origin and a computer grant its application.
func subjectScopedGrant(toolName string) bool {
	_, ok := subjectSensitiveTools[canonicalRuleTool(toolName)]
	return ok || IsBrowserTool(toolName) || IsComputerTool(toolName)
}

// unattendedAsk answers an Ask with no approver attached. Autonomy is a
// statement about a posture with nobody watching; it is not permission to
// decide what only a person may. A question with nobody to answer it is a no —
// otherwise the posture answers for the absent person, and YOLO, built with no
// approver at all, granted every one of these silently.
func unattendedAsk(toolName string, args json.RawMessage) (bool, string, error) {
	if subjectRequiresHuman(toolName, Subject(args)) {
		return false, "this decision needs a person, and no approver is attached to this session", nil
	}
	return true, "", nil
```

</details>

**依据 7 · 源码核查**：[internal/frontend/acp/tool_approval_ceiling.go:40-56](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/tool_approval_ceiling.go#L40-L56)

模式ceiling与默认Ask。

<details>
<summary>查看原文（17行）</summary>

```text
func (s *service) postureCeiling() string {
	c, ok := s.factory.(PostureCeiling)
	if !ok {
		return ""
	}
	if v := strings.TrimSpace(c.PostureCeiling()); v != "" {
		return normalizeACPToolApprovalMode(v)
	}
	return ""
}

// startingPosture is where a new session opens: the ceiling when one is fixed.
func (s *service) startingPosture() string {
	if ceiling := s.postureCeiling(); ceiling != "" {
		return ceiling
	}
	return control.ToolApprovalAsk
```

</details>

**依据 8 · 源码核查**：[internal/frontend/acp/prompt_attachments.go:18-35](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/prompt_attachments.go#L18-L35)

ACP text原样保留。

<details>
<summary>查看原文（18行）</summary>

```text
func promptText(root string, blocks []ContentBlock) (string, error) {
	parts := make([]string, 0, len(blocks))
	for i, b := range blocks {
		part, err := blockText(root, b)
		if err != nil {
			return "", fmt.Errorf("prompt block %d (%s): %w", i, b.Type, err)
		}
		if part != "" {
			parts = append(parts, part)
		}
	}
	return strings.TrimSpace(strings.Join(parts, "\n\n")), nil
}

func blockText(root string, b ContentBlock) (string, error) {
	switch b.Type {
	case "text":
		return b.Text, nil
```

</details>

**依据 9 · 源码核查**：[internal/frontend/acp/service.go:1332-1336](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/service.go#L1332-L1336)

非slash不改写。

```text
func (s *service) resolveSlashPrompt(ctx context.Context, sess *acpSession, text string) (string, string) {
	line := strings.TrimSpace(text)
	if sess == nil || !strings.HasPrefix(line, "/") {
		return text, ""
	}
```

**依据 10 · 源码核查**：[internal/frontend/acp/shell_prompt.go:17-34](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/shell_prompt.go#L17-L34)

显式!命令不进入模型普通工具链。

<details>
<summary>查看原文（18行）</summary>

```text
func runPrompt(ctx context.Context, ctrl acpController, text, raw, invokedSkill string) error {
	cmd, ok := strings.CutPrefix(strings.TrimSpace(text), "!")
	if !ok {
		return ctrl.RunTurnWithRaw(ctx, text, raw, invokedSkill)
	}
	ctrl.RunShell(cmd)
	tick := time.NewTicker(shellPollInterval)
	defer tick.Stop()
	for ctrl.Running() {
		select {
		case <-ctx.Done():
			ctrl.Cancel()
			return ctx.Err()
		case <-tick.C:
		}
	}
	return nil
}
```

</details>

**依据 11 · 源码核查**：[internal/session/control/shell.go:228-243](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/shell.go#L228-L243)

composition有bash时以空sandbox spec构建命令。

<details>
<summary>查看原文（16行）</summary>

```text
func (c *Controller) RunShellWith(command string, opts ShellRun) {
	if binding := c.CompositionBinding(); binding != nil && !compositionAllowsTool(binding, "bash") {
		c.notice("shell is unavailable in this Agent composition")
		return
	}
	command = strings.TrimSpace(command)
	if command == "" {
		c.notice(i18n.M.ShellExecEmpty)
		return
	}
	c.runGuarded(func(ctx context.Context) error {
		sh := c.shell
		if sh.Path == "" {
			sh = sandbox.ResolveShell("", "", nil)
		}
		argv, _ := sandbox.Command(sandbox.Spec{}, sh, command) // false = unsandboxed (user invoked)
```

</details>

**依据 12 · 源码核查**：[internal/session/control/shell.go:253-279](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/shell.go#L253-L279)

标User并真实RunForeground，不以标签证明来源。

<details>
<summary>查看原文（27行）</summary>

```text
		c.sink.Emit(event.Event{
			Kind: event.ToolDispatch,
			Tool: event.Tool{
				ID:     id,
				Name:   "bash",
				Args:   fmt.Sprintf(`{"command":%q}`, command),
				Issuer: event.IssuedByUser,
				Execution: &event.ShellExecution{
					Kind: desc.Kind, Shell: desc.Shell, ShellVersion: desc.ShellVersion,
					Platform: desc.Platform, SupportsAndAnd: desc.SupportsAndAnd,
					State: tool.ShellStateRunning,
				},
			},
		})

		start := time.Now()
		res := shellrun.RunForeground(ctx, shellrun.Request{
			Argv:           argv,
			Dir:            c.workspaceRoot,
			Env:            shellrun.CommandEnv(ctx),
			Timeout:        shellTimeout,
			WaitDelay:      shellWaitDelay,
			CommandPreview: diagnosticPreview,
			ShellKind:      sh.Kind.String(),
			ShellPath:      sh.Path,
			Source:         "user_shell",
			Track:          true,
```

</details>

**依据 13 · 源码核查**：[internal/frontend/acp/session.go:680-687](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/session.go#L680-L687)

session/cancel真实调用abort。

```text
func (s *service) sessionCancel(_ context.Context, raw json.RawMessage) {
	var p SessionCancelParams
	if err := json.Unmarshal(raw, &p); err != nil {
		return
	}
	if sess := s.session(p.SessionID); sess != nil {
		sess.abort()
	}
```

**依据 14 · 源码核查**：[internal/session/control/rewind.go:108-140](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/rewind.go#L108-L140)

恢复预览受活动turn和checkpoint限制。

<details>
<summary>查看原文（33行）</summary>

```text
func (c *Controller) PrepareRewind(turn int, scope RewindScope) (checkpoint.RewindPlan, error) {
	if !c.checkpoints.enabled() || c.executor == nil {
		return checkpoint.RewindPlan{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if err := c.beginRotation(); err != nil {
		if errors.Is(err, errTurnRunningRotation) {
			return checkpoint.RewindPlan{}, c.rewindFail(fmt.Errorf("cannot rewind while a turn is running"))
		}
		return checkpoint.RewindPlan{}, c.rewindFail(err)
	}
	// Release rotation before file precheck I/O.
	c.endRotation()

	boundary, hasBound := c.checkpoints.boundary(turn)
	store := c.checkpoints.storeRef()
	if store == nil {
		return checkpoint.RewindPlan{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if obs := c.mutationObserver; obs != nil {
		store.SetActiveWriters(obs.ActiveWriters())
	}
	rev := atomic.LoadInt64(&c.sessionRevision)
	plan, err := store.PrepareRewind(turn, checkpoint.RewindScope(scope), rev, boundary, hasBound)
	if err != nil {
		return plan, c.rewindFail(err)
	}
	if scope == RewindBoth && !plan.CanConversation {
		plan.CanFiles = false
		if plan.DisabledReason == "" {
			plan.DisabledReason = "conversation boundary unavailable"
		}
	}
	return plan, nil
```

</details>

**依据 15 · 源码核查**：[internal/session/control/rewind.go:144-185](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/rewind.go#L144-L185)

提交再验sessionRevision，成功结果才通知。

<details>
<summary>查看原文（42行）</summary>

```text
func (c *Controller) CommitRewind(planID string) (checkpoint.RewindResult, error) {
	if !c.checkpoints.enabled() || c.executor == nil {
		return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if err := c.beginRotation(); err != nil {
		if errors.Is(err, errTurnRunningRotation) {
			return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("cannot rewind while a turn is running"))
		}
		return checkpoint.RewindResult{}, c.rewindFail(err)
	}
	defer c.endRotation()

	store := c.checkpoints.storeRef()
	if store == nil {
		return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if err := store.ValidatePlanSessionRevision(planID, atomic.LoadInt64(&c.sessionRevision)); err != nil {
		conflict := checkpoint.RewindConflict{Reason: checkpoint.ConflictStalePlan}
		return checkpoint.RewindResult{OK: false, Error: err.Error(), Conflicts: []checkpoint.RewindConflict{conflict}}, c.rewindFail(err)
	}

	forward, err := json.Marshal(c.executor.Session().Snapshot())
	if err != nil {
		return checkpoint.RewindResult{}, c.rewindFail(err)
	}

	result, err := store.CommitRewindWithForward(planID, forward, conversationApplier{c: c}, nil)
	if err != nil {
		return result, c.rewindFail(err)
	}
	if result.OK {
		if len(result.Written) > 0 || len(result.Deleted) > 0 {
			c.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelInfo,
				Text: fmt.Sprintf("rewound code — %d file(s) restored, %d removed", len(result.Written), len(result.Deleted))})
		}
		if result.ConversationOK {
			c.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelInfo,
				Text: "rewound conversation"})
		}
		atomic.AddInt64(&c.sessionRevision, 1)
	}
	return result, nil
```

</details>

**依据 16 · 源码核查**：[internal/state/checkpoint/file_revert.go:93-145](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/state/checkpoint/file_revert.go#L93-L145)

plan/barrier/undo状态和工作区重查。

<details>
<summary>查看原文（53行）</summary>

```text
func (s *Store) CommitFileRevert(planID string, resolution ConflictResolution) (RewindResult, error) {
	if s == nil {
		return RewindResult{}, fmt.Errorf("checkpoints unavailable")
	}
	pp, ok := s.takeFilePlan(planID)
	if !ok {
		err := errors.New("unknown or expired plan")
		return RewindResult{OK: false, Error: err.Error()}, err
	}
	if res, err := filePlanVerdict(pp.plan, resolution); res != nil {
		return *res, err
	}
	if !s.barrier.TryEnterExclusive() {
		err := errors.New("workspace mutation in progress")
		return RewindResult{OK: false, Error: err.Error(),
			Conflicts: []RewindConflict{{Path: pp.plan.Path, Reason: ConflictBusyWriter}}}, err
	}
	defer s.barrier.ExitExclusive()
	if err := s.requireUndoRecoveryComplete(); err != nil {
		return RewindResult{OK: false, Error: err.Error()}, err
	}
	if res, err := s.verifyWorkspaceUnchanged(pp); res != nil {
		return *res, err
	}
	rev, _, has := s.earliestRevisionFor(pp.plan.Path)
	if !has {
		err := errors.New("file is not session-owned")
		return RewindResult{OK: false, Error: err.Error()}, err
	}
	abs, err := safePath(s.root, rev.Path)
	if err != nil {
		return RewindResult{OK: false, Error: err.Error()}, err
	}
	tx := &TransactionManifest{
		SchemaVersion: SchemaV2,
		ID:            newID("tx"),
		WorkspaceRoot: s.root,
		State:         TxPrepared,
		Kind:          "file_revert",
		Scope:         RewindCode,
		Path:          rev.Path,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}
	target, err := s.fileRevertTarget(rev, abs, tx.ID)
	if err != nil {
		return RewindResult{OK: false, Error: err.Error()}, err
	}
	tx.Targets = []TransactionTarget{target}
	if err := s.persistTransaction(tx); err != nil {
		return RewindResult{OK: false, Error: err.Error()}, err
	}
	return s.commitTransaction(tx, nil, nil)
```

</details>

**依据 17 · 源码核查**：[internal/state/checkpoint/file_revert.go:181-192](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/state/checkpoint/file_revert.go#L181-L192)

并发writer/generation冲突。

<details>
<summary>查看原文（12行）</summary>

```text
// verifyWorkspaceUnchanged re-checks, under the barrier, what the preview
// measured: no background writer, the same workspace generation, the same file.
func (s *Store) verifyWorkspaceUnchanged(pp preparedPlan) (*RewindResult, error) {
	plan := pp.plan
	if conflicts := s.activeWriterConflicts(); len(conflicts) > 0 {
		err := errors.New("active background writer")
		return &RewindResult{OK: false, Error: err.Error(), Conflicts: conflicts}, err
	}
	if plan.WorkspaceToken != fmt.Sprintf("%d", s.barrier.Generation()) {
		err := errors.New("workspace changed since preview")
		return &RewindResult{OK: false, Error: err.Error(),
			Conflicts: []RewindConflict{{Path: plan.Path, Reason: ConflictStalePlan}}}, err
```

</details>

**依据 18 · 作者声明**：[README.md:74-74](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/README.md#L74-L74)

shell不在编辑rewind覆盖。

```text
- **Rewind.** A file is saved before it changes, so you can rewind by conversation turn without touching your git history. Only files its edit tools changed are covered, not what a shell command did.
```

#### 缺口

- DSH与Reasonix这两份固定源码未同版部署运行，全部composition/OS权限/拦截未全审
  **影响**：确认条件性的输入来源静态信任路径，不宣称默认部署已被利用；reject不能单独证明ACP只读
  **进一步探讨**：一次性OS副本无害核普通/显式shell文本、关闭bash composition、拒卡与取消；核真实进程/文件，不把Issuer标记当人类授权。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、发行、数据与实际使用流程怎样限定？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

先区分人工直接使用根工具和把它接到自动委派宿主。当前根源码是studio 2.x开发线，npm reasonix维护1.x；本轮没有验证任一安装包、签名或系统启动。Go源构建清单要求go 1.26.0、toolchain go1.26.10，桌面/前端和平台能力还有自己的构建/运行依赖；不能拿某个前端npm版本当整产品版本，也不把“本机可读源码”当普通用户可安装。当前DSH bundle 0.1.0锁定dsh/provider 0.2.1-rc.2，而定向复核的正式Host源码provider是0.2.1-rc.3，版本不等价。

模型由用户选择和付费；README明确模型服务接收读取内容。DSH文档要求Reasonix自己的home/.env中配置provider key、command在宿主机器可达，不能只用父env注入key；这些是作者声明的部署契约，本轮没有把整个凭据存储、所有日志/网络或扩展迁移全审成“数据已加密/绝不外发”。不同home/账号应分别核对，不能从启动成功推计费账号正确。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 与目标源码线一致的Reasonix发行/运行环境 | 根工具必需 | CLI/Studio/ACP入口 | 1.x npm不能替2.x固定行为，未核发行先不接真实仓库 |
| 可用模型服务或本地模型及可观察用量 | 决策必需 | 实际多轮工具选择 | 远端收上下文、费用独立承担，账号不明即停 |
| 独立副本与外部OS权限边界 | 本轮试用前提 | 控制文件/命令后果 | cwd、默认reject、rewind都不是完整隔离 |
| 明确工具审批、有效正上限和资源停止线 | 本轮试用前提 | 限定普通工具与预算范围 | 非正轮数/零预算轴不提供对应上界 |
| 同版DSH与subagent-acp、Reasonix命令/home | 仅DSH委派必需 | 真ACP子进程 | 本轮两源版本组合未部署验证；显式shell来源边界未解决前不启自动委派 |
| Checkpoint可用且恢复预览不冲突 | 需要文件恢复时 | 编辑工具范围的回退 | shell/外部动作另核，不覆盖任意副作用 |

#### 使用与异常步骤

| 阶段 | 执行者和动作 | 成功判据或失败处理 |
|---|---|---|
| 选线和账户 | 用户读回发行线、模型endpoint/home与计费身份 | 不是把1.x/2.x、bundle/provider版本混为同版 |
| 人工直用小样 | 在独立OS副本中以普通自然语言请求读代码，明确审批 | 实际代码出处/返回内容可核；不把“!”命令输入当模型任务 |
| 单次写入验证 | 经人明确批准可逆修改，观察工具和测试 | 核diff/真实命令/exit，readiness缺项保暂停，模型自述不算通过 |
| 故障与退出 | 取消后核真实文件、进程、请求和费用；预览恢复 | 旧plan/并发writer冲突先查，不盲覆盖；卸载/rewind不撤远端效果 |
| 可选DSH接入 | 另核精确版本、子home和输入来源策略 | 明确普通工具卡与显式shell两路径；未解决来源/外部隔离则保持关闭 |

工程上可借鉴的不是单个按钮：干净采样提交才执行工具、call/result配对、上下文重试冻结、主体范围授权、预览/提交时再验工作区版本，以及readiness缺项终态均有实际链路。它们组合后仍不构成所有外部副作用的事务或整产品安全审计。扩展可在普通模型入口input.receive处改写/阻止文本，源码确有拦截点；显式shell在该模型入口之前分流，不能只加一个模型提示或只核这处hook就声称修好了授权来源。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:66-74](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/README.md#L66-L74)

读取内容进入模型服务；编辑恢复范围。

```text
Reasonix is an open-source AI coding assistant. The program runs on your computer; the AI model is a service you configure, which receives what it reads. You describe a task in plain language; it reads code, edits files and runs commands and tests inside the project folder you choose, and shows you each step.

You pick the model: a DeepSeek preset is built in, any OpenAI-compatible service is one config entry, and you pay the model provider directly.

## What you get

- **Read, edit, run.** It reads code, edits files and runs tests and commands, all inside your project folder.
- **Permission levels.** Have it ask every time, or let everyday actions run on their own; your forbid rules always hold. To see the approach first, use plan mode: it starts work only once you approve.
- **Rewind.** A file is saved before it changes, so you can rewind by conversation turn without touching your git history. Only files its edit tools changed are covered, not what a shell command did.
```

**依据 2 · 作者声明**：[README.md:108-122](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/README.md#L108-L122)

不同发行线。

<details>
<summary>查看原文（15行）</summary>

```text
Reasonix ships on two lines. See the [version roadmap announcement](https://github.com/esengine/DeepSeek-Reasonix/discussions/10748) for the reasoning behind the split.

| Line | Branch | Status | Get it |
| --- | --- | --- | --- |
| **Reasonix 2.x** | `studio` (this branch) | Active development | [Studio releases](https://github.com/esengine/DeepSeek-Reasonix/releases?q=studio-v&expanded=true) |
| **Reasonix 1.x** | [`main-v2`](https://github.com/esengine/DeepSeek-Reasonix/tree/main-v2) | Maintenance / stable | `npm i -g reasonix` · [desktop download](https://reasonix.io/?download=desktop#start) |

- **Want something stable?** Stay on 1.x. It keeps receiving bug fixes,
  provider/API compatibility, updater and security fixes; its core architecture
  is no longer being extended.
- **Want the new architecture?** Use 2.x Reasonix Studio. It is still moving
  quickly; reports are welcome.

Valuable fixes, tests and behaviour from 1.x are reviewed one by one and ported
or reimplemented on 2.x where they fit the new architecture.
```

</details>

**依据 3 · 源码核查**：[go.mod:1-5](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/go.mod#L1-L5)

源构建Go及toolchain要求。

```text
module reasonix

go 1.26.0

toolchain go1.26.10
```

**依据 4 · 作者声明**：[docs/DSH.md:22-27](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/docs/DSH.md#L22-L27)

Reasonix home/key、可达命令与同版provider要求。

```text
## Preconditions

1. Reasonix MUST be installed on the machine that runs `dsh`, and its model provider MUST be set up there: run `reasonix setup` once.
2. `reasonix` MUST be reachable by the command you configure (an absolute path is the safest).
3. The provider key MUST live in Reasonix's own home (`<Reasonix home>/.env`, see [CONFIG_PATHS](./CONFIG_PATHS.md)). Reasonix does not read provider keys from environment variables, so the `env` block of the Harness row cannot supply one.
4. The provider package version MUST equal the `dsh` version (`dsh --version`). Name it exactly: the `latest` tag points at an old `0.0.1-rc.1` and `next` may resolve to an older pre-release, and `dsh` refuses both as incompatible.
```

**依据 5 · 作者声明**：[docs/DSH.md:62-77](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/docs/DSH.md#L62-L77)

bundle精确版本、启用与非工具shell伪委派。

<details>
<summary>查看原文（16行）</summary>

````text
The same two rows ship as a Harness bundle in this repository, `integrations/dsh-plugin`, so steps 1 and 2 can be one command. It is not on npm; `pnpm` installs the subdirectory through its `path:` selector (see [pnpm package sources](https://pnpm.io/package-sources)):

```sh
dsh plugin --profile <profile> add github:esengine/DeepSeek-Reasonix#path:/integrations/dsh-plugin
```

The bundle pins `@deepseek-ai/dsh-subagent-acp` and `dsh` to the same version (`0.2.1-rc.2` today) and uses `permission: reject`. Change the policy in your own `cordis.patch.yml`, never in the package.

## After installing: switch it on

An installed plugin starts **off**. Open its page in the DSH Web UI and turn its switch on.

- The switch and both components (the provider and the `reasonix` tool) must read Running.
- Turning the switch on in a running `dsh web` is enough: the next new session has the `reasonix` tool (observed on `dsh` 0.2.1-rc.2, 2026-10-18). Restart `dsh` only if it is still missing.
- While it is off the model has no `reasonix` tool and may run `reasonix -p` in its own shell instead.
- That looks like a delegation and is not one: there is no subagent, no `reasonix` tool call, and no permission policy applies.
````

</details>

**依据 6 · 作者声明**：[docs/DSH.md:98-113](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/docs/DSH.md#L98-L113)

作者给的自动权限部署语义。

<details>
<summary>查看原文（16行）</summary>

```text
| `command`, `args` | `subagent-acp` | What `dsh` spawns for every run. `['acp', '--model', '<name>']` selects the child model; `['acp', '--preset', 'delivery']` selects the execution setting. |
| `cwd` | `subagent-acp` | Child workspace. Omitted: the delegating session's working directory. |
| `permission` | `subagent-acp` | `reject` (default) or `allow`. See the next section. |
| `env` | `subagent-acp` | Extra child environment, layered over a credential-scrubbed copy of the parent's. Use it for `REASONIX_HOME` when the child should use a different home. |
| `maxDepth` | `tool-subagent` | MUST be `provider-managed`. |

## Permission policy

`dsh` never shows the child's permission cards to a person. The `permission` key answers every `session/request_permission` automatically:

| Policy | Effect on Reasonix |
| --- | --- |
| `reject` | `dsh` answers `cancelled`. Reasonix treats it as a refusal: the tool call fails with "blocked by permission policy", the model is told the call was declined, and the turn goes on. Writes and shell commands that need approval do not run. |
| `allow` | `dsh` selects the first `allow_once` or `allow_always` option of every request. Every approval card Reasonix raises is accepted without a person looking at it. |

Choosing `allow` MUST be a deliberate decision to let the Harness agent, and whoever steers it, run whatever Reasonix's tools can do in that workspace. It answers approval cards only; Reasonix's sandbox is configured separately in Reasonix.
```

</details>

**依据 7 · 作者声明**：[docs/DSH.md:127-134](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/docs/DSH.md#L127-L134)

新进程/父历史/回流限制。

```text
## Limits

1. One fresh `reasonix acp` process per delegation; nothing from the parent conversation crosses, only the prompt text and the workspace path.
2. The child accepts no follow-up messages.
3. Only message text crosses back. The child's reasoning, tool traffic and plans stay in its own session.
4. `dsh` advertises no filesystem or terminal client capability, so Reasonix reads and writes the workspace directly.
5. The child pays for its own context; its tokens do not enter the parent conversation.
6. An install without credentials fails `session/new` with the ACP "Authentication required" error (`-32000`), which `dsh` reports as a failed start.
```

**依据 8 · 源码核查**：[integrations/dsh-plugin/package.json:24-35](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/integrations/dsh-plugin/package.json#L24-L35)

锁定0.2.1-rc.2。

<details>
<summary>查看原文（12行）</summary>

```text
  "engines": {
    "dsh": "0.2.1-rc.2"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "@deepseek-ai/dsh-subagent-acp": "0.2.1-rc.2"
  },
  "private": true
```

</details>

**依据 9 · 源码核查**：[internal/session/control/turn_orchestrator.go:209-223](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/turn_orchestrator.go#L209-L223)

普通模型input.receive可拦截。

<details>
<summary>查看原文（15行）</summary>

```text
		input = c.compose(turn.input, turn.raw, !turn.synthetic)
	}
	input = c.imageRoutingPrefix(images) + input
	// input.receive: the composed text crosses the extension chain before it
	// enters the session (checkpoint, hooks, and the model all see the final
	// text). A block ruling aborts the turn with the redacted reason surfaced,
	// mirroring the PromptSubmit hook's abort path; a required-class extension
	// failure fails the turn.
	input, blocked, interceptErr := c.interceptInputReceive(ctx, input)
	if interceptErr != nil {
		return interceptErr
	}
	if blocked {
		return nil
	}
```

</details>

**依据 10 · 源码核查**：[internal/frontend/acp/shell_prompt.go:17-24](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/shell_prompt.go#L17-L24)

另路shell先行，不由模型输入hook推安全。

```text
func runPrompt(ctx context.Context, ctrl acpController, text, raw, invokedSkill string) error {
	cmd, ok := strings.CutPrefix(strings.TrimSpace(text), "!")
	if !ok {
		return ctrl.RunTurnWithRaw(ctx, text, raw, invokedSkill)
	}
	ctrl.RunShell(cmd)
	tick := time.NewTicker(shellPollInterval)
	defer tick.Stop()
```

**依据 11 · 源码核查**：[internal/session/control/shell.go:228-279](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/shell.go#L228-L279)

具体未沙箱命令执行入口。

<details>
<summary>查看原文（52行）</summary>

```text
func (c *Controller) RunShellWith(command string, opts ShellRun) {
	if binding := c.CompositionBinding(); binding != nil && !compositionAllowsTool(binding, "bash") {
		c.notice("shell is unavailable in this Agent composition")
		return
	}
	command = strings.TrimSpace(command)
	if command == "" {
		c.notice(i18n.M.ShellExecEmpty)
		return
	}
	c.runGuarded(func(ctx context.Context) error {
		sh := c.shell
		if sh.Path == "" {
			sh = sandbox.ResolveShell("", "", nil)
		}
		argv, _ := sandbox.Command(sandbox.Spec{}, sh, command) // false = unsandboxed (user invoked)

		preview := []rune(command)
		if len(preview) > 32 {
			preview = preview[:32]
		}
		id := "shell-" + string(preview)
		diagnosticPreview := shellCommandPreview(command)
		desc := shellrun.DescriptorFromShell(sh)

		c.sink.Emit(event.Event{
			Kind: event.ToolDispatch,
			Tool: event.Tool{
				ID:     id,
				Name:   "bash",
				Args:   fmt.Sprintf(`{"command":%q}`, command),
				Issuer: event.IssuedByUser,
				Execution: &event.ShellExecution{
					Kind: desc.Kind, Shell: desc.Shell, ShellVersion: desc.ShellVersion,
					Platform: desc.Platform, SupportsAndAnd: desc.SupportsAndAnd,
					State: tool.ShellStateRunning,
				},
			},
		})

		start := time.Now()
		res := shellrun.RunForeground(ctx, shellrun.Request{
			Argv:           argv,
			Dir:            c.workspaceRoot,
			Env:            shellrun.CommandEnv(ctx),
			Timeout:        shellTimeout,
			WaitDelay:      shellWaitDelay,
			CommandPreview: diagnosticPreview,
			ShellKind:      sh.Kind.String(),
			ShellPath:      sh.Path,
			Source:         "user_shell",
			Track:          true,
```

</details>

**依据 12 · 源码核查**：[internal/session/control/rewind.go:144-170](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/rewind.go#L144-L170)

恢复提交需版本和活动状态成立。

<details>
<summary>查看原文（27行）</summary>

```text
func (c *Controller) CommitRewind(planID string) (checkpoint.RewindResult, error) {
	if !c.checkpoints.enabled() || c.executor == nil {
		return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if err := c.beginRotation(); err != nil {
		if errors.Is(err, errTurnRunningRotation) {
			return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("cannot rewind while a turn is running"))
		}
		return checkpoint.RewindResult{}, c.rewindFail(err)
	}
	defer c.endRotation()

	store := c.checkpoints.storeRef()
	if store == nil {
		return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if err := store.ValidatePlanSessionRevision(planID, atomic.LoadInt64(&c.sessionRevision)); err != nil {
		conflict := checkpoint.RewindConflict{Reason: checkpoint.ConflictStalePlan}
		return checkpoint.RewindResult{OK: false, Error: err.Error(), Conflicts: []checkpoint.RewindConflict{conflict}}, c.rewindFail(err)
	}

	forward, err := json.Marshal(c.executor.Session().Snapshot())
	if err != nil {
		return checkpoint.RewindResult{}, c.rewindFail(err)
	}

	result, err := store.CommitRewindWithForward(planID, forward, conversationApplier{c: c}, nil)
```

</details>

#### 缺口

- 发行二进制/跨平台/凭据和日志生命周期未运行或全审
  **影响**：只能有外部隔离的人工小样，不能把源码版本/接线当可直接安装兼容
  **进一步探讨**：选精确同版发行，在一次性OS/临时额度/副本核启动、预算、审批、取消及恢复；自动ACP另修来源边界。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁值得付出全周期成本，如何试用和退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

根工具存在可控而有价值的人工直接试用路径：能验代码的开发者，在一次性OS用户或等效外部隔离、无敏感资料的仓库副本里，用普通自然语言做代码定位/评审，先只读，再逐次人工批准一次可逆修改及真实验证。不把外部Agent生成的“!”输入当已获人授权的命令，不把默认reject、项目cwd或rewind当全局防护。DSH自动委派先保持关闭，待输入来源信任边界、实际同版兼容与子进程权限独立核清；这与根工具的人工试用是不同采用范围。

试用前读回发行线、模型endpoint/home和计费身份、权限模式、有效正有限maxSteps或明确可观察的TaskBudget，另设可承受的人工时间、provider用量/现金和后台进程停止线。正轮数允许总结宽限轮与采样重试，Cost受价格完整性限制且轮后检查，不当厂商总账硬限；账户或使用量不可观察就不开始需要持续资源的任务。临时低额度凭据或本地模型也仍要核工具外发/本地资源，不将“无敏感资料”误解为不必管账户。

#### 全周期成本

| 阶段 | 现金与资源 | 人工与时间 | 已知条件与未知 |
|---|---|---|---|
| 首次 | 发行/模型服务或本地硬件、隔离环境成本未知 | 选1.x/2.x线、账户/home、OS权限及副本 | 未测安装兼容和配置工时；不拿Go源码可读当安装成功 |
| 持续 | 多轮/重试/总结tokens、命令与测试资源未知 | 审批、diff/结果验证、预算读回与费用监测 | 有预算/收据机制，不证明净节时或精确费用封顶 |
| 失败恢复 | 流失败/重复尝试及已发远端请求可能消费 | 核真实文件/进程、冲突和未验证结果，先查再重试 | rewind范围有限、取消非外部效果回滚，恢复工时未测 |
| 升级与退出 | 新版本迁移、备份及日志/数据留存成本未知 | 关闭自动委派、停任务/进程、撤临时凭据、保产物与记录 | 全迁移/删除及跨版本兼容未核；卸载不撤业务副作用 |

#### 效果与采用证据

| 效果项 | 固定源码支持 | 未证明的效果 |
|---|---|---|
| 自主编码动作 | 普通模型Stream→执行→tool result→下一Stream | 代表任务正确率、少返工和替人工能力 |
| 过程权限 | Gate/主体规则、ACP卡和明确拒绝结果 | 所有入口都由真人授权，尤其显式shell分流 |
| 停止/预算 | context、轮数/三轴预算、缺项暂停 | 总费用精确封顶、全部外部进程/请求已停 |
| 恢复 | 编辑文件预览、版本/并发重查和事务入口 | shell/网络副作用可逆或完整工作区原子恢复 |
| DSH集成 | 配置包与本轮宿主prompt/权限源接线 | 当前pin可直接匹配所核宿主、默认reject足以安全自动委派 |

达到人工阈值、实际输出错误、审批/计费身份不明、出现来源未明确的显式shell、越界路径、停止后未知进程/请求或恢复冲突时停止扩大权限和重复执行。保留diff、停因及用量，人工检查产物并从独立副本回退，撤临时凭据后再退出。若人工直用的复核/配置负担不低于现编码Agent或手工，保持原办法；不为展示“成功委派”把reject改allow或放弃外部隔离。

#### 证据与依据

**依据 1 · 源码核查**：[internal/runtime/agent/run_loop.go:756-766](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_loop.go#L756-L766)

预算在结果后核，正轮数有宽限。

<details>
<summary>查看原文（11行）</summary>

```text
	// Spend is checked before rounds: it is the axis a runaway is actually
	// reported in, so on the turns both would catch it should be the one named.
	if axis, detail := a.exceededTaskBudget(ctx, state); axis != "" {
		a.armFinalizationRound(state, landCause{kind: "task_budget", axis: axis, detail: detail})
		return true, nil
	}
	if state.runMaxSteps > 0 && step+1 >= state.runMaxSteps {
		a.armFinalizationRound(state, landCause{kind: "max_steps", detail: fmt.Sprintf(
			"budget (%s=%d) exhausted: one grace round to finalize", state.runMaxStepsKey, state.runMaxSteps)})
	}
	return true, nil
```

</details>

**依据 2 · 源码核查**：[internal/runtime/agent/run_budget.go:96-122](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_budget.go#L96-L122)

正轴才启用且按实际可用用量。

<details>
<summary>查看原文（27行）</summary>

```text
func (b *runBudget) exceeded(limit TaskBudget) (axis, detail string) {
	if limit.Tokens > 0 {
		if used := b.tokens; used >= uint64(limit.Tokens) {
			return "token", fmt.Sprintf("task used %d tokens, reaching the %d budget", used, limit.Tokens)
		}
	}
	if limit.Cost > 0 && b.cost.pricedRounds > 0 && b.cost.amount() >= max(pricing.Amount(1), pricing.NewAmountFromFloat(limit.Cost)) {
		return "cost", fmt.Sprintf("task spend %.4f reached the %.4f budget", b.cost.amount().Float64(), limit.Cost)
	}
	if limit.Wall > 0 {
		if elapsed := b.elapsed(); elapsed >= limit.Wall {
			return "time", fmt.Sprintf("task ran %s, past the %s budget",
				elapsed.Round(time.Second), limit.Wall)
		}
	}
	return "", ""
}

// taskBudgetLimit resolves this turn's bound: a host-injected budget wins over
// the configured one, which is how an unattended loop gets a ceiling while
// ordinary chat keeps none.
func (a *Agent) taskBudgetLimit(ctx context.Context) TaskBudget {
	if b, ok := taskBudgetFromContext(ctx); ok {
		return b
	}
	return a.task.budget.limit
}
```

</details>

**依据 3 · 源码核查**：[internal/runtime/agent/run_cost.go:16-48](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_cost.go#L16-L48)

完整价格的条件。

<details>
<summary>查看原文（33行）</summary>

```text
	if quote != nil && quote.Original.Currency != "" {
		c.currency = pricing.NormalizeCurrency(quote.Original.Currency)
	}
	if usage == nil || usage.Estimated || quote == nil || pricing.NormalizeCurrency(quote.Original.Currency) == "" || len(quote.OriginalTotals) > 0 {
		c.incomplete = true
		return
	}
	amount, err := pricing.NewAmountFromString(quote.Original.Amount)
	if err != nil || amount < 0 {
		c.incomplete = true
		return
	}
	q := pricing.NormalizeQuote(*quote)
	// An explicitly reported zero retains its known zero subtotal even though
	// the quote layer classifies a no-token record as incomplete usage.
	zero := usage.PromptTokens == 0 && usage.CompletionTokens == 0 && usage.TotalTokens == 0 &&
		usage.CacheHitTokens == 0 && usage.CacheMissTokens == 0 && usage.CacheWriteTokens == 0 && usage.CacheWriteBilledTokens == 0
	if !q.CostComplete && !(zero && q.IncompleteReason == "missing_price_or_usage" && amount == 0) {
		c.incomplete = true
		return
	}
	if c.amounts == nil {
		c.amounts = map[string]pricing.Amount{}
	}
	c.amounts[c.currency] = c.amounts[c.currency].Add(amount)
	c.pricedRounds++
}

func (c *runCost) amount() pricing.Amount { return c.amounts[c.currency] }

func (c *runCost) complete() bool {
	return !c.incomplete && c.pricedRounds > 0 && len(c.amounts) == 1
}
```

</details>

**依据 4 · 源码核查**：[internal/frontend/acp/shell_prompt.go:17-24](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/shell_prompt.go#L17-L24)

自动输入来源需单独控制。

```text
func runPrompt(ctx context.Context, ctrl acpController, text, raw, invokedSkill string) error {
	cmd, ok := strings.CutPrefix(strings.TrimSpace(text), "!")
	if !ok {
		return ctrl.RunTurnWithRaw(ctx, text, raw, invokedSkill)
	}
	ctrl.RunShell(cmd)
	tick := time.NewTicker(shellPollInterval)
	defer tick.Stop()
```

**依据 5 · 源码核查**：[internal/session/control/shell.go:228-279](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/shell.go#L228-L279)

不能以reject/项目cwd代替外部隔离。

<details>
<summary>查看原文（52行）</summary>

```text
func (c *Controller) RunShellWith(command string, opts ShellRun) {
	if binding := c.CompositionBinding(); binding != nil && !compositionAllowsTool(binding, "bash") {
		c.notice("shell is unavailable in this Agent composition")
		return
	}
	command = strings.TrimSpace(command)
	if command == "" {
		c.notice(i18n.M.ShellExecEmpty)
		return
	}
	c.runGuarded(func(ctx context.Context) error {
		sh := c.shell
		if sh.Path == "" {
			sh = sandbox.ResolveShell("", "", nil)
		}
		argv, _ := sandbox.Command(sandbox.Spec{}, sh, command) // false = unsandboxed (user invoked)

		preview := []rune(command)
		if len(preview) > 32 {
			preview = preview[:32]
		}
		id := "shell-" + string(preview)
		diagnosticPreview := shellCommandPreview(command)
		desc := shellrun.DescriptorFromShell(sh)

		c.sink.Emit(event.Event{
			Kind: event.ToolDispatch,
			Tool: event.Tool{
				ID:     id,
				Name:   "bash",
				Args:   fmt.Sprintf(`{"command":%q}`, command),
				Issuer: event.IssuedByUser,
				Execution: &event.ShellExecution{
					Kind: desc.Kind, Shell: desc.Shell, ShellVersion: desc.ShellVersion,
					Platform: desc.Platform, SupportsAndAnd: desc.SupportsAndAnd,
					State: tool.ShellStateRunning,
				},
			},
		})

		start := time.Now()
		res := shellrun.RunForeground(ctx, shellrun.Request{
			Argv:           argv,
			Dir:            c.workspaceRoot,
			Env:            shellrun.CommandEnv(ctx),
			Timeout:        shellTimeout,
			WaitDelay:      shellWaitDelay,
			CommandPreview: diagnosticPreview,
			ShellKind:      sh.Kind.String(),
			ShellPath:      sh.Path,
			Source:         "user_shell",
			Track:          true,
```

</details>

**依据 6 · 源码核查**：[internal/frontend/acp/dispatch.go:436-450](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/dispatch.go#L436-L450)

审批答复默认false、allow必须selected。

<details>
<summary>查看原文（15行）</summary>

```text
	allow, session, persist := false, false, false
	if raw, err := s.conn.Request(ctx, "session/request_permission", params); err == nil {
		var res PermissionRequestResult
		if json.Unmarshal(raw, &res) == nil && res.Outcome.Outcome == "selected" {
			switch PermissionOptionKind(res.Outcome.OptionID) {
			case OptAllowOnce:
				allow = true
			case OptAllowAlways:
				allow, session = true, true
			case optAllowPersist:
				allow, session, persist = true, true, true
			}
		}
	}
	s.approve(a.ID, allow, session, persist)
```

</details>

**依据 7 · 源码核查**：[internal/session/control/rewind.go:144-185](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/rewind.go#L144-L185)

恢复可拒绝，不等外部回滚。

<details>
<summary>查看原文（42行）</summary>

```text
func (c *Controller) CommitRewind(planID string) (checkpoint.RewindResult, error) {
	if !c.checkpoints.enabled() || c.executor == nil {
		return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if err := c.beginRotation(); err != nil {
		if errors.Is(err, errTurnRunningRotation) {
			return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("cannot rewind while a turn is running"))
		}
		return checkpoint.RewindResult{}, c.rewindFail(err)
	}
	defer c.endRotation()

	store := c.checkpoints.storeRef()
	if store == nil {
		return checkpoint.RewindResult{}, c.rewindFail(fmt.Errorf("checkpoints unavailable"))
	}
	if err := store.ValidatePlanSessionRevision(planID, atomic.LoadInt64(&c.sessionRevision)); err != nil {
		conflict := checkpoint.RewindConflict{Reason: checkpoint.ConflictStalePlan}
		return checkpoint.RewindResult{OK: false, Error: err.Error(), Conflicts: []checkpoint.RewindConflict{conflict}}, c.rewindFail(err)
	}

	forward, err := json.Marshal(c.executor.Session().Snapshot())
	if err != nil {
		return checkpoint.RewindResult{}, c.rewindFail(err)
	}

	result, err := store.CommitRewindWithForward(planID, forward, conversationApplier{c: c}, nil)
	if err != nil {
		return result, c.rewindFail(err)
	}
	if result.OK {
		if len(result.Written) > 0 || len(result.Deleted) > 0 {
			c.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelInfo,
				Text: fmt.Sprintf("rewound code — %d file(s) restored, %d removed", len(result.Written), len(result.Deleted))})
		}
		if result.ConversationOK {
			c.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelInfo,
				Text: "rewound conversation"})
		}
		atomic.AddInt64(&c.sessionRevision, 1)
	}
	return result, nil
```

</details>

**依据 8 · 作者声明**：[README.md:66-74](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/README.md#L66-L74)

模型费用和内容、工具恢复。

```text
Reasonix is an open-source AI coding assistant. The program runs on your computer; the AI model is a service you configure, which receives what it reads. You describe a task in plain language; it reads code, edits files and runs commands and tests inside the project folder you choose, and shows you each step.

You pick the model: a DeepSeek preset is built in, any OpenAI-compatible service is one config entry, and you pay the model provider directly.

## What you get

- **Read, edit, run.** It reads code, edits files and runs tests and commands, all inside your project folder.
- **Permission levels.** Have it ask every time, or let everyday actions run on their own; your forbid rules always hold. To see the approach first, use plan mode: it starts work only once you approve.
- **Rewind.** A file is saved before it changes, so you can rewind by conversation turn without touching your git history. Only files its edit tools changed are covered, not what a shell command did.
```

**依据 9 · 作者声明**：[docs/DSH.md:104-134](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/docs/DSH.md#L104-L134)

自动卡/新进程/父可见结果边界。

<details>
<summary>查看原文（31行）</summary>

```text
## Permission policy

`dsh` never shows the child's permission cards to a person. The `permission` key answers every `session/request_permission` automatically:

| Policy | Effect on Reasonix |
| --- | --- |
| `reject` | `dsh` answers `cancelled`. Reasonix treats it as a refusal: the tool call fails with "blocked by permission policy", the model is told the call was declined, and the turn goes on. Writes and shell commands that need approval do not run. |
| `allow` | `dsh` selects the first `allow_once` or `allow_always` option of every request. Every approval card Reasonix raises is accepted without a person looking at it. |

Choosing `allow` MUST be a deliberate decision to let the Harness agent, and whoever steers it, run whatever Reasonix's tools can do in that workspace. It answers approval cards only; Reasonix's sandbox is configured separately in Reasonix.

1. Use `reject` for read-only research and review tasks.
2. Use `allow` only for a task you would approve wholesale, in a workspace you can discard or restore, and set `cwd` to that workspace.

## What the parent sees

| Event | Parent receives |
| --- | --- |
| Child answers | The child's final message text, as the closing message of a finished background subagent. |
| Child turn pauses as unverified (files written, no verification command ran) | The same final text, ending in a host-written `[paused] Not verified, …` line. The turn itself ends normally. |
| Child turn fails (model endpoint down, provider refusal) | A failed subagent with category `transport`. `dsh` does not put the child's error message into the parent model's view. |
| Parent cancels | The child is sent `session/cancel`, the turn ends as `cancelled`, and the process is reaped. |

## Limits

1. One fresh `reasonix acp` process per delegation; nothing from the parent conversation crosses, only the prompt text and the workspace path.
2. The child accepts no follow-up messages.
3. Only message text crosses back. The child's reasoning, tool traffic and plans stay in its own session.
4. `dsh` advertises no filesystem or terminal client capability, so Reasonix reads and writes the workspace directly.
5. The child pays for its own context; its tokens do not enter the parent conversation.
6. An install without credentials fails `session/new` with the ACP "Authentication required" error (`-32000`), which `dsh` reports as a failed start.
```

</details>

#### 缺口

- 合格率、费用/净人工及恢复时间没有同条件对照
  **影响**：支持根工具外部隔离的人工直接试用；不能持续采用或把DSH自动接入当已验安全
  **进一步探讨**：比较聊天手工/现Agent/Reasonix人工小样的错漏、验证、审批、费用和恢复；无收益/不可观察即退原办法。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪个生产方向有相对现机制的新量，如何推翻？

**研究主题**：新假设与验证

#### 完整回答

待验证方向是把自动委派输入与人类显式命令分开授权的ACP入口适配，而不是再造通用多Agent客户端。Reasonix已经有Gate、主体授权、审批事件、工具执行记录、readiness审计与恢复预览；不能拿“现Agent没有权限或完成证据”立需求。新量来自Q03两份固定源码的信任分流：模型的子任务文本被宿主保留，子端却可以按用户快捷shell解释，普通工具卡策略没有覆盖这段来源转换。

最小方案先做上游边界修正/宿主拦截试验：自动委派只走普通prompt路径；显式命令须单独的、可核人类授权入口，不能靠消息前缀或Issuer标签推来源。仅加“不要执行shell”的模型提示不是强制边界；宿主仅过滤“!”也只解决当前已知语法，需保留协议/版本条件，不能承诺覆盖未来所有扩展命令。授权来源收据只记录谁授权哪个实际目标/动作，不把它当OS隔离或外部副作用可撤销。

最小对照采用同版可复核组合、一次性OS副本和无害任务，比较现默认reject、宿主前置拒绝/分流、关闭bash composition及外部OS隔离四种配置。覆盖普通文本、显式命令样式、前后空白、合法人类命令、审批取消与任务中断，测自动输入意外进入user_shell的次数、漏拦/误拦、实际文件/进程、授权可追溯性和额外人工。若简单禁用快捷入口/上游修正即可且不会损坏必要工作，不成立独立生产插件，优先合并小补丁；若新适配仍分不清来源或接入成本超过现工具，则否定。没有真实用户持续需求和对照结果，不计当前贡献或收益分。

#### 证据与依据

**依据 1 · 源码核查**：[internal/frontend/acp/session.go:324-353](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/session.go#L324-L353)

模型/远端接收的text进入分流。

<details>
<summary>查看原文（30行）</summary>

```text
	text, err := promptText(sess.cwd, p.Prompt)
	if err != nil {
		return nil, &RPCError{Code: ErrInvalidParams, Message: "session/prompt: " + err.Error()}
	}
	if text == "" {
		return nil, &RPCError{Code: ErrInvalidParams, Message: "session/prompt: empty prompt"}
	}
	rawText := text
	text, invokedSkill := s.resolveSlashPrompt(ctx, sess, text)

	runCtx, cancel, ok := sess.begin(ctx)
	if !ok {
		return nil, &RPCError{Code: ErrInvalidRequest, Message: "session/prompt: session already has an active prompt"}
	}
	if sess.status == nil {
		sess.status = newStatusTelemetry()
	}
	sess.status.beginTurn()
	s.publishStatus(sess, "phase")
	sess.sink.setTurnContext(runCtx)
	if sess.takeGoalDraftMode() {
		sess.currentCtrl().SetGoal(text)
		sess.saveMetaIfPresent()
	}
	defer func() {
		sess.sink.clearTurnContext()
		s.finishTurn(ctx, sess)
		cancel()
	}()
	runErr := drainACPInbox(runCtx, sess.ctrl, runPrompt(runCtx, sess.ctrl, text, rawText, invokedSkill))
```

</details>

**依据 2 · 源码核查**：[internal/frontend/acp/service.go:1332-1336](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/service.go#L1332-L1336)

非slash原样。

```text
func (s *service) resolveSlashPrompt(ctx context.Context, sess *acpSession, text string) (string, string) {
	line := strings.TrimSpace(text)
	if sess == nil || !strings.HasPrefix(line, "/") {
		return text, ""
	}
```

**依据 3 · 源码核查**：[internal/frontend/acp/shell_prompt.go:17-24](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/shell_prompt.go#L17-L24)

来源与人类命令边界。

```text
func runPrompt(ctx context.Context, ctrl acpController, text, raw, invokedSkill string) error {
	cmd, ok := strings.CutPrefix(strings.TrimSpace(text), "!")
	if !ok {
		return ctrl.RunTurnWithRaw(ctx, text, raw, invokedSkill)
	}
	ctrl.RunShell(cmd)
	tick := time.NewTicker(shellPollInterval)
	defer tick.Stop()
```

**依据 4 · 源码核查**：[internal/session/control/shell.go:228-279](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/session/control/shell.go#L228-L279)

实际User标记和未沙箱执行。

<details>
<summary>查看原文（52行）</summary>

```text
func (c *Controller) RunShellWith(command string, opts ShellRun) {
	if binding := c.CompositionBinding(); binding != nil && !compositionAllowsTool(binding, "bash") {
		c.notice("shell is unavailable in this Agent composition")
		return
	}
	command = strings.TrimSpace(command)
	if command == "" {
		c.notice(i18n.M.ShellExecEmpty)
		return
	}
	c.runGuarded(func(ctx context.Context) error {
		sh := c.shell
		if sh.Path == "" {
			sh = sandbox.ResolveShell("", "", nil)
		}
		argv, _ := sandbox.Command(sandbox.Spec{}, sh, command) // false = unsandboxed (user invoked)

		preview := []rune(command)
		if len(preview) > 32 {
			preview = preview[:32]
		}
		id := "shell-" + string(preview)
		diagnosticPreview := shellCommandPreview(command)
		desc := shellrun.DescriptorFromShell(sh)

		c.sink.Emit(event.Event{
			Kind: event.ToolDispatch,
			Tool: event.Tool{
				ID:     id,
				Name:   "bash",
				Args:   fmt.Sprintf(`{"command":%q}`, command),
				Issuer: event.IssuedByUser,
				Execution: &event.ShellExecution{
					Kind: desc.Kind, Shell: desc.Shell, ShellVersion: desc.ShellVersion,
					Platform: desc.Platform, SupportsAndAnd: desc.SupportsAndAnd,
					State: tool.ShellStateRunning,
				},
			},
		})

		start := time.Now()
		res := shellrun.RunForeground(ctx, shellrun.Request{
			Argv:           argv,
			Dir:            c.workspaceRoot,
			Env:            shellrun.CommandEnv(ctx),
			Timeout:        shellTimeout,
			WaitDelay:      shellWaitDelay,
			CommandPreview: diagnosticPreview,
			ShellKind:      sh.Kind.String(),
			ShellPath:      sh.Path,
			Source:         "user_shell",
			Track:          true,
```

</details>

**依据 5 · 源码核查**：[internal/frontend/acp/dispatch.go:412-450](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/frontend/acp/dispatch.go#L412-L450)

已有审批机制，不能假设缺失。

<details>
<summary>查看原文（39行）</summary>

```text
func (s *updateSink) requestPermission(ctx context.Context, a event.Approval) {
	if s.approve == nil {
		return
	}
	title := a.Tool
	if a.Subject != "" {
		title = a.Tool + " " + a.Subject
	}
	options := approvalOptions(a.Tool, a.Subject, a.Fresh, a.AllowsPersist)
	params := PermissionRequestParams{
		SessionID: s.sessionID,
		ToolCall: PermissionToolCall{
			ToolCallID: "gate-" + a.ID,
			Name:       a.Tool,
			Title:      title,
			Kind:       toolKindFor(a.Tool),
			Status:     "pending",
			RawInput:   rawJSON(string(a.RawInput)),
			Locations:  s.toolLocations(a.Tool, string(a.RawInput)),
			Meta:       s.permissionMeta(a),
		},
		Options: options,
	}

	allow, session, persist := false, false, false
	if raw, err := s.conn.Request(ctx, "session/request_permission", params); err == nil {
		var res PermissionRequestResult
		if json.Unmarshal(raw, &res) == nil && res.Outcome.Outcome == "selected" {
			switch PermissionOptionKind(res.Outcome.OptionID) {
			case OptAllowOnce:
				allow = true
			case OptAllowAlways:
				allow, session = true, true
			case optAllowPersist:
				allow, session, persist = true, true, true
			}
		}
	}
	s.approve(a.ID, allow, session, persist)
```

</details>

**依据 6 · 源码核查**：[internal/safety/permission/write_fence.go:28-57](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/safety/permission/write_fence.go#L28-L57)

已有主体敏感授权。

<details>
<summary>查看原文（30行）</summary>

```text
// subjectSensitiveTools maps each tool whose authorization reads its subject to
// the question it asks of that subject. Membership is one declaration carrying
// three consequences, so none can arrive without the others: the decision
// returns to a person whatever the fallback says, an unattended session refuses
// rather than answering for them, and a grant must name the subject it covers.
var subjectSensitiveTools = map[string]func(subject string) bool{
	ExtendWritePaths:  func(string) bool { return true },
	NetworkEgress:     func(string) bool { return true },
	PaidSearch:        func(string) bool { return true },
	MCPSignIn:         func(string) bool { return true },
	installSourceTool: func(s string) bool { return strings.HasPrefix(s, selfExtendHumanRisk) },
}

// subjectScopedGrant reports a tool a session grant may not cover by name alone.
// A browser grant names its origin and a computer grant its application.
func subjectScopedGrant(toolName string) bool {
	_, ok := subjectSensitiveTools[canonicalRuleTool(toolName)]
	return ok || IsBrowserTool(toolName) || IsComputerTool(toolName)
}

// unattendedAsk answers an Ask with no approver attached. Autonomy is a
// statement about a posture with nobody watching; it is not permission to
// decide what only a person may. A question with nobody to answer it is a no —
// otherwise the posture answers for the absent person, and YOLO, built with no
// approver at all, granted every one of these silently.
func unattendedAsk(toolName string, args json.RawMessage) (bool, string, error) {
	if subjectRequiresHuman(toolName, Subject(args)) {
		return false, "this decision needs a person, and no approver is attached to this session", nil
	}
	return true, "", nil
```

</details>

**依据 7 · 源码核查**：[internal/runtime/agent/run_loop.go:581-617](https://github.com/esengine/DeepSeek-Reasonix/blob/8a1fda41a7fd62654fc8113391f620c57c3ad51d/internal/runtime/agent/run_loop.go#L581-L617)

已有readiness机制，新方向不是重复trace。

<details>
<summary>查看原文（37行）</summary>

```text
func (a *Agent) handleFinalResponse(ctx context.Context, state *turnRuntime, text, reasoning string, usage *provider.Usage) (cont bool, err error) {
	// A captured criterion is owed until it has run. The run costs a build, so
	// it happens where the turn asks whether it may stop, not per tool call.
	a.evaluateBaselineCriteriaOnce(ctx)
	readiness := a.finalReadinessCheckFor()
	a.turn.lastReadiness = &readiness
	if state.graceRound && (readiness.reason != "" || !hasVisibleFinalAnswer(text)) {
		return false, a.gracePause(ctx, state)
	}
	if state.graceRound && (state.landCause.kind == "task_budget" || !state.runLimitHostOwned) {
		// Explicit max_steps and spend budgets are user-selected boundaries.
		// Preserve the summary, then return a resumable pause so Goal does not
		// immediately open another Run and silently bypass the chosen limit.
		return false, a.gracePause(ctx, state)
	}
	// An executor that has not acted yet gets its one in-turn nudge before the
	// gate ends the run: what it owes is still something this turn can supply.
	if state.executorHandoff && !state.usedAnyTool && state.handoffNudges < maxExecutorHandoffNudges && a.shouldNudgeExecutorHandoff() {
		state.handoffNudges++
		a.svc.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelInfo, Code: event.NoticeCodeExecutorHandoff, Text: executorHandoffNoticeText(), Detail: "executor answered without taking any action; nudging it to use its tools"})
		a.sess.conversation.Add(provider.Message{Role: provider.RoleUser, Content: a.withTurnPreferences(executorHandoffRetryMessage()), HostAuthored: true})
		return true, nil
	}
	if readiness.reason != "" {
		// Delivery no longer retries readiness with hidden model messages: the
		// run ends immediately with the missing requirements, and the host owns
		// what happens next. In Goal mode the FSM auto-continues under budget
		// with the missing list as the next turn; plain Delivery turns surface
		// the recovery card for an explicit user continuation.
		event.RecordReadinessAudit(a.svc.sink, readiness.audit(hostaudit.ReadinessErrored, false))
		a.pending.deliveryRecovery = true
		a.noteObligationsExplained()
		// The blocked turn is the one whose summary matters most — it is where
		// a rewritten check or an unverified mutation is still outstanding —
		// and it was the only turn that never reported one.
		a.emitTurnShadows(ctx, a.turn.turnInput, true)
		return false, &FinalReadinessError{Attempts: 1, Reason: readiness.reason, Missing: readiness.missingIDs(), Signature: readiness.progressSignature()}
```

</details>

#### 缺口

- 输入来源适配未实现，同版实况、误拦与真实需求未知
  **影响**：只能得到可证伪修正方向，不能给新插件已有效或已有功能加分
  **进一步探讨**：隔离对照默认reject/宿主分流/禁bash/OS隔离；简单补丁够用或负担更大即否定独立产品。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
