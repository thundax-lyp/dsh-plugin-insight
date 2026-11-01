# EchoBird

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[4c34a43](https://github.com/edison7009/EchoBird/tree/4c34a4341de692e2e71667f8cdc61b9cec320671)

<!-- BEGIN META -->
[![GitHub ★ 3,472](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C472&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/edison7009/EchoBird)
<!-- END META -->

> **功能**：桌面 AI 工具管理应用，提供模型配置、账号管理和本地多候选路由。

> **亮点**：[Q02](#research-q02) 将模型候选、健康与本地协议入口组织起来；账号切换和模型路由不同，也不是按任务质量选模型。

> **主要限制**：[Q03](#research-q03) Responses 续接绑定原供应方，配置变更或过期需完整输入；[Q04](#research-q04) 切换可能产生不同数据流和费用。

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
  - [Q01 · 谁使用桌面工具，账号切换与 API 路由如何区分？](#detail-section-11)
  - [Q02 · 本地 API 怎样选择模型及处理故障？](#detail-section-12)
  - [Q03 · Responses 续接能否无损跨供应方迁移？](#detail-section-13)
  - [Q04 · 首次、持续及退出代价是什么？](#detail-section-14)
  - [Q05 · 说明与源码有何差异，怎样试用？](#detail-section-15)
  - [Q06 · 能否验证切换后的质量和工具调用等价？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向配置多个模型供应方、需要统一客户端入口和故障回退的桌面用户。

各客户端分别配置模型和 endpoint 已能完成调用；统一路由降低切换操作，但增加常驻服务和协议差异。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型候选 | 统一客户端入口 | 按健康与配置选择，非质量最优 |
| 故障处理 | 有界重试和冷却 | 不保证输出等价 |
| Responses 续接 | 关联原候选 | 配置变化或过期需完整输入 |
| 账号管理 | 在工具启动时选择账号 | 与 API 路由分开，可能影响共享配置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 桌面应用及兼容客户端 | 必需 | 本地协议入口 | 恢复直连 |
| 可用供应方或本地模型 | 必需 | 实际模型响应 | 无可用候选 |
| 路由器凭据 | 对受保护请求 | 校验访问 | 请求拒绝 |
| 允许的数据范围与备份 | 试用必需 | 控制多供应方和退出 | 暂停切换 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份原配置并确定可信候选 | 可恢复直连 |
| 配置 | 用户设置模型顺序和本地 endpoint | 核查协议与凭据 |
| 调用 | 客户端提交受控请求 | 核对响应、尝试和费用 |
| 失败 | 用户检查状态和外部作用 | 续接不明时使用完整输入或停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 桌面资源及模型账户 | 备份与配置 | 发行包未测 |
| 持续 | 多 provider 与重试可能计费 | 维护额度和能力 | 净费用未知 |
| 失败 | 重试与在途资源 | 检查结果和副作用 | 模型语义不等价 |
| 退出 | 原供应方费用 | 停监听并恢复直连 | 在途响应可继续 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 路由 | 有界候选和健康筛选 | 真实可用率和净费用 |
| 续接 | 绑定原模型配置 | 跨 provider 无损状态 |
| 协议 | 源码含 Responses 入口 | 发行版和全部协议兼容 |

> **思考**：[Q03](#research-q03) Responses 续接绑定原供应方，配置变更或过期需完整输入；[Q04](#research-q04) 切换可能产生不同数据流和费用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将模型候选、健康与本地协议入口组织起来；账号切换和模型路由不同，也不是按任务质量选模型。

[Q02](#research-q02) 使用候选筛选、冷却及有界尝试；[Q03](#research-q03) 续接绑定 fingerprint，不是状态迁移。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) Responses 续接绑定原供应方，配置变更或过期需完整输入；[Q04](#research-q04) 切换可能产生不同数据流和费用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 在独立配置使用受控任务比较直连，数据或续接边界不清时回退。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定源码代表性 Smart Router 路径；未运行桌面应用、发行包或供应方。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、src-tauri/src/services/smart_router/server.rs、src-tauri/src/services/smart_router/runtime.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态核查根桌面应用及代表性 Smart Router Responses 路径，未深入全部账号、安装、音频或 provider 适配，也未运行目标程序。inventory JS/TS 统计不代表 Rust 服务总规模。
- 下一步：隔离配置以受控 provider 对照直连，测试限流、连接失败、已输出中断、绑定过期和退出在途请求。

**分析版本**

- **仓库**：[edison7009/EchoBird](https://github.com/edison7009/EchoBird)
- **版本号**：6.1.3（[固定提交 4c34a43](https://github.com/edison7009/EchoBird/tree/4c34a4341de692e2e71667f8cdc61b9cec320671)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出用脱敏固定题集在启用前比较候选输出和工具调用，需衡量误拒、费用和任务覆盖。

隔离配置以受控 provider 对照直连，测试限流、连接失败、已输出中断、绑定过期和退出在途请求。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 3539 | — | — | 31565 |
| .js | source | 9 | 1558 | 1531 | 24 | — |
| .mjs | test | 2 | 176 | 165 | 12 | — |
| .ts | test | 49 | 5360 | 5034 | 48 | — |
| .ts | source | 156 | 17161 | 15880 | 638 | — |
| .tsx | source | 114 | 30905 | 28525 | 1488 | — |
| .tsx | test | 116 | 47938 | 46261 | 265 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/edison7009/EchoBird/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查桌面 Smart Router API、候选切换和有状态续接边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用桌面工具，账号切换与 API 路由如何区分？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

EchoBird 是桌面 AI 工具管理应用，面向需要配置多个供应方和本地模型、启动工具及处理连接故障的用户。原办法是分别在客户端维护账号、模型和 endpoint；Smart Router 将配置的模型候选放在本地 API 背后，主要增量是统一入口与健康状态路由，并非底层模型或协议原创。账号切换与模型 API 自动回退是不同功能；作者说明 ChatGPT 和 Codex CLI 共用本地账号配置，切换会影响共享登录。页面其他安装及账号功能本轮未深入验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-7](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/package.json#L1-L7)

桌面应用包身份。

```text
{
  "name": "echobird",
  "version": "6.1.3",
  "description": "AI Model & Skill Management Desktop Application",
  "author": "Echo Bird Team",
  "license": "MIT",
  "type": "module",
```

**依据 2 · 作者声明**：[README.md:90-100](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/README.md#L90-L100)

作者列出安装管理与 Model Nexus。

<details>
<summary>查看原文（11行）</summary>

```text

- **Install & Repair Agent** — let an AI install and fix mainstream tools (Claude Code, OpenClaw, Hermes Agent, …); works locally and remotely
- **One-click local LLM** — bundled vLLM / SGLang / llama.cpp runtimes; pick a quant, hit START
- **Plugin Hub (Developer Preview)** — install reviewed community plugins or add extensions from a repository or local directory
- **App Manager** — one-click launch and management for every AI / Agent app & game

### Shared foundation

- **Model Nexus** — a unified data hub for OpenAI / Anthropic / local LLMs / API Routers; configure once and all 4 scenarios pick it up; one-click latency check before you commit

**Cross-platform** — Windows, macOS, Linux (x64 + arm64)
```

</details>

**依据 3 · 作者声明**：[README.md:102-108](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/README.md#L102-L108)

作者说明账号和共享登录。

```text
## Multi-account switching — ChatGPT, Codex CLI, and Claude Code

Manage multiple saved accounts in EchoBird's **App Manager**, view their usage quota, and choose the account to use when launching a tool.

- **ChatGPT desktop and Codex CLI** — add OpenAI accounts through browser sign-in, then select a saved account and launch. Both tools share the local Codex account configuration, so switching affects the shared login.
- **Claude Code** — add accounts through browser authorization, select an account, and launch Claude Code with it. View the plan, remaining 5-hour and 7-day quota, and reset countdowns when available.
- **Quota at a glance** — check remaining quota and reset times, refresh account usage, and remove saved accounts from the same panel.
```

**依据 4 · 作者声明**：[README.md:112-120](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/README.md#L112-L120)

作者说明候选优先级和路由。

```text
## Multi-model smart routing — priority and automatic failover

EchoBird's **Smart Router** puts multiple model providers behind one local API. Add free, paid, or private models from Model Nexus, then drag the cards into your preferred order. The router tries models in that order and automatically falls back when a model is rate-limited, out of quota, or temporarily unavailable. After cooldown, it retries models in priority order.

- **Up to 20 models** — reuse your configured models without entering their API keys again.
- **One endpoint for compatible tools** — supports OpenAI Chat Completions and Anthropic Messages, including clients such as Claude Code.
- **Explicit priority** — you control the order; routing follows that order rather than selecting models by task or price.

**Get started:** open Smart Router → add models from My Models or the free-model directory → drag to set priority → choose **Auto Router** for a compatible tool in App Manager. Keep EchoBird running while tools use its local API.
```

#### 缺口

- 未运行桌面端与真实客户端
  **影响**：无法证明账号切换、安装和目标系统兼容
  **进一步探讨**：备份现有配置后在隔离用户资料中对照直接连接。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地 API 怎样选择模型及处理故障？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

源码注册 /v1/chat/completions、/v1/responses、/v1/messages 等端点，Responses handler 在读取请求配置并验证路由器 API key 后解析候选。路由按照候选及 standby/健康状态组织可用列表，排除冷却候选，受最大尝试次数及时间预算限制；上游错误被分类，并可结合 retry-after 更新状态。作者将操作方式描述为用户配置优先级而非按任务质量或价格选最优模型；不能因此保证备用模型输出等价、每次请求节费或所有错误都会重试。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:657-674](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L657-L674)

注册本地协议路由。

<details>
<summary>查看原文（18行）</summary>

```text
pub(super) fn start(
    listener: std::net::TcpListener,
) -> Result<super::runtime::ServerControl, String> {
    let state = AppState::new()?;
    let shutdown = state.shutdown.clone();
    let app = Router::new()
        .route("/health", get(handle_health))
        .route("/v1/models", get(handle_models))
        .route("/models", get(handle_models))
        .route("/v1/chat/completions", post(handle_chat))
        .route("/chat/completions", post(handle_chat))
        .route("/v1/responses", post(handle_responses))
        .route("/responses", post(handle_responses))
        .route("/v1/messages", post(handle_messages))
        .route("/messages", post(handle_messages))
        .route("/v1/audio/transcriptions", post(voice::handle))
        .route("/audio/transcriptions", post(voice::handle))
        .layer(DefaultBodyLimit::max(MAX_REQUEST_BODY_BYTES))
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:936-973](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L936-L973)

Responses 路径验证 key、解析候选并进入路由。

<details>
<summary>查看原文（38行）</summary>

```text
async fn handle_responses(
    State(mut state): State<AppState>,
    headers: HeaderMap,
    body: Result<Json<Value>, JsonRejection>,
) -> Response {
    let body = match body {
        Ok(Json(body)) => body,
        Err(error) if error.status() == StatusCode::PAYLOAD_TOO_LARGE => {
            return openai_error(error.status(), &error.body_text())
        }
        Err(error) => return error.into_response(),
    };
    state.request_epoch = Some(state.standby.epoch());
    let request_config = match config_for_request(&state) {
        Ok(config) => config,
        Err(error) => return openai_error(StatusCode::INTERNAL_SERVER_ERROR, &error),
    };
    if !is_authorized(&headers, &request_config.api_key) {
        return openai_error(StatusCode::UNAUTHORIZED, "Invalid EchoBird router API key");
    }
    state.model_id = request_config.model_id;
    let candidates = match select_candidates(
        &mut state,
        body["model"].as_str().unwrap_or_default(),
        resolve_candidates(request_config.candidate_ids),
        false,
    ) {
        Ok(candidates) => candidates,
        Err(error) => return openai_error(StatusCode::NOT_FOUND, &error),
    };
    protected_route(
        &state,
        &headers,
        body,
        candidates,
        ClientProtocol::Responses,
    )
    .await
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:907-933](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L907-L933)

选择路由模型或指定候选。

<details>
<summary>查看原文（27行）</summary>

```text
fn select_candidates(
    state: &mut AppState,
    requested: &str,
    candidates: Vec<Candidate>,
    anthropic_alias: bool,
) -> Result<Vec<Candidate>, String> {
    let requested = requested
        .strip_suffix("[1m]")
        .or_else(|| requested.strip_suffix("[1M]"))
        .unwrap_or(requested);
    if requested.starts_with(super::catalog::SELECTOR_PREFIX) {
        let selected: Vec<_> = candidates
            .into_iter()
            .filter(|candidate| super::catalog::selector(&candidate.internal_id) == requested)
            .collect();
        if selected.is_empty() {
            return Err(
                "Selected router model is unavailable. Refresh the client model list.".into(),
            );
        }
        state.model_id = requested.into();
        Ok(selected)
    } else if state.supports_model(requested) || anthropic_alias {
        Ok(candidates)
    } else {
        Err(format!("Unknown router model: {requested}"))
    }
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:1546-1563](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L1546-L1563)

standby/健康排序和无可用模型。

<details>
<summary>查看原文（18行）</summary>

```text
    let configured_candidates = candidates.clone();
    let standby_epoch = state
        .standby
        .order_for_request(&mut candidates, state.request_epoch)
        .filter(|_| !bound_continuation);
    let mut available = prioritized_candidates(state, candidates);
    if bound_continuation {
        available.retain(|candidate| {
            bound_candidates
                .iter()
                .any(|bound| bound.internal_id == candidate.internal_id)
        });
    }
    if available.is_empty() {
        return openai_error(
            StatusCode::SERVICE_UNAVAILABLE,
            "All Auto Router models are cooling down",
        );
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:1565-1588](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L1565-L1588)

有界尝试和时间预算。

<details>
<summary>查看原文（24行）</summary>

```text

    let stream_requested = body.get("stream").and_then(Value::as_bool).unwrap_or(false);
    let mut attempts = Vec::new();
    let mut incompatible_response = None;
    let routing_started = Instant::now();

    let mut available = available.into_iter();
    let mut authentication_retry: Option<(Candidate, Option<Value>)> = None;
    while let Some((mut candidate, refreshed_credentials)) = authentication_retry
        .take()
        .or_else(|| available.next().map(|candidate| (candidate, None)))
    {
        let authentication_retried = refreshed_credentials.is_some();
        if (authentication_retried && candidate_is_cooling_down(state, &candidate))
            || (!authentication_retried && !try_begin_attempt(state, &mut candidate))
        {
            continue;
        }
        if attempts.len() >= policy.max_attempts {
            break;
        }
        let Some(header_timeout) = remaining_timeout(
            routing_started,
            policy.time_budget,
```

</details>

**依据 6 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:3282-3321](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L3282-L3321)

错误分类与 retry-after 处理。

<details>
<summary>查看原文（40行）</summary>

```text
fn mark_upstream_failure(
    state: &AppState,
    candidate: &Candidate,
    status: StatusCode,
    body: &[u8],
    retry_after: Option<Duration>,
    model_scope: bool,
) -> Option<FailureClass> {
    let failure = classify_failure(status, body);
    let Some(failure) = failure else {
        if let Some(statistics) = &state.request_statistics {
            statistics.outcome(&candidate.internal_id, Some(5));
        }
        return None;
    };
    let reset_at_ms = if model_scope
        && candidate.account_source.as_ref().is_some_and(|source| {
            crate::services::plugin_accounts::application(source.provider).is_some()
        }) {
        serde_json::from_slice::<Value>(body)
            .ok()
            .and_then(|value| {
                value["error"]["retry_after"]
                    .as_str()
                    .and_then(|value| value.parse::<u64>().ok())
            })
            .filter(|seconds| *seconds <= 7 * 24 * 60 * 60)
            .map(|seconds| now_ms().saturating_add(seconds.saturating_mul(1000)))
    } else {
        None
    };
    mark_failure_until(
        state,
        candidate,
        failure,
        retry_after,
        model_scope,
        reset_at_ms,
    );
    Some(failure)
```

</details>

**依据 7 · 作者声明**：[README.md:112-118](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/README.md#L112-L118)

作者描述按用户优先级而非任务或价格选择。

```text
## Multi-model smart routing — priority and automatic failover

EchoBird's **Smart Router** puts multiple model providers behind one local API. Add free, paid, or private models from Model Nexus, then drag the cards into your preferred order. The router tries models in that order and automatically falls back when a model is rate-limited, out of quota, or temporarily unavailable. After cooldown, it retries models in priority order.

- **Up to 20 models** — reuse your configured models without entering their API keys again.
- **One endpoint for compatible tools** — supports OpenAI Chat Completions and Anthropic Messages, including clients such as Claude Code.
- **Explicit priority** — you control the order; routing follows that order rather than selecting models by task or price.
```

#### 缺口

- 未与真实供应方验证所有失败类型
  **影响**：无法保证切换成功或模型响应一致
  **进一步探讨**：用受控供应方分别注入限流、超时、凭据错误并记录费用和响应。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Responses 续接能否无损跨供应方迁移？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

固定源码显式注册 Responses 端点，但拒绝 background=true 和非空 conversation。previous_response_id 通过 response memory 查找，过期或未知、ID 歧义、候选 ID 或指纹变化均要求完整输入；有效绑定只返回原候选，且冷却时可能无可用模型。指纹包含 model_id、base_url、api_key 的哈希；绑定机制保持状态归属，不会把原供应方的远程会话自动迁移到另一模型。即使普通请求可回退，也不能说有状态续接无损或保证输出语义一致。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:647-654](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L647-L654)

候选指纹材料。

```text
fn candidate_fingerprint(model_id: &str, base_url: &str, api_key: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(model_id.as_bytes());
    hasher.update([0]);
    hasher.update(base_url.as_bytes());
    hasher.update([0]);
    hasher.update(api_key.as_bytes());
    hex::encode(hasher.finalize())
```

**依据 2 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:668-669](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L668-L669)

Responses 路由存在。

```text
        .route("/v1/responses", post(handle_responses))
        .route("/responses", post(handle_responses))
```

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:1524-1537](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L1524-L1537)

拒绝 background 与 conversation。

<details>
<summary>查看原文（14行）</summary>

```text
    if protocol == RouteProtocol::Responses && body["background"] == true {
        return openai_error(StatusCode::BAD_REQUEST, "Background Responses require a separate task lifecycle and are not supported by Auto Router");
    }
    if protocol == RouteProtocol::Responses
        && body
            .get("conversation")
            .is_some_and(|value| !value.is_null())
    {
        return openai_error(StatusCode::BAD_REQUEST, "Conversation objects are not supported by Auto Router; use complete input or a bound previous_response_id");
    }
    let bound_continuation = protocol == RouteProtocol::Responses && has_previous_response(&body);
    let bound_candidates = match response_candidates(state, &body, candidates.clone(), protocol) {
        Ok(candidates) => candidates,
        Err(error) => return openai_error(StatusCode::BAD_REQUEST, error),
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:1550-1563](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L1550-L1563)

续接限定原候选及冷却失败。

<details>
<summary>查看原文（14行）</summary>

```text
        .filter(|_| !bound_continuation);
    let mut available = prioritized_candidates(state, candidates);
    if bound_continuation {
        available.retain(|candidate| {
            bound_candidates
                .iter()
                .any(|bound| bound.internal_id == candidate.internal_id)
        });
    }
    if available.is_empty() {
        return openai_error(
            StatusCode::SERVICE_UNAVAILABLE,
            "All Auto Router models are cooling down",
        );
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:3935-3966](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L3935-L3966)

有效期、歧义和指纹不匹配条件。

<details>
<summary>查看原文（32行）</summary>

```text
fn has_previous_response(body: &Value) -> bool {
    body.get("previous_response_id")
        .is_some_and(|value| !value.is_null())
}

fn response_candidates(
    state: &AppState,
    body: &Value,
    candidates: Vec<Candidate>,
    protocol: RouteProtocol,
) -> Result<Vec<Candidate>, &'static str> {
    if protocol != RouteProtocol::Responses || !has_previous_response(body) {
        return Ok(candidates);
    }
    let id = body["previous_response_id"]
        .as_str()
        .filter(|id| !id.is_empty())
        .ok_or("previous_response_id must be a response ID")?;
    let binding = state
        .response_memory
        .lock()
        .ok()
        .and_then(|memory| memory.response_bindings.get(id).cloned())
        .filter(|binding| binding.expires_at_ms > now_ms())
        .ok_or("Unknown or expired response ID; send the complete conversation input")?;
    if binding.ambiguous {
        return Err("Ambiguous response ID; send the complete conversation input");
    }
    let candidate = candidates.into_iter()
        .find(|candidate| candidate.internal_id == binding.candidate_id && candidate.fingerprint == binding.fingerprint)
        .ok_or("The original response provider configuration has changed; send the complete conversation input")?;
    Ok(vec![candidate])
```

</details>

#### 缺口

- 未跑真实 Responses 续接或全部兼容特性
  **影响**：不能保证发布二进制或特定 provider 支持完整协议
  **进一步探讨**：隔离客户端验证正常续接、绑定过期、配置变更与后台请求。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续及退出代价是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要桌面应用、可访问供应方或本地模型、客户端支持的协议与路由器凭据；本地入口不意味着内容不离机，故障切换可能向不同供应方发送输入并产生不同计费。首次应备份客户端和账号配置、限定可接收数据的候选；持续需检查额度、服务可用性和供应方能力。stop 先关闭监听，源码明确在途响应独立 drain，不能把停止等同取消已经送出的请求。失败时检查是否已有输出或外部副作用，再恢复原 endpoint；未实测总费用或耗时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:112-120](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/README.md#L112-L120)

作者介绍配置和应用常驻。

```text
## Multi-model smart routing — priority and automatic failover

EchoBird's **Smart Router** puts multiple model providers behind one local API. Add free, paid, or private models from Model Nexus, then drag the cards into your preferred order. The router tries models in that order and automatically falls back when a model is rate-limited, out of quota, or temporarily unavailable. After cooldown, it retries models in priority order.

- **Up to 20 models** — reuse your configured models without entering their API keys again.
- **One endpoint for compatible tools** — supports OpenAI Chat Completions and Anthropic Messages, including clients such as Claude Code.
- **Explicit priority** — you control the order; routing follows that order rather than selecting models by task or price.

**Get started:** open Smart Router → add models from My Models or the free-model directory → drag to set priority → choose **Auto Router** for a compatible tool in App Manager. Keep EchoBird running while tools use its local API.
```

**依据 2 · 作者声明**：[README.md:102-106](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/README.md#L102-L106)

共享登录影响。

```text
## Multi-account switching — ChatGPT, Codex CLI, and Claude Code

Manage multiple saved accounts in EchoBird's **App Manager**, view their usage quota, and choose the account to use when launching a tool.

- **ChatGPT desktop and Codex CLI** — add OpenAI accounts through browser sign-in, then select a saved account and launch. Both tools share the local Codex account configuration, so switching affects the shared login.
```

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:936-955](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L936-L955)

路由器 key 校验。

<details>
<summary>查看原文（20行）</summary>

```text
async fn handle_responses(
    State(mut state): State<AppState>,
    headers: HeaderMap,
    body: Result<Json<Value>, JsonRejection>,
) -> Response {
    let body = match body {
        Ok(Json(body)) => body,
        Err(error) if error.status() == StatusCode::PAYLOAD_TOO_LARGE => {
            return openai_error(error.status(), &error.body_text())
        }
        Err(error) => return error.into_response(),
    };
    state.request_epoch = Some(state.standby.epoch());
    let request_config = match config_for_request(&state) {
        Ok(config) => config,
        Err(error) => return openai_error(StatusCode::INTERNAL_SERVER_ERROR, &error),
    };
    if !is_authorized(&headers, &request_config.api_key) {
        return openai_error(StatusCode::UNAUTHORIZED, "Invalid EchoBird router API key");
    }
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/services/smart_router/runtime.rs:54-70](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/runtime.rs#L54-L70)

停止监听但在途响应独立排空。

<details>
<summary>查看原文（17行）</summary>

```text
    pub(super) fn cancel(&self) {
        self.shutdown.cancel();
    }

    pub(super) async fn stop(self) {
        self.cancel();
        // Wait for the listening socket; in-flight responses drain independently.
        let _ = self.stopped.await;
        super::profiles::set_running(&self.id, false);
        // Windows may still be processing canceled socket I/O after Drop.
        #[cfg(windows)]
        if let Err(error) = wait_for_port_release(self.addr).await {
            // Closed connections or another listener may still reserve the port.
            // A subsequent start retains its existing bind fallback.
            log::debug!(
                "[SmartRouter] listener closed; port {} not yet reusable: {error}",
                self.addr
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:1566-1588](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L1566-L1588)

尝试和时间预算。

<details>
<summary>查看原文（23行）</summary>

```text
    let stream_requested = body.get("stream").and_then(Value::as_bool).unwrap_or(false);
    let mut attempts = Vec::new();
    let mut incompatible_response = None;
    let routing_started = Instant::now();

    let mut available = available.into_iter();
    let mut authentication_retry: Option<(Candidate, Option<Value>)> = None;
    while let Some((mut candidate, refreshed_credentials)) = authentication_retry
        .take()
        .or_else(|| available.next().map(|candidate| (candidate, None)))
    {
        let authentication_retried = refreshed_credentials.is_some();
        if (authentication_retried && candidate_is_cooling_down(state, &candidate))
            || (!authentication_retried && !try_begin_attempt(state, &mut candidate))
        {
            continue;
        }
        if attempts.len() >= policy.max_attempts {
            break;
        }
        let Some(header_timeout) = remaining_timeout(
            routing_started,
            policy.time_budget,
```

</details>

#### 缺口

- 未测供应方费用、恢复和在途网络行为
  **影响**：不能量化净成本或承诺所有请求已停
  **进一步探讨**：隔离客户端记录每次尝试、账单、状态和退出后的在途响应。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 说明与源码有何差异，怎样试用？

**研究主题**：贡献与相对优势、采用判断

#### 完整回答

README 仍声称 Smart Router 不暴露 Responses，但固定源码注册 Responses 路径、handler 验证请求并进入路由；这是静态文档与源码不一致，不等于发布版、所有客户端或所有 Responses 特性已验证。经常切换允许接收相同数据的多个供应方、能接受差异的用户可在独立 profile 用受控提示对照直连；简单任务或不能允许数据发给备选方时保留直连。若续接过期、配置变化、上下文不可重放或出现未确认外部作用，停止自动切换并人工核查。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:112-122](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/README.md#L112-L122)

作者把账号和 router 分开，但仍称无 Responses。

<details>
<summary>查看原文（11行）</summary>

```text
## Multi-model smart routing — priority and automatic failover

EchoBird's **Smart Router** puts multiple model providers behind one local API. Add free, paid, or private models from Model Nexus, then drag the cards into your preferred order. The router tries models in that order and automatically falls back when a model is rate-limited, out of quota, or temporarily unavailable. After cooldown, it retries models in priority order.

- **Up to 20 models** — reuse your configured models without entering their API keys again.
- **One endpoint for compatible tools** — supports OpenAI Chat Completions and Anthropic Messages, including clients such as Claude Code.
- **Explicit priority** — you control the order; routing follows that order rather than selecting models by task or price.

**Get started:** open Smart Router → add models from My Models or the free-model directory → drag to set priority → choose **Auto Router** for a compatible tool in App Manager. Keep EchoBird running while tools use its local API.

Smart Router switches between configured model APIs; it does not automatically rotate saved login accounts. ChatGPT / Codex CLI third-party models require the **Responses API**, which Smart Router does not currently expose. For those tools, use account switching or a Responses-compatible provider directly.
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:662-670](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L662-L670)

固定源码注册 Responses 路径。

```text
    let app = Router::new()
        .route("/health", get(handle_health))
        .route("/v1/models", get(handle_models))
        .route("/models", get(handle_models))
        .route("/v1/chat/completions", post(handle_chat))
        .route("/chat/completions", post(handle_chat))
        .route("/v1/responses", post(handle_responses))
        .route("/responses", post(handle_responses))
        .route("/v1/messages", post(handle_messages))
```

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:936-973](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L936-L973)

Responses handler 入口到路由。

<details>
<summary>查看原文（38行）</summary>

```text
async fn handle_responses(
    State(mut state): State<AppState>,
    headers: HeaderMap,
    body: Result<Json<Value>, JsonRejection>,
) -> Response {
    let body = match body {
        Ok(Json(body)) => body,
        Err(error) if error.status() == StatusCode::PAYLOAD_TOO_LARGE => {
            return openai_error(error.status(), &error.body_text())
        }
        Err(error) => return error.into_response(),
    };
    state.request_epoch = Some(state.standby.epoch());
    let request_config = match config_for_request(&state) {
        Ok(config) => config,
        Err(error) => return openai_error(StatusCode::INTERNAL_SERVER_ERROR, &error),
    };
    if !is_authorized(&headers, &request_config.api_key) {
        return openai_error(StatusCode::UNAUTHORIZED, "Invalid EchoBird router API key");
    }
    state.model_id = request_config.model_id;
    let candidates = match select_candidates(
        &mut state,
        body["model"].as_str().unwrap_or_default(),
        resolve_candidates(request_config.candidate_ids),
        false,
    ) {
        Ok(candidates) => candidates,
        Err(error) => return openai_error(StatusCode::NOT_FOUND, &error),
    };
    protected_route(
        &state,
        &headers,
        body,
        candidates,
        ClientProtocol::Responses,
    )
    .await
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:3940-3966](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L3940-L3966)

续接绑定与要求完整输入。

<details>
<summary>查看原文（27行）</summary>

```text
fn response_candidates(
    state: &AppState,
    body: &Value,
    candidates: Vec<Candidate>,
    protocol: RouteProtocol,
) -> Result<Vec<Candidate>, &'static str> {
    if protocol != RouteProtocol::Responses || !has_previous_response(body) {
        return Ok(candidates);
    }
    let id = body["previous_response_id"]
        .as_str()
        .filter(|id| !id.is_empty())
        .ok_or("previous_response_id must be a response ID")?;
    let binding = state
        .response_memory
        .lock()
        .ok()
        .and_then(|memory| memory.response_bindings.get(id).cloned())
        .filter(|binding| binding.expires_at_ms > now_ms())
        .ok_or("Unknown or expired response ID; send the complete conversation input")?;
    if binding.ambiguous {
        return Err("Ambiguous response ID; send the complete conversation input");
    }
    let candidate = candidates.into_iter()
        .find(|candidate| candidate.internal_id == binding.candidate_id && candidate.fingerprint == binding.fingerprint)
        .ok_or("The original response provider configuration has changed; send the complete conversation input")?;
    Ok(vec![candidate])
```

</details>

#### 缺口

- 未验证发行包、宿主版本和 provider 能力
  **影响**：不能据源码路由断言实际全协议互通
  **进一步探讨**：使用固定构建及受控 provider 检查 Chat、Messages 和受限 Responses。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否验证切换后的质量和工具调用等价？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

当前已有候选能力过滤、状态冷却和 response 续接绑定，仓库还有已交付流失败不重放的测试；因此再做一般健康探测或来源绑定并非新贡献。未验证方案是只用用户授权的脱敏固定题集，在启用候选前离线或受控回放，对比结构化输出、工具调用与关键事实，再给该任务类型附人工审阅结果；它不能证明任意新任务等价，也会增加成本和数据暴露。比较未评估与经题集审阅的备用候选，记录错误调用、漏掉可用模型、人工时和费用；若质量差异未能更早发现或误拒与成本过大，否定方案。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:907-933](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L907-L933)

已有候选选择和不兼容错误。

<details>
<summary>查看原文（27行）</summary>

```text
fn select_candidates(
    state: &mut AppState,
    requested: &str,
    candidates: Vec<Candidate>,
    anthropic_alias: bool,
) -> Result<Vec<Candidate>, String> {
    let requested = requested
        .strip_suffix("[1m]")
        .or_else(|| requested.strip_suffix("[1M]"))
        .unwrap_or(requested);
    if requested.starts_with(super::catalog::SELECTOR_PREFIX) {
        let selected: Vec<_> = candidates
            .into_iter()
            .filter(|candidate| super::catalog::selector(&candidate.internal_id) == requested)
            .collect();
        if selected.is_empty() {
            return Err(
                "Selected router model is unavailable. Refresh the client model list.".into(),
            );
        }
        state.model_id = requested.into();
        Ok(selected)
    } else if state.supports_model(requested) || anthropic_alias {
        Ok(candidates)
    } else {
        Err(format!("Unknown router model: {requested}"))
    }
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:3939-3966](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L3939-L3966)

已有续接绑定。

<details>
<summary>查看原文（28行）</summary>

```text

fn response_candidates(
    state: &AppState,
    body: &Value,
    candidates: Vec<Candidate>,
    protocol: RouteProtocol,
) -> Result<Vec<Candidate>, &'static str> {
    if protocol != RouteProtocol::Responses || !has_previous_response(body) {
        return Ok(candidates);
    }
    let id = body["previous_response_id"]
        .as_str()
        .filter(|id| !id.is_empty())
        .ok_or("previous_response_id must be a response ID")?;
    let binding = state
        .response_memory
        .lock()
        .ok()
        .and_then(|memory| memory.response_bindings.get(id).cloned())
        .filter(|binding| binding.expires_at_ms > now_ms())
        .ok_or("Unknown or expired response ID; send the complete conversation input")?;
    if binding.ambiguous {
        return Err("Ambiguous response ID; send the complete conversation input");
    }
    let candidate = candidates.into_iter()
        .find(|candidate| candidate.internal_id == binding.candidate_id && candidate.fingerprint == binding.fingerprint)
        .ok_or("The original response provider configuration has changed; send the complete conversation input")?;
    Ok(vec![candidate])
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:6780-6789](https://github.com/edison7009/EchoBird/blob/4c34a4341de692e2e71667f8cdc61b9cec320671/src-tauri/src/services/smart_router/server.rs#L6780-L6789)

仓库已有交付后流错误不重放的测试声明。

<details>
<summary>查看原文（10行）</summary>

```text
            );
            assert_eq!(memory.accounts.len(), 1);
        }
    }

    #[tokio::test]
    async fn authentication_failure_after_delivered_output_is_never_replayed() {
        let partial = Response::new(Body::from_stream(stream::iter([
            Ok(Bytes::from_static(
                b"data: {\"choices\":[{\"delta\":{\"content\":\"partial\"}}]}\n\n",
```

</details>

#### 缺口

- 没有题集、质量基线和受控供应方实验
  **影响**：无法证明质量审阅能降低真实任务错误
  **进一步探讨**：使用脱敏固定样本由人工盲评，并记录误拒、费用和副作用。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
