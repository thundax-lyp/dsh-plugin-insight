# dsh-plugin-loopback-trust

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[838ddf0](https://github.com/6mt/dsh-plugin-loopback-trust/tree/838ddf0d79fb977be896c6cb5dcd0bba68015832)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在反代域名网页上将连接标为 host-owning，以恢复 DSH 设置的 Host 持久化。

> **亮点**：用短客户端补丁绕过反代域名的本地分类，恢复作者所述设置持久化路径；依赖 DSH 私有时序和字段。详见[Q02](#research-q02)。

> **主要限制**：它对所有非 loopback、无既存 transport 的网页统一标记 host-owning，插件无 origin 白名单或身份校验；服务端 fence 保留仅作者声称，不能替代代理授权。详见[Q03](#research-q03)。

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
  - [Q01 · 反代域名下用户需要恢复什么，合格结果是什么？](#detail-section-11)
  - [Q02 · 客户端补丁何时生效，相对反代部署增加了什么？](#detail-section-12)
  - [Q03 · 它改变哪一道信任边界，未验证的安全假设是什么？](#detail-section-13)
  - [Q04 · 部署和故障恢复有哪些条件与代价？](#detail-section-14)
  - [Q05 · 应怎样采用，何种替代设计值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反代域名的 DSH 设置页被作者描述为降级到内存；合格结果须兼顾可持久化与未授权浏览器拒绝。

基线是 DSH 原生 loopback/host fence 与代理访问控制；本补丁改变客户端分类，不应代替服务端授权。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| immediate transport 标记 | 早期 Host 分类 | 全非 loopback 且无既存 transport |
| 晚到补丁 | 修加载顺序漂移 | 已抓 false 的消费者可能需重载 |
| host apply | 无动作 | 服务端权限全靠原宿主/代理 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| DSH web immediate 与私有字段 | 早期补丁 | 设置仍不可用或行为漂移 |
| 反代认证/网络限制 | 远程访问控制 | 不应启用 |
| 服务端 Host/API 授权 | 设置写入最终保护 | 插件自身不提供 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 准备 | 核代理访问控制及官方开关 | 未授权请求被拒 |
| 安装 | 重启并强刷 | 首次加载正确 |
| 验收 | 设置保存后重载，双浏览器测拒绝 | 可用且不误放行 |
| 回退 | 卸载再重启 | 原边界恢复 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 首次 | 代理访问控制、重启与强刷 | 验收工时 |
| 持续 | 跟踪 DSH 私有字段/时序 | 升级频率 |
| 失败 | 卸载与回退、核设置授权 | 恢复时长 |

| 结果 | 源码支持 | 未证明 |
| --- | --- | --- |
| 客户端分类 | 非 loopback 自写 ownsHost | 设置真实持久化 |
| 晚到兜底 | 改 isLoopback/hostFacts | 已抓旧状态的页面实时恢复 |
| 安全 | 插件无 host 服务端代码 | 远程未授权写入被拒 |

> **思考**：它对所有非 loopback、无既存 transport 的网页统一标记 host-owning，插件无 origin 白名单或身份校验；服务端 fence 保留仅作者声称，不能替代代理授权。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用短客户端补丁绕过反代域名的本地分类，恢复作者所述设置持久化路径；依赖 DSH 私有时序和字段。详见[Q02](#research-q02)。

没有 host 行为；immediate 客户端全局赋值依赖加载顺序，晚到使用 defineProperty 并清缓存。对全部非 loopback origin 适用，没有内部白名单；兼容性依赖宿主私有 API。

#### 反代入口与身份边界比较

围绕反向代理访问自管DSH，loopback-trust只在客户端把非loopback网页标成ownsHost并修改isLoopback事实，宿主apply为空，不提供身份认证；chicheng-gate包装宿主HTTP request/upgrade，按peer与cookie作门禁，另建须cookie的HTTP/WS隧道网关，并以备份文本替换官方客户端访问/设置文件。它们分别处理客户端持久化分类和入口准入，不能把设置可写或二者安装并存视为端到端授权成立。固定gate实现对直接loopback peer先放行，故反代若直入宿主端口且自身无认证，不能依赖该门禁；其SessionStore构造器收数字ttlSec，apply传对象，令新token exp为NaN、运行期过期比较不触发，不能无条件声称七天过期有效。上述为固定源码静态推导，未声称发生真实越权。维护取舍是客户端私有协议/加载时序耦合与服务端门禁、监听入口及官方文件补丁的恢复负担。进一步探讨应从统一服务端身份与origin绑定能力入手，逐项核对反代直入/隧道网关、匿名/已认证、HTTP/WS、过期/撤销及升级/卸载恢复；任何入口未授权仍有设置写能力即不支持组合访问边界假设，当前净收益与整体安全性未知。

依据包括 [6mt/dsh-plugin-loopback-trust/client.js](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/client.js#L24-L33)、[534119219/chicheng-gate/lib/index.js](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/lib/index.js#L156-L185)。

<a id="detail-section-5"></a>

### 1.4 主要限制

它对所有非 loopback、无既存 transport 的网页统一标记 host-owning，插件无 origin 白名单或身份校验；服务端 fence 保留仅作者声称，不能替代代理授权。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅受控反代部署且双层授权明确时试用；先查官方 trusted-host，验未授权浏览器被拒。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

插件源码确认自标记与晚到补丁；宿主真实授权、反代访问控制和跨版本效果未独立验证。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、package.json、client.js、index.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交核 README 中英、package、client.js、host 空入口；未执行插件、反代或 DSH host，也未验证宿主版本实现。
- 下一步：隔离反代比较原版、插件及官方开关；受控/未授权浏览器与不同 Host/Origin 测持久化、API 拒绝、首次/HMR/卸载。

**分析版本**

- **仓库**：[6mt/dsh-plugin-loopback-trust](https://github.com/6mt/dsh-plugin-loopback-trust)
- **版本号**：0.1.1（[固定提交 838ddf0](https://github.com/6mt/dsh-plugin-loopback-trust/tree/838ddf0d79fb977be896c6cb5dcd0bba68015832)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可由服务端授权后签发范围化的持久化 capability，避免客户端自宣告；双浏览器/Origin/Host 对照功能与拒绝率，尚未实现。详见[Q05](#research-q05)。

隔离反代比较原版、插件及官方开关；受控/未授权浏览器与不同 Host/Origin 测持久化、API 拒绝、首次/HMR/卸载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 224 | — | — | 1592 |
| .js | source | 2 | 74 | 37 | 34 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/6mt/dsh-plugin-loopback-trust/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/6mt/dsh-plugin-loopback-trust/issues?q=is%3Aissue+created%3A2026-09-22T05%3A29%3A48.982Z..2026-10-22T05%3A29%3A48.982Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/6mt/dsh-plugin-loopback-trust/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A29%3A48.982Z..2026-10-22T05%3A29%3A48.982Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断反代设置持久化补丁的实际机制和信任边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 反代域名下用户需要恢复什么，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

作者称 DSH 设置持久化因浏览器非 loopback hostname 降级到 memory，使反代域名上的模型设置页不可用。合格结果不仅是页面能打开和刷新后保存，还须确认该 origin 的访问控制与服务器实际授权一致，不能把客户端布尔值当身份认证。已有宿主 --trusted-host 若可覆盖客户端判断是替代；本轮只审插件与作者问题描述，未独立核对应 DSH 宿主版本。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:8-31](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/README.zh.md#L8-L31)

作者描述问题、兼容和效果。

<details>
<summary>查看原文（24行）</summary>

````text
## 问题

dsh 0.1.7 有意把设置页（尤其模型页）挂在一道 loopback 检查上：设置持久化只对
`127.0.0.1` / `localhost` / `::1` 打开的页面开放。

```js
// dsh-client-ui-settings
const persistence = ctx.remote.$host.isLoopback ? "host" : "memory";
```

`isLoopback` 由浏览器 hostname 判定。当 dsh 监听 `127.0.0.1:3080`、前面是
nginx（或任意反向代理）、你用域名打开界面时，页面被判定为非特权：设置静默降级
为内存模式，模型页报 *"settings are unavailable in this browser"*。

## 本插件做什么

把页面连接标记为 host-owning——与官方桌面端声明的同一事实——让设置页在
非 loopback origin 上保持 Host 持久化。聊天等其它功能本来就不受影响，行为
逐字节不变：插件只改变客户端连接状态里的一个布尔值。

- 挂在 boot 预取档，先于任何客户端插件 apply 执行
- 绝不覆盖真实（桌面端）transport；loopback 页面上不做任何事
- 零依赖、无宿主端代码，约 60 行客户端 JavaScript
- 需要 dsh **0.1.7 – 0.2.x**（`engines.dsh: ">=0.1.7 <0.3"`，已对 0.1.7 与 0.2.0-rc.2 验证）
````

</details>

**依据 2 · 作者声明**：[README.zh.md:61-75](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/README.zh.md#L61-L75)

作者验收步骤及代理访问控制提醒。

<details>
<summary>查看原文（15行）</summary>

```text
## 验证

1. 通过域名打开 设置 → 模型页：正常加载，无 "settings are unavailable"；
2. 改一项设置后刷新页面：改动持久保留；
3. 浏览器 console 无 `[loopback-trust] could not patch` 警告。

## 安全提示

loopback 门禁是刻意设计：设置写入（模型 provider、API key）只对宿主能绑到
loopback 的页面开放。安装本插件等于为你的部署宣告“这个 origin 可信”：

- 确保你的反向代理在该域名前面执行你期望的访问控制——dsh 的 `/api` Host
  fence 仍按原规则工作，未被改动；
- 不要在无保护的情况下把域名暴露给不可信网络；
- 若日后 dsh 的 `--trusted-host` 覆盖了客户端判定，请改用官方途径并卸载本插件。
```

</details>

**依据 3 · 源码核查**：[package.json:1-33](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/package.json#L1-L33)

web immediate 包声明。

<details>
<summary>查看原文（33行）</summary>

```text
{
  "name": "dsh-plugin-loopback-trust",
  "version": "0.1.1",
  "description": "Restore Host-persisted settings in dsh web behind a reverse proxy: marks the page's connection as host-owning so the settings/model pages work on non-loopback hostnames. · 反代部署下恢复 dsh 设置页的 host 持久化。",
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js"
  },
  "engines": {
    "dsh": ">=0.1.7 <0.3"
  },
  "keywords": [
    "deepseek",
    "harness",
    "dsh",
    "dsh-plugin",
    "reverse-proxy",
    "settings"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/6mt/dsh-plugin-loopback-trust.git"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true
    }
```

</details>

#### 缺口

- 未读取目标 DSH 固定版本客户端/服务端源码或运行反代。
  **影响**：问题复现、host fence 与实际保存链不独立成立。
  **进一步探讨**：隔离部署比较原版、插件版和官方 trusted-host 的设置持久化及访问拒绝。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 客户端补丁何时生效，相对反代部署增加了什么？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

包声明 web immediate；client.js 顶层 IIFE 在非 loopback hostname 且无既存 __DSH_TRANSPORT__ 时写入 {ownsHost:true}，并用模块加载器注册客户端插件。apply 时若 connection.isLoopback 仍非 true，则用 defineProperty 让 getter 恒 true 并尝试清 remote.hostFacts 缓存。host index.js 的 apply 为空。增量是绕过宿主客户端对反代域名的 loopback 分类，直接影响设置页选择 Host 持久化的前提；其正确性依赖 DSH 未承诺的内部加载时序和 connection 形状。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:26-34](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/package.json#L26-L34)

web immediately。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true
    }
  }
```

**依据 2 · 源码核查**：[client.js:24-33](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/client.js#L24-L33)

顶层 transport 标记条件。

<details>
<summary>查看原文（10行）</summary>

```text
(function () {
	var globals = globalThis;
	var LOOPBACK = /^(localhost|\[::1\]|127(\.\d{1,3}){3})$/;
	var hostname = typeof location === 'object' && location ? location.hostname : 'localhost';
	var pageIsLoopback = LOOPBACK.test(hostname);
	var desktopTransportPresent = globals.__DSH_TRANSPORT__ !== undefined;

	if (!pageIsLoopback && !desktopTransportPresent) {
		globals.__DSH_TRANSPORT__ = { ownsHost: true };
	}
```

</details>

**依据 3 · 源码核查**：[client.js:35-67](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/client.js#L35-L67)

晚到补丁与缓存清理。

<details>
<summary>查看原文（33行）</summary>

```text
	window.__ModuleLoader__.load({
		id: 'dsh-plugin-loopback-trust',
		factory() {
			return {
				/** Defensive in-order patch: if this plugin materialized after
				 *  dsh-client-connection already applied (ordering drift, HMR),
				 *  flip the live fact too and drop api-gateway's cached
				 *  $host snapshot so late readers see the trusted value.
				 *  Consumers that already captured `false` (ui-settings'
				 *  one-time persistence choice) still need one page reload. */
				inject: ['connection'],
				apply(ctx) {
					var connection = ctx.get('connection');
					if (connection === undefined || connection.isLoopback === true) return;
					try {
						Object.defineProperty(connection, 'isLoopback', {
							configurable: true,
							get: function () { return true; },
						});
					} catch (error) {
						console.warn('[loopback-trust] could not patch connection.isLoopback:', error);
						return;
					}
					var remote = ctx.get('remote');
					if (remote !== undefined && 'hostFacts' in remote) {
						try { remote.hostFacts = undefined; } catch (error) { /* best effort */ }
					}
					console.info('[loopback-trust] page marked as host-owning; a page reload guarantees settings pick host persistence from the start.');
				},
			};
		},
	});
})();
```

</details>

**依据 4 · 源码核查**：[index.js:1-7](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/index.js#L1-L7)

host 空实现。

```text
/** Host half of dsh-plugin-loopback-trust.
 *
 *  No host-side work: the entire fix lives in client.js, which must execute
 *  during the immediate-tier prefetch (before any client plugin applies) to
 *  mark the page's connection as host-owning. See README.md. */

export function apply() {}
```

**依据 5 · 作者声明**：[README.zh.md:42-59](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/README.zh.md#L42-L59)

作者对宿主内部时序的说明。

<details>
<summary>查看原文（18行）</summary>

````text
## 原理

`dsh-client-connection` 的客户端入口在插件启动时读
`globalThis.__DSH_TRANSPORT__`；带 `ownsHost: true` 的 transport 会使
`connection.isLoopback === true`。immediate 预取档的 bundle 脚本严格早于任何
插件 apply 执行，所以脚本顶层的赋值先于那次读取：

```js
globalThis.__DSH_TRANSPORT__ = { ownsHost: true };
```

假 transport 在其它所有地方都是惰性的：`rpc`/`fetch`/`openStream` 为
undefined 时回退 `globalThis.fetch`（与普通浏览器页面完全一致）；读
`streamBaseUrl` 的地方全部 `?.` + `document.baseURI` /
`window.location.origin` 兜底。插件 `apply` 里还有兜底：顺序漂移时直接补丁
活体的 `connection.isLoopback` 并失效 api-gateway 缓存的 `$host` 快照。

服务端 `/api` Host fence **未被触碰**。见[安全提示](#安全提示)。
````

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 它改变哪一道信任边界，未验证的安全假设是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

对任何非 loopback 网页 origin，只要该浏览器全局没有既存 transport，脚本就写 ownsHost:true；没有插件内 origin 白名单、反代身份校验或用户确认。因此装在一个无访问控制的公开域名会把所有到达该 UI 的浏览器客户端都标为 host-owning。作者称服务端 /api Host fence 未改、伪 transport 其他字段会回退，但本仓插件没有服务端实现也未验 DSH 依赖，这两点只能作为作者声称而非独立保证。apply 的 defineProperty 和缓存清理也不保证已抓取旧 false 的设置插件立即更新，作者承认可能需重载。应把反代访问控制和宿主授权视为必需前提。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:24-33](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/client.js#L24-L33)

所有非 loopback、无现存 transport 的页被标记。

<details>
<summary>查看原文（10行）</summary>

```text
(function () {
	var globals = globalThis;
	var LOOPBACK = /^(localhost|\[::1\]|127(\.\d{1,3}){3})$/;
	var hostname = typeof location === 'object' && location ? location.hostname : 'localhost';
	var pageIsLoopback = LOOPBACK.test(hostname);
	var desktopTransportPresent = globals.__DSH_TRANSPORT__ !== undefined;

	if (!pageIsLoopback && !desktopTransportPresent) {
		globals.__DSH_TRANSPORT__ = { ownsHost: true };
	}
```

</details>

**依据 2 · 源码核查**：[client.js:45-63](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/client.js#L45-L63)

晚到补丁、缓存、需重载。

<details>
<summary>查看原文（19行）</summary>

```text
				inject: ['connection'],
				apply(ctx) {
					var connection = ctx.get('connection');
					if (connection === undefined || connection.isLoopback === true) return;
					try {
						Object.defineProperty(connection, 'isLoopback', {
							configurable: true,
							get: function () { return true; },
						});
					} catch (error) {
						console.warn('[loopback-trust] could not patch connection.isLoopback:', error);
						return;
					}
					var remote = ctx.get('remote');
					if (remote !== undefined && 'hostFacts' in remote) {
						try { remote.hostFacts = undefined; } catch (error) { /* best effort */ }
					}
					console.info('[loopback-trust] page marked as host-owning; a page reload guarantees settings pick host persistence from the start.');
				},
```

</details>

**依据 3 · 作者声明**：[README.zh.md:53-59](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/README.zh.md#L53-L59)

作者称伪 transport 回退与服务端 fence 保留。

```text
假 transport 在其它所有地方都是惰性的：`rpc`/`fetch`/`openStream` 为
undefined 时回退 `globalThis.fetch`（与普通浏览器页面完全一致）；读
`streamBaseUrl` 的地方全部 `?.` + `document.baseURI` /
`window.location.origin` 兜底。插件 `apply` 里还有兜底：顺序漂移时直接补丁
活体的 `connection.isLoopback` 并失效 api-gateway 缓存的 `$host` 快照。

服务端 `/api` Host fence **未被触碰**。见[安全提示](#安全提示)。
```

**依据 4 · 作者声明**：[README.zh.md:67-75](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/README.zh.md#L67-L75)

作者承认代理访问控制要求。

```text
## 安全提示

loopback 门禁是刻意设计：设置写入（模型 provider、API key）只对宿主能绑到
loopback 的页面开放。安装本插件等于为你的部署宣告“这个 origin 可信”：

- 确保你的反向代理在该域名前面执行你期望的访问控制——dsh 的 `/api` Host
  fence 仍按原规则工作，未被改动；
- 不要在无保护的情况下把域名暴露给不可信网络；
- 若日后 dsh 的 `--trusted-host` 覆盖了客户端判定，请改用官方途径并卸载本插件。
```

#### 缺口

- 未核服务端 Host fence 与认证在部署拓扑中的行为。
  **影响**：不能证明远程不可信浏览器不能写设置。
  **进一步探讨**：对受控/未授权浏览器分别测 GET/POST 设置 API，核代理和 DSH 双层拒绝。
- 没有加载时序及 HMR 测试。
  **影响**：是否需刷新和功能回退概率未知。
  **进一步探讨**：在声明兼容的两个 DSH 版本比较首次加载、HMR、重载。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署和故障恢复有哪些条件与代价？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包声明 0.1.1 MIT、engines.dsh >=0.1.7 <0.3、web immediate；README 兼容段落却写“<0.2”，与 package 和前文 0.2.x 不一致。首次要配置反代访问控制、重启 dsh web 并强刷；持续需核升级时私有 __DSH_TRANSPORT__、connection.isLoopback 和 remote.hostFacts 结构是否仍成立。host 无代码、插件自身无网络调用，但安全工作转移到代理与 DSH host fence，不能说零运维成本。发生回归时卸载后应回到原本 memory 模式，而实际回退过程未测试。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-34](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/package.json#L1-L34)

版本和兼容范围。

<details>
<summary>查看原文（34行）</summary>

```text
{
  "name": "dsh-plugin-loopback-trust",
  "version": "0.1.1",
  "description": "Restore Host-persisted settings in dsh web behind a reverse proxy: marks the page's connection as host-owning so the settings/model pages work on non-loopback hostnames. · 反代部署下恢复 dsh 设置页的 host 持久化。",
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js"
  },
  "engines": {
    "dsh": ">=0.1.7 <0.3"
  },
  "keywords": [
    "deepseek",
    "harness",
    "dsh",
    "dsh-plugin",
    "reverse-proxy",
    "settings"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/6mt/dsh-plugin-loopback-trust.git"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true
    }
  }
```

</details>

**依据 2 · 作者声明**：[README.md:93-101](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/README.md#L93-L101)

文档另一处写 <0.2。

```text
## Compatibility

Hook points are dsh-0.1.7 internals (`__DSH_TRANSPORT__.ownsHost` semantics,
prefetch-tier timing, the `$host` cache) with no compatibility promise. The
package declares `engines.dsh: ">=0.1.7 <0.2"` so incompatible hosts refuse to
install rather than break silently. On breakage the symptom is loud (the
settings page returns to its unavailable state) — check
[dsh-client-connection](https://www.npmjs.com/package/@deepseek-ai/dsh-client-connection)
in your installed version and adjust `client.js` accordingly.
```

**依据 3 · 作者声明**：[README.zh.md:33-40](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/README.zh.md#L33-L40)

重启与强刷步骤。

````text
## 安装

```sh
dsh plugin --profile web add 6mt/dsh-plugin-loopback-trust
```

重启 `dsh web`（新 bundle 需要重新启动），浏览器强刷。插件在每次页面加载时
生效，界面中不出现任何元素。
````

**依据 4 · 源码核查**：[client.js:24-67](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/client.js#L24-L67)

依赖私有全局、模块加载器和属性。

<details>
<summary>查看原文（44行）</summary>

```text
(function () {
	var globals = globalThis;
	var LOOPBACK = /^(localhost|\[::1\]|127(\.\d{1,3}){3})$/;
	var hostname = typeof location === 'object' && location ? location.hostname : 'localhost';
	var pageIsLoopback = LOOPBACK.test(hostname);
	var desktopTransportPresent = globals.__DSH_TRANSPORT__ !== undefined;

	if (!pageIsLoopback && !desktopTransportPresent) {
		globals.__DSH_TRANSPORT__ = { ownsHost: true };
	}

	window.__ModuleLoader__.load({
		id: 'dsh-plugin-loopback-trust',
		factory() {
			return {
				/** Defensive in-order patch: if this plugin materialized after
				 *  dsh-client-connection already applied (ordering drift, HMR),
				 *  flip the live fact too and drop api-gateway's cached
				 *  $host snapshot so late readers see the trusted value.
				 *  Consumers that already captured `false` (ui-settings'
				 *  one-time persistence choice) still need one page reload. */
				inject: ['connection'],
				apply(ctx) {
					var connection = ctx.get('connection');
					if (connection === undefined || connection.isLoopback === true) return;
					try {
						Object.defineProperty(connection, 'isLoopback', {
							configurable: true,
							get: function () { return true; },
						});
					} catch (error) {
						console.warn('[loopback-trust] could not patch connection.isLoopback:', error);
						return;
					}
					var remote = ctx.get('remote');
					if (remote !== undefined && 'hostFacts' in remote) {
						try { remote.hostFacts = undefined; } catch (error) { /* best effort */ }
					}
					console.info('[loopback-trust] page marked as host-owning; a page reload guarantees settings pick host persistence from the start.');
				},
			};
		},
	});
})();
```

</details>

**依据 5 · 源码核查**：[index.js:1-7](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/index.js#L1-L7)

host 空实现。

```text
/** Host half of dsh-plugin-loopback-trust.
 *
 *  No host-side work: the entire fix lives in client.js, which must execute
 *  during the immediate-tier prefetch (before any client plugin applies) to
 *  mark the page's connection as host-owning. See README.md. */

export function apply() {}
```

#### 缺口

- 无真实反代运维和跨版本测试。
  **影响**：维护/回滚成本未知。
  **进一步探讨**：固定版本重启、更新、卸载与双浏览器权限验收并记录时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 应怎样采用，何种替代设计值得验证？

**研究主题**：新假设与验证、采用判断

#### 完整回答

仅在已受反代认证/网络限制、明确由同一操作者管理的部署中试用，并先检查官方 --trusted-host 是否已覆盖客户端分类。验收不能止于页面能存设置，还应检查未授权浏览器被代理或服务端拒绝。如果将来做正式修复，较窄的未实现假设是服务端经过授权验证后向前端提供有范围、可审计的 host-persistence capability，而不是所有非 loopback 页自行宣告 ownsHost；可用受控与未授权两浏览器、不同 Origin/Host、首次/HMR 路径比较功能与拒绝率。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:24-33](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/client.js#L24-L33)

现行自声明范围。

<details>
<summary>查看原文（10行）</summary>

```text
(function () {
	var globals = globalThis;
	var LOOPBACK = /^(localhost|\[::1\]|127(\.\d{1,3}){3})$/;
	var hostname = typeof location === 'object' && location ? location.hostname : 'localhost';
	var pageIsLoopback = LOOPBACK.test(hostname);
	var desktopTransportPresent = globals.__DSH_TRANSPORT__ !== undefined;

	if (!pageIsLoopback && !desktopTransportPresent) {
		globals.__DSH_TRANSPORT__ = { ownsHost: true };
	}
```

</details>

**依据 2 · 作者声明**：[README.zh.md:67-75](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/README.zh.md#L67-L75)

代理访问控制与官方途径提示。

```text
## 安全提示

loopback 门禁是刻意设计：设置写入（模型 provider、API key）只对宿主能绑到
loopback 的页面开放。安装本插件等于为你的部署宣告“这个 origin 可信”：

- 确保你的反向代理在该域名前面执行你期望的访问控制——dsh 的 `/api` Host
  fence 仍按原规则工作，未被改动；
- 不要在无保护的情况下把域名暴露给不可信网络；
- 若日后 dsh 的 `--trusted-host` 覆盖了客户端判定，请改用官方途径并卸载本插件。
```

**依据 3 · 作者声明**：[README.zh.md:61-65](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/README.zh.md#L61-L65)

作者功能验收步骤。

```text
## 验证

1. 通过域名打开 设置 → 模型页：正常加载，无 "settings are unavailable"；
2. 改一项设置后刷新页面：改动持久保留；
3. 浏览器 console 无 `[loopback-trust] could not patch` 警告。
```

#### 缺口

- 服务端签发/授权 capability 未实现。
  **影响**：不能当现行保护能力。
  **进一步探讨**：双浏览器/双 origin 故障矩阵测持久化、拒绝及误放行。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
