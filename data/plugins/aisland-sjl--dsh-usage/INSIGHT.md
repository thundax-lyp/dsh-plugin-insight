# dsh-usage

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[e4f15bb](https://github.com/Aisland-SJL/dsh-usage/tree/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a)

<!-- BEGIN META -->
[![GitHub ★ 143](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=143&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aisland-SJL/dsh-usage)
<!-- END META -->

> **功能**：在 DSH Web 中展示会话 Token 用量与供应商余额。

> **亮点**：[Q01](#research-q01) 将事件桶和账号状态并置，保留重试计量口径。

> **主要限制**：[Q02](#research-q02) 部署代理及上游适配器影响真实边界。

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
  - [Q01 · 用量与余额如何分开？](#detail-section-11)
  - [Q02 · 连接防护覆盖哪些风险？](#detail-section-12)
  - [Q03 · 如何做隔离试用？](#detail-section-13)
  - [Q04 · 如何呈现不完整报告？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要并排核对本地会话用量和账号余额的 DSH 开发者。

逐个打开供应商页面并手工查看会话统计。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 用量面板 | 比较本地使用量 | 受事件口径及覆盖限制 |
| 余额查询 | 查看供应商账号 | 需允许的 HTTPS 端点和凭据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH | 必需 | 提供会话和 Web 接线 | 手工核对 |
| 供应商凭据 | 余额需要 | 授权 HTTPS 请求 | 关闭余额 |
| 独立 Claude 与 DSH 目录 | 隔离测试需要 | 保护原数据 | 先核对路径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户设独立目录并关闭余额 | 只用虚拟会话 |
| 验证 | 操作者对照日志和报告 | 解释重试及覆盖 |
| 退出 | 用户停用插件并查缓存 | 保留需要的资料 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主资源未知 | 准备独立目录 | 未测 |
| 持续 | 扫描缓存和请求资源未知 | 核对供应商 | 取决于账户 |
| 恢复 | 重建缓存成本未知 | 检查部分覆盖 | 不将缺失当零 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 用量 | 按事件日时模型聚合 | 真实账单误差 |
| 余额 | 受上游和凭据约束 | 实际供应商可用 |

> **思考**：[Q02](#research-q02) 部署代理及上游适配器影响真实边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将事件桶和账号状态并置，保留重试计量口径。

[Q02](#research-q02) 检查 DNS 结果后固定连接。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 部署代理及上游适配器影响真实边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 从关闭余额的临时目录开始。[Q02](#research-q02) 先验收代理边界再引入真实凭据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码的代表计量和请求边界，未运行。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、lib/index.js、lib/safe-fetch.js、lib/usage.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定代表源码，未运行插件或请求供应商。
- 下一步：核对重试计量、代理、DNS、缓存和退出。

**分析版本**

- **仓库**：[Aisland-SJL/dsh-usage](https://github.com/Aisland-SJL/dsh-usage)
- **版本号**：0.4.0（[固定提交 e4f15bb](https://github.com/Aisland-SJL/dsh-usage/tree/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 辅助解释来源覆盖与重试造成的数字变化。

核对重试计量、代理、DNS、缓存和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 464 | — | — | 6799 |
| .js | source | 6 | 4015 | 3412 | 434 | — |
| .mjs | source | 12 | 2566 | 2238 | 162 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Aisland-SJL/dsh-usage/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Aisland-SJL/dsh-usage/issues?q=is%3Aissue+created%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aisland-SJL/dsh-usage/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地用量与外部余额的采集边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用量与余额如何分开？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

使用多个供应商的 DSH 用户可在宿主核对会话 token 和账户状态。宿主分别注册用量、供应商目录及余额路由。折叠更新日、小时和模型桶，同一步重复报告时扣旧样本；如果收到匹配的 retry-started 会清空上一个样本引用，保留前次已报用量。故不能直接与按步保留最后样本的其他面板比较。实际金额仍由供应商结算。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:890-914](https://github.com/Aisland-SJL/dsh-usage/blob/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a/lib/index.js#L890-L914)

分开路由及后台刷新

<details>
<summary>查看原文（25行）</summary>

```text
async function apply(ctx, rawConfig = {}, deps = {}) {
	const service = deps.service ?? createBalanceService({
		credentials: ctx.get("credentials") ?? ctx.credentials,
		getProviders: () => configuredProviders(ctx),
		deps: { timeoutMs: UPSTREAM_TIMEOUT_MS, lookup: deps.lookup, transport: deps.transport, fetchImpl: deps.fetchImpl, disabled: rawConfig.balanceEnabled === false }
	});
	// Provider ids come from the async Harness settings service, so this
	// dynamic part of config validation must finish before routes start.
	await service.validate();
	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: USAGE_PATH,
		handler: (req, res) => handleUsage(ctx, req, res, deps)
	}), "usage: usage route");
	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: PROVIDERS_PATH,
		handler: (req, res) => handleProviders(ctx, service, req, res)
	}), "usage: providers route");
	ctx.effect(() => ctx.webServer.register({
		kind: "exact",
		path: BALANCE_PATH,
		handler: (req, res) => handleBalance(ctx, service, req, res)
	}), "usage: balance route");
	if (deps.disableBackgroundRefresh !== true) ctx.effect(() => startBackgroundRefresh(ctx, service, deps), "usage: background refresh");
```

</details>

**依据 2 · 源码核查**：[lib/usage.js:187-228](https://github.com/Aisland-SJL/dsh-usage/blob/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a/lib/usage.js#L187-L228)

重复样本和重试分开

<details>
<summary>查看原文（42行）</summary>

```text
export function applyUsageDelta(state, events) {
	let last = state.lastSample;
	let currentModel = state.currentModel;
	for (const event of events) {
		if (event.type === "llm/retry-started" && last?.key === `${event.data.turn}:${event.data.step}`) last = null;
		if (event.type === "request/header") {
			const model = modelOf(event);
			if (model !== void 0) currentModel = model;
		}
		const sample = sampleOf(event);
		if (sample === void 0) continue;
		const buckets = bucketsOf(sample.usage);
		const model = modelOf(event) ?? currentModel ?? "unknown/unknown";
		const day = dayKey(event.time);
		const hour = hourOf(event.time);
		const entry = entryOf(state.days, day);
		if (last !== null && last.key === sample.key) {
			// Same turn/step re-reported: replace instead of double counting.
			const previous = state.days.get(last.day);
			if (previous !== void 0) {
				subtractFrom(previous.totals, last.buckets);
				const previousModel = previous.models.get(last.model);
				if (previousModel !== void 0) subtractFrom(previousModel, last.buckets);
			}
			const previousHours = state.hours.get(last.day);
			if (previousHours !== void 0 && last.hour !== void 0) {
				previousHours[last.hour] -= totalTokens(last.buckets);
			}
		}
		addInto(entry.totals, buckets);
		let modelBucket = entry.models.get(model);
		if (modelBucket === void 0) {
			modelBucket = zeroBuckets();
			entry.models.set(model, modelBucket);
		}
		addInto(modelBucket, buckets);
		const hourEntry = hourEntryOf(state, day);
		hourEntry[hour] += totalTokens(buckets);
		last = { key: sample.key, day, hour, model, buckets };
	}
	state.lastSample = last;
	state.currentModel = currentModel;
```

</details>

**依据 3 · 作者声明**：[README.zh-CN.md:53-65](https://github.com/Aisland-SJL/dsh-usage/blob/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a/README.zh-CN.md#L53-L65)

作者面板定位

<details>
<summary>查看原文（13行）</summary>

```text
## 一眼看懂

| | 能力 | 说明 |
| --- | --- | --- |
| 💳 | 常驻悬浮窗 | pinned 项始终可见；sidebar 收起时折叠为余额胶囊按钮 |
| 🎨 | 一切皆可自定义 | 每个 widget 可 pin / 折叠 / 隐藏 / 拖拽排序（虚线占位 + 平滑让位动画）；主色、背景、不透明度可调；设置持久化 localStorage |
| 📊 | 余额与用量面板 | 供应商切换、余额明细、今日/本月总量（k/M/B 紧凑单位）、缓存命中、用量记录与按模型下钻 |
| 🔥 | 活跃热力图 | GitHub 风格点块：28 天 × 6 时段（每格 4 小时）+ 顶部日期标签 |
| ↔️ | 通道比例 | DSH 通道 vs Claude Code 通道（解析 `~/.claude/projects` JSONL 增量聚合） |
| 🔄 | 后台刷新 | 启动即刷新，之后每 5 分钟更新余额、DSH Token 与 Claude Code 聚合 |
| 🔒 | 本机安全边界 | 三个端点仅接受回环 GET；凭据只在服务端解析；上游强制 HTTPS、拒绝私网解析并固定 DNS 连接；Claude 日志只聚合数字，对话文本永不落盘 |

界面支持中文和英文。余额查询通过 Harness 凭据服务在内存中取得密钥，密钥不写入插件缓存或浏览器响应。
```

</details>

#### 缺口

- 未对照真实宿主和供应商账单
  **影响**：不能判定计量误差
  **进一步探讨**：用同一步流结束与重试标记构造固定事件

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 连接防护覆盖哪些风险？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

入站检查 GET、回环 socket 和 Host。代理如果代发回环请求且重写 Host，仍须在代理层校验。上游使用 HTTPS，拒绝内嵌凭据、拒绝任一已解析的私网地址，并固定连接到已检查地址。这个策略降低通过 DNS 重解析连接私网的风险，仍需核对每种余额适配器和实际部署。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:116-127](https://github.com/Aisland-SJL/dsh-usage/blob/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a/lib/index.js#L116-L127)

回环与方法

<details>
<summary>查看原文（12行）</summary>

```text
/** Refuse non-loopback callers and non-GET methods before any work. */
export function rejectForeignCaller(req, res) {
	if (req.method !== "GET") {
		res.writeHead(405, { "content-type": "application/json; charset=utf-8" });
		res.end(JSON.stringify({ ok: false, error: "method-not-allowed" }));
		return true;
	}
	const peer = req.socket?.remoteAddress;
	if (isLoopbackAddress(peer) && isLoopbackHostHeader(req)) return false;
	json(res, 403, { ok: false, error: "forbidden" });
	return true;
}
```

</details>

**依据 2 · 源码核查**：[lib/safe-fetch.js:74-93](https://github.com/Aisland-SJL/dsh-usage/blob/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a/lib/safe-fetch.js#L74-L93)

DNS 全集合拒绝条件

<details>
<summary>查看原文（20行）</summary>

```text
export async function resolvePublicAddress(url, deps = {}) {
	const hostname = url.hostname.replace(/^\[|\]$/g, "");
	if (isIP(hostname) !== 0) {
		if (isPrivateAddress(hostname)) throw statusError("unsupported", "balance hostname resolves to a private network");
		return { address: hostname, family: isIP(hostname) };
	}
	let addresses;
	try {
		addresses = await (deps.lookup ?? dnsLookup)(hostname, { all: true, verbatim: true });
	} catch {
		throw statusError("unavailable", "balance hostname could not be resolved");
	}
	if (!Array.isArray(addresses)) addresses = [addresses];
	if (addresses.length === 0) throw statusError("unavailable", "balance hostname resolved to no addresses");
	if (addresses.some((entry) => isPrivateAddress(entry?.address))) {
		throw statusError("unsupported", "balance hostname resolves to a private network");
	}
	const selected = addresses[0];
	return { address: selected.address, family: selected.family ?? isIP(selected.address) };
}
```

</details>

**依据 3 · 源码核查**：[lib/safe-fetch.js:100-125](https://github.com/Aisland-SJL/dsh-usage/blob/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a/lib/safe-fetch.js#L100-L125)

HTTPS 和连接固定

<details>
<summary>查看原文（26行）</summary>

```text
export async function safeFetch(rawUrl, init = {}, deps = {}) {
	const url = new URL(rawUrl);
	if (url.username !== "" || url.password !== "") throw statusError("unsupported", "balance URL must not contain credentials");
	if (url.protocol !== "https:") throw statusError("unsupported", "balance requires HTTPS");
	const target = { url, ...await resolvePublicAddress(url, deps) };
	const timeoutMs = deps.timeoutMs ?? DEFAULT_TIMEOUT_MS;
	const maxBytes = deps.maxResponseBytes ?? MAX_RESPONSE_BYTES;
	const signal = init.signal ?? AbortSignal.timeout(timeoutMs);
	const transport = deps.transport ?? { httpsRequest, httpRequest };
	return new Promise((resolve, reject) => {
		const request = transport.httpsRequest(target.url, {
			method: init.method ?? "GET",
			headers: init.headers,
			signal,
			servername: isIP(target.url.hostname.replace(/^\[|\]$/g, "")) === 0 ? target.url.hostname : void 0,
			lookup: (_hostname, options, callback) => {
				if (options?.all) callback(null, [{ address: target.address, family: target.family }]);
				else callback(null, target.address, target.family);
			}
		}, (response) => {
			const chunks = [];
			let size = 0;
			response.on("data", (chunk) => {
				size += chunk.length;
				if (size > maxBytes) request.destroy(statusError("invalid-response", "upstream response exceeds the size limit"));
				else chunks.push(chunk);
```

</details>

**依据 4 · 作者声明**：[README.zh-CN.md:147-153](https://github.com/Aisland-SJL/dsh-usage/blob/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a/README.zh-CN.md#L147-L153)

作者说明代理边界

```text
## 隐私与安全

- API Key 永不进入浏览器响应、插件缓存或日志；凭据由 Harness credentials seam 在请求时解析。
- 上游余额查询：强制 HTTPS、预解析 DNS 并拒绝回环/私网/链路本地/组播等非公网地址、连接固定到校验过的地址（防 DNS rebinding）、响应上限 1 MiB、超时 15 秒。
- 用量缓存 `~/.dsh/storages/` 只保存聚合 Token 与会话折叠游标，不保存提示词或回复内容。
- Claude Code 日志逐行解析即弃，只有聚合数字进入缓存。
- 请勿将本插件端点经反向代理暴露到局域网或公网。
```

#### 缺口

- 未核查全部适配器和代理部署
  **影响**：不能保证每种实际接入的隔离
  **进一步探讨**：用虚拟凭据及受控 DNS、代理做拒绝测试

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何做隔离试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

通过独立 DSH_HOME 使用临时缓存，显式设 CLAUDE_CONFIG_DIR 避免读取默认用户日志。把 balanceEnabled 关掉后从本地用量试起，再按授权启用真实余额。持续成本来自扫描、缓存和供应商请求，错误时需核对覆盖而非只比较金额。退出应核对缓存和端点，不仅关闭界面。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:337-355](https://github.com/Aisland-SJL/dsh-usage/blob/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a/lib/index.js#L337-L355)

本地缓存与默认 Claude 路径

<details>
<summary>查看原文（19行）</summary>

```text
export function dshHomeOf() {
	const raw = process.env.DSH_HOME;
	const home = typeof raw === "string" && raw.trim().length > 0 ? raw : join(homedir(), ".dsh");
	return resolve(home === "~" ? homedir() : home.startsWith("~/") || home.startsWith("~\\") ? join(homedir(), home.slice(2)) : home);
}

function cachePath() {
	return join(dshHomeOf(), "storages", "usage-cache.json");
}

/** Claude Code project dir (configurable; defaults to ~/.claude). */
export function claudeDirOf() {
	return process.env.CLAUDE_CONFIG_DIR ?? join(homedir(), ".claude");
}

/** Claude aggregation cache location. */
export function claudeCachePath() {
	return join(dshHomeOf(), "storages", "usage-cache-claude.json");
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:890-898](https://github.com/Aisland-SJL/dsh-usage/blob/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a/lib/index.js#L890-L898)

余额关闭接线

```text
async function apply(ctx, rawConfig = {}, deps = {}) {
	const service = deps.service ?? createBalanceService({
		credentials: ctx.get("credentials") ?? ctx.credentials,
		getProviders: () => configuredProviders(ctx),
		deps: { timeoutMs: UPSTREAM_TIMEOUT_MS, lookup: deps.lookup, transport: deps.transport, fetchImpl: deps.fetchImpl, disabled: rawConfig.balanceEnabled === false }
	});
	// Provider ids come from the async Harness settings service, so this
	// dynamic part of config validation must finish before routes start.
	await service.validate();
```

**依据 3 · 作者声明**：[README.zh-CN.md:108-114](https://github.com/Aisland-SJL/dsh-usage/blob/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a/README.zh-CN.md#L108-L114)

作者的隔离条件和覆盖口径

```text
Moonshot / Kimi 等 `llm-pi-ai` 中的 provider profile 会自动发现并复用其 `apiKeyEnv`。没有公开余额接口的供应商显示「无公开余额接口」，不会猜测。

0.2 按供应商目录的条目 id 读取已脱敏的实时设置；支持的 pi-ai 路由也可通过凭据服务读取 API-key 类型记录，不解释 OAuth/grant。OpenRouter 仍需要 Management Key，不能拿已存的推理密钥替代；缺少端点或可用凭据时明确显示未配置，不借用其他路由的密钥。

隔离测试可在插件条目设置 `config.balanceEnabled: false`，停止凭据解析与上游余额请求（默认仍开启）。必须显式将 `CLAUDE_CONFIG_DIR` 指向合成测试目录，否则原有默认行为仍扫描 `~/.claude/projects`。用量缓存升级为 v4，旧版缓存自动重算。0.2 上未变化的会话复用缓存、变化的会话经只读 handle 重新折叠，fork 继承历史不重复计费。真实余额和付费模型调用仍需独立验收。

单条会话读不过时不再拖垮其余统计。响应的 `coverage` 描述宿主列出的会话，区分完整、部分与不可用，列出纳入/未纳入的会话及原因（`unsupported-format` / `unsupported-session-api` / `unsupported-host` / `read-failed`）。部分统计显示精确的可读小计，并保留可展开的覆盖度告警——数值不再加「≥」前缀。若被跳过的会话全部是旧格式（`unsupported-format`），告警改为静默样式（无警示点、弱化一行）且通道比例照常计算；只有可处理的原因（`read-failed` / `unsupported-session-api` / `unsupported-host`）才显示警示点并暂停比例。全部读不过时 `total: null`、界面显示「—」，不按零计算。失败记录清除旧小计、下次重试；这不等于修复宿主对旧格式的兼容，也不改写旧日志。会话列表整体读取失败仍返回错误。
```

#### 缺口

- 未安装或验证配置关闭后的实际运行
  **影响**：本机资源、凭据与退出未知
  **进一步探讨**：用合成 DSH 和 Claude 目录核对无外部请求

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何呈现不完整报告？

**研究主题**：新假设与验证

#### 完整回答

当前 coverage 已区分部分和不可用。可在比较不同来源时提供按原因筛选的核对视图，并明确 retry-started 使前次用量仍被记入。用旧格式、读取失败和重试事件对照现有面板，测用户能否辨认增长是覆盖扩大还是实际消耗。若无改善，则不增加展示。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:112-114](https://github.com/Aisland-SJL/dsh-usage/blob/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a/README.zh-CN.md#L112-L114)

作者说明现有覆盖状态

```text
隔离测试可在插件条目设置 `config.balanceEnabled: false`，停止凭据解析与上游余额请求（默认仍开启）。必须显式将 `CLAUDE_CONFIG_DIR` 指向合成测试目录，否则原有默认行为仍扫描 `~/.claude/projects`。用量缓存升级为 v4，旧版缓存自动重算。0.2 上未变化的会话复用缓存、变化的会话经只读 handle 重新折叠，fork 继承历史不重复计费。真实余额和付费模型调用仍需独立验收。

单条会话读不过时不再拖垮其余统计。响应的 `coverage` 描述宿主列出的会话，区分完整、部分与不可用，列出纳入/未纳入的会话及原因（`unsupported-format` / `unsupported-session-api` / `unsupported-host` / `read-failed`）。部分统计显示精确的可读小计，并保留可展开的覆盖度告警——数值不再加「≥」前缀。若被跳过的会话全部是旧格式（`unsupported-format`），告警改为静默样式（无警示点、弱化一行）且通道比例照常计算；只有可处理的原因（`read-failed` / `unsupported-session-api` / `unsupported-host`）才显示警示点并暂停比例。全部读不过时 `total: null`、界面显示「—」，不按零计算。失败记录清除旧小计、下次重试；这不等于修复宿主对旧格式的兼容，也不改写旧日志。会话列表整体读取失败仍返回错误。
```

**依据 2 · 源码核查**：[lib/usage.js:187-215](https://github.com/Aisland-SJL/dsh-usage/blob/e4f15bbd7a6ebd667ccaaf24cae9b64dd971386a/lib/usage.js#L187-L215)

重试与样本口径

<details>
<summary>查看原文（29行）</summary>

```text
export function applyUsageDelta(state, events) {
	let last = state.lastSample;
	let currentModel = state.currentModel;
	for (const event of events) {
		if (event.type === "llm/retry-started" && last?.key === `${event.data.turn}:${event.data.step}`) last = null;
		if (event.type === "request/header") {
			const model = modelOf(event);
			if (model !== void 0) currentModel = model;
		}
		const sample = sampleOf(event);
		if (sample === void 0) continue;
		const buckets = bucketsOf(sample.usage);
		const model = modelOf(event) ?? currentModel ?? "unknown/unknown";
		const day = dayKey(event.time);
		const hour = hourOf(event.time);
		const entry = entryOf(state.days, day);
		if (last !== null && last.key === sample.key) {
			// Same turn/step re-reported: replace instead of double counting.
			const previous = state.days.get(last.day);
			if (previous !== void 0) {
				subtractFrom(previous.totals, last.buckets);
				const previousModel = previous.models.get(last.model);
				if (previousModel !== void 0) subtractFrom(previousModel, last.buckets);
			}
			const previousHours = state.hours.get(last.day);
			if (previousHours !== void 0 && last.hour !== void 0) {
				previousHours[last.hour] -= totalTokens(last.buckets);
			}
		}
```

</details>

#### 缺口

- 未看真实用户如何解释报告
  **影响**：假设未验证
  **进一步探讨**：以合成事件开展对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
