# dsh-web-lan-access

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[00d9ded](https://github.com/AcidGr/dsh-web-lan-access/tree/00d9ded99bfc9f86e890f73efb17a2194e9290ec)

<!-- BEGIN META -->
[![GitHub ★ 40](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AcidGr/dsh-web-lan-access) [![npm 30d 1,625](https://img.shields.io/static/v1?label=npm+30d&message=1%2C625&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-lan-access) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-lan-access)
<!-- END META -->

> **功能**：为 DSH Web 提供多接口访问与远程宿主设置支持。

> **亮点**：[Q01](#research-q01) 在多接口接入时一起处理监听、目标权威和客户端表面。

> **主要限制**：[Q02](#research-q02) 监听、HTTP 权威及身份认证须分别核对。

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
  - [Q01 · 多网口与设置接入如何实现？](#detail-section-11)
  - [Q02 · 信任列表、认证和可达性是什么关系？](#detail-section-12)
  - [Q03 · 怎样测试并恢复？](#detail-section-13)
  - [Q04 · 怎样降低无意暴露？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需在隔离或可信网络的多个接口操作同一 DSH 主机的使用者。

保持回环加端口转发，或使用宿主原生单 IP 监听。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多接口 | 远程连接 DSH Web | 通配监听需可达性控制 |
| 宿主设置 | 向远程页面投影宿主能力 | 仍依赖实际认证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 Web 宿主 | 必需 | 加载替换类和 tap | 回退原生监听 |
| 支持网卡枚举的 Node | 自动地址必需 | 取非内部 IPv4 | 列表为空需排查 |
| 受控网络 | 远程使用必需 | 限制来源与访问 | 停止接入 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对接口与认证 | 先确定需要多接口 |
| 验证 | 操作者测试 Host、登录与设置 | 只允许预期请求 |
| 退出 | 移除 bundle 并重启 | 核对监听实际恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 网络和证书成本未知 | 核对宿主与访问矩阵 | 未实测 |
| 持续 | 网络资源未知 | 维护接口与认证 | 升级需复核 |
| 失败恢复 | 服务重启成本未知 | 恢复 profile 与监听 | 耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多接口 | 替换类与配置绑定 | 实际安全可达性 |
| 宿主设置 | 页面注入 ownsHost | 宿主最终授权 |

> **思考**：[Q02](#research-q02) 监听、HTTP 权威及身份认证须分别核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在多接口接入时一起处理监听、目标权威和客户端表面。

[Q01](#research-q01) 监听和对外 origin 独立，页面标记由可释放 tap 注入。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 监听、HTTP 权威及身份认证须分别核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 优先核对原生单接口是否足够，确需多接口时做 [Q02](#research-q02) 的隔离验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持替换与客户端投影机制。未运行宿主、浏览器或网络测试。

- 已检查：作者 README、包清单、源码路径 README.zh.md、cordis.patch.yml、lib/index.js、lib/webserver.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定补丁、服务替换和客户端注入源码。未执行目标代码。
- 下一步：在隔离 profile 核对认证、错误 Host 和来源网络，再核对移除后的监听。

**分析版本**

- **仓库**：[AcidGr/dsh-web-lan-access](https://github.com/AcidGr/dsh-web-lan-access)
- **版本号**：1.4.0（[固定提交 00d9ded](https://github.com/AcidGr/dsh-web-lan-access/tree/00d9ded99bfc9f86e890f73efb17a2194e9290ec)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 显示实际接口并按明确选择收窄可达范围。

在隔离 profile 核对认证、错误 Host 和来源网络，再核对移除后的监听。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 212 | 77 | 121 | — |
| .md | source | 2 | 389 | — | — | 3999 |
| .js | test | 1 | 106 | 94 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AcidGr/dsh-web-lan-access/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AcidGr/dsh-web-lan-access/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AcidGr/dsh-web-lan-access/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：LAN Access 如何改变网络和客户端能力边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多网口与设置接入如何实现？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

需要从多个可信接口访问 DSH 的操作者，可省去逐个接口改启动参数的步骤。bundle 禁用默认 webserver 并插入替换类，指定 0.0.0.0；类在指定校验异常时以回环地址重新验证，再恢复通配地址。报告的 origin 对通配监听使用回环地址。另一个宿主行用 index tap 在 head 开头插入 transport 的 ownsHost 标记，使兼容客户端能显示宿主能力，已有 transport 保留。仅需单网口时，作者给出的原生特定 IP 监听更少改动。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:42-64](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/cordis.patch.yml#L42-L64)

实际替换、监听及 tap 行

<details>
<summary>查看原文（23行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/webserver.js:84-102](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/lib/webserver.js#L84-L102)

校验回退

<details>
<summary>查看原文（19行）</summary>

```text
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
}
```

</details>

**依据 3 · 源码核查**：[lib/webserver.js:133-148](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/lib/webserver.js#L133-L148)

origin 计算

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:27-58](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/lib/index.js#L27-L58)

客户端 transport 注入

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 5 · 作者声明**：[README.zh.md:161-171](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/README.zh.md#L161-L171)

作者说明单接口对照

<details>
<summary>查看原文（11行）</summary>

```text
## 安全警告

绑定 `0.0.0.0` 会把 DSH 认证入口暴露到**所有**可达接口，包括你未必考虑过的地址——容器网桥、VPN 隧道，以及主机连接的任何其他网络。`trustedHosts` 是 Origin/Host 围栏而非身份认证；DSH 会另外认证浏览器。

本插件是在**有意放宽** DSH 维护者刻意加入的限制：

> binding every interface would expose remote code execution to the network

请只在可信网络使用；用防火墙限制网段（如 `ufw allow from 192.168.0.0/16`），或走 Tailscale / 带鉴权的反向代理。**如果单个网口就够用，优先用原生的 `dsh web --host <ip>`**——它不需要任何插件，而且围栏会自动信任绑定字面量。

由于本插件依赖 webserver 的 schema 与 URL 构造内部实现，未来 DSH 版本可能再次破坏它。升级前请核对兼容性表。
```

</details>

#### 缺口

- 未在目标宿主执行替换或浏览器设置操作
  **影响**：无法确认目标宿主是否按预期挂载
  **进一步探讨**：先在隔离网络核对监听、页面和设置读取

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 信任列表、认证和可达性是什么关系？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

配置把非内部 IPv4 地址写入 trustedHosts。它描述 HTTP 请求的目标权威，并不筛选来源网络。通配监听影响所有可达接口，包括容器或 VPN，具体可达性还取决于主机路由和防火墙。页面标记改变客户端呈现范围，已有 transport 不被替换；标记本身不提供凭据验证。作者称宿主围栏和会话认证保留，实际入口及反代仍须分别验证未登录、错误 Host 和授权行为。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:45-60](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/cordis.patch.yml#L45-L60)

通配监听及动态目标地址

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/index.js:27-44](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/lib/index.js#L27-L44)

标记设置及已有 transport 条件

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[README.zh.md:141-159](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/README.zh.md#L141-L159)

作者区分认证与围栏响应

<details>
<summary>查看原文（19行）</summary>

````text
该 transport 信号会启用 DSH 当前归入“拥有宿主”的全部客户端界面，并非只启用模型页。其中包括宿主持久化设置，以及打开生成文件等宿主原生操作。仅应在已认证的远程浏览器确实用于操作 agent 主机时使用本插件。DSH 的 Host/Origin 围栏和浏览器认证仍然生效；此信号改变的是客户端能力投影，不是请求认证。

旧版 harness 如果仍在服务端把特权方法限制为仅回环，这些方法仍会返回 403。客户端 bootstrap 不会削弱服务端围栏。

## 验证

```sh
# 1. bootstrap 已注入
curl -s http://127.0.0.1:3080/ -b <cookie> | grep lan-access-bootstrap

# 2. 所有网口都在监听（地址列为 0.0.0.0）
ss -ltnp | grep 3080

# 3. 围栏放行你的网卡 IP、拒绝其他
curl -s -o /dev/null -w '%{http_code}\n' -H "Host: 100.64.0.5:3080" http://127.0.0.1:3080/api  # 401
curl -s -o /dev/null -w '%{http_code}\n' -H "Host: evil.example:3080" http://127.0.0.1:3080/api  # 403
```

`401` 表示围栏放行了该权威、只缺会话 cookie——对没有浏览器会话的可信 IP 而言这是预期结果。`403` 表示权威被拒绝。再从另一台设备打开 `http://<服务器IP>:3080`——会话和模型应正常加载。
````

</details>

**依据 4 · 作者声明**：[README.zh.md:161-169](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/README.zh.md#L161-L169)

作者说明全接口风险

```text
## 安全警告

绑定 `0.0.0.0` 会把 DSH 认证入口暴露到**所有**可达接口，包括你未必考虑过的地址——容器网桥、VPN 隧道，以及主机连接的任何其他网络。`trustedHosts` 是 Origin/Host 围栏而非身份认证；DSH 会另外认证浏览器。

本插件是在**有意放宽** DSH 维护者刻意加入的限制：

> binding every interface would expose remote code execution to the network

请只在可信网络使用；用防火墙限制网段（如 `ufw allow from 192.168.0.0/16`），或走 Tailscale / 带鉴权的反向代理。**如果单个网口就够用，优先用原生的 `dsh web --host <ip>`**——它不需要任何插件，而且围栏会自动信任绑定字面量。
```

#### 缺口

- 未核对宿主实际鉴权、反代与防火墙
  **影响**：不能确定真实暴露范围或各角色能力
  **进一步探讨**：用隔离网卡分别验证错误 Host、未认证及认证路径

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样测试并恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

替换类依赖宿主原版 webserver 的 schema 和错误形态，补丁靠 Node 的 getBuiltinModule 找网卡，方法不存在时表达式给空数组。包声明 Node 20 起，但动态枚举所需方法按注释要求至少 22.3。作者对 1.4.x 给出宿主版本范围和端到端报告，独立接受仍需核对实际版本和配置。先比较单接口原生路径，确需多接口且能限可达来源时才在隔离 profile 观察。费用主要是网络、证书和维护时间，故障时移除 bundle 并核对实际监听和客户端。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:19-29](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/package.json#L19-L29)

包声明与宿主范围

<details>
<summary>查看原文（11行）</summary>

```text
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dsh": ">=0.2.1-rc.1",
      "dshReleases": {
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:32-39](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/cordis.patch.yml#L32-L39)

动态枚举运行时要求

```text
# NOTES:
#   - The expression is a single YAML scalar and must stay on one line.
#   - `process.getBuiltinModule` requires Node >= 22.3.
#   - The loader evaluates `!!js` inside `with (ctx)`, which can shadow plain
#     globals, so every global is reached through `globalThis`.
#   - MagicDNS hostnames are not discoverable this way. Add them with
#     `--trusted-host <name>`, or by replacing this key with a literal list,
#     when you browse by name rather than by IP.
```

**依据 3 · 源码核查**：[cordis.patch.yml:58-60](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/cordis.patch.yml#L58-L60)

枚举缺失时的回退

```text
- id: connection
  config:
    trustedHosts: !!js '[...(() => { const os = globalThis.process?.getBuiltinModule?.("os"); return os ? globalThis.Object.values(os.networkInterfaces()).flat().filter(i => i && i.family === "IPv4" && !i.internal).map(i => i.address) : []; })()]'
```

**依据 4 · 作者声明**：[README.zh.md:9-18](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/README.zh.md#L9-L18)

作者兼容矩阵

<details>
<summary>查看原文（10行）</summary>

```text
## 兼容性

| dsh | 插件 | 说明 |
|---|---|---|
| **0.2.2-rc.1** | **1.4.x** | 当前版本，已端到端验证 |
| 0.2.1-rc.x | 1.4.x | 已端到端验证 |
| 0.2.0-rc.x | 1.3.x | 当时的 webserver 仍接受 `0.0.0.0` |
| ≤ 0.1.7 | 1.3.x | 尚未加入通配地址限制 |

1.4.0 是针对 dsh 0.2.1 收紧 webserver 的版本。从 1.3.x 升级请先看[为什么 1.4.0 必须改架构](#为什么-140-必须改架构)。
```

</details>

**依据 5 · 作者声明**：[README.zh.md:173-176](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/README.zh.md#L173-L176)

回滚步骤

```text
## 回滚

- bundle 安装：`dsh plugin --profile web remove dsh-web-lan-access`
- 手动安装：从 `dsh.profile.bundles` 移除 `dsh-web-lan-access`；bundle patch 的行随之消失，原版仅回环的 `webserver` 重新接管。
```

#### 缺口

- 未独立运行宿主、配置合并或退出
  **影响**：实际停机、配置覆盖与网络管理成本未知
  **进一步探讨**：在隔离 profile 做启动、拒绝和卸载后监听核对

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样降低无意暴露？

**研究主题**：新假设与验证

#### 完整回答

可以在启用前向操作者展示实际监听和候选 trustedHosts 的区别，默认只保留明确选中的接口或提示改用原生单接口。现有补丁会枚举每个非内部 IPv4。用同时含家庭网、容器桥和 VPN 的测试机对照现有配置，记录非目标网可达比例、可信端访问成功和配置耗时。若没有缩小误开放或常规访问失败增加则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:45-60](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/cordis.patch.yml#L45-L60)

当前自动监听及列表

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 2 · 作者声明**：[README.zh.md:161-169](https://github.com/AcidGr/dsh-web-lan-access/blob/00d9ded99bfc9f86e890f73efb17a2194e9290ec/README.zh.md#L161-L169)

当前维护者约束和单接口选择

```text
## 安全警告

绑定 `0.0.0.0` 会把 DSH 认证入口暴露到**所有**可达接口，包括你未必考虑过的地址——容器网桥、VPN 隧道，以及主机连接的任何其他网络。`trustedHosts` 是 Origin/Host 围栏而非身份认证；DSH 会另外认证浏览器。

本插件是在**有意放宽** DSH 维护者刻意加入的限制：

> binding every interface would expose remote code execution to the network

请只在可信网络使用；用防火墙限制网段（如 `ufw allow from 192.168.0.0/16`），或走 Tailscale / 带鉴权的反向代理。**如果单个网口就够用，优先用原生的 `dsh web --host <ip>`**——它不需要任何插件，而且围栏会自动信任绑定字面量。
```

#### 缺口

- 未测试替代的宿主组合或操作者流程
  **影响**：不能确定最小可达性与易用的权衡
  **进一步探讨**：用固定接口矩阵和认证结果做对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
