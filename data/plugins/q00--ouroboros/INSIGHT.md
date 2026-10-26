# Ouroboros 规格先行引擎

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[05d2718](https://github.com/Q00/ouroboros/tree/05d2718de3edf7ba25de920c78652f646b7a9704)

<!-- BEGIN META -->
[![GitHub ★ 6,272](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C272&color=yellow&logo=github&style=flat)](https://github.com/Q00/ouroboros)
<!-- END META -->

> **实现功能**：通过访谈、固定Seed、执行与多阶段评估组织AI软件开发任务，提供CLI和MCP接口。

> **核心亮点**：[Q03](#research-q03)识别的贡献是不可变目标、执行迭代和证据门槛的组合，相对人工清单+单Agent提供统一事件化编排；并非规格、CI或MCP概念原创。价值成立于验收可执行且命令覆盖实际目标，简单任务可能无需该层。

> **风险与缺陷**：[Q04](#research-q04)说明实际执行绿灯仍不证明业务覆盖；跨验收项共享Stage1依赖严格不变量，模型意见不得提升证据但也不能填补错误验收。根仓库审阅只是关键路径，不等于全运行时审计。

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
  - [Q01 · 规格先行引擎面向什么交付任务，完成不等于什么？](#detail-section-11)
  - [Q02 · Seed和评估流水线如何约束通过判定？](#detail-section-12)
  - [Q03 · 相对人工验收清单加单Agent，实质增量是什么？](#detail-section-13)
  - [Q04 · 机械证据与模型审阅为何仍可能放过错误结果？](#detail-section-14)
  - [Q05 · 独立引擎与DSH桥的条件怎样避免混淆？](#detail-section-15)
  - [Q06 · 长任务编排的额外负担与退出路径是什么？](#detail-section-16)
  - [Q07 · 哪些设计能迁移，哪些复杂性不能由行数消除？](#detail-section-17)
  - [Q08 · 能否为每个验收项附“检查覆盖证明”？](#detail-section-18)
  - [Q09 · 哪些人能限定试用，何时停止编排？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：根项目是Python规格先行开发引擎，不是根路径可直接安装的DSH插件。面向需求含糊、需要把访谈结论变成固定验收标准再交给编码运行时的开发者。合格结果必须包含Seed、实现产物和实际可追溯验证，模型讨论或ambiguous分数下降都不等于工作代码。简单基线是人工写验收清单、让单Agent实现并运行测试；本项目增加事件化执行和多阶段评估，需求与最终效益仍需独立任务验证。

贡献在于把不可变目标、可演进执行、机械证据与模型否决分离，并集中形成可记录的评估结论。人工清单同样能定义目标，CI同样能测试，因此不是规格或测试的原创；增量是让跨运行时长任务拥有统一契约和事件反馈。该增量依赖标准可观测、检查命令正确且覆盖真实任务；相对简单任务可能增加访谈和编排开销，不证明总质量更高。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 访谈与Seed | 固定目标与验收方向 | 模型后端与明确需求输入 |
| 执行和评估 | 集中机械证据及模型审阅 | 需正确检查命令和runtime |
| 状态与查询 | 记录执行及失败原因 | 依赖数据库/事件存储 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python3.12与核心包 | 必需 | 运行引擎 | 不启动 |
| 模型后端/runtime | 对应流程必需 | 访谈和执行 | 不能只凭工具注册继续 |
| 有覆盖的检查命令 | 验收必需 | 机械证据 | 不应靠模型意见通过 |
| MCP2与SDK MCP1独立环境 | 对应集成必需 | 避免依赖冲突 | 不混选extras |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户配置runtime和检查 | 依赖与预算明确 |
| 2 | 访谈固定Seed | 目标和验收可执行 |
| 3 | 执行并评估 | 独立核对产物和证据，失败停编排 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Python及runtime | 配置后端和机械检查 | 时间未知 |
| 持续 | 多轮模型和数据库 | 写验收/审核失败 | 合格交付成本未知 |
| 失败恢复 | 日志/Seed/数据库保留 | 人工定位并接管 | 不承诺自动修好 |
| 退出 | 项目代码和Git保留 | dry-run/keep-data后卸载 | 卸载不撤回代码 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 规格约束 | Seed不变方向契约 | 访谈是否保留真实意图 |
| 证据门槛 | 机械与模型批准分离 | 检查是否覆盖业务 |
| 自动交付 | 工具编排和评估存在 | 比单Agent净收益与预算 |

> **思考**：[Q04](#research-q04)说明实际执行绿灯仍不证明业务覆盖；跨验收项共享Stage1依赖严格不变量，模型意见不得提升证据但也不能填补错误验收。根仓库审阅只是关键路径，不等于全运行时审计。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03)识别的贡献是不可变目标、执行迭代和证据门槛的组合，相对人工清单+单Agent提供统一事件化编排；并非规格、CI或MCP概念原创。价值成立于验收可执行且命令覆盖实际目标，简单任务可能无需该层。

[Q03](#research-q03)识别的贡献是不可变目标、执行迭代和证据门槛的组合，相对人工清单+单Agent提供统一事件化编排；并非规格、CI或MCP概念原创。价值成立于验收可执行且命令覆盖实际目标，简单任务可能无需该层。

值得借鉴的是Result类型化失败、不完整artifact扫描拒绝评价、单点最终批准和共享机械检查不变量。把接受状态与模型意见分离，使审阅不会静默升级证据；移植需要携带检查覆盖、事件身份和运行时取消等约束。仓库范围很大，本轮只审阅Seed、MCP组装和评估关键路径，inventory即使全仓统计也不是全源码安全审计，Python还不纳入JS/TS行数口径。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04)说明实际执行绿灯仍不证明业务覆盖；跨验收项共享Stage1依赖严格不变量，模型意见不得提升证据但也不能填补错误验收。根仓库审阅只是关键路径，不等于全运行时审计。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合愿意写明确验收且已有模型runtime的开发者，在可丢弃项目先只完成访谈→Seed→一个可自动检查的小改动，独立核对产物与检查覆盖。若只得到模型赞同、机械证据缺失、预算失控或验收不对应任务，就停止自动执行，保留Seed/数据库/日志并用人工清单和单Agent接管。不要把目录收录的根仓库当DSH可直接安装bundle。 依据 [Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前贡献由固定源码支持并含解释判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、src/ouroboros/core/seed.py、src/ouroboros/mcp/tools/definitions.py、src/ouroboros/evaluation/pipeline.py、integrations/dsh-plugin/README.md、UNINSTALL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定提交源码、README、配置与相关测试定义；未安装或执行目标代码，未进行真实宿主验收。
- 下一步：未验证假设是把每个验收项绑定可执行检查、产物路径和反例集合，禁止仅复用一个project-wide绿灯便解释为全部验收成立。由共享Stage1不变量与目标覆盖缺口推导，相对当前统一证据门槛增加的是证据与具体目标的覆盖关系。最小验证为同一实现分别注入“测试绿但业务错”“产物缺失”“非目标测试失败”，对照原流程和覆盖映射的误放行率及新增维护；如果映射仍被空检查绕过或维护耗时抵消收益，则否定。

**分析版本**

- **仓库**：[Q00/ouroboros](https://github.com/Q00/ouroboros)
- **版本号**：未声明（[固定提交 05d2718](https://github.com/Q00/ouroboros/tree/05d2718de3edf7ba25de920c78652f646b7a9704)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08)提出未验证的逐验收项检查覆盖映射，用测试绿但业务错、产物缺失等反例测误放行率和维护负担，反证可直接否定增加这一层的价值。

未验证假设是把每个验收项绑定可执行检查、产物路径和反例集合，禁止仅复用一个project-wide绿灯便解释为全部验收成立。由共享Stage1不变量与目标覆盖缺口推导，相对当前统一证据门槛增加的是证据与具体目标的覆盖关系。最小验证为同一实现分别注入“测试绿但业务错”“产物缺失”“非目标测试失败”，对照原流程和覆盖映射的误放行率及新增维护；如果映射仍被空检查绕过或维护耗时抵消收益，则否定。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 226 | 52318 | — | — | 399171 |
| .md | example | 6 | 348 | — | — | 1431 |
| .cjs | source | 1 | 90 | 79 | 1 | — |
| .ts | source | 2 | 987 | 788 | 115 | — |
| .ts | test | 1 | 1904 | 1654 | 56 | — |
| .md | test | 6 | 700 | — | — | 4239 |
| .js | test | 2 | 116 | 96 | 0 | — |
| .cjs | test | 1 | 178 | 163 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/Q00/ouroboros/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本判断Ouroboros 规格先行引擎的贡献、关键质疑与可控采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 规格先行引擎面向什么交付任务，完成不等于什么？

**研究主题**：场景与需求

#### 完整回答

根项目是Python规格先行开发引擎，不是根路径可直接安装的DSH插件。面向需求含糊、需要把访谈结论变成固定验收标准再交给编码运行时的开发者。合格结果必须包含Seed、实现产物和实际可追溯验证，模型讨论或ambiguous分数下降都不等于工作代码。简单基线是人工写验收清单、让单Agent实现并运行测试；本项目增加事件化执行和多阶段评估，需求与最终效益仍需独立任务验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:81-121](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/README.md#L81-L121)

根项目角色与规格先行工作流

<details>
<summary>查看原文（41行）</summary>

````text
**Turn a vague idea into a verified, working codebase -- across Claude Code, Codex CLI, OpenCode, Hermes, Gemini, Kiro, Copilot, Pi, OMP, Zcode, Goose, GJC, Antigravity, and Grok.**

Ouroboros is an **Agent OS** for AI coding: a local-first runtime layer that
turns non-deterministic agent work into a replayable, observable, policy-bound
execution contract. It replaces ad-hoc prompting with a structured
specification-first workflow: interview, crystallize, execute, evaluate,
evolve.

---

## The Ouroboros Agent OS Stack

Like any OS, Ouroboros is split into a stable **OS layer** of primitives, an
**application layer** of domain workflows, and a **shell** that humans actually
sit in front of. Three repos, one stack:

| Layer | Repo | Role | What it gives you |
| :--- | :--- | :--- | :--- |
| **Shell** (terminal client) | [`Ouro-labs/ourocode`](https://github.com/Ouro-labs/ourocode) | Native terminal UI for running `ooo` workflows across Claude / Codex / Gemini CLIs in one session | TUI, wonderTool decision pickers, MCP pane state, command discovery |
| **Apps** (domain workflows) | [`Ouro-labs/ouroboros-plugins`](https://github.com/Ouro-labs/ouroboros-plugins) | UserLevel plugin contract — composes core primitives into installable domain programs (PR ops, Jira sync, incidents, releases) | Plugin manifest, scoped permissions, audit/provenance, reference plugins |
| **OS** (this repo) | [`Q00/ouroboros`](https://github.com/Q00/ouroboros) | Agent OS core — Seed, Ledger, Runtime, MCP, safety boundaries | `ooo` commands, spec-first workflow engine, multi-runtime adapter |

**How they connect:**

```
  ourocode  ──►  ooo / ouroboros-plugins  ──►  ouroboros core (Seed · Ledger · MCP · Runtime)
   shell             user-level apps                        kernel
```

- The **kernel** (`ouroboros`) owns the contract: every action becomes a
  Seed-bound, ledger-recorded, replayable event — regardless of which LLM
  executes it.
- **Plugins** (`ouroboros-plugins`) declare scoped capabilities against that
  contract, so domain workflows (review a PR, triage a Linear ticket, run a
  release) stay auditable and policy-bound instead of being one-off prompts.
- **Ourocode** is the terminal shell: it surfaces MCP state, interview
  questions, and wonderTool decisions as first-class TUI elements, so you can
  drive the OS without leaving the keyboard or switching between CLIs.

Use `ouroboros` alone with any supported CLI, layer plugins on for domain
workflows, or install `ourocode` when you want a unified terminal cockpit.
````

</details>

**依据 2 · 源码核查**：[pyproject.toml:1-9](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/pyproject.toml#L1-L9)

Python包身份和版本要求

```text
[project]
name = "ouroboros-ai"
dynamic = ["version"]
description = "Pins an acceptance spec and omits any verify command or expected output from the worker's contract. Works with Claude Code, Codex CLI, OpenCode and 10 more runtimes."
readme = "README.md"
authors = [
    { name = "Q00", email = "jqyu.lee@gmail.com" }
]
requires-python = ">=3.12"
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Seed和评估流水线如何约束通过判定？

**研究主题**：功能与机制

#### 完整回答

Seed模型声明方向和验收条件不可变，允许ontology在迭代中演化。MCP工厂分别组合authoring/execution/evaluation/query/job处理器；评估先拒绝不完整artifact扫描，再执行或复用project-wide机械检查，实际执行失败立即终止，语义模型评估仅为advisory。最终_build_result统一调用decide_final_approval，并把通过状态、阶段与失败原因写完成事件，避免某个模型意见单独铸造通过。源码展示控制流，不证明每个调用方都实际收集足够证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/core/seed.py:1-14](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/core/seed.py#L1-L14)

Seed不变方向契约

<details>
<summary>查看原文（14行）</summary>

```text
"""Immutable Seed schema for workflow execution.

The Seed is the "constitution" of a workflow - an immutable specification
generated from the Big Bang interview phase when ambiguity score <= 0.2.

Key properties:
- Seed.direction (goal, constraints, acceptance_criteria) is IMMUTABLE
- Effective ontology can evolve with consensus during iterations
- Contains all information needed to execute and evaluate the workflow

This module defines:
- Seed: The immutable Pydantic model with frozen=True
- SeedMetadata: Version and creation metadata
- Supporting types for seed components
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/mcp/tools/definitions.py:1-20](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/mcp/tools/definitions.py#L1-L20)

工具职责拆分

<details>
<summary>查看原文（20行）</summary>

```text
"""Ouroboros tool definitions for MCP server.

This module re-exports all handler classes from their dedicated modules
and provides the :func:`get_ouroboros_tools` factory that assembles
the default handler tuple for MCP registration.


Handler modules:
- execution_handlers: ExecuteSeedHandler, StartExecuteSeedHandler
- query_handlers: SessionStatusHandler, QueryEventsHandler, ACDashboardHandler
- project_status_handler: ProjectStatusHandler
- projection_handlers: ProjectionQueryHandler
- authoring_handlers: GenerateSeedHandler, InterviewHandler
- evaluation_handlers: MeasureDriftHandler, EvaluateHandler, LateralThinkHandler
- evolution_handlers: EvolveStepHandler, StartEvolveStepHandler,
                      EvolveRewindHandler, LineageStatusHandler
- ralph_handlers: RalphHandler
- job_handlers: CancelExecutionHandler, JobStatusHandler, JobWaitHandler,
                JobResultHandler, CancelJobHandler
- qa: QAHandler
```

</details>

**依据 3 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:136-203](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/evaluation/pipeline.py#L136-L203)

不完整扫描和执行失败/语义边界

<details>
<summary>查看原文（68行）</summary>

```text
        if context.artifact_bundle is not None and not context.artifact_bundle.scan_complete:
            return Result.err(
                ValidationError(
                    "Artifact collection is incomplete; evaluation refused to avoid judging a partial workspace scan.",
                    field="artifact_bundle",
                    details={"scan_error": context.artifact_bundle.scan_error},
                )
            )

        events: list[BaseEvent] = []
        stage2_result = None
        stage3_result = None

        # Stage 1: Mechanical Verification
        # When a pre-computed result is injected, skip re-running the
        # AC-agnostic lint/build/test checks.
        if stage1_result is None and self._config.stage1_enabled:
            result = await self._mechanical.verify(
                context.execution_id,
                checks=list(COMMAND_CHECK_TYPES),
            )
            if result.is_err:
                return Result.err(result.error)

            stage1_result, stage1_events = result.value
            events.extend(stage1_events)

        # What the controller already ran for this criterion (its recorded
        # check package decision) is executed evidence for this criterion
        # only; the one classifier decides over it and the command checks.
        if context.recorded_checks:
            base = stage1_result or MechanicalResult(passed=True, checks=())
            stage1_result = base.with_recorded(context.recorded_checks)

        # Only an executed failure stops here. A result with no executed
        # evidence continues so the advisory review can supply feedback;
        # the acceptance gate still refuses to approve it.
        if (
            stage1_result is not None
            and stage1_result.disposition is MechanicalDisposition.EXECUTED_FAIL
        ):
            return self._build_result(
                context.execution_id,
                events,
                stage1_result=stage1_result,
            )

        # Stage 2: Semantic Evaluation (advisory). It still runs when Stage 1
        # produced no executed evidence: its review becomes the feedback that
        # accompanies an unverified result, not a verdict.
        if self._config.stage2_enabled:
            result = await self._semantic.evaluate(context, stage1_result)
            if result.is_err:
                return Result.err(result.error)

            stage2_result, stage2_events = result.value
            events.extend(stage2_events)

            # Stage 2 withheld on compliance. trigger_consensus still asks
            # Stage 3 for a second opinion that is reported, but a consensus
            # approval cannot lift this block.
            if not stage2_result.ac_compliance and not context.trigger_consensus:
                return self._build_result(
                    context.execution_id,
                    events,
                    stage1_result=stage1_result,
                    stage2_result=stage2_result,
                )
```

</details>

**依据 4 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:258-318](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/evaluation/pipeline.py#L258-L318)

最终通过统一入口

<details>
<summary>查看原文（61行）</summary>

```text
    def _build_result(
        self,
        execution_id: str,
        events: list[BaseEvent],
        stage1_result: MechanicalResult | None = None,
        stage2_result: SemanticResult | None = None,
        stage3_result: ConsensusResult | None = None,
    ) -> Result[EvaluationResult, ValidationError]:
        """Build the final evaluation result.

        Approval is decided here and nowhere else, by
        ``decide_final_approval``: executed Stage 1 evidence grants it, and
        any model review that ran (Stage 2 compliance or score, Stage 3
        consensus, the reward-hacking veto) may withhold it. No caller passes
        an approval in, so no branch can mint one from a model verdict.

        Args:
            execution_id: Execution identifier
            events: Collected events
            stage1_result: Stage 1 result if completed
            stage2_result: Stage 2 result if completed
            stage3_result: Stage 3 result if triggered

        Returns:
            Result containing EvaluationResult
        """
        final_approved = decide_final_approval(
            stage1_result=stage1_result,
            stage2_result=stage2_result,
            stage3_result=stage3_result,
        )

        # Calculate highest stage before creating immutable result
        highest_stage = 0
        if stage1_result is not None:
            highest_stage = 1
        if stage2_result is not None:
            highest_stage = 2
        if stage3_result is not None:
            highest_stage = 3

        # Calculate failure reason before creating immutable result.  Shared
        # with ``EvaluationResult.failure_reason`` so the two surfaces cannot
        # drift: this one is built before the result exists, that one after.
        failure_reason = build_failure_reason(
            final_approved=final_approved,
            stage1_result=stage1_result,
            stage2_result=stage2_result,
            stage3_result=stage3_result,
        )

        # Create completion event
        completion_event = create_pipeline_completed_event(
            execution_id=execution_id,
            final_approved=final_approved,
            highest_stage=highest_stage,
            failure_reason=failure_reason,
            acceptance_state=derive_acceptance_state(
                final_approved=final_approved,
                stage1_result=stage1_result,
            ).value,
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对人工验收清单加单Agent，实质增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

贡献在于把不可变目标、可演进执行、机械证据与模型否决分离，并集中形成可记录的评估结论。人工清单同样能定义目标，CI同样能测试，因此不是规格或测试的原创；增量是让跨运行时长任务拥有统一契约和事件反馈。该增量依赖标准可观测、检查命令正确且覆盖真实任务；相对简单任务可能增加访谈和编排开销，不证明总质量更高。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/core/seed.py:1-14](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/core/seed.py#L1-L14)

目标和ontology分离

<details>
<summary>查看原文（14行）</summary>

```text
"""Immutable Seed schema for workflow execution.

The Seed is the "constitution" of a workflow - an immutable specification
generated from the Big Bang interview phase when ambiguity score <= 0.2.

Key properties:
- Seed.direction (goal, constraints, acceptance_criteria) is IMMUTABLE
- Effective ontology can evolve with consensus during iterations
- Contains all information needed to execute and evaluate the workflow

This module defines:
- Seed: The immutable Pydantic model with frozen=True
- SeedMetadata: Version and creation metadata
- Supporting types for seed components
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:163-203](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/evaluation/pipeline.py#L163-L203)

实际执行证据与advisory区分

<details>
<summary>查看原文（41行）</summary>

```text
        # What the controller already ran for this criterion (its recorded
        # check package decision) is executed evidence for this criterion
        # only; the one classifier decides over it and the command checks.
        if context.recorded_checks:
            base = stage1_result or MechanicalResult(passed=True, checks=())
            stage1_result = base.with_recorded(context.recorded_checks)

        # Only an executed failure stops here. A result with no executed
        # evidence continues so the advisory review can supply feedback;
        # the acceptance gate still refuses to approve it.
        if (
            stage1_result is not None
            and stage1_result.disposition is MechanicalDisposition.EXECUTED_FAIL
        ):
            return self._build_result(
                context.execution_id,
                events,
                stage1_result=stage1_result,
            )

        # Stage 2: Semantic Evaluation (advisory). It still runs when Stage 1
        # produced no executed evidence: its review becomes the feedback that
        # accompanies an unverified result, not a verdict.
        if self._config.stage2_enabled:
            result = await self._semantic.evaluate(context, stage1_result)
            if result.is_err:
                return Result.err(result.error)

            stage2_result, stage2_events = result.value
            events.extend(stage2_events)

            # Stage 2 withheld on compliance. trigger_consensus still asks
            # Stage 3 for a second opinion that is reported, but a consensus
            # approval cannot lift this block.
            if not stage2_result.ac_compliance and not context.trigger_consensus:
                return self._build_result(
                    context.execution_id,
                    events,
                    stage1_result=stage1_result,
                    stage2_result=stage2_result,
                )
```

</details>

**依据 3 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:258-318](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/evaluation/pipeline.py#L258-L318)

统一结果生成

<details>
<summary>查看原文（61行）</summary>

```text
    def _build_result(
        self,
        execution_id: str,
        events: list[BaseEvent],
        stage1_result: MechanicalResult | None = None,
        stage2_result: SemanticResult | None = None,
        stage3_result: ConsensusResult | None = None,
    ) -> Result[EvaluationResult, ValidationError]:
        """Build the final evaluation result.

        Approval is decided here and nowhere else, by
        ``decide_final_approval``: executed Stage 1 evidence grants it, and
        any model review that ran (Stage 2 compliance or score, Stage 3
        consensus, the reward-hacking veto) may withhold it. No caller passes
        an approval in, so no branch can mint one from a model verdict.

        Args:
            execution_id: Execution identifier
            events: Collected events
            stage1_result: Stage 1 result if completed
            stage2_result: Stage 2 result if completed
            stage3_result: Stage 3 result if triggered

        Returns:
            Result containing EvaluationResult
        """
        final_approved = decide_final_approval(
            stage1_result=stage1_result,
            stage2_result=stage2_result,
            stage3_result=stage3_result,
        )

        # Calculate highest stage before creating immutable result
        highest_stage = 0
        if stage1_result is not None:
            highest_stage = 1
        if stage2_result is not None:
            highest_stage = 2
        if stage3_result is not None:
            highest_stage = 3

        # Calculate failure reason before creating immutable result.  Shared
        # with ``EvaluationResult.failure_reason`` so the two surfaces cannot
        # drift: this one is built before the result exists, that one after.
        failure_reason = build_failure_reason(
            final_approved=final_approved,
            stage1_result=stage1_result,
            stage2_result=stage2_result,
            stage3_result=stage3_result,
        )

        # Create completion event
        completion_event = create_pipeline_completed_event(
            execution_id=execution_id,
            final_approved=final_approved,
            highest_stage=highest_stage,
            failure_reason=failure_reason,
            acceptance_state=derive_acceptance_state(
                final_approved=final_approved,
                stage1_result=stage1_result,
            ).value,
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 机械证据与模型审阅为何仍可能放过错误结果？

**研究主题**：缺陷与关键质疑

#### 完整回答

机械检查是否执行与是否覆盖业务目标是两回事。流水线说明共享Stage1必须AC-agnostic，一旦加入按验收项筛选的检查，这种跨AC复用就不正确，调用方必须同步改。即便有实际执行结果，测试范围窄、验收写错或隐藏副作用仍可能使通过与用户需求脱节。模型只能收窄而不能替代机械证据是有力设计，但不能推导“verified working codebase”的普遍保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:109-143](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/evaluation/pipeline.py#L109-L143)

共享机械结果的严格不变量

<details>
<summary>查看原文（35行）</summary>

```text
        """Run the evaluation pipeline.

        Args:
            context: Evaluation context with artifact
            trigger_context: Optional pre-populated trigger context
            stage1_result: Pre-computed Stage 1 result.  When provided,
                Stage 1 mechanical verification is skipped and this result
                is reused.  This allows multi-AC callers to run
                lint/build/test once and share the outcome across parallel
                semantic evaluations.

                INVARIANT: Stage 1 checks (lint, build, test, static
                analysis, coverage) must be AC-agnostic — they verify
                project-wide code quality, not AC-specific behavior.  The
                multi-AC checklist path (``_handle_multi_ac`` in
                ``EvaluateHandler``, introduced in #385) relies on this
                invariant to run Stage 1 exactly once across all ACs and
                share the result via this parameter.

                If future Stage 1 additions become AC-specific (e.g.
                AC-tagged test filtering or per-AC coverage thresholds),
                this dedup becomes incorrect and the multi-AC caller must
                be updated to run Stage 1 per AC again.

        Returns:
            Result containing EvaluationResult or error
        """
        if context.artifact_bundle is not None and not context.artifact_bundle.scan_complete:
            return Result.err(
                ValidationError(
                    "Artifact collection is incomplete; evaluation refused to avoid judging a partial workspace scan.",
                    field="artifact_bundle",
                    details={"scan_error": context.artifact_bundle.scan_error},
                )
            )
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:170-203](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/evaluation/pipeline.py#L170-L203)

证据和语义评估边界

<details>
<summary>查看原文（34行）</summary>

```text
        # Only an executed failure stops here. A result with no executed
        # evidence continues so the advisory review can supply feedback;
        # the acceptance gate still refuses to approve it.
        if (
            stage1_result is not None
            and stage1_result.disposition is MechanicalDisposition.EXECUTED_FAIL
        ):
            return self._build_result(
                context.execution_id,
                events,
                stage1_result=stage1_result,
            )

        # Stage 2: Semantic Evaluation (advisory). It still runs when Stage 1
        # produced no executed evidence: its review becomes the feedback that
        # accompanies an unverified result, not a verdict.
        if self._config.stage2_enabled:
            result = await self._semantic.evaluate(context, stage1_result)
            if result.is_err:
                return Result.err(result.error)

            stage2_result, stage2_events = result.value
            events.extend(stage2_events)

            # Stage 2 withheld on compliance. trigger_consensus still asks
            # Stage 3 for a second opinion that is reported, but a consensus
            # approval cannot lift this block.
            if not stage2_result.ac_compliance and not context.trigger_consensus:
                return self._build_result(
                    context.execution_id,
                    events,
                    stage1_result=stage1_result,
                    stage2_result=stage2_result,
                )
```

</details>

**依据 3 · 作者声明**：[README.md:81-87](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/README.md#L81-L87)

作者总交付主张

```text
**Turn a vague idea into a verified, working codebase -- across Claude Code, Codex CLI, OpenCode, Hermes, Gemini, Kiro, Copilot, Pi, OMP, Zcode, Goose, GJC, Antigravity, and Grok.**

Ouroboros is an **Agent OS** for AI coding: a local-first runtime layer that
turns non-deterministic agent work into a replayable, observable, policy-bound
execution contract. It replaces ad-hoc prompting with a structured
specification-first workflow: interview, crystallize, execute, evaluate,
evolve.
```

#### 缺口

- 实际项目中验收项与机械检查的语义覆盖率未知
  **影响**：无法确认通过状态等同用户需求已兑现
  **进一步探讨**：固定含隐藏反例的任务，对照人工验收及引擎通过状态逐项审计

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 独立引擎与DSH桥的条件怎样避免混淆？

**研究主题**：依赖、兼容与流程

#### 完整回答

根包要求Python3.12，核心依赖SQLite/SQLAlchemy、Pydantic和异步运行栈；具体模型和执行runtime需另外配置。mcp extra固定2.2.0，而claude SDK一侧固定MCP1.x，pyproject明确不可同解释器混用；DSH桥是另一个子目录组件，不代表根项目本身带DSH插件入口。实际文件写入/子进程权限和模型凭据来自所选运行时，声明多平台不等于本轮验收。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:38-59](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/pyproject.toml#L38-L59)

核心依赖

<details>
<summary>查看原文（22行）</summary>

```text
dependencies = [
    "aiosqlite>=0.20.0,<1.0.0",
    "anyio>=4.0.0,<5.0.0",
    "click>=8.1.0,<9.0.0",
    "jsonschema>=4.21.0,<5.0.0",
    "packaging>=25.0,<27.0",
    "pydantic>=2.0.0,<3.0.0",
    "prompt-toolkit>=3.0.0,<4.0.0",
    # Ceiling is deliberately tighter than the major-version bounds around it:
    # this parses `.env`, a documented trust boundary (see
    # `UNTRUSTED_ENV_DENYLIST` in config/untrusted_env.py), so only patch releases
    # flow without review. An exact pin would be tighter still, but
    # `test_runtime_and_optional_dependencies_have_upper_bounds` reserves
    # `==` for the optional extras; core runtime deps stay bounded ranges.
    # uv.lock pins the exact version for reproducible installs regardless.
    "python-dotenv>=1.2.2,<1.3.0",
    "pyyaml>=6.0.0,<7.0.0",
    "rich>=13.0.0,<16.0.0",
    "sqlalchemy[asyncio]>=2.0.0,<3.0.0",
    "structlog>=24.0.0,<27.0.0",
    "typer>=0.12.0,<0.28.0",
]
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:67-94](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/pyproject.toml#L67-L94)

可选环境隔离与CLI入口

<details>
<summary>查看原文（28行）</summary>

```text
[project.optional-dependencies]
# Exact-pinned (not ranges) on purpose: a future compromised "latest" must not
# be auto-pulled on a fresh PyPI install (pipx / uv tool / pip resolve from
# this metadata, NOT from uv.lock). Motivated by the 2026-03 litellm
# 1.82.7/1.82.8 supply-chain incident. Updates land via reviewed Dependabot
# PRs; uv.lock additionally hash-pins the full transitive graph for repo/CI.
# Claude's default runtime preserves the Agent SDK and its MCP 1.x graph. The
# MCP 2 server runs in a separate process/profile; these extras must never be
# selected in one interpreter.
# claude-agent-sdk 0.2.144 dropped its own MCP 1.x ceiling; the profile
# contract (MCP 1.x graph) is preserved by pinning it here explicitly.
claude = ["claude-agent-sdk==0.2.165", "anthropic==1.13.0", "mcp==1.28.1"]
claude-cli = []
# Explicit alias for automation and migrations that want to spell out the SDK
# transport rather than rely on the historical `[claude]` name.
claude-sdk = ["claude-agent-sdk==0.2.165", "anthropic==1.13.0", "mcp==1.28.1"]
copilot = []
litellm = ["litellm==1.91.0; python_version < '3.14'"]
dashboard = []
mcp = ["mcp==2.2.0"]
tui = ["textual==8.2.8", "textual-serve==1.1.3"]
# `[all]` remains the MCP 1.x application bundle. The MCP 2 server profile is
# explicit and isolated; `[all,mcp]` is intentionally unsupported.
all = ["ouroboros-ai[claude,copilot,litellm,tui,dashboard]"]

[project.scripts]
ooo = "ouroboros.cli.entrypoint:main"
ouroboros = "ouroboros.cli.entrypoint:main"
```

</details>

**依据 3 · 作者声明**：[integrations/dsh-plugin/README.md:10-24](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/integrations/dsh-plugin/README.md#L10-L24)

DSH桥独立config-only

<details>
<summary>查看原文（15行）</summary>

```text
This is a **config-only bundle**: it contains no custom plugin code, just one
row that mounts dsh's existing `@deepseek-ai/dsh-mcp-client` against
`ouroboros mcp serve`.

## Requirements

- [`uv`](https://astral.sh/uv) on `PATH`. Nothing else — `uvx` fetches and
  runs Ouroboros in an isolated environment on first launch, no `pip install`
  step.
- Python >= 3.12 (whatever `uv` resolves).
- Nothing else for execution: this bundle defaults `OUROBOROS_AGENT_RUNTIME`
  to `host`, so dsh's own model does `ooo run`/`ooo auto`'s execution step —
  no CLI to install. Set `OUROBOROS_AGENT_RUNTIME` (see below) to an
  executable runtime (`claude-cli`, `codex`, `opencode`, ...) if you'd rather
  have that CLI do the work instead.
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 长任务编排的额外负担与退出路径是什么？

**研究主题**：效果与总成本

#### 完整回答

首次包括Python/包、模型runtime及项目验证命令配置；持续会有访谈、执行、语义评估和可能共识的多轮调用，不能从重复测试共享就估算节费。数据目录保存数据库、seeds、日志、locks和凭据；卸载有dry-run与keep-data选项，但不撤销项目代码和Git历史，必须先保存状态再退回人工流程。现金、token和恢复时间未测，不能把local-first当低资源成本。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:38-59](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/pyproject.toml#L38-L59)

运行资源依赖

<details>
<summary>查看原文（22行）</summary>

```text
dependencies = [
    "aiosqlite>=0.20.0,<1.0.0",
    "anyio>=4.0.0,<5.0.0",
    "click>=8.1.0,<9.0.0",
    "jsonschema>=4.21.0,<5.0.0",
    "packaging>=25.0,<27.0",
    "pydantic>=2.0.0,<3.0.0",
    "prompt-toolkit>=3.0.0,<4.0.0",
    # Ceiling is deliberately tighter than the major-version bounds around it:
    # this parses `.env`, a documented trust boundary (see
    # `UNTRUSTED_ENV_DENYLIST` in config/untrusted_env.py), so only patch releases
    # flow without review. An exact pin would be tighter still, but
    # `test_runtime_and_optional_dependencies_have_upper_bounds` reserves
    # `==` for the optional extras; core runtime deps stay bounded ranges.
    # uv.lock pins the exact version for reproducible installs regardless.
    "python-dotenv>=1.2.2,<1.3.0",
    "pyyaml>=6.0.0,<7.0.0",
    "rich>=13.0.0,<16.0.0",
    "sqlalchemy[asyncio]>=2.0.0,<3.0.0",
    "structlog>=24.0.0,<27.0.0",
    "typer>=0.12.0,<0.28.0",
]
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:183-203](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/evaluation/pipeline.py#L183-L203)

附加模型评估调用

<details>
<summary>查看原文（21行）</summary>

```text
        # Stage 2: Semantic Evaluation (advisory). It still runs when Stage 1
        # produced no executed evidence: its review becomes the feedback that
        # accompanies an unverified result, not a verdict.
        if self._config.stage2_enabled:
            result = await self._semantic.evaluate(context, stage1_result)
            if result.is_err:
                return Result.err(result.error)

            stage2_result, stage2_events = result.value
            events.extend(stage2_events)

            # Stage 2 withheld on compliance. trigger_consensus still asks
            # Stage 3 for a second opinion that is reported, but a consensus
            # approval cannot lift this block.
            if not stage2_result.ac_compliance and not context.trigger_consensus:
                return self._build_result(
                    context.execution_id,
                    events,
                    stage1_result=stage1_result,
                    stage2_result=stage2_result,
                )
```

</details>

**依据 3 · 作者声明**：[UNINSTALL.md:9-34](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/UNINSTALL.md#L9-L34)

卸载范围及保留数据

<details>
<summary>查看原文（26行）</summary>

````text
This interactively removes all Ouroboros configuration:
- MCP server registration (`~/.claude/mcp.json`, `~/.codex/config.toml`)
- CLAUDE.md integration block (`<!-- ooo:START -->` ... `<!-- ooo:END -->`)
- Codex rules and skills (`~/.codex/rules/ouroboros.md`, `~/.codex/skills/ouroboros/`)
- Project-level config (`.ouroboros/`)
- Data directory (`~/.ouroboros/` — config, credentials, DB, seeds, logs, locks, prefs)

Then finish with:

```bash
uv tool uninstall ouroboros-ai            # or: pip uninstall ouroboros-ai
claude plugin uninstall ouroboros         # if using Claude Code plugin
```

On Windows (installed with `scripts/install.ps1`), the same two commands work
in PowerShell. Git and uv were installed through winget and stay in place;
remove them with `winget uninstall --id astral-sh.uv -e` and
`winget uninstall --id Git.Git -e` if you no longer want them.

### Options

| Flag | Effect |
|:-----|:-------|
| `-y`, `--yes` | Skip confirmation prompt |
| `--dry-run` | Preview what would be removed, change nothing |
| `--keep-data` | Keep entire `~/.ouroboros/` (config, credentials, seeds, DB, logs) |
````

</details>

**依据 4 · 作者声明**：[UNINSTALL.md:48-71](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/UNINSTALL.md#L48-L71)

状态目录与不回滚项目代码

<details>
<summary>查看原文（24行）</summary>

```text
## What Lives Where

| Path | Created by | Contents |
|:-----|:-----------|:---------|
| `~/.claude/mcp.json` | `ooo setup` / `ouroboros setup` | MCP server entry |
| `~/.codex/config.toml` | `ouroboros setup --runtime codex` | Codex MCP section |
| `~/.codex/rules/ouroboros.md` | `ouroboros setup --runtime codex` | Codex rules |
| `~/.codex/skills/ouroboros/` | `ouroboros setup --runtime codex` | Codex skills |
| `CLAUDE.md` | `ooo setup` | Command reference block |
| `~/.ouroboros/config.yaml` | `ouroboros setup` | Runtime configuration |
| `~/.ouroboros/credentials.yaml` | `ouroboros setup` | API credentials |
| `~/.ouroboros/ouroboros.db` | First run | Event store + brownfield registry |
| `~/.ouroboros/seeds/` | `ooo seed` / `ooo interview` | Generated seed specs |
| `~/.ouroboros/data/` | `ooo interview` | Interview state |
| `~/.ouroboros/logs/` | Any run | Log files |
| `~/.ouroboros/locks/` | `ooo run` | Heartbeat locks |
| `~/.ouroboros/prefs.json` | `ooo setup` | Preferences |
| `.ouroboros/` (project) | `ooo evaluate` | Mechanical eval config |

## What Is NOT Removed

- Your project source code and git history
- Generated seed YAML files copied outside `~/.ouroboros/seeds/`
- Package manager caches (run `uv cache clean ouroboros-ai` or `pip cache purge` if needed)
```

</details>

#### 缺口

- 同一验收任务的模型预算、失败重试与人工修订总量未知
  **影响**：不能证明多阶段编排经济性优于单Agent
  **进一步探讨**：固定模型预算和任务，记录合格交付率、总调用及人时并对照人工清单

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些设计能迁移，哪些复杂性不能由行数消除？

**研究主题**：工程质量与复用

#### 完整回答

值得借鉴的是Result类型化失败、不完整artifact扫描拒绝评价、单点最终批准和共享机械检查不变量。把接受状态与模型意见分离，使审阅不会静默升级证据；移植需要携带检查覆盖、事件身份和运行时取消等约束。仓库范围很大，本轮只审阅Seed、MCP组装和评估关键路径，inventory即使全仓统计也不是全源码安全审计，Python还不纳入JS/TS行数口径。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:136-181](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/evaluation/pipeline.py#L136-L181)

拒绝不完整材料与实际失败

<details>
<summary>查看原文（46行）</summary>

```text
        if context.artifact_bundle is not None and not context.artifact_bundle.scan_complete:
            return Result.err(
                ValidationError(
                    "Artifact collection is incomplete; evaluation refused to avoid judging a partial workspace scan.",
                    field="artifact_bundle",
                    details={"scan_error": context.artifact_bundle.scan_error},
                )
            )

        events: list[BaseEvent] = []
        stage2_result = None
        stage3_result = None

        # Stage 1: Mechanical Verification
        # When a pre-computed result is injected, skip re-running the
        # AC-agnostic lint/build/test checks.
        if stage1_result is None and self._config.stage1_enabled:
            result = await self._mechanical.verify(
                context.execution_id,
                checks=list(COMMAND_CHECK_TYPES),
            )
            if result.is_err:
                return Result.err(result.error)

            stage1_result, stage1_events = result.value
            events.extend(stage1_events)

        # What the controller already ran for this criterion (its recorded
        # check package decision) is executed evidence for this criterion
        # only; the one classifier decides over it and the command checks.
        if context.recorded_checks:
            base = stage1_result or MechanicalResult(passed=True, checks=())
            stage1_result = base.with_recorded(context.recorded_checks)

        # Only an executed failure stops here. A result with no executed
        # evidence continues so the advisory review can supply feedback;
        # the acceptance gate still refuses to approve it.
        if (
            stage1_result is not None
            and stage1_result.disposition is MechanicalDisposition.EXECUTED_FAIL
        ):
            return self._build_result(
                context.execution_id,
                events,
                stage1_result=stage1_result,
            )
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:258-318](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/evaluation/pipeline.py#L258-L318)

集中最终判定

<details>
<summary>查看原文（61行）</summary>

```text
    def _build_result(
        self,
        execution_id: str,
        events: list[BaseEvent],
        stage1_result: MechanicalResult | None = None,
        stage2_result: SemanticResult | None = None,
        stage3_result: ConsensusResult | None = None,
    ) -> Result[EvaluationResult, ValidationError]:
        """Build the final evaluation result.

        Approval is decided here and nowhere else, by
        ``decide_final_approval``: executed Stage 1 evidence grants it, and
        any model review that ran (Stage 2 compliance or score, Stage 3
        consensus, the reward-hacking veto) may withhold it. No caller passes
        an approval in, so no branch can mint one from a model verdict.

        Args:
            execution_id: Execution identifier
            events: Collected events
            stage1_result: Stage 1 result if completed
            stage2_result: Stage 2 result if completed
            stage3_result: Stage 3 result if triggered

        Returns:
            Result containing EvaluationResult
        """
        final_approved = decide_final_approval(
            stage1_result=stage1_result,
            stage2_result=stage2_result,
            stage3_result=stage3_result,
        )

        # Calculate highest stage before creating immutable result
        highest_stage = 0
        if stage1_result is not None:
            highest_stage = 1
        if stage2_result is not None:
            highest_stage = 2
        if stage3_result is not None:
            highest_stage = 3

        # Calculate failure reason before creating immutable result.  Shared
        # with ``EvaluationResult.failure_reason`` so the two surfaces cannot
        # drift: this one is built before the result exists, that one after.
        failure_reason = build_failure_reason(
            final_approved=final_approved,
            stage1_result=stage1_result,
            stage2_result=stage2_result,
            stage3_result=stage3_result,
        )

        # Create completion event
        completion_event = create_pipeline_completed_event(
            execution_id=execution_id,
            final_approved=final_approved,
            highest_stage=highest_stage,
            failure_reason=failure_reason,
            acceptance_state=derive_acceptance_state(
                final_approved=final_approved,
                stage1_result=stage1_result,
            ).value,
```

</details>

**依据 3 · 源码核查**：[pyproject.toml:67-90](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/pyproject.toml#L67-L90)

分环境依赖明确

<details>
<summary>查看原文（24行）</summary>

```text
[project.optional-dependencies]
# Exact-pinned (not ranges) on purpose: a future compromised "latest" must not
# be auto-pulled on a fresh PyPI install (pipx / uv tool / pip resolve from
# this metadata, NOT from uv.lock). Motivated by the 2026-03 litellm
# 1.82.7/1.82.8 supply-chain incident. Updates land via reviewed Dependabot
# PRs; uv.lock additionally hash-pins the full transitive graph for repo/CI.
# Claude's default runtime preserves the Agent SDK and its MCP 1.x graph. The
# MCP 2 server runs in a separate process/profile; these extras must never be
# selected in one interpreter.
# claude-agent-sdk 0.2.144 dropped its own MCP 1.x ceiling; the profile
# contract (MCP 1.x graph) is preserved by pinning it here explicitly.
claude = ["claude-agent-sdk==0.2.165", "anthropic==1.13.0", "mcp==1.28.1"]
claude-cli = []
# Explicit alias for automation and migrations that want to spell out the SDK
# transport rather than rely on the historical `[claude]` name.
claude-sdk = ["claude-agent-sdk==0.2.165", "anthropic==1.13.0", "mcp==1.28.1"]
copilot = []
litellm = ["litellm==1.91.0; python_version < '3.14'"]
dashboard = []
mcp = ["mcp==2.2.0"]
tui = ["textual==8.2.8", "textual-serve==1.1.3"]
# `[all]` remains the MCP 1.x application bundle. The MCP 2 server profile is
# explicit and isolated; `[all,mcp]` is intentionally unsupported.
all = ["ouroboros-ai[claude,copilot,litellm,tui,dashboard]"]
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否为每个验收项附“检查覆盖证明”？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把每个验收项绑定可执行检查、产物路径和反例集合，禁止仅复用一个project-wide绿灯便解释为全部验收成立。由共享Stage1不变量与目标覆盖缺口推导，相对当前统一证据门槛增加的是证据与具体目标的覆盖关系。最小验证为同一实现分别注入“测试绿但业务错”“产物缺失”“非目标测试失败”，对照原流程和覆盖映射的误放行率及新增维护；如果映射仍被空检查绕过或维护耗时抵消收益，则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:109-143](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/evaluation/pipeline.py#L109-L143)

AC-agnostic复用不变量

<details>
<summary>查看原文（35行）</summary>

```text
        """Run the evaluation pipeline.

        Args:
            context: Evaluation context with artifact
            trigger_context: Optional pre-populated trigger context
            stage1_result: Pre-computed Stage 1 result.  When provided,
                Stage 1 mechanical verification is skipped and this result
                is reused.  This allows multi-AC callers to run
                lint/build/test once and share the outcome across parallel
                semantic evaluations.

                INVARIANT: Stage 1 checks (lint, build, test, static
                analysis, coverage) must be AC-agnostic — they verify
                project-wide code quality, not AC-specific behavior.  The
                multi-AC checklist path (``_handle_multi_ac`` in
                ``EvaluateHandler``, introduced in #385) relies on this
                invariant to run Stage 1 exactly once across all ACs and
                share the result via this parameter.

                If future Stage 1 additions become AC-specific (e.g.
                AC-tagged test filtering or per-AC coverage thresholds),
                this dedup becomes incorrect and the multi-AC caller must
                be updated to run Stage 1 per AC again.

        Returns:
            Result containing EvaluationResult or error
        """
        if context.artifact_bundle is not None and not context.artifact_bundle.scan_complete:
            return Result.err(
                ValidationError(
                    "Artifact collection is incomplete; evaluation refused to avoid judging a partial workspace scan.",
                    field="artifact_bundle",
                    details={"scan_error": context.artifact_bundle.scan_error},
                )
            )
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:258-318](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/evaluation/pipeline.py#L258-L318)

统一批准作为扩展接缝

<details>
<summary>查看原文（61行）</summary>

```text
    def _build_result(
        self,
        execution_id: str,
        events: list[BaseEvent],
        stage1_result: MechanicalResult | None = None,
        stage2_result: SemanticResult | None = None,
        stage3_result: ConsensusResult | None = None,
    ) -> Result[EvaluationResult, ValidationError]:
        """Build the final evaluation result.

        Approval is decided here and nowhere else, by
        ``decide_final_approval``: executed Stage 1 evidence grants it, and
        any model review that ran (Stage 2 compliance or score, Stage 3
        consensus, the reward-hacking veto) may withhold it. No caller passes
        an approval in, so no branch can mint one from a model verdict.

        Args:
            execution_id: Execution identifier
            events: Collected events
            stage1_result: Stage 1 result if completed
            stage2_result: Stage 2 result if completed
            stage3_result: Stage 3 result if triggered

        Returns:
            Result containing EvaluationResult
        """
        final_approved = decide_final_approval(
            stage1_result=stage1_result,
            stage2_result=stage2_result,
            stage3_result=stage3_result,
        )

        # Calculate highest stage before creating immutable result
        highest_stage = 0
        if stage1_result is not None:
            highest_stage = 1
        if stage2_result is not None:
            highest_stage = 2
        if stage3_result is not None:
            highest_stage = 3

        # Calculate failure reason before creating immutable result.  Shared
        # with ``EvaluationResult.failure_reason`` so the two surfaces cannot
        # drift: this one is built before the result exists, that one after.
        failure_reason = build_failure_reason(
            final_approved=final_approved,
            stage1_result=stage1_result,
            stage2_result=stage2_result,
            stage3_result=stage3_result,
        )

        # Create completion event
        completion_event = create_pipeline_completed_event(
            execution_id=execution_id,
            final_approved=final_approved,
            highest_stage=highest_stage,
            failure_reason=failure_reason,
            acceptance_state=derive_acceptance_state(
                final_approved=final_approved,
                stage1_result=stage1_result,
            ).value,
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人能限定试用，何时停止编排？

**研究主题**：采用判断

#### 完整回答

适合愿意写明确验收且已有模型runtime的开发者，在可丢弃项目先只完成访谈→Seed→一个可自动检查的小改动，独立核对产物与检查覆盖。若只得到模型赞同、机械证据缺失、预算失控或验收不对应任务，就停止自动执行，保留Seed/数据库/日志并用人工清单和单Agent接管。不要把目录收录的根仓库当DSH可直接安装bundle。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:136-203](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/src/ouroboros/evaluation/pipeline.py#L136-L203)

可检验的失败与advisory边界

<details>
<summary>查看原文（68行）</summary>

```text
        if context.artifact_bundle is not None and not context.artifact_bundle.scan_complete:
            return Result.err(
                ValidationError(
                    "Artifact collection is incomplete; evaluation refused to avoid judging a partial workspace scan.",
                    field="artifact_bundle",
                    details={"scan_error": context.artifact_bundle.scan_error},
                )
            )

        events: list[BaseEvent] = []
        stage2_result = None
        stage3_result = None

        # Stage 1: Mechanical Verification
        # When a pre-computed result is injected, skip re-running the
        # AC-agnostic lint/build/test checks.
        if stage1_result is None and self._config.stage1_enabled:
            result = await self._mechanical.verify(
                context.execution_id,
                checks=list(COMMAND_CHECK_TYPES),
            )
            if result.is_err:
                return Result.err(result.error)

            stage1_result, stage1_events = result.value
            events.extend(stage1_events)

        # What the controller already ran for this criterion (its recorded
        # check package decision) is executed evidence for this criterion
        # only; the one classifier decides over it and the command checks.
        if context.recorded_checks:
            base = stage1_result or MechanicalResult(passed=True, checks=())
            stage1_result = base.with_recorded(context.recorded_checks)

        # Only an executed failure stops here. A result with no executed
        # evidence continues so the advisory review can supply feedback;
        # the acceptance gate still refuses to approve it.
        if (
            stage1_result is not None
            and stage1_result.disposition is MechanicalDisposition.EXECUTED_FAIL
        ):
            return self._build_result(
                context.execution_id,
                events,
                stage1_result=stage1_result,
            )

        # Stage 2: Semantic Evaluation (advisory). It still runs when Stage 1
        # produced no executed evidence: its review becomes the feedback that
        # accompanies an unverified result, not a verdict.
        if self._config.stage2_enabled:
            result = await self._semantic.evaluate(context, stage1_result)
            if result.is_err:
                return Result.err(result.error)

            stage2_result, stage2_events = result.value
            events.extend(stage2_events)

            # Stage 2 withheld on compliance. trigger_consensus still asks
            # Stage 3 for a second opinion that is reported, but a consensus
            # approval cannot lift this block.
            if not stage2_result.ac_compliance and not context.trigger_consensus:
                return self._build_result(
                    context.execution_id,
                    events,
                    stage1_result=stage1_result,
                    stage2_result=stage2_result,
                )
```

</details>

**依据 2 · 作者声明**：[UNINSTALL.md:28-34](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/UNINSTALL.md#L28-L34)

保留数据退出选项

```text
### Options

| Flag | Effect |
|:-----|:-------|
| `-y`, `--yes` | Skip confirmation prompt |
| `--dry-run` | Preview what would be removed, change nothing |
| `--keep-data` | Keep entire `~/.ouroboros/` (config, credentials, seeds, DB, logs) |
```

**依据 3 · 源码核查**：[pyproject.toml:92-94](https://github.com/Q00/ouroboros/blob/05d2718de3edf7ba25de920c78652f646b7a9704/pyproject.toml#L92-L94)

实际CLI入口

```text
[project.scripts]
ooo = "ouroboros.cli.entrypoint:main"
ouroboros = "ouroboros.cli.entrypoint:main"
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
