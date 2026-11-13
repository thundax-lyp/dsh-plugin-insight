# DSH Remote Web UI

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[971cc3e](https://github.com/zhu1090093659/dsh-web/tree/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui)

<!-- BEGIN META -->
[![GitHub ★ 10,353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 107,539](https://img.shields.io/static/v1?label=npm+30d&message=107%2C539&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui)
<!-- END META -->

> **功能**：通过设备配对在手机或其他电脑浏览器访问同一个 DSH Web 界面。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，固定独立组件将设备凭据管理接入 DSH 侧栏与官方界面访问，复用原有宿主页面。

> **主要限制**：[Q02](#research-q02) 与 [Q03](#research-q03) 指出，发码 token 在有效期内可反复兑换，而撤销一个设备只删除该设备。普通 API 配对设置和独立转发也有不同规则。

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
  - [Q01 · 相对直接访问 DSH Web，多设备配对带来什么？](#detail-section-11)
  - [Q02 · 配对凭据如何发放、消费和校验？](#detail-section-12)
  - [Q03 · 本地管理、远程接入和撤销的边界是什么？](#detail-section-13)
  - [Q04 · 如何用一台非关键设备比较是否值得采用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有独立旧版 Remote Web UI 的操作者，可以为另一台设备提供同一个 DSH Web 界面的临时访问。

直接访问已控制的 DSH Web 地址可以复用宿主界面；此插件增加发码、设备列表及撤销操作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 侧栏配对 | 为另一设备生成链接 | 本地控制入口 |
| 设备会话 | 登记与撤销访问 | 发码令牌有效期内能重复兑换 |
| 远程通道 | 复用官方 Web 界面 | 独立转发按设备会话检查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 固定独立插件及宿主服务 | 必需 | 挂载配对与转发 | 退役聚合行不会提供功能 |
| 可达 LAN 或公网 base | 发码必需 | 产生可达链接 | 服务拒绝发码 |
| 兼容的代理与连接 gate | 远程路径所需 | 传播请求身份与控制访问 | 不能推断所有路由均受保护 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 操作者检查旧部署和测试 LAN | 无公共地址暴露 |
| 核查 | 对非关键设备发码并访问 | 读到正确测试会话 |
| 回收 | 撤销并停止后尝试新连接 | 仍可访问则关闭入口并查宿主绑定 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 网络与环境费用未知 | 准备隔离网络并核对旧版本 | 耗时未知 |
| 持续 | 流量及公网接入费用未知 | 核对设备与 token | 退役会影响维护 |
| 恢复 | 重配费用未知 | 撤销并关闭入口 | 需复核开放连接 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 临时接入 | 发码及设备会话 | 真实浏览器兼容 |
| 回收 | 清除设备与 token | 现存连接的撤销传播 |
| 维护 | 复用宿主页面 | 退役后的持续使用 |

> **思考**：[Q02](#research-q02) 与 [Q03](#research-q03) 指出，发码 token 在有效期内可反复兑换，而撤销一个设备只删除该设备。普通 API 配对设置和独立转发也有不同规则。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，固定独立组件将设备凭据管理接入 DSH 侧栏与官方界面访问，复用原有宿主页面。

发码、设备和落地 grant 分开，普通 API 与带宿主凭据的转发也分别决策。配置停止与单设备撤销有不同作用。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 与 [Q03](#research-q03) 指出，发码 token 在有效期内可反复兑换，而撤销一个设备只删除该设备。普通 API 配对设置和独立转发也有不同规则。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议只对既有旧部署做隔离回收验证，保留可控的宿主访问方法，完成后检查新连接是否被拒绝。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定独立源码仍有真实宿主接线，作者已宣布退役。权限、终端撤销与部署效果尚未实测。

- 已检查：作者 README、包清单、源码路径 packages/dsh-remote-web-ui/package.json、packages/dsh-remote-web-ui/cordis.patch.yml、packages/dsh-remote-web-ui/tsdown.config.ts、packages/dsh-remote-web-ui/src/index.ts、packages/dsh-remote-web-ui/src/client/index.ts、packages/dsh-remote-web-ui/src/routes.ts、packages/dsh-remote-web-ui/src/pairing.ts、packages/dsh-remote-web-ui/src/gate.ts 及固定范围 inventory；组件：packages/dsh-remote-web-ui。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定独立子包 0.4.16，检查配对、撤销、禁用与关键 gate。未运行公网中继、隧道或替代包。
- 下一步：在隔离 LAN 用两个浏览器核对重复兑换、单设备撤销、停用后新请求及现存连接，记录宿主与代理配置。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.16（[固定提交 971cc3e](https://github.com/zhu1090093659/dsh-web/tree/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 的待验证假设是，受控设备列表能降低临时授权的回收工作。若停止后仍可新建连接或核查成本抵消便利，则放弃假设。

在隔离 LAN 用两个浏览器核对重复兑换、单设备撤销、停用后新请求及现存连接，记录宿主与代理配置。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 494 | — | — | 20851 |
| .ts | source | 51 | 15546 | 8954 | 5736 | — |
| .tsx | source | 10 | 2567 | 1927 | 534 | — |
| .ts | test | 53 | 13247 | 10005 | 2710 | — |
| .tsx | test | 3 | 895 | 696 | 149 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/zhu1090093659/dsh-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：同一 DSH Web 会话从手机继续时，配对和撤销能覆盖哪些连接，哪些入口需要使用方控制？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对直接访问 DSH Web，多设备配对带来什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已维护旧版独立部署的操作者可以把同一 DSH Web 界面交给第二台浏览器，设备可从本地面板识别和撤销。相对自己开放宿主地址再处理登录，增加了从侧栏发放链接与维护设备会话的工作流。README 首段已弃用本组件，聚合的旧入口是退役壳；固定独立源码仍包含服务接线，不能从源码推断 npm 部署现状或未来维护。用旧部署验证迁移时，合格任务是同一测试会话能续接且撤销后不能继续调用。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-remote-web-ui/README.md:5-9](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/README.md#L5-L9)

作者区分独立包过渡、聚合退役和共用 relay 风险。

```text
> **Deprecation notice**: `@linxin666/dsh-remote-web-ui` is deprecated in favor of [@linxin666/dsh-remote-bridge](../dsh-remote-bridge/README.md). It has been retired from the `@linxin666/dsh-web-all` aggregate bundle (where legacy profile rows mount silently as no-ops via tombstone exports and the `retiredPlugins` registry) and will be removed in the next release. Standalone installation (`dsh plugin --profile <name> add @linxin666/dsh-remote-web-ui`) remains functional during this transitional period. Browser-based remote control has been replaced by the native phone app (@linxin666/dsh-remote-bridge), and this package no longer provides remote access capabilities.
>
> - **Capabilities migrated to `@linxin666/dsh-remote-bridge`**: Ingress stack (relay registry identity, lease control claim/release, quick and named tunnel connectors, Durable Object relay bridge connector, cloudflared lifecycle management and orphan process reaping, Cloudflare named tunnel ingress sync, LAN forwarder, host bind capability probe, and host firewall management).
> - **Capabilities retired with this package**: Browser-facing remote web control (pairing cookie gate, `/api/pair` endpoints, `/remote` proxy channel, and the mobile browser touch adaptation layer).
> - **Known coexistence risk**: if installed in the same profile alongside `@linxin666/dsh-remote-bridge`, do not enable relay on both plugins simultaneously (both share the same on-disk relay identity per profile; running both causes Durable Object connection contention, and mounting the bridge with `relay=false` withdraws the shared registration row and releases the lease).
```

**依据 2 · 作者声明**：[packages/dsh-remote-web-ui/README.md:79-85](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/README.md#L79-L85)

作者给出原 Web 界面从第二设备访问的流程。

```text
## Use

1. Open the settings card (设置 → Web 插件 → 远程访问) and flip **局域网访问** on; the card shows the live bind, the forwarder state beside the host's own `localBindHost`, the firewall state, and the reachable LAN URLs, and it says why the LAN entry is off when this machine has no LAN address. The forwarder starts and stops at once, with no restart: after a network change, flip the toggle off and on again so it follows the machine's new address.
2. Start `dsh web`, click the phone icon, and the panel mints a fresh time-limited QR.
3. Scan with the phone (or open the copied link): the device pairs and boots the **official Web GUI** served cookieless by the plugin (`/pair-accept` → `/pair-app`), which reloads into `/`. When the link names the public base, the landing page also probes the advertised LAN origins (one short no-cors request to `/pair-ping` per candidate) and moves the phone to the first one that answers, remembering the decision for the session: the public page it was served from stays usable throughout, so the probe never blocks pairing, and a phone that is not on that network simply stays where it is. On a phone, the portrait adaptation layer is already active — same layout as the desktop, same live state. Later reopens from history or a bookmark go straight back into the app (https origins; see Security model).
4. **To pair a PC instead**: copy the same link and open it in a browser on the other computer. After the same round trip the full Web GUI runs there over the gated `/remote` channel; unpaired PCs see the guided blocking page and no data. One active token pairs one device; mint a fresh QR for the next device.
5. The desktop badge flips to 已连接 in real time; the device roster lists the paired devices with per-device 取消配对, and 停止 revokes everything.
```

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/client/index.ts:281-294](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/client/index.ts#L281-L294)

侧栏实际注册远程配对入口。

<details>
<summary>查看原文（14行）</summary>

```text
  // Sidebar foot entry: the sidebar foot seat is `sidebar.footer.action` in
  // the 0.1.2 shell composition (the legacy `sidebar.remote` seat is gone
  // upstream). The pairing link is origin-agnostic, so the entry needs no
  // workspace source.
  ctx.slots.inject('sidebar.footer.action', () => {
    let disposeEntry: (() => void) | undefined
    const syncEntry = (): void => {
      if (enabled() && disposeEntry === undefined) {
        try {
          disposeEntry = ctx.slots.register({ name: 'sidebar.footer.action', id: 'remote-web-ui', locale: NS }, FooterRemoteEntry)
        } catch {
          // ignore registration collision
        }
      } else if (!enabled() && disposeEntry !== undefined) {
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1403-1413](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/index.ts#L1403-L1413)

独立 host 启用时仍注册实际路由。

<details>
<summary>查看原文（11行）</summary>

```text
    if (disposeRoutes === undefined && enabled) {
      disposeRoutes = ctx.effect(
        () => {
          const disposers = [
            ...routes.map(route => ctx.webServer.register(route)),
            ...upgrades.map(route => ctx.webServer.registerUpgrade(route)),
          ]
          return () => { for (const dispose of disposers) dispose() }
        },
        'remote-web-ui: pairing routes',
      )
```

</details>

#### 缺口

- 未运行固定独立包
  **影响**：无法确认过渡期间的实际兼容性
  **进一步探讨**：用已部署版本的隔离副本验证复现与迁移

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配对凭据如何发放、消费和校验？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

发码路由要求本地可信请求，服务要求存在可达 LAN 或公网地址，发新码时清空原 token。固定 PairingService 允许同一未到期 token 再次兑换并生成新设备 ID；这与作者用法写的一码一设备有出入。短时一次性的是后续落地 grant，落地页在消费后仍核对设备是否有效，也能用仍有效的 cookie 重开。设备达到上限时逐出最早记录；撤销单个设备仅删除该 ID，若 QR token 仍有效则仍可换得另一个设备。操作上应把发码链接作为可在有效期内重复使用的凭据处理。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:841-859](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/routes.ts#L841-L859)

发码路由走 loopback fence。

<details>
<summary>查看原文（19行）</summary>

```text
  const handleIssue = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!requireMethod(req, res, 'POST')) return
    if (!loopbackFence(req)) {
      writeJson(res, 403, { ok: false, code: 'forbidden' })
      return
    }
    const body = await readJsonBody(req, { maxBytes: MAX_BODY_BYTES, objectOnly: true })
    const payload = parsePairPayload(issuePayloadSchema, body)
    if (payload === undefined) {
      writeJson(res, 400, { ok: false, code: 'bad-payload' })
      return
    }
    const { address } = payload
    try {
      // The QR link is the official Web GUI itself: after the accept round
      // trip every device — phone or PC — boots the desktop SPA (phones get
      // the injected portrait adaptation, PCs the full desktop UI), so the
      // remote surface can never drift from the official one.
      const { token, expiresAt } = service.issue(undefined, address)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:457-482](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/pairing.ts#L457-L482)

可达地址判断及新码替换。

<details>
<summary>查看原文（26行）</summary>

```text
  issue(workspaceId?: string, address?: string): { token: string; expiresAt: number } {
    // The rule lives in the bases the caller registered, not in this message:
    // a non-loopback bind (the wildcard where the host still accepts it, a
    // concrete interface literal where it does not — see lanBasesOf in
    // index.ts) or a public base is what makes a QR reachable. The message
    // keeps the wildcard wording only as the operator's most familiar form.
    if (this.lanBases.size === 0 && this.publicBase === undefined) {
      throw new Error('remote-web-ui: pairing requires a reachable bind (--host 0.0.0.0 or publicBaseUrl)')
    }
    if (address !== undefined && !this.lanBases.has(address)) {
      throw new UnknownLanAddressError(address)
    }
    const now = this.clock.now()
    const token = this.clock.randomToken()
    this.tokens.clear()
    this.stopped = false
    this.tokenSerial += 1
    this.tokens.set(token, {
      id: `t${this.tokenSerial}`,
      issuedAt: now,
      expiresAt: now + this.config.tokenTtlMs,
      ...(workspaceId !== undefined ? { workspaceId } : {}),
      ...(address !== undefined ? { address } : {}),
    })
    this.notify()
    return { token, expiresAt: now + this.config.tokenTtlMs }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:485-523](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/pairing.ts#L485-L523)

固定代码允许重复兑换，维护设备上限。

<details>
<summary>查看原文（39行）</summary>

```text
  /**
   * Redeem a token and bind a device session. The token is a bearer
   * credential for its whole window, not a single-use nonce: it is refused
   * only when unknown, past its expiry, or after stop(), and every successful
   * call — including a repeat within the same window — mints a fresh device
   * session (see the module doc for the mobile cookie-context rationale).
   * @param token - the token secret from the QR link.
   * @param userAgent - optional User-Agent header captured at accept.
   * @returns the new device id, or a refusal code.
   */
  accept(token: string, userAgent?: string): AcceptResult {
    const record = this.tokens.get(token)
    if (record === undefined || this.stopped || this.clock.now() > record.expiresAt) {
      return { ok: false, code: 'invalid' }
    }
    const deviceId = this.clock.randomToken()
    const now = this.clock.now()
    // FIFO-evict until a slot is free. The loop (not a single delete) covers a
    // table that is already over the cap: restore keeps every persisted session
    // (see loadPersisted), so the excess is collected here, once the store is
    // actually asked to admit a new device, rather than at startup on a cap the
    // configuration may not have delivered yet.
    while (this.devices.size >= this.config.maxDevices) {
      let oldest: { id: string; createdAt: number } | undefined
      for (const [id, session] of this.devices) {
        if (oldest === undefined || session.createdAt < oldest.createdAt) oldest = { id, createdAt: session.createdAt }
      }
      if (oldest === undefined) break
      this.devices.delete(oldest.id)
    }
    const label = sanitizeUserAgent(userAgent)
    this.devices.set(deviceId, {
      createdAt: now,
      lastSeenAt: now,
      ...(label !== undefined ? { userAgent: label } : {}),
    })
    this.persist()
    this.notify()
    return { ok: true, deviceId }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:1188-1202](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/routes.ts#L1188-L1202)

落地 grant 单次消费，cookie 可续用。

<details>
<summary>查看原文（15行）</summary>

```text
    // The one-time grant is spent before anything else: a replayed or expired
    // grant resolves to nothing (pair-grant.ts), so a leaked landing URL can
    // never be re-run. The cookie stays the primary credential for a reopen
    // (the service worker's network-first navigation carries it).
    const grantedDevice = grants.consume(url.searchParams.get('grant') ?? undefined)
    const cookieDevice = readCookie(req.headers.cookie, service.config.cookieName)
    const id = (grantedDevice !== undefined && service.touchDevice(grantedDevice))
      ? grantedDevice
      : (cookieDevice !== undefined && service.touchDevice(cookieDevice))
        ? cookieDevice
        : undefined
    if (id === undefined) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' })
      res.end(pairingFailurePage())
      return
```

</details>

**依据 5 · 作者声明**：[packages/dsh-remote-web-ui/README.md:82-85](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/README.md#L82-L85)

用法写一码一设备，需以固定源码核对。

```text
2. Start `dsh web`, click the phone icon, and the panel mints a fresh time-limited QR.
3. Scan with the phone (or open the copied link): the device pairs and boots the **official Web GUI** served cookieless by the plugin (`/pair-accept` → `/pair-app`), which reloads into `/`. When the link names the public base, the landing page also probes the advertised LAN origins (one short no-cors request to `/pair-ping` per candidate) and moves the phone to the first one that answers, remembering the decision for the session: the public page it was served from stays usable throughout, so the probe never blocks pairing, and a phone that is not on that network simply stays where it is. On a phone, the portrait adaptation layer is already active — same layout as the desktop, same live state. Later reopens from history or a bookmark go straight back into the app (https origins; see Security model).
4. **To pair a PC instead**: copy the same link and open it in a browser on the other computer. After the same round trip the full Web GUI runs there over the gated `/remote` channel; unpaired PCs see the guided blocking page and no data. One active token pairs one device; mint a fresh QR for the next device.
5. The desktop badge flips to 已连接 in real time; the device roster lists the paired devices with per-device 取消配对, and 停止 revokes everything.
```

#### 缺口

- 未测扫码和浏览器预览的实际兑换次数
  **影响**：无法确认不同浏览器的设备列表行为
  **进一步探讨**：在受控 LAN 由两个干净浏览器测试同一码及同一个 grant 的重用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地管理、远程接入和撤销的边界是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

直接 loopback 请求必须没有代理标记才进入本地信任分支。普通 API 的配对 gate 默认要求设备会话，配置允许关闭此要求，此时其余宿主 gate 仍决定访问。它仅处理接入此事件的路由，不能代表独立插件前缀都受保护。独立 /remote 通道会带宿主进程侧凭据转发到内层，因此始终要求有效设备凭据，关闭普通 LAN 配对要求不改变该分支。停止清掉全部设备和发码；禁用插件配置还停止隧道、处理 relay 连接及撤下配对路由。当前核实到新请求检查，未确认已打开的所有连接何时断开。过渡版与替代包共用 relay 身份的风险来自作者声明，切换时应避免同时运行这两条公共接入链。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/gate.ts:96-131](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/gate.ts#L96-L131)

区分本地、普通 API 配置和其他前缀。

<details>
<summary>查看原文（36行）</summary>

```text
export function isLoopbackClient(request: IncomingMessage): boolean {
  if (isProxiedRequest(request)) return false
  return isLoopbackUpstream(request)
}

/**
 * Build the api/gate listener for one pairing service.
 * @param service - the pairing service.
 * @param requirePairingForLan - when false, non-loopback requests pass
 * without a device cookie (the feature then only manages tokens/status;
 * revocation of paired devices still holds). A function is re-read per
 * request, so a settings edit takes effect without a restart. Defaults to true.
 * @param enabled - when false, every non-loopback request is vetoed while
 * loopback stays available. A function is re-read per request so the fence
 * stays mounted for the plugin lifetime and disabling the plugin cannot open
 * a LAN-exposed /api. Defaults to true.
 * @returns the cordis waterfall listener: call `next()` to delegate,
 * return false (without calling it) to veto with 403.
 */
export function makeGateListener(
  service: PairingService,
  requirePairingForLan: boolean | (() => boolean) = true,
  enabled: boolean | (() => boolean) = true,
): (request: IncomingMessage, method: string | undefined, next: () => boolean | Promise<boolean>) => boolean | Promise<boolean> {
  return (request, _method, next) => {
    // Loopback clients (desktop at 127.0.0.1) always pass without cookie check.
    if (isLoopbackClient(request)) return next()
    const active = typeof enabled === 'function' ? enabled() : enabled
    if (!active) return false
    const require = typeof requirePairingForLan === 'function' ? requirePairingForLan() : requirePairingForLan
    // When pairing is not required for LAN, non-loopback requests pass too.
    if (!require) return next()
    // Non-loopback origin: verify paired-device cookie. Sibling plugins that
    // own their own prefixes (/pet, /git, /sidebar, …) consult the same cookie
    // through the remoteWebUiPairing service — this listener only covers /api.
    return isPairedDeviceRequest(service, request) ? next() : false
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:978-996](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/index.ts#L978-L996)

独立远程通道带内层凭据并有单独设备 gate。

<details>
<summary>查看原文（19行）</summary>

```text
    // The remote desktop channel: a paired-credential-gated `/remote` prefix
    // that re-issues fenced paths to loopback (see remote-api.ts). The gate is
    // unconditional — requirePairingForLan governs the plain /api surface and
    // the desktop's client-side rewrite only; it is never an authorization
    // input here, because this channel attaches the process's own browser
    // credential to everything it forwards (issue #1665).
    ...makeRemoteApiRoutes({
      service,
      port: () => ctx.webServer.port,
      auth: innerAuth,
    }),
  ]
  const upgrades = makeRemoteApiUpgradeRoutes({
    service,
    port: () => ctx.webServer.port,
    auth: innerAuth,
  })
  const gate = makeGateListener(service, () => resolve().requirePairingForLan, () => resolve().enabled)
  ctx.effect(() => ctx.on('api/gate', gate), 'remote-web-ui: api gate')
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:941-972](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/routes.ts#L941-L972)

停止和撤销由本地 POST 触发。

<details>
<summary>查看原文（32行）</summary>

```text
    if (!requireMethod(req, res, 'POST')) return
    if (!loopbackFence(req)) {
      writeJson(res, 403, { ok: false, code: 'forbidden' })
      return
    }
    const body = await readJsonBody(req, { maxBytes: MAX_BODY_BYTES, objectOnly: true })
    if (parsePairPayload(pairActionPayloadSchema, body) === undefined) {
      writeJson(res, 400, { ok: false, code: 'bad-payload' })
      return
    }
    service.stop()
    writeJson(res, 200, { ok: true })
  }

  const handleRevoke = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!requireMethod(req, res, 'POST')) return
    if (!loopbackFence(req)) {
      writeJson(res, 403, { ok: false, code: 'forbidden' })
      return
    }
    const body = await readJsonBody(req, { maxBytes: MAX_BODY_BYTES, objectOnly: true })
    const payload = parsePairPayload(revokePayloadSchema, body)
    if (payload === undefined) {
      writeJson(res, 400, { ok: false, code: 'bad-payload' })
      return
    }
    const revoked = service.revoke(payload.deviceId)
    if (!revoked) {
      writeJson(res, 404, { ok: false, code: 'unknown-device' })
      return
    }
    writeJson(res, 200, { ok: true })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:526-550](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/pairing.ts#L526-L550)

清除全部 token 或单设备并持久化。

<details>
<summary>查看原文（25行）</summary>

```text
  /**
   * Stop remote control: revoke every device session and clear the token.
   * The phone's next gated /api request 403s; the panel falls back to
   * stopped until a fresh QR is issued.
   */
  stop(): void {
    this.tokens.clear()
    this.devices.clear()
    this.persistRevocation()
    this.stopped = true
    this.notify()
  }

  /**
   * Revoke one paired device. The next gated request from that cookie is
   * refused; other sessions stay live. Unknown ids are a no-op.
   * @param deviceId - the cookie value of the device to drop.
   * @returns true when a live session was removed.
   */
  revoke(deviceId: string): boolean {
    if (this.stopped) return false
    if (!this.devices.delete(deviceId)) return false
    this.persistRevocation()
    this.notify()
    return true
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1391-1415](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/index.ts#L1391-L1415)

禁用配置停止 ingress 相关进程并撤下路由。

<details>
<summary>查看原文（25行）</summary>

```text
    const enabled = value.enabled
    if (!enabled) {
      service.stop()
      // The tunnel branch above follows the plan, not the master switch, so an
      // explicit "off" must also drop the public ingress it started: otherwise
      // the cloudflared child keeps a live public URL (and the relay keeps its
      // stable row) while the panel says remote control is stopped. The relay
      // row is deliberately kept so re-enabling reuses the same origin.
      tunnel.stop()
      disposeRelayHalf()
      publicBase.reset()
    }
    if (disposeRoutes === undefined && enabled) {
      disposeRoutes = ctx.effect(
        () => {
          const disposers = [
            ...routes.map(route => ctx.webServer.register(route)),
            ...upgrades.map(route => ctx.webServer.registerUpgrade(route)),
          ]
          return () => { for (const dispose of disposers) dispose() }
        },
        'remote-web-ui: pairing routes',
      )
    } else if (disposeRoutes !== undefined && !enabled) {
      disposeRoutes()
```

</details>

#### 缺口

- 未测存活 WebSocket、代理设置和远端 relay 下的撤销传播
  **影响**：不能承诺撤销瞬间断开全部连接
  **进一步探讨**：在隔离网络对新 HTTP、现存连接和重连分别检查停止结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何用一台非关键设备比较是否值得采用？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

仅建议已有独立旧部署的操作者观察和验证迁移。在受控 LAN 与测试 profile 记录原有可达地址、当前服务绑定和设备列表，使用非关键设备查看只读测试会话。对照原生宿主的直接访问及退出步骤，记录获取链接、会话接续、撤销与确认剩余入口的用时。验证假设是设备列表和撤销能降低临时授权后检查的人工负担；若重扫可绕过预期的一次授权、退出成本更高或尚需公网依赖，该假设不成立。若撤销后还能访问，停止该入口并检查宿主绑定，从原生局域网管理回到已知可控路径。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-remote-web-ui/README.md:5-9](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/README.md#L5-L9)

作者声明退役与迁移方向。

```text
> **Deprecation notice**: `@linxin666/dsh-remote-web-ui` is deprecated in favor of [@linxin666/dsh-remote-bridge](../dsh-remote-bridge/README.md). It has been retired from the `@linxin666/dsh-web-all` aggregate bundle (where legacy profile rows mount silently as no-ops via tombstone exports and the `retiredPlugins` registry) and will be removed in the next release. Standalone installation (`dsh plugin --profile <name> add @linxin666/dsh-remote-web-ui`) remains functional during this transitional period. Browser-based remote control has been replaced by the native phone app (@linxin666/dsh-remote-bridge), and this package no longer provides remote access capabilities.
>
> - **Capabilities migrated to `@linxin666/dsh-remote-bridge`**: Ingress stack (relay registry identity, lease control claim/release, quick and named tunnel connectors, Durable Object relay bridge connector, cloudflared lifecycle management and orphan process reaping, Cloudflare named tunnel ingress sync, LAN forwarder, host bind capability probe, and host firewall management).
> - **Capabilities retired with this package**: Browser-facing remote web control (pairing cookie gate, `/api/pair` endpoints, `/remote` proxy channel, and the mobile browser touch adaptation layer).
> - **Known coexistence risk**: if installed in the same profile alongside `@linxin666/dsh-remote-bridge`, do not enable relay on both plugins simultaneously (both share the same on-disk relay identity per profile; running both causes Durable Object connection contention, and mounting the bridge with `relay=false` withdraws the shared registration row and releases the lease).
```

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:526-550](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/pairing.ts#L526-L550)

分开检查单设备撤销与全部停止。

<details>
<summary>查看原文（25行）</summary>

```text
  /**
   * Stop remote control: revoke every device session and clear the token.
   * The phone's next gated /api request 403s; the panel falls back to
   * stopped until a fresh QR is issued.
   */
  stop(): void {
    this.tokens.clear()
    this.devices.clear()
    this.persistRevocation()
    this.stopped = true
    this.notify()
  }

  /**
   * Revoke one paired device. The next gated request from that cookie is
   * refused; other sessions stay live. Unknown ids are a no-op.
   * @param deviceId - the cookie value of the device to drop.
   * @returns true when a live session was removed.
   */
  revoke(deviceId: string): boolean {
    if (this.stopped) return false
    if (!this.devices.delete(deviceId)) return false
    this.persistRevocation()
    this.notify()
    return true
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1391-1415](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-remote-web-ui/src/index.ts#L1391-L1415)

停用时的路由及隧道清理范围。

<details>
<summary>查看原文（25行）</summary>

```text
    const enabled = value.enabled
    if (!enabled) {
      service.stop()
      // The tunnel branch above follows the plan, not the master switch, so an
      // explicit "off" must also drop the public ingress it started: otherwise
      // the cloudflared child keeps a live public URL (and the relay keeps its
      // stable row) while the panel says remote control is stopped. The relay
      // row is deliberately kept so re-enabling reuses the same origin.
      tunnel.stop()
      disposeRelayHalf()
      publicBase.reset()
    }
    if (disposeRoutes === undefined && enabled) {
      disposeRoutes = ctx.effect(
        () => {
          const disposers = [
            ...routes.map(route => ctx.webServer.register(route)),
            ...upgrades.map(route => ctx.webServer.registerUpgrade(route)),
          ]
          return () => { for (const dispose of disposers) dispose() }
        },
        'remote-web-ui: pairing routes',
      )
    } else if (disposeRoutes !== undefined && !enabled) {
      disposeRoutes()
```

</details>

#### 缺口

- 未测迁移耗时与服务资源开销
  **影响**：不能断言维护旧入口有净收益
  **进一步探讨**：只读试验后比较两种路径并核对是否仍能建立连接

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
