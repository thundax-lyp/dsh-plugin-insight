# dsh-usage-stats

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[fb2bf64](https://github.com/Ychris12138/dsh-usage-stats/tree/fb2bf64a3e619b6a3bfe11088e968901ca23f787)

<!-- BEGIN META -->
[![GitHub ★ 187](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=187&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ychris12138/dsh-usage-stats) [![npm 30d 7,061](https://img.shields.io/static/v1?label=npm+30d&message=7%2C061&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ychris12138/dsh-usage-stats) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ychris12138/dsh-usage-stats)
<!-- END META -->

> **功能**：在 DSH 中展示供应商账户、Token 用量、费用估算和预算，支持聚合导出。

> **亮点**：[Q01](#research-q01) 将可读会话用量与估算汇总在宿主，同时保留多次独立调用。

> **主要限制**：[Q01](#research-q01) 旧日志和计价覆盖决定估算范围。[Q02](#research-q02) 回环守卫与导出字段依赖实际部署和分享对象。

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
  - [Q01 · 会话分叉和价格怎样进入统计？](#detail-section-11)
  - [Q02 · 本机导出能暴露哪些信息？](#detail-section-12)
  - [Q03 · 如何选择低风险试用范围？](#detail-section-13)
  - [Q04 · 能否让用户看懂为何没有完整金额？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中使用多家模型供应商并需要排查用量变化的开发者。

分别查看供应商账户和宿主日志并手工对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话计量 | 按日期和供应商比较 token | 需要可读事件，继承边界影响去重 |
| 估算 | 查看已覆盖的金额 | 缺价或混合币种时不完整 |
| 导出 | 取得聚合数据 | 会话标题与标识仍在字段内 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH Web profile | 界面必需 | 挂载数据端点与客户端 | 核对实际 profile |
| 会话事件 | 用量统计必需 | 读取供应商报告的用量 | 缺口与估算分开记录 |
| 价格规则 | 完整费用必需 | 按时间估算 | 保留空金额 |
| 供应商凭据 | 账户读取按需 | 余额与窗口额度 | 关闭该路径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选独立 profile | 留出禁用退路 |
| 比对 | 操作者选择已知会话 | 核对 token 与计价状态 |
| 导出 | 用户检查标题等字段 | 按分享范围脱敏 |
| 退出 | 用户停用测试 bundle | 保留供应商原始记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主与存储成本未知 | 安装及 profile 核对 | 未实测耗时 |
| 持续 | 日志扫描与监测流量 | 核对估算缺口 | 账单与负载未知 |
| 失败恢复 | 重新扫描消耗未知 | 回看原始日志并还原 profile | 视会话完整性 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| Token 汇总 | 折叠与继承分组 | 旧宿主重复量 |
| 费用 | 按样本估算并标记完整性 | 账单误差 |
| 导出 | 白名单字段与空金额 | 分享对象能否接收标题 |

> **思考**：[Q01](#research-q01) 旧日志和计价覆盖决定估算范围。[Q02](#research-q02) 回环守卫与导出字段依赖实际部署和分享对象。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将可读会话用量与估算汇总在宿主，同时保留多次独立调用。

[Q01](#research-q01) 将总量与会话行作为同一汇总代读取，并按事件替换维护费用。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 旧日志和计价覆盖决定估算范围。[Q02](#research-q02) 回环守卫与导出字段依赖实际部署和分享对象。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先关闭账户轮询做本地统计对照，再按 [Q02](#research-q02) 检查真实部署的回环和导出边界。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代表性计量和导出路径。未运行宿主、供应商或账单对照。

- 已检查：作者 README、包清单、源码路径 README.md、lib/billing.js、lib/export.js、lib/index.js、lib/usage.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽查固定提交的包、统计、导出、回环与计价关键路径，未执行目标代码。
- 下一步：在独立 profile 对照已知会话、缺价样本、回环与代理请求，并验证退出。

**分析版本**

- **仓库**：[Ychris12138/dsh-usage-stats](https://github.com/Ychris12138/dsh-usage-stats)
- **版本号**：0.3.7（[固定提交 fb2bf64](https://github.com/Ychris12138/dsh-usage-stats/tree/fb2bf64a3e619b6a3bfe11088e968901ca23f787)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 给留空金额与旧快照分别说明原因，检验是否减少对账误判。

在独立 profile 对照已知会话、缺价样本、回环与代理请求，并验证退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 1771 | — | — | 24641 |
| .js | source | 13 | 9369 | 7521 | 1393 | — |
| .mjs | source | 24 | 10490 | 9450 | 707 | — |

</details>

**活跃度**

[![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/Ychris12138/dsh-usage-stats/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/Ychris12138/dsh-usage-stats/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：相对供应商账单和原始日志，哪些本地统计可用于排查用量？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话分叉和价格怎样进入统计？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

同时使用多家供应商的 DSH 用户，可把事件用量和账户余额带到宿主界面排查，而不用逐个打开账户页和日志。事件折叠在样本替换时先减去旧用量和费用，再用原始路由、模型、事件时刻和 token 桶估算新值。跨会话投影使用继承边界和样本别名分组，多个非继承样本仍保留，只有继承副本时选一个。边界未知时不会仅靠同样的用量猜复制关系。快速读取遇到全量扫描时可返回上次缓存。由此可以比较同口径下的趋势，仍需区分未报告用量、价格缺失及供应商的实际结算。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-33](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/README.md#L21-L33)

作者界定面板与监测场景

<details>
<summary>查看原文（13行）</summary>

```text
## 一眼看懂 / At a glance

| | 能力 | 说明 |
| --- | --- | --- |
| 💳 | 统一账户卡片 | API 供应商显示余额，Token Plan 显示分窗口额度；面板一次只呈现当前供应商 |
| 📊 | Token 用量分析 | 今日、本月、累计、缓存命中率、月历热图，以及供应商分组与组内模型用量排行 |
| 💰 | 估算费用与预算 | 按事件时间匹配历史价格，提供日/月费用、session 级聚合及可选预算预警 |
| 🔄 | 后台监测 | 账户按 active/detail/background 自适应刷新；间隔可配置或完全关闭，本地 Token 聚合保持独立运行 |
| 🧩 | 可扩展适配器 | 支持 New API、Sub2API、通用余额模板，以及声明式 JSON Pointer 自定义查询 |
| 📦 | 安全导出 | 提供 daily/session CSV 与版本化 JSON；Unicode、CSV 公式前缀和不完整费用均安全处理 |
| 🔒 | 本机安全边界 | 数据端点仅接受回环 GET；OrcaRouter preset 仅由带防跨站请求头的显式回环 POST 写入；凭据只在服务端解析 |

界面支持中文和英文。浏览器只请求当前选择的 provider；账户自动刷新由服务端统一调度。手动刷新会更新用量、供应商列表，并强制刷新当前账户，不会批量强制请求其他供应商。
```

</details>

**依据 2 · 源码核查**：[lib/usage.js:277-319](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/lib/usage.js#L277-L319)

精确继承边界与同组样本选择

<details>
<summary>查看原文（43行）</summary>

```text
export function inheritedCutOf(source) {
	const count = source?.inheritedEventCount;
	return Number.isSafeInteger(count) && count >= 0 ? count : null;
}

/**
 * Project copied samples once across sessions, preserving the only surviving
 * copy when its original is absent. Aliases are SHA-256 of normalized usage
 * evidence (seq/time/kind/turn-step/route/buckets), never messages or credentials.
 * Own calls remain distinct even if their evidence happens to match exactly.
 */
export function projectSessionUsage(sessions) {
	const entries = [];
	const projected = {};
	for (const [id, state] of Object.entries(sessions)) {
		if (!(state.usageSamples?.size > 0)) { projected[id] = state; continue; }
		projected[id] = { ...state, ...createUsageState(), title: state.title };
		for (const sample of state.usageSamples.values()) entries.push({ id, sample,
			inherited: state.inheritedEventCount !== null && sample.seq < state.inheritedEventCount });
	}
	const parents = entries.map((_, index) => index);
	const root = (i) => { while (parents[i] !== i) { parents[i] = parents[parents[i]]; i = parents[i]; } return i; };
	const aliases = new Map();
	entries.forEach((entry, i) => {
		for (const alias of entry.sample.aliases ?? []) {
			const other = aliases.get(alias);
			if (other !== void 0) parents[root(i)] = root(other);
			else aliases.set(alias, i);
		}
	});
	const groups = new Map();
	entries.forEach((entry, i) => {
		const key = root(i);
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key).push(entry);
	});
	const chosen = [];
	for (const group of groups.values()) {
		const own = group.filter((entry) => !entry.inherited);
		if (own.length > 1) { chosen.push(...own); continue; }
		group.sort((a, b) => (b.sample.seq - a.sample.seq) || (b.sample.time - a.sample.time)
			|| (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
		chosen.push({ id: own[0]?.id ?? group[0].id, sample: group[0].sample });
```

</details>

**依据 3 · 源码核查**：[lib/usage.js:407-445](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/lib/usage.js#L407-L445)

样本替换和事件时间计价

<details>
<summary>查看原文（39行）</summary>

```text
				const previousModel = previous.models.get(previousSample.model);
				if (previousModel !== void 0) subtractFrom(previousModel, previousSample.buckets);
			}
			if (previousSample.cost !== void 0) applySessionCost(state, previousSample, -1);
		}
		addInto(entry.totals, buckets);
		let modelBucket = entry.models.get(model);
		if (modelBucket === void 0) {
			modelBucket = zeroBuckets();
			entry.models.set(model, modelBucket);
		}
		addInto(modelBucket, buckets);
		const estimate = estimateCost === null ? null : estimateCost({
			providerId: route.providerId,
			model: route.model,
			timestamp: event.time,
			buckets
		});
		const replacing = previousSample?.key === sample.key ? previousSample : null;
		const ledgerKey = replacing?.ledgerKey ?? (compaction ? sample.key : `assistant:${event.seq}`);
		const alias = createHash("sha256").update(JSON.stringify([
			event.seq, event.time, event.type, sample.key, model,
			buckets.inputTokens, buckets.outputTokens, buckets.cacheReadTokens, buckets.cacheWriteTokens
		])).digest("hex");
		const nextSample = {
			ledgerKey, seq: event.seq,
			aliases: [...new Set([...(replacing?.aliases ?? []), alias])],
			key: sample.key,
			day,
			model,
			providerId: route.providerId,
			time: event.time,
			buckets,
			cost: costSampleOf(estimate, buckets)
		};
		usageSamples.set(ledgerKey, nextSample);
		if (compaction) compactionSamples.set(sample.key, nextSample);
		else last = nextSample;
		applySessionCost(state, nextSample, 1);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:854-876](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/lib/index.js#L854-L876)

扫描中缓存回退与历史计价隔离

<details>
<summary>查看原文（23行）</summary>

```text
export async function collectUsage(ctx, config = { monitors: {}, budgets: validateBudgetConfig() }, options = {}) {
	const scanPersisted = options?.scanPersisted !== false;
	if (!scanPersisted && inflight !== null && inflight.scanPersisted) {
		const cache = loadedCache ?? await waitForLoadedCache(UI_CACHE_WAIT_MS);
		if (cache !== null) return renderCachedCollection(ctx, cache, config);
	}
	return withCollectionLock(scanPersisted, async () => {
		const providers = await configuredProviders(ctx);
		// Registry-discovered routes carry no pricing facts (no base URL, no
		// credential reference); they exist so the panel lists every provider the
		// host serves. Feeding them to the pricing fingerprint or the estimator
		// would re-price history and rebuild the whole cache for a display change.
		const pricingProviders = providers.filter((provider) => provider.pricingRelevant !== false);
		const runtimePricingFingerprint = pricingFingerprint({ providers: pricingProviders, config });
		const cache = await loadCache(runtimePricingFingerprint);
		const estimateCurrentCost = createUsageCostEstimator(pricingProviders, config);
		const estimateCost = (input) => {
			const routeCutoff = Object.hasOwn(cache.pricingIdentityCutoffs, input.providerId)
				? cache.pricingIdentityCutoffs[input.providerId]
				: null;
			const cutoff = Math.max(cache.pricingIdentityCutoffAll ?? 0, routeCutoff ?? 0);
			if (cutoff > 0 && (!Number.isFinite(input.timestamp) || input.timestamp <= cutoff)) return null;
			return estimateCurrentCost(input);
```

</details>

#### 缺口

- 未对照真实分叉、旧宿主和账单
  **影响**：无法确定特定会话的重复率、延迟或估算偏差
  **进一步探讨**：用已知继承边界与独立相似调用对照原始用量，再对账

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本机导出能暴露哪些信息？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

数据路径同时查连接端的回环地址和 Host，请求方法也受限制。检查依赖插件看到的连接；若本地代理替外部请求建立回环连接并重写 Host，守卫可能看到与本机请求相同的事实。CSV 使用字段投影，session 行仍含标题、会话 ID、供应商、模型和活动时间。分享文件前应按业务敏感程度处理这些字段。费用不完整时该行金额与币种为空，因此空值不可解读为没有消耗。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:146-182](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/lib/index.js#L146-L182)

GET 和设置动作的回环与请求形态检查

<details>
<summary>查看原文（37行）</summary>

```text
function isLoopbackHostHeader(req) {
	const name = hostNameOf(req.headers.host);
	return name === "localhost" || isLoopbackAddress(name);
}

/** Refuse non-loopback callers and non-GET methods before any work. */
function rejectForeignCaller(req, res) {
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

/**
 * Fence the sole settings mutation. The custom action header makes this a
 * non-simple browser request, so a foreign page cannot CSRF the loopback route
 * without a CORS preflight (the exact route never grants CORS).
 */
function rejectForeignMutation(req, res) {
	if (req.method !== "POST") {
		json(res, 405, { ok: false, error: "method-not-allowed" });
		return true;
	}
	const peer = req.socket?.remoteAddress;
	if (!isLoopbackAddress(peer) || !isLoopbackHostHeader(req)) {
		json(res, 403, { ok: false, error: "forbidden" });
		return true;
	}
	const contentType = typeof req.headers["content-type"] === "string" ? req.headers["content-type"].toLowerCase() : "";
	if (!contentType.startsWith("application/json") || req.headers["x-dsh-usage-stats-action"] !== "add-orcarouter") {
		json(res, 403, { ok: false, error: "forbidden-action" });
		return true;
```

</details>

**依据 2 · 源码核查**：[lib/export.js:117-141](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/lib/export.js#L117-L141)

会话导出实际字段和不完整金额处理

<details>
<summary>查看原文（25行）</summary>

```text
export function sessionsCsv(usage) {
	const rows = [[
		{ value: "session_id" },
		{ value: "title" },
		{ value: "provider" },
		{ value: "model" },
		{ value: "tokens" },
		{ value: "estimated_cost" },
		{ value: "currency" },
		{ value: "last_active" }
	]];
	for (const session of Array.isArray(usage?.sessions) ? usage.sessions : []) {
		if (session === null || typeof session !== "object") continue;
		rows.push([
			{ value: stringOrNull(session.sessionId), text: true },
			{ value: stringOrNull(session.title), text: true },
			{ value: Array.isArray(session.providers) ? session.providers.filter((entry) => typeof entry === "string").join(" | ") : "", text: true },
			{ value: Array.isArray(session.models) ? session.models.filter((entry) => typeof entry === "string").join(" | ") : "", text: true },
			{ value: finiteOrNull(session.tokens) ?? 0 },
			{ value: session.costComplete === true ? finiteOrNull(session.estimatedCost) : null },
			{ value: session.costComplete === true ? stringOrNull(session.currency) : null, text: true },
			{ value: stringOrNull(session.lastAt), text: true }
		]);
	}
	return csv(rows);
```

</details>

**依据 3 · 作者声明**：[README.md:521-531](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/README.md#L521-L531)

作者说明反代与自定义监测风险

<details>
<summary>查看原文（11行）</summary>

```text
## 隐私与安全 / Privacy & security

- API Key、OpenCode `auth.json`、Cookie 与管理 PAT 不会进入浏览器响应、插件缓存或日志。
- Sub2API `sub2api-auth` 复用 provider 自己的推理 API Key（模型页已配置的那个），不会再引入或落盘额外的面板凭据。
- 自定义 monitor 默认要求 HTTPS、同源相对路径、手动 redirect 和 JSON 响应，body 上限为 1 MiB。
- 发凭据前会筛选域名的 IPv4/IPv6 解析结果并固定一个允许的连接地址，优先使用公网地址；HTTPS 域名解析到 `198.18.0.0/15` 时可作为 Clash/Mihomo 等代理的 synthetic fake-IP 使用。字面量 `198.18/15`、其他私网/特殊地址仍默认拒绝，防止 DNS rebinding 绕过私网限制。
- `usageBaseURL` 禁止内嵌 username/password；`Authorization`、`X-API-Key`、`API-Key` 等 header 必须由 credential ref 注入。
- 九个数据端点仅接受 GET；OrcaRouter 集成路由的 GET 只返回布尔状态，POST 仅在用户点击后执行局部 settings mutation，并要求非简单自定义 action header。所有路由同时校验 peer socket 与 Host，支持 IPv4、IPv4-mapped IPv6 和 `[::1]:port`。
- 用量缓存 `~/.dsh/storages/usage-stats-cache.json` 只保存聚合 Token、会话 id、不透明 revision 与折叠游标，不保存提示词、回复或文件路径。

本机反向代理会让插件看到代理自身的回环地址。请勿把端点经反向代理暴露到局域网或公网；确需代理时必须在代理层增加可靠认证与访问控制。安全问题请按 [SECURITY.md](SECURITY.md) 私下报告。
```

</details>

#### 缺口

- 未核对真实反代部署、会话标题内容及每个 monitor
  **影响**：无法判定生产端点隔离或所有导出内容的敏感程度
  **进一步探讨**：用测试账号、代理及虚拟标题核对拒绝和导出字段

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何选择低风险试用范围？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包有服务端、Web 客户端和 bundle patch，实际 profile 须与运行宿主一致。作者给出基础版本下限及 Desktop 登录余额的独立版本条件。试用可以先关闭账户自动刷新，仅比较本地 token 汇总和脱敏导出。以后启用账户能力时逐个核对需要的凭据、真实端点和请求间隔。缓存和历史扫描占本地资源，排障时先确认快照时效、样本覆盖和费用完整性。若日志无法核对或代理边界不清楚，回到供应商官方用量并禁用测试 profile 的 bundle。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:45-64](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/package.json#L45-L64)

宿主与客户端入口及组合声明

<details>
<summary>查看原文（20行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./pricing": "./lib/pricing.js",
    "./usage": "./lib/usage.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-primitives"
      ]
    }
```

</details>

**依据 2 · 作者声明**：[README.md:35-47](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/README.md#L35-L47)

作者的 profile、版本和精确包验收说明

<details>
<summary>查看原文（13行）</summary>

````text
## 快速安装 / Quick start

本版本为 `@ychris12138/dsh-usage-stats@0.3.7`。npm 与市场安装要求该精确版本已经发布；发布前验收使用从冻结提交构建并核对哈希的本地 `.tgz`。

基础功能支持 `@deepseek-ai/dsh >= 0.1.0-rc.6`。安装时选择实际使用的 profile：命令行网页通常是 `web`，Desktop 使用 `desktop`；不要把插件装到另一个 profile 后只刷新当前窗口。DSH Desktop 的 **DeepSeek Account 登录余额**接入依赖 DSH `0.2.0-rc.2+` 提供的 Host account service；旧版 Harness 仍继续使用 API Key 余额路径。

确认 npm 上存在本版本后，优先安装精确版本；DSH Desktop Market 使用同一个包：

```bash
dsh plugin --profile web add "@ychris12138/dsh-usage-stats@0.3.7"
```

Desktop 安装时将上面的 `--profile web` 改为 `--profile desktop`，并使用 Desktop 对应的 DSH CLI。只有明确测试未发布 source/RC 时才使用 GitHub 来源；验收指定候选版本时优先安装从该提交打出的本地 `.tgz`，以免跟随分支变化。GitHub `main` 可能领先 npm stable。
````

</details>

**依据 3 · 作者声明**：[README.md:25-33](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/README.md#L25-L33)

刷新模式与可关闭的账户刷新

```text
| 💳 | 统一账户卡片 | API 供应商显示余额，Token Plan 显示分窗口额度；面板一次只呈现当前供应商 |
| 📊 | Token 用量分析 | 今日、本月、累计、缓存命中率、月历热图，以及供应商分组与组内模型用量排行 |
| 💰 | 估算费用与预算 | 按事件时间匹配历史价格，提供日/月费用、session 级聚合及可选预算预警 |
| 🔄 | 后台监测 | 账户按 active/detail/background 自适应刷新；间隔可配置或完全关闭，本地 Token 聚合保持独立运行 |
| 🧩 | 可扩展适配器 | 支持 New API、Sub2API、通用余额模板，以及声明式 JSON Pointer 自定义查询 |
| 📦 | 安全导出 | 提供 daily/session CSV 与版本化 JSON；Unicode、CSV 公式前缀和不完整费用均安全处理 |
| 🔒 | 本机安全边界 | 数据端点仅接受回环 GET；OrcaRouter preset 仅由带防跨站请求头的显式回环 POST 写入；凭据只在服务端解析 |

界面支持中文和英文。浏览器只请求当前选择的 provider；账户自动刷新由服务端统一调度。手动刷新会更新用量、供应商列表，并强制刷新当前账户，不会批量强制请求其他供应商。
```

**依据 4 · 作者声明**：[README.md:451-467](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/README.md#L451-L467)

用户流程和导出边界

<details>
<summary>查看原文（17行）</summary>

```text
## 使用 / Usage

1. 点击侧边栏“用量/余额”。
2. 用“当前供应商”切换账户卡片；一次只显示一个 provider。
3. 使用 `‹` / `›` 切换月份，点击热图日期查看当天的 provider/model 明细。
4. “最近会话费用”只显示 `costComplete=true` 的完整估算；未知价格或混合币种会话不会展示误导性的部分金额，完整 session 数据仍可通过 CSV/JSON 导出。
5. 标题栏刷新会更新 Token、provider 列表，并强制刷新当前账户。

### 安全导出 / Secret-free export

三个下载端点只导出聚合后的白名单字段，不包含 credential ref/value、Authorization、Cookie、上游原始响应、prompt/reply 或文件路径：

- `/api/usage-stats/export/daily.csv`：每天 × provider/model 的四类 Token 与完整费用估算。
- `/api/usage-stats/export/sessions.csv`：session 标题、provider/model 集合、Token、完整费用估算和最后活动时间。
- `/api/usage-stats/export.json`：带 `schemaVersion` 的完整聚合数据、公开 pricing provenance、预算和安全账户状态。

CSV 使用 UTF-8、RFC 4180 引号与 spreadsheet formula 防护；Unicode 标题可直接打开。费用只在 `costComplete=true` 时导出，未知/混合币种保持空白或 `null`，不会输出部分金额。
```

</details>

#### 缺口

- 未安装 0.3.7 或核实对应制品、目标宿主耗时
  **影响**：无法给出真实安装可用性与资源成本
  **进一步探讨**：从固定提交制品在独立 profile 对照少量已知日志并验证禁用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否让用户看懂为何没有完整金额？

**研究主题**：新假设与验证

#### 完整回答

现有完整标记会把未定价或混合币种的金额留空，缓存回退则可能仍展示旧汇总。可以保留金额留空，另在行旁区分缺历史价格、币种混合、扫描中使用旧快照。用相同合成会话对照当前展示与原因提示，要求用户判断继续对账、重试扫描或接受不可比金额。测错误当作零的比例、处理时间和额外刷新次数。若没有减少误判或增加误操作，撤回。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:451-467](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/README.md#L451-L467)

现有界面对完整金额的处理

<details>
<summary>查看原文（17行）</summary>

```text
## 使用 / Usage

1. 点击侧边栏“用量/余额”。
2. 用“当前供应商”切换账户卡片；一次只显示一个 provider。
3. 使用 `‹` / `›` 切换月份，点击热图日期查看当天的 provider/model 明细。
4. “最近会话费用”只显示 `costComplete=true` 的完整估算；未知价格或混合币种会话不会展示误导性的部分金额，完整 session 数据仍可通过 CSV/JSON 导出。
5. 标题栏刷新会更新 Token、provider 列表，并强制刷新当前账户。

### 安全导出 / Secret-free export

三个下载端点只导出聚合后的白名单字段，不包含 credential ref/value、Authorization、Cookie、上游原始响应、prompt/reply 或文件路径：

- `/api/usage-stats/export/daily.csv`：每天 × provider/model 的四类 Token 与完整费用估算。
- `/api/usage-stats/export/sessions.csv`：session 标题、provider/model 集合、Token、完整费用估算和最后活动时间。
- `/api/usage-stats/export.json`：带 `schemaVersion` 的完整聚合数据、公开 pricing provenance、预算和安全账户状态。

CSV 使用 UTF-8、RFC 4180 引号与 spreadsheet formula 防护；Unicode 标题可直接打开。费用只在 `costComplete=true` 时导出，未知/混合币种保持空白或 `null`，不会输出部分金额。
```

</details>

**依据 2 · 源码核查**：[lib/billing.js:222-233](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/lib/billing.js#L222-L233)

完整性受币种和未知样本限制

<details>
<summary>查看原文（12行）</summary>

```text
export function renderCost(accumulator) {
	const sampleCount = accumulator.pricedSamples + accumulator.incompleteSamples;
	const complete = sampleCount > 0 && accumulator.incompleteSamples === 0 && accumulator.currencies.size === 1;
	const [currency, currencyEntry] = complete ? [...accumulator.currencies.entries()][0] : [null, null];
	return {
		estimatedCost: complete ? currencyEntry.amount : null,
		currency,
		costComplete: complete,
		pricing: provenanceOf(accumulator)
	};
}

```

</details>

**依据 3 · 源码核查**：[lib/index.js:854-859](https://github.com/Ychris12138/dsh-usage-stats/blob/fb2bf64a3e619b6a3bfe11088e968901ca23f787/lib/index.js#L854-L859)

扫描期间返回缓存路径

```text
export async function collectUsage(ctx, config = { monitors: {}, budgets: validateBudgetConfig() }, options = {}) {
	const scanPersisted = options?.scanPersisted !== false;
	if (!scanPersisted && inflight !== null && inflight.scanPersisted) {
		const cache = loadedCache ?? await waitForLoadedCache(UI_CACHE_WAIT_MS);
		if (cache !== null) return renderCachedCollection(ctx, cache, config);
	}
```

#### 缺口

- 未对照用户或穷尽其他界面提示
  **影响**：不能确认原因提示具有增量价值
  **进一步探讨**：先核对实际界面，再做固定故障和对账任务对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
