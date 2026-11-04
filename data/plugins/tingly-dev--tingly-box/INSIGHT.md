# Tingly Box

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[501a750](https://github.com/tingly-dev/tingly-box/tree/501a750bb4c468a2057fb8157bd1760b468ad026)

<!-- BEGIN META -->
[![GitHub ★ 379](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=379&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tingly-dev/tingly-box)
<!-- END META -->

> **功能**：统一模型网关，为客户端与团队提供协议入口、路由和管理能力。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将协议入口、规则和服务选择集中；具体兼容与收益未测。

> **主要限制**：[Q03](#research-q03) 首块后不再重试且所有候选不健康时仍可能请求；[Q04](#research-q04) 两份 DSH 配置分别写入。

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
  - [Q01 · 统一网关面向谁，相对于客户端直连增加什么？](#detail-section-11)
  - [Q02 · 请求如何从认证入口走到服务选择及协议分派？](#detail-section-12)
  - [Q03 · 故障转移与健康筛选有哪些不可忽略的边界？](#detail-section-13)
  - [Q04 · 团队身份与 DSH 配置写入的边界是什么？](#detail-section-14)
  - [Q05 · 何种条件值得小范围观察，退出和成本是什么？](#detail-section-15)
  - [Q06 · 如何帮助管理员确认一次路由符合预期和费用边界？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要管理多个模型、客户端或团队入口的个人和管理员，集中配置规则与凭据。

客户端直连提供商或人工维护多个网关端点；用户 Agent 的任务执行仍在客户端。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 协议入口 | 统一不同客户端调用 | 不保证协议完全等价 |
| 规则故障转移 | 首块前转候选服务 | 首块后不能重试 |
| 团队 key | 限制模型入口 | 全链隔离未验 |
| DSH 配置 | 写入端点和凭据 | 两文件非统一事务 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| 网关进程和配置 | 必需 | 注册服务与规则 | 客户端请求失败 |
| 上游凭据和模型 | 转发必需 | 请求目标提供商 | 认证或任务失败 |
| 客户端协议及模型兼容 | 对接必需 | 正确传递任务 | 字段或行为可能不符 |
| 备份 | 修改 DSH 配置前 | 恢复两份文件 | 部分写入难以恢复 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 管理员备份配置并划定凭据范围 | 缺备份则停止 |
| 配置 | 单客户端连接单提供商 | 确认正确模型与 scope |
| 验证 | 核对文本、工具、流和失败 | 不匹配时恢复直连 |
| 扩展 | 验证团队和费用后逐步扩流 | 发现越权或费用异常即停 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 网关、存储、凭据 | 配置与权限审查 | 兼容性未知 |
| 持续 | 上游请求、日志及可能重试 | 轮换凭据和查错 | 实际费用与延迟未知 |
| 恢复 | 原客户端配置与备份 | 停流、检查部分写入 | 恢复时间未测 |

| 结果 | 依据 | 未知 |
|---|---|---|
| 统一入口 | 路由和认证源码 | 全客户端语义兼容 |
| 首块前切换 | 故障转移代码 | 实际重复请求和成本 |
| 团队 key | 共享 key 路由约束 | 全链数据隔离 |

> **思考**：[Q03](#research-q03) 首块后不再重试且所有候选不健康时仍可能请求；[Q04](#research-q04) 两份 DSH 配置分别写入。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将协议入口、规则和服务选择集中；具体兼容与收益未测。

[Q03](#research-q03) 首块门控避免提交后拼接另一次响应，健康降级保留错误可观测；需测试流中断和竞态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 首块后不再重试且所有候选不健康时仍可能请求；[Q04](#research-q04) 两份 DSH 配置分别写入。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 在隔离本机先测单客户端与失败路径；不满足身份、预算或恢复条件时退回原端点。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本定向检查 Go 源码，未启动目标、模型服务或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、internal/server/server_routes.go、internal/protocolserver/routes.go、internal/protocolserver/openai_chat.go、internal/protocolserver/failover_dispatch.go、internal/routing/stage_health.go、internal/middleware/auth.go、internal/config/apply_config_dsh.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查服务器入口、OpenAI chat 代表路径、共享 key、优先级故障转移、健康筛选与 DSH 配置；未全审全部协议、团队隔离与界面。
- 下一步：隔离环境模拟双团队、不同上游协议、流式故障与 DSH 双文件恢复；真实费用和延迟需另行测量。

**分析版本**

- **仓库**：[tingly-dev/tingly-box](https://github.com/tingly-dev/tingly-box)
- **版本号**：未声明（[固定提交 501a750](https://github.com/tingly-dev/tingly-box/tree/501a750bb4c468a2057fb8157bd1760b468ad026)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设将规则版本和语义核对关联现有 trace 有助定位错路，需对照证伪。

隔离环境模拟双团队、不同上游协议、流式故障与 DSH 双文件恢复；真实费用和延迟需另行测量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 228 | 46368 | — | — | 456254 |
| .mjs | source | 4 | 597 | 349 | 211 | — |
| .md | example | 3 | 361 | — | — | 1101 |
| .js | source | 3 | 861 | 568 | 173 | — |
| .ts | source | 364 | 44922 | 37087 | 5372 | — |
| .ts | test | 79 | 6541 | 5454 | 385 | — |
| .tsx | source | 461 | 84782 | 74446 | 6476 | — |
| .tsx | test | 64 | 4937 | 4438 | 91 | — |
| .md | test | 2 | 120 | — | — | 389 |
| .cjs | source | 1 | 46 | 35 | 6 | — |
| .mjs | test | 2 | 551 | 465 | 44 | — |

</details>

**活跃度**

[![Issue 未关闭 79](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=79&color=737b86&logo=github)](https://github.com/tingly-dev/tingly-box/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查模型网关入口、身份、选路与失败恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一网关面向谁，相对于客户端直连增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Tingly Box 是独立 Go 模型网关和管理服务，不是原生 DSH 插件。个人或团队管理员可以在统一入口配置模型和规则，让多个客户端接入；基线是客户端直接连接单个提供商或人工维护多个端点。相对于直连，它提供协议入口、规则与凭据的集中位置，但用户 Agent 的规划和文件执行仍在客户端；作者声称任意 Agent 与模型兼容及小于 1ms 开销，本次未独立验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-41](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/README.md#L19-L41)

作者对统一网关与性能的主张。

<details>
<summary>查看原文（23行）</summary>

```text
Tingly Box **connects any agent to any model** — for you and your whole team, with built-in power-ups.

## Key Features

* **Any Agent ⇄ Any Model**
  * Unified endpoint for AI — bridge any providers, with protocols translated both ways
  * One-click config for Agents — Claude Code, OpenCode, Codex, Xcode, and more
  * Profiles for Claude Code — switch models for different scenarios
  * Both API keys and OAuth — use your existing quotas anywhere
  * Smart Routing — route across models and tokens by cost, speed, or custom policies
* **Team AI Management**
  * Shared team endpoint with centrally managed model rules
  * Dedicated keys per member, with data isolated per user
  * Per-member usage tracking
* **Power-ups**
  * Guardrails, MCP Gateway, and Usage Analytics
  * Image API — image generation and editing through the same gateway, with a built-in playground
  * Remote Control — drive agents via Telegram, Weixin, WeCom, Feishu, Lark, and DingTalk
* **Production-Ready**
  * VModel (Virtual Model) — for testing, validation, and benchmarking
  * Harness-driven for robustness across protocols, routing, and clients
  * UX-first visual management of providers, models, team, and remote bots
  * Blazing fast — typically adds **< 1ms** of overhead
```

</details>

**依据 2 · 源码核查**：[internal/server/server_routes.go:27-48](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/server/server_routes.go#L27-L48)

宿主注册模型网关。

<details>
<summary>查看原文（22行）</summary>

```text
func (s *Server) setupRoutes(ctx context.Context) {

	s.UseAIEndpoints()

	s.UseLoadBalanceEndpoints()

	// Multi-tenant token management API
	s.UseTokenManagementEndpoints()

	// Virtual model endpoints for testing
	s.UseVirtualModelEndpoints()

	// Integrate Web UI routes if enabled
	if s.enableUI {
		s.UseUIEndpoints(ctx)
	}
}

func (s *Server) UseAIEndpoints() {
	// The gateway route shape (/tingly/:scenario[/v1]/...) is owned by
	// protocolserver; the host only supplies the engine and model auth.
	s.aiHandler.RegisterRoutes(s.engine, s.getModelAuthMiddleware())
```

</details>

**依据 3 · 源码核查**：[internal/protocolserver/routes.go:48-98](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/routes.go#L48-L98)

scenario 路由与多个协议入口。

<details>
<summary>查看原文（51行）</summary>

```text
// RegisterRoutes mounts the LLM gateway surface (/tingly/:scenario[/v1]/...)
// onto engine. modelAuth gates every model endpoint (model API-token trust
// domain — distinct from the host's user/admin auth).
//
// The host server owns the gin engine and the auth middleware; this package
// owns the route shape and the handlers behind it.
func (ph *ProtocolHandler) RegisterRoutes(engine *gin.Engine, modelAuth gin.HandlerFunc) {
	// scenario routes with middleware to inject scenario into context.
	// legacyScenarioAliasMiddleware runs first so a deprecated scenario id
	// (e.g. "agent" -> "custom") is rewritten before profileAliasMiddleware
	// parses any profile suffix on it. profileAliasMiddleware then rewrites a
	// profile name alias (e.g. "claude_code:mine") to its canonical ID form
	// ("claude_code:p1")
	// before contextMiddleware validates and downstream stages consume it.
	scenario := engine.Group("/tingly/:scenario")
	scenario.Use(middleware.ClearServerIOTimeouts())
	scenario.Use(ph.legacyScenarioAliasMiddleware)
	scenario.Use(ph.profileAliasMiddleware)
	scenario.Use(ph.contextMiddleware)
	// tracingMiddleware runs after profileAliasMiddleware so the span's
	// scenario reflects the canonical "base:pN" form, matching usage records.
	scenario.Use(ph.tracingMiddleware)
	ph.SetupMixinEndpoints(scenario, modelAuth)
	// Claude Code v2.1+ sends HEAD <ANTHROPIC_BASE_URL> as a connectivity
	// check before making any API call. Respond 200 so CC doesn't treat the
	// missing route as a server error and spiral into api_retry storms.
	scenario.HEAD("", func(c *gin.Context) { c.Status(http.StatusOK) })

	// scenario v1 routes with middleware
	scenarioV1 := engine.Group("/tingly/:scenario/v1")
	scenarioV1.Use(middleware.ClearServerIOTimeouts())
	scenarioV1.Use(ph.legacyScenarioAliasMiddleware)
	scenarioV1.Use(ph.profileAliasMiddleware)
	scenarioV1.Use(ph.contextMiddleware)
	scenarioV1.Use(ph.tracingMiddleware)
	ph.SetupMixinEndpoints(scenarioV1, modelAuth)
	scenarioV1.HEAD("", func(c *gin.Context) { c.Status(http.StatusOK) })
}

// SetupMixinEndpoints registers the protocol-mixed endpoint set (OpenAI +
// Anthropic surfaces on one group), each gated by modelAuth.
func (ph *ProtocolHandler) SetupMixinEndpoints(group *gin.RouterGroup, modelAuth gin.HandlerFunc) {
	// Chat completions endpoint (OpenAI compatible)
	group.POST("/chat/completions", ph.modelAuthChain(modelAuth, ph.teamScopeMiddleware, ph.HandleOpenAIChatCompletions)...)

	// Responses API endpoints (OpenAI compatible)
	group.POST("/responses", ph.modelAuthChain(modelAuth, ph.teamScopeMiddleware, ph.HandleResponsesCreate)...)
	group.GET("/responses/:id", ph.modelAuthChain(modelAuth, ph.teamScopeMiddleware, ph.HandleResponsesGet)...)

	// Chat completions endpoint (Anthropic compatible)
	group.POST("/messages", ph.modelAuthChain(modelAuth, ph.teamScopeMiddleware, ph.HandleAnthropicMessages)...)
```

</details>

#### 缺口

- 没有逐客户端同条件任务对照
  **影响**：无法证明所有协议语义和性能收益
  **进一步探讨**：用固定客户端、工具和流式任务对照直连。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求如何从认证入口走到服务选择及协议分派？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

服务将模型认证中间件传给 protocolserver，scenario 和 v1 变体挂载 OpenAI chat、Responses 和 Anthropic messages 路由。OpenAI chat 路径解析请求并要求模型及消息，然后依 scenario 找规则、选择服务、用实际模型替换，再经 per-attempt 的计划、转换和分派。该链仅代表所读 OpenAI chat 路径，不证明每类协议与工具语义等价。

#### 证据与依据

**依据 1 · 源码核查**：[internal/server/server_routes.go:45-48](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/server/server_routes.go#L45-L48)

服务向协议层传入认证。

```text
func (s *Server) UseAIEndpoints() {
	// The gateway route shape (/tingly/:scenario[/v1]/...) is owned by
	// protocolserver; the host only supplies the engine and model auth.
	s.aiHandler.RegisterRoutes(s.engine, s.getModelAuthMiddleware())
```

**依据 2 · 源码核查**：[internal/protocolserver/routes.go:38-45](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/routes.go#L38-L45)

模型认证前缀。

```text
// modelAuthChain builds the standard per-route handler prefix: modelAuth
// itself, then debugHeaderGuard (which depends on modelAuth having already
// set the auth-kind context key), then any route-specific middleware.
func (ph *ProtocolHandler) modelAuthChain(modelAuth gin.HandlerFunc, extra ...gin.HandlerFunc) []gin.HandlerFunc {
	chain := make([]gin.HandlerFunc, 0, 2+len(extra))
	chain = append(chain, modelAuth, ph.debugHeaderGuard)
	chain = append(chain, extra...)
	return chain
```

**依据 3 · 源码核查**：[internal/protocolserver/routes.go:62-98](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/routes.go#L62-L98)

场景路由与协议入口。

<details>
<summary>查看原文（37行）</summary>

```text
	scenario := engine.Group("/tingly/:scenario")
	scenario.Use(middleware.ClearServerIOTimeouts())
	scenario.Use(ph.legacyScenarioAliasMiddleware)
	scenario.Use(ph.profileAliasMiddleware)
	scenario.Use(ph.contextMiddleware)
	// tracingMiddleware runs after profileAliasMiddleware so the span's
	// scenario reflects the canonical "base:pN" form, matching usage records.
	scenario.Use(ph.tracingMiddleware)
	ph.SetupMixinEndpoints(scenario, modelAuth)
	// Claude Code v2.1+ sends HEAD <ANTHROPIC_BASE_URL> as a connectivity
	// check before making any API call. Respond 200 so CC doesn't treat the
	// missing route as a server error and spiral into api_retry storms.
	scenario.HEAD("", func(c *gin.Context) { c.Status(http.StatusOK) })

	// scenario v1 routes with middleware
	scenarioV1 := engine.Group("/tingly/:scenario/v1")
	scenarioV1.Use(middleware.ClearServerIOTimeouts())
	scenarioV1.Use(ph.legacyScenarioAliasMiddleware)
	scenarioV1.Use(ph.profileAliasMiddleware)
	scenarioV1.Use(ph.contextMiddleware)
	scenarioV1.Use(ph.tracingMiddleware)
	ph.SetupMixinEndpoints(scenarioV1, modelAuth)
	scenarioV1.HEAD("", func(c *gin.Context) { c.Status(http.StatusOK) })
}

// SetupMixinEndpoints registers the protocol-mixed endpoint set (OpenAI +
// Anthropic surfaces on one group), each gated by modelAuth.
func (ph *ProtocolHandler) SetupMixinEndpoints(group *gin.RouterGroup, modelAuth gin.HandlerFunc) {
	// Chat completions endpoint (OpenAI compatible)
	group.POST("/chat/completions", ph.modelAuthChain(modelAuth, ph.teamScopeMiddleware, ph.HandleOpenAIChatCompletions)...)

	// Responses API endpoints (OpenAI compatible)
	group.POST("/responses", ph.modelAuthChain(modelAuth, ph.teamScopeMiddleware, ph.HandleResponsesCreate)...)
	group.GET("/responses/:id", ph.modelAuthChain(modelAuth, ph.teamScopeMiddleware, ph.HandleResponsesGet)...)

	// Chat completions endpoint (Anthropic compatible)
	group.POST("/messages", ph.modelAuthChain(modelAuth, ph.teamScopeMiddleware, ph.HandleAnthropicMessages)...)
```

</details>

**依据 4 · 源码核查**：[internal/protocolserver/openai_chat.go:18-65](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/openai_chat.go#L18-L65)

解析及必要字段验证。

<details>
<summary>查看原文（48行）</summary>

```text
func (ph *ProtocolHandler) HandleOpenAIChatCompletions(c *gin.Context) {

	scenario := c.Param("scenario")

	// Read raw body
	bodyBytes, err := c.GetRawData()
	if err != nil {
		writeErrorResponse(c, http.StatusBadRequest, ErrorResponse{
			Error: ErrorDetail{
				Message: "Failed to read request body: " + err.Error(),
				Type:    "invalid_request_error",
			},
		})
		return
	}

	// Parse OpenAI-style request
	var req = &protocol.OpenAIChatCompletionRequest{}
	if err := json.Unmarshal(bodyBytes, req); err != nil {
		writeErrorResponse(c, http.StatusBadRequest, ErrorResponse{
			Error: ErrorDetail{
				Message: "Invalid request body: " + err.Error(),
				Type:    "invalid_request_error",
			},
		})
		return
	}

	// Validate
	responseModel := req.Model
	if req.Model == "" {
		writeErrorResponse(c, http.StatusBadRequest, ErrorResponse{
			Error: ErrorDetail{
				Message: "Model is required",
				Type:    "invalid_request_error",
			},
		})
		return
	}

	if len(req.Messages) == 0 {
		writeErrorResponse(c, http.StatusBadRequest, ErrorResponse{
			Error: ErrorDetail{
				Message: "At least one message is required",
				Type:    "invalid_request_error",
			},
		})
		return
```

</details>

**依据 5 · 源码核查**：[internal/protocolserver/openai_chat.go:97-128](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/openai_chat.go#L97-L128)

规则和服务选择。

<details>
<summary>查看原文（32行）</summary>

```text
	// Check if this is the request model name first
	rule, err = ph.determineRuleWithScenario(c, scenarioType, req.Model)
	if err != nil {
		writeErrorResponse(c, http.StatusBadRequest, ErrorResponse{
			Error: ErrorDetail{
				Message: err.Error(),
				Type:    "invalid_request_error",
			},
		})
		return
	}

	ph.applyVisionProxy(c, scenarioType, rule, &req.ChatCompletionNewParams)

	// Select service using routing pipeline
	provider, selectedService, err = ph.selectService(c, scenarioType, rule, &req.ChatCompletionNewParams)
	if err != nil {
		writeErrorResponse(c, http.StatusBadRequest, ErrorResponse{
			Error: ErrorDetail{
				Message: err.Error(),
				Type:    "invalid_request_error",
			},
		})
		return
	}

	actualModel := selectedService.Model
	req.Model = actualModel

	ph.applyVisionProxy(c, scenarioType, rule, req.ChatCompletionNewParams)

	ph.OpenAIChatCompletion(c, req, responseModel, provider, scenarioType, rule)
```

</details>

**依据 6 · 源码核查**：[internal/protocolserver/openai_chat.go:179-192](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/openai_chat.go#L179-L192)

每次重试运行独立请求。

<details>
<summary>查看原文（14行）</summary>

```text
	// ── Per-attempt pipeline (provider-dependent) ──
	ph.DispatchWithPriorityFailover(c, rule, provider, actualModel,
		func(p *typ.Provider, retryModel string) {
			areq := req
			if multi {
				cloned, err := CloneOpenAIChatRequest(template)
				if err != nil {
					ph.FailAttemptSetup(c, err)
					return
				}
				areq = cloned
			}
			ph.runOpenAIChatAttempt(c, areq, responseModel, p, retryModel, rule, isStreaming, scenarioType, scenarioConfig)
		})
```

</details>

**依据 7 · 源码核查**：[internal/protocolserver/openai_chat.go:195-223](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/openai_chat.go#L195-L223)

转换与分派。

<details>
<summary>查看原文（29行）</summary>

```text
// runOpenAIChatAttempt executes the provider-dependent half of an OpenAI chat
// request for one failover attempt. Setup failures route through
// failAttemptSetup so the orchestrator can advance to the next candidate.
func (ph *ProtocolHandler) runOpenAIChatAttempt(c *gin.Context, req *protocol.OpenAIChatCompletionRequest, responseModel string, provider *typ.Provider, actualModel string, rule *typ.Rule, isStreaming bool, scenarioType typ.RuleScenario, scenarioConfig *typ.ScenarioConfig) {
	plan, err := ph.planAttempt(c, rule, provider, actualModel, protocol.TypeOpenAIChat, scenarioType, scenarioConfig)
	if err != nil {
		ph.FailAttemptSetup(c, err)
		return
	}
	req.Model = actualModel

	transform.AlignToolMessagesForOpenAI(req.ChatCompletionNewParams)

	reqCtx, err := ph.TransformOpenAIChat(c, req, plan, isStreaming, scenarioType)
	if err != nil {
		ph.FailAttemptSetup(c, fmt.Errorf("Transform failed: %w", err))
		return
	}
	defer reqCtx.Release()

	if plan.servedByStage() {
		ph.serveOpenAIOnAnthropic(c, plan, reqCtx, rule, responseModel, isStreaming)
		return
	}

	// === Dispatch via transform chain ===
	reqCtx.RequestModel = actualModel
	reqCtx.ResponseModel = responseModel
	ph.DispatchChainResult(c, reqCtx, rule, plan.Provider, isStreaming)
```

</details>

#### 缺口

- 未穷尽协议变换及网络响应
  **影响**：不能确认模型、工具和流式语义无损
  **进一步探讨**：用真实或受控上游逐协议核对字段及响应。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 故障转移与健康筛选有哪些不可忽略的边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

多服务时首块门控缓冲尝试，401、403、429、500、502、503、504 等预提交失败可转下一个服务；一旦响应字节提交便不能重试，避免把第二服务输出接到已开始的流。单服务直接执行，无后备；健康筛选若所有候选都不健康则保留原集合，让上游返回真实失败。因此不能宣称始终成功或从流中断自动恢复，跨提供商重试也可能产生重复请求与费用。

#### 证据与依据

**依据 1 · 源码核查**：[internal/protocolserver/failover_dispatch.go:75-107](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/failover_dispatch.go#L75-L107)

可重试状态集合。

<details>
<summary>查看原文（33行）</summary>

```text
// retryableUpstreamStatuses are the HTTP status codes treated as
// "upstream transiently sick, try the next priority tier".
//
// 500 is included because in-process error helpers (SendStreamingError,
// SendErrorResponse on forwarding failure) wrap upstream pre-stream
// errors as 500. 502 covers the explicit "upstream stream failed" path.
// Keeping both means refactors that change one helper's status code
// don't silently break failover.
//
// 401/403 are here because an upstream auth failure is a property of one
// credential, not of the request: an OAuth token caught mid-refresh, a rotated
// or revoked API key, a provider-side quota flag. The inbound caller's own
// token is checked by middleware long before the gate is installed, so a 401
// reaching this point always came from a provider — and answering it with a
// sibling service is the whole reason a rule holds more than one. Without
// this, a single stale credential turns into "Please run /login" on the
// client while healthy services sit idle.
var retryableUpstreamStatuses = map[int]bool{
	http.StatusUnauthorized:        true,
	http.StatusForbidden:           true,
	http.StatusTooManyRequests:     true,
	http.StatusBadGateway:          true,
	http.StatusServiceUnavailable:  true,
	http.StatusGatewayTimeout:      true,
	http.StatusInternalServerError: true,
}

// isRetryableStatus reports whether a buffered status code from a
// dispatch attempt should trigger failover. Status 0 means the writer
// was never touched — treat as terminal (the handler ran to completion
// without writing, retrying would just repeat the no-op).
func isRetryableStatus(status int) bool {
	return status != 0 && retryableUpstreamStatuses[status]
```

</details>

**依据 2 · 源码核查**：[internal/protocolserver/failover_dispatch.go:352-379](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/failover_dispatch.go#L352-L379)

多服务门控和单服务绕过。

<details>
<summary>查看原文（28行）</summary>

```text
// dispatchWithPriorityFailover runs `attempt` repeatedly, retrying on
// retryable buffered failures until either the gate commits (the
// stream's first real chunk reached the wire, retry impossible) or the
// candidate pool is exhausted (the last buffered error flushes on the
// deferred return).
//
// Single-service requests bypass the gate entirely: with no fallback
// tier, failover is impossible and there is no reason to buffer.
func (ph *ProtocolHandler) DispatchWithPriorityFailover(
	c *gin.Context,
	rule *typ.Rule,
	initialProvider *typ.Provider,
	initialModel string,
	attempt dispatchAttempt,
) {
	activeServices := rule.GetActiveServices()
	if len(activeServices) <= 1 {
		attempt(initialProvider, initialModel)
		return
	}

	realWriter := c.Writer
	gate := newFirstChunkGate(realWriter)
	c.Writer = gate
	defer func() {
		c.Writer = realWriter
		gate.CommitIfBuffered()
	}()
```

</details>

**依据 3 · 源码核查**：[internal/protocolserver/failover_dispatch.go:408-451](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/failover_dispatch.go#L408-L451)

提交后退出及成功/错误分支。

<details>
<summary>查看原文（44行）</summary>

```text
		// One child span per attempt: the tracking context only keeps the
		// final winner (UpdateTrackingForFailover overwrites), so the span
		// is the structured record of the retry history.
		attemptSpan := ph.startFailoverAttemptSpan(c.Request.Context(), i+1, serviceID, provider.UUID)

		errorsBeforeAttempt := len(c.Errors)
		attempt(provider, model)

		succeeded := gate.Status() >= 200 && gate.Status() < 400 && len(c.Errors) == errorsBeforeAttempt
		endFailoverAttemptSpan(attemptSpan, succeeded, gate.Status())
		if succeeded {
			c.Set(constant.CtxKeyRecoveredErrorCount, errorsBeforeAttempt)
		}

		// Once bytes reach the wire, retry is impossible, even if streaming fails.
		status, committed := gate.Status(), gate.Committed()
		if committed {
			loadbalance.RecordServiceSuccess(rule.UUID, serviceID)
		}
		channelRefused := false
		for _, attemptErr := range c.Errors[errorsBeforeAttempt:] {
			channelRefused = channelRefused || client.IsWorkBuddyChannelRefusal(attemptErr.Err)
		}
		if committed || (!isRetryableStatus(status) && !channelRefused) {
			fields := failoverLogFields(c, rule, provider, model, serviceID)
			fields["stage"] = "failover_terminal"
			fields["attempt"] = i + 1
			fields["active_services"] = len(activeServices)
			fields["status"] = status
			fields["routed_model"] = model
			fields["routed_provider"] = provider.Name
			if succeeded {
				fields["stage"] = "failover_success"
			}
			entry := logrus.WithContext(c.Request.Context()).WithFields(fields)
			switch {
			case succeeded:
				entry.Infof("[failover] succeeded on attempt %d with %s/%s", i+1, provider.UUID, model)
			case committed:
				entry.Errorf("[failover] stream failed after response committed on attempt %d with %s/%s", i+1, provider.UUID, model)
			default:
				entry.Warnf("[failover] attempt %d returned status %d with %s/%s", i+1, status, provider.UUID, model)
			}
			return
```

</details>

**依据 4 · 源码核查**：[internal/routing/stage_health.go:26-49](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/routing/stage_health.go#L26-L49)

全部不健康时降级保留候选。

<details>
<summary>查看原文（24行）</summary>

```text
func (s *HealthStage) Evaluate(ctx *SelectionContext, candidates []*loadbalance.Service) ([]*loadbalance.Service, *SelectionResult, error) {
	if len(candidates) == 0 {
		return candidates, nil, nil
	}

	// If no health filter configured, pass through unchanged
	if s.filter == nil {
		return candidates, nil, nil
	}

	before := len(candidates)
	healthy := s.filter.Filter(candidates)

	// Degrade, don't disappear: if every candidate is unhealthy, keep the full
	// set rather than emptying it — mirrors LoadBalancer.SelectService, so the
	// caller still gets a service (and the real upstream 429/auth) instead of a
	// "no service available" routing error.
	if before > 0 && len(healthy) == 0 {
		logrus.WithContext(selectionLogContext(ctx)).WithFields(logrus.Fields{
			"stage":      "routing_health_degrade",
			"rule_uuid":  selectionRuleUUID(ctx),
			"candidates": before,
		}).Warnf("[health] all %d candidates unhealthy; keeping the full set (degrade)", before)
		return candidates, nil, nil
```

</details>

#### 缺口

- 未注入故障和统计账单
  **影响**：无法确认真实网络下不重复、资源费用或恢复效果
  **进一步探讨**：模拟首块前后断流、429 和多候选并核对请求数及输出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 团队身份与 DSH 配置写入的边界是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

模型认证要求 Authorization 或 X-Api-Key；多租户开启且有 token store 时，tb-share- key 要有 team 绑定并通过路由限制，其他路径回退全局 token 检查；这只能支持已读入口的身份约束，不能证明团队数据与日志全链隔离。DSH 配置和凭据各自读取、解析并备份已有文件，再分别直接 WriteFile；单个文件失败会返回消息，不能将两个写入视为原子事务，需事先备份并核对各自结果。

#### 证据与依据

**依据 1 · 源码核查**：[internal/middleware/auth.go:295-321](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/middleware/auth.go#L295-L321)

输入凭据提取和缺失拒绝。

<details>
<summary>查看原文（27行）</summary>

```text
// The auth will support both `Authorization` and `X-Api-Key`
// Supports three authentication methods (in order of precedence):
// 1. JWT API tokens (when multi-tenant is enabled)
// 2. Global config model token (backward compatibility)
// 3. Enterprise context JWT (X-TBE-Context-JWT header)
func (am *AuthMiddleware) ModelAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		xApiKey := c.GetHeader("X-Api-Key")
		if authHeader == "" && xApiKey == "" {
			abortWithError(c, http.StatusUnauthorized, "Model authorization header required", "invalid_request_error")
			return
		}

		if authHeader == "" {
			authHeader = xApiKey
		}

		token := authHeader
		// Remove "Bearer " prefix if present in the token
		if strings.HasPrefix(token, "Bearer ") {
			token = token[7:]
		}
		token = strings.TrimSpace(token)
		xApiKey = strings.TrimSpace(xApiKey)

		cfg := am.config
```

</details>

**依据 2 · 源码核查**：[internal/middleware/auth.go:323-360](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/middleware/auth.go#L323-L360)

共享 key team 约束与全局 token 回退。

<details>
<summary>查看原文（38行）</summary>

```text
		// Try API token authentication first (if multi-tenant is enabled)
		// Check if token has tb-share- prefix
		if cfg != nil && cfg.IsMultiTenantEnabled() && am.apiTokenStore != nil {
			if strings.HasPrefix(token, "tb-share-") {
				// This is an API token, validate it directly from database
				tokenRecord, validateErr := am.apiTokenStore.ValidateToken(token)
				if validateErr == nil && tokenRecord != nil {
					if tokenRecord.TeamID == "" {
						abortWithError(c, http.StatusUnauthorized, "Sharing key has no team binding", "invalid_token_error")
						return
					}
					// A sharing key is a team-scoped model credential, not a
					// second global model token. Authorize the concrete Gin route
					// template as well as the scenario parameter so new model
					// surfaces fail closed and a client cannot select a suffix
					// such as team:<other-scope>.
					if !sharingKeyCanAccessModelSurface(c) {
						abortWithError(c, http.StatusForbidden, "Sharing key is restricted to the team model endpoint", "forbidden_error")
						return
					}

					// Token is valid and enabled
					c.Set(constant.CtxKeyAuthKind, constant.AuthKindSharingKey)
					c.Set(constant.CtxKeyUserID, tokenRecord.UserID)
					c.Set(constant.CtxKeyTeamID, tokenRecord.TeamID)

					// Update last used asynchronously
					go am.apiTokenStore.UpdateLastUsed(tokenRecord.TokenID)

					c.Next()
					return
				}
			}
		}

		// Check global config model token (backward compatibility)
		if cfg == nil || !cfg.HasModelToken() {
			abortWithError(c, http.StatusInternalServerError, "config or config model token missing", "invalid_request_error")
```

</details>

**依据 3 · 源码核查**：[internal/config/apply_config_dsh.go:208-245](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/config/apply_config_dsh.go#L208-L245)

设置文件备份及直接写。

<details>
<summary>查看原文（38行）</summary>

```text
func ApplyDshSettings(baseURL string, models []string, prefs *DshPrefs) (*ApplyResult, error) {
	dshHome, err := dshHomeDir()
	if err != nil {
		return nil, err
	}
	targetPath := filepath.Join(dshHome, "settings.yaml")
	result := &ApplyResult{}

	if err := os.MkdirAll(dshHome, 0755); err != nil {
		result.Message = fmt.Sprintf("Failed to create directory: %v", err)
		return result, nil
	}

	existing := map[string]interface{}{}
	if data, err := os.ReadFile(targetPath); err == nil {
		if err := yamlpkg.Unmarshal(data, &existing); err != nil {
			result.Message = fmt.Sprintf("Failed to parse existing settings.yaml: %v", err)
			return result, nil
		}
		backupPath, err := backupFile(targetPath)
		if err != nil {
			result.Message = fmt.Sprintf("Failed to create backup: %v", err)
			return result, nil
		}
		result.BackupPath = backupPath
		result.Updated = true
	} else {
		result.Created = true
	}

	mergeDshSettings(existing, baseURL, models, prefs)

	out, err := yamlpkg.Marshal(existing)
	if err != nil {
		result.Message = fmt.Sprintf("Failed to marshal settings.yaml: %v", err)
		return result, nil
	}
	if err := os.WriteFile(targetPath, out, 0644); err != nil {
```

</details>

**依据 4 · 源码核查**：[internal/config/apply_config_dsh.go:313-350](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/config/apply_config_dsh.go#L313-L350)

凭据文件独立备份与写入。

<details>
<summary>查看原文（38行）</summary>

```text
func ApplyDshCredentials(apiKey string) (*ApplyResult, error) {
	dshHome, err := dshHomeDir()
	if err != nil {
		return nil, err
	}
	targetPath := filepath.Join(dshHome, ".credentials.yaml")
	result := &ApplyResult{}

	if err := os.MkdirAll(dshHome, 0755); err != nil {
		result.Message = fmt.Sprintf("Failed to create directory: %v", err)
		return result, nil
	}

	existing := map[string]interface{}{}
	if data, err := os.ReadFile(targetPath); err == nil {
		if err := yamlpkg.Unmarshal(data, &existing); err != nil {
			result.Message = fmt.Sprintf("Failed to parse existing .credentials.yaml: %v", err)
			return result, nil
		}
		backupPath, err := backupFile(targetPath)
		if err != nil {
			result.Message = fmt.Sprintf("Failed to create backup: %v", err)
			return result, nil
		}
		result.BackupPath = backupPath
		result.Updated = true
	} else {
		result.Created = true
	}

	existing[dshAPIKeyEnvName] = apiKey

	out, err := yamlpkg.Marshal(existing)
	if err != nil {
		result.Message = fmt.Sprintf("Failed to marshal .credentials.yaml: %v", err)
		return result, nil
	}
	if err := os.WriteFile(targetPath, out, 0600); err != nil {
```

</details>

#### 缺口

- 未验证全部 route、双团队隔离及两文件中途失败
  **影响**：不能断言所有数据隔离或整体回滚
  **进一步探讨**：隔离环境测跨 team 权限与两次写入失败并恢复备份。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何种条件值得小范围观察，退出和成本是什么？

**研究主题**：采用判断

#### 完整回答

熟悉模型凭据和流量管理的管理员可先在本机隔离环境用单客户端、单提供商的小样核对文本、工具与流式输出，再验证团队 scope 和故障路径。成本包括运行网关、日志或状态保存、上游模型请求及可能的重试费、规则维护和审查；耗时费用未测。若身份、协议、预算或失败恢复不明确，停扩流并将客户端指回原提供商，必要时恢复配置副本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-32](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/README.md#L23-L32)

作者说明统一模型和团队管理。

<details>
<summary>查看原文（10行）</summary>

```text
* **Any Agent ⇄ Any Model**
  * Unified endpoint for AI — bridge any providers, with protocols translated both ways
  * One-click config for Agents — Claude Code, OpenCode, Codex, Xcode, and more
  * Profiles for Claude Code — switch models for different scenarios
  * Both API keys and OAuth — use your existing quotas anywhere
  * Smart Routing — route across models and tokens by cost, speed, or custom policies
* **Team AI Management**
  * Shared team endpoint with centrally managed model rules
  * Dedicated keys per member, with data isolated per user
  * Per-member usage tracking
```

</details>

**依据 2 · 源码核查**：[internal/protocolserver/openai_chat.go:153-162](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/openai_chat.go#L153-L162)

可选请求记录及配置依赖。

<details>
<summary>查看原文（10行）</summary>

```text
	// Get or create the recorder (pristine request body), mirroring the
	// Anthropic entry points. Enablement is the effective capture-point
	// selection: the rule's recording flag overrides the scenario-level
	// recording_v2 default.
	if recMode := typ.EffectiveRecording(rule, scenarioConfig); recMode.Enabled() {
		bs, err := req.MarshalJSON()
		if err != nil {
			bs = []byte("{}")
		}
		ph.EnsureProtocolRecorder(c, string(scenarioType), provider, actualModel, obs.RecordMode(recMode), bs)
```

</details>

**依据 3 · 源码核查**：[internal/config/apply_config_dsh.go:221-245](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/config/apply_config_dsh.go#L221-L245)

设置修改前备份。

<details>
<summary>查看原文（25行）</summary>

```text
	existing := map[string]interface{}{}
	if data, err := os.ReadFile(targetPath); err == nil {
		if err := yamlpkg.Unmarshal(data, &existing); err != nil {
			result.Message = fmt.Sprintf("Failed to parse existing settings.yaml: %v", err)
			return result, nil
		}
		backupPath, err := backupFile(targetPath)
		if err != nil {
			result.Message = fmt.Sprintf("Failed to create backup: %v", err)
			return result, nil
		}
		result.BackupPath = backupPath
		result.Updated = true
	} else {
		result.Created = true
	}

	mergeDshSettings(existing, baseURL, models, prefs)

	out, err := yamlpkg.Marshal(existing)
	if err != nil {
		result.Message = fmt.Sprintf("Failed to marshal settings.yaml: %v", err)
		return result, nil
	}
	if err := os.WriteFile(targetPath, out, 0644); err != nil {
```

</details>

**依据 4 · 源码核查**：[internal/protocolserver/failover_dispatch.go:389-414](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/failover_dispatch.go#L389-L414)

多服务逐次尝试。

<details>
<summary>查看原文（26行）</summary>

```text
	for i := 0; i < len(activeServices); i++ {
		serviceID := loadbalance.FormatServiceID(provider.UUID, model)
		tried[serviceID] = true

		// Update context before logging/dispatch so request-scoped observability
		// reflects the service currently being tried, and ultimately the last
		// successful service when failover succeeds.
		UpdateTrackingForFailover(c, provider, model)

		fields := failoverLogFields(c, rule, provider, model, serviceID)
		fields["stage"] = "failover_attempt"
		fields["attempt"] = i + 1
		fields["active_services"] = len(activeServices)
		logrus.WithContext(c.Request.Context()).WithFields(fields).Infof("[failover] attempt %d: trying: %s/%s", i+1, provider.UUID, model)

		if rec != nil {
			rec.SetActiveService(provider, model)
		}

		// One child span per attempt: the tracking context only keeps the
		// final winner (UpdateTrackingForFailover overwrites), so the span
		// is the structured record of the retry history.
		attemptSpan := ph.startFailoverAttemptSpan(c.Request.Context(), i+1, serviceID, provider.UUID)

		errorsBeforeAttempt := len(c.Errors)
		attempt(provider, model)
```

</details>

#### 缺口

- 没有性能、费用和恢复实测
  **影响**：无法量化投入回报或生产准备度
  **进一步探讨**：记录上游请求、费用、人工配置和恢复耗时。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何帮助管理员确认一次路由符合预期和费用边界？

**研究主题**：新假设与验证

#### 完整回答

已有分次尝试的日志和追踪上下文，不能声称没有可观察性。假设在现有 trace 上关联规则版本与预期服务策略、客户端语义校验结果，可帮助定位错路；对照现有追踪，构造错规则、权限不足和异构响应，比较定位时间、漏检、记录成本与敏感数据暴露。若现有追踪已能同样识别或新增记录增加泄露与运维负担，则否定。该方案未实现。

#### 证据与依据

**依据 1 · 源码核查**：[internal/protocolserver/failover_dispatch.go:389-417](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/failover_dispatch.go#L389-L417)

按尝试记录服务和 span。

<details>
<summary>查看原文（29行）</summary>

```text
	for i := 0; i < len(activeServices); i++ {
		serviceID := loadbalance.FormatServiceID(provider.UUID, model)
		tried[serviceID] = true

		// Update context before logging/dispatch so request-scoped observability
		// reflects the service currently being tried, and ultimately the last
		// successful service when failover succeeds.
		UpdateTrackingForFailover(c, provider, model)

		fields := failoverLogFields(c, rule, provider, model, serviceID)
		fields["stage"] = "failover_attempt"
		fields["attempt"] = i + 1
		fields["active_services"] = len(activeServices)
		logrus.WithContext(c.Request.Context()).WithFields(fields).Infof("[failover] attempt %d: trying: %s/%s", i+1, provider.UUID, model)

		if rec != nil {
			rec.SetActiveService(provider, model)
		}

		// One child span per attempt: the tracking context only keeps the
		// final winner (UpdateTrackingForFailover overwrites), so the span
		// is the structured record of the retry history.
		attemptSpan := ph.startFailoverAttemptSpan(c.Request.Context(), i+1, serviceID, provider.UUID)

		errorsBeforeAttempt := len(c.Errors)
		attempt(provider, model)

		succeeded := gate.Status() >= 200 && gate.Status() < 400 && len(c.Errors) == errorsBeforeAttempt
		endFailoverAttemptSpan(attemptSpan, succeeded, gate.Status())
```

</details>

**依据 2 · 源码核查**：[internal/protocolserver/openai_chat.go:145-162](https://github.com/tingly-dev/tingly-box/blob/501a750bb4c468a2057fb8157bd1760b468ad026/internal/protocolserver/openai_chat.go#L145-L162)

请求跟踪与可选记录。

<details>
<summary>查看原文（18行）</summary>

```text
	// Inject session ID into request context so all downstream code can access it
	sessionID := resolveSessionID(c, &req.ChatCompletionNewParams)
	c.Request = c.Request.WithContext(typ.WithSessionID(c.Request.Context(), sessionID))

	// Set tracking context with all metadata. Provider/model are refreshed per
	// attempt by the failover loop (UpdateTrackingForFailover).
	SetTrackingContext(c, rule, provider, actualModel, responseModel, isStreaming)

	// Get or create the recorder (pristine request body), mirroring the
	// Anthropic entry points. Enablement is the effective capture-point
	// selection: the rule's recording flag overrides the scenario-level
	// recording_v2 default.
	if recMode := typ.EffectiveRecording(rule, scenarioConfig); recMode.Enabled() {
		bs, err := req.MarshalJSON()
		if err != nil {
			bs = []byte("{}")
		}
		ph.EnsureProtocolRecorder(c, string(scenarioType), provider, actualModel, obs.RecordMode(recMode), bs)
```

</details>

#### 缺口

- 未评估既有追踪界面和候选策略
  **影响**：无法认定新增记录有价值
  **进一步探讨**：对照相同故障集测定位准确率与隐私成本。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
