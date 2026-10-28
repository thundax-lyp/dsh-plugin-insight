# WeKnora 知识平台

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[256a3f2](https://github.com/Tencent/WeKnora/tree/256a3f2966866337f7dc3c5fcc10037f2ae18d52)

<!-- BEGIN META -->
[![GitHub ★ 35,641](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C641&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora)
<!-- END META -->

> **功能**：集中管理组织知识库，并提供检索问答、Agent 与 wiki 能力

> **亮点**：在同一服务中把内容权限、跨库向量空间与跨引擎分数口径连起来，降低自行拼接的集成负担；真正检索质量仍依赖语料和模型。[Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：分数归一仅建立排序口径，不能证明相关性或概率校准；部署和恢复还需额外维护模型、索引与权限。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 组织知识平台相对文件搜索和零散 RAG 拼接增加什么？](#detail-section-11)
  - [Q02 · 跨库混合检索怎样处理权限、模型空间和调用成本？](#detail-section-12)
  - [Q03 · 归一化融合能否证明检索结果更正确？](#detail-section-13)
  - [Q04 · 团队怎样承担部署、维护和失败恢复责任？](#detail-section-14)
  - [Q05 · 可配置融合如何转为有证据的适应性改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向持续维护组织资料的团队，集中管理知识库、权限与可追溯问答。

文件搜索或自行拼接文档、向量库和权限服务；集成贡献不等同于新发明RRF算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 组织知识管理 | 维护文档、分块与权限 | 服务、存储与治理 |
| 混合检索 | 关键词/向量融合 | 模型空间兼容，效果需测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 后端、前端、数据库与存储 | 必需 | 知识与会话服务 | 仅DSH适配包不能替代平台 |
| embedding与问答模型 | 对应任务必需 | 索引、检索和回答 | 维度不匹配需排错或重建 |
| 正确身份与库权限 | 必需 | 限制读写范围 | 必须验证拒绝路径 |
| 备份和版本固定 | 持续运维必需 | 数据恢复与一致部署 | latest不代表本次固定源码 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 部署 | 团队固定版本与模型 | 前后端及索引配置一致 |
| 导入 | 管理员整理资料并限定库 | 原文和分块对应 |
| 查询 | 用户检索与复核引用 | 权限边界及答案正确 |
| 恢复 | 运维核对备份和索引 | 版本/模型变更后可重建 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 容器、索引、存储及模型未知 | 部署、清洗和权限验收未知 | 需固定版本 |
| 持续使用 | embedding、问答和备份未知 | 维护语料与复核引用未知 | 无单位合格任务测量 |
| 失败恢复 | 重建索引与恢复资源未知 | 检查数据/向量一致性未知 | 维度变更可能需重建 |
| 退出 | 导出和迁移资源未知 | 保留原件及权限映射未知 | 迁移验证未执行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 受限检索 | 路由与候选阶段逐库授权 | 完整跨租户动态正确性 |
| 融合排序 | 独立列表归一、RRF和去重 | 召回和引用质量 |
| 配置排错 | 维度校验在入库前 | 真实恢复时长 |

> **思考**：分数归一仅建立排序口径，不能证明相关性或概率校准；部署和恢复还需额外维护模型、索引与权限。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在同一服务中把内容权限、跨库向量空间与跨引擎分数口径连起来，降低自行拼接的集成负担；真正检索质量仍依赖语料和模型。[Q02](#research-q02) [Q03](#research-q03)

维度检查和逐列表融合使故障定位更贴近配置与排序原因；移植需保留FAQ分数语义、调用者授权和模型空间身份，不能只复制融合公式。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

分数归一仅建立排序口径，不能证明相关性或概率校准；部署和恢复还需额外维护模型、索引与权限。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

有持续资料维护和运维能力的团队可在非敏感语料试用，先验收授权拒绝、引用和恢复，再比较简单搜索；不以目录收录或分数归一证明可靠。[Q04](#research-q04)

**补充建议**

可检验分类型融合权重能否改善留出集引用质量；若最弱类别恶化或维护负担上升，则否定该假设。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

权限路由、向量空间和融合调用有固定源码支持；同条件质量和总成本未知，分类型权重仅为假设。

- 已检查：作者 README、包清单、源码路径 README.md、internal/router/routes_knowledge.go、internal/application/service/knowledgebase_search.go、internal/application/service/knowledgebase_search_fusion.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根平台聚焦知识读写路由、跨库检索与融合、README部署；Go文件以固定Git blob读取，不视为已展开checkout缺失受阻。不审计全平台Agent/wiki。
- 下一步：本次没有部署、运行目标代码或执行测试；源码支持机制，当前权限全链、任务质量和恢复需要独立验收。

**分析版本**

- **仓库**：[Tencent/WeKnora](https://github.com/Tencent/WeKnora)
- **版本号**：未声明（[固定提交 256a3f2](https://github.com/Tencent/WeKnora/tree/256a3f2966866337f7dc3c5fcc10037f2ae18d52)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是按知识库资料类型和查询结构选择融合权重，而不是给全部任务一套全局权重。推导来自现有融合将关键词精确匹配与向量语义排名分开，且多列表量纲差异不能由归一解决。最小验证对照固定默认权重、人工分类型权重和单检索，在不用于调参的题集上统计每类引用正确率、召回及最差退化类别，同时计入调参人工成本。若只在调参题上提高、最弱类别恶化或净维护负担更高，则否定优势。现有 retrievalCfg 可提供参数，不等于已经实现自动学习或证明分类型需求。 [Q05](#research-q05)

本次没有部署、运行目标代码或执行测试；源码支持机制，当前权限全链、任务质量和恢复需要独立验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 139 | 37148 | — | — | 480159 |
| .md | example | 4 | 261 | — | — | 1100 |
| .ts | test | 245 | 32016 | 28779 | 927 | — |
| .js | source | 13 | 1583 | 1325 | 89 | — |
| .mjs | source | 20 | 1206 | 1091 | 83 | — |
| .mjs | test | 81 | 8465 | 7382 | 371 | — |
| .ts | source | 349 | 107375 | 96350 | 6738 | — |
| .md | test | 1 | 66 | — | — | 544 |
| .js | test | 1 | 254 | 227 | 10 | — |
| .mts | source | 1 | 221 | 191 | 6 | — |
| .tsx | source | 10 | 925 | 872 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 404](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=404&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 322](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=322&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 236](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=236&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：组织知识平台相对文件搜索和零散 RAG 拼接增加什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 组织知识平台相对文件搜索和零散 RAG 拼接增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根平台面向持续维护组织资料、需要权限和来源一致的知识问答团队。基线是文件搜索，或自行拼装文档解析、向量库、会话与权限；合格交付应是可维护知识库、可追溯分块和有来源的任务结果。README 声明 RAG、Agent 和 wiki 共用知识库，多来源同步与跨会话记忆是作者能力声明，本次核心核查聚焦内容访问和混合检索，不将所有介绍变为已验证。平台增量是把内容管理、检索空间和访问约束放到同一服务边界，DSH 子包只是访问入口；不能用子包下载代表平台采用。少量临时文件可优先用简单搜索，集中平台只有在持续更新与治理摩擦足够时才有意义。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-65](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/README.md#L41-L65)

作者定义共享知识库、权限与部署能力。

<details>
<summary>查看原文（25行）</summary>

```text
## Overview

[WeKnora](https://weknora.weixin.qq.com) is an open-source, LLM-powered knowledge framework for enterprise document understanding, semantic retrieval and reasoning. It brings a team's documents together so they can be searched, reasoned over and kept up to date.

https://github.com/user-attachments/assets/5722b10d-d04d-49ed-a6cc-635a8c77d91f

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
```

</details>

**依据 2 · 源码核查**：[internal/router/routes_knowledge.go:28-44](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/router/routes_knowledge.go#L28-L44)

分块读写按能力与父知识库访问约束。

<details>
<summary>查看原文（17行）</summary>

```text
func RegisterChunkRoutes(r *gin.RouterGroup, handler *handler.ChunkHandler, g *rbacGuards) {
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
```

</details>

#### 缺口

- 没有组织真实知识维护流程和同任务效果数据
  **影响**：不能把平台供给推断为已验证需求或收益
  **进一步探讨**：用代表资料与用户任务对照文件搜索，记录引用正确性和维护工时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 跨库混合检索怎样处理权限、模型空间和调用成本？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

内容路由将 retrieve 与 ingest 分开，读分块先沿 knowledge_id 或 chunk_id 找父库，写入需所有者或管理员以及写权限；这些是实际路由接线，但不能仅凭守卫名认定整个多租户链已安全验收。HybridSearch 归一 MatchCount，再调用候选检索、截断和结果处理。候选阶段批量加载全部请求库后按原调用者逐库授权，校验嵌入模型一致性并要求主库存在，避免把跨租户执行身份当作读取任意库的授权。查询嵌入在扇出前复用，模型身份使用名称、endpoint和配置维度组成，维度不匹配在进向量库前报具体错误。这是减少重复请求与语义误配的工程贡献，不代表所有同名模型天然处于同一语义空间。

#### 证据与依据

**依据 1 · 源码核查**：[internal/router/routes_knowledge.go:28-44](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/router/routes_knowledge.go#L28-L44)

读写路由能力和父库守卫。

<details>
<summary>查看原文（17行）</summary>

```text
func RegisterChunkRoutes(r *gin.RouterGroup, handler *handler.ChunkHandler, g *rbacGuards) {
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
```

</details>

**依据 2 · 源码核查**：[internal/application/service/knowledgebase_search.go:49-76](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/application/service/knowledgebase_search.go#L49-L76)

查询向量维度早期诊断。

<details>
<summary>查看原文（28行）</summary>

```text
	if err := validateQueryEmbeddingDimension(embeddingModel, len(vector)); err != nil {
		logger.Errorf(ctx, "GetQueryEmbedding: %v", err)
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
```

</details>

**依据 3 · 源码核查**：[internal/application/service/knowledgebase_search.go:79-118](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/application/service/knowledgebase_search.go#L79-L118)

模型身份包含endpoint与维度。

<details>
<summary>查看原文（40行）</summary>

```text
// ResolveEmbeddingModelKeys resolves embedding model IDs to their actual model
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
		result[kb.ID] = resolvedKeys[kbRefs[kb.ID]]
	}
```

</details>

**依据 4 · 源码核查**：[internal/application/service/knowledgebase_search.go:130-153](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/application/service/knowledgebase_search.go#L130-L153)

主检索与截断接线。

<details>
<summary>查看原文（24行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[internal/application/service/knowledgebase_search.go:194-231](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/application/service/knowledgebase_search.go#L194-L231)

逐库授权、主库存在和一次嵌入扇出。

<details>
<summary>查看原文（38行）</summary>

```text
	// Authorize every KB for the original caller, using exact upstream
	// grants or organization permissions. Execution in a shared tenant
	// does not grant access to its other KBs. Without this guard, a
	// caller could pass arbitrary KB UUIDs in params.KnowledgeBaseIDs
	// and reach foreign tenants' bound vector stores via the per-group
	// engine resolution downstream.
	if err := s.authorizeKBAccess(ctx, kbs); err != nil {
		return nil, err
	}

	// Explicit embedding-model consistency check. Multi-KB searches that
	// span different embedding spaces would otherwise silently produce
	// meaningless cross-model scores. Same-model wiki/graph KBs are
	// tolerated — see validateSameEmbeddingModel for the carve-out.
	if err := s.validateSameEmbeddingModel(ctx, kbs); err != nil {
		return nil, err
	}

	// Resolve the primary KB — embedding model + FAQ type come from this
	// one. Miss → 404 (no kbs[0] fallback; a silent pivot to an arbitrary
	// KB would hide caller bugs and reveal foreign KB metadata).
	kb := pickPrimary(kbs, id)
	if kb == nil {
		return nil, apperrors.NewNotFoundError("knowledge base not found")
	}

	// Over-retrieval (existing rule, preserved): 5x per-KB matchCount,
	// floored at DefaultRetrievalTopK, capped at maxRetrievalPoolSize across
	// the whole search.
	matchCount := max(params.MatchCount*5, types.DefaultRetrievalTopK) * len(searchKBIDs)
	if matchCount > maxRetrievalPoolSize {
		matchCount = maxRetrievalPoolSize
	}

	// Compute the query embedding once before fan-out and propagate via
	// params.QueryEmbedding. Without this, each storeGroup's
	// buildRetrievalParams would re-embed the same query text — for N
	// stores that means N API calls of identical input.
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 归一化融合能否证明检索结果更正确？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。融合层保留每个引擎返回的独立列表，按向量或关键词分类；仅向量保留原余弦值以兼容 FAQ 阈值，仅关键词按本列表最大有限分数归一，混合使用加权RRF并除以理论最大值。每种方式都去重并排序，解决不同量纲和列表拼接顺序导致的排序偏置，这是具体机制支持；RRF本身为成熟方法，不作为原创算法。归一到同一数值区间并不等价于跨模型校准或相关性概率，关键词列表只有一个弱命中也可能被归一到1。服务端截断会影响召回，语料质量、分块和模型仍决定真实效果。需比较最终引用与原问题，而不是因为分数可比较便声称答案可靠。

#### 证据与依据

**依据 1 · 源码核查**：[internal/application/service/knowledgebase_search.go:306-320](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/application/service/knowledgebase_search.go#L306-L320)

实际候选链调用融合。

<details>
<summary>查看原文（15行）</summary>

```text
	// Separate and fuse retrieval results.
	vectorLists, keywordLists := classifyRetrievalResults(ctx, retrieveResults)
	vectorResults, keywordResults := flattenLists(vectorLists), flattenLists(keywordLists)
	if len(vectorResults) == 0 && len(keywordResults) == 0 {
		logger.Info(ctx, "No search results found")
		return nil, nil
	}
	logger.Infof(ctx, "Result count before fusion: vector=%d, keyword=%d",
		len(vectorResults), len(keywordResults))

	var retrievalCfg *types.RetrievalConfig
	if tenantInfo != nil {
		retrievalCfg = tenantInfo.RetrievalConfig
	}
	deduplicatedChunks := fuseOrDeduplicate(ctx, vectorLists, keywordLists, retrievalCfg)
```

</details>

**依据 2 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:12-35](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/application/service/knowledgebase_search_fusion.go#L12-L35)

保留不同引擎的独立列表。

<details>
<summary>查看原文（24行）</summary>

```text
// classifyRetrievalResults separates retrieval results by retriever type
// (vector vs keyword). Each RetrieveResult stays its own list: they come from
// different engines, store groups and parameter sets (document vs FAQ), are
// appended in goroutine completion order, and their positions are only
// meaningful within the list.
func classifyRetrievalResults(ctx context.Context, retrieveResults []*types.RetrieveResult) (
	vectorLists, keywordLists [][]*types.IndexWithScore,
) {
	for _, retrieveResult := range retrieveResults {
		logger.Infof(ctx, "Retrieval results, engine: %v, retriever: %v, count: %v",
			retrieveResult.RetrieverEngineType,
			retrieveResult.RetrieverType,
			len(retrieveResult.Results),
		)
		if len(retrieveResult.Results) == 0 {
			continue
		}
		if retrieveResult.RetrieverType == types.VectorRetrieverType {
			vectorLists = append(vectorLists, retrieveResult.Results)
		} else {
			keywordLists = append(keywordLists, retrieveResult.Results)
		}
	}
	return
```

</details>

**依据 3 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:47-83](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/application/service/knowledgebase_search_fusion.go#L47-L83)

三个融合分支。

<details>
<summary>查看原文（37行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:114-151](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/application/service/knowledgebase_search_fusion.go#L114-L151)

关键词按列表最大分数归一。

<details>
<summary>查看原文（38行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:156-175](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/application/service/knowledgebase_search_fusion.go#L156-L175)

加权RRF及最大值归一。

<details>
<summary>查看原文（20行）</summary>

```text
// fuseWithRRF merges vector and keyword retrieval results using Reciprocal Rank Fusion.
// RRF score = vectorWeight/(k+vectorRank) + keywordWeight/(k+keywordRank),
// divided by its maximum (vectorWeight+keywordWeight)/(k+1) so it lands in
// [0, 1] like the single-retriever paths. Raw RRF tops out near 0.016, which
// made hybrid hits lose to any vector-only or keyword-only result they were
// ranked against and left rerank's base-score term and MMR's relevance term
// with nothing to work with.
//
// A chunk's rank for a retriever is its best position in any one list of
// that retriever, each list ordered by its own score. Positions in the
// concatenation of several lists are arbitrary: the second list's best hit
// would otherwise rank behind every hit of the first.
// k, vectorWeight and keywordWeight are sourced from retrievalCfg (with defaults).
// The merged results are sorted by RRF score descending.
func fuseWithRRF(
	ctx context.Context, vectorLists, keywordLists [][]*types.IndexWithScore, retrievalCfg *types.RetrievalConfig,
) []*types.IndexWithScore {
	rrfK := retrievalCfg.GetEffectiveRRFK()
	vectorWeight, keywordWeight := retrievalCfg.GetEffectiveRRFWeights()
	maxRRF := (vectorWeight + keywordWeight) / float64(rrfK+1)
```

</details>

#### 缺口

- 没有当前语料上各融合策略的留出对照
  **影响**：不能推断召回率、答案正确率或跨库概率校准
  **进一步探讨**：固定语料与题集比较向量、关键词、混合三组，记录最弱类别和引用正确率。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 团队怎样承担部署、维护和失败恢复责任？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

部署需要服务、数据库/索引、文件存储和模型配置；可替换后端提供灵活性，也要求明确选择并维护每条链路。README 的 compose pull/up 默认可能取最新镜像，源码固定提交研究不能自动当作该镜像的验收；升级要固定 WEKNORA_VERSION 并核对前后端一致。首次代价包括部署、资料清洗、索引和权限验收，持续代价包括 embedding、问答模型、备份与引用复核，失败恢复要检查索引与源文档一致及模型维度变更是否重建。所有金额、耗时和合格任务数未知，不计算ROI。试用以非敏感代表语料限定权限，核对未授权库拒绝、引用正确与备份恢复，再比较文件搜索；如果权限或引用不符，停止扩展并回到直接资料检索。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:63-65](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/README.md#L63-L65)

作者声明可替换模型、存储与私有部署。

```text
- **Models**: 29 built-in vendors with a generated model catalog, including OpenAI, DeepSeek, Qwen (Alibaba Cloud), Zhipu, Hunyuan, Gemini, MiniMax, NVIDIA, LiteLLM and Ollama.
- **Permissions and operations**: multi-workspace RBAC (four roles, per-resource ownership, per-workspace audit log), several storage instances per workspace, a runtime task-queue dashboard with worker-pool governance, and Langfuse tracing for agent steps, token usage and pipelines.
- **Deployment**: LLMs, vector databases and storage backends are all swappable. Deploy locally or on a private cloud and keep the data in your own environment.
```

**依据 2 · 作者声明**：[README.md:99-104](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/README.md#L99-L104)

compose默认拉取和启动。

````text
```bash
git clone https://github.com/Tencent/WeKnora.git
cd WeKnora
cp .env.example .env    # Edit .env as needed, see comments in the file
docker compose pull     # Pull the latest images
docker compose up -d    # Start core services
````

**依据 3 · 作者声明**：[README.md:137-147](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/README.md#L137-L147)

版本固定和升级一致性提醒。

<details>
<summary>查看原文（11行）</summary>

````text

If you already have WeKnora running and downloaded a newer release:

```bash
# Set WEKNORA_VERSION in .env to the target release (e.g. 0.8.3), or keep latest
docker compose pull     # Pull images matching WEKNORA_VERSION
docker compose up -d    # Recreate containers with new images
```

> [!NOTE]
> `docker compose up -d` alone reuses locally cached images and may leave the UI version out of sync with the release you downloaded. Read the [upgrade notes](https://weknora.weixin.qq.com/docs/07-releases/v0.8.3#upgrade-notes) before upgrading. Deployments older than v0.8.2 should also read the [v0.8.2 notes](https://weknora.weixin.qq.com/docs/07-releases/v0.8.2#upgrade-notes).
````

</details>

**依据 4 · 源码核查**：[internal/application/service/knowledgebase_search.go:61-76](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/application/service/knowledgebase_search.go#L61-L76)

维度错误提示重建索引。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

#### 缺口

- 未部署当前固定版本，未核对费用、恢复时间和权限动态结果
  **影响**：不足以建议持续生产采用
  **进一步探讨**：固定镜像/源码版本执行非敏感测试，计入全部模型、重试、人工复核和恢复成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可配置融合如何转为有证据的适应性改进？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是按知识库资料类型和查询结构选择融合权重，而不是给全部任务一套全局权重。推导来自现有融合将关键词精确匹配与向量语义排名分开，且多列表量纲差异不能由归一解决。最小验证对照固定默认权重、人工分类型权重和单检索，在不用于调参的题集上统计每类引用正确率、召回及最差退化类别，同时计入调参人工成本。若只在调参题上提高、最弱类别恶化或净维护负担更高，则否定优势。现有 retrievalCfg 可提供参数，不等于已经实现自动学习或证明分类型需求。

#### 证据与依据

**依据 1 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:156-175](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/internal/application/service/knowledgebase_search_fusion.go#L156-L175)

融合参数从配置读取，为候选实验提供基础。

<details>
<summary>查看原文（20行）</summary>

```text
// fuseWithRRF merges vector and keyword retrieval results using Reciprocal Rank Fusion.
// RRF score = vectorWeight/(k+vectorRank) + keywordWeight/(k+keywordRank),
// divided by its maximum (vectorWeight+keywordWeight)/(k+1) so it lands in
// [0, 1] like the single-retriever paths. Raw RRF tops out near 0.016, which
// made hybrid hits lose to any vector-only or keyword-only result they were
// ranked against and left rerank's base-score term and MMR's relevance term
// with nothing to work with.
//
// A chunk's rank for a retriever is its best position in any one list of
// that retriever, each list ordered by its own score. Positions in the
// concatenation of several lists are arbitrary: the second list's best hit
// would otherwise rank behind every hit of the first.
// k, vectorWeight and keywordWeight are sourced from retrievalCfg (with defaults).
// The merged results are sorted by RRF score descending.
func fuseWithRRF(
	ctx context.Context, vectorLists, keywordLists [][]*types.IndexWithScore, retrievalCfg *types.RetrievalConfig,
) []*types.IndexWithScore {
	rrfK := retrievalCfg.GetEffectiveRRFK()
	vectorWeight, keywordWeight := retrievalCfg.GetEffectiveRRFWeights()
	maxRRF := (vectorWeight + keywordWeight) / float64(rrfK+1)
```

</details>

#### 缺口

- 分类型策略、泛化与维护收益没有实现或实测
  **影响**：只能作为后续实验假设
  **进一步探讨**：先用用户真实问题标注类型，再做留出集和维护成本对照。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
