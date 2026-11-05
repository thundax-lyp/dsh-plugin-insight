# dsh-knowledge

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[2f9261b](https://github.com/Soren-ABT/dsh-knowledge/tree/2f9261b40d98924cd4f8f8d2735fcd21006a67ef)

<!-- BEGIN META -->
[![GitHub ★ 91](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=91&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Soren-ABT/dsh-knowledge) [![npm 30d 2,848](https://img.shields.io/static/v1?label=npm+30d&message=2%2C848&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-knowledge) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-knowledge)
<!-- END META -->

> **功能**：为 DSH 提供文档知识库、混合检索、引用及可续读证据。

> **亮点**：[Q01](#research-q01) 搜索在词法和向量候选前实施范围过滤，再以带修订的证据读取保持引用定位。

> **主要限制**：[Q02](#research-q02) 未配置库选择意味着全部库，功能范围依赖宿主身份；省略修订会读取当前版本。[Q03](#research-q03) 备份还必须包含独立处理产物。

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
  - [Q01 · 怎样把文档变成可续读证据？](#detail-section-11)
  - [Q02 · 库范围和解析是否等于隐私隔离？](#detail-section-12)
  - [Q03 · 怎样在隔离资料集试用？](#detail-section-13)
  - [Q04 · 已有修订拒绝机制后，还有什么值得验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在项目中反复引用多份资料，需要查找并核对原文的用户。

逐文件查找或将全部文档粘贴到提示词。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 知识检索 | 查找并引用资料 | 需正确解析索引 |
| 证据续读 | 按修订及块读取 | 需验证旧游标拒绝 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH、Node和pnpm | 必需 | 宿主与安装构建 | 暂停装载 |
| 解析与embedding路径 | 按格式与模式 | 生成索引和证据 | 改用已核对路径 |
| 元数据、SQLite、raw和artifacts | 恢复需要 | 同时保留文档与修订证据 | 暂停写入后备份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 测试profile配置两篇合成资料 | 记录答案和启用库 |
| 处理 | 导入并查看解析与索引状态 | 核对降级错误 |
| 取证 | 排除文档并带revision续读 | 逐句比原文 |
| 恢复 | 暂停写入后复制四类数据 | 独立home读回附件和修订 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型下载、存储和远端费用未知 | 准备许可、答案集和四类备份 | 未实测 |
| 持续使用 | embedding、OCR和重建开销未知 | 检查降级与文档修订 | 按所选路径 |
| 失败恢复 | 副本磁盘和重处理费用未知 | 停写后协调四类数据并演练 | 恢复一致性未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 范围检索 | 源码在候选截断前过滤 | 实际召回质量 |
| 修订续读 | 旧修订拒绝并校验产物归属和哈希 | 模型是否保留revision |
| 中断恢复 | 嵌入前保存rawText与incomplete | 新进程恢复成功率 |

> **思考**：[Q02](#research-q02) 未配置库选择意味着全部库，功能范围依赖宿主身份；省略修订会读取当前版本。[Q03](#research-q03) 备份还必须包含独立处理产物。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 搜索在词法和向量候选前实施范围过滤，再以带修订的证据读取保持引用定位。

[Q01](#research-q01) 词法与向量均先过滤后截断。[Q02](#research-q02) 产物有修订归属与哈希检查。[Q03](#research-q03) pending发布和incomplete记录改善中断可恢复性，但跨数据存储恢复需实测。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 未配置库选择意味着全部库，功能范围依赖宿主身份；省略修订会读取当前版本。[Q03](#research-q03) 备份还必须包含独立处理产物。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用两篇资料核对范围、降级与更新后续读，再验证四类数据备份。若旧引用错读或备份不能恢复附件，停止真实导入并回原文件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

检索与续读接线已静态核对，效果和恢复未实测，假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/knowledge/artifacts.ts、src/knowledge/chunkdb.ts、src/knowledge/document-processing.ts、src/knowledge/index.ts、src/knowledge/store.ts、src/tool-knowledge/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本模型工具与文档处理代表路径，未执行。
- 下一步：对照答案、修订变更、启用范围和完整恢复。

**分析版本**

- **仓库**：[Soren-ABT/dsh-knowledge](https://github.com/Soren-ABT/dsh-knowledge)
- **版本号**：0.5.2（[固定提交 2f9261b](https://github.com/Soren-ABT/dsh-knowledge/tree/2f9261b40d98924cd4f8f8d2735fcd21006a67ef)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 旧修订已被拒绝，新的可用性假设仅针对调用方省略修订的实证情形。

对照答案、修订变更、启用范围和完整恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 68 | 6099 | — | — | 66885 |
| .mjs | source | 17 | 2556 | 2144 | 253 | — |
| .mts | source | 1 | 337 | 261 | 54 | — |
| .ts | source | 64 | 22544 | 18385 | 2845 | — |
| .tsx | source | 11 | 6036 | 5333 | 426 | — |
| .ts | test | 51 | 12355 | 10883 | 619 | — |
| .mjs | example | 1 | 14 | 13 | 1 | — |
| .mjs | test | 1 | 187 | 171 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Soren-ABT/dsh-knowledge/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：资料如何成为可续读证据，采用要核查哪些条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 怎样把文档变成可续读证据？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要反复引用本地资料的 DSH 用户，可搜索启用知识库并继续读取证据片段。工具将 query、范围、排除项和 topK 传给 knowledge.search，再为命中生成引用；read_evidence 接受修订号、块与偏移。相比全文塞入提示词，这使模型能先找候选再有界续读。静态接线支持这种流程，不能据此认定答案引用准确。

服务层保留相同的 baseIds 和文档过滤进入每次子查询。空启用列表的语义须区分：未配置选择时是所有库，已保存选择全部失效时是空数组，searchSingle 对后者直接返回空结果。SQLite 词法路径把库和文档限制放在 WHERE 并先于 LIMIT；向量路径按库遍历缓存，先排除文档再评分和截断。因此排除文档不会占满候选名额。查询向量不可用时，本地模型配置问题直接报错，部分远端失败则可降为词法并记录日志。这个降级能保持返回结果，却改变语义召回能力，需用具体资料验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool-knowledge/index.ts:467-496](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/tool-knowledge/index.ts#L467-L496)

搜索参数和引用输出

<details>
<summary>查看原文（30行）</summary>

```text
    async execute(args) {
      if (args.query.trim().length === 0) throw new Error('search query is required')
      if (args.query.length > 2000) throw new Error('search query must not exceed 2000 characters')
      if (args.updatedAfter !== undefined && args.updatedBefore !== undefined && args.updatedAfter > args.updatedBefore) {
        throw new Error('updatedAfter must be less than or equal to updatedBefore')
      }
      const scope = knowledge.enabledScope()
      if (args.baseId !== undefined) requireBaseEnabled(args.baseId)
      const filter: Record<string, unknown> = {}
      if (args.docIds !== undefined) filter.docIds = args.docIds
      if (args.excludeDocIds !== undefined) filter.excludeDocIds = args.excludeDocIds
      if (args.titleIncludes !== undefined && args.titleIncludes.trim() !== '') filter.titleIncludes = args.titleIncludes
      if (args.titleExcludes !== undefined) filter.titleExcludes = args.titleExcludes
      if (args.sourceTypes !== undefined) filter.sourceTypes = args.sourceTypes
      if (args.updatedAfter !== undefined) filter.updatedAfter = args.updatedAfter
      if (args.updatedBefore !== undefined) filter.updatedBefore = args.updatedBefore
      const value = await knowledge.search({
        query: args.query,
        ...(args.extraQueries !== undefined && args.extraQueries.length > 0
          ? { queries: args.extraQueries.filter((variant: unknown): variant is string => typeof variant === 'string') }
          : {}),
        ...(args.baseId !== undefined ? { baseId: args.baseId } : {}),
        ...(args.baseId === undefined && scope !== undefined ? { baseIds: scope } : {}),
        ...(args.topK !== undefined ? { topK: args.topK } : {}),
        ...(args.mode !== undefined ? { mode: args.mode } : {}),
        ...(Object.keys(filter).length > 0 ? { filter } : {}),
      })
      // Traceable citations: quote blocks + source line, one per top hit —
      // the model can quote them verbatim so answers stay grounded.
      return toolOutput({ ...value, citations: value.hits.map(hit => citationOf(hit)) })
```

</details>

**依据 2 · 源码核查**：[src/tool-knowledge/index.ts:973-986](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/tool-knowledge/index.ts#L973-L986)

修订号与续读参数

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args) {
      requireDocumentEnabled(args.documentId)
      assertToolRange('pageIndex', args.pageIndex, 0, Number.MAX_SAFE_INTEGER)
      assertToolRange('blockOffset', args.blockOffset, 0, Number.MAX_SAFE_INTEGER)
      assertToolRange('maxTokens', args.maxTokens, 128, 4096)
      if (args.blockId !== undefined && args.blockId.trim().length === 0) throw new Error('blockId must not be empty')
      if (args.blockOffset !== undefined && args.blockId === undefined) throw new Error('blockOffset requires blockId')
      return toolOutput(await knowledge.readDocumentEvidence(args.documentId, {
        ...(args.revision !== undefined ? { revision: args.revision } : {}),
        ...(args.pageIndex !== undefined ? { pageIndex: args.pageIndex } : {}),
        ...(args.blockId !== undefined ? { blockId: args.blockId } : {}),
        ...(args.blockOffset !== undefined ? { blockOffset: args.blockOffset } : {}),
        ...(args.maxTokens !== undefined ? { maxTokens: args.maxTokens } : {}),
      }))
```

</details>

**依据 3 · 源码核查**：[src/knowledge/index.ts:3374-3408](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/index.ts#L3374-L3408)

服务对空或已删库失效关闭，并组织scope

<details>
<summary>查看原文（35行）</summary>

```text
    throwIfDeadline(deadlineAt)
    const store = this.requireStore()
    const config = this.getConfigFor(request.baseId)
    const query = request.query.trim()
    if (query.length === 0) return emptySearchResult(query, request.mode ?? config.searchMode, 0)
    const requestedMode = request.mode ?? config.searchMode
    const topK = clampInt(request.topK ?? config.topK, 1, 50, 6)
    if (request.baseId === undefined && request.baseIds !== undefined && request.baseIds.length === 0) {
      return emptySearchResult(query, requestedMode, Date.now() - startedAt)
    }
    // A stale base id (e.g. a base deleted without sweeping child records)
    // must not surface orphaned content.
    if (request.baseId !== undefined && store.getBase(request.baseId) === undefined) {
      return emptySearchResult(query, requestedMode, 0)
    }

    const threshold = request.threshold ?? config.similarityThreshold

    // Both retrieval paths apply the same document selection before their
    // candidate limits, so excluded rows cannot consume retrieval seats.
    const documentFilter = this.resolveSearchFilter(request)
    // A present-but-empty allow-list is an explicit "match nothing" result.
    // Never pass it to a storage implementation that might interpret [] as
    // unrestricted scope.
    if (documentFilter?.docIds !== undefined && documentFilter.docIds.length === 0) {
      return emptySearchResult(query, requestedMode, Date.now() - startedAt)
    }

    const lane = store.retrievalLane
    if (lane !== undefined) {
      const scope = request.baseId !== undefined
        ? [request.baseId]
        : request.baseIds !== undefined && request.baseIds.length > 0
          ? [...request.baseIds]
          : store.listBases().map(base => base.id)
```

</details>

**依据 4 · 源码核查**：[src/knowledge/index.ts:3452-3483](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/index.ts#L3452-L3483)

向量和词法共享scope及文档过滤

<details>
<summary>查看原文（32行）</summary>

```text
      let vec: Awaited<ReturnType<typeof lane.vector>> | undefined
      if (useVector) {
        vectorAttempted = true
        try {
          vec = await lane.vector(queryVector!, scope, poolSize, documentFilter, deadlineAt)
          vectorSucceeded = true
          vectorReturned = vec.hits.length
          total = Math.max(total, vec.total)
          for (const hit of vec.hits) byId.set(hit.id, hit)
        } catch (error) {
          vectorError = retrievalErrorCode(error)
          this.ctx.logger.warn(`knowledge: vector retrieval failed, using lexical retrieval: ${safeErrorMessage(error)}`)
        }
      } else if (requestedMode !== 'lexical' && config.embeddingProvider !== 'none' && queryVector === undefined) {
        vectorError = 'embedding_unavailable'
      }

      // Hybrid/auto always execute lexical when vector worked, even when the
      // vector lane returned zero rows: a successful empty lane is distinct
      // from a failed lane in the public contract.
      let lex: Awaited<ReturnType<typeof lane.lexical>> | undefined
      if (requestedMode !== 'vector' || vec === undefined) {
        lexicalAttempted = true
        try {
          lex = await lane.lexical(query, scope, poolSize, documentFilter, deadlineAt)
          lexicalSucceeded = true
          lexicalReturned = lex.hits.length
          total = Math.max(total, lex.total)
          for (const hit of lex.hits) if (!byId.has(hit.id)) byId.set(hit.id, hit)
        } catch (error) {
          lexicalError = retrievalErrorCode(error)
          this.ctx.logger.warn(`knowledge: lexical retrieval failed: ${safeErrorMessage(error)}`)
```

</details>

**依据 5 · 源码核查**：[src/knowledge/chunkdb.ts:975-1008](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/chunkdb.ts#L975-L1008)

SQL范围先于LIMIT

<details>
<summary>查看原文（34行）</summary>

```text
  private async lexicalUnchecked(query: string, baseIds: readonly string[], limit: number, filter?: RetrievalDocumentFilter, deadlineAt?: number): Promise<LaneResult> {
    throwIfDeadlineExpired(deadlineAt)
    const scope = [...baseIds]
    if (scope.length === 0) return { total: 0, hits: [] }
    if (filter?.docIds !== undefined && filter.docIds.length === 0) return { total: 0, hits: [] }
    // An empty query must never scan the whole corpus (LIKE '%%' matches
    // everything) — the service layer guards too, but the lane stands alone.
    if (query.trim().length === 0) return { total: 0, hits: [] }
    const docFilter = docFilterSql(filter, 'c.doc_id')
    const placeholders = scope.map(() => '?').join(',')
    const deadlineSql = deadlineAt !== undefined ? ' AND knowledge_before_deadline(?, c.chunk_id)' : ''
    const scopeSql = `c.base_id IN (${placeholders})${docFilter?.sql ?? ''}${deadlineSql}`
    const params: Array<string | number> = [...scope, ...(docFilter?.params ?? []), ...(deadlineAt !== undefined ? [deadlineAt] : [])]
    const total = (this.db.prepare(`SELECT COUNT(*) AS c FROM chunk c WHERE ${scopeSql}`).get(...params) as { c: number }).c
    if (total === 0) return { total: 0, hits: [] }

    const shortTerms = extractShortTerms(query)
    const likeFilters = shortTerms.map(() => `(c.search_text LIKE ? ESCAPE '\\')`).join(' AND ')
    if (needsLikeFallback(query)) {
      // Cherry's bm25LikeSearch: nothing trigram-indexable (e.g. a bare
      // two-character CJK term) — a pure LIKE scan with one AND-ed filter per
      // token (a single whole-query pattern would demand a verbatim contiguous
      // substring), ordered by text length (dense chunks first) with a
      // length-based score as the relevance proxy.
      const tokens = extractFtsTokens(query)
      if (tokens.length === 0) return { total, hits: [] }
      const filters = tokens
        .map(() => `(c.search_text LIKE ? ESCAPE '\\' OR c.context LIKE ? ESCAPE '\\')`)
        .join(' AND ')
      const sql = `
        SELECT ${ChunkDatabase.SELECT_COLUMNS}, search_text FROM chunk c
        WHERE ${scopeSql} AND ${filters}
        ORDER BY length(c.search_text) ASC, c.chunk_id ASC
        LIMIT ?
```

</details>

**依据 6 · 源码核查**：[src/knowledge/chunkdb.ts:1051-1072](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/chunkdb.ts#L1051-L1072)

向量先按范围及文档筛选

<details>
<summary>查看原文（22行）</summary>

```text
  async vector(embedding: readonly number[], baseIds: readonly string[], limit: number, filter?: RetrievalDocumentFilter, deadlineAt?: number): Promise<LaneResult> {
    throwIfDeadlineExpired(deadlineAt)
    const scope = [...baseIds]
    if (scope.length === 0) return { total: 0, hits: [] }
    if (filter?.docIds !== undefined && filter.docIds.length === 0) return { total: 0, hits: [] }
    const query = embedding.length > 0 ? Float32Array.from(embedding) : null
    const allowed = filter?.docIds !== undefined ? new Set(filter.docIds) : undefined
    const excluded = new Set(filter?.excludeDocIds)
    const scored: LaneHit[] = []
    let total = 0
    let scanned = 0
    for (const baseId of scope) {
      for (const entry of this.ensureVectorCache(baseId)) {
        if ((scanned++ & 255) === 0) throwIfDeadlineExpired(deadlineAt)
        if ((allowed !== undefined && !allowed.has(entry.docId)) || excluded.has(entry.docId)) continue
        total += 1
        if (query === null || entry.vector.length !== query.length) continue
        scored.push({ ...rowToChunk(entry.row), score: cosineFloat32(query, entry.vector) })
      }
    }
    scored.sort((a, b) => b.score - a.score)
    return { total, hits: scored.slice(0, limit) }
```

</details>

#### 缺口

- 没有同任务的检索准确率对照
  **影响**：无法估算漏检或证据选择质量
  **进一步探讨**：用有原文答案和排除文档的合成资料集核对

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 库范围和解析是否等于隐私隔离？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

工具以 enabledScope 限制所选 base，并在读取文档前检查启用状态，属于宿主内功能范围。未检查宿主认证，不能将它当多用户隔离。PDF 可走配置的 MinerU 本地或云端，失败后某些分支退回内置解析并警告；job_lost 或 submission_unknown 则继续报错。模型、OCR 与云服务决定资料外发及质量，需按所启路径确认。

读取证据不是仅传递一个可选参数。readDocumentEvidence 首先取当前文档，文档不存在报 NotFound；传入的 revision 与当前 processing.revision 不同，明确要求重新搜索；没有处理结果时返回空证据。已有处理结果则按该文档和当前修订加载 artifacts，加载时检验 artifactId、manifest 的库、文档、修订、documentHash 与 sourceHash。附件又限定安全图片类型并校验长度与哈希。省略 revision 会读当前版本，因此续读调用者应保留先前返回的修订号；这属于可追溯续读约束，不是历史版本任意读取。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool-knowledge/index.ts:304-317](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/tool-knowledge/index.ts#L304-L317)

启用范围检查

<details>
<summary>查看原文（14行）</summary>

```text
  const scopedBases = () => knowledge.enabledBases()
  const requireBaseEnabled = (baseId: string): void => {
    const scope = knowledge.enabledScope()
    if (scope !== undefined && !scope.includes(baseId)) {
      throw new Error(`knowledge base "${baseId}" is not enabled`)
    }
  }
  const requireDocumentEnabled = (documentId: string) => {
    const document = knowledge.getDocument(documentId, { includeChunks: false })
    requireBaseEnabled(document.baseId)
    return document
  }

  // Search guidance lives in the tool description. This optional section only
```

</details>

**依据 2 · 源码核查**：[src/knowledge/document-processing.ts:94-128](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/document-processing.ts#L94-L128)

解析路由及不同错误分支

<details>
<summary>查看原文（35行）</summary>

```text
  try {
    let output: ProcessingOutput | undefined
    let remoteFailure: unknown
    const pdf = extensionOf(input.fileName) === 'pdf'
    if (pdf && config.documentProcessorProvider === 'mineru-local') {
      try {
        output = await extractWithMineruLocal(bytes, input.fileName, {
          apiUrl: config.mineruLocalUrl ?? 'http://127.0.0.1:8000',
          apiKey: config.mineruLocalApiKey,
          tier: config.mineruTier ?? 'basic',
          timeoutMs: config.documentProcessingTimeoutMs ?? 1_800_000,
        }, {
          signal: input.signal, onProgress: progress,
          ...(matching?.state === 'running' && matching.progress.jobId !== undefined ? { resumeJobId: matching.progress.jobId } : {}),
        })
      } catch (error) {
        input.signal?.throwIfAborted()
        if (['job_lost', 'submission_unknown'].includes(processorErrorCode(error))) throw error
        remoteFailure = error
      }
    } else if (pdf && config.documentProcessorProvider === 'mineru') {
      if (config.mineruApiKey.trim() === '') {
        remoteFailure = Object.assign(new Error('MinerU cloud requires a key'), { code: 'configuration_missing' })
      } else {
        try {
          progress({ stage: 'parsing' })
          const text = await extractPdfWithMineru(bytes, input.fileName, { apiHost: config.mineruApiHost, apiKey: config.mineruApiKey }, input.signal)
          output = parsedTextDocument(text, bytes, 'mineru', fingerprint)
        } catch (error) { input.signal?.throwIfAborted(); remoteFailure = error }
      }
    }
    if (output === undefined) {
      if (remoteFailure !== undefined) warnings.push({ code: 'processor_fallback', message: `${processorErrorMessage(remoteFailure)}; used built-in local parsing` })
      progress({ stage: 'parsing' })
      try {
```

</details>

**依据 3 · 源码核查**：[src/knowledge/index.ts:714-738](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/index.ts#L714-L738)

未配置与失效选择的scope区别

<details>
<summary>查看原文（25行）</summary>

```text
  async setEnabledBaseIds(ids: readonly string[]): Promise<void> {
    await this.requireStore().setEnabledBaseIds([...new Set(ids)])
  }

  /**
   * Resolve the effective search scope for a model call. `undefined` means no
   * ids were configured (every base); an empty array means a non-empty saved
   * selection has gone entirely stale and must fail closed.
   */
  enabledScope(): string[] | undefined {
    const store = this.requireStore()
    const ids = store.getEnabledBaseIds()
    if (ids.length === 0) return undefined
    const existing = new Set(store.listBases().map(base => base.id))
    const valid = ids.filter(id => existing.has(id))
    return valid
  }

  /** Existing bases inside the strict model-invocation scope. */
  enabledBases(): BaseSummary[] {
    const bases = this.listBases()
    const scope = this.enabledScope()
    if (scope === undefined) return bases
    const allowed = new Set(scope)
    return bases.filter(base => allowed.has(base.id))
```

</details>

**依据 4 · 源码核查**：[src/knowledge/index.ts:2861-2875](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/index.ts#L2861-L2875)

当前修订比较及资产检查

<details>
<summary>查看原文（15行）</summary>

```text
  async readDocumentEvidence(id: string, options: { revision?: string; pageIndex?: number; blockId?: string; blockOffset?: number; maxTokens?: number } = {}): Promise<DocumentEvidence> {
    const doc = this.requireStore().getDocument(id)
    if (doc === undefined) throw new NotFoundError('document not found')
    if (options.revision !== undefined && doc.processing?.revision !== options.revision) throw new NotFoundError('evidence revision is no longer current; search again')
    if (doc.processing === undefined) return { documentId: id, title: doc.title, blocks: [], assets: [], estimatedTokens: 0, truncated: false }
    const parsed = await this.artifacts.load(doc.baseId, id, doc.processing)
    return composeDocumentEvidence(doc, parsed, options)
  }

  async getEvidenceAsset(id: string, assetId: string, revision: string) {
    const doc = this.requireStore().getDocument(id)
    if (doc?.processing === undefined || doc.processing.revision !== revision) throw new NotFoundError('evidence revision is no longer current; refresh the document')
    const asset = await this.artifacts.readAsset(doc.baseId, id, doc.processing, assetId)
    if (asset === undefined) throw new NotFoundError('evidence asset not found')
    return { ...asset, fileName: assetId }
```

</details>

**依据 5 · 源码核查**：[src/knowledge/artifacts.ts:121-150](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/artifacts.ts#L121-L150)

产物归属、哈希和附件类型校验

<details>
<summary>查看原文（30行）</summary>

```text
  async load(baseId: string, documentId: string, info: DocumentProcessingInfo): Promise<ParsedDocument> {
    const key = this.key(baseId, documentId, info.revision)
    if (info.artifactId !== key) throw new Error('artifact does not belong to document')
    if (this.root === undefined) {
      const value = this.memory.get(key)
      if (value === undefined) throw new Error('processing artifact is missing; reparse the source')
      return structuredClone(value.output.document)
    }
    const dir = this.path(key)
    const manifest = JSON.parse((await this.boundedRead(join(dir, 'manifest.json'), 1024 * 1024)).toString()) as Manifest
    if (manifest.version !== 1 || manifest.baseId !== baseId || manifest.documentId !== documentId || manifest.info.revision !== info.revision) throw new Error('invalid artifact manifest')
    const bytes = await this.boundedRead(join(dir, 'document.json'), MAX_MANIFEST_BYTES)
    if (digest(bytes) !== manifest.documentHash) throw new Error('artifact checksum mismatch')
    const parsed = JSON.parse(bytes.toString()) as ParsedDocument
    if (parsed.schemaVersion !== 1 || parsed.sourceHash !== info.sourceHash || !Array.isArray(parsed.blocks) || typeof parsed.text !== 'string') throw new Error('invalid parsed document')
    return parsed
  }

  async readAsset(baseId: string, documentId: string, info: DocumentProcessingInfo, assetId: string): Promise<{ bytes: Uint8Array; mimeType: string } | undefined> {
    component(assetId)
    const parsed = await this.load(baseId, documentId, info)
    const asset = parsed.assets.find(value => value.id === assetId)
    if (asset === undefined) return undefined
    // Active content (SVG/HTML) must never execute in the app's origin.
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(asset.mimeType)) throw new Error('unsupported evidence asset type')
    const key = this.key(baseId, documentId, info.revision)
    const bytes = this.root === undefined
      ? this.memory.get(key)?.output.assets.find(value => value.id === assetId)?.bytes
      : await this.boundedRead(join(this.path(key), `${assetId}.blob`), MAX_ASSET_BYTES)
    if (bytes === undefined || bytes.byteLength !== asset.byteLength || digest(bytes) !== asset.sha256) throw new Error('artifact asset checksum mismatch')
```

</details>

#### 缺口

- 实际宿主身份认证与配置的外部处理服务未验收
  **影响**：启用范围不能证明跨用户隔离，敏感资料的接收方仍需核实
  **进一步探讨**：在隔离部署记录非敏感PDF的实际目的地及不同用户调用结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样在隔离资料集试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

按固定 README 核对 Node、pnpm 与构建许可，在测试 profile 导入两篇合成资料，检查词法及向量命中、排除、原文更新后重建和带修订续读。后台 embedding、OCR、MinerU 和图像描述是否收费取决于所选本地或远端路径，现金、磁盘和耗时均未知。

存储分成四类。元数据位于 storageDomain，分块位于 SQLite，原始字节由 RawFileStorage 保存到同目录的 knowledge-raw，处理后的文档、图片及可选 upstream.zip 保存在 knowledge-artifacts。原始字节写入与处理产物是不同路径，后者先写 pending 目录、manifest最后写，随后 rename 成不可变修订。嵌入前先持久化 rawText、incomplete 与文档信息，使中断能恢复。备份仅含 SQLite 或 README提到的前三类不足以直接保留已处理证据，需同时复制 knowledge-artifacts 并核对修订。退出先停止导入，再禁用入口，保留需要的四类数据；是否可在新进程完整恢复需独立演练。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-55](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/README.md#L41-L55)

依赖和构建许可

<details>
<summary>查看原文（15行）</summary>

````text
### 1. 准备环境

- Node.js：`^22.19.0 || >=24.0.0`
- pnpm：`>=10`
- 已安装并初始化 DeepSeek Harness

在安装插件之前，将以下构建许可**合并到**目标 profile 的 `pnpm-workspace.yaml` 中已有的 `allowBuilds` 映射。不要重复添加第二个 `allowBuilds:` 键，否则 YAML 会失效。这些依赖包含安装期构建；pnpm 10 默认拒绝执行时，`dsh plugin add` 会在登记 bundle 前退出。

```yaml
allowBuilds:
  esbuild: true
  onnxruntime-node: true
  protobufjs: true
  sharp: true
  tesseract.js: false
````

</details>

**依据 2 · 作者声明**：[README.md:267-276](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/README.md#L267-L276)

存储、迁移和完整备份

<details>
<summary>查看原文（10行）</summary>

```text
### 存储与索引

- 知识库、文档和运行时配置通过 DSH `storageDomain` 持久化。
- 分块保存在独立 SQLite 文件 `<DSH_HOME>/storages/knowledge-chunks.sqlite`，可通过 `chunkStorePath` 调整。
- 词法检索使用 SQLite FTS5 trigram 索引；向量使用 Float32Array 常驻缓存并精确失效。
- 旧 JSON 分块数据在首次启动时执行幂等迁移；没有存储后端时自动退化为内存模式。
- 修改分块或 embedding 配置后，可以重建单条资料或整个知识库的索引。
- 元数据写入（知识库、文档和全局配置）共用一条写入链；`EPERM`、`EBUSY`、`EACCES` 按 20/50/100/200/400 ms 有界重试，最多写入 6 次。持续 I/O 错误会明确报错并保留之前的元数据。
- 启动成功加载后，自愈写入失败会警告并跳过其余清理，保留可读取的持久库；后台恢复逐条处理失败，恢复状态写入失败也不会产生未处理的拒绝或中止宿主（#55）。无需格式迁移或禁用 `resumeInterruptedOnStartup`；宿主通用 `rename` 问题仍需上游修复。
- `knowledge.json` 包含库名、文档记录和配置，不是可随意删除的缓存；仅备份 SQLite 并不完整，备份应同时保留 storage domain 元数据、SQLite 和 `knowledge-raw`。
```

</details>

**依据 3 · 源码核查**：[src/knowledge/store.ts:60-95](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/store.ts#L60-L95)

原始字节读写

<details>
<summary>查看原文（36行）</summary>

```text
export class RawFileStorage implements RawFileStore {
  constructor(private readonly root: string) {}

  private pathOf(relativePath: string): string {
    const resolved = join(this.root, relativePath)
    // The relative path is always built from uuid segments + a sanitized ext;
    // assert it stays inside the root regardless.
    const rel = relativePath.replace(/\\/g, '/')
    if (rel === '..' || rel.startsWith('../') || rel.includes('/../') || resolved.startsWith(this.root) === false) {
      throw new Error(`unsafe raw file path: ${relativePath}`)
    }
    return resolved
  }

  async write(baseId: string, docId: string, ext: string, bytes: Uint8Array): Promise<string> {
    const relativePath = `${baseId}/${docId}${ext}`
    const full = this.pathOf(relativePath)
    await mkdir(dirname(full), { recursive: true })
    await writeFile(full, bytes)
    return relativePath
  }

  async writeRel(baseId: string, relativePath: string, bytes: Uint8Array): Promise<string> {
    const full = this.pathOf(`${baseId}/${relativePath.replace(/\\/g, '/')}`)
    await mkdir(dirname(full), { recursive: true })
    await writeFile(full, bytes)
    return `${baseId}/${relativePath.replace(/\\/g, '/')}`
  }

  async read(relativePath: string): Promise<Uint8Array | null> {
    try {
      return await readFile(this.pathOf(relativePath))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw error
    }
```

</details>

**依据 4 · 源码核查**：[src/knowledge/store.ts:267-284](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/store.ts#L267-L284)

SQLite、Domain与raw组合

<details>
<summary>查看原文（18行）</summary>

```text
): Promise<Store> {
  if (facility === undefined) return new MemoryStore()
  const domain = await facility.open(knowledgeDomainSpec)
  let chunkDb: ChunkDatabase | undefined
  try {
    const chunkStorePath = resolveChunkStorePath(options?.chunkStorePath)
    chunkDb = new ChunkDatabase(chunkStorePath)
    await migrateLegacyChunkFile(options?.legacyJsonPath ?? legacyChunkFilePath(), chunkDb, message => console.warn(message))
    // Original source bytes live next to the chunk store (Cherry's `raw/`
    // material store): `<chunkStoreDir>/knowledge-raw`.
    const raw = new RawFileStorage(join(dirname(chunkStorePath), 'knowledge-raw'))
    const store = new DomainStore(domain, chunkDb, raw)
    try {
      await store.recoverDocumentGenerations()
      // Startup self-healing: drop documents a crashed import left behind
      // (pure placeholders with no recoverable text), then reconcile stale
      // chunkCount metadata. Resume candidates (rawText present, chunks
      // partial) are re-indexed by the service after openStore returns.
```

</details>

**依据 5 · 源码核查**：[src/knowledge/index.ts:351-359](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/index.ts#L351-L359)

独立knowledge-artifacts目录

```text
    // ~600MB model can never outlive the plugin (Cherry: lifecycle-managed worker).
    this.ctx.effect(() => () => { void disposeLocalModelWorker() }, 'knowledge: dispose local model worker')
    this.ctx.effect(() => () => { void disposeLocalRerankProcess() }, 'knowledge: dispose local rerank process')
    this.ctx.effect(() => () => { void disposeOcrWorker() }, 'knowledge: dispose OCR worker')
    this.ctx.effect(() => () => this.mineruDeployment.dispose(), 'knowledge: dispose MinerU deployment')
    if (store === undefined) { this.resolveStore(); return }
    this.artifacts = new ArtifactRepository(store.raw !== undefined
      ? join(dirname(resolveChunkStorePath(this.baseConfig.chunkStorePath)), 'knowledge-artifacts')
      : undefined)
```

**依据 6 · 源码核查**：[src/knowledge/artifacts.ts:72-109](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/artifacts.ts#L72-L109)

不可变修订及pending提交

<details>
<summary>查看原文（38行）</summary>

```text
  private async saveRevision(baseId: string, documentId: string, output: ProcessingOutput): Promise<DocumentProcessingInfo> {
    const revision = randomUUID()
    const key = this.key(baseId, documentId, revision)
    const parsed = JSON.stringify(output.document)
    if (Buffer.byteLength(parsed) > MAX_MANIFEST_BYTES) throw new Error('parsed document exceeds artifact limit')
    const info: DocumentProcessingInfo = {
      revision, artifactId: key, sourceHash: output.document.sourceHash,
      provider: output.document.provider, processorVersion: output.document.processorVersion,
      optionsFingerprint: output.document.optionsFingerprint, parsedAt: Date.now(),
      completeness: output.document.completeness, pageCount: output.document.pageCount,
      processedPages: output.document.processedPages, warnings: output.document.warnings,
    }
    const manifest: Manifest = { version: 1, baseId, documentId, info, documentHash: digest(parsed) }
    const assets = new Map(output.assets.map(asset => [component(asset.id), asset.bytes]))
    if (assets.size !== output.assets.length || assets.size !== output.document.assets.length) throw new Error('artifact asset count mismatch')
    for (const asset of output.document.assets) {
      const bytes = assets.get(component(asset.id))
      if (bytes === undefined || bytes.byteLength !== asset.byteLength || bytes.byteLength > MAX_ASSET_BYTES || digest(bytes) !== asset.sha256) throw new Error('artifact asset integrity mismatch')
    }
    if ((output.originalResult?.byteLength ?? 0) > MAX_RESULT_BYTES) throw new Error('processor result exceeds archive limit')
    if (this.root === undefined) {
      this.memory.set(key, { manifest, output: structuredClone(output) })
      return info
    }
    const candidate = this.path(`${key}.pending`)
    const target = this.path(key)
    await mkdir(candidate, { recursive: true })
    try {
      await writeFile(join(candidate, 'document.json'), parsed, { flag: 'wx' })
      for (const [id, bytes] of assets) await writeFile(join(candidate, `${id}.blob`), bytes, { flag: 'wx' })
      if (output.originalResult !== undefined) await writeFile(join(candidate, 'upstream.zip'), output.originalResult, { flag: 'wx' })
      // Manifest last. A crashed candidate can never be mistaken for a ready revision.
      await writeFile(join(candidate, 'manifest.json'), JSON.stringify(manifest), { flag: 'wx' })
      await rename(candidate, target)
      return info
    } catch (error) {
      await rm(candidate, { recursive: true, force: true }).catch(() => {})
      throw error
```

</details>

**依据 7 · 源码核查**：[src/knowledge/index.ts:3963-3994](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/index.ts#L3963-L3994)

嵌入前持久化源文本

<details>
<summary>查看原文（32行）</summary>

```text
      const docId = input.placeholderId ?? input.documentId ?? crypto.randomUUID()
      const prior = input.placeholderId !== undefined ? store.getDocument(docId) : undefined
      const createdAt = prior?.createdAt ?? Date.now()
      // Persist the document (with its source text) BEFORE embedding starts and
      // mark it incomplete: a crash mid-embedding then leaves a recoverable
      // record — startup recovery re-runs the embed with hash reuse, which only
      // re-embeds the batches that never landed. Without this write a crash
      // would leave either a raw placeholder (no text to rebuild from) or an
      // old complete record, both losing the in-flight work.
      const halfDoc: KnowledgeDocument = {
        id: docId,
        baseId: input.baseId,
        title: input.title,
        sourceType: input.sourceType,
        ...(input.processed !== undefined ? { processing: input.processed.processing } : {}),
        ...(input.fileName !== undefined ? { fileName: input.fileName } : {}),
        ...(input.mimeType !== undefined ? { mimeType: input.mimeType } : {}),
        ...(input.url !== undefined ? { url: input.url } : {}),
        ...(input.parentDirectoryId !== undefined ? { parentDirectoryId: input.parentDirectoryId } : {}),
        ...(input.rawFilePath !== undefined ? { rawFilePath: input.rawFilePath } : {}),
        ...(input.sourcePath !== undefined ? { sourcePath: input.sourcePath } : {}),
        contentHash,
        rawText: input.text,
        charCount: input.text.length,
        tokenCount: estimateTokens(input.text),
        chunkCount: 0,
        incomplete: true,
        createdAt,
        updatedAt: Date.now(),
      }
      await store.putDocument(halfDoc)
      return halfDoc
```

</details>

#### 缺口

- 四类数据的跨进程一致备份和恢复未实测
  **影响**：恢复操作不能只由路径齐全判断成功，可能恢复到不同代
  **进一步探讨**：暂停写入后备份四类数据，在独立home验证搜索、续读及附件

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 已有修订拒绝机制后，还有什么值得验证？

**研究主题**：新假设与验证

#### 完整回答

固定实现已经拒绝带旧 revision 的读取，并检查当前产物归属和哈希，因此本轮没有形成增加修订比较这一新机制的依据。现有功能最值得验证的是调用方是否总保留游标中的修订号，以及文档切换后能否理解重新搜索的错误。

若后续观察到用户把旧 blockId 与省略 revision 组合而误读当前版本，可试验在有 blockId 的续读入口要求 revision。对照保留修订、丢失修订与正常首次读取，检验错误引用数量和合法读取受阻率。若当前调用链已保证修订总被传递，或加强要求没有降低误读，则不应增加约束。这个可用性假设未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/knowledge/index.ts:2861-2875](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/knowledge/index.ts#L2861-L2875)

已有拒绝与当前修订选择

<details>
<summary>查看原文（15行）</summary>

```text
  async readDocumentEvidence(id: string, options: { revision?: string; pageIndex?: number; blockId?: string; blockOffset?: number; maxTokens?: number } = {}): Promise<DocumentEvidence> {
    const doc = this.requireStore().getDocument(id)
    if (doc === undefined) throw new NotFoundError('document not found')
    if (options.revision !== undefined && doc.processing?.revision !== options.revision) throw new NotFoundError('evidence revision is no longer current; search again')
    if (doc.processing === undefined) return { documentId: id, title: doc.title, blocks: [], assets: [], estimatedTokens: 0, truncated: false }
    const parsed = await this.artifacts.load(doc.baseId, id, doc.processing)
    return composeDocumentEvidence(doc, parsed, options)
  }

  async getEvidenceAsset(id: string, assetId: string, revision: string) {
    const doc = this.requireStore().getDocument(id)
    if (doc?.processing === undefined || doc.processing.revision !== revision) throw new NotFoundError('evidence revision is no longer current; refresh the document')
    const asset = await this.artifacts.readAsset(doc.baseId, id, doc.processing, assetId)
    if (asset === undefined) throw new NotFoundError('evidence asset not found')
    return { ...asset, fileName: assetId }
```

</details>

**依据 2 · 源码核查**：[src/tool-knowledge/index.ts:973-986](https://github.com/Soren-ABT/dsh-knowledge/blob/2f9261b40d98924cd4f8f8d2735fcd21006a67ef/src/tool-knowledge/index.ts#L973-L986)

工具中revision可省略

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args) {
      requireDocumentEnabled(args.documentId)
      assertToolRange('pageIndex', args.pageIndex, 0, Number.MAX_SAFE_INTEGER)
      assertToolRange('blockOffset', args.blockOffset, 0, Number.MAX_SAFE_INTEGER)
      assertToolRange('maxTokens', args.maxTokens, 128, 4096)
      if (args.blockId !== undefined && args.blockId.trim().length === 0) throw new Error('blockId must not be empty')
      if (args.blockOffset !== undefined && args.blockId === undefined) throw new Error('blockOffset requires blockId')
      return toolOutput(await knowledge.readDocumentEvidence(args.documentId, {
        ...(args.revision !== undefined ? { revision: args.revision } : {}),
        ...(args.pageIndex !== undefined ? { pageIndex: args.pageIndex } : {}),
        ...(args.blockId !== undefined ? { blockId: args.blockId } : {}),
        ...(args.blockOffset !== undefined ? { blockOffset: args.blockOffset } : {}),
        ...(args.maxTokens !== undefined ? { maxTokens: args.maxTokens } : {}),
      }))
```

</details>

#### 缺口

- 真实模型续读是否会省略revision及由此误引用未测
  **影响**：不能证明增加必填约束有实际收益
  **进一步探讨**：对合成文档更新做完整工具调用记录和原文核对

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
