# DSH Mobile

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[93a7910](https://github.com/sorsama/deepseek-harness-mobile/tree/93a79102f78a7afdb567aee7189cc7965955a1ba)

<!-- BEGIN META -->
[![GitHub ★ 242](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=242&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sorsama/deepseek-harness-mobile)
<!-- END META -->

> **功能**：通过 Android 原生客户端连接 DeepSeek Harness，跟进会话、回答问题、审批命令并接收任务通知。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持原生通知与远程待办接管的组合增量，特别是把认证、mux代次与回答eventId统一，避免把旧卡片和新请求混在一起。创新归于移动工作流与协议适配，不把Harness执行或relay服务器能力算本根原创。

> **主要限制**：[Q03](#research-q03) 安全文档与真实cookie路径存在冲突，直连cookie也不同于relay token的Keystore保护；手机登录仍获得工具能力，TLS不能缩小权限。[Q02](#research-q02) 载体失败虽称Unsent，却不证明远端未收到，用户仍须重连核待办，不能盲目再次批准。

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
  - [Q01 · 移动端续办任务相对原 Web 提供什么，真实类型是什么？](#detail-section-11)
  - [Q02 · 认证、重连与审批回答如何避免旧连接和模糊失败被当作成功？](#detail-section-12)
  - [Q03 · LAN、relay、Termux的权限与成本允许何种使用，文档矛盾如何处理？](#detail-section-13)
  - [Q04 · 作者验证能证明什么，断线回答的下一项假设如何证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有受控Harness与Android手机的开发者离开桌面后处理等待、审批和结果。原办法是移动Web或返回电脑；合格结果是正确会话上的及时响应与可确认接管，执行能力仍由宿主提供。

移动浏览器打开原生Web已能操作宿主；本项目增加Android原生界面、通知、连接generation与待办映射，不改变宿主编程能力和服务端权限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 原生通知与会话入口 | 离桌跟进完成和需动作 | Android权限／后台策略影响及时性 |
| 问题与审批回答 | eventId绑定当前generation提交 | 失败不自动重试；载体失败结果未知 |
| 多路径连接 | direct cookie或relay pin/token | relay独立服务；TLS不缩小shell权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Android8+与可信APK | 必需 | 客户端界面与通知 | 不能由源码打包推断签名升级成功 |
| 可达兼容Harness与模型 | 必需 | 实际Agent执行 | 手机不是离线推理替代 |
| 启动token／cookie | 非relay直连需要 | RPC与mux认证 | 401需重新登录，非Host错误 |
| 独立relay与配对pin/token | 公网relay路径需要 | 身份与加密 | 外仓未审；QR与TOFU信任不同 |
| Termux及命令权限 | 本机运行可选 | 启停手机Harness | 权限是Termux用户执行范围 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定APK／Harness，建非敏感工作区 | 首选USB或受控测试网络 |
| 登录 | 粘启动链接换cookie；relay另配对 | 核实际端点／pin，不信旧无认证文档 |
| 等待 | 开通知并验证锁屏事件 | 需动作通知可打开正确会话 |
| 回答 | 核请求后批准一次／拒绝 | 丢响应先重连核待办，不盲目重发 |
| 退出 | 停连接、忘记本地端点并服务端撤销 | 回Web／桌面；断连接不等取消任务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Android、宿主、可选relay／网络 | APK来源、版本、认证、通知配置 | 金额／工时未知 |
| 持续 | 模型推理、服务端、网络与电池 | 跟进结果、升级兼容与误批核对 | 未测比移动Web总收益 |
| 失败恢复 | 重连与重新配对 | 区分401/403/pin，核未知回答 | Unsent不证明未执行 |
| 退出 | 凭据和会话留存 | 本地清除加服务端撤销、收回暴露 | 客户端退出不终止远端任务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 离桌提醒 | 按设置和事件发原生通知 | 手机后台及时性和节时 |
| 审批正确定位 | generation/clientId/eventId及条件清卡 | 服务端旧代拒绝与丢响应真实行为 |
| 连接信任 | direct cookie与relay pin/token分路 | 服务端权限实现和跨版本兼容 |
| 作者验证 | 有固定alpha.2测试记录及跳过项 | 不等本轮当前设备／签名升级通过 |

> **思考**：[Q03](#research-q03) 安全文档与真实cookie路径存在冲突，直连cookie也不同于relay token的Keystore保护；手机登录仍获得工具能力，TLS不能缩小权限。[Q02](#research-q02) 载体失败虽称Unsent，却不证明远端未收到，用户仍须重连核待办，不能盲目再次批准。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持原生通知与远程待办接管的组合增量，特别是把认证、mux代次与回答eventId统一，避免把旧卡片和新请求混在一起。创新归于移动工作流与协议适配，不把Harness执行或relay服务器能力算本根原创。

[Q02](#research-q02) core协议与Android连接层分离，统一factory和ready代次、失败不重发、条件清卡处理真实远端时序问题。[Q03](#research-q03)文档认证描述漂移和直连cookie存储注释的loopback假设值得纠正，不能仅依据README宣称安全。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 安全文档与真实cookie路径存在冲突，直连cookie也不同于relay token的Keystore保护；手机登录仍获得工具能力，TLS不能缩小权限。[Q02](#research-q02) 载体失败虽称Unsent，却不证明远端未收到，用户仍须重连核待办，不能盲目再次批准。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先以USB／可信测试网和非敏感任务确认后台通知、待办重放与错误提示，保留桌面核对。公网前另审relay，丢回答响应先核当前待办；无法及时或明确确认便撤销凭据回原Web。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定Kotlin支持移动通知、凭据与generation回答机制；真实手机后台行为、当前服务端兼容和用户效果未由本轮验证。未知结果提示仅未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、app/src/main/java/com/labteto/dshmobile/connection/ConnectionManager.kt、app/src/main/java/com/labteto/dshmobile/connection/HarnessClientFactory.kt、app/src/main/java/com/labteto/dshmobile/connection/HarnessSessionStore.kt、app/src/main/java/com/labteto/dshmobile/connection/RelayCredentialStore.kt、app/src/main/java/com/labteto/dshmobile/data/SessionStore.kt、app/src/main/java/com/labteto/dshmobile/notify/NotificationObserver.kt、core/src/main/kotlin/com/labteto/dshmobile/core/wire/ConnectionLoop.kt、core/src/main/kotlin/com/labteto/dshmobile/core/wire/DshApiClient.kt、core/src/main/kotlin/com/labteto/dshmobile/core/wire/HarnessSession.kt、core/src/main/kotlin/com/labteto/dshmobile/core/wire/RelayTls.kt、docs/SECURITY.md、docs/VALIDATION-0.16.0.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根Android客户端source研究，定向核Kotlin认证、mux ready／重连、审批结果与凭据／通知，辅以作者验证原件。未完整审所有UI、终端、插件管理、附件／Termux脚本、relay服务器或Harness服务端；未运行目标。Kotlin由固定git blob补读，不将JS/TS统计当全仓规模。
- 下一步：[Q04](#research-q04)建议先验证丢响应／旧代／双端回答，以及锁屏、网络变化、撤销凭据；比较原移动Web同任务正确接管和总时间。本轮未执行，不把作者记录作本地测试。

**分析版本**

- **仓库**：[sorsama/deepseek-harness-mobile](https://github.com/sorsama/deepseek-harness-mobile)
- **版本号**：未声明（[固定提交 93a7910](https://github.com/sorsama/deepseek-harness-mobile/tree/93a79102f78a7afdb567aee7189cc7965955a1ba)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 从载体失败语义推导“宿主接受结果未知”的可见提示和待办核对入口，可能减少重复批准；尚未实现或试验。对照丢响应、旧generation和双端并发反例，重复操作不降或恢复投入增即否定。

[Q04](#research-q04)建议先验证丢响应／旧代／双端回答，以及锁屏、网络变化、撤销凭据；比较原移动Web同任务正确接管和总时间。本轮未执行，不把作者记录作本地测试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 24 | 5257 | — | — | 49004 |
| .js | source | 2 | 4 | 2 | 2 | — |
| .mjs | source | 2 | 481 | 358 | 94 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/sorsama/deepseek-harness-mobile/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/sorsama/deepseek-harness-mobile/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/sorsama/deepseek-harness-mobile/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Android续办编码任务、认证／重连／审批语义及权限成本，区分作者测试和本轮源码证据。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 移动端续办任务相对原 Web 提供什么，真实类型是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH Mobile 是非官方 Android 客户端，不是加载进 DSH 的插件。目标是已经在电脑运行编码 Agent、离开桌面后仍需跟进长任务的开发者；原办法是回桌面或用手机浏览器打开宿主 Web。合格交付是及时看见等待／结果、在正确会话回答与审批并回到主任务，而非仅显示远程文本。原生界面、Android 通知和连接管理让用户少在浏览器页面中找状态；执行、模型能力、文件权限和审批语义仍来自远端 Harness。

README 提到会话、目标、后台工作、子 Agent、终端、插件管理等广泛入口，本研究不将全部清单当成已验能力。重点核实通知触发、连接认证与回答待办链：NotificationObserver 按完成／目标／需动作事件和用户设置发通知，已打开当前会话时抑制重复提醒，通知本身打开会话而非直接授权命令。这是成熟移动通知与宿主协议的整合，不能把宿主已有自主编程算客户端创新。是否真比移动 Web 更及时、更少错批，仍无本轮用户数据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-34](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/README.md#L28-L34)

作者给出桌面开始、手机续办、非官方客户端和外部Harness前提。

```text
The DeepSeek Harness is an AI coding agent that runs on your computer and has a web interface.
DSH Mobile connects to that harness and gives you the same controls in a native Android app. You can
start a task at your desk, then follow it, answer its questions and approve its commands from
your phone.

This is an unofficial, community-built app. It needs a harness running somewhere it can reach: on
your computer, or on the phone itself through Termux.
```

**依据 2 · 作者声明**：[README.md:51-67](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/README.md#L51-L67)

作者列举移动任务入口，不能一并认作运行验收。

<details>
<summary>查看原文（17行）</summary>

```text
## What you can do

- Chat with the agent. Replies stream in with their reasoning, code blocks and tool calls. You
  can attach photos and files, reference files with `@`, and run commands and skills with `/`.
- Press and hold a message, a tool call or a file to see what else you can do with it. Copy
  it, fix a message you sent and send it again, or mention a file in your next message.
- Answer what the agent needs from you: approve or reject a command, answer its questions, and
  review a plan before it starts.
- Keep an eye on long work. Goals, todo lists, queued messages, background jobs and subagents
  each have their own view, and you can pause, steer or stop them.
- Get a notification when a turn finishes, a goal completes or gets blocked, or the agent is
  waiting for an answer. The connection stays up in the background.
- Browse and preview the workspace files, and open a terminal on the harness computer.
- Manage the harness itself: models, agent presets, plugins, scheduled tasks and archived
  sessions.
- Use the app in English, Chinese, Hindi, Spanish, French, Arabic, Bengali, Portuguese,
  Russian, Urdu or Thai. Right-to-left languages are supported.
```

</details>

**依据 3 · 源码核查**：[app/src/main/java/com/labteto/dshmobile/notify/NotificationObserver.kt:143-198](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/app/src/main/java/com/labteto/dshmobile/notify/NotificationObserver.kt#L143-L198)

通知权限、前台抑制、事件设置、去重和打开会话接线。

<details>
<summary>查看原文（56行）</summary>

```text
    private fun maybeNotify(event: CompletionEvent) {
        if (!notifications.canPost()) return
        // Suppress only the completion the user can already see happening.
        if (appInForeground && store.isSessionOpen(event.sessionId)) return

        val spec = when (event) {
            is CompletionEvent.TurnComplete -> {
                if (!settings.notifyTurnComplete) return
                Spec(
                    channel = DshNotifications.CHANNEL_COMPLETIONS,
                    title = context.getString(R.string.notif_turn_complete, sessionTitle(event.sessionId).orEmpty()),
                )
            }
            is CompletionEvent.GoalComplete -> {
                if (!settings.notifyGoal) return
                Spec(
                    channel = DshNotifications.CHANNEL_COMPLETIONS,
                    title = context.getString(R.string.notif_goal_complete, event.objective.orEmpty()),
                )
            }
            is CompletionEvent.GoalBlocked -> {
                if (!settings.notifyGoal) return
                Spec(
                    channel = DshNotifications.CHANNEL_COMPLETIONS,
                    title = context.getString(R.string.notif_goal_blocked, event.reason.orEmpty()),
                )
            }
            is CompletionEvent.ReviewRequested -> {
                if (!settings.notifyNeedsAction) return
                Spec(
                    channel = DshNotifications.CHANNEL_ACTION,
                    title = context.getString(R.string.notif_review_requested, event.toolName),
                    actionLabel = context.getString(R.string.notif_open),
                )
            }
            is CompletionEvent.QuestionRequested -> {
                if (!settings.notifyNeedsAction) return
                Spec(
                    channel = DshNotifications.CHANNEL_ACTION,
                    title = context.getString(R.string.notif_question, event.firstQuestion.orEmpty()),
                )
            }
            is CompletionEvent.SessionIdle -> {
                if (!settings.notifyTurnComplete) return
                Spec(
                    channel = DshNotifications.CHANNEL_COMPLETIONS,
                    title = context.getString(R.string.notif_session_idle, sessionTitle(event.sessionId).orEmpty()),
                )
            }
        }

        if (isDuplicate(event.dedupKey)) return

        val text = context.getString(R.string.notif_open)
        val id = notificationId(event.sessionId, spec.channel)
        notifications.postSession(spec.channel, id, spec.title, text, event.sessionId, spec.actionLabel)
```

</details>

#### 缺口

- 与手机Web相同任务的响应时间、误批和完成率未对照。
  **影响**：不能量化移动原生增量或用户持续需求。
  **进一步探讨**：固定同一宿主和任务，用原Web与客户端比较等待处理及正确审批总时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 认证、重连与审批回答如何避免旧连接和模糊失败被当作成功？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

直连先在根路径以启动token换取dsh-auth- cookie，交换不跟重定向，从Set-Cookie取name=value；relay走单独bearer和证书pin。HarnessClientFactory统一创建unary和mux，两者使用同一HTTP信任设置与对应credential，避免只给RPC认证而WebSocket漏凭据。其cookieFor条件是非relay，不只loopback，包含LAN直连。这里能证明客户端发何种认证，不能单独证明远端服务真正拒绝未认证者。

ConnectionLoop以remote.mux打开并收到$events ready为connected，记录clientId，断线关闭这一代mux并指数退避；3秒mux与5秒ready为不同失败预算。必须收到ready，任意其他首帧都不是连接成功。ConnectionManager对relay的trust fence、pin变化、未认证停止自动重试并保留错误，让用户重新配对或修复relay。

SessionStore审批先核本地待办与当前generation，构造ALLOWED_ONCE或REJECTED，再以clientId、eventId回答。DshApiClient按args封装$events/result，不自动重发失败答案；SessionStore区分宿主ok:false拒绝和载体失败，只有确实结束请求才清相应卡片，避免新问题被旧回答清走。旧代回答能否被宿主拒绝仍是协议依赖，客户端代码不能替宿主证明exactly-once。Transport失败命名Unsent也不能解释为远端未收到／未执行；应重连查询当前待办，不盲目重新批准。断开App或socket只是客户端退出，不是远端任务取消；停止任务需要单独宿主控制和结果确认。

#### 证据与依据

**依据 1 · 源码核查**：[core/src/main/kotlin/com/labteto/dshmobile/core/wire/HarnessSession.kt:56-82](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/core/src/main/kotlin/com/labteto/dshmobile/core/wire/HarnessSession.kt#L56-L82)

根路径token交换、不跟重定向与cookie抽取。

<details>
<summary>查看原文（27行）</summary>

```text
    suspend fun exchange(
        baseUrl: String,
        token: String,
        client: OkHttpClient,
        timeoutMs: Long = 10_000,
    ): SessionExchange = withContext(Dispatchers.IO) {
        val exchanger = client.newBuilder()
            .followRedirects(false)
            .followSslRedirects(false)
            .connectTimeout(timeoutMs, TimeUnit.MILLISECONDS)
            .readTimeout(timeoutMs, TimeUnit.MILLISECONDS)
            .build()
        val url = resolveHarnessUrl(baseUrl, "/").newBuilder().addQueryParameter("token", token).build()
        val request = Request.Builder().url(url).get().build()
        try {
            exchanger.newCall(request).execute().use { response ->
                val cookie = response.headers("Set-Cookie")
                    .firstOrNull { it.startsWith(COOKIE_PREFIX) }
                    // Only the name=value pair travels back; `Path`, `HttpOnly` and `SameSite`
                    // are instructions to a browser, and repeating them on a request would be
                    // sending the server its own directives.
                    ?.substringBefore(';')
                if (cookie != null) SessionExchange.Granted(cookie) else SessionExchange.Refused(response.code)
            }
        } catch (e: IOException) {
            SessionExchange.Unreachable(TransportFailures.classify(e), e.message)
        }
```

</details>

**依据 2 · 源码核查**：[app/src/main/java/com/labteto/dshmobile/connection/HarnessClientFactory.kt:48-102](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/app/src/main/java/com/labteto/dshmobile/connection/HarnessClientFactory.kt#L48-L102)

认证／pin统一构建，非relay cookie同时用于RPC与mux。

<details>
<summary>查看原文（55行）</summary>

```text
    fun httpClient(fingerprint: String?): OkHttpClient =
        if (fingerprint == null) okHttpClient
        else pinned.getOrPut(fingerprint) { RelayTls.pinnedClient(okHttpClient, fingerprint) }

    /** The `Authorization` value for [config], or null when it is not a paired relay. */
    suspend fun authorizationFor(config: HostConfig): String? =
        if (config.isRelay) credentials.authorization(config.id) else null

    /**
     * The harness browser session for [config], or null.
     *
     * Only for a direct connection. Behind a relay the relay holds the harness session and
     * injects it upstream, so sending one from here would put the host's own credential on the
     * network — and the relay strips the header anyway.
     */
    private suspend fun cookieFor(config: HostConfig): String? =
        if (config.isRelay) null else sessions.cookie(config.id)

    /**
     * A client for [config], carrying whatever credential and pin that endpoint needs.
     *
     * [timeouts] is for probes; the live connection takes the transport's own 30s defaults, because
     * a long `session/page` on a big session is not a stalled request.
     */
    suspend fun clientFor(config: HostConfig, timeouts: ProbeTimeouts? = null): DshApiClient {
        val http = httpClient(config.relayFingerprint)
        val authorization = authorizationFor(config)
        val base = config.baseUrl
        return DshApiClient(
            transport = OkHttpRpcTransport(
                baseUrl = base,
                client = http,
                connectTimeoutMs = timeouts?.connectMs ?: DEFAULT_TIMEOUT_MS,
                readTimeoutMs = timeouts?.readMs ?: DEFAULT_TIMEOUT_MS,
                authorization = authorization,
                cookie = cookieFor(config),
            ),
        )
    }

    /**
     * The mux carrying every stream of one connection generation.
     *
     * Separate from [clientFor] because its lifetime is the generation's, not the client's: the
     * connection loop builds a new one per attempt and closes it when the generation ends, while
     * the unary client outlives both.
     */
    suspend fun muxFor(config: HostConfig): RemoteStreamMux {
        val http = httpClient(config.relayFingerprint)
        val authorization = authorizationFor(config)
        val base = config.baseUrl
        val cookie = cookieFor(config)
        return RemoteStreamMux { sink ->
            WsChannel(com.labteto.dshmobile.core.wire.resolveHarnessUrl(base, REMOTE_STREAM_MUX_PATH).toString(), http, sink, authorization, cookie)
        }
```

</details>

**依据 3 · 源码核查**：[core/src/main/kotlin/com/labteto/dshmobile/core/wire/ConnectionLoop.kt:183-205](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/core/src/main/kotlin/com/labteto/dshmobile/core/wire/ConnectionLoop.kt#L183-L205)

一代连接消费、关闭和退避循环。

<details>
<summary>查看原文（23行）</summary>

```text
    private suspend fun runLoop() {
        var attempt = 0
        while (currentCoroutineContext().isActive) {
            safeSink { sinks.onStateChange(ConnectionState.RECONNECTING) }
            when (val opened = openGeneration()) {
                is Opened.Ok -> {
                    attempt = 0
                    safeSink { sinks.onConnected(opened.generation) }
                    safeSink { sinks.onStateChange(ConnectionState.CONNECTED) }
                    consumeEvents(opened.events)
                    closeGeneration()
                }

                is Opened.Failed -> {
                    attempt += 1
                    val reported = attempt
                    closeGeneration()
                    safeSink { sinks.onGenerationFailed(reported, opened.failure) }
                }
            }
            if (!currentCoroutineContext().isActive) break
            config.delay(nextBackoff(attempt))
        }
```

</details>

**依据 4 · 源码核查**：[core/src/main/kotlin/com/labteto/dshmobile/core/wire/ConnectionLoop.kt:222-287](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/core/src/main/kotlin/com/labteto/dshmobile/core/wire/ConnectionLoop.kt#L222-L287)

独立超时与ready/clientId必需。

<details>
<summary>查看原文（66行）</summary>

```text
    private suspend fun openGeneration(): Opened {
        safeSink { sinks.onHandshakeStep(HandshakeStep.OPENING_MUX) }
        val mux = muxFactory()
        current = mux
        mux.start()

        try {
            withTimeout(config.streamOpenTimeoutMs) { mux.awaitOpen() }
        } catch (e: TimeoutCancellationException) {
            return Opened.Failed(GenerationFailure.MuxTimedOut(config.streamOpenTimeoutMs))
        } catch (e: Throwable) {
            return Opened.Failed(
                GenerationFailure.MuxFailed(TransportFailures.classify(e), e.message),
            )
        }

        safeSink { sinks.onHandshakeStep(HandshakeStep.AWAITING_READY) }
        val events = try {
            mux.open(REMOTE_EVENT_STREAM_ENDPOINT)
        } catch (e: RemoteStreamException) {
            return Opened.Failed(GenerationFailure.ReadyFailed(e.error))
        }
        val ready = try {
            withTimeout(config.readyTimeoutMs) { events.receive() }
        } catch (e: TimeoutCancellationException) {
            return Opened.Failed(
                GenerationFailure.ReadyFailed(
                    RpcError("internal", "no ready frame within ${config.readyTimeoutMs}ms"),
                ),
            )
        } catch (e: RemoteStreamException) {
            return Opened.Failed(GenerationFailure.ReadyFailed(e.error))
        } catch (e: Throwable) {
            return Opened.Failed(
                GenerationFailure.ReadyFailed(RpcError("internal", e.message ?: "events stream failed")),
            )
        }

        if (ready == null) {
            return Opened.Failed(
                GenerationFailure.ReadyFailed(RpcError("internal", "events stream ended before it was ready")),
            )
        }
        val frame = decodeEventFrame(ready)
            ?: return Opened.Failed(
                GenerationFailure.ReadyFailed(RpcError("internal", "opening event frame did not parse")),
            )
        // A generation that opens on anything but `ready` is a protocol failure, not a frame to
        // skip: every later reply is bound to the clientId this frame carries, so without it
        // there is nothing to answer a waterfall with.
        if (frame !is RemoteEventFrame.Ready) {
            return Opened.Failed(
                GenerationFailure.ReadyFailed(
                    RpcError("internal", "events stream opened with \"${frame.type}\", not \"ready\""),
                ),
            )
        }

        return Opened.Ok(
            generation = HostGeneration(
                description = HostDescription(home = frame.host.home),
                clientId = frame.clientId,
                mux = mux,
            ),
            events = events,
        )
```

</details>

**依据 5 · 源码核查**：[app/src/main/java/com/labteto/dshmobile/connection/ConnectionManager.kt:219-259](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/app/src/main/java/com/labteto/dshmobile/connection/ConnectionManager.kt#L219-L259)

relay终结错误停止重试并保留原因。

<details>
<summary>查看原文（41行）</summary>

```text
     * Whether this failure means retrying is pointless against [host].
     *
     * The relay answers 403 for a missing, expired or revoked credential, and none of those come
     * back on their own — the client integration contract says so outright: "prompt to pair again,
     * do not retry with backoff". A changed certificate is the same kind of fact. The loop's default
     * is to retry forever, which against a relay that revoked this device is a request every few
     * seconds until the app is killed.
     */
    private fun isTerminalForRelay(host: HostConfig, failure: GenerationFailure): Boolean {
        if (!host.isRelay) return false
        val kind = when (failure) {
            is GenerationFailure.MuxFailed -> failure.kind
            is GenerationFailure.ReadyFailed -> TransportFailures.of(failure.error)
            is GenerationFailure.MuxTimedOut -> null
        }
        // UNAUTHENTICATED is terminal for a different reason. Behind a relay it is the harness
        // refusing the relay's own request, not this device's credential — but nothing the phone
        // retries will make the relay sign in; that takes a relay fixed on its own computer.
        return kind == TransportFailure.TRUST_FENCE ||
            kind == TransportFailure.CERTIFICATE_PIN ||
            kind == TransportFailure.UNAUTHENTICATED
    }

    /**
     * Stop the loop but keep the failure on screen.
     *
     * Not [disconnect]: that resets the whole state object, which would wipe the very explanation
     * the user needs in order to know that pairing again is the fix.
     */
    private fun stopRetrying() {
        loop?.stop()
        loop = null
        _state.value = _state.value.copy(
            phase = ConnectionPhase.DISCONNECTED,
            // Back to Idle, not left on whatever handshake step the last generation died at. The
            // connect screen derives "still connecting" from the stage, so a stage frozen mid-
            // handshake leaves the Connect button disabled with a spinner that will never finish —
            // which is precisely the failure this screen already learned once.
            stage = ConnectStage.Idle,
            attempts = 0,
        )
```

</details>

**依据 6 · 源码核查**：[app/src/main/java/com/labteto/dshmobile/data/SessionStore.kt:2018-2040](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/app/src/main/java/com/labteto/dshmobile/data/SessionStore.kt#L2018-L2040)

审批现有请求和generation绑定实际调用。

<details>
<summary>查看原文（23行）</summary>

```text
    suspend fun respondApproval(sessionId: String, approvalId: String, allow: Boolean): QuestionOutcome {
        val api = apiOrNull() ?: return QuestionOutcome.Unsent
        val request = synchronized(lock) { approvalRequests[approvalId] }
        if (request == null) {
            log("no pending approval for id $approvalId")
            // Nothing to answer with, so nothing can arrive to take the panel away either.
            if (_pendingApproval.value?.approvalId == approvalId) _pendingApproval.value = null
            return QuestionOutcome.Refused(NOT_PENDING)
        }
        val clientId = connectionManager.generation?.clientId
        if (clientId == null) {
            log("cannot answer approval $approvalId: no connection generation")
            return QuestionOutcome.Unsent
        }
        val outcome = if (allow) ApprovalOutcome.ALLOWED_ONCE else ApprovalOutcome.REJECTED
        // The waterfall's own return value *is* the outcome string, so this claims the request
        // with a bare value rather than the object 0.1.1 posted to /api/respond.
        val result = api.answerEvent(
            clientId = clientId,
            eventId = request.eventId,
            outcome = RemoteEventOutcome.Result(value = JsonPrimitive(outcome)),
        )
        return answerOutcome(result, "approval response", sessionId) { forgetRequest(request.eventId) }
```

</details>

**依据 7 · 源码核查**：[core/src/main/kotlin/com/labteto/dshmobile/core/wire/DshApiClient.kt:913-940](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/core/src/main/kotlin/com/labteto/dshmobile/core/wire/DshApiClient.kt#L913-L940)

回答args封装与不重试的协议契约。

<details>
<summary>查看原文（28行）</summary>

```text
     * Answer one pending Remote Event waterfall.
     *
     * This is what replaced `POST /api/respond`. The reply is bound to a generation by
     * [clientId] — from the current `$events` ready frame — and to one pending request by
     * [eventId]; the host refuses a reply carrying a retired generation, so an answer typed
     * before a reconnect cannot resolve a request the host has since replayed.
     *
     * A failure here is deliberately not retried: upstream fails the whole connection generation
     * on it and replays the pending event on the next one, so a client-side retry queue would
     * answer the same request twice.
     *
     * It goes through [call] like every other unary, and that is load-bearing rather than tidy:
     * the gateway reads `$events/result` as a Remote with one named parameter, so the three
     * fields ride inside `args` and a bare `{clientId, eventId, outcome}` payload is refused
     * outright — "Remote event result requires exactly one plain-object args field". Through
     * 0.11.2 this posted that bare object, so every answer and every approval failed on the
     * wire while the app reported it as a connection fault.
     */
    suspend fun answerEvent(
        clientId: String,
        eventId: String,
        outcome: RemoteEventOutcome,
    ): RpcResult<JsonElement> = call(
        REMOTE_EVENT_RESULT_ENDPOINT,
        encodeToJsonElement(
            RemoteEventResult.serializer(),
            RemoteEventResult(clientId = clientId, eventId = eventId, outcome = outcome),
        ).jsonObject,
```

</details>

**依据 8 · 源码核查**：[app/src/main/java/com/labteto/dshmobile/data/SessionStore.kt:2141-2165](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/app/src/main/java/com/labteto/dshmobile/data/SessionStore.kt#L2141-L2165)

接受、拒绝和载体未知区分，条件清卡。

<details>
<summary>查看原文（25行）</summary>

```text
    private fun answerOutcome(
        result: RpcResult<JsonElement>,
        what: String,
        sessionId: String,
        forget: () -> Unit,
    ): QuestionOutcome {
        val outcome = when (result) {
            is RpcResult.Ok -> QuestionOutcome.Accepted
            is RpcResult.Err -> {
                log("$what failed for $sessionId: ${result.error.code}: ${result.error.message}")
                // The split is "did the host answer at all", not a list of codes. A carrier failure
                // carries a [TransportFailure] marker and nothing is known about the wait; anything
                // else reached the host and came back `ok:false`, so the refusal is reported with
                // the host's own code. Folding those into [QuestionOutcome.Unsent] is what made a
                // malformed envelope read as "could not reach the harness" and sent reporters to
                // debug their network for a protocol fault.
                if (TransportFailures.of(result.error) != null) {
                    QuestionOutcome.Unsent
                } else {
                    QuestionOutcome.Refused(result.error.code)
                }
            }
        }
        if (settlesRequest(outcome)) forget()
        return outcome
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · LAN、relay、Termux的权限与成本允许何种使用，文档矛盾如何处理？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

使用者需Android8+、可达且兼容的Harness、模型服务与受控工作区；手机不是离线替代推理端。LAN／USB直连与公网relay是不同信任路径。固定README说LAN启动链接token登录，docs/SECURITY.md却说LAN无token/cookie；Q02的真实Kotlin token交换和cookie注入支持前者，后者不能再用作当前无认证判断。反向代理可加密，不能凭TLS就认定缩小shell权限；relay是外仓依赖，本研究未审其服务器实现。

RelayTls以SPKI key作为身份，pin不符无CA回退；QR先带pin，而手输code的首次接触走TOFU，可在错误端点建立初始信任。不能把hostnameVerifier返回true从上下文摘出当常规TLS全绕过，也不能把TOFU说成QR同等保证。RelayCredentialStore用Android Keystore加密token，但为锁屏重连不要求用户每次认证；解密失败删本地blob并需重新配对。直连HarnessSessionStore则把cookie明文存在App私有DataStore，注释以“仅loopback”为理由，但factory实际对所有非relay使用它，包含LAN。代码证明不同静态保护范围，不构成外部App可读该私有目录的漏洞实证。忘记本地host或清数据也不等服务端撤销，失窃需在relay端撤销设备／检查Harness会话。

Termux需额外App与run command权限和外部命令配置，等于授予Termux用户可执行范围，设备兼容未全覆盖；本轮不运行启动、下载或安装脚本。首次负担是APK来源、Harness版本、网络、认证与通知／电池策略，持续还有服务器推理、网络和升级兼容。金额与工时未知，不能写0。建议已有Android与受控Harness的维护者先用USB或可信测试网络非敏感任务验证通知、过期审批和重连；需公网才另验relay服务端。退出要撤销相应凭据、恢复绑定与网络暴露策略；原Web和桌面为退路。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:83-121](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/README.md#L83-L121)

作者分LAN token、relay、USB、Termux和HTTPS路径。

<details>
<summary>查看原文（39行）</summary>

````text
#### Same Wi-Fi as the computer

Start the harness on the computer's local network address. On
harness 0.2.1-alpha.2 and newer:

```sh
dsh web --host 192.168.1.20
```

Use your computer's real address instead of `192.168.1.20`. The harness prints a line like
`dsh web: http://192.168.1.20:3080/?token=…`. In the app, choose **Local network**, paste that
whole link into the address field (or tap the paste button), and tap **Connect**. The token in the
link signs the phone in, and the harness then appears under **Recent** for next time. Older harness
versions need a small patch instead of `--host`; see [`harness/README.md`](harness/README.md).

#### Away from home

Install [dsh-relay](https://github.com/sorsama/deepseek-harness-relay), a
harness plugin that adds a password, encryption and device pairing. Then choose **Relay** in the
app and scan the pairing QR code. The [Relay wiki page](https://github.com/sorsama/deepseek-harness-mobile/wiki/Relay)
walks through it.

#### USB cable or emulator

Run `dsh web` on the computer and `adb reverse tcp:3080 tcp:3080`. In
the app, choose **This phone** and sign in with the link `dsh web` printed.

#### On the phone itself

The harness can run in [Termux](https://f-droid.org/packages/com.termux/).
Choose **This phone**, and the app can start and stop the harness and sign in for you. Setting up
Node in Termux does not work on every device yet; read [`harness/TERMUX.md`](harness/TERMUX.md)
first.

#### Your own HTTPS reverse proxy

Paste its `https://` address in **Local network** mode. The proxy
encrypts the connection, but it does not check who is connecting. See
[`harness/README.md`](harness/README.md).
````

</details>

**依据 2 · 作者声明**：[README.md:130-145](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/README.md#L130-L145)

作者shell权限与兼容声明。

<details>
<summary>查看原文（16行）</summary>

```text
## Security

Read [docs/SECURITY.md](docs/SECURITY.md) before you connect over a network. A signed-in phone can
do anything the agent can do, and the agent runs commands on your computer. Treat signing in like
giving out shell access.

- Local network mode checks the sign-in token but does not encrypt anything. Use it only on a
  network you trust.
- Relay mode adds encryption and a pinned certificate, and works from outside your network.
- Keep the `dsh web` link private. Anyone who has it can sign in until the harness restarts.

## Compatibility

DSH Mobile is tested against **DeepSeek Harness 0.2.1-rc.2**. Older harness versions back to
0.1.6 still work for the most part, but newer features need a newer harness. The
[compatibility table](docs/COMPATIBILITY.md) lists which app version goes with which harness.
```

</details>

**依据 3 · 作者声明**：[docs/SECURITY.md:51-66](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/docs/SECURITY.md#L51-L66)

安全文档仍称LAN无token/cookie，与实际接线矛盾。

<details>
<summary>查看原文（16行）</summary>

```text

The harness web server (`dsh web`) serves plain HTTP with a *trust fence*, not
authentication:

- Every `/api` request is accepted only when its `Host` header is loopback or a
  configured trusted authority (LAN IP literals are auto-derived when the server
  binds `0.0.0.0`).
- There are no tokens, cookies, or TLS. Any device on the same network can send
  requests with a trusted `Host` and drive the agent — including running
  commands on the host computer. TLS can be added from outside by fronting the
  harness with a reverse proxy — see **HTTPS through a reverse proxy** below —
  but that encrypts the link without authenticating anyone; only a relay does
  both.

**Consequences:**

```

</details>

**依据 4 · 源码核查**：[core/src/main/kotlin/com/labteto/dshmobile/core/wire/RelayTls.kt:41-90](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/core/src/main/kotlin/com/labteto/dshmobile/core/wire/RelayTls.kt#L41-L90)

TOFU与pinned两种客户端身份边界。

<details>
<summary>查看原文（50行）</summary>

```text
    /**
     * A client that records the key it is offered and trusts it.
     *
     * This is trust on first use, and it is not a substitute for [pinnedClient]. It exists because
     * two of the relay's own flows cannot pin in advance:
     *
     * - **Passcode pairing.** The user reads a code off the relay's screen and types the address
     *   themselves; there is no QR, so there is no fingerprint until the claim answers with one.
     * - **Liveness probing.** Asking an address whether it is a relay happens before this device has
     *   any relationship with it at all.
     *
     * Neither sends a credential, and the claim that follows is a single-use code that is worthless
     * once consumed — but an attacker who can answer on that address during pairing does end up
     * holding the enrolment. That is a real difference from the QR flow and the UI has to say so
     * rather than let "paired" mean two different things.
     *
     * [observed] receives the presented key, so the caller can store the pin it actually spoke to.
     */
    fun trustOnFirstUseClient(base: OkHttpClient, observed: ObservedKey): OkHttpClient {
        val trustManager = LearningTrustManager(observed)
        val context = SSLContext.getInstance("TLS")
        context.init(null, arrayOf<javax.net.ssl.TrustManager>(trustManager), null)
        return base.newBuilder()
            .sslSocketFactory(context.socketFactory, trustManager)
            .hostnameVerifier(HostnameVerifier { _, _ -> true })
            .build()
    }

    /**
     * A client that trusts exactly one public key.
     *
     * The hostname verifier passes unconditionally, and that is not a hole: the trust manager has
     * already refused every certificate but the pinned one, so the key *is* the identity and the
     * SAN adds nothing. It matters in practice because the relay's generated certificate covers the
     * addresses it saw at generation time, and a phone may reach it by an address — a port-forwarded
     * name, a VPN address — that was never in that list.
     *
     * There is deliberately no fallback to CA validation when the pin misses. A relay whose key
     * changed is an event the user has to see, not one to paper over: it means either a
     * regenerated certificate (the plugin mints a new key whenever its address set changes) or
     * somebody else answering on that address.
     */
    fun pinnedClient(base: OkHttpClient, fingerprint: String): OkHttpClient {
        val trustManager = PinnedTrustManager(fingerprint)
        val context = SSLContext.getInstance("TLS")
        context.init(null, arrayOf<javax.net.ssl.TrustManager>(trustManager), null)
        return base.newBuilder()
            .sslSocketFactory(context.socketFactory, trustManager)
            .hostnameVerifier(HostnameVerifier { _, _ -> true })
            .build()
```

</details>

**依据 5 · 源码核查**：[core/src/main/kotlin/com/labteto/dshmobile/core/wire/RelayTls.kt:107-125](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/core/src/main/kotlin/com/labteto/dshmobile/core/wire/RelayTls.kt#L107-L125)

SPKI pin比对失败即拒绝。

<details>
<summary>查看原文（19行）</summary>

```text
private class PinnedTrustManager(private val fingerprint: String) : X509TrustManager {

    override fun checkServerTrusted(chain: Array<out X509Certificate>?, authType: String?) {
        val leaf = chain?.firstOrNull()
            ?: throw CertificateException("relay presented no certificate")
        val presented = RelayTls.spkiPin(leaf)
        // Constant-time is pointless here — the expected value is public, printed on the relay's own
        // pairing page — but a plain equality on two base64 strings is also the whole check, so it
        // is written out rather than hidden behind a helper.
        if (presented != fingerprint) throw PinMismatchException(fingerprint, presented)
    }

    /** This client never presents a certificate; the relay never asks for one. */
    override fun checkClientTrusted(chain: Array<out X509Certificate>?, authType: String?) {
        throw CertificateException("dsh-relay clients do not present certificates")
    }

    /** Empty on purpose: no issuer is acceptable, only the pinned leaf. */
    override fun getAcceptedIssuers(): Array<X509Certificate> = emptyArray()
```

</details>

**依据 6 · 源码核查**：[app/src/main/java/com/labteto/dshmobile/connection/RelayCredentialStore.kt:25-82](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/app/src/main/java/com/labteto/dshmobile/connection/RelayCredentialStore.kt#L25-L82)

Keystore、锁屏重连、解密失败和清本地凭据。

<details>
<summary>查看原文（58行）</summary>

```text
/**
 * Relay device tokens, encrypted at rest.
 *
 * A device token is not a session identifier that can be re-fetched — the relay shows it once, at
 * pairing, and stores only a keyed hash of it afterwards. It is also the whole credential, and
 * authenticating to a relay grants the same power as a shell on the machine running the harness,
 * because the agent runs commands there. So it is treated the way a password would be rather than
 * the way [HostConfig] is.
 *
 * The key lives in the `AndroidKeyStore` and never leaves it; only ciphertext reaches DataStore,
 * beside the remembered hosts. `androidx.security-crypto` would do the same wrapping, but it is
 * deprecated and would introduce a second persistence mechanism next to the one this app already
 * has, so the ~40 lines are written out instead.
 *
 * User authentication is deliberately *not* required on the key: the foreground service and
 * [KeepAliveWorker] reconnect while the screen is locked, and a key that needed a present user
 * would turn every background reconnect into a silent failure.
 */
@Singleton
class RelayCredentialStore @Inject constructor(
    private val dataStore: DataStore<Preferences>,
) {
    private val serializer = MapSerializer(String.serializer(), String.serializer())

    /** The bearer value for [hostId] — the full header, not the bare token — or null when unpaired. */
    suspend fun authorization(hostId: String): String? = token(hostId)?.let { "Bearer $it" }

    /**
     * The stored token for [hostId], or null when there is none this device can still read.
     *
     * A blob that will not decrypt is dropped rather than raised. That happens when the Keystore key
     * was invalidated — a full device restore, or the user removing every screen lock — and the
     * result is the same terminal state as a revoked token: this device has no credential and has to
     * pair again. Reporting it as an error would only offer the user a choice they do not have.
     */
    suspend fun token(hostId: String): String? {
        val blob = blobs()[hostId] ?: return null
        val plain = withContext(Dispatchers.Default) { runCatching { decrypt(blob) }.getOrNull() }
        if (plain == null) remove(hostId)
        return plain
    }

    /** Remember [token] for [hostId], replacing any previous one. */
    suspend fun put(hostId: String, token: String) {
        val blob = withContext(Dispatchers.Default) { encrypt(token) }
        write(blobs() + (hostId to blob))
    }

    /** Forget the credential for [hostId]. Safe to call when there is none. */
    suspend fun remove(hostId: String) {
        val current = blobs()
        if (hostId !in current) return
        write(current - hostId)
    }

    /** Forget every credential — the Settings "clear data" action, and a signed-out-everywhere relay. */
    suspend fun clear() {
        dataStore.edit { it.remove(KEY) }
```

</details>

**依据 7 · 源码核查**：[app/src/main/java/com/labteto/dshmobile/connection/HarnessSessionStore.kt:17-33](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/app/src/main/java/com/labteto/dshmobile/connection/HarnessSessionStore.kt#L17-L33)

直连cookie未加密理由与持久化说明。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Harness browser sessions, one per host.
 *
 * Harness 0.1.2 answers 401 to every `/api` request without one, so a direct connection cannot do
 * anything at all until this store holds a cookie for that host. The cookie is obtained once, by
 * exchanging the launch token the harness prints at startup, and survives harness restarts — the
 * signing secret is durable upstream even though the token itself rotates.
 *
 * Deliberately *not* encrypted at rest, unlike [RelayCredentialStore]. That store guards a relay
 * device token, which is a credential for reaching a machine across a network. This one guards a
 * loopback harness session — the app only ever holds one for a host it reaches directly, over
 * `adb reverse` or on the device itself — and on that path anything able to read this app's
 * DataStore is already running as the user whose harness it is. Encrypting it would suggest a
 * boundary that is not there.
 *
 * Behind a relay this store stays empty: the relay holds the harness session and injects it
 * upstream, and the phone never carries the host's cookie across the network.
```

</details>

**依据 8 · 源码核查**：[app/src/main/java/com/labteto/dshmobile/connection/HarnessSessionStore.kt:42-83](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/app/src/main/java/com/labteto/dshmobile/connection/HarnessSessionStore.kt#L42-L83)

cookie写入DataStore及清除，不是服务器撤销。

<details>
<summary>查看原文（42行）</summary>

```text
    /** The `Cookie` value for [hostId], or null when this device has no session for it. */
    suspend fun cookie(hostId: String): String? = sessions()[hostId]

    /**
     * Exchange [tokenInput] for a session and remember it.
     *
     * [tokenInput] may be the bare token, the whole `?token=…` URL, or the entire startup line the
     * harness printed — see [HarnessSession.tokenFrom].
     */
    suspend fun pair(hostId: String, baseUrl: String, tokenInput: String): SessionExchange {
        val token = HarnessSession.tokenFrom(tokenInput)
            ?: return SessionExchange.Refused(0)
        val outcome = HarnessSession.exchange(baseUrl, token, okHttpClient)
        if (outcome is SessionExchange.Granted) {
            write(sessions() + (hostId to outcome.cookie))
        }
        return outcome
    }

    /** Forget the session for [hostId]. Safe to call when there is none. */
    suspend fun remove(hostId: String) {
        val current = sessions()
        if (hostId !in current) return
        write(current - hostId)
    }

    /** Forget every session — the Settings "clear data" action. */
    suspend fun clear() {
        dataStore.edit { it.remove(KEY) }
    }

    private suspend fun sessions(): Map<String, String> {
        val raw = dataStore.data.first()[KEY] ?: return emptyMap()
        return runCatching { WireJson.decodeFromString(serializer, raw) }.getOrDefault(emptyMap())
    }

    private suspend fun write(next: Map<String, String>) {
        dataStore.edit { it[KEY] = WireJson.encodeToString(serializer, next) }
    }

    private companion object {
        val KEY = stringPreferencesKey("harness_sessions_json")
```

</details>

**依据 9 · 源码核查**：[app/src/main/java/com/labteto/dshmobile/connection/HarnessClientFactory.kt:56-64](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/app/src/main/java/com/labteto/dshmobile/connection/HarnessClientFactory.kt#L56-L64)

cookie路径实际按非relay划分。

```text
    /**
     * The harness browser session for [config], or null.
     *
     * Only for a direct connection. Behind a relay the relay holds the harness session and
     * injects it upstream, so sending one from here would put the host's own credential on the
     * network — and the relay strips the header anyway.
     */
    private suspend fun cookieFor(config: HostConfig): String? =
        if (config.isRelay) null else sessions.cookie(config.id)
```

**依据 10 · 作者声明**：[docs/SECURITY.md:24-44](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/docs/SECURITY.md#L24-L44)

作者Termux命令权限和opt-in范围。

<details>
<summary>查看原文（21行）</summary>

```text
Two things are new in this mode, both opt-in:

- **The app can run commands in Termux.** Start, Stop and Install via Termux go
  through Termux's `RunCommandService`, behind a permission Termux itself
  declares (*Run commands in Termux environment*). Granting it lets DSH Mobile
  run anything the Termux user can; the app asks for it only when Start, Stop or
  Install is tapped, never on launch, and runs nothing while it is in the
  background. What it runs is fixed and documented in
  [`harness/TERMUX.md`](../harness/TERMUX.md): a start script (wake lock,
  `dsh web --no-open --port …`, wait for the readiness line, print it back), a
  stop script that signals only the process it recorded, and a download script
  for updates. The scripts ship inside the app; nothing is installed in Termux,
  and the only values spliced into them are the port and the release URLs, both
  validated and quoted. Termux additionally requires `allow-external-apps = true`
  in its own `termux.properties` before it accepts any of this. Revoke the
  permission in Android's app settings to withdraw it all.
- **The launch token is read from the harness's own output.** Since harness
  0.1.2 a direct client must present the launch token the harness prints once per
  process. When the app starts the harness, it reads that line from the process
  it launched and exchanges the token at once — the same exchange it performs
  when you paste the line, with the same cookie stored in the same place. The
```

</details>

#### 缺口

- 真实设备后台保活、通知权限、电池策略和网络变化未执行。
  **影响**：可能无法及时看到等待，不能保证实时掌控。
  **进一步探讨**：固定手机／OS／宿主版本，锁屏、断网、转网和撤销凭据后核通知及错误。
- 当前relay服务端认证撤销与目标Harness签名cookie生命周期未审计。
  **影响**：客户端发凭据不证明服务器完整权限边界。
  **进一步探讨**：公网前独立核服务端版本、撤销、配对和限制，不直接暴露测试工作区。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 作者验证能证明什么，断线回答的下一项假设如何证伪？

**研究主题**：新假设与验证

#### 完整回答

作者0.16.0验证文档固定目标为Harness alpha.2特定提交，记录模拟器instrumentation和真实host conformance通过，也保留早期失败、工具链修复、live relay跳过以及签名升级尚需验证等限制。这些是可追溯的作者证据，不是本轮运行；README当前兼容声称0.2.1-rc.2，不能把较旧alpha.2结果直接当当前所有设备／服务端兼容证明。客户端接线和错误区分值得试用，不支持由单组作者测试推导生产远程审批安全或总节时。

从Q02载体失败不代表未接收可推导一个未验证方向：将“答案是否被宿主接受尚未知、正在重建待办”明确展示，比单说Unsent更可能减少用户重复批准。相对现有Accepted／Refused／Unsent分类，增量是用户可理解的结果未知提示与重新核待办入口，不是新重试队列。最小试验是在宿主已处理回答后丢失响应、旧generation回答和双端同时回答三种反例下，对比现有提示和明确未知提示，计重复操作、错误批准、恢复时间。若提示未降低重复操作，或导致用户更频繁手工重发／恢复更慢，则否定；不把此未来方向计为当前能力。

#### 证据与依据

**依据 1 · 作者声明**：[docs/VALIDATION-0.16.0.md:3-21](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/docs/VALIDATION-0.16.0.md#L3-L21)

作者验证固定alpha.2提交与目标版本。

<details>
<summary>查看原文（19行）</summary>

```text
## Target

- DeepSeek Harness `dsh-v0.2.1-alpha.2`, peeled commit
  `d743267388641bc76f17c45ce8b4c231aed1d32c`.
- Separate source worktree: `G:/LAB/deepseek-harness-alpha2`.
- Frozen install with the declared pnpm `11.28.5` and `build:lib` completed.
- Release target: `0.16.0`; publication has not been performed.
- Tests below ran before the version-only correction, with app version `0.15.0`.
  The corrected version derives versionCode `1600`; existing APKs must be rebuilt
  before release.

## Evidence so far

Before publication, merged remote main through `a10c80c` (including 0.15.0,
compact transcripts and Termux support). Reasoning translation now renders inside
the compact thinking panel. Full post-merge validation passed in one run:
core and mock tests, debug/release app unit tests, debug/release lint, release
assembly, all 30 Android instrumentation tests (zero failures/skips), and all
14 real-host conformance tests. Earlier totals below describe the pre-merge code.
```

</details>

**依据 2 · 作者声明**：[docs/VALIDATION-0.16.0.md:49-64](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/docs/VALIDATION-0.16.0.md#L49-L64)

live relay未新验、签名升级仍需验证。

<details>
<summary>查看原文（16行）</summary>

```text
## Release gate

JUnit report totals: core 265 tests, zero failures/skips; app debug and release
311 tests each, zero failures and three skipped live-relay conformance tests each.
Live relay compatibility has not been freshly verified in this run.

Pre-correction build metadata confirms `versionName=0.15.0`, `versionCode=1500` for both
`app/build/outputs/apk/debug/app-debug.apk` and
`app/build/outputs/apk/release/app-release-unsigned.apk`.

No local release-signing environment variables are configured. An unsigned release
build does not establish installability or upgrade compatibility with the published
app. Signed artifact verification and a signed upgrade installation remain required.
The release workflow now requires all signing secrets and verifies the APK signature.
GitHub has the four required signing secrets configured. It uploads a draft release
so the signed artifact can be upgrade-tested before publication.
```

</details>

**依据 3 · 源码核查**：[app/src/main/java/com/labteto/dshmobile/data/SessionStore.kt:2147-2165](https://github.com/sorsama/deepseek-harness-mobile/blob/93a79102f78a7afdb567aee7189cc7965955a1ba/app/src/main/java/com/labteto/dshmobile/data/SessionStore.kt#L2147-L2165)

载体失败映射Unsent且不等远端未收，为假设推导来源。

<details>
<summary>查看原文（19行）</summary>

```text
        val outcome = when (result) {
            is RpcResult.Ok -> QuestionOutcome.Accepted
            is RpcResult.Err -> {
                log("$what failed for $sessionId: ${result.error.code}: ${result.error.message}")
                // The split is "did the host answer at all", not a list of codes. A carrier failure
                // carries a [TransportFailure] marker and nothing is known about the wait; anything
                // else reached the host and came back `ok:false`, so the refusal is reported with
                // the host's own code. Folding those into [QuestionOutcome.Unsent] is what made a
                // malformed envelope read as "could not reach the harness" and sent reporters to
                // debug their network for a protocol fault.
                if (TransportFailures.of(result.error) != null) {
                    QuestionOutcome.Unsent
                } else {
                    QuestionOutcome.Refused(result.error.code)
                }
            }
        }
        if (settlesRequest(outcome)) forget()
        return outcome
```

</details>

#### 缺口

- 明确未知提示是否降低重复回答尚未试验。
  **影响**：未来设计不能宣称当前保证。
  **进一步探讨**：按三类网络／并发反例对照错误批准与恢复投入，无改善则放弃。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
