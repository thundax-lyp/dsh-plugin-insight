# dsh-settings-hub

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[2c89559](https://github.com/Amengclass/dsh-settings-hub/tree/2c89559685a14375dcc6cc318ffc1c7c728a14c6)

<!-- BEGIN META -->
[![npm 30d 939](https://img.shields.io/static/v1?label=npm+30d&message=939&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-settings-hub) [![最新发布 2026-08-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-settings-hub)
<!-- END META -->

> **实现功能**：接管 DSH 设置侧边栏，将第三方 settings.section 聚合、分组并持久化排序。

> **核心亮点**：提供可拖拽第三方设置分组，详见[Q01](#research-q01)。

> **风险与缺陷**：依赖源码字符串正则识别和一次性定时重扫，可能漏检/错误归属；完整 shadow 带来兼容成本，详见[Q02](#research-q02)。

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
  - [Q01 · 插件如何替换设置侧边栏并重组第三方设置？](#detail-section-11)
  - [Q02 · “自动发现”“双端兼容”有什么源码边界？](#detail-section-12)
  - [Q03 · API 与维护成本怎样影响采用？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复怎样核算成本效果？](#detail-section-14)
  - [Q05 · 怎样证伪稳定归属元数据与异步更新能改善分组？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：插件较多时减少设置侧栏散乱。

原生设置侧栏中第三方 section 平铺。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 机制 | 边界 |
| --- | --- | --- |
| 依赖归属 | 读取 Profile 依赖 | 首父归属 |
| 设置聚合 | shadow slot | 宿主 renderer 兼容 |
| 排序 | localStorage | 浏览器本地 |

**流程与依赖**

DSH webServer、slots、modules；浏览器 localStorage 和 profile package/node_modules。

打开设置→加载依赖图→扫描已装模块→分组显示→拖拽保存顺序。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包/浏览器代码、Host依赖图递归读取资源，价格未知 | 核profile、备份排序与native/第三方设置页，工时未知 | client apply发起一次fetch，不是每次打开必发 |
| 持续使用 | slot订阅/源码字符串扫描、UI渲染/DOM观察、localStorage | 核动态加载/共享依赖归属及页面可操作，工时未知 | 重扫一次500ms不保证等待慢API；CPU/内存量未知 |
| 失败恢复 | 停用shadow、重载/依赖图重取及本地排序恢复资源 | 定位错误section、宿主renderer变化与外层访问边界，工时未知 | 无设置内容回滚事务；组件错误边界不保证业务设置功能完整 |

减少设置导航分散、持久保存排序；动态归属可靠性未证实。

> **思考**：依赖源码字符串正则识别和一次性定时重扫，可能漏检/错误归属；完整 shadow 带来兼容成本，详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：提供可拖拽第三方设置分组，详见[Q01](#research-q01)。

提供可拖拽第三方设置分组，详见[Q01](#research-q01)。

依赖图递归、字符串扫描模块 apply、slot shadow 与复制 renderer。

<a id="detail-section-5"></a>

### 1.4 主要限制

依赖源码字符串正则识别和一次性定时重扫，可能漏检/错误归属；完整 shadow 带来兼容成本，详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在 Web/桌面分开安装，检查 native 与多个第三方设置页、拖拽、重载和跨源 API；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持分组/排序路径；自动发现、双端兼容与网络暴露尚未实测。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/client.js、package.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交的 Node 和浏览器源码；未运行目标宿主。
- 下一步：慢 API/动态 id/共享依赖/多版本 UI/Origin 跨源请求隔离测试。

**分析版本**

- **仓库**：[Amengclass/dsh-settings-hub](https://github.com/Amengclass/dsh-settings-hub)
- **版本号**：0.1.3（[固定提交 2c89559](https://github.com/Amengclass/dsh-settings-hub/tree/2c89559685a14375dcc6cc318ffc1c7c728a14c6)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

稳定slot来源元数据与异步状态更新替代正则/单次重扫，反证和兼容代价见[Q05](#research-q05)。

慢 API/动态 id/共享依赖/多版本 UI/Origin 跨源请求隔离测试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 405 | — | — | 2109 |
| .js | source | 2 | 1057 | 871 | 144 | — |
| .cjs | source | 1 | 124 | 88 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Amengclass/dsh-settings-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Amengclass/dsh-settings-hub/issues?q=is%3Aissue+created%3A2026-09-22T07%3A27%3A24.176Z..2026-10-22T07%3A27%3A24.176Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Amengclass/dsh-settings-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A27%3A24.176Z..2026-10-22T07%3A27%3A24.176Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实设置聚合的具体实现、兼容范围与数据暴露边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件如何替换设置侧边栏并重组第三方设置？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

Node 端注册 GET /api/dsh-settings-hub/deps，读 profile package.json 与 node_modules 递归依赖形成 depMap；浏览器端以 priority -100 shadow sidebar.settings，重新投影 settings.section winners，保留四个 native id，把其余 section 分组并用 localStorage 存拖拽顺序。它替换了设置 shell 的渲染路径，内容仍从 slot entry 组件重建；不是在原生导航上简单加一行。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:25-53](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/index.js#L25-L53)

读取依赖图。

<details>
<summary>查看原文（29行）</summary>

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
}
```

</details>

**依据 2 · 源码核查**：[index.js:90-110](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/index.js#L90-L110)

注册 HTTP 路由。

<details>
<summary>查看原文（21行）</summary>

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
  });
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:904-941](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/lib/client.js#L904-L941)

shadow 与 slot winner。

<details>
<summary>查看原文（38行）</summary>

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
		}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:300-316](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/lib/client.js#L300-L316)

localStorage 顺序。

<details>
<summary>查看原文（17行）</summary>

```text
		/* ------------------------------------------------------------------ *
		 * Plugin-row drag-and-drop reorder (localStorage-persisted).        *
		 * ------------------------------------------------------------------ */

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

#### 缺口

- 未在 DSH web/桌面宿主实测
  **影响**：设置 shell 兼容性未知
  **进一步探讨**：分别在目标宿主版本安装并检查 native/第三方页面

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · “自动发现”“双端兼容”有什么源码边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

浏览器端遍历模块 loadCache，把 apply 函数源码转字符串，先查 settings.section，再用 id: 字面量正则提取 section id；动态拼接 id、不同注册机制或压缩代码容易漏检/误配。profile 依赖树对同一依赖只保留首次父插件，遇共享依赖归属会依赖遍历顺序。fetchDepMap 仅启动时调用，组件挂载后只在 500ms 重扫一次；若 API 延迟超过该时间，分组不会因 fetch 完成自动重算。桌面缺 hostFace 时仅空 kit 降级，依赖 locale/store 的 section 会报错；“双端兼容”需逐页验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:326-371](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/lib/client.js#L326-L371)

fetch、源码字符串扫描、正则提取。

<details>
<summary>查看原文（46行）</summary>

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
		}

		function buildPluginSectionMap() {
			const cache = pluginCtx?.modules?.loadCache;
			if (!cache) return {};
			const getParent = buildParentMap();
			const groups = {}; // parentPkg → sectionIds[]
			for (const [modId, mod] of cache) {
				if (modId.startsWith('@deepseek-ai/')) continue;
				if (!mod || !mod.exports || typeof mod.exports.apply !== 'function') continue;
				const parent = getParent(modId);
				const src = String(mod.exports.apply);
				if (!src.includes('settings.section')) continue;
				const sectionIds = [...src.matchAll(/id:\s*["']([^"']+)["']/g)]
					.map((m) => m[1])
					.filter((id) => !NATIVE_IDS.has(id));
				if (sectionIds.length === 0) continue;
				if (!groups[parent]) groups[parent] = [];
				groups[parent].push(...sectionIds);
			}
			const map = {};
			for (const [pkg, sectionIds] of Object.entries(groups)) {
				const slash = pkg.indexOf('/');
				const name = pkg.startsWith('@') && slash !== -1
					? pkg.substring(slash + 1)
					: pkg;
				map[name] = sectionIds;
			}
			return map;
```

</details>

**依据 2 · 源码核查**：[index.js:25-53](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/index.js#L25-L53)

首次父归属。

<details>
<summary>查看原文（29行）</summary>

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
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:525-535](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/lib/client.js#L525-L535)

挂载后一次 500ms 重扫。

<details>
<summary>查看原文（11行）</summary>

```text
			const nativeRows = rows.filter((r) => NATIVE_IDS.has(r.id));
			const pluginRows = rows.filter((r) => !NATIVE_IDS.has(r.id));
			const [pluginSectionMap, setPluginSectionMap] = react.useState(() => buildPluginSectionMap());
			react.useEffect(() => {
				// Single re-scan after mount in case late-loading plugins weren't ready.
				const timer = setTimeout(() => {
					const next = buildPluginSectionMap();
					setPluginSectionMap(next);
				}, 500);
				return () => clearTimeout(timer);
			}, []);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:194-239](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/lib/client.js#L194-L239)

hostFace 缺失时 store/locale 路径。

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

**依据 5 · 作者声明**：[README.md:20-28](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/README.md#L20-L28)

自动发现与双端声明。

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

#### 缺口

- 未测不同宿主版本或多插件冲突
  **影响**：实际漏检率/兼容范围未知
  **进一步探讨**：用多个 settings.section 实现方式及慢 API 验证

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · API 与维护成本怎样影响采用？

**研究主题**：依赖、兼容与流程、采用判断、缺陷与关键质疑

#### 完整回答

deps API 输出安装插件名和依赖映射，响应设置 Access-Control-Allow-Origin:*；若部署的外层认证和浏览器本地网络策略也允许该请求，CORS星号允许跨源脚本读取插件清单；仅网络可达并不足以独立证明能读。是否还有宿主级认证/网络边界未查，应先核查。客户端 shadow 全部 settings shell 并复制 slot/renderer 行为，未来宿主 API 变化维护成本较高。可在仅本地受控 Profile 试用，对比卸载前后 native/第三方设置、拖拽持久性及跨源访问限制。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:80-105](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/index.js#L80-L105)

CORS 星号和插件依赖数据。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:147-240](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/lib/client.js#L147-L240)

自行实现 child slot/renderer。

<details>
<summary>查看原文（94行）</summary>

```text
		/**
		 * Bound renderSlot for one entry: authorizes against the entry's own
		 * children declaration (SlotOwnershipError semantics), then projects the
		 * child slot's winners sorted by order. Dispatch options mirror the
		 * official renderer: `entryKey` selects one keyed cell (the owner
		 * dispatches one key at a time); `only` selects one list cell by id.
		 */
		function boundRenderSlotOf(ctx, entry) {
			return function renderSlot(key, ownerProps, opts) {
				if (!entry.children || !entry.children[key]) {
					throw new Error(`SlotOwnershipError: '${key}' is not declared by this entry's children`);
				}
				return jsxRuntime.jsx(
					ChildOutlet,
					{ ctx, childKey: key, ownerProps: ownerProps ?? {}, only: opts?.only, entryKey: opts?.entryKey },
					key,
				);
			};
		}

		/** Child-slot outlet: re-renders on ledger mutations of its key. */
		function ChildOutlet({ ctx, childKey, ownerProps, only, entryKey }) {
			const version = useSlotVersion(ctx, childKey);
			const rendered = react.useMemo(() => {
				const winners = ctx.slots.entriesOfSlot(childKey)
					.filter((e) => {
						if (only !== undefined && e.options.id !== only) return false;
						if (entryKey !== undefined && e.options.key !== entryKey) return false;
						return true;
					})
					.slice()
					.sort((a, b) => (a.options.order ?? 0) - (b.options.order ?? 0));
				if (winners.length === 0) return null;
				return winners.map((e) => renderEntry(ctx, childKey, e, ownerProps));
			}, [ctx, childKey, ownerProps, only, entryKey, version]);
			return jsxRuntime.jsx(jsxRuntime.Fragment, { children: rendered });
		}

		/**
		 * Assemble one winning entry's composed props and render its component.
		 * Mirrors the official composition order: standard kit (useSessions/
		 * useWorkspaces/t/renderSlot/useStore/actions) + inject face (its hooks
		 * compartment bound to use<Name> selector hooks) + owner props (owner
		 * last). Root scope → inject() runs with zero args; a declared store
		 * appends `actions` as the second inject arg, exactly as the official
		 * renderer does (InjectParams).
		 */
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

**依据 3 · 源码核查**：[lib/client.js:936-940](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/lib/client.js#L936-L940)

shadow 整个 sidebar.settings。

```text
			ctx.slots.inject("sidebar.settings", () => ctx.slots.register({
				name: "sidebar.settings",
				priority: -100, // lowest priority renders → shadows the shipped shell
				inject: shellInjected,
			}, HubRoot));
```

**依据 4 · 作者声明**：[README.md:55-113](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/README.md#L55-L113)

web/desktop 安装边界。

<details>
<summary>查看原文（59行）</summary>

````text
## 快速开始

### 前置条件

- [DeepSeek Harness](https://github.com/deepseek-ai/dsh) 已安装
- Node.js 18+

### 安装

**方式一：npm（推荐）**

```bash
dsh plugin --profile web add dsh-settings-hub
```

> **pnpm 11 用户注意**：pnpm 默认禁止安装发布 24 小时内的新版本。如果安装到旧版，在 `~/.dsh/profiles/web/pnpm-workspace.yaml` 中添加：
>
> ```yaml
> minimumReleaseAgeExclude:
>   - dsh-settings-hub
> ```
>
> 然后重新安装即可。

更新插件：

```bash
dsh plugin --profile web update dsh-settings-hub@latest
```

**方式二：GitHub**

```bash
dsh plugin --profile web add github:Amengclass/dsh-settings-hub
```

**方式三：源码安装**

```bash
git clone https://github.com/Amengclass/dsh-settings-hub.git
cd ~/.dsh/profiles/web
npm link /path/to/dsh-settings-hub
```

### 启动

```bash
dsh web
```

### 卸载

```bash
dsh plugin --profile web remove dsh-settings-hub
```

打开浏览器访问 `http://127.0.0.1:3080`，点击左下角「设置」即可看到效果。

> **桌面端用户**：DSH 桌面应用使用独立的 profile（`~/.dsh/profiles/desktop`），需要在**桌面端自己的插件管理**里安装本插件，而不是执行上面的 `dsh plugin --profile web add`。桌面端与 `dsh web` 互不影响，各自管理自己的插件。
````

</details>

#### 缺口

- 未测试宿主 webServer 认证/监听地址
  **影响**：跨源可读性与暴露面待确认
  **进一步探讨**：在受控宿主测 Origin 请求和网络绑定

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复怎样核算成本效果？

**研究主题**：效果与总成本、采用判断

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包/浏览器代码、Host依赖图递归读取资源，价格未知 | 核profile、备份排序与native/第三方设置页，工时未知 | client apply发起一次fetch，不是每次打开必发 |
| 持续使用 | slot订阅/源码字符串扫描、UI渲染/DOM观察、localStorage | 核动态加载/共享依赖归属及页面可操作，工时未知 | 重扫一次500ms不保证等待慢API；CPU/内存量未知 |
| 失败恢复 | 停用shadow、重载/依赖图重取及本地排序恢复资源 | 定位错误section、宿主renderer变化与外层访问边界，工时未知 | 无设置内容回滚事务；组件错误边界不保证业务设置功能完整 |

以设置页仍能正确读写并能找到目标section为单位，不以聚合列表显示即兼容通过。相对原生平铺导航，分组/拖拽可减少查找但会引入renderer适配与归属维护；localStorage只留本浏览器排序，写失败被吞，不能称同步配置。实际页数、动态加载时序、检索工时和恢复成本未知。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:25-53](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/index.js#L25-L53)

逐插件依赖图读取

<details>
<summary>查看原文（29行）</summary>

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
}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:300-334](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/lib/client.js#L300-L334)

排序与fetch

<details>
<summary>查看原文（35行）</summary>

```text
		/* ------------------------------------------------------------------ *
		 * Plugin-row drag-and-drop reorder (localStorage-persisted).        *
		 * ------------------------------------------------------------------ */

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
		}

		
		let pluginCtx = null;

// __DEP_MAP_START__
		let INSTALLED_PLUGINS = [];
		let DEP_MAP = {};

		async function fetchDepMap() {
			try {
				const r = await fetch("/api/dsh-settings-hub/deps");
				if (!r.ok) return;
				const d = await r.json();
				if (Array.isArray(d.installedPlugins)) INSTALLED_PLUGINS = d.installedPlugins;
				if (d.depMap && typeof d.depMap === "object") DEP_MAP = d.depMap;
			} catch {}
		}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:525-535](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/lib/client.js#L525-L535)

一次500ms重扫

<details>
<summary>查看原文（11行）</summary>

```text
			const nativeRows = rows.filter((r) => NATIVE_IDS.has(r.id));
			const pluginRows = rows.filter((r) => !NATIVE_IDS.has(r.id));
			const [pluginSectionMap, setPluginSectionMap] = react.useState(() => buildPluginSectionMap());
			react.useEffect(() => {
				// Single re-scan after mount in case late-loading plugins weren't ready.
				const timer = setTimeout(() => {
					const next = buildPluginSectionMap();
					setPluginSectionMap(next);
				}, 500);
				return () => clearTimeout(timer);
			}, []);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:904-941](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/lib/client.js#L904-L941)

客户端apply及shadow

<details>
<summary>查看原文（38行）</summary>

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
		}
```

</details>

#### 缺口

- 实际section/模块规模、宿主版本变化和查找/恢复工时未知
  **影响**：不能量化导航收益或长期兼容维护成本
  **进一步探讨**：从同一profile的目标设置任务与变更前后页面行为入手

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪稳定归属元数据与异步更新能改善分组？

**研究主题**：新假设与验证、工程质量与复用、采用判断

#### 完整回答

固定实现扫描apply源码中的settings.section与id字面量，依赖图仅首次父归属；fetch完成不触发React状态，只有挂载后500ms一次重扫。相对当前正则/定时方案，设计假设是由slot注册元数据带来源包和父关系，依赖fetch/slot变化驱动显式状态更新，可减少动态ID、共享依赖和慢API误分组。条件是宿主提供稳定来源字段和变化订阅，代价是版本适配、来源冲突规则和额外更新/渲染。最小对照用静态/动态id、同模块多个无关id、两插件共享依赖、API分别延迟100/1000ms和晚注册section，在原版/隔离原型比较漏项、错归属、更新后页面功能与重渲染开销。若慢API后仍错、动态ID仍漏、共享来源误归或设置读写失效，假设被证伪。尚未实现/执行，重组正确也不证明CORS/外层管理身份安全；两者需独立核查。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:326-371](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/lib/client.js#L326-L371)

字符串/依赖归属

<details>
<summary>查看原文（46行）</summary>

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
		}

		function buildPluginSectionMap() {
			const cache = pluginCtx?.modules?.loadCache;
			if (!cache) return {};
			const getParent = buildParentMap();
			const groups = {}; // parentPkg → sectionIds[]
			for (const [modId, mod] of cache) {
				if (modId.startsWith('@deepseek-ai/')) continue;
				if (!mod || !mod.exports || typeof mod.exports.apply !== 'function') continue;
				const parent = getParent(modId);
				const src = String(mod.exports.apply);
				if (!src.includes('settings.section')) continue;
				const sectionIds = [...src.matchAll(/id:\s*["']([^"']+)["']/g)]
					.map((m) => m[1])
					.filter((id) => !NATIVE_IDS.has(id));
				if (sectionIds.length === 0) continue;
				if (!groups[parent]) groups[parent] = [];
				groups[parent].push(...sectionIds);
			}
			const map = {};
			for (const [pkg, sectionIds] of Object.entries(groups)) {
				const slash = pkg.indexOf('/');
				const name = pkg.startsWith('@') && slash !== -1
					? pkg.substring(slash + 1)
					: pkg;
				map[name] = sectionIds;
			}
			return map;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:525-535](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/lib/client.js#L525-L535)

一次重扫

<details>
<summary>查看原文（11行）</summary>

```text
			const nativeRows = rows.filter((r) => NATIVE_IDS.has(r.id));
			const pluginRows = rows.filter((r) => !NATIVE_IDS.has(r.id));
			const [pluginSectionMap, setPluginSectionMap] = react.useState(() => buildPluginSectionMap());
			react.useEffect(() => {
				// Single re-scan after mount in case late-loading plugins weren't ready.
				const timer = setTimeout(() => {
					const next = buildPluginSectionMap();
					setPluginSectionMap(next);
				}, 500);
				return () => clearTimeout(timer);
			}, []);
```

</details>

**依据 3 · 源码核查**：[index.js:25-53](https://github.com/Amengclass/dsh-settings-hub/blob/2c89559685a14375dcc6cc318ffc1c7c728a14c6/index.js#L25-L53)

首次父归属

<details>
<summary>查看原文（29行）</summary>

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
}
```

</details>

#### 缺口

- 宿主稳定来源元数据可用性与更新代价未知
  **影响**：不能推定新分组机制已支持所有宿主
  **进一步探讨**：从固定宿主slot来源契约和受控模块加载时序入手

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
