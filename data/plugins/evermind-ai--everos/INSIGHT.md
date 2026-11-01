# EverOS

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[962c63e](https://github.com/EverMind-AI/EverOS/tree/962c63eeaae5093b495a4763c161f8b046d41bc2)

<!-- BEGIN META -->
[![GitHub ★ 13,732](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13%2C732&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EverMind-AI/EverOS)
<!-- END META -->

> **功能**：面向 Agent 和应用的本地优先 Markdown 记忆服务与检索框架。

> **亮点**：把记忆提取、可读 Markdown、后台索引与查询接入同一服务；不能把 DSH 外部插件、模型或数据库归因于本仓。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：异步索引与生成记忆是否足够准确、及时且可恢复，收益能否覆盖模型和维护成本？[Q02](#research-q02) [Q04](#research-q04)

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
  - [Q01 · 谁使用 EverOS，和 DSH 插件是什么关系？](#detail-section-11)
  - [Q02 · add 和 flush 的完成语义如何区分？](#detail-section-12)
  - [Q03 · 检索如何分流，何时依赖额外模型？](#detail-section-13)
  - [Q04 · 部署、数据保护与运维条件是什么？](#detail-section-14)
  - [Q05 · 可归因贡献是什么，如何验证新假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为 Agent 或应用引入跨会话记忆的开发者，通过本地服务写入并检索记忆；DSH 插件为独立仓库。[Q01](#research-q01)

相较手工 Markdown 或直接接数据库，本项目组合提取、索引与查询；底层模型和数据库属于依赖。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 记忆写入 | 接收会话并提取记忆 | 202 仅接受；处理可能失败 |
| 搜索 | 按 owner 和方法查询 | 方法依赖不同 provider 和索引状态 |
| 本地持久化 | 保存 Markdown 与派生数据 | 明文保护和备份由部署方负责 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python 3.12 与本地存储栈 | 必需 | 服务、队列和数据 | 无法启动或持久化 |
| LLM provider | 记忆提取示例需要 | 生成记忆 | 无法完成对应提取 |
| embedding、rerank | 特定检索功能需要 | 向量和排序 | 缺失时报配置错误 |
| 独立 DSH 集成 | 在 DSH 使用时需要 | 桥接主服务 | 固定主仓不能证明连接 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者配置隔离数据根和模型 | 版本、权限与费用明确 |
| 写入 | 调用 add 和 flush | 202 时按 request_id 查询最终任务状态 |
| 检索 | 等待索引后用 keyword 验证 | 核对返回内容与原始文件 |
| 恢复 | 测试备份和重启 | 状态或结果不一致时暂停导入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型调用和存储费用未知 | 配置、隔离及备份 | DSH 桥接未验证 |
| 持续 | 模型、磁盘和索引成本未知 | 检查记忆质量及运维 | 不推算节时 |
| 恢复 | 重建及模型费用未知 | 检查文件、队列与索引 | 中断恢复未测试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 记忆写入 | 内联及受限异步队列 | 生成内容准确及最终恢复 |
| 检索 | owner 过滤及 provider 检查 | 召回质量、隔离和追平延迟 |

> **思考**：异步索引与生成记忆是否足够准确、及时且可恢复，收益能否覆盖模型和维护成本？[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把记忆提取、可读 Markdown、后台索引与查询接入同一服务；不能把 DSH 外部插件、模型或数据库归因于本仓。[Q01](#research-q01) [Q03](#research-q03)

有受限 inbox、按会话积压排序、重试和任务查询；Markdown 到派生索引异步，队列成功并不自动证明索引可见。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

异步索引与生成记忆是否足够准确、及时且可恢复，收益能否覆盖模型和维护成本？[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离数据根，用低敏样例测试 add、flush、任务状态及检索；核对文件、成本与备份，DSH 桥接需单独验收。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

仅固定源码和作者文档支持代表路径；未执行宿主、DSH 集成、模型或恢复实验。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、src/everos/entrypoints/api/routes/search.py、src/everos/entrypoints/api/routes/memorize.py、src/everos/service/memory/__init__.py、src/everos/service/memory/_queue.py、src/everos/service/memory/_queue_steps.py、src/everos/entrypoints/api/routes/tasks.py、docs/architecture.md、src/everos/memory/search/manager.py、SECURITY.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交代表性 API、队列、检索与安全文档；未逐一审计全部 1122 个 tracked 文件、外部 DSH 集成和其他存储后端。材料 inventory 的 116 文件按研究规范统计 Markdown 和指定 JS/TS 扩展名；Python 等其他语言不纳入，不能当全语言代码规模；未执行目标。
- 下一步：验证隔离环境写入、排队失败、重启恢复、索引可见性和权限，再固定外部 DSH 插件做单独接入验收。

**分析版本**

- **仓库**：[EverMind-AI/EverOS](https://github.com/EverMind-AI/EverOS)
- **版本号**：未声明（[固定提交 962c63e](https://github.com/EverMind-AI/EverOS/tree/962c63eeaae5093b495a4763c161f8b046d41bc2)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

假设向调用者暴露逐记忆索引可见性水位可减少已保存但不可搜索的误判；对照注入延迟时的误判、等待与维护成本，不改善则否定。[Q05](#research-q05)

验证隔离环境写入、排队失败、重启恢复、索引可见性和权限，再固定外部 DSH 插件做单独接入验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 66 | 15221 | — | — | 89043 |
| .mjs | source | 1 | 199 | 179 | 1 | — |
| .mjs | test | 1 | 197 | 175 | 14 | — |
| .md | example | 3 | 196 | — | — | 1293 |
| .js | source | 17 | 2832 | 1862 | 585 | — |
| .cjs | source | 2 | 35 | 35 | 0 | — |
| .ts | source | 17 | 3332 | 2621 | 316 | — |
| .tsx | source | 9 | 1032 | 918 | 28 | — |

</details>

**活跃度**

[![Issue 未关闭 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=29&color=737b86&logo=github)](https://github.com/EverMind-AI/EverOS/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=27&color=737b86&logo=github)](https://github.com/EverMind-AI/EverOS/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 46](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=46&color=737b86&logo=github)](https://github.com/EverMind-AI/EverOS/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 EverOS 记忆写入、异步队列、索引检索及采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用 EverOS，和 DSH 插件是什么关系？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

为 Agent 或应用增加跨会话记忆的开发者，可将 EverOS 用作独立 Python 库或本地服务，通过接口写入并查询记忆。它是记忆基础设施而非 DSH 插件；作者列出的 DSH 集成链接指向另一个仓库，本次固定主仓不能证明该插件当前兼容或自动接入。与手工维护 Markdown 相比，它增加提取、索引与检索流程，但产生的记忆质量和维护节省尚未对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-43](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/README.md#L37-L43)

作者介绍 Python 本地记忆运行时与存储形态。

```text
## Why EverOS

EverOS is a Python library and local-first memory runtime for agents and
makers. It gives one portable memory layer across coding assistants, apps,
devices, and workflows from day one. It stores conversations, files, and agent
trajectories as readable Markdown, then syncs local SQLite and LanceDB indexes
for fast retrieval and self-evolving reuse.
```

**依据 2 · 作者声明**：[README.md:92-100](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/README.md#L92-L100)

DSH 集成链接在独立仓库。

```text
EverOS adds durable memory to the agent and workflow platforms below—and comes
built into Raven. Choose an integration to open its setup guide.

<table width="100%">
<tr>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/plugins/tree/main/dsh"><img src="https://avatars.githubusercontent.com/u/148330874?s=200&amp;v=4" alt="DeepSeek Harness" width="72"><br><strong>DeepSeek Harness</strong></a></td>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/plugins/tree/main/hermes"><img src="https://github.com/user-attachments/assets/477eebc4-e615-4425-921e-368d7667e491" alt="Hermes" width="72"><br><strong>Hermes</strong></a></td>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/plugins/tree/main/openclaw"><img src="https://github.com/user-attachments/assets/01d948fe-1e2b-48e8-9b32-b8057cb3f336" alt="OpenClaw" width="72"><br><strong>OpenClaw</strong></a></td>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/Raven"><img src="https://github.com/user-attachments/assets/27e1ea63-69d4-48b3-a884-7f0355926907" alt="Raven" width="72"><br><strong>Raven</strong></a></td>
```

**依据 3 · 源码核查**：[pyproject.toml:1-7](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/pyproject.toml#L1-L7)

Python 项目、版本和运行要求。

```text
[project]
name = "everos"
version = "1.6.0"
description = "EverOS — local-first markdown memory framework for AI agents and user chats; lightweight, dev-friendly, small-team"
license = {text = "Apache-2.0"}
readme = "README.md"
requires-python = ">=3.12"
```

**依据 4 · 源码核查**：[src/everos/entrypoints/api/routes/search.py:15-22](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/entrypoints/api/routes/search.py#L15-L22)

提供搜索 API 并委派给 memory 服务。

```text

router = APIRouter(prefix="/memory", tags=["memory"])


@router.post("/search", response_model=SearchResponse)
async def post_search(req: SearchRequest, app: ApplicationDep) -> SearchResponse:
    """Hybrid retrieval across the configured memory backends."""
    return await app.memory.search(req)
```

#### 缺口

- 未检查或运行外部 DSH 插件，也无人工维护方案对照。
  **影响**：结论限于固定源码与作者声明，不证明实际运行结果。
  **进一步探讨**：在固定 DSH 与独立插件版本下验证端到端接入，并对照任务质量和维护时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · add 和 flush 的完成语义如何区分？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

API add 将请求交给 MemoryService，按 async_mode 和同会话积压选择内联或排队；flush 有积压时也进入队列。排队路径先把请求写进 inbox 并返回 HTTP 202 与 request_id，代表已接受而非提取或检索已完成；任务接口按该 ID 查询结果并可能因过期返回 404。worker 失败按配置重试、最终标记 failed 或 success，排队有大小和容量上限，413/429 表示未接受。作者架构说明 Markdown 写入与后续索引和其他副作用非原子提交；不能把一次 202、flush 或轮询成功直接当作每个索引已可查。

#### 证据与依据

**依据 1 · 源码核查**：[src/everos/entrypoints/api/routes/memorize.py:31-56](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/entrypoints/api/routes/memorize.py#L31-L56)

202、413 与 429 响应形态。

<details>
<summary>查看原文（26行）</summary>

```text
def _accepted(
    response: Response, request_id: str, queued: Queued
) -> SuccessEnvelope[AcceptedResponseData]:
    response.status_code = HTTP_202_ACCEPTED
    return SuccessEnvelope(
        request_id=request_id,
        data=AcceptedResponseData(
            message_count=queued.message_count, pending=queued.pending
        ),
    )


_ADD_RESPONSES: dict[int | str, dict[str, Any]] = {
    202: {
        "model": SuccessEnvelope[AcceptedResponseData],
        "description": "Queued: async_mode, or the session already had a backlog",
    },
    413: {"description": "Body over memorize.async_queue.max_payload_bytes"},
    429: {"description": "Queue at its per-session or global cap"},
}
_FLUSH_RESPONSES: dict[int | str, dict[str, Any]] = {
    202: {
        "model": SuccessEnvelope[AcceptedResponseData],
        "description": "Queued behind the session's backlog, how a flush is queued",
    },
    429: {"description": "Queue at its per-session or global cap"},
```

</details>

**依据 2 · 源码核查**：[src/everos/entrypoints/api/routes/memorize.py:60-75](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/entrypoints/api/routes/memorize.py#L60-L75)

add 委派且 queued 时返回 202。

<details>
<summary>查看原文（16行）</summary>

```text
@router.post("/add", responses=_ADD_RESPONSES)
async def add_memory(
    req: Annotated[MemorizeAddRequest, ...],
    response: Response,
    app: ApplicationDep,
    request_id: RequestIdDep,
) -> SuccessEnvelope[AddResponseData] | SuccessEnvelope[AcceptedResponseData]:
    """Add messages into the user-memory + agent-memory pipelines."""
    result = await app.memory.add(
        req.model_dump(exclude={"async_mode", "defer_extraction"}),
        request_id=request_id,
        async_mode=req.async_mode,
        defer_extraction=req.defer_extraction,
    )
    if isinstance(result, Queued):
        return _accepted(response, request_id, result)
```

</details>

**依据 3 · 源码核查**：[src/everos/service/memory/__init__.py:194-243](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/service/memory/__init__.py#L194-L243)

add 与 flush 根据积压选择队列或内联。

<details>
<summary>查看原文（50行）</summary>

```text
    async def add(
        self,
        payload: dict[str, Any],
        *,
        request_id: str,
        async_mode: bool,
        defer_extraction: bool,
    ) -> MemorizeResult | Queued:
        """Run one ``/add`` inline, or queue it.

        Queued when the caller asked for ``async_mode`` and the queue takes
        async work, **or** the session already has queued requests: running
        inline then would overtake requests the client was told are
        accepted.

        Raises:
            PayloadTooLargeError: Queued, and the body is over the limit.
            QueueSaturatedError: Queued, and the session or queue is full.
        """
        if (async_mode and self.accepts_async) or await self._has_backlog(payload):
            return await self._queue_request(
                payload,
                request_id=request_id,
                is_final=False,
                defer_extraction=defer_extraction,
            )
        return await self._memorize(payload, defer_extraction=defer_extraction)

    async def flush(
        self,
        *,
        session_id: str,
        request_id: str,
        app_id: str = "default",
        project_id: str = "default",
    ) -> FlushResult | Queued:
        """Run one ``/flush`` inline, or queue it behind the session's backlog.

        A flush has no ``async_mode`` (the Cloud API has none either); it is
        queued only when earlier requests of the session still are.

        Raises:
            QueueSaturatedError: Queued, and the session or queue is full.
        """
        payload = flush_payload(session_id, app_id, project_id)
        if await self._has_backlog(payload):
            return await self._queue_request(
                payload, request_id=request_id, is_final=True, defer_extraction=False
            )
        return await self._flush_inline(
```

</details>

**依据 4 · 源码核查**：[src/everos/service/memory/_queue.py:126-155](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/service/memory/_queue.py#L126-L155)

入队前限额并写 inbox。

<details>
<summary>查看原文（30行）</summary>

```text
    async def enqueue(
        self,
        payload: dict[str, Any],
        *,
        request_id: str,
        is_final: bool,
        defer_extraction: bool,
    ) -> int:
        """Persist one request as a ``queued`` row and wake the worker.

        Returns the session's unfinished row count, this row included.
        Raises :class:`PayloadTooLargeError` (413) or
        :class:`QueueSaturatedError` (429) **before** inserting; a rejected
        batch was never accepted and the caller must keep it.
        """
        body = encode_payload(payload, max_bytes=self._cfg.max_payload_bytes)
        session = SessionKey(
            app_id=str(payload.get("app_id", "default")),
            project_id=str(payload.get("project_id", "default")),
            session_id=str(payload["session_id"]),
        )
        pending = await admit(self._inbox, session, self._cfg)
        row = await self._inbox.enqueue(
            session,
            request_id=request_id,
            is_final=is_final,
            defer_extraction=defer_extraction,
            payload_json=body,
            message_count=len(payload.get("messages") or []),
        )
```

</details>

**依据 5 · 源码核查**：[src/everos/service/memory/_queue_steps.py:195-245](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/service/memory/_queue_steps.py#L195-L245)

队列交付重试并标记最终状态。

<details>
<summary>查看原文（51行）</summary>

```text
async def _deliver_with_retries(
    row: MemorizeTask,
    *,
    deliver: Deliver,
    mark: Callable[..., Awaitable[None]],
    cfg: AsyncQueueSettings,
) -> None:
    assert row.id is not None
    for attempt in range(1, cfg.max_attempts + 1):
        try:
            # Inside the try: a row whose body was hand-edited into
            # garbage fails with that reason, not the whole pass.
            payload = json.loads(row.payload_json)
            await deliver(
                payload,
                is_final=row.is_final,
                defer_extraction=row.defer_extraction,
            )
        except Exception as exc:
            error = error_summary(exc)
            if attempt < cfg.max_attempts:
                await mark(
                    row.id,
                    status="processing",
                    attempt=attempt,
                    last_error=error,
                )
                logger.warning(
                    "memorize_queue_retry",
                    row_id=row.id,
                    session_id=row.session_id,
                    attempt=attempt,
                    error=error,
                )
                await asyncio.sleep(cfg.retry_backoff_seconds)
                continue
            # One write: a lost second write would let the sweep overwrite
            # a known failure with "outcome unknown".
            await mark(row.id, status="failed", attempt=attempt, last_error=error)
            logger.error(
                "memorize_queue_failed",
                row_id=row.id,
                session_id=row.session_id,
                attempts=attempt,
                message_count=row.message_count,
                error=error,
            )
            return
        # Drop the body: nothing reads a delivered row's payload, and
        # keeping it would hold seven days of request bodies on disk.
        await mark(row.id, status="success", attempt=attempt, payload_json="")
```

</details>

**依据 6 · 源码核查**：[src/everos/entrypoints/api/routes/tasks.py:51-65](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/entrypoints/api/routes/tasks.py#L51-L65)

request_id 查询状态且过期可能 404。

<details>
<summary>查看原文（15行）</summary>

```text
@router.get("/{task_id}")
async def task_status(
    task_id: str,
    app: ApplicationDep,
    request_id: RequestIdDep,
) -> SuccessEnvelope[TaskItem]:
    """One accepted request's outcome.

    ``404`` once it has aged out of ``memorize.async_queue.row_retention_hours``
    (or never existed).
    """
    item = await app.ops.get_task(task_id)
    if item is None:
        raise NotFoundError(f"task {task_id} not found or expired")
    return SuccessEnvelope(request_id=request_id, data=item)
```

</details>

**依据 7 · 作者声明**：[docs/architecture.md:200-220](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/docs/architecture.md#L200-L220)

作者说明 Markdown 写入与异步索引之间的非原子边界。

<details>
<summary>查看原文（21行）</summary>

````text
1. MemoryService.add          (entrypoint of write path)
       │
       ▼
2. memory.extract.pipeline    (calls everalgo)
       │
       ▼
3. infra.persistence.markdown.write       (file persistence)
       │  service coordinates results and follow-up events
       │
   ┌───┴────┐
   │        │
   ▼        ▼
4a. SQLite   4b. infra.cascade  (async daemon)
    audit        watches md → diff entries → index sync
```

Markdown is the source for derived index content. Cascade uses a persisted
change queue and reconciliation to synchronize the index asynchronously.
A durable file write does not atomically commit event publication, SQLite
state, or every downstream result. Neither this flow nor eventual consistency
alone proves that every interrupted operation will recover.
````

</details>

#### 缺口

- 没有中断、磁盘写失败、重启恢复及读后可见性实验。
  **影响**：结论限于固定源码与作者声明，不证明实际运行结果。
  **进一步探讨**：测试 202 后失败、积压 flush、进程中断重启和索引追平，逐步核对文件和查询。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 检索如何分流，何时依赖额外模型？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

搜索 API 委派至 SearchManager；它先编译 owner、app、project 等过滤条件并校验配置，再分别取用户 episode/profile 或 Agent case/skill 和未处理消息。keyword 路径与 hybrid/vector 的依赖不同：vector、hybrid 等需要 embedding，默认 Agent hybrid 还要求 rerank，缺失时报配置错误。作者称 Markdown 是派生索引内容的来源，cascade 异步同步；生成内容正确性、索引追平及租户隔离不能由静态接线证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/everos/entrypoints/api/routes/search.py:15-22](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/entrypoints/api/routes/search.py#L15-L22)

搜索路由接入服务。

```text

router = APIRouter(prefix="/memory", tags=["memory"])


@router.post("/search", response_model=SearchResponse)
async def post_search(req: SearchRequest, app: ApplicationDep) -> SearchResponse:
    """Hybrid retrieval across the configured memory backends."""
    return await app.memory.search(req)
```

**依据 2 · 源码核查**：[src/everos/service/memory/__init__.py:135-139](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/service/memory/__init__.py#L135-L139)

服务委派 SearchManager。

```text
    # ── read use cases ─────────────────────────────────────────────────────

    async def search(self, req: SearchRequest) -> SearchResponse:
        """Hybrid retrieval across the configured memory backends."""
        return await self._search_manager.search(req)
```

**依据 3 · 源码核查**：[src/everos/memory/search/manager.py:200-253](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/memory/search/manager.py#L200-L253)

过滤、校验与用户/Agent 分支。

<details>
<summary>查看原文（54行）</summary>

```text
    async def search(self, req: SearchRequest) -> SearchResponse:
        request_id = resolve_request_id()
        with memory_span(
            "everos.memory.search",
            observation_type="retriever",
            session_id=_extract_top_level_session_id(req.filters),
            user_id=req.user_id,
            metadata={
                "request_id": request_id,
                "app_id": req.app_id,
                "project_id": req.project_id,
                "agent_id": req.agent_id,
                "owner_type": req.owner_type,
                "method": req.method.value,
            },
        ) as span:
            # Content (query text) only when capture_content is on.
            capture_input(
                span,
                {"query": req.query, "top_k": req.top_k, "method": req.method.value},
            )
            # Compile filters first: a malformed `filters` payload is a user
            # input error (422) and should surface before the server-side
            # component guard (500). The two steps are independent.
            where = compile_filters(
                req.filters,
                owner_id=req.owner_id,
                owner_type=req.owner_type,
                app_id=req.app_id,
                project_id=req.project_id,
            )
            self._validate_components(req)

            if req.owner_type == "user":
                episodes, profiles, unprocessed = await asyncio.gather(
                    self._search_episodes(req, where),
                    self._fetch_profile(req),
                    self._load_unprocessed(req),
                )
                data = SearchData(
                    episodes=episodes,
                    profiles=profiles,
                    unprocessed_messages=unprocessed,
                )
            else:  # "agent"
                (cases, skills), unprocessed = await asyncio.gather(
                    self._search_cases_and_skills(req, where),
                    self._load_unprocessed(req),
                )
                data = SearchData(
                    agent_cases=cases,
                    agent_skills=skills,
                    unprocessed_messages=unprocessed,
                )
```

</details>

**依据 4 · 源码核查**：[src/everos/memory/search/manager.py:761-799](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/memory/search/manager.py#L761-L799)

embedding 与 rerank 的显式前置判断。

<details>
<summary>查看原文（39行）</summary>

```text
        method = req.method
        is_agent_hybrid = method == SearchMethod.HYBRID and req.owner_type == "agent"

        needs_embedding = method in (
            SearchMethod.VECTOR,
            SearchMethod.HYBRID,
            SearchMethod.AGENTIC,
            SearchMethod.LLM_MULTIROUND,
        )
        if needs_embedding and self._embedding is None:
            raise ProviderNotConfiguredError(
                provider="embedding",
                feature=_feature_name(method, req.owner_type),
            )

        if method == SearchMethod.LLM_MULTIROUND and req.owner_type == "agent":
            raise RuntimeError(
                "method='llm_multiround' is only supported for user memory; "
                "provide user_id instead of agent_id"
            )

        # agent HYBRID cross-encoder lane (enable_llm_rerank=False, the
        # default) reaches ``search_agent_skills_hybrid``, which needs a
        # real rerank provider; the LLM lane reranks via the LLM instead
        # and is exempt.
        if is_agent_hybrid and not req.enable_llm_rerank and self._reranker is None:
            raise ProviderNotConfiguredError(
                provider="rerank",
                feature="agent_hybrid",
                alternative_hint=(
                    "Set enable_llm_rerank=true to route through the "
                    "LLM rerank lane instead of the cross-encoder "
                    "provider."
                ),
            )

        if method == SearchMethod.AGENTIC and self._reranker is None:
            raise ProviderNotConfiguredError(
                provider="rerank", feature="agentic_search"
```

</details>

**依据 5 · 作者声明**：[docs/architecture.md:212-220](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/docs/architecture.md#L212-L220)

异步索引和非原子性。

````text
4a. SQLite   4b. infra.cascade  (async daemon)
    audit        watches md → diff entries → index sync
```

Markdown is the source for derived index content. Cascade uses a persisted
change queue and reconciliation to synchronize the index asynchronously.
A durable file write does not atomically commit event publication, SQLite
state, or every downstream result. Neither this flow nor eventual consistency
alone proves that every interrupted operation will recover.
````

**依据 6 · 作者声明**：[README.md:245-257](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/README.md#L245-L257)

作者说明 provider 分层与缺失功能提示。

<details>
<summary>查看原文（13行）</summary>

```text
The OpenRouter one-key setup is EverOS Tier 1. It supports server startup,
memory add and flush, durable Markdown storage, cascade indexing, and keyword
search. Add optional providers only when you need the features below:

| Configuration | Adds |
| --- | --- |
| `[llm]` only | Core memory flow and keyword search |
| Add `[embedding]` | Vector/user hybrid search, reflection, and skill extraction |
| Add `[rerank]` too | Agentic search, default agent hybrid search, and Knowledge Wiki |
| Add `[multimodal]` and parser extra | Image, PDF, audio, and office-file ingestion |

Missing optional capabilities are reported by `/health` and return a clear
HTTP 422 if you request a feature that needs them.
```

</details>

#### 缺口

- 未验证召回准确率、过滤隔离以及索引恢复。
  **影响**：结论限于固定源码与作者声明，不证明实际运行结果。
  **进一步探讨**：使用已标注记忆和不同 owner 测关键词与混合检索并核对过滤及刷新延迟。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、数据保护与运维条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

主包要求 Python 3.12+，依赖 SQLite、LanceDB 等存储组件；作者最小示例需要 LLM 凭据并用 keyword 搜索，更多能力需 embedding、rerank 等。安全说明将 HTTP 服务定位于可信本地调用，默认 loopback；暴露给不可信网络需要自行网关与认证。记忆 Markdown 为明文，应控制文件权限、密钥、备份及保留期；模型调用、磁盘、索引重建和运维均可能产生费用或人工成本。先隔离数据、低敏试点并计划导出恢复，无法满足条件时继续本地手工文件。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-7](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/pyproject.toml#L1-L7)

项目和 Python 版本要求。

```text
[project]
name = "everos"
version = "1.6.0"
description = "EverOS — local-first markdown memory framework for AI agents and user chats; lightweight, dev-friendly, small-team"
license = {text = "Apache-2.0"}
readme = "README.md"
requires-python = ">=3.12"
```

**依据 2 · 源码核查**：[pyproject.toml:23-44](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/pyproject.toml#L23-L44)

依赖清单中的本地存储组件。

<details>
<summary>查看原文（22行）</summary>

```text
dependencies = [
    # Core data validation & config
    "pydantic>=2.7.1",
    "pydantic-settings>=2.0.0",

    # Storage stack (md-first three-piece set)
    # Upper bound: 0.35.0 embeds lance-rust v9 (large storage/encoding jump, not
    # yet stable-released). 0.32-0.34 carry a compaction offset-overflow regression
    # (lance-format/lance#7653); we run 0.34.0 safely via the with_position=False
    # FTS workaround. Do not float past 0.34.x until 0.35 has been validated under
    # sustained churn (bounded + reclaimable index dir, no compaction crash) — see
    # docs/cascade_runbook.md. Never widen this floor back below 0.34 (older lance
    # cannot read v8 data).
    "lancedb>=0.34.0,<0.35.0",    # Vector + BM25 + scalar filter (Arrow-based)
    # Floor, not a new package: lancedb pulls pyarrow in anyway. 25.0.1 stops
    # the per-value `import pytz` attempt in to_pylist() (24 walked sys.path
    # for every tz-aware timestamp) and materialises rows without a Scalar
    # per element; 25.0.0 lacks the latter and has a mimalloc exit crash.
    "pyarrow>=25.0.1",
    "aiosqlite>=0.20.0",          # Async SQLite driver (used by SA async engine)
    "sqlmodel>=0.0.22",           # ORM (Pydantic + SQLAlchemy 2.0 async)
    "alembic>=1.13.0",            # SQLite schema migrations
```

</details>

**依据 3 · 作者声明**：[README.md:107-115](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/README.md#L107-L115)

作者的最小示例需要 Python 与 OpenRouter key。

```text
## Quick Start

> One OpenRouter API key is enough to start EverOS, write durable memories,
> and retrieve them with keyword search.

### Prerequisites

- Python 3.12+
- One [OpenRouter API key](https://openrouter.ai/keys)
```

**依据 4 · 作者声明**：[README.md:245-257](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/README.md#L245-L257)

能力按 LLM、embedding、rerank 配置分层。

<details>
<summary>查看原文（13行）</summary>

```text
The OpenRouter one-key setup is EverOS Tier 1. It supports server startup,
memory add and flush, durable Markdown storage, cascade indexing, and keyword
search. Add optional providers only when you need the features below:

| Configuration | Adds |
| --- | --- |
| `[llm]` only | Core memory flow and keyword search |
| Add `[embedding]` | Vector/user hybrid search, reflection, and skill extraction |
| Add `[rerank]` too | Agentic search, default agent hybrid search, and Knowledge Wiki |
| Add `[multimodal]` and parser extra | Image, PDF, audio, and office-file ingestion |

Missing optional capabilities are reported by `/health` and return a clear
HTTP 422 if you request a feature that needs them.
```

</details>

**依据 5 · 作者声明**：[SECURITY.md:42-60](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/SECURITY.md#L42-L60)

作者声明本地可信调用、网络暴露与明文记忆边界。

<details>
<summary>查看原文（19行）</summary>

```text
EverOS runs as a **local-first service** for single users or small teams
(Markdown + SQLite + LanceDB on the local filesystem). Please keep the
following in mind:

- Exposing the HTTP API (`everos server`) to an untrusted network is **outside
  the supported threat model** — it assumes a trusted local caller. The server
  binds to `127.0.0.1` by default (env `EVEROS_API__HOST`) so a fresh install
  is loopback-only. Only set the bind to `0.0.0.0` (or any routable interface)
  after you have placed your own gateway / auth layer in front;
  `everos server start` will log a warning when you bind to `0.0.0.0`.
- **Documents you ingest are untrusted input.** Filenames, metadata, and
  content that originate outside your control are parsed, indexed, and written
  to disk. An instance that ingests third-party documents is processing
  untrusted data even when the API itself is reachable only from loopback.
- Secrets (LLM / embedding API keys) live in your local `.env`; protect that
  file as you would any credential. EverOS never transmits them anywhere except
  the providers you configure.
- Memory content is stored as plaintext `.md` files; apply OS-level file
  permissions or disk encryption if your data is sensitive.
```

</details>

#### 缺口

- 未执行部署、费用测量、安全审计或备份恢复；外部 provider 价格未知。
  **影响**：结论限于固定源码与作者声明，不证明实际运行结果。
  **进一步探讨**：在隔离数据根验证健康、权限、实际开销以及备份后重建。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可归因贡献是什么，如何验证新假设？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

本仓把提取、可读 Markdown、异步索引、owner 过滤和搜索 API 组合为本地记忆服务，底层数据库、模型及 DSH 插件属于其他组件。可验证假设：在索引状态滞后时向调用者提供逐记忆可见性水位，能够降低误认“已保存且可搜索”的次数；对相同任务与注入的索引延迟比较现有状态接口和候选水位，记录误判率、延迟与维护复杂度。若不能显著减少误判或额外成本过大则否定；源码现有队列状态不是该假设的实现证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/everos/entrypoints/api/routes/memorize.py:60-75](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/entrypoints/api/routes/memorize.py#L60-L75)

写入请求可返回已接受。

<details>
<summary>查看原文（16行）</summary>

```text
@router.post("/add", responses=_ADD_RESPONSES)
async def add_memory(
    req: Annotated[MemorizeAddRequest, ...],
    response: Response,
    app: ApplicationDep,
    request_id: RequestIdDep,
) -> SuccessEnvelope[AddResponseData] | SuccessEnvelope[AcceptedResponseData]:
    """Add messages into the user-memory + agent-memory pipelines."""
    result = await app.memory.add(
        req.model_dump(exclude={"async_mode", "defer_extraction"}),
        request_id=request_id,
        async_mode=req.async_mode,
        defer_extraction=req.defer_extraction,
    )
    if isinstance(result, Queued):
        return _accepted(response, request_id, result)
```

</details>

**依据 2 · 源码核查**：[src/everos/entrypoints/api/routes/tasks.py:51-65](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/entrypoints/api/routes/tasks.py#L51-L65)

已有任务状态接口。

<details>
<summary>查看原文（15行）</summary>

```text
@router.get("/{task_id}")
async def task_status(
    task_id: str,
    app: ApplicationDep,
    request_id: RequestIdDep,
) -> SuccessEnvelope[TaskItem]:
    """One accepted request's outcome.

    ``404`` once it has aged out of ``memorize.async_queue.row_retention_hours``
    (or never existed).
    """
    item = await app.ops.get_task(task_id)
    if item is None:
        raise NotFoundError(f"task {task_id} not found or expired")
    return SuccessEnvelope(request_id=request_id, data=item)
```

</details>

**依据 3 · 作者声明**：[docs/architecture.md:200-220](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/docs/architecture.md#L200-L220)

描述文件写入及异步索引边界。

<details>
<summary>查看原文（21行）</summary>

````text
1. MemoryService.add          (entrypoint of write path)
       │
       ▼
2. memory.extract.pipeline    (calls everalgo)
       │
       ▼
3. infra.persistence.markdown.write       (file persistence)
       │  service coordinates results and follow-up events
       │
   ┌───┴────┐
   │        │
   ▼        ▼
4a. SQLite   4b. infra.cascade  (async daemon)
    audit        watches md → diff entries → index sync
```

Markdown is the source for derived index content. Cascade uses a persisted
change queue and reconciliation to synchronize the index asynchronously.
A durable file write does not atomically commit event publication, SQLite
state, or every downstream result. Neither this flow nor eventual consistency
alone proves that every interrupted operation will recover.
````

</details>

**依据 4 · 源码核查**：[src/everos/memory/search/manager.py:200-231](https://github.com/EverMind-AI/EverOS/blob/962c63eeaae5093b495a4763c161f8b046d41bc2/src/everos/memory/search/manager.py#L200-L231)

搜索执行过滤和组件检查。

<details>
<summary>查看原文（32行）</summary>

```text
    async def search(self, req: SearchRequest) -> SearchResponse:
        request_id = resolve_request_id()
        with memory_span(
            "everos.memory.search",
            observation_type="retriever",
            session_id=_extract_top_level_session_id(req.filters),
            user_id=req.user_id,
            metadata={
                "request_id": request_id,
                "app_id": req.app_id,
                "project_id": req.project_id,
                "agent_id": req.agent_id,
                "owner_type": req.owner_type,
                "method": req.method.value,
            },
        ) as span:
            # Content (query text) only when capture_content is on.
            capture_input(
                span,
                {"query": req.query, "top_k": req.top_k, "method": req.method.value},
            )
            # Compile filters first: a malformed `filters` payload is a user
            # input error (422) and should surface before the server-side
            # component guard (500). The two steps are independent.
            where = compile_filters(
                req.filters,
                owner_id=req.owner_id,
                owner_type=req.owner_type,
                app_id=req.app_id,
                project_id=req.project_id,
            )
            self._validate_components(req)
```

</details>

#### 缺口

- 尚无延迟分布、误判率或用户实验证据。
  **影响**：结论限于固定源码与作者声明，不证明实际运行结果。
  **进一步探讨**：对相同请求注入可控延迟，比较状态呈现、误判和维护成本。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
