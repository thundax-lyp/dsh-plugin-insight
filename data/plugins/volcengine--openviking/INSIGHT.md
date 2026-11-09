# OpenViking

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[4bd28b5](https://github.com/volcengine/OpenViking/tree/4bd28b5783d4fd4126ae15beebf5f19730c47219)

<!-- BEGIN META -->
[![GitHub ★ 41,761](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41%2C761&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking)
<!-- END META -->

> **功能**：为 AI Agent 组织、浏览、检索与复用知识、记忆和技能的上下文数据库。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，服务将有范围的查询和可独立读取的 URI、摘要与原文放在同一个接口模型中。它能缩短从命中候选到回查原文的操作路径，但尚未测定同任务的检索质量。

> **主要限制**：[Q03](#research-q03) 显示摄入接受、任务完成及父摘要覆盖最新内容是不同阶段。大目录可能等待累积变化，锁忙时本轮传播可以跳过，所以单凭可读摘要不能确认资料更新已反映在答案里。

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
  - [Q01 · 团队为何要把项目资料变成可浏览的上下文库？](#detail-section-11)
  - [Q02 · 目标目录和会话是否真的改变检索路径？](#detail-section-12)
  - [Q03 · 摄入受理后，摘要和索引是否已经可用？](#detail-section-13)
  - [Q04 · 小范围试用需要哪些服务、隔离和退出条件？](#detail-section-14)
  - [Q05 · 在依赖摘要的检索上加入可核验的新鲜度提示是否值得？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护 Agent 项目资料的团队，可以把授权资料组织成有 URI 的目录，再为问答找出可复查的原文。

同语料下以原文件的关键词搜索为基线，并与已有目录元数据过滤的向量索引比较；如果目录、引用与来源已有统一维护，新增服务的收益会缩小。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 资源摄入 | 将项目资料组织成 URI 资源 | 默认返回任务回执，须检查最终状态 |
| 范围检索 | 指定目录查找候选 | 语义检索需嵌入与索引，权限须单测 |
| 摘要和原文读取 | 先读目录概览，再核对具体文档 | 摘要可暂缓，文件 URI 的摘要可能取自父目录 |
| 任务查询 | 追踪受理后的执行状态 | 普通身份受账号和用户范围约束 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python 3.10 或更新、服务存储 | 自部署需要 | 启动服务并保存资源 | 无法提供持久上下文 |
| 向量存储与嵌入器 | 语义检索需要 | 形成索引并执行语义查询 | 语义查找不可用 |
| 配置的 VLM | 生成摘要、启用意图等流程 | 生成分层文本或规划查询 | 对应流程受限，意图失败会回到原查询 |
| 正确身份和资料授权 | 共享部署和敏感数据处理需要 | 控制访问与处理范围 | 暂停扩大接入 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 建立隔离库 | 操作者配置服务、模型和测试身份 | 仅使用非敏感资料，入口和身份可核实 |
| 摄入资料 | 操作者选定项目目录，保存 task_id | 轮询任务终态，再确认原文和摘要 |
| 核查 | 开发者给问答指定目录，对照返回 URI 与原文 | 没有越权返回，答案可追溯到目标资料 |
| 退出 | 操作者停止新增资料，保留源文件与原搜索入口 | 可以在原库继续工作，再核对测试数据和外部留存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 存储、向量索引及模型请求 | 配置身份与目录，摄入样本 | 初次耗时和费用未知 |
| 持续使用 | 查询、摘要重算与后台队列 | 维护语料、监看任务和核对原文 | 单位合格任务开支未测 |
| 失败恢复 | 重建或补写需要资源 | 对照任务、摘要和原文定位停点 | 中断恢复时间未知 |
| 退出 | 原文件与测试库的数据留存 | 停止摄入并核对权限和外部模型处理 | 未实测删除和迁移耗时 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 来源追溯 | 路径查询、分层读与独立原文入口 | 正确引用率与节时 |
| 有范围检索 | 目录进入向量查询条件 | 目标后端和权限配置的实际效果 |
| 后台摄入 | 有任务回执和等待分支 | 祖先摘要完成时间和准确率 |

> **思考**：[Q03](#research-q03) 显示摄入接受、任务完成及父摘要覆盖最新内容是不同阶段。大目录可能等待累积变化，锁忙时本轮传播可以跳过，所以单凭可读摘要不能确认资料更新已反映在答案里。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，服务将有范围的查询和可独立读取的 URI、摘要与原文放在同一个接口模型中。它能缩短从命中候选到回查原文的操作路径，但尚未测定同任务的检索质量。

[Q02](#research-q02) 的调用方目录范围不会由会话规划改写，意图失败保留原查询。[Q03](#research-q03) 给异步摄入可查询状态，并把父摘要刷新做成有条件的独立传播。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示摄入接受、任务完成及父摘要覆盖最新内容是不同阶段。大目录可能等待累积变化，锁忙时本轮传播可以跳过，所以单凭可读摘要不能确认资料更新已反映在答案里。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 使用已有原文件可恢复的隔离样本。先以一个目录的问题验证任务回执、结果路径、逐字原文，再试一个禁止访问的目录。如果授权或更新状态无法解释，保留原有搜索并停止摄入新资料。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有依据支持目录范围查询、分层读取及摄入任务状态。父摘要的更新边界可由源码确定。新鲜度提示的任务收益属于待验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、openviking/server/routers/content.py、openviking/storage/viking_fs/_semantic.py、openviking/server/routers/search.py、openviking/service/search_service.py、openviking/retrieve/hierarchical_retriever.py、openviking/storage/viking_vector_index_backend.py、openviking/storage/scope_filter.py、openviking/server/routers/resources.py、openviking/server/resource_ingest.py、openviking/service/resource_service.py、openviking/server/routers/tasks.py、openviking/storage/queuefs/semantic_ops/freshness_policy.py、openviking/storage/queuefs/semantic_processor.py、openviking/server/config.py、openviking/server/auth/plugins/dev.py、openviking/storage/abstract_overview.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查根 Python 服务的普通资源摄入、find 和 search、分层读取与开发认证。其他检索模式、DSH 子包、部署后端差异、会话提取和基准收益未核验。静态 inventory 的指定扩展名没有覆盖实际 Python 和 Rust 规模。
- 下一步：用同一公开语料固定两个目录、两种身份和一份版本变更，核对目标权限、任务终态、引用正确率、延迟与人工核实成本。

**分析版本**

- **仓库**：[volcengine/OpenViking](https://github.com/volcengine/OpenViking)
- **版本号**：未声明（[固定提交 4bd28b5](https://github.com/volcengine/OpenViking/tree/4bd28b5783d4fd4126ae15beebf5f19730c47219)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出将可核验的新鲜度信息与有权限的原文回查绑定，测试能否减少引用陈旧事实。

用同一公开语料固定两个目录、两种身份和一份版本变更，核对目标权限、任务终态、引用正确率、延迟与人工核实成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 512 | 121796 | — | — | 1060706 |
| .mjs | source | 22 | 4531 | 3489 | 666 | — |
| .mjs | test | 11 | 1416 | 1212 | 101 | — |
| .ts | source | 307 | 51533 | 41650 | 7154 | — |
| .md | test | 6 | 1126 | — | — | 6516 |
| .ts | test | 104 | 13580 | 12525 | 628 | — |
| .js | source | 8 | 649 | 496 | 102 | — |
| .md | example | 112 | 25596 | — | — | 203454 |
| .mjs | example | 337 | 85771 | 68424 | 11144 | — |
| .tsx | example | 1 | 258 | 230 | 13 | — |
| .ts | example | 123 | 35372 | 30647 | 1804 | — |
| .js | example | 2 | 2991 | 2637 | 85 | — |
| .tsx | source | 367 | 68403 | 63929 | 1662 | — |
| .tsx | test | 124 | 27330 | 25476 | 698 | — |

</details>

**活跃度**

[![Issue 未关闭 448](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=448&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 367](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=367&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 202](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=202&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护项目知识的 Agent 平台团队，能否通过 OpenViking 的目录范围和分层检索更可靠地找到可回查原文，并明确需要自管的数据、身份及后台任务？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 团队为何要把项目资料变成可浏览的上下文库？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护多项目 Agent 知识的团队可把项目资料、记忆和技能组织为可寻址的 viking:// 资源。相比手工维护文档加关键词搜索，目录摘要和语义查找提供两个查阅入口，操作者仍可回到具体资源核查事实。相比只有候选片段的平面向量索引，这里增加了可浏览的 URI、分层读取与可指定的目录范围；有相同元数据过滤的现成索引也能覆盖部分需求。服务将 abstract、overview 和 read 分开，摘要路径在传入文件时可能返回父目录摘要。需要逐字证据时应读源文件而非把父目录概览当文件内容。根 Python 包暴露独立服务和 CLI，本项研究对象是上下文基础设施。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:42-62](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/README.md#L42-L62)

作者描述 URI 文件系统、目录搜索和分层访问。

<details>
<summary>查看原文（21行）</summary>

```text
## What is OpenViking

OpenViking is an open-source context database for AI agents — one filesystem for everything an agent knows: knowledge, memory, and skills.

Most agent memory is a black box: text goes in, embeddings come out, and nobody can see what was actually stored. OpenViking organizes context as a virtual filesystem under `viking://` instead. Agents navigate it like files — `ls`, `tree`, `read`, `write`, `grep` — and you can open any directory to inspect and edit what your agent knows. Every directory carries a generated summary, so agents can scan summaries first and decide what to read.

<a href="https://studio.openviking.ai" target="_blank" rel="noopener noreferrer">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/images/studio-filesystem-dark.png">
    <img src="docs/images/studio-filesystem.png" alt="OpenViking Studio Filesystem: browse personal memories and resources">
  </picture>
</a>

[Try OpenViking Studio](https://studio.openviking.ai) in your browser, no installation required. [Self-host Web Studio](web-studio/README.md).

## Why OpenViking

- **One filesystem for knowledge, memory, and skills.** Resources hold documents and code; memories retain user preferences and experience; skills define how to perform tasks — not just extracted facts, but the full context, each with a `viking://` URI for browsing and retrieval. → [Viking URI](https://docs.openviking.ai/en/concepts/04-viking-uri) · [Context types](https://docs.openviking.ai/en/concepts/02-context-types)
- **Search a directory, not the whole index.** Scope semantic search to a project or memory subtree instead of scanning a flat vector pool. `find` runs a query directly; `search` plans retrieval from session context. → [Retrieval](https://docs.openviking.ai/en/concepts/07-retrieval)
- **Read the summary before the source.** Generated directory abstracts (L0) and overviews (L1) let agents judge relevance before opening full content (L2). → [Context layers](https://docs.openviking.ai/en/concepts/03-context-layers)
- **Sessions become files you can read.** Committing a session archives the conversation and extracts memories as Markdown you can inspect, edit, and merge. With VikingBot enabled, `ov compile` organizes source material into a wiki, knowledge graph, or report. → [Sessions](https://docs.openviking.ai/en/concepts/08-session) · [Context compilation](https://docs.openviking.ai/en/context-compilation/01-overview)
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:230-235](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/pyproject.toml#L230-L235)

固定项目声明独立服务与命令行入口。

```text
[project.scripts]
ov = "openviking_cli.rust_cli:main"  # Rust CLI 入口（极简包装器）
openviking = "openviking_cli.rust_cli:main"  # Rust CLI 入口（放弃 python CLI）
openviking-server = "openviking_cli.server_bootstrap:main"  # also: `openviking-server ingest ...`
openviking-gateway = "openviking_gateway.cli:main"
vikingbot = "vikingbot.cli.commands:app"
```

**依据 3 · 源码核查**：[openviking/server/routers/content.py:168-193](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/server/routers/content.py#L168-L193)

read 请求处理原始或可见内容，完整可见读还可接入实时上下文。

<details>
<summary>查看原文（26行）</summary>

```text
@router.get("/read")
async def read(
    uri: str = Query(..., description="Viking URI"),
    offset: int = Query(0, description="Starting line number (0-indexed)"),
    limit: int = Query(-1, description="Number of lines to read, -1 means read to end"),
    raw: bool = Query(False, description="Return raw stored content without memory-field cleanup"),
    _ctx: RequestContext = Depends(get_request_context),
):
    """Read file content (L2)."""
    service = get_service()
    # If the argument is a raw 32-hex vector record id, skip URI validation
    # (id lookup + access check happens inside VikingFS.read_file).
    if is_vector_record_id(uri):
        resolved = uri
    else:
        resolved = validate_request_viking_uri(resolve_path_variables(uri), _ctx)
    try:
        if raw:
            result = await service.fs.read(resolved, ctx=_ctx, offset=offset, limit=limit)
        else:
            result = await service.fs.read_visible(resolved, ctx=_ctx, offset=offset, limit=limit)
            if offset == 0 and limit == -1:
                live_result = await service.mcps.read_live_context(result, _ctx)
                if live_result is not None:
                    result = live_result
    except AGFSNotFoundError:
```

</details>

**依据 4 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:70-95](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/viking_fs/_semantic.py#L70-L95)

摘要访问先核查权限，文件 URI 会回到父目录。

<details>
<summary>查看原文（26行）</summary>

```text
        """Read directory's L0 summary (.abstract.md).

        If the caller points to a file, its parent directory is used instead so
        the endpoint remains usable for both file and directory URIs.
        """
        real_ctx = self._ctx_or_default(ctx)
        ctx = self.authorize_read(real_ctx, [uri])
        await self._ensure_access(uri, ctx)
        path = self._uri_to_path(uri, ctx=ctx)
        try:
            info = await self._async_agfs.stat(path)
        except Exception as exc:
            mapped = map_exception(exc, resource=uri)
            if mapped is not None:
                raise mapped from exc
            raise
        if not info.get("isDir", info.get("is_dir")):
            parent_path = path.rsplit("/", 1)[0] or "/"
            parent_uri = self._path_to_uri(parent_path, ctx=ctx)
            logger.info(
                "content/abstract: %s is a file, falling back to parent directory %s",
                uri,
                parent_uri,
            )
            return await self.abstract(parent_uri, ctx=real_ctx)
        return await self._read_directory_summary(uri, "abstract", ctx=ctx)
```

</details>

#### 缺口

- 未对照现有文本搜索、带目录过滤的向量索引和 OpenViking。
  **影响**：可说明多入口的设计增量，不能量化检索收益。
  **进一步探讨**：用同一份可公开项目资料回答带精确引用的版本问题，对照定位耗时和原文命中。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目标目录和会话是否真的改变检索路径？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

普通 find 将目标目录和层级交给检索器，语义检索需要可用的向量存储和嵌入器，走 QUICK 模式。普通 search 有 session_id 且启用意图分析时才加载会话，服务在非图像查询时提取会话上下文。意图规划有时限，失败时仍执行原查询，成功后也用调用者解析出的目录覆盖规划结果。名为 HierarchicalRetriever 的当前实现对每个查询做带目录约束的候选检索、URI 去重，再按配置与模式选择是否重排；它不沿目录逐层遍历。向量后端将目录约束编进范围条件。目录与租户条件在后端组合，ACL 与授权上下文仍是独立的范围约束，不能从目录参数存在推断全系统租户隔离。本题聚焦普通 find/search，单独的 context 模式不纳入同一结论。

#### 证据与依据

**依据 1 · 源码核查**：[openviking/server/routers/search.py:498-521](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/server/routers/search.py#L498-L521)

context 模式另走分支，普通 search 条件性加载会话。

<details>
<summary>查看原文（24行）</summary>

```text
    if request.mode == "context":
        return await _search_context(
            service=service,
            ctx=_ctx,
            request=request,
            http_request=http_request,
            effective_filter=effective_filter,
            actual_limit=actual_limit,
        )
    resolved_target_uri = _resolve_uri_or_uris(request.target_uri, _ctx)
    resolved_image_url = _resolve_image_url(request.image_url, _ctx)

    async def _search():
        session = None
        # Intent off: skip session.load — SearchService will not scan session either.
        if request.session_id and service.search.is_intent_enabled():
            session = service.sessions.session(_ctx, request.session_id)
            await session.load()
        return await service.search.search(
            query=request.query,
            search_type=request.search_type,
            ctx=_ctx,
            target_uri=resolved_target_uri,
            session=session,
```

</details>

**依据 2 · 源码核查**：[openviking/service/search_service.py:187-205](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/service/search_service.py#L187-L205)

服务仅在已启用且无图像等条件下取会话上下文。

<details>
<summary>查看原文（19行）</summary>

```text
        session_info = None
        # Intent off: session_info is unused by VikingFS — skip the archive/message scan.
        if session is not None and self.is_intent_enabled() and not resolved_image_url:
            session_info = await session.get_context_for_search(query)

        result = await viking_fs.search(
            query=query,
            ctx=ctx,
            target_uri=target_uri,
            session_info=session_info,
            limit=limit,
            score_threshold=score_threshold,
            filter=filter,
            level=level,
            image_url=resolved_image_url,
            events_time_decay_protection=events_time_decay_protection,
            search_type=search_type,
            context_types=context_types,
        )
```

</details>

**依据 3 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:210-225](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/viking_fs/_semantic.py#L210-L225)

find 检查目标范围和向量、嵌入依赖。

<details>
<summary>查看原文（16行）</summary>

```text
        for target_dir in retrieval_targets.target_directories:
            await self._ensure_retrieval_scope(target_dir, real_ctx)

        storage = self._get_vector_store()
        if not storage:
            raise RuntimeError("Vector store not initialized. Call OpenViking.initialize() first.")

        embedder = self._get_embedder(real_ctx)
        if search_type == "semantic" and not embedder:
            raise RuntimeError("Embedder not configured.")

        retriever = HierarchicalRetriever(
            storage=storage,
            embedder=embedder,
            rerank_config=self.rerank_config,
        )
```

</details>

**依据 4 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:238-254](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/viking_fs/_semantic.py#L238-L254)

find 实际接入检索器的 QUICK 模式。

<details>
<summary>查看原文（17行）</summary>

```text
        logger.debug(
            "[VikingFS.find] Calling retriever.retrieve with "
            f"ctx.account_id={real_ctx.account_id}, ctx.user={real_ctx.user}"
        )

        result = await retriever.retrieve(
            typed_query,
            ctx=real_ctx,
            limit=limit,
            mode=RetrieverMode.QUICK,
            score_threshold=score_threshold,
            has_explicit_target=bool(retrieval_targets.first_explicit_directory),
            scope_dsl=filter,
            level=level,
            events_time_decay_protection=events_time_decay_protection,
            request_now=request_now,
            search_type=search_type,
```

</details>

**依据 5 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:452-486](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/viking_fs/_semantic.py#L452-L486)

意图分析时限、错误回退与调用方目标覆盖。

<details>
<summary>查看原文（35行）</summary>

```text
        elif retrieval_config.enable_intent and (session_summary or current_messages):
            try:
                if self._vlm_resolver is None:
                    raise RuntimeError(
                        "VikingFS requires a VLM resolver for account-owned intent analysis"
                    )
                analyzer = IntentAnalyzer(
                    max_recent_messages=5,
                    query_planner=await self._vlm_resolver.get_query_planner(real_ctx.account_id),
                )
                with telemetry.measure("search.intent_analysis"):
                    query_plan = await asyncio.wait_for(
                        analyzer.analyze(
                            compression_summary=session_summary or "",
                            messages=current_messages or [],
                            current_message=query,
                            context_type=context_types[0]
                            if context_types and len(context_types) == 1
                            else None,
                            target_abstract=target_abstract,
                        ),
                        timeout=retrieval_config.recall_intent_timeout_s,
                    )
            except Exception as exc:
                logger.warning(
                    "Intent analysis failed (%s); using original query: %s",
                    type(exc).__name__,
                    exc,
                )
            else:
                typed_queries = query_plan.queries
                for tq in typed_queries:
                    tq.target_directories = retrieval_targets.target_directories
                    # Caller scope is authoritative even when the planner ignores its prompt.
                    if context_types and len(context_types) == 1:
```

</details>

**依据 6 · 源码核查**：[openviking/retrieve/hierarchical_retriever.py:202-225](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/retrieve/hierarchical_retriever.py#L202-L225)

一次向量或关键词候选调用携带目标目录。

<details>
<summary>查看原文（24行）</summary>

```text
        search_limit = limit * self.RERANK_CANDIDATE_MULTIPLIER if use_rerank else limit
        with telemetry.measure("search.vector_retrieval"):
            if search_type == "keywords":
                vector_results = await vector_proxy.search_by_keywords_in_tenant(
                    query=query.query,
                    context_type=context_type,
                    target_directories=target_dirs,
                    extra_filter=scope_dsl,
                    level=level,
                    limit=search_limit,
                )
            else:
                vector_results = await vector_proxy.search_in_tenant(
                    query_vector=query_vector,
                    sparse_query_vector=sparse_query_vector,
                    context_type=context_type,
                    target_directories=target_dirs,
                    extra_filter=scope_dsl,
                    level=level,
                    limit=search_limit,
                    **decay_kwargs,
                )
        telemetry.count("vector.searches", 1)
        telemetry.count("vector.scored", len(vector_results))
```

</details>

**依据 7 · 源码核查**：[openviking/retrieve/hierarchical_retriever.py:228-264](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/retrieve/hierarchical_retriever.py#L228-L264)

对同 URI 去重、可选重排、按最终阈值截取。

<details>
<summary>查看原文（37行）</summary>

```text
        # Recall scores already include event decay from the vector engine.
        # Keep the highest-scored hit for each URI before model reranking.
        collected_by_uri: Dict[str, Dict[str, Any]] = {}
        for result in vector_results:
            uri = result.get("uri", "")
            if not uri:
                continue
            score = self._finite_score(result.get("_score", 0.0))
            previous = collected_by_uri.get(uri)
            if previous is None or score > previous["_score"]:
                collected_by_uri[uri] = {**result, "_score": score}

        candidates = sorted(
            collected_by_uri.values(), key=lambda candidate: candidate["_score"], reverse=True
        )
        scores = [candidate["_score"] for candidate in candidates]
        reranked = [False] * len(candidates)
        rerank_used = use_rerank and bool(candidates)
        if rerank_used:
            rerank = await self._rerank_scores(
                query.query,
                [str(candidate.get("abstract", "")) for candidate in candidates],
                scores,
            )
            scores, reranked = rerank.scores, rerank.reranked

        # A low vector score can still rerank highly, so filter only after reranking.
        candidates = [
            {**candidate, "_final_score": score}
            for candidate, score, from_model in zip(candidates, scores, reranked, strict=True)
            if self._passes_threshold(
                score, self._resolve_threshold(score_threshold, from_model), score_gte
            )
        ]
        telemetry.count("vector.passed", len(candidates))
        matched = await self._convert_to_matched_contexts(candidates, ctx=ctx)
        final = matched[:limit]
```

</details>

**依据 8 · 源码核查**：[openviking/storage/viking_vector_index_backend.py:3213-3233](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/viking_vector_index_backend.py#L3213-L3233)

结合租户条件、目标目录与额外过滤。

<details>
<summary>查看原文（21行）</summary>

```text
        targets = [target_dir for target_dir in target_directories or [] if target_dir]
        tenant_filter = self._tenant_filter(ctx, acl_enabled=acl_enabled)
        if (
            tenant_filter
            and not acl_enabled
            and ctx.data_access is None
            and self._targets_within_visible_roots(ctx, targets)
        ):
            # The target scopes are already narrower than the tenant-visible
            # roots. Keep account isolation, but avoid recursively evaluating
            # the broader path scopes as an additional filter.
            tenant_filter = Eq("account_id", ctx.account_id)
        return build_scope_filter(
            context_type=context_type,
            base_filter=tenant_filter,
            target_directories=targets,
            target_depth=-1,
            wrap_single_target=True,
            extra_filter=extra_filter,
            level=level,
        )
```

</details>

**依据 9 · 源码核查**：[openviking/storage/scope_filter.py:55-68](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/scope_filter.py#L55-L68)

将目录转换为 URI 范围条件并与其余过滤项合并。

<details>
<summary>查看原文（14行）</summary>

```text
    targets = [target for target in target_directories or [] if target]
    target_scopes = [PathScope("uri", target, depth=target_depth) for target in targets]
    if target_scopes:
        filters.append(
            Or(target_scopes) if wrap_single_target or len(target_scopes) > 1 else target_scopes[0]
        )

    if extra_filter:
        if isinstance(extra_filter, dict):
            extra_filter = RawDSL(extra_filter)
        filters.append(extra_filter)
    if level:
        filters.append(In("level", level))
    return merge_filters(*filters)
```

</details>

#### 缺口

- 未运行同语料下的目录隔离、意图失败回退和检索基准。
  **影响**：无法量化命中或排查所有部署后端的权限执行。
  **进一步探讨**：在两个有相同关键词的目录中验证返回范围，并注入意图分析超时对比原查询。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 摄入受理后，摘要和索引是否已经可用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

资源 HTTP 默认 wait 为 false，原生资源摄入登记后台任务后可以先返回 task_id；wait 为 true 的路径等待跟踪状态并区分完成、取消和失败。可通过任务查询核对状态，并另外读目标原文、摘要和检索结果。任务结束也不必然使所有祖先摘要同步。在自动向父目录传播的分支，子摘要正文未变化时无需刷新，缺少基线或小目录可以立即安排，已有基线的大目录则可能只累计待处理变更。父目录摘要锁忙时传播按尽力处理跳过。分层摘要读取返回已有正文，缺失或格式错误会返回未就绪提示，因此已可读的概览和它涵盖最新事实是两个条件。

#### 证据与依据

**依据 1 · 源码核查**：[openviking/server/routers/resources.py:148-168](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/server/routers/resources.py#L148-L168)

HTTP 将请求 wait 参数传给实际摄入。

<details>
<summary>查看原文（21行）</summary>

```text
    service = get_service()
    app = getattr(http_request, "app", None)
    state = getattr(app, "state", None)
    config = getattr(state, "config", None)

    async def _add() -> dict[str, Any]:
        return await ingest_resource_request(
            request,
            _ctx,
            resources=service.resources,
            config=config,
            wait=request.wait,
            internal_task=request.internal_task,
        )

    execution = await run_operation(
        operation="resources.add_resource",
        telemetry=request.telemetry,
        fn=_add,
    )
    return response_from_result(execution.result, telemetry=execution.telemetry)
```

</details>

**依据 2 · 源码核查**：[openviking/server/resource_ingest.py:54-64](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/server/resource_ingest.py#L54-L64)

请求默认异步且旧 timeout 参数已废弃。

<details>
<summary>查看原文（11行）</summary>

```text
    add_type: Optional[str] = None
    to: Optional[str] = None
    parent: Optional[str] = None
    create_parent: bool = False
    reason: str = ""
    instruction: str = ""
    wait: bool = False
    timeout: float | None = Field(
        default=None,
        deprecated=True,
        description="Deprecated compatibility parameter; accepted and ignored.",
```

</details>

**依据 3 · 源码核查**：[openviking/service/resource_service.py:2492-2503](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/service/resource_service.py#L2492-L2503)

原生资源后台登记后把 task_id 写入结果。

<details>
<summary>查看原文（12行）</summary>

```text
                enqueue_lock = deferred_lock
                deferred_lock = None
                task = await self._enqueue_add_resource_job(
                    msg,
                    queue_name=QueueManager.ADD_RESOURCE,
                    resource_lock=enqueue_lock,
                    on_task_created=register_native_task,
                )
                result["task_id"] = task.task_id
                if first_watch is not None:
                    result["watch_id"] = first_watch.task_id
                job_enqueued = True
```

</details>

**依据 4 · 源码核查**：[openviking/service/resource_service.py:2251-2274](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/service/resource_service.py#L2251-L2274)

非等待路径先返回，等待路径区分任务终态。

<details>
<summary>查看原文（24行）</summary>

```text
        get_current_telemetry().set("resource.flags.wait", wait)
        if not wait:
            return result
        if result.get("status") == "error":
            return result
        from openviking.service.task_tracker import TaskStatus, get_task_tracker

        task_id = result["task_id"]
        task = await get_task_tracker().wait(
            task_id,
            account_id=ctx.account_id,
            user_id=ctx.user.user_id,
        )

        if task.status == TaskStatus.COMPLETED:
            completed = dict(task.result)
            completed.pop("task_id", None)
            return completed
        if task.status == TaskStatus.CANCELLED:
            return {"status": "cancelled"}
        failure: Dict[str, Any] = {
            "status": "error",
            "errors": [task.error],
        }
```

</details>

**依据 5 · 源码核查**：[openviking/server/routers/tasks.py:49-61](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/server/routers/tasks.py#L49-L61)

非 ROOT 查询使用账户与用户范围，找不到或已过期均可能返回不存在。

<details>
<summary>查看原文（13行）</summary>

```text
    else:
        task = await get_task_record(
            task_id,
            account_id=_ctx.account_id,
            user_id=_ctx.user.user_id,
        )
    if not task:
        raise OpenVikingError(
            "Task not found or expired",
            code="NOT_FOUND",
            details={"resource": task_id, "type": "task"},
        )
    return Response(status="ok", result=task.to_dict(include_events=include_events))
```

</details>

**依据 6 · 源码核查**：[openviking/storage/queuefs/semantic_ops/freshness_policy.py:47-62](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/queuefs/semantic_ops/freshness_policy.py#L47-L62)

父摘要按基线与累计变化比例决定刷新或暂缓。

<details>
<summary>查看原文（16行）</summary>

```text
    if not l0_body_changed or current_change_count <= 0:
        return FreshnessDecision(FreshnessAction.NOOP, pending_before, total_entries)

    pending_after = pending_before + current_change_count
    if not has_freshness_baseline:
        return FreshnessDecision(FreshnessAction.REFRESH_NOW, pending_after, total_entries)
    if force_refresh or total_entries <= overview_sample_limit:
        return FreshnessDecision(FreshnessAction.REFRESH_NOW, pending_after, total_entries)

    change_ratio = pending_after / max(total_entries, 1)
    action = (
        FreshnessAction.REFRESH_NOW
        if change_ratio >= refresh_ratio
        else FreshnessAction.MARK_PENDING
    )
    return FreshnessDecision(action, pending_after, total_entries)
```

</details>

**依据 7 · 源码核查**：[openviking/storage/queuefs/semantic_processor.py:421-451](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/queuefs/semantic_processor.py#L421-L451)

父目录传播按阈值处理，锁争用会跳过本次自动父更新。

<details>
<summary>查看原文（31行）</summary>

```text
        try:
            decision = await plan_abstract_overview_refresh(
                viking_fs=get_viking_fs(),
                dir_uri=parent_uri,
                changed_entries=1,
                ctx=parent_ctx,
                l0_body_changed=l0_body_changed,
                # This helper handles automatic upward propagation only. Manual
                # refresh/ingest bypasses the threshold for its requested root,
                # not for every ancestor reached afterwards.
                force_refresh=False,
                overview_sample_limit=getattr(semantic_config, "overview_sample_limit", 32),
                refresh_ratio=getattr(semantic_config, "freshness_refresh_ratio", 0.10),
                lock_timeout_secs=1.0,
            )
        except LockAcquisitionError:
            logger.info(
                "Skipping best-effort parent freshness update because sidecars are busy: %s",
                parent_uri,
            )
            return

        if decision.action is not FreshnessAction.REFRESH_NOW:
            logger.debug(
                "Parent semantic refresh %s for %s (pending=%d, total=%d)",
                decision.action.value,
                parent_uri,
                decision.pending_after,
                decision.total_entries,
            )
            return
```

</details>

**依据 8 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:40-63](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/viking_fs/_semantic.py#L40-L63)

现存摘要返回可预览正文，缺失时显示未就绪。

<details>
<summary>查看原文（24行）</summary>

```text
    async def _read_directory_summary(
        self, uri: str, field: Literal["abstract", "overview"], ctx: Optional[RequestContext] = None
    ) -> str:
        """Read a fixed summary file from an already authorized, known directory."""
        real_ctx = self._ctx_or_default(ctx)
        if real_ctx.role == Role.GLOBAL:
            ctx = self.authorize_read(real_ctx, [uri])
            if ctx.data_access is not None:
                await self._ensure_access(f"{uri.rstrip('/')}/.{field}.md", ctx)
        path = self._uri_to_path(uri, ctx=ctx)
        try:
            raw = self._handle_agfs_read(await self._async_agfs.read(f"{path}/.{field}.md"))
            return body_for_preview(self._decode_bytes(raw))
        except AbstractOverviewFormatError as exc:
            logger.warning("Malformed directory %s for %s: %s", field, uri, exc)
        except Exception as exc:
            if not is_not_found_error(exc):
                mapped = map_exception(exc, resource=uri)
                if mapped is not None:
                    raise mapped from exc
                raise
        if field == "abstract":
            return f"# {uri} [Directory abstract is not ready]"
        return f"# {uri}\n\n[Directory overview is not ready]"
```

</details>

#### 缺口

- 未测实际刷新延迟、任务中断或祖先陈旧摘要出现频率。
  **影响**：不能以一次完成回执预测后续读到的上下文版本。
  **进一步探讨**：修改一个大目录内的子文件，分别轮询任务状态并对照父摘要、原文和索引返回。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 小范围试用需要哪些服务、隔离和退出条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

按独立服务部署时，根项目要求 Python 3.10 或更新版本，实际语义检索需要向量存储与嵌入，作者配置向导还要求选择摘要和意图等用途的 VLM。外部模型接入会产生请求和潜在费用，本地保存原文不意味着生成摘要的依赖也在本地。未显式指定鉴权模式且无根 Key 时会落到 dev。该模式配置校验只允许回环地址，却向到达服务的请求发 ROOT 身份，不能把它当共享环境的身份隔离。用独立测试工作区摄入非敏感资料，对照正确目录、原文和任务状态。共享前要验证授权、拒绝访问和数据处理范围。若发现越权、旧摘要无法追溯或外部处理条件不明，停止扩大采集，保留原文件并回到现有文本搜索。作者展示其他版本和模型组合的基准，当前源码研究未复现这些收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:109-115](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/README.md#L109-L115)

基准归属作者，绑定其版本及模型选型。

```text
## Proof it works

OpenViking 0.3.22 has been evaluated on long-conversation user memory (LoCoMo) and multi-turn agent tasks (tau2-bench). Full results and setup details, including knowledge-base QA, are in the [benchmark report](https://blog.openviking.ai/post/openviking-benchmark-results/); reproduction scripts live in [./benchmark](./benchmark).

To run your own experiments, follow the [RAG and Memory evaluation guide](benchmark/README.md) for routine VikingBot memory evaluation, published LoCoMo reproduction, separate mem0 prompt comparisons, and RAG evaluation.

The memory evaluation used [Doubao 2.0 Pro](https://console.volcengine.com/ark/region:cn-beijing/model/detail?Id=doubao-seed-2-0-pro) as the VLM and [Doubao-embedding-vision-251215](https://console.volcengine.com/ark/region:cn-beijing/model/detail?Id=doubao-embedding-vision) as the embedding model.
```

**依据 2 · 作者声明**：[README.md:125-127](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/README.md#L125-L127)

自部署起步声明需要 Python、uv、嵌入和 VLM。

```text
## Quick start

Set up an OpenViking server first; if you already have one, skip to [Use it with your agent](#use-it-with-your-agent). Deploying your own needs uv, Python 3.10+ and a model provider with an embedding model and a VLM.
```

**依据 3 · 源码核查**：[pyproject.toml:11-15](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/pyproject.toml#L11-L15)

固定根项目的 Python 版本要求。

```text
[project]
name = "openviking"
dynamic = ["version", "readme"]
description = "An Agent-native context database"
requires-python = ">=3.10"
```

**依据 4 · 源码核查**：[openviking/server/config.py:377-380](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/server/config.py#L377-L380)

服务器默认回环地址。

```text
class ServerConfig(BaseModel):
    host: str = "127.0.0.1"
    port: int = 1933
    workers: int = 1
```

**依据 5 · 源码核查**：[openviking/server/config.py:441-453](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/server/config.py#L441-L453)

未显式配置时根据 root_api_key 选择认证模式。

<details>
<summary>查看原文（13行）</summary>

```text
    def get_effective_auth_mode(self) -> str:
        """Get effective auth mode, auto-detecting if not explicitly set.

        - If root_api_key is configured (non-empty) and auth_mode is None: api_key
        - If root_api_key is not configured and auth_mode is None: dev
        """
        auth_mode_text = str(self.auth_mode).strip() if self.auth_mode is not None else ""
        if auth_mode_text:
            return auth_mode_text

        if self.root_api_key is not None and str(self.root_api_key).strip():
            return AuthMode.API_KEY.value
        return AuthMode.DEV.value
```

</details>

**依据 6 · 源码核查**：[openviking/server/auth/plugins/dev.py:31-55](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/server/auth/plugins/dev.py#L31-L55)

dev 对到达请求返回 ROOT，只允许本机地址配置。

<details>
<summary>查看原文（25行）</summary>

```text
    async def resolve_identity(
        self,
        request: Request,
        *,
        api_key: Optional[str] = None,
        x_openviking_account: Optional[str] = None,
        x_openviking_user: Optional[str] = None,
    ) -> ResolvedIdentity:
        """Dev mode: no authentication, always return ROOT."""
        return ResolvedIdentity(
            role=Role.ROOT,
            account_id=x_openviking_account or "default",
            user_id=x_openviking_user or "default",
        )

    def validate_config(self, config) -> None:
        """Dev mode is only allowed on localhost."""
        if _is_localhost(config.host):
            return
        import logging

        logger = logging.getLogger(__name__)
        logger.error(
            "SECURITY: server.auth_mode='dev' requires server.host to be localhost, "
            "but it is set to '%s'. Dev mode exposes an unauthenticated ROOT "
```

</details>

**依据 7 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:210-219](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/viking_fs/_semantic.py#L210-L219)

语义路径要求向量存储和可用嵌入器。

<details>
<summary>查看原文（10行）</summary>

```text
        for target_dir in retrieval_targets.target_directories:
            await self._ensure_retrieval_scope(target_dir, real_ctx)

        storage = self._get_vector_store()
        if not storage:
            raise RuntimeError("Vector store not initialized. Call OpenViking.initialize() first.")

        embedder = self._get_embedder(real_ctx)
        if search_type == "semantic" and not embedder:
            raise RuntimeError("Embedder not configured.")
```

</details>

#### 缺口

- 未核验目标部署使用的模型、账单、权限实测与恢复。
  **影响**：不能判定合格查询成本或外部服务与数据隔离边界。
  **进一步探讨**：锁定语料、模型、权限和版本，记录摄入耗时、请求费用、拒绝用例和退出成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 在依赖摘要的检索上加入可核验的新鲜度提示是否值得？

**研究主题**：新假设与验证

#### 完整回答

已有代码维护父目录摘要的 pending_child_changes 并将正文给普通预览。这表明上游可感知部分积压；它不意味着计数囊括锁忙时跳过的传播。可试验在需逐字核实的请求中，把未覆盖更新的信号随命中结果传给调用者，并对疑似陈旧命中按授权补读原文。对照当前摘要预览与用户手动回读，新方案仅在标记有依据时追加读取。用预先改动过的目录准备带版本要求的问题，记录陈旧事实引用、正确原文命中、额外读字节数和 P95 时延。若不能降低错引，或大量误报、漏报与回读代价抵消收益，则不支持采用。此为待验证设计。

#### 证据与依据

**依据 1 · 源码核查**：[openviking/storage/abstract_overview.py:748-776](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/abstract_overview.py#L748-L776)

两份摘要文档分别更新待处理计数，保留原正文。

<details>
<summary>查看原文（29行）</summary>

```text
        baseline = baselines[0]
        decision = decide_parent_refresh(
            l0_body_changed=True,
            has_freshness_baseline=True,
            total_entries=int(baseline["total_entries"]),
            # A mismatch should not normally exist, but preserving the larger
            # counter is safer than losing an already-observed change.
            pending_before=max(int(item["pending_child_changes"]) for item in baselines),
            current_change_count=changed_entries,
            overview_sample_limit=overview_sample_limit,
            refresh_ratio=refresh_ratio,
            force_refresh=force_refresh,
        )
        for level, uri, document in zip(
            (ContextLevel.OVERVIEW, ContextLevel.ABSTRACT), uris, documents, strict=True
        ):
            if document is None or document.legacy:
                continue
            freshness = document.metadata.get("freshness")
            if not isinstance(freshness, Mapping):
                continue
            metadata = dict(document.metadata)
            updated_freshness = dict(freshness)
            updated_freshness["pending_child_changes"] = decision.pending_after
            metadata["freshness"] = updated_freshness
            rendered = render_abstract_overview(level, dir_uri, document.body, metadata)
            raw = await _raw_if_exists(viking_fs, uri, ctx)
            if rendered != raw:
                await viking_fs.write_file(uri, rendered, ctx=ctx, lease_ref=lease)
```

</details>

**依据 2 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:43-63](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/viking_fs/_semantic.py#L43-L63)

已核查预览路径读取可见正文和未就绪提示。

<details>
<summary>查看原文（21行）</summary>

```text
        """Read a fixed summary file from an already authorized, known directory."""
        real_ctx = self._ctx_or_default(ctx)
        if real_ctx.role == Role.GLOBAL:
            ctx = self.authorize_read(real_ctx, [uri])
            if ctx.data_access is not None:
                await self._ensure_access(f"{uri.rstrip('/')}/.{field}.md", ctx)
        path = self._uri_to_path(uri, ctx=ctx)
        try:
            raw = self._handle_agfs_read(await self._async_agfs.read(f"{path}/.{field}.md"))
            return body_for_preview(self._decode_bytes(raw))
        except AbstractOverviewFormatError as exc:
            logger.warning("Malformed directory %s for %s: %s", field, uri, exc)
        except Exception as exc:
            if not is_not_found_error(exc):
                mapped = map_exception(exc, resource=uri)
                if mapped is not None:
                    raise mapped from exc
                raise
        if field == "abstract":
            return f"# {uri} [Directory abstract is not ready]"
        return f"# {uri}\n\n[Directory overview is not ready]"
```

</details>

**依据 3 · 源码核查**：[openviking/storage/queuefs/semantic_processor.py:436-451](https://github.com/volcengine/OpenViking/blob/4bd28b5783d4fd4126ae15beebf5f19730c47219/openviking/storage/queuefs/semantic_processor.py#L436-L451)

锁忙跳过和未达到立即刷新的决策都是约束。

<details>
<summary>查看原文（16行）</summary>

```text
        except LockAcquisitionError:
            logger.info(
                "Skipping best-effort parent freshness update because sidecars are busy: %s",
                parent_uri,
            )
            return

        if decision.action is not FreshnessAction.REFRESH_NOW:
            logger.debug(
                "Parent semantic refresh %s for %s (pending=%d, total=%d)",
                decision.action.value,
                parent_uri,
                decision.pending_after,
                decision.total_entries,
            )
            return
```

</details>

#### 缺口

- 没有证据表明新鲜度计数足以追踪任务所需事实，也未实测附带标记的流程。
  **影响**：不能保证提示准确或回查有净收益。
  **进一步探讨**：在锁争用、快速多次编辑和撤销编辑的样本中核对标记与原文。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
