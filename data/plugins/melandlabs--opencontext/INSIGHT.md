# OpenContext

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[3059d8a](https://github.com/melandlabs/opencontext/tree/3059d8afe072e36894acdd21c5e17ae1c8ec69d6)

<!-- BEGIN META -->
[![GitHub ★ 76](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=76&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/melandlabs/opencontext)
<!-- END META -->

> **功能**：面向Agent应用的记忆、检索和图修订基础设施，提供库facade及MCP/HTTP入口。

> **亮点**：[Q01](#research-q01) 统一可嵌入面；[Q02](#research-q02) 多源可解释检索；[Q03](#research-q03) 图版本和重放守卫。

> **主要限制**：[Q03](#research-q03) 图和raw退役非原子且applied不等于实际写成功；[Q04](#research-q04) HTTP身份绑定要host补足。

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
  - [Q01 · 根项目的真实交付入口是什么？](#detail-section-11)
  - [Q02 · 统一检索怎样聚合证据，哪里会降级？](#detail-section-12)
  - [Q03 · 图修订和旧记录退役是否完整原子提交？](#detail-section-13)
  - [Q04 · 部署、认证、安全库和退出需哪些具体条件？](#detail-section-14)
  - [Q05 · 写结果增加逐路径状态能否减少错误恢复？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要把多源持久证据接入自建Agent应用并能承担宿主治理的开发者。

自行拼SQLite、向量检索、提示合成和记忆修订逻辑。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 持久数据层 | raw/VSA和可插后端 | Postgres需factory仍有本地VSA |
| 多源检索 | RRF与可选reasoning/synthesis | 依赖源和模型配置 |
| 图修订 | owner版本重放守卫 | raw退役另一写路径 |
| 服务入口 | MCP与HTTP | host必须绑定认证scope |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node/pnpm及原生SQLite | 库默认需要 | raw/VSA和索引 | 构建加载须核 |
| embedding/vector后端 | 语义需要 | 本地ONNX或外部服务 | 未配置需读降级warning |
| Postgres factory | 选择Postgres时必需 | 后端适配 | 缺失明确错误非静默回退 |
| 模型提供方 | reasoning/synthesis可选 | 改写合成反思 | token费用及外传 |
| 可信host身份绑定 | 共享或HTTP需要 | scope授权与限额 | body userId非认证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 独立OPENCONTEXT_HOME备份并用SQLite | 无敏感测试数据 |
| 检索 | 固定userId看sources/warnings和证据 | 区分空与不可用 |
| 修订 | consolidate显式dryRun再核计划 | 不凭applied执行重试 |
| 退出 | 先停HTTP等handler再关存储 | 备份DB索引日志及密钥 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 原生编译与embedding模型磁盘未知 | 选后端与身份治理 | 根不是直接DSH安装包 |
| 持续 | embedding/模型/向量服务资源费用 | 监控sourceStates及检索反例 | 策略改写可增加请求 |
| 故障 | 多个库索引与图历史 | 逐路径核部分提交和备份 | applied非写成功证明 |
| 退出 | 数据日志密钥备份留存 | 分别停MCP/HTTP及host作业 | 软退役非删除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 检索融合 | RRF与sourceStates/warnings | 真实召回和跨域质量 |
| 图持久化 | owner/CAS/replay | 后端故障恢复 |
| 可嵌入面 | facade及CLI/MCP/HTTP | 应用集成耗时 |
| 历史修订 | 图计划和raw软退役 | 跨路径一致性 |

> **思考**：[Q03](#research-q03) 图和raw退役非原子且applied不等于实际写成功；[Q04](#research-q04) HTTP身份绑定要host补足。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 统一可嵌入面；[Q02](#research-q02) 多源可解释检索；[Q03](#research-q03) 图版本和重放守卫。

[Q03](#research-q03) CAS保护图内不等于图/raw原子提交，结果须逐路径核。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 图和raw退役非原子且applied不等于实际写成功；[Q04](#research-q04) HTTP身份绑定要host补足。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先loopback单用户只读及dryRun，再由host加授权。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查核心facade、检索、图写和部署边界，未重现作者benchmark或平台运行。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/ai/memory-consolidation/src/reflect-planner.ts、packages/indexeddb/src/memory-graph-evolution.ts、packages/loop/src/index.ts、packages/memory-store/src/http.ts、packages/memory-store/src/index.ts、packages/memory-store/src/memory-store-graph.ts、packages/memory-store/src/search/apply-reflect.ts、packages/memory-store/src/search/unified-search.ts、packages/memory-store/src/storage/raw-message-store.ts、packages/opencontext/package.json、packages/opencontext/src/index.ts、packages/security/src/token-encryption.ts、packages/security/src/url-validator.ts、packages/sqlite/src/raw-message-manager.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根基础设施的facade、核心存储检索图及部署面；DSH子插件独立，平台集成和自评未作生产验证。
- 下一步：固定数据集检索反例、图conflict/raw失败、身份隔离和handler关闭需复现，本次未执行。

**分析版本**

- **仓库**：[melandlabs/opencontext](https://github.com/melandlabs/opencontext)
- **版本号**：0.1.0（[固定提交 3059d8a](https://github.com/melandlabs/opencontext/tree/3059d8afe072e36894acdd21c5e17ae1c8ec69d6)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 逐路径写状态是否减少误重试需故障对照。

固定数据集检索反例、图conflict/raw失败、身份隔离和handler关闭需复现，本次未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 162 | 24404 | — | — | 167576 |
| .mjs | source | 7 | 2825 | 2694 | 84 | — |
| .mjs | test | 3 | 610 | 591 | 2 | — |
| .ts | source | 624 | 144317 | 115398 | 17126 | — |
| .ts | test | 174 | 35650 | 30206 | 1791 | — |
| .md | example | 7 | 851 | — | — | 4268 |
| .cjs | example | 1 | 41 | 22 | 13 | — |
| .ts | example | 76 | 10607 | 7767 | 1882 | — |
| .js | source | 4 | 731 | 546 | 113 | — |
| .tsx | source | 2 | 276 | 205 | 28 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/melandlabs/opencontext/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：OpenContext根基础设施怎样提供持久检索与图修订，写入、身份和部署保证止于哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目的真实交付入口是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

根是private monorepo的agent应用基础设施，entry_type应为infrastructure，不是直接安装根当DSH插件，也不是单一桌面客户端。公开facade在packages/opencontext，导出contracts、memory store、RAG与AI等，CLI提供MCP/HTTP及记忆命令；DSH adapter是独立身份，不能重复归根插件能力。README称四动词/调度平台，当前createMemoryStore实际返回raw、search、unified/semantic、vsa与consolidate，并用可变wiring让后挂graph生效，不应猜成统一remember/revise同一事务API。

默认raw backend是SQLite，env选择postgres必须注册factory，缺失不静默退SQLite。facade仍初始化SQLite VSA，因此选Postgres不证明整个栈已去本地SQLite。loop叶子包只导出路径与偏好，注释说明runner/tick/store在host应用，不能给库条目一个已验证后台调度器能力。贡献是多个包组合和可嵌入契约，调用方仍需选后端、认证和实际业务入口。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-13](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/package.json#L1-L13)

根private workspace身份

<details>
<summary>查看原文（13行）</summary>

```text
{
	"name": "opencontext-monorepo",
	"version": "0.1.0",
	"private": true,
	"type": "module",
	"description": "opencontext — open-source runtime substrate for agentic applications. A temporal context graph, 4-verb memory API, retrieval-augmented generation primitives, and a multi-platform integration mesh.",
	"scripts": {
		"dev": "pnpm --filter web dev",
		"dev:all": "pnpm -r --parallel dev",
		"test": "pnpm -r test",
		"tsc": "pnpm -r --if-present typecheck",
		"build": "pnpm -r build",
		"build:packages": "cross-env NODE_OPTIONS=--max-old-space-size=16384 pnpm -r --filter='./packages/*' build",
```

</details>

**依据 2 · 源码核查**：[packages/opencontext/package.json:1-10](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/opencontext/package.json#L1-L10)

公开facade与CLI

<details>
<summary>查看原文（10行）</summary>

```text
{
	"name": "@melandlabs/opencontext",
	"version": "0.13.7",
	"type": "module",
	"description": "OpenContext — single-package facade that bundles the contracts, memory-store, retrieval, loop engine, and agent runtime. Install once, get every capability.",
	"main": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"bin": {
		"opencontext": "./dist/cli/opencontext.js"
	},
```

</details>

**依据 3 · 源码核查**：[packages/opencontext/src/index.ts:29-61](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/opencontext/src/index.ts#L29-L61)

记忆与检索导出

<details>
<summary>查看原文（33行）</summary>

```text

// ─── 2. Memory store: the four-verb memory API + unified search ───────────
export {
	createMemoryStore,
	createRawMessageStore,
	getRawMessageManager,
	isRawMessageStorageAvailable,
	getRawMessageStorageBackend,
	closeRawMessageStore,
	registerPostgresFactory,
	clearPostgresFactory,
	hasPostgresFactory,
	resolvePostgresFactory,
	clampUnifiedMemorySearchLimit,
	clampUnifiedMemorySearchThreshold,
	isRawMemorySemanticResult,
	mergeUnifiedMemorySearchResults,
	normalizeUnifiedMemoryReasoningStrategy,
	normalizeUnifiedMemorySearchSources,
	toKnowledgeResult,
	toMemoryResult,
	listNameToChannel,
	materializeSignals,
	mergeUnifiedMemorySearchResultsRrf,
	distillRawMessage,
	deriveFacts,
	createUserVoiceRewriter,
	createIdentityRewriter,
	createIterativeRecallPlanner,
	createIdentityIterativePlanner,
} from "@melandlabs/memory-store";

export type {
```

</details>

**依据 4 · 源码核查**：[packages/memory-store/src/index.ts:92-179](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/memory-store/src/index.ts#L92-L179)

真实store形状及VSA

<details>
<summary>查看原文（88行）</summary>

```text
export async function createMemoryStore(config: MemoryStoreConfig = {}): Promise<MemoryStore> {
	const dbPath =
		config.dbPath ?? (config.db && "path" in config.db ? (config.db as { path?: string }).path : undefined);
	const raw = createRawMessageStore({ env: config.env, dbPath });
	// Forward the host-configured `logger` into the unified-search facade so
	// `consolidate` honours it instead of always using `console`.
	const search = createUnifiedSearch({ ...config.unified, logger: config.logger });

	// Make the legacy `getRawMessageManager()` module-level facade
	// point at this configuration so callers that don't go through
	// `createMemoryStore` still get the right backend.
	configureRawMessageStore(config);

	// Mutable wiring shared between the write path (`consolidate`) and the
	// opt-in `attachMemoryGraphStore` helper. A holder object (rather than two
	// captured `const`s) is required so that `attachMemoryGraphStore` — which
	// assigns `store.graphStore` — actually changes what `consolidate`
	// forwards. Previously it only overwrote a dead property and the attached
	// graph store was silently ignored, leaving `consolidate` in
	// deprecate-only mode no matter what.
	const wiring: {
		graphStore?: import("@melandlabs/memory-consolidation").MemoryGraphStoreWithOperationHistory;
		storage?: import("@melandlabs/memory-consolidation").MemoryStorageAdapterLike;
	} = {
		graphStore: config.graphStore,
		storage: config.storage,
	};

	// VSA facade — lazily open the SQLite VSA store. Shares the same DB
	// file as the raw-message store, so `init()` is a no-op if the schema
	// has already been brought up by `raw.init()`. Resolve the DB path
	// here because `getSQLiteVsaStore` lives in `@melandlabs/sqlite`
	// (which `memory-store` depends on) and can't import the env-aware
	// `resolveSQLiteRawMessageDbPath` helper without forming a cycle.
	const vsaDbPath =
		config.dbPath ??
		(config.db && "path" in config.db ? (config.db as { path?: string }).path : undefined) ??
		resolveSQLiteRawMessageDbPath();
	const vsaStorage: SQLiteVsaStore = await getSQLiteVsaStore({
		dbPath: vsaDbPath,
	});
	const vsa = createVsaRecall(vsaStorage);

	const applyConsolidate = (input: ApplyConsolidateInput) =>
		search.consolidate({
			...input,
			graphStore: input.graphStore ?? wiring.graphStore,
			storage: input.storage ?? wiring.storage,
		});

	const store: MemoryStore = {
		raw,
		// Flat search verb — `search({ synthesize: true })` opts into the
		// read-only LLM synthesis path.
		search: search.search,
		vsa,
		getRawMessageManager,
		searchUnifiedMemory: search.searchUnifiedMemory,
		searchRawMemorySemantically: search.searchRawMemorySemantically,
		consolidate: applyConsolidate,
		get graphStore() {
			return wiring.graphStore;
		},
		set graphStore(value) {
			wiring.graphStore = value;
		},
		get storage() {
			return wiring.storage;
		},
		set storage(value) {
			wiring.storage = value;
		},
	};

	return store;
}

export type { MemoryStoreConfig };
export type { SearchRuntimeContext } from "./search/applicability";
export {
	createRawMessageStore,
	getRawMessageManager,
	isRawMessageStorageAvailable,
	getRawMessageStorageBackend,
	closeRawMessageStore,
	type RawMessageStorageBackend,
	type RawMessageStorageManagerWithSearch,
} from "./storage/raw-message-store";
```

</details>

**依据 5 · 源码核查**：[packages/memory-store/src/storage/raw-message-store.ts:1-15](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/memory-store/src/storage/raw-message-store.ts#L1-L15)

后端factory条件

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Top-level raw-message store facade.
 *
 * Backend selection is env-var driven:
 *
 *   - `OPENCONTEXT_MEMORY_STORE_BACKEND=postgres` → use the host's
 *     registered Postgres factory. A factory MUST be registered first
 *     via `registerPostgresFactory()`; otherwise this throws a clear
 *     error rather than silently falling back.
 *   - Any other value (including unset) → local SQLite. The default
 *     works in every host environment with no extra configuration.
 *
 * The facade exposes the common `RawMessageStorageManager` contract plus
 * a typed `searchMessagesSemantically` extension when present.
 */
```

</details>

**依据 6 · 源码核查**：[packages/loop/src/index.ts:1-12](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/loop/src/index.ts#L1-L12)

叶子不是调度器

<details>
<summary>查看原文（12行）</summary>

```text
// @melandlabs/loop — leaf filesystem / preferences primitives.
//
// `paths` and `cli-path` are pure node:fs/path; `preferences` depends on
// `paths`. Files that need the on-disk snapshot store, agent bridge, or DB
// (`store.ts`, `runner.ts`, `tick.ts`, `brief.ts`, `wrap.ts`, `connectors.ts`,
// `composio-bridge.ts`, `composio-cli.ts`, `handlers.ts`, `watcher.ts`, …)
// live in the host application — they pull in dependencies that don't
// belong in a leaf package.

export * from "./paths";
export * from "./cli-path";
export { readPreferences, writePreferences } from "./preferences";
```

</details>

#### 缺口

- 真实安装包和应用运行、平台集成矩阵未复现
  **影响**：不能把仓库总述当全部开箱即用服务
  **进一步探讨**：独立数据目录选择最小SQLite库入口核真实导出与关闭

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 统一检索怎样聚合证据，哪里会降级？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

search按tiers收raw/insight/knowledge/workspace，只有synthesize时默认加summary并可调用生成模型；只读search不会因此自动修改记忆。统一层默认RRF，limit/candidateLimit有上限，支持rewrite/iterative/union等可选reasoning provider，缺provider会给warning而不是凭空有能力。peerScope需要host检查，userId向各查询传递；内建raw不能执行applicability上下文时会跳过并给memory_applicability_not_enforced，不能把缺过滤当匹配结果。

根系统的证据、warnings、sourceStates及retrievalDiagnostics允许分辨哪个源未准备，不应只看count或answer。raw SQLite支持语义/词法和includeDeprecated，默认不返回退役条，历史审计需显式选择。RRF是候选排序融合不是事实正确性证明；向量后端、embedding model、reasoning策略、query及数据域变化都会影响质量与成本。README高分自评明确并非官方AML成绩，本研究不复现、更不外推到DSH适配或生产用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[packages/memory-store/src/search/unified-search.ts:1285-1338](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/memory-store/src/search/unified-search.ts#L1285-L1338)

RRF候选和peerScope

<details>
<summary>查看原文（54行）</summary>

```text
	async function searchUnifiedMemoryWithRuntime(
		input: UnifiedMemorySearchInput,
		runtimeContext?: ResolvedSearchRuntimeContext,
	): Promise<UnifiedMemorySearchOutput> {
		const searchStartedAt = monotonicNow();
		const query = input.query.trim();
		const sources = normalizeUnifiedMemorySearchSources(input.sources);
		const sourceStates: SearchSourceState[] = [];
		const limit = clampUnifiedMemorySearchLimit(input.limit);
		// RRF is the new default merge strategy (see the `@melandlabs/memory-store`
		// changeset). A caller can override per-request via `input.mergeStrategy`,
		// or fall back to the legacy similarity order via
		// `deps.reasoning.defaultMergeStrategy = "similarity"`.
		const mergeStrategy = normalizeUnifiedMemoryMergeStrategy(
			input.mergeStrategy ?? deps.reasoning?.defaultMergeStrategy ?? "rrf",
		);
		const rrfWeights = input.rrfWeights ?? deps.defaultRrfWeights ?? {};
		const rrfK = input.rrfK ?? deps.defaultRrfK ?? 60;
		const sessionNeighborExpansion = input.sessionNeighborExpansion ?? deps.defaultSessionNeighborExpansion;
		const candidateLimit = Math.min(400, Math.max(limit, input.candidateLimit ?? limit * 4));
		const threshold = clampUnifiedMemorySearchThreshold(input.threshold);
		const memoryThreshold =
			input.threshold === undefined && mergeStrategy === "rrf" ? Number.NEGATIVE_INFINITY : threshold;
		const reasoningStrategy = resolveReasoningStrategy(input);
		const warnings: UnifiedMemorySearchWarning[] = [];

		// Resolve the optional `peerFilter` against the host's `peerScopeCheck`.
		// `resolveScopePeer` guarantees the resulting peers are a strict
		// narrowing of `userId` and never broaden the search scope.
		const peerScope =
			input.peerFilter && input.peerFilter.length > 0
				? await resolveScopePeer({
						userId: input.userId,
						peerFilter: input.peerFilter,
						scopeCheck: deps.peerScopeCheck,
					})
				: { peers: [] as Peer[], warnings: [] as UnifiedMemorySearchWarning[] };
		warnings.push(...peerScope.warnings);
		const peerPeers = peerScope.peers;

		if (!query) {
			return {
				query,
				sources,
				results: [],
				count: 0,
				warnings,
				sourceStates,
			};
		}

		let memorySubs: MemorySubQueries | undefined;
		let memoryTimings: MemorySourceTimings | undefined;
		let retrievalStatus:
```

</details>

**依据 2 · 源码核查**：[packages/memory-store/src/search/unified-search.ts:1716-1792](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/memory-store/src/search/unified-search.ts#L1716-L1792)

tiers及synthesis区分

<details>
<summary>查看原文（77行）</summary>

```text
	async function searchWithResolvedRuntime(
		input: SearchInput,
		runtimeContext: ResolvedSearchRuntimeContext | undefined,
	): Promise<SearchOutput> {
		const query = input.query.trim();
		const wantsSynthesis =
			typeof input.synthesize === "boolean"
				? input.synthesize
				: typeof input.synthesize === "object" && input.synthesize !== null;
		const synthesisSchema =
			typeof input.synthesize === "object" && input.synthesize !== null
				? (input.synthesize.responseSchema ?? input.responseSchema)
				: input.responseSchema;

		const peerScope = await resolveSearchScopePeers({
			deps,
			userId: input.userId,
			peerFilter: input.peerFilter,
		});

		// Empty query short-circuit — we can't gather evidence, but the
		// synthesis path still wants to know that the prompt was empty.
		if (!query) {
			const empty: SearchOutput = {
				query,
				sources: input.sources ? [...input.sources] : [],
				results: [],
				evidence: [],
				count: 0,
				warnings: peerScope.warnings,
				sourceStates: [],
				answer: "",
			};
			return empty;
		}

		// Decide which tiers to gather. Explicit `input.tiers` wins; when
		// absent, synthesis includes the summary tier; read-only search
		// gathers the four read sources without summaries.
		const tiers: ReadonlyArray<SearchTier> = input.tiers
			? [...input.tiers]
			: wantsSynthesis
				? (["summary", "raw", "insight", "knowledge", "workspace"] as const)
				: (["raw", "insight", "knowledge", "workspace"] as const);
		const wantsSummaryTier = tiers.includes("summary");
		const wantsRawTier = tiers.includes("raw");
		const wantsInsightTier = tiers.includes("insight");
		const wantsKnowledgeTier = tiers.includes("knowledge");
		const wantsWorkspaceTier = tiers.includes("workspace");

		const warnings: UnifiedMemorySearchWarning[] = [...peerScope.warnings];
		const limit = clampUnifiedMemorySearchLimit(input.limit);
		const threshold = clampUnifiedMemorySearchThreshold(input.threshold);

		// Read pipeline — handles RRF merge, reasoning strategies,
		// date filtering, lexical fallback, and the
		// `memory_lexical_search_not_configured` warning. Only run when
		// the caller's tier list actually needs at least one read source.
		let unifiedHits: UnifiedMemorySearchResult[] = [];
		let sources: UnifiedMemorySearchSource[] = input.sources ? [...input.sources] : [];
		let unifiedReasoning: UnifiedMemoryReasoningInfo | undefined;
		let retrievalDiagnostics: SearchOutput["retrievalDiagnostics"];
		let sourceStates: SearchSourceState[] = [];
		if (wantsRawTier || wantsInsightTier || wantsKnowledgeTier || wantsWorkspaceTier) {
			const inferredSources: UnifiedMemorySearchSource[] =
				sources.length > 0
					? sources
					: [
							...(wantsRawTier ? (["memory"] as const) : []),
							...(wantsInsightTier ? (["insights"] as const) : []),
							...(wantsKnowledgeTier ? (["knowledge"] as const) : []),
							...(wantsWorkspaceTier ? (["workspace"] as const) : []),
						];
			const unified = await searchUnifiedMemoryWithRuntime(
				{
					...searchInputToUnified(input),
					sources: inferredSources.length > 0 ? inferredSources : undefined,
```

</details>

**依据 3 · 源码核查**：[packages/memory-store/src/search/unified-search.ts:300-310](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/memory-store/src/search/unified-search.ts#L300-L310)

适用性无法强制时warning

<details>
<summary>查看原文（11行）</summary>

```text
function warnApplicabilityNotEnforced(warnings: UnifiedMemorySearchWarning[]): void {
	if (warnings.some((warning) => warning.code === "memory_applicability_not_enforced")) {
		return;
	}
	warnings.push({
		source: "memory",
		code: "memory_applicability_not_enforced",
		message:
			"Built-in raw-message retrieval was skipped because it cannot enforce the supplied applicability context. Configure an applicability-aware raw-message provider.",
	});
}
```

</details>

**依据 4 · 源码核查**：[packages/memory-store/src/storage/raw-message-store.ts:40-83](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/memory-store/src/storage/raw-message-store.ts#L40-L83)

后端语义词法及退役条件

<details>
<summary>查看原文（44行）</summary>

```text
		userId?: string;
	}) => Promise<RawMessageSearchChunk[]>;
	getRawMessageSearchIndexStats?: () => Promise<RawMessageSearchIndexStats>;
	searchMessagesSemantically?: (input: {
		userId: string;
		queryEmbedding: number[];
		embeddingModel?: string;
		limit?: number;
		scanLimit?: number;
		threshold?: number;
		includeArchived?: boolean;
		/**
		 * Forward `includeDeprecated` from the unified search input so
		 * supersession-aware callers can opt into deprecated rows for
		 * audits. Default `false` preserves the current-truth behaviour.
		 */
		includeDeprecated?: boolean;
		platform?: string;
		botId?: string;
		channel?: string;
		person?: string;
		startTime?: number;
		endTime?: number;
	}) => Promise<unknown[]>;
	lexicalSearchMessages?: (input: {
		userId: string;
		keywords: string[];
		limit?: number;
		includeArchived?: boolean;
		/**
		 * Forward `includeDeprecated` from the unified search input so
		 * supersession-aware callers can opt into deprecated rows for
		 * audits. Default `false` preserves the current-truth behaviour.
		 */
		includeDeprecated?: boolean;
		platform?: string;
		botId?: string;
	}) => Promise<unknown[]>;
};

export interface CreateRawMessageStoreOptions {
	env?: MemoryStoreEnv;
	/** Custom SQLite DB file path. Only used by the SQLite backend. */
	dbPath?: string;
```

</details>

**依据 5 · 作者声明**：[README.md:77-93](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/README.md#L77-L93)

作者自评与AML范围

<details>
<summary>查看原文（17行）</summary>

```text
| ------------- | ----- | ----------------------------------------------------------------- |
| LongMemEval-S | 97.6% | Long-term memory recall across long sessions                      |
| LoCoMo-V2     | 97.4% | QA over long multimodal conversations                            |
| BEAM @ 10M    | 67.0% | Factual recall at a 10M-token context window                      |

> Scores above are **opencontext self-evaluations** on the public datasets,
> produced by our own harnesses under [`benchmark/`](./benchmark). They are
> not Agent Memory Leaderboard (AML) results — AML evaluates against
> private refined datasets on its own platform. Official AML scores, once
> our hosted submission completes, will appear on the leaderboard card; see
> [`benchmark/aml-local/`](./benchmark/aml-local) for the submission.

## Quick Start

There are several ways to get opencontext into your project. Pick the one
that matches what you're building.

```

</details>

#### 缺口

- 公开基准当前版本可复现、用户数据召回及各源配置效果未验证
  **影响**：不能把自评排为跨系统能力榜或生产质量保证
  **进一步探讨**：固定小数据集记录sources/warnings与错误案例，再决定reasoning

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 图修订和旧记录退役是否完整原子提交？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

图store按ownerScope上进程内锁，拒绝scope mismatch、禁用持久化或无CAS能力，读取ledger版本并按operationId防重放，expectedVersion不符返回conflict。CAS提交整个ledger，失败复读检查是否别人已应用全部operation，分别返回replayed/conflict。因此图内有明确防重与版本设计，不能笼统说只有内存或完全无事务。

上层consolidate先search/synthesize获得证据，再build反思计划；dryRun默认false，只有显式true才不写。apply先persist图，异常只warning后继续按userId分组deprecate raw记录；图缺失也允许deprecation-only。图CAS返回conflict是返回值不是异常，上层仍进入退役路径，二者不在一个原子事务。最终applied=!dryRun，连空计划、无写路径或写失败都可能applied:true，deprecationCounts由计划聚合而非实际changes。因此消费者必须核persistenceResult、warnings与实际readback，不能把applied或计划计数当全部成功，软退役也不是数据销毁。

#### 证据与依据

**依据 1 · 源码核查**：[packages/memory-store/src/memory-store-graph.ts:44-62](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/memory-store/src/memory-store-graph.ts#L44-L62)

缺CAS不挂图

<details>
<summary>查看原文（19行）</summary>

```text
export function attachMemoryGraphStore(store: MemoryStore, input: AttachMemoryGraphStoreInput): MemoryStore {
	const logger = input.logger ?? console;
	if (typeof input.storage.compareAndSwapGraphLedger !== "function") {
		logger.warn?.(
			"[memory-store] attachMemoryGraphStore: storage is missing `compareAndSwapGraphLedger`; no graph store attached.",
		);
		return store;
	}

	const graphStore = createRawMessageMemoryGraphStore({
		storage: input.storage,
		ownerScope: input.ownerScope,
		botId: input.botId,
		now: input.now,
	});

	store.graphStore = graphStore;
	return store;
}
```

</details>

**依据 2 · 源码核查**：[packages/indexeddb/src/memory-graph-evolution.ts:347-383](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/indexeddb/src/memory-graph-evolution.ts#L347-L383)

scope版本重放守卫

<details>
<summary>查看原文（37行）</summary>

```text
		async persistPlan(plan) {
			return withOwnerGraphLock(ownerScopeKey(input.ownerScope), async () => {
				if (!sameOwnerScope(plan.ownerScope, input.ownerScope)) {
					return noMutationResult(plan, ["memory_graph_scope_mismatch"]);
				}
				const invalidScopes = scopeErrors(plan);
				if (invalidScopes.length > 0) {
					return noMutationResult(plan, invalidScopes);
				}
				if (!plan.persistence.enabled || plan.persistence.mode !== "write") {
					return noMutationResult(plan, ["memory_graph_persistence_disabled"]);
				}
				const compareAndSwap = input.storage.compareAndSwapGraphLedger;
				if (typeof compareAndSwap !== "function") {
					return noMutationResult(plan, ["memory_graph_atomic_persistence_unavailable"]);
				}

				const ledgerMessage = await readLedgerMessage();
				const ledger = parseLedgerMessage(ledgerMessage);
				const currentVersion = ledger.snapshot.version ?? "0";
				const appliedIds = new Set(ledger.appliedOperations.map((operation) => operation.operationId));
				const pendingOperations = plan.operations.filter(
					(operation) => !appliedIds.has(operation.operationId),
				);
				if (pendingOperations.length === 0) {
					return noMutationResult(plan, ["memory_graph_operation_replayed"], {
						replayed: true,
						version: currentVersion,
					});
				}
				if (plan.expectedVersion !== undefined && plan.expectedVersion !== currentVersion) {
					return noMutationResult(plan, ["memory_graph_version_conflict"], {
						conflict: true,
						version: currentVersion,
					});
				}

```

</details>

**依据 3 · 源码核查**：[packages/indexeddb/src/memory-graph-evolution.ts:437-459](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/indexeddb/src/memory-graph-evolution.ts#L437-L459)

CAS复读冲突

<details>
<summary>查看原文（23行）</summary>

```text
				const stored = await compareAndSwap.call(input.storage, ledgerUpdate, {
					expectedVersion: currentVersion,
					metadataKey: LEDGER_METADATA_KEY,
				});
				if (!stored) {
					const latestLedger = await readLedger();
					const latestVersion = latestLedger.snapshot.version ?? "0";
					const latestAppliedIds = new Set(
						latestLedger.appliedOperations.map((operation) => operation.operationId),
					);
					if (plan.operations.every((operation) => latestAppliedIds.has(operation.operationId))) {
						return noMutationResult(plan, ["memory_graph_operation_replayed"], {
							replayed: true,
							version: latestVersion,
						});
					}
					return noMutationResult(plan, ["memory_graph_version_conflict"], {
						conflict: true,
						version: latestVersion,
					});
				}

				return {
```

</details>

**依据 4 · 源码核查**：[packages/memory-store/src/search/apply-reflect.ts:133-192](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/memory-store/src/search/apply-reflect.ts#L133-L192)

检索到写计划

<details>
<summary>查看原文（60行）</summary>

```text
export async function applyReflectedPlan(
	deps: UnifiedSearchDeps,
	store: MemoryStoreLike,
	input: ApplyConsolidateInput,
	_logger: Pick<Console, "log" | "warn" | "error">,
): Promise<ApplyConsolidateOutput> {
	const query = input.query.trim();
	const warnings: UnifiedMemorySearchWarning[] = [];
	const limit = clampUnifiedMemorySearchLimit(input.limit);
	const threshold = clampUnifiedMemorySearchThreshold(input.threshold);
	const tiers = input.tiers && input.tiers.length > 0 ? input.tiers : DEFAULT_TIERS;

	const searchInput: SearchInput = {
		userId: input.userId,
		query,
		botIds: input.botIds,
		dateFrom: input.dateFrom,
		dateTo: input.dateTo,
		tiers,
		limit,
		threshold,
		authToken: input.authToken,
		peerFilter: input.peerFilter,
		synthesize: true,
	};

	const search = createUnifiedSearch(deps);
	const result = await search.search(searchInput);
	warnings.push(...result.warnings);

	const evidence: SearchEvidence[] = result.evidence.map((item) => ({
		id: item.id,
		source: (item.source as SearchTier) ?? "raw",
		snippet: item.snippet,
		score: item.score,
		timestamp: item.timestamp,
		provenance: item.provenance,
	}));

	const records = evidence.map((item) => toMemoryEvidenceRecord(item, input.userId));

	const applyInput: ApplyReflectApplyInput = {
		userId: input.userId,
		ownerScope: input.ownerScope,
		records,
		plan: input.plan,
		dryRun: input.dryRun,
		expectedVersion: input.expectedVersion,
		getClusterKey: input.getClusterKey ?? defaultClusterKey,
		llmReview: deps.reasoning?.complete
			? {
					complete: deps.reasoning.complete,
					maxTokens: input.llmPlanReview?.maxTokens,
				}
			: undefined,
		graphStore: input.graphStore ?? store.graphStore,
		storage: input.storage ?? store.storage,
	};

	const applyOutput = await applyReflectedConsolidationPlan(applyInput);
```

</details>

**依据 5 · 源码核查**：[packages/ai/memory-consolidation/src/reflect-planner.ts:400-440](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/ai/memory-consolidation/src/reflect-planner.ts#L400-L440)

默认写/dryRun和图错误

<details>
<summary>查看原文（41行）</summary>

```text
export async function applyReflectedConsolidationPlan(
	input: ApplyReflectApplyInput,
): Promise<ReflectApplyOutput> {
	const { plan, warnings: builtWarnings } = await buildReflectedConsolidationPlan(input);
	const warnings: UnifiedMemorySearchWarning[] = [...builtWarnings];
	const dryRun = input.dryRun ?? false;
	const now = input.now ?? Date.now();

	if (dryRun) {
		return {
			plan,
			deprecationCounts: aggregateDeprecationCounts(plan),
			warnings: [
				...warnings,
				{
					source: "memory",
					code: "reflect_apply_dry_run",
					message: "dryRun: plan built but not persisted.",
				},
			],
			applied: false,
		};
	}

	let persistenceResult: MemoryGraphUpdateResult | undefined;
	let graphWriteAttempted = false;

	if (input.graphStore) {
		graphWriteAttempted = true;
		const updatePlan = translatePlanToGraphUpdate(plan, input.ownerScope, now, input.expectedVersion);
		try {
			persistenceResult = await input.graphStore.persistPlan(updatePlan);
		} catch (error) {
			warnings.push({
				source: "memory",
				code: "reflect_apply_persist_failed",
				message: (error as Error).message ?? "graphStore.persistPlan failed",
			});
		}
	}

```

</details>

**依据 6 · 源码核查**：[packages/ai/memory-consolidation/src/reflect-planner.ts:441-505](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/ai/memory-consolidation/src/reflect-planner.ts#L441-L505)

退役独立继续及applied语义

<details>
<summary>查看原文（65行）</summary>

```text
	if (input.storage?.deprecateRecords) {
		const deprecateGroups = new Map<string, MemoryConsolidationPlanEntry[]>();
		for (const entry of plan.entries) {
			if (entry.action !== "deprecate") continue;
			const key = entry.supersededBySummaryId ?? entry.winningClusterKey;
			if (!key) continue;
			const list = deprecateGroups.get(key) ?? [];
			list.push(entry);
			deprecateGroups.set(key, list);
		}
		for (const [supersededBySummaryId, entries] of deprecateGroups.entries()) {
			const ids = entries.flatMap((entry) => entry.recordIds);
			// Multiple entries can share a supersededBySummaryId with distinct
			// per-entry deprecation reasons (e.g. one flagged as duplicate, another
			// as stale). Keep every reason so downstream audit / chain-traversal
			// consumers see the full set, joined with a stable separator.
			const reasons = entries.map((entry) => entry.deprecationReason).filter(Boolean) as string[];
			const deprecateInput: MemoryDeprecateRecordsInput = {
				userId: input.userId,
				ids,
				deprecatedAt: now,
				supersededBySummaryId,
			};
			if (reasons.length > 0) deprecateInput.reason = reasons.join("; ");
			try {
				await input.storage.deprecateRecords(deprecateInput);
			} catch (error) {
				warnings.push({
					source: "memory",
					code: "reflect_apply_deprecate_failed",
					message: (error as Error).message ?? "storage.deprecateRecords failed",
				});
			}
		}
	}

	if (!graphWriteAttempted) {
		warnings.push({
			source: "memory",
			code: "reflect_apply_graph_store_not_configured",
			message:
				"No `graphStore` attached; running deprecation-only path. Call `attachMemoryGraphStore` to enable persistPlan.",
		});
	}

	const hasAnyWrites =
		plan.entries.length > 0 &&
		(input.graphStore !== undefined ||
			(input.storage?.deprecateRecords !== undefined && aggregateDeprecationCounts(plan).length > 0));
	if (!hasAnyWrites) {
		warnings.push({
			source: "memory",
			code: "reflect_apply_no_writes",
			message: "Plan built but no write paths were taken (empty plan or all entries observed).",
		});
	}

	return {
		plan,
		persistenceResult,
		deprecationCounts: aggregateDeprecationCounts(plan),
		warnings,
		applied: !dryRun,
	};
}
```

</details>

#### 缺口

- 跨进程CAS实际存储与故障恢复未运行
  **影响**：图未提交而raw已退役可能使证据不可见，不能只凭applied重试
  **进一步探讨**：副本注入图conflict和raw拒写核逐路径readback，先dryRun

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、认证、安全库和退出需哪些具体条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

HTTP默认127.0.0.1:7421，startHttpServer直接Hono app路由后serve，所读factory无认证middleware，userId/ownerScope取请求body；这些分区参数不是认证。authToken字段向下游检索转发不等于验证入口身份。公开监听必须由host绑定认证/限额/允许scope，先在loopback单用户使用。原始SQLite getMessageById只按ID，因此在应用暴露它时也需所有权检查。安全package提供Fernet helper但依赖ENCRYPTION_KEY，不代表raw数据库、日志和所有集成secret默认全库加密；URL helper的isPrivateHostname实际用hostname字串规则而不DNS解析，不能宣称DNS rebinding已被防住。

原生better-sqlite3/sqlite-vec、ONNX或远端embedding、Postgres factory/vector backend各有安装与服务成本，rewrite/iterative/synthesis又有模型token与等待，默认RRF并不免embedding成本。首试独立OPENCONTEXT_HOME，仅SQLite+无敏感测试记录，固定userId、只读search和dryRun consolidate；核warnings/owner/实际写再开放一个源。HTTP stop先server.close等handler drain再关raw/VSA，顺序明确但长请求可拖延；另需停止MCP及host后台作业，备份DB/索引/附件/日志和密钥，再按数据留存决定删除。退役与图历史应保留审计，不得声称一键撤销已外发模型请求。

#### 证据与依据

**依据 1 · 源码核查**：[packages/memory-store/src/http.ts:103-108](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/memory-store/src/http.ts#L103-L108)

loopback缺省

```text
export async function startHttpServer(options: StartHttpServerOptions = {}): Promise<StartedHttpServer> {
	const port = options.port ?? Number.parseInt(process.env.MEMORY_HTTP_PORT ?? "7421", 10);
	const host = options.host ?? process.env.MEMORY_HTTP_HOST ?? "127.0.0.1";

	const rawStore = createRawMessageStore({
		env: options.env,
```

**依据 2 · 源码核查**：[packages/memory-store/src/http.ts:149-169](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/memory-store/src/http.ts#L149-L169)

裸app与body userId

<details>
<summary>查看原文（21行）</summary>

```text

	app.get("/health", async (c) => {
		const retrieval = options.unified?.getRawMessageRetrievalStatus
			? await options.unified.getRawMessageRetrievalStatus().catch(() => ({
					backend: "unknown",
					childCount: 0,
					embeddedChildCount: 0,
					indexedDimensions: [],
					semanticReady: false,
					lexicalReady: false,
					semanticDegradedReason: "health_check_failed",
				}))
			: undefined;
		return c.json({ ok: true, store: "memory", ts: Date.now(), retrieval });
	});

	app.post("/v1/search", async (c) => {
		const body = (await c.req.json().catch(() => ({}))) as Record<string, unknown>;
		const userId = typeof body.userId === "string" ? body.userId : null;
		const query = typeof body.query === "string" ? body.query : "";
		if (!userId || !query) {
```

</details>

**依据 3 · 源码核查**：[packages/memory-store/src/http.ts:296-319](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/memory-store/src/http.ts#L296-L319)

ownerScope来自body

<details>
<summary>查看原文（24行）</summary>

```text
		const userId = typeof body.userId === "string" ? body.userId : null;
		const query = typeof body.query === "string" ? body.query : "";
		const ownerScope = (body.ownerScope ?? {}) as { userId?: string };
		if (!userId || !query) {
			return c.json({ error: "userId and query are required" }, 400);
		}
		if (typeof ownerScope.userId !== "string") {
			return c.json({ error: "ownerScope.userId is required" }, 400);
		}
		const input: ApplyConsolidateInput = {
			userId,
			query,
			ownerScope: { userId: ownerScope.userId },
			botIds: Array.isArray(body.botIds) ? (body.botIds as string[]) : undefined,
			dateFrom: typeof body.dateFrom === "string" ? body.dateFrom : undefined,
			dateTo: typeof body.dateTo === "string" ? body.dateTo : undefined,
			tiers: Array.isArray(body.tiers)
				? (body.tiers as Array<"summary" | "raw" | "insight" | "knowledge">)
				: undefined,
			limit: typeof body.limit === "number" ? body.limit : undefined,
			threshold: typeof body.threshold === "number" ? body.threshold : undefined,
			dryRun: body.dryRun === true,
			expectedVersion: typeof body.expectedVersion === "string" ? body.expectedVersion : undefined,
			authToken: typeof body.authToken === "string" ? body.authToken : undefined,
```

</details>

**依据 4 · 源码核查**：[packages/memory-store/src/http.ts:503-521](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/memory-store/src/http.ts#L503-L521)

监听与drain关闭

<details>
<summary>查看原文（19行）</summary>

```text
	const server = serve({ fetch: app.fetch, port, hostname: host });

	return {
		url: `http://${host}:${port}`,
		port,
		async stop() {
			// Order matters: close the HTTP server first and wait for it to
			// drain in-flight handlers, THEN close the stores. Closing the
			// stores while handlers are still calling into rawStore races
			// sqlite-vec's TLS mutex destructors against active queries and
			// surfaces the dreaded
			//     libc++abi: ... mutex lock failed: Invalid argument
			// on SIGTERM.
			await new Promise<void>((resolve) => server.close(() => resolve()));
			await rawStore.close();
			await closeSQLiteVsaStore();
		},
	};
}
```

</details>

**依据 5 · 源码核查**：[packages/sqlite/src/raw-message-manager.ts:848-854](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/sqlite/src/raw-message-manager.ts#L848-L854)

ID读取边界

```text
	async getMessageById(messageId: string): Promise<RawMessage | null> {
		await this.init();
		const row = this.db.prepare("SELECT * FROM raw_messages WHERE message_id = ?").get(messageId) as
			| RawMessageRow
			| undefined;
		return row ? toRawMessage(row) : null;
	}
```

**依据 6 · 源码核查**：[packages/security/src/token-encryption.ts:21-56](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/security/src/token-encryption.ts#L21-L56)

加密helper需env key

<details>
<summary>查看原文（36行）</summary>

```text
	private getEncryptionKey(): Buffer {
		if (this.encryptionKey) {
			return this.encryptionKey;
		}

		const envKey = process.env.ENCRYPTION_KEY;
		if (!envKey) {
			throw new Error("No encryption key available. Set ENCRYPTION_KEY environment variable.");
		}

		try {
			// Try to use as a direct Fernet key
			const testKey = Buffer.from(envKey);
			// Simple validation of Fernet key format (32 URL-safe Base64 encoded bytes)
			if (testKey.length === 32) {
				this.encryptionKey = testKey;
			} else {
				throw new Error("Key length is not valid for Fernet");
			}
		} catch {
			// If not a valid Fernet key, derive from password
			const derivedKey = this.deriveKeyFromPassword(Buffer.from(envKey));
			this.encryptionKey = derivedKey;
		}

		return this.encryptionKey;
	}

	/**
	 * Derives an encryption key from a password using PBKDF2
	 * @param password Buffer containing the password
	 * @param salt Optional salt value
	 * @returns The derived key
	 */
	private deriveKeyFromPassword(password: Buffer, salt?: Buffer): Buffer {
		const calSalt = salt ? salt : Buffer.from("mypraxos-salt");
```

</details>

**依据 7 · 源码核查**：[packages/security/src/url-validator.ts:64-101](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/security/src/url-validator.ts#L64-L101)

hostname规则无DNS解析

<details>
<summary>查看原文（38行）</summary>

```text
async function isPrivateHostname(hostname: string): Promise<boolean> {
	try {
		// Skip IP addresses (they're already checked)
		if (/^[\d\.:]+$/.test(hostname)) {
			return isPrivateIp(hostname);
		}

		// For hostnames, we check for known patterns
		// This is a safer approach than DNS resolution which could be abused
		const localhostPatterns = [
			"localhost",
			"local",
			"localdomain",
			"internal",
			"intranet",
			"corp",
			"private",
			"dmz",
		];

		const lowerHostname = hostname.toLowerCase();
		if (localhostPatterns.some((pattern) => lowerHostname.includes(pattern))) {
			return true;
		}

		// Check if hostname is in the TLD list that shouldn't be used
		const suspiciousTlds = [".test", ".example", ".invalid", ".localhost"];
		if (suspiciousTlds.some((tld) => lowerHostname.endsWith(tld))) {
			return true;
		}

		// For external hostnames, we rely on DNSSEC and other infrastructure
		// This is a basic check - in production you might want to implement
		// a DNSSEC-validating resolver or use a dedicated service
		return false;
	} catch {
		return true; // Fail closed on errors
	}
```

</details>

**依据 8 · 源码核查**：[package.json:39-54](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/package.json#L39-L54)

Node和原生依赖

<details>
<summary>查看原文（16行）</summary>

```text
	"engines": {
		"node": ">=22.0.0 <27.0.0",
		"pnpm": ">=9.0.0"
	},
	"pnpm": {
		"public-hoist-pattern": ["@types/*", "*types*"],
		"overrides": {
			"postcss": "^8.5.6",
			"vite": "^6.0.0",
			"better-sqlite3": "^13.0.0",
			"@whiskeysockets/libsignal-node": "git+https://github.com/WhiskeySockets/libsignal-node.git#1c30d7d7e76a3b0aa120b04dc6a26f5a12dccf67",
			"@melandlabs/workspace": "link:packages/workspace"
		},
		"onlyBuiltDependencies": ["better-sqlite3", "protobufjs", "sqlite-vec"],
		"ignoredBuiltDependencies": [
			"@biomejs/biome",
```

</details>

#### 缺口

- 真实多用户鉴权、各平台adapter及资源费用未运行
  **影响**：不能把基础库当已部署安全多租户服务
  **进一步探讨**：loopback单用户先核数据和停机，再由可信host加认证与scope绑定

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 写结果增加逐路径状态能否减少错误恢复？

**研究主题**：新假设与验证

#### 完整回答

当前已有warnings与persistenceResult，不需新增“所有错误都可见”的空泛能力。候选是把顶层applied拆为graph_status/raw_status及实际changedCount，并在图conflict时由调用方明确选择是否继续退役。对照图成功/raw失败、图conflict/raw成功、空计划和dryRun，比较操作员是否误重试、能否找回旧证据及恢复时间。若现有消费者本就严格核warnings或新状态破坏兼容，需要权衡而不预称可靠性提高；仍须明确跨库事务与幂等边界。

#### 证据与依据

**依据 1 · 源码核查**：[packages/ai/memory-consolidation/src/reflect-planner.ts:427-505](https://github.com/melandlabs/opencontext/blob/3059d8afe072e36894acdd21c5e17ae1c8ec69d6/packages/ai/memory-consolidation/src/reflect-planner.ts#L427-L505)

分路径错误与applied定义

<details>
<summary>查看原文（79行）</summary>

```text
	if (input.graphStore) {
		graphWriteAttempted = true;
		const updatePlan = translatePlanToGraphUpdate(plan, input.ownerScope, now, input.expectedVersion);
		try {
			persistenceResult = await input.graphStore.persistPlan(updatePlan);
		} catch (error) {
			warnings.push({
				source: "memory",
				code: "reflect_apply_persist_failed",
				message: (error as Error).message ?? "graphStore.persistPlan failed",
			});
		}
	}

	if (input.storage?.deprecateRecords) {
		const deprecateGroups = new Map<string, MemoryConsolidationPlanEntry[]>();
		for (const entry of plan.entries) {
			if (entry.action !== "deprecate") continue;
			const key = entry.supersededBySummaryId ?? entry.winningClusterKey;
			if (!key) continue;
			const list = deprecateGroups.get(key) ?? [];
			list.push(entry);
			deprecateGroups.set(key, list);
		}
		for (const [supersededBySummaryId, entries] of deprecateGroups.entries()) {
			const ids = entries.flatMap((entry) => entry.recordIds);
			// Multiple entries can share a supersededBySummaryId with distinct
			// per-entry deprecation reasons (e.g. one flagged as duplicate, another
			// as stale). Keep every reason so downstream audit / chain-traversal
			// consumers see the full set, joined with a stable separator.
			const reasons = entries.map((entry) => entry.deprecationReason).filter(Boolean) as string[];
			const deprecateInput: MemoryDeprecateRecordsInput = {
				userId: input.userId,
				ids,
				deprecatedAt: now,
				supersededBySummaryId,
			};
			if (reasons.length > 0) deprecateInput.reason = reasons.join("; ");
			try {
				await input.storage.deprecateRecords(deprecateInput);
			} catch (error) {
				warnings.push({
					source: "memory",
					code: "reflect_apply_deprecate_failed",
					message: (error as Error).message ?? "storage.deprecateRecords failed",
				});
			}
		}
	}

	if (!graphWriteAttempted) {
		warnings.push({
			source: "memory",
			code: "reflect_apply_graph_store_not_configured",
			message:
				"No `graphStore` attached; running deprecation-only path. Call `attachMemoryGraphStore` to enable persistPlan.",
		});
	}

	const hasAnyWrites =
		plan.entries.length > 0 &&
		(input.graphStore !== undefined ||
			(input.storage?.deprecateRecords !== undefined && aggregateDeprecationCounts(plan).length > 0));
	if (!hasAnyWrites) {
		warnings.push({
			source: "memory",
			code: "reflect_apply_no_writes",
			message: "Plan built but no write paths were taken (empty plan or all entries observed).",
		});
	}

	return {
		plan,
		persistenceResult,
		deprecationCounts: aggregateDeprecationCounts(plan),
		warnings,
		applied: !dryRun,
	};
}
```

</details>

#### 缺口

- 消费者错误恢复和新协议兼容成本未知
  **影响**：显式状态可能仍不提供原子性
  **进一步探讨**：固定计划故障注入并检查重复退役/丢证据反例

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
