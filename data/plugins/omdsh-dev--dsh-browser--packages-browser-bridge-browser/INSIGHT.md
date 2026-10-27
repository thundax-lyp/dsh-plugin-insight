# dsh-bridge-browser

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[23895d7](https://github.com/omdsh-dev/dsh-browser/tree/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser)

<!-- BEGIN META -->
[![GitHub ★ 908](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=908&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-browser)
<!-- END META -->

> **功能**：在DSH与浏览器扩展之间提供WebSocket桥、会话事件和文本浏览器工具。

> **亮点**：将宿主工具和会话接到真实浏览器扩展，保留登录状态并明确文本页面与图像消息通道；DOM执行和审批属于扩展侧。[Q01](#research-q01)

> **主要限制**：本地Chrome免token信任扩展Origin类别而非唯一ID；取消帧只控制尚未完成流程，不保证网页操作回滚，单连接替换后要核对状态。[Q02](#research-q02)

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
  - [Q01 · 桥接组件相对独立浏览器脚本增加什么？](#detail-section-11)
  - [Q02 · 桥认证与取消在实际执行路径约束什么？](#detail-section-12)
  - [Q03 · 为什么不能只安装一个npm包就用？](#detail-section-13)
  - [Q04 · 桥的有界取消设计值得如何复用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：让DSH用户从会话操作已有登录浏览器，桥承担宿主到扩展的工具传输。

独立Playwright浏览器上下文或人工浏览；前者隔离与测试便利，后者不需桥，但真实登录上下文接入需额外工作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工具桥接 | DSH调用真实浏览器动作 | 扩展必须连接并审批 |
| 会话事件通道 | 侧栏聊天和宿主同步 | 单活动连接 |
| 超时与取消 | 撤回尚待执行的请求 | 不等于网页事务回滚 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 0.2.0-rc.2及桥构建产物 | 本版本必需 | 宿主API和工具注册 | 老宿主不支持，不凭相近版本推断 |
| 对应Chrome/Firefox扩展 | 工具执行必需 | DOM操作与用户审批 | 仅桥连接没有可用页面 |
| bearer token | 非本地Chrome免token路径必需 | 桥握手 | token无效则关闭 |
| 明确页面共享与审批策略 | 使用必需 | 控制真实登录页面 | 不可信网络不暴露宿主 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户审阅并固定源码/安装版本 | 桥和扩展来自同一受控构建 |
| 2 | 加载宿主及扩展，核对连接配置 | hello成功后测试只读页面 |
| 3 | 在测试站点核对审批与取消 | 目标tab和动作状态符合预期 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、桥和扩展构建 | 手动加载与token配置 | 不能仅用通用plugin命令 |
| 持续使用 | 快照占模型上下文 | 维护宿主/扩展一致性及审批 | 字符上限不是固定token账单 |
| 失败恢复 | 重读页面和调用可能追加费用 | 先查页面实际状态再决定重试 | 单连接替换导致进行中动作需对账 |
| 退出 | 保留宿主会话 | 卸载扩展/桥并轮换token | 禁用不会撤销既有网站修改 |

熟悉DSH的用户可在本地非敏感测试站点试用，不把它暴露到不可信网络。需要多用户通用鉴权或严格事务撤销时不宜直接扩大使用。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 传输可取消 | abort/timeout发取消帧 | 已执行网页动作的撤销 |
| 桥认证 | token及本地Chrome例外条件 | 特定扩展信任策略是否足够 |
| 登录复用 | 经扩展操作真实浏览器 | 同任务节时与成功率 |

> **思考**：本地Chrome免token信任扩展Origin类别而非唯一ID；取消帧只控制尚未完成流程，不保证网页操作回滚，单连接替换后要核对状态。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将宿主工具和会话接到真实浏览器扩展，保留登录状态并明确文本页面与图像消息通道；DOM执行和审批属于扩展侧。[Q01](#research-q01)

值得借鉴的是请求ID、expiresAt和取消帧一起跨传输携带，而不是只在调用方停止等待；事件流失败关闭连接，避免界面显示连接健康却丢失宿主事件。token以原字符串字节比较，也避免把非hex配置错误截断。移植仍需接收侧在操作前检查取消，不能只复制发送端代码。

<a id="detail-section-5"></a>

### 1.4 主要限制

本地Chrome免token信任扩展Origin类别而非唯一ID；取消帧只控制尚未完成流程，不保证网页操作回滚，单连接替换后要核对状态。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉DSH的用户可固定宿主与扩展版本，在本地非敏感测试站点试用；先检查页面共享、目标tab与取消；需通用多用户鉴权或事务撤销时暂不扩大使用。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

鉴权条件和发送端取消有源码支持；本地扩展信任与网页副作用终态未运行验证。

- 已检查：作者 README、包清单、源码路径 packages/browser/bridge-browser/README.md、packages/browser/bridge-browser/src/server.ts、packages/browser/bridge-browser/src/token.ts、packages/browser/bridge-browser/package.json 及固定范围 inventory；组件：packages/browser/bridge-browser。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：组件级核查桥server/token、版本和通信职责；扩展执行仅作依赖，不代表全浏览器权限审计。
- 下一步：在测试站点比较审批等待、点击后未回包和连接替换的取消与状态对账；不对真实业务操作故障注入。

**分析版本**

- **仓库**：[omdsh-dev/dsh-browser](https://github.com/omdsh-dev/dsh-browser)
- **版本号**：0.0.7（[固定提交 23895d7](https://github.com/omdsh-dev/dsh-browser/tree/23895d7292495f665e5676d2f174d022bb3c3605)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按未执行、已执行与未知保存动作状态，重连先读页面对账再重试，比较连接替换下重复提交与恢复成本；尚未验证。[Q04](#research-q04)

在测试站点比较审批等待、点击后未回包和连接替换的取消与状态对账；不对真实业务操作故障注入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 184 | — | — | 2970 |
| .ts | source | 16 | 3430 | 2586 | 609 | — |
| .js | source | 1 | 180 | 160 | 9 | — |
| .ts | test | 15 | 3613 | 3236 | 103 | — |

</details>

**活跃度**

[![Issue 未关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-browser/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-browser/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-browser/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH浏览器桥的接线、认证与取消如何工作，哪些边界影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桥接组件相对独立浏览器脚本增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要从DSH会话操作已有登录浏览器的用户。桥接把模型工具、会话和扩展通信接在一起；实际DOM读取、点击和审批由扩展侧承担，不能将整个浏览器执行机制算成桥组件独创。合格结果是工具动作作用于明确标签页并在会话可追踪，不只是WebSocket连接成功。

相比另起无登录浏览器脚本，保留现有登录状态可少做重复登录；对需要隔离环境或可重放测试的任务，独立Playwright上下文仍可能更合适。页面通道是结构文本，不是截图视觉控制，多模态附件是另一通道。

#### 证据与依据

**依据 1 · 作者声明**：[packages/browser/bridge-browser/README.md:5-7](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/README.md#L5-L7)

组件职责及文本页面/图像聊天分开。

```text
The **browser-operation bridge** for dsh: mounts a token-authenticated WebSocket carrier (`/ext/bridge`) that the Chrome extension connects to, projects its calls onto dsh 0.2.0 Typert Remotes, follows Session and Remote Event streams per connection, and registers the text-only `browser_*` tool set that reads and operates the user's active tab through the extension — click elements, fill forms, scroll, and navigate in the real browser, login state preserved. The side panel is the conversation entry; the tools are the product.

**Text-only browser tools, multimodal chat passthrough**: page snapshots stay structured text (title, main content, numbered interactive inventory, and masked form fields), and every browser action uses stable inventory numbers. The generic RPC carrier also passes dsh 0.2.0 image prompts and durable attachment reads; deferred new sessions expose image limits only when the host actually mounts the attachment service.
```

**依据 2 · 作者声明**：[packages/browser/bridge-browser/README.md:65-79](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/README.md#L65-L79)

工具面、快照预算和故障类型。

<details>
<summary>查看原文（15行）</summary>

```text
## Tools

| Tool | Purpose |
|---|---|
| `browser_snapshot` | Structured text snapshot (title/URL/main/inventory/forms); `delta: true` returns only changes. |
| `browser_click` / `browser_type` / `browser_press` | Operate inventory items by stable index. |
| `browser_scroll` / `browser_navigate` / `browser_open_tab` / `browser_back` / `browser_forward` / `browser_reload` | Page movement. |
| `browser_get_text` / `browser_wait` | Read regions / settle detection. |

## Model Experience

- **Token effect**: one `browser_snapshot` (default 32k chars) costs roughly 8–10k tokens for typical English text; the exact count depends on language and tokenizer, and delta snapshots cost a fraction of that. The system-prompt section tells the model to snapshot on demand rather than hoard page text.
- **KV-cache effect**: none beyond ordinary tool results; snapshots are not cached server-side.
- **Latency**: each action awaits the extension's real-page execution plus settle detection (typically 0.2–2s; navigation up to 5s).
- **Failure modes**: `bridge-closed` (extension not connected), `timeout`, `no-active-tab`, `content-unavailable` (page needs a refresh), `action-failed` (stale inventory index — the model should re-snapshot).
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 桥认证与取消在实际执行路径约束什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

hello阶段只接受hello。loopback且Origin以chrome-extension://开头时免token；其余路径调用verifyToken，以等长UTF-8字节及timingSafeEqual比较，失败关闭。这里信任的是本机Chrome扩展上下文这个类别，不是特定扩展ID白名单；不应把它描述成仅唯一官方扩展可连接。有效token之外，特权gateway方法还需loopback。

requestTool先拒绝预先abort，发送唯一ID与expiresAt；超时或abort会发tool.cancel，再删除pending并reject，能撤回尚在等待的审批。已发送页面操作是否可回滚取决于扩展和网页，桥的取消消息不能证明外部提交撤销。新认证连接替换旧连接，定位单连接所有权清晰但不支持并发浏览器连接。

#### 证据与依据

**依据 1 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:184-240](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/src/server.ts#L184-L240)

实际发送、过期和取消路径。

<details>
<summary>查看原文（57行）</summary>

```text
  requestTool(
    name: string,
    args: Record<string, unknown>,
    signal: AbortSignal,
    timeoutMs: number = this.deps.toolTimeoutMs,
    sessionId?: string,
  ): Promise<unknown> {
    const conn = this.current
    if (conn === null) {
      throw new BridgeToolError('bridge-closed', 'no browser extension is connected to the bridge')
    }
    // A caller that already aborted must not dispatch: the abort listener
    // below does not replay for pre-aborted signals, so the call would be
    // sent to the extension and executed despite the cancellation.
    if (signal.aborted) {
      throw new BridgeToolError('bridge-closed', 'tool call cancelled before dispatch')
    }
    const id = randomUUID()
    const expiresAt = Date.now() + timeoutMs
    return new Promise<unknown>((resolve, reject) => {
      let timer: NodeJS.Timeout
      const settle = (error: BridgeToolError): void => {
        clearTimeout(timer)
        this.pendingTools.delete(id)
        signal.removeEventListener('abort', onAbort)
        reject(error)
      }
      const cancel = (error: BridgeToolError): void => {
        // The extension may be paused on a user approval after the caller has
        // stopped waiting. Withdraw that approval before settling locally so
        // a late click cannot execute an expired action.
        sendFrame(conn.ws, { t: 'tool.cancel', id })
        settle(error)
      }
      const onAbort = (): void => {
        cancel(new BridgeToolError('bridge-closed', 'tool call cancelled before the extension answered'))
      }
      timer = setTimeout(() => {
        cancel(new BridgeToolError('timeout', `browser action "${name}" timed out after ${timeoutMs}ms`))
      }, timeoutMs)
      signal.addEventListener('abort', onAbort, { once: true })
      this.pendingTools.set(id, { resolve, reject, timer })
      conn.ws.send(JSON.stringify({
        t: 'tool.call',
        id,
        name,
        args,
        expiresAt,
        ...(sessionId === undefined ? {} : { sessionId }),
      } satisfies BridgeFrame), (error) => {
        /* v8 ignore next -- teardown race: when the write fails, the socket's
        close handler settles the same call with the same code; the callback
        path is a defensive second settle, covered via the close path */
        if (error != null) {
          settle(new BridgeToolError('bridge-closed', `bridge socket failed before delivery: ${error.message}`))
        }
      })
```

</details>

**依据 2 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:288-314](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/src/server.ts#L288-L314)

hello鉴权条件没有限定具体Chrome扩展ID。

<details>
<summary>查看原文（27行）</summary>

```text
      if (helloTimer !== undefined) {
        // Pending state: only `hello` is legal.
        if (frame.t !== 'hello') {
          ws.close(1008, 'hello first')
          return
        }
        // Zero-config local mode: loopback sockets skip the token (the
        // extension auto-discovers the bridge and connects without setup).
        // WebSockets have no same-origin policy, so a malicious page could
        // open a cross-origin socket to 127.0.0.1 with a loopback remote —
        // the loopback shortcut therefore requires a chrome-extension://
        // Origin (only extension contexts can present one; pages cannot
        // forge the header). Firefox moz-extension:// origins contain a
        // per-install UUID rather than the manifest's stable Gecko ID, so
        // they are not an identity boundary and must present the bearer token.
        // Non-loopback remotes must also present the bearer token.
        const loopbackNoToken = isLoopbackAddress(remoteAddress)
          && typeof origin === 'string'
          && origin.startsWith('chrome-extension://')
        if (!loopbackNoToken && !verifyToken(this.deps.token, frame.token)) {
          ws.close(4002, 'bad token')
          return
        }
        clearTimeout(helloTimer)
        helloTimer = undefined
        this.promote(ws, remoteAddress)
        return
```

</details>

**依据 3 · 源码核查**：[packages/browser/bridge-browser/src/token.ts:36-43](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/src/token.ts#L36-L43)

token实际字节比较。

```text
export function verifyToken(expected: string, actual: string): boolean {
  // UTF-8 byte comparison, not hex decoding: hex would silently truncate
  // non-hex configured tokens (Buffer.from('fixed-token','hex') is empty)
  // and collapse 'deadbeef-team' to 'deadbeef', losing token entropy.
  const expectedBuf = Buffer.from(expected, 'utf8')
  const actualBuf = Buffer.from(actual, 'utf8')
  if (expectedBuf.length === 0 || expectedBuf.length !== actualBuf.length) return false
  return timingSafeEqual(expectedBuf, actualBuf)
```

**依据 4 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:327-347](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/src/server.ts#L327-L347)

认证连接替换与事件流错误关闭。

<details>
<summary>查看原文（21行）</summary>

```text
  /** Promote an authenticated socket to the single active slot. */
  private promote(ws: WebSocket, remoteAddress: string | undefined): void {
    this.replaceConnection()
    const abort = new AbortController()
    const ping = setInterval(() => { sendFrame(ws, { t: 'ping' }) }, this.deps.pingIntervalMs ?? PING_INTERVAL_MS)
    const pump = (async () => {
      try {
        for await (const frame of this.deps.api.events(abort.signal)) {
          if (ws.readyState !== WebSocket.OPEN) break
          sendFrame(ws, {
            t: 'event',
            frame,
          })
        }
      } catch (error: unknown) {
        if (!abort.signal.aborted && ws.readyState === WebSocket.OPEN) {
          sendFrame(ws, { t: 'error', code: 'stream-failed', message: String(error) })
          // An authenticated socket without its Remote streams is unusable but
          // otherwise appears healthy to the extension. Closing the generation
          // activates its bounded reconnect loop and rebuilds every follower.
          ws.close(1011, 'event stream failed')
```

</details>

**依据 5 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:410-421](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/src/server.ts#L410-L421)

非loopback特权方法拒绝。

<details>
<summary>查看原文（12行）</summary>

```text
    const conn = this.current
    /* v8 ignore next -- replacement race: a frame can land between a socket
    replacement and the next promotion; the re-check keeps the handler total */
    if (conn === null) return
    const forbidden = PRIVILEGED_METHODS.has(frame.method) && !isLoopbackAddress(conn.remoteAddress)
    if (forbidden) {
      sendFrame(conn.ws, { t: 'rpc.result', id: frame.id, ok: false, error: { code: 'forbidden', message: 'method is loopback-only' } })
      return
    }
    if (frame.method === BRIDGE_INJECT_BROWSER_SNAPSHOT_METHOD) {
      const payload = browserSnapshotPayload(frame.payload)
      if (payload === undefined) {
```

</details>

#### 缺口

- 未验证特定部署中本地扩展信任及已执行网页动作的最终状态。
  **影响**：不能把握手认证和取消返回当作单扩展身份认证或网页回滚。
  **进一步探讨**：用第二扩展/第二连接和已提交动作检查连接替换与状态对账，只在测试站点进行。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么不能只安装一个npm包就用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 0.2.0-rc.2及桥构建产物 | 本版本必需 | 宿主API和工具注册 | 老宿主不支持，不凭相近版本推断 |
| 对应Chrome/Firefox扩展 | 工具执行必需 | DOM操作与用户审批 | 仅桥连接没有可用页面 |
| bearer token | 非本地Chrome免token路径必需 | 桥握手 | token无效则关闭 |
| 明确页面共享与审批策略 | 使用必需 | 控制真实登录页面 | 不可信网络不暴露宿主 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户审阅并固定源码/安装版本 | 桥和扩展来自同一受控构建 |
| 2 | 加载宿主及扩展，核对连接配置 | hello成功后测试只读页面 |
| 3 | 在测试站点核对审批与取消 | 目标tab和动作状态符合预期 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、桥和扩展构建 | 手动加载与token配置 | 不能仅用通用plugin命令 |
| 持续使用 | 快照占模型上下文 | 维护宿主/扩展一致性及审批 | 字符上限不是固定token账单 |
| 失败恢复 | 重读页面和调用可能追加费用 | 先查页面实际状态再决定重试 | 单连接替换导致进行中动作需对账 |
| 退出 | 保留宿主会话 | 卸载扩展/桥并轮换token | 禁用不会撤销既有网站修改 |

熟悉DSH的用户可在本地非敏感测试站点试用，不把它暴露到不可信网络。需要多用户通用鉴权或严格事务撤销时不宜直接扩大使用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/browser/bridge-browser/package.json:7-22](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/package.json#L7-L22)

私有包与DSH bundle声明。

<details>
<summary>查看原文（16行）</summary>

```text
  "private": true,
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
  },
  "type": "module",
  "main": "lib/index.js",
```

</details>

**依据 2 · 源码核查**：[packages/browser/bridge-browser/package.json:51-66](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/package.json#L51-L66)

peer精确绑定DSH 0.2.0-rc.2。

<details>
<summary>查看原文（16行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-agent": "0.2.0-rc.2",
    "@deepseek-ai/dsh-api-gateway": "0.2.0-rc.2",
    "@deepseek-ai/dsh-attachment": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-connection": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-locale": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-settings": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.0-rc.2",
    "@deepseek-ai/dsh-home-paths": "0.2.0-rc.2",
    "@deepseek-ai/dsh-host-webserver": "0.2.0-rc.2",
    "@deepseek-ai/dsh-invariants": "0.2.0-rc.2",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.2",
    "@deepseek-ai/dsh-session-persistence": "0.2.0-rc.2",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.2",
    "react": ">=18.2.0 <19"
```

</details>

**依据 3 · 作者声明**：[packages/browser/bridge-browser/README.md:40-54](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/README.md#L40-L54)

版本与信任边界。

<details>
<summary>查看原文（15行）</summary>

````text
The workspace pins dsh 0.2.0-rc.2, the minimum supported runtime. Older DSH releases are not supported:

```sh
npx @deepseek-ai/dsh@0.2.0-rc.2 web
```

The installer copies the unpacked extension to `~/.dsh/browser-extension` and opens `chrome://extensions`. Load that stable directory in Chrome and use the side panel. Loopback connections are discovered automatically and require no token entry; non-loopback deployments still require the configured bearer token.

## Security model

- The bridge route lives **outside** the `/api` trust fence (which only guards client-connection's routes), so it carries its own bearer-token authentication: the first frame must be `hello` with the token within 5s, verified in constant time. Failed auth closes the socket.
- Gateway methods the `/api` carrier pins to loopback (`settings.*`, `credentials.*`, `host.pickDirectory`, `host.openPath`) are refused for non-loopback remotes **even with a valid token** — defense in depth for `--host 0.0.0.0` deployments.
- One active connection at a time; a new authenticated socket replaces the previous one.
- The bridge is a confused-deputy boundary, not a general auth layer: never expose `dsh web --host 0.0.0.0` on untrusted networks.
- Extracted page text is marked as untrusted model input. Page reads honor the extension's ask/auto/off policy, while state-changing tools require an origin-scoped side-panel decision and fail closed without a panel. Same-origin repetition can be trusted for the current panel session; permanent trust remains an explicit setting.
````

</details>

**依据 4 · 作者声明**：[packages/browser/bridge-browser/README.md:86-92](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/README.md#L86-L92)

单连接、手动token轮换与审批所在。

```text
## Known Limitations and Deferred Work

- One active extension connection (a second window replaces the first).
- Accessible cross-origin iframes are snapshotted and operated with stable `(frame, index)` addresses. Restricted or short-lived frames are reported as unavailable without failing the whole page snapshot.
- Token rotation is manual (edit `~/.dsh/ext-bridge-token` or set `token` in config); no expiry.
- The Playwright-driven extension e2e self-skips without a usable Chromium executable or a built extension bundle.
- Approval is enforced in the extension service worker rather than delegated to model behavior. A future dsh tool-pipeline integration may surface the same policy in other clients.
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 桥的有界取消设计值得如何复用？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

值得借鉴的是请求ID、expiresAt和取消帧一起跨传输携带，而不是只在调用方停止等待；事件流失败关闭连接，避免界面显示连接健康却丢失宿主事件。token以原字符串字节比较，也避免把非hex配置错误截断。移植仍需接收侧在操作前检查取消，不能只复制发送端代码。

未验证假设是给已发送但连接丢失的动作保存状态分类，区分未执行、已执行和结果未知；重连后先读测试页状态，只对确认未执行的动作重试。对照当前直接重试与状态对账，在审批等待、DOM点击后回包前和连接替换三点断连，记录重复提交及恢复时间。若额外读取不能判别状态，应保持未知并交用户，不能自动重放。

#### 证据与依据

**依据 1 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:195-232](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/src/server.ts#L195-L232)

发送端在取消时撤审批并携带过期时间。

<details>
<summary>查看原文（38行）</summary>

```text
    // A caller that already aborted must not dispatch: the abort listener
    // below does not replay for pre-aborted signals, so the call would be
    // sent to the extension and executed despite the cancellation.
    if (signal.aborted) {
      throw new BridgeToolError('bridge-closed', 'tool call cancelled before dispatch')
    }
    const id = randomUUID()
    const expiresAt = Date.now() + timeoutMs
    return new Promise<unknown>((resolve, reject) => {
      let timer: NodeJS.Timeout
      const settle = (error: BridgeToolError): void => {
        clearTimeout(timer)
        this.pendingTools.delete(id)
        signal.removeEventListener('abort', onAbort)
        reject(error)
      }
      const cancel = (error: BridgeToolError): void => {
        // The extension may be paused on a user approval after the caller has
        // stopped waiting. Withdraw that approval before settling locally so
        // a late click cannot execute an expired action.
        sendFrame(conn.ws, { t: 'tool.cancel', id })
        settle(error)
      }
      const onAbort = (): void => {
        cancel(new BridgeToolError('bridge-closed', 'tool call cancelled before the extension answered'))
      }
      timer = setTimeout(() => {
        cancel(new BridgeToolError('timeout', `browser action "${name}" timed out after ${timeoutMs}ms`))
      }, timeoutMs)
      signal.addEventListener('abort', onAbort, { once: true })
      this.pendingTools.set(id, { resolve, reject, timer })
      conn.ws.send(JSON.stringify({
        t: 'tool.call',
        id,
        name,
        args,
        expiresAt,
        ...(sessionId === undefined ? {} : { sessionId }),
```

</details>

**依据 2 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:341-347](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/src/server.ts#L341-L347)

事件流失效关闭并触发重连。

```text
      } catch (error: unknown) {
        if (!abort.signal.aborted && ws.readyState === WebSocket.OPEN) {
          sendFrame(ws, { t: 'error', code: 'stream-failed', message: String(error) })
          // An authenticated socket without its Remote streams is unusable but
          // otherwise appears healthy to the extension. Closing the generation
          // activates its bounded reconnect loop and rebuilds every follower.
          ws.close(1011, 'event stream failed')
```

**依据 3 · 源码核查**：[packages/browser/bridge-browser/src/token.ts:36-43](https://github.com/omdsh-dev/dsh-browser/blob/23895d7292495f665e5676d2f174d022bb3c3605/packages/browser/bridge-browser/src/token.ts#L36-L43)

原字节token验证。

```text
export function verifyToken(expected: string, actual: string): boolean {
  // UTF-8 byte comparison, not hex decoding: hex would silently truncate
  // non-hex configured tokens (Buffer.from('fixed-token','hex') is empty)
  // and collapse 'deadbeef-team' to 'deadbeef', losing token entropy.
  const expectedBuf = Buffer.from(expected, 'utf8')
  const actualBuf = Buffer.from(actual, 'utf8')
  if (expectedBuf.length === 0 || expectedBuf.length !== actualBuf.length) return false
  return timingSafeEqual(expectedBuf, actualBuf)
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
