# dsh-plugin-mobile-gateway

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d0697ee](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/tree/d0697ee7ac0238649a185f445dea7e8fce80ebcc)

<!-- BEGIN META -->
[![GitHub ★ 140](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=140&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway) [![npm 30d 5,742](https://img.shields.io/static/v1?label=npm+30d&message=5%2C742&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-mobile-gateway) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-mobile-gateway)
<!-- END META -->

> **功能**：为 DSH 提供设备配对、移动会话同步和可选实验传输。

> **亮点**：[Q01](#research-q01) 将设备配对和宿主会话调用纳入移动端协议。

> **主要限制**：[Q02](#research-q02) 设备认证与宿主授权不同，真实网络边界未验。

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
  - [Q01 · 手机连接怎样到宿主？](#detail-section-11)
  - [Q02 · LAN 和 WebRTC 的信任边界？](#detail-section-12)
  - [Q03 · 怎样试用和退出？](#detail-section-13)
  - [Q04 · 怎样检验重连正确性？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要从受控网络上的移动设备查看或操作 DSH 会话的开发者。

使用原 WebUI 或返回主机操作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 设备连接 | 通过移动协议操作 DSH | 依赖设备与宿主授权 |
| 传输协商 | 选择 WebSocket 或实验 RTC | 实际设备待验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配 DSH 与 Node | 必需 | 挂载网关和宿主 Peer | 保持原入口 |
| 受控 LAN 与兼容客户端 | 移动验证需要 | 连接及配对 | 不开放监听 |
| 授权设备 | LAN 必需 | 鉴权 | 拒绝请求 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对版本并使用虚拟会话 | 限定局域网 |
| 核对 | 操作者验证配对、失败和撤销 | 检查设备与会话状态 |
| 退出 | 关闭监听并撤销设备 | 读回客户端与宿主 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 设备与宿主费用未知 | 配置网络与版本 | 未实测 |
| 持续 | 同步及隧道资源未知 | 维护设备与认证 | 公网成本未测 |
| 恢复 | 重连成本未知 | 核对游标与令牌 | 不得盲目重发 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 移动连接 | 专用认证与宿主 Peer 接线 | 真实授权边界 |
| 协商 | 组内传输选择 | 实际设备可靠性 |

> **思考**：[Q02](#research-q02) 设备认证与宿主授权不同，真实网络边界未验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将设备配对和宿主会话调用纳入移动端协议。

[Q02](#research-q02) 将认证、模式选择与业务激活分层。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 设备认证与宿主授权不同，真实网络边界未验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先只在受控 LAN 检查。[Q02](#research-q02) 设备和 owner Peer 权限需分别验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定网关和作者协议说明，未运行宿主、网络或移动设备。

- 已检查：作者 README、包清单、源码路径 README.md、lib/devices.js、lib/index.mjs、lib/transport-negotiation.mjs、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定代表宿主、鉴权及协商源码，未执行目标。
- 下一步：核对 LAN 拒绝、配对、撤销、重连与会话权限。

**分析版本**

- **仓库**：[Clarklevis1995/dsh-plugin-mobile-gateway](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway)
- **版本号**：0.11.3（[固定提交 d0697ee](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/tree/d0697ee7ac0238649a185f445dea7e8fce80ebcc)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用重连和撤销故障对照传输可靠性。

核对 LAN 拒绝、配对、撤销、重连与会话权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 36 | 8592 | 7906 | 395 | — |
| .md | source | 32 | 9817 | — | — | 139562 |
| .js | source | 2 | 2522 | 2418 | 80 | — |
| .mjs | test | 44 | 7048 | 6663 | 144 | — |
| .cjs | test | 2 | 696 | 663 | 59 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：移动配对如何进入宿主，网络与身份边界在哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 手机连接怎样到宿主？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

希望离开主机后查看或操作同一 DSH 会话的人，原本需要打开原 WebUI 或回到主机。网关接收移动端协议，先核对配对码或设备令牌，再启用业务通道。配对需要稳定设备 ID，已有设备可在有效配对下换令牌。向 DSH 的调用使用宿主创建的 owner Peer，手机不自选宿主身份。增量是统一移动协议与宿主远端调用，而非为每设备建立独立的 DSH 用户。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:2298-2306](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/lib/index.mjs#L2298-L2306)

宿主 Peer 及前置检查

```text
    if (typeof ctx.connection?.createPeer !== 'function') {
      throw new Error('mobile-gateway requires DSH 0.2.1-rc.2 or later with Connection.createPeer')
    }
    // 已配对设备沿用本机用户权限；身份只由 Host 创建，不能由移动端参数指定。
    // 问答与审批仍由本插件的 Host 监听器处理，无需另开 Remote 交互流。
    const peer = ctx.connection.createPeer({ principal: { kind: 'owner' }, interactions: 'none' })
    const api = createDshHostAdapter(ctx.typertGateway, peer, ctx.connection)
    const host = api
    const agentDefaultModel = ctx.agentDefaultModel
```

**依据 2 · 源码核查**：[lib/index.mjs:3291-3331](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/lib/index.mjs#L3291-L3331)

移动连接认证及业务通道

<details>
<summary>查看原文（41行）</summary>

```text
        let device
        let paired
        const credential = extractCredential(req, !!options.allowQueryToken)
        if (credential && credential.kind === 'pairing') {
          const clientDeviceId = extractClientDeviceId(req)
          if (!clientDeviceId) {
            log('pairing rejected: missing or invalid stable device ID')
            rejectUpgrade(socket, 400, 'pairing requires a stable device ID via X-DSH-Device-ID or dsh-device.<id>')
            return
          }
          paired = registry.claimPairing(credential.value, clientDeviceId, extractClientDeviceName(req))
          device = paired && paired.device
          if (!device) {
            log('pairing rejected: invalid, expired, or already-used code')
            rejectUpgrade(socket, 401, 'invalid or expired pairing code')
            return
          }
        } else if (credential && credential.kind === 'token') {
          device = registry.authenticate(credential.value, extractClientDeviceId(req), extractClientDeviceName(req))
        }

        // The separately exposed LAN listener is always authenticated. The
        // management UI's debug auth switch only affects the loopback DSH
        // listener and can never turn a LAN endpoint into an open control
        // plane.
        if ((requireAuth || transport.lan === true) && !device) {
          logAuthRejected(req)
          rejectUpgrade(socket, 401, 'missing or invalid device credential', req.headers['x-dsh-gateway-probe'])
          return
        }

        wss.handleUpgrade(req, socket, head, socketClient => {
          const requestedChannel = req.headers['x-dsh-channel']
          const channel = ['control', 'conversation'].includes(requestedChannel) ? requestedChannel : 'legacy'
          if (!paired && device && channel === 'control' && req.headers['x-dsh-transport-intent'] === 'negotiate-v1' && rtc.available) {
            rtc.attach({ socket: socketClient, device, hello: helloFrame(device, transport),
              activate: (adapter, selectedChannel) => activateBusinessConnection(adapter, device, selectedChannel, transport) })
          } else {
            activateBusinessConnection(new WebSocketMobileTransport(socketClient), device, channel, transport, paired)
          }
        })
```

</details>

**依据 3 · 源码核查**：[lib/devices.js:146-177](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/lib/devices.js#L146-L177)

令牌、换发和认证摘要

<details>
<summary>查看原文（32行）</summary>

```text
      const token = crypto.randomBytes(32).toString('base64url')
      const normalizedClientDeviceId = normalizeClientDeviceId(clientDeviceId)
      let device = normalizedClientDeviceId
        ? devices.find((candidate) => !candidate.revokedAt && candidate.clientDeviceId === normalizedClientDeviceId)
        : undefined
      if (device) {
        // A valid one-time pairing code authorizes credential rotation. Keep
        // the stable server-side device record while replacing its token, so
        // re-pairing one iOS installation never creates duplicate rows.
        device.name = typeof clientDeviceName === 'string' && clientDeviceName.trim() ? clientDeviceName.trim().slice(0, 80) : '未命名设备'
        device.tokenHash = digest(token)
        device.clientDeviceId = normalizedClientDeviceId
      } else {
        device = {
          id: pairing.id,
          name: typeof clientDeviceName === 'string' && clientDeviceName.trim() ? clientDeviceName.trim().slice(0, 80) : '未命名设备',
          clientDeviceId: normalizedClientDeviceId,
          tokenHash: digest(token),
          createdAt: Date.now(),
          lastSeenAt: null,
          revokedAt: null,
        }
        devices.push(device)
      }
      save()
      return { device: publicDevice(device, 0), token }
    },

    authenticate(token, clientDeviceId, clientDeviceName) {
      if (typeof token !== 'string' || token === '') return undefined
      const tokenHash = digest(token)
      const device = devices.find((candidate) => !candidate.revokedAt && safeEqualHex(candidate.tokenHash, tokenHash))
```

</details>

**依据 4 · 作者声明**：[README.md:42-57](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/README.md#L42-L57)

协议及游标口径

<details>
<summary>查看原文（16行）</summary>

````text
## Protocol and DSH Compatibility Layer

Mobile clients use this project's `dsh-mobile-v1`, not DSH's internal Remote protocol. A separate Host Adapter connects to the DSH 0.2.2-rc.1 Remote Gateway. Namespaces such as Session, Workspace, Settings, Commands, Goals, Schedule, Permission Presets, and Plugin Manager, together with their strict parameters, are confined to that adapter. See the [RC2 plugin management integration plan](docs/dsh-0.2.0-rc.2-plugin-management-mobile-integration.md) for request frames and mobile UI design.

DSH 0.2.1-rc.2 requires `peer` on every Remote call. The gateway creates a local-user Peer with `ctx.connection.createPeer()` and disposes of it with the plugin. The Host Adapter injects it into regular requests, initial reads, and live subscriptions; mobile clients cannot choose the caller identity. Questions and approvals still use the gateway's Host listeners. Older gateways that omit it fail with `Cannot read properties of undefined (reading 'signal')`. After upgrading DSH, reinstall this source version and restart `dsh web`; the phone protocol needs no change.

Verify this contract against a locally installed official DSH (real Gateway/Connection, test business services, no user sessions read or written):

```bash
DSH_INSTALL_ROOT=/absolute/path/to/@deepseek-ai/dsh node test/host-official.test.mjs
```

Pairing authentication and `dsh-mobile-v1` / `hello.protocol = 3` are unchanged. Live tokens no longer consume persistent event `seq` values: explicitly subscribe with `assistantStream: true` to receive an atomic `session-snapshot` and separate deltas. Regular `event` frames contain only persistent events. Clients without the new subscription receive persistent messages only.

History responses include `historyFormatVersion` and `cursor`. Clear history caches and install a fresh baseline when the format changes. Pagination with `beforeSeq` or a fork with `atSeq` must also send `historyFormatVersion: 4`.
See the [rc.2 mobile integration guide](docs/dsh-rc2-mobile-integration.md) for current integration and acceptance checks, and the [Remote Gateway refactoring plan](docs/remote-gateway-refactor-plan.md) for earlier migration records.
````

</details>

#### 缺口

- 未运行宿主和真实手机
  **影响**：无法确认支持的实际操作和体验
  **进一步探讨**：在隔离 DSH 验证配对、会话浏览及用户权限

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · LAN 和 WebRTC 的信任边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

独立 LAN listener 普通 HTTP 返回 404，仅允许指定移动路径的 WebSocket 和被接受的来源。即使管理开关关闭设备认证，LAN 仍要求有效设备。宿主挂载入口则遵从 requireAuth。WebRTC 实验路径要求已认证设备且控制通道声明协商；传输会话 ID 绑定选择，组已选择后拒绝冲突模式，选 WebSocket 会关闭 RTC peers。设备被认证和传输被选择属于两层，设备拥有的宿主操作仍应按实际网关功能核对。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:3312-3331](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/lib/index.mjs#L3312-L3331)

LAN 强制设备认证与协商

<details>
<summary>查看原文（20行）</summary>

```text
        // The separately exposed LAN listener is always authenticated. The
        // management UI's debug auth switch only affects the loopback DSH
        // listener and can never turn a LAN endpoint into an open control
        // plane.
        if ((requireAuth || transport.lan === true) && !device) {
          logAuthRejected(req)
          rejectUpgrade(socket, 401, 'missing or invalid device credential', req.headers['x-dsh-gateway-probe'])
          return
        }

        wss.handleUpgrade(req, socket, head, socketClient => {
          const requestedChannel = req.headers['x-dsh-channel']
          const channel = ['control', 'conversation'].includes(requestedChannel) ? requestedChannel : 'legacy'
          if (!paired && device && channel === 'control' && req.headers['x-dsh-transport-intent'] === 'negotiate-v1' && rtc.available) {
            rtc.attach({ socket: socketClient, device, hello: helloFrame(device, transport),
              activate: (adapter, selectedChannel) => activateBusinessConnection(adapter, device, selectedChannel, transport) })
          } else {
            activateBusinessConnection(new WebSocketMobileTransport(socketClient), device, channel, transport, paired)
          }
        })
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:3342-3373](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/lib/index.mjs#L3342-L3373)

独立监听和入口限制

<details>
<summary>查看原文（32行）</summary>

```text
    // DSH intentionally keeps its own WebUI listener on loopback. When LAN
    // mode is enabled, expose a second, narrowly scoped listener that accepts
    // only the authenticated mobile WebSocket path. It does not serve the
    // WebUI or any /mgw management route.
    if (options.lanEnabled === true) {
      lanServer = http.createServer((req, res) => {
        sendJson(res, 404, { error: 'not-found' })
      })
      lanServer.on('upgrade', (req, socket, head) => {
        let pathname
        try {
          pathname = new URL(req.url || '/', 'http://lan.invalid').pathname
        } catch (error) {
          rejectUpgrade(socket, 400, 'invalid WebSocket path')
          return
        }
        if (pathname !== wsPath) {
          rejectUpgrade(socket, 404, 'not found')
          return
        }
        if (!req.socket || !req.socket.remoteAddress || !isAllowedMobileSource(req.socket.remoteAddress)) {
          rejectUpgrade(socket, 403, 'LAN listener accepts private-network clients only')
          return
        }
        handleMobileUpgrade(req, socket, head, { lan: true, port: lanBoundPort })
      })
      lanServer.on('error', (error) => {
        lanListening = false
        lanListenError = error && error.message ? error.message : String(error)
        log(`LAN listener failed: ${lanListenError}`)
      })
      lanServer.listen(options.lanPort, options.lanHost, () => {
```

</details>

**依据 3 · 源码核查**：[lib/transport-negotiation.mjs:305-352](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/lib/transport-negotiation.mjs#L305-L352)

选择状态、拒绝和回落接线

<details>
<summary>查看原文（48行）</summary>

```text
          !sessionId ||
          !validRequestId(msg.requestId) ||
          msg.transportSessionId !== sessionId ||
          !['webrtc', 'websocket'].includes(msg.mode)
        )
          throw transportError('transport/invalid-select')
        if (group.selected && group.selected !== msg.mode) throw transportError('transport/conflicting-select')
        if (
          msg.mode === 'webrtc' &&
          (!['ready', 'active'].includes(phase) || (active() >= config.maxActiveGroups && !group.selected))
        )
          throw transportError('transport/not-ready')
        if (group.selected) {
          send({ kind: 'transport-selected', requestId: msg.requestId, transportSessionId: sessionId, mode: msg.mode })
          return
        }
        group.selected = msg.mode
        phase = 'active'
        clearTimeout(deadline)
        clearTimeout(connectTimer)
        send({ kind: 'transport-selected', requestId: msg.requestId, transportSessionId: sessionId, mode: msg.mode })
        present(false)
        if (msg.mode === 'websocket') {
          closePeers()
          socket.off('message', receive)
          const intercept = (data) => {
            let frame
            try {
              frame = JSON.parse(data.toString())
            } catch {
              return false
            }
            if (!frame?.type?.startsWith?.('transport-')) return false
            try {
              const parsed = parseTransportJson(data)
              if (!authorized(deviceId) || parsed.type !== 'transport-select')
                throw transportError('transport/already-selected')
              select(parsed)
            } catch (error) {
              failure(error)
            }
            return true
          }
          activate(new WebSocketMobileTransport(socket, { intercept }), 'control')
        } else {
          for (const name of RTC_CHANNELS) group.channels[name].transport.activate()
          for (const name of RTC_CHANNELS) activate(group.channels[name].transport, name)
          log(
```

</details>

**依据 4 · 作者声明**：[README.md:9-18](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/README.md#L9-L18)

作者声明实验及设备验收边界

<details>
<summary>查看原文（10行）</summary>

```text
# dsh-plugin-mobile-gateway

> Current source adds experimental **P2P-first** transport. With `webrtc.enabled: true`, compatible clients negotiate two WebRTC DataChannels over the existing authenticated WebSocket and fall back as a group to WebSocket. First use defaults to LAN direct over WebSocket on the same Wi-Fi. Opt into a P2P or other connection plan under Connection & Pairing; saved choices are preserved. Existing clients are unchanged. **Gateway ready for integration; Android/iOS integration and device acceptance are pending. Not released.** See the [client contract](docs/webrtc-app-integration.md), [runtime decision](docs/webrtc-runtime-decision.md), and [acceptance record](docs/webrtc-acceptance.md).


A third-party mobile gateway for DeepSeek Harness with device authentication. Supports sessions and live events; queued-message synchronization, editing, deletion, and Steer; bidirectional session archiving and renaming; stopping and resuming generation; task lists and the current Goal; server-driven command and skill menus; human-in-the-loop workflows; and image and file transfers. After installation, a Mobile Devices entry appears in the Harness WebUI sidebar for enabling the gateway, generating pairing QR codes, and managing trusted devices.

> The current source targets **DSH 0.2.2-rc.1**, requires the Connection Peer interface, and uses Session format 4. Older history cursors require a fresh baseline.
>
> Unreleased source adds ordered chat quotes, Host-wide schedules and plugin updates, and adapts batched projections and image reads. Requires Node.js 24.9+. See the [mobile integration guide](docs/dsh-0.2.2-rc.1-mobile-integration.md).
```

</details>

#### 缺口

- 未验证反代、WebRTC 信令与撤销中止行为
  **影响**：不能支持公网部署或实际设备验收
  **进一步探讨**：隔离网络测试未配对、跨源、撤销与切换

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包声明 Node 24.9 起及 RTC 依赖，README 安装段仍写 22，需以固定制品和目标 DSH 验证。作者面向 DSH 0.2.2-rc.1，并提醒历史格式改变要新基线。先用可丢弃主机数据和同一受控 LAN，保留认证。持续成本包括移动网络、状态同步和可能的隧道运维。失败时撤销测试设备并停止监听，检查客户端缓存和宿主日志。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-28](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/package.json#L23-L28)

运行时依赖

```text
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.1",
    "qrcode": "^1.5.4",
    "werift": "0.25.2",
    "ws": "^8.18.0"
  },
```

**依据 2 · 源码核查**：[package.json:36-60](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/package.json#L36-L60)

分发、组合和 Node 条件

<details>
<summary>查看原文（25行）</summary>

```text
  "exports": {
    ".": "./lib/index.mjs",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ]
    }
  },
  "license": "MIT",
  "devDependencies": {
    "react": "18.3.1",
    "react-test-renderer": "18.3.1"
  },
  "engines": {
    "node": ">=24.9"
```

</details>

**依据 3 · 作者声明**：[README.md:173-213](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/README.md#L173-L213)

作者安装和配对

<details>
<summary>查看原文（41行）</summary>

````text
## Install the Plugin

Requires Node.js 22 or newer. The RTC library is a required runtime dependency installed automatically with the plugin; no separate dependency installation is needed.

Prerequisites: `dsh` CLI and `pnpm` installed, with `dsh web` working. Run `pnpm --version` to ensure the current user can find `pnpm`.

For LAN use, install the plugin:

```bash
dsh plugin --profile web add dsh-plugin-mobile-gateway@latest
```

For public-IP access on a Linux server, use the unified initializer. It installs/updates the plugin and requests sudo once to install the system Helper:

```bash
npx --yes dsh-plugin-mobile-gateway@latest init
```

`init` installs the exact version of the executing npm package into the DSH profile and skips pnpm's new-release waiting period for that version only, keeping plugin and Helper versions aligned.

After installation, stop and restart WebUI:

```bash
dsh web
```

Open WebUI and confirm Mobile Devices appears at the bottom of the left sidebar.

## LAN Pairing

For the DSH computer and mobile device on the same mutually reachable LAN.

1. Open Mobile Devices in WebUI.
2. Set Gateway Mode to Persistent, or Temporary for short pairing sessions.
3. Leave Device Authentication enabled.
4. First use defaults to Direct LAN. Verify `ws://<电脑局域网 IP>:3081/ws/mobile`. For guidance, open Connection & Pairing → Help me choose a connection, then select the phone’s network, host type and Tailscale setup. Review the recommendation and prerequisites; settings are saved only when you choose Use this recommendation. The guide stays collapsed until clicked. Manual connection settings and the pairing address remain visible, including the option to select P2P. Cloudflare Tunnel can remain enabled.
5. Enter a device name and select Generate Pairing QR Code.
6. Open device authentication in the mobile client and scan the QR code.
7. Pairing is complete when the trusted device shows Online in WebUI.

If a firewall blocks the connection, allow TCP `3081` only on private networks. Do not expose 3081 publicly.
````

</details>

**依据 4 · 作者声明**：[README.md:42-57](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/README.md#L42-L57)

历史协议与版本变化

<details>
<summary>查看原文（16行）</summary>

````text
## Protocol and DSH Compatibility Layer

Mobile clients use this project's `dsh-mobile-v1`, not DSH's internal Remote protocol. A separate Host Adapter connects to the DSH 0.2.2-rc.1 Remote Gateway. Namespaces such as Session, Workspace, Settings, Commands, Goals, Schedule, Permission Presets, and Plugin Manager, together with their strict parameters, are confined to that adapter. See the [RC2 plugin management integration plan](docs/dsh-0.2.0-rc.2-plugin-management-mobile-integration.md) for request frames and mobile UI design.

DSH 0.2.1-rc.2 requires `peer` on every Remote call. The gateway creates a local-user Peer with `ctx.connection.createPeer()` and disposes of it with the plugin. The Host Adapter injects it into regular requests, initial reads, and live subscriptions; mobile clients cannot choose the caller identity. Questions and approvals still use the gateway's Host listeners. Older gateways that omit it fail with `Cannot read properties of undefined (reading 'signal')`. After upgrading DSH, reinstall this source version and restart `dsh web`; the phone protocol needs no change.

Verify this contract against a locally installed official DSH (real Gateway/Connection, test business services, no user sessions read or written):

```bash
DSH_INSTALL_ROOT=/absolute/path/to/@deepseek-ai/dsh node test/host-official.test.mjs
```

Pairing authentication and `dsh-mobile-v1` / `hello.protocol = 3` are unchanged. Live tokens no longer consume persistent event `seq` values: explicitly subscribe with `assistantStream: true` to receive an atomic `session-snapshot` and separate deltas. Regular `event` frames contain only persistent events. Clients without the new subscription receive persistent messages only.

History responses include `historyFormatVersion` and `cursor`. Clear history caches and install a fresh baseline when the format changes. Pagination with `beforeSeq` or a fork with `atSeq` must also send `historyFormatVersion: 4`.
See the [rc.2 mobile integration guide](docs/dsh-rc2-mobile-integration.md) for current integration and acceptance checks, and the [Remote Gateway refactoring plan](docs/remote-gateway-refactor-plan.md) for earlier migration records.
````

</details>

#### 缺口

- 未验收设备应用、制品、停用和公网 Helper
  **影响**：实际兼容及成本未知
  **进一步探讨**：限制到 LAN 并验证认证、撤销和关闭

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样检验重连正确性？

**研究主题**：新假设与验证

#### 完整回答

使用相同虚拟会话，对照 WebSocket 和实验 P2P，在协商前、已选择、附件传输中以及设备撤销时主动断网。记录重复命令、状态游标、令牌再使用和恢复时间。若 P2P 在可靠性或恢复方面退步且没有明显收益，则保持已有传输。

#### 证据与依据

**依据 1 · 源码核查**：[lib/transport-negotiation.mjs:305-352](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/lib/transport-negotiation.mjs#L305-L352)

选择状态机

<details>
<summary>查看原文（48行）</summary>

```text
          !sessionId ||
          !validRequestId(msg.requestId) ||
          msg.transportSessionId !== sessionId ||
          !['webrtc', 'websocket'].includes(msg.mode)
        )
          throw transportError('transport/invalid-select')
        if (group.selected && group.selected !== msg.mode) throw transportError('transport/conflicting-select')
        if (
          msg.mode === 'webrtc' &&
          (!['ready', 'active'].includes(phase) || (active() >= config.maxActiveGroups && !group.selected))
        )
          throw transportError('transport/not-ready')
        if (group.selected) {
          send({ kind: 'transport-selected', requestId: msg.requestId, transportSessionId: sessionId, mode: msg.mode })
          return
        }
        group.selected = msg.mode
        phase = 'active'
        clearTimeout(deadline)
        clearTimeout(connectTimer)
        send({ kind: 'transport-selected', requestId: msg.requestId, transportSessionId: sessionId, mode: msg.mode })
        present(false)
        if (msg.mode === 'websocket') {
          closePeers()
          socket.off('message', receive)
          const intercept = (data) => {
            let frame
            try {
              frame = JSON.parse(data.toString())
            } catch {
              return false
            }
            if (!frame?.type?.startsWith?.('transport-')) return false
            try {
              const parsed = parseTransportJson(data)
              if (!authorized(deviceId) || parsed.type !== 'transport-select')
                throw transportError('transport/already-selected')
              select(parsed)
            } catch (error) {
              failure(error)
            }
            return true
          }
          activate(new WebSocketMobileTransport(socket, { intercept }), 'control')
        } else {
          for (const name of RTC_CHANNELS) group.channels[name].transport.activate()
          for (const name of RTC_CHANNELS) activate(group.channels[name].transport, name)
          log(
```

</details>

**依据 2 · 作者声明**：[README.md:54-68](https://github.com/Clarklevis1995/dsh-plugin-mobile-gateway/blob/d0697ee7ac0238649a185f445dea7e8fce80ebcc/README.md#L54-L68)

会话基线和附件控制

<details>
<summary>查看原文（15行）</summary>

```text
Pairing authentication and `dsh-mobile-v1` / `hello.protocol = 3` are unchanged. Live tokens no longer consume persistent event `seq` values: explicitly subscribe with `assistantStream: true` to receive an atomic `session-snapshot` and separate deltas. Regular `event` frames contain only persistent events. Clients without the new subscription receive persistent messages only.

History responses include `historyFormatVersion` and `cursor`. Clear history caches and install a fresh baseline when the format changes. Pagination with `beforeSeq` or a fork with `atSeq` must also send `historyFormatVersion: 4`.
See the [rc.2 mobile integration guide](docs/dsh-rc2-mobile-integration.md) for current integration and acceptance checks, and the [Remote Gateway refactoring plan](docs/remote-gateway-refactor-plan.md) for earlier migration records.

- WebSocket: `/ws/mobile`
- LAN: `ws://<局域网 IP>:3081/ws/mobile`
- Public Linux server: `wss://<公网 IP>/ws/mobile`
- Protocol reference: [PROTOCOL.md](PROTOCOL.md)

The current source adds session mode selection: after creating an empty session, a client can query/change its Agent preset until the first conversation turn. Discover `session-agent-preset` and follow the [client integration guide](docs/session-agent-preset-app-integration.md). Client UI integration is required; this source change is not yet released.

The current source adds `turn-outline-v1`: forwards the full WebUI turn outline and live updates so clients can show turn markers and question/answer previews and paginate to a turn without loading all message bodies. Reconnecting the control channel or connecting a new device restores the outline baseline; if the Host has no outline, fall back to loaded turns. See the [turn navigation guide](docs/turn-outline-app-integration.md). Client UI integration is separate; not yet released.

The current source adds `file-upload-v1`: paired clients upload PDFs, Office files, archives, audio, and other files in chunks over the control connection. SHA-256-verified files enter official DSH attachment storage and are sent with session-scoped credentials. Supports acknowledgments, cancellation, disconnect cleanup, and live/history file references. Uses official WebUI attachment admission rules and never writes to a client-specified host path. See the [file upload guide](docs/file-upload-app-integration.md) for frames, client state machines, limits, and acceptance checks. Client UI integration is separate; not yet released.
```

</details>

#### 缺口

- 未执行对照或读回真实设备行为
  **影响**：不能建立实验传输收益
  **进一步探讨**：用固定测试消息、设备和受控网络运行矩阵

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
