# mem9

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[fd63ae8](https://github.com/mem9-ai/mem9/tree/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2)

<!-- BEGIN META -->
[![GitHub ★ 1,227](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C227&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mem9-ai/mem9)
<!-- END META -->

> **功能**：为多 Agent 和多机器提供服务端持久记忆、混合检索及多运行时接入。

> **亮点**：把跨机器多runtime记忆状态集中到统一API并提供混合召回，减少各客户端分别维护存储；数据库向量能力归上游，不能把召回相关性当事实正确。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：自动记忆默认出站，共享空间中agentId不等独立身份；排序不验证事实新鲜度，断线幂等及更正/删除传播仍需检查。[Q03](#research-q03)

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
  - [Q01 · 共享记忆服务相对本地笔记解决什么任务？](#detail-section-11)
  - [Q02 · 检索如何组合关键词和向量，数据边界由什么决定？](#detail-section-12)
  - [Q03 · 自动写入和共享空间最容易产生什么采用误解？](#detail-section-13)
  - [Q04 · 什么团队可试用，首次与持续负担怎样控制？](#detail-section-14)
  - [Q05 · 更正传播验证能否比召回率更接近共享记忆价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多机器或多Agent需要共享可更正事实的团队；仅单人笔记可继续本地文档。[Q01](#research-q01)

共享Markdown、各宿主本地记忆或直接数据库API；服务化改善统一接口，但增加网络、数据与运维责任。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 记忆API | 多runtime事实共享 | tenant key与数据库 |
| 混合查询 | 向量关键词召回 | embedding可用不等事实真值 |
| DSH自动接线 | 召回与有界会话写入 | 可出站数据，默认开启需审 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| mem9端点与空间key | 必需 | 存储检索授权 | 停止远程写入 |
| 匹配数据库schema | 自托管必需 | tenant和记忆持久化 | 不可直接运行 |
| embedding/抽取服务 | 对应模式必需 | 语义检索与整理 | 失败可能使查询错误 |
| 数据出站及保留许可 | 远程使用必需 | 会话内容存储 | 限定非敏感或本地替代 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 建空间 | 用户固定端点和key | 与其他空间隔离 |
| 收窄 | 用户关闭自动ingest | 只写人工确认事实 |
| 核对 | 两Agent读写更正删除 | 无跨空间、旧事实不再生效 |
| 回退 | 用户停止自动使用并导出 | 继续人工项目文档 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 托管空间或Go/数据库；金额未知 | 配schema、密钥、数据政策 | 自托管需运维 |
| 持续使用 | 存储、embedding、抽取和网络 | 更正事实及监控配额 | 价格/任务用量未知 |
| 失败恢复 | 重试、备份及导出资源 | 核对重复写入、删除和密钥 | 一致性未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多runtime共享 | 服务API与薄接入 | 团队最终任务改善 |
| 混合召回 | 向量/关键词RRF融合 | 事实正确、新鲜与成本 |
| 自动记忆 | 完成turn队列和边界 | 抽取质量、删除传播 |

> **思考**：自动记忆默认出站，共享空间中agentId不等独立身份；排序不验证事实新鲜度，断线幂等及更正/删除传播仍需检查。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把跨机器多runtime记忆状态集中到统一API并提供混合召回，减少各客户端分别维护存储；数据库向量能力归上游，不能把召回相关性当事实正确。[Q01](#research-q01) [Q02](#research-q02)

状态与客户端分离、融合路径和有界队列可借鉴；需额外验证key隔离、重发幂等和事实撤回，不能只检查字段。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

自动记忆默认出站，共享空间中agentId不等独立身份；排序不验证事实新鲜度，断线幂等及更正/删除传播仍需检查。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议有共享需求的团队限定隔离空间、先关闭自动ingest，用少量人工确认非敏感事实试用读写更正删除；隔离或传播不明即退回项目文档。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

服务端检索、tenant认证与DSH自动接线有固定源码支持；隔离全链、自动事实质量和删除传播未执行验证。候选事实确认是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、server/internal/middleware/auth.go、server/internal/service/memory.go、dsh-plugin/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读根README、Go认证/记忆服务和DSH接线；未完整审计所有仓储、路由、客户端与托管部署，未运行服务/测试/API。Go不计JS/TS LOC。
- 下一步：固定两Agent空间做已知事实、错误更正、删除、断线重发和导出，测全部费用及最终答案；本轮未执行。[Q05](#research-q05)

**分析版本**

- **仓库**：[mem9-ai/mem9](https://github.com/mem9-ai/mem9)
- **版本号**：未声明（[固定提交 fd63ae8](https://github.com/mem9-ai/mem9/tree/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是自动写入先作为待确认事实，以两Agent更正/删除后的读取一致性和人工负担检验共享价值。[Q05](#research-q05)

固定两Agent空间做已知事实、错误更正、删除、断线重发和导出，测全部费用及最终答案；本轮未执行。[Q05](#research-q05)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 94 | 19353 | — | — | 113827 |
| .ts | source | 133 | 48701 | 44821 | 415 | — |
| .mjs | source | 33 | 9942 | 7591 | 1180 | — |
| .mjs | test | 16 | 7146 | 6410 | 209 | — |
| .ts | test | 55 | 11503 | 10364 | 105 | — |
| .tsx | test | 20 | 5455 | 4907 | 0 | — |
| .tsx | source | 62 | 18880 | 17283 | 117 | — |
| .ts | example | 2 | 68 | 60 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/mem9-ai/mem9/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：共享记忆服务如何存取和隔离事实，自动写入与混合召回是否足以支持团队采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 共享记忆服务相对本地笔记解决什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

多机器或多Agent协作团队需要共享可更正事实和历史，而本地笔记与单宿主记忆分散。mem9提供独立HTTP存储/检索服务、多runtime薄接入及可视化管理；合格结果是被授权的Agent找回正确当前事实并能纠正或删除。相对共享Markdown，它增加统一API与混合召回；相对单插件本地库，它把状态所有权移到服务端。关键业务增量是共享和迁移接口，而非保证记忆真实或任务完成。README托管便利与TiDB能力是作者说明，不能当本轮服务可用性或效果验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-70](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/README.md#L29-L70)

作者提供托管/自托管和凭据步骤。

<details>
<summary>查看原文（42行）</summary>

````text
   - Self-hosted: apply the matching control-plane schema, then start `mnemo-server`:

     ```bash
     cd server
     MNEMO_DSN="user:pass@tcp(host:4000)/mnemos?parseTime=true" go run ./cmd/mnemo-server
     ```

     See [Self-Hosting](#self-hosting) for backend-specific setup details, and [API Reference](#api-reference) for provisioning.

2. Pick your integration guide.

   - [OpenClaw / ClawHub](https://mem9.ai/openclaw-memory)
   - [Hermes Agent](https://github.com/mem9-ai/mem9-hermes-plugin#readme)
   - [Claude Code](claude-plugin/README.md)
   - [OpenCode](opencode-plugin/README.md)
   - [Codex](codex-plugin/README.md)
   - [DeepSeek Harness](dsh-plugin/README.md)
   - [Dify](https://github.com/mem9-ai/mem9-dify-plugin#readme)
   - [Any HTTP client / custom runtime](#api-reference)

3. Set your credentials.

   ```bash
   # Hosted API
   export MEM9_API_URL="https://api.mem9.ai"
   export MEM9_API_KEY="<mem9-api-key>"

   # Self-hosted
   export MEM9_API_URL="http://localhost:8080"
   export MEM9_API_KEY="<mem9-api-key>"
   ```

   For self-hosted deployments, use your server URL and the mem9 API key returned or configured by your provisioning flow.

## Why mem9

mem9 gives coding agents one shared memory layer instead of separate local notebooks and one-off prompt files.

| What mem9 gives you | Why it matters |
|---|---|
| Persistent memory across sessions and machines | Your context survives restarts, laptop switches, and long-running projects |
| Shared memory across agents and workflow platforms | OpenClaw, Hermes Agent, Claude Code, OpenCode, Codex, DeepSeek Harness, Dify apps, and custom clients can recall the same facts |
````

</details>

**依据 2 · 作者声明**：[README.md:75-101](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/README.md#L75-L101)

共享状态和多runtime说明。

<details>
<summary>查看原文（27行）</summary>

```text

| Platform | Integration shape | Install / docs |
|---|---|---|
| OpenClaw | `kind: "memory"` plugin for server-backed shared memory | [OpenClaw / ClawHub install guide](https://mem9.ai/openclaw-memory) |
| Hermes Agent | Memory provider plugin with setup and activation flow | [mem9-hermes-plugin README](https://github.com/mem9-ai/mem9-hermes-plugin#readme) |
| Claude Code | Marketplace plugin with hooks and skills | [`claude-plugin/README.md`](claude-plugin/README.md) |
| OpenCode | Plugin SDK integration loaded from `opencode.json` | [`opencode-plugin/README.md`](opencode-plugin/README.md) |
| Codex | Marketplace plugin with managed hooks and project overrides | [`codex-plugin/README.md`](codex-plugin/README.md) |
| DeepSeek Harness | Native DSH/Cordis bundle with recall, smart ingest, and memory tools | [`dsh-plugin/README.md`](dsh-plugin/README.md) |
| Dify | Tool plugin for Dify Agent apps and Workflow apps, with single-space and multi-space authorization | [mem9-dify-plugin README](https://github.com/mem9-ai/mem9-dify-plugin#readme) |
| Any HTTP client / custom runtime | Direct REST API integration | [API Reference](#api-reference) |

All supported runtimes and platform integrations expose the same core memory flow: store, search, get, update, and delete against the mem9 server API.

## Why the Hosted API

The hosted mem9 API is the fastest way to put persistent memory behind an agent fleet while keeping the option to self-host later.

| Hosted API capability | Why teams start here |
|---|---|
| Hosted mem9 API with instant space provisioning | You can install an agent integration first and skip standing up infrastructure on day one |
| Shared memory across runtimes and platforms | One space can serve OpenClaw, Hermes Agent, Claude Code, OpenCode, Codex, DeepSeek Harness, Dify apps, and custom clients together |
| Managed search and storage | Hybrid recall works out of the box without a separate vector stack or sync layer |
| TiDB Cloud Starter foundation | The hosted path benefits from instant provisioning, native vector search, full-text search, server-side auto-embedding, hybrid search, and MySQL-compatible operational semantics |
| Same API contract as self-hosted mem9 | Moving to your own deployment is a base-URL and credential change, not a plugin rewrite |
| Visual dashboard and product onboarding | Teams can inspect and manage memory without building internal tooling first |

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 检索如何组合关键词和向量，数据边界由什么决定？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

服务Search遇空query转List，有query时清掉SessionID和Source再选autoHybrid、显式embedder、FTS或LIKE；这是跨会话记忆检索设计，不能把会话字段当隔离边界。显式hybrid先生成query向量，取得向量与关键词候选，用RRF融合再加类型权重和分页。embed失败会返回错误，不是自动无损回落纯关键词；因此模型服务也是可用性依赖。认证中间件用X-API-Key查tenant并获取tenant DB，Agent标识来自另一个请求头；后者是来源标签，不等于独立认证用户。可借鉴服务与薄适配分离、可观察融合路径，但完整隔离需沿路由、仓储和数据库权限验收，不能只凭TenantID字段。

#### 证据与依据

**依据 1 · 源码核查**：[server/internal/service/memory.go:223-243](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/server/internal/service/memory.go#L223-L243)

检索清除会话/来源过滤，按后端能力选择路径。

<details>
<summary>查看原文（21行）</summary>

```text
func (s *MemoryService) Search(ctx context.Context, filter domain.MemoryFilter) ([]domain.Memory, int, error) {
	if filter.Query == "" {
		return s.List(ctx, filter)
	}
	searchFilter := filter
	searchFilter.SessionID = ""
	searchFilter.Source = ""

	slog.Info("memory search", "query_len", len(filter.Query), "auto_model", s.autoModel, "fts", s.memories.FTSAvailable())
	if s.autoModel != "" {
		return s.autoHybridSearch(ctx, searchFilter)
	}
	if s.embedder != nil {
		return s.hybridSearch(ctx, searchFilter)
	}
	if s.memories.FTSAvailable() {
		return s.ftsOnlySearch(ctx, searchFilter)
	}
	// FTS probe still running (cold start) — fall back to LIKE-based keyword search.
	slog.Warn("search: FTS not yet available, falling back to keyword search")
	return s.keywordOnlySearch(ctx, searchFilter)
```

</details>

**依据 2 · 源码核查**：[server/internal/service/memory.go:547-566](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/server/internal/service/memory.go#L547-L566)

embed失败直接返回错误。

<details>
<summary>查看原文（20行）</summary>

```text
func (s *MemoryService) hybridSearch(ctx context.Context, filter domain.MemoryFilter) ([]domain.Memory, int, error) {
	limit := filter.Limit
	if limit <= 0 || limit > 200 {
		limit = 10
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}
	fetchLimit := limit * 3

	queryVec, err := s.embedder.Embed(ctx, filter.Query)
	observeRecallEmbeddingRequest(s.embedder, err)
	if err != nil {
		return nil, 0, fmt.Errorf("embed query for search: %w", err)
	}

	vecResults, vecErr := s.memories.VectorSearch(ctx, queryVec, filter, fetchLimit)
	if vecErr != nil {
		return nil, 0, fmt.Errorf("vector search: %w", vecErr)
```

</details>

**依据 3 · 源码核查**：[server/internal/service/memory.go:583-614](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/server/internal/service/memory.go#L583-L614)

关键词、向量与RRF融合。

<details>
<summary>查看原文（32行）</summary>

```text
	var kwResults []domain.Memory
	if s.memories.FTSAvailable() {
		var kwErr error
		kwResults, kwErr = s.repositoryFTSSearch(ctx, filter.Query, filter, fetchLimit)
		if kwErr != nil {
			return nil, 0, fmt.Errorf("FTS search: %w", kwErr)
		}
	} else {
		var kwErr error
		kwResults, kwErr = s.memories.KeywordSearch(ctx, filter.Query, filter, fetchLimit)
		if kwErr != nil {
			return nil, 0, fmt.Errorf("keyword search: %w", kwErr)
		}
	}

	if len(kwResults) == 0 && (len(vecResults) == 0 || !s.memories.FTSAvailable()) && shouldRunLooseKeywordFallback(filter.Query) {
		fallbackResults, fallbackErr := s.looseTokenKeywordSearch(ctx, filter, fetchLimit)
		if fallbackErr != nil {
			return nil, 0, fallbackErr
		}
		kwResults = fallbackResults
	}

	slog.Info("hybrid search completed", "query_len", len(filter.Query), "vec_results", len(vecResults), "kw_results", len(kwResults))

	scores := rrfMerge(kwResults, vecResults)
	mems := collectMems(kwResults, vecResults)
	applyTypeWeights(mems, scores)
	merged := sortByScore(mems, scores)

	page, total := s.paginate(merged, offset, limit)
	return finalizeSearchResults(setScores(page, scores), filter.Query), total, nil
```

</details>

**依据 4 · 源码核查**：[server/internal/middleware/auth.go:415-424](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/server/internal/middleware/auth.go#L415-L424)

API key查找tenant并检查状态。

<details>
<summary>查看原文（10行）</summary>

```text
			lookupStart := time.Now()
			t, err := tenantRepo.GetByID(r.Context(), apiKey)
			lookupDuration := time.Since(lookupStart)
			if err != nil {
				writeError(w, http.StatusBadRequest, "invalid API key")
				return
			}
			if t.DeletedAt != nil || t.Status != domain.TenantActive {
				writeError(w, http.StatusBadRequest, "invalid API key")
				return
```

</details>

**依据 5 · 源码核查**：[server/internal/middleware/auth.go:502-513](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/server/internal/middleware/auth.go#L502-L513)

tenant绑定及可自报AgentName。

<details>
<summary>查看原文（12行）</summary>

```text
			info := &domain.AuthInfo{
				TenantID:      t.ID,
				TenantDB:      db,
				ClusterID:     t.ClusterID,
				APIKeySubject: apiKey,
			}
			if agentID := r.Header.Get(AgentIDHeader); agentID != "" {
				info.AgentName = agentID
			}

			ctx := context.WithValue(r.Context(), authInfoKey, info)
			next.ServeHTTP(w, r.WithContext(ctx))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动写入和共享空间最容易产生什么采用误解？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

DSH接入默认开启recall和ingest，首步查询远程记忆，完整turn结束后把有界消息排入每session队列，关闭时排空或中止。这减少手工复制，但也使聊天进入远端存储；用户必须明确空间、密钥、保留和删除政策，不能把“记忆”理解为只保存在当前机器。共享key对应空间内共享访问，agentId只是来源标记；自动抽取可能把临时猜测写成事实，混合检索高相关不证明当前有效。源码可见队列和限字节降低无界写入风险，却没有在本轮证明断线重试幂等、跨用户隔离或删除已召回上下文的传播。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/index.ts:54-71](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/dsh-plugin/src/index.ts#L54-L71)

自动recall和ingest默认开启并有边界。

<details>
<summary>查看原文（18行）</summary>

```text
export const Config: z<Config> = z.object({
  apiUrl: z.string().default(DEFAULT_API_URL),
  apiKeyEnv: z.string().default(DEFAULT_API_KEY_ENV),
  agentId: z.string().default(DEFAULT_AGENT_ID),
  defaultTimeoutMs: z.number().default(DEFAULT_TIMEOUT_MS),
  searchTimeoutMs: z.number().default(DEFAULT_SEARCH_TIMEOUT_MS),
  includeSubagents: z.boolean().default(false),
  recall: z.object({
    enabled: z.boolean().default(true),
    minQueryChars: z.number().default(5),
    limit: z.number().default(10),
    maxCharsPerMemory: z.number().default(500),
  }),
  ingest: z.object({
    enabled: z.boolean().default(true),
    maxMessages: z.number().default(20),
    maxBytes: z.number().default(204_800),
  }),
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/index.ts:553-580](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/dsh-plugin/src/index.ts#L553-L580)

首步远程检索注入与错误日志。

<details>
<summary>查看原文（28行）</summary>

```text
  ctx.on("agent/pre-step", async ({ agent, step, signal }, next): Promise<PreStepDecision> => {
    const decision = await next();
    if (decision.kind === "reject" || signal.aborted || step !== 1 || !eligible(agent) || !resolved.recall.enabled) {
      return decision;
    }
    const query = messageText(decision.messages);
    if (query.length < resolved.recall.minQueryChars) return decision;
    try {
      const result = await gateway.search({ q: query, limit: resolved.recall.limit, offset: 0 }, signal);
      const memories = memoryRecords(result).slice(0, resolved.recall.limit);
      if (memories.length === 0) return decision;
      return {
        kind: "enter",
        messages: [
          ...decision.messages,
          createUserMessage({
            content: [{ type: "text", text: renderRecall(memories, resolved.recall.maxCharsPerMemory) }],
            source: { kind: "plugin", plugin: name, form: "recall" },
          }),
        ],
      };
    } catch (error: unknown) {
      const notice = quotaNotified.has(agent.session) ? undefined : quotaNotice(error, "recall");
      if (notice !== undefined) {
        quotaNotified.add(agent.session);
        return { kind: "enter", messages: [...decision.messages, notice] };
      }
      ctx.logger.warn(`mem9: automatic recall failed: ${error instanceof Error ? error.message : String(error)}`);
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/index.ts:584-616](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/dsh-plugin/src/index.ts#L584-L616)

完成turn后有界消息排队发送。

<details>
<summary>查看原文（33行）</summary>

```text
  ctx.on("session/event", (session, event) => {
    if (closing || !resolved.ingest.enabled || event.type !== "turn/end" || event.data.reason.kind !== "completed") return;
    const agent = ctx.agents.get(session.id);
    if (agent === undefined || !eligible(agent)) return;
    const messages = boundedTurnMessages(session, event.data.turn, resolved.ingest.maxMessages, resolved.ingest.maxBytes);
    if (!messages.some(message => message.role === "assistant")) return;
    const turns = scheduledTurns.get(session) ?? new Set<number>();
    if (turns.has(event.data.turn)) return;
    turns.add(event.data.turn);
    scheduledTurns.set(session, turns);

    const previous = ingestQueues.get(session.id) ?? Promise.resolve();
    const task = previous.catch(() => undefined).then(async () => {
      try {
        await gateway.ingest({
          messages,
          session_id: session.id,
          agent_id: resolved.agentId,
          mode: "smart",
        }, ingestAbort.signal);
      } catch (error: unknown) {
        const notice = quotaNotified.has(session) ? undefined : quotaNotice(error, "ingest");
        if (notice !== undefined) {
          quotaNotified.add(session);
          agent.inject(notice);
        }
        ctx.logger.warn(`mem9: automatic ingest failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
    const tracked = task.finally(() => {
      if (ingestQueues.get(session.id) === tracked) ingestQueues.delete(session.id);
    });
    ingestQueues.set(session.id, tracked);
```

</details>

#### 缺口

- 自动抽取正确率、断线写入去重及删除传播未核实。
  **影响**：共享错误事实可能放大，不能保证自动记忆可靠。
  **进一步探讨**：固定两Agent空间模拟错误事实、更正、删除和断线重发，检查所有读者。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么团队可试用，首次与持续负担怎样控制？

**研究主题**：效果与总成本、采用判断

#### 完整回答

已有明确共享知识场景、能接受服务端存储的团队可用隔离测试空间试用人工确认事实，先关闭自动ingest，只写少量非敏感记录，再做读、更正和删除。自托管需要Go服务、匹配数据库schema、备份与运维；托管省部署但引入账号、配额和服务策略。持续检索可能调用embedding，写入含抽取与存储，费用、延迟及质量未知，不能把底座额度当免费保证。失败恢复需要处理不可用服务、部分写入、密钥轮换、导出和回退本地文档。若混入另一空间、旧事实更正不生效或无法确认数据删除，应停止自动使用并回到人工维护的项目文档；只读源码不支持持续安装结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-70](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/README.md#L29-L70)

托管/自托管条件及密钥。

<details>
<summary>查看原文（42行）</summary>

````text
   - Self-hosted: apply the matching control-plane schema, then start `mnemo-server`:

     ```bash
     cd server
     MNEMO_DSN="user:pass@tcp(host:4000)/mnemos?parseTime=true" go run ./cmd/mnemo-server
     ```

     See [Self-Hosting](#self-hosting) for backend-specific setup details, and [API Reference](#api-reference) for provisioning.

2. Pick your integration guide.

   - [OpenClaw / ClawHub](https://mem9.ai/openclaw-memory)
   - [Hermes Agent](https://github.com/mem9-ai/mem9-hermes-plugin#readme)
   - [Claude Code](claude-plugin/README.md)
   - [OpenCode](opencode-plugin/README.md)
   - [Codex](codex-plugin/README.md)
   - [DeepSeek Harness](dsh-plugin/README.md)
   - [Dify](https://github.com/mem9-ai/mem9-dify-plugin#readme)
   - [Any HTTP client / custom runtime](#api-reference)

3. Set your credentials.

   ```bash
   # Hosted API
   export MEM9_API_URL="https://api.mem9.ai"
   export MEM9_API_KEY="<mem9-api-key>"

   # Self-hosted
   export MEM9_API_URL="http://localhost:8080"
   export MEM9_API_KEY="<mem9-api-key>"
   ```

   For self-hosted deployments, use your server URL and the mem9 API key returned or configured by your provisioning flow.

## Why mem9

mem9 gives coding agents one shared memory layer instead of separate local notebooks and one-off prompt files.

| What mem9 gives you | Why it matters |
|---|---|
| Persistent memory across sessions and machines | Your context survives restarts, laptop switches, and long-running projects |
| Shared memory across agents and workflow platforms | OpenClaw, Hermes Agent, Claude Code, OpenCode, Codex, DeepSeek Harness, Dify apps, and custom clients can recall the same facts |
````

</details>

**依据 2 · 源码核查**：[server/internal/service/memory.go:547-566](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/server/internal/service/memory.go#L547-L566)

检索embedding是实际持续依赖。

<details>
<summary>查看原文（20行）</summary>

```text
func (s *MemoryService) hybridSearch(ctx context.Context, filter domain.MemoryFilter) ([]domain.Memory, int, error) {
	limit := filter.Limit
	if limit <= 0 || limit > 200 {
		limit = 10
	}
	offset := filter.Offset
	if offset < 0 {
		offset = 0
	}
	fetchLimit := limit * 3

	queryVec, err := s.embedder.Embed(ctx, filter.Query)
	observeRecallEmbeddingRequest(s.embedder, err)
	if err != nil {
		return nil, 0, fmt.Errorf("embed query for search: %w", err)
	}

	vecResults, vecErr := s.memories.VectorSearch(ctx, queryVec, filter, fetchLimit)
	if vecErr != nil {
		return nil, 0, fmt.Errorf("vector search: %w", vecErr)
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/index.ts:54-71](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/dsh-plugin/src/index.ts#L54-L71)

可配置关闭自动写入，适合收窄试验。

<details>
<summary>查看原文（18行）</summary>

```text
export const Config: z<Config> = z.object({
  apiUrl: z.string().default(DEFAULT_API_URL),
  apiKeyEnv: z.string().default(DEFAULT_API_KEY_ENV),
  agentId: z.string().default(DEFAULT_AGENT_ID),
  defaultTimeoutMs: z.number().default(DEFAULT_TIMEOUT_MS),
  searchTimeoutMs: z.number().default(DEFAULT_SEARCH_TIMEOUT_MS),
  includeSubagents: z.boolean().default(false),
  recall: z.object({
    enabled: z.boolean().default(true),
    minQueryChars: z.number().default(5),
    limit: z.number().default(10),
    maxCharsPerMemory: z.number().default(500),
  }),
  ingest: z.object({
    enabled: z.boolean().default(true),
    maxMessages: z.number().default(20),
    maxBytes: z.number().default(204_800),
  }),
```

</details>

#### 缺口

- 无当前服务价格、测试空间运维量与效果任务数据。
  **影响**：无法估算单位合格记忆成本。
  **进一步探讨**：记录一组固定非敏感事实的全部写入/查询费用、延迟和人工更正时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 更正传播验证能否比召回率更接近共享记忆价值？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将自动写入先变为候选事实，再把更正/删除后的跨Agent读取作为验收单元。由Q03的多读者与自动抽取风险推导，创新点在治理交接而不是新增向量数据库。最小验证固定两Agent、同一隔离空间及已知真值，分别写入正确、临时和错误记录后更正/删除；比较现流程与候选确认原型的错误事实进入率、更正传播时间、人工操作数及最终任务答案。若确认步骤没有减少错误或传播仍不一致，就否定原型价值；不把这一设想写为现有服务已实现。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/index.ts:584-616](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/dsh-plugin/src/index.ts#L584-L616)

自动完结后写入形成候选确认的具体动因。

<details>
<summary>查看原文（33行）</summary>

```text
  ctx.on("session/event", (session, event) => {
    if (closing || !resolved.ingest.enabled || event.type !== "turn/end" || event.data.reason.kind !== "completed") return;
    const agent = ctx.agents.get(session.id);
    if (agent === undefined || !eligible(agent)) return;
    const messages = boundedTurnMessages(session, event.data.turn, resolved.ingest.maxMessages, resolved.ingest.maxBytes);
    if (!messages.some(message => message.role === "assistant")) return;
    const turns = scheduledTurns.get(session) ?? new Set<number>();
    if (turns.has(event.data.turn)) return;
    turns.add(event.data.turn);
    scheduledTurns.set(session, turns);

    const previous = ingestQueues.get(session.id) ?? Promise.resolve();
    const task = previous.catch(() => undefined).then(async () => {
      try {
        await gateway.ingest({
          messages,
          session_id: session.id,
          agent_id: resolved.agentId,
          mode: "smart",
        }, ingestAbort.signal);
      } catch (error: unknown) {
        const notice = quotaNotified.has(session) ? undefined : quotaNotice(error, "ingest");
        if (notice !== undefined) {
          quotaNotified.add(session);
          agent.inject(notice);
        }
        ctx.logger.warn(`mem9: automatic ingest failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
    const tracked = task.finally(() => {
      if (ingestQueues.get(session.id) === tracked) ingestQueues.delete(session.id);
    });
    ingestQueues.set(session.id, tracked);
```

</details>

**依据 2 · 源码核查**：[server/internal/service/memory.go:608-614](https://github.com/mem9-ai/mem9/blob/fd63ae82ae2f1d5a65c4123f4125e4b78f750ff2/server/internal/service/memory.go#L608-L614)

召回排序并不检查事实真值。

```text
	scores := rrfMerge(kwResults, vecResults)
	mems := collectMems(kwResults, vecResults)
	applyTypeWeights(mems, scores)
	merged := sortByScore(mems, scores)

	page, total := s.paginate(merged, offset, limit)
	return finalizeSearchResults(setScores(page, scores), filter.Query), total, nil
```

#### 缺口

- 人工确认与更正传播机制的净收益未实测。
  **影响**：仍是研究方向而非成熟功能。
  **进一步探讨**：按同一空间两Agent更正/删除任务做对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
