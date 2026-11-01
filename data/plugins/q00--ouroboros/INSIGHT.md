# Ouroboros 规格先行引擎

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[722172e](https://github.com/Q00/ouroboros/tree/722172ef096767583679d04aef5e847458fee6b2)

<!-- BEGIN META -->
[![GitHub ★ 6,299](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C299&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Q00/ouroboros)
<!-- END META -->

> **功能**：通过访谈、固定规格、执行与多阶段评估组织 AI 软件开发任务。

> **亮点**：[Q02](#research-q02) 与 [Q03](#research-q03) 展示评分门槛、规格和已执行证据的组合；不是验收、测试或模型审阅概念原创，也不保证需求正确。

> **主要限制**：[Q04](#research-q04) 的共享项目检查需要验收项无关的不变量；实际执行和模型审阅仍无法证明检查覆盖全部业务承诺。

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
  - [Q01 · 根工具面向什么任务，已有替代是什么？](#detail-section-11)
  - [Q02 · 模糊度与 Seed 的门槛如何起作用？](#detail-section-12)
  - [Q03 · MCP 验收怎样区分执行证据与模型审阅？](#detail-section-13)
  - [Q04 · 多验收项复用检查的代价和边界是什么？](#detail-section-14)
  - [Q05 · 依赖、资源成本和退出方式是什么？](#detail-section-15)
  - [Q06 · 如何检验验收检查本身是否有区分力？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向任务目标较模糊、可以写出可执行验收条件并审查结果的软件开发者。

人工规格、Agent 编码和 CI 已能完成同类工作；本工具将规格、执行与验证组织为统一流程，但成本与正确率未对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 访谈与 Seed | 形成待执行规格 | 分数和 force 不能证明需求正确 |
| 机械检查 | 为验收提供执行证据 | 命令与断言必须覆盖需求 |
| 语义与共识审阅 | 提供反馈和否决 | 模型不能单独制造批准 |
| 多验收项 | 共享项目检查并逐项评估 | 共享检查须保持 AC 无关 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python 3.12 及根 CLI/MCP | 必需 | 运行工作流 | 无法执行 |
| 兼容 Agent 与模型服务 | 模型环节必需 | 访谈和语义评估 | 对应环节不可用 |
| 可信工作区和验收标准 | 必需 | 限定问题和效果 | 不能判断任务是否合格 |
| 可执行验证命令 | 批准所需证据之一 | 机械检查 | 无执行证据为未验证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选可丢弃副本并检查命令 | 限定权限与外部副作用 |
| 访谈 | 复核目标、约束与验收项 | 不把模糊度分数当需求证明 |
| 验证 | 检查每项实际执行结果及范围 | 缺证据或失败时停止 |
| 交付 | 用户独立复核实际产物 | 不以模型建议替代验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | Python、宿主和服务资源未知 | 配置与隔离 | 版本兼容未测 |
| 使用 | 多轮模型和本地命令成本未知 | 访谈与验收复核 | 净节时未知 |
| 失败 | 重试及命令副作用可能耗费资源 | 核查文件与外部状态 | 结果未必可撤销 |
| 退出 | 原文件和环境恢复资源 | 回人工清单和原生 Agent | 取消不撤销既有作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 规格 | 模糊度阈值和显式例外 | 真实需求完整性 |
| 评估 | 必须有执行证据且模型可否决 | 每个检查覆盖业务条件 |
| 任务收益 | 作者主张减少返工 | 真实成本和合格率 |

> **思考**：[Q04](#research-q04) 的共享项目检查需要验收项无关的不变量；实际执行和模型审阅仍无法证明检查覆盖全部业务承诺。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 与 [Q03](#research-q03) 展示评分门槛、规格和已执行证据的组合；不是验收、测试或模型审阅概念原创，也不保证需求正确。

[Q03](#research-q03) 通过统一分类器避免 skipped 当执行证据；[Q04](#research-q04) 跨项共享命令检查依赖其 AC 无关，按项记录不代表检查自动充分。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04) 的共享项目检查需要验收项无关的不变量；实际执行和模型审阅仍无法证明检查覆盖全部业务承诺。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 仅在可丢弃副本试小任务并检查命令与各项验收；无有效证据或状态不明时暂停并回人工核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代表性 Seed 和 MCP 验收路径；未执行目标、宿主、模型、命令或假设实验。

- 已检查：作者 README、包清单、源码路径 pyproject.toml、README.md、src/ouroboros/bigbang/ambiguity.py、src/ouroboros/bigbang/seed_generator.py、src/ouroboros/mcp/tools/evaluation_handlers.py、src/ouroboros/evaluation/pipeline.py、src/ouroboros/evaluation/mechanical.py、src/ouroboros/evaluation/models.py、src/ouroboros/evaluation/adversarial.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交仅静态检查根 Python 包、模糊度、Seed 生成、MCP 评估入口和机械证据分类；未检查全部宿主、模型和执行后端，未研究同仓其他适配器。inventory 仅覆盖 Markdown 与指定 JS/TS，Python 不计入规模。
- 下一步：隔离环境用受控任务与检查分别测试无命令、执行失败、成功但业务违例；按 [Q06](#research-q06) 对照人审负样本的区分力与成本。

**分析版本**

- **仓库**：[Q00/ouroboros](https://github.com/Q00/ouroboros)
- **版本号**：未声明（[固定提交 722172e](https://github.com/Q00/ouroboros/tree/722172ef096767583679d04aef5e847458fee6b2)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提议以预先定义的隔离负样本检验检查对所选违例的区分力；现有逐项证据与模型对抗审阅是反证，覆盖收益和成本未验证。

隔离环境用受控任务与检查分别测试无命令、执行失败、成功但业务违例；按 [Q06](#research-q06) 对照人审负样本的区分力与成本。

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

[![近30天新建 85](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=85&color=737b86&logo=github)](https://github.com/Q00/ouroboros/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 79](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=79&color=737b86&logo=github)](https://github.com/Q00/ouroboros/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根 CLI/MCP 的访谈、Seed 与执行证据门槛及成本边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根工具面向什么任务，已有替代是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Ouroboros 根项目是独立 Python CLI/MCP 工作流，面向希望先澄清软件任务、再以规格组织执行与验证的开发者。pyproject 注册 ooo 与 ouroboros 命令并要求 Python 3.12 以上；作者描述访谈、Seed、执行和分阶段评估。手写验收清单、单个编码 Agent 与 CI 是直接替代；本项目的增量是把访谈、规格和证据门槛组织成一条可记录流程，不是发明验收标准或测试。作者对降低返工和自动变聪明的描述未在本轮独立对照，不能当作效果证明。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-9](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/pyproject.toml#L1-L9)

根项目 Python 身份和运行版本。

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

**依据 2 · 源码核查**：[pyproject.toml:92-95](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/pyproject.toml#L92-L95)

CLI 命令入口。

```text
[project.scripts]
ooo = "ouroboros.cli.entrypoint:main"
ouroboros = "ouroboros.cli.entrypoint:main"
ozo = "ouroboros.cli.commands.zcode:app"
```

**依据 3 · 作者声明**：[README.md:350-356](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/README.md#L350-L356)

作者描述访谈、规格、执行与评估流程。

````text
interview  ->  Socratic questioning exposed 12 hidden assumptions
seed       ->  Crystallized answers into an immutable spec (Ambiguity: 0.15)
run        ->  Fanned acceptance criteria out to agents in dependency order
evaluate   ->  3-stage verification: Mechanical -> Semantic -> Consensus
```

> Use `ooo <cmd>` inside your AI coding agent session, or `ouroboros init start`, `ouroboros run seed.yaml`, etc. from the terminal.
````

**依据 4 · 作者声明**：[README.md:364-373](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/README.md#L364-L373)

作者对原生流程和返工的比较主张。

<details>
<summary>查看原文（10行）</summary>

```text
## How It Compares

AI coding tools are powerful -- but they solve the **wrong problem** when the input is unclear.

|                     | Vanilla AI Coding                        | Ouroboros                                                                       |
| :------------------ | :--------------------------------------- | :------------------------------------------------------------------------------ |
| **Vague prompt**    | AI guesses intent, builds on assumptions | Socratic interview forces clarity *before* code                                 |
| **Spec validation** | No spec -- architecture drifts mid-build | Immutable seed spec locks intent; ambiguity gate (<= 0.2) blocks premature code without explicit `force` |
| **Evaluation**      | "Looks good" / manual QA                 | 3-stage automated gate: Mechanical -> Semantic -> Multi-Model Consensus         |
| **Rework rate**     | High -- wrong assumptions surface late   | Low -- assumptions surface in the interview, not in the PR review               |
```

</details>

#### 缺口

- 未进行同任务及同模型的独立对照
  **影响**：无法证明减少返工、成本或提高质量
  **进一步探讨**：对比固定任务的人工验收、单 Agent 与本工具，测量合格结果和人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模糊度与 Seed 的门槛如何起作用？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

ambiguity.py 为常规任务设目标、约束、成功标准三个权重，并为既有项目增加上下文维度；阈值 0.2 和各维度下限是项目配置的判断规则，不能称为真实需求准确性的数学证明。seed_generator 的第一代路径按 is_ready_for_seed 拒绝高模糊度，但显式 force 可绕过阈值并保留真实分数；当 parent_seed 与 reflect_output 都存在时进入后续代路径，跳过该入口的模糊度门槛。force 不跳过其余验证，因此既不能说门槛绝不允许例外，也不能说 force 无条件生成。模型如何理解受访者、规格是否覆盖实际需求仍未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/bigbang/ambiguity.py:36-56](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/bigbang/ambiguity.py#L36-L56)

阈值、维度下限和 greenfield/brownfield 权重。

<details>
<summary>查看原文（21行）</summary>

```text
# Threshold for allowing Seed generation (NFR6)
AMBIGUITY_THRESHOLD = 0.2
SEED_CLOSER_ACTIVATION_THRESHOLD = 0.25
AUTO_COMPLETE_STREAK_REQUIRED = 2

# Minimum per-dimension clarity required before interview auto-completion.
GOAL_CLARITY_FLOOR = 0.75
CONSTRAINT_CLARITY_FLOOR = 0.65
SUCCESS_CRITERIA_CLARITY_FLOOR = 0.70
BROWNFIELD_CONTEXT_CLARITY_FLOOR = 0.60

# Weights for greenfield score components (3 dimensions)
GOAL_CLARITY_WEIGHT = 0.40
CONSTRAINT_CLARITY_WEIGHT = 0.30
SUCCESS_CRITERIA_CLARITY_WEIGHT = 0.30

# Weights for brownfield score components (4 dimensions)
BROWNFIELD_GOAL_CLARITY_WEIGHT = 0.35
BROWNFIELD_CONSTRAINT_CLARITY_WEIGHT = 0.25
BROWNFIELD_SUCCESS_CRITERIA_CLARITY_WEIGHT = 0.25
BROWNFIELD_CONTEXT_CLARITY_WEIGHT = 0.15
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/bigbang/ambiguity.py:64-71](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/bigbang/ambiguity.py#L64-L71)

源码说明模型评分和分维度评估。

```text
#
# The combined scorer (``_build_scoring_system_prompt``) evaluates all
# dimensions in ONE LLM call. The per-dimension panel splits that into one
# focused scoring request per dimension so the calls can be fanned out (MCP
# path) or run concurrently in-process (auto path). The per-dimension rubric
# lines are extracted verbatim from the combined prompt so a single dimension
# is scored identically to how the combined prompt scored it — only the
# packaging changes, never the criteria or the weights.
```

**依据 3 · 源码核查**：[src/ouroboros/bigbang/seed_generator.py:1635-1666](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/bigbang/seed_generator.py#L1635-L1666)

第一代、后续代和 force 条件。

<details>
<summary>查看原文（32行）</summary>

```text
        parent_seed: Seed | None = None,
        reflect_output: Any | None = None,
        *,
        force: bool = False,
    ) -> Result[Seed, ValidationError | ProviderError]:
        """Generate an immutable Seed from interview state or reflect output.

        Two modes:
        - Gen 1 (reflect_output=None): Extract from interview, gate on ambiguity.
        - Gen 2+ (reflect_output provided): Use refined ACs and ontology mutations
          from ReflectEngine. Skip ambiguity gating.

        When ``force=True``, the ambiguity threshold gate is bypassed but every
        other validation (initial-context summary, extraction, build) still runs.
        The real ``ambiguity_score.overall_score`` is recorded in metadata so
        forced seeds carry truthful provenance.

        Args:
            state: Completed interview state.
            ambiguity_score: The ambiguity score for the interview.
            parent_seed: Optional parent seed for evolutionary lineage.
            reflect_output: Optional ReflectOutput for Gen 2+ evolution.
            force: When True, bypass the ambiguity threshold gate. The real
                score is still stamped into ``SeedMetadata.ambiguity_score``.
                Defaults to False (gate enforced).

        Returns:
            Result containing the generated Seed or error.
        """
        # Gen 2+ path: use reflect output directly
        if reflect_output is not None and parent_seed is not None:
            return self.generate_from_reflect(parent_seed, reflect_output)
```

</details>

**依据 4 · 源码核查**：[src/ouroboros/bigbang/seed_generator.py:1674-1704](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/bigbang/seed_generator.py#L1674-L1704)

显式绕过或拒绝与后续检查。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

#### 缺口

- 未校准模型评分与用户真实需求
  **影响**：分数不能证明需求完整和规格正确
  **进一步探讨**：固定访谈样本，人工复核不同模型评分、缺漏和 force 使用结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · MCP 验收怎样区分执行证据与模型审阅？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

MCP evaluation handler 基于工作目录建立机械配置并创建 EvaluationPipeline；至少两个验收项时进入逐项清单路径。pipeline 先拒绝明确不完整的 artifact scan，再执行或复用 Stage 1，将本验收项已有 recorded check 加入；已执行失败直接结束，无执行证据仍可继续语义审阅但最终为 unverified。MechanicalResult 的 disposition 要求所有检查通过且至少一项确实执行，未配置命令的 skipped 不计已执行；最终批准还可能被语义或共识审阅否决，模型意见不能独立制造通过。该门槛是现有源码机制，未运行项目或证明被执行命令适合每个业务验收项。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/mcp/tools/evaluation_handlers.py:829-863](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/mcp/tools/evaluation_handlers.py#L829-L863)

MCP 建立机械配置与多验收项分流。

<details>
<summary>查看原文（35行）</summary>

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

            # Multi-AC checklist path (#366):
            # When the caller provides >= 2 acceptance criteria we run the
            # pipeline once per AC and aggregate the results into a
            # checklist.  Single-AC callers keep the original single-pass
            # behaviour — no extra cost or behaviour change for them.
            if len(acceptance_criteria) >= 2:
                return await self._handle_multi_ac(
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:136-142](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/pipeline.py#L136-L142)

明确不完整 artifact scan 拒绝。

```text
        if context.artifact_bundle is not None and not context.artifact_bundle.scan_complete:
            return Result.err(
                ValidationError(
                    "Artifact collection is incomplete; evaluation refused to avoid judging a partial workspace scan.",
                    field="artifact_bundle",
                    details={"scan_error": context.artifact_bundle.scan_error},
                )
```

**依据 3 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:149-187](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/pipeline.py#L149-L187)

机械执行、按项记录与无证据路径。

<details>
<summary>查看原文（39行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/ouroboros/evaluation/mechanical.py:328-349](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/mechanical.py#L328-L349)

未配置命令标记 skipped、executed=false。

<details>
<summary>查看原文（22行）</summary>

```text
    async def _run_check(self, check_type: CheckType) -> CheckResult:
        """Run a single check.

        Args:
            check_type: Type of check to run

        Returns:
            CheckResult with pass/fail status
        """
        command = self._get_command_for_check(check_type)
        if command is None:
            return CheckResult(
                check_type=check_type,
                passed=True,
                message=f"Check {check_type.value} skipped (no command configured)",
                details={"skipped": True},
                executed=False,
            )

        cmd_result = await run_command(
            command,
            timeout=self.config.timeout_seconds,
```

</details>

**依据 5 · 源码核查**：[src/ouroboros/evaluation/models.py:166-188](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/models.py#L166-L188)

已执行失败、通过和无证据分类。

<details>
<summary>查看原文（23行）</summary>

```text
    def executed_checks(self) -> tuple[CheckResult, ...]:
        """Return only the checks whose configured command actually ran."""
        return tuple(c for c in self.checks if c.executed is True)

    @property
    def executed_failures(self) -> tuple[CheckResult, ...]:
        """Return the checks that ran a command and did not pass."""
        return tuple(c for c in self.failed_checks if c.executed is True)

    @property
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
```

</details>

**依据 6 · 源码核查**：[src/ouroboros/evaluation/models.py:568-587](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/models.py#L568-L587)

最终批准的机械证据和模型否决规则。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

#### 缺口

- 未执行 MCP、模型或真实检查命令
  **影响**：无法证明目标环境中的检测和最终验收准确
  **进一步探讨**：在隔离测试项目对照执行失败、无命令、成功但需求不符等情形。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 多验收项复用检查的代价和边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

多验收项路径只运行一次项目级 lint/build/test 并分享 command_checks；每项仍有各自 recorded check package 和语义评估。pipeline 的预计算接口明确要求共享 Stage 1 为 AC 无关的项目检查；若未来加入按验收项选择的测试或阈值，跨项复用须改变。即使这个不变量成立，项目级测试成功也未必覆盖每一具体业务承诺，按项 recorded_checks 虽能提供更强的局部证据，也取决于它是否实际配置及其断言正确性；模型审阅不能补成执行证据。源码还在提供了 artifact_bundle 且其 scan_complete 为 false 时拒绝，而不是证明所有调用都提供完整扫描。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/mcp/tools/evaluation_handlers.py:1044-1055](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/mcp/tools/evaluation_handlers.py#L1044-L1055)

多验收项仅共享通用机械检查。

<details>
<summary>查看原文（12行）</summary>

```text
    ) -> Result[MCPToolResult, MCPServerError]:
        """Evaluate each AC individually and return an aggregated checklist (#366).

        Stage 1 (mechanical verification — lint/build/test) is AC-agnostic,
        so we run it exactly once via the first AC's full pipeline call and
        inject the result into the remaining per-AC evaluations.  Only
        Stage 2+ (semantic evaluation) is parallelized per AC via
        ``asyncio.gather``.

        Per-AC results are then folded into a single ``ACChecklistResult``
        so the caller sees one pass/fail checklist with per-item evidence
        and failure reasons.
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/mcp/tools/evaluation_handlers.py:1109-1132](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/mcp/tools/evaluation_handlers.py#L1109-L1132)

仅共享 command checks，逐项使用 recorded checks。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:114-131](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/pipeline.py#L114-L131)

跨项复用依赖 AC 无关不变量。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:136-142](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/pipeline.py#L136-L142)

提供的 artifact bundle 不完整时拒绝。

```text
        if context.artifact_bundle is not None and not context.artifact_bundle.scan_complete:
            return Result.err(
                ValidationError(
                    "Artifact collection is incomplete; evaluation refused to avoid judging a partial workspace scan.",
                    field="artifact_bundle",
                    details={"scan_error": context.artifact_bundle.scan_error},
                )
```

**依据 5 · 源码核查**：[src/ouroboros/evaluation/models.py:190-217](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/models.py#L190-L217)

每项 recorded check 与项目检查分类。

<details>
<summary>查看原文（28行）</summary>

```text
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
        )

    def command_checks(self) -> "MechanicalResult":
        """This result without recorded criterion evidence: what every criterion shares."""
        checks = tuple(c for c in self.checks if c.check_type is not CheckType.CHECK_PACKAGE)
        return MechanicalResult(
            passed=all(check.passed is True for check in checks),
            checks=checks,
            coverage_score=self.coverage_score,
        )

    @property
    def has_executed_evidence(self) -> bool:
        """Whether Stage 1 is executed verification evidence for acceptance."""
        return self.disposition is MechanicalDisposition.EXECUTED_PASS
```

</details>

#### 缺口

- 未审计全部调用者是否总是提供合适的每项检查及完整材料
  **影响**：不能从项目测试通过推出所有验收项已覆盖
  **进一步探讨**：固定样本逐项追踪命令、实际路径、断言和验收项映射。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖、资源成本和退出方式是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根 Python 包需要 Python 3.12 以上、受支持的宿主/模型供应方及工作目录；机械验证实际运行配置的命令，会消耗本机资源并可能有命令自身的副作用。语义及可能触发的共识阶段需要额外模型调用，token、时间和费用因配置而异；访谈和逐项复核也有人工成本。若核心任务简单、无法取得可信命令或验收标准，先观察并回原生 Agent 加人工清单；若机械证据 unverified、检查与需求无关或失败后状态不明，停止循环并核查文件和实际外部动作。不能以不安装 DSH 适配器判断根工具已安装，也不能把取消或退出当成撤销副作用。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-9](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/pyproject.toml#L1-L9)

Python 包与版本要求。

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

**依据 2 · 源码核查**：[src/ouroboros/evaluation/mechanical.py:328-349](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/mechanical.py#L328-L349)

配置命令缺失会跳过，存在时由运行器执行。

<details>
<summary>查看原文（22行）</summary>

```text
    async def _run_check(self, check_type: CheckType) -> CheckResult:
        """Run a single check.

        Args:
            check_type: Type of check to run

        Returns:
            CheckResult with pass/fail status
        """
        command = self._get_command_for_check(check_type)
        if command is None:
            return CheckResult(
                check_type=check_type,
                passed=True,
                message=f"Check {check_type.value} skipped (no command configured)",
                details={"skipped": True},
                executed=False,
            )

        cmd_result = await run_command(
            command,
            timeout=self.config.timeout_seconds,
```

</details>

**依据 3 · 源码核查**：[src/ouroboros/evaluation/pipeline.py:183-187](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/pipeline.py#L183-L187)

语义评估可运行且为建议性。

```text
        # Stage 2: Semantic Evaluation (advisory). It still runs when Stage 1
        # produced no executed evidence: its review becomes the feedback that
        # accompanies an unverified result, not a verdict.
        if self._config.stage2_enabled:
            result = await self._semantic.evaluate(context, stage1_result)
```

**依据 4 · 源码核查**：[src/ouroboros/evaluation/models.py:568-587](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/models.py#L568-L587)

无执行证据不批准。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

#### 缺口

- 未运行安装、模型、命令和失败恢复，也未计费
  **影响**：不能估算净成本或对目标环境的兼容
  **进一步探讨**：用可丢弃副本、受控命令和固定模型对照时间、费用与结果。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何检验验收检查本身是否有区分力？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有项目级命令、逐验收项 recorded check package 与模型对抗审阅是直接反证；新增简单“每项记录检查”或“让模型质疑”不是新机制。未验证方案：对有限、可安全复制的软件任务，由人先指定一组保留语法且明确违反某验收项的负样本，在隔离副本分别运行现有检查，记录对应检查是否由通过转为拒绝；没有可设计负样本或证据不足时标未知，而非推断已覆盖。这只检验所选违例的区分力，不证明全部需求或程序安全，且需防止样本本身引入外部副作用。对照现有项目检查、逐项 check package 和负样本实验，测漏检、误拒、人工设计与运行成本；若额外负样本不能识别新的漏检或成本不可接受，则否定方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/ouroboros/mcp/tools/evaluation_handlers.py:1109-1132](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/mcp/tools/evaluation_handlers.py#L1109-L1132)

现有共享项目命令及逐项 check package。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/ouroboros/evaluation/models.py:190-201](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/models.py#L190-L201)

每项 recorded check 的既有组合。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/ouroboros/evaluation/adversarial.py:115-131](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/adversarial.py#L115-L131)

已有模型审阅的对抗清单及不能伪造执行证据。

<details>
<summary>查看原文（17行）</summary>

```text
def render_checklist(classes: tuple[AdversarialClass, ...] = ADVERSARIAL_CLASSES) -> str:
    """Render the classes as a compact, prompt-ready checklist."""
    lines = [
        "Probe each adversarial class whose TRIGGER matches this artifact "
        "(skip the ones that do not apply):",
    ]
    for cls in classes:
        lines.append(f"- **{cls.id}** ({cls.name}) — if {cls.trigger}: {cls.probe}.")
    return "\n".join(lines)


_EXECUTABLE_EVIDENCE_CONTRACT = (
    'A "done" claim is only as strong as the probes it survives. Use supplied '
    "artifact/reference/history/seed evidence only; if an applicable probe requires "
    "execution or observation that is not present, report that as an evidence gap in "
    "``differences`` (with a matching ``suggestion``) instead of implying you ran it. "
    "Let any real failure or unverified applicable probe lower ``correctness``."
```

</details>

**依据 4 · 源码核查**：[src/ouroboros/evaluation/mechanical.py:373-392](https://github.com/Q00/ouroboros/blob/722172ef096767583679d04aef5e847458fee6b2/src/ouroboros/evaluation/mechanical.py#L373-L392)

命令通过依据及 coverage 解析边界。

<details>
<summary>查看原文（20行）</summary>

```text
        passed = cmd_result.return_code == 0
        details: dict[str, Any] = {
            "command": list(command),
            "working_dir": str(self.config.working_dir) if self.config.working_dir else None,
            "return_code": cmd_result.return_code,
            "stdout_preview": _output_preview(cmd_result.stdout),
            "stderr_preview": _output_preview(cmd_result.stderr),
            "stdout_tail": _output_tail(cmd_result.stdout),
            "stderr_tail": _output_tail(cmd_result.stderr),
        }
        if cmd_result.executed_command is not None:
            details["executed_command"] = list(cmd_result.executed_command)

        # Extract coverage if this was a coverage check
        if check_type == CheckType.COVERAGE and passed:
            coverage = parse_coverage_from_output(cmd_result.stdout)
            if coverage is None and self.config.coverage_threshold != 0.0:
                # The exit code says the command ran, not that coverage met the
                # threshold. Without a figure the threshold is undecided: not a
                # pass, and not an executed failure that would claim a measurement.
```

</details>

#### 缺口

- 没有负样本原型与真实任务评估
  **影响**：无法证明可减少错过验收项或具有经济价值
  **进一步探讨**：在隔离可丢弃副本设计已知违例，对比现有与新增实验的漏检和代价。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
