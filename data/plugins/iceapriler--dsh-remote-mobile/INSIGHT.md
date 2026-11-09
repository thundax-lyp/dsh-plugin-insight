# dsh-remote-mobile

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[bc55382](https://github.com/IceApriler/dsh-remote-mobile/tree/bc553829562afd178209211b0893c3dc1d35270c)

<!-- BEGIN META -->
[![GitHub ★ 49](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=49&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/IceApriler/dsh-remote-mobile) [![npm 30d 5,259](https://img.shields.io/static/v1?label=npm+30d&message=5%2C259&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote-mobile) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote-mobile)
<!-- END META -->

> **功能**：为 DSH Web 提供移动界面适配、扫码配对和 HTTP/WebSocket 接入代理。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 相比自行配置反代，插件在同一 DSH 入口接配对、设备状态、移动设置和流式转发。

> **主要限制**：[Q03](#research-q03) 默认 HTTP 无端到端 TLS，设备状态列表含原始 token，撤销删会话而代理未显示连接级撤销。授权和长期连接需分别验收。

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
  - [Q01 · 谁需要移动接入，根插件承担什么？](#detail-section-11)
  - [Q02 · 配对后的手机请求如何进到 DSH？](#detail-section-12)
  - [Q03 · 传输、权限、免密和撤销有哪些边界？](#detail-section-13)
  - [Q04 · 网络、存储、版本和维护依赖是什么？](#detail-section-14)
  - [Q05 · 怎样在隔离网络验收？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要离开桌面时用手机查看 DSH 工作区的用户，需要核对访问范围、只读操作与设备退出。[Q01](#research-q01)

用户可在受控网络代理原生 DSH 并保留其认证，需要自己处理移动布局、路径和设备管理。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 配对与设备管理 | 从手机访问既有 Web | token 长效，设备列表与权限须核对 |
| HTTP/WS/SSE | 将授权请求转至 DSH | 需可信网络与外层加密 |
| 移动 UI | 复用 DSH 界面 | 宿主版本兼容待测 |
| 撤销 | 删除会话令牌 | 既有连接需单独检查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 相容的 DSH Web 与 Node | 根插件需要 | 挂 Host 门禁和界面 | 回到本地入口 |
| 受控网络和外层加密 | 受控验收需要 | 限制出站与访问 | 停止对外监听 |
| 独立账号、设备与工作区 | 验收需要 | 记录授权及撤销 | 不使用业务环境 |
| 可信反代配置 | 若有外层反代 | 明确来源 | 检查转发边界 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 操作者部署隔离 DSH 与批准链路 | 确认监听、关免密和权限 |
| 配对 | 两个测试设备做拒绝与成功查看 | 只暴露约定权限与字段 |
| 撤销 | 检查旧 WS 和新 HTTP/升级 | 均符合预期后保留试验记录 |
| 退出 | 关闭网关并清测试凭据 | 回到本地，核对监听 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 网络、证书、宿主和设备 | 配置路由、权限与隔离 | 兼容未测 |
| 持续 | 代理和日志资源 | 审核设备、token、出站 | 手机端收益未知 |
| 失败恢复 | 日志和配置副本 | 查 Host、转发与长连接 | 真实撤销未验收 |
| 退出 | 必要取证与备份 | 关网关、核对旧连接及残留 | 文件与远端状态需另查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨设备连接 | 配对、Host 检查和代理转发 | 移动场景稳定性 |
| 会话管理 | token 发放、状态和撤销记录 | 旧连接终止与完整角色限制 |
| 实时交互 | HTTP/SSE 与 WS 透传 | 真实网络和宿主恢复 |

> **思考**：[Q03](#research-q03) 默认 HTTP 无端到端 TLS，设备状态列表含原始 token，撤销删会话而代理未显示连接级撤销。授权和长期连接需分别验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 相比自行配置反代，插件在同一 DSH 入口接配对、设备状态、移动设置和流式转发。

[Q02](#research-q02) Gateway 先检查 Host 和门禁，再走上游 HTTP 与升级。[Q03](#research-q03) Cookie、设备列表、日志归因和活动连接形成独立边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 默认 HTTP 无端到端 TLS，设备状态列表含原始 token，撤销删会话而代理未显示连接级撤销。授权和长期连接需分别验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 保持观察。在隔离环境先核对加密、来源、两个设备、无凭据和撤销场景。若不满足，关网关回到本地。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证实配对、Host 接线、HTTP 和升级守卫。实际网络、数据权限、转发归因和撤销后的旧连接未验收。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/client/index.jsx、src/routes/api.ts、src/auth/token.ts、src/gateway/server.ts、src/auth/gate.ts、src/bridge/compat.ts、src/auth/crypto.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：首次固定根 DSH 插件源码，重点 proxy、配对、授权与撤销。未运行目标、真实手机、网络或验证宿主所有权限。
- 下一步：[Q05](#research-q05) 固定宿主和受控链路，核对配对、拒绝、token 字段、转发头、活连接及撤销后再次连接。

**分析版本**

- **仓库**：[IceApriler/dsh-remote-mobile](https://github.com/IceApriler/dsh-remote-mobile)
- **版本号**：1.10.3（[固定提交 bc55382](https://github.com/IceApriler/dsh-remote-mobile/tree/bc553829562afd178209211b0893c3dc1d35270c)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 短期设备授权、去凭据化列表和在途连接关闭回执可能减少设备共享与撤销误判，需与隔离对照比较。

[Q05](#research-q05) 固定宿主和受控链路，核对配对、拒绝、token 字段、转发头、活连接及撤销后再次连接。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 1666 | — | — | 30618 |
| .js | source | 9 | 1521 | 1313 | 95 | — |
| .ts | source | 16 | 7388 | 5571 | 1168 | — |
| .jsx | source | 11 | 4372 | 4151 | 119 | — |
| .js | test | 19 | 5092 | 4128 | 452 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/IceApriler/dsh-remote-mobile/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/IceApriler/dsh-remote-mobile/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/IceApriler/dsh-remote-mobile/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：如何从手机接入 DSH，扫码登录、代理转发、撤销及传输条件如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要移动接入，根插件承担什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常离开桌面但需要用同一 DSH Web 查看任务的用户，可用手机浏览器访问现有工作区。验收先是只读查看和撤销设备。直接在受控网络反代现有 DSH 可保留原认证，需自己配置路径和移动界面。根包实际是 DSH 插件，提供认证、配对、Web 代理、移动样式和管理卡，底层会话工具仍来自 DSH。其转发能力可涵盖桌面操作，受控观察需在宿主另限权限。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:45-51](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/README.md#L45-L51)

作者区分移动界面和远程接入。

```text
## 📖 这是什么

`dsh-remote-mobile` 是专为 **DeepSeek Harness (DSH)** 深度定制的远程与移动端安全治理插件。

DSH 核心服务出于安全考虑默认仅监听本地回环地址（`127.0.0.1`），手机、平板或其他电脑无法从外部访问 Web 控制台。本项目通过**访问控制中间件**与**请求隔离技术**，安全地开放了 **Tailscale 虚拟私网** 以及 **本地局域网 (Wi-Fi/LAN)** 访问能力，并提供登录凭证 RSA 加密、扫码配对、长期密码认证与防暴力破解审计体系。插件本身不提供全链路 TLS；完整传输加密需依赖 Tailscale 或外层 HTTPS。

手机端访问时，插件还针对 DSH 界面做了**移动端样式适配**：侧边栏抽屉折叠与可拖拽展开把手、新版官方三栏 Grid 布局与右侧边栏兼容、设置弹窗居中微缩、对话正文高密度排版等，让手机上的使用体验更贴近桌面端。
```

**依据 2 · 作者声明**：[README.md:56-60](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/README.md#L56-L60)

作者列复用的宿主能力。

```text
## ⚡ 核心优势

* 🚀 **突破网络壁垒，复用桌面端能力**：用于在局域网 / Tailscale 下访问 DSH Web。在移动端或外部设备访问时，**支持新建工作区、切换工作区、执行终端命令等常用桌面端操作**。
* 📱 **手机端专属适配与同源复用**：直接复用 DSH 官方 Web 前端（手机与桌面是同一套界面）与各类生态插件（如侧边栏、任务看板、终端面板等），无需单独维护手机端后台。插件已针对移动端做好了基础响应式适配（如侧边栏抽屉折叠、设置弹窗居中、对话正文字号与行距精细调小以提升一屏信息量），并内置**样式片段覆写功能**，支持开箱即用或按需注入自定义 CSS 样式小插件。
* 🛡️ **安全门禁与登录凭证加密**：登录凭证使用 RSA 非对称公钥加密，`scrypt` 加盐慢哈希密码落盘，连续输错自动熔断锁定 IP，拦截公网/局域网未经授权的访问。
```

**依据 3 · 源码核查**：[package.json:47-65](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/package.json#L47-L65)

真实 Host 和 Web 入口。

<details>
<summary>查看原文（19行）</summary>

```text
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ],
      "platform": "web"
    }
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/cordis.patch.yml#L1-L3)

实际加载根包。

```text
- insert:
    - id: remote-mobile
      name: 'dsh-remote-mobile'
```

**依据 5 · 源码核查**：[src/index.ts:111-144](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/index.ts#L111-L144)

Host 接线，创建会话、路由和样式。

<details>
<summary>查看原文（34行）</summary>

```text
export function apply(ctx: any, config: SessionStoreOptions = {}): void {
  // 1. 初始化会话与令牌持久化管理器及内部握手密钥
  const store = new SessionStore(config)
  const styleStore = new StyleSnippetStore()
  const gateMiddleware = createGlobalAuthGate(store)

  // 为本次插件生命周期生成高强度握手 Secret，并绑定到底座 Server
  const gatewaySecret = generateGatewaySecret()
  if (ctx.webServer?.server) {
    setGatewaySecret(ctx.webServer.server, gatewaySecret)
  }

  // 2. 接入 DSH Settings 服务 (命名空间: dsh-remote-mobile)
  bindDshSettings(ctx, store)

  // 3. 挂载底座 WebServer 相关的门禁拦截与路由注册
  if (ctx.webServer) {
    if (ctx.webServer.server) {
      patchHttpServerWithVirtualizer(ctx.webServer.server, gateMiddleware, store, styleStore)
    }

    // 挂载 HTML 模板层的样式与 Polyfill 注入钩子（在 Gzip 压缩前注入）
    mountIndexInjections(ctx, styleStore)

    // 注册插件专属的 HTTP & SSE API 路由。registerWebRoutes 会通过 ctx.effect
    // 收集 DSH WebServer 返回的撤销函数，保证插件重新激活/热重载时不残留路由。
    if (typeof ctx.webServer.register === 'function') {
      registerWebRoutes(ctx, createRoutes(store, styleStore))
    }
  }

  // 4. 向 Cordis 容器桥接注册 remoteWebUiPairing 服务（延迟裁决：与其他远程接入
  // 类插件共存时自动让出，保证启动不冲突，详见 compat.ts）
  registerRemoteWebUiPairingBridge(ctx, store)
```

</details>

**依据 6 · 源码核查**：[src/client/index.jsx:64-79](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/client/index.jsx#L64-L79)

设置客户端实际挂载。

<details>
<summary>查看原文（16行）</summary>

```text

    if (slots && typeof slots.inject === "function") {
      try {
        slots.inject("settings.section", function() {
          var unregister = slots.register({
            name: "settings.section",
            id: "tailscale-mobile",
            order: 150,
            label: function() {
              var lang = resolveLocale(ctx);
              return lang === "en" ? "Remote & Mobile" : "远程与移动端";
            }
          }, TailscaleMobileSection);
          return function() {
            if (typeof unregister === "function") unregister();
          };
```

</details>

#### 缺口

- 没有真实移动用户和任务闭环。
  **影响**：可用性和操作节约未测。
  **进一步探讨**：比较原生受控反代和插件在同一设备的登录、查看和退出。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配对后的手机请求如何进到 DSH？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host apply 建会话存储、门禁和内部握手密钥，给底座注册 HTTP 拦截和自家路由，默认 proxy 启动 GatewayServer。设置端可生成六位五分钟配对码，手机提交凭据时允许 RSA 解密或明文输入，成功消费短码并生成长效会话 token，响应同时有 Cookie 和 JSON token。普通 HTTP 先检查外部 Host，再用门禁决定回环、公开路径、配置允许的免密或 token。成功后清掉客户端内部密钥头，注入宿主握手密钥和规范化来源，经 http.request 向核心转发；SSE 仍流式返回。WebSocket 独立核对 Host、存在的 Origin 和授权，成功升级后双向透传。底座连接鉴权适配把通过插件门禁的请求视为可访问。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:111-139](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/index.ts#L111-L139)

构造会话和核心路由。

<details>
<summary>查看原文（29行）</summary>

```text
export function apply(ctx: any, config: SessionStoreOptions = {}): void {
  // 1. 初始化会话与令牌持久化管理器及内部握手密钥
  const store = new SessionStore(config)
  const styleStore = new StyleSnippetStore()
  const gateMiddleware = createGlobalAuthGate(store)

  // 为本次插件生命周期生成高强度握手 Secret，并绑定到底座 Server
  const gatewaySecret = generateGatewaySecret()
  if (ctx.webServer?.server) {
    setGatewaySecret(ctx.webServer.server, gatewaySecret)
  }

  // 2. 接入 DSH Settings 服务 (命名空间: dsh-remote-mobile)
  bindDshSettings(ctx, store)

  // 3. 挂载底座 WebServer 相关的门禁拦截与路由注册
  if (ctx.webServer) {
    if (ctx.webServer.server) {
      patchHttpServerWithVirtualizer(ctx.webServer.server, gateMiddleware, store, styleStore)
    }

    // 挂载 HTML 模板层的样式与 Polyfill 注入钩子（在 Gzip 压缩前注入）
    mountIndexInjections(ctx, styleStore)

    // 注册插件专属的 HTTP & SSE API 路由。registerWebRoutes 会通过 ctx.effect
    // 收集 DSH WebServer 返回的撤销函数，保证插件重新激活/热重载时不残留路由。
    if (typeof ctx.webServer.register === 'function') {
      registerWebRoutes(ctx, createRoutes(store, styleStore))
    }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:238-265](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/index.ts#L238-L265)

默认代理配置、启动及失败。

<details>
<summary>查看原文（28行）</summary>

```text
  if (detection.mode === 'proxy') {
    const opts = store.getOptions()
    gatewayServer = new GatewayServer(
      {
        port: opts.proxyPort ?? 3081,
        host: opts.proxyHost ?? '0.0.0.0',
        corePort: detection.corePort,
        coreHost: detection.coreHost,
      },
      store,
      gateMiddleware,
      ctx.logger
    )

    // 初始标记为正在启动中
    store.setActiveGatewayInfo('proxy', opts.proxyPort ?? 3081, detection.corePort, false)

    gatewayReadyPromise = gatewayServer.start().then(({ port }) => {
      if (gatewayServer?.getServer()) {
        setGatewaySecret(gatewayServer.getServer(), gatewaySecret)
      }
      store.setActiveGatewayInfo('proxy', port, detection.corePort, true)
      syncTrustedHosts()
      return port
    }).catch((err) => {
      store.setActiveGatewayInfo('proxy', opts.proxyPort ?? 3081, detection.corePort, false, err?.message || String(err))
      ctx.logger?.error?.('[dsh-remote-mobile] 安全接入代理启动失败:', err)
      return opts.proxyPort ?? 3081
```

</details>

**依据 3 · 源码核查**：[src/routes/api.ts:137-148](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/routes/api.ts#L137-L148)

生成配对码的真实路由。

<details>
<summary>查看原文（12行）</summary>

```text
    // 2. 生成 6 位短期配对码
    {
      kind: 'exact',
      method: 'POST',
      path: '/api/remote-mobile/generate-code',
      handler: async (_req: IncomingMessage, res: ServerResponse) => {
        const info = store.generateShortCode()
        jsonResponse(res, 200, {
          success: true,
          code: info.code,
          expiresAt: info.expiresAt,
        })
```

</details>

**依据 4 · 源码核查**：[src/auth/token.ts:678-686](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/auth/token.ts#L678-L686)

短码与五分钟有效期。

```text
  generateShortCode(): { code: string; token: string; expiresAt: number } {
    const code = randomInt(100000, 1000000).toString()
    const token = randomBytes(24).toString('hex')
    const now = Date.now()
    const expiresAt = now + 5 * 60 * 1000 // 5 分钟配对有效期

    const record: ShortCodeRecord = { code, token, createdAt: now, expiresAt }
    this.shortCodes.set(code, record)
    this.shortCodes.set(token, record)
```

**依据 5 · 源码核查**：[src/auth/token.ts:746-780](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/auth/token.ts#L746-L780)

短码删除和长效会话发放。

<details>
<summary>查看原文（35行）</summary>

```text
    // 1. 验证 6 位一次性配对码
    const short = this.shortCodes.get(trimmed)
    if (short) {
      if (short.expiresAt < now) {
        this.shortCodes.delete(short.code)
        this.shortCodes.delete(short.token)
        this.handleFailedAttempt(stat, now)
        return { success: false, reason: '配对码已过期，请在 PC 上刷新获取' }
      }
      this.shortCodes.delete(short.code)
      this.shortCodes.delete(short.token)

      // 认证成功，重置失败计数并记录认证归因
      if (stat) {
        stat.failedAttempts = 0
        stat.lockedUntil = 0
        stat.authType = '📱 扫码配对认证'
      }

      // 配对成功后派发 365 天长效会话 Token
      const sessionToken = randomBytes(32).toString('hex')
      const session: SessionRecord = {
        token: sessionToken,
        createdAt: now,
        lastSeenAt: now,
        ip,
        deviceName,
        userAgent: (userAgent || '').slice(0, 150),
        authType: '扫码配对码 (365天免登)',
      }
      this.sessions.set(sessionToken, session)
      this.savePersistedData()
      this.emit('device-connected', session)
      this.emit('ip-security-updated', { stats: this.getIpSecurityStats() })
      return { success: true, token: sessionToken }
```

</details>

**依据 6 · 源码核查**：[src/routes/api.ts:156-184](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/routes/api.ts#L156-L184)

解密和回退、Cookie 及失败状态。

<details>
<summary>查看原文（29行）</summary>

```text
      path: '/api/remote-mobile/verify',
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        const body = await parseJsonBody(req)
        let credential = ''

        if (body.encryptedCredential) {
          const decrypted = decryptWithPrivateKey(body.encryptedCredential)
          credential = (decrypted || body.credential || '').trim()
        } else if (body.credential) {
          credential = String(body.credential).trim()
        }

        const ua = req.headers['user-agent']
        const ip = getRealClientIp(req)

        const result = store.verify(credential, ua, ip)
        if (result.success && result.token) {
          const maxAge = 365 * 24 * 60 * 60
          const cookieVal = `${AUTH_COOKIE_NAME}=${result.token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`

          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Set-Cookie': cookieVal,
          })
          res.end(JSON.stringify({ success: true, token: result.token }))
        } else if (result.locked) {
          jsonResponse(res, 429, {
            success: false,
            locked: true,
```

</details>

**依据 7 · 源码核查**：[src/gateway/server.ts:285-310](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L285-L310)

Host 和共享门禁。

<details>
<summary>查看原文（26行）</summary>

```text
  private handleHttpRequest(req: IncomingMessage, res: ServerResponse): void {
    const originalHost = req.headers.host || ''

    // 1. Host 校验：不在有效网络白名单内的未知域名直接 400 阻断
    if (!this.isHostAllowed(originalHost)) {
      res.writeHead(400, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      })
      res.end(
        JSON.stringify({
          error: 'Bad Request',
          message: `未受信任的主机名: "${originalHost}"。若使用 Tailscale MagicDNS 或自定义域名，请在插件设置中的 trustedHosts 声明。`,
        })
      )
      return
    }

    // 网关已完成 Host 白名单校验，通知共享门禁跳过重复 Host 校验
    // （proxyHost 可能是自定义域名，不属于核心的 trustedHosts / 网卡 IP）
    ;(req as any).__dsh_rm_host_allowed__ = true

    // 2. 门禁中间件校验与原因标记获取
    this.gateMiddleware(req, res, () => {
      this.proxyHttpRequest(req, res)
    })
```

</details>

**依据 8 · 源码核查**：[src/auth/gate.ts:305-335](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/auth/gate.ts#L305-L335)

受配置免密或真实 token 校验。

<details>
<summary>查看原文（31行）</summary>

```text
    const clientIp = getClientIp(req)
    const options = store.getOptions()

    // 反向代理同样可能位于 LAN/Tailscale 网段；若携带 Forwarded 头，说明是代理而非
    // 真实客户端，不能再按 allowLan/allowTailscale 免密放行，否则外部用户可借代理绕过认证。
    const hasForwardedHeaders = Boolean(
      req.headers['x-forwarded-for'] ||
      req.headers['x-forwarded-host'] ||
      req.headers['x-forwarded-proto'] ||
      req.headers['x-real-ip']
    )

    // 3. 如果开启了 Tailscale 私网免密直连，且客户端来源是 Tailscale 虚拟网段，自动归因并放行
    if (!hasForwardedHeaders && options.allowTailscale && isTailscaleIp(clientIp)) {
      const ua = req.headers['user-agent'] || ''
      store.registerBypassDevice(clientIp, ua, 'Tailscale')
      return pass('bypass-tailscale')
    }

    // 4. 如果开启了局域网 LAN 免密直连，且客户端来源是局域网私有网段 (10.x / 172.16-31.x / 192.168.x)，自动归因并放行
    if (!hasForwardedHeaders && options.allowLan && isLanIp(clientIp)) {
      const ua = req.headers['user-agent'] || ''
      store.registerBypassDevice(clientIp, ua, 'LAN')
      return pass('bypass-lan')
    }

    // 5. 检查是否携带有效的授权会话 Token (Cookie / Header / URL Token)
    const token = store.extractTokenFromRequest(req)
    if (token && store.validateToken(token, clientIp)) {
      return pass('token')
    }
```

</details>

**依据 9 · 源码核查**：[src/gateway/server.ts:328-345](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L328-L345)

内部头清洗及生成。

<details>
<summary>查看原文（18行）</summary>

```text
    // 构造发往内部核心的请求头
    const proxyHeaders: Record<string, string | string[] | undefined> = { ...req.headers }

    // 强制消除客户端可能伪造的内部网关密钥头
    delete proxyHeaders['x-dsh-gateway-secret']

    // 注入当前进程真实有效的握手密钥，通知底座采纳真实客户端 IP
    const secret = getGatewaySecret(this.server)
    if (secret) {
      proxyHeaders['x-dsh-gateway-secret'] = secret
    }

    // 规范化溯源专用代理头
    proxyHeaders['x-dsh-real-ip'] = clientIp
    proxyHeaders['x-real-ip'] = clientIp
    proxyHeaders['x-forwarded-for'] = clientIp
    proxyHeaders['x-original-host'] = originalHost
    proxyHeaders['x-forwarded-host'] = this.coreTargetAuthority
```

</details>

**依据 10 · 源码核查**：[src/gateway/server.ts:437-465](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L437-L465)

实际 HTTP 与 SSE 转发。

<details>
<summary>查看原文（29行）</summary>

```text
    const proxyReq = http.request(
      {
        hostname: this.coreHost,
        port: this.corePort,
        path: req.url,
        method: req.method,
        headers: proxyHeaders,
      },
      (proxyRes) => {
        // 1. 重定向 Location 头改写：防止底座 302 重定向到 127.0.0.1 导致手机打不开
        const location = proxyRes.headers.location
        if (location && [301, 302, 303, 307, 308].includes(proxyRes.statusCode || 0)) {
          proxyRes.headers.location = this.rewriteRedirectLocation(location, originalHost, externalProto)
        }

        // 2. 针对 SSE 长连接流式输出（打字机效果），禁用代理缓冲并立即刷头
        const contentType = String(proxyRes.headers['content-type'] || '').toLowerCase()
        if (contentType.includes('text/event-stream')) {
          proxyRes.headers['x-accel-buffering'] = 'no'
          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
          if (typeof res.flushHeaders === 'function') {
            res.flushHeaders()
          }
        } else {
          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers)
        }

        // 3. 将底座响应流透明 pipe 回客户端
        proxyRes.pipe(res)
```

</details>

**依据 11 · 源码核查**：[src/gateway/server.ts:493-529](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L493-L529)

真实升级检查和拒绝。

<details>
<summary>查看原文（37行）</summary>

```text
  private handleUpgrade(req: IncomingMessage, clientSocket: Socket | any, head: Buffer): void {
    const originalHost = req.headers.host || ''

    // 1. Host 白名单校验
    if (!this.isHostAllowed(originalHost)) {
      clientSocket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n')
      clientSocket.destroy()
      return
    }

    // 网关已完成 Host 白名单校验，通知共享门禁跳过重复 Host 校验
    ;(req as any).__dsh_rm_host_allowed__ = true

    const externalProto = this.getExternalProtocol(req)

    // 2. WebSocket 跨站劫持 (CSWSH) 校验：Origin 必须与当前 Host 同源
    const origin = req.headers.origin
    if (typeof origin === 'string' && origin) {
      try {
        const originUrl = new URL(origin)
        if (!isSameOriginOrLocalEquivalent(originUrl.host, originalHost, originUrl.protocol, externalProto)) {
          clientSocket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
          clientSocket.destroy()
          return
        }
      } catch {
        clientSocket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
        clientSocket.destroy()
        return
      }
    }

    // 3. 门禁鉴权守卫：未通过身份校验的 WebSocket 连接直接拒绝
    if (!isRequestAuthorizedByGate(req, this.store)) {
      clientSocket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n')
      clientSocket.destroy()
      return
```

</details>

**依据 12 · 源码核查**：[src/gateway/server.ts:609-645](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L609-L645)

握手后全双工透传。

<details>
<summary>查看原文（37行）</summary>

```text
    proxyReq.on('upgrade', (proxyRes, coreSocket, proxyHead) => {
      isUpgraded = true
      clientSocket.removeListener('close', onEarlyClose)

      // 升级成功：立即清除握手阶段的超时定时器，保证长连接不被误杀
      proxyReq.setTimeout(0)

      // 下发 101 Switching Protocols 响应头给客户端
      const rawStatusLine = `HTTP/${proxyRes.httpVersion} 101 Switching Protocols\r\n`
      let headersStr = ''
      const raw = proxyRes.rawHeaders
      for (let i = 0; i < raw.length; i += 2) {
        headersStr += `${raw[i]}: ${raw[i + 1]}\r\n`
      }
      clientSocket.write(`${rawStatusLine}${headersStr}\r\n`)

      // 推回预先消费的头缓冲区
      if (proxyHead && proxyHead.length) {
        clientSocket.unshift(proxyHead)
      }
      if (head && head.length) {
        coreSocket.unshift(head)
      }

      // 开启 TCP_NODELAY，关闭 Nagle 算法，消除终端交互延迟
      clientSocket.setNoDelay(true)
      coreSocket.setNoDelay(true)

      // 全双工透传
      clientSocket.pipe(coreSocket)
      coreSocket.pipe(clientSocket)

      // 异常互斥同步清理
      clientSocket.on('error', () => coreSocket.destroy())
      coreSocket.on('error', () => clientSocket.destroy())
      clientSocket.on('close', () => coreSocket.destroy())
      coreSocket.on('close', () => clientSocket.destroy())
```

</details>

**依据 13 · 源码核查**：[src/bridge/compat.ts:1038-1061](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/bridge/compat.ts#L1038-L1061)

宿主 Connection 鉴权兼容接线。

<details>
<summary>查看原文（24行）</summary>

```text
export function takeOverConnectionAuth(connection: any, store: SessionStore): void {
  if (!connection || connection.__dsh_rm_auth_takeover__) return
  connection.__dsh_rm_auth_takeover__ = true

  // 1. 接管底层统一的 browserAuth.isAuthenticated (供各类 RPC/WebSocket 与内部检查调用)
  if (connection.browserAuth && typeof connection.browserAuth.isAuthenticated === 'function') {
    const origIsAuthenticated = connection.browserAuth.isAuthenticated.bind(connection.browserAuth)
    connection.browserAuth.isAuthenticated = (request: any): boolean => {
      if (isRequestAuthorizedByGate(request, store)) {
        return true
      }
      return origIsAuthenticated(request)
    }
  }

  // 2. 接管 connection.requestRejection (底层拦截未授权的 RPC / WebSocket 请求)
  if (typeof connection.requestRejection === 'function') {
    const origRequestRejection = connection.requestRejection.bind(connection)
    connection.requestRejection = (request: any): number | undefined => {
      if (isRequestAuthorizedByGate(request, store)) {
        return undefined // 明确放行，杜绝 401
      }
      return origRequestRejection(request)
    }
```

</details>

#### 缺口

- 没有真实宿主版本和手机链路结果。
  **影响**：不能证明代理、适配、认证在具体配置中全接通。
  **进一步探讨**：固定版本与网络，记录拒绝、配对、HTTP 与升级响应。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 传输、权限、免密和撤销有哪些边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

默认监听所有 IPv4 接口，网关创建 HTTP server。Cookie 无 Secure，验证也接受明文并可将 token 回 JSON。服务端 token 365 天过期，收到合法 token 会更新 IP，不能当成绑定设备或网络。状态接口会返回设备列表，列表包含 token 原值，已获入口授权后未见额外按设备角色过滤。可选 LAN/Tailscale 免密默认关，以网络来源判断，提供转发头的请求不走该免密分支。HTTP 转发用首个合法 X-Forwarded-For 归因，调用点未显式检查上游是不是预期反代，认证审计和 IP 限频效果须实测。撤销删除 store 并发事件，新请求按当前 token 核对。代理升级后只做双向管道，没查到撤销事件针对已建立 WS 的关闭；应验证新请求和已有连接。停止网关才有统一销毁 socket。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:238-245](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/index.ts#L238-L245)

默认端口和所有 IPv4 接口。

```text
  if (detection.mode === 'proxy') {
    const opts = store.getOptions()
    gatewayServer = new GatewayServer(
      {
        port: opts.proxyPort ?? 3081,
        host: opts.proxyHost ?? '0.0.0.0',
        corePort: detection.corePort,
        coreHost: detection.coreHost,
```

**依据 2 · 源码核查**：[src/gateway/server.ts:166-182](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L166-L182)

实际 HTTP 和 upgrade server。

<details>
<summary>查看原文（17行）</summary>

```text

    this.status = 'starting'
    this.lastError = null

    const server = http.createServer((req, res) => {
      this.handleHttpRequest(req, res)
    })

    server.on('upgrade', (req, socket, head) => {
      this.handleUpgrade(req, socket, head)
    })

    server.on('connection', (socket: Socket) => {
      this.activeSockets.add(socket)
      socket.on('close', () => {
        this.activeSockets.delete(socket)
      })
```

</details>

**依据 3 · 源码核查**：[src/routes/api.ts:161-180](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/routes/api.ts#L161-L180)

明文兼容、Cookie 属性及 JSON token。

<details>
<summary>查看原文（20行）</summary>

```text
        if (body.encryptedCredential) {
          const decrypted = decryptWithPrivateKey(body.encryptedCredential)
          credential = (decrypted || body.credential || '').trim()
        } else if (body.credential) {
          credential = String(body.credential).trim()
        }

        const ua = req.headers['user-agent']
        const ip = getRealClientIp(req)

        const result = store.verify(credential, ua, ip)
        if (result.success && result.token) {
          const maxAge = 365 * 24 * 60 * 60
          const cookieVal = `${AUTH_COOKIE_NAME}=${result.token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`

          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Set-Cookie': cookieVal,
          })
          res.end(JSON.stringify({ success: true, token: result.token }))
```

</details>

**依据 4 · 源码核查**：[src/auth/token.ts:850-869](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/auth/token.ts#L850-L869)

到期及 IP 更新。

<details>
<summary>查看原文（20行）</summary>

```text
  validateToken(token: string, clientIp?: string): boolean {
    if (!token) return false
    const session = this.sessions.get(token)
    if (!session) return false

    const now = Date.now()
    // 服务端 365 天过期校验（与客户端 Cookie Max-Age 对齐）
    const MAX_SESSION_AGE = 365 * 24 * 60 * 60 * 1000
    if (now - session.createdAt > MAX_SESSION_AGE) {
      this.sessions.delete(token)
      this.savePersistedData()
      return false
    }

    // 设备距离上次活跃超过 5 分钟，判定为重连上线，触发上线提醒（避免连续请求重复弹窗）
    const isReconnecting = (now - (session.lastSeenAt || 0)) > 5 * 60 * 1000
    session.lastSeenAt = now

    if (clientIp) {
      session.ip = clientIp
```

</details>

**依据 5 · 源码核查**：[src/auth/token.ts:905-920](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/auth/token.ts#L905-L920)

三类 bearer 入口。

<details>
<summary>查看原文（16行）</summary>

```text
  extractTokenFromRequest(req: IncomingMessage): string | null {
    const cookies = req.headers.cookie || ''
    const match = cookies.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE_NAME}=([^;]+)`))
    if (match) return match[1]

    const authHeader = req.headers.authorization || ''
    if (authHeader.startsWith('Bearer ')) return authHeader.slice(7).trim()

    if (req.url && (req.url.includes('rm_token=') || req.url.includes('auth_token='))) {
      try {
        const u = new URL(req.url, 'http://localhost')
        const t = u.searchParams.get('rm_token') || u.searchParams.get('auth_token')
        if (t) return t
      } catch {}
    }
    return null
```

</details>

**依据 6 · 源码核查**：[src/routes/api.ts:85-113](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/routes/api.ts#L85-L113)

状态接口返回设备列表。

<details>
<summary>查看原文（29行）</summary>

```text
    // 1. 状态查询接口 (返回 Tailscale IP、局域网 LAN IP 与 IP 防暴破安全统计)
    {
      kind: 'exact',
      method: 'GET',
      path: '/api/remote-mobile/status',
      handler: async (_req: IncomingMessage, res: ServerResponse) => {
        const opts = store.getOptions()
        const tsIp = getLocalTailscaleIp()
        const lanIp = getLocalLanIp()
        const ips = getAllNetworkIps()
        const sessionStats = store.getSessionsList()
        const ipSecurityStats = store.getIpSecurityStats()
        const bridgeState = getPairingBridgeState()

        jsonResponse(res, 200, {
          success: true,
          locale: readGlobalLocale(),
          tailscaleIp: tsIp,
          lanIp,
          networkIps: ips,
          allowTailscale: opts.allowTailscale,
          allowLan: opts.allowLan,
          hasSecret: Boolean(opts.secretHash || opts.secret),
          maxVisitsPerMinute: opts.maxVisitsPerMinute,
          maxFailedAttempts: opts.maxFailedAttempts,
          lockDurationMs: opts.lockDurationMs,
          devicesCount: sessionStats.count,
          devices: sessionStats.devices,
          ipSecurityStats,
```

</details>

**依据 7 · 源码核查**：[src/auth/token.ts:999-1013](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/auth/token.ts#L999-L1013)

列表包含原始 token。

<details>
<summary>查看原文（15行）</summary>

```text
  getSessionsList(): { count: number; devices: Array<Omit<SessionRecord, 'userAgent'>> } {
    const list = Array.from(this.sessions.values()).map((s) => ({
      token: s.token,
      deviceName: s.deviceName || parseDeviceName(s.userAgent),
      ip: s.ip || '未知',
      createdAt: s.createdAt,
      lastSeenAt: s.lastSeenAt,
      authType: s.authType || '配对认证',
      isBypass: Boolean(s.isBypass),
    }))
    list.sort((a, b) => b.lastSeenAt - a.lastSeenAt)
    return {
      count: list.length,
      devices: list,
    }
```

</details>

**依据 8 · 源码核查**：[src/auth/token.ts:268-280](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/auth/token.ts#L268-L280)

免密默认关。

<details>
<summary>查看原文（13行）</summary>

```text
  return {
    allowTailscale: merged.allowTailscale ?? false,
    allowLan: merged.allowLan ?? false,
    secret: '',
    secretHash,
    devicesFile: merged.devicesFile ?? DEFAULT_PERSIST_FILE,
    maxFailedAttempts: merged.maxFailedAttempts ?? 5,
    lockDurationMs: merged.lockDurationMs ?? 15 * 60 * 1000,
    maxVisitsPerMinute: merged.maxVisitsPerMinute ?? 60,
    proxyPort: merged.proxyPort ?? 3081,
    proxyHost: merged.proxyHost ?? '0.0.0.0',
    mode: merged.mode === 'direct' ? 'direct' : 'proxy',
    trustedHosts: Array.isArray(merged.trustedHosts) ? merged.trustedHosts : [],
```

</details>

**依据 9 · 源码核查**：[src/gateway/server.ts:137-146](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L137-L146)

采信首个合法 XFF。

<details>
<summary>查看原文（10行）</summary>

```text
  private getEffectiveClientIp(req: IncomingMessage, useForwardedFor: boolean): string {
    if (useForwardedFor) {
      const raw = req.headers['x-forwarded-for']
      const value = Array.isArray(raw) ? raw[0] : raw
      if (typeof value === 'string') {
        const first = value.split(',')[0].trim().replace(/^::ffff:/, '')
        if (isIP(first)) return first
      }
    }
    return getClientIp(req)
```

</details>

**依据 10 · 源码核查**：[src/gateway/server.ts:319-345](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L319-L345)

HTTP 归因由是否转发头触发。

<details>
<summary>查看原文（27行）</summary>

```text
    const gateResult = (req as any).__dsh_rm_gate_result || 'public'
    // 以门禁判定结果为准：同机反代会从 127 连入但 Host/Forwarded 指向外部，
    // 不能被误当成 loopback 本机流量。
    const isLoopbackClient = gateResult === 'loopback'
    const clientIp = this.getEffectiveClientIp(
      req,
      !isLoopbackClient && this.hasForwardedHeaders(req)
    )

    // 构造发往内部核心的请求头
    const proxyHeaders: Record<string, string | string[] | undefined> = { ...req.headers }

    // 强制消除客户端可能伪造的内部网关密钥头
    delete proxyHeaders['x-dsh-gateway-secret']

    // 注入当前进程真实有效的握手密钥，通知底座采纳真实客户端 IP
    const secret = getGatewaySecret(this.server)
    if (secret) {
      proxyHeaders['x-dsh-gateway-secret'] = secret
    }

    // 规范化溯源专用代理头
    proxyHeaders['x-dsh-real-ip'] = clientIp
    proxyHeaders['x-real-ip'] = clientIp
    proxyHeaders['x-forwarded-for'] = clientIp
    proxyHeaders['x-original-host'] = originalHost
    proxyHeaders['x-forwarded-host'] = this.coreTargetAuthority
```

</details>

**依据 11 · 源码核查**：[src/auth/token.ts:1016-1027](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/auth/token.ts#L1016-L1027)

撤销删除并发事件。

<details>
<summary>查看原文（12行）</summary>

```text
  revokeDevice(token: string): boolean {
    if (!token) return false
    const ok = this.sessions.delete(token)
    this.savePersistedData()
    this.emit('device-revoked', { token })
    return ok
  }

  revokeAllSessions() {
    this.sessions.clear()
    this.savePersistedData()
    this.emit('device-revoked', { all: true })
```

</details>

**依据 12 · 源码核查**：[src/gateway/server.ts:633-645](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L633-L645)

升级后仅透传和错误清理。

<details>
<summary>查看原文（13行）</summary>

```text
      // 开启 TCP_NODELAY，关闭 Nagle 算法，消除终端交互延迟
      clientSocket.setNoDelay(true)
      coreSocket.setNoDelay(true)

      // 全双工透传
      clientSocket.pipe(coreSocket)
      coreSocket.pipe(clientSocket)

      // 异常互斥同步清理
      clientSocket.on('error', () => coreSocket.destroy())
      coreSocket.on('error', () => clientSocket.destroy())
      clientSocket.on('close', () => coreSocket.destroy())
      coreSocket.on('close', () => clientSocket.destroy())
```

</details>

**依据 13 · 源码核查**：[src/gateway/server.ts:229-245](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L229-L245)

关网关会统一销毁连接。

<details>
<summary>查看原文（17行）</summary>

```text
  public async close(): Promise<void> {
    if (!this.server) {
      this.status = 'stopped'
      return
    }

    // 1. 遍历销毁所有保持活跃的连接（包括 Keep-Alive 与长连接 WebSocket）
    for (const socket of this.activeSockets) {
      try {
        socket.destroy()
      } catch {}
    }
    this.activeSockets.clear()

    // 2. 彻底关闭 Server 监听并释放所有连接
    const s = this.server
    this.server = null
```

</details>

#### 缺口

- 实际 Host 额外授权、转发头信任和长连接撤销未验证。
  **影响**：已经连接的客户端或获得 token 的设备可能超过预期控制范围。
  **进一步探讨**：隔离网络内验证 token 数据最小化、代理边界、撤销后的旧连接和无 token 新请求。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 网络、存储、版本和维护依赖是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包 1.10.3，Node >=18 是包声明，Host 需 webServer 和目标组合的 Connection 接缝。作者说明当前 DSH 常用 proxy 保留核心回环，核心直接监听或探测异常可能用 direct；代理启动失败则有状态标记。整个传输需网络与 HTTPS 等外层保护。设备文件保存完整 token，权限收紧和写入错误被吞，持久化回执需验证；密码采用 scrypt，RSA 密钥和设备文件也需单独维护。成本包括网络与证书配置、反代、设备撤销和检查出站，未测耗时。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-27](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/package.json#L23-L27)

Node 声明。

```text
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "engines": {
    "node": ">=18.0.0"
```

**依据 2 · 源码核查**：[src/index.ts:51-60](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/index.ts#L51-L60)

宿主 Web 依赖及设置条件。

<details>
<summary>查看原文（10行）</summary>

```text

/** Cordis 依赖注入声明：声明注入底座内置的 webServer 服务 */
export const inject = ['webServer']

/**
 * 尽力接入 DSH Settings 服务（若宿主提供旧版 register API）。
 *
 * 说明：DSH 0.1.7+ 起官方 dsh-settings 已改为基于 profile cordis.patch.yml 的
 * Config 表单模型（无 register 方法），本函数在该版本下会安全跳过；插件的配置
 * 持久化改由自有 settings.json 承担（见 token.ts）。
```

</details>

**依据 3 · 源码核查**：[src/index.ts:209-232](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/index.ts#L209-L232)

探测 direct 与 proxy。

<details>
<summary>查看原文（24行）</summary>

```text
  // 6. 探测 DSH 底座网络暴露姿态：默认 proxy；核心已对外监听时回退 direct。
  // 检测逻辑本身不抛错，异常时仍保留兜底，避免插件 apply 崩溃。
  let modeFallbackError = ''
  let detection: ReturnType<typeof detectServerMode>
  try {
    detection = detectServerMode(ctx, store.getOptions().mode, ctx.webServer?.port ?? 3080)
  } catch (err: any) {
    modeFallbackError = err?.message || String(err)
    ctx.logger?.error?.('[dsh-remote-mobile] 安全接入代理配置不可用，已回退 direct 模式:', err)
    detection = detectServerMode(ctx, 'direct', ctx.webServer?.port ?? 3080)
  }

  // proxy 是默认模式，但核心已对外监听时会回退 direct：
  // - 旧版 webserver 配置（0.0.0.0 / 具体网卡 IP）继续可用；
  // - direct + 回环核心时，外部手机无法直连，仅适合同机反向代理。
  bindDirectoryPickerRuntime(ctx, () => detection.isLoopback)
  const requestedMode = store.getOptions().mode ?? 'proxy'
  const legacyDirectFallback =
    requestedMode === 'proxy' && detection.mode === 'direct' && !detection.isLoopback
  const directLoopbackWarning = detection.mode === 'direct' && detection.isLoopback
  const modeWarning = legacyDirectFallback
    ? `检测到底座监听 ${detection.rawCoreHost}，已自动使用 direct 模式；3080 直接对外，如需 proxy 请恢复 127.0.0.1 监听。`
    : directLoopbackWarning
      ? 'direct 模式 + 回环核心：外部手机无法直连，仅适合同机反向代理。'
```

</details>

**依据 4 · 源码核查**：[src/index.ts:255-269](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/index.ts#L255-L269)

代理启动失败和 direct 状态。

<details>
<summary>查看原文（15行）</summary>

```text
    gatewayReadyPromise = gatewayServer.start().then(({ port }) => {
      if (gatewayServer?.getServer()) {
        setGatewaySecret(gatewayServer.getServer(), gatewaySecret)
      }
      store.setActiveGatewayInfo('proxy', port, detection.corePort, true)
      syncTrustedHosts()
      return port
    }).catch((err) => {
      store.setActiveGatewayInfo('proxy', opts.proxyPort ?? 3081, detection.corePort, false, err?.message || String(err))
      ctx.logger?.error?.('[dsh-remote-mobile] 安全接入代理启动失败:', err)
      return opts.proxyPort ?? 3081
    })
  } else {
    store.setActiveGatewayInfo('direct', detection.corePort, detection.corePort, true)
    gatewayReadyPromise = Promise.resolve(detection.corePort)
```

</details>

**依据 5 · 作者声明**：[README.md:84-94](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/README.md#L84-L94)

作者说明端口和传输条件。

<details>
<summary>查看原文（11行）</summary>

```text
### 2. 前置配置（插件 1.10.0+ 无需 webserver 配置）

本插件 1.10.0+ 不需要修改 `webserver` 或 `cordis.patch.yml`：

- DSH 0.2.1+ 保持默认 `127.0.0.1:3080`；
- 本插件自动启动 `3081` 安全接入代理；
- 手机扫码或使用长期密码即可接入。

> 本节适用于本插件 1.10.0+。

> **安全权衡说明**：安全接入代理默认监听 `0.0.0.0:3081`（暂不含 TLS）。若在公共 Wi-Fi 或未经保护的网络下使用，建议配合 Tailscale（WireGuard 隧道加密）或外层 HTTPS。
```

</details>

**依据 6 · 源码核查**：[src/auth/token.ts:1115-1129](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/auth/token.ts#L1115-L1129)

持久化完整 token 及写入和权限错误边界。

<details>
<summary>查看原文（15行）</summary>

```text
  flushPersistedData() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }
    try {
      mkdirSync(dirname(this.persistPath), { recursive: true })
      const payload = {
        devices: Array.from(this.sessions.values()),
        ipStats: Array.from(this.ipStats.values()),
      }
      writeFileSync(this.persistPath, JSON.stringify(payload, null, 2), 'utf8')
      // 会话文件内含长效 Token（即完整凭证），权限与 rsa-keys.json 对齐收紧为仅当前用户可读写
      try { chmodSync(this.persistPath, 0o600) } catch {}
    } catch {}
```

</details>

**依据 7 · 源码核查**：[src/auth/crypto.ts:141-161](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/auth/crypto.ts#L141-L161)

密码哈希及比较。

<details>
<summary>查看原文（21行）</summary>

```text
export function hashSecret(plainSecret: string): string {
  if (!plainSecret) return ''
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(plainSecret, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}

/**
 * 比对明文密码与存储的加盐哈希（恒定时间比对，抵御时序侧信道攻击）
 */
export function verifySecretHash(plainSecret: string, storedHashOrPlain: string): boolean {
  if (!storedHashOrPlain || !plainSecret) return false

  if (storedHashOrPlain.startsWith('scrypt:')) {
    const parts = storedHashOrPlain.split(':')
    if (parts.length !== 3) return false
    const salt = parts[1]
    const expectedHash = parts[2]
    const actualHash = scryptSync(plainSecret, salt, 64).toString('hex')
    if (actualHash.length !== expectedHash.length) return false
    return timingSafeEqual(Buffer.from(actualHash, 'hex'), Buffer.from(expectedHash, 'hex'))
```

</details>

#### 缺口

- 未测试外层网络、文件权限或重启状态恢复。
  **影响**：无法据配置和 UI 判断设备权限实际回收。
  **进一步探讨**：核对监听、配置、设备文件权限与一次完整回滚。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样在隔离网络验收？

**研究主题**：新假设与验证、采用判断

#### 完整回答

保持观察。用无业务数据的隔离宿主、批准的加密链路、关免密和最小权限，对比原生受控反代与插件。验证未授权请求、跨 Origin 升级、授权查看、撤销后的新旧连接、状态与转发头。将短期可撤销设备权限、最小化设备列表和连接关闭回执分别验收，可能减少误用和撤销后的持续访问。发现列表泄漏真实凭据、已有连接继续或来源不可核对时关网关并回到本地入口。

#### 证据与依据

**依据 1 · 源码核查**：[src/gateway/server.ts:493-529](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L493-L529)

验证 Host、Origin 与授权拒绝。

<details>
<summary>查看原文（37行）</summary>

```text
  private handleUpgrade(req: IncomingMessage, clientSocket: Socket | any, head: Buffer): void {
    const originalHost = req.headers.host || ''

    // 1. Host 白名单校验
    if (!this.isHostAllowed(originalHost)) {
      clientSocket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n')
      clientSocket.destroy()
      return
    }

    // 网关已完成 Host 白名单校验，通知共享门禁跳过重复 Host 校验
    ;(req as any).__dsh_rm_host_allowed__ = true

    const externalProto = this.getExternalProtocol(req)

    // 2. WebSocket 跨站劫持 (CSWSH) 校验：Origin 必须与当前 Host 同源
    const origin = req.headers.origin
    if (typeof origin === 'string' && origin) {
      try {
        const originUrl = new URL(origin)
        if (!isSameOriginOrLocalEquivalent(originUrl.host, originalHost, originUrl.protocol, externalProto)) {
          clientSocket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
          clientSocket.destroy()
          return
        }
      } catch {
        clientSocket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
        clientSocket.destroy()
        return
      }
    }

    // 3. 门禁鉴权守卫：未通过身份校验的 WebSocket 连接直接拒绝
    if (!isRequestAuthorizedByGate(req, this.store)) {
      clientSocket.write('HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n')
      clientSocket.destroy()
      return
```

</details>

**依据 2 · 源码核查**：[src/auth/token.ts:1016-1027](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/auth/token.ts#L1016-L1027)

撤销数据边界。

<details>
<summary>查看原文（12行）</summary>

```text
  revokeDevice(token: string): boolean {
    if (!token) return false
    const ok = this.sessions.delete(token)
    this.savePersistedData()
    this.emit('device-revoked', { token })
    return ok
  }

  revokeAllSessions() {
    this.sessions.clear()
    this.savePersistedData()
    this.emit('device-revoked', { all: true })
```

</details>

**依据 3 · 源码核查**：[src/gateway/server.ts:633-645](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L633-L645)

验证已有长连接。

<details>
<summary>查看原文（13行）</summary>

```text
      // 开启 TCP_NODELAY，关闭 Nagle 算法，消除终端交互延迟
      clientSocket.setNoDelay(true)
      coreSocket.setNoDelay(true)

      // 全双工透传
      clientSocket.pipe(coreSocket)
      coreSocket.pipe(clientSocket)

      // 异常互斥同步清理
      clientSocket.on('error', () => coreSocket.destroy())
      coreSocket.on('error', () => clientSocket.destroy())
      clientSocket.on('close', () => coreSocket.destroy())
      coreSocket.on('close', () => clientSocket.destroy())
```

</details>

**依据 4 · 源码核查**：[src/gateway/server.ts:229-245](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/gateway/server.ts#L229-L245)

停用代理后连接清理。

<details>
<summary>查看原文（17行）</summary>

```text
  public async close(): Promise<void> {
    if (!this.server) {
      this.status = 'stopped'
      return
    }

    // 1. 遍历销毁所有保持活跃的连接（包括 Keep-Alive 与长连接 WebSocket）
    for (const socket of this.activeSockets) {
      try {
        socket.destroy()
      } catch {}
    }
    this.activeSockets.clear()

    // 2. 彻底关闭 Server 监听并释放所有连接
    const s = this.server
    this.server = null
```

</details>

**依据 5 · 源码核查**：[src/auth/token.ts:999-1013](https://github.com/IceApriler/dsh-remote-mobile/blob/bc553829562afd178209211b0893c3dc1d35270c/src/auth/token.ts#L999-L1013)

验收列表字段可见性。

<details>
<summary>查看原文（15行）</summary>

```text
  getSessionsList(): { count: number; devices: Array<Omit<SessionRecord, 'userAgent'>> } {
    const list = Array.from(this.sessions.values()).map((s) => ({
      token: s.token,
      deviceName: s.deviceName || parseDeviceName(s.userAgent),
      ip: s.ip || '未知',
      createdAt: s.createdAt,
      lastSeenAt: s.lastSeenAt,
      authType: s.authType || '配对认证',
      isBypass: Boolean(s.isBypass),
    }))
    list.sort((a, b) => b.lastSeenAt - a.lastSeenAt)
    return {
      count: list.length,
      devices: list,
    }
```

</details>

#### 缺口

- 未运行目标或真实网络。
  **影响**：移动使用收益和安全判据仍待核。
  **进一步探讨**：记录请求、活动连接、Token 生命周期和隔离范围，不放真实凭据进样本。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
