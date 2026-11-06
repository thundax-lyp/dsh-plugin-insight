# dsh-remote-web

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3c48a5f](https://github.com/mrRisega/dsh-remote/tree/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web)

<!-- BEGIN META -->
[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mrRisega/dsh-remote) [![npm 30d 7,351](https://img.shields.io/static/v1?label=npm+30d&message=7%2C351&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote-web) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote-web)
<!-- END META -->

> **功能**：在DSH设置页配置公网远程访问，补装并管理bridge，支持云服务和自建入口。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)提供原生设置、Host端口/会话接续、跨平台进程与运行时补齐，减少公网入口手动配置；不是纯UI，亦非独立relay。

> **主要限制**：[Q03](#research-q03)、[Q04](#research-q04)本地头围栏不等远程用户认证，Cookie等完整Host访问权，E2EE条件不满足仍可继续v1；自动补装/默认遥测/明文凭据须纳入采用决定。

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
  - [Q01 · 这是设置皮肤还是能开放完整远程控制的组件？](#detail-section-11)
  - [Q02 · 插件如何从Host接到bridge，远程浏览器凭什么通过认证？](#detail-section-12)
  - [Q03 · 本地围栏与加密是否构成同一种安全保证？](#detail-section-13)
  - [Q04 · 后台自愈、遥测和退出使采用承担哪些成本？](#detail-section-14)
  - [Q05 · 如何把“在线”升级成可验证的远程权限状态？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适用者是电脑已有DSH、离开同一网络仍需要手机使用原生对话/工具/审批/设置的个人。成功须手机请求落到选定Host并完成正确任务，人审/文件归属与退出后不可访问均能核实；不是仅出现远程URL。基线是VPN访问原生Web、SSH隧道与远程桌面。本插件减少手动穿透/代理与鉴权接续配置，保留原生Web交互；模型/Agent/工具仍是Host能力，网络中继和手机端能力不是Web包独立创造。

VPN/SSH隧道访问原生Web、远程桌面及人工服务部署；完整Host工具和推理由上游提供。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 设置/控制面 | 原生配置公网入口 | 依Host/bridge/relay，非纯UI |
| Cookie接续 | 手机代理访问新Host | 完整访问权、按authority隔离 |
| runtime补装 | 本地复制优先、npx回退 | 可能自动执行安装器 |
| 服务/自愈 | 常驻bridge与停止 | 跨平台未运行核验 |
| 遥测 | 安装/连接事件诊断 | 默认开，可环境关闭，非所有网络总开关 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH >=rc.6 <0.3及webServer | 必需 | 原生面板/Host能力 | 不替代上游沙箱/身份 |
| 打包runtime或npx/registry | 必需其一 | bridge/setup/ws | 缺时后台安装/退避，发行完整性未验 |
| SaaS账号或自建relay/local_key | 公网必需 | 身份/传输 | E2EE模式不同，外部可用未知 |
| Host connection与authority Cookie | 新Host接续必需 | 授权上游访问 | 缺失会401，Cookie相当完整访问 |
| 系统服务/后台与磁盘权限 | 按平台必需 | 常驻及秘密保存 | 失败有日志/退路，不保证自愈 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 隔离Host、核网络/许可/遥测开关 | 信任后台补装和运行代码后再加载 |
| 配置 | 选SaaS或自建、确认外层访问保护 | 不把两模式E2EE保证混同 |
| 接续 | 核authority/Cookie/bridge实际状态 | 远程URL/进程在线不足 |
| 任务 | 手机只读任务对原机审批/结果 | 错Host/降级不清即停 |
| 退出 | 停服务撤设备，核手机失效后清归属数据 | 不把关浏览器当停后台 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 机器/账号或服务器金额未知 | 许可、凭据、访问保护与自动补装核 | 源码不等发行包齐全 |
| 持续 | 模型/中继带宽/在线机器未知 | 更新、权限/遥测和模式复核 | 未测净节时 |
| 故障 | 安装/重连/磁盘未知 | Cookie/端口/设备/服务经理核查 | 不能凭绿灯重试副作用 |
| 退出 | 留存未知 | 停服务、撤设备/密钥、profile和备份清理 | 未全审彻底卸载 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原生远程入口 | 双面/独立bridge实际接线 | 手机全部交互/真实公网任务 |
| 会话接续 | authority Cookie写读与附加 | relay身份撤销完整性 |
| 自愈 | 复制/检查/安装退避和服务分支 | 跨平台故障恢复效果 |
| 内容保护 | 模式状态/条件E2EE | 完整密码学与实际部署保证 |

> **思考**：[Q03](#research-q03)、[Q04](#research-q04)本地头围栏不等远程用户认证，Cookie等完整Host访问权，E2EE条件不满足仍可继续v1；自动补装/默认遥测/明文凭据须纳入采用决定。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)提供原生设置、Host端口/会话接续、跨平台进程与运行时补齐，减少公网入口手动配置；不是纯UI，亦非独立relay。

Host authority分文件、补装后自检与错误退避可借鉴；本地guard不替代远程认证，Cookie代持和兼容降级要求明确状态及撤销。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)、[Q04](#research-q04)本地头围栏不等远程用户认证，Cookie等完整Host访问权，E2EE条件不满足仍可继续v1；自动补装/默认遥测/明文凭据须纳入采用决定。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人非敏感profile受限试用，先核一个Host、一个手机只读任务及撤销失效；明确SaaS/自建与E2EE实际状态。默认遥测和自动补装应在加载前决定。身份/模式/停止不明时回VPN/SSH原生Web，不接敏感团队。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态支持双面原生插件与复杂运行时接续，外部relay/密码学/手机完整体验未验；个人非敏感Host受限试用，分阶段状态策略为假设。

- 已检查：作者 README、包清单、源码路径 clients/dsh-remote/dsh-bridge.mjs、packages/dsh-remote-web/README.md、packages/dsh-remote-web/lib/index.js、packages/dsh-remote-web/package.json、scripts/bundle-runtime.mjs 及固定范围 inventory；组件：packages/dsh-remote-web。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核包README/package、Host apply、Cookie mint、runtime复制/npx、平台启动/停止入口、同源围栏/路由、config/权限与遥测；补读同仓bundle-runtime及bridge实际headers/Cookie和E2EE条件。未全审8千行管理/升级/卸载、客户端、完整relay/E2EE算法/平台分支。
- 下一步：只读固定源码；未执行目标、安装、登录、启动隧道、手机或密码学测试。一般冒烟为scope_boundary，外部身份/模式/恢复与收益是研究缺口。

**分析版本**

- **仓库**：[mrRisega/dsh-remote](https://github.com/mrRisega/dsh-remote)
- **版本号**：0.7.9（[固定提交 3c48a5f](https://github.com/mrRisega/dsh-remote/tree/3c48a5fdc41b8e64c0523ab2d146e78d1528effd)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的权限阶段回执与必需E2EE策略，通过撤销/端口/Cookie/降级故障对照验证错误绿灯与恢复成本。

只读固定源码；未执行目标、安装、登录、启动隧道、手机或密码学测试。一般冒烟为scope_boundary，外部身份/模式/恢复与收益是研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 15711 | 10880 | 4750 | — |
| .mjs | source | 1 | 66 | 47 | 17 | — |
| .md | source | 1 | 94 | — | — | 775 |
| .mjs | test | 65 | 19723 | 15248 | 3494 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/mrRisega/dsh-remote/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/mrRisega/dsh-remote/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/mrRisega/dsh-remote/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断原生Web插件如何实际开放远程权限及依赖、加密与恢复条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是设置皮肤还是能开放完整远程控制的组件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-remote-web0.7.9是原生双面插件：客户端挂设置入口，Host注册/dsh-remote路由、管理账号/自建参数、补装运行环境并启动独立bridge。它不是纯UI，也不是整仓中继服务；真正公网传输依同仓bridge和外部SaaS/自建服务，包prepack把这些运行时拷入发行物。固定git checkout没有runtime生成物不能直接证明npm成品齐全。

适用者是电脑已有DSH、离开同一网络仍需要手机使用原生对话/工具/审批/设置的个人。成功须手机请求落到选定Host并完成正确任务，人审/文件归属与退出后不可访问均能核实；不是仅出现远程URL。基线是VPN访问原生Web、SSH隧道与远程桌面。本插件减少手动穿透/代理与鉴权接续配置，保留原生Web交互；模型/Agent/工具仍是Host能力，网络中继和手机端能力不是Web包独立创造。

作者全程加密与手机100%还原属于主张，本次未测手机完整功能、真实公网或任务收益。公网远程能力同时扩大可触达权限，不能只按方便访问评价。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-remote-web/README.md:1-50](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/README.md#L1-L50)

作者定位及双面架构。

<details>
<summary>查看原文（50行）</summary>

```text
# dsh-remote-web — 公网远程控制 dsh web 的插件

> 曾用名 **dsh-remote-ui**（≤0.4.9）；2026-09 更名 **dsh-remote-web** —— 本插件是
> dsh-remote 全家桶的 **dsh web 插件半**（远程控制宿主插件，不是纯 UI/皮肤插件），
> 名称与功能定位一致。旧名安装可由新版 `dsh-setup.mjs` 自动迁移/清理。

> **给 DeepSeek Harness（dsh web）一个「随时随地」的公网入口。**
> 安装后在 dsh web 的设置页登录账号，即得到一个专属的**加密远程地址**：人在办公室外、
> 用手机流量或任意网络打开它，都能像坐在电脑前一样操作 dsh——继续对话、看工具执行、
> 审批授权、改设置。**不要求手机和电脑在同一 WiFi/局域网**，也不需要公网 IP、
> 路由器映射或自己搭服务器，开箱即用、全程加密。
> 懂技术的用户也可以把服务部署到自己的服务器上，数据与流量完全自控（普通用户无需关心）。

以下为面向开发者/维护者的实现说明：

Embeds the dsh-remote configuration UI into dsh web itself (the "everything is a
plugin" model):

- Entry point: the **Settings** page, via the official `settings.section`
  extension point (`order: 30`, below "Agent presets").
- Inline configuration panel:
  - Connection-mode tabs: **Cloud service** (SaaS) / **Self-hosted**
  - Remote-control URL (from the relay `public-config` `app_url`, copyable)
  - Account: phone + password login/save, registration (with SVG captcha);
    signed-in state shows plan / upgrade / invite / feedback / **sign out**
  - Bridge service: launchd status (pid), start/stop switch; shows device id and
    autostart state — never exposes config paths or passwords
  - **About dsh-remote** card (for newcomers: SaaS convenience, bandwidth costs,
    self-hosting option)
  - **User feedback** card (submodule of the commercial edition): submit
    feedback (category + captcha anti-abuse) and track "my feedback" threads
    with admin replies; satisfaction popup ~10 minutes after first use
- First-run hint: a red dot on the "Remote Control" entry (localStorage
  `dsh-remote-seen-dot`).
- Config file: `~/.dsh-remote/.dsh-config.json` by default (0600), overridable
  via the entry config `relayDir` or `DSH_RELAY_DIR`.

## Architecture (dual-half plugin)

| Half | File | Responsibility |
|---|---|---|
| Node half (host plugin) | `lib/index.js` | Injects `webServer`; same-origin `/dsh-remote/*` routes: status / config / start / stop / captcha / register / login / remote-url / feedback proxy; relay requests bypass system proxies (6s timeout) |
| Browser half (client plugin) | `lib/client.js` | Hand-written `__ModuleLoader__.load({id, factory})` bundle (no build step); registers the `settings.section` entry + satisfaction popup; only requires `react` (seed module) |

The browser half needs no Vite/tsdown rebuild: `dsh-client-modules` reads
`exports["./client"]` at startup and serves it with index.html (restart
`dsh web` after changes).

## Install / Uninstall

```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web/package.json:1-50](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/package.json#L1-L50)

0.7.9/Host客户端与prepack/许可。

<details>
<summary>查看原文（50行）</summary>

```text
{
  "name": "dsh-remote-web",
  "version": "0.7.9",
  "description": "公网远程控制 DeepSeek Harness（dsh web）：安装即得专属加密地址，人在外面也能用手机访问电脑上的 dsh——无需同一局域网/WiFi、无需公网 IP 与内网穿透，全程加密；手机端 100% 还原电脑体验（对话/工具/审批/设置）。技术用户可选自建服务，流量走自己的服务器。Remote control DeepSeek Harness (dsh web) from anywhere over the public internet — install, get an encrypted URL, use it from your phone on any network (dual-half cordis plugin: Settings panel + same-origin /dsh-remote routes). (2026-09 由 dsh-remote-ui 更名 / renamed from dsh-remote-ui; dsh-remote 的 dsh web 插件半，不是纯 UI/皮肤插件)",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "runtime",
    "cordis.patch.yml",
    "screenshots.json",
    "README.md"
  ],
  "scripts": {
    "prepack": "node ../../scripts/bundle-runtime.mjs"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/mrRisega/dsh-remote.git",
    "directory": "packages/dsh-remote-web"
  },
  "bugs": {
    "url": "https://github.com/mrRisega/dsh-remote/issues"
  },
  "homepage": "https://github.com/mrRisega/dsh-remote/tree/main/packages/dsh-remote-web#readme",
  "license": "PolyForm-Noncommercial-1.0.0",
  "engines": {
    "dsh": ">=0.1.0-rc.6 <0.3.0-0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.1.0-rc.6 <0.3.0-0"
  }
}
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web/lib/index.js:8621-8679](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L8621-L8679)

加载后实际注册路由、cookie、补装和遥测。

<details>
<summary>查看原文（59行）</summary>

```text
export function apply(ctx, config = {}) {
  const relayDir = config.relayDir || process.env.DSH_RELAY_DIR || DEFAULT_RELAY_DIR;
  // 记住宿主 ctx：上游地址要问 dsh web 自己的监听端口（见 upstreamUrl）。
  // 存 ctx 而不是当场取端口：apply 可能早于 webServer.listen 完成，端口那时还是 0/undefined。
  webServerCtx = ctx;
  // 上游地址落盘（0.6.12）：系统自启拉起的守护没有本进程的 env，只认这个文件。
  publishUpstream(relayDir);
  // 【0.6.15】问不到自己监听端口时（飞牛/NAS 实测就是这种情况）主动发现一次并固化：
  // watcher/bridge 是独立进程，只有这里知道 dsh web 真实在哪个端口。fire-and-forget，
  // 发现完 /dsh-remote/bridge-status 的下一轮轮询与自愈就会用上正确地址。
  void discoverUpstreamSelf(relayDir).catch(() => FALLBACK_UPSTREAM);
  // 全新激活（dsh web 重启后插件重新加载，或卸载后再次安装）→ 解除上次的「已卸载」停摆标记
  UNINSTALLED_DIRS.delete(relayDir);
  // 匿名遥测：装载即初始化（读回上次进程遗留的磁盘队列，例如重启前那条 harness_restart，
  // 并启动 60s 发送心跳），随后记一条 plugin_loaded（每进程一次）。
  // DSH_REMOTE_TELEMETRY=0 → 这里连读都不读：零文件、零请求、零 install_id。
  telemetryStart(relayDir);
  telemetryOnce(relayDir, "plugin_loaded");
  // 清理上次进程残留的安装/更新 marker（宿主被重启/强杀时子进程清理回调会丢失）
  sweepStaleMarkers(relayDir);
  // 「待重启」状态结清 + 运行时安装检测：
  //   - bootId 变了 = 这次装载发生在新进程里 → 重启已完成，撤下提示；
  //   - 插件文件晚于本进程启动才落盘（市场安装/在线更新在运行中改写）→ 当前进程里
  //     根本没有本插件的路由与面板，必须重启 DeepSeek harness 才能生效。
  const settled = settleRestartState(relayDir);
  if (settled.cleared) {
    ctx.logger?.info?.("dsh-remote-web: 检测到 DeepSeek harness 已重启，撤下「需要重启」提示");
  }
  if (!readRestartState(relayDir).pending && pluginInstalledAfterBoot()) {
    // 唯一还需要用户动一下的情形:插件文件晚于本进程启动才落盘(= 运行中被市场安装/在线更新改写),
    // 此时本进程里没有本插件的路由与面板。**先让用户刷新页面**(客户端半随之更新);
    // 只有刷新后仍无面板才需要重启(那时多半是 profile patch 行没被 HMR 读到)。
    // 不再对"首次安装/在线更新完成"提示重启:插件走 patch 热加载、bridge 是独立进程,重启 harness 无必要。
    markRestartPending(relayDir, "refresh", "插件已更新，刷新页面即可生效");
    ctx.logger?.info?.("dsh-remote-web: 插件文件晚于本次进程启动 → 提示刷新页面");
  }
  ctx.effect(() => registerRoutes(ctx, relayDir), "dsh-remote-web: /dsh-remote routes");
  // 0.1.2-rc.1+ 浏览器会话代持：换取 Harness 会话 Cookie 供 bridge 上游携带（手机点设备不再 401 白页）
  ctx.effect(() => scheduleHarnessMint(ctx, relayDir), "dsh-remote-web: harness browser-session mint");
  // 目录选择器:远程控制下必须用浏览器内实现(否则手机点「添加工作区」像没反应) —— 见上方长注释
  // ⚠️ **必须延后**：绝不能在 apply() 里直接切 Loader —— 会把宿主启动拖成假死（2026-09-26 故障，
  //    见 schedulePickerPin 上方长注释）。schedulePickerPin 自己等"宿主已 listen + 静置"再动手。
  ctx.effect(() => schedulePickerPin(ctx), "dsh-remote-web: pin browser directory picker");
  // 插件市场一键全功能:缺桌面运行环境则自动安装,登录后自动拉起 bridge(不依赖用户跑 npx)
  ctx.effect(() => scheduleRuntime(relayDir), "dsh-remote-web: runtime self-provision");
  // 匿名遥测：插件停摆（卸载/重载）时停掉发送心跳；磁盘队列留给下次装载补发。
  ctx.effect(() => () => telemetryStop(relayDir), "dsh-remote-web: telemetry flush ticker");
  // 【0.6.2】市场安装路径的「装到用户电脑上」第一步：插件加载即后台补装桌面运行环境
  // （bridge + 自启动），不再等用户先登录、也不再依赖 launchd 状态判断是否「已在运行」。
  // 已就绪时是零副作用 no-op；正在安装中/已卸载时 ensureRuntime 自身幂等挡下。
  const provisioned = ensureRuntime(relayDir);
  if (!provisioned && !runtimeReady(relayDir)) {
    ctx.logger?.info?.(`dsh-remote-web: 桌面运行环境缺失，已在后台自动安装（relayDir=${relayDir}）`);
    telemetryRuntimeProbe(relayDir); // 匿名遥测：记下「本进程见过运行环境缺失」（装好后发 runtime_ready）
  }
  // 插件启动即上报本机安装信息（install_source/version + 主机 OS/架构；仅有账号凭据时上报，失败静默）。
  // 面板登录成功（POST /dsh-remote/config）时会再上报一次，覆盖「已登录用户升级插件」的约定。
  maybeReportInstall(relayDir);
  ctx.logger?.info?.(`dsh-remote-web: /dsh-remote routes ready (relayDir=${relayDir})`);
```

</details>

**依据 4 · 源码核查**：[scripts/bundle-runtime.mjs:88-114](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/scripts/bundle-runtime.mjs#L88-L114)

实际打包运行时与检查，属于同仓依赖原件。

<details>
<summary>查看原文（27行）</summary>

```text
  const setupSrc = path.join(ROOT, "dsh-setup.mjs");
  const clientsSrc = path.join(ROOT, "clients");
  if (!fs.existsSync(setupSrc)) fail(`找不到入口脚本：${setupSrc}`);
  if (!fs.existsSync(clientsSrc)) fail(`找不到 clients 目录：${clientsSrc}`);
  const ws = findWs();
  if (!ws) fail("找不到依赖 ws（先 npm install / pnpm install）：bridge 的 dsh-bridge.mjs 顶层 import 它，缺了必崩");

  fs.rmSync(outDir, { recursive: true, force: true }); // 幂等：每次重建，绝不让上一版的残留混进来
  fs.mkdirSync(outDir, { recursive: true });
  fs.copyFileSync(setupSrc, path.join(outDir, "dsh-setup.mjs"));
  const files = copyTree(clientsSrc, path.join(outDir, "clients"));
  copyTree(ws, path.join(outDir, "node_modules", "ws"));
  return { files };
}

/** 自检：REQUIRED + 入口脚本点名的文件都在（这正是「半装运行环境」的判据）。 */
function check(outDir) {
  const missing = [];
  for (const rel of REQUIRED) if (!fs.existsSync(path.join(outDir, rel))) missing.push(rel);
  try {
    const src = fs.readFileSync(path.join(outDir, "dsh-setup.mjs"), "utf8");
    for (const rel of declaredRuntimeFiles(src)) {
      if (!fs.existsSync(path.join(outDir, rel))) missing.push(rel);
    }
  } catch (e) {
    missing.push(`dsh-setup.mjs 不可读（${e.message}）`);
  }
```

</details>

#### 缺口

- 发行包完整性、真实公网/手机功能与同任务收益未独立验证。
  **影响**：不能把配置面板或作者100%描述当完整远程验收。
  **进一步探讨**：在可丢弃Host比较VPN原生Web与本插件，核任务、审批和撤销访问。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 插件如何从Host接到bridge，远程浏览器凭什么通过认证？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply保存当前Host上下文，发布实际上游端口并后台发现；注册路由后调度cookie代持、运行时自愈。新Host的connection.authenticatedUrl生成本机token URL，插件fetch换取dsh-auth Cookie，按127.0.0.1:port的authority写单独文件，并写旧版镜像，0600/ACL加固。这是把已授权浏览器完整访问权交给bridge，并非手机每次独立走Host原始token确认。缺connection/端口或cookie格式不符返回false，不能仅凭有运行进程认为手机已获权。

实际bridge清洗手机Host/Origin/Cookie/Sec-Fetch等头；WebSocket构建上游Host并附harnessCookieOf取到的Host Cookie，HTTP stream同样加Cookie再fetch上游。故本地路由的Host/Origin围栏会把已通过隧道的请求看作本机请求，真正远程身份与设备授权依赖上层relay/bridge，不可把这层本地跨站检查当手机用户鉴权。authority分文件防不同Host端口互相覆盖，原件来自同仓依赖而非本组件独立实现。

补装优先复制发行包runtime中的setup/clients/node_modules，自检missing后才成功；缺运行时或复制不完整会经npx --yes UPDATE_SPEC后台安装，registry强制官方源，带marker/进度看门狗和退避。该分支意味着加载组件可能自动产生网络和执行安装器，而非用户点启动才执行。这里只读核查，未触发任何安装/登录/连接。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web/lib/index.js:1130-1165](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L1130-L1165)

Host authenticatedUrl→Cookie→authority文件及失败。

<details>
<summary>查看原文（36行）</summary>

```text
async function mintHarnessCookie(ctx, relayDir) {
  if (UNINSTALLED_DIRS.has(relayDir)) return false; // 已彻底卸载：不再代持会话、不再重建配置目录
  try {
    const port = ctx.webServer?.port;
    if (!port) return false;
    // 不能把 "connection" 写进 inject(0.1.1 无该服务会拖死激活),只能运行时 try 获取
    let holder;
    try { holder = ctx.get("connection"); } catch { holder = void 0; }
    if (!holder && ctx.connection !== void 0) { try { holder = ctx.connection; } catch { /* ignore */ } }
    const svc = holder && typeof holder.authenticatedUrl === "function"
      ? holder
      : holder && holder.connection && typeof holder.connection.authenticatedUrl === "function"
        ? holder.connection
        : null;
    if (!svc) return false; // 老版本无浏览器鉴权 → 无需 cookie
    const tokenUrl = svc.authenticatedUrl(`http://127.0.0.1:${port}`);
    const res = await fetch(tokenUrl, { redirect: "manual", signal: AbortSignal.timeout(6000) });
    const cookie = setCookieOf(res).split(";")[0].trim();
    if (!cookie || !cookie.startsWith("dsh-auth-")) return false;
    // 竞态兜底：fetch 期间用户点击了「彻底卸载」→ 不得重建已被清空的配置目录
    if (UNINSTALLED_DIRS.has(relayDir)) return false;
    const out = { authority: `127.0.0.1:${port}`, cookie, mintedAt: Date.now() };
    mkdirSync(dirname(configPathOf(relayDir)), { recursive: true });
    // ① 本宿主专属文件(权威,两个宿主互不覆盖 —— 故障根治点)
    const ownPath = join(relayDir, harnessCookieFileFor(out.authority));
    writeFileSync(ownPath, JSON.stringify(out, null, 2), { mode: 0o600 });
    hardenFile(ownPath); // 会话 Cookie ≈ dsh web 的完整访问权，同样要收紧
    // ② 旧版共享文件镜像:只为还跑着旧桥(<0.7.0-beta.2)的机器保留 —— 新桥优先读 ①,
    //    且对 authority 不符的镜像**直接跳过**,所以这里写镜像不会再引发乒乓。
    const legacyPath = join(relayDir, HARNESS_COOKIE_FILE);
    writeFileSync(legacyPath, JSON.stringify(out, null, 2), { mode: 0o600 });
    hardenFile(legacyPath);
    return true;
  } catch {
    return false;
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web/lib/index.js:2198-2267](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L2198-L2267)

runtime来源、复制/自检与回退。

<details>
<summary>查看原文（70行）</summary>

```text
/**
 * 本插件自带的运行环境目录（lib/ → ../runtime）；仓库开发形态/未打包时返回 null。
 * DSH_RELAY_BUNDLED_RUNTIME 可显式指定（测试/诊断用；指向不存在的目录 = 强制走 npx 兜底分支）。
 */
function readBundledRuntime() {
  const override = String(process.env.DSH_RELAY_BUNDLED_RUNTIME || "").trim();
  if (override) return existsSync(join(override, "dsh-setup.mjs")) ? override : null;
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const cand = join(here, "..", "runtime");
    return existsSync(join(cand, "dsh-setup.mjs")) ? cand : null;
  } catch { return null; }
}

/** 自带运行环境拷贝失败的退避（避免每次面板轮询都重试同一件不可能的事）。 */
const bundledCopyFails = new Map(); // relayDir → nextAt

/**
 * 用插件自带的运行环境就地补装（纯本地拷贝）。
 * @returns {{ok:boolean, reason?:string, detail?:string, missing?:string[]}}
 */
function provisionFromBundledRuntime(relayDir) {
  const src = readBundledRuntime();
  if (!src) return { ok: false, reason: "no-bundled-runtime" };
  if (skipsSystemOps()) return { ok: false, reason: "skipped" };
  if (Date.now() < (bundledCopyFails.get(relayDir) || 0)) return { ok: false, reason: "backoff" };
  try {
    mkdirSync(relayDir, { recursive: true });
    copyFileSync(join(src, "dsh-setup.mjs"), join(relayDir, "dsh-setup.mjs"));
    for (const dir of ["clients", "node_modules"]) {
      const from = join(src, dir);
      if (!existsSync(from)) continue;
      cpSync(from, join(relayDir, dir), { recursive: true, force: true });
    }
    // 版本标记：与插件同版（诊断据此显示「运行时 x.y.z」）
    try { writeFileSync(join(relayDir, ".dsh-setup-version"), `${PLUGIN_VERSION}\n`); } catch { /* 非关键 */ }
    const missing = missingRuntimeFiles(relayDir);
    if (missing.length) {
      bundledCopyFails.set(relayDir, Date.now() + 60_000);
      return { ok: false, reason: "incomplete", missing };
    }
    bundledCopyFails.delete(relayDir);
    return { ok: true };
  } catch (e) {
    bundledCopyFails.set(relayDir, Date.now() + 60_000);
    return { ok: false, reason: "copy-failed", detail: e.message };
  }
}

function ensureRuntime(relayDir) {
  if (UNINSTALLED_DIRS.has(relayDir)) return false; // 已彻底卸载：不再自动安装运行环境
  if (runtimeReady(relayDir)) return true;
  if (skipsSystemOps()) return false; // 测试隔离：绝不在用例里 spawn 真实 npx 安装
  // ① 插件自带的运行环境优先：本地拷贝即可，**不经过 npx、不联网**。
  //    这一条同时治好「半装运行环境」（runtimeReady 为假 → 整份重拷 → 自检通过才算成功）。
  const local = provisionFromBundledRuntime(relayDir);
  if (local.ok) {
    appendLogLine(relayDir, AUTO_INSTALL_LOG,
      `[dsh-remote-web] 已用插件自带的运行环境就地补齐（v${PLUGIN_VERSION}，本地拷贝，未使用 npx）`);
    backupConfigFile(relayDir); // 安装完成后备份配对信息（文件不存在则静默跳过；内容绝不写日志）
    telemetryRuntimeReady(relayDir);
    return true;
  }
  if (local.reason === "incomplete") {
    appendLogLine(relayDir, AUTO_INSTALL_LOG,
      `[dsh-remote-web] 自带运行环境拷贝后仍不完整（缺 ${local.missing.slice(0, 3).join(", ")}）→ 转 npx 补装`);
    telemetryRecord(relayDir, "install_failed", { fail_code: "install_script_missing" });
  }
  // ② 兜底：npx 补装（老路径保持不变；仓库开发形态、或没打包 runtime/ 的安装形态走这里）
  const gate = provisionRetryGate(relayDir);
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web/lib/index.js:2289-2330](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L2289-L2330)

实际npx spawn、环境与marker/看门狗。

<details>
<summary>查看原文（42行）</summary>

```text
    };
    let stalledInstall = false; // 本轮是否因"长时间无输出"被判卡住（归因用）
    const npx = npxInvocation();
    const { child, error } = safeSpawn(npx.command, [...npx.args, "--yes", UPDATE_SPEC], {
      detached: true,
      // Windows 上跑 npx.cmd 必须经 shell（Node ≥20.12 起否则 EINVAL）；走 node+npx-cli.js 时不需要。
      shell: npx.shell,
      // Windows：别让 Node 给子进程开一个控制台窗口（POSIX 上该选项被忽略）
      windowsHide: true,
      // DSH_BRIDGE_INSTALL_SOURCE：本机运行环境是插件自愈补的 → 安装器原样透传到 plist/bridge env，
      // 于是设备行上的 install_source 如实记成 plugin_market（而不是安装器默认的 npx）。
      // DSH_BRIDGE_HARNESS_VERSION 同理：安装器会把它写进 plist；不给的话，桥重启后就丢了宿主版本。
      env: spawnEnv({ npm_config_registry: "https://registry.npmjs.org", DSH_BRIDGE_INSTALL_SOURCE: "plugin_market", DSH_BRIDGE_HARNESS_VERSION: harnessVersion() }),
      stdio: ["ignore", openSync(log, "a"), openSync(log, "a")],
      onError: (e) => failSpawn(e, npx.kind),
    });
    if (error || !child) {
      failSpawn(error || new Error("spawn 未返回子进程"), npx.kind);
      return false;
    }
    writeMarker(marker, child.pid); // 记 pid：宿主重启后可立即清理死进程残留
    // 【0.6.9 关键修复】补装同样要有无输出看门狗。
    // 这一条直接对应"面板注册完成、设备却没有上报"的装机流失：npx 拉取在"连得上但传不动"的
    // 链路上会**挂起**（进程活着、永远不产出 exit），旧实现只在"pid 死 或 标记超 10 分钟"时才清理，
    // 于是卡住的安装能吃满 10 分钟退避窗口、反复失败；用户看到的是"正在安装…"永远不动。
    startProgressWatch(watchKey, {
      relayDir, logName: AUTO_INSTALL_LOG, kind: "install",
      getChild: () => child,
      onStall: (idle) => {
        stalledInstall = true;
        appendLogLine(relayDir, AUTO_INSTALL_LOG,
          `[auto-install] 已 ${Math.round(idle / 1000)}s 无输出 → 判定卡住，结束该进程并按失败处理（下一轮会重试）`);
      },
    });
    // 记下「本机运行环境是插件自愈补的」：登录后的 /api/install-report 与 bridge 设备登记
    // 都据此上报 install_source=plugin_market（区分用户自己跑 npx 安装器的那条路径）。
    try {
      writeFileSync(join(relayDir, PROVISIONED_MARKER),
        JSON.stringify({ at: Date.now(), version: PLUGIN_VERSION, source: "plugin_market" }));
    } catch { /* 非关键：上报时按缺省判据降级 */ }
    // 匿名遥测：补装生命周期（install_started → runtime_ready / install_failed(fail_code)）。
    // 失败原因只归类到白名单 fail_code，绝不外发原始错误文本（可能含路径/主机名/用户名）。
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web/lib/index.js:8621-8633](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L8621-L8633)

实际端口发布/发现。

<details>
<summary>查看原文（13行）</summary>

```text
export function apply(ctx, config = {}) {
  const relayDir = config.relayDir || process.env.DSH_RELAY_DIR || DEFAULT_RELAY_DIR;
  // 记住宿主 ctx：上游地址要问 dsh web 自己的监听端口（见 upstreamUrl）。
  // 存 ctx 而不是当场取端口：apply 可能早于 webServer.listen 完成，端口那时还是 0/undefined。
  webServerCtx = ctx;
  // 上游地址落盘（0.6.12）：系统自启拉起的守护没有本进程的 env，只认这个文件。
  publishUpstream(relayDir);
  // 【0.6.15】问不到自己监听端口时（飞牛/NAS 实测就是这种情况）主动发现一次并固化：
  // watcher/bridge 是独立进程，只有这里知道 dsh web 真实在哪个端口。fire-and-forget，
  // 发现完 /dsh-remote/bridge-status 的下一轮轮询与自愈就会用上正确地址。
  void discoverUpstreamSelf(relayDir).catch(() => FALLBACK_UPSTREAM);
  // 全新激活（dsh web 重启后插件重新加载，或卸载后再次安装）→ 解除上次的「已卸载」停摆标记
  UNINSTALLED_DIRS.delete(relayDir);
```

</details>

**依据 5 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:570-580](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L570-L580)

bridge剥离手机源与cookie头。

<details>
<summary>查看原文（11行）</summary>

```text
//  - Origin/Sec-Fetch-*/Referer:围栏里 cross-site / 异源 Origin 会被拒,必须剥掉。
//  - Cookie:手机侧的 cookie 属于手机域名,与 dsh web 无关,不应透传。
//  - content-length/transfer-encoding:由 fetch/ws 自己计算。
const STRIP_REQ_HEADERS = new Set([
  "host", "origin", "referer", "cookie", "connection", "upgrade",
  "keep-alive", "transfer-encoding", "content-length", "accept-encoding",
  "sec-fetch-site", "sec-fetch-mode", "sec-fetch-dest", "sec-fetch-user",
  "te", "trailer", "proxy-connection", "x-forwarded-for", "x-forwarded-proto",
  "x-forwarded-host"
]);
// 回包时剥离的实体头:undici 已自动解压 body,content-encoding/length 会误导浏览器。
```

</details>

**依据 6 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:899-933](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L899-L933)

实际清洗和WS附Host Cookie。

<details>
<summary>查看原文（35行）</summary>

```text
/** 清洗手机发来的请求头:剥离浏览器标记,保留其余(供 fetch 转发)。 */
export function sanitizeRequestHeaders(headers) {
  const out = {};
  for (const [k, v] of Object.entries(headers || {})) {
    const lk = k.toLowerCase();
    if (STRIP_REQ_HEADERS.has(lk)) continue;
    if (v === undefined || v === null || v === "") continue;
    out[k] = Array.isArray(v) ? v.join(", ") : String(v);
  }
  return out;
}

/** 清洗上游响应头:剥离实体/传输头,避免误导浏览器解码。 */
export function sanitizeResponseHeaders(headers) {
  const out = {};
  for (const [k, v] of Object.entries(headers || {})) {
    const lk = k.toLowerCase();
    if (STRIP_RES_HEADERS.has(lk)) continue;
    if (v === undefined || v === null || v === "") continue;
    out[k] = Array.isArray(v) ? v.join(", ") : String(v);
  }
  return out;
}

/** ws 库用的请求头:Host 显式写成上游 authority(loopback),其余同 sanitize。 */
export function buildWsHeaders(headers) {
  const up = new URL(UPSTREAM);
  const out = sanitizeRequestHeaders(headers);
  out.Host = up.host; // e.g. "127.0.0.1:3080"
  const ck = harnessCookieOf(); // 新版 dsh web 的浏览器会话 Cookie
  if (ck) out.Cookie = ck;
  return out;
}

// ============================================================
```

</details>

**依据 7 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:1172-1187](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L1172-L1187)

HTTP stream实际附Cookie并请求上游。

<details>
<summary>查看原文（16行）</summary>

```text
 */
async function doHttpStream(send, id, method, path, reqHeaders) {
  const safe = safePath(path);
  if (safe === null) throw new Error("非法路径");
  const reqHdrs = sanitizeRequestHeaders(reqHeaders);
  const ck = harnessCookieOf(); // 新版 dsh web 的浏览器会话 Cookie(否则 401 白页)
  if (ck) reqHdrs.Cookie = ck;
  const controller = new AbortController();
  streamAborts.set(id, controller);

  let res;
  try {
    res = await fetch(`${UPSTREAM}${safe}`, { method, headers: reqHdrs, signal: controller.signal });
  } catch (e) {
    streamAborts.delete(id);
    throw e; // 头部都还没发出去 → 交给调用方回一个普通错误帧
```

</details>

#### 缺口

- 完整relay手机登录/设备撤销/bridge帧授权与Host connection实现不在本包研究范围。
  **影响**：完整远程身份安全不能由本包Cookie机制证明。
  **进一步探讨**：联测错误账号、撤销设备、错误authority与Host重启，分别核relay、bridge及原生Host回执。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地围栏与加密是否构成同一种安全保证？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

所有注册路由先核localRequestBlocked：Host必须回环/私网/显式可信名单，非null Origin的host要匹配，Sec-Fetch-Site cross-site拒绝；环境DSH_REMOTE_LOCAL_GUARD=0可关闭。它挡典型浏览器跨站，但没有在handler里独立用户认证；私网Host也允许、无Origin可放行，非浏览器能自构头，因此实际监听/外层认证与网络隔离仍是部署前提。不能从“同源路由”推断只有本机owner可访问，也不把缺用户鉴权直接说成已验证公网漏洞。远程bridge主动剥Origin等头，是既定信任代理设计。

加密还分运输TLS与端到端内容。补读实际bridge initE2ee：自建local_key模式不启用，环境/config可关闭，账号模式把allowed/password/token传E2eeService，未enabled时明确保留v1明文帧路径继续隧道。这里“明文v1”是协议内容未端到端加密，不等网络一定无TLS；不应沿用全程加密而省略中继可见性条件。E2eeService内部密码派生/服务参数及移动端完整密钥信任本次未审，不能宣称独立密码学审计通过。

配置含账号密码和本机Cookie。saveConfig明文JSON后做权限收紧，Windows icacls失败仅警告不阻断；POSIX chmod失败也不致命。0600/ACL是访问控制，不是磁盘加密，备份、同步和同用户进程仍需视为有密钥权限。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web/lib/index.js:7500-7517](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L7500-L7517)

完整localRequestBlocked实际判定和关闭开关。

<details>
<summary>查看原文（18行）</summary>

```text
export function localRequestBlocked(req) {
  if (String(process.env.DSH_REMOTE_LOCAL_GUARD || "") === "0") return null;
  const extra = String(process.env.DSH_REMOTE_TRUSTED_HOSTS || "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const headers = (req && req.headers) || {};
  const host = String(headers.host || "").trim().toLowerCase();
  if (!host) return "missing-host";
  if (!LOOPBACK_HOST_RE.test(host) && !PRIVATE_HOST_RE.test(host) && !extra.includes(host)) return "bad-host";
  const origin = String(headers.origin || "").trim().toLowerCase();
  // Origin: null（file:// 或 sandbox iframe）不在这里判，交给下面的 sec-fetch-site
  if (origin && origin !== "null") {
    let oh = "";
    try { oh = new URL(origin).host.toLowerCase(); } catch { return "bad-origin"; }
    if (oh !== host && !extra.includes(oh)) return "origin-mismatch";
  }
  if (String(headers["sec-fetch-site"] || "").trim().toLowerCase() === "cross-site") return "cross-site";
  return null;
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web/lib/index.js:8316-8357](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L8316-L8357)

每个路由实际套guard与错误处理。

<details>
<summary>查看原文（42行）</summary>

```text
  const disposers = [];
  for (const route of routes) {
    const dispose = ctx.webServer.register({
      kind: route.prefix ? "prefix" : "exact",
      path: route.path,
      handler: (req, res) => {
        const url = new URL(req.url ?? "/", "http://x");
        const match = route.prefix
          ? url.pathname === route.path || url.pathname.startsWith(route.path + "/")
          : url.pathname === route.path;
        const methodOk = route.method === "ALL" || req.method === route.method;
        if (!match || !methodOk) {
          res.writeHead(404);
          res.end();
          return;
        }
        // 跨站防护：详见 localRequestBlocked 的注释（DNS rebinding / CSRF）
        const blocked = localRequestBlocked(req);
        if (blocked) {
          const now = Date.now();
          const last = LOCAL_GUARD_LOGGED.get(blocked) || 0;
          if (now - last > 60_000) {
            LOCAL_GUARD_LOGGED.set(blocked, now);
            ctx.logger?.warn?.(
              `dsh-remote-web: 已拦截跨站请求 ${route.method} ${route.path}（${blocked}）` +
              ` host=${req.headers?.host || "-"} origin=${req.headers?.origin || "-"}`
            );
          }
          sendJson(res, 403, { ok: false, error: "forbidden", reason: blocked });
          return;
        }
        Promise.resolve(route.handler(req, res)).catch((e) => {
          ctx.logger?.warn?.(`dsh-remote-web: ${route.method} ${route.path} failed: ${e?.stack || e}`);
          if (!res.headersSent) sendJson(res, 500, { ok: false, error: String(e?.message || e) });
          else res.end();
        });
        return; // webserver 不需要返回值；返回 void 保持 node:http 语义
      },
    });
    disposers.push(dispose);
  }
  return () => {
```

</details>

**依据 3 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:2615-2633](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L2615-L2633)

实际E2EE条件、自建禁用与初始化。

<details>
<summary>查看原文（19行）</summary>

```text
 * E2EE 启动初始化(账号模式):拉取服务端参数 → 用本机账号密码派生 MK(仅内存)。
 * 任何一步不满足都禁用 E2EE(reason 记录),bridge 走原 v1 明文路径,不影响隧道。
 * 启用结果写入 relayDir/.e2ee-state.json(供 Phase-4 UI 读取:{enabled, reason, ...})。
 * 状态文件路径策略:显式 DSH_BRIDGE_CONFIG / DSH_BRIDGE_E2EE_STATE 时落盘(生产必设),
 * 否则只打日志(避免污染仓库/非托管目录)。
 */
async function initE2ee(token) {
  const cfg = loadLocalConfig();
  const localMode = Boolean(process.env.DSH_BRIDGE_LOCAL_KEY); // 自建模式不启用(§6.6)
  const userDisabled = process.env.DSH_BRIDGE_E2EE === "0" || cfg.e2ee === false;
  const allowed = !localMode && !userDisabled;
  // 密码与 device-login 同源:env 优先,其次 .dsh-config.json(本机 0600 保存的账号密码)
  const password = PASSWORD || (typeof cfg.password === "string" && cfg.password ? cfg.password : "");
  e2ee = await E2eeService.init({ apiBase: API_BASE, token, password, allowed });
  const st = e2ee.state();
  const stateFileDir = process.env.DSH_BRIDGE_E2EE_STATE || path.dirname(CONFIG_PATH);
  if (process.env.DSH_BRIDGE_CONFIG || process.env.DSH_BRIDGE_E2EE_STATE) {
    writeE2eeStateFile(stateFileDir, { enabled: st.enabled, reason: st.reason, profile: st.profile, epoch: st.epoch, caps: e2ee.caps() });
  }
```

</details>

**依据 4 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:2650-2662](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L2650-L2662)

未启用仍v1继续。

<details>
<summary>查看原文（13行）</summary>

```text
      // 丢弃 = 手机手里的旧票必然对不上：后续 ws-open/HTTP 会带 retryable 的 rehandshake 信号，
      // 手机自动重建会话而不是让用户去输密码。
      console.log(`[bridge] E2EE 会话存储已作废(${store.discarded})，手机端将自动重新握手`);
    }
    if (storeDir && storeEnabled) {
      console.log(`[bridge] 🔒 E2EE 已启用(caps=[${e2ee.caps().join(",")}], profile=${st.profile}, epoch=${st.epoch});MK 仅驻内存,会话库加密落盘`);
    } else {
      console.log(`[bridge] 🔒 E2EE 已启用(caps=[${e2ee.caps().join(",")}], profile=${st.profile}, epoch=${st.epoch});MK 仅驻内存(会话库未落盘)`);
    }
  } else {
    console.log(`[bridge] e2ee 未启用(${st.reason}) → 明文 v1 路径照常(能力不上报)`);
  }
}
```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web/lib/index.js:714-728](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L714-L728)

配置明文JSON写入并harden。

<details>
<summary>查看原文（15行）</summary>

```text
function loadConfig(relayDir) {
  try {
    return JSON.parse(readFileSync(configPathOf(relayDir), "utf8"));
  } catch {
    return {};
  }
}

function saveConfig(relayDir, cfg) {
  mkdirSync(dirname(configPathOf(relayDir)), { recursive: true });
  // mode 0o600：与 dsh-setup.mjs 一致（文件已存在时 writeFileSync 不改权限，显式 chmod 兜底）
  writeFileSync(configPathOf(relayDir), JSON.stringify(cfg, null, 2), { mode: 0o600 });
  hardenFile(configPathOf(relayDir)); // Windows 上 mode 是空操作 → 显式收紧 ACL（内含明文账号密码）
  try {
    chmodSync(configPathOf(relayDir), 0o600);
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web/lib/index.js:290-313](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L290-L313)

POSIX/Windows加固失败不阻断。

<details>
<summary>查看原文（24行）</summary>

```text
function hardenFile(file) {
  try { fs.chmodSync(file, 0o600); } catch { /* POSIX 上失败不致命 */ }
  if (process.platform !== "win32") return;
  const who = [process.env.USERDOMAIN, process.env.USERNAME].filter(Boolean).join("\\");
  // 两个环境变量都取不到时**绝不能静默返回**：那会让人以为文件已加固，实际仍是继承 ACL。
  // 正常 Windows 会话不会走到这里（USERNAME 必然存在），但受限令牌/服务账户下有可能。
  if (!who) {
    if (!hardenWarned) {
      hardenWarned = true;
      console.warn(`⚠️ 无法收紧文件权限（USERDOMAIN/USERNAME 均未设置）：${file}`);
    }
    return;
  }
  let r;
  try {
    r = spawnSync("icacls", [file, "/inheritance:r", "/grant:r", `${who}:F`],
      { windowsHide: true, encoding: "utf8", timeout: 8000 });
  } catch (e) { r = { status: -1, stderr: e.message }; }
  if (r.status !== 0 && !hardenWarned) {
    hardenWarned = true;
    console.warn(`⚠️ 收紧文件权限失败（${who}）：${String(r.stderr || "").trim() || `icacls 退出码 ${r.status}`}`);
    console.warn("   配置文件可能仍可被其它账户/备份工具读取，请自行确认其存放位置。");
  }
}
```

</details>

#### 缺口

- Host外层访问认证、完整E2EE密码学/供应链和实际部署的TLS未知。
  **影响**：不能保证relay不可见内容、默认安全或无越权。
  **进一步探讨**：非敏感profile核未认证LAN访问/跨站拒绝、关闭E2EE状态提示与撤销，必要时回VPN原生Web。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 后台自愈、遥测和退出使采用承担哪些成本？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

scheduleRuntime按周期检查运行时，缺则补装；有账号密码或local_key后才自动拉bridge。startBridge按Windows detached/Linux路径/macOS launchd分支，macOS发现运行时缺失先补装，避免空服务崩溃循环。stop在Linux同时停user systemd并清后台进程，macOS跨launchd域bootout后回查是否仍运行；停止结果不是远程已发动作撤销，也不能把全平台服务经理分支静态存在当实际兼容通过。

插件默认开启遥测，环境DSH_REMOTE_TELEMETRY=0/false/off/no关闭。apply即启动队列/心跳并记plugin_loaded；事件白名单含版本/Host版本/OS/架构/Node主版，失败仅白名单分类，性能事件带时间/耗时。这些限制比上传任意错误窄，但仍有默认外发和安装标识/磁盘队列，不能说不联网或没有数据成本。账号安装信息上报也是单独能力，不可把遥测关闭等同所有平台网络都关。

首次需信任插件代码与自动安装分支、选SaaS或自建、确认Host端口/外层认证和凭据留存；持续承担机器在线、带宽/账号套餐或自建运维、模型费与人审，具体价格未核。包声明PolyForm非商业许可，收费/商用部署需自行核许可与具体服务条款，不把开源仓库当无限商业授权。

退出先停bridge并独立核系统服务/进程与手机访问，再撤账号设备/密钥，去profile patch并按归属处理配置/Cookie/备份和远程数据；仅卸客户端/关浏览器不等停止后台。本次没有逐审彻底卸载所有删除分支，不能承诺一次按钮清尽。当前只能对个人非敏感Host受限试用，失败回VPN/SSH加原生Web，未知副作用不盲重试。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web/lib/index.js:2750-2783](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L2750-L2783)

补装调度与账号门槛。

<details>
<summary>查看原文（34行）</summary>

```text
function scheduleRuntime(relayDir) {
  let done = false;
  // 本进程启动时是否缺运行环境：缺 → 补齐完成后需要重启 DeepSeek harness 才算「安装完成」。
  let awaitingRestartHint = !runtimeReady(relayDir);
  const iv = setInterval(() => {
    if (done) { clearInterval(iv); return; }
    if (UNINSTALLED_DIRS.has(relayDir)) { done = true; clearInterval(iv); return; } // 已彻底卸载：自愈 watcher 停摆
    try {
      if (!runtimeReady(relayDir)) {
        reapBrokenAutostart(relayDir); // 先摘掉指向不存在脚本的自启动，止住崩溃循环
        ensureRuntime(relayDir);       // 后台 npx 补齐（marker 防重入）；就绪后下一轮自动拉起
        telemetryRuntimeProbe(relayDir); // 匿名遥测：补装超时归类（runtime_install_timeout）
        return;
      }
      telemetryRuntimeProbe(relayDir); // 匿名遥测：环境刚补齐 → runtime_ready（每进程一次）
      if (awaitingRestartHint) {
        awaitingRestartHint = false;
        // 运行环境刚在本进程内补齐 —— **不需要重启 harness**：
        //   · bridge 是独立 launchd 进程，补齐后自愈调度会直接把它拉起；
        //   · 插件本体走 patch 热加载，装完即生效。
        // 以前这里会 markRestartPending("first-install") 弹出"需要重启 DeepSeek harness"横幅，
        // 在热加载落地后已经变成纯粹的误导（用户实测反馈），故移除。
      }
      const cfg = loadConfig(relayDir);
      const hasAcct = Boolean((cfg.phone || cfg.email) && cfg.password) || Boolean(cfg.local_key);
      if (!hasAcct) return;
      // ── ① 权威判据（按平台各问各的服务管理器）──
      // 运行环境已在，看服务是否已在运行（runtime 可能位于 npx 缓存/固化目录，不必重复安装）
      const st = launchdStatus();
      if (st.running) {
        done = true; clearInterval(iv); resetSelfhealGuard(relayDir);
        logSelfhealReady(relayDir, cfg, `launchd state=${st.state || "running"}`);
        return;
      }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-remote-web/lib/index.js:2657-2695](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L2657-L2695)

平台启动分支、缺运行时补装。

<details>
<summary>查看原文（39行）</summary>

```text
function startBridge(relayDir) {
  if (UNINSTALLED_DIRS.has(relayDir)) {
    // 已彻底卸载：面板/自愈在重启前可能仍在内存中，禁止再把自启动与 plist 拉回来
    return { ok: false, status: "uninstalled", detail: "插件已彻底卸载，重启 dsh web 后生效" };
  }
  if (isWindows()) return startBridgeDetached(relayDir);
  // Linux（含飞牛/群晖这类 NAS）：阶梯见 startBridgeLinux —— 0.6.14 及更早这里只有
  // `unsupported` 一条死路，bridge 在 Linux 上**从来没被拉起来过**。
  if (isLinux()) return startBridgeLinux(relayDir);
  const plistPath = launchAgentPath();
  if (!plistPath) {
    return {
      ok: false,
      status: "unsupported",
      detail: `当前平台（${osPlatform()}）暂不支持自启动服务，请手动运行 \`dsh-remote run\``,
    };
  }
  if (skipsSystemOps()) return { ok: false, status: "skipped", detail: "测试隔离（DSH_RELAY_SKIP_SERVICE=1）：跳过真实服务操作" };
  // 【0.6.2 关键修复】运行环境缺失时绝不 bootstrap：写一个指向不存在脚本的 plist
  // 只会让 launchd 进入 KeepAlive 崩溃循环——面板还可能因瞬时 pid 谎报「已启动」。
  // 正确做法：先把运行环境补起来（后台 npx），就绪后由 scheduleRuntime / 面板再次启动。
  if (!runtimeReady(relayDir)) {
    ensureRuntime(relayDir);
    return {
      ok: false,
      status: "provisioning",
      runtimeMissing: true,
      detail: "桌面运行环境（bridge）尚未安装，已在后台自动安装，完成后会自动启动 bridge——请稍候刷新面板（也可点下方「一键更新」查看进度）",
    };
  }
  // plist 存在但入口不是当前运行环境（relayDir 变更/旧安装）→ 重写，避免又指到失效路径
  if (existsSync(plistPath) && !readFileSync(plistPath, "utf8").includes(join(relayDir, "dsh-setup.mjs"))) {
    writeAutostartFile(relayDir);
  }
  if (!existsSync(plistPath)) writeAutostartFile(relayDir);
  if (!existsSync(plistPath)) return { ok: false, status: "not-installed", detail: "plist 生成失败" };
  // 与 dsh-setup.mjs 同一条域阶梯：user/<uid> 优先（macOS 26 上唯一支持 RunAtLoad/KeepAlive 的域），
  // gui/<uid> 兜底（只能靠 kickstart 拉这一次，不保证崩溃自愈）。
  let lastDetail = "";
```

</details>

**依据 3 · 源码核查**：[packages/dsh-remote-web/lib/index.js:2874-2911](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L2874-L2911)

停止systemd/后台/launchd及回查。

<details>
<summary>查看原文（38行）</summary>

```text
function stopBridge(relayDir) {
  if (isWindows()) return stopBridgeDetached(relayDir);
  // 测试隔离：置位时绝不对真实 launchd/systemd 下手（切换账号也会走到这里，
  // 少了这一条，用例就会去 bootout 开发者本机上真实运行的 bridge —— 实测过的污染风险）。
  if (skipsSystemOps()) return { ok: false, status: "skipped", detail: "测试隔离（DSH_RELAY_SKIP_SERVICE=1）：跳过真实服务操作" };
  // ★ Linux（0.6.15）：以前这里直接落到「没有 launchd 服务可停」的死路 —— Linux 用户的
  //   面板「停止」、以及**切换账号时的重置**都会失败（旧 bridge 继续用旧凭据跑）。
  //   现在：有 user systemd 就先停 unit，再统一用脱离进程那条路把 pid 文件/残留进程收干净。
  if (isLinux()) {
    let systemdStopped = false;
    if (systemdUserAvailableCached()) {
      sh("systemctl --user stop dsh-bridge");
      const a = sh("systemctl --user is-active dsh-bridge");
      systemdStopped = !(a.ok && a.stdout.trim() === "active");
    }
    const d = stopBridgeDetached(relayDir);
    if (d.ok) {
      return {
        ok: true,
        status: "stopped",
        pid: null,
        detail: systemdStopped ? "已停止 bridge（systemd --user 与后台进程均已结束）" : void 0,
      };
    }
    return { ...d, detail: [d.detail, systemdStopped ? "systemd unit 已停" : ""].filter(Boolean).join("；") };
  }
  const targets = launchTargets();
  if (!targets.length) return { ok: false, status: "unsupported", detail: `当前平台（${osPlatform()}）没有 launchd 服务可停，请手动结束 \`dsh-remote run\` 进程` };
  // 两个域都要停：作业可能由安装器装在 user/<uid>，而旧版插件只会去 gui/<uid> 找不到（实测故障）
  let lastErr = "";
  for (const target of targets) {
    const r = sh(`launchctl bootout ${target}`);
    if (!r.ok) lastErr = (r.stderr || r.stdout).trim();
  }
  const st = launchdStatus();
  return { ok: !st.running, status: st.running ? "failed" : "stopped", pid: null, detail: st.running ? (lastErr || "停止失败").trim() : void 0 };
}

```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web/lib/index.js:6465-6475](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L6465-L6475)

默认遥测和关闭值。

<details>
<summary>查看原文（11行）</summary>

```text
 * 遥测开关：DSH_REMOTE_TELEMETRY=0/false/off/no → 完全关闭（不生成 install_id、不落文件、不发请求）；
 * 默认开启（=1/true 显式开启）。
 * 另外：DSH_RELAY_SKIP_SERVICE=1（测试/诊断隔离，见 skipsSystemOps）时同样不发送——
 * 本仓库的测试脚本全局设了该变量，用例绝不能把匿名事件发到真实生产端点。
 */
function telemetryEnabled() {
  if (skipsSystemOps()) return false;
  const v = String(process.env.DSH_REMOTE_TELEMETRY ?? "").trim().toLowerCase();
  return !(v === "0" || v === "false" || v === "off" || v === "no");
}

```

</details>

**依据 5 · 源码核查**：[packages/dsh-remote-web/lib/index.js:6733-6761](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L6733-L6761)

实际白名单事件字段。

<details>
<summary>查看原文（29行）</summary>

```text
function telemetryEventOf(name, extra = {}) {
  if (!TELEMETRY_EVENT_NAMES.has(name)) return null;
  const ev = {
    name,
    at: Date.now(),
    version: PLUGIN_VERSION,                                    // 插件自身版本（≠ 宿主版本）
    harness_version: harnessVersion(),                          // 宿主 DSH 版本（运行时探测；未知 = ""）
    channel: telemetryToken(UPDATE_TAG),                        // 更新通道 latest/beta（与"一键更新"同源；未知 = ""）
    os: process.platform,                                       // 仅平台名（darwin/linux/win32），非主机名
    arch: process.arch,                                         // 仅架构（arm64/x64）
    node: String(process.versions?.node || "").split(".")[0],   // 仅主版本号，如 "22"
  };
  if (name === "install_failed" || name === "update_failed") {
    const code = String(extra.fail_code || "");
    ev.fail_code = TELEMETRY_FAIL_CODES.has(code) ? code : "unknown"; // 白名单外 → unknown
  }
  // mirror_load：唯一带**数值**的事件。契约 §2 的两列语义：
  //   · at  = 客户端事件发生时刻（epoch ms）→ 服务端 at_ms
  //   · ms  = 耗时毫秒                      → 服务端 value_ms
  // at 允许缺省（0 = 没给）→ 保留上面那个 Date.now()（= 服务端收包时刻的近似），
  // 但**绝不把 0 发出去**：0 在分析里会被读成"1970 年"，比"没有值"更糟。
  // ms 同样只在有限数时写入（越界/非法由路由先挡掉，这里是第二道防线）。
  if (name === "mirror_load") {
    if (Number.isFinite(Number(extra.at)) && Number(extra.at) > 0) ev.at = Math.round(Number(extra.at));
    if (Number.isFinite(Number(extra.ms))) ev.ms = Math.max(0, Math.min(600000, Math.round(Number(extra.ms))));
    ev.outcome = extra.outcome === "slow" ? "slow" : "ok";
  }
  return ev;
}
```

</details>

**依据 6 · 源码核查**：[packages/dsh-remote-web/lib/index.js:8634-8639](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L8634-L8639)

apply实际启动遥测。

```text
  // 匿名遥测：装载即初始化（读回上次进程遗留的磁盘队列，例如重启前那条 harness_restart，
  // 并启动 60s 发送心跳），随后记一条 plugin_loaded（每进程一次）。
  // DSH_REMOTE_TELEMETRY=0 → 这里连读都不读：零文件、零请求、零 install_id。
  telemetryStart(relayDir);
  telemetryOnce(relayDir, "plugin_loaded");
  // 清理上次进程残留的安装/更新 marker（宿主被重启/强杀时子进程清理回调会丢失）
```

**依据 7 · 源码核查**：[packages/dsh-remote-web/package.json:42-50](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/package.json#L42-L50)

非商业许可与Host版本要求。

```text
  "homepage": "https://github.com/mrRisega/dsh-remote/tree/main/packages/dsh-remote-web#readme",
  "license": "PolyForm-Noncommercial-1.0.0",
  "engines": {
    "dsh": ">=0.1.0-rc.6 <0.3.0-0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.1.0-rc.6 <0.3.0-0"
  }
}
```

#### 缺口

- 套餐价格、跨平台服务/升级回滚、清理彻底性及实际收益未核。
  **影响**：不能推零成本、无损升级或全部卸载。
  **进一步探讨**：在可丢弃profile记录首次与故障人工时间，核禁遥测、停服务和撤设备实际失效。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何把“在线”升级成可验证的远程权限状态？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可验证方向是把Host authority、代持Cookie状态、bridge连接、E2EE实际模式、远程设备授权和撤销结果组成分阶段状态页，并支持策略“必须E2EE才开放指定能力”。基线是当前运行时/连接自愈和可继续v1的兼容设计；增量是让用户知道哪道保证成立，并在不满足策略时拒绝远程控制，不能只换在线图标。

最小对照在同一个非敏感Host上比较现状与策略版，测试端口变化、Cookie失效、E2EE关闭/参数失败、relay掉线和撤销设备。指标是错误绿灯、撤销后仍可控制次数、恢复时间、误拒及人工干预；必须原生任务结果与手机端再次请求双向核验，服务进程活着不计成功。若平台无法输出可信撤销/E2EE状态，显示未知并退VPN，不伪装验证完成。

这是假设，未计入当前创新分；若强策略造成持续误拒而目标用户接受受信中继，或VPN已足够简单，应停止扩展，不把更严格一律等于更有商业价值。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-remote-web/lib/index.js:1130-1165](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L1130-L1165)

Host Cookie/authority状态基础。

<details>
<summary>查看原文（36行）</summary>

```text
async function mintHarnessCookie(ctx, relayDir) {
  if (UNINSTALLED_DIRS.has(relayDir)) return false; // 已彻底卸载：不再代持会话、不再重建配置目录
  try {
    const port = ctx.webServer?.port;
    if (!port) return false;
    // 不能把 "connection" 写进 inject(0.1.1 无该服务会拖死激活),只能运行时 try 获取
    let holder;
    try { holder = ctx.get("connection"); } catch { holder = void 0; }
    if (!holder && ctx.connection !== void 0) { try { holder = ctx.connection; } catch { /* ignore */ } }
    const svc = holder && typeof holder.authenticatedUrl === "function"
      ? holder
      : holder && holder.connection && typeof holder.connection.authenticatedUrl === "function"
        ? holder.connection
        : null;
    if (!svc) return false; // 老版本无浏览器鉴权 → 无需 cookie
    const tokenUrl = svc.authenticatedUrl(`http://127.0.0.1:${port}`);
    const res = await fetch(tokenUrl, { redirect: "manual", signal: AbortSignal.timeout(6000) });
    const cookie = setCookieOf(res).split(";")[0].trim();
    if (!cookie || !cookie.startsWith("dsh-auth-")) return false;
    // 竞态兜底：fetch 期间用户点击了「彻底卸载」→ 不得重建已被清空的配置目录
    if (UNINSTALLED_DIRS.has(relayDir)) return false;
    const out = { authority: `127.0.0.1:${port}`, cookie, mintedAt: Date.now() };
    mkdirSync(dirname(configPathOf(relayDir)), { recursive: true });
    // ① 本宿主专属文件(权威,两个宿主互不覆盖 —— 故障根治点)
    const ownPath = join(relayDir, harnessCookieFileFor(out.authority));
    writeFileSync(ownPath, JSON.stringify(out, null, 2), { mode: 0o600 });
    hardenFile(ownPath); // 会话 Cookie ≈ dsh web 的完整访问权，同样要收紧
    // ② 旧版共享文件镜像:只为还跑着旧桥(<0.7.0-beta.2)的机器保留 —— 新桥优先读 ①,
    //    且对 authority 不符的镜像**直接跳过**,所以这里写镜像不会再引发乒乓。
    const legacyPath = join(relayDir, HARNESS_COOKIE_FILE);
    writeFileSync(legacyPath, JSON.stringify(out, null, 2), { mode: 0o600 });
    hardenFile(legacyPath);
    return true;
  } catch {
    return false;
  }
```

</details>

**依据 2 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:2615-2633](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L2615-L2633)

E2EE模式条件。

<details>
<summary>查看原文（19行）</summary>

```text
 * E2EE 启动初始化(账号模式):拉取服务端参数 → 用本机账号密码派生 MK(仅内存)。
 * 任何一步不满足都禁用 E2EE(reason 记录),bridge 走原 v1 明文路径,不影响隧道。
 * 启用结果写入 relayDir/.e2ee-state.json(供 Phase-4 UI 读取:{enabled, reason, ...})。
 * 状态文件路径策略:显式 DSH_BRIDGE_CONFIG / DSH_BRIDGE_E2EE_STATE 时落盘(生产必设),
 * 否则只打日志(避免污染仓库/非托管目录)。
 */
async function initE2ee(token) {
  const cfg = loadLocalConfig();
  const localMode = Boolean(process.env.DSH_BRIDGE_LOCAL_KEY); // 自建模式不启用(§6.6)
  const userDisabled = process.env.DSH_BRIDGE_E2EE === "0" || cfg.e2ee === false;
  const allowed = !localMode && !userDisabled;
  // 密码与 device-login 同源:env 优先,其次 .dsh-config.json(本机 0600 保存的账号密码)
  const password = PASSWORD || (typeof cfg.password === "string" && cfg.password ? cfg.password : "");
  e2ee = await E2eeService.init({ apiBase: API_BASE, token, password, allowed });
  const st = e2ee.state();
  const stateFileDir = process.env.DSH_BRIDGE_E2EE_STATE || path.dirname(CONFIG_PATH);
  if (process.env.DSH_BRIDGE_CONFIG || process.env.DSH_BRIDGE_E2EE_STATE) {
    writeE2eeStateFile(stateFileDir, { enabled: st.enabled, reason: st.reason, profile: st.profile, epoch: st.epoch, caps: e2ee.caps() });
  }
```

</details>

**依据 3 · 源码核查**：[clients/dsh-remote/dsh-bridge.mjs:2650-2662](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/clients/dsh-remote/dsh-bridge.mjs#L2650-L2662)

兼容降级基础。

<details>
<summary>查看原文（13行）</summary>

```text
      // 丢弃 = 手机手里的旧票必然对不上：后续 ws-open/HTTP 会带 retryable 的 rehandshake 信号，
      // 手机自动重建会话而不是让用户去输密码。
      console.log(`[bridge] E2EE 会话存储已作废(${store.discarded})，手机端将自动重新握手`);
    }
    if (storeDir && storeEnabled) {
      console.log(`[bridge] 🔒 E2EE 已启用(caps=[${e2ee.caps().join(",")}], profile=${st.profile}, epoch=${st.epoch});MK 仅驻内存,会话库加密落盘`);
    } else {
      console.log(`[bridge] 🔒 E2EE 已启用(caps=[${e2ee.caps().join(",")}], profile=${st.profile}, epoch=${st.epoch});MK 仅驻内存(会话库未落盘)`);
    }
  } else {
    console.log(`[bridge] e2ee 未启用(${st.reason}) → 明文 v1 路径照常(能力不上报)`);
  }
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-remote-web/lib/index.js:2750-2783](https://github.com/mrRisega/dsh-remote/blob/3c48a5fdc41b8e64c0523ab2d146e78d1528effd/packages/dsh-remote-web/lib/index.js#L2750-L2783)

现有进程/运行时自愈基线。

<details>
<summary>查看原文（34行）</summary>

```text
function scheduleRuntime(relayDir) {
  let done = false;
  // 本进程启动时是否缺运行环境：缺 → 补齐完成后需要重启 DeepSeek harness 才算「安装完成」。
  let awaitingRestartHint = !runtimeReady(relayDir);
  const iv = setInterval(() => {
    if (done) { clearInterval(iv); return; }
    if (UNINSTALLED_DIRS.has(relayDir)) { done = true; clearInterval(iv); return; } // 已彻底卸载：自愈 watcher 停摆
    try {
      if (!runtimeReady(relayDir)) {
        reapBrokenAutostart(relayDir); // 先摘掉指向不存在脚本的自启动，止住崩溃循环
        ensureRuntime(relayDir);       // 后台 npx 补齐（marker 防重入）；就绪后下一轮自动拉起
        telemetryRuntimeProbe(relayDir); // 匿名遥测：补装超时归类（runtime_install_timeout）
        return;
      }
      telemetryRuntimeProbe(relayDir); // 匿名遥测：环境刚补齐 → runtime_ready（每进程一次）
      if (awaitingRestartHint) {
        awaitingRestartHint = false;
        // 运行环境刚在本进程内补齐 —— **不需要重启 harness**：
        //   · bridge 是独立 launchd 进程，补齐后自愈调度会直接把它拉起；
        //   · 插件本体走 patch 热加载，装完即生效。
        // 以前这里会 markRestartPending("first-install") 弹出"需要重启 DeepSeek harness"横幅，
        // 在热加载落地后已经变成纯粹的误导（用户实测反馈），故移除。
      }
      const cfg = loadConfig(relayDir);
      const hasAcct = Boolean((cfg.phone || cfg.email) && cfg.password) || Boolean(cfg.local_key);
      if (!hasAcct) return;
      // ── ① 权威判据（按平台各问各的服务管理器）──
      // 运行环境已在，看服务是否已在运行（runtime 可能位于 npx 缓存/固化目录，不必重复安装）
      const st = launchdStatus();
      if (st.running) {
        done = true; clearInterval(iv); resetSelfhealGuard(relayDir);
        logSelfhealReady(relayDir, cfg, `launchd state=${st.state || "running"}`);
        return;
      }
```

</details>

#### 缺口

- 策略状态能否提供更少错误绿灯且可接受恢复成本未知。
  **影响**：不是现有产品能力或已证明需求。
  **进一步探讨**：故障注入做受控对照；无清晰收益即停。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
