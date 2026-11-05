# DSH Remote Web Gateway

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5b2db96](https://github.com/summer1238/dsh-remote-web-gateway/tree/5b2db966a6efec024bd7dd19a152691311ebb124)

<!-- BEGIN META -->
[![GitHub ★ 167](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=167&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/summer1238/dsh-remote-web-gateway)
<!-- END META -->

> **功能**：通过远程入口和设备配对，从手机访问电脑上的 DSH Web。

> **亮点**：[Q01](#research-q01) 把设备授权和 DSH Web 转发接起来。

> **主要限制**：[Q03](#research-q03) 撤销记录与正在传输的连接生命周期不同。

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
  - [Q01 · 手机操作与远程桌面有什么区别？](#detail-section-11)
  - [Q02 · HTTP 与 WebSocket 如何验权？](#detail-section-12)
  - [Q03 · 设备撤销是否会关闭已建立连接？](#detail-section-13)
  - [Q04 · 怎样做可控的验收？](#detail-section-14)
  - [Q05 · 按设备关闭活跃连接能改善撤销吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：离开电脑后仍需看进度的用户可评估手机远程 Web。

远程桌面能全局操作，但会打开更广界面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 远程访问 | 手机接入宿主 | 依赖授权和网络 |
| 撤销 | 清理设备状态 | 需另验活跃连接 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH | 必需 | 提供上游 | 无法访问 |
| 隧道或受控入口 | 远端访问需要 | 建立连接 | 仅本机使用 |
| 设备配对 | 必需 | 验证手机 | 拒绝请求 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 隔离宿主和测试设备 | 限制入口 |
| 核验 | 测试来源、授权和撤销 | 确认拒绝和活跃连接 |
| 退出 | 关闭网关 | 复核连接已断 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 部署资源未知 | 配置耗时未知 | 受拓扑影响 |
| 持续 | 隧道与模型开销未知 | 审核耗时未知 | 权限随宿主 |
| 恢复 | 重试资源未知 | 撤销核对耗时未知 | 可能需关网关 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 设备访问 | 有配对和认证 | 实际部署安全与稳定性 |

> **思考**：[Q03](#research-q03) 撤销记录与正在传输的连接生命周期不同。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把设备授权和 DSH Web 转发接起来。

认证和代理分别处理，设备记录串行持久化。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 撤销记录与正在传输的连接生命周期不同。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在隔离环境验证允许和拒绝，异常就关闭远程入口。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的公网请求策略、设备配对与撤销。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/gateway.ts、src/request-policy.ts、src/pairing-routes.ts、src/device-session.ts、plugin/src/runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的公网请求策略、设备配对与撤销。未执行目标代码或实际宿主验证。
- 下一步：以两台测试设备比较活跃连接

**分析版本**

- **仓库**：[summer1238/dsh-remote-web-gateway](https://github.com/summer1238/dsh-remote-web-gateway)
- **版本号**：0.2.2（[固定提交 5b2db96](https://github.com/summer1238/dsh-remote-web-gateway/tree/5b2db966a6efec024bd7dd19a152691311ebb124)）
- **版本日期**：2026-08-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 测试撤销时按设备断开活跃连接。

以两台测试设备比较活跃连接

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 4764 | — | — | 49226 |
| .mjs | source | 5 | 540 | 349 | 145 | — |
| .ts | source | 42 | 8756 | 6312 | 1923 | — |
| .tsx | source | 6 | 1560 | 1232 | 234 | — |
| .ts | test | 29 | 6943 | 5953 | 604 | — |
| .tsx | test | 3 | 974 | 770 | 113 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/summer1238/dsh-remote-web-gateway/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：公网请求策略、设备配对与撤销

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 手机操作与远程桌面有什么区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

手机经网关访问现有 DSH Web，操作仍由电脑上的宿主处理。相较远程桌面只转发所需 Web 通道；代理正常能用于进度和交互，但通过授权的设备仍可能接触宿主拥有的功能。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-42](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/README.md#L20-L42)

作者描述场景

<details>
<summary>查看原文（23行）</summary>

```text
## **电脑上的 DSH 还在干活，你人已经走了？**

下班路上，Agent 还在跑任务。

你只是想掏出手机看看：

### **做到哪了？结果出来了吗？**

出门以后，它突然停下来等你确认。

或者已经躺床上了，你突然想到：

> “刚才那个需求还得补一句。”

你真正想要的其实很简单：

### **打开手机，继续使用电脑上正在运行的那个 DeepSeek Harness。**

**DSH Remote Web Gateway 就是干这个的。**

不用把整个 Windows 桌面塞进手机，也不用在手机里重新部署一套 Agent。

**项目、会话、工具和 Agent 继续留在电脑上。**
```

</details>

**依据 2 · 源码核查**：[src/gateway.ts:200-222](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/gateway.ts#L200-L222)

配对、授权和 HTTP 代理

<details>
<summary>查看原文（23行）</summary>

```text
      if (dependencies.pairing !== undefined) {
        try {
          if (await dependencies.pairing.routes.handle(request, response)) return
        } catch {
          dependencies.logger.warn({ event: 'pair_internal', method: request.method, path: requestPath, status: 500 })
          writeHttpError(response, 500)
          return
        }
      }
      try {
        await dependencies.authenticator.authenticate(request.headers)
      } catch {
        dependencies.logger.warn({ event: 'http_rejected_auth', method: request.method, path: requestPath, status: 401 })
        const page = dependencies.pairing?.pageFor(request)
        if (page !== undefined) writeHtmlError(response, 401, page)
        else writeHttpError(response, 401)
        return
      }
      dependencies.logger.info({ event: 'http_proxy', method: request.method, path: requestPath })
      proxy.web(request, response, {}, () => {
        dependencies.logger.warn({ event: 'http_upstream_error', method: request.method, path: requestPath, status: 502 })
        writeHttpError(response, 502)
      })
```

</details>

#### 缺口

- 未验证手机交互
  **影响**：无法衡量场景收益
  **进一步探讨**：对同一测试任务测页面查看和续聊

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · HTTP 与 WebSocket 如何验权？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

网关先检查来源策略，屏蔽禁止的管理路径，再认证请求或握手，然后代理。写 HTTP 和 WebSocket 必须带精确 Origin。上游转发会规范化头并过滤网关 cookie。配对成功另签 HttpOnly、Secure Cookie，和上游宿主认证分层。

#### 证据与依据

**依据 1 · 源码核查**：[src/request-policy.ts:48-65](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/request-policy.ts#L48-L65)

写入和握手来源要求

<details>
<summary>查看原文（18行）</summary>

```text
export function enforceHttpRequestPolicy(request: IncomingMessage, publicOrigin: PublicOriginProvider): void {
  commonChecks(request, currentOrigin(publicOrigin))
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const requestOrigin = singleHeader(request.headers, 'origin')
    if (requestOrigin === undefined || !exactOrigin(requestOrigin, currentOrigin(publicOrigin))) {
      throw new RequestPolicyError()
    }
  }
}

/** Enforce a same-origin browser WebSocket handshake before accepting the upgrade. */
export function enforceWebSocketRequestPolicy(request: IncomingMessage, publicOrigin: PublicOriginProvider): void {
  const origin = currentOrigin(publicOrigin)
  commonChecks(request, origin)
  const requestOrigin = singleHeader(request.headers, 'origin')
  if (requestOrigin === undefined || !exactOrigin(requestOrigin, origin)) throw new RequestPolicyError()
  if (singleHeader(request.headers, 'upgrade')?.toLowerCase() !== 'websocket') throw new RequestPolicyError()
}
```

</details>

**依据 2 · 源码核查**：[src/gateway.ts:107-115](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/gateway.ts#L107-L115)

上游头和 cookie

```text
function normalizeUpstreamHeaders(proxyRequest: ClientRequest, request: IncomingMessage, upstream: URL): void {
  proxyRequest.setHeader('host', upstream.host)
  if (request.headers.origin !== undefined) proxyRequest.setHeader('origin', upstream.origin)
  else proxyRequest.removeHeader('origin')
  for (const name of STRIPPED_UPSTREAM_HEADERS) proxyRequest.removeHeader(name)
  const cookie = sanitizeCookieHeader(typeof request.headers.cookie === 'string' ? request.headers.cookie : undefined)
  if (cookie === undefined) proxyRequest.removeHeader('cookie')
  else proxyRequest.setHeader('cookie', cookie)
}
```

**依据 3 · 源码核查**：[src/gateway.ts:229-257](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/gateway.ts#L229-L257)

握手验证

<details>
<summary>查看原文（29行）</summary>

```text
  server.on('upgrade', (request, socket, head) => {
    const requestPath = safePath(request.url)
    void (async () => {
      try {
        enforceWebSocketRequestPolicy(request, publicOriginProvider)
      } catch (error) {
        if (error instanceof PublicOriginUnavailableError) {
          dependencies.logger.warn({ event: 'ws_rejected_closed', method: request.method, path: requestPath, status: 503 })
          writeUpgradeError(socket, 503)
          return
        }
        dependencies.logger.warn({ event: 'ws_rejected_policy', method: request.method, path: requestPath, status: 403 })
        writeUpgradeError(socket, 403)
        return
      }
      if (isDeniedPublicPath(requestPath)) {
        dependencies.logger.warn({ event: 'ws_rejected_denied', method: request.method, path: requestPath, status: 404 })
        writeUpgradeError(socket, 404)
        return
      }
      try {
        await dependencies.authenticator.authenticate(request.headers)
      } catch {
        dependencies.logger.warn({ event: 'ws_rejected_auth', method: request.method, path: requestPath, status: 401 })
        writeUpgradeError(socket, 401)
        return
      }
      dependencies.logger.info({ event: 'ws_proxy', method: request.method, path: requestPath })
      proxy.ws(request, socket, head, {}, () => {
```

</details>

**依据 4 · 源码核查**：[src/pairing-routes.ts:405-428](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/pairing-routes.ts#L405-L428)

设备 cookie 签发

<details>
<summary>查看原文（24行）</summary>

```text

    const name = typeof body.name === 'string' ? body.name : undefined
    const ua = typeof request.headers['user-agent'] === 'string' ? request.headers['user-agent'] : undefined
    let created: { rawToken: string }
    try {
      created = await sessions.create(name, ua)
    } catch (error) {
      if ((error as DeviceSessionError).code === 'device-limit') {
        logger.warn({ event: 'pair_claim_device_limit', method: request.method, path, status: 403 })
        send(response, 403, 'application/json; charset=utf-8', '{"error":"device-limit"}', false)
        return
      }
      logger.warn({ event: 'pair_claim_internal', method: request.method, path, status: 500 })
      send(response, 500, 'application/json; charset=utf-8', '{"error":"internal"}', false)
      return
    }

    response.setHeader('set-cookie', [
      `${DEVICE_SESSION_COOKIE}=${created.rawToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${String(cookieMaxAgeSeconds)}`,
    ])
    logger.info({ event: 'pair_claim_succeeded', method: request.method, path, status: 200 })
    const authRoot = resolveAuthRoot?.()
    send(response, 200, 'application/json; charset=utf-8',
      authRoot === undefined ? '{"ok":true}' : JSON.stringify({ ok: true, redirect: authRoot }), false)
```

</details>

#### 缺口

- 未运行真实隧道和反代
  **影响**：不能确认所有部署绕过风险
  **进一步探讨**：测试不同来源、路径及 cookie

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 设备撤销是否会关闭已建立连接？

**研究主题**：缺陷与关键质疑

#### 完整回答

设备撤销删除会话记录，通过串行队列先写盘再提交到内存。新握手会重新认证，但这条撤销入口只调用存储，没有绑定现有连接关闭；网关关闭另有统一清理 socket 的路径。现有连接的终止行为不能从撤销成功推断。

#### 证据与依据

**依据 1 · 源码核查**：[src/device-session.ts:223-255](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/device-session.ts#L223-L255)

设备状态先持久化

<details>
<summary>查看原文（33行）</summary>

```text
  async function persist(map: Map<string, PersistedDevice>): Promise<void> {
    await mkdir(dirname(options.file), { recursive: true })
    const temporary = `${options.file}.${String(process.pid)}.${randomUUID()}.tmp`
    const payload = serializeState(map)
    if (writeFileImpl !== undefined) {
      await writeFileImpl(temporary, payload)
    } else {
      await writeFile(temporary, payload, { encoding: 'utf8', mode: 0o600, flag: 'wx' })
    }
    try { await rename(temporary, options.file) }
    finally { await rm(temporary, { force: true }) }
  }

  function commit(map: Map<string, PersistedDevice>): void {
    devices = map
    ids = buildIds(map)
  }

  // Serialized mutation queue: every mutating operation derives the next
  // state from the CURRENT committed state, persists it, and only then
  // commits to memory. Older snapshots can never overwrite newer ones.
  let queue: Promise<unknown> = Promise.resolve()
  async function mutate<T>(
    fn: (current: Map<string, PersistedDevice>) => { next: Map<string, PersistedDevice>; result: T },
  ): Promise<T> {
    const run = queue.then(async () => {
      const outcome = fn(devices)
      await persist(outcome.next)
      commit(outcome.next)
      return outcome.result
    })
    queue = run.then(() => undefined, () => undefined)
    return await run
```

</details>

**依据 2 · 源码核查**：[src/device-session.ts:306-318](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/device-session.ts#L306-L318)

撤销修改存储

<details>
<summary>查看原文（13行）</summary>

```text
    async revoke(deviceId: string): Promise<boolean> {
      return await mutate(current => {
        const tokenHash = ids.get(deviceId)
        if (tokenHash === undefined) return { next: current, result: false }
        const next = new Map(current)
        next.delete(tokenHash)
        return { next, result: true }
      })
    },

    async revokeAll(): Promise<void> {
      await mutate(_current => ({ next: new Map(), result: undefined }))
    },
```

</details>

**依据 3 · 源码核查**：[plugin/src/runtime.ts:377-395](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/plugin/src/runtime.ts#L377-L395)

撤销入口仅调用 store

<details>
<summary>查看原文（19行）</summary>

```text
    async deviceRevoke(deviceId: string) {
      if (typeof deviceId !== 'string' || deviceId.length === 0 || deviceId.length > 64) {
        return { ok: false as const, errorCode: 'bad-request' as const }
      }
      try {
        const revoked = await sessions.revoke(deviceId) // durable: resolves true only after persist
        return { ok: true, revoked }
      } catch {
        return { ok: false, errorCode: 'persist-failed' }
      }
    },

    async deviceRevokeAll() {
      try {
        await sessions.revokeAll() // durable: resolves only after persist
        return { ok: true }
      } catch {
        return { ok: false, errorCode: 'persist-failed' }
      }
```

</details>

**依据 4 · 源码核查**：[src/gateway.ts:249-260](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/gateway.ts#L249-L260)

握手后转发

<details>
<summary>查看原文（12行）</summary>

```text
      try {
        await dependencies.authenticator.authenticate(request.headers)
      } catch {
        dependencies.logger.warn({ event: 'ws_rejected_auth', method: request.method, path: requestPath, status: 401 })
        writeUpgradeError(socket, 401)
        return
      }
      dependencies.logger.info({ event: 'ws_proxy', method: request.method, path: requestPath })
      proxy.ws(request, socket, head, {}, () => {
        dependencies.logger.warn({ event: 'ws_upstream_error', method: request.method, path: requestPath, status: 502 })
        socket.destroy()
      })
```

</details>

**依据 5 · 源码核查**：[src/gateway.ts:300-310](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/gateway.ts#L300-L310)

关闭网关清理连接

<details>
<summary>查看原文（11行）</summary>

```text
    close() {
      closing ??= (async () => {
        upstreamAgent.destroy()
        await Promise.all([
          closeServer(server, sockets),
          closeServer(healthServer, healthSockets),
        ])
        proxy.close()
        dependencies.logger.info({ event: 'gateway_stopped' })
      })()
      return closing
```

</details>

#### 缺口

- 未做活跃连接撤销实验
  **影响**：现有连接能继续多久未知
  **进一步探讨**：保持 WS 再撤销，比较活跃与新握手

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样做可控的验收？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

选择隔离宿主和受控手机，按作者入口配置配对。分别验证未配对、错误来源、禁止路径、设备撤销和重启，再用合成任务处理审批。发生异常时关闭网关或隧道并验证现有连接失效。真实账号、隧道和维保费用未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:58-72](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/README.md#L58-L72)

安装、开启、撤销入口

<details>
<summary>查看原文（15行）</summary>

````text
# 🚀 **一条命令，装完就能用**

```bash
dsh plugin --profile web add dsh-remote-web-gateway
```

### 安装以后：

## **重启 DSH → 设置 → 远程控制 → 开启远程控制 → 手机扫码**

**就这么简单。**

### 📘 [**第一次用？打开《用户指南》 →**](docs/USER_GUIDE.md)

安装、扫码、第二台设备、撤销权限、更新和常见问题，都在里面一步一步带你完成。
````

</details>

**依据 2 · 作者声明**：[README.md:115-128](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/README.md#L115-L128)

Quick Tunnel 与授权

<details>
<summary>查看原文（14行）</summary>

```text

## **一键建立 Cloudflare Quick Tunnel。**

### **为了手机使用 DSH，真的要重新部署一套 Agent？**

不用。

## **继续使用电脑上已经运行的 DSH、项目和工具。**

### **为了方便，真的要让一个长期 Token 跟着链接到处跑？**

我们选择了另一种方式：

## **一次性配对 + 独立设备授权 + 随时撤销。**
```

</details>

**依据 3 · 源码核查**：[src/gateway.ts:192-198](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/gateway.ts#L192-L198)

管理路径拒绝

```text
      // The management plane is loopback-only: even a valid device session
      // through the public entry must never reach these prefixes. 404 keeps
      // them indistinguishable from missing resources.
      if (isDeniedPublicPath(requestPath)) {
        dependencies.logger.warn({ event: 'http_rejected_denied', method: request.method, path: requestPath, status: 404 })
        writeHttpError(response, 404)
        return
```

**依据 4 · 源码核查**：[src/gateway.ts:300-310](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/gateway.ts#L300-L310)

关闭入口

<details>
<summary>查看原文（11行）</summary>

```text
    close() {
      closing ??= (async () => {
        upstreamAgent.destroy()
        await Promise.all([
          closeServer(server, sockets),
          closeServer(healthServer, healthSockets),
        ])
        proxy.close()
        dependencies.logger.info({ event: 'gateway_stopped' })
      })()
      return closing
```

</details>

#### 缺口

- 未部署公网
  **影响**：不能证明生产权限边界
  **进一步探讨**：在独立环境验证完整拒绝矩阵

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 按设备关闭活跃连接能改善撤销吗？

**研究主题**：新假设与验证

#### 完整回答

对照当前存储撤销与绑定设备 ID 并关闭已有连接的原型，模拟丢设备。比较从撤销到最后可交互时间及误断其他设备的次数。若误断或恢复代价过大，重新界定作用范围。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/src/runtime.ts:377-395](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/plugin/src/runtime.ts#L377-L395)

当前撤销入口

<details>
<summary>查看原文（19行）</summary>

```text
    async deviceRevoke(deviceId: string) {
      if (typeof deviceId !== 'string' || deviceId.length === 0 || deviceId.length > 64) {
        return { ok: false as const, errorCode: 'bad-request' as const }
      }
      try {
        const revoked = await sessions.revoke(deviceId) // durable: resolves true only after persist
        return { ok: true, revoked }
      } catch {
        return { ok: false, errorCode: 'persist-failed' }
      }
    },

    async deviceRevokeAll() {
      try {
        await sessions.revokeAll() // durable: resolves only after persist
        return { ok: true }
      } catch {
        return { ok: false, errorCode: 'persist-failed' }
      }
```

</details>

**依据 2 · 源码核查**：[src/gateway.ts:225-228](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/gateway.ts#L225-L228)

连接集合无设备归属

```text
  server.on('connection', (socket) => {
    sockets.add(socket)
    socket.once('close', () => { sockets.delete(socket) })
  })
```

**依据 3 · 源码核查**：[src/gateway.ts:249-260](https://github.com/summer1238/dsh-remote-web-gateway/blob/5b2db966a6efec024bd7dd19a152691311ebb124/src/gateway.ts#L249-L260)

握手授权范围

<details>
<summary>查看原文（12行）</summary>

```text
      try {
        await dependencies.authenticator.authenticate(request.headers)
      } catch {
        dependencies.logger.warn({ event: 'ws_rejected_auth', method: request.method, path: requestPath, status: 401 })
        writeUpgradeError(socket, 401)
        return
      }
      dependencies.logger.info({ event: 'ws_proxy', method: request.method, path: requestPath })
      proxy.ws(request, socket, head, {}, () => {
        dependencies.logger.warn({ event: 'ws_upstream_error', method: request.method, path: requestPath, status: 502 })
        socket.destroy()
      })
```

</details>

#### 缺口

- 无实测撤销窗口
  **影响**：假设未验证
  **进一步探讨**：以两台测试设备比较活跃连接

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
