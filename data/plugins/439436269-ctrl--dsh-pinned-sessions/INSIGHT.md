# dsh-pinned-sessions

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[20044d9](https://github.com/439436269-ctrl/dsh-pinned-sessions/tree/20044d963ce5d0a780915be97491b9d330285bf3)

<!-- BEGIN META -->
[![npm 30d 479](https://img.shields.io/static/v1?label=npm+30d&message=479&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions)
<!-- END META -->

> **实现功能**：为 DSH 侧栏提供跨工作区置顶会话分组，支持组内搜索、状态显示、打开与取消置顶。

> **核心亮点**：复用宿主pin关系，增加跨工作区平面组与局部搜索，减少展开查找步骤；贡献是导航聚合，不是新增置顶存储或任务流程。详见[Q01](#research-q01)。

> **风险与缺陷**：最影响长期便利的是内部DOM耦合，class或层级变化会隐藏分组；取消置顶失败仅console提示，且浏览器偏好是新增本地状态。源码和README部分挂载叙述不同，以源码为准。详见[Q03](#research-q03)。

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
  - [Q01 · 原生已有置顶时独立分组增加什么？](#detail-section-11)
  - [Q02 · 列表、状态、搜索和取消置顶怎么实现？](#detail-section-12)
  - [Q03 · 挂载与降级留下什么限制？](#detail-section-13)
  - [Q04 · 工程和三阶段成本怎样，可借鉴什么？](#detail-section-14)
  - [Q05 · 还能探索什么，对谁值得试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多工作区用户需要快速返回重点会话，聚合组以正确打开既有会话和同步原生pin为合格结果。详见[Q01](#research-q01)。

宿主原生pin排序、工作区展开和全局搜索为简单替代，插件聚合阅读入口但不更改pin所有权。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 聚合置顶组 | 跨工作区返回重点会话 | 排除归档/空白/subagent |
| 搜索和状态 | 快速找会话与待办注意 | 依赖原生store |
| 原生操作 | 打开与取消pin | 失败仅console提示 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| slots/sessions/workspaces等客户端服务 | 数据与操作 | 不匹配影响加载/状态 |
| 内部侧栏DOM | portal挂载 | 未找到则隐藏 |
| localStorage | 可选偏好保存 | 拒绝时回退内存 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 安装profile并刷新 | 用户 | 仅一组挂载 |
| 检查已有pin与状态 | 用户 | 顺序/筛选与原生一致 |
| 搜索打开或取消pin | 用户/宿主 | 正确会话及操作结果 |
| 关闭设置或卸载 | 用户 | 原生pin仍可用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主web客户端，无新增模型调用 | 安装刷新并核对单一实例 | 无新增模型调用；安装与实例核查工时未知 |
| 持续使用 | store重渲染、DOMreconcile及timer | 标题搜索和状态阅读，节省未测 | DOM/store/timer资源随列表变化；定位节时未测 |
| 失败恢复 | 关闭或卸载刷新 | 回到原生pin，核对unpin结果 | 回原生pin/unpin与刷新所需时间未知 |


#### 效果

| 目标 | 机制支持 | 边界 |
| --- | --- | --- |
| 聚合pin | 宿主pin顺序与store | 隐藏归档/空白/subagent |
| 状态一致 | uiSession状态与原生操作 | 需服务契约匹配 |
| 少查找 | 组内标题搜索 | 无任务计时和规模实测 |

> **思考**：最影响长期便利的是内部DOM耦合，class或层级变化会隐藏分组；取消置顶失败仅console提示，且浏览器偏好是新增本地状态。源码和README部分挂载叙述不同，以源码为准。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：复用宿主pin关系，增加跨工作区平面组与局部搜索，减少展开查找步骤；贡献是导航聚合，不是新增置顶存储或任务流程。详见[Q01](#research-q01)。

复用宿主pin关系，增加跨工作区平面组与局部搜索，减少展开查找步骤；贡献是导航聚合，不是新增置顶存储或任务流程。详见[Q01](#research-q01)。

宿主pin唯一真相、useSyncExternalStore及清理observer值得借鉴；手写bundle与内部DOM选择器带来维护代价，stub检查不能代替真实布局。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最影响长期便利的是内部DOM耦合，class或层级变化会隐藏分组；取消置顶失败仅console提示，且浏览器偏好是新增本地状态。源码和README部分挂载叙述不同，以源码为准。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议多工作区少量重点会话用户试用，核对顺序、状态和取消置顶；DOM变更、双挂载或操作失败不清时停用，回到原生导航。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

聚合投影和原生状态复用有源码支持；挂载依赖内部DOM。专用slot替代是未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、test/bundle-check.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交检查客户端逻辑、Host no-op、manifest与stub检查；不将作者浏览器验证记录当本轮独立验收。
- 下一步：进一步探讨可从宿主搜索/rail/列表替换和取消置顶失败四组状态入手，再比较原生查找与聚合导航的正确打开时间和维护负担。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-pinned-sessions](https://github.com/439436269-ctrl/dsh-pinned-sessions)
- **版本号**：0.4.1（[固定提交 20044d9](https://github.com/439436269-ctrl/dsh-pinned-sessions/tree/20044d963ce5d0a780915be97491b9d330285bf3)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨宿主专用组slot来替代scoped DOM查找，用相同布局与升级样例比较挂载正确性和维护改动量；需宿主配合，当前未验证。详见[Q05](#research-q05)。

进一步探讨可从宿主搜索/rail/列表替换和取消置顶失败四组状态入手，再比较原生查找与聚合导航的正确打开时间和维护负担。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 917 | — | — | 11206 |
| .js | source | 2 | 804 | 613 | 192 | — |
| .mjs | test | 1 | 422 | 332 | 65 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-pinned-sessions/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-pinned-sessions/issues?q=is%3Aissue+created%3A2026-09-22T04%3A52%3A52.281Z..2026-10-22T04%3A52%3A52.281Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-pinned-sessions/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A52%3A52.281Z..2026-10-22T04%3A52%3A52.281Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本如何复用原生pin构成跨工作区入口，其UI耦合、成本和采用边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生已有置顶时独立分组增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在多个工作区并行处理长任务、希望快速返回少量重点会话的DSH用户。原生已保存pin，只在各自工作区排序时用户仍要展开和查找；插件把已置顶会话投影为跨工作区平面组，显示所属工作区、原生状态和组内标题搜索。合格结果是找到并打开正确既有会话、取消置顶后原生与投影一致，而不是创建新的任务管理系统。

简单替代是宿主工作区列表和全局搜索。新增价值在聚合阅读入口和保留原生状态所有权，不在pin能力本身。selector按宿主pinnedSessionIds顺序过滤已归档、空白和subagent会话，所以它并不是全部置顶对象的完整镜像。工作区少或只有一个长期会话时新增组可能占用空间而无足够收益；不将此类局部界面便利视为新业务交付模式。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:247-266](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L247-L266)

实际pin顺序、空白/subagent及归档过滤。

<details>
<summary>查看原文（20行）</summary>

```text
		function pinnedSessionIds(sessions, workspaces) {
			const archived = new Set(workspaces.archivedSessionIds ?? []);
			const ids = [];
			for (const id of workspaces.pinnedSessionIds ?? []) {
				const summary = sessions.byId[id];
				if (summary === undefined || summary.origin === "subagent" || summary.blank || archived.has(id)) continue;
				ids.push(id);
			}
			return ids;
		}
		/** Pinned-but-archived sessions, which this section deliberately hides. */
		function archivedPinnedCount(sessions, workspaces) {
			const archived = new Set(workspaces.archivedSessionIds ?? []);
			let count = 0;
			for (const id of workspaces.pinnedSessionIds ?? []) {
				const summary = sessions.byId[id];
				if (summary === undefined || summary.origin === "subagent" || summary.blank) continue;
				if (archived.has(id)) count += 1;
			}
			return count;
```

</details>

**依据 2 · 作者声明**：[README.md:13-19](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/README.md#L13-L19)

作者提出原生pin局部排序与跨工作区入口差异。

```text

DSH already pins sessions (hover a row → pin glyph, or right-click → 「置顶会话」),
but the result is only a re-order **inside that session's own workspace group**: a
pinned session still scrolls away when you switch workspaces, collapse groups, or
drown in a long list.

This plugin gives the pinned set its own group, above the Workspace browser:
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 列表、状态、搜索和取消置顶怎么实现？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host入口是no-op，功能由web客户端ModuleLoader包提供。apply注入slots、sessions、workspaces、uiWorkspace、uiSession和locale，用useSyncExternalStore订阅会话、工作区及状态，按pin顺序构成行。状态优先展示待审批、计划审查或提问，然后运行，最后完成未读；缺状态时才用summary.running回退。标题搜索trim并小写匹配，不重排pin顺序。点击通过uiWorkspace.openSession，取消置顶调用宿主workspaces.unpinSession而不直接写store。

注册shell.overlay用于portal挂载，并注册settings.general.item开关；折叠和可见偏好写浏览器localStorage，pin关系仍由宿主保存。挂载按sidebar.workspaces锚点下的listArea及class结尾list寻找滚动容器，插入专属host节点为首项；搜索结果和rail状态不挂载。Node>=22、DSH>=0.2.0-rc.1是清单声明，实际还依赖这些客户端API与DOM形状。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:12-18](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/index.js#L12-L18)

host半边只满足加载发现。

```text
 * The Host half still has to exist: a Loader row is a Node module, and the
 * client-modules node half resolves this package to find its browser bundle.
 */
/** Host plugin body — pinned sessions is a browser-only surface. */
function apply() {}

export { apply };
```

**依据 2 · 源码核查**：[lib/client.js:226-255](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L226-L255)

store订阅与pin投影。

<details>
<summary>查看原文（30行）</summary>

```text
		function useSnapshot(store) {
			const subscribe = react.useCallback((listener) => store.subscribe(listener), [store]);
			const getSnapshot = react.useCallback(() => store.getSnapshot(), [store]);
			return react.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
		}
		/**
		 * A status store for hosts that cannot supply `uiSession.sessionStatus`.
		 * `useSyncExternalStore` needs one stable store identity, so the fallback is
		 * module-level rather than a fresh object per render.
		 */
		const EMPTY_STATUSES = new Map();
		const EMPTY_STATUS_STORE = { getSnapshot: () => EMPTY_STATUSES, subscribe: () => () => {} };
		/** Re-render once a minute so relative timestamps stay honest. */
		function useMinuteClock() {
			const [, setTick] = react.useState(0);
			react.useEffect(() => {
				const timer = window.setInterval(() => setTick((value) => value + 1), 60000);
				return () => window.clearInterval(timer);
			}, []);
		}
		/** Session ids that are pinned, visible and not archived, in pin order. */
		function pinnedSessionIds(sessions, workspaces) {
			const archived = new Set(workspaces.archivedSessionIds ?? []);
			const ids = [];
			for (const id of workspaces.pinnedSessionIds ?? []) {
				const summary = sessions.byId[id];
				if (summary === undefined || summary.origin === "subagent" || summary.blank || archived.has(id)) continue;
				ids.push(id);
			}
			return ids;
```

</details>

**依据 3 · 源码核查**：[lib/client.js:314-350](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L314-L350)

状态优先级及标题搜索。

<details>
<summary>查看原文（37行）</summary>

```text
		function statusView(status, summary, t) {
			switch (status?.pendingInteraction?.kind) {
				case "approval":
					return { state: "warning", label: t("row.waitingApproval"), trailing: t("status.compact.approval"), testid: "pinned-sessions-warning" };
				case "plan-review":
					return { state: "warning", label: t("row.planReview"), trailing: t("status.compact.planReview"), testid: "pinned-sessions-warning" };
				case "question":
					return { state: "warning", label: t("row.waitingAnswer"), trailing: t("status.compact.answer"), testid: "pinned-sessions-warning" };
				default:
					break;
			}
			const running = status === undefined ? summary.running === true : status.running === true;
			if (running) return { state: "ongoing", label: t("row.running"), trailing: undefined, testid: "pinned-sessions-running" };
			/** A finished-but-unopened session is the second attention state worth a dot. */
			if (status?.completionUnread === true) return { state: "done", label: t("row.unread"), trailing: undefined, testid: "pinned-sessions-unread" };
			return { state: "idle", label: "", trailing: undefined, testid: undefined };
		}
		/** Row label for one session summary. */
		function rowLabel(summary, t) {
			const title = String(summary.title ?? "").trim();
			if (title !== "") return title;
			const display = String(summary.displayTitle ?? "").trim();
			if (display !== "") return display;
			return t("row.untitled");
		}
		/**
		 * Narrow pinned rows to those whose label contains `query`, case-insensitively.
		 * A blank query is a no-op, so the unfiltered list rides the same code path.
		 * @param rows - pinned session summaries, in pin order.
		 * @param query - raw search text.
		 * @param t - dictionary lookup.
		 * @returns the matching subset, still in pin order.
		 */
		function filterRows(rows, query, t) {
			const needle = String(query ?? "").trim().toLowerCase();
			if (needle === "") return rows;
			return rows.filter((summary) => rowLabel(summary, t).toLowerCase().includes(needle));
```

</details>

**依据 4 · 源码核查**：[lib/client.js:723-777](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L723-L777)

服务、宿主操作和两个slot注册。

<details>
<summary>查看原文（55行）</summary>

```text
		const inject = [
			"slots",
			"sessions",
			"workspaces",
			"uiWorkspace",
			"uiSession",
			"locale"
		];
		/**
		 * Register the sidebar section.
		 * @param ctx - Client root context.
		 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "@vfvrpq/dsh-pinned-sessions: dictionaries");
			const { sessions, workspaces, uiWorkspace, uiSession } = ctx;
			const face = () => ({
				sessionsStore: sessions.list,
				workspacesStore: workspaces.list,
				/**
				 * Live Session status, shared with the native rows: `running`,
				 * `pendingInteraction` and `completionUnread`. Reading the summary's
				 * own `running` flag is not enough — that snapshot keeps the value it
				 * loaded with, while later runs arrive as `api-session/status` events.
				 */
				statusStore: uiSession.sessionStatus,
				openSession: (sessionId) => {
					uiWorkspace.openSession(sessionId);
				},
				unpinSession: (sessionId) => {
					workspaces.unpinSession(sessionId).catch((reason) => {
						console.warn("@vfvrpq/dsh-pinned-sessions: unpin rejected:", reason);
					});
				}
			});
			/*
			 * `shell.overlay` is the always-mounted application surface seat; the
			 * component contributes no overlay content of its own — it only portals
			 * the section into the sidebar.
			 */
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "pinned-sessions-section",
				locale: NS,
				inject: face
			}, PinnedSectionMount));
			/*
			 * Settings → General carries the on/off switch, so turning the group off
			 * never means editing a config file by hand.
			 */
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "pinned-sessions",
				order: 30,
				locale: NS
			}, PinnedSettingsRow));
```

</details>

**依据 5 · 源码核查**：[lib/client.js:656-680](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L656-L680)

实际插入原生滚动容器。

<details>
<summary>查看原文（25行）</summary>

```text
				const ensure = () => {
					if (disposed) return;
					const root = sidebarRoot();
					const listArea = root === null || isRail(root) ? null : listAreaOf(root);
					const scroller = listArea === null || searchShowing(listArea) ? null : scrollerOf(listArea);
					if (scroller === null) {
						detach();
						return;
					}
					if (node.parentNode !== scroller || node !== scroller.firstElementChild) {
						scroller.insertBefore(node, scroller.firstChild);
					}
					if (!attached) {
						attached = true;
						setHost(node);
					}
				};
				ensure();
				observer = new MutationObserver(() => {
					ensure();
				});
				const observedRoot = sidebarRoot();
				if (observedRoot !== null) {
					observer.observe(observedRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
				}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 挂载与降级留下什么限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

主要限制是没有专用扩展位，依赖宿主内部DOM和scoped class模式。锚点、listArea、list class或searchResultRow改变都可能让分组消失或放错位置。找不到容器时detach保留原生列表，是合理失败收敛；但静默隐藏使用户可能不知道加载失败，不能说“消失不报错”等于兼容。README关于不进入原生子树、放在anchor之前且独立占高的描述与当前源码插入scroller首项不同，本轮以源码为准，不延续旧挂载叙述。

取消置顶失败只写console.warn，缺少可见错误；用户需要核对宿主状态是否真的改变。偏好属于当前浏览器origin，源码只通知本bundle内listeners，没有storage事件同步，因此不同窗口/浏览器的开关和折叠可不同，不能笼统称“完全没有新增状态”。这些不一定阻碍单窗口使用，但升级与多窗口场景需保留边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:588-624](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L588-L624)

选择器依赖内部class和DOM层级。

<details>
<summary>查看原文（37行）</summary>

```text
		function sidebarRoot() {
			if (typeof document === "undefined") return null;
			const region = document.querySelector(ANCHOR_SELECTOR);
			return region === null ? null : region.firstElementChild;
		}
		/** The list area inside the browser root (header stays outside it). */
		function listAreaOf(root) {
			for (const child of root.children) {
				if (typeof child.className === "string" && child.className.includes("listArea")) return child;
			}
			return null;
		}
		/**
		 * The rows' own scroll container: the element whose scoped class token ends
		 * in `list`. The pinned section goes in at its top so the two share one
		 * scroll region instead of the section squeezing the list's height.
		 */
		function scrollerOf(listArea) {
			for (const element of listArea.querySelectorAll("div")) {
				const className = element.className;
				if (typeof className !== "string") continue;
				for (const token of className.split(/\s+/u)) {
					if (/(^|_)list$/u.test(token)) return element;
				}
			}
			return null;
		}
		/** Whether the browser is collapsed to its rail (no list to mount into). */
		function isRail(root) {
			return typeof root.className === "string" && /(^|\s)[^\s]*rail(\s|$)/u.test(root.className);
		}
		/**
		 * The native browser keeps the pinned section out of the way while it shows
		 * search results, where a floating group on top would just cover them.
		 */
		function searchShowing(listArea) {
			return listArea.querySelector('[class*="searchResultRow"]') !== null;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:656-686](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L656-L686)

容器不可得时detach及生命周期。

<details>
<summary>查看原文（31行）</summary>

```text
				const ensure = () => {
					if (disposed) return;
					const root = sidebarRoot();
					const listArea = root === null || isRail(root) ? null : listAreaOf(root);
					const scroller = listArea === null || searchShowing(listArea) ? null : scrollerOf(listArea);
					if (scroller === null) {
						detach();
						return;
					}
					if (node.parentNode !== scroller || node !== scroller.firstElementChild) {
						scroller.insertBefore(node, scroller.firstChild);
					}
					if (!attached) {
						attached = true;
						setHost(node);
					}
				};
				ensure();
				observer = new MutationObserver(() => {
					ensure();
				});
				const observedRoot = sidebarRoot();
				if (observedRoot !== null) {
					observer.observe(observedRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
				}
				const timer = window.setInterval(ensure, RECONCILE_MS);
				return () => {
					disposed = true;
					window.clearInterval(timer);
					if (observer !== null) observer.disconnect();
					detach();
```

</details>

**依据 3 · 源码核查**：[lib/client.js:751-754](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L751-L754)

取消置顶失败仅控制台记录。

```text
				unpinSession: (sessionId) => {
					workspaces.unpinSession(sessionId).catch((reason) => {
						console.warn("@vfvrpq/dsh-pinned-sessions: unpin rejected:", reason);
					});
```

**依据 4 · 源码核查**：[lib/client.js:171-218](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L171-L218)

浏览器偏好和同bundle订阅。

<details>
<summary>查看原文（48行）</summary>

```text
		/** Collapse choice survives reloads; a denied storage keeps the section expanded. */
		const COLLAPSED_KEY = "@vfvrpq/dsh-pinned-sessions.collapsed";
		function readCollapsed() {
			try {
				return window.localStorage?.getItem(COLLAPSED_KEY) === "true";
			} catch {
				return false;
			}
		}
		function writeCollapsed(value) {
			try {
				window.localStorage?.setItem(COLLAPSED_KEY, value ? "true" : "false");
			} catch {
				/* storage denied — the in-memory choice still applies */
			}
		}
		/** Visibility choice, owned by the Settings row and read by the mount. */
		const ENABLED_KEY = "@vfvrpq/dsh-pinned-sessions.enabled";
		function readEnabled() {
			try {
				return window.localStorage?.getItem(ENABLED_KEY) !== "false";
			} catch {
				return true;
			}
		}
		/**
		 * One shared source for the visibility switch: the Settings row writes it,
		 * the sidebar mount subscribes to it, and both live in this bundle instance,
		 * so the two surfaces can never disagree.
		 */
		const enabledSource = (() => {
			let value = readEnabled();
			const listeners = new Set();
			return {
				getSnapshot: () => value,
				subscribe: (listener) => {
					listeners.add(listener);
					return () => listeners.delete(listener);
				},
				set: (next) => {
					value = next === true;
					try {
						window.localStorage?.setItem(ENABLED_KEY, value ? "true" : "false");
					} catch {
						/* storage denied — the in-memory choice still applies */
					}
					for (const listener of listeners) listener();
				}
```

</details>

#### 缺口

- 目标DSH客户端的DOM与服务语义尚未独立固定核对。
  **影响**：影响新版宿主实际可见性和操作一致性。
  **进一步探讨**：对部署宿主固定版本检查slot锚点、列表容器、uiSession状态与unpin契约，不以最低版本声明替代。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程和三阶段成本怎样，可借鉴什么？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

值得借鉴的是复用宿主pin真相源与原生服务写入，独立投影不复制持久关系；React store订阅保持数据流清楚，observer和周期reconcile在卸载时清理，localStorage拒绝时仍保留内存偏好。代价是手写单bundle和内部DOM查找，移植需维护选择器、交互状态与本地化。bundle-check用fake ModuleLoader/Client Context和hook shim检查元素树，能覆盖静态接线与selector逻辑，却不能证明真实浏览器布局；本轮仅阅读未执行。

首次成本是安装profile和刷新，确认只安装一份；持续成本是store触发重渲染、pin列表过滤、DOM变更ensure与周期扫描、每分钟时间刷新，没有新增模型/API费用机制。失败恢复是关闭可见开关或宿主移除、刷新，检查pin关系仍在原生列表，不需迁移pin数据库。人工寻找会话的时间节省与大量pin时性能未测，不能从局部UI便利给出量化效率收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:239-244](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L239-L244)

每分钟时间刷新并清理timer。

```text
		function useMinuteClock() {
			const [, setTick] = react.useState(0);
			react.useEffect(() => {
				const timer = window.setInterval(() => setTick((value) => value + 1), 60000);
				return () => window.clearInterval(timer);
			}, []);
```

**依据 2 · 源码核查**：[lib/client.js:674-686](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L674-L686)

observer与周期reconcile及释放。

<details>
<summary>查看原文（13行）</summary>

```text
				observer = new MutationObserver(() => {
					ensure();
				});
				const observedRoot = sidebarRoot();
				if (observedRoot !== null) {
					observer.observe(observedRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
				}
				const timer = window.setInterval(ensure, RECONCILE_MS);
				return () => {
					disposed = true;
					window.clearInterval(timer);
					if (observer !== null) observer.disconnect();
					detach();
```

</details>

**依据 3 · 源码核查**：[lib/client.js:171-218](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L171-L218)

偏好异常的有限回退。

<details>
<summary>查看原文（48行）</summary>

```text
		/** Collapse choice survives reloads; a denied storage keeps the section expanded. */
		const COLLAPSED_KEY = "@vfvrpq/dsh-pinned-sessions.collapsed";
		function readCollapsed() {
			try {
				return window.localStorage?.getItem(COLLAPSED_KEY) === "true";
			} catch {
				return false;
			}
		}
		function writeCollapsed(value) {
			try {
				window.localStorage?.setItem(COLLAPSED_KEY, value ? "true" : "false");
			} catch {
				/* storage denied — the in-memory choice still applies */
			}
		}
		/** Visibility choice, owned by the Settings row and read by the mount. */
		const ENABLED_KEY = "@vfvrpq/dsh-pinned-sessions.enabled";
		function readEnabled() {
			try {
				return window.localStorage?.getItem(ENABLED_KEY) !== "false";
			} catch {
				return true;
			}
		}
		/**
		 * One shared source for the visibility switch: the Settings row writes it,
		 * the sidebar mount subscribes to it, and both live in this bundle instance,
		 * so the two surfaces can never disagree.
		 */
		const enabledSource = (() => {
			let value = readEnabled();
			const listeners = new Set();
			return {
				getSnapshot: () => value,
				subscribe: (listener) => {
					listeners.add(listener);
					return () => listeners.delete(listener);
				},
				set: (next) => {
					value = next === true;
					try {
						window.localStorage?.setItem(ENABLED_KEY, value ? "true" : "false");
					} catch {
						/* storage denied — the in-memory choice still applies */
					}
					for (const listener of listeners) listener();
				}
```

</details>

**依据 4 · 源码核查**：[test/bundle-check.mjs:1-12](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/test/bundle-check.mjs#L1-L12)

作者明确fake环境及检查范围。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * Static + render smoke test for the @vfvrpq/dsh-pinned-sessions client bundle.
 *
 * It never touches the running DSH: it registers the bundle against a fake
 * `window.__ModuleLoader__`, materializes the factory with a stub `require`
 * (real React for `createElement`, a hook shim so the section can be called
 * outside a renderer, stub primitives for the icons), runs `apply()` against a
 * fake Client Context, and asserts the element tree the pure pieces return.
 *
 * The DOM-mounting half (`PinnedSectionMount`) needs a renderer and a real
 * sidebar, so it is covered by the Playwright pass described in VERIFY.md; here
 * only its anchor selector is pinned down.
```

</details>

#### 缺口

- 没有大量pin、工作区和长时间运行下的性能及寻找任务计时。
  **影响**：无法量化额外UI占用与导航便利的平衡。
  **进一步探讨**：同一组会话对照原生搜索与聚合组，记录正确打开时间、误点和列表渲染/扫描成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 还能探索什么，对谁值得试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是由宿主提供明确的额外工作区组slot，并让插件只提交组数据和操作，从而用稳定协议代替scoped DOM查找。推导来自pin数据和操作已用公开服务，只有挂载仍靠内部结构。最小验证在固定宿主适配层对照当前portal与候选slot，覆盖展开/搜索/rail/升级变更，比较正确挂载和维护改动量；若增加协议责任却不能减少兼容修复，否定这个扩展。它需要宿主配合，不是当前插件已实现能力。

当前建议多工作区、少量重点会话的用户试用，先确认pin顺序、状态、搜索和unpin与原生一致；保留宿主原生查找入口。成功标准是打开正确会话且无列表覆盖、双挂载或状态漂移。若升级后组不见、搜索遮挡或取消置顶失败不能辨别，应停用并回到原生列表。没有本轮安装和卸载验收，不能给值得安装；试用价值来自明确局部便利而不是创新分或包下载量。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:588-624](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L588-L624)

宿主DOM协议缺口为推导起点。

<details>
<summary>查看原文（37行）</summary>

```text
		function sidebarRoot() {
			if (typeof document === "undefined") return null;
			const region = document.querySelector(ANCHOR_SELECTOR);
			return region === null ? null : region.firstElementChild;
		}
		/** The list area inside the browser root (header stays outside it). */
		function listAreaOf(root) {
			for (const child of root.children) {
				if (typeof child.className === "string" && child.className.includes("listArea")) return child;
			}
			return null;
		}
		/**
		 * The rows' own scroll container: the element whose scoped class token ends
		 * in `list`. The pinned section goes in at its top so the two share one
		 * scroll region instead of the section squeezing the list's height.
		 */
		function scrollerOf(listArea) {
			for (const element of listArea.querySelectorAll("div")) {
				const className = element.className;
				if (typeof className !== "string") continue;
				for (const token of className.split(/\s+/u)) {
					if (/(^|_)list$/u.test(token)) return element;
				}
			}
			return null;
		}
		/** Whether the browser is collapsed to its rail (no list to mount into). */
		function isRail(root) {
			return typeof root.className === "string" && /(^|\s)[^\s]*rail(\s|$)/u.test(root.className);
		}
		/**
		 * The native browser keeps the pinned section out of the way while it shows
		 * search results, where a floating group on top would just cover them.
		 */
		function searchShowing(listArea) {
			return listArea.querySelector('[class*="searchResultRow"]') !== null;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:723-777](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L723-L777)

现有服务和slot组合显示替换边界。

<details>
<summary>查看原文（55行）</summary>

```text
		const inject = [
			"slots",
			"sessions",
			"workspaces",
			"uiWorkspace",
			"uiSession",
			"locale"
		];
		/**
		 * Register the sidebar section.
		 * @param ctx - Client root context.
		 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "@vfvrpq/dsh-pinned-sessions: dictionaries");
			const { sessions, workspaces, uiWorkspace, uiSession } = ctx;
			const face = () => ({
				sessionsStore: sessions.list,
				workspacesStore: workspaces.list,
				/**
				 * Live Session status, shared with the native rows: `running`,
				 * `pendingInteraction` and `completionUnread`. Reading the summary's
				 * own `running` flag is not enough — that snapshot keeps the value it
				 * loaded with, while later runs arrive as `api-session/status` events.
				 */
				statusStore: uiSession.sessionStatus,
				openSession: (sessionId) => {
					uiWorkspace.openSession(sessionId);
				},
				unpinSession: (sessionId) => {
					workspaces.unpinSession(sessionId).catch((reason) => {
						console.warn("@vfvrpq/dsh-pinned-sessions: unpin rejected:", reason);
					});
				}
			});
			/*
			 * `shell.overlay` is the always-mounted application surface seat; the
			 * component contributes no overlay content of its own — it only portals
			 * the section into the sidebar.
			 */
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "pinned-sessions-section",
				locale: NS,
				inject: face
			}, PinnedSectionMount));
			/*
			 * Settings → General carries the on/off switch, so turning the group off
			 * never means editing a config file by hand.
			 */
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "pinned-sessions",
				order: 30,
				locale: NS
			}, PinnedSettingsRow));
```

</details>

**依据 3 · 源码核查**：[lib/client.js:247-266](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/20044d963ce5d0a780915be97491b9d330285bf3/lib/client.js#L247-L266)

pin筛选与顺序可作验收条件。

<details>
<summary>查看原文（20行）</summary>

```text
		function pinnedSessionIds(sessions, workspaces) {
			const archived = new Set(workspaces.archivedSessionIds ?? []);
			const ids = [];
			for (const id of workspaces.pinnedSessionIds ?? []) {
				const summary = sessions.byId[id];
				if (summary === undefined || summary.origin === "subagent" || summary.blank || archived.has(id)) continue;
				ids.push(id);
			}
			return ids;
		}
		/** Pinned-but-archived sessions, which this section deliberately hides. */
		function archivedPinnedCount(sessions, workspaces) {
			const archived = new Set(workspaces.archivedSessionIds ?? []);
			let count = 0;
			for (const id of workspaces.pinnedSessionIds ?? []) {
				const summary = sessions.byId[id];
				if (summary === undefined || summary.origin === "subagent" || summary.blank) continue;
				if (archived.has(id)) count += 1;
			}
			return count;
```

</details>

#### 缺口

- 宿主专用slot方案及大量pin工作流对照尚未建立。
  **影响**：假设价值未验证，采用只能针对现有小范围流程。
  **进一步探讨**：先约定最小组数据与操作契约，对相同布局状态和升级样例比较。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
