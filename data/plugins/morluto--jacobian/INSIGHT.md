# Jacobian

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[ea52eb5](https://github.com/morluto/jacobian/tree/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89)

<!-- BEGIN META -->
[![GitHub ★ 353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/morluto/jacobian)
<!-- END META -->

> **功能**：为 Agent 提供可搜索的数学操作、执行结果和类型化接口。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把后端操作组织为可检索且声明类型的接口，不将后端算法归为项目原创。

> **主要限制**：[Q02](#research-q02) 类型与错误分类不能证明操作选择或数学结果正确。

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
  - [Q01 · 数学工具词汇为 Agent 增加什么，与直接调用数学库有什么区别？](#detail-section-11)
  - [Q02 · 检索、检查和执行如何连接，错误如何表达？](#detail-section-12)
  - [Q03 · 运行条件和失败时的退路是什么？](#detail-section-13)
  - [Q04 · 如何检验操作选择与结果可信度改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：让 Agent 在数学任务中查找并调用受约束操作的开发者。

直接使用数学后端或人工实现也能计算；项目提供发现、契约与统一协议。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| math.find | 搜索或检查操作 | 输入模式互斥，检索不证明适用 |
| math.run | 调用已注册操作 | 参数、后端及授权须满足 |
| CLI/Python | 脱离 MCP 调用 | 本轮未运行或验证安装 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python 3.12–3.13 及包依赖 | Python 服务必需 | 加载目录与后端 | 安装或启动可能失败 |
| MCP 宿主 | Agent 集成必需 | 发现并调用工具 | 无 MCP 交互 |
| Singular/QEPCAD | 特定操作需要 | 对应计算 | 应检查可用性 |
| 独立数学复核 | 可信结果需要 | 核假设与结论 | 类型正确不等结果正确 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核 Python 和后端 | 不满足则停止 |
| 查找 | 输入需求或精确 ID | 核操作合同 |
| 执行 | 传有效参数并接收结果 | 超时或失败不当证明 |
| 验证 | 对照独立参考 | 不一致时回到人工方法 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Python 及后端资源未知 | 安装与兼容核查 | 平台未实测 |
| 持续 | 计算、模型调用费用未知 | 选择操作和核结果 | 时延与准确率未知 |
| 恢复 | 重试及资源成本未知 | 排查后端或手工复核 | 中断行为随操作而异 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 查找操作 | find 注册与参数约束 | 检索适用性 |
| 类型化执行 | dispatch 与绑定检查 | 数学算法正确性 |
| 明确错误 | 超时与取消映射 | 所有后端真实中断能力 |

> **思考**：[Q02](#research-q02) 类型与错误分类不能证明操作选择或数学结果正确。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把后端操作组织为可检索且声明类型的接口，不将后端算法归为项目原创。

[Q02](#research-q02) 将发现、类型见证和执行封装分开；静态契约不能替代算法或宿主验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 类型与错误分类不能证明操作选择或数学结果正确。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先检查后端和操作合同，以已知题及独立方法对照；结果不完整或不一致则停止依赖。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

只核 MCP 接口、绑定和执行代表路径；未运行 Python、后端或目标宿主。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、src/jacobian/mcp/protocol.py、src/jacobian/mcp/tools.py、src/jacobian/dispatch.py、src/jacobian/catalog/catalog.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、pyproject、MCP 注册与工具、目录绑定和 dispatch；未穷尽具体数学操作、安装链、远程鉴权或后端中断。
- 下一步：隔离环境对照固定题集的具体操作、类型、缺后端、超时及结果。

**分析版本**

- **仓库**：[morluto/jacobian](https://github.com/morluto/jacobian)
- **版本号**：未声明（[固定提交 ea52eb5](https://github.com/morluto/jacobian/tree/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设执行前显式记录前提并独立核结果可降低误用，尚未对照。

隔离环境对照固定题集的具体操作、类型、缺后端、超时及结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 831 | 33153 | — | — | 274358 |
| .cjs | source | 2 | 816 | 725 | 30 | — |
| .mjs | test | 1 | 820 | 744 | 8 | — |
| .md | example | 1 | 20 | — | — | 97 |

</details>

**活跃度**

[![Issue 未关闭 88](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=88&color=737b86&logo=github)](https://github.com/morluto/jacobian/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查数学操作检索、执行契约与正确性边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 数学工具词汇为 Agent 增加什么，与直接调用数学库有什么区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Jacobian 是面向 Agent 的数学 MCP 服务，提供操作检索、单项执行和类型化结果；同一工程也提供 CLI/Python 接口。SymPy 等库可直接实现计算，但调用者需自己选择函数、解析输入和解释边界；本项目增加可发现、按操作声明的协议和结果封装，具体计算仍依赖后端，不能把后端算法归成新原创。检索命中和类型正确不证明模型选择的操作适用于问题，也没有同任务对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-34](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/README.md#L17-L34)

作者描述词汇和组合假设。

<details>
<summary>查看原文（18行）</summary>

```text
Jacobian is an MCP server that gives AI agents a searchable vocabulary of typed
mathematical operations. `math.find` matches a mathematical need or inspects one
exact contract, and `math.run` executes it and returns its typed result. The same
mathematical library is also available through a CLI and native Python API.

Each operation establishes one stable, reusable mathematical postcondition
rather than prescribing a workflow or proof strategy. Results are exact where
claimed and make approximation, incompleteness, or uncertainty explicit.

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

</details>

**依据 2 · 源码核查**：[src/jacobian/mcp/protocol.py:15-45](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/src/jacobian/mcp/protocol.py#L15-L45)

注册两项固定 MCP 工具。

<details>
<summary>查看原文（31行）</summary>

```text
def register_core_projection(
    server: MCPServer[AppState],
    state: AppState,
) -> None:
    """Register Jacobian's fixed tools and static resources directly with the SDK."""

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
```

</details>

**依据 3 · 源码核查**：[src/jacobian/catalog/catalog.py:38-53](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/src/jacobian/catalog/catalog.py#L38-L53)

运行时请求/结果类型检查。

<details>
<summary>查看原文（16行）</summary>

```text
def _bind_operation[RequestT: StrictModel, ResultT: StrictModel](
    operation: MathTool[RequestT, ResultT],
) -> _BoundMathTool:
    """Erase one typed declaration only after retaining its runtime witnesses."""

    def run(request: StrictModel) -> StrictModel:
        if not isinstance(request, operation.request_type):
            raise TypeError(
                f"{operation.operation_id} received a request outside its declared type"
            )
        result = operation.run(request)
        if type(result) is not operation.result_type:
            raise TypeError(
                f"{operation.operation_id} returned a result outside its declared type"
            )
        return result
```

</details>

#### 缺口

- 未验证数学正确性与模型选择效果
  **影响**：不能推断整体证明或解题正确
  **进一步探讨**：固定题集比较直接库调用、工具组合和独立校验。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 检索、检查和执行如何连接，错误如何表达？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

protocol.py 注册 math.find 和 math.run。find 要求 query 或 operation_id 恰有一个，按 ID 检查会返回契约及后端可用性；run 先授权，再将 operation_id 和 payload 送执行器。执行器解析输入、查目录绑定、调用操作并投影结果，绑定在调用前后检查声明类型；超时和取消在 MCP 错误边界转换为明确错误。以上是部分源码接线，类型与错误边界不证明某个数学算法正确，也不能推出所有后端具有相同中断能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/jacobian/mcp/protocol.py:15-45](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/src/jacobian/mcp/protocol.py#L15-L45)

固定工具注册。

<details>
<summary>查看原文（31行）</summary>

```text
def register_core_projection(
    server: MCPServer[AppState],
    state: AppState,
) -> None:
    """Register Jacobian's fixed tools and static resources directly with the SDK."""

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
```

</details>

**依据 2 · 源码核查**：[src/jacobian/mcp/tools.py:191-220](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/src/jacobian/mcp/tools.py#L191-L220)

find 的互斥输入约束。

<details>
<summary>查看原文（30行）</summary>

```text
def _math_find_sync(
    query: OperationNeed | None,
    operation_id: OperationFindOperationId | None,
    namespace: OperationNamespace,
    limit: OperationMatchLimit | None,
    cursor: OperationCursor,
    search_mode: OperationSearchMode,
    active_catalog: Catalog,
) -> OperationFindResponse:
    if query is None and operation_id is None:
        raise _find_invalid_request_error(
            "Provide exactly one of query or operation_id.",
            hint="Use query to search, or operation_id to inspect one operation.",
            locations=("query", "operation_id"),
        )
    if query is not None and operation_id is not None:
        raise _find_invalid_request_error(
            "Provide exactly one of query or operation_id, not both.",
            hint="Remove operation_id for a search, or remove query for inspection.",
            locations=("query", "operation_id"),
        )
    if operation_id is not None and (
        namespace is not None
        or limit is not None
        or cursor is not None
        or search_mode != "precise"
    ):
        raise _find_invalid_request_error(
            "namespace, limit, cursor, and search_mode are only valid with query.",
            hint="Remove search options when inspecting an operation_id.",
```

</details>

**依据 3 · 源码核查**：[src/jacobian/mcp/tools.py:250-286](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/src/jacobian/mcp/tools.py#L250-L286)

可用性与授权后的执行。

<details>
<summary>查看原文（37行）</summary>

```text
        OperationInspectionResult(
            kind="operation",
            operation=descriptor,
            backend_availability=tuple(
                check_backend(name) for name in descriptor.runtime_requirements
            ),
        )
    )


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
                    projector=_operation_result_projector,
                    cancellation_signal=cancellation,
                    progress_sink=progress_sink,
                ),
                ctx,
            )
        except _OperationResolutionError as exc:
            raise ToolError(
                _unknown_operation_error_detail(operation_id).model_dump_json()
            ) from exc
```

</details>

**依据 4 · 源码核查**：[src/jacobian/dispatch.py:133-153](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/src/jacobian/dispatch.py#L133-L153)

解析、绑定、执行、投影与检查点。

<details>
<summary>查看原文（21行）</summary>

```text
    ):
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

**依据 5 · 源码核查**：[src/jacobian/catalog/catalog.py:38-53](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/src/jacobian/catalog/catalog.py#L38-L53)

请求与结果类型见证。

<details>
<summary>查看原文（16行）</summary>

```text
def _bind_operation[RequestT: StrictModel, ResultT: StrictModel](
    operation: MathTool[RequestT, ResultT],
) -> _BoundMathTool:
    """Erase one typed declaration only after retaining its runtime witnesses."""

    def run(request: StrictModel) -> StrictModel:
        if not isinstance(request, operation.request_type):
            raise TypeError(
                f"{operation.operation_id} received a request outside its declared type"
            )
        result = operation.run(request)
        if type(result) is not operation.result_type:
            raise TypeError(
                f"{operation.operation_id} returned a result outside its declared type"
            )
        return result
```

</details>

**依据 6 · 源码核查**：[src/jacobian/mcp/tools.py:289-306](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/src/jacobian/mcp/tools.py#L289-L306)

超时与取消转错误。

<details>
<summary>查看原文（18行）</summary>

```text
@contextmanager
def _operation_error_boundary(operation_id: str) -> Iterator[None]:
    """Translate and privately log failures once for both SDK entry points."""

    try:
        yield
    except (OperationRequestValidationError, OperationDomainValidationError) as exc:
        raise _invalid_request_error(operation_id, exc) from exc
    except OperationExecutionTimeoutError as exc:
        raise _execution_tool_error(
            code="OPERATION_TIMEOUT",
            operation_id=operation_id,
            stage=exc.stage,
            timeout=exc,
        ) from exc
    except OperationExecutionCancelledError as exc:
        raise _execution_tool_error(
            code="OPERATION_CANCELLED", operation_id=operation_id, stage=exc.stage
```

</details>

#### 缺口

- 未逐项审计算法及后端超时
  **影响**：不能对所有操作或数学结论作正确性保证
  **进一步探讨**：选定具体操作与独立数学参考对照错误和中断。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 运行条件和失败时的退路是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Python 包声明 3.12 至 3.13 和包括 SymPy、Z3、FLINT、CyPari 等依赖；作者说明其二进制安装合同限 CPython glibc Linux x86-64，Singular、QEPCAD 为部分操作的可选系统后端。调用方应先 inspect 后端和操作约束，再以已知样例与独立工具对照；缺依赖、超时、近似或未完成时停止把结果当证明并退回人工验证。安装、模型及求解运行成本依任务而异，现金与耗时均未实测。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-37](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/pyproject.toml#L5-L37)

版本、依赖和入口。

<details>
<summary>查看原文（33行）</summary>

```text
[project]
name = "jacobian"
version = "0.23.0"
description = "Atomic mathematical tools for agents over MCP and Python"
readme = "README.md"
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
]

[project.scripts]
jacobian = "jacobian.cli:app"
jacobian-mcp = "jacobian.mcp.stdio_cli:main"
```

</details>

**依据 2 · 作者声明**：[README.md:77-89](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/README.md#L77-L89)

作者说明平台合同及可选后端。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/jacobian/mcp/tools.py:250-255](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/src/jacobian/mcp/tools.py#L250-L255)

检查后端可用性。

```text
        OperationInspectionResult(
            kind="operation",
            operation=descriptor,
            backend_availability=tuple(
                check_backend(name) for name in descriptor.runtime_requirements
            ),
```

**依据 4 · 源码核查**：[src/jacobian/mcp/tools.py:289-306](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/src/jacobian/mcp/tools.py#L289-L306)

超时与取消显式返回。

<details>
<summary>查看原文（18行）</summary>

```text
@contextmanager
def _operation_error_boundary(operation_id: str) -> Iterator[None]:
    """Translate and privately log failures once for both SDK entry points."""

    try:
        yield
    except (OperationRequestValidationError, OperationDomainValidationError) as exc:
        raise _invalid_request_error(operation_id, exc) from exc
    except OperationExecutionTimeoutError as exc:
        raise _execution_tool_error(
            code="OPERATION_TIMEOUT",
            operation_id=operation_id,
            stage=exc.stage,
            timeout=exc,
        ) from exc
    except OperationExecutionCancelledError as exc:
        raise _execution_tool_error(
            code="OPERATION_CANCELLED", operation_id=operation_id, stage=exc.stage
```

</details>

#### 缺口

- 未安装或测性能、平台及后端
  **影响**：无法保证目标机器能运行或估计费用
  **进一步探讨**：隔离环境核后端版本并测已知答案、超时与退出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何检验操作选择与结果可信度改进？

**研究主题**：新假设与验证

#### 完整回答

可以假设让模型在执行前保存已检查操作、适用前提和预期结果类型，并在完成后用独立验证器或反例检查，可降低误选操作或把不完整结果当证明；这是待验证流程而非项目已经保证。用相同题集对照普通检索与增加前提核查，记录误选、错误证成、正确完成率、工具次数和人工复核时间；若正确性无改善或额外负担大则否定。对于本来就没有独立验证器的问题，不能把类型成功当作验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/jacobian/mcp/tools.py:191-220](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/src/jacobian/mcp/tools.py#L191-L220)

操作检索或契约检查。

<details>
<summary>查看原文（30行）</summary>

```text
def _math_find_sync(
    query: OperationNeed | None,
    operation_id: OperationFindOperationId | None,
    namespace: OperationNamespace,
    limit: OperationMatchLimit | None,
    cursor: OperationCursor,
    search_mode: OperationSearchMode,
    active_catalog: Catalog,
) -> OperationFindResponse:
    if query is None and operation_id is None:
        raise _find_invalid_request_error(
            "Provide exactly one of query or operation_id.",
            hint="Use query to search, or operation_id to inspect one operation.",
            locations=("query", "operation_id"),
        )
    if query is not None and operation_id is not None:
        raise _find_invalid_request_error(
            "Provide exactly one of query or operation_id, not both.",
            hint="Remove operation_id for a search, or remove query for inspection.",
            locations=("query", "operation_id"),
        )
    if operation_id is not None and (
        namespace is not None
        or limit is not None
        or cursor is not None
        or search_mode != "precise"
    ):
        raise _find_invalid_request_error(
            "namespace, limit, cursor, and search_mode are only valid with query.",
            hint="Remove search options when inspecting an operation_id.",
```

</details>

**依据 2 · 源码核查**：[src/jacobian/dispatch.py:133-153](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/src/jacobian/dispatch.py#L133-L153)

输入执行和投影的边界。

<details>
<summary>查看原文（21行）</summary>

```text
    ):
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

**依据 3 · 作者声明**：[README.md:22-34](https://github.com/morluto/jacobian/blob/ea52eb5a8395fe9dcf4aad3220c6ca62c58ccb89/README.md#L22-L34)

作者对可组合数学操作的假设。

<details>
<summary>查看原文（13行）</summary>

```text
Each operation establishes one stable, reusable mathematical postcondition
rather than prescribing a workflow or proof strategy. Results are exact where
claimed and make approximation, incompleteness, or uncertainty explicit.

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

</details>

#### 缺口

- 未实施同题集对照或独立验证
  **影响**：不能判断是否减少误用
  **进一步探讨**：覆盖可证明、不可判定和后端缺失样例。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
