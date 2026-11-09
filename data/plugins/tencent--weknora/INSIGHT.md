# WeKnora

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[e3fb233](https://github.com/Tencent/WeKnora/tree/e3fb2335bf3f8cadd32142380c60b2677a27bf99)

<!-- BEGIN META -->
[![GitHub ★ 36,771](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C771&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora)
<!-- END META -->

> **功能**：面向团队文档的知识服务，提供检索问答、Agent 推理和 Wiki 管理。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持的贡献是把按知识库划定范围、混合检索、流式问答和复核资料组织成连续流程。归并知识库的权限与嵌入空间、提供回答前的引用事件，都是对索引和模型的组织工作。向量模型、关键词检索和排名融合算法本身已有独立来源。

> **主要限制**：[Q03](#research-q03) 自带配置允许在检索无结果后调用模型生成兜底答复，候选引用又在生成前发出。若把正常结束或出现引用当作答复有据的验收条件，就可能把没检索到支持材料的答案送入业务流程。按角色验证范围，逐条核对关键事实与引用原文。

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
  - [Q01 · 谁需要这套知识问答底座，实际交付比直接问模型多了什么？](#detail-section-11)
  - [Q02 · 一次资料问答如何从真实路由到检索、重排和流式回答？](#detail-section-12)
  - [Q03 · 搜索范围和引用能否承担隔离及事实核验？](#detail-section-13)
  - [Q04 · 部署、导入、持续问答与恢复分别需要什么？](#detail-section-14)
  - [Q05 · 如何用小范围试用判断是否值得维护该系统？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常基于同一套内部手册回答问题的团队，需要限定可搜索的资料范围，并把答复和可复核的原文线索一起交给审核者。[Q01](#research-q01)

人工可先在共享资料目录搜关键词，再确认版本并引用原文。直接把已知文件交给模型可简化偶发问答，但资料选择和访问边界由使用者负责。已有同类索引服务的团队应以相同语料、角色和答复验收标准比较。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 独立知识检索 | 按库和文档范围找候选片段 | 需要实际授权和可检索索引 |
| 流式知识问答 | 在同一会话获取回复和检索引用 | 需要问答模型，是否检索取决于范围和配置 |
| 候选重排 | 过滤或调整检索片段顺序 | 无重排模型或请求失败时可继续使用已有候选 |
| 异步文件导入 | 上传文件并安排后台切块、索引 | 返回文件记录后仍要检查处理状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 默认 Compose 的 App、Redis、PostgreSQL、docreader | 此部署路径需要 | 启动应用、持久化、排队及文档解析 | 先核对容器和健康检查，暂不导入资料 |
| Web 容器 | Web 试用需要 | 连接 App 的用户入口 | 可改为单独验收 API，不沿用 Web 体验结论 |
| 有检索能力的库及配套嵌入模型 | 向量问答需要 | 对资料和查询建立相容的向量表示 | 核对是否有关键词分支，保留无结果或错误 |
| 问答模型 | 生成需要 | 按上下文产生回复 | 保留检索和人工答复 |
| 重排模型 | 按配置选用 | 调整检索候选顺序 | 核对日志和实际排序，重排不可用时可走已有候选 |
| 授权角色与非敏感试用资料 | 本轮建议的业务前提 | 逐库约束访问并验证来源 | 出现越权或资料出站边界不明即停止试用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 固定版本与后端 | 运维核实镜像与配置版本，设置数据库、存储和模型接入 | 核对配置与健康检查，查清启动失败项 |
| 导入并验收索引 | 资料管理员上传小批资料并查看处理状态 | 查到已知片段，再开放给测试账号 |
| 用两种角色问答 | 答疑人员按资料范围提问并点击引用 | 能回到获授权的原文，依据不足转人工 |
| 保留退出路径 | 运维保管原件及必要备份，确认恢复流程 | 恢复后重查代表问题，失败时回原有资料系统 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 应用、数据库、队列、解析和索引算力 | 配置、清洗资料、授权及核对索引 | 环境和用时未知 |
| 持续使用 | 存储、嵌入和问答调用，按配置另计重排与追踪 | 更新资料、跟踪失败及核查关键引用 | 模型价格、调用量及负荷未测 |
| 失败恢复 | 重试、重建索引和备份空间 | 对照文件、任务及检索结果，核对哪些资料可用 | 入队失败可返回已保存记录，实际恢复时间未知 |
| 升级或退出 | 备份与迁移期间资源 | 演练还原或重建索引，保留手工查阅路径 | 迁移兼容和数据损失范围未测 |

以审核通过且能追溯原文的一次答复为单位，分别记录现金支出和人工时长。把失败、兜底、重试和复核计入总投入，并单列合格答复数与失败率。[Q04](#research-q04)

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 权限内取材 | 会话所有权和目标库访问各有服务端检查 | 实际跨租户、撤权和引用跳转一致性 |
| 给答疑提供出处 | 对有合并结果的问答发候选引用 | 引用是否覆盖每个关键判断 |
| 失败可区分 | 源码分别处理取消、异常、无结果和兜底 | 目标环境的错误率和误答比例 |
| 复用资料问答流程 | 索引、问答、引用输出已接线 | 相对人工流程能省多少操作和复核 |

> **思考**：[Q03](#research-q03) 自带配置允许在检索无结果后调用模型生成兜底答复，候选引用又在生成前发出。若把正常结束或出现引用当作答复有据的验收条件，就可能把没检索到支持材料的答案送入业务流程。按角色验证范围，逐条核对关键事实与引用原文。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持的贡献是把按知识库划定范围、混合检索、流式问答和复核资料组织成连续流程。归并知识库的权限与嵌入空间、提供回答前的引用事件，都是对索引和模型的组织工作。向量模型、关键词检索和排名融合算法本身已有独立来源。

[Q02](#research-q02) 可复用的是以知识库目标、向量空间和角色约束组织查询，再在流式生成前单独发候选引用。移植时须一起移交调用方身份、会话归属和库授权语义。单测和统计不提供真实可用性。根仓 inventory 统计 Markdown 和 JS/TS，分析重点是服务端 Go、配置及部署接线，Go 规模不纳入该表。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 自带配置允许在检索无结果后调用模型生成兜底答复，候选引用又在生成前发出。若把正常结束或出现引用当作答复有据的验收条件，就可能把没检索到支持材料的答案送入业务流程。按角色验证范围，逐条核对关键事实与引用原文。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先取十几条含正例、无依据和越权哨兵的手册问题，关闭网络检索，确认模型和资料的权限边界。用固定兜底、原文复核和人工查阅基线比一轮，出现越权或关键事实无法溯源时暂停自动答复，保留原资料和人工审核。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码已支持快速问答、检索和引用输出的连接方式。人工复核与固定兜底的效果是待验证假设。团队级隔离、召回率、复核成本和真实运行结果待核实。

- 已检查：作者 README、包清单、源码路径 README.md、internal/router/routes_chat.go、internal/application/service/session_knowledge_qa.go、internal/handler/session/qa.go、internal/application/service/chat_pipeline/search_parallel.go、internal/application/service/chat_pipeline/search.go、internal/application/service/knowledgebase_search.go、internal/application/service/knowledgebase_search_fusion.go、internal/application/service/chat_pipeline/rerank.go、internal/application/service/chat_pipeline/chat_completion_stream.go、internal/application/service/knowledgebase_search_storegroup.go、internal/application/access/kb_search.go、config/config.yaml、VERSION、docker-compose.yml、internal/application/service/knowledge_create.go、internal/application/service/knowledge_process.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅静态核查根产品的快速问答主路、混合检索和默认 Compose 下的文件导入边界。根仓 VERSION 声明 0.9.0，详情中的包版本未声明源自根目录没有 npm 包清单。DSH 连接器、Agent 任务执行、Wiki 以及具体后端的全量审计均不在本次抽读范围。
- 下一步：先在隔离环境固定部署版本和语料，再按 [Q05](#research-q05) 的问题组对照模型兜底、固定拒答加人工核对以及全人工查阅。记录未授权泄露、错误放行、误转人工、合格答复比例和人工时间。

**分析版本**

- **仓库**：[Tencent/WeKnora](https://github.com/Tencent/WeKnora)
- **版本号**：未声明（[固定提交 e3fb233](https://github.com/Tencent/WeKnora/tree/e3fb2335bf3f8cadd32142380c60b2677a27bf99)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 把已有固定兜底策略和引用输出接入内部答疑复核流程。让无命中问题停止自动答复并转人工，正常回答先检查所引片段是否支持关键事实。若错误放行没有下降，或复核与转交增加的时间抵消改善，该假设不成立。

先在隔离环境固定部署版本和语料，再按 [Q05](#research-q05) 的问题组对照模型兜底、固定拒答加人工核对以及全人工查阅。记录未授权泄露、错误放行、误转人工、合格答复比例和人工时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 156 | 38795 | — | — | 512254 |
| .mjs | source | 31 | 3841 | 3478 | 158 | — |
| .mjs | test | 86 | 9740 | 8521 | 415 | — |
| .md | example | 4 | 261 | — | — | 1100 |
| .ts | test | 267 | 35562 | 32024 | 962 | — |
| .js | source | 18 | 2330 | 2027 | 108 | — |
| .ts | source | 365 | 111276 | 99902 | 6918 | — |
| .md | test | 1 | 66 | — | — | 544 |
| .js | test | 1 | 254 | 227 | 10 | — |
| .mts | source | 1 | 221 | 191 | 6 | — |
| .tsx | source | 11 | 1064 | 1006 | 28 | — |

</details>

**活跃度**

[![Issue 未关闭 509](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=509&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 364](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=364&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 192](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=192&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有资料问答负担的团队能否用独立部署的 WeKnora 把同一知识库接入检索问答并给出可人工复核的依据，哪些检索、隔离和维护条件会改变采用决定？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这套知识问答底座，实际交付比直接问模型多了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有资料库、经常回答同类内部问题且能管理资料授权的团队。以内部手册咨询为例，合格结果是一条按指定资料范围得出的答复，审核者能定位原文，缺依据时能交回人工。原流程可在共享目录按关键词找文件、核对版本并摘录，也可每次将已知文件交给模型。后者仍由提问者选文件和维持资料范围。WeKnora 是独立部署的知识服务，作者把快速问答、Agent 与 Wiki 放在同一知识库之上。本次核实的增量集中在快速问答。HTTP 路由有独立问答与检索入口，问答可以在开始流式生成前发出已合并的检索片段，使用者可沿这些材料复核。引用随回答提供，审核责任仍由使用者承担。对偶发、已知文件位置的问题，打开原文通常仍是可行基线。当前材料支持流程差异，无法衡量实际查询频次、命中或节省时间。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-49](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/README.md#L43-L49)

作者描述团队文档及同一库上的三种使用方式。

```text
[WeKnora](https://weknora.weixin.qq.com) is an open-source, LLM-powered knowledge framework for enterprise document understanding, semantic retrieval and reasoning. It brings a team's documents together so they can be searched, reasoned over and kept up to date.

https://github.com/user-attachments/assets/de0e490a-e738-405e-bb3a-64b63edd7278

<p align="center"><sub>v0.9.0 · 2:45 · 1080p60 · English narration and subtitles</sub></p>

Use RAG to look things up, the agent for multi-step tasks, and the wiki to organize knowledge. All three work on the same knowledge bases.
```

**依据 2 · 源码核查**：[internal/router/routes_chat.go:145-163](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/router/routes_chat.go#L145-L163)

快速问答、Agent 问答与独立检索分别挂路由，根系统自身提供知识服务。

<details>
<summary>查看原文（19行）</summary>

```text
func RegisterChatRoutes(r *gin.RouterGroup, handler *session.Handler, g *rbacGuards) {
	// These POST routes append messages and run generation, so a scoped key
	// needs the explicit chat capability unless it has full tenant access.
	knowledgeChat := g.apiKeyGroup(r.Group("/knowledge-chat", g.Viewer()), apiKeyChat(apiKeyFullAccess()))
	{
		knowledgeChat.POST("/:session_id", handler.KnowledgeQA)
	}

	// Agent-based chat
	agentChat := g.apiKeyGroup(r.Group("/agent-chat", g.Viewer()), apiKeyChat(apiKeyFullAccess()))
	{
		agentChat.POST("/:session_id", handler.AgentQA)
	}

	// 新增知识检索接口，不需要session_id
	knowledgeSearch := g.apiKeyGroup(r.Group("/knowledge-search", g.Viewer()), apiKeyRetrieve(apiKeyFullAccess()))
	{
		knowledgeSearch.POST("", handler.SearchKnowledge)
	}
```

</details>

**依据 3 · 源码核查**：[internal/application/service/session_knowledge_qa.go:725-732](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/session_knowledge_qa.go#L725-L732)

流式生成前发出检索引用，说明采用者可得到资料范围内的复核线索。

```text
		// Emit references before answer streaming so the SSE client receives
		// them while the connection is still open. Previously references were
		// emitted after the pipeline returned — by then the `complete` event had
		// already closed the stream, so the frontend only saw citations on refresh.
		if eventType == types.CHAT_COMPLETION_STREAM {
			emitKnowledgeReferencesEvent(ctx, chatManage)
		}
		err := s.eventManager.Trigger(stageCtx, eventType, chatManage)
```

**依据 4 · 源码核查**：[internal/application/service/session_knowledge_qa.go:1301-1319](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/session_knowledge_qa.go#L1301-L1319)

输出取自 MergeResult，实际有候选时才发，和内联引用开关是两种表面。

<details>
<summary>查看原文（19行）</summary>

```text
// emitKnowledgeReferencesEvent streams retrieved chunks to the client as a
// `references` SSE event. These references drive the retrieval-results UI and
// remain available even when inline citations in the model answer are disabled.
// Must run before CHAT_COMPLETION_STREAM so the event arrives while the
// connection is still open (complete closes the stream).
func emitKnowledgeReferencesEvent(ctx context.Context, chatManage *types.ChatManage) {
	if chatManage == nil || chatManage.EventBus == nil || len(chatManage.MergeResult) == 0 {
		return
	}
	logger.Infof(ctx, "Emitting references event with %d results (pre-answer)", len(chatManage.MergeResult))
	if err := chatManage.EventBus.Emit(ctx, types.Event{
		ID:        generateEventID("references"),
		Type:      types.EventType(event.EventAgentReferences),
		SessionID: chatManage.SessionID,
		Data: event.AgentReferencesData{
			References: chatManage.MergeResult,
		},
	}); err != nil {
		logger.Errorf(ctx, "Failed to emit references event: %v", err)
```

</details>

#### 缺口

- 缺少目标团队的资料更新频率和实际问答样本。
  **影响**：无法判断是否值得承担索引维护和复核。
  **进一步探讨**：从真实工作日志抽取高频、找不到资料和查错版本的问题，记录人工找原文的用时与错误。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一次资料问答如何从真实路由到检索、重排和流式回答？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端向知识问答路由发送带会话标识的请求，handler 解析请求并走普通问答路径，由会话服务解析知识范围和模型。只有知识范围或网络检索生效时才选择检索增强流水线，纯聊天使用另一条分支。检索增强分支按配置处理历史和记忆，随后执行查询理解、并行搜索、重排、合并和筛选，组装上下文再向模型发起流式生成。并行阶段在意图判断需要检索时才触发，实体支路没有实体会跳过，片段支路按可解析的嵌入模型分组，同模型组内的整库目标可合并检索调用。服务层仅在向量与关键词两侧都有结果时做带权排名融合，单侧走相应去重路径。重排模型缺失或加载失败时沿原结果继续，重排服务错误也有保留候选的分支，重排阈值筛空则进入无结果路径。生成模型的输出以事件流式交付，最后一个完成事件可携带截断状态。代码说明哪些阶段可被组合、跳过和降级，检索或流完成仍需另核对召回证据与答复质量。

#### 证据与依据

**依据 1 · 源码核查**：[internal/handler/session/qa.go:1129-1143](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/handler/session/qa.go#L1129-L1143)

固定路由 handler 解析后进入普通问答。

<details>
<summary>查看原文（15行）</summary>

```text
func (h *Handler) KnowledgeQA(c *gin.Context) {
	// Parse and validate request
	reqCtx, request, err := h.parseQARequest(c, "KnowledgeQA")
	if err != nil {
		c.Error(err)
		return
	}

	// Execute normal mode QA, generate title unless disabled
	if request.LocalBrowserEnabled {
		_ = c.Error(errors.NewBadRequestError("Local browser requests must use the agent endpoint"))
		return
	}
	h.executeQA(reqCtx, qaModeNormal, !request.DisableTitle)
}
```

</details>

**依据 2 · 源码核查**：[internal/handler/session/qa.go:1632-1643](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/handler/session/qa.go#L1632-L1643)

普通模式明确调用会话服务 KnowledgeQA。

<details>
<summary>查看原文（12行）</summary>

```text
		// Build QA request and invoke the appropriate service
		qaReq := reqCtx.buildQARequest()

		var serviceErr error
		var stageName string
		if mode == qaModeNormal {
			stageName = "knowledge_qa_execution"
			serviceErr = h.sessionService.KnowledgeQA(streamCtx.asyncCtx, qaReq, streamCtx.eventBus)
		} else {
			stageName = "agent_execution"
			serviceErr = h.sessionService.AgentQA(streamCtx.asyncCtx, qaReq, streamCtx.eventBus)
		}
```

</details>

**依据 3 · 源码核查**：[internal/application/service/session_knowledge_qa.go:190-233](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/session_knowledge_qa.go#L190-L233)

实际分支和事件列表区分纯聊天与检索增强。

<details>
<summary>查看原文（44行）</summary>

```text
	// Determine pipeline based on the effective knowledge retrieval scope and
	// web search setting. Tag-only mentions leave the raw KB/knowledge ID slices
	// empty but produce SearchTargets, so the unified targets must participate in
	// this decision or the request is incorrectly downgraded to pure chat.
	hasKB := types.HasKnowledgeRetrievalScope(searchTargets, knowledgeBaseIDs, knowledgeIDs)
	needsRAG := hasKB || webSearchEnabled
	hasHistory := chatManage.MaxRounds > 0

	var pipeline []types.EventType
	if !needsRAG {
		// Pure chat — no retrieval needed.
		userContent := req.Query
		if req.ImageDescription != "" && !chatModelSupportsVision {
			userContent += "\n\n[用户上传图片内容]\n" + req.ImageDescription
		}
		if req.QuotedContext != "" {
			userContent += "\n\n" + req.QuotedContext
		}
		// Inject attachment content for pure-chat path (RAG path handles this in INTO_CHAT_MESSAGE).
		if len(req.Attachments) > 0 {
			userContent += req.Attachments.BuildPrompt()
		}
		chatManage.UserContent = userContent

		pipeline = types.NewPipelineBuilder().
			AddIf(hasHistory, types.LOAD_HISTORY).
			Add(types.MEMORY_RECALL).
			Add(types.CHAT_COMPLETION_STREAM).
			Build()
	} else {
		// RAG — dynamically assemble based on feature flags.
		pipeline = types.NewPipelineBuilder().
			AddIf(hasHistory, types.LOAD_HISTORY).
			Add(types.MEMORY_RECALL).
			Add(types.QUERY_UNDERSTAND).
			Add(types.CHUNK_SEARCH_PARALLEL).
			Add(types.CHUNK_RERANK).
			AddIf(webSearchEnabled, types.WEB_FETCH).
			Add(types.CHUNK_MERGE).
			Add(types.FILTER_TOP_K).
			AddIf(chatManage.DataAnalysisEnabled, types.DATA_ANALYSIS).
			Add(types.INTO_CHAT_MESSAGE).
			Add(types.CHAT_COMPLETION_STREAM).
			Build()
```

</details>

**依据 4 · 源码核查**：[internal/application/service/chat_pipeline/search_parallel.go:114-149](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/chat_pipeline/search_parallel.go#L114-L149)

片段和实体作为不同子任务执行，实体为空可跳过。

<details>
<summary>查看原文（36行）</summary>

```text
	noop := func() *PluginError { return nil }

	tasks := []ParallelTask{
		{
			Name: "chunk_search",
			Run: func() *PluginError {
				err := p.searchPlugin.OnEvent(ctx, types.CHUNK_SEARCH, chunkCM, noop)
				pipelineInfo(ctx, "SearchParallel", "chunk_search_done", map[string]interface{}{
					"result_count": len(chunkCM.SearchResult),
					"has_error":    err != nil && err != ErrSearchNothing,
				})
				if err == ErrSearchNothing {
					return nil
				}
				return err
			},
		},
		{
			Name: "entity_search",
			Run: func() *PluginError {
				if len(chatManage.Entity) == 0 {
					pipelineInfo(ctx, "SearchParallel", "entity_search_skip", map[string]interface{}{
						"reason": "no_entities",
					})
					return nil
				}
				err := p.searchEntityPlugin.OnEvent(ctx, types.ENTITY_SEARCH, entityCM, noop)
				pipelineInfo(ctx, "SearchParallel", "entity_search_done", map[string]interface{}{
					"result_count": len(entityCM.SearchResult),
					"has_error":    err != nil && err != ErrSearchNothing,
				})
				if err == ErrSearchNothing {
					return nil
				}
				return err
			},
```

</details>

**依据 5 · 源码核查**：[internal/application/service/chat_pipeline/search.go:581-605](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/chat_pipeline/search.go#L581-L605)

整库搜索实际将统一查询向量及目标列表交给 HybridSearch。

<details>
<summary>查看原文（25行）</summary>

```text
			// Combined search: one HybridSearch call spanning all full-KB targets
			if len(fullKBIDs) > 0 {
				innerWg.Add(1)
				go func() {
					defer innerWg.Done()

					params := types.SearchParams{
						QueryText:             queryText,
						QueryEmbedding:        queryEmbedding,
						KnowledgeBaseIDs:      fullKBIDs,
						VectorThreshold:       chatManage.VectorThreshold,
						KeywordThreshold:      chatManage.KeywordThreshold,
						MatchCount:            chatManage.EmbeddingTopK,
						SkipContextEnrichment: true,
						DisableVectorMatch:    disableVector,
						DisableKeywordsMatch:  chatManage.DisableKeywordsMatch,
					}
					res, err := p.knowledgeBaseService.HybridSearch(ctx, fullKBIDs[0], params)
					if err != nil {
						pipelineWarn(ctx, "Search", "combined_kb_search_error", map[string]interface{}{
							"kb_ids": fullKBIDs,
							"error":  err.Error(),
						})
						recordError(err)
						return
```

</details>

**依据 6 · 源码核查**：[internal/application/service/knowledgebase_search.go:349-373](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/knowledgebase_search.go#L349-L373)

下层取回分支结果并调用融合，空结果和检索错误有不同出口。

<details>
<summary>查看原文（25行）</summary>

```text
	retrieveResults, err := s.retrieveFromStores(retrieveCtx, groups, retriever.EngineAwareNormalizer{})
	retrieveSpan.Finish(langfuse.SummarizeRetrieveOutput(retrieveResults), nil, err)
	if err != nil {
		logger.ErrorWithFields(ctx, err, map[string]interface{}{
			"knowledge_base_ids": searchKBIDs,
			"query_text":         params.QueryText,
		})
		return nil, err
	}

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

**依据 7 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:59-84](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/knowledgebase_search_fusion.go#L59-L84)

融合仅用于双侧结果，关键词或向量单侧走独立去重。

<details>
<summary>查看原文（26行）</summary>

```text
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

**依据 8 · 源码核查**：[internal/application/service/chat_pipeline/rerank.go:60-87](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/chat_pipeline/rerank.go#L60-L87)

零候选、无重排模型、模型无法加载时继续流水线。

<details>
<summary>查看原文（28行）</summary>

```text
	if len(chatManage.SearchResult) == 0 {
		diag.Outcome = types.RerankOutcomeNoCandidates
		pipelineInfo(ctx, "Rerank", "skip", map[string]interface{}{
			"reason": "empty_search_result",
		})
		return next()
	}
	if chatManage.RerankModelID == "" {
		diag.Outcome = types.RerankOutcomeNoModel
		pipelineWarn(ctx, "Rerank", "skip", map[string]interface{}{
			"reason": "empty_model_id",
		})
		return next()
	}

	// Get rerank model from service. A model that cannot be loaded (deleted,
	// misconfigured) degrades to retrieval order like a failed rerank call,
	// as the search APIs do, rather than failing every turn of the session.
	rerankModel, err := p.modelService.GetRerankModel(ctx, chatManage.RerankModelID)
	if err != nil {
		diag.Outcome = types.RerankOutcomeModelUnavailable
		diag.Error = err.Error()
		pipelineWarn(ctx, "Rerank", "get_model_fallback", map[string]interface{}{
			"model_id": chatManage.RerankModelID,
			"error":    err.Error(),
		})
		return next()
	}
```

</details>

**依据 9 · 源码核查**：[internal/application/service/chat_pipeline/rerank.go:126-160](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/chat_pipeline/rerank.go#L126-L160)

模型调用错误沿候选降级，重排筛空才产生无结果信号。

<details>
<summary>查看原文（35行）</summary>

```text
	if diag.Outcome == types.RerankOutcomeModelError {
		// Rerank API failed — fall back to the retrieval results so the
		// pipeline can still return something useful to the caller.
		pipelineWarn(ctx, "Rerank", "api_error_fallback", map[string]interface{}{
			"error":         diag.Error,
			"candidate_cnt": diag.CandidateCount,
		})
		chatManage.SearchResult = res.Results
		rerankSpan.Finish(map[string]interface{}{
			"stage":           "api_error_fallback",
			"candidate_count": diag.CandidateCount,
			"error":           diag.Error,
		}, nil, nil)
		return next()
	}

	chatManage.RerankResult = res.Results
	for i := 0; i < min(3, len(res.Scored)); i++ {
		pipelineInfo(ctx, "Rerank", "composite_top", map[string]interface{}{
			"rank":        i + 1,
			"chunk_id":    res.Scored[i].ID,
			"base_score":  res.Scored[i].Metadata["base_score"],
			"final_score": fmt.Sprintf("%.4f", res.Scored[i].Score),
		})
	}
	rerankSpan.Finish(buildRerankSpanOutput(res, chatManage), nil, nil)

	if len(chatManage.RerankResult) == 0 {
		pipelineWarn(ctx, "Rerank", "output", map[string]interface{}{
			"filtered_cnt": 0,
			"outcome":      diag.Outcome,
			"top_score":    diag.TopScore,
			"threshold":    diag.EffectiveThreshold,
		})
		return ErrSearchNothing
```

</details>

**依据 10 · 源码核查**：[internal/application/service/chat_pipeline/chat_completion_stream.go:245-275](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/chat_pipeline/chat_completion_stream.go#L245-L275)

流式回答去重并传播完成和截断状态。

<details>
<summary>查看原文（31行）</summary>

```text
				if response.ResponseType == types.ResponseTypeAnswer {
					// Providers can emit a completion once for finish_reason and again
					// for their EOF sentinel. A final answer is a terminal event for a
					// single stream, so forwarding a later duplicate would put an answer
					// after the session's complete event.
					if answerCompleted {
						continue
					}
					response.Content = answerDecoder.Feed(response.Content)
					if response.Done {
						response.Content += answerDecoder.Flush()
						answerCompleted = true
					}
					if strings.TrimSpace(response.Content) != "" {
						answerProduced = true
					}
					truncated := response.Done && IsLengthFinishReason(response.FinishReason)
					if truncated && !answerProduced {
						response.Content = EmptyTruncatedAnswerFallback
						answerProduced = true
					}
					closeThinking()
					eventBus.Emit(ctx, types.Event{
						ID:        answerID,
						Type:      types.EventType(event.EventAgentFinalAnswer),
						SessionID: chatManage.SessionID,
						Data: event.AgentFinalAnswerData{
							Content:   response.Content,
							Done:      response.Done,
							Truncated: truncated,
						},
```

</details>

#### 缺口

- 实际目标语料上的分组覆盖与降级结果未知。
  **影响**：无法判断哪类问题常失去向量或重排收益，也无法量化端到端等待。
  **进一步探讨**：固定同一组库、模型和问题，分别记录关键词单侧、向量单侧与融合在不同故障下的命中和时延。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 搜索范围和引用能否承担隔离及事实核验？

**研究主题**：缺陷与关键质疑

#### 完整回答

可以把权限检查和引用作为试用的验收点。写入会话的普通问答先查会话所有权，并对请求合并出来的知识目标调用 API key 范围检查。混合搜索在打开各组存储前对取回的库逐个检查原调用者的库权限，并检查向量模型一致性。库权限验证错误与无权限分别走服务错误和未找到路径，工作区级 Viewer 角色本身并不能代替对目标库的授权。证据范围仅覆盖这条问答链上的会话和混合检索门禁，下载、直链、缓存、共享 Agent 的执行租户以及其他检索器需分开验证。

合并候选列表在生成前就能发给前端，所以出现检索引用仅说明该请求有候选。排序分由排名融合得到，也无法直接解释为某个回答正确的概率。空候选可能来自库没有可检索索引、无相关匹配或重排筛空。会话流水线先检查取消，再将无结果送去兜底，其他阶段错误向上传递。仓库自带配置选模型兜底，实际配置可覆盖。模型兜底可在没有检索命中时调用模型流式生成，因此团队需要在验收时把该类输出与有来源回答分开。

#### 证据与依据

**依据 1 · 源码核查**：[internal/handler/session/qa.go:281-304](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/handler/session/qa.go#L281-L304)

会话写入前检查所有者并调用知识目标授权。

<details>
<summary>查看原文（24行）</summary>

```text
	// Get session. QA writes new messages into the session, so use the strict
	// owner scope: a tenant admin may read an API-key session but must not be
	// able to post messages to it (which would otherwise fail later at message
	// creation with a 500 instead of a clean not-found).
	session, err := h.sessionService.GetOwnedSession(ctx, sessionID)
	if err != nil {
		logger.Errorf(ctx, "Failed to get session, session ID: %s, error: %v", sessionID, err)
		return nil, nil, errors.NewNotFoundError("Session not found")
	}
	if session.Kind == types.SessionKindAutomation {
		return nil, nil, errors.NewForbiddenError("automation conversations do not accept manual messages")
	}

	// Get custom agent if agent_id is provided. Backend resolves shared agent from share relation (no client-provided tenant).
	customAgent, effectiveTenantID, sharedAgentReadOnly := h.resolveAgent(ctx, c, request.AgentID, request.AgentSourceTenantID)
	if request.AgentSourceTenantID != 0 && customAgent == nil {
		return nil, nil, errors.NewNotFoundError("Shared agent not found")
	}

	// Merge @mentioned items into knowledge_base_ids and knowledge_ids
	kbIDs, knowledgeIDs := mergeKnowledgeTargets(request.KnowledgeBaseIDs, request.KnowledgeIDs, request.MentionedItems)
	if err := types.AuthorizeTenantAPIKeyKnowledgeTargets(ctx, kbIDs, knowledgeIDs); err != nil {
		return nil, nil, err
	}
```

</details>

**依据 2 · 源码核查**：[internal/application/service/knowledgebase_search.go:236-263](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/knowledgebase_search.go#L236-L263)

实际存储检索前先执行知识库权限和嵌入模型一致性检查。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[internal/application/service/knowledgebase_search_storegroup.go:201-208](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/knowledgebase_search_storegroup.go#L201-L208)

服务方法将授权转入实际权限实现。

```text
// authorizeKBAccess is a service wrapper around access.AuthorizeKBAccess
// so HybridSearch and its tests keep calling through knowledgeBaseService.
func (s *knowledgeBaseService) authorizeKBAccess(
	ctx context.Context,
	kbs []*types.KnowledgeBase,
) error {
	return access.AuthorizeKBAccess(ctx, s.kbShareService, kbs)
}
```

**依据 4 · 源码核查**：[internal/application/access/kb_search.go:32-62](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/access/kb_search.go#L32-L62)

先查 API key 库范围，再逐库判 Viewer；区分查询失败与拒绝。

<details>
<summary>查看原文（31行）</summary>

```text
	kbIDs := make([]string, 0, len(kbs))
	for _, kb := range kbs {
		kbIDs = append(kbIDs, kb.ID)
	}
	if err := types.AuthorizeTenantAPIKeyKnowledgeBases(ctx, kbIDs...); err != nil {
		return err
	}

	requestTenantID := types.CallerFromContext(ctx).TenantID
	permissions := NewKBPermissions(ctx, shares)

	for _, kb := range kbs {
		hasPermission, permErr := permissions.Check(kb.ID, kb.TenantID, types.OrgRoleViewer)
		if permErr != nil {
			logger.ErrorWithFields(ctx, permErr, map[string]interface{}{
				"caller_tenant_id": requestTenantID,
				"kb_tenant_id":     kb.TenantID,
				"kb_id":            kb.ID,
				"reason":           "shared-KB permission lookup failed",
			})
			return apperrors.NewInternalServerError("failed to verify knowledge base access")
		}
		if !hasPermission {
			logger.WarnWithFields(ctx, logger.Fields{
				"caller_tenant_id": requestTenantID,
				"kb_tenant_id":     kb.TenantID,
				"kb_id":            kb.ID,
				"reason":           "tenant lacks viewer permission for foreign-tenant KB",
			}, "search scope rejected: unauthorized foreign-tenant KB")
			return apperrors.NewNotFoundError("knowledge base not found")
		}
```

</details>

**依据 5 · 源码核查**：[internal/application/service/knowledgebase_search.go:307-319](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/knowledgebase_search.go#L307-L319)

无可检索配置可返回空结果。

<details>
<summary>查看原文（13行）</summary>

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
	}
```

</details>

**依据 6 · 源码核查**：[internal/application/service/knowledgebase_search_fusion.go:194-207](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/knowledgebase_search_fusion.go#L194-L207)

实际排序取加权名次之和再归一化。

<details>
<summary>查看原文（14行）</summary>

```text
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

**依据 7 · 源码核查**：[internal/application/service/session_knowledge_qa.go:768-796](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/session_knowledge_qa.go#L768-L796)

取消优先于无结果兜底，非空结果类错误单独处理。

<details>
<summary>查看原文（29行）</summary>

```text
		if ctxErr := ctx.Err(); ctxErr != nil {
			common.PipelineWarn(ctx, "Pipeline", "stage_cancelled", map[string]interface{}{
				"event":       string(eventType),
				"duration_ms": stageDuration.Milliseconds(),
				"reason":      ctxErr.Error(),
			})
			return ctxErr
		}

		if err == chatpipeline.ErrSearchNothing {
			common.PipelineWarn(ctx, "Pipeline", "stage_fallback", map[string]interface{}{
				"event":       string(eventType),
				"duration_ms": stageDuration.Milliseconds(),
				"reason":      "search_nothing",
				"strategy":    string(chatManage.FallbackStrategy),
			})
			s.handleFallbackResponse(ctx, chatManage)
			return nil
		}

		if err != nil {
			common.PipelineError(ctx, "Pipeline", "stage_failed", map[string]interface{}{
				"event":       string(eventType),
				"duration_ms": stageDuration.Milliseconds(),
				"error_type":  err.ErrorType,
				"description": err.Description,
			})
			return err.Err
		}
```

</details>

**依据 8 · 源码核查**：[config/config.yaml:9-21](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/config/config.yaml#L9-L21)

自带配置的回退策略值为 model，另有固定回退文案。

<details>
<summary>查看原文（13行）</summary>

```text
conversation:
  max_rounds: 5
  keyword_threshold: 0.3
  embedding_top_k: 30
  vector_threshold: 0.2
  rerank_threshold: 0.3
  rerank_top_k: 30
  fallback_strategy: "model"
  fallback_response: "Sorry, I am unable to answer this question."
  fallback_prompt_id: "default_fallback_prompt"  # from prompt_templates/fallback.yaml (mode: "model")
  enable_rewrite: true
  enable_query_expansion: true
  enable_rerank: true
```

</details>

**依据 9 · 源码核查**：[internal/application/service/session_knowledge_qa.go:1078-1098](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/session_knowledge_qa.go#L1078-L1098)

模型兜底实际调用 ChatStream，启动失败或空通道转固定回答。

<details>
<summary>查看原文（21行）</summary>

```text
	// Start streaming response
	fallbackMessages, modelContext := prepareFallbackMessages(chatManage, promptContent)
	if leaks := modelContext.LeakedIdentifiers(fallbackMessages); len(leaks) > 0 {
		logger.Warnf(ctx, "[Fallback][ModelContext] %d message field(s) carry raw identifiers after encoding: %s",
			len(leaks), modelcontext.SummarizeLeaks(leaks))
	}
	responseChan, err := chatModel.ChatStream(ctx, fallbackMessages, opt)
	if err != nil {
		logger.Errorf(ctx, "Failed to start streaming fallback response: %v, falling back to fixed response", err)
		s.handleFixedFallback(ctx, chatManage)
		return
	}

	if responseChan == nil {
		logger.Errorf(ctx, "Chat stream returned nil channel, falling back to fixed response")
		s.handleFixedFallback(ctx, chatManage)
		return
	}

	// Start goroutine to consume stream and emit events
	go s.consumeFallbackStream(ctx, chatManage, responseChan, modelContext)
```

</details>

#### 缺口

- 未取得目标组织中共享、撤权和跨账号会话的故障注入或结果证据。
  **影响**：无法把源码的多层检查扩展为对任意租户路径的隔离保证。
  **进一步探讨**：用两个测试账号和各自独有的哨兵文档验证获准访问、越权、撤权后重试以及引用跳转；分开记录每条端点。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、导入、持续问答与恢复分别需要什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

以仓库默认 Compose 为边界，Web 容器依赖健康的应用容器，应用启动依赖 Redis 已启动以及 PostgreSQL、docreader 健康。默认数据库和检索驱动都指向 PostgreSQL，本地上传目录有独立数据卷。配置引用的 UI、应用和解析器镜像在未指定版本时用 latest，因此按文档拉镜像不等于运行这次固定源码，应先核对版本或用对应版本构建。查库需准备与该库兼容的索引和向量模型，回答需要可用的问答模型，重排是按配置生效的增量，图谱、额外存储与追踪属于选配。使用外部模型时还要核实查询、检索片段和跟踪数据的出站与权限。

上传后会先有待处理记录和原文件，随后后台任务才加工索引。文件入队报错会尝试标记失败，但服务仍可把记录返回给调用方，标记失败自身也有数据库写入出错的路径。管理员应先核对记录状态、文件及任务，再重试，最后用已知问题查出预期片段。升级或退出前应备份原件、数据库及所用外部存储，演练用同模型恢复或重建索引。对一条有原文可核对且审核通过的答复，现金与资源应计入算力、存储、模型调用及失败重试，人工时间应计入配置、授权、资料维护、故障排查和答案复核。实际金额和耗时未知，不能仅以对话接口成功或一次生成 token 推算单位成本。

#### 证据与依据

**依据 1 · 源码核查**：[VERSION:1-1](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/VERSION#L1-L1)

根仓版本文件声明项目版本，不能据此判定任意镜像对应源码。

```text
0.9.0
```

**依据 2 · 作者声明**：[README.md:95-110](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/README.md#L95-L110)

作者给出 Compose 启动和本地模型接入的操作边界。

<details>
<summary>查看原文（16行）</summary>

````text
### Run with Docker Compose

Requires [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/) and [Git](https://git-scm.com/).

```bash
git clone https://github.com/Tencent/WeKnora.git
cd WeKnora
cp .env.example .env    # Edit .env as needed, see comments in the file
docker compose pull     # Pull the latest images
docker compose up -d    # Start core services
```

Then open **http://localhost** and follow the onboarding guide. A walkthrough with sample data is in the [Quickstart](https://weknora.weixin.qq.com/docs/01-getting-started/03-quickstart).

> [!TIP]
> To use a local Ollama model, run `ollama serve > /dev/null 2>&1 &` first. For the Ollama embedding model name, `OLLAMA_BASE_URL`, and RAM notes, see [Configuration](https://weknora.weixin.qq.com/docs/01-getting-started/04-configuration).
````

</details>

**依据 3 · 源码核查**：[docker-compose.yml:29-40](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/docker-compose.yml#L29-L40)

Web 依赖健康 App；App 镜像在未指定变量时取 latest。

<details>
<summary>查看原文（12行）</summary>

```text
    depends_on:
      app:
        condition: service_healthy
    networks:
      - WeKnora-network
    restart: unless-stopped

  app:
    image: wechatopenai/weknora-app:${WEKNORA_VERSION:-latest}
    build:
      context: .
      dockerfile: docker/Dockerfile.app
```

</details>

**依据 4 · 源码核查**：[docker-compose.yml:151-176](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/docker-compose.yml#L151-L176)

默认数据库及检索驱动均配置为 PostgreSQL，未填凭据使用空默认值。

<details>
<summary>查看原文（26行）</summary>

```text
      - DB_DRIVER=${DB_DRIVER:-postgres}
      - DB_HOST=${DB_HOST:-postgres}
      - DB_PORT=${DB_PORT:-5432}
      - DB_USER=${DB_USER:-}
      - DB_PASSWORD=${DB_PASSWORD:-}
      - DB_NAME=${DB_NAME:-}
      - DB_MAX_OPEN_CONNS=${DB_MAX_OPEN_CONNS:-}
      # SQLite 驱动时使用（DB_DRIVER=sqlite）；postgres 驱动忽略
      # - DB_PATH=${DB_PATH:-}
      # ========== Langfuse (optional observability) ==========
      # Enabled automatically when LANGFUSE_PUBLIC_KEY + LANGFUSE_SECRET_KEY are set.
      # See website-docs/03-features/16-observability.md for the full list of tuning knobs.
      - LANGFUSE_ENABLED=${LANGFUSE_ENABLED:-}
      - LANGFUSE_HOST=${LANGFUSE_HOST:-https://cloud.langfuse.com}
      - LANGFUSE_PUBLIC_KEY=${LANGFUSE_PUBLIC_KEY:-}
      - LANGFUSE_SECRET_KEY=${LANGFUSE_SECRET_KEY:-}
      - LANGFUSE_RELEASE=${LANGFUSE_RELEASE:-}
      - LANGFUSE_ENVIRONMENT=${LANGFUSE_ENVIRONMENT:-}
      - LANGFUSE_FLUSH_AT=${LANGFUSE_FLUSH_AT:-}
      - LANGFUSE_FLUSH_INTERVAL=${LANGFUSE_FLUSH_INTERVAL:-}
      - LANGFUSE_QUEUE_SIZE=${LANGFUSE_QUEUE_SIZE:-}
      - LANGFUSE_REQUEST_TIMEOUT=${LANGFUSE_REQUEST_TIMEOUT:-}
      - LANGFUSE_SAMPLE_RATE=${LANGFUSE_SAMPLE_RATE:-}
      - LANGFUSE_DEBUG=${LANGFUSE_DEBUG:-}
      # 向量库 / 检索引擎
      - RETRIEVE_DRIVER=${RETRIEVE_DRIVER:-postgres}
```

</details>

**依据 5 · 源码核查**：[docker-compose.yml:409-415](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/docker-compose.yml#L409-L415)

App 依赖 Redis 启动和另外两项健康检查。

```text
    depends_on:
      redis:
        condition: service_started
      postgres:
        condition: service_healthy
      docreader:
        condition: service_healthy
```

**依据 6 · 源码核查**：[docker-compose.yml:54-57](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/docker-compose.yml#L54-L57)

本地原件挂载到独立数据卷，配置文件也单独挂载。

```text
    volumes:
      - data-files:/data/files
      - docreader-tmp:/tmp/docreader:ro
      - ./config/config.yaml:/app/config/config.yaml
```

**依据 7 · 源码核查**：[internal/application/service/knowledge_create.go:272-293](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/knowledge_create.go#L272-L293)

异步队列失败可返回已保存记录；成功入队时状态仍是 pending。

<details>
<summary>查看原文（22行）</summary>

```text
	task := asynq.NewTask(
		types.TypeDocumentProcess,
		payloadBytes,
		documentProcessTaskOptions(s.config, asynq.MaxRetry(3))...,
	)
	info, err := s.task.Enqueue(task)
	if err != nil {
		logger.Errorf(ctx, "Failed to enqueue document process task: %v", err)
		s.markKnowledgeEnqueueFailed(ctx, knowledge)
		recordKBActivity(ctx, s.audit, knowledge.TenantID, kbID, types.AuditActionKnowledgeCreated,
			"knowledge", knowledge.ID, types.AuditOutcomeFailed, map[string]any{
				"title": knowledge.Title, "source_type": "file", "file_type": knowledge.FileType,
				"processing_status": "failed", "failure_stage": "enqueue",
			})
		// 即使入队失败，也返回knowledge，因为文件已保存
		return knowledge, nil
	}
	recordKBActivity(ctx, s.audit, knowledge.TenantID, kbID, types.AuditActionKnowledgeCreated,
		"knowledge", knowledge.ID, types.AuditOutcomeAccepted, map[string]any{
			"title": knowledge.Title, "source_type": "file", "file_type": knowledge.FileType,
			"processing_status": "pending", "task_id": info.ID, "trigger": kbActivityTrigger(ctx),
		})
```

</details>

**依据 8 · 源码核查**：[internal/application/service/knowledge_create.go:1186-1197](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/knowledge_create.go#L1186-L1197)

失败标记需要数据库写入，更新失败只记日志。

<details>
<summary>查看原文（12行）</summary>

```text
// markKnowledgeEnqueueFailed prevents a durable knowledge row from remaining
// indefinitely "pending" when its background processing task was never
// created. The API may still return the row so callers can retry it.
func (s *knowledgeService) markKnowledgeEnqueueFailed(ctx context.Context, knowledge *types.Knowledge) {
	if knowledge == nil {
		return
	}
	knowledge.ParseStatus = "failed"
	knowledge.ErrorMessage = "Failed to enqueue processing task"
	if err := s.repo.UpdateKnowledge(ctx, knowledge); err != nil {
		logger.Errorf(ctx, "Failed to mark knowledge as failed after enqueue error: %v", err)
	}
```

</details>

**依据 9 · 源码核查**：[internal/application/service/knowledge_process.go:4343-4349](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/knowledge_process.go#L4343-L4349)

文档切块后还有向量化与索引阶段，上传后不能直接假定资料可检索。

```text
		logger.Infof(ctx, "Split document into %d chunks for knowledge %s", len(chunks), knowledge.ID)
	}
	logger.Infof(ctx, "Document chunking completed in %s (knowledge=%s input_bytes=%d chunks=%d)",
		time.Since(chunkStarted), knowledge.ID, len(convertResult.MarkdownContent), len(chunks))

	// Step 4: Process chunks (vectorize + index + enqueue async tasks)
	return s.processChunks(ctx, kb, knowledge, chunks, processOpts)
```

#### 缺口

- 缺同语料、并发与模型配置的部署/恢复记录。
  **影响**：无法给出一次合格答复的现金、恢复时间或状态损失范围。
  **进一步探讨**：以固定样本记录每批导入和答复的模型调用、资源账单、复核工时及恢复后的可检索性。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何用小范围试用判断是否值得维护该系统？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议已有运维和资料治理能力的团队在隔离环境，用一组非敏感的内部手册试做常见问答。先关闭网络搜索，固定语料、角色、索引模型和问答模型，给每题标出允许的出处及合格答案；样本同时含无依据问题、同主题旧版文档以及跨角色不能读取的哨兵原件。平台已分别输出检索引用与兜底事件。由此提出待验证的流程假设：让内部答疑人员对无检索命中的题使用固定拒答，并逐条检查最关键结论是否得到当前版本原文支撑，再决定是否转人工，可减少误发缺依据的答复。增量是面向发布者的验收动作和转交规则，用户需额外花时间核对原文。

最小对照在同一语料、模型和角色下比较自带模型兜底与固定拒答加引用复核，再保留人工查找并答复作为成本基线。记录错误放行、把本可回答问题转走的次数、转人工处理时间及一条合格答复的复核时间。若出现越权片段、找不到证据但仍把回答交付，或误转人工增加导致没有总负担收益，停用自动答复并退回受权限控制的文档检索和人工审核。对没有团队索引和授权维护能力、只偶尔查单文件的个人，当前采用负担难以抵消。

#### 证据与依据

**依据 1 · 源码核查**：[internal/application/service/session_knowledge_qa.go:1022-1036](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/session_knowledge_qa.go#L1022-L1036)

模型与固定兜底是已有可切换策略，固定兜底从配置取文案。

<details>
<summary>查看原文（15行）</summary>

```text
// handleFallbackResponse handles fallback response based on strategy
func (s *sessionService) handleFallbackResponse(ctx context.Context, chatManage *types.ChatManage) {
	if chatManage.FallbackStrategy == types.FallbackStrategyModel {
		s.handleModelFallback(ctx, chatManage)
	} else {
		s.handleFixedFallback(ctx, chatManage)
	}
}

// handleFixedFallback handles fixed fallback response
func (s *sessionService) handleFixedFallback(ctx context.Context, chatManage *types.ChatManage) {
	fallbackContent := chatManage.FallbackResponse
	chatManage.ChatResponse = &types.ChatResponse{Content: fallbackContent}
	s.emitFallbackAnswer(ctx, chatManage, fallbackContent)
}
```

</details>

**依据 2 · 源码核查**：[internal/application/service/session_knowledge_qa.go:1306-1318](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/session_knowledge_qa.go#L1306-L1318)

合并候选的引用事件为验收动作提供可检查对象。

<details>
<summary>查看原文（13行）</summary>

```text
func emitKnowledgeReferencesEvent(ctx context.Context, chatManage *types.ChatManage) {
	if chatManage == nil || chatManage.EventBus == nil || len(chatManage.MergeResult) == 0 {
		return
	}
	logger.Infof(ctx, "Emitting references event with %d results (pre-answer)", len(chatManage.MergeResult))
	if err := chatManage.EventBus.Emit(ctx, types.Event{
		ID:        generateEventID("references"),
		Type:      types.EventType(event.EventAgentReferences),
		SessionID: chatManage.SessionID,
		Data: event.AgentReferencesData{
			References: chatManage.MergeResult,
		},
	}); err != nil {
```

</details>

**依据 3 · 源码核查**：[internal/handler/session/qa.go:1507-1527](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/handler/session/qa.go#L1507-L1527)

普通问答累加回答片段并保留兜底、截断信息，最终交给完成处理。

<details>
<summary>查看原文（21行）</summary>

```text
		streamCtx.eventBus.On(event.EventAgentFinalAnswer, func(ctx context.Context, evt event.Event) error {
			data, ok := evt.Data.(event.AgentFinalAnswerData)
			if !ok {
				return nil
			}
			streamCtx.assistantMessage.Content += data.Content
			if data.IsFallback {
				streamCtx.assistantMessage.IsFallback = true
			}
			if data.Truncated {
				markQuickAnswerTruncated(streamCtx.assistantMessage)
			}
			if data.Done {
				if completionHandled {
					return nil
				}
				completionHandled = true

				logger.Infof(streamCtx.asyncCtx, "Knowledge QA service completed for session: %s", sessionID)
				updateCtx := context.WithValue(streamCtx.asyncCtx, types.TenantIDContextKey, reqCtx.session.TenantID)
				h.completeQuickAnswerTurn(updateCtx, streamCtx, reqCtx.query, reqCtx.userMessageID)
```

</details>

**依据 4 · 源码核查**：[internal/application/service/session_knowledge_qa.go:1332-1341](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/application/service/session_knowledge_qa.go#L1332-L1341)

固定回退发出明确的 IsFallback 完成事件，可与正常结果区分。

<details>
<summary>查看原文（10行）</summary>

```text
	fallbackID := generateEventID("fallback")
	if err := chatManage.EventBus.Emit(ctx, types.Event{
		ID:        fallbackID,
		Type:      types.EventType(event.EventAgentFinalAnswer),
		SessionID: chatManage.SessionID,
		Data: event.AgentFinalAnswerData{
			Content:    content,
			Done:       true,
			IsFallback: true,
		},
```

</details>

#### 缺口

- 缺上述人工复核和固定拒答对照的实际记录。
  **影响**：不能断言会降低误答、工时或复核负担。
  **进一步探讨**：采用事先登记的误发、误转人工、隔离和单位合格答复指标，记录所有失败尝试。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
