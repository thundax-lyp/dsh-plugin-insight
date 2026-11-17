# DSH Mobile Plugin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7de7bf2](https://github.com/WNLUO/dsh-mobile-plugin/tree/7de7bf260ad205737201d5b3e96127f52a552bda)

<!-- BEGIN META -->
[![GitHub ★ 71](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=71&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WNLUO/dsh-mobile-plugin) [![npm 30d 99,158](https://img.shields.io/static/v1?label=npm+30d&message=99%2C158&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile-plugin) [![最新发布 2026-11-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mobile-plugin)
<!-- END META -->

> **功能**：给 DSH 移动应用提供会话、工作区和文件接口，支持通过局域网或中转配对接续。

> **亮点**：[Q01](#research-q01) 将宿主会话接到能按设备配对的接口上，离开电脑时可以继续测试对话。[Q03](#research-q03) 同一消息身份对接宿主请求和有界历史查询，提供区分请求接受与正文出现的路径。

> **主要限制**：[Q02](#research-q02) 旧凭据的全权相容及实际装载代影响试用权限。[Q04](#research-q04) 远程电脑还有完整网页授权，撤回与手机权限须分别验证。

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
  - [Q01 · 谁适合从手机接续哪项任务？](#detail-section-11)
  - [Q02 · 宿主实际运行哪一代，移动设备权限怎样生效？](#detail-section-12)
  - [Q03 · 能区分已接受、已落入消息正文和任务完成吗？](#detail-section-13)
  - [Q04 · 远程电脑扩大了什么权限，试用和退出有哪些成本？](#detail-section-14)
  - [Q05 · 如何证明弱网重试少产生重复消息？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已在电脑启动 DSH 会话、暂时离开桌面仍需确认或追加一条消息的人。

[Q01](#research-q01) 原生会话页可以检查工作成果。手机路径补充受设备授权的访问和可回查消息身份，最终结果仍以宿主会话为准。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 手机配对与会话 | 追加消息、查看进度和宿主正文 | 根据协议和凭据授权，旧相容需独立检查 |
| 有界消息回查 | 断线后确认某个消息身份 | 查询窗有限，宿主版本和客户端实际配合待测 |
| 远程电脑 | 在另一电脑使用完整宿主网页 | 独立邀请、设备身份与租约，按完整网页权限考虑 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 包所声明的 DSH 主版本、Web 服务与注入客户端 | 必需 | 宿主路由与控制界面 | 核查实际运行代与依赖缺失 |
| 受控局域网与支持配对的手机客户端 | 代表任务必需 | 建立并验证设备访问 | 改用原生会话或调整隔离网络 |
| 指定设备、协议及操作权限 | 代表任务必需 | 限定可执行的会话接口 | 旧全权相容或撤销失败时停止 |
| relay 或远程电脑两端 | 相应任务按需 | 异地网络或者完整网页访问 | 同网试验无需启用完整网页授权 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定测试宿主、运行代和有配对路径的手机 | 识别实际协议、设备记录和允许范围 |
| 使用 | 用局域网配对并向一个空会话追加无敏感文本 | 分别检查接受状态与宿主正文 |
| 回查 | 对照同一消息身份、所在会话和结果回执 | 超时先回查，避免以新身份盲投 |
| 退出 | 撤销设备、核对权限并停不用的路径 | 对同一访问重试遇拒，手工回原会话 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主、网络和软件用量未知 | 核对运行代、配对和最小权限 | 相容旧设备需额外检查 |
| 持续使用 | 请求、模型、中转开销未知 | 核对错投、断线、代更新和回查 | 未取得同任务测量 |
| 失败恢复 | 重试和重新连接资源未知 | 对照会话、消息身份、端点和实际授权 | 进程重启可能改变去重观察 |
| 退出 | 连接与备份资源未知 | 撤销移动或网页设备并复查旧访问 | 真实持续连接撤出待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 移动接续 | 配对、权限、会话发送和查看接口 | 真实手机客户端稳定性和操作时间 |
| 消息确认 | 同身份复用 prompt 与有界正文回查 | 窗口外与跨重启时的重复或漏发 |
| 远程网页 | 单独邀请、租约和回环入口 | 公网切换、撤销体验以及完整兼容 |

> **思考**：[Q02](#research-q02) 旧凭据的全权相容及实际装载代影响试用权限。[Q04](#research-q04) 远程电脑还有完整网页授权，撤回与手机权限须分别验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将宿主会话接到能按设备配对的接口上，离开电脑时可以继续测试对话。[Q03](#research-q03) 同一消息身份对接宿主请求和有界历史查询，提供区分请求接受与正文出现的路径。

[Q02](#research-q02) 认证、按路径与方法的权限和封包要求各有分支，应逐一检查。[Q03](#research-q03) 发送去重在当前上下文作用，历史查询直接用宿主事件，二者界限清楚。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 旧凭据的全权相容及实际装载代影响试用权限。[Q04](#research-q04) 远程电脑还有完整网页授权，撤回与手机权限须分别验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在受控局域网用一个空会话试配对、发送、正文回查和撤销。选择要测试的设备与协议并查实际运行代。若旧全权路径无法收回，或同一身份的消息无法核对，结束试用并回桌面会话。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码说明实际挂载、权限相容、消息回查与远程网页接线。手机、网络、发布物和弱网效果均待实测。

- 已检查：作者 README、包清单、源码路径 README.md、lib/impl.js、lib/client.js、cordis.patch.yml、package.json、lib/index.js、lib/shell/updater.js、lib/mobile/auth.js、lib/mobile/permissions.js、lib/http/routing.js、lib/mobile/pairing.js、lib/mobile/session-send.js、lib/mobile/session-cache.js、lib/mobile/session-delivery.js、lib/remote/host.cjs、lib/remote/local.cjs、lib/remote/controller.cjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查当前固定源码的双入口、维护代、设备 ACL、普通消息发送回查与远程网页鉴权。扩展、移动文件和其他新增路由未逐条审计，未运行目标或核验发行包、移动端或跨网服务。
- 下一步：[Q05](#research-q05) 以受控消息身份和可重放的断网脚本验证接受、正文、最终结果和撤销；远程网页授权独立验收，不将其与手机接口合并。

**分析版本**

- **仓库**：[WNLUO/dsh-mobile-plugin](https://github.com/WNLUO/dsh-mobile-plugin)
- **版本号**：0.5.62（[固定提交 7de7bf2](https://github.com/WNLUO/dsh-mobile-plugin/tree/7de7bf260ad205737201d5b3e96127f52a552bda)）
- **版本日期**：2026-11-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 把复用会话消息身份和先查正文组合起来，在弱网故障下比较重复、漏发和恢复时延。重启与历史窗口是必须单测的反例。

[Q05](#research-q05) 以受控消息身份和可重放的断网脚本验证接受、正文、最终结果和撤销；远程网页授权独立验收，不将其与手机接口合并。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 2582 | — | — | 36689 |
| .js | source | 186 | 49759 | 32227 | 14642 | — |
| .cjs | source | 63 | 13633 | 9260 | 3631 | — |
| .mjs | source | 14 | 2944 | 2098 | 643 | — |
| .tsx | source | 35 | 7362 | 5639 | 1390 | — |
| .ts | source | 31 | 9436 | 8279 | 968 | — |
| .mjs | test | 2 | 557 | 449 | 67 | — |
| .cjs | test | 258 | 64606 | 51093 | 8454 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/WNLUO/dsh-mobile-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=14&color=737b86&logo=github)](https://github.com/WNLUO/dsh-mobile-plugin/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/WNLUO/dsh-mobile-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：手机离开电脑后怎样接续自己的 DSH 会话，哪些配对、权限和回执能支持受控试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁适合从手机接续哪项任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合已在电脑打开 DSH 会话、短暂离开桌面但需要确认已发内容或续写的人。一个完整任务是从同一局域网用已配对手机打开测试会话，追加一句非敏感文本，并在宿主确认该条内容对应的消息身份。桌面继续或原生网页访问是参照；移动入口提供按设备配对的会话 API，用户仍需判断是否信任移动终端与网络。

安装将设置与配对入口集成于 DSH Web，移动路由在同一宿主代里真实装配。作者同时提供 relay 与局域网以及另一条电脑到电脑的完整网页访问。普通手机接续只需比较同一会话，完整网页权限另行审核。收到本机 API 的接受回执也只满足流程中的一步，符合任务标准还要核对正文或发送失败。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-25](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/README.md#L21-L25)

作者说明手机、局域网与 relay 的目标。

```text
**AI-HUB 的手机端插件。** 装在电脑这边，手机 App 就通过一条中转隧道或局域网配对连进你的 DeepSeek Harness —— 看会话、接着聊、管理文件和工作区，进度实时同步。

它和绝大多数 DSH 插件不一样的一点：**不需要桌面外壳，也不需要 Electron**。同一份包可以单独跑在没有图形界面的服务器上，当作无头宿主用 —— 手机连的是一台根本没有屏幕的机器。

![手机 App 经中转或局域网连到你电脑上的 DeepSeek Harness](https://raw.githubusercontent.com/WNLUO/dsh-mobile-plugin/main/assets/connection-light.svg)
```

**依据 2 · 作者声明**：[README.md:63-78](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/README.md#L63-L78)

作者列出手机场景和设置入口。

<details>
<summary>查看原文（16行）</summary>

```text

- 两种连法：经 relay v2 隧道从公网连回来，或者同一个 Wi-Fi 下走局域网直连。
- 配对码与配对策略可选，设备凭据能单独吊销，也能一次把全部撤掉。
- iOS 离线推送可选，不配也不影响其它功能。

移动 API 只开手机需要的口子（`/api/mobile/v1/*`）—— 不暴露 shell、系统设置与任意文件写入。

## 安装与更新

装好手机 App 只是第一步，插件装在这边才算接通。

### 桌面端

在 DSH 的 **设置 → 插件** 里搜索并安装 `dsh-mobile-plugin`，然后打开 **设置 → 移动端 → 打开配置页面** 做配对。插件市场负责检查和安装更新，通常更新后不用重启 DSH。

装完以后，**入口在 DSH 的「设置 → 移动端」**：点「打开配置页面」，那里有配对二维码、当前监听地址和中转状态。手机上的所有功能都从这一页开始。
```

</details>

**依据 3 · 源码核查**：[lib/impl.js:513-533](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/impl.js#L513-L533)

实际装配远程电脑与移动 API。

<details>
<summary>查看原文（21行）</summary>

```text
  const remoteComputers = mount('远程电脑', () => mountRemoteComputers({ ctx, state, credentials, registerRoute, lanPortInUse: advertisedLanPort, tailcat, p2p, log: warn }))

  // 移动端路由表在 lib/routes/mobile-api.js：那里是一张可以对着 App 侧 apiPaths.ts
  // 核对的「路径 → handler」表，不用在 1000 行装配代码里翻。
  mount('移动端路由', () => registerMobileRoutes({
    registerRoute,
    remoteComputers,
    // 直连隧道：已配对的手机走这条拿到自己的入口地址，不用重新扫码。
    tailcat,
    // 点对点隧道：会合那一步（手机报上候选、这里把它拉起来并回自己的候选）。
    p2p,
    // 预览是 WebSocket 升级路由，走的是 webServer 的另一套名字空间；与 registerRoute
    // 一样必须包在 ctx.effect 里，否则插件重载时重复注册会直接抛错。
    registerUpgradeRoute: (route) => mountRoute(route, true),
    preview,
    // 网页版登录令牌那条：handler 在这里造好、按依赖交给路由表，理由与 preview 一样——
    // 它要读的是本进程的 `ctx.webServer` 与 `ctx.get('connection')`。
    hostWeb: hostWeb.handleHostWeb,
    guarded,
    state,
    hostMetadata,
```

</details>

**依据 4 · 源码核查**：[lib/client.js:2342-2362](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/client.js#L2342-L2362)

实际 Web apply 将配置与嵌入入口挂到设置。

<details>
<summary>查看原文（21行）</summary>

```text
      inject: ['slots', 'locale'],
      apply(ctx) {
        provideMobileChatEmbed(ctx);
        ctx.effect(() => ctx.locale.register(NS, DICT), 'mobile-plugin: settings dictionaries');
        const t = ctx.locale.bind(NS);
        installPluginPages(ctx, t);
        captureSessions(ctx);
        openEmbeddedSession(ctx);
        startDesktopReadSync(ctx);
        startReadReceiptSync(ctx);
        startClientHalfReport(ctx);
        // 设置里那一项：外壳声明 `settings.section`（设置菜单里的顶层一项），先声明后注册 ——
        // 外壳可能比我们晚一步声明它。跟内置插件页的页签是两回事：这一项是自己的设置页。
        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section',
          id: 'mobile',
          order: 20,
          label: () => t('nav'),
          locale: NS,
          inject: () => ({ t }),
        }, MobileSettingsSection));
```

</details>

#### 缺口

- 没有真实手机任务对照。
  **影响**：无法估算相对桌面操作的节约。
  **进一步探讨**：在一个测试会话比较手机和原生路径。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主实际运行哪一代，移动设备权限怎样生效？

**研究主题**：依赖、兼容与流程、功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

根包补丁插入自身包，宿主入口持有代运行时并包装 webServer 的注册；当前代安装控制面与移动界面所需 API。Web 入口依赖 slots 和 locale，实际注册配对快捷与设置。运行时显示盘上版本、运行版本和两侧壳指纹，每次启动后周期检查。当前开关文件缺失时默认允许自动更新，显式关闭可停自动安装，盘上已经有新版仍可能通过 reconcileInstalledGeneration 尝试换代。固定版本试用需要检查两者，不宜只看已安装的版本字样。

移动设备请求先查设备凭据。已经存在的记录若吊销或过期会直接失败，不走旧令牌回退。只有查不到记录后才尝试旧 LAN HMAC。按路径和 HTTP 方法决定能力，未知类由守卫拒绝；但无记录 HMAC 或旧记录缺 permissions 的相容行为是全权，空数组才是没有这些额外权限。请求的能力不能从配对成功本身推断。配对 v2 来自 sealed 形状，响应具备密钥时封包；没有 proto 的旧形状可继续走旧支路，声明协议但未封包的形状明确拒绝。执行撤销时要分别核对该设备凭据失效与是否还存在可用旧访问路径。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:19-21](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/cordis.patch.yml#L19-L21)

补丁插入实际插件。

```text
- insert:
    - id: dsh-mobile
      name: 'dsh-mobile-plugin'
```

**依据 2 · 源码核查**：[package.json:98-110](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/package.json#L98-L110)

包声明 Web 注入及补丁。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-runtime"
      ]
    }
  },
```

</details>

**依据 3 · 源码核查**：[lib/index.js:108-125](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/index.js#L108-L125)

包装宿主注册并提供诊断。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.effect(() => {
    const server = ctx.webServer
    const outer = server?.register
    if (typeof outer !== 'function') return () => {}
    const wrapper = function register(route) {
      return outer.call(this, runtime.wrapHandler(route))
    }
    server.register = wrapper
    return () => {
      if (server.register === wrapper) server.register = outer
      return runtime.detach()
    }
  }, 'dsh-mobile-plugin: generation runtime')

  const installedShellHash = () => updater.shellFingerprint(installedPackageDir())
  // 宿主半边的自检口（`shell/half-route.js`）：实现装载失败时整张控制面路由都不在，只有
  // 外壳还活着 —— 那是「它为什么没起来」唯一说得通的落点。
  ctx.effect(() => installHostHalf(ctx, runtime, { installedVersion, installedShellHash, runningShellHash }), 'dsh-mobile-plugin: host half self check')
```

</details>

**依据 4 · 源码核查**：[lib/index.js:127-175](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/index.js#L127-L175)

报告两侧版本与壳指纹，启动和周期检查。

<details>
<summary>查看原文（49行）</summary>

```text
  ctx.reflect.provide('dshMobilePluginRuntime', {
    status: () => ({
      ...runtime.status(),
      /** 盘上装着的版本（市场装完立刻变，和运行中的版本对照就能看出「要不要换」）。 */
      installedVersion: installedVersion(),
      runningShellHash,
      installedShellHash: installedShellHash(),
      shellChanged: (() => {
        const installed = installedShellHash()
        return installed !== null && runningShellHash !== null && installed !== runningShellHash
      })(),
      profileNodeModules: profileNodeModules(),
      autoUpdate: updater.autoUpdateEnabled(),
      autoIntervalMs: updater.AUTO_INTERVAL_MS,
      marketBase: base(),
      marketLastCheckedAt: updateState.lastCheckedAt,
      marketLastError: updateState.lastError,
      marketResult: updateState.result,
      lastApply: updateState.lastApply,
      appliedAt: updateState.appliedAt,
    }),
    check,
    apply: applyUpdate,
    reload: version => runtime.reload(version),
    /** 就地把盘上这一份重新装载一遍：版本身份没变也照换（开发机改完代码用，见 runtime 的 reread）。 */
    reread: () => runtime.reload(undefined, { reread: true }),
    deviceOta,
    setAutoUpdate: enabled => {
      const value = updater.setAutoUpdate(enabled)
      log('info', 'dsh-mobile-plugin: 自动更新已%s', value ? '开启' : '关闭')
      return value
    },
  })

  runtime
    .start(ctx, { log })
    .then(() => {
      log('info', 'dsh-mobile-plugin: 已装载 %s（来源 %s）', runtime.status().version, runtime.status().source)
      // 每 2 分钟让已落盘的正式版接管 OTA，并补上「盘上比运行中新」的那次换代（补换代不
      // 受开关管：它不下载任何东西）；自动安装由开关控制，开着就不等正在跑的对话。
      const timer = setInterval(() => {
        deviceOta.reconcileOfficial()
          .then(() => updater.reconcileInstalledGeneration({ runtime, log }))
          .then(() => updater.autoUpdateEnabled() ? applyUpdate({ auto: true }) : null)
          .catch(error => {
            updateState.lastError = String(error?.message || error)
            log('warn', 'dsh-mobile-plugin: 更新检查失败：%s', updateState.lastError)
          })
      }, updater.AUTO_INTERVAL_MS)
```

</details>

**依据 5 · 源码核查**：[lib/shell/updater.js:474-499](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/shell/updater.js#L474-L499)

对齐已安装代和默认开关是两条路径。

<details>
<summary>查看原文（26行）</summary>

```text
export async function reconcileInstalledGeneration({ runtime, log = () => {} } = {}) {
  let running = null
  try { running = runtime.status()?.version ?? null } catch { return null }
  const disk = installedVersion()
  if (!disk || !running || compareVersion(disk, running) <= 0) return null
  // 不在这里喊话：真去换时 `swapTo` 会记成功、失败那条下面自己记。卡住的机器每 10 分钟
  // 一行「补一次换代」纯属噪声，而真相在 `lastApply`（面板「运行中 / 盘上」两列也在报）。
  const attempt = await swapTo(runtime, disk, { auto: true, log })
  if (attempt.failure && !attempt.deferred) log('warn', 'dsh-mobile-plugin: %s', attempt.failure.message)
  return attempt.status ?? null
}

/** 自动更新开关的落盘文件：`<DSH_HOME>/storages/mobile-plugin/auto-update.json`。 */
function autoUpdateFile() {
  return path.join(dshHome(), 'storages', 'mobile-plugin', 'auto-update.json')
}

/** 未设置过默认自动更新；显式关闭保持关闭，配置损坏时不改动盘上插件。 */
export function autoUpdateEnabled() {
  try {
    const raw = JSON.parse(fs.readFileSync(autoUpdateFile(), 'utf8'))
    return raw?.enabled === true
  } catch (error) {
    return error?.code === 'ENOENT'
  }
}
```

</details>

**依据 6 · 源码核查**：[lib/mobile/auth.js:75-96](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/mobile/auth.js#L75-L96)

查中当前凭据记录时吊销或过期直接拒绝，只有未命中才试旧 HMAC。

<details>
<summary>查看原文（22行）</summary>

```text
function authOutcome(req) {
  const presented = presentedCredential(req);
  if (presented) {
    const state = loadRelayState();
    if (state && state.instanceId) {
      const known = credentials.lookup(presented, state.instanceId);
      if (known) {
        if (known.revokedAt) return { ok: false, reason: 'revoked' };
        if (known.expiresAt && known.expiresAt <= Date.now()) return { ok: false, reason: 'expired' };
        // 还剩不到一半就顺手续期：所有设备会在同一天集体掉线，而这件事完全可以用一次
        // 现成的调用避免 —— 用户不需要为此做任何事。
        try { credentials.renew(known); } catch { /* 续期失败不影响这一次请求 */ }
        return { ok: true, record: known };
      }
      // 查不到就是「本机没签发过它」：可能是中转签的凭据（那条库在中转那边），也可能是
      // 升级前的 HMAC token。两种都往下走旧令牌校验，不在这里判死。
    }
  }
  const m = /^Bearer\s+([^\s]+)$/.exec(req.headers.authorization || '');
  if (m && verifyMobileToken(m[1])) return { ok: true };
  return { ok: false, reason: 'unauthorized' };
}
```

</details>

**依据 7 · 源码核查**：[lib/mobile/permissions.js:102-114](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/mobile/permissions.js#L102-L114)

缺记录或缺权限字段有旧版全权语义。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * 「这条请求能不能做」。`record` 缺 `permissions`（老凭据）或没有记录（升级前 HMAC）都放行。
 * `permission` 为 null/空串（BASE 路由）也放行。
 */
function hasPermission(record, permission) {
  if (!permission) return true;
  // 没有记录 = 升级前 HMAC 那种无状态通行证，它本来就等于全权，不能一刀切拦住。
  if (!record || typeof record !== 'object') return true;
  const granted = record.permissions;
  // 字段缺失 / null = 全权（向后兼容的命门，别用 || 把空数组合成缺失）。
  if (!Array.isArray(granted)) return true;
  return granted.includes(permission);
}
```

</details>

**依据 8 · 源码核查**：[lib/mobile/permissions.js:376-404](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/mobile/permissions.js#L376-L404)

根据路径及方法决定权限分类。

<details>
<summary>查看原文（29行）</summary>

```text
function pathnameOf(path) {
  if (typeof path !== 'string' || !path) return '';
  const q = path.indexOf('?');
  let p = q >= 0 ? path.slice(0, q) : path;
  const h = p.indexOf('#');
  if (h >= 0) p = p.slice(0, h);
  const base = '/api/mobile/v1/';
  const hit = p.indexOf(base);
  if (hit >= 0) p = p.slice(hit);
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

/**
 * 解析一条移动路由所需的权限位。
 * 返回 `null`（BASE，不查权限）/ 权限位字符串 / `'unknown'`（没分类，调用方应 fail-closed）。
 */
function resolvePermission(path, method = 'GET') {
  const name = pathnameOf(path);
  if (BASE_SET.has(name)) return null;
  const entry = MAP[name];
  if (entry === undefined) return 'unknown';
  if (typeof entry === 'string') return entry;
  const verb = String(method || 'GET').toUpperCase();
  if (entry[verb] !== undefined) return entry[verb];
  // 同路径不同方法没单独列的兜底：GET 归读、其余按写（宁可严）。
  if (entry.GET !== undefined && verb === 'GET') return entry.GET;
  return entry.POST !== undefined ? entry.POST : (entry.GET !== undefined ? entry.GET : 'unknown');
}
```

</details>

**依据 9 · 源码核查**：[lib/http/routing.js:187-219](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/http/routing.js#L187-L219)

实际拒绝无效凭据、未列路由和权限缺失。

<details>
<summary>查看原文（33行）</summary>

```text
    const outcome = authorized(req)
    const passed = outcome === true || (outcome && typeof outcome === 'object' && outcome.ok === true)
    if (!passed) {
      const reason = outcome && typeof outcome === 'object' ? outcome.reason : 'unauthorized'
      if (reason === 'revoked') return sendJson(res, 401, { ok: false, error: { code: 'device-revoked', message: '这台设备已被解除绑定，请重新扫码' } })
      if (reason === 'expired') return sendJson(res, 401, { ok: false, error: { code: 'device-expired', message: '这台设备的授权已过期，请重新扫码' } })
      return sendJson(res, 401, { ok: false, error: { code: 'unauthorized', message: '缺少或无效的移动 token' } })
    }
    // 鉴权结果里的凭据记录挂到请求上：流那条路要按设备登记（吊销时主动断流，§3.3），
    // 而设备 id 只在这条记录里。挂在 req 上而不是再查一次库，是因为这一条请求上已经查过了。
    if (outcome && typeof outcome === 'object' && outcome.record) req.__dshRecord = outcome.record
    if (note) {
      // 记账本身绝不能影响请求结果：它坏了也只是面板少一个确认。
      try { note() } catch { /* 忽略 */ }
    }

    // 按设备权限子集校验本条路由（见 lib/mobile/permissions.js）。位置定死在「已鉴权、
    // 已挂 record」之后、「解封」之前：越权能直接回**明文 403**，客户端不必解信封就能读懂；
    // 而 401（没登录/被踢/过期）与 403（登录了但缺这一位）必须是两种处置，不能混。
    // BASE 路由 resolve 回 null、老凭据 / 无记录 has 恒真，都自然放行。
    if (resolvePermission) {
      const need = resolvePermission(req.url || req.originalUrl || '', req.method)
      if (need === 'unknown') {
        // 没分类的路由 fail-closed：宁可这条功能报错，也别给它开一个静默的全权口子。
        return sendJson(res, 403, { ok: false, error: { code: 'permission-unclassified', message: '这条接口没有登记所需权限，暂不放行' } })
      }
      if (need && (!hasPermission || !hasPermission(req.__dshRecord, need))) {
        const granted = req.__dshRecord && Array.isArray(req.__dshRecord.permissions) ? req.__dshRecord.permissions.slice() : null
        return sendJson(res, 403, {
          ok: false,
          error: { code: 'permission-denied', message: '这台手机没有这个操作的权限，请到电脑端的插件里把权限提上来', required: need, granted },
        })
      }
```

</details>

**依据 10 · 源码核查**：[lib/mobile/pairing.js:152-175](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/mobile/pairing.js#L152-L175)

根据封包和 proto 决定新旧请求路由。

<details>
<summary>查看原文（24行）</summary>

```text
    // ── 形状判定 ──────────────────────────────────────────────────
    //
    // 有 `sealed` 就是协议 v2；有 `code` 就是旧 App 的老形状，**一字不改地照旧走**；
    // 两样都没有就是畸形请求。两条路只在「怎么拿到设备信息」上不同，签发凭据之后完全汇合。
    const sealed = typeof body.sealed === 'string' ? body.sealed.trim() : '';
    const isSealedShape = sealed !== '';

    // ── 可猜形状的收口（§10.4(d)）─────────────────────────────────
    //
    // 新 App 已经没有手输这条路了：二维码里带着票据，扫到就走 `sealed`。所以「认得协议、
    // 却还带着六位码」只可能是一张过期的旧二维码（截图、面板重开之前的那份）。这个形状
    // 的码是逐位可试的，没有必要继续为它开门 —— 直接让它重扫当前那张。
    //
    // **判据是请求里带没带 `proto`，不是版本号**：老 App 没有协议概念、不带这个字段，
    // 照旧能配；而版本号在 OTA 里并不一定变（热更换的是 JS，App 版本还是那个），拿它
    // 当判据会把「就是不给更新的人」和「已经更新的人」一起判错。
    if (!isSealedShape && body.proto !== undefined) {
      sendJson(res, 400, {
        ok: false,
        code: 'legacy-pairing-retired',
        error: '这张二维码已过期，请重新扫一下电脑面板上当前的二维码',
      });
      return;
    }
```

</details>

**依据 11 · 源码核查**：[lib/mobile/pairing.js:335-346](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/mobile/pairing.js#L335-L346)

有配对密钥时封装响应，否则沿明文旧路径。

<details>
<summary>查看原文（12行）</summary>

```text
    // 新协议的回包必须加密：里面有 token / cookie / deviceCredential，明文回包等于让
    // 中转顺手拿到这台设备未来一年的通行证。
    if (pairKey) {
      try {
        sendJson(res, 200, sealPairResponse(pairKey, instanceId, payload));
      } catch (error) {
        log('pair seal failed:', error && error.message);
        sendJson(res, 500, { ok: false, error: 'internal error' });
      }
      return;
    }
    sendJson(res, 200, payload);
```

</details>

#### 缺口

- 未验证真实客户端、更新代及旧凭据状态。
  **影响**：部署需要单独检查实际协议、权限、撤销及运行版本。
  **进一步探讨**：同一 profile 记录配对形状、请求权限、撤销和代状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 能区分已接受、已落入消息正文和任务完成吗？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

同一会话提供 clientMessageId 时，移动 API 导出与宿主 requestId 对应的身份，并按会话与该消息身份复用 promptOnceFor。缺此身份就直调宿主，重试不能从这个分支获得同样的保证。可选模型选择在 promptOnce 之前落到会话上，无能力或失败时明确报错，因此 prompt 去重本身不能推出外层模型切换也去重。普通请求处理返回 accepted，表示当前 prompt 调用没有给出错误，终局和结果仍要独立查询。

有限窗口的 session/delivery 会读宿主历史，派生消息后寻找同 clientMessageId 并在命中时返回序号。一次未命中还可能来自消息仍在等待写入或已经移出窗口。接受响应与历史正文形成两个不同观察点，客户端如何显示、重试次数、重启后的行为都要实测。斜杠命令走单独派发，不套用普通消息路由的结论。

#### 证据与依据

**依据 1 · 源码核查**：[lib/mobile/session-send.js:88-119](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/mobile/session-send.js#L88-L119)

普通发送的消息身份进入宿主 prompt 和去重；斜杠命令分开。

<details>
<summary>查看原文（32行）</summary>

```text
/**
 * POST /api/mobile/v1/session/send（token）
 * 兼容两种格式：
 *   旧：{sessionId, text}
 *   新：{sessionId, content:[{type:'text',text} | {type:'image',mediaType,data(base64),name?}], mode?:'queue'|'steer',
 *        modelSelection?:{provider,model,reasoningEffort?}}
 * `modelSelection` 是本次发送要用的模型（App 侧选模型不再单独发切换请求）；提交 prompt 之前先
 * 落到会话上。恰为单个文本块且以 / 开头时派发为 slash 命令（commands.execute，不发给模型，也不应用模型）；
 * 其余原样透传给 harness 的 session.prompt（图片块需模型支持，不支持时错误原样返回）。
 */
function promptOnce(ctx, clientMessageId, payload) {
  const rpcId = mobilePromptRpcId(clientMessageId);
  // 把这一发认回去的身份一起送进宿主的 prompt 请求（`request.requestId`，见
  // host-bridge/endpoints.js）。宿主要是不认识它，user 消息的 `source.rpcId` 就是那个
  // 端点自己生成的 `mobile-prompt-<uuid>` —— App 那边 `clientMessageId` 永远对不上，
  // 只能靠「同文本 + 同图数」猜着认领乐观行（实时帧里的图一旦漏读，张数对不上就彻底认领不了）。
  const request = clientMessageId ? { ...payload, requestId: rpcId } : payload;
  if (!clientMessageId) return callSessions(ctx, 'prompt', request, rpcId);
  // 同一个 clientMessageId 在本会话里只承诺一次：内核重试、以及隔了几分钟用户手点的
  // 那次，都拿同一份结果（口径见 session-cache 的 `promptOnceFor`）。
  return promptOnceFor(ctx, `${payload.sessionId}:${clientMessageId}`, () => callSessions(ctx, 'prompt', request, rpcId));
}

async function handleSend(ctx, req, res) {
  const body = await readJsonBody(req, SEND_MAX_BODY);
  if (!body || typeof body.sessionId !== 'string' || !body.sessionId) {
    return sendJson(res, 400, { ok: false, error: { code: 'bad-request', message: '需要 { sessionId, content | text }' } });
  }
  const mode = body.mode;
  if (mode !== undefined && mode !== 'queue' && mode !== 'steer') {
    return sendJson(res, 400, { ok: false, error: { code: 'bad-request', message: "mode 必须为 'queue' 或 'steer'" } });
  }
```

</details>

**依据 2 · 源码核查**：[lib/mobile/session-send.js:174-208](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/mobile/session-send.js#L174-L208)

可选模型先于 prompt，错误单列，成功回 accepted。

<details>
<summary>查看原文（35行）</summary>

```text
  // App 侧选模型只改本地，切换请求随这一条消息一起到。**必须在 prompt 之前**落到会话上，
  // 这样这一轮的第一步用的就是用户刚选的模型（`agent.model.select` 只作用于尚未准备的那一步）。
  // 模型不可用 / 无该能力时明确回 400，让 App 报出来 —— 不静默沿用会话里原来的模型。
  const modelSelection = modelSelectionOf(body);
  if (modelSelection) {
    const applied = await selectSessionModel(ctx, { sessionId: body.sessionId, ...modelSelection });
    const result = applied && applied.result ? applied.result : null;
    if (!result || result.ok !== true) {
      const failure = result && result.error
        ? result.error
        : { code: 'session/model-unavailable', message: '所选模型当前不可用', details: modelSelection };
      return sendJson(res, 400, { ok: false, error: continuation ? continuationError(failure) : failure });
    }
  }

  let promptResponse;
  try {
    promptResponse = await promptOnce(ctx, typeof body.clientMessageId === 'string' ? body.clientMessageId : '', {
      sessionId: body.sessionId,
      // 继续只接受 queue 模式（宿主 `prompt` 对空内容只在这一档放行）。
      ...(continuation ? { mode: 'queue' } : mode !== undefined ? { mode } : {}),
      content,
    });
  } catch (error) {
    const normalized = promptErrorObject(error);
    if (normalized.code === MODEL_UNAVAILABLE_ERROR.code) invalidateSessionModels(ctx, req, body.sessionId);
    return sendJson(res, 400, { ok: false, error: continuation ? continuationError(normalized) : normalized });
  }
  const { error } = unwrap(promptResponse);
  if (error) {
    const normalized = promptErrorObject(error);
    if (normalized.code === MODEL_UNAVAILABLE_ERROR.code) invalidateSessionModels(ctx, req, body.sessionId);
    return sendJson(res, 400, { ok: false, error: continuation ? continuationError(normalized) : normalized });
  }
  sendJson(res, 200, { ok: true, accepted: true });
```

</details>

**依据 3 · 源码核查**：[lib/mobile/session-cache.js:373-405](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/mobile/session-cache.js#L373-L405)

复用同 ctx 的在途或已接受 Promise，失败释放记录。

<details>
<summary>查看原文（33行）</summary>

```text
 * clientMessageId 再发一次（内核重试或用户手点重试），第二次必须拿到第一次的结果，
 * 而不是让模型 / 子代理把同一句话再说一遍。
 *
 * **失败不占位**：`run` 回的信封不是成功（宿主明确拒绝，如 model-unavailable /
 * agent-busy）就当场删掉记录 —— 一次瞬时错误不能被固化成「这个 id 永远只回这一句错」；
 * 同理 `run` 抛错（传输层失败）也删。两条都必须是「真的再试一次」，否则活的路径只剩
 * 用户重开 App。
 *
 * @param {object} ctx 插件上下文（状态按 ctx 隔离）
 * @param {string} key 投递身份：主会话 `sessionId:clientMessageId`，子代理额外加前缀
 * @param {() => Promise<object>} run 真正发一次，回宿主信封（`{ result: { ok, value | error } }`）
 */
function promptOnceFor(ctx, key, run) {
  const state = sendIdempotencyStateOf(ctx);
  const existing = state.get(key);
  if (existing) return existing.promise;

  const promise = Promise.resolve().then(run);
  const record = { promise };
  state.set(key, record);
  const release = () => { if (state.get(key) === record) state.delete(key); };
  promise.then(
    (response) => {
      // 留下的这条记录就是「这一发已经交给宿主了」的回执；宿主明确拒绝（信封 ok 不为真）
      // 就当场释放 —— 一次业务错误不能被固化成「这个 id 永远只回这一句」。这里只看收没
      // 收下，不拆错误信封（拆信封在 envelope.js，本文件是零依赖的叶子）。
      const accepted = Boolean(response && response.result && response.result.ok === true);
      if (!accepted) release();
    },
    release,
  );
  return promise;
}
```

</details>

**依据 4 · 源码核查**：[lib/mobile/session-delivery.js:34-65](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/mobile/session-delivery.js#L34-L65)

按有限宿主历史查消息身份及序号。

<details>
<summary>查看原文（32行）</summary>

```text
 * GET /api/mobile/v1/session/delivery?sessionId=…&clientMessageId=…（token）
 * → { ok, delivered, seq? }
 *
 * 宿主没有这条会话（被删 / 换了机器）时回 404：那是「查不到」，不是「没送到」——
 * App 据此把发件箱里那条标成失败，而不是永远重试。
 */
async function handleSessionDelivery(ctx, req, res) {
  const url = new URL(req.url, 'http://x');
  const sessionId = (url.searchParams.get('sessionId') || '').trim();
  const clientMessageId = (url.searchParams.get('clientMessageId') || '').trim();
  if (!sessionId || !clientMessageId || sessionId.length > PARAM_MAX || clientMessageId.length > PARAM_MAX) {
    return sendJson(res, 400, { ok: false, error: { code: 'bad-request', message: '需要 { sessionId, clientMessageId }' } });
  }
  const { value, error } = unwrap(await callSessions(ctx, 'history', { sessionId, maxMessages: DELIVERY_HISTORY_WINDOW }));
  if (error) {
    const missing = error.code === 'session-not-found';
    return sendJson(res, missing ? 404 : 502, {
      ok: false,
      error: {
        code: typeof error.code === 'string' ? error.code : 'host-call-failed',
        message: typeof error.message === 'string' && error.message ? error.message : '读取会话历史失败',
      },
    });
  }
  const events = (value && Array.isArray(value.events)) ? value.events : [];
  const messages = deriveMessages(events);
  const hit = messages.find((message) => message.clientMessageId === clientMessageId);
  sendJson(res, 200, {
    ok: true,
    delivered: Boolean(hit),
    ...(hit && typeof hit.seq === 'number' ? { seq: hit.seq } : {}),
  });
```

</details>

#### 缺口

- 没有跨宿主和客户端的送达、重启恢复资料。
  **影响**：不能从 accepted 推断模型结束或跨进程恰好一次。
  **进一步探讨**：模拟丢回执与重启后查看同一会话的持久事件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 远程电脑扩大了什么权限，试用和退出有哪些成本？

**研究主题**：采用判断、效果与总成本、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

远程电脑是单独的电脑到电脑完整网页通道。握手检查邀请期限和实例、打开封包，并在发放远程网页凭据前消费邀请；再次连接按 deviceKey、keyId、deviceId 和当前凭据做挑战与授权，限制租约。通过后宿主可交出网页启动令牌并连接自己的回环上游。客户端本地网页入口绑定回环，远程会话有临时 cookie。这描述了公开端口与认证分层，不意味着已审计全部代理转发、浏览器隔离或抵抗网络攻击。

手机试用限定在受控局域网、无敏感测试会话和支持的客户端，先查看配对形状、设备权限和实际运行代。确认一次文本往返和撤销，再判断是否值得投入后续场景。首次负担是准备隔离 profile、版本和客户端；持续有网络、潜在 relay、更新换代与模型费用，未核实金额和时长。退出时分别撤销移动设备权利、关闭相关中转或本地监听，再从原会话继续。已经发放远程网页许可需走自己的撤销及连接关闭检查。若发现实际设备使用旧全权凭据或已撤销请求仍能读写，结束试用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/remote/host.cjs:89-119](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/remote/host.cjs#L89-L119)

限流、校验邀请并消费后签远程网页凭据。

<details>
<summary>查看原文（31行）</summary>

```text
    if (req.method !== 'POST') { sendJson(res, 405, { ok: false, code: 'REMOTE_METHOD' }); return; }
    if (closed) { sendJson(res, 503, { ok: false, code: 'REMOTE_CONNECT' }); return; }
    // 请求自报的实例号（头优先，缺头看 `?instance=`）与本机对不上：这张链接指向别的电脑。
    // 趁还没花掉限流额度、也没读请求体时就拒掉，别让一张错链接吃满限流。
    const refusal = instanceHintRefusal(req, instanceId());
    if (refusal) { sendJson(res, 400, { ok: false, code: refusal }); return; }
    const rate = throttle.take();
    if (!rate.allowed) { res.setHeader('retry-after', String(rate.retryAfterSec)); sendJson(res, 429, { ok: false, code: 'REMOTE_RATE_LIMIT' }); return; }
    const timeout = setTimeout(() => req.destroy(), HANDSHAKE_MS);
    timeout.unref?.();
    let body;
    try { body = await readJsonBody(req, c.MAX_HANDSHAKE); } finally { clearTimeout(timeout); }
    const ticket = body && tickets.get(body.ticketId);
    try {
      if (!ticket || ticket.expiresAt <= now() || body.instanceId !== instanceId() || body.v !== 1) throw c.error('REMOTE_AUTH');
      const keys = c.pairKeys(ticket.ticket, instanceId(), ticket.ticketId);
      const request = c.openJson(keys.up, body.sealed, pairAad(ticket.ticketId, 'up'));
      c.keyBytes(request.deviceKey);
      c.keyBytes(request.nonce);
      if (!KEY_ID.test(request.keyId) || typeof request.deviceId !== 'string' || !request.deviceId || request.deviceId.length > 128) throw c.error('REMOTE_AUTH');
      // 在任何异步工作前消耗：同一邀请的并行请求只能有一份获得授权。
      tickets.delete(ticket.ticketId);
      const device = { deviceId: request.deviceId, name: String(request.name || 'Computer').slice(0, 128), platform: 'computer' };
      const issued = credentials.issue(instanceId(), device, '', undefined, { deviceKey: request.deviceKey, keyId: request.keyId, permissions: [], remoteWeb: true });
      const binding = { instanceId: instanceId(), name: name(), deviceId: issued.deviceId, credential: issued.credential, keyId: request.keyId, routes: await routes(), createdAt: now(), nonce: request.nonce, connectionInfo: await info() };
      throttle.noteSuccess();
      sendJson(res, 200, { ok: true, v: 1, sealed: c.sealJson(keys.down, binding, pairAad(ticket.ticketId, 'down')) });
    } catch {
      throttle.noteFail();
      sendJson(res, 401, { ok: false, code: 'REMOTE_AUTH' });
    }
```

</details>

**依据 2 · 源码核查**：[lib/remote/host.cjs:139-196](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/remote/host.cjs#L139-L196)

挑战、租约、撤销校验和宿主上游接入。

<details>
<summary>查看原文（58行）</summary>

```text
          const record = typeof credentials.lookupRemoteByKeyId === 'function'
            ? credentials.lookupRemoteByKeyId(instanceId(), message.keyId)
            : credentials.findByKeyId(instanceId(), message.keyId);
          if (!record || record.instanceId !== instanceId()) throw c.error('REMOTE_AUTH');
          context = { instanceId: instanceId(), keyId: message.keyId, clientNonce: message.nonce, serverNonce: c.random() };
          initial = c.connectionKeys(record.deviceKey, context);
          Object.assign(session, { keyId: record.keyId, deviceKey: record.deviceKey, deviceId: record.deviceId });
          session.deny = (code) => { if (ws.readyState === 1) ws.send(JSON.stringify({ v: 1, type: 'denied', sealed: c.sealJson(initial.authDown, { ok: false, code }, initial.transcript) })); };
          ws.send(JSON.stringify({ v: 1, type: 'challenge', nonce: context.serverNonce, sealed: c.sealJson(initial.authDown, { instanceId: instanceId(), keyId: session.keyId, clientNonce: context.clientNonce }, initial.transcript) }));
          return;
        }
        if (stage !== 'auth' || message.type !== 'auth') throw c.error('REMOTE_AUTH');
        stage = 'opening';
        const auth = c.openJson(initial.authUp, message.sealed, initial.transcript);
        const record = recordOf(auth.credential, session.keyId, auth.deviceId);
        if (!record || record.deviceKey !== session.deviceKey) {
          const known = typeof credentials.lookup === 'function' ? credentials.lookup(auth.credential, instanceId()) : null;
          const matches = known && known.keyId === session.keyId && known.deviceId === auth.deviceId && known.deviceKey === session.deviceKey;
          if (!matches || typeof known.remoteWeb !== 'boolean') throw c.error('REMOTE_AUTH');
          if (known.expiresAt && known.expiresAt <= now()) throw c.error('REMOTE_EXPIRED');
          throw c.error('REMOTE_REVOKED');
        }
        if (!Number.isFinite(auth.leaseMs) || auth.leaseMs <= 0) throw c.error('REMOTE_EXPIRED');
        const expiresAt = Math.min(now() + Math.min(c.HOUR, auth.leaseMs), record.expiresAt || Infinity);
        if (expiresAt <= now()) throw c.error('REMOTE_EXPIRED');
        Object.assign(session, { credential: auth.credential, expiresAt });
        const keys = c.connectionKeys(session.deviceKey, { ...context, credential: auth.credential });
        let host = { connectionInfo: await info() };
        checkAuthorization();
        if (session.stopped) return;
        if (auth.control) {
          if (!CONTROL_OPS.has(auth.control.op) || typeof onControl !== 'function') throw c.error('REMOTE_CONTROL');
          clearTimeout(session.timer);
          session.timer = setTimeout(() => stop(session, 4000), 20_000);
          session.timer.unref?.();
          try { host.controlResult = await onControl(record, auth.control); }
          catch (err) { throw c.error(['REMOTE_REVOKED', 'REMOTE_EXPIRED'].includes(err.code) ? err.code : 'REMOTE_CONTROL'); }
        } else if (!auth.probe) {
          const token = await getLaunchToken();
          const upstreamPort = Number(await getUpstreamPort());
          const webPort = Number(getWebPort ? await getWebPort() : upstreamPort);
          checkAuthorization();
          if (session.stopped || ws.readyState !== 1) return;
          if (!token || !Number.isInteger(upstreamPort) || upstreamPort < 1 || upstreamPort > 65535 || !Number.isInteger(webPort) || webPort < 1 || webPort > 65535) throw c.error('REMOTE_UNAVAILABLE');
          host = { ...host, port: webPort, token };
          await new Promise((resolve, reject) => {
            session.upstream = net.connect({ host: '127.0.0.1', port: upstreamPort, allowHalfOpen: true }, resolve);
            session.upstream.once('error', reject);
          });
        }
        if (session.stopped || ws.readyState !== 1) { session.upstream?.destroy(); return; }
        checkAuthorization();
        if (session.stopped) return;
        clearTimeout(session.timer);
        session.handshaking = false;
        ws.off('message', receive);
        ws.send(JSON.stringify({ v: 1, type: 'ready', sealed: c.sealJson(keys.authDown, { ok: true, instanceId: instanceId(), remainingMs: Math.max(0, expiresAt - now()), host }, keys.transcript) }));
        if (auth.probe || auth.control) { ws.close(); return; }
```

</details>

**依据 3 · 源码核查**：[lib/remote/local.cjs:69-92](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/remote/local.cjs#L69-L92)

本地引导交换临时会话 cookie。

<details>
<summary>查看原文（24行）</summary>

```text
    if (!path || !active()) return reply(res, 410, '本次访问已到期，请在本机面板重新打开。');
    const url = new URL(path, origin());
    const bootstrap = url.pathname === OPEN_PATH;
    if (!sameOrigin(req, origin(), bootstrap)) return reply(res, 403, '只允许从本机入口访问。');
    if (bootstrap) {
      const value = url.searchParams.get('ticket');
      if (req.method !== 'GET' || !ticket || now() >= ticketExpiresAt || value !== ticket) return reply(res, 403, '打开链接已失效，请在本机面板重新打开。');
      ticket = '';
      const cookies = [`${cookieName}=${session}; Path=/; HttpOnly; SameSite=Strict`];
      // 只有从桌面壳打开的那一次入口带它；同一个入口用普通浏览器打开时保持网页版。
      if (url.searchParams.get('shell') === '1') cookies.push(`${shellCookie}=1; Path=/; HttpOnly; SameSite=Strict`);
      res.writeHead(303, {
        location: '/', 'set-cookie': cookies,
        'cache-control': 'no-store', 'referrer-policy': 'no-referrer',
      });
      res.end(); return;
    }
    if (cookieOf(req.headers.cookie, cookieName) !== session) return reply(res, 401, '请从本机面板打开这台电脑。');
    lastActivity = now();
    if (url.pathname === '/__dsh_remote_status' || url.pathname === '/__dsh_remote_notice.js') {
      if (req.method !== 'GET') return reply(res, 405, '只读入口。');
      const status = url.pathname === '/__dsh_remote_status';
      res.writeHead(200, { 'content-type': status ? 'application/json; charset=utf-8' : 'application/javascript; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
      if (status) { res.end(JSON.stringify({ expiresAt: deadline, serverNow: now() })); return; }
```

</details>

**依据 4 · 源码核查**：[lib/remote/local.cjs:148-154](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/remote/local.cjs#L148-L154)

本地代理监听回环。

```text
    start() {
      if (starting) return starting;
      starting = new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', () => {
          server.removeListener('error', reject);
          if (closed) { server.close(); reject(Object.assign(new Error('访问已停止'), { code: 'REMOTE_CONNECT' })); return; }
```

**依据 5 · 源码核查**：[lib/remote/controller.cjs:35-46](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/remote/controller.cjs#L35-L46)

撤销关闭本地网关与路由。

<details>
<summary>查看原文（12行）</summary>

```text
    });
    return router;
  }

  function fault(item, error) {
    item.lastError = safeError(error); item.lastErrorCode = error?.code || 'REMOTE_CONNECT';
    if (error?.code === 'REMOTE_REVOKED') {
      item.state = 'revoked'; item.gateway?.close(); item.gateway = null; item.router.close();
    } else if (error?.code === 'REMOTE_EXPIRED') {
      item.state = 'expired'; item.gateway?.close(); item.gateway = null; item.router.close();
    } else if (item.state !== 'expired' && item.state !== 'revoked') item.state = 'offline';
  }
```

</details>

**依据 6 · 源码核查**：[lib/mobile/auth.js:75-96](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/mobile/auth.js#L75-L96)

移动设备有独立撤销语义。

<details>
<summary>查看原文（22行）</summary>

```text
function authOutcome(req) {
  const presented = presentedCredential(req);
  if (presented) {
    const state = loadRelayState();
    if (state && state.instanceId) {
      const known = credentials.lookup(presented, state.instanceId);
      if (known) {
        if (known.revokedAt) return { ok: false, reason: 'revoked' };
        if (known.expiresAt && known.expiresAt <= Date.now()) return { ok: false, reason: 'expired' };
        // 还剩不到一半就顺手续期：所有设备会在同一天集体掉线，而这件事完全可以用一次
        // 现成的调用避免 —— 用户不需要为此做任何事。
        try { credentials.renew(known); } catch { /* 续期失败不影响这一次请求 */ }
        return { ok: true, record: known };
      }
      // 查不到就是「本机没签发过它」：可能是中转签的凭据（那条库在中转那边），也可能是
      // 升级前的 HMAC token。两种都往下走旧令牌校验，不在这里判死。
    }
  }
  const m = /^Bearer\s+([^\s]+)$/.exec(req.headers.authorization || '');
  if (m && verifyMobileToken(m[1])) return { ok: true };
  return { ok: false, reason: 'unauthorized' };
}
```

</details>

#### 缺口

- 没有实际网络覆盖、费用及撤回结果。
  **影响**：完整网页访问的远端权限和多渠道退出需实机复查。
  **进一步探讨**：先在受控 LAN 做小任务并核查各设备撤销；独立验证完整网页。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何证明弱网重试少产生重复消息？

**研究主题**：新假设与验证

#### 完整回答

假设使用同一消息身份重试并在宿主有限窗口回查，能减少网络丢失接受响应时的重复追加。用同一手机、宿主代、模型配置与会话测试脚本采集记录。一组超时后以新身份重投，另一组复用消息身份并先查询送达。分别在接受前断开、响应丢失但宿主已写入、历史超出窗口、宿主重启的位置注入故障。

以宿主正文里的消息身份和事件序号确认重复和漏发，并记录恢复时间。若身份复用不能降低重复、缺失变多，或只能在窗口极短且从不重启时成立，应收窄使用场景。实验尚未执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/mobile/session-send.js:98-109](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/mobile/session-send.js#L98-L109)

重试可沿用会话加消息身份。

<details>
<summary>查看原文（12行）</summary>

```text
function promptOnce(ctx, clientMessageId, payload) {
  const rpcId = mobilePromptRpcId(clientMessageId);
  // 把这一发认回去的身份一起送进宿主的 prompt 请求（`request.requestId`，见
  // host-bridge/endpoints.js）。宿主要是不认识它，user 消息的 `source.rpcId` 就是那个
  // 端点自己生成的 `mobile-prompt-<uuid>` —— App 那边 `clientMessageId` 永远对不上，
  // 只能靠「同文本 + 同图数」猜着认领乐观行（实时帧里的图一旦漏读，张数对不上就彻底认领不了）。
  const request = clientMessageId ? { ...payload, requestId: rpcId } : payload;
  if (!clientMessageId) return callSessions(ctx, 'prompt', request, rpcId);
  // 同一个 clientMessageId 在本会话里只承诺一次：内核重试、以及隔了几分钟用户手点的
  // 那次，都拿同一份结果（口径见 session-cache 的 `promptOnceFor`）。
  return promptOnceFor(ctx, `${payload.sessionId}:${clientMessageId}`, () => callSessions(ctx, 'prompt', request, rpcId));
}
```

</details>

**依据 2 · 源码核查**：[lib/mobile/session-delivery.js:40-65](https://github.com/WNLUO/dsh-mobile-plugin/blob/7de7bf260ad205737201d5b3e96127f52a552bda/lib/mobile/session-delivery.js#L40-L65)

根据宿主可读历史判断正文是否出现。

<details>
<summary>查看原文（26行）</summary>

```text
async function handleSessionDelivery(ctx, req, res) {
  const url = new URL(req.url, 'http://x');
  const sessionId = (url.searchParams.get('sessionId') || '').trim();
  const clientMessageId = (url.searchParams.get('clientMessageId') || '').trim();
  if (!sessionId || !clientMessageId || sessionId.length > PARAM_MAX || clientMessageId.length > PARAM_MAX) {
    return sendJson(res, 400, { ok: false, error: { code: 'bad-request', message: '需要 { sessionId, clientMessageId }' } });
  }
  const { value, error } = unwrap(await callSessions(ctx, 'history', { sessionId, maxMessages: DELIVERY_HISTORY_WINDOW }));
  if (error) {
    const missing = error.code === 'session-not-found';
    return sendJson(res, missing ? 404 : 502, {
      ok: false,
      error: {
        code: typeof error.code === 'string' ? error.code : 'host-call-failed',
        message: typeof error.message === 'string' && error.message ? error.message : '读取会话历史失败',
      },
    });
  }
  const events = (value && Array.isArray(value.events)) ? value.events : [];
  const messages = deriveMessages(events);
  const hit = messages.find((message) => message.clientMessageId === clientMessageId);
  sendJson(res, 200, {
    ok: true,
    delivered: Boolean(hit),
    ...(hit && typeof hit.seq === 'number' ? { seq: hit.seq } : {}),
  });
```

</details>

#### 缺口

- 无同条件弱网或故障注入数据。
  **影响**：窗口内逻辑能支持假设，实际收益和故障范围待测。
  **进一步探讨**：在接受响应丢失、历史窗口和重启点重复试验。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
