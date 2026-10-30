# Remote Web UI

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[de02a7f](https://github.com/zhu1090093659/dsh-web/tree/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui)

<!-- BEGIN META -->
[![GitHub ★ 9,728](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C728&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 120,480](https://img.shields.io/static/v1?label=npm+30d&message=120%2C480&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui)
<!-- END META -->

> **功能**：DSH远程界面插件，让自有手机或电脑配对后操作同一官方Web实例，提供设备会话、移动适配和LAN/可选公网入口。

> **亮点**：把官方界面配对交接、新请求设备门禁和部署状态接为跨设备入口，grant与持久撤销fallback有实际机制；非新Agent/多租户安全。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：旧WS rawpipe可在撤销后继续承载新消息，不能只称在途HTTP；三路径deny不等宿主全部方法/凭据隔离。同版SSH启用时受配对代理可重塑loopback进入其路由/PTY，局部门卫非跨插件隔离。见[Q03](#research-q03)。

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
  - [Q01 · 什么人用它接续工作，本组件实际贡献和权限含义是什么？](#detail-section-11)
  - [Q02 · token、grant、设备凭据与内层宿主认证怎样串起来？](#detail-section-12)
  - [Q03 · 撤销、权限和组合路由有哪些不能扩大解释的边界？](#detail-section-13)
  - [Q04 · LAN、公网与关闭入口的真实行为和成本边界是什么？](#detail-section-14)
  - [Q05 · 怎样给出可回退采用，依赖、执行者、成本与效果如何列清？](#detail-section-15)
  - [Q06 · 什么方向值得证伪验证，什么时候只需修原组件？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：把官方DSH Web界面经配对交给自有手机/电脑操作，管理设备会话与入口状态；配对是完整主机控制，不是只读分享或工作区隔离。见[Q01](#research-q01)。

对照受控反向代理/VPN或远程桌面与人工退出清单；宿主UI/认证/TLS、relay和目标SSH等不全算本组件原创。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 配对/会话 | 窗口QR、一次grant、活设备表 | 广泛Host控制，非物理设备/工作区隔离 |
| 官方远程界面 | 手机/电脑同实例、同源重写 | 实际浏览器/SDK兼容未验 |
| HTTP/WS代理 | 鉴权后借内层cookie重发 | 旧WS不是逐帧鉴权；deny仅三路径前缀 |
| LAN/公网入口 | loopback边缘、可选relay/Cloudflare | relay默认true；TLS/三方信任和清理另核 |
| 状态/撤销 | 设备表/失效/探针与关闭caller | 不是所有凭据、长流和工作负载统一退出 |

**流程与依赖**

兼容宿主/Node、可信设备/实例/网络、正确LAN和状态写权限必需；relay等外部模式分开，SSH仅条件组合，非Remote启动前提。表见[Q05](#research-q05)。

加载前显式关relay/隧道/同步并核外联→受控LAN配自有设备→分别验新请求/旧mux/其他凭据→人工核连接/监听与任务后退出。步骤见[Q05](#research-q05)。

**效果与成本**

常驻Host/转发/长流、可选边缘、设备/升级和分通道恢复人工未知；默认relay与遥测是外联条件，不能按扫码或stop数算收益。表见[Q05](#research-q05)。

官方界面复用、新入口配对/门禁及局部部署清理有源码；手机实际可用、净省时与统一撤销/工作停止未证。效果表见[Q05](#research-q05)。

> **思考**：旧WS rawpipe可在撤销后继续承载新消息，不能只称在途HTTP；三路径deny不等宿主全部方法/凭据隔离。同版SSH启用时受配对代理可重塑loopback进入其路由/PTY，局部门卫非跨插件隔离。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把官方界面配对交接、新请求设备门禁和部署状态接为跨设备入口，grant与持久撤销fallback有实际机制；非新Agent/多租户安全。见[Q01](#research-q01)、[Q02](#research-q02)。

可借鉴先设备gate后内层cookie、grant consume再liveness、持久撤销失败删旧表及保留forward身份；rawpipe/其他凭据/布尔probe的边界须显式，不能把单点fail-closed泛化。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

旧WS rawpipe可在撤销后继续承载新消息，不能只称在途HTTP；三路径deny不等宿主全部方法/凭据隔离。同版SSH启用时受配对代理可重塑loopback进入其路由/PTY，局部门卫非跨插件隔离。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅自有受控设备、无敏感数据的独立可弃置实例，在加载前显式relay=false/autoTunnel=false/ingressSync=false且清不需的公网token/base，现场保留本机操作者和停Host/断网手段，先做受控LAN小样。核未配对拒绝、新HTTP/新WS、撤销后旧mux后续消息、store/重启及既有宿主凭据，不能把配对/心跳或stop状态当全部退出。身份/通道/任务或资源不明立即停用并人工切断核查，硬即时撤销、只读多用户与生产凭据统一控制需求先观察。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包核心配对/grant、HTTP/WS到内层认证、客户端接线、LAN/default relay控制及退出重要支路已核；同版SSH组合caller另保原件/条件依赖。非全宿主/密码学/公网后端/移动UI审计，未运行。仅建议预关公网、独立无敏感测试实例、自有设备且现场能停Host/断网的受控LAN小样；统一硬撤销/多租户/只读或生产要求者先观察。

- 已检查：作者 README、包清单、源码路径 packages/dsh-remote-web-ui/cordis.patch.yml、packages/dsh-remote-web-ui/package.json、packages/dsh-remote-web-ui/src/client/index.ts、packages/dsh-remote-web-ui/src/client/remote-channel.ts、packages/dsh-remote-web-ui/src/client/telemetry.ts、packages/dsh-remote-web-ui/src/gate.ts、packages/dsh-remote-web-ui/src/index.ts、packages/dsh-remote-web-ui/src/inner-auth.ts、packages/dsh-remote-web-ui/src/lan-bind-plan.ts、packages/dsh-remote-web-ui/src/lan-forward.ts、packages/dsh-remote-web-ui/src/loopback-proxy.ts、packages/dsh-remote-web-ui/src/pair-grant.ts、packages/dsh-remote-web-ui/src/pairing-access.ts、packages/dsh-remote-web-ui/src/pairing.ts、packages/dsh-remote-web-ui/src/posture.ts、packages/dsh-remote-web-ui/src/relay-bridge-connector.ts、packages/dsh-remote-web-ui/src/relay-connector.ts、packages/dsh-remote-web-ui/src/relay-control.ts、packages/dsh-remote-web-ui/src/remote-api.ts、packages/dsh-remote-web-ui/src/remote-channel-rules.ts、packages/dsh-remote-web-ui/src/remote-methods.ts、packages/dsh-remote-web-ui/src/routes.ts、packages/dsh-remote-web-ui/src/tunnel-plan.ts、packages/dsh-ssh/src/engine.ts、packages/dsh-ssh/src/engine/pty.ts、packages/dsh-ssh/src/engine/terminal-sessions.ts、packages/dsh-ssh/src/loopback.ts、packages/dsh-ssh/src/protocol.ts、packages/dsh-ssh/src/routes.ts 及固定范围 inventory；组件：packages/dsh-remote-web-ui。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本子包manifest/bundle、host/client实际入口、token/grant/store、pair控制与官方shell、remote HTTP/WS/inner auth/header、权限/退出、LAN plan/forward/firewall caller、默认relay claim/bridge和tunnel/ingress控制入口、posture/遥测；同固定SSH routes/protocol/loopback/registry/engine/PTY仅条件组合。未全审实际宿主所有权限/事件/凭据、TLS/密码学、云端relay/Cloudflare与全部binary/进程清理、移动CSS/Service Worker/浏览器兼容，不执行目标。
- 下一步：后续固定隔离部署对照受控远程/人工清单，测token/grant/新请求与旧mux、撤销期间async握手、FS失败、其他凭据、LAN/显式bind和退出工作负载；记录误授权/退出误报/恢复分钟，必要时停测试Host而不重放未知写任务。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.12（[固定提交 de02a7f](https://github.com/zhu1090093659/dsh-web/tree/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先验证设备绑定连接关闭与分通道退出回执、probe未知状态细化；既有posture/撤销机制保留，简单原组件修复/人工清单够用就否定独立产品。见[Q06](#research-q06)。

后续固定隔离部署对照受控远程/人工清单，测token/grant/新请求与旧mux、撤销期间async握手、FS失败、其他凭据、LAN/显式bind和退出工作负载；记录误授权/退出误报/恢复分钟，必要时停测试Host而不重放未知写任务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 482 | — | — | 20280 |
| .ts | source | 51 | 15533 | 8953 | 5724 | — |
| .tsx | source | 10 | 2567 | 1927 | 534 | — |
| .ts | test | 53 | 13221 | 9991 | 2700 | — |
| .tsx | test | 3 | 895 | 696 | 149 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 183](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=183&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 182](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=182&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定Remote Web UI的真实授权/代理/退出与部署边界能否支持可回退跨设备使用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么人用它接续工作，本组件实际贡献和权限含义是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本项是原生双半区插件@linxin666/dsh-remote-web-ui 0.4.12，Apache-2.0，声明DSH>=0.2.1-rc.3、Node ^22.19或>=24、host/client和bundle。面向希望用自己的手机或另一台电脑操作同一DSH实例的用户，复用官方Web界面，提供配对/设备会话、移动适配和LAN/可选公网通道。不是新的Agent、独立移动端工作流或只读分享；配对是广泛主机控制凭据，不能交给不可信协作者当租户隔离。

基线是自配受控反向代理/VPN或远程桌面、另维护一套移动界面。增量在官方UI复用、配对到设备会话、grant交接、先门禁再环回转发、设备/通道状态和入口部署适配；底层宿主认证、RPC/官方界面、TLS/Cloudflare/relay服务及同仓库其他插件不都归本组件原创。能否成功应同时看正确实例/设备可用、未配对拒绝、新访问撤销、已有长连接和工作负载的实际退出，不按扫码或一个stop状态验收。

实际host创建PairingService，注册pairing与/remote HTTP及明确WS升级路径，持续挂api/gate监听并按配置同步通道。client apply启动移动适配、locale/设置绑定和侧栏入口，syncChannel采用已有parse-time boot patch或installRemoteChannel，而后者实际patch fetch/WebSocket等同源访问；pair-app由本机取官方index shell后按当前设备插捕获脚本。代码接线不是mock页面，但真实手机布局、资源加载、SDK协议与网络性能未实测，不能称所有浏览器已可用。

旧正式6b984b10950f78f1f4a5b5adf4c16636b5e6113d五题、findings和自代码依赖已完整读作线索。本轮重新核当前一次性grant、默认relay/bridge和已有WS原始管道，不能沿旧稿仅把撤销限制写成“在途请求可能完成”。没有启动监听、配对、隧道、目标代码/测试或实际利用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/package.json:1-46](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/package.json#L1-L46)

0.4.12、Node/DSH、双入口和Apache-2.0。

<details>
<summary>查看原文（46行）</summary>

```text
{
  "name": "@linxin666/dsh-remote-web-ui",
  "description": "Scan-to-pair remote access for the dsh web GUI that shares one official interface: a QR beside the settings button pairs phones and PCs into the same Web GUI (a portrait-touch adaptation layer for phones, full desktop on PCs) through one-time tokens and revocable device sessions, with a LAN bind toggle, optional Cloudflare tunnel, and one-click family self-update",
  "version": "0.4.12",
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "build": "tsc -b && tsdown",
    "test": "vitest run",
    "typecheck": "tsc -b --pretty false",
    "prepare": "tsdown --config tsdown.prepare.config.ts"
  },
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
    "./package.json": "./package.json"
  },
  "files": [
    "lib/**/*.js",
    "lib/**/*.js.map",
    "lib/**/*.d.ts",
    "lib/**/*.d.ts.map",
    "src",
    "assets",
    "cordis.patch.yml",
    "icon.svg"
  ],
  "license": "Apache-2.0",
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:951-996](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L951-L996)

实际pair/remote路由、upgrades及api/gate挂载。

<details>
<summary>查看原文（46行）</summary>

```text
    ...makeRoutes({
      service,
      requirePairingForLan: () => resolve().requirePairingForLan,
      pairingSource: () => resolve().pairingSource,
      lanBindStatus,
      indexDocument: fetchAppShell,
      trustedHosts: () => {
        const list: string[] = []
        const envHosts = process.env.DSH_REMOTE_TRUSTED_HOSTS
        if (typeof envHosts === 'string' && envHosts.trim() !== '') {
          for (const item of envHosts.split(',')) {
            const trimmed = item.trim()
            if (trimmed !== '') list.push(trimmed)
          }
        }
        const cfgHosts = resolve().trustedHosts
        if (Array.isArray(cfgHosts)) {
          for (const item of cfgHosts) {
            if (typeof item === 'string') {
              const trimmed = item.trim()
              if (trimmed !== '') list.push(trimmed)
            }
          }
        }
        return list
      },
    }),
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

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/client/index.ts:186-218](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/client/index.ts#L186-L218)

移动适配/遥测/locale实际apply。

<details>
<summary>查看原文（33行）</summary>

```text
export function apply(ctx: ClientContext): void {
  // Portrait-touch adaptation of the official UI: installed under the plugin
  // lifecycle so disabling the plugin in cordis patch (disabled: true) never
  // injects mobile CSS, gesture hooks, or the whale floating button.
  startMobileAdapt()
  ctx.effect(() => () => {
    ;(window as unknown as { __dshRemoteAdapt?: RemoteAdaptGlobal }).__dshRemoteAdapt?.setEnabled?.(false)
  }, 'remote-web-ui: mobile-adapt')

  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-remote-web-ui' }])

  ctx.effect(() => {
    try {
      return ctx.locale.register(NS, { zh, en })
    } catch {
      return () => {}
    }
  }, 'remote-web-ui: dictionaries')

  // The mobile adapt's whale button expands the collapsed sidebar and the
  // activation closes the details panel — both through the official layout
  // service (ctx.layout.toggleSidebar / closeDetails flip the panel state;
  // the narrow-viewport semantics open the drawer).
  const layout = ctx.get('layout') as { toggleSidebar?: () => void; closeDetails?: () => void } | undefined
  const adapt = (window as unknown as { __dshRemoteAdapt?: RemoteAdaptGlobal }).__dshRemoteAdapt
  // The official layout face throws (by contract) when the root entry has
  // not mounted yet; these closures also fire from gestures racing that
  // first mount, so they tolerate the throw instead of surfacing it.
  const layoutCall = (call: (() => void) | undefined): void => {
    try {
      call?.()
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/client/index.ts:380-419](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/client/index.ts#L380-L419)

client真实安装/接管remote channel。

<details>
<summary>查看原文（40行）</summary>

```text
  const channelActive = (): boolean => remoteChannelRequired(
    pageOriginFacts(window),
    settingsForm.getSnapshot(),
    hostPairingPolicy,
  )
  // The parse-time boot patch (issue #987), when the served index carried
  // it: already installed before any boot entry ran, so adopting its seat
  // beats patching a second time (which would double-rewrite onto
  // /remote/remote/...).
  const bootSeat = (): RemoteChannelBootSeat | undefined =>
    (window as unknown as Record<string, RemoteChannelBootSeat | undefined>)[REMOTE_CHANNEL_BOOT_GLOBAL]
  const syncChannel = (): void => {
    const transition = channelTransition(channelActive(), disposeChannel !== undefined)
    if (transition === 'install') {
      const seat = bootSeat()
      if (seat !== undefined) {
        seat.onUnpaired = handleUnpaired
        seat.onPaired = hideFenceNotice
        // Replay a signal raised before adoption (early unpaired responses).
        if (seat.pendingUnpaired) {
          seat.pendingUnpaired = false
          handleUnpaired()
        }
        disposeChannel = ctx.effect(() => () => {
          seat.onUnpaired = null
          seat.onPaired = null
        }, 'remote-web-ui: remote desktop channel (boot patch)')
      } else {
        disposeChannel = ctx.effect(() => {
          const restore = installRemoteChannel(window, { onUnpaired: handleUnpaired, onPaired: hideFenceNotice })
          return restore
        }, 'remote-web-ui: remote desktop channel')
      }
    } else if (transition === 'retire' && disposeChannel !== undefined) {
      disposeChannel()
      disposeChannel = undefined
      // Retire the provisional parse-time install with the channel: the
      // desktop now rides plain /api, so the rewrite must go (its seat
      // removes the global; a later re-activation patches afresh).
      bootSeat()?.restore()
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/client/remote-channel.ts:279-310](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/client/remote-channel.ts#L279-L310)

真实fetch/WebSocket路径重写。

<details>
<summary>查看原文（32行）</summary>

```text
  const patchedFetch: typeof globalThis.fetch = (input, init) => {
    const url = new URL(
      typeof input === 'string' || input instanceof URL ? input.toString() : input.url,
      window.location.href,
    )
    if (sameOrigin(url) && shouldRewriteFetchPath(url.pathname)) {
      const rewritten = new URL(url)
      rewritten.pathname = rewritePath(url.pathname)
      const next: RequestInfo | URL = typeof input === 'string' || input instanceof URL
        ? rewritten.toString()
        : new Request(rewritten, input)
      return Promise.resolve(originalFetch.call(window, next, attach(init))).then(async (response) => {
        // The clone tees the response body; only the 403 branch inspects it, so
        // every other status skips the copy (a large upload or session dump
        // would otherwise be duplicated per gated request).
        if (response.status === 403 && await isUnpairedDenied(response.clone())) options.onUnpaired?.()
        else options.onPaired?.()
        return response
      })
    }
    return originalFetch.call(window, input, init)
  }

  class PatchedWebSocket extends OriginalWebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      const parsed = new URL(url.toString(), window.location.href)
      const wsOrigin = parsed.protocol === 'wss:' ? `https://${parsed.host}` : parsed.protocol === 'ws:' ? `http://${parsed.host}` : ''
      if (wsOrigin !== '' && wsOrigin === window.location.origin && shouldRewriteWsPath(parsed.pathname)) {
        const rewritten = new URL(parsed)
        rewritten.pathname = rewritePath(parsed.pathname)
        super(withDeviceQuery(rewritten), protocols)
        return
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:1174-1216](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/routes.ts#L1174-L1216)

按活设备发官方shell的实际链。

<details>
<summary>查看原文（43行）</summary>

```text
  const handleAppPage = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!requireMethod(req, res, 'GET')) return
    if (!lanFence(req, true)) {
      logEntryRefusal(req, PAIR_PATHS.appPage, 'untrusted-host')
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('forbidden')
      return
    }
    if (rateLimitAccept(req, 'page')) {
      res.writeHead(429, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('rate limited')
      return
    }
    const url = new URL(req.url ?? '/', 'http://pair.invalid')
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
    }
    const html = await deps.indexDocument?.(id).catch(() => undefined)
    if (html === undefined) {
      res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
      res.end('remote device app unavailable')
      return
    }
    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'referrer-policy': 'no-referrer',
      'set-cookie': [deviceCookie(req, service.config.cookieName, id)],
    })
    res.end(patchAppShell(html, id, lanHop(req, id)))
```

</details>

#### 缺口

- 实际宿主/手机/浏览器兼容、跨设备任务收益和完整退出均未运行验证
  **影响**：只能支持自有设备/无敏感实验实例的有条件试用，不能推为生产远程信任或多用户产品
  **进一步探讨**：后续隔离实例对照原受控远程办法，测接续同一任务、误授权/退出、恢复分钟与移动交互，不以扫码数计收益。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · token、grant、设备凭据与内层宿主认证怎样串起来？

**研究主题**：功能与机制

#### 完整回答

本机POST issue先过loopbackFence与payload解析，再service.issue生成QR token；当前路由传undefined workspace，不能把配对看成工作区授权。默认token窗口10分钟、离线显示25秒、新准入设备cap4、闲置授权过期30天。issue替换旧token但不普遍撤掉既有设备；accept只查token存在/未stopped/未过期，每次有效兑换都新建deviceId，满额FIFO淘汰旧记录后persist，返回ok不代表落盘已成功。

应分开两种“单次”。QR token是窗口内可重复兑换的bearer，不是首次用后立即消耗；pair-accept成功后另发默认60秒、表cap256的一次性grant，303到/pair-app?grant=…并设置设备cookie。grant.consume先delete再校验，app handler还touchDevice确认活session，才取官方shell、插当前deviceId到sessionStorage并设置host-grant标记；过期/重用grant不恢复被撤销设备。新的landing不把长期deviceId直接放地址栏，但这不等所有协议永不携带URL凭据。

HTTP /remote handler先取cookie优先、否则专用x-dsh-remote-device header中的ID并touch；未配对403发生在代理前，requirePairingForLan=false也不能放宽这条门槛。随后校验允许method、路径段和三类local-only前缀，检查当前port，再proxyLoopbackHttp。WS对明确升级路径在握手时校验cookie/header或device query，去掉device参数后进入环回升级；端口未就绪返回503而非拼错目标。

内层createInnerAuth从ctx.connection.authenticatedUrl取得127.0.0.1的launch URL，manual redirect兑换并缓存宿主browser-auth cookie；缺失/失败可无cookie尝试，宿主是否接受由内层决定，HTTP 401会invalidate供下次重取。HTTP代理剥原Cookie、Origin和转发标记等，重写Host为127.0.0.1、sec-fetch-site为same-origin并附内层cookie；WS手工重建Host/升级头、附内层cookie后直接pipe。设备门禁必须在此提权式重发之前，不能把内层loopback当最终用户本机。

设备store以随机tmp+0600参数写入rename，touch更新lastSeen并由sweep刷盘；stop清token和设备表，revoke删一项，持久撤销写失败会尝试删除旧文件。这里是本插件会话生命周期，不是宿主所有browser凭据、既有传输或已发Agent/SSH工作的统一撤回。普通cookie有HttpOnly/SameSite=Lax，HTTPS才加Secure；同时sessionStorage/header/query路径意味着不应把整个设备凭据体系当仅HttpOnly。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:741-741](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/routes.ts#L741-L741)

本机控制面实际loopback+browser markers门卫。

```text
  const loopbackFence = (req: IncomingMessage): boolean => isLoopbackClient(req) && isTrustedApiRequest(req, [])
```

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:841-859](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/routes.ts#L841-L859)

issue真实caller且workspace参数undefined。

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

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:274-294](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L274-L294)

默认token/offline/cap/idle配置及relay等。

<details>
<summary>查看原文（21行）</summary>

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
  pairingSource: z.union([...PAIRING_SOURCE_OPTIONS]).default('auto').volatile(),
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:457-482](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pairing.ts#L457-L482)

issue替换token/状态。

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

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:495-523](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pairing.ts#L495-L523)

accept复用窗口、FIFO和忽略persist返回。

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

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/pair-grant.ts:25-37](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pair-grant.ts#L25-L37)

真正一次性grant短寿命与cap。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Default grant lifetime. The grant only has to survive one redirect chain
 * from the accept page to the app landing, tunnel round trips included, so it
 * is far shorter than the device session it stands in for.
 */
export const DEFAULT_PAIR_GRANT_TTL_MS = 60_000

/**
 * Cap on live grants. The accept page is rate-limited per source, but the
 * table is still caller-driven, so it stays bounded (oldest evicted first)
 * exactly like the device table.
 */
export const MAX_LIVE_GRANTS = 256
```

</details>

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/pair-grant.ts:105-125](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pair-grant.ts#L105-L125)

consume/peek真实语义。

<details>
<summary>查看原文（21行）</summary>

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
    },
    peek(grant: string | undefined): string | undefined {
      if (grant === undefined || grant === '') return undefined
      const at = now()
      const entry = entries.get(grant)
      if (entry === undefined) return undefined
      if (entry.expiresAt <= at) {
        entries.delete(grant)
        return undefined
      }
      return entry.deviceId
```

</details>

**依据 8 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:1150-1216](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/routes.ts#L1150-L1216)

grant交接、touch及官方shell。

<details>
<summary>查看原文（67行）</summary>

```text
    // Land the paired device on the cookieless app page: the official shell
    // served by this plugin. The URL carries a one-time grant, never the
    // device id - a session credential must not travel in a URL (history, the
    // address bar, every log on the redirect path) - and the landing's own
    // response hands the device id to the shell. No harness index gate, no
    // browser-auth cookie hop: the channel gate accepts the device credential
    // whether or not the browser stores cookies.
    const { grant } = grants.issue(result.deviceId)
    res.writeHead(303, {
      location: `${redirectOrigin(req)}/pair-app?grant=${encodeURIComponent(grant)}`,
      'cache-control': 'no-store',
      'referrer-policy': 'no-referrer',
      'set-cookie': [deviceCookie(req, service.config.cookieName, result.deviceId)],
    })
    res.end()
  }

  /**
   * The cookieless app landing. A paired device (a one-time grant minted by
   * /pair-accept, or a live pairing cookie on a reopen) receives the official
   * index shell patched with the device-capture script; the shell itself is
   * the official document and carries no data, so serving it needs only the
   * device credential.
   */
  const handleAppPage = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    if (!requireMethod(req, res, 'GET')) return
    if (!lanFence(req, true)) {
      logEntryRefusal(req, PAIR_PATHS.appPage, 'untrusted-host')
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('forbidden')
      return
    }
    if (rateLimitAccept(req, 'page')) {
      res.writeHead(429, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('rate limited')
      return
    }
    const url = new URL(req.url ?? '/', 'http://pair.invalid')
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
    }
    const html = await deps.indexDocument?.(id).catch(() => undefined)
    if (html === undefined) {
      res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
      res.end('remote device app unavailable')
      return
    }
    res.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'referrer-policy': 'no-referrer',
      'set-cookie': [deviceCookie(req, service.config.cookieName, id)],
    })
    res.end(patchAppShell(html, id, lanHop(req, id)))
```

</details>

**依据 9 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:337-368](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/routes.ts#L337-L368)

device capture/sessionStorage及标记。

<details>
<summary>查看原文（32行）</summary>

```text
export function appShellCaptureScript(deviceId: string): string {
  const safeId = JSON.stringify(deviceId)
  const grantGlobal = JSON.stringify(REMOTE_HOST_GRANT_GLOBAL)
  const reopenPath = JSON.stringify(PAIR_PATHS.appPage)
  const register = `try{if('serviceWorker' in navigator){navigator.serviceWorker.register(${JSON.stringify(PAIR_PATHS.appServiceWorker)},{scope:'/'}).catch(function(e){})}}catch(e){}`
  return `<script>(function(){try{sessionStorage.setItem(${JSON.stringify(APP_DEVICE_STORAGE_KEY)},${safeId});}catch(e){}try{history.replaceState(null,'',window.isSecureContext?'/':${reopenPath})}catch(e){}try{window[${grantGlobal}]=true}catch(e){}${register}})()</script>`
}

/**
 * Patch the official index document with the device-capture script. The script
 * goes immediately after the opening <head> tag, ahead of the harness-injected
 * parse-time channel boot patch: that patch installs the transport host-mode
 * hook only when this server-served marker is already set (see
 * remote-channel-boot.ts), so host mode is granted by the device-gated landing
 * instead of being asserted from the origin.
 *
 * A landing reached on a base other than the machine's own LAN origin also
 * carries the source-decision script (lan-source.ts): the phone decides at
 * connect time whether a LAN candidate answers, and switches its origin when
 * one does. It runs after the capture script so the granted page is fully
 * usable before the probe's outcome can move it.
 * @param html - the official index document.
 * @param deviceId - the device session this landing is being served for.
 * @param hop - the LAN candidates to probe, when a switch is possible.
 * @returns the patched document.
 */
export function patchAppShell(html: string, deviceId: string, hop?: LanSourceHop): string {
  const script = appShellCaptureScript(deviceId) + (hop === undefined ? '' : appShellLanSwitchScript(hop))
  const head = /<head[^>]*>/i.exec(html)
  if (head === null) return script + html
  const end = head.index + head[0].length
  return html.slice(0, end) + script + html.slice(end)
```

</details>

**依据 10 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:132-194](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/remote-api.ts#L132-L194)

HTTP先设备门禁再代理，path/method/port限制。

<details>
<summary>查看原文（63行）</summary>

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
  }

  return [{ kind: 'prefix', path: REMOTE_PREFIX, handler }]
```

</details>

**依据 11 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:232-279](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/remote-api.ts#L232-L279)

WS握手设备检查和async inner auth。

<details>
<summary>查看原文（48行）</summary>

```text
export function makeRemoteApiUpgradeRoutes(deps: RemoteApiDeps): WebUpgradeRoute[] {
  const { service } = deps

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
      })
  }

  return REMOTE_UPGRADE_PATHS.map((path) => ({
    path,
    handler: handlerFor(path.slice(REMOTE_PREFIX.length)),
  }))
```

</details>

**依据 12 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:908-922](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L908-L922)

inner auth实际从宿主服务取URL。

<details>
<summary>查看原文（15行）</summary>

```text
  // The process's inner browser credential: the proxied /api re-issues to
  // 127.0.0.1, where the connection route enforces the harness browser-auth
  // cookie (authority-bound; no loopback exemption on this cohort), so a
  // device's own cookie can never satisfy the inner check. The plugin
  // redeems its own launch token once and attaches the cookie to inner
  // requests; the credential is only ever exercised behind the pairing gate
  // in remote-api.ts.
  const innerAuth = createInnerAuth(() => {
    if (!Number.isFinite(ctx.webServer.port)) return undefined
    try {
      return (ctx.connection as { authenticatedUrl?: (base: string) => string }).authenticatedUrl?.(`http://127.0.0.1:${String(ctx.webServer.port)}/`)
    } catch {
      return undefined
    }
  })
```

</details>

**依据 13 · 源码核查**：[packages/dsh-remote-web-ui/src/inner-auth.ts:37-84](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/inner-auth.ts#L37-L84)

兑换/缓存/invalidate。

<details>
<summary>查看原文（48行）</summary>

```text
export function createInnerAuth(
  launchUrl: () => string | undefined,
  fetchImpl: typeof fetch = fetch,
): InnerAuth {
  let cached: string | undefined
  let inflight: Promise<string | undefined> | undefined

  const redeem = async (): Promise<string | undefined> => {
    const url = launchUrl()
    if (url === undefined) return undefined
    try {
      // redirect: 'manual' keeps the 303's set-cookie readable instead of
      // following it; the exchange itself is a plain GET with the token in
      // the query, exactly what a first browser visit performs.
      const response = await fetchImpl(url, { redirect: 'manual' })
      const raw = response.headers.get('set-cookie')
      if (raw === null) return undefined
      // Generated cookie values are base64url and never contain commas, so a
      // comma split followed by a prefix match finds the browser-auth entry
      // even when the exchange sets several cookies.
      const entry = raw
        .split(',')
        .map((part) => part.trim())
        .find((part) => part.startsWith(BROWSER_AUTH_COOKIE_PREFIX))
      if (entry === undefined) return undefined
      const pair = entry.split(';')[0]?.trim()
      return pair !== undefined && pair.includes('=') ? pair : undefined
    } catch {
      return undefined
    }
  }

  return {
    ready(): Promise<string | undefined> {
      if (cached !== undefined) return Promise.resolve(cached)
      inflight ??= redeem().then((value) => {
        if (value !== undefined) cached = value
        inflight = undefined
        return value
      }, () => {
        inflight = undefined
        return undefined
      })
      return inflight
    },
    invalidate(): void {
      cached = undefined
    },
```

</details>

**依据 14 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:115-131](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L115-L131)

HTTP下游loopback/同源头重塑。

<details>
<summary>查看原文（17行）</summary>

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
  return headers
```

</details>

**依据 15 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:231-273](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L231-L273)

WS内层cookie、握手与raw pipe。

<details>
<summary>查看原文（43行）</summary>

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
  })
```

</details>

**依据 16 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:344-381](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pairing.ts#L344-L381)

持久化与revocation失败后尝试删旧文件。

<details>
<summary>查看原文（38行）</summary>

```text
  private persist(): boolean {
    const file = this.config.devicesFile
    if (file === undefined) return true
    try {
      mkdirSync(dirname(file), { recursive: true })
      const temp = `${file}.${process.pid}.${randomBytes(4).toString('hex')}.tmp`
      const payload: Record<string, DeviceSession> = {}
      for (const [id, session] of this.devices) payload[id] = session
      writeFileSync(temp, JSON.stringify(payload), { mode: 0o600 })
      renameSync(temp, file)
      this.dirty = false
      return true
    } catch (error) {
      console.error('remote-web-ui: failed to persist paired devices', error)
      return false
    }
  }

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

**依据 17 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:531-550](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pairing.ts#L531-L550)

stop/revoke实际内存动作。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 18 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:1333-1335](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/routes.ts#L1333-L1335)

cookie真实标记。

```text
export function deviceCookie(req: IncomingMessage, cookieName: string, deviceId: string): string {
  const secure = isHttpsRequest(req) ? '; Secure' : ''
  return `${cookieName}=${deviceId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${String(COOKIE_MAX_AGE_SEC)}${secure}`
```

#### 缺口

- 宿主authenticatedUrl/browser-auth协议与所有cookie阻断/资源请求组合未独立运行
  **影响**：本包授权/代理链存在不等全浏览器或全部宿主版本兼容，更不等OS或工作区最小权限
  **进一步探讨**：隔离实例逐步验token/grant、Cookie/header/WS query、新请求/旧流与重启；缺内层认证/返回异常先停，不放宽配对门槛绕过。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 撤销、权限和组合路由有哪些不能扩大解释的边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最重要的区别是请求和连接。HTTP每次入/remote查活设备，新WS握手也查；但升级后loopback-proxy直接双向raw pipe，没有device→socket注册、撤销监听或逐帧liveness检查。pair stop/revoke handler只是service.stop/revoke；清表后新握手会拒绝，既有mux却可能继续传后续新消息、SSH终端输入等，不限于先前在途HTTP完成。确切后续效果依赖连接仍存活、内层路由与宿主授权，未运行；不能把UI退出/心跳失败或stopped绿状态当服务端硬切证明。握手先校验再异步等innerAuth，期间撤销也没有在forward前重查设备，亦属于该连接生命周期缺口。

本包local-only实际表只有/api/pair、/api/update、/api/plugin-manager三前缀，并由HTTP/升级的路径handler检查。remote-methods注释提four planes/host power，不是第四条真实规则；全组件定向检索未找到额外host-power或mux消息方法过滤。此处只证明三HTTP前缀的拒绝，不能扩大为宿主所有RPC安装/电源方法或通用Agent工具副作用都被限制；宿主是否提供那些方法及权限本轮未核，既不声称可调用/已绕过，也不声称已保护。配对仍按完整控制信任处理，不是只读/租户/工作区隔离。

同固定版本的组合链可具体闭合：若额外启用了SSH 0.4.12，Remote升级表含/remote/api/dsh-ssh/terminal，认证后剥device query并用127.0.0.1 Host/内层cookie重建握手；SSH实际/api/dsh-ssh/terminal路由只查本包loopback，再open/attach TerminalSessionRegistry→engine.openShell→独立PTY client.shell。HTTP代理也去掉Origin/转发标记、造same-origin，SSH的本机HTTP门卫会见到代理这一跳而非原手机。因此SSH局部“无直接paired-cookie allow”不能当此组合不可达。六份同提交SSH原件保在DEPENDENCY-SSH.json，只作条件化组合依赖，不把SSH实现归本组件或称实际利用；Remote核心配对不要求安装SSH。SSH socket断开还可能只是PTY detach，远端工作与输入通道应分别验收。

api/gate只是本包挂的宿主事件监听器；是否发射、原生/api是否可由其他browser凭据访问取决于具体宿主。作者兼容说明承认某cohort无emitter，代码也会warn stop不撤已经兑换的宿主browser credential；这不是本轮对所有Host部署的独立断言。缺少同版本宿主端点/凭据矩阵，就不能说它统一撤销原生/api、全部旧cookie或绕过路径。

记录里的deviceId是bearer会话凭据，不是物理硬件身份。QR有效期内可多次兑换/挤出旧记录，device cap在admit时实施，restore故意不按当时cap裁剪；25秒offline是展示，闲置授权默认30天，不能把离线/设备数量当访问已切断。accept忽略persist失败且FIFO淘汰用普通persist，保存失败后重启可能恢复旧表；stop/revoke持久化失败虽尝试删旧文件，但两者都失败仅log，不能保证绝对持久撤销。

grant让landing地址不含长期deviceId是改进，但WS外部握手仍把device放query；只在内层升级时删掉，并不能清外部URL/中转日志。设备表明文+0600参数非加密/Windows ACL证明；客户端sessionStorage、完整控制UI及中转链需按敏感凭据处理。没有做泄露/竞态/攻击实验，不把这些条件说成已发生事故。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:150-159](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/remote-api.ts#L150-L159)

每HTTP新请求先查设备。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:235-272](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/remote-api.ts#L235-L272)

WS只握手/async auth后未重查。

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

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:231-273](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L231-L273)

raw pipe无device撤销/逐帧机制。

<details>
<summary>查看原文（43行）</summary>

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
  })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:940-972](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/routes.ts#L940-L972)

stop/revoke实际caller仅改service。

<details>
<summary>查看原文（33行）</summary>

```text
  const handleStop = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
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

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-methods.ts:38-89](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/remote-methods.ts#L38-L89)

真实升级表/三前缀，不继承four planes注释。

<details>
<summary>查看原文（52行）</summary>

```text
export const REMOTE_UPGRADE_PATHS = [
  REMOTE_API_PATHS.mux,
  `${REMOTE_PREFIX}/sidebar/ws/terminal`,
  `${REMOTE_PREFIX}/sidebar/ws/agent-terminals`,
  `${REMOTE_PREFIX}/sidebar/ws/agent-opens`,
  `${REMOTE_API_PREFIX}/dsh-ssh/terminal`,
] as const

/** Plugin-manager HTTP prefix: install/remove stay physically local. */
export const PLUGIN_MANAGER_PATH = '/api/plugin-manager'

/** Family settings-bridge HTTP prefix — re-exposed to paired devices (plain settings parity). */
export const WEB_UI_SETTINGS_BRIDGE_PATH = '/api/dsh-web-ui-settings'

/**
 * The cookieless device credential: the boot patch reads the device id from
 * the /pair-app URL, keeps it in sessionStorage, and attaches it to every
 * gated HTTP call as this header (and to WebSocket upgrades as the `device`
 * query parameter - WS handshakes cannot carry headers from the Web API).
 * The channel gate accepts it exactly like the device cookie, so the mobile
 * flow works even with browser cookies fully blocked; the cookie remains the
 * primary credential on normal browsers.
 */
export const REMOTE_DEVICE_HEADER = 'x-dsh-remote-device'
export const REMOTE_DEVICE_QUERY = 'device'

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
}
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:176-191](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/remote-api.ts#L176-L191)

HTTP路径拒绝与代理调用。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:212-223](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/remote-api.ts#L212-L223)

仅剥内层device query。

<details>
<summary>查看原文（12行）</summary>

```text
export function upgradeInnerPath(reqUrl: string | undefined, fallbackPath: string): string {
  if (reqUrl === undefined || reqUrl === '') return fallbackPath
  let url: URL
  try {
    url = new URL(reqUrl, 'http://127.0.0.1')
  } catch {
    return fallbackPath
  }
  const inner = innerPathOf(url.pathname)
  if (inner === undefined) return fallbackPath
  url.searchParams.delete(REMOTE_DEVICE_QUERY)
  return `${inner}${url.search}`
```

</details>

**依据 8 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:48-74](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L48-L74)

Origin/cookie/forward标记剥除。

<details>
<summary>查看原文（27行）</summary>

```text
const REQUEST_HEADER_DENYLIST = new Set([
  // hop-by-hop
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'expect',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  // rewritten by this proxy: the loopback authority and the tripwire marker
  'host',
  'sec-fetch-site',
  // the caller's own origin, its cookie jar, and the credential the gate consumed
  'origin',
  'referer',
  'cookie',
  'x-dsh-remote-device',
  // forwarding marks: a re-issued request is loopback, not forwarded
  'forwarded',
  'x-forwarded-for',
  'x-forwarded-host',
  'x-forwarded-port',
  'x-forwarded-proto',
  'x-real-ip',
  'cf-connecting-ip',
```

</details>

**依据 9 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:115-131](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L115-L131)

重塑loopback/同源下游请求。

<details>
<summary>查看原文（17行）</summary>

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
  return headers
```

</details>

**依据 10 · 源码核查**：[packages/dsh-ssh/src/protocol.ts:229-241](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/protocol.ts#L229-L241)

同固定SSH实际terminal路径。

<details>
<summary>查看原文（13行）</summary>

```text
export const SSH_API_BASE = '/api/dsh-ssh' as const

export const SSH_API = {
  hosts: SSH_API_BASE + '/hosts',
  importSshConfig: SSH_API_BASE + '/hosts/import-ssh-config',
  test: SSH_API_BASE + '/test',
  exec: SSH_API_BASE + '/exec',
  cluster: SSH_API_BASE + '/cluster',
  upload: SSH_API_BASE + '/upload',
  download: SSH_API_BASE + '/download',
  ls: SSH_API_BASE + '/ls',
  tunnel: SSH_API_BASE + '/tunnel',
  terminal: SSH_API_BASE + '/terminal',
```

</details>

**依据 11 · 源码核查**：[packages/dsh-ssh/src/routes.ts:452-492](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/routes.ts#L452-L492)

SSH loopback升级后open/attach真实caller。

<details>
<summary>查看原文（41行）</summary>

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
        if (sessionId !== undefined) {
          if (terminalSessions.attach(ws, sessionId, size)) return
          // The session was reaped or the host restarted: tell the view so it
          // can fall back to a fresh connect instead of sitting blank.
          const expired: TerminalServerFrame = { type: 'exit', code: null, error: 'terminal session expired' }
          try { ws.send(JSON.stringify(expired)) } catch { /* socket raced away */ }
          try { ws.close(1000) } catch { /* already closed */ }
          return
        }
        void terminalSessions.open(ws, alias as string, size)
      })
```

</details>

**依据 12 · 源码核查**：[packages/dsh-ssh/src/loopback.ts:72-91](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/loopback.ts#L72-L91)

SSH实际局部loopback门卫。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 13 · 源码核查**：[packages/dsh-ssh/src/engine/terminal-sessions.ts:81-102](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/terminal-sessions.ts#L81-L102)

SSH registry open实际调用openShell。

<details>
<summary>查看原文（22行）</summary>

```text
  async open(ws: WebSocket, alias: string, size: { cols: number; rows: number }): Promise<void> {
    const session: HostedTerminal = {
      id: randomBytes(9).toString('hex'),
      alias,
      sockets: new Set(),
      buffer: [],
      bufferBytes: 0,
      exited: false,
    }
    this.sessions.set(session.id, session)
    this.bind(ws, session)
    try {
      const shell = await this.deps.openShell(alias, size, this.keyboardInteractive(session))
      if (!this.sessions.has(session.id)) {
        // The session was ended (or the host torn down) while it connected.
        shell.close()
        return
      }
      session.shell = shell
      shell.onData = data => { this.pushOutput(session, data.toString('utf8')) }
      shell.onExit = (code, error) => { this.finish(session, code, error) }
      this.send(session, { type: 'ready', alias, sessionId: session.id })
```

</details>

**依据 14 · 源码核查**：[packages/dsh-ssh/src/engine.ts:106-112](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine.ts#L106-L112)

SSH engine实际转PTY。

```text
  /** Open a PTY shell session for the web terminal (standalone connection). */
  async openShell(
    alias: string,
    size: { cols: number; rows: number },
    onKeyboardInteractive?: KeyboardInteractiveHandler,
  ): Promise<ShellSession> {
    return openShell(this, alias, size, onKeyboardInteractive)
```

**依据 15 · 源码核查**：[packages/dsh-ssh/src/engine/pty.ts:32-61](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/pty.ts#L32-L61)

独立SSH连接client.shell和close。

<details>
<summary>查看原文（30行）</summary>

```text
export async function openShell(
  engine: PoolEngine,
  alias: string,
  size: { cols: number; rows: number },
  onKeyboardInteractive?: KeyboardInteractiveHandler,
): Promise<ShellSession> {
  const entry = engine.store.find(alias)
  if (entry === undefined) throw new Error('alias \'' + alias + '\' not found — add it first')
  const { client, hops } = await connectChain(engine, entry, onKeyboardInteractive)
  return await new Promise<ShellSession>((resolve, reject) => {
    client.shell({ term: 'xterm-256color', cols: size.cols, rows: size.rows }, (error, stream) => {
      if (error !== undefined) {
        try { client.end() } catch { /* closed */ }
        for (const hop of hops) { try { hop.end() } catch { /* closed */ } }
        reject(error)
        return
      }
      let tornDown = false
      const teardown = (): void => {
        if (tornDown) return
        tornDown = true
        try { client.end() } catch { /* closed */ }
        for (const hop of hops) { try { hop.end() } catch { /* closed */ } }
      }
      const session: ShellSession = {
        send: (data) => { try { stream.write(data) } catch { /* channel gone */ } },
        resize: (cols, rows) => { try { stream.setWindow(rows, cols, rows, cols) } catch { /* channel gone */ } },
        close: () => {
          try { stream.close() } catch { /* channel gone */ }
          teardown()
```

</details>

**依据 16 · 源码核查**：[packages/dsh-ssh/src/engine/terminal-sessions.ts:169-194](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/terminal-sessions.ts#L169-L194)

断socket的detach与显式end区别。

<details>
<summary>查看原文（26行）</summary>

```text

  /** Remove a socket from its session, keeping the shell alive. */
  private detach(ws: WebSocket): void {
    for (const session of this.sessions.values()) {
      if (!session.sockets.delete(ws)) continue
      if (session.sockets.size === 0) {
        // Nobody is watching: give the view a window to come back before the
        // remote shell is torn down (or, for an exited one, before its final
        // screen is dropped).
        this.scheduleReap(session, session.exited ? this.exitGraceMs : this.idleMs)
      }
      return
    }
  }

  /** End the session a socket is attached to (explicit close from the view). */
  private end(session: HostedTerminal, notify: boolean): void {
    this.clearReap(session)
    if (this.sessions.delete(session.id) && notify) {
      if (session.pendingAuthFinish !== undefined) {
        const finish = session.pendingAuthFinish
        session.pendingAuthFinish = undefined
        try { finish([]) } catch { /* the connect already failed */ }
      }
    }
    try { session.shell?.close() } catch { /* channel gone */ }
```

</details>

**依据 17 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:995-996](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L995-L996)

本包只挂api/gate listener。

```text
  const gate = makeGateListener(service, () => resolve().requirePairingForLan, () => resolve().enabled)
  ctx.effect(() => ctx.on('api/gate', gate), 'remote-web-ui: api gate')
```

**依据 18 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1095-1104](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L1095-L1104)

作者兼容cohort与其他browser凭据限制说明。

<details>
<summary>查看原文（10行）</summary>

```text
  /** One honest note that LAN exposure rests on pairing, not on the harness fence. */
  const warnLanExposure = (): void => {
    if (lanExposureWarned) return
    lanExposureWarned = true
    // Cohort honesty (see the README security model): the pairing gate covers
    // the plugin's own /remote channel; direct /api from LAN origins is
    // governed by the harness fence + browser-auth cookie, and this cohort's
    // api/gate seam has no emitter — so stop()/revoke() cannot invalidate a
    // browser credential a device has already redeemed.
    console.warn('remote-web-ui: LAN-exposed edge — pairing gates the /remote channel; direct /api stays under the harness fence + browser auth (stop() does not revoke an already-redeemed browser credential)')
```

</details>

**依据 19 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:277-317](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pairing.ts#L277-L317)

restore非cap裁剪。

<details>
<summary>查看原文（41行）</summary>

```text
   * Restore device sessions persisted by a previous process run. A corrupt
   * or missing file is tolerated (an empty device table, never a throw) —
   * persistence is an availability convenience, not a security boundary.
   *
   * Every still-valid session is restored, deliberately without applying
   * `maxDevices`: the constructor runs with whatever cap the configuration
   * layer has delivered so far (the schema default until the saved settings
   * row is applied), and trimming here would permanently drop authorizations
   * the user never revoked — the trimmed table reaches disk on the next
   * heartbeat/sweep write. The cap is enforced where a device is admitted
   * (see `accept`), against the configuration in force at that moment.
   */
  private loadPersisted(): void {
    const file = this.config.devicesFile
    if (file === undefined) return
    try {
      const saved = JSON.parse(readFileSync(file, 'utf8')) as unknown
      if (typeof saved !== 'object' || saved === null) return
      for (const [deviceId, session] of Object.entries(saved)) {
        if (typeof deviceId !== 'string') continue
        if (typeof session !== 'object' || session === null) continue
        const { createdAt, lastSeenAt, userAgent, name } = session as {
          createdAt?: unknown
          lastSeenAt?: unknown
          userAgent?: unknown
          name?: unknown
        }
        if (typeof createdAt !== 'number' || typeof lastSeenAt !== 'number') continue
        const label = typeof userAgent === 'string' ? sanitizeUserAgent(userAgent) : undefined
        const customName = typeof name === 'string' ? sanitizeDeviceName(name) : undefined
        this.devices.set(deviceId, {
          createdAt,
          lastSeenAt,
          ...(label !== undefined ? { userAgent: label } : {}),
          ...(customName !== undefined ? { name: customName } : {}),
        })
      }
      if (this.evictIdle()) this.persistRevocation()
    } catch {
      // Unreadable/corrupt: start empty rather than refusing to boot.
    }
```

</details>

**依据 20 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:495-523](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pairing.ts#L495-L523)

可重复token/FIFO与普通persist失败语义。

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

**依据 21 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:371-381](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pairing.ts#L371-L381)

撤销双重FS失败仅log。

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

**依据 22 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:725-736](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pairing.ts#L725-L736)

idle授权检查与offline展示区分。

<details>
<summary>查看原文（12行）</summary>

```text
  private liveSession(deviceId: string): DeviceSession | undefined {
    if (this.stopped) return undefined
    const session = this.devices.get(deviceId)
    if (session === undefined) return undefined
    const limit = this.config.idleExpireMs ?? DEFAULT_IDLE_EXPIRE_MS
    if (this.clock.now() - session.lastSeenAt > limit) {
      this.devices.delete(deviceId)
      this.persistRevocation()
      this.notify()
      return undefined
    }
    return session
```

</details>

#### 缺口

- 既有WS撤销后的实际Host行为、原生API/宿主其他凭据及跨版本方法级授权未核，FS失败未复现
  **影响**：不能给统一撤权/只读分享/多租户保证；仅有本地操作者可切断网络/停测试Host的无敏感实例试用
  **进一步探讨**：后续建立旧mux/SSH输入流，撤销后发送新的无害只读请求与新握手对照；分别核宿主其他凭据和工作负载，需硬切者先观察，不靠UI状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · LAN、公网与关闭入口的真实行为和成本边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

默认enabled=true、requirePairingForLan=true、autoTunnel=false、ingressSync=false，却relay=true。index在enabled+relay且port就绪时调用claimRelayLeaseFor→pair.start，即便没有quick tunnel也为bridge租约启动控制面路径；不是关autoTunnel就无外部通信/无relay。实际callee start默认选claimRelayLease并传本机identity/port/版本，claimRelayLease把请求交relayClaimBody后fetch PUT https://dsh-market.com/api/relay/claim；网络失败返回status 0/失败，非2xx或无效响应也不当租约成功，只有ok后startNamed/startBridge。此补核只闭合本地客户端外联，不审云端控制面的实现或承诺。实际是否对公网服务取决于租约返回、control mode、connector和网络，不能把默认尝试说成已连通。relay/name connector/Cloudflare/边缘运行不是全归本子包，后端策略与SLA本轮未审。

TunnelPlan在port就绪时优先autoTunnel quick（忽略另配token/publicBase），否则token+有效publicBase会启动named，二者都没才off；公有URL格式校验接受http或https，不是所有路径自动加TLS。Cloudflared binary下载/健康重连/孤儿进程实现有入口，本轮只核配置计划、实际启动/stop/dispose调用，未全审所有安装/进程清理/入口同步写；LAN小样排除这些。ingressSync是默认关闭的可选外部配置同步，不按只读状态查询使用。

LANBind默认undefined不加forwarder，true且原Host仍loopback时选择一个具体LAN IPv4候选开同端口边缘；若原Host自己已--host网络绑定，forwarder让位而不是改写原绑定。forwarder丢客户端自供Host/转发身份，重写为LAN authority并加真实peer的x-forwarded-for/proto，避免把网络客户伪成本机；进入受配对/remote通道之后再由内层代理有意变loopback。手工反向代理若抹掉所有来源标记，应用仍不能只凭头区分本机/代理，须保留实际部署信任边界。

applyLanBindWork还可能清旧托管配置块、按开关/port在支持平台调用防火墙规则操作（Windows/Linux后端，其他平台不能据此称已放行）；调用有管理员条件与deferred失败日志，不是无副作用显示开关。forwardPlan只读lanBind/启动bind，不读enabled；sync仍调此工作，所以enabled=false不能单独当LAN listener已撤。关闭lanBind可停插件自己的forwarder并destroy它跟踪的socket，但不能反向取消用户显式--host绑定；插件unmount也会stop owned forwarder。应核真实监听、规则和socket。

master enabled=false当前会service.stop、tunnel.stop、disposeRelayHalf、reset publicBase并撤路由/sweep，有价值，不能写成完全没有关闭动作；保留稳定relay row是有意设计。pair stop按钮则只清会话，不等这些入口全关；旧WS、宿主其他凭据和已发工作依然另验，关闭访问不是回滚Agent/SSH任务。云端全部记录删除、所有connector进程/套接字回收也不能只看面板off证明。

已有posture探针值得保留：运行时对广告Host构造127.0.0.1 POST /api/session.list，并把结果放面板。它只把401/403记未暴露，网络错误/超时也finish(false)，不是从真实外网访问的完整证据；相同targets去重，非每次撤销都重测旧mux/其他凭据。不得把布尔clean解释成所有origin确实403或整个部署已安全。relay bridge实际处理HTTP method/path/headers及响应headers/body帧，是流量中转而非本地配对即可称端到端私密；中转/Cloudflare可能接触其承载内容/凭据，具体存储政策未核。本轮推荐不走公网路径。

客户端另有共享按日心跳，即使relay关也不能称完全离线；需要无外发的小样先处理DNT/opt-out并核外联。移动CSS/Service Worker/浏览器transport和全部UI语义未全审，官方界面复用也不证明手机可用性、更新后选择器稳定或所有cookie阻断场景。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:274-294](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L274-L294)

默认开关relay与autoTunnel分开。

<details>
<summary>查看原文（21行）</summary>

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
  pairingSource: z.union([...PAIRING_SOURCE_OPTIONS]).default('auto').volatile(),
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:723-766](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L723-L766)

租约/bridge实际启动caller。

<details>
<summary>查看原文（44行）</summary>

```text
  const ensureRelayPair = (): RelayConnectorPair | undefined => {
    if (resolve().relay === false) return undefined
    if (relayPair === undefined) {
      try {
        const identity = loadRelayIdentity(resolve().profile)
        pluginVersion ??= readPluginVersion()
        relayPair = new RelayConnectorPair(identity, {
          startNamed: (token: string, hostname: string) => {
            // The claim is also made without a quick tunnel (the bridge grant
            // is the reason); only the quick plan starts the sibling tunnel.
            if (namedConnectorWanted) namedRelayConnector.start(token, hostname)
          },
          startBridge: (start) => { bridgeRelayConnector.start(start) },
          onState: (state: RelayPairState) => {
            if (state.state === 'claimed') {
              console.log(`remote-web-ui: relay lease claimed — the ${state.mode} connector serves ${state.hostname}`)
            } else if (state.state === 'failed') {
              // Not fatal: the quick connector keeps the origin the registry
              // already gave the phone, and the pair retries with backoff.
              console.warn(`remote-web-ui: relay lease claim failed (${state.error}) — the quick connector keeps serving, retrying`)
            }
          },
        })
      } catch (error) {
        console.warn(`remote-web-ui: relay lease unavailable (${error instanceof Error ? error.message : String(error)}) — the quick tunnel path is unchanged`)
      }
    }
    return relayPair
  }
  /**
   * Claim the named lease for one tunnel start. Deduped on the local origin
   * port plus the quick URL, so a settings sync never re-claims while a real
   * restart (a new quick hostname) does — the claim is also what keeps the
   * lease's `last_seen_at` inside the cron GC's TTL.
   */
  const claimRelayLeaseFor = (port: number | undefined, target: string | undefined): void => {
    const key = relayClaimKeyOf(port, target)
    if (key === undefined || relayClaimedFor === key) return
    const pair = ensureRelayPair()
    // The relay toggle being off leaves no pair: the key stays unrecorded so
    // turning it back on claims the lease this trigger would have claimed.
    if (pair === undefined || port === undefined) return
    relayClaimedFor = key
    void pair.start({ port, pluginVersion }).catch(() => undefined)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1382-1401](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L1382-L1401)

无quick仍claim、master关闭动作和稳定row。

<details>
<summary>查看原文（20行）</summary>

```text
    // The lease and the bridge are transport-owned, not tunnel-owned: a
    // bridge-mode instance has to reach its object even when no quick tunnel
    // runs (the claim is the only answer that carries the bridge grant, and
    // without it the edge reports no-connector forever). The dedupe key keeps
    // a settings sync from re-claiming, and a fresh quick URL re-claims.
    if (value.enabled && value.relay !== false) {
      if (livePort === undefined) schedulePortSettleRetry()
      else claimRelayLeaseFor(livePort, publicBase.quickUrl())
    }
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
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/tunnel-plan.ts:38-58](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/tunnel-plan.ts#L38-L58)

quick/named/off优先级。

<details>
<summary>查看原文（21行）</summary>

```text
 *   before the listener binds).
 */
export function tunnelPlanOf(
  value: { autoTunnel?: boolean; tunnelToken?: string; publicBaseUrl?: string },
  port: number | undefined,
): TunnelPlan {
  if (value.autoTunnel === true) {
    if (port === undefined) return { mode: 'off' }
    const ignored: Array<'tunnelToken' | 'publicBaseUrl'> = []
    if (value.tunnelToken !== undefined && value.tunnelToken !== '') ignored.push('tunnelToken')
    if (value.publicBaseUrl !== undefined && value.publicBaseUrl !== '') ignored.push('publicBaseUrl')
    return { mode: 'quick', targetUrl: `http://127.0.0.1:${String(port)}`, ignored }
  }
  if (value.tunnelToken !== undefined && value.tunnelToken !== '') {
    if (value.publicBaseUrl !== undefined && isHttpUrl(value.publicBaseUrl)) {
      return { mode: 'named', token: value.tunnelToken, publicUrl: value.publicBaseUrl }
    }
    return { mode: 'off' }
  }
  return { mode: 'off' }
}
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1268-1329](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L1268-L1329)

实际plan调用与启动/停止/URL分支。

<details>
<summary>查看原文（62行）</summary>

```text
  const applyTunnelPlan = (value: ResolvedConfig, port: number | undefined): void => {
    const plan = tunnelPlanOf(value, port)
    tunnelMode = plan.mode
    publicBase.setMode(plan.mode)
    const liveTunnelUrl = publicBase.quickUrl()
    namedConnectorWanted = plan.mode === 'quick'
    if (plan.mode !== 'quick') {
      // The relay only fronts the quick tunnel; named mode owns its fixed
      // dashboard hostname and the off mode has no public base at all. Only
      // the announce half goes here: the bridge reaches the object without a
      // tunnel, so the lease survives a plan that runs no quick tunnel.
      disposeRelayAnnouncer()
      namedRelayConnector.stop()
      if (value.relay === false) disposeRelayHalf(true)
      if (plan.mode !== 'named') publicBase.refresh()
    } else if (value.relay === false) {
      // The relay toggle is off: no stable origin, the raw quick URL is the
      // QR base exactly as before the relay existed.
      disposeRelayHalf(true)
      publicBase.refresh()
    } else if (liveTunnelUrl !== undefined) {
      // The relay just turned on (or the registrar is new) while the tunnel
      // already runs: announce now — no phase event will fire for an
      // unchanged target.
      const registrar = ensureRelayRegistrar()
      if (registrar !== undefined) announceRelay(registrar, liveTunnelUrl)
    }
    if (plan.mode === 'quick') {
      for (const ignored of plan.ignored) {
        console.warn(`remote-web-ui: autoTunnel is on — ignoring the configured ${ignored}`)
      }
      // With the relay on, the connector stamps the stable origin as the
      // origin-side Host (`--http-host-header`): the plugin fence and the
      // harness browser-auth are Host-bound to the relay origin, and the
      // Workers relay cannot control the origin-side Host (fetch forces it
      // to the URL authority). The target identity change is also what
      // restarts a running tunnel on a relay toggle.
      const registrar = ensureRelayRegistrar()
      const originHostHeader = registrar === undefined ? undefined : new URL(registrar.baseUrl).host
      tunnel.start(originHostHeader === undefined
        ? plan.targetUrl
        : { kind: 'quick', targetUrl: plan.targetUrl, originHostHeader })
    } else if (plan.mode === 'named') {
      // The hostname is fixed and known before the process runs, so publish it
      // now: a named tunnel that fails to start must not leave the previous
      // mode's ephemeral host as the QR and fence base.
      publicBase.markRunning(plan.publicUrl)
      tunnel.start({ kind: 'named', token: plan.token, publicUrl: plan.publicUrl })
    } else {
      tunnel.stop()
      // A named-tunnel token without a usable public hostname cannot serve
      // the QR: stay off and say exactly what is missing instead of running
      // a tunnel nothing points at.
      if (value.tunnelToken !== undefined && value.tunnelToken !== '') {
        console.warn('remote-web-ui: tunnelToken is set but publicBaseUrl is missing or not a valid URL — fill the fixed public hostname of the named tunnel (e.g. https://dsh.example.com) to run it')
      }
      // A malformed public base is ignored with a warning — LAN-only behavior
      // stays intact rather than silently minting unusable QR links.
      if (value.publicBaseUrl !== undefined && !isHttpUrl(value.publicBaseUrl)) {
        console.warn(`remote-web-ui: ignoring malformed publicBaseUrl ${JSON.stringify(value.publicBaseUrl)} (expected https://host[:port])`)
        service.setPublicBaseUrl(undefined)
      } else {
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/lan-bind-plan.ts:66-76](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/lan-bind-plan.ts#L66-L76)

LAN listener计划与Host显式bind区别。

<details>
<summary>查看原文（11行）</summary>

```text
export function forwardPlanOf(
  lanBind: boolean | undefined,
  startupHost: string | undefined,
  capability: LanBindCapability,
): ForwardPlan {
  if (lanBind !== true) return { host: undefined, reason: 'off' }
  if (typeof startupHost === 'string' && startupHost !== '' && isLanReachableBind(startupHost)) {
    return { host: undefined, reason: 'host-bind' }
  }
  const host = capability.candidates[0]
  return host === undefined ? { host: undefined, reason: 'no-address' } : { host, reason: undefined }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/lan-forward.ts:108-123](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/lan-forward.ts#L108-L123)

可信转发头替换。

<details>
<summary>查看原文（16行）</summary>

```text
export function forwardedHeaders(
  request: IncomingMessage,
  authority: string,
  clientAddress: string | undefined,
): Record<string, string> {
  const headers: Record<string, string> = {}
  for (const [name, value] of Object.entries(request.headers)) {
    if (value === undefined) continue
    const lower = name.toLowerCase()
    if (HOP_BY_HOP.has(lower) || REWRITTEN.has(lower)) continue
    headers[lower] = Array.isArray(value) ? value.join(', ') : value
  }
  headers.host = authority
  if (clientAddress !== undefined && clientAddress !== '') headers['x-forwarded-for'] = clientAddress
  headers['x-forwarded-proto'] = 'http'
  return headers
```

</details>

**依据 8 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1155-1167](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L1155-L1167)

forward计划不读取enabled。

<details>
<summary>查看原文（13行）</summary>

```text
  const applyForwardEdge = (value: ResolvedConfig): void => {
    const startup = ctx.get('webStartup') as StartupFacts | undefined
    // The interface list is re-sampled per reconcile (unlike the schema answer,
    // which cannot change under a running process): a machine that changed
    // networks must not keep serving a LAN address it no longer has, and the
    // plan follows the address it does have.
    const liveCapability: LanBindCapability = { wildcardSupported: capability.wildcardSupported, candidates: lanIPv4Addresses() }
    const plan = forwardPlanOf(value.lanBind, startup?.host, liveCapability)
    forwardReason = plan.reason
    const state = forwarder.snapshot()
    const port = Number.isFinite(ctx.webServer.port) ? ctx.webServer.port as number : undefined
    if (plan.host === undefined || port === undefined) {
      if (state.listening) void forwarder.stop().then(applyLanBases)
```

</details>

**依据 9 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1206-1232](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L1206-L1232)

LAN/清理/防火墙副作用与unmount。

<details>
<summary>查看原文（27行）</summary>

```text
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
    }
  }

  // The forwarder and its connections belong to this activation: a dispose (or a
  // remount) must leave no orphan listener behind.
  ctx.effect(() => () => { void forwarder.stop() }, 'remote-web-ui: lan forwarder')
```

</details>

**依据 10 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1354-1357](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L1354-L1357)

sync仍调LAN工作。

```text
  const sync = (): void => {
    const value = resolve()
    service.config = pairingConfigOf(value)
    scheduleLanBindWork()
```

**依据 11 · 源码核查**：[packages/dsh-remote-web-ui/src/lan-forward.ts:236-250](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/lan-forward.ts#L236-L250)

owned listener停时关闭跟踪socket。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 12 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1391-1429](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L1391-L1429)

master关闭路由/sweep。

<details>
<summary>查看原文（39行）</summary>

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
      disposeRoutes = undefined
    }
    if (disposeSweep === undefined && enabled) {
      disposeSweep = ctx.effect(
        () => {
          const timer = nodeSetInterval(() => { service.sweep() }, SWEEP_INTERVAL_MS)
          timer.unref()
          return () => { clearInterval(timer) }
        },
        'remote-web-ui: presence sweep',
      )
    } else if (disposeSweep !== undefined && !enabled) {
      disposeSweep()
      disposeSweep = undefined
```

</details>

**依据 13 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1006-1036](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L1006-L1036)

现有posture实际调用/去重和日志。

<details>
<summary>查看原文（31行）</summary>

```text
  const runPostureProbe = (): void => {
    if (!resolve().enabled) return
    // The probe and the LAN targets need the bound port; before it settles
    // (a recompose pass) there is nothing honest to probe — keep the previous
    // snapshot and let the next trigger retry.
    const port = ctx.webServer.port
    if (port === undefined) return
    const targets = postureTargets(service.publicBaseUrl, service.lanAddresses, port)
    if (targets.length === 0) {
      postureKey = undefined
      service.setPosture(undefined)
      return
    }
    const key = targets.join('|')
    const claim = claimPostureKey(postureKey, key)
    if (!claim.run) return
    postureKey = claim.next
    void probePosture({ port, targets }).then((snapshot) => {
      service.setPosture(snapshot)
      const exposedHosts = snapshot.hosts.filter(host => host.exposed).map(host => host.host)
      const exposed = exposedHosts.length > 0
      if (exposed && !postureWasExposed) {
        console.error(`remote-web-ui: CRITICAL — the /api fence is OPEN for [${exposedHosts.join(', ')}]: unpaired clients reach the full host API. Remove --trusted-host for these hosts (pairing covers them) or bind loopback.`)
      } else if (!exposed && postureWasExposed) {
        console.log('remote-web-ui: the /api posture probe is clean again (every advertised origin refused with 403).')
      }
      postureWasExposed = exposed
    }).catch(() => {
      // Keep the previous snapshot; drop the in-flight key so the same
      // targets retry instead of sticking on a failed round.
      postureKey = releasePostureKey(postureKey, key)
```

</details>

**依据 14 · 源码核查**：[packages/dsh-remote-web-ui/src/posture.ts:91-111](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/posture.ts#L91-L111)

探针401/403及网络失败/超时布尔合并。

<details>
<summary>查看原文（21行）</summary>

```text
async function probeHost(port: number, hostHeader: string, request: ProbeRequest, timeoutMs: number): Promise<boolean> {
  return await new Promise<boolean>(resolve => {
    let settled = false
    const finish = (exposed: boolean): void => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      handle.destroy()
      resolve(exposed)
    }
    const handle = request({
      host: '127.0.0.1',
      port,
      method: 'POST',
      path: '/api/session.list',
      headers: { host: hostHeader, 'content-type': 'application/json' },
      timeout: timeoutMs,
    }, status => { finish(status !== 403 && status !== 401) })
    const timer = setTimeout(() => { finish(false) }, timeoutMs + 1_000)
    handle.on('error', () => { finish(false) })
    handle.end('{}')
```

</details>

**依据 15 · 源码核查**：[packages/dsh-remote-web-ui/src/relay-bridge-connector.ts:434-450](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/relay-bridge-connector.ts#L434-L450)

bridge解析控制帧。

<details>
<summary>查看原文（17行）</summary>

```text
  private onControl(raw: string): void {
    let frame: Record<string, unknown>
    try {
      frame = JSON.parse(raw) as Record<string, unknown>
    } catch {
      return
    }
    const id = typeof frame.id === 'number' ? frame.id : -1
    switch (frame.t) {
      case 'req':
        this.startHttp(id, frame)
        return
      case 'end':
        this.requests.get(id)?.end()
        return
      case 'ws-open':
        void this.openSocket(id, frame)
```

</details>

**依据 16 · 源码核查**：[packages/dsh-remote-web-ui/src/relay-bridge-connector.ts:474-503](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/relay-bridge-connector.ts#L474-L503)

HTTP请求/响应头和body中转。

<details>
<summary>查看原文（30行）</summary>

```text
  /** Start one upstream HTTP request for a bridged stream. */
  private startHttp(id: number, frame: Record<string, unknown>): void {
    const upstream = new URL(this.options.upstream)
    const method = typeof frame.method === 'string' ? frame.method : 'GET'
    const path = typeof frame.url === 'string' && frame.url !== '' ? frame.url : '/'
    const host = bridgeUpstreamHost(frame.host, this.options.hostname)
    const request = http.request({
      host: upstream.hostname,
      port: upstream.port === '' ? 80 : Number(upstream.port),
      path,
      method,
      headers: bridgeUpstreamHeaders(frame.headers, host),
    }, (response: http.IncomingMessage) => {
      this.requests.delete(id)
      this.sendText(JSON.stringify({
        t: 'res',
        id,
        status: response.statusCode,
        statusText: response.statusMessage ?? '',
        headers: rawHeaderPairs(response.rawHeaders),
      }))
      response.on('data', (chunk: Buffer) => { this.sendChunk(encodeChunk(HTTP_BODY, id, chunk)) })
      response.on('end', () => { this.sendText(JSON.stringify({ t: 'fin', id })) })
      response.on('error', (error: Error) => { this.sendText(JSON.stringify({ t: 'fail', id, message: error.message })) })
    })
    request.on('error', (error: Error) => {
      this.requests.delete(id)
      this.sendText(JSON.stringify({ t: 'fail', id, message: error.message }))
    })
    this.requests.set(id, request)
```

</details>

**依据 17 · 源码核查**：[packages/dsh-remote-web-ui/src/client/index.ts:186-197](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/client/index.ts#L186-L197)

移动入口和共享遥测caller。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx: ClientContext): void {
  // Portrait-touch adaptation of the official UI: installed under the plugin
  // lifecycle so disabling the plugin in cordis patch (disabled: true) never
  // injects mobile CSS, gesture hooks, or the whale floating button.
  startMobileAdapt()
  ctx.effect(() => () => {
    ;(window as unknown as { __dshRemoteAdapt?: RemoteAdaptGlobal }).__dshRemoteAdapt?.setEnabled?.(false)
  }, 'remote-web-ui: mobile-adapt')

  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-remote-web-ui' }])
```

</details>

**依据 18 · 源码核查**：[packages/dsh-remote-web-ui/src/relay-connector.ts:178-209](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/relay-connector.ts#L178-L209)

默认claim函数、实际调用、失败和成功后bridge/named分支。

<details>
<summary>查看原文（32行）</summary>

```text
  async start(input: { port: number; pluginVersion?: string }): Promise<RelayClaim | undefined> {
    // A disposed pair stays disposed: a pending retry must not resurrect it.
    if (this.disposed) return undefined
    this.clearTimer()
    this.setState({ state: 'claiming' })
    const claimFn = this.options.claim ?? ((request: RelayClaimRequest) => claimRelayLease(request))
    let outcome: RelayClaimOutcome
    try {
      outcome = await claimFn({
        id: this.identity.id,
        secret: this.identity.secret,
        newSecret: this.identity.fresh === true ? this.identity.secret : undefined,
        port: input.port,
        pluginVersion: input.pluginVersion,
      })
    } catch (error) {
      outcome = { ok: false, status: 0, error: error instanceof Error ? error.message : String(error) }
    }
    if (this.disposed) return undefined
    if (outcome.ok) {
      // The row exists now: never claim a fresh id twice.
      this.identity.fresh = false
      this.attempts = 0
      this.leaseValue = outcome.claim
      this.startNamed(outcome.claim)
      this.startBridge(outcome.claim, input.port)
      this.setState({ state: 'claimed', mode: outcome.claim.mode, hostname: outcome.claim.hostname })
      return outcome.claim
    }
    this.setState({ state: 'failed', error: outcome.error })
    const retry = relayClaimRetryOf(outcome, this.attempts, {
      baseDelayMs: this.options.baseDelayMs,
```

</details>

**依据 19 · 源码核查**：[packages/dsh-remote-web-ui/src/relay-control.ts:16-18](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/relay-control.ts#L16-L18)

真实固定市场控制面endpoint常量。

```text
/** The control-plane endpoints (market apex, never a relay hostname). */
export const RELAY_CLAIM_URL = 'https://dsh-market.com/api/relay/claim'
export const RELAY_RELEASE_URL = 'https://dsh-market.com/api/relay/release'
```

**依据 20 · 源码核查**：[packages/dsh-remote-web-ui/src/relay-control.ts:146-169](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/relay-control.ts#L146-L169)

默认fetch PUT和network/non2xx/invalid-response失败分支。

<details>
<summary>查看原文（24行）</summary>

```text
export async function claimRelayLease(
  request: RelayClaimRequest,
  options: { url?: string; fetchFn?: typeof fetch } = {},
): Promise<RelayClaimOutcome> {
  const fetchFn = options.fetchFn ?? fetch
  let response: Response
  try {
    response = await fetchFn(options.url ?? RELAY_CLAIM_URL, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: relayClaimBody(request),
    })
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    return { ok: false, status: 0, error: detail === '' ? 'network-error' : detail }
  }
  const detail: unknown = await response.json().catch(() => undefined)
  if (!response.ok) return refusalOf(response.status, detail)
  const claim = relayClaimOf(detail)
  return claim === undefined
    ? { ok: false, status: response.status, error: 'invalid-response' }
    : { ok: true, claim }
}

```

</details>

#### 缺口

- 公网relay/Cloudflare后端、实际防火墙/进程清理、移动体验和真实外网posture未全审/运行
  **影响**：默认配置不等LAN-only或端到端保密，推荐显式关闭公网分支并人工核出口；不能用posture false作完整安全/撤销验收
  **进一步探讨**：未来先无敏感隔离LAN测真实监听/头/HTTP/旧WS/退出，再对需要公网者单独审服务、TLS、凭据与成本，不凭默认开关或探针布尔扩用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样给出可回退采用，依赖、执行者、成本与效果如何列清？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

只建议自有受控设备、无敏感数据/无生产凭据的独立可弃置DSH_HOME测试实例，现场保留本机操作者和停Host/断网络手段。加载前明确relay=false、autoTunnel=false、ingressSync=false，清除本次测试不需的tunnelToken/publicBaseUrl/CF配置；需要无外发还须遥测opt-out并核外联。Host先loopback，审网络/权限后再显式开本插件LAN edge，requirePairingForLan保持true。不用生产账号验证，不把配对交给不可信同事；需要强制即时撤销所有通道、多用户只读或统一宿主凭据撤销者先观察。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH/Node和host/client服务 | 启动必需 | DSH>=0.2.1-rc.3、Node ^22.19或>=24；webServer/typertGateway/connection和client slots/configForms/remote | 仅声明/接线，实际版本/协议未验；inner auth、UI座或transport缺失不能据配对成功当可用 |
| 受控设备/实例/网络 | 本小样必需 | 独立home、可信自有浏览器、无敏感实例、本机操作者 | 不能依赖角色/工作区隔离；失控设备或无物理切断手段先观察 |
| LAN监听/防火墙 | 远端LAN操作必需 | 原Host loopback、审LAN候选与端口、必要管理员权限；显式lanBind | 无地址/权限/被占端口不可达，不能乱改trusted-host绕门卫；显式Host网络bind另核 |
| 本机状态/凭据存储 | 持久会话时必需 | devices文件/relay身份等写权限，设备ID/token/grant按秘密处理 | 0600非加密/全平台ACL证明；保存/删旧文件都失败，重启授权状态未知 |
| 公网/relay/Cloudflare | 仅相关模式必需，小样关闭 | 可选binary/租约/边缘/账户与TLS，云配置同步另审 | relay默认true不能靠autoTunnel=false排外联；不接受中转可见性/未知政策就不用 |
| 同版SSH子包 | 仅SSH组合路径必需，非Remote启动依赖 | 固定de02a7 0.4.12参考路由/PTY显示loopback代理授权传播 | 未装/未启用则无此下游；已装不把其局部门卫当远端隔离，未运行组合 |
| 浏览器偏好/网络外发 | 心跳非核心必需 | 共享helper随机visitor/包名/可选baked版本发dsh-market.com，成功日标记 | DNT/opt-out/storage门槛、失败静默/可重试；不等纯离线，未核服务端记录政策 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备并加载 | 管理员备份可弃置home，先写明确公网关闭配置；用户设置遥测偏好 | 核真实profile、配置与外联；已有敏感账号/默认relay未清楚则停 |
| 只开受控LAN | 本机操作者审实际bind/端口与防火墙，按需显式开LAN edge | 另一测试设备能到预期地址，未配对HTTP/新WS握手拒绝；仅posture clean不算通过 |
| 自有设备配对 | 操作者发QR，用户在自有浏览器兑换并核设备记录/实例 | 记token可复用窗口与grant一次性；UI导航、资源与无害只读任务实际正确，不做权限扩张 |
| 撤销矩阵 | 操作者revoke/stop；用户分别试新HTTP、新WS、既有mux后续无害消息及已有其他宿主凭据 | 分别记录拒绝/仍存活/未知，不能从新握手403推出旧流已切；异常停用不放宽门槛 |
| 完整退出 | 管理员关owned LAN edge/公网分支、核监听/连接；必要时停测试Host或断网，并查已发工作负载 | 分开确认访问、设备store/重启和任务停止；仅关面板/master/stop不能替全部验收，旧Host显式bind另还原 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 常驻测试Host、浏览器、LAN端口/磁盘及可选binary；金额未知 | 配置、网络/信任/设备配对与真实入口核查，工时未知 | 默认relay/存储/防火墙可能有副作用；没有实际安装/配对验证 |
| 持续使用 | HTTP/WS转发、长连接、presence/persist和可选边缘流量；模型任务另计 | 设备审查、SDK/浏览器/移动UI升级、输出与凭据保护 | offline是展示、idle/新准入cap非总流量/进程/费用上限；净节时未知 |
| 失败恢复 | 重连/重配、store修复、重复任务及停Host资源，金额未知 | 分通道查旧WS/其他凭据/访问与任务，人工恢复分钟未知 | 可重复token/普通persist失败/撤销双失败及旧流存活需对账，不自动重放写任务 |
| 公网/退出（若采用） | 第三方relay/Cloudflare/账户和数据处理成本未知 | 服务政策/TLS/凭据/配置写与进程回收审核，可能需管理员 | 本轮小样不走，关闭未证明云端全部资料删除；本包不封顶被控Host/Agent费用 |

| 效果 | 当前材料支持 | 未证明/验收条件 |
|---|---|---|
| 同界面接续 | 官方shell复用、移动适配caller与同源rewrite | 实际手机/资源/网络性能和净省时未测 |
| 新访问门禁 | HTTP/新WS握手先live device再环回 | 不等旧流帧、宿主全部凭据/方法和工作负载已撤销 |
| 配对交接 | 窗口token+一次grant、设备表和持久撤销fallback | 非物理设备绑定/多租户；FS双失败/普通accept写失败不保证重启状态 |
| 部署诊断/清理 | LAN forwarder、关闭caller和posture探针存在 | 不等全入口已关/真实外网已测、云端数据清除或所有任务停 |

与受控反向代理/远程桌面同任务对照，记录误授权、退出误判、恢复分钟和接续便利；如果必须靠长期人工切断才满足真实需求、或退出未知不可接受，就停在观察，不用扫码成功替代采用依据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/package.json:1-46](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/package.json#L1-L46)

运行/版本声明。

<details>
<summary>查看原文（46行）</summary>

```text
{
  "name": "@linxin666/dsh-remote-web-ui",
  "description": "Scan-to-pair remote access for the dsh web GUI that shares one official interface: a QR beside the settings button pairs phones and PCs into the same Web GUI (a portrait-touch adaptation layer for phones, full desktop on PCs) through one-time tokens and revocable device sessions, with a LAN bind toggle, optional Cloudflare tunnel, and one-click family self-update",
  "version": "0.4.12",
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "build": "tsc -b && tsdown",
    "test": "vitest run",
    "typecheck": "tsc -b --pretty false",
    "prepare": "tsdown --config tsdown.prepare.config.ts"
  },
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
    "./package.json": "./package.json"
  },
  "files": [
    "lib/**/*.js",
    "lib/**/*.js.map",
    "lib/**/*.d.ts",
    "lib/**/*.d.ts.map",
    "src",
    "assets",
    "cordis.patch.yml",
    "icon.svg"
  ],
  "license": "Apache-2.0",
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:274-294](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L274-L294)

公网相关默认配置。

<details>
<summary>查看原文（21行）</summary>

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
  pairingSource: z.union([...PAIRING_SOURCE_OPTIONS]).default('auto').volatile(),
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/lan-bind-plan.ts:66-76](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/lan-bind-plan.ts#L66-L76)

LAN edge条件。

<details>
<summary>查看原文（11行）</summary>

```text
export function forwardPlanOf(
  lanBind: boolean | undefined,
  startupHost: string | undefined,
  capability: LanBindCapability,
): ForwardPlan {
  if (lanBind !== true) return { host: undefined, reason: 'off' }
  if (typeof startupHost === 'string' && startupHost !== '' && isLanReachableBind(startupHost)) {
    return { host: undefined, reason: 'host-bind' }
  }
  const host = capability.candidates[0]
  return host === undefined ? { host: undefined, reason: 'no-address' } : { host, reason: undefined }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1206-1232](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L1206-L1232)

副作用/退出条件。

<details>
<summary>查看原文（27行）</summary>

```text
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
    }
  }

  // The forwarder and its connections belong to this activation: a dispose (or a
  // remount) must leave no orphan listener behind.
  ctx.effect(() => () => { void forwarder.stop() }, 'remote-web-ui: lan forwarder')
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:150-194](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/remote-api.ts#L150-L194)

新请求门禁。

<details>
<summary>查看原文（45行）</summary>

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
  }

  return [{ kind: 'prefix', path: REMOTE_PREFIX, handler }]
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:235-272](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/remote-api.ts#L235-L272)

新升级/旧流区分。

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

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:344-381](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pairing.ts#L344-L381)

设备持久化/撤销失败。

<details>
<summary>查看原文（38行）</summary>

```text
  private persist(): boolean {
    const file = this.config.devicesFile
    if (file === undefined) return true
    try {
      mkdirSync(dirname(file), { recursive: true })
      const temp = `${file}.${process.pid}.${randomBytes(4).toString('hex')}.tmp`
      const payload: Record<string, DeviceSession> = {}
      for (const [id, session] of this.devices) payload[id] = session
      writeFileSync(temp, JSON.stringify(payload), { mode: 0o600 })
      renameSync(temp, file)
      this.dirty = false
      return true
    } catch (error) {
      console.error('remote-web-ui: failed to persist paired devices', error)
      return false
    }
  }

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

**依据 8 · 源码核查**：[packages/dsh-remote-web-ui/src/client/index.ts:195-197](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/client/index.ts#L195-L197)

遥测实际caller。

```text
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-remote-web-ui' }])
```

**依据 9 · 源码核查**：[packages/dsh-remote-web-ui/src/client/telemetry.ts:117-150](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/client/telemetry.ts#L117-L150)

共享helper抑制/payload/日标记。

<details>
<summary>查看原文（34行）</summary>

```text
export function reportDailyHeartbeat(items: readonly TelemetryItem[]): void {
  try {
    // First guard: a stored opt-out or the browser's Do Not Track stops every
    // read below from minting an id, marking the day, or reaching the network.
    if (isTelemetrySuppressed()) return
    if (items.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    // Automation contexts (CDP-driven QA browsers, fresh isolated profiles)
    // mint a new visitor id per run and would inflate instance counts.
    if (navigator.webdriver) return
    if (localStorage.getItem(DAY_KEY_PREFIX + today) !== null) return
    const visitor = visitorId()
    if (visitor === null) return
    pruneDayKeys(today)
    const payloadItems = items.map((item) => {
      const out: Record<string, string> = { name: item.name }
      const version = item.version ?? bakedVersion()
      if (version !== undefined) out.version = version
      if (item.channel !== undefined) out.channel = item.channel
      return out
    })
    const body = JSON.stringify({ kind: 'heartbeat', visitor, items: payloadItems })
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).then((response) => {
      // Mark the day only after an accepted send, so offline browsers retry
      // on a later mount instead of going dark until tomorrow.
      if (response.ok) localStorage.setItem(DAY_KEY_PREFIX + today, '1')
    }).catch(() => { /* unreachable endpoint: stay silent */ })
  } catch { /* never break the host UI over telemetry */ }
}
```

</details>

#### 缺口

- 现金、实际资源/工时/稳定性、需求频次和完整退出成本均未知
  **影响**：采用仅限具备人工切断手段的无敏感实验；不支持生产/不可信设备的远程授权保证
  **进一步探讨**：以后固定部署做真实端到端新/旧通道、撤销与重启实验；不满足信任或退出条件先观察，比较原方案的总工时与误判。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么方向值得证伪验证，什么时候只需修原组件？

**研究主题**：新假设与验证

#### 完整回答

候选是按设备和通道确认退出的回执，而不是再加配对动画/另一个移动GUI。当前已有新请求门禁、一次性grant、持久撤销fallback、LAN关闭动作与posture探针；增量要补旧WS只握手鉴权、晚到async握手、其他宿主凭据/工作负载不属设备表，以及probe把超时/错误压成false的事实。不假装作者完全没做认证、退出或诊断。

先在原组件做小补丁：握手时绑定device与外/内连接，撤销/idle-expire关闭该设备owned sockets，async innerAuth完成前再核活session；新HTTP拒绝和旧mux关闭分别有记录。probe返回refused、reachable、unknown/error等而不是把网络失败算clean；既有posture作为起点，再加真实外部入口和旧连接的无害读探针。明确宿主别发凭据/已发Agent/SSH任务不归本地设备表撤销；要控制这些需具体宿主/插件契约，无法核就显示未知，不用一个“全部切断”绿勾。

最小对照在无敏感隔离实例固定版本/部署，先建HTTP与WS/mux长流再撤销、发送撤销后的新无害消息；另测握手等待期间撤销、store写失败/删失败、已有宿主browser凭据、LAN forwarder/手动Host bind和需要时单独受控relay。比较当前UI、人工“撤销+关连接/停测试Host”清单、小补丁：误报退出、继续可发的新消息、误断其他设备、未知被错算clean、人工恢复分钟与正常路径开销。本轮没有执行实验，不能说问题已复现或补丁已有效。

如果owned socket绑定/关闭、probe状态细化与一份退出清单已足够，应只修原组件。仅可信个人设备且接受人工退出的人群未必需要独立产品；没有持续多通道误判/恢复摩擦、增量探针不可靠或维护超过收益，就否定新插件。只有真实用户反复需要可追溯退出、效果稳定少错且优于简单方案才继续，风险/代码量不等商业需求或付费。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:235-272](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/remote-api.ts#L235-L272)

握手/async后未设备复核。

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

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:231-273](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L231-L273)

现有raw WS升级与pipe。

<details>
<summary>查看原文（43行）</summary>

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
  })
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:531-550](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pairing.ts#L531-L550)

现有stop/revoke只设备表。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/posture.ts:91-111](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/posture.ts#L91-L111)

已有probe及未知合并false。

<details>
<summary>查看原文（21行）</summary>

```text
async function probeHost(port: number, hostHeader: string, request: ProbeRequest, timeoutMs: number): Promise<boolean> {
  return await new Promise<boolean>(resolve => {
    let settled = false
    const finish = (exposed: boolean): void => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      handle.destroy()
      resolve(exposed)
    }
    const handle = request({
      host: '127.0.0.1',
      port,
      method: 'POST',
      path: '/api/session.list',
      headers: { host: hostHeader, 'content-type': 'application/json' },
      timeout: timeoutMs,
    }, status => { finish(status !== 403 && status !== 401) })
    const timer = setTimeout(() => { finish(false) }, timeoutMs + 1_000)
    handle.on('error', () => { finish(false) })
    handle.end('{}')
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1006-1036](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/index.ts#L1006-L1036)

已有posture实际caller。

<details>
<summary>查看原文（31行）</summary>

```text
  const runPostureProbe = (): void => {
    if (!resolve().enabled) return
    // The probe and the LAN targets need the bound port; before it settles
    // (a recompose pass) there is nothing honest to probe — keep the previous
    // snapshot and let the next trigger retry.
    const port = ctx.webServer.port
    if (port === undefined) return
    const targets = postureTargets(service.publicBaseUrl, service.lanAddresses, port)
    if (targets.length === 0) {
      postureKey = undefined
      service.setPosture(undefined)
      return
    }
    const key = targets.join('|')
    const claim = claimPostureKey(postureKey, key)
    if (!claim.run) return
    postureKey = claim.next
    void probePosture({ port, targets }).then((snapshot) => {
      service.setPosture(snapshot)
      const exposedHosts = snapshot.hosts.filter(host => host.exposed).map(host => host.host)
      const exposed = exposedHosts.length > 0
      if (exposed && !postureWasExposed) {
        console.error(`remote-web-ui: CRITICAL — the /api fence is OPEN for [${exposedHosts.join(', ')}]: unpaired clients reach the full host API. Remove --trusted-host for these hosts (pairing covers them) or bind loopback.`)
      } else if (!exposed && postureWasExposed) {
        console.log('remote-web-ui: the /api posture probe is clean again (every advertised origin refused with 403).')
      }
      postureWasExposed = exposed
    }).catch(() => {
      // Keep the previous snapshot; drop the in-flight key so the same
      // targets retry instead of sticking on a failed round.
      postureKey = releasePostureKey(postureKey, key)
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:371-381](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/pairing.ts#L371-L381)

持久撤销现有fallback与极端失败。

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

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/lan-forward.ts:236-250](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-remote-web-ui/src/lan-forward.ts#L236-L250)

owned edge关闭可借用的清理。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

#### 缺口

- 设备连接退出补丁/跨通道回执未实现，无用户对照或商业数据
  **影响**：只能作为待验证方向，不宣称已统一撤销或存在独立市场
  **进一步探讨**：先最小修复/人工清单对照；若没有可重复误判减少或反而多误断和维护成本则否定。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
