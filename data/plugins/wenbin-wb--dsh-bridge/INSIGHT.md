# dsh-bridge

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a03854a](https://github.com/wenbin-wb/dsh-bridge/tree/a03854a257438b42c3aa6955f754b4aaee5e6eb7)

<!-- BEGIN META -->
[![GitHub ★ 235](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=235&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wenbin-wb/dsh-bridge) [![npm 30d 12,177](https://img.shields.io/static/v1?label=npm+30d&message=12%2C177&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wenbin_wb/dsh-bridge) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wenbin_wb/dsh-bridge)
<!-- END META -->

> **功能**：为本地 DSH 提供手机网页、隧道和多平台机器人远程访问与会话交互。

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 支持把手机入口和宿主会话/审批整合，审批按本桥轮次与发起sender绑定；不把网络可达性等同任务可靠性。

> **主要限制**：[Q02](#research-q02) 核实代理注入本地身份，认证默认/范围与未配密码状态会改变边界，logout仅清cookie不独立吊销session；公网和共享IM未实际验收，不应当已验证门禁。

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
  - [Q01 · 谁需要远程继续任务，相对隧道包装增加什么？](#detail-section-11)
  - [Q02 · 网页/WS与认证如何接线，可信绕过怎样判？](#detail-section-12)
  - [Q03 · 消息、审批与会话恢复属于什么范围？](#detail-section-13)
  - [Q04 · 接入与全周期成本/退出是什么？](#detail-section-14)
  - [Q05 · 是否值得试，哪项假设可证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：离开电脑后仍需继续本地DSH任务的操作者，可通过网页或IM接回宿主；当前研究限固定源码和共享桥关键路径。

SSH/反向代理/手工平台桥是直接替代；二维码和隧道能力归依赖，插件增量在宿主身份、会话与审批接合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| HTTP/WS代理 | 手机入口接回本机DSH | 特权身份适配，先核门禁 |
| 访问认证 | token、口令与登录session | 默认/范围/未配密码决定实际边界 |
| 原生cookie适配 | 让本机宿主接受代理请求 | 依赖原生凭据格式，不是独立租户隔离 |
| IM审批 | 本桥轮次中转发并决议操作 | sender链须完整，超时拒绝 |
| 会话重接 | 按持久头resume或create | 不等业务幂等/副作用撤销 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配Node/DSH与持续运行宿主 | 必需 | 代理与Agent执行 | 手机可达不等任务可继续 |
| 明确认证模式/scope/口令或令牌 | 外部入口必需 | 防止任意入口借本机身份 | enabled或登录页单独不够 |
| LAN或公网隧道 | 对应入口必需 | 到独立代理端口 | 拓扑须匹配隧道识别规则 |
| 平台账号/SDK与sender绑定 | IM任务必需 | 消息和审批 | 本轮未验四平台全部链路 |
| 原生凭据与本机权限 | 原生认证适配条件 | 构造DSH cookie | 认证版本变化可能使接合失效 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户在测试宿主固定入口/认证/范围 | 核口令与未认证拒绝，不先公开 |
| 接入 | Bridge校验后代理HTTP/WS或IM会话 | 指向预期宿主与会话 |
| 审批 | IM只接本桥发起轮次，核sender | 超时拒绝，中止取消 |
| 异常 | 用户本机查任务与审批真实状态 | 不把断线当任务停止后重试 |
| 退出 | 用户停隧道/代理/机器人并吊销凭据 | 核入口不再可达，登出不等吊销 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、网络与可能隧道/平台资源 | 配认证、scope、账号与会话 | 无金额与接入时长 |
| 持续使用 | 宿主常驻、传输、模型/平台服务 | 轮换凭据和维护SDK/版本 | 带宽/服务费及排障量未知 |
| 失败恢复 | 诊断与可能重复任务资源 | 查本机实际结果、审批与令牌 | 网络失败不保证业务没执行 |
| 退出 | 配置/会话留存 | 停各入口并核吊销 | 浏览器清cookie不等服务端撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 网页远程接合 | HTTP/WS认证后本机代理 | 真实跨网可靠性与宿主版本兼容 |
| 门禁策略 | token/密码/session与scope分支 | 实际拓扑未授权拒绝 |
| IM审批归属 | 本桥轮次、sender、超时/中止 | 各平台完整身份传递与重放 |
| 会话恢复 | 宿主持久记录决定resume/create | 断线/重启无损和远端副作用 |

> **思考**：[Q02](#research-q02) 核实代理注入本地身份，认证默认/范围与未配密码状态会改变边界，logout仅清cookie不独立吊销session；公网和共享IM未实际验收，不应当已验证门禁。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q03](#research-q03) 支持把手机入口和宿主会话/审批整合，审批按本桥轮次与发起sender绑定；不把网络可达性等同任务可靠性。

[Q02](#research-q02) HTTP/WS共用请求认证、WS来源额外收紧；[Q03](#research-q03) 以本桥轮次归属避免抢网页审批，设计可借鉴，但必须保持实际入口和sender身份不可丢。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 核实代理注入本地身份，认证默认/范围与未配密码状态会改变边界，logout仅清cookie不独立吊销session；公网和共享IM未实际验收，不应当已验证门禁。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 观察公网和共享IM采用，先在测试宿主核实际拒绝、审批归属及吊销，条件不明则停隧道回本机DSH。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持远程接合机制与明确配置边界；采用建议观察，不运行目标、真实隧道或账号，不宣称发现可直接利用的公网漏洞。本轮来源身份/默认分支未核，不声称最新。收据是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/auth/manager.js、lib/auth/dsh-native-cookie.js、lib/platform/conversation-bridge.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核代理/认证/原生cookie、共享IM审批与会话恢复；未审全云隧道协议、四平台SDK、所有管理RPC或实际部署。没有运行目标、读真实凭据或建立外部连接；固定版本不等最新。
- 下一步：隔离宿主核各拓扑未认证拒绝、密码初始化、复制测试session的登出/轮换结果，以及IM不同sender/重启/超时后的宿主审批和实际任务。

**分析版本**

- **仓库**：[wenbin-wb/dsh-bridge](https://github.com/wenbin-wb/dsh-bridge)
- **版本号**：2.17.5（[固定提交 a03854a](https://github.com/wenbin-wb/dsh-bridge/tree/a03854a257438b42c3aa6955f754b4aaee5e6eb7)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提议把实际入口拒绝、有效策略与会话吊销回读组成收据，先排现有等价诊断；若判断准确性不升或维护负担过高，就否定这个方向。

隔离宿主核各拓扑未认证拒绝、密码初始化、复制测试session的登出/轮换结果，以及IM不同sender/重启/超时后的宿主审批和实际任务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 30 | 6812 | — | — | 97439 |
| .mjs | source | 13 | 143746 | 108646 | 35041 | — |
| .js | source | 58 | 37723 | 29937 | 5839 | — |
| .ts | example | 6 | 276 | 178 | 64 | — |
| .md | example | 1 | 68 | — | — | 382 |
| .mjs | test | 83 | 24088 | 19297 | 2796 | — |
| .mjs | example | 1 | 134 | 94 | 34 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/wenbin-wb/dsh-bridge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=19&color=737b86&logo=github)](https://github.com/wenbin-wb/dsh-bridge/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 39](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=39&color=737b86&logo=github)](https://github.com/wenbin-wb/dsh-bridge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查特权远程入口如何接回DSH及认证、审批和恢复范围，避免把可达当安全。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要远程继续任务，相对隧道包装增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生DSH远程访问插件，面向离开电脑后仍需查看/继续本地Agent任务、审批和切工作区的操作者。合格结果是远程入口连接到预期宿主和会话、仅授权设备能操作、审批回到正确任务，断线后用户能区分消息没到和任务仍在执行。手机看到页面或二维码不是合格结果。

相对手工开放DSH端口或单独配置反向代理，插件同时提供代理、登录会话、原生认证适配与共享IM会话桥。HTTP和WebSocket会先做Bridge请求认证，再把请求接入127.0.0.1的DSH；IM审批只接管本桥发起轮次。这是远程入口到宿主生命周期的集成，而不是第二个Agent运行时。隧道传输、二维码和平台SDK属于依赖能力，不能据功能数量声称全球首创。对只需可信局域网网页的用户，简单SSH/反向代理可能已经足够；对不愿承担公网入口凭据管理的人，远程继续不一定值得。没有真实跨网任务、断线恢复或节时数据，本轮仅判断机制。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:2-5](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/package.json#L2-L5)

作者包描述定位远程访问/控制。

```text
  "name": "@wenbin_wb/dsh-bridge",
  "version": "2.17.5",
  "description": "DSH 远程连接/远程控制插件（remote control）：手机扫码即可在移动端/公网继续用 DeepSeek Harness，人不在电脑前也能接着干。一键局域网二维码、Cloudflare 公网隧道、自建隧道与微信 / QQ / 飞书 / Telegram Bot（多工作区/会话持久化/媒体/卡片审批/流式输出），无需自己搭公网服务器。",
  "releaseNotes": "【v2.17.5】\n• 修复「本轮改动」摘要从未显示（读取时机竞态）\n• 修复按钮点击后误弹「请勿重复操作」提示\n• 平台面板：QQ 调整为第一位，推荐标记移到 QQ\n• 按钮交互与卡片渲染已通过真机验证",
```

**依据 2 · 源码核查**：[lib/index.js:736-743](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/index.js#L736-L743)

HTTP先经Bridge认证。

```text
      // 4. 核心鉴权拦截
      // 豁免：authAdminUnlock（管理密码解锁）不要求访问会话——锁屏状态下访问会话可能已失效，
      // 但用户应能凭管理密码解锁（否则访问会话失效后锁屏永远解不开，死锁）
      const isAdminUnlockRpc = pathname === '/dsh-bridge/authAdminUnlock'
        || pathname.endsWith('/dsh-bridge/authAdminUnlock');
      const auth = isAdminUnlockRpc
        ? { authenticated: true }
        : (this.authManager?.verifyRequest(req) ?? { authenticated: true });
```

**依据 3 · 源码核查**：[lib/index.js:799-802](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/index.js#L799-L802)

授权后代理到本机宿主。

```text
      // 5. 认证通过：正常执行反向代理转发
      const headers = loopbackHeaders(req.headers, this.targetPort);
      const proxyReq = httpRequest(
        { host: '127.0.0.1', port: this.targetPort, method: req.method, path: req.url, headers, agent: false },
```

**依据 4 · 源码核查**：[lib/platform/conversation-bridge.js:1326-1344](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/platform/conversation-bridge.js#L1326-L1344)

审批只接管本桥追踪轮次。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

#### 缺口

- 没有真实跨网继续任务与手工隧道的同条件结果。
  **影响**：不能证明扫码更可靠或减少操作总负担。
  **进一步探讨**：在隔离宿主比较授权进入、任务继续、断线和恢复的成功/错误路由及人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 网页/WS与认证如何接线，可信绕过怎样判？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

Bridge是特权边界适配。授权后loopbackHeaders重写Host/Origin/Referer为127.0.0.1，并从本地DSH凭据构造认证cookie；因此远端请求最终可能带宿主认可的本地身份，Bridge门禁正确性比“只是隧道”更关键。HTTP与WS都有verifyRequest，WS有Origin时额外核白名单、拒null，缺Origin的非浏览器客户端仍先经过身份校验。这是已存在的防护，不能因为代理重写就声称任意远端可直接绕过。

配置边界也明确。AuthManager.enabled取配置布尔值，默认空配置为false；未启用认证直通。启用后scope=public_only会放行未被识别为隧道的请求，lan_only则放行被识别为隧道的请求。自建隧道判定要求物理loopback加内部随机secret，Cloudflare判定要求loopback加对应头；部署另一个本机反向代理而没有这些信号时，不能想当然认为它进入公网认证范围。allowLoopback还有本机免认分支。这些是策略选择及拓扑依赖，不等同已经发现无条件公网漏洞。

token_only明确拒绝密码登录；其他模式未设访问密码时verifyPassword成功，登录路由随后签发session。因此只打开enabled却未配密码，不等于有完整口令保护。logout路由只清浏览器cookie，没有调用已有revokeSession；复制出的同一session仍受服务端有效期/模式或密码变更吊销控制，不能把页面退出当服务端令牌已撤销。该行为由源码可见，未实际利用或暴露凭据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:242-265](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/index.js#L242-L265)

重写上游身份/来源并注入原生cookie。

<details>
<summary>查看原文（24行）</summary>

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
  const dshCookie = getDshLoopbackCookie(targetPort);
  if (dshCookie) {
    const existing = out['cookie'] || out['Cookie'] || '';
    out['cookie'] = existing ? `${existing}; ${dshCookie}` : dshCookie;
```

</details>

**依据 2 · 源码核查**：[lib/auth/dsh-native-cookie.js:135-144](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/auth/dsh-native-cookie.js#L135-L144)

本地凭据读取和原生认证cookie来源，不读取任何真实用户值。

<details>
<summary>查看原文（10行）</summary>

```text
export function getDshLoopbackCookie(targetPort, env = {}) {
  const readFile = env.readFileSync ?? readFileSync;
  const exists = env.existsSync ?? existsSync;
  try {
    const dshHome = env.dshHome ?? process.env.DSH_HOME ?? join(homedir(), '.dsh');
    const credPath = join(dshHome, '.credentials.yaml');
    if (!exists(credPath)) return '';
    const secret = readBrowserSessionSecret(readFile(credPath, 'utf8'));
    if (!secret) return '';
    return buildDshLoopbackCookie({ targetPort, secret, now: env.now });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:885-913](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/index.js#L885-L913)

WS先身份后Origin收紧。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/auth/manager.js:83-104](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/auth/manager.js#L83-L104)

enabled和scope默认、持久登录状态。

<details>
<summary>查看原文（22行）</summary>

```text
  constructor({ config = {}, onPersist, sessionsFile, logger = console } = {}) {
    this.logger = logger
    this.onPersist = onPersist

    this.enabled = Boolean(config.enabled)
    this.mode = config.mode || 'token_and_password'
    this.scope = config.scope || 'all' // 'all' | 'public_only' | 'lan_only'
    this.adminPolicy = config.adminPolicy || 'password_unlock' // 'password_unlock' | 'local_only' | 'open'
    // 管理保护独立于访问认证：默认开启（现有用户保持受保护），关闭后管理操作免 adminToken
    this.adminProtection = config.adminProtection !== false
    this.passwordHash = config.passwordHash || ''
    this.passwordSalt = config.passwordSalt || ''
    this.adminPasswordHash = config.adminPasswordHash || ''
    this.adminPasswordSalt = config.adminPasswordSalt || ''
    this.secretToken = config.secretToken || this._generateToken()
    this.allowLoopback = config.allowLoopback !== false
    // 内部隧道专用鉴权密钥（内存生成，用于辨别本地自建隧道转发流量与真实本机访问）
    this.internalTunnelSecret = randomBytes(24).toString('hex')

    // Session 存储与重启恢复：sessionToken -> { createdAt, expiresAt }
    // 持久化到 sessions.json（路径可经 sessionsFile 注入），宿主（dsh web）重启后已登录设备免重输访问密码
    this.sessions = PersistentSessionMap.load(sessionsFile ?? DEFAULT_SESSIONS_FILE)
```

</details>

**依据 5 · 源码核查**：[lib/auth/manager.js:523-553](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/auth/manager.js#L523-L553)

认证关闭与不同scope/隧道判定分支。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[lib/auth/manager.js:406-423](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/auth/manager.js#L406-L423)

token_only拒密码，未配访问密码则成功。

<details>
<summary>查看原文（18行）</summary>

```text
  async verifyPassword(inputPassword, clientIp = '') {
    if (this.isIpBlocked(clientIp)) {
      return { success: false, error: '尝试次数过多，请稍后再试' }
    }

    // 严禁 token_only 模式下通过密码登录接口获取 Session
    if (this.mode === 'token_only') {
      return { success: false, error: '当前仅允许专属安全 Token 扫码访问，不支持密码登录' }
    }

    if (!this.hasPassword) {
      // 管理员尚未设置任何访问密码：无哈希可校验，放行（与 token_and_password 一致）。
      // 历史实现曾在此拒绝 password_only 模式的空白登录，但那会形成死锁：
      // 无密码 → 登录墙永远 401 → 进不去面板 → 看不到设密码表单 → 永远无法设密码。
      // 未设密码 = 没有受保护秘密，应先让管理员进入完成密码初始化；
      // 设置密码后，墙才会真正生效（此时任意/错误密码均被拒绝）。
      return { success: true }
    }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:624-640](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/index.js#L624-L640)

密码登录成功即创建持久会话。

<details>
<summary>查看原文（17行）</summary>

```text
      // 1. 处理登录 API: POST /__dsh_bridge__/login
      if (pathname === '/__dsh_bridge__/login' && req.method === 'POST') {
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', async () => {
          try {
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
            const clientIp = req.socket?.remoteAddress || '';
            const verify = await this.authManager?.verifyPassword(body.password, clientIp);
            // 登录失败文案：按请求语言本地化（与登录页语言同一判定）
            const loginLang = pickLoginLang(req.headers['accept-language']);
            if (verify?.success) {
              const sessionToken = this.authManager.createSession();
              res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
                'Set-Cookie': `dsh_bridge_auth=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
              });
```

</details>

**依据 8 · 源码核查**：[lib/index.js:654-660](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/index.js#L654-L660)

logout仅下发清cookie。

```text
      // 2. 处理登出 API: POST /__dsh_bridge__/logout
      if (pathname === '/__dsh_bridge__/logout' && req.method === 'POST') {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Set-Cookie': 'dsh_bridge_auth=; Path=/; HttpOnly; Max-Age=0',
        });
        res.end(JSON.stringify({ ok: true }));
```

**依据 9 · 源码核查**：[lib/auth/manager.js:466-481](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/auth/manager.js#L466-L481)

服务端验证有效期并另有revokeSession。

<details>
<summary>查看原文（16行）</summary>

```text
  validateSession(sessionToken) {
    if (!sessionToken) return false
    const sess = this.sessions.get(sessionToken)
    if (!sess) return false
    if (Date.now() > sess.expiresAt) {
      this.sessions.delete(sessionToken)
      return false
    }
    return true
  }

  /**
   * 销毁 Session
   */
  revokeSession(sessionToken) {
    if (sessionToken) this.sessions.delete(sessionToken)
```

</details>

#### 缺口

- 未验证实际拓扑下转发头、cookie吊销和原生宿主认证兼容。
  **影响**：无法给公网部署或共享主机提供已验收的安全保证。
  **进一步探讨**：在隔离端口核公网/局域网/本机代理三条路径的未认证拒绝，配密码前后、复制测试令牌登出后与轮换后均检查。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 消息、审批与会话恢复属于什么范围？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

共享IM桥以本轮_turnPeers和ownsAgent判断审批归属，网页发起的轮次继续交宿主GUI。审批注册时保留发起sender，resolveApproval检查非空sender是否匹配peerId；超时拒绝，宿主signal中止时cancelled，并清pending。这样不必让网页和IM抢同一审批，但null sender作为内部路径被允许，必须由各通道入口保证真实事件不会丢身份；本轮未逐一穷尽四平台入口，不能声称群聊全部情况下不会代批。

会话恢复先查sessionPersistence，已有记录用agents.resume，否则create，尽量保留存储preset；读取失败catch后会按未持久化处理，这可能让重连变成创建/报错而不是无损恢复，不能只看重连成功。登录会话的磁盘持久化是远程设备登录保持，Agent会话由宿主持久化，两者不是同一个恢复保证。审批pending在内存，重启和断连后必须重新查看宿主实际请求，不能重放旧卡片当授权。

微信/QQ/飞书/Telegram具体SDK、平台账号和外部服务仍决定可用性；源码中的微信iLink/ClawBot接入不等于接管普通个人微信。传输重试也不证明远程任务已取消或未执行，有副作用任务要先查宿主会话/实际结果再重试。本轮仅支持共享桥关键机制结论，不把各平台演示、包说明的真机验证写成本轮实测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/platform/conversation-bridge.js:1326-1344](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/platform/conversation-bridge.js#L1326-L1344)

轮次所有权门槛。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/platform/conversation-bridge.js:432-466](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/platform/conversation-bridge.js#L432-L466)

审批发起者校验与内部null边界。

<details>
<summary>查看原文（35行）</summary>

```text
  resolveApproval(text, senderId = null) {    const entries = [...this.pending.entries()]
    if (entries.length === 0) return false
    let outcome
    if (text === '/yes') outcome = 'allowed-once'
    else if (text === '/no') outcome = 'rejected'
    if (outcome) {
      const [number, entry] = entries[entries.length - 1]
      // 双重检查：确保此 number 仍在 pending 中（防止超时竞态）
      if (!this.pending.has(number)) return false
      if (!this._approvalAllowed(entry, senderId)) return false
      this.clearApproval(number)
      entry.resolve(outcome)
      return true
    }
    if ((text === '1' || text === '2') && entries.length === 1) {
      const [number, entry] = entries[0]
      // 双重检查：确保此 number 仍在 pending 中（防止超时竞态）
      if (!this.pending.has(number)) return false
      if (!this._approvalAllowed(entry, senderId)) return false
      this.clearApproval(number)
      entry.resolve(text === '1' ? 'allowed-once' : 'rejected')
      return true
    }
    return false
  }

  // 审批发起者校验：仅允许发起审批时的 peer（handleInbound 的 sender）决议，
  // 防止群聊/多用户场景下其他成员代批工具执行。senderId 为 null 时放行（内部路径）。
  _approvalAllowed(entry, senderId) {
    if (senderId == null) return true
    if (entry.peerId && entry.peerId !== senderId) {
      this.logger?.warn?.(`[dsh-bridge ${this.platform?.id}] approval #${entry.number} blocked: sender ${senderId} is not the initiator ${entry.peerId}`)
      return false
    }
    return true
```

</details>

**依据 3 · 源码核查**：[lib/platform/conversation-bridge.js:1387-1407](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/platform/conversation-bridge.js#L1387-L1407)

超时/中止与pending清理。

<details>
<summary>查看原文（21行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/platform/conversation-bridge.js:734-764](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/platform/conversation-bridge.js#L734-L764)

持久会话resume/create与失败回退。

<details>
<summary>查看原文（31行）</summary>

```text
              let persisted = false
              let storedPreset
              try {
                const entries = await this.ctx.sessionPersistence?.list?.()
                const matched = Array.isArray(entries)
                  ? sessionHeaderOf(entries.find((entry) => sessionHeaderOf(entry)?.id === sessionId))
                  : undefined
                persisted = Boolean(matched)
                storedPreset = matched?.agentPreset
              } catch { /* 读取失败则按未持久化处理 */ }

              // 恢复会话按其自身记录的 preset 组装（与 DSH 会话控制器一致）；未记录则用桥配置，
              // 都为空时交给 DSH 默认 preset。记录值失效时 _composeAgentPreset 会回退默认并告警。
              const composition = await this._composeAgentPreset(persisted ? (storedPreset ?? this.config.agentPreset) : this.config.agentPreset)

              let handle
              if (persisted) {
                handle = await this.ctx.agents.resume({
                  resumeSessionId: sessionId,
                  agentOptions,
                  setup: composition.setup,
                })
              } else {
                const meta = { cwd: this.config.cwd || process.cwd() }
                if (composition.agentPreset) meta.agentPreset = composition.agentPreset
                handle = await this.ctx.agents.create({
                  sessionId,
                  meta,
                  agentOptions,
                  setup: composition.setup,
                })
```

</details>

**依据 5 · 源码核查**：[lib/auth/manager.js:102-108](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/auth/manager.js#L102-L108)

登录与管理员/审批相关内存状态分离。

```text
    // Session 存储与重启恢复：sessionToken -> { createdAt, expiresAt }
    // 持久化到 sessions.json（路径可经 sessionsFile 注入），宿主（dsh web）重启后已登录设备免重输访问密码
    this.sessions = PersistentSessionMap.load(sessionsFile ?? DEFAULT_SESSIONS_FILE)
    // 管理员解锁 Session 内存存储：adminToken -> { createdAt, expiresAt }
    this.adminSessions = new Map()
    // 防暴力破解：ip -> { failedCount, lockUntil }
    this.rateLimits = new Map()
```

#### 缺口

- 四平台sender身份完整传递、重连重复投递与在途审批未全部核查。
  **影响**：不能给多用户/公网/机器人全链通过结论。
  **进一步探讨**：逐通道固定账号和同一会话，在重启、重复卡片、不同sender和超时后检查宿主最终审批及副作用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接入与全周期成本/退出是什么？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

启动需要匹配Node/DSH与Web表面，远程网页还需要本机宿主持续运行和目标网络能到Bridge代理。公网通过Cloudflare或自建隧道会增加二进制、账号/域名或服务与网络维护；局域网可少一层服务，但并不自动获得访问保护。IM路径额外承担平台账号、SDK适配、sender绑定和媒体存储。不能把无需自己搭公网服务器解释为无第三方依赖或零资源成本。

首次应只在独立宿主固定配置认证模式、范围、密码/令牌、实际入口与默认会话；持续维护包括凭据轮换、登录设备、宿主/插件升级、隧道可达性和平台变更。普通logout仅清cookie的边界使丢设备时需要真正吊销会话或改密码/模式，scope或mode变更会清普通与管理员会话，改访问密码只清普通会话；这些动作与关闭浏览器不同。失败要辨别网络断开、Agent仍运行、审批超时与平台发送失败，先在宿主确认实际结果再重试。退出应停止隧道与代理、禁用机器人并核入口不可达，再保留需要的配置/会话材料。没有真实带宽、长期运行、API/域名费用和排障时间，不计算单位远程任务成本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:56-72](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/package.json#L56-L72)

peer与运行时条件。

<details>
<summary>查看原文（17行）</summary>

```text
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-llm": ">=0.1.0-rc.6"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-llm": {
      "optional": true
    }
  },
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "license": "MIT",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "remote",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2534-2534](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/index.js#L2534-L2534)

代理端口是独立入口。

```text
  const proxyPort = config.port ?? 3082;
```

**依据 3 · 源码核查**：[lib/index.js:2627-2635](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/index.js#L2627-L2635)

实际读取持久认证配置。

```text
  // 访问安全认证管理器
  const authManager = new AuthManager({
    config: config.auth ?? {},
    logger,
    onPersist: (patch) => updateConfig((stored) => {
      stored.auth = { ...(stored.auth ?? {}), ...patch };
      return stored;
    }),
  });
```

**依据 4 · 源码核查**：[lib/auth/manager.js:234-249](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/auth/manager.js#L234-L249)

模式/scope变更清会话。

<details>
<summary>查看原文（16行）</summary>

```text
  async setMode(mode) {
    if (['token_and_password', 'password_only', 'token_only'].includes(mode)) {
      this.mode = mode
      // 切换认证模式时清空所有现有 Session，确保新策略立即对所有设备生效
      this.sessions.clear()
      this.adminSessions.clear()
      await this._persist()
    }
  }

  async setScope(scope) {
    if (['all', 'public_only', 'lan_only'].includes(scope)) {
      this.scope = scope
      this.sessions.clear()
      this.adminSessions.clear()
      await this._persist()
```

</details>

**依据 5 · 源码核查**：[lib/auth/manager.js:262-273](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/auth/manager.js#L262-L273)

改密码吊销普通登录状态。

<details>
<summary>查看原文（12行）</summary>

```text
  async setPassword(password) {
    if (!password) {
      this.passwordHash = ''
      this.passwordSalt = ''
    } else {
      const salt = randomBytes(16).toString('hex')
      this.passwordHash = await this._hashPassword(password, salt)
      this.passwordSalt = salt
    }
    // 更改访问密码时使所有普通访客 Session 失效
    this.sessions.clear()
    await this._persist()
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1483-1504](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/index.js#L1483-L1504)

停止Cloudflare客户端并保存配置。

<details>
<summary>查看原文（22行）</summary>

```text
  // 内部 dispose 请走 _haltCloudflared()，避免误改用户配置。
  async stopCloudflared() {
    if (this.cloudflared) {
      this.cloudflared.stop();
      this.cloudflared = null;
      this.cloudflaredState = { phase: 'idle', detail: '' };
    }
    this.cloudflaredConfig = {
      ...(this.cloudflaredConfig ?? {}),
      autoStart: false,
    };
    await this.onPersist?.({ cloudflared: this.cloudflaredConfig });
  }

  // 仅停止进程与状态，不动持久化配置（插件卸载/重启路径用——用户的 autoStart 意图要保留）
  async _haltCloudflared() {
    if (this.cloudflared) {
      this.cloudflared.stop();
      this.cloudflared = null;
      this.cloudflaredState = { phase: 'idle', detail: '' };
    }
  }
```

</details>

#### 缺口

- 没有持续运行费用、网络可用性和故障恢复工时。
  **影响**：不能证明比SSH/原代理总负担更低。
  **进一步探讨**：记录相同远程任务的所有配置/传输/重试/轮换与退出时间，独立核入口是否停止。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 是否值得试，哪项假设可证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前建议观察公网和共享IM采用，先在可丢弃的本地DSH副本核门禁与会话范围。它确有远程生命周期集成价值，但特权代理会注入原生本地身份，默认/范围/未配密码状态和实际拓扑必须一致；仅见登录页或Auth enabled不够。不能在真实工作区和私人账号上把它当已经验收的安全访问层。若未认证请求进入、入口范围不明、审批发错会话或登出后希望吊销却仍有效，应停隧道/代理并轮换测试凭据，回本机DSH核任务结果。

有依据的待验证方向是将“实际入口探测结果+有效认证策略+会话吊销结果”作为启动公网前的可核对收据，而不是再增加一个enabled徽章。源码已有scope与WS Origin防护，也有修改配置清会话，新增点是把拓扑判定和实际未认证拒绝放到同一用户检查。应先排查现有诊断/安全面板是否已有等价能力，本轮未穷尽。最小对照固定本地、Cloudflare与自建/其他本机代理三种入口，混入enabled=false、缺密码、public_only误分类和logout复制令牌情形，比较当前面板和实际收据视图。观察错误开放、用户判断准确性、核对时间、探测副作用和维护成本；若现有诊断已同等充分或探测增加误导/负担则否定该方案。

#### 证据与依据

**依据 1 · 源码核查**：[lib/auth/manager.js:523-553](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/auth/manager.js#L523-L553)

策略取决拓扑分类。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/auth/manager.js:406-423](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/auth/manager.js#L406-L423)

enabled不等已配置口令。

<details>
<summary>查看原文（18行）</summary>

```text
  async verifyPassword(inputPassword, clientIp = '') {
    if (this.isIpBlocked(clientIp)) {
      return { success: false, error: '尝试次数过多，请稍后再试' }
    }

    // 严禁 token_only 模式下通过密码登录接口获取 Session
    if (this.mode === 'token_only') {
      return { success: false, error: '当前仅允许专属安全 Token 扫码访问，不支持密码登录' }
    }

    if (!this.hasPassword) {
      // 管理员尚未设置任何访问密码：无哈希可校验，放行（与 token_and_password 一致）。
      // 历史实现曾在此拒绝 password_only 模式的空白登录，但那会形成死锁：
      // 无密码 → 登录墙永远 401 → 进不去面板 → 看不到设密码表单 → 永远无法设密码。
      // 未设密码 = 没有受保护秘密，应先让管理员进入完成密码初始化；
      // 设置密码后，墙才会真正生效（此时任意/错误密码均被拒绝）。
      return { success: true }
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:654-660](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/index.js#L654-L660)

登出/吊销区别提供可核查反例。

```text
      // 2. 处理登出 API: POST /__dsh_bridge__/logout
      if (pathname === '/__dsh_bridge__/logout' && req.method === 'POST') {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Set-Cookie': 'dsh_bridge_auth=; Path=/; HttpOnly; Max-Age=0',
        });
        res.end(JSON.stringify({ ok: true }));
```

**依据 4 · 源码核查**：[lib/index.js:885-913](https://github.com/wenbin-wb/dsh-bridge/blob/a03854a257438b42c3aa6955f754b4aaee5e6eb7/lib/index.js#L885-L913)

已有WS防护是新方向的基线而非缺失控制。

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

#### 缺口

- 没有真实拓扑拒绝记录，现有诊断等价性未穷尽。
  **影响**：新增收据或公网采用均不能由静态代码直接保证。
  **进一步探讨**：先用测试宿主核实际入口与吊销，再决定是否需要新增界面以及能否安全扩到真实任务。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
