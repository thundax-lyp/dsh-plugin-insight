# memsearch

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[a81ac68](https://github.com/zilliztech/memsearch/tree/a81ac682b547f86df25cd70a9477ada543de67ae)

<!-- BEGIN META -->
[![GitHub ★ 2,856](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C856&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zilliztech/memsearch)
<!-- END META -->

> **功能**：为 Markdown 文件提供语义与关键词混合检索，支持增量索引、实时监视及多种嵌入后端。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 把可编辑 Markdown 与可重建的混合索引分开，提供可回查的语义候选。

> **主要限制**：[Q03](#research-q03) 旧块在新增嵌入完成前删除，批次或文件失败会使当前索引不完整，调用者必须读取报告并重试。

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
  - [Q01 · 改写检索针对什么任务？](#detail-section-11)
  - [Q02 · 文件变化如何进入检索？](#detail-section-12)
  - [Q03 · 嵌入失败会怎样影响旧索引？](#detail-section-13)
  - [Q04 · 怎样控制试用成本与退出？](#detail-section-14)
  - [Q05 · 代际发布能否减少失败后的缺块？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护 Markdown 项目笔记的开发者，可用改写查询找回候选段落，再对原文核实。

文件名与关键词搜索可直接查精确术语，语义改写场景需要更多人工试词。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 增量索引 | 更新 Markdown 的语义缓存 | 依赖嵌入和数据库，需检查文件报告 |
| 混合检索 | 查找同义或精确术语片段 | 核对原文件，质量未实测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python 和 Milvus | 必需 | 运行根库与索引 | 先核对环境再建隔离集合 |
| 可访问嵌入后端 | 必需 | 索引与查询 | 失败时检查索引报告 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户复制资料并创建独立集合 | 保留可读原文件 |
| 查询 | 用户建索引并检查报告，使用标注题 | 答案及来源匹配 |
| 恢复 | 用户对失败项重试并核对块集合 | 无法恢复时使用文本搜索 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 数据库与模型资源 | 配置、标注和索引 | 金额与耗时未知 |
| 持续 | 查询嵌入和存储 | 检查出处与更新报告 | 合格查询成本未知 |
| 失败 | 重新嵌入与存储 | 重试并检查缺块 | 恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 改写召回 | 有混合召回实现 | 质量与关键词检索差异 |
| 资料保留 | Markdown 仍是独立原件 | 索引故障下的可用性 |

> **思考**：[Q03](#research-q03) 旧块在新增嵌入完成前删除，批次或文件失败会使当前索引不完整，调用者必须读取报告并重试。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 把可编辑 Markdown 与可重建的混合索引分开，提供可回查的语义候选。

[Q02](#research-q02) 块身份含内容与模型，文件级报告保留错误。[Q03](#research-q03) 清理限定在扫描根，调用者仍需处理非原子批次。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 旧块在新增嵌入完成前删除，批次或文件失败会使当前索引不完整，调用者必须读取报告并重试。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 对资料副本建独立集合，核对固定题集和原文。索引错误时先查报告并恢复，保留原文件查找入口。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查根 Python 库的索引、检索和失败报告源码。检索质量、运行负担和新代际方案待验证。

- 已检查：作者 README、包清单、源码路径 src/memsearch/core.py、src/memsearch/store.py、README.md、pyproject.toml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅根 Python 库与 CLI 范围，DSH 同仓适配未并入本项。未运行数据库、模型和目标代码。
- 下一步：在资料副本注入嵌入和存储失败，核对索引报告、块集合及同一标注题集的检索质量。

**分析版本**

- **仓库**：[zilliztech/memsearch](https://github.com/zilliztech/memsearch)
- **版本号**：未声明（[固定提交 a81ac68](https://github.com/zilliztech/memsearch/tree/a81ac682b547f86df25cd70a9477ada543de67ae)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可试验新代际完整写入后切换可见索引，以减少失败后的缺块窗口。

在资料副本注入嵌入和存储失败，核对索引报告、块集合及同一标注题集的检索质量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 127 | 15857 | — | — | 97578 |
| .js | source | 4 | 3281 | 2704 | 462 | — |
| .js | test | 8 | 2212 | 2028 | 88 | — |
| .mjs | example | 1 | 38 | 35 | 2 | — |
| .ts | test | 5 | 1512 | 1427 | 11 | — |
| .ts | source | 9 | 1832 | 1538 | 179 | — |
| .mjs | source | 1 | 179 | 170 | 9 | — |
| .md | example | 1 | 29 | — | — | 246 |

</details>

**活跃度**

[![Issue 未关闭 41](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=41&color=737b86&logo=github)](https://github.com/zilliztech/memsearch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=19&color=737b86&logo=github)](https://github.com/zilliztech/memsearch/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=28&color=737b86&logo=github)](https://github.com/zilliztech/memsearch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护 Markdown 知识库的开发者能否在改写和索引失败后，仍找到可回查的资料？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 改写检索针对什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护多份项目笔记的开发者，在记不清原用词时，可把自然语言查询映射到原 Markdown 段落。相对精确文本查找，新增语义候选和 BM25 的组合，合格结果还需回到原文件核对版本、上下文和答案。根组件是 Python 库与 CLI，仓库内 DSH 适配有独立组件身份。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:45-46](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/README.md#L45-L46)

作者把 Markdown 作为真相和索引作为缓存。

```text
- 📄 **Markdown is the source of truth** — inspired by [OpenClaw](https://github.com/openclaw/openclaw). Your memories are just `.md` files — human-readable, editable, version-controllable. Milvus is a "shadow index": a derived, rebuildable cache
- 🔍 **Progressive retrieval, hybrid search, smart dedup, live sync** — 3-layer recall (search → expand → transcript); dense vector + BM25 sparse + RRF reranking; SHA-256 content hashing skips unchanged content; file watcher auto-indexes in real time
```

**依据 2 · 源码核查**：[src/memsearch/store.py:242-259](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/src/memsearch/store.py#L242-L259)

搜索定义为混合召回且空集合返回空列表。

<details>
<summary>查看原文（18行）</summary>

```text
    def search(
        self,
        query_embedding: list[float],
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
```

</details>

#### 缺口

- 未取得真实资料库的查询集合。
  **影响**：不能证明召回质量超过关键词查找。
  **进一步探讨**：以同一资料库的同义改写和精确术语构建标注题集。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件变化如何进入检索？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

索引扫描逐文件处理，文件来源、行号、内容哈希和模型名共同确定块 ID；新旧集合的差异驱动删除与嵌入。查询文本经同一配置的 embedder 编码，Milvus 接受向量和原查询，dense 与 BM25 结果由 RRF 合并。可选 reranker 进一步筛选。它提供候选片段和来源，不能单独确保当前答案。

#### 证据与依据

**依据 1 · 源码核查**：[src/memsearch/core.py:168-200](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/src/memsearch/core.py#L168-L200)

块 ID 与去重。

<details>
<summary>查看原文（33行）</summary>

```text
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

**依据 2 · 源码核查**：[src/memsearch/core.py:206-214](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/src/memsearch/core.py#L206-L214)

逐批嵌入和写入。

```text
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

**依据 3 · 源码核查**：[src/memsearch/core.py:247-264](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/src/memsearch/core.py#L247-L264)

查询嵌入及可选重排。

<details>
<summary>查看原文（18行）</summary>

```text
        self._store._require_collection()
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

**依据 4 · 源码核查**：[src/memsearch/store.py:266-290](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/src/memsearch/store.py#L266-L290)

dense、BM25 和 RRF。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 嵌入失败会怎样影响旧索引？

**研究主题**：缺陷与关键质疑

#### 完整回答

源码先删该文件已过时的块，再请求新增块的 embedding，并逐批 upsert。若随后外部嵌入或存储失败，文件本身仍在，但索引可能只含部分新块，且旧块已移除。顶层报告会逐文件记录错误并继续，调用者需要检查报告而非只看成功插入数。删除文件的清理只限定本轮目录根；单文件更新不修剪其他来源。

#### 证据与依据

**依据 1 · 源码核查**：[src/memsearch/core.py:182-214](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/src/memsearch/core.py#L182-L214)

删除早于嵌入，批次分别提交。

<details>
<summary>查看原文（33行）</summary>

```text
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

**依据 2 · 源码核查**：[src/memsearch/core.py:120-148](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/src/memsearch/core.py#L120-L148)

文件级失败记录和目录内清理。

<details>
<summary>查看原文（29行）</summary>

```text
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
```

</details>

#### 缺口

- 未对嵌入或 Milvus 故障执行验证。
  **影响**：缺块持续多久、重试是否完整恢复未知。
  **进一步探讨**：注入第二批嵌入失败，检查报告与检索，再重试并对比块集合。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样控制试用成本与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

可在资料副本和独立集合试用，先选可允许读取这些文本的 embedding provider，再准备 Python 环境与 Milvus。索引和查询都会调用嵌入，采用云模型时要独立核查数据流与费用。模型维度与集合不符会报错，可另建集合而保留原件。出现缺块或结果无出处时停用该索引，回原 Markdown 与文本查找。

#### 证据与依据

**依据 1 · 源码核查**：[src/memsearch/core.py:82-96](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/src/memsearch/core.py#L82-L96)

provider 与 Milvus 配置。

<details>
<summary>查看原文（15行）</summary>

```text
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
        )
```

</details>

**依据 2 · 源码核查**：[src/memsearch/store.py:209-224](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/src/memsearch/store.py#L209-L224)

维度不匹配时要求重建或另建集合。

<details>
<summary>查看原文（16行）</summary>

```text
    def _check_dimension(self) -> None:
        """Verify that the existing collection's embedding dimension matches."""
        if self._dimension is None:
            return  # no dimension specified — skip check (read-only mode)
        info = self._connected_client().describe_collection(self._collection)
        for field in info.get("fields", []):
            if field.get("name") == "embedding":
                existing_dim = field.get("params", {}).get("dim")
                if existing_dim is not None and int(existing_dim) != self._dimension:
                    raise ValueError(
                        f"Embedding dimension mismatch: collection '{self._collection}' "
                        f"has dim={existing_dim} but the current embedding provider "
                        f"outputs dim={self._dimension}. "
                        f"Run 'memsearch reset --yes' to drop the collection and re-index, "
                        f"or use a different --milvus-uri / --collection."
                    )
```

</details>

**依据 3 · 源码核查**：[pyproject.toml:9-25](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/pyproject.toml#L9-L25)

Python 环境及依赖声明。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

#### 缺口

- 单位合格查询的费用与延迟未测。
  **影响**：无法比较维护成本与查找收益。
  **进一步探讨**：记录同一标注题集的 embedding 用量、端到端耗时和人工核对时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 代际发布能否减少失败后的缺块？

**研究主题**：新假设与验证

#### 完整回答

假设先写新一代块集并确认完整，再切换文件的可见代际，最后回收旧块，可缩小嵌入失败的检索空窗。现有顺序给出推导依据。对同一文件的三批修改在删除、嵌入和写入处分别失败，比较查询缺失、恢复时间和额外存储。如果代际发布仍不能定位完整边界，或查询成本显著高于原文件查找，方案不足以采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/memsearch/core.py:182-214](https://github.com/zilliztech/memsearch/blob/a81ac682b547f86df25cd70a9477ada543de67ae/src/memsearch/core.py#L182-L214)

当前删旧后逐批写新的顺序。

<details>
<summary>查看原文（33行）</summary>

```text
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

- 代际指针和读取规则尚未实现。
  **影响**：缺块改善及存储成本未知。
  **进一步探讨**：对比原流程与隔离原型，按同一批次故障点测量。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
