# Flameox

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c7ea167](https://github.com/morluto/flameox/tree/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f)

<!-- BEGIN META -->
[![GitHub ★ 231](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=231&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/flameox)
<!-- END META -->

> **功能**：为编码 Agent 协调本地性能采集、分析与证据保存，返回带来源、覆盖和限制的有界结果。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)表明工具把异构Profiler结果变为有输入身份、coverage和limitation的证据，capture和分页分离，临时analysis_id与持久evidence_id分清。相对手写脚本可减少上下文和来源口径漂移，原Profiler采集／统计不归根原创。

> **主要限制**：[Q03](#research-q03) cwd不是sandbox，capture运行可信本地程序，预算抽样且部分可选，原始证据也可能含敏感信息。[Q04](#research-q04) profile与描述估计不能证明语义正确、因果或性能提升；统一接口不等所有provider可用。

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
  - [Q01 · Flameox把Profiler材料变成什么，增量归谁？](#detail-section-11)
  - [Q02 · 显式capture、取消、分页和保存是否沿真实接线保留边界？](#detail-section-12)
  - [Q03 · provider依赖、临时／持久证据与全周期成本支持什么试用？](#detail-section-13)
  - [Q04 · 比较能证明性能改善吗，怎样推导一个未验证方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有Profiler知识的开发者让编码Agent解释性能材料；先处理显式脱敏artifact，合格结果需原材料身份、覆盖和限制，最终优化仍需语义测试与代表性工作负载。

手动Profiler加格式脚本／复制控制台；Profiler、hash和统计都是先例，增量在CLI/MCP共享证据契约、请求归属和可选不可变保存。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 有界artifact分析 | 统一性能证据与来源 | 显式材料，覆盖限制不是完整性保证 |
| 可信本地capture | 按argv采集并返回失败／清理回执 | 同OS权限，非sandbox，provider另需条件 |
| 分页与可选保存 | 不重跑目标地读结果、持久hash证据 | analysis_id会过期，原件可能敏感 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python3.12+ | 根runtime必需 | CLI／MCP运行 | 本轮未安装 |
| 显式绝对路径artifact | 分析必需 | 解析与输入身份 | 不自动搜父目录；digest不匹配拒绝 |
| 可信argv与绝对cwd | capture必需 | 执行目标 | cwd不是sandbox |
| 对应Profiler／硬件／权限 | 对应provider需 | 原生采集／解码 | 统一接口不保证本机可用 |
| 代表性负载与语义oracle | 确认性性能结论需 | 防把错误程序当优化 | profile不能替代 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 开发者固定版本，先选择已有脱敏小artifact | 核路径和digest，不先运行未知target |
| 分析 | Agent选命名operation | 读coverage、truncation和limitation |
| 翻页 | 原样用next_page的analysis工具/参数 | 不重跑capture；来源变更拒绝 |
| 保存 | 对重要结论显式preserve | 获evidence_id并核原件敏感性 |
| 退出 | 停MCP并移除客户端注册，按策略管理数据 | analysis_id不可当持久凭据，回原Profiler |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Python/工具依赖与本机资源 | 选operation/provider和权限 | 金额工时未知 |
| 持续 | CPU/GPU、原件空间、Agent模型 | 核identity、样本和语义正确 | 未证优化收益 |
| 失败恢复 | partial原件、重跑开销 | 看cleanup回执、避免副作用重跑 | timeout非远端停止证明 |
| 退出 | 需复核证据保留空间 | 移除注册、核canonical敏感数据 | 未保存会话可能不可恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 证据口径 | 显式来源／身份与覆盖字段 | Agent解释是否正确 |
| 重放与持久 | continuation分析不重跑、可选hash保存 | 所有解码器／平台兼容 |
| 资源和取消 | broker限制、进程组后代cleanup回执 | OS硬quota或所有外部副作用终止 |
| 性能结论 | 可比性校验与partial语义 | 因果、正确性和真实提速 |

> **思考**：[Q03](#research-q03) cwd不是sandbox，capture运行可信本地程序，预算抽样且部分可选，原始证据也可能含敏感信息。[Q04](#research-q04) profile与描述估计不能证明语义正确、因果或性能提升；统一接口不等所有provider可用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)表明工具把异构Profiler结果变为有输入身份、coverage和limitation的证据，capture和分页分离，临时analysis_id与持久evidence_id分清。相对手写脚本可减少上下文和来源口径漂移，原Profiler采集／统计不归根原创。

[Q02](#research-q02) 请求归属、argv执行、有限cleanup、continuation绑定和原子发布可追溯；无密钥checksum不是授权，sampled资源不是硬quota。全provider/OS边界需匹配环境运行验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) cwd不是sandbox，capture运行可信本地程序，预算抽样且部分可选，原始证据也可能含敏感信息。[Q04](#research-q04) profile与描述估计不能证明语义正确、因果或性能提升；统一接口不等所有provider可用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先分析脱敏已有artifact并保存可追溯证据，再决定是否配置特定capture provider。每次读身份／覆盖／失败，不用profile直接宣称优化；输入不可比或排障超过收益回原工具。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持显式输入、请求所有权、分页不重跑与持久证据机制；本轮未运行provider、目标或真实Agent，因果／节时／优化收益未证。保留清单仅未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、docs/investigations.md、docs/runtime-safety.md、docs/testing.md、src/flameox/execution.py、src/flameox/mcp/server.py、src/flameox/providers/inference_comparison.py、src/flameox/repository.py、src/flameox/runtime.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根Python工具source研究，定向MCP registry、capture绑定、执行broker关键失败、分页和repository保存与inference身份比较。未全审各Profiler解码器、安装器、CLI全支路或native硬件，不执行target。
- 下一步：[Q04](#research-q04)先以已知小artifact和身份不匹配／过期／重启反例验复核，再经许可执行无副作用capture取消试验；优化必须额外用语义oracle和代表负载。本轮未执行。

**分析版本**

- **仓库**：[morluto/flameox](https://github.com/morluto/flameox)
- **版本号**：未声明（[固定提交 c7ea167](https://github.com/morluto/flameox/tree/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f)）
- **版本日期**：2026-10-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)由过期analysis_id和显式preserve推导按结论依赖提示最小保留证据清单，可能降低重启丢证与盲目全保存。用另一人重建结论比较成功率、存储和工时；重现不增或总投入升即否定，尚未实现不计贡献。

[Q04](#research-q04)先以已知小artifact和身份不匹配／过期／重启反例验复核，再经许可执行无副作用capture取消试验；优化必须额外用语义oracle和代表负载。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 1937 | — | — | 16200 |
| .md | example | 1 | 20 | — | — | 143 |
| .cjs | source | 1 | 78 | 71 | 1 | — |
| .cjs | test | 1 | 90 | 83 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/morluto/flameox/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=10&color=737b86&logo=github)](https://github.com/morluto/flameox/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/morluto/flameox/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查有界本地性能证据与capture生命周期，限定分析、可比性和持久保存的采用范围。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Flameox把Profiler材料变成什么，增量归谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Flameox是给编码Agent的本地性能取证工具，根类型tool，通过CLI和MCP接受显式artifact或可信本地命令。目标是开发者让Agent定位CPU／内存／trace／benchmark问题时，保留原材料身份、覆盖、截断和失败，避免只读一段控制台便推断“优化有效”。合格结果是可追溯、范围明确的证据，真正的性能结论还要代表性任务和语义正确性。基线是手动运行Profiler，再逐种格式写脚本／贴输出给Agent。

作者把hypothesis和解释责任留给Agent，本工具协调capture、统一解析与可选保存；它不生成优化、不提供宿主和不自动证明因果。MCP按同一operation registry把analysis与capture分别路由到runtime，不是每工具单独实现随机执行路径。实际增量是规范化有界证据和身份／存储约束，成熟Profiler、统计和hash存储不能统称原创。源码可说明这一组合，尚无本轮Agent工具选择质量或真实调优成果对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-22](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/README.md#L15-L22)

作者明确显式输入、Agent解释责任和不修改项目配置。

```text
Flameox coordinates profilers, benchmark tools, trace processors, and direct local targets. It
turns an explicit artifact or command into bounded evidence while keeping durable preservation
optional. The agent chooses hypotheses and experiments; Flameox records observed inputs,
execution provenance, typed evidence, coverage, and limitations.

There is no workspace to initialize or project configuration to maintain. Pass exact artifact
paths to analysis and an explicit argv plus absolute working directory to capture. Flameox does not
search parent directories, edit project files, or provide a hosted service.
```

**依据 2 · 作者声明**：[README.md:72-102](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/README.md#L72-L102)

会话／持久证据、MCP和capture边界。

<details>
<summary>查看原文（31行）</summary>

```text
## Evidence and storage

Analysis and unpreserved capture use bounded session scratch. Session `analysis_id` values expire
when evicted or when the server stops. Explicit preservation creates the user-level Flameox data
directory and stores native bytes and a canonical evidence bundle by SHA-256. Set
`FLAMEOX_DATA_DIR` to choose another location. Preservation is optional; it does not imply full
console-output retention.

Flameox distinguishes observed, derived, and inferred claims. Profiles guide exploration but do
not establish causality or performance improvement. Confirmatory claims require representative
workloads, declared metrics and estimands, compatible identities, preserved samples, and a
semantic oracle.

## MCP

The MCP server has no workspace binding. It exposes named analysis and capture tools through the
same operation registry as the CLI. Analysis tools accept explicit sources; capture tools accept
a typed target and provider. Tool schemas expose operation-specific fields directly. Inspect the
catalog with `flameox mcp inspect`; use `--tool TOOL_NAME` for
focused schemas and examples. The complete contract and current tool catalog are in
[the interface guide](docs/interfaces.md).

Tools return their full bounded results inline, including failures and recovery actions. Preserved
evidence has a durable `evidence_id`; `inspect_evidence` returns its redacted metadata and replay
sources inline.

Capture takes argv, not a shell string. A direct target supplies an absolute working directory and
bounded environment overrides. Results may include `next_page`; replay its named analysis tool
and arguments unchanged. Capture continuations read collected artifacts and do not rerun the
target. MCP work belongs to the live request, so cancellation applies directly and no detached job
survives a restart.
```

</details>

**依据 3 · 源码核查**：[src/flameox/mcp/server.py:384-426](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/mcp/server.py#L384-L426)

共享registry分派analysis和capture到runtime。

<details>
<summary>查看原文（43行）</summary>

```text
        if name in OPERATION_BY_NAME:
            analysis_args = cast(AnalysisArguments, request)
            spec = OPERATION_BY_NAME[name]
            options = analysis_args.model_dump(include=set(spec.model.model_fields))
            await ctx.session.report_progress(0.0, message=f"analyzing {spec.name}")
            value, next_request = await runtime.run_in_request(
                partial(
                    runtime.analyze_page,
                    spec.name,
                    analysis_args.sources,
                    options,
                    limits=analysis_args.request_limits(),
                    continuation=analysis_args.continuation,
                )
            )
            value["status"] = "complete"
            _attach_next_page(value, next_request)
            return value
        if name in OPERATION_BY_CAPTURE_TOOL:
            capture_args = cast(CaptureArguments, request)
            spec = OPERATION_BY_CAPTURE_TOOL[name]
            provider_options = capture_args.provider.model_dump()
            provider_id = provider_options.pop("kind")
            analysis_options = capture_args.model_dump(include=set(spec.model.model_fields))
            target = CaptureTarget(
                **capture_args.target.model_dump(),
                provider_id=provider_id,
                capture_arguments=provider_options,
                analysis_arguments=analysis_options,
            )

            async def progress(current: int, total: int, message: str) -> None:
                await ctx.session.report_progress(float(current), float(total), message)

            value, next_request = await runtime.capture_analysis_page(
                target,
                spec.name,
                experiment=getattr(capture_args, "experiment", None),
                limits=capture_args.request_limits(),
                progress=progress,
                preserve=capture_args.preserve,
            )
            _attach_next_page(value, next_request)
```

</details>

#### 缺口

- 与手写Profiler脚本同任务的错误推断、调优效果和人工成本未比较。
  **影响**：不能宣称真实优化成功率或节时。
  **进一步探讨**：固定有已知瓶颈与语义测试的小任务，对照原脚本和证据工具的结论正确率及总投入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 显式capture、取消、分页和保存是否沿真实接线保留边界？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

MCP capture把typed target/provider构造成CaptureTarget，进入runtime.capture_analysis_page，analysis则run_in_request调用同一analyze_page；prepare_providers是独立显式操作，不能把分析调用描述成隐式安装全部provider。capture先验证operation、experiment和limits，解析cwd，绑定目标与collector可执行文件；环境合并最多32项，按声明实验序列构造调用。执行用create_subprocess_exec(*argv)，不把输入拼shell，POSIX新session。argv避免shell解析，但目标仍拥有本工具OS权限，cwd不是sandbox，不能运行不可信项目。

broker异常／取消进入shielded cleanup，终止进程组和追踪后代、有限等待后升级SIGKILL，并结算reader／资源和不完整输出。代码保留cleanup_complete与cancellation cause等回执；不能从timeout单独推断所有外部工作／网络副作用已经停止，也不能把抽样RSS／文件增长当内核quota。

分页next request从cached.sources或preserved evidence重建分析请求，带expected_sha256与原operation/options/limits，不再次capture目标；continuation校验请求identity摘要和offset，不匹配报INVALID_INPUT。checksum是无密钥完整性检查而非授权签名。analysis_id只在当前runtime缓存；过期preserve报EXPIRED_SESSION_ANALYSIS。保存走repository：原件发布、stage文件／manifest验证、原子目录发布并核并发已有目标，成功后释放scratch。能支持身份和完整发布设计，不等于第三方格式解析、OS回收和断电场景已本轮运行通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/flameox/mcp/server.py:342-383](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/mcp/server.py#L342-L383)

provider准备为独立显式工具。

<details>
<summary>查看原文（42行）</summary>

```text
        if name == "prepare_providers":
            prepare_args = cast(PrepareProvidersArguments, request)
            await ctx.session.report_progress(0.0, message="preparing selected providers")
            try:
                prepared = await runtime.dependencies.prepare(
                    prepare_args.provider_ids, prepare_args.timeout_seconds
                )
            except provider_setup.ProviderSelectionFailure as error:
                raise RuntimeFailure("INVALID_INPUT", str(error)) from error
            except provider_setup.SetupFailure as error:
                raise RuntimeFailure("SETUP_FAILURE", str(error)) from error
            next_action = None
            if prepared.restart_required is not False:
                next_action = {
                    "kind": "reconnect_mcp",
                    "necessity": "required" if prepared.restart_required else "conditional",
                    "launcher": {
                        "command": prepared.launcher_command,
                        "args": prepared.launcher_args,
                    },
                    "message": (
                        "Preserve needed session analyses, then reconnect with the launcher."
                    ),
                }
            value: dict[str, Any] = {
                "status": "complete",
                "requested_providers": prepared.requested_providers,
                "prepared_managed_providers": prepared.prepared_managed_providers,
                "external_requirements": [
                    {"provider_id": item.provider_id, "guidance": item.guidance}
                    for item in prepared.external_requirements
                ],
                "preparation": {"status": prepared.preparation_status},
                "launcher": {"command": prepared.launcher_command, "args": prepared.launcher_args},
                "next_action": next_action,
                "activation_status": prepared.activation_status,
                "workload_requirements": [
                    {"provider_id": item.provider_id, "guidance": item.guidance}
                    for item in prepared.workload_requirements
                ],
            }
            return value
```

</details>

**依据 2 · 源码核查**：[src/flameox/mcp/server.py:402-426](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/mcp/server.py#L402-L426)

typed capture实际入口。

<details>
<summary>查看原文（25行）</summary>

```text
        if name in OPERATION_BY_CAPTURE_TOOL:
            capture_args = cast(CaptureArguments, request)
            spec = OPERATION_BY_CAPTURE_TOOL[name]
            provider_options = capture_args.provider.model_dump()
            provider_id = provider_options.pop("kind")
            analysis_options = capture_args.model_dump(include=set(spec.model.model_fields))
            target = CaptureTarget(
                **capture_args.target.model_dump(),
                provider_id=provider_id,
                capture_arguments=provider_options,
                analysis_arguments=analysis_options,
            )

            async def progress(current: int, total: int, message: str) -> None:
                await ctx.session.report_progress(float(current), float(total), message)

            value, next_request = await runtime.capture_analysis_page(
                target,
                spec.name,
                experiment=getattr(capture_args, "experiment", None),
                limits=capture_args.request_limits(),
                progress=progress,
                preserve=capture_args.preserve,
            )
            _attach_next_page(value, next_request)
```

</details>

**依据 3 · 源码核查**：[src/flameox/runtime.py:897-978](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/runtime.py#L897-L978)

capture验证、环境上限和目标／collector／oracle绑定。

<details>
<summary>查看原文（82行）</summary>

```text
        validated_capture = self._validate_capture_request(
            target, operation, experiment=experiment, limits=limits
        )
        target = target.model_copy(
            update={
                "analysis_arguments": validated_capture.analysis_arguments.model_dump(mode="json")
            }
        )
        mode = "experiment" if experiment is not None else "single"
        selected_limits = validated_capture.limits
        capture_arguments = validated_capture.capture_arguments
        cases = validated_capture.cases
        blocks = validated_capture.blocks
        sequence = self._capture_sequence(cases, blocks, experiment)
        total = len(sequence)
        has_oracle = experiment is not None and experiment.semantic_oracle is not None
        full_output = (
            target.console_output == "full" or target.provider_id == "direct" or has_oracle
        )
        full_oracle_output = target.console_output == "full"
        diagnostic_bytes = 0
        cwd = self._resolve_capture_cwd(target.cwd)
        async with self._capture_scope() as request_scratch:

            def admit() -> list[BoundCapture]:
                nonlocal diagnostic_bytes
                pending_executions: list[dict[str, Any]] = []
                bound_captures: list[BoundCapture] = []
                probed_workloads: set[tuple[str, tuple[tuple[str, str], ...]]] = set()
                for sequence_number, block, case in sequence:
                    argv = case.argv or target.argv
                    environment = {**target.environment, **case.environment}
                    if len(environment) > 32:
                        raise RuntimeFailure(
                            "INVALID_INPUT",
                            "merged capture environment must contain at most 32 entries",
                        )
                    directory = request_scratch / f"case-{sequence_number:04d}"
                    workload_binding = self._require_host_tool(
                        argv[0], cwd=cwd, environment={**os.environ, **environment}
                    )
                    pinned_argv = [str(workload_binding.invocation_path), *argv[1:]]
                    invocation = build_capture_invocation(
                        target.provider_id,
                        pinned_argv,
                        environment,
                        capture_arguments,
                        directory,
                        self._require_managed_executable,
                    )
                    workload_key = (argv[0], tuple(sorted(environment.items())))
                    if workload_key not in probed_workloads:
                        self._require_workload_python_provider(
                            target.provider_id, argv, environment, cwd=cwd
                        )
                        probed_workloads.add(workload_key)
                    collector_binding = self._require_host_tool(
                        invocation.argv[0],
                        cwd=cwd,
                        environment={**os.environ, **invocation.environment},
                        provider_id=target.provider_id,
                    )
                    if (
                        target.provider_id == "nsight-compute"
                        and self.nsight_compute.resolve_interface(collector_binding.invocation_path)
                        is None
                    ):
                        raise RuntimeFailure(
                            "UNAVAILABLE_CAPABILITY",
                            "The official Nsight Compute ncu_report.py interface is missing.",
                            details={
                                "provider_id": target.provider_id,
                            },
                            remediation=(SYSTEM_PROVIDER_GUIDANCE[target.provider_id],),
                        )
                    self.dependencies.verify_capture_binding(target.provider_id, collector_binding)
                    oracle_binding = None
                    if experiment is not None and experiment.semantic_oracle is not None:
                        oracle_binding = self._require_host_tool(
                            experiment.semantic_oracle[0],
                            cwd=cwd,
                            environment={**os.environ, **environment},
```

</details>

**依据 4 · 源码核查**：[src/flameox/execution.py:608-626](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/execution.py#L608-L626)

argv subprocess、取消检查与POSIX session。

<details>
<summary>查看原文（19行）</summary>

```text
            async with asyncio.timeout_at(deadline):
                await anyio.lowlevel.checkpoint_if_cancelled()
                # Acquire the handle before request-scope cancellation can unwind.
                # asyncio's transport startup cleanup is not level-cancellation safe.
                # The broker deadline still bounds this acquisition.
                with anyio.CancelScope(shield=True):
                    process = await asyncio.create_subprocess_exec(
                        *argv,
                        cwd=cwd,
                        env=environment,
                        stdin=(
                            asyncio.subprocess.PIPE
                            if request.stdin_bytes is not None
                            else asyncio.subprocess.DEVNULL
                        ),
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.PIPE,
                        start_new_session=os.name == "posix",
                    )
```

</details>

**依据 5 · 源码核查**：[src/flameox/execution.py:756-788](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/execution.py#L756-L788)

取消/异常cleanup、不完整输出和限制原因。

<details>
<summary>查看原文（33行）</summary>

```text
        except BaseException as exc:
            # Cleanup belongs to the broker, including under AnyIO's repeated
            # cancellation. Callers must not need their own task/shield wrappers.
            with anyio.CancelScope(shield=True):
                try:
                    cleanup_complete = await self._terminate_with_observation(
                        process, request, process_observations, on_cleanup, tracked_descendants
                    )
                finally:
                    stop_observation.set()
                    await self._settle_readers(stdout_task, stderr_task)
                    if diagnostic_state is not None:
                        # A terminated request cannot claim that no inherited
                        # writer remains, even if cleanup happened to produce
                        # EOF while the readers were settling.
                        diagnostic_state.mark_incomplete("stdout", "stderr")
                    self._close_async_process_transport(process)
                    resources = await self._collect_resource(resource_task)
                    await self._settle_task(stdin_task)
            partial_stdout, partial_stderr = bytes(stdout_buffer), bytes(stderr_buffer)
            if output_sink is not None:
                output_sink.mark_incomplete()
                output_sink_metadata = await output_sink.close()
            retryable = False
            if isinstance(exc, TimeoutError):
                cause = ProcessCancellationCause.TIMEOUT
                code = ErrorCode.EXECUTION_TIMEOUT
                message = f"Process exceeded {request.timeout_seconds} seconds."
                retryable = True
            elif isinstance(exc, _OutputLimitExceeded):
                cause = ProcessCancellationCause.OUTPUT_LIMIT
                code = ErrorCode.LIMIT_EXCEEDED
                message = f"Process output exceeded {request.max_output_bytes} bytes."
```

</details>

**依据 6 · 源码核查**：[src/flameox/execution.py:1398-1445](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/execution.py#L1398-L1445)

进程组与后代清理、升级KILL并返回清理状态。

<details>
<summary>查看原文（48行）</summary>

```text
    async def _terminate(
        self,
        process: asyncio.subprocess.Process,
        request: ExecutionRequest,
        tracked_descendants: dict[int, float | None],
    ) -> bool:
        descendants = self._tracked_processes(
            (*self._descendants(process.pid),),
            tracked_descendants,
            root_pid=process.pid,
        )
        for descendant in descendants:
            with suppress(psutil.Error):
                descendant.terminate()
        if process.returncode is not None:
            if os.name == "posix":
                with suppress(ProcessLookupError):
                    os.killpg(process.pid, signal.SIGKILL)
            return await self._finish_descendant_cleanup(descendants)
        scope_stopped = True
        if request.systemd_scope_unit is not None:
            scope_stopped = await self._stop_systemd_scope(
                request.systemd_scope_unit,
                timeout_seconds=request.graceful_shutdown_seconds,
            )
        try:
            if os.name == "posix":
                os.killpg(process.pid, signal.SIGTERM)
            else:
                process.terminate()
        except ProcessLookupError:
            await self._wait_root_exit(process)
            return scope_stopped and await self._finish_descendant_cleanup(descendants)
        try:
            async with asyncio.timeout(request.graceful_shutdown_seconds):
                await self._wait_root_exit(process)
                return scope_stopped and await self._finish_descendant_cleanup(descendants)
        except TimeoutError:
            pass
        try:
            if os.name == "posix":
                os.killpg(process.pid, signal.SIGKILL)
            else:
                process.kill()
        except ProcessLookupError:
            pass
        await self._wait_root_exit(process)
        return scope_stopped and await self._finish_descendant_cleanup(descendants)
```

</details>

**依据 7 · 源码核查**：[src/flameox/runtime.py:1930-1966](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/runtime.py#L1930-L1966)

continuation重建分析source/args，非重跑。

<details>
<summary>查看原文（37行）</summary>

```text
        preserved_sources: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any] | None:
        """Return the complete replayable request for a result's next evidence page."""

        continuation = result.get("continuation")
        analysis_id = result.get("analysis_id")
        if not isinstance(continuation, str) or not isinstance(analysis_id, str):
            return None
        cached = self.analyses.get(analysis_id)
        if cached is None:
            return None
        preserved = cached.preserved
        if preserved_sources is not None:
            sources = preserved_sources
        elif isinstance(preserved, Mapping):
            projection = self.read_evidence_agent_projection(str(preserved["evidence_id"]))
            sources = projection["analysis_sources"]
        else:
            sources = [
                {
                    "kind": "path",
                    "path": str(item.path),
                    "format": item.format,
                    "producer": item.producer,
                    "expected_sha256": item.sha256,
                }
                for item in (cached.analysis_sources or cached.sources)
            ]
        analysis_request = cached.manifest_body["analysis_request"]
        return self._copy_result(
            {
                "operation": cached.manifest_body["operation"],
                "sources": sources,
                "options": analysis_request["arguments"],
                "limits": analysis_request["limits"],
                "continuation": continuation,
            }
```

</details>

**依据 8 · 源码核查**：[src/flameox/runtime.py:3248-3280](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/runtime.py#L3248-L3280)

请求摘要和offset校验，不是授权token。

<details>
<summary>查看原文（33行）</summary>

```text
    def _encode_continuation(self, identity: Mapping[str, Any], offset: int) -> str:
        payload = {
            "request": self._continuation_digest(identity),
            "offset": offset,
        }
        checksum = hashlib.sha256(canonical_bytes(payload)).hexdigest()
        return (
            base64.urlsafe_b64encode(canonical_bytes({"checksum": checksum, "payload": payload}))
            .decode()
            .rstrip("=")
        )

    def _decode_continuation(
        self, token: str | None, identity: Mapping[str, Any], default: int
    ) -> int:
        if token is None:
            return default
        try:
            value = json.loads(base64.urlsafe_b64decode(token + "=" * (-len(token) % 4)))
            payload = value["payload"]
            expected = hashlib.sha256(canonical_bytes(payload)).hexdigest()
            if not secrets.compare_digest(value["checksum"], expected) or payload[
                "request"
            ] != self._continuation_digest(identity):
                raise ValueError
            offset = payload["offset"]
            if type(offset) is not int or offset < 0:
                raise ValueError
            return offset
        except (ValueError, TypeError, KeyError, RecursionError) as exc:
            raise RuntimeFailure(
                "INVALID_INPUT", "Continuation does not match this request and its inputs"
            ) from exc
```

</details>

**依据 9 · 源码核查**：[src/flameox/runtime.py:1857-1895](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/runtime.py#L1857-L1895)

过期、preserve与释放scratch。

<details>
<summary>查看原文（39行）</summary>

```text
    def preserve_evidence(self, analysis_id: str) -> dict[str, Any]:
        cached = self.analyses.get(analysis_id)
        if cached is None:
            raise RuntimeFailure(
                "EXPIRED_SESSION_ANALYSIS",
                "The session analysis is missing or expired",
                remediation=_EXPIRED_ANALYSIS_REMEDIATION,
            )
        if cached.preserved is not None:
            try:
                self.repository.read(str(cached.preserved["evidence_id"]))
            except RepositoryError as exc:
                if exc.code != "MISSING_EVIDENCE":
                    raise self._repository_failure(exc) from exc
                cached.preserved = None
            except OSError as exc:
                raise RuntimeFailure(
                    "REPOSITORY_IO_FAILURE", "Preserved evidence could not be validated."
                ) from exc
            else:
                self.analyses.move_to_end(analysis_id)
                return dict(cached.preserved)
        if cached.preserved is None:
            try:
                cached.preserved = self.repository.preserve(
                    manifest_body=cached.manifest_body,
                    sources=cached.sources,
                    analysis_source_indices=cached.analysis_source_indices,
                    analysis=self._durable_analysis(cached.result),
                )
                self._release_analysis_scratch(cached)
            except RepositoryError as exc:
                raise self._repository_failure(exc) from exc
            except OSError as exc:
                raise RuntimeFailure(
                    "REPOSITORY_IO_FAILURE", "Evidence could not be preserved."
                ) from exc
        self.analyses.move_to_end(analysis_id)
        return dict(cached.preserved)
```

</details>

**依据 10 · 源码核查**：[src/flameox/repository.py:171-207](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/repository.py#L171-L207)

保存验证／stage／原子发布和并发复用核查。

<details>
<summary>查看原文（37行）</summary>

```text
    def preserve(
        self,
        *,
        manifest_body: Mapping[str, Any],
        sources: Sequence[NativeSource],
        analysis_source_indices: Sequence[int] | None,
        analysis: Mapping[str, Any],
    ) -> dict[str, Any]:
        artifacts, _layout, artifact_refs, analysis_bytes, manifest = self._publication_plan(
            manifest_body, sources, analysis_source_indices, analysis
        )
        self.initialize()
        published_refs = [self._publish_artifact(item) for item in artifacts]
        if published_refs != artifact_refs:
            raise RepositoryError("REPOSITORY_CORRUPTION", "Artifact publication changed identity.")
        evidence_id = str(manifest["evidence_id"])
        destination = self._evidence_path(evidence_id)
        if destination.exists():
            self._validate_evidence(destination, expected=manifest)
        else:
            stage = self._new_stage("evidence")
            try:
                (stage / "data").mkdir()
                self._write_file(stage / "data" / "analysis.json", analysis_bytes)
                _fsync_directory(stage / "data")
                self._write_file(stage / "manifest.json", canonical_bytes(manifest))
                self._validate_evidence(stage, expected=manifest)
                self._publish_directory(stage, destination)
                if stage.exists():
                    self._validate_evidence(destination, expected=manifest)
            finally:
                if stage.exists():
                    shutil.rmtree(stage)
        return {
            "evidence_id": evidence_id,
            "artifact_count": len(artifact_refs),
        }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · provider依赖、临时／持久证据与全周期成本支持什么试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

适合能理解Profiler和工作负载语义的开发者先分析已有、脱敏、明确路径的小artifact，不先执行未知capture。需要Python3.12+；具体capture需对应工具／权限／平台，GPU／Nsight／xctrace等不能由统一接口推断本机可用。npm入口是启动／客户端配置便利，npx setup会改所选全局MCP配置，不能把“无项目配置”理解成零安装副作用。本轮不运行setup、provider准备或target。

scratch有界并可能LRU淘汰，服务停止会丢analysis_id；重要结论应显式preserve成evidence_id。保存并非仅摘要：原始字节、有效请求、路径、argv／environment和执行来源可能敏感。MCP inspect_evidence对Agent返回脱敏投影，不表示本地canonical manifest／native artifact已脱敏；接入Agent后返回内容仍可能进入调用者模型上下文。数据不主动上传是本工具范围，不能替Agent整个链保证离机保密。

限制按请求／调用而非整个实验统一预算，目标timeout/RSS可选；RSS、可写增长是抽样和best-effort，不是OS硬quota。首次需选择并核provider和权限，持续需存原件、审coverage／limitation及管理容量；失败后先看cleanup与partial证据，不盲目重复有副作用工作。退出先preserve必要结果、停MCP、移除所选客户端注册，再按保留策略核数据目录和原件；未保存会话不保证可恢复。现金成本来自本机CPU/GPU、可选provider及Agent模型，金额和工时未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-47](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/README.md#L24-L47)

setup/update修改客户端配置，有dry-run/版本回退声明。

<details>
<summary>查看原文（24行）</summary>

````text
## Quick start

Configure an MCP client with the global setup command:

```console
npx flameox@latest setup
```

Setup detects supported clients and asks which configurations to update. For automation, select
clients explicitly, for example `--client codex --yes` or `--all --yes`; `--dry-run` reports the
paths and actions without writing. Setup preserves unrelated client configuration and does not
change project files. See [the npm package guide](npm/README.md) for details.

Update existing MCP registrations with:

```console
npx flameox@latest update
```

`update --check` reports available updates without changing configuration. Updates preserve each
client's provider extras and settings, verify the new environment before changing release pins,
and report which clients need a restart or reconnect. Use `--client codex` to select one client,
or `--version 0.2.8` to select a specific release, including for rollback. The Python CLI exposes
the same `flameox update` command.
````

</details>

**依据 2 · 作者声明**：[README.md:72-83](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/README.md#L72-L83)

会话与可选保存、claims边界。

<details>
<summary>查看原文（12行）</summary>

```text
## Evidence and storage

Analysis and unpreserved capture use bounded session scratch. Session `analysis_id` values expire
when evicted or when the server stops. Explicit preservation creates the user-level Flameox data
directory and stores native bytes and a canonical evidence bundle by SHA-256. Set
`FLAMEOX_DATA_DIR` to choose another location. Preservation is optional; it does not imply full
console-output retention.

Flameox distinguishes observed, derived, and inferred claims. Profiles guide exploration but do
not establish causality or performance improvement. Confirmatory claims require representative
workloads, declared metrics and estimands, compatible identities, preserved samples, and a
semantic oracle.
```

</details>

**依据 3 · 作者声明**：[README.md:114-117](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/README.md#L114-L117)

Python3.12+。

```text
## Development

Flameox requires Python 3.12 or newer and uses the committed `uv.lock`. See
[CONTRIBUTING.md](CONTRIBUTING.md) for development setup and contribution guidance.
```

**依据 4 · 作者声明**：[docs/runtime-safety.md:7-19](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/docs/runtime-safety.md#L7-L19)

cwd非sandbox与OS权限、环境边界。

<details>
<summary>查看原文（13行）</summary>

```text
## Explicit authority

The MCP runtime has no workspace or project root. Capture requires an existing absolute `cwd` and
analysis requires explicit absolute inputs; neither falls back to server startup state. Inputs may
include an expected SHA-256 checked before decoding. Flameox never searches parent directories or
treats local marker directories as discovery state.

Environment overrides are bounded by count and length. The subprocess broker retains its
dangerous-variable and credential-name checks, exact executable binding, selected output ceiling,
explicit workload timeout,
resource observation, process-group cleanup, and descendant cleanup behavior. The target remains a
trusted local process with the operating-system permissions of Flameox; `cwd` is context, not a
sandbox.
```

</details>

**依据 5 · 作者声明**：[docs/runtime-safety.md:70-97](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/docs/runtime-safety.md#L70-L97)

scratch reservation、LRU与provider cache边界。

<details>
<summary>查看原文（28行）</summary>

```text

Session scratch has byte and file ceilings. A capture is rejected before its
declared output budget could exhaust remaining capacity. Least-recently-used session analyses and
conversion outputs and materialized evidence are evicted to make room; their `analysis_id` handles
then report `EXPIRED_SESSION_ANALYSIS`. Successful preservation releases capture scratch after the immutable
bundle is published. All remaining scratch disappears at shutdown.

Capture admission reserves bytes and files until the request unwinds. Other captures and evidence
materializations count that reservation even before its output exists; written bytes consume the
reservation rather than being counted twice. Active capture roots cannot be evicted. One capture
scope releases the reservation and removes unretained scratch on every exit, including cancellation
and progress-callback failure.

Evidence requests admit all selected source sizes and file counts before materializing any bundle.
Active analysis inputs stay pinned during subsequent input acquisition and conversion. Evicting a
handle never removes a scratch source still referenced by another cached analysis or active request,
including a request for one member of a cached bundle. Reused materializations are checked before
an analysis-cache hit can return. Failed requests discard newly acquired, unretained scratch artifacts.
Failed analyses use the same bounded handle cache as successful analyses.

Provider projections have a separate least-recently-used cache bounded by entry count and serialized
bytes. Continuation pages reuse the same immutable bounded projection, while every request still
binds the projection to the Flameox implementation and any external decoder executable digest, and
resolves and hashes its sources before and after analysis. Eviction changes latency only.

Capture performs compatibility, invocation binding, executable, aggregate scratch, and provenance
admission before allocating request scratch or executing workload and oracle processes. These
checks are part of the capture request rather than a separate plan or preflight lifecycle.
```

</details>

**依据 6 · 作者声明**：[docs/runtime-safety.md:99-122](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/docs/runtime-safety.md#L99-L122)

每调用预算、可选timeout/RSS与抽样限制。

<details>
<summary>查看原文（24行）</summary>

```text
## Input and output bounds

Console retention modes and omission accounting are defined in
[storage and evidence](storage-and-evidence.md). Full-output collection uses request-owned disk
files and the existing combined output ceiling. Native artifact growth and decoder bounds still
apply. Workload time/RSS budgets are optional fields on `target.budget`; absent values do not inherit
decoder limits. An explicit timeout and sampled process-tree RSS cap (including the collector) apply
separately to each capture invocation and semantic oracle, not to the experiment as a whole. RSS is
best-effort rather than an OS quota. Timeout and memory termination report the selected budget, and
cancellation and cleanup remain mandatory even when no budget is set.

- analysis accepts 1-32 sources and at most 1,000 rows per call;
- pages retain complete selected rows and capture provenance without a response-byte ceiling;
- continuations bind request arguments, limits, formats, and input digests;
- capture argv, merged environment, explicitly selected timeout, full output, and durable
  provenance are bounded;
- experiment cases and blocks have explicit maxima.

Invalid digests fail before decoding. Decode and format failures never become
empty successful evidence.

Capture execution results identify the cancellation cause, configured threshold, available
observation, unit, and a bounded recovery hint when the broker terminates a process for timeout,
output, memory, writable-growth, or storage-reserve policy.
```

</details>

**依据 7 · 作者声明**：[docs/runtime-safety.md:140-152](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/docs/runtime-safety.md#L140-L152)

本地原件敏感与MCP脱敏投影不等canonical清除。

<details>
<summary>查看原文（13行）</summary>

```text
## Privacy

All work stays local. Manifests preserve explicit paths, provider identity,
effective requests, digests, and execution provenance, so callers must consider
whether those values are sensitive before preservation. Flameox does not upload
artifacts, launch native viewers, or expose native payload bytes through evidence inspection.
The MCP `inspect_evidence` result is a structurally allowlisted projection: full argv,
environment values, working directories, source paths, and scratch paths remain available only
through explicit local canonical-manifest inspection.

The same rule applies to failures. MCP messages use stable, path-free summaries for unexpected I/O
and dependency errors and do not include raw exception strings. Local exception chaining retains the
cause for debugging without making it part of the agent-visible contract.
```

</details>

**依据 8 · 源码核查**：[src/flameox/runtime.py:1857-1895](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/runtime.py#L1857-L1895)

缓存过期与显式保存实际路径。

<details>
<summary>查看原文（39行）</summary>

```text
    def preserve_evidence(self, analysis_id: str) -> dict[str, Any]:
        cached = self.analyses.get(analysis_id)
        if cached is None:
            raise RuntimeFailure(
                "EXPIRED_SESSION_ANALYSIS",
                "The session analysis is missing or expired",
                remediation=_EXPIRED_ANALYSIS_REMEDIATION,
            )
        if cached.preserved is not None:
            try:
                self.repository.read(str(cached.preserved["evidence_id"]))
            except RepositoryError as exc:
                if exc.code != "MISSING_EVIDENCE":
                    raise self._repository_failure(exc) from exc
                cached.preserved = None
            except OSError as exc:
                raise RuntimeFailure(
                    "REPOSITORY_IO_FAILURE", "Preserved evidence could not be validated."
                ) from exc
            else:
                self.analyses.move_to_end(analysis_id)
                return dict(cached.preserved)
        if cached.preserved is None:
            try:
                cached.preserved = self.repository.preserve(
                    manifest_body=cached.manifest_body,
                    sources=cached.sources,
                    analysis_source_indices=cached.analysis_source_indices,
                    analysis=self._durable_analysis(cached.result),
                )
                self._release_analysis_scratch(cached)
            except RepositoryError as exc:
                raise self._repository_failure(exc) from exc
            except OSError as exc:
                raise RuntimeFailure(
                    "REPOSITORY_IO_FAILURE", "Evidence could not be preserved."
                ) from exc
        self.analyses.move_to_end(analysis_id)
        return dict(cached.preserved)
```

</details>

#### 缺口

- 具体provider／GPU／平台兼容、取消回收和成本没有本轮运行验收。
  **影响**：不能承诺所有采集器可用或资源封顶。
  **进一步探讨**：先用已有artifact核解析和身份，再在许可的无副作用target核timeout/取消／保存重启，按本机计资源和时间。
- Agent调用端对证据的后续上传与组织数据留存未研究。
  **影响**：本地工具不保证整个模型链数据不出机。
  **进一步探讨**：接入前审MCP宿主和模型数据策略，选择脱敏材料并核canonical原件存储范围。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 比较能证明性能改善吗，怎样推导一个未验证方向？

**研究主题**：新假设与验证

#### 完整回答

Profile显示观察到的时间／内存分布，不证明因果、语义正确或端到端改善。作者investigations要求代表性任务、metric／estimand、兼容身份、保存样本、practical threshold与semantic oracle；实验wall_time_ns包含collector启动和开销，不等native每样本时延。样本不足只描述估计，within_threshold也不等效性证明。Inference比较代码确实对已知不同identity默认拒绝，显式allow_heterogeneous才标heterogeneous；缺轴标partial，不能把相同metric名或空身份默认为可比。

作者testing列出真实进程／native证据工作流，同时保留vendor hardware、权限、Windows、native client加载等证明缺口；测试说明不是本轮执行。根据Q02分页可重放不重跑和Q03保存原件成本，推导未实现假设：在任务结束前用“足以重现结论的最小证据集合”提示Agent选择preserve，而非默认保存全部或只保存analysis_id，可降低丢证和存储浪费。相对现有显式preserve增量是按结论依赖形成保留清单，不是自动生成性能结论。最小试验固定相同调优任务，比较现行手动保存和提示清单，在服务重启后由另一人重建结论，计成功率、漏失原件、存储量与核验时间；无法增加重现或总成本上升则否定，不能将此预期计当前贡献。

#### 证据与依据

**依据 1 · 作者声明**：[docs/investigations.md:18-32](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/docs/investigations.md#L18-L32)

作者对profile和确认性结论要求。

<details>
<summary>查看原文（15行）</summary>

```text
## Profiles and claims

Profiles rank where time or memory was observed. They do not prove causality,
semantic correctness, or an improvement. A confirmatory performance claim needs:

- a representative target and environment;
- a declared metric, unit, and estimand;
- compatible source and provider identities;
- preserved samples and effective requests;
- a practical threshold, not only statistical significance;
- an appropriate semantic oracle.

Coverage and limitations remain part of the evidence. Partial capture, provider
sampling, missing symbols, truncation, unsupported platform behavior, or absent
containment must not be silently promoted to complete evidence.
```

</details>

**依据 2 · 作者声明**：[docs/investigations.md:49-63](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/docs/investigations.md#L49-L63)

wall time、排除样本、描述估计和非等效证明。

<details>
<summary>查看原文（15行）</summary>

```text
it does not generate kernels, wrap compilers, or decide which optimization to implement.

The runtime accepts `wall_time_ns` and paired `median_difference` or
`mean_difference`. This metric is the complete invoked capture process's wall time, including
collector startup and overhead. Native per-sample benchmark measurements remain separate evidence.
Each non-baseline case is compared with the first declared case within the same blocks.
Failed or oracle-invalid pairs are excluded and
reported as limitations; fewer than three eligible pairs produce a descriptive
estimate without a confidence interval. `point_estimate_classification` describes only the
observed estimate against the practical margin, with `decision_basis=descriptive_point_estimate`
on the experiment metrics block. `within_threshold`
does not establish equivalence; a wide interval may still span material improvement and regression.
The deterministic percentile interval is reported separately and is not a calibrated equivalence
test. Semantic correctness still requires the declared oracle.

```

</details>

**依据 3 · 源码核查**：[src/flameox/providers/inference_comparison.py:46-72](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/providers/inference_comparison.py#L46-L72)

已知不同身份默认拒绝，缺轴partial。

<details>
<summary>查看原文（27行）</summary>

```text
def assess_comparison(
    analyses: Sequence[ProviderAnalysis], arguments: Mapping[str, Any]
) -> tuple[Compatibility, dict[str, list[Any | None]], list[str]]:
    observed = [comparison_identity(analysis) for analysis in analyses]
    fields = set().union(*(set(identity) | unavailable for identity, unavailable in observed))
    differences: dict[str, list[Any | None]] = {}
    unavailable_fields: set[str] = set()
    for field in sorted(fields):
        values = [identity.get(field) for identity, _unavailable in observed]
        present = [value for value in values if value is not None]
        if len(present) != len(values):
            unavailable_fields.add(field)
        if len({canonical_bytes(value) for value in present}) > 1:
            differences[field] = values

    allow_heterogeneous = arguments.get("allow_heterogeneous") is True
    if differences and not allow_heterogeneous:
        raise ProviderFailure(
            "INVALID_INPUT",
            "Inference inputs have incompatible observed identities; set "
            "allow_heterogeneous=true for an explicitly exploratory comparison",
            details={"differing_fields": sorted(differences)},
        )
    compatibility: Compatibility = (
        "heterogeneous" if differences else "partial" if unavailable_fields else "compatible"
    )
    return compatibility, differences, sorted(unavailable_fields)
```

</details>

**依据 4 · 作者声明**：[docs/testing.md:49-74](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/docs/testing.md#L49-L74)

作者维护工作流及native/vendor/资源测试缺口。

<details>
<summary>查看原文（26行）</summary>

```text
## Evidence and limits

The maintained workflows cover these boundaries:

| Surface | Evidence exercised | Limit of that proof |
| --- | --- | --- |
| CLI and MCP | Schemas, inline results, validation, continuation, preservation, rescue, restart, replay | Does not measure agents' tool-selection quality |
| Setup and update | Client formats and profile overrides, terminal consent, pinned launchers, environment forwarding, bounded failures, atomic writes | Installer shims do not prove live dependency resolution or native clients loading registrations |
| Native analysis and capture | Forked Node CPU/heap capture, failed exits and saved-input replay, Python profiles, inference and benchmark exports, pytest, coverage, streaming traces | Supplied artifacts do not establish every producer release or complete vendor capture lifecycle |
| Processes and storage | Cancellation, descendant cleanup, output and scratch bounds, FIFO substitution, corruption, source-kind changes, immutable publication | Sampled resource observations are not strict OS quotas |
| Comparisons | Native identities, exclusions, oracle outcomes, incompatible and partial coverage | Profiles alone do not establish causality or improvement |
| Scale | Publication and paginated queries across 1,000 real manifests after restart | Timings depend on corpus, workload, environment, semantic oracle, and metric |

Node replay uses a workload marker to prove it does not execute the target again. Fork coverage
checks separate parent/child artifacts and hotspots after successful and nonzero exits, plus
preservation of a completed child profile when the parent times out. This does not establish
profile flushing on forced termination or profiling arbitrary descendants. PyTorch trace replay
needs PyTorch and a local Perfetto reader. Simulated vendor-exporter failures establish
cleanup and retry behavior, not installed xctrace or Nsight compatibility. Setup/update workflows
do not establish project or administrator policy precedence, Windows behavior, or private-index
resolution. Real uvx preparation and native-client loading require separate matching host checks.

Other proof gaps include resource-baseline races and unavailable metrics, cancellation during
process startup, V8 traversal-ceiling overflow, perf demangled/unknown frames, and a managed
dependency reconnect branch. Vendor hardware, permissions, and other platforms require matching
host workflows. A skipped provider test is not provider verification.
```

</details>

**依据 5 · 源码核查**：[src/flameox/runtime.py:1857-1895](https://github.com/morluto/flameox/blob/c7ea167bf51bf10da9bc17a9ffc1124f4166f32f/src/flameox/runtime.py#L1857-L1895)

会话过期与保存机制作为保留清单假设来源。

<details>
<summary>查看原文（39行）</summary>

```text
    def preserve_evidence(self, analysis_id: str) -> dict[str, Any]:
        cached = self.analyses.get(analysis_id)
        if cached is None:
            raise RuntimeFailure(
                "EXPIRED_SESSION_ANALYSIS",
                "The session analysis is missing or expired",
                remediation=_EXPIRED_ANALYSIS_REMEDIATION,
            )
        if cached.preserved is not None:
            try:
                self.repository.read(str(cached.preserved["evidence_id"]))
            except RepositoryError as exc:
                if exc.code != "MISSING_EVIDENCE":
                    raise self._repository_failure(exc) from exc
                cached.preserved = None
            except OSError as exc:
                raise RuntimeFailure(
                    "REPOSITORY_IO_FAILURE", "Preserved evidence could not be validated."
                ) from exc
            else:
                self.analyses.move_to_end(analysis_id)
                return dict(cached.preserved)
        if cached.preserved is None:
            try:
                cached.preserved = self.repository.preserve(
                    manifest_body=cached.manifest_body,
                    sources=cached.sources,
                    analysis_source_indices=cached.analysis_source_indices,
                    analysis=self._durable_analysis(cached.result),
                )
                self._release_analysis_scratch(cached)
            except RepositoryError as exc:
                raise self._repository_failure(exc) from exc
            except OSError as exc:
                raise RuntimeFailure(
                    "REPOSITORY_IO_FAILURE", "Evidence could not be preserved."
                ) from exc
        self.analyses.move_to_end(analysis_id)
        return dict(cached.preserved)
```

</details>

#### 缺口

- 最小证据清单是否改善重现／减少占用未试验。
  **影响**：仅未来方向，不计当前效果。
  **进一步探讨**：重启后盲重建实验，重现不增或总体投入升就否定。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
