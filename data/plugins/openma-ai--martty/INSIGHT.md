# Martty

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b4dbfa0](https://github.com/openma-ai/Martty/tree/b4dbfa05a049e0cd9410435c1e98bd29446cac3c)

<!-- BEGIN META -->
[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openma-ai/Martty)
<!-- END META -->

> **功能**：Rust原生Agent TUI，以ACP连接DSH或其他agent，Node Cordis组合会话视图、命令和插件。

> **亮点**：[Q02](#research-q02) 多会话控制、队列与诚实cancel结束状态是实质客户端贡献；[Q03](#research-q03) 插件生命周期不等安全隔离。

> **主要限制**：[Q03](#research-q03) 本地fs宽读/词法内写及动态JS不是沙盒；[Q02](#research-q02) 取消和历史恢复不证明远端停止/判重。

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
  - [Q01 · 根项目交付和用户流程相对原生CLI多什么？](#detail-section-11)
  - [Q02 · Rust的ACP调度、队列、会话绑定和取消怎样实现？](#detail-section-12)
  - [Q03 · 插件、权限和本地工具的信任边界在哪里？](#detail-section-13)
  - [Q04 · 依赖、首次/持续/失败与退出成本是什么？](#detail-section-14)
  - [Q05 · 哪些机制可迁移，如何验证采用假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 终端开发者在一个界面管理多会话/排队/打断与工具结果；结果正确比界面完整更重要。

原生DSH/各agent CLI或自行拼ACP客户端；本组件提供统一终端交互与可组合界面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话交互 | 流式任务、tab与排队/steer | ACP能力差异，非完成保证 |
| 取消与完成反馈 | 按session/generation处理轮次结束 | 通知非远端强停止 |
| 历史恢复 | 发现本地日志和恢复会话界面 | 非在途句柄/外部结果恢复 |
| 插件化界面 | 主题、槽、命令、动态Client贡献 | 可信JS，非安全沙盒 |
| 本地fs/terminal | 按当前策略读写或询问后启动终端 | 读不限路径、词法内写可跟symlink |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Rust平台二进制/TTY | 必需 | 终端绘制与输入 | 平台包缺失或TTY差异会阻启动 |
| Node/Cordis客户端树 | 完整组合需 | ACP及命令/槽/插件 | 版本与服务缺失需诊断 |
| 可信ACP agent/凭据 | 非demo必需 | 模型和工具执行 | 能力协商差异不保证通用 |
| 本地文件/终端权限 | 相关功能需 | client代执行fs/terminal | 不构成workspace沙盒 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选择 | 固定可信Harness和副本cwd | 先普通无副作用prompt |
| 核路由 | 两会话队列/配置/steer | 结果只归属正确tab |
| 核取消 | Esc后查agent stop_reason与真实工具 | CancelRequested非停止证明 |
| 恢复退出 | 保存session id、退出TTY并查原agent | 未知结果先人工核，不盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 原生/Node/agent依赖和凭据 | TTY、cwd、模型/权限核对 | 安装及工时未知 |
| 持续 | 模型tokens、工具进程、会话日志/渲染 | 审核工具和插件，维护多会话 | 任务效率与费用未测 |
| 失败 | 重连/重做计算与TTY救援 | 核远端结果、会话id和原生CLI | 取消/退出不回滚副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多会话控制 | 每session状态与generation完成核验 | 实际串状态率未测 |
| 取消反馈 | 请求与agent实际结束分开 | 远端工具强停止未证 |
| 插件界面组合 | fiber归属与命令/槽挂载 | 可信代码要求、效果优于原CLI未知 |

> **思考**：[Q03](#research-q03) 本地fs宽读/词法内写及动态JS不是沙盒；[Q02](#research-q02) 取消和历史恢复不证明远端停止/判重。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 多会话控制、队列与诚实cancel结束状态是实质客户端贡献；[Q03](#research-q03) 插件生命周期不等安全隔离。

[Q02](#research-q02) 每session lane和generation可借鉴；[Q03](#research-q03) API组合不是执行隔离，全路径策略仍需独立验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 本地fs宽读/词法内写及动态JS不是沙盒；[Q02](#research-q02) 取消和历史恢复不证明远端停止/判重。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 观察可信单Harness副本任务，验证会话与本地权限后再扩范围；故障回原CLI核实际状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定代表调度、cancel、会话发现、插件与本地工具路径静态核查；未运行TUI/agent或测任务效果，未全审所有UI/扩展路径。

- 已检查：作者 README、包清单、源码路径 README.md、Cargo.toml、src/acp.rs、src/sessions.rs、docs/architecture.md、npm/lib/cordis-protocol.js、npm/lib/client-run.js、npm/lib/inspect.js、src/acp_fs.rs、npm/package.json、src/main.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根应用代表Rust ACP调度/取消/会话发现、本地fs/terminal、TTY退出与Node插件挂载。未穷举全部UI、附件、shell、ACP扩展与第三方agent。
- 下一步：固定b4dbfa05a049e0cd9410435c1e98bd29446cac3c只读；未安装/编译/启动/测试或请求模型。所有效率、兼容和外部副作用结论保留未知。

**分析版本**

- **仓库**：[openma-ai/Martty](https://github.com/openma-ai/Martty)
- **版本号**：未声明（[固定提交 b4dbfa0](https://github.com/openma-ai/Martty/tree/b4dbfa05a049e0cd9410435c1e98bd29446cac3c)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 会话本地能力收据与真实路径授权是假设，需含取消后写入等反例验证。

固定b4dbfa05a049e0cd9410435c1e98bd29446cac3c只读；未安装/编译/启动/测试或请求模型。所有效率、兼容和外部副作用结论保留未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 32 | 6689 | — | — | 67009 |
| .js | source | 65 | 13757 | 11759 | 1111 | — |
| .mjs | test | 61 | 18079 | 16412 | 303 | — |
| .mjs | source | 18 | 2924 | 2437 | 276 | — |
| .tsx | source | 4 | 517 | 462 | 25 | — |
| .tsx | test | 2 | 144 | 120 | 3 | — |
| .ts | source | 10 | 1096 | 1023 | 29 | — |
| .ts | test | 13 | 456 | 392 | 32 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/openma-ai/Martty/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：终端Agent用户能否把会话、排队/打断和插件视图接成可恢复工作流，而不混淆协议接受与远端副作用完成？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目交付和用户流程相对原生CLI多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根项目是Rust原生终端Agent客户端，Node Cordis树负责ACP连接与可组合UI服务，默认接DSH，也可接其他ACP agent；不是一个给模型新增业务工具的单一DSH插件。面向习惯终端、希望在同一会话界面看流式回复/工具/subagent/Plan并排队或steer的开发者。npm子包是分发/插件/连接层，根研究重点是终端会话工作流，两者不能作为两份独立用户效果证据。

基线是直接使用DSH/各agent原生CLI，或自己拼ACP客户端；增量是原生输入/视图、跨Harness入口与Cordis可组合主题/命令/槽。合格结果是输入送到正确会话、切tab不串状态、steer被接受或回到队列、取消结果诚实显示、工具权限和恢复边界可解释。UI完整和特性数量不能证明比现有CLI更快，也不保证每个ACP agent支持相同功能。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-9](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/README.md#L5-L9)

作者定位DSH优先ACP TUI。

```text
<h1 align="center">Martty</h1>

<p align="center">
  DSH-first Agent TUI，使用与 DSH 同款的 Cordis 插件能力，也可连接其他兼容 ACP agent。
</p>
```

**依据 2 · 源码核查**：[Cargo.toml:1-11](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/Cargo.toml#L1-L11)

根原生可执行程序。

<details>
<summary>查看原文（11行）</summary>

```text
[package]
name = "deepseek-harness-tui"
version = "0.3.3"
edition = "2021"
description = "Terminal-native ACP client UI with a Cordis client plugin tree"
license = "MIT"

[[bin]]
name = "martty"
path = "src/main.rs"

```

</details>

**依据 3 · 作者声明**：[README.md:69-103](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/README.md#L69-L103)

作者声明交互任务与快捷入口。

<details>
<summary>查看原文（35行）</summary>

````text
```

## Agent UI

Martty 在终端中呈现完整的 agent 工作过程，包括流式回复、推理、工具调用、
subagent、Plan、token 用量和持久化会话。图片可以从文件或剪贴板加入 prompt；
工具输出、Markdown、代码块和图片预览都使用终端原生交互。

回合运行时可以继续排队消息，也可以立即 steer 当前 agent。会话通过 `/new`、
`/resume` 和 `--session-id` 管理，workspace、模型、权限和界面选择会随会话恢复。

<p align="center">
  <img src="assets/screenshots/agent-turn.png" width="720"
       alt="Martty 中的 Markdown 回复、工具调用和运行状态" />
</p>

常用操作：

| 按键 / 命令 | 行为 |
|---|---|
| `enter` | 发送消息；composer 为空且 Queue 非空时立即发送队首 |
| `ctrl+enter` | 立即 steer 当前 agent（macOS 也可用 `⌘⏎`） |
| `alt+↑` | 选择任意 Queue 条目；`↑/↓` 移动，`enter` 编辑，`ctrl+d` 删除 |
| `↓` · `←/→` · `enter` | 空输入时展开 Agent 导航、移动并打开；`esc` 折叠 |
| `esc` | 中断当前回合并保留草稿 |
| `/` | 打开命令与参数候选 |
| `/model` · `/agent` | 选择模型和 Agent Preset |
| `/harness [id]` | 在 TUI 内切换 Harness 并启动新的空会话 |
| `/permission` · `shift+tab` | 选择或轮换权限模式 |
| `/image <path>` · `/clip` | 添加本地图片或剪贴板图片 |
| `!cmd` | 在 workspace 的会话级本地 shell 中执行命令 |
| `/help` · `/keys` | 查看命令与快捷键 |
| `/vim` | 切换 vim 模态编辑（默认关闭；normal 模式 h/j/k/l 移动、dd 删行、i 插入） |

### 文本编辑（composer 输入框）
````

</details>

#### 缺口

- 实际开发者效率、终端兼容和跨agent成功率未知
  **影响**：只能确认产品任务及源码实现，不可承诺替代原生CLI
  **进一步探讨**：选择一条低副作用任务对照原生CLI的正确会话与恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Rust的ACP调度、队列、会话绑定和取消怎样实现？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

ACP每会话持有inflight generation、等待queue和steers计数；主prompt与慢控制请求拆分，避免认证/配置阻塞全部会话。steer依initialize能力选择_session/steering或MiniMax文本路线，不支持图片时延后；未宣告则用并发prompt旧约定，拒绝交回客户端FIFO而非在transport再排第二份。这里是路由/调度兼容，不保证agent已经完成追加任务。

Interrupt有live inflight时只发session/cancel notification并标turn_aborted；没有live轮次时清该会话等待/认证parked提示并显示丢弃数量。prompt_done按session与gen比当前占用，不匹配直接丢旧finish，避免关闭重绑后旧结果清掉新轮。对于cancel竞态，只有错误/agent stop_reason Cancelled才标interrupted；若agent已完成就照实际结果显示。因此“Esc发送取消”不等远端工具/网络副作用已停，generation保护客户端轮次状态也不是外部执行fencing。

/resume扫描配置根及本地DSH日志，按mtime挑选并跳不可读条目；从日志重建界面不是远端运行句柄恢复或对未确认写入判重。会话能展示历史不说明之前工具停止，恢复后必须核原agent/模型/权限与外部结果。

#### 证据与依据

**依据 1 · 源码核查**：[src/acp.rs:355-386](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/acp.rs#L355-L386)

会话inflight/steer状态。

<details>
<summary>查看原文（32行）</summary>

```text
    payload: ParkedPromptKind,
    /// Turn generation: matches the `inflight` tag when this finish is the
    /// one that currently owns the session handle.
    gen: u64,
}

/// Per-session turn state behind the ACP transport. Each server allows one
/// in-flight `session/prompt` per session, so every bound session gets its own
/// handle; completions are demultiplexed by the id inside `PromptFinish`.
#[derive(Default)]
struct SessionHandle {
    /// Occupancy marker for the in-flight `session/prompt` task, tagged
    /// with the turn's generation. The task reports through the prompt-done
    /// channel, so the handle is only ever cleared, never awaited. The
    /// generation lets a stale finish (its session was forgotten and
    /// re-bound while the old task was still unwinding) be recognized and
    /// dropped instead of clearing the *new* turn's marker.
    inflight: Option<(u64, tokio::task::JoinHandle<()>)>,
    /// Follow-ups waiting for this session's active turn to settle.
    queue: VecDeque<Cmd>,
    /// `session/cancel` was sent for the in-flight prompt; its finish is
    /// reported as an interruption, not a turn result.
    turn_aborted: bool,
    /// Steers whose request has not returned yet. On the concurrent-prompt
    /// route a steer is a second `session/prompt`; agents that cannot join
    /// a turn (pi-acp) run it as the *next* turn, so its reply streams after
    /// the primary prompt returned and before its own response does. The
    /// session stays busy until every in-flight prompt has returned.
    steers_inflight: usize,
    /// Prompts requeued after an auth stall. Each one gets exactly one
    /// retry after sign-in: a second `-32000` means the agent refused the
    /// message outright, not "still unauthenticated" — re-parking it
```

</details>

**依据 2 · 源码核查**：[src/acp.rs:454-496](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/acp.rs#L454-L496)

能力选择steering路线。

<details>
<summary>查看原文（43行）</summary>

```text
enum SteerRoute {
    /// Legacy agents with no steering advertisement: a second
    /// `session/prompt` while the first is in flight joins that turn
    /// (e.g. `@zed-industries/claude-agent-acp` <0.24 with
    /// `_meta.claudeCode.promptQueueing`).
    #[default]
    ConcurrentPrompt,
    /// The shared ACP steering extension: `_session/steering`, advertised by
    /// top-level `_meta.steering.supported` (claude-agent-acp, codex-acp,
    /// deepseek-harness-acp). `{outcome:"injected"}` joins the turn,
    /// `startedNewTurn` means the agent consumed it as a fresh turn, and
    /// `{outcome:"promptRequired"}` means the turn already ended.
    SessionSteering,
    /// MiniMax Code: `mcode/session/steer`, listed in
    /// `_meta["minimax-code/extensions"].methods`. Its `session/prompt`
    /// rejects concurrency outright, and steering carries text only.
    McodeSteer,
}

const SESSION_STEERING_METHOD: &str = "_session/steering";
const MCODE_STEER_METHOD: &str = "mcode/session/steer";

fn steer_route(init: &Value) -> SteerRoute {
    let steering_supported = |meta: Option<&Value>| {
        meta.and_then(|meta| meta.pointer("/steering/supported"))
            .and_then(Value::as_bool)
            == Some(true)
    };
    if steering_supported(init.get("_meta"))
        || steering_supported(init.pointer("/agentCapabilities/_meta"))
    {
        return SteerRoute::SessionSteering;
    }
    // JSON pointer escapes the `/` inside the extension key as `~1`.
    let mcode_methods = init
        .pointer("/_meta/minimax-code~1extensions/methods")
        .and_then(Value::as_array);
    if mcode_methods.is_some_and(|methods| {
        methods.iter().any(|m| m.as_str() == Some(MCODE_STEER_METHOD))
    }) {
        return SteerRoute::McodeSteer;
    }
    SteerRoute::ConcurrentPrompt
```

</details>

**依据 3 · 源码核查**：[src/acp.rs:564-572](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/acp.rs#L564-L572)

cancel仅发通知与请求事件。

```text
fn abort_turn(cx: &ConnectionTo<Agent>, session_id: &Option<SessionId>, bus: &Sender<AppEvent>) {
    if let Some(sid) = session_id.clone() {
        let _ = cx.send_notification(CancelNotification::new(sid.clone()));
        let _ = bus.send(AppEvent::Ctl(CtlEvent::CancelRequested {
            session_id: sid.to_string(),
        }));
    }
}

```

**依据 4 · 源码核查**：[src/acp.rs:3286-3340](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/acp.rs#L3286-L3340)

真实Interrupt分支。

<details>
<summary>查看原文（55行）</summary>

```text
                        }
                        Cmd::Interrupt { session_id: cmd_session } => {
                            // Only a live turn can be aborted. Setting the
                            // flag with no inflight prompt would poison the
                            // *next* prompt's finish (its result would be
                            // swallowed and the turn misreported as
                            // interrupted).
                            match resolve_cmd_session(&sessions, &current, &cmd_session, "interrupt") {
                                Ok(Some(sid)) => {
                                    // `resolve_cmd_session` only returns ids
                                    // present in `sessions` — enter the slot
                                    // directly rather than an unreachable
                                    // if-let (issue #160).
                                    let handle = sessions.entry(sid.to_string()).or_default();
                                        if handle.inflight.is_some() {
                                            abort_turn(&cx, &Some(sid), &bus);
                                            handle.turn_aborted = true;
                                        } else {
                                            // No live turn, but queued or
                                            // auth-held prompts still pin
                                            // the session: Esc must resolve
                                            // those too — drop the pending
                                            // sends, say so, and settle the
                                            // turn the UI believes is in
                                            // flight (issue #160).
                                            let queued = std::mem::take(&mut handle.queue).len();
                                            let held = parked.iter().filter(|prompt| {
                                                prompt.session.as_deref() == Some(&*sid.0)
                                            }).count();
                                            parked.retain(|prompt| {
                                                prompt.session.as_deref() != Some(&*sid.0)
                                            });
                                            let dropped = queued + held;
                                            if dropped > 0 {
                                                let _ = bus.send(AppEvent::Ui(
                                                    crate::events::UiEvent::SessionNotice {
                                                        session: sid.to_string(),
                                                        severity: "warn".into(),
                                                        title: format!(
                                                            "cancelled — discarded {} pending prompt{}",
                                                            dropped,
                                                            if dropped == 1 { "" } else { "s" }
                                                        ),
                                                        details: None,
                                                    },
                                                ));
                                                let _ = bus.send(AppEvent::Ctl(CtlEvent::Interrupted {
                                                    session_id: sid.to_string(),
                                                }));
                                            }
                                        }
                                }
                                Ok(None) => {}
                                Err(err) => {
                                    let _ = bus.send(AppEvent::Ctl(CtlEvent::SessionOpFailed {
```

</details>

**依据 5 · 源码核查**：[src/acp.rs:3990-4045](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/acp.rs#L3990-L4045)

generation与cancel真实结果处理。

<details>
<summary>查看原文（56行）</summary>

```text
                        finish = prompt_done_rx.recv() => {
                            let _ = finish.map(|done| {
                            let key = done.session_id.clone();
                            // A session closed with `/close` (ForgetSession)
                            // while its prompt was in flight: the turn ends
                            // here — its UI events would be foreign on every
                            // tab, and an auth error must not park a retry
                            // for a session nobody views. Drop the finish.
                            let Some(handle) = sessions.get_mut(&key) else {
                                return;
                            };
                            // Stale finish (the session was forgotten and
                            // re-bound; a new turn owns the handle now):
                            // clear nothing — the new turn's occupancy
                            // marker must survive a late old finish.
                            if handle.inflight.as_ref().map(|(gen, _)| *gen) != Some(done.gen) {
                                return;
                            }
                            handle.inflight = None;
                            let aborted = std::mem::take(&mut handle.turn_aborted);
                            // `session/cancel` can race an already-settling
                            // turn: trust the agent's stop reason. A real
                            // interruption surfaces as `Cancelled` (or an
                            // error); a turn that completed despite the
                            // cancel still reports its own result.
                            let agent_cancelled = matches!(
                                &done.result,
                                Ok(response) if matches!(
                                    response.stop_reason,
                                    agent_client_protocol::schema::v1::StopReason::Cancelled
                                )
                            );
                            if aborted && (done.result.is_err() || agent_cancelled) {
                                let _ = bus.send(AppEvent::Ui(
                                    crate::events::UiEvent::TurnEnd {
                                        session: key.clone(),
                                        kind: "interrupted".into(),
                                    },
                                ));
                                let _ = bus.send(AppEvent::Ctl(CtlEvent::Interrupted {
                                    session_id: key.clone(),
                                }));
                            } else {
                                let ok = matches!(done.result, Ok(_));
                                let provider = auth_provider(&surface, Some(&done.session_id));
                                apply_prompt_finish(
                                    done,
                                    &mut sessions,
                                    &mut parked,
                                    &bus,
                                    &methods,
                                    provider.as_deref(),
                                );
                                if ok && !parked.is_empty() {
                                    // A success proves its provider is
                                    // credentialed — credit it so a
```

</details>

**依据 6 · 源码核查**：[src/sessions.rs:72-125](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/sessions.rs#L72-L125)

本地持久会话发现边界。

<details>
<summary>查看原文（54行）</summary>

```text
/// List resumable sessions for `workspace`, newest first, excluding
/// `skip_id` (the currently active session). Best effort: unreadable or
/// foreign files are skipped, never an error.
/// Default cap for the `/resume` picker when no explicit count is given
/// (`/resume` behaves like `/resume 50`).
pub const DEFAULT_SESSION_LIST_LIMIT: usize = 50;

pub fn list_sessions(
    cfg_root: &str,
    workspace: &str,
    skip_id: &str,
    limit: usize,
) -> Vec<SessionSummary> {
    let slug = workspace_slug(workspace);
    let mut candidate_files: Vec<(PathBuf, SystemTime)> = Vec::new();
    for root in session_roots(cfg_root) {
        // <root>/<slug>/<id>/session.jsonl[.zstd]
        let mut dirs: Vec<PathBuf> = Vec::new();
        if let Ok(entries) = std::fs::read_dir(root.join(&slug)) {
            dirs.extend(entries.flatten().map(|e| e.path()));
        }
        // Flat fallback: <root>/<id>/session.jsonl[.zstd]
        if let Ok(entries) = std::fs::read_dir(&root) {
            dirs.extend(entries.flatten().map(|e| e.path()));
        }
        for dir in dirs {
            if dir.file_name().and_then(|n| n.to_str()) == Some(skip_id) {
                continue;
            }
            if let Some(file) = session_file(&dir) {
                let mtime = std::fs::metadata(&file)
                    .and_then(|m| m.modified())
                    .unwrap_or(SystemTime::UNIX_EPOCH);
                candidate_files.push((file, mtime));
            }
        }
    }
    candidate_files.sort_by(|(f1, m1), (f2, m2)| m2.cmp(m1).then_with(|| f1.cmp(f2)));
    candidate_files.dedup_by(|(f1, _), (f2, _)| f1 == f2);

    let mut out: Vec<SessionSummary> = Vec::new();
    for (file, _) in candidate_files {
        let Some(summary) = summarize(&file) else {
            continue;
        };
        if summary.id == skip_id || out.iter().any(|s| s.id == summary.id) {
            continue;
        }
        out.push(summary);
        if out.len() >= limit {
            break;
        }
    }
    out
```

</details>

#### 缺口

- 所有agent cancel语义、历史完整恢复与网络故障未验
  **影响**：不能把本地占用/日志恢复当远端恰好一次或强停止
  **进一步探讨**：模拟取消晚完成、关闭重绑迟到结果、多tab与丢回执并核外部副作用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 插件、权限和本地工具的信任边界在哪里？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

Host与Client是不同Cordis树，通过ACP/本地compositor传JSON而非共享ctx；可选Cordis扩展需要initialize协议0协商，普通ACP agent不能凭名称获得这些扩展能力。Client动态代码通过applyClientHalf的new Function运行，并用Cordis fiber管理注册/定时器/卸载；替换process/require等形参是API约束，不是操作系统沙盒，也不能从“plugins never see TTY”推断恶意JS隔离。插件代码应视为可信扩展，卸载UI注册不回滚此前Host调用或文件/网络效果。

Rust实际ACP fs读文件不限制到workspace；写在词法cwd内静默，外部路径才询问。normalize_path处理.与..但不realpath，is_inside_cwd按路径组件比较，write随后跟随真实FS；因此cwd下symlink目标可超出词法工作区而不进入外写询问，这只是固定语义风险，未运行复现。终端create每次先confirm_terminal_spawn，获allow后本地进程使用所给cwd/env；这是本机权限执行而非workspace隔离。已有agent权限也不能替代client代执行fs/terminal自己的政策核验。

#### 证据与依据

**依据 1 · 源码核查**：[docs/architecture.md:16-39](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/docs/architecture.md#L16-L39)

双进程与协商边界作者架构。

<details>
<summary>查看原文（24行）</summary>

```text

主路径 `dsh --profile martty` 启动两个进程：Host 进程的 Base Cordis 树直接挂完整 ACP plugin；Host runner 再启动独立的 TUI Client 进程。两者只通过 TUI Client 的标准 stdin/stdout 讲 ACP，不共享 Cordis service、plugin id、`inject` 或 fiber。Client 进程的 fd 3/4 只继承用户 TTY，再映射为 Rust painter 的 stdin/stdout；Host↔Client ACP 不走 fd 3/4。

独立入口 `martty` 保持通用 ACP client 语义：它的 Client 树可以 spawn `dsh-acp`、`dsh --profile acp` 或其它 ACP agent，也可以接调用方提供的 stream。

## ACP client：根插件或附加插件

同一份 `apply`，两种组合位置：

| | 独立根插件 | 附加在已有树上 |
|---|---|---|
| 位置 | client 组合的第一行，进程根 | 别人的 client 树里一行 `insert` |
| 提供 | `ctx.acpClient`（以及它 boot 的 client 服务） | 同样 `ctx.acpClient` |
| Agent | `config.agent.command` spawn（默认可 `dsh-acp`）或 `config.stream` 接已有标准管道 | profile 主路径由 Host runner 把 `config.stream` 接到跨进程 stdio；独立入口可 spawn |
| 不做什么 | 不 `ctx.plugin` 进 dsh-base | 不与 ACP Host 插件同进程、也不把 ACP 改成进程内 stream |

接到 dsh 上只是 agent 配置，例如 `{ command: "dsh-acp" }` 或 `{ command: "dsh", args: ["--profile", "acp"] }`。换成别的 ACP agent 只改这条命令。

## 协商后的 DSH Cordis ACP 扩展

Server 树（profile 主路径里的 Base + ACP plugin，或 standalone dsh-acp）和 Client 树（TUI/皮）**位于不同进程且不共享 Cordis**。协调只用 ACP：

| 方向 | 走 ACP | 不走 |
|---|---|---|
```

</details>

**依据 2 · 源码核查**：[npm/lib/cordis-protocol.js:45-60](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/cordis-protocol.js#L45-L60)

实际协议0判定。

<details>
<summary>查看原文（16行）</summary>

```text
 * Read the negotiated DSH Cordis capability from an ACP initialize result.
 * @param {unknown} result
 * @returns {{ protocol: number } | null}
 */
export function readCordisCapability(result) {
  if (result === null || typeof result !== 'object' || Array.isArray(result)) return null
  const capabilities = result.agentCapabilities
  if (capabilities === null || typeof capabilities !== 'object' || Array.isArray(capabilities)) return null
  const meta = capabilities._meta
  if (meta === null || typeof meta !== 'object' || Array.isArray(meta)) return null
  const dsh = meta.dsh
  if (dsh === null || typeof dsh !== 'object' || Array.isArray(dsh)) return null
  const cordis = dsh.cordis
  if (cordis === null || typeof cordis !== 'object' || Array.isArray(cordis)) return null
  return cordis.protocol === CORDIS_PROTOCOL ? { protocol: CORDIS_PROTOCOL } : null
}
```

</details>

**依据 3 · 源码核查**：[npm/lib/client-run.js:41-80](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/client-run.js#L41-L80)

动态JS与形参trap。

<details>
<summary>查看原文（40行）</summary>

```text
export async function applyClientHalf(clientCode, env) {
  if (typeof clientCode !== 'string' || clientCode.trim().length === 0) {
    throw new Error('TUI Client half is empty')
  }
  let plugin
  try {
    const factory = new Function(
      'React',
      'styles',
      'host',
      'harness',
      'require',
      'process',
      'Buffer',
      'setTimeout',
      'setInterval',
      `return (async () => {\n${clientCode}\n})()`,
    )
    plugin = await factory(
      reactTrap,
      stylesTrap,
      hostFor(env),
      harnessTrap,
      requireTrap,
      processTrap,
      bufferTrap,
      timerGlobalTrap,
      timerGlobalTrap,
    )
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `TUI Client half failed to parse: ${error.message}\n`
        + 'The Client half is plain JavaScript (no JSX, no TypeScript).',
      )
    }
    throw error
  }
  return applyClientPlugin(plugin, env)
}
```

</details>

**依据 4 · 源码核查**：[npm/lib/inspect.js:698-745](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/lib/inspect.js#L698-L745)

Client fiber挂载和dispose。

<details>
<summary>查看原文（48行）</summary>

```text
  pluginId,
  clientCode,
  tuiTheme,
  tuiPresets,
  tuiSlots,
  tuiCommands,
  tuiOverlay,
  acpSessionConfig,
  acpSessionPlan,
  acpSessionStats,
  acpSessionStatus,
  timer,
  invoke,
) {
  if (typeof ctx.plugin !== 'function') {
    return applyClientHalf(clientCode, {
      pluginId,
      tuiTheme, tuiPresets, tuiSlots, tuiCommands, tuiOverlay, acpSessionConfig, acpSessionPlan,
      acpSessionStats, acpSessionStatus, timer, invoke,
    })
  }

  let applied
  const fiber = ctx.plugin({
    name: `tui-dynamic:${pluginId}`,
    inject: [],
    apply: async () => {
      applied = await applyClientHalf(clientCode, {
        pluginId,
        tuiTheme, tuiPresets, tuiSlots, tuiCommands, tuiOverlay, acpSessionConfig, acpSessionPlan,
        acpSessionStats, acpSessionStatus, timer, invoke,
      })
      return applied.dispose
    },
  })
  try {
    await fiber
  } catch (error) {
    await fiber.dispose()
    throw error
  }
  return {
    waitingFor: applied.waitingFor,
    dispose() {
      applied.dispose()
      return fiber.dispose()
    },
  }
```

</details>

**依据 5 · 源码核查**：[src/acp_fs.rs:27-85](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/acp_fs.rs#L27-L85)

词法路径及真实读写。

<details>
<summary>查看原文（59行）</summary>

```text
pub fn normalize_path(path: &Path) -> PathBuf {
    let mut out = PathBuf::new();
    for component in path.components() {
        match component {
            Component::CurDir => {}
            Component::ParentDir => {
                out.pop();
            }
            other => out.push(other.as_os_str()),
        }
    }
    out
}

pub fn resolve_with_cwd(path: &Path, cwd: &Path) -> PathBuf {
    if path.is_absolute() {
        normalize_path(path)
    } else {
        normalize_path(&cwd.join(path))
    }
}

/// True when `target` is the cwd or a path under it (not a sibling prefix).
pub fn is_inside_cwd(target: &Path, cwd: &str) -> bool {
    if cwd.is_empty() {
        return false;
    }
    let resolved = resolve_with_cwd(target, Path::new(cwd));
    let root = normalize_path(Path::new(cwd));
    if resolved == root {
        return true;
    }
    let mut rest = resolved.components();
    for component in root.components() {
        match rest.next() {
            Some(next) if next == component => {}
            _ => return false,
        }
    }
    true
}

pub fn read_text_file(
    path: &Path,
    line: Option<u32>,
    limit: Option<u32>,
) -> Result<String, AcpError> {
    let text = std::fs::read_to_string(path).map_err(io_err)?;
    Ok(slice_text(&text, line, limit))
}

pub fn write_text_file(path: &Path, content: &str) -> Result<(), AcpError> {
    if let Some(parent) = path.parent() {
        if !parent.as_os_str().is_empty() {
            std::fs::create_dir_all(parent).map_err(io_err)?;
        }
    }
    std::fs::write(path, content).map_err(io_err)
}
```

</details>

**依据 6 · 源码核查**：[src/acp.rs:2465-2492](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/acp.rs#L2465-L2492)

写请求内/外门控接线。

<details>
<summary>查看原文（28行）</summary>

```text
        .on_receive_request(
            {
                let bus = bus_write;
                let workspace = workspace_write;
                async move |req: WriteTextFileRequest, responder, _cx| {
                    let session_id = req.session_id.to_string();
                    let path = crate::acp_fs::resolve_with_cwd(
                        &req.path,
                        std::path::Path::new(&workspace),
                    );
                    let content = req.content;
                    let bus = bus.clone();
                    let workspace = workspace.clone();
                    tokio::spawn(async move {
                        let allowed = if crate::acp_fs::is_inside_cwd(&path, &workspace) {
                            true
                        } else {
                            crate::acp_fs::confirm_write_outside(&bus, &session_id, &path).await
                        };
                        let result = if allowed {
                            crate::acp_fs::write_text_file(&path, &content)
                                .map(|_| WriteTextFileResponse::new())
                        } else {
                            Err(crate::acp_fs::denied_write())
                        };
                        match result {
                            Ok(resp) => {
                                let _ = responder.respond(resp);
```

</details>

**依据 7 · 源码核查**：[src/acp.rs:2524-2556](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/acp.rs#L2524-L2556)

本地terminal创建前询问。

<details>
<summary>查看原文（33行）</summary>

```text
                    let output_byte_limit = req.output_byte_limit;
                    let bus = bus.clone();
                    let workspace = workspace_create.clone();
                    tokio::spawn(async move {
                        let resolved_cwd = cwd
                            .map(|c| {
                                crate::acp_fs::resolve_with_cwd(
                                    &c,
                                    std::path::Path::new(&workspace),
                                )
                            })
                            .unwrap_or_else(|| workspace.clone().into());
                        let allowed = crate::acp_fs::confirm_terminal_spawn(
                            &bus,
                            &session_id,
                            &command,
                            &args,
                            &resolved_cwd,
                        )
                        .await;
                        let result = if allowed {
                            terms.create(
                                &command,
                                &args,
                                Some(resolved_cwd),
                                &env,
                                output_byte_limit,
                            )
                        } else {
                            Err("user denied createTerminal".to_string())
                        };
                        match result {
                            Ok(id) => responder.respond(CreateTerminalResponse::new(id)),
```

</details>

#### 缺口

- 恶意插件隔离、symlink利用及所有本地shell/附件路径未全审
  **影响**：不建议不可信agent/插件或敏感宿主直用
  **进一步探讨**：可丢弃目录核外路径/外链/拒绝terminal/插件卸载后副作用，限定agent信任

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、首次/持续/失败与退出成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

终端交互依原生二进制、合适TTY/图像与剪贴板能力；Cargo源码需Rust依赖，常规分发借npm Node>=22.19和平台包。默认ACP/DSH另有模型凭据/认证与网络费用，其他agent特性和session恢复能力需逐项核。Node/Rust/Host进程边界减少共享状态，但带来stderr、协议、TTY和子进程多处故障；不是只换一个主题即可无成本迁移。

首次成本是装平台包/agent、选cwd、核权限与无副作用prompt；持续为渲染/日志、模型tokens、工具计算及多连接进程，金额与效率收益未知。!cmd等本地执行、文件写、图片外发均有业务副作用；模型permission模式不自动对所有本地能力降权。失败时先查agent stderr/连接与真实外部结果，再决定resume/重试，不在取消未知时重复不可逆动作。

main进入raw/alternate屏并装panic hook恢复TTY，正常退出发Shutdown、restore_terminal并stderr打印session id；这证明有清理路径，不证明所有SIGKILL/终端崩溃场景可恢复或远端执行停止。若显示失控应先退出并人工恢复终端，保存session id，回原agent核状态；不要删除持久会话/插件配置当作修复。

#### 证据与依据

**依据 1 · 源码核查**：[Cargo.toml:13-36](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/Cargo.toml#L13-L36)

原生终端/ACP依赖。

<details>
<summary>查看原文（24行）</summary>

```text
anyhow = "1"
libc = "0.2"
signal-hook = "0.3"
crossterm = "0.29"
ratatui = { version = "0.30.2", features = ["unstable-widget-ref"] }
ratatui-explorer = "0.3"
ratatui-textarea = "0.9.2"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
ruzstd = "0.8"
unicode-segmentation = "1"
unicode-width = "0.2"
tui-markdown = { version = "0.3.9", default-features = false }
pulldown-cmark = { version = "0.13.4", default-features = false }
tui-tree-widget = "0.24"
agent-client-protocol = { version = "2.0.0", features = ["unstable_auth_methods", "unstable_elicitation", "unstable_end_turn_token_usage", "unstable_session_fork"] }
tokio = { version = "1.53.1", features = ["rt-multi-thread", "macros", "io-util", "fs", "net", "time", "sync"] }
tokio-util = { version = "0.7.19", features = ["compat"] }
futures = "0.3.34"
image = { version = "0.25", default-features = false, features = ["png"] }

[dev-dependencies]
tokio = { version = "1.53.1", features = ["test-util"] }

```

</details>

**依据 2 · 源码核查**：[npm/package.json:79-101](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/npm/package.json#L79-L101)

Node/DSH声明与依赖。

<details>
<summary>查看原文（23行）</summary>

```text
    "@openma/common": "^0.9.2",
    "@openma/deepseek-harness-acp": "0.4.39",
    "@resvg/resvg-js": "2.6.2",
    "cross-spawn": "^7.0.6",
    "node-downloader-helper": "2.1.11",
    "semver": "^7.8.5"
  },
  "devDependencies": {
    "@deepseek-ai/dsh": "0.2.0-rc.2"
  },
  "engines": {
    "node": ">=22.19.0",
    "dsh": ">=0.1.7-rc.2"
  },
  "keywords": [
    "deepseek",
    "harness",
    "tui",
    "agent",
    "acp",
    "agent-client-protocol"
  ]
}
```

</details>

**依据 3 · 源码核查**：[src/main.rs:546-568](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/main.rs#L546-L568)

TTY进入与panic清理。

<details>
<summary>查看原文（23行）</summary>

```text

    // terminal guard
    enter_tui()?;
    let prev_hook = std::panic::take_hook();
    std::panic::set_hook(Box::new(move |info| {
        restore_terminal();
        prev_hook(info);
    }));

    let backend = ratatui::backend::CrosstermBackend::new(std::io::stdout());
    let mut terminal = ratatui::Terminal::new(backend)?;

    if let Ok(auto) = std::env::var("DSH_TUI_AUTOPROMPT") {
        if !auto.trim().is_empty() {
            app.auto_prompt(&auto, &controller);
        }
    }
    // ACP commands for the slash menu; demo serves samples.
    controller.send(bus::Cmd::FetchSkills {
        session_id: app.session_id.clone(),
    });

    // Test hook: DSH_TUI_TEST_PANIC panics after the panic hook is
```

</details>

**依据 4 · 源码核查**：[src/main.rs:699-706](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/main.rs#L699-L706)

Shutdown、恢复与打印session。

```text

    controller.send(Cmd::Shutdown);
    restore_terminal();
    // Out-of-band (stderr, never the ACP stdout channel): let the caller
    // grab the live session id for `--session-id` resume.
    if !app.demo {
        eprintln!("session {}", app.session_id);
    }
```

#### 缺口

- 跨平台TTY、进程退出和实际时间/费用未测
  **影响**：需保原CLI与手工救援，不能称即装成熟替代
  **进一步探讨**：无敏感任务测启动/权限/取消/退出，记录原agent结果与TTY恢复

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些机制可迁移，如何验证采用假设？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可迁移的是每会话调度/控制分lane、带generation的完成事件、取消请求与真实结束分开、UI贡献归属fiber以及协议协商后才用扩展。观察适合愿意维护终端和可信agent/插件的开发者，先固定一个Harness和副本cwd试普通文本，不默认启用自动插件创建或敏感文件操作；然后核两tab配置、队列、cancel竞态、resume和拒绝本地终端。出现串会话、配置回退、拒绝后仍写入或远端结果未知时停用对应路径，回原生CLI/手工检查，不以漂亮回显作为成功。

未实现方向是“本地能力收据与可撤销预算”：client fs/terminal通过真实路径解析、按会话显式授权和操作id记录结果，取消时返回尚在运行/未知而非仅UI结束。最小对照加入symlink、权限拒绝、agent假报完成、取消后写入、关闭重绑与旧回调；衡量错投/错误成功、合法误拒和新增交互，不声称已实现沙盒。若需要持续高频批准且任务完成更差，或收据仍无法覆盖agent自身执行，就不支持把它当统一安全层。

#### 证据与依据

**依据 1 · 源码核查**：[src/acp.rs:3990-4045](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/acp.rs#L3990-L4045)

generation与真实cancel结果为参照。

<details>
<summary>查看原文（56行）</summary>

```text
                        finish = prompt_done_rx.recv() => {
                            let _ = finish.map(|done| {
                            let key = done.session_id.clone();
                            // A session closed with `/close` (ForgetSession)
                            // while its prompt was in flight: the turn ends
                            // here — its UI events would be foreign on every
                            // tab, and an auth error must not park a retry
                            // for a session nobody views. Drop the finish.
                            let Some(handle) = sessions.get_mut(&key) else {
                                return;
                            };
                            // Stale finish (the session was forgotten and
                            // re-bound; a new turn owns the handle now):
                            // clear nothing — the new turn's occupancy
                            // marker must survive a late old finish.
                            if handle.inflight.as_ref().map(|(gen, _)| *gen) != Some(done.gen) {
                                return;
                            }
                            handle.inflight = None;
                            let aborted = std::mem::take(&mut handle.turn_aborted);
                            // `session/cancel` can race an already-settling
                            // turn: trust the agent's stop reason. A real
                            // interruption surfaces as `Cancelled` (or an
                            // error); a turn that completed despite the
                            // cancel still reports its own result.
                            let agent_cancelled = matches!(
                                &done.result,
                                Ok(response) if matches!(
                                    response.stop_reason,
                                    agent_client_protocol::schema::v1::StopReason::Cancelled
                                )
                            );
                            if aborted && (done.result.is_err() || agent_cancelled) {
                                let _ = bus.send(AppEvent::Ui(
                                    crate::events::UiEvent::TurnEnd {
                                        session: key.clone(),
                                        kind: "interrupted".into(),
                                    },
                                ));
                                let _ = bus.send(AppEvent::Ctl(CtlEvent::Interrupted {
                                    session_id: key.clone(),
                                }));
                            } else {
                                let ok = matches!(done.result, Ok(_));
                                let provider = auth_provider(&surface, Some(&done.session_id));
                                apply_prompt_finish(
                                    done,
                                    &mut sessions,
                                    &mut parked,
                                    &bus,
                                    &methods,
                                    provider.as_deref(),
                                );
                                if ok && !parked.is_empty() {
                                    // A success proves its provider is
                                    // credentialed — credit it so a
```

</details>

**依据 2 · 源码核查**：[src/acp_fs.rs:49-85](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/acp_fs.rs#L49-L85)

本地路径/读写政策为假设基线。

<details>
<summary>查看原文（37行）</summary>

```text
/// True when `target` is the cwd or a path under it (not a sibling prefix).
pub fn is_inside_cwd(target: &Path, cwd: &str) -> bool {
    if cwd.is_empty() {
        return false;
    }
    let resolved = resolve_with_cwd(target, Path::new(cwd));
    let root = normalize_path(Path::new(cwd));
    if resolved == root {
        return true;
    }
    let mut rest = resolved.components();
    for component in root.components() {
        match rest.next() {
            Some(next) if next == component => {}
            _ => return false,
        }
    }
    true
}

pub fn read_text_file(
    path: &Path,
    line: Option<u32>,
    limit: Option<u32>,
) -> Result<String, AcpError> {
    let text = std::fs::read_to_string(path).map_err(io_err)?;
    Ok(slice_text(&text, line, limit))
}

pub fn write_text_file(path: &Path, content: &str) -> Result<(), AcpError> {
    if let Some(parent) = path.parent() {
        if !parent.as_os_str().is_empty() {
            std::fs::create_dir_all(parent).map_err(io_err)?;
        }
    }
    std::fs::write(path, content).map_err(io_err)
}
```

</details>

**依据 3 · 源码核查**：[src/main.rs:699-706](https://github.com/openma-ai/Martty/blob/b4dbfa05a049e0cd9410435c1e98bd29446cac3c/src/main.rs#L699-L706)

退出保session用于人工救援。

```text

    controller.send(Cmd::Shutdown);
    restore_terminal();
    // Out-of-band (stderr, never the ACP stdout channel): let the caller
    // grab the live session id for `--session-id` resume.
    if !app.demo {
        eprintln!("session {}", app.session_id);
    }
```

#### 缺口

- 真实用户任务改善与统一收据覆盖性未验
  **影响**：假设不提高当前能力/成熟度
  **进一步探讨**：对照原CLI做含负向故障的同任务，失败退出并保日志

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
