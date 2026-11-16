# dsh-proxy

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[36954a3](https://github.com/smanx/dsh-proxy/tree/36954a30af329f4f4d54b6961c75f018e93eb873)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/smanx/dsh-proxy) [![npm 30d 1,021](https://img.shields.io/static/v1?label=npm+30d&message=1%2C021&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@smanx/dsh-proxy) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@smanx/dsh-proxy)
<!-- END META -->

> **功能**：为 DSH Web 提供带认证的局域网反向代理入口。

> **亮点**：插件用当前 webServer 端口定位上游，转发 HTTP 与 WebSocket，并通过 Connection RPC 把启动、状态和关停放进 DSH Web 设置。技术增量主要是宿主内的管理接线，局域网可达性源自既有代理机制。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：固定默认在所有 IPv4 接口起 HTTP 监听，代理自身认证缺省关闭。试用仍要核对上游令牌、本地配置文件和状态 RPC 的密码访问范围。[Q03](#research-q03)

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
  - [Q01 · 它针对什么访问限制，相对直接绑定局域网地址或独立代理有什么增量？](#detail-section-11)
  - [Q02 · 代理怎样认证并转发 HTTP/WebSocket？免 token 路径如何工作？](#detail-section-12)
  - [Q03 · 凭据、信任围栏与失败行为有哪些关键限制？](#detail-section-13)
  - [Q04 · 部署和运维要承担哪些成本，适合怎样试用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望在同一局域网其他设备访问 DSH Web 的用户。DSH Web 拒绝直接将服务绑定为 0.0.0.0；插件单独监听 LAN 端口并反代至 loopback，还改写 Host/Origin、处理 WebSocket 和安全上下文差异。相比独立 dsh-proxy，贡献是宿主设置卡片、启动/停止与 profile 配置集成；开放 LAN 访问并不天然安全。

在原设备使用 DSH 回环页面无需第二个监听端口。需要跨设备时，可用可信 VPN 或独立反向代理处理 HTTP 和 WebSocket，再单独配置鉴权和生命周期。固定包的比较点在宿主设置集成，未测相同网络和设备的操作差异。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
| --- | --- | --- |
| HTTP 与 WebSocket 转发 | 从第二设备访问原宿主 | 独立监听，转发至已配置的 DSH 上游 |
| 浏览器密码挑战 | 过滤普通 HTTP 和升级连接 | 两项非空才启用，指定静态资源有豁免 |
| 代理设置与启停 | 调端口、凭据和运行状态 | 借 Connection RPC，回复停止后需实际复查端口 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH webServer 与 Connection | 按实际监听端口定位回环上游、挂载设置 RPC | 宿主接口或启动顺序不兼容时无法验证入口 |
| 独立代理端口与私网规则 | 仅把入口开放给选定设备 | 默认 3081 和所有 IPv4 接口，必须审查有效配置 |
| 两项 Basic Auth 凭据 | 挑战普通 HTTP 请求与 WebSocket 升级 | 缺一项即停用代理认证，HTTP 不负责链路加密 |

| 阶段 | 操作 | 异常与退出 |
| --- | --- | --- |
| 准备 | 在回环或可信隔离网络设置监听、上游、两项测试凭据，保持免令牌关闭 | 端口冲突时保留宿主直连并查看启动失败回执 |
| 访问 | 正常浏览器凭宿主令牌连接，另测错误密码和 WebSocket | 核对局域网只有受信设备可达 |
| 退出 | 在设置页停止，稍候从第二设备复查端口和已有连接 | 仍可达时卸载并回到回环 |

**效果与成本**

| 阶段 | 现金与资源 | 人工投入 | 未知 |
| --- | --- | --- | --- |
| 配置 | 增加单独的监听端口 | 配置私网规则、测试凭据和上游 | 跨设备连通与版本兼容未测 |
| 持续 | 转发、压缩改写与可选额外上游探测消耗资源 | 维护浏览器鉴权和轮换测试凭据 | 未量化转发延迟、带宽和人工时间 |
| 恢复 | 异常会增加重启代理和端口占用排查 | 核对监听、旧连接和密码设置文件 | 关闭后实际资源释放待实测 |

| 效果项 | 当前源码可支持 | 未验证项 |
| --- | --- | --- |
| 第二设备访问原 DSH 页面 | 代码复用回环上游并处理 HTTP 与 WebSocket | 无宿主、浏览器或设备组合的连通结果 |
| 管理可见性 | Connection RPC 区分启动失败与预计停止，并回报配置状态 | 实际停止要另查端口与升级连接 |

> **思考**：固定默认在所有 IPv4 接口起 HTTP 监听，代理自身认证缺省关闭。试用仍要核对上游令牌、本地配置文件和状态 RPC 的密码访问范围。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：插件用当前 webServer 端口定位上游，转发 HTTP 与 WebSocket，并通过 Connection RPC 把启动、状态和关停放进 DSH Web 设置。技术增量主要是宿主内的管理接线，局域网可达性源自既有代理机制。[Q01](#research-q01) [Q02](#research-q02)

启动时按 webServer 端口推导上游，启动失败通过结果返回。停止 RPC 先回复后调用关闭，代理另跟踪已升级套接字并主动销毁。设置覆盖 JSON 与状态 RPC 都会保留密码原值，宿主及文件访问范围是独立的安全边界。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

固定默认在所有 IPv4 接口起 HTTP 监听，代理自身认证缺省关闭。试用仍要核对上游令牌、本地配置文件和状态 RPC 的密码访问范围。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

限可信隔离网或先在回环做演练，固定入口、设置两项测试凭据，保留上游令牌，用第二设备检查无效凭据拒绝、WebSocket 和实际关停。无法确认网络边界、凭据访问范围或关停时，卸载插件并回到宿主回环访问。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持 HTTP 与 WebSocket 转发、两字段密码挑战和条件式令牌兑换。实际跨设备连通、鉴权效果、代理开销和退出残留待验证。

- 已检查：作者 README、包清单、源码路径 dsh-proxy/README.zh.md、dsh-proxy/src/index.ts、dsh-proxy/src/proxy.ts、dsh-proxy/src/tokenretry.ts、dsh-proxy/src/session.ts、dsh-proxy/src/controller.ts、dsh-proxy/src/settings.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 smanx/dsh-proxy (root) 的固定提交、README/manifest、入口和直接调用的关键模块；未安装或执行目标插件、宿主、浏览器、模型/API或第三方服务。
- 下一步：在受控网络从一台第二设备访问测试配置，分别发送无凭据、错误凭据和合法的 HTTP 及 WebSocket 请求。成功样本须能打开已知 DSH 页面并建立会话连接。停止后用同一设备复查端口，记录延迟、设置回退和验证失败后恢复时间。[Q04](#research-q04)

**分析版本**

- **仓库**：[smanx/dsh-proxy](https://github.com/smanx/dsh-proxy)
- **版本号**：0.1.7（[固定提交 36954a3](https://github.com/smanx/dsh-proxy/tree/36954a30af329f4f4d54b6961c75f018e93eb873)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在相同可信网络中，将代理状态和启停置于宿主设置，可能比单独维护代理减少配置失配与关闭后仍开放。对照同一设备、端口约束和鉴权要求，记录成功连接、配置步数、退出后残留及恢复时间；异常未减少则保留独立代理管理方式。[Q04](#research-q04)

在受控网络从一台第二设备访问测试配置，分别发送无凭据、错误凭据和合法的 HTTP 及 WebSocket 请求。成功样本须能打开已知 DSH 页面并建立会话连接。停止后用同一设备复查端口，记录延迟、设置回退和验证失败后恢复时间。[Q04](#research-q04)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 859 | — | — | 11844 |
| .mjs | source | 2 | 345 | 213 | 114 | — |
| .js | source | 5 | 1504 | 1341 | 166 | — |
| .cjs | source | 1 | 3594 | 3308 | 292 | — |
| .ts | source | 14 | 2101 | 1331 | 676 | — |
| .tsx | source | 1 | 397 | 329 | 44 | — |
| .ts | test | 8 | 1642 | 1347 | 154 | — |
| .tsx | test | 1 | 409 | 345 | 16 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-16），可前往 [GitHub Issues](https://github.com/smanx/dsh-proxy/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：局域网设备能否经受控反向代理访问 DSH Web，同时让认证、令牌和信任边界保持可解释？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它针对什么访问限制，相对直接绑定局域网地址或独立代理有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向希望在同一局域网其他设备访问 DSH Web 的用户。DSH Web 拒绝直接将服务绑定为 0.0.0.0；插件单独监听 LAN 端口并反代至 loopback，还改写 Host/Origin、处理 WebSocket 和安全上下文差异。相比独立 dsh-proxy，贡献是宿主设置卡片、启动/停止与 profile 配置集成；开放 LAN 访问并不天然安全。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-proxy/README.zh.md:1-14](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/README.zh.md#L1-L14)

项目说明局域网场景、Basic Auth 默认关闭、免 token 默认关闭及官方拒绝直绑的背景。

<details>
<summary>查看原文（14行）</summary>

```text
# dsh-proxy

DSH 插件：把 DeepSeek Harness Web 界面（默认 `127.0.0.1:3080`）转发到**另一个带认证的端口**，让同一局域网内的其他设备也能安全访问。

- **HTTP + WebSocket 全协议转发**：任务状态、日志等实时推送不失效
- **原生 Basic Auth（默认关闭）**：与独立版 dsh-proxy 一致，使用**浏览器自带的认证弹窗**，没有自绘登录页、没有会话 Cookie——默认用户名与密码均为空，局域网**开放访问**；在设置页**同时设置**用户名和密码后启用，外部访问时浏览器弹出原生 Basic Auth 登录框，成功后浏览器缓存凭据自动登录（含 WebSocket 握手）
- **设置页面**：DSH 设置 → 「局域网代理」，显示监听端口/默认服务端口/**密码登录是否启用**/**免 token 登录是否启用**，可修改代理监听端口、用户名、密码、免 token 登录开关，可**启动/停止**代理，保存后自动重启转发服务（持久化到 `$DSH_HOME/dsh-proxy.json`）
- **可选的免 token 首次访问（默认关闭）**：DSH 0.2.x 用每进程随机的启动 token 把整个 Web 界面锁起来，而局域网设备根本看不到这个 token，第一次打开只会得到 `401 dsh web authentication required`。打开该开关后，由代理代替浏览器完成 token→cookie 兑换，之后每次访问都不再需要 token。默认关闭，因为它会让代理端口成为唯一闸门（见「免 token 首次访问」）。
- **开箱即通的兼容修复**：`Host`/`Origin` 改写（通过 DSH `/api` 同源信任篱笆，LAN 访问不 403）、`crypto.randomUUID` polyfill 注入（LAN 非安全上下文下前端 RPC 可用）
- **随 `dsh web` 启停**：无需单独进程，配置改在 profile 的 `cordis.patch.yml`

> 为什么需要它：DSH Web 服务端**故意拒绝** `--host 0.0.0.0`（避免把 RCE 直接暴露到网络），本插件是官方认可的"出网"方式——独立监听端口 + 认证 + 反代回 loopback。
>
> 独立版（Go/Node 单文件，不依赖 DSH）见 <https://github.com/smanx/dsh-proxy>；本插件是它的集成版，认证方式与独立版一致（原生 Basic Auth）。
```

</details>

**依据 2 · 源码核查**：[dsh-proxy/src/index.ts:31-53](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/index.ts#L31-L53)

插件声明、宿主服务依赖及配置字段。

<details>
<summary>查看原文（23行）</summary>

```text
export const name = '@smanx/dsh-proxy'

/** Services required before load: the web server (upstream port source) and the Connection RPC registry. */
export const inject = ['webServer', 'connection']

/** Plugin configuration, validated at load by the Loader. */
export interface Config {
  /** Interface the proxy binds; 0.0.0.0 exposes the LAN. */
  listenHost: string
  /** Port the proxy listens on (must differ from the web app's port). */
  listenPort: number
  /** Upstream DSH bind host. */
  upstreamHost: string
  /** Upstream DSH port; 0 follows the web app's actual bound port. */
  upstreamPort: number
  /** Login / Basic Auth username; password login is enabled only when both it and `password` are set. */
  username: string
  /** Login / Basic Auth password; password login is enabled only when both it and `username` are set. */
  password: string
  /** Auto-attach the launch token on 401 (off by default). */
  skipLaunchToken: boolean
}

```

</details>

**依据 3 · 源码核查**：[dsh-proxy/src/proxy.ts:120-135](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/proxy.ts#L120-L135)

反向代理启用 HTTP/WebSocket 并处理上游失败。

<details>
<summary>查看原文（16行）</summary>

```text
  const proxy = httpProxy.createProxyServer({
    target: targetOrigin,
    ws: true,
    changeOrigin: true,
  })
  proxy.on('error', (err, _req, res) => {
    log('error', `upstream ${targetOrigin} error: ${err.message}`)
    if (res && 'writeHead' in res && !res.headersSent) {
      try {
        res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' })
        res.end('502 Bad Gateway')
      } catch {
        /* socket already gone */
      }
    }
  })
```

</details>

#### 缺口

- 未在真实 LAN 设备、TLS/防火墙或宿主版本上验证访问能力和安全效果。
  **影响**：实际可达性与攻击面未知
  **进一步探讨**：在隔离网络中分别测试未授权、Basic Auth、WebSocket 和撤销。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 代理怎样认证并转发 HTTP/WebSocket？免 token 路径如何工作？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host 插件注入 webServer 和 connection，启动代理监听指定接口/端口并转发到 DSH loopback；HTTP 和 WebSocket 共用上游。Basic Auth 只有用户名密码都配置时启用，免 token 功能默认关闭：候选首页请求先探测上游，401 才附 token 完成兑换，其它路径原样转发。还需要 DSH Web 及网络/端口权限；压缩响应需解压改写再重新压缩。

免令牌依赖宿主能返回有效令牌。未取到时控制器给出警告，代理仍保留上游原鉴权。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-proxy/src/index.ts:31-69](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/index.ts#L31-L69)

声明 webServer/connection 与默认关闭的 skipLaunchToken 配置。

<details>
<summary>查看原文（39行）</summary>

```text
export const name = '@smanx/dsh-proxy'

/** Services required before load: the web server (upstream port source) and the Connection RPC registry. */
export const inject = ['webServer', 'connection']

/** Plugin configuration, validated at load by the Loader. */
export interface Config {
  /** Interface the proxy binds; 0.0.0.0 exposes the LAN. */
  listenHost: string
  /** Port the proxy listens on (must differ from the web app's port). */
  listenPort: number
  /** Upstream DSH bind host. */
  upstreamHost: string
  /** Upstream DSH port; 0 follows the web app's actual bound port. */
  upstreamPort: number
  /** Login / Basic Auth username; password login is enabled only when both it and `password` are set. */
  username: string
  /** Login / Basic Auth password; password login is enabled only when both it and `username` are set. */
  password: string
  /** Auto-attach the launch token on 401 (off by default). */
  skipLaunchToken: boolean
}

/** Configuration schema; deployment-varying bounds stay tunable from cordis.yml. */
export const Config = z.object({
  listenHost: z.string().default('0.0.0.0'),
  listenPort: z.natural().max(65535).default(3081),
  upstreamHost: z.string().default('127.0.0.1'),
  upstreamPort: z.natural().max(65535).default(0),
  username: z.string().default(''),
  password: z.string().default(''),
  /**
   * Auto-attach the DSH launch token to requests the upstream rejects with
   * 401, so a first-time LAN browser completes the token→cookie exchange
   * without being handed the token. OFF by default: enabling it removes
   * DSH's token check for the proxied surface, leaving the proxy's Basic Auth
   * (if configured) as the only barrier.
   */
  skipLaunchToken: z.boolean().default(false),
```

</details>

**依据 2 · 源码核查**：[dsh-proxy/src/proxy.ts:120-124](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/proxy.ts#L120-L124)

建立 HTTP/WebSocket 反代。

```text
  const proxy = httpProxy.createProxyServer({
    target: targetOrigin,
    ws: true,
    changeOrigin: true,
  })
```

**依据 3 · 源码核查**：[dsh-proxy/src/proxy.ts:137-169](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/proxy.ts#L137-L169)

免 token 仅在启用时探测上游并在 401 时兑换。

<details>
<summary>查看原文（33行）</summary>

```text
  // Launch-token exchange (opt-in, DSH 0.2.x). DSH gates its whole web surface
  // behind a per-process launch token: a navigation without the token gets
  // `401 dsh web authentication required`, and only `GET /?token=...` can turn
  // that token into a signed cookie. A first-time LAN device therefore has no
  // way in — it never saw the token `dsh web` printed at startup.
  //
  // The fix is a single upstream probe the proxy performs BEFORE forwarding the
  // client's own request. The probe reuses the client's exact path and headers,
  // so whatever DSH answers is what the client would have received:
  //   - 200/303/404/... → forward the client's request untouched (streaming,
  //     no buffering) — this is the normal path and costs nothing extra.
  //   - 401 → the client has no usable session. Append `?token=...` and forward
  //     the client's request; DSH mints the cookie and redirects to `./`, so
  //     the browser lands on the app and keeps the cookie for later requests.
  //
  // Why a probe instead of retrying inside `proxyRes`: http-proxy 1.18 emits
  // `proxyRes` BEFORE it copies the status/headers to `res` and pipes the body,
  // so a retry issued from that handler would still ship the 401 to the browser
  // and then write a second response over a finished socket. Probing keeps the
  // decision entirely on the proxy's side of the wire.
  //
  // The upstream's answer decides, never the headers the client carries, so a
  // stale or foreign `dsh-auth-*` cookie cannot lock a device out (see
  // src/tokenretry.ts for the full reasoning). Only the index GET is a
  // candidate — that is where DSH accepts a token — and a request already
  // carrying one is left exactly as the client sent it. Every other request,
  // and an unreachable upstream, flows through as it would with the feature off.
  const autoLogin = new LaunchTokenAutoLogin({
    upstreamHost,
    upstreamPort,
    launchToken,
    log,
  })
```

</details>

**依据 4 · 源码核查**：[dsh-proxy/src/proxy.ts:171-203](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/proxy.ts#L171-L203)

HTML/JS 内容改写经过压缩感知变换。

<details>
<summary>查看原文（33行）</summary>

```text
  // Inject the randomUUID polyfill into proxied HTML documents, and rewrite
  // served JavaScript so the client treats the authenticated proxy as
  // host-trusted (see clientpatch.ts). The upstream DSH server compresses its
  // responses (gzip by default), so these plain-text rewrites run through a
  // compression-aware pipeline that buffers the response, decompresses by its
  // Content-Encoding, applies the rewrite on the plain text, then recompresses
  // by the original encoding (see compression.ts). content-length is dropped
  // because the rewrite changes the body length; the chunked stream then
  // carries the body.
  proxy.on('proxyRes', (proxyRes, _req, res) => {
    const contentType = String(proxyRes.headers['content-type'] ?? '')
    const isHtml = contentType.includes('text/html')
    const isJs = isJavaScriptContentType(contentType)
    if (!isHtml && !isJs) return

    attachBodyTransform(res, proxyRes, (plain) => {
      const text = plain.toString('utf8')
      // HTML: inject the randomUUID polyfill.
      if (isHtml) {
        return Buffer.from(injectPolyfill(text, RANDOM_UUID_POLYFILL))
      }
      // JS: rewrite the loopback-trust needles (applied unconditionally
      // the Host/Origin rewrite already lets the server-side fence treat
      // proxied traffic as loopback, so withholding only the client-side
      // alignment would leave the UI degraded). Nothing matched means no
      // rewrite needed: return null to passthrough without recompressing.
      const { code, matched } = patchClientScript(text)
      if (matched.length > 0) {
        log('info', `loopback-trust patch applied: ${matched.join(', ')}`)
        return Buffer.from(code)
      }
      return null
    })
```

</details>

**依据 5 · 源码核查**：[dsh-proxy/src/tokenretry.ts:21-35](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/tokenretry.ts#L21-L35)

限制只有 index GET 可携带 launch token，避免其它 URL 泄漏。

<details>
<summary>查看原文（15行）</summary>

```text
 * Only the index request qualifies. DSH accepts the launch token at exactly
 * `GET /` (its `authorizeIndex` requires `pathname === "/"` and a single
 * `token`), so on any other path the token could not mint a cookie even if we
 * sent it — and it would leak the token into URLs, logs, and upstream access
 * records for nothing. Every other request therefore flows through untouched,
 * exactly as it would with the feature off.
 *
 * The decision is made by ASKING THE UPSTREAM, never by guessing from the
 * headers a client happens to carry. An earlier version skipped the probe when
 * the request had any `dsh-auth-*` cookie, treating "carries a session cookie"
 * as "carries a valid session". That is false: DSH's cookie is named
 * `dsh-auth-<base64url(sha256(authority))>` — a name that changes with the
 * upstream port — and its value expires after `cookieMaxAgeDays` or stops
 * verifying when the signing record changes. A browser holding any such cookie
 * (a stale one from an earlier upstream port, an expired one, one signed by a
```

</details>

**依据 6 · 源码核查**：[dsh-proxy/src/session.ts:46-58](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/session.ts#L46-L58)

两个凭据缺任一项时代理自己的认证直接放行。

<details>
<summary>查看原文（13行）</summary>

```text
/** The proxy's gate: Basic Auth only, active when both credentials are set. */
export class Authenticator {
  constructor(readonly config: AuthConfig) {}

  /** Password login is active only when both username and password are set. */
  get enabled(): boolean {
    return this.config.username !== '' && this.config.password !== ''
  }

  isAuthenticated(authorization: string | undefined): boolean {
    if (!this.enabled) return true
    return checkBasicAuth(authorization, this.config.username, this.config.password)
  }
```

</details>

**依据 7 · 源码核查**：[dsh-proxy/src/proxy.ts:226-261](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/proxy.ts#L226-L261)

HTTP 静态资源豁免；其余 HTTP 和升级请求均校验 Basic Auth。

<details>
<summary>查看原文（36行）</summary>

```text
  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url ?? '/', 'http://proxy.local').pathname
    // Public static files (PWA manifest, favicon): fetched without
    // credentials by the browser, so they bypass the auth gate.
    if (PUBLIC_PATHS.has(pathname)) {
      alignOrigin(req)
      proxy.web(req, res)
      return
    }
    if (!auth.isAuthenticated(req.headers.authorization)) {
      challenge(res)
      return
    }
    // With launch-token auto-login off (the default) this is a no-op that
    // returns immediately, so the feature costs one property read per request.
    if (autoLogin.enabled) {
      void autoLogin.grant(req).then(() => {
        alignOrigin(req)
        proxy.web(req, res)
      })
      return
    }
    alignOrigin(req)
    proxy.web(req, res)
  })

  const upgradedSockets = new Set<net.Socket>()
  server.on('upgrade', (req, socket, head) => {
    if (!auth.isAuthenticated(req.headers.authorization)) {
      socket.end(`HTTP/1.1 401 Unauthorized\r\nwww-authenticate: Basic realm="${AUTH_REALM}"\r\nConnection: close\r\n\r\n`)
      return
    }
    upgradedSockets.add(socket as net.Socket)
    ;(socket as net.Socket).once('close', () => upgradedSockets.delete(socket as net.Socket))
    alignOrigin(req)
    proxy.ws(req, socket as Duplex, head)
```

</details>

**依据 8 · 源码核查**：[dsh-proxy/src/controller.ts:95-119](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/controller.ts#L95-L119)

读取不到令牌时报出警告，随后仍可按宿主默认鉴权运行。

<details>
<summary>查看原文（25行）</summary>

```text
  async start(): Promise<StartOutcome> {
    if (this.handle !== null) return { ok: true }
    const log = this.log
    // Resolve the launch token HERE, not at construction: the read is deferred
    // until the harness is serving, and `start()` is the first point where the
    // webServer (and therefore BrowserAuth behind `connection`) is fully up.
    if (this.options.skipLaunchToken === true && this.opts.readLaunchToken !== undefined) {
      const token = this.opts.readLaunchToken()
      if (token === undefined || token === '') {
        log('warn', 'dsh-proxy: skipLaunchToken is on but the host supplied no launch token; the LAN surface still requires DSH authentication')
      } else {
        this.options.launchToken = token
        log('info', 'dsh-proxy: launch-token auto-login enabled — a first-time browser is authenticated without the token')
      }
    }
    const handle = startLanProxy({
      listenHost: this.options.listenHost,
      listenPort: this.options.listenPort,
      upstreamHost: this.options.upstreamHost,
      upstreamPort: this.options.upstreamPort,
      username: this.options.username,
      password: this.options.password,
      launchToken: this.options.launchToken,
      log,
    })
```

</details>

**依据 9 · 源码核查**：[dsh-proxy/src/tokenretry.ts:174-201](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/tokenretry.ts#L174-L201)

只探测合格首页 GET，401 之外的结果或探测失败走普通转发。

<details>
<summary>查看原文（28行）</summary>

```text
  async grant(req: http.IncomingMessage): Promise<void> {
    if (!this.enabled) return
    const url = new URL(req.url ?? '/', 'http://dsh-proxy.local')
    if (!isTokenExchangeCandidate(req.method, url.pathname)) return
    if (carriesToken(url)) return

    // Clone the client's headers so the probe presents the same credentials and
    // negotiation the real request would — but strip the framing headers a
    // body-less GET must not carry, and never answer from a shared cache: the
    // whole point is to observe what THIS client would get right now.
    const browserHeaders: http.IncomingHttpHeaders = { ...req.headers }
    delete browserHeaders['content-length']
    delete browserHeaders['transfer-encoding']
    // The probe is a direct upstream request, so the client's Host (which
    // points at the proxy) must be replaced by the upstream authority — the
    // same one changeOrigin makes for the forwarded request.
    browserHeaders.host = `${this.target.host}:${this.target.port}`
    browserHeaders['cache-control'] = 'no-cache'
    browserHeaders.pragma = 'no-cache'
    let status: number
    try {
      status = await probeStatus(this.target, `${url.pathname}${url.search}`, browserHeaders)
    } catch {
      // Upstream unreachable: stay out of the way and forward normally, so the
      // proxy's own error handler reports the real failure to the client.
      return
    }
    if (status !== 401) return
```

</details>

#### 缺口

- 没有核对目标 DSH 认证实现、上游端口检测和代理配置的实际部署值。
  **影响**：token 兑换/Host 信任若偏差可能暴露 UI
  **进一步探讨**：对当前 DSH 版本用隔离 profile 验证并确认代理监听范围。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 凭据、信任围栏与失败行为有哪些关键限制？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

固定配置缺省绑定 0.0.0.0:3081，并开放浏览器到代理的网络入口，代理 Basic Auth 为关；实际进入 DSH 页面与 WebSocket 仍受宿主认证策略约束。若用户开启自动兑换且读到可用令牌，上游首页令牌门槛可由代理代过，限制主要依赖代理凭据和网络规则。配置卡片需通过宿主 connection 认证路径；上游错误返回 502。响应改写依赖特定客户端代码和 Host/Origin 信任契约，宿主升级可能使补丁失效。

代理使用普通 HTTP，Basic Auth 不提供链路加密。状态 RPC 返回已配置密码，设置 JSON 以原值写盘；能读取 RPC 或文件的主体范围依赖宿主和本地权限，源码未证明隔离。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-proxy/README.zh.md:5-12](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/README.zh.md#L5-L12)

README 明确空用户名/密码时开放、skipLaunchToken 改变信任边界。

```text
- **HTTP + WebSocket 全协议转发**：任务状态、日志等实时推送不失效
- **原生 Basic Auth（默认关闭）**：与独立版 dsh-proxy 一致，使用**浏览器自带的认证弹窗**，没有自绘登录页、没有会话 Cookie——默认用户名与密码均为空，局域网**开放访问**；在设置页**同时设置**用户名和密码后启用，外部访问时浏览器弹出原生 Basic Auth 登录框，成功后浏览器缓存凭据自动登录（含 WebSocket 握手）
- **设置页面**：DSH 设置 → 「局域网代理」，显示监听端口/默认服务端口/**密码登录是否启用**/**免 token 登录是否启用**，可修改代理监听端口、用户名、密码、免 token 登录开关，可**启动/停止**代理，保存后自动重启转发服务（持久化到 `$DSH_HOME/dsh-proxy.json`）
- **可选的免 token 首次访问（默认关闭）**：DSH 0.2.x 用每进程随机的启动 token 把整个 Web 界面锁起来，而局域网设备根本看不到这个 token，第一次打开只会得到 `401 dsh web authentication required`。打开该开关后，由代理代替浏览器完成 token→cookie 兑换，之后每次访问都不再需要 token。默认关闭，因为它会让代理端口成为唯一闸门（见「免 token 首次访问」）。
- **开箱即通的兼容修复**：`Host`/`Origin` 改写（通过 DSH `/api` 同源信任篱笆，LAN 访问不 403）、`crypto.randomUUID` polyfill 注入（LAN 非安全上下文下前端 RPC 可用）
- **随 `dsh web` 启停**：无需单独进程，配置改在 profile 的 `cordis.patch.yml`

> 为什么需要它：DSH Web 服务端**故意拒绝** `--host 0.0.0.0`（避免把 RCE 直接暴露到网络），本插件是官方认可的"出网"方式——独立监听端口 + 认证 + 反代回 loopback。
```

**依据 2 · 源码核查**：[dsh-proxy/src/index.ts:37-69](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/index.ts#L37-L69)

配置 schema 将绑定地址、凭据与免 token 参数设为独立项。

<details>
<summary>查看原文（33行）</summary>

```text
export interface Config {
  /** Interface the proxy binds; 0.0.0.0 exposes the LAN. */
  listenHost: string
  /** Port the proxy listens on (must differ from the web app's port). */
  listenPort: number
  /** Upstream DSH bind host. */
  upstreamHost: string
  /** Upstream DSH port; 0 follows the web app's actual bound port. */
  upstreamPort: number
  /** Login / Basic Auth username; password login is enabled only when both it and `password` are set. */
  username: string
  /** Login / Basic Auth password; password login is enabled only when both it and `username` are set. */
  password: string
  /** Auto-attach the launch token on 401 (off by default). */
  skipLaunchToken: boolean
}

/** Configuration schema; deployment-varying bounds stay tunable from cordis.yml. */
export const Config = z.object({
  listenHost: z.string().default('0.0.0.0'),
  listenPort: z.natural().max(65535).default(3081),
  upstreamHost: z.string().default('127.0.0.1'),
  upstreamPort: z.natural().max(65535).default(0),
  username: z.string().default(''),
  password: z.string().default(''),
  /**
   * Auto-attach the DSH launch token to requests the upstream rejects with
   * 401, so a first-time LAN browser completes the token→cookie exchange
   * without being handed the token. OFF by default: enabling it removes
   * DSH's token check for the proxied surface, leaving the proxy's Basic Auth
   * (if configured) as the only barrier.
   */
  skipLaunchToken: z.boolean().default(false),
```

</details>

**依据 3 · 源码核查**：[dsh-proxy/src/proxy.ts:125-135](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/proxy.ts#L125-L135)

上游代理错误映射为 502。

<details>
<summary>查看原文（11行）</summary>

```text
  proxy.on('error', (err, _req, res) => {
    log('error', `upstream ${targetOrigin} error: ${err.message}`)
    if (res && 'writeHead' in res && !res.headersSent) {
      try {
        res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' })
        res.end('502 Bad Gateway')
      } catch {
        /* socket already gone */
      }
    }
  })
```

</details>

**依据 4 · 源码核查**：[dsh-proxy/src/tokenretry.ts:21-35](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/tokenretry.ts#L21-L35)

令牌不得附加到非首页请求，以避免 URL/日志泄漏。

<details>
<summary>查看原文（15行）</summary>

```text
 * Only the index request qualifies. DSH accepts the launch token at exactly
 * `GET /` (its `authorizeIndex` requires `pathname === "/"` and a single
 * `token`), so on any other path the token could not mint a cookie even if we
 * sent it — and it would leak the token into URLs, logs, and upstream access
 * records for nothing. Every other request therefore flows through untouched,
 * exactly as it would with the feature off.
 *
 * The decision is made by ASKING THE UPSTREAM, never by guessing from the
 * headers a client happens to carry. An earlier version skipped the probe when
 * the request had any `dsh-auth-*` cookie, treating "carries a session cookie"
 * as "carries a valid session". That is false: DSH's cookie is named
 * `dsh-auth-<base64url(sha256(authority))>` — a name that changes with the
 * upstream port — and its value expires after `cookieMaxAgeDays` or stops
 * verifying when the signing record changes. A browser holding any such cookie
 * (a stale one from an earlier upstream port, an expired one, one signed by a
```

</details>

**依据 5 · 源码核查**：[dsh-proxy/src/index.ts:54-69](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/index.ts#L54-L69)

插件默认绑定 0.0.0.0:3081，代理用户名密码默认空，免令牌默认 false。

<details>
<summary>查看原文（16行）</summary>

```text
/** Configuration schema; deployment-varying bounds stay tunable from cordis.yml. */
export const Config = z.object({
  listenHost: z.string().default('0.0.0.0'),
  listenPort: z.natural().max(65535).default(3081),
  upstreamHost: z.string().default('127.0.0.1'),
  upstreamPort: z.natural().max(65535).default(0),
  username: z.string().default(''),
  password: z.string().default(''),
  /**
   * Auto-attach the DSH launch token to requests the upstream rejects with
   * 401, so a first-time LAN browser completes the token→cookie exchange
   * without being handed the token. OFF by default: enabling it removes
   * DSH's token check for the proxied surface, leaving the proxy's Basic Auth
   * (if configured) as the only barrier.
   */
  skipLaunchToken: z.boolean().default(false),
```

</details>

**依据 6 · 源码核查**：[dsh-proxy/src/controller.ts:185-198](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/controller.ts#L185-L198)

状态对象包含配置的用户名和密码；显示探测不代表验证登录。

<details>
<summary>查看原文（14行）</summary>

```text
  status(): LanProxyStatus {
    return {
      listenHost: this.options.listenHost,
      listenPort: this.boundPort ?? this.options.listenPort,
      proxyListening: this.boundPort !== null,
      upstreamHost: this.options.upstreamHost,
      upstreamPort: this.options.upstreamPort,
      upstreamReachable: this.probeCache?.reachable ?? false,
      username: this.options.username,
      password: this.options.password,
      authEnabled: this.options.username !== '' && this.options.password !== '',
      skipLaunchToken: this.options.skipLaunchToken === true,
      persisted: this.persisted(),
    }
```

</details>

**依据 7 · 源码核查**：[dsh-proxy/src/settings.ts:59-66](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/settings.ts#L59-L66)

覆盖配置以 JSON 写盘，无专门加密。

```text
  }

  write(settings: PersistedRuntimeSettings): void {
    mkdirSync(dirname(this.filePath), { recursive: true })
    const temp = `${this.filePath}.tmp`
    writeFileSync(temp, JSON.stringify(settings, null, 2) + '\n', 'utf8')
    renameSync(temp, this.filePath)
  }
```

**依据 8 · 源码核查**：[dsh-proxy/src/index.ts:145-175](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/index.ts#L145-L175)

配置文件路径和状态回读注册在 Connection RPC。

<details>
<summary>查看原文（31行）</summary>

```text
  const controller = new ProxyController({
    base: {
      listenHost: resolved.listenHost,
      listenPort: resolved.listenPort,
      upstreamHost: resolved.upstreamHost,
      upstreamPort: resolved.upstreamPort || ctx.webServer.port || 3080,
      username: resolved.username,
      password: resolved.password,
      skipLaunchToken: resolved.skipLaunchToken,
    },
    settingsFile: dshHomePath('dsh-proxy.json'),
    log,
    readLaunchToken: readToken,
  })

  ctx.effect(
    async () => {
      await controller.start()
      return () => controller.stop()
    },
    'dsh-proxy.proxy',
  )

  const connection = ctx.connection as unknown as ConnectionChannelRegistrar

  ctx.effect(
    () => {
      const dispose = connection.register(ctx, RPC_CHANNEL, async (endpoint, payload) => {
        if (endpoint === RPC_STATUS_ENDPOINT) {
          return { ok: true, value: await controller.refreshStatus() }
        }
```

</details>

**依据 9 · 源码核查**：[dsh-proxy/src/proxy.ts:226-261](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/proxy.ts#L226-L261)

由 HTTP 服务器提供代理入口，只有明确放行的静态资源绕过自己的 Basic Auth。

<details>
<summary>查看原文（36行）</summary>

```text
  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url ?? '/', 'http://proxy.local').pathname
    // Public static files (PWA manifest, favicon): fetched without
    // credentials by the browser, so they bypass the auth gate.
    if (PUBLIC_PATHS.has(pathname)) {
      alignOrigin(req)
      proxy.web(req, res)
      return
    }
    if (!auth.isAuthenticated(req.headers.authorization)) {
      challenge(res)
      return
    }
    // With launch-token auto-login off (the default) this is a no-op that
    // returns immediately, so the feature costs one property read per request.
    if (autoLogin.enabled) {
      void autoLogin.grant(req).then(() => {
        alignOrigin(req)
        proxy.web(req, res)
      })
      return
    }
    alignOrigin(req)
    proxy.web(req, res)
  })

  const upgradedSockets = new Set<net.Socket>()
  server.on('upgrade', (req, socket, head) => {
    if (!auth.isAuthenticated(req.headers.authorization)) {
      socket.end(`HTTP/1.1 401 Unauthorized\r\nwww-authenticate: Basic realm="${AUTH_REALM}"\r\nConnection: close\r\n\r\n`)
      return
    }
    upgradedSockets.add(socket as net.Socket)
    ;(socket as net.Socket).once('close', () => upgradedSockets.delete(socket as net.Socket))
    alignOrigin(req)
    proxy.ws(req, socket as Duplex, head)
```

</details>

#### 缺口

- 未执行安全审计、未测 WebSocket cookie 认证或网络抓包。
  **影响**：不能给出实际安全保证
  **进一步探讨**：确认 Basic Auth、强密码、TLS/防火墙和令牌关闭后，再用外部设备访问测试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署和运维要承担哪些成本，适合怎样试用？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

仅在可信私有网络且管理员能配置防火墙/认证的条件下试用。先绑定必要接口，强制设置 Basic Auth，保持免 token 关闭，验证停止代理后 LAN 入口不可访问。它可能减少复制启动 token 的麻烦并复用 DSH 生命周期；也增加监听端口、凭据轮换、升级兼容和暴露面的运维责任。若无法确认 LAN 访问者范围或需免认证，应不启用。

试用限制到可信隔离网络且只开放测试设备，开启两个字段的 Basic Auth 并保留上游令牌。复测原连接、错误凭据、资源例外和关停后的端口，不以设置回复作为关停凭据。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-proxy/README.zh.md:34-61](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/README.zh.md#L34-L61)

安装、profile 配置及管理 RPC 的操作步骤。

<details>
<summary>查看原文（28行）</summary>

````text
## 配置

所有配置项都有 schema 默认值；在 **profile 的 `cordis.patch.yml`** 里按行 id 覆盖（patch 会整体替换该行 config，因此要写全你要改的键）：

```yaml
# C:\Users\cc\.dsh\profiles\web\cordis.patch.yml
- id: dsh-proxy
  config:
    listenHost: '0.0.0.0'      # 监听网卡；0.0.0.0 = 局域网可访问
    listenPort: 3081            # 代理对外端口（默认 3081）
    upstreamHost: '127.0.0.1'   # 上游 DSH 地址
    upstreamPort: 0             # 0 = 跟随 web app 实际绑定的端口（默认）
    username: ''                # 登录用户名（默认空 = 密码登录关闭）
    password: ''                # 登录密码（默认空 = 密码登录关闭）
    skipLaunchToken: false      # 免 token 首次访问（默认关闭，见下文）
```

- 默认 `username` 与 `password` 均为空 = **密码登录关闭**（局域网开放访问，谨慎）。**只有同时设置两者**才会启用密码登录（只设置其一仍保持关闭，设置页会提示）。
- `skipLaunchToken`（默认 **false**）：详见下文「免 token 首次访问」。

## 设置页面（改端口 / 账号密码 / 启停）

重启 `dsh web` 后，打开 DSH 设置（左下角齿轮）→ 「局域网代理」：

- **运行状态**：两个红绿灯指示 —— **代理服务端口**（监听地址:端口，绿灯=代理实际在监听，红灯=端口被占用等绑定失败）与**默认服务端口**（DSH 服务端口，绿灯=可探测到默认服务，红灯=不可达）；另有当前用户名、**密码登录是否启用**、**免 token 登录是否启用**（「未启用」的说明是「首次访问仍需手动带 token 访问一次」）；右上角有 **启动 / 停止** 按钮（运行中时「启动」置灰，未运行时「停止」置灰）。
- **修改设置**：可改 **代理服务端口（监听端口）**、**用户名**、**密码**（留空 = 设为空）、以及**免 token 登录**复选框（其提示写明了安全代价）。点「应用」后，配置写入 `$DSH_HOME/dsh-proxy.json` 并**立即重启转发服务**；改监听端口后局域网访问地址随之变化。

设置页的修改会**持久化**并优先于 profile 的 `cordis.patch.yml`；`listenHost` / `listenPort` 等仍只能通过 `cordis.patch.yml` 修改。插件通过宿主 RPC 通道 `/dsh-proxy`（`status` / `update` / `start` / `stop`）提供该能力，通道仅限 loopback 权威（经代理改写后 LAN 端同样可访问）。
````

</details>

**依据 2 · 作者声明**：[dsh-proxy/README.zh.md:51-73](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/README.zh.md#L51-L73)

默认认证关闭和免 token 功能行为。

<details>
<summary>查看原文（23行）</summary>

````text
- 默认 `username` 与 `password` 均为空 = **密码登录关闭**（局域网开放访问，谨慎）。**只有同时设置两者**才会启用密码登录（只设置其一仍保持关闭，设置页会提示）。
- `skipLaunchToken`（默认 **false**）：详见下文「免 token 首次访问」。

## 设置页面（改端口 / 账号密码 / 启停）

重启 `dsh web` 后，打开 DSH 设置（左下角齿轮）→ 「局域网代理」：

- **运行状态**：两个红绿灯指示 —— **代理服务端口**（监听地址:端口，绿灯=代理实际在监听，红灯=端口被占用等绑定失败）与**默认服务端口**（DSH 服务端口，绿灯=可探测到默认服务，红灯=不可达）；另有当前用户名、**密码登录是否启用**、**免 token 登录是否启用**（「未启用」的说明是「首次访问仍需手动带 token 访问一次」）；右上角有 **启动 / 停止** 按钮（运行中时「启动」置灰，未运行时「停止」置灰）。
- **修改设置**：可改 **代理服务端口（监听端口）**、**用户名**、**密码**（留空 = 设为空）、以及**免 token 登录**复选框（其提示写明了安全代价）。点「应用」后，配置写入 `$DSH_HOME/dsh-proxy.json` 并**立即重启转发服务**；改监听端口后局域网访问地址随之变化。

设置页的修改会**持久化**并优先于 profile 的 `cordis.patch.yml`；`listenHost` / `listenPort` 等仍只能通过 `cordis.patch.yml` 修改。插件通过宿主 RPC 通道 `/dsh-proxy`（`status` / `update` / `start` / `stop`）提供该能力，通道仅限 loopback 权威（经代理改写后 LAN 端同样可访问）。

## 使用

1. 重启 `dsh web`，启动日志会打印访问地址：
   ```
   dsh-proxy: listening on 0.0.0.0:3081 -> http://127.0.0.1:3080
   dsh-proxy: 局域网访问 http://192.168.1.100:3081
   ```
2. 浏览器访问 `http://<本机局域网IP>:3081`。
   - **启用了密码登录** → **浏览器弹出原生 Basic Auth 登录框** → 输入用户名密码 → 进入 DSH 界面。浏览器会记住凭据，下次直接进入。
   - **开启了免 token 登录** → 无需粘贴 token：首次访问由代理自动完成兑换，浏览器拿到签名 cookie 后直接进入 DSH 界面；之后每次访问都不再需要 token。
3. 局域网内其他设备用同一地址访问；登录成功后浏览器会记住凭据，下次直接进入。
````

</details>

**依据 3 · 源码核查**：[dsh-proxy/src/index.ts:74-85](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/index.ts#L74-L85)

代理控制器由宿主 apply 组装。

<details>
<summary>查看原文（12行）</summary>

```text
 *
 * DSH 0.1.7 moved Connection's `webServer` dependency behind a nested
 * `ctx.inject(['webServer'], ...)`, so the service's own context no longer
 * resolves `webServer`. `ctx.connection.rpc.handle` derives the route owner
 * from exactly that context, then mounts the channel's physical route through
 * `owner.webServer` — which throws `cannot get property "webServer" without
 * inject` and aborts the whole plugin load.
 *
 * `HostConnectionService.register` takes the owning context explicitly, so
 * passing this plugin's own context (which injects `webServer`) mounts the
 * route on a context that can resolve it. The method is not part of the public
 * `HostConnectionHandle` face, hence the local shape.
```

</details>

**依据 4 · 源码核查**：[dsh-proxy/src/controller.ts:152-178](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/controller.ts#L152-L178)

关闭句柄，停止 RPC 的回执可早于实际关停约 300ms。

<details>
<summary>查看原文（27行）</summary>

```text
    const handle = this.handle
    this.handle = null
    this.boundPort = null
    if (handle !== null) await handle.close()
  }

  /** Stop and start again with the current effective options (the "restart the forwarding service" verb). */
  async restart(): Promise<StartOutcome> {
    await this.stop()
    return this.start()
  }

  /**
   * Stop the proxy AFTER the caller's response has flushed back. The stop RPC
   * answer travels through the proxy itself when the settings page is reached
   * via the LAN URL, so closing the listener before the response is written
   * would drop it; the listener is torn down shortly afterwards instead.
   * @param delayMs - grace before the listener closes (defaults to 300ms).
   * @returns the status as it will be once stopped.
   */
  stopDeferred(delayMs = 300): LanProxyStatus {
    const stopped: LanProxyStatus = { ...this.status(), proxyListening: false }
    const timer = setTimeout(() => {
      void this.stop()
    }, delayMs)
    timer.unref?.()
    return stopped
```

</details>

**依据 5 · 源码核查**：[dsh-proxy/src/proxy.ts:252-284](https://github.com/smanx/dsh-proxy/blob/36954a30af329f4f4d54b6961c75f018e93eb873/dsh-proxy/src/proxy.ts#L252-L284)

升级连接登记于集合，关停销毁现有连接并关闭监听。

<details>
<summary>查看原文（33行）</summary>

```text
  const upgradedSockets = new Set<net.Socket>()
  server.on('upgrade', (req, socket, head) => {
    if (!auth.isAuthenticated(req.headers.authorization)) {
      socket.end(`HTTP/1.1 401 Unauthorized\r\nwww-authenticate: Basic realm="${AUTH_REALM}"\r\nConnection: close\r\n\r\n`)
      return
    }
    upgradedSockets.add(socket as net.Socket)
    ;(socket as net.Socket).once('close', () => upgradedSockets.delete(socket as net.Socket))
    alignOrigin(req)
    proxy.ws(req, socket as Duplex, head)
  })

  const ready = new Promise<number>((resolve, reject) => {
    const onListenError = (err: NodeJS.ErrnoException): void => {
      log('error', `cannot listen on ${listenHost}:${listenPort}: ${err.code ?? err.message}`)
      reject(err)
    }
    server.once('error', onListenError)
    server.listen(listenPort, listenHost, () => {
      server.off('error', onListenError)
      server.on('error', (err) => log('error', `proxy server error: ${err.message}`))
      resolve((server.address() as net.AddressInfo).port)
    })
  })

  const close = async (): Promise<void> => {
    for (const socket of upgradedSockets) socket.destroy()
    upgradedSockets.clear()
    await new Promise<void>((resolveClose) => {
      // Stop accepting new connections; the listener is released immediately
      // so a restart can rebind the same port. In-flight responses (e.g. the
      // settings-page update answer travelling back through the proxy) get a
      // short grace before connections are force-closed. The timer stays
```

</details>

#### 缺口

- 没有用户环境、TLS、端口冲突或长期运行记录。
  **影响**：评估真实管理成本和稳定性
  **进一步探讨**：先短时试用并记录启动失败、凭据暴露和停用后端口状态。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
