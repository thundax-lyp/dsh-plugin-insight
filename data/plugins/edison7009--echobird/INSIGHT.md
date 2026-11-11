# EchoBird

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[80f7745](https://github.com/edison7009/EchoBird/tree/80f7745e25a060a72897a16b481c0ab14906e7a4)

<!-- BEGIN META -->
[![GitHub ★ 3,536](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C536&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/edison7009/EchoBird)
<!-- END META -->

> **功能**：桌面应用提供 AI 工具安装、账号与额度管理、多模型路由、语音输入和本地模型运行。

> **亮点**：[Q01](#research-q01) 本地 API 将候选管理与有界回退从客户端配置移入路由器。[Q02](#research-q02) 响应续接用候选身份与指纹约束，避免把已绑定的会话交给其他候选。

> **主要限制**：[Q03](#research-q03) 文档仍声明不支持 Responses，固定源码已有部分接线和明确拒绝的模式。发行版与特定客户端能否完成原任务尚待核实。

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
  - [Q01 · 统一入口解决什么重复操作？](#detail-section-11)
  - [Q02 · Responses 的宿主接线和续接约束是什么？](#detail-section-12)
  - [Q03 · 源码与文档的兼容口径哪里不同？](#detail-section-13)
  - [Q04 · 怎样用合成请求评估采用负担？](#detail-section-14)
  - [Q05 · 显式固定有状态任务能否降低误切换？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多个获准模型端点的桌面用户，可把独立请求交给同一个本地路由入口，并在切换后核查输出是否合格。

客户端直连单一模型时，供应方临时故障需要用户改端点并重新提交。供应方原有会话由其自身管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地模型路由 | 为客户端聚合已配置的模型端点 | 回环监听，要求路由密钥和有效候选 |
| 普通请求回退 | 暂时失败时尝试后续候选 | 尝试次数与请求预算有限，输出需验证 |
| Responses 续接 | 按响应标识返回原候选 | 不支持后台或 conversation 对象，原绑定可过期 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| EchoBird 桌面进程和回环端口 | 必需 | 启动本地代理 | 端口不可用时无法接受新请求 |
| 路由密钥与获准候选 | 必需 | 本机请求验证和上游访问 | 无效本地密钥被拒绝，候选不可用时失败 |
| 原供应方响应 ID 与相同指纹 | 依赖上游续接状态时必需 | 继续原候选的会话 | 过期或配置变化时请求需完整输入 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份配置并设定两个获准端点 | 客户端可以连接本地代理 |
| 执行 | 客户端发独立合成请求，观察候选变化 | 备用端点和输出符合预期 |
| 退出 | 用户恢复直连并关闭路由组 | 不再接收新请求，在途响应仍需核查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 桌面进程资源和模型账户条件 | 配置密钥、候选和备份 | 发行环境和开销未实测 |
| 持续 | 各候选实际请求资源和费用 | 维护配置、额度并校验输出 | 重试计费、完成率及额外延迟未知 |
| 失败恢复 | 在途上游用量可能继续 | 核对目标，必要时恢复直连 | 停监听与处理结束的间隔未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 普通请求切换 | 有界候选和时间预算 | 可用率、合格率、净延迟 |
| Responses 续接 | 有效 ID 约束原候选与配置 | 各发行资产、客户端和上游的续接兼容性 |

> **思考**：[Q03](#research-q03) 文档仍声明不支持 Responses，固定源码已有部分接线和明确拒绝的模式。发行版与特定客户端能否完成原任务尚待核实。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 本地 API 将候选管理与有界回退从客户端配置移入路由器。[Q02](#research-q02) 响应续接用候选身份与指纹约束，避免把已绑定的会话交给其他候选。

[Q02](#research-q02) 将响应标识、候选与指纹放入可过期的有界映射，并处理 ID 冲突。[Q03](#research-q03) 停止服务区分新连接和在途请求，给退出核查保留了明确边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 文档仍声明不支持 Responses，固定源码已有部分接线和明确拒绝的模式。发行版与特定客户端能否完成原任务尚待核实。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从独立合成任务开始，保留原端点配置并记录到达的供应方。配置恢复后仍应核对在途请求、输出和供应商用量。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持本地认证、有界候选和续接筛选。真实服务、客户端及效果未验收，任务级状态声明仍是假设。

- 已检查：作者 README、包清单、源码路径 src-tauri/src/services/smart_router/server.rs、src-tauri/src/services/smart_router/server/response_bindings.rs、src-tauri/src/services/smart_router/server/memory_store.rs、src-tauri/src/services/smart_router/profiles.rs、src-tauri/src/services/smart_router/runtime.rs、README.zh-CN.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读 Tauri 工程的智能路由、授权、Responses 续接和监听关闭。未核查全部账号、语音、工具管理或模型协议适配。
- 下一步：在许可的两个模拟端点测独立请求、限流切换、过期续接和路由关闭，分别核对目标、输出、等待与在途影响。

**分析版本**

- **仓库**：[edison7009/EchoBird](https://github.com/edison7009/EchoBird)
- **版本号**：6.2.9（[固定提交 80f7745](https://github.com/edison7009/EchoBird/tree/80f7745e25a060a72897a16b481c0ab14906e7a4)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设在提交前显示有状态任务的固定供应方和失效退路，可以减少缺少可识别响应 ID 的任务被误切换。

在许可的两个模拟端点测独立请求、限流切换、过期续接和路由关闭，分别核对目标、输出、等待与在途影响。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 3539 | — | — | 31565 |
| .js | source | 9 | 1676 | 1640 | 32 | — |
| .mjs | source | 4 | 127 | 119 | 4 | — |
| .mjs | test | 6 | 413 | 390 | 20 | — |
| .ts | test | 57 | 6116 | 5767 | 53 | — |
| .ts | source | 177 | 21073 | 19567 | 754 | — |
| .tsx | source | 124 | 32701 | 30283 | 1486 | — |
| .tsx | test | 125 | 51915 | 50048 | 289 | — |

</details>

**活跃度**

[![Issue 未关闭 396](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=396&color=737b86&logo=github)](https://github.com/edison7009/EchoBird/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 31](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=31&color=737b86&logo=github)](https://github.com/edison7009/EchoBird/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/edison7009/EchoBird/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：使用多个模型供应商的桌面用户能否通过 EchoBird 统一初次请求的路由，同时保持有状态会话的边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一入口解决什么重复操作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护多个已批准的模型端点、经常提交相互独立请求的桌面用户，可以保留客户端的一个本地入口，将候选次序和暂时失败的处理放在路由配置里。直接连接供应方时，遇到暂不可用的模型需修改客户端设置并再次提交；源码里的候选迭代受尝试数和时间预算约束。合格结果还要符合原任务的输出要求，例如固定 JSON 结构和答案，HTTP 成功无法单独说明切换后的任务结果合格。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:111-119](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/README.zh-CN.md#L111-L119)

作者说明模型配置、顺序、失败切换及兼容工具入口。

```text
## 多模型智能路由 —— 按优先级调用，故障自动切换

EchoBird 的**智能路由（Smart Router）**用一个本地 API 汇总多个模型服务。把模型中心已配置的免费、付费或私有模型加入路由，拖动卡片设置优先级。模型限流、额度耗尽或临时不可用时，路由自动尝试下一个；冷却结束后，重新按优先级尝试。

- **最多接入 20 个模型** —— 复用已有模型配置，无需重复填写 API Key。
- **兼容工具共用一个入口** —— 支持 OpenAI Chat Completions 和 Anthropic Messages，可供 Claude Code 等兼容客户端使用。
- **优先级由你决定** —— 按你设定的顺序调用，不按任务内容或价格自动选模型。

**开始使用：**打开「智能路由」→ 从「我的模型」或免费模型目录添加模型 → 拖动排序 → 在「应用管理」中为兼容工具选择 **Auto Router**。工具通过本地 API 调用期间，请保持 EchoBird 运行。
```

**依据 2 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:1470-1482](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server.rs#L1470-L1482)

按可用性选择候选，继续请求额外收窄。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:1503-1536](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server.rs#L1503-L1536)

按次数上限和剩余预算迭代候选。

<details>
<summary>查看原文（34行）</summary>

```text
    let stream_requested = body.get("stream").and_then(Value::as_bool).unwrap_or(false);
    let mut attempts = Vec::new();
    let mut zen_refused = false;
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
            if !stream_requested
                && candidate.account_source.as_ref().is_some_and(|source| {
                    source.provider == crate::models::model::AccountProvider::ClaudeCode
                })
            {
                policy.time_budget
            } else {
                policy.header_timeout
            },
        ) else {
```

</details>

#### 缺口

- 未取得桌面工作中实际发生切换的频率。
  **影响**：不能估算省下的改配置时间。
  **进一步探讨**：对同一批独立合成任务比较直连故障处理和路由处理。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Responses 的宿主接线和续接约束是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Tauri 桌面工程的 Axum 本地路由注册 POST /v1/responses。入口取当次路由配置、核验客户端 API key，再解析候选并走 Responses 分支。使用 previous_response_id 时，内存绑定必须存在、未过期、无冲突，且候选 ID 与配置指纹均匹配。随后的健康筛选也不能把已绑定续接转给备选。正常的原生响应可记录 ID，发现同 ID 对应另一候选时标为歧义。代码允许给绑定设置持久化路径，但这段路径不能证明任意重启后仍可续接。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:537-550](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server.rs#L537-L550)

注册本地 Responses POST 与请求大小限制。

<details>
<summary>查看原文（14行）</summary>

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
        .route("/messages", post(handle_messages))
        .route("/v1/audio/transcriptions", post(voice::handle))
        .route("/audio/transcriptions", post(voice::handle))
        .layer(DefaultBodyLimit::max(MAX_REQUEST_BODY_BYTES))
        .with_state(state);
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:827-852](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server.rs#L827-L852)

加载请求配置、检查授权并调用保护路由。

<details>
<summary>查看原文（26行）</summary>

```text
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

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:724-732](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server.rs#L724-L732)

按客户端协议选择实际 Responses 路径。

```text
    let response = match protocol {
        ClientProtocol::Chat => route_chat_with_candidates(&state, headers, body, candidates).await,
        ClientProtocol::Responses => {
            route_responses_with_candidates(&state, headers, body, candidates).await
        }
        ClientProtocol::Messages => {
            route_messages_with_candidates(&state, headers, body, candidates).await
        }
    };
```

**依据 4 · 源码核查**：[src-tauri/src/services/smart_router/server/response_bindings.rs:18-44](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server/response_bindings.rs#L18-L44)

续接依据有效的 ID、候选和配置指纹筛选。

<details>
<summary>查看原文（27行）</summary>

```text
pub(super) fn response_candidates(
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

**依据 5 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:1458-1482](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server.rs#L1458-L1482)

续接仍限于已绑定的候选。

<details>
<summary>查看原文（25行）</summary>

```text
    let bound_continuation = protocol == RouteProtocol::Responses && has_previous_response(&body);
    let bound_candidates = match response_candidates(state, &body, candidates.clone(), protocol) {
        Ok(candidates) => candidates,
        Err(error) => return openai_error(StatusCode::BAD_REQUEST, error),
    };
    if candidates.is_empty() {
        return openai_error(
            StatusCode::SERVICE_UNAVAILABLE,
            "No usable models are configured for Auto Router",
        );
    }

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
```

</details>

**依据 6 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:2124-2135](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server.rs#L2124-L2135)

非流路径原生响应记录返回 ID。

<details>
<summary>查看原文（12行）</summary>

```text
                        {
                            state.standby.used(
                                state,
                                &candidate,
                                &configured_candidates,
                                protocol,
                                standby_epoch,
                            );
                        }
                        if native_responses {
                            remember_response(state, &candidate, value["id"].as_str());
                        }
```

</details>

**依据 7 · 源码核查**：[src-tauri/src/services/smart_router/server/response_bindings.rs:65-100](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server/response_bindings.rs#L65-L100)

冲突标记、容量回收和绑定持久化。

<details>
<summary>查看原文（36行）</summary>

```text
    memory
        .response_bindings
        .retain(|_, binding| binding.expires_at_ms > now);
    if let Some(binding) = memory.response_bindings.get_mut(id) {
        if binding.ambiguous
            || binding.candidate_id != candidate.internal_id
            || binding.fingerprint != candidate.fingerprint
        {
            binding.ambiguous = true;
            binding.expires_at_ms = now.saturating_add(RESPONSE_BINDING_LIFETIME_MS);
            persist_response_memory(state, memory);
            return;
        }
    }
    if memory.response_bindings.len() >= MAX_RESPONSE_BINDINGS
        && !memory.response_bindings.contains_key(id)
    {
        let oldest = memory
            .response_bindings
            .iter()
            .min_by_key(|(_, binding)| binding.expires_at_ms)
            .map(|(id, _)| id.clone());
        if let Some(oldest) = oldest {
            memory.response_bindings.remove(&oldest);
        }
    }
    memory.response_bindings.insert(
        id.into(),
        ResponseBinding {
            candidate_id: candidate.internal_id.clone(),
            fingerprint: candidate.fingerprint.clone(),
            expires_at_ms: now.saturating_add(RESPONSE_BINDING_LIFETIME_MS),
            ambiguous: false,
        },
    );
    persist_response_memory(state, memory);
```

</details>

**依据 8 · 源码核查**：[src-tauri/src/services/smart_router/server/memory_store.rs:153-159](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server/memory_store.rs#L153-L159)

有配置的持久化路径才写入对应记忆。

```text
pub(super) fn persist_response_memory(
    state: &AppState,
    memory: std::sync::MutexGuard<'_, ResponseMemory>,
) {
    if let Some(path) = &state.response_memory_path {
        persist_memory_at(path, memory);
    }
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 源码与文档的兼容口径哪里不同？

**研究主题**：缺陷与关键质疑

#### 完整回答

中文 README 声称智能路由未提供 Responses API，但同提交的服务器注册了该入口，且明确拒绝后台任务与 conversation 对象。普通前台 Responses 的源码接线与特定客户端、发行版或供应方的完整可用性是不同层面的证据。续接不可用时应让用户识别原供应方状态，再考虑以完整输入建立新请求。停止服务会等待监听关闭，在途响应独立排空，不能靠停止监听撤回已经转发的数据或费用。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:119-121](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/README.zh-CN.md#L119-L121)

作者文档仍把 Responses 作为不支持项。

```text
**开始使用：**打开「智能路由」→ 从「我的模型」或免费模型目录添加模型 → 拖动排序 → 在「应用管理」中为兼容工具选择 **Auto Router**。工具通过本地 API 调用期间，请保持 EchoBird 运行。

智能路由切换的是已配置的模型 API，不会自动轮换已保存的登录账号。ChatGPT / Codex CLI 接入第三方模型需要 **Responses API**，当前智能路由尚未提供此接口；这两个工具请使用账号切换，或直接接入支持 Responses 的服务商。
```

**依据 2 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:537-546](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server.rs#L537-L546)

源码列出已注册的 Responses 路径。

<details>
<summary>查看原文（10行）</summary>

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
        .route("/messages", post(handle_messages))
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:1448-1462](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server.rs#L1448-L1462)

路由拒绝后台和 conversation 请求并检查续接。

<details>
<summary>查看原文（15行）</summary>

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
    };
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/services/smart_router/runtime.rs:54-64](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/runtime.rs#L54-L64)

关闭监听的停止流程允许在途响应独立排空。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

#### 缺口

- 未将安装资产与此 commit 独立对应，也未执行客户端兼容任务。
  **影响**：不能据源码端点建议让现有 Codex 客户端直接切换配置。
  **进一步探讨**：固定同版本构建和供应方，分别核对普通、续接及被拒绝的请求类型。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样用合成请求评估采用负担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

已有两个明确授权端点、能备份客户端设置的用户，可以在独立配置用无敏感数据的短任务测初次请求切换。路由组监听本机回环，客户端仍需要本地路由密钥，上游仍需要各自的访问条件。试用需维护本地进程和候选配置，同时记录尝试次数、质量、等待时间及供应商实际用量。若路由到了未准许的目的地、续接失败，或备用结果不符合合格条件，先恢复原端点和设置，核查在途响应及上游用量。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/services/smart_router/profiles.rs:365-386](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/profiles.rs#L365-L386)

组配置绑定回环监听，再启动 router server。

<details>
<summary>查看原文（22行）</summary>

```text
        let listener = if changed_port || !servers.contains_key(&id) {
            let listener = std::net::TcpListener::bind(("127.0.0.1", settings.port))
                .map_err(port_bind_error)?;
            listener.set_nonblocking(true).map_err(|e| e.to_string())?;
            Some(listener)
        } else {
            None
        };
        let mut config = previous.clone().unwrap_or_default();
        config.name = settings.name.trim().into();
        config.model_id = settings.model_id.trim().into();
        config.port = Some(settings.port);
        config.api_key = crate::services::secret_store::encrypt(&settings.api_key)?;
        if model_manager::decrypt_key_for_use(&config.api_key) != settings.api_key {
            return Err("Smart router API key could not be encrypted".into());
        }
        save_config_unlocked(&config)?;
        Ok((previous, config, listener))
    })?;
    let started = match listener {
        Some(listener) if registry.enabled && config.enabled => {
            with(&id, || server::start(listener)).map(Some)
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:2595-2609](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server.rs#L2595-L2609)

空密钥拒绝，并匹配 Bearer 或 x-api-key。

<details>
<summary>查看原文（15行）</summary>

```text
fn is_authorized(headers: &HeaderMap, expected_key: &str) -> bool {
    if expected_key.trim().is_empty() {
        return false;
    }
    let bearer_matches = headers
        .get(header::AUTHORIZATION)
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.strip_prefix("Bearer "))
        .is_some_and(|key| key == expected_key);
    bearer_matches
        || headers
            .get("x-api-key")
            .and_then(|value| value.to_str().ok())
            .is_some_and(|key| key == expected_key)
}
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:1509-1536](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server.rs#L1509-L1536)

本地尝试受候选和预算控制，费用仍需上游记录。

<details>
<summary>查看原文（28行）</summary>

```text
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
            if !stream_requested
                && candidate.account_source.as_ref().is_some_and(|source| {
                    source.provider == crate::models::model::AccountProvider::ClaudeCode
                })
            {
                policy.time_budget
            } else {
                policy.header_timeout
            },
        ) else {
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/services/smart_router/runtime.rs:54-62](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/runtime.rs#L54-L62)

关闭监听不能同步终止在途响应。

```text
    pub(super) fn cancel(&self) {
        self.shutdown.cancel();
    }

    pub(super) async fn stop(self) {
        self.cancel();
        // Wait for the listening socket; in-flight responses drain independently.
        let _ = self.stopped.await;
        super::profiles::set_running(&self.id, false);
```

#### 缺口

- 当前服务费用、重试实际计费和客户端改配耗时未核实。
  **影响**：不能判断一次合格任务的总成本。
  **进一步探讨**：以同一合成任务测直连与路由，对照供应方账单和客户端操作时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显式固定有状态任务能否降低误切换？

**研究主题**：新假设与验证

#### 完整回答

假设是在提交前让客户端声明请求是否依赖已有上游状态。依赖时显示目标供应方和状态失效的下一步，无状态时才允许候选回退。当前绑定逻辑已经能用响应 ID 约束续接，但只约束带可识别 ID 的请求，不能判断其他隐含的状态依赖。用同一组独立任务和续接任务，模拟候选故障、ID 过期及配置变更，比较意外外发、正确完成、人工干预和等待时间。若现有绑定已覆盖所有试用场景，或声明引入更多误拒且无法减少错误目的地，该方案没有足够增量。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/services/smart_router/server/response_bindings.rs:24-44](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server/response_bindings.rs#L24-L44)

续接仅在请求显式携带相应 ID 时进入约束。

<details>
<summary>查看原文（21行）</summary>

```text
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

**依据 2 · 源码核查**：[src-tauri/src/services/smart_router/server.rs:1470-1482](https://github.com/edison7009/EchoBird/blob/80f7745e25a060a72897a16b481c0ab14906e7a4/src-tauri/src/services/smart_router/server.rs#L1470-L1482)

候选排序保留，但绑定续接额外过滤。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

#### 缺口

- 尚无任务级声明接口或配对评估。
  **影响**：收益可能仅局限于带隐含状态的客户端。
  **进一步探讨**：在可控模拟服务上记录目标供应方和实际完成状态。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
