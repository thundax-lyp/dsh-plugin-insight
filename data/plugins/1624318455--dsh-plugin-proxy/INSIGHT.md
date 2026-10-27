# dsh-plugin-proxy

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[b5b5af2](https://github.com/1624318455/dsh-plugin-proxy/tree/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df)

<!-- BEGIN META -->
[![npm 30d 80](https://img.shields.io/static/v1?label=npm+30d&message=80&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-proxy)
<!-- END META -->

> **实现功能**：为DSH提供直连、系统及HTTP/SOCKS手工代理设置，切换Undici全局路由并可导出子进程环境。

> **核心亮点**：统一现成代理能力与设置、白名单和连接退休，减少逐插件配置。详见[Q01](#research-q01)。

> **风险与缺陷**：无效配置先撤旧代理再回baseline，恢复缺所有权比较，不能保证严格禁直连或跨插件恢复。详见[Q03](#research-q03)。

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
  - [Q01 · 代理设置解决什么场景，覆盖哪些流量？](#detail-section-11)
  - [Q02 · 路由和启动依赖如何组成？](#detail-section-12)
  - [Q03 · 切换和恢复为什么不能当隐私边界？](#detail-section-13)
  - [Q04 · 现有测试支持什么，成本如何分阶段？](#detail-section-14)
  - [Q05 · 适合怎样采用，继续探讨什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要集中配置DSH模型/搜索等出站代理的维护者。详见[Q01](#research-q01)。

进程启动环境或各组件显式代理；集中设置便利不等全流量隔离。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 三种模式 | 集中连通配置 | 系统探测有限 |
| noProxy | 内网绕过 | 不控制独立HTTP栈 |
| 热切换/导出 | 减少重启配置 | 全局竞争和旧子进程 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Node与Undici | 代理实现 | 锁定依赖下限较声明高 |
| settings/客户端slots | 配置卡片 | 宿主ABI需匹配 |
| 可信代理/系统配置 | 出站 | 失败回baseline |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 核对Node/所有权 | 维护者 | 单一全局管理者 |
| 配manual与白名单 | 用户 | 端点可信 |
| 核各调用方出口 | 维护者 | 不只看mode标签 |
| 切换/卸载查恢复 | 维护者 | 环境和基线路径正确 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 代理端点与兼容Node | 确认调用栈、白名单与单一管理者 | 代理收费依部署；调用栈/单管理者核查工时未知 |
| 持续使用 | 代理网络/连接池；无插件LLM调用 | 维护服务与核查延迟/出口 | 无插件LLM调用；代理服务费和延迟未统一计量 |
| 失败恢复 | 基线dispatcher与环境记录 | 查误出口、长流与子进程重启 | 旧池最多30秒窗口不等完整恢复耗时；出口与子进程需核 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 集中代理 | 全局Undici dispatcher | 其他HTTP栈可能绕过 |
| 热切换 | 新池/旧池退休 | 30秒后强断慢流 |
| 子进程跟随 | 环境导出 | 已运行进程不更新 |

> **思考**：无效配置先撤旧代理再回baseline，恢复缺所有权比较，不能保证严格禁直连或跨插件恢复。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一现成代理能力与设置、白名单和连接退休，减少逐插件配置。详见[Q01](#research-q01)。

统一现成代理能力与设置、白名单和连接退休，减少逐插件配置。详见[Q01](#research-q01)。

本地origin/proxy路径测试和独立engine可借鉴，需补所有权与失败策略。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

无效配置先撤旧代理再回baseline，恢复缺所有权比较，不能保证严格禁直连或跨插件恢复。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可信单一管理者且允许失败回原出口可试用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代理与本地请求测试可查，失败回baseline、全局所有权与Node下限不一致限制严格出口控制。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、package-lock.json、lib/index.js、lib/client.js、test/switch.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本host engine、env manager、系统探测、客户端设置卡片和切换测试，只读不执行。
- 下一步：进一步从无效配置、双管理者、末次同步后环境变更和长流探讨原子切换/所有权。

**分析版本**

- **仓库**：[1624318455/dsh-plugin-proxy](https://github.com/1624318455/dsh-plugin-proxy)
- **版本号**：0.1.3（[固定提交 b5b5af2](https://github.com/1624318455/dsh-plugin-proxy/tree/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df)）
- **版本日期**：2026-09-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究先构建再替换、失败关闭、dispatcher所有权和环境逐键恢复，比较误出口和恢复工时。当前未验证。详见[Q05](#research-q05)。

进一步从无效配置、双管理者、末次同步后环境变更和长流探讨原子切换/所有权。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 771 | 513 | 194 | — |
| .md | source | 2 | 361 | — | — | 2754 |
| .mjs | source | 2 | 373 | 280 | 47 | — |
| .mjs | test | 1 | 633 | 498 | 94 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1624318455/dsh-plugin-proxy/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/1624318455/dsh-plugin-proxy/issues?q=is%3Aissue+created%3A2026-09-22T05%3A53%3A34.138Z..2026-10-22T05%3A53%3A34.138Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1624318455/dsh-plugin-proxy/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A53%3A34.138Z..2026-10-22T05%3A53%3A34.138Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本全局代理的流量覆盖、切换失败与环境恢复能支持何种连通性需求？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 代理设置解决什么场景，覆盖哪些流量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要统一模型、搜索等出站网络的DSH维护者，通过设置卡片选直连、系统或手工HTTP/SOCKS代理，修改后重建Undici全局dispatcher，并可为未来子进程导出环境变量，减少逐插件重复设置。成功结果应是目标请求实际走指定代理、白名单走预期直连，切换时不误发旧出口。

贡献是把现成Undici代理、系统探测、NO_PROXY与设置生命周期接起来，不是新的代理协议或隔离技术。README和卡片将覆盖面写成全部进程内请求，但实现能直接控制的是使用全局Undici dispatcher的调用；自带dispatcher、其他HTTP栈、独立浏览器及已经启动的子进程不能据此保证。环境变量也只是一种下游约定，不保证工具遵守。替代为进程启动环境或各组件显式代理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-38](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/README.md#L18-L38)

作者的统一代理和热切换主张。

<details>
<summary>查看原文（21行）</summary>

```text
`@memef1f1y/dsh-plugin-proxy` is a DeepSeek Harness plugin that routes **every
in-process outbound request** — LLM providers, `web_search` / `web_fetch`,
streamable-http MCP — through an HTTP(S) CONNECT or SOCKS5 proxy, and lets
you **flip the proxy on, off, or to another server at runtime**, with zero
restarts, by editing one section of `$DSH_HOME/settings.yaml` (hot-reloaded)
or the web settings card. The demo above is a real recording:
`node scripts/demo.mjs` after install.

## Features

- **Runtime switching** — `direct` / `system` / `manual` routing flips on
  every settings save; retired dispatchers close gracefully (force-destroyed
  after 30 s), so old keep-alive connections actually go away.
- **Web settings card** — the same section is editable under **Settings →
  Plugins → Plugin configuration**, bilingual (zh/en), no restart either way.
- **Single matcher for both protocols** — HTTP and SOCKS5 share one
  `RoutingDispatcher`, so `noProxy` semantics are identical on both legs.
- **Child-process follow-along** — `exportEnv` (default on) publishes
  `HTTP(S)_PROXY` / `NO_PROXY` to processes spawned after the switch
  (bash-tool `curl`/`git`, stdio MCP servers) without clobbering values you
  set yourself; everything is restored on disable/unload.
```

</details>

**依据 2 · 作者声明**：[README.md:119-130](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/README.md#L119-L130)

独立浏览器与已运行子进程例外。

<details>
<summary>查看原文（12行）</summary>

```text
| Traffic | Routed? |
| --- | --- |
| LLM providers via pi-ai (`zai-coding-cn`, custom openai-compatible routes, …) | ✅ |
| `dsh-llm-deepseek` (deepseek-official) | ✅ |
| `web_search` / `web_fetch` | ✅ |
| streamable-http MCP servers | ✅ |
| stdio MCP servers, bash-tool subprocesses (`curl`, `git`, …) | ✅ via exported env, for processes spawned after the switch |
| pi-ai Bedrock route | ⚠️ AWS SDK manages its own proxying (`HTTPS_PROXY` env is honored there) |
| Built-in browser host / browser downloads | ❌ separate process, configure the browser itself |

Child processes already running when you flip the switch keep the env they
were spawned with; undici's SOCKS5 agent is currently marked experimental
```

</details>

**依据 3 · 源码核查**：[lib/index.js:553-556](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/lib/index.js#L553-L556)

实际设置global dispatcher。

```text
		setGlobalDispatcher(dispatcher);
		env.sync(effective);
		const rules = effective.noProxy?.length ? `, noProxy ${effective.noProxy.length} rule(s)` : '';
		log('info', `dsh-proxy: routing global fetch via ${redact(effective.proxy)}${rules}`);
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 路由和启动依赖如何组成？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

配置规范化把旧enabled迁移为mode，默认direct；manual解析URL并将socks/socks5h规范为socks5，RoutingDispatcher按origin的host/port匹配noProxy，分别交给直连Agent与代理Agent。匹配域名带点边界，避免简单后缀误命中，支持全通配和端口；HTTP与SOCKS复用绕过逻辑。system先看环境HTTP/HTTPS_PROXY，均缺失才看ALL_PROXY，macOS还同步调用scutil取静态代理，没有PAC解释器或Windows注册表完整实现。

宿主settings安装配置、变更回调重应用，dispose恢复；客户端依赖slots/locale/settingsScope和React的外部模块加载格式。package声明Node>=20，锁文件实际Undici 8.10.2要求Node>=22.19.0，按package最低版本部署可能不能满足锁定依赖，必须按宿主实际Node对齐。SOCKS远程DNS语义不能只由协议字符串规范化推出。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:59-78](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/lib/index.js#L59-L78)

模式迁移。

<details>
<summary>查看原文（20行）</summary>

```text
export function resolveMode(config) {
	const mode = config?.mode;
	if (PROXY_MODES.includes(mode)) return mode;
	return config?.enabled === true ? 'manual' : 'direct';
}

/**
 * Normalize a resolved section into the effective config the engine consumes.
 * Backward compatible: `{ enabled: true, proxy }` still means manual mode.
 * @param config - resolved section or raw entry object.
 * @returns { mode, proxy, noProxy, exportEnv }.
 */
export function resolveConfig(config) {
	const source = config ?? {};
	return {
		mode: resolveMode(source),
		proxy: source.proxy,
		noProxy: source.noProxy ?? [],
		exportEnv: source.exportEnv ?? true
	};
```

</details>

**依据 2 · 源码核查**：[lib/index.js:129-151](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/lib/index.js#L129-L151)

host规则。

<details>
<summary>查看原文（23行）</summary>

```text
export function matchesNoProxy(hostname, port, rules) {
	const host = String(hostname ?? '').toLowerCase();
	if (!host || !rules?.length) return false;
	const portNumber = port == null ? null : Number(port);
	for (const rawRule of rules) {
		const rule = String(rawRule ?? '').trim().toLowerCase();
		if (!rule) continue;
		if (rule === '*') return true;
		let candidate = rule;
		let rulePort = null;
		const colon = rule.lastIndexOf(':');
		if (colon !== -1 && rule.indexOf(':') === colon) {
			candidate = rule.slice(0, colon);
			rulePort = rule.slice(colon + 1);
		}
		if (candidate.startsWith('[') && candidate.endsWith(']')) candidate = candidate.slice(1, -1);
		if (candidate.startsWith('.')) candidate = candidate.slice(1);
		if (candidate.startsWith('*.')) candidate = candidate.slice(2);
		if (!candidate) continue;
		if (rulePort !== null && Number(rulePort) !== portNumber) continue;
		if (host === candidate || host.endsWith('.' + candidate)) return true;
	}
	return false;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:184-231](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/lib/index.js#L184-L231)

规范化和分发。

<details>
<summary>查看原文（48行）</summary>

```text
function normalizeProxyUrl(raw) {
	const url = new URL(raw);
	const rawProtocol = url.protocol.replace(/:$/, '').toLowerCase();
	const protocol = PROTOCOL_ALIASES[rawProtocol] ?? rawProtocol;
	if (!Object.hasOwn(PROXY_AGENT_FACTORIES, protocol)) {
		throw new Error(`unsupported proxy protocol "${protocol}" (use http/https/socks5/socks5h)`);
	}
	url.protocol = `${protocol}:`;
	return { url: url.href, protocol };
}

/**
 * Dispatcher that sends matching origins direct and everything else through
 * a proxy dispatcher (needed for SOCKS, where undici has no built-in noProxy).
 */
class RoutingDispatcher extends Dispatcher {
	/** Marker so hosts/probes can recognize dsh-proxy dispatchers. */
	static kind = 'dsh-proxy';

	#direct;
	#proxied;
	#rules;

	constructor(direct, proxied, rules) {
		super();
		this.#direct = direct;
		this.#proxied = proxied;
		this.#rules = rules;
	}

	dispatch(options, handler) {
		const parts = originParts(options?.origin);
		const bypass = parts !== null && matchesNoProxy(parts.hostname, parts.port, this.#rules);
		return (bypass ? this.#direct : this.#proxied).dispatch(options, handler);
	}

	/** Fan a lifecycle call out to both inner dispatchers. */
	#fan(method) {
		return Promise.allSettled([this.#direct[method](), this.#proxied[method]()]).then(() => {});
	}

	close() {
		return this.#fan('close');
	}

	destroy() {
		return this.#fan('destroy');
	}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:332-369](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/lib/index.js#L332-L369)

系统探测。

<details>
<summary>查看原文（38行）</summary>

```text
export function detectSystemProxy(platform = process.platform, env = process.env) {
	let httpProxy = env?.HTTP_PROXY || env?.http_proxy;
	let httpsProxy = env?.HTTPS_PROXY || env?.https_proxy;
	const noProxy = parseNoProxyList(env?.NO_PROXY ?? env?.no_proxy);

	// curl-style catch-all: honored only when the per-protocol vars are absent.
	// http(s) ALL_PROXY serves both legs; socks* ALL_PROXY routes via SOCKS5.
	const allProxy = env?.ALL_PROXY || env?.all_proxy;
	let socksProxy;
	if (allProxy && !httpProxy && !httpsProxy) {
		let scheme = '';
		try {
			scheme = new URL(allProxy).protocol.replace(/:$/, '').toLowerCase();
		} catch {
			scheme = '';
		}
		if (scheme === 'socks' || scheme === 'socks5' || scheme === 'socks5h') socksProxy = normalizeProxyUrl(allProxy).url;
		else {
			httpProxy = allProxy;
			httpsProxy = allProxy;
		}
	}

	if (httpProxy || httpsProxy) return { httpProxy, httpsProxy, socksProxy, noProxy, pac: false };
	if (socksProxy) return { httpProxy: undefined, httpsProxy: undefined, socksProxy, noProxy, pac: false };

	if (platform === 'darwin') {
		try {
			const text = execFileSync('scutil', ['--proxy'], { encoding: 'utf8', timeout: 5000 });
			const detected = parseScutilProxy(text);
			// PAC/WPAD scripts cannot be executed here; report nothing usable.
			if (detected.pac && !detected.httpProxy && !detected.httpsProxy && !detected.socksProxy) return null;
			return detected;
		} catch {
			return null;
		}
	}

```

</details>

**依据 5 · 源码核查**：[lib/index.js:597-615](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/lib/index.js#L597-L615)

宿主安装生命周期。

<details>
<summary>查看原文（19行）</summary>

```text
export function apply(ctx, config = {}) {
	const engine = createEngine(ctx?.logger);
	const entry = Config(config);
	let getConfig = () => entry;

	// Entry-level default (proxy off) keeps the host usable without settings.
	engine.apply(entry);

	ctx.inject?.(['settings'], (settingsCtx) => {
		settingsCtx.settings.installSection(ctx, PROXY_SETTINGS_NAMESPACE, Config, entry, {
			setSource: (get) => {
				getConfig = get;
			},
			onChange: () => engine.apply(getConfig())
		});
	});

	ctx.on?.('dispose', () => engine.restore());
}
```

</details>

**依据 6 · 源码核查**：[package-lock.json:73-80](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/package-lock.json#L73-L80)

锁定Undici版本与Node。

```text
    "node_modules/undici": {
      "version": "8.10.2",
      "resolved": "https://registry.npmjs.org/undici/-/undici-8.10.2.tgz",
      "integrity": "sha512-/y4/bH9YNU5hi9NIrpOuvGXFcxrj3CMrV+/AYpowAYTpHn8gX/XPFjNy766FPoYY0miQhdW977JFWKGNhBdwyQ==",
      "license": "MIT",
      "engines": {
        "node": ">=22.19.0"
      }
```

**依据 7 · 源码核查**：[package.json:1-40](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/package.json#L1-L40)

包与宿主声明。

<details>
<summary>查看原文（40行）</summary>

```text
{
  "name": "@memef1f1y/dsh-plugin-proxy",
  "version": "0.1.3",
  "description": "Runtime-switchable outbound proxy for the DeepSeek Harness: hot-reload HTTP(S)/SOCKS5 routing for every global-fetch request via a settings section (+ web settings card).",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "proxy",
    "socks5",
    "undici"
  ],
  "publishConfig": {
    "access": "public"
  },
  "scripts": {
    "test": "node --check lib/index.js && node --check lib/client.js && node --test test/switch.test.mjs"
  },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "scripts/demo.mjs",
    "docs/assets/proxy-switch-demo.gif",
    "README.md",
    "README.zh.md"
  ],
  "engines": {
    "node": ">=20"
```

</details>

#### 缺口

- 目标宿主的实际Node和Undici共用全局dispatcher契约未由插件自身固定
  **影响**：版本下限与全局路由覆盖可能不同于配置描述
  **进一步探讨**：对齐宿主Node、安装锁与关键调用方是否显式指定dispatcher

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 切换和恢复为什么不能当隐私边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

engine首次保存既有全局dispatcher作为baseline，每次apply先撤销旧dispatcher再验证新配置；无效URL、缺少proxy、系统探测失败会回baseline，而非保持最后有效代理或拒绝出站。baseline可能已有其他代理，所以direct也不是强制新建纯直连。对要求不能直连的场景，这种失败回退会违反预期，不能把配置标签当防泄漏保证。

全局dispatcher没有所有权比较，卸载时只要本实例仍标记installed就恢复首次baseline，未比较当前全局dispatcher所有权，可能覆盖后来管理者；多实例同样会互相影响。环境导出在sync时采纳操作者改值，但restore只恢复上次保存快照，若操作者在最后sync之后修改，卸载仍可能覆盖它。旧连接先close，30秒后强制destroy，慢流在切换时可能中断。成功日志掩码URL用户名密码有对应测试，但构造失败直接记录error.message，不能宣称任意第三方异常均脱敏。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:413-478](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/lib/index.js#L413-L478)

环境快照和连接退休。

<details>
<summary>查看原文（66行）</summary>

```text
function createEnvManager() {
	let snapshot = null;
	let exported = {};

	/** Drop everything this engine exported, restoring adopted values. */
	function restore() {
		if (!snapshot) return;
		restoreEnv(snapshot);
		snapshot = null;
		exported = {};
	}

	/**
	 * Export proxy env vars for child processes (never clobbering operator
	 * values) or, when the active config stops asking for export, restore.
	 * Env export is a manual-mode concept only — system mode must not write
	 * the vars it is reading.
	 * @param effective - normalized config: { mode, proxy, noProxy, exportEnv }.
	 */
	function sync(effective) {
		if (effective.mode !== 'manual' || !effective.proxy || effective.exportEnv === false) {
			restore();
			return;
		}
		const next = snapshot ?? snapshotEnv();
		const noProxy = effective.noProxy?.length ? effective.noProxy.join(',') : undefined;
		for (const key of PROXY_ONLY_ENV_KEYS) {
			const slot = envSlot(key);
			adoptOperatorValue(next, slot);
			if (next[slot] === null) {
				process.env[slot] = effective.proxy;
				exported[slot] = effective.proxy;
			}
		}
		for (const key of NO_PROXY_ENV_KEYS) {
			const slot = envSlot(key);
			adoptOperatorValue(next, slot);
			if (next[slot] !== null) continue;
			if (noProxy) {
				process.env[slot] = noProxy;
				exported[slot] = noProxy;
			} else {
				delete process.env[slot]; // clear a previously exported bypass list
				delete exported[slot];
			}
		}
		snapshot = next;
	}

	/** Preserve a value the operator set mid-session instead of clobbering it. */
	function adoptOperatorValue(next, key) {
		const live = process.env[key];
		if (next[key] === null && live !== undefined && live !== exported[key]) next[key] = live;
	}

	return { sync, restore };
}

/** Gracefully retire a replaced dispatcher, then force-close leftovers. */
function retire(dispatcher) {
	Promise.resolve(dispatcher.close?.()).catch(() => {});
	const timer = setTimeout(() => {
		Promise.resolve(dispatcher.destroy?.()).catch(() => {});
	}, RETIRE_DESTROY_MS);
	timer.unref?.();
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:486-550](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/lib/index.js#L486-L550)

先撤销后构建与失败回baseline。

<details>
<summary>查看原文（65行）</summary>

```text
export function createEngine(logger) {
	let baseline;
	let installed = null;
	const env = createEnvManager();

	function log(level, message) {
		logger?.[level]?.(message);
	}

	function apply(config) {
		const effective = resolveConfig(config);
		if (baseline === undefined) baseline = getGlobalDispatcher();
		if (installed) {
			const retired = installed;
			installed = null;
			setGlobalDispatcher(baseline);
			retire(retired);
		}

		if (effective.mode === 'direct') {
			env.restore();
			log('info', 'dsh-proxy: direct (mode: direct)');
			return;
		}

		if (effective.mode === 'system') {
			// Never let our own earlier env export pollute the system-proxy read.
			env.restore();
			let detected;
			try {
				detected = detectSystemProxy();
			} catch (error) {
				log('error', `dsh-proxy: cannot read the system proxy, staying direct — ${error.message}`);
				return;
			}
			if (!detected || (!detected.httpProxy && !detected.httpsProxy && !detected.socksProxy)) {
				log('info', 'dsh-proxy: no usable system proxy — staying direct');
				return;
			}
			let dispatcher;
			try {
				dispatcher = buildSystemDispatcher(detected);
			} catch (error) {
				log('error', `dsh-proxy: cannot follow the system proxy, staying direct — ${error.message}`);
				return;
			}
			installed = dispatcher;
			setGlobalDispatcher(dispatcher);
			log('info', `dsh-proxy: following system proxy (${describeSystemProxy(detected)})`);
			return;
		}

		// manual
		if (!effective.proxy) {
			env.restore();
			log('error', 'dsh-proxy: manual mode without a proxy URL — staying direct');
			return;
		}
		let dispatcher;
		try {
			dispatcher = buildDispatcher(effective);
		} catch (error) {
			env.restore();
			log('error', `dsh-proxy: invalid configuration, staying direct — ${error.message}`);
			return;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:559-587](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/lib/index.js#L559-L587)

无条件恢复和日志。

<details>
<summary>查看原文（29行）</summary>

```text
	function restore() {
		if (baseline !== undefined && installed) {
			setGlobalDispatcher(baseline);
			retire(installed);
			installed = null;
		}
		env.restore();
	}

	return { apply, restore };
}

/** Human-readable summary of a detected system proxy for the switch log. */
function describeSystemProxy(detected) {
	const url = detected.httpProxy ?? detected.httpsProxy ?? detected.socksProxy;
	const parts = [url ? redact(url) : 'direct'];
	if (detected.noProxy?.length) parts.push(`noProxy ${detected.noProxy.length} rule(s)`);
	return parts.join(', ');
}

/** Mask userinfo in a proxy URL before logging it. */
function redact(proxyUrl) {
	try {
		const url = new URL(proxyUrl);
		if (url.username || url.password) return `${url.protocol}//***@${url.host}`;
		return url.href;
	} catch {
		return '<invalid url>';
	}
```

</details>

**依据 4 · 源码核查**：[test/switch.test.mjs:492-516](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/test/switch.test.mjs#L492-L516)

失败直连及恢复基线的测试意图。

<details>
<summary>查看原文（25行）</summary>

```text
test('invalid or incomplete config keeps traffic direct', async (t) => {
	const origin = await startOrigin();
	t.after(() => close(origin.server));

	const engine = createEngine(null);
	t.after(() => engine.restore());

	engine.apply({ enabled: true, proxy: 'ftp://nope:21' });
	const body = await (await fetch(origin.url)).json();
	assert.equal(body.via, 'origin');

	engine.apply({ enabled: true });
	const again = await (await fetch(origin.url)).json();
	assert.equal(again.via, 'origin');
});

test('restore returns the original global dispatcher', (t) => {
	const before = getGlobalDispatcher();
	const engine = createEngine(null);
	t.after(() => engine.restore());
	engine.apply({ enabled: true, proxy: 'http://127.0.0.1:9', exportEnv: false });
	assert.notEqual(getGlobalDispatcher(), before);
	engine.restore();
	assert.equal(getGlobalDispatcher(), before);
});
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 现有测试支持什么，成本如何分阶段？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

测试使用本地origin和代理服务，检查实际请求路径、IPv6绕过、环境导出、切换与恢复，比只断言配置对象更有价值；本次只读测试而未运行。中途操作者覆盖环境的测试是在第二次apply采纳后才disable，不能覆盖最后一次sync后直接卸载的竞争。凭据掩码测试覆盖成功构造SOCKS日志，不是所有错误输出。源码以独立engine和env manager拆分，便于构造生命周期反例。

首次需要可信代理、Node/宿主ABI核对、确认哪些调用方采用全局dispatcher，并配置内网白名单。持续没有LLM调用，本地连接池/一次系统探测和代理网络为主要资源，代理服务收费与延迟取决部署而无统一量化。切换增加旧池最多30秒退休窗口；失败恢复要分辨baseline实际是谁、环境是否被外部改动及子进程是否需重启，不能仅把mode改为direct即认定全部出口恢复。

#### 证据与依据

**依据 1 · 源码核查**：[test/switch.test.mjs:1-70](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/test/switch.test.mjs#L1-L70)

本地服务与环境隔离测试辅助。

<details>
<summary>查看原文（70行）</summary>

```text
import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import net from 'node:net';
import { Agent, EnvHttpProxyAgent, Socks5ProxyAgent, getGlobalDispatcher } from 'undici';

import {
	matchesNoProxy,
	buildDispatcher,
	buildSystemDispatcher,
	parseScutilProxy,
	detectSystemProxy,
	parseNoProxyList,
	resolveMode,
	resolveConfig,
	createEngine,
	PROXY_ENV_KEYS
} from '../lib/index.js';

/* ---------------------------------------------------------------- helpers */

function listen(server) {
	return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function close(server) {
	return new Promise((resolve) => server.close(() => resolve()));
}

/** Remove proxy env keys for a test, restoring them in t.after. */
function isolateProxyEnv(t) {
	const saved = {};
	for (const key of PROXY_ENV_KEYS) {
		saved[key] = process.env[key];
		delete process.env[key];
	}
	t.after(() => {
		for (const [key, value] of Object.entries(saved)) {
			if (value === undefined) delete process.env[key];
			else process.env[key] = value;
		}
	});
}

/** Plain origin server that echoes how the request reached it. */
async function startOrigin() {
	const server = http.createServer((req, res) => {
		res.writeHead(200, { 'content-type': 'application/json' });
		res.end(JSON.stringify({ via: 'origin', path: req.url }));
	});
	await listen(server);
	return { server, url: `http://127.0.0.1:${server.address().port}` };
}

/** Minimal forwarding HTTP proxy that records every absolute-form request. */
async function startHttpProxy() {
	const seen = [];
	const server = http.createServer((req, res) => {
		seen.push(req.url);
		try {
			const target = new URL(req.url);
			const upstream = http.request(
				{
					hostname: target.hostname,
					port: target.port,
					path: target.pathname + target.search,
					method: req.method,
					headers: req.headers
				},
				(up) => {
```

</details>

**依据 2 · 源码核查**：[test/switch.test.mjs:592-633](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/test/switch.test.mjs#L592-L633)

环境采纳及SOCKS成功日志测试。

<details>
<summary>查看原文（42行）</summary>

```text
test('operator values set mid-session are adopted, not clobbered', (t) => {
	isolateProxyEnv(t);

	const engine = createEngine(null);
	t.after(() => engine.restore());

	engine.apply({ enabled: true, proxy: 'http://first:9' });
	assert.equal(process.env.HTTP_PROXY, 'http://first:9');

	// operator overrides our exported value mid-session
	process.env.HTTP_PROXY = 'http://operator-mid:1';

	// hot switch to another proxy must not clobber the operator value
	engine.apply({ enabled: true, proxy: 'http://second:9' });
	assert.equal(process.env.HTTP_PROXY, 'http://operator-mid:1');

	// disabling restores the operator value, not ours
	engine.apply({ enabled: false });
	assert.equal(process.env.HTTP_PROXY, 'http://operator-mid:1');
	delete process.env.HTTP_PROXY;
});

test('proxy URL credentials are redacted in logs', () => {
	const messages = [];
	const engine = createEngine({
		info: (message) => messages.push(message),
		error: (message) => messages.push(message)
	});
	try {
		engine.apply({ enabled: true, proxy: 'socks5://alice:s3cret@127.0.0.1:1080', exportEnv: false });
		assert.equal(messages.length, 1);
		assert.match(messages[0], /socks5:\/\/\*\*\*@127\.0\.0\.1:1080/);
		assert.ok(!messages[0].includes('alice'));
		assert.ok(!messages[0].includes('s3cret'));
	} finally {
		engine.restore();
	}
});

test('SOCKS proxy URLs with credentials construct a SOCKS5 agent', () => {
	assert.ok(buildDispatcher({ enabled: true, proxy: 'socks5://alice:s3cret@127.0.0.1:1080' }) instanceof Socks5ProxyAgent);
});
```

</details>

**依据 3 · 源码核查**：[lib/index.js:471-478](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/lib/index.js#L471-L478)

30秒连接退休。

```text
/** Gracefully retire a replaced dispatcher, then force-close leftovers. */
function retire(dispatcher) {
	Promise.resolve(dispatcher.close?.()).catch(() => {});
	const timer = setTimeout(() => {
		Promise.resolve(dispatcher.destroy?.()).catch(() => {});
	}, RETIRE_DESTROY_MS);
	timer.unref?.();
}
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 适合怎样采用，继续探讨什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合可信单用户、只有一个全局代理管理者、容许无效配置回既有出口的普通连通性需求进行试用；先固定宿主Node，确认manual端点和noProxy，再分别检查模型/搜索/新子进程。需要强制所有流量只走代理、多个插件竞争dispatcher或不能容忍长流中断的部署应暂缓。发现错误配置后改出口、卸载覆盖操作者变量或慢流被销毁时回到启动级代理配置并核对实际网络路径。

可以研究先构建验证新dispatcher再原子替换，增加显式失败关闭策略、所有权租约和环境逐键compare-before-restore。基线为当前先撤销和保存baseline，比较无效新地址、两管理者交替加载、末次sync后外部修改变量、超过30秒流与独立HTTP栈，观察误出口、被覆盖次数、断流和恢复工时。该方向尚未验证，不将本地请求测试扩大成全宿主网络保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:486-565](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/lib/index.js#L486-L565)

当前切换和恢复基线。

<details>
<summary>查看原文（80行）</summary>

```text
export function createEngine(logger) {
	let baseline;
	let installed = null;
	const env = createEnvManager();

	function log(level, message) {
		logger?.[level]?.(message);
	}

	function apply(config) {
		const effective = resolveConfig(config);
		if (baseline === undefined) baseline = getGlobalDispatcher();
		if (installed) {
			const retired = installed;
			installed = null;
			setGlobalDispatcher(baseline);
			retire(retired);
		}

		if (effective.mode === 'direct') {
			env.restore();
			log('info', 'dsh-proxy: direct (mode: direct)');
			return;
		}

		if (effective.mode === 'system') {
			// Never let our own earlier env export pollute the system-proxy read.
			env.restore();
			let detected;
			try {
				detected = detectSystemProxy();
			} catch (error) {
				log('error', `dsh-proxy: cannot read the system proxy, staying direct — ${error.message}`);
				return;
			}
			if (!detected || (!detected.httpProxy && !detected.httpsProxy && !detected.socksProxy)) {
				log('info', 'dsh-proxy: no usable system proxy — staying direct');
				return;
			}
			let dispatcher;
			try {
				dispatcher = buildSystemDispatcher(detected);
			} catch (error) {
				log('error', `dsh-proxy: cannot follow the system proxy, staying direct — ${error.message}`);
				return;
			}
			installed = dispatcher;
			setGlobalDispatcher(dispatcher);
			log('info', `dsh-proxy: following system proxy (${describeSystemProxy(detected)})`);
			return;
		}

		// manual
		if (!effective.proxy) {
			env.restore();
			log('error', 'dsh-proxy: manual mode without a proxy URL — staying direct');
			return;
		}
		let dispatcher;
		try {
			dispatcher = buildDispatcher(effective);
		} catch (error) {
			env.restore();
			log('error', `dsh-proxy: invalid configuration, staying direct — ${error.message}`);
			return;
		}
		installed = dispatcher;
		setGlobalDispatcher(dispatcher);
		env.sync(effective);
		const rules = effective.noProxy?.length ? `, noProxy ${effective.noProxy.length} rule(s)` : '';
		log('info', `dsh-proxy: routing global fetch via ${redact(effective.proxy)}${rules}`);
	}

	function restore() {
		if (baseline !== undefined && installed) {
			setGlobalDispatcher(baseline);
			retire(installed);
			installed = null;
		}
		env.restore();
```

</details>

**依据 2 · 源码核查**：[lib/index.js:413-478](https://github.com/1624318455/dsh-plugin-proxy/blob/b5b5af209e7bd36a6a7008db703a4a9d6d67c1df/lib/index.js#L413-L478)

环境与流退休约束。

<details>
<summary>查看原文（66行）</summary>

```text
function createEnvManager() {
	let snapshot = null;
	let exported = {};

	/** Drop everything this engine exported, restoring adopted values. */
	function restore() {
		if (!snapshot) return;
		restoreEnv(snapshot);
		snapshot = null;
		exported = {};
	}

	/**
	 * Export proxy env vars for child processes (never clobbering operator
	 * values) or, when the active config stops asking for export, restore.
	 * Env export is a manual-mode concept only — system mode must not write
	 * the vars it is reading.
	 * @param effective - normalized config: { mode, proxy, noProxy, exportEnv }.
	 */
	function sync(effective) {
		if (effective.mode !== 'manual' || !effective.proxy || effective.exportEnv === false) {
			restore();
			return;
		}
		const next = snapshot ?? snapshotEnv();
		const noProxy = effective.noProxy?.length ? effective.noProxy.join(',') : undefined;
		for (const key of PROXY_ONLY_ENV_KEYS) {
			const slot = envSlot(key);
			adoptOperatorValue(next, slot);
			if (next[slot] === null) {
				process.env[slot] = effective.proxy;
				exported[slot] = effective.proxy;
			}
		}
		for (const key of NO_PROXY_ENV_KEYS) {
			const slot = envSlot(key);
			adoptOperatorValue(next, slot);
			if (next[slot] !== null) continue;
			if (noProxy) {
				process.env[slot] = noProxy;
				exported[slot] = noProxy;
			} else {
				delete process.env[slot]; // clear a previously exported bypass list
				delete exported[slot];
			}
		}
		snapshot = next;
	}

	/** Preserve a value the operator set mid-session instead of clobbering it. */
	function adoptOperatorValue(next, key) {
		const live = process.env[key];
		if (next[key] === null && live !== undefined && live !== exported[key]) next[key] = live;
	}

	return { sync, restore };
}

/** Gracefully retire a replaced dispatcher, then force-close leftovers. */
function retire(dispatcher) {
	Promise.resolve(dispatcher.close?.()).catch(() => {});
	const timer = setTimeout(() => {
		Promise.resolve(dispatcher.destroy?.()).catch(() => {});
	}, RETIRE_DESTROY_MS);
	timer.unref?.();
}
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
