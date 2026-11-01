# MemSearch

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[65d8b22](https://github.com/zilliztech/memsearch/tree/65d8b220d4265f70441785aa22203f0e85ea3ec6)

<!-- BEGIN META -->
[![GitHub ★ 2,814](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C814&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch)
<!-- END META -->

> **功能**：面向 Markdown 知识库提供增量索引和语义加关键词混合搜索。

> **亮点**：[Q02](#research-q02) 组合文件来源、增量索引与混合检索；embedding、BM25 和 RRF 本身是既有方法。

> **主要限制**：[Q03](#research-q03) stale 旧块先删，随后 embedding 或 upsert 失败时索引可能暂缺，报告必须与结果一起核查。

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
  - [Q01 · 谁需要根语义搜索，与文本搜索相比改变什么？](#detail-section-11)
  - [Q02 · Markdown 如何成为增量索引和混合结果？](#detail-section-12)
  - [Q03 · 索引失败时是否仍完整？](#detail-section-13)
  - [Q04 · 安装、查询和退出需要什么？](#detail-section-14)
  - [Q05 · 什么时候值得采用、如何验收？](#detail-section-15)
  - [Q06 · 如何降低更新失败期间的检索缺口？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要跨 Markdown 文件用不同措辞查找资料、能回读原文的用户。

直接 Markdown、grep 和人工笔记已经能查找资料；混合搜索增加语义候选，也引入模型和索引成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 文件分块 | 以来源和内容维护派生索引 | 行位置或模型变化会改变 ID |
| 混合搜索 | dense 和关键词候选融合 | 分数不证明事实 |
| 文件更新 | 增量修改索引 | 删除旧块后失败可能缺块 |
| 索引报告 | 显示失败来源 | 便利 index 只返回块数 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python 3.10+ 和依赖 | 必需 | 根 CLI/API | 不能运行 |
| embedding provider | 必需 | 索引和查询向量 | 无法语义搜索 |
| Milvus 后端 | 必需 | 稠密与稀疏索引 | 检索不可用 |
| 原始 Markdown | 重建必需 | 用户可读来源 | 派生索引不能代替原文 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份小语料并固定模型 | 确认数据处理范围 |
| 索引 | 根 API 写隔离 collection | 检查 failed_files |
| 搜索 | 用户对照问题并打开来源 | 原文支持结论 |
| 恢复 | 修复失败或回文本检索 | 核对缺块，不盲信空结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | Python、模型和 Milvus | 配置与备份 | 平台兼容未测 |
| 持续 | 向量、查询及可选重排 | 核对来源和变更 | 净收益未知 |
| 失败 | 重试及重新嵌入 | 检查报告和索引缺口 | 时间费用未知 |
| 退出 | 保留原文件和派生库 | 停 watcher、回 grep | 数据库另行管理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可编辑原文 | 以文件扫描构建索引 | 原文事实正确 |
| 混合召回 | dense/BM25 加 RRF | 比 grep 更准确 |
| 失败反馈 | per-file failed_files | 更新期间查询完整 |

> **思考**：[Q03](#research-q03) stale 旧块先删，随后 embedding 或 upsert 失败时索引可能暂缺，报告必须与结果一起核查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 组合文件来源、增量索引与混合检索；embedding、BM25 和 RRF 本身是既有方法。

[Q02](#research-q02) 复合 chunk ID 和目录范围清理支持增量；[Q03](#research-q03) 删除先于 embedding，可能暂时缺块。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) stale 旧块先删，随后 embedding 或 upsert 失败时索引可能暂缺，报告必须与结果一起核查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 在隔离 collection 先验报告并对照 grep；有失败或不能核对来源时回原文件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根源码静态核查；未运行模型、Milvus、watcher 或故障注入。

- 已检查：作者 README、包清单、源码路径 pyproject.toml、README.md、src/memsearch/core.py、src/memsearch/chunker.py、src/memsearch/store.py、src/memsearch/index_report.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅静态核查根 Python API、配置、chunker、Milvus 混合检索和报告；未研究同仓宿主适配组件，未运行模型或后端。inventory 的 JS/TS 统计不代表 Python 代码总量。
- 下一步：隔离语料测试逐文件失败、embedding 中断、部分写入和恢复，再与 grep 的固定问题集比较。

**分析版本**

- **仓库**：[zilliztech/memsearch](https://github.com/zilliztech/memsearch)
- **版本号**：未声明（[固定提交 65d8b22](https://github.com/zilliztech/memsearch/tree/65d8b220d4265f70441785aa22203f0e85ea3ec6)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提议隔离新版本并在完整写入后切换可见范围；后端原子性和成本需要验证。

隔离语料测试逐文件失败、embedding 中断、部分写入和恢复，再与 grep 的固定问题集比较。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 127 | 15648 | — | — | 96304 |
| .js | source | 4 | 3250 | 2684 | 450 | — |
| .js | test | 5 | 1858 | 1694 | 72 | — |
| .ts | test | 4 | 1469 | 1387 | 11 | — |
| .ts | source | 9 | 1788 | 1501 | 176 | — |
| .mjs | source | 1 | 179 | 170 | 9 | — |
| .md | example | 1 | 29 | — | — | 246 |

</details>

**活跃度**

[![Issue 未关闭 42](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=42&color=737b86&logo=github)](https://github.com/zilliztech/memsearch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=16&color=737b86&logo=github)](https://github.com/zilliztech/memsearch/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=23&color=737b86&logo=github)](https://github.com/zilliztech/memsearch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根包 Markdown 增量索引、混合检索和更新失败边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要根语义搜索，与文本搜索相比改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

MemSearch 根项目面向维护 Markdown 知识库并希望用语义和关键词查找相关段落的开发者。原办法是文件目录、grep 或人工笔记；根包扫描、分块、嵌入并维护向量库，再按来源返回候选。其工程增量是保持原 Markdown 可编辑并维护派生索引，而不是发明 embedding、BM25 或 RRF；语义候选可能找到不同措辞，也会增加后端、模型、误召回和索引维护成本。与 grep 相比的准确率及节省时间未独立测试。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-11](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/pyproject.toml#L5-L11)

根包身份、版本和 Python 条件。

```text
[project]
name = "memsearch"
version = "0.4.23"
description = "Semantic memory search for markdown knowledge bases"
readme = "README.md"
license = "MIT"
requires-python = ">=3.10"
```

**依据 2 · 源码核查**：[pyproject.toml:53-54](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/pyproject.toml#L53-L54)

根 CLI 入口。

```text
[project.scripts]
memsearch = "memsearch.cli:cli"
```

**依据 3 · 源码核查**：[src/memsearch/core.py:103-114](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L103-L114)

根索引与结构报告。

<details>
<summary>查看原文（12行）</summary>

```text
    async def index(self, *, force: bool = False) -> int:
        """Scan paths and index all markdown files.

        Returns the number of chunks indexed.  Also removes chunks for
        files that no longer exist on disk (deleted-file cleanup).
        """
        report = await self.index_with_report(force=force)
        return report.indexed_chunks

    async def index_with_report(self, *, force: bool = False) -> IndexReport:
        """Scan paths and index all markdown files with structured status."""
        self._store._ensure_collection_for_write()
```

</details>

**依据 4 · 源码核查**：[src/memsearch/store.py:245-251](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/store.py#L245-L251)

向量和 BM25 混合搜索。

```text
        *,
        query_text: str = "",
        top_k: int = 10,
        filter_expr: str = "",
    ) -> list[dict[str, Any]]:
        """Hybrid search: dense vector + BM25 full-text with RRF reranking."""
        from pymilvus import AnnSearchRequest, RRFRanker
```

#### 缺口

- 没有同一语料与问题的文本搜索对照
  **影响**：不能证明更快、更准确或更便宜
  **进一步探讨**：固定问答集比较 grep、混合搜索的正确召回、漏召回及人工时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Markdown 如何成为增量索引和混合结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

index_with_report 扫描所选路径，对文件逐一分块；chunk ID 结合 source、起止行、内容哈希和 embedding model，已有 ID 可跳过重新嵌入，因此行位移或模型变化也会改变身份。它只在本轮目录根内清理已删除来源，显式单文件更新不会裁掉其他来源。新块按批次调用 embedder，再 upsert Milvus；搜索提供 query embedding 和原文，由 dense cosine 与 BM25 两路通过 RRF 融合，返回来源与分数。分数是检索排名，不是事实可信度；所有具体后端和模型行为未运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/memsearch/chunker.py:47-77](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/chunker.py#L47-L77)

内容哈希和复合 chunk ID。

<details>
<summary>查看原文（31行）</summary>

```text
@dataclass(frozen=True)
class Chunk:
    """A single chunk extracted from a markdown document."""

    content: str
    source: str  # file path
    heading: str  # nearest heading (empty string for preamble)
    heading_level: int  # 0 for preamble
    start_line: int
    end_line: int
    content_hash: str = field(default="", repr=False)

    def __post_init__(self) -> None:
        if not self.content_hash:
            h = hashlib.sha256(self.content.encode()).hexdigest()[:16]
            object.__setattr__(self, "content_hash", h)


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
```

</details>

**依据 2 · 源码核查**：[src/memsearch/core.py:112-140](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L112-L140)

逐文件扫描和有范围清理。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/memsearch/core.py:167-200](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L167-L200)

分块、旧 ID 比较与增量嵌入。

<details>
<summary>查看原文（34行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/memsearch/core.py:202-214](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L202-L214)

批次 embedding 与 upsert。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 5 · 源码核查**：[src/memsearch/core.py:222-245](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L222-L245)

查询接口和来源元数据。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[src/memsearch/store.py:245-297](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/store.py#L245-L297)

向量、BM25、RRF 和分数。

<details>
<summary>查看原文（53行）</summary>

```text
        *,
        query_text: str = "",
        top_k: int = 10,
        filter_expr: str = "",
    ) -> list[dict[str, Any]]:
        """Hybrid search: dense vector + BM25 full-text with RRF reranking."""
        from pymilvus import AnnSearchRequest, RRFRanker

        self._require_collection()
        client = self._connected_client()

        # BM25 crashes on empty collections (avgdl=0 → NaN). See #306. Remote
        # Milvus metadata omits growing rows, so confirm zero metadata counts
        # with a strong query before treating the collection as empty.
        if self._collection_is_empty():
            return []

        req_kwargs: dict[str, Any] = {}
        if filter_expr:
            req_kwargs["expr"] = filter_expr

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

#### 缺口

- 未跑实际模型和 Milvus
  **影响**：无法证明所选后端支持及搜索质量
  **进一步探讨**：用隔离 collection 比较原文、行号、模型改变和检索结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 索引失败时是否仍完整？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

_index_file 先删除旧的 stale chunk，再对新块 embedding 和 upsert；若模型或存储失败，旧原文件仍在，但索引可能暂时缺失已删除块或只写入部分新批次。index_with_report 捕获单文件异常并返回 failed_files 与 degraded，旧 index 便利接口只返回 indexed_chunks 数，因此调用者必须检查报告而不能把返回数量当完整性证明。文件能重建为恢复依据，不保证实时查询完整、自动重试、低成本或成功恢复；静态发现的是失败窗口，本轮未实际复现。

#### 证据与依据

**依据 1 · 源码核查**：[src/memsearch/core.py:103-110](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L103-L110)

便利 index 仅返回块数。

```text
    async def index(self, *, force: bool = False) -> int:
        """Scan paths and index all markdown files.

        Returns the number of chunks indexed.  Also removes chunks for
        files that no longer exist on disk (deleted-file cleanup).
        """
        report = await self.index_with_report(force=force)
        return report.indexed_chunks
```

**依据 2 · 源码核查**：[src/memsearch/core.py:123-130](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L123-L130)

捕获逐文件失败。

```text
        for f in files:
            active_sources.add(str(f.path))
            try:
                n = await self._index_file(f, force=force)
                total += n
            except Exception as exc:
                failed_files.append(IndexFailure(path=str(f.path), error=format_error(exc)))
                logger.exception("Failed to index %s, skipping", f.path)
```

**依据 3 · 源码核查**：[src/memsearch/core.py:152-156](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L152-L156)

报告失败文件。

```text
        return IndexReport(
            indexed_chunks=total,
            total_files=len(files),
            indexed_files=len(files) - len(failed_files),
            failed_files=tuple(failed_files),
```

**依据 4 · 源码核查**：[src/memsearch/core.py:178-200](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L178-L200)

删除 stale 先于新嵌入。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/memsearch/core.py:202-214](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L202-L214)

分批 embedding 后 upsert。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 6 · 源码核查**：[src/memsearch/index_report.py:19-30](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/index_report.py#L19-L30)

失败导致 degraded。

<details>
<summary>查看原文（12行）</summary>

```text
@dataclass(frozen=True)
class IndexReport:
    """Structured result for a completed indexing pass."""

    indexed_chunks: int
    total_files: int
    indexed_files: int
    failed_files: tuple[IndexFailure, ...] = ()

    @property
    def status(self) -> str:
        return "degraded" if self.failed_files else "ok"
```

</details>

#### 缺口

- 未对 provider 和存储注入故障
  **影响**：未量化缺失时长、部分写入及恢复成本
  **进一步探讨**：隔离副本在删除后和不同批次注入异常，核查报告、原文件与恢复后查询。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、查询和退出需要什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根包需要 Python 3.10+、pymilvus/Milvus Lite 等依赖和 embedding provider；支持本地或远程模型与后端，默认构造参数是 OpenAI，具体凭据、网络及平台取决于配置。首次需要备份文件、选择 collection、模型与权限并建立索引；持续查询也需 query embedding，重建、模型变更和可选 reranker 会产生资源、人工及可能的服务费用。若 provider 不应接收内容须选经核对的本地配置；退出可停止 watcher、保留 Markdown 原件并回 grep，派生库的保留与删除应另行处理。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-29](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/pyproject.toml#L5-L29)

Python、Milvus 和基础依赖。

<details>
<summary>查看原文（25行）</summary>

```text
[project]
name = "memsearch"
version = "0.4.23"
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
```

</details>

**依据 2 · 源码核查**：[pyproject.toml:32-49](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/pyproject.toml#L32-L49)

可选本地和远程模型依赖。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/memsearch/core.py:55-95](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L55-L95)

默认 OpenAI 与后端配置。

<details>
<summary>查看原文（41行）</summary>

```text
        root after discovered ignore-file rules.
    """

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

**依据 4 · 源码核查**：[src/memsearch/core.py:202-214](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L202-L214)

索引时模型调用。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 5 · 作者声明**：[README.md:200-212](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/README.md#L200-L212)

作者说明 provider 可配置。

<details>
<summary>查看原文（13行）</summary>

````text
All plugins share the same memsearch backend. Configure once, works everywhere.

#### Embedding

Use **ONNX bge-m3** for local CPU embeddings with no API key. On first launch the model (~558 MB) is downloaded from HuggingFace Hub.

```bash
memsearch config set embedding.provider onnx     # local, free
memsearch config set embedding.provider openai   # needs OPENAI_API_KEY
memsearch config set embedding.provider ollama   # local, any model
```

> All providers and models: [Configuration — Embedding Provider](https://zilliztech.github.io/memsearch/home/configuration/#embedding-provider)
````

</details>

#### 缺口

- 未测部署、费用、索引容量或退出
  **影响**：不能给出实际成本和跨平台兼容性
  **进一步探讨**：用受控小语料测首建、更新、查询和重建的时间与账单。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么时候值得采用、如何验收？

**研究主题**：贡献与相对优势、采用判断

#### 完整回答

当资料跨多个文件、同义表达频繁且能容忍并复核候选时，可对备份的小型语料建立隔离 collection，先检查 index_with_report 的 failed_files，再用标注问题对照 grep 并回读原文。若只有少量固定文件、模型不允许处理内容或完整性报告存在失败，直接文本搜索更合适；空结果不证明原文不存在。多来源、重排或监听的额外收益应分别测量，不把更多功能当质量证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/memsearch/core.py:112-130](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L112-L130)

逐文件报告失败。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/memsearch/index_report.py:19-30](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/index_report.py#L19-L30)

完整性报告状态。

<details>
<summary>查看原文（12行）</summary>

```text
@dataclass(frozen=True)
class IndexReport:
    """Structured result for a completed indexing pass."""

    indexed_chunks: int
    total_files: int
    indexed_files: int
    failed_files: tuple[IndexFailure, ...] = ()

    @property
    def status(self) -> str:
        return "degraded" if self.failed_files else "ok"
```

</details>

**依据 3 · 源码核查**：[src/memsearch/store.py:245-250](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/store.py#L245-L250)

混合搜索。

```text
        *,
        query_text: str = "",
        top_k: int = 10,
        filter_expr: str = "",
    ) -> list[dict[str, Any]]:
        """Hybrid search: dense vector + BM25 full-text with RRF reranking."""
```

**依据 4 · 源码核查**：[src/memsearch/core.py:222-245](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L222-L245)

返回来源等元数据。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

#### 缺口

- 没有真实知识库的效果对照
  **影响**：无法证明增益超过维护和误召回成本
  **进一步探讨**：用固定问题和人工标准比较检索质量、回读时间与支出。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何降低更新失败期间的检索缺口？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有可重建 Markdown 原件、逐文件失败报告、按源清理与 ID 去重；单纯增加重试或错误日志不是新增机制。未验证方案是在隔离索引代中先完成新块 embedding 和写入，确认整份来源成功后再以版本标记切换可见集合、延迟清理旧块。必须验证后端的一致性和旧版本不可与新版本混读；若切换不是原子或并发查询仍有空洞，应如实保留不确定状态。模拟模型超时、半批写入、切换失败和查询并发，与现有机制比较缺口时长、陈旧结果、重复存储及账单；若缺口不减少或成本过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/memsearch/core.py:123-140](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L123-L140)

已有失败记录和范围清理。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/memsearch/core.py:178-200](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L178-L200)

现有删除先于写入。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/memsearch/core.py:202-214](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/core.py#L202-L214)

现有分批嵌入和 upsert。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 4 · 源码核查**：[src/memsearch/index_report.py:19-30](https://github.com/zilliztech/memsearch/blob/65d8b220d4265f70441785aa22203f0e85ea3ec6/src/memsearch/index_report.py#L19-L30)

现有 degraded 反馈。

<details>
<summary>查看原文（12行）</summary>

```text
@dataclass(frozen=True)
class IndexReport:
    """Structured result for a completed indexing pass."""

    indexed_chunks: int
    total_files: int
    indexed_files: int
    failed_files: tuple[IndexFailure, ...] = ()

    @property
    def status(self) -> str:
        return "degraded" if self.failed_files else "ok"
```

</details>

#### 缺口

- 未实现版本索引或核实 Milvus 原子切换能力
  **影响**：不能承诺无空洞、无重复或低成本
  **进一步探讨**：隔离后端故障注入并测可见性、陈旧时间和重建费用。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
