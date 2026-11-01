# DSH Mobile

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3cd86a2](https://github.com/saya-ch/dsh-mobile/tree/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc)

<!-- BEGIN META -->
[![GitHub ★ 704](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=704&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/saya-ch/dsh-mobile) [![npm 30d 19,378](https://img.shields.io/static/v1?label=npm+30d&message=19%2C378&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile)
<!-- END META -->

> **功能**：让手机浏览器或 Android App 通过局域网或远程通道继续使用电脑中的 DSH。

> **亮点**：把移动界面、配对、认证和撤销组织为个人跨设备入口；宿主继续提供会话与工具。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：配对设备可操作电脑 DSH；断线或撤销连接不能回滚上游已执行任务。[Q03](#research-q03)

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
  - [Q01 · 手机接入给什么用户带来什么，相比现有 VPN 有何增量？](#detail-section-11)
  - [Q02 · 配对、会话认证与撤销怎样连接？](#detail-section-12)
  - [Q03 · 撤销与断线能否回滚上游任务？](#detail-section-13)
  - [Q04 · 部署、远程连接和退出有哪些成本与操作？](#detail-section-14)
  - [Q05 · 如何检验断线状态提示能否降低误重试？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要离开电脑继续操作 DSH 的个人；基线是可信网络网页或已有 VPN。[Q01](#research-q01)

使用可信网络中的 DSH 网页或现有 VPN，必要时回电脑操作。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 手机访问 | 继续电脑会话 | 电脑在线且设备受信 |
| 配对认证 | 管理设备访问 | 不提供多用户隔离 |
| 撤销 | 停止设备会话 | 不回滚上游任务 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 在线电脑与兼容 DSH | 必需 | 原会话与工具 | 回电脑排查 |
| 受信任手机及网络 | 必需 | 安全配对 | 不配对 |
| HTTPS 隧道或 VPN | 异地需要 | 可达远程网关 | 使用可信局域网 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定 DSH 和手机版本 | 保留电脑入口 |
| 配对 | 在可信网络配对本人设备 | 核对同会话 |
| 验证 | 运行低副作用任务并撤销 | 断线先对账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 网络与证书资源未知 | 配对和配置 | 不同通道要求不同 |
| 持续 | 电脑和隧道资源 | 设备信任维护 | 节时未测 |
| 恢复 | 断线任务可能有副作用 | 回电脑查证 | 连接撤销不回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 配对 | 一次窗口和设备 token | 实际移动连通 |
| 退出 | 撤销设备结束会话 | 上游动作撤销 |

> **思考**：配对设备可操作电脑 DSH；断线或撤销连接不能回滚上游已执行任务。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把移动界面、配对、认证和撤销组织为个人跨设备入口；宿主继续提供会话与工具。[Q01](#research-q01) [Q02](#research-q02)

串行区复验并消费配对窗口，认证请求有 CSRF 及在途资源中止；业务副作用仍须另行对账。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

配对设备可操作电脑 DSH；断线或撤销连接不能回滚上游已执行任务。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

可信局域网先验证同会话和撤销；发生不明断线时回电脑核对再决定是否重试。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持配对、CSRF 和代理中止路径；移动宿主、网络及业务效果未运行。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/access.ts、src/gateway.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 466 个指定扩展名文件、无排除或解析错误；静态核查配对与代表 HTTP 代理，不运行移动端或 DSH。
- 下一步：固定宿主与手机，在可信网络验证配对、撤销、请求中断及上游实际结果。

**分析版本**

- **仓库**：[saya-ch/dsh-mobile](https://github.com/saya-ch/dsh-mobile)
- **版本号**：0.8.0（[固定提交 3cd86a2](https://github.com/saya-ch/dsh-mobile/tree/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：显示可证实的请求阶段和结果未知状态，可减少断线后误重试；须比较现有中止机制并检验误报。[Q05](#research-q05)

固定宿主与手机，在可信网络验证配对、撤销、请求中断及上游实际结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 52 | 6359 | — | — | 148888 |
| .ts | source | 132 | 43306 | 36779 | 4508 | — |
| .ts | test | 199 | 50523 | 45131 | 2789 | — |
| .mjs | source | 79 | 20215 | 18381 | 1231 | — |
| .mjs | example | 1 | 52 | 34 | 15 | — |
| .mjs | test | 3 | 273 | 232 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/saya-ch/dsh-mobile/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 63](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=63&color=737b86&logo=github)](https://github.com/saya-ch/dsh-mobile/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 81](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=81&color=737b86&logo=github)](https://github.com/saya-ch/dsh-mobile/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：手机如何安全接入电脑 DSH，设备撤销和断线的实际边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 手机接入给什么用户带来什么，相比现有 VPN 有何增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要离开电脑继续查看和操作 DSH 的个人可通过手机浏览器或 Android 客户端访问同一电脑会话。对照是可信网络中的 DSH 网页、现有 VPN 和手工回电脑；配对、设备撤销和触屏布局整合了跨设备步骤，但会话、工具和模型仍来自宿主。配对设备有操作电脑 DSH 的能力，不能将它视作多用户隔离，也不能由功能描述推断真实效率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:55-67](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/README.md#L55-L67)

作者描述触屏、配对与可信设备边界。

<details>
<summary>查看原文（13行）</summary>

```text
## 能做什么

- **在手机上继续电脑端的工作**：同一份会话、工作区、消息和工具，实时同步。
- **用对话定制手机端**：在 DSH 对话里提出布局、交互或功能需求；文件修改完成后，自定义资源通常会自动更新。
- **专属触屏布局**：会话抽屉、工具详情、设置、提问卡片和输入栏都按手机重新组织；侧栏列表在本页内记住位置，切换会话再打开不会总跳回顶部。App 跟随系统语言（简/英/意），插件界面跟随 DSH 语言。
- **多种远程通道**：Tailscale、cpolar、cloudflared 快速/命名隧道、自建 FRP、自有反向代理，以及无需域名和公网端口的实验性 iroh；Windows/Linux x64 还可由插件托管 Caddy HTTPS 与证书。
- **配对与多设备**：扫码、链接或密钥配对一次；切换 Wi-Fi、热点或 IP 后通常自动恢复；App 在一个列表中显示局域网和远程配对的电脑，定期检测可达状态，并支持切换、重新配对或删除本地记录。
- **一键诊断与放行**：检查版本、网关、网卡、防火墙和远程通道，生成脱敏报告；被拦截的第三方插件连接按确切路径一键放行。
- **iPhone / iPad 网页推送**：将页面添加到主屏幕后，在 DSH“通用设置”中主动开启；支持六类提醒和分类开关，页面关闭或锁屏后也可接收，锁屏文字不含会话正文。[使用条件与设置](docs/WEB_PUSH.md)。
- **Android 任务通知**：在 App 内 DSH“通用设置”中开启任务完成与待输入提醒，使用独立的原生通知通道，锁屏文本脱敏。
- **纵深安全**：局域网固定私有 CA，公开远程入口使用受信任 HTTPS；自签 FRP 入口由 0.4.6 App 固定远程 CA。凭据存 Keystore，设备令牌只发往精确 Origin，第三方 WS 默认拦截。

配对设备可以操作电脑上的 DSH，应视为完全受信任的设备。局域网只在可信网络开启；远程访问应使用可靠的 HTTPS 通道。手机丢失时，请立即从电脑端撤销设备。
```

</details>

**依据 2 · 源码核查**：[package.json:1-5](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/package.json#L1-L5)

插件及移动访问定位。

```text
{
  "name": "dsh-mobile",
  "version": "0.8.0",
  "private": false,
  "description": "DeepSeek Harness 移动端适配与安全访问插件，支持局域网、远程连接、Android App 和手机浏览器。",
```

#### 缺口

- 未运行 DSH、移动端或真实网络任务
  **影响**：无法确认配对、撤销及时性及业务副作用
  **进一步探讨**：固定宿主与手机，在可信环境核验会话、断线和撤销

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配对、会话认证与撤销怎样连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

配对先校验一次性窗口和令牌，再在串行区重新校验并消费窗口，受设备数限制；设备 token 只保存摘要。认证变更请求检查会话绑定的 CSRF 值；撤销设备持久删除并结束其会话。网关登记受授权请求，超时或取消时中止代理请求和响应；这是一条静态接线证据，未证明移动端、网络环境和所有 WS 路径都已通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/access.ts:320-350](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/src/access.ts#L320-L350)

双重校验配对窗口并生成设备凭据。

<details>
<summary>查看原文（31行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/access.ts:436-460](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/src/access.ts#L436-L460)

会话 CSRF、退出及设备撤销。

<details>
<summary>查看原文（25行）</summary>

```text
  /** Require the Session-bound anti-CSRF value for an authenticated mutation. */
  assertCsrf(authorization: SessionAuthorization, csrfToken: string | undefined): void {
    const session = this.sessions.get(authorization.sessionKey)
    if (session === undefined || csrfToken === undefined || csrfToken.length > 512
      || !matchesDigest(csrfToken, session.csrfDigest)) {
      throw new AccessError(403, 'forbidden')
    }
  }

  /** End one short Session and notify the gateway to abort its attached work. */
  logout(authorization: SessionAuthorization): void {
    this.removeSession(authorization.sessionKey, 'logout')
  }

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
```

</details>

**依据 3 · 源码核查**：[src/gateway.ts:3592-3608](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/src/gateway.ts#L3592-L3608)

在途代理请求受授权和中止管理。

<details>
<summary>查看原文（17行）</summary>

```text
  private allocateRequest(
    authorization: SessionAuthorization,
    response: ServerResponse,
    upstream: { request?: ClientRequest },
  ): { id: number; signal: AbortSignal; abort: () => void; release: () => void } {
    if (this.closing || response.destroyed || response.writableEnded) throw requestAbortedError()
    if (this.activeRequests.size >= this.config.maxActiveRequests) throw new HttpError(429, 'busy')
    const id = this.nextOperationId++
    const controller = new AbortController()
    const abort = (): void => {
      controller.abort()
      upstream.request?.destroy()
      if (!response.destroyed) response.destroy()
    }
    const timer = setTimeout(abort, Math.max(1, authorization.expiresAt - Date.now()))
    timer.unref()
    this.activeRequests.set(id, Object.freeze({ ...authorization, abort, timer }))
```

</details>

#### 缺口

- 未运行 DSH、移动端或真实网络任务
  **影响**：无法确认配对、撤销及时性及业务副作用
  **进一步探讨**：固定宿主与手机，在可信环境核验会话、断线和撤销

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 撤销与断线能否回滚上游任务？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

设备撤销使其会话失效，网关可中止关联代理连接，但这只控制通道：上游已接收并执行的命令或外部副作用不会因此自动回滚。断网或响应丢失不能证明上游未执行；先回电脑检查会话和外部结果，再决定是否重试。即使通过配对，设备仍是完全受信任的操作者，不能以认证等同细粒度授权。

#### 证据与依据

**依据 1 · 源码核查**：[src/access.ts:445-460](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/src/access.ts#L445-L460)

设备撤销与会话终止。

<details>
<summary>查看原文（16行）</summary>

```text
  /** End one short Session and notify the gateway to abort its attached work. */
  logout(authorization: SessionAuthorization): void {
    this.removeSession(authorization.sessionKey, 'logout')
  }

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
```

</details>

**依据 2 · 源码核查**：[src/gateway.ts:3592-3608](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/src/gateway.ts#L3592-L3608)

中止客户端代理链而非上游业务事务。

<details>
<summary>查看原文（17行）</summary>

```text
  private allocateRequest(
    authorization: SessionAuthorization,
    response: ServerResponse,
    upstream: { request?: ClientRequest },
  ): { id: number; signal: AbortSignal; abort: () => void; release: () => void } {
    if (this.closing || response.destroyed || response.writableEnded) throw requestAbortedError()
    if (this.activeRequests.size >= this.config.maxActiveRequests) throw new HttpError(429, 'busy')
    const id = this.nextOperationId++
    const controller = new AbortController()
    const abort = (): void => {
      controller.abort()
      upstream.request?.destroy()
      if (!response.destroyed) response.destroy()
    }
    const timer = setTimeout(abort, Math.max(1, authorization.expiresAt - Date.now()))
    timer.unref()
    this.activeRequests.set(id, Object.freeze({ ...authorization, abort, timer }))
```

</details>

**依据 3 · 作者声明**：[README.md:65-67](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/README.md#L65-L67)

作者明确可信设备及安全通道。

```text
- **纵深安全**：局域网固定私有 CA，公开远程入口使用受信任 HTTPS；自签 FRP 入口由 0.4.6 App 固定远程 CA。凭据存 Keystore，设备令牌只发往精确 Origin，第三方 WS 默认拦截。

配对设备可以操作电脑上的 DSH，应视为完全受信任的设备。局域网只在可信网络开启；远程访问应使用可靠的 HTTPS 通道。手机丢失时，请立即从电脑端撤销设备。
```

#### 缺口

- 未运行 DSH、移动端或真实网络任务
  **影响**：无法确认配对、撤销及时性及业务副作用
  **进一步探讨**：固定宿主与手机，在可信环境核验会话、断线和撤销

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、远程连接和退出有哪些成本与操作？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要在线电脑、兼容 DSH、手机及可信网络；异地另需配置可信 HTTPS 和隧道或 VPN，设备必须由用户信任。首次配置证书、网络和配对需人工；持续运行与网络资源、故障对账和撤销检查也有成本，数值未测。可先用可信局域网和无重要副作用的任务验证配对、同会话及撤销；不接受设备拥有电脑操作权、认证异常或无法查明断线结果时撤销设备并回电脑操作。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:55-67](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/README.md#L55-L67)

作者说明多通道、配对与信任。

<details>
<summary>查看原文（13行）</summary>

```text
## 能做什么

- **在手机上继续电脑端的工作**：同一份会话、工作区、消息和工具，实时同步。
- **用对话定制手机端**：在 DSH 对话里提出布局、交互或功能需求；文件修改完成后，自定义资源通常会自动更新。
- **专属触屏布局**：会话抽屉、工具详情、设置、提问卡片和输入栏都按手机重新组织；侧栏列表在本页内记住位置，切换会话再打开不会总跳回顶部。App 跟随系统语言（简/英/意），插件界面跟随 DSH 语言。
- **多种远程通道**：Tailscale、cpolar、cloudflared 快速/命名隧道、自建 FRP、自有反向代理，以及无需域名和公网端口的实验性 iroh；Windows/Linux x64 还可由插件托管 Caddy HTTPS 与证书。
- **配对与多设备**：扫码、链接或密钥配对一次；切换 Wi-Fi、热点或 IP 后通常自动恢复；App 在一个列表中显示局域网和远程配对的电脑，定期检测可达状态，并支持切换、重新配对或删除本地记录。
- **一键诊断与放行**：检查版本、网关、网卡、防火墙和远程通道，生成脱敏报告；被拦截的第三方插件连接按确切路径一键放行。
- **iPhone / iPad 网页推送**：将页面添加到主屏幕后，在 DSH“通用设置”中主动开启；支持六类提醒和分类开关，页面关闭或锁屏后也可接收，锁屏文字不含会话正文。[使用条件与设置](docs/WEB_PUSH.md)。
- **Android 任务通知**：在 App 内 DSH“通用设置”中开启任务完成与待输入提醒，使用独立的原生通知通道，锁屏文本脱敏。
- **纵深安全**：局域网固定私有 CA，公开远程入口使用受信任 HTTPS；自签 FRP 入口由 0.4.6 App 固定远程 CA。凭据存 Keystore，设备令牌只发往精确 Origin，第三方 WS 默认拦截。

配对设备可以操作电脑上的 DSH，应视为完全受信任的设备。局域网只在可信网络开启；远程访问应使用可靠的 HTTPS 通道。手机丢失时，请立即从电脑端撤销设备。
```

</details>

**依据 2 · 作者声明**：[README.md:69-85](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/README.md#L69-L85)

Desktop/Web 安装入口。

<details>
<summary>查看原文（17行）</summary>

````text
## 快速开始

先在电脑安装插件，再用 Android App 或手机浏览器配对。按你使用的 DSH 选择安装方式。

### 官方 DSH Desktop

在应用的 **插件** 页面安装并启用 `dsh-mobile`，再打开 **移动访问** 配置局域网或远程通道。Desktop 的 profile 由应用管理，不适用下面的 `--profile web` 命令。

安装或更新后，请从应用菜单正常退出并重新打开 Desktop，无需清除会话或配对数据。若仍提示 `dsh-mobile-question-fixes: failed to import`，请检查安装日志；这也可能是组件解析问题，单纯重启不一定能解决。

### DSH Web

已经安装 `dsh` 命令时，在终端执行：

```powershell
dsh plugin --profile web add dsh-mobile@latest
dsh plugin --profile web exec dsh-mobile setup
````

</details>

**依据 3 · 源码核查**：[src/access.ts:445-460](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/src/access.ts#L445-L460)

撤销设备的实现。

<details>
<summary>查看原文（16行）</summary>

```text
  /** End one short Session and notify the gateway to abort its attached work. */
  logout(authorization: SessionAuthorization): void {
    this.removeSession(authorization.sessionKey, 'logout')
  }

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
```

</details>

#### 缺口

- 未运行 DSH、移动端或真实网络任务
  **影响**：无法确认配对、撤销及时性及业务副作用
  **进一步探讨**：固定宿主与手机，在可信环境核验会话、断线和撤销

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验断线状态提示能否降低误重试？

**研究主题**：新假设与验证、工程质量与复用、贡献与相对优势

#### 完整回答

未验证假设：在手机显示请求已发送、上游结果未知、宿主已确认等有证据的阶段，并提供回电脑查证入口，可减少断线后重复执行。现有请求中止与设备撤销已覆盖通道清理，是反证；未获得上游业务回执时新增界面也不能证明操作未发生。以相同受控任务对照现有界面，在断线前、请求已接受后和响应丢失三点测重复操作、误报、对账时间及隐私；若没有改善或状态不能可信关联则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/gateway.ts:3592-3608](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/src/gateway.ts#L3592-L3608)

已有在途请求中止。

<details>
<summary>查看原文（17行）</summary>

```text
  private allocateRequest(
    authorization: SessionAuthorization,
    response: ServerResponse,
    upstream: { request?: ClientRequest },
  ): { id: number; signal: AbortSignal; abort: () => void; release: () => void } {
    if (this.closing || response.destroyed || response.writableEnded) throw requestAbortedError()
    if (this.activeRequests.size >= this.config.maxActiveRequests) throw new HttpError(429, 'busy')
    const id = this.nextOperationId++
    const controller = new AbortController()
    const abort = (): void => {
      controller.abort()
      upstream.request?.destroy()
      if (!response.destroyed) response.destroy()
    }
    const timer = setTimeout(abort, Math.max(1, authorization.expiresAt - Date.now()))
    timer.unref()
    this.activeRequests.set(id, Object.freeze({ ...authorization, abort, timer }))
```

</details>

**依据 2 · 源码核查**：[src/access.ts:445-460](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/src/access.ts#L445-L460)

已有设备撤销与会话终止。

<details>
<summary>查看原文（16行）</summary>

```text
  /** End one short Session and notify the gateway to abort its attached work. */
  logout(authorization: SessionAuthorization): void {
    this.removeSession(authorization.sessionKey, 'logout')
  }

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
```

</details>

**依据 3 · 作者声明**：[README.md:55-67](https://github.com/saya-ch/dsh-mobile/blob/3cd86a2c51342e8ebcebf18f5e30ff45b4553ddc/README.md#L55-L67)

移动端和设备信任边界。

<details>
<summary>查看原文（13行）</summary>

```text
## 能做什么

- **在手机上继续电脑端的工作**：同一份会话、工作区、消息和工具，实时同步。
- **用对话定制手机端**：在 DSH 对话里提出布局、交互或功能需求；文件修改完成后，自定义资源通常会自动更新。
- **专属触屏布局**：会话抽屉、工具详情、设置、提问卡片和输入栏都按手机重新组织；侧栏列表在本页内记住位置，切换会话再打开不会总跳回顶部。App 跟随系统语言（简/英/意），插件界面跟随 DSH 语言。
- **多种远程通道**：Tailscale、cpolar、cloudflared 快速/命名隧道、自建 FRP、自有反向代理，以及无需域名和公网端口的实验性 iroh；Windows/Linux x64 还可由插件托管 Caddy HTTPS 与证书。
- **配对与多设备**：扫码、链接或密钥配对一次；切换 Wi-Fi、热点或 IP 后通常自动恢复；App 在一个列表中显示局域网和远程配对的电脑，定期检测可达状态，并支持切换、重新配对或删除本地记录。
- **一键诊断与放行**：检查版本、网关、网卡、防火墙和远程通道，生成脱敏报告；被拦截的第三方插件连接按确切路径一键放行。
- **iPhone / iPad 网页推送**：将页面添加到主屏幕后，在 DSH“通用设置”中主动开启；支持六类提醒和分类开关，页面关闭或锁屏后也可接收，锁屏文字不含会话正文。[使用条件与设置](docs/WEB_PUSH.md)。
- **Android 任务通知**：在 App 内 DSH“通用设置”中开启任务完成与待输入提醒，使用独立的原生通知通道，锁屏文本脱敏。
- **纵深安全**：局域网固定私有 CA，公开远程入口使用受信任 HTTPS；自签 FRP 入口由 0.4.6 App 固定远程 CA。凭据存 Keystore，设备令牌只发往精确 Origin，第三方 WS 默认拦截。

配对设备可以操作电脑上的 DSH，应视为完全受信任的设备。局域网只在可信网络开启；远程访问应使用可靠的 HTTPS 通道。手机丢失时，请立即从电脑端撤销设备。
```

</details>

#### 缺口

- 未运行 DSH、移动端或真实网络任务
  **影响**：无法确认配对、撤销及时性及业务副作用
  **进一步探讨**：固定宿主与手机，在可信环境核验会话、断线和撤销

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
