# Ouroboros

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[592c667](https://github.com/Q00/ouroboros/tree/592c667f076c3dad7ef68d7844e91480d80135d0)

<!-- BEGIN META -->
[![GitHub ★ 6,332](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C332&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Q00/ouroboros)
<!-- END META -->

> **功能**：用访谈生成验收规格 Seed，再将机械检查和模型审阅投影为验收结果的 Python 工作流工具。

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 核对了固定规格、执行证据和模型否决的职责。访谈产物能与验收记录关联，机械缺证据有单独状态。

> **主要限制**：[Q03](#research-q03) 共享项目检查覆盖哪些条款，哪些条款仍缺专属机器证据？[Q04](#research-q04) 评估命令能否在可控的运行环境中执行？

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
  - [Q01 · 规格先行相比手写验收清单带来什么？](#detail-section-11)
  - [Q02 · 访谈怎样转成可复核 Seed？](#detail-section-12)
  - [Q03 · 机械证据与语义审阅能证明什么？](#detail-section-13)
  - [Q04 · 怎样限制验证副作用并衡量采用成本？](#detail-section-14)
  - [Q05 · 负样本检验能否改善验收区分力？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者收到含糊的修复或功能请求，需要把讨论变成有留档的规格并逐条验收。

维护者在工单手写验收清单，以项目测试、针对性用例和人工 review 拼接验收记录。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 固定入口 |
| --- | --- |
| 用户命令 | `ooo`、`ouroboros` 进入同一 CLI |
| 模型工具 | MCP Seed 生成、评估与验收结果 |

**流程与依赖**

#### 启动与依赖

| 项目 | 要求 |
| --- | --- |
| 本地 | Python 3.12 及以上，选择 CLI 或对应 MCP profile |
| 模型 | 选择与工作流兼容的后端并单独配置 |
| 项目 | 可运行的机械检查和对应工具链 |

#### 使用路径

| 步骤 | 可核查产物 |
| --- | --- |
| 澄清需求 | 访谈状态与模糊度 |
| 冻结规格 | 带 ID 的 Seed YAML |
| 评估 | 逐项验收状态、项目命令与审阅反馈 |

**效果与成本**

#### 采用成本

| 阶段 | 资源 | 维护者人时与可逆性 |
| --- | --- | --- |
| 首次 | Python、模型运行时、隔离副本 | 检查项目命令、初始化模型和设置项目配置，耗时未测 |
| 持续 | 模型调用、项目测试、Seed 存储 | 记录访谈轮数、编写逐项检查、签认规格与缺证据条目，耗时未测 |
| 失败恢复与退出 | 干净基线、已签认 Seed 和项目原有工具链 | 停止自动验收，重建试验副本，将规格交回人工和原有项目测试，返工未测 |

#### 任务价值

| 阶段 | 可核查产物 | 待量化效果 |
| --- | --- | --- |
| 首次 | 访谈和带 ID 的 Seed | 规格编写人时及需求遗漏 |
| 持续 | 项目检查、逐项证据与审阅状态 | 误批准、误拒绝、模型调用和评审人时 |
| 失败恢复 | 可复用的验收标准和已有测试 | 恢复耗时及重建试验副本的工时 |

> **思考**：[Q03](#research-q03) 共享项目检查覆盖哪些条款，哪些条款仍缺专属机器证据？[Q04](#research-q04) 评估命令能否在可控的运行环境中执行？

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 核对了固定规格、执行证据和模型否决的职责。访谈产物能与验收记录关联，机械缺证据有单独状态。

Seed 强制选项、项目机械执行、语义反馈和逐条聚合有独立代码分支。项目级命令的记录应和逐项检查包分开复核。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 共享项目检查覆盖哪些条款，哪些条款仍缺专属机器证据？[Q04](#research-q04) 评估命令能否在可控的运行环境中执行？

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 选择已有可执行测试的小改动，[Q04](#research-q04) 在独立低权限副本先确认项目命令，再冻结经签认的 Seed。若关键条款只引用共享测试、命令作用超出预期或结果无法重跑，停止自动验收，从干净副本按已签认条款交回项目测试及人工复核。[Q05](#research-q05) 先用有意违反一条标准的版本验证证据区分力。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核实 Seed 保存与验收分类机制。逐条真实覆盖及采用效果待验证。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、src/ouroboros/cli/commands/init.py、src/ouroboros/bigbang/seed_generator.py、src/ouroboros/mcp/tools/authoring_handlers.py、src/ouroboros/mcp/tools/evaluation_handlers.py、src/ouroboros/evaluation/pipeline.py、src/ouroboros/evaluation/models.py、src/ouroboros/evaluation/mechanical.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅覆盖根 Python 发行包、CLI 初始化及 MCP 评估主链。DSH 集成组件另有独立条目。
- 下一步：固定提交静态核查了配置与命令接线、未验证分类和 force 例外。下一步在同一隔离仓库用合格改动与只破坏错误码约定的改动做成对输入，分别比较共享项目测试和增加错误码断言两种配置。固定 Seed、后端和命令，记录两组审批状态、模型调用、耗时及人工复核，项目隔离和实际收益目前未知。

**分析版本**

- **仓库**：[Q00/ouroboros](https://github.com/Q00/ouroboros)
- **版本号**：未声明（[固定提交 592c667](https://github.com/Q00/ouroboros/tree/592c667f076c3dad7ef68d7844e91480d80135d0)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 使用按条款设计的反例，可能提升对不符合规格改动的区分力，效果取决于检查覆盖与维护成本。

固定提交静态核查了配置与命令接线、未验证分类和 force 例外。下一步在同一隔离仓库用合格改动与只破坏错误码约定的改动做成对输入，分别比较共享项目测试和增加错误码断言两种配置。固定 Seed、后端和命令，记录两组审批状态、模型调用、耗时及人工复核，项目隔离和实际收益目前未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 229 | 53126 | — | — | 406530 |
| .md | example | 6 | 348 | — | — | 1431 |
| .cjs | source | 1 | 90 | 79 | 1 | — |
| .ts | source | 2 | 987 | 788 | 115 | — |
| .ts | test | 1 | 1904 | 1654 | 56 | — |
| .md | test | 6 | 700 | — | — | 4239 |
| .js | test | 2 | 116 | 96 | 0 | — |
| .cjs | test | 1 | 178 | 163 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 70](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=70&color=737b86&logo=github)](https://github.com/Q00/ouroboros/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 82](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=82&color=737b86&logo=github)](https://github.com/Q00/ouroboros/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 80](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=80&color=737b86&logo=github)](https://github.com/Q00/ouroboros/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断需将模糊开发请求变成可验收任务的开发者，能否通过 Ouroboros 保持规格和机械证据可核查，并能明确验证覆盖的不足。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 规格先行相比手写验收清单带来什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者把根仓定位为规格优先的 AI 编码工作流。包本身有 `ooo`、`ouroboros` CLI 入口。相对由维护者手写清单并人工找测试日志，核心贡献是将访谈产出的规格固化成带 ID 的文件，并让评估以具体标准和机器检查为输入。实际交付成功率仍待验证。 适用任务是反复接到需要细化的编码工单，合格结果是签认过的标准与可回查验收记录。若团队已经用固定模板与流水线完整覆盖任务，新增流程的必要性可能较低。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:77-95](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/README.md#L77-L95)

作者描述的流程与本仓边界

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:86-95](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/pyproject.toml#L86-L95)

MCP 可选包和独立 CLI 入口

<details>
<summary>查看原文（10行）</summary>

```text
mcp = ["mcp==2.3.0"]
tui = ["textual==8.2.8", "textual-serve==1.1.3"]
# `[all]` remains the MCP 1.x application bundle. The MCP 2 server profile is
# explicit and isolated; `[all,mcp]` is intentionally unsupported.
all = ["ouroboros-ai[claude,copilot,litellm,tui,dashboard]"]

[project.scripts]
ooo = "ouroboros.cli.entrypoint:main"
ouroboros = "ouroboros.cli.entrypoint:main"
ozo = "ouroboros.cli.commands.zcode:app"
```

</details>

**依据 3 · 源码核查**：[src/ouroboros/cli/commands/init.py:801-812](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/cli/commands/init.py#L801-L812)

CLI 固化按 Seed ID 命名的 YAML，并区分保存失败

<details>
<summary>查看原文（12行）</summary>

```text
    seed = seed_result.value

    # Step 3: Save Seed
    seed_path = Path.home() / ".ouroboros" / "seeds" / f"{seed.metadata.seed_id}.yaml"
    save_result = await generator.save_seed(seed, seed_path)

    if save_result.is_err:
        print_error(f"Failed to save Seed: {save_result.error.message}")
        return None, SeedGenerationResult.CANCELLED

    print_success(f"Seed generated: {seed_path}")
    return seed_path, SeedGenerationResult.SUCCESS
```

</details>

#### 缺口

- 尚无同任务人工对照。
  **影响**：无法估计规格转写是否节省维护者时间。
  **进一步探讨**：取一次可复现的小改动，记录访谈、返工及人工验收时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 访谈怎样转成可复核 Seed？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

CLI 初始化把访谈状态、模糊度和用户选择传进 `SeedGenerator`。首代生成通常要求模糊度达到门槛，显式 force 会绕过这道门，但上下文摘要与需求蒸馏阻断仍可能报错。CLI 在生成成功后单独保存，保存失败返回取消。MCP 的进程内生成则把 YAML 与 Seed ID、访谈 ID 和 force 标记返回客户端。插件委派分支先读持久访谈，force 可跳过该分支中未完成访谈的分数及空回答保护，委派回复也不能当作保存成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/cli/commands/init.py:781-811](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/cli/commands/init.py#L781-L811)

CLI 将继续生成的选择传入生成器并保存

<details>
<summary>查看原文（31行）</summary>

```text
    # Step 2: Generate Seed
    with console.status("[cyan]Generating Seed from interview...[/]", spinner="dots"):
        generator = SeedGenerator(
            llm_adapter=llm_adapter,
            model=get_clarification_model(llm_backend),
        )
        seed_result = await generator.generate(
            state,
            ambiguity_score,
            force=not seed_ready,
        )

    if seed_result.is_err:
        error = seed_result.error
        if isinstance(error, ProviderError):
            print_error(f"Failed to generate Seed: {error.format_details()}")
        else:
            print_error(f"Failed to generate Seed: {error.message}")
        return None, SeedGenerationResult.CANCELLED

    seed = seed_result.value

    # Step 3: Save Seed
    seed_path = Path.home() / ".ouroboros" / "seeds" / f"{seed.metadata.seed_id}.yaml"
    save_result = await generator.save_seed(seed, seed_path)

    if save_result.is_err:
        print_error(f"Failed to save Seed: {save_result.error.message}")
        return None, SeedGenerationResult.CANCELLED

    print_success(f"Seed generated: {seed_path}")
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/bigbang/seed_generator.py:1674-1725](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/bigbang/seed_generator.py#L1674-L1725)

force 对模糊度门槛的作用和其他前置阻断

<details>
<summary>查看原文（52行）</summary>

```text
        # Gate on ambiguity score (skipped when force=True)
        if force:
            log.warning(
                "seed.generation.ambiguity_gate_bypassed",
                interview_id=state.interview_id,
                ambiguity_score=ambiguity_score.overall_score,
                threshold=AMBIGUITY_THRESHOLD,
            )
        elif not ambiguity_score.is_ready_for_seed:
            log.warning(
                "seed.generation.ambiguity_too_high",
                interview_id=state.interview_id,
                ambiguity_score=ambiguity_score.overall_score,
                threshold=AMBIGUITY_THRESHOLD,
            )
            return Result.err(
                ValidationError(
                    f"Ambiguity score {ambiguity_score.overall_score:.2f} exceeds "
                    f"threshold {AMBIGUITY_THRESHOLD}. Cannot generate Seed.",
                    field="ambiguity_score",
                    value=ambiguity_score.overall_score,
                    details={
                        "threshold": AMBIGUITY_THRESHOLD,
                        "interview_id": state.interview_id,
                    },
                )
            )

        if initial_context_summary_missing(state):
            return Result.err(
                ValidationError(
                    "Initial context summary required before seed generation",
                    field="initial_context",
                    details={"interview_id": state.interview_id},
                )
            )

        distillation = build_requirement_distillation(state)
        preflight = apply_requirement_distillation({}, distillation)
        reference_aware = is_reference_aware_distillation(distillation)
        readiness = seed_readiness_details(
            preflight.promotion,
            require_promoted_acceptance_criteria=reference_aware,
        )
        if readiness["blockers"]:
            return Result.err(
                ValidationError(
                    "Interview must be reopened before Seed generation",
                    field="requirement_distillation",
                    details=readiness,
                )
            )
```

</details>

**依据 3 · 源码核查**：[src/ouroboros/mcp/tools/authoring_handlers.py:1306-1338](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/mcp/tools/authoring_handlers.py#L1306-L1338)

插件路径独有的完整性保护例外

<details>
<summary>查看原文（33行）</summary>

```text
            # Determine best available ambiguity score for the gate.
            _THRESHOLD = 0.2
            effective_score = ambiguity_score_value  # caller-supplied
            if effective_score is None:
                effective_score = interview_state.ambiguity_score  # persisted

            # force=True intentionally bypasses BOTH the ambiguity threshold
            # AND the "no score / no answered rounds" completeness guard for
            # this plugin path — broader than #1107's domain-layer scope, but
            # matches the CLI ``init`` "Generate Seed anyway" opt-in which
            # forwards the same flag past the same guards. The real ambiguity
            # score is still recorded in seed metadata for provenance and the
            # bypass is emitted to the audit log.
            if not interview_state.is_complete and not force:
                answered_rounds = [r for r in interview_state.rounds if r.user_response is not None]
                if effective_score is not None:
                    # Have a score — enforce threshold
                    if effective_score > _THRESHOLD:
                        return Result.err(
                            MCPToolError(
                                f"Ambiguity score {effective_score:.2f} exceeds "
                                f"threshold {_THRESHOLD}. Continue interviewing "
                                f"to reduce ambiguity before seed generation, "
                                f"or pass force=true to bypass the gate.",
                                tool_name="ouroboros_generate_seed",
                            )
                        )
                elif not answered_rounds:
                    # No score AND no rounds — nothing to generate from
                    return Result.err(
                        MCPToolError(
                            "Interview has no answered rounds and no ambiguity "
                            "score. Complete at least one interview round before "
```

</details>

**依据 4 · 源码核查**：[src/ouroboros/mcp/tools/authoring_handlers.py:1411-1433](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/mcp/tools/authoring_handlers.py#L1411-L1433)

插件分支发出委派，进程内路径独立

<details>
<summary>查看原文（23行）</summary>

```text
            payload = build_generate_seed_subagent(
                session_id=session_id,
                ambiguity_score=effective_score,
                transcript=transcript,
                client_gates=client_gate_status["accepted_client_gates"],
                force=force,
                requirement_distillation=(distillation if interview_state.reference_cues else None),
            )
            return await dispatch_plugin_terminal(
                self.event_store,
                session_id=session_id,
                payload=payload,
                response_shape={
                    "session_id": session_id,
                    "status": DELEGATED_TO_SUBAGENT,
                    "dispatch_mode": "plugin",
                    "force": force,
                    "gate_forced": force,
                    **client_gate_status,
                },
            )

        # Fall-through: real in-process seed generation (subprocess / non-opencode runtimes).
```

</details>

**依据 5 · 源码核查**：[src/ouroboros/mcp/tools/authoring_handlers.py:1545-1575](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/mcp/tools/authoring_handlers.py#L1545-L1575)

进程内 MCP 返回 YAML 和元数据

<details>
<summary>查看原文（31行）</summary>

```text
            seed = seed_result.value
            # Convert seed to YAML
            seed_dict = seed.to_dict()
            seed_yaml = yaml.dump(
                seed_dict,
                default_flow_style=False,
                allow_unicode=True,
                sort_keys=False,
            )

            result_text = (
                _client_gate_warning_text(client_gate_status) + f"Seed Generated Successfully\n"
                f"=========================\n"
                f"Seed ID: {seed.metadata.seed_id}\n"
                f"Interview ID: {seed.metadata.interview_id}\n"
                f"Ambiguity Score: {seed.metadata.ambiguity_score:.2f}\n"
                f"Goal: {seed.goal}\n\n"
                f"--- Seed YAML ---\n"
                f"{seed_yaml}"
            )

            return Result.ok(
                MCPToolResult(
                    content=(MCPContentItem(type=ContentType.TEXT, text=result_text),),
                    is_error=False,
                    meta={
                        "seed_id": seed.metadata.seed_id,
                        "interview_id": seed.metadata.interview_id,
                        "ambiguity_score": seed.metadata.ambiguity_score,
                        "force": force,
                        "gate_forced": force,
```

</details>

#### 缺口

- 模糊度与需求真实完整性的关系未测。
  **影响**：强制生成或评分合格仍可能遗漏边界条件。
  **进一步探讨**：比对 Seed 与访谈原文，人工签认验收标准与覆盖场景。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 机械证据与语义审阅能证明什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

根 MCP 评估以机械配置启动流水线，缺配置时尝试生成。无执行证据时仍可给语义反馈，最终保持未验证。已执行失败在机械阶段提前返回，已执行通过可被已运行的模型审阅否决。多标准评估只共享首条的项目级命令结果，各条另加自己的已记录检查包。因共享项目测试可参与每条判定，批准结果本身无法证明每条验收标准都有专属测试。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/mcp/tools/evaluation_handlers.py:829-855](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/mcp/tools/evaluation_handlers.py#L829-L855)

缺配置尝试生成与真实 Pipeline 构造

<details>
<summary>查看原文（27行）</summary>

```text
            # Stage 1 trusts .ouroboros/mechanical.toml only. When the file is
            # absent we run the AI detector once to author it (best-effort).
            # A failed detect leaves Stage 1 with no configured check, which
            # is not executed evidence: the pipeline still runs the advisory
            # Stage 2 review, and the result is reported as unverified rather
            # than phantom-failing on hardcoded preset guesses.
            if not has_mechanical_toml(working_dir):
                try:
                    await ensure_mechanical_toml(
                        working_dir,
                        llm_adapter,
                        backend=backend,
                    )
                except Exception as exc:  # noqa: BLE001 — detector must never break eval
                    log.warning(
                        "mcp.tool.evaluate.detect_failed",
                        working_dir=str(working_dir),
                        error=str(exc),
                    )
            mechanical_config = build_mechanical_config(working_dir)
            config = PipelineConfig(
                mechanical=mechanical_config,
                semantic=SemanticConfig(
                    model=get_llm_model_for_role("semantic_evaluation", backend=backend)
                ),
            )
            pipeline = EvaluationPipeline(llm_adapter, config)
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:163-203](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/evaluation/pipeline.py#L163-L203)

逐项接入已记录检查、机械短路与语义否决

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

**依据 3 · 源码核查**：[src/ouroboros/evaluation/models.py:568-605](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/evaluation/models.py#L568-L605)

最终审批和未验证、拒绝的分类

<details>
<summary>查看原文（38行）</summary>

```text
def decide_final_approval(
    *,
    stage1_result: MechanicalResult | None,
    stage2_result: SemanticResult | None,
    stage3_result: ConsensusResult | None,
) -> bool:
    """The single acceptance gate: executed evidence grants, model review withholds.

    Approval requires Stage 1 to have run at least one configured check with
    every check passing. Model review that ran may withhold that approval;
    no model verdict can supply it.
    """
    if stage1_result is None or not stage1_result.has_executed_evidence:
        return False
    return (
        model_review_withhold_reason(
            stage2_result=stage2_result,
            stage3_result=stage3_result,
        )
        is None
    )


def derive_acceptance_state(
    *,
    final_approved: bool,
    stage1_result: MechanicalResult | None,
) -> AcceptanceState:
    """Classify an evaluation outcome for callers and feedback loops."""
    if final_approved:
        return AcceptanceState.APPROVED
    if stage1_result is None:
        return AcceptanceState.UNVERIFIED
    disposition = stage1_result.disposition
    if disposition is MechanicalDisposition.NO_EVIDENCE:
        return AcceptanceState.UNVERIFIED
    # EXECUTED_FAIL, or EXECUTED_PASS that model review withheld.
    return AcceptanceState.REJECTED
```

</details>

**依据 4 · 源码核查**：[src/ouroboros/mcp/tools/evaluation_handlers.py:1109-1133](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/mcp/tools/evaluation_handlers.py#L1109-L1133)

项目检查与逐条记录证据的复用分界

<details>
<summary>查看原文（25行）</summary>

```text
        # Share the project command checks only; each AC adds its own
        # recorded check package evidence (``recorded_checks``).
        first_stage1 = first_result.value.stage1_result
        shared_stage1 = first_stage1.command_checks() if first_stage1 is not None else None

        # --- Stage 2+: parallelize remaining ACs (Stage 1 injected) ---
        async def _run_one(index: int, ac_text: str) -> Result[object, object]:
            context = EvaluationContext(
                execution_id=session_id,
                seed_id=seed_id,
                current_ac=ac_text,
                current_ac_spec=spec_map.get(ac_text),
                artifact=artifact,
                artifact_type=artifact_type,
                goal=goal,
                constraints=constraints,
                trigger_consensus=trigger_consensus,
                artifact_bundle=artifact_bundle,
                executor_backend=executor_backend,
                recorded_checks=recorded[index],
            )
            return await pipeline.evaluate(  # type: ignore[attr-defined]
                context,
                stage1_result=shared_stage1,
            )
```

</details>

#### 缺口

- 判定的语义误差和逐项覆盖未知。
  **影响**：项目级测试通过可能掩盖一个未受约束的需求。
  **进一步探讨**：按标准列出直接证据，缺项保持待复核。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限制验证副作用并衡量采用成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Python 包及选择的模型运行时是前提。Claude SDK 的 MCP 1.x 和单独 MCP 2.x profile 不能在同一解释器混装。此处项目级机械检查的调用把项目目录和大部分进程环境传给 `create_subprocess_exec`，超时回收的是这段调用跟踪的子进程。试用时应先审项目命令，再在隔离环境中运行，分别记访谈轮数、模型调用、人工写检查和验收时间。 试用者应保留隔离副本和冻结的 Seed，对共享测试不能解释的条款、命令环境越界或无法重跑的结果停止自动验收。失败后从干净基线重建试验副本，复用已签认的 YAML 条款，交回既有项目测试和人工验收。退出方案由试用者准备。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-9](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/pyproject.toml#L1-L9)

Python 版本底线

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

**依据 2 · 源码核查**：[pyproject.toml:73-90](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/pyproject.toml#L73-L90)

两组 MCP 版本分档

<details>
<summary>查看原文（18行）</summary>

```text
# Claude's default runtime preserves the Agent SDK and its MCP 1.x graph. The
# MCP 2 server runs in a separate process/profile; these extras must never be
# selected in one interpreter.
# claude-agent-sdk 0.2.144 dropped its own MCP 1.x ceiling; the profile
# contract (MCP 1.x graph) is preserved by pinning it here explicitly.
claude = ["claude-agent-sdk==0.2.168", "anthropic==1.15.0", "mcp==1.28.1"]
claude-cli = []
# Explicit alias for automation and migrations that want to spell out the SDK
# transport rather than rely on the historical `[claude]` name.
claude-sdk = ["claude-agent-sdk==0.2.168", "anthropic==1.15.0", "mcp==1.28.1"]
copilot = []
litellm = ["litellm==1.91.0; python_version < '3.14'"]
dashboard = []
mcp = ["mcp==2.3.0"]
tui = ["textual==8.2.8", "textual-serve==1.1.3"]
# `[all]` remains the MCP 1.x application bundle. The MCP 2 server profile is
# explicit and isolated; `[all,mcp]` is intentionally unsupported.
all = ["ouroboros-ai[claude,copilot,litellm,tui,dashboard]"]
```

</details>

**依据 3 · 源码核查**：[src/ouroboros/evaluation/mechanical.py:117-162](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/evaluation/mechanical.py#L117-L162)

继承环境、设置项目工作目录及子进程超时

<details>
<summary>查看原文（46行）</summary>

```text
    # The detector accepts a tool the project's virtualenv provides, which a
    # task worktree reaches only through the main working tree's, so the
    # command resolves it the same way.
    env = os.environ.copy() if working_dir is None else with_project_venv(os.environ, working_dir)
    # The MCP server sets this sentinel to prevent recursive server spawning.
    # Mechanical verification must test the repository as a fresh process would;
    # leaking the sentinel makes CLI tests take the nested-server early exit.
    env.pop("_OUROBOROS_NESTED", None)
    try:
        prepared_command = prepare_command(command, env)
    except ValueError as e:
        return CommandResult(return_code=-1, stdout="", stderr=str(e))
    try:
        process = await asyncio.create_subprocess_exec(
            *prepared_command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd=working_dir,
            env=env,
        )

        try:
            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=timeout,
            )
            return CommandResult(
                return_code=process.returncode or 0,
                stdout=stdout.decode("utf-8", errors="replace"),
                stderr=stderr.decode("utf-8", errors="replace"),
                executed_command=prepared_command,
            )
        except TimeoutError:
            process.kill()
            await process.wait()
            return CommandResult(
                return_code=-1,
                stdout="",
                stderr="Command timed out",
                timed_out=True,
                executed_command=prepared_command,
            )
        except asyncio.CancelledError:
            if process.returncode is None:
                process.kill()
                await process.wait()
```

</details>

#### 缺口

- 当前未执行目标代码，也未核查外部运行时的实际隔离。
  **影响**：不同项目命令的副作用与成本可能显著不同。
  **进一步探讨**：使用独立低权限环境和可丢弃的项目副本，记录文件、网络、进程、人时及退出时能否复用规格。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 负样本检验能否改善验收区分力？

**研究主题**：新假设与验证

#### 完整回答

可在同一小项目固定 Seed、模型配置和测试入口，选一条标准做可控反例。以满足标准的版本和只破坏该标准的版本成对比较，分别测试仅共享项目命令、加入该标准独立检查包两种配置，记录误批准、误拒绝与额外耗时。若两个版本仍获相同结果，或收益被维护成本抵消，假设未获得支持。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/mcp/tools/evaluation_handlers.py:1109-1133](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/mcp/tools/evaluation_handlers.py#L1109-L1133)

共享命令及逐项检查是对照变量

<details>
<summary>查看原文（25行）</summary>

```text
        # Share the project command checks only; each AC adds its own
        # recorded check package evidence (``recorded_checks``).
        first_stage1 = first_result.value.stage1_result
        shared_stage1 = first_stage1.command_checks() if first_stage1 is not None else None

        # --- Stage 2+: parallelize remaining ACs (Stage 1 injected) ---
        async def _run_one(index: int, ac_text: str) -> Result[object, object]:
            context = EvaluationContext(
                execution_id=session_id,
                seed_id=seed_id,
                current_ac=ac_text,
                current_ac_spec=spec_map.get(ac_text),
                artifact=artifact,
                artifact_type=artifact_type,
                goal=goal,
                constraints=constraints,
                trigger_consensus=trigger_consensus,
                artifact_bundle=artifact_bundle,
                executor_backend=executor_backend,
                recorded_checks=recorded[index],
            )
            return await pipeline.evaluate(  # type: ignore[attr-defined]
                context,
                stage1_result=shared_stage1,
            )
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/evaluation/models.py:176-202](https://github.com/Q00/ouroboros/blob/592c667f076c3dad7ef68d7844e91480d80135d0/src/ouroboros/evaluation/models.py#L176-L202)

机械分类对执行结果的依据

<details>
<summary>查看原文（27行）</summary>

```text
    def disposition(self) -> MechanicalDisposition:
        """Classify this result once, for the pipeline and every projection.

        An executed failure rejects. A pass counts only when every check
        passed and at least one ran a command (a skipped check reports
        ``passed`` but is not evidence). Everything else, including a failure
        that was never executed, is no evidence.
        """
        if self.executed_failures:
            return MechanicalDisposition.EXECUTED_FAIL
        if self.passed and self.executed_checks:
            return MechanicalDisposition.EXECUTED_PASS
        return MechanicalDisposition.NO_EVIDENCE

    def with_recorded(self, recorded: tuple[CheckResult, ...]) -> "MechanicalResult":
        """This result plus checks the controller already ran for one criterion.

        ``recorded`` holds ``CHECK_PACKAGE`` results only; the one classifier
        (``disposition``) then decides over the command checks and them alike.
        """
        if any(check.check_type is not CheckType.CHECK_PACKAGE for check in recorded):
            raise ValueError("only check package results are recorded evidence")
        checks = self.command_checks().checks + recorded
        return MechanicalResult(
            passed=all(check.passed is True for check in checks),
            checks=checks,
            coverage_score=self.coverage_score,
```

</details>

#### 缺口

- 对照尚未运行。
  **影响**：不能从实现推断误批准率下降。
  **进一步探讨**：在单一仓库准备一对最小改动，例如边界输入是否返回约定错误码。固定同一 Seed 和模型，逐个比较仅运行项目套件与加入单项错误码断言的验收状态。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
