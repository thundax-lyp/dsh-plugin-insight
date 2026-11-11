# DS Harness Remote

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[47ea189](https://github.com/liguobao/ds-harness-remote/tree/47ea1890e75a58c3b336a13f42ed12829c9268da)

<!-- BEGIN META -->
[![GitHub ★ 2,527](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C527&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liguobao/ds-harness-remote) [![npm 30d 41,072](https://img.shields.io/static/v1?label=npm+30d&message=41%2C072&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/ds-harness-remote) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/ds-harness-remote)
<!-- END META -->

> **功能**：让受信设备从 Web、桌面或移动端接入原 DSH 宿主的会话、工作区和终端。

> **亮点**：[Q01](#research-q01) 把跨设备连接和原宿主业务接在同一入口，[Q02](#research-q02) 终端按 Host 已绑定的设备归属授权。

> **主要限制**：[Q02](#research-q02) 设备和连接校验仍允许授权输入沿 Host 权限运行，[Q03](#research-q03) Linux 托管模式可能以 root 执行。

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
  - [Q01 · 远程客户端怎样接到原宿主，较既有 VPN 增加什么？](#detail-section-11)
  - [Q02 · 终端归属和撤销能约束哪些操作？](#detail-section-12)
  - [Q03 · 安装和长期使用由谁承担权限及故障成本？](#detail-section-13)
  - [Q04 · 如何限定试用，怎样检验断线结果回查？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：离开电脑的开发者可用第二设备读取原 DSH 会话，先验证相同工作区和记录。

既有 VPN 和浏览器也能接入原宿主；插件增加受信设备、客户端入口与按连接的控制面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 原会话访问 | 异地读原 Host 工作 | 需要配对与可达线路 |
| 终端 | 附着并输入远端终端 | 设备归属和 Host 实际权限分别生效 |
| 设备撤销 | 结束设备信任和连接 | 已完成命令需读回 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 受信设备和在线 Host | 必需 | 打开原会话 | 回电脑查看 |
| 可达网络和相应线路 | 远程必需 | 交换认证与业务消息 | 先排查连接并保留结果未知 |
| 低权限隔离环境 | 受控试用条件 | 缩小终端与工具影响 | 保留只读或停止 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配对 | 使用者在隔离 Host 添加受信设备 | 确认设备与工作区 |
| 读取 | 第二设备查已知会话记录 | 与 Host 一致 |
| 退出 | Host 撤销设备并检查结果 | 对执行状态不明先查原主机 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 主机与网络未知 | 配对、确认实际账户 | 托管模式需独立判断 |
| 持续 | 在线电脑、模型和中继未知 | 维护设备和访问权限 | 净节省未测 |
| 失败恢复 | 连接及资源损失未知 | 核对文件、进程和服务 | 未测恢复时间 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨端访问 | 已绑定设备经路由访问 Host | 网络可用性 |
| 终端隔离 | Host 开关、owner 和 attachment | 全部业务副作用 |
| 撤销 | 设备身份撤销及连接清理 | 已执行命令的最终状态 |

> **思考**：[Q02](#research-q02) 设备和连接校验仍允许授权输入沿 Host 权限运行，[Q03](#research-q03) Linux 托管模式可能以 root 执行。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把跨设备连接和原宿主业务接在同一入口，[Q02](#research-q02) 终端按 Host 已绑定的设备归属授权。

Host 按设备和认领对象保护终端，业务路由限在途请求。执行身份与结果确认应单独验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 设备和连接校验仍允许授权输入沿 Host 权限运行，[Q03](#research-q03) Linux 托管模式可能以 root 执行。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从低权限只读工作区核对一条原会话，断线或身份不明时回主机查实际状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码已核查设备认证、远程终端和托管身份。未验证实际线路、双设备、宿主执行或断线恢复。

- 已检查：作者 README、包清单、源码路径 packages/plugin/src/client-secure-transport.ts、packages/plugin/src/connection-controller.ts、packages/plugin/src/rpc-router.ts、packages/plugin/src/service.ts、packages/plugin/src/terminal-policy.ts、packages/plugin/src/harness-remote-bridge.ts、packages/plugin/src/remote-terminal-controller.ts、scripts/install.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查指定客户端加密、Host 连接、Harness 终端和 Linux 脚本。未执行网络、客户端、宿主或命令，未审计全部 ACP、转发、文件及服务端能力。
- 下一步：用两个隔离设备测试归属、撤销和断线，并从 Host 独立核对实际输入与权限。

**分析版本**

- **仓库**：[liguobao/ds-harness-remote](https://github.com/liguobao/ds-harness-remote)
- **版本号**：0.6.4（[固定提交 47ea189](https://github.com/liguobao/ds-harness-remote/tree/47ea1890e75a58c3b336a13f42ed12829c9268da)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用 Host 可回读的请求阶段明确结果未知，可能减少断线时重复操作。

用两个隔离设备测试归属、撤销和断线，并从 Host 独立核对实际输入与权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 58 | 14642 | — | — | 180527 |
| .tsx | source | 75 | 31062 | 29083 | 725 | — |
| .ts | source | 299 | 77992 | 69568 | 3639 | — |
| .js | source | 6 | 998 | 901 | 50 | — |
| .mjs | source | 17 | 1101 | 918 | 93 | — |
| .ts | test | 168 | 48322 | 44375 | 1198 | — |
| .ts | example | 2 | 665 | 613 | 14 | — |
| .md | example | 2 | 61 | — | — | 355 |
| .mjs | test | 1 | 86 | 83 | 0 | — |
| .mjs | example | 1 | 56 | 54 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 35](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=35&color=737b86&logo=github)](https://github.com/liguobao/ds-harness-remote/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：离开电脑的开发者能否用受信设备继续原 DSH 会话，并能识别连接、终端权限和实际命令结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 远程客户端怎样接到原宿主，较既有 VPN 增加什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

在工作电脑运行 DSH、需要从另一台受信设备核对原会话的开发者，可以用一次读取已知会话和工作区作为合格任务。已有 VPN 加浏览器也可接到原宿主；此项目把设备配对和按连接分配业务路由纳入 DSH 及配套客户端，减少另行组织入口。客户端先核对传输的设备 ID，使用已知对端公钥建立 Noise IK，再用该会话加密消息。Host 连接控制拒绝缺认证上下文或未受信设备的通道，每个连接的上下文含已绑定 peer ID，路由再检查消息方法和在途上限。作者还声明 P2P、TURN 和中继回退，本轮只核查选定客户端和 Host 接线，未证明所有客户端、线路和后端均达到同一安全级别。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-49](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/README.md#L28-L49)

作者说明原宿主和跨设备入口，并声明多种线路。

<details>
<summary>查看原文（22行）</summary>

```text
## Connect once. Ready whenever you are.

Continue using your DeepSeek Harness instance from a phone, computer, or browser. Return to the same Harness session from whichever device is with you.

Harness keeps running on your work computer, with the same workspaces, tools, and project setup. DS Harness Remote is simply another window into that environment.

The DeepSeek Harness desktop edition is supported. Install the latest release:

`ds-harness-remote@0.6.4`

## Features

- Access your local Harness instance remotely from the web, a PC, or a mobile device: DSH first, with Codex, Cursor, and Antigravity support too.
- DeepSeek Harness Desktop is ready to use after installation, with its native interface and no separate desktop conversation UI.
- Create workspaces, configure models, and switch conversation models with the same smooth workflow as local use.
- No public listening port or public IP is required on the Harness Host. Connect from anywhere with internet access over a bidirectional end-to-end encrypted channel.
- Prefer P2P connections, use TURN relay nodes worldwide, and fall back to multiple Server Relays when needed.
- Access workspace files, read-only previews, remote terminals, and authorized local development-service previews through the native Harness sidebar.
- Remote Tool context injection supports Host and workspace discovery, Harness session creation and management, history reading, waiting for execution, interruption requests, and authorized file transfers. [Details](packages/plugin/README.md#remote-agent-tools).
- Alongside DeepSeek Harness, access native workspaces for Codex, Cursor, Google Antigravity, Pi, OpenCode, Claude Code, Harness Agent, and other tools through ACP integrations, with remote file browsing and terminals.
- Clients are available across Android, iOS, Web, and native DSH.
- Multiple clients can connect to the same Harness Host simultaneously, with RPC calls and streams isolated per connection.
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/client-secure-transport.ts:31-49](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/client-secure-transport.ts#L31-L49)

客户端核对设备身份并建立 Noise 会话。

<details>
<summary>查看原文（19行）</summary>

```text
    await this.inner.connect()
    lifetime.signal.throwIfAborted()
    const info = this.inner.connectionInfo()
    if (info.localDeviceId !== this.identity.deviceId || info.remoteDeviceId !== this.host.deviceId) {
      await this.inner.close()
      throw Object.assign(new Error('The relay connection is bound to an unexpected device.'), { code: 'PEER_IDENTITY_MISMATCH' })
    }
    const noise = new NoiseIkSession({
      role: 'initiator',
      localPrivateKey: this.identity.privateKey,
      localPublicKey: this.identity.publicKey,
      remotePublicKey: this.host.publicKey,
      prologue: createNoisePrologue(info.connectionId, this.host.deviceId, this.identity.deviceId),
    })
    this.noise = noise
    try {
      await waitForResponder(this.inner, noise, lifetime.signal)
      this.inner.markSecureReady?.()
    } catch (error) {
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/client-secure-transport.ts:59-83](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/client-secure-transport.ts#L59-L83)

业务消息以会话密钥加解密，拒绝异常帧。

<details>
<summary>查看原文（25行）</summary>

```text
  async send(data: Uint8Array): Promise<void> {
    if (data.byteLength > MAX_SECURE_MESSAGE_BYTES) throw new Error('Secure message exceeds the reassembly limit.')
    const noise = this.requireNoise()
    try {
      await this.sends.run(data.byteLength, async () => {
        if (this.closed || this.noise !== noise) throw new Error('Secure transport replaced')
        for (const plaintext of this.outgoing.encode(data)) await this.inner.send(noise.encrypt(plaintext))
      })
    } catch (error) {
      await this.close().catch(() => undefined)
      throw error
    }
  }

  onMessage(handler: (data: Uint8Array) => void): () => void {
    this.unsubscribeInner?.()
    this.unsubscribeInner = this.inner.onMessage(data => {
      const noise = this.noise
      if (noise === undefined || !noise.complete || this.closed) return
      try {
        const message = this.incoming.decode(noise.decrypt(data))
        if (message !== undefined) handler(message)
      } catch {
        this.closeError = Object.assign(new Error('The authenticated Remote channel rejected a frame.'), { code: 'SECURE_CHANNEL_FAILED' })
        void this.close()
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/connection-controller.ts:61-92](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/connection-controller.ts#L61-L92)

Host 拒绝缺认证上下文或未受信设备并绑定连接身份。

<details>
<summary>查看原文（32行）</summary>

```text
    if (channel.security?.protocol !== 'Noise_IK_25519_ChaChaPoly_SHA256'
      || channel.security.connectionId === ''
      || channel.security.membershipId === '') {
      await channel.close('SECURE_CHANNEL_FAILED')
      throw new ConnectionRejectedError('SECURE_CHANNEL_FAILED', 'The channel is missing its authenticated Noise or membership context.')
    }
    if (!this.identities.isTrusted(channel.peerDeviceId, channel.peerIdentityKey)) {
      await channel.close('PEER_IDENTITY_MISMATCH')
      throw new ConnectionRejectedError('PEER_IDENTITY_MISMATCH', 'The peer identity does not match local trust.')
    }
    const connectionId = channel.security.connectionId
    const connectionConflict = this.active.get(connectionId)
    if (connectionConflict !== undefined && connectionConflict.channel.peerDeviceId !== channel.peerDeviceId) {
      await channel.close('SECURE_CHANNEL_FAILED')
      throw new ConnectionRejectedError('SECURE_CHANNEL_FAILED', 'The connection id is already bound to another peer.')
    }

    const replaced = [...this.active.values()].filter(connection => (
      connection.channel.peerDeviceId === channel.peerDeviceId
      || connection.channel.security.connectionId === connectionId
    ))
    if (replaced.length > 0) {
      this.logger?.warn('replacing active peer connection', {
        peerDeviceId: shortId(channel.peerDeviceId),
        replacedCount: replaced.length,
        replacedPeerDeviceIds: replaced.map(connection => shortId(connection.channel.peerDeviceId)),
      })
    }
    await Promise.all(replaced.map(connection => this.disconnect(connection, 'CONNECTION_REPLACED')))

    const router = this.createRouter(
      { connectionId, peerDeviceId: channel.peerDeviceId, transportMode: () => channel.mode },
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/rpc-router.ts:102-127](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/rpc-router.ts#L102-L127)

路由核验请求、方法和在途请求。

<details>
<summary>查看原文（26行）</summary>

```text
  async handle(message: RemoteMessage): Promise<RemoteMessage> {
    if (message.type !== 'rpc.request') {
      return createRpcError(message.id, 'INVALID_MESSAGE', 'Only RPC requests are accepted on the Host business channel.')
    }
    const parsedPayload = wireRequestSchema.safeParse(message.payload)
    if (!parsedPayload.success) return createRpcError(message.id, 'INVALID_MESSAGE', 'The RPC request payload is invalid.')
    if (!apiMethods.has(parsedPayload.data.method)) {
      return createRpcError(message.id, 'METHOD_NOT_FOUND', 'The requested method does not exist.')
    }
    const request = message as RemoteMessage<RpcRequestPayload>
    if (this.active >= this.maxPending) {
      return createRpcError(request.id, 'RATE_LIMITED', 'Too many Host requests are already pending.', undefined, true)
    }
    this.active += 1
    const startedAt = performance.now()
    try {
      const result = await this.invoke(request.payload.method, request.payload.params)
      const subMethod = typeof (request.payload.params as Record<string, unknown> | undefined)?.method === 'string'
        ? String((request.payload.params as Record<string, unknown>).method)
        : undefined
      this.logger?.info('host rpc ok', {
        method: request.payload.method,
        ...(subMethod ? { subMethod } : {}),
        durationMs: Math.round(performance.now() - startedAt),
      })
      return createRpcResponse(request.id, result)
```

</details>

#### 缺口

- 未验证实际配对、线路切换、外部服务器或其他客户端。
  **影响**：不能把固定源的接线扩大为全端的加密和可用性验收。
  **进一步探讨**：用两台隔离受信设备分别测试原会话读回、身份不符和线路切换。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 终端归属和撤销能约束哪些操作？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

Host 给每个 Harness peer 创建 TerminalPolicy，设备来自连接上下文，owner map 在 Host 内共享。终端操作先看开关、会话和终端标识。创建会认领终端，其他设备不能接管；写入及尺寸操作还需同一 attachment。清理比较 claim 对象，旧响应不应释放后来的新认领，列表也按 owner 过滤。桥接在分发前调用策略，撤销受信设备时断开对应连接。加密及设备隔离解决的是谁能连接和操纵该终端，Host 进程实际授予的系统权限依然能执行写文件或命令。断线或撤销只保证走连接清理入口，已经传给终端的输入可能已生效。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/service.ts:103-116](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/service.ts#L103-L116)

peer 构建将设备上下文带入终端策略。

<details>
<summary>查看原文（14行）</summary>

```text
    this.connections = new ConnectionController(this.identities, (context, send) => {
      const peerGateway = this.localGateway?.createPeer?.() ?? this.localGateway
      const harnessRemote = peerGateway?.supportsCarrier === true
        ? new HarnessRemoteBridge(
            peerGateway,
            (event, data) => send(createEvent(event, data)),
            this.logger,
            this.harnessVersion,
            new TerminalPolicy(() => this.terminalEnabled, context.peerDeviceId, this.terminalOwners),
            new CodexWorkspaceBridge(
              (threadId, signal) => this.codex.resolveThreadWorkspace(context.connectionId, threadId),
              () => this.terminalEnabled,
              this.codexWorkspaceState,
              this.terminalSpawner,
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/harness-remote-bridge.ts:311-332](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/harness-remote-bridge.ts#L311-L332)

终端调用在分发前做策略校验。

<details>
<summary>查看原文（22行）</summary>

```text
    if (TERMINAL_STREAMS.has(params.endpoint)) throw new RpcError('METHOD_NOT_ALLOWED', 'Use a stream for this terminal endpoint.')
    if (['settings/update', 'settings/replace', 'settings/mutate'].includes(params.endpoint)) {
      const args = requestArgs(params.payload)
      if (args.ns === 'ds-harness-remote' || args.ns === 'dsh-remote') {
        throw new RpcError('PERMISSION_DENIED', 'Remote access settings can only be changed locally on the Host.')
      }
    }
    await this.checkPluginManagement(params.endpoint, params.payload)
    const reservation = params.endpoint.startsWith('terminal/') ? this.terminal.check(params.endpoint, params.payload) : undefined
    let codexResult: TypertRpcResult | undefined
    if (this.codexWorkspace !== undefined) {
      try {
        codexResult = await this.codexWorkspace.call(params.endpoint, params.payload, AbortSignal.timeout(60_000))
      } catch (error) {
        // Release failed allocations only after their process cleanup succeeds.
        if (reservation !== undefined) {
          this.terminal.result(params.endpoint, params.payload, { ok: false, error: { code: error instanceof RpcError ? error.code : 'FAILED', message: '', details: {} } }, reservation)
        }
        throw error
      }
    }
    if (codexResult !== undefined) return reservation === undefined ? codexResult : this.terminal.result(params.endpoint, params.payload, codexResult, reservation)
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/terminal-policy.ts:28-56](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/terminal-policy.ts#L28-L56)

检查终端开关、owner 与 attachment。

<details>
<summary>查看原文（29行）</summary>

```text
  check(endpoint: string, payload: unknown): { key?: string; created?: boolean; claim?: object } {
    if (!(typeof this.enabled === 'function' ? this.enabled() : this.enabled)) throw new RpcError('TERMINAL_DISABLED',
      'Remote terminal is disabled on this Host. Enable Remote terminal in the Host Remote settings; the switch saves and applies immediately. / 远程终端未开启，请在 Host 的 Remote 设置中开启「远程终端」，开关切换后立即保存并生效。')
    for (const [key, attachment] of this.attachments) if (this.owners.get(key) !== this.deviceId || this.claims.get(key) !== attachment.claim) this.attachments.delete(key)
    const args = z.object({ args: z.record(z.string(), z.unknown()) }).strict().parse(payload).args
    const rawSessionId = args.agentId ?? args.sessionId
    const sessionId = id.parse(rawSessionId)
    // CodeX sessions are deliberately opaque keys here. Their thread/cwd
    // authority is resolved by the CodeX Host domain, never by Harness lookup.
    const codexSession = parseCodexSessionId(sessionId)
    void codexSession
    if (endpoint === 'terminal/environment' || endpoint === 'terminal/shells' || endpoint === 'terminal/list') return {}
    const request = endpoint === 'terminal/create' ? z.object({ id }).passthrough().parse(args.request) : undefined
    const terminalId = id.parse(request?.id ?? args.id)
    const key = `${sessionId}/${terminalId}`
    if (endpoint === 'terminal/create') {
      if (this.owners.has(key) && this.owners.get(key) !== this.deviceId) this.deny()
      if (!this.owners.has(key) && this.owners.size >= 256) throw new RpcError('RATE_LIMITED', 'Too many retained remote terminals.')
      const created = !this.owners.has(key)
      this.owners.set(key, this.deviceId)
      if (created || !this.claims.has(key)) this.claims.set(key, {})
      return { key, created, claim: this.claims.get(key) }
    }
    if (this.owners.get(key) !== this.deviceId) this.deny()
    if (endpoint === 'terminal/follow') this.attachments.set(key, { id: id.parse(args.attachmentId), claim: this.claims.get(key) })
    if (endpoint === 'terminal/write' || endpoint === 'terminal/resize') {
      if (this.attachments.get(key)?.id !== id.parse(args.attachmentId)) this.deny()
    }
    return { key, claim: this.claims.get(key) }
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/terminal-policy.ts:59-72](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/terminal-policy.ts#L59-L72)

旧 claim 保护及列表过滤。

<details>
<summary>查看原文（14行）</summary>

```text
  result(endpoint: string, payload: unknown, result: TypertRpcResult, reservation: { key?: string; created?: boolean; claim?: object }): TypertRpcResult {
    const releases = (!result.ok && reservation.created && result.error.code !== 'TERMINAL_CLEANUP_FAILED') || (result.ok && endpoint === 'terminal/close')
    // Cleanup can finish before an older RPC response. Its response must not
    // release a new allocation that has since claimed the same identity.
    if (reservation.key !== undefined && releases && this.owners.get(reservation.key) === this.deviceId
      && this.claims.get(reservation.key) === reservation.claim) {
      TerminalPolicy.releaseOwner(this.owners, reservation.key)
      this.attachments.delete(reservation.key)
    }
    if (endpoint === 'terminal/list' && result.ok && Array.isArray(result.value)) {
      const args = (payload as { args: Record<string, unknown> }).args
      const session = args.sessionId ?? args.agentId
      return { ok: true, value: result.value.filter(value => typeof value?.id === 'string'
        && this.owners.get(`${session}/${value.id}`) === this.deviceId) }
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/remote-terminal-controller.ts:250-264](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/remote-terminal-controller.ts#L250-L264)

校验后向运行终端写输入或调整尺寸。

<details>
<summary>查看原文（15行）</summary>

```text
      if (endpoint !== 'terminal/write' && endpoint !== 'terminal/resize') throw new RpcError('METHOD_NOT_FOUND', 'The terminal method does not exist.')
      if (identifier(args.attachmentId) !== terminal.controllerId || !terminal.controller
        || !this.subscriptions.has(terminal.controller) || terminal.state !== 'running') throw new RpcError('PERMISSION_DENIED', 'This attachment does not own terminal input.')
      terminal.invalidate()
      if (endpoint === 'terminal/write') {
        if (typeof args.data !== 'string' || Buffer.byteLength(args.data) > MAX_INPUT_BYTES) throw new RpcError('INVALID_MESSAGE', 'Terminal input is invalid or too large.')
        await terminal.process!.write(args.data)
      } else {
        const cols = dimension(args.cols, MAX_COLS), rows = dimension(args.rows, MAX_ROWS)
        await terminal.process!.resize(cols, rows)
        terminal.screen.resize(cols, rows); terminal.cols = cols; terminal.rows = rows
        terminal.emit({ type: 'state', info: terminal.info() })
      }
    })
    return { ok: true }
```

</details>

**依据 6 · 源码核查**：[packages/plugin/src/service.ts:406-409](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/service.ts#L406-L409)

撤销设备会撤销其活动连接。

```text
  async revokePeer(deviceId: string): Promise<boolean> {
    const revoked = await this.identities.revokePeer(deviceId)
    if (revoked) await this.connections.revoke(deviceId)
    return revoked
```

#### 缺口

- 没有真实双设备、撤销和重复输入验收。
  **影响**：不能由连接清理推断终端命令回滚或所有后端权限。
  **进一步探讨**：用两个测试设备尝试跨设备输入、撤销并在 Host 回读进程和文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装和长期使用由谁承担权限及故障成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

远端访问要在线 Host、受信设备、可达网络，以及用户选择的协调与传输配置。Linux 一键脚本要求 root，托管自启动路径只接受 root 用户并生成 User=root 的 unit，虽让 DSH Web 绑定回环，远端工具和终端仍沿该进程权限执行。独立低权限启动若能完成只读查会话，可用于缩小试用范围；本轮没有执行安装。首次投入包括配对、主机权限审阅及网络准备，持续投入包括在线电脑、流量或中继、模型及设备管理。断线时还要花时间区分本地显示、线路故障与远端已执行，当前没有每次合格远程操作的总成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:40-49](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/README.md#L40-L49)

作者说明远程功能及 Host 侧入口。

<details>
<summary>查看原文（10行）</summary>

```text
- Access your local Harness instance remotely from the web, a PC, or a mobile device: DSH first, with Codex, Cursor, and Antigravity support too.
- DeepSeek Harness Desktop is ready to use after installation, with its native interface and no separate desktop conversation UI.
- Create workspaces, configure models, and switch conversation models with the same smooth workflow as local use.
- No public listening port or public IP is required on the Harness Host. Connect from anywhere with internet access over a bidirectional end-to-end encrypted channel.
- Prefer P2P connections, use TURN relay nodes worldwide, and fall back to multiple Server Relays when needed.
- Access workspace files, read-only previews, remote terminals, and authorized local development-service previews through the native Harness sidebar.
- Remote Tool context injection supports Host and workspace discovery, Harness session creation and management, history reading, waiting for execution, interruption requests, and authorized file transfers. [Details](packages/plugin/README.md#remote-agent-tools).
- Alongside DeepSeek Harness, access native workspaces for Codex, Cursor, Google Antigravity, Pi, OpenCode, Claude Code, Harness Agent, and other tools through ACP integrations, with remote file browsing and terminals.
- Clients are available across Android, iOS, Web, and native DSH.
- Multiple clients can connect to the same Harness Host simultaneously, with RPC calls and streams isolated per connection.
```

</details>

**依据 2 · 源码核查**：[scripts/install.sh:24-40](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/scripts/install.sh#L24-L40)

Linux root 和托管模式要求。

<details>
<summary>查看原文（17行）</summary>

```text
os=$(uname -s)
[[ "$os" = Linux || "$os" = Darwin ]] || fail 'Only Linux and macOS are supported.'
if [[ "$os" = Linux ]]; then
  [[ $EUID = 0 ]] || fail 'Linux installation requires root (including with autostart disabled).'
fi
DSH_INSTALL_ROOT=${DSH_INSTALL_ROOT:-/opt/ds-harness-remote}
DSH_SYSTEMD_DIR=${DSH_SYSTEMD_DIR:-/etc/systemd/system}
[[ "$DSH_INSTALL_ROOT" = /* && "$DSH_SYSTEMD_DIR" = /* ]] || fail 'Installation and systemd directories must be absolute.'
autostart=0
if [[ "$os" = Linux ]]; then
  autostart=${DSH_REMOTE_AUTOSTART:-1}
  [[ "$autostart" = 0 || "$autostart" = 1 ]] || fail 'DSH_REMOTE_AUTOSTART must be 0 or 1.'
  [[ "${DSH_SERVICE_USER:-root}" = root ]] || fail 'Only DSH_SERVICE_USER=root is supported; nonroot ownership must be configured manually.'
  if [[ "$autostart" = 1 ]]; then
    command -v systemctl >/dev/null || fail 'systemctl is required; containers may set DSH_REMOTE_AUTOSTART=0.'
    systemctl show-environment >/dev/null 2>&1 || fail 'A running systemd system manager is required; containers may set DSH_REMOTE_AUTOSTART=0.'
    say 'WARNING: the managed service runs as root. Remote Host tools and terminals have root privileges. Web binds only to 127.0.0.1.'
```

</details>

**依据 3 · 源码核查**：[scripts/install.sh:211-219](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/scripts/install.sh#L211-L219)

实际 unit 的运行身份和回环绑定。

```text
  const env = {HOME:process.env.HOME, DSH_HOME:home, PATH:process.env.PATH, DSH_REMOTE_SERVER:config.serverUrl, DSH_REMOTE_DEVICE_NAME:config.deviceName};
  for (const key of ['DSH_REMOTE_TERMINAL_ENABLED', 'DSH_REMOTE_CURSOR_BINARY', 'DSH_REMOTE_ACP_BINARY']) {
    if (process.env[key] !== undefined) env[key] = process.env[key];
  }
  // WorkingDirectory is a single raw path, not an ExecStart-style quoted word.
  // Reject paths the unit parser would trim or treat as line continuation.
  if(home.trim() !== home || /[\\\x00-\x1f\x7f]/.test(home)) abort('Unsupported service working directory');
  const workingDirectory = home.replace(/%/g, '%%');
  const contents = [marker,'[Unit]','Description=DeepSeek Harness Remote Host','After=network-online.target','Wants=network-online.target','[Service]','Type=simple','User=root',`WorkingDirectory=${workingDirectory}`,...Object.entries(env).map(([key,value])=>`Environment=${quote(key+'='+value)}`),`ExecStart=${[command,'--profile',profile,'--no-open','--host','127.0.0.1'].map(x=>quote(x,true)).join(' ')}`,'Restart=on-failure','RestartSec=5','StandardOutput=null','StandardError=null','[Install]','WantedBy=multi-user.target',''].join('\n');
```

#### 缺口

- 未核对已安装实例的运行账户、网络和中继成本。
  **影响**：无法把脚本默认值推广到手工或其他平台安装。
  **进一步探讨**：先读目标主机的实际服务身份及连线，再核对断线和退出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何限定试用，怎样检验断线结果回查？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合有低权限隔离工作区的人先用受信设备打开已知会话，并确认读到同一工作区和记录。先保留终端关闭，只在可丢弃的终端环境验证第二设备的输入是否被拒绝；遇到断线后不明结果，回电脑核对进程和文件再决定是否重试。设计假设是在远端界面用 Host 可读回的请求 ID 和处理阶段记录区分未接收、已执行和结果未知，终端输入若缺业务确认应仍显示未知。对同一测试输入，在发送前、Host 接收后与应答前分别断网，比较用户重复输入次数和误判。无法核对 Host 事实或需要显著额外操作时，仍以原主机确认。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/rpc-router.ts:111-129](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/rpc-router.ts#L111-L129)

请求和返回有 ID，业务动作在生成应答前已执行。

<details>
<summary>查看原文（19行）</summary>

```text
    const request = message as RemoteMessage<RpcRequestPayload>
    if (this.active >= this.maxPending) {
      return createRpcError(request.id, 'RATE_LIMITED', 'Too many Host requests are already pending.', undefined, true)
    }
    this.active += 1
    const startedAt = performance.now()
    try {
      const result = await this.invoke(request.payload.method, request.payload.params)
      const subMethod = typeof (request.payload.params as Record<string, unknown> | undefined)?.method === 'string'
        ? String((request.payload.params as Record<string, unknown>).method)
        : undefined
      this.logger?.info('host rpc ok', {
        method: request.payload.method,
        ...(subMethod ? { subMethod } : {}),
        durationMs: Math.round(performance.now() - startedAt),
      })
      return createRpcResponse(request.id, result)
    } catch (error: unknown) {
      const response = errorResponse(request.id, error)
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/remote-terminal-controller.ts:250-264](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/remote-terminal-controller.ts#L250-L264)

终端写入与返回 ok 是两步。

<details>
<summary>查看原文（15行）</summary>

```text
      if (endpoint !== 'terminal/write' && endpoint !== 'terminal/resize') throw new RpcError('METHOD_NOT_FOUND', 'The terminal method does not exist.')
      if (identifier(args.attachmentId) !== terminal.controllerId || !terminal.controller
        || !this.subscriptions.has(terminal.controller) || terminal.state !== 'running') throw new RpcError('PERMISSION_DENIED', 'This attachment does not own terminal input.')
      terminal.invalidate()
      if (endpoint === 'terminal/write') {
        if (typeof args.data !== 'string' || Buffer.byteLength(args.data) > MAX_INPUT_BYTES) throw new RpcError('INVALID_MESSAGE', 'Terminal input is invalid or too large.')
        await terminal.process!.write(args.data)
      } else {
        const cols = dimension(args.cols, MAX_COLS), rows = dimension(args.rows, MAX_ROWS)
        await terminal.process!.resize(cols, rows)
        terminal.screen.resize(cols, rows); terminal.cols = cols; terminal.rows = rows
        terminal.emit({ type: 'state', info: terminal.info() })
      }
    })
    return { ok: true }
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/service.ts:406-409](https://github.com/liguobao/ds-harness-remote/blob/47ea1890e75a58c3b336a13f42ed12829c9268da/packages/plugin/src/service.ts#L406-L409)

退出可由 Host 撤销设备。

```text
  async revokePeer(deviceId: string): Promise<boolean> {
    const revoked = await this.identities.revokePeer(deviceId)
    if (revoked) await this.connections.revoke(deviceId)
    return revoked
```

#### 缺口

- 任务阶段显示和对照尚未实施。
  **影响**：不确定能否减少重复执行。
  **进一步探讨**：用无破坏性测试输入记录三种断点，回读实际终端与操作结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
