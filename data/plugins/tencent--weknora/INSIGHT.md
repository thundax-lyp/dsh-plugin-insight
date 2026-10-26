# WeKnora

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[e1f9a61](https://github.com/Tencent/WeKnora/tree/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7)

<!-- BEGIN META -->
[![GitHub ★ 35,257](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C257&color=yellow&logo=github&style=flat)](https://github.com/Tencent/WeKnora)
<!-- END META -->

> **实现功能**：面向企业文档理解、混合检索和推理的知识框架，提供问答、智能体与知识整理入口。

> **核心亮点**：相对零散 RAG 拼接，根平台把内容权限与跨知识库检索放在同一服务中，并处理模型空间、维度和跨引擎分数口径；成熟 RRF 方法不计作原创。[Q02](#research-q02) [Q03](#research-q03)

> **风险与缺陷**：归一化分数只能确认排序机制，不能证明语料相关性与答案正确率；自托管还需承担模型、存储、权限和恢复成本。[Q03](#research-q03) [Q04](#research-q04)

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)
- [4 研究问题与完整回答](#detail-section-9)
  - [Q01 · 根平台处理什么知识任务，与 DSH 子包边界在哪里？](#detail-section-10)
  - [Q02 · 知识 API 如何约束权限，混合检索如何融合结果？](#detail-section-11)
  - [Q03 · 平台贡献相对常规 RAG 在何处，最影响效果的假设是什么？](#detail-section-12)
  - [Q04 · 什么团队适合试用，自托管总负担如何形成？](#detail-section-13)
  - [Q05 · 哪些检索设计可借鉴，可推导何种新实验？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标是有组织文档、需要集中维护与检索问答的团队。

目标是有组织文档、需要集中维护与检索问答的团队。合格交付包含可更新的知识库、可追溯文档/分块和有来源的回答，而非仅安装一个工具入口。原有办法是文件搜索或零散 RAG 服务拼接；根平台把知识内容、会话和检索服务放在同一运维边界中。README 还声明 agent、wiki 与多来源同步，本轮核心源码核查聚焦内容权限及混合检索，不将所有声明升级为逐项验证。packages/dsh-weknora 仅向 DSH 注册访问工具，根平台是独立服务，不可把适配包下载量当根平台采用量。

替代基线为关键词文件搜索、向量检索单路或自行拼接 RAG 服务。平台增量在受权限约束的持续知识管理和多检索口径整合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 知识与分块内容 API | 上传、查看、修改、删除和版本回退入口 | 读写能力、角色与父知识库权限分别约束 |
| 多库混合检索 | 向量/关键词候选融合并截断返回 | 每库授权；模型空间与维度需兼容 |
| 检索分数归一 | 处理关键词尺度与混合 RRF 比例 | 改善口径不等于相关性提升 |
| 会话 API | 创建、读取、更新和停止问答会话 | 聊天能力与会话所有权检查，存在持久数据 |
| Web 与自托管部署 | 提供团队知识管理和问答访问入口 | 需模型、数据库和存储；latest 镜像不绑定研究提交 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 容器/后端与 Web 前端 | 自托管入口需要 | 提供应用和管理界面 | 服务不可用；须绑定具体镜像或源码 |
| 数据库与文件/向量存储 | 核心持久化需要 | 知识、索引和会话保存 | 导入/检索失败，恢复需保持一致性 |
| embedding 与问答模型 | 相应任务需要 | 语义检索和生成回答 | 维度不匹配需修配置及重建索引 |
| Docker sandbox 与 socket | 沙箱功能可选 | 执行沙箱任务 | 默认关闭；socket 挂载带来宿主高权限 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 管理员配置 .env、数据库/文件存储和模型 | 确认 embedding 维度、权限与备份策略 |
| 部署 | 管理员固定版本后 docker compose pull/up -d 或对应源码构建 | 健康检查与网页可达；不能只用服务启动认定任务合格 |
| 建库 | 用户导入代表性文档并完成索引 | 检查解析文本、知识归属和检索权限 |
| 检索问答 | 用户执行已标注题集，复核来源段落和回答 | 对照关键词/向量单路，不以有输出当正确 |
| 恢复 | 管理员验证备份、模型变更和索引重建 | 恢复后核对内容与索引一致性再开放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 容器、数据库、存储与模型；金额未知 | 部署、导入、权限和语料验收；耗时未知 | 不能将 latest 镜像当固定提交验收 |
| 持续使用 | embedding、问答、索引和备份；金额未知 | 内容维护、权限治理和引用复核；频率未知 | 文档规模与模型选择影响成本 |
| 失败恢复 | 备份、恢复与重建索引资源；金额未知 | 数据/索引一致性及维度排错；耗时未知 | 改 embedding 空间可能需要重建 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 混合检索机制 | 向量、关键词分类融合，分数归一并按 chunk 去重 | 召回/排序效果没有同语料实测 |
| 权限约束 | 路由与检索层均存在知识库范围与能力检查 | 完整跨租户共享链动态正确性未验证 |
| 配置故障诊断 | 查询向量维度在进入存储前校验 | 真实迁移和索引恢复时间未知 |

> **思考**：归一化分数只能确认排序机制，不能证明语料相关性与答案正确率；自托管还需承担模型、存储、权限和恢复成本。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对零散 RAG 拼接，根平台把内容权限与跨知识库检索放在同一服务中，并处理模型空间、维度和跨引擎分数口径；成熟 RRF 方法不计作原创。[Q02](#research-q02) [Q03](#research-q03)

将 embedding 的模型身份与维度显式绑定、在向量库调用前报维度不匹配错误，能使故障定位更接近配置原因；逐列表归一避免不同引擎的尺度支配融合。移植时需保持 FAQ 阈值等原有分数语义，不能将所有分数粗暴同归一。

<a id="detail-section-5"></a>

### 1.4 使用建议

有持续知识维护与运维能力的团队可用代表性语料受控试用，先固定部署版本并核对权限、引用与恢复；少量临时文件先比较简单搜索方案。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 已检查源码，固定提交 [e1f9a616](https://github.com/Tencent/WeKnora/tree/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7)；研究范围为根项目的入口和本文列出的关键机制。
- 未安装、未运行目标代码或测试，未完成真实宿主与模型任务验收。
- 固定提交的源码级研究，覆盖上述核心入口与机制；不是全项目所有功能的穷尽核查。
- 根项目工程统计按工具现有规则记录 JS/TS 与 Markdown，Go/Rust 后端语义来自列出的人工源码核查，不把这些统计当作全语言 LOC。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

未验证假设是分知识库类型调整融合权重能改善稳定性，需留出题集检验最弱类别与引用正确率，不能把可配置权重当已实现自适应学习。[Q05](#research-q05)

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 137 | 36953 | — | — | 476276 |
| .md | example | 4 | 261 | — | — | 1100 |
| .ts | test | 227 | 26904 | 24190 | 766 | — |
| .js | source | 13 | 1583 | 1325 | 89 | — |
| .mjs | source | 20 | 1206 | 1091 | 83 | — |
| .mjs | test | 81 | 8452 | 7370 | 371 | — |
| .ts | source | 344 | 104174 | 93333 | 6610 | — |
| .md | test | 1 | 66 | — | — | 544 |
| .js | test | 1 | 254 | 227 | 10 | — |
| .mts | source | 1 | 221 | 191 | 6 | — |
| .tsx | source | 10 | 925 | 872 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 417](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=417&color=grey&logo=github&style=flat)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 322](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=322&color=grey&logo=github&style=flat)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+created%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z)

暂未获取：近30天关闭。

统计日期：2026-10-24。

<a id="detail-section-9"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WeKnora 如何在明确边界内形成可采用能力，且贡献与依赖如何区分？

<a id="research-q01"></a>

<a id="detail-section-10"></a>

### Q01 · 根平台处理什么知识任务，与 DSH 子包边界在哪里？

**研究主题**：场景与需求

#### 完整回答

目标是有组织文档、需要集中维护与检索问答的团队。合格交付包含可更新的知识库、可追溯文档/分块和有来源的回答，而非仅安装一个工具入口。原有办法是文件搜索或零散 RAG 服务拼接；根平台把知识内容、会话和检索服务放在同一运维边界中。README 还声明 agent、wiki 与多来源同步，本轮核心源码核查聚焦内容权限及混合检索，不将所有声明升级为逐项验证。packages/dsh-weknora 仅向 DSH 注册访问工具，根平台是独立服务，不可把适配包下载量当根平台采用量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-72](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/README.md#L47-L72)

作者定位与三种模式。

<details>
<summary>查看原文（26行）</summary>

```text
<p align="center"><sub>1:52 · 1080p · No narration, English on-screen text</sub></p>

Use RAG to look things up, the agent for multi-step tasks, and the wiki to organize knowledge. All three work on the same knowledge bases.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./docs/images/readme/capabilities-en-dark.svg">
  <img src="./docs/images/readme/capabilities-en-light.svg" alt="01 RAG: answers you can check, with hybrid search, multimodal parsing and citations. 02 Agent: tasks done with knowledge and tools, with multi-step reasoning, skills and sandbox, the local browser, MCP tools and memory. 03 Wiki: documents organized into a wiki, with a knowledge graph and rollback." width="100%">
</picture>

**The agent's toolbox.** Skills installed from ClawHub / SkillHub / Git / ZIP run in session-persistent Docker / E2B / Cube sandboxes, with an interactive terminal and graphical desktop beside the chat. Through the BrowserSkill extension the agent operates the user's own Chrome or Edge, and external MCP services (OAuth included) can be connected and enabled tool by tool.

Beyond the three modes:

- **Memory and curation**: cross-session long-term memory keeps the profile, preferences and facts a user has confirmed. Folder uploads keep their directory tree, and retrieval chunks can be edited, diffed and rolled back.
- **Data sources and formats**: auto-sync from Feishu wiki / Feishu Drive / Confluence / GitLab / Tencent IMA / Notion / Yuque / DingTalk Docs / Seafile / RSS, with more on the way. 10+ document formats including PDF, Word, images, Excel and XMind; Office files are parsed in-process by anydoc.
- **Channels and integrations**: Q&A in WeCom, Feishu, Slack, Telegram and other IM apps; an embed widget for external websites; a built-in MCP Server for Cursor, Claude and other AI tools; scoped API keys with a principal model for programmatic access.
- **Models**: 29 built-in vendors with a generated model catalog, including OpenAI, DeepSeek, Qwen (Alibaba Cloud), Zhipu, Hunyuan, Gemini, MiniMax, NVIDIA, LiteLLM and Ollama.
- **Permissions and operations**: multi-workspace RBAC (four roles, per-resource ownership, per-workspace audit log), several storage instances per workspace, a runtime task-queue dashboard with worker-pool governance, and Langfuse tracing for agent steps, token usage and pipelines.
- **Deployment**: LLMs, vector databases and storage backends are all swappable. Deploy locally or on a private cloud and keep the data in your own environment.

## Quick Start

<table>
  <tr>
    <td width="33%" valign="top">
      <img src="./website-docs/homepage/public/docs/_home/brands/wechat-dialog.png" width="28" height="28" alt=""><br/>
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/index.ts:25-37](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/src/index.ts#L25-L37)

子包是工具注册适配层。

<details>
<summary>查看原文（13行）</summary>

```text
 * @param ctx - the Cordis context, with `ctx.tools` injected.
 * @param config - the plugin's `config` row; validated here so a typo fails the load.
 */
export function apply(ctx: HarnessContext, config: unknown): void {
  const resolved = resolveConfig(config as never)
  const client = new WeknoraClient(resolved)
  const registered: string[] = []
  for (const definition of createTools(client, resolved)) {
    ctx.tools.register(definition)
    registered.push(definition.name)
  }
  ctx.logger?.info(`dsh-weknora: registered ${registered.join(', ')} against ${resolved.baseUrl}`)
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-11"></a>

### Q02 · 知识 API 如何约束权限，混合检索如何融合结果？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

routes_knowledge 在读写路由上分别配置 retrieve/ingest 能力及 Viewer、资源所有者或管理员门槛，分块经父知识再关联知识库权限。HybridSearch 先归一 MatchCount，加载检索范围中的知识库，显式授权每个库，再执行候选检索与结果截断。embedding 配置会校验维度，跨库复用向量时将模型名称、endpoint 和维度纳入身份。融合层区分向量与关键词列表，关键词按本列表最大分数归一，混合结果采用归一化加权 RRF，随后去重排序。它处理跨引擎分数口径而非只把两组列表拼接。部署需后端、前端、数据库/存储及模型配置，具体选型影响能力。

#### 证据与依据

**依据 1 · 源码核查**：[internal/router/routes_knowledge.go:29-47](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/internal/router/routes_knowledge.go#L29-L47)

分块读写权限。

<details>
<summary>查看原文（19行）</summary>

```text
	// 分块路由组。Scoped API key 需要 ingest 能力写内容，retrieve 能力读内容；
	// 两者仍受 KB 白名单约束。
	chunks := g.apiKeyGroup(r.Group("/chunks"), apiKeyIngest(apiKeyFullAccess()))
	chunkRead := chunks.With(apiKeyRetrieve(apiKeyFullAccess()))
	{
		// 获取分块列表 — Viewer+ 且对父 KB 有 read 权限（own / shared / via shared agent）
		chunkRead.GET("/:knowledge_id", g.Viewer(), g.KBAccessReadFromKnowledgeIDParam("knowledge_id"), handler.ListKnowledgeChunks)
		// 通过chunk_id获取单个chunk（不需要knowledge_id） — Viewer+ 且对父 KB 有 read 权限
		chunkRead.GET("/by-id/:id", g.Viewer(), g.KBAccessReadFromChunkIDParam("id"), handler.GetChunkByIDOnly)
		chunkRead.GET("/:knowledge_id/:id/revisions", g.Viewer(), g.KBAccessReadFromKnowledgeIDParam("knowledge_id"), handler.ListChunkRevisions)
		// 删除分块 — KB owner OR Admin+，且对父 KB 有 write 权限
		chunks.DELETE("/:knowledge_id/:id", g.OwnedChunkKBOrAdmin(), g.KBAccessWriteFromKnowledgeIDParam("knowledge_id"), handler.DeleteChunk)
		// 删除知识下的所有分块 — KB owner OR Admin+，且对父 KB 有 write 权限
		chunks.DELETE("/:knowledge_id", g.OwnedChunkKBOrAdmin(), g.KBAccessWriteFromKnowledgeIDParam("knowledge_id"), handler.DeleteChunksByKnowledgeID)
		// 更新分块信息 — KB owner OR Admin+，且对父 KB 有 write 权限
		chunks.PUT("/:knowledge_id/:id", g.OwnedChunkKBOrAdmin(), g.KBAccessWriteFromKnowledgeIDParam("knowledge_id"), handler.UpdateChunk)
		chunks.POST("/:knowledge_id/:id/revert", g.OwnedChunkKBOrAdmin(), g.KBAccessWriteFromKnowledgeIDParam("knowledge_id"), handler.RevertChunk)
		// 删除单个生成的问题（通过分块 id） — 与其它 chunk mutation 一致：
		// KB owner OR Admin+。早期这里因为链路 (chunk_id -> knowledge_id ->
```

</details>

**依据 2 · 源码核查**：[internal/application/service/knowledgebase_search.go:120-165](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/internal/application/service/knowledgebase_search.go#L120-L165)

HybridSearch 候选与截断。

<details>
<summary>查看原文（46行）</summary>

```text
}

// HybridSearch performs hybrid search, including vector retrieval and keyword retrieval.
//
// id is the "primary" knowledge base ID used to resolve the embedding model and
// determine the KB type (e.g. FAQ). When params.KnowledgeBaseIDs is set, those
// IDs are used for the actual retrieval scope instead of id alone, allowing a
// single call to span multiple KBs that share the same embedding model. In that
// case id should be any one of those KBs (typically the first) so that its
// embedding model and type configuration are used for the search.
func (s *knowledgeBaseService) HybridSearch(ctx context.Context,
	id string,
	params types.SearchParams,
) ([]*types.SearchResult, error) {
	// Normalize once, before anything reads MatchCount. params is a value
	// copy, so this stays local to the call.
	params.MatchCount = normalizedMatchCount(params.MatchCount)

	chunks, err := s.hybridSearchCandidates(ctx, id, params)
	if err != nil || len(chunks) == 0 {
		return nil, err
	}

	recordImageRecallDecision(ctx, "fusion.candidate_selection", "",
		summarizeImageCandidateCut(chunks, params.MatchCount))

	// Truncate to the primary-match cap. MatchCount is guaranteed positive by
	// the normalization at the top of this function; the slice bound below
	// depends on that.
	if len(chunks) > params.MatchCount {
		chunks = chunks[:params.MatchCount]
	}

	return s.processSearchResults(ctx, chunks, params.SkipContextEnrichment)
}

// hybridSearchCandidates runs retrieval, fusion and FAQ post-processing for
// HybridSearch and returns the fused chunks, best first, before the
// MatchCount cut. params.MatchCount must already be normalized.
func (s *knowledgeBaseService) hybridSearchCandidates(ctx context.Context,
	id string,
	params types.SearchParams,
) ([]*types.IndexWithScore, error) {
	// Determine the set of KB IDs to search.
	searchKBIDs := params.KnowledgeBaseIDs
	if len(searchKBIDs) == 0 {
```

</details>

**依据 3 · 源码核查**：[internal/application/service/knowledgebase_search.go:182-201](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/internal/application/service/knowledgebase_search.go#L182-L201)

逐知识库授权。

<details>
<summary>查看原文（20行）</summary>

```text
	// returned row is enforced explicitly below.
	kbs, err := s.repo.GetKnowledgeBaseByIDs(ctx, searchKBIDs)
	if err != nil {
		logger.ErrorWithFields(ctx, err, map[string]interface{}{
			"knowledge_base_ids": searchKBIDs,
		})
		return nil, err
	}
	if len(kbs) == 0 {
		return nil, apperrors.NewNotFoundError("knowledge base not found")
	}

	// Authorize every KB for the original caller, using exact upstream
	// grants or organization permissions. Execution in a shared tenant
	// does not grant access to its other KBs. Without this guard, a
	// caller could pass arbitrary KB UUIDs in params.KnowledgeBaseIDs
	// and reach foreign tenants' bound vector stores via the per-group
	// engine resolution downstream.
	if err := s.authorizeKBAccess(ctx, kbs); err != nil {
		return nil, err
```

</details>

**依据 4 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:44-88](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/internal/application/service/knowledgebase_search_fusion.go#L44-L88)

不同检索类型归一与融合。

<details>
<summary>查看原文（45行）</summary>

```text
	return out
}

// fuseOrDeduplicate either fuses vector+keyword results via RRF or deduplicates
// single-retriever results. Every path returns scores in [0, 1] so results of
// separate searches (per-document targets, embedding-model groups, FAQ vs
// document calls) can be ranked together downstream:
//   - vector only: the engines' cosine similarity, unchanged (FAQ thresholds
//     depend on it);
//   - keyword only: BM25 divided by the best score of its own list;
//   - hybrid: weighted RRF divided by its maximum (a chunk ranked first by
//     both retrievers scores 1).
//
// retrievalCfg may be nil — defaults are then used for RRF parameters.
func fuseOrDeduplicate(
	ctx context.Context, vectorLists, keywordLists [][]*types.IndexWithScore, retrievalCfg *types.RetrievalConfig,
) []*types.IndexWithScore {
	if len(keywordLists) == 0 {
		// Vector-only: keep original embedding scores (important for FAQ)
		result := deduplicateByScore(flattenLists(vectorLists))
		logger.Infof(ctx, "Result count after deduplication: %d", len(result))
		return result
	}
	if len(vectorLists) == 0 {
		// Keyword-only: keep relative BM25 order, but fold unbounded
		// scores into [0, 1] before they reach rerank/MMR. Raw BM25
		// (often >10) saturates compositeScore's 0.3*base term. BM25 from
		// different engines or indexes is not comparable, so each list is
		// scaled by its own best score.
		for _, list := range keywordLists {
			rescaleUnboundedScores(list)
		}
		result := deduplicateByScore(flattenLists(keywordLists))
		logger.Infof(ctx, "Result count after deduplication: %d", len(result))
		return result
	}
	// Hybrid: use RRF fusion to merge vector + keyword results
	result := fuseWithRRF(ctx, vectorLists, keywordLists, retrievalCfg)
	logger.Infof(ctx, "Result count after RRF fusion: %d", len(result))
	return result
}

// sortByScoreDesc is a reusable sort comparator for IndexWithScore slices (descending by Score).
func sortByScoreDesc(a, b *types.IndexWithScore) int {
	if a.Score > b.Score {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-12"></a>

### Q03 · 平台贡献相对常规 RAG 在何处，最影响效果的假设是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

RAG、embedding 和 RRF 都有成熟先例，不能将方法名称当原创。可核查的增量是多知识库、多存储与权限体系中统一检索口径，按模型空间安全复用查询向量，并防止不同比例的 BM25 与 RRF 分数影响下游排序。业务上知识内容与问答共用服务边界，有利于团队维护可追溯来源。关键质疑是分数归一不等于相关性提升，解析质量、切块、模型选择和语料更新仍决定回答可用性；无题集实验不能证明优于简单关键词搜索。权限门槛可见但完整跨租户与共享授权链未做动态验证。

#### 证据与依据

**依据 1 · 源码核查**：[internal/application/service/knowledgebase_search.go:80-116](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/internal/application/service/knowledgebase_search.go#L80-L116)

embedding 空间身份含维度。

<details>
<summary>查看原文（37行）</summary>

```text
// identity key (name + endpoint + configured vector dimension). KBs using the
// same underlying model and vector space across different tenants will share
// the same key, enabling optimal grouping without reusing a query embedding
// across incompatible index dimensions.
func (s *knowledgeBaseService) ResolveEmbeddingModelKeys(ctx context.Context, kbs []*types.KnowledgeBase) map[string]string {
	type modelRef struct {
		ModelID  string
		TenantID uint64
	}

	// Deduplicate model references
	uniqueRefs := make(map[modelRef]struct{})
	kbRefs := make(map[string]modelRef, len(kbs))
	for _, kb := range kbs {
		ref := modelRef{ModelID: kb.EmbeddingModelID, TenantID: kb.TenantID}
		uniqueRefs[ref] = struct{}{}
		kbRefs[kb.ID] = ref
	}

	// Resolve each unique (modelID, tenantID) to a model identity key. The
	// configured dimension is part of the key because providers such as OpenAI
	// support multiple output widths for one model name and endpoint.
	resolvedKeys := make(map[modelRef]string, len(uniqueRefs))
	for ref := range uniqueRefs {
		tenantCtx := types.WithExecutionTenant(ctx, ref.TenantID)
		model, err := s.modelService.GetModelByID(tenantCtx, ref.ModelID)
		if err != nil || model == nil {
			logger.Warnf(ctx, "ResolveEmbeddingModelKeys: cannot resolve model %s for tenant %d: %v", ref.ModelID, ref.TenantID, err)
			resolvedKeys[ref] = ref.ModelID
			continue
		}
		resolvedKeys[ref] = fmt.Sprintf("%s|%s|%d", model.Name, model.Parameters.BaseURL,
			model.Parameters.EmbeddingParameters.Dimension)
	}

	result := make(map[string]string, len(kbs))
	for _, kb := range kbs {
```

</details>

**依据 2 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:107-163](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/internal/application/service/knowledgebase_search_fusion.go#L107-L163)

BM25 和 RRF 的比例问题及归一。

<details>
<summary>查看原文（57行）</summary>

```text
	for _, info := range chunkInfoMap {
		deduped = append(deduped, info)
	}
	slices.SortFunc(deduped, sortByScoreDesc)
	return deduped
}

// rescaleUnboundedScores maps a single-retriever candidate set onto [0, 1]
// by dividing through the maximum finite score. Keyword (BM25) scores are
// unbounded; leaving them in place saturates compositeScore (0.3*base with
// a [0, 1] clamp) so every candidate ties at 1.0 and MMR degenerates to
// diversity-only ordering.
//
// Scores already in [0, 1] are left unchanged so engines that stamp
// keyword hits at 1.0 (Qdrant, Doris) and already-normalized vector
// scores keep their current magnitude. Relative order is preserved
// either way. Retrieve/Langfuse sampling happens before fusion, so
// raw BM25 remains visible in the retrieve span.
func rescaleUnboundedScores(results []*types.IndexWithScore) {
	maxScore := 0.0
	for _, r := range results {
		if r == nil {
			continue
		}
		if math.IsNaN(r.Score) || math.IsInf(r.Score, 0) {
			continue
		}
		if r.Score > maxScore {
			maxScore = r.Score
		}
	}
	if maxScore <= 1 {
		return
	}
	for _, r := range results {
		if r == nil {
			continue
		}
		switch {
		case math.IsNaN(r.Score), math.IsInf(r.Score, -1), r.Score <= 0:
			r.Score = 0
		case math.IsInf(r.Score, 1):
			r.Score = 1
		default:
			r.Score = r.Score / maxScore
		}
	}
}

// fuseWithRRF merges vector and keyword retrieval results using Reciprocal Rank Fusion.
// RRF score = vectorWeight/(k+vectorRank) + keywordWeight/(k+keywordRank),
// divided by its maximum (vectorWeight+keywordWeight)/(k+1) so it lands in
// [0, 1] like the single-retriever paths. Raw RRF tops out near 0.016, which
// made hybrid hits lose to any vector-only or keyword-only result they were
// ranked against and left rerank's base-score term and MMR's relevance term
// with nothing to work with.
//
```

</details>

#### 缺口

- 没有同语料相关性与引用正确率对照。
  **影响**：不能断言混合检索一定优于关键词或向量单路。
  **进一步探讨**：按知识库类型建立人工标注题集，分别评估三路召回和最终引用质量。

<a id="research-q04"></a>

<a id="detail-section-13"></a>

### Q04 · 什么团队适合试用，自托管总负担如何形成？

**研究主题**：效果与总成本、采用判断

#### 完整回答

有持续文档维护需求、模型与数据运维能力的团队可在独立环境用代表性文档试用。仅偶尔问几份文件时，简单文件搜索或现有托管知识工具可能更合算。首次成本包括容器、存储、模型及数据导入，持续成本包括 embedding、问答、索引、备份与权限维护，失败恢复需数据库/文件一致性、模型维度与索引重建。Compose 默认镜像 latest 不是本研究提交的运行证明，应固定发布版本或构建对应源码。Docker sandbox 默认关闭，挂载 docker.sock 等同高宿主权限，不能把其作为无成本默认能力。现金和人工时间均无测量，推荐限于受控试用。

#### 证据与依据

**依据 1 · 源码核查**：[docker-compose.yml:1-17](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/docker-compose.yml#L1-L17)

镜像默认 latest。

<details>
<summary>查看原文（17行）</summary>

```text
services:
  frontend:
    image: wechatopenai/weknora-ui:${WEKNORA_VERSION:-latest}
    # Multi-stage Dockerfile builds dist inside the image (no host npm required).
    # Optional: NPM_REGISTRY=https://registry.npmmirror.com docker compose build frontend
    # VITE_FRONTEND_COMMIT: start_all.sh / make docker-build-frontend inject git;
    # otherwise pass it explicitly or the system-info page shows "unknown".
    build:
      context: ./frontend
      args:
        VITE_FRONTEND_COMMIT: ${VITE_FRONTEND_COMMIT:-unknown}
        NPM_REGISTRY: ${NPM_REGISTRY:-}
        NODE_MAX_OLD_SPACE_SIZE: ${NODE_MAX_OLD_SPACE_SIZE:-4096}
    container_name: WeKnora-frontend
    ports:
      - "${FRONTEND_PORT:-80}:80"
    environment:
```

</details>

**依据 2 · 源码核查**：[docker-compose.yml:41-58](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/docker-compose.yml#L41-L58)

后端卷与可选 Docker socket。

<details>
<summary>查看原文（18行）</summary>

```text
      args:
        - APK_MIRROR_ARG=${APK_MIRROR_ARG:-}
        - WITH_ANYDOC=${WITH_ANYDOC:-1}
    container_name: WeKnora-app
    ports:
      - "${APP_PORT:-8080}:8080"
    volumes:
      - data-files:/data/files
      - docreader-tmp:/tmp/docreader:ro
      - ./config/config.yaml:/app/config/config.yaml
      # Docker 沙箱默认关闭（见 WEKNORA_SANDBOX_DOCKER_ENABLED）。需要本机 daemon 时
      # 同时设 true 并挂载实际 socket——这等同宿主机 root，仅私有化单机。
      # 入口脚本会按 socket GID 把 appuser 加入对应组（compose group_add 在 gosu 后无效）。
      # - /var/run/docker.sock:/var/run/docker.sock
      # Optional: declarative built-in models. Copy config/builtin_models.yaml.example
      # to config/builtin_models.yaml, edit it for your deployment, then
      # uncomment the line below. See website-docs/03-features/06-models.md.
      # - ./config/builtin_models.yaml:/app/config/builtin_models.yaml:ro
```

</details>

**依据 3 · 源码核查**：[docker-compose.yml:105-115](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/docker-compose.yml#L105-L115)

迁移及 sandbox 配置边界。

<details>
<summary>查看原文（11行）</summary>

```text
      # 默认信任 loopback + 私网段（容器网络内 nginx 已覆盖）
      # - WEKNORA_TRUSTED_PROXIES=${WEKNORA_TRUSTED_PROXIES:-}
      # 启动时自动执行数据库迁移；设为 false 禁用，默认启用
      - AUTO_MIGRATE=${AUTO_MIGRATE:-true}
      # IM 渠道图片/文件外链的外部可达 URL。IM 显示知识库图片需二选一：
      # 存储后端公网可达（如 MINIO_ENDPOINT 设为公网），或设本变量走 <APP_EXTERNAL_URL>/r/<token>（需 nginx 代理 /r/）。
      # 默认 MinIO 内网部署 / local 后端需设本变量。
      # - APP_EXTERNAL_URL=${APP_EXTERNAL_URL:-}
      # 前端外部 origin，用于邀请链接等绝对 URL（留空走 host-relative）
      - FRONTEND_BASE_URL=${FRONTEND_BASE_URL:-}
      # ========== 对象存储 - 腾讯云 COS ==========
```

</details>

#### 缺口

- 缺少规模化导入、索引维护与故障恢复的资源记录。
  **影响**：不能给出适用文档规模、预算或单位合格任务成本。
  **进一步探讨**：用代表性语料记录导入时间、模型消耗、备份恢复和人工纠错投入。

<a id="research-q05"></a>

<a id="detail-section-14"></a>

### Q05 · 哪些检索设计可借鉴，可推导何种新实验？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

将 embedding 的模型身份与维度显式绑定、在向量库调用前报维度不匹配错误，能使故障定位更接近配置原因；逐列表归一避免不同引擎的尺度支配融合。移植时需保持 FAQ 阈值等原有分数语义，不能将所有分数粗暴同归一。未验证假设是按知识库类型及题目结构选择融合权重，可比全局固定权重更稳健；最小验证使用留出题集比较固定权重与分类型权重，报告每类召回、引用正确率和退化最严重类别，若只在训练题提高则否定泛化优势。源码现有可配置权重不是已完成自适应学习。

#### 证据与依据

**依据 1 · 源码核查**：[internal/application/service/knowledgebase_search.go:51-78](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/internal/application/service/knowledgebase_search.go#L51-L78)

向量维度失败诊断。

<details>
<summary>查看原文（28行）</summary>

```text
		return nil, err
	}
	return vector, nil
}

// validateQueryEmbeddingDimension catches provider/model configuration drift
// before a malformed query reaches the vector store. Without this check, a
// provider returning a different vector size is reported as the misleading
// generic 2201 "bound store unavailable" error (or, for dimension-partitioned
// stores, silently produces no matches).
func validateQueryEmbeddingDimension(model embedding.Embedder, actual int) error {
	if model == nil || actual == 0 {
		return nil
	}
	expected := model.GetDimensions()
	if expected <= 0 || expected == actual {
		return nil
	}
	return apperrors.NewVectorStoreUnavailableError(
		"embedding vector dimension does not match the configured model",
	).WithDetails(map[string]any{
		"model":              model.GetModelName(),
		"expected_dimension": expected,
		"actual_dimension":   actual,
		"hint":               fmt.Sprintf("check the embedding model configuration and rebuild the affected index (%d dimensions)", expected),
	})
}

```

</details>

**依据 2 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:44-79](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/internal/application/service/knowledgebase_search_fusion.go#L44-L79)

保留向量阈值语义并归一其他路径。

<details>
<summary>查看原文（36行）</summary>

```text
	return out
}

// fuseOrDeduplicate either fuses vector+keyword results via RRF or deduplicates
// single-retriever results. Every path returns scores in [0, 1] so results of
// separate searches (per-document targets, embedding-model groups, FAQ vs
// document calls) can be ranked together downstream:
//   - vector only: the engines' cosine similarity, unchanged (FAQ thresholds
//     depend on it);
//   - keyword only: BM25 divided by the best score of its own list;
//   - hybrid: weighted RRF divided by its maximum (a chunk ranked first by
//     both retrievers scores 1).
//
// retrievalCfg may be nil — defaults are then used for RRF parameters.
func fuseOrDeduplicate(
	ctx context.Context, vectorLists, keywordLists [][]*types.IndexWithScore, retrievalCfg *types.RetrievalConfig,
) []*types.IndexWithScore {
	if len(keywordLists) == 0 {
		// Vector-only: keep original embedding scores (important for FAQ)
		result := deduplicateByScore(flattenLists(vectorLists))
		logger.Infof(ctx, "Result count after deduplication: %d", len(result))
		return result
	}
	if len(vectorLists) == 0 {
		// Keyword-only: keep relative BM25 order, but fold unbounded
		// scores into [0, 1] before they reach rerank/MMR. Raw BM25
		// (often >10) saturates compositeScore's 0.3*base term. BM25 from
		// different engines or indexes is not comparable, so each list is
		// scaled by its own best score.
		for _, list := range keywordLists {
			rescaleUnboundedScores(list)
		}
		result := deduplicateByScore(flattenLists(keywordLists))
		logger.Infof(ctx, "Result count after deduplication: %d", len(result))
		return result
	}
```

</details>

**依据 3 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:147-163](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/internal/application/service/knowledgebase_search_fusion.go#L147-L163)

融合权重及归一机制。

<details>
<summary>查看原文（17行）</summary>

```text
			r.Score = 0
		case math.IsInf(r.Score, 1):
			r.Score = 1
		default:
			r.Score = r.Score / maxScore
		}
	}
}

// fuseWithRRF merges vector and keyword retrieval results using Reciprocal Rank Fusion.
// RRF score = vectorWeight/(k+vectorRank) + keywordWeight/(k+keywordRank),
// divided by its maximum (vectorWeight+keywordWeight)/(k+1) so it lands in
// [0, 1] like the single-retriever paths. Raw RRF tops out near 0.016, which
// made hybrid hits lose to any vector-only or keyword-only result they were
// ranked against and left rerank's base-score term and MMR's relevance term
// with nothing to work with.
//
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
