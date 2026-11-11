# DSH Mobile

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[cc3c638](https://github.com/saya-ch/dsh-mobile/tree/cc3c638db4d3fd1464da595043cd60388ac6f0ea)

<!-- BEGIN META -->
[![GitHub ★ 811](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=811&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/saya-ch/dsh-mobile) [![npm 30d 29,750](https://img.shields.io/static/v1?label=npm+30d&message=29%2C750&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile)
<!-- END META -->

> **功能**：通过设备配对让 Android 或手机浏览器访问电脑上的 DeepSeek Harness 会话和工作区。

> **亮点**：[Q01](#research-q01) 将移动入口、单次配对和宿主会话代理接在一起。

> **主要限制**：[Q02](#research-q02) 设备撤销能关闭连接，已交上游的操作仍需回读。[Q03](#research-q03) 推送 queued 不是接收端状态。

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
  - [Q01 · 配对和同一会话访问改变什么？](#detail-section-11)
  - [Q02 · 撤销与重试分别保障什么？](#detail-section-12)
  - [Q03 · 推送和持续使用的条件与代价是什么？](#detail-section-13)
  - [Q04 · 怎样试用与验证结果未知提示？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在电脑与手机之间继续 DSH 工作的用户可以先读取隔离会话并核对两端一致。

可信网络网页或已有 VPN 可用于访问同一宿主；此方案增加设备配对、移动布局和可选通知。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 移动查看 | 继续原会话 | 在线 Host、可信设备与可达网络 |
| 设备管理 | 配对和撤销 | 退出不证明上游动作停止 |
| Web 通知 | 接收允许类别的通知 | 入队与实际送达分别核查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 在线 Host、受信手机、可达 HTTPS | 基础连接必需 | 配对和访问原会话 | 回电脑查看 |
| 浏览器权限及订阅 | Web 推送需要 | 投递已启用类别 | 留在应用内查看 |
| 通道与证书配置 | 按连接方式 | 建立可信链路 | 保留可信局域网 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配对 | 使用者在可信网络加入测试设备 | 身份匹配 |
| 读取 | 手机查已知测试消息 | 与原 Host 一致 |
| 退出 | 电脑撤销设备 | 旧会话失效，已提交动作独立查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 证书及网络资源未知 | 配对和核对设备 | 真实兼容未知 |
| 持续 | 电脑及通道资源未知 | 维护设备和推送偏好 | 送达频率未测 |
| 失败恢复 | 网络与重试资源未知 | 回电脑核对动作 | 撤销不回滚业务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 移动访问 | 配对与代理主线 | 实际手机兼容 |
| 设备退出 | 持久撤销和连接清理 | 已接受动作结果 |
| 推送 | 按状态入队 | 实际送达和锁屏 |

> **思考**：[Q02](#research-q02) 设备撤销能关闭连接，已交上游的操作仍需回读。[Q03](#research-q03) 推送 queued 不是接收端状态。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将移动入口、单次配对和宿主会话代理接在一起。

配对串行区复查、只重试窄范围 GET，设备撤销和业务回滚分属不同状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 设备撤销能关闭连接，已交上游的操作仍需回读。[Q03](#research-q03) 推送 queued 不是接收端状态。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从可信局域网只读会话和设备撤销起步，异常后回电脑核对原任务。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码已核查配对、代理重试、撤销及推送入队。未验证真实设备、外部线路及已接收上游动作。

- 已检查：作者 README、包清单、源码路径 src/access.ts、src/gateway.ts、src/mobile-push/service.ts、src/mobile-push/delivery.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查主机配对、指定 HTTP 代理与 Web push 入队，未执行目标、全线路或实际设备。
- 下一步：用一个可信测试设备对照读取、撤销及代理断点，推送仅在单独订阅和无敏感文案下测试。

**分析版本**

- **仓库**：[saya-ch/dsh-mobile](https://github.com/saya-ch/dsh-mobile)
- **版本号**：0.8.6（[固定提交 cc3c638](https://github.com/saya-ch/dsh-mobile/tree/cc3c638db4d3fd1464da595043cd60388ac6f0ea)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在断线时呈现可证实的请求阶段及结果未知，可作为减少误重发的待验证方向。

用一个可信测试设备对照读取、撤销及代理断点，推送仅在单独订阅和无敏感文案下测试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 55 | 7147 | — | — | 167573 |
| .mjs | source | 82 | 21022 | 19104 | 1295 | — |
| .ts | source | 138 | 45631 | 38588 | 4916 | — |
| .ts | test | 207 | 53381 | 47694 | 2902 | — |
| .mjs | example | 1 | 99 | 70 | 26 | — |
| .mjs | test | 3 | 273 | 232 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=23&color=737b86&logo=github)](https://github.com/saya-ch/dsh-mobile/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 79](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=79&color=737b86&logo=github)](https://github.com/saya-ch/dsh-mobile/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 69](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=69&color=737b86&logo=github)](https://github.com/saya-ch/dsh-mobile/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户能否在可信局域网续看同一会话，理解设备撤销、连接异常和可选推送的证据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 配对和同一会话访问改变什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

经常在电脑和手机间切换的 DSH 用户可以先用手机查看同一条测试会话，确认工作区和最近消息一致。已有可信网络上的独立网页或 VPN 可满足基本访问，插件增加针对手机的布局、配对及设备管理。配对候选在排队前核对令牌摘要和有效期，进入串行写入后重新检查，消费窗口，再把长期设备令牌摘要写入并创建短会话。网关对变更请求要求 session 绑定的防跨站请求伪造值。作者声明局域网、不同远端通道及 Android／浏览器入口，本次只核查主机配对和选定代理路径。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-53](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/README.md#L35-L53)

作者区分 Android、浏览器、远程通道和配对。

<details>
<summary>查看原文（19行）</summary>

```text
> DSH Mobile 是 DeepSeek Harness 社区插件，原生 App 仅支持 Android。
>
> **使用 iPhone 或 iPad？** 可以用 Safari 访问，或[添加到主屏幕作为 Web App（PWA）使用](<#iphone-与-ipad主屏幕-web-apppwa>)，无需下载原生 iOS App。
>
> **当前正式版本：0.8.6**。透传已配对第三方插件的请求头，修正网页推送停用后的订阅处理，并向受信 Host 插件开放推送文案接口；同时修复 Windows 防火墙校验、iroh 目录诊断与局域网诊断口径。插件与 Android App 独立更新；Android App 0.7.3 已发布，新增可选后台提醒。[插件更新与下载](https://github.com/saya-ch/dsh-mobile/releases/tag/v0.8.6) · [完整更新记录](CHANGELOG.md)。
>
> **版本说明**：自插件 **0.6.2** 起，Android App 与插件改为独立发布（当时 App 仍为 0.6.1）；App 自 0.6.2 起使用独立编号，版本号无需一致；插件升级不代表 App 需要同步升级。[兼容说明](#兼容性)。

<p align="center">
  <a href="https://github.com/saya-ch/dsh-mobile/releases/download/android-v0.7.3/dsh-mobile-android-v0.7.3.apk"><img src="https://raw.githubusercontent.com/saya-ch/dsh-mobile/main/assets/brand/app-icon-rounded.svg" alt="DSH Mobile 安卓应用图标" width="72" height="72"></a><br>
  <a href="https://github.com/saya-ch/dsh-mobile/releases/download/android-v0.7.3/dsh-mobile-android-v0.7.3.apk"><strong>下载 Android App 0.7.3（兼容版）</strong></a><br>
  <sub><a href="https://github.com/saya-ch/dsh-mobile/releases/download/android-v0.7.3/dsh-mobile-android-v0.7.3-iroh.apk">64 位完整版（含实验性 iroh）</a> · <a href="https://github.com/saya-ch/dsh-mobile/releases/tag/android-v0.7.3">版本说明与校验文件</a></sub>
</p>

DSH Mobile 是一个 DeepSeek Harness 插件，让手机浏览器或 Android App 通过局域网，或可选的 Tailscale Funnel、cpolar、cloudflared、自建 FRP、自有反向代理远程通道连接电脑；Android 完整版还支持实验性 iroh 加密直连与中继。手机可以继续使用电脑上的会话、工作区、消息和工具。电脑端分别启停局域网与远程访问、分别管理配对授权；Android App 统一显示已配对电脑。插件不修改 DeepSeek Harness 源码。

移动访问使用独立 HTTPS 与设备配对；Android App 固定局域网私有 CA，公开远程通道使用系统信任的证书；自签 FRP 入口还需由 0.4.6 App 在配对时固定远程 CA。

它还能在 DSH 对话里用 `/mobile <需求>` 定制手机端。
```

</details>

**依据 2 · 源码核查**：[src/access.ts:319-359](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/src/access.ts#L319-L359)

双重核对、消费窗口、持久设备摘要和短会话。

<details>
<summary>查看原文（41行）</summary>

```text
  /** Consume the pairing window exactly once and persist only the device-token digest. */
  async pair(sourceKey: string, token: string, label?: string): Promise<PairingResult> {
    this.requireInitialized()
    const initialNow = this.now()
    const initialWindow = this.pairingWindow
    // Reject unknown guesses before the serialized mutation queue. A candidate
    // is checked again inside it because another pairing or opening can replace
    // the one-time window while this request waits.
    if (token.length > 512 || initialWindow === undefined || initialWindow.expiresAt <= initialNow
      || !matchesDigest(token, initialWindow.digest)) {
      this.rejectPairingAttempt(sourceKey, initialNow)
    }
    if (this.pairPending) throw new AccessError(429, 'rate_limited')
    this.pairPending = true
    try {
      return await this.exclusive(async () => {
        const now = this.now()
        const window = this.pairingWindow
        if (window === undefined || window.expiresAt <= now || !matchesDigest(token, window.digest)) {
          if (window !== undefined && window.expiresAt <= now) this.pairingWindow = undefined
          this.rejectPairingAttempt(sourceKey, now)
        }
        this.pairingWindow = undefined
        const active = this.devices.filter(device => device.revokedAt === undefined && device.expiresAt > now)
        if (active.length >= this.options.maxDevices) throw new AccessError(409, 'device_limit')

        const deviceToken = opaqueToken()
        const device: StoredDevice = Object.freeze({
          id: randomBytes(16).toString('hex'),
          label: normalizeLabel(label),
          tokenDigest: digestHex(deviceToken),
          createdAt: now,
          expiresAt: now + this.options.deviceTtlMs,
          lastSeenAt: now,
          ...(this.options.pairingInstanceId === undefined ? {} : { nativeInstanceId: this.options.pairingInstanceId }),
        })
        const retained = this.devices.filter(candidate => candidate.revokedAt === undefined && candidate.expiresAt > now)
        const next = [...retained, device]
        await this.store.save(this.snapshot(next))
        this.devices = next
        const session = this.createSession(device, now)
```

</details>

**依据 3 · 源码核查**：[src/access.ts:436-442](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/src/access.ts#L436-L442)

防跨站值随会话校验。

```text
  /** Require the Session-bound anti-CSRF value for an authenticated mutation. */
  assertCsrf(authorization: SessionAuthorization, csrfToken: string | undefined): void {
    const session = this.sessions.get(authorization.sessionKey)
    if (session === undefined || csrfToken === undefined || csrfToken.length > 512
      || !matchesDigest(csrfToken, session.csrfDigest)) {
      throw new AccessError(403, 'forbidden')
    }
```

**依据 4 · 源码核查**：[src/gateway.ts:2405-2416](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/src/gateway.ts#L2405-L2416)

实际变更路由执行检查。

<details>
<summary>查看原文（12行）</summary>

```text
    const viewId = headerValue(request.headers, MOBILE_DOCUMENT_VIEW_HEADER)
    const documentView = viewId === undefined ? undefined : this.requireMobileDocumentView(viewId, authorization, request)
    if (isMutation) {
      try {
        this.requireCsrf(request, authorization)
      } catch (error) {
        this.authFailures.record('csrf', mapError(error).status, request, target.decodedPathname, policy.canonicalOrigin(request.headers.origin), authorization)
        throw error
      }
    }
    if (mobilePushRoute) {
      await this.handleMobilePushRequest(target, request, response, authorization)
```

</details>

#### 缺口

- 未在真实手机和 Host 验证同会话。
  **影响**：设备、证书和宿主兼容仍未知。
  **进一步探讨**：用可信局域网配对后从两端核对预置测试会话。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 撤销与重试分别保障什么？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

撤销先持久删除设备，再移除它的短会话；网关按 sessionKey 取消在途 HTTP 并关闭两端 WebSocket。代理只在无请求体的插件或静态资源 GET 上允许多次尝试，其他路径尝试一次，响应已发部分时会终止。上述处理有助于停止网关传输与新访问，已被上游接收的操作仍可能完成。接收端在断线时看不到应答，用户应回电脑查实际会话、文件或任务后再决定是否重试。

#### 证据与依据

**依据 1 · 源码核查**：[src/access.ts:450-465](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/src/access.ts#L450-L465)

持久撤销设备并移除已有短会话。

<details>
<summary>查看原文（16行）</summary>

```text
  /** Durably delete the device, then end every Session owned by that device. */
  async revokeDevice(deviceId: string): Promise<boolean> {
    this.requireInitialized()
    return this.exclusive(async () => {
      const next = this.devices.filter(device => device.id !== deviceId)
      if (next.length === this.devices.length) return false
      await this.store.save(this.snapshot(next))
      this.devices = next
      try {
        for (const [key, session] of this.sessions) {
          if (session.deviceId === deviceId) this.removeSession(key, 'revoked')
        }
      } finally {
        this.emitDevicesRemoved([deviceId], 'revoked')
      }
      return true
```

</details>

**依据 2 · 源码核查**：[src/gateway.ts:4146-4156](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/src/gateway.ts#L4146-L4156)

释放该会话的 HTTP 与双向 WebSocket。

<details>
<summary>查看原文（11行）</summary>

```text
  private abortSessionResources(sessionKey: string): void {
    for (const request of this.activeRequests.values()) {
      if (request.sessionKey === sessionKey) request.abort()
    }
    for (const socket of this.activeWebSockets.values()) {
      if (socket.sessionKey === sessionKey) {
        socket.client.destroy()
        socket.upstream.destroy()
      }
    }
  }
```

</details>

**依据 3 · 源码核查**：[src/gateway.ts:3937-3953](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/src/gateway.ts#L3937-L3953)

只有符合窄条件的静态 GET 可重试。

<details>
<summary>查看原文（17行）</summary>

```text
    const declared = request.headers['content-length']
    if (declared !== undefined && (!/^\d+$/u.test(declared) || Number(declared) > this.config.maxBodyBytes)) {
      throw new HttpError(413, 'payload_too_large')
    }
    const replayable = request.method === 'GET'
      && request.headers['transfer-encoding'] === undefined
      && (declared === undefined || Number(declared) === 0)
      && (request.url?.split('?', 1)[0]?.startsWith('/plugins/') === true
        || request.url?.split('?', 1)[0]?.startsWith('/assets/') === true)
    const holder: { request?: ClientRequest } = {}
    const operation = this.allocateRequest(authorization, response, holder)
    documentView?.abortStreams.add(operation.abort)
    const onClose = (): void => {
      if (documentView === undefined) operation.release()
      operation.abort()
    }
    response.once('close', onClose)
```

</details>

**依据 4 · 源码核查**：[src/gateway.ts:3972-3989](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/src/gateway.ts#L3972-L3989)

非 replayable 一次，已发响应时不继续。

<details>
<summary>查看原文（18行）</summary>

```text
    try {
      const attempts = replayable ? MOBILE_BOOT_UPSTREAM_ATTEMPTS : 1
      for (let attempt = 1; attempt <= attempts; attempt++) {
        operation.signal.throwIfAborted()
        try {
          await this.proxyHttpOnce(request, response, holder, operation.signal, replayable, documentView, bodyOverride)
          return
        } catch (error) {
          if (operation.signal.aborted || response.destroyed) return
          if (response.headersSent) {
            response.destroy()
            return
          }
          if (error instanceof HttpError || !isTransientUpstreamError(error)) {
            throw error instanceof HttpError ? error : new HttpError(502, 'upstream_unavailable')
          }
          if (attempt === attempts) throw new HttpError(502, 'upstream_unavailable')
          await waitForAbortableDelay(MOBILE_BOOT_RETRY_DELAY_MS * attempt, operation.signal)
```

</details>

#### 缺口

- 未执行撤销中的真实写请求及上游运行。
  **影响**：无法确认已经被上游接受的具体任务是否完成。
  **进一步探讨**：在隔离会话分阶段断开，分别检查手机结果和电脑端真实动作。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 推送和持续使用的条件与代价是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

基本访问需要在线电脑、可信手机和可达 HTTPS；公网线路、证书与各平台支持需按实际部署验证。推送额外依赖浏览器订阅、主机可用性和用户类别偏好。受信 Host 插件可调用 mobilePush，输入的标题和正文经长度、类别、会话存在及期限校验后入队；代码保留调用者自定义文案，接入者要核对锁屏能否显示其内容。入队筛选当前设备、Origin、开关、类别和代际，返回 queued 数量仍需与终端收到区分。首次投入是配对与证书，持续投入是电脑、网络、推送偏好和设备维护，失败时需排查通道、地址、撤销和接收端，当前均无单次测量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-51](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/README.md#L49-L51)

作者声明按连接方式区分 HTTPS 和证书。

```text
DSH Mobile 是一个 DeepSeek Harness 插件，让手机浏览器或 Android App 通过局域网，或可选的 Tailscale Funnel、cpolar、cloudflared、自建 FRP、自有反向代理远程通道连接电脑；Android 完整版还支持实验性 iroh 加密直连与中继。手机可以继续使用电脑上的会话、工作区、消息和工具。电脑端分别启停局域网与远程访问、分别管理配对授权；Android App 统一显示已配对电脑。插件不修改 DeepSeek Harness 源码。

移动访问使用独立 HTTPS 与设备配对；Android App 固定局域网私有 CA，公开远程通道使用系统信任的证书；自签 FRP 入口还需由 0.4.6 App 在配对时固定远程 CA。
```

**依据 2 · 源码核查**：[src/mobile-push/service.ts:13-28](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/src/mobile-push/service.ts#L13-L28)

宿主服务暴露自定义通知队列入口。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * Small Cordis service exposed to trusted Host plugins. The provider owns the
 * runtime lifetime and all recipient, category, session, and expiry checks.
 */
export class MobilePushService extends Service {
  constructor(ctx: Context, private readonly send: SendCustomPush) {
    super(ctx, 'mobilePush')
  }

  /**
   * Queue a notification for enabled web-push recipients.
   * @param input - Session, text, optional category and optional expiry.
   * @returns The number of newly queued recipient deliveries and the applied expiry.
   */
  async notify(input: PushCustomNotification): Promise<PushCustomNotificationResult> {
    return await this.send(input)
```

</details>

**依据 3 · 源码核查**：[src/mobile-push/delivery.ts:188-217](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/src/mobile-push/delivery.ts#L188-L217)

校验文案、类别、期限和会话，返回入队数量。

<details>
<summary>查看原文（30行）</summary>

```text
  async notifyCustom(input: PushCustomNotification): Promise<PushCustomNotificationResult> {
    if (!this.#started || this.#closed || !this.#admitting) throw new Error('push_unavailable')
    const sessionId = typeof input.sessionId === 'string' ? input.sessionId.trim() : ''
    if (sessionId === '' || sessionId.length > 4_096) throw new TypeError('push_session_id_invalid')
    const title = notificationText(input.title, 80, 'title')
    const body = notificationText(input.body, 200, 'body')
    const category = input.category ?? 'response'
    if (!['question', 'plan', 'approval', 'response', 'goal', 'failure'].includes(category)) {
      throw new TypeError('push_category_invalid')
    }
    const now = this.#now()
    const maximumExpiry = now + OUTCOME_TTL_MS
    if (input.expiresAt !== undefined && (!Number.isSafeInteger(input.expiresAt) || input.expiresAt <= now)) {
      throw new TypeError('push_expiry_invalid')
    }
    const expiresAt = Math.min(input.expiresAt ?? maximumExpiry, maximumExpiry)
    if (!await this.#host.sessionExists(sessionId)) throw new Error('push_session_unavailable')
    const source: PushSource = {
      sourceId: `custom:${randomUUID()}`,
      sessionId,
      targetSessionId: sessionId,
      category,
      createdAt: now,
      expiresAt,
      lifetime: 'committed',
      custom: { title, body },
    }
    const queued = await this.#admit(source)
    this.#kick()
    return { queued, expiresAt }
```

</details>

**依据 4 · 源码核查**：[src/mobile-push/delivery.ts:263-294](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/src/mobile-push/delivery.ts#L263-L294)

按已授权设备和有效订阅偏好入队。

<details>
<summary>查看原文（32行）</summary>

```text
    let queued = 0
    for (const origin of this.#origins.values()) {
      if (!origin.active || this.#closed) continue
      const devices = await this.#readAuthorized(origin)
      if (!devices || !this.#admitting || this.#closed || !origin.active || this.#origins.get(this.#originId(origin)) !== origin) continue
      let snapshot: PushSnapshot
      try { snapshot = this.#registry.snapshot() } catch { return queued }
      const registrations = snapshot.registrations.filter(reg => reg.scopeId === origin.scopeId && reg.origin === origin.origin
        && devices.has(reg.deviceId) && reg.enabled && reg.health === 'ready' && isPreferenceEnabled(reg.preferences, source.category)
        && snapshot.keys?.fingerprint === reg.keyFingerprint)
      if (registrations.length === 0) continue
      await this.#write(current => {
        const clean = boundedSnapshot(current, this.#now())
        if (!this.#admitting || this.#closed || !origin.active || this.#origins.get(this.#originId(origin)) !== origin) return clean
        const pending = [...clean.pending]
        for (const registration of registrations) {
          const key: PushRecipientKey = { scopeId: registration.scopeId, deviceId: registration.deviceId, origin: registration.origin, installationId: registration.installationId }
          const currentRegistration = clean.registrations.find(row => sameKey(row, key))
          if (!currentRegistration || !currentRegistration.enabled || currentRegistration.health !== 'ready'
            || currentRegistration.generation !== registration.generation || currentRegistration.keyFingerprint !== registration.keyFingerprint
            || clean.keys?.fingerprint !== currentRegistration.keyFingerprint || !isPreferenceEnabled(currentRegistration.preferences, source.category)) continue
          if (clean.receipts.some(item => item.sourceId === source.sourceId && sameKey(item.key, key))) continue
          if (pending.some(item => item.source.sourceId === source.sourceId && sameKey(item.key, key))) continue
          const count = pending.filter(item => item.key.scopeId === origin.scopeId).length
          if (count >= MAX_PENDING_PER_SCOPE) continue
          pending.push({
            id: randomUUID(), key, source: structuredClone(source),
            ownerGeneration: current.ownerGenerations.find(row => ownerId(row) === ownerId(key))?.generation ?? 0,
            recipientGeneration: registration.generation,
            attempts: 0, nextAttemptAt: this.#now(),
          })
          queued += 1
```

</details>

#### 缺口

- 未在 Android 或主屏幕 Web App 验证送达、停用和锁屏。
  **影响**：不能把推送入队和设备收到或脱敏展示等同。
  **进一步探讨**：分别验证启停、过期、拒绝授权及锁屏内容，费用按通道核对。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用与验证结果未知提示？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可先在可信局域网和隔离工作区配对一台手机，读取一条已知消息，随后在电脑端撤销该设备，核对旧会话不能继续操作。若地址或身份不符，或断线后任务结果不清，回电脑看真实状态，暂不重发。待验证假设是将设备、请求阶段和 Host 回查结果放在同一反馈入口，对已发送但无应答的动作明确保留未知。模拟代理前断开、已送上游未应答以及正常完成，比较误重发和找回状态的时间；无法准确归因或引入明显负担时保留电脑端核查。

#### 证据与依据

**依据 1 · 源码核查**：[src/access.ts:450-465](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/src/access.ts#L450-L465)

撤销顺序可作为退出验收依据。

<details>
<summary>查看原文（16行）</summary>

```text
  /** Durably delete the device, then end every Session owned by that device. */
  async revokeDevice(deviceId: string): Promise<boolean> {
    this.requireInitialized()
    return this.exclusive(async () => {
      const next = this.devices.filter(device => device.id !== deviceId)
      if (next.length === this.devices.length) return false
      await this.store.save(this.snapshot(next))
      this.devices = next
      try {
        for (const [key, session] of this.sessions) {
          if (session.deviceId === deviceId) this.removeSession(key, 'revoked')
        }
      } finally {
        this.emitDevicesRemoved([deviceId], 'revoked')
      }
      return true
```

</details>

**依据 2 · 源码核查**：[src/gateway.ts:3972-3989](https://github.com/saya-ch/dsh-mobile/blob/cc3c638db4d3fd1464da595043cd60388ac6f0ea/src/gateway.ts#L3972-L3989)

代理重试边界作为故障对照基线。

<details>
<summary>查看原文（18行）</summary>

```text
    try {
      const attempts = replayable ? MOBILE_BOOT_UPSTREAM_ATTEMPTS : 1
      for (let attempt = 1; attempt <= attempts; attempt++) {
        operation.signal.throwIfAborted()
        try {
          await this.proxyHttpOnce(request, response, holder, operation.signal, replayable, documentView, bodyOverride)
          return
        } catch (error) {
          if (operation.signal.aborted || response.destroyed) return
          if (response.headersSent) {
            response.destroy()
            return
          }
          if (error instanceof HttpError || !isTransientUpstreamError(error)) {
            throw error instanceof HttpError ? error : new HttpError(502, 'upstream_unavailable')
          }
          if (attempt === attempts) throw new HttpError(502, 'upstream_unavailable')
          await waitForAbortableDelay(MOBILE_BOOT_RETRY_DELAY_MS * attempt, operation.signal)
```

</details>

#### 缺口

- 任务阶段反馈与故障对照未实现。
  **影响**：不能证明能降低重复提交。
  **进一步探讨**：隔离环境对照三种断点和真实 Host 状态。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
