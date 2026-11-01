# mem9

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b41458d](https://github.com/mem9-ai/mem9/tree/b41458d6f3d516a9a26c3547f06d960dcd785ac4)

<!-- BEGIN META -->
[![GitHub ★ 1,233](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C233&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mem9-ai/mem9)
<!-- END META -->

> **功能**：为 AI Agent 提供跨会话、跨设备的持久共享记忆和检索。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将多客户端持久状态接到统一服务；向量能力归底层，相关性不等于事实正确。

> **主要限制**：[Q03](#research-q03) 部分搜索分支清空 source/session 条件，[Q04](#research-q04) 默认自动出站且异步写入不保证崩溃后送达。

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
  - [Q01 · 多助手需要什么持久记忆，现有本地笔记怎样替代？](#detail-section-11)
  - [Q02 · API 密钥、租户与记忆读写如何关联？](#detail-section-12)
  - [Q03 · 检索如何选语义/关键词，排序和过滤证明什么？](#detail-section-13)
  - [Q04 · DSH 自动召回与写入何时发生，有哪些外发与丢失边界？](#detail-section-14)
  - [Q05 · 部署、密钥、成本及退出需要什么？](#detail-section-15)
  - [Q06 · 能否在共享空间中减少错误记忆跨助手传播？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多助手和多设备用户需要保留、召回及更正长期事实。

本地文件或笔记可手工保存并核对事实。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 空间认证 | 按 key 解析租户或 chain | 不等于 agent 身份隔离 |
| 记忆读写 | 保存、查询、更正、删除 | 各端传播未验证 |
| 条件性检索 | 混合、全文或关键词 | 路由与过滤行为依分支而异 |
| DSH 自动接入 | 首步召回、完成后写入 | 默认开启，可向配置服务出站 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| mem9 服务与 API key | 客户端读写需要 | 空间认证与记忆访问 | 请求失败 |
| 数据库与存储 | 服务需要 | 持久化记忆 | 无法读写或受配置影响 |
| embedding 服务 | 对应混合分支需要 | 向量检索 | 该分支可能报错 |
| DSH 宿主 | DSH 接入需要 | 工具及自动 hook | 不能在该宿主自动运行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选择隔离空间和数据目的地 | 不允许外发时关闭自动读写 |
| 写入 | 手动保存合成事实 | 核对服务返回和所属空间 |
| 召回 | 多助手查询并核对来源 | 无法确认事实时回原文 |
| 恢复 | 检查失败队列、修改及删除 | 状态不明时暂停共享 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 服务、数据库及网络费用未知 | 配置空间与密钥 | 隔离需验证 |
| 持续 | 存储、检索和 embedding 费用未知 | 核验事实及纠错 | 模型准确率未测 |
| 恢复 | 重试、备份和删除成本未知 | 查验跨客户端传播 | 崩溃后队列与幂等未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 共享记忆 | API 认证及读写接口 | 多 agent 安全隔离 |
| 检索 | 混合/全文/关键词分支 | 正确性与全部过滤语义 |
| 自动接入 | 首步召回、完成后排队写入 | 崩溃后送达及撤销传播 |

> **思考**：[Q03](#research-q03) 部分搜索分支清空 source/session 条件，[Q04](#research-q04) 默认自动出站且异步写入不保证崩溃后送达。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将多客户端持久状态接到统一服务；向量能力归底层，相关性不等于事实正确。

[Q02](#research-q02) 普通密钥解析租户而 chain 走不同分支；[Q03](#research-q03) 条件性清空过滤器和 [Q04](#research-q04) 异步队列须分别验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 部分搜索分支清空 source/session 条件，[Q04](#research-q04) 默认自动出站且异步写入不保证崩溃后送达。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先关闭自动写入，在隔离空间用合成事实验证读取、更正和删除；数据授权或传播不明时回本地笔记。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码代表性认证、搜索与 DSH 接线已查；未运行服务、宿主或网络。

- 已检查：作者 README、包清单、源码路径 README.md、server/internal/middleware/auth.go、dsh-plugin/src/index.ts、server/internal/service/memory.go、server/internal/handler/memory.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读根 README、服务 API key 认证、代表性搜索和 DSH 自动 hook；未运行服务、宿主、模型或外部网络，未审计全部 chain、数据库、删除和部署。
- 下一步：以隔离空间和假服务测试不同查询分支、两 agent、更正删除及超时；按 [Q06](#research-q06) 比较错误传播。

**分析版本**

- **仓库**：[mem9-ai/mem9](https://github.com/mem9-ai/mem9)
- **版本号**：未声明（[固定提交 b41458d](https://github.com/mem9-ai/mem9/tree/b41458d6f3d516a9a26c3547f06d960dcd785ac4)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设待确认及版本化撤销可减少共享错误事实传播，须先核现有功能且尚未验证。

以隔离空间和假服务测试不同查询分支、两 agent、更正删除及超时；按 [Q06](#research-q06) 比较错误传播。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 94 | 19400 | — | — | 115009 |
| .ts | source | 133 | 48835 | 44954 | 415 | — |
| .mjs | source | 33 | 9942 | 7591 | 1180 | — |
| .mjs | test | 16 | 7146 | 6410 | 209 | — |
| .ts | test | 55 | 11503 | 10364 | 105 | — |
| .tsx | test | 20 | 5455 | 4907 | 0 | — |
| .tsx | source | 62 | 18880 | 17283 | 117 | — |
| .ts | example | 2 | 68 | 60 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 54](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=54&color=737b86&logo=github)](https://github.com/mem9-ai/mem9/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/mem9-ai/mem9/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/mem9-ai/mem9/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查记忆服务租户、检索、DSH 自动读写及数据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多助手需要什么持久记忆，现有本地笔记怎样替代？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:4-6 描述跨会话、跨机器和多助手共享记忆；24-45 给出托管或自托管服务和多种客户端。手工文件或笔记也可保存事实，但需各助手自行查找和更正；服务将读写集中到一个 API 并提供检索，数据真实性和实际节时尚未对照。它是独立记忆服务及客户端集合，不是仅有 DSH 插件；底层向量索引或模型能力归对应依赖，不归为项目首创。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:4-6](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/README.md#L4-L6)

作者描述跨会话与共享场景。

```text
<p align="center">
  <strong>Persistent Memory for AI Agents.</strong><br/>
  Your agents forget everything between sessions. mem9 fixes that with persistent memory across sessions and machines, shared memory for multi-agent workflows, and hybrid recall with a visual dashboard.
```

**依据 2 · 作者声明**：[README.md:24-45](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/README.md#L24-L45)

作者说明服务部署与接入。

<details>
<summary>查看原文（22行）</summary>

````text
## Quick Start

1. Choose your mem9 endpoint.

   - Hosted API: `https://api.mem9.ai`
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
````

</details>

**依据 3 · 作者声明**：[README.md:118-126](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/README.md#L118-L126)

作者描述记忆读写 API。

```text
### Preferred API (`v1alpha2`)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/v1alpha2/mem9s/memories` | Preferred unified write endpoint. Requires `X-API-Key` header |
| `GET` | `/v1alpha2/mem9s/memories` | Preferred search endpoint. Requires `X-API-Key` header |
| `GET` | `/v1alpha2/mem9s/memories/{id}` | Preferred get-by-id endpoint. Requires `X-API-Key` header |
| `PUT` | `/v1alpha2/mem9s/memories/{id}` | Preferred update endpoint. Requires `X-API-Key` header |
| `DELETE` | `/v1alpha2/mem9s/memories/{id}` | Preferred delete endpoint. Requires `X-API-Key` header |
```

#### 缺口

- 无实际多助手任务与本地笔记对照
  **影响**：不能推断记忆质量、节时或真实需求
  **进一步探讨**：固定任务比较共享服务与人工查写笔记。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · API 密钥、租户与记忆读写如何关联？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

auth.go:352-389 读取 X-API-Key，缺失拒绝；chain_ 前缀走 Space Chain 的单独解析。438-465 的普通密钥路径按凭据解析 tenant，拒绝不存在/已删除/非活动租户，解密数据库凭据并取得对应连接。README:118-126 描述记忆的增查改删接口，DSH index.ts:208-229 在请求中发送密钥和 agentId。后者是请求所附标签，不凭此推定单独的租户认证或各 agent 隔离；链身份、共享密钥、服务配置及各仓储隔离仍需端到端核验。

#### 证据与依据

**依据 1 · 源码核查**：[server/internal/middleware/auth.go:352-389](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/server/internal/middleware/auth.go#L352-L389)

缺失密钥与 chain key 路径。

<details>
<summary>查看原文（38行）</summary>

```text
func ResolveApiKey(
	tenantRepo repository.TenantRepo,
	pool tenantDBGetter,
	enc encrypt.Encryptor,
	clusterBlacklist map[string]struct{},
	opts ...authOption,
) func(http.Handler) http.Handler {
	state := authConfig{}
	for _, opt := range opts {
		if opt != nil {
			opt(&state)
		}
	}
	_ = state

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authStart := time.Now()
			apiKey := strings.TrimSpace(r.Header.Get(APIKeyHeader))
			if apiKey == "" {
				writeError(w, http.StatusBadRequest, "missing API key")
				return
			}

			if strings.HasPrefix(apiKey, domain.ChainKeyPrefix) {
				if state.spaceChains == nil {
					writeError(w, http.StatusServiceUnavailable, "space chain auth unavailable")
					return
				}
				chainLookupStart := time.Now()
				chain, err := state.spaceChains.GetByKey(r.Context(), apiKey)
				chainLookupDuration := time.Since(chainLookupStart)
				if err != nil {
					writeError(w, http.StatusBadRequest, "invalid API key")
					return
				}
				if len(chain.Nodes) == 0 {
					writeError(w, http.StatusBadRequest, "Space Chain has no nodes.")
```

</details>

**依据 2 · 源码核查**：[server/internal/middleware/auth.go:438-465](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/server/internal/middleware/auth.go#L438-L465)

普通密钥解析租户及连接。

<details>
<summary>查看原文（28行）</summary>

```text
			lookupStart := time.Now()
			t, err := lookupCredentialTenant(r.Context(), tenantRepo, apiKey, state.credentials)
			lookupDuration := time.Since(lookupStart)
			if err != nil {
				if state.credentials != nil && !errors.Is(err, domain.ErrNotFound) {
					writeError(w, http.StatusServiceUnavailable, "auth backend unavailable; retry request")
					return
				}
				writeError(w, http.StatusBadRequest, "invalid API key")
				return
			}
			if t.DeletedAt != nil || t.Status != domain.TenantActive {
				writeError(w, http.StatusBadRequest, "invalid API key")
				return
			}

			// Decrypt password before using
			decryptStart := time.Now()
			decryptedPassword, err := enc.Decrypt(r.Context(), t.DBPassword)
			decryptDuration := time.Since(decryptStart)
			if err != nil {
				writeError(w, http.StatusInternalServerError, "failed to decrypt tenant credentials")
				return
			}
			t.DBPassword = decryptedPassword

			poolStart := time.Now()
			db, err := pool.Get(r.Context(), t.ID, t.DSNForBackend(pool.Backend()))
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/index.ts:208-229](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/dsh-plugin/src/index.ts#L208-L229)

DSH 请求的认证和 agent 标签。

<details>
<summary>查看原文（22行）</summary>

```text
  private async request(
    method: string,
    path: string,
    body: JsonValue | undefined,
    callerSignal: AbortSignal,
    timeoutMs: number,
  ): Promise<Record<string, JsonValue>> {
    const credential = await this.ctx.credentials.resolve(this.config.apiKeyRef);
    if (credential === undefined) throw new Error(`mem9 credential ${this.config.apiKeyRef} is not configured`);
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const signal = AbortSignal.any([callerSignal, timeoutSignal]);
    const response = await fetch(`${this.config.apiUrl}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        "x-api-key": credential.value,
        "x-mnemo-agent-id": this.config.agentId,
        "user-agent": "@mem9/dsh-plugin/0.1.0",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
```

</details>

**依据 4 · 作者声明**：[README.md:118-126](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/README.md#L118-L126)

作者列出的记忆 API。

```text
### Preferred API (`v1alpha2`)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/v1alpha2/mem9s/memories` | Preferred unified write endpoint. Requires `X-API-Key` header |
| `GET` | `/v1alpha2/mem9s/memories` | Preferred search endpoint. Requires `X-API-Key` header |
| `GET` | `/v1alpha2/mem9s/memories/{id}` | Preferred get-by-id endpoint. Requires `X-API-Key` header |
| `PUT` | `/v1alpha2/mem9s/memories/{id}` | Preferred update endpoint. Requires `X-API-Key` header |
| `DELETE` | `/v1alpha2/mem9s/memories/{id}` | Preferred delete endpoint. Requires `X-API-Key` header |
```

#### 缺口

- 未核全部 chain 权限、部署与数据库隔离
  **影响**：不能证明共享密钥下不同 agent 是独立安全主体
  **进一步探讨**：隔离两租户及多 agent 验证认证、越权和撤销。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 检索如何选语义/关键词，排序和过滤证明什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

service/memory.go:223-243 对空查询调用 List；非空查询复制过滤器并清空 SessionID 和 Source，再依据 autoModel、embedder、FTS 可用性选择混合、全文或关键词路径。547-566 的混合分支先调用 embedding，再查向量；embedding 或向量报错会返回错误，而不是在此分支保证关键词成功。handler/memory.go:801-808 构造 source、session 等字段，925-947 中存在分发到 memory.Search 的分支，但同处理器还有其他特化查询和 chain 分支，因此此处只说明该服务分支，不推断所有请求相同。DSH 工具声明 source 筛选，实际语义须在所用路由上验证；相似度和可检索也不能证明事实正确或最新。

#### 证据与依据

**依据 1 · 源码核查**：[server/internal/service/memory.go:223-243](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/server/internal/service/memory.go#L223-L243)

非空 memory.Search 清空两个字段及选路。

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

**依据 2 · 源码核查**：[server/internal/service/memory.go:547-566](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/server/internal/service/memory.go#L547-L566)

混合分支 embedding 和向量错误。

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

**依据 3 · 源码核查**：[server/internal/handler/memory.go:801-808](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/server/internal/handler/memory.go#L801-L808)

HTTP 参数构造过滤器。

```text
	filter := domain.MemoryFilter{
		Query:      query,
		Tags:       tags,
		Source:     q.Get("source"),
		State:      q.Get("state"),
		MemoryType: q.Get("memory_type"),
		AgentID:    q.Get("agent_id"),
		SessionID:  q.Get("session_id"),
```

**依据 4 · 源码核查**：[server/internal/handler/memory.go:925-947](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/server/internal/handler/memory.go#L925-L947)

handler 的不同查询分支。

<details>
<summary>查看原文（23行）</summary>

```text
			memories, total, err = s.listChainMemoriesContentKeyword(listCtx, auth, filter)
		} else {
			memories, total, err = s.listChainMemories(listCtx, auth, filter)
		}
	} else {
		svc := s.resolveServices(auth)
		switch {
		case filter.Query == "" && filter.MemoryType == "":
			memories, total, err = svc.memory.ListAllTypes(listCtx, filter)
		case filter.Query != "" && contentKeywordSearch:
			memories, total, err = s.listLocalMemoriesContentKeyword(listCtx, svc, filter)
		case filter.Query != "" && filter.ScanAll:
			memories, total, err = s.listLocalMemoriesScanAll(listCtx, svc, filter)
		case filter.Query != "" && filter.MemoryType == "":
			memories, total, err = s.defaultConfidenceRecallSearch(listCtx, auth, svc, filter)
		case filter.Query != "" && (filter.MemoryType == string(domain.TypeSession) ||
			filter.MemoryType == string(domain.TypePinned) ||
			filter.MemoryType == string(domain.TypeInsight)):
			memories, total, err = s.singlePoolConfidenceRecallSearch(listCtx, auth, svc, filter)
		case onlySession:
			memories, total, err = svc.session.List(listCtx, filter)
		case !onlySession:
			memories, total, err = svc.memory.Search(listCtx, filter)
```

</details>

**依据 5 · 源码核查**：[dsh-plugin/src/index.ts:419-425](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/dsh-plugin/src/index.ts#L419-L425)

DSH 工具声明 source 查询参数。

```text
const searchParameters = {
  q: { type: "string", description: "Search query" },
  tags: { type: "string", description: "Comma-separated tags to filter by (AND)" },
  source: { type: "string", description: "Filter by source agent" },
  limit: { type: "integer", description: "Max results (default 20, max 200)" },
  offset: { type: "integer", description: "Pagination offset" },
  memory_type: { type: "string", description: "Comma-separated memory types" },
```

#### 缺口

- 未运行 DSH 查询实际所走的专用分支、全部后端及过滤
  **影响**：不能声称所有 API 忽略 source 或具备同等隔离
  **进一步探讨**：对普通、chain、session 和 content 搜索逐支插入多来源记录验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · DSH 自动召回与写入何时发生，有哪些外发与丢失边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

dsh-plugin/index.ts:20-24、53-70 默认托管 URL，recall 和 ingest 默认开启；553-574 在 next 后仅首步、合格且满足最小字符时查询并将记忆加为用户消息，失败保留原决策。584-616 在正常 completed turn 后截取有界消息，按 session 链式排队调用 smart ingest，失败仅告警；622-632 卸载时等待队列并设置超时后中止。208-229 将 API key 和消息发送到配置 URL；默认可能向外部服务发送对话。内存队列、去重和卸载等待不证明崩溃后持久送达、无重复或召回事实可信。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/index.ts:20-24](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/dsh-plugin/src/index.ts#L20-L24)

默认服务与 timeout 常量。

```text
const DEFAULT_API_URL = "https://api.mem9.ai";
const DEFAULT_API_KEY_ENV = "MEM9_API_KEY";
const DEFAULT_AGENT_ID = "deepseek-harness";
const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_SEARCH_TIMEOUT_MS = 15_000;
```

**依据 2 · 源码核查**：[dsh-plugin/src/index.ts:53-70](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/dsh-plugin/src/index.ts#L53-L70)

召回和写入默认及大小限制。

<details>
<summary>查看原文（18行）</summary>

```text
/** Loader configuration schema. */
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
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/index.ts:208-229](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/dsh-plugin/src/index.ts#L208-L229)

请求与凭据发送。

<details>
<summary>查看原文（22行）</summary>

```text
  private async request(
    method: string,
    path: string,
    body: JsonValue | undefined,
    callerSignal: AbortSignal,
    timeoutMs: number,
  ): Promise<Record<string, JsonValue>> {
    const credential = await this.ctx.credentials.resolve(this.config.apiKeyRef);
    if (credential === undefined) throw new Error(`mem9 credential ${this.config.apiKeyRef} is not configured`);
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const signal = AbortSignal.any([callerSignal, timeoutSignal]);
    const response = await fetch(`${this.config.apiUrl}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        "x-api-key": credential.value,
        "x-mnemo-agent-id": this.config.agentId,
        "user-agent": "@mem9/dsh-plugin/0.1.0",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/src/index.ts:553-581](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/dsh-plugin/src/index.ts#L553-L581)

首步召回和失败退回。

<details>
<summary>查看原文（29行）</summary>

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
      return decision;
```

</details>

**依据 5 · 源码核查**：[dsh-plugin/src/index.ts:584-616](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/dsh-plugin/src/index.ts#L584-L616)

完成后排队写入与失败告警。

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

**依据 6 · 源码核查**：[dsh-plugin/src/index.ts:622-632](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/dsh-plugin/src/index.ts#L622-L632)

卸载 drain 与中止。

<details>
<summary>查看原文（11行）</summary>

```text
  ctx.effect(() => async () => {
    closing = true;
    const drain = Promise.allSettled([...ingestQueues.values()]);
    const timeout = setTimeout(() => ingestAbort.abort(new Error("mem9 ingest drain timed out")), resolved.defaultTimeoutMs);
    try {
      await drain;
    } finally {
      clearTimeout(timeout);
      ingestAbort.abort(new Error("mem9 plugin unloaded"));
    }
    ingestQueues.clear();
```

</details>

#### 缺口

- 未测试崩溃、超时、重复请求或实际外发
  **影响**：不能保证持久送达、幂等或隐私
  **进一步探讨**：隔离本地服务按故障点计数并检查实际请求体。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 部署、密钥、成本及退出需要什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

README:24-36 提供托管与自托管两种路径，后者需要准备服务和数据库；118-126 指明 API 认证。DSH 默认启用自动读写，采用者需要可信服务、隔离空间和凭据、可用网络及人工更正流程；服务模型、索引存储及人工审核会有尚未量化的现金/资源成本。用户可先关闭自动 ingest、使用隔离空间和合成事实手动试读写，再核对删除；若授权、数据位置或删除传播不明，停止自动共享并回本地笔记。没有运行或核对托管服务价格，不能推断免费或实时一致。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-36](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/README.md#L24-L36)

托管与自托管部署。

<details>
<summary>查看原文（13行）</summary>

````text
## Quick Start

1. Choose your mem9 endpoint.

   - Hosted API: `https://api.mem9.ai`
   - Self-hosted: apply the matching control-plane schema, then start `mnemo-server`:

     ```bash
     cd server
     MNEMO_DSN="user:pass@tcp(host:4000)/mnemos?parseTime=true" go run ./cmd/mnemo-server
     ```

     See [Self-Hosting](#self-hosting) for backend-specific setup details, and [API Reference](#api-reference) for provisioning.
````

</details>

**依据 2 · 作者声明**：[README.md:118-126](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/README.md#L118-L126)

作者列出的增查改删。

```text
### Preferred API (`v1alpha2`)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/v1alpha2/mem9s/memories` | Preferred unified write endpoint. Requires `X-API-Key` header |
| `GET` | `/v1alpha2/mem9s/memories` | Preferred search endpoint. Requires `X-API-Key` header |
| `GET` | `/v1alpha2/mem9s/memories/{id}` | Preferred get-by-id endpoint. Requires `X-API-Key` header |
| `PUT` | `/v1alpha2/mem9s/memories/{id}` | Preferred update endpoint. Requires `X-API-Key` header |
| `DELETE` | `/v1alpha2/mem9s/memories/{id}` | Preferred delete endpoint. Requires `X-API-Key` header |
```

**依据 3 · 源码核查**：[dsh-plugin/src/index.ts:53-70](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/dsh-plugin/src/index.ts#L53-L70)

自动功能默认及限制。

<details>
<summary>查看原文（18行）</summary>

```text
/** Loader configuration schema. */
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
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/src/index.ts:208-229](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/dsh-plugin/src/index.ts#L208-L229)

服务 URL、认证和请求。

<details>
<summary>查看原文（22行）</summary>

```text
  private async request(
    method: string,
    path: string,
    body: JsonValue | undefined,
    callerSignal: AbortSignal,
    timeoutMs: number,
  ): Promise<Record<string, JsonValue>> {
    const credential = await this.ctx.credentials.resolve(this.config.apiKeyRef);
    if (credential === undefined) throw new Error(`mem9 credential ${this.config.apiKeyRef} is not configured`);
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    const signal = AbortSignal.any([callerSignal, timeoutSignal]);
    const response = await fetch(`${this.config.apiUrl}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        "x-api-key": credential.value,
        "x-mnemo-agent-id": this.config.agentId,
        "user-agent": "@mem9/dsh-plugin/0.1.0",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
```

</details>

#### 缺口

- 未验证实际托管费用、删除传播及恢复
  **影响**：无法估计总成本或承诺删除后彻底清理
  **进一步探讨**：隔离空间记录账单、备份与删除后各客户端表现。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否在共享空间中减少错误记忆跨助手传播？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

当前 API 已有更新、删除和多 agent 输入，DSH 也自动写入并检索；简单增加共享存储或删除按钮不构成增量。未验证设想是自动提取结果先进入隔离的待确认区，并为共享事实绑定来源、版本和撤销状态；明确用户确认后才向其他 agent 公开，修订或删除后先传播撤销，无法确认同步时返回 unknown 而非旧事实。该方案依赖服务提供可靠的版本、授权和撤销传播，不能把 agentId 标签当独立身份。对照当前自动写入，用两个 agent、矛盾事实、离线后重连、用户拒绝、更正和删除测错误事实传播、漏召回、确认耗时、滞后和敏感数据泄露；若已撤销仍被当现行、确认负担过大或错误传播不降则否定。尚未实现，也未穷尽核心是否有等价待审功能。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:118-126](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/README.md#L118-L126)

现有增查改删。

```text
### Preferred API (`v1alpha2`)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/v1alpha2/mem9s/memories` | Preferred unified write endpoint. Requires `X-API-Key` header |
| `GET` | `/v1alpha2/mem9s/memories` | Preferred search endpoint. Requires `X-API-Key` header |
| `GET` | `/v1alpha2/mem9s/memories/{id}` | Preferred get-by-id endpoint. Requires `X-API-Key` header |
| `PUT` | `/v1alpha2/mem9s/memories/{id}` | Preferred update endpoint. Requires `X-API-Key` header |
| `DELETE` | `/v1alpha2/mem9s/memories/{id}` | Preferred delete endpoint. Requires `X-API-Key` header |
```

**依据 2 · 源码核查**：[dsh-plugin/src/index.ts:584-616](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/dsh-plugin/src/index.ts#L584-L616)

当前自动完成后写入。

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

**依据 3 · 源码核查**：[server/internal/service/memory.go:223-243](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/server/internal/service/memory.go#L223-L243)

检索路径及过滤边界。

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

**依据 4 · 源码核查**：[server/internal/middleware/auth.go:438-465](https://github.com/mem9-ai/mem9/blob/b41458d6f3d516a9a26c3547f06d960dcd785ac4/server/internal/middleware/auth.go#L438-L465)

当前普通密钥按租户解析。

<details>
<summary>查看原文（28行）</summary>

```text
			lookupStart := time.Now()
			t, err := lookupCredentialTenant(r.Context(), tenantRepo, apiKey, state.credentials)
			lookupDuration := time.Since(lookupStart)
			if err != nil {
				if state.credentials != nil && !errors.Is(err, domain.ErrNotFound) {
					writeError(w, http.StatusServiceUnavailable, "auth backend unavailable; retry request")
					return
				}
				writeError(w, http.StatusBadRequest, "invalid API key")
				return
			}
			if t.DeletedAt != nil || t.Status != domain.TenantActive {
				writeError(w, http.StatusBadRequest, "invalid API key")
				return
			}

			// Decrypt password before using
			decryptStart := time.Now()
			decryptedPassword, err := enc.Decrypt(r.Context(), t.DBPassword)
			decryptDuration := time.Since(decryptStart)
			if err != nil {
				writeError(w, http.StatusInternalServerError, "failed to decrypt tenant credentials")
				return
			}
			t.DBPassword = decryptedPassword

			poolStart := time.Now()
			db, err := pool.Get(r.Context(), t.ID, t.DSNForBackend(pool.Backend()))
```

</details>

#### 缺口

- 未核所有版本协议及待审机制，也无双 agent 原型
  **影响**：无法证明方案增量与撤销传播收益
  **进一步探讨**：先核现有空间权限及机制，再做受控双 agent 对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
