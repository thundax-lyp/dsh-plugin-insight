# MCP-for-Stata

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[1e94c3b](https://github.com/SepineTam/mcp-for-stata/tree/1e94c3bfe82675eed8c85b18f6c9303dd92b4757)

<!-- BEGIN META -->
[![GitHub ★ 271](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=271&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SepineTam/mcp-for-stata)
<!-- END META -->

> **功能**：让宿主Agent调用本地Stata与数据/日志工具，保存来源快照和执行审计；默认保护、真实安装确认与研究结果验收须分别核查。

> **亮点**：标准接口、路径/命令检查、真执行快照与审计链接便于结果追查；独立操作见主能力表，现有审计不等研究正确，见[Q02](#research-q02)。

> **主要限制**：MCP安装ctx审批停用/API自动confirm与Skill逐次询问不一致；数据边界/URLguard及RAM监视并非默认全开，进程成功/日志/全hash不等研究成立，见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 真实入口、对象及相对手动Stata的贡献是什么？](#detail-section-11)
  - [Q02 · 从do工具到Stata再返回日志/审计的链条是什么？](#detail-section-12)
  - [Q03 · guard与安装确认、元数据读取的真实权限边界是什么？](#detail-section-13)
  - [Q04 · 谁已有条件可采用，资源与恢复退出要付什么？](#detail-section-14)
  - [Q05 · 生产方向怎样超出现有MCP/审计，如何证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有合法本地Stata和定量能力者，在匿名副本中让宿主Agent运行/核查do任务；需求频率/收益待独立对照，见[Q01](#research-q01)。

手工Stata/编辑器/日志与已有MCP工具宿主；不把Stata引擎、模型和统计识别当本项目新算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| stata_do | 执行do文件并回日志路径 | core/all，合法本地Stata；sync默认/async可选，guard/timeout/资源条件另核 |
| get_data_info | 数据概览/变量/可选head | core/all，Windows MCP默认隐藏；Python handler、路径/URL保护非默认全开 |
| help | 获取Stata命令帮助 | Unix及core/all；帮助内容不替代研究规格判断 |
| read_log | 读text/SMCL、可裁剪/可选结构化 | all；MCP限定artifact/额外根，API/CLI不一概等价 |
| ado_package_install | 安装选定来源第三方包 | 只unsafe；MCP无当前elicitation、API自动confirm，宿主/操作者需可信授权 |
| write_dofile Python API | 将内容写本地do文件供执行 | 未注册成MCP第六工具，需写目录权限/用户保全 |
| stata-audit校验脚本 | 链接run/安全记录、全SHA检查快照 | 已有证据完整性检查，不证明结果/研究正确 |
| stata-skill指南 | 提供回归表/图导出及工具操作默认 | 指令依宿主遵守，安装询问说明与现实现不一致 |

**流程与依赖**

Python/MCP与可写资料；本地Stata许可用于真实统计执行，非所有元数据一概必需；模型/平台按功能，四列表见[Q04](#research-q04)。

宿主发现当前工具→准备匿名数据/do→检查/快照/执行→读日志/审计→人核规格/结果；完整步骤见[Q01](#research-q01)。

**效果与成本**

已有许可用户也需固定路径/权限、记录来源/环境；持续模型/统计/证据资源，失败先查partial状态，退出保存研究工件；现金/人工四阶段见[Q04](#research-q04)。

来源可追、真实执行与证据可校验能减少手工串接，但语义/方法与净节时未证；三项效果表见[Q02](#research-q02)。

> **思考**：MCP安装ctx审批停用/API自动confirm与Skill逐次询问不一致；数据边界/URLguard及RAM监视并非默认全开，进程成功/日志/全hash不等研究成立，见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：标准接口、路径/命令检查、真执行快照与审计链接便于结果追查；独立操作见主能力表，现有审计不等研究正确，见[Q02](#research-q02)。

分清MCP真实caller与API/CLI边界；现有快照/run_id/fullSHA与guard值得保留，安装确认bool、资源默认、进程/研究终态不混同。

<a id="detail-section-5"></a>

### 1.4 主要限制

MCP安装ctx审批停用/API自动confirm与Skill逐次询问不一致；数据边界/URLguard及RAM监视并非默认全开，进程成功/日志/全hash不等研究成立，见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有合法Stata与方法能力，匿名本地副本、不用unsafe安装；确认guard、目录、资源/timeout实际配置，按已知答案核结果再扩大，见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源闭合分发CLI注册、MCP do到真实Unix子进程/执行快照/日志和审计校验；核异步/平台开关、关键guard/元数据与安装callee。未运行目标/付费Stata/模型或验证统计结果；限已有许可研究者匿名副本试用。

- 已检查：作者 README、包清单、源码路径 plugins/stata-toolbox/skills/stata-audit/SKILL.md、plugins/stata-toolbox/skills/stata-audit/scripts/validate_audit.py、plugins/stata-toolbox/skills/stata-skill/SKILL.md、pyproject.toml、src/stata_mcp/api/ado_install.py、src/stata_mcp/api/get_data_info.py、src/stata_mcp/api/write_dofile.py、src/stata_mcp/audit/store.py、src/stata_mcp/cli/_cli.py、src/stata_mcp/cli/_handlers.py、src/stata_mcp/config.py、src/stata_mcp/data_info/csv.py、src/stata_mcp/guard/input_validation.py、src/stata_mcp/guard/validator.py、src/stata_mcp/mcp_servers.py、src/stata_mcp/monitor/ram_monitor.py、src/stata_mcp/stata/builtin_tools/ado_install/base.py、src/stata_mcp/stata/builtin_tools/ado_install/ssc_install.py、src/stata_mcp/stata/stata_controller/controller.py、src/stata_mcp/stata/stata_do/async_do.py、src/stata_mcp/stata/stata_do/do.py、src/stata_mcp/utils/update.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：工程统计只有Markdown列项，未计核心Python，不等代码量/原创量或工时，不手补PY数量。四材料摘要/固定SOURCE身份已核，无正式identity旧稿。检查分发CLI到MCP/默认同步Unix执行、async代表、guard/安装/metadata真实callee与快照审计validator、局部资源退出；未执行目标/脚本/测试或外部调用，未全审Stata语法/ado闭包、Windows所有分支、全部API/宿主审批、并发与数据脱敏。
- 下一步：受控合法Stata匿名已知答案任务，对照普通日志和当前审计；核guard开关/安装真实同意、资源/部分输出、数据/规格变更与误判，见[Q05](#research-q05)。

**分析版本**

- **仓库**：[SepineTam/mcp-for-stata](https://github.com/SepineTam/mcp-for-stata)
- **版本号**：1.25.2（Python项目声明；Stata/ado/Skill各有版本）（[固定提交 1e94c3b](https://github.com/SepineTam/mcp-for-stata/tree/1e94c3bfe82675eed8c85b18f6c9303dd92b4757)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

超出现有do快照/审计，检验单次实证任务的数据/环境/规格和预设结果断言绑定；基线/指标/停止条件见[Q05](#research-q05)。

受控合法Stata匿名已知答案任务，对照普通日志和当前审计；核guard开关/安装真实同意、资源/部分输出、数据/规格变更与误判，见[Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

本表只覆盖Markdown，未计核心Python，不代表项目代码量/原创量，不手补Python数。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 97 | 21300 | — | — | 129391 |
| .md | example | 2 | 137 | — | — | 812 |
| .md | test | 1 | 161 | — | — | 774 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/SepineTam/mcp-for-stata/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/SepineTam/mcp-for-stata/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/SepineTam/mcp-for-stata/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定源码核真实MCP执行/返回、guard/审计/资源边界及实证任务采用方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真实入口、对象及相对手动Stata的贡献是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

这是Python MCP server/CLI/API配Skills的外部工具工程，真实entry_type为tool，不是根DSH bundle或自带通用模型循环。pyproject声明stata-mcp 1.25.2、Python>=3.11，console script到stata_mcp.cli.main；CLI server分支实际handle_server→选core/all/unsafe→register_tools→MCPServer.run，默认all，不把root main.py仅run当工具已挂载的证明。MCPServer实例带AuditMiddleware，注册函数按profile、平台和工具开关过滤，再server.tool装函数。get_data_info在Windows MCP默认隐藏，help仅Unix，ado安装只unsafe，故不能从源码函数存在推各客户端同时有所有工具。

已有本地Stata与定量方法能力的研究人员，可让宿主Agent写/运行do文件、取数据描述/日志/帮助，并保存执行证据。相对在GUI手贴命令/找日志，增量是标准工具接口、路径/命令guard、受控执行与来源快照/审计链接；Stata统计引擎、模型选择/决策和研究识别不由此项目重新实现。包的Skills给导出/回归默认与审计流程，是操作指引，不能当统计结论已经核验。主能力按独立操作列在主表。

| 步骤 | 执行者与动作 | 判据/失败 |
|---|---|---|
| 连接 | 宿主启动CLI server并发现当前profile工具 | 核实际工具清单/平台限制，不把连接成功当执行成功 |
| 准备 | 用户/宿主Agent检查数据、写do文件 | Python API可写文件；不是MCP自动完成研究设计 |
| 运行 | 工具先路径/命令检查，再StataDo执行来源快照 | 拒绝/超时/进程错误与结果路径分别看 |
| 读取 | 取日志、可选错误内容/元数据 | logpath/returncode不等分析正确 |
| 验收 | 研究者核样本/模型/输出与研究任务 | 审计完整性和研究正确性分开 |

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-10](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/pyproject.toml#L1-L10)

Python对象/1.25.2/要求与许可声明。

<details>
<summary>查看原文（10行）</summary>

```text
[project]
name = "stata-mcp"
version = "1.25.2"
description = "MCP-for-Stata: a stable, security-first MCP server and CLI for integrating local Stata into Claude Code, Codex, OpenClaw, and other AI research workflows."
readme = "README.md"
authors = [
    { name = "Song Tan", email = "sepinetam@gmail.com" }
]
requires-python = ">=3.11"
license = { text = "AGPL-3.0" }
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:48-65](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/pyproject.toml#L48-L65)

依赖与真实CLI console入口。

<details>
<summary>查看原文（18行）</summary>

```text
dependencies = [
    "installed-apps-scanner>=0.1.0,<0.2; sys_platform == 'darwin'",
    "winapps>=0.2.0,<0.3; sys_platform == 'win32'",
    "mcp[cli]>=2.1.1,<3.0",
    "opentelemetry-sdk>=1.44.0,<2.0",
    "cryptography>=50.0.0",
    "pandas>=3.0.0,<4.0.0",
    "pexpect>=4.9.0",
    "openpyxl>=3.1.5",
    "psutil>=7.2.2",
    "pyreadstat>=1.3.4",
    "requests>=2.34.0",
    "tomli-w>=1.2.0",
]

[project.scripts]
stata-mcp = "stata_mcp.cli:main"

```

</details>

**依据 3 · 源码核查**：[src/stata_mcp/cli/_cli.py:69-91](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/cli/_cli.py#L69-L91)

正常server/default分支实际调用handle_server。

<details>
<summary>查看原文（23行）</summary>

```text
    if args.command == "discover":
        sys.exit(handle_discover(args))

    if args.command == "server":
        handle_server(args)
        return

    if args.command == "config":
        exit_code = handle_config(args)
        if exit_code == 2:
            config_parser.print_help()
        sys.exit(exit_code)

    if args.command == "install":
        sys.exit(handle_install(args))

    if args.command == "update":
        sys.exit(handle_update(args))

    if args.command == "verify":
        sys.exit(handle_verify(args))

    handle_server(args)
```

</details>

**依据 4 · 源码核查**：[src/stata_mcp/cli/_handlers.py:369-400](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/cli/_handlers.py#L369-L400)

默认all、注册后才run和transport映射。

<details>
<summary>查看原文（32行）</summary>

```text
def handle_server(args: Namespace) -> None:
    """Handle the default behavior of starting the MCP server."""
    from ..config import Config
    from ..observability import configure_local_observability

    runtime_config = Config(config_file=getattr(args, "config_file", None))
    configure_local_observability(
        runtime_config.STATA_MCP_FOLDER.path,
        enabled=runtime_config.DEBUG_TRACING_ON,
        max_bytes=runtime_config.DEBUG_TRACING_MAX_BYTES,
        backup_count=runtime_config.DEBUG_TRACING_BACKUP_COUNT,
    )

    from ..mcp_servers import register_tools
    from ..mcp_servers import stata_mcp as mcp

    if getattr(args, "unsafe_profile", False):
        profile = "unsafe"
    elif getattr(args, "core_profile", False):
        profile = "core"
    elif getattr(args, "all_profile", False):
        profile = "all"
    else:
        profile = "all"

    logging.info("Starting server with tool profile: %s", profile)
    register_tools(mcp, profile=profile)

    transport = args.transport
    if transport == "http":
        transport = "streamable-http"
    mcp.run(transport=transport)
```

</details>

**依据 5 · 源码核查**：[src/stata_mcp/mcp_servers.py:148-156](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L148-L156)

真正MCPServer/audit middleware实例。

```text
# Initialize MCP Server
audit_store = AuditStore(config.STATA_MCP_FOLDER.path)
stata_mcp = MCPServer(
    name="stata-mcp",
    instructions=instructions,
    website_url="https://aidea-labs.com/open/projects/mcp-for-stata",
    icons=_icons,
    middleware=[AuditMiddleware(audit_store)],
)
```

**依据 6 · 源码核查**：[src/stata_mcp/mcp_servers.py:915-977](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L915-L977)

五工具元信息/平台/profile限制。

<details>
<summary>查看原文（63行）</summary>

```text
_TOOL_REGISTRY: Dict[str, Dict[str, Any]] = {
    "stata_do": {
        "description": (
            "Execute a Stata do-file and return the execution log. "
            "Accepts a do-file path, runs it via the configured Stata executable, "
            "and can optionally read log content only when return-code errors are detected. "
            "Use when you need to run Stata commands, perform regression or statistical analysis, "
            "or execute a do-file. "
        ),
        "func": stata_do,
        "config_name": "STATA_DO",
        "profiles": {"core", "all"},
    },
    "get_data_info": {
        "description": (
            "Get descriptive statistics and a data preview for a supported data file "
            "(.dta, .csv, .tsv, .psv, .xlsx, .xls, .sav, .zsav). Returns overview, variable details, "
            "and optional head rows filtered by requested variables. "
            "Use when you need to understand a dataset or have no prior knowledge of the data."
        ),
        "func": get_data_info,
        "config_name": "DATA_INFO",
        "profiles": {"core", "all"},
        # BETA gate for Windows only. get_data_info works via the CLI on Windows
        # but the MCP wrapper has a Windows-only bug that has resisted debugging
        # for over a month, so it is hidden from the MCP tool list on Windows
        # unless config.ENABLE_WINDOWS_DATA_INFO (BETA.enable_windows_data_info)
        # is turned on. See the gate in register_tools below.
        # TO REVERT once the bug is fixed: remove this key and the matching gate.
        "windows_beta_only": True,
    },
    "help": {
        "description": (
            "Retrieve documentation and usage information for a Stata command. "
            "Use when you need to understand a command's syntax, options, "
            "or troubleshoot errors before running it."
        ),
        "func": help,
        "config_name": "HELP",
        "profiles": {"core", "all"},
        "unix_only": True,
    },
    "read_log": {
        "description": (
            "Read a Stata log file (.log or .smcl) and return its content. "
            "Supports full, core, and dict output formats. "
            "Use `lines` to return only the first/last N lines."
        ),
        "func": read_log,
        "config_name": "READ_LOG",
        "profiles": {"all"},
    },
    "ado_package_install": {
        "description": (
            "Install a Stata ado package from SSC, GitHub, or net sources. "
            "This high-risk tool requires explicit operator enablement and "
            "per-call user confirmation."
        ),
        "func": ado_package_install,
        "config_name": "ADO_INSTALL",
        "profiles": {"unsafe"},
    },
}
```

</details>

**依据 7 · 源码核查**：[src/stata_mcp/mcp_servers.py:982-1028](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L982-L1028)

实际过滤与server.tool注册。

<details>
<summary>查看原文（47行）</summary>

```text
def register_tools(server: MCPServer, profile: str = "all") -> None:
    """Register tools and resources based on a selected profile."""
    global _registered_profile

    if profile not in {"core", "all", "unsafe"}:
        raise ValueError(f"Unsupported profile: {profile}")

    if _registered_profile == profile:
        return
    if _registered_profile is not None and _registered_profile != profile:
        raise RuntimeError(
            "Tools are already registered with a different profile. "
            "Create a new process to switch profile."
        )

    for name, meta in _TOOL_REGISTRY.items():
        if meta.get("unix_only") and not config.IS_UNIX:
            continue
        # BETA gate: hide Windows-only-buggy tools unless the beta flag is on.
        # get_data_info's MCP wrapper is broken on Windows (see registry note),
        # so on Windows it registers only when ENABLE_WINDOWS_DATA_INFO is set.
        # TO REVERT once fixed: delete this block and the "windows_beta_only"
        # registry key so the tool always registers on Windows again.
        if (
            meta.get("windows_beta_only")
            and not config.IS_UNIX
            and not config.ENABLE_WINDOWS_DATA_INFO
        ):
            continue
        eligible_profiles = {"all", "unsafe"} if profile == "unsafe" else {profile}
        if not eligible_profiles.intersection(meta["profiles"]):
            continue
        is_tool_enabled = getattr(config, "is_tool_enabled", None)
        if callable(is_tool_enabled) and not is_tool_enabled(
            "mcp",
            meta.get("config_name", name),
        ):
            continue

        tool_func: ToolFunc | None = meta.get("func")
        if tool_func is None:
            logging.warning(
                "Skipping tool '%s' because its registry entry has no callable func.",
                name,
            )
            continue
        server.tool(name=name, description=meta["description"])(tool_func)
```

</details>

**依据 8 · 源码核查**：[src/stata_mcp/api/write_dofile.py:16-26](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/api/write_dofile.py#L16-L26)

API实际写do文件，不假作MCP注册工具。

<details>
<summary>查看原文（11行）</summary>

```text
def write_dofile(
    content: str,
    encoding: str = None,
    config_file: str | Path | None = None,
) -> str:
    """Write Stata code to a do-file and return the generated path."""
    runtime = create_runtime_context(config_file=config_file)
    file_path = runtime.dofile_base_path / f"{datetime.now().strftime('%Y%m%d%H%M%S%f')}.do"
    target_encoding = encoding or "utf-8"
    file_path.write_text(content, encoding=target_encoding)
    return file_path.as_posix()
```

</details>

**依据 9 · 源码核查**：[plugins/stata-toolbox/skills/stata-skill/SKILL.md:137-150](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/plugins/stata-toolbox/skills/stata-skill/SKILL.md#L137-L150)

现有操作/导出默认不等模型设定正确。

<details>
<summary>查看原文（14行）</summary>

```text
### 6. Export Tables and Figures → Output Defaults

When the user has NOT specified how an output should be produced, apply these
presets — do not ask, do not invent alternatives. An explicit user request
always overrides them.

| Output | Default | Detailed example |
|---|---|---|
| Regression | `reghdfe` with fixed effects in `absorb()` and `vce(cluster <id>)` at the treatment/assignment level; never `regress` when fixed effects are involved, never reflex `, robust` | `@examples/esttab-senior-guidance.md` (setup section also covers `reghdfe`/`ftools` installation) |
| Regression tables | `esttab` (from `estout`), `.tex` with `label booktabs fragment` for papers, `.rtf`/`.csv` for quick sharing | `@examples/esttab-senior-guidance.md` |
| Figures | `graph export name.png, width(2000) replace`; PDF only for LaTeX papers | `@examples/graph-export-guidance.md` |

Package availability: `reghdfe` (+ `ftools`) and `estout` may not be installed.
Check with `help(cmd=...)`; if missing, use `ado_package_install` per section 3
```

</details>

#### 缺口

- 未运行Stata/客户端/发行包，未独立验证真实研究需求与跨客户端兼容。
  **影响**：只能判断已实现工具入口与边界，不能以README“stable”或MCP协议成功许研究自主完成和广泛采用。
  **进一步探讨**：用匹配版本/合法本地Stata和匿名副本，在当前客户端核工具清单/一条已知结果do任务，再对照手工Stata总投入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从do工具到Stata再返回日志/审计的链条是什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

默认IS_ASYNC_DO=false，工具指向同步函数；开Beta可选async并有每事件循环并发semaphore。本题闭合同步Unix代表链，并核async同样使用审计快照/真实子进程，不外推全平台所有细节。MCP _prepare先验证允许根和命令，构StataDo，execute_dofile先建/复用run并snapshot_dofile：读源字节SHA-256存objects/<hash>.do，再返回该快照路径作为execution_path；不是只记原文件名。真实Unix Popen([STATA_CLI],shell=False,cwd)后communicate发送日志开关、do快照、close/clear/exit，进程非零报错、finally清理。async也是create_subprocess_exec并发送do快照，不是异步只建队列。

正常执行回text/可选smcl路径，audit记录run_id/来源snapshot与日志等artifacts、completed/failed/timeout等生命周期。MCP默认read_log_when_error=false不自动返回全文；开时读取日志用r(数字)正则决定是否提示Stata return-code error，非完整统计错误/识别检验。直接进程正常退出与“Dofile executed successfully”日志不能替代do内部所有问题或研究结论；调用者须读日志及成果。MCP read_log解析realpath并限制artifact根/额外允许根，再读text或Beta结构化格式；不把API/CLI各入口视为完全同一边界。

审计Skill已有exact run_id链接、完整SHA核验与缺终态只作调查线索的规则；validate_audit实际调用validate_snapshots、查对象并算全hash。它证明保存对象和记录一致等证据属性，不证明原始数据/ado环境/模型设定正确、结果因果成立或人已接受。本次没有执行该审计脚本/目标。

| 效果 | 已核实现 | 不足以推出 |
|---|---|---|
| 来源留存 | 真执行快照路径/SHA/run关联 | 所有依赖/数据同版本或guard与快照同字节验证已全审 |
| 执行回显 | 真Stata进程、日志路径与部分错误 | 命令/统计/业务全部正确 |
| 证据检查 | audit snapshot全SHA校验/生命周期链接 | 研究识别/模型质量或节时 |

#### 证据与依据

**依据 1 · 源码核查**：[src/stata_mcp/config.py:1040-1047](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/config.py#L1040-L1047)

默认同步，异步显式Beta。

```text
    def IS_ASYNC_DO(self) -> bool:
        return self._get_config_value(
            config_keys=["BETA", "IS_ASYNC_DO"],
            env_var="STATA_MCP__IS_ASYNC_DO",
            default=False,
            converter=self._to_bool,
            validator=lambda x: isinstance(x, bool),
        )
```

**依据 2 · 源码核查**：[src/stata_mcp/mcp_servers.py:573-573](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L573-L573)

实际sync/async函数选择。

```text
stata_do = _async_stata_do if getattr(config, "IS_ASYNC_DO", False) else _sync_stata_do
```

**依据 3 · 源码核查**：[src/stata_mcp/mcp_servers.py:455-488](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L455-L488)

真实prepare→StataDo→execute调用。

<details>
<summary>查看原文（34行）</summary>

```text
    with debug_step(
        "stata_do.prepare_request",
        tool="stata_do",
        attributes={"source_ref": source_reference(dofile_path)},
    ):
        request = _prepare_stata_do_request(dofile_path)
    if isinstance(request, dict):
        return request

    # Initialize Stata executor with system configuration
    from .stata import StataDo

    stata_executor = StataDo(
        stata_cli=config.STATA_CLI,  # Path to Stata executable
        log_file_path=config.STATA_MCP_FOLDER.LOG,  # Directory for log files
        is_unix=config.IS_UNIX,  # Whether the OS is Unix-like
        cwd=config.WORKING_DIR,
        monitors=request.monitors,
    )

    # Execute the do-file and get log file path
    logging.info("Try to running dofile.")

    from .core.types import RAMLimitExceededError

    try:
        with debug_step("stata_do.execution", tool="stata_do"):
            log_file_path_mapping: Dict[str, Path] = stata_executor.execute_dofile(
                request.dofile_path,
                log_file_name,
                is_replace_log,
                enable_smcl,
                timeout=timeout,
            )
```

</details>

**依据 4 · 源码核查**：[src/stata_mcp/stata/stata_do/do.py:101-174](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/stata/stata_do/do.py#L101-L174)

真实执行快照到平台分支与审计终态。

<details>
<summary>查看原文（74行）</summary>

```text
        with debug_step("stata_do.input_validation", tool="stata_do"):
            timeout = self._validate_timeout(timeout)
            nowtime = get_nowtime()
            log_name = log_file_name or nowtime
            self._validate_log_name(log_name)
            dofile_path = self._validate_dofile_path(dofile_path)
            log_file = self.generate_log_file(log_name)

        execution_path, audit_context, owns_run = self._begin_audited_execution(
            dofile_path,
            log_name,
            is_replace,
            enable_smcl,
            timeout,
        )

        try:
            with debug_step(
                "stata_do.process_execution",
                tool="stata_do",
                run_id=audit_context.run.run_id,
                attributes={"mode": "sync", "platform": "unix" if self.is_unix else "windows"},
            ):
                if self.is_unix:
                    if self.IS_MONITOR:
                        result = self._execute_unix_like_with_monitors(
                            execution_path,
                            log_name,
                            is_replace,
                            enable_smcl,
                            timeout,
                        )
                    else:
                        result = self._execute_unix_like(
                            execution_path,
                            log_name,
                            is_replace,
                            enable_smcl,
                            timeout,
                        )
                else:
                    if self.IS_MONITOR:
                        self._execute_windows_with_monitors(
                            execution_path,
                            log_file,
                            is_replace,
                            timeout,
                        )
                    else:
                        self._execute_windows(
                            execution_path,
                            log_file,
                            is_replace,
                            timeout,
                        )
                    result = {"text": log_file}
        except BaseException as error:
            with debug_step(
                "stata_do.audit_finalize",
                tool="stata_do",
                run_id=audit_context.run.run_id,
                attributes={"outcome": "failed"},
            ):
                self._finish_audited_failure(audit_context, owns_run, error)
            raise

        with debug_step(
            "stata_do.audit_finalize",
            tool="stata_do",
            run_id=audit_context.run.run_id,
            attributes={"outcome": "completed"},
        ):
            self._finish_audited_success(audit_context, owns_run, result)
        return result
```

</details>

**依据 5 · 源码核查**：[src/stata_mcp/stata/stata_do/do.py:209-241](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/stata/stata_do/do.py#L209-L241)

snapshot路径真正用于execution。

<details>
<summary>查看原文（33行）</summary>

```text

        assert audit_context is not None
        try:
            with debug_step(
                "stata_do.snapshot",
                tool="stata_do",
                run_id=audit_context.run.run_id,
            ):
                snapshot = audit_context.store.snapshot_dofile(
                    audit_context.run,
                    dofile_path,
                )
        except BaseException as error:
            if owns_run:
                audit_context.store.finish_run(
                    audit_context.run,
                    event="failed",
                    error={
                        "type": type(error).__name__,
                        "message": str(error),
                        "phase": "snapshot",
                    },
                )
            raise

        audit_context.artifacts.update(
            {
                "snapshot_path": snapshot.path.as_posix(),
                "snapshot_sha256": snapshot.sha256,
                "snapshot_reused": snapshot.reused,
            }
        )
        return snapshot.path, audit_context, owns_run
```

</details>

**依据 6 · 源码核查**：[src/stata_mcp/audit/store.py:146-173](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/audit/store.py#L146-L173)

真实源字节SHA/对象存储与元数据。

<details>
<summary>查看原文（28行）</summary>

```text
    def snapshot_dofile(self, run: AuditRun, dofile_path: Path) -> DofileSnapshot:
        """Store exact do-file bytes and append one metadata record."""
        resolved_path = Path(dofile_path).resolve()
        source_bytes = resolved_path.read_bytes()
        full_hash = hashlib.sha256(source_bytes).hexdigest()

        self._ensure_directories()
        target_path, reused = self._write_or_reuse_snapshot(
            self.snapshot_objects_path / f"{full_hash}.do",
            source_bytes,
            full_hash,
        )
        snapshot = DofileSnapshot(
            path=target_path,
            sha256=full_hash,
            size_bytes=len(source_bytes),
            reused=reused,
        )
        self._append_jsonl(
            self.snapshot_path / "metadata.jsonl",
            {
                "schema_version": SCHEMA_VERSION,
                "run_id": run.run_id,
                "tool": run.tool,
                "created_at": run.started_at,
                "original_path": resolved_path.as_posix(),
                "original_name": resolved_path.name,
                "snapshot_path": target_path.resolve().as_posix(),
```

</details>

**依据 7 · 源码核查**：[src/stata_mcp/stata/stata_do/do.py:452-497](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/stata/stata_do/do.py#L452-L497)

Popen/do快照/退出/错误与finally。

<details>
<summary>查看原文（46行）</summary>

```text
        # Get environment with terminal size settings
        env = self.set_fake_terminal_size_env()

        logging.info("Launching Stata %s in cwd %s", self.STATA_CLI, self.cwd)
        proc = subprocess.Popen(
            [self.STATA_CLI],  # Launch the Stata CLI
            stdin=subprocess.PIPE,  # Prepare to send commands
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=False,  # Direct execution, subprocess handles path spaces safely
            env=env,  # Use environment with terminal size settings
            cwd=self.cwd  # Set cwd for more friendly control output
        )

        try:
            # Execute commands sequentially in Stata
            log_file = self.generate_log_file(log_name)
            smcl_file = self.generate_log_file(log_name, 'smcl')

            commands = f"""
            capture log close
            {self.generate_log_command(log_file, is_replace)}
            {self.generate_log_command(smcl_file, is_replace, 'smcl') if enable_smcl else ''}
            do "{dofile_path}"
            log close _all
            clear
            exit, STATA
            """
            _, stderr = proc.communicate(input=commands, timeout=timeout)

            if proc.returncode != 0:
                logging.error(f"Stata execution failed: {stderr}")
                raise RuntimeError(f"Something went wrong: {stderr}")
            else:
                logging.info(f"Stata execution completed successfully. Log file: {log_file}")

            log_path_mapping = {"text": log_file}
            if enable_smcl:
                log_path_mapping["smcl"] = smcl_file
            return log_path_mapping
        except subprocess.TimeoutExpired as error:
            logging.warning(f"Stata execution timed out after {timeout:g} seconds")
            raise self._timeout_error(timeout) from error
        finally:
            self._cleanup_process(proc)
```

</details>

**依据 8 · 源码核查**：[src/stata_mcp/stata/stata_do/async_do.py:49-86](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/stata/stata_do/async_do.py#L49-L86)

async复用快照并分发执行。

<details>
<summary>查看原文（38行）</summary>

```text
        """
        if self.IS_MONITOR or not self.is_unix:
            return await asyncio.to_thread(
                self.execute_dofile,
                dofile_path,
                log_file_name,
                is_replace,
                enable_smcl,
                timeout,
            )

        with debug_step("stata_do.input_validation", tool="stata_do"):
            timeout = self._validate_timeout(timeout)
            log_name = log_file_name or self._generate_default_log_name()
            self._validate_log_name(log_name)
            validated_dofile_path = self._validate_dofile_path(dofile_path)

        execution_path, audit_context, owns_run = self._begin_audited_execution(
            validated_dofile_path,
            log_name,
            is_replace,
            enable_smcl,
            timeout,
        )
        try:
            with debug_step(
                "stata_do.process_execution",
                tool="stata_do",
                run_id=audit_context.run.run_id,
                attributes={"mode": "async", "platform": "unix"},
            ):
                result = await self._execute_unix_like_async(
                    execution_path,
                    log_name,
                    is_replace,
                    enable_smcl,
                    timeout,
                )
```

</details>

**依据 9 · 源码核查**：[src/stata_mcp/stata/stata_do/async_do.py:164-192](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/stata/stata_do/async_do.py#L164-L192)

真实async子进程和do命令。

<details>
<summary>查看原文（29行）</summary>

```text
        """Execute Stata on macOS/Linux systems using asyncio subprocesses."""
        env = self.set_fake_terminal_size_env()
        logging.info("Launching Stata asynchronously: %s", self.STATA_CLI)
        proc = await asyncio.create_subprocess_exec(
            self.STATA_CLI,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=env,
            cwd=self.cwd,
        )

        try:
            log_file = self.generate_log_file(log_name)
            smcl_file = self.generate_log_file(log_name, 'smcl')
            commands = f"""
            capture log close
            {self.generate_log_command(log_file, is_replace)}
            {self.generate_log_command(smcl_file, is_replace, 'smcl') if enable_smcl else ''}
            do "{dofile_path}"
            log close _all
            clear
            exit, STATA
            """

            _, stderr = await asyncio.wait_for(
                proc.communicate(input=commands.encode("utf-8")),
                timeout=timeout,
            )
```

</details>

**依据 10 · 源码核查**：[src/stata_mcp/mcp_servers.py:368-399](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L368-L399)

默认路径和可选错误日志的格式边界。

<details>
<summary>查看原文（32行）</summary>

```text
def _format_stata_do_result(
    log_file_path_mapping: Dict[str, Path],
    read_log_when_error: bool,
    enable_smcl: bool,
    stata_executor: Any,
    text_log: str,
) -> Dict[str, Any]:
    result: Dict[str, Any] = {
        "log_file_path": {
            k: v.as_posix()  # avoiding issues with some AI clients that may not recognize Path objects
            for k, v in log_file_path_mapping.items()
        },
    }

    # Return log content based on user preference
    if read_log_when_error:
        text_content = stata_executor.read_log(text_log)
        if not _has_stata_error(text_content):
            text_content = (
                "There is no Stata return-code error in this execution. "
                "If you want to view the full log, use the read_log tool."
            )

        log_content = {"text": text_content}
        if enable_smcl:
            log_content["smcl"] = (
                "Generally, text log is sufficient."
                "If need to read smcl log, please use `mcp__stata-mcp__read_log` tool."
            )
        result["log_content"] = log_content

    return result
```

</details>

**依据 11 · 源码核查**：[src/stata_mcp/mcp_servers.py:908-910](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L908-L910)

r(n)只是正则。

```text
def _has_stata_error(content: str) -> bool:
    """Return True when the text log contains a Stata return code pattern like r(198)."""
    return re.search(r"r\(\d+\)", content) is not None
```

**依据 12 · 源码核查**：[src/stata_mcp/mcp_servers.py:826-868](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L826-L868)

MCP read_log真实允许根/解析分支。

<details>
<summary>查看原文（43行）</summary>

```text
    path = Path(file_path).resolve()  # Resolve to handle symlinks and ..

    # Security check: ensure the file is within the allowed directory
    allowed_dirs = [
        config.STATA_MCP_FOLDER.path.resolve(),
        *(
            allowed_dir.resolve()
            for allowed_dir in getattr(config, "ADDITIONAL_ALLOWED_DIRS", ())
        ),
    ]
    if not _is_within_allowed_directories(path, allowed_dirs):
        # Log security violation for audit purposes.
        # If this security warning appears, it may indicate that the current model has been compromised/poisoned.
        logging.warning(
            "[SECURITY VIOLATION] Attempted to access file outside allowed directory."
        )
        record_security_event(
            decision="blocked",
            stage="read_log_boundary",
            risk_type="outside_allowed_directories",
            source_path=path,
            executed=False,
        )
        raise PermissionError(
            "Access denied: File is outside the allowed directory. "
            "read_file can only read files within the stata-mcp-folder."
        )

    if not path.exists():
        raise FileNotFoundError(f"The file at {file_path} does not exist.")

    if config.ENABLE_STRUCTURED_LOG:
        from .stata import StataLog

        loger = StataLog.from_path(file_path, encoding=encoding)
        if output_format not in ["full", "core", "dict"]:
            raise ValueError(f"Invalid output_format: {output_format}")
        elif output_format == "full":
            return _trim_lines(loger.read_plain_text(), lines)
        elif output_format == "core":
            return _trim_lines(loger.read_without_framework(), lines)
        elif output_format == "dict":
            dict_data = loger.read_as_dict()
```

</details>

**依据 13 · 源码核查**：[plugins/stata-toolbox/skills/stata-audit/SKILL.md:37-50](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/plugins/stata-toolbox/skills/stata-audit/SKILL.md#L37-L50)

现有run_id/SHA/缺终态和元数据边界规则。

<details>
<summary>查看原文（14行）</summary>

```text
- Join lifecycle records with exact `run_id`, not filename or time proximity.
- Treat `event == "blocked"` with `executed == false` as a prevented call. A
  normal blocked call is security evidence, not a script failure.
- Follow `security_event_ids` to `audit/security.jsonl` and report missing or
  inconsistent links.
- Verify snapshot bytes against the complete recorded SHA-256. The first eight
  characters are display-only.
- Treat missing terminal events as investigation leads, not proof that a tool
  executed or failed.
- Treat client name and version as self-reported metadata, not verified user or
  agent identity.
- Keep full paths masked unless the user explicitly needs them. The reporting
  scripts support `--show-paths` for that case.
- Never edit, sort, truncate, rotate, replay, or repair evidence in place.
```

</details>

**依据 14 · 源码核查**：[plugins/stata-toolbox/skills/stata-audit/scripts/validate_audit.py:156-201](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/plugins/stata-toolbox/skills/stata-audit/scripts/validate_audit.py#L156-L201)

真实snapshot对象存在/全SHA检查。

<details>
<summary>查看原文（46行）</summary>

```text
def validate_snapshots(bundle: Any, runs: list[dict[str, Any]]) -> list[AuditIssue]:
    """Hash snapshot objects and check expected run coverage."""
    issues: list[AuditIssue] = []
    snapshots_by_run: dict[str, list[Any]] = {}
    for record in bundle.snapshot_records:
        run_id = record.payload.get("run_id")
        if isinstance(run_id, str):
            snapshots_by_run.setdefault(run_id, []).append(record)
        expected_hash = record.payload.get("sha256")
        if not isinstance(expected_hash, str) or len(expected_hash) != 64:
            issues.append(
                AuditIssue(
                    "error",
                    "snapshot_hash_invalid",
                    "Snapshot metadata has no valid full SHA-256 digest.",
                    file=record.relative_file,
                    line=record.line_number,
                    run_id=run_id if isinstance(run_id, str) else None,
                )
            )
            continue
        object_path = find_snapshot_object(bundle.root, record.payload)
        if object_path is None:
            issues.append(
                AuditIssue(
                    "error",
                    "snapshot_object_missing",
                    f"Snapshot object not found for SHA-256 {expected_hash}.",
                    file=record.relative_file,
                    line=record.line_number,
                    run_id=run_id if isinstance(run_id, str) else None,
                )
            )
            continue
        actual_hash = sha256_file(object_path)
        if actual_hash != expected_hash:
            issues.append(
                AuditIssue(
                    "error",
                    "snapshot_hash_mismatch",
                    f"Snapshot bytes do not match recorded SHA-256: {object_path}",
                    file=record.relative_file,
                    line=record.line_number,
                    run_id=run_id if isinstance(run_id, str) else None,
                )
            )
```

</details>

**依据 15 · 源码核查**：[plugins/stata-toolbox/skills/stata-audit/scripts/validate_audit.py:266-272](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/plugins/stata-toolbox/skills/stata-audit/scripts/validate_audit.py#L266-L272)

validator实际调用快照检查，不只未用helper。

```text
    issues = [
        *bundle.issues,
        *run_issues,
        *timestamp_issues,
        *validate_security_links(bundle, runs),
        *validate_snapshots(bundle, runs),
    ]
```

#### 缺口

- 没有实跑已知结果/错误do、完整嵌套依赖/并发改源与审计SDK所有终态验证。
  **影响**：工具与证据链存在，但不能许某研究可复现/正确或把所有error-free进程当有效分析。
  **进一步探讨**：匿名副本上预设已知统计答案，注入do内部错误/超时/缺日志与快照改字节，分别核接口结果、审计与研究指标；不要在真数据上试破坏性脚本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · guard与安装确认、元数据读取的真实权限边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

MCP do入口将路径resolve后要求在DO/WORKING_DIR/额外允许根内，先独立PackageManagementGuard，再在IS_GUARD=true时GuardValidator分析危险模式、宏展开/解析诊断，失败返回含“not executed”的错误材料。guard默认开启，可配置关闭；不能因此说命令guard是不可绕过的OS隔离。data-loading path auditor又由ENABLE_DATA_COMMAND_PATH_GUARD控制，默认false；.do文件位置受限不等所有Stata数据读写都限相同目录，既有ado/native扩展等也不能据静态规则许安全。guard读原路径、执行快照另生成，二者同字节/并发修改是否闭合本轮未全审，不称已发现或复现越过。

安装实际与工具说明/Skill不一致。默认all不暴露ado_package_install，unsafe才可能注册，工具开关还可禁；一旦进入MCP函数，ctx.elicit已停用且ctx未使用，委托Python API。API验证包名/来源/GitHub精确allowlist，Unix调用installer时自动confirm=True；SSC安装器require_ado_install_confirmation仅检查该bool，随后controller.run→sendline真正执行安装，Windows另写do走allow_package_management。所以服务器内没有本次独立人类批准事实，不能把registry“per-call user confirmation”或Skill“MCP会询问”当现成审批保障；不推出所有宿主也没有外层审批，更不把任意GitHub名字allowlist当代码审查。

get_data_info真实MCP调用API带tool_context=mcp，按路径/URL auditor处理，再选数据handler初始化并取info；CSV路径确经pandas读取而非Stata回归。STRICT_DATA_INFO_LOCAL_BOUNDARY及URL guard默认false，不能从“security-first”推默认只读允许工作区/只取可信URL。返回概览/变量/可选head会使数据值进入宿主工具上下文，本地引擎不保证模型服务看不到。初试用匿名本地副本，限制列/样本，不开unsafe，不主动给远端URL。

#### 证据与依据

**依据 1 · 源码核查**：[src/stata_mcp/mcp_servers.py:212-258](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L212-L258)

MCP do真实path resolve/根检查/读取。

<details>
<summary>查看原文（47行）</summary>

```text
def _prepare_stata_do_request(dofile_path: str) -> Dict[str, Any] | _StataDoRequest:
    """Validate a do-file request and build shared execution inputs."""
    # Convert dofile_path from str to Path
    try:
        dofile_path = Path(dofile_path)
        if not dofile_path.exists():
            return {"error": f"Dofile {dofile_path} does not exist"}
    except Exception as e:
        return {"error": f"Could not recognize dofile_path as pathlib.Path object: {e}"}

    dofile_path_resolved = dofile_path.resolve()
    candidate_allowed_dirs = [
        config.STATA_MCP_FOLDER.DO,
        config.WORKING_DIR,
        *getattr(config, "ADDITIONAL_ALLOWED_DIRS", ()),
    ]
    allowed_dirs: List[Path] = []
    for candidate_dir in candidate_allowed_dirs:
        if candidate_dir.exists():
            allowed_dirs.append(candidate_dir.resolve())
        else:
            logging.warning(
                "Skip missing allowed directory for dofile execution boundary check."
            )
    is_allowed = _is_within_allowed_directories(dofile_path_resolved, allowed_dirs)
    if not is_allowed:
        logging.warning(
            "[SECURITY VIOLATION] Attempted to execute dofile outside allowed directories."
        )
        record_security_event(
            decision="blocked",
            stage="path_boundary",
            risk_type="outside_allowed_directories",
            source_path=dofile_path_resolved,
            executed=False,
        )
        return {
            "error": f"Access denied: Dofile '{dofile_path}' is outside allowed directories.",
            "allowed_directories": [d.as_posix() for d in allowed_dirs],
        }

    try:
        with open(dofile_path, "r", encoding="utf-8") as f:
            dofile_content = f.read()
    except Exception as e:
        logging.error("Failed to read dofile for security check.")
        return {"error": f"Failed to read dofile for security check: {str(e)}"}
```

</details>

**依据 2 · 源码核查**：[src/stata_mcp/mcp_servers.py:260-309](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L260-L309)

独立包管理guard、条件一般guard及拒绝记录。

<details>
<summary>查看原文（50行）</summary>

```text
    from .guard import PackageManagementGuardValidator

    package_report = PackageManagementGuardValidator().validate(dofile_content)
    if not package_report.is_safe:
        record_security_event(
            decision="blocked",
            stage="package_management_guard",
            risk_type="package_management",
            source_path=dofile_path_resolved,
            source_sha256=hashlib.sha256(
                dofile_path_resolved.read_bytes()
            ).hexdigest(),
            findings=_audit_security_findings(package_report),
            executed=False,
        )
        warning_msg = "⚠️  Security warning: Package-management commands detected:\n"
        for item in package_report.dangerous_items:
            warning_msg += f"  - Line {item.line}: {item.type} '{item.content}'\n"
        return {
            "action": "Security check, dofile not executed",
            "warning": warning_msg,
            "suggesting": (
                "Third-party package management must use the controlled "
                "ado_package_install interface."
            ),
        }

    # Security check: validate dofile before execution
    if config.IS_GUARD:
        from .guard import GuardValidator

        # Config guard validator (platform-independent)
        guard_validator = (
            GuardValidator()
        )  # TODO: It may be make an error for windows user

        # Perform security validation
        report = guard_validator.validate(dofile_content, config=config)

        if not report.is_safe:
            record_security_event(
                decision="blocked",
                stage="guard",
                risk_type="dangerous_command",
                source_path=dofile_path_resolved,
                source_sha256=hashlib.sha256(
                    dofile_path_resolved.read_bytes()
                ).hexdigest(),
                findings=_audit_security_findings(report),
                executed=False,
```

</details>

**依据 3 · 源码核查**：[src/stata_mcp/config.py:1160-1167](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/config.py#L1160-L1167)

一般guard默认true。

```text
    def IS_GUARD(self) -> bool:
        return self._get_config_value(
            config_keys=["SECURITY", "IS_GUARD"],
            env_var="STATA_MCP__IS_GUARD",
            default=True,
            converter=self._to_bool,
            validator=lambda x: isinstance(x, bool),
        )
```

**依据 4 · 源码核查**：[src/stata_mcp/guard/validator.py:236-281](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/guard/validator.py#L236-L281)

宏/解析与条件数据path auditor。

<details>
<summary>查看原文（46行）</summary>

```text
        original_executable_lines = self._iter_executable_lines(code.split("\n"))
        dangerous_local_names = self._collect_dangerous_local_names(
            original_executable_lines
        )
        for line_num, line in original_executable_lines:
            stripped_line = line.strip()
            if (
                not stripped_line
                or stripped_line.startswith("*")
                or stripped_line.startswith("//")
            ):
                continue
            cleaned_line = self._strip_prefixes(stripped_line, self.stata_prefixes)
            dangerous_items.extend(
                self._check_macro_expansion(
                    cleaned_line, line_num, dangerous_local_names
                )
            )
            dangerous_items.extend(
                self._check_dangerous_patterns(cleaned_line, line_num)
            )

        expansion_result = expand_code_for_security(code)
        if expansion_result.requires_global_fail_closed:
            for diagnostic in expansion_result.diagnostics:
                if not diagnostic.security_relevant or diagnostic.scope != "global":
                    continue
                dangerous_items.append(
                    RiskItem(
                        type="parse",
                        content=diagnostic.code,
                        line=diagnostic.line,
                    )
                )

        lines = expansion_result.expanded_code.split("\n")
        executable_lines = self._iter_executable_lines(lines)

        data_path_auditor = None
        if config is not None and getattr(
            config, "ENABLE_DATA_COMMAND_PATH_GUARD", False
        ):
            data_path_auditor = DataPathAuditor(
                working_dir=config.WORKING_DIR,
                strict_local_boundary=config.STRICT_DATA_INFO_LOCAL_BOUNDARY,
                enable_url_guard=config.ENABLE_DATA_INFO_URL_GUARD,
```

</details>

**依据 5 · 源码核查**：[src/stata_mcp/guard/validator.py:330-350](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/guard/validator.py#L330-L350)

data路径检查与真实is_safe聚合。

<details>
<summary>查看原文（21行）</summary>

```text
        # Check data-loading command paths when the guard is enabled.
        if data_path_auditor is not None:
            for command in expansion_result.commands:
                dangerous_items.extend(self._check_context_mutation_command(command))
                dangerous_items.extend(
                    self._check_data_command_path(command, data_path_auditor)
                )

        # Generate report
        is_safe = len(dangerous_items) == 0
        if not is_safe:
            item_summary = ", ".join(
                f"line {item.line}:{item.type}" for item in dangerous_items
            )
            logger.warning(
                "[SECURITY VIOLATION] Guard blocked dangerous dofile; items=[%s]",
                item_summary,
            )
        else:
            logger.debug("Guard validation passed with no dangerous items")
        return SecurityReport(is_safe=is_safe, dangerous_items=dangerous_items)
```

</details>

**依据 6 · 源码核查**：[src/stata_mcp/config.py:1200-1207](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/config.py#L1200-L1207)

数据命令路径guard默认false。

```text
    @cached_property
    def ENABLE_DATA_COMMAND_PATH_GUARD(self) -> bool:
        return self._get_config_value(
            config_keys=["SECURITY", "enable_data_command_path_guard"],
            env_var="STATA_MCP__ENABLE_DATA_COMMAND_PATH_GUARD",
            default=False,
            converter=self._to_bool,
            validator=lambda x: isinstance(x, bool),
```

**依据 7 · 源码核查**：[src/stata_mcp/mcp_servers.py:616-629](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L616-L629)

MCP安装停用elicitation/ctx未用→API。

<details>
<summary>查看原文（14行）</summary>

```text
    from .api.ado_install import ado_package_install as api_ado_package_install

    # NOTE: ctx.elicit is disabled because many MCP clients do not support
    # interactive approval. The caller is responsible for ensuring the
    # installation request is trusted.
    _ = ctx

    return api_ado_package_install(
        package=package,
        source=source,
        is_replace=is_replace,
        package_source_from=package_source_from,
        config_file=config.config_file,
    )
```

</details>

**依据 8 · 源码核查**：[plugins/stata-toolbox/skills/stata-skill/SKILL.md:83-90](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/plugins/stata-toolbox/skills/stata-skill/SKILL.md#L83-L90)

Skill声称MCP逐次询问，与实际callee区分。

```text
**Authorization and validation:** SSC and net package names may contain only
ASCII letters and numbers. GitHub repositories must use `owner/repository`
format and match the exact repository allowlist.
Unknown sources, local paths, IP hosts, credentials, queries, fragments, and
non-default ports are rejected. The MCP client will ask the user to approve the
exact request during the tool call; do not attempt to bypass or pre-answer it.
The Python API does not require caller confirmation. The CLI prompts unless
`-y` or `--yes` is supplied.
```

**依据 9 · 源码核查**：[src/stata_mcp/api/ado_install.py:42-67](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/api/ado_install.py#L42-L67)

参数/allowlist验证，自动confirm=True调用。

<details>
<summary>查看原文（26行）</summary>

```text
    config = Config(config_file=config_file)
    package, source, package_source_from = validate_ado_install_request(
        package,
        source,
        package_source_from,
        allowed_github_repositories=(
            config.ADO_INSTALL_ALLOWED_GITHUB_REPOSITORIES
        ),
    )
    runtime = create_runtime_context(config_file=config_file, require_stata=True)

    logging.info("Installing ado package %s from %s", package, source)

    if runtime.is_unix:
        installer_cls = SOURCE_MAPPING[source]
        install_args = [package, package_source_from] if source == "net" else [package]
        install_kwargs = {"confirm": True}
        if source == "github":
            install_kwargs["allowed_repositories"] = (
                config.ADO_INSTALL_ALLOWED_GITHUB_REPOSITORIES
            )
        install_message = installer_cls(
            runtime.stata_cli,
            is_replace,
            timeout=timeout,
        ).install(*install_args, **install_kwargs)
```

</details>

**依据 10 · 源码核查**：[src/stata_mcp/api/ado_install.py:78-105](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/api/ado_install.py#L78-L105)

Windows写do/执行与日志判断。

<details>
<summary>查看原文（28行）</summary>

```text
    options = []
    if is_replace:
        options.append("replace")
    if source == "net":
        options.append(f"from({package_source_from})")
    option_text = f", {' '.join(options)}" if options else ""
    command = f"{source} install {package}{option_text}"
    dofile_path = write_dofile(command, config_file=config_file)
    result = _stata_do(
        dofile_path,
        read_log_when_error=False,
        config_file=config_file,
        allow_package_management=True,
    )
    text_log_path = result.get("log_file_path", {}).get("text")
    if not text_log_path:
        return (
            "Installation State: False\n"
            f"Error: Stata did not produce an installation log. Details: {result}"
        )

    log_content = read_log(
        text_log_path,
        output_format="core",
        config_file=config_file,
    )
    installer_cls = SOURCE_MAPPING[source]
    is_installed = installer_cls.check_install(log_content)
```

</details>

**依据 11 · 源码核查**：[src/stata_mcp/stata/builtin_tools/ado_install/ssc_install.py:14-24](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/stata/builtin_tools/ado_install/ssc_install.py#L14-L24)

confirmation bool到真实安装runner。

<details>
<summary>查看原文（11行）</summary>

```text
class SSC_Install(AdoInstallBase):
    def install(
        self,
        package: str,
        *,
        confirm: bool = False,
    ) -> str:
        require_ado_install_confirmation(confirm)
        package = validate_ado_package_name(package, source="ssc")
        install_command = f"ssc install {package}{self.REPLACE_MESSAGE}"
        runner_result = self._run_install_command(install_command, source="ssc", package=package)
```

</details>

**依据 12 · 源码核查**：[src/stata_mcp/guard/input_validation.py:76-86](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/guard/input_validation.py#L76-L86)

确认helper仅检查True。

<details>
<summary>查看原文（11行）</summary>

```text
def require_ado_install_confirmation(confirmed: bool) -> None:
    """Require an explicit acknowledgement before installing third-party code."""
    if confirmed is not True:
        logger.warning(
            "[SECURITY VIOLATION] Rejected ado install request: %s",
            "explicit confirmation was not provided",
        )
        raise PermissionError(
            "Ado package installation executes third-party code. "
            "Set confirm=True only after the user explicitly approves the "
            "package and source."
```

</details>

**依据 13 · 源码核查**：[src/stata_mcp/stata/builtin_tools/ado_install/base.py:71-83](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/stata/builtin_tools/ado_install/base.py#L71-L83)

真实controller.run副作用callee。

<details>
<summary>查看原文（13行）</summary>

```text
    def _run_install_command(self, install_command: str, *, source: str, package: str) -> str:
        """Run an install command in Stata with lifecycle audit logging.

        The raw command (which may embed a source URL) is intentionally not
        logged; only the package name and source are recorded.
        """
        logger.info("Running Stata install command for package %s (source=%s)", package, source)
        try:
            runner_result = self.controller.run(install_command)
        except Exception as error:
            logger.error("Stata install command failed for package %s (source=%s): %s", package, source, error)
            raise
        return runner_result
```

</details>

**依据 14 · 源码核查**：[src/stata_mcp/stata/stata_controller/controller.py:104-114](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/stata/stata_controller/controller.py#L104-L114)

真实sendline/等prompt。

<details>
<summary>查看原文（11行）</summary>

```text
        if timeout is None:
            timeout = self.timeout

        self._last_error_code = None
        self._last_error_output = None

        # Send the command
        self.child.sendline(command)

        # Wait for the command to complete
        result = self._expect_prompt(timeout)
```

</details>

**依据 15 · 源码核查**：[src/stata_mcp/mcp_servers.py:733-755](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L733-L755)

实际metadata工具调用API并返回。

<details>
<summary>查看原文（23行）</summary>

```text
            request_id=request_id,
            attributes={"source_ref": source_reference(data_path)},
        ):
            result = _get_data_info_impl(
                data_path=data_path,
                vars_list=vars_list,
                encoding=encoding,
                config_file=None,
                head=head,
                tool_context="mcp",
                request_id=request_id,
            )
        log_event(
            diagnostic_logger,
            logging.INFO,
            "get_data_info.mcp_tool.completed",
            request_id,
            duration_ms=elapsed_ms(started_at),
            result_chars=len(result),
            structured_output_enabled=True,
            tool_result_utf8_bytes=utf8_size(result),
        )
        return result
```

</details>

**依据 16 · 源码核查**：[src/stata_mcp/api/get_data_info.py:85-106](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/api/get_data_info.py#L85-L106)

实际DataPathAuditor/来源分支。

<details>
<summary>查看原文（22行）</summary>

```text
        auditor = DataPathAuditor(
            working_dir=runtime.config.WORKING_DIR,
            strict_local_boundary=runtime.config.STRICT_DATA_INFO_LOCAL_BOUNDARY,
            enable_url_guard=runtime.config.ENABLE_DATA_INFO_URL_GUARD,
            allowed_url_domains=runtime.config.DATA_INFO_ALLOWED_URL_DOMAINS,
            additional_allowed_dirs=getattr(
                runtime.config,
                "ADDITIONAL_ALLOWED_DIRS",
                (),
            ),
        )

        stage_started_at = time.perf_counter()
        source_kind = "url" if auditor.is_url(data_path) else "local"
        if source_kind == "url":
            with debug_step(
                "get_data_info.path_validation",
                tool="get_data_info",
                request_id=active_request_id,
                attributes={"source_kind": source_kind, "source_ref": source_ref},
            ):
                validated_data = auditor.validate_url(data_path)
```

</details>

**依据 17 · 源码核查**：[src/stata_mcp/api/get_data_info.py:197-240](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/api/get_data_info.py#L197-L240)

handler与info实际调用。

<details>
<summary>查看原文（44行）</summary>

```text
        stage_started_at = time.perf_counter()
        with debug_step(
            "get_data_info.handler_initialization",
            tool="get_data_info",
            request_id=active_request_id,
            attributes={"suffix": data_extension},
        ):
            data_info = data_info_cls(
                resolved_data_path,
                vars_list,
                encoding=encoding,
                cache_dir=runtime.tmp_base_path,
                head=resolved_head,
                is_cache=data_info_config.is_cache,
                metrics=data_info_config.metrics,
                string_keep_number=data_info_config.string_keep_number,
                decimal_places=data_info_config.decimal_places,
                hash_length=data_info_config.hash_length,
                request_id=active_request_id,
            )
        log_event(
            logger,
            logging.DEBUG,
            "get_data_info.handler.initialized",
            active_request_id,
            duration_ms=elapsed_ms(stage_started_at),
            handler=data_info_cls.__name__,
        )

        stage_started_at = time.perf_counter()
        log_event(
            logger,
            logging.DEBUG,
            "get_data_info.info.started",
            active_request_id,
        )
        summary_started = True
        with debug_step(
            "get_data_info.info_pipeline",
            tool="get_data_info",
            request_id=active_request_id,
            attributes={"suffix": data_extension},
        ):
            data_summary = data_info.info
```

</details>

**依据 18 · 源码核查**：[src/stata_mcp/data_info/csv.py:22-52](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/data_info/csv.py#L22-L52)

CSV/pandas实际读入代表路径。

<details>
<summary>查看原文（31行）</summary>

```text
    def _read_data(self) -> pd.DataFrame:
        """
        Read CSV file into pandas DataFrame.

        Supports local files and URLs. Automatically detects header.

        Returns:
            pd.DataFrame: The data from the CSV file

        Raises:
            ValueError: If the file is not a valid CSV file
        """
        self._before_read()

        # Get data as BytesIO (handles both URL and local file)
        buffer = self.bytes_io_data

        # Check file extension
        if self.suffix.lower() not in self.supported_extensions:
            raise ValueError(f"File must have extension in {self.supported_extensions}, got: {self.suffix}")

        try:
            # Auto-detect header if not explicitly specified
            if 'header' not in self.kwargs:
                sample_kwargs = {k: v for k, v in self.kwargs.items() if k not in ['header', 'names']}

                # Create a copy for header detection
                sample_buffer = BytesIO(buffer.getvalue())

                try:
                    df_with_header = pd.read_csv(sample_buffer, nrows=10, header=0, **sample_kwargs)
```

</details>

**依据 19 · 源码核查**：[src/stata_mcp/config.py:1180-1187](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/config.py#L1180-L1187)

metadata本地严格边界默认false。

```text
    def STRICT_DATA_INFO_LOCAL_BOUNDARY(self) -> bool:
        return self._get_config_value(
            config_keys=["SECURITY", "strict_data_info_local_boundary"],
            env_var="",
            default=False,
            converter=self._to_bool,
            validator=lambda x: isinstance(x, bool),
        )
```

**依据 20 · 源码核查**：[src/stata_mcp/config.py:932-939](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/config.py#L932-L939)

metadata URL guard默认false。

```text
    def ENABLE_DATA_INFO_URL_GUARD(self) -> bool:
        return self._get_config_value(
            config_keys=["BETA", "enable_data_info_url_guard"],
            env_var="",
            default=False,
            converter=self._to_bool,
            validator=lambda x: isinstance(x, bool),
        )
```

#### 缺口

- 未全审Stata语法/宏/依赖闭包、所有URL下载与宿主审批/数据出境策略，未运行权限反例。
  **影响**：不能用于直接执行不可信do/第三方包或把工具说明当人批准；匿名样本与权限范围必须由操作者明确。
  **进一步探讨**：分别核all/unsafe实际工具清单，受控SSC包请求的宿主批准/服务器日志，匿名本地/URL边界开关与数据预览；先不在生产环境安装或执行不可信内容。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁已有条件可采用，资源与恢复退出要付什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Python/MCP环境是此入口的依赖，本地合法Stata可执行文件/许可为真正统计执行必要，不把这个要求扩大成所有Pandas元数据操作都必须调用付费Stata；未测试完全无Stata的启动配置。匹配平台尤其重要：本轮Unix执行链为代表，Windows metadata MCP有显式Beta隐藏，不以CLI或Unix存在许等价。项目声明AGPL-3.0与用户Stata授权是不同对象，本轮只记录不作法律解释。

资源保护不是默认全开：IS_MONITOR=false默认，不一定构造RAMMonitor；开启并有有效上限时监视Stata PID的RSS，超限kill该进程，不能据此许聚合子树/系统硬内存隔离或Pandas读取全受同限。timeout可为None，用户须选合适值；异步限流在选用async时生效，不等所有模式全局串行。正常/异常清理尝试TERM→5秒后KILL并wait，async也类似；没有核所有子树/所有OS退出，已写数据与外部安装无事务回滚。

默认资料根WORKING_DIR/.statamcp，可配置；含do、log、snapshot和audit，需当有研究数据/代码的工件保留管理。配置/日志有其他本机路径；server导入会调用latest-version helper，不能许只用stdio就整个过程永不联网。安装/模型宿主还各有网络与账单，未知不填0。

| 依赖/条件 | 是否必需 | 用途 | 缺失/不满足 |
|---|---|---|---|
| Python>=3.11/匹配MCP依赖 | 正常入口需 | server/CLI/工具与本地记录 | 版本/宿主不兼容须停止，不用badge替验证 |
| 合法本地Stata/CLI | 执行统计需 | 真do/help/安装相关命令 | 不等元数据必须跑Stata；许可/平台另核 |
| 可读写项目与资料目录 | 相关工具需 | 输入/日志/快照/审计 | 用副本与OS权限保全原数据，不能当事务 |
| 宿主Agent/模型服务 | 自然语言研究流程需 | 写do/决定下一步/读工具结果 | server不代替方法判断，数据/模型费由宿主决定 |

| 阶段 | 现金与资源 | 人工与时间 | 已知/未知 |
|---|---|---|---|
| 首次 | Stata已有许可/新购现金各异，Python/模型/磁盘未知 | 固定版本、Stata路径、匿名副本、核profile/guard/timeout与monitor | 不推荐无定量能力直接自动跑研究；未测工时 |
| 持续 | Stata进程、模型工具上下文、日志快照/metadata缓存 | 验样本/输出、管理证据与包环境 | 无净费用/节时实测 |
| 失败恢复 | partial输出/内存超限/日志、未知执行状态 | 查审计/日志和真实数据，备份再续，不能盲重跑覆盖 | 默认日志可replace，外部包/数据无全局回滚 |
| 退出 | .statamcp/配置/日志/装过ado与宿主配置残留 | 停server/核Stata进程，保留研究证据，再按目录/包清理 | 未核全平台卸载/子树全停，不自动删用户数据 |

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-10](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/pyproject.toml#L1-L10)

真实Python/许可声明。

<details>
<summary>查看原文（10行）</summary>

```text
[project]
name = "stata-mcp"
version = "1.25.2"
description = "MCP-for-Stata: a stable, security-first MCP server and CLI for integrating local Stata into Claude Code, Codex, OpenClaw, and other AI research workflows."
readme = "README.md"
authors = [
    { name = "Song Tan", email = "sepinetam@gmail.com" }
]
requires-python = ">=3.11"
license = { text = "AGPL-3.0" }
```

</details>

**依据 2 · 源码核查**：[src/stata_mcp/config.py:1229-1235](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/config.py#L1229-L1235)

monitor默认关闭。

```text
    def IS_MONITOR(self) -> bool:
        return self._get_config_value(
            config_keys=["MONITOR", "IS_MONITOR"],
            env_var="STATA_MCP__IS_MONITOR",
            default=False,
            converter=self._to_bool,
            validator=lambda x: isinstance(x, bool),
```

**依据 3 · 源码核查**：[src/stata_mcp/mcp_servers.py:343-354](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L343-L354)

有配置/有效RAM时才加入monitor。

<details>
<summary>查看原文（12行）</summary>

```text
            executed=True,
        )

    # Initialize monitors
    monitors = []
    if config.IS_MONITOR:
        if config.MAX_RAM_MB is not None:
            from .monitor import RAMMonitor

            monitors.append(RAMMonitor(max_ram_mb=config.MAX_RAM_MB))

    return _StataDoRequest(dofile_path=dofile_path, monitors=monitors)
```

</details>

**依据 4 · 源码核查**：[src/stata_mcp/monitor/ram_monitor.py:84-106](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/monitor/ram_monitor.py#L84-L106)

只看PID RSS并kill，无子树硬隔离证明。

<details>
<summary>查看原文（23行）</summary>

```text
                # Check RAM usage
                try:
                    # Get the process object
                    psutil_process = psutil.Process(self.process.pid)

                    # Get RAM usage in MB (RSS - Resident Set Size)
                    ram_mb = psutil_process.memory_info().rss / 1024 / 1024

                    # Check if exceeded
                    if ram_mb > self.max_ram_mb:
                        # Store the exception to be raised later
                        self._exceeded_with_error = RAMLimitExceededError(
                            ram_used_mb=ram_mb,
                            ram_limit_mb=self.max_ram_mb
                        )

                        logging.warning(
                            f"RAM limit exceeded: {ram_mb:.0f}MB > {self.max_ram_mb}MB. "
                            f"Killing Stata process (PID: {self.process.pid})"
                        )

                        # Kill the process
                        self.process.kill()
```

</details>

**依据 5 · 源码核查**：[src/stata_mcp/stata/stata_do/do.py:298-327](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/stata/stata_do/do.py#L298-L327)

TERM/等待/KILL与None timeout。

<details>
<summary>查看原文（30行）</summary>

```text
        Ensure subprocess is terminated and reaped to prevent resource leaks.

        Args:
            proc: The subprocess to clean up, or None if not created
        """
        if proc is None:
            return
        if proc.poll() is None:  # Process still running
            proc.terminate()
            try:
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                logging.warning("Stata process did not terminate; killed")
                proc.kill()
                proc.wait()

    @staticmethod
    def _validate_timeout(timeout: float | None) -> float | None:
        """Validate and normalize an optional execution timeout."""
        if timeout is None:
            return None
        if isinstance(timeout, bool) or not isinstance(timeout, (int, float)):
            raise ValueError(
                "Invalid timeout. Use a positive, finite number of seconds or None."
            )
        try:
            normalized_timeout = float(timeout)
        except OverflowError as error:
            raise ValueError(
                "Invalid timeout. Use a positive, finite number of seconds or None."
```

</details>

**依据 6 · 源码核查**：[src/stata_mcp/stata/stata_do/async_do.py:211-221](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/stata/stata_do/async_do.py#L211-L221)

async清理实际行为。

<details>
<summary>查看原文（11行）</summary>

```text
    async def _cleanup_async_process(proc: asyncio.subprocess.Process | None) -> None:
        """Ensure an asyncio subprocess is terminated and reaped."""
        if proc is None or proc.returncode is not None:
            return

        proc.terminate()
        try:
            await asyncio.wait_for(proc.wait(), timeout=5)
        except asyncio.TimeoutError:
            proc.kill()
            await proc.wait()
```

</details>

**依据 7 · 源码核查**：[src/stata_mcp/mcp_servers.py:403-413](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L403-L413)

按event-loop的async semaphore。

<details>
<summary>查看原文（11行）</summary>

```text
    """Return the per-event-loop async do-file concurrency limiter."""
    limit = getattr(config, "MAX_ASYNC_DO", 3)
    if isinstance(limit, bool) or not isinstance(limit, int) or limit <= 0:
        limit = 3
    loop = asyncio.get_running_loop()
    cached = _ASYNC_DO_SEMAPHORES.get(loop)
    if cached is None or cached[0] != limit:
        semaphore = asyncio.Semaphore(limit)
        _ASYNC_DO_SEMAPHORES[loop] = (limit, semaphore)
        return semaphore
    return cached[1]
```

</details>

**依据 8 · 源码核查**：[src/stata_mcp/config.py:1292-1304](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/config.py#L1292-L1304)

默认资料root/可配置tag。

<details>
<summary>查看原文（13行）</summary>

```text
    def STATA_MCP_FOLDER_TAG(self) -> str:
        return self._get_config_value(
            config_keys=["PROJECT", "FOLDER_TAG"],
            env_var="STATA_MCP__FOLDER_TAG",
            default=".statamcp",
            converter=self._to_str,
            validator=lambda x: isinstance(x, str),
        )

    @cached_property
    def STATA_MCP_FOLDER(self) -> StataMcpFolder:
        self._migrate_stata_mcp_folder_warning()
        return StataMcpFolder(self.WORKING_DIR / self.STATA_MCP_FOLDER_TAG)
```

</details>

**依据 9 · 源码核查**：[src/stata_mcp/mcp_servers.py:99-108](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L99-L108)

server导入调用版本helper，不等完全离线。

<details>
<summary>查看原文（10行）</summary>

```text
# version prompt
_current_version = get_current_version()

_latest_version, _latest_version_error = get_latest_version()
_version_hint = (
    (
        f"\nA newer version is available: {_latest_version} "
        f"(you are running {_current_version}). "
    )
    if _latest_version and _latest_version != _current_version
```

</details>

**依据 10 · 源码核查**：[src/stata_mcp/utils/update.py:121-140](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/utils/update.py#L121-L140)

版本获取及网络失败处理。

<details>
<summary>查看原文（20行）</summary>

```text
def get_latest_version() -> tuple[Optional[str], Optional[str]]:
    """Fetch latest version from PyPI with a user-facing error message."""
    try:
        with urlopen(PYPI_API_URL, timeout=10) as response:
            payload = json.loads(response.read())
        latest = payload["info"]["version"]
        if not isinstance(latest, str) or not latest:
            return None, "PyPI response did not include a valid version string."
        return latest, None
    except HTTPError as error:
        return None, f"PyPI request failed with HTTP {error.code}."
    except URLError as error:
        return None, f"Failed to reach PyPI: {error.reason}."
    except TimeoutError:
        return None, "Timed out while requesting latest version from PyPI."
    except json.JSONDecodeError as error:
        return None, f"Failed to parse PyPI response JSON: {error}."
    except KeyError as error:
        return None, f"PyPI response format changed, missing key: {error}."
    except Exception as error:
```

</details>

#### 缺口

- 无匹配客户端/Stata许可环境、RAM/超时/退出/全局数据清理与模型费用测量。
  **影响**：无法许低成本、无残留或跨平台全等价；已有许可/技能者的小副本任务能先控制采用成本。
  **进一步探讨**：仅合法本地受控环境跑已知答案小do，记录进程/RSS、前后文件/包、错误/退出和账单；没有净益则停扩展。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 生产方向怎样超出现有MCP/审计，如何证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可以给已有Stata研究流程补可调用执行与证据入口；不值得只重包一个“经济学Agent”就计新价值。现有MCP、do来源快照/完整SHA、run_id/lifecycle、审计validator与Skill回归/导出规范均已存在，新增同类日志/快照/使用计数不是方向。需先修正MCP逐次审批的说明与真实ctx/API路径一致；服务器自身不收人确认就明确委托宿主/操作者，不拿confirm=True当已核人同意。

未来假说限定“单个实证任务的运行条件与结果验收”：将实际执行do快照与数据版本/样本筛选、Stata/ado环境和研究者预设结果断言联结，区分执行结束、数据/规格一致、预设检验通过、研究解释待人核。与现有data_info描述/缓存和快照完整性区别在单次执行的来源/结果条件闭合；不新创统计识别方法，不自动把p值或模板回归当因果证据。缺数据/环境/方法依据必须unknown。底层guard与被执行快照是否同字节、依赖变更仍须先核，不因有hash就跳过。

最低对照用匿名/合成已知答案任务与合法Stata：正常基线、同名数据被替换、样本过滤偏差、ado环境变化、语法成功但规格错误、超时有partial输出、结果丢响应。比较手工Stata+日志、当前MCP/审计、加任务验收层，同任务/预算/独立定量评审。测错数据/规格漏检、假成功、误拒、恢复/核对分钟、总模型与计算资源/维护工时；不能只报成功运行数或hash通过率。若当前审计+人工已足够、附加层不能降错/总投入或真实用户不愿继续，则停独立插件，把审批/快照必要修复留原工程。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/stata-toolbox/skills/stata-audit/SKILL.md:17-24](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/plugins/stata-toolbox/skills/stata-audit/SKILL.md#L17-L24)

现有审计操作范围，不把再加dashboard/校验当新方向。

```text
| User need | Script | Result |
| --- | --- | --- |
| Check security blocks or warnings | `scripts/security_audit.py` | Security decisions, whether execution was prevented, risk types, and linkage state |
| Summarize project usage | `scripts/analyze_audit.py` | Neutral counts, observed period, tool mix, outcomes, snapshots, and limitations |
| Inspect recent records or one run | `scripts/inspect_audit.py` | Source-preserving records joined by exact `run_id` |
| Check evidence integrity | `scripts/validate_audit.py` | Lifecycle, timestamp, security-link, and full SHA-256 snapshot checks |
| Open an interactive view | `scripts/render_audit_html.py` | Standalone English HTML dashboard with linked ledgers and a movable time window |

```

**依据 2 · 源码核查**：[plugins/stata-toolbox/skills/stata-audit/scripts/validate_audit.py:188-201](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/plugins/stata-toolbox/skills/stata-audit/scripts/validate_audit.py#L188-L201)

完整hash核验已经存在。

<details>
<summary>查看原文（14行）</summary>

```text
            )
            continue
        actual_hash = sha256_file(object_path)
        if actual_hash != expected_hash:
            issues.append(
                AuditIssue(
                    "error",
                    "snapshot_hash_mismatch",
                    f"Snapshot bytes do not match recorded SHA-256: {object_path}",
                    file=record.relative_file,
                    line=record.line_number,
                    run_id=run_id if isinstance(run_id, str) else None,
                )
            )
```

</details>

**依据 3 · 源码核查**：[src/stata_mcp/mcp_servers.py:616-629](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/mcp_servers.py#L616-L629)

先让审批说明和实际callee一致。

<details>
<summary>查看原文（14行）</summary>

```text
    from .api.ado_install import ado_package_install as api_ado_package_install

    # NOTE: ctx.elicit is disabled because many MCP clients do not support
    # interactive approval. The caller is responsible for ensuring the
    # installation request is trusted.
    _ = ctx

    return api_ado_package_install(
        package=package,
        source=source,
        is_replace=is_replace,
        package_source_from=package_source_from,
        config_file=config.config_file,
    )
```

</details>

**依据 4 · 源码核查**：[src/stata_mcp/api/ado_install.py:55-67](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/src/stata_mcp/api/ado_install.py#L55-L67)

自动confirm不当独立人同意。

<details>
<summary>查看原文（13行）</summary>

```text
    if runtime.is_unix:
        installer_cls = SOURCE_MAPPING[source]
        install_args = [package, package_source_from] if source == "net" else [package]
        install_kwargs = {"confirm": True}
        if source == "github":
            install_kwargs["allowed_repositories"] = (
                config.ADO_INSTALL_ALLOWED_GITHUB_REPOSITORIES
            )
        install_message = installer_cls(
            runtime.stata_cli,
            is_replace,
            timeout=timeout,
        ).install(*install_args, **install_kwargs)
```

</details>

**依据 5 · 源码核查**：[plugins/stata-toolbox/skills/stata-skill/SKILL.md:137-150](https://github.com/SepineTam/mcp-for-stata/blob/1e94c3bfe82675eed8c85b18f6c9303dd92b4757/plugins/stata-toolbox/skills/stata-skill/SKILL.md#L137-L150)

现有导出/回归指南不当研究识别验收。

<details>
<summary>查看原文（14行）</summary>

```text
### 6. Export Tables and Figures → Output Defaults

When the user has NOT specified how an output should be produced, apply these
presets — do not ask, do not invent alternatives. An explicit user request
always overrides them.

| Output | Default | Detailed example |
|---|---|---|
| Regression | `reghdfe` with fixed effects in `absorb()` and `vce(cluster <id>)` at the treatment/assignment level; never `regress` when fixed effects are involved, never reflex `, robust` | `@examples/esttab-senior-guidance.md` (setup section also covers `reghdfe`/`ftools` installation) |
| Regression tables | `esttab` (from `estout`), `.tex` with `label booktabs fragment` for papers, `.rtf`/`.csv` for quick sharing | `@examples/esttab-senior-guidance.md` |
| Figures | `graph export name.png, width(2000) replace`; PDF only for LaTeX papers | `@examples/graph-export-guidance.md` |

Package availability: `reghdfe` (+ `ftools`) and `estout` may not be installed.
Check with `help(cmd=...)`; if missing, use `ado_package_install` per section 3
```

</details>

#### 缺口

- 无真实研究者对照、有效方法/数据样本及验收层净收益。
  **影响**：只支持已有许可/技能者限定任务试用，独立生产插件与商业投入仍待证，不以研究复杂度/源码规模作替代。
  **进一步探讨**：先获取已知答案任务与独立评审、设假成功/漏检/总投入门槛，达不到停止独立产品。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
