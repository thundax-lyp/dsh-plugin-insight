# WeKnora 知识平台

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[80e8345](https://github.com/Tencent/WeKnora/tree/80e8345903ce4af970497de8359b8b4ea4ce4917)

<!-- BEGIN META -->
[![GitHub ★ 36,141](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C141&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora)
<!-- END META -->

> **功能**：集中管理组织知识库，提供检索问答、Agent 与 wiki 能力。

> **亮点**：将知识库权限、跨库向量空间与多个检索结果的融合接线组织在一起；模型、数据库和 RRF 本身不属于该项目原创。[Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：权限检查和分数归一能否在目标语料、角色和服务故障下产生正确且可追溯的回答？归一分数不是相关性概率，无可检索管线时空结果也不证明资料不存在。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 平台为谁提供什么，和 DSH 适配包、简单检索有什么区别？](#detail-section-11)
  - [Q02 · 请求如何经过授权到跨库混合检索？](#detail-section-12)
  - [Q03 · 向量空间、融合分数和失败路径能证明什么？](#detail-section-13)
  - [Q04 · 部署、治理、恢复和退出成本是什么？](#detail-section-14)
  - [Q05 · 融合配置有什么可证伪改进假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护组织资料并按角色查找知识的团队需要把资料、权限和可核查回答连接；根项目是知识平台而非 DSH 原生插件。[Q01](#research-q01)

文件搜索或自建文档解析、向量库和权限服务可完成部分任务；平台将这些环节接入同一服务，准确率及成本仍需对照。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 知识库 | 管理组织资料 | 需配置身份和存储 |
| 混合检索 | 向量和关键词结果融合 | 权限、模型空间及质量需核验 |
| Agent/wiki | 作者描述基于同一知识库运行 | 本次未全链审计 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 平台服务、存储和数据库 | 自托管需要 | 文档、权限和索引 | 无法假定部署可用 |
| embedding 与问答模型 | 对应检索和生成路径需要 | 构建向量和回答 | 停用路径并核对配置 |
| 身份与库授权 | 业务必需 | 限定访问范围 | 不接入敏感语料 |
| 备份及恢复方案 | 持续运维需要 | 保留原件及重建索引 | 暂缓生产使用 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 部署 | 管理员固定发行物、依赖和模型 | 验证存储与网络 |
| 导入 | 清理匿名资料并设两种角色 | 保留原件与权限映射 |
| 查询 | 各角色查同一问题并核对引用 | 未授权结果立即停止自动答复 |
| 恢复 | 运维测试备份、模型及索引重建 | 状态不明回退人工搜索 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 数据库、索引、存储与模型未知 | 部署、清洗和权限配置 | 环境未测 |
| 持续 | embedding 和回答调用未知 | 维护资料并复核引用 | 单位成本未知 |
| 恢复 | 重建与备份资源未知 | 核对原件与索引 | 真实恢复率未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多库授权 | 路由和候选阶段有权限检查 | 实际跨租户一致性 |
| 检索融合 | 分支、权重及 RRF 排序 | 召回质量或答案正确率 |

> **思考**：权限检查和分数归一能否在目标语料、角色和服务故障下产生正确且可追溯的回答？归一分数不是相关性概率，无可检索管线时空结果也不证明资料不存在。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将知识库权限、跨库向量空间与多个检索结果的融合接线组织在一起；模型、数据库和 RRF 本身不属于该项目原创。[Q02](#research-q02) [Q03](#research-q03)

按库批量校验权限和模型空间、重用查询向量，检索失败传递；模型键回退及未配置维度有边界，归一化不代表概率校准。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

权限检查和分数归一能否在目标语料、角色和服务故障下产生正确且可追溯的回答？归一分数不是相关性概率，无可检索管线时空结果也不证明资料不存在。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先以非敏感语料和两个角色核验拒绝、引用与恢复，再对照现有搜索；出现越权或状态不明时停用自动答复。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持目标路由、候选层授权和融合代表路径；未经固定版本部署、模型或真实权限及恢复实验。

- 已检查：作者 README、包清单、源码路径 README.md、internal/router/routes_knowledge.go、internal/handler/knowledgebase.go、internal/application/service/knowledgebase_search.go、internal/application/service/knowledgebase_search_fusion.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根仓 inventory 覆盖允许的 Markdown 和 JS/TS 文件；静态抽读 README、路由、handler 和混合检索及融合 Go blob，未全面审计 Agent、wiki、各检索器或运行环境。
- 下一步：隔离部署按租户和角色验证读拒绝、跨库 ID、维度漂移及索引恢复，并以带标签留出集测召回、引用与成本。

**分析版本**

- **仓库**：[Tencent/WeKnora](https://github.com/Tencent/WeKnora)
- **版本号**：未声明（[固定提交 80e8345](https://github.com/Tencent/WeKnora/tree/80e8345903ce4af970497de8359b8b4ea4ce4917)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

假设按审核过的资料类型与查询结构选择权重并记录策略版本，可改善弱类召回；对照默认权重及单检索，在留出集检查最差类别、引用和人工成本，无改善或越权即否定。[Q05](#research-q05)

隔离部署按租户和角色验证读拒绝、跨库 ID、维度漂移及索引恢复，并以带标签留出集测召回、引用与成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 155 | 38436 | — | — | 505447 |
| .mjs | source | 30 | 3588 | 3252 | 145 | — |
| .mjs | test | 85 | 9528 | 8332 | 399 | — |
| .md | example | 4 | 261 | — | — | 1100 |
| .ts | test | 259 | 33901 | 30491 | 939 | — |
| .js | source | 18 | 2330 | 2027 | 108 | — |
| .ts | source | 359 | 109568 | 98320 | 6864 | — |
| .md | test | 1 | 66 | — | — | 544 |
| .js | test | 1 | 254 | 227 | 10 | — |
| .mts | source | 1 | 221 | 191 | 6 | — |
| .tsx | source | 10 | 988 | 935 | 26 | — |

</details>

**活跃度**

[![Issue 未关闭 423](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=423&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 311](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=311&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 237](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=237&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：组织知识平台如何将授权、跨库嵌入与检索融合接到实际请求，质量和恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 平台为谁提供什么，和 DSH 适配包、简单检索有什么区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

WeKnora 根仓是组织知识平台而非 DSH 原生插件。需要持续整理资料并按权限检索的团队，可在同一服务维护知识库，并在 RAG、Agent 或 wiki 流程中使用；合格结果须能返回有权限的相关资料并核对来源。相对文件搜索或自行组装模型、索引和鉴权，平台提供一体化部署和多库检索接线；检索算法、模型与数据库是依赖，不应归为独创。README 的跨渠道、组织权限和运行效果是作者主张，实际准确率、使用频率及净节时未做对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-49](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/README.md#L41-L49)

作者描述组织文档、RAG、Agent 和 wiki。

```text
## Overview

[WeKnora](https://weknora.weixin.qq.com) is an open-source, LLM-powered knowledge framework for enterprise document understanding, semantic retrieval and reasoning. It brings a team's documents together so they can be searched, reasoned over and kept up to date.

https://github.com/user-attachments/assets/de0e490a-e738-405e-bb3a-64b63edd7278

<p align="center"><sub>v0.9.0 · 2:45 · 1080p60 · English narration and subtitles</sub></p>

Use RAG to look things up, the agent for multi-step tasks, and the wiki to organize knowledge. All three work on the same knowledge bases.
```

**依据 2 · 作者声明**：[README.md:58-65](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/README.md#L58-L65)

作者列出数据源、权限及部署方式。

```text
Beyond the three modes:

- **Memory and curation**: cross-session long-term memory keeps the profile, preferences and facts a user has confirmed. Folder uploads keep their directory tree, and retrieval chunks can be edited, diffed and rolled back.
- **Data sources and formats**: auto-sync from Feishu wiki / Feishu Drive / Confluence / GitLab / Tencent IMA / Notion / Yuque / DingTalk Docs / Seafile / RSS, with more on the way. 10+ document formats including PDF, Word, images, Excel and XMind; Office files are parsed in-process by anydoc.
- **Channels and integrations**: Q&A in WeCom, Feishu, Slack, Telegram and other IM apps; an embed widget for external websites; a built-in MCP Server for Cursor, Claude and other AI tools; scoped API keys with a principal model for programmatic access.
- **Models**: 29 built-in vendors with a generated model catalog, including OpenAI, DeepSeek, Qwen (Alibaba Cloud), Zhipu, Hunyuan, Gemini, MiniMax, NVIDIA, LiteLLM and Ollama.
- **Permissions and operations**: multi-workspace RBAC (four roles, per-resource ownership, per-workspace audit log), several storage instances per workspace, a runtime task-queue dashboard with worker-pool governance, and Langfuse tracing for agent steps, token usage and pipelines.
- **Deployment**: LLMs, vector databases and storage backends are all swappable. Deploy locally or on a private cloud and keep the data in your own environment.
```

#### 缺口

- 真实用户任务、质量及人工成本无对照
  **影响**：不能断言比文件搜索或现有 RAG 更经济
  **进一步探讨**：对同一语料、角色和问题比较合格率与全流程成本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求如何经过授权到跨库混合检索？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

知识库 hybrid-search 路由置于 API key 检索能力门下，并为 JWT 侧接 Viewer 与指定库读取校验；handler 对目标库进行校验、限制请求体并检查查询文本或预计算向量，再按 rerank 参数选择服务分支。普通 HybridSearch 的候选阶段先批量取得指定知识库，逐库调用 authorizeKBAccess，再校验嵌入模型一致性；找不到指定主库返回未找到，不回退到任意其他库。之后在需要时计算一次查询向量，按存储和租户分组执行检索并融合。源码提供代表请求与逐库检查证据，不证明其他入口、所有租户及外部服务均可靠。

#### 证据与依据

**依据 1 · 源码核查**：[internal/router/routes_knowledge.go:224-228](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/router/routes_knowledge.go#L224-L228)

知识库 API key 检索能力门。

```text
	// 空 allow-list 的 key 则是全租户 KB 管理、新建天然在范围内。KB 内容写入（文档/
	// 分块/FAQ/Tag/Wiki）由对应子路由的 ingest 能力控制，不在本组。
	kbgrp := r.Group("/knowledge-bases")
	kb := g.apiKeyGroup(kbgrp, apiKeyRetrieve(apiKeyFullAccess()))
	kbManagement := kb.With(apiKeyManageKnowledgeBases(apiKeyFullAccess()))
```

**依据 2 · 源码核查**：[internal/router/routes_knowledge.go:257-261](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/router/routes_knowledge.go#L257-L261)

混合检索路由的角色与库读权限。

```text
		kb.PUT("/:id/pin", g.Viewer(), g.KBAccessRead("id"), handler.TogglePinKnowledgeBase)
		// 混合搜索 — Viewer+ 且对 KB 有 read 权限 (read-only)
		// POST is preferred; GET with JSON body is kept for backward compatibility (#1727).
		kb.POST("/:id/hybrid-search", g.Viewer(), g.KBAccessRead("id"), handler.HybridSearch)
		kb.GET("/:id/hybrid-search", g.Viewer(), g.KBAccessRead("id"), handler.HybridSearch)
```

**依据 3 · 源码核查**：[internal/handler/knowledgebase.go:373-405](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/handler/knowledgebase.go#L373-L405)

目标库、请求和输入校验。

<details>
<summary>查看原文（33行）</summary>

```text
func (h *KnowledgeBaseHandler) HybridSearch(c *gin.Context) {
	ctx := c.Request.Context()

	logger.Info(ctx, "Start hybrid search")

	// Validate and check permission for knowledge base access
	_, id, effectiveTenantID, _, err := h.validateAndGetKnowledgeBase(c)
	if err != nil {
		c.Error(err)
		return
	}

	// Parse request body
	limitJSONBody(c, hybridSearchJSONMaxBytes)
	var req types.SearchParams
	if err := c.ShouldBindJSON(&req); err != nil {
		if isRequestBodyTooLarge(err) {
			_ = c.Error(apperrors.NewBadRequestError("request body is too large"))
			return
		}
		logger.Error(ctx, "Failed to parse request parameters", err)
		c.Error(apperrors.NewBadRequestError("Invalid request parameters").WithDetails(err.Error()))
		return
	}
	precomputedVectorOnly := len(req.QueryEmbedding) > 0 && req.DisableKeywordsMatch && !req.DisableVectorMatch
	if strings.TrimSpace(req.QueryText) == "" && !precomputedVectorOnly {
		_ = c.Error(apperrors.NewBadRequestError("query_text is required"))
		return
	}
	if err := req.Rerank.Validate(); err != nil {
		_ = c.Error(apperrors.NewBadRequestError(err.Error()))
		return
	}
```

</details>

**依据 4 · 源码核查**：[internal/handler/knowledgebase.go:423-445](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/handler/knowledgebase.go#L423-L445)

rerank 与普通服务分支及错误传递。

<details>
<summary>查看原文（23行）</summary>

```text
	// Execute hybrid search. Without a rerank object this is the raw recall
	// primitive it has always been; with one, the response carries meta.
	// Note: For shared KBs, the service uses effectiveTenantID internally via context
	var retrieval *types.RetrievalResult
	if req.Rerank != nil {
		retrieval, err = h.service.HybridSearchWithRerank(c.Request.Context(), id, req)
	} else {
		var results []*types.SearchResult
		results, err = h.service.HybridSearch(c.Request.Context(), id, req)
		retrieval = &types.RetrievalResult{Results: results}
	}
	if err != nil {
		// Service-layer typed AppErrors (e.g. ErrVectorStoreBindingInvalid,
		// ErrVectorStoreUnavailable, BadRequest from multi-store fan-out)
		// must reach the client with their original code rather than be
		// downgraded to InternalServerError. Mirrors the pattern used in
		// CreateKnowledgeBase.
		if appErr, ok := apperrors.IsAppError(err); ok {
			c.Error(appErr)
			return
		}
		logger.ErrorWithFields(ctx, err, nil)
		c.Error(apperrors.NewInternalServerError(err.Error()))
```

</details>

**依据 5 · 源码核查**：[internal/application/service/knowledgebase_search.go:212-270](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search.go#L212-L270)

批量读取、逐库授权、模型一致性和主库检查。

<details>
<summary>查看原文（59行）</summary>

```text
func (s *knowledgeBaseService) hybridSearchCandidates(ctx context.Context,
	id string,
	params types.SearchParams,
) ([]*types.IndexWithScore, error) {
	// Determine the set of KB IDs to search.
	searchKBIDs := params.KnowledgeBaseIDs
	if len(searchKBIDs) == 0 {
		searchKBIDs = []string{id}
	}

	// QueryText is user-controlled; sanitize before logging to prevent
	// CR/LF/tab log injection. Matches the handler-layer sanitization at
	// handler/knowledgebase.go.
	logger.Infof(ctx, "Hybrid search parameters, knowledge base IDs: %v, query text: %s",
		searchKBIDs, secutils.SanitizeForLog(params.QueryText))

	tenantInfo, _ := types.TenantInfoFromContext(ctx)

	// Batch-load every KB in scope. Required for store grouping,
	// embedding-model consistency validation, and FAQ type detection.
	// GetKnowledgeBaseByIDs is intentionally tenant-agnostic at the
	// repository layer so that Organization-shared KBs (owned by a
	// different tenant) can be loaded here; authorization for each
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
```

</details>

**依据 6 · 源码核查**：[internal/application/service/knowledgebase_search.go:281-304](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search.go#L281-L304)

按条件仅计算一次查询向量。

<details>
<summary>查看原文（24行）</summary>

```text
	// Compute the query embedding once before fan-out and propagate via
	// params.QueryEmbedding. Without this, each storeGroup's
	// buildRetrievalParams would re-embed the same query text — for N
	// stores that means N API calls of identical input.
	//
	// Skip when params already carries an embedding (e.g. the agent
	// pre-computed it) or when the primary KB has no vector indexing
	// configured.
	embeddingKB := kb
	if !hasEmbeddingModel(embeddingKB) {
		embeddingKB = nil
		for _, candidate := range kbs {
			if hasEmbeddingModel(candidate) {
				embeddingKB = candidate
				break
			}
		}
	}
	if len(params.QueryEmbedding) == 0 && embeddingKB != nil && !params.DisableVectorMatch {
		emb, embErr := s.GetQueryEmbedding(ctx, embeddingKB.ID, params.QueryText)
		if embErr != nil {
			return nil, embErr
		}
		params.QueryEmbedding = emb
```

</details>

**依据 7 · 源码核查**：[internal/application/service/knowledgebase_search.go:307-318](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search.go#L307-L318)

按存储分组，无可检索管线时返回空。

<details>
<summary>查看原文（12行）</summary>

```text
	// Group KBs by (storeID, owner tenant), resolve the bound engine for
	// each group, and build the per-group base RetrieveParams once.
	groups, err := s.resolveStoreGroups(ctx, kb, kbs, params, matchCount)
	if err != nil {
		return nil, err
	}
	if len(groups) == 0 || allBaseParamsEmpty(groups) {
		// Wiki-only / graph-only fan-out: every KB is non-retrievable.
		// Preserve the existing "return empty rather than error" contract
		// so agent tools that combine multiple KB scopes degrade gracefully.
		logger.Infof(ctx, "No retrievable indexing pipelines across %d KBs", len(kbs))
		return nil, nil
```

</details>

#### 缺口

- 所有调用入口、鉴权实现和租户配置未端到端测试
  **影响**：不能由入口和函数调用推断所有跨租户访问安全
  **进一步探讨**：隔离多租户用授权、拒绝、撤销和额外 KB ID 测试

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 向量空间、融合分数和失败路径能证明什么？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

模型解析以名称、端点和配置维度形成跨库空间键；解析失败时回退模型 ID，因此不能把键当成完整模型权重或版本身份。查询向量维度与配置不匹配且预期大于零时返回带重建提示的错误；模型为空、向量长度为零或预期未配置时该函数不报错。单向量结果保留原分，单关键词按各列表最大分缩放超出 1 的分数；混合结果对每条结果各检索类型取最佳列表排名，以可配置权重和 K 做 RRF 再除最大可能值。归一和排序解决数值口径，不是相关性概率校准或答案正确性证明。无可检索管线的 wiki/graph 情况返回空，不能从空结果推断资料不存在。

#### 证据与依据

**依据 1 · 源码核查**：[internal/application/service/knowledgebase_search.go:109-130](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search.go#L109-L130)

维度校验及不校验条件。

<details>
<summary>查看原文（22行）</summary>

```text
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

**依据 2 · 源码核查**：[internal/application/service/knowledgebase_search.go:132-165](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search.go#L132-L165)

模型空间键与解析失败回退。

<details>
<summary>查看原文（34行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[internal/application/service/knowledgebase_search.go:307-318](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search.go#L307-L318)

无可检索管线返回空。

<details>
<summary>查看原文（12行）</summary>

```text
	// Group KBs by (storeID, owner tenant), resolve the bound engine for
	// each group, and build the per-group base RetrieveParams once.
	groups, err := s.resolveStoreGroups(ctx, kb, kbs, params, matchCount)
	if err != nil {
		return nil, err
	}
	if len(groups) == 0 || allBaseParamsEmpty(groups) {
		// Wiki-only / graph-only fan-out: every KB is non-retrievable.
		// Preserve the existing "return empty rather than error" contract
		// so agent tools that combine multiple KB scopes degrade gracefully.
		logger.Infof(ctx, "No retrievable indexing pipelines across %d KBs", len(kbs))
		return nil, nil
```

</details>

**依据 4 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:47-83](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search_fusion.go#L47-L83)

单检索与混合融合各分支。

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

**依据 5 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:125-151](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search_fusion.go#L125-L151)

单列表超范围分数缩放。

<details>
<summary>查看原文（27行）</summary>

```text
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

**依据 6 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:156-175](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search_fusion.go#L156-L175)

RRF 及权重归一。

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

**依据 7 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:177-206](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search_fusion.go#L177-L206)

按 chunk 最佳排名合并并排序。

<details>
<summary>查看原文（30行）</summary>

```text
	vectorRanks := bestRanks(vectorLists)
	keywordRanks := bestRanks(keywordLists)

	// Collect all unique chunks — prefer vector result's metadata for each chunk
	chunkInfoMap := make(map[string]*types.IndexWithScore)
	for _, r := range flattenLists(vectorLists) {
		if existing, exists := chunkInfoMap[r.ChunkID]; !exists || r.Score > existing.Score {
			chunkInfoMap[r.ChunkID] = r
		}
	}
	for _, r := range flattenLists(keywordLists) {
		if _, exists := chunkInfoMap[r.ChunkID]; !exists {
			chunkInfoMap[r.ChunkID] = r
		}
	}

	// Compute weighted RRF scores and assign to each chunk
	result := make([]*types.IndexWithScore, 0, len(chunkInfoMap))
	for chunkID, info := range chunkInfoMap {
		rrfScore := 0.0
		if rank, ok := vectorRanks[chunkID]; ok {
			rrfScore += vectorWeight / float64(rrfK+rank)
		}
		if rank, ok := keywordRanks[chunkID]; ok {
			rrfScore += keywordWeight / float64(rrfK+rank)
		}
		info.Score = rrfScore / maxRRF
		result = append(result, info)
	}
	slices.SortFunc(result, sortByScoreDesc)
```

</details>

#### 缺口

- 语料、模型配置、FAQ 阈值及查询质量未实测
  **影响**：无法宣称召回更好、分数可信概率或空结果即无资料
  **进一步探讨**：针对多来源和不同模型，以有标签问题集测召回、引用和误授权

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、治理、恢复和退出成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

自托管作者路径依赖 Docker、Compose 和 Git，还需配置模型、数据库、索引与网络；文档列出多种部署方式，不能把代码版本等同部署中的镜像或外部服务。管理员需清理资料、限定知识库角色并维护模型空间；日常还需检查引用、模型与调用费用，故障时核对原件、向量索引与备份，再判断重建。固定源码对指定资源入口有授权保护，但真实备份、迁移和外部服务并未验证。具备运维能力的团队可用非敏感资料、小规模角色和既有检索方案作试点；越权、错误引用或恢复不明时停用自动答复并回退人工检索。部署和单位合格问答成本未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:87-97](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/README.md#L87-L97)

作者描述自托管和 Docker 依赖。

<details>
<summary>查看原文（11行）</summary>

```text
      <sub>SELF-HOSTED</sub><br/>
      <b>Your own environment</b><br/>
      Deploy with Docker or Kubernetes and configure models, storage and networking yourself.<br/><br/>
      <a href="#run-with-docker-compose">Run with Docker Compose ↓</a>
    </td>
  </tr>
</table>

### Run with Docker Compose

Requires [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/) and [Git](https://git-scm.com/).
```

</details>

**依据 2 · 作者声明**：[README.md:58-65](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/README.md#L58-L65)

作者描述权限、可替换模型和存储。

```text
Beyond the three modes:

- **Memory and curation**: cross-session long-term memory keeps the profile, preferences and facts a user has confirmed. Folder uploads keep their directory tree, and retrieval chunks can be edited, diffed and rolled back.
- **Data sources and formats**: auto-sync from Feishu wiki / Feishu Drive / Confluence / GitLab / Tencent IMA / Notion / Yuque / DingTalk Docs / Seafile / RSS, with more on the way. 10+ document formats including PDF, Word, images, Excel and XMind; Office files are parsed in-process by anydoc.
- **Channels and integrations**: Q&A in WeCom, Feishu, Slack, Telegram and other IM apps; an embed widget for external websites; a built-in MCP Server for Cursor, Claude and other AI tools; scoped API keys with a principal model for programmatic access.
- **Models**: 29 built-in vendors with a generated model catalog, including OpenAI, DeepSeek, Qwen (Alibaba Cloud), Zhipu, Hunyuan, Gemini, MiniMax, NVIDIA, LiteLLM and Ollama.
- **Permissions and operations**: multi-workspace RBAC (four roles, per-resource ownership, per-workspace audit log), several storage instances per workspace, a runtime task-queue dashboard with worker-pool governance, and Langfuse tracing for agent steps, token usage and pipelines.
- **Deployment**: LLMs, vector databases and storage backends are all swappable. Deploy locally or on a private cloud and keep the data in your own environment.
```

**依据 3 · 源码核查**：[internal/application/service/knowledgebase_search.go:109-128](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search.go#L109-L128)

维度不匹配提示检查与重建。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[internal/handler/knowledgebase.go:423-445](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/handler/knowledgebase.go#L423-L445)

服务错误返回边界。

<details>
<summary>查看原文（23行）</summary>

```text
	// Execute hybrid search. Without a rerank object this is the raw recall
	// primitive it has always been; with one, the response carries meta.
	// Note: For shared KBs, the service uses effectiveTenantID internally via context
	var retrieval *types.RetrievalResult
	if req.Rerank != nil {
		retrieval, err = h.service.HybridSearchWithRerank(c.Request.Context(), id, req)
	} else {
		var results []*types.SearchResult
		results, err = h.service.HybridSearch(c.Request.Context(), id, req)
		retrieval = &types.RetrievalResult{Results: results}
	}
	if err != nil {
		// Service-layer typed AppErrors (e.g. ErrVectorStoreBindingInvalid,
		// ErrVectorStoreUnavailable, BadRequest from multi-store fan-out)
		// must reach the client with their original code rather than be
		// downgraded to InternalServerError. Mirrors the pattern used in
		// CreateKnowledgeBase.
		if appErr, ok := apperrors.IsAppError(err); ok {
			c.Error(appErr)
			return
		}
		logger.ErrorWithFields(ctx, err, nil)
		c.Error(apperrors.NewInternalServerError(err.Error()))
```

</details>

#### 缺口

- 未部署固定版本、测恢复或核对外部服务费用
  **影响**：无法证明成本及灾难恢复能力
  **进一步探讨**：隔离数据验证备份、恢复、撤权与目标供应商账单

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 融合配置有什么可证伪改进假设？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有融合已使用 retrievalCfg 的向量/关键词权重和 RRF K，单检索有不同的保分或缩放分支；自动按问题与文档类别调权不能当成已实现。可提出未验证假设：依据已审核的资料类型和查询结构，选择预先评估过的权重，并在每次结果记录策略版本及回退原因，相比统一默认配置可能改善弱类召回和可解释性。应在留出问题集、相同角色和模型下，对照默认权重、单向量与单关键词，测每类召回、引用正确、最差类别、延迟与人工调参；仅训练集提升、弱类别明显恶化、授权结果变化或维护成本超过收益则否定。

#### 证据与依据

**依据 1 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:47-83](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search_fusion.go#L47-L83)

现有分支和规范化。

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

**依据 2 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:156-175](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search_fusion.go#L156-L175)

现有权重和 RRF K 来自配置。

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

**依据 3 · 源码核查**：[internal/application/service/knowledgebase_search.go:369-373](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search.go#L369-L373)

从租户配置读取融合参数。

```text
	var retrievalCfg *types.RetrievalConfig
	if tenantInfo != nil {
		retrievalCfg = tenantInfo.RetrievalConfig
	}
	deduplicatedChunks := fuseOrDeduplicate(ctx, vectorLists, keywordLists, retrievalCfg)
```

#### 缺口

- 缺少自动策略、带标签数据集与对照实验
  **影响**：无法断言改善质量或经济性
  **进一步探讨**：固定语料和隔离角色，比较留出集与最差类别

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
