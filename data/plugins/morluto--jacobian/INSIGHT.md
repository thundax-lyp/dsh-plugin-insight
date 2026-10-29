# Jacobian

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[9dc2aaf](https://github.com/morluto/jacobian/tree/9dc2aaf6efe8803f1c501e2972f741dd94962c32)

<!-- BEGIN META -->
[![GitHub ★ 336](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=336&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/jacobian)
<!-- END META -->

> **功能**：通过 MCP、Python 与 CLI 提供可搜索、类型化且限定适用范围的数学原子操作，由 Agent 选择与组合。

> **亮点**：可搜数学操作、规范大数输入、结构结果与领域/资源错误形成复用接口，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：严格schema/精确后端与整体定理证明不同；代表worker资源策略不能外推全栈，原生平台与remote隔离需另验，见 [Q02](#research-q02)。

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
  - [Q01 · Jacobian是否自动解数学问题，Agent如何获得实际操作？](#detail-section-11)
  - [Q02 · 严格输入、精确结果与资源隔离分别保证什么？](#detail-section-12)
  - [Q03 · 哪些用户能有限试用，怎样验证数学工具价值？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Agent/数学研究者需要精确小步骤、清楚输入域和结构结果，由模型组合而不是黑箱自动证明，见 [Q01](#research-q01)。

模型+直接CAS/小脚本，人工管输入域/结果。Jacobian统一可发现契约与受界操作，不替代数学推理/证明。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 发现 | 搜/查数学契约 | 已安装目录非自动选对 |
| 执行 | 后端bounded数学操作 | 输入域/后端/资源限 |
| 结构结果 | 类型输出与运行时间 | 不独立认证整体证明 |
| Worker | 部分计数取消/资源预算 | 非全域OS隔离保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python>=3.12<3.14及原生后端栈 | 必需 | 数学计算 | 平台/wheel兼容先核 |
| MCP宿主/stdio配置 | Agent使用必需 | 工具发现/调用 | Python/CLI可作另一接口 |
| 特定Singular/QEPCAD | 部分操作必需 | 系统后端 | 不自动供给，不能假有 |
| 模型选域/人工独立核证 | 推理必需 | 组合结果 | 工具成功不等整体证明 |
| 授权/进程预算 | 视部署 | remote/资源边界 | 本轮未全审隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 环境 | 用户隔离兼容Python/后端 | 核已安装operation/可用性 |
| 发现 | Agent math.find查语义/schema | 不硬猜工具/域 |
| 计算 | math.run严格请求 | 分错误/timeout/有界结果 |
| 核证 | 人工/独立方法查恒等与前提 | 不以局部输出替证明 |
| 退出 | 停服务/撤MCP | 依赖与配置分开保管 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 原生栈/环境资源未知 | 平台/注册/样例核证 | 作者已测Linux非本机保证 |
| 持续使用 | 模型token/CPU内存未知 | 选域/组合/结果复核 | 无新任务净节省证据 |
| 失败恢复 | worker/超时重试未知 | 判输入/域/后端故障 | 不将unknown当false |
| 退出 | venv/系统后端留存未知 | 撤配置/停本服务 | 不动无关后端 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 输入 | 类型/大数/契约 | 模型选域正确 |
| 计算 | 代表后端结果与worker | 全域正确/规模实际限 |
| 推理 | 可组合操作接口 | 证明/新题质量与节时 |

> **思考**：严格schema/精确后端与整体定理证明不同；代表worker资源策略不能外推全栈，原生平台与remote隔离需另验，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：可搜数学操作、规范大数输入、结构结果与领域/资源错误形成复用接口，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

[Q02](#research-q02) strict JSON与领域owned schema、受检worker可复用；返回typed result不是独立证明器，平台和语义证据必须分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

严格schema/精确后端与整体定理证明不同；代表worker资源策略不能外推全栈，原生平台与remote隔离需另验，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

兼容环境本地stdio先核少量精确算术，复杂域与remote另验；直接CAS仍为对照，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定MCP/dispatch与代表算术/计数源码已核；建议兼容环境少量精确操作有限试用，无数学或Host运行验收。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、src/jacobian/dispatch.py、src/jacobian/math/combinatorics/_counting_process.py、src/jacobian/math/number_theory/_divisibility_models.py、src/jacobian/math/number_theory/_integer_input.py、src/jacobian/math/number_theory/arithmetic/operations.py、src/jacobian/mcp/protocol.py、src/jacobian/mcp/runtime.py、src/jacobian/mcp/tools.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：四材料身份/固定revision一致，catalog无旧研究。核pyproject、MCP protocol/run/runtime、dispatch、整数输入/gcdex和组合计数worker；数学域巨大未穷尽，未全审remote、全部native后端/操作/benchmark，未执行目标。
- 下一步：未安装/运行数学或MCP；作者平台/精确声明只归作者。后续小Bézout独立恒等/整除、域边界/取消/缺后端和新任务A/B，未知不得写成通过。

**分析版本**

- **仓库**：[morluto/jacobian](https://github.com/morluto/jacobian)
- **版本号**：0.23.0（Python 包，pyproject.toml:7）（[固定提交 9dc2aaf](https://github.com/morluto/jacobian/tree/9dc2aaf6efe8803f1c501e2972f741dd94962c32)）
- **版本日期**：2026-10-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

任务前提到操作/结果/独立核证的证明义务账本，测域误用/未证跳步和纠错成本，未实现，见 [Q03](#research-q03)。

未安装/运行数学或MCP；作者平台/精确声明只归作者。后续小Bézout独立恒等/整除、域边界/取消/缺后端和新任务A/B，未知不得写成通过。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 831 | 33153 | — | — | 274358 |
| .cjs | source | 2 | 725 | 637 | 30 | — |
| .mjs | test | 1 | 482 | 439 | 7 | — |
| .md | example | 1 | 20 | — | — | 97 |

</details>

**活跃度**

[![Issue 未关闭 97](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=97&color=737b86&logo=github)](https://github.com/morluto/jacobian/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 64](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=64&color=737b86&logo=github)](https://github.com/morluto/jacobian/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 73](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=73&color=737b86&logo=github)](https://github.com/morluto/jacobian/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：数学原子工具的发现/执行/边界是否帮助Agent形成可核推理，而非把局部计算冒充整体证明？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Jacobian是否自动解数学问题，Agent如何获得实际操作？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

固定Python包jacobian0.23.0提供Python API/CLI/stdio与remote MCP，是外接数学工具服务，不是DSH原生Host插件。面向需要组合可检查数学步骤的Agent/研究者：MCP固定核心math.find搜/检查安装目录，math.run选择operation_id/payload，另有operation://catalog全量资源；无需一次把所有schema塞给模型。公开操作严格输入、领域语义和规模，模型负责选步骤/组合/停止，不自动给任意问题完整证明。

真实math.run授权回调后走dispatch，从catalog绑定中取request_type严格JSON校验、调用binding.run并投影JSON结果与runtime_ms。比如integer extended-gcd输入规范大整数，实际调SymPy gcdex并返回gcd与两系数。相对模型心算/随手写CAS代码，它减少参数/语义和接口错误，继承后端计算而非发明数学算法；发现命中和操作成功不等整体解题正确。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-11](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/pyproject.toml#L5-L11)

Python包身份/版本。

```text
[project]
name = "jacobian"
version = "0.23.0"
description = "Atomic mathematical tools for agents over MCP and Python"
readme = "README.md"
requires-python = ">=3.12,<3.14"
license = { text = "MIT" }
```

**依据 2 · 源码核查**：[pyproject.toml:18-38](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/pyproject.toml#L18-L38)

后端依赖与真实CLI/MCP出口。

<details>
<summary>查看原文（21行）</summary>

```text
dependencies = [
    "anyio>=4.5,<5",
    "CyPari>=2.5,<3",
    "mcp==2.2.0",
    "networkx==3.6.1",
    "pplpy==0.9.0",
    "pydantic>=2.12,<3",
    "pydantic-core>=2.0,<3",
    "python-flint==0.9.0",
    "rfc8785==0.1.4",
    "scipy==1.16.1",
    "sympy==1.14.0",
    "typer>=0.20,<1",
    "typing-extensions>=4.14.1",
    "z3-solver==5.1.0.0",
]

[project.scripts]
jacobian = "jacobian.cli:app"
jacobian-mcp = "jacobian.mcp.stdio_cli:main"
jacobian-remote-mcp = "jacobian.mcp.remote_cli:main"
```

</details>

**依据 3 · 源码核查**：[src/jacobian/mcp/protocol.py:21-60](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/mcp/protocol.py#L21-L60)

真实核心tool与全目录资源。

<details>
<summary>查看原文（40行）</summary>

```text
    server.add_tool(
        math_find,
        name="math.find",
        title="Search installed Jacobian math tools",
        description=MATH_FIND_DESCRIPTION,
        annotations=ToolAnnotations(
            read_only_hint=True,
            destructive_hint=False,
            idempotent_hint=True,
            open_world_hint=False,
        ),
        structured_output=True,
    )
    server.add_tool(
        math_run,
        name="math.run",
        title="Run one installed Jacobian math tool",
        description=MATH_RUN_DESCRIPTION,
        annotations=ToolAnnotations(
            read_only_hint=True,
            destructive_hint=False,
            idempotent_hint=False,
            open_world_hint=False,
        ),
        structured_output=True,
    )

    def operation_catalog() -> OperationCatalogSnapshot:
        return state.operation_catalog.snapshot()

    server.add_resource(
        FunctionResource.from_function(
            operation_catalog,
            uri="operation://catalog",
            name="operation-catalog",
            description=(
                "Large exact bulk export of every installed operation, schema, and "
                "example. Use math.find for ordinary operation discovery and "
                "inspection. If matching fails, refine or paginate math.find; read "
                "this resource only when the task requires the complete inventory."
```

</details>

**依据 4 · 源码核查**：[src/jacobian/mcp/tools.py:260-286](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/mcp/tools.py#L260-L286)

math.run授权/dispatch接线。

<details>
<summary>查看原文（27行）</summary>

```text
async def math_run(
    operation_id: OperationId,
    payload: dict[str, Any],
    *,
    ctx: Context[AppState, Any],
) -> OperationResult:
    """Run one math tool. Role comes from the tool ID."""
    _authorize(ctx)
    catalog = _catalog(ctx)
    cancellation = _request_cancellation(ctx)
    with _operation_error_boundary(operation_id):
        try:
            return await run_with_mcp_progress(
                lambda progress_sink: execute_operation(
                    operation_id,
                    payload,
                    catalog,
                    projector=lambda selected_id, result, started: OperationResult(
                        operation_id=selected_id,
                        runtime_ms=max(0, round((time.monotonic() - started) * 1000)),
                        output=result.model_dump(mode="json"),
                    ),
                    cancellation_signal=cancellation,
                    progress_sink=progress_sink,
                ),
                ctx,
            )
```

</details>

**依据 5 · 源码核查**：[src/jacobian/dispatch.py:134-153](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/dispatch.py#L134-L153)

绑定、严格输入、执行/投影。

<details>
<summary>查看原文（20行）</summary>

```text
        request_checkpoint("before parsing")
        binding = catalog._binding(operation_id)
        if binding is None:
            raise _OperationResolutionError(f"unknown operation: {operation_id}")
        try:
            with request_stage(OperationExecutionStage.REQUEST_PARSING):
                request = parse_operation_input(binding.request_type, payload)
        except (CanonicalizationError, ValidationError) as exc:
            raise OperationRequestValidationError(exc) from exc
        request_checkpoint(
            "after parsing", public_stage=OperationExecutionStage.REQUEST_PARSING
        )
        result = binding.run(request)
        request_checkpoint("after operation execution")
        with request_stage(OperationExecutionStage.RESULT_PROJECTION):
            projected = projector(operation_id, result, started)
        request_checkpoint(
            "after result projection",
            public_stage=OperationExecutionStage.RESULT_PROJECTION,
        )
```

</details>

**依据 6 · 源码核查**：[src/jacobian/math/number_theory/arithmetic/operations.py:292-307](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/math/number_theory/arithmetic/operations.py#L292-L307)

代表性精确后端调用与系数输出。

<details>
<summary>查看原文（16行）</summary>

```text
def extended_gcd(
    left: SupportsIndex | IntegerValue,
    right: SupportsIndex | IntegerValue,
) -> ExtendedGcdResult:
    """Return a gcd and exact Bezout coefficients for two integers."""

    from sympy import gcdex

    left_value = _as_python_integer(left)
    right_value = _as_python_integer(right)
    x, y, divisor = gcdex(left_value, right_value)
    return ExtendedGcdResult(
        gcd=int(divisor),
        left_coefficient=int(x),
        right_coefficient=int(y),
    )
```

</details>

**依据 7 · 作者声明**：[README.md:26-34](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/README.md#L26-L34)

作者假设与模型负责组合。

```text
**Jacobian's hypothesis is that mathematical reasoning benefits from an
executable vocabulary of semantically scoped, bounded operations.** Rather than
exposing large domain solvers or precomposed workflows, Jacobian exposes
mathematical primitives that agents can search for and compose into solutions
beyond what any individual operation was designed to solve. The library
supplies trustworthy mathematical moves; the reasoning model decides which
moves to make, how to combine their results, and when to stop. Keeping the
operations semantically narrow and domain-owned preserves that search space
instead of baking one proof strategy or workflow into the tools themselves.
```

#### 缺口

- 未独立核宿主工具发现/实际运行与复杂任务完成。
  **影响**：未独立运行发现/计算，不能将操作可搜与源码后端调用当本机可用或复杂推理完成。
  **进一步探讨**：独立stdio注册后以小整数Bézout例核schema/响应/独立算术，再试多个操作的推理链。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 严格输入、精确结果与资源隔离分别保证什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

dispatch把payload严格JSON往返再model_validate_json(strict=True)，不容Python特有值绕过公共输入；代表IntegerPair约定最多256位规范十进制字符串或安全JSON整数，避免大数经JS失真。数学正确性仍取决输入语义、绑定实现与后端：extended-gcd直接把gcdex结果封类型返回，投影器只dump和记时，没有为每个返回值独立重算证明，不能从严格schema推到任意定理已证。有限范围数值/反例也不能直接升级全称命题。

资源方面要逐操作看：精确组合计数路径用临时cwd和受检worker，传deadline、stdout/stderr限、CPU/地址空间/文件大小限，并传取消与超时错误；这是实际工程约束，不应外推所有backend都同进程杀限或是完整OS安全沙箱。原生后端/可选系统运行时和平台资源限制仍需真实验收。MCP授权回调由宿主注入，读tool annotations只是协议提示；本轮没全审remote租户/网络部署，不据此宣称多租户隔离或允许匿名公网暴露。

#### 证据与依据

**依据 1 · 源码核查**：[src/jacobian/dispatch.py:68-77](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/dispatch.py#L68-L77)

严格JSON+模型输入。

<details>
<summary>查看原文（10行）</summary>

```text
def parse_operation_input[ModelT: BaseModel](
    model: type[ModelT], payload: dict[str, Any]
) -> ModelT:
    """Parse one bounded request once into its owning strict model."""

    # Round-trip through strict JSON so Python-only values cannot bypass the
    # public JSON contract. Dispatch is shared by native, stdio, and HTTP
    # callers, so concrete transport byte ceilings belong in their adapters.
    encoded = encode_strict_json(payload)
    return model.model_validate_json(encoded, strict=True)
```

</details>

**依据 2 · 源码核查**：[src/jacobian/math/number_theory/_divisibility_models.py:12-26](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/math/number_theory/_divisibility_models.py#L12-L26)

代表整数输入界限。

<details>
<summary>查看原文（15行）</summary>

```text
class IntegerPairRequest(StrictModel):
    """Two canonical integers supplied to a symmetric binary operation."""

    left: IntegerInput = Field(
        description=(
            "Exact integer with at most 256 decimal digits, as a canonical decimal "
            "string or a safe JSON integer (absolute value at most 9007199254740991)."
        )
    )
    right: IntegerInput = Field(
        description=(
            "Exact integer with at most 256 decimal digits, as a canonical decimal "
            "string or a safe JSON integer (absolute value at most 9007199254740991)."
        )
    )
```

</details>

**依据 3 · 源码核查**：[src/jacobian/math/number_theory/_integer_input.py:64-84](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/math/number_theory/_integer_input.py#L64-L84)

安全JSON整数和规范字符串。

<details>
<summary>查看原文（21行）</summary>

```text
        exact = core_schema.chain_schema([canonical, bounded])
        safe_limit = min(MAX_SAFE_INTEGER, 10**self.max_digits - 1)
        numeric = core_schema.int_schema(
            strict=True,
            ge=max(
                -safe_limit, self.minimum if self.minimum is not None else -safe_limit
            ),
            le=min(
                safe_limit, self.maximum if self.maximum is not None else safe_limit
            ),
        )
        return core_schema.json_or_python_schema(
            json_schema=core_schema.union_schema(
                [exact, numeric],
                custom_error_type="number_theory.integer_input",
                custom_error_message=(
                    "integer must be a canonical decimal string with at most "
                    f"{self.max_digits} digits, or a JSON integer with absolute value "
                    f"at most {safe_limit}; decoded value must be in "
                    f"[{self.minimum if self.minimum is not None else '-infinity'}, "
                    f"{self.maximum if self.maximum is not None else 'infinity'}]"
```

</details>

**依据 4 · 源码核查**：[src/jacobian/math/number_theory/arithmetic/operations.py:292-307](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/math/number_theory/arithmetic/operations.py#L292-L307)

结果依后端不另核证。

<details>
<summary>查看原文（16行）</summary>

```text
def extended_gcd(
    left: SupportsIndex | IntegerValue,
    right: SupportsIndex | IntegerValue,
) -> ExtendedGcdResult:
    """Return a gcd and exact Bezout coefficients for two integers."""

    from sympy import gcdex

    left_value = _as_python_integer(left)
    right_value = _as_python_integer(right)
    x, y, divisor = gcdex(left_value, right_value)
    return ExtendedGcdResult(
        gcd=int(divisor),
        left_coefficient=int(x),
        right_coefficient=int(y),
    )
```

</details>

**依据 5 · 源码核查**：[src/jacobian/dispatch.py:157-167](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/dispatch.py#L157-L167)

结果投影非全局证明检查。

<details>
<summary>查看原文（11行）</summary>

```text
def _operation_result_projector(
    operation_id: OperationId,
    result: StrictModel,
    started: float,
) -> OperationResult:
    output = result.model_dump(mode="json")
    return OperationResult(
        operation_id=operation_id,
        runtime_ms=max(0, round((time.monotonic() - started) * 1000)),
        output=output,
    )
```

</details>

**依据 6 · 源码核查**：[src/jacobian/math/combinatorics/_counting_process.py:55-90](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/math/combinatorics/_counting_process.py#L55-L90)

特定worker路径的deadline/限流/限资源。

<details>
<summary>查看原文（36行）</summary>

```text
    execution = current_request_execution()
    started = execution.started_at if execution is not None else time.monotonic()
    deadline = (
        execution.deadline
        if execution is not None and execution.deadline is not None
        else started + _COUNTING_WALL_SECONDS
    )
    bind_request_deadline(deadline)
    request_checkpoint("before exact counting")
    remaining = deadline - time.monotonic()
    if remaining <= 0:
        raise OperationExecutionTimeoutError(
            "request deadline expired before exact counting"
        )

    try:
        with TemporaryDirectory(prefix="jacobian-counting-") as worker_directory:
            result = run_checked_worker_process(
                [sys.executable, str(_COUNTING_WORKER)],
                input_bytes=json.dumps(
                    {"op": operation, "n": n, "k": k},
                    separators=(",", ":"),
                ).encode("utf-8"),
                timeout_seconds=remaining,
                environment=worker_environment(locale="C.UTF-8"),
                stdout_limit=_counting_stdout_limit(n, k),
                stderr_limit=_COUNTING_STDERR_LIMIT,
                resource_limits=ProcessResourceLimits(
                    cpu_seconds=max(1, math.ceil(_COUNTING_WALL_SECONDS)),
                    address_space_bytes=_COUNTING_ADDRESS_SPACE_BYTES,
                    file_size_bytes=_COUNTING_FILE_SIZE_BYTES,
                ),
                cwd=worker_directory,
                decode_result=_decode_count_result,
            )
    except (OperationExecutionCancelledError, OperationExecutionTimeoutError):
```

</details>

**依据 7 · 源码核查**：[src/jacobian/mcp/runtime.py:42-47](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/mcp/runtime.py#L42-L47)

授权由回调提供。

```text
def _authorize(ctx: Context[Any, Any]) -> None:
    """Run request-scoped authorization if the host provided one."""

    callback = _state(ctx).authorize
    if callback is not None:
        callback()
```

#### 缺口

- 全部数学域正确/规模、所有worker平台约束和remote租户隔离未核。
  **影响**：未穷尽领域/worker/remote边界，不能以严格类型或代表算术正确性推全域数学正确/进程与租户隔离。
  **进一步探讨**：按所需operation独立数学恒等式/边界/错误/超时验证，后端不可用/取消及平台资源隔离另验；远程部署单列授权审查。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些用户能有限试用，怎样验证数学工具价值？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议需要可核精确算术的Agent使用者先本地stdio有限试用一两个操作，不以工具总量、发布测试绿或作者exact声明替代独立数学验证。Python要求>=3.12<3.14，强制SymPy/FLINT/Z3/CyPari/pplpy/SciPy等原生栈不是轻量纯Python；作者声明已测二进制契约是glibc Linux x86-64 CPython3.12/3.13，不能据本机macOS源码可读就认定可安装。Singular/QEPCAD仅少数操作所需且不自动供给。

首次成本为兼容环境、原生包/可能系统库、MCP注册与schema/样例核对；持续为发现/多步调用模型token和后端计算/内存；失败需要分辨输入/领域/依赖不可用/超时，不能把unknown当false或无限增规模；退出停服务、撤MCP配置、虚拟环境/缓存分别保管。具体金额、耗时和净节省未知。简单算术直接CAS/小脚本是低配置对照。

生产方向是把任务前提→操作契约→结果→独立校验/适用范围串成可审阅证明义务账本，遇有界/近似/超时就保留范围，避免Agent将局部输出写成全称结论。以新题对比模型+CAS、当前MCP、账本版的选错操作、域误用、未证跳步、人工纠正和token；无收益或契约解释负担更高则停止。当前typed结果/目录是基础，账本未实现。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:10-32](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/pyproject.toml#L10-L32)

Python版本和强制原生依赖。

<details>
<summary>查看原文（23行）</summary>

```text
requires-python = ">=3.12,<3.14"
license = { text = "MIT" }
authors = [{ name = "Jacobian contributors" }]
classifiers = [
    "Programming Language :: Python :: 3.12",
    "Programming Language :: Python :: 3.13",
    "Programming Language :: Python :: Implementation :: CPython",
]
dependencies = [
    "anyio>=4.5,<5",
    "CyPari>=2.5,<3",
    "mcp==2.2.0",
    "networkx==3.6.1",
    "pplpy==0.9.0",
    "pydantic>=2.12,<3",
    "pydantic-core>=2.0,<3",
    "python-flint==0.9.0",
    "rfc8785==0.1.4",
    "scipy==1.16.1",
    "sympy==1.14.0",
    "typer>=0.20,<1",
    "typing-extensions>=4.14.1",
    "z3-solver==5.1.0.0",
```

</details>

**依据 2 · 作者声明**：[README.md:77-91](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/README.md#L77-L91)

作者已测平台与可选运行时范围。

<details>
<summary>查看原文（15行）</summary>

```text
That package includes Jacobian's exact maintained Python backend stack: SymPy,
NetworkX, Z3, and Python-FLINT. A normal Python or npm installation
therefore exposes the same built-in Python-backed operation portfolio. The
tested binary-install contract is CPython 3.12 or 3.13 on glibc Linux x86-64;
the release gate installs the built wheel and starts Jacobian on both Python
versions. Other systems may have compatible upstream wheels, but are not part
of the tested release contract yet. In particular, Alpine/musl cannot install
the complete mandatory stack from PyPI.

Singular and QEPCAD are optional system runtimes for a small subset of operations.
The Python installation does not provision them, and ordinary operations do not
require Docker. Python callers can use `jacobian.backends.check_backend`; MCP
inspection reports availability in the server environment. See
[backend requirements](docs/how-to/backend-requirements.md) for exact coverage
and setup.
```

</details>

**依据 3 · 作者声明**：[README.md:135-139](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/README.md#L135-L139)

pre-stable契约。

```text
## Status

Jacobian 0.23.0 <!-- x-release-please-version --> is pre-stable. Its published package and operation contracts
describe the supported surface; experimental operation contracts may change
between releases.
```

**依据 4 · 源码核查**：[src/jacobian/math/number_theory/arithmetic/operations.py:292-307](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/math/number_theory/arithmetic/operations.py#L292-L307)

独立可核的Bézout小例。

<details>
<summary>查看原文（16行）</summary>

```text
def extended_gcd(
    left: SupportsIndex | IntegerValue,
    right: SupportsIndex | IntegerValue,
) -> ExtendedGcdResult:
    """Return a gcd and exact Bezout coefficients for two integers."""

    from sympy import gcdex

    left_value = _as_python_integer(left)
    right_value = _as_python_integer(right)
    x, y, divisor = gcdex(left_value, right_value)
    return ExtendedGcdResult(
        gcd=int(divisor),
        left_coefficient=int(x),
        right_coefficient=int(y),
    )
```

</details>

**依据 5 · 源码核查**：[src/jacobian/math/combinatorics/_counting_process.py:55-90](https://github.com/morluto/jacobian/blob/9dc2aaf6efe8803f1c501e2972f741dd94962c32/src/jacobian/math/combinatorics/_counting_process.py#L55-L90)

计算与超时资源边界。

<details>
<summary>查看原文（36行）</summary>

```text
    execution = current_request_execution()
    started = execution.started_at if execution is not None else time.monotonic()
    deadline = (
        execution.deadline
        if execution is not None and execution.deadline is not None
        else started + _COUNTING_WALL_SECONDS
    )
    bind_request_deadline(deadline)
    request_checkpoint("before exact counting")
    remaining = deadline - time.monotonic()
    if remaining <= 0:
        raise OperationExecutionTimeoutError(
            "request deadline expired before exact counting"
        )

    try:
        with TemporaryDirectory(prefix="jacobian-counting-") as worker_directory:
            result = run_checked_worker_process(
                [sys.executable, str(_COUNTING_WORKER)],
                input_bytes=json.dumps(
                    {"op": operation, "n": n, "k": k},
                    separators=(",", ":"),
                ).encode("utf-8"),
                timeout_seconds=remaining,
                environment=worker_environment(locale="C.UTF-8"),
                stdout_limit=_counting_stdout_limit(n, k),
                stderr_limit=_COUNTING_STDERR_LIMIT,
                resource_limits=ProcessResourceLimits(
                    cpu_seconds=max(1, math.ceil(_COUNTING_WALL_SECONDS)),
                    address_space_bytes=_COUNTING_ADDRESS_SPACE_BYTES,
                    file_size_bytes=_COUNTING_FILE_SIZE_BYTES,
                ),
                cwd=worker_directory,
                decode_result=_decode_count_result,
            )
    except (OperationExecutionCancelledError, OperationExecutionTimeoutError):
```

</details>

#### 缺口

- 没有本轮安装/数学运行或新任务A/B，需求与节省未证。
  **影响**：无本机栈/新题A/B，无法判定安装与选域核证成本是否低于直接CAS，或是否减少未证跳步。
  **进一步探讨**：兼容Linux隔离环境先小例核a*x+b*y=g、g整除两输入及符号，检查错误/取消，再测新题多步语义与人工成本。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
