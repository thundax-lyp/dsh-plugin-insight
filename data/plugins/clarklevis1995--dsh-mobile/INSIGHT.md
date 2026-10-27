# Whaleness

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[1fa7aa7](https://github.com/Clarklevis1995/dsh-mobile/tree/1fa7aa7e2d3f50379d37fba251fb6e774416703b)

<!-- BEGIN META -->
[![GitHub ★ 658](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=658&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Clarklevis1995/dsh-mobile)
<!-- END META -->

> **功能**：通过 Mobile Gateway 远程访问 DSH 会话、Agent 任务与工作区的 Android 和 iOS 原生客户端。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明共享请求状态和会话投影可供两套原生界面复用，提供移动继续任务的组织方式；不证明同平台真机兼容。

> **主要限制**：[Q02](#research-q02) 传输发送不代表宿主收到或业务执行，关键Gateway与原生传输没有固定检查；[Q03](#research-q03) 后台保活亦有限。

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
  - [Q01 · 相对手机浏览器的具体增量和身份是什么？](#detail-section-11)
  - [Q02 · 消息、历史和断线状态如何处理？](#detail-section-12)
  - [Q03 · Gateway、凭据及后台运行如何限制体验和成本？](#detail-section-13)
  - [Q04 · 谁应关注，怎样验证远程继续可靠？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人DSH用户离开桌面后查看长任务、继续聊天并处理问题，最终结果仍在宿主验收。

手机浏览器访问DSH或回到桌面；原生移动交互与宿主执行分开判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 共享连接管理 | 按endpoint凭据连接与断开 | 依赖Gateway和平台传输 |
| 请求通道 | 消息排队、合并或拒绝忙请求 | 传输成功不等于任务完成 |
| 会话投影 | 增量显示历史和实时内容 | 最终UI与端到端兼容未验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Android7+或iOS16.1+ | 必需 | 原生客户端 | 设备不支持 |
| DSH与Gateway>=0.11.1 | 必需 | 宿主协议与任务执行 | 无法连接或兼容未知 |
| 网络和配对凭据 | 必需 | 访问指定桌面 | 断线或鉴权失败 |
| 桌面语音插件 | 语音可选 | 转录 | 本轮未核语音链 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户固定网关版本与受限网络 | 配对到正确宿主 |
| 发送 | 客户端组装消息与请求ID | 发送不等于执行完成 |
| 核对 | 用户对比手机与桌面事件 | 未知先对账不盲重发 |
| 退出 | 用户断开并撤销设备 | 回桌面WebUI |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 手机客户端和桌面网关 | 安装配对和网络配置 | 耗时未知 |
| 持续使用 | 宿主模型、网络和本地缓存 | 监控连接和权限 | 省时与token未知 |
| 失败恢复 | 重连与重复操作资源 | 桌面核结果和撤销凭据 | 端到端恢复未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 移动接续 | 共享连接和请求状态 | 真机可用与效率 |
| 会话一致性 | 持久序列与瞬态分开处理 | 网关去重与跨端恢复 |

> **思考**：[Q02](#research-q02) 传输发送不代表宿主收到或业务执行，关键Gateway与原生传输没有固定检查；[Q03](#research-q03) 后台保活亦有限。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明共享请求状态和会话投影可供两套原生界面复用，提供移动继续任务的组织方式；不证明同平台真机兼容。

[Q02](#research-q02) 共享Kotlin状态机与按响应通道排队值得借鉴；平台安全存储、服务端授权和生命周期需另外闭环。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 传输发送不代表宿主收到或业务执行，关键Gateway与原生传输没有固定检查；[Q03](#research-q03) 后台保活亦有限。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先固定Gateway和平台传输核验，只读非敏感任务比手机浏览器；当前观察。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

共享连接、队列和事件折叠有源码支持；真机、网关授权与端到端恢复未验证。

- 已检查：作者 README、包清单、源码路径 README.md、shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt、shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt、shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayProtocol.kt 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定共享Runtime、ConversationStore与README；未检查Gateway仓库、双平台UI和原生传输，未运行真机。
- 下一步：受限网络核配对撤销、锁屏切网、消息回执和桌面对账；高影响写操作先不启用，未执行。

**分析版本**

- **仓库**：[Clarklevis1995/dsh-mobile](https://github.com/Clarklevis1995/dsh-mobile)
- **版本号**：未声明（[固定提交 1fa7aa7](https://github.com/Clarklevis1995/dsh-mobile/tree/1fa7aa7e2d3f50379d37fba251fb6e774416703b)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出按发送、接收、完成分层回执减少重复提交，未验证；若仍不能识别未知结果则否定。

受限网络核配对撤销、锁屏切网、消息回执和桌面对账；高影响写操作先不启用，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 60 | 8822 | — | — | 139143 |
| .mjs | source | 2 | 136 | 126 | 4 | — |
| .mjs | test | 1 | 31 | 30 | 0 | — |
| .js | source | 1 | 246 | 236 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/Clarklevis1995/dsh-mobile/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=20&color=737b86&logo=github)](https://github.com/Clarklevis1995/dsh-mobile/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=20&color=737b86&logo=github)](https://github.com/Clarklevis1995/dsh-mobile/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：移动端怎样可靠继续DSH任务并辨认断线未知结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对手机浏览器的具体增量和身份是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Whaleness是第三方Android/iOS原生客户端，通过另一个Mobile Gateway插件连接桌面DSH；当前组件类型为client，不是DSH宿主插件。适合离开电脑时查看长任务、继续会话和处理人工问题的用户。相对手机浏览器或远程桌面，增量是平台原生交互、共享Kotlin状态逻辑及移动生命周期处理；模型执行、工具权限和文件操作仍在桌面宿主，不能把移动界面权限当手机本地沙盒。README列出多种能力，但本轮只确认消息与状态核心链，不以展示截图当真机验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-11](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/README.md#L7-L11)

客户端任务定义。

```text
# Whaleness — A Third-Party Mobile Client for DeepSeek Harness

**Native Android and iOS apps with core business logic shared through Kotlin Multiplatform.**

Connect to DeepSeek Harness through Mobile Gateway to access workspaces, live conversations, Agent traces, plugins, scheduled tasks, and files from your phone, tablet, or foldable.
```

**依据 2 · 作者声明**：[README.md:32-45](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/README.md#L32-L45)

跨平台共享与独立Gateway依赖。

<details>
<summary>查看原文（14行）</summary>

```text
Whaleness is an independently developed third-party native mobile client for DeepSeek Harness. Both Android and iOS apps use Kotlin Multiplatform (KMP):

- `shared` is the source of truth for shared business state, including protocol handling, state machines, reducers, projections, and synchronization.
- `androidApp` implements the Android app with Kotlin, Jetpack Compose, and OkHttp.
- `DeepSeekHarnessMobile` builds the iOS interface with SwiftUI/UIKit and accesses shared logic through a Kotlin/Native framework.

Both apps connect to Harness over WebSocket through [`dsh-plugin-mobile-gateway`](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway). Networking, secure storage, files, images, lifecycle handling, and background execution use native platform APIs. Business rules are consolidated in `shared/commonMain` wherever practical.

## Downloads and Prerequisites

- **iOS**: [Join the TestFlight beta](https://testflight.apple.com/join/1Euwby6r). Supports iPhone and iPad running iOS / iPadOS 16.1 or later.
- **Android**: [Download an APK from GitHub Releases](https://github.com/Clarklevis1995/dsh-mobile/releases). Requires Android 7.0 (API 24) or later. In-app update checks prefer the accelerated download source and verify downloaded packages.
- **Desktop host**: Run DeepSeek Harness with **`dsh-plugin-mobile-gateway` 0.11.1 or later** installed and enabled. [`AppRelease/release-info.json`](AppRelease/release-info.json) defines the required minimum version.
- **Voice input**: Enable the official Voice Input plugin in the desktop host's Plugins section, finish model download and initialization, and grant microphone access on the mobile device.
```

</details>

**依据 3 · 作者声明**：[README.md:89-102](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/README.md#L89-L102)

宿主权限与后台限制。

<details>
<summary>查看原文（14行）</summary>

```text
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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 消息、历史和断线状态如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

共享Runtime从按endpoint存储的凭据取token再连接，手动disconnect设置desiredConnection=false并取消恢复任务、清队列和关闭传输。sendMessage先检查空消息和附件限额，再把requestId等组装为GatewayRequest；sendRequestLocked要求已连接并按响应通道选择拒绝、FIFO或合并最新请求，发送成功仅表示transport接受，不代表宿主业务完成。ConversationStore对持久事件要求seq前进，瞬态stream走独立路径，避免同轮共享水位被误判重复；历史增量更新投影。可借鉴共享状态机和请求代际隔离，但未实查双平台原生传输及Gateway服务端，因此不能保证写命令断线时恰好一次执行。

#### 证据与依据

**依据 1 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:216-265](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L216-L265)

凭据读取与明确手动断开。

<details>
<summary>查看原文（50行）</summary>

```text
    suspend fun connectStoredIfPaired(): Boolean = serialized {
        val stored = preferences.load()
        if (!stored.automaticallyConnect) return@serialized false
        if (
            desiredConnection && endpoint == stored.endpoint &&
            mutableState.value.connection in IDEMPOTENT_CONNECTION_STATES
        ) {
            return@serialized true
        }
        val token = runCatching { credentials.loadToken(stored.endpoint) }.getOrElse {
            failOpenLocked(ERROR_CREDENTIAL_ACCESS)
            return@serialized false
        }
        if (token.isNullOrBlank()) return@serialized false
        requireWebSocketEndpoint(stored.endpoint)
        cancelForegroundResumeLocked()
        lastConnectedEndpoint = null
        endpoint = stored.endpoint
        pairingCode = null
        isManualPairingAttempt = false
        desiredConnection = true
        reconnectBlocked = false
        reconnectJob?.cancel()
        recoveryDeadlineJob?.cancel()
        recoveryDeadlineJob = null
        openTransportLocked(preserveTurns = false)
        true
    }

    suspend fun disconnect() = serialized {
        desiredConnection = false
        reconnectBlocked = false
        pairingCode = null
        isManualPairingAttempt = false
        reconnectJob?.cancel()
        reconnectJob = null
        recoveryDeadlineJob?.cancel()
        recoveryDeadlineJob = null
        connectionAttemptTimeoutJob?.cancel()
        connectionAttemptTimeoutJob = null
        connectionGeneration += 1
        clearConnectionWorkLocked()
        runCatching { transport.close() }
        mutableState.value = mutableState.value.copy(
            connection = GatewayConnectionState.DISCONNECTED,
            reconnectAttempt = 0,
            lastError = null
        )
        val stored = preferences.load()
        preferences.update(stored.copy(automaticallyConnect = false))
```

</details>

**依据 2 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:358-378](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L358-L378)

消息输入限制和请求ID传递。

<details>
<summary>查看原文（21行）</summary>

```text
    suspend fun sendMessage(
        text: String,
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

**依据 3 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:404-468](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L404-L468)

连接守卫、通道队列与传输发送结果。

<details>
<summary>查看原文（65行）</summary>

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
            onSuccess = { true },
            onFailure = {
                pendingLanes.remove(request.responseKind)?.active?.timeoutJob?.cancel()
                rejectLocked(
                    request.requestType,
                    ERROR_SEND_FAILED,
                    request.targetSessionId,
                    request.correlationId,
                    request.isBackgroundHistory
                )
                false
            }
```

</details>

**依据 4 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt:98-122](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt#L98-L122)

持久序列和流式事件语义分离。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt:167-178](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt#L167-L178)

历史增量折叠。

<details>
<summary>查看原文（12行）</summary>

```text
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

#### 缺口

- 平台传输与Gateway服务端确认、去重未固定核验
  **影响**：发送或重连不能证明任务执行一次且正确
  **进一步探讨**：固定Gateway版本，断网前后提交同requestId并与桌面事件对账

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Gateway、凭据及后台运行如何限制体验和成本？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

README要求Gateway>=0.11.1、Android7+或iOS16.1+，语音还需桌面官方插件和模型资源；这些是声明要求，不是本轮运行验证。手机和桌面需可达网络、有效配对凭据以及宿主持续在线；原生安全存储实现未在本轮审查，不能仅因接口名宣称密钥安全已验。iOS后台时间有限，不能承诺WebSocket永久保活。用户还需维护网关暴露、设备撤销及本地缓存隐私；模型费用仍在宿主计，移动端省步骤不等于省token。失败后先桌面核结果再重发，退出可断开、撤销凭据并回桌面WebUI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:40-45](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/README.md#L40-L45)

系统和Gateway版本条件。

```text
## Downloads and Prerequisites

- **iOS**: [Join the TestFlight beta](https://testflight.apple.com/join/1Euwby6r). Supports iPhone and iPad running iOS / iPadOS 16.1 or later.
- **Android**: [Download an APK from GitHub Releases](https://github.com/Clarklevis1995/dsh-mobile/releases). Requires Android 7.0 (API 24) or later. In-app update checks prefer the accelerated download source and verify downloaded packages.
- **Desktop host**: Run DeepSeek Harness with **`dsh-plugin-mobile-gateway` 0.11.1 or later** installed and enabled. [`AppRelease/release-info.json`](AppRelease/release-info.json) defines the required minimum version.
- **Voice input**: Enable the official Voice Input plugin in the desktop host's Plugins section, finish model download and initialization, and grant microphone access on the mobile device.
```

**依据 2 · 作者声明**：[README.md:94-102](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/README.md#L94-L102)

权限归属、配对与后台边界。

```text
- **Session and default settings**: Manage Agent presets, providers/models, reasoning effort, and Harness Agent permissions: `read-only`, `workspace-write`, and `danger-full-access`. These control the Agent on the host, not the phone's local filesystem.

### Native Device Experience

- **Tablets and foldables**: Layouts adapt to the available window size on iPad, Android tablets, and foldables. Wide home screens use columns, conversations retain a comfortable reading width, and file previews resize with the window. Android layouts account for the folding hinge area.
- **Themes and text size**: Light and dark appearances, plus system or manually adjusted app text size, with Harness's ocean, grid, and whale visual identity.
- **iOS Live Activities and notifications**: Follow task progress, approvals, and completion on the Lock Screen and supported Dynamic Island devices, with system notifications for important updates.
- **Secure device pairing**: Scan a WebUI QR code or enter pairing details manually. Long-lived credentials are stored in platform secure storage.
- **Mobile lifecycle handling**: Neither app intentionally closes a healthy connection when backgrounded. Connections recover on returning to the foreground after a disconnect; manual disconnects do not trigger automatic reconnection. Android runs a foreground service only during active Agent turns. iOS uses the limited background execution time granted by the system and does not guarantee an indefinitely open WebSocket.
```

**依据 3 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:245-265](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L245-L265)

手动断开关闭自动连接。

<details>
<summary>查看原文（21行）</summary>

```text
    suspend fun disconnect() = serialized {
        desiredConnection = false
        reconnectBlocked = false
        pairingCode = null
        isManualPairingAttempt = false
        reconnectJob?.cancel()
        reconnectJob = null
        recoveryDeadlineJob?.cancel()
        recoveryDeadlineJob = null
        connectionAttemptTimeoutJob?.cancel()
        connectionAttemptTimeoutJob = null
        connectionGeneration += 1
        clearConnectionWorkLocked()
        runCatching { transport.close() }
        mutableState.value = mutableState.value.copy(
            connection = GatewayConnectionState.DISCONNECTED,
            reconnectAttempt = 0,
            lastError = null
        )
        val stored = preferences.load()
        preferences.update(stored.copy(automaticallyConnect = false))
```

</details>

**依据 4 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:447-468](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L447-L468)

发送结果只覆盖传输，不含服务端办结。

<details>
<summary>查看原文（22行）</summary>

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
            onSuccess = { true },
            onFailure = {
                pendingLanes.remove(request.responseKind)?.active?.timeoutJob?.cancel()
                rejectLocked(
                    request.requestType,
                    ERROR_SEND_FAILED,
                    request.targetSessionId,
                    request.correlationId,
                    request.isBackgroundHistory
                )
                false
            }
```

</details>

#### 缺口

- 远程网络安全和缓存生命周期未实际验证
  **影响**：不应据客户端支持扩大公开网关权限
  **进一步探讨**：受限网络试验配对撤销、缓存清理及断线未知结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁应关注，怎样验证远程继续可靠？

**研究主题**：新假设与验证、采用判断

#### 完整回答

已有DSH长任务且能管理网关的个人用户可关注移动继续方案；本轮外部Gateway与原生传输尚未固定，不直接建议承载生产审批或高影响写操作。未验证方向是把“本机已发”“宿主已收”“实际完成”分层显示并在断线后先核回执，避免发送返回true被用户当成已执行。先用非敏感只读会话在同网络比较浏览器和客户端，锁屏、切网、手动断开、重连并与桌面事件核对；验收不丢消息、不跨会话、明确未知和可撤销配对。若重复发出指令、显示完成但桌面无结果或权限不清，断开并回桌面处理。

#### 证据与依据

**依据 1 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt:404-468](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/gateway/GatewayRuntime.kt#L404-L468)

发送和业务确认可分层，是回执方向起点。

<details>
<summary>查看原文（65行）</summary>

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
            onSuccess = { true },
            onFailure = {
                pendingLanes.remove(request.responseKind)?.active?.timeoutJob?.cancel()
                rejectLocked(
                    request.requestType,
                    ERROR_SEND_FAILED,
                    request.targetSessionId,
                    request.correlationId,
                    request.isBackgroundHistory
                )
                false
            }
```

</details>

**依据 2 · 源码核查**：[shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt:98-122](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/shared/src/commonMain/kotlin/com/clarklevis/dsh/shared/facade/SharedConversationStore.kt#L98-L122)

持久/瞬态序列边界支撑对账。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[README.md:102-102](https://github.com/Clarklevis1995/dsh-mobile/blob/1fa7aa7e2d3f50379d37fba251fb6e774416703b/README.md#L102-L102)

作者明确iOS不能永久保活。

```text
- **Mobile lifecycle handling**: Neither app intentionally closes a healthy connection when backgrounded. Connections recover on returning to the foreground after a disconnect; manual disconnects do not trigger automatic reconnection. Android runs a foreground service only during active Agent turns. iOS uses the limited background execution time granted by the system and does not guarantee an indefinitely open WebSocket.
```

#### 缺口

- 分层回执能否降低重复提交未知
  **影响**：尚未验证未来设计
  **进一步探讨**：在丢回执与切网样本比较重复提交和人工确认时间

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
