# Tingly Box

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d91c4ca](https://github.com/tingly-dev/tingly-box/tree/d91c4cac65e28e6969c4b2516933732a15da643a)

<!-- BEGIN META -->
[![GitHub ★ 370](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=370&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tingly-dev/tingly-box)
<!-- END META -->

> **功能**：独立统一模型网关，为多客户端和团队提供协议转换、模型选路、凭据与团队 key 管理，以及请求路径和用量观察。

> **亮点**：把角色scope/分区亲和与异构failover/观察接成统一管理路径，有首chunk不混流和非global probe剥头等明确边界。见[Q02](#research-q02)、[Q03](#research-q03)。

> **主要限制**：degrade可保不健康候选，首chunk后不重试、quota非硬财务限额、usage非全厂商扣费；DSH两文件备份直写非事务，团队全路径隔离未验。见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 网关实际服务谁，相对直连增加何种结果？](#detail-section-11)
  - [Q02 · 认证/共享范围/额度能否落实团队隔离？](#detail-section-12)
  - [Q03 · 选路/协议/失败回退和流式结果有哪些语义边界？](#detail-section-13)
  - [Q04 · 配置、密钥、监控与外部依赖如何启动恢复？](#detail-section-14)
  - [Q05 · 全周期成本、采用和退出条件？](#detail-section-15)
  - [Q06 · 身份、选路和重试结果收据的可证伪方向？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为需接多个模型/客户端的个人或管理员，在统一入口管理规则、scope和用量，减少重复baseURL/key接线。见[Q01](#research-q01)。

客户端直接provider或手配多端点/代理；网关增量是协议/身份/运维集中，Agent规划仍在客户端。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 统一端点/转换 | 多客户端接多provider | 具体协议/工具语义需验，非any-to-any已证 |
| 角色/scope | 管理/模型/团队key | 核心路由可核，全数据隔离非已审 |
| 选路/亲和 | 健康/内容/分区/策略选择 | 全不健康degrade，quota未知可pass |
| failover | 首chunk前异构回退 | committed后不重试，尝试可能消费 |
| 观察/DSH接入 | timeline/usage与配置自动写 | 非全部账单，DSH双文件非事务 |

**流程与依赖**

平台binary/本地DB与配置、token/scope、对应上游/客户端，源构建另需Go/local模块，DSH apply先备原件；表见[Q05](#research-q05)。

localhost分key/备DB配置→单client单provider文本/tool/stream→失败/双team矩阵→可选DSH apply，退出退原endpoint；步骤见[Q05](#research-q05)。

**效果与成本**

网关/日志DB、上游多attempt与OAuth维护，配置/权限和恢复人工未知；表见[Q05](#research-q05)。

接线/角色/首chunk与路径观察有据，真实任务正确性、团队隔离全貌、延迟及净费用未测；表见[Q05](#research-q05)。

> **思考**：degrade可保不健康候选，首chunk后不重试、quota非硬财务限额、usage非全厂商扣费；DSH两文件备份直写非事务，团队全路径隔离未验。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把角色scope/分区亲和与异构failover/观察接成统一管理路径，有首chunk不混流和非global probe剥头等明确边界。见[Q02](#research-q02)、[Q03](#research-q03)。

实际auth后剥probe头、首chunk闸/有限尝试、分区亲和与record关联可借鉴；degrade/未知quota、日志片段与两文件写入边界需显式保留。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

degrade可保不健康候选，首chunk后不重试、quota非硬财务限额、usage非全厂商扣费；DSH两文件备份直写非事务，团队全路径隔离未验。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉凭据/规则的管理员可localhost隔离渐进小样；身份/协议/规则不符、scope或DSH部分写不明时停扩流/自动配置，核attempt和文件、退原endpoint/副本。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

新项无baseline。固定Go源码已补读真实认证/路由/failover/记录与DSH写入，非只看README；独立infrastructure非DSH插件。未执行或全审协议/安全，限localhost可回退小样，生产/1ms/any-to-any未独验。

- 已检查：作者 README、包清单、源码路径 README.md、go.mod、build/npx/tingly-box/package.json、internal/command/options/server_options.go、internal/server/server_routes.go、internal/middleware/auth.go、internal/db/api_token_store.go、internal/protocolserver/routes.go、internal/protocolserver/routes_middleware.go、internal/routing/simple.go、internal/routing/selector.go、internal/routing/stage_health.go、internal/routing/stage_smart_routing.go、internal/routing/stage_affinity.go、internal/protocolserver/openai_chat.go、internal/protocolserver/attempt_plan.go、internal/protocolserver/failover_dispatch.go、internal/protocolserver/quota.go、internal/config/config.go、internal/config/rule_storage.go、internal/config/apply_config_dsh.go、internal/server/module/configapply/handler_dsh.go、internal/server/model_request_handler.go、internal/db/usage_record.go、internal/routing/smartrouting/routing.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：新项无旧findings/依赖。prepared候选不含未物化Go，已按固定git show补源码至独占阅读副本，临时SSL重读成功。定向核auth/token store/team/probe路由、selector/Health/Smart/Affinity、OpenAI入口/attempt plan/首chunk failover、usage/request trace、config规则DB/DSH写/CLI参数。未全审全部转换器/企业/OAuth/guardrails/MCP/远控/图片/所有查询、全存储加密及npm构建，未运行目标。
- 下一步：后续模拟上游/双team/有限流式故障验证角色与probe、选路/协议/tool字段/取消和usage，再核DB恢复/DSH二写失败；真实费用/性能另做小样对照。

**分析版本**

- **仓库**：[tingly-dev/tingly-box](https://github.com/tingly-dev/tingly-box)
- **版本号**：CLI npm 包声明 1.6.1（未独立确认各发行物与此源码对应）（[固定提交 d91c4ca](https://github.com/tingly-dev/tingly-box/tree/d91c4cac65e28e6969c4b2516933732a15da643a)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是在既有timeline/usage之上加政策版本/客户端语义核对，比较误scope/错路/消费未知和定位负担，现trace充分则否定。见[Q06](#research-q06)。

后续模拟上游/双team/有限流式故障验证角色与probe、选路/协议/tool字段/取消和usage，再核DB恢复/DSH二写失败；真实费用/性能另做小样对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 213 | 44684 | — | — | 426091 |
| .mjs | source | 4 | 597 | 349 | 211 | — |
| .md | example | 3 | 361 | — | — | 1101 |
| .js | source | 3 | 861 | 568 | 173 | — |
| .ts | source | 360 | 43965 | 36229 | 5298 | — |
| .ts | test | 73 | 6215 | 5163 | 378 | — |
| .tsx | source | 451 | 83899 | 73664 | 6406 | — |
| .tsx | test | 51 | 3846 | 3448 | 87 | — |
| .md | test | 2 | 120 | — | — | 389 |
| .cjs | source | 1 | 46 | 35 | 6 | — |
| .mjs | test | 2 | 551 | 465 | 44 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/tingly-dev/tingly-box/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一网关的认证/选路/流式重试/配置恢复如何落地，哪里不能用广告替代任务验收？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 网关实际服务谁，相对直连增加何种结果？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Tingly Box是独立Go统一模型网关/团队接入基础设施，真实entry_type=infrastructure，不是DSH插件。build/npx/tingly-box/package.json声明CLI包1.6.1，Go模块1.26；这些是固定源码包/构建口径，不证明当前npm发行物与该commit相同。本项新来源INPUT有身份/固定版本核定，changes unknown不推断身份失败；baseline路径不存在，无旧findings/依赖可复核。

目标是同时接多个模型/客户端、需要统一规则/凭据和用量观察的个人或管理员。基线是客户端直连单provider，或手工维护多个baseURL/key和独立代理。增量是统一OpenAI/Anthropic等入口、协议转换、scenario/规则选路、凭据/团队key和可查看的请求路径，减少各客户端接线重复。用户Agent的自主规划与文件执行仍在客户端，不能把网关转发当替用户完成任务的Agent闭环。

实际server将/tingly/:scenario及/v1变体挂到protocolserver并施模型认证；OpenAI chat先确定scenario/rule→选service→替实际model→按provider协议处理/转发，DSH只是把配置导向/tingly/dsh。README所列Remote Control/MCP/图片/guardrails等扩展本轮不全审，不把“any agent any model”“production-ready/<1ms”当已验证兼容/速度。

一次合格接入须正确身份/规则下真实文本+工具/流式任务可用、失败不重复/混流、原客户端配置可恢复、用量口径可解释。HTTP200/模型列表/成功fallback不是任务质量、逐provider全协议语义或净费用收益验收。

#### 证据与依据

**依据 1 · 源码核查**：[build/npx/tingly-box/package.json:1-24](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/build/npx/tingly-box/package.json#L1-L24)

真实CLI包1.6.1/用途/许可。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "tingly-box",
  "version": "1.6.1",
  "description": "High-performance AI gateway CLI - connect to multiple AI providers through a single API",
  "keywords": [
    "ai",
    "gateway",
    "openai",
    "anthropic",
    "claude",
    "cli",
    "tingly"
  ],
  "homepage": "https://github.com/tingly-dev/tingly-box",
  "repository": {
    "type": "git",
    "url": "https://github.com/tingly-dev/tingly-box.git"
  },
  "license": "MPL-2.0",
  "author": "Tingly Dev",
  "engines": {
    "node": ">=18.0.0"
  },
  "publishConfig": {
```

</details>

**依据 2 · 源码核查**：[go.mod:1-18](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/go.mod#L1-L18)

Go模块与本地依赖。

<details>
<summary>查看原文（18行）</summary>

```text
module github.com/tingly-dev/tingly-box

go 1.26.0

replace github.com/openai/openai-go/v3 => ./libs/openai-go

replace github.com/anthropics/anthropic-sdk-go => ./libs/anthropic-sdk-go

replace google.golang.org/genai => ./libs/go-genai

replace github.com/tingly-dev/tingly-box/imbot => ./imbot

replace github.com/tingly-dev/tingly-box/ai => ./ai

replace github.com/tingly-dev/tingly-box/agentboot => ./agentboot

replace github.com/tingly-dev/tingly-box/swagger => ./swagger

```

</details>

**依据 3 · 源码核查**：[README.md:19-42](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/README.md#L19-L42)

作者统一入口/团队/生产与速度声称。

<details>
<summary>查看原文（24行）</summary>

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

**依据 4 · 源码核查**：[internal/server/server_routes.go:25-49](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/server/server_routes.go#L25-L49)

真实模型入口。

<details>
<summary>查看原文（25行）</summary>

```text

// setupRoutes configures server routes
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
}
```

</details>

**依据 5 · 源码核查**：[internal/protocolserver/routes.go:48-100](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/routes.go#L48-L100)

实际scenario路由/协议认证链。

<details>
<summary>查看原文（53行）</summary>

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
	// Count tokens endpoint (Anthropic compatible)
	group.POST("/messages/count_tokens", ph.modelAuthChain(modelAuth, ph.teamScopeMiddleware, ph.AnthropicCountTokens)...)
```

</details>

**依据 6 · 源码核查**：[internal/protocolserver/openai_chat.go:75-133](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/openai_chat.go#L75-L133)

scenario/rule/服务和实际model链。

<details>
<summary>查看原文（59行）</summary>

```text
	// Convert string to RuleScenario and validate
	scenarioType := typ.RuleScenario(scenario)
	if !IsValidRuleScenario(scenarioType) {
		writeErrorResponse(c, http.StatusBadRequest, ErrorResponse{
			Error: ErrorDetail{
				Message: fmt.Sprintf("invalid scenario: %s", scenario),
				Type:    "invalid_request_error",
			},
		})
		return
	}

	//if !typ.ScenarioSupportsTransport(scenarioType, typ.TransportOpenAI) {
	//	c.JSON(http.StatusBadRequest, ErrorResponse{
	//		Error: ErrorDetail{
	//			Message: fmt.Sprintf("scenario %s does not support OpenAI chat completions", scenario),
	//			Type:    "invalid_request_error",
	//		},
	//	})
	//	return
	//}

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
}

// OpenAIChatCompletion runs the provider-independent prologue once, then drives
// the failover loop whose per-attempt callback re-runs the provider-dependent
// pipeline (align → cap → target resolution → transform → dispatch) so failover
```

</details>

**依据 7 · 源码核查**：[internal/server/module/configapply/handler_dsh.go:78-94](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/server/module/configapply/handler_dsh.go#L78-L94)

DSH接/tingly/dsh而非插件。

<details>
<summary>查看原文（17行）</summary>

```text
	models := collectDshRuleModels(cfg)

	port := h.resolvedPort()
	dshBaseURL := middleware.BaseURLFromRequest(c, port) + "/tingly/dsh"
	apiKey := h.config.GetModelToken()

	settingsResult, err := config.ApplyDshSettings(dshBaseURL, models, prefs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ApplyDshConfigResponse{
			Success: false,
			Message: "Internal error: " + err.Error(),
		})
		return
	}
	credsResult, err := config.ApplyDshCredentials(apiKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ApplyDshConfigResponse{
```

</details>

#### 缺口

- 代表客户端/协议组合的任务成功率、接线净收益及1ms性能未对照
  **影响**：不能按作者口号建议生产替换所有直连
  **进一步探讨**：模拟上游/隔离客户端对文本、工具、多轮/流式、错误及恢复，与直连比较正确性/延迟/总成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 认证/共享范围/额度能否落实团队隔离？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

UserAuth要求Bearer管理token并映射默认admin；ModelAuth接Authorization或X-Api-Key，区分global model token与启用multi-tenant时tb-share-key。管理/API token不同是实际边界，不能拿模型key直当管理员身份。新装UserToken用安全随机、失败拒初始化，旧已知默认token只警告不静默轮换；启动日志/登录URL含管理token，日志/终端访问也是保密边界。

sharing key从store核enabled、expiry、team存在/启用，再限制具体Gin路由模板/tingly/:scenario且裸scenario=team，设置UserID/TeamID。teamScope把非默认TeamID内部重写team:<id>，客户端不能用team:<other>后缀替换范围。quota读取接口另拒sharing key，管理team/key的路由挂UserAuth；这些是可核正面防护，而字段存在不等所有数据查询/企业端点隔离已全审。

SimpleSelector有X-Tingly-Probe-Service可直pin任意已启provider+model、跳常规pipeline；单看这里容易误报共享绕过。routes.modelAuthChain在模型认证之后debugHeaderGuard，非global-model-token会删除debug/probe头，sharing-key不能由这条头直接越rule。本轮核前后实际链，不能略过这一反证，也不把“内部probe”当按网络地址认证：global token本身是高权限信任边界。

用量记录含UserID/TeamID/Rule/provider/model与status/TraceID，提供归属，但不是租户全部数据访问或支出硬限制证明。service_quota是选路条件，未wire QuotaProvider或取不到usage会无对应样本/pass-through，quota endpoint只读缓存不实时发厂商请求；按配额选路不能等价于原子扣费预留或防超支。部署到团队前还需token发放/撤销、默认全局key、实际scope与日志查询核对。

#### 证据与依据

**依据 1 · 源码核查**：[internal/middleware/auth.go:251-291](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/middleware/auth.go#L251-L291)

管理认证。

<details>
<summary>查看原文（41行）</summary>

```text
// UserAuthMiddleware middleware for UI and control API authentication
func (am *AuthMiddleware) UserAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			abortWithError(c, http.StatusUnauthorized, "User authorization header required", "invalid_request_error")
			return
		}

		// Extract token from "Bearer <token>" format
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			abortWithError(c, http.StatusUnauthorized, "Invalid user authorization header format. Expected: 'Bearer <token>'", "invalid_request_error")
			return
		}

		token := tokenParts[1]

		// Check against global config user token first
		cfg := am.config
		if cfg != nil && cfg.HasUserToken() {
			configToken := cfg.GetUserToken()

			// Remove "Bearer " prefix if present in the token
			if strings.HasPrefix(token, "Bearer ") {
				token = token[7:]
			}

			// Direct token comparison
			if token == configToken || strings.TrimPrefix(token, "Bearer ") == configToken {
				// Token matches the one in global config, allow access
				// For UI user authentication, set user_id to default admin
				// This matches the migrated user_id in usage_records
				c.Set(constant.CtxKeyUserID, db.DefaultAdminUserID)
				c.Next()
				return
			}
		}

		abortWithError(c, http.StatusUnauthorized, "Invalid user authorization token.", "invalid_request_error")
	}
```

</details>

**依据 2 · 源码核查**：[internal/middleware/auth.go:300-357](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/middleware/auth.go#L300-L357)

sharing key绑定/路由限制。

<details>
<summary>查看原文（58行）</summary>

```text
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

```

</details>

**依据 3 · 源码核查**：[internal/middleware/auth.go:363-398](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/middleware/auth.go#L363-L398)

global token/禁用与企业上下文入口。

<details>
<summary>查看原文（36行）</summary>

```text

		// If global token is disabled and multi-tenant is enabled, reject
		if cfg.IsMultiTenantEnabled() && cfg.IsGlobalTokenDisabled() {
			abortWithError(c, http.StatusUnauthorized, "Global token disabled, use API token", "invalid_token_error")
			return
		}

		configToken := cfg.GetModelToken()

		// Direct token comparison
		if token == configToken || xApiKey == configToken {
			// Set UserID to default admin for usage tracking consistency
			// This matches the migrated user_id values in usage_records
			c.Set(constant.CtxKeyAuthKind, constant.AuthKindGlobalModelToken)
			c.Set(constant.CtxKeyUserID, db.DefaultAdminUserID)
			contextJWT := strings.TrimSpace(c.GetHeader("X-TBE-Context-JWT"))
			if contextJWT != "" {
				claims, verifyErr := verifyEnterpriseContextJWT(cfg, contextJWT)
				if verifyErr != nil {
					abortWithError(c, http.StatusUnauthorized, "Invalid enterprise context jwt", "invalid_request_error")
					return
				}
				if claims != nil {
					c.Set(constant.CtxKeyEnterpriseUserID, claims.UserID)
					c.Set(constant.CtxKeyEnterpriseDepartmentID, claims.DepartmentID)
					c.Set(constant.CtxKeyEnterpriseKeyPrefix, claims.KeyPrefix)
					c.Set(constant.CtxKeyEnterpriseUserTier, claims.Tier)
					c.Set(constant.CtxKeyEnterpriseContextJTI, claims.JTI)
					c.Set(constant.CtxKeyEnterpriseContextVerified, true)
				}
			}
			c.Next()
			return
		}

		// Enterprise short-lived access token authentication.
```

</details>

**依据 4 · 源码核查**：[internal/middleware/auth.go:410-421](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/middleware/auth.go#L410-L421)

实际Gin route+bare team限制。

<details>
<summary>查看原文（12行）</summary>

```text
}

// sharingKeyCanAccessModelSurface is the sharing-principal authorization
// boundary. Authentication middleware is reused by both /tingly/:scenario and
// /virtual/* routes, so checking only for a valid token would turn every
// sharing key into a global model credential. Match the registered route shape
// (not the raw URL) and require the bare team scenario; both /tingly/team and
// /tingly/team/v1 endpoints use this template prefix.
func sharingKeyCanAccessModelSurface(c *gin.Context) bool {
	return c.Param("scenario") == "team" &&
		strings.HasPrefix(c.FullPath(), "/tingly/:scenario")
}
```

</details>

**依据 5 · 源码核查**：[internal/db/api_token_store.go:213-240](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/db/api_token_store.go#L213-L240)

enabled/expiry/team enabled。

<details>
<summary>查看原文（28行）</summary>

```text
func (s *APITokenStore) ValidateToken(tokenID string) (*APITokenRecord, error) {
	if tokenID == "" {
		return nil, errors.New("token ID cannot be empty")
	}

	s.mu.RLock()
	defer s.mu.RUnlock()

	record, ok := s.cache[tokenID]
	if !ok || !record.Enabled {
		return nil, fmt.Errorf("token not found or disabled")
	}
	if record.ExpiresAt != nil && record.ExpiresAt.Before(time.Now()) {
		return nil, fmt.Errorf("token expired")
	}
	if s.teamStore == nil {
		return nil, errors.New("team store is not initialized")
	}
	team, err := s.teamStore.Get(record.TeamID)
	if err != nil || !team.Enabled {
		return nil, fmt.Errorf("token team not found or disabled")
	}

	clone := *record
	return &clone, nil
}

// MoveTokenToTeam rebinds a sharing key without changing its raw token. The
```

</details>

**依据 6 · 源码核查**：[internal/protocolserver/routes_middleware.go:183-205](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/routes_middleware.go#L183-L205)

授权teamId转内部scenario。

<details>
<summary>查看原文（23行）</summary>

```text
func (ph *ProtocolHandler) teamScopeMiddleware(c *gin.Context) {
	if c.Param("scenario") != string(typ.ScenarioTeam) {
		c.Next()
		return
	}

	teamID := c.GetString(constant.CtxKeyTeamID)
	if teamID == "" {
		// Global model auth has no explicit team claim. Preserve the historic
		// /tingly/team behavior by treating it as the default team.
		teamID = db.DefaultTeamID
		c.Set(constant.CtxKeyTeamID, teamID)
	}
	if teamID != db.DefaultTeamID {
		for i := range c.Params {
			if c.Params[i].Key == "scenario" {
				c.Params[i].Value = string(typ.ProfiledScenarioName(typ.ScenarioTeam, teamID))
				break
			}
		}
	}
	c.Next()
}
```

</details>

**依据 7 · 源码核查**：[internal/routing/simple.go:38-59](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/simple.go#L38-L59)

probe pin实际分支。

<details>
<summary>查看原文（22行）</summary>

```text
	// X-Tingly-Probe-Service: {provider_uuid}:{model} — bypass all pipeline
	// stages and pin to the specified service. Used by service-target probes
	// that need to route through TB's middleware stack (for flag application)
	// while targeting a specific provider+model.
	if probeService := c.GetHeader("X-Tingly-Probe-Service"); probeService != "" {
		if providerUUID, model, ok := strings.Cut(probeService, ":"); ok {
			provider, err := s.selector.config.GetProviderByUUID(providerUUID)
			if err != nil || provider == nil {
				return nil, nil, fmt.Errorf("probe service provider not found: %s", providerUUID)
			}
			if !provider.Enabled {
				return nil, nil, fmt.Errorf("probe service provider disabled: %s", providerUUID)
			}
			svc := &loadbalance.Service{Provider: providerUUID, Model: model, Active: true}
			logrus.Debugf("[routing] probe service pin: provider=%s model=%s", provider.Name, model)
			setRoutingDebugHeaders(c, provider.Name, provider.UUID, model, SourceProbePin, -1, nil)
			return provider, svc, nil
		}
	}

	// Build context (session ID resolved internally)
	ctx := NewSelectionContext(rule, req, c, scenario)
```

</details>

**依据 8 · 源码核查**：[internal/protocolserver/routes.go:11-45](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/routes.go#L11-L45)

非global token剥probe，反证保护。

<details>
<summary>查看原文（35行）</summary>

```text
// debugRoutingHeaders are TB-internal diagnostic headers understood by the
// dispatch/routing layer (see .design/probe.md): X-Tingly-Debug-Routing asks
// for the resolved provider/upstream URL to be echoed back in response
// headers, and X-Tingly-Probe-Service/-Rule let the caller pin routing to an
// arbitrary provider+model, bypassing owner-configured load balancing. Both
// are meant only for TB's own loopback probes, which authenticate with the
// global model token — never for a sharing-key caller.
var debugRoutingHeaders = []string{
	"X-Tingly-Debug-Routing",
	"X-Tingly-Probe-Service",
	"X-Tingly-Probe-Rule",
}

// debugHeaderGuard strips the debug/probe routing headers above from any
// request that did not authenticate with the global model token, so a
// sharing-key holder can neither read back routing/provider internals nor
// pin service selection. Must run after modelAuth, which sets
// constant.CtxKeyAuthKind.
func (ph *ProtocolHandler) debugHeaderGuard(c *gin.Context) {
	if c.GetString(constant.CtxKeyAuthKind) != constant.AuthKindGlobalModelToken {
		for _, h := range debugRoutingHeaders {
			c.Request.Header.Del(h)
		}
	}
	c.Next()
}

// modelAuthChain builds the standard per-route handler prefix: modelAuth
// itself, then debugHeaderGuard (which depends on modelAuth having already
// set the auth-kind context key), then any route-specific middleware.
func (ph *ProtocolHandler) modelAuthChain(modelAuth gin.HandlerFunc, extra ...gin.HandlerFunc) []gin.HandlerFunc {
	chain := make([]gin.HandlerFunc, 0, 2+len(extra))
	chain = append(chain, modelAuth, ph.debugHeaderGuard)
	chain = append(chain, extra...)
	return chain
```

</details>

**依据 9 · 源码核查**：[internal/server/server_routes.go:88-107](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/server/server_routes.go#L88-L107)

key/team管理挂UserAuth。

<details>
<summary>查看原文（20行）</summary>

```text
// UseTokenManagementEndpoints registers the token management API endpoints.
func (s *Server) UseTokenManagementEndpoints() {
	if s.config == nil {
		return
	}
	sm := s.config.StoreManager()
	if sm == nil {
		return
	}
	store := sm.APIToken()
	if store == nil {
		return
	}

	manager := swagger.NewRouteManager(s.engine)
	api := manager.NewGroup("api", "v1", "")
	api.Router.Use(s.getUserAuthMiddleware())
	module.Mount(&module.Routes{V1: api, Engine: s.engine, Manager: manager},
		sharing.NewHandler(store), team.NewHandler(sm.Team()))
}
```

</details>

**依据 10 · 源码核查**：[internal/config/config.go:298-320](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/config/config.go#L298-L320)

安全新token与旧默认警告/打印。

<details>
<summary>查看原文（23行）</summary>

```text
	if cfg.UserToken == "" {
		// Always generate a cryptographically secure random token for new installs.
		// Falling back to a well-known default would defeat the purpose, so fail loudly instead.
		userToken, err := GenerateUserToken()
		if err != nil {
			return nil, fmt.Errorf("failed to generate secure user token: %w", err)
		}
		cfg.UserToken = userToken
		logrus.Info("=============================================")
		logrus.Info("Generated new UserToken for control panel:")
		logrus.Infof("  %s", cfg.UserToken)
		logrus.Info("Use this token to log in to the web UI at:")
		logrus.Infof("  http://localhost:%d/login/%s", cfg.ServerPort, cfg.UserToken)
		logrus.Info("=============================================")
		updated = true
	} else if IsDefaultToken(cfg.UserToken) {
		// Legacy config detected: pre-existing install with the well-known default token.
		// Warn but do not silently rotate, so the operator can re-distribute the new token.
		logrus.Warn("=============================================")
		logrus.Warn("SECURITY WARNING: Using default UserToken!")
		logrus.Warn("Please reset to a secure token via:")
		logrus.Warn("  1. Web UI: System page > Access Control")
		logrus.Warn("  2. CLI: tingly-box auth token --reset (coming soon)")
```

</details>

**依据 11 · 源码核查**：[internal/routing/stage_smart_routing.go:209-213](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/stage_smart_routing.go#L209-L213)

quota未注入时pass-through。

```text
	// Pre-collect quota usage the same way. A no-op (nil slice) when
	// no QuotaProvider is wired, so service_quota ops simply pass through.
	reqCtx.ServiceQuota = s.collectAllQuotaInfo(selectionLogContext(ctx), rule.SmartRouting)

	// Create router and evaluate
```

**依据 12 · 源码核查**：[internal/routing/stage_smart_routing.go:380-412](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/stage_smart_routing.go#L380-L412)

缺/未知quota样本处理。

<details>
<summary>查看原文（33行）</summary>

```text
func (s *SmartRoutingStage) collectAllQuotaInfo(ctx context.Context, rules []smartrouting.SmartRouting) []smartrouting.ServiceQuotaInfo {
	if s.quotaProvider == nil || !hasServiceQuotaOp(rules) {
		return nil
	}
	seen := make(map[string]struct{})
	pctByProvider := make(map[string]*float64) // nil value = provider quota unknown
	var result []smartrouting.ServiceQuotaInfo
	for _, r := range rules {
		for _, svc := range r.Services {
			id := svc.ServiceID()
			if _, ok := seen[id]; ok {
				continue
			}
			seen[id] = struct{}{}

			if svc.Provider == "" {
				continue
			}
			pctPtr, looked := pctByProvider[svc.Provider]
			if !looked {
				if usage, err := s.quotaProvider.GetQuota(ctx, svc.Provider); err == nil && usage != nil {
					if pct, ok := usage.Pct(quota.WindowKindLimit); ok {
						pctPtr = &pct
					}
				}
				pctByProvider[svc.Provider] = pctPtr
			}
			if pctPtr == nil {
				continue
			}
			result = append(result, smartrouting.ServiceQuotaInfo{
				ServiceID: id,
				Pct:       *pctPtr,
```

</details>

**依据 13 · 源码核查**：[internal/protocolserver/quota.go:14-53](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/quota.go#L14-L53)

只读缓存且sharing拒quota。

<details>
<summary>查看原文（40行）</summary>

```text
// QuotaReader reads stored provider quota; it never fetches upstream, so the
// quota endpoint cannot drive requests to the vendors behind this box.
type QuotaReader interface {
	GetQuota(ctx context.Context, providerUUID string) (*quota.ProviderUsage, error)
}

// HandleScenarioQuota serves GET /tingly/:scenario[/v1]/quota: the quota of
// the providers behind the scenario's rules, relayed as one
// ProviderUsage for a downstream tingly-box to display
// (.design/quota-relay.md). Only the owner's model token reads it; sharing
// keys are refused until a team can opt in.
func (ph *ProtocolHandler) HandleScenarioQuota(c *gin.Context) {
	if c.GetString(constant.CtxKeyAuthKind) == constant.AuthKindSharingKey {
		writeErrorResponse(c, http.StatusForbidden, ErrorResponse{Error: ErrorDetail{Message: "Quota is not shared with sharing keys", Type: "forbidden_error"}})
		return
	}
	if ph.deps.QuotaReader == nil {
		writeErrorResponse(c, http.StatusServiceUnavailable, ErrorResponse{Error: ErrorDetail{Message: "Quota is not available on this server", Type: "service_unavailable"}})
		return
	}

	scenario := typ.RuleScenario(c.Param("scenario"))
	seen := make(map[string]bool)
	var upstreams []*quota.ProviderUsage
	for _, rule := range ph.deps.Config.GetRequestConfigs() {
		if !rule.Active || rule.GetScenario() != scenario {
			continue
		}
		for _, svc := range rule.GetServices() {
			if svc == nil || !svc.Active || seen[svc.Provider] {
				continue
			}
			seen[svc.Provider] = true
			if usage, err := ph.deps.QuotaReader.GetQuota(c.Request.Context(), svc.Provider); err == nil {
				upstreams = append(upstreams, usage)
			}
		}
	}
	c.JSON(http.StatusOK, quota.RelayUsage(upstreams))
}
```

</details>

**依据 14 · 源码核查**：[internal/routing/smartrouting/routing.go:549-577](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/smartrouting/routing.go#L549-L577)

quota无样本res.Matched=true并reason no quota info; pass，直接核评估器。

<details>
<summary>查看原文（29行）</summary>

```text
// evaluateServiceQuotaOp compares the tightest (max, not average — one hot
// service makes the whole pool look hot) *standard* quota usage across the
// rule's services' providers (ctx.ServiceQuota, pre-filtered per-rule by
// evaluateRule) against the threshold. Services with unknown quota are
// absent from ctx.ServiceQuota rather than counted as 0%; with no data at
// all the op passes, so quota-blind rules and cold data never block
// routing. Aggregation and Kind=limit scoping rationale:
// .design/quota-semantics.md §8.1.
func (r *Router) evaluateServiceQuotaOp(ctx *RequestContext, op *SmartOp) OpEvalResult {
	res := newOpResult(op)
	if len(ctx.ServiceQuota) == 0 {
		res.Matched = true
		res.Reason = "no quota info; pass"
		return res
	}
	threshold, err := op.Int()
	if err != nil {
		log.Printf("[smart_routing] invalid service_quota value '%s': %v", op.Value, err)
		res.Reason = fmt.Sprintf("invalid int: %v", err)
		return res
	}
	tightest := ctx.ServiceQuota[0].Pct
	for _, q := range ctx.ServiceQuota[1:] {
		if q.Pct > tightest {
			tightest = q.Pct
		}
	}
	res.Actual = fmt.Sprintf("%.1f%%", tightest)
	matched, reason, ok := comparePctThreshold(op.Operation, "tightest quota", tightest, threshold)
```

</details>

#### 缺口

- 团队全查询隔离/撤销在途、企业JWT所有路径与真实额度边界未全审/执行
  **影响**：只能确认核心认证/范围链，非全多租户安全或财务硬上限
  **进一步探讨**：用两个无价值team/key测跨scope/virtual/probe/禁用/expiry和管理读取，quota缺失/延迟并发下核实际请求与归属。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 选路/协议/失败回退和流式结果有哪些语义边界？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

常规pipeline是Health→Smart→Affinity→LoadBalancer，初始集合包含base及smart分区后由Smart缩回匹配/基池，affinity按session+matched partition使旧pin不压过当次内容决定。Smart还可能做processor改请求后一次性回base，非法router/无匹配降回base，不是自动语义理解业务目标。

Health按429/auth等过滤，但全候选都不健康时degrade保全，pipeline缩空也会尝试activeBaseFallback，保上游真实错误而不隐藏成“无服务”。这是可用性取舍，不是保证只挑健康/最低价或不再触额度限制。选路末还核service.Active/provider.Enabled。

OpenAI chat的每attempt重做目标协议/输出上限/规则transform，源请求多provider时保pristine模板，跨provider可有不同API风格。attempt_plan对Responses→Google-style明确不支持会报错，说明any-to-any有具体能力边界；本轮不全审转换器/工具名字、thinking/cache/image等全部语义，不能由能返回文字推完整协议等价。

多service failover用firstChunkGate缓冲headers/status/body，直到producer第一真实chunk才commit；可重试401/403/429/500/502/503/504，状态0视终止。最多按active service数并记录tried，不无限兜圈。committed后即使stream坏也不再重试，避免给客户端混两份流；故不能保证每个中断自动恢复。前置retry可能已在厂商产生消耗，未看到客户端字节不等上游未执行/免费。

请求追踪逐attempt更新provider/active service、独立span和failover事件，成功fallback会重置recoveredErrorCount；最终上下文/usage以最后服务为主，需连attempt timeline看原失败，不把最终success当全程无故障/全费用。健康/熔断与重试路径能解释选择，仍需真实客户端校验工具结果/拒绝/部分流与取消，不能只测列表和ping。

#### 证据与依据

**依据 1 · 源码核查**：[internal/routing/selector.go:153-178](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/selector.go#L153-L178)

真实pipeline顺序。

<details>
<summary>查看原文（26行）</summary>

```text
	// One pipeline serves every rule — order is health → smart → affinity →
	// strategy. Each stage self-guards, so there is no need for per-mode
	// variants:
	//   - Health  narrows the candidate set by 429/auth health; passes through
	//     when no filter is set or filtering would empty the set (degrade).
	//   - Smart   runs BEFORE affinity: it decides the content partition (and
	//     always runs processor ops, which mutate the request) by narrowing
	//     the candidate set to the matched subset. Running it after affinity
	//     let a first-request pin defeat content routing for the whole
	//     session TTL — and skip processor ops entirely for pinned sessions.
	//     Passes through when smart routing is off or unmatched.
	//   - Affinity returns nothing when affinity is disabled or there's no
	//     session. Pins are scoped per matched partition (AffinitySessionKey),
	//     so stickiness lives INSIDE the content decision, never above it.
	//     The breaker-driven (500) signal is consulted inside the affinity
	//     tier check and the tier tactic; Health feeds it the 429/auth signal.
	//   - LB      always selects (the terminal fallback) within the narrowed
	//     candidate set, labeling the result smart_routing when a partition
	//     matched.
	s.pipeline = []SelectionStage{
		NewHealthStage(healthFilter),
		newSmart(),
		NewAffinityStage(affinity),
		NewLoadBalancerStage(lb),
	}

```

</details>

**依据 2 · 源码核查**：[internal/routing/selector.go:208-261](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/selector.go#L208-L261)

空集合回退与终选验证。

<details>
<summary>查看原文（54行）</summary>

```text

		narrowed, result, err := stage.Evaluate(ctx, candidates)
		if err != nil {
			return nil, fmt.Errorf("stage %s: %w", stageName, err)
		}
		// Degrade, don't disappear — enforced once here, between stages, so no
		// stage ever observes an empty candidate set while the rule still has
		// active services (see activeBaseFallback). A rule with zero active
		// services keeps the empty set and the terminal stage reports it.
		if len(narrowed) == 0 {
			if fallback := activeBaseFallback(ctx, ctx.Rule, "routing_pipeline_degrade"); fallback != nil {
				narrowed = fallback
			}
		}
		candidates = narrowed

		if result != nil {
			// Attach the cumulative path at the terminal boundary so
			// observability reports every stage that actually ran, including
			// pass-through stages that only narrowed the candidate set.
			result.EvaluatedStages = append([]string(nil), evaluatedStages...)

			if result.Service == nil {
				logrus.Warnf("[selector] stage %s returned a final result with a nil service", stageName)
				continue
			}

			// Validate service is active
			if !result.Service.Active {
				logrus.Debugf("[selector] stage %s returned inactive service, trying next stage", stageName)
				continue
			}

			// Resolve provider
			provider, err := s.config.GetProviderByUUID(result.Service.Provider)
			if err != nil {
				logrus.Debugf("[selector] provider not found for service: %v, trying next stage", err)
				continue
			}

			if !provider.Enabled {
				logrus.Debugf("[selector] provider %s is disabled, trying next stage", provider.Name)
				continue
			}

			result.Provider = provider

			// Post-process: lock affinity if needed
			s.postProcess(ctx, result)

			logrus.Debugf("[selector] selected service %s from provider %s via %s",
				result.Service.Model, provider.Name, result.Source)

			return result, nil
```

</details>

**依据 3 · 源码核查**：[internal/routing/stage_health.go:26-80](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/stage_health.go#L26-L80)

全不健康degrade保全。

<details>
<summary>查看原文（55行）</summary>

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
	}

	filteredCount := before - len(healthy)

	if filteredCount > 0 {
		logrus.WithContext(selectionLogContext(ctx)).WithFields(logrus.Fields{
			"stage":           "routing_health_filtered",
			"rule_uuid":       selectionRuleUUID(ctx),
			"filtered_count":  filteredCount,
			"remaining_count": len(healthy),
			"candidate_count": before,
		}).Warnf("[health] Filtered %d unhealthy services, %d remaining (of %d total)",
			filteredCount, len(healthy), before)
		// Log each filtered service for debugging
		for _, svc := range candidates {
			if !s.filter.IsHealthy(svc.ServiceID()) {
				logrus.WithContext(selectionLogContext(ctx)).WithFields(logrus.Fields{
					"stage":         "routing_health_filtered_service",
					"rule_uuid":     selectionRuleUUID(ctx),
					"service":       svc.ServiceID(),
					"provider_uuid": svc.Provider,
					"model":         svc.Model,
					"reason":        "rate_limited_or_auth_error",
				}).Warnf("[health] Service %s:%s is unhealthy (rate limited/auth error)",
					svc.Provider, svc.Model)
			}
		}
	}

	// Continue pipeline (don't select, just filter)
	return healthy, nil, nil
```

</details>

**依据 4 · 源码核查**：[internal/routing/stage_smart_routing.go:157-188](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/stage_smart_routing.go#L157-L188)

无smart/未启回base。

<details>
<summary>查看原文（32行）</summary>

```text
func (s *SmartRoutingStage) Evaluate(ctx *SelectionContext, candidates []*loadbalance.Service) ([]*loadbalance.Service, *SelectionResult, error) {
	rule := ctx.Rule

	// candidates arrives seeded with base ∪ every partition's services — see
	// initialCandidateServices for why. Every exit below that does NOT narrow
	// to a matched partition instead narrows to basePool, so a service that
	// only exists inside an unmatched (or bypassed) partition never reaches
	// the terminal pick. basePool is computed lazily (only the branches that
	// actually take the non-matched exit pay for the intersection + its map
	// allocation) since the common case — a partition matches — never needs it.
	// The intersection can come back empty when health filtering removed
	// every base service from the union while a partition-only service stayed
	// healthy (HealthStage's all-unhealthy guard runs on the union, so it
	// does not fire then). The pipeline driver restores the active base set
	// in that case — see the degrade enforcement in ServiceSelector.Select.
	basePool := func() []*loadbalance.Service { return IntersectServices(candidates, rule.Services) }

	// Skip if smart routing not enabled. When SmartRouting is empty,
	// initialCandidateServices never added anything beyond rule.Services, so
	// candidates already IS the base pool — basePool() would be a provable
	// no-op there (a wasted map-build + scan on every plain, non-smart rule,
	// the common case), so skip straight to returning candidates unchanged.
	if len(rule.SmartRouting) == 0 {
		logrus.Debugf("[smart_routing] skipped - SmartRoutingCount=0")
		return candidates, nil, nil
	}
	if !rule.SmartEnabled || ctx.Request == nil {
		logrus.Debugf("[smart_routing] skipped - SmartEnabled=%v, SmartRoutingCount=%d, Request=%v",
			rule.SmartEnabled, len(rule.SmartRouting), ctx.Request != nil)
		return basePool(), nil, nil
	}

```

</details>

**依据 5 · 源码核查**：[internal/routing/stage_smart_routing.go:216-245](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/stage_smart_routing.go#L216-L245)

非法/无匹配与processor一次性bypass。

<details>
<summary>查看原文（30行）</summary>

```text
		logrus.Debugf("[smart_routing] failed to create router: %v", err)
		s.emitTrace(ctx, reqCtx, nil, -1, 0, 0, nil, "router_invalid", err.Error())
		return basePool(), nil, nil
	}

	matchedServices, matchedRuleIndex, matched, trace := router.Evaluate(reqCtx)
	if !matched || len(matchedServices) == 0 {
		logrus.Debugf("[smart_routing] no rule matched - matched=%v, services=%d", matched, len(matchedServices))
		s.emitTrace(ctx, reqCtx, trace, -1, 0, 0, nil, "no_match", "no rule matched the request")
		return basePool(), nil, nil
	}

	matchedRule := rule.SmartRouting[matchedRuleIndex]

	// If this rule was already bypassed in an earlier pass, do not run its
	// processors again — fall through to the LoadBalancer instead.
	if _, already := ctx.BypassedSmartRules[matchedRuleIndex]; already {
		s.emitTrace(ctx, reqCtx, trace, matchedRuleIndex, len(matchedServices), 0, nil,
			"bypass_already_done", "rule already bypassed by op-level processor; falling through to LoadBalancer")
		return basePool(), nil, nil
	}

	// Implicit bypass: if the matched rule's ops carry registered processors,
	// run them (they mutate ctx.Request in place) and fall through to
	// basePool. We do NOT re-evaluate smart-routing rules against the
	// mutated request — keeping the bypass strictly one-shot prevents
	// post-processor inputs from triggering unintended matches downstream.
	if s.runOpProcessors(ctx, reqCtx, matchedRule, matchedRuleIndex, matchedServices) {
		s.emitTrace(ctx, reqCtx, trace, matchedRuleIndex, len(matchedServices), 0, nil,
			"bypass_processor_run", "op-level processor ran; falling through to LoadBalancer")
```

</details>

**依据 6 · 源码核查**：[internal/routing/stage_affinity.go:30-65](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/stage_affinity.go#L30-L65)

session+smart分区的亲和key。

<details>
<summary>查看原文（36行）</summary>

```text
// content partition smart routing matched: the bare session for the rule's
// top-level pool (no match, index -1), or session + "#sr<idx>" inside a smart
// subset. Partition-scoping is what lets one session hold independent pins
// per request kind (e.g. a Claude Code main pin and a subagent pin), each
// with its own prompt-cache continuity.
//
// The partition identity is the smart rule's index, the only stable handle
// the config offers. Editing the rule list can renumber partitions and
// mis-bucket existing pins; pins are in-memory with short TTLs, so this
// self-heals within one TTL.
func AffinitySessionKey(sessionID string, matchedSmartRuleIndex int) string {
	if matchedSmartRuleIndex < 0 {
		return sessionID
	}
	return sessionID + "#sr" + strconv.Itoa(matchedSmartRuleIndex)
}

// Name returns the stage identifier
func (s *AffinityStage) Name() string {
	return SourceAffinity
}

// Evaluate checks for locked service affinity
func (s *AffinityStage) Evaluate(ctx *SelectionContext, candidates []*loadbalance.Service) ([]*loadbalance.Service, *SelectionResult, error) {
	rule := ctx.Rule

	// Skip if affinity not enabled. Affinity is a load-balancing concern and
	// is independent of smart routing — it applies whenever a session can be
	// identified, regardless of rule.SmartEnabled.
	if !rule.AffinityEnabled() || ctx.SessionID.IsEmpty() {
		return candidates, nil, nil
	}

	// Look up the pin in the partition smart routing just matched (or the
	// top-level partition when nothing matched).
	entry, ok := s.store.Get(rule.UUID, AffinitySessionKey(ctx.SessionID.String(), ctx.MatchedSmartRuleIndex))
```

</details>

**依据 7 · 源码核查**：[internal/protocolserver/attempt_plan.go:79-111](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/attempt_plan.go#L79-L111)

具体目标协议含Responses→Google拒绝。

<details>
<summary>查看原文（33行）</summary>

```text
// or the Anthropic style when the rule's anthropic_endpoint_override forces
// it and the provider supports one. A force on a provider without Anthropic
// support is logged and ignored — the override degrades to adaptive routing,
// mirroring how an unsupported openai_endpoint_override only warns.
func (ph *ProtocolHandler) resolveAttemptStyle(c *gin.Context, rule *typ.Rule, provider *typ.Provider, source protocol.APIType) ai.APIStyle {
	style := clientAPIStyle(source)
	if ParseAnthropicOverride(ResolveRuleFlags(c, rule).AnthropicEndpointOverride) != AnthropicOverrideAnthropic {
		return style
	}
	if supportsAnthropicStyle(provider) {
		return ai.APIStyleAnthropic
	}
	logrus.Warnf("Rule forces the Anthropic endpoint on provider %s which has no Anthropic style; ignoring the override", provider.UUID)
	return style
}

// resolveAttemptTarget maps the provider's API style to the protocol the
// request is sent in. An OpenAI-style provider goes through endpoint routing
// (.design/openai-endpoint-routing.md): Chat clients prefer Chat, every other
// client prefers Responses.
func (ph *ProtocolHandler) resolveAttemptTarget(c *gin.Context, rule *typ.Rule, provider *typ.Provider, model string, source protocol.APIType) (protocol.APIType, error) {
	anthropicClient := source == protocol.TypeAnthropicV1 || source == protocol.TypeAnthropicBeta
	switch provider.APIStyle {
	case protocol.APIStyleAnthropic:
		if anthropicClient {
			return source, nil
		}
		return protocol.TypeAnthropicBeta, nil
	case protocol.APIStyleGoogle:
		if source == protocol.TypeOpenAIResponses {
			return "", fmt.Errorf("Responses API does not support Google-style providers yet. Provider: %s", provider.Name)
		}
		return protocol.TypeGoogle, nil
```

</details>

**依据 8 · 源码核查**：[internal/protocolserver/openai_chat.go:155-178](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/openai_chat.go#L155-L178)

recorder/pristine模板。

<details>
<summary>查看原文（24行）</summary>

```text
	// selection: the rule's recording flag overrides the scenario-level
	// recording_v2 default.
	if recMode := typ.EffectiveRecording(rule, scenarioConfig); recMode.Enabled() {
		bs, err := req.MarshalJSON()
		if err != nil {
			bs = []byte("{}")
		}
		ph.EnsureProtocolRecorder(c, string(scenarioType), provider, actualModel, obs.RecordMode(recMode), bs)
	}

	// Snapshot a pristine template only when failover is possible.
	multi := len(rule.GetActiveServices()) > 1
	var template []byte
	if multi {
		bs, err := req.MarshalJSON()
		if err != nil {
			writeErrorResponse(c, http.StatusInternalServerError, ErrorResponse{
				Error: ErrorDetail{Message: err.Error(), Type: "api_error"},
			})
			return
		}
		template = bs
	}

```

</details>

**依据 9 · 源码核查**：[internal/protocolserver/openai_chat.go:198-224](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/openai_chat.go#L198-L224)

每attempt重新计划/transform/dispatch。

<details>
<summary>查看原文（27行）</summary>

```text
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
}
```

</details>

**依据 10 · 源码核查**：[internal/protocolserver/failover_dispatch.go:74-106](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/failover_dispatch.go#L74-L106)

实际可重试状态。

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

**依据 11 · 源码核查**：[internal/protocolserver/failover_dispatch.go:132-178](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/failover_dispatch.go#L132-L178)

buffer/flush边界。

<details>
<summary>查看原文（47行）</summary>

```text
	return &firstChunkGate{
		ResponseWriter: w,
		real:           w,
		hdr:            http.Header{},
	}
}

func (g *firstChunkGate) Header() http.Header {
	if g.committed {
		return g.real.Header()
	}
	return g.hdr
}

func (g *firstChunkGate) Write(p []byte) (int, error) {
	if g.committed {
		return g.real.Write(p)
	}
	if g.status == 0 {
		g.status = http.StatusOK
	}
	return g.buf.Write(p)
}

func (g *firstChunkGate) WriteString(s string) (int, error) {
	return g.Write([]byte(s))
}

func (g *firstChunkGate) WriteHeader(code int) {
	if g.committed {
		g.real.WriteHeader(code)
		return
	}
	g.status = code
}

// WriteHeaderNow is swallowed while buffered, delegated once committed.
func (g *firstChunkGate) WriteHeaderNow() {
	if g.committed {
		g.real.WriteHeaderNow()
	}
}

// Flush is a no-op while buffered (so partial SSE can't leak past the
// gate before commit) and delegates once committed (so streaming clients
// keep getting incremental delivery). ProcessStream type-asserts the
// writer for http.Flusher, so this method must exist concretely.
```

</details>

**依据 12 · 源码核查**：[internal/protocolserver/failover_dispatch.go:209-227](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/failover_dispatch.go#L209-L227)

first chunk commit信号。

<details>
<summary>查看原文（19行）</summary>

```text
	return g.buf.Len() > 0 || g.status != 0
}

// Committed reports whether the gate has flushed to the wire. Once
// committed, retry is impossible — bytes have left the process.
func (g *firstChunkGate) Committed() bool {
	return g.committed
}

// CommitFirstChunk is the producer's "first real chunk arrived" signal.
// It flushes captured headers + status + buffered body to the real
// writer and switches to pass-through. Idempotent.
func (g *firstChunkGate) CommitFirstChunk() {
	g.commit()
}

// CommitFirstChunkIfGate signals "first real chunk arrived" if w is
// currently a *firstChunkGate (installed by DispatchWithPriorityFailover
// when a rule has more than one active service), no-op otherwise. Exported
```

</details>

**依据 13 · 源码核查**：[internal/protocolserver/failover_dispatch.go:365-445](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/failover_dispatch.go#L365-L445)

有限attempt/更新上下文/committed后不重试。

<details>
<summary>查看原文（81行）</summary>

```text
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

	tried := map[string]bool{}
	provider := initialProvider
	model := initialModel

	// Keep the recorder's bound service in sync per attempt so the
	// breaker store gets fed the right serviceID on failure.
	rec, _ := recording.GetRecorderFromContext(c)

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
		if succeeded {
			c.Set(constant.CtxKeyRecoveredErrorCount, errorsBeforeAttempt)
		}

		// Once bytes reach the wire, retry is impossible, even if streaming fails.
		status, committed := gate.Status(), gate.Committed()
		if committed {
			loadbalance.RecordServiceSuccess(rule.UUID, serviceID)
		}
		if committed || !isRetryableStatus(status) {
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
```

</details>

**依据 14 · 源码核查**：[internal/protocolserver/failover_dispatch.go:450-510](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/failover_dispatch.go#L450-L510)

失败健康记录/异构fallback与事件。

<details>
<summary>查看原文（61行）</summary>

```text
		// breaker owns transient 5xx failures within a rule. A successful
		// fallback means final usage tracking only sees the fallback's success,
		// so record a failed 429 attempt here or the next request would select
		// the rate-limited service again before SmartRouting/LB evaluation.
		if ph.deps.HealthMonitor != nil {
			switch status {
			case http.StatusTooManyRequests:
				ph.deps.HealthMonitor.ReportRateLimit(serviceID)
			case http.StatusUnauthorized, http.StatusForbidden:
				// Same reasoning as the 429 case: the fallback's success is all
				// the final usage tracking sees, so the broken credential would
				// keep winning selection on every subsequent request.
				ph.deps.HealthMonitor.ReportAuthError(serviceID, status)
			}
		}

		loadbalance.RecordServiceFailure(rule.UUID, serviceID)
		state := loadbalance.DefaultBreakerStore().Get(rule.UUID, serviceID).State()
		fields = failoverLogFields(c, rule, provider, model, serviceID)
		fields["stage"] = "breaker_failure_recorded"
		fields["rule_uuid"] = rule.UUID
		fields["status"] = status
		fields["breaker_state"] = state.String()
		logrus.WithContext(c.Request.Context()).WithFields(fields).Warnf("[breaker] recorded failure for %s; state=%s", serviceID, state.String())

		fields = failoverLogFields(c, rule, provider, model, serviceID)
		fields["stage"] = "failover_attempt_failed"
		fields["attempt"] = i + 1
		fields["active_services"] = len(activeServices)
		fields["status"] = status
		fields["retryable"] = true
		logrus.WithContext(c.Request.Context()).WithFields(fields).Warnf("[failover] attempt %d failed with retryable status %d on %s/%s",
			i+1, status, provider.UUID, model)

		// Pass "" so the candidate pool spans all API styles: each attempt
		// re-transforms the request for the selected provider's style, so
		// heterogeneous failover (e.g. Anthropic → OpenAI) is supported.
		nextProvider, nextService, err := ph.selectFallbackService(rule, tried, "")
		if err != nil {
			fields := failoverLogFields(c, rule, provider, model, serviceID)
			fields["stage"] = "failover_error"
			fields["attempt"] = i + 1
			fields["active_services"] = len(activeServices)
			fields["status"] = status
			fields["error"] = err.Error()
			logrus.WithContext(c.Request.Context()).WithFields(fields).Warnf("[failover] load balancer failed selecting fallback after %d attempt(s) status=%d: %v", i+1, status, err)
			return
		}
		if nextProvider == nil || nextService == nil {
			fields := failoverLogFields(c, rule, provider, model, serviceID)
			fields["stage"] = "failover_exhausted"
			fields["attempt"] = i + 1
			fields["active_services"] = len(activeServices)
			fields["status"] = status
			logrus.WithContext(c.Request.Context()).WithFields(fields).Warnf("[failover] giving up after %d attempt(s) status=%d (no more services)", i+1, status)
			return
		}

		nextServiceID := loadbalance.FormatServiceID(nextProvider.UUID, nextService.Model)
		fields = failoverLogFields(c, rule, provider, model, serviceID)
		fields["stage"] = "failover_retry"
```

</details>

#### 缺口

- 所有协议/工具/流式/取消组合和重试消耗未独立重放
  **影响**：不能保证any-to-any、自动容错或节约费用，原始任务结果仍验收
  **进一步探讨**：固定模拟上游在headers前/首chunk前后失败，对比流字节、tool ids/arguments、次数/usage与实际服务，检查取消。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配置、密钥、监控与外部依赖如何启动恢复？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

CLI默认host localhost、12580口径，部署可改host，不能把本机默认推广成互联网团队安全。管理token启动打印完整login URL，global/config含user/model token、EncryptProviders选项默认false；providers/rules已迁SQLite，不据字段/开关声称所有静态凭据都加密或数据库全安全。本轮没审完provider加密/OAuth/导入和全日志脱敏，需保护配置/数据库、终端日志和备份。

rulesStore启动以SQLite为权威，有旧JSON只一次迁入；数据库已有规则时手改config.json的rules不再合并，下次Save清file mirror，差异会warn。store关闭且规则变化会拒Save，避免报保存而没地方落，这一点比静默成功强。恢复应包含DB及相关配置/密钥，不是只拷一份旧JSON；本轮未核完整跨版本数据库迁移/备份事务。

DSH apply是有明确副作用的管理操作：从当前规则生成models，写settings的tingly-box stanza保其它映射，再写credentials model token，分别先备份再os.WriteFile(0644/0600)。它不是两文件atomic/CAS；settings已改后credentials失败可部分生效，helper有些错误以Success:false/Message且err=nil返回，handler最终Success是两者&&。HTTP200也必须读具体结果，再核两文件/原件；退出网关/卸npm不撤已写DSH配置或远端密钥。

已有请求timeline把HTTP/转换/选路日志按request_id关联，含failover path/hops；usage数据库有input/output/cache read/write/reasoning的子集口径、partial/error/success和trace关联，非只有调用次数。smart trace还可含latest_user_head前80字节和匹配窗口，送专用memory logger与Debug；有界片段仍可能敏感，不把日志等同匿名统计。作者<1ms/harness只是声称，本轮不跑测试或性能。

运行依赖平台binary/所配provider网络、协议和合法key/OAuth、本地DB/存储与客户端；源码构建还需Go1.26、多个local replace模块/submodule和前端Node/pnpm链。可先用VModel/模拟上游隔离验证协议，不能因为虚拟模型通过就当真实厂商限流/语义同样通过。

#### 证据与依据

**依据 1 · 源码核查**：[internal/command/options/server_options.go:43-53](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/command/options/server_options.go#L43-L53)

默认localhost/启动参数。

<details>
<summary>查看原文（11行）</summary>

```text
// AddStartFlags adds all start-related flags to a command
// This is shared between start, restart, gui, and slim commands
func AddStartFlags(cmd *cobra.Command, flags *StartFlags) {
	cmd.Flags().IntVarP(&flags.Port, "port", "p", 0, "Server port (default: from config or 12580)")
	cmd.Flags().StringVar(&flags.Host, "host", "localhost", "Server host")
	cmd.Flags().BoolVarP(&flags.EnableUI, "ui", "u", true, "Enable web UI (default: true)")
	cmd.Flags().BoolVar(&flags.EnableDebug, "debug", false, "Enable debug mode including gin, low level logging and so on (default: false)")
	cmd.Flags().BoolVar(&flags.EnableOpenBrowser, "browser", true, "Auto-open browser when server starts (default: true)")
	cmd.Flags().BoolVar(&flags.EnableStyleTransform, "adapter", true, "Enable API style transformation (default: true)")
	cmd.Flags().BoolVar(&flags.Daemon, "daemon", false, "Run as daemon in background (default: false)")
	cmd.Flags().StringVar(&flags.LogFile, "log-file", "", "Log file path for daemon mode (default: ~/.tingly-box/tingly-box.log)")
```

</details>

**依据 2 · 源码核查**：[internal/config/config.go:35-60](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/config/config.go#L35-L60)

静态凭据字段/加密选项与DB迁移归属。

<details>
<summary>查看原文（26行）</summary>

```text
	// LegacyRules receives the file's "rules" array on load. It is consumed
	// exactly once, by hydrateRulesFromStore (one-time import into the
	// database on upgraded installs); after hydration the field stays nil and
	// file rules are ignored on reload. The "rules" key is no longer mirrored
	// by Save() (dual-write removed): it is read only for the legacy import and
	// written back as null.
	LegacyRules        []typ.Rule           `yaml:"-" json:"rules"`
	UserToken          string               `yaml:"user_token" json:"user_token"`               // User token for UI and control API authentication
	ModelToken         string               `yaml:"model_token" json:"model_token"`             // Model token for OpenAI and Anthropic API authentication
	InternalAPIToken   string               `json:"-"`                                          // Internal API token for probe testing (generated at startup, not persisted)
	EncryptProviders   bool                 `yaml:"encrypt_providers" json:"encrypt_providers"` // Whether to encrypt provider info (default false)
	Scenarios          []typ.ScenarioConfig `yaml:"scenarios" json:"scenarios"`                 // Scenario-specific configurations
	GUI                GUIConfig            `json:"gui"`                                        // GUI-specific settings
	RandomUUID         string               `json:"random_uuid"`                                // A random uuid to help protocol transform for some special provider
	ClaudeCodeDeviceID string               `json:"claude_code_device_id"`                      // Calc from random claude code device id with sha256

	// Merged fields from Config struct
	// ProvidersV1 and Providers are legacy JSON-config storage for providers.
	// Providers now live in SQLite (db.ProviderStore); these fields are only
	// populated on load for one-time migration to the database and are cleared
	// by migrateProvidersToDB. The non-omitempty tags ensure that clearing them
	// results in a JSON null that overrides any stale value in the existing file.
	ProvidersV1 map[string]*typ.Provider `json:"providers"`
	Providers   []*typ.Provider          `json:"providers_v2"`
	ServerPort  int                      `json:"-"`
	ServerHost  string                   `json:"-"` // Server host address (e.g., "localhost", "0.0.0.0", "192.168.1.100")
```

</details>

**依据 3 · 源码核查**：[internal/config/config.go:298-320](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/config/config.go#L298-L320)

登录token日志。

<details>
<summary>查看原文（23行）</summary>

```text
	if cfg.UserToken == "" {
		// Always generate a cryptographically secure random token for new installs.
		// Falling back to a well-known default would defeat the purpose, so fail loudly instead.
		userToken, err := GenerateUserToken()
		if err != nil {
			return nil, fmt.Errorf("failed to generate secure user token: %w", err)
		}
		cfg.UserToken = userToken
		logrus.Info("=============================================")
		logrus.Info("Generated new UserToken for control panel:")
		logrus.Infof("  %s", cfg.UserToken)
		logrus.Info("Use this token to log in to the web UI at:")
		logrus.Infof("  http://localhost:%d/login/%s", cfg.ServerPort, cfg.UserToken)
		logrus.Info("=============================================")
		updated = true
	} else if IsDefaultToken(cfg.UserToken) {
		// Legacy config detected: pre-existing install with the well-known default token.
		// Warn but do not silently rotate, so the operator can re-distribute the new token.
		logrus.Warn("=============================================")
		logrus.Warn("SECURITY WARNING: Using default UserToken!")
		logrus.Warn("Please reset to a secure token via:")
		logrus.Warn("  1. Web UI: System page > Access Control")
		logrus.Warn("  2. CLI: tingly-box auth token --reset (coming soon)")
```

</details>

**依据 4 · 源码核查**：[internal/config/rule_storage.go:14-80](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/config/rule_storage.go#L14-L80)

数据库权威/JSON迁移和差异警告。

<details>
<summary>查看原文（67行）</summary>

```text
// Rule storage: rules live in SQLite (db.RuleStore) with Config.Rules as the
// in-memory working set. See .design/rule-storage.md for the full rationale.
//
// Lifecycle:
//   - database has rules  -> database is authoritative; file rules ignored
//   - database empty, JSON has rules -> one-time import into the database
//   - both empty -> nothing to do (fresh install; built-ins arrive via AddRule)
//
// The JSON copy is read only for the one-time import; Save() writes the
// file's "rules" key as null (the former downgrade-compat mirror is gone).
// See .design/rule-storage.md §5.

// rulesStore resolves the rule store at call time from the StoreManager, so
// store liveness has a single owner: after StoreManager.Close() the accessor
// returns nil and rule syncing degrades to a no-op instead of failing on a
// closed connection. Reads the field directly (not via c.StoreManager()) —
// callers may already hold c.mu, and the field is only ever set during
// construction.
func (c *Config) rulesStore() *db.RuleStore {
	if c.storeManager == nil {
		return nil
	}
	return c.storeManager.Rules()
}

// hydrateRulesFromStore populates Config.Rules at startup, migrating legacy
// config.json rules into the database the first time it runs on an upgraded
// install. It must run before Migrate() so migration steps see the real rules.
func (c *Config) hydrateRulesFromStore() error {
	c.rulesHydrated = true

	// Consume the file's rules exactly once, here; the field must never
	// carry state past hydration (see its doc comment).
	legacy := c.LegacyRules
	c.LegacyRules = nil

	store := c.rulesStore()
	if store == nil {
		// No store (lightweight test configs): rules are memory-only, seeded
		// from whatever the JSON had.
		c.Rules = legacy
		return nil
	}

	stored, err := store.List()
	if err != nil {
		return fmt.Errorf("failed to load rules from store: %w", err)
	}

	if len(stored) > 0 {
		// Database is authoritative. A non-empty rules array in the file
		// (a hand edit, or a leftover mirror from a pre-removal version) is
		// not an input anymore; the next Save() nulls it. Divergent content
		// means rule changes were made outside this version's control —
		// those changes are NOT merged back; say so loudly instead of
		// discarding them in silence.
		if len(legacy) > 0 && !rulesEquivalent(legacy, stored) {
			logrus.Warnf("config.json rules differ from the database (%d in file, %d in database); the database wins and the file copy will be overwritten — rule changes made under an older version or by hand are not merged back", len(legacy), len(stored))
		}
		c.Rules = stored
		// Loaded rows are in sync by definition; seeding the snapshot lets
		// syncRulesToStore tell "unchanged" from "changed" even if the store
		// is closed before the first Save.
		if snapshot, err := json.Marshal(stored); err == nil {
			c.ruleSyncMu.Lock()
			c.lastSyncedRules = snapshot
			c.ruleSyncMu.Unlock()
```

</details>

**依据 5 · 源码核查**：[internal/config/rule_storage.go:125-151](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/config/rule_storage.go#L125-L151)

真实store关闭拒丢写。

<details>
<summary>查看原文（27行）</summary>

```text

	snapshot, err := json.Marshal(c.Rules)
	if err != nil {
		return fmt.Errorf("failed to snapshot rules: %w", err)
	}

	store := c.rulesStore()
	if store == nil {
		// A lightweight Config (no store manager) is memory-only by design.
		// A store that was closed under a real Config is different: the file
		// no longer mirrors rules, so a rule change here would be stored
		// nowhere. Fail the Save instead of reporting a lost write as success.
		if c.storeManager != nil && !bytes.Equal(snapshot, c.lastSyncedRules) {
			return fmt.Errorf("rule store is closed; rule changes cannot be persisted")
		}
		return nil
	}
	if bytes.Equal(snapshot, c.lastSyncedRules) {
		return nil
	}

	if err := store.SyncAll(c.Rules); err != nil {
		return fmt.Errorf("failed to sync rules to store: %w", err)
	}
	c.lastSyncedRules = snapshot
	return nil
}
```

</details>

**依据 6 · 源码核查**：[internal/config/apply_config_dsh.go:203-251](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/config/apply_config_dsh.go#L203-L251)

DSH settings备份/直写。

<details>
<summary>查看原文（49行）</summary>

```text
//
// MERGE semantics: only the `llm-pi-ai.providers.tingly-box` stanza is
// overwritten; everything else the user has in settings.yaml — other
// providers, unrelated top-level keys — is left alone. The previous file (if
// any) is backed up before rewrite.
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
		result.Message = fmt.Sprintf("Failed to write file: %v", err)
		return result, nil
	}

	result.Success = true
	if result.Created {
```

</details>

**依据 7 · 源码核查**：[internal/config/apply_config_dsh.go:313-355](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/config/apply_config_dsh.go#L313-L355)

credentials备份/直写与结果。

<details>
<summary>查看原文（43行）</summary>

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
		result.Message = fmt.Sprintf("Failed to write file: %v", err)
		return result, nil
	}

	result.Success = true
```

</details>

**依据 8 · 源码核查**：[internal/server/module/configapply/handler_dsh.go:83-109](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/server/module/configapply/handler_dsh.go#L83-L109)

两步apply和联合Success。

<details>
<summary>查看原文（27行）</summary>

```text

	settingsResult, err := config.ApplyDshSettings(dshBaseURL, models, prefs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ApplyDshConfigResponse{
			Success: false,
			Message: "Internal error: " + err.Error(),
		})
		return
	}
	credsResult, err := config.ApplyDshCredentials(apiKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ApplyDshConfigResponse{
			Success: false,
			Message: "Internal error: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, ApplyDshConfigResponse{
		Success:           settingsResult.Success && credsResult.Success,
		SettingsResult:    *settingsResult,
		CredentialsResult: *credsResult,
		Models:            models,
	})
}

// GetDshConfigPreview returns the YAML that ApplyDshConfigFromState would
```

</details>

**依据 9 · 源码核查**：[internal/server/model_request_handler.go:21-65](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/server/model_request_handler.go#L21-L65)

已有timeline/request/failover字段。

<details>
<summary>查看原文（45行）</summary>

```text
// regardless of which pipeline stage emitted it (HTTP envelope, protocol
// conversion / upstream client call, or smart-routing evaluation).
type ModelRequestEvent struct {
	Time    time.Time              `json:"time"`
	Source  string                 `json:"source"`
	Level   string                 `json:"level"`
	Stage   string                 `json:"stage,omitempty"`
	Message string                 `json:"message"`
	Fields  map[string]interface{} `json:"fields,omitempty"`
}

// ModelRequestSummary is the per-request row shown in the Requests view. It is
// derived by correlating every event that shares a request_id.
type ModelRequestSummary struct {
	RequestID    string    `json:"request_id"`
	Time         time.Time `json:"time"`
	Scenario     string    `json:"scenario,omitempty"`
	RequestModel string    `json:"request_model,omitempty"`
	RoutedModel  string    `json:"routed_model,omitempty"`
	Provider     string    `json:"provider,omitempty"`
	Method       string    `json:"method,omitempty"`
	Path         string    `json:"path,omitempty"`
	Status       int       `json:"status,omitempty"`
	LatencyMs    int64     `json:"latency_ms,omitempty"`
	HasError     bool      `json:"has_error"`
	MaxLevel     string    `json:"max_level,omitempty"`
	// TraceID links the request to its span tree in the in-memory trace
	// buffer (GET /api/v1/traces/{trace_id}); empty when the span was not
	// sampled or tracing is disabled.
	TraceID    string `json:"trace_id,omitempty"`
	EventCount int    `json:"event_count"`

	// Failover visibility: how many failover hops this request took and the
	// service path it walked ("prov-a/model-a → prov-b/model-b"). Zero/empty
	// when the first attempt served the request. Derived from the failover
	// loop's stage=failover_retry events, so the list view can answer "did
	// this request fail over, and to where" without opening the timeline.
	FailoverHops int    `json:"failover_hops,omitempty"`
	FailoverPath string `json:"failover_path,omitempty"`
}

// ModelRequestDetail is a summary plus the full, time-ordered event timeline.
type ModelRequestDetail struct {
	ModelRequestSummary
	Events []ModelRequestEvent `json:"events"`
```

</details>

**依据 10 · 源码核查**：[internal/db/usage_record.go:16-58](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/db/usage_record.go#L16-L58)

usage身份/status/token子集/trace。

<details>
<summary>查看原文（43行）</summary>

```text
type UsageRecord struct {
	ID           uint      `gorm:"primaryKey;autoIncrement;column:id"`
	ProviderUUID string    `gorm:"column:provider_uuid;index:idx_provider_model;not null"`
	ProviderName string    `gorm:"column:provider_name;not null"`
	Model        string    `gorm:"column:model;index:idx_provider_model;not null"`
	Scenario     string    `gorm:"column:scenario;index:idx_scenario;not null"`
	RuleUUID     string    `gorm:"column:rule_uuid;index:idx_rule"`
	UserID       string    `gorm:"column:user_id;index:idx_user;not null;default:''"`
	TeamID       string    `gorm:"column:team_id;index:idx_team;not null;default:''"`
	RequestModel string    `gorm:"column:request_model"`
	Timestamp    time.Time `gorm:"column:timestamp;index:idx_timestamp;index:idx_timestamp_scenario;not null"`
	InputTokens  int       `gorm:"column:input_tokens;not null"`
	OutputTokens int       `gorm:"column:output_tokens;not null"`
	TotalTokens  int       `gorm:"column:total_tokens;index;not null"`
	// CacheReadTokens counts cache-READ hits only. Cache writes are billed
	// separately (Anthropic cache_creation, OpenAI cache_write_tokens since
	// gpt-5.6) and are counted in CacheWriteTokens — which is a SUBSET of
	// InputTokens, not an addition to it.
	//
	// The physical column is still cache_input_tokens: renaming it would mean
	// an ALTER on three tables for no behavioral gain, so the legacy name is
	// pinned in the tag and the mismatch stops at this line. Raw SQL selects
	// alias it (`SUM(cache_input_tokens) as cache_read_tokens`) so Scan binds.
	CacheReadTokens  int `gorm:"column:cache_input_tokens;default:0"`
	CacheWriteTokens int `gorm:"column:cache_write_tokens;default:0"`
	// ReasoningTokens counts thinking/reasoning tokens (OpenAI reasoning
	// models, Anthropic extended thinking). A SUBSET of OutputTokens, not
	// an addition to it.
	ReasoningTokens int `gorm:"column:reasoning_tokens;default:0"`
	// System tokens (framework overhead, templates, etc.)
	SystemTokens int    `gorm:"column:system_tokens;default:0"`
	Status       string `gorm:"column:status;index;not null"` // success, error, partial
	ErrorCode    string `gorm:"column:error_code"`
	LatencyMs    int    `gorm:"column:latency_ms"`
	TTFTMs       int    `gorm:"column:ttft_ms;default:0"`
	Streamed     bool   `gorm:"column:streamed;type:integer"`
	// TraceID correlates this record with the OTel trace of the same request
	// so billing/audit rows can jump to the distributed trace and back.
	// Empty when tracing is disabled or the request span was not sampled.
	TraceID string `gorm:"column:trace_id;index:idx_trace_id"`
}

const (
```

</details>

**依据 11 · 源码核查**：[internal/routing/stage_smart_routing.go:58-88](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/stage_smart_routing.go#L58-L88)

请求head限80仍含内容。

<details>
<summary>查看原文（31行）</summary>

```text
// requestHeadLen is intentionally small — the per-op trace already records a
// window around the matched substring (or a small head for non-text ops), so
// the snapshot only needs to surface enough context to recognize *which*
// request a row corresponds to. We avoid storing the full message bodies.
const requestHeadLen = 80

func requestHead(s string) string {
	if len(s) <= requestHeadLen {
		return s
	}
	return s[:requestHeadLen] + "…"
}

// requestSnapshot captures key request fields used during smart routing
// evaluation so operators can correlate decisions with what the request
// actually looked like. Long message bodies are truncated to a short head;
// the per-op trace owns the matched-substring windowing so we don't duplicate
// large payloads in memory.
func requestSnapshot(reqCtx *smartrouting.RequestContext) map[string]interface{} {
	if reqCtx == nil {
		return nil
	}
	return map[string]interface{}{
		"model":            reqCtx.Model,
		"thinking_enabled": reqCtx.ThinkingEnabled,
		"latest_role":      reqCtx.LatestRole,
		"latest_type":      reqCtx.LatestContentType,
		"estimated_tokens": reqCtx.EstimatedTokens,
		"latest_user_head": requestHead(reqCtx.GetLatestUserMessage()),
		"system_msg_count": len(reqCtx.SystemMessages),
		"user_msg_count":   len(reqCtx.UserMessages),
```

</details>

**依据 12 · 源码核查**：[internal/routing/stage_smart_routing.go:94-141](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/stage_smart_routing.go#L94-L141)

trace记录上下文与logger。

<details>
<summary>查看原文（48行）</summary>

```text
// smart_routing memory sink (when a multiLogger is configured) so the
// frontend can render an inspectable history.
func (s *SmartRoutingStage) emitTrace(
	ctx *SelectionContext,
	reqCtx *smartrouting.RequestContext,
	trace []smartrouting.RuleEvalResult,
	matchedRuleIndex int,
	matchedServicesCount int,
	finalActiveCount int,
	selectedService *loadbalance.Service,
	outcome string,
	reason string,
) {
	matched := matchedRuleIndex >= 0
	fields := logrus.Fields{
		"rule_uuid":          ctx.Rule.UUID,
		"scenario":           string(ctx.Scenario),
		"request_model":      ctx.Rule.RequestModel,
		"matched":            matched,
		"matched_rule_index": matchedRuleIndex,
		"outcome":            outcome,
		"reason":             reason,
		"matched_services":   matchedServicesCount,
		"final_active_count": finalActiveCount,
		"trace":              trace,
		"request":            requestSnapshot(reqCtx),
		"rules_total":        len(ctx.Rule.SmartRouting),
	}
	if matched && matchedRuleIndex < len(trace) {
		fields["matched_rule_description"] = trace[matchedRuleIndex].Description
	}
	if selectedService != nil {
		fields["selected_provider"] = selectedService.Provider
		fields["selected_model"] = selectedService.Model
	}
	if ctx.GinContext != nil {
		fields["client_ip"] = ctx.GinContext.ClientIP()
		fields["request_id"] = ctx.GinContext.GetString(constant.CtxKeyRequestID)
	}

	if s.multiLogger != nil {
		s.multiLogger.GetLogrusLogger(pkgobs.LogSourceSmartRouting).
			WithFields(fields).
			Info(formatTraceMessage(matched, matchedRuleIndex, ctx.Rule.RequestModel, outcome))
	}
	logrus.WithFields(fields).Debugf("[smart_routing] %s", outcome)
}

```

</details>

**依据 13 · 源码核查**：[go.mod:1-18](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/go.mod#L1-L18)

源构建Go与replace依赖。

<details>
<summary>查看原文（18行）</summary>

```text
module github.com/tingly-dev/tingly-box

go 1.26.0

replace github.com/openai/openai-go/v3 => ./libs/openai-go

replace github.com/anthropics/anthropic-sdk-go => ./libs/anthropic-sdk-go

replace google.golang.org/genai => ./libs/go-genai

replace github.com/tingly-dev/tingly-box/imbot => ./imbot

replace github.com/tingly-dev/tingly-box/ai => ./ai

replace github.com/tingly-dev/tingly-box/agentboot => ./agentboot

replace github.com/tingly-dev/tingly-box/swagger => ./swagger

```

</details>

**依据 14 · 源码核查**：[README.md:367-386](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/README.md#L367-L386)

作者构建前提/子模块。

<details>
<summary>查看原文（20行）</summary>

````text

### Prerequisites

| Tool    | Version | Install                                                                                       |
| ------- | ------- | --------------------------------------------------------------------------------------------- |
| Go      | 1.26+   | https://go.dev/doc/install                                                                    |
| Node.js | 20+     | https://nodejs.org/                                                                           |
| pnpm    | latest  | `npm install -g pnpm`                                                                         |
| task    | latest  | `go install github.com/go-task/task/v3/cmd/task@latest` or https://taskfile.dev/installation/ |

> Tip: you can also copy individual shell commands out of `Taskfile.yml` and run them directly if you prefer not to install `task`.

### 1. Clone and init submodules

```bash
git clone https://github.com/tingly-dev/tingly-box.git
cd tingly-box
git submodule update --init --recursive
```

````

</details>

#### 缺口

- 全静态凭据保护、日志留存/脱敏、DB迁移恢复与DSH部分写实际故障未验证
  **影响**：只支持固定部分机制，不能给团队生产数据/自动配置安全背书
  **进一步探讨**：隔离DB/profile用假key测备份恢复/二写失败/外部编辑和日志内容，固定版本后再核真实OAuth与平台范围。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 全周期成本、采用和退出条件？

**研究主题**：采用判断、效果与总成本

#### 完整回答

可有限试用，适合能管本地网关/凭据/规则的个人或团队管理员；先localhost、独立管理/模型key、模拟上游或无价值单provider/客户端，完成文本/工具/stream错误小样，再考虑团队。仅一个稳定直连provider的用户可先用原直连，不为统一入口新增运维与凭据集中面。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 平台binary、本地配置+SQLite/可恢复副本 | 网关必需 | 路由/密钥/用量 | 只备JSON不保证还规则 |
| 管理token/模型token与scope规则 | 管理/调用各必需 | 权限与归属 | sharing/global角色不能混分发 |
| 上游API/OAuth与网络/协议兼容 | 对应真实调用必需 | 模型输出 | 虚拟/列表通过非真实业务通过 |
| 客户端配置与代表任务 | 采用必需 | endpoint迁移与验证 | 可退回原baseURL/key |
| Go1.26/local模块/前端链 | 源码构建才需 | 构建自身版本 | 未初始化不当发布binary坏 |
| DSH文件原件/目标目录核对 | apply才需 | 自动接入DSH | 双文件非事务，未知别写 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 隔离准备 | 管理员核localhost/token、备DB与配置 | 管理/模型边界清晰、备份能还 |
| 单provider小样 | 先模拟/无敏感请求接一客户端 | 文本/tool/stream/cancel与直连一致 |
| 失败与团队 | 多候选/双team键测错误/越scope | 不混流/跨scope，partial和费用未知可见 |
| 可选DSH apply | 先保settings/credentials并审预览 | 两文件Success/实际加载和代表任务 |
| 退出 | 客户端退原endpoint，停daemon/核在途 | 配置/DB/外部key/DSH改动另处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | binary/本地存储/provider未知 | key/scope/规则/客户端和备份 | 接线/构建耗时无独验 |
| 持续使用 | 请求/多attempt/token与日志DB未知 | 平台协议、OAuth和团队权限维护 | <1ms/净费用未测 |
| 失败恢复 | 重试/部分流/DB备份未知 | 查attempt/真实消费和双文件状态 | fallback成功非原尝试免费 |
| 升级退出 | 数据迁移/历史与撤key未知 | 固版本/还DB和客户端配置 | 卸载不撤已写DSH/远端动作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 少重复接线 | 统一模型入口/DSH apply | 真实客户端净工时 |
| 权限归属 | auth角色/team路由和usage字段 | 所有查询/企业/远程部署隔离 |
| 路由恢复 | 健康/分区/affinity与首chunk闸 | 全协议等价/首chunk后自动恢复 |
| 成本观察 | 请求timeline/usage子集/partial | 全厂商所有attempt实际扣费/硬上限 |

若身份/规则/协议不符、首chunk后异常却重放、scope不清或DSH部分写无法核恢复，停扩大流量/团队与自动配置，查真实attempt/产物和文件，再退回原endpoint或恢复副本；别用最终200/<1ms/模型数宣布生产就绪。

#### 证据与依据

**依据 1 · 源码核查**：[internal/command/options/server_options.go:43-53](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/command/options/server_options.go#L43-L53)

localhost起步。

<details>
<summary>查看原文（11行）</summary>

```text
// AddStartFlags adds all start-related flags to a command
// This is shared between start, restart, gui, and slim commands
func AddStartFlags(cmd *cobra.Command, flags *StartFlags) {
	cmd.Flags().IntVarP(&flags.Port, "port", "p", 0, "Server port (default: from config or 12580)")
	cmd.Flags().StringVar(&flags.Host, "host", "localhost", "Server host")
	cmd.Flags().BoolVarP(&flags.EnableUI, "ui", "u", true, "Enable web UI (default: true)")
	cmd.Flags().BoolVar(&flags.EnableDebug, "debug", false, "Enable debug mode including gin, low level logging and so on (default: false)")
	cmd.Flags().BoolVar(&flags.EnableOpenBrowser, "browser", true, "Auto-open browser when server starts (default: true)")
	cmd.Flags().BoolVar(&flags.EnableStyleTransform, "adapter", true, "Enable API style transformation (default: true)")
	cmd.Flags().BoolVar(&flags.Daemon, "daemon", false, "Run as daemon in background (default: false)")
	cmd.Flags().StringVar(&flags.LogFile, "log-file", "", "Log file path for daemon mode (default: ~/.tingly-box/tingly-box.log)")
```

</details>

**依据 2 · 源码核查**：[internal/protocolserver/routes.go:24-45](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/routes.go#L24-L45)

角色边界。

<details>
<summary>查看原文（22行）</summary>

```text
// debugHeaderGuard strips the debug/probe routing headers above from any
// request that did not authenticate with the global model token, so a
// sharing-key holder can neither read back routing/provider internals nor
// pin service selection. Must run after modelAuth, which sets
// constant.CtxKeyAuthKind.
func (ph *ProtocolHandler) debugHeaderGuard(c *gin.Context) {
	if c.GetString(constant.CtxKeyAuthKind) != constant.AuthKindGlobalModelToken {
		for _, h := range debugRoutingHeaders {
			c.Request.Header.Del(h)
		}
	}
	c.Next()
}

// modelAuthChain builds the standard per-route handler prefix: modelAuth
// itself, then debugHeaderGuard (which depends on modelAuth having already
// set the auth-kind context key), then any route-specific middleware.
func (ph *ProtocolHandler) modelAuthChain(modelAuth gin.HandlerFunc, extra ...gin.HandlerFunc) []gin.HandlerFunc {
	chain := make([]gin.HandlerFunc, 0, 2+len(extra))
	chain = append(chain, modelAuth, ph.debugHeaderGuard)
	chain = append(chain, extra...)
	return chain
```

</details>

**依据 3 · 源码核查**：[internal/protocolserver/failover_dispatch.go:365-445](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/failover_dispatch.go#L365-L445)

attempt/commit限制。

<details>
<summary>查看原文（81行）</summary>

```text
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

	tried := map[string]bool{}
	provider := initialProvider
	model := initialModel

	// Keep the recorder's bound service in sync per attempt so the
	// breaker store gets fed the right serviceID on failure.
	rec, _ := recording.GetRecorderFromContext(c)

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
		if succeeded {
			c.Set(constant.CtxKeyRecoveredErrorCount, errorsBeforeAttempt)
		}

		// Once bytes reach the wire, retry is impossible, even if streaming fails.
		status, committed := gate.Status(), gate.Committed()
		if committed {
			loadbalance.RecordServiceSuccess(rule.UUID, serviceID)
		}
		if committed || !isRetryableStatus(status) {
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
```

</details>

**依据 4 · 源码核查**：[internal/config/rule_storage.go:14-80](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/config/rule_storage.go#L14-L80)

备份DB必要。

<details>
<summary>查看原文（67行）</summary>

```text
// Rule storage: rules live in SQLite (db.RuleStore) with Config.Rules as the
// in-memory working set. See .design/rule-storage.md for the full rationale.
//
// Lifecycle:
//   - database has rules  -> database is authoritative; file rules ignored
//   - database empty, JSON has rules -> one-time import into the database
//   - both empty -> nothing to do (fresh install; built-ins arrive via AddRule)
//
// The JSON copy is read only for the one-time import; Save() writes the
// file's "rules" key as null (the former downgrade-compat mirror is gone).
// See .design/rule-storage.md §5.

// rulesStore resolves the rule store at call time from the StoreManager, so
// store liveness has a single owner: after StoreManager.Close() the accessor
// returns nil and rule syncing degrades to a no-op instead of failing on a
// closed connection. Reads the field directly (not via c.StoreManager()) —
// callers may already hold c.mu, and the field is only ever set during
// construction.
func (c *Config) rulesStore() *db.RuleStore {
	if c.storeManager == nil {
		return nil
	}
	return c.storeManager.Rules()
}

// hydrateRulesFromStore populates Config.Rules at startup, migrating legacy
// config.json rules into the database the first time it runs on an upgraded
// install. It must run before Migrate() so migration steps see the real rules.
func (c *Config) hydrateRulesFromStore() error {
	c.rulesHydrated = true

	// Consume the file's rules exactly once, here; the field must never
	// carry state past hydration (see its doc comment).
	legacy := c.LegacyRules
	c.LegacyRules = nil

	store := c.rulesStore()
	if store == nil {
		// No store (lightweight test configs): rules are memory-only, seeded
		// from whatever the JSON had.
		c.Rules = legacy
		return nil
	}

	stored, err := store.List()
	if err != nil {
		return fmt.Errorf("failed to load rules from store: %w", err)
	}

	if len(stored) > 0 {
		// Database is authoritative. A non-empty rules array in the file
		// (a hand edit, or a leftover mirror from a pre-removal version) is
		// not an input anymore; the next Save() nulls it. Divergent content
		// means rule changes were made outside this version's control —
		// those changes are NOT merged back; say so loudly instead of
		// discarding them in silence.
		if len(legacy) > 0 && !rulesEquivalent(legacy, stored) {
			logrus.Warnf("config.json rules differ from the database (%d in file, %d in database); the database wins and the file copy will be overwritten — rule changes made under an older version or by hand are not merged back", len(legacy), len(stored))
		}
		c.Rules = stored
		// Loaded rows are in sync by definition; seeding the snapshot lets
		// syncRulesToStore tell "unchanged" from "changed" even if the store
		// is closed before the first Save.
		if snapshot, err := json.Marshal(stored); err == nil {
			c.ruleSyncMu.Lock()
			c.lastSyncedRules = snapshot
			c.ruleSyncMu.Unlock()
```

</details>

**依据 5 · 源码核查**：[internal/server/module/configapply/handler_dsh.go:83-109](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/server/module/configapply/handler_dsh.go#L83-L109)

DSH双文件结果。

<details>
<summary>查看原文（27行）</summary>

```text

	settingsResult, err := config.ApplyDshSettings(dshBaseURL, models, prefs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ApplyDshConfigResponse{
			Success: false,
			Message: "Internal error: " + err.Error(),
		})
		return
	}
	credsResult, err := config.ApplyDshCredentials(apiKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ApplyDshConfigResponse{
			Success: false,
			Message: "Internal error: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, ApplyDshConfigResponse{
		Success:           settingsResult.Success && credsResult.Success,
		SettingsResult:    *settingsResult,
		CredentialsResult: *credsResult,
		Models:            models,
	})
}

// GetDshConfigPreview returns the YAML that ApplyDshConfigFromState would
```

</details>

#### 缺口

- 真实总费/延迟/客户端任务合格率和团队运维负担无对照
  **影响**：仅隔离渐进试用，不依据广告直接生产换路
  **进一步探讨**：同请求对直连/网关模拟再真实小样，比tool/stream错误、请求数/可见用量、人工恢复与延迟。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 身份、选路和重试结果收据的可证伪方向？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是面向管理员的“策略承诺核对包”：把一次请求当时规则/转换配置版本、调用scope与所有attempt路径和首chunk/终态、usage是否完整关联，核对管理员预期允许provider/协议/费用观察边界，明确哪些结果只是缓存quota/最后attempt而非全部消费。

已有request_id timeline、failover hops/path、attempt spans、rule/provider/user/team与partial usage，不能再以“没有trace/没有归属”兜售新产品。新增须在既有记录上可验证政策快照和端到端客户端语义/消费缺口，而不是重复仪表盘；不会把quota路由改名成财务硬限额，也不能自己证明厂商账单。

最小对照同请求集合在两规则版本/双team、401→异构fallback、首chunk后失败、quota缺失及配置变更时，比现timeline与核对包的错scope/错provider/协议字段丢失检出、无法确定消费比例、定位/恢复工时和记录负担。若现trace已足够定位、加包未降低误判或引入敏感内容/运维成本，否定独立插件方向，优先补具体转换/备份问题。未实现/验证，不计当前能力/采用优势。

#### 证据与依据

**依据 1 · 源码核查**：[internal/server/model_request_handler.go:21-65](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/server/model_request_handler.go#L21-L65)

已有request/failover timeline。

<details>
<summary>查看原文（45行）</summary>

```text
// regardless of which pipeline stage emitted it (HTTP envelope, protocol
// conversion / upstream client call, or smart-routing evaluation).
type ModelRequestEvent struct {
	Time    time.Time              `json:"time"`
	Source  string                 `json:"source"`
	Level   string                 `json:"level"`
	Stage   string                 `json:"stage,omitempty"`
	Message string                 `json:"message"`
	Fields  map[string]interface{} `json:"fields,omitempty"`
}

// ModelRequestSummary is the per-request row shown in the Requests view. It is
// derived by correlating every event that shares a request_id.
type ModelRequestSummary struct {
	RequestID    string    `json:"request_id"`
	Time         time.Time `json:"time"`
	Scenario     string    `json:"scenario,omitempty"`
	RequestModel string    `json:"request_model,omitempty"`
	RoutedModel  string    `json:"routed_model,omitempty"`
	Provider     string    `json:"provider,omitempty"`
	Method       string    `json:"method,omitempty"`
	Path         string    `json:"path,omitempty"`
	Status       int       `json:"status,omitempty"`
	LatencyMs    int64     `json:"latency_ms,omitempty"`
	HasError     bool      `json:"has_error"`
	MaxLevel     string    `json:"max_level,omitempty"`
	// TraceID links the request to its span tree in the in-memory trace
	// buffer (GET /api/v1/traces/{trace_id}); empty when the span was not
	// sampled or tracing is disabled.
	TraceID    string `json:"trace_id,omitempty"`
	EventCount int    `json:"event_count"`

	// Failover visibility: how many failover hops this request took and the
	// service path it walked ("prov-a/model-a → prov-b/model-b"). Zero/empty
	// when the first attempt served the request. Derived from the failover
	// loop's stage=failover_retry events, so the list view can answer "did
	// this request fail over, and to where" without opening the timeline.
	FailoverHops int    `json:"failover_hops,omitempty"`
	FailoverPath string `json:"failover_path,omitempty"`
}

// ModelRequestDetail is a summary plus the full, time-ordered event timeline.
type ModelRequestDetail struct {
	ModelRequestSummary
	Events []ModelRequestEvent `json:"events"`
```

</details>

**依据 2 · 源码核查**：[internal/db/usage_record.go:16-58](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/db/usage_record.go#L16-L58)

已有归属/partial与token口径。

<details>
<summary>查看原文（43行）</summary>

```text
type UsageRecord struct {
	ID           uint      `gorm:"primaryKey;autoIncrement;column:id"`
	ProviderUUID string    `gorm:"column:provider_uuid;index:idx_provider_model;not null"`
	ProviderName string    `gorm:"column:provider_name;not null"`
	Model        string    `gorm:"column:model;index:idx_provider_model;not null"`
	Scenario     string    `gorm:"column:scenario;index:idx_scenario;not null"`
	RuleUUID     string    `gorm:"column:rule_uuid;index:idx_rule"`
	UserID       string    `gorm:"column:user_id;index:idx_user;not null;default:''"`
	TeamID       string    `gorm:"column:team_id;index:idx_team;not null;default:''"`
	RequestModel string    `gorm:"column:request_model"`
	Timestamp    time.Time `gorm:"column:timestamp;index:idx_timestamp;index:idx_timestamp_scenario;not null"`
	InputTokens  int       `gorm:"column:input_tokens;not null"`
	OutputTokens int       `gorm:"column:output_tokens;not null"`
	TotalTokens  int       `gorm:"column:total_tokens;index;not null"`
	// CacheReadTokens counts cache-READ hits only. Cache writes are billed
	// separately (Anthropic cache_creation, OpenAI cache_write_tokens since
	// gpt-5.6) and are counted in CacheWriteTokens — which is a SUBSET of
	// InputTokens, not an addition to it.
	//
	// The physical column is still cache_input_tokens: renaming it would mean
	// an ALTER on three tables for no behavioral gain, so the legacy name is
	// pinned in the tag and the mismatch stops at this line. Raw SQL selects
	// alias it (`SUM(cache_input_tokens) as cache_read_tokens`) so Scan binds.
	CacheReadTokens  int `gorm:"column:cache_input_tokens;default:0"`
	CacheWriteTokens int `gorm:"column:cache_write_tokens;default:0"`
	// ReasoningTokens counts thinking/reasoning tokens (OpenAI reasoning
	// models, Anthropic extended thinking). A SUBSET of OutputTokens, not
	// an addition to it.
	ReasoningTokens int `gorm:"column:reasoning_tokens;default:0"`
	// System tokens (framework overhead, templates, etc.)
	SystemTokens int    `gorm:"column:system_tokens;default:0"`
	Status       string `gorm:"column:status;index;not null"` // success, error, partial
	ErrorCode    string `gorm:"column:error_code"`
	LatencyMs    int    `gorm:"column:latency_ms"`
	TTFTMs       int    `gorm:"column:ttft_ms;default:0"`
	Streamed     bool   `gorm:"column:streamed;type:integer"`
	// TraceID correlates this record with the OTel trace of the same request
	// so billing/audit rows can jump to the distributed trace and back.
	// Empty when tracing is disabled or the request span was not sampled.
	TraceID string `gorm:"column:trace_id;index:idx_trace_id"`
}

const (
```

</details>

**依据 3 · 源码核查**：[internal/protocolserver/failover_dispatch.go:391-445](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/protocolserver/failover_dispatch.go#L391-L445)

attempt跟踪/最终上下文与首chunk。

<details>
<summary>查看原文（55行）</summary>

```text

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
		if succeeded {
			c.Set(constant.CtxKeyRecoveredErrorCount, errorsBeforeAttempt)
		}

		// Once bytes reach the wire, retry is impossible, even if streaming fails.
		status, committed := gate.Status(), gate.Committed()
		if committed {
			loadbalance.RecordServiceSuccess(rule.UUID, serviceID)
		}
		if committed || !isRetryableStatus(status) {
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
```

</details>

**依据 4 · 源码核查**：[internal/routing/stage_smart_routing.go:94-141](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/stage_smart_routing.go#L94-L141)

已有规则trace与内容片段。

<details>
<summary>查看原文（48行）</summary>

```text
// smart_routing memory sink (when a multiLogger is configured) so the
// frontend can render an inspectable history.
func (s *SmartRoutingStage) emitTrace(
	ctx *SelectionContext,
	reqCtx *smartrouting.RequestContext,
	trace []smartrouting.RuleEvalResult,
	matchedRuleIndex int,
	matchedServicesCount int,
	finalActiveCount int,
	selectedService *loadbalance.Service,
	outcome string,
	reason string,
) {
	matched := matchedRuleIndex >= 0
	fields := logrus.Fields{
		"rule_uuid":          ctx.Rule.UUID,
		"scenario":           string(ctx.Scenario),
		"request_model":      ctx.Rule.RequestModel,
		"matched":            matched,
		"matched_rule_index": matchedRuleIndex,
		"outcome":            outcome,
		"reason":             reason,
		"matched_services":   matchedServicesCount,
		"final_active_count": finalActiveCount,
		"trace":              trace,
		"request":            requestSnapshot(reqCtx),
		"rules_total":        len(ctx.Rule.SmartRouting),
	}
	if matched && matchedRuleIndex < len(trace) {
		fields["matched_rule_description"] = trace[matchedRuleIndex].Description
	}
	if selectedService != nil {
		fields["selected_provider"] = selectedService.Provider
		fields["selected_model"] = selectedService.Model
	}
	if ctx.GinContext != nil {
		fields["client_ip"] = ctx.GinContext.ClientIP()
		fields["request_id"] = ctx.GinContext.GetString(constant.CtxKeyRequestID)
	}

	if s.multiLogger != nil {
		s.multiLogger.GetLogrusLogger(pkgobs.LogSourceSmartRouting).
			WithFields(fields).
			Info(formatTraceMessage(matched, matchedRuleIndex, ctx.Rule.RequestModel, outcome))
	}
	logrus.WithFields(fields).Debugf("[smart_routing] %s", outcome)
}

```

</details>

**依据 5 · 源码核查**：[internal/routing/stage_smart_routing.go:380-412](https://github.com/tingly-dev/tingly-box/blob/d91c4cac65e28e6969c4b2516933732a15da643a/internal/routing/stage_smart_routing.go#L380-L412)

quota未知样本边界。

<details>
<summary>查看原文（33行）</summary>

```text
func (s *SmartRoutingStage) collectAllQuotaInfo(ctx context.Context, rules []smartrouting.SmartRouting) []smartrouting.ServiceQuotaInfo {
	if s.quotaProvider == nil || !hasServiceQuotaOp(rules) {
		return nil
	}
	seen := make(map[string]struct{})
	pctByProvider := make(map[string]*float64) // nil value = provider quota unknown
	var result []smartrouting.ServiceQuotaInfo
	for _, r := range rules {
		for _, svc := range r.Services {
			id := svc.ServiceID()
			if _, ok := seen[id]; ok {
				continue
			}
			seen[id] = struct{}{}

			if svc.Provider == "" {
				continue
			}
			pctPtr, looked := pctByProvider[svc.Provider]
			if !looked {
				if usage, err := s.quotaProvider.GetQuota(ctx, svc.Provider); err == nil && usage != nil {
					if pct, ok := usage.Pct(quota.WindowKindLimit); ok {
						pctPtr = &pct
					}
				}
				pctByProvider[svc.Provider] = pctPtr
			}
			if pctPtr == nil {
				continue
			}
			result = append(result, smartrouting.ServiceQuotaInfo{
				ServiceID: id,
				Pct:       *pctPtr,
```

</details>

#### 缺口

- 政策版本核对包未实现，实际管理员缺口/收益未知
  **影响**：不能假定独立产品需求，隐私成本需与收益同测
  **进一步探讨**：上述可丢弃矩阵盲比检出/定位/负担，现功能充分就不做新插件。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
