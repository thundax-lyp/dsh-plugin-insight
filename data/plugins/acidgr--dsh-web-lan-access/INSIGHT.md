# dsh-web-lan-access

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[dd1bb47](https://github.com/AcidGr/dsh-web-lan-access/tree/dd1bb4766725b985330da906154adcf435e2c439)

<!-- BEGIN META -->
[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access) [![npm 30d 1,470](https://img.shields.io/static/v1?label=npm+30d&message=1%2C470&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access)
<!-- END META -->

> **实现功能**：通过替换 WebServer 让 DSH Web 监听所有接口、自动信任接口 IP 并给远程浏览器 Host 能力。

> **核心亮点**：把多接口远程 GUI/Host 设置可用性集合为一个 bundle，减少逐接口配置；同时扩大暴露面。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：插件有意绕过上游 wildcard 禁止，0.0.0.0 监听所有可达接口，自动信任非 internal IPv4；Host 栅栏不是身份认证。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 用户要解决的远程访问障碍是什么？](#detail-section-11)
  - [Q02 · wildcard 监听和 Host 栅栏怎样被改变？](#detail-section-12)
  - [Q03 · 暴露面和远程 Host 权限风险多大？](#detail-section-13)
  - [Q04 · 何种验证与替代采用方式合理？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：从局域网/Tailscale/VPN 其它设备访问 DSH Web 与 Host-backed 设置。

stock 回环或具体 IP 绑定并显式信任 Host；本插件换为所有接口与自动信任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| wildcard WebServer | 全接口 Web 访问 | 扩大所有可达网络的端口面 |
| trustedHosts | 接受接口 IP 的 Host | 非身份认证 |
| ownsHost transport | 开放客户端 Host surfaces | 服务端权限另需验证 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 不满足时 |
| --- | --- | --- |
| DSH WebServer 内部 API | 替换服务和 tapIndex | 启动失败或无注入 |
| Node >=22.3 的 getBuiltinModule | 派生接口 IP | 列表为空，远程 API 403 |
| 浏览器认证/防火墙 | 限访问者 | 暴露风险升高 |
| 明确远程接口 | 访问路径 | wildcard 会额外开放其它接口 |


#### 部署判断

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 定义 | 列需访问的具体接口/用户 | 最小暴露集合 |
| 选型 | 先试具体 IP/代理 | 功能满足且入口可控 |
| 隔离实验 | 如仍需本插件，装在隔离宿主 | 所有监听/认证/Host 方法可测 |
| 运行 | 防火墙与升级复核 | 非授权网段不可达 |

**效果与成本**

#### 成本

| 阶段 | 资源/人工 | 关键风险 |
| --- | --- | --- |
| 安装 | profile bundle 与重启 | 取代 stock webserver |
| 持续 | 防火墙、TLS/认证、接口变化和升级测试 | 所有接口持续暴露 |
| 故障 | 网络排查、日志与应急封端口 | 非预期网络可达 |


#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 多接口监听 | patch 固定 0.0.0.0 | 实际防火墙路径 |
| 接口 Host 信任 | 非 internal IPv4 自动列表 | 热变动和其它协议 |
| Host UI | ownsHost bootstrap | 服务端方法权限与认证 |

> **思考**：插件有意绕过上游 wildcard 禁止，0.0.0.0 监听所有可达接口，自动信任非 internal IPv4；Host 栅栏不是身份认证。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把多接口远程 GUI/Host 设置可用性集合为一个 bundle，减少逐接口配置；同时扩大暴露面。详见[Q01](#research-q01)、[Q02](#research-q02)。

把多接口远程 GUI/Host 设置可用性集合为一个 bundle，减少逐接口配置；同时扩大暴露面。详见[Q01](#research-q01)、[Q02](#research-q02)。

依赖父 WebServer 内部配置和异常文案；错误文案变更可使放宽失效。连接层 trustedHosts 用接口 IP，未知域名需额外设置。客户端标志不等于服务端认证。

<a id="detail-section-5"></a>

### 1.4 主要限制

插件有意绕过上游 wildcard 禁止，0.0.0.0 监听所有可达接口，自动信任非 internal IPv4；Host 栅栏不是身份认证。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

默认不推荐。远程使用优先具体 IP 或认证代理；确需全接口时仅在隔离环境逐网段验收。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认显著扩大网络监听和客户端 Host 能力；真实认证、服务端权限与隔离部署未验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/webserver.js、test/index.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交阅读 README、package、bundle patch、webserver 子类、bootstrap 与单测；仅核作者文档引用的上游讨论入口，未独立读取讨论；未启动网络服务或执行目标插件。
- 下一步：在隔离多网卡宿主用 ss 和跨网段请求核所有接口、401/403、登录、Host-backed 方法及卸载恢复；与具体 IP/代理方案比较。

**分析版本**

- **仓库**：[AcidGr/dsh-web-lan-access](https://github.com/AcidGr/dsh-web-lan-access)
- **版本号**：1.4.0（[固定提交 dd1bb47](https://github.com/AcidGr/dsh-web-lan-access/tree/dd1bb4766725b985330da906154adcf435e2c439)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

限制为显式单接口或审核后的接口白名单，并与防火墙/认证验证绑定，比较可用性与实际暴露面；本版未实现。详见[Q04](#research-q04)。

在隔离多网卡宿主用 ss 和跨网段请求核所有接口、401/403、登录、Host-backed 方法及卸载恢复；与具体 IP/代理方案比较。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 212 | 77 | 121 | — |
| .md | source | 2 | 387 | — | — | 3975 |
| .js | test | 1 | 106 | 94 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access/issues?q=is%3Aissue+created%3A2026-09-22T05%3A35%3A30.748Z..2026-10-22T05%3A35%3A30.748Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A35%3A30.748Z..2026-10-22T05%3A35%3A30.748Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实远程 Web 访问的监听、信任栅栏和 Host 权限投射，评估采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户要解决的远程访问障碍是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向确需从局域网、Tailscale 或 VPN 的另一台设备访问自己 DSH Web 的用户。作者指出默认回环监听、远程 Host/Origin 栅栏以及客户端仅在 ownsHost 时启用 Host 设置三重障碍。固定版用 bundle patch 替换 WebServer 行、设置所有接口监听和接口 IP trustedHosts，再在 HTML head 注入传输对象 ownsHost:true，使远程页面显示 Host-backed 设置。相对在本机访问或手动绑定单一具体 IP，它减少多网卡配置，但把同一进程放在更多网络上；合格结果是仅预期网段可连接、认证和 API 栅栏有效、文件/设置等 Host 操作权限与用户意图一致。作者称 0.2.1-rc.2 已端到端验证，但本轮未复现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-56](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/README.md#L20-L56)

作者描述三重障碍和1.4.0三部分修复。

<details>
<summary>查看原文（37行）</summary>

````text
## The problem

Three separate things stand between a remote browser and a working GUI:

**1. The listener binds loopback only.** `dsh web` defaults to `127.0.0.1`, and from 0.2.1 the CLI rejects a wildcard host outright:

```
error: --host 0.0.0.0 is an unspecified (wildcard) address, which is not supported:
binding every interface would expose remote code execution to the network
```

**2. The `/api` fence rejects unknown authorities.** Every request must name a loopback host, the listener's own bind literal, or a declared `trustedHosts` entry. A wildcard bind has no literal of its own — `0.0.0.0` matches no request `Host` — so the page shell loads but every `/api` call returns **403** and sessions never appear.

**3. Host-backed settings are gated on `isLoopback`.** `client-connection` derives `isLoopback: transport?.ownsHost === true`, and client plugins consult that fact before reaching Host surfaces. A page served from a LAN or Tailscale address is not loopback by hostname, so the Models and plugin settings pages stay empty even after authentication succeeds.

## The fix

Two small pieces, both reversible.

### A replacement `webserver` row

`lib/webserver.js` subclasses `@deepseek-ai/dsh-host-webserver` and changes exactly two things:

- **`Config`** delegates to the shipped schema and rescues *only* the wildcard rejection. A non-literal host, a port out of range, or a missing port still fail exactly as before — the relaxation is one error message wide.
- **`getOrigin()`** never returns a wildcard origin. The parent builds its URL from the bind address, which would yield `http://0.0.0.0:3080` — an address no browser can dial. A wildcard listener reports loopback instead, and `--public-url` still overrides the advertised root upstream.

Everything else — the service name, routes, index taps, TLS handling, gzip, listener lifecycle — is inherited untouched.

### A `/api` fence widened from the live interface list

The bundle patch derives `trustedHosts` from every non-internal IPv4 the host currently has, so LAN, Tailscale (`100.x`), and VPN addresses are all accepted without per-IP configuration.

### A bootstrap script for Host ownership

Injected as the first script in `<head>`, before the boot manifest and shell entry, through the webserver's official index-tap extension point (`webServer.tapIndex`). It declares `ownsHost: true` while keeping the ordinary HTTP `fetch` transport, and leaves a transport supplied by another shell untouched.

> **What 1.4.0 removed:** the `crypto.randomUUID` polyfill. From 0.2.1 DSH mints UUIDs through `@deepseek-ai/dsh-util-crypto`, which is built on `crypto.getRandomValues` — available on insecure origins — so a plain-HTTP LAN page needs no patch to render. The old polyfill is gone because the bug it worked around no longer exists.
````

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:41-64](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/cordis.patch.yml#L41-L64)

禁用原 webserver、插入替换行、自动 trustedHosts 与 bootstrap 行。

<details>
<summary>查看原文（24行）</summary>

```text
# Remove this bundle to restore stock loopback-only behaviour.
- id: webserver
  disabled: true

- insert:
    - id: lan-webserver
      name: 'dsh-web-lan-access/webserver'
      inject:
        - webStartup
      config:
        host: '0.0.0.0'
        port: !!js ctx.webStartup.port ?? 3080
        tls: !!js ctx.webStartup.tls
        compression: gzip
        compressionLevel: 1
        compressionThresholdBytes: 1024

- id: connection
  config:
    trustedHosts: !!js '[...(() => { const os = globalThis.process?.getBuiltinModule?.("os"); return os ? globalThis.Object.values(os.networkInterfaces()).flat().filter(i => i && i.family === "IPv4" && !i.internal).map(i => i.address) : []; })()]'

- insert:
    - id: lan-access
      name: 'dsh-web-lan-access'
```

</details>

**依据 3 · 源码核查**：[lib/index.js:27-59](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/lib/index.js#L27-L59)

head 注入 ownsHost 传输并注册 index tap。

<details>
<summary>查看原文（33行）</summary>

```text
const BOOTSTRAP_SCRIPT =
  '<script>(function(){var g=globalThis;'
  + 'if(!g.__DSH_TRANSPORT__){g.__DSH_TRANSPORT__={'
  + 'ownsHost:true,fetch:function(input,init){return g.fetch(input,init)}}}})();</script>'

/** Marker comment so the injected script is greppable in served HTML. */
const MARKER = '<!--lan-access-bootstrap-->'

/**
 * Inject the bootstrap as the first child of `<head>`, so it runs before the
 * boot manifest and the shell entry bundle.
 * @param html - the served index document.
 * @returns the document with the bootstrap, or the input when it has no head.
 */
function injectBootstrap(html) {
  const head = html.indexOf('<head>')
  if (head === -1) return html
  return html.slice(0, head + 6) + MARKER + BOOTSTRAP_SCRIPT + html.slice(head + 6)
}

/**
 * Host plugin body: register the index tap on the webServer service.
 * `inject` holds activation until the webserver row is active — at cold boot
 * this row could otherwise run before webServer exists and silently no-op
 * (hot-mounts into a live tree worked only because the service was already
 * up). A non-web tree never satisfies the dependency, so this row simply
 * stays pending there.
 */
export const inject = ['webServer']

function apply(ctx) {
  ctx.effect(() => ctx.webServer.tapIndex(injectBootstrap), 'lan-access: trusted remote bootstrap')
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · wildcard 监听和 Host 栅栏怎样被改变？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件把 shipped webserver row disabled，插入 dsh-web-lan-access/webserver，host 固定 0.0.0.0。子类在父 Config 抛出含特定 wildcard 文案时以127.0.0.1替代 host 重校验，再把原 wildcard 写回；getOrigin 对 wildcard 报回环地址。connection.trustedHosts 通过 os.networkInterfaces() 列出所有非 internal IPv4，按加载时接口情况给远程 API Host 栅栏放行。bootstrap 在 `<head>` 开头设置全局 __DSH_TRANSPORT__，带 ownsHost:true 且 fetch 委托全局 fetch；若已有 transport 则不覆盖。此设计直接改写服务器监听边界和客户端能力投射，而不是仅在 UI 展示一个远程链接。单测检查脚本插入、模拟父 schema 与地址谓词，但没有真实端口/多网卡/Host 权限端到端测试；父 schema 错误文案改变时特定正则救援会失效。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:41-64](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/cordis.patch.yml#L41-L64)

固定 wildcard、接口列表 trustedHosts 和 lan-access bootstrap。

<details>
<summary>查看原文（24行）</summary>

```text
# Remove this bundle to restore stock loopback-only behaviour.
- id: webserver
  disabled: true

- insert:
    - id: lan-webserver
      name: 'dsh-web-lan-access/webserver'
      inject:
        - webStartup
      config:
        host: '0.0.0.0'
        port: !!js ctx.webStartup.port ?? 3080
        tls: !!js ctx.webStartup.tls
        compression: gzip
        compressionLevel: 1
        compressionThresholdBytes: 1024

- id: connection
  config:
    trustedHosts: !!js '[...(() => { const os = globalThis.process?.getBuiltinModule?.("os"); return os ? globalThis.Object.values(os.networkInterfaces()).flat().filter(i => i && i.family === "IPv4" && !i.internal).map(i => i.address) : []; })()]'

- insert:
    - id: lan-access
      name: 'dsh-web-lan-access'
```

</details>

**依据 2 · 源码核查**：[lib/webserver.js:74-101](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/lib/webserver.js#L74-L101)

按异常文案放松父 schema 的 wildcard 限制。

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * Build a schema that accepts a wildcard bind address.
 *
 * The rescue re-validates the same value with loopback substituted, so every
 * other field is still checked by the shipped rules, then restores the real
 * host — a bad port or a non-literal address therefore fails exactly as it
 * does without this plugin.
 * @param base - the shipped `WebServer.Config` schema.
 * @returns a `~standard` schema with the same rules minus the wildcard ban.
 */
function relaxWildcardBind(base) {
  return {
    '~standard': {
      validate(value) {
        try {
          return base['~standard'].validate(value)
        } catch (error) {
          if (!isWildcardRejection(error)) throw error
          const result = base['~standard'].validate({
            ...value,
            host: LOOPBACK_HOST,
          })
          if (result.issues) return result
          return { value: { ...result.value, host: value.host } }
        }
      },
    },
  }
```

</details>

**依据 3 · 源码核查**：[lib/webserver.js:115-149](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/lib/webserver.js#L115-L149)

子类 getOrigin 对 wildcard 返回回环。

<details>
<summary>查看原文（35行）</summary>

```text
 * The Web carrier with a wildcard-capable bind address.
 *
 * The service name, routes, index taps, and listener lifecycle all come from
 * the parent; only config validation and the advertised origin differ.
 */
export default class LanWebServer extends WebServer {
  /** Shipped rules with the unspecified-address rejection lifted. */
  static Config = relaxWildcardBind(WebServer.Config)

  /**
   * The dialable root URL for this listener.
   *
   * A wildcard bind has no address of its own, so it reports loopback; a
   * deployment that wants a different root passes `--public-url`, which
   * `dsh-web-app` prefers over this value.
   * @returns the origin, for example `http://127.0.0.1:3080`.
   * @throws before `listen` binds a port, or for an address no URL expresses.
   */
  getOrigin() {
    const bound = String(this.config.host)
    const zoneAt = bound.indexOf('%')
    const bare = zoneAt === -1 ? bound : bound.slice(0, zoneAt)
    const wildcard = isWildcardBind(bare)
    if (!wildcard && zoneAt !== -1) {
      throw new Error(
        `webserver: bind address ${JSON.stringify(bound)} carries an interface zone id, which no URL can express`,
      )
    }
    if (this.port === undefined) {
      throw new Error('webserver: origin read before the listener bound a port')
    }
    const dialHost = wildcard ? LOOPBACK_HOST : urlHost(bare)
    return `${this.protocol}//${dialHost}:${String(this.port)}`
  }
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:27-59](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/lib/index.js#L27-L59)

注入全局传输对象与 index tap。

<details>
<summary>查看原文（33行）</summary>

```text
const BOOTSTRAP_SCRIPT =
  '<script>(function(){var g=globalThis;'
  + 'if(!g.__DSH_TRANSPORT__){g.__DSH_TRANSPORT__={'
  + 'ownsHost:true,fetch:function(input,init){return g.fetch(input,init)}}}})();</script>'

/** Marker comment so the injected script is greppable in served HTML. */
const MARKER = '<!--lan-access-bootstrap-->'

/**
 * Inject the bootstrap as the first child of `<head>`, so it runs before the
 * boot manifest and the shell entry bundle.
 * @param html - the served index document.
 * @returns the document with the bootstrap, or the input when it has no head.
 */
function injectBootstrap(html) {
  const head = html.indexOf('<head>')
  if (head === -1) return html
  return html.slice(0, head + 6) + MARKER + BOOTSTRAP_SCRIPT + html.slice(head + 6)
}

/**
 * Host plugin body: register the index tap on the webServer service.
 * `inject` holds activation until the webserver row is active — at cold boot
 * this row could otherwise run before webServer exists and silently no-op
 * (hot-mounts into a live tree worked only because the service was already
 * up). A non-web tree never satisfies the dependency, so this row simply
 * stays pending there.
 */
export const inject = ['webServer']

function apply(ctx) {
  ctx.effect(() => ctx.webServer.tapIndex(injectBootstrap), 'lan-access: trusted remote bootstrap')
}
```

</details>

**依据 5 · 源码核查**：[test/index.test.js:17-105](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/test/index.test.js#L17-L105)

测试为注入和模拟 schema 等静态/单元行为。

<details>
<summary>查看原文（89行）</summary>

```text
test('registers the bootstrap through the index tap', () => {
  let tap
  let label
  apply({
    webServer: { tapIndex(value) { tap = value; return () => {} } },
    effect(factory, value) { factory(); label = value },
  })
  assert.equal(tap, injectBootstrap)
  assert.equal(label, 'lan-access: trusted remote bootstrap')
})

test('declares trusted Host ownership while preserving HTTP fetch', async () => {
  const calls = []
  const context = {
    fetch(input, init) { calls.push([input, init]); return Promise.resolve('response') },
  }
  vm.runInNewContext(injectedScript(injectBootstrap('<html><head></head></html>')), context)

  assert.equal(context.__DSH_TRANSPORT__.ownsHost, true)
  assert.equal(await context.__DSH_TRANSPORT__.fetch('/api/test', { method: 'POST' }), 'response')
  assert.deepEqual(calls, [['/api/test', { method: 'POST' }]])
})

test('no longer patches crypto.randomUUID', () => {
  assert.doesNotMatch(BOOTSTRAP_SCRIPT, /randomUUID/)
})

test('does not replace a transport supplied by another shell', () => {
  const existing = { ownsHost: false, fetch() {} }
  const context = { __DSH_TRANSPORT__: existing }
  vm.runInNewContext(injectedScript(injectBootstrap('<head></head>')), context)
  assert.equal(context.__DSH_TRANSPORT__, existing)
})

test('leaves documents without a head unchanged', () => {
  assert.equal(injectBootstrap('<html></html>'), '<html></html>')
})

test('injects the marker before any other head content', () => {
  const html = injectBootstrap('<head><script src="boot.js"></script></head>')
  assert.ok(html.indexOf(MARKER) < html.indexOf('boot.js'))
})

test('recognises only all-zero bind addresses as wildcard', () => {
  for (const host of ['0.0.0.0', '::', '::ffff:0.0.0.0', '0:0:0:0:0:0:0:0', '0.0.0.0%eth0']) {
    assert.equal(isWildcardBind(host), true, host)
  }
  for (const host of ['0.0.0.1', '100.78.28.76', '192.168.31.212', '::1', '127.0.0.1', 'example.com']) {
    assert.equal(isWildcardBind(host), false, host)
  }
})

test('relaxes only the wildcard rejection', () => {
  const wildcard = new Error('webserver: host "0.0.0.0" is an unspecified (wildcard) address, which is not supported')
  const literal = new Error('webserver: host "x" is not a concrete IPv4 or IPv6 address literal')
  assert.equal(isWildcardRejection(wildcard), true)
  assert.equal(isWildcardRejection(literal), false)
})

test('relaxed schema accepts wildcard and still enforces the shipped rules', () => {
  const shipped = {
    '~standard': {
      validate(value) {
        if (value.host === '0.0.0.0') {
          throw new Error('webserver: host "0.0.0.0" is an unspecified (wildcard) address, which is not supported')
        }
        if (typeof value.host !== 'string' || !/^\d+\.\d+\.\d+\.\d+$/.test(value.host)) {
          throw new Error(`webserver: host ${JSON.stringify(value.host)} is not a concrete IPv4 or IPv6 address literal`)
        }
        if (!Number.isInteger(value.port) || value.port > 65535) {
          return { issues: [{ message: 'port out of range' }] }
        }
        return { value }
      },
    },
  }
  const schema = relaxWildcardBind(shipped)

  assert.deepEqual(schema['~standard'].validate({ host: '0.0.0.0', port: 3080 }), {
    value: { host: '0.0.0.0', port: 3080 },
  })
  assert.deepEqual(schema['~standard'].validate({ host: '10.0.0.2', port: 3080 }), {
    value: { host: '10.0.0.2', port: 3080 },
  })
  assert.throws(
    () => schema['~standard'].validate({ host: 'example.com', port: 3080 }),
    /is not a concrete IPv4 or IPv6 address literal/,
  )
  assert.ok(schema['~standard'].validate({ host: '0.0.0.0', port: 99999 }).issues)
```

</details>

#### 缺口

- 没有真实父版本、接口变动与监听配置的运行验证。
  **影响**：无法确认实际服务生效、接口热变动或上游变更时行为。
  **进一步探讨**：在隔离宿主对固定 DSH 版本测试绑定、接口启动前后变化及升级。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 暴露面和远程 Host 权限风险多大？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

高。0.0.0.0 让所有可达 IPv4 接口监听同一 DSH Web 端口，不限“局域网”或 Tailscale；自动列入 trustedHosts 的也包括非 internal 的 VPN/桥接等 IPv4。trustedHosts 是请求 Host/Origin 栅栏，不是访问者身份认证；脚本又把远程浏览器标为拥有 Host，作者说明会启用模型设置、文件打开等所有相关客户端入口。服务器端仍可能另有身份/方法限制，不能从客户端标志直接断言越权；但插件主动绕过上游 wildcard 拒绝并扩大暴露面是固定源码事实。README 自身明确提示该拒绝是维护者有意的 RCE 防护边界，并提出具体 IP 单接口或代理。作者在 README 引用了上游讨论 https://github.com/deepseek-ai/deepseek-harness/discussions/9287；本轮未独立读取该讨论及同版本完整上游代码，维护者解释仅按作者转述处理。不能把作者所称“认证仍在”当部署安全证明，尤其在公开接口、共享 Wi-Fi、云主机或未核防火墙规则上。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-30](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/cordis.patch.yml#L1-L30)

补丁注释说明绕过原 wildcard 拒绝及其远程代码执行风险。

<details>
<summary>查看原文（30行）</summary>

```text
# Bundle patch: bind every interface, widen the /api trust fence, and mount the
# remote-Host bootstrap.
#
# ## Why the shipped `webserver` row is disabled instead of re-configured
#
# From dsh 0.2.1 the shipped webserver rejects `0.0.0.0` / `::` in its config
# schema:
#
#   webserver: host "0.0.0.0" is an unspecified (wildcard) address, which is
#   not supported: binding every interface would expose remote code execution
#   to the network
#
# Writing `host: '0.0.0.0'` into that row (what this bundle did through 1.3.x)
# therefore fails validation and aborts the boot. A patch cannot retarget the
# row's `name` either — app-boot skips a patch whose `name` differs from the
# target's — so the only route to an all-interface listener is to disable the
# shipped row and mount `lib/webserver.js`, a subclass that rescues exactly the
# wildcard rejection and leaves every other rule intact.
#
# The replacement row injects `webStartup`, so `--port`, `--host` and the TLS
# flags still reach it exactly as they reached the shipped row.
#
# ## Why `trustedHosts` is derived here
#
# `isBindAddressAuthority` auto-trusts the listener's own bind literal, which is
# what makes `--host 100.78.28.76` work with no extra config. A wildcard bind
# has no such literal — `0.0.0.0` matches no request Host — so without an
# explicit list every remote `/api` call returns 403 while the page shell still
# loads. This layer therefore publishes every non-internal IPv4 the host has
# (LAN, Tailscale 100.x, VPN), re-derived at each config load.
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:41-60](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/cordis.patch.yml#L41-L60)

固定全接口监听并信任所有非 internal IPv4。

<details>
<summary>查看原文（20行）</summary>

```text
# Remove this bundle to restore stock loopback-only behaviour.
- id: webserver
  disabled: true

- insert:
    - id: lan-webserver
      name: 'dsh-web-lan-access/webserver'
      inject:
        - webStartup
      config:
        host: '0.0.0.0'
        port: !!js ctx.webStartup.port ?? 3080
        tls: !!js ctx.webStartup.tls
        compression: gzip
        compressionLevel: 1
        compressionThresholdBytes: 1024

- id: connection
  config:
    trustedHosts: !!js '[...(() => { const os = globalThis.process?.getBuiltinModule?.("os"); return os ? globalThis.Object.values(os.networkInterfaces()).flat().filter(i => i && i.family === "IPv4" && !i.internal).map(i => i.address) : []; })()]'
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1-30](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/lib/index.js#L1-L30)

远程 ownsHost 信号与 Host-backed surface 目的。

<details>
<summary>查看原文（30行）</summary>

```text
/**
 * lan-access bootstrap half — declares Host ownership for a trusted remote
 * browser so Host-backed settings stay available off a loopback page.
 *
 * Why this still exists: `client-connection` derives
 * `isLoopback: transport?.ownsHost === true`, and client plugins read that fact
 * to decide whether the page may reach Host-backed surfaces — the settings
 * document controller, for one, is created only when it is true. A page served
 * from a LAN or Tailscale address is not loopback by hostname, so without this
 * signal those surfaces stay empty even after authentication succeeds.
 *
 * The bootstrap is injected as the first script in `<head>`, before the
 * `__DSH_BOOT__` manifest and the shell entry bundle, through the webserver's
 * index-tap extension point. It declares ownership while keeping the ordinary
 * HTTP `fetch` transport, and leaves a transport supplied by another shell
 * untouched.
 *
 * What this no longer does: polyfill `crypto.randomUUID`. Releases from 0.2.1
 * mint UUIDs through `@deepseek-ai/dsh-util-crypto`, which is built on
 * `crypto.getRandomValues` — available on insecure origins — so a plain-HTTP
 * LAN origin needs no patch to render sessions and models.
 *
 * Removing this row from cordis.patch.yml restores the original page exactly
 * (`ctx.effect` disposes the tap on row teardown).
 */

const BOOTSTRAP_SCRIPT =
  '<script>(function(){var g=globalThis;'
  + 'if(!g.__DSH_TRANSPORT__){g.__DSH_TRANSPORT__={'
  + 'ownsHost:true,fetch:function(input,init){return g.fetch(input,init)}}}})();</script>'
```

</details>

**依据 4 · 作者声明**：[README.md:139-169](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/README.md#L139-L169)

作者承认 Host 能力扩大、all-interface 风险并建议具体 IP/防火墙/代理。

<details>
<summary>查看原文（31行）</summary>

````text
## Host ownership scope

The transport signal enables every client surface DSH associates with owning the Host, not only Models. That includes Host-backed settings and native Host actions such as opening a produced file. Use this plugin only when the authenticated remote browser is meant to operate the agent machine. DSH's Host/Origin fence and browser authentication remain in force; this signal changes the client's capability projection, not request authentication.

Older harness builds that pin privileged methods to loopback on the server continue returning 403 for those methods. This client bootstrap does not weaken that server-side fence.

## Verify

```sh
# 1. the bootstrap is injected
curl -s http://127.0.0.1:3080/ -b <cookie> | grep lan-access-bootstrap

# 2. every interface is listening (0.0.0.0 in the address column)
ss -ltnp | grep 3080

# 3. the fence admits your interface IPs and refuses anything else
curl -s -o /dev/null -w '%{http_code}\n' -H "Host: 100.64.0.5:3080" http://127.0.0.1:3080/api  # 401
curl -s -o /dev/null -w '%{http_code}\n' -H "Host: evil.example:3080" http://127.0.0.1:3080/api  # 403
```

`401` means the fence admitted the authority and only the session cookie is missing — that is the expected result for a trusted IP without a browser session. `403` means the authority was rejected. Then open `http://<server-ip>:3080` from another device: sessions and models must load.

## Security warning

Binding `0.0.0.0` exposes the DSH authentication surface to **every** reachable interface, including addresses you may not have considered — container bridges, VPN tunnels, and any other network the host is attached to. `trustedHosts` is an Origin/Host fence, not identity; DSH separately authenticates the browser.

This plugin deliberately relaxes a restriction the DSH maintainers added on purpose:

> binding every interface would expose remote code execution to the network

Use it only on trusted networks, restrict the port with a firewall (e.g. `ufw allow from 192.168.0.0/16`), or front it with Tailscale or an authenticated reverse proxy. If a single interface is enough, prefer plain `dsh web --host <ip>` — it needs no plugin, and the fence auto-trusts the bind literal.
````

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何种验证与替代采用方式合理？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

当前不推荐作为默认远程访问方案。若只需单个受控接口，优先使用 DSH 对具体 IP 的受支持绑定并显式配置可信 Host；如需跨网段，考虑回环绑定加受控认证代理或 Tailscale serve，并保留主机防火墙。插件方案的安装成本低，但运维成本包括持续检查监听接口、路由可达性、TLS/认证、升级兼容、端口暴露及事故响应。只有明确需要全接口且能验证每个网络路径、限制防火墙规则的专用隔离宿主才可审慎实验。未实现的改进假设是只绑定明确允许的单个接口，或启动前先由操作者审核接口白名单并拒绝公网/桥接接口；在相同远程使用场景下对比可用性、暴露的 IP/端口数、匿名请求与 Host 操作权限。未经这些证据不能把“能从手机打开页面”视为安全验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:145-169](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/README.md#L145-L169)

作者列 curl/ss 验证和单接口、代理、防火墙建议。

<details>
<summary>查看原文（25行）</summary>

````text
## Verify

```sh
# 1. the bootstrap is injected
curl -s http://127.0.0.1:3080/ -b <cookie> | grep lan-access-bootstrap

# 2. every interface is listening (0.0.0.0 in the address column)
ss -ltnp | grep 3080

# 3. the fence admits your interface IPs and refuses anything else
curl -s -o /dev/null -w '%{http_code}\n' -H "Host: 100.64.0.5:3080" http://127.0.0.1:3080/api  # 401
curl -s -o /dev/null -w '%{http_code}\n' -H "Host: evil.example:3080" http://127.0.0.1:3080/api  # 403
```

`401` means the fence admitted the authority and only the session cookie is missing — that is the expected result for a trusted IP without a browser session. `403` means the authority was rejected. Then open `http://<server-ip>:3080` from another device: sessions and models must load.

## Security warning

Binding `0.0.0.0` exposes the DSH authentication surface to **every** reachable interface, including addresses you may not have considered — container bridges, VPN tunnels, and any other network the host is attached to. `trustedHosts` is an Origin/Host fence, not identity; DSH separately authenticates the browser.

This plugin deliberately relaxes a restriction the DSH maintainers added on purpose:

> binding every interface would expose remote code execution to the network

Use it only on trusted networks, restrict the port with a firewall (e.g. `ufw allow from 192.168.0.0/16`), or front it with Tailscale or an authenticated reverse proxy. If a single interface is enough, prefer plain `dsh web --host <ip>` — it needs no plugin, and the fence auto-trusts the bind literal.
````

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:41-64](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/cordis.patch.yml#L41-L64)

本版所有接口监听/自动信任是改进对照基线。

<details>
<summary>查看原文（24行）</summary>

```text
# Remove this bundle to restore stock loopback-only behaviour.
- id: webserver
  disabled: true

- insert:
    - id: lan-webserver
      name: 'dsh-web-lan-access/webserver'
      inject:
        - webStartup
      config:
        host: '0.0.0.0'
        port: !!js ctx.webStartup.port ?? 3080
        tls: !!js ctx.webStartup.tls
        compression: gzip
        compressionLevel: 1
        compressionThresholdBytes: 1024

- id: connection
  config:
    trustedHosts: !!js '[...(() => { const os = globalThis.process?.getBuiltinModule?.("os"); return os ? globalThis.Object.values(os.networkInterfaces()).flat().filter(i => i && i.family === "IPv4" && !i.internal).map(i => i.address) : []; })()]'

- insert:
    - id: lan-access
      name: 'dsh-web-lan-access'
```

</details>

**依据 3 · 源码核查**：[lib/webserver.js:120-149](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/lib/webserver.js#L120-L149)

替换父 webserver 配置及 origin。

<details>
<summary>查看原文（30行）</summary>

```text
export default class LanWebServer extends WebServer {
  /** Shipped rules with the unspecified-address rejection lifted. */
  static Config = relaxWildcardBind(WebServer.Config)

  /**
   * The dialable root URL for this listener.
   *
   * A wildcard bind has no address of its own, so it reports loopback; a
   * deployment that wants a different root passes `--public-url`, which
   * `dsh-web-app` prefers over this value.
   * @returns the origin, for example `http://127.0.0.1:3080`.
   * @throws before `listen` binds a port, or for an address no URL expresses.
   */
  getOrigin() {
    const bound = String(this.config.host)
    const zoneAt = bound.indexOf('%')
    const bare = zoneAt === -1 ? bound : bound.slice(0, zoneAt)
    const wildcard = isWildcardBind(bare)
    if (!wildcard && zoneAt !== -1) {
      throw new Error(
        `webserver: bind address ${JSON.stringify(bound)} carries an interface zone id, which no URL can express`,
      )
    }
    if (this.port === undefined) {
      throw new Error('webserver: origin read before the listener bound a port')
    }
    const dialHost = wildcard ? LOOPBACK_HOST : urlHost(bare)
    return `${this.protocol}//${dialHost}:${String(this.port)}`
  }
}
```

</details>

#### 缺口

- 未执行真实多网卡/公网/Tailscale 与服务端认证矩阵。
  **影响**：无法确认任何具体部署已被安全隔离。
  **进一步探讨**：在隔离实验机列全部监听接口，跨网段测匿名/认证/Host 方法和防火墙封锁，并审查日志。
- 单接口审核/白名单改进未实现。
  **影响**：不能算现版风险缓解。
  **进一步探讨**：做原型与 stock 具体 IP 绑定、代理方案同条件对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
