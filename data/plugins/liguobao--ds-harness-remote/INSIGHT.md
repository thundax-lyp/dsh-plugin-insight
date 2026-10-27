# DS Harness Remote

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3760737](https://github.com/liguobao/ds-harness-remote/tree/3760737a35eec8e6550256d7f1c485e0078e3341)

<!-- BEGIN META -->
[![GitHub ★ 869](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=869&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liguobao/ds-harness-remote)
<!-- END META -->

> **功能**：从浏览器或移动设备连接原工作电脑上的 DSH 会话、工作区和远程操作。

> **亮点**：[Q01](#research-q01) 相对远程桌面或手工隧道，把原生会话和工作区访问与多端传输回退集中起来；[Q02](#research-q02)与[Q03](#research-q03)显示身份、连接和终端所有权有独立机制，不能把标准Noise算法算原创。

> **主要限制**：[Q03](#research-q03) 显示加密不减少受信任设备已有的系统命令权限，Linux安装器还以root运行；[Q04](#research-q04)说明重连不是写入恰好一次。安全采用必须核对Host账户、设备信任和未知操作结果。

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
  - [Q01 · 跨设备继续同一环境增加什么？](#detail-section-11)
  - [Q02 · 加密设备身份怎样进入业务分发？](#detail-section-12)
  - [Q03 · 加密通道能否限制远程终端危害？](#detail-section-13)
  - [Q04 · 如何在可控范围试用并应对断连？](#detail-section-14)
  - [Q05 · 断连后写操作结果核对能否避免重复？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需离开工作电脑继续自己会话的开发者，可以在可信设备和非关键Host上先验证只读访问。

远程桌面可复用整个电脑，手工隧道可开放Web但要自行管理网络和身份；Remote按会话与多端集成提供增量，不证明比所有替代更安全或更便宜。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 远程RPC | 连接原Host会话和工作区 | 身份可信，具体Host权限另核对 |
| 设备连接 | 校验身份、替换连接、撤销 | 断连不撤销已执行动作 |
| 终端隔离 | 绑定设备和输入attachment | 开关需开启，非OS沙箱 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 在线Host与兼容DSH | 是 | 保留原环境 | 无法远程办事 |
| 服务及网络路径 | 是 | 配对、连接和回退 | 只在本机继续 |
| 本地可信设备身份 | 是 | Noise及连接接受 | 拒绝连接 |
| Host权限理解 | 远程写必需 | 控制系统影响 | 先保持只读/关闭终端 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选非关键Host并核对运行账户 | 不盲用root部署 |
| 配对 | 建立可信设备身份 | 身份不明拒绝 |
| 试用 | 先读取原会话 | 核对同Host状态 |
| 恢复 | 断线先查操作结果 | 不明则回本机 |
| 退出 | 撤销设备并停服务 | 不再接受后续连接 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Host/客户端及服务资源，量未知 | 配对、权限与Host用户核对 | Linux安装器root风险 |
| 持续 | 在线、电力、网络、中继和模型费用未知 | 凭据与版本维护 | 不只一次连接成本 |
| 恢复退出 | 重复调用可能有副作用 | 先核对结果、撤销设备及停服务 | 已执行命令不可撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 身份接线 | Noise远端key与本地设备信任 | 完整注册/密钥生命周期安全 |
| 隔离 | 每连接router及终端owner/attachment | 全Host授权与断线副作用 |
| 接续 | 复用原Host环境 | 弱网成功率、节时和费用 |

> **思考**：[Q03](#research-q03) 显示加密不减少受信任设备已有的系统命令权限，Linux安装器还以root运行；[Q04](#research-q04)说明重连不是写入恰好一次。安全采用必须核对Host账户、设备信任和未知操作结果。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 相对远程桌面或手工隧道，把原生会话和工作区访问与多端传输回退集中起来；[Q02](#research-q02)与[Q03](#research-q03)显示身份、连接和终端所有权有独立机制，不能把标准Noise算法算原创。

[Q03](#research-q03)owner配合claim对象避免旧清理释放新终端，值得迁移；[Q02](#research-q02)finally释放并发计数和撤销关闭流减少状态残留。移植必须保留设备可信来源和Host操作权限，单纯复制加密包装无助于最小权限。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示加密不减少受信任设备已有的系统命令权限，Linux安装器还以root运行；[Q04](#research-q04)说明重连不是写入恰好一次。安全采用必须核对Host账户、设备信任和未知操作结果。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 使用自己的可信设备和非关键Host，先验证只读会话，确认Host用户及身份后才考虑最小写操作；终端关闭直到明确权限。断线时先查实际状态，结果不明不重发；撤销设备后回本机处理。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持Noise身份、连接隔离和终端owner机制；未完整审计注册及全部Host授权，未执行弱网或安装验证。业务结果核对为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/crypto/src/noise.ts、packages/plugin/src/connection-controller.ts、packages/plugin/src/rpc-router.ts、packages/plugin/src/terminal-policy.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Noise包装、连接身份/撤销、RPC白名单、终端owner源码及作者安装说明；未执行插件、测试、Host或网络实验，不作密码学或全业务授权认证。
- 下一步：进一步研究先核查注册和Host业务授权，再对同设备重连、异设备终端及执行后回包前断线进行定向验证；本轮不运行。

**分析版本**

- **仓库**：[liguobao/ds-harness-remote](https://github.com/liguobao/ds-harness-remote)
- **版本号**：0.5.20（[固定提交 3760737](https://github.com/liguobao/ds-harness-remote/tree/3760737a35eec8e6550256d7f1c485e0078e3341)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出按业务操作ID先查询再决定重试的未验证方案，先核对现有Host是否已有实现，再用断线点对照评估重复副作用；不能统一自动重放写调用。

进一步研究先核查注册和Host业务授权，再对同设备重连、异设备终端及执行后回包前断线进行定向验证；本轮不运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 45 | 12736 | — | — | 141277 |
| .tsx | source | 51 | 13657 | 12175 | 947 | — |
| .ts | source | 253 | 58108 | 52251 | 2006 | — |
| .js | source | 4 | 464 | 429 | 18 | — |
| .mjs | source | 14 | 891 | 746 | 69 | — |
| .ts | test | 126 | 31413 | 29224 | 508 | — |
| .ts | example | 2 | 665 | 613 | 14 | — |
| .md | example | 2 | 61 | — | — | 355 |
| .mjs | test | 1 | 86 | 83 | 0 | — |
| .mjs | example | 1 | 56 | 54 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/liguobao/ds-harness-remote/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 51](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=51&color=737b86&logo=github)](https://github.com/liguobao/ds-harness-remote/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 43](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=43&color=737b86&logo=github)](https://github.com/liguobao/ds-harness-remote/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨设备继续同一DSH环境时，加密身份、业务权限和远程操作风险能否明确分开？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨设备继续同一环境增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户在离开工作电脑后，仍要用原工作区、工具与会话继续任务，合格结果是访问同一Host状态而非在手机重建项目。项目把DSH原生界面接到浏览器/Android等客户端，声明不要求Host公网端口，优先P2P并提供TURN及Server Relay。相比远程桌面，场景聚焦会话及工作区；相比自建隧道，注册和传输回退更集中，但增加账号、设备信任及中继依赖。不能据支持多后端就宣称它们权限语义完全相同。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-56](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/README.md#L30-L56)

同Host环境、客户端与传输回退的产品主张。

<details>
<summary>查看原文（27行）</summary>

```text
## Connect once. Ready whenever you are.

Continue using your DeepSeek Harness instance from a phone, computer, or browser.

Return to the same Harness session from whichever device is with you.

Harness keeps running on your work computer, with the same workspaces, tools, and project setup.

DS Harness Remote is simply another window into that environment.

The DeepSeek Harness desktop edition is supported. Install the latest release:

`ds-harness-remote@0.5.20`

## Features

- Access your local Harness instance remotely from the web, a PC, or a mobile device: DSH first, with Codex, Cursor, and Antigravity support too.
- Use the native DeepSeek Harness interface without a separate desktop conversation UI.
- Create workspaces, configure models, and switch conversation models with the same smooth workflow as local use.
- Support DeepSeek Harness Desktop, ready to use after installation.
- Run a terminal-only [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) profile as a Host.
- No public listening port or public IP is required on the Harness Host. Connect from anywhere with internet access over a bidirectional end-to-end encrypted channel.
- Prefer P2P connections, use TURN relay nodes worldwide, and fall back to Server Relay when needed.
- Access workspace files, read-only previews, remote terminals, and authorized local development-service previews through the native Harness sidebar.
- CodeX and ACP terminals use the Host's default shell in the session directory and restore the terminal screen on reconnect.
- Android keeps per-conversation drafts and reading positions, offers backend-separated search
  and local favorites. Conversation text is loaded from the connected Host.
```

</details>

**依据 2 · 作者声明**：[README.md:78-89](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/README.md#L78-L89)

客户端状态及连接隔离声明。

<details>
<summary>查看原文（12行）</summary>

```text
## Supported clients

| Client | Form | Status | Notes |
| --- | --- | --- | --- |
| DSH&nbsp;Desktop&nbsp;plugin | Remote sidebar | Supported | Install `ds-harness-remote@0.5.20`; this computer can also be the Host |
| Web | Browser page | Supported | Open [https://dsh.r2049.cn](https://dsh.r2049.cn); reuses the native Harness interface |
| Android | Native app | Supported | Download the APK from [Releases](https://github.com/liguobao/ds-harness-remote/releases/latest); see the [Android guide](apps/android/README.md) |
| iOS | TestFlight beta | Beta | Not publicly released; see [issue #20](https://github.com/liguobao/ds-harness-remote/issues/20) |
| Browser&nbsp;extension | Chrome | Entry point only | Exchanges an already signed-in Web authorization for a separate device credential, lists online Hosts and opens the same-origin Remote Web; it does not host a conversation UI |
| dsh-TUI | Terminal-only CLI | Supported | Can act as a Host; see the [dsh-TUI Remote guide](docs/dsh-tui.md). The installer never creates a Web service for it automatically |

Several clients can connect to the same Host at once; RPC calls and streams are isolated per connection.
```

</details>

#### 缺口

- 远程任务成功率、弱网体验和独立用户需求未验证
  **影响**：不能判断相对远程桌面总体更优
  **进一步探讨**：用同一会话的读取、确认和有限操作比较远程桌面及Remote的步骤和失败率

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 加密设备身份怎样进入业务分发？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Noise包装固定IK套件，握手读入和完成时核对远端static key与本地预期值；握手未完成时拒绝业务encrypt/decrypt。ConnectionController先检查认证协议及connection/membership上下文，再以deviceId和identityKey查询本地信任；同设备旧连接先断开，每条新连接独立创建router。业务帧只接受rpc.request，经严格payload解析、方法allowlist及最大128个pending限制后分发，finally释放计数。设备撤销会断开匹配连接，处理后也检查是否仍活动才回响应。这是可追溯的身份到RPC组织，尚不等于完整配对注册及所有Host方法授权已被审计。

#### 证据与依据

**依据 1 · 源码核查**：[packages/crypto/src/noise.ts:34-49](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/packages/crypto/src/noise.ts#L34-L49)

固定套件与预期远端key。

<details>
<summary>查看原文（16行）</summary>

```text
  constructor(options: NoiseIkSessionOptions) {
    const localPrivate = requireKey(options.localPrivateKey, 'local private key')
    const localPublic = requireKey(options.localPublicKey, 'local public key')
    this.expectedRemoteStatic = requireKey(options.remotePublicKey, 'remote public key')
    const initiator = options.role === 'initiator'
    this.handshake = new NqHandshake(noiseIk(), {
      prologue: Uint8Array.from(options.prologue),
      initiator,
      s: { secretKey: localPrivate, publicKey: localPublic },
      ...(initiator ? { rs: Uint8Array.from(this.expectedRemoteStatic) } : {}),
      cipher: chachaPoly,
      hash: sha256H,
      rng: options.random ?? randomBytes,
    })
    if (this.handshake.getName() !== NOISE_IK_PROTOCOL) {
      throw new NoiseSessionError('NOISE_SUITE_MISMATCH', 'The Noise provider selected an unexpected cipher suite.')
```

</details>

**依据 2 · 源码核查**：[packages/crypto/src/noise.ts:70-117](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/packages/crypto/src/noise.ts#L70-L117)

握手校验及完成前拒绝业务加解密。

<details>
<summary>查看原文（48行）</summary>

```text
  readHandshake(message: Uint8Array): Uint8Array {
    this.assertHandshake(true)
    const output = new Uint8Array(message.byteLength)
    const length = this.handshake.readMessage(message, output)
    this.verifyRemoteStatic()
    this.finishIfReady()
    return output.slice(0, length)
  }

  encrypt(plaintext: Uint8Array): Uint8Array {
    this.assertLive()
    if (this.transport === undefined) throw new NoiseSessionError('NOISE_NOT_READY', 'The Noise handshake is not complete.')
    return this.transport.sendVec(plaintext)
  }

  decrypt(ciphertext: Uint8Array): Uint8Array {
    this.assertLive()
    if (this.transport === undefined) throw new NoiseSessionError('NOISE_NOT_READY', 'The Noise handshake is not complete.')
    return this.transport.receiveVec(ciphertext)
  }

  sendingCounter(): bigint {
    if (this.transport === undefined) return 0n
    return this.transport.sendingNonce()
  }

  receivingCounter(): bigint {
    if (this.transport === undefined) return 0n
    return this.transport.receivingNonce()
  }

  destroy(): void {
    this.destroyed = true
    this.expectedRemoteStatic.fill(0)
    this.transport = undefined
  }

  private finishIfReady(): void {
    if (!this.handshake.isFinished()) return
    this.verifyRemoteStatic()
    this.transport = this.handshake.finalize()
  }

  private verifyRemoteStatic(): void {
    const actual = this.handshake.getRemoteStatic()
    if (actual === undefined || !constantTimeEqual(actual, this.expectedRemoteStatic)) {
      this.destroy()
      throw new NoiseSessionError('PEER_IDENTITY_MISMATCH', 'The Noise peer static key does not match local trust.')
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/connection-controller.ts:59-101](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/packages/plugin/src/connection-controller.ts#L59-L101)

本地信任、连接替换与独立router。

<details>
<summary>查看原文（43行）</summary>

```text
  private async acceptOne(channel: AuthenticatedPeerChannel): Promise<void> {
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
      { connectionId, peerDeviceId: channel.peerDeviceId },
      message => this.sendTo(connectionId, channel, message),
    )
    const connection: ActiveConnection = {
      channel,
      router,
      unsubscribe: () => undefined,
    }
    this.active.set(connectionId, connection)
    try {
      connection.unsubscribe = channel.onMessage(message => { void this.handle(connection, message) })
```

</details>

**依据 4 · 源码核查**：[packages/plugin/src/connection-controller.ts:150-172](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/packages/plugin/src/connection-controller.ts#L150-L172)

撤销断连及响应前活动性复核。

<details>
<summary>查看原文（23行）</summary>

```text
  async revoke(deviceId: string): Promise<void> {
    const revoked = [...this.active.values()].filter(connection => connection.channel.peerDeviceId === deviceId)
    await Promise.all(revoked.map(connection => this.disconnect(connection, 'DEVICE_REVOKED')))
  }

  async closeConnection(connectionId: string, code?: string, detail?: ConnectionCloseDetail): Promise<boolean> {
    const connection = this.active.get(connectionId)
    if (connection === undefined) return false
    await this.disconnect(connection, code, detail)
    return true
  }

  async close(): Promise<void> {
    await this.acceptQueue
    await Promise.all([...this.active.values()].map(connection => this.disconnect(connection)))
  }

  private async handle(connection: ActiveConnection, message: RemoteMessage): Promise<void> {
    if (!this.isActive(connection)) return
    try {
      const response = await connection.router.handle(message)
      if (!this.isActive(connection)) return
      const outbound = encodeMessage(response).byteLength <= MAX_SECURE_MESSAGE_BYTES
```

</details>

**依据 5 · 源码核查**：[packages/plugin/src/rpc-router.ts:102-144](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/packages/plugin/src/rpc-router.ts#L102-L144)

方法白名单、严格解析与并发限制。

<details>
<summary>查看原文（43行）</summary>

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
    } catch (error: unknown) {
      const response = errorResponse(request.id, error)
      const failedEndpoint = !request.payload.method.startsWith('workspace.upload.')
        && typeof (request.payload.params as Record<string, unknown> | undefined)?.endpoint === 'string'
        ? String((request.payload.params as Record<string, unknown>).endpoint)
        : undefined
      this.logger?.warn('host rpc failed', {
        method: request.payload.method,
        ...(failedEndpoint ? { endpoint: failedEndpoint } : {}),
        durationMs: Math.round(performance.now() - startedAt),
        code: response.payload.code,
        retryable: response.payload.retryable,
      })
      return response
    } finally {
      this.active -= 1
    }
```

</details>

#### 缺口

- 配对发放、全Host业务权限及传输切换的端到端行为未完整验证
  **影响**：不能把局部Noise检查当完整安全认证
  **进一步探讨**：继续核查注册token和membership签发、Host方法范围、设备撤销中的在途副作用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 加密通道能否限制远程终端危害？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

加密只处理信道与对端身份，获信任设备仍可能拥有Host真实操作能力。TerminalPolicy先检查远程终端开关，再用Host寿命内owner map和连接attachment管理终端；异设备不能claim同终端，写入和resize要求已绑定attachment，旧请求结果用claim对象避免释放新分配。它提供具体隔离，而非只是界面按钮。但owner map不是操作系统沙箱；README明确Linux安装器以root运行Host和远程工具，可信设备的错误命令可能有root影响。终端开关、受信任账号与Host运行用户必须共同考虑，不能由端到端加密推出最小权限。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/terminal-policy.ts:28-56](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/packages/plugin/src/terminal-policy.ts#L28-L56)

开关、owner及attachment校验。

<details>
<summary>查看原文（29行）</summary>

```text
  check(endpoint: string, payload: unknown): { key?: string; created?: boolean; claim?: object } {
    if (!(typeof this.enabled === 'function' ? this.enabled() : this.enabled)) throw new RpcError('TERMINAL_DISABLED',
      'Remote terminal is disabled on this Host. Enable Remote terminal in the Host Remote settings; the switch saves and applies immediately. / 远程终端未开启，请在 Host 的 Remote 设置中开启「远程终端」，开关切换后立即保存并生效。')
    for (const [key, attachment] of this.attachments) if (this.owners.get(key) !== this.deviceId || this.claims.get(key) !== attachment.claim) this.attachments.delete(key)
    const args = z.object({ args: z.record(z.unknown()) }).strict().parse(payload).args
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

**依据 2 · 源码核查**：[packages/plugin/src/terminal-policy.ts:59-77](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/packages/plugin/src/terminal-policy.ts#L59-L77)

结果清理用claim避免旧响应释放新终端。

<details>
<summary>查看原文（19行）</summary>

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
    }
    return result
  }

  private deny(): never { throw new RpcError('PERMISSION_DENIED', 'This terminal or input attachment belongs to another connection or device.') }
```

</details>

**依据 3 · 作者声明**：[README.md:121-125](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/README.md#L121-L125)

Linux安装器以root运行的重要权限边界。

```text
### Plugin installer

The sole installer is `scripts/install.sh`:

- **Linux:** requires root; reuses an existing DSH or bootstraps private Node.js/DSH, accepts a one-time Host registration token, and enables/starts a systemd system service. The Host and remote tools run as **root**; grant access only to trusted accounts.
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何在可控范围试用并应对断连？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合确需访问自己工作电脑且能管理设备凭据的开发者，先在非关键Host验证只读会话，再开放明确需要的操作，终端保持关闭直到理解Host权限。首次需Host持续在线、远程服务账号或自托管及客户端；持续承担网络、电力、模型调用、中继与兼容维护，金额和时间均无本轮实测。断线后先读当前会话或任务状态再决定重试；ConnectionController只保证旧连接替换与消息路由，不能从该机制推导写操作恰好一次。退出时撤销设备并停止Host服务，已执行命令不可撤回。未知结果反复出现、终端权限不可控或无法确认连接的Host时停止远程写入，改本地处理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:46-56](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/README.md#L46-L56)

Host持续环境及远程终端范围。

<details>
<summary>查看原文（11行）</summary>

```text
- Access your local Harness instance remotely from the web, a PC, or a mobile device: DSH first, with Codex, Cursor, and Antigravity support too.
- Use the native DeepSeek Harness interface without a separate desktop conversation UI.
- Create workspaces, configure models, and switch conversation models with the same smooth workflow as local use.
- Support DeepSeek Harness Desktop, ready to use after installation.
- Run a terminal-only [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) profile as a Host.
- No public listening port or public IP is required on the Harness Host. Connect from anywhere with internet access over a bidirectional end-to-end encrypted channel.
- Prefer P2P connections, use TURN relay nodes worldwide, and fall back to Server Relay when needed.
- Access workspace files, read-only previews, remote terminals, and authorized local development-service previews through the native Harness sidebar.
- CodeX and ACP terminals use the Host's default shell in the session directory and restore the terminal screen on reconnect.
- Android keeps per-conversation drafts and reading positions, offers backend-separated search
  and local favorites. Conversation text is loaded from the connected Host.
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/connection-controller.ts:77-101](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/packages/plugin/src/connection-controller.ts#L77-L101)

同设备重连替换旧连接。

<details>
<summary>查看原文（25行）</summary>

```text
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
      { connectionId, peerDeviceId: channel.peerDeviceId },
      message => this.sendTo(connectionId, channel, message),
    )
    const connection: ActiveConnection = {
      channel,
      router,
      unsubscribe: () => undefined,
    }
    this.active.set(connectionId, connection)
    try {
      connection.unsubscribe = channel.onMessage(message => { void this.handle(connection, message) })
```

</details>

**依据 3 · 源码核查**：[packages/plugin/src/connection-controller.ts:150-172](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/packages/plugin/src/connection-controller.ts#L150-L172)

撤销和响应活动性检查不能撤销既有业务副作用。

<details>
<summary>查看原文（23行）</summary>

```text
  async revoke(deviceId: string): Promise<void> {
    const revoked = [...this.active.values()].filter(connection => connection.channel.peerDeviceId === deviceId)
    await Promise.all(revoked.map(connection => this.disconnect(connection, 'DEVICE_REVOKED')))
  }

  async closeConnection(connectionId: string, code?: string, detail?: ConnectionCloseDetail): Promise<boolean> {
    const connection = this.active.get(connectionId)
    if (connection === undefined) return false
    await this.disconnect(connection, code, detail)
    return true
  }

  async close(): Promise<void> {
    await this.acceptQueue
    await Promise.all([...this.active.values()].map(connection => this.disconnect(connection)))
  }

  private async handle(connection: ActiveConnection, message: RemoteMessage): Promise<void> {
    if (!this.isActive(connection)) return
    try {
      const response = await connection.router.handle(message)
      if (!this.isActive(connection)) return
      const outbound = encodeMessage(response).byteLength <= MAX_SECURE_MESSAGE_BYTES
```

</details>

#### 缺口

- 中继费用、弱网恢复及写操作结果核对体验未知
  **影响**：无法保证便宜或自动恢复
  **进一步探讨**：在非关键Host记录断连时任务状态与实际结果，不重复提交未知操作；分列资源、现金与人工

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 断连后写操作结果核对能否避免重复？

**研究主题**：新假设与验证

#### 完整回答

连接更换会让响应不可达，但业务动作可能已开始，因此可推导未验证的结果核对假设：对有持久化或外部副作用的操作分配稳定业务ID，在重连时先查询结果，再由用户决定重试；不能用RPC消息ID直接宣称跨重连幂等。先逐类确认当前Host接口是否已有这种机制，不为所有调用统一自动重放。最小实验对同一可回滚操作在执行前、执行后回包前断线，比较重新发送与先核对，统计重复副作用、未知持续时间和额外维护。若下游不支持可靠身份/查询或方案不能减少重复，则否定或只限只读调用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin/src/connection-controller.ts:167-179](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/packages/plugin/src/connection-controller.ts#L167-L179)

动作后活动性检查可抑制响应但不能逆转invoke副作用。

<details>
<summary>查看原文（13行）</summary>

```text
  private async handle(connection: ActiveConnection, message: RemoteMessage): Promise<void> {
    if (!this.isActive(connection)) return
    try {
      const response = await connection.router.handle(message)
      if (!this.isActive(connection)) return
      const outbound = encodeMessage(response).byteLength <= MAX_SECURE_MESSAGE_BYTES
        ? response
        : createRpcError(
            message.id,
            'RESPONSE_TOO_LARGE',
            'The Host response is too large for the secure Remote channel. Request a smaller page.',
            { maxBytes: MAX_SECURE_MESSAGE_BYTES },
            true,
```

</details>

**依据 2 · 源码核查**：[packages/plugin/src/rpc-router.ts:115-143](https://github.com/liguobao/ds-harness-remote/blob/3760737a35eec8e6550256d7f1c485e0078e3341/packages/plugin/src/rpc-router.ts#L115-L143)

RPC计数与返回只覆盖连接内处理。

<details>
<summary>查看原文（29行）</summary>

```text
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
      const failedEndpoint = !request.payload.method.startsWith('workspace.upload.')
        && typeof (request.payload.params as Record<string, unknown> | undefined)?.endpoint === 'string'
        ? String((request.payload.params as Record<string, unknown>).endpoint)
        : undefined
      this.logger?.warn('host rpc failed', {
        method: request.payload.method,
        ...(failedEndpoint ? { endpoint: failedEndpoint } : {}),
        durationMs: Math.round(performance.now() - startedAt),
        code: response.payload.code,
        retryable: response.payload.retryable,
      })
      return response
    } finally {
      this.active -= 1
```

</details>

#### 缺口

- 现有Host业务API幂等范围未全面核查
  **影响**：该设计可能已有或无法通用
  **进一步探讨**：检查各写方法现有业务ID与状态查询，按操作类别验证而非全局重放

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
