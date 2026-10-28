# OpenViking 上下文数据库

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[54d4c0f](https://github.com/volcengine/OpenViking/tree/54d4c0fac91fae976325ebed618d7278ff9b5c77)

<!-- BEGIN META -->
[![GitHub ★ 40,955](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C955&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking)
<!-- END META -->

> **功能**：以文件系统组织 Agent 的知识、记忆和技能，并提供分层检索

> **亮点**：统一 URI、内容分层、目录范围与会话检索形成可检查的上下文组合，父目录刷新策略进一步将更新成本显式化；真实任务优势未测。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：大目录父摘要可在比例阈值下滞后，锁忙还会跳过尽力更新；需要检验错误路由而非用摘要存在证明可靠。[Q03](#research-q03)

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
  - [Q01 · 文件系统式上下文平台相对文件搜索增加了什么？](#detail-section-11)
  - [Q02 · 目录范围与会话检索如何从服务进入存储？](#detail-section-12)
  - [Q03 · 摘要优先是否可能牺牲新鲜性和正确路由？](#detail-section-13)
  - [Q04 · 哪些团队值得承担平台部署与持续维护？](#detail-section-14)
  - [Q05 · 如何在已有刷新策略上形成真正增量的验证方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向维护长期 Agent 知识、记忆和技能的团队，以可浏览的 URI 与摘要分层读取上下文。

文件目录、全文搜索和人工摘要；比较的是统一可检查上下文与分层路由，不将语义搜索本身视为原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| URI与分层上下文 | 浏览摘要、概览与原文 | 摘要可能未就绪或滞后 |
| 会话与直接检索 | 按任务选择查询方式 | 模型与后端能力影响结果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python>=3.10及服务依赖 | 必需 | 平台运行 | 根项目非DSH安装包 |
| 模型、嵌入与存储 | 效果必需 | 索引、摘要与检索 | 数据不能形成完整语义层 |
| 支持全文索引的后端 | keywords必需 | 关键词模式 | 服务显式拒绝不支持的配置 |
| 身份、ACL与备份 | 团队部署必需 | 访问范围与恢复 | 单一URI不能替代权限配置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 团队配置服务、模型与身份 | 非敏感资料可读写 |
| 导入 | 服务生成摘要与索引 | 可回到原文并解释未就绪 |
| 查询 | Agent选find/search及目录层 | 任务答案与原文一致 |
| 变更恢复 | 管理员验收刷新和备份 | 关键事实反转及时可见 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 部署、嵌入和模型未知 | 语料整理与身份配置未知 | 少量资料可先用文件方案 |
| 持续使用 | 索引、摘要和存储未知 | 纠错及权限维护未知 | 大目录有刷新取舍 |
| 失败恢复 | 重建与备份资源未知 | 队列/摘要一致性核对未知 | 未做恢复演练 |
| 退出 | 导出与迁移资源未知 | 保留原文及迁移URI引用 | 迁移时间未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可检查上下文 | URI和目录摘要/原文分层 | 当前任务正确率 |
| 检索分工 | find与search区别及后端门槛 | 会话分析净收益 |
| 更新管理 | 父目录比例刷新与待处理 | 滞后导致错误的频率 |

> **思考**：大目录父摘要可在比例阈值下滞后，锁忙还会跳过尽力更新；需要检验错误路由而非用摘要存在证明可靠。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一 URI、内容分层、目录范围与会话检索形成可检查的上下文组合，父目录刷新策略进一步将更新成本显式化；真实任务优势未测。[Q01](#research-q01) [Q02](#research-q02)

服务参数验证、请求上下文访问层与存储语义分开，便于定位“不支持后端”与“无权限”；纯刷新策略可复用，但读写队列、存储和模型一致性是迁移负担。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

大目录父摘要可在比例阈值下滞后，锁忙还会跳过尽力更新；需要检验错误路由而非用摘要存在证明可靠。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

有平台运维能力的团队限定非敏感语料试用，先验证原文追溯与关键变更，再比较简单文件搜索。摘要导致错选时回退原文，净任务收益不足则不扩大部署。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

平台分层、范围与刷新机制有源码支持；当前任务收益未对照，重要性门控是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、openviking/service/search_service.py、openviking/storage/viking_fs/_semantic.py、openviking/storage/viking_fs/_access.py、openviking/storage/queuefs/semantic_ops/freshness_policy.py、openviking/storage/queuefs/semantic_processor.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根平台源码抽查SearchService、VikingFS摘要与访问层、freshness策略及调用链、根README和构建声明；不穷尽所有平台功能，DSH例子另项。
- 下一步：未执行安装、目标代码或测试；不继承其他版本的作者基准，模型质量、权限全链和恢复均需当前版本实证。

**分析版本**

- **仓库**：[volcengine/OpenViking](https://github.com/volcengine/OpenViking)
- **版本号**：未声明（[固定提交 54d4c0f](https://github.com/volcengine/OpenViking/tree/54d4c0fac91fae976325ebed618d7278ff9b5c77)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把刷新阈值与“改变任务结论的重要性”结合：一般新增仍按现有比例延迟，涉及关键事实反转的文档在读摘要时触发原文回退。当前策略使用子摘要变化事件和数量比例，不能直接识别语义重要性；新增机制必须可解释并避免每次读取都调用模型。最小验证比较比例刷新、全部立即刷新和重要性门控三组，固定变更序列与任务，记录错误路由、最终合格率、摘要生成资源和端到端耗时。若门控漏掉关键反转或资源不低于全部刷新，则推翻优势。此方向不是现有 freshness 函数已经实现的能力，也不从目录结构推断真实需求。 [Q05](#research-q05)

未执行安装、目标代码或测试；不继承其他版本的作者基准，模型质量、权限全链和恢复均需当前版本实证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 423 | 109445 | — | — | 904853 |
| .mjs | source | 19 | 4295 | 3329 | 602 | — |
| .mjs | test | 2 | 230 | 189 | 17 | — |
| .ts | source | 237 | 41202 | 34645 | 4246 | — |
| .md | test | 6 | 1126 | — | — | 6516 |
| .ts | test | 89 | 11512 | 10537 | 557 | — |
| .js | source | 8 | 649 | 496 | 102 | — |
| .md | example | 101 | 24314 | — | — | 189865 |
| .mjs | example | 316 | 78889 | 62639 | 10417 | — |
| .tsx | example | 1 | 258 | 230 | 13 | — |
| .ts | example | 121 | 35213 | 30497 | 1802 | — |
| .js | example | 2 | 2991 | 2637 | 85 | — |
| .tsx | test | 94 | 22331 | 20629 | 602 | — |
| .tsx | source | 240 | 56796 | 53500 | 853 | — |

</details>

**活跃度**

[![Issue 未关闭 398](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=398&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 350](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=350&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 165](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=165&color=737b86&logo=github)](https://github.com/volcengine/OpenViking/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：文件系统式上下文平台相对文件搜索增加了什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 文件系统式上下文平台相对文件搜索增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

OpenViking 根条目是上下文数据库基础设施，服务需要长期管理知识、记忆和技能的 Agent 开发者；原生 DSH 适配另在 examples/dsh-memory-plugin，不应把根项目当可直接安装的 DSH 插件。基线为文件目录加全文搜索和人工摘要，合格结果是能够回到原始内容、按任务范围选择相关资料，并理解摘要与来源的关系。平台用 viking URI、目录摘要、概览及原文分层组织上下文，允许先浏览摘要再读详情，减少平铺片段的交接障碍。语义检索和生成摘要并非独创算法；可检查的统一命名空间和分层读取是本次识别的组合贡献。资料很少或关键词即可解决时，平台部署与模型维护可能超过收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:44-62](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/README.md#L44-L62)

作者说明统一文件系统、目录范围和分层读取。

<details>
<summary>查看原文（19行）</summary>

```text
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

**依据 2 · 源码核查**：[pyproject.toml:11-21](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/pyproject.toml#L11-L21)

Python上下文数据库而非DSH根包。

<details>
<summary>查看原文（11行）</summary>

```text
[project]
name = "openviking"
dynamic = ["version", "readme"]
description = "An Agent-native context database"
requires-python = ">=3.10"
authors = [
    {name = "ByteDance", email = "noreply@bytedance.com"}
]
license = "AGPL-3.0"
classifiers = [
    "Development Status :: 3 - Alpha",
```

</details>

#### 缺口

- 没有当前固定版本与简单文件方案的同任务对照
  **影响**：不能把作者声明转为节省token或质量提升
  **进一步探讨**：用同一资料和问题集比较原文可追溯性、任务正确率、总读取和人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录范围与会话检索如何从服务进入存储？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

SearchService 验证查询编码、拒绝系统命名空间，按 search_type 判断后端关键词能力。search 在意图分析开启且非图像时读取 session 上下文，再传 target_uri、level、过滤条件到 VikingFS；find 无会话上下文，且可用过滤器替代空查询。两者是不同任务路径，不能互称别名。摘要与概览分别读 .abstract.md 和 .overview.md，读前调用访问检查，文件URI会转读父目录层。访问层在当前 RequestContext 下批量评估并对被拒绝 URI 抛出权限错误。这支持范围和可读性的机制判断，但不等于完成全部认证、ACL继承与跨租户链的安全审计。

#### 证据与依据

**依据 1 · 源码核查**：[openviking/service/search_service.py:34-60](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/openviking/service/search_service.py#L34-L60)

查询与系统范围验证。

<details>
<summary>查看原文（27行）</summary>

```text
def _reject_system_targets(target_uri: Union[str, List[str]]) -> None:
    targets = [target_uri] if isinstance(target_uri, str) else target_uri
    for uri in targets:
        if uri and is_system_uri(uri):
            raise InvalidArgumentError(f"search is not supported for namespace: {uri}")


def _validate_query(
    query: str,
    image_url: str | list[str] | None = None,
    filter: Optional[Dict] = None,
) -> None:
    """Reject malformed query text or a request with nothing to search for.

    A filter is an acceptable substitute for a query: the result set is then
    fully determined by the filter, which is exactly what an exact-match lookup
    (e.g. by a tag carrying an external id) needs. Without either one the call
    would return an arbitrary slice of the whole store.
    """
    try:
        query.encode("utf-8")
    except UnicodeEncodeError as exc:
        raise InvalidArgumentError("Search query must contain valid Unicode text.") from exc
    if query.strip() or image_url or filter:
        return
    raise InvalidArgumentError(
        "Search query or image_url must not be empty unless a filter is provided."
```

</details>

**依据 2 · 源码核查**：[openviking/service/search_service.py:178-205](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/openviking/service/search_service.py#L178-L205)

search 的会话和范围参数。

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

**依据 3 · 源码核查**：[openviking/service/search_service.py:235-245](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/openviking/service/search_service.py#L235-L245)

find 可接受过滤器且无session。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:78-106](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/openviking/storage/viking_fs/_semantic.py#L78-L106)

目录摘要访问检查和父目录回退。

<details>
<summary>查看原文（29行）</summary>

```text
    async def abstract(
        self,
        uri: str,
        ctx: Optional[RequestContext] = None,
    ) -> str:
        """Read directory's L0 summary (.abstract.md).

        If the caller points to a file, its parent directory is used instead so
        the endpoint remains usable for both file and directory URIs.
        """
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
            return await self.abstract(parent_uri, ctx=ctx)
        return await self._read_abstract_file(path, uri, ctx=ctx)
```

</details>

**依据 5 · 源码核查**：[openviking/storage/viking_fs/_access.py:239-261](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/openviking/storage/viking_fs/_access.py#L239-L261)

请求上下文下的访问判断。

<details>
<summary>查看原文（23行）</summary>

```text
    async def _ensure_access(
        self,
        uri: str,
        ctx: Optional[RequestContext],
        *,
        action: AclAction = AclAction.READ,
    ) -> None:
        await self._ensure_access_many([uri], ctx, action=action)

    async def _ensure_access_many(
        self,
        uris: Sequence[str],
        ctx: Optional[RequestContext],
        *,
        action: AclAction,
    ) -> None:
        real_ctx = self._ctx_or_default(ctx)
        access = await self._can_access_many(uris, real_ctx, action=action)
        denied = next((uri for uri in uris if not access.get(uri, False)), None)
        if denied is not None:
            raise PermissionDeniedError(
                f"Access denied for {denied}: {action.value} permission required",
                resource=denied,
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 摘要优先是否可能牺牲新鲜性和正确路由？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

会。摘要读取把格式错误或不存在转为“not ready”，有利于区分摘要缺失与内容不存在，但缺失状态不自动证明检索覆盖。当前有 freshness-aware 父目录刷新策略：子摘要体未变则不刷新，有基线的大目录按累计变更比例决定立即刷新或标记待处理；计数是变更事件而不是唯一子项数。因此频繁改变同一子项也可触发阈值，低于阈值时父摘要允许滞后。实际处理器在语义变更后调用计划器，默认比例0.10，小目录默认32以下直接刷新；锁忙会跳过 best-effort 更新。已有新鲜性策略应算作当前机制，不能再将“添加刷新版本机制”直接当作完全新设计。核心未知是父摘要滞后是否误导任务路由，需事实反转问题而不是命中数量检验。

#### 证据与依据

**依据 1 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:40-63](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/openviking/storage/viking_fs/_semantic.py#L40-L63)

摘要格式/缺失返回可见未就绪。

<details>
<summary>查看原文（24行）</summary>

```text
    async def _read_abstract_file(
        self,
        path: str,
        uri: str,
        ctx: Optional[RequestContext] = None,
    ) -> str:
        """Read and decrypt/decode .abstract.md from a known directory path.

        Does NOT perform stat or isDir check -- caller is responsible for
        ensuring the path points to a directory.
        """
        file_path = f"{path}/.abstract.md"
        try:
            content_bytes = self._handle_agfs_read(await self._async_agfs.read(file_path))
            return body_for_preview(self._decode_bytes(content_bytes))
        except AbstractOverviewFormatError as exc:
            logger.warning("Malformed directory abstract for %s: %s", uri, exc)
        except Exception as exc:
            if not is_not_found_error(exc):
                mapped = map_exception(exc, resource=uri)
                if mapped is not None:
                    raise mapped from exc
                raise
        return f"# {uri} [Directory abstract is not ready]"
```

</details>

**依据 2 · 源码核查**：[openviking/storage/queuefs/semantic_ops/freshness_policy.py:28-62](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/openviking/storage/queuefs/semantic_ops/freshness_policy.py#L28-L62)

事件计数和比例阈值策略。

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

**依据 3 · 源码核查**：[openviking/storage/queuefs/semantic_processor.py:399-430](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/openviking/storage/queuefs/semantic_processor.py#L399-L430)

实际处理链调用刷新计划器，锁冲突跳过。

<details>
<summary>查看原文（32行）</summary>

```text
        parent_ctx = self._ctx_from_semantic_msg(msg)
        semantic_config = get_openviking_config().semantic
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
```

</details>

#### 缺口

- 摘要滞后窗口对任务的真实影响未测
  **影响**：不能声称摘要先读始终节省成本且保持质量
  **进一步探讨**：修改一条会反转答案的关键文档，测各层可见性、错误选择率与最终结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些团队值得承担平台部署与持续维护？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

有持续语料更新、多个 Agent 需要共享可检查上下文、并能维护服务与模型配置的团队值得受控试用。启动需要 Python>=3.10 及依赖，源码构建还涉及 CMake 和 Rust 构建工具；效果需要可用嵌入、语义处理模型、正确目录与请求身份，以及备份恢复策略。首次投入包括部署、导入和命名整理；持续投入包括摘要生成、检索、存储、错误记忆纠正与访问治理；失败恢复包括队列、索引和摘要一致性检查。现金与人工目前均未知，不输出单位合格任务成本。试用先限定非敏感语料，分别核对 find 与 search、原文追溯、文档变更后的刷新和停用导出；若目录摘要让任务错误，先强制读取原文或回到文件搜索，而不是继续扩大语料。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-19](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/pyproject.toml#L1-L19)

构建依赖和Python版本。

<details>
<summary>查看原文（19行）</summary>

```text
[build-system]
requires = [
    "setuptools>=61.0",
    "setuptools-scm>=8.0",
    "cmake>=3.15",
    "maturin>=1.0,<2.0",
    "wheel",
]
build-backend = "setuptools.build_meta"

[project]
name = "openviking"
dynamic = ["version", "readme"]
description = "An Agent-native context database"
requires-python = ">=3.10"
authors = [
    {name = "ByteDance", email = "noreply@bytedance.com"}
]
license = "AGPL-3.0"
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:31-56](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/pyproject.toml#L31-L56)

服务、模型和解析依赖。

<details>
<summary>查看原文（26行）</summary>

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
    "uvicorn>=0.39.0",
```

</details>

**依据 3 · 源码核查**：[openviking/service/search_service.py:114-127](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/openviking/service/search_service.py#L114-L127)

关键词依赖具体向量后端能力。

<details>
<summary>查看原文（14行）</summary>

```text
    async def ensure_keywords_search_supported(self, ctx: RequestContext) -> None:
        """Validate keyword-search support at the top-level request boundary."""
        viking_fs = self._ensure_initialized()
        vector_store = viking_fs._get_vector_store()
        if not vector_store or not await viking_fs._collection_has_fulltext(
            vector_store,
            ctx,
            supported_modes=("volcengine", "vikingdb"),
            raise_on_error=True,
        ):
            raise InvalidArgumentError(
                "Keyword search is not supported by the configured vector backend, or full-text "
                "indexing is not enabled for the content field."
            )
```

</details>

**依据 4 · 源码核查**：[openviking/service/search_service.py:187-205](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/openviking/service/search_service.py#L187-L205)

会话意图分析影响调用成本和语义。

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

#### 缺口

- 未有当前部署、恢复演练和合格任务账单
  **影响**：无法建议无条件持续采用
  **进一步探讨**：固定服务/模型版本，以代表语料完整记录导入、质量、人工纠错与备份恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何在已有刷新策略上形成真正增量的验证方向？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把刷新阈值与“改变任务结论的重要性”结合：一般新增仍按现有比例延迟，涉及关键事实反转的文档在读摘要时触发原文回退。当前策略使用子摘要变化事件和数量比例，不能直接识别语义重要性；新增机制必须可解释并避免每次读取都调用模型。最小验证比较比例刷新、全部立即刷新和重要性门控三组，固定变更序列与任务，记录错误路由、最终合格率、摘要生成资源和端到端耗时。若门控漏掉关键反转或资源不低于全部刷新，则推翻优势。此方向不是现有 freshness 函数已经实现的能力，也不从目录结构推断真实需求。

#### 证据与依据

**依据 1 · 源码核查**：[openviking/storage/queuefs/semantic_ops/freshness_policy.py:41-60](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/openviking/storage/queuefs/semantic_ops/freshness_policy.py#L41-L60)

现有阈值以事件数量而非任务重要性为基准。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[openviking/storage/queuefs/semantic_processor.py:405-414](https://github.com/volcengine/OpenViking/blob/54d4c0fac91fae976325ebed618d7278ff9b5c77/openviking/storage/queuefs/semantic_processor.py#L405-L414)

调用处每次传 changed_entries=1。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

#### 缺口

- 任务重要性标记和原文门控尚无实现及需求验证
  **影响**：仅为机制推演，不能计入现有创新评分
  **进一步探讨**：先收集真实变更引起的错误路由，再做上述三组对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
