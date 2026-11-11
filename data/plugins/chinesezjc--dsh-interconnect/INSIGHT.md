# DSH Interconnect

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[84de474](https://github.com/Chinesezjc/dsh-interconnect/tree/84de4749de7b37001f90eb38984fee4d8c8248ed)

<!-- BEGIN META -->
[![GitHub ★ 40](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Chinesezjc/dsh-interconnect) [![npm 30d 1,396](https://img.shields.io/static/v1?label=npm+30d&message=1%2C396&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-interconnect) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-interconnect)
<!-- END META -->

> **功能**：通过持久 WebSocket 连接 DeepSeek Harness 实例，提供配对、会话发现和消息交接。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将跨实例寻址、会话投递和结果回执组织到同一工具流。

> **主要限制**：[Q03](#research-q03) unreachable 可能是应答未到，不能证明接收端未处理。

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
  - [Q01 · 什么任务需要跨实例交接？](#detail-section-11)
  - [Q02 · 配对和投递的实际路径是什么？](#detail-section-12)
  - [Q03 · unreachable 能否证明目标没收到？](#detail-section-13)
  - [Q04 · 怎样做可控试用？](#detail-section-14)
  - [Q05 · 持久投递回执能否帮助安全重试？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：操作者需要在两个可信 DSH 实例之间传递任务说明并核对目标会话。

人工复制消息并单独确认目标实例和会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 共享令牌配对 | 建立受控实例寻址 | 需预先共享信任 |
| 消息交接 | 向目标会话投递 | 发送超时应核对远端 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 可信 DSH 实例与共享凭据 | 必需 | 认证链路 | 拒绝连接 |
| 受控网络与目标会话 | 必需 | 交接消息 | 检查链路与会话 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 配置隔离双实例和令牌 | 仅获准对端连接 |
| 发送 | 发合成消息并对照目标 | 目标可确认 |
| 失败 | 暂停重发并查询实际会话 | 对账后决定下一步 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 双宿主与网络 | 配置及核对身份 | 耗时未知 |
| 持续 | 持久连接和模型回合 | 管理对端与复核 | 费用未测 |
| 失败 | 可能有已执行回合 | 确认接收再重试 | 恢复成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 消息交接 | 按实例和会话投递 | 真实可靠性和节时 |
| 故障提示 | 发送端有超时 | 远端最终状态 |

> **思考**：[Q03](#research-q03) unreachable 可能是应答未到，不能证明接收端未处理。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将跨实例寻址、会话投递和结果回执组织到同一工具流。

[Q02](#research-q02) 认证在连接接管之前，[Q03](#research-q03) 发送等待与实际远端执行边界分离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) unreachable 可能是应答未到，不能证明接收端未处理。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用隔离双实例合成消息试用，超时先核对目标，不盲目重发。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定共享凭据、消息与超时路径。未部署真实宿主或网络。

- 已检查：作者 README、包清单、源码路径 src/interconnect/index.ts、src/interconnect/pairing.ts、README.md、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅根 DSH 包中实例消息路径，未全面审计共享技能、工具中继及部署。
- 下一步：人为断开接收后的回执，核对发送状态、目标日志和是否重复处理。

**分析版本**

- **仓库**：[Chinesezjc/dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect)
- **版本号**：0.17.0（[固定提交 84de474](https://github.com/Chinesezjc/dsh-interconnect/tree/84de4749de7b37001f90eb38984fee4d8c8248ed)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 持久任务回执可测试断线后能否区分已处理、未知和可重试。

人为断开接收后的回执，核对发送状态、目标日志和是否重复处理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1690 | — | — | 28573 |
| .mjs | source | 3 | 833 | 560 | 223 | — |
| .cjs | source | 1 | 69 | 60 | 10 | — |
| .ts | source | 6 | 3182 | 1949 | 1094 | — |
| .ts | test | 5 | 4211 | 3647 | 411 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/Chinesezjc/dsh-interconnect/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：两个可信 DSH 实例能否可靠交接会话消息，并正确处理回执丢失？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么任务需要跨实例交接？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护两个独立 DSH 实例的操作者，可能希望把一条任务说明送入另一个会话而保留回话目标。手工复制可完成相同信息传递，但需要自己确认实例和会话。插件将寻址、通知与回执结合，合格结果仍要由目标会话和后续任务状态核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:189-206](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/README.md#L189-L206)

作者描述持久 WS、地址和结果。

<details>
<summary>查看原文（18行）</summary>

```text
### 消息信道：全走 WS（`msg` / `query` 帧）

从 0.9 起**不再有任何 HTTP 端点**——`send`/`reply`/`ping`/`list` 全部在持久 WebSocket 链路
（`/interconnect/link`）上完成。`peers` 映射在激活时**自动 `link()` 每个对端**（心跳 + 指数退避
重连沿用既有实现），寻址按 `instanceId` 查对应链接。

| 帧 | 方向 | 作用 |
|---|---|---|
| `hello` | 双方 | 拨号方自报 instance id |
| `event` | 双方 | 生命周期事件推流 |
| `msg` | 请求方 → 接收方 | 携带 `kind`（`send`/`reply`）、`sessionId`、`text`、`sender`/`delivery`/`resume`、`reqId` |
| `msg-result` | 接收方 → 请求方 | 与 `reqId` 对应的 `SendResult` |
| `query` | 请求方 → 接收方 | `ping` / `list` / `event` 发现与事件查询 |
| `query-result` | 接收方 → 请求方 | 与 `reqId` 对应的查询结果 |

- **出站**：`interconnect_send`/`interconnect_reply`/`ping`/`list` 都发对应帧并等待匹配 `reqId`
  的结果（受 `requestTimeoutMs` 约束）。到**未配置或未联通**的对端直接返回 `unreachable`——
  **没有 HTTP 回退**，这是 0.9 的破坏性变化。
```

</details>

**依据 2 · 源码核查**：[src/interconnect/index.ts:1360-1376](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/index.ts#L1360-L1376)

目标消息归因和正文。

<details>
<summary>查看原文（17行）</summary>

```text
    // Attribute the message to this plugin, not to the human operator: the
    // receiving agent must be able to tell a cross-instance handoff from text
    // its own user typed. The summary names the sender when one was carried, so
    // a GUI/archive can show where the handoff came from without touching the
    // model-facing content.
    const message = createUserMessage({
      source: {
        kind: 'plugin:dsh-interconnect',
        form: 'notice',
        summary: boundContextSummary(
          sender === undefined
            ? `interconnect handoff delivered on instance ${this.instanceId}`
            : `interconnect handoff from ${sender.instanceId} (session ${sender.sessionId}) delivered on instance ${this.instanceId}`,
        ),
      },
      content: [{ type: 'text', text: payload.text }],
    })
```

</details>

#### 缺口

- 未测跨实例手工摩擦和部署频率。
  **影响**：无法推断净节时。
  **进一步探讨**：用两隔离实例对照合成消息定位。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配对和投递的实际路径是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

配对代码用共享 token 签名，并检查过期，不能建立独立的新身份信任。入站 WS 验证 bearer 后才接管 socket。msg 处理先调用 deliver，再发同 reqId 结果。接收端选择目标 live Agent 或允许的恢复路径，排除子代理所拥有的会话，并按配置投递模式调用 Agent。

#### 证据与依据

**依据 1 · 源码核查**：[src/interconnect/pairing.ts:37-62](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/pairing.ts#L37-L62)

HMAC 与认证拒绝。

<details>
<summary>查看原文（26行）</summary>

```text
/** Encode and sign one pairing payload. */
export function encodePairingCode(payload: PairingPayload, token: string): string {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const mac = createHmac('sha256', token).update(body).digest('base64url')
  return `${PAIRING_CODE_PREFIX}.${body}.${mac}`
}

/**
 * Verify and decode one pairing code.
 * @param code - the code produced by {@link encodePairingCode}.
 * @param token - this instance's shared token; must equal the issuer's.
 * @param now - current epoch milliseconds, injectable for expiry tests.
 * @returns the verified payload.
 * @throws Error when the shape, signature, or expiry is invalid.
 */
export function decodePairingCode(code: string, token: string, now: number = Date.now()): PairingPayload {
  const parts = code.trim().split('.')
  if (parts.length !== 3 || parts[0] !== PAIRING_CODE_PREFIX) {
    throw new Error('pairing code has an unknown format')
  }
  const body = parts[1]!
  const supplied = Buffer.from(parts[2]!, 'base64url')
  const expected = createHmac('sha256', token).update(body).digest()
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    throw new Error('pairing code is invalid or was issued with a different DSH_INTERCONNECT_TOKEN')
  }
```

</details>

**依据 2 · 源码核查**：[src/interconnect/pairing.ts:71-86](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/pairing.ts#L71-L86)

字段与过期。

<details>
<summary>查看原文（16行）</summary>

```text
  if (record.v !== 1) throw new Error('pairing code version is not supported')
  if (typeof record.instanceId !== 'string' || record.instanceId.length === 0) {
    throw new Error('pairing code has no instanceId')
  }
  if (typeof record.origin !== 'string' || record.origin.length === 0) {
    throw new Error('pairing code has no origin')
  }
  if (typeof record.nonce !== 'string' || record.nonce.length === 0) {
    throw new Error('pairing code has no nonce')
  }
  if (typeof record.expiresAt !== 'number' || !Number.isFinite(record.expiresAt)) {
    throw new Error('pairing code has no expiry')
  }
  if (record.expiresAt <= now) throw new Error('pairing code has expired')
  if (record.inReplyTo !== undefined && (typeof record.inReplyTo !== 'string' || record.inReplyTo.length === 0)) {
    throw new Error('pairing code has an invalid inReplyTo')
```

</details>

**依据 3 · 源码核查**：[src/interconnect/index.ts:1428-1461](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/index.ts#L1428-L1461)

upgrade 验证及失败关闭。

<details>
<summary>查看原文（34行）</summary>

```text
  private async handleUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer): Promise<void> {
    let token: string | undefined
    try {
      token = await this.resolveToken()
    } catch (error) {
      // Fail closed and end the socket: the caller invokes this as
      // `void handleUpgrade(...)`, so letting the rejection escape would both
      // leave this client hanging on an open socket and surface as an unhandled
      // rejection.
      this.ctx.logger.warn(`interconnect: upgrade token read failed: ${error instanceof Error ? error.message : String(error)}`)
      this.refuseUpgrade(socket, 'HTTP/1.1 403 Forbidden\r\nConnection: close\r\nContent-Length: 9\r\n\r\nforbidden')
      return
    }
    if (token === undefined) {
      this.refuseUpgrade(socket, 'HTTP/1.1 403 Forbidden\r\nConnection: close\r\nContent-Length: 9\r\n\r\nforbidden')
      return
    }
    // The token read is an await, so the service can be torn down (or the
    // webserver route withdrawn) before it settles. Accepting here would add a
    // socket to a pool the teardown already cleared, with no owner left to
    // close it or answer its heartbeat.
    if (this.disposed) {
      this.refuseUpgrade(socket, 'HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\nContent-Length: 11\r\n\r\nunavailable')
      return
    }
    const expected = `Bearer ${token}`
    const header = req.headers.authorization
    if (header === undefined || !timingSafeEqual(header, expected)) {
      this.refuseUpgrade(socket, 'HTTP/1.1 401 Unauthorized\r\nConnection: close\r\nContent-Length: 12\r\n\r\nunauthorized')
      return
    }
    this.server.handleUpgrade(req, socket, head, (websocket) => {
      this.attachSocket(websocket)
    })
```

</details>

**依据 4 · 源码核查**：[src/interconnect/index.ts:1117-1130](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/index.ts#L1117-L1130)

实际投递先于应答。

<details>
<summary>查看原文（14行）</summary>

```text
  private async handleMsgFrame(socket: WebSocket, reqId: string, message: LinkMessage): Promise<void> {
    // Only `send` arrives over the wire: `reply` originates locally (the tool
    // calls `reply()` which sends a regular `send` frame to the recalled
    // sender). A remote `reply` frame would relay arbitrary text through this
    // instance's sender map, so the schema does not admit it.
    const result = await this.deliver({
      sessionId: message.sessionId,
      text: message.text,
      /* v8 ignore next 1 -- schemastery resolves an absent optional `sender` to an empty object, never undefined. */
      ...(message.sender === undefined ? {} : { sender: message.sender }),
      ...(message.delivery === undefined ? {} : { delivery: message.delivery }),
      ...(message.resume === undefined ? {} : { resume: message.resume }),
    })
    this.sendFrame(socket, { type: 'msg-result', reqId, result })
```

</details>

**依据 5 · 源码核查**：[src/interconnect/index.ts:1321-1345](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/index.ts#L1321-L1345)

目标、唤醒与子代理拒绝。

<details>
<summary>查看原文（25行）</summary>

```text
  private async deliver(payload: SendPayload): Promise<SendResult> {
    // A delivery that outlived the service fiber (an inbound frame already in
    // flight when the plugin unloaded) must not drive a disposed agent.
    if (this.disposed) return { delivered: false, instance: this.instanceId, reason: 'unreachable' }
    let agent = this.ctx.agents.get(payload.sessionId as Agent['id'])
    if (agent === undefined) {
      const woken = await this.wake(payload)
      // The fiber may have unwound while the wake resolution was in flight;
      // re-check before touching a woken agent. oxlint's flow analysis treats
      // the two `disposed` reads as the same value, but `await` is a yield
      // point at which the teardown effect can run.
      // oxlint-disable-next-line typescript/no-unnecessary-condition -- the service can dispose during the wake await
      if (this.disposed) return { delivered: false, instance: this.instanceId, reason: 'unreachable' }
      if ('reason' in woken) {
        return { delivered: false, instance: this.instanceId, reason: woken.reason }
      }
      agent = woken.agent
    }
    // One guard covers both paths below: the live hit, exactly as the Host fences
    // it before handing out an agent, and a session this call just woke. A
    // session reserved to subagent routing is delivered to by its parent, so
    // splicing into its inbox here would race that parent.
    if (isSessionOwnedBySubagent(agent.session)) {
      return { delivered: false, instance: this.instanceId, reason: 'session-owned-by-subagent' }
    }
```

</details>

**依据 6 · 源码核查**：[src/interconnect/index.ts:1382-1407](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/index.ts#L1382-L1407)

模式及成功结果。

<details>
<summary>查看原文（26行）</summary>

```text
    const mode: DeliveryMode = payload.delivery ?? this.delivery
    switch (mode) {
      case 'steer':
        agent.steer(message)
        break
      case 'inject':
        agent.inject(message)
        break
      case 'followup':
        agent.followup(message)
        break
      /* v8 ignore next -- closed-union exhaustiveness guard */
      default:
        assertNever(mode)
    }
    // Record the reply target only after the message committed: a delivery that
    // threw leaves no sender behind, so a later reply cannot target a session
    // whose handoff never landed. A message that carries NO sender (an old peer,
    // or an anonymous relay) clears any earlier mapping, so a reply cannot go
    // back to a stale sender from a previous handoff.
    if (sender !== undefined) {
      this.senders.set(payload.sessionId, sender)
    } else {
      this.senders.delete(payload.sessionId)
    }
    return { delivered: true, instance: this.instanceId, delivery: mode }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · unreachable 能否证明目标没收到？

**研究主题**：缺陷与关键质疑

#### 完整回答

发送端超时移除 pending 并返回 unreachable，接收端已调用 Agent 仍可能在应答前断连。源码所示 reqId 用于关联应答，不能由发送失败判断目标没接收或没有后续工作。也不能把 sender 自报身份当作独立授权。重发前要查目标历史或通过受控渠道确认。

#### 证据与依据

**依据 1 · 源码核查**：[src/interconnect/index.ts:580-592](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/index.ts#L580-L592)

发送异常汇总为 unreachable。

<details>
<summary>查看原文（13行）</summary>

```text
  async send(request: SendRequest): Promise<SendResult> {
    const payload: SendPayload = {
      sessionId: request.sessionId,
      text: request.text,
      ...(request.sender === undefined ? {} : { sender: request.sender }),
      ...(request.delivery === undefined ? {} : { delivery: request.delivery }),
      ...(request.resume === undefined ? {} : { resume: request.resume }),
    }
    try {
      const result = await this.msgRequest(request.instanceId, 'send', payload)
      return result ?? { delivered: false, instance: request.instanceId, reason: 'unreachable' }
    } catch {
      return { delivered: false, instance: request.instanceId, reason: 'unreachable' }
```

</details>

**依据 2 · 源码核查**：[src/interconnect/index.ts:992-1018](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/index.ts#L992-L1018)

本地应答等待与清理。

<details>
<summary>查看原文（27行）</summary>

```text
  /** Settle a `reqId` frame against its `*-result`, timing out at `requestTimeoutMs`. */
  private waitForResult(
    reqId: string,
    kind: 'msg' | 'query',
    send: (failure: (error: unknown) => void) => void,
    accept?: (result: unknown) => unknown,
  ): Promise<unknown> {
    return new Promise<unknown>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingMessages.delete(reqId)
        reject(new Error(`interconnect: no result for ${reqId} within ${this.requestTimeoutMs}ms`))
      }, this.requestTimeoutMs)
      const settle = (result: unknown): void => {
        clearTimeout(timer)
        this.pendingMessages.delete(reqId)
        resolve(result)
      }
      // Only a query pending carries a projector; a `msg-result` is projected by
      // `projectMsgResult` at its own settle site.
      this.pendingMessages.set(reqId, kind === 'query'
        ? { timer, kind, accept: accept as (result: unknown) => unknown, resolve: settle }
        : { timer, kind, resolve: settle })
      /* v8 ignore start -- the failure callback is gated by the writable() check; the timeout rejects instead. */
      send((error: unknown) => {
        clearTimeout(timer)
        this.pendingMessages.delete(reqId)
        reject(error instanceof Error ? error : new Error(String(error)))
```

</details>

**依据 3 · 源码核查**：[src/interconnect/index.ts:1117-1130](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/index.ts#L1117-L1130)

接收端先投递再返回。

<details>
<summary>查看原文（14行）</summary>

```text
  private async handleMsgFrame(socket: WebSocket, reqId: string, message: LinkMessage): Promise<void> {
    // Only `send` arrives over the wire: `reply` originates locally (the tool
    // calls `reply()` which sends a regular `send` frame to the recalled
    // sender). A remote `reply` frame would relay arbitrary text through this
    // instance's sender map, so the schema does not admit it.
    const result = await this.deliver({
      sessionId: message.sessionId,
      text: message.text,
      /* v8 ignore next 1 -- schemastery resolves an absent optional `sender` to an empty object, never undefined. */
      ...(message.sender === undefined ? {} : { sender: message.sender }),
      ...(message.delivery === undefined ? {} : { delivery: message.delivery }),
      ...(message.resume === undefined ? {} : { resume: message.resume }),
    })
    this.sendFrame(socket, { type: 'msg-result', reqId, result })
```

</details>

**依据 4 · 源码核查**：[src/interconnect/index.ts:1346-1358](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/index.ts#L1346-L1358)

sender 自报信息用于回信。

<details>
<summary>查看原文（13行）</summary>

```text
    // Remember who sent this message so the receiving session can reply later.
    // `source` never reaches the model, so recording the sender here only sets
    // up reply attribution; the model-facing `content` stays exactly the text
    // that crossed the wire. An absent sender resolves to `{}` under schematery,
    // so test for a real identity rather than `undefined`.
    // The wire shape is untrusted here: a peer may send a partial identity,
    // so validate both fields at runtime before recording a reply target.
    const sender = ((): SenderIdentity | undefined => {
      const candidate: unknown = payload.sender
      if (typeof candidate !== 'object' || candidate === null) return undefined
      const record = candidate as Record<string, unknown>
      if (typeof record.instanceId !== 'string' || typeof record.sessionId !== 'string') return undefined
      return { instanceId: record.instanceId, sessionId: record.sessionId }
```

</details>

#### 缺口

- 未验证特定宿主模式下已排队消息的实际状态。
  **影响**：不能给出可安全自动重发的条件。
  **进一步探讨**：在接收后回执前人为断开，核对目标会话。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样做可控试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

只在两套可信隔离配置建立共享 token 与受控网络路径，选定合成会话用单条无敏感消息测试。避免通过不可信网络传递共享凭据；配置、重连和接收核对有实际维护成本，唤醒或主动处理可能启动模型回合。若身份、网络或回执不清，暂停重复投递并手工核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:95-109](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/README.md#L95-L109)

作者说明配对前提和持久化。

<details>
<summary>查看原文（15行）</summary>

```text
不想手写 `peers` 时，用三步交换 id 和 origin：

1. A 调 `interconnect_pair(origin="http://<A 可拨地址>:<port>")`（同机可省略 `origin`），得到
   10 分钟有效的 code；把 code 发给 B。
2. B 调 `interconnect_pair(code=<A 的 code>, origin="http://<B 可拨地址>:<port>")`：B 添加 A，
   并返回 response code；把 response code 发回 A。
3. A 调 `interconnect_pair(code=<response>)`：A 添加 B，配对完成。

`origin` 默认是本实例的 `http://127.0.0.1:<webServer.port>`；跨机时两端都要在 start/join 时
传各自对端能拨到的隧道或 LAN 地址。code 用 `DSH_INTERCONNECT_TOKEN` 做 HMAC，只有共享同一
token 的实例能验证；code 不含 token，10 分钟过期。配对不建立新信任：两端仍必须配置同一个 token。

配对结果默认写入 `<profileDir>/interconnect-pairings.json`（由 `dsh` 启动的 profile；Desktop
同样适用）。其它启动方式可以用 `pairingFile` 指定文件；两者都没有时只在当前进程内有效，工具会
返回 `persisted: false` 和 warning。静态 `peers` 与配对文件同名时静态配置优先。
```

</details>

**依据 2 · 作者声明**：[README.md:280-286](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/README.md#L280-L286)

作者区分唤醒与计费回合。

```text
# 默认：唤醒并让对方实际处理（会起一个计费回合）
interconnect_send(instanceId="peer", sessionId, text, delivery="followup")

# 唤醒但不起回合：只写入上下文，等对方下次被唤醒时一起读
interconnect_send(instanceId="peer", sessionId, text, delivery="inject")

# 不唤醒：目标保持原样，返回 session-not-live
```

**依据 3 · 源码核查**：[src/interconnect/index.ts:1441-1461](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/index.ts#L1441-L1461)

共享凭据要求。

<details>
<summary>查看原文（21行）</summary>

```text
    if (token === undefined) {
      this.refuseUpgrade(socket, 'HTTP/1.1 403 Forbidden\r\nConnection: close\r\nContent-Length: 9\r\n\r\nforbidden')
      return
    }
    // The token read is an await, so the service can be torn down (or the
    // webserver route withdrawn) before it settles. Accepting here would add a
    // socket to a pool the teardown already cleared, with no owner left to
    // close it or answer its heartbeat.
    if (this.disposed) {
      this.refuseUpgrade(socket, 'HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\nContent-Length: 11\r\n\r\nunavailable')
      return
    }
    const expected = `Bearer ${token}`
    const header = req.headers.authorization
    if (header === undefined || !timingSafeEqual(header, expected)) {
      this.refuseUpgrade(socket, 'HTTP/1.1 401 Unauthorized\r\nConnection: close\r\nContent-Length: 12\r\n\r\nunauthorized')
      return
    }
    this.server.handleUpgrade(req, socket, head, (websocket) => {
      this.attachSocket(websocket)
    })
```

</details>

#### 缺口

- 模型费用和实际网络恢复时间未知。
  **影响**：不能预测交接的总成本。
  **进一步探讨**：核对每条合成任务的网络、人工和模型用量。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 持久投递回执能否帮助安全重试？

**研究主题**：新假设与验证

#### 完整回答

可试验由发送方生成稳定任务 ID，接收方在确认投递结果后可查询对应回执，并拒绝重复消费。即使这样，外部动作与回执之间仍需处理结果未知。用回执丢失、进程重启和重复帧比较目标收到几次、状态可否核实及存储开销。若无法与目标提交建立一致边界，则仍应保留人工处理。

#### 证据与依据

**依据 1 · 源码核查**：[src/interconnect/index.ts:1117-1130](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/index.ts#L1117-L1130)

现有传输 ID 与投递后应答。

<details>
<summary>查看原文（14行）</summary>

```text
  private async handleMsgFrame(socket: WebSocket, reqId: string, message: LinkMessage): Promise<void> {
    // Only `send` arrives over the wire: `reply` originates locally (the tool
    // calls `reply()` which sends a regular `send` frame to the recalled
    // sender). A remote `reply` frame would relay arbitrary text through this
    // instance's sender map, so the schema does not admit it.
    const result = await this.deliver({
      sessionId: message.sessionId,
      text: message.text,
      /* v8 ignore next 1 -- schemastery resolves an absent optional `sender` to an empty object, never undefined. */
      ...(message.sender === undefined ? {} : { sender: message.sender }),
      ...(message.delivery === undefined ? {} : { delivery: message.delivery }),
      ...(message.resume === undefined ? {} : { resume: message.resume }),
    })
    this.sendFrame(socket, { type: 'msg-result', reqId, result })
```

</details>

**依据 2 · 源码核查**：[src/interconnect/index.ts:999-1013](https://github.com/Chinesezjc/dsh-interconnect/blob/84de4749de7b37001f90eb38984fee4d8c8248ed/src/interconnect/index.ts#L999-L1013)

pending 状态在发送方内存。

<details>
<summary>查看原文（15行）</summary>

```text
    return new Promise<unknown>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingMessages.delete(reqId)
        reject(new Error(`interconnect: no result for ${reqId} within ${this.requestTimeoutMs}ms`))
      }, this.requestTimeoutMs)
      const settle = (result: unknown): void => {
        clearTimeout(timer)
        this.pendingMessages.delete(reqId)
        resolve(result)
      }
      // Only a query pending carries a projector; a `msg-result` is projected by
      // `projectMsgResult` at its own settle site.
      this.pendingMessages.set(reqId, kind === 'query'
        ? { timer, kind, accept: accept as (result: unknown) => unknown, resolve: settle }
        : { timer, kind, resolve: settle })
```

</details>

#### 缺口

- 持久回执机制未实现。
  **影响**：重复投递改善未知。
  **进一步探讨**：在同一合成目标做断链和重启试验。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
