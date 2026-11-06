# DSH Full Remote

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[0c24350](https://github.com/JUANWANG-BUAA/dsh-full-remote/tree/0c24350d264b0f40ff851fb32b5005691a656e75)

<!-- BEGIN META -->
[![GitHub ★ 51](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=51&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/JUANWANG-BUAA/dsh-full-remote) [![npm 30d 1,064](https://img.shields.io/static/v1?label=npm+30d&message=1%2C064&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-full-remote) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-full-remote)
<!-- END META -->

> **功能**：以设备认证代理开放同一DSH宿主完整Web特权访问，并提供跨会话远程待答控制台。

> **亮点**：[Q01](#research-q01)解决远程特权403；[Q03](#research-q03)邀请/设备/撤销与持久失败门禁；[Q04](#research-q04)远程跨会话待答和不自动重放。

> **主要限制**：[Q02](#research-q02)设备即完整宿主信任而非租户分权；[Q03](#research-q03)默认不审批/邀请同IP重试和持久撤销需治理；[Q04](#research-q04)断线/停止不撤宿主已接副作用，基准非手机收益。

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
  - [Q01 · 远程完整访问解决什么，权限和收益应怎样归因？](#detail-section-11)
  - [Q02 · 远程请求怎样从设备认证进入宿主特权接口？](#detail-section-12)
  - [Q03 · 邀请、设备撤销和持久状态如何限制风险？](#detail-section-13)
  - [Q04 · 远程答复真的到宿主吗，断线和性能/退出如何验？](#detail-section-14)
  - [Q05 · 值得生产化的方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-full-remote0.5.0是原生DSH反向代理/客户端插件，给手机或远程浏览器继续操作同一宿主Web，包括原先远程Host/Origin被拒的设置、凭据、目录等特权API，并提供跨会话审批/问答/计划评审控制台。目标是人在异地仍能辨认任务、正确答复并继续工作，不是新远端Agent执行引擎；任务执行/权限API仍由DSH承担。

通用隧道/局域网Web访问与宿主原生交互；代理/压缩和现有权限域为已有能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 完整代理 | 远端特权Web | 设备近管理员信任 |
| 邀请/撤销 | 设备生命周期 | 同IP重试/持久失败须核 |
| 待答控制台 | 跨会话答复 | 官方域执行，uncertain不盲重发 |
| 隧道 | 可达通道 | 临时非正式治理 |
| 缓存/轮询 | 传输便利 | 作者本地基准非手机收益 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失/边界 |
|---|---|---|---|
| DSH Web/兼容cookie和UI域/Node | 必需 | 原生代理/任务答复 | 非独立Agent |
| 可信个人设备/私有token | 必需 | 设备登录 | 设备等完整宿主信任 |
| 受控TLS/网络/隧道 | 对外必需 | 传输与可达 | quick tunnel可选/临时 |
| 可持久私有状态/本机管理 | 必需 | 撤销轮换/恢复 | 保存失败应停用/报错 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 准备 | 隔离Host/可信设备/核TLS网络 | 不直接生产凭据公网暴露 |
| 启动 | 回环代理后接受控通道 | 核实际公网/监听与后端 |
| 配对 | 短邀请/必要时本机批准 | 默认approvalMode=false须明确 |
| 答复 | 核会话/key/内容，单次提交 | uncertain查Host不自动重发 |
| 退出 | durable revoke并核活连接/停通道 | 停访问不撤已接受操作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/网络/TLS/隧道金额未知 | 设备/权限/兼容配置 | 开源非网络免费保证 |
| 持续 | 模型token/流量/缓存未知 | 管设备/撤销/升级 | 基准不是手机效益 |
| 故障 | 误授权/重复/中断未知 | 查Host状态/本机恢复 | 答复锁非跨设备幂等 |
| 退出 | 状态/审计/二进制留存未知 | 撤销、停全部通道核残留 | 已接操作不回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 完整远程Web | 真头改写/上游转发 | 全插件兼容/生产安全 |
| 撤销 | required保存后切连接 | 真断网/重启/失窃设备 |
| 答复 | 官方pending.answer/dismiss | 多设备竞态/业务正确 |
| 性能 | 作者本机配对/原始JSON可读 | 手机LCP/电耗/总体快多少 |

> **思考**：[Q02](#research-q02)设备即完整宿主信任而非租户分权；[Q03](#research-q03)默认不审批/邀请同IP重试和持久撤销需治理；[Q04](#research-q04)断线/停止不撤宿主已接副作用，基准非手机收益。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)解决远程特权403；[Q03](#research-q03)邀请/设备/撤销与持久失败门禁；[Q04](#research-q04)远程跨会话待答和不自动重放。

[Q03](#research-q03)撤销先持久后切连接、失败还原/停监听，[Q04](#research-q04)单卡uncertain不重放值得借鉴；不把设备认证当业务分权或本地基准当手机验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)设备即完整宿主信任而非租户分权；[Q03](#research-q03)默认不审批/邀请同IP重试和持久撤销需治理；[Q04](#research-q04)断线/停止不撤宿主已接副作用，基准非手机收益。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)可信个人设备/隔离Host受限试用；生产全权限长期暴露先观察，核撤销和不明提交后才扩大。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态支持认证转发/设备撤销/官方答复链；可信个人设备与隔离宿主受限试用，非长期生产公网安全验证。

- 已检查：作者 README、包清单、源码路径 README.zh.md、docs/benchmarks/v0.5.0/polling.json、docs/benchmarks/v0.5.0/session.json、docs/benchmarks/v0.5.0/summary.json、docs/benchmarks/v0.5.0/transport.json、docs/performance-benchmark.zh.md、package.json、src/client/InteractionOverlay.tsx、src/client/pending-source.ts、src/client/use-interaction-submission.ts、src/config.ts、src/control-routes.ts、src/index.ts、src/invites.ts、src/persist.ts、src/proxy-headers.ts、src/proxy.ts、src/sessions.ts、src/tunnel.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核原生包、代理HTTP/WS/headers/启动、邀请/会话/管理门禁/持久保存/撤销轮换、任务注册表与提交锁、隧道spawn/stop和作者基准方法/摘要/hash；未全审缓存压缩/页面全部UI/下载链/安全审计或重算原始轮次。
- 下一步：只读固定树和作者归档JSON/hash；未启动插件/Host/隧道/浏览器或执行基准；无独立网络/权限/业务/性能验证。

**分析版本**

- **仓库**：[JUANWANG-BUAA/dsh-full-remote](https://github.com/JUANWANG-BUAA/dsh-full-remote)
- **版本号**：0.5.0（[固定提交 0c24350](https://github.com/JUANWANG-BUAA/dsh-full-remote/tree/0c24350d264b0f40ff851fb32b5005691a656e75)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)任务级短期能力票据/越界拒绝/回执，故障和授权对照验净收益，未实现不加分。

只读固定树和作者归档JSON/hash；未启动插件/Host/隧道/浏览器或执行基准；无独立网络/权限/业务/性能验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 36 | 5553 | — | — | 56339 |
| .js | source | 1 | 55 | 44 | 14 | — |
| .mjs | source | 9 | 870 | 724 | 101 | — |
| .tsx | test | 8 | 2642 | 2430 | 59 | — |
| .ts | source | 39 | 7114 | 5769 | 945 | — |
| .mts | source | 1 | 185 | 168 | 5 | — |
| .tsx | source | 9 | 2171 | 1971 | 99 | — |
| .ts | test | 15 | 7453 | 6816 | 157 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/JUANWANG-BUAA/dsh-full-remote/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核信任转换/设备撤销、真实答复及不明结果，判断远程管理员通道采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 远程完整访问解决什么，权限和收益应怎样归因？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-full-remote0.5.0是原生DSH反向代理/客户端插件，给手机或远程浏览器继续操作同一宿主Web，包括原先远程Host/Origin被拒的设置、凭据、目录等特权API，并提供跨会话审批/问答/计划评审控制台。目标是人在异地仍能辨认任务、正确答复并继续工作，不是新远端Agent执行引擎；任务执行/权限API仍由DSH承担。

基线是通用公网隧道/局域网访问，可能页面可见但特权接口403。它通过设备登录和头部改写接通整套宿主，邀请和撤销/缓存/任务卡是增量；HTTP代理、TLS、隧道和宿主交互域均已有。作者公开本机性能数据并明确动态JSON负收益和非手机LCP范围，不能把热缓存93.4%当产品整体/移动网络效益。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:19-25](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/README.zh.md#L19-L25)

作者完整远程访问/控制台定位。

```text
`dsh-full-remote` 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的一个插件：它在 Harness Web 服务前放置一层带鉴权的反向代理，使 Web 界面可以通过公网隧道或局域网设备访问，同时保持设置、凭据、目录浏览等特权接口可用。

## 0.5.0 新增

- 跨会话可选择式「**任务控制台**」：审批、问答、计划评审和会话导航；当前页面内保留草稿、断线禁提交、不自动重放写操作。
- Brotli/gzip 协商、设备隔离的已编码静态缓存、自有上游连接池、按真实活动识别失效，以及后台暂停、同类慢请求不重叠的轮询。
- 保持 DeepSeek Harness **0.2.1-rc.2** 兼容性，以及既有鉴权与仅限回环的代理管理边界。
```

**依据 2 · 作者声明**：[README.zh.md:29-41](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/README.zh.md#L29-L41)

作者配对HTTP收益和负对照范围。

<details>
<summary>查看原文（13行）</summary>

```text
对比**已经使用 gzip 的旧版**，15 个配对本机 HTTP 轮次；时间是请求累计耗时，**不是 LCP 或真实手机页面加载时间**。

| 场景 | 基线 → 0.5.0 候选实现 | 含义 |
|---|---|---|
| 冷 HTML + 4 个入口资源 | 42.08 → 25.61 ms；415,637 → 415,534 B | HTTP 耗时 −39.1%，主体字节仅少 **0.025%** |
| 40 次热静态请求 | 424.68 → 28.15 ms；回源 40 → 0 次 | HTTP 耗时 −93.4%，不是下行流量减少 100% |
| 40 次条件请求 | 主体 0 → 0 B；头部 6,360 → 9,800 B | 两版原本都返回 304；新版免回源但增加元数据 |
| 10 次合成动态 JSON 请求 | 8.82 → 10.25 ms | 本机**慢 16.2%**，没有缓存 API |
| 真实 React 组件，模拟 60 秒 | 隐藏 RPC 50 → 0；可见慢 RPC 48 → 20 | 正常可见仍为 50 次，不是耗电实测 |

完整方法、同编码对照、局限与复现：[中文报告](./docs/performance-benchmark.zh.md) · [English benchmark](./docs/performance-benchmark.md)。

## 60 秒快速开始
```

</details>

**依据 3 · 源码核查**：[package.json:1-14](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/package.json#L1-L14)

原生Host/client入口与版本。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "dsh-full-remote",
  "version": "0.5.0",
  "description": "DeepSeek Harness plugin for remote access: a token-gated reverse proxy keeps settings, credentials, and file access working over public tunnels and on other devices instead of returning 403. Per-device sessions.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
```

</details>

**依据 4 · 源码核查**：[package.json:57-67](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/package.json#L57-L67)

Node/许可条件。

<details>
<summary>查看原文（11行）</summary>

```text
  ],
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "packageManager": "pnpm@11.21.0",
  "license": "MIT",
  "author": {
    "name": "JUANWANG-BUAA",
    "url": "https://github.com/JUANWANG-BUAA"
  },
  "repository": {
```

</details>

#### 缺口

- 真实手机网络、敏感操作和异地审批质量未验证。
  **影响**：不能按本地HTTP数据推荐长期公网生产暴露。
  **进一步探讨**：在可丢弃宿主测连接/权限/任务答复、移动网络与错误率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 远程请求怎样从设备认证进入宿主特权接口？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

HTTP先CIDR/登录/设备会话校验，控制前缀拒绝远程；无有效会话GET跳登录、写请求401。forwardHeaders移除不可信/内部与hop头，强制Host和Origin为回环、sec-fetch-site same-origin，可换宿主browser cookie，再由http.request转发原path/method。启动可用宿主launch token换内部browser cookie，所以远端device认证成为主要信任边界，不是把设备变成只读用户。

WebSocket同样校验CIDR/设备并禁止管理路径，重新构造headers，真实upgrade后双向pipe并双端close；SSE/HTTP也跟踪session。默认回环监听、后端须回环，公网需TLS终止/受控网络和隧道。这个边界接近远程控制同一管理员宿主，不能把设备列表/标签当不同用户最小权限或租户隔离；已认证设备并没有按API分权。

#### 证据与依据

**依据 1 · 源码核查**：[src/proxy.ts:960-998](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/proxy.ts#L960-L998)

真实HTTP认证/控制拒绝和转发。

<details>
<summary>查看原文（39行）</summary>

```text
  const onRequest = async (req: IncomingMessage, res: ServerResponse) => {
    logRequest?.(req, res)
    const path = pathnameOf(req.url)
    const cookie = parseCookies(req.headers.cookie)[spec.cookieName]
    // healthz sits behind the CIDR gate so a public probe cannot map the
    // listener when an allowlist is configured.
    if (denyCidr(req, res)) return
    if (path === HEALTHZ_PATH) {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
      res.end('{"ok":true}\n')
      return
    }
    if (path === LOGIN_PATH) {
      await handleLogin(req, res, runtimeSpec)
      return
    }
    if (handleWaitRoutes(req, res, runtimeSpec, path, cookie)) return
    if (await handleDevicePages(req, res, runtimeSpec, path, cookie)) return
    if (path.startsWith(spec.controlPrefix)) {
      drainRequest(req)
      sendText(res, 403, 'forbidden\n')
      return
    }
    const session = runtimeSpec.sessionStore.validate(cookie, effectiveRemoteAddress(req, runtimeSpec))
    if (session === undefined) {
      drainRequest(req)
      if (req.method === 'GET' || req.method === 'HEAD') {
        redirect(res, LOGIN_PATH)
      } else {
        res.writeHead(401, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end('{"error":"authentication-required"}\n')
      }
      return
    }
    proxyRequest(req, res, runtimeSpec, session.id)
  }

  const serverOptions = {
    maxHeaderSize: spec.maxHeaderSizeBytes ?? 16 * 1024,
```

</details>

**依据 2 · 源码核查**：[src/proxy-headers.ts:99-125](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/proxy-headers.ts#L99-L125)

实际Host/Origin/内部cookie改写。

<details>
<summary>查看原文（27行）</summary>

```text
export function forwardHeaders(req: IncomingMessage, backendHost: string, options: {
  tls?: boolean
  trustForwardedProto?: boolean
  forwardedFor?: string
  /** Harness browser-session cookie obtained by the host-side auth bridge. */
  upstreamCookie?: string
} = {}) {
  const headers: Record<string, string | string[] | undefined> = {}
  const nominated = connectionTokens(req.headers)
  for (const [key, value] of Object.entries(req.headers)) {
    const lower = key.toLowerCase()
    if (value === undefined || value === null || lower === 'host' || nominated.has(lower) || HOP_BY_HOP.has(lower) || SPOOFABLE_FORWARDING.has(lower) || INTERNAL_HEADERS.has(lower)) continue
    headers[lower] = value as string | string[]
  }
  const sourceHost = req.headers.host ?? ''
  const remote = req.socket.remoteAddress ?? ''
  const proto = requestIsHttps(req, options.tls === true, options.trustForwardedProto === true) ? 'https' : 'http'
  headers.host = backendHost
  headers.origin = `http://${backendHost}`
  headers['sec-fetch-site'] = 'same-origin'
  headers['x-forwarded-for'] = options.forwardedFor ?? remote
  headers['x-forwarded-host'] = sourceHost
  headers['x-forwarded-proto'] = proto
  headers['x-dsh-reverse-proxy'] = '1'
  if (options.upstreamCookie !== undefined) headers.cookie = options.upstreamCookie
  return headers
}
```

</details>

**依据 3 · 源码核查**：[src/proxy.ts:509-525](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/proxy.ts#L509-L525)

真实上游httpRequest路径/方法/header。

<details>
<summary>查看原文（17行）</summary>

```text
  const activity = spec.sessionStore.trackActivity(cookie)
  const up = httpRequest({
    agent: spec.upstreamAgent,
    hostname: spec.backendHost,
    port: spec.backendPort,
    path: req.url,
    method: req.method,
    headers: forwardHeaders(req, spec.rewriteAuthority, {
      tls: spec.tls === true,
      trustForwardedProto: spec.trustForwardedProto(),
      forwardedFor: effectiveRemoteAddress(req, spec),
      upstreamCookie: spec.upstreamCookie,
    }),
  }, (incoming) => {
    clearConnectTimeout()
    const status = incoming.statusCode ?? 502
    const responseReceivedAt = Date.now()
```

</details>

**依据 4 · 源码核查**：[src/index.ts:294-339](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/index.ts#L294-L339)

启动前失败检查和宿主browser cookie交换/监听。

<details>
<summary>查看原文（46行）</summary>

```text
  }

  const start = async () => {
    await load()
    if (disposed) return failStart('disposed')
    if (bound !== undefined) {
      lastFailure = undefined
      return snapshot()
    }
    const { host, port } = effectiveListen()
    if (statePersistenceBlocked) return failStart('state-invalid')
    const backendPort = config.backendPort || ctx.webServer.port
    // A backend pointing at the proxy's own listen address would loop every
    // request back into itself. Refuse loudly instead of spinning.
    if (isSelfLoop(host, port, config.backendHost, backendPort)) {
      ctx.logger.warn(`reverse-proxy: refusing to start — listen ${formatHttpUrl(host, port, scheme())} would loop onto backend ${formatHttpUrl(config.backendHost, backendPort)}`)
      return failStart('self-loop')
    }
    let tls
    try {
      tls = await loadTls()
    } catch (error) {
      warn(error)
      return failStart('tls-failed')
    }
    try {
      // Harness 0.1.2 protects the Web index and /api with a separate browser
      // session. Exchange its process launch token once on the loopback side;
      // the public proxy session remains the user's authentication boundary.
      const auth = connectionAuth(ctx)
      const upstreamCookie = auth === undefined
        ? undefined
        : await bootstrapUpstreamCookie({
            backendHost: config.backendHost,
            backendPort,
            auth,
            // Harness Desktop starts its embedded backend with --skip-auth and
            // DSH_SKIP_AUTH=1. In that explicit mode the launch URL returns the
            // index directly (2xx) and no upstream browser cookie is minted.
            allowUnauthenticated: process.env.DSH_SKIP_AUTH === '1',
          })
      bound = await listenProxy({
        listenHost: host,
        listenPort: port,
        backendHost: config.backendHost,
        backendPort,
```

</details>

**依据 5 · 源码核查**：[src/proxy.ts:1010-1084](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/proxy.ts#L1010-L1084)

WS认证/header/真实双向pipe与会话跟踪。

<details>
<summary>查看原文（75行）</summary>

```text
  server.on('upgrade', (req, socket, head) => {
    upgradedSockets.add(socket)
    socket.once('close', () => upgradedSockets.delete(socket))
    const upgradeRemote = effectiveRemoteAddress(req, runtimeSpec)
    if (spec.ipAllowed !== undefined && !spec.ipAllowed(upgradeRemote)) {
      denySocket(socket, '403 Forbidden')
      spec.audit?.('access.denied', { reason: 'cidr', remote: upgradeRemote, path: pathnameOf(req.url), upgrade: true })
      return
    }
    const upgradeRetryAfter = upgradeTracker.check(upgradeRemote)
    if (upgradeRetryAfter > 0) {
      denySocket(socket, '429 Too Many Requests', 'too many requests\n')
      spec.audit?.('upgrade.locked', { remote: upgradeRemote, retryAfter: upgradeRetryAfter, path: pathnameOf(req.url), upgrade: true })
      return
    }
    const path = pathnameOf(req.url)
    const cookie = parseCookies(req.headers.cookie)[spec.cookieName]
    const session = runtimeSpec.sessionStore.validate(cookie, upgradeRemote)
    if (path.startsWith(spec.controlPrefix) || session === undefined) {
      upgradeTracker.fail(upgradeRemote)
      upgradeTracker.prune()
      denySocket(socket, '401 Unauthorized')
      spec.audit?.('access.denied', { reason: 'auth', remote: upgradeRemote, path: pathnameOf(req.url), upgrade: true })
      spec.log?.({ method: req.method, path: pathnameOf(req.url), status: 401, remote: upgradeRemote })
      return
    }
    const headers = forwardHeaders(req, rewriteAuthority, {
      tls: tlsEnabled,
      trustForwardedProto: runtimeSpec.trustForwardedProto(),
      forwardedFor: upgradeRemote,
      upstreamCookie: runtimeSpec.upstreamCookie,
    })
    headers.connection = 'Upgrade'
    headers.upgrade = req.headers.upgrade ?? 'websocket'
    const up = httpRequest({
      hostname: spec.backendHost,
      port: spec.backendPort,
      path: req.url,
      method: 'GET',
      headers,
    })
    trackUpstream(up)
    const activity = runtimeSpec.sessionStore.trackActivity(cookie)
    let detachedUpstream: Duplex | undefined
    const destroyPair = () => { socket.destroy(); detachedUpstream?.destroy(); up.destroy() }
    const releaseSession = runtimeSpec.trackSession(session.id, destroyPair, () => runtimeSpec.sessionStore.isActive(cookie))
    if (releaseSession !== undefined) socket.once('close', releaseSession)
    up.setTimeout(spec.upstreamTimeoutMs, () => { up.destroy() })
    up.on('upgrade', (upRes, upSocket, upHead) => {
      // After a successful upgrade Node detaches the socket from the request,
      // so req.destroy() would leave it open — track the socket itself too.
      detachedUpstream = upSocket
      trackUpstream(upSocket)
      if (!activity()) { destroyPair(); return }
      const onActivity = () => { if (!activity()) destroyPair() }
      upSocket.on('data', onActivity)
      socket.on('data', onActivity)
      upSocket.once('close', destroyPair)
      upSocket.once('error', destroyPair)
      socket.once('close', destroyPair)
      upgradeTracker.success(upgradeRemote)
      spec.audit?.('ws.open', { remote: upgradeRemote, path: pathnameOf(req.url), status: upRes.statusCode ?? 101 })
      spec.log?.({ method: req.method, path: pathnameOf(req.url), status: upRes.statusCode ?? 101, remote: upgradeRemote })
      writeRawHead(
        socket,
        upRes.statusCode ?? 101,
        upRes.statusMessage ?? 'Switching Protocols',
        sanitizeUpgradeResponseHeaders(upRes.headers),
      )
      if (upHead.length > 0) socket.write(upHead)
      if (head.length > 0) upSocket.write(head)
      upSocket.pipe(socket)
      socket.pipe(upSocket)
    })
    // Upstream answered without upgrading (non-101): relay the status line
```

</details>

**依据 6 · 源码核查**：[src/config.ts:19-23](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/config.ts#L19-L23)

默认回环监听/后端配置。

```text
export const Config = Schema.object({
  listenHost: Schema.string().default('127.0.0.1').description('Default bind address. 0.0.0.0 / :: bind every interface but are not copyable destinations — the panel reports a reachable address separately. Prefer a concrete LAN IP for phone-on-WiFi. The UI can override this at runtime.'),
  listenPort: Schema.number().min(0).max(65535).default(3081).description('Default local tunnel target port; 0 chooses a free port; the UI can override it at runtime.'),
  backendHost: Schema.string().default('127.0.0.1').description('DeepSeek Harness Web backend host. Must be a loopback address, not a wildcard (0.0.0.0 / ::). TCP connects here; Host/Origin rewrite always uses 127.0.0.1 regardless.'),
  backendPort: Schema.number().min(0).max(65535).default(0).description('DeepSeek Harness Web backend port; 0 follows webServer.port.'),
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 邀请、设备撤销和持久状态如何限制风险？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

邀请码18字节随机、默认15分钟/最多32；并非绝对只读一次：首次消费记录IP，60秒内同IP可重试并重发同一session凭据以容忍丢跳转。只把IP当重试匹配而非人身份，NAT/转发信任需核。登录实际token恒时比对或consume邀请码，生成设备secret并设cookie；approvalMode默认false，知道token/有效邀请者默认可登录，不是每次都需本机批准。设备session校验hash/status/expiry，IP改变被记录而非拒绝。

本机管理API核socket.remoteAddress回环、固定控制header和回环Origin；公开代理/WS均挡controlPrefix，管理header不应被公网头改写绕入。revoke先required持久保存，失败hydrate旧session并报错，成功再closeSession切已有连接；不能把持久失败当撤销成功。state写0600临时文件rename，运行期保存失败置blocked阻新start；token轮换先teardown/清session和邀请，保存失败恢复旧内存但监听保持关闭。普通session活动保存有调度，不宣称所有事件都是强持久审计。

#### 证据与依据

**依据 1 · 源码核查**：[src/invites.ts:7-16](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/invites.ts#L7-L16)

邀请默认随机/TTL/重试窗口。

<details>
<summary>查看原文（10行）</summary>

```text
import { randomBytes } from 'node:crypto'

const CODE_BYTES = 18
const DEFAULT_TTL_MS = 15 * 60_000
const DEFAULT_MAX_PENDING = 32
/** Same-IP retry grace after a successful consume. A flaky tunnel can drop
 *  the login redirect after the code was already consumed; the browser then
 *  re-POSTs the same code. Without a grace the retry would deadlock into the
 *  token form even though the first attempt actually signed in. */
const DEFAULT_RETRY_GRACE_MS = 60_000
```

</details>

**依据 2 · 源码核查**：[src/invites.ts:49-99](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/invites.ts#L49-L99)

实际随机发行、consume与同IP重试/绑定。

<details>
<summary>查看原文（51行）</summary>

```text
     * Mint a fresh one-time code. Returns the plaintext code (store only
     * expiry — codes are high-entropy and never persisted to disk).
     */
    issue() {
      prune()
      const code = randomBytes(CODE_BYTES).toString('base64url')
      codes.set(code, { expiresAt: Date.now() + ttlMs })
      return code
    },

    /**
     * Consume a code. The first consume marks the code used and records the
     * client IP; a repeat consume from the SAME IP inside the retry grace
     * window is treated as a legitimate browser retry (ok + retry) so a
     * lost redirect cannot deadlock the phone into the token form. Any other
     * reuse is rejected and the code is forgotten.
     */
    consume(code: string, ip?: string, now = Date.now()): InviteConsume {
      const key = String(code ?? '')
      if (key === '') return { ok: false }
      const entry = codes.get(key)
      if (entry === undefined) return { ok: false }
      if (entry.expiresAt <= now) {
        codes.delete(key)
        return { ok: false }
      }
      if (entry.usedAt === undefined) {
        entry.usedAt = now
        entry.usedIp = ip === undefined || ip === '' ? undefined : ip
        return { ok: true, retry: false }
      }
      // Retry grace: same client, shortly after the first use. Codes used
      // without a client IP (callers that never knew one) get no grace.
      if (
        ip !== undefined && ip !== '' &&
        entry.usedIp !== undefined && entry.usedIp === ip &&
        now - entry.usedAt <= retryGraceMs
      ) {
        return { ok: true, retry: true, sessionId: entry.sessionId }
      }
      codes.delete(key)
      return { ok: false }
    },

    /** Remember the device session minted on first consume so a retry can reuse it. */
    bindSession(code: string, sessionId: string) {
      const entry = codes.get(code)
      if (entry === undefined || entry.usedAt === undefined) return
      entry.sessionId = sessionId
    },

```

</details>

**依据 3 · 源码核查**：[src/proxy.ts:695-763](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/proxy.ts#L695-L763)

真实登录/重试/生成session/cookie。

<details>
<summary>查看原文（69行）</summary>

```text
    const form = new URLSearchParams((await readBody(req, 4096)).toString('utf8'))
    const delayMs = spec.loginDelayMs ?? LOGIN_FAILURE_DELAY_MS
    // Equal delay on both success and failure so lockout-window guessing
    // cannot classify tokens by response timing alone.
    await new Promise(resolve => setTimeout(resolve, delayMs))
    const inviteCode = form.get('invite') ?? ''
    const usedInvite = inviteCode !== ''
    // remote = effectiveRemoteAddress: under an active tunnel this is the
    // real client IP, which the retry grace matches against.
    const consumed = usedInvite ? spec.inviteStore?.consume(inviteCode, remote) : undefined
    const authed = usedInvite
      ? consumed?.ok === true
      : safeEqual(form.get('token') ?? '', spec.accessToken)
    if (!authed) {
      spec.loginTracker.fail(remote)
      reserved = false
      spec.loginTracker.prune()
      spec.audit?.('login.fail', { remote, via: usedInvite ? 'invite' : 'token' })
      const failCopy = usedInvite
        ? (LOGIN_COPY[locale] ?? LOGIN_COPY.zh).invalidInvite
        : (LOGIN_COPY[locale] ?? LOGIN_COPY.zh).invalidToken
      sendHtml(res, 401, loginPage(locale, failCopy), GATE_PAGE_HEADERS)
      return
    }
    spec.loginTracker.success(remote)
    reserved = false
    let session
    if (usedInvite && consumed?.retry === true) {
      session = consumed.sessionId !== undefined
        ? spec.sessionStore.reissue(consumed.sessionId, remote)
        : undefined
      if (session === undefined) {
        spec.audit?.('login.fail', { remote, via: 'invite', reason: 'retry-session-gone' })
        sendHtml(res, 401, loginPage(locale, (LOGIN_COPY[locale] ?? LOGIN_COPY.zh).invalidInvite), GATE_PAGE_HEADERS)
        return
      }
    } else {
      try {
        session = spec.sessionStore.login({ userAgent: req.headers['user-agent'], ip: remote })
      } catch (error) {
        if (!(error instanceof SessionCapacityError)) throw error
        spec.audit?.('login.fail', { remote, via: 'token', reason: 'session-capacity' })
        sendText(res, 429, 'too many devices\n', { 'retry-after': '10' })
        return
      }
      if (usedInvite) spec.inviteStore?.bindSession?.(inviteCode, session.id)
    }
    spec.audit?.('login.ok', {
      remote,
      sessionId: session.id,
      status: session.status,
      via: usedInvite ? 'invite' : 'token',
      ...(consumed?.retry === true ? { retry: true } : {}),
    })
    const secure = cookieIsSecure(req, spec)
    redirect(res, session.status === 'pending'
      ? waitPagePath(session.id)
      : form.get('next') === 'home' ? HOME_PATH : '/', {
      'set-cookie': sessionCookie(spec.cookieName, encodeSessionCookie(session.id, session.secret), {
        maxAgeSeconds: spec.sessionMaxAgeSeconds,
        secure,
      }),
      'referrer-policy': 'no-referrer',
    })
  } catch {
    if (reserved) spec.loginTracker.fail(effectiveRemoteAddress(req, spec))
    sendHtml(res, 400, loginPage(locale, LOGIN_COPY[locale].invalidRequest), GATE_PAGE_HEADERS)
  }
}
```

</details>

**依据 4 · 源码核查**：[src/config.ts:40-43](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/config.ts#L40-L43)

approvalMode默认false。

```text
  upgradeMaxAttempts: Schema.number().min(1).default(10).description('Failed WebSocket upgrade attempts per remote IP before that IP is locked out.'),
  upgradeLockoutSeconds: Schema.number().min(10).default(300).description('Lockout duration for a remote IP that exceeded upgradeMaxAttempts.'),
  approvalMode: Schema.boolean().default(false).description('Require local approval for every new device before it can reach DeepSeek Harness.'),
  maxSessions: Schema.number().min(1).max(64).default(16).description('Maximum concurrent device sessions; the stalest session is evicted past this cap.'),
```

**依据 5 · 源码核查**：[src/sessions.ts:252-271](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/sessions.ts#L252-L271)

有效/到期/status和IP变化处理。

<details>
<summary>查看原文（20行）</summary>

```text
    /** Validate a device cookie; undefined when unknown, revoked, or expired. */
    validate(cookieValue: string | undefined, ip?: string) {
      const session = find(cookieValue)
      if (session === undefined) return undefined
      if (expired(session)) {
        sessions.delete(session.id)
        changed()
        return undefined
      }
      if (session.status !== 'active') return undefined
      // A changed source IP is security-relevant: record it immediately,
      // outside the lastSeen throttle.
      if (ip !== undefined && ip !== '' && session.lastSeenIp !== ip) {
        session.lastSeenIp = ip
        changed()
      }
      touch(session)
      return publicShape(session)
    },

```

</details>

**依据 6 · 源码核查**：[src/control-routes.ts:160-175](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/control-routes.ts#L160-L175)

实际socket/header/origin管理门禁。

<details>
<summary>查看原文（16行）</summary>

```text

  const handle = async (req: IncomingMessage, res: ServerResponse) => {
    if (!isLoopbackHost(req.socket.remoteAddress ?? '')) {
      sendJson(res, 403, { error: 'loopback-required' })
      return
    }
    const handler = routes.get(`${req.method} ${pathnameOf(req.url)}`)
    if (handler === undefined) {
      sendJson(res, 404, { error: 'not-found' })
      return
    }
    if (req.headers[CONTROL_HEADER] !== CONTROL_HEADER_VALUE || !isLoopbackOrigin(req.headers.origin)) {
      sendJson(res, 403, { error: 'forbidden' })
      return
    }
    await handler(req, res)
```

</details>

**依据 7 · 源码核查**：[src/index.ts:541-562](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/index.ts#L541-L562)

撤销required保存失败还原、成功切连接。

<details>
<summary>查看原文（22行）</summary>

```text
    listSessions: async () => {
      await load()
      return sessionStore!.list()
    },
    mutateSession: (action, id, label) => exclusive(async () => {
      await load()
      const previousSessions = sessionStore!.serialize()
      const ok = action === 'approve'
        ? sessionStore!.approve(id)
        : action === 'revoke'
          ? sessionStore!.revoke(id)
          : sessionStore!.rename(id, label)
      if (ok) {
        try {
          await save({ required: true })
        } catch (error) {
          sessionStore!.hydrate(previousSessions)
          throw error
        }
        if (action === 'revoke') bound?.closeSession(id)
        void audit.record(`session.${action}`, { id })
      }
```

</details>

**依据 8 · 源码核查**：[src/persist.ts:108-116](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/persist.ts#L108-L116)

实际0600临时写和rename。

```text
export async function writeState(path: string, state: PersistedState): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  const temporary = `${path}.${process.pid}.${Date.now()}.tmp`
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  })
  await rename(temporary, path)
}
```

**依据 9 · 源码核查**：[src/index.ts:197-218](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/index.ts#L197-L218)

保存失败blocked与required抛错。

<details>
<summary>查看原文（22行）</summary>

```text
  const save = async (options: { required?: boolean } = {}): Promise<boolean> => {
    if (state === undefined) return false
    if (statePersistenceBlocked) {
      if (options.required === true) throw new Error('reverse-proxy: durable state is unavailable')
      return false
    }
    try {
      await writeState(statePath, {
        enabled: state.enabled,
        accessToken: state.accessToken,
        sessions: sessionStore!.serialize(),
        ...(state.listenHost !== undefined ? { listenHost: state.listenHost } : {}),
        ...(state.listenPort !== undefined ? { listenPort: state.listenPort } : {}),
      })
      return true
    } catch (error) {
      warn(error)
      statePersistenceBlocked = true
      if (options.required === true) throw new Error('reverse-proxy: durable state write failed', { cause: error })
      return false
    }
  }
```

</details>

**依据 10 · 源码核查**：[src/index.ts:399-429](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/index.ts#L399-L429)

轮换清session/停监听与失败恢复。

<details>
<summary>查看原文（31行）</summary>

```text
  const rotateToken = async () => {
    await load()
    const restart = bound !== undefined
    const wasTunnel = tunnelLive()
    const previousToken = state!.accessToken
    const previousSessions = sessionStore!.serialize()
    await teardown()
    state!.accessToken = generateAccessToken()
    // Rotation invalidates every device: sessions are independent of the
    // token, so they must be revoked explicitly.
    sessionStore!.clear()
    inviteStore.clear()
    try {
      await save({ required: true })
    } catch (error) {
      state!.accessToken = previousToken
      sessionStore!.hydrate(previousSessions)
      // The listener is already down, and the failed write marked durable
      // state unavailable so start() would refuse ('state-invalid'). Record
      // WHY the entry went dark instead of leaving a silent stop behind.
      lastFailure = 'rotate-save-failed'
      void audit.record('token.rotate-failed')
      throw error
    }
    void audit.record('token.rotate')
    ctx.logger.info('reverse-proxy: access token rotated')
    if (restart) await start()
    await restartTunnelIfLive(wasTunnel)
    return { ...(await snapshot()), accessToken: state!.accessToken }
  }

```

</details>

#### 缺口

- 真设备失窃/NAT/反代头信任及磁盘错误的端到端撤销尚未测。
  **影响**：源码防线不等设备/网络治理已完成。
  **进一步探讨**：测试同IP邀请重用、撤销活WS/HTTP、写盘失败和重启，确认状态与提示一致。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 远程答复真的到宿主吗，断线和性能/退出如何验？

**研究主题**：采用判断、效果与总成本

#### 完整回答

任务控制台从宿主sessions/uiSession注册表投影，回答前重新collect并核key/kind，然后调用原pending对象answer/dismiss，而非本地模拟完成。overlay在connected前拒答；每挂载卡用ref锁一次提交，10秒未完成标uncertain，失败也保持锁，不自动重放，完成由上游注册表移除确认。重新挂载/多设备及Host竞态仍由上游域负责，非跨设备幂等事务；dismiss有时仅离开composer，并非取消后台请求/Agent。

可选quick tunnel会找PATH/cache或下载cloudflared，再spawn实际子进程；stop中断下载、kill并超时SIGKILL，代理dispose teardown并保存/flush，停访问不会撤销已被宿主接受的批准或工具副作用。正式网络治理不能由临时URL替代，停隧道也需确认外部自带通道。

作者基准原始transport/polling/session JSON均在固定树，摘要hash与实际文件匹配；本研究只读其方法/字段/摘要与hash，不重跑测量或逐轮重算。其loopback HTTP与模拟时钟React数据支持特定缓存/轮询观察，非真实手机延迟/电耗/业务节时。机器/网络/隧道、模型token、维护和误授权恢复金额未知，不能填0。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/pending-source.ts:287-318](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/client/pending-source.ts#L287-L318)

真实注册表重核、answer/dismiss调用及语义。

<details>
<summary>查看原文（32行）</summary>

```text
    answerApproval: async (key, outcome) => {
      // Fence stale device UI against the latest local registry; never replay.
      collect()
      const wait = waits.get(key)
      if (wait === undefined || wait.kind !== 'approval') {
        throw new Error('approval is no longer pending')
      }
      await (wait as PendingApproval).answer(outcome)
    },
    answerQuestion: async (key, answer) => {
      // Fence stale device UI against the latest local registry; never replay.
      collect()
      const wait = waits.get(key)
      if (wait === undefined || wait.kind === 'approval') {
        throw new Error('question is no longer pending')
      }
      await (wait as PendingQuestion).answer(answer)
    },
    cancelQuestion: async (key) => {
      // Fence stale device UI against the latest local registry; never replay.
      collect()
      const wait = waits.get(key)
      if (wait === undefined || wait.kind === 'approval') {
        throw new Error('question is no longer pending')
      }
      // 0.2 semantics: a tool-call-keyed card only leaves the composer seat
      // (the request stays answerable from its tool call row); an unnamed
      // card ends the request. Both are the official dismiss behavior.
      await (wait as PendingQuestion).dismiss()
    },
  }
}
```

</details>

**依据 2 · 源码核查**：[src/client/InteractionOverlay.tsx:101-112](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/client/InteractionOverlay.tsx#L101-L112)

connected答复门禁。

<details>
<summary>查看原文（12行）</summary>

```text
  const state = useRemotePending(snapshot => snapshot)
  if (!(enabled ?? autoEnabled)) return null
  const guard = async (operation: () => Promise<void>) => {
    if (connection?.getSnapshot().state !== 'connected') throw new Error(t('cockpit.offlineHint'))
    await operation()
  }
  return <RemoteCockpit state={state} connection={connection} t={t}
    canOpenSession={canOpenSession} openSession={openSession}
    renderItem={item => <InteractBody item={item} t={t} openSession={openSession} canOpenSession={canOpenSession}
      answerApproval={(key, outcome) => guard(() => answerApproval(key, outcome))}
      answerQuestion={(key, answer) => guard(() => answerQuestion(key, answer))}
      cancelQuestion={key => guard(() => cancelQuestion(key))} />} />
```

</details>

**依据 3 · 源码核查**：[src/client/use-interaction-submission.ts:14-56](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/client/use-interaction-submission.ts#L14-L56)

实际一次提交锁/10秒uncertain/不解锁重放。

<details>
<summary>查看原文（43行）</summary>

```text
/** One attempt per mounted pending card; only registry removal confirms its outcome. */
export function useInteractionSubmission(t: ReverseProxyTranslate): InteractionSubmission {
  const locked = useRef(false)
  const mounted = useRef(false)
  const [busy, setBusy] = useState<SubmissionKind>()
  const [error, setError] = useState<string>()
  const [noticeKey, setNoticeKey] = useState<NoticeKey>()

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  useEffect(() => {
    if (busy === undefined) return
    const timer = setTimeout(() => {
      if (mounted.current) setNoticeKey('cockpit.uncertain')
    }, 10_000)
    return () => { clearTimeout(timer) }
  }, [busy])

  const run = useCallback((kind: SubmissionKind, operation: () => Promise<void>) => {
    // State updates are batched: the ref must fence a second click immediately.
    if (!mounted.current || locked.current) return
    locked.current = true
    setBusy(kind)
    void (async () => {
      try {
        await operation()
        if (!mounted.current) return
        // A late acknowledgement cannot override an already uncertain result.
        setNoticeKey(previous => previous === 'cockpit.uncertain' ? previous : 'cockpit.confirming')
      } catch (cause) {
        if (!mounted.current) return
        setError(cause instanceof Error ? cause.message : String(cause))
        setNoticeKey('cockpit.uncertain')
      }
      // Never unlock, replay, or retry. The parent registry owns card removal.
    })()
  }, [])

  return { busy, error, notice: noticeKey === undefined ? undefined : t(noticeKey), run }
}
```

</details>

**依据 4 · 源码核查**：[src/tunnel.ts:251-276](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/tunnel.ts#L251-L276)

寻找/下载后真实spawn cloudflared。

<details>
<summary>查看原文（26行）</summary>

```text
    const onPath = await findOnPath('cloudflared')
    if (onPath !== undefined) return onPath
    if (await cachedBinaryIsValid()) return cachedBin
    const spec = assets[`${process.platform}-${process.arch}`]
    if (spec === undefined) throw new TunnelError('unsupported-platform')
    setStage('downloading')
    return download(spec)
  }

  const spawnTunnel = (gen: number, bin: string) => {
    let spawned: ChildProcess
    // ChildProcess streams may split a URL across arbitrary chunk boundaries.
    // Keep only a small rolling tail: enough to join a log line without
    // allowing noisy cloudflared output to grow this buffer indefinitely.
    let logTail = ''
    try {
      spawned = spawnFn(bin, ['tunnel', '--url', options.target(), '--no-autoupdate'], {
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    } catch {
      fail('spawn-failed')
      return
    }
    child = spawned
    const onData = (chunk: Buffer) => {
      if (gen !== generation || state !== 'starting') return
```

</details>

**依据 5 · 源码核查**：[src/tunnel.ts:341-361](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/tunnel.ts#L341-L361)

停止下载/kill及SIGKILL。

<details>
<summary>查看原文（21行）</summary>

```text
    },
    async stop() {
      const wasActive = state === 'starting' || state === 'online'
      generation += 1
      clearConnectTimer()
      downloadAbort?.abort()
      downloadAbort = undefined
      const current = child
      child = undefined
      if (current !== undefined) {
        const exited = new Promise<void>(resolve => current.once('exit', () => resolve()))
        current.kill()
        const grace = new Promise<void>(resolve => {
          const timer = setTimeout(resolve, 3_000)
          timer.unref?.()
        })
        await Promise.race([exited, grace])
        if (current.exitCode === null && current.signalCode === null) current.kill('SIGKILL')
      }
      state = 'off'
      publicUrl = undefined
```

</details>

**依据 6 · 源码核查**：[src/index.ts:592-603](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/index.ts#L592-L603)

卸载teardown/保存/审计flush。

<details>
<summary>查看原文（12行）</summary>

```text
    dispose: () => exclusive(async () => {
      disposed = true
      if (saveTimer !== undefined) {
        clearTimeout(saveTimer)
        saveTimer = undefined
      }
      await teardown()
      await save()
      // Events recorded during teardown (tunnel.stop, ...) are queued async;
      // flush before the process can exit so the last audit lines survive.
      await audit.flush()
    }),
```

</details>

**依据 7 · 作者声明**：[docs/performance-benchmark.zh.md:14-32](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/docs/performance-benchmark.zh.md#L14-L32)

作者测量方法、限制与原件hash。

<details>
<summary>查看原文（19行）</summary>

```text
## 1. 基线、环境和原始结果

- 基线：Git 0d4b48c8837ac4b11f3c477b1c04bde46c75f5d6；用 git archive 提取未经改写的旧源码，**不是将新版的压缩/缓存开关关闭来伪造旧版**。
- 当前版：随 **0.5.0 正式版**发布的传输优化实现；结果来自发布前保留的测量记录，没有为 benchmark 修改产品逻辑，也未因文档版本更新重新测量。精确的受测源码与资源 SHA-256 见原始 transport 记录；不以版本号代替受测字节身份。
- 环境：Apple M5 Pro / arm64 / macOS 内核 Darwin 27.0.0 / Node v26.12.0。
- HTTP：同一台机器的 loopback HTTP/1.1，串行请求，每次新建下游 TCP。没有 TLS、Cloudflare、移动网络、浏览器缓存或页面渲染。
- 15 个计入统计的配对轮次，另外 2 轮预热不计；3 个变体的顺序轮换并反转。所有字节有解码一致性断言，冷热回源数、编码选择也有断言。
- HTTP 资源来自本机真实 Harness frontend dist 的 index.html、2 个入口 JS、2 个 CSS：共 **1,480,308 B**。并非高重复填充文本，也不包含所有字体/懒加载资源。
- 另加 7,314 B **合成 JSON** 作为不缓存的负对照，不冒充实际聊天/会话 API 样本。
- 归档原始记录：[transport.json](./benchmarks/v0.5.0/transport.json)（逐轮数据、源码/资源 SHA-256、编码实测）、[polling.json](./benchmarks/v0.5.0/polling.json)（逐请求起止事件）、[session.json](./benchmarks/v0.5.0/session.json)（5 轮行为观测）。
- 易读汇总：[summary.json](./benchmarks/v0.5.0/summary.json)。这些是 0.5.0 的固定测量归档，不是动态读取本机结果。复现脚本仍生成 output/benchmarks/{transport,polling,session,summary}.json；output 是忽略目录，复现结果不会自动替换发布归档。

归档 summary 记录的原始文件 SHA-256（保留原值）：

| 原始文件 | SHA-256 |
|---|---|
| transport.json | `abd96d2545718ad301ec3bebdd918858fe98613989d336d78cbdff8baa0b1bec` |
| polling.json | `c2eb464283c2b82703814e3bfc6ffa8c2aac1613c72edebaea18b074ae957848` |
| session.json | `c6cbf0819a329c6777fd06ab1fdc61b75a57544be1a182a257dbe929f0384cb3` |
```

</details>

**依据 8 · 作者声明**：[docs/benchmarks/v0.5.0/summary.json:1-35](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/docs/benchmarks/v0.5.0/summary.json#L1-L35)

作者15轮/原始hash与首项测量元数据。

<details>
<summary>查看原文（35行）</summary>

```text
{
  "schemaVersion": 1,
  "baselineRevision": "0d4b48c8837ac4b11f3c477b1c04bde46c75f5d6",
  "node": "v26.12.0",
  "environment": {
    "platform": "darwin",
    "release": "27.0.0",
    "arch": "arm64",
    "cpu": "Apple M5 Pro"
  },
  "measuredRounds": 15,
  "assetRepeatsPerRound": 10,
  "artifactSha256": {
    "transport": "abd96d2545718ad301ec3bebdd918858fe98613989d336d78cbdff8baa0b1bec",
    "polling": "c2eb464283c2b82703814e3bfc6ffa8c2aac1613c72edebaea18b074ae957848",
    "session": "c6cbf0819a329c6777fd06ab1fdc61b75a57544be1a182a257dbe929f0384cb3"
  },
  "httpMeasurement": "per paired round; networkMs sums sequential request issue-to-response-end times; excludes decode/assert, browser rendering and TCP/IP/TLS framing",
  "http": {
    "cold": {
      "baseline": {
        "requests": 5,
        "bodyBytes": 415637,
        "responseHttpBytes": 417406,
        "requestHttpBytes": 945,
        "upstreamRequests": 5,
        "upstreamBodyBytes": 1480308,
        "networkMs": {
          "median": 42.083416000003126,
          "p95": 45.60116800000014,
          "min": 38.45274900000095,
          "max": 45.60116800000014
        },
        "wallMs": {
          "median": 44.19929200000115,
```

</details>

#### 缺口

- 真实Host答复竞争、多设备/重挂载与手机性能/撤销恢复未验。
  **影响**：静态能跟至官方域调用，不代表运行提交正确或所有重发被禁。
  **进一步探讨**：在隔离Host模拟双设备同卡、断网后答复、超时与撤销；检查业务状态再决定重试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 值得生产化的方向是什么？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

独立假设：在完整管理员远程代理之外，提供仅特定会话/特定审批任务、短期可撤的能力票据，明确主体/操作/结果不明回执并需要时回本机提升权限，可能比把整套宿主开放给设备更易部署。这是未实现方向，不把当前设备secret当细粒度授权。

对照现有完整代理，在测试Host上验会话越界、凭据/目录API拒绝、到期/revoke对活连接、双设备同审批与断网；记录误授权、响应耗时、找回成本和维护人工。若缩权不能降低误授权/恢复负担或阻碍目标任务显著，则停止。当前只建议可丢弃宿主/可信个人设备的受限试用，含生产凭据的长期暴露先观察。

#### 证据与依据

**依据 1 · 源码核查**：[src/proxy.ts:980-998](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/proxy.ts#L980-L998)

当前有效设备直接转发非管理路径。

<details>
<summary>查看原文（19行）</summary>

```text
      sendText(res, 403, 'forbidden\n')
      return
    }
    const session = runtimeSpec.sessionStore.validate(cookie, effectiveRemoteAddress(req, runtimeSpec))
    if (session === undefined) {
      drainRequest(req)
      if (req.method === 'GET' || req.method === 'HEAD') {
        redirect(res, LOGIN_PATH)
      } else {
        res.writeHead(401, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end('{"error":"authentication-required"}\n')
      }
      return
    }
    proxyRequest(req, res, runtimeSpec, session.id)
  }

  const serverOptions = {
    maxHeaderSize: spec.maxHeaderSizeBytes ?? 16 * 1024,
```

</details>

**依据 2 · 源码核查**：[src/proxy-headers.ts:113-123](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/proxy-headers.ts#L113-L123)

当前回环头/宿主cookie信任转换。

<details>
<summary>查看原文（11行）</summary>

```text
  const sourceHost = req.headers.host ?? ''
  const remote = req.socket.remoteAddress ?? ''
  const proto = requestIsHttps(req, options.tls === true, options.trustForwardedProto === true) ? 'https' : 'http'
  headers.host = backendHost
  headers.origin = `http://${backendHost}`
  headers['sec-fetch-site'] = 'same-origin'
  headers['x-forwarded-for'] = options.forwardedFor ?? remote
  headers['x-forwarded-host'] = sourceHost
  headers['x-forwarded-proto'] = proto
  headers['x-dsh-reverse-proxy'] = '1'
  if (options.upstreamCookie !== undefined) headers.cookie = options.upstreamCookie
```

</details>

**依据 3 · 源码核查**：[src/client/pending-source.ts:287-315](https://github.com/JUANWANG-BUAA/dsh-full-remote/blob/0c24350d264b0f40ff851fb32b5005691a656e75/src/client/pending-source.ts#L287-L315)

已有任务key重核可作缩权起点但非授权票据。

<details>
<summary>查看原文（29行）</summary>

```text
    answerApproval: async (key, outcome) => {
      // Fence stale device UI against the latest local registry; never replay.
      collect()
      const wait = waits.get(key)
      if (wait === undefined || wait.kind !== 'approval') {
        throw new Error('approval is no longer pending')
      }
      await (wait as PendingApproval).answer(outcome)
    },
    answerQuestion: async (key, answer) => {
      // Fence stale device UI against the latest local registry; never replay.
      collect()
      const wait = waits.get(key)
      if (wait === undefined || wait.kind === 'approval') {
        throw new Error('question is no longer pending')
      }
      await (wait as PendingQuestion).answer(answer)
    },
    cancelQuestion: async (key) => {
      // Fence stale device UI against the latest local registry; never replay.
      collect()
      const wait = waits.get(key)
      if (wait === undefined || wait.kind === 'approval') {
        throw new Error('question is no longer pending')
      }
      // 0.2 semantics: a tool-call-keyed card only leaves the composer seat
      // (the request stays answerable from its tool call row); an unnamed
      // card ends the request. Both are the official dismiss behavior.
      await (wait as PendingQuestion).dismiss()
```

</details>

#### 缺口

- 任务级能力票据收益/兼容性未验证。
  **影响**：不计作已实现业务/技术创新。
  **进一步探讨**：故障与权限对照测净收益，并明确停止条件。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
