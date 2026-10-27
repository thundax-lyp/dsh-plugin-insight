# Desktop CC GUI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[af3537b](https://github.com/zhukunpenglinyutong/desktop-cc-gui/tree/af3537bee62d9f219c879353276f2d6c840e9e6c)

<!-- BEGIN META -->
[![GitHub ★ 4,520](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C520&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhukunpenglinyutong/desktop-cc-gui)
<!-- END META -->

> **功能**：用独立桌面界面接入DSH及多个编码CLI，管理会话、工具输出和项目。

> **亮点**：[Q02](#research-q02)DSH适配通过持久host session流而非终端抓屏，能保留结构化工具输出和恢复语义；多引擎统一界面有条件增量，不是DSH原生插件。

> **主要限制**：[Q03](#research-q03)DSH审批请求自动allowed-once，plan并非只读沙箱；对需要人工放行的用户，统一界面不能抹平权限差异。

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
  - [Q01 · 多引擎GUI对DSH用户的具体价值是什么？](#detail-section-11)
  - [Q02 · DSH接入是终端抓取还是持久会话协议？](#detail-section-12)
  - [Q03 · 权限模式是否提供与GUI印象一致的人工审批？](#detail-section-13)
  - [Q04 · 独立客户端、host和各CLI会增加哪些恢复负担？](#detail-section-14)
  - [Q05 · 如何让跨引擎统一界面不隐藏权限差异？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合同时使用多个编码CLI且希望统一项目、会话和工具输出的开发者。合格结果是DSH会话正确恢复、输出和工具状态不重复，并保留各引擎自身边界；原办法是多个终端或DSH Web。它是独立Tauri应用而不是可直接add的DSH插件，安装整个客户端的负担要与统一入口收益一起判断。仅使用DSH一个引擎时，原生Web通常已覆盖主要需求。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| DSH会话接入 | 持久host session与流式输出 | 本地host协议兼容 |
| 多引擎入口 | 项目和会话统一管理 | 各引擎权限不同 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Tauri桌面应用 | 必需 | GUI | 非DSH add插件 |
| DSH本地host | DSH会话必需 | 持久协议 | 会话不可用 |
| 各CLI/provider | 相应引擎必需 | 编码执行 | 各自配置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装客户端并选项目引擎 | host就绪 |
| 2 | 检查实际批准策略 | 不满足则停用 |
| 3 | 隔离项目核对输出和恢复 | 未知结果不盲重发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 桌面、host与CLI | 账号和协议配置 | 时长未知 |
| 持续 | 所选模型与本地进程 | 维护多版本 | 金额未知 |
| 失败恢复 | host与重试资源 | 核对turn是否仍运行 | 权限与凭据退出未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结构化DSH接入 | host流实现 | 持续稳定性 |
| 人工审批 | 当前自动允许分支 | 完整manual路径 |

> **思考**：[Q03](#research-q03)DSH审批请求自动allowed-once，plan并非只读沙箱；对需要人工放行的用户，统一界面不能抹平权限差异。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)DSH适配通过持久host session流而非终端抓屏，能保留结构化工具输出和恢复语义；多引擎统一界面有条件增量，不是DSH原生插件。

把每引擎协议放独立适配器有复用价值；DSH host ownership与流就绪屏障值得借鉴。Rust不在本工程JS/TS统计内，不能用inventory表代表原生后端总代码规模。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)DSH审批请求自动allowed-once，plan并非只读沙箱；对需要人工放行的用户，统一界面不能抹平权限差异。

<a id="detail-section-6"></a>

### 1.5 使用建议

同时使用多个编码CLI的开发者可关注这个统一桌面客户端。它用DSH持久会话协议接入结构化输出，减少多终端切换的收益尚未实测。需要人工工具审批或只读沙箱时先不迁移，继续使用满足权限要求的原生客户端。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src-tauri/src/engine/dsh.rs、src-tauri/src/engine/dsh_session.rs、src-tauri/src/dsh_host.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[zhukunpenglinyutong/desktop-cc-gui](https://github.com/zhukunpenglinyutong/desktop-cc-gui)
- **版本号**：1.1.7（[固定提交 af3537b](https://github.com/zhukunpenglinyutong/desktop-cc-gui/tree/af3537bee62d9f219c879353276f2d6c840e9e6c)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出引擎权限契约显式展示与人工卡片的未验证假设，比较用户误判和误批准。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 268 | 68877 | — | — | 515425 |
| .mjs | source | 2 | 382 | 327 | 22 | — |
| .js | source | 5 | 935 | 784 | 110 | — |
| .ts | source | 309 | 52565 | 41629 | 7904 | — |
| .tsx | source | 253 | 57254 | 49246 | 5587 | — |
| .ts | test | 142 | 20027 | 17207 | 971 | — |
| .tsx | test | 146 | 29840 | 25353 | 1575 | — |
| .md | test | 1 | 351 | — | — | 3651 |
| .jsx | test | 1 | 53 | 52 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/zhukunpenglinyutong/desktop-cc-gui/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Desktop CC GUI的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多引擎GUI对DSH用户的具体价值是什么？

**研究主题**：场景与需求、采用判断

#### 完整回答

适合同时使用多个编码CLI且希望统一项目、会话和工具输出的开发者。合格结果是DSH会话正确恢复、输出和工具状态不重复，并保留各引擎自身边界；原办法是多个终端或DSH Web。它是独立Tauri应用而不是可直接add的DSH插件，安装整个客户端的负担要与统一入口收益一起判断。仅使用DSH一个引擎时，原生Web通常已覆盖主要需求。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-26](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/af3537bee62d9f219c879353276f2d6c840e9e6c/README.md#L16-L26)

作者声明独立桌面客户端和引擎适配

<details>
<summary>查看原文（11行）</summary>

```text
**ccgui** is an open-source **multi-engine AI coding desktop client**. In plain words: it brings command-line AI coding runtimes — **Claude Code**, **Codex CLI**, **Kimi CLI**, **Grok CLI**, **Pi CLI**, **OMP CLI**, **DeepSeek Harness (DSH)**, **Antigravity**, **OpenCode**, **Qoder**, and **MiniMax Code** — into one graphical interface.

No more staring at a black terminal. Open ccgui, pick a project, and chat with AI to write code, fix bugs, and commit to Git. Streaming output, thinking traces, and tool calls are visible as they happen; token usage appears when the engine reports it.

The app is built with **Tauri 2 + React 18 + TypeScript + Rust** and runs on macOS, Windows, and Linux. Settings and state are persisted locally. Content sent to an AI provider follows the boundary of the channel you configured for that CLI.

---

## Supported engines

Every engine below is wired in through a **dedicated protocol adapter** in the Rust backend — streaming events, session history, and provider channels are handled natively, not scraped off a terminal screen.
```

</details>

#### 缺口

- 没有多引擎切换任务的节时实测。
  **影响**：无法判断迁移整个客户端的收益是否覆盖学习负担。
  **进一步探讨**：比较真实多引擎用户相同任务在多终端、DSH Web和GUI的切换及完成时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH接入是终端抓取还是持久会话协议？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

DshEngine明确drives_own_transport=true，不构建每轮子进程命令；通过host session的create/prompt/follow流运行，assistantStream用于增量输出。FOLLOW_READY_TIMEOUT要求先收到订阅就绪，避免prompt早于监听。TurnView记录增量和持久消息关系，目标是避免重复渲染。相对PTY抓屏，结构化协议可表达工具行和恢复会话；相对DSH原生Web是另一客户端适配，不是新增模型能力。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/engine/dsh.rs:14-37](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/af3537bee62d9f219c879353276f2d6c840e9e6c/src-tauri/src/engine/dsh.rs#L14-L37)

自有传输和图像支持

<details>
<summary>查看原文（24行）</summary>

```text
impl Engine for DshEngine {
    fn id(&self) -> &'static str {
        "dsh"
    }

    fn drives_own_transport(&self) -> bool {
        true
    }

    /// Never invoked on the virtual path (`send_host_stream` branches before
    /// the process spawn); a stub keeps the trait contract honest.
    fn build_command(&self, _req: &SendRequest, _bin: &str) -> Result<BuiltCommand, String> {
        Err("dsh runs as a host session; no child process to build".to_string())
    }

    /// Never invoked on the virtual path: frames arrive over the mux WS and
    /// are projected directly to engine events.
    fn parse_line(&self, _line: &str, _out: &mut Vec<super::EngineEvent>) {}

    fn supports_images(&self) -> bool {
        // Images go out as `session/prompt` image content parts (base64) —
        // that IS the dsh image transport; `dsh_images` declares the
        // input modality on hand-declared llm-pi-ai routes first.
        true
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:80-108](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/af3537bee62d9f219c879353276f2d6c840e9e6c/src-tauri/src/engine/dsh_session.rs#L80-L108)

订阅就绪和增量视图状态

<details>
<summary>查看原文（29行）</summary>

```text
const STREAM_EVENTS: &str = "events";
const STREAM_FOLLOW: &str = "follow";
/// Follow history replay is useless here (codemoss renders its own stored
/// conversation); the smallest window keeps the opening snapshot light.
const FOLLOW_MAX_MESSAGES: u32 = 1;
/// The killed-flag poll cadence inside the WS select loop.
const KILL_POLL: Duration = Duration::from_millis(150);
/// Wait for the follow snapshot (proof the subscription is live) at most
/// this long before dispatching the prompt.
const FOLLOW_READY_TIMEOUT: Duration = Duration::from_secs(5);
/// plan 权限下等待 host 回读 plan/mode{active:true} 的上限：无 open turn
/// 时 /plan 立即 committed 并追加该日志事件，超时即 host 未确认。
const PLAN_MODE_CONFIRM_TIMEOUT: Duration = Duration::from_secs(10);

type Ws =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

/// Per-turn view state: live deltas arrive per assistant attempt, and the
/// durable `assistant/message` settlement must not double-render them.
#[derive(Default)]
struct TurnView {
    attempt_streamed_text: bool,
    last_usage: Option<Value>,
    turn_ended: bool,
    /// `request/context` 通告的上下文窗口（本轮内有效）。usage 报告自带窗口时
    /// 由它兜底，done 载荷也要带上，否则前端在回合结束时丢回 200k 假定值。
    context_window: Option<i64>,
    /// `$events` clientId from the ready frame; required on every answer.
    events_client_id: Option<String>,
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限模式是否提供与GUI印象一致的人工审批？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

当前DSH适配对user-questions请求停驻卡片，但approval/request直接返回allowed-once；代码注释明确尚无host-session审批UI。DshEngine又说明plan是软行为引导而非只读沙箱，host重启后悬挂评审会丢失。故不能把此GUI用于要求每次工具人工批准的工作流，也不能将plan当文件写保护。README兼容矩阵和实现存在口径差异，应以固定实现为范围依据。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:682-707](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/af3537bee62d9f219c879353276f2d6c840e9e6c/src-tauri/src/engine/dsh_session.rs#L682-L707)

问题卡与自动批准区别

<details>
<summary>查看原文（26行）</summary>

```text
            // Questions park host-side until the user answers from the card
            // (answer_question posts the outcome); approvals keep the v1
            // auto-allow policy; unknown waterfall kinds reject as before.
            if kind == "user-questions/request" {
                park_question(core, state, view, value, origin, &client_id, event_id).await;
                return;
            }
            // v1 policy: approvals auto-allow — API-created sessions already
            // run tools without a permission flow (the headless engine had
            // the same implicit behavior), and codemoss has no approval UI
            // for host sessions yet.
            let (outcome, notice) = if kind == "approval/request" {
                (json!({ "kind": "result", "value": "allowed-once" }), None)
            } else {
                (
                    json!({
                        "kind": "rejected",
                        "error": { "code": "cancelled", "message": "the user cancelled ask_user_question" },
                    }),
                    Some("已取消一个未识别的交互请求".to_string()),
                )
            };
            let answered = host_call(
                origin,
                "$events/result",
                json!({ "clientId": client_id, "eventId": event_id, "outcome": outcome }),
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/engine/dsh.rs:43-55](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/af3537bee62d9f219c879353276f2d6c840e9e6c/src-tauri/src/engine/dsh.rs#L43-L55)

plan的限制及支持权限

<details>
<summary>查看原文（13行）</summary>

```text
    /// DSH 的人工计划审批经 commands/execute "/plan" 进入、plan-review
    /// presentation intent 等待（0.1.5-rc.1 源码已证实完整协议，适配器见
    /// dsh_session::park_plan_review / enter_plan_mode）。
    fn plan_approval(&self) -> super::plan_review::PlanApproval {
        super::plan_review::PlanApproval::Typed {
            review_kind: super::plan_review::PlanReviewKind::NativeRequest,
            evidence: "dsh 0.1.5-rc.1 dsh-plan-mode plan-review intent + commands/execute /plan",
            limitations: "host 须组合 plan-mode 插件（运行时探测）；plan 是软行为引导非只读沙箱；host 重启后悬挂评审丢失",
        }
    }

    fn supported_permissions(&self) -> &'static [&'static str] {
        &["auto", "plan"]
```

</details>

#### 缺口

- 未核查所有引擎的审批实现，不能外推本发现到其他引擎。
  **影响**：本发现只适用于当前DSH路径，不能给其他引擎下结论。
  **进一步探讨**：按目标引擎逐一跟踪approval请求处理，确认UI选项与执行语义。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 独立客户端、host和各CLI会增加哪些恢复负担？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需要桌面应用、相应CLI、provider及DSH本地host；host维护区分adopted与spawned所有权，接管和凭据链是额外状态。持续使用仍支付所选CLI/provider成本，GUI不改变模型计费；更新客户端与host协议也增加兼容责任。失败应确认host turn是否仍在运行，再恢复会话或回到DSH Web，不能重新发送未知结果的写操作。因审批自动放行妨碍安全可控试用，本次对DSH适配先观察，待明确接受自动权限且只用隔离项目才另行试用。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/dsh_host.rs:1-20](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/af3537bee62d9f219c879353276f2d6c840e9e6c/src-tauri/src/dsh_host.rs#L1-L20)

host生命周期和token链

<details>
<summary>查看原文（20行）</summary>

```text
//! DeepSeek Harness (DSH) local-host maintenance: probe/adopt/spawn/stop the
//! `dsh web` server. CLI version/update lives in [`crate::cli_lifecycle`].
//!
//! Wire protocol (0.1.2+ typert gateway, verified against tmd-cli's cli-dsh):
//! `POST {origin}/api/<namespace>/<method>` with
//! `{type:"client-request",rpcId,method,payload:{args}}` →
//! `{type:"server-response",rpcId,result:{ok:true,value}|{ok:false,error}}`.
//!
//! BrowserAuth (0.1.2+): every RPC requires the signed `dsh-auth-*` cookie.
//! Credential chain: the spawned host prints a one-time launch token
//! (`dsh web: http://…/?token=…`) on its output; we capture it, exchange it
//! via `GET /?token=…` (303 + set-cookie, no redirects), and persist the
//! cookie per-origin in `~/.ccgui-next/dsh-host-credentials.json`. A host
//! that answers with 401 is alive but credential-locked: local listeners are
//! stopped so we can respawn with our own token chain (credentials are ours
//! to manage), remote origins can't be adopted.
//!
//! Ownership rule: only hosts we spawned are tracked in [`DshHostState`] and
//! killed (app exit / dsh_host_stop). A pre-existing host answering describe
//! is adopted and never killed — except via dsh_host_stop's local-listener
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:689-707](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/af3537bee62d9f219c879353276f2d6c840e9e6c/src-tauri/src/engine/dsh_session.rs#L689-L707)

自动批准带来的采用条件

<details>
<summary>查看原文（19行）</summary>

```text
            // v1 policy: approvals auto-allow — API-created sessions already
            // run tools without a permission flow (the headless engine had
            // the same implicit behavior), and codemoss has no approval UI
            // for host sessions yet.
            let (outcome, notice) = if kind == "approval/request" {
                (json!({ "kind": "result", "value": "allowed-once" }), None)
            } else {
                (
                    json!({
                        "kind": "rejected",
                        "error": { "code": "cancelled", "message": "the user cancelled ask_user_question" },
                    }),
                    Some("已取消一个未识别的交互请求".to_string()),
                )
            };
            let answered = host_call(
                origin,
                "$events/result",
                json!({ "clientId": client_id, "eventId": event_id, "outcome": outcome }),
```

</details>

#### 缺口

- host断流后恢复的重复执行边界与凭据清理没有实测。
  **影响**：断流可能形成未知执行结果，影响重试安全和长期维护成本。
  **进一步探讨**：在隔离项目中断host连接，核对持久turn、恢复会话及重复请求行为，并检查退出凭据。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让跨引擎统一界面不隐藏权限差异？

**研究主题**：新假设与验证

#### 完整回答

由同一UI下权限语义不同，提出未验证假设：会话创建前显示本引擎实际批准策略，并让host-session审批走显式用户卡片，可能降低“以为manual实际auto”的误用。增量在跨引擎能力和权限契约，而非再加一个模型入口。对照当前界面和显式契约界面，让用户判断并执行只读/写入任务，测权限理解错误与误批准；若理解改善不足或协议无法可靠停驻，则保留限制提示而不承诺统一manual。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/engine/dsh.rs:43-55](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/af3537bee62d9f219c879353276f2d6c840e9e6c/src-tauri/src/engine/dsh.rs#L43-L55)

权限语义可由适配器明示

<details>
<summary>查看原文（13行）</summary>

```text
    /// DSH 的人工计划审批经 commands/execute "/plan" 进入、plan-review
    /// presentation intent 等待（0.1.5-rc.1 源码已证实完整协议，适配器见
    /// dsh_session::park_plan_review / enter_plan_mode）。
    fn plan_approval(&self) -> super::plan_review::PlanApproval {
        super::plan_review::PlanApproval::Typed {
            review_kind: super::plan_review::PlanReviewKind::NativeRequest,
            evidence: "dsh 0.1.5-rc.1 dsh-plan-mode plan-review intent + commands/execute /plan",
            limitations: "host 须组合 plan-mode 插件（运行时探测）；plan 是软行为引导非只读沙箱；host 重启后悬挂评审丢失",
        }
    }

    fn supported_permissions(&self) -> &'static [&'static str] {
        &["auto", "plan"]
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/engine/dsh_session.rs:682-707](https://github.com/zhukunpenglinyutong/desktop-cc-gui/blob/af3537bee62d9f219c879353276f2d6c840e9e6c/src-tauri/src/engine/dsh_session.rs#L682-L707)

已有question卡但approval另走自动分支

<details>
<summary>查看原文（26行）</summary>

```text
            // Questions park host-side until the user answers from the card
            // (answer_question posts the outcome); approvals keep the v1
            // auto-allow policy; unknown waterfall kinds reject as before.
            if kind == "user-questions/request" {
                park_question(core, state, view, value, origin, &client_id, event_id).await;
                return;
            }
            // v1 policy: approvals auto-allow — API-created sessions already
            // run tools without a permission flow (the headless engine had
            // the same implicit behavior), and codemoss has no approval UI
            // for host sessions yet.
            let (outcome, notice) = if kind == "approval/request" {
                (json!({ "kind": "result", "value": "allowed-once" }), None)
            } else {
                (
                    json!({
                        "kind": "rejected",
                        "error": { "code": "cancelled", "message": "the user cancelled ask_user_question" },
                    }),
                    Some("已取消一个未识别的交互请求".to_string()),
                )
            };
            let answered = host_call(
                origin,
                "$events/result",
                json!({ "clientId": client_id, "eventId": event_id, "outcome": outcome }),
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
