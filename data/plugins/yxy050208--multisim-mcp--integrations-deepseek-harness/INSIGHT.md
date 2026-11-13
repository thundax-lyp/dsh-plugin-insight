# Multisim MCP for DSH

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[68df741](https://github.com/yxy050208/multisim-mcp/tree/68df74186d4593a885ab5d754215bb87071122ca/integrations/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 38](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=38&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yxy050208/multisim-mcp) [![npm 30d 2,023](https://img.shields.io/static/v1?label=npm+30d&message=2%2C023&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/multisim-mcp-dsh-plugin) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/multisim-mcp-dsh-plugin)
<!-- END META -->

> **功能**：将 Multisim MCP 的电路诊断和实验工具接入 DeepSeek Harness。

> **亮点**：将解释器、运行环境和工具范围组成可装载 profile，复用既有服务，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：实验验证与人类审批来源有独立路径，宿主超时也不能确定后台结果，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 已有 Multisim 时，DSH bundle 比手工启动 MCP 多解决什么？](#detail-section-11)
  - [Q02 · 工具范围、后台任务和结果查询如何分开？](#detail-section-12)
  - [Q03 · 电路审批凭据与底层 EDA 的权限边界是什么？](#detail-section-13)
  - [Q04 · 一个 RC 校验怎样限定试用与退出？](#detail-section-14)
  - [Q05 · 在结果中突出审批来源能否减少误把旧 spec 当已审批？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已有 Multisim 环境、在 DSH 里追踪简单电路实验的人，见 [Q01](#research-q01)。

手工配置同一个 MCP，或在 Multisim 中建图、运行并导出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP 装配 | 暴露所选 profile 的工具 | 依赖外部服务 |
| 实验提交 | 运行有限电路族 | 需回查实际证据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH MCP 与兼容 Python 包 | 必需 | 启动 stdio 工具 | 服务启动失败 |
| Multisim 与模板 | 仿真所需 | 运行电路及量测 | 模型或环境错误 |
| 独立输出目录 | 后台提交所需 | 保存证据 | 已有目录会拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核解释器与工具 profile | 测试电路与理论可复查 |
| 执行 | 运行一次 RC 并保存结果 | 核量测与实际产物 |
| 退出 | 状态未知时先查 job 与 Multisim | 人工复核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | EDA 与 Python 环境 | 准备模型和模板 | 软件费用和配置时间未知 |
| 持续 | 本机资源与存储 | 核量测和证据 | 单位合格实验未知 |
| 恢复 | 可能重复运行 | 回查后台任务与文件 | 断线不等于已停 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工具接入 | stdio 与 profile 控制 | 真实宿主可用性 |
| 实验 | 后台与凭据路径有实现 | 量测准确性 |

> **思考**：实验验证与人类审批来源有独立路径，宿主超时也不能确定后台结果，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将解释器、运行环境和工具范围组成可装载 profile，复用既有服务，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

注册范围和后台结果分开，审批凭据只说明进入相应分支，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

实验验证与人类审批来源有独立路径，宿主超时也不能确定后台结果，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用已知理论的 RC 测例核工具、模型、输出与真实量测，未知时回到人工，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认 bundle 和工具注册，未验证实际仿真、兼容与量测。

- 已检查：作者 README、包清单、源码路径 integrations/deepseek-harness/README.md、integrations/deepseek-harness/cordis.patch.yml、mcp_server/multisim_mcp/server.py 及固定范围 inventory；组件：integrations/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 DSH 子组件与同树 Python 接线。未运行 Windows、Multisim、Python 目标或发布物。
- 下一步：在隔离项目比对理论、人工量测与工具结果，并测试重连和凭据变更。

**分析版本**

- **仓库**：[yxy050208/multisim-mcp](https://github.com/yxy050208/multisim-mcp)
- **版本号**：1.3.0（[固定提交 68df741](https://github.com/yxy050208/multisim-mcp/tree/68df74186d4593a885ab5d754215bb87071122ca)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把运行的凭据核验状态在输出中直接标出，比较能否减少审阅误判，见 [Q05](#research-q05)。

在隔离项目比对理论、人工量测与工具结果，并测试重连和凭据变更。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 75 | — | — | 891 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/yxy050208/multisim-mcp/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对 DSH 如何加载 Multisim，区分工具配置、仿真结果和凭据来源。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有 Multisim 时，DSH bundle 比手工启动 MCP 多解决什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合有可用 Multisim 环境、要在 DSH 中组织简单电路验证的人。相对手工配 stdio，bundle 固定 MCP 行和默认实验工具范围；相对全人工仿真，可通过同一会话调工具并读取结构化结果。实际仿真和判断由 Python 服务及 EDA 执行，包不包含运行时或模板。合格结果应是电路和量测能被独立复核，不能以生成项目文件为完成。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:1-17](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/integrations/deepseek-harness/README.md#L1-L17)

作者说明薄适配、版本及默认工具范围。

<details>
<summary>查看原文（17行）</summary>

```text
# 1.3.0 npm bundle / 1.3.0 core compatibility

The npm bundle is `multisim-mcp-dsh-plugin@1.3.0`. The public Python
package is `multisim-mcp==1.3.0`. The bundle remains a thin adapter: it does not
include Python, Multisim, or local component templates. It uses the configured Python MCP
server and does not bundle Python or Multisim. New capabilities remain limited to the
documented validated circuit families.

# Multisim MCP 的 DeepSeek Harness 插件

这是一个可独立安装的 Harness bundle。它把 Multisim MCP 注册为
`mcp__multisim__*` 工具，并默认使用 `experiment` Tool Profile。

## 安装

先在 32 位 Python 中安装与 bundle 同版本的 `multisim-mcp`，设置该解释器路径，
再把固定版本的 bundle 加入 Harness profile：
```

</details>

**依据 2 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:1-20](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/integrations/deepseek-harness/cordis.patch.yml#L1-L20)

实际配置 MCP stdio。

<details>
<summary>查看原文（20行）</summary>

```text
- insert:
    - id: "mcp-multisim"
      name: "@deepseek-ai/dsh-mcp-client"
      config:
        serverName: "multisim"
        transport: "stdio"
        command: !!js process.env.MULTISIM_MCP_PYTHON ?? "python"
        args:
          - "-m"
          - "multisim_mcp.server"
        env:
          PYTHONUTF8: "1"
          PYTHONUNBUFFERED: "1"
          MULTISIM_MCP_TOOL_PROFILE: !!js process.env.MULTISIM_MCP_TOOL_PROFILE ?? "experiment"
          MULTISIM_MCP_TEMPLATE_DIR: !!js process.env.MULTISIM_MCP_TEMPLATE_DIR ?? ""
          MULTISIM_MCP_WORKDIR: !!js process.env.MULTISIM_MCP_WORKDIR ?? ""
          MULTISIM_MCP_ARTIFACT_EXPORT_DIR: !!js process.env.MULTISIM_MCP_ARTIFACT_EXPORT_DIR ?? ""
          MULTISIM_MCP_MODEL_ROOT: !!js process.env.MULTISIM_MCP_MODEL_ROOT ?? ""
        failOnStartupError: true
        toolCallTimeoutMs: 120000
```

</details>

**依据 3 · 源码核查**：[mcp_server/multisim_mcp/server.py:733-745](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/mcp_server/multisim_mcp/server.py#L733-L745)

同仓库服务真实工具注册。

<details>
<summary>查看原文（13行）</summary>

```text
@mcp.tool()
def connect() -> dict:
    """Connect to the local Multisim Automation API."""
    return client.connect()


@mcp.tool()
def runtime_status(target_version: str | None = None) -> dict:
    """Check local EDA runtime compatibility without starting Multisim."""
    profile = tool_profile_status(_TOOL_PROFILE)
    contract = build_capabilities(
        server_version=__version__, tool_profile=profile,
        target_version=target_version,
```

</details>

#### 缺口

- 同任务与手工仿真和自配 MCP 的人工差异未知
  **影响**：无法量化包的交付增量
  **进一步探讨**：以已知 RC 电路对照提交、量测和复核

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具范围、后台任务和结果查询如何分开？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主按指定 Python 运行 multisim_mcp.server，进程默认 experiment。Python 注册器按 profile 决定某函数是否出现在 MCP tools/list，COM 序列化的工具另走工作线程。后台工程入口只接 rc、rlc、opamp，输出必须是新建的非根目录，并检查任务时限。它返回任务提交，作者要求再按 job ID 查询。宿主单次工具调用上限与后台任务执行时限是两件事，遇到断连不能以 MCP 超时推断仿真停止。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:5-25](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/integrations/deepseek-harness/cordis.patch.yml#L5-L25)

默认 profile、调用超时、重连。

<details>
<summary>查看原文（21行）</summary>

```text
        serverName: "multisim"
        transport: "stdio"
        command: !!js process.env.MULTISIM_MCP_PYTHON ?? "python"
        args:
          - "-m"
          - "multisim_mcp.server"
        env:
          PYTHONUTF8: "1"
          PYTHONUNBUFFERED: "1"
          MULTISIM_MCP_TOOL_PROFILE: !!js process.env.MULTISIM_MCP_TOOL_PROFILE ?? "experiment"
          MULTISIM_MCP_TEMPLATE_DIR: !!js process.env.MULTISIM_MCP_TEMPLATE_DIR ?? ""
          MULTISIM_MCP_WORKDIR: !!js process.env.MULTISIM_MCP_WORKDIR ?? ""
          MULTISIM_MCP_ARTIFACT_EXPORT_DIR: !!js process.env.MULTISIM_MCP_ARTIFACT_EXPORT_DIR ?? ""
          MULTISIM_MCP_MODEL_ROOT: !!js process.env.MULTISIM_MCP_MODEL_ROOT ?? ""
        failOnStartupError: true
        toolCallTimeoutMs: 120000
        reconnect:
          enabled: true
          initialDelayMs: 500
          maxDelayMs: 30000
          maxAttempts: 10
```

</details>

**依据 2 · 源码核查**：[mcp_server/multisim_mcp/server.py:284-304](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/mcp_server/multisim_mcp/server.py#L284-L304)

注册过滤和 COM 分流。

<details>
<summary>查看原文（21行）</summary>

```text
    def tool(self, *decorator_args: Any, **decorator_kwargs: Any) -> Any:
        com_serialized = bool(decorator_kwargs.pop("com_serialized", True))
        register = super().tool(*decorator_args, **decorator_kwargs)

        def decorator(function: Any) -> Any:
            if not tool_enabled(function.__name__, _TOOL_PROFILE):
                # Keep the original callable available to internal code and unit
                # tests while omitting it from MCP tools/list for this process.
                return function
            reporting = _wrap_with_tool_error_reporting(function)
            if not com_serialized:
                register(reporting)
                return function

            @functools.wraps(reporting)
            async def serialized(*args: Any, **kwargs: Any) -> Any:
                loop = asyncio.get_running_loop()
                invoke = functools.partial(
                    _invoke_tool_on_worker_thread,
                    reporting,
                    args,
```

</details>

**依据 3 · 源码核查**：[mcp_server/multisim_mcp/server.py:2907-2923](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/mcp_server/multisim_mcp/server.py#L2907-L2923)

真实后台提交约束。

<details>
<summary>查看原文（17行）</summary>

```text
def submit_natural_engineering_job(
    kind: str, text: str, output_dir: str, job_timeout: float = 7200.0,
) -> JobSubmission:
    """Queue a native RC, RLC, or OPAMP engineering workflow."""
    if kind not in {"rc", "rlc", "opamp"}:
        raise ValueError("kind must be rc, rlc, or opamp")
    if not isinstance(text, str) or not text.strip() or len(text) > 4000:
        raise ValueError("text must contain 1-4000 characters")
    output_path = Path(output_dir).expanduser().resolve()
    if output_path == Path(output_path.anchor) or output_path.exists():
        raise ValueError("output_dir must be a new non-root directory")
    if isinstance(job_timeout, bool) or not math.isfinite(float(job_timeout)) or not 1 <= float(job_timeout) <= 86_400:
        raise ValueError("job_timeout must be between 1 and 86400 seconds")
    return _job_manager().submit({
        "job_kind": "natural_engineering", "natural_kind": kind,
        "text": text, "output_dir": str(output_path), "job_timeout": float(job_timeout),
    })
```

</details>

**依据 4 · 源码核查**：[mcp_server/multisim_mcp/server.py:4753-4758](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/mcp_server/multisim_mcp/server.py#L4753-L4758)

实际服务运行入口。

```text
def main() -> None:
    mcp.run()


if __name__ == "__main__":
    main()
```

**依据 5 · 作者声明**：[integrations/deepseek-harness/README.md:44-50](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/integrations/deepseek-harness/README.md#L44-L50)

作者说明后台证据查询。

```text
- `MULTISIM_MCP_TEMPLATE_DIR`：本地组件模板包；
- `MULTISIM_MCP_WORKDIR`：实验工作目录；
- `MULTISIM_MCP_ARTIFACT_EXPORT_DIR`：允许导出产物的根目录。
- 自然语言工程工具包括 RC、RLC 和 OPAMP 的 plan/run 入口；后台运行使用
  `submit_natural_engineering_job`，`kind` 为 `rc`、`rlc` 或 `opamp`。
- 后台任务通过 `get_experiment_job` 和 `multisim://jobs/{job_id}` 查询阶段、取消和证据。
- 未验证元件模型和未通过拓扑/数值验收的任务会失败关闭，不会仅因生成 `.ms14` 就报告成功。
```

#### 缺口

- 重连后后台任务可查询或可取消的行为未实测
  **影响**：不能用断线推断任务状态
  **进一步探讨**：提交一次测试任务并重连后独立查产物与 job

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 电路审批凭据与底层 EDA 的权限边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

实验工具可以为网表预览和仿真计划生成绑定凭据，单独审批调用不成图、不仿真。核验实验入口一旦收到任意凭据参数，要求三项齐全并重新绑定后进入实现，未提供则保留旧直接 spec 路径。该凭据是结构化数据，不可当成所有工具必经的宿主批准。部署依赖 32 位 Python 中的兼容包、对应 Multisim 及模型，补丁允许指定解释器和文件根。配置 failOnStartupError 为 true，服务启动失败需处理依赖。没有实机量测，不能作为真实电路性能凭据。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:14-28](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/integrations/deepseek-harness/README.md#L14-L28)

作者的解释器与版本要求。

<details>
<summary>查看原文（15行）</summary>

````text
## 安装

先在 32 位 Python 中安装与 bundle 同版本的 `multisim-mcp`，设置该解释器路径，
再把固定版本的 bundle 加入 Harness profile：

```powershell
$env:MULTISIM_MCP_PYTHON = "C:\path\to\python32\python.exe"
& $env:MULTISIM_MCP_PYTHON -m pip install "multisim-mcp==1.3.0"
dsh plugin --profile web add "multisim-mcp-dsh-plugin@1.3.0"
dsh --profile web --dump-config
```

安装或升级 bundle 后应重新启动该 profile。发布前验证当前源码时，应先用
`npm pack .\integrations\deepseek-harness --ignore-scripts` 生成 `.tgz`，再把该
tarball 的绝对路径交给 `dsh plugin ... add`，以验证与最终发布相同的包边界。
````

</details>

**依据 2 · 作者声明**：[integrations/deepseek-harness/README.md:51-66](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/integrations/deepseek-harness/README.md#L51-L66)

作者声明模型根与宿主边界。

<details>
<summary>查看原文（16行）</summary>

```text
- `MULTISIM_MCP_MODEL_ROOT`：`compile_executable_netlist` 重新哈希获批外部模型时唯一允许
  读取的本地根目录；模型 URI 必须是该目录内的相对路径。

`experiment` profile 现在包含 `compile_executable_netlist` 和
`approve_executable_netlist`。它们目前只对 `signal-passive` 生成并确认内存中的引脚级
`CircuitDesign` / SPICE 预览，其他方案失败关闭；批准凭证只开放成图准备，不会写文件、
添加激励、执行分析或启动仿真。要消费审批凭证，调用
`create_schematic_from_netlist` 时同时传入完整预览 `executable_netlist`、审批凭证
`netlist_approval` 和预览中原样的 `spice_netlist`；工具会在写入 `.ms14` 前重新校验绑定，
拒绝缺凭证或被修改的网表，且不会启动仿真。
随后调用 `approve_simulation_plan`，把同一网表审批绑定到经过安全校验的
`ExperimentSpec`（分析命令、测量和验收限制）；执行时将三份凭证传给
`run_verified_circuit_experiment`，它会在成图和仿真前再次验证绑定。

不要把 `DEEPSEEK_API_KEY` 放入 MCP 子进程配置。该凭据只属于 Harness。
MCP 服务器命令在 agent 沙箱之外执行，应当只安装可信发布物并固定版本。
```

</details>

**依据 3 · 源码核查**：[integrations/deepseek-harness/cordis.patch.yml:7-20](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/integrations/deepseek-harness/cordis.patch.yml#L7-L20)

解释器、根路径及失败策略。

<details>
<summary>查看原文（14行）</summary>

```text
        command: !!js process.env.MULTISIM_MCP_PYTHON ?? "python"
        args:
          - "-m"
          - "multisim_mcp.server"
        env:
          PYTHONUTF8: "1"
          PYTHONUNBUFFERED: "1"
          MULTISIM_MCP_TOOL_PROFILE: !!js process.env.MULTISIM_MCP_TOOL_PROFILE ?? "experiment"
          MULTISIM_MCP_TEMPLATE_DIR: !!js process.env.MULTISIM_MCP_TEMPLATE_DIR ?? ""
          MULTISIM_MCP_WORKDIR: !!js process.env.MULTISIM_MCP_WORKDIR ?? ""
          MULTISIM_MCP_ARTIFACT_EXPORT_DIR: !!js process.env.MULTISIM_MCP_ARTIFACT_EXPORT_DIR ?? ""
          MULTISIM_MCP_MODEL_ROOT: !!js process.env.MULTISIM_MCP_MODEL_ROOT ?? ""
        failOnStartupError: true
        toolCallTimeoutMs: 120000
```

</details>

**依据 4 · 源码核查**：[mcp_server/multisim_mcp/server.py:1204-1237](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/mcp_server/multisim_mcp/server.py#L1204-L1237)

生成两阶段凭据。

<details>
<summary>查看原文（34行）</summary>

```text
@mcp.tool(com_serialized=False)
def approve_executable_netlist(
    executable_netlist: dict[str, Any],
    approval: dict[str, Any],
) -> dict[str, Any]:
    """Record explicit human approval for one immutable netlist preview.

    The approval binds the compiled CircuitDesign and SPICE digest.  It does
    not write a schematic, create a project file, add stimuli, or start a
    simulation; those remain separate downstream gates.
    """
    return build_executable_netlist_approval(executable_netlist, approval)


@mcp.tool(com_serialized=False)
def approve_simulation_plan(
    executable_netlist: dict[str, Any],
    netlist_approval: dict[str, Any],
    experiment_spec: dict[str, Any],
    approval: dict[str, Any],
) -> dict[str, Any]:
    """Record explicit approval for one safe simulation plan.

    The artifact binds the approved executable-netlist preview to the exact
    analysis commands, measurement requirements, and theoretical values in an
    ``ExperimentSpec``. It does not create a schematic, write files, or start
    a simulation; ``run_verified_circuit_experiment`` must validate it again.
    """
    return build_simulation_plan_approval(
        executable_netlist,
        netlist_approval,
        experiment_spec,
        approval,
    )
```

</details>

**依据 5 · 源码核查**：[mcp_server/multisim_mcp/server.py:3381-3427](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/mcp_server/multisim_mcp/server.py#L3381-L3427)

核验实验的兼容分支及重验。

<details>
<summary>查看原文（47行）</summary>

```text
def run_verified_circuit_experiment(
    spec: ExperimentSpec,
    output_dir: str,
    timeout: float = 120.0,
    max_points: int = 2000,
    overwrite: bool = False,
    executable_netlist: dict[str, Any] | None = None,
    netlist_approval: dict[str, Any] | None = None,
    simulation_plan_approval: dict[str, Any] | None = None,
) -> VerifiedExperimentResult:
    """Run an ExperimentSpec and persist evidence-backed requirement verdicts.

    When the three approval inputs are supplied, the exact executable-netlist
    and simulation-plan handoff is revalidated before any schematic or
    simulation work begins. The legacy direct-spec path remains available for
    compatibility; it does not claim this additional approval provenance.
    """
    normalized = validate_experiment_spec(spec)
    approved_handoff = (
        executable_netlist is not None
        or netlist_approval is not None
        or simulation_plan_approval is not None
    )
    if approved_handoff:
        if (
            executable_netlist is None
            or netlist_approval is None
            or simulation_plan_approval is None
        ):
            raise ValueError(
                "executable_netlist, netlist_approval, and "
                "simulation_plan_approval must be provided together"
            )
        validated_approval = validate_approved_simulation_plan(
            executable_netlist,
            netlist_approval,
            normalized,
            simulation_plan_approval,
        )
    result = _run_circuit_experiment_impl(
        normalized["netlist"],
        normalized["commands"],
        output_dir,
        normalized["title"],
        timeout,
        max_points,
        overwrite,
```

</details>

#### 缺口

- 发布 Python 包和固定源码同源、真实模型与 COM 环境未验证
  **影响**：无法给出实际电路精度或隔离保证
  **进一步探讨**：先用已知模型核解释器、可见工具和数值

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 一个 RC 校验怎样限定试用与退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

已有 Multisim 许可和隔离测试项目的工程师，可以先观察一项 RC 低通实验。从已知理论截止频率出发，确认工具 profile、模板和输出目录，运行后独立核对频率、输出文件及量测。对照在 Multisim 手工建图和导出结果，分别记录软件与计算资源、环境配置、模型核对和人工复查。若模型缺失、量测无法复现或任务重连后状态不明，就先从 Multisim 查看队列或回到人工流程。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/deepseek-harness/README.md:16-28](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/integrations/deepseek-harness/README.md#L16-L28)

作者安装条件。

<details>
<summary>查看原文（13行）</summary>

````text
先在 32 位 Python 中安装与 bundle 同版本的 `multisim-mcp`，设置该解释器路径，
再把固定版本的 bundle 加入 Harness profile：

```powershell
$env:MULTISIM_MCP_PYTHON = "C:\path\to\python32\python.exe"
& $env:MULTISIM_MCP_PYTHON -m pip install "multisim-mcp==1.3.0"
dsh plugin --profile web add "multisim-mcp-dsh-plugin@1.3.0"
dsh --profile web --dump-config
```

安装或升级 bundle 后应重新启动该 profile。发布前验证当前源码时，应先用
`npm pack .\integrations\deepseek-harness --ignore-scripts` 生成 `.tgz`，再把该
tarball 的绝对路径交给 `dsh plugin ... add`，以验证与最终发布相同的包边界。
````

</details>

**依据 2 · 作者声明**：[integrations/deepseek-harness/README.md:44-63](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/integrations/deepseek-harness/README.md#L44-L63)

输出、证据及批准过程。

<details>
<summary>查看原文（20行）</summary>

```text
- `MULTISIM_MCP_TEMPLATE_DIR`：本地组件模板包；
- `MULTISIM_MCP_WORKDIR`：实验工作目录；
- `MULTISIM_MCP_ARTIFACT_EXPORT_DIR`：允许导出产物的根目录。
- 自然语言工程工具包括 RC、RLC 和 OPAMP 的 plan/run 入口；后台运行使用
  `submit_natural_engineering_job`，`kind` 为 `rc`、`rlc` 或 `opamp`。
- 后台任务通过 `get_experiment_job` 和 `multisim://jobs/{job_id}` 查询阶段、取消和证据。
- 未验证元件模型和未通过拓扑/数值验收的任务会失败关闭，不会仅因生成 `.ms14` 就报告成功。
- `MULTISIM_MCP_MODEL_ROOT`：`compile_executable_netlist` 重新哈希获批外部模型时唯一允许
  读取的本地根目录；模型 URI 必须是该目录内的相对路径。

`experiment` profile 现在包含 `compile_executable_netlist` 和
`approve_executable_netlist`。它们目前只对 `signal-passive` 生成并确认内存中的引脚级
`CircuitDesign` / SPICE 预览，其他方案失败关闭；批准凭证只开放成图准备，不会写文件、
添加激励、执行分析或启动仿真。要消费审批凭证，调用
`create_schematic_from_netlist` 时同时传入完整预览 `executable_netlist`、审批凭证
`netlist_approval` 和预览中原样的 `spice_netlist`；工具会在写入 `.ms14` 前重新校验绑定，
拒绝缺凭证或被修改的网表，且不会启动仿真。
随后调用 `approve_simulation_plan`，把同一网表审批绑定到经过安全校验的
`ExperimentSpec`（分析命令、测量和验收限制）；执行时将三份凭证传给
`run_verified_circuit_experiment`，它会在成图和仿真前再次验证绑定。
```

</details>

**依据 3 · 源码核查**：[mcp_server/multisim_mcp/server.py:2907-2923](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/mcp_server/multisim_mcp/server.py#L2907-L2923)

后台任务要求独立输出。

<details>
<summary>查看原文（17行）</summary>

```text
def submit_natural_engineering_job(
    kind: str, text: str, output_dir: str, job_timeout: float = 7200.0,
) -> JobSubmission:
    """Queue a native RC, RLC, or OPAMP engineering workflow."""
    if kind not in {"rc", "rlc", "opamp"}:
        raise ValueError("kind must be rc, rlc, or opamp")
    if not isinstance(text, str) or not text.strip() or len(text) > 4000:
        raise ValueError("text must contain 1-4000 characters")
    output_path = Path(output_dir).expanduser().resolve()
    if output_path == Path(output_path.anchor) or output_path.exists():
        raise ValueError("output_dir must be a new non-root directory")
    if isinstance(job_timeout, bool) or not math.isfinite(float(job_timeout)) or not 1 <= float(job_timeout) <= 86_400:
        raise ValueError("job_timeout must be between 1 and 86400 seconds")
    return _job_manager().submit({
        "job_kind": "natural_engineering", "natural_kind": kind,
        "text": text, "output_dir": str(output_path), "job_timeout": float(job_timeout),
    })
```

</details>

#### 缺口

- 没有实机仿真与人工耗时对照
  **影响**：不能证明可用于工程设计验收
  **进一步探讨**：以已知理论与人工仿真做重复对照

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 在结果中突出审批来源能否减少误把旧 spec 当已审批？

**研究主题**：新假设与验证

#### 完整回答

可在实验结果直接标出是否核验了两阶段凭据，保留直接 spec 为单独路径。用经过凭据、无凭据和篡改凭据的同一实验比较审阅者判断，记录把直接运行当成人工批准的次数。若原有结果已足够，或额外标签不改变误判率，则不增加字段。

#### 证据与依据

**依据 1 · 源码核查**：[mcp_server/multisim_mcp/server.py:3381-3427](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/mcp_server/multisim_mcp/server.py#L3381-L3427)

核验与旧直接路径实际共存。

<details>
<summary>查看原文（47行）</summary>

```text
def run_verified_circuit_experiment(
    spec: ExperimentSpec,
    output_dir: str,
    timeout: float = 120.0,
    max_points: int = 2000,
    overwrite: bool = False,
    executable_netlist: dict[str, Any] | None = None,
    netlist_approval: dict[str, Any] | None = None,
    simulation_plan_approval: dict[str, Any] | None = None,
) -> VerifiedExperimentResult:
    """Run an ExperimentSpec and persist evidence-backed requirement verdicts.

    When the three approval inputs are supplied, the exact executable-netlist
    and simulation-plan handoff is revalidated before any schematic or
    simulation work begins. The legacy direct-spec path remains available for
    compatibility; it does not claim this additional approval provenance.
    """
    normalized = validate_experiment_spec(spec)
    approved_handoff = (
        executable_netlist is not None
        or netlist_approval is not None
        or simulation_plan_approval is not None
    )
    if approved_handoff:
        if (
            executable_netlist is None
            or netlist_approval is None
            or simulation_plan_approval is None
        ):
            raise ValueError(
                "executable_netlist, netlist_approval, and "
                "simulation_plan_approval must be provided together"
            )
        validated_approval = validate_approved_simulation_plan(
            executable_netlist,
            netlist_approval,
            normalized,
            simulation_plan_approval,
        )
    result = _run_circuit_experiment_impl(
        normalized["netlist"],
        normalized["commands"],
        output_dir,
        normalized["title"],
        timeout,
        max_points,
        overwrite,
```

</details>

**依据 2 · 源码核查**：[mcp_server/multisim_mcp/server.py:1218-1237](https://github.com/yxy050208/multisim-mcp/blob/68df74186d4593a885ab5d754215bb87071122ca/mcp_server/multisim_mcp/server.py#L1218-L1237)

审批构造是独立阶段。

<details>
<summary>查看原文（20行）</summary>

```text
@mcp.tool(com_serialized=False)
def approve_simulation_plan(
    executable_netlist: dict[str, Any],
    netlist_approval: dict[str, Any],
    experiment_spec: dict[str, Any],
    approval: dict[str, Any],
) -> dict[str, Any]:
    """Record explicit approval for one safe simulation plan.

    The artifact binds the approved executable-netlist preview to the exact
    analysis commands, measurement requirements, and theoretical values in an
    ``ExperimentSpec``. It does not create a schematic, write files, or start
    a simulation; ``run_verified_circuit_experiment`` must validate it again.
    """
    return build_simulation_plan_approval(
        executable_netlist,
        netlist_approval,
        experiment_spec,
        approval,
    )
```

</details>

#### 缺口

- 目标审阅界面对两类结果的差异是否已足够清楚
  **影响**：影响假设优先级
  **进一步探讨**：先回读两个结果路径的实际输出再盲评

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
