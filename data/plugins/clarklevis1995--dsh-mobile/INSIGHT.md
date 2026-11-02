# Whaleness · dsh-mobile

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[24f12c3](https://github.com/Clarklevis1995/dsh-mobile/tree/24f12c35aae2f368c7c158c3f5656da8560ced50)

<!-- BEGIN META -->
[![GitHub ★ 708](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=708&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Clarklevis1995/dsh-mobile)
<!-- END META -->

> **功能**：通过 Mobile Gateway 在 Android 与 iOS 原生界面访问 DSH 会话、工作区、审批和文件。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 共享请求状态、连接代际与历史/流式投影可供Android和iOS界面复用，形成移动接续方式。平台传输、Gateway执行与模型能力不由共享模块自动保证。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03) 排队或transport.send成功不是宿主业务完成，身份/关联检查也不能替代Gateway授权与去重。iOS后台并不无限保活，外部网关和原生平台链未核清使当前写操作建议受限。

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
  - [Q01 · 哪种移动任务值得独立客户端，实际条目类型是什么？](#detail-section-11)
  - [Q02 · 请求、连接身份与历史/流式投影怎样接线？](#detail-section-12)
  - [Q03 · 哪些平台、服务条件与恢复成本限制采用？](#detail-section-13)
  - [Q04 · 现有requestId与超时事件之上还有什么值得验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人DSH用户可在手机接续桌面会话、查看执行和响应审批；独立原生客户端依赖外置Gateway，合格结果仍需正确会话及宿主结果。

手机浏览器访问DSH是直接替代。共享业务规则与原生缓存/交互是候选增量，但未有同平台同任务效率对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 共享请求通道 | 管理排队、拒绝及关联响应 | 本地接受不等于宿主完成 |
| 双连接协调 | 分离控制与对话传输 | 需Gateway声明能力并核对身份 |
| 持久事件投影 | 从历史建立会话内容 | 序列必须前进 |
| 流式增量投影 | 更新同turn输出 | 需已有基线，缺失拒绝 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Android7+/iOS16.1+原生应用 | 必需，作者声明 | 手机UI与平台API | 实际设备兼容未验 |
| DSH及mobile-gateway>=0.11.1 | 必需，作者声明 | 桌面任务与移动协议 | 本客户端不能离线执行桌面任务 |
| 配对/长期凭据和网络 | 必需 | 认证与连接 | 身份不符停连，服务端边界未核清 |
| 官方语音插件及麦克风 | 语音时必需 | 宿主转写 | 未配置改用文字 |
| WebRTC能力 | 实验可选 | 双原生数据通道 | 协商失败退WebSocket，实际网络未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核对平台/Gateway版本与网络，保留桌面入口 | 不以安装成功代替可达 |
| 配对 | 通过控制连接确认Gateway身份并保存凭据 | 身份不符停止 |
| 接续 | 选同一宿主/工作区/会话，先只读历史与状态 | 对照桌面确认无漏错 |
| 断线 | 回前台重连后核对原请求结果 | 不明先停重发，桌面查原会话 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 客户端、宿主/Gateway及网络资源未知 | 安装、配对、网络配置；耗时未知 | 外置Gateway必需 |
| 持续 | 宿主模型、移动网络与本地缓存未知 | 连接、审批和权限核对 | 无节时/用量对照 |
| 失败恢复 | 重连与重复操作资源未知 | 桌面查结果、撤销凭据或清缓存 | 端到端去重/恢复未验 |
| 退出 | 本地缓存与凭据处理 | 手动断开并核对宿主任务仍在何处 | 不把退出手机当取消桌面任务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 移动接续 | Runtime请求状态和关联处理 | 真机可用及比浏览器收益 |
| 会话一致性 | 持久与流增量分离、前缀/序列检查 | 平台UI和网关端到端一致 |
| 后台恢复 | 作者声明前台恢复及系统限制 | 长时间保活与不漏审批 |
| 任务完成 | 有消息/响应关联基础 | 宿主业务成功、费用和节时 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03) 排队或transport.send成功不是宿主业务完成，身份/关联检查也不能替代Gateway授权与去重。iOS后台并不无限保活，外部网关和原生平台链未核清使当前写操作建议受限。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 共享请求状态、连接代际与历史/流式投影可供Android和iOS界面复用，形成移动接续方式。平台传输、Gateway执行与模型能力不由共享模块自动保证。

[Q02](#research-q02) KMP集中串行状态、generation过滤和不同事件水位规则值得借鉴；历史前缀失配回退而非强行追加。移植还需补齐平台生命周期、凭据与服务端协议；Kotlin/Swift不在本工程JS/TS统计范围，不能用inventory推完整客户端大小。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03) 排队或transport.send成功不是宿主业务完成，身份/关联检查也不能替代Gateway授权与去重。iOS后台并不无限保活，外部网关和原生平台链未核清使当前写操作建议受限。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 当前观察，先固定拟用Gateway和平台传输/安全存储，再以非敏感只读任务对照浏览器。消息或审批结果未知时先在桌面核对，不因手机显示已发送就重复提交或认为任务完成。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查共享Kotlin请求/连接及投影机制；未核查完整Gateway及双平台实现，未做真机运行。分层结果解释是假设，不能当已实现能力。

- 已检查：作者 README、包清单、源码路径 README.md、shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt、shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/SplitGatewayTransport.kt、shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定README与共享Kotlin Runtime、SplitTransport、ConversationStore；通过固定Git blob只读补查稀疏checkout未落盘文件，不修改checkout。未穷尽平台UI/传输/存储及Gateway，未执行目标。
- 下一步：按 [Q04](#research-q04) 先核查Gateway/UI等价状态，再对断网、迟到回包和代际切换比较重复提交、错误完成判断及恢复时间。

**分析版本**

- **仓库**：[Clarklevis1995/dsh-mobile](https://github.com/Clarklevis1995/dsh-mobile)
- **版本号**：未声明（[固定提交 24f12c3](https://github.com/Clarklevis1995/dsh-mobile/tree/24f12c35aae2f368c7c158c3f5656da8560ced50)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证假设是用已有requestId与超时事件解释排队、发送、接受和完成，减少断线后的重复提交；须先排除Gateway及UI已有等价能力，无净改善不增加状态负担。

按 [Q04](#research-q04) 先核查Gateway/UI等价状态，再对断网、迟到回包和代际切换比较重复提交、错误完成判断及恢复时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 66 | 9451 | — | — | 152636 |
| .mjs | source | 3 | 168 | 156 | 6 | — |
| .mjs | test | 1 | 31 | 30 | 0 | — |
| .js | source | 1 | 246 | 236 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/Clarklevis1995/dsh-mobile/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=20&color=737b86&logo=github)](https://github.com/Clarklevis1995/dsh-mobile/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=20&color=737b86&logo=github)](https://github.com/Clarklevis1995/dsh-mobile/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：原生客户端如何支持离开桌面后的会话接续，连接与投影证据能证明到哪一步？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪种移动任务值得独立客户端，实际条目类型是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Whaleness是Android/iOS原生客户端，不是本身装在DSH里的网关插件。目标是桌面Agent仍在工作时，用户在手机查看会话、轨迹并继续输入或处理审批，最终业务结果仍由桌面宿主执行。对照手机浏览器访问WebUI，候选增量是原生缓存、平台交互和后台恢复，以及两平台共享的业务状态处理；README列出这些功能，但本次没有两平台真机对照，不能据原生界面或截图认定更高效。

共享Kotlin模块提供Runtime、协议状态及会话投影，平台实现网络、安全存储和界面。将持久事件与高频流增量分开处理，可让两端复用一致性规则，而不是各写一套业务归约器。合格结果是正确接续同一宿主/会话、不漏审批与消息、断线后能核对结果。它不增加模型能力，也不能在宿主离线时继续执行桌面任务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-45](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/README.md#L30-L45)

作者明确独立客户端、共享逻辑、平台API及外置Gateway条件。

<details>
<summary>查看原文（16行）</summary>

```text
## Overview

Whaleness is an independently developed third-party native mobile client for DeepSeek Harness. Both Android and iOS apps use Kotlin Multiplatform (KMP):

- `shared` is the source of truth for shared business state, including protocol handling, state machines, reducers, projections, and synchronization.
- `androidApp` implements the Android app with Kotlin, Jetpack Compose, and OkHttp.
- `DeepSeekHarnessMobile` builds the iOS interface with SwiftUI/UIKit and accesses shared logic through a Kotlin/Native framework.

Both apps connect to Harness over WebSocket through [`dsh-plugin-mobile-gateway`](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway). With the gateway’s experimental WebRTC option enabled, paired clients prefer two native RTC data channels and explicitly fall back to WebSocket when negotiation fails. Settings shows the selected connection method. See [App integration and validation](Docs/webrtc-app-integration.md). Networking, secure storage, files, images, lifecycle handling, and background execution use native platform APIs. Business rules are consolidated in `shared/commonMain` wherever practical.

## Downloads and Prerequisites

- **iOS**: [Join the TestFlight beta](https://testflight.apple.com/join/1Euwby6r). Supports iPhone and iPad running iOS / iPadOS 16.1 or later.
- **Android**: [Download an APK from GitHub Releases](https://github.com/Clarklevis1995/dsh-mobile/releases). Requires Android 7.0 (API 24) or later. In-app update checks prefer the accelerated download source and verify downloaded packages.
- **Desktop host**: Run DeepSeek Harness with **`dsh-plugin-mobile-gateway` 0.11.1 or later** installed and enabled. [`AppRelease/release-info.json`](AppRelease/release-info.json) defines the required minimum version.
- **Voice input**: Enable the official Voice Input plugin in the desktop host's Plugins section, finish model download and initialization, and grant microphone access on the mobile device.
```

</details>

**依据 2 · 作者声明**：[README.md:79-102](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/README.md#L79-L102)

作者列出会话/审批/缓存及平台后台边界，不能当本次运行结果。

<details>
<summary>查看原文（24行）</summary>

```text
### Conversations and Agent Execution

- **Live native conversations**: Stream WebSocket events with Markdown, code, reasoning, tool calls, tool results, and image attachments.
- **Voice and text input**: Switch to a dedicated hold-to-talk area, release to transcribe into an editable draft, or slide up to cancel. Transcription uses the voice input capability on the host.
- **History, queues, and commands**: Merge paginated history with the live tail and deduplicate events. View and edit queued messages, and use slash commands provided by the host. On iOS, loading older messages preserves the current reading position.
- **Agent traces**: Inspect User, Assistant, and Tool events, including arguments, results, schemas, token usage, and timing.
- **Interactive Agent workflows**: Respond to Human Questions and tool approval requests, including submission, cancellation, rejection, and one-time approval.

### Hosts, Workspaces, and Extensions

- **Multiple hosts and sessions**: Save and switch between Gateway hosts with separate credentials. Browse, create, and switch workspaces; search, create, switch, and archive sessions.
- **File cards and previews**: Open file cards directly from conversations, browse remote directories, and download files in verified chunks. Preview PDFs, images, and code, or share and open files with system apps.
- **Markdown source / preview**: Browse code with syntax highlighting, line numbers, and horizontal scrolling for long lines. Switch Markdown files between source and rendered views, retaining each view's reading position.
- **Plugin management**: Browse official and installed plugins, details, and runtime status. Install, enable, disable, and configure plugins where supported by the host.
- **Scheduled tasks**: Browse tasks created in conversations, search and filter them, expand their rules, next execution time, and delivery information, and edit or delete tasks.
- **Session and default settings**: Manage Agent presets, providers/models, reasoning effort, and Harness Agent permissions: `read-only`, `workspace-write`, and `danger-full-access`. These control the Agent on the host, not the phone's local filesystem.

### Native Device Experience

- **Tablets and foldables**: Layouts adapt to the available window size on iPad, Android tablets, and foldables. Wide home screens use columns, conversations retain a comfortable reading width, and file previews resize with the window. Android layouts account for the folding hinge area.
- **Themes and text size**: Light and dark appearances, plus system or manually adjusted app text size, with Harness's ocean, grid, and whale visual identity.
- **iOS Live Activities and notifications**: Follow task progress, approvals, and completion on the Lock Screen and supported Dynamic Island devices, with system notifications for important updates.
- **Secure device pairing**: Scan a WebUI QR code or enter pairing details manually. Long-lived credentials are stored in platform secure storage.
- **Mobile lifecycle handling**: Neither app intentionally closes a healthy connection when backgrounded. Connections recover on returning to the foreground after a disconnect; manual disconnects do not trigger automatic reconnection. Android runs a foreground service only during active Agent turns. iOS uses the limited background execution time granted by the system and does not guarantee an indefinitely open WebSocket.
```

</details>

**依据 3 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt:98-140](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt#L98-L140)

共享存储将持久事件和stream delta分路处理，支持业务规则复用。

<details>
<summary>查看原文（43行）</summary>

```text
    fun receiveEvent(eventJson: String): SharedMviDispatchResult = dispatch("event") {
        val record = wireJson.decodeFromString<SessionEvent>(eventJson)
        require(record.sessionId.isNotBlank()) { "sessionId must not be blank" }
        invalidatePreparation(record.sessionId)
        val projector = projectors.getOrPut(record.sessionId) { ConversationProjector(labels) }
        require(record.seq > projector.lastSequence) {
            "event sequence ${record.seq} is not newer than ${projector.lastSequence}; replace baseline first"
        }
        val operations = projector.foldWithOperations(listOf(record))
        projectionRecords[record.sessionId]?.add(record)
        // 不可见持久事件仍会推进流水位，必须发布给平台镜像。
        // 否则后续独立流携带正确水位时，iOS 会因镜像滞后而误判协议错误。
        SharedConversationPatch(
            sessionId = record.sessionId,
            operations = operations,
            lastSequence = projector.lastSequence
        )
    }

    /**
     * 单个 streaming 增量。DSH 的 `session.seq` 是 turn 级 journal watermark，同一 turn
     * 内的所有 chunk 共享同一个 seq，因此 [receiveEvent] 的单调性守卫在这里并不适用。
     *
     * 该路径只做行内变更：projector 用 per-key stream index 定位目标行，既不重建历史，
     * 也不重新序列化整个事件列表。缺少已建立基线的 projector 时 fail closed——
     * 平台据此回退到 [replaceSession]，绝不静默丢弃内容。
     */
    fun receiveStreamDelta(eventJson: String): SharedMviDispatchResult = dispatch("stream") {
        val record = wireJson.decodeFromString<SessionEvent>(eventJson)
        require(record.sessionId.isNotBlank()) { "sessionId must not be blank" }
        invalidatePreparation(record.sessionId)
        val projector = projectors[record.sessionId]
            ?: error("no conversation baseline for session ${record.sessionId}; replace baseline first")
        val previousSequence = projector.lastSequence
        // 同 seq 流式变更不能证明旧基线仍是持久历史的严格前缀。
        projectionRecords.remove(record.sessionId)
        val operations = projector.foldWithOperations(listOf(record))
        if (operations.isEmpty() && projector.lastSequence == previousSequence) return@dispatch null
        SharedConversationPatch(
            sessionId = record.sessionId,
            operations = operations,
            lastSequence = projector.lastSequence
        )
```

</details>

#### 缺口

- 没有原生端与手机浏览器同任务结果对照
  **影响**：不能证明移动接续更快或更可靠
  **进一步探讨**：在同宿主同会话比较查看状态、审批、断网恢复和重复提交，计入配对与维护时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求、连接身份与历史/流式投影怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

GatewayRuntime以Mutex串行边界持有连接和待响应通道。未连接时拒绝请求；同responseKind已有请求时按策略拒绝、FIFO排队或只保留最新，排队返回true只表示请求被接受到本地队列。真正transport.send成功也返回true，不能解释为宿主已经执行。待响应项同时绑定连接generation与关联ID，回包核对generation、session及不同响应类别的requestId/rpcId/itemId，避免旧连接确认建立错误会话基线。

SplitTransport先在控制连接配对，只有确认Gateway身份后才开会话通道；第二通道握手需同identity与能力，未就绪时对话请求进入有界缓冲，失败清空。这样的状态约束有助于减少跨连接误配，但不证明外部网关的授权、去重和端到端执行语义。

SharedConversationStore对持久事件要求seq严格前进，stream delta允许同turn共享seq但必须已有基线；缺基线直接报错而非静默吞内容。历史追加也检查session、前缀和序列，不符合时退回重建。这是具体的状态投影设计，而非运行结果证明；平台渲染及完整网络链仍需另验。

#### 证据与依据

**依据 1 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:464-532](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L464-L532)

未连拒绝、通道策略、队列接受和transport发送返回的区别。

<details>
<summary>查看原文（69行）</summary>

```text
    private suspend fun sendRequestLocked(input: GatewayRequest): Boolean {
        val target = conversationTargets[input.targetSessionId]
        val payload = target?.let { runCatching { it.decorate(input.payload) }.getOrNull() } ?: if (target == null) input.payload else {
            rejectLocked(input.requestType, "subagent/not-resumable", input.targetSessionId, input.correlationId)
            return false
        }
        val request = input.copy(payload = payload)

        if (mutableState.value.connection != GatewayConnectionState.CONNECTED) {
            rejectLocked(
                request.requestType,
                ERROR_NOT_CONNECTED,
                request.targetSessionId,
                request.correlationId
            )
            return false
        }
        val lane = pendingLanes[request.responseKind]
        if (lane != null) {
            when (request.lanePolicy) {
                GatewayRequestLanePolicy.REJECT_IF_BUSY -> {
                    rejectLocked(
                        request.requestType,
                        ERROR_REQUEST_BUSY,
                        request.targetSessionId,
                        request.correlationId
                    )
                    return false
                }
                GatewayRequestLanePolicy.FIFO -> lane.queued.addLast(request)
                GatewayRequestLanePolicy.COALESCE_LATEST -> {
                    while (lane.queued.isNotEmpty()) {
                        emitCancelledLocked(lane.queued.removeFirst(), ERROR_COALESCED)
                    }
                    lane.queued.addLast(request)
                }
            }
            emitEventLocked(GatewayRuntimeEvent.RequestQueued(request.requestType, request.responseKind))
            return true
        }
        return sendAsActiveLocked(request)
    }

    private suspend fun sendAsActiveLocked(request: GatewayRequest): Boolean {
        val pendingId = ++requestGeneration
        val transportGeneration = connectionGeneration
        val pending = PendingRequest(request, transportGeneration, pendingId)
        pendingLanes[request.responseKind] = PendingLane(
            active = pending,
            queued = ArrayDeque()
        )
        updateRequestTimeoutsLocked()
        return runCatching { transport.send(request.payload) }.fold(
            onSuccess = {
                if (diagnosticsStore.isActive) diagnosticsStore.recordTraffic(request.payload.encodeToByteArray().size.toLong(), 0)
                true
            },
            onFailure = { error ->
                pendingLanes.remove(request.responseKind)?.active?.timeoutJob?.cancel()
                rejectLocked(
                    request.requestType,
                    if (error.message == "transport/ws-required") "transport/ws-required" else ERROR_SEND_FAILED,
                    request.targetSessionId,
                    request.correlationId,
                    request.isBackgroundHistory
                )
                false
            }
        )
```

</details>

**依据 2 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:905-945](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L905-L945)

连接generation、session与响应关联检查。

<details>
<summary>查看原文（41行）</summary>

```text
        if (
            lane.active.generation != connectionGeneration ||
            !sessionMatches(lane.active.request, frame.sessionId) ||
            !responseCorrelationMatches(lane.active.request, frame)
        ) {
            rejectLocked(
                "transport",
                ERROR_SESSION_MISMATCH,
                frame.sessionId,
                responseCorrelation(frame)
            )
            return Correlation(false, null)
        }
        // 有后续切换时，旧确认只释放单飞通道，禁止建立旧订阅基线（包括 A→B→A）。
        val supersededSubscription = frame.kind == "subscribed" && lane.queued.isNotEmpty()
        val sessionId = frame.sessionId ?: lane.active.request.targetSessionId
        val isBackgroundHistory = lane.active.request.isBackgroundHistory
        if (frame.kind != "attachment") completeLaneLocked(frame.kind)
        return Correlation(!supersededSubscription, sessionId, isBackgroundHistory)
    }

    private fun sessionMatches(request: GatewayRequest, explicitSessionId: String?): Boolean =
        explicitSessionId == null || request.targetSessionId == null || explicitSessionId == request.targetSessionId

    private fun responseCorrelationMatches(request: GatewayRequest, frame: GatewayFrame): Boolean =
        when (request.responseKind) {
            "sent" -> request.correlationId == null || request.correlationId == frame.requestId
            "queue-item-updated" -> request.correlationId == frame.itemId
            "attachment" -> request.correlationId == frame.attachment?.attachmentId
            "question-response", "approval-response" -> request.correlationId == frame.rpcId
            "speech-catalog", "speech-subscribed", "speech-unsubscribed", "speech-preparing",
            "speech-preparation-cancelled", "speech-transcript", "speech-cancelled",
            "file-upload-completed" -> request.correlationId == frame.requestId || (frame.uploadId != null && runCatching {
                val payload = wireJson.parseToJsonElement(request.payload) as kotlinx.serialization.json.JsonObject
                (payload["uploadId"] as? JsonPrimitive)?.content == frame.uploadId
            }.getOrDefault(false))
            "file-upload-opened", "file-upload-chunk-accepted", "file-upload-cancelled",
            "session-created", "session-agent-preset", "select-agent-preset", "file-resolved", "file-list", "file-download-opened" -> request.correlationId == frame.requestId
            "file-download-chunk", "file-download-cancelled" -> request.correlationId == frame.transferId
            "command-options", "command-selected" -> request.correlationId == frame.command?.stringValue
            else -> true
```

</details>

**依据 3 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/SplitGatewayTransport.kt:32-79](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/SplitGatewayTransport.kt#L32-L79)

两通道身份校验与握手。

<details>
<summary>查看原文（48行）</summary>

```text
    override val events: Flow<GatewayTransportEvent> = control.events.transform { event ->
        if (event is GatewayTransportEvent.Frame && event.value.generation == spec?.generation && !receivedHello) {
            val header = runCatching { wireJson.decodeFromString<Header>(event.value.text) }.getOrNull()
            if (header == null) {
                emit(event)
                return@transform
            }
            if (header.kind == "paired" || header.kind == "hello") {
                if (runCatching { GatewayIdentity.validate(spec?.expectedGatewayId, header.gatewayId) }.isFailure) {
                    emit(GatewayTransportEvent.State(GatewayTransportState.Failed(
                        generation = event.value.generation, reason = "gateway-identity-mismatch", recoverable = false
                    )))
                    return@transform
                }
                spec = spec?.copy(expectedGatewayId = header.gatewayId ?: spec?.expectedGatewayId)
            }
            if (header.kind == "paired") spec = spec?.copy(bearerToken = header.token, pairingCode = null)
            if (header.kind == "hello") {
                receivedHello = true
                split = "split-channels" in header.capabilities
            }
        }
        emit(event)
    }

    override val conversationEvents: Flow<GatewayTransportEvent> = conversation.events.transform { event ->
        val generation = when (event) {
            is GatewayTransportEvent.Frame -> event.value.generation
            is GatewayTransportEvent.State -> event.value.generation
        }
        if (!split || generation != spec?.generation) return@transform
        when (event) {
            is GatewayTransportEvent.Frame -> {
                if (!conversationReady) {
                    val header = runCatching { wireJson.decodeFromString<Header>(event.value.text) }.getOrNull()
                    if (header?.kind != "hello" || "split-channels" !in header.capabilities ||
                        runCatching { GatewayIdentity.validate(spec?.expectedGatewayId, header.gatewayId) }.isFailure) {
                        emit(GatewayTransportEvent.State(GatewayTransportState.Failed(
                            generation = generation, reason = "conversation-handshake-failed", recoverable = false
                        )))
                        return@transform
                    }
                    while (pendingConversation.isNotEmpty()) {
                        val payload = pendingConversation.removeFirst()
                        pendingConversationBytes -= payload.length * 2
                        conversation.send(payload)
                    }
                    conversationReady = true
```

</details>

**依据 4 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/SplitGatewayTransport.kt:106-118](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/SplitGatewayTransport.kt#L106-L118)

会话未就绪缓冲有界，发送不等于宿主处理。

<details>
<summary>查看原文（13行）</summary>

```text
    override suspend fun send(text: String) {
        val type = wireJson.decodeFromString<Header>(text).type
        if (split && type in CONVERSATION_REQUESTS) {
            // 只在会话身份核对之后发送；这里不能等待 hello 阻塞 Runtime 的发送锁。
            if (conversationReady) conversation.send(text)
            else {
                check(pendingConversation.size < 64 && pendingConversationBytes + text.length * 2 <= 16 * 1024 * 1024) {
                    "conversation-handshake-queue-full"
                }
                pendingConversation.addLast(text)
                pendingConversationBytes += text.length * 2
            }
        } else control.send(text)
```

</details>

**依据 5 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt:98-140](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt#L98-L140)

持久和流增量不同序列约束，缺基线拒绝。

<details>
<summary>查看原文（43行）</summary>

```text
    fun receiveEvent(eventJson: String): SharedMviDispatchResult = dispatch("event") {
        val record = wireJson.decodeFromString<SessionEvent>(eventJson)
        require(record.sessionId.isNotBlank()) { "sessionId must not be blank" }
        invalidatePreparation(record.sessionId)
        val projector = projectors.getOrPut(record.sessionId) { ConversationProjector(labels) }
        require(record.seq > projector.lastSequence) {
            "event sequence ${record.seq} is not newer than ${projector.lastSequence}; replace baseline first"
        }
        val operations = projector.foldWithOperations(listOf(record))
        projectionRecords[record.sessionId]?.add(record)
        // 不可见持久事件仍会推进流水位，必须发布给平台镜像。
        // 否则后续独立流携带正确水位时，iOS 会因镜像滞后而误判协议错误。
        SharedConversationPatch(
            sessionId = record.sessionId,
            operations = operations,
            lastSequence = projector.lastSequence
        )
    }

    /**
     * 单个 streaming 增量。DSH 的 `session.seq` 是 turn 级 journal watermark，同一 turn
     * 内的所有 chunk 共享同一个 seq，因此 [receiveEvent] 的单调性守卫在这里并不适用。
     *
     * 该路径只做行内变更：projector 用 per-key stream index 定位目标行，既不重建历史，
     * 也不重新序列化整个事件列表。缺少已建立基线的 projector 时 fail closed——
     * 平台据此回退到 [replaceSession]，绝不静默丢弃内容。
     */
    fun receiveStreamDelta(eventJson: String): SharedMviDispatchResult = dispatch("stream") {
        val record = wireJson.decodeFromString<SessionEvent>(eventJson)
        require(record.sessionId.isNotBlank()) { "sessionId must not be blank" }
        invalidatePreparation(record.sessionId)
        val projector = projectors[record.sessionId]
            ?: error("no conversation baseline for session ${record.sessionId}; replace baseline first")
        val previousSequence = projector.lastSequence
        // 同 seq 流式变更不能证明旧基线仍是持久历史的严格前缀。
        projectionRecords.remove(record.sessionId)
        val operations = projector.foldWithOperations(listOf(record))
        if (operations.isEmpty() && projector.lastSequence == previousSequence) return@dispatch null
        SharedConversationPatch(
            sessionId = record.sessionId,
            operations = operations,
            lastSequence = projector.lastSequence
        )
```

</details>

**依据 6 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt:148-178](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt#L148-L178)

历史追加须满足相等前缀与正确序列。

<details>
<summary>查看原文（31行）</summary>

```text
    /** 只接受完整相等的前缀；历史修订、删除、裁窗和向前补页保留重新校验路径。 */
    fun appendHistorySnapshot(sessionId: String, snapshot: SharedHistoryProjectionSnapshot): SharedMviDispatchResult? {
        if (sessionId != snapshot.sessionId) return null
        val previous = projectionRecords[sessionId] ?: return null
        val projector = projectors[sessionId] ?: return null
        val records = snapshot.records
        if (records.any { it.sessionId != sessionId || !it.time.isFinite() } ||
            records.zipWithNext().any { (left, right) -> left.seq >= right.seq }
        ) {
            return null
        }
        if (projector.hasAssistantChunks ||
            previous.size > records.size ||
            previous.indices.any { previous[it] != records[it] } ||
            records.asSequence().drop(previous.size).any { it.seq <= projector.lastSequence }
        ) {
            return null
        }
        val added = records.subList(previous.size, records.size)
        // 大段补回和超大单条仍交给后台 worker，避免增量路径反而阻塞主线程。
        if (added.size > MAXIMUM_INLINE_EVENTS ||
            added.sumOf(ChatCacheMemoryEstimator::contentLowerBound) > MAXIMUM_INLINE_CONTENT_BYTES
        ) {
            return null
        }
        return dispatch("history-append") {
            invalidatePreparation(sessionId)
            val operations = projector.foldWithOperations(added)
            projectionRecords[sessionId] = records.toMutableList()
            chatCacheLog("projection-appended", "reusedEvents=${previous.size} foldedEvents=${added.size} operations=${operations.size}")
            SharedConversationPatch(sessionId = sessionId, operations = operations, lastSequence = projector.lastSequence)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些平台、服务条件与恢复成本限制采用？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

启动需手机原生应用、持续运行的DSH宿主及另一个mobile-gateway，README要求Gateway至少0.11.1，Android7/iOS16.1起；这些是固定作者声明，不是本次安装兼容结果。语音还依赖宿主官方语音插件及手机麦克风，WebRTC为实验选项并有WebSocket退路，不能因为协议支持就认为网络一定穿透。

首次要安装、配对并配置可达网络，持续承担桌面模型/服务成本、移动网络和本地历史缓存；失败后需重连、核对桌面是否收到请求并可能撤销凭据。现金、耗时与资源均未测。README明确iOS后台时间有限，不能保证永久WebSocket；Android前台服务也只用于活跃turn。共享代码的CredentialStore接口不能独立证明各平台安全存储实现与Gateway服务端授权已验。

当前建议观察，先固定Gateway版本和对应平台传输审查，再对非敏感只读任务与浏览器比较。若连接身份不符、消息/审批结果不明确或后台恢复丢状态，应停止重复提交，在桌面核对原会话；本地send返回true、请求已排队与收到sent不是业务完成的同义词。不要在没有核清网关授权和网络边界时开放敏感工作区。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-45](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/README.md#L38-L45)

外置Gateway、实验RTC、平台和语音依赖。

```text
Both apps connect to Harness over WebSocket through [`dsh-plugin-mobile-gateway`](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway). With the gateway’s experimental WebRTC option enabled, paired clients prefer two native RTC data channels and explicitly fall back to WebSocket when negotiation fails. Settings shows the selected connection method. See [App integration and validation](Docs/webrtc-app-integration.md). Networking, secure storage, files, images, lifecycle handling, and background execution use native platform APIs. Business rules are consolidated in `shared/commonMain` wherever practical.

## Downloads and Prerequisites

- **iOS**: [Join the TestFlight beta](https://testflight.apple.com/join/1Euwby6r). Supports iPhone and iPad running iOS / iPadOS 16.1 or later.
- **Android**: [Download an APK from GitHub Releases](https://github.com/Clarklevis1995/dsh-mobile/releases). Requires Android 7.0 (API 24) or later. In-app update checks prefer the accelerated download source and verify downloaded packages.
- **Desktop host**: Run DeepSeek Harness with **`dsh-plugin-mobile-gateway` 0.11.1 or later** installed and enabled. [`AppRelease/release-info.json`](AppRelease/release-info.json) defines the required minimum version.
- **Voice input**: Enable the official Voice Input plugin in the desktop host's Plugins section, finish model download and initialization, and grant microphone access on the mobile device.
```

**依据 2 · 作者声明**：[README.md:94-102](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/README.md#L94-L102)

权限作用于宿主及后台保活限制。

```text
- **Session and default settings**: Manage Agent presets, providers/models, reasoning effort, and Harness Agent permissions: `read-only`, `workspace-write`, and `danger-full-access`. These control the Agent on the host, not the phone's local filesystem.

### Native Device Experience

- **Tablets and foldables**: Layouts adapt to the available window size on iPad, Android tablets, and foldables. Wide home screens use columns, conversations retain a comfortable reading width, and file previews resize with the window. Android layouts account for the folding hinge area.
- **Themes and text size**: Light and dark appearances, plus system or manually adjusted app text size, with Harness's ocean, grid, and whale visual identity.
- **iOS Live Activities and notifications**: Follow task progress, approvals, and completion on the Lock Screen and supported Dynamic Island devices, with system notifications for important updates.
- **Secure device pairing**: Scan a WebUI QR code or enter pairing details manually. Long-lived credentials are stored in platform secure storage.
- **Mobile lifecycle handling**: Neither app intentionally closes a healthy connection when backgrounded. Connections recover on returning to the foreground after a disconnect; manual disconnects do not trigger automatic reconnection. Android runs a foreground service only during active Agent turns. iOS uses the limited background execution time granted by the system and does not guarantee an indefinitely open WebSocket.
```

**依据 3 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:81-101](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L81-L101)

Runtime明确区分排队、取消、超时与拒绝事件。

<details>
<summary>查看原文（21行）</summary>

```text
    data class RequestQueued(val requestType: String, val responseKind: String) : GatewayRuntimeEvent
    data class RequestCancelled(
        val requestType: String,
        val targetSessionId: String?,
        val reason: String,
        val correlationId: String? = null,
        val isBackgroundHistory: Boolean = false
    ) : GatewayRuntimeEvent
    data class RequestTimedOut(
        val requestType: String,
        val targetSessionId: String?,
        val correlationId: String? = null,
        val isBackgroundHistory: Boolean = false
    ) : GatewayRuntimeEvent
    data class RequestRejected(
        val requestType: String,
        val reason: String,
        val targetSessionId: String? = null,
        val correlationId: String? = null,
        val isBackgroundHistory: Boolean = false
    ) : GatewayRuntimeEvent
```

</details>

**依据 4 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:105-122](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L105-L122)

传输与凭据是平台接口依赖，不可用接口声明证明安全实现。

<details>
<summary>查看原文（18行）</summary>

```text
class GatewayRuntime(
    private val transport: GatewayTransport,
    private val preferences: GatewayPreferences,
    private val credentials: GatewayCredentialStore,
    private val attachmentCache: GatewayAttachmentCache,
    private val networkMonitor: GatewayNetworkMonitor,
    private val clock: GatewayClock,
    private val scope: CoroutineScope,
    private val requestTimeoutMilliseconds: Long = DEFAULT_REQUEST_TIMEOUT_MILLISECONDS,
    private val recoveryWindowMilliseconds: Long = DEFAULT_RECOVERY_WINDOW_MILLISECONDS,
    private val connectionAttemptTimeoutMilliseconds: Long = DEFAULT_CONNECTION_ATTEMPT_TIMEOUT_MILLISECONDS,
    private val frameDecoder: (String) -> GatewayFrame = GatewayWireDecoder::decode,
    private val frameDecodingDispatcher: CoroutineDispatcher? = null,
    private var expectedGatewayId: String? = null,
    private val trustedEndpoints: List<String> = emptyList(),
    private val onIdentity: suspend (GatewayFrame, String) -> Unit = { _, _ -> },
    private val foregroundProbeTimeoutMilliseconds: Long = DEFAULT_FOREGROUND_PROBE_TIMEOUT_MILLISECONDS,
    private val diagnosticsNow: () -> Double = createNetworkDiagnosticsClock()
```

</details>

**依据 5 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:507-530](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L507-L530)

send成功只代表调用返回，失败清理待请求并拒绝。

<details>
<summary>查看原文（24行）</summary>

```text
    private suspend fun sendAsActiveLocked(request: GatewayRequest): Boolean {
        val pendingId = ++requestGeneration
        val transportGeneration = connectionGeneration
        val pending = PendingRequest(request, transportGeneration, pendingId)
        pendingLanes[request.responseKind] = PendingLane(
            active = pending,
            queued = ArrayDeque()
        )
        updateRequestTimeoutsLocked()
        return runCatching { transport.send(request.payload) }.fold(
            onSuccess = {
                if (diagnosticsStore.isActive) diagnosticsStore.recordTraffic(request.payload.encodeToByteArray().size.toLong(), 0)
                true
            },
            onFailure = { error ->
                pendingLanes.remove(request.responseKind)?.active?.timeoutJob?.cancel()
                rejectLocked(
                    request.requestType,
                    if (error.message == "transport/ws-required") "transport/ws-required" else ERROR_SEND_FAILED,
                    request.targetSessionId,
                    request.correlationId,
                    request.isBackgroundHistory
                )
                false
```

</details>

#### 缺口

- 未固定核查Gateway服务端与两平台原生传输/安全存储，未做真机恢复
  **影响**：关键授权、消息去重和后台结果缺口阻止当前推荐写操作试用
  **进一步探讨**：先按拟用平台核对原生transport与credential实现，再固定Gateway源码/版本和断线前后同会话记录。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 现有requestId与超时事件之上还有什么值得验证？

**研究主题**：新假设与验证

#### 完整回答

本版本已经允许消息携带requestId，且待请求按关联ID匹配sent、审批回包等；不存在“客户端完全没有关联或超时事件”的依据。值得检验的是给用户明确区分本地排队、传输发送、Gateway接受与宿主任务完成，并在连接中断后以同一请求关联恢复可见状态，是否减少因未知而重复提交。

它是呈现及端到端恢复假设，不应先认定服务端缺少幂等。需先固定Gateway协议和UI已有显示，排除等价能力，再在隔离会话比较现有提示与分层解释；设置发送后断网、回包迟到、重连到旧连接代际，记录重复消息、错误判断完成、恢复耗时与额外等待。若当前UI已解释充分，或新提示未降低错误判断反而增加操作，则否定。没有运行和Gateway证据，当前不提出具体幂等实现保证。

#### 证据与依据

**依据 1 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:420-438](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L420-L438)

消息已有requestId参数，是缺少关联假设的反证。

<details>
<summary>查看原文（19行）</summary>

```text
        images: List<GatewayOutgoingImage>,
        sessionId: String?,
        workspaceId: String?,
        clientTimeZone: String,
        mode: String = "queue",
        receipts: List<String> = emptyList(),
        requestId: String? = null
    ): Boolean = serialized {
        if (text.isBlank() && images.isEmpty() && receipts.isEmpty()) return@serialized false
        if (!outgoingImagesAreWithinLimits(images)) {
            rejectLocked("message", ERROR_IMAGE_LIMITS)
            return@serialized false
        }
        markTurnLocked(sessionId)
        val sent = sendRequestLocked(
            GatewayRequests.message(text.trim(), images, sessionId, workspaceId, clientTimeZone, mode, receipts, requestId)
        )
        if (!sent) releaseTurnLocked(sessionId)
        sent
```

</details>

**依据 2 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:905-945](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L905-L945)

现有响应关联对照，不能重复发明requestId。

<details>
<summary>查看原文（41行）</summary>

```text
        if (
            lane.active.generation != connectionGeneration ||
            !sessionMatches(lane.active.request, frame.sessionId) ||
            !responseCorrelationMatches(lane.active.request, frame)
        ) {
            rejectLocked(
                "transport",
                ERROR_SESSION_MISMATCH,
                frame.sessionId,
                responseCorrelation(frame)
            )
            return Correlation(false, null)
        }
        // 有后续切换时，旧确认只释放单飞通道，禁止建立旧订阅基线（包括 A→B→A）。
        val supersededSubscription = frame.kind == "subscribed" && lane.queued.isNotEmpty()
        val sessionId = frame.sessionId ?: lane.active.request.targetSessionId
        val isBackgroundHistory = lane.active.request.isBackgroundHistory
        if (frame.kind != "attachment") completeLaneLocked(frame.kind)
        return Correlation(!supersededSubscription, sessionId, isBackgroundHistory)
    }

    private fun sessionMatches(request: GatewayRequest, explicitSessionId: String?): Boolean =
        explicitSessionId == null || request.targetSessionId == null || explicitSessionId == request.targetSessionId

    private fun responseCorrelationMatches(request: GatewayRequest, frame: GatewayFrame): Boolean =
        when (request.responseKind) {
            "sent" -> request.correlationId == null || request.correlationId == frame.requestId
            "queue-item-updated" -> request.correlationId == frame.itemId
            "attachment" -> request.correlationId == frame.attachment?.attachmentId
            "question-response", "approval-response" -> request.correlationId == frame.rpcId
            "speech-catalog", "speech-subscribed", "speech-unsubscribed", "speech-preparing",
            "speech-preparation-cancelled", "speech-transcript", "speech-cancelled",
            "file-upload-completed" -> request.correlationId == frame.requestId || (frame.uploadId != null && runCatching {
                val payload = wireJson.parseToJsonElement(request.payload) as kotlinx.serialization.json.JsonObject
                (payload["uploadId"] as? JsonPrimitive)?.content == frame.uploadId
            }.getOrDefault(false))
            "file-upload-opened", "file-upload-chunk-accepted", "file-upload-cancelled",
            "session-created", "session-agent-preset", "select-agent-preset", "file-resolved", "file-list", "file-download-opened" -> request.correlationId == frame.requestId
            "file-download-chunk", "file-download-cancelled" -> request.correlationId == frame.transferId
            "command-options", "command-selected" -> request.correlationId == frame.command?.stringValue
            else -> true
```

</details>

**依据 3 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:81-101](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L81-L101)

已有超时/拒绝/取消事件提供呈现基础。

<details>
<summary>查看原文（21行）</summary>

```text
    data class RequestQueued(val requestType: String, val responseKind: String) : GatewayRuntimeEvent
    data class RequestCancelled(
        val requestType: String,
        val targetSessionId: String?,
        val reason: String,
        val correlationId: String? = null,
        val isBackgroundHistory: Boolean = false
    ) : GatewayRuntimeEvent
    data class RequestTimedOut(
        val requestType: String,
        val targetSessionId: String?,
        val correlationId: String? = null,
        val isBackgroundHistory: Boolean = false
    ) : GatewayRuntimeEvent
    data class RequestRejected(
        val requestType: String,
        val reason: String,
        val targetSessionId: String? = null,
        val correlationId: String? = null,
        val isBackgroundHistory: Boolean = false
    ) : GatewayRuntimeEvent
```

</details>

**依据 4 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:481-519](https://github.com/Clarklevis1995/dsh-mobile/blob/24f12c35aae2f368c7c158c3f5656da8560ced50/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L481-L519)

本地排队与transport.send返回true提供区分层级的推导。

<details>
<summary>查看原文（39行）</summary>

```text
        val lane = pendingLanes[request.responseKind]
        if (lane != null) {
            when (request.lanePolicy) {
                GatewayRequestLanePolicy.REJECT_IF_BUSY -> {
                    rejectLocked(
                        request.requestType,
                        ERROR_REQUEST_BUSY,
                        request.targetSessionId,
                        request.correlationId
                    )
                    return false
                }
                GatewayRequestLanePolicy.FIFO -> lane.queued.addLast(request)
                GatewayRequestLanePolicy.COALESCE_LATEST -> {
                    while (lane.queued.isNotEmpty()) {
                        emitCancelledLocked(lane.queued.removeFirst(), ERROR_COALESCED)
                    }
                    lane.queued.addLast(request)
                }
            }
            emitEventLocked(GatewayRuntimeEvent.RequestQueued(request.requestType, request.responseKind))
            return true
        }
        return sendAsActiveLocked(request)
    }

    private suspend fun sendAsActiveLocked(request: GatewayRequest): Boolean {
        val pendingId = ++requestGeneration
        val transportGeneration = connectionGeneration
        val pending = PendingRequest(request, transportGeneration, pendingId)
        pendingLanes[request.responseKind] = PendingLane(
            active = pending,
            queued = ArrayDeque()
        )
        updateRequestTimeoutsLocked()
        return runCatching { transport.send(request.payload) }.fold(
            onSuccess = {
                if (diagnosticsStore.isActive) diagnosticsStore.recordTraffic(request.payload.encodeToByteArray().size.toLong(), 0)
                true
```

</details>

#### 缺口

- Gateway业务回执与UI已有解释未穷尽，也无用户对照
  **影响**：不能认定新增状态呈现有增量价值
  **进一步探讨**：先检查服务端协议和原生UI，再测重复提交和错误完成判断；等价或无改善则停止。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
