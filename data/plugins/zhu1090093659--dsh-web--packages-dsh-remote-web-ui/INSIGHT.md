# dsh-remote-web-ui

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6b984b1](https://github.com/zhu1090093659/dsh-web/tree/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui)

<!-- BEGIN META -->
[![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 101,443](https://img.shields.io/static/v1?label=npm+30d&message=101%2C443&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui)
<!-- END META -->

> **功能**：通过扫码配对让自有手机或电脑访问同一 DSH Web 界面，并管理设备会话、LAN与可选隧道。

> **亮点**：相对直接暴露宿主Web端口，它用独立 /remote 网关把设备凭据核验放在环回重发之前，复用官方界面并维护配对与持久设备生命周期。撤销写盘失败时尝试移除陈旧存储，避免重启恢复已撤销会话。贡献是受边界约束的远程控制交接，隧道、TLS和官方界面归属外部。[Q02](#research-q02)

> **主要限制**：配对设备实质持有广泛主机控制能力，且撤销只约束插件自己的配对通道；直接 /api 是否可达依赖宿主fence，gate.ts明确某运行时没有api/gate发射者。此外QR token在有效期内可重复兑换设备，package的one-time措辞不能覆盖实际状态机。应按实际通道与凭据区分撤销语义，不声称统一收回所有权限。[Q03](#research-q03)

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
  - [Q01 · 远程访问是共享展示还是主机控制，什么才算成功？](#detail-section-11)
  - [Q02 · 设备如何获得通道并在撤销后失效？](#detail-section-12)
  - [Q03 · 停止是否统一撤销权限，one-time声明与源码一致吗？](#detail-section-13)
  - [Q04 · 远程控制的前提和维护负担是什么？](#detail-section-14)
  - [Q05 · 怎样让撤销结果可核查，谁值得先试？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为希望用自己的手机或另一台电脑继续操作同一 DSH 实例的用户，提供扫码配对、设备会话和远程官方Web界面通道。合格结果是正确设备能访问预期主机、未配对设备被拒绝且撤销后不能继续新请求；不是多用户隔离或只读共享。

反向代理加宿主认证或远程桌面是直接替代；比较需固定网络与权限，区分可达性、操作体验及撤销覆盖。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 扫码配对 | 将自有设备绑定到实例 | token窗口内可重复兑换，设备拥有广泛主机控制 |
| /remote通道 | HTTP和WS访问同一宿主 | 每次入口校验设备，直接/api另属宿主fence |
| 设备撤销与持久化 | 管理后续设备访问 | 在途请求可完成，其他宿主凭据不由此统一撤销 |
| LAN与可选隧道接入 | 提供跨网络可达性 | 路径、代理和relay有额外信任与恢复条件，未运行验收 |

<a id="dependencies-and-flow"></a>

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH >=0.2.1-rc.3 与Web界面 | 启动必需 | bundle、webServer与内层认证 | 不同宿主fence必须另行验收 |
| 本机配对面板与自有设备 | 控制必需 | 发行token及管理设备凭据 | 不向不受控设备共享配对链接 |
| LAN连通或隧道 | 对应远程路径必需 | 让设备到达配对通道 | 网络变化需核对实际bind与来源 |
| 可写设备存储和可信代理 | 持久/撤销必需 | 保存设备与保留转发身份 | 写盘失败或代理剥离标记需人工核对 |
| Cloudflare/作者relay | 公网模式可选 | 公网与稳定域名中转 | 引入外部网络及流量可见性，费用未核实 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 本机用户安装并检查默认loopback绑定 | 先验证原生/api没有非预期外露 |
| 2 | 用户选择LAN或隧道并发行短期配对链接 | 只有自己的设备兑换；token窗口内可多次兑换 |
| 3 | 设备进入官方Web界面 | 每次/remote请求验证活设备再转发 |
| 4 | 本机用户撤销设备或停止 | 验证新HTTP及WS请求被拒绝，另查直接/api凭据 |

<a id="cost-and-value"></a>

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 常驻宿主、LAN/隧道资源 | 配置来源、代理与设备配对，核对权限 | 费用、网络环境及耗时未测 |
| 持续使用 | 代理流量、连接及可选外部relay | 设备审查、宿主升级兼容和界面复核 | 移动布局依赖官方语义选择器 |
| 失败恢复 | 隧道重连、设备重配及存储修复 | 查通道状态、认证和残留访问 | 撤销不能自动回收宿主另发浏览器凭据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 界面复用 | 远程通道向同一环回宿主重发 | 手机实际可操作性与网络性能 |
| 设备访问门禁 | HTTP与WS握手均校验设备 | 在途长连接、代理和直接/api全覆盖 |
| 撤销持久化 | stop/revoke清表并保存，失败尝试移除旧文件 | 双重文件系统失败后的重启状态 |

> **思考**：配对设备实质持有广泛主机控制能力，且撤销只约束插件自己的配对通道；直接 /api 是否可达依赖宿主fence，gate.ts明确某运行时没有api/gate发射者。此外QR token在有效期内可重复兑换设备，package的one-time措辞不能覆盖实际状态机。应按实际通道与凭据区分撤销语义，不声称统一收回所有权限。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对直接暴露宿主Web端口，它用独立 /remote 网关把设备凭据核验放在环回重发之前，复用官方界面并维护配对与持久设备生命周期。撤销写盘失败时尝试移除陈旧存储，避免重启恢复已撤销会话。贡献是受边界约束的远程控制交接，隧道、TLS和官方界面归属外部。[Q02](#research-q02)

先门禁再代理、区分loopback upstream与真实本机以及撤销持久失败时尝试移除旧store值得借鉴。需要保留本组件与宿主认证不同所有权，不能由局部fail-closed推断全部访问撤销。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

配对设备实质持有广泛主机控制能力，且撤销只约束插件自己的配对通道；直接 /api 是否可达依赖宿主fence，gate.ts明确某运行时没有api/gate发射者。此外QR token在有效期内可重复兑换设备，package的one-time措辞不能覆盖实际状态机。应按实际通道与凭据区分撤销语义，不声称统一收回所有权限。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

确有跨设备操作需要、理解配对等同主机控制的用户，可先在无敏感数据的实例测试自有设备。保持loopback宿主、先试LAN，再测未配对拒绝、撤销、重启和浏览器恢复；公网relay需单独接受中转方流量可见性。需要只读共享、多租户或统一撤销所有宿主凭据的场景先观察。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查配对与独立远程门禁；直接/api归宿主fence，设备为广泛控制凭据，token有效期内可重复兑换；未运行远程验收。

- 已检查：作者 README、包清单、源码路径 packages/dsh-remote-web-ui/README.md、packages/dsh-remote-web-ui/package.json、packages/dsh-remote-web-ui/src/index.ts、packages/dsh-remote-web-ui/src/gate.ts、packages/dsh-remote-web-ui/src/pairing.ts、packages/dsh-remote-web-ui/src/remote-api.ts 及固定范围 inventory；组件：packages/dsh-remote-web-ui。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读配对状态机、HTTP/WS网关、api/gate与宿主接线；未审计全部转发器、云relay、移动CSS或Service Worker，不运行隧道或配对。
- 下一步：隔离实例先测自有设备LAN配对，再逐路径验收未配对、撤销、在途任务、WS、重启和直接/api，记录外部relay的实际路径。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.8（[固定提交 6b984b1](https://github.com/zhu1090093659/dsh-web/tree/6b984b10950f78f1f4a5b5adf4c16636b5e6113d)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是将“设备已撤销”改为带通道覆盖的可回读结果：分别探测 /remote、原生 /api、WebSocket和在途请求，列明已切断、仍在途及宿主外凭据。由当前设备撤销与宿主认证分离推导，增量是可验证退出边界。用隔离实例对不同绑定、代理和已有浏览器凭据做矩阵实验；若无法可靠检测某路径就标未知，不用单个绿色状态替代。[Q05](#research-q05)

隔离实例先测自有设备LAN配对，再逐路径验收未配对、撤销、在途任务、WS、重启和直接/api，记录外部relay的实际路径。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：packages/dsh-remote-web-ui；内容摘要：953f6a47307be8f8fb456198df8390c6402a60ea4ad6d7b51e89eb1f46f13df9。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 214 | — | — | 7396 |
| .ts | source | 4 | 2686 | 1460 | 1102 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/zhu1090093659/dsh-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查远程配对、内外凭据与撤销覆盖，判断何种自有设备场景可控试用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 远程访问是共享展示还是主机控制，什么才算成功？

**研究主题**：场景与需求

#### 完整回答

作者复用官方Web界面，不是另一个只读手机版。配对设备可进入chat、settings、credentials等主机面，只有少数管理控制面保持本机，因此只应配对自有受控设备。简单替代是自己配置反向代理或远程桌面；本组件减少界面分叉与配对交接，但不提供多用户角色隔离。成功应同时验证已配对可用、未配对拒绝、撤销后新访问拒绝及宿主原生入口没有绕过，不能只以扫码进入界面验收。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-remote-web-ui/README.md:18-28](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/README.md#L18-L28)

作者远程界面和设备会话定位

<details>
<summary>查看原文（11行）</summary>

```text
> Seamless remote access for DeepSeek Harness (DSH) Web GUI and desktop client sharing the **exact same interface**: pair an iPhone, Android smartphone, tablet, or another computer from the QR code next to settings. Both ends run the authentic official Web GUI — phones receive an injected portrait touch layer while remote computers enjoy the complete desktop workbench. Access is guarded by expiring pairing tokens and revocable sessions. Built-in LAN binding and optional Cloudflare quick tunnels enable effortless external access with persistent hostnames.

This package is an official external plugin for DeepSeek Harness (DSH), structured as a cordis bundle: the host half manages pairing tokens, device sessions, `/api/pair` routes, the gated `/remote` channel, and LAN binding; the browser half renders the remote access trigger, QR pairing modal, live device roster, settings card, and mobile portrait touch adaptation.

## What it does

- **Entry**: a phone icon beside the settings button in both the expanded sidebar and the narrow rail; its tooltip and accessible label say "Remote access".
- **Panel**: "Remote access" title, a "Pair a device" card with the status area ("Waiting for a device" + status badge), a large QR code, the pairing link with its copy button, Stop / Refresh QR actions, and the authorized-device roster (a saved device name that falls back to the User-Agent-derived label, online/offline, last active time, per-device rename and unpair, and a merge action for rows sharing one User-Agent). Credential-bearing device ids and raw User-Agent values are never rendered. Both the phone and the PC use the same time-limited link: until it expires or the QR is refreshed, that link can pair several devices, each with its own device session.
- **Phone side**: scanning the QR binds the phone with a time-limited token and reloads into the **official Web GUI** — there is no second interface to drift from. While the phone is in portrait, the plugin injects a touch-adaptation layer over the running UI (see "The mobile adaptation layer" below). The accept chain is cookieless (`/pair-accept` → `/pair-app`): the plugin itself serves the official shell, so the phone needs no harness browser-auth cookie at all. A reopen service worker (https origins) then owns later navigations to `/` from history, bookmarks, or tab restore, so the phone reopens straight into the app instead of a 401 dead end (see Security model).
- **PC side**: the same link opens the full desktop Web GUI on another computer over the gated `/remote` channel; unpaired PCs see a guided blocking page (with a manual pair-token input) and no workspace data behind it.
- **Security**: one active token at a time (a refresh invalidates the old link; the link stays re-usable within its expiry window so a scan handed between browsers can complete pairing; it expires). 停止 revokes every paired device and the current token — the `/remote` channel cuts them off on their next request. Pairing is this plugin's access control for the `/remote` channel; the web server keeps its loopback bind, so a LAN browser reaches the app through this plugin's gated `/remote` gateway (the client moves its transport there) rather than the native `/api`, which the harness Host fence answers with 403 for a LAN authority (see Security model). Loopback (127.0.0.1) keeps using `/api` directly, and so does a page an application on this machine delivered — the desktop shell's `dsh-app://app/` or a `file:` page — because a pairing link is reachable only over the network. A paired device is a **full-control credential** (see Security model).
```

</details>

**依据 2 · 作者声明**：[packages/dsh-remote-web-ui/README.md:178-184](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/README.md#L178-L184)

作者明确通道权限与全控制设备

```text
- **Pairing is the access control for the `/remote` channel, unconditionally**: every request must carry a live paired-device cookie, enforced before any bytes are forwarded. A missing or revoked session receives HTTP 403 with a JSON rejection carrying `error.code: "unpaired"`; the browser's `EventSource` API exposes only the stream failure, not that response body. This gate does **not** follow `requirePairingForLan`: the channel re-issues every call with the process's own browser-auth credential, so admitting an unpaired caller would hand out that authority. The LAN policy governs the plain `/api` surface only and can never widen the channel (issue #1665).
- **The channel carries the process's own inner credential.** The harness browser-auth cookie is authority-bound (minted for the exact `host:port` a browser visited) and has no loopback exemption, so a proxied re-issue to `127.0.0.1` cannot reuse a device's cookie. The plugin therefore redeems its own launch token once — the same exchange a first browser visit performs — and attaches that cookie to re-issued requests. The credential is only ever exercised behind the pairing gate above; 停止/取消配对 immediately stop exercising it.

- **The channel forwards the caller's own request headers, and keeps only what it owns (issue #1925).** A plugin may authenticate its own calls with a header of its own — `x-dsh-im-connect-client` on `@michengai/dsh-im-connect`'s `/sessions/ensure` is the reported case — so the re-issue no longer rebuilds the request from a fixed allowlist: every header is forwarded except the ones this channel owns. It rewrites `host` to the loopback authority, replaces the caller's cookie with the process's inner credential, synthesizes `sec-fetch-site: same-origin`, and drops `origin`/`referer`, the whole browser fetch-metadata family (`sec-*`), hop-by-hop headers (including the ones the caller nominates in its own `Connection` header), the forwarding marks (`x-forwarded-*`, `cf-connecting-ip`, `forwarded`, `x-real-ip` — a re-issued request is loopback, and an edge's stamp would fence it as remote), and the cookieless device credential `x-dsh-remote-device`, which the gate consumes and never hands further. `accept-encoding`, `range` and `if-range` stay out as well, because the response headers the proxy copies carry neither `content-encoding` nor `content-range`.
- **Runtime reality: a LAN browser rides the `/remote` gateway, not the native `/api`.** This plugin never rebinds the web server, so the host stays on `127.0.0.1` and the harness's `/api` Host fence answers a LAN authority with 403. The forwarder makes the host reachable from the LAN, but only this plugin's own surfaces answer there: the pairing entry pages, the status view, and the gated `/remote` channel. Restoring native `/api` over a LAN authority needs the harness web server's `trustedHosts`, which is outside this package; an operator who binds the host to the network with `--host` gets that surface under the harness fence alone, because nothing in the official runtime emits the `api/gate` seam (verified against the 0.2.1-rc.3 packages installed by this repository). On such a deployment a browser credential a device has already redeemed survives 停止/取消配对 until its natural expiry (30 days) — revocation binds the `/remote` channel and the pairing cookie, not that credential. The plugin probes the `/api` posture and warns loudly; treat a network-exposed host bind as a deliberate decision, and prefer loopback plus tunnels when the machine is shared.
- **A paired device is a full-control credential.** With host mode active it reaches the complete host API — chat, sessions, settings, credentials, agent presets, deliverables — mirroring the SDK's own stance that a loopback desktop is trusted. Only the three control planes (pairing, self-update, plugin install/remove) stay physically local. Only pair devices you control; 停止 or per-device 取消配对 revokes immediately.
- **Control endpoints stay loopback-only; the status view answers a tunnel visitor minimally**: mint/stop/revoke/rename/merge, the device roster, the events stream, and the lan-bind status answer only to a desktop request (loopback socket and loopback Host, no forwarding header), and the gated channel keeps the self-update and plugin-install paths physically local. `/api/pair/status` is reachable through a tunnel, but a forwarded or unpaired caller receives only `{ ok, paired, requirePairingForLan, phase, lanAvailable }`; the full snapshot — token expiry, public tunnel URL, counts — and the per-device roster stay with the desktop. A LAN-origin browser sees the "配对面板仅限本机使用" banner.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设备如何获得通道并在撤销后失效？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

PairingService accept检查token存在、stop状态与到期，再为每次有效兑换生成新deviceId并保存设备表；stop清token与所有设备，revoke删一个设备。remote HTTP先从cookie或专用header解析device并touch校验，再检查方法、内部路径和本机专属拒绝，最后转发到环回端口；WebSocket握手也做设备校验，支持专用query凭据。内层认证是宿主进程自己的浏览器凭据，因此设备校验必须无条件在前。持久撤销写盘失败会尝试删除旧文件，避免正常重启复活已撤销设备。贡献在生命周期与边界，底层认证、界面与网络来自宿主和隧道。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:481-509](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/src/pairing.ts#L481-L509)

token兑换与设备持久化

<details>
<summary>查看原文（29行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:513-536](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/src/pairing.ts#L513-L536)

stop和单设备撤销

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

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:150-191](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/src/remote-api.ts#L150-L191)

先设备门禁再转发

<details>
<summary>查看原文（42行）</summary>

```text
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

    const method = req.method ?? 'GET'
    if (!ALLOWED_METHODS.has(method)) {
      req.resume()
      res.writeHead(405).end()
      return
    }

    const url = new URL(req.url ?? '/', 'http://127.0.0.1')
    const inner = innerPathOf(url.pathname)
    if (inner === undefined) {
      req.resume()
      res.writeHead(404).end()
      return
    }
    const denied = loopbackOnlyDenial(inner)
    if (denied !== undefined) {
      req.resume()
      envelopeError(res, 403, 'invalid-request', 'forbidden', denied)
      return
    }

    const port = deps.port()
    if (port === undefined) {
      // The listener has not bound yet (a recompose pass): refuse instead of
      // minting an http://127.0.0.1:undefined target; the desktop retries.
      req.resume()
      envelopeError(res, 503, 'invalid-request', 'port-unbound', 'the local web server port is not bound yet; retry shortly')
      return
    }
    proxyLoopbackHttp(req, res, port, `${inner}${url.search}`, deps.auth)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:235-272](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/src/remote-api.ts#L235-L272)

WS握手同样门禁

<details>
<summary>查看原文（38行）</summary>

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
    }
    const port = deps.port()
    if (port === undefined) {
      // Same unbound-port refusal as the HTTP leg: no :undefined handshake.
      socket.write('HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    const inner = upgradeInnerPath(req.url, fallbackPath)
    const denied = loopbackOnlyDenial(inner.split('?')[0] ?? inner)
    if (denied !== undefined) {
      socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    // The inner handshake needs the browser-auth credential (the gateway
    // event-stream route enforces it); resolving it is async, so the
    // handshake bytes are written once it settles. A missing credential
    // proceeds as before — the gateway route then refuses.
    void Promise.resolve(deps.auth?.ready())
      .catch(() => undefined)
      .then((cookie) => {
        if (socket.destroyed) return
        proxyLoopbackUpgrade(req, socket, head, port, inner, typeof cookie === 'string' ? cookie : undefined)
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:354-373](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/src/pairing.ts#L354-L373)

撤销保存失败的fail-closed尝试

<details>
<summary>查看原文（20行）</summary>

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
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 停止是否统一撤销权限，one-time声明与源码一致吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最强支持是/remote的HTTP和WS都在重发前核验设备，且不受requirePairingForLan放宽。限制有三层。第一，gate.ts注释明确官方某运行时没有api/gate发射者，监听器无法控制直接/api；该路径由宿主fence和browser-auth决定，作者说明已兑换浏览器凭据可在停止后仍有效。第二，accept源码不删除token，窗口内每次成功都会生成新设备；README新说明与源码一致，但package description仍称one-time，所以应以状态机而非营销措辞判断链接传播风险。第三，撤销是每请求语义，已在途操作可能完成；persistRevocation若保存和删旧文件都失败仅记录错误，不能无限外推为绝对持久撤销保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/gate.ts:12-17](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/src/gate.ts#L12-L17)

api/gate缺发射者的作者源码边界

```text
 * Cohort reality (0.1.2-alpha.2): NOTHING emits api/gate in the official
 * runtime, so this listener never fires there and direct /api is governed
 * solely by the harness fence + browser-auth cookie. The pairing gate with
 * real teeth lives on the plugin's own /remote channel (remote-api.ts); the
 * listener stays wired for cohort lines that do carry the seam, and the
 * README security model states the gap plainly.
```

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:472-509](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/src/pairing.ts#L472-L509)

bearer token可在有效窗口重复兑换

<details>
<summary>查看原文（38行）</summary>

```text
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

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/package.json:2-4](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/package.json#L2-L4)

包描述仍用one-time的声明

```text
  "name": "@linxin666/dsh-remote-web-ui",
  "description": "Scan-to-pair remote access for the dsh web GUI that shares one official interface: a QR beside the settings button pairs phones and PCs into the same Web GUI (a portrait-touch adaptation layer for phones, full desktop on PCs) through one-time tokens and revocable device sessions, with a LAN bind toggle, optional Cloudflare tunnel, and one-click family self-update",
  "version": "0.4.8",
```

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:363-373](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/src/pairing.ts#L363-L373)

两次文件系统失败仅记录错误

<details>
<summary>查看原文（11行）</summary>

```text
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
    }
```

</details>

**依据 5 · 作者声明**：[packages/dsh-remote-web-ui/README.md:182-192](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/README.md#L182-L192)

作者直接API、在途请求与持久化限制

<details>
<summary>查看原文（11行）</summary>

```text
- **Runtime reality: a LAN browser rides the `/remote` gateway, not the native `/api`.** This plugin never rebinds the web server, so the host stays on `127.0.0.1` and the harness's `/api` Host fence answers a LAN authority with 403. The forwarder makes the host reachable from the LAN, but only this plugin's own surfaces answer there: the pairing entry pages, the status view, and the gated `/remote` channel. Restoring native `/api` over a LAN authority needs the harness web server's `trustedHosts`, which is outside this package; an operator who binds the host to the network with `--host` gets that surface under the harness fence alone, because nothing in the official runtime emits the `api/gate` seam (verified against the 0.2.1-rc.3 packages installed by this repository). On such a deployment a browser credential a device has already redeemed survives 停止/取消配对 until its natural expiry (30 days) — revocation binds the `/remote` channel and the pairing cookie, not that credential. The plugin probes the `/api` posture and warns loudly; treat a network-exposed host bind as a deliberate decision, and prefer loopback plus tunnels when the machine is shared.
- **A paired device is a full-control credential.** With host mode active it reaches the complete host API — chat, sessions, settings, credentials, agent presets, deliverables — mirroring the SDK's own stance that a loopback desktop is trusted. Only the three control planes (pairing, self-update, plugin install/remove) stay physically local. Only pair devices you control; 停止 or per-device 取消配对 revokes immediately.
- **Control endpoints stay loopback-only; the status view answers a tunnel visitor minimally**: mint/stop/revoke/rename/merge, the device roster, the events stream, and the lan-bind status answer only to a desktop request (loopback socket and loopback Host, no forwarding header), and the gated channel keeps the self-update and plugin-install paths physically local. `/api/pair/status` is reachable through a tunnel, but a forwarded or unpaired caller receives only `{ ok, paired, requirePairingForLan, phase, lanAvailable }`; the full snapshot — token expiry, public tunnel URL, counts — and the per-device roster stay with the desktop. A LAN-origin browser sees the "配对面板仅限本机使用" banner.
- **A forwarding header makes a request remote (issue #1906), and only the operator may narrow that.** A reverse proxy in front of the host — a Cloudflare tunnel, frp, an nginx reverse proxy — dials `127.0.0.1:<port>` and rewrites the Host header to that upstream literal, so the origin sees a loopback socket and a loopback Host for a public request: both halves of the loopback classification hold and the pairing gate would wave it through. The fence therefore treats a request that carries `CF-Connecting-IP` or `X-Forwarded-For` as forwarded and never as local. The rule lives once in `shared/host/loopback.ts` (`isProxiedRequest`, consumed by `isLoopbackRequest`) and is applied by every synced copy. This package splits the question in two (issue #1919): `isLoopbackUpstream` (loopback socket and Host, forwarding headers deliberately ignored) only decides whether a Host can be answered at all, so a tunnel visitor reaches the pairing status and entry pages, while `isLoopbackClient` (no forwarding header) still guards the pairing gate, the `/api/pair` control planes and the desktop payload. No switch in this package admits a forwarded request to a credential-bearing surface; the sibling task-board plugin ships that narrow counter-case as its own default-off switch (`trustForwardedProxy`). A real desktop request (loopback socket, loopback Host, no forwarding header) still classifies as local; the browser same-origin markers are unchanged and still refuse a cross-site fetch. Residual: a proxy that strips both headers puts the request back in the same shape as the desktop, which no header-level rule can separate — configure the proxy to forward `X-Forwarded-For` (Cloudflare and nginx do by default), and note that a locally running process could always forge any header.
- **Background file uploads ride the channel too.** The official upload service prefers a Web Worker carrier whose own globals no main-thread patch reaches, so the boot patch (and the browser patch as a fallback) publishes the official pre-Cordis hook `__DSH_FILE_UPLOAD__` and hands it the patched `fetch`: the raw `/api/session/uploadFileBinary` POST is rewritten onto `/remote` and carries the device credential exactly like every other gated call. Without the hook a paired browser's uploads bypass the channel and the harness browser-auth fence answers 401 (issue #1580). The hook is only published on non-loopback origins, only while the channel is installed, and never overwrites a hook the page already owns.
- **The landing URL carries a one-time grant, never the device id.** `/pair-accept` mints a 256-bit, single-consume grant with a 60 s TTL and redirects to `/pair-app?grant=<g>`; the landing spends it — delete-on-attempt, so a replayed or expired grant resolves to nothing — and hands the device id to the shell in its own response. A device id is a live session credential, so it never enters a URL, the address bar, or any log on the redirect path. The pairing cookie is `Secure` whenever the request arrived over TLS (`x-forwarded-proto: https`) and plain over LAN HTTP, where a Secure cookie would simply be dropped by the browser. When a proxy rewrote the Host to its own loopback upstream and a public base URL is configured, the 303 names that public origin instead of the rewritten Host, because the literal the visitor presents is that visitor's loopback rather than this host's (issue #1919).
- **The app landing is cookieless-optional.** After pairing, the QR lands the device on `/pair-app`, served by this plugin: the official shell is delivered without passing the harness index gate, and the device credential rides a `x-dsh-remote-device` header (fetch) / `device` query (WebSocket upgrades) that the boot patch attaches from sessionStorage. The flow therefore works when the device browser blocks all cookies; the pairing cookie remains the primary credential where the browser stores it, and the harness browser-auth cookie is no longer required on the phone path at all.
- **A per-instance tunnel token can only run its own tunnel.** The control plane hands the `dsh-relay-<id>` tunnel's token only to a caller that proved possession of that id's secret; the plugin passes it to `cloudflared` through the `TUNNEL_TOKEN` environment variable and never through the command line, a log, or a settings file, so a local `ps` / proc listing cannot read it. A leaked token lets someone serve on that hostname but reaches no instance, no other instance, and no DNS record. The Worker-side Cloudflare API token is an account-level credential (Cloudflare Tunnel edit plus DNS edit on the zone), stored as a Worker secret only, never in the plugin, the settings docs, or a process listing; when it is not configured the claim endpoint fails closed with `503 cf-api-unconfigured` and creates no resource and no lease row.
- **Reopens are owned by a service worker (https origins).** A paired phone returning from history, a bookmark, or tab restore navigates to bare `/` — a path the plugin does not own, where the harness fallback seat answers with its browser-auth 401 (the cookieless flow never holds that credential). The app shell therefore registers `/pair-app.sw.js` (fenced like `/pair-app`; the script is inert logic with no secrets): it intercepts navigations to `/` only, re-serves the shell network-first through `/pair-app` — which re-validates the device cookie and refreshes its presence, so every reopen also keeps the session alive — falls back to the cached shell offline, and passes the navigation through when the plugin no longer answers (a revoked device then sees the harness response or the bilingual re-scan page). Plain-HTTP LAN origins are never secure contexts and never register the worker; there the shell keeps `/pair-app` in the address bar instead, so a refresh, a bookmark, or a tab restore re-validates the device cookie through the same device-gated landing (and reaches the bilingual re-pair page once that pairing is gone).
- **Revocation is per-request**: a paired device whose request is already in flight when 停止 lands completes that request; the next one 403s.
- **Paired device sessions persist by default**: device sessions (not the time-limited QR token) are written to `$DSH_HOME/remote-web-ui-devices.json` (0600, temp file + atomic rename). A paired cookie still works after a `dsh web` restart. Refreshing the QR still mints a new token; restarting does not restore the current QR. Sessions idle for `idleExpireMs` (default 30 days; the reopen service worker refreshes the window on every navigation it serves) are deleted and must pair again. Device ids are session credentials; a custom device name is display metadata stored in the same file and never participates in authorization. Override `devicesFile` with another absolute path when needed. Changing `cookieName` invalidates existing devices (expected). A revocation that cannot be written to disk (read-only DSH_HOME, a full disk) removes the stale store instead of leaving a revoked session on disk, so the next start cannot restore it.
```

</details>

#### 缺口

- 未做目标运行时全路径撤销矩阵
  **影响**：无法确认具体部署所有残留凭据与长连接结果
  **进一步探讨**：隔离实例逐测/remote、直接/api、WebSocket、在途任务、重启及存储失败

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 远程控制的前提和维护负担是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包声明DSH和Node版本，实际效果还依赖宿主fence、内层认证、网络来源、代理保留身份和设备存储。isLoopbackClient会拒绝有转发标记的请求；如果代理把远程请求改成无标记loopback，应用无法仅凭这些头区别本机与代理，作者已列为残余边界。公网relay还引入作者运营边缘设施的流量可见性，不能只因为配对在本机就称端到端私密。首次需核对bind和权限，持续需审核设备与SDK/UI升级，失败需对账认证和通道状态，费用与耗时未知。表格见[成本与效果](#cost-and-value)，运行条件见[依赖与流程](#dependencies-and-flow)。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/package.json:7-15](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/package.json#L7-L15)

Node和构建条件

```text
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "build": "tsc -b && tsdown",
    "test": "vitest run",
    "typecheck": "tsc -b --pretty false",
    "prepare": "tsdown --config tsdown.prepare.config.ts"
```

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/package.json:42-56](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/package.json#L42-L56)

宿主与client要求

<details>
<summary>查看原文（15行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/gate.ts:82-99](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/src/gate.ts#L82-L99)

代理身份与真实本机判定

<details>
<summary>查看原文（18行）</summary>

```text
 * Whether a request comes from the desktop loopback client: a loopback upstream
 * ({@link isLoopbackUpstream}) reached with no forwarding header. This is the
 * same decision the shared copy makes in `isLoopbackRequest` (sans the browser
 * same-origin markers, which the /api/pair routes apply separately through
 * `isTrustedApiRequest`), and it carries the same proxy rule: a reverse proxy
 * rewrites the Host to its own 127.0.0.1:<port> upstream and connects over
 * loopback, so a request that arrives with CF-Connecting-IP or X-Forwarded-For
 * is a forwarded one and is never the desktop (issue #1906). Every decision
 * that grants the desktop payload or a control plane (the api/gate listener,
 * the events stream, /api/pair/issue, /api/pair/stop, /api/pair/revoke,
 * /api/pair/lan-bind) reads this predicate, so the rule holds for all of them.
 * @param request - node HTTP request.
 * @returns true for a local desktop request with no proxy in front of it.
 */
export function isLoopbackClient(request: IncomingMessage): boolean {
  if (isProxiedRequest(request)) return false
  return isLoopbackUpstream(request)
}
```

</details>

**依据 4 · 作者声明**：[packages/dsh-remote-web-ui/README.md:185-197](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/README.md#L185-L197)

作者代理残余风险及relay信任说明

<details>
<summary>查看原文（13行）</summary>

```text
- **A forwarding header makes a request remote (issue #1906), and only the operator may narrow that.** A reverse proxy in front of the host — a Cloudflare tunnel, frp, an nginx reverse proxy — dials `127.0.0.1:<port>` and rewrites the Host header to that upstream literal, so the origin sees a loopback socket and a loopback Host for a public request: both halves of the loopback classification hold and the pairing gate would wave it through. The fence therefore treats a request that carries `CF-Connecting-IP` or `X-Forwarded-For` as forwarded and never as local. The rule lives once in `shared/host/loopback.ts` (`isProxiedRequest`, consumed by `isLoopbackRequest`) and is applied by every synced copy. This package splits the question in two (issue #1919): `isLoopbackUpstream` (loopback socket and Host, forwarding headers deliberately ignored) only decides whether a Host can be answered at all, so a tunnel visitor reaches the pairing status and entry pages, while `isLoopbackClient` (no forwarding header) still guards the pairing gate, the `/api/pair` control planes and the desktop payload. No switch in this package admits a forwarded request to a credential-bearing surface; the sibling task-board plugin ships that narrow counter-case as its own default-off switch (`trustForwardedProxy`). A real desktop request (loopback socket, loopback Host, no forwarding header) still classifies as local; the browser same-origin markers are unchanged and still refuse a cross-site fetch. Residual: a proxy that strips both headers puts the request back in the same shape as the desktop, which no header-level rule can separate — configure the proxy to forward `X-Forwarded-For` (Cloudflare and nginx do by default), and note that a locally running process could always forge any header.
- **Background file uploads ride the channel too.** The official upload service prefers a Web Worker carrier whose own globals no main-thread patch reaches, so the boot patch (and the browser patch as a fallback) publishes the official pre-Cordis hook `__DSH_FILE_UPLOAD__` and hands it the patched `fetch`: the raw `/api/session/uploadFileBinary` POST is rewritten onto `/remote` and carries the device credential exactly like every other gated call. Without the hook a paired browser's uploads bypass the channel and the harness browser-auth fence answers 401 (issue #1580). The hook is only published on non-loopback origins, only while the channel is installed, and never overwrites a hook the page already owns.
- **The landing URL carries a one-time grant, never the device id.** `/pair-accept` mints a 256-bit, single-consume grant with a 60 s TTL and redirects to `/pair-app?grant=<g>`; the landing spends it — delete-on-attempt, so a replayed or expired grant resolves to nothing — and hands the device id to the shell in its own response. A device id is a live session credential, so it never enters a URL, the address bar, or any log on the redirect path. The pairing cookie is `Secure` whenever the request arrived over TLS (`x-forwarded-proto: https`) and plain over LAN HTTP, where a Secure cookie would simply be dropped by the browser. When a proxy rewrote the Host to its own loopback upstream and a public base URL is configured, the 303 names that public origin instead of the rewritten Host, because the literal the visitor presents is that visitor's loopback rather than this host's (issue #1919).
- **The app landing is cookieless-optional.** After pairing, the QR lands the device on `/pair-app`, served by this plugin: the official shell is delivered without passing the harness index gate, and the device credential rides a `x-dsh-remote-device` header (fetch) / `device` query (WebSocket upgrades) that the boot patch attaches from sessionStorage. The flow therefore works when the device browser blocks all cookies; the pairing cookie remains the primary credential where the browser stores it, and the harness browser-auth cookie is no longer required on the phone path at all.
- **A per-instance tunnel token can only run its own tunnel.** The control plane hands the `dsh-relay-<id>` tunnel's token only to a caller that proved possession of that id's secret; the plugin passes it to `cloudflared` through the `TUNNEL_TOKEN` environment variable and never through the command line, a log, or a settings file, so a local `ps` / proc listing cannot read it. A leaked token lets someone serve on that hostname but reaches no instance, no other instance, and no DNS record. The Worker-side Cloudflare API token is an account-level credential (Cloudflare Tunnel edit plus DNS edit on the zone), stored as a Worker secret only, never in the plugin, the settings docs, or a process listing; when it is not configured the claim endpoint fails closed with `503 cf-api-unconfigured` and creates no resource and no lease row.
- **Reopens are owned by a service worker (https origins).** A paired phone returning from history, a bookmark, or tab restore navigates to bare `/` — a path the plugin does not own, where the harness fallback seat answers with its browser-auth 401 (the cookieless flow never holds that credential). The app shell therefore registers `/pair-app.sw.js` (fenced like `/pair-app`; the script is inert logic with no secrets): it intercepts navigations to `/` only, re-serves the shell network-first through `/pair-app` — which re-validates the device cookie and refreshes its presence, so every reopen also keeps the session alive — falls back to the cached shell offline, and passes the navigation through when the plugin no longer answers (a revoked device then sees the harness response or the bilingual re-scan page). Plain-HTTP LAN origins are never secure contexts and never register the worker; there the shell keeps `/pair-app` in the address bar instead, so a refresh, a bookmark, or a tab restore re-validates the device cookie through the same device-gated landing (and reaches the bilingual re-pair page once that pairing is gone).
- **Revocation is per-request**: a paired device whose request is already in flight when 停止 lands completes that request; the next one 403s.
- **Paired device sessions persist by default**: device sessions (not the time-limited QR token) are written to `$DSH_HOME/remote-web-ui-devices.json` (0600, temp file + atomic rename). A paired cookie still works after a `dsh web` restart. Refreshing the QR still mints a new token; restarting does not restore the current QR. Sessions idle for `idleExpireMs` (default 30 days; the reopen service worker refreshes the window on every navigation it serves) are deleted and must pair again. Device ids are session credentials; a custom device name is display metadata stored in the same file and never participates in authorization. Override `devicesFile` with another absolute path when needed. Changing `cookieName` invalidates existing devices (expected). A revocation that cannot be written to disk (read-only DSH_HOME, a full disk) removes the stale store instead of leaving a revoked session on disk, so the next start cannot restore it.
- **The LAN edge never makes a request look local**: the forwarder discards the client's `Host` and every forwarding header it sends, then stamps the LAN authority it was reached at plus `X-Forwarded-For`, so the loopback upstream leg still arrives as a forwarded request and every fence that decides "is this the desktop" refuses it. Failing to take the LAN socket — the address went away after a network change, the port is taken — costs the LAN entry only: the loopback listener is never touched, the failure is logged and reported as `forward.error`, and nothing is written to a file, so a network change needs neither a profile edit nor a restart.
- **The desktop gate policy is public, and it is not an access control**: `/api/pair/status` exposes only the boolean `requirePairingForLan` policy so a remote desktop can choose the correct transport before its settings scope is available. The switch governs the bare `/api` surface only: turning it off lets an unpaired client use that surface under the harness's own fence, and it never loosens the `/remote` channel, which demands a paired credential unconditionally. This field is not a credential and does not expose tokens, devices, counts, or tunnel URLs; the minimal payload a tunneled caller receives is described under the control-endpoint rule above.
- **The device credential still rides the WebSocket query.** A WS handshake cannot carry headers from the Web API, so the cookieless credential travels as `?device=<id>`; the plugin's own `/remote` handler consumes it and never forwards it to the inner loopback request, but the origin access log, the relay Worker, and the Cloudflare edge still see a URL that authenticates as that device. Cookie-capable browsers authenticate the handshake by cookie instead. A short-lived single-use WS ticket is the planned replacement.
- **Quick-tunnel hostnames change per run**: a `trycloudflare.com` URL is random on every `cloudflared` start, so `publicBaseUrl` (or the auto tunnel) must be refreshed with it. The stable-hostname relay pins a fixed `<id>.dsh-market.com` origin in front of that ephemeral URL (default on with the auto tunnel); the named-tunnel mode (`tunnelToken`) is the own-domain alternative. The token itself is stored as a redacted settings secret — never logged, never echoed to the browser half.
- **The relay moves the origin, not the trust root**: with the relay on, the phone talks to `https://<id>.dsh-market.com`, a dsh-market Cloudflare Worker that looks up the instance's current tunnel URL and forwards request bytes verbatim — the pairing cookie and every application-level check stay on the instance, and the worker never terminates a pairing. What changes is the transit path: the relayed traffic passes infrastructure operated by the package author on Cloudflare's edge, so the author's worker can observe it — the same visibility Cloudflare itself has over a raw `trycloudflare.com` quick tunnel. The registry binds each id to a SHA-256 hash of a 256-bit secret (the plaintext lives only in `$DSH_HOME`, 0600), accepts only `*.trycloudflare.com` targets, rate-limits registrations, and stores nothing but the mapping; turn the relay off to leave the deployment entirely on the ephemeral origin.
```

</details>

#### 缺口

- 缺端到端网络、设备与维护成本实测
  **影响**：不能量化远程工作效率、断线恢复或公网费用
  **进一步探讨**：以真实跨设备任务记录配置、等待、复核、撤销和恢复投入并明确选择的传输路径

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样让撤销结果可核查，谁值得先试？

**研究主题**：新假设与验证、采用判断

#### 完整回答

现有设备表能撤销插件凭据，却不拥有宿主全部认证生命周期。因此提出按通道回读的撤销结果，将新请求拒绝、在途完成及其他凭据明确分开。实验矩阵包含默认loopback+LAN forwarder、手动网络bind、隧道代理、已有宿主浏览器凭据、HTTP与WS。比较单一停止状态与通道结果清单造成的误判和排查时间；无法查询宿主凭据的路径必须显示未知，不能假装“全部切断”。自有设备在无敏感实例上是可控试用，多用户权限或生产凭据统一撤销需求超出现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:150-191](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/src/remote-api.ts#L150-L191)

当前HTTP门禁可成为回读验收点

<details>
<summary>查看原文（42行）</summary>

```text
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

    const method = req.method ?? 'GET'
    if (!ALLOWED_METHODS.has(method)) {
      req.resume()
      res.writeHead(405).end()
      return
    }

    const url = new URL(req.url ?? '/', 'http://127.0.0.1')
    const inner = innerPathOf(url.pathname)
    if (inner === undefined) {
      req.resume()
      res.writeHead(404).end()
      return
    }
    const denied = loopbackOnlyDenial(inner)
    if (denied !== undefined) {
      req.resume()
      envelopeError(res, 403, 'invalid-request', 'forbidden', denied)
      return
    }

    const port = deps.port()
    if (port === undefined) {
      // The listener has not bound yet (a recompose pass): refuse instead of
      // minting an http://127.0.0.1:undefined target; the desktop retries.
      req.resume()
      envelopeError(res, 503, 'invalid-request', 'port-unbound', 'the local web server port is not bound yet; retry shortly')
      return
    }
    proxyLoopbackHttp(req, res, port, `${inner}${url.search}`, deps.auth)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:235-272](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/src/remote-api.ts#L235-L272)

WS握手另有门禁

<details>
<summary>查看原文（38行）</summary>

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
    }
    const port = deps.port()
    if (port === undefined) {
      // Same unbound-port refusal as the HTTP leg: no :undefined handshake.
      socket.write('HTTP/1.1 503 Service Unavailable\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    const inner = upgradeInnerPath(req.url, fallbackPath)
    const denied = loopbackOnlyDenial(inner.split('?')[0] ?? inner)
    if (denied !== undefined) {
      socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
      socket.destroy()
      return
    }
    // The inner handshake needs the browser-auth credential (the gateway
    // event-stream route enforces it); resolving it is async, so the
    // handshake bytes are written once it settles. A missing credential
    // proceeds as before — the gateway route then refuses.
    void Promise.resolve(deps.auth?.ready())
      .catch(() => undefined)
      .then((cookie) => {
        if (socket.destroyed) return
        proxyLoopbackUpgrade(req, socket, head, port, inner, typeof cookie === 'string' ? cookie : undefined)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/gate.ts:12-17](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-remote-web-ui/src/gate.ts#L12-L17)

宿主原生路径非组件完全所有

```text
 * Cohort reality (0.1.2-alpha.2): NOTHING emits api/gate in the official
 * runtime, so this listener never fires there and direct /api is governed
 * solely by the harness fence + browser-auth cookie. The pairing gate with
 * real teeth lives on the plugin's own /remote channel (remote-api.ts); the
 * listener stays wired for cohort lines that do carry the seam, and the
 * README security model states the gap plainly.
```

#### 缺口

- 通道探针的可靠性和用户误判样本未知
  **影响**：新方案为未验证恢复说明，不是更强权限承诺
  **进一步探讨**：先验证已知不同路径的预期拒绝，记录漏测与未知，再决定是否产品化

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
