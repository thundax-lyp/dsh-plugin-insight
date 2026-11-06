# dsh-remote-web-ui

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[1f14856](https://github.com/zhu1090093659/dsh-web/tree/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui)

<!-- BEGIN META -->
[![GitHub ★ 10,117](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C117&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 109,620](https://img.shields.io/static/v1?label=npm+30d&message=109%2C620&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-remote-web-ui)
<!-- END META -->

> **功能**：为已有 DSH 部署提供设备配对、官方 Web 远程代理和可选网络通道；此版本已弃用。

> **亮点**：区分配对窗口、单次落地grant、可撤销设备和内层Host认证，复用官方Web而非另造聊天端，见 [Q02](#research-q02)。

> **主要限制**：新请求撤销不等旧WS断流，pair stop不等停所有网络/任务；设备持久失败与Host gate当前发射仍需验证，且固定版已弃用，见 [Q03](#research-q03)-[Q04](#research-q04)。

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
  - [Q01 · 弃用后究竟还有什么入口，适合谁处理什么事？](#detail-section-11)
  - [Q02 · 二维码到真实HTTP/WS结果怎样接通？](#detail-section-12)
  - [Q03 · 撤销、停止、持久失败能撤回多少权限？](#detail-section-13)
  - [Q04 · LAN、隧道和中继启动退出是不是同一开关？](#detail-section-14)
  - [Q05 · 值得怎样采用和退出，哪些成本未知？](#detail-section-15)
  - [Q06 · 还能形成什么可证伪方向，怎样避免重复现有机制？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有独立部署管理员盘点设备授权、远程入口与退出，不建议新增部署弃用包，见 [Q01](#research-q01)。

本机官方Web与手工可信反代/隧道；本项整合配对和认证代理，不改变Host已有工具权限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 配对/grant | 设备注册/单次页面落地 | 窗口可多次accept |
| HTTP/WS代理 | 远程用官方Host Web | 广泛Host权限，非只读 |
| revoke/stop | 拒新设备请求 | 不保证旧流/任务停止 |
| LAN/tunnel/relay | 可选网络可达 | 各开关/清理独立，relay默认开 |
| 浏览器心跳 | 匿名日统计 | DNT/opt-out另控 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| 匹配DSH/Node与成品 | Host/Web入口 | 声明不等运行通过 |
| Host connection/authenticatedUrl | 内层cookie/官方页面 | 当前Host全路径gate未验 |
| 可写设备文件/受控浏览器 | 配对/持续身份 | bearer凭据，持久失败须查 |
| LAN/可选Cloudflare/relay | 远程通道 | relay默认开，云端未审 |
| 原Host模型/工具权限 | 实际工作 | 配对不提供设备最小权限 |

#### 步骤

| 阶段 | 操作 | 判据/退路 |
| --- | --- | --- |
| 盘点 | 现有包/设备/监听/云租约 | 不新部署 |
| 必要验证 | 独立脱敏Host、单LAN设备 | 显式关自动外联/心跳 |
| 撤销 | 保持旧流后revoke/stop | 分新请求/旧流/任务核查 |
| 退出 | 停各通道/查云端/清凭据 | 未确认就停Host |

**效果与成本**

#### 成本

| 阶段 | 资源/现金 | 人工与未知 |
| --- | --- | --- |
| 首次 | Host/网络/状态文件 | 兼容与授权盘点，工时未知 |
| 持续 | 带宽/电力/可选云套餐 | 定价/用量未知；仍付Host模型工具费用 |
| 失败 | 可能仍开的流/任务 | 查文件/旧流/公网租约 |
| 退出 | 保留审计/删敏感身份 | 本地关闭不等云端删除 |

#### 效果

| 项目 | 源码支持 | 尚未验证 |
| --- | --- | --- |
| 远程Web | 官方shell+真实HTTP/WS代理 | 跨网/当前Host兼容 |
| 设备门 | 新请求/upgrade查活身份 | 已有流及时撤回 |
| 停用 | 多通道各自清理 | 云端/OS/任务全部结束 |
| 使用收益 | 减少手工拼配对代理 | 真实需求/净时间/费用 |

> **思考**：新请求撤销不等旧WS断流，pair stop不等停所有网络/任务；设备持久失败与Host gate当前发射仍需验证，且固定版已弃用，见 [Q03](#research-q03)-[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：区分配对窗口、单次落地grant、可撤销设备和内层Host认证，复用官方Web而非另造聊天端，见 [Q02](#research-q02)。

设备门和内层代理真实接通，grant单次消费明确；raw WS生命周期、持久失败、Host gate与多网络出口要求分层验证，见 [Q02](#research-q02)-[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

新请求撤销不等旧WS断流，pair stop不等停所有网络/任务；设备持久失败与Host gate当前发射仍需验证，且固定版已弃用，见 [Q03](#research-q03)-[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅建议已有部署先静态盘点并退出；不得把配对视为只读授权。必要验证使用隔离脱敏Host，关闭各自动面并核旧流和实际任务，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定0.4.15/source，弃用但独立入口仍实现。定向核配对/grant/持久、HTTP/WS内层代理、gate接线、网络默认与退出、浏览器心跳；未运行、全审云端/ingress/Host emitter/所有插件或迁移目标。

- 已检查：作者 README、包清单、源码路径 packages/dsh-remote-web-ui/README.zh.md、packages/dsh-remote-web-ui/package.json、packages/dsh-remote-web-ui/src/client/index.ts、packages/dsh-remote-web-ui/src/client/remote-channel.ts、packages/dsh-remote-web-ui/src/client/telemetry.ts、packages/dsh-remote-web-ui/src/gate.ts、packages/dsh-remote-web-ui/src/index.ts、packages/dsh-remote-web-ui/src/inner-auth.ts、packages/dsh-remote-web-ui/src/lan-forward.ts、packages/dsh-remote-web-ui/src/loopback-proxy.ts、packages/dsh-remote-web-ui/src/pair-grant.ts、packages/dsh-remote-web-ui/src/pairing.ts、packages/dsh-remote-web-ui/src/relay-connector.ts、packages/dsh-remote-web-ui/src/relay-control.ts、packages/dsh-remote-web-ui/src/remote-api.ts、packages/dsh-remote-web-ui/src/remote-methods.ts、packages/dsh-remote-web-ui/src/routes.ts、packages/dsh-remote-web-ui/src/tunnel.ts 及固定范围 inventory；组件：packages/dsh-remote-web-ui。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本组件package/README、Host/client入口；pairing/grant/routes/remote-api/loopback-proxy/inner-auth；gate注册；网络sync、LAN forwarder、tunnel teardown、relay claim/release、client telemetry。未执行或全审Host、移动浏览器、全部Cloudflare ingress/relay云端/OS回收、其他插件和迁移目标。
- 下一步：- 下一步只读盘点现有部署、设备文件和公网租约。
- 必须验证时另建脱敏Host，对照新请求拒绝、旧WS断流和真实任务状态。
- 未运行/安装/网络/模型或验证迁移目标，成本与用户需求未知。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.15（[固定提交 1f14856](https://github.com/zhu1090093659/dsh-web/tree/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

device→WS登记并在撤销/idle/stop时关闭本通道旧流；先与当前Host/现有LAN清理对照，无剩余需求或误断负担更大即否定，见 [Q06](#research-q06)。

- 下一步只读盘点现有部署、设备文件和公网租约。
- 必须验证时另建脱敏Host，对照新请求拒绝、旧WS断流和真实任务状态。
- 未运行/安装/网络/模型或验证迁移目标，成本与用户需求未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 494 | — | — | 20851 |
| .ts | source | 51 | 15532 | 8952 | 5724 | — |
| .tsx | source | 10 | 2567 | 1927 | 534 | — |
| .ts | test | 53 | 13221 | 9991 | 2700 | — |
| .tsx | test | 3 | 895 | 696 | 149 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 158](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=158&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 153](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=153&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核配对到真实Host代理及撤销、持久/网络退出，区分弃用定位与仍存在的独立实现。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 弃用后究竟还有什么入口，适合谁处理什么事？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

固定0.4.15是原生Host/Web远程配对子插件，README明确弃用并指向另一迁移包，称聚合移除而独立安装仅供过渡。不能将弃用文字读成固定源码没有实现：本包exports仍指向lib/index/client，Host apply仍mountOnce→applyImpl，client仍注册移动适配/入口。作者推荐的替代包未在本项审查，不据此推荐它生产采用。

已有部署管理员可用本研究盘点手机/平板到本机DSH官方Web的连接与退出条件；基线是本机Web、手工可信反代/网络通道。实际增量是配对设备身份、官方页面和内层Host认证代理整合，不是另一个只读聊天客户端或Host执行沙箱。配对后可使用广泛Host API，因此不建议新部署此弃用包；同仓其他子包不自动获得本项验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/README.zh.md:5-9](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/README.zh.md#L5-L9)

作者明确弃用/独立过渡安装说明。

```text
> **弃用声明**：`@linxin666/dsh-remote-web-ui` 已弃用，后续由 [@linxin666/dsh-remote-bridge](../dsh-remote-bridge/README.zh.md) 承接。本插件已从 `@linxin666/dsh-web-all` 聚合包中摘除（老 profile 行通过 tombstone 导出与 `retiredPlugins` 登记静默跳过为 no-op），并计划在下一版本中正式删除。过渡期内独立安装（`dsh plugin --profile <name> add @linxin666/dsh-remote-web-ui`）仍可正常使用。浏览器远程控制能力已由手机 App（@linxin666/dsh-remote-bridge）取代，本包不再提供远程访问功能。
>
> - **已迁往 `@linxin666/dsh-remote-bridge` 的能力**：接入栈（中继身份登记、租约 claim/release 控制面、快速/命名双隧道连接器、Durable Object 会合点连接器、cloudflared 进程生命周期与孤儿进程清理、Cloudflare 命名隧道 ingress 端口同步、局域网转发器、宿主通配绑定探测与主机防火墙管理）。
> - **随本插件一起下线的能力**：浏览器侧远程控制面（配对 cookie 门控、`/api/pair` 路由族、门控 `/remote` 代理通道以及手机浏览器竖屏触控适配层）。
> - **并存已知风险**：若与 `@linxin666/dsh-remote-bridge` 在同一 profile 中并存，切勿同时开启两端的中继（两者按 profile 共用同一中继身份，两侧同时启用会竞争 Durable Object 会合点连接，且新桥以 `relay=false` 挂载时会主动撤销该身份的注册行并释放租约）。
```

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/package.json:1-43](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/package.json#L1-L43)

原生包版本和exports/DSH声明。

<details>
<summary>查看原文（43行）</summary>

```text
{
  "name": "@linxin666/dsh-remote-web-ui",
  "description": "Scan-to-pair remote access for the dsh web GUI that shares one official interface: a QR beside the settings button pairs phones and PCs into the same Web GUI (a portrait-touch adaptation layer for phones, full desktop on PCs) through one-time tokens and revocable device sessions, with a LAN bind toggle, optional Cloudflare tunnel, and one-click family self-update",
  "version": "0.4.15",
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": ">=24.9.0"
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
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
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
    "icon.svg",
    "locale"
  ],
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:453-460](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/index.ts#L453-L460)

真实Host apply为mountOnce。

```text
export const apply = mountOnce('@linxin666/dsh-remote-web-ui', applyImpl)

/**
 * What the running host accepts as a bind, sampled once per boot: the installed
 * webserver schema decides the wildcard (see host-bind-capability.ts) and the
 * interface list is frozen for the same reason the QR bases are.
 *
 * The plugin no longer writes a bind anywhere (issue #1917), so the schema
```

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:586-600](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/index.ts#L586-L600)

applyImpl实际初始化配置。

<details>
<summary>查看原文（15行）</summary>

```text
function applyImpl(ctx: Context, config?: ResolvedConfigFields): void {
  const envPublicBase = process.env.DSH_REMOTE_PUBLIC_BASE_URL?.trim() || undefined
  // The settings are read through the volatile references at every call rather
  // than captured once: a settings save commits into those references and
  // announces `loader/volatile-update` (see the listener below), so resolving
  // them here is what makes a live edit reach the running instance without a
  // remount — and keeps the device sessions, the tunnel and the routes alive.
  const resolve = (): ResolvedConfig => ({
    tokenTtlMs: readConfigField(config?.tokenTtlMs, DEFAULTS.tokenTtlMs),
    offlineAfterMs: readConfigField(config?.offlineAfterMs, DEFAULTS.offlineAfterMs),
    maxDevices: readConfigField(config?.maxDevices, DEFAULTS.maxDevices),
    idleExpireMs: readConfigField(config?.idleExpireMs, DEFAULTS.idleExpireMs),
    cookieName: readConfigField(config?.cookieName, DEFAULTS.cookieName),
    requirePairingForLan: readConfigField(config?.requirePairingForLan, DEFAULTS.requirePairingForLan),
    publicBaseUrl: readOptionalConfigField(config?.publicBaseUrl) ?? envPublicBase,
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/client/index.ts:186-201](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/client/index.ts#L186-L201)

真实client初始化适配和心跳调用。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-methods.ts:65-89](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/remote-methods.ts#L65-L89)

远程面承载完整Host能力，仅部分本机管理路径被排除。

<details>
<summary>查看原文（25行）</summary>

```text
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

#### 缺口

- 未运行独立成品或审迁移目标；只定向读取本项120文件中的主链。
  **影响**：弃用和实际过渡实现须并存解释，不能给新增部署保证。
  **进一步探讨**：已有部署先列实际独立包/入口和设备清单；计划退出前另审迁移目标，不开启新公网入口。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 二维码到真实HTTP/WS结果怎样接通？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

本机POST issue先loopback fence，产生有时限配对窗口并清旧窗口；窗口token在有效期内可以多次accept，每次产生设备身份，所以二维码本身不是单次凭据。accept成功签发短时landing grant，consume先删除再检查过期，成功落地后用设备cookie/远程凭据承载身份。设备记录保存createdAt/lastSeen；重载失效/损坏记录会退为空，不能把二维码过期等同既有设备退出。

落地页先校LAN/导航与grant或活设备，再fetch官方index；Host用自己的connection.authenticatedUrl取得内层cookie，设备cookie不是Host cookie。remote API先按cookie/header查询活设备，再校方法/路径/本机专用路由/端口；HTTP实际request至127.0.0.1并pipe响应。WS也先校设备，再改写内层握手建立net.connect并双向pipe，保留长连接。浏览器channel patch把fetch/WS接入该代理；源码可证明接线，未证明真实网络或当前Host兼容。

代理丢外部cookie、origin、referer和转发身份头，写loopback Host、same-origin sec-fetch-site和自己的内层cookie。设备获得的是经配对门的Host代理能力，而非对某个session的最小权限授权；单设备撤销不等于撤销其已启动的Host任务。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:841-850](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/routes.ts#L841-L850)

issue的实际POST和loopback fence。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:289-318](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/pairing.ts#L289-L318)

实际重载设备/损坏退空及idle处理。

<details>
<summary>查看原文（30行）</summary>

```text
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
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/inner-auth.ts:36-86](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/inner-auth.ts#L36-L86)

真实launch token fetch与cookie缓存/ready。

<details>
<summary>查看原文（51行）</summary>

```text
 */
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
  }
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:457-483](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/pairing.ts#L457-L483)

清旧窗口/生成有效期token。

<details>
<summary>查看原文（27行）</summary>

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
  }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:495-524](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/pairing.ts#L495-L524)

有效窗口可accept新设备及上限淘汰。

<details>
<summary>查看原文（30行）</summary>

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
  }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/pair-grant.ts:92-114](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/pair-grant.ts#L92-L114)

真实grant签发和先删除的单次消费。

<details>
<summary>查看原文（23行）</summary>

```text
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

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:1174-1214](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/routes.ts#L1174-L1214)

落地身份校验、官方index和cookie返回。

<details>
<summary>查看原文（41行）</summary>

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
```

</details>

**依据 8 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:915-940](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/index.ts#L915-L940)

真实内层authenticatedUrl和带cookie抓官方页面。

<details>
<summary>查看原文（26行）</summary>

```text
  const innerAuth = createInnerAuth(() => {
    if (!Number.isFinite(ctx.webServer.port)) return undefined
    try {
      return (ctx.connection as { authenticatedUrl?: (base: string) => string }).authenticatedUrl?.(`http://127.0.0.1:${String(ctx.webServer.port)}/`)
    } catch {
      return undefined
    }
  })
  // The official index document for the /pair-app landing, fetched from the
  // inner loopback with the process credential and cached briefly (the shell
  // is static; skins/injections settle right after boot).
  const APP_SHELL_TTL_MS = 30_000
  let appShellCache: { at: number; html: string } | undefined
  const fetchAppShell = async (): Promise<string | undefined> => {
    if (!Number.isFinite(ctx.webServer.port)) return undefined
    if (appShellCache !== undefined && Date.now() - appShellCache.at < APP_SHELL_TTL_MS) return appShellCache.html
    const cookie = await innerAuth.ready()
    try {
      const response = await fetch(`http://127.0.0.1:${String(ctx.webServer.port)}/`, withIdentityEncoding({
        headers: cookie !== undefined ? { cookie } : undefined,
      }))
      if (!response.ok) {
        // A stale credential (secret rotation, 30-day TTL) must not wedge every
        // later landing: drop it so the next attempt re-redeems, exactly as the
        // proxy path does on an upstream 401.
        if (response.status === 401 || response.status === 403) innerAuth.invalidate()
```

</details>

**依据 9 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:146-192](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/remote-api.ts#L146-L192)

实际HTTP设备门/路径校验到代理。

<details>
<summary>查看原文（47行）</summary>

```text
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
```

</details>

**依据 10 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:229-280](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/remote-api.ts#L229-L280)

实际WS设备门和异步认证到代理。

<details>
<summary>查看原文（52行）</summary>

```text
 * @param deps - pairing service + local port + live pairing policy.
 * @returns the upgrade routes to register on webServer.
 */
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
}
```

</details>

**依据 11 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:111-132](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L111-L132)

请求头清理与可信内层身份重写。

<details>
<summary>查看原文（22行）</summary>

```text
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
}
```

</details>

**依据 12 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:167-219](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L167-L219)

真实loopback HTTP调用/响应pipe/401失效。

<details>
<summary>查看原文（53行）</summary>

```text
function pipeLoopbackHttp(
  req: IncomingMessage,
  res: ServerResponse,
  port: number,
  upstreamPath: string,
  auth: InnerAuth | undefined,
  cookie: string | undefined,
): void {
  const headers = forwardedRequestHeaders(req, port, cookie)

  const upstream = httpRequest({
    host: '127.0.0.1',
    port,
    path: upstreamPath,
    method: req.method,
    headers,
  }, (upstreamRes) => {
    // The cached credential went stale (secret rotation, credential store
    // reset): drop it so the next request re-redeems. The in-flight response
    // still pipes through untouched.
    if (upstreamRes.statusCode === 401 && cookie !== undefined) auth?.invalidate()
    const out: OutgoingHttpHeaders = {}
    for (const name of HTTP_FORWARD_RESPONSE_HEADERS) {
      const value = upstreamRes.headers[name]
      if (value !== undefined) out[name] = value
    }
    res.writeHead(upstreamRes.statusCode ?? 502, out)
    upstreamRes.pipe(res)
    // Inner leg died mid-response (reset, truncation): tear the outer leg
    // down instead of letting the truncated response raise an unhandled
    // 'error' with no listener.
    upstreamRes.on('error', () => { res.destroy() })
    // Outer leg died before the response finished (phone left mid-request):
    // reset the inner request so the loopback server stops working on a call
    // nobody will read. Guarded so a normal completion never destroys a
    // keep-alive socket the agent would reuse.
    res.on('close', () => {
      if (!upstreamRes.readableEnded) upstream.destroy()
    })
  })
  upstream.on('error', () => {
    if (!res.headersSent) {
      writeJson(res, 502, { ok: false, error: { code: 'upstream-failure', message: 'upstream request failed' } })
      return
    }
    res.destroy()
  })
  // The outer request aborted mid-body: reset the inner request instead of
  // feeding it a truncated body that still gets processed (mirror of the
  // upgrade path's two-leg teardown).
  req.on('error', () => { upstream.destroy() })
  req.pipe(upstream)
}
```

</details>

**依据 13 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:231-274](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L231-L274)

真实loopback WS连接和双向pipe。

<details>
<summary>查看原文（44行）</summary>

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
}
```

</details>

**依据 14 · 源码核查**：[packages/dsh-remote-web-ui/src/client/remote-channel.ts:279-345](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/client/remote-channel.ts#L279-L345)

fetch/WS替换及恢复。

<details>
<summary>查看原文（67行）</summary>

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
      }
      super(url, protocols)
    }
  }

  const restoreSrc = [
    patchSrcAccessor(window.HTMLImageElement, rewrite),
    patchSrcAccessor(window.HTMLScriptElement, rewrite),
    patchSrcAccessor(window.HTMLIFrameElement, rewrite),
  ]

  window.fetch = patchedFetch
  window.WebSocket = PatchedWebSocket as typeof WebSocket
  if (OriginalEventSource !== undefined) {
    class PatchedEventSource extends OriginalEventSource {
      constructor(url: string | URL, eventSourceInitDict?: EventSourceInit) {
        const parsed = new URL(url.toString(), window.location.href)
        if (sameOrigin(parsed) && shouldRewriteFetchPath(parsed.pathname)) {
          const rewritten = new URL(parsed)
          rewritten.pathname = rewritePath(parsed.pathname)
          super(withDeviceQuery(rewritten), eventSourceInitDict)
          return
        }
        super(url, eventSourceInitDict)
      }
    }
    window.EventSource = PatchedEventSource
  }

  return () => {
    window.fetch = originalFetch
    window.WebSocket = OriginalWebSocket
    if (OriginalEventSource !== undefined) window.EventSource = OriginalEventSource
    for (const restore of restoreSrc) restore()
    restoreUploadHook()
```

</details>

#### 缺口

- 未执行当前Host登录、移动浏览器、反代和流式兼容。
  **影响**：静态闭环不是远端可用性或会话隔离保证。
  **进一步探讨**：脱敏隔离Host未来验证一次HTTP/WS与过期grant/坏设备，分别记录外层设备、内层Host和真实结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 撤销、停止、持久失败能撤回多少权限？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

revoke删除设备；stop清窗口和所有设备、标stopped。liveSession每次检查stopped/设备/idle，过期才删除持久；所以新remote HTTP/upgrade有明确门禁。管理stop路由只调用PairingService.stop，不是关插件或停止所有隧道。已有WS进入raw pipe后没有绑定设备的定时复核/撤销回调；20秒TCP keepalive只查连接存活，不是设备权限复核。静态上存在撤销后已建立流仍继续的条件窗口，未在真实Host复现；不要把新请求403推成旧连接已关闭，也不要把通道关闭推成Host任务终止。

设备持久化用0600临时文件rename，没有fsync。accept调用persist未强制成功才返回，故成功设备可能不耐重启；撤销持久失败会尝试删除旧文件，若删除也失败会日志告警，旧磁盘记录重启恢复的风险仍在，不能承诺撤销已持久。设备ID是可用凭据，须按敏感文件处理。

api/gate listener实际注册，非loopback且enabled时才按requirePairing门禁；旧注释称某Host cohort没有emitter，不能据此断言当前DSH仍不发gate。本轮未绑定当前Host emitter执行证据，直接/api全路径端到端控制仍未知；本插件自己的remote-api显式设备门已核。stop也不旋转Host自己的认证，其他Host授权路径另行处理。代理提供广泛Host权限，已有危险插件/工具可能被调用；不能宣称仅查看或只读。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:531-552](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/pairing.ts#L531-L552)

真实stop与单设备revoke。

<details>
<summary>查看原文（22行）</summary>

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
  }

```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:725-737](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/pairing.ts#L725-L737)

新查询的stopped/idle检查。

<details>
<summary>查看原文（13行）</summary>

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
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/routes.ts:940-973](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/routes.ts#L940-L973)

管理stop/revoke仅调用service。

<details>
<summary>查看原文（34行）</summary>

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
  }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:231-274](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L231-L274)

已建立pipe只有socket生命周期清理，没有设备回查。

<details>
<summary>查看原文（44行）</summary>

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
}
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:344-383](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/pairing.ts#L344-L383)

temp mode0600/rename与失败后删旧文件退路。

<details>
<summary>查看原文（40行）</summary>

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
  }

```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:495-524](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/pairing.ts#L495-L524)

accept对persist返回值不门禁。

<details>
<summary>查看原文（30行）</summary>

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
  }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/gate.ts:115-135](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/gate.ts#L115-L135)

gate实际分支，非loopback需要配置和设备身份。

<details>
<summary>查看原文（21行）</summary>

```text
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
  }
}

/**
```

</details>

**依据 8 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:995-996](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/index.ts#L995-L996)

真实注册gate listener。

```text
  const gate = makeGateListener(service, () => resolve().requirePairingForLan, () => resolve().enabled)
  ctx.effect(() => ctx.on('api/gate', gate), 'remote-web-ui: api gate')
```

#### 缺口

- 未实测撤销后在飞HTTP/旧WS、持久双失败/重启和当前Host gate发射；未审全部Host插件权限。
  **影响**：不能给整体只读、立即断连或持久撤权保证。
  **进一步探讨**：副本保留旧WS后revoke/idle/stop并核真实数据/任务；双写失败只在副本测；不能确认退出就停Host并逐项核外部任务。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · LAN、隧道和中继启动退出是不是同一开关？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

不是。默认autoTunnel=false、ingressSync=false，但relay=true；LAN bind未指定不会强制改Host监听。sync在enabled且relay不为false、端口可用时可claim relay，即使没有quick URL，不能把未启隧道当无外联。RelayConnector真实claim成功后启动命名通道/bridge并有重试；控制面请求发往dsh-market.com，远端实现、账户与数据保留未审。可选Cloudflare ingress控制面也未全审，因此不宜首次启用。

LAN forwarder退出会销毁其自己跟踪的socket和server，但不能推出关闭原Host其他监听。tunnel.stop清计时器、调用handle stop并转stopped；未证明所有OS子进程已等待退出。enabled=false会service.stop/tunnel.stop/dispose relay；pair管理stop只有清配对，两者不同。relay release/unregister有best-effort异步路径，不能把本地清理状态等同云端租约已删除。

客户端另调用每日匿名心跳，DNT或localStorage opt-out可抑制；关闭relay不关闭这条独立外联。心跳payload含visitor及包名/版本/可选渠道，成功后才记当日发送。成本/隐私评估应把Host、隧道/relay和浏览器分开，而不是只看一个enable字段。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:275-294](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/index.ts#L275-L294)

独立配置项与relay默认true。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:428-428](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/index.ts#L428-L428)

LAN bind缺省。

```text
  lanBind: undefined,
```

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:1353-1401](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/index.ts#L1353-L1401)

sync启动/关闭各通道和默认relay路径。

<details>
<summary>查看原文（49行）</summary>

```text
  // plan, the pairing routes, the presence sweep, and the posture probe.
  const sync = (): void => {
    const value = resolve()
    service.config = pairingConfigOf(value)
    scheduleLanBindWork()
    // The quick tunnel's loopback target URL needs the bound port. A recompose
    // pass can run this apply before the listener binds: defer the tunnel
    // branch (and re-plan on a short timer) instead of minting an
    // http://127.0.0.1:undefined target; everything else in sync applies.
    // Read through the normalizer: a half-read webServer can hand NaN/Infinity,
    // and that must take the unbound-port path (settle retry, no request) rather
    // than mint a ":NaN" target or leave every dependent surface waiting.
    const livePort = livePortOf(ctx.webServer.port)
    const tunnelNeedsPort = livePort === undefined && value.autoTunnel === true
    if (tunnelNeedsPort) {
      if (!portSettleWarned) {
        portSettleWarned = true
        console.warn('remote-web-ui: autoTunnel is on but the web server port is not bound yet — the quick tunnel starts once the port settles')
      }
      schedulePortSettleRetry()
    } else {
      portSettleWarned = false
      applyTunnelPlan(value, livePort)
    }
    // The ingress sync learns the live port in both branches: an unbound
    // listener is a zero-request wait there, and the same settle timer delivers
    // the port — no second retry loop of its own.
    scheduleIngressSync(value, livePort)
    if (livePort === undefined && !tunnelNeedsPort && value.ingressSync === true) schedulePortSettleRetry()
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

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/relay-connector.ts:60-63](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/relay-connector.ts#L60-L63)

无quick target仍有port claim key。

```text
export function relayClaimKeyOf(port: number | undefined, target: string | undefined): string | undefined {
  if (port === undefined) return undefined
  return String(port) + '|' + (target ?? '')
}
```

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/relay-connector.ts:178-239](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/relay-connector.ts#L178-L239)

真实claim/start/重试及释放dispose。

<details>
<summary>查看原文（62行）</summary>

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
      maxDelayMs: this.options.maxDelayMs,
    })
    if (retry.refreshIdentity) this.identity.fresh = true
    if (retry.retry) this.scheduleRetry(input, retry.delayMs)
    return undefined
  }

  /**
   * The plugin's offline action (toggle off, profile unmount): release the
   * lease and stop the idle connector. Never retires — the hostname is the
   * phone's bookmark, and the tunnel behind it survives.
   */
  async release(): Promise<void> {
    const releaseFn = this.options.release ?? ((identity: RelayIdentity) => releaseRelayLease(identity))
    try {
      await releaseFn(this.identity)
    } catch {
      // Best effort: an unreleased row is recovered by the 90-day GC.
    }
    this.stopNamed()
  }

  /** Stop retrying and drop the connector (the relay half was disposed). */
  dispose(): void {
    this.disposed = true
    this.clearTimer()
    this.stopNamed()
    this.setState({ state: 'idle' })
  }

```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/relay-control.ts:146-168](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/relay-control.ts#L146-L168)

真实远端PUT及失败处理。

<details>
<summary>查看原文（23行）</summary>

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

**依据 7 · 源码核查**：[packages/dsh-remote-web-ui/src/lan-forward.ts:237-261](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/lan-forward.ts#L237-L261)

forwarder关闭自己的连接。

<details>
<summary>查看原文（25行）</summary>

```text
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
  }

  private releaseSockets(): void {
    for (const upstream of this.upstreams) upstream.destroy()
    this.upstreams.clear()
    for (const socket of this.sockets) socket.destroy()
    this.sockets.clear()
  }

```

</details>

**依据 8 · 源码核查**：[packages/dsh-remote-web-ui/src/tunnel.ts:663-675](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/tunnel.ts#L663-L675)

timer与handle teardown。

<details>
<summary>查看原文（13行）</summary>

```text
  /** Stop the current process and cancel every pending timer (no phase change). */
  private teardown(): void {
    this.stopping = true
    this.stopHealthWatch()
    if (this.urlTimer !== undefined) {
      this.timer.clearTimeout(this.urlTimer)
      this.urlTimer = undefined
    }
    if (this.restartTimer !== undefined) {
      this.timer.clearTimeout(this.restartTimer)
      this.restartTimer = undefined
    }
    this.stopHandle()
```

</details>

**依据 9 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:667-700](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/index.ts#L667-L700)

relay本地dispose与异步best-effort release/unregister。

<details>
<summary>查看原文（34行）</summary>

```text
   */
  const disposeRelayAnnouncer = (unregister: boolean = false): void => {
    const registrar = relayRegistrar
    relayRegistrar = undefined
    relayAnnouncedFor = undefined
    publicBase.setRelay(undefined)
    if (registrar === undefined) return
    // Toggle-off removes the registry row so the stable origin stops
    // proxying; teardown/mode changes keep the row (the phone then sees the
    // relay's offline page instead of a dangling claim, and re-enabling
    // reuses the same identity).
    if (unregister) void registrar.unregister().catch(() => undefined)
    registrar.dispose()
  }
  /** Drop the whole relay half: the mapping, the lease and every connector. */
  const disposeRelayHalf = (unregister: boolean = false): void => {
    disposeRelayAnnouncer(unregister)
    const pair = relayPair
    relayPair = undefined
    relayClaimedFor = undefined
    // The named connector never outlives the relay half (a plan change to a
    // manual named tunnel leaves only the operator's own tunnel running), and
    // neither does the bridge socket.
    namedRelayConnector.stop()
    bridgeRelayConnector.stop()
    if (pair === undefined) return
    // Toggle-off releases the lease: the tunnel and the CNAME stay, so
    // re-enabling claims an instance that creates nothing. It never retires
    // — the hostname is the phone's bookmark.
    if (unregister) void pair.release().catch(() => undefined)
    pair.dispose()
  }
  const ensureRelayRegistrar = (): RelayRegistrar | undefined => {
    if (resolve().relay === false) return undefined
```

</details>

**依据 10 · 源码核查**：[packages/dsh-remote-web-ui/src/client/telemetry.ts:116-150](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/client/telemetry.ts#L116-L150)

心跳抑制/去重/payload和真实fetch。

<details>
<summary>查看原文（35行）</summary>

```text
 */
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

- 未审全部Cloudflare ingress/relay云端、OS进程回收、防火墙与跨网兼容。
  **影响**：本地停用不保证云端无残留或其他路径无访问。
  **进一步探讨**：已有部署清点relay/Cloudflare/防火墙/监听和浏览器心跳，独立关各面并核云端状态；无法核清时不维持公网访问。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 值得怎样采用和退出，哪些成本未知？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前推荐watch：仅供现有部署管理员静态盘点退出，不建议新装这个弃用包。未来若必须验证遗留路径，应使用无真实数据/账号/危险工具的隔离Host，单设备LAN，先显式关relay/autoTunnel/ingress、移除公网base并核Host监听；浏览器加载前DNT/opt-out抑制心跳。配对意味着广泛Host控制，单说不点击写按钮不能使整个部署只读。

首次需匹配DSH成品/Node、可写状态和配对设备；持续需Host在线、带宽、电力、隧道/域名/云账户和版本维护，套餐价格、流量与维护工时均未知。模型/远端工具调用仍计原Host费用，远程UI不改变资源供给结构，不推算节时/省钱。失败恢复包括检查旧流、设备文件、已起Host任务和公网租约，可能多于手工反代维护；本项未执行网络或测费用。

退出先停新配对/撤设备，再关闭各通道并核socket/Host监听、云端租约和外部任务；未能确认授权撤回时停隔离Host。保存必要审计后按策略删除敏感设备记录/浏览器凭据，不因卸载或二维码过期假设所有授权消失。迁移目标必须另核，不把作者弃用建议当验证过的新方案。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/README.zh.md:5-9](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/README.zh.md#L5-L9)

作者弃用/过渡定位。

```text
> **弃用声明**：`@linxin666/dsh-remote-web-ui` 已弃用，后续由 [@linxin666/dsh-remote-bridge](../dsh-remote-bridge/README.zh.md) 承接。本插件已从 `@linxin666/dsh-web-all` 聚合包中摘除（老 profile 行通过 tombstone 导出与 `retiredPlugins` 登记静默跳过为 no-op），并计划在下一版本中正式删除。过渡期内独立安装（`dsh plugin --profile <name> add @linxin666/dsh-remote-web-ui`）仍可正常使用。浏览器远程控制能力已由手机 App（@linxin666/dsh-remote-bridge）取代，本包不再提供远程访问功能。
>
> - **已迁往 `@linxin666/dsh-remote-bridge` 的能力**：接入栈（中继身份登记、租约 claim/release 控制面、快速/命名双隧道连接器、Durable Object 会合点连接器、cloudflared 进程生命周期与孤儿进程清理、Cloudflare 命名隧道 ingress 端口同步、局域网转发器、宿主通配绑定探测与主机防火墙管理）。
> - **随本插件一起下线的能力**：浏览器侧远程控制面（配对 cookie 门控、`/api/pair` 路由族、门控 `/remote` 代理通道以及手机浏览器竖屏触控适配层）。
> - **并存已知风险**：若与 `@linxin666/dsh-remote-bridge` 在同一 profile 中并存，切勿同时开启两端的中继（两者按 profile 共用同一中继身份，两侧同时启用会竞争 Durable Object 会合点连接，且新桥以 `relay=false` 挂载时会主动撤销该身份的注册行并释放租约）。
```

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/package.json:1-43](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/package.json#L1-L43)

实际版本/Node/Host声明。

<details>
<summary>查看原文（43行）</summary>

```text
{
  "name": "@linxin666/dsh-remote-web-ui",
  "description": "Scan-to-pair remote access for the dsh web GUI that shares one official interface: a QR beside the settings button pairs phones and PCs into the same Web GUI (a portrait-touch adaptation layer for phones, full desktop on PCs) through one-time tokens and revocable device sessions, with a LAN bind toggle, optional Cloudflare tunnel, and one-click family self-update",
  "version": "0.4.15",
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": ">=24.9.0"
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
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
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
    "icon.svg",
    "locale"
  ],
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/index.ts:275-294](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/index.ts#L275-L294)

自动面独立默认。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-methods.ts:65-89](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/remote-methods.ts#L65-L89)

配对后广泛Host控制范围。

<details>
<summary>查看原文（25行）</summary>

```text
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

**依据 5 · 源码核查**：[packages/dsh-remote-web-ui/src/pairing.ts:344-383](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/pairing.ts#L344-L383)

敏感状态与失败恢复。

<details>
<summary>查看原文（40行）</summary>

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
  }

```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web-ui/src/client/telemetry.ts:116-150](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/client/telemetry.ts#L116-L150)

浏览器独立外联及抑制条件。

<details>
<summary>查看原文（35行）</summary>

```text
 */
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

- 未运行成品、计费账户、恢复/删除或迁移实验，也未验证实际用户需求。
  **影响**：只能给遗留盘点/受控验证条件，不能保证净收益。
  **进一步探讨**：先只读配置与租约清单；必须验证才另建脱敏Host，逐项记录入站/外联/旧流和真实任务，失败回停Host与本机Web。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 还能形成什么可证伪方向，怎样避免重复现有机制？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

可迁移贡献是把短时配对窗口、单次页面grant、可撤销设备凭据和Host内层认证代理分开，让官方Web经受控通道使用；它没有把Host变成设备级最小权限执行服务。LAN forwarder已能销毁自有socket、每次新remote请求已查设备，不应把这些既有机制包装为新创新。

剩余候选是给remote WS升级成功后的pipe建立device→socket登记，设备revoke/idle/stop时主动关闭对应旧流，并给出只针对本通道的清理结果；仍不承诺撤销Host已启动工作或其他认证。对照现状TCP keepalive、手工断网/停Host，测试正常流、撤销后流、同机另一设备三个样本，记录旧流可继续收发时长/误断另一设备/重连恢复和维护负担。若现Host本已可靠关全部相关流、没有实际撤销需求，或新增登记只制造误断与复杂性，则不做。此方向未实现/实测，不计现版分。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web-ui/src/pair-grant.ts:92-114](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/pair-grant.ts#L92-L114)

单次落地grant已有。

<details>
<summary>查看原文（23行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/dsh-remote-web-ui/src/remote-api.ts:229-280](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/remote-api.ts#L229-L280)

升级时设备检查已有。

<details>
<summary>查看原文（52行）</summary>

```text
 * @param deps - pairing service + local port + live pairing policy.
 * @returns the upgrade routes to register on webServer.
 */
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
}
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web-ui/src/loopback-proxy.ts:231-274](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/loopback-proxy.ts#L231-L274)

raw pipe没有设备撤销复核。

<details>
<summary>查看原文（44行）</summary>

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
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web-ui/src/lan-forward.ts:237-261](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-remote-web-ui/src/lan-forward.ts#L237-L261)

LAN forwarder自有socket关闭已有。

<details>
<summary>查看原文（25行）</summary>

```text
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
  }

  private releaseSockets(): void {
    for (const upstream of this.upstreams) upstream.destroy()
    this.upstreams.clear()
    for (const socket of this.sockets) socket.destroy()
    this.sockets.clear()
  }

```

</details>

#### 缺口

- 未实测当前Host是否另有上游断流和撤销需求/误断率。
  **影响**：不能断言所有旧流必然持续或新增模块必需。
  **进一步探讨**：先复现三样本并问现有部署的退出目标，只在确有剩余窗口时做device-socket小原型。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
