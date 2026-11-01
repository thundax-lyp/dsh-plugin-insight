# DSH Remote Web UI

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui)

<!-- BEGIN META -->
[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 111,911](https://img.shields.io/static/v1?label=npm+30d&message=111%2C911&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui)
<!-- END META -->

> **功能**：通过设备配对为 DSH Web 界面提供手机和电脑远程访问，并支持网络入口管理。

> **亮点**：组件将设备配对、新请求 gate 和官方 Web 界面代理接成远程入口，提供设备撤销及局部 LAN 转发管理；这些机制不构成只读隔离或全通道退出证明。[Q02](#research-q02) [Q04](#research-q04)

> **主要限制**：撤销拒绝后续新请求，但已建立 WebSocket 使用 raw pipe；同仓 SSH 若启用，配对代理重塑环回可使其路由接受请求。设备撤销、既有宿主凭据和后台任务不能视为同一退出动作。[Q03](#research-q03)

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
  - [Q01 · 用户要远程完成什么，真实类型及简单替代是什么？](#detail-section-11)
  - [Q02 · 配对令牌、设备凭据和入口如何工作？](#detail-section-12)
  - [Q03 · 撤销是否终止所有连接与其他插件能力？](#detail-section-13)
  - [Q04 · LAN、隧道和 relay 需要什么，停止覆盖哪些资源？](#detail-section-14)
  - [Q05 · 何时值得试用，首次、持续和恢复成本如何衡量？](#detail-section-15)
  - [Q06 · 哪些机制可借鉴，有什么可证伪改进？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在自有受控手机或电脑上使用同一 DSH 界面的用户，可在隔离实例中验证设备配对；实际使用收益尚无对照。[Q01](#research-q01)

本机浏览器操作或自行配置受控远程网络是简单替代；插件将配对与设备状态整合，但增加网络和凭据生命周期。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 设备配对 | 为远程设备建立可撤销会话 | 窗口 token 可重复使用，landing grant 单次消费 |
| 远程代理 | 将已配对请求转发到宿主界面 | 配对为广泛控制；旧 WebSocket 撤销尚未验证 |
| LAN 转发管理 | 管理 LAN 可达入口 | stop 只覆盖其维护的监听和连接 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配 DSH、Node 和宿主服务 | 必需 | 加载配对和 Web 代理 | 版本或服务不符不可假定可用 |
| 可信设备与受控网络 | 远程使用需要 | 承载设备凭据和通信 | 身份或网络不可信时停止 |
| LAN 绑定或可达公网入口 | 远程连接需要 | 使设备可达宿主 | 无可达地址时拒绝生成可用配对 |
| Cloudflare 与 relay | 对应模式需要 | 隧道或稳定入口 | 外部服务失败及费用需另核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户隔离实例并明确关闭不用的公网模式 | 配置或身份不明时停止 |
| 配对 | 用户在自有设备接受二维码 | 确认设备并检查新请求是否受 gate 控制 |
| 使用 | 用户操作同一宿主界面 | 不将配对当只读权限 |
| 退出 | 用户撤销、检查旧连接及宿主凭据 | 无法确认时停宿主并断网 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主、网络及可选服务费用未知 | 配置和设备身份核对耗时未知 | 必须明确可达入口 |
| 持续使用 | 长连接、转发和第三方流量未知 | 维护设备与版本 | 不推算节时 |
| 失败恢复 | 重连和外部服务成本未知 | 逐通道、旧连接及凭据核对 | 单次 stop 不是全退出证明 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 配对远程入口 | token、设备和新请求 gate 接线存在 | 实际跨设备兼容与可用性 |
| 撤销 | 设备表删除并尝试持久化 | 已建立连接、其他凭据及后台任务是否结束 |

> **思考**：撤销拒绝后续新请求，但已建立 WebSocket 使用 raw pipe；同仓 SSH 若启用，配对代理重塑环回可使其路由接受请求。设备撤销、既有宿主凭据和后台任务不能视为同一退出动作。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：组件将设备配对、新请求 gate 和官方 Web 界面代理接成远程入口，提供设备撤销及局部 LAN 转发管理；这些机制不构成只读隔离或全通道退出证明。[Q02](#research-q02) [Q04](#research-q04)

新请求在代理前验证设备，landing grant 单次消费；撤销存储失败尝试删除旧表，LAN forwarder 管理自身 socket。旧 WebSocket、删除失败和宿主凭据是不同生命周期。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

撤销拒绝后续新请求，但已建立 WebSocket 使用 raw pipe；同仓 SSH 若启用，配对代理重塑环回可使其路由接受请求。设备撤销、既有宿主凭据和后台任务不能视为同一退出动作。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

只对自有设备和无敏感数据的隔离实例评估受控 LAN；加载前关闭不需要的 relay、自动隧道与 ingress，检查撤销后的旧连接；不能确认时停宿主并断网。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持配对、代理和条件组合的机制解释；跨设备、宿主、SSH 组合和网络安全未实测，未来设计为假设。

- 已检查：作者 README、包清单、源码路径 packages/dsh-remote-web-ui/package.json、packages/dsh-remote-web-ui/src/remote-methods.ts、packages/dsh-remote-web-ui/src/remote-api.ts、packages/dsh-remote-web-ui/src/pairing.ts、packages/dsh-remote-web-ui/src/pair-grant.ts、packages/dsh-remote-web-ui/src/routes.ts、packages/dsh-remote-web-ui/src/loopback-proxy.ts、packages/dsh-ssh/src/loopback.ts、packages/dsh-ssh/src/routes.ts、packages/dsh-remote-web-ui/src/index.ts、packages/dsh-remote-web-ui/src/lan-forward.ts、packages/dsh-remote-web-ui/src/client/index.ts 及固定范围 inventory；组件：packages/dsh-remote-web-ui。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本检查配对、设备存储、HTTP/WS 代理、LAN forwarder 和同仓 SSH 路由的条件组合；未完整审计全部 120 文件、宿主认证、云端 relay、TLS 或进程退出，未执行目标。
- 下一步：在隔离宿主用两台受控设备分别检查新 HTTP、WebSocket、撤销后的旧 socket 和有 SSH 组合；读取设备存储、端口、进程和宿主凭据状态。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.13（[固定提交 68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：将升级连接绑定设备并在撤销时关闭，同时逐通道回报停止结果，可能缩短旧会话仍可操作的窗口；应测撤销延迟、误断与恢复成本，若停宿主等简单替代更可靠且成本更低则否定。[Q06](#research-q06)

在隔离宿主用两台受控设备分别检查新 HTTP、WebSocket、撤销后的旧 socket 和有 SSH 组合；读取设备存储、端口、进程和宿主凭据状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 494 | — | — | 20823 |
| .ts | source | 51 | 15533 | 8953 | 5724 | — |
| .tsx | source | 10 | 2567 | 1927 | 534 | — |
| .ts | test | 53 | 13221 | 9991 | 2700 | — |
| .tsx | test | 3 | 895 | 696 | 149 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 170](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=170&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 173](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=173&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查远程 Web 插件设备配对、代理授权、撤销和远程通道边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户要远程完成什么，真实类型及简单替代是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它是 DSH Web 的 host/client bundle 插件，面向在自有手机或另一台电脑上使用同一宿主界面的用户。包声明扫码配对、设备会话及可选隧道；远程通道会在设备凭据通过后将调用转发到本机服务。对照只在本机浏览器操作或自行配置受控远程网络，它提供配对和设备状态的集成入口，但同时引入新的网络及凭据生命周期。源码把配对设备设计为具有广泛宿主控制权，不能描述为只读分享或独立多租户；实际移动端可用、收益和网络安全均未验证。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-remote-web-ui/package.json:1-10](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/package.json#L1-L10)

包自述远程 Web 场景和版本。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "@linxin666/dsh-remote-web-ui",
  "description": "Scan-to-pair remote access for the dsh web GUI that shares one official interface: a QR beside the settings button pairs phones and PCs into the same Web GUI (a portrait-touch adaptation layer for phones, full desktop on PCs) through one-time tokens and revocable device sessions, with a LAN bind toggle, optional Cloudflare tunnel, and one-click family self-update",
  "version": "0.4.13",
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/package.json:17-32](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/package.json#L17-L32)

host 和客户端导出。

<details>
<summary>查看原文（16行）</summary>

```text
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json"
  },
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-methods.ts:5-12](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/remote-methods.ts#L5-L12)

配对设备是完整控制凭据，部分路径单独限制。

```text
 * Access model on the 0.1.2-alpha.2 line: the host /api surface has no
 * per-method privilege pin — the "configuration plane is local" behavior
 * lives in the browser (client plugins branch on connection.isLoopback), and
 * the paired remote desktop flips into host mode via the transport hook
 * (ownsHost) while every call rides this gated channel as a loopback-shaped
 * request. A paired device is therefore a full-control credential by
 * design; the only paths that stay physically local are the control planes
 * below (pairing control, self-update, plugin install/remove, host power).
```

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:147-160](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/remote-api.ts#L147-L160)

代理请求先检查设备凭据。

<details>
<summary>查看原文（14行）</summary>

```text
export function makeRemoteApiRoutes(deps: RemoteApiDeps): WebRoute[] {
  const { service } = deps

  const handler = (req: IncomingMessage, res: ServerResponse): void => {
    // Paired credential first — before any bytes are buffered or forwarded.
    // Unconditional by design: this channel attaches the process's own
    // browser-auth cookie to every re-issued call, so admitting an unpaired
    // caller would hand out that credential's authority (issue #1665).
    const paired = pairedDeviceIdOf(req, service)
    if (paired === undefined) {
      req.resume()
      envelopeError(res, 403, 'invalid-request', 'unpaired', 'this device is not paired with the desktop')
      return
    }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/client/index.ts:281-300](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/client/index.ts#L281-L300)

客户端注册并随设置启停侧栏配对入口。

<details>
<summary>查看原文（20行）</summary>

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
        disposeEntry()
        disposeEntry = undefined
      }
    }
    const unsubscribe = settingsForm.subscribe(syncEntry)
    syncEntry()
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1399-1410](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/index.ts#L1399-L1410)

启用时实际注册配对和远程 HTTP/升级路由。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

#### 缺口

- 没有真实跨设备用户流程和比较结果
  **影响**：不能声称移动端可用或节省时间
  **进一步探讨**：在隔离实例和自有设备上比较本机操作与受控 LAN 配对的任务完成及退出。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配对令牌、设备凭据和入口如何工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

issue 替换当前二维码 token，accept 在有效窗口内每次生成新设备；因此二维码 token 可重复使用到过期或 stop，不应把它说成单次令牌。另一个用于重定向的 landing grant 被 consume 时先删除并检查过期，是单次使用。accept 路由做访问 fence、限速和请求校验，成功返回设备 ID 并设置 cookie。新远程 HTTP 请求读取 cookie 或头并通过 touchDevice 确认仍存活，才转发环回服务；内层代理可附宿主浏览器凭据。设备凭据与宿主浏览器凭据的生命周期不同，前者撤销不必然撤销后者。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:457-482](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/pairing.ts#L457-L482)

issue 替换 token 并限定可达地址。

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

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:485-523](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/pairing.ts#L485-L523)

窗口 token 可重复接受并创建设备。

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

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/pair-grant.ts:91-114](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/pair-grant.ts#L91-L114)

landing grant 单次消费与过期检查。

<details>
<summary>查看原文（24行）</summary>

```text
  return {
    issue(deviceId: string): PairGrantRecord {
      const issuedAt = now()
      purgeExpired(issuedAt)
      while (entries.size >= MAX_LIVE_GRANTS) {
        const oldest = entries.keys().next().value
        if (oldest === undefined) break
        entries.delete(oldest)
      }
      const grant = createGrant()
      const expiresAt = issuedAt + ttlMs
      entries.set(grant, { deviceId, expiresAt })
      return { grant, expiresAt }
    },
    consume(grant: string | undefined): string | undefined {
      if (grant === undefined || grant === '') return undefined
      const consumedAt = now()
      const entry = entries.get(grant)
      // Delete before validating: a replayed grant must never resolve, and an
      // expired one must not linger in the table.
      entries.delete(grant)
      purgeExpired(consumedAt)
      if (entry === undefined || entry.expiresAt <= consumedAt) return undefined
      return entry.deviceId
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:901-937](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/routes.ts#L901-L937)

配对路由的 fence、限速和设备 cookie。

<details>
<summary>查看原文（37行）</summary>

```text
  const handleAccept = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!requireMethod(req, res, 'POST')) return
    const privateLanHost = privateLanHostOf(req)
    if (!lanFence(req) && privateLanHost === undefined) {
      writeJson(res, 403, { ok: false, code: 'forbidden' })
      return
    }
    if (rateLimitAccept(req, 'api')) {
      writeJson(res, 429, { ok: false, code: 'rate-limited' })
      return
    }
    const body = await readJsonBody(req, { maxBytes: MAX_BODY_BYTES, objectOnly: true })
    const payload = parsePairPayload(acceptPayloadSchema, body)
    if (payload === undefined) {
      writeJson(res, 400, { ok: false, code: 'bad-payload' })
      return
    }
    const ua = req.headers['user-agent']
    const result = service.accept(payload.token, typeof ua === 'string' ? ua : undefined)
    if (!result.ok) {
      if (!lanFence(req)) {
        writeJson(res, 403, { ok: false, code: 'forbidden' })
        return
      }
      writeJson(res, 404, { ok: false, code: result.code })
      return
    }
    if (privateLanHost !== undefined) {
      addBounded(dynamicTrustedHosts, privateLanHost, MAX_DYNAMIC_TRUSTED_HOSTS)
    }
    // The Secure attribute follows the transport (deviceCookie): off on
    // plain-HTTP LAN, where a Secure cookie is dropped by the browser, and on
    // for a tunneled request the edge stamped as https. Lax keeps top-level
    // navigations working while blocking cross-site subrequests.
    writeJson(res, 200, { ok: true, deviceId: result.deviceId }, {
      'set-cookie': [deviceCookie(req, service.config.cookieName, result.deviceId)],
    })
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:132-160](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/remote-api.ts#L132-L160)

远程请求先验证设备会话。

<details>
<summary>查看原文（29行）</summary>

```text
export function pairedDeviceIdOf(req: IncomingMessage, service: PairingService): string | undefined {
  const cookieDevice = readCookie(req.headers.cookie, service.config.cookieName)
  const headerDevice = typeof req.headers[REMOTE_DEVICE_HEADER] === 'string'
    ? (req.headers[REMOTE_DEVICE_HEADER] as string)
    : undefined
  const id = cookieDevice ?? headerDevice
  if (id === undefined) return undefined
  return service.touchDevice(id) ? id : undefined
}

/**
 * Build the remote desktop channel HTTP routes.
 * @param deps - pairing service + local port + inner credential.
 * @returns the routes to register on webServer.
 */
export function makeRemoteApiRoutes(deps: RemoteApiDeps): WebRoute[] {
  const { service } = deps

  const handler = (req: IncomingMessage, res: ServerResponse): void => {
    // Paired credential first — before any bytes are buffered or forwarded.
    // Unconditional by design: this channel attaches the process's own
    // browser-auth cookie to every re-issued call, so admitting an unpaired
    // caller would hand out that credential's authority (issue #1665).
    const paired = pairedDeviceIdOf(req, service)
    if (paired === undefined) {
      req.resume()
      envelopeError(res, 403, 'invalid-request', 'unpaired', 'this device is not paired with the desktop')
      return
    }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:106-131](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L106-L131)

环回请求重塑来源并附内层凭据。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * Headers of the loopback re-issue: the caller headers minus the ones the
 * channel owns, plus the rewritten authority, the synthetic same-origin
 * tripwire, and the inner credential that replaces the caller cookie.
 * @param req - the already-gated outer request.
 * @param port - local webServer port.
 * @param cookie - the inner credential, when one resolved.
 * @returns headers to send to 127.0.0.1.
 */
function forwardedRequestHeaders(req: IncomingMessage, port: number, cookie: string | undefined): Record<string, string> {
  const nominated = nominatedHeaders(req.headers.connection)
  const headers: Record<string, string> = {}
  for (let index = 0; index + 1 < req.rawHeaders.length; index += 2) {
    const name = req.rawHeaders[index].toLowerCase()
    if (REQUEST_HEADER_DENYLIST.has(name) || nominated.has(name)) continue
    if (REQUEST_HEADER_DENY_PREFIXES.some(prefix => name.startsWith(prefix))) continue
    const value = req.rawHeaders[index + 1]
    const previous = headers[name]
    // Repeated headers reach the upstream as one comma-joined value, the same
    // way node folds duplicates on the receiving side.
    headers[name] = previous === undefined ? value : `${previous}, ${value}`
  }
  headers.host = `127.0.0.1:${String(port)}`
  headers['sec-fetch-site'] = 'same-origin'
  if (cookie !== undefined) headers.cookie = cookie
  return headers
```

</details>

#### 缺口

- 固定宿主的浏览器认证和设备储存行为未实际验证
  **影响**：不能据源码推断跨版本兼容或所有来源均被保护
  **进一步探讨**：在隔离宿主上测试配对、过期、重复接受、认证与重启。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 撤销是否终止所有连接与其他插件能力？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

stop 清除 token 和设备表，revoke 删除单设备；持久化失败会尝试删除旧存储，但删除也可能失败并只记录错误。新 HTTP 与 WebSocket 握手均查询设备存活，而已建立的 WebSocket 被代理成双向字节流，所读转发代码没有在每帧重新检查设备；因此不能保证撤销后旧连接不再承载消息。插件只将少数管理前缀留在本机，并重塑环回来源；同提交的 SSH 插件如果也启用，其路由及终端以环回请求为准入，远程代理中的对应升级路径使配对用户可能到达该能力。这是有条件的同仓组合推断，未运行组合验证；配对不代表所有宿主凭据、工作或已有连接均被撤销。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:527-550](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/pairing.ts#L527-L550)

stop/revoke 清除会话。

<details>
<summary>查看原文（24行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:362-380](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/pairing.ts#L362-L380)

撤销持久化及删除失败边界。

<details>
<summary>查看原文（19行）</summary>

```text
  /**
   * Persist a table change that REVOKES access (stop, per-device revoke, idle
   * eviction). A failed write would leave the revoked session on disk, and
   * {@link loadPersisted} restores that file verbatim on the next start — the
   * device's still-valid cookie would authorize again after an explicit
   * revocation. When the write cannot be made durable, the stale store is
   * removed instead (a missing file already loads as an empty table), so the
   * failure costs a re-pair rather than silently undoing the revocation.
   */
  private persistRevocation(): void {
    if (this.persist()) return
    const file = this.config.devicesFile
    if (file === undefined) return
    try {
      if (this.fs.removeFile !== undefined) this.fs.removeFile(file)
      else rmSync(file, { force: true })
      console.error('remote-web-ui: the device revocation could not be persisted; removed the stale device store so a restart cannot restore it')
    } catch (error) {
      console.error('remote-web-ui: the device revocation could not be persisted and the stale device store could not be removed', error)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:235-248](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/remote-api.ts#L235-L248)

新的 WebSocket 握手检查设备。

<details>
<summary>查看原文（14行）</summary>

```text
  const handlerFor = (fallbackPath: string) => (req: IncomingMessage, socket: Duplex, head: Buffer): void => {
    // WebSocket handshakes cannot carry headers from the Web API, so the
    // cookieless credential rides the query; the cookie stays the primary.
    // The gate is unconditional here too (issue #1665).
    let queryDevice: string | undefined
    try {
      queryDevice = new URL(req.url ?? '/', 'http://127.0.0.1').searchParams.get(REMOTE_DEVICE_QUERY) ?? undefined
    } catch { /* fall through to the cookie */ }
    const deviceId = pairedDeviceIdOf(req, service)
    const paired = deviceId ?? (queryDevice !== undefined && service.touchDevice(queryDevice) ? queryDevice : undefined)
    if (paired === undefined) {
      socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:231-272](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L231-L272)

握手后双向 pipe，未见每帧会话复核。

<details>
<summary>查看原文（42行）</summary>

```text
export function proxyLoopbackUpgrade(
  req: IncomingMessage,
  socket: Duplex,
  head: Buffer,
  port: number,
  upstreamPath: string,
  cookie?: string,
): void {
  const lines = [
    `GET ${upstreamPath} HTTP/1.1`,
    `Host: 127.0.0.1:${String(port)}`,
    'Upgrade: websocket',
    'Connection: Upgrade',
  ]
  if (cookie !== undefined) lines.push(`Cookie: ${cookie}`)
  for (const name of WS_FORWARD_HEADERS) {
    const value = req.headers[name]
    if (value === undefined) continue
    lines.push(`${name}: ${Array.isArray(value) ? value.join(', ') : value}`)
  }
  const handshake = `${lines.join('\r\n')}\r\n\r\n`

  const upstream = connect(port, '127.0.0.1')
  // A half-open tunnel path (dead-but-alive edge connection) would otherwise
  // let the phone's mux socket sit stale for minutes: keepalive probes the
  // pipe periodically and destroys both legs on the first real gap, so the
  // client's reconnect + stream re-baseline re-syncs the feed in seconds.
  ;(socket as unknown as import('node:net').Socket).setKeepAlive(true, 20_000)
  upstream.setKeepAlive(true, 20_000)
  const tearDown = (): void => {
    upstream.destroy()
    socket.destroy()
  }
  upstream.on('error', tearDown)
  socket.on('error', tearDown)
  upstream.on('close', () => { socket.destroy() })
  socket.on('close', () => { upstream.destroy() })
  upstream.on('connect', () => {
    upstream.write(handshake)
    if (head.length > 0) upstream.write(head)
    socket.pipe(upstream)
    upstream.pipe(socket)
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-methods.ts:38-44](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/remote-methods.ts#L38-L44)

远程升级路径包含 SSH 终端。

```text
export const REMOTE_UPGRADE_PATHS = [
  REMOTE_API_PATHS.mux,
  `${REMOTE_PREFIX}/sidebar/ws/terminal`,
  `${REMOTE_PREFIX}/sidebar/ws/agent-terminals`,
  `${REMOTE_PREFIX}/sidebar/ws/agent-opens`,
  `${REMOTE_API_PREFIX}/dsh-ssh/terminal`,
] as const
```

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-methods.ts:64-88](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/remote-methods.ts#L64-L88)

本地专属路径的有限表。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * Path prefixes that stay physically local even for a paired device. A
 * paired remote desktop may use the full host API (chat, sessions,
 * settings, credentials, presets — it is a full-control credential), but it
 * must not reach the machine-control planes: pairing control itself, the
 * dsh-web self-update installer, and plugin install/remove.
 */
export const LOCAL_ONLY_PREFIXES: readonly string[] = [
  '/api/pair',
  '/api/update',
  PLUGIN_MANAGER_PATH,
] as const

/**
 * Whether a paired inner path must stay physically local.
 * @param innerPath - the rewritten inner path (e.g. `/api/session.list`).
 * @returns a denial message, or undefined when the path may be proxied.
 */
export function localOnlyDenial(innerPath: string): string | undefined {
  for (const prefix of LOCAL_ONLY_PREFIXES) {
    if (innerPath === prefix || innerPath.startsWith(`${prefix}/`)) {
      return `${prefix.slice(1)} stays physically local and stays unreachable from a paired remote desktop`
    }
  }
  return undefined
```

</details>

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:115-130](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L115-L130)

HTTP 代理移除转发标记并重塑环回 Host。

<details>
<summary>查看原文（16行）</summary>

```text
function forwardedRequestHeaders(req: IncomingMessage, port: number, cookie: string | undefined): Record<string, string> {
  const nominated = nominatedHeaders(req.headers.connection)
  const headers: Record<string, string> = {}
  for (let index = 0; index + 1 < req.rawHeaders.length; index += 2) {
    const name = req.rawHeaders[index].toLowerCase()
    if (REQUEST_HEADER_DENYLIST.has(name) || nominated.has(name)) continue
    if (REQUEST_HEADER_DENY_PREFIXES.some(prefix => name.startsWith(prefix))) continue
    const value = req.rawHeaders[index + 1]
    const previous = headers[name]
    // Repeated headers reach the upstream as one comma-joined value, the same
    // way node folds duplicates on the receiving side.
    headers[name] = previous === undefined ? value : `${previous}, ${value}`
  }
  headers.host = `127.0.0.1:${String(port)}`
  headers['sec-fetch-site'] = 'same-origin'
  if (cookie !== undefined) headers.cookie = cookie
```

</details>

**依据 8 · 源码核查**：[packages/dsh-ssh/src/loopback.ts:64-91](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/loopback.ts#L64-L91)

SSH 的环回来源与 Host 判定。

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * Request-level trust fence: a loopback socket address AND a loopback Host
 * header, plus browser same-origin markers. The socket address is
 * authoritative for a direct connection; a request that carries a forwarding
 * header is refused outright, because a proxy in front of the host makes both
 * the socket address and the Host header describe the proxy rather than the
 * client. X-Forwarded-For is therefore never evidence *for* loopback.
 */
export function isLoopbackRequest(request: IncomingMessage): boolean {
  if (!isLoopbackAddress(request.socket.remoteAddress)) return false
  if (isProxiedRequest(request)) return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-ssh/src/routes.ts:452-481](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/routes.ts#L452-L481)

SSH 终端升级按环回检查并进入终端注册。

<details>
<summary>查看原文（30行）</summary>

```text
  // ---------------------------------------------- terminal (upgrade)
  // The shell outlives the view that opened it: a session is created once and
  // any later socket attaches by id, so a panel switch or a dropped socket
  // does not tear the remote shell down (engine/terminal-sessions.ts).
  const terminalSessions = new TerminalSessionRegistry({
    openShell: (alias, size, onKeyboardInteractive) => engine.openShell(alias, size, onKeyboardInteractive),
  })
  const upgrade: WebUpgradeRoute = {
    path: SSH_API.terminal,
    handler: (req, socket, head) => {
      if (!isLoopbackRequest(req)) {
        socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
        socket.destroy()
        return
      }
      const url = new URL(req.url ?? '/', 'http://localhost')
      const alias = queryParam(url, 'alias')
      const sessionId = queryParam(url, 'session')
      if (alias === undefined && sessionId === undefined) {
        socket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n')
        socket.destroy()
        return
      }
      const cols = Number.parseInt(queryParam(url, 'cols') ?? '80', 10)
      const rows = Number.parseInt(queryParam(url, 'rows') ?? '24', 10)
      const size = {
        cols: Number.isFinite(cols) ? cols : 80,
        rows: Number.isFinite(rows) ? rows : 24,
      }
      terminalWss.handleUpgrade(req, socket, head, (ws) => {
```

</details>

#### 缺口

- 未实测现有 WebSocket 撤销或同版 SSH 组合
  **影响**：不能断言每种 upstream 已连接状态及权限实际结果
  **进一步探讨**：在隔离宿主上分别建立旧连接、新连接与 SSH 终端，撤销后发消息并检查会话与进程。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · LAN、隧道和 relay 需要什么，停止覆盖哪些资源？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

包要求 DSH、Node 和宿主 webServer、gateway、connection；源码默认 autoTunnel 与 ingressSync 关闭，relay 配置默认开启，作者代码说明 quick tunnel 开启时 relay 可将流量经第三方边缘，默认 relay 标志不等于无条件已有公网隧道。实际 LAN 同步调用先清理旧版留下的配置块，再调整独立转发入口和防火墙；普通路径不写新的 profile 绑定块。LAN forwarder 的 stop 会销毁它登记的连接并等待监听关闭，但这不等于其他连接、宿主浏览器凭据或模型任务已经停止。远端服务、TLS、隧道子进程及所有清理路径未在此验证，采用前应明确关闭不使用的入口和凭据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/package.json:5-10](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/package.json#L5-L10)

Node 要求和版本。

```text
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:83-87](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/index.ts#L83-L87)

host 服务注入。

```text
/** Stable cordis plugin name. */
export const name = 'remote-web-ui'

/** Services required before the pairing surfaces can mount. */
export const inject = ['webServer', 'typertGateway', 'connection']
```

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:274-293](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/index.ts#L274-L293)

网络选项默认值。

<details>
<summary>查看原文（20行）</summary>

```text
export const Config = z.object({
  tokenTtlMs: z.number().step(1).min(60_000).default(10 * 60_000).volatile(),
  offlineAfterMs: z.number().step(1).min(5_000).default(25_000).volatile(),
  maxDevices: z.number().step(1).min(1).max(64).default(4).volatile(),
  idleExpireMs: z.number().step(1).min(60_000).default(DEFAULT_IDLE_EXPIRE_MS).volatile(),
  cookieName: z.string().min(1).default('dsh_pair').volatile(),
  requirePairingForLan: z.boolean().default(true).volatile(),
  publicBaseUrl: z.string().volatile(),
  trustedHosts: z.array(z.string()),
  devicesFile: z.string(),
  autoTunnel: z.boolean().default(false).volatile(),
  tunnelToken: z.string().role('secret').volatile(),
  ingressSync: z.boolean().default(false).volatile(),
  cfApiToken: z.string().role('secret').volatile(),
  cfAccountId: z.string().volatile(),
  cfTunnelId: z.string().volatile(),
  relay: z.boolean().default(true).volatile(),
  lanBind: z.boolean().volatile(),
  profile: z.string().pattern(/^[A-Za-z0-9][A-Za-z0-9._-]*$/),
  enabled: z.boolean().default(true).volatile(),
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/lan-forward.ts:235-252](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/lan-forward.ts#L235-L252)

forwarder 关闭自身 listener 和连接。

<details>
<summary>查看原文（18行）</summary>

```text

  /**
   * Close the LAN listener and every connection it opened, then resolve once the
   * port is released. Safe to call when nothing is bound.
   */
  stop(): Promise<void> {
    const server = this.server
    this.server = undefined
    this.config = undefined
    this.releaseSockets()
    this.state = IDLE_FORWARD_STATE
    if (server === undefined) return Promise.resolve()
    return new Promise<void>((resolve) => {
      server.close(() => { resolve() })
      // Keep-alive and upgraded connections keep the handle alive; they are
      // already destroyed above, so the close above settles on the next tick.
      server.closeAllConnections?.()
    })
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:115-129](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/index.ts#L115-L129)

direct API 与宿主浏览器凭据边界。

<details>
<summary>查看原文（15行）</summary>

```text
   * When true (default), a desktop Web GUI opened at a non-loopback origin
   * rides the gated `/remote/api` channel, whose requests must carry a live
   * paired-device cookie — the QR is the only way into remote desktop, and
   * stop()/revoke() cut the channel and the pairing cookie off immediately.
   * This policy selects the transport; it never loosens the channel, whose
   * gate is unconditional (issue #1665). Scope
   * note for this cohort: direct /api is governed by the harness fence +
   * browser-auth cookie (the api/gate seam has no emitter on 0.1.2-alpha.2),
   * so a harness browser credential a device has already redeemed is not
   * invalidated by stop() — see the README security model. Set false to keep
   * the desktop on plain `/api` (only useful when that origin is already
   * trusted for `/api`). Turning the policy off does NOT open the channel:
   * the /remote proxy attaches the process's own browser-auth credential only
   * when the request itself presents a live paired-device credential, so an
   * unpaired LAN/tunnel caller is forwarded without it and the inner route
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1193-1226](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/index.ts#L1193-L1226)

当前 LAN 同步清理旧版配置块并管理独立转发及防火墙，普通路径不写新的绑定块。

<details>
<summary>查看原文（34行）</summary>

```text
  /**
   * The bind work one sync runs: the legacy block removal, the LAN edge, and the
   * firewall rule. It never writes a profile file except to remove the block an
   * older version left there.
   *
   * The scheduling that reaches it still runs through runDetached (see
   * scheduleLanBindWork): a settings save holds the Host's exclusive HMR
   * transaction in its async context, and a config-file write from inside that
   * context makes the watcher's refresh re-enter it ("HMR transactions cannot be
   * nested", #1751/#1754). The removal is a no-op on every boot after the first,
   * so the ordinary path writes nothing at all.
   * @param value - the effective plugin configuration.
   */
  const applyLanBindWork = (value: ResolvedConfig): void => {
    cleanupLegacyBlock(value.profile)
    applyForwardEdge(value)
    if (value.lanBind === undefined) return
    // Keep the firewall rule aligned with the toggle (managed platforms only;
    // see firewall.ts). The probes and rule rewrites are blocking subprocesses,
    // so they run only when the desired state actually moved - not on every
    // unrelated settings save. The port is the live bind port; without it there
    // is nothing to align yet.
    const livePort = Number.isFinite(ctx.webServer.port) ? ctx.webServer.port : undefined
    if (livePort === undefined) {
      console.error('remote-web-ui: cannot align the host firewall rule — the web server port is not known yet')
      return
    }
    const nextFirewall: AppliedFirewallState = { enabled: value.lanBind === true, port: livePort }
    if (!firewallActionNeeded(lastFirewallApplied, nextFirewall)) return
    const ruleOk = nextFirewall.enabled ? ensureFirewallRule(nextFirewall.port) : removeFirewallRule(nextFirewall.port)
    if (ruleOk) {
      lastFirewallApplied = nextFirewall
    } else {
      console.error('remote-web-ui: the host firewall rule could not be updated (admin rights required on managed platforms)')
```

</details>

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1162-1187](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/index.ts#L1162-L1187)

按条件启动或停止 LAN forwarder，宿主自身可保持回环绑定。

<details>
<summary>查看原文（26行）</summary>

```text
    const plan = forwardPlanOf(value.lanBind, startup?.host, liveCapability)
    forwardReason = plan.reason
    const state = forwarder.snapshot()
    const port = Number.isFinite(ctx.webServer.port) ? ctx.webServer.port as number : undefined
    if (plan.host === undefined || port === undefined) {
      if (state.listening) void forwarder.stop().then(applyLanBases)
      else applyLanBases()
      if (plan.reason !== undefined && !warnedForwardReasons.has(plan.reason)) {
        warnedForwardReasons.add(plan.reason)
        if (plan.reason === 'host-bind') {
          console.log(`remote-web-ui: the web server itself binds ${startup?.host ?? ''} (from --host), so the LAN forwarder yields that port and this plugin adds no listener`)
          warnLanExposure()
        } else if (plan.reason === 'no-address') {
          console.error('remote-web-ui: lanBind is on but this machine has no LAN IPv4 address to listen on; LAN access stays off, use a tunnel instead')
        }
      }
      return
    }
    if (state.listening && state.address === plan.host && state.port === port) return
    const host = plan.host
    void forwarder.start(host, port).then((next) => {
      if (next.listening) {
        console.log(`remote-web-ui: LAN forwarder listening on ${host}:${String(port)} -> ${FORWARD_UPSTREAM_HOST}:${String(next.upstreamPort)}; the web server itself stays on loopback`)
        warnLanExposure()
      } else {
        console.error(`remote-web-ui: the LAN forwarder could not listen on ${host}:${String(port)} (${next.error ?? 'unknown error'}); loopback access is unaffected and the LAN edge stays off`)
```

</details>

**依据 8 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:205-215](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/index.ts#L205-L215)

代码说明开启 quick tunnel 且 relay 启用时流量经过第三方边缘。

<details>
<summary>查看原文（11行）</summary>

```text
  cfTunnelId?: string
  /**
   * Stable-origin relay: when on (default), the quick tunnel is fronted by a
   * fixed `https://<id>.dsh-market.com` subdomain (the dsh-market worker's
   * registry), so the phone's bookmark and pairing cookie survive `dsh web`
   * restarts without any user setup. Traffic transits the dsh-market edge
   * (the same trust point as the quick tunnel itself); turn off to fall back
   * to the raw ephemeral quick URL. Named tunnels keep their dashboard
   * hostname and never touch the relay.
   */
  relay?: boolean
```

</details>

#### 缺口

- 实际宿主 direct API、外部 relay 和隧道停止未执行
  **影响**：无法把一个通道关闭当成全网络退出
  **进一步探讨**：逐通道检查监听、已连接会话、进程和凭据，并通过防火墙或停宿主兜底。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时值得试用，首次、持续和恢复成本如何衡量？

**研究主题**：效果与总成本、采用判断

#### 完整回答

受控设备的用户若需要离开主机继续看同一 DSH 会话，可以在独立、无敏感数据实例先验证 LAN 配对；相比单机还要承担设备凭据、网络暴露、版本适配、状态持久化以及故障时逐通道排查。隧道及 relay 还引入第三方依赖，费用、资源和时间没有实测。优先在加载前明确禁用不需要的 relay、自动隧道和 ingress，清理不用的公网配置，保留本地操作者与断网方式。若身份不明、撤销后旧连接仍可交互或宿主凭据无法确认，应停止实例并切断网络；需要硬即时撤销、只读多用户隔离或生产凭据保障的用户应暂缓。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:274-293](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/index.ts#L274-L293)

各网络选项默认值。

<details>
<summary>查看原文（20行）</summary>

```text
export const Config = z.object({
  tokenTtlMs: z.number().step(1).min(60_000).default(10 * 60_000).volatile(),
  offlineAfterMs: z.number().step(1).min(5_000).default(25_000).volatile(),
  maxDevices: z.number().step(1).min(1).max(64).default(4).volatile(),
  idleExpireMs: z.number().step(1).min(60_000).default(DEFAULT_IDLE_EXPIRE_MS).volatile(),
  cookieName: z.string().min(1).default('dsh_pair').volatile(),
  requirePairingForLan: z.boolean().default(true).volatile(),
  publicBaseUrl: z.string().volatile(),
  trustedHosts: z.array(z.string()),
  devicesFile: z.string(),
  autoTunnel: z.boolean().default(false).volatile(),
  tunnelToken: z.string().role('secret').volatile(),
  ingressSync: z.boolean().default(false).volatile(),
  cfApiToken: z.string().role('secret').volatile(),
  cfAccountId: z.string().volatile(),
  cfTunnelId: z.string().volatile(),
  relay: z.boolean().default(true).volatile(),
  lanBind: z.boolean().volatile(),
  profile: z.string().pattern(/^[A-Za-z0-9][A-Za-z0-9._-]*$/),
  enabled: z.boolean().default(true).volatile(),
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:527-550](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/pairing.ts#L527-L550)

设备撤销范围。

<details>
<summary>查看原文（24行）</summary>

```text
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

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:253-272](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L253-L272)

已建立连接转发方式。

<details>
<summary>查看原文（20行）</summary>

```text
  const upstream = connect(port, '127.0.0.1')
  // A half-open tunnel path (dead-but-alive edge connection) would otherwise
  // let the phone's mux socket sit stale for minutes: keepalive probes the
  // pipe periodically and destroys both legs on the first real gap, so the
  // client's reconnect + stream re-baseline re-syncs the feed in seconds.
  ;(socket as unknown as import('node:net').Socket).setKeepAlive(true, 20_000)
  upstream.setKeepAlive(true, 20_000)
  const tearDown = (): void => {
    upstream.destroy()
    socket.destroy()
  }
  upstream.on('error', tearDown)
  socket.on('error', tearDown)
  upstream.on('close', () => { socket.destroy() })
  socket.on('close', () => { upstream.destroy() })
  upstream.on('connect', () => {
    upstream.write(handshake)
    if (head.length > 0) upstream.write(head)
    socket.pipe(upstream)
    upstream.pipe(socket)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/lan-forward.ts:235-252](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/lan-forward.ts#L235-L252)

独立 LAN forwarder 的停止语义。

<details>
<summary>查看原文（18行）</summary>

```text

  /**
   * Close the LAN listener and every connection it opened, then resolve once the
   * port is released. Safe to call when nothing is bound.
   */
  stop(): Promise<void> {
    const server = this.server
    this.server = undefined
    this.config = undefined
    this.releaseSockets()
    this.state = IDLE_FORWARD_STATE
    if (server === undefined) return Promise.resolve()
    return new Promise<void>((resolve) => {
      server.close(() => { resolve() })
      // Keep-alive and upgraded connections keep the handle alive; they are
      // already destroyed above, so the close above settles on the next tick.
      server.closeAllConnections?.()
    })
```

</details>

#### 缺口

- 未测跨设备可用性、恢复时间、流量或第三方费用
  **影响**：无法判断单位任务的总成本和收益
  **进一步探讨**：以固定任务记录连接、拒绝、撤销后连接、人工恢复及资源用量。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些机制可借鉴，有什么可证伪改进？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可借鉴新请求在转发前验证设备、landing grant 消费后删除、撤销持久化失败时尝试删除旧表，以及 LAN forwarder 跟踪自身 socket。它们各只覆盖局部生命周期，删除失败及已有 raw pipe 仍是反例。未验证假设是把每条升级连接绑定设备身份，在撤销时关闭相应连接并以通道为单位回报停止结果，能够减少旧会话继续操作的窗口；这需要处理在途消息、断连重试和服务端状态，可能增加维护和中断成本。最小对照在同一模拟任务中测撤销到最后可操作消息的时间、误断和恢复成本；若普通停宿主或防火墙足以达到目标且总成本更低，就否定新增机制。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:147-160](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/remote-api.ts#L147-L160)

先进行设备检查再代理。

<details>
<summary>查看原文（14行）</summary>

```text
export function makeRemoteApiRoutes(deps: RemoteApiDeps): WebRoute[] {
  const { service } = deps

  const handler = (req: IncomingMessage, res: ServerResponse): void => {
    // Paired credential first — before any bytes are buffered or forwarded.
    // Unconditional by design: this channel attaches the process's own
    // browser-auth cookie to every re-issued call, so admitting an unpaired
    // caller would hand out that credential's authority (issue #1665).
    const paired = pairedDeviceIdOf(req, service)
    if (paired === undefined) {
      req.resume()
      envelopeError(res, 403, 'invalid-request', 'unpaired', 'this device is not paired with the desktop')
      return
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/pair-grant.ts:105-114](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/pair-grant.ts#L105-L114)

grant 单次消费。

<details>
<summary>查看原文（10行）</summary>

```text
    consume(grant: string | undefined): string | undefined {
      if (grant === undefined || grant === '') return undefined
      const consumedAt = now()
      const entry = entries.get(grant)
      // Delete before validating: a replayed grant must never resolve, and an
      // expired one must not linger in the table.
      entries.delete(grant)
      purgeExpired(consumedAt)
      if (entry === undefined || entry.expiresAt <= consumedAt) return undefined
      return entry.deviceId
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:362-380](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/pairing.ts#L362-L380)

撤销失败删除旧存储的尝试及删除失败。

<details>
<summary>查看原文（19行）</summary>

```text
  /**
   * Persist a table change that REVOKES access (stop, per-device revoke, idle
   * eviction). A failed write would leave the revoked session on disk, and
   * {@link loadPersisted} restores that file verbatim on the next start — the
   * device's still-valid cookie would authorize again after an explicit
   * revocation. When the write cannot be made durable, the stale store is
   * removed instead (a missing file already loads as an empty table), so the
   * failure costs a re-pair rather than silently undoing the revocation.
   */
  private persistRevocation(): void {
    if (this.persist()) return
    const file = this.config.devicesFile
    if (file === undefined) return
    try {
      if (this.fs.removeFile !== undefined) this.fs.removeFile(file)
      else rmSync(file, { force: true })
      console.error('remote-web-ui: the device revocation could not be persisted; removed the stale device store so a restart cannot restore it')
    } catch (error) {
      console.error('remote-web-ui: the device revocation could not be persisted and the stale device store could not be removed', error)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/lan-forward.ts:235-252](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/lan-forward.ts#L235-L252)

forwarder 停止自己维护的连接。

<details>
<summary>查看原文（18行）</summary>

```text

  /**
   * Close the LAN listener and every connection it opened, then resolve once the
   * port is released. Safe to call when nothing is bound.
   */
  stop(): Promise<void> {
    const server = this.server
    this.server = undefined
    this.config = undefined
    this.releaseSockets()
    this.state = IDLE_FORWARD_STATE
    if (server === undefined) return Promise.resolve()
    return new Promise<void>((resolve) => {
      server.close(() => { resolve() })
      // Keep-alive and upgraded connections keep the handle alive; they are
      // already destroyed above, so the close above settles on the next tick.
      server.closeAllConnections?.()
    })
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:260-272](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L260-L272)

旧升级连接的错误关闭与双向 pipe。

<details>
<summary>查看原文（13行）</summary>

```text
  const tearDown = (): void => {
    upstream.destroy()
    socket.destroy()
  }
  upstream.on('error', tearDown)
  socket.on('error', tearDown)
  upstream.on('close', () => { socket.destroy() })
  socket.on('close', () => { upstream.destroy() })
  upstream.on('connect', () => {
    upstream.write(handshake)
    if (head.length > 0) upstream.write(head)
    socket.pipe(upstream)
    upstream.pipe(socket)
```

</details>

#### 缺口

- 设备绑定连接关闭与逐通道回执尚无实验
  **影响**：不能声称满足即时撤销或低维护
  **进一步探讨**：通过受控旧 socket 和新握手对照测撤销延迟及误断。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
