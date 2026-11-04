# IllusionAgent

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c0461d8](https://github.com/YunTaiHua/illusion-agent/tree/c0461d84414cc7e1f7f7bde372c7c0bc348d44be)

<!-- BEGIN META -->
[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/YunTaiHua/illusion-agent)
<!-- END META -->

> **功能**：提供多模型 Agent 的命令行、网页界面、工具和扩展。

> **亮点**：[Q01](#research-q01) 组合多界面和扩展，[Q02](#research-q02) 连接工具权限及执行；实际效果未知。

> **主要限制**：[Q02](#research-q02) 工具级允许先于路径和命令拒绝，配置组合需按实际优先级核查。

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
  - [Q01 · IllusionAgent 面向什么用户，相对独立组件提供什么？](#detail-section-11)
  - [Q02 · 工具权限如何决定，显式允许与拒绝规则的顺序是什么？](#detail-section-12)
  - [Q03 · 可选模型审核和人工回退的条件是什么？](#detail-section-13)
  - [Q04 · 如何验证允许列表与细粒度拒绝规则的组合？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望通过命令行或 Web 使用多模型 Agent 执行任务的开发者。

模型 SDK、独立 CLI 及人工脚本同样可执行任务；项目将交互和权限流程集成。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 查询与工具 | 执行 Agent 任务 | 需模型和配置 |
| 权限判断 | 按工具、模式及规则评估 | 工具允许先于后续细粒度拒绝 |
| 自动审核 | 模型协助处理需确认操作 | 仅 full_auto 开启；拒绝可回人工 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python 及依赖 | 服务运行必需 | Agent 执行 | 不满足时无法运行 |
| 模型端点和凭据 | 推理必需 | 任务和可选审核 | 失败需处理或回退 |
| 规则和确认渠道 | 敏感操作必需 | 限制工具权限 | 无渠道时相应分支拒绝 |
| 隔离环境和备份 | 评估写操作需要 | 限制意外副作用 | 不能仅靠文本规则假定安全 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 配置模型与权限 | 核工具允许及拒绝顺序 |
| 请求 | 输入任务并选择模式 | 评估真实工具参数 |
| 确认 | 对需审批动作人工或模型裁决 | 无确认渠道拒绝 |
| 恢复 | 核输出与副作用 | 不可接受时停用并恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型及运行环境费用未知 | 配置规则与隔离 | 平台兼容未测 |
| 持续 | 模型审核和工具资源未知 | 审批与结果复核 | 准确率和延迟未知 |
| 恢复 | 重试和副作用成本未知 | 对账与恢复 | 所有执行路径未审 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工具执行 | 查询循环验证权限后调用 | 所有渠道与工具覆盖 |
| 权限规则 | 当前 checker 的分支顺序 | 复杂命令风险识别 |
| 自动审核 | full_auto 可选审核与人工回退 | 实际误判和模型可用性 |

> **思考**：[Q02](#research-q02) 工具级允许先于路径和命令拒绝，配置组合需按实际优先级核查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 组合多界面和扩展，[Q02](#research-q02) 连接工具权限及执行；实际效果未知。

[Q02](#research-q02) 明确评估、确认与执行分支，但工具级允许早于细粒度拒绝需注意。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 工具级允许先于路径和命令拒绝，配置组合需按实际优先级核查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先在隔离环境核工具允许与拒绝规则的优先级；不满足预期时停用对应模式。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

定向核查权限 checker 和查询执行路径，未运行目标或模型。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、src/illusion/permissions/checker.py、src/illusion/permissions/auto_review.py、src/illusion/engine/query.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、Python 包、权限 checker、模型审核和查询工具执行；未全审 UI、渠道、沙箱实现或所有入口。
- 下一步：在隔离宿主按工具允许、路径拒绝、命令拒绝、模型失败及无确认渠道进行对照。

**分析版本**

- **仓库**：[YunTaiHua/illusion-agent](https://github.com/YunTaiHua/illusion-agent)
- **版本号**：未声明（[固定提交 c0461d8](https://github.com/YunTaiHua/illusion-agent/tree/c0461d84414cc7e1f7f7bde372c7c0bc348d44be)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设明确优先级并提供拒绝优先策略可减少误解，尚未验证。

在隔离宿主按工具允许、路径拒绝、命令拒绝、模型失败及无确认渠道进行对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 65 | 15805 | 10702 | 4195 | — |
| .md | source | 42 | 8953 | — | — | 62770 |
| .mjs | source | 1 | 36 | 33 | 1 | — |
| .tsx | source | 68 | 27597 | 20876 | 5574 | — |
| .js | source | 2 | 166 | 146 | 40 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/YunTaiHua/illusion-agent/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查独立 Agent 任务执行与权限规则边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · IllusionAgent 面向什么用户，相对独立组件提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

项目自述将多模型入口、命令行、Web、工具与扩展组合为 Agent 平台，面向希望在不同界面执行 Agent 任务的开发者。命令行工具、模型 SDK 和人工脚本也能完成部分工作，项目的增量是整合交互、工具和权限流程；README 承认借鉴其他项目，不能将继承思想算作原创。根工程是独立 Agent，不是 DSH 插件；任务效果和多平台兼容尚未运行。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-29](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/README.md#L15-L29)

作者给出平台、功能和来源。

<details>
<summary>查看原文（15行）</summary>

```text
## 📖 Introduction

IllusionAgent is an open-source AI agent platform. It unifies a multi-provider
LLM gateway, a bilingual (Chinese/English) CLI, a browser-based Web UI, and
a flexible extension ecosystem into a single intelligent agent — at home
on Windows, macOS, and Linux.

Whether you prefer the discipline of the terminal or the ease of the browser,
IllusionAgent resonates with your workflow: a rich built-in toolset, specialized
sub-agents, two compaction methods, MCP server support, hooks, plugins, and
a cron scheduler for unattended automation — spanning Feishu, WeChat, and QQ.

> Standing on the shoulders of giants — Claude Code prompts, OpenHarness
> architecture, OpenClaw scheduling, kimi-cli infrastructure, hermes-agent
> channels, cc-switch routing.
```

</details>

**依据 2 · 作者声明**：[README.md:31-42](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/README.md#L31-L42)

作者列出多界面与权限。

<details>
<summary>查看原文（12行）</summary>

```text
### Core Features

- 🤖 **Multi AI Provider Support** - Anthropic, OpenAI, Copilot, Codex, and any compatible endpoint
- 🧠 **Multi-Agent Collaboration** - Built-in specialized agents (general-purpose, explore, verification)
- 🛠️ **Rich Toolset** - Full base + channel toolset + MCP dynamic tool extension
- 📦 **Context Compaction** - Microcompact (clear old tool results) + full compaction (LLM summary), auto-triggered as context fills
- 🌐 **Web UI Interface** - Browser-based chat interface with `illusion web`, independently usable alongside the terminal
- 🌍 **Bilingual Interface** - Chinese/English auto-switch via `ui_language` setting
- 📝 **Comprehensive Markdown Rendering** - Tables, code blocks, rich text
- 🔌 **Flexible Extension System** - Plugins, hooks, skills, MCP servers
- 🌐 **Built-in Browser** - Agent-drivable browser with live view (desktop) or screenshot stream (web), ARIA snapshots, ref-based interaction, responsive viewport, element picking
- 🔐 **Comprehensive Permission Control** - Three modes + fine-grained rules
```

</details>

**依据 3 · 源码核查**：[pyproject.toml:5-16](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/pyproject.toml#L5-L16)

根 Python 项目身份。

<details>
<summary>查看原文（12行）</summary>

```text
[project]
name = "illusion-agent"
version = "0.5.0"
description = "Where fantasy meets functionality. The best of many worlds, refined into one intelligent agent."
readme = "README.md"
license = "MIT"
requires-python = ">=3.10"
authors = [
    { name = "YunTaiHua", email = "3597489498@qq.com" },
]
keywords = ["ai", "cli", "coding-agent", "claude-code", "llm", "terminal"]
classifiers = [
```

</details>

#### 缺口

- 未对照真实开发任务
  **影响**：不能确定效率和模型效果
  **进一步探讨**：固定模型和任务对照原生命令行及独立工具。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具权限如何决定，显式允许与拒绝规则的顺序是什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

查询执行先验证工具输入、归一化路径与命令，再调用 permission_checker.evaluate；拒绝会变成错误结果，允许后才执行工具。checker 先检查 denied_tools，随后 allowed_tools 直接允许；路径拒绝和 denied_commands 均在 allowed_tools 之后，因此将工具加入 allowed_tools 时不能假定这些后续拒绝继续约束它。若未被提前规则返回，YOLO 在命令拒绝之后绕过沙箱；full_auto 在沙箱检查后，对分类为高风险的操作要求确认，其余允许。以上是选定执行路径和源码顺序，不能证明所有入口、复杂命令识别或操作系统隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/illusion/engine/query.py:1250-1278](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/src/illusion/engine/query.py#L1250-L1278)

输入验证和权限评估。

<details>
<summary>查看原文（29行）</summary>

```text
        parsed_input = tool.input_model.model_validate(tool_input)
    except ValidationError as exc:
        return ToolResultBlock(
            tool_use_id=tool_use_id,
            content=f"Invalid input for {tool_name}: {exc}",
            is_error=True,
        ), hook_additional_contexts, {}

    # 在权限检查前规范化通用工具输入，以便路径规则一致地应用于使用 `file_path` 或 `path` 的内置工具
    _file_path = _resolve_permission_file_path(context.cwd, tool_input, parsed_input)
    _command = _extract_permission_command(tool_input, parsed_input)
    # 评估权限。权限拒绝不终止查询循环：以 error 工具结果返回原因，LLM 可据此调整
    # 后续操作（自主任务不被单次拒绝打断；沙箱硬拦/判官拒绝/人工拒绝/
    # 确认超时统一走此路径）
    try:
        decision = context.permission_checker.evaluate(
            tool_name,
            is_read_only=tool.is_read_only(parsed_input),
            file_path=_file_path,
            command=_command,
        )
        if not decision.allowed:
            # 系统自动阻止（如计划模式）：返回错误结果给模型，不终止查询循环
            if decision.auto_blocked:
                return ToolResultBlock(
                    tool_use_id=tool_use_id,
                    content=f"[Permission blocked] {decision.reason or f'{tool_name} is not allowed in current mode'}",
                    is_error=True,
                ), hook_additional_contexts, {}
```

</details>

**依据 2 · 源码核查**：[src/illusion/engine/query.py:1402-1421](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/src/illusion/engine/query.py#L1402-L1421)

确认与拒绝结果。

<details>
<summary>查看原文（20行）</summary>

```text
            elif decision.requires_confirmation:
                confirmed, deny_reason = await _confirm_permission(
                    context, tool_name, decision, _file_path, _command
                )
                if not confirmed:
                    # 传裸原因：PermissionDenied.reason 由 handler 统一拼
                    # "Permission denied for {tool}:" 前缀，避免双重前缀
                    raise PermissionDenied(tool_name, deny_reason or None)
            else:
                raise PermissionDenied(tool_name, decision.reason or f"Permission denied for {tool_name}")
    except PermissionDenied as exc:
        return ToolResultBlock(
            tool_use_id=tool_use_id,
            content=(
                f"[Permission denied] {exc.tool_name}: {exc.reason}"
                if exc.reason
                else f"[Permission denied] {exc.tool_name}"
            ),
            is_error=True,
        ), hook_additional_contexts, {}
```

</details>

**依据 3 · 源码核查**：[src/illusion/engine/query.py:1423-1451](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/src/illusion/engine/query.py#L1423-L1451)

许可后工具执行。

<details>
<summary>查看原文（29行）</summary>

```text
    # 文件历史：工具执行前回调（备份即将被修改的文件）
    if context.on_before_tool_execute is not None:
        context.on_before_tool_execute(tool_name, tool_input)

    # 进度回调：将进度消息入队（仅当 progress_queue 存在时，即单工具路径）。
    # agent 工具前台模式通过此回调上报子代理的工具调用进度。
    async def _emit_progress(message: str, progress_type: str = "status") -> None:
        if context.progress_queue is not None:
            await context.progress_queue.put((tool_use_id, message, progress_type))

    # 执行工具
    result = await tool.execute(
        parsed_input,
        ToolExecutionContext(
            cwd=context.cwd,
            metadata={
                "tool_registry": context.tool_registry,
                "ask_user_prompt": context.ask_user_prompt,
                "activity_refresher": context.activity_refresher,
                "plan_approval_prompt": context.plan_approval_prompt,
                "permission_checker": context.permission_checker,
                "file_state_cache": context.file_state_cache,
                # 当前模型媒体能力：媒体类工具（read_file 等）据此
                # 做能力守卫（无能力时明确报错而非注入媒体块）
                "model_capabilities": context.capabilities,
                **(context.tool_metadata or {}),
            },
            on_progress=_emit_progress if context.progress_queue is not None else None,
        ),
```

</details>

**依据 4 · 源码核查**：[src/illusion/permissions/checker.py:362-386](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/src/illusion/permissions/checker.py#L362-L386)

工具拒绝、允许和路径拒绝顺序。

<details>
<summary>查看原文（25行）</summary>

```text
        # 计算操作风险等级（删除/还原等高危操作会覆盖会话级允许）。
        # 使用 risk.py 内置默认规则（LOW/MEDIUM/HIGH），不传自定义规则。
        risk = classify_tool_risk(
            tool_name=tool_name,
            is_read_only=is_read_only,
            command=command,
        )
        high_risk = risk == RiskLevel.HIGH

        # 显式的工具拒绝列表
        if tool_name in self._settings.denied_tools:
            return PermissionDecision(allowed=False, reason=f"{tool_name} is explicitly denied", risk=risk)

        # 显式的工具允许列表
        if tool_name in self._settings.allowed_tools:
            return PermissionDecision(allowed=True, reason=f"{tool_name} is explicitly allowed", risk=risk)

        # 检查路径级别规则
        if file_path and self._path_rules:
            for rule in self._path_rules:
                if fnmatch.fnmatch(file_path, rule.pattern) and not rule.allow:
                    return PermissionDecision(
                        allowed=False,
                        reason=f"Path {file_path} matches deny rule: {rule.pattern}",
                        risk=risk,
```

</details>

**依据 5 · 源码核查**：[src/illusion/permissions/checker.py:417-438](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/src/illusion/permissions/checker.py#L417-L438)

命令拒绝和 YOLO 分支。

<details>
<summary>查看原文（22行）</summary>

```text
        # 命令级显式拒绝：denied_commands（如拒绝 "rm -rf /"）。先于 YOLO，
        # 保证 yolo（含渠道等远程入口）下危险命令仍可被显式规则拦截。
        if command:
            for pattern in getattr(self._settings, "denied_commands", []):
                if isinstance(pattern, str) and fnmatch.fnmatch(command, pattern):
                    return PermissionDecision(
                        allowed=False,
                        reason=f"Command matches deny pattern: {pattern}",
                    )

        # YOLO 模式：绕过沙箱完全运行。置于命令级显式拒绝之后、沙箱检查
        # 之前（跳过沙箱限制），但保留显式拒绝规则（用户显式 deny 优先）：
        # denied_tools / 路径 deny 规则 / denied_commands 先于 YOLO 生效，
        # 确保 yolo（含渠道等远程入口）下危险命令仍可被显式规则拦截。
        if self._settings.mode == PermissionMode.YOLO:
            return PermissionDecision(allowed=True, reason="YOLO mode bypasses sandbox", risk=risk)

        # 检查沙箱文件系统限制（对齐 OS 级沙箱语义）
        # 写入：默认拒绝，仅 allow_write 白名单内可写，deny_write 覆盖
        # 读取：默认允许，仅 deny_read 限制
        if file_path and (
            self._sandbox_allow_write or self._sandbox_deny_write or self._sandbox_deny_read
```

</details>

**依据 6 · 源码核查**：[src/illusion/permissions/checker.py:475-500](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/src/illusion/permissions/checker.py#L475-L500)

命令白名单和 full_auto 高风险。

<details>
<summary>查看原文（26行）</summary>

```text
        if command and self._settings.allowed_shell_commands:
            for p in self._settings.allowed_shell_commands:
                if not self._command_matches_allowlist(command, [p]):
                    continue
                # 非高危命令：前缀命中即放行；高危命令：要求白名单项本身即高危模式
                if not high_risk or classify_command_risk(p) == RiskLevel.HIGH:
                    return PermissionDecision(
                        allowed=True,
                        reason=f"Command is in allowed_shell_commands: {p}",
                        risk=risk,
                    )
                # 高危但白名单项仅为普通前缀（如 git push）：不豁免，继续走后续确认流程
                break

        # 完全自动模式：受沙箱限制（上方已检查）且拦高危（内置 HIGH 规则需确认）。
        # 与 YOLO 的区别恒定：auto 永远拦高危，yolo 全部绕过。
        if self._settings.mode == PermissionMode.FULL_AUTO:
            if high_risk:
                return PermissionDecision(
                    allowed=False,
                    requires_confirmation=True,
                    reason="High-risk operations require confirmation in auto mode",
                    high_risk=high_risk,
                    risk=risk,
                )
            return PermissionDecision(allowed=True, reason="Auto mode allows all tools")
```

</details>

#### 缺口

- 未遍历所有入口及复杂工具参数
  **影响**：不能证明规则覆盖全部副作用
  **进一步探讨**：对固定权限配置验证 allowed_tools 与路径/命令拒绝及未识别命令。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可选模型审核和人工回退的条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

可选 auto_review 仅在 full_auto 且开关启用时参与；配置读取失败回退人工确认。模型允许可直接放行，模型拒绝时有人工通道可再次批准；没有通道则维持拒绝。故模型拒绝不是不可覆盖的最终禁止。该路径需要模型、配置和实际交互渠道，作者对多 provider 与宿主的兼容是声明，未运行。首次配置、模型审核、审批及恢复的时间和费用均未知；隔离环境先核规则优先级和确认渠道，无法接受自动或人工放行边界则停用对应模式。

#### 证据与依据

**依据 1 · 源码核查**：[src/illusion/permissions/auto_review.py:23-31](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/src/illusion/permissions/auto_review.py#L23-L31)

配置开关及回退语义。

```text
开关语义（其余模式不受影响）：
    - auto_review 关闭（默认）：full_auto 下高危与沙箱拦截仍走现有人工确认流程
    - auto_review 开启：full_auto 下高危操作与沙箱拦截（工作区外读写）由
      LLM 审核，不再弹出人工确认框
    - yolo / plan / default 模式逻辑保持不变

函数说明：
    - maybe_auto_review: query 层分流入口，不适用/未开启时返回 None（回退人工流程）
    - review_permission: 执行一次 LLM 审核，返回 (是否放行, 原因)
```

**依据 2 · 源码核查**：[src/illusion/permissions/auto_review.py:460-473](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/src/illusion/permissions/auto_review.py#L460-L473)

仅 full_auto 开启且配置读取异常回退。

<details>
<summary>查看原文（14行）</summary>

```text
    # 开关语义：仅 full_auto 模式生效；yolo/plan/default 及关闭状态一律
    # 回退现有人工确认逻辑。模式取产生本次决策的 PermissionChecker 快照
    # （覆盖 CLI --permission-mode/full_auto 等只存在于内存的模式变更），
    # 开关状态实时读磁盘保证 PATCH/斜杠命令修改即时生效。
    checker_mode = getattr(getattr(context, "permission_checker", None), "current_mode", None)
    try:
        perm = load_settings().permission
    except Exception:
        # 配置文件读取失败：无法确认审核开关，回退人工确认（fail-closed
        # 方向——不静默放行也不让异常杀死任务）
        logger.warning("load_settings failed in auto-review dispatch; falling back to manual", exc_info=True)
        return None
    if checker_mode != PermissionMode.FULL_AUTO or not perm.auto_review:
        return None
```

</details>

**依据 3 · 源码核查**：[src/illusion/engine/query.py:115-172](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/src/illusion/engine/query.py#L115-L172)

模型允许和拒绝后人工回退。

<details>
<summary>查看原文（58行）</summary>

```text
async def _confirm_permission(
    context: QueryContext,
    tool_name: str,
    decision: Any,
    file_path: str | None,
    command: str | None,
) -> tuple[bool, str]:
    """确认一次需要人工/自动裁决的权限请求（查询循环内调用）。

    分流优先级：
        1. LLM 自动审核（full_auto + settings.permission.auto_review 开启时）：
           由审核模型先行裁决——ALLOW 直接放行；DENY 不直接终止，降级为
           人工确认（判官意见附进确认文案供用户参考）
        2. 现有人工确认流程（permission_prompt 用户确认弹窗）
        3. 无确认渠道：直接抛 PermissionDenied

    Returns:
        tuple[bool, str]: (是否放行, 拒绝原因)；拒绝原因为空表示无附加原因
    """
    # LLM 自动审核：不适用（非 full_auto / 未开启）时返回 None，回退人工流程
    from illusion.permissions.auto_review import maybe_auto_review

    review_result = await maybe_auto_review(
        context, tool_name, decision, file_path=file_path, command=command
    )
    if review_result is not None:
        allowed, review_reason = review_result
        if allowed:
            return True, ""
        # 判官拒绝：不直接终止任务，降级人工确认做最终裁决；
        # 判官意见附进确认描述，用户可参考后放行或拒绝
        confirm_desc = decision.reason or ""
        if review_reason:
            confirm_desc = (
                f"{confirm_desc} (LLM review denied: {review_reason})"
                if confirm_desc
                else f"LLM review denied: {review_reason}"
            )
        if context.permission_prompt is None:
            # 无人工确认渠道：维持判官拒绝（fail-closed）
            return False, review_reason or "permission review rejected"
        confirmed = await _with_activity_heartbeat(
            context.permission_prompt(tool_name, confirm_desc, decision.high_risk),
            context.activity_refresher,
        )
        if not confirmed:
            return False, f"denied by user after LLM review ({review_reason or 'no reason'})"
        return True, ""
    # 现有人工确认流程
    if context.permission_prompt is not None:
        confirmed = await _with_activity_heartbeat(
            context.permission_prompt(tool_name, decision.reason, decision.high_risk),
            context.activity_refresher,
        )
        if not confirmed:
            return False, decision.reason or ""
        return True, ""
    raise PermissionDenied(tool_name, decision.reason or f"Permission denied for {tool_name}")
```

</details>

**依据 4 · 源码核查**：[pyproject.toml:5-11](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/pyproject.toml#L5-L11)

项目版本及 Python 要求。

```text
[project]
name = "illusion-agent"
version = "0.5.0"
description = "Where fantasy meets functionality. The best of many worlds, refined into one intelligent agent."
readme = "README.md"
license = "MIT"
requires-python = ">=3.10"
```

#### 缺口

- 没有运行模型审核、审批或不同入口
  **影响**：不能判断延迟、误判和跨平台可靠性
  **进一步探讨**：隔离任务分别测试允许、拒绝、无审批渠道及网络失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证允许列表与细粒度拒绝规则的组合？

**研究主题**：新假设与验证

#### 完整回答

假设提供配置预览，明确列出工具级允许将先于路径和命令拒绝返回，并可选择拒绝优先策略，能够减少操作者误解；该策略不是当前实现。对照现有顺序和显式拒绝优先，在同一组工具、路径、复合命令及配置下记录误放行、误拒、理解时间和迁移冲突；若误放行没有下降或破坏既有受控用例则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/illusion/permissions/checker.py:371-386](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/src/illusion/permissions/checker.py#L371-L386)

工具级允许先于路径拒绝。

<details>
<summary>查看原文（16行）</summary>

```text
        # 显式的工具拒绝列表
        if tool_name in self._settings.denied_tools:
            return PermissionDecision(allowed=False, reason=f"{tool_name} is explicitly denied", risk=risk)

        # 显式的工具允许列表
        if tool_name in self._settings.allowed_tools:
            return PermissionDecision(allowed=True, reason=f"{tool_name} is explicitly allowed", risk=risk)

        # 检查路径级别规则
        if file_path and self._path_rules:
            for rule in self._path_rules:
                if fnmatch.fnmatch(file_path, rule.pattern) and not rule.allow:
                    return PermissionDecision(
                        allowed=False,
                        reason=f"Path {file_path} matches deny rule: {rule.pattern}",
                        risk=risk,
```

</details>

**依据 2 · 源码核查**：[src/illusion/permissions/checker.py:417-425](https://github.com/YunTaiHua/illusion-agent/blob/c0461d84414cc7e1f7f7bde372c7c0bc348d44be/src/illusion/permissions/checker.py#L417-L425)

命令拒绝在后续。

```text
        # 命令级显式拒绝：denied_commands（如拒绝 "rm -rf /"）。先于 YOLO，
        # 保证 yolo（含渠道等远程入口）下危险命令仍可被显式规则拦截。
        if command:
            for pattern in getattr(self._settings, "denied_commands", []):
                if isinstance(pattern, str) and fnmatch.fnmatch(command, pattern):
                    return PermissionDecision(
                        allowed=False,
                        reason=f"Command matches deny pattern: {pattern}",
                    )
```

#### 缺口

- 未实现替代策略或对照
  **影响**：不能判断其安全价值和兼容代价
  **进一步探讨**：在隔离环境对照规则优先级及真实执行结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
