# dsh-settings-hub

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d9986d8](https://github.com/Amengclass/dsh-settings-hub/tree/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3)

<!-- BEGIN META -->
[![npm 30d 996](https://img.shields.io/static/v1?label=npm+30d&message=996&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-settings-hub) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-settings-hub)
<!-- END META -->

> **功能**：将 DSH 第三方设置页归组、折叠并提供本地拖拽排序的设置导航插件

> **亮点**：将真实slot设置页按插件聚合并保存拖拽排序；当前registrant优先、未知项保留fallback，比纯源码字符串猜测稳健，但不接管各页业务正确性。[Q01](#research-q01)

> **主要限制**：shadow重建renderer协议，hostFace/store/locale缺失会让页不可操作；归属依赖异步deps和ID变化，慢API/共享依赖/profile fallback仍可错组。列出条目不能代替设置保存验收。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 集中设置入口真实如何构建？](#detail-section-11)
  - [Q02 · 不改宿主源码是否等于兼容负担低？](#detail-section-12)
  - [Q03 · 动态归属能完全跟随安装与慢加载吗？](#detail-section-13)
  - [Q04 · 权限与全周期负担有哪些？](#detail-section-14)
  - [Q05 · 怎样采用，哪项增量设计能检验？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多个第三方设置页导航分散的DSH用户，希望集中分组和保存排序。

原生设置导航逐项寻找；实际配置读写仍由原设置页和宿主承担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 插件设置归组 | 收纳分散section | registrant优先，未知fallback，不保证唯一父 |
| 本地排序 | 保存个人导航偏好 | localStorage吞错，双端不同源 |
| shadow renderer | 继续打开原设置页 | 宿主kit变化需重验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer与client slots/locale/primitives | 启动必需 | Host依赖图和shadow | 宿主API变动要重验 |
| profile真实package/node_modules布局 | 正确归属必需 | 识别父插件 | 探测失败回web可能错误 |
| hostFace/store/locale能力 | 对应设置页必需 | 复现官方renderer kit | 缺失会throw并显示错误 |
| localStorage | 排序持久必需 | 保存组和section顺序 | 失败吞掉，双端不共享 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户固定host/profile并装插件 | 不把宽0.1/0.2声明当验收 |
| 2 | 用户核native与三类第三方设置页 | 页能读取/保存，不只标题 |
| 3 | 用户拖动、重载并测试慢加载 | 顺序和归属一致，fallback仍可达 |
| 4 | 用户分开验Web/Desktop | 缺页/不可写/误组则停shadow回原生 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地依赖图/浏览器资源未知 | 核profile、host与多种设置页 | 没有模型调用不等于零维护 |
| 持续使用 | 依赖扫描和UI内存未知 | 新插件/宿主更新后复核 | 节省导航时间未测 |
| 失败恢复 | 重载/重扫资源未知 | 区分错归属与renderer缺能力 | 排序持久失败可丢失 |
| 退出 | 存储资源未知 | 停shadow回原生，保留所需顺序记录 | 不修改原设置业务配置 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一导航 | live slot、分组、fallback与排序 | 净节时和复杂插件集合可用性 |
| 动态归属 | registrant优先、ID变化重扫 | 慢deps/共享父/同ID来源变化 |
| 页面操作 | 复制kit和错误边界 | 所有host/双端store/locale兼容 |

> **思考**：shadow重建renderer协议，hostFace/store/locale缺失会让页不可操作；归属依赖异步deps和ID变化，慢API/共享依赖/profile fallback仍可错组。列出条目不能代替设置保存验收。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将真实slot设置页按插件聚合并保存拖拽排序；当前registrant优先、未知项保留fallback，比纯源码字符串猜测稳健，但不接管各页业务正确性。[Q01](#research-q01)

真实entries不发明ID、registrant优先及fallback保可达值得复用；复制renderer、异步变量无通知、依赖首父和profile回web是持续兼容代价。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

shadow重建renderer协议，hostFace/store/locale缺失会让页不可操作；归属依赖异步deps和ID变化，慢API/共享依赖/profile fallback仍可错组。列出条目不能代替设置保存验收。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

多插件用户先固定环境核native和三类设置页保存、拖动与重载，Web/Desktop分开验；页不可操作、错归属误导或排序丢失就停shadow回原生导航。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

真实slot聚合、排序和shadow为源码支持；宽双端兼容是作者声明，本轮未运行。归属/renderer风险按具体条件判断；稳定来源方案是假设。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根组件6个tracked文件统计；读完整Host入口、client归属、renderer、动态重扫、存储与shadow，package/README。未运行GUI，不据截图/宽声明称双端兼容。
- 下一步：固定host/profile，以store/locale/children页、慢deps、同ID换归属、共享依赖、link路径与存储满矩阵，核可达/保存/正确分组和总排查分钟。

**分析版本**

- **仓库**：[Amengclass/dsh-settings-hub](https://github.com/Amengclass/dsh-settings-hub)
- **版本号**：0.1.3（[固定提交 d9986d8](https://github.com/Amengclass/dsh-settings-hub/tree/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是稳定slot来源与异步完成通知替代字符串/定时归属，并显式共享父不确定性；用慢API、ID不变换来源、延迟模块和共享依赖比较错组/漏页/排查分钟，无改善即否定。[Q05](#research-q05)

固定host/profile，以store/locale/children页、慢deps、同ID换归属、共享依赖、link路径与存储满矩阵，核可达/保存/正确分组和总排查分钟。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 411 | — | — | 2355 |
| .js | source | 2 | 1165 | 923 | 192 | — |
| .cjs | source | 1 | 124 | 88 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Amengclass/dsh-settings-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Amengclass/dsh-settings-hub/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Amengclass/dsh-settings-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一设置导航能否保留可达、可操作与正确动态归属，维护代价是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 集中设置入口真实如何构建？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

面向装了多个第三方插件、设置导航分散的DSH用户，合格结果是所有真实设置页仍可达且可编辑，不是“扩展设置”标题出现。client shadow sidebar.settings重建外壳，读取实际settings.section entries，排除固定native IDs。归属最先用包名形态registrant和安装依赖图；未知才扫描apply源码中的id/string/token，最终放“其他插件”，不凭字符串发明section。相对手动滚动原生导航，贡献是插件分组、折叠与拖动排序；配置业务逻辑仍属原插件/宿主。主包0.1.3是DSH原生plugin，Host读profile依赖图，client渲染与排序。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:20-28](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/README.md#L20-L28)

作者目标与shadow宽兼容声明。

```text
## Highlights

- **统一入口** — 所有第三方插件的设置项自动归入「扩展设置项」分组，不再散落在侧边栏各处
- **动态发现** — 新安装的插件自动出现，无需手动配置或修改代码
- **分组归属** — 按父插件自动分组，每个插件的子设置项聚合在一起
- **拖拽排序** — 支持拖拽调整分组和子项顺序，顺序持久化到 localStorage
- **幽灵拖拽** — 拖拽时原位置保持不变，半透明幽灵跟随鼠标，视觉反馈清晰
- **零侵入** — 不修改 DSH 源码，通过官方 shadow 机制接管 `sidebar.settings` 插槽
- **双端兼容** — 同时支持 `dsh web` 与 DSH 桌面应用（DSH 0.1.x / 0.2.x）
```

**依据 2 · 源码核查**：[lib/client.js:367-418](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/lib/client.js#L367-L418)

真实entries、registrant优先及归组。

<details>
<summary>查看原文（52行）</summary>

```text
		function readSectionEntries() {
			try {
				const es = pluginCtx?.slots?.entriesOfSlot?.("settings.section") ?? [];
				return es
					.map((e) => ({ id: e.options?.id ?? "", registrant: e.registrant }))
					.filter((e) => e.id && !NATIVE_IDS.has(e.id));
			} catch {
				return [];
			}
		}

		/** A registrant worth naming a group after (`dsh-market`, not minified `Gb`). */
		function pkgLikeRegistrant(registrant) {
			return typeof registrant === "string"
				&& registrant.length >= 4
				&& /[-/]/.test(registrant)
				&& /^[@\w][\w./-]*$/.test(registrant);
		}

		/**
		 * Group the sections that actually exist in the settings.section slot by
		 * the plugin that registered them.
		 *
		 * Section ids come from the live slot; a module scan is only ever used to
		 * *attribute* those ids to a package — never to invent ids. The earlier
		 * version harvested every `id:` literal out of any module that mentioned
		 * `settings.section`. A module registers several slots, so that collected
		 * ids belonging to other slots; `flatItems` then looked them up in the real
		 * row list, missed, and dropped them, leaving a group header with nothing
		 * under it.
		 *
		 * Attribution runs strongest first: the slot entry's own `registrant` when
		 * it names a package, then a module whose `apply()` inlines
		 * `id: "<section>"`, then a module whose `apply()` merely mentions the id.
		 * Anything still unclaimed ships under a fallback group — a section the
		 * user installed must never silently vanish.
		 */
		function buildPluginSectionMap(entries) {
			const claimed = new Set();
			const groups = {};
			const add = (name, id) => {
				if (!id || claimed.has(id)) return;
				claimed.add(id);
				if (!groups[name]) groups[name] = [];
				groups[name].push(id);
			};
			const getParent = buildParentMap();

			for (const e of entries) {
				if (pkgLikeRegistrant(e.registrant)) {
					add(groupNameOf(getParent(e.registrant)), e.id);
				}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:421-473](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/lib/client.js#L421-L473)

源码扫描仅归属fallback，未知仍展示。

<details>
<summary>查看原文（53行）</summary>

```text
			const cache = pluginCtx?.modules?.loadCache;
			const sectionMods = [];
			const allMods = [];
			if (cache) {
				for (const [modId, mod] of cache) {
					if (modId.startsWith('@deepseek-ai/')) continue;
					if (!mod || !mod.exports || typeof mod.exports.apply !== 'function') continue;
					const src = String(mod.exports.apply);
					allMods.push([modId, src]);
					if (src.includes('settings.section')) sectionMods.push([modId, src]);
				}
			}
			const strong = (src, id) => src.includes(`id: "${id}"`) || src.includes(`id: '${id}'`)
				|| src.includes(`id:"${id}"`) || src.includes(`id:'${id}'`);
			const mentions = (src, id) => src.includes(`"${id}"`) || src.includes(`'${id}'`);
			// `id:` inside a settings-section module is a near-certain hit; a bare
			// literal anywhere else is only a hint, and newer DSH moved the
			// registration out of `apply()` entirely, so that hint is all some
			// sections leave behind.
			for (const test of [[strong, sectionMods], [mentions, allMods]]) {
				const [probe, candidates] = test;
				for (const e of entries) {
					if (claimed.has(e.id)) continue;
					for (const [modId, src] of candidates) {
						if (probe(src, e.id)) {
							add(groupNameOf(getParent(modId)), e.id);
							break;
						}
					}
				}
			}

			// Last resort before the fallback bucket: when DSH stops inlining the
			// registration, the only trace left is the section id itself. Match it
			// against module ids token-wise, requiring *every* section token to line
			// up (`archived-sessions` → `dsh-session-archive`, `opencode-go` →
			// `dsh-opencode-go`). Requiring all tokens keeps this from grabbing a
			// module that only shares a generic word.
			const tokensOf = (s) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
			const tokEq = (a, b) => a === b || (a.length >= 3 && b.startsWith(a)) || (b.length >= 3 && a.startsWith(b));
			for (const e of entries) {
				if (claimed.has(e.id)) continue;
				const st = tokensOf(e.id);
				if (st.length === 0) continue;
				const hit = allMods.find(([modId]) => {
					const mt = tokensOf(modId);
					return st.every((tk) => mt.some((m) => tokEq(tk, m)));
				});
				if (hit) add(groupNameOf(getParent(hit[0])), e.id);
			}

			for (const e of entries) add("其他插件", e.id);
			return groups;
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1044-1048](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/lib/client.js#L1044-L1048)

真实sidebar.settings接管。

```text
			ctx.slots.inject("sidebar.settings", () => ctx.slots.register({
				name: "sidebar.settings",
				priority: -100, // lowest priority renders → shadows the shipped shell
				inject: shellInjected,
			}, HubRoot));
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 不改宿主源码是否等于兼容负担低？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不等于。renderEntry重新构造官方kit：hostFace存在才提供会话/工作区hooks，有locale却无face直接throw，有store却无storeOf也throw，再把inject hooks适配为use<Name>。EntryBoundary可以隔离组件错误，但不能让缺少host能力的设置页恢复可操作。client还重建子slot dispatch、locale和observable hooks，说明shadow是复制renderer协议而不是仅换导航标签。原生shell仍注册、卸载可释放shadow，是可行退路；但官方renderer变化会持续产生适配责任。README“双端0.1.x/0.2.x”属于宽声明，本轮没有对应矩阵，不能据此说所有设置页保持原样。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:194-239](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/lib/client.js#L194-L239)

hostFace/store/locale/inject真实适配及错误分支。

<details>
<summary>查看原文（46行）</summary>

```text
		function renderEntry(ctx, slotKey, entry, ownerProps) {
			// hostFace() is provided by @deepseek-ai/dsh-client-runtime, which the
			// desktop shell (DSH 0.2.x) no longer ships — it moved to
			// dsh-client-ui-renderer. Sections that need nothing from the host face
			// (the common case) still render fine on an empty kit, so degrade
			// instead of crashing the whole settings shell.
			const host = typeof ctx.slots.hostFace === "function" ? ctx.slots.hostFace() : undefined;
			const kit = {};
			if (host) {
				kit.useSessions = host.sessions ? observableHookOf(host.sessions.list) : undefined;
				kit.useWorkspaces = host.workspaces ? observableHookOf(host.workspaces.list) : undefined;
			}
			if (entry.locale !== undefined) {
				const face = host?.locale;
				if (face === undefined) throw new Error(`[dsh-settings-hub] entry locale '${entry.locale}' but no locale face installed`);
				kit.t = makeLocaleSeat(face, entry.locale);
			}
			if (entry.children !== undefined) {
				kit.renderSlot = boundRenderSlotOf(ctx, entry);
			}
			// Store seat: resolve the instance (root scope → ROOT_INSTANCE_KEY)
			// and expose the uSES pair + actions, as standardKit does.
			if (entry.store !== undefined) {
				const store = host?.storeOf?.(entry, "root");
				if (!store) throw new Error(`[dsh-settings-hub] entry store but no store face installed`);
				kit.useStore = observableHookOf(store);
				kit.actions = store.actions;
			}
			// Inject face: hooks compartment sources become use<Name> hooks;
			// remaining keys pass through verbatim (InjectFace contract).
			let injected = {};
			if (typeof entry.inject === "function") {
				const raw = entry.inject(kit.actions !== undefined ? kit.actions : undefined) ?? {};
				const { hooks, ...rest } = raw;
				injected = { ...rest };
				if (hooks) {
					for (const [name, source] of Object.entries(hooks)) {
						const hookName = `use${name[0]?.toUpperCase() ?? ""}${name.slice(1)}`;
						injected[hookName] = observableHookOf(source);
					}
				}
			}
			return jsxRuntime.jsx(
				EntryBoundary,
				{ slotKey, children: jsxRuntime.jsx(entry.component, { ...kit, ...injected, ...ownerProps }) },
				entry,
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1044-1048](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/lib/client.js#L1044-L1048)

shadow接管而非编辑宿主文件。

```text
			ctx.slots.inject("sidebar.settings", () => ctx.slots.register({
				name: "sidebar.settings",
				priority: -100, // lowest priority renders → shadows the shipped shell
				inject: shellInjected,
			}, HubRoot));
```

#### 缺口

- 依赖store、locale、children的第三方页在各host和Desktop是否可操作未实机验收。
  **影响**：设置页能列出不证明其表单能读写；可能需退回原生shell。
  **进一步探讨**：在精确host上选三类有store/locale/children页逐一保存/重载；任一缺能力就停用shadow并用原生设置。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 动态归属能完全跟随安装与慢加载吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

当前会随liveRowKey变化重算，并额外500ms重扫，因此不能沿用“仅一次定时重扫”判断。限制是liveRowKey只由section IDs组成；同一ID集合的registrant/模块归属改变不会单独触发effect。fetchDepMap异步修改模块变量，没有显式setState重算，慢于额外500ms时父归属可能保持fallback到下一次row变化或重载。Host collectDeps对共享依赖只保留首次父插件，不代表真实唯一所有者；profile从import路径向上五层探测，失败回web profile，link安装或非标准布局可能拿错图。这些多为归属可靠性风险而非条目必丢：live entries与“其他插件”保留了可达性。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:326-342](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/lib/client.js#L326-L342)

异步fetch只赋变量和parentMap。

<details>
<summary>查看原文（17行）</summary>

```text
		async function fetchDepMap() {
			try {
				const r = await fetch("/api/dsh-settings-hub/deps");
				if (!r.ok) return;
				const d = await r.json();
				if (Array.isArray(d.installedPlugins)) INSTALLED_PLUGINS = d.installedPlugins;
				if (d.depMap && typeof d.depMap === "object") DEP_MAP = d.depMap;
			} catch {}
		}
// __DEP_MAP_END__

		function buildParentMap() {
			const installed = new Set(INSTALLED_PLUGINS);
			return function getParent(modId) {
				if (installed.has(modId)) return modId;
				return DEP_MAP[modId] || modId;
			};
```

</details>

**依据 2 · 源码核查**：[lib/client.js:625-643](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/lib/client.js#L625-L643)

依IDs触发重算及500ms补扫。

<details>
<summary>查看原文（19行）</summary>

```text
				return () => { observer.disconnect(); removeOverlay(); };
			}, []);
			const nativeRows = rows.filter((r) => NATIVE_IDS.has(r.id));
			const pluginRows = rows.filter((r) => !NATIVE_IDS.has(r.id));
			// Live section ids as a stable key: the scan below re-runs when the slot's
			// contents change (plugins load after the first render).
			const liveRowKey = pluginRows.map((r) => r.id).join("|");
			const [pluginSectionMap, setPluginSectionMap] = react.useState(
				() => buildPluginSectionMap(readSectionEntries()),
			);
			react.useEffect(() => {
				// Re-scan when the row set changes, and once more after mount in case
				// late-loading plugins materialise their modules after the slot fills.
				setPluginSectionMap(buildPluginSectionMap(readSectionEntries()));
				const timer = setTimeout(() => {
					setPluginSectionMap(buildPluginSectionMap(readSectionEntries()));
				}, 500);
				return () => clearTimeout(timer);
			}, [liveRowKey]);
```

</details>

**依据 3 · 源码核查**：[index.js:25-52](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/index.js#L25-L52)

递归依赖与first-parent语义。

<details>
<summary>查看原文（28行）</summary>

```text
function collectDeps(pkgName, visited, nodeModulesDir) {
  if (visited.has(pkgName)) return;
  visited.add(pkgName);
  const pkgJsonPath = path.join(nodeModulesDir, pkgName, "package.json");
  const pkg = readJson(pkgJsonPath);
  if (!pkg || !pkg.dependencies) return;
  for (const dep of Object.keys(pkg.dependencies)) {
    collectDeps(dep, visited, nodeModulesDir);
  }
}

function buildDepMap(profileDir) {
  const profilePkg = readJson(path.join(profileDir, "package.json"));
  if (!profilePkg || !profilePkg.dependencies) {
    return { installedPlugins: [], depMap: {} };
  }
  const installedPlugins = Object.keys(profilePkg.dependencies);
  const nodeModulesDir = path.join(profileDir, "node_modules");
  const depMap = {};
  for (const plugin of installedPlugins) {
    const visited = new Set();
    collectDeps(plugin, visited, nodeModulesDir);
    for (const dep of visited) {
      if (dep === plugin) continue;
      if (!depMap[dep]) depMap[dep] = plugin;
    }
  }
  return { installedPlugins, depMap };
```

</details>

**依据 4 · 源码核查**：[index.js:65-77](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/index.js#L65-L77)

profile有限向上探测与web fallback。

<details>
<summary>查看原文（13行）</summary>

```text
function resolveProfileDir() {
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 5; i++) {
    const pkg = readJson(path.join(dir, "package.json"));
    if (pkg && typeof pkg.name === "string" && pkg.name.startsWith("dsh-profile-")) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  // Fall back to the web profile when running outside an installed profile.
  return path.join(os.homedir(), ".dsh", "profiles", "web");
```

</details>

#### 缺口

- 慢API、同ID改归属与非标准profile下实际分组未测。
  **影响**：不能保证“自动出现且正确父归属”全部成立；使用者可能需重载或手工识别。
  **进一步探讨**：延迟deps超过500ms、共享依赖两父插件和link路径三类fixture核分组；错误归属不能靠重命名假装修好。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 权限与全周期负担有哪些？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

启动依赖宿主webServer、client slots/locale/primitives及renderer约定；并不只是Node18。Host deps接口GET输出安装插件与依赖映射，CORS=*且handler未见owner检查，需核外层准入；它是包清单暴露，不是设置写入接口，但不能因只读就忽略身份。排序用localStorage、失败吞掉，存储满可能仅本轮排序有效，Web/Desktop来源不同不自动同步。用户首次要核native与多插件页，持续要适配新增/更新插件，失败需区分归属错误和renderer能力错误。无新增模型调用不等于维护零成本；没有导航耗时对照不能称节时。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:80-108](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/index.js#L80-L108)

GET/CORS和实际deps路由无内建admit。

<details>
<summary>查看原文（29行）</summary>

```text
function writeJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-cache",
  });
  res.end(body);
}

export function apply(ctx, config) {
  ctx.inject(["webServer"], (hostCtx) => {
    hostCtx.effect(() => {
      const route = hostCtx.webServer.register({
        kind: "exact",
        path: "/api/dsh-settings-hub/deps",
        handler: (req, res) => {
          if (req.method !== "GET") {
            res.writeHead(405);
            res.end("method not allowed");
            return;
          }
          const profileDir = config?.profileDirectory ?? resolveProfileDir();
          const result = buildDepMap(profileDir);
          writeJson(res, 200, result);
        },
      });
      return () => route();
    }, "dsh-settings-hub: deps api");
```

</details>

**依据 2 · 源码核查**：[lib/client.js:306-316](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/lib/client.js#L306-L316)

排序保存吞错。

<details>
<summary>查看原文（11行）</summary>

```text
		function loadGroupOrder() {
			try { return JSON.parse(localStorage.getItem(GROUP_ORDER_KEY)) ?? []; } catch { return []; }
		}
		function saveGroupOrder(groups) {
			try { localStorage.setItem(GROUP_ORDER_KEY, JSON.stringify(groups)); } catch {}
		}
		function loadSectionOrder() {
			try { return JSON.parse(localStorage.getItem(SECTION_ORDER_KEY)) ?? {}; } catch { return {}; }
		}
		function saveSectionOrder(obj) {
			try { localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(obj)); } catch {}
```

</details>

**依据 3 · 源码核查**：[package.json:29-44](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/package.json#L29-L44)

client实际注入依赖。

<details>
<summary>查看原文（16行）</summary>

```text
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-primitives"
      ],
      "platform": "web"
    }
  },
  "license": "MIT",
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
```

</details>

#### 缺口

- Host外层准入、排序持久失败可见性与双端存储实测未知。
  **影响**：远程共享部署和重要设置操作前需额外核查，退出需保留原生入口。
  **进一步探讨**：隔离profile从未登录来源读deps，模拟localStorage满并重载，Web/Desktop分别验收。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样采用，哪项增量设计能检验？

**研究主题**：采用判断、新假设与验证

#### 完整回答

多插件设置确实分散且愿做兼容核查的用户可小范围试用，先固定host，核native与三个不同依赖类型设置页、拖动保存与重载，再分开验Web/Desktop。若页只显示标题却不能编辑、错误归属误导操作或刷新排序丢失，停用shadow回原生设置；不需要改原插件配置来挽救导航。未验证假设是使用稳定slot来源元数据和异步deps完成通知，替代同ID集合的源码字符串猜归属，并对共享依赖呈现不确定父项；这样可能减少错误分组和定时竞态。故障集包括慢API、延迟模块、共享依赖、ID不变换来源，比较错归属/漏页/人工排查分钟；无改善或新增host耦合更重则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:398-473](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/lib/client.js#L398-L473)

当前强弱归属链支持元数据改进假设。

<details>
<summary>查看原文（76行）</summary>

```text
		 * Attribution runs strongest first: the slot entry's own `registrant` when
		 * it names a package, then a module whose `apply()` inlines
		 * `id: "<section>"`, then a module whose `apply()` merely mentions the id.
		 * Anything still unclaimed ships under a fallback group — a section the
		 * user installed must never silently vanish.
		 */
		function buildPluginSectionMap(entries) {
			const claimed = new Set();
			const groups = {};
			const add = (name, id) => {
				if (!id || claimed.has(id)) return;
				claimed.add(id);
				if (!groups[name]) groups[name] = [];
				groups[name].push(id);
			};
			const getParent = buildParentMap();

			for (const e of entries) {
				if (pkgLikeRegistrant(e.registrant)) {
					add(groupNameOf(getParent(e.registrant)), e.id);
				}
			}

			const cache = pluginCtx?.modules?.loadCache;
			const sectionMods = [];
			const allMods = [];
			if (cache) {
				for (const [modId, mod] of cache) {
					if (modId.startsWith('@deepseek-ai/')) continue;
					if (!mod || !mod.exports || typeof mod.exports.apply !== 'function') continue;
					const src = String(mod.exports.apply);
					allMods.push([modId, src]);
					if (src.includes('settings.section')) sectionMods.push([modId, src]);
				}
			}
			const strong = (src, id) => src.includes(`id: "${id}"`) || src.includes(`id: '${id}'`)
				|| src.includes(`id:"${id}"`) || src.includes(`id:'${id}'`);
			const mentions = (src, id) => src.includes(`"${id}"`) || src.includes(`'${id}'`);
			// `id:` inside a settings-section module is a near-certain hit; a bare
			// literal anywhere else is only a hint, and newer DSH moved the
			// registration out of `apply()` entirely, so that hint is all some
			// sections leave behind.
			for (const test of [[strong, sectionMods], [mentions, allMods]]) {
				const [probe, candidates] = test;
				for (const e of entries) {
					if (claimed.has(e.id)) continue;
					for (const [modId, src] of candidates) {
						if (probe(src, e.id)) {
							add(groupNameOf(getParent(modId)), e.id);
							break;
						}
					}
				}
			}

			// Last resort before the fallback bucket: when DSH stops inlining the
			// registration, the only trace left is the section id itself. Match it
			// against module ids token-wise, requiring *every* section token to line
			// up (`archived-sessions` → `dsh-session-archive`, `opencode-go` →
			// `dsh-opencode-go`). Requiring all tokens keeps this from grabbing a
			// module that only shares a generic word.
			const tokensOf = (s) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
			const tokEq = (a, b) => a === b || (a.length >= 3 && b.startsWith(a)) || (b.length >= 3 && a.startsWith(b));
			for (const e of entries) {
				if (claimed.has(e.id)) continue;
				const st = tokensOf(e.id);
				if (st.length === 0) continue;
				const hit = allMods.find(([modId]) => {
					const mt = tokensOf(modId);
					return st.every((tk) => mt.some((m) => tokEq(tk, m)));
				});
				if (hit) add(groupNameOf(getParent(hit[0])), e.id);
			}

			for (const e of entries) add("其他插件", e.id);
			return groups;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:635-643](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/lib/client.js#L635-L643)

异步通知可替代固定延迟补扫。

```text
			react.useEffect(() => {
				// Re-scan when the row set changes, and once more after mount in case
				// late-loading plugins materialise their modules after the slot fills.
				setPluginSectionMap(buildPluginSectionMap(readSectionEntries()));
				const timer = setTimeout(() => {
					setPluginSectionMap(buildPluginSectionMap(readSectionEntries()));
				}, 500);
				return () => clearTimeout(timer);
			}, [liveRowKey]);
```

**依据 3 · 源码核查**：[index.js:44-49](https://github.com/Amengclass/dsh-settings-hub/blob/d9986d8637c550ac5ebfd0fc545b7afaecf7f7d3/index.js#L44-L49)

共享依赖首父规则的反例。

```text
  for (const plugin of installedPlugins) {
    const visited = new Set();
    collectDeps(plugin, visited, nodeModulesDir);
    for (const dep of visited) {
      if (dep === plugin) continue;
      if (!depMap[dep]) depMap[dep] = plugin;
```

#### 缺口

- 稳定元数据在现有DSH版本可获得性和改进维护收益未知。
  **影响**：不能把假设写成当前正确归组或独立插件机会。
  **进一步探讨**：固定两host/双端故障矩阵，错归属不降且维护负担上升则保留原生导航。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
