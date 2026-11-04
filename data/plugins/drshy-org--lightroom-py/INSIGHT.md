# lightroom-py

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[cb5b0d9](https://github.com/drshy-org/lightroom-py/tree/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/drshy-org/lightroom-py)
<!-- END META -->

> **功能**：通过 Python、MCP 和 DSH 接口控制 Lightroom Classic 图库及编辑。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将已有 Lightroom 操作暴露为 MCP 工具，并由 DSH 纯配置挂载。

> **主要限制**：[Q03](#research-q03) MCP 可选依赖和默认桥接路径须核对，写操作可能修改真实图库。

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
  - [Q01 · 项目为摄影工作流增加什么，与手工 Lightroom 操作有何区别？](#detail-section-11)
  - [Q02 · DSH 配置如何连接 MCP 和 Lightroom Client？](#detail-section-12)
  - [Q03 · 桥接、MCP 依赖及图库写入有哪些条件？](#detail-section-13)
  - [Q04 · 如何检验写操作预览和确认能减少误改？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望用 Agent 组织 Lightroom Classic 图库和批处理编辑的摄影用户。

用户可在 Lightroom 手工查询、编辑与导出；项目提供可编程 Agent 入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 图库查询 | 查询照片及属性 | MCP 默认连接桥接 |
| 调色和元数据 | 对选定照片写入 | 真实图库变更须备份 |
| 导出 | 将照片导出目录 | 格式、路径及结果需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH MCP 客户端 | DSH 集成需要 | 启动 stdio 服务 | 工具不加载 |
| Python 包及 MCP 可选依赖 | MCP 需要 | 进程与协议 | 缺依赖时退出 |
| Lightroom Classic、桥接服务和 token | 当前 MCP 路径需要 | 查图库与编辑 | 默认 connect 试图打开桥接 |
| 图库备份及测试副本 | 写操作建议 | 保护作品与恢复 | 误改可能造成实际损失 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份图库并检查版本和可选依赖 | 不可恢复则停止 |
| 加载 | 启动桥接及 MCP | 核真实发现与错误 |
| 试用 | 在副本核 UUID 和单项操作 | 检查目标和结果 |
| 恢复 | 若结果不符停止批量写入 | 对照备份及 Lightroom 状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Lightroom 订阅及环境费用未知 | 安装桥接和备份 | 兼容未测 |
| 持续 | 模型和计算费用未知 | 核选区、编辑和结果 | 节时未知 |
| 恢复 | 图库副本和恢复成本未知 | 对比图像及还原 | 误操作可逆性未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| MCP 工具 | 声明与客户端分发 | 宿主真实加载 |
| 图库修改 | 调用预设、设置与导出方法 | 实际效果与恢复 |
| 本地桥接 | 回环默认地址和 token 握手 | 完整安全边界 |

> **思考**：[Q03](#research-q03) MCP 可选依赖和默认桥接路径须核对，写操作可能修改真实图库。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将已有 Lightroom 操作暴露为 MCP 工具，并由 DSH 纯配置挂载。

[Q02](#research-q02) 将 MCP 工具与桥接 Client 分层，但异常文本和可选依赖需宿主验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) MCP 可选依赖和默认桥接路径须核对，写操作可能修改真实图库。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在备份图库副本上先核依赖、选区与单项操作；结果或恢复不明确时停止写入。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定源码中的 DSH 配置、MCP 分发和桥接；未安装或运行 Lightroom。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/lightroom/mcp_server.py、src/lightroom/client.py、src/lightroom/bridge/server.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根包、DSH patch、MCP 声明/分发、Client 默认桥接和握手；未全审桥接所有路由、Lua handlers 或 Adobe 兼容性。
- 下一步：隔离图库核 MCP 依赖、无桥接读取、错误传播、单图写入与恢复。

**分析版本**

- **仓库**：[drshy-org/lightroom-py](https://github.com/drshy-org/lightroom-py)
- **版本号**：0.1.0（[固定提交 cb5b0d9](https://github.com/drshy-org/lightroom-py/tree/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1)）
- **版本日期**：2026-09-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设写前绑定目标与确认可减少误改，尚未验证。

隔离图库核 MCP 依赖、无桥接读取、错误传播、单图写入与恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 2220 | — | — | 17199 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/drshy-org/lightroom-py/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/drshy-org/lightroom-py/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/drshy-org/lightroom-py/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 Lightroom MCP 装配、桥接和图库变更边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 项目为摄影工作流增加什么，与手工 Lightroom 操作有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

项目将 Lightroom Classic 的图库查询、修图参数、元数据和导出接到 Python、MCP 及 DSH。摄影师本可手工在 Lightroom 操作；这里的增量是让支持工具调用的 Agent 批量发出动作，不是替代 Lightroom 或证明修图结果更好。根仓包声明 DSH 配置入口，但具体功能由另装的 Python MCP、桥接服务和 Lightroom 插件完成，仓库固定源码不能证明已发布包版本一致。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-13](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/README.md#L1-L13)

作者描述 Lightroom 驱动与验证声明。

<details>
<summary>查看原文（13行）</summary>

```text
# lightroom-py

> **Drive Adobe Lightroom Classic from Python and Claude.** First open agent driver with verified programmatic mask creation (35.4% pixel-diff confirmed) and the AI mask compute path documented elsewhere as impossible.

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![LR Classic 15.3 verified](https://img.shields.io/badge/LR%20Classic-15.3%20verified-orange.svg)](#what-this-can-and-cannot-do)
[![Tests](https://img.shields.io/badge/tests-101%20passing-brightgreen.svg)](#development)

**62 bridge handlers · 80 CLI verbs · 101 tests · 7+ real-LR validation sessions documented in [CHANGELOG.md](CHANGELOG.md).** Unofficial, MIT, not affiliated with Adobe.

---

```

</details>

**依据 2 · 源码核查**：[package.json:1-20](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/package.json#L1-L20)

DSH 纯配置包和 bundle 声明。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "dsh-lightroom-py",
  "version": "0.1.0",
  "description": "Adobe Lightroom Classic for DeepSeek Harness (dsh) \u2014 mounts the lightroom-py MCP server as native dsh tools. Pure-config bundle inside the lightroom-py repo; the Python package comes from PyPI (pip install lightroom-py).",
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "lightroom",
    "lightroom-classic",
    "mcp",
    "photography"
  ],
  "license": "MIT",
  "type": "module",
  "files": [
    "cordis.patch.yml",
    "dsh/",
    "SKILL.md",
    "LICENSE"
  ],
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:12-20](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/cordis.patch.yml#L12-L20)

宿主挂载 MCP stdio 客户端。

```text
- insert:
    - id: mcp-lightroom-py
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: lightroom_py
        transport: stdio
        command: !!js process.env.LIGHTROOM_MCP ?? 'lightroom-mcp'
        cwd: !!js process.cwd()
        toolCallTimeoutMs: 120000
```

#### 缺口

- 未安装、运行或对照真实图片工作流
  **影响**：不能确认操作质量、节时或实际发布包一致
  **进一步探讨**：隔离图库比较手工操作、单项动作和恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 配置如何连接 MCP 和 Lightroom Client？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

bundle 将 dsh-mcp-client 配置为 stdio，默认命令 lightroom-mcp，允许环境变量覆盖并设置调用超时。固定 Python MCP 定义照片、调色和导出等工具，在 call_tool 中 dispatch 到 LightroomClient；异常被序列化为普通 TextContent 的 ERROR 文本。Server 本身是桥接入口，不证明宿主将错误文本识别为结构化失败，也未验证 Lightroom 插件运行。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:9-20](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/cordis.patch.yml#L9-L20)

stdio 命令与超时。

<details>
<summary>查看原文（12行）</summary>

```text
# Tools appear as mcp__lightroom_py__<tool> (15 tools: catalog_info, photos_list,
# develop_apply_settings, develop_apply_preset, library_export, metadata_*, ...).
# Override the executable with LIGHTROOM_MCP when it is not on PATH.
- insert:
    - id: mcp-lightroom-py
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: lightroom_py
        transport: stdio
        command: !!js process.env.LIGHTROOM_MCP ?? 'lightroom-mcp'
        cwd: !!js process.cwd()
        toolCallTimeoutMs: 120000
```

</details>

**依据 2 · 源码核查**：[src/lightroom/mcp_server.py:63-87](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/mcp_server.py#L63-L87)

工具声明示例。

<details>
<summary>查看原文（25行）</summary>

```text
    return [
        Tool(
            name="catalog_info",
            description="Info about the active Lightroom catalog: photo count, capture-time range.",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="catalog_stats",
            description="Counts of photos / folders / keywords / collections in the active catalog.",
            inputSchema={"type": "object", "properties": {}},
        ),
        Tool(
            name="photos_list",
            description="List photos with filters. Pure SQLite read; no LR required.",
            inputSchema={
                "type": "object",
                "properties": {
                    "rating_gte": {"type": "integer", "minimum": 0, "maximum": 5},
                    "rating_lte": {"type": "integer", "minimum": 0, "maximum": 5},
                    "camera": {"type": "string", "description": "Camera model substring."},
                    "lens": {"type": "string", "description": "Lens model substring."},
                    "keyword": {"type": "string"},
                    "since": {"type": "string", "description": "ISO-ish capture time."},
                    "until": {"type": "string"},
                    "limit": {"type": "integer", "default": 50},
```

</details>

**依据 3 · 源码核查**：[src/lightroom/mcp_server.py:231-255](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/mcp_server.py#L231-L255)

Client 分发与照片数据。

<details>
<summary>查看原文（25行）</summary>

```text
# Map MCP tool name → callable that invokes the right LightroomClient method.
async def _dispatch(name: str, args: dict[str, Any]) -> Any:
    async with LightroomClient.connect() as lr:
        if name == "catalog_info":
            info = await lr.catalog.info()
            return {
                "path": str(info.path),
                "photo_count": info.photo_count,
                **info.extra,
            }
        if name == "catalog_stats":
            return await lr.catalog.stats()
        if name == "photos_list":
            rows = await lr.photos.list(**args)
            return [
                {
                    "uuid": r.uuid,
                    "filename": r.filename,
                    "rating": r.rating,
                    "color_label": r.color_label,
                }
                for r in rows
            ]
        if name == "metadata_add_keywords":
            return await lr.metadata.add_keywords(
```

</details>

**依据 4 · 源码核查**：[src/lightroom/mcp_server.py:268-293](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/mcp_server.py#L268-L293)

编辑与导出调用。

<details>
<summary>查看原文（26行）</summary>

```text
        if name == "develop_apply_preset":
            return await lr.develop.apply_preset(
                args["preset"],
                folder=args.get("folder"),
                photo_uuids=args.get("photo_uuids"),
            )
        if name == "develop_apply_settings":
            return await lr.develop.apply_settings(
                args["settings"], photo_uuids=args.get("photo_uuids")
            )
        if name == "develop_reset":
            return await lr.develop.reset(photo_uuids=args.get("photo_uuids"))
        if name == "collections_list":
            return await lr.collections.list()
        if name == "collections_create":
            return await lr.collections.create(args["name"], parent=args.get("parent"))
        if name == "collections_add":
            return await lr.collections.add(args["collection"], args["photo_uuids"])
        if name == "library_export":
            return await lr.library.export(
                args["out_dir"],
                photo_uuids=args.get("photo_uuids"),
                format=args.get("format", "TIFF"),
                quality=args.get("quality", 95),
                color_space=args.get("color_space", "AdobeRGB"),
            )
```

</details>

**依据 5 · 源码核查**：[src/lightroom/mcp_server.py:297-320](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/mcp_server.py#L297-L320)

stdio 注册和异常文本。

<details>
<summary>查看原文（24行）</summary>

```text
async def serve() -> None:
    """Run the MCP server over stdio."""
    Server, stdio_server, TextContent, Tool = _require_mcp()

    server = Server("lightroom-py")
    tools = _build_tools(Tool)

    @server.list_tools()
    async def _list_tools() -> list[Any]:
        return tools

    @server.call_tool()
    async def _call_tool(name: str, arguments: dict[str, Any] | None) -> list[Any]:
        import json as _json

        try:
            result = await _dispatch(name, arguments or {})
            return [TextContent(type="text", text=_json.dumps(result, indent=2, default=str))]
        except Exception as exc:  # noqa: BLE001
            logger.exception("tool %s failed", name)
            return [TextContent(type="text", text=f"ERROR: {type(exc).__name__}: {exc}")]

    async with stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())
```

</details>

#### 缺口

- 未运行 MCP 和 DSH 宿主
  **影响**：不能确认工具发现、错误传播或实际 Lightroom 结果
  **进一步探讨**：隔离宿主比较成功与桥接错误的模型可见结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 桥接、MCP 依赖及图库写入有哪些条件？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

MCP 模块缺依赖时要求安装 lightroom-py[mcp]，而 DSH patch 注释只写 pip install lightroom-py，故不能仅凭该注释认定 MCP 依赖已安装。photos_list 描述称 SQLite 只读无需 LR，但 MCP 统一以 LightroomClient.connect() 默认 require_bridge=true 进入上下文，实际仍尝试打开桥接，不能据工具描述承诺离线可用。桥接默认回环地址且握手核 token；这不证明所有路由和宿主认证完整。编辑、重置和导出均可能产生真实图库或文件变更，先备份并在副本核选区、版本和结果；失败时停止写入并对照图库恢复，安装、订阅和复核成本未知。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-7](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/cordis.patch.yml#L1-L7)

注释中的基本安装前置。

```text
# dsh-lightroom-py — Adobe Lightroom Classic tools for DeepSeek Harness.
#
# Prerequisites (Python side, once):
#   pip install lightroom-py          # provides the `lightroom-mcp` stdio server
#   lightroom bridge install          # installs the Lightroom plugin
#   lightroom bridge start            # bridge daemon (:8765); in Lightroom:
#                                     # Library → Plug-in Extras → "lightroom-py: Start bridge"
```

**依据 2 · 源码核查**：[src/lightroom/mcp_server.py:42-52](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/mcp_server.py#L42-L52)

缺 MCP 可选依赖时的错误。

<details>
<summary>查看原文（11行）</summary>

```text
def _require_mcp() -> Any:
    try:
        from mcp.server import Server
        from mcp.server.stdio import stdio_server
        from mcp.types import TextContent, Tool
    except ImportError as exc:  # pragma: no cover
        raise SystemExit(
            "MCP support requires the optional dependency. "
            "Install with: pip install 'lightroom-py[mcp]'"
        ) from exc
    return Server, stdio_server, TextContent, Tool
```

</details>

**依据 3 · 源码核查**：[src/lightroom/mcp_server.py:74-87](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/mcp_server.py#L74-L87)

photos_list 的只读描述。

<details>
<summary>查看原文（14行）</summary>

```text
        Tool(
            name="photos_list",
            description="List photos with filters. Pure SQLite read; no LR required.",
            inputSchema={
                "type": "object",
                "properties": {
                    "rating_gte": {"type": "integer", "minimum": 0, "maximum": 5},
                    "rating_lte": {"type": "integer", "minimum": 0, "maximum": 5},
                    "camera": {"type": "string", "description": "Camera model substring."},
                    "lens": {"type": "string", "description": "Lens model substring."},
                    "keyword": {"type": "string"},
                    "since": {"type": "string", "description": "ISO-ish capture time."},
                    "until": {"type": "string"},
                    "limit": {"type": "integer", "default": 50},
```

</details>

**依据 4 · 源码核查**：[src/lightroom/mcp_server.py:231-245](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/mcp_server.py#L231-L245)

所有工具统一 connect 默认值。

<details>
<summary>查看原文（15行）</summary>

```text
# Map MCP tool name → callable that invokes the right LightroomClient method.
async def _dispatch(name: str, args: dict[str, Any]) -> Any:
    async with LightroomClient.connect() as lr:
        if name == "catalog_info":
            info = await lr.catalog.info()
            return {
                "path": str(info.path),
                "photo_count": info.photo_count,
                **info.extra,
            }
        if name == "catalog_stats":
            return await lr.catalog.stats()
        if name == "photos_list":
            rows = await lr.photos.list(**args)
            return [
```

</details>

**依据 5 · 源码核查**：[src/lightroom/client.py:72-92](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/client.py#L72-L92)

默认需要 bridge 与可选只读模式。

<details>
<summary>查看原文（21行）</summary>

```text
    def connect(
        cls,
        host: str | None = None,
        port: int | None = None,
        token: str | None = None,
        timeout: float = DEFAULT_TIMEOUT,
        *,
        require_bridge: bool = True,
    ) -> LightroomClient:
        """Construct a client pointing at a local bridge server.

        Resolution order for each of host/port/token:
            1. explicit kwarg
            2. ``LIGHTROOM_BRIDGE_HOST`` / ``LIGHTROOM_BRIDGE_PORT`` /
               ``LIGHTROOM_BRIDGE_TOKEN`` env var
            3. persisted state in ``$LIGHTROOM_HOME/profiles/<profile>/bridge.json``
               (written by ``lightroom bridge start``)
            4. built-in default (only for host/port — no token default)

        Pass ``require_bridge=False`` for read-only flows (catalog stats /
        photos list) that hit the SQLite fast-path and never touch the bridge.
```

</details>

**依据 6 · 源码核查**：[src/lightroom/client.py:112-120](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/client.py#L112-L120)

默认上下文实际打开 bridge。

```text
        token = token or os.environ.get("LIGHTROOM_BRIDGE_TOKEN") or state.get("token")

        url = f"http://{host}:{port}"
        return cls(bridge_url=url, token=token, timeout=timeout, require_bridge=require_bridge)

    async def __aenter__(self) -> LightroomClient:
        if self._require_bridge:
            await self._core.open()
        return self
```

**依据 7 · 源码核查**：[src/lightroom/bridge/server.py:38-47](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/bridge/server.py#L38-L47)

默认地址和随机 token。

<details>
<summary>查看原文（10行）</summary>

```text
    def __init__(
        self,
        host: str = "127.0.0.1",
        port: int = 8765,
        token: str | None = None,
        version: str = "0.6.0",
    ) -> None:
        self.host = host
        self.port = port
        self.token = token or secrets.token_hex(16)
```

</details>

**依据 8 · 源码核查**：[src/lightroom/bridge/server.py:142-147](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/bridge/server.py#L142-L147)

握手 token 核查。

```text
    async def _handshake(self, request):
        from aiohttp import web

        body = await request.json()
        if not self._check_token(body.get("token")):
            return web.json_response({"ok": False, "error": "bad_token"}, status=401)
```

#### 缺口

- 未实测依赖、读路径和 Lightroom 版本
  **影响**：不能确认可用性或修改后的恢复
  **进一步探讨**：隔离图库分别测试缺桥接、单图编辑和备份恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何检验写操作预览和确认能减少误改？

**研究主题**：新假设与验证

#### 完整回答

假设在真实写操作前展示精确照片 UUID、预设或参数、潜在覆盖和确认步骤，并将确认绑定到实际调用，可降低误选区和批量误改；这是建议而非当前已验证能力。固定副本对照直接调用和预览确认，测目标错误、无意改动、复核时间及恢复；若误改不减少或确认与实际目标不一致则否定。此流程不替代图库备份和 Lightroom 自身撤销机制。

#### 证据与依据

**依据 1 · 源码核查**：[src/lightroom/mcp_server.py:148-169](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/mcp_server.py#L148-L169)

预设和调色工具参数。

<details>
<summary>查看原文（22行）</summary>

```text
            name="develop_apply_preset",
            description="Apply a develop preset by name to photos.",
            inputSchema={
                "type": "object",
                "properties": {
                    "preset": {"type": "string"},
                    "folder": {"type": "string", "description": "Optional disambiguation."},
                    "photo_uuids": uuid_arg,
                },
                "required": ["preset"],
            },
        ),
        Tool(
            name="develop_apply_settings",
            description="Apply raw develop settings (e.g. {'Exposure2012': 0.5, 'Contrast2012': 25}).",
            inputSchema={
                "type": "object",
                "properties": {
                    "settings": {"type": "object"},
                    "photo_uuids": uuid_arg,
                },
                "required": ["settings"],
```

</details>

**依据 2 · 源码核查**：[src/lightroom/mcp_server.py:268-279](https://github.com/drshy-org/lightroom-py/blob/cb5b0d9daf73db407e6ccbc8a46eb4153d783ce1/src/lightroom/mcp_server.py#L268-L279)

参数传入具体写操作。

<details>
<summary>查看原文（12行）</summary>

```text
        if name == "develop_apply_preset":
            return await lr.develop.apply_preset(
                args["preset"],
                folder=args.get("folder"),
                photo_uuids=args.get("photo_uuids"),
            )
        if name == "develop_apply_settings":
            return await lr.develop.apply_settings(
                args["settings"], photo_uuids=args.get("photo_uuids")
            )
        if name == "develop_reset":
            return await lr.develop.reset(photo_uuids=args.get("photo_uuids"))
```

</details>

#### 缺口

- 未实现或核验宿主确认链
  **影响**：不能证明能减少误改
  **进一步探讨**：在虚拟副本和可恢复样本中对照目标及实际变化。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
