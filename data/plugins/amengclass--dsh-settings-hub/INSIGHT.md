# dsh-settings-hub

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[72910cc](https://github.com/Amengclass/dsh-settings-hub/tree/72910cca0f425f2de7cfd00d2d4423b8678bafd6)

<!-- BEGIN META -->
[![npm 30d 1,265](https://img.shields.io/static/v1?label=npm+30d&message=1%2C265&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-settings-hub) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-settings-hub)
<!-- END META -->

> **功能**：将 DSH 第三方插件设置页聚合分组，并支持折叠及拖动保存导航顺序。

> **亮点**：以真实slot为清单、归属失败保留其他组，将多个插件的设置导航组织起来，并保存组和子项顺序。[Q01](#research-q01)、[Q02](#research-q02)

> **主要限制**：接管外壳并不保证页面可操作，locale/store契约、profile回退及异步依赖图都可能影响实际设置流程。[Q03](#research-q03)

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
  - [Q01 · 聚合设置解决什么导航问题，贡献由谁实现？](#detail-section-11)
  - [Q02 · 真实设置页如何归属、渲染和保存排序？](#detail-section-12)
  - [Q03 · 哪些条件会让自动分组或页面兼容不成立？](#detail-section-13)
  - [Q04 · 使用和故障恢复负担是什么，收益能量化吗？](#detail-section-14)
  - [Q05 · 怎样试用才能检验其价值，可推广什么设计？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：装有多个第三方设置页的 DSH 用户可在聚合导航中按插件查找和排序。

参照原生平铺设置导航，新增分组及本地顺序；业务配置继续由原组件处理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 聚合设置导航 | 按插件查找真实设置页 | 依赖slot与原页面服务，未知归属回其他组 |
| 分组与子项拖动 | 调整个人导航顺序 | 存储失败可能静默丢顺序 |
| profile依赖图 | 关联子包与父插件 | 共享依赖首父归属，需核对实际profile |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web客户端slots/modules及UI包 | 必需 | 接管外壳与读取真实设置项 | 外壳或页面无法加载 |
| webServer与正确profile清单 | 父包分组必需 | 读取安装依赖关系 | 分组回退或错误归属 |
| 原页面locale/store等宿主能力 | 对应页面必需 | 重建页面kit | 特定设置页报错 |
| localStorage | 排序持久化条件 | 保存组与子项顺序 | 写入失败无错误提示，顺序可能丢失 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 接入 | 用户在可恢复profile加载并重启 | 真实设置页可找到 |
| 验收 | 用户逐类页面读取并保存可逆项 | 原插件配置按预期生效 |
| 排序 | 用户拖动组和子项并重载 | 次序保留，新增项可见 |
| 恢复 | 用户停用组件并重启 | 原外壳可达并复核设置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地包与依赖扫描资源未测 | 核profile和各类页面，耗时未知 | 无实际双端兼容验收 |
| 持续 | API扫描、UI观察器资源未测 | 插件和宿主变更后复核 | 节省导航时间未知 |
| 失败恢复 | 重启与排障资源未测 | 停shadow、记录顺序和核配置 | 排序静默失败可能需重排 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 聚合真实设置页 | 真实slot作为候选，未知归入其他组 | 全部页面操作与正确归属 |
| 顺序持久化 | 拖动后写localStorage | 隐私模式或存储故障下保留 |
| 维护便利 | 原插件业务组件复用 | 镜像renderer的长期维护净负担 |

> **思考**：接管外壳并不保证页面可操作，locale/store契约、profile回退及异步依赖图都可能影响实际设置流程。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以真实slot为清单、归属失败保留其他组，将多个插件的设置导航组织起来，并保存组和子项顺序。[Q01](#research-q01)、[Q02](#research-q02)

[Q02](#research-q02) 真实条目优先与未知fallback可复用；[Q03](#research-q03) 复制renderer、首父依赖归属和异步变量不通知带来持续维护责任。

<a id="detail-section-5"></a>

### 1.4 主要限制

接管外壳并不保证页面可操作，locale/store契约、profile回退及异步依赖图都可能影响实际设置流程。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用固定插件集核对普通页和带locale/store页的保存、拖动与重载；不满足时停用聚合外壳，保留原设置入口。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持聚合与排序机制；真实节时和全设置页兼容未知，显式归属协议仍是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向复核固定版本的Host、client归属、渲染、排序和失败路径；未运行目标或宿主，不把README宽兼容声明当验收。
- 下一步：对照原导航验收固定插件集，覆盖共享依赖、慢API、带locale/store页和排序重载；记录失败而非仅截图。

**分析版本**

- **仓库**：[Amengclass/dsh-settings-hub](https://github.com/Amengclass/dsh-settings-hub)
- **版本号**：0.2.3（[固定提交 72910cc](https://github.com/Amengclass/dsh-settings-hub/tree/72910cca0f425f2de7cfd00d2d4423b8678bafd6)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索显式、可订阅的父插件归属元数据，替代apply字符串猜测和一次延迟重扫；须以相同插件集的误归属与维护负担对照证伪。[Q05](#research-q05)

对照原导航验收固定插件集，覆盖共享依赖、慢API、带locale/store页和排序重载；记录失败而非仅截图。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 424 | — | — | 2599 |
| .js | source | 2 | 1216 | 963 | 203 | — |
| .cjs | source | 1 | 124 | 88 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Amengclass/dsh-settings-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Amengclass/dsh-settings-hub/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Amengclass/dsh-settings-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：分组导航能否在不丢失真实设置页和配置能力的前提下减少多插件查找负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 聚合设置解决什么导航问题，贡献由谁实现？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已安装多个第三方设置页、需要反复寻找和组织设置的 DSH 用户。合格结果是原生和第三方真实设置页都可达、能正常保存，并能保留用户顺序，不能只验收出现“扩展设置”标题。组件读取真实 settings.section 的获胜项，再按插件分组、折叠与排序；相对在原列表滚动寻找，增量是导航组织。原插件的配置读写、宿主服务和权限仍由原插件及宿主实现，不能把它们归为本组件贡献。对插件很少的用户，新增分组层级可能没有优势。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-28](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/README.md#L20-L28)

作者描述聚合、动态发现与排序。

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

**依据 2 · 源码核查**：[lib/client.js:1063-1099](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/lib/client.js#L1063-L1099)

真实slot获胜项和shadow接管。

<details>
<summary>查看原文（37行）</summary>

```text
		const inject = ["slots", "modules"];
		function apply(ctx) {
			pluginCtx = ctx;
			ensureStyles();
			fetchDepMap();
			// uSES feed over the settings.section WINNERS (entriesOfSlot): one row
			// per cell id, sorted by order. Native ids stay in the feed — HubPanel
			// splits them out.
			let rowsVersion = -1;
			let rows = [];
			const shellInjected = () => ({
				ctx,
				hooks: {
					sections: {
						getSnapshot: () => {
							const version = ctx.slots.getVersion("settings.section");
							if (version !== rowsVersion) {
								rowsVersion = version;
								rows = ctx.slots.entriesOfSlot("settings.section")
									.map((e) => ({
										id: e.options.id ?? "",
										order: e.options.order ?? 0,
										label: slotsPkg.resolveSlotLabel(e.options.label) ?? "",
									}))
									.sort((a, b) => a.order - b.order);
							}
							return rows;
						},
						subscribe: (listener) => ctx.slots.subscribe("settings.section", listener),
					},
				},
			});
			ctx.slots.inject("sidebar.settings", () => ctx.slots.register({
				name: "sidebar.settings",
				priority: -100, // lowest priority renders → shadows the shipped shell
				inject: shellInjected,
			}, HubRoot));
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 真实设置页如何归属、渲染和保存排序？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端以较低优先级注册 sidebar.settings 外壳并订阅 settings.section 版本，始终从真实条目生成行。归属优先使用包名形态 registrant，通过Host依赖图映射父包；再从已加载模块apply源码匹配id或词元，未认出归到“其他插件”，而不凭字符串发明设置页。分组和子项顺序存在localStorage，拖动结束才写回。页面通过自行构造的kit传递locale、store、hooks与children，再调用原entry.component；错误边界可隔离组件渲染异常，但kit构造期间的错误在外层处理。这个设计保留原配置逻辑，却承担镜像宿主renderer契约的维护责任。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:194-240](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/lib/client.js#L194-L240)

自建kit和entry渲染链。

<details>
<summary>查看原文（47行）</summary>

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
			);
```

</details>

**依据 2 · 源码核查**：[lib/client.js:404-473](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/lib/client.js#L404-L473)

归属顺序与未知fallback。

<details>
<summary>查看原文（70行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/client.js:304-316](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/lib/client.js#L304-L316)

排序存储异常被吞。

<details>
<summary>查看原文（13行）</summary>

```text
		const GROUP_ORDER_KEY = 'dsh-settings-hub-group-order';
		const SECTION_ORDER_KEY = 'dsh-settings-hub-section-order';
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

**依据 4 · 源码核查**：[lib/client.js:740-778](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/lib/client.js#L740-L778)

拖动写回真实状态。

<details>
<summary>查看原文（39行）</summary>

```text
				if (ref.draggingId && ref.dragOverId && ref.draggingId !== ref.dragOverId) {
					const isGroupDrag = ref.draggingId.startsWith("__group__");
					if (isGroupDrag) {
						const pluginName = ref.draggingId.slice(9);
						const target = ref.flatItems.find((x) => x.id === ref.dragOverId);
						const fromIdx = ref.groupOrder.indexOf(pluginName);
						const toIdx = target ? ref.groupOrder.indexOf(target.pluginName) : -1;
						if (fromIdx !== -1 && toIdx !== -1) {
							// `dragOverAfter` comes from the same pointer/midpoint test
							// that drew the line, so the result always matches it.
							let insertIdx = toIdx + (ref.dragOverAfter ? 1 : 0);
							const newOrder = [...ref.groupOrder];
							newOrder.splice(fromIdx, 1);
							if (fromIdx < insertIdx) insertIdx -= 1;
							newOrder.splice(insertIdx, 0, pluginName);
							if (newOrder.some((g, i) => g !== ref.groupOrder[i])) {
								saveGroupOrder(newOrder);
								setGroupOrder(newOrder);
							}
						}
					} else {
						const draggedItem = ref.flatItems.find((x) => x.id === ref.draggingId);
						if (draggedItem && draggedItem.pluginName) {
							const g = draggedItem.pluginName;
							const secIds = [...(ref.sectionOrder[g] || [])];
							const fromIdx = secIds.indexOf(ref.draggingId);
							const overItem = ref.flatItems.find((x) => x.id === ref.dragOverId);
							const toIdx = overItem && overItem.type === "section" && overItem.pluginName === g
								? secIds.indexOf(ref.dragOverId)
								: -1;
							if (fromIdx !== -1 && toIdx !== -1) {
								let insertIdx = toIdx + (ref.dragOverAfter ? 1 : 0);
								secIds.splice(fromIdx, 1);
								if (fromIdx < insertIdx) insertIdx -= 1;
								secIds.splice(insertIdx, 0, ref.draggingId);
								if (secIds.some((id, i) => id !== (ref.sectionOrder[g] || [])[i])) {
									const newSectionOrder = { ...ref.sectionOrder, [g]: secIds };
									saveSectionOrder(newSectionOrder);
									setSectionOrder(newSectionOrder);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些条件会让自动分组或页面兼容不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

Host 从包所在位置向上最多五层找dsh-profile-*，找不到回退 ~/.dsh/profiles/web；本地link、特殊包布局或desktop安装应核对实际profileDirectory，否则分组可能读错安装集合。依赖图把共享子依赖分给首次遇到的父包，不能证明唯一归属。fetchDepMap异步改变模块变量但没有显式通知，界面只在行ID变化和一次500ms后重扫，慢接口可能要重开页面才看到正确父分组。更关键的是hostFace缺失时普通页可降级，但声明locale/store的页会抛错，出现分组不代表该页能操作。依赖API设置Access-Control-Allow-Origin:*，本入口未调用connection请求拒绝；实际暴露仍受宿主前置网络策略影响，源码不足以断言已被外站读取，但这类安装清单接口不能当私密通道。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:36-77](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/index.js#L36-L77)

首次父依赖和profile解析回退。

<details>
<summary>查看原文（42行）</summary>

```text
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
}

/**
 * Locate the profile this copy of the plugin is installed into.
 *
 * The web UI and the desktop app each boot their own profile
 * (`~/.dsh/profiles/web` and `~/.dsh/profiles/desktop`), and they carry
 * different plugin sets. Hardcoding one of them made the hub report the
 * wrong dependency tree whenever the other profile booted. So walk up from
 * this file until the enclosing profile's package.json shows up — the
 * profile root is named `dsh-profile-*`.
 */
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

**依据 2 · 源码核查**：[index.js:80-108](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/index.js#L80-L108)

依赖API内容与跨域头，未见本入口信任检查。

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

**依据 3 · 源码核查**：[lib/client.js:326-342](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/lib/client.js#L326-L342)

异步依赖图仅写模块变量。

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

**依据 4 · 源码核查**：[lib/client.js:194-219](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/lib/client.js#L194-L219)

locale/store依赖明确失败。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/client.js:648-659](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/lib/client.js#L648-L659)

ID变化和500ms重扫边界。

<details>
<summary>查看原文（12行）</summary>

```text
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

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用和故障恢复负担是什么，收益能量化吗？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要DSH web客户端的slots/modules及locale、UI基础包，Host需webServer和可读的profile包清单与node_modules；第三方设置页还各自依赖自己的服务。首次用户应核对profile，并逐页试保存、切换、重载和拖动；持续使用在宿主或插件更新后复核页面契约。排序读写失败会静默回默认或不持久，原插件业务配置不是由本组件存储。失败时停用shadow并重启回原设置壳，必要时记录自己的顺序；不能把停用解释为已证实所有页面无损恢复。依赖扫描和浏览器观察器资源、导航节时与维护耗时均没有计量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:28-39](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/package.json#L28-L39)

客户端包与web平台声明。

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
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
```

</details>

**依据 2 · 源码核查**：[index.js:90-108](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/index.js#L90-L108)

Host路由与依赖图。

<details>
<summary>查看原文（19行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/client.js:304-316](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/lib/client.js#L304-L316)

排序存储边界。

<details>
<summary>查看原文（13行）</summary>

```text
		const GROUP_ORDER_KEY = 'dsh-settings-hub-group-order';
		const SECTION_ORDER_KEY = 'dsh-settings-hub-section-order';
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

**依据 4 · 源码核查**：[lib/client.js:638-641](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/lib/client.js#L638-L641)

观察器清理。

```text
				const observer = new MutationObserver(scan);
				observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['style', 'class'] });
				scan();
				return () => { observer.disconnect(); removeOverlay(); };
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样试用才能检验其价值，可推广什么设计？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可供多插件用户在可恢复profile小范围试用，先比较原导航与分组导航找到相同设置页并保存一项可逆设置；必须覆盖普通页、带locale/store的页、慢依赖API和重载后的排序。页不能操作、分组误导或排序持续丢失时停用并恢复原外壳。由真实条目与启发式归属的分离可推导一个未实现方向，把注册者到父插件的归属做成显式、可订阅元数据，减少解析apply字符串及异步竞态；它需要宿主协议与插件参与，不能假定天然更简单。以相同插件集测试共享依赖、延迟响应及不同打包形式，若误归属与维护修改没有减少，则否定这个方向。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:404-473](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/lib/client.js#L404-L473)

显式注册者到启发式fallback的归属链。

<details>
<summary>查看原文（70行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/client.js:648-659](https://github.com/Amengclass/dsh-settings-hub/blob/72910cca0f425f2de7cfd00d2d4423b8678bafd6/lib/client.js#L648-L659)

可订阅元数据假设针对异步一次重扫。

<details>
<summary>查看原文（12行）</summary>

```text
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

#### 缺口

- 没有同条件的找页耗时、错误保存与长期维护数据。
  **影响**：无法量化导航净收益或声称所有DSH版本及设置页兼容。
  **进一步探讨**：固定插件集和宿主版本对照原壳，记录找页、保存、重载与维护失败。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
