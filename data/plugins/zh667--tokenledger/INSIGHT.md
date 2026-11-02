# TokenLedger

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[438d308](https://github.com/zh667/TokenLedger/tree/438d3086249d427e7185a69c5453cb1553c84f0b)

<!-- BEGIN META -->
[![GitHub ★ 202](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=202&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zh667/TokenLedger) [![npm 30d 1,709](https://img.shields.io/static/v1?label=npm+30d&message=1%2C709&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tokenledger) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tokenledger)
<!-- END META -->

> **功能**：从 DSH 会话日志聚合 Token 用量，按路由、模型和项目展示，并提供费用估算与可选账户余额查询。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) fork前缀去重、同样本替换和rollup/checkpoint事务让重建账本更可解释，缺价格保持未知而非零。并未证明财务对账准确或真实费用降低。

> **主要限制**：[Q02](#research-q02) 区间费用先按模型合并，再用一个day选价且未传时刻，不能保证跨生效日/峰谷正确分段；宿主未报usage和当前路由重建也影响结果。金额不得直接作结算凭据。

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
  - [Q01 · 给谁做什么账，相对原始日志和账单增加什么？](#detail-section-11)
  - [Q02 · 采集、去重、价格与持久化如何接线？](#detail-section-12)
  - [Q03 · 凭据、宿主依赖、成本和退出能否支持采用？](#detail-section-13)
  - [Q04 · 怎么验证账本可解释且没有误导费用决策？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多模型/中转路由的DSH用户可以按会话、日期和项目解释宿主报告用量，减少手工拼表。

[Q01](#research-q01) 相对原始日志与控制台，增量是统一归因和诊断；不把本地估算、账户余额与供应商扣费混为同一事实。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 用量索引 | 按日期/路由/模型/项目归组 | 依赖宿主usage语义与采集覆盖 |
| 费用估算 | 分桶按费率显示金额 | 区间调用未逐日/时段，不是结算 |
| 可选余额/订阅 | 看账户上游信息 | 需对应凭据，部分端点未公开schema |
| 诊断/重建 | 查漏采并从原日志恢复索引 | 原日志本身缺失不能补造 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22及sessionPersistence | 必需，manifest/入口声明 | 扫宿主日志 | 列表/读取失败计failed，不保证覆盖 |
| 可写索引数据库 | 用量账本必需 | rollup和checkpoint | 写失败不改原日志，应看诊断 |
| 完整usage/来源事件 | 正确归因必需 | 分桶和路由/项目 | 插件不能推算未报告用量 |
| 对应账户费率与时段数据 | 费用估算必需 | 本地估算 | 未定价null，区间链分段有限 |
| 账户凭据与网络 | 余额/订阅才需 | 查询上游 | 不影响纯用量，不把缺失当余额0 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/插件并保留副本日志 | 先不用额外余额账户；本轮未安装 |
| 扫描 | revision变动重折，跳fork seed | failed/skipped/updated区别明确 |
| 聚合 | 事务替换会话账本和checkpoint | 对重复/失败usage核原日志 |
| 核账 | 人工分开看token、估算与上游金额 | 跨日期/峰谷不直接依赖区间估算 |
| 退出 | 停用并另核索引保留/清理 | 原会话不受索引删除替代，回账单手工核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 索引空间与宿主 | 核事件/路由/费率 | 金额/工时未知 |
| 持续使用 | 定时扫描、变动日志重折和数据库I/O | 监视failed/未归因/未定价 | 大历史性能与核账节时未测 |
| 失败恢复 | 重建索引和备份 | 对原日志/账单逐桶比对 | 原日志缺usage不能重建出来 |
| 退出 | 保留索引/导出 | 停用并按实际目录处理残留 | 不撤回真实供应商费用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 用量组织 | fork去重、同样本替换、分桶归因 | adapter报告完整性/真实总量 |
| 可重建性 | 会话rollup/checkpoint同事务 | 全宿主/大历史运行效果 |
| 金额解释 | 未定价null、桶/币种分开 | 区间生效日/峰谷及供应商结算差额 |

> **思考**：[Q02](#research-q02) 区间费用先按模型合并，再用一个day选价且未传时刻，不能保证跨生效日/峰谷正确分段；宿主未报usage和当前路由重建也影响结果。金额不得直接作结算凭据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) fork前缀去重、同样本替换和rollup/checkpoint事务让重建账本更可解释，缺价格保持未知而非零。并未证明财务对账准确或真实费用降低。

[Q02](#research-q02) revision重折+事务替换避免游标超前，fork seed与reasoning不重复计量可借鉴。价格类支持不等调用方保留必要粒度，移植时须沿实际数据到显示核对；凭据端点的同源保护不能代替全系统审计。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 区间费用先按模型合并，再用一个day选价且未传时刻，不能保证跨生效日/峰谷正确分段；宿主未报usage和当前路由重建也影响结果。金额不得直接作结算凭据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用副本日志核usage与归因，读failed/未知/未定价。跨日期或峰谷费用回原账单核对，差额无法解释便停止金额决策，不将估算作结算凭据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查日志扫描、usage归因、事务存储和实际价格调用，指出源码级分段限制；没有读真实用量/凭据、请求余额或执行目标代码。未来改进与已有支持分开。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/balance.js、src/declarative.js、src/http.js、src/index.js、src/plugin.js、src/pricing.js、src/store.js、src/usage.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定root plugin，重点后台sweep、usage fold、SQLite事务、区间定价与余额端点边界；未核全部UI/Blue适配、账户方案、供应商账单或退出清理，不读真实账号和用量。
- 下一步：按[Q04](#research-q04)用合成边界日志和人工oracle对比跨生效日/时段分段，计偏差/未知覆盖/I/O与维护；输入缺失保持未知，未减少偏差或成本过高则否定。本轮未执行。

**分析版本**

- **仓库**：[zh667/TokenLedger](https://github.com/zh667/TokenLedger)
- **版本号**：0.1.1-blue.0（[固定提交 438d308](https://github.com/zh667/TokenLedger/tree/438d3086249d427e7185a69c5453cb1553c84f0b)）
- **版本日期**：2026-09-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用已有day粒度逐段选价，显式分开估算/上游金额/不可解释差额，以固定日志与人工oracle比较误差和资源成本；历史时刻缺失不能补造，尚未实现验证。

按[Q04](#research-q04)用合成边界日志和人工oracle对比跨生效日/时段分段，计偏差/未知覆盖/I/O与维护；输入缺失保持未知，未减少偏差或成本过高则否定。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1527 | — | — | 14255 |
| .js | source | 22 | 10870 | 7039 | 3161 | — |
| .js | test | 26 | 9178 | 7388 | 1168 | — |
| .mjs | test | 2 | 577 | 527 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/zh667/TokenLedger/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/zh667/TokenLedger/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/zh667/TokenLedger/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地用量和价格账本如何形成可核对统计，估算与真实账单边界怎样影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 给谁做什么账，相对原始日志和账单增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

TokenLedger面向在DSH使用多个模型/中转路由、希望按项目和来源解释用量的人。合格结果是能把宿主已报告的usage归到明确的会话/日期/路由，并看见缺失和未定价，而不是把估算金额当供应商结算。基线为手工读会话日志与供应商控制台；插件增加统一聚合、项目归组、导出和诊断，减少手工拼表。供应商实际扣费、账户余额与本地按rate估算是不同事实，不能互作证明。

源码从sessionPersistence后台扫日志，不在模型请求热路径里逐次阻塞；用量不要求额外API凭据，但余额/订阅读取需要对应账户key，不能把“零凭据”推广全部功能。README演示明确是合成数据，不能拿图中数字当真实业务验收。贡献是宿主日志归因和多展示面共用账本，而非自动节省token或保证财务准确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:6-28](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/README.md#L6-L28)

作者定位、演示合成边界及用量/余额/估算功能。

<details>
<summary>查看原文（23行）</summary>

```text
把 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的 Token 用量算清楚，并归属到**实际服务这次请求的中转站**——不用配置，不用凭据。

Token-usage accounting for DeepSeek Harness, attributed to the relay site that
served each request. The existing Web GUI (`dsh web`) and renderer-neutral
consumers share the same host-owned aggregation. Zero configuration.

![TokenLedger 面板](docs/images/panel.png)

> 展示图使用演示数据与本机模拟中转站；面板上的每个数字都由真实代码路径算出，只是数据是造的。插件不会把 API Key 或上游原始响应发送到浏览器。

## 一眼看懂 / At a glance

| | 能力 | 说明 |
| --- | --- | --- |
| 🎯 | **中转站归属** | 按 provider 的 `baseURL` 归一化 origin 分组——同一站的多把 key 合成一行，站名就是域名，不是你自己起的路由别名 |
| 📁 | **按项目归属** | 用量按会话启动时所在的目录分组——工作区注册过的用它的标题，没注册过的用目录名，子目录里起的会话照样算进去 |
| 🔍 | **零配置发现** | 从宿主的 provider 配置里读出中转站，不用你再填一遍。只读 `baseURL`，绝不碰旁边的凭据 |
| 💳 | **余额** | DeepSeek 官方、New API、Sub2API，每个账户一把普通 key 即可；不限额度的 key 报"已用"而不是假余额 |
| ⏳ | **订阅配额** | 卖套餐不卖余额的家数越来越多——5 小时 / 每周 / 每月各自滚动、各自重置，每个窗口一条进度条和一个重置时刻 |
| 📊 | **用量分析** | 今日/本月/累计三窗口、按站点/模型下钻、缓存命中率、一年活跃度热力图（悬停看当天模型构成） |
| 🧮 | **费用估算** | 生效日期分段的费率表、分桶计价、峰谷时段；未定价的模型显示破折号而不是 0 |
| 🗂 | **导出与诊断** | CSV / JSON 导出，索引健康度，归因不上的行数单独列出 |
| 🔒 | **只读回环** | 两个端点仅接受回环 GET，且在 peer socket 地址上设防；从不读取提示词、工具参数或响应内容 |
```

</details>

**依据 2 · 源码核查**：[src/index.js:30-43](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/index.js#L30-L43)

根plugin与usage库表面。

<details>
<summary>查看原文（14行）</summary>

```text
import { apply as applyPlugin } from "./plugin.js";

export const name = "tokenledger";
export const inject = ["sessionPersistence"];

/** Run the implementation inside an observable root-owned Cordis effect. */
export function apply(ctx, config) {
	return ctx.effect(() => {
		applyPlugin(ctx, config);
		return () => {};
	}, "TokenLedger plugin");
}

export { byModel, bySite, foldUsage } from "./usage.js";
```

</details>

**依据 3 · 源码核查**：[src/plugin.js:211-230](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/plugin.js#L211-L230)

后台sweep读取持久化服务并把列表失败记统计。

<details>
<summary>查看原文（20行）</summary>

```text
export async function sweep(persistence, store, options = {}) {
	const resolveSite = options.resolveSite;
	const logger = options.logger;
	const stats = { scanned: 0, updated: 0, skipped: 0, failed: 0, events: 0 };

	let snapshots;
	try {
		// The harness reworked this seam on 2026-08-28 (`bec6805d6a`,
		// handle-based session persistence): `listSnapshots()` became `list()`.
		// Prefer the new name and keep the old one as a fallback, so a host on
		// either side of that change lists its sessions.
		const listSessions = persistence.list ?? persistence.listSnapshots;
		if (typeof listSessions !== "function") {
			throw new Error("sessionPersistence exposes neither list() nor listSnapshots()");
		}
		snapshots = await listSessions.call(persistence);
	} catch (error) {
		logger?.warn?.("tokenledger: could not list sessions: %s", error?.message ?? error);
		stats.failed++;
		return stats;
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 采集、去重、价格与持久化如何接线？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

sweep按宿主日志revision跳过未变会话；handle路径revision变动时read(0)取得完整事件，跳过fork的seedLength前缀，从空state重折，commitSession在同一SQLite事务删除该会话旧rollup并写新汇总和checkpoint，避免全量重读重复累计或游标先行。单会话异常计failed继续其他会话，后台面板可用不证明没有漏采。聚合器只提取usage chunk/message和请求来源；同一相邻turn/step后报usage会替换前样本，reasoning不另加到output总数。它确实在内存读取事件日志，不能把“不保存提示词到索引”扩写成根本不读取含正文事件。

价格类支持effectiveFrom、分桶与未定价null，缺字段列unpricedBuckets，币种分开求和，这是避免伪零的好设计。但实际区间估算priceWithConfiguredRates先把日期范围合并成byModel，再用range.to或from或今天的单个day调用priceRows；priceRows对所有行用同day且不向rateFor传timeMs。故跨费率变更的范围不会逐日计价，windowed费率需要的时刻也不在该调用里。今天徽标另限官方provider，是不同范围，不能泛称所有统计均精准历史/峰谷计价。这里是源码路径判断，未用真实账单复现差额。

路由归因还依赖当前provider目录和重建流程，不等于独立保全了当时账单来源。宿主adapter缺usage或桶定义改变会直接影响账本；库存代码不能补回供应商未报告值。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.js:247-281](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/plugin.js#L247-L281)

revision跳过/全量读取和fork seed去重。

<details>
<summary>查看原文（35行）</summary>

```text
		try {
			const checkpoint = store.checkpointFor(sessionId);
			const revision = snapshot.revision === undefined ? undefined : String(snapshot.revision);

			// An unchanged log needs no read at all. This is what keeps a sweep
			// cheap enough to run on a timer.
			if (checkpoint !== undefined && revision !== undefined && checkpoint.logRevision === revision) {
				stats.skipped++;
				continue;
			}

			// The handle-based seam reads the log through `open(id, "read")`;
			// `readFrom(id, seq)` is gone with it. The v1→v2 session migration
			// also RENUMBERS event seqs, so a checkpoint's `consumedSeq` can
			// overshoot the renumbered log and yield an empty tail while unread
			// events remain — the session would silently never be counted
			// again. A moved revision therefore re-reads the whole log and
			// re-folds it from scratch; `commitSession` replaces the session's
			// rows wholesale, so the full fold cannot double count.
			let events;
			let state;
			if (typeof persistence.open === "function") {
				const handle = await persistence.open(sessionId, "read");
				try {
					({ events } = await handle.read(0));
				} finally {
					await handle.close();
				}
				// A fork's durable log starts with a copy of its parent's event
				// prefix; DSH records the exclusive end of that inherited prefix
				// as seedLength. A full re-read sees the prefix again, so the
				// fold starts past it — counting it under the child's session id
				// would inflate every fork's ledger.
				const seedLength = snapshot.header?.seedLength ?? 0;
				events = (events ?? []).filter((event) => (event.seq ?? 0) >= seedLength);
```

</details>

**依据 2 · 源码核查**：[src/plugin.js:297-317](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/plugin.js#L297-L317)

聚合后事务提交与会话错误隔离。

<details>
<summary>查看原文（21行）</summary>

```text
			if ((events?.length ?? 0) === 0) {
				stats.skipped++;
				continue;
			}

			applyUsageDelta(state, events, { resolveSite });
			store.commitSession(sessionId, state, {
				logRevision: revision,
				dshVersion: options.dshVersion,
				// The directory the session ran in. Immutable — DSH stamps the
				// header once at creation — so re-folding a session can only ever
				// write the same value back.
				project: snapshot.header?.cwd
			});
			stats.updated++;
			stats.events += events.length;
		} catch (error) {
			// One bad session must not stop the rest, and must never reach DSH.
			stats.failed++;
			logger?.warn?.("tokenledger: session %s failed: %s", sessionId, error?.message ?? error);
		}
```

</details>

**依据 3 · 源码核查**：[src/store.js:298-330](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/store.js#L298-L330)

rollup和checkpoint同事务替换。

<details>
<summary>查看原文（33行）</summary>

```text
	commitSession(sessionId, state, options = {}) {
		const cursor = JSON.stringify({ lastSample: state.lastSample, currentRoute: state.currentRoute });
		const updatedAt = options.updatedAt ?? Date.now();
		this.#transaction(() => {
			this.#stmt.deleteRollups.run(sessionId);
			// Written for every swept session, including one with no cwd, so the
			// "which project" question has an answer for all of them — even when
			// that answer is "we do not know".
			this.#stmt.upsertSession.run(sessionId, normalizeProject(options.project));
			for (const [day, entry] of state.days) {
				for (const [key, buckets] of entry.routes) {
					if (COLUMNS.every((column) => buckets[column] === 0)) continue;
					const { site, provider, model } = parseRouteKey(key);
					this.#stmt.insertRollup.run(
						sessionId,
						day,
						site,
						provider,
						model,
						...COLUMNS.map((column) => buckets[column])
					);
				}
			}
			this.#stmt.upsertCheckpoint.run(
				sessionId,
				state.consumedSeq,
				options.logRevision ?? null,
				cursor,
				options.dshVersion ?? null,
				state.lastUsageAt ?? null,
				updatedAt
			);
		});
```

</details>

**依据 4 · 源码核查**：[src/usage.js:207-235](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/usage.js#L207-L235)

实际取usage与来源字段。

<details>
<summary>查看原文（29行）</summary>

```text
/** Extract the usage sample an event carries, if any. */
function sampleOf(event) {
	if (event.type === "assistant/chunk" && event.data?.chunk?.type === "usage") {
		return { key: `${event.data.turn}:${event.data.step}`, usage: event.data.chunk.usage };
	}
	if (event.type === "assistant/message" && event.data?.usage !== undefined) {
		return { key: `${event.data.turn}:${event.data.step}`, usage: event.data.usage };
	}
	return undefined;
}

/**
 * Provider and model an event names for itself, or undefined when it names
 * neither. `assistant/message` answers from its message source; `request/header`
 * answers from its call config.
 */
function provenanceOf(event) {
	const source = event.data?.message?.source;
	if (source !== undefined && typeof source.model === "string") {
		return {
			provider: typeof source.provider === "string" && source.provider.length > 0 ? source.provider : UNKNOWN,
			model: source.model
		};
	}
	const config = event.data?.header?.config;
	if (config !== undefined && typeof config.model === "string") {
		return {
			provider: typeof config.provider === "string" && config.provider.length > 0 ? config.provider : UNKNOWN,
			model: config.model
```

</details>

**依据 5 · 源码核查**：[src/usage.js:312-340](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/usage.js#L312-L340)

相邻同样本替换及归因。

<details>
<summary>查看原文（29行）</summary>

```text
		const provenance = provenanceOf(event) ?? currentRoute;
		const provider = provenance?.provider ?? UNKNOWN;
		const model = provenance?.model ?? UNKNOWN;
		// Three answers, not two. `undefined` from the resolver means the route
		// is absent from the directory — which is not the same as a route that
		// is present and points at no relay.
		const site = provider === UNKNOWN ? DIRECT : (resolveSite(provider) ?? UNROUTED);
		const key = routeKey(site, provider, model);

		const day = dayKey(event.time);
		const buckets = bucketsOf(sample.usage);

		if (last !== null && last.key === sample.key) {
			// Same (turn, step) re-reported: undo the earlier sample from the exact
			// day and route it was attributed to, then add the new one.
			const previous = state.days.get(last.day);
			if (previous !== undefined) {
				subtractFrom(previous.totals, last.buckets);
				const previousRoute = previous.routes.get(last.route);
				if (previousRoute !== undefined) subtractFrom(previousRoute, last.buckets);
			}
		}

		const entry = entryOf(state.days, day);
		addInto(entry.totals, buckets);
		addInto(routeBucketOf(entry, key), buckets);

		last = { key: sample.key, day, route: key, buckets };
	}
```

</details>

**依据 6 · 源码核查**：[src/usage.js:153-174](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/usage.js#L153-L174)

可选桶默认与reasoning不重复相加。

<details>
<summary>查看原文（22行）</summary>

```text
export function bucketsOf(usage) {
	return {
		inputTokens: usage.inputTokens ?? 0,
		outputTokens: usage.outputTokens ?? 0,
		cacheReadTokens: usage.cacheReadTokens ?? 0,
		cacheWriteTokens: usage.cacheWriteTokens ?? 0,
		reasoningTokens: usage.reasoningTokens ?? 0,
		requests: 1
	};
}

/** Billed input: the three disjoint prompt-side buckets. */
export function inputTotal(buckets) {
	return buckets.inputTokens + buckets.cacheReadTokens + buckets.cacheWriteTokens;
}

/**
 * Total billed tokens. `reasoningTokens` is deliberately excluded — it is
 * already part of `outputTokens` and adding it would double count.
 */
export function totalTokens(buckets) {
	return inputTotal(buckets) + buckets.outputTokens;
```

</details>

**依据 7 · 源码核查**：[src/plugin.js:68-75](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/plugin.js#L68-L75)

区间byModel只传单日估算的调用方。

```text
function priceWithConfiguredRates(store, range, site, rates, provider = undefined) {
	try {
		const table = new RateTable(rates === undefined ? DEEPSEEK_OFFICIAL_RATES : rates);
		const day = range.to ?? range.from ?? dayKey(Date.now());
		return priceRows(store.byModel(range, site, provider), table, day);
	} catch {
		// A malformed rate table costs the cost column, not the report.
		return null;
```

**依据 8 · 源码核查**：[src/pricing.js:138-148](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/pricing.js#L138-L148)

windowed费率缺timeMs会跳过。

<details>
<summary>查看原文（11行）</summary>

```text
	rateFor(model, day, timeMs = undefined) {
		const list = this.#byModel.get(model);
		if (list === undefined) return undefined;
		for (const rate of list) {
			if (rate.effectiveFrom > day) continue;
			if (rate.window !== undefined) {
				if (timeMs === undefined || !inPeriod(rate.window, timeMs)) continue;
			}
			return rate;
		}
		return undefined;
```

</details>

**依据 9 · 源码核查**：[src/pricing.js:218-231](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/pricing.js#L218-L231)

所有行按同一day且不传timeMs。

<details>
<summary>查看原文（14行）</summary>

```text
export function priceRows(rows, table, day) {
	const totals = new Map();
	const unpricedModels = [];
	const priced = rows.map((row) => {
		const rate = table.rateFor(row.model, day);
		const estimate = estimateCost(row, rate);
		if (!estimate.priced) {
			unpricedModels.push(row.model);
		} else {
			totals.set(estimate.currency, round6((totals.get(estimate.currency) ?? 0) + estimate.cost));
		}
		return { ...row, ...estimate };
	});
	return { rows: priced, totals: Object.fromEntries(totals), unpricedModels };
```

</details>

**依据 10 · 源码核查**：[src/http.js:229-237](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/http.js#L229-L237)

今天徽标只取官方provider，不能混同全区间。

```text
export function priceToday(store, site = undefined, rates = undefined) {
	const day = dayKey(Date.now());
	const rows = store.byRoute({ from: day }, site).filter((row) => row.provider === "deepseek-official");
	if (rows.length === 0) return null;
	const table = rates === undefined ? new RateTable(DEEPSEEK_OFFICIAL_RATES) : new RateTable(rates);
	const priced = priceRows(rows, table, day);
	const entries = Object.entries(priced.totals);
	if (entries.length === 0) return null;
	return { cost: entries[0][1], currency: entries[0][0] };
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 凭据、宿主依赖、成本和退出能否支持采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

适合有多路由/项目用量解释需求、能对照原始日志的个人DSH用户先试用usage与归因，不用于报销/结算或仅依赖估算作预算决定。启动必需sessionPersistence，Node声明>=22但真实宿主接口和SQLite环境仍需核对。后台默认60秒sweep，revision变化会整日志重折，历史量越大越需关注I/O和索引延迟；本次未测性能、金额或人工节省。诊断failed、未知路由、未定价均应纳入判断，不能只看总数。

余额是额外网络能力，账户key运行时读取；声明式端点的路径仅允许单斜杠且构造后重核origin，响应大小受限，底层跨源重定向拒绝，属于具体保护，不可据此声称整个凭据系统已安全审计。HTTP面以peer socket和Host双回环为围栏，当前代码允许特定凭据对话POST，不能照旧文案概括“全部只读GET”。不需要余额时先不连接额外账户功能。

用副本日志核对fork、失败usage、重复报告、改路由和价格变化，发现差额无法解释便停止用金额决策，回供应商账单和原日志；用量面板可停用，索引是另存数据库，保留或清理需单独核对，不修改原会话。插件禁用/重建操作不等真实供应商费用撤回。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:32-40](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/index.js#L32-L40)

启动强依赖与effect入口。

```text
export const name = "tokenledger";
export const inject = ["sessionPersistence"];

/** Run the implementation inside an observable root-owned Cordis effect. */
export function apply(ctx, config) {
	return ctx.effect(() => {
		applyPlugin(ctx, config);
		return () => {};
	}, "TokenLedger plugin");
```

**依据 2 · 源码核查**：[src/plugin.js:109-115](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/plugin.js#L109-L115)

默认数据库和60秒sweep。

```text
/** Defaults chosen so an unconfigured mount still does something useful. */
const DEFAULTS = {
	database: "tokenledger.sqlite",
	sweepIntervalMs: 60_000,
	sweepOnStart: true,
	commandEnabled: true
};
```

**依据 3 · 源码核查**：[package.json:41-46](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/package.json#L41-L46)

Node声明范围。

```text
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "test": "node --test \"test/*.test.js\"",
    "fixture:blue": "node test/blue-packed-fixture.mjs --install"
```

**依据 4 · 源码核查**：[src/declarative.js:92-116](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/declarative.js#L92-L116)

声明端点路径/同源构造与body预算。

<details>
<summary>查看原文（25行）</summary>

```text
export function compileEndpoint(declaration) {
	const path = declaration?.path;
	// Rule 2. A path that does not start with exactly one slash is either
	// relative — meaning it would resolve against the origin's own path, which
	// is not what anyone writing this means — or protocol-relative, which is a
	// different host wearing a path's clothes.
	if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) return undefined;

	const fields = declaration.fields ?? {};
	const windows = Array.isArray(declaration.windows) ? declaration.windows : [];
	const raw = declaration.raw === true;

	return {
		label: typeof declaration.displayName === "string" && declaration.displayName !== "" ? declaration.displayName : "Declared",
		// Marks the card, because these numbers came out of paths the user
		// wrote. A wrong path is a configuration mistake, and the interface has
		// to make that distinguishable from the plugin getting it wrong.
		declared: true,
		async read({ origin, get }) {
			const url = new URL(path, origin);
			// Rule 1, enforced again after construction rather than trusted. If
			// these ever disagree, the request does not happen.
			if (url.origin !== new URL(origin).origin) throw Object.assign(new Error("cross-origin-path"), { kind: "declaration" });

			const body = await get(url.href, { raw, sameOrigin: url.origin, maxBytes: 1_000_000 });
```

</details>

**依据 5 · 源码核查**：[src/balance.js:150-166](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/balance.js#L150-L166)

请求拒绝跨源重定向。

<details>
<summary>查看原文（17行）</summary>

```text
async function fetchNoCrossOriginRedirect(doFetch, url, init) {
	let current = url;
	for (let hop = 0; ; hop++) {
		const response = await doFetch(current, { ...init, redirect: "manual" });
		const status = response?.status;
		if (status !== 301 && status !== 302 && status !== 303 && status !== 307 && status !== 308) return response;

		const location = response.headers?.get?.("location");
		if (location === undefined || location === null || location === "" || hop >= MAX_REDIRECTS) {
			throw Object.assign(new Error(`http-${status}`), { status });
		}
		const next = new URL(location, current);
		if (next.origin !== new URL(current).origin) {
			// Not a transport failure — a refusal to hand the credential over.
			throw Object.assign(new Error("cross-origin-redirect"), { kind: "cross-origin-redirect" });
		}
		current = next.href;
```

</details>

**依据 6 · 源码核查**：[src/http.js:117-129](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/http.js#L117-L129)

实际HTTP peer+Host围栏与特定POST。

<details>
<summary>查看原文（13行）</summary>

```text
export function screenRequest(req) {
	const path = pathOf(req?.url);
	const method = req?.method;
	// POST exists for exactly one route — the credentials dialog. Everywhere
	// else the surface stays read-only, and an unexpected POST is refused
	// before the loopback fence is even consulted.
	const methodOk = method === "GET" || (method === "POST" && path === USERAUTH_PATH);
	if (!methodOk) return { status: 405, body: { ok: false, error: "method-not-allowed" } };
	const peerOk = isLoopbackAddress(req.socket?.remoteAddress);
	const hostOk = isLoopbackAddress(hostNameOf(req.headers?.host));
	// Both, and the peer address is the one that cannot be forged.
	if (peerOk && hostOk) return undefined;
	return { status: 403, body: { ok: false, error: "forbidden" } };
```

</details>

#### 缺口

- 真实宿主事件/adapter完整性、全部账户余额方案、SQLite性能与退出清理未执行。
  **影响**：不能保证账本对齐供应商结算或全部环境可用。
  **进一步探讨**：固定副本日志与宿主，核各桶/归因、漏采诊断、重启/重建与残留，再单独验余额账户。
- 没有相对手工核账的时长、差额解释率与总维护负担数据。
  **影响**：无法证明账本已节省成本或减轻核账。
  **进一步探讨**：对同一批会话比较原日志/账单与账本，计漏采、配置、纠错和全部人工时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎么验证账本可解释且没有误导费用决策？

**研究主题**：新假设与验证

#### 完整回答

已有未定价null、unpricedBuckets、未知路由和索引诊断，不应提出“把未知显示出来”当新发现。由实际价格链压平日期和缺乏请求时刻，可推导一个明确改进假设：保留按日/实际计费时段的usage粒度，在费率变更点逐段估算，并将本地估算、上游实际金额及不可对齐差额分栏，可能比单个区间费率更能解释账单。需要更细数据与维护，不能补造历史缺失时刻或当时路由。

最小实验不用真实账号，构造跨effectiveFrom、峰谷、cache桶、fork、失败usage和未知模型的有来源日志，再用人工可复算账本作oracle，对比当前区间路径和逐段路径。测金额偏差、未定价覆盖、差额可解释率、索引资源和配置时间。若输入不够支持分段就必须保持未知；若修复没减少偏差、引入重复计价或维护成本超过解释收益，则否定。真实费率仍需使用者针对账户和日期独立核实，不把示例数当最新收费建议。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.js:68-75](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/plugin.js#L68-L75)

当前区间压平是实验对照点。

```text
function priceWithConfiguredRates(store, range, site, rates, provider = undefined) {
	try {
		const table = new RateTable(rates === undefined ? DEEPSEEK_OFFICIAL_RATES : rates);
		const day = range.to ?? range.from ?? dayKey(Date.now());
		return priceRows(store.byModel(range, site, provider), table, day);
	} catch {
		// A malformed rate table costs the cost column, not the report.
		return null;
```

**依据 2 · 源码核查**：[src/pricing.js:138-148](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/pricing.js#L138-L148)

费率选择具有日期/时段条件，调用必须有粒度支持。

<details>
<summary>查看原文（11行）</summary>

```text
	rateFor(model, day, timeMs = undefined) {
		const list = this.#byModel.get(model);
		if (list === undefined) return undefined;
		for (const rate of list) {
			if (rate.effectiveFrom > day) continue;
			if (rate.window !== undefined) {
				if (timeMs === undefined || !inPeriod(rate.window, timeMs)) continue;
			}
			return rate;
		}
		return undefined;
```

</details>

**依据 3 · 源码核查**：[src/pricing.js:166-185](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/pricing.js#L166-L185)

已有缺失桶报告，不把未知机制重命名新方案。

<details>
<summary>查看原文（20行）</summary>

```text
export function estimateCost(buckets, rate) {
	if (rate === undefined) {
		return { cost: null, currency: undefined, priced: false, unpricedBuckets: [...RATE_BUCKETS] };
	}
	let cost = 0;
	const unpriced = [];
	for (const bucket of RATE_BUCKETS) {
		const tokens = buckets[bucket] ?? 0;
		const price = rate.perMillion[bucket];
		if (price === undefined) {
			if (tokens > 0) unpriced.push(bucket);
			continue;
		}
		cost += (tokens / 1_000_000) * price;
	}
	return {
		cost: round6(cost),
		currency: rate.currency,
		priced: true,
		unpricedBuckets: unpriced
```

</details>

**依据 4 · 源码核查**：[src/store.js:307-317](https://github.com/zh667/TokenLedger/blob/438d3086249d427e7185a69c5453cb1553c84f0b/src/store.js#L307-L317)

已有按day存储粒度，可支撑一部分逐日改进。

<details>
<summary>查看原文（11行）</summary>

```text
			for (const [day, entry] of state.days) {
				for (const [key, buckets] of entry.routes) {
					if (COLUMNS.every((column) => buckets[column] === 0)) continue;
					const { site, provider, model } = parseRouteKey(key);
					this.#stmt.insertRollup.run(
						sessionId,
						day,
						site,
						provider,
						model,
						...COLUMNS.map((column) => buckets[column])
```

</details>

#### 缺口

- 逐段计价对所有事件来源与资源负担的改善未实现/测量。
  **影响**：不能声称金额已更准确或历史数据足够。
  **进一步探讨**：先用固定合成边界日志与人工oracle比较误差，再在获授权真实账户另核。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
