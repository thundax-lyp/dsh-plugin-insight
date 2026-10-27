# OpenViking

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[4ab22a4](https://github.com/volcengine/OpenViking/tree/4ab22a4923452362b60aef2826c2083ce36168d2)

<!-- BEGIN META -->
[![GitHub ★ 40,712](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40%2C712&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/volcengine/OpenViking)
<!-- END META -->

> **功能**：以虚拟文件系统组织 Agent 的知识、记忆与技能，提供分层读取、语义检索和会话沉淀。

> **亮点**：将虚拟URI、目录摘要和会话检索组合成可检查的上下文入口。

> **主要限制**：摘要正确性和更新一致性尚无当前任务对照，根平台不等于已验收DSH插件。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
  - [1.6 启动与流程](#detail-section-7)
  - [1.7 启动与依赖](#detail-section-8)
  - [1.8 启动步骤](#detail-section-9)
  - [1.9 效果与成本](#detail-section-10)
  - [1.10 成本](#detail-section-11)
  - [1.11 效果](#detail-section-12)
  - [1.12 主要限制](#detail-section-13)
- [2 未来设计假设（未验证）](#detail-section-14)
- [3 辅助信息](#detail-section-15)
- [4 研究问题与完整回答](#detail-section-16)
  - [Q01 · 上下文数据库面向什么任务，分层文件组织增加了什么？](#detail-section-17)
  - [Q02 · 检索如何使用目录、摘要和会话上下文？](#detail-section-18)
  - [Q03 · 分层摘要的核心前提与部署边界是什么？](#detail-section-19)
  - [Q04 · 分层读取是否能降低一次合格任务总成本？](#detail-section-20)
  - [Q05 · 能否让摘要附带可检测失效的依赖版本？](#detail-section-21)
  - [Q06 · 什么团队可试用平台，何时简单方案更合适？](#detail-section-22)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为Agent团队组织可浏览的知识、记忆和技能，适合长期多会话知识任务。

用户应围绕可追溯的任务回答验收，不能用向量命中数或摘要数量代替交付质量。场景与参照详见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| URI上下文组织 | 浏览知识、记忆、技能 | 是平台能力，非DSH原生工具 |
| L0摘要读取 | 先判断内容相关性 | 缺失摘要会返回未就绪信息 |
| 会话检索 | 利用对话上下文检索 | 取决于intent配置和模型 |
| 直接find | 不依赖会话查询 | 需后端与权限支持 |

> **思考**：摘要正确性和更新一致性尚无当前任务对照，根平台不等于已验收DSH插件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将虚拟URI、目录摘要和会话检索组合成可检查的上下文入口。

[Q01](#research-q01) 与 [Q02](#research-q02) 支持的增量是把知识、记忆和技能放进可浏览的URI与分层内容，结合目录范围与会话上下文控制检索。贡献是机制组合和可检查性；没有把作者旧版基准或DSH适配增量计成当前平台效果。

SearchService参数验证与VikingFS分层、摘要格式错误的显式处理值得借鉴；访问上下文与后端能力检查是复用条件。Python/Rust/多后端边界增加维护成本，本轮没有审计全平台。

<a id="detail-section-5"></a>

### 1.4 使用建议

[Q06](#research-q06) 建议可承担服务维护的知识团队试用，以可追溯原文和任务正确率验收；少量静态资料仍可用简单文件方案。

**补充建议**

先用脱敏语料对照简单文件搜索，检查原文追溯、事实反转和总维护负担。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 已检查根README、Python依赖、检索服务、摘要与访问层。
- 未执行服务、测试、模型调用或宿主；未覆盖所有后端、ACL组合和迁移恢复。

- 研究范围：根平台范围，重点抽读SearchService、VikingFS摘要与访问层及部署声明；全仓inventory不是逐文件审计，DSH例子另立研究。


- **仓库**：[volcengine/OpenViking](https://github.com/volcengine/OpenViking)
- **版本号**：未声明（[固定提交 4ab22a4](https://github.com/volcengine/OpenViking/tree/4ab22a4923452362b60aef2826c2083ce36168d2)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

### 1.6 启动与流程

<a id="detail-section-8"></a>

### 1.7 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python>=3.10及平台依赖 | 必需 | 服务与解析 | 无法启动对应路径 |
| Embedding与VLM | 语义处理必需 | 索引、摘要和抽取 | 能力和费用受配置影响 |
| 数据身份与访问策略 | 多用户必需 | URI和资源隔离 | 不应假定匿名配置等同生产隔离 |

<a id="detail-section-9"></a>

### 1.8 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户配置模型、存储与身份 | 服务健康且授权明确 |
| 导入 | 用户提交脱敏语料 | 内容及摘要可检查 |
| 检索 | Agent按目录或会话查询 | 能回读原文验证回答 |
| 恢复 | 管理者检查重建与纠错 | 摘要与原文一致 |

search与find的上下文差异、摘要读取及权限检查见 [Q02](#research-q02)。

<a id="detail-section-10"></a>

### 1.9 效果与成本

<a id="detail-section-11"></a>

### 1.10 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型、索引、存储和部署费用未知 | 配置和语料清理耗时未知 | 依赖embedding与VLM |
| 持续使用 | 摘要、检索、记忆抽取成本未知 | 纠错与访问治理耗时未知 | 无当前合格任务对照 |
| 失败恢复 | 重建、备份和重试资源未知 | 排障及一致性核对未知 | 摘要缺失有可见返回 |

<a id="detail-section-12"></a>

### 1.11 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 分层读取 | L0摘要与可检查URI机制 | 当前提交的准确率与总成本 |
| 会话化检索 | search可使用会话上下文 | 相对find的同任务收益 |

<a id="detail-section-13"></a>

### 1.12 主要限制

[Q03](#research-q03) 追问摘要是否足以可靠选择原文。最强支持是实现显式区分摘要、原文和未就绪状态；反例是摘要陈旧或遗漏限定词会让节省读取量转化为错误路由，需用事实反转任务而非命中数检验。

<a id="detail-section-14"></a>

## 2 未来设计假设（未验证）

[Q05](#research-q05) 提出未验证的摘要依赖版本与失效可见性，比较自动回退原文对错误路由、任务合格率和总成本的影响。

<a id="detail-section-15"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

<details>
<summary>查看辅助统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 416 | 106865 | — | — | 864750 |
| .mjs | source | 18 | 4180 | 3254 | 580 | — |
| .mjs | test | 2 | 230 | 189 | 17 | — |
| .ts | source | 235 | 40768 | 34235 | 4217 | — |
| .md | test | 6 | 1036 | — | — | 5748 |
| .ts | test | 89 | 11377 | 10408 | 554 | — |
| .js | source | 8 | 649 | 496 | 102 | — |
| .md | example | 93 | 23283 | — | — | 181090 |
| .mjs | example | 311 | 77526 | 61616 | 10174 | — |
| .tsx | example | 1 | 258 | 230 | 13 | — |
| .ts | example | 121 | 35216 | 30497 | 1808 | — |
| .js | example | 2 | 2991 | 2637 | 85 | — |
| .tsx | test | 88 | 21396 | 19758 | 546 | — |
| .tsx | source | 238 | 56167 | 52880 | 848 | — |

</details>

统计不覆盖Python与Rust代码，JS/TS及Markdown数量不能代表根平台整体实现规模。

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/volcengine/OpenViking/issues) 查看。

<a id="detail-section-16"></a>

## 4 研究问题与完整回答

**插件研究总目标**：上下文数据库如何组织、检索并沉淀知识，其相对平面向量检索的增量与条件是什么？

<a id="research-q01"></a>

<a id="detail-section-17"></a>

### Q01 · 上下文数据库面向什么任务，分层文件组织增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

OpenViking 面向需要长期管理知识、记忆与技能的 Agent 开发者。合格交付应是带来源和可检查内容的任务上下文，而非仅返回一组相似向量。与手动文件加全文搜索相比，它增加语义查找和会话沉淀；与只暴露向量命中的简化基线相比，viking URI、目录摘要和完整原文让调用者可先浏览再选择读取。这里比较的是实现机制，不是所有向量数据库产品的功能全集，也不能据此声称行业首次。README基准明确使用0.3.22和特定模型，本次固定提交不能直接继承这些成绩。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-66](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/README.md#L41-L66)

作者描述虚拟文件系统、分层摘要和会话记忆。

<details>
<summary>查看原文（26行）</summary>

````text

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

[Architecture](https://docs.openviking.ai/en/concepts/01-architecture) · [Design rationale](https://blog.openviking.ai/post/openviking-context-database/)

```
````

</details>

**依据 2 · 作者声明**：[README.md:113-125](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/README.md#L113-L125)

作者基准绑定版本和模型，限制效果外推。

<details>
<summary>查看原文（13行）</summary>

```text
The memory evaluation used [Doubao 2.0 Pro](https://console.volcengine.com/ark/region:cn-beijing/model/detail?Id=doubao-seed-2-0-pro) as the VLM and [Doubao-embedding-vision-251215](https://console.volcengine.com/ark/region:cn-beijing/model/detail?Id=doubao-embedding-vision) as the embedding model.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/benchmark-dark.svg">
  <img alt="Benchmark results. LoCoMo accuracy: OpenClaw 24.20% native vs 82.08% with OpenViking; Hermes 33.38% vs 82.86%; Claude Code 57.21% vs 80.32%. tau2-bench task success: Retail 70.94% vs 77.81%; Airline 54.38% vs 66.25%." src="docs/images/benchmark-light.svg">
</picture>

- **User memory (LoCoMo)**: with OpenViking, all three agent integrations land at 80–83% accuracy — up from 24–57% on their native memory — while input tokens drop by 34.3–91.0% and query latency by 58.45–66.10%.
- **Agent experience (tau2-bench)**: experience memory lifts task success by +6.87pp (retail) and +11.87pp (airline) over the same LLM without memory.

## Quick start

Set up an OpenViking server first; if you already have one, skip to [Use it with your agent](#use-it-with-your-agent). Deploying your own needs uv, Python 3.10+ and a model provider with an embedding model and a VLM.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-18"></a>

### Q02 · 检索如何使用目录、摘要和会话上下文？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

SearchService先检查查询、系统命名空间及后端能力；search可读取会话上下文，再将目标URI、level、过滤条件和检索类型交给VikingFS。find提供无需会话的查询路径；两者不是同一语义操作的重复别名。语义层读取.abstract.md，先做访问检查与路径可见性判断，找不到摘要时返回未就绪描述，不能把摘要缺失解释为原文不存在。服务、存储和CLI异常分层值得复用，但迁移需保留身份上下文和后端能力检查，否则会把可访问性和搜索能力错误混在一起。

#### 证据与依据

**依据 1 · 源码核查**：[openviking/service/search_service.py:127-181](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/openviking/service/search_service.py#L127-L181)

search验证并传递会话、目录与层级。

<details>
<summary>查看原文（55行）</summary>

```text
        ctx: RequestContext,
        target_uri: Union[str, List[str]] = "",
        session: Optional["Session"] = None,
        limit: int = 10,
        score_threshold: Optional[float] = None,
        filter: Optional[Dict] = None,
        level: Optional[List[int]] = None,
        image_url: str | list[str] | None = None,
        events_time_decay_protection: Optional[str] = None,
        search_type: SearchType = "semantic",
        context_types: Optional[List[ContextType]] = None,
    ) -> Any:
        """Search with session context.

        Args:
            query: Query string
            target_uri: Target directory URI(s), supports str or List[str]
            session: Session object for context
            limit: Max results
            score_threshold: Score threshold
            filter: Metadata filters
            level: Filter by level (0=abstract, 1=overview, 2=file)

        Returns:
            FindResult
        """
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
        return result
```

</details>

**依据 2 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:40-88](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/openviking/storage/viking_fs/_semantic.py#L40-L88)

摘要读取与可访问性判断。

<details>
<summary>查看原文（49行）</summary>

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

    async def _read_abstract_for_known_dir(
        self,
        uri: str,
        ctx: Optional[RequestContext] = None,
    ) -> str:
        """Read .abstract.md for a directory that is already known to be a directory.

        Bypasses stat() and isDir check. Caller (i.e. _batch_fetch_abstracts)
        must guarantee that the URI points to a directory.
        """
        await self._ensure_access(uri, ctx)
        real_ctx = self._ctx_or_default(ctx)
        primary_path = self._uri_to_path(uri, ctx=ctx)
        for path in self._read_paths(uri, ctx=ctx):
            if not await self._read_path_visible(uri, path, primary_path, real_ctx):
                continue
            try:
                if not await self._agfs_path_exists(path):
                    continue
                return await self._read_abstract_file(path, uri, ctx=ctx)
            except Exception as exc:
                if is_not_found_error(exc):
                    continue
                raise
```

</details>

<a id="research-q03"></a>

<a id="detail-section-19"></a>

### Q03 · 分层摘要的核心前提与部署边界是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

服务需要Python及大量解析、存储、模型和HTTP依赖；README要求embedding和VLM配置。根仓库是平台，不是可直接安装的DSH bundle，DSH例子另有package与生成式共享代码。最影响贡献的质疑是摘要能否保留足够事实来正确选择原文。摘要过期、丢失限定词或语义误路由会使节约上下文的机制损害任务质量；代码对摘要未就绪作出显式返回，但这不证明摘要与原文始终一致。访问层存在命名空间、ACL与上下文处理，本轮抽读不能证明全平台的多租户隔离。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:11-38](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/pyproject.toml#L11-L38)

Python版本、AGPL声明和主要依赖。

<details>
<summary>查看原文（28行）</summary>

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
    "Intended Audience :: Developers",
    "Topic :: Scientific/Engineering :: Artificial Intelligence",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Programming Language :: Python :: 3.13",
    "Programming Language :: Python :: 3.14",
]
dependencies = [
    "aiohttp>=3.13.3",
    "async-timeout>=5.0.1",
    "orjson>=3.11.7",
    "packaging>=24.0",
    "openviking-sdk>=0.1.15",
    "pydantic>=2.0.0",
    "typing-extensions>=4.5.0",
```

</details>

**依据 2 · 作者声明**：[README.md:127-153](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/README.md#L127-L153)

部署与模型配置条件。

<details>
<summary>查看原文（27行）</summary>

````text
<details open>
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

</details>

<details>
<summary><strong>Deploy it yourself</strong></summary>

Install OpenViking and run the setup wizard, which configures the models:

```bash
uv tool install openviking --upgrade && openviking-server init
````

</details>

**依据 3 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:40-88](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/openviking/storage/viking_fs/_semantic.py#L40-L88)

缺失/格式错误摘要的返回路径。

<details>
<summary>查看原文（49行）</summary>

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

    async def _read_abstract_for_known_dir(
        self,
        uri: str,
        ctx: Optional[RequestContext] = None,
    ) -> str:
        """Read .abstract.md for a directory that is already known to be a directory.

        Bypasses stat() and isDir check. Caller (i.e. _batch_fetch_abstracts)
        must guarantee that the URI points to a directory.
        """
        await self._ensure_access(uri, ctx)
        real_ctx = self._ctx_or_default(ctx)
        primary_path = self._uri_to_path(uri, ctx=ctx)
        for path in self._read_paths(uri, ctx=ctx):
            if not await self._read_path_visible(uri, path, primary_path, real_ctx):
                continue
            try:
                if not await self._agfs_path_exists(path):
                    continue
                return await self._read_abstract_file(path, uri, ctx=ctx)
            except Exception as exc:
                if is_not_found_error(exc):
                    continue
                raise
```

</details>

#### 缺口

- 目录摘要更新与原文一致性没有同条件任务结果
  **影响**：分层读取的质量收益不可量化
  **进一步探讨**：用新增、删除及事实反转文档测摘要滞后和最终任务误答
- 仅抽读访问层而非完整隔离审计
  **影响**：不能把接口存在当跨租户保证
  **进一步探讨**：围绕身份、peer、资源分享和删除边界构造完整授权矩阵

<a id="research-q04"></a>

<a id="detail-section-20"></a>

### Q04 · 分层读取是否能降低一次合格任务总成本？

**研究主题**：效果与总成本

#### 完整回答

潜在节约来自先读摘要再读少量原文，但摘要生成、向量化、会话抽取、重建索引和人工纠错也消耗资源。应以一批同等合格的问答或Agent任务为单位，计入摄取和维护摊销，不能只比较检索响应token。README列出作者基准的较低token与延迟，但它绑定旧版本、特定模型和任务，本次没有复跑，不能当当前效果。首次部署耗时、不同后端费用和失败恢复投入均未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:113-125](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/README.md#L113-L125)

作者基准是特定条件下的声明。

<details>
<summary>查看原文（13行）</summary>

```text
The memory evaluation used [Doubao 2.0 Pro](https://console.volcengine.com/ark/region:cn-beijing/model/detail?Id=doubao-seed-2-0-pro) as the VLM and [Doubao-embedding-vision-251215](https://console.volcengine.com/ark/region:cn-beijing/model/detail?Id=doubao-embedding-vision) as the embedding model.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/benchmark-dark.svg">
  <img alt="Benchmark results. LoCoMo accuracy: OpenClaw 24.20% native vs 82.08% with OpenViking; Hermes 33.38% vs 82.86%; Claude Code 57.21% vs 80.32%. tau2-bench task success: Retail 70.94% vs 77.81%; Airline 54.38% vs 66.25%." src="docs/images/benchmark-light.svg">
</picture>

- **User memory (LoCoMo)**: with OpenViking, all three agent integrations land at 80–83% accuracy — up from 24–57% on their native memory — while input tokens drop by 34.3–91.0% and query latency by 58.45–66.10%.
- **Agent experience (tau2-bench)**: experience memory lifts task success by +6.87pp (retail) and +11.87pp (airline) over the same LLM without memory.

## Quick start

Set up an OpenViking server first; if you already have one, skip to [Use it with your agent](#use-it-with-your-agent). Deploying your own needs uv, Python 3.10+ and a model provider with an embedding model and a VLM.
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:28-65](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/pyproject.toml#L28-L65)

解析、模型、存储/HTTP等依赖说明成本组成。

<details>
<summary>查看原文（38行）</summary>

```text
    "Programming Language :: Python :: 3.13",
    "Programming Language :: Python :: 3.14",
]
dependencies = [
    "aiohttp>=3.13.3",
    "async-timeout>=5.0.1",
    "orjson>=3.11.7",
    "packaging>=24.0",
    "openviking-sdk>=0.1.15",
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
    "xxhash>=3.0.0",
    "rapidfuzz>=3.14,<4",
    "jinja2>=3.1.6",
    "tabulate>=0.9.0",
    "urllib3>=2.7.0",
    "protobuf>=6.33.5",
    "pdfminer-six>=20251230",
    "typer>=0.12.0",
    "litellm>=1.83.7,<1.91.2",
```

</details>

#### 缺口

- 缺少当前提交同任务的摄取、检索与重建成本
  **影响**：无法判定相对简单文件搜索的单位收益
  **进一步探讨**：固定语料、模型与正确性门槛，记录摄取摊销、任务费用、人工时间及失败重试

<a id="research-q05"></a>

<a id="detail-section-21"></a>

### Q05 · 能否让摘要附带可检测失效的依赖版本？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是每个目录摘要保存其引用子内容的版本摘要，在原文变化时将摘要标为陈旧，检索优先返回失效提示或回退原文。现有明确摘要文件与未就绪标记提供插入点；相对普通自动重算，新增的是可见的一致性状态，代价是版本维护、额外检查和可能的原文回退成本。最小验证采用事实反转和部分重建故障，与单纯摘要优先方案对照，比较错误路由、最终任务合格率和全生命周期费用。若版本检查成本超过收益且不减少误答，则否定该机制，不把这项推演计作现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[openviking/storage/viking_fs/_semantic.py:40-88](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/openviking/storage/viking_fs/_semantic.py#L40-L88)

摘要文件和未就绪返回形成推导基础。

<details>
<summary>查看原文（49行）</summary>

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

    async def _read_abstract_for_known_dir(
        self,
        uri: str,
        ctx: Optional[RequestContext] = None,
    ) -> str:
        """Read .abstract.md for a directory that is already known to be a directory.

        Bypasses stat() and isDir check. Caller (i.e. _batch_fetch_abstracts)
        must guarantee that the URI points to a directory.
        """
        await self._ensure_access(uri, ctx)
        real_ctx = self._ctx_or_default(ctx)
        primary_path = self._uri_to_path(uri, ctx=ctx)
        for path in self._read_paths(uri, ctx=ctx):
            if not await self._read_path_visible(uri, path, primary_path, real_ctx):
                continue
            try:
                if not await self._agfs_path_exists(path):
                    continue
                return await self._read_abstract_file(path, uri, ctx=ctx)
            except Exception as exc:
                if is_not_found_error(exc):
                    continue
                raise
```

</details>

<a id="research-q06"></a>

<a id="detail-section-22"></a>

### Q06 · 什么团队可试用平台，何时简单方案更合适？

**研究主题**：采用判断

#### 完整回答

建议有多会话知识任务、可承担模型与数据服务维护、需要可浏览记忆的团队试用。先用脱敏语料验证导入、目录摘要、检索、原文追溯、纠错和恢复，再以当前人工笔记或简单文件搜索为对照。数据少且全文搜索已够用时，平台依赖和索引维护可能没有额外价值；要求已经证明跨租户隔离或量化节时的团队，应先补足专项证据。根平台研究不代表DSH适配器或所有其他宿主已经通过。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-66](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/README.md#L41-L66)

可检查上下文的目标用户与用途。

<details>
<summary>查看原文（26行）</summary>

````text

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

[Architecture](https://docs.openviking.ai/en/concepts/01-architecture) · [Design rationale](https://blog.openviking.ai/post/openviking-context-database/)

```
````

</details>

**依据 2 · 源码核查**：[openviking/service/search_service.py:127-181](https://github.com/volcengine/OpenViking/blob/4ab22a4923452362b60aef2826c2083ce36168d2/openviking/service/search_service.py#L127-L181)

可定义试用的查询与目录范围。

<details>
<summary>查看原文（55行）</summary>

```text
        ctx: RequestContext,
        target_uri: Union[str, List[str]] = "",
        session: Optional["Session"] = None,
        limit: int = 10,
        score_threshold: Optional[float] = None,
        filter: Optional[Dict] = None,
        level: Optional[List[int]] = None,
        image_url: str | list[str] | None = None,
        events_time_decay_protection: Optional[str] = None,
        search_type: SearchType = "semantic",
        context_types: Optional[List[ContextType]] = None,
    ) -> Any:
        """Search with session context.

        Args:
            query: Query string
            target_uri: Target directory URI(s), supports str or List[str]
            session: Session object for context
            limit: Max results
            score_threshold: Score threshold
            filter: Metadata filters
            level: Filter by level (0=abstract, 1=overview, 2=file)

        Returns:
            FindResult
        """
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
        return result
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
