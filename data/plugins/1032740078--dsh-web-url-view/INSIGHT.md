# dsh-web-url-view

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[1933430](https://github.com/1032740078/dsh-web-url-view/tree/193343093186016080a81c5512c6936809daff25)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：给 DSH Web GUI 展示一次性 URL，并以默认全接口绑定的固定端口代理提供跨设备入口。

> **核心亮点**：以稳定书签地址连接每次重启变化的 DSH Web 实例。详见[Q01](#research-q01)。

> **风险与缺陷**：LAN 无密码即认证代理的核心代价；异常日志中 token URL 和有体请求 401 重放可能带来风险。详见[Q03](#research-q03)和[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 固定 URL 实际提供什么便利，默认访问范围有多大？](#detail-section-11)
  - [Q02 · 固定入口怎样保持跨启动的身份连接？](#detail-section-12)
  - [Q03 · 启动令牌真的不出现在日志或浏览器吗？](#detail-section-13)
  - [Q04 · HTTP 401 自动重放是否适合有请求体的操作？](#detail-section-14)
  - [Q05 · 怎样部署才能控制暴露面并验证可用性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：可信局域网中从手机等设备访问 DSH GUI；使用者需接受同网设备无额外口令的权限边界。详见[Q01](#research-q01)。

DSH 原生一次性 token URL 可访问但每次启动变化；固定入口用额外代理换取书签便利和更大 LAN 权限面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 固定 URL | 跨设备书签 | LAN 默认开放 |
| 认证代理 | 自动握手 | token 异常日志 |
| WS | 实时会话 | 目标兼容未知 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH connection/webServer | 必需 | 令牌与目标端口 | 无固定入口 |
| 固定端口 | 必需 | 稳定 URL | 冲突不可用 |
| 可信 LAN | 默认方案必需 | 跨设备 | 未授权访问 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 配置 | 选 bind/端口 | 核网络边界 |
| 打开 | 手机访问固定 URL | GUI 加载/WS |
| 复核 | 重启/换网 | 地址/权限 |

**效果与成本**

#### 成本

| 阶段 | 本插件动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 选 bind/固定端口、配置防火墙/设备边界 | 本机端口/网络资源；证书/网络设备费用未知 | 排查 IP/端口、授权范围与书签，工时未知 | 端口占用或换网需重配 |
| 持续 | HTTP/WS 转发、进程内握手/续期 | 代理 CPU/内存/带宽；现金消耗未知 | 审访问日志/令牌保密、设备权限，工时未知 | LAN 暴露面随网络变化 |
| 失败恢复 | token 日志泄露、401 POST 丢体、IP 漂移 | 可能需重启/重新提交或轮换认证；损失未知 | 查日志、阻断端口、核业务写入、重设书签，工时未知 | 有体重放和 WS 101 真实行为未测 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 固定入口 | 端口代理 | LAN IP 恒定 |
| 认证 | 内存 cookie | 异常日志保密 |
| 实时连接 | WS 代理 | 各宿主版本兼容 |

> **思考**：LAN 无密码即认证代理的核心代价；异常日志中 token URL 和有体请求 401 重放可能带来风险。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：以稳定书签地址连接每次重启变化的 DSH Web 实例。详见[Q01](#research-q01)。

以稳定书签地址连接每次重启变化的 DSH Web 实例。详见[Q01](#research-q01)。

进程内单飞握手与 HTTP/WS 转发；默认 LAN trust、异常日志和有体重放是部署关键。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

LAN 无密码即认证代理的核心代价；异常日志中 token URL 和有体请求 401 重放可能带来风险。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在可信 LAN 小范围试用，按需限制 bind/firewall；验证重启、WebSocket 和 401 写入。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认默认暴露完整 GUI 于 LAN；异常握手日志拼入 token URL；401 重试不缓存请求体。目标网络/宿主未测。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/fixed-entry.ts、src/service.ts、src/lan.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、src/index.ts、src/fixed-entry.ts、src/service.ts、src/lan.ts；未运行目标 DSH。旧 META 复用。
- 下一步：目标宿主核 LAN 无密码、日志失败脱敏、101 Set-Cookie、cookie过期 POST、换网/端口占用。

**分析版本**

- **仓库**：[1032740078/dsh-web-url-view](https://github.com/1032740078/dsh-web-url-view)
- **版本号**：0.1.0（[固定提交 1933430](https://github.com/1032740078/dsh-web-url-view/tree/193343093186016080a81c5512c6936809daff25)）
- **版本日期**：2026-09-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未实现的改进是绑定来源授权/TLS、日志脱敏和不可重放请求的安全续期。详见[Q05](#research-q05)。

目标宿主核 LAN 无密码、日志失败脱敏、101 Set-Cookie、cookie过期 POST、换网/端口占用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 12 | 11342 | 9891 | 1880 | — |
| .md | source | 2 | 384 | — | — | 3075 |
| .ts | source | 10 | 1097 | 586 | 443 | — |
| .tsx | source | 1 | 206 | 160 | 32 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/1032740078/dsh-web-url-view/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定 Web 入口如何处理身份与跨设备访问，异常路径是否泄露/损坏会话？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 固定 URL 实际提供什么便利，默认访问范围有多大？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件在设置里展示一次性 token URL 和固定 http://LAN-IP:47524 地址。固定口默认绑定 0.0.0.0；进程内代理持有 DSH 会话 cookie，对连接者自动加认证。README 明确同一 LAN 任意设备可无额外密码打开完整 Web GUI。这是把启动令牌保护转化成 LAN 信任边界，不只是只读 URL 展示；公共/共享网络应限定 127.0.0.1 或关掉。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-27](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/README.md#L9-L27)

作者产品用途

<details>
<summary>查看原文（19行）</summary>

```text
Adds a **View URL** page to the left menu of **Settings** in DSH Desktop
(DeepSeek Harness desktop) and in any `dsh web` GUI running the same profile.
The page shows two Web GUI addresses, and the fixed one is **stable across
restarts and reachable from other devices on the same LAN**.

- **Fixed address** (bookmark this): `http://<LAN-IP>:47524/`, e.g.
  `http://192.168.1.88:47524/` — it stays the same no matter how often the
  desktop restarts or how the port and launch token rotate.
- **Current address (one-time)**: the tokenized URL of the running session,
  which changes on every desktop restart.

## Why it exists

The desktop picks a random Web port and a per-process launch token on every
start (the token is a replay-protection secret). The native URL therefore
changes constantly, so it cannot be bookmarked or kept on a phone. The token
should not — and cannot — be pinned, so this plugin pins the **entry point**
instead: an in-process fixed-port forwarder holds one stable address and
performs the authentication handshake against the current session by itself.
```

</details>

**依据 2 · 作者声明**：[README.md:121-132](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/README.md#L121-L132)

作者明确无密码 LAN 访问

<details>
<summary>查看原文（12行）</summary>

```text
## Security boundary (important)

The fixed entry **holds a session cookie inside the proxy**, therefore:

- With the default `0.0.0.0` bind, **any device on the same LAN can open the Web
  GUI, with no extra password.** That default exists to serve the "open it on my
  phone" use case.
- Use it on trusted LANs only. On public or shared networks set
  `fixedHost: 127.0.0.1` (localhost only) or `fixedPort: 0` (disable the fixed
  address entirely).
- The forwarder listens on the fixed port and nothing else: it opens no extra
  API and never writes browser cookies.
```

</details>

**依据 3 · 源码核查**：[src/index.ts:39-75](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/index.ts#L39-L75)

默认 0.0.0.0:47524

<details>
<summary>查看原文（37行）</summary>

```text
/** Default fixed-port forwarder bind port. */
const DEFAULT_FIXED_PORT = 47524
/** Default fixed entry bind interface: all interfaces, so other LAN devices can connect. */
const DEFAULT_FIXED_HOST = '0.0.0.0'

/** Plugin configuration; all fields optional (documented defaults). */
export interface Config {
  /** Fixed entry bind port; 0 disables the fixed address. Default 47524. */
  fixedPort?: number
  /** Fixed entry bind interface. Default 0.0.0.0 (all interfaces, LAN-reachable). */
  fixedHost?: string
}

/** The plugin declares no services of its own (the service class injects `connection`). */
export const inject: readonly string[] = []

/**
 * Mount the `webUrlView` service and the fixed-port forwarder once their
 * `connection`/`webServer` dependencies activate. The forwarder shares the
 * plugin's effect lifecycle: a harness restart recreates this process, which
 * rebinds the SAME fixed port and refreshes the session against the new
 * launch token automatically — that is what makes the fixed address stable.
 * @param ctx - plugin context.
 * @param config - optional plugin config (see {@link Config}).
 */
export async function apply(ctx: Context, config: Config | undefined): Promise<void> {
  const fixedPort = typeof config?.fixedPort === 'number' ? Math.trunc(config.fixedPort) : DEFAULT_FIXED_PORT
  const fixedHost = typeof config?.fixedHost === 'string' && config.fixedHost !== ''
    ? config.fixedHost
    : DEFAULT_FIXED_HOST

  await ctx.plugin(WebUrlViewService)
  console.info('[dsh-web-url-view] host mounted: webUrlView/current is available')

  if (fixedPort <= 0 || fixedPort > 65535) {
    console.info(`[dsh-web-url-view] fixed entry disabled (fixedPort=${String(fixedPort)})`)
    return
```

</details>

#### 缺口

- 目标网络/宿主权限未测
  **影响**：默认可能扩大 GUI 控制面
  **进一步探讨**：目标 LAN 设备验证并设防火墙

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 固定入口怎样保持跨启动的身份连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 在 connection/webServer/webUrlView ready 后监听固定端口，代理首请求调用 connection.authenticatedUrl 对当前进程令牌握手，提取 dsh-auth cookie 存内存，22 小时后更新；HTTP 与 WebSocket 都转发并改写 Host/Origin/Cookie，HTTP Set-Cookie 被剥离。每次桌面重启进程重绑同端口再握新 cookie。因此地址固定依赖端口可用、LAN IP 不变和宿主版本兼容，而非保证网络寻址永远不变。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:78-131](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/index.ts#L78-L131)

服务装配/端口

<details>
<summary>查看原文（54行）</summary>

```text
  // The forwarder lives exactly as long as the plugin fiber that owns it.
  // The inject list includes 'webUrlView' on purpose: the service registers
  // through ctx.plugin() above, but its own `connection` dependency keeps its
  // fiber PENDING until the harness connection is actually provided — which
  // can be after apply() returned. Declaring it as an inject dependency makes
  // this callback run only once the service fiber is ACTIVE, so the strict
  // ctx.get() below is guaranteed to return the same global instance the
  // gateway dispatches to.
  ctx.inject(['connection', 'webServer', 'webUrlView'], (scope) => {
    scope.effect(() => {
      const serverPort = scope.webServer.port
      // 注入列表已包含 'webUrlView':回调仅在服务激活后执行,严格 get 必然命中。
      const service = ctx.get('webUrlView') as WebUrlViewService
      // Whatever the listen host (`127.0.0.1` or `0.0.0.0`), this process can
      // always reach its own server through loopback, and the harness trust
      // fence accepts a loopback Host — so loopback is the connect address
      // and the authority we name in forwarded headers.
      const connectHost = '127.0.0.1'
      // 对外展示主机名:探测内网 IP(优先默认路由网卡),供局域网设备访问;
      // 找不到可用的内网 IP 时回退到回环,保证本机总能通过固定地址打开。
      const advertiseHost = detectLanAddress() ?? '127.0.0.1'
      const entry = new FixedEntryServer(fixedHost, fixedPort, {
        authority: `${connectHost}:${String(serverPort)}`,
        hostname: connectHost,
        port: serverPort,
        advertiseHost,
        // Authenticate through the service instance (never through `scope`):
        // the inject scope is tied to this fiber and becomes inactive the
        // moment the plugin reloads, while the forwarder must keep serving
        // across requests. The service's own ctx stays live for the whole
        // mount.
        authenticate: () => service.mintFixedUrl(`http://${connectHost}:${String(serverPort)}`),
      })
      entry.start()
      if (service === undefined) {
        // Diagnostic: without the service the fixed URL can never be set.
        console.error('[dsh-web-url-view] attachFixed skipped: service is undefined')
        return async () => {
          await entry.close()
        }
      }
      try {
        service.attachFixed(entry)
      } catch (error) {
        // A throw here is invisible to harness.log (cordis sends it to
        // logger.error, not stdout): surface it on stdout with the full
        // message so one restart pinpoints the cause.
        console.error(`[dsh-web-url-view] attachFixed failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}`)
      }
      return async () => {
        service.attachFixed(null)
        await entry.close()
      }
    }, 'dsh-web-url-view: fixed entry')
```

</details>

**依据 2 · 源码核查**：[src/fixed-entry.ts:121-145](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/fixed-entry.ts#L121-L145)

listen 与 cookie 生命周期

<details>
<summary>查看原文（25行）</summary>

```text
  /** Bind the fixed port (non-blocking). */
  start(): void {
    this.server.listen(this.port, this.bindHost, () => {
      this.listening = true
      console.info(`[dsh-web-url-view] fixed entry listening on ${this.bindHost}:${this.port} (advertised http://${this.target.advertiseHost}:${this.port}) -> ${this.target.authority}`)
    })
  }

  /** Release the port and drop the held session cookie. */
  async close(): Promise<void> {
    this.listening = false
    this.sessionCookie = null
    const server = this.server
    // Close lingering keep-alive sockets so a restarted harness never finds
    // the fixed port still occupied by this process's stale sockets.
    server.closeAllConnections?.()
    await new Promise<void>((resolve) => {
      server.close(() => resolve())
    })
    console.info(`[dsh-web-url-view] fixed entry on ${this.bindHost}:${this.port} closed`)
  }

  /** Whether the held session cookie is still plausibly valid (server grants 24h). */
  private get sessionFresh(): boolean {
    return this.sessionCookie !== null && Date.now() - this.sessionAt < 22 * 60 * 60 * 1000
```

</details>

**依据 3 · 源码核查**：[src/fixed-entry.ts:154-195](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/fixed-entry.ts#L154-L195)

握手取 cookie

<details>
<summary>查看原文（42行）</summary>

```text
  private async handshake(): Promise<string | null> {
    if (this.handshakePromise !== null) return this.handshakePromise
    this.handshakePromise = (async () => {
      let url: string
      try {
        // authenticate()（服务 ctx 的 connection 读取）可能在插件重载边界抛错；
        // 手握手失败必须转为会话刷新失败,绝不作为 unhandled rejection 逃逸。
        url = this.target.authenticate()
      } catch (error) {
        console.error(`[dsh-web-url-view] fixed entry handshake: authenticate() failed: ${error instanceof Error ? error.message : String(error)}`)
        return null
      }
      let response: Response
      try {
        response = await fetch(url, { redirect: 'manual', headers: { accept: 'text/html' } })
      } catch (error) {
        console.error(`[dsh-web-url-view] fixed entry handshake to ${url} failed: ${error instanceof Error ? error.message : String(error)}`)
        return null
      }
      try {
        await response.body?.cancel()
      } catch {
        // A manual-redirect response carries no readable body; best effort.
      }
      const setCookies = typeof response.headers.getSetCookie === 'function'
        ? response.headers.getSetCookie()
        : []
      const cookie = setCookies.find((entry) => entry.startsWith('dsh-auth-'))
      if (cookie === undefined) {
        console.error(`[dsh-web-url-view] fixed entry handshake to ${url} returned HTTP ${response.status} without a dsh-auth cookie`)
        return null
      }
      // Keep only the name=value pair; attributes belong to a browser jar.
      this.sessionCookie = cookie.split(';')[0]?.trim() ?? null
      this.sessionAt = Date.now()
      console.info(`[dsh-web-url-view] fixed entry session refreshed (HTTP ${response.status})`)
      return this.sessionCookie
    })().finally(() => {
      this.handshakePromise = null
    })
    return this.handshakePromise
  }
```

</details>

**依据 4 · 源码核查**：[src/fixed-entry.ts:205-228](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/fixed-entry.ts#L205-L228)

请求头改写

<details>
<summary>查看原文（24行）</summary>

```text
  private rewrite(inbound: IncomingHttpHeaders, cookie: string | null): IncomingHttpHeaders {
    const headers: IncomingHttpHeaders = {}
    for (const [key, value] of Object.entries(inbound)) {
      if (value === undefined) continue
      if (OWNED_HEADERS.has(key.toLowerCase())) continue
      if (key.toLowerCase() === 'origin') {
        // Rewrite only origins that name this forwarder (its port); foreign
        // origins stay untouched so the target fence still rejects them.
        try {
          const origin = new URL(String(value))
          if (origin.port === String(this.port)) {
            headers.origin = `http://${this.target.authority}`
            continue
          }
        } catch {
          // Keep the malformed origin verbatim for the target fence.
        }
      }
      headers[key] = value
    }
    headers.host = this.target.authority
    if (cookie !== null) headers.cookie = cookie
    return headers
  }
```

</details>

**依据 5 · 源码核查**：[src/fixed-entry.ts:395-407](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/fixed-entry.ts#L395-L407)

HTTP 响应删 cookie

<details>
<summary>查看原文（13行）</summary>

```text
function stripHopHeaders(headers: IncomingHttpHeaders): IncomingHttpHeaders {
  const out: IncomingHttpHeaders = {}
  for (const [key, value] of Object.entries(headers)) {
    if (value === undefined) continue
    const lower = key.toLowerCase()
    if (lower === 'connection' || lower === 'keep-alive' || lower === 'transfer-encoding'
      || lower === 'upgrade' || lower === 'set-cookie' || lower === 'proxy-connection') {
      continue
    }
    out[key] = value
  }
  return out
}
```

</details>

#### 缺口

- 目标重启和 WebSocket 未重放
  **影响**：IP 变化/端口冲突时固定书签失效
  **进一步探讨**：目标重启/换网/占端口矩阵

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动令牌真的不出现在日志或浏览器吗？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

正常代理转发把 session cookie 留在进程、HTTP 响应删除 Set-Cookie；但握手 fetch 失败与未收到 cookie 两条错误日志都插入完整 url，而 url 来自 authenticatedUrl、含 ?token= 启动令牌。README 宣称 token/cookie 不离开进程，至少异常日志路径不满足“令牌不入日志”；日志读取者可能看到一次性令牌。WebSocket 101 则原样转发全部原始响应头，若上游带 Set-Cookie 也不会被剥离，需实际核上游行为。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:78-90](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/README.md#L78-L90)

作者令牌/cookie 留进程主张

<details>
<summary>查看原文（13行）</summary>

```text
- It binds `0.0.0.0:47524` (configurable) as a reverse proxy and advertises the
  machine's LAN IP.
- It targets the CURRENT harness instance: on the first request it performs the
  same `?token=` handshake a browser would, using the in-process launch token,
  and holds the browser-session cookie internally — tokens and cookies never
  leave the process or reach a browser.
- After a desktop restart the new harness process rebinds the SAME fixed port
  and refreshes the session against the new launch token, so the address never
  changes from a browser's point of view.
- Both plain HTTP and WebSocket upgrades (`/api/remote.mux`, the live session
  channel) are forwarded; `Host`/`Origin` are rewritten per the harness trust
  fence, and response `Set-Cookie` headers are absorbed by the forwarder so they
  never pollute the browser's cookie jar.
```

</details>

**依据 2 · 源码核查**：[src/fixed-entry.ts:154-184](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/fixed-entry.ts#L154-L184)

握手失败日志包含 url

<details>
<summary>查看原文（31行）</summary>

```text
  private async handshake(): Promise<string | null> {
    if (this.handshakePromise !== null) return this.handshakePromise
    this.handshakePromise = (async () => {
      let url: string
      try {
        // authenticate()（服务 ctx 的 connection 读取）可能在插件重载边界抛错；
        // 手握手失败必须转为会话刷新失败,绝不作为 unhandled rejection 逃逸。
        url = this.target.authenticate()
      } catch (error) {
        console.error(`[dsh-web-url-view] fixed entry handshake: authenticate() failed: ${error instanceof Error ? error.message : String(error)}`)
        return null
      }
      let response: Response
      try {
        response = await fetch(url, { redirect: 'manual', headers: { accept: 'text/html' } })
      } catch (error) {
        console.error(`[dsh-web-url-view] fixed entry handshake to ${url} failed: ${error instanceof Error ? error.message : String(error)}`)
        return null
      }
      try {
        await response.body?.cancel()
      } catch {
        // A manual-redirect response carries no readable body; best effort.
      }
      const setCookies = typeof response.headers.getSetCookie === 'function'
        ? response.headers.getSetCookie()
        : []
      const cookie = setCookies.find((entry) => entry.startsWith('dsh-auth-'))
      if (cookie === undefined) {
        console.error(`[dsh-web-url-view] fixed entry handshake to ${url} returned HTTP ${response.status} without a dsh-auth cookie`)
        return null
```

</details>

**依据 3 · 源码核查**：[src/fixed-entry.ts:339-345](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/fixed-entry.ts#L339-L345)

101 原始头全部转发

```text
    })
    upstream.on('upgrade', (upstreamResponse, upstreamSocket, upstreamHead) => {
      // Relay the target's raw 101 (accept computed from the client key we
      // forwarded), then splice the sockets together.
      const buffered = Buffer.concat([head, upstreamHead])
      socket.write(`HTTP/1.1 101 Switching Protocols\r\n${rawHeaderText(upstreamResponse.rawHeaders)}`)
      if (buffered.length > 0) upstreamSocket.unshift(buffered)
```

**依据 4 · 源码核查**：[src/fixed-entry.ts:409-424](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/fixed-entry.ts#L409-L424)

rawHeaderText 无过滤

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * Serialize raw header pairs into `Name: value` lines plus the terminator.
 * EVERY header of the 101 response is relayed verbatim — including
 * `Connection: Upgrade`, which is what tells the browser's HTTP parser this
 * response completes the WebSocket handshake (dropping it would surface the
 * 101 as an ordinary response and break the upgrade).
 */
function rawHeaderText(rawHeaders: readonly string[]): string {
  let text = ''
  for (let index = 0; index < rawHeaders.length; index += 2) {
    const name = rawHeaders[index]
    const value = rawHeaders[index + 1]
    if (name === undefined || value === undefined) continue
    text += `${name}: ${value}\r\n`
  }
  return `${text}\r\n`
```

</details>

#### 缺口

- 上游 101 是否含 Set-Cookie 未测
  **影响**：故障日志可泄露启动令牌
  **进一步探讨**：目标失败握手与 101 头验证

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · HTTP 401 自动重放是否适合有请求体的操作？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

dispatch 首次请求用 request.pipe(upstream) 消耗入站流。若上游 401，直接对同一个 IncomingMessage 再次 dispatch/pipe，没有缓存 body 或重建流。GET 等无体请求较可能恢复；POST/PUT 的 body 已被第一腿消费，重试不能保证原样传输。代理转发任意方法，因此用户在 cookie 过期时提交写操作可能失败或被上游看到不同请求。应在到期前刷新、对有体请求不盲重放或设计可重放缓冲与幂等性。

#### 证据与依据

**依据 1 · 源码核查**：[src/fixed-entry.ts:236-299](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/fixed-entry.ts#L236-L299)

任意方法、401重调 dispatch、流只传一次

<details>
<summary>查看原文（64行）</summary>

```text
  /**
   * Forward one plain HTTP request (any method; streaming body and response).
   * A 401 on the first attempt triggers one handshake + replay; a second 401
   * is relayed to the browser unchanged.
   * @param request - inbound request from the fixed port.
   * @param response - outbound response to the fixed-port client.
   */
  private async forward(request: IncomingMessage, response: ServerResponse): Promise<void> {
    await this.dispatch(request, response, await this.currentCookie(), 0)
  }

  /**
   * One dispatch leg; recursion depth is capped by the attempt counter.
   * @param request - inbound request.
   * @param response - outbound response.
   * @param cookie - cookie to attach on this leg.
   * @param attempts - completed legs so far (0 = first try).
   */
  private async dispatch(
    request: IncomingMessage,
    response: ServerResponse,
    cookie: string | null,
    attempts: number,
  ): Promise<void> {
    const upstream = httpRequest({
      hostname: this.target.hostname,
      port: this.target.port,
      method: request.method,
      path: request.url,
      headers: this.rewrite(request.headers, cookie),
    }, (upstreamResponse) => {
      // Session rotated or expired: refresh once and replay the same request.
      if (upstreamResponse.statusCode === 401 && attempts === 0) {
        upstreamResponse.resume()
        void this.handshake().then((fresh) => {
          if (fresh === null) {
            this.fail(response, 401, 'fixed entry: session refresh failed')
            return
          }
          void this.dispatch(request, response, fresh, attempts + 1)
        })
        return
      }
      upstreamResponse.on('error', (error) => {
        console.error(`[dsh-web-url-view] fixed entry upstream response error: ${error instanceof Error ? error.message : String(error)}`)
        if (!response.destroyed) response.destroy()
      })
      response.writeHead(upstreamResponse.statusCode ?? 502, stripHopHeaders(upstreamResponse.headers))
      upstreamResponse.pipe(response)
    })
    upstream.on('error', (error) => {
      console.error(`[dsh-web-url-view] fixed entry upstream error: ${error instanceof Error ? error.message : String(error)}`)
      this.fail(response, 502, 'fixed entry: harness web server unreachable')
    })
    // The inbound body stream can die (aborted client); without a listener
    // the pipe teardown would surface an unhandled 'error' on the request.
    request.on('error', () => {
      upstream.destroy()
    })
    request.on('aborted', () => {
      upstream.destroy()
    })
    request.pipe(upstream)
  }
```

</details>

**依据 2 · 源码核查**：[src/fixed-entry.ts:143-145](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/fixed-entry.ts#L143-L145)

22h 软过期

```text
  /** Whether the held session cookie is still plausibly valid (server grants 24h). */
  private get sessionFresh(): boolean {
    return this.sessionCookie !== null && Date.now() - this.sessionAt < 22 * 60 * 60 * 1000
```

#### 缺口

- 目标 Node stream 重放结果未测
  **影响**：保存/提交可能失败或不可预测
  **进一步探讨**：目标 cookie 过期时 POST 大小正文

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样部署才能控制暴露面并验证可用性？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

在信任 LAN 且明确需要手机访问时试用，先把 fixedHost 设为所需接口、限制防火墙来源，再核 Web GUI 权限范围、重启后的地址、换网与 WebSocket；若只在本机用，应绑定 127.0.0.1。需要独立用户鉴权/HTTPS 时此插件没有实现，必须在外层设计且避免公开代理。当前 URL 仅 http，固定 LAN IP 自动探测；业务安全性随网络条件变化。 假设推导：默认 0.0.0.0 代理把 cookie 授予同 LAN 连接者，握手失败路径会记录 token URL，有体请求在 401 后对已消费入站流重用；便利性因此与 LAN 信任/续期可靠性捆绑。相对固定版，若固定入口先要求独立设备身份（或受控 TLS 反代）、日志只记录事件码不记录 URL，并在 cookie 过期前刷新或让不可重放请求返回明确重新提交指令，可保留书签便利且减少无授权 GUI 控制与写入丢体。条件是可安全配置设备身份、DSH 连接认证支持续期；代价是配证书/账号、额外提示与可能的重新登录。对照固定版/原型在两台可信及一台未授权 LAN 设备、失败握手、cookie 过期后 JSON POST/上传、WebSocket 101 及换网场景测未授权成功率、日志 token 泄露、请求体一致性和额外登录时间。若未授权设备仍能进入、日志仍含 token，或续期后写入体不一致，假设被证伪；该方案不是固定版已有功能。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:95-130](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/README.md#L95-L130)

配置和安全建议

<details>
<summary>查看原文（36行）</summary>

````text
## Configuration (port / bind host / off switch)

Default fixed port `47524`, bound to `0.0.0.0` (all interfaces). To change the
port, restrict the bind, or disable the fixed address, override the row config in
the desktop profile's `cordis.patch.yml` and restart the desktop:

```yaml
- id: web-url-view
  name: dsh-web-url-view
  config:
    # Fixed entry listen port; 0 disables the fixed address. Default 47524.
    fixedPort: 47524
    # Bind interface. Default 0.0.0.0 (all interfaces, LAN-reachable); use 127.0.0.1 for localhost only.
    fixedHost: 0.0.0.0
```

| Option | Type | Default | Meaning |
| --- | --- | --- | --- |
| `fixedPort` | number | `47524` | Fixed entry listen port. `0` or an invalid value (>65535) disables the fixed address, leaving only the one-time address. |
| `fixedHost` | string | `0.0.0.0` | Fixed entry bind interface. `0.0.0.0` = all interfaces (LAN-reachable); `127.0.0.1` = localhost only. |

The LAN address is **auto-detected**: it prefers the IPv4 of the default-route
interface and skips loopback, link-local (`169.254.*`) and common virtual
interfaces (docker/veth/vmnet/utun/…). When nothing usable is found it falls
back to `127.0.0.1`, so localhost keeps working.

## Security boundary (important)

The fixed entry **holds a session cookie inside the proxy**, therefore:

- With the default `0.0.0.0` bind, **any device on the same LAN can open the Web
  GUI, with no extra password.** That default exists to serve the "open it on my
  phone" use case.
- Use it on trusted LANs only. On public or shared networks set
  `fixedHost: 127.0.0.1` (localhost only) or `fixedPort: 0` (disable the fixed
  address entirely).
````

</details>

**依据 2 · 源码核查**：[src/index.ts:64-109](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/index.ts#L64-L109)

绑定与 LAN 探测

<details>
<summary>查看原文（46行）</summary>

```text
export async function apply(ctx: Context, config: Config | undefined): Promise<void> {
  const fixedPort = typeof config?.fixedPort === 'number' ? Math.trunc(config.fixedPort) : DEFAULT_FIXED_PORT
  const fixedHost = typeof config?.fixedHost === 'string' && config.fixedHost !== ''
    ? config.fixedHost
    : DEFAULT_FIXED_HOST

  await ctx.plugin(WebUrlViewService)
  console.info('[dsh-web-url-view] host mounted: webUrlView/current is available')

  if (fixedPort <= 0 || fixedPort > 65535) {
    console.info(`[dsh-web-url-view] fixed entry disabled (fixedPort=${String(fixedPort)})`)
    return
  }

  // The forwarder lives exactly as long as the plugin fiber that owns it.
  // The inject list includes 'webUrlView' on purpose: the service registers
  // through ctx.plugin() above, but its own `connection` dependency keeps its
  // fiber PENDING until the harness connection is actually provided — which
  // can be after apply() returned. Declaring it as an inject dependency makes
  // this callback run only once the service fiber is ACTIVE, so the strict
  // ctx.get() below is guaranteed to return the same global instance the
  // gateway dispatches to.
  ctx.inject(['connection', 'webServer', 'webUrlView'], (scope) => {
    scope.effect(() => {
      const serverPort = scope.webServer.port
      // 注入列表已包含 'webUrlView':回调仅在服务激活后执行,严格 get 必然命中。
      const service = ctx.get('webUrlView') as WebUrlViewService
      // Whatever the listen host (`127.0.0.1` or `0.0.0.0`), this process can
      // always reach its own server through loopback, and the harness trust
      // fence accepts a loopback Host — so loopback is the connect address
      // and the authority we name in forwarded headers.
      const connectHost = '127.0.0.1'
      // 对外展示主机名:探测内网 IP(优先默认路由网卡),供局域网设备访问;
      // 找不到可用的内网 IP 时回退到回环,保证本机总能通过固定地址打开。
      const advertiseHost = detectLanAddress() ?? '127.0.0.1'
      const entry = new FixedEntryServer(fixedHost, fixedPort, {
        authority: `${connectHost}:${String(serverPort)}`,
        hostname: connectHost,
        port: serverPort,
        advertiseHost,
        // Authenticate through the service instance (never through `scope`):
        // the inject scope is tied to this fiber and becomes inactive the
        // moment the plugin reloads, while the forwarder must keep serving
        // across requests. The service's own ctx stays live for the whole
        // mount.
        authenticate: () => service.mintFixedUrl(`http://${connectHost}:${String(serverPort)}`),
```

</details>

**依据 3 · 源码核查**：[src/service.ts:104-129](https://github.com/1032740078/dsh-web-url-view/blob/193343093186016080a81c5512c6936809daff25/src/service.ts#L104-L129)

current 返回 token URL

<details>
<summary>查看原文（26行）</summary>

```text
  /**
   * Mint the launch-token URL for the origin the browser reported.
   * Read-only: touches no configuration and mutates no registry.
   * @param origin - absolute origin from `window.location.origin`.
   * @returns the tokenized root URL, externally openable in any browser.
   */
  current(origin: string): WebUrlViewResult {
    // Logged on every call: the instance id proves whether the gateway
    // dispatches to the same instance the plugin body attached the fixed
    // entry to.
    console.info(`[dsh-web-url-view] current(${origin}) on instance ${instanceId(this)}`)
    if (!isTrustedOrigin(origin)) {
      // Reject loudly: an untrusted origin must never reach token minting.
      throw new Error(`webUrlView: origin rejected (must be a loopback or private-LAN http(s) origin): ${origin}`)
    }
    let url: string
    try {
      url = this.ctx.connection.authenticatedUrl(origin)
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      throw new Error(`webUrlView: could not mint the authenticated URL for ${origin}: ${reason}`)
    }
    // The URLs carry a session secret; only the origin is logged.
    const fixedUrl = this.fixed?.url ?? null
    console.info(`[dsh-web-url-view] current() for ${origin}: url minted, fixedUrl=${fixedUrl ?? 'null'}`)
    return { url, fixedUrl }
```

</details>

#### 缺口

- 外层 TLS/身份控制未测
  **影响**：局域网共享不等同本人访问
  **进一步探讨**：目标网络权限与跨设备端到端验证

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
