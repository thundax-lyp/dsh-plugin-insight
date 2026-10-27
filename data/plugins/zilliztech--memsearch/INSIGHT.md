# MemSearch

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[926ba5b](https://github.com/zilliztech/memsearch/tree/926ba5b7c3d53ae0f424fba9029c29e88718b687)

<!-- BEGIN META -->
[![GitHub ★ 2,797](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C797&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch)
<!-- END META -->

> **功能**：面向Markdown知识库提供语义检索、混合搜索、增量索引、文件监听与多Agent接入。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的贡献是以Markdown保持用户可编辑事实、让向量库成为可重建派生物，并用内容/位置/模型身份和有范围的清理组织增量索引。相比rg增加语义候选，成熟embedding、BM25和RRF来自已有方法，组合贡献不等于原创算法或任务胜出。

> **主要限制**：[Q03](#research-q03)显示旧块删除先于新块embedding；provider失败时来源原文件仍在，但索引可能暂缺内容。可重建解释恢复依据，不能保证每次查询完整或恢复免费；IndexReport应成为使用完整覆盖结论的门槛。本轮未运行复现，不称永久原件丢失。

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
  - [Q01 · 根项目是什么类型，给谁增加什么？](#detail-section-11)
  - [Q02 · 怎样将Markdown变为去重索引和混合检索？](#detail-section-12)
  - [Q03 · 影子索引可重建是否保证更新失败时仍完整？](#detail-section-13)
  - [Q04 · 配置、provider和重建带来什么全周期负担？](#detail-section-14)
  - [Q05 · 如何限定采用范围并保留可行退出？](#detail-section-15)
  - [Q06 · 来源版本先准备后切换能否降低索引空窗？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：根项目是Python语义记忆检索基础库与CLI，不是直接注册DSH生命周期的单个npm适配器。面向已有Markdown知识、项目历史和Agent记忆的开发者，合格结果是给自然语言问题返回相关片段及来源，可继续打开原文核对。调用者可以集成Python API或CLI，具体Agent自动捕获由各平台组件另行实现。

在相同Markdown语料上使用rg与人工笔记查找。核心API只比较候选检索及维护，不将Agent自动捕获或真实任务收益归入未经验证的根能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Python API / CLI索引 | 扫描和增量嵌入Markdown | 需要provider及Milvus，失败报告需检查 |
| 混合检索 | 自然语言与关键词共同找片段 | 分数不是事实置信度，需核对原文 |
| 单文件更新 | 定向更新而不裁剪无关来源 | 删除旧块先于新embedding，有失败窗口 |
| 文件watcher | 变更后自动索引 | 错误回调不保证持久自动补偿 |
| 可选重排 | 对更多候选二次排序 | 默认关闭，增加资源与数据处理边界 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python>=3.10及pyproject依赖 | 是 | API/CLI及文件索引 | 平台Milvus Lite约束分别核对 |
| embedding provider及模型 | 是 | 块与query向量 | 缺凭据/网络或本地资源会失败 |
| Milvus Lite/Server/Cloud | 是 | dense/sparse索引 | 需独立权限、备份与状态管理 |
| Markdown原件 | 是 | 用户真相源与重建依据 | 索引不能替代丢失原文 |
| reranker | 可选 | 候选二次排序 | 增加模型/远程请求，默认关闭 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 开发者备份小语料，固定Python、模型与后端 | 数据可由所选provider处理 |
| 2 | 配置独立collection并运行索引 | 检查failed_files，不仅看块数 |
| 3 | 用精确/语义问题查询并打开来源 | 原文支持结果，记录缺块与陈旧 |
| 4 | 修改来源并模拟provider失败 | 核对报告与恢复，不能把空结果当无历史 |
| 5 | 决定继续或停watch/close | 保留Markdown回文本搜索，另管派生库 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Python、embedding模型/provider、Milvus与索引磁盘；金额未知 | 路径/模型/collection配置，耗时未知 | API默认OpenAI，平台默认不能混用 |
| 持续使用 | 变更块与query embedding、可选重排 | 检查failed_files、来源及权限范围 | 不变ID可省重算，收益未测 |
| 失败恢复 | 重嵌入、索引重建及临时资源 | 核对缺块并恢复，耗时未知 | 原文件仍在不代表查询完整 |
| 迁移/退出 | 保留或删除本地/云索引 | 停watch、close后回文本搜索 | 模型或位置变化可能重算 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 混合检索 | dense+BM25经RRF融合 | 相对rg的正确率及人工时间 |
| 增量索引 | 复合ID跳过不变块 | 位置变动重算及全周期费用 |
| 恢复 | 原Markdown保留，可重试 | 删除后嵌入失败窗口和恢复时长 |
| 隔离 | collection及source_prefix过滤 | 不能替代存储权限和身份认证 |

> **思考**：[Q03](#research-q03)显示旧块删除先于新块embedding；provider失败时来源原文件仍在，但索引可能暂缺内容。可重建解释恢复依据，不能保证每次查询完整或恢复免费；IndexReport应成为使用完整覆盖结论的门槛。本轮未运行复现，不称永久原件丢失。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的贡献是以Markdown保持用户可编辑事实、让向量库成为可重建派生物，并用内容/位置/模型身份和有范围的清理组织增量索引。相比rg增加语义候选，成熟embedding、BM25和RRF来自已有方法，组合贡献不等于原创算法或任务胜出。

可借鉴的是单文件更新与目录清理分离、结构化失败报告和内容/模型身份绑定。移植需同样维护路径规范、embedding模型维度、Milvus schema与调用方重排约定，不能只复制ID算法。 不保证。_index_file先计算新ID，再删除不在新集合中的旧块，最后才对新块调用embedding与upsert。如果该来源已经变更且后续embedding失败，旧块已被删、新块未全部写入，索引可暂时缺少这份来源的内容。index_with_report会捕获并记录失败后继续其他文件，这提高批次可推进性，却不提供每个来源的新旧索引原子切换。此为源码顺序可解释的失败窗口，本轮没有注入故障运行，不能宣称发生了数据永久丢失。

Markdown原件不因这条索引路径被删除，所以重试或重建仍有恢复依据；但是恢复需要provider、计算和人工关注，且在恢复前的查询可能无结果或不完整。可重建是恢复能力，不能当作“不会漏检”“更新成功”或“零恢复成本”的证明。

结构化IndexReport明确failed_files，调用者应据此暂停依赖完整覆盖的任务，而不是只看indexed_chunks为正就认为全量就绪。watcher错误回调能报告失败并继续运行，但未在已读路径中见到持久的自动补偿任务，失败回调与确定恢复应分开验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)显示旧块删除先于新块embedding；provider失败时来源原文件仍在，但索引可能暂缺内容。可重建解释恢复依据，不能保证每次查询完整或恢复免费；IndexReport应成为使用完整覆盖结论的门槛。本轮未运行复现，不称永久原件丢失。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)建议已有Markdown且能管理Python/provider和索引的开发者，在独立collection用小语料比较语义与精确问题，打开原文核对并检查failed_files。缺块被当成无历史、原文不支持结果、provider数据边界不合适或恢复代价过大时，停止检索依赖并停watch/close，回到Markdown文本搜索。根API不代表DSH插件安装通过，本轮结论为有界试用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持可编辑真相源、增量ID和混合检索；更新失败存在索引替换空窗，实际效果与恢复成本未独立运行验证。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、src/memsearch/core.py、src/memsearch/store.py、src/memsearch/chunker.py、src/memsearch/config.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根组件聚焦Python core/store/chunker/config和项目说明；DSH子适配单独研究，本稿不以子组件结果证明根API运行。不执行Python、CLI、provider、Milvus或目标测试；JS/TS统计不代表Python规模。
- 下一步：后续固定语料、模型、后端及问题标注，记录准确查回、缺块、重复、费用和人工时间；在embedding/upsert失败阶段检验重试和退出。

**分析版本**

- **仓库**：[zilliztech/memsearch](https://github.com/zilliztech/memsearch)
- **版本号**：未声明（[固定提交 926ba5b](https://github.com/zilliztech/memsearch/tree/926ba5b7c3d53ae0f424fba9029c29e88718b687)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)提出未验证的来源版本准备后切换方案。先准备新嵌入再切换可见版本，失败保留最后成功版本并提示陈旧；需要处理重复、查询过滤和清理成本。按阶段注入失败，对比简单重试，不能减少空窗或维护代价过大则停止。

后续固定语料、模型、后端及问题标注，记录准确查回、缺块、重复、费用和人工时间；在embedding/upsert失败阶段检验重试和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 127 | 15651 | — | — | 96320 |
| .js | source | 4 | 3298 | 2723 | 456 | — |
| .js | test | 4 | 1816 | 1653 | 72 | — |
| .ts | test | 4 | 1469 | 1387 | 11 | — |
| .ts | source | 9 | 1788 | 1501 | 176 | — |
| .mjs | source | 1 | 179 | 170 | 9 | — |
| .md | example | 1 | 29 | — | — | 246 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/zilliztech/memsearch/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Markdown真相源和Milvus影子索引在增量失败时如何保持可解释的检索状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目是什么类型，给谁增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根项目是Python语义记忆检索基础库与CLI，不是直接注册DSH生命周期的单个npm适配器。面向已有Markdown知识、项目历史和Agent记忆的开发者，合格结果是给自然语言问题返回相关片段及来源，可继续打开原文核对。调用者可以集成Python API或CLI，具体Agent自动捕获由各平台组件另行实现。

简单基线是rg/文本搜索和人工维护笔记。MemSearch把Markdown保留为可编辑真相源，Milvus作为可重建影子索引，再结合embedding与关键词检索；在措辞不同但语义相近的历史中有可解释增量，而精确ID或少量笔记场景可能用文本搜索已足够。使用成熟BM25、embedding和RRF不构成自创算法，研究贡献在于可编辑文件、增量索引与多种接入的组合。没有同条件任务结果，不声称优于简单基线或实现零维护。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-46](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/README.md#L41-L46)

作者定位Markdown真相源、跨平台及混合检索。

```text
### Why memsearch?

- 🌐 **All Platforms, One Memory** — memories flow across [Claude Code](plugins/claude-code/README.md), [Codex](plugins/codex/README.md), [DeepSeek Harness](plugins/dsh/README.md), [OpenClaw](plugins/openclaw/README.md), and [OpenCode](plugins/opencode/README.md). A conversation in one agent becomes searchable context in all others — no extra setup
- 👥 **For Agent Users**, install a plugin and get persistent memory with zero effort; **for Agent Developers**, use the full [CLI](https://zilliztech.github.io/memsearch/cli/) and [Python API](https://zilliztech.github.io/memsearch/python-api/) to build memory and harness engineering into your own agents
- 📄 **Markdown is the source of truth** — inspired by [OpenClaw](https://github.com/openclaw/openclaw). Your memories are just `.md` files — human-readable, editable, version-controllable. Milvus is a "shadow index": a derived, rebuildable cache
- 🔍 **Progressive retrieval, hybrid search, smart dedup, live sync** — 3-layer recall (search → expand → transcript); dense vector + BM25 sparse + RRF reranking; SHA-256 content hashing skips unchanged content; file watcher auto-indexes in real time
```

**依据 2 · 源码核查**：[pyproject.toml:5-12](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/pyproject.toml#L5-L12)

Python基础库身份及版本。

```text
[project]
name = "memsearch"
version = "0.4.22"
description = "Semantic memory search for markdown knowledge bases"
readme = "README.md"
license = "MIT"
requires-python = ">=3.10"
classifiers = [
```

**依据 3 · 源码核查**：[src/memsearch/core.py:26-55](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/core.py#L26-L55)

API用户、索引路径、隔离与连接边界。

<details>
<summary>查看原文（30行）</summary>

```text
class MemSearch:
    """High-level API for semantic memory search.

    Parameters
    ----------
    paths:
        Directories / files to index.
    embedding_provider:
        Name of the embedding backend (``"openai"``, ``"google"``, etc.).
    embedding_model:
        Override the default model for the chosen provider.
    milvus_uri:
        Milvus connection URI.  A local ``*.db`` path uses Milvus Lite,
        ``http://host:port`` connects to a Milvus server, and a
        ``https://*.zillizcloud.com`` URL connects to Zilliz Cloud.
    milvus_token:
        Authentication token for Milvus server or Zilliz Cloud.
        Not needed for Milvus Lite (local).
    collection:
        Milvus collection name.  Use different names to isolate
        agents sharing the same Milvus server.
    description:
        Best-effort collection metadata written during creation. Some backends
        may not return it; indexing and search do not depend on it.
    ignore_files:
        Ignore filenames to discover within each directory index root, such
        as ``[".gitignore"]``. Empty by default for backward compatibility.
    exclude:
        Additional gitignore-style patterns applied relative to each index
        root after discovered ignore-file rules.
```

</details>

#### 缺口

- 不同措辞检索相对文本搜索的真实合格率未知
  **影响**：优势限定为机制上的召回范围，不是效果排名
  **进一步探讨**：对同一Markdown语料固定问题与标注，比较文本搜索、混合检索和人工核对时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎样将Markdown变为去重索引和混合检索？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

index_with_report扫描配置路径，逐文件分块、采集失败，最后只在本轮目录根内清理已不存在来源；显式单文件更新不裁剪无关文件。分块遵循Markdown标题、段落与重叠行。复合ID包含来源、起止行、内容哈希和模型，因此内容或模型变化会导致新的块身份，不变ID不重复嵌入。位置变动即使内容相同也可能产生新ID，去重并不等于整段语义永不重算。

写入前从原始内容清理embedding噪声，保存记录仍保留原文。查询先生成query embedding，再由Milvus同时进行dense cosine与BM25 sparse检索，RRFRanker融合并归一化分数。可选reranker会先取top_k三倍候选再重排；Jev调用被放入线程，避免其同步调用直接占当前异步链。归一化检索分不是事实置信度，结果仍应追溯原文。

可借鉴的是单文件更新与目录清理分离、结构化失败报告和内容/模型身份绑定。移植需同样维护路径规范、embedding模型维度、Milvus schema与调用方重排约定，不能只复制ID算法。

#### 证据与依据

**依据 1 · 源码核查**：[src/memsearch/core.py:112-157](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/core.py#L112-L157)

扫描、逐文件失败和目录范围清理。

<details>
<summary>查看原文（46行）</summary>

```text
    async def index_with_report(self, *, force: bool = False) -> IndexReport:
        """Scan paths and index all markdown files with structured status."""
        self._store._ensure_collection_for_write()
        files = scan_paths(
            self._paths,
            ignore_files=self._ignore_files,
            exclude=self._exclude,
        )
        total = 0
        failed_files: list[IndexFailure] = []
        active_sources: set[str] = set()
        for f in files:
            active_sources.add(str(f.path))
            try:
                n = await self._index_file(f, force=force)
                total += n
            except Exception as exc:
                failed_files.append(IndexFailure(path=str(f.path), error=format_error(exc)))
                logger.exception("Failed to index %s, skipping", f.path)

        # Clean up deleted files only inside directory roots from this run.
        # Explicit file paths are partial updates and must not prune unrelated
        # sources from the collection.
        cleanup_roots = _cleanup_roots_for_paths(self._paths)
        if cleanup_roots:
            indexed_sources = self._store.indexed_sources()
            for source in indexed_sources:
                if source not in active_sources and _source_under_any_root(source, cleanup_roots):
                    self._store.delete_by_source(source)
                    logger.info("Removed stale chunks for deleted file: %s", source)

        if failed_files:
            logger.warning(
                "Indexed %d chunks from %d files (%d files failed)",
                total,
                len(files) - len(failed_files),
                len(failed_files),
            )
        else:
            logger.info("Indexed %d chunks from %d files", total, len(files))
        return IndexReport(
            indexed_chunks=total,
            total_files=len(files),
            indexed_files=len(files) - len(failed_files),
            failed_files=tuple(failed_files),
        )
```

</details>

**依据 2 · 源码核查**：[src/memsearch/chunker.py:65-98](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/chunker.py#L65-L98)

复合ID与标题分块，能解释重算边界。

<details>
<summary>查看原文（34行）</summary>

```text
def compute_chunk_id(
    source: str,
    start_line: int,
    end_line: int,
    content_hash: str,
    model: str,
) -> str:
    """Compute a composite chunk ID matching OpenClaw's format.

    ``hash(source:path:startLine:endLine:contentHash:model)``
    """
    raw = f"markdown:{source}:{start_line}:{end_line}:{content_hash}:{model}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def chunk_markdown(
    text: str,
    source: str = "",
    *,
    max_chunk_size: int = 1500,
    overlap_lines: int = 2,
) -> list[Chunk]:
    """Split markdown *text* into chunks, breaking on headings.

    Chunks that exceed *max_chunk_size* characters are split further at
    paragraph boundaries.  A small *overlap_lines* context is carried
    forward to preserve continuity.
    """
    lines = text.split("\n")
    # Find all heading positions
    heading_positions: list[tuple[int, int, str]] = []  # (line_idx, level, title)
    for i, line in enumerate(lines):
        m = _HEADING_RE.match(line)
        if m:
```

</details>

**依据 3 · 源码核查**：[src/memsearch/core.py:167-214](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/core.py#L167-L214)

旧ID比较、内容清理和embedding后upsert。

<details>
<summary>查看原文（48行）</summary>

```text
    async def _index_file(self, f: ScannedFile, *, force: bool = False) -> int:
        source = str(f.path)
        text = read_utf8_text_replace(f.path)
        chunks = chunk_markdown(
            text,
            source=source,
            max_chunk_size=self._max_chunk_size,
            overlap_lines=self._overlap_lines,
        )
        model = self._embedder.model_name

        # Compute composite chunk IDs (matching OpenClaw format)
        chunk_ids = {compute_chunk_id(c.source, c.start_line, c.end_line, c.content_hash, model) for c in chunks}
        old_ids = self._store.hashes_by_source(source)

        # Delete stale chunks that are no longer in the file
        stale = old_ids - chunk_ids
        if stale:
            self._store.delete_by_hashes(list(stale))

        if not chunks:
            return 0

        if not force:
            # Only embed chunks whose ID doesn't already exist
            chunks = [
                c
                for c in chunks
                if compute_chunk_id(c.source, c.start_line, c.end_line, c.content_hash, model) not in old_ids
            ]
            if not chunks:
                return 0

        return await self._embed_and_store(chunks)

    async def _embed_and_store(self, chunks: list[Chunk]) -> int:
        if not chunks:
            return 0

        model = self._embedder.model_name
        total = 0
        for batch in _chunk_batches(chunks, self._embedder.batch_size):
            # Clean content for embedding: strip HTML comments and metadata noise
            # so the embedding vector captures semantics, not UUIDs/paths.
            # The original content is preserved in the Milvus record below.
            contents = [clean_content_for_embedding(c.content) for c in batch]
            embeddings = await self._embedder.embed(contents)
            total += self._store.upsert(_records_for_chunks(batch, embeddings, model))
```

</details>

**依据 4 · 源码核查**：[src/memsearch/core.py:248-264](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/core.py#L248-L264)

查询过滤、embedding与可选重排。

<details>
<summary>查看原文（17行）</summary>

```text
        filter_expr = ""
        if source_prefix is not None:
            prefix = str(Path(source_prefix).expanduser().resolve())
            escaped = prefix.replace("\\", "\\\\").replace('"', '\\"')
            filter_expr = f'source like "{escaped}%"'

        embeddings = await self._embedder.embed([query])
        fetch_k = top_k * 3 if self._reranker_model else top_k
        results = self._store.search(embeddings[0], query_text=query, top_k=fetch_k, filter_expr=filter_expr)
        if self._reranker_model and results:
            from .reranker import rerank

            if self._reranker_model.startswith("jev:"):
                results = await asyncio.to_thread(rerank, query, results, model_name=self._reranker_model, top_k=top_k)
            else:
                results = rerank(query, results, model_name=self._reranker_model, top_k=top_k)
        return results
```

</details>

**依据 5 · 源码核查**：[src/memsearch/store.py:266-297](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/store.py#L266-L297)

dense、BM25、RRF及分数归一化。

<details>
<summary>查看原文（32行）</summary>

```text
        dense_req = AnnSearchRequest(
            data=[query_embedding],
            anns_field="embedding",
            param={"metric_type": "COSINE", "params": {}},
            limit=top_k,
            **req_kwargs,
        )

        bm25_req = AnnSearchRequest(
            data=[query_text] if query_text else [""],
            anns_field="sparse_vector",
            param={"metric_type": "BM25"},
            limit=top_k,
            **req_kwargs,
        )

        reqs = [dense_req, bm25_req]
        rrf_k = 60
        results = client.hybrid_search(
            collection_name=self._collection,
            reqs=reqs,
            ranker=RRFRanker(k=rrf_k),
            limit=top_k,
            output_fields=self._QUERY_FIELDS,
        )

        if not results or not results[0]:
            return []
        # Normalize RRF scores to [0, 1].
        # Theoretical max = num_retrievers / (k + 1), when a result ranks #1 in every retriever.
        max_rrf = len(reqs) / (rrf_k + 1)
        return [{**hit["entity"], "score": hit["distance"] / max_rrf} for hit in results[0]]
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 影子索引可重建是否保证更新失败时仍完整？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不保证。_index_file先计算新ID，再删除不在新集合中的旧块，最后才对新块调用embedding与upsert。如果该来源已经变更且后续embedding失败，旧块已被删、新块未全部写入，索引可暂时缺少这份来源的内容。index_with_report会捕获并记录失败后继续其他文件，这提高批次可推进性，却不提供每个来源的新旧索引原子切换。此为源码顺序可解释的失败窗口，本轮没有注入故障运行，不能宣称发生了数据永久丢失。

Markdown原件不因这条索引路径被删除，所以重试或重建仍有恢复依据；但是恢复需要provider、计算和人工关注，且在恢复前的查询可能无结果或不完整。可重建是恢复能力，不能当作“不会漏检”“更新成功”或“零恢复成本”的证明。

结构化IndexReport明确failed_files，调用者应据此暂停依赖完整覆盖的任务，而不是只看indexed_chunks为正就认为全量就绪。watcher错误回调能报告失败并继续运行，但未在已读路径中见到持久的自动补偿任务，失败回调与确定恢复应分开验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/memsearch/core.py:178-214](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/core.py#L178-L214)

旧块删除在异步embedding之前，存在替换窗口。

<details>
<summary>查看原文（37行）</summary>

```text
        # Compute composite chunk IDs (matching OpenClaw format)
        chunk_ids = {compute_chunk_id(c.source, c.start_line, c.end_line, c.content_hash, model) for c in chunks}
        old_ids = self._store.hashes_by_source(source)

        # Delete stale chunks that are no longer in the file
        stale = old_ids - chunk_ids
        if stale:
            self._store.delete_by_hashes(list(stale))

        if not chunks:
            return 0

        if not force:
            # Only embed chunks whose ID doesn't already exist
            chunks = [
                c
                for c in chunks
                if compute_chunk_id(c.source, c.start_line, c.end_line, c.content_hash, model) not in old_ids
            ]
            if not chunks:
                return 0

        return await self._embed_and_store(chunks)

    async def _embed_and_store(self, chunks: list[Chunk]) -> int:
        if not chunks:
            return 0

        model = self._embedder.model_name
        total = 0
        for batch in _chunk_batches(chunks, self._embedder.batch_size):
            # Clean content for embedding: strip HTML comments and metadata noise
            # so the embedding vector captures semantics, not UUIDs/paths.
            # The original content is preserved in the Milvus record below.
            contents = [clean_content_for_embedding(c.content) for c in batch]
            embeddings = await self._embedder.embed(contents)
            total += self._store.upsert(_records_for_chunks(batch, embeddings, model))
```

</details>

**依据 2 · 源码核查**：[src/memsearch/core.py:123-157](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/core.py#L123-L157)

错误被记录并继续，块数不代表全量成功。

<details>
<summary>查看原文（35行）</summary>

```text
        for f in files:
            active_sources.add(str(f.path))
            try:
                n = await self._index_file(f, force=force)
                total += n
            except Exception as exc:
                failed_files.append(IndexFailure(path=str(f.path), error=format_error(exc)))
                logger.exception("Failed to index %s, skipping", f.path)

        # Clean up deleted files only inside directory roots from this run.
        # Explicit file paths are partial updates and must not prune unrelated
        # sources from the collection.
        cleanup_roots = _cleanup_roots_for_paths(self._paths)
        if cleanup_roots:
            indexed_sources = self._store.indexed_sources()
            for source in indexed_sources:
                if source not in active_sources and _source_under_any_root(source, cleanup_roots):
                    self._store.delete_by_source(source)
                    logger.info("Removed stale chunks for deleted file: %s", source)

        if failed_files:
            logger.warning(
                "Indexed %d chunks from %d files (%d files failed)",
                total,
                len(files) - len(failed_files),
                len(failed_files),
            )
        else:
            logger.info("Indexed %d chunks from %d files", total, len(files))
        return IndexReport(
            indexed_chunks=total,
            total_files=len(files),
            indexed_files=len(files) - len(failed_files),
            failed_files=tuple(failed_files),
        )
```

</details>

**依据 3 · 源码核查**：[src/memsearch/core.py:406-423](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/core.py#L406-L423)

watcher捕获失败并回调，不能据此断言自动恢复。

<details>
<summary>查看原文（18行）</summary>

```text
        def _on_change(event_type: str, file_path: Path) -> None:
            try:
                if event_type == "deleted":
                    self._store.delete_by_source(str(file_path))
                    summary = f"Removed chunks for {file_path}"
                else:
                    n = loop.run_until_complete(self.index_file(file_path))
                    summary = f"Indexed {n} chunks from {file_path}"
                logger.info(summary)
                if on_event is not None:
                    on_event(event_type, summary, file_path)
            except Exception as exc:
                # Watch is a long-running daemon callback — swallow any failure
                # (network blips, provider 500s, malformed embeddings, disk
                # errors, etc.) so a single bad file cannot crash the watcher.
                logger.exception("Failed to process %s event for %s", event_type, file_path)
                if on_error is not None:
                    on_error(event_type, exc, file_path)
```

</details>

#### 缺口

- 目标Milvus与provider在部分批次失败时的实际可见性未知
  **影响**：不能把此窗口扩展为所有请求必然失败或永久丢数据
  **进一步探讨**：修改单个来源后注入embedding失败，检查旧/新块、IndexReport和重试后的恢复完整性

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配置、provider和重建带来什么全周期负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Python>=3.10，基础依赖包括pymilvus、Milvus Lite、文件watcher与OpenAI库；可选embedding provider及ONNX/local扩展决定网络、模型下载和内存条件。API默认embedding_provider为openai，平台插件可能自行选本地默认，不能把平台“无配置本地ONNX”推广成根API默认。Milvus可以是本地db、服务器或云服务，权限、备份与费用随选择变化。

项目本地配置受白名单约束，只允许collection、分块、索引排除、debounce等局部设置，不能重定向endpoint、凭据、LLM或模型下载；这将打开陌生仓库的配置能力收窄，值得复用，但不是内容本身可信或provider永不外传的证明。

首次需要选provider、模型、路径、collection并建立索引；持续需要处理文件变更、模型替换、provider配额和失败报告；失败重建会重付embedding和索引资源。金额、语料规模、延迟及人工时间无实际记录，不计算成本或ROI。退出时保留Markdown即可继续用文本搜索，但应主动停watcher、关闭store并管理索引保留/删除。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-54](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/pyproject.toml#L5-L54)

Python和平台/可选provider依赖。

<details>
<summary>查看原文（50行）</summary>

```text
[project]
name = "memsearch"
version = "0.4.22"
description = "Semantic memory search for markdown knowledge bases"
readme = "README.md"
license = "MIT"
requires-python = ">=3.10"
classifiers = [
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Programming Language :: Python :: 3.13",
]
dependencies = [
    "pymilvus>=2.5.0,!=2.6.10; sys_platform != 'win32'",
    "pymilvus>=2.6.11; sys_platform == 'win32'",
    "milvus-lite>=2.5.0; sys_platform != 'win32'",
    "milvus-lite>=3.1.1; sys_platform == 'win32'",
    "click>=8.1",
    "watchdog>=4.0",
    "pathspec>=0.12",
    "setuptools>=78.1.1,<81",
    "tomli_w>=1.0",
    "tomli>=2.0; python_version < '3.11'",
    "openai>=1.0",
]

[project.optional-dependencies]
google = ["google-genai>=1.0"]
voyage = ["voyageai>=0.3"]
jina = ["httpx>=0.27"]
mistral = ["mistralai>=1.0"]
ollama = [
    "ollama>=0.4",
]
local = [
    "einops>=0.8.2",
    "sentence-transformers>=3.0",
]
anthropic = ["anthropic>=0.40"]
onnx = [
    "onnxruntime>=1.17,<1.24; python_version == '3.10'",
    "onnxruntime>=1.17; python_version >= '3.11'",
    "tokenizers>=0.15",
    "huggingface-hub>=0.20",
]
all = ["memsearch[google,voyage,jina,mistral,ollama,local,anthropic,onnx]"]

[project.scripts]
memsearch = "memsearch.cli:cli"
```

</details>

**依据 2 · 源码核查**：[src/memsearch/core.py:58-95](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/core.py#L58-L95)

API默认provider与Milvus配置。

<details>
<summary>查看原文（38行）</summary>

```text
    def __init__(
        self,
        paths: list[str | Path] | None = None,
        *,
        embedding_provider: str = "openai",
        embedding_model: str | None = None,
        embedding_batch_size: int = 0,
        embedding_base_url: str | None = None,
        embedding_api_key: str | None = None,
        milvus_uri: str = "~/.memsearch/milvus.db",
        milvus_token: str | None = None,
        collection: str = "memsearch_chunks",
        description: str = "",
        max_chunk_size: int = 1500,
        overlap_lines: int = 2,
        ignore_files: list[str] | None = None,
        exclude: list[str] | None = None,
        reranker_model: str = "",
    ) -> None:
        self._paths = [str(p) for p in (paths or [])]
        self._max_chunk_size = max_chunk_size
        self._overlap_lines = overlap_lines
        self._ignore_files = list(ignore_files or [])
        self._exclude = list(exclude or [])
        self._embedder: EmbeddingProvider = get_provider(
            embedding_provider,
            model=embedding_model,
            batch_size=embedding_batch_size,
            base_url=embedding_base_url,
            api_key=embedding_api_key,
        )
        self._store = MilvusStore(
            uri=milvus_uri,
            token=milvus_token,
            collection=collection,
            dimension=self._embedder.dimension,
            description=description,
            _create_if_missing=False,
```

</details>

**依据 3 · 源码核查**：[src/memsearch/config.py:34-46](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/config.py#L34-L46)

项目配置白名单，限制网络和凭据重定向。

<details>
<summary>查看原文（13行）</summary>

```text
# Project-local config is loaded from the repository being opened, so it must
# not be able to redirect network endpoints, credentials, LLM routing, prompt
# files, plugin automation, or remote model downloads. Keep this layer limited
# to low-risk local indexing knobs.
_PROJECT_CONFIG_ALLOWED_PATHS = {
    ("milvus", "collection"),
    ("embedding", "batch_size"),
    ("chunking", "max_chunk_size"),
    ("chunking", "overlap_lines"),
    ("indexing", "ignore_files"),
    ("indexing", "exclude"),
    ("watch", "debounce_ms"),
}
```

</details>

**依据 4 · 源码核查**：[src/memsearch/store.py:399-418](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/store.py#L399-L418)

drop与close不同，Lite关闭释放服务器。

<details>
<summary>查看原文（20行）</summary>

```text
    def drop(self) -> None:
        """Drop the entire collection."""
        if self._client is not None and self._client.has_collection(self._collection):
            self._client.drop_collection(self._collection)
            self._collection_exists = False

    def close(self) -> None:
        if self._client is None:
            return
        self._client.close()
        # Milvus Lite: release the server process to free the db file lock.
        # Without this, the milvus_lite subprocess outlives the parent and
        # blocks subsequent CLI invocations from opening the same .db file.
        if self._is_lite:
            try:
                from milvus_lite.server_manager import server_manager_instance

                server_manager_instance.release_server(self._resolved_uri)
            except Exception:
                pass
```

</details>

#### 缺口

- 用户语料上的费用、内存和恢复耗时未知
  **影响**：不能把影子索引或本地存储称为免费低成本
  **进一步探讨**：固定语料及provider记录初次/增量/重建资源，计入失败和人工核查

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何限定采用范围并保留可行退出？

**研究主题**：采用判断、依赖、兼容与流程

#### 完整回答

值得试用的对象是已经拥有可备份Markdown、能管理Python/provider和索引的开发者，任务限定为从历史片段找回可人工核对的决策。先在独立collection与小语料中索引并检查failed_files，再比较精确关键词与语义问题的结果，打开来源确认。自动Agent捕获和Skill维护另看各平台适配器，不能由根API可用推导DSH安装通过。

collection用于逻辑隔离，source_prefix只是查询范围选择；二者不等于账号权限系统。若不同团队共享远端Milvus，应由存储权限和调用方明确隔离，不把过滤条件当安全边界。路径移动、模型改变和新增provider时重新检查索引状态及成本。

一旦发现缺块被当成无历史、结果不支持当前任务、语料不能发送给所选provider，或增量失败无法在可接受时间恢复，应停止依赖检索并回到原Markdown和文本搜索。该退出保留真相源，较封闭私有记忆库更可解释，但仍需维护者清点远端索引与持续watch进程。结论为基础库的有界试用，不是宿主安装推荐。

#### 证据与依据

**依据 1 · 源码核查**：[src/memsearch/core.py:31-46](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/core.py#L31-L46)

collection用于隔离但未宣称权限控制。

<details>
<summary>查看原文（16行）</summary>

```text
    paths:
        Directories / files to index.
    embedding_provider:
        Name of the embedding backend (``"openai"``, ``"google"``, etc.).
    embedding_model:
        Override the default model for the chosen provider.
    milvus_uri:
        Milvus connection URI.  A local ``*.db`` path uses Milvus Lite,
        ``http://host:port`` connects to a Milvus server, and a
        ``https://*.zillizcloud.com`` URL connects to Zilliz Cloud.
    milvus_token:
        Authentication token for Milvus server or Zilliz Cloud.
        Not needed for Milvus Lite (local).
    collection:
        Milvus collection name.  Use different names to isolate
        agents sharing the same Milvus server.
```

</details>

**依据 2 · 源码核查**：[src/memsearch/core.py:222-256](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/core.py#L222-L256)

source_prefix为检索过滤，不是身份认证。

<details>
<summary>查看原文（35行）</summary>

```text
    async def search(
        self,
        query: str,
        *,
        top_k: int = 10,
        source_prefix: str | Path | None = None,
    ) -> list[dict[str, Any]]:
        """Semantic search across indexed chunks.

        Parameters
        ----------
        query:
            Natural-language query.
        top_k:
            Maximum results to return.
        source_prefix:
            Optional path prefix to scope results. Only chunks whose
            ``source`` starts with this prefix are returned.

        Returns
        -------
        list[dict]
            Each dict contains ``content``, ``source``, ``heading``,
            ``score``, and other metadata.
        """
        self._store._require_collection()
        filter_expr = ""
        if source_prefix is not None:
            prefix = str(Path(source_prefix).expanduser().resolve())
            escaped = prefix.replace("\\", "\\\\").replace('"', '\\"')
            filter_expr = f'source like "{escaped}%"'

        embeddings = await self._embedder.embed([query])
        fetch_k = top_k * 3 if self._reranker_model else top_k
        results = self._store.search(embeddings[0], query_text=query, top_k=fetch_k, filter_expr=filter_expr)
```

</details>

**依据 3 · 源码核查**：[src/memsearch/core.py:112-157](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/core.py#L112-L157)

失败报告支持试用验收。

<details>
<summary>查看原文（46行）</summary>

```text
    async def index_with_report(self, *, force: bool = False) -> IndexReport:
        """Scan paths and index all markdown files with structured status."""
        self._store._ensure_collection_for_write()
        files = scan_paths(
            self._paths,
            ignore_files=self._ignore_files,
            exclude=self._exclude,
        )
        total = 0
        failed_files: list[IndexFailure] = []
        active_sources: set[str] = set()
        for f in files:
            active_sources.add(str(f.path))
            try:
                n = await self._index_file(f, force=force)
                total += n
            except Exception as exc:
                failed_files.append(IndexFailure(path=str(f.path), error=format_error(exc)))
                logger.exception("Failed to index %s, skipping", f.path)

        # Clean up deleted files only inside directory roots from this run.
        # Explicit file paths are partial updates and must not prune unrelated
        # sources from the collection.
        cleanup_roots = _cleanup_roots_for_paths(self._paths)
        if cleanup_roots:
            indexed_sources = self._store.indexed_sources()
            for source in indexed_sources:
                if source not in active_sources and _source_under_any_root(source, cleanup_roots):
                    self._store.delete_by_source(source)
                    logger.info("Removed stale chunks for deleted file: %s", source)

        if failed_files:
            logger.warning(
                "Indexed %d chunks from %d files (%d files failed)",
                total,
                len(files) - len(failed_files),
                len(failed_files),
            )
        else:
            logger.info("Indexed %d chunks from %d files", total, len(files))
        return IndexReport(
            indexed_chunks=total,
            total_files=len(files),
            indexed_files=len(files) - len(failed_files),
            failed_files=tuple(failed_files),
        )
```

</details>

**依据 4 · 作者声明**：[README.md:43-46](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/README.md#L43-L46)

可编辑Markdown真相源提供退出基线。

```text
- 🌐 **All Platforms, One Memory** — memories flow across [Claude Code](plugins/claude-code/README.md), [Codex](plugins/codex/README.md), [DeepSeek Harness](plugins/dsh/README.md), [OpenClaw](plugins/openclaw/README.md), and [OpenCode](plugins/opencode/README.md). A conversation in one agent becomes searchable context in all others — no extra setup
- 👥 **For Agent Users**, install a plugin and get persistent memory with zero effort; **for Agent Developers**, use the full [CLI](https://zilliztech.github.io/memsearch/cli/) and [Python API](https://zilliztech.github.io/memsearch/python-api/) to build memory and harness engineering into your own agents
- 📄 **Markdown is the source of truth** — inspired by [OpenClaw](https://github.com/openclaw/openclaw). Your memories are just `.md` files — human-readable, editable, version-controllable. Milvus is a "shadow index": a derived, rebuildable cache
- 🔍 **Progressive retrieval, hybrid search, smart dedup, live sync** — 3-layer recall (search → expand → transcript); dense vector + BM25 sparse + RRF reranking; SHA-256 content hashing skips unchanged content; file watcher auto-indexes in real time
```

#### 缺口

- 用户实际任务及存储权限配置未验收
  **影响**：只支持有条件试用，不能推荐持续生产采用
  **进一步探讨**：记录语料、provider、Milvus权限和原文核查，以同任务效果及失败恢复决定继续

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 来源版本先准备后切换能否降低索引空窗？

**研究主题**：新假设与验证

#### 完整回答

未验证设计假设是把每个来源的新块先完成embedding并保存到待发布版本，再切换该来源的可见版本并回收旧块。Q03的先删后嵌入窗口提供推导依据，目标是在provider失败时保留最后成功版本，同时向调用者说明该来源仍旧，而不是静默缺块。

它不是简单把delete移到最后就完成事务。若同时返回新旧块，检索可能重复；若改查询过滤版本，需要保证所有入口遵守；还会增加临时存储、失败清理和并发写协调。因此应比较当前方案、简单重试和版本切换三条路径。

最小验证是对同一来源进行十次更新，分别在embedding、upsert和切换阶段注入失败，检查可见版本、重复块、完整覆盖、恢复耗时和资源。只有在无混合版本且减少不可查询窗口、成本可接受时才支持；若简单重试已满足任务或切换引入更大维护负担就否定。该设想未实现，不计入现有创新分。

#### 证据与依据

**依据 1 · 源码核查**：[src/memsearch/core.py:178-214](https://github.com/zilliztech/memsearch/blob/926ba5b7c3d53ae0f424fba9029c29e88718b687/src/memsearch/core.py#L178-L214)

先删后嵌入是版本切换假设的具体起点。

<details>
<summary>查看原文（37行）</summary>

```text
        # Compute composite chunk IDs (matching OpenClaw format)
        chunk_ids = {compute_chunk_id(c.source, c.start_line, c.end_line, c.content_hash, model) for c in chunks}
        old_ids = self._store.hashes_by_source(source)

        # Delete stale chunks that are no longer in the file
        stale = old_ids - chunk_ids
        if stale:
            self._store.delete_by_hashes(list(stale))

        if not chunks:
            return 0

        if not force:
            # Only embed chunks whose ID doesn't already exist
            chunks = [
                c
                for c in chunks
                if compute_chunk_id(c.source, c.start_line, c.end_line, c.content_hash, model) not in old_ids
            ]
            if not chunks:
                return 0

        return await self._embed_and_store(chunks)

    async def _embed_and_store(self, chunks: list[Chunk]) -> int:
        if not chunks:
            return 0

        model = self._embedder.model_name
        total = 0
        for batch in _chunk_batches(chunks, self._embedder.batch_size):
            # Clean content for embedding: strip HTML comments and metadata noise
            # so the embedding vector captures semantics, not UUIDs/paths.
            # The original content is preserved in the Milvus record below.
            contents = [clean_content_for_embedding(c.content) for c in batch]
            embeddings = await self._embedder.embed(contents)
            total += self._store.upsert(_records_for_chunks(batch, embeddings, model))
```

</details>

#### 缺口

- Milvus目标部署是否支持合适切换语义
  **影响**：仅为未验证假设，可能需要调用方版本过滤
  **进一步探讨**：用固定后端注入失败，比较简单重试与可见版本方案

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
