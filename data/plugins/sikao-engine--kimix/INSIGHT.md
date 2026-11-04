# KimiX

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c8cdfc7](https://github.com/Sikao-Engine/KimiX/tree/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f)

<!-- BEGIN META -->
[![GitHub ★ 112](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=112&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Sikao-Engine/KimiX)
<!-- END META -->

> **功能**：基于 Kimi CLI 的命令行代理与脚本工作流，提供文件、命令及模型工具。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示项目将命令行、SDK 和工具循环组合为脚本化代理工作流；实际效率和质量没有对照。

> **主要限制**：[Q03](#research-q03) 的验证闸按调用分类且提醒有上限，不能证明测试成功；审批在 yolo 或 afk 下可自动通过。

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
  - [Q01 · 谁用它做什么，和普通编码代理有什么不同？](#detail-section-11)
  - [Q02 · 命令输入如何接到模型和工具循环？](#detail-section-12)
  - [Q03 · 审批与验证闸能保证什么？](#detail-section-13)
  - [Q04 · 依赖、成本及适合谁试用？](#detail-section-14)
  - [Q05 · 什么改进可以验证或否定？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：熟悉命令行的开发者可在受控工作区用模型辅助代码和文件任务，并自行核验结果。

现有编码代理或人工脚本可执行类似任务；项目把 Kimi CLI 扩展、脚本化接口与运行提醒组合起来。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 命令行与 SDK | 启动代理并消费消息流 | Python 及依赖需匹配 |
| 模型工具循环 | 处理模型返回的工具调用 | 各工具权限与副作用不同 |
| 验证提醒 | 提醒未完成事项或缺检查调用 | 上限两次，不校验检查通过 |
| MCP 审批 | 在 MCP 调用前请求批准 | yolo 或 afk 可自动批准 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python >=3.15.2 与依赖 | 项目声明的运行条件 | 启动客户端 | 实际平台兼容未知 |
| 模型提供方和凭据 | 模型任务需要 | 处理上下文并生成工具调用 | 不可用时任务失败 |
| 工作区与工具权限 | 对应任务需要 | 读取、修改和执行 | 操作可能产生副作用 |
| 人工验证 | 交付判断需要 | 核对结果与测试 | 调用分类不证明检查通过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 开发者建立隔离副本并核对提供方 | 模式和权限不明时停止 |
| 输入 | 开发者发起小任务 | 核对模型请求及目标范围 |
| 执行 | 开发者检查审批与命令 | 发现越界时停止并检查状态 |
| 验收 | 开发者亲自运行并核对合适检查 | 不以闸门提示消失当通过 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 运行时和模型服务费用未知 | 安装配置和备份时间未知 | Python 版本要求较具体 |
| 持续 | 模型与工具资源费用未知 | 审查命令、差异及结果 | 净节时未测 |
| 失败恢复 | 重试和备份成本未知 | 核对文件及外部副作用 | 自动批准模式需明确 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 脚本化代理 | CLI、SDK 与工具循环接线 | 真实任务成功率和效率 |
| 审批 | MCP 包装器请求批准 | 所有工具与模式是否覆盖 |
| 验证提醒 | 基于调用的有限提醒 | 检查结果、覆盖与正确性 |

> **思考**：[Q03](#research-q03) 的验证闸按调用分类且提醒有上限，不能证明测试成功；审批在 yolo 或 afk 下可自动通过。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示项目将命令行、SDK 和工具循环组合为脚本化代理工作流；实际效率和质量没有对照。

[Q02](#research-q02) 的 SDK 流与模型步骤分层清楚；[Q03](#research-q03) 的提醒上限和调用级分类需与结果验证区分。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的验证闸按调用分类且提醒有上限，不能证明测试成功；审批在 yolo 或 afk 下可自动通过。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议熟悉代码与命令的开发者先在非敏感副本试小任务，并自行核对实际检查结果。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代表性命令行链路与闸门边界；真实环境、效果和改进假设未验证。

- 已检查：作者 README、包清单、源码路径 pyproject.toml、README.md、src/kimix/agent_worker.json、src/kimix/cli_impl/main.py、src/kimix/cli_impl/core.py、src/kimix/utils/prompt.py、src/kimi_agent_sdk/_session.py、kimi-cli/src/kimi_cli/soul/kimisoul.py、kimi-cli/src/kimi_cli/soul/toolset.py、kimi-cli/src/kimi_cli/soul/approval.py、kimi-cli/src/kimi_cli/soul/verification_gate.py、kimi-cli/src/kimi_cli/tools/file/run.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根仓库为独立 Kimi CLI 扩展和客户端，定向检查 CLI、SDK、模型步骤、审批及验证闸；未运行目标、模型、宿主或测试，未全审所有工具、GUI、服务端和供应商。
- 下一步：固定 Python、项目与模型，在隔离仓库测试审批模式、失败检查、提醒上限和工具副作用。

**分析版本**

- **仓库**：[Sikao-Engine/KimiX](https://github.com/Sikao-Engine/KimiX)
- **版本号**：未声明（[固定提交 c8cdfc7](https://github.com/Sikao-Engine/KimiX/tree/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出绑定检查结果与修改范围的未验证记录；若不减少误判或误拦过多则否定。

固定 Python、项目与模型，在隔离仓库测试审批模式、失败检查、提醒上限和工具副作用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 62 | 10213 | — | — | 69189 |
| .tsx | source | 32 | 10120 | 9079 | 390 | — |
| .ts | source | 12 | 2447 | 2025 | 157 | — |
| .ts | test | 1 | 53 | 32 | 11 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/Sikao-Engine/KimiX/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查命令行输入、SDK、模型工具循环、审批和验证提醒的实际边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用它做什么，和普通编码代理有什么不同？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在命令行或 Python 工作流中处理代码、文件和多步骤任务的开发者，可以通过 KimiX 调用模型并使用其工具集合。普通编码代理和 Python 脚本也能完成部分任务；项目在 Kimi CLI 基础上组合脚本化会话、工具配置和循环提醒，提供自己的工作流接口。项目包暴露 kimix 命令并带本地代理实现，是独立客户端及工具工程，不是 DSH 原生插件。没有本次同任务质量、速度或成本对照。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-11](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/pyproject.toml#L5-L11)

项目名称、版本、Python 要求。

```text
[project]
name = "kimix"
version = "0.1.29"
description = "Kimi Agent Tools - Custom tool collection for Kimi Agent SDK"
readme = "README.md"
license = { text = "MIT" }
requires-python = ">=3.15.2"
```

**依据 2 · 源码核查**：[pyproject.toml:104-105](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/pyproject.toml#L104-L105)

注册 kimix 命令。

```text
[project.scripts]
kimix = "kimix.cli:cli"
```

**依据 3 · 作者声明**：[README.md:15-35](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/README.md#L15-L35)

作者描述 Kimi CLI 基础及主要方向。

<details>
<summary>查看原文（21行）</summary>

```text
![teasor](kimix_en.png)

## Why Kimi-CLI-X?

Kimi-CLI-X is a deep optimization of the original Kimi-CLI, focusing on **prompt efficiency**, **tool reliability**, and **extensibility**, plus new tools for real-world development.

### Optimizations

1. **Lean system prompts** — Compressed initial prompts and tool descriptions down to ~2000 tokens while covering nearly all built-in tools.
2. **Hardened permissions & validation** — Properly handles Shell, Glob, and other tool validations to reduce retry loops from failures.
3. **Better subprocess output** — Redirects large outputs to temp files and filters redundant logs for easier backend retrieval.
4. **Simpler concurrency** — Streamlined design for subprocesses, sub-agents, and background tasks.
5. **Programmable prompts** — Allows custom system prompt injection at the upper layer for flexible scenarios.
6. **Explicit conversation management** — Clearer multi-task orchestration and state tracking.
7. **Write-and-validate** — Auto format checks and warnings on strict config files to prevent model-hallucinated errors.
8. **Multi-API support** — Import custom configs compatible with OpenAI, Anthropic, and more.
9. **Verified backends** — Tested against kimi, xai, anthropic, openai_legacy, openai_responses, google_genai/gemini, vertexai/vertex, plus 25+ Hermes-ported providers (deepseek, openrouter, xiaomi, zai, minimax, bedrock, ...). See `kimi-cli/tests/core/test_create_llm.py` and the [Supported Providers](docs/tutorials/1_quick_start_en.md#supported-providers) list.

### New Capabilities

| Capability | Description |
```

</details>

**依据 4 · 源码核查**：[src/kimix/agent_worker.json:1-28](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/src/kimix/agent_worker.json#L1-L28)

worker 的工具清单及禁用项。

<details>
<summary>查看原文（28行）</summary>

```text
{
  "agent": {
    "extend": "default",
    "tools": [
      "kimi_cli.tools.file.bash:bash",
      "kimi_cli.tools.file.bash:pwsh",
      "kimi_cli.tools.py:python",
      "kimi_cli.tools.background:job_output",
      "kimi_cli.tools.todo:todo_list",
      "kimi_cli.tools.file:read",
      "kimi_cli.tools.file:read_image",
      "kimi_cli.tools.file:edit",
      "kimi_cli.tools.file:write",
      "kimi_cli.tools.subagent:subagent",
      "kimi_cli.tools.subagent:list_agents",
      "kimi_cli.tools.swarm:workflow",
      "kimi_cli.tools.file:glob",
      "kimi_cli.tools.file:grep",
      "kimi_cli.tools.web.kimix_fetch:fetch_url",
      "kimi_cli.tools.web:web_search",
      "kimi_cli.tools.context:compact",
      "kimi_cli.tools.skill:skill",
      "kimi_cli.tools.research:research"
    ],
    "disabled_tools": [
      "kimi_cli.tools.subagent:interrupt_agent",
      "kimi_cli.tools.file.run:Run"
    ]
```

</details>

#### 缺口

- 未做同任务对照
  **影响**：不能量化质量、成本或模型效率
  **进一步探讨**：固定模型、任务和工作区比较原有代理与 KimiX 的结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 命令输入如何接到模型和工具循环？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

pyproject 将 kimix 命令指向 CLI，入口调用 _run_cli；交互分支将输入交给 prompt 与默认 session。SDK Session.prompt 产生 Wire 消息流，KimiSoul 的单步调用将模型提供方、系统提示、工具表和历史传给 kosong.step，等待工具结果后追加上下文，存在工具调用时继续循环。项目支持多种入口和配置，本次只追这条代表性链路；没有运行客户端或验证其他 GUI、服务端、多代理路径。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:104-105](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/pyproject.toml#L104-L105)

命令入口。

```text
[project.scripts]
kimix = "kimix.cli:cli"
```

**依据 2 · 源码核查**：[src/kimix/cli_impl/main.py:18-26](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/src/kimix/cli_impl/main.py#L18-L26)

CLI 调用核心入口。

```text
lazy from kimix.utils import delete_session_dir

from . import constants
lazy from .core import _run_cli


def cli() -> None:
    try:
        _run_cli()
```

**依据 3 · 源码核查**：[src/kimix/cli_impl/core.py:168-183](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/src/kimix/cli_impl/core.py#L168-L183)

交互输入进入 prompt 与默认 session。

<details>
<summary>查看原文（16行）</summary>

```text
                if input_str is not None and len(input_str) > 0:
                    try:
                        # The window is busy while the agent runs: keyboard
                        # input must not be captured for the next prompt.
                        ipc_server.set_busy(True)
                        if base._default_manually_cot:
                            print_info(
                                "Manually CoT mode enabled: may use multiple sessions and extra tokens."
                            )
                            cot_prompt(input_str)
                        else:
                            prompt(
                                prompt_str=input_str,
                                session=get_default_session(),
                                format_output=True,
                            )
```

</details>

**依据 4 · 源码核查**：[src/kimix/utils/prompt.py:435-445](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/src/kimix/utils/prompt.py#L435-L445)

消费 session.prompt 的消息流。

<details>
<summary>查看原文（11行）</summary>

```text
    Raises on failure (TimeoutError, APIStatusError, or after exhausting retries).
    Returns normally on success (after printing usage info).
    """
    max_retries = 3

    async def _run_prompt_iter():
        detector = TextLoopDetector.from_env()
        try:
            async for message in session.prompt(prompt_str, merge_wire_messages=merge_wire_messages):
                if cancel_callable is not None and cancel_callable():
                    session.cancel()
```

</details>

**依据 5 · 源码核查**：[src/kimi_agent_sdk/_session.py:991-1020](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/src/kimi_agent_sdk/_session.py#L991-L1020)

SDK 的 prompt 和审批消息接口。

<details>
<summary>查看原文（30行）</summary>

```text
    async def prompt(
        self,
        user_input: str | list[ContentPart],
        *,
        merge_wire_messages: bool = False,
        max_restarts: int = 3,
    ) -> AsyncGenerator[WireMessage, None]:
        """
        Send a prompt and get a WireMessage stream.

        Args:
            user_input: User input, can be plain text or a list of content parts.
            merge_wire_messages: Whether to merge consecutive Wire messages.
            max_restarts: Maximum number of automatic session restarts when step
                retries are exhausted (e.g. persistent 5xx, connection failures).
                Set to 0 to disable auto-restart. Default is 3.

        Yields:
            WireMessage: Wire messages, including ApprovalRequest.

        Raises:
            LLMNotSet: When the LLM is not set.
            LLMNotSupported: When the LLM does not have required capabilities.
            ChatProviderError: When the LLM provider returns an error.
            MaxStepsReached: When the maximum number of steps is reached.
            RunCancelled: When the run is cancelled by the cancel event.
            SessionStateError: When the session is closed or already running.

        Note:
            Callers must handle ApprovalRequest manually unless yolo=True.
```

</details>

**依据 6 · 源码核查**：[kimi-cli/src/kimi_cli/soul/kimisoul.py:1430-1443](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/kimisoul.py#L1430-L1443)

模型步骤连接 provider、工具表与历史。

<details>
<summary>查看原文（14行）</summary>

```text
            # mid-stream — see _is_empty_content_block) are filtered out of
            # the stream *before* kosong.generate merges it. This fixes both
            # the spurious [Think] print spam and — critically — tool-call
            # argument truncation/dropping (arguments arriving as "{" then
            # cut off, yielding invalid/empty tool args).
            filtered_provider = _EmptyPartFilteredChatProvider(chat_provider)
            return await kosong.step(
                filtered_provider,
                system_prompt,
                self._agent.toolset,
                effective_history,
                on_message_part=_make_empty_part_filtering_callback(wire_send),
                on_tool_result=wire_send,
            )
```

</details>

**依据 7 · 源码核查**：[kimi-cli/src/kimi_cli/soul/kimisoul.py:1640-1667](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/kimisoul.py#L1640-L1667)

等待工具结果并追加上下文。

<details>
<summary>查看原文（28行）</summary>

```text
        # ═══════════════════════════════════════════════════════════════════════
        # 2e.6. TOOL EXECUTION
        # ═══════════════════════════════════════════════════════════════════════
        # wait for all tool results (may be interrupted)
        results = await result.tool_results()
        logger.debug("Got tool results: {results}", results=results)
        # Update dedup tracking for the next step
        if isinstance(self._agent.toolset, KimiToolset):
            self._last_tool_calls = self._agent.toolset.end_step()

        # ═══════════════════════════════════════════════════════════════════════
        # 2e.7. CONTEXT GROWTH
        # ═══════════════════════════════════════════════════════════════════════
        # Shield the context manipulation from interruption — and on the
        # steer-interrupt path, still wait for the shielded growth to finish
        # before propagating the cancellation.  Otherwise the agent loop's
        # ``_consume_pending_steers`` can inject its user message between the
        # assistant message and its tool-result messages, persisting a
        # ``assistant(tool_calls) -> user -> tool`` ordering that strict
        # backends reject with a 400 on the next request.
        grow_task = asyncio.ensure_future(self._grow_context(result, results))
        try:
            await asyncio.shield(grow_task)
        except asyncio.CancelledError:
            # grow_task is shielded, so it is still running; let it finish
            # appending the assistant + tool messages before the cancellation
            # path consumes steers.
            await grow_task
```

</details>

**依据 8 · 源码核查**：[kimi-cli/src/kimi_cli/soul/kimisoul.py:1690-1703](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/kimisoul.py#L1690-L1703)

工具调用继续循环的终止分支。

<details>
<summary>查看原文（14行）</summary>

```text
            if isinstance(result.return_value, ToolRejectedError)
        ]
        if rejected_errors and not any(e.has_feedback for e in rejected_errors) and self.is_root:
            # Pure rejection (no user feedback) — stop the turn.
            # Subagents skip this so the LLM can see the rejection and try
            # an alternative approach instead of terminating immediately.
            return StepOutcome(stop_reason="tool_rejected", assistant_message=result.message)

        if isinstance(self._agent.toolset, KimiToolset) and self._agent.toolset.force_stop_turn:
            return StepOutcome(stop_reason="tool_call_repeat", assistant_message=result.message)

        if result.tool_calls:
            return None
        return StepOutcome(stop_reason="no_tool_calls", assistant_message=result.message)
```

</details>

#### 缺口

- 未运行 CLI、SDK、模型或具体工具
  **影响**：不能确认目标环境中链路成功或任务结果正确
  **进一步探讨**：在隔离工作区固定提供方验证输入、审批、工具和输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审批与验证闸能保证什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

工具可以调用 approval.request，请求发生在工具调用上下文；MCP 包装器在实际调用前请求审批。审批对象的 yolo 或 afk 状态会自动批准，因而不能声称所有工具操作始终获得人工确认。验证闸在启用且模型尝试无工具调用结束时检查未完成 todo 和本轮是否有修改但没有被识别为验证的工具调用，默认最多提醒两次；达到提醒上限即放行，todo 标记完成也能计作验证类调用，且分类依据调用名称与参数而非检查结果通过。因此这是一道有界提醒，不等于真实测试通过或代码正确。

#### 证据与依据

**依据 1 · 源码核查**：[kimi-cli/src/kimi_cli/soul/toolset.py:2431-2444](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/toolset.py#L2431-L2444)

MCP 调用前请求审批。

<details>
<summary>查看原文（14行）</summary>

```text
        self._timeout = timedelta(milliseconds=runtime.config.mcp.client.tool_call_timeout_ms)
        self._action_name = f"mcp:{mcp_tool.name}"

    async def __call__(self, *args: Any, **kwargs: Any) -> ToolReturnValue:
        description = f"Call MCP tool `{self._mcp_tool.name}`."
        result = await self._runtime.approval.request(self.name, self._action_name, description)
        if not result:
            return result.rejection_error()

        try:
            result = await self._client.call_tool(
                self._mcp_tool.name,
                kwargs,
                timeout_ms=int(self._timeout.total_seconds() * 1000),
```

</details>

**依据 2 · 源码核查**：[kimi-cli/src/kimi_cli/soul/approval.py:123-129](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/approval.py#L123-L129)

yolo 或 afk 触发自动批准。

```text
    def is_auto_approve(self) -> bool:
        """True when tool calls should be auto-approved.

        Afk implies auto-approve, so this returns True whenever either the
        explicit yolo flag or afk is set.
        """
        return self._state.yolo or self.is_afk()
```

**依据 3 · 源码核查**：[kimi-cli/src/kimi_cli/soul/approval.py:151-187](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/approval.py#L151-L187)

审批请求和自动批准分支。

<details>
<summary>查看原文（37行）</summary>

```text
    async def request(
        self,
        sender: str,
        action: str,
        description: str,
        display: list[DisplayBlock] | None = None,
    ) -> ApprovalResult:
        """
        Request approval for the given action. Intended to be called by tools.

        Args:
            sender (str): The name of the sender.
            action (str): The action to request approval for.
                This is used to identify the action for auto-approval.
            description (str): The description of the action. This is used to display to the user.

        Returns:
            ApprovalResult: Result with ``approved`` flag and optional ``feedback``.
                Behaves as ``bool`` via ``__bool__``, so ``if not result:`` works.

        Raises:
            RuntimeError: If the approval is requested from outside a tool call.
        """
        tool_call = get_current_tool_call_or_none()
        if tool_call is None:
            raise RuntimeError("Approval must be requested from a tool call.")

        logger.debug(
            "{tool_name} ({tool_call_id}) requesting approval: {action} {description}",
            tool_name=tool_call.function.name,
            tool_call_id=tool_call.id,
            action=action,
            description=description,
        )
        if self.is_auto_approve():

            return ApprovalResult(approved=True)
```

</details>

**依据 4 · 源码核查**：[kimi-cli/src/kimi_cli/soul/kimisoul.py:1069-1084](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/kimisoul.py#L1069-L1084)

无工具调用结束且启用时调用闸。

<details>
<summary>查看原文（16行）</summary>

```text
                # ── 2g. Verification Gate (P2, B-3) ────────────────────────────
                # Before ending the turn on no_tool_calls, check whether the
                # turn is actually finished (todos done, verifications run).
                if (
                    step_outcome.stop_reason == "no_tool_calls"
                    and self._loop_control.verification_gate_enabled
                ):
                    gate_msg = await self._verification_gate.check(self)
                    if gate_msg is not None:
                        await self._context.append_message(
                            Message(
                                role="user",
                                content=[TextPart(text=system_reminder(gate_msg).text)],
                            )
                        )
                        continue  # do not end the turn; force another step
```

</details>

**依据 5 · 源码核查**：[kimi-cli/src/kimi_cli/soul/verification_gate.py:31-36](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/verification_gate.py#L31-L36)

默认最多两次提醒。

```text
class VerificationGate:
    """Decides whether a turn may end, and produces nudge text otherwise."""

    def __init__(self, *, max_nudges: int = 2) -> None:
        self._max_nudges = max(0, max_nudges)
        self._nudges = 0
```

**依据 6 · 源码核查**：[kimi-cli/src/kimi_cli/soul/verification_gate.py:67-85](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/verification_gate.py#L67-L85)

根据工具名称及 todo 参数识别验证。

<details>
<summary>查看原文（19行）</summary>

```text
    def _classify_turn_tool_calls(turn_history: list[Message]) -> tuple[bool, bool]:
        """Return ``(has_edits, has_verification)`` for the turn's tool calls."""
        has_edits = False
        has_verification = False
        for msg in turn_history:
            if msg.role != "assistant" or not msg.tool_calls:
                continue
            for tool_call in msg.tool_calls:
                name = tool_call.function.name
                if name in EDIT_TOOLS:
                    has_edits = True
                if name in VERIFICATION_TOOL_HINTS:
                    # A todo_list call only counts as verification when it
                    # actually marks something done.
                    if name == "todo_list" or name in RETIRED_TODO_TOOL_NAMES:
                        if VerificationGate._todolist_marks_done(tool_call.function.arguments):
                            has_verification = True
                    else:
                        has_verification = True
```

</details>

**依据 7 · 源码核查**：[kimi-cli/src/kimi_cli/soul/verification_gate.py:112-142](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/verification_gate.py#L112-L142)

上限、未完成事项与修改后未验证的判断。

<details>
<summary>查看原文（31行）</summary>

```text
    async def check(self, soul: KimiSoul) -> str | None:
        """Return a nudge text if the turn must continue, else ``None``."""
        self._sync_turn(soul)
        if self._nudges >= self._max_nudges:
            return None

        reasons: list[str] = []

        # Condition 1: unfinished todos (root or subagent scope).
        try:
            todos = soul._load_todo_states_for_reminder()  # pyright: ignore[reportPrivateUsage]
        except Exception:
            todos = []
        unfinished = [t for t in todos if t.status != "done"]
        if unfinished:
            lines = ["Unfinished todo items remain:"]
            for item in unfinished[:_MAX_UNFINISHED_LISTED]:
                lines.append(f"- [{item.status}] {item.title}")
            if len(unfinished) > _MAX_UNFINISHED_LISTED:
                lines.append(f"- … and {len(unfinished) - _MAX_UNFINISHED_LISTED} more")
            reasons.append("\n".join(lines))

        # Condition 2: edits this turn but no verification-class call.
        turn_history = self._current_turn_history(soul)
        has_edits, has_verification = self._classify_turn_tool_calls(turn_history)
        if has_edits and not has_verification:
            reasons.append(
                "You modified code this turn but ran no verification "
                "(no tests/check commands). "
                "Run the project's tests or a verification command before finishing."
            )
```

</details>

#### 缺口

- 没有核查所有内置工具和权限路径
  **影响**：不能保证所有操作都会调用审批或全部约束有效
  **进一步探讨**：逐工具检查实际入口，并在隔离环境验证批准、拒绝及失败检查。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、成本及适合谁试用？

**研究主题**：效果与总成本、采用判断、缺陷与关键质疑

#### 完整回答

项目声明 Python 3.15.2 以上和 kimi-cli-x 等依赖，并可配置不同模型提供方；具体运行时和提供方兼容未实测。工作区的文件或命令工具可产生真实副作用，模型请求也会将所选历史发送给提供方。首次需要核运行环境、提供方、权限和副本，持续有模型调用及人工复核成本，失败时需检查文件和外部动作；具体费用和时间未知。能自行检查命令和代码的开发者可先在非敏感隔离副本中试验小任务；审批模式不明、验证结果不可信或操作状态未知时停止并转人工核对。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-25](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/pyproject.toml#L5-L25)

版本、Python 和依赖声明。

<details>
<summary>查看原文（21行）</summary>

```text
[project]
name = "kimix"
version = "0.1.29"
description = "Kimi Agent Tools - Custom tool collection for Kimi Agent SDK"
readme = "README.md"
license = { text = "MIT" }
requires-python = ">=3.15.2"
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.15",
]
dependencies = [
    "numpy>=2.4.3",
    "playwright",
    "markdownify",
    "kimi-cli-x>=1.45.3",
    "fastapi>=0.133.1",
    "uvicorn>=0.41.0",
    "httpx>=0.28.1",
```

</details>

**依据 2 · 源码核查**：[src/kimix/agent_worker.json:1-23](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/src/kimix/agent_worker.json#L1-L23)

worker 可见的文件、shell 及网络工具声明。

<details>
<summary>查看原文（23行）</summary>

```text
{
  "agent": {
    "extend": "default",
    "tools": [
      "kimi_cli.tools.file.bash:bash",
      "kimi_cli.tools.file.bash:pwsh",
      "kimi_cli.tools.py:python",
      "kimi_cli.tools.background:job_output",
      "kimi_cli.tools.todo:todo_list",
      "kimi_cli.tools.file:read",
      "kimi_cli.tools.file:read_image",
      "kimi_cli.tools.file:edit",
      "kimi_cli.tools.file:write",
      "kimi_cli.tools.subagent:subagent",
      "kimi_cli.tools.subagent:list_agents",
      "kimi_cli.tools.swarm:workflow",
      "kimi_cli.tools.file:glob",
      "kimi_cli.tools.file:grep",
      "kimi_cli.tools.web.kimix_fetch:fetch_url",
      "kimi_cli.tools.web:web_search",
      "kimi_cli.tools.context:compact",
      "kimi_cli.tools.skill:skill",
      "kimi_cli.tools.research:research"
```

</details>

**依据 3 · 源码核查**：[kimi-cli/src/kimi_cli/soul/kimisoul.py:1435-1443](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/kimisoul.py#L1435-L1443)

历史与工具传入模型步骤。

```text
            filtered_provider = _EmptyPartFilteredChatProvider(chat_provider)
            return await kosong.step(
                filtered_provider,
                system_prompt,
                self._agent.toolset,
                effective_history,
                on_message_part=_make_empty_part_filtering_callback(wire_send),
                on_tool_result=wire_send,
            )
```

**依据 4 · 源码核查**：[kimi-cli/src/kimi_cli/tools/file/run.py:200-218](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/tools/file/run.py#L200-L218)

命令规则与可配置硬限制。

<details>
<summary>查看原文（19行）</summary>

```text
        # Pre-normalize forbidden commands once at init time for O(1) per-call lookup.
        raw_forbidden = self._session.custom_config.get(
            "config_json", {}).get("forbidden_commands", [])
        self._forbidden_keywords: list[str] = []
        seen: set[str] = set()
        for cmd in raw_forbidden:
            if not isinstance(cmd, str) or not cmd:
                continue
            normalized = " ".join(cmd.split())
            if normalized not in seen:
                seen.add(normalized)
                self._forbidden_keywords.append(normalized)

        # Config gates for the hardline safety floor and secret redaction
        # (both default on; explicitly set False to disable).
        shell_cfg = self._session.custom_config.get("config_json", {}).get("shell", {})
        if isinstance(shell_cfg, dict):
            self._hardline_enabled = shell_cfg.get("hardline", True)
            self._redact_secrets = shell_cfg.get("redact_secrets", True)
```

</details>

#### 缺口

- 未实测支持的运行时、提供方、权限和实际费用
  **影响**：无法给出兼容矩阵或总成本
  **进一步探讨**：隔离环境固定版本测试只读和可逆任务并记录消耗。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么改进可以验证或否定？

**研究主题**：新假设与验证

#### 完整回答

可以探索把验证闸从调用名称升级为绑定具体修改和检查结果的证据记录，并将未运行、失败或无法判断的状态展示给用户。现有实现已有 todo 和工具调用分类及有限提醒；新增的是检查结果与修改范围的对应，不是重新发明提醒。用包含失败测试、无关检查、标记完成和真实通过的改动对照，测量错误完成判断与人工复核负担；若不能减少误判或误拦过多则否定。当前并未实现或实测。

#### 证据与依据

**依据 1 · 源码核查**：[kimi-cli/src/kimi_cli/soul/verification_gate.py:67-85](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/verification_gate.py#L67-L85)

现有验证分类基于工具调用。

<details>
<summary>查看原文（19行）</summary>

```text
    def _classify_turn_tool_calls(turn_history: list[Message]) -> tuple[bool, bool]:
        """Return ``(has_edits, has_verification)`` for the turn's tool calls."""
        has_edits = False
        has_verification = False
        for msg in turn_history:
            if msg.role != "assistant" or not msg.tool_calls:
                continue
            for tool_call in msg.tool_calls:
                name = tool_call.function.name
                if name in EDIT_TOOLS:
                    has_edits = True
                if name in VERIFICATION_TOOL_HINTS:
                    # A todo_list call only counts as verification when it
                    # actually marks something done.
                    if name == "todo_list" or name in RETIRED_TODO_TOOL_NAMES:
                        if VerificationGate._todolist_marks_done(tool_call.function.arguments):
                            has_verification = True
                    else:
                        has_verification = True
```

</details>

**依据 2 · 源码核查**：[kimi-cli/src/kimi_cli/soul/verification_gate.py:112-142](https://github.com/Sikao-Engine/KimiX/blob/c8cdfc74293a600cf6bc21c05ce490fc8b0c617f/kimi-cli/src/kimi_cli/soul/verification_gate.py#L112-L142)

有限提醒而非结果级证明。

<details>
<summary>查看原文（31行）</summary>

```text
    async def check(self, soul: KimiSoul) -> str | None:
        """Return a nudge text if the turn must continue, else ``None``."""
        self._sync_turn(soul)
        if self._nudges >= self._max_nudges:
            return None

        reasons: list[str] = []

        # Condition 1: unfinished todos (root or subagent scope).
        try:
            todos = soul._load_todo_states_for_reminder()  # pyright: ignore[reportPrivateUsage]
        except Exception:
            todos = []
        unfinished = [t for t in todos if t.status != "done"]
        if unfinished:
            lines = ["Unfinished todo items remain:"]
            for item in unfinished[:_MAX_UNFINISHED_LISTED]:
                lines.append(f"- [{item.status}] {item.title}")
            if len(unfinished) > _MAX_UNFINISHED_LISTED:
                lines.append(f"- … and {len(unfinished) - _MAX_UNFINISHED_LISTED} more")
            reasons.append("\n".join(lines))

        # Condition 2: edits this turn but no verification-class call.
        turn_history = self._current_turn_history(soul)
        has_edits, has_verification = self._classify_turn_tool_calls(turn_history)
        if has_edits and not has_verification:
            reasons.append(
                "You modified code this turn but ran no verification "
                "(no tests/check commands). "
                "Run the project's tests or a verification command before finishing."
            )
```

</details>

#### 缺口

- 结果绑定方案未实现
  **影响**：无法声称能提高交付可靠性
  **进一步探讨**：以预先标注的通过和失败检查对照误判及误拦。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
