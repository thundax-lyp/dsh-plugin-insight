# DeepSeek Reasonix

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a8fe200](https://github.com/esengine/DeepSeek-Reasonix/tree/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f)

<!-- BEGIN META -->
[![GitHub ★ 36,014](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C014&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/esengine/DeepSeek-Reasonix)
<!-- END META -->

> **功能**：提供终端、桌面、浏览器和编辑器入口的开源编码助手，支持模型驱动的代码修改。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示实际模型、工具、配对结果和多入口的集成，相比人工复制建议可改变操作流程；不证明算法原创或实测省时。

> **主要限制**：[Q03](#research-q03) 表明普通 Gate 不覆盖显式 shell 分支，本轮 DSH caller 与 Reasonix 配置锁定版本不同；自动委派前必须确认来源、能力检查和实际双方版本。

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
  - [Q01 · 根工具和 DSH 配置包分别是什么？](#detail-section-11)
  - [Q02 · 普通模型轮如何采样、执行并继续？](#detail-section-12)
  - [Q03 · 显式 shell 与普通模型工具如何分流和授权？](#detail-section-13)
  - [Q04 · 预算与 rewind 覆盖到哪里？](#detail-section-14)
  - [Q05 · 采用需要哪些环境与边界？](#detail-section-15)
  - [Q06 · 区分委派与人类输入是否可以改善授权？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能审代码的开发者在可恢复项目中描述任务，由编码助手读文件、修改和运行验证；仍须人工验收。

以聊天建议加人工编辑、现有 IDE 和编码 Agent 为参照；未做同条件效果对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 编码 Agent | 采样并调用工具完成仓库任务 | 需模型服务，实际结果须人工验收 |
| ACP 接入 | 供兼容客户端调用 | 输入来源和版本需核实 |
| 文件 rewind | 预览并恢复受覆盖的编辑 | 不撤销 shell 或外部动作 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 模型服务及凭据 | 模型任务需要 | 生成操作与回答 | 调用失败，代码内容可能发送给服务 |
| 可恢复工作副本和 OS 限制 | 有副作用任务建议 | 控制文件与命令影响 | rewind 不撤外部动作 |
| DSH 与 ACP provider | DSH 委派需要 | 承载子 Agent 协议 | 版本不匹配或来源策略不明时不能假定可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户建立隔离副本并核对模型配置 | 能恢复且不含敏感信息 |
| 执行 | 用户提交有明确验收的小任务 | 观察操作与预算；来源不明即停止 |
| 验收 | 用户独立检查修改与运行结果 | 未就绪或验证失败不得视为完成 |
| 恢复 | 用户审阅 rewind 范围并核实外部副作用 | 无法确认时从备份恢复或人工处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型与隔离资源未知 | 配置、备份及限制，耗时未知 | 模型可接收代码 |
| 持续使用 | 模型、重试和工具成本未知 | 审查、验证与审批 | 轮数不等于费用硬上限 |
| 失败恢复 | 备份及重试资源未知 | 核对文件与外部动作 | rewind 不覆盖 shell 副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 编码循环 | 采样、工具结果和会话回流有源码接线 | 同任务合格率与节时 |
| 授权与恢复 | 普通 Gate 与 rewind 预览、提交存在 | 自动委派全部输入的授权及外部副作用恢复 |

> **思考**：[Q03](#research-q03) 表明普通 Gate 不覆盖显式 shell 分支，本轮 DSH caller 与 Reasonix 配置锁定版本不同；自动委派前必须确认来源、能力检查和实际双方版本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示实际模型、工具、配对结果和多入口的集成，相比人工复制建议可改变操作流程；不证明算法原创或实测省时。

[Q02](#research-q02) 的清洁采样提交与按 ID 配对工具结果有明确接线；[Q03](#research-q03) 的不同输入分支要求调用者保留来源，不能将一种 Gate 外推到所有入口。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 表明普通 Gate 不覆盖显式 shell 分支，本轮 DSH caller 与 Reasonix 配置锁定版本不同；自动委派前必须确认来源、能力检查和实际双方版本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议能审代码的开发者在低权限隔离副本试一项可验证任务，暂不启自动委派；来源或停止后状态不明即退出并回原 IDE。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根工具与固定源码路径已检查；跨宿主版本关系是条件推断，任务效果和未来方案未验证。

- 已检查：作者 README、包清单、源码路径 README.md、integrations/dsh-plugin/package.json、integrations/dsh-plugin/cordis.patch.yml、internal/frontend/acp/session.go、internal/frontend/acp/shell_prompt.go、internal/session/control/shell.go、internal/runtime/agent/agent.go、internal/runtime/agent/run_loop.go、internal/runtime/agent/sampling_request.go、internal/runtime/agent/execute_one.go、internal/runtime/agent/run_budget.go、internal/session/control/rewind.go、internal/frontend/acp/prompt_attachments.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向检查固定根仓库的 ACP、Agent 循环、权限、预算和 rewind，并复核本轮 DSH ce7073 caller；旧 22ddee 样本仅作历史对照。未执行目标、模型请求或宿主安装，未审计全部工具、沙箱、网络与进程树。
- 下一步：固定 Reasonix 和 DSH provider 的实际版本，在隔离环境对照普通 prompt、! 输入、拒绝权限与取消；记录副作用、模型费用、结果及人工复核。

**分析版本**

- **仓库**：[esengine/DeepSeek-Reasonix](https://github.com/esengine/DeepSeek-Reasonix)
- **版本号**：未声明（[固定提交 a8fe200](https://github.com/esengine/DeepSeek-Reasonix/tree/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出区分人类直输和委派输入的未验证授权适配；若简单禁用 bash 与隔离已满足条件，增加协议不值得。

固定 Reasonix 和 DSH provider 的实际版本，在隔离环境对照普通 prompt、! 输入、拒绝权限与取消；记录副作用、模型费用、结果及人工复核。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 400 | 38251 | — | — | 472262 |
| .js | source | 64 | 6267 | 5011 | 834 | — |
| .js | test | 23 | 2842 | 2404 | 247 | — |
| .mjs | test | 29 | 7905 | 7109 | 257 | — |
| .tsx | source | 403 | 46889 | 40690 | 3949 | — |
| .ts | source | 480 | 48694 | 39027 | 6188 | — |
| .mjs | source | 208 | 20948 | 17646 | 2273 | — |
| .cjs | source | 3 | 301 | 291 | 4 | — |
| .jsx | source | 1 | 24 | 22 | 0 | — |
| .ts | test | 229 | 18493 | 15319 | 1263 | — |
| .tsx | test | 617 | 67773 | 60137 | 1908 | — |
| .md | example | 30 | 1789 | — | — | 10765 |

</details>

**活跃度**

[![Issue 未关闭 591](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=591&color=737b86&logo=github)](https://github.com/esengine/DeepSeek-Reasonix/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1,166](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1%2C166&color=737b86&logo=github)](https://github.com/esengine/DeepSeek-Reasonix/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 767](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=767&color=737b86&logo=github)](https://github.com/esengine/DeepSeek-Reasonix/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根编码工具的模型工具循环、ACP 输入授权、预算与恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根工具和 DSH 配置包分别是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

固定 README.md:64-74 将 Reasonix 描述为本机运行的编码 Agent，模型是用户配置的服务，能接收读取内容；其工具可编辑和运行命令。README.md:106-119 把 studio 2.x 开发线和 npm 1.x 维护线区分。根项是独立工具，不是 DSH 原生插件。integrations/dsh-plugin/package.json:1-5、24-35 是 0.1.0 私有配置包并固定 DSH/provider 0.2.1-rc.2；cordis.patch.yml:1-14 通过已有 ACP provider 执行 reasonix acp，permission 为 reject。它是集成接线，不能把配置包版本当根工具版本或证明外部版本组合可运行。相对仅聊天给建议，实际工具循环可在仓库执行；相对其他编码 Agent 的效果、合格率、成本及人工节时未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:64-74](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/README.md#L64-L74)

作者说明编码任务和模型数据流。

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

**依据 2 · 作者声明**：[README.md:106-119](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/README.md#L106-L119)

作者区分发行线。

<details>
<summary>查看原文（14行）</summary>

```text
## Versions

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
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-plugin/package.json:1-5](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/integrations/dsh-plugin/package.json#L1-L5)

配置包身份。

```text
{
  "name": "dsh-plugin-reasonix",
  "version": "0.1.0",
  "description": "Use Reasonix as a subagent in DeepSeek Harness (dsh) through its ACP provider. Configuration only, no code.",
  "homepage": "https://reasonix.io",
```

**依据 4 · 源码核查**：[integrations/dsh-plugin/package.json:24-35](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/integrations/dsh-plugin/package.json#L24-L35)

限定宿主与 provider 版本。

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

**依据 5 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:1-14](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/integrations/dsh-plugin/cordis.patch.yml#L1-L14)

ACP 命令与权限配置。

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

#### 缺口

- 未有同条件任务与部署验证
  **影响**：不证明相对其他编码 Agent 优势或可运行
  **进一步探讨**：相同模型、项目副本比较准确率、人工与成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 普通模型轮如何采样、执行并继续？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

固定 Git blob internal/frontend/acp/session.go:334-353 将 ACP prompt 送 runPrompt；shell_prompt.go:17-22 把普通文本交给 RunTurnWithRaw。internal/runtime/agent/run_loop.go:263-267 的循环调用 295 行采样，325-337 行仅在清洁终态提交 assistant 消息及工具调用；697-707 行执行 batch 并为每个工具按 call ID 构造结果消息。循环和结果写回支持“模型选择工具—执行—再决策”的实现，不证明每个工具返回正确或任务通过验收。session.go:367-393 对最终就绪检查错误使用协议 end_turn，同时附 reasonix.io 的 paused 结果；消费方只看协议终止不能推成已完成。尚未在目标版本执行模型任务及验证完整所有工具。

#### 证据与依据

**依据 1 · 源码核查**：[internal/frontend/acp/session.go:334-353](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/frontend/acp/session.go#L334-L353)

ACP 调用 runPrompt。

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

**依据 2 · 源码核查**：[internal/frontend/acp/shell_prompt.go:13-22](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/frontend/acp/shell_prompt.go#L13-L22)

普通输入进入 controller。

<details>
<summary>查看原文（10行）</summary>

```text
// runPrompt runs one prompt: a `!` line is the user's own shell command, run
// as typed and streamed back as a tool call before the model answers it;
// anything else is a model turn.
// The editor is a frontend in the kernel's process, so it holds that grant.
func runPrompt(ctx context.Context, ctrl acpController, text, raw, invokedSkill string) error {
	cmd, ok := strings.CutPrefix(strings.TrimSpace(text), "!")
	if !ok {
		return ctrl.RunTurnWithRaw(ctx, text, raw, invokedSkill)
	}
	ctrl.RunShell(cmd)
```

</details>

**依据 3 · 源码核查**：[internal/runtime/agent/agent.go:900-911](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/agent.go#L900-L911)

Agent.Run 进入循环。

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

**依据 4 · 源码核查**：[internal/runtime/agent/run_loop.go:263-267](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/run_loop.go#L263-L267)

循环条件。

```text
// runToolLoop owns the main tool-round budget and dispatches each streamed
// assistant turn into final-response or tool-round handling.
func (a *Agent) runToolLoop(ctx context.Context, state *turnRuntime) error {
	ctx = a.withAgentContext(ctx)
	for step := 0; state.runMaxSteps <= 0 || step < state.runMaxSteps || state.graceRound || state.recoveryGraceRound; step++ {
```

**依据 5 · 源码核查**：[internal/runtime/agent/run_loop.go:289-310](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/run_loop.go#L289-L310)

采样与失败边界。

<details>
<summary>查看原文（22行）</summary>

```text
		contentReasons := a.settleRewritesBeforeSampling()

		// Prefix shape is captured once before sampling and frozen for the
		// whole attempt lifecycle — stream retries must not rewrite session
		// history mid-round, so the shape stays stable across body replays.
		authority := a.plan().State() // before sampling: a mid-round move cannot admit this
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

**依据 6 · 源码核查**：[internal/runtime/agent/run_loop.go:319-337](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/run_loop.go#L319-L337)

清洁终态后提交。

<details>
<summary>查看原文（19行）</summary>

```text
		boundary := classifyResponseBoundary(usage, calls)
		calls = a.prepareCallBatch(boundary.committed)
		if msg, ok := finishReasonMessage(usage); ok {
			a.svc.sink.Emit(event.Event{Kind: event.Notice, Level: event.LevelWarn, Text: msg, Detail: boundary.noticeDetail()})
		}

		// Commit boundary: only a clean terminal attempt reaches here.
		// Keep reasoning_content on the assistant turn for display and session
		// archive. Most OpenAI-compatible backends do not replay it; providers
		// with an explicit round-trip contract retain the raw provider text.
		workMs, committed := state.workDurationMs(), a.callsToCommit(streamed, calls)
		a.sess.conversation.Add(provider.Message{
			Role:               provider.RoleAssistant,
			Content:            text,
			ReasoningContent:   reasoning,
			ReasoningSignature: signature,
			ReasoningID:        streamed.reasoningID,
			ReasoningStatus:    streamed.reasoningStatus,
			ToolCalls:          committed,
```

</details>

**依据 7 · 源码核查**：[internal/runtime/agent/run_loop.go:351-374](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/run_loop.go#L351-L374)

结果后继续或停止。

<details>
<summary>查看原文（24行）</summary>

```text
		if len(calls) == 0 {
			if a.recordTruncationFact(boundary) {
				// The truncated tail was the whole batch: nothing ran and no
				// answer was finished, so the host fact is this round's result.
				continue
			}
			cont, ferr := a.handleFinalResponse(ctx, state, text, reasoning, usage)
			if !cont {
				return ferr
			}
			continue
		}

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
```

</details>

**依据 8 · 源码核查**：[internal/runtime/agent/run_loop.go:695-707](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/run_loop.go#L695-L707)

执行 batch 与配对结果。

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

**依据 9 · 源码核查**：[internal/runtime/agent/run_loop.go:725-737](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/run_loop.go#L725-L737)

结果写会话及取消。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 10 · 源码核查**：[internal/runtime/agent/sampling_request.go:30-35](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/sampling_request.go#L30-L35)

调用 provider 流。

```text
func (a *Agent) streamProviderRequest(ctx context.Context, req provider.Request) (<-chan provider.Chunk, error) {
	ch, err := a.svc.prov.Stream(ctx, req)
	if err == nil {
		a.window().rememberSummaryPrefix(req)
	}
	return ch, err
```

**依据 11 · 源码核查**：[internal/runtime/agent/sampling_request.go:116-140](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/sampling_request.go#L116-L140)

从会话准备下一次请求。

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

**依据 12 · 源码核查**：[internal/frontend/acp/session.go:367-393](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/frontend/acp/session.go#L367-L393)

未就绪时协议终止和专有 paused 信号。

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

#### 缺口

- 所有工具及真实任务未执行
  **影响**：源码循环不证明业务验收
  **进一步探讨**：在隔离环境验证选择、失败、取消、继续和任务结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 显式 shell 与普通模型工具如何分流和授权？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

internal/frontend/acp/shell_prompt.go:13-22 对去空白后以 ! 开头的文本直接走 ctrl.RunShell，其余进入模型轮；internal/session/control/shell.go:218-243 对该路径按用户显式命令执行且构造无 OS sandbox 的命令，229-231 仍会检查 composition 是否允许 bash。普通模型工具的 internal/runtime/agent/execute_one.go:520-558 对常规路径调用权限 Gate，拒绝时返回 blocked；MCP 则有独立身份授权路径，不能笼统说全部工具走同一 Gate。

本轮 DSH 固定提交 ce7073d51254c26cd63b22a60835b8f948deb447 的源码中，tool-subagent/src/index.ts:314-329 将 args.prompt 作为文本放入 request 并启动 activation；经 subagent/src/index.ts:271-285、manager.ts:483-501 与 850-866、subagent/src/index.ts:212-216 和 ACP provider index.ts:92-119 传递至 run.ts:258-263、564-568 的 session/prompt。Reasonix internal/frontend/acp/session.go:311-353 经 prompt_attachments.go:13-35 保留文本，再由 shell_prompt.go 分流；DSH run.ts:430-450 的 reject 只回答子进程发出的权限请求。以上仅支持条件推断：若双方实际兼容接通、满足 provider 能力及父会话检查、bash 未禁用且委派文本以 ! 开头，可能进入显式 shell 而不经过普通模型工具 Gate；未运行或复现，不能当作默认部署漏洞。当前宿主源码 provider 为 0.2.2-alpha.2，历史 22ddee3792402c3e70ec5f86a63c3e3e895a2f60 样本为 0.2.1-rc.3，Reasonix 配置锁 0.2.1-rc.2；三个版本不得混同，也未证兼容。历史材料 DEPENDENCY-DSH-EXCERPTS.json 留作对照，当前源码摘录见 DEPENDENCY-DSH-CURRENT.json。

#### 证据与依据

**依据 1 · 源码核查**：[internal/frontend/acp/shell_prompt.go:13-22](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/frontend/acp/shell_prompt.go#L13-L22)

前缀分流。

<details>
<summary>查看原文（10行）</summary>

```text
// runPrompt runs one prompt: a `!` line is the user's own shell command, run
// as typed and streamed back as a tool call before the model answers it;
// anything else is a model turn.
// The editor is a frontend in the kernel's process, so it holds that grant.
func runPrompt(ctx context.Context, ctrl acpController, text, raw, invokedSkill string) error {
	cmd, ok := strings.CutPrefix(strings.TrimSpace(text), "!")
	if !ok {
		return ctrl.RunTurnWithRaw(ctx, text, raw, invokedSkill)
	}
	ctrl.RunShell(cmd)
```

</details>

**依据 2 · 源码核查**：[internal/session/control/shell.go:218-243](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/session/control/shell.go#L218-L243)

用户 shell 的 composition 检查和无 sandbox 执行。

<details>
<summary>查看原文（26行）</summary>

```text
// RunShell executes a shell command directly (bypassing the model) and streams
// the output as ToolDispatch/ToolProgress/ToolResult events. It uses the same
// bash-tool infrastructure (shell resolution, timeout) and shares the runGuarded
// lock with model turns — only one can run at a time. User-invoked "!" commands
// run without the OS sandbox (the user typed the command explicitly).
func (c *Controller) RunShell(command string) {
	c.RunShellWith(command, ShellRun{})
}

// RunShellWith is RunShell with how the command is followed up spelled out.
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

**依据 3 · 源码核查**：[internal/runtime/agent/execute_one.go:520-558](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/execute_one.go#L520-L558)

普通工具 Gate 与 MCP 独立路径。

<details>
<summary>查看原文（39行）</summary>

```text
	// (mcp_connect__*) skip ordinary Ask/Auto/dontAsk gates. Only explicit deny
	// and live authorization apply — first connect of an installed server must
	// not re-prompt under headless or partial-auto policies.
	gateArgs := tool.PermissionArgs(ctx, plan.execTool, plan.permArgs)
	if isInstalledMCPTool(plan.execTool) || isMCPLifecycleConnectTarget(plan.execTool) {
		if !tool.IsMCPServerAuthorized(plan.execTool) {
			return toolOutcome{
				output:  "blocked: this project MCP server identity has not been authorized; approve the server from a parent session and retry",
				blocked: true,
				errMsg:  "blocked: MCP server identity is not authorized",
			}, true
		}
		if outcome, blocked := a.mcpFastPathRuling(ctx, plan, gateArgs); blocked {
			return outcome, true
		}
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
```

</details>

**依据 4 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:1-14](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/integrations/dsh-plugin/cordis.patch.yml#L1-L14)

集成配置 reject 与 provider。

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

**依据 5 · 源码核查**：[internal/frontend/acp/prompt_attachments.go:13-35](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/frontend/acp/prompt_attachments.go#L13-L35)

ACP 文本块经 blockText 保留并拼接。

<details>
<summary>查看原文（23行）</summary>

```text

// promptText turns a prompt's blocks into the text of one turn. Bytes a block
// carries are stored under root as attachments and referenced by "@path", the
// form every other frontend hands a turn, so the turn resolves them the same
// way. Audio is not advertised and is ignored.
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

#### 缺口

- 当前宿主 provider 为 0.2.2-alpha.2，配置包固定 0.2.1-rc.2；未同版复现
  **影响**：静态条件推断不能作为实际兼容组合或默认部署实证
  **进一步探讨**：固定双方实际安装版本，在隔离宿主验证来源、能力检查和以 ! 开头的输入。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 预算与 rewind 覆盖到哪里？

**研究主题**：缺陷与关键质疑、效果与总成本、工程质量与复用

#### 完整回答

internal/runtime/agent/run_loop.go:263-267 在 runMaxSteps 非正数时不施加步数上限，也允许宽限和恢复轮；run_budget.go:13-36 和 93-109 将负预算归零并仅检查正 token、价格和时间上限，其中价格比较要求存在可定价轮次。故预算可约束部分已观察使用，不等于所有请求、无价用量和外部工具费用的精确硬上限。internal/session/control/rewind.go:107-140 先准备计划并检查当前运行状态，143-170 提交前重验会话版本；README.md:72-74 说明仅覆盖编辑工具修改的文件，shell 副作用不在此范围。没有对崩溃、多进程、外部服务或所有 checkpoint 分支做运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[internal/runtime/agent/run_loop.go:263-267](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/run_loop.go#L263-L267)

非正步数不设上限并允许宽限轮。

```text
// runToolLoop owns the main tool-round budget and dispatches each streamed
// assistant turn into final-response or tool-round handling.
func (a *Agent) runToolLoop(ctx context.Context, state *turnRuntime) error {
	ctx = a.withAgentContext(ctx)
	for step := 0; state.runMaxSteps <= 0 || step < state.runMaxSteps || state.graceRound || state.recoveryGraceRound; step++ {
```

**依据 2 · 源码核查**：[internal/runtime/agent/run_budget.go:13-36](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/run_budget.go#L13-L36)

三轴及归一化。

<details>
<summary>查看原文（24行）</summary>

```text
// TaskBudget bounds one task on the axes its failures are reported in, and
// every axis ships off: stopping a task is the user's call. Tokens is the one
// that generalizes — a slow expensive loop accumulates them and so does a fast
// empty one, where wall clock catches only the first and money is not portable
// across models.
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

**依据 3 · 源码核查**：[internal/runtime/agent/run_budget.go:93-109](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/run_budget.go#L93-L109)

正预算和计价条件。

<details>
<summary>查看原文（17行）</summary>

```text
// exceeded names the first axis the task has spent past, or "" while inside
// the budget. Known priced spend is a lower bound even when other rounds lack
// usage or prices; unknown spend cannot erase a proven crossing.
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
```

</details>

**依据 4 · 源码核查**：[internal/runtime/agent/run_loop.go:753-764](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/runtime/agent/run_loop.go#L753-L764)

工具轮后预算检查与总结轮。

<details>
<summary>查看原文（12行）</summary>

```text
	// The prompt only grows from here; compact before the next turn so it
	// stays within the model's window.

	// Spend is checked before rounds: it is the axis a runaway is actually
	// reported in, so on the turns both would catch it should be the one named.
	if axis, detail := a.exceededTaskBudget(ctx, state); axis != "" {
		a.armFinalizationRound(state, landCause{kind: "task_budget", axis: axis, detail: detail})
		return true, nil
	}
	if state.runMaxSteps > 0 && step+1 >= state.runMaxSteps {
		a.armFinalizationRound(state, landCause{kind: "max_steps", detail: fmt.Sprintf(
			"budget (%s=%d) exhausted: one grace round to finalize", state.runMaxStepsKey, state.runMaxSteps)})
```

</details>

**依据 5 · 源码核查**：[internal/session/control/rewind.go:107-140](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/session/control/rewind.go#L107-L140)

准备恢复并检查运行状态。

<details>
<summary>查看原文（34行）</summary>

```text
// PrepareRewind validates that a rewind can proceed without mutating state.
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

**依据 6 · 源码核查**：[internal/session/control/rewind.go:143-170](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/session/control/rewind.go#L143-L170)

提交前重验版本。

<details>
<summary>查看原文（28行）</summary>

```text
// CommitRewind executes a prepared plan under rotation gate + mutation barrier.
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

**依据 7 · 作者声明**：[README.md:70-74](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/README.md#L70-L74)

作者说明 shell 副作用不覆盖。

```text
## What you get

- **Read, edit, run.** It reads code, edits files and runs tests and commands, all inside your project folder.
- **Permission levels.** Have it ask every time, or let everyday actions run on their own; your forbid rules always hold. To see the approach first, use plan mode: it starts work only once you approve.
- **Rewind.** A file is saved before it changes, so you can rewind by conversation turn without touching your git history. Only files its edit tools changed are covered, not what a shell command did.
```

#### 缺口

- 未跑崩溃恢复、未审计所有工具与计费
  **影响**：不能保证总费用硬封顶或撤销外部副作用
  **进一步探讨**：隔离环境核对有无价格、取消和外部动作的恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用需要哪些环境与边界？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

用户需要受控的工作副本、模型服务与凭据、可检查的代码和验证命令；README.md:64-68 明示模型服务接收程序读取内容并由用户向供应商付费。集成 DSH 另需独立 reasonix 命令、ACP provider 与其配置相容，包内固定版本不证明其他宿主发行版本。对能审代码的开发者，可先在隔离 OS 环境、无敏感数据的可丢弃副本运行一项可验证小任务；先不启自动委派，检查资源预算和变更，再由人运行独立验收。若来源、资源或停止后状态不明应退出并回到原 IDE。模型费、人工审批、测试、恢复与维护时间均未知；停进程或 rewind 不撤销已经发生的 shell 外部副作用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:64-68](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/README.md#L64-L68)

作者说明模型数据外发与付费。

```text
## What it is

Reasonix is an open-source AI coding assistant. The program runs on your computer; the AI model is a service you configure, which receives what it reads. You describe a task in plain language; it reads code, edits files and runs commands and tests inside the project folder you choose, and shows you each step.

You pick the model: a DeepSeek preset is built in, any OpenAI-compatible service is one config entry, and you pay the model provider directly.
```

**依据 2 · 源码核查**：[integrations/dsh-plugin/package.json:24-35](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/integrations/dsh-plugin/package.json#L24-L35)

集成精确版本声明。

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

**依据 3 · 源码核查**：[internal/session/control/shell.go:218-243](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/session/control/shell.go#L218-L243)

用户 shell 路径。

<details>
<summary>查看原文（26行）</summary>

```text
// RunShell executes a shell command directly (bypassing the model) and streams
// the output as ToolDispatch/ToolProgress/ToolResult events. It uses the same
// bash-tool infrastructure (shell resolution, timeout) and shares the runGuarded
// lock with model turns — only one can run at a time. User-invoked "!" commands
// run without the OS sandbox (the user typed the command explicitly).
func (c *Controller) RunShell(command string) {
	c.RunShellWith(command, ShellRun{})
}

// RunShellWith is RunShell with how the command is followed up spelled out.
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

**依据 4 · 作者声明**：[README.md:72-74](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/README.md#L72-L74)

作者说明文件恢复范围。

```text
- **Read, edit, run.** It reads code, edits files and runs tests and commands, all inside your project folder.
- **Permission levels.** Have it ask every time, or let everyday actions run on their own; your forbid rules always hold. To see the approach first, use plan mode: it starts work only once you approve.
- **Rewind.** A file is saved before it changes, so you can rewind by conversation turn without touching your git history. Only files its edit tools changed are covered, not what a shell command did.
```

#### 缺口

- 模型成本、人工审查和恢复工作量未知
  **影响**：无法证明净节时或资源可控
  **进一步探讨**：使用低权限隔离副本及可观察额度对照真实任务。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 区分委派与人类输入是否可以改善授权？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

基于 Q03 的 ACP 文本与显式 shell 分流，可提出未验证假设：将协议连接方的委派输入和经验证的人类直输建立不同身份，禁止前者直接进入显式 shell，或要求宿主先进行独立授权。相对现有 reject 回答权限请求，这是在路径入口保留来源；依赖协议可信身份与双方改造。应在隔离环境对照当前拒绝策略、前置分流、禁用 bash 和 OS 限制，记录误授权、误拦截、人工负担；若现有简单配置足以提供相同保证或身份无法可信传递，不必增加新协议。当前没有同版集成复现和效果实验。

#### 证据与依据

**依据 1 · 源码核查**：[internal/frontend/acp/shell_prompt.go:13-22](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/frontend/acp/shell_prompt.go#L13-L22)

文本前缀分支。

<details>
<summary>查看原文（10行）</summary>

```text
// runPrompt runs one prompt: a `!` line is the user's own shell command, run
// as typed and streamed back as a tool call before the model answers it;
// anything else is a model turn.
// The editor is a frontend in the kernel's process, so it holds that grant.
func runPrompt(ctx context.Context, ctrl acpController, text, raw, invokedSkill string) error {
	cmd, ok := strings.CutPrefix(strings.TrimSpace(text), "!")
	if !ok {
		return ctrl.RunTurnWithRaw(ctx, text, raw, invokedSkill)
	}
	ctrl.RunShell(cmd)
```

</details>

**依据 2 · 源码核查**：[internal/session/control/shell.go:218-243](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/internal/session/control/shell.go#L218-L243)

显式 shell 的作用范围。

<details>
<summary>查看原文（26行）</summary>

```text
// RunShell executes a shell command directly (bypassing the model) and streams
// the output as ToolDispatch/ToolProgress/ToolResult events. It uses the same
// bash-tool infrastructure (shell resolution, timeout) and shares the runGuarded
// lock with model turns — only one can run at a time. User-invoked "!" commands
// run without the OS sandbox (the user typed the command explicitly).
func (c *Controller) RunShell(command string) {
	c.RunShellWith(command, ShellRun{})
}

// RunShellWith is RunShell with how the command is followed up spelled out.
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

**依据 3 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:1-14](https://github.com/esengine/DeepSeek-Reasonix/blob/a8fe2001c894a6ba4e4287f88bf49e50e0c18f0f/integrations/dsh-plugin/cordis.patch.yml#L1-L14)

现有配置仅指定 reject。

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

#### 缺口

- 宿主版本不一致、未有原型或实验
  **影响**：不能认定实际缺陷或方案有效
  **进一步探讨**：对照简单拒绝、前置分流、禁 bash 与 OS 隔离，记录误授权和误拦。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
