# DSH Bridge

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[9c529f5](https://github.com/wenbin-wb/dsh-bridge/tree/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928)

<!-- BEGIN META -->
[![GitHub ★ 258](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=258&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wenbin-wb/dsh-bridge) [![npm 30d 12,564](https://img.shields.io/static/v1?label=npm+30d&message=12%2C564&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wenbin_wb/dsh-bridge) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wenbin_wb/dsh-bridge)
<!-- END META -->

> **功能**：通过局域网、隧道或聊天机器人，在手机上接入并继续本机 DeepSeek Harness 任务。

> **亮点**：把手机入口接到实际 DSH 会话，在代理中处理两类本机签名 cookie，并在 IM 起轮时绑定发起人，普通网页审批仍留给宿主。见 [Q02](#research-q02)、[Q03](#research-q03)。

> **主要限制**：外部入口能访问不代表拓扑认证正确。会话取消、登出、IM 发送者和宿主任务结果都需要分别回读。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 远程入口如何接到本机 DSH？](#detail-section-11)
  - [Q02 · 代理怎样认证外部请求，退出意味着什么？](#detail-section-12)
  - [Q03 · IM 的审批如何找到正确发起者和会话？](#detail-section-13)
  - [Q04 · 版本差异如何影响会话、移动界面和隧道运维？](#detail-section-14)
  - [Q05 · 什么结果足以决定是否扩大远程使用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已经在本机运行 DSH、离开电脑后仍需查看任务和批准的用户，可以从移动网页或 IM 接入。见 [Q01](#research-q01)。

本机 DSH 操作便于直接观察任务，通用端口转发只提供网络入口。Bridge 增加宿主签名接合、移动界面和按实际会话的批准路由。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 远程网页代理 | 从移动端接回本机任务 | 依赖有效网络与实际入口认证 |
| 原生凭据适配 | 让本机宿主识别代理请求 | 需要可用本机密钥和兼容宿主 |
| IM 会话和审批 | 在聊天渠道接续任务和确认操作 | 发起人、会话及平台身份必须一致 |
| 兼容诊断 | 查看隧道二进制、会话和运维状态 | 诊断和真实可用性需分别核验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 和持续运行的本机宿主 | 必需 | 提供任务和本机接口 | 无法接回会话或继续任务 |
| 有效认证、拓扑和保护范围 | 外部入口需要 | 拒绝未授权代理请求 | 关闭对外入口并在测试宿主核对 |
| 本机宿主签名密钥 | 原生 cookie 适配需要 | 转发时为宿主提供本机凭据 | 代理可达但上游可能拒绝 |
| 局域网、隧道或授权 IM 账号 | 对应入口需要 | 传输任务、消息和批准 | 核可用性与账号发送者传递 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在非敏感测试宿主配置单一入口 | 端口、作用范围和访问方式可辨认 |
| 核认证 | 用未认证和已认证客户端分别访问 | 未授权被拒，授权可接回正确任务 |
| 核 IM | 用测试账号分别从 GUI 和 IM 发起任务 | 审批发给正确发起人，拒绝他人回复 |
| 退出 | 停止入口，独立验证旧凭据及本机状态 | 有漏验时保持关闭并回到本机 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 主机、网络和平台资源 | 配网、账号、凭据及认证验证 | 接入时间和费用未测 |
| 持续使用 | 主机常驻、带宽与模型调用 | 更新二进制、轮换凭据、核平台适配 | 任务级资源与响应时间未知 |
| 故障恢复 | 可能需要重复连接和诊断 | 核任务是否执行、撤销和审批归属 | 断连时无法直接判断副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 网页接回 | 双层认证和 HTTP/WS 转发 | 跨网可用性和实际拓扑 |
| IM 审批 | 按真实会话和发起人匹配 | 全平台身份及并发 |
| 移动兼容 | 处理缓存布局与抽屉状态 | 真机可用性 |
| 退出 | 浏览器 cookie 清除路径 | 实际会话撤销与长期凭据状态 |

以一次正确接回任务、批准并退出为单位，比较确认时间及网络资源。

> **思考**：外部入口能访问不代表拓扑认证正确。会话取消、登出、IM 发送者和宿主任务结果都需要分别回读。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把手机入口接到实际 DSH 会话，在代理中处理两类本机签名 cookie，并在 IM 起轮时绑定发起人，普通网页审批仍留给宿主。见 [Q02](#research-q02)、[Q03](#research-q03)。

网页代理区分外层认证和宿主签名。IM 与 GUI 通过实际发起的轮次分流批准。缓存兼容与移动 DOM 适配需要随宿主变化复核。

<a id="detail-section-5"></a>

### 1.4 主要限制

外部入口能访问不代表拓扑认证正确。会话取消、登出、IM 发送者和宿主任务结果都需要分别回读。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察非敏感测试宿主的一条受保护入口。发现未授权可达、审批发错人或旧凭据可用时，停用入口并回本机核查。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代理、宿主签名、审批归属与兼容处理。真实公网和平台行为未验证，入口和撤销联合记录属于待验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、client/index.js、lib/auth/manager.js、lib/auth/dsh-native-cookie.js、lib/platform/conversation-bridge.js、lib/platform/dsh-storage.js、lib/platform/session-catalog.js、lib/cloudflared-manager.mjs、lib/platform/system-metrics.js、CHANGELOG.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查宿主挂载、HTTP/WS 认证和本机签名、共享 IM 桥、会话缓存及代表界面和运维变更。未执行目标代码，未建立外部服务或读取真实凭据，四平台 SDK 与所有公网拓扑不在完整核查范围。
- 下一步：先在隔离宿主从真实测试入口核未授权和撤销，再做 IM 错误发起者、旧会话和手机界面检查。

**分析版本**

- **仓库**：[wenbin-wb/dsh-bridge](https://github.com/wenbin-wb/dsh-bridge)
- **版本号**：2.17.9（[固定提交 9c529f5](https://github.com/wenbin-wb/dsh-bridge/tree/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可保存实际入口、授权判定、批准归属和撤销回读的联合记录。若比人工日志更难定位问题，或无法更早发现漏验，则保留手工核验。见 [Q05](#research-q05)。

先在隔离宿主从真实测试入口核未授权和撤销，再做 IM 错误发起者、旧会话和手机界面检查。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 30 | 6918 | — | — | 100591 |
| .mjs | source | 13 | 143884 | 108703 | 35117 | — |
| .js | source | 61 | 39093 | 30715 | 6363 | — |
| .ts | example | 6 | 276 | 178 | 64 | — |
| .md | example | 1 | 68 | — | — | 382 |
| .mjs | test | 89 | 25712 | 20559 | 3001 | — |
| .mjs | example | 1 | 134 | 94 | 34 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/wenbin-wb/dsh-bridge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=20&color=737b86&logo=github)](https://github.com/wenbin-wb/dsh-bridge/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 45](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=45&color=737b86&logo=github)](https://github.com/wenbin-wb/dsh-bridge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：手机或 IM 接回本机 DSH 时，怎样核实入口认证、宿主会话和操作批准仍属于正确的用户与轮次？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 远程入口如何接到本机 DSH？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

用户已经在本机运行 DSH，希望离开电脑后查看或继续已有任务。原办法是在本机完成，或另行配置网页访问和消息转发。该插件根包由 Cordis 补丁挂载，客户端在宿主设置中接入远程访问面板。服务端创建独立代理，读已保存的局域网、隧道和平台配置，同时使用宿主会话、Agent 与批准服务。代理启动由插件生命周期触发，卸载时回收 RPC 和平台实例。网页请求经代理转发给本机 HTTP 端口，移动用户触达原有 DSH，而任务仍由主机执行。实际入口取决于绑定网卡、转发方式及有效认证，关闭浏览器不能推断本机任务结束。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/cordis.patch.yml#L1-L4)

挂载同名根包。

```text
# dsh-bridge bundle patch
- insert:
    - id: dsh-bridge
      name: '@wenbin_wb/dsh-bridge'
```

**依据 2 · 源码核查**：[lib/index.js:2738-2763](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/index.js#L2738-L2763)

按独立代理和宿主端口实例化服务，加载网络与平台配置。

<details>
<summary>查看原文（26行）</summary>

```text
  const service = new BridgeService({
    mobileUiEnabled,
    // SSE 空闲保活（issue #71）：仅显式 false 关闭，缺省/其余取值均为开启
    sseKeepalive: config.sseKeepalive !== false,
    dshPort,
    proxyPort,
    home: config.home,
    customTunnelConfig: config.customTunnel ?? null,
    cloudflaredConfig: config.cloudflared ?? null,
    lanConfig: config.lan ?? null,
    authManager,
    onPersist: (patch) => updateConfig((stored) => Object.assign(stored, patch)),
    logger,
  });
  service.uiPageTweaks = uiPageTweaks;

  // 启动时读取已保存的局域网网卡配置与公网隧道配置并按需自动拉起
  loadConfig().then(async (stored) => {
    restorePersistedServiceState({ service, stored, logger, authEnabled: authManager.enabled });
  }).catch(() => {});

  // 平台管理器：注册/协调所有 IM 平台适配器
  const platformManager = new PlatformManager({ logger });

  // ---- 平台多账号装配（issue #78：同平台多实例，替代四段静态构造 + 逐平台恢复）----
  // 新增平台只需在 platformCtors / platformSpecs 各加一行。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3073-3083](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/index.js#L3073-L3083)

真实启动和卸载清理。

<details>
<summary>查看原文（11行）</summary>

```text
  // 代理随插件自动启动
  void service.startProxy().catch((err) => {
    logger.error('dsh-bridge: proxy start failed: %s', err?.message ?? err);
  });

  ctx.effect(() => async () => {
    try { disposeRpc(); } catch {}
    // platforms[type] 是 platformManager 中的同引用对象，Set 去重后统一收尾
    const instances = new Set([...platformManager.list(), ...Object.values(platforms).filter(Boolean)]);
    for (const platform of instances) {
      try {
```

</details>

**依据 4 · 源码核查**：[client/index.js:6757-6768](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/client/index.js#L6757-L6768)

设置页注册。

<details>
<summary>查看原文（12行）</summary>

```text
    if (!settingsVisible || sectionRegistration) return;
    try {
      sectionRegistration = ctx.slots.register(
        {
          name: 'settings.section',
          id: 'dsh-bridge',
          order: 10,
          label: () => localeT('远程访问'),
          inject: () => ({ rpcCall }),
        },
        BridgePanel,
      );
```

</details>

**依据 5 · 源码核查**：[lib/index.js:855-865](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/index.js#L855-L865)

转发到本机宿主。

<details>
<summary>查看原文（11行）</summary>

```text
      // 5. 认证通过：正常执行反向代理转发
      const { headers, cookie } = loopbackHeaders(req.headers, this.targetPort);
      if (!cookie) this._warnLoopbackCookieMissing();
      else this._noteLoopbackCookie(cookie);
      const proxyReq = httpRequest(
        { host: '127.0.0.1', port: this.targetPort, method: req.method, path: req.url, headers, agent: false },
        (proxyRes) => {
          if (proxyRes.statusCode === 401 && cookie) this._warnLoopbackCookieRejected(cookie);
          const contentType = String(proxyRes.headers['content-type'] ?? '');
          // 会话投影剥离（session/list / session/history）：这两个端点响应体可能达
          // 数十 MB（contextHeaders 投影无 UI 读取），剥离后显著降低公网传输体积。
```

</details>

#### 缺口

- 未核同一任务从手机切回本机的执行持续性。
  **影响**：仅能确认远程接线。
  **进一步探讨**：用测试宿主发起短任务，记录断连与重连前后的宿主状态。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 代理怎样认证外部请求，退出意味着什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

HTTP 普通请求与 WebSocket 握手都进入桥的认证。认证关闭会允许直通。启用后，环回、隧道识别和保护范围仍决定哪些请求绕过。受保护入口可用令牌或会话 cookie。WebSocket 另外校验已提供的 Origin，未知或 null 来源拒绝，缺少 Origin 则仍按前置认证结果。不能只观察登录页，必须从实际网络入口核未授权请求被拒。

允许转发后，代理重写 Host、Origin 和 Referer 至本机地址。它可用本机密钥签出同一载荷的两种宿主 cookie 名，兼容按地址含端口与忽略端口的两类命名。载荷仍绑定含端口的 authority，旧同名值先删除，避免遮挡新值。桥的登录状态和上游签名是两层，若本机密钥不可用或上游口径不兼容，代理能到达也可能被 401 拒绝。浏览器 logout 响应清 cookie，路径未调用服务端会话撤销。丢失设备需另核吊销或关闭入口。

#### 证据与依据

**依据 1 · 源码核查**：[lib/auth/manager.js:523-577](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/auth/manager.js#L523-L577)

认证开关、拓扑识别、范围和凭据判断。

<details>
<summary>查看原文（55行）</summary>

```text
  verifyRequest(req) {
    // 1. 未开启认证 -> 允许直通
    if (!this.enabled) {
      return { authenticated: true, bypass: true }
    }

    const remote = req.socket?.remoteAddress || ''
    const isLoopback = (remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1')

    // 辨别是否来自自建隧道或 Cloudflare 隧道 (只有从 127.0.0.1 传入且带有合法内部凭据/Cloudflare 标头才算)
    const internalTunnelHeader = req.headers?.['x-dsh-internal-tunnel']
    const isCustomTunnel = Boolean(isLoopback && internalTunnelHeader && internalTunnelHeader === this.internalTunnelSecret)
    const isCloudflare = Boolean(isLoopback && (req.headers?.['cf-ray'] || req.headers?.['cf-connecting-ip']))
    const isPublicTunnel = isCustomTunnel || isCloudflare

    // 2. 本地环回免认证（真正的宿主机物理浏览器 127.0.0.1 访问，非 Tunnel 转发）
    if (this.allowLoopback && isLoopback && !isPublicTunnel) {
      const host = String(req.headers?.host || '')
      if (host.startsWith('127.0.0.1') || host.startsWith('localhost') || host === '') {
        return { authenticated: true, loopback: true }
      }
    }

    // 3. 检查防护范围 (scope: 'all' | 'public_only' | 'lan_only')
    if (this.scope === 'public_only' && !isPublicTunnel) {
      return { authenticated: true, lanBypass: true }
    }

    if (this.scope === 'lan_only' && isPublicTunnel) {
      return { authenticated: true, publicBypass: true }
    }

    // 4. 从 Query 参数中解析 ?auth=token 或 ?token=token (用于扫码免密登录)
    if (this.mode !== 'password_only') {
      try {
        const urlObj = new URL(req.url, 'http://localhost')
        const queryToken = urlObj.searchParams.get('auth') || urlObj.searchParams.get('token')
        if (queryToken && this.validateSecretToken(queryToken)) {
          return { authenticated: true, fromToken: true, secretToken: queryToken }
        }
      } catch {}
    }

    // 5. 从 Cookie 中解析 Session Token: dsh_bridge_auth=<token>
    const cookieHeader = req.headers?.cookie || ''
    const match = /(?:^|;\s*)dsh_bridge_auth=([a-f0-9]+)/i.exec(cookieHeader)
    if (match) {
      const sessionToken = match[1]
      if (this.validateSession(sessionToken)) {
        return { authenticated: true, sessionToken }
      }
    }

    // 未授权
    return { authenticated: false }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:792-813](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/index.js#L792-L813)

HTTP 鉴权与 URL 令牌转换。

<details>
<summary>查看原文（22行）</summary>

```text
      // 4. 核心鉴权拦截
      // 豁免：authAdminUnlock（管理密码解锁）不要求访问会话——锁屏状态下访问会话可能已失效，
      // 但用户应能凭管理密码解锁（否则访问会话失效后锁屏永远解不开，死锁）
      const isAdminUnlockRpc = pathname === '/dsh-bridge/authAdminUnlock'
        || pathname.endsWith('/dsh-bridge/authAdminUnlock');
      const auth = isAdminUnlockRpc
        ? { authenticated: true }
        : (this.authManager?.verifyRequest(req) ?? { authenticated: true });

      // 4.1 若从 URL Token 认证通过：下发 Cookie 并 302 重定向到干净 URL (去掉 ?auth=)
      if (auth.fromToken) {
        const sessionToken = this.authManager.createSession();
        try {
          const urlObj = new URL(req.url, 'http://localhost');
          urlObj.searchParams.delete('auth');
          urlObj.searchParams.delete('token');
          const cleanPath = (urlObj.pathname || '/') + (urlObj.search || '');
          res.writeHead(302, {
            'Location': cleanPath,
            'Set-Cookie': `dsh_bridge_auth=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
          });
          res.end();
```

</details>

**依据 3 · 源码核查**：[lib/index.js:944-975](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/index.js#L944-L975)

WS 认证及 Origin 附加门禁。

<details>
<summary>查看原文（32行）</summary>

```text
    // WebSocket upgrade 鉴权与代理
    this.server.on('upgrade', (req, socket, head) => {
      const auth = this.authManager?.verifyRequest(req) ?? { authenticated: true };
      if (!auth.authenticated) {
        socket.write('HTTP/1.1 401 Unauthorized\r\nContent-Type: text/plain\r\n\r\nUnauthorized\r\n');
        socket.destroy();
        return;
      }

      // 纵深防御：浏览器发起的升级请求若带 Origin 且不在已知面板来源内，拒绝握手，
      // 防止恶意页面借用户浏览器已有的 Cookie 建立 WebSocket（CSWSH）。
      // 认证已在上方完成，此处只做额外收紧，不构成绕过认证的路径。
      // 关键兼容性约束：Origin 缺失一律放行——非浏览器客户端（IM 机器人、
      // ws 库、命令行工具、隧道转发）通常不发 Origin，若按缺失拒绝会直接
      // 打断现有用户的机器人通道。
      const origin = req.headers?.origin;
      if (origin) {
        let allowed;
        try {
          allowed = this.allowedOrigins?.() ?? [];
        } catch { allowed = []; }
        // opaque origin（字面量 "null"）永不放行：它无法归属到任何具体面板来源。
        if (origin === OPAQUE_ORIGIN || !allowed.includes(origin)) {
          // 直接内联 origin，避免依赖 logger 的 printf 插值（该 logger 在部分调用形态下不做替换）
          this.logger?.warn?.(`dsh-bridge: 拒绝来源不明的 WebSocket 升级请求 (Origin=${origin})`);
          socket.write('HTTP/1.1 403 Forbidden\r\nContent-Type: text/plain\r\n\r\nForbidden\r\n');
          socket.destroy();
          return;
        }
      }

      const { headers, cookie } = loopbackHeaders(req.headers, this.targetPort);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:248-285](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/index.js#L248-L285)

本机请求头及双名 cookie 替换。

<details>
<summary>查看原文（38行）</summary>

```text
function loopbackHeaders(headers, targetPort) {
  const authority = `127.0.0.1:${targetPort}`;
  const out = { ...headers };
  out['host'] = authority;
  if (out['origin']) out['origin'] = `http://${authority}`;
  if (out['Origin']) out['Origin'] = `http://${authority}`;

  // DSH 的来源校验同样会看 Referer：经隧道/局域网访问时它指向公网地址，不改写会被 403。
  // 只替换 origin 部分，保留路径与查询串；无法解析的 Referer 直接丢弃（它本身是可选头）。
  for (const key of ['referer', 'Referer']) {
    if (!out[key]) continue;
    try {
      const url = new URL(out[key]);
      out[key] = `http://${authority}${url.pathname}${url.search}`;
    } catch {
      delete out[key];
    }
  }

  // 1. 注入 DSH 本地认证签名（若有）
  //
  // 两个要点（issue #92）：
  //   ① 宿主读 cookie 是「同名取第一个」：浏览器里残留的同名旧 cookie 会遮住
  //      注入的新值 → 永远 401。所以先剔除**本次要注入的每个候选名**，再追加新值。
  //      注意只按这两个名字剔除，不能按 `dsh-auth-` 前缀全删——API 凭据 cookie
  //      共用该前缀，按前缀清会把 /connect 通道一起删掉。
  //   ② 同时注入「含端口」与「忽略端口」两个名字、共用同一载荷：官方宿主按
  //      `host:port` 名取值，被本地补丁改成忽略端口的宿主按 `host` 名取值。
  const dshCookies = getDshLoopbackCookies(targetPort);
  let cookie = null;
  if (dshCookies.length > 0) {
    const names = dshCookies.map((entry) => entry.slice(0, entry.indexOf('=')));
    let cleaned = out['cookie'] || out['Cookie'] || '';
    for (const name of names) cleaned = stripCookieByName(cleaned, name);
    const joined = dshCookies.join('; ');
    out['cookie'] = cleaned ? `${cleaned}; ${joined}` : joined;
    delete out['Cookie'];
    cookie = { names, authority };
```

</details>

**依据 5 · 源码核查**：[lib/auth/dsh-native-cookie.js:136-159](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/auth/dsh-native-cookie.js#L136-L159)

签名载荷和 cookie 名分离。

<details>
<summary>查看原文（24行）</summary>

```text
export function buildDshLoopbackCookies({
  targetPort,
  secret,
  host = '127.0.0.1',
  now = Date.now(),
  maxAgeMs = DSH_AUTH_COOKIE_INJECTION_MAX_AGE_MS,
}) {
  if (!secret || !targetPort) return [];

  const authority = `${host}:${targetPort}`;
  // 与 DSH 一致：issuedAt 略微回拨，避免与宿主的同秒比较产生边界问题
  const issuedAt = now - 1000;
  const expiresAt = issuedAt + maxAgeMs;

  const body = base64Url(Buffer.from(JSON.stringify({
    version: DSH_AUTH_COOKIE_VERSION,
    authority,
    issuedAt,
    expiresAt,
  }), 'utf8'));
  const key = Buffer.from(secret, 'base64url');
  const sig = base64Url(createHmac('sha256', key).update(body).digest());
  const value = `v${DSH_AUTH_COOKIE_VERSION}.${body}.${sig}`;
  return dshAuthCookieNames(targetPort, host).map((name) => `${name}=${value}`);
```

</details>

**依据 6 · 源码核查**：[lib/index.js:710-717](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/index.js#L710-L717)

登出清理浏览器 cookie。

```text
      // 2. 处理登出 API: POST /__dsh_bridge__/logout
      if (pathname === '/__dsh_bridge__/logout' && req.method === 'POST') {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Set-Cookie': 'dsh_bridge_auth=; Path=/; HttpOnly; Max-Age=0',
        });
        res.end(JSON.stringify({ ok: true }));
        return;
```

#### 缺口

- 实际隧道转发头和回环识别未经部署验证。
  **影响**：无法判断实际公网拓扑中的全部未授权请求。
  **进一步探讨**：分别用无凭据、撤销凭据及不明 Origin 测试实际入口的 HTTP/WS。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · IM 的审批如何找到正确发起者和会话？

**研究主题**：功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

共享桥先暂存入站发送者和回发对象，直到实际起轮才按 Agent 的真实 session.id 绑定。这样 /new 改会话时使用新归属。审批请求只有匹配绑定并确认由本桥拥有 Agent 才拦截，其余交给宿主界面。待决审批绑定请求及发起人，外部发送者不符时拒绝，内部 null 参数有信任例外。超时拒绝，宿主中止时同步取消。增量在于手机可处理真实 DSH 宿主请求，同时保留本机审批的归属。该绑定依赖各平台适配器把真实 sender 传入共用桥，不能由共用代码证明所有通道都正确。

/model 从宿主目录生成并缓存编号，校验用户选择后把覆盖存到平台配置，已有活动会话仍使用原模型。应在新会话或重新接入后核实际模型。IM 短指令与会话批准是两种操作，列表可见或回发确认均不等于工具执行已完成。

#### 证据与依据

**依据 1 · 源码核查**：[lib/platform/conversation-bridge.js:782-792](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/platform/conversation-bridge.js#L782-L792)

入站暂存来源。

<details>
<summary>查看原文（11行）</summary>

```text
      this.peerId = sender

      // 本轮发起者（T2.3）：outboundPeer 由平台节点传入其"会话级发送目标"（QQ 群 /
      // Telegram chat 等），未传则不绑定（出站回退 this.peerId）。
      //
      // 这里只**暂存**、不写 _turnPeers：消息可能被 /new 等命令换掉 activeSessionId，
      // 也可能根本不产生轮次（/help 之类）。轮次绑定必须在真正 followup/steer 时按宿主
      // 的真实会话 id 写入（issue #93），否则新会话的审批会全部落到宿主 GUI。
      this._inboundTurnBinding = outboundPeer ? { outboundPeer, senderId: sender, senderLabel } : null

      if (await routeCommand(this, fullText, sender)) return 'routed'
```

</details>

**依据 2 · 源码核查**：[lib/platform/conversation-bridge.js:885-901](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/platform/conversation-bridge.js#L885-L901)

实际起轮时绑定真实会话。

<details>
<summary>查看原文（17行）</summary>

```text
      // 真正起轮次的这一刻才写入绑定，且 key 用**宿主 agent 的真实 session.id**：
      // activeSessionId 可能已被 /new 换掉、或与 agent 实际归属不一致（issue #93）。
      const turnSessionId = agent.session?.id ?? this.activeSessionId
      if (this._inboundTurnBinding && turnSessionId) {
        this._turnPeers.set(turnSessionId, this._inboundTurnBinding)
      }

      const messageValue = createUserMessage({
        content: [{ type: 'text', text: promptWithContext }],
        source: { kind: 'user' },
      })
      const useSteer = this.config.steerMode === true
      if (useSteer && typeof agent.steer === 'function') {
        agent.steer(messageValue)
      } else {
        agent.followup(messageValue)
      }
```

</details>

**依据 3 · 源码核查**：[lib/platform/conversation-bridge.js:1416-1435](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/platform/conversation-bridge.js#L1416-L1435)

审批归属及宿主兜底。

<details>
<summary>查看原文（20行）</summary>

```text
  _attachApprovalBridge() {
    const listener = async (req, next) => {
      // 只有"本轮由本桥发起"（_turnPeers 有该会话的轮次记录）时才拦截审批。
      // 仅凭 activeSessionId 匹配是不够的：重启恢复/默认挑选后它可能指向一个
      // Web 端发起的会话——那会让 Web 轮次的审批被劫持发去 IM（GUI 不弹窗、
      // 无人响应即自动拒绝）。Web 轮次必须直接放行给宿主 GUI 处理。
      const sessionId = req.agent?.session?.id
      const turn = sessionId ? this._turnPeers.get(sessionId) : null
      if (!turn || !this.ownsAgent(req.agent)) {
        // info 级别：这是用户可自诊的关键判定点（IM 没收到卡片时先看这行）
        this.logger?.info?.('[dsh-bridge %s] approval falls through to GUI: not an IM-initiated turn (session=%s, activeSession=%s, turnTracked=%s)', this.platform?.id, sessionId ?? '(none)', this.activeSessionId ?? '(none)', Boolean(turn))
        return next?.()
      }
      const peer = turn.outboundPeer?.peerId
      const initiator = turn.senderId
      if (!peer) {
        this.logger?.debug?.('[dsh-bridge %s] approval/request ignored: no active peer', this.platform?.id)
        return next?.()
      }
      const sendOpts = turn ? { outboundPeer: turn.outboundPeer } : {}
```

</details>

**依据 4 · 源码核查**：[lib/platform/conversation-bridge.js:1471-1498](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/platform/conversation-bridge.js#L1471-L1498)

超时及中止、发起者绑定。

<details>
<summary>查看原文（28行）</summary>

```text
        if (settled) return
        settled = true
        this.clearApproval(number)
        resolveIm(outcome)
      }

      const timer = setTimeout(() => {
        timeoutFired = true
        settleIm('rejected')
      }, timeoutSec * 1000)
      if (typeof timer.unref === 'function') timer.unref()

      // turn 被停止/工具调用中止时 DSH 会 abort req.signal：同步取消 IM 侧待决审批
      const onSignalAbort = () => {
        timeoutFired = true
        settleIm('cancelled')
      }
      req.signal?.addEventListener('abort', onSignalAbort, { once: true })

      this.registerApproval(number, { number, request: req, resolve: resolveIm, timer, peerId: initiator })

      let outcome
      try {
        outcome = await imPromise
      } finally {
        req.signal?.removeEventListener('abort', onSignalAbort)
        clearTimeout(timer)
        settled = true
```

</details>

**依据 5 · 源码核查**：[lib/platform/conversation-bridge.js:548-555](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/platform/conversation-bridge.js#L548-L555)

外部发送者检查和内部例外。

```text
  // 防止群聊/多用户场景下其他成员代批工具执行。senderId 为 null 时放行（内部路径）。
  _approvalAllowed(entry, senderId) {
    if (senderId == null) return true
    if (entry.peerId && entry.peerId !== senderId) {
      this.logger?.warn?.(`[dsh-bridge ${this.platform?.id}] approval #${entry.number} blocked: sender ${senderId} is not the initiator ${entry.peerId}`)
      return false
    }
    return true
```

**依据 6 · 源码核查**：[lib/platform/conversation-bridge.js:421-427](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/platform/conversation-bridge.js#L421-L427)

宿主模型目录缓存。

```text
  /** 取目录（带 TTL 缓存：编号是展示顺序，必须稳定） */
  async _modelCatalogCached() {
    const cached = this._modelCatalog
    if (cached && Date.now() - cached.at < MODEL_CATALOG_TTL_MS) return cached.catalog
    const catalog = await collectModelCatalog(this.ctx)
    this._modelCatalog = { at: Date.now(), catalog }
    return catalog
```

**依据 7 · 源码核查**：[lib/platform/conversation-bridge.js:446-477](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/platform/conversation-bridge.js#L446-L477)

选择后等待新建或重新接入生效。

<details>
<summary>查看原文（32行）</summary>

```text
  async handleModelCommand(text) {
    const args = String(text ?? '').trim()

    if (!args) {
      const catalog = await this._modelCatalogCached()
      await this.sendText(formatModelCatalog(catalog, { current: this._currentModelSelection() }))
      return
    }

    if (/^(?:reset|default)$/i.test(args) || args === '默认') {
      await this._applyModelSelection({ provider: '', model: '' })
      await this.sendText('✓ **已恢复 DSH 默认模型**（清除本平台的模型覆盖）。\n\n> 对该平台新建（`/new`）或重新接入（`/use`）的会话生效。')
      return
    }

    const catalog = await this._modelCatalogCached()
    const resolved = resolveModelSelection(catalog, args)
    if (!resolved || resolved.error) {
      if (resolved?.error === 'out-of-range') {
        await this.sendText(`❌ **无效编号**：\`${args}\`\n\n> 发送 \`/model\` 查看可用编号。`)
      } else {
        await this.sendText(`❌ **无法识别的模型**：\`${args}\`\n\n> 用法：\`/model <编号>\` 或 \`/model <provider>/<model>\`。`)
      }
      return
    }

    await this._applyModelSelection(resolved)
    const label = `${resolved.provider}/${resolved.model}`
    const note = this.activeAgent()
      ? '当前会话仍使用原模型；对该平台发送 `/new` 新建会话（或用 `/use` 重新接入）后生效。'
      : '对该平台新建会话生效。'
    await this.sendText(`✓ **已选择模型**：\`${label}\`\n\n> ${note}`)
```

</details>

#### 缺口

- 未验真实群聊发送者、回调身份、重放及与 GUI 并发。
  **影响**：不能将 IM 审批用于无人监督的敏感变更。
  **进一步探讨**：在测试平台交叉验证真实发起人、其他群成员、超时与同一会话的 GUI 请求。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 版本差异如何影响会话、移动界面和隧道运维？

**研究主题**：工程质量与复用、依赖、兼容与流程、效果与总成本

#### 完整回答

会话元数据读新旧两代投影缓存。对同一 ID 同时有记录时选文件修改时间较新的版本，无法读取新记录时可沿用旧文件。会话列表也尝试读取 current 下的目标标题。这能处理升级后的显示差异，不能证明底层会话已无损恢复。移动抽屉先读宿主真实状态，只有与期望不一致才点击宿主开关，短期内相同意图去重。旧宿主没有该状态时保留兼容路径。实际手机触控和宿主新版右侧面板仍需验。

插件管理的 cloudflared 默认固定 2026.10.7，并根据维护者记录的发布日期计算 12 个月提示。诊断返回实际二进制版本与来源，自备或覆盖版本没有该截止值。支持提示需要和实际网络、运营方式一同检查。macOS 看板通过系统 vm_stat 做短缓存，失败返回粗略来源。指标改善只反映监控口径变化，不能说明宿主资源实际减少。

#### 证据与依据

**依据 1 · 源码核查**：[lib/platform/dsh-storage.js:127-143](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/platform/dsh-storage.js#L127-L143)

缓存比较以及两代布局。

<details>
<summary>查看原文（17行）</summary>

```text
function pickProjRecord(perRecord, legacyRecord, legacyMtimeMs) {
  if (perRecord && legacyRecord !== undefined) {
    return perRecord.mtimeMs >= legacyMtimeMs ? perRecord.record : legacyRecord
  }
  if (perRecord) return perRecord.record
  return legacyRecord
}

/**
 * 读取 DSH 官方持久化会话缓存元数据（标题、是否空白、创建时间等）。
 *
 * DSH 0.1.7 起 `session_projcache` 领域改为 **per-record 布局**：
 *   `<DSH_HOME>/storages/session_projcache/sessions/<sessionId>.json`（每条会话一个文件，
 *   顶层 `{ version, record: { identity, rows } }`）。
 * 0.1.6 及更早则是单文件 `<DSH_HOME>/storages/session_projcache.json`
 * （`{ tables: { sessions: { <id>: { identity, rows } } } }`）。
 * 见 @deepseek-ai/dsh-session-projection-cache 的 projectionCacheDomainSpec
```

</details>

**依据 2 · 源码核查**：[lib/platform/dsh-storage.js:169-179](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/platform/dsh-storage.js#L169-L179)

逐会话查找和回退。

<details>
<summary>查看原文（11行）</summary>

```text
  const hasRecordDirs = recordDirs.some((dir) => existsSync(dir))
  const cache = new Map()
  const lookup = (id) => {
    if (cache.has(id)) return cache.get(id)
    const perRecord = hasRecordDirs ? findProjRecord(id, recordDirs) : undefined
    const legacyRecord = legacy.sessions && Object.prototype.hasOwnProperty.call(legacy.sessions, id)
      ? legacy.sessions[id]
      : undefined
    const chosen = pickProjRecord(perRecord, legacyRecord, legacy.mtimeMs)
    cache.set(id, chosen)
    return chosen
```

</details>

**依据 3 · 源码核查**：[lib/platform/session-catalog.js:89-105](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/platform/session-catalog.js#L89-L105)

识别 goal current 标题。

<details>
<summary>查看原文（17行）</summary>

```text
export function formatGoalTitle(raw) {
  if (typeof raw === 'string' && raw) return raw
  if (raw && typeof raw === 'object') {
    const obj = raw.objective ?? raw.goal?.objective ?? raw.title
    if (typeof obj === 'string' && obj) return obj
    // DSH 0.1.7+ per-record 布局里 goal 存的是 fold 后的投影状态，不是裸 goal：
    //   { current: { goal: { objective, ... }, roundsStarted, createdAt, updatedAt } | null,
    //     seenGoalIds, failure }
    // 只认 objective/title 会让这类会话标题退化为「新会话」。兼容 current 直接挂在
    // 记录上（rows.goal.val）和被包一层（raw.goal.current）两种取值路径。
    const current = raw.current ?? raw.goal?.current
    const currentObjective = current?.goal?.objective
    if (typeof currentObjective === 'string' && currentObjective) return currentObjective
  }
  return ''
}

```

</details>

**依据 4 · 源码核查**：[client/index.js:5010-5030](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/client/index.js#L5010-L5030)

抽屉状态读回、旧宿主及重复操作门禁。

<details>
<summary>查看原文（21行）</summary>

```text
function setMobileDrawerOpen(open) {
  if (typeof document === 'undefined' || !document.body) return;
  const body = document.body;
  if (open) body.classList.add(MOBILE_DRAWER_CLASS);
  else body.classList.remove(MOBILE_DRAWER_CLASS);
  const hostOpen = readHostMobileDrawerOpen();
  if (hostOpen === null) {
    // 旧宿主：保持历史行为——只在打开时点宿主的展开按钮（宿主没有抽屉可收）。
    if (open) clickHostSidebarToggle();
    return;
  }
  if (hostOpen === open) return;
  // 同一次交互里可能被连续调用两次「关闭」（例如抽屉内点新建会话：捕获阶段先关一次，
  // 宿主 startSession 又触发 sessions 订阅再关一次）。若宿主异步提交抽屉状态，
  // 第二次读到的仍是旧值 → 会再点一次 toggle，把刚收起的抽屉又切回打开。
  // 因此对「同一意图、极短时间内的重复请求」只执行一次宿主同步。
  const now = Date.now();
  if (lastHostSyncOpen === open && now - lastHostSyncAt < HOST_DRAWER_SYNC_GUARD_MS) return;
  lastHostSyncAt = now;
  lastHostSyncOpen = open;
  clickHostSidebarToggle();
```

</details>

**依据 5 · 源码核查**：[lib/cloudflared-manager.mjs:38-45](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/cloudflared-manager.mjs#L38-L45)

作者固定的二进制及记录日期。

```text
// tag_name / published_at（已核对 2026.10.7 = 2026-10-30 发布）。
// test/cloudflared-version-window.test.mjs 会校验两者格式一致且不超窗口。
const CLOUDFLARED_VERSION = '2026.10.7';
const CLOUDFLARED_RELEASED_AT = '2026-10-30'; // 上游 tag 发布时间（UTC 日期）
const CLOUDFLARED_SUPPORT_WINDOW_MONTHS = 12; // 官方承诺的支持窗口
// 逃生口：允许运维显式钉到别的版本（企业内网镜像/灰度回滚），格式不合法则忽略。
// 刻意做成环境变量而不是配置项——它不该出现在普通用户的面板里被随手改动。
const CLOUDFLARED_VERSION_ENV = 'DSH_BRIDGE_CLOUDFLARED_VERSION';
```

**依据 6 · 源码核查**：[lib/cloudflared-manager.mjs:1097-1109](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/cloudflared-manager.mjs#L1097-L1109)

运行版本、来源和适用的支持提示。

<details>
<summary>查看原文（13行）</summary>

```text
  getBinaryInfo() {
    const managed = this.binarySource === 'managed';
    const usingPin = this.binaryVersion === CLOUDFLARED_VERSION;
    const support = managed && usingPin
      ? checkVersionSupport()
      : { outdated: false, supportedUntil: null };
    return {
      path: this.binaryPath,
      version: this.binaryVersionActual,
      source: this.binarySource,
      outdated: support.outdated,
      supportedUntil: support.supportedUntil,
    };
```

</details>

**依据 7 · 源码核查**：[lib/platform/system-metrics.js:149-175](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/platform/system-metrics.js#L149-L175)

macOS 指标缓存和采集失败回退。

<details>
<summary>查看原文（27行）</summary>

```text
  const free = Number.isFinite(freeBytes) ? freeBytes : freemem()

  // 非 macOS：沿用原口径，零成本、零子进程
  if (platformName !== 'darwin') {
    return buildMemory({ totalBytes: total, freeBytes: free, usedBytes: total - free, source: 'os' })
  }

  const cached = cache && Number.isFinite(cache.usedBytes) && now - cache.at < cacheTtlMs
    ? cache.usedBytes
    : null
  if (cached !== null) {
    return buildMemory({ totalBytes: total, freeBytes: total - cached, usedBytes: cached, source: 'vm_stat' })
  }

  const text = execVmStat(execImpl)
  const used = text === null ? null : darwinUsedBytesFromVmStat(parseVmStat(text), total)
  if (used === null) {
    // 取数失败：回退旧口径（可能是 99%，但至少看板可用），并如实标注来源
    return buildMemory({ totalBytes: total, freeBytes: free, usedBytes: total - free, source: 'os-fallback' })
  }

  if (cache) {
    cache.at = now
    cache.usedBytes = used
  }
  // freeBytes 由 used 反推，保证「已用 + 空闲 = 总量」在看板上自洽
  return buildMemory({ totalBytes: total, freeBytes: total - used, usedBytes: used, source: 'vm_stat' })
```

</details>

**依据 8 · 作者声明**：[CHANGELOG.md:35-44](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/CHANGELOG.md#L35-L44)

作者指出真机及未覆盖范围。

<details>
<summary>查看原文（10行）</summary>

```text
  - **尚未覆盖**：报障描述里「+ 与 X 像素重合」在代码与视口计算中都不成立，无法定位到具体控件；本次只消除了同一片区域「两个控件同时可命中」的状态缺陷，像素级重合需真机/截图确认。0.2.2 右侧栏（`[data-sidebar-right-*]`）的收起逻辑也未覆盖，属后续项。

### ✅ 验证

- 新增回归：cloudflared 支持窗口与资产映射（`test/cloudflared-version-window.test.mjs`）、macOS 内存口径（`test/system-metrics.test.mjs`）、projcache 两代布局按新鲜度择一与 goal `current` 形态（`test/session-projcache-layout.test.mjs`）、设置导航图标插槽接管与 CSS 兜底互斥（`test/settings-nav-icon.test.mjs`）、移动端抽屉双状态同步（`test/mobile-drawer-state-sync.test.mjs`）。
- 全量单元测试：`node --test --test-force-exit test/*.test.mjs` → 940 项、935 通过、3 跳过、2 失败；两个失败均与本次改动无关，且在干净 HEAD 上同样失败：
  - `test/cloudflared-health-probe.test.mjs`「迟到就绪回归…」：既有断言与既有实现不一致（句柄/时序问题，改动未触及握手与重试计数）；
  - `test/qq-service.test.mjs`「DNS 解析后二次校验…」：本机 DNS 把 `127.0.0.1.nip.io` 解析到 `198.18.0.63`（DNS 拦截/VPN 环境），与代码无关。
- eslint 0 error（仓库既有 48 条 warning 全部来自未改动文件）；`npm run build:client` 幂等（重建前后 `client/client.js` SHA-256 一致）。
- **仍需真机/真实 GUI 验收**（本机无法替代）：macOS 上与「活动监视器」对照一次内存口径；`npm run verify:mobile-ui` 跑移动端抽屉套件；DSH 0.2.2 设置页确认「远程访问」只有一个图标。
```

</details>

#### 缺口

- 同版本的移动触控、隧道可用性及实际兼容组合未独立检查。
  **影响**：不宜将版本或指标提示视为连续服务保证。
  **进一步探讨**：在同一测试宿主核两代缓存、手机抽屉与实际运行二进制。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么结果足以决定是否扩大远程使用？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

目前建议观察。离开电脑后要查看本机 DSH 任务的用户，可先在非敏感测试宿主只核受保护入口。比人工返回电脑，它能把移动网页和 IM 接入同一任务，并按轮次路由批准。使用成本包括常驻主机、网络、平台账号、凭据轮换和对操作结果的人工复核。网络错误未必意味着任务没执行。入口漏验、审批发错人或旧会话仍可用时，关闭隧道和平台入口并回本机核对。现有证据未覆盖真实跨网运行和持续成本。

可检验的设计是把实际入口、认证决策、会话归属、批准结果和吊销回读组为一次测试记录。对比逐条人工查看日志的核对时间、误批准、退出后仍能访问的比例和恢复耗时。若未能更早找到漏验或给正常排障增加负担，则保留手工核验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/auth/manager.js:529-553](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/auth/manager.js#L529-L553)

拓扑与防护范围需要按实际入口核。

<details>
<summary>查看原文（25行）</summary>

```text
    const remote = req.socket?.remoteAddress || ''
    const isLoopback = (remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1')

    // 辨别是否来自自建隧道或 Cloudflare 隧道 (只有从 127.0.0.1 传入且带有合法内部凭据/Cloudflare 标头才算)
    const internalTunnelHeader = req.headers?.['x-dsh-internal-tunnel']
    const isCustomTunnel = Boolean(isLoopback && internalTunnelHeader && internalTunnelHeader === this.internalTunnelSecret)
    const isCloudflare = Boolean(isLoopback && (req.headers?.['cf-ray'] || req.headers?.['cf-connecting-ip']))
    const isPublicTunnel = isCustomTunnel || isCloudflare

    // 2. 本地环回免认证（真正的宿主机物理浏览器 127.0.0.1 访问，非 Tunnel 转发）
    if (this.allowLoopback && isLoopback && !isPublicTunnel) {
      const host = String(req.headers?.host || '')
      if (host.startsWith('127.0.0.1') || host.startsWith('localhost') || host === '') {
        return { authenticated: true, loopback: true }
      }
    }

    // 3. 检查防护范围 (scope: 'all' | 'public_only' | 'lan_only')
    if (this.scope === 'public_only' && !isPublicTunnel) {
      return { authenticated: true, lanBypass: true }
    }

    if (this.scope === 'lan_only' && isPublicTunnel) {
      return { authenticated: true, publicBypass: true }
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:710-717](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/index.js#L710-L717)

本地退出和服务端吊销需区分。

```text
      // 2. 处理登出 API: POST /__dsh_bridge__/logout
      if (pathname === '/__dsh_bridge__/logout' && req.method === 'POST') {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Set-Cookie': 'dsh_bridge_auth=; Path=/; HttpOnly; Max-Age=0',
        });
        res.end(JSON.stringify({ ok: true }));
        return;
```

**依据 3 · 源码核查**：[lib/platform/conversation-bridge.js:1422-1435](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/lib/platform/conversation-bridge.js#L1422-L1435)

审批归属与本机路径并存。

<details>
<summary>查看原文（14行）</summary>

```text
      const sessionId = req.agent?.session?.id
      const turn = sessionId ? this._turnPeers.get(sessionId) : null
      if (!turn || !this.ownsAgent(req.agent)) {
        // info 级别：这是用户可自诊的关键判定点（IM 没收到卡片时先看这行）
        this.logger?.info?.('[dsh-bridge %s] approval falls through to GUI: not an IM-initiated turn (session=%s, activeSession=%s, turnTracked=%s)', this.platform?.id, sessionId ?? '(none)', this.activeSessionId ?? '(none)', Boolean(turn))
        return next?.()
      }
      const peer = turn.outboundPeer?.peerId
      const initiator = turn.senderId
      if (!peer) {
        this.logger?.debug?.('[dsh-bridge %s] approval/request ignored: no active peer', this.platform?.id)
        return next?.()
      }
      const sendOpts = turn ? { outboundPeer: turn.outboundPeer } : {}
```

</details>

**依据 4 · 作者声明**：[CHANGELOG.md:37-44](https://github.com/wenbin-wb/dsh-bridge/blob/9c529f526b6fce4eb7a2ceb85ebb0b749f44f928/CHANGELOG.md#L37-L44)

作者验证有失败与真机缺口。

```text
### ✅ 验证

- 新增回归：cloudflared 支持窗口与资产映射（`test/cloudflared-version-window.test.mjs`）、macOS 内存口径（`test/system-metrics.test.mjs`）、projcache 两代布局按新鲜度择一与 goal `current` 形态（`test/session-projcache-layout.test.mjs`）、设置导航图标插槽接管与 CSS 兜底互斥（`test/settings-nav-icon.test.mjs`）、移动端抽屉双状态同步（`test/mobile-drawer-state-sync.test.mjs`）。
- 全量单元测试：`node --test --test-force-exit test/*.test.mjs` → 940 项、935 通过、3 跳过、2 失败；两个失败均与本次改动无关，且在干净 HEAD 上同样失败：
  - `test/cloudflared-health-probe.test.mjs`「迟到就绪回归…」：既有断言与既有实现不一致（句柄/时序问题，改动未触及握手与重试计数）；
  - `test/qq-service.test.mjs`「DNS 解析后二次校验…」：本机 DNS 把 `127.0.0.1.nip.io` 解析到 `198.18.0.63`（DNS 拦截/VPN 环境），与代码无关。
- eslint 0 error（仓库既有 48 条 warning 全部来自未改动文件）；`npm run build:client` 幂等（重建前后 `client/client.js` SHA-256 一致）。
- **仍需真机/真实 GUI 验收**（本机无法替代）：macOS 上与「活动监视器」对照一次内存口径；`npm run verify:mobile-ui` 跑移动端抽屉套件；DSH 0.2.2 设置页确认「远程访问」只有一个图标。
```

#### 缺口

- 没有真实跨网任务、撤销或群聊误批准统计。
  **影响**：不能判断是否适合长期公网采用。
  **进一步探讨**：对照实际网络入口逐个核拒绝、恢复及会话失效，再单独核 IM 真实发送者。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
