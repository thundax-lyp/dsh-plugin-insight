# OpenViking

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5261241](https://github.com/volcengine/OpenViking/tree/52612416a9946c2b6ba38a869b01f446fbe2746e)

<!-- BEGIN META -->
[![GitHub ★ 41,264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41%2C264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking)
<!-- END META -->

> **功能**：为 AI Agent 组织知识、记忆与技能的上下文数据库。

> **亮点**：[Q01](#research-q01) 至 [Q03](#research-q03) 显示将 URI、分层读取、来源范围及可选会话检索组合为可核查的上下文机制；真实召回和节时未测。

> **主要限制**：[Q04](#research-q04) 显示特定大目录条件下摘要可暂缓刷新，锁忙时该次父聚合可能跳过；不能以摘要存在证明当前任务使用的内容新鲜。

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
  - [Q01 · 谁需要上下文数据库，相对文件检索和向量检索有什么增量？](#detail-section-11)
  - [Q02 · 资源如何摄入，等待和分层读取如何工作？](#detail-section-12)
  - [Q03 · find 与 search 如何区分，何时不能检索？](#detail-section-13)
  - [Q04 · 父目录摘要为何可能滞后，有哪些反例？](#detail-section-14)
  - [Q05 · 根平台有哪些使用条件与成本，何时适合试用？](#detail-section-15)
  - [Q06 · 能否用新鲜度感知原文回查减少关键错误？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要组织、检索并核对 Agent 上下文的开发者和平台团队。

普通文件检索提供原文，平面向量检索提供相似召回；平台组合分层目录和检索，效果需同任务比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 资源摄入 | 提交语料和处理任务 | 非等待返回不证明全部后处理完成 |
| 分层读取 | 查询摘要、概览和内容 | 某些命名空间不支持摘要 |
| 上下文检索 | 按目标与可选会话检索 | 模型、后端及全文索引条件不同 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python >=3.10 及项目依赖 | 根 Python 平台需要 | 运行服务及解析组件 | 无法运行相应部署 |
| 存储与配置的向量后端 | 相应持久化或检索需要 | 存储与查询上下文 | 模式可能不可用 |
| 模型及凭据 | 相应语义处理或意图分析需要 | 摘要、嵌入或意图生成 | 特定流程不可用或回退 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确定隔离存储、身份和模型数据边界 | 可回滚且数据外发得到允许 |
| 摄入 | 用户提交非敏感语料并检查任务状态 | 完成后核对原文、摘要和索引 |
| 查询 | 用户按 URI 搜索并核验关键原文 | 来源与版本可解释，异常时退回原文 |
| 恢复 | 运维人员检查队列、锁及备份 | 无法确认一致性时暂停依赖摘要 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 存储、部署和模型费用未知 | 配置身份、模型、摄入及索引 | 数据边界和兼容需核验 |
| 持续 | 模型、向量存储、重算费用未知 | 维护语料、权限与更新 | 任务收益与召回未测 |
| 恢复 | 备份和重建资源未知 | 核对任务、摘要和原文 | 锁与中断恢复未演练 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 上下文浏览 | URI 和分层读取接口 | 实际任务节时和语义准确性 |
| 有范围检索 | find/search 接收目标和上下文 | 后端支持和跨用户隔离效果 |
| 摘要维护 | 条件性 pending 与刷新策略 | 关键事实陈旧的实际频率 |

> **思考**：[Q04](#research-q04) 显示特定大目录条件下摘要可暂缓刷新，锁忙时该次父聚合可能跳过；不能以摘要存在证明当前任务使用的内容新鲜。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 至 [Q03](#research-q03) 显示将 URI、分层读取、来源范围及可选会话检索组合为可核查的上下文机制；真实召回和节时未测。

[Q02](#research-q02) 区分非等待返回和任务完成，[Q03](#research-q03) 使意图分析失败可回退原查询；[Q04](#research-q04) 的条件与锁争用仍需实测，不能推断端到端一致性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04) 显示特定大目录条件下摘要可暂缓刷新，锁忙时该次父聚合可能跳过；不能以摘要存在证明当前任务使用的内容新鲜。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先对非敏感可回滚语料逐步试用并核验原文；数据外发、来源或权限不明时暂停并使用原文件搜索。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本平台源码路径已检查；实际摄入、宿主集成、任务收益和新方案未验证。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、openviking/service/resource_service.py、openviking/service/fs_service.py、openviking/service/search_service.py、openviking/storage/viking_fs/_semantic.py、openviking/storage/queuefs/semantic_ops/freshness_policy.py、openviking/storage/abstract_overview.py、openviking/utils/summarizer.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定版本 README、根依赖、资源与搜索服务、分层读取和摘要策略；未执行平台、模型或网络请求，未穷尽所有后端与数据格式。工程统计所列扩展名未覆盖 Python/Go 等实际源码，不能代表完整平台代码量。
- 下一步：以固定平台、后端和隔离身份验证摄入等待、查询范围、摘要更新与锁争用；按 [Q06](#research-q06) 比较关键事实变化、误拦截、隐私和成本。

**分析版本**

- **仓库**：[volcengine/OpenViking](https://github.com/volcengine/OpenViking)
- **版本号**：未声明（[固定提交 5261241](https://github.com/volcengine/OpenViking/tree/52612416a9946c2b6ba38a869b01f446fbe2746e)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设将 freshness 状态用于关键任务的选择性原文回查，可减少陈旧摘要导致的错误；增量、代价及安全尚未验证。

以固定平台、后端和隔离身份验证摄入等待、查询范围、摘要更新与锁争用；按 [Q06](#research-q06) 比较关键事实变化、误拦截、隐私和成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 474 | 115913 | — | — | 997098 |
| .mjs | source | 19 | 4300 | 3333 | 603 | — |
| .mjs | test | 2 | 230 | 189 | 17 | — |
| .ts | source | 251 | 44171 | 37451 | 4320 | — |
| .md | test | 6 | 1126 | — | — | 6516 |
| .ts | test | 103 | 13482 | 12430 | 617 | — |
| .js | source | 8 | 649 | 496 | 102 | — |
| .md | example | 104 | 25114 | — | — | 198808 |
| .mjs | example | 335 | 85076 | 67789 | 11111 | — |
| .tsx | example | 1 | 258 | 230 | 13 | — |
| .ts | example | 121 | 35213 | 30497 | 1802 | — |
| .js | example | 2 | 2991 | 2637 | 85 | — |
| .tsx | source | 307 | 59820 | 56497 | 864 | — |
| .tsx | test | 122 | 26423 | 24603 | 686 | — |

</details>

**活跃度**

[![Issue 未关闭 399](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=399&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 354](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=354&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 181](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=181&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根上下文平台的摄入、分层查询、新鲜度与宿主边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要上下文数据库，相对文件检索和向量检索有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要复用和核对 Agent 知识、记忆或技能的开发团队。README.md:42-46、57-62 将它描述为用 viking:// 组织内容、按目录检索并在查看原文前读取目录摘要的上下文数据库。根平台的 FS 服务在 fs_service.py:1468-1482 提供 abstract 与 overview 接口并拒绝不支持的命名空间；普通文件搜索已经能查原文，平面向量检索也能按相似度召回，平台将 URI、目录、摘要及会话相关检索组合起来。它增加了上下文组织和可追溯入口，但摘要可靠性、召回准确率、用户任务收益和需求频率未经对照，不能把作者描述当作效果验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:42-46](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/README.md#L42-L46)

作者描述虚拟文件系统和目录摘要。

```text
## What is OpenViking

OpenViking is an open-source context database for AI agents — one filesystem for everything an agent knows: knowledge, memory, and skills.

Most agent memory is a black box: text goes in, embeddings come out, and nobody can see what was actually stored. OpenViking organizes context as a virtual filesystem under `viking://` instead. Agents navigate it like files — `ls`, `tree`, `read`, `write`, `grep` — and you can open any directory to inspect and edit what your agent knows. Every directory carries a generated summary, so agents can scan summaries first and decide what to read.
```

**依据 2 · 作者声明**：[README.md:57-62](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/README.md#L57-L62)

作者描述分层和会话检索。

```text
## Why OpenViking

- **One filesystem for knowledge, memory, and skills.** Resources hold documents and code; memories retain user preferences and experience; skills define how to perform tasks — not just extracted facts, but the full context, each with a `viking://` URI for browsing and retrieval. → [Viking URI](https://docs.openviking.ai/en/concepts/04-viking-uri) · [Context types](https://docs.openviking.ai/en/concepts/02-context-types)
- **Search a directory, not the whole index.** Scope semantic search to a project or memory subtree instead of scanning a flat vector pool. `find` runs a query directly; `search` plans retrieval from session context. → [Retrieval](https://docs.openviking.ai/en/concepts/07-retrieval)
- **Read the summary before the source.** Generated directory abstracts (L0) and overviews (L1) let agents judge relevance before opening full content (L2). → [Context layers](https://docs.openviking.ai/en/concepts/03-context-layers)
- **Sessions become files you can read.** Committing a session archives the conversation and extracts memories as Markdown you can inspect, edit, and merge. With VikingBot enabled, `ov compile` organizes source material into a wiki, knowledge graph, or report. → [Sessions](https://docs.openviking.ai/en/concepts/08-session) · [Context compilation](https://docs.openviking.ai/en/context-compilation/01-overview)
```

**依据 3 · 源码核查**：[openviking/service/fs_service.py:1468-1482](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/service/fs_service.py#L1468-L1482)

L0/L1 接口与不支持命名空间的限制。

<details>
<summary>查看原文（15行）</summary>

```text
    async def abstract(self, uri: str, ctx: RequestContext) -> str:
        """Read L0 abstract (.abstract.md)."""
        viking_fs = self._ensure_initialized()
        if namespace_policy_for_uri(uri).processing_mode is NamespaceProcessingMode.FILE_ONLY:
            await viking_fs._ensure_access(uri, ctx)
            raise InvalidArgumentError(f"abstract is not supported for namespace: {uri}")
        return await viking_fs.abstract(uri, ctx=ctx)

    async def overview(self, uri: str, ctx: RequestContext) -> str:
        """Read L1 overview (.overview.md)."""
        viking_fs = self._ensure_initialized()
        if namespace_policy_for_uri(uri).processing_mode is NamespaceProcessingMode.FILE_ONLY:
            await viking_fs._ensure_access(uri, ctx)
            raise InvalidArgumentError(f"overview is not supported for namespace: {uri}")
        return await viking_fs.overview(uri, ctx=ctx)
```

</details>

#### 缺口

- 缺少同任务文件和向量基线对照
  **影响**：无法判断准确率和人工时间收益
  **进一步探讨**：以同一语料和任务比较目录定位、准确性、成本及人工核验。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 资源如何摄入，等待和分层读取如何工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

resource_service.py:1691-1701 的 add_resource 默认 wait=False，可配置索引和摘要；1717-1742 验证内部字段并调用摄入提交。2171-2189 在标准来源计划存在时进入入队路径，2228-2254 在非等待模式直接返回，等待模式按 task_id 等待并区分完成、取消和错误。fs_service.py:1389-1391 提供内容读取，1468-1482 分别提供 abstract 和 overview；某些命名空间只允许文件读取。接口与队列并不能证明每个数据格式都解析正确，也不能将初始提交成功等同索引和摘要已完成；未运行具体导入或恢复。

#### 证据与依据

**依据 1 · 源码核查**：[openviking/service/resource_service.py:1691-1701](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/service/resource_service.py#L1691-L1701)

资源入口的等待和处理参数。

<details>
<summary>查看原文（11行）</summary>

```text
    async def add_resource(
        self,
        path: str,
        ctx: RequestContext,
        to: Optional[str] = None,
        parent: Optional[str] = None,
        reason: str = "",
        instruction: str = "",
        wait: bool = False,
        build_index: bool = True,
        summarize: bool = False,
```

</details>

**依据 2 · 源码核查**：[openviking/service/resource_service.py:1717-1742](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/service/resource_service.py#L1717-L1742)

校验并传递摄入请求。

<details>
<summary>查看原文（26行）</summary>

```text
        """Accept and route a new resource-add request."""
        internal_fields = sorted(set(kwargs).intersection(_INTERNAL_INGESTION_FIELDS))
        if internal_fields:
            raise InvalidArgumentError(
                "add_resource does not accept internal execution fields: "
                + ", ".join(internal_fields)
            )
        if isinstance(add_type, str):
            add_type = add_type.strip() or None
        return await self._submit_resource_ingestion(
            path=path,
            ctx=ctx,
            add_type=add_type,
            to=to,
            parent=parent,
            reason=reason,
            instruction=instruction,
            wait=wait,
            build_index=build_index,
            summarize=summarize,
            processing_mode=processing_mode,
            watch_interval=watch_interval,
            is_active=is_active,
            acl=acl,
            manage_watch=True,
            tags=tags,
```

</details>

**依据 3 · 源码核查**：[openviking/service/resource_service.py:2170-2189](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/service/resource_service.py#L2170-L2189)

标准来源计划及入队。

<details>
<summary>查看原文（20行）</summary>

```text
            normalized_args.watch_auth_state = watch_auth_state
            source_plan = await self._prepare_standard_source_plan(
                path=path,
                ctx=ctx,
                mode=mode,
                allow_local_path_resolution=allow_local_path_resolution,
                processor_kwargs=kwargs,
                watch_auth_state=normalized_args.watch_auth_state,
                shared_source=shared_source,
            )
        if source_plan is not None:
            result = await self._enqueue_source_plan(
                source_plan,
                ctx=ctx,
                to=target_to,
                parent=target_parent,
                create_parent=target_create_parent,
                reason=reason,
                instruction=instruction,
                build_index=build_index,
```

</details>

**依据 4 · 源码核查**：[openviking/service/resource_service.py:2228-2254](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/service/resource_service.py#L2228-L2254)

非等待直接返回，等待时检查任务状态。

<details>
<summary>查看原文（27行）</summary>

```text
                acl=acl,
                **kwargs,
            )
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

**依据 5 · 源码核查**：[openviking/service/fs_service.py:1468-1482](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/service/fs_service.py#L1468-L1482)

摘要与概览接口的命名空间门槛。

<details>
<summary>查看原文（15行）</summary>

```text
    async def abstract(self, uri: str, ctx: RequestContext) -> str:
        """Read L0 abstract (.abstract.md)."""
        viking_fs = self._ensure_initialized()
        if namespace_policy_for_uri(uri).processing_mode is NamespaceProcessingMode.FILE_ONLY:
            await viking_fs._ensure_access(uri, ctx)
            raise InvalidArgumentError(f"abstract is not supported for namespace: {uri}")
        return await viking_fs.abstract(uri, ctx=ctx)

    async def overview(self, uri: str, ctx: RequestContext) -> str:
        """Read L1 overview (.overview.md)."""
        viking_fs = self._ensure_initialized()
        if namespace_policy_for_uri(uri).processing_mode is NamespaceProcessingMode.FILE_ONLY:
            await viking_fs._ensure_access(uri, ctx)
            raise InvalidArgumentError(f"overview is not supported for namespace: {uri}")
        return await viking_fs.overview(uri, ctx=ctx)
```

</details>

#### 缺口

- 未执行文件导入、队列失败和断电恢复
  **影响**：无法判断实际格式覆盖、完成率或一致性
  **进一步探讨**：在隔离平台比较异步与等待模式并注入任务失败和中断。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · find 与 search 如何区分，何时不能检索？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

SearchService.find 在 search_service.py:209-222、235-246 接受请求上下文、目标 URI 和过滤条件并调用 VikingFS.find；search 的 178-205 在 intent 开启、会话存在且非图片查询时才获取 session_info，随后调用 VikingFS.search。_semantic.py:385-393、409-437 默认保留原查询，在意图分析失败时回落原查询；不应将所有 search 都说成调用模型。search_service.py:114-126 对关键词搜索检查支持该模式的向量后端和全文索引，条件不满足抛错。源代码说明路径与失败分支，不能证明隔离、召回质量或所有后端可用。

#### 证据与依据

**依据 1 · 源码核查**：[openviking/service/search_service.py:114-126](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/service/search_service.py#L114-L126)

关键词模式有后端及全文索引条件。

<details>
<summary>查看原文（13行）</summary>

```text
    async def ensure_keywords_search_supported(self, ctx: RequestContext) -> None:
        """Validate keyword-search support at the top-level request boundary."""
        viking_fs = self._ensure_initialized()
        vector_store = viking_fs._get_vector_store()
        if not vector_store or not await viking_fs._collection_has_fulltext(
            vector_store,
            ctx,
            supported_modes=("volcengine", "vikingdb", "opengauss"),
            raise_on_error=True,
        ):
            raise InvalidArgumentError(
                "Keyword search is not supported by the configured vector backend, or full-text "
                "indexing is not enabled for the content field."
```

</details>

**依据 2 · 源码核查**：[openviking/service/search_service.py:178-205](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/service/search_service.py#L178-L205)

搜索的会话与 intent 条件。

<details>
<summary>查看原文（28行）</summary>

```text
        if search_type == "keywords" and image_url:
            raise InvalidArgumentError("image_url is not supported when search_type='keywords'")
        resolved_image_url = await self._resolve_image_url(image_url, ctx)
        _validate_query(query, resolved_image_url)
        _reject_system_targets(target_uri)
        if search_type == "keywords":
            await self.ensure_keywords_search_supported(ctx)
        viking_fs = self._ensure_initialized()

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

**依据 3 · 源码核查**：[openviking/service/search_service.py:209-222](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/service/search_service.py#L209-L222)

find 不带会话上下文。

<details>
<summary>查看原文（14行）</summary>

```text
    async def find(
        self,
        query: str,
        ctx: RequestContext,
        target_uri: Union[str, List[str]] = "",
        limit: int = 10,
        score_threshold: Optional[float] = None,
        filter: Optional[Dict] = None,
        level: Optional[List[int]] = None,
        image_url: str | list[str] | None = None,
        events_time_decay_protection: Optional[str] = None,
        search_type: SearchType = "semantic",
    ) -> Any:
        """Search without session context.
```

</details>

**依据 4 · 源码核查**：[openviking/service/search_service.py:235-246](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/service/search_service.py#L235-L246)

find 验证参数后调用底层。

<details>
<summary>查看原文（12行）</summary>

```text
        if search_type == "keywords" and image_url:
            raise InvalidArgumentError("image_url is not supported when search_type='keywords'")
        resolved_image_url = await self._resolve_image_url(image_url, ctx)
        _validate_query(query, resolved_image_url, filter)
        _reject_system_targets(target_uri)
        viking_fs = self._ensure_initialized()
        result = await viking_fs.find(
            query=query,
            ctx=ctx,
            target_uri=target_uri,
            limit=limit,
            score_threshold=score_threshold,
```

</details>

**依据 5 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:409-437](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/storage/viking_fs/_semantic.py#L409-L437)

可选意图分析及异常回退。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

#### 缺口

- 没有固定后端与多租户宿主实验
  **影响**：召回质量、权限隔离及回退效果未知
  **进一步探讨**：固定后端、同语料和用户身份测范围、过滤、失败及召回。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 父目录摘要为何可能滞后，有哪些反例？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

freshness_policy.py:28-62 对 L0 未变或无变化返回 NOOP；无基线、强制刷新或目录不大于抽样上限时立即刷新。对于已有基线且超过上限的目录，只有累计变化事件与条目总数之比达到阈值才刷新，否则标记 pending；计数是事件数，不是去重子项数。abstract_overview.py:748-776 保留较大的 pending 值并将新计数写回。summarizer.py:158-175 仅当 force_refresh 不是 None 时走此决策，并在锁获取失败时跳过该次父目录聚合；文件变化仍进入后续工作，不能把此分支外推为所有写入或永久丢失。关键事实反转在阈值前可能不反映到父摘要是条件风险，实际错误路由和恢复时效未测。

#### 证据与依据

**依据 1 · 源码核查**：[openviking/storage/queuefs/semantic_ops/freshness_policy.py:28-62](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/storage/queuefs/semantic_ops/freshness_policy.py#L28-L62)

比较变化事件比例，包含强制和小目录例外。

<details>
<summary>查看原文（35行）</summary>

```text
def decide_parent_refresh(
    *,
    l0_body_changed: bool,
    has_freshness_baseline: bool,
    total_entries: int,
    pending_before: int,
    current_change_count: int,
    overview_sample_limit: int,
    refresh_ratio: float,
    force_refresh: bool = False,
) -> FreshnessDecision:
    """Decide whether a parent aggregation should run.

    ``pending_child_changes`` intentionally counts events rather than unique
    children. For wide directories the equivalent integer threshold is
    ``ceil(refresh_ratio * total_entries)``; comparing the ratio directly
    avoids carrying another derived configuration value.
    """

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

**依据 2 · 源码核查**：[openviking/storage/abstract_overview.py:748-776](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/storage/abstract_overview.py#L748-L776)

保存 pending 的更新。

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

**依据 3 · 源码核查**：[openviking/utils/summarizer.py:158-177](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/utils/summarizer.py#L158-L177)

有条件策略调用及锁争用时跳过父聚合。

<details>
<summary>查看原文（20行）</summary>

```text
            semantic_action = FreshnessAction.REFRESH_NOW
            if force_refresh is not None:
                semantic_config = get_openviking_config().semantic
                try:
                    decision = await plan_abstract_overview_refresh(
                        viking_fs=get_viking_fs(),
                        dir_uri=parent_uri,
                        changed_entries=len(parent_changes),
                        ctx=ctx,
                        overview_sample_limit=getattr(semantic_config, "overview_sample_limit", 32),
                        refresh_ratio=getattr(semantic_config, "freshness_refresh_ratio", 0.10),
                        force_refresh=force_refresh,
                    )
                    semantic_action = decision.action
                except LockAcquisitionError:
                    # Parent aggregation is best-effort; changed-file work still runs.
                    logger.info("Skipping busy parent semantic refresh: %s", parent_uri)
                    semantic_action = FreshnessAction.NOOP
            parent_actions[parent_uri] = semantic_action.value
            aggregate_directory = semantic_action is FreshnessAction.REFRESH_NOW
```

</details>

#### 缺口

- 没有真实索引、并发锁及不同目录大小实验
  **影响**：未知陈旧摘要导致的误选频率与恢复延迟
  **进一步探讨**：控制语料更新顺序、锁争用和读取时点并检查原文及摘要。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 根平台有哪些使用条件与成本，何时适合试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

pyproject.toml:11-15、31-55 声明根包为 openviking 上下文数据库、Python >=3.10 及 SDK、网络、解析、模型等依赖；README.md:130-145 的服务安装说明还要求选择模型提供方与密钥。具体检索和摄入还依赖配置的存储、模型和后端支持，不能把声明的依赖等同实际可用性。对有平台运维与数据治理能力的团队，可先用非敏感小语料、限定身份和可回滚副本试用，核对原文与任务结果，再比较文件检索。模型调用、存储、部署、权限管理和恢复均有现金或人工成本，金额与耗时未知；数据不允许外发或来源、权限无法核对时停止并回退原文件搜索。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:11-15](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/pyproject.toml#L11-L15)

根平台身份及 Python 约束。

```text
[project]
name = "openviking"
dynamic = ["version", "readme"]
description = "An Agent-native context database"
requires-python = ">=3.10"
```

**依据 2 · 源码核查**：[pyproject.toml:31-55](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/pyproject.toml#L31-L55)

平台依赖包括 SDK、解析、服务与模型库。

<details>
<summary>查看原文（25行）</summary>

```text
dependencies = [
    "aiohttp>=3.13.3",
    "async-timeout>=5.0.1",
    "orjson>=3.11.7",
    "packaging>=24.0",
    "openviking-sdk>=0.1.17",
    "pydantic>=2.0.0",
    "typing-extensions>=4.5.0",
    "pyyaml>=6.0",
    "httpx>=0.25.0",
    "pdfplumber>=0.10.0",
    "scrapy>=2.11.0",
    "trafilatura>=1.12.0",
    "feedparser>=6.0.0",
    "defusedxml>=0.7.1",
    "cairosvg>=2.9.1",
    "openai>=1.0.0",
    "requests>=2.33.0",
    "charset-normalizer>=3.4,<4",
    "firecrawl-anydoc>=0.2.4,<0.3",
    "json-repair>=0.25.0",
    "apscheduler>=3.11.0",
    "volcengine>=1.0.216",
    "volcengine-python-sdk[ark]>=5.0.3",
    "fastapi>=0.128.0",
```

</details>

**依据 3 · 作者声明**：[README.md:130-145](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/README.md#L130-L145)

作者安装说明要求用户确定模型及密钥。

<details>
<summary>查看原文（16行）</summary>

````text
<summary><strong>Let your agent deploy it</strong></summary>

```text
Follow this guide to install and start an OpenViking Server for me:

https://docs.openviking.ai/en/getting-started/04-setup-for-agent

Ask me for the model provider, the models, the workspace directory and whether
other machines need to reach the server; don't guess. When you ask for the model
API key, tell me how to hand it over if I'd rather not paste it into this chat,
and never repeat it back.

When it's running, tell me the server's address and whether auth is turned on.
```

Your agent will first ask which model provider to use and for its API key.
````

</details>

#### 缺口

- 未运行平台、外部服务或实际用户任务
  **影响**：兼容性、成本及净收益未知
  **进一步探讨**：用固定平台、后端和隔离语料验收并记录完整费用与恢复时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否用新鲜度感知原文回查减少关键错误？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已存在的比例 pending 和强制刷新（Q04）是直接反证，单纯再加一个刷新阈值没有增量。未验证方案是在消费摘要做任务决策时附带来源及 freshness 状态：当摘要存在 pending、缺基线或 freshness 不可读且任务被标为关键时，对相关原文再读取并显式对照；一般查询沿现有策略，原文不可取则返回待核验而非宣称新鲜。该方案依赖可靠读取状态、权限与可信关键任务分类，增加原文访问、token 和泄露面；没有证据证明现有接口已把这一门控接入决策。可使用相同版本、语料和更新序列，对照现有比例策略、每次强制刷新和选择性回查，覆盖小目录、缺基线、大目录单项关键反转、锁争用、无读取权限与无变化；记录关键错误、误拦截、模型/存储开销和延迟。若关键反转仍漏报、无法正确标出未知/拒绝读取、隐私边界不可接受，或开销不低于全部刷新且收益无改善，则否定方案；尚未实现或实测。

#### 证据与依据

**依据 1 · 源码核查**：[openviking/storage/queuefs/semantic_ops/freshness_policy.py:47-62](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/storage/queuefs/semantic_ops/freshness_policy.py#L47-L62)

已有 pending 与强制刷新是方案对照。

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

**依据 2 · 源码核查**：[openviking/storage/abstract_overview.py:748-776](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/storage/abstract_overview.py#L748-L776)

保存 pending，但不能据此证明消费时已回查原文。

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

**依据 3 · 源码核查**：[openviking/service/fs_service.py:1468-1482](https://github.com/volcengine/OpenViking/blob/52612416a9946c2b6ba38a869b01f446fbe2746e/openviking/service/fs_service.py#L1468-L1482)

已有分层读取接口及边界。

<details>
<summary>查看原文（15行）</summary>

```text
    async def abstract(self, uri: str, ctx: RequestContext) -> str:
        """Read L0 abstract (.abstract.md)."""
        viking_fs = self._ensure_initialized()
        if namespace_policy_for_uri(uri).processing_mode is NamespaceProcessingMode.FILE_ONLY:
            await viking_fs._ensure_access(uri, ctx)
            raise InvalidArgumentError(f"abstract is not supported for namespace: {uri}")
        return await viking_fs.abstract(uri, ctx=ctx)

    async def overview(self, uri: str, ctx: RequestContext) -> str:
        """Read L1 overview (.overview.md)."""
        viking_fs = self._ensure_initialized()
        if namespace_policy_for_uri(uri).processing_mode is NamespaceProcessingMode.FILE_ONLY:
            await viking_fs._ensure_access(uri, ctx)
            raise InvalidArgumentError(f"overview is not supported for namespace: {uri}")
        return await viking_fs.overview(uri, ctx=ctx)
```

</details>

#### 缺口

- 未实现消费侧门控或验证其接口与收益
  **影响**：不能推定可行性、成本或安全性
  **进一步探讨**：用相同语料构造关键变化及权限失败，对照比例策略和全量刷新。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
