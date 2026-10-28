# OpenStory

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[3e4857a](https://github.com/ZJU-LLMs/OpenStory/tree/3e4857a07ec141a9ed6d3be586dd5d3c573ae389)

<!-- BEGIN META -->
[![GitHub ★ 436](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=436&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZJU-LLMs/OpenStory)
<!-- END META -->

> **功能**：基于 Agent-Kernel 的多智能体故事推演框架，含 WorldKernel 世界生成示例

> **亮点**：[Q02](#research-q02) 把结构化世界产物与多角色状态循环组合成可继续探索的交互流程，而非只生成一篇文本。

> **主要限制**：[Q03](#research-q03) 单角色计划异常只记日志，tick完成不等于每个角色成功；schema/生成状态也不证明叙事质量或模拟有效。

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
  - [Q01 · 谁使用根框架，DSH插件身份是否等同？](#detail-section-11)
  - [Q02 · 世界生成与回合推进如何连到状态？](#detail-section-12)
  - [Q03 · tick完成和生成成功能证明故事/每个Agent成功吗？](#detail-section-13)
  - [Q04 · 怎样以可控规模试用，如何证伪角色健康门禁的价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向创作者与多Agent研究者生成并推进角色/地点/规则组成的故事世界；根是独立框架。

单模型角色扮演或手工配置Agent世界；底层运行机制来自Agent-Kernel，故事质量需同预算比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 结构化世界生成 | 形成角色/地点/规则产物 | 模型与schema依赖，不保证故事质量 |
| 多角色tick | 推进计划、消息和状态 | 局部异常不必阻止外围tick |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python、Agent-Kernel、Ray | 模拟必需 | Builder与多角色调度 | 先修环境或保留单模型基线 |
| Redis和世界配置 | 示例必需 | 消息/状态与角色数据 | 不推进未知状态 |
| 可用模型API与预算 | 生成必需 | 计划/世界内容 | 限制角色和tick，失败核费用 |
| DSH及dsh-openstory实现 | DSH接入必需 | 宿主工具 | 本提交未核实现，暂不作该路径采用结论 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户在独立目录配置小世界与模型 | 依赖/端口可达且产物可读 |
| 2 | 生成器产结构并核errors/report | 失败step不视作成功 |
| 3 | 用户推进少量tick并逐角色验收 | 局部异常/失步停止扩大，保留记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Python/Ray/Redis和模型配置 | 准备世界、角色与环境 | 金额/耗时未测 |
| 持续 | 多角色多回合模型/内存资源 | 核故事与状态一致性 | 单位合格剧情成本未知 |
| 失败恢复 | 部分生成和重试模型费用 | 核各角色及中间产物 | 恢复/回溯效果未验收 |
| 退出 | JSON/YAML及记录存储 | 导出并回手工/单模型叙事 | 不保证所有运行状态可迁移 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 世界可结构化 | DAG/FoundationBundle/空间管线 | 实际生成合格率 |
| 交互故事推进 | tick和角色计划状态 | 长期一致性、叙事质量和费用 |

> **思考**：[Q03](#research-q03) 单角色计划异常只记日志，tick完成不等于每个角色成功；schema/生成状态也不证明叙事质量或模拟有效。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 把结构化世界产物与多角色状态循环组合成可继续探索的交互流程，而非只生成一篇文本。

[Q02](#research-q02) 分离世界生成产物与角色运行值得借鉴；[Q03](#research-q03)局部异常与整体回合完成需统一可解释回执。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 单角色计划异常只记日志，tick完成不等于每个角色成功；schema/生成状态也不证明叙事质量或模拟有效。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 有Python/Redis/Ray能力者可在独立目录按固定小预算试世界与少量tick；角色失步或语义生成报错时暂停并回手工配置/单模型基线。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

结构生成和模拟回合接线有源码支持；DSH注册、真实生成质量、长期一致性与新门禁效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、dsh-openstory/README.zh.md、examples/WorldKernel/src/worldkernel/architect/pipeline.py、examples/WorldKernel/src/worldkernel/server.py、examples/WorldKernel/run_simulation.py、examples/WorldKernel/plugins/agent/plan/BasicPlanPlugin.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：重点检查WorldKernel生成endpoint/pipeline、模拟入口与角色plan插件；未全面审计全部故事、DSH插件、Agent-Kernel调度、视觉生成或分布式恢复。
- 下一步：固定世界/角色/模型与预算，对比当前循环、角色健康门禁和单模型角色扮演，测失步、剧情可继续率、人工修复和全部模型成本。

**分析版本**

- **仓库**：[ZJU-LLMs/OpenStory](https://github.com/ZJU-LLMs/OpenStory)
- **版本号**：未声明（[固定提交 3e4857a](https://github.com/ZJU-LLMs/OpenStory/tree/3e4857a07ec141a9ed6d3be586dd5d3c573ae389)）
- **版本日期**：2026-08-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 推导逐角色回合健康回执与推进门禁的未验证策略；同预算测无声失步、剧情可继续率和修复成本，频繁阻塞却不改善则推翻。

固定世界/角色/模型与预算，对比当前循环、角色健康门禁和单模型角色扮演，测失步、剧情可继续率、人工修复和全部模型成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 1637 | — | — | 11708 |
| .js | example | 11 | 17443 | 14778 | 880 | — |
| .tsx | example | 80 | 474 | 474 | 0 | — |
| .md | example | 21 | 2007 | — | — | 19181 |
| .ts | example | 1 | 1 | 0 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/ZJU-LLMs/OpenStory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/ZJU-LLMs/OpenStory/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ZJU-LLMs/OpenStory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：结构化世界生成与多Agent回合能否提供可验收的交互故事而非仅增加模型调用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用根框架，DSH插件身份是否等同？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根对象是故事推演工具/框架tool，基于Agent-Kernel，提供红楼梦、西部世界及WorldKernel示例；DSH接入是dsh-openstory子路径的另行安装说明。本提交该目录可见文档而非完整插件实现，因此本轮不宣称DSH工具注册已核验。目标是构建/探索角色、地点、规则及多角色互动的创作者与研究者；合格结果应世界结构可加载、若干回合状态自洽且人工认为故事可继续。基线是单模型角色扮演或手工配置Agent世界；角色数量和自动生成不自动证明故事更好。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-18](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/README.md#L14-L18)

WorldKernel和DSH主张

```text
**✨ Story 3《WorldKernel》现已上线！**
现在只需一句话，就能生成属于你的可交互故事世界。无论是海底城邦、轨道集市，还是神话森林、末日列车，`examples/WorldKernel` 都会把你的设想拆解为角色、地点、路径与规则，并接入多智能体模拟。

**✨ OpenStory 现已支持 DeepSeek Harness 插件！**
现在可以通过 `dsh-openstory` 将 OpenStory 多智能体推演接入 DeepSeek Harness，让 agent 直接启动模拟、查看角色、下达指令并逐回合推进故事。查看 [DSH 插件配置与使用指南](dsh-openstory/README.zh.md)。
```

**依据 2 · 作者声明**：[README.md:32-43](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/README.md#L32-L43)

Agent-Kernel归属与核心特性

<details>
<summary>查看原文（12行）</summary>

```text
##
OpenStory 是一个基于大语言模型（LLM）和 [Agent-Kernel](https://github.com/ZJU-LLMs/Agent-Kernel) 开发的多智能体推演与模拟框架。

**✨ 我们诚挚地邀请大家一起来共创故事！** 无论你是想续写经典、打破原著框架，还是创造一个完全属于你的平行宇宙，只要你的故事创意足够有趣、脑洞足够大，欢迎提交 PR！我们会将精彩的推演剧本和自定义配置合并到项目中，让更多人看到你的杰作。

## 🌟 核心特性

- **基于 Agent-Kernel 的动态框架**：底层采用强大的 Agent-Kernel 架构，支持在推演过程中**动态增删智能体**。告别僵化的静态设定，赋予系统无限的扩展能力，让你尽情发挥想象力！
- **一比一复刻的红楼梦大观园前端**：精心打造的 1:1 仿真可视化交互界面。你不仅能直观地看到智能体在地图上的动态轨迹，更能随时点击查看人物的详细信息、状态变化与互动档案。
- **富有冲击力的推演剧情**：打破常规的刻板对话，智能体之间将产生深度的化学反应。系统能够根据性格设定与环境变化，自动生成跌宕起伏、精彩绝伦且极具戏剧张力与冲击力的推演剧情！
- **丰富的插件化机制与高可配性**：涵盖智能体感知、计划、执行、反思等完整生命周期插件，并支持通过 YAML 文件灵活管理系统、环境、动作与智能体配置。
- **一句话生成世界（WorldKernel）**：输入一句自然语言设想，系统自动生成角色、地点、路径与规则，并接入可交互的多智能体模拟。
```

</details>

**依据 3 · 作者声明**：[dsh-openstory/README.zh.md:5-18](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/dsh-openstory/README.zh.md#L5-L18)

独立DSH插件说明与复杂前提

<details>
<summary>查看原文（14行）</summary>

```text
`dsh-openstory` 是 OpenStory 的 DeepSeek Harness（DSH）插件。插件已发布到 npm：<https://www.npmjs.com/package/dsh-openstory>。

它将 OpenStory 注册为 DSH 工具，并在 DSH 设置界面中提供 OpenStory 配置入口。启用 `autoStart` 后，只需启动 DSH；首次打开 OpenStory 前端或调用相关工具时，插件会自动启动 OpenStory 后端。

## 1. 前置条件

- Node.js 22 或更高版本
- 已安装 DeepSeek Harness，并至少初始化过一个 `web` profile
- OpenStory 源码库
- Python 3.11 至 3.13；Windows 推荐 Python 3.12
- Redis 运行在 `localhost:6379`；推荐 Redis 7
- 可用的 OpenAI-compatible 模型 API

不建议使用 Python 3.14：OpenStory 固定的 Ray 版本目前没有对应的 Windows wheel。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 世界生成与回合推进如何连到状态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

WorldKernel run_stage2加载Stage1产物和schema/tool注册表，编译context后由InitDAGRunner做语义生成，失败step会抛错；成功构建FoundationBundle并可选保存，再转为空间输入运行SpatialPipeline。server另有stage2 endpoint，运行DAG后保存语义产物并回completed_steps、errors和report.success，而非只回一个字符串。模拟入口Builder.init加载资源，逐tick执行step_agent、消息分发、角色状态更新和timer推进，再收集角色数据。plan插件按profile/state/memory形成长期任务及12-slot日计划并写state。增量是结构化生成产物与多角色状态循环的组合，底层Agent运行属于Agent-Kernel。

#### 证据与依据

**依据 1 · 源码核查**：[examples/WorldKernel/src/worldkernel/architect/pipeline.py:99-162](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/examples/WorldKernel/src/worldkernel/architect/pipeline.py#L99-L162)

语义DAG、失败门禁、产物和空间转换

<details>
<summary>查看原文（64行）</summary>

```text
    # --- Semantic Phase ---
    logger.info("=== Stage 2: Semantic Generation ===")

    # 1. Load Stage1 artifacts
    logger.info("Loading Stage1 artifacts from %s", session_root)
    bundle = InitInputLoader.from_session_root(session_root)

    # 2. Load schemas and tools
    schema_registry = create_default_schema_registry()
    load_stage1_session_schema_source(session_root, schema_registry)
    tool_registry = create_default_tool_registry(schema_registry)

    # 3. Compile init context
    logger.info("Compiling init context")
    context = compile_stage1_init_context(
        bundle,
        schema_registry=schema_registry,
        tool_registry=tool_registry,
        constraints=constraints,
    )

    # 4. Run semantic generation (LLM calls)
    logger.info("Running semantic generation")
    runner = InitDAGRunner(schema_registry, tool_registry)
    gen_state = await runner.run_async(context)

    if gen_state.failed_step_id:
        logger.error("Semantic generation failed at step %s", gen_state.failed_step_id)
        raise RuntimeError(
            f"Semantic generation failed at step {gen_state.failed_step_id}: "
            f"{gen_state.errors}"
        )

    # 5. Build FoundationBundle (in-memory)
    logger.info("Building FoundationBundle")
    foundation = FoundationBundleBuilder().build(context, gen_state)

    # 6. Optionally save semantic artifacts
    semantic_output_root = ""
    if save_semantic:
        sem_root = Path(output_root) / "semantic" if output_root else None
        report = save_semantic_artifacts(
            world_id=foundation.world_id,
            init_context=context,
            generation_state=gen_state,
            output_root=sem_root,
            debug=debug,
        )
        semantic_output_root = str(sem_root or _default_semantic_root(foundation.world_id))
        logger.info("Semantic artifacts saved to %s", semantic_output_root)

    # --- Spatial Phase ---
    logger.info("=== Stage 2: Spatial Generation ===")

    # 7. Convert FoundationBundle to SpatialBuildInput (in-memory, no disk I/O)
    logger.info("Converting FoundationBundle to SpatialBuildInput")
    build_input = SpatialPipelineAdapter.from_foundation_bundle(foundation)

    # 8. Load spatial config
    spatial_config = load_spatial_generation_config(config_path)

    # 9. Run spatial pipeline (B→C→D→E1→G)
    logger.info("Running spatial pipeline")
    spatial_result = SpatialPipeline(spatial_config).run(build_input)
```

</details>

**依据 2 · 源码核查**：[examples/WorldKernel/src/worldkernel/server.py:183-231](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/examples/WorldKernel/src/worldkernel/server.py#L183-L231)

HTTP生成结果带错误与存储报告

<details>
<summary>查看原文（49行）</summary>

```text
@app.post("/api/stage2/generate/{session_id}")
async def stage2_generate(session_id: str):
    session_dir = TEMPLATES_DIR / session_id
    if not session_dir.exists():
        raise HTTPException(status_code=404, detail="session not found")

    from worldkernel.architect import (
        compile_stage1_init_context,
        create_default_schema_registry,
        create_default_tool_registry,
        load_stage1_session_schema_source,
        save_semantic_artifacts,
    )
    from worldkernel.architect.semantic.runner import InitDAGRunner

    sr = create_default_schema_registry()
    load_stage1_session_schema_source(
        session_dir, sr, source_id="visual-e2e", world_id=session_id,
    )
    tr = create_default_tool_registry(sr)
    ctx = compile_stage1_init_context(
        session_dir, tool_registry=tr, source_id="visual-e2e", world_id=session_id,
        constraints=_constraints,
    )

    runner = InitDAGRunner(schema_registry=sr, tool_registry=tr)
    state = await runner.run_async(ctx)

    loc_result = (
        state.result_store.get_step_result("generate_locations")
        if state.result_store.has_step_result("generate_locations")
        else None
    )
    report = save_semantic_artifacts(
        session_id, ctx, state,
        output_root=session_dir / "generated" / "artifacts",
    )

    return {
        "completed_steps": state.completed_steps,
        "errors": state.errors,
        "locations": {
            "count": len(loc_result.items) if loc_result else 0,
            "avg_score": (
                loc_result.provenance.get("quality_summary", {}).get("avg_review_score")
                if loc_result else None
            ),
        },
        "report": {"success": report.success, "counts": report.counts},
```

</details>

**依据 3 · 源码核查**：[examples/WorldKernel/run_simulation.py:42-82](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/examples/WorldKernel/run_simulation.py#L42-L82)

Builder和真实tick生命周期

<details>
<summary>查看原文（41行）</summary>

```text
async def main(max_ticks: int | None = None) -> None:
    pod_manager = None
    system = None
    try:
        if not ray.is_initialized():
            ray.init(
                runtime_env={
                    "working_dir": str(PROJECT_PATH),
                    "env_vars": {"PYTHONPATH": os.pathsep.join(sys.path)},
                    "excludes": ["*.pyc", "__pycache__"],
                }
            )

        builder = Builder(project_path=str(PROJECT_PATH), resource_maps=RESOURCES_MAPS)
        pod_manager, system = await builder.init()
        ticks = max_ticks if max_ticks is not None else builder.config.simulation.max_ticks
        total_duration = 0.0

        for _ in range(ticks):
            started = time.time()
            await pod_manager.step_agent.remote()
            await system.run("messager", "dispatch_messages")
            current_tick = await system.run("timer", "get_tick")
            duration = time.time() - started
            total_duration += duration
            await pod_manager.update_agents_status.remote()
            await system.run("timer", "add_tick", duration_seconds=duration)
            logger.info("WorldKernel tick %s finished in %.3fs", current_tick, duration)

            agents_data = await pod_manager.collect_agents_data.remote()
            logger.info("WorldKernel tick %s collected %s agents", current_tick, len(agents_data))

        if ticks:
            logger.info("WorldKernel simulation finished. avg_tick=%.3fs", total_duration / ticks)
    finally:
        if pod_manager:
            await pod_manager.close.remote()
        if system:
            await system.close()
        if ray.is_initialized():
            ray.shutdown()
```

</details>

**依据 4 · 源码核查**：[examples/WorldKernel/plugins/agent/plan/BasicPlanPlugin.py:59-84](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/examples/WorldKernel/plugins/agent/plan/BasicPlanPlugin.py#L59-L84)

角色计划及状态写入

<details>
<summary>查看原文（26行）</summary>

```text
    async def execute(self, current_tick: int) -> None:
        try:
            state_plugin = self._component.agent.get_component("state").get_plugin()
            profile_plugin = self._component.agent.get_component("profile").get_plugin()

            if not await state_plugin.is_active():
                reason = await state_plugin.get_inactive_reason()
                logger.warning("[%s][%s] Agent offline, skip planning. Reason: %s", self.agent_id, current_tick, reason)
                return

            profile = profile_plugin.get_agent_profile()
            current_long_task = await state_plugin.get_long_task()
            memory = await self._get_memory_profile()

            if current_long_task is None:
                long_task_str = await self.generate_long_task(self.agent_id, current_tick, profile, memory=memory)
                await state_plugin.set_long_task(long_task_str)
                current_long_task = long_task_str

            if current_tick >= 0 and current_tick % 12 == 0:
                hourly_plans = await self.generate_hourly_plans(
                    self.agent_id, current_tick, profile, current_long_task, memory=memory
                )
                await state_plugin.set_hourly_plans(hourly_plans, tick=current_tick)
        except Exception as exc:  # noqa: BLE001
            logger.error("[%s][%s] Error executing PlanPlugin: %s", self.agent_id, current_tick, exc)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · tick完成和生成成功能证明故事/每个Agent成功吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能。plan.execute捕获异常只记录error，不重新抛出，因此外围tick继续不代表该角色计划更新完成；inactive角色也跳过。run_stage2明确检查failed_step_id，但HTTP端点返回errors和report.success，调用方必须检查它们，不能只以HTTP返回就宣告可玩。结构schema、空间布局和角色行为自洽是不同验收层；模型主观评审/生成文字也不能当玩家体验或因果模拟有效的证明。本轮只读源码，没有运行一次世界，无法判断文学质量、长期状态一致性及错误恢复后的故事连续性。

#### 证据与依据

**依据 1 · 源码核查**：[examples/WorldKernel/plugins/agent/plan/BasicPlanPlugin.py:64-84](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/examples/WorldKernel/plugins/agent/plan/BasicPlanPlugin.py#L64-L84)

离线跳过与异常仅日志

<details>
<summary>查看原文（21行）</summary>

```text
            if not await state_plugin.is_active():
                reason = await state_plugin.get_inactive_reason()
                logger.warning("[%s][%s] Agent offline, skip planning. Reason: %s", self.agent_id, current_tick, reason)
                return

            profile = profile_plugin.get_agent_profile()
            current_long_task = await state_plugin.get_long_task()
            memory = await self._get_memory_profile()

            if current_long_task is None:
                long_task_str = await self.generate_long_task(self.agent_id, current_tick, profile, memory=memory)
                await state_plugin.set_long_task(long_task_str)
                current_long_task = long_task_str

            if current_tick >= 0 and current_tick % 12 == 0:
                hourly_plans = await self.generate_hourly_plans(
                    self.agent_id, current_tick, profile, current_long_task, memory=memory
                )
                await state_plugin.set_hourly_plans(hourly_plans, tick=current_tick)
        except Exception as exc:  # noqa: BLE001
            logger.error("[%s][%s] Error executing PlanPlugin: %s", self.agent_id, current_tick, exc)
```

</details>

**依据 2 · 源码核查**：[examples/WorldKernel/run_simulation.py:60-72](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/examples/WorldKernel/run_simulation.py#L60-L72)

tick完成日志与角色数据收集

<details>
<summary>查看原文（13行）</summary>

```text
        for _ in range(ticks):
            started = time.time()
            await pod_manager.step_agent.remote()
            await system.run("messager", "dispatch_messages")
            current_tick = await system.run("timer", "get_tick")
            duration = time.time() - started
            total_duration += duration
            await pod_manager.update_agents_status.remote()
            await system.run("timer", "add_tick", duration_seconds=duration)
            logger.info("WorldKernel tick %s finished in %.3fs", current_tick, duration)

            agents_data = await pod_manager.collect_agents_data.remote()
            logger.info("WorldKernel tick %s collected %s agents", current_tick, len(agents_data))
```

</details>

**依据 3 · 源码核查**：[examples/WorldKernel/src/worldkernel/architect/pipeline.py:125-130](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/examples/WorldKernel/src/worldkernel/architect/pipeline.py#L125-L130)

pipeline的失败step门禁

```text
    if gen_state.failed_step_id:
        logger.error("Semantic generation failed at step %s", gen_state.failed_step_id)
        raise RuntimeError(
            f"Semantic generation failed at step {gen_state.failed_step_id}: "
            f"{gen_state.errors}"
        )
```

**依据 4 · 源码核查**：[examples/WorldKernel/src/worldkernel/server.py:221-231](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/examples/WorldKernel/src/worldkernel/server.py#L221-L231)

HTTP语义状态必须另读

<details>
<summary>查看原文（11行）</summary>

```text
    return {
        "completed_steps": state.completed_steps,
        "errors": state.errors,
        "locations": {
            "count": len(loc_result.items) if loc_result else 0,
            "avg_score": (
                loc_result.provenance.get("quality_summary", {}).get("avg_review_score")
                if loc_result else None
            ),
        },
        "report": {"success": report.success, "counts": report.counts},
```

</details>

#### 缺口

- 世界质量、角色局部失败率与多轮状态一致性未实测
  **影响**：不能把回合推进当有效故事或科学模拟
  **进一步探讨**：固定世界和模型运行小回合，逐角色核计划/行动/记忆及人工叙事评价

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样以可控规模试用，如何证伪角色健康门禁的价值？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

有Python/Redis/Ray与模型配置能力的创作者可先用小世界和固定少量tick在本机试用；不具运维条件者先观察，DSH插件另需固定实现/宿主验收。首次是依赖、世界数据和模型配置，持续由角色数×回合触发模型/状态操作，失败仍可能付费且需核部分产物。退出可保留生成JSON/YAML及故事记录，恢复/回溯范围要按实际示例验证。由角色异常吞掉和tick外层成功分离推导未验证假设：在回合结果列出每角色“计划/动作/记忆成功或跳过”，再决定是否推进，可减少无声失步。与当前tick循环及单模型角色扮演比较固定预算的小故事，测失步次数、可继续剧情比例和人工修复；若更严格门禁频繁阻塞却不改善一致性，或故事质量不优于简单基线，则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:66-99](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/README.md#L66-L99)

Python/Redis/Ray及端口前提

<details>
<summary>查看原文（34行）</summary>

````text
### 1. 环境准备

- **Python 版本**：推荐 Python 3.10 或以上。
- **中间件**：
  - **Redis**：作为默认的数据总线与缓存，请确保本地 Redis 服务已启动并在 `6379` 端口监听。

### 2. 安装依赖
```bash
git clone https://github.com/ZJU-LLMs/Agent-Kernel.git
cd Agent-Kernel

pip install -e "packages/agentkernel-distributed[all]"

cd ../../..
```

### 3. 运行推演系统

在项目根目录下，选择要运行的故事并执行相应命令。

#### 红楼梦

```bash
python -m examples.story_of_the_stone.run_simulation
```

启动过程中：
1. 系统会初始化 `Ray` 的运行时环境。
2. 构建并加载所有的插件、配置文件和《红楼梦》人物数据。
3. 启动 API Server，默认监听在 `0.0.0.0:8000`。

#### 西部世界

启动前，请确认 Redis 已运行，并在 `examples/WestWorld/configs/models_config.yaml` 中填写可用的 OpenAI-compatible 模型配置。西部世界与红楼梦都会使用 `8000` 端口，因此请勿同时运行两者。
````

</details>

**依据 2 · 源码核查**：[examples/WorldKernel/run_simulation.py:57-82](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/examples/WorldKernel/run_simulation.py#L57-L82)

ticks与清理边界

<details>
<summary>查看原文（26行）</summary>

```text
        ticks = max_ticks if max_ticks is not None else builder.config.simulation.max_ticks
        total_duration = 0.0

        for _ in range(ticks):
            started = time.time()
            await pod_manager.step_agent.remote()
            await system.run("messager", "dispatch_messages")
            current_tick = await system.run("timer", "get_tick")
            duration = time.time() - started
            total_duration += duration
            await pod_manager.update_agents_status.remote()
            await system.run("timer", "add_tick", duration_seconds=duration)
            logger.info("WorldKernel tick %s finished in %.3fs", current_tick, duration)

            agents_data = await pod_manager.collect_agents_data.remote()
            logger.info("WorldKernel tick %s collected %s agents", current_tick, len(agents_data))

        if ticks:
            logger.info("WorldKernel simulation finished. avg_tick=%.3fs", total_duration / ticks)
    finally:
        if pod_manager:
            await pod_manager.close.remote()
        if system:
            await system.close()
        if ray.is_initialized():
            ray.shutdown()
```

</details>

**依据 3 · 源码核查**：[examples/WorldKernel/plugins/agent/plan/BasicPlanPlugin.py:59-84](https://github.com/ZJU-LLMs/OpenStory/blob/3e4857a07ec141a9ed6d3be586dd5d3c573ae389/examples/WorldKernel/plugins/agent/plan/BasicPlanPlugin.py#L59-L84)

局部失败的假设依据

<details>
<summary>查看原文（26行）</summary>

```text
    async def execute(self, current_tick: int) -> None:
        try:
            state_plugin = self._component.agent.get_component("state").get_plugin()
            profile_plugin = self._component.agent.get_component("profile").get_plugin()

            if not await state_plugin.is_active():
                reason = await state_plugin.get_inactive_reason()
                logger.warning("[%s][%s] Agent offline, skip planning. Reason: %s", self.agent_id, current_tick, reason)
                return

            profile = profile_plugin.get_agent_profile()
            current_long_task = await state_plugin.get_long_task()
            memory = await self._get_memory_profile()

            if current_long_task is None:
                long_task_str = await self.generate_long_task(self.agent_id, current_tick, profile, memory=memory)
                await state_plugin.set_long_task(long_task_str)
                current_long_task = long_task_str

            if current_tick >= 0 and current_tick % 12 == 0:
                hourly_plans = await self.generate_hourly_plans(
                    self.agent_id, current_tick, profile, current_long_task, memory=memory
                )
                await state_plugin.set_hourly_plans(hourly_plans, tick=current_tick)
        except Exception as exc:  # noqa: BLE001
            logger.error("[%s][%s] Error executing PlanPlugin: %s", self.agent_id, current_tick, exc)
```

</details>

#### 缺口

- 单位可接受故事片段的费用、人工修复和退出/回溯可靠性未知
  **影响**：不能把一句话生成等同低成本端到端交付
  **进一步探讨**：固定角色/回合/模型预算，与单模型及人工配置对照并计入失败重做

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
