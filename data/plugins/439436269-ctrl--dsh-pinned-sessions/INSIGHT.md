# dsh-pinned-sessions

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[e941456](https://github.com/439436269-ctrl/dsh-pinned-sessions/tree/e941456808def9a5b0854eceefe5539f357c53a2)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/439436269-ctrl/dsh-pinned-sessions) [![npm 30d 1,006](https://img.shields.io/static/v1?label=npm+30d&message=1%2C006&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@vfvrpq/dsh-pinned-sessions)
<!-- END META -->

> **功能**：在 DSH 侧栏聚合跨工作区的置顶会话，支持组内搜索、会话状态显示与归档。

> **亮点**：[Q01](#research-q01) 现有置顶关系和打开动作继续由宿主管理，插件在侧栏提供跨工作区的入口，减少逐个定位工作区的步骤。

> **主要限制**：[Q02](#research-q02) 分组依赖宿主列表的内部结构。启用开关后若选择器失配，用户可能看不到分组及原因。[Q03](#research-q03) 任务刷新失败可能保留上一次时钟，写操作拒绝只由插件记到控制台。

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
  - [Q01 · 跨工作区的置顶视图省掉哪些步骤？](#detail-section-11)
  - [Q02 · 插件怎样接入侧栏，什么情况下显示不出来？](#detail-section-12)
  - [Q03 · 两处会话行共享哪些状态，可能在哪里失去一致性？](#detail-section-13)
  - [Q04 · 哪类用户适合试用，如何验收和退出？](#detail-section-14)
  - [Q05 · 是否值得补充挂载状态提示？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常在多个工作区继续重点会话的用户可从侧栏顶部直接查找目标。

作者描述的原生置顶按工作区呈现。用户也可展开原生列表或用原生搜索定位会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 置顶分组和标题搜索 | 在侧栏继续重点会话 | 依赖匹配的宿主布局，排除已归档和子代理会话 |
| 状态与任务标记 | 判断需要关注的会话 | 任务服务可选，空闲时钟可能沿用上次读取 |
| 打开、归档及取消置顶 | 从聚合视图操作原生会话 | 交给宿主执行，写入拒绝由插件记录至控制台 |
| 通用设置开关 | 退回原生侧栏视图 | 本地存储决定偏好能否跨刷新保留 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 声明为 Node 22+、DSH 0.2.0-rc.1+ 的 Web 客户端组合 | 启动必需 | 加载双入口插件 | 需核对具体版本与服务，声明范围没有实测矩阵 |
| 匹配的工作区侧栏布局 | 分组显示必需 | 定位滚动容器 | 无匹配时可能不显示 |
| 任务目录服务 | 可选 | 为有活跃任务的空闲行显示时钟 | 缺失时不提供任务计数 |
| 浏览器本地存储 | 跨刷新保存偏好必需 | 保存启用和折叠状态 | 被拒绝时只能在当前页面保留选择 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选测试 profile 并确认宿主和包声明 | 已有跨工作区测试会话与原生置顶 |
| 加载 | 用户按作者入口接入包并刷新 | 正常展开时只有一个分组 |
| 核对 | 用户用组内搜索打开目标，检查状态与原生行 | 目标正确，写操作在两处显示一致 |
| 退出 | 用户在通用设置关闭分组 | 原生侧栏仍可使用，必要时由 profile 移除插件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 额外支出未知 | 接入与建立测试会话所需时间未知 | 须核对宿主版本和侧栏结构 |
| 持续使用 | DOM 观察和周期检查的实际开销未知 | 回访节时与升级后的复核时间未知 | 任务时钟可能保留旧快照 |
| 失败恢复 | 排障资源未知 | 先用原生列表核对，再检查设置和宿主控制台 | 关闭显示不会回滚已经发生的宿主动作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话回访 | 同组列出跨工作区可见置顶会话并按标题筛选 | 原生搜索对照的耗时和误选率 |
| 状态联动 | 读取宿主会话状态，写动作调用宿主接口 | 当前宿主在拒绝或重连时的可见反馈 |
| 退出 | 设置可卸下分组并保留原生导航入口 | 宿主升级后的恢复耗时 |

> **思考**：[Q02](#research-q02) 分组依赖宿主列表的内部结构。启用开关后若选择器失配，用户可能看不到分组及原因。[Q03](#research-q03) 任务刷新失败可能保留上一次时钟，写操作拒绝只由插件记到控制台。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 现有置顶关系和打开动作继续由宿主管理，插件在侧栏提供跨工作区的入口，减少逐个定位工作区的步骤。

[Q03](#research-q03) 任务目录以分组为单位读一次，epoch 阻止较慢旧请求覆盖新请求。当前失败策略保留此前快照，若借用该实现应明确过期状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 分组依赖宿主列表的内部结构。启用开关后若选择器失配，用户可能看不到分组及原因。[Q03](#research-q03) 任务刷新失败可能保留上一次时钟，写操作拒绝只由插件记到控制台。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用两个工作区里的测试会话检查查找与打开结果，再用可弃用会话核对归档和取消置顶。状态不一致时以原生行和宿主状态为准。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前固定版本的导航、接线和状态分支有源码支持。挂载状态提示仍是待验证设计，当前宿主的兼容、异常表现和找回会话耗时待验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、CHANGELOG.md、VERIFY.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对固定 Git 版本的包清单、Host 入口、Web 接线、选择器和状态路径，并将作者记录按版本区分。本轮未安装或执行插件、自检、DSH 宿主或模型任务。
- 下一步：在相同会话和工作区条件下比较原生搜索与置顶查找，另以当前宿主验证选择器、键盘、拒绝写操作、任务读取失败和退出。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-pinned-sessions](https://github.com/439436269-ctrl/dsh-pinned-sessions)
- **版本号**：0.6.0（[固定提交 e941456](https://github.com/439436269-ctrl/dsh-pinned-sessions/tree/e941456808def9a5b0854eceefe5539f357c53a2)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在设置旁区分暂不可见与布局不兼容，可能帮助用户决定等待还是返回原生列表。可用搜索、收起和 DOM 更名场景比较判断时间及误报。

在相同会话和工作区条件下比较原生搜索与置顶查找，另以当前宿主验证选择器、键盘、拒绝写操作、任务读取失败和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1114 | — | — | 14256 |
| .js | source | 2 | 1063 | 766 | 298 | — |
| .mjs | test | 1 | 615 | 480 | 99 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/439436269-ctrl/dsh-pinned-sessions/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/439436269-ctrl/dsh-pinned-sessions/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/439436269-ctrl/dsh-pinned-sessions/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定 DSH 客户端组合中，反复切换工作区的用户能否更直接地找到并继续置顶会话，同时保留原有会话状态和退出路径？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨工作区的置顶视图省掉哪些步骤？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对频繁在多个工作区回到少量重点会话的人，这个分组将“先定位工作区、展开、找行”改成“在侧栏顶部查找或按标题过滤、点行”。原生基线来自作者对工作区内置顶排序的描述。源码确认新增入口使用宿主的置顶 ID 顺序，按会话摘要解析行，排除不存在、空白、子代理和已归档会话。行可以标明所属工作区，点开仍使用宿主的 openSession。查询按显示标题去首尾空格后不区分大小写做子串匹配，无法查正文或只记得路径的会话。单工作区、很少回访或已有原生搜索足以定位时，额外分组可能只占用视线。合格结果是正确打开目标会话，查找是否更快需要同任务对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-19](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/README.md#L12-L19)

作者给出的原生排序和重复查找基线。

```text
## What it does

DSH already pins sessions (hover a row → pin glyph, or right-click → 「置顶会话」),
but the result is only a re-order **inside that session's own workspace group**: a
pinned session still scrolls away when you switch workspaces, collapse groups, or
drown in a long list.

This plugin gives the pinned set its own group, above the Workspace browser:
```

**依据 2 · 源码核查**：[lib/client.js:377-396](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L377-L396)

直接按原生置顶列表筛选，保留顺序并单独计已归档的可识别会话。

<details>
<summary>查看原文（20行）</summary>

```text
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
		}
		/** Pinned-but-archived sessions, which this section deliberately hides. */
		function archivedPinnedCount(sessions, workspaces) {			const archived = new Set(workspaces.archivedSessionIds ?? []);
			let count = 0;
			for (const id of workspaces.pinnedSessionIds ?? []) {
				const summary = sessions.byId[id];
				if (summary === undefined || summary.origin === "subagent" || summary.blank) continue;
				if (archived.has(id)) count += 1;
			}
			return count;
```

</details>

**依据 3 · 源码核查**：[lib/client.js:413-423](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L413-L423)

按工作区成员关系解析显示名。

<details>
<summary>查看原文（11行）</summary>

```text
		function owningWorkspaceLabel(workspaces, sessionId, t) {
			for (const item of workspaces.items ?? []) {
				if (!Array.isArray(item.sessionIds) || !item.sessionIds.includes(sessionId)) continue;
				const title = String(item.title ?? "").trim();
				if (title === "default-workspace") return t("workspace.defaultName");
				if (title !== "") return title;
				const base = baseName(item.path);
				return base !== "" ? base : String(item.path ?? "");
			}
			return "";
		}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:475-494](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L475-L494)

标题及无标题回退、局部搜索范围。

<details>
<summary>查看原文（20行）</summary>

```text
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
		}
```

</details>

**依据 5 · 源码核查**：[lib/client.js:791-803](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L791-L803)

把实际渲染行接到打开和状态动作。

<details>
<summary>查看原文（13行）</summary>

```text
							rows.map((summary) => h(PinnedRow, {
								key: summary.id,
								summary,
								status: statusOf(statuses, summary.id),
								scheduleCount: scheduleCountOf(marks, summary.id),
								where: owningWorkspaceLabel(workspaces, summary.id, t),
								selected: summary.id === currentSessionId,
								pinned: (workspaces.pinnedSessionIds ?? []).includes(summary.id),
								t,
								onOpen: openSession,
								onPin: togglePin,
								onArchive: archiveSession
							}))
```

</details>

**依据 6 · 源码核查**：[lib/client.js:989-994](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L989-L994)

使用宿主打开入口。

```text
				statusStore: uiSession.sessionStatus,
				/** Active scheduled-task counts for every Session, from the Host catalog. */
				scheduleMarks,
				openSession: (sessionId) => {
					uiWorkspace.openSession(sessionId);
				},
```

#### 缺口

- 未独立比较当前原生搜索和分组在同一任务中的表现
  **影响**：只能判断少了显式的工作区展开步骤，节时和误选率未知
  **进一步探讨**：在相同工作区和会话集交替执行原生搜索与置顶查找，记录正确打开耗时和误选

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 插件怎样接入侧栏，什么情况下显示不出来？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

这是 DSH 原生插件的 Web 客户端扩展。包声明 bundle patch 与 Web client 导出，Host 入口的 apply 无行为，浏览器 apply 注册 shell.overlay 和通用设置项。组件借 overlay 获得生命周期，从工作区插槽的第一个子元素定位 listArea，再扫描 class token 以 list 结尾的 div，将自己的节点插在滚动列表首位并用 React portal 渲染。README 挂载章节说是插槽前的兄弟节点，与此版本实现冲突。找不到目标、rail 模式或出现 searchResultRow 时移除节点。搜索隐藏依赖找到结果行，所以不能把无结果搜索也写成必然隐藏。组件用 MutationObserver 和 1.5 秒重新定位，卸载时清理计时器、观察器和节点。无需复制宿主整棵树，但选择器是布局约定，宿主更名或容器形态变化可让启用的分组无声消失，也可能匹配错误节点。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:32-41](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/package.json#L32-L41)

入口导出和补丁路径。

<details>
<summary>查看原文（10行）</summary>

```text
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:57-73](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/package.json#L57-L73)

声明 DSH bundle 和 Web client。

<details>
<summary>查看原文（17行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-primitives",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-session",
        "@deepseek-ai/dsh-client-ui-workspace",
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-api-workspace-controller"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:12-18](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/index.js#L12-L18)

Host apply 的函数体为空。

```text
 * The Host half still has to exist: a Loader row is a Node module, and the
 * client-modules node half resolves this package to find its browser bundle.
 */
/** Host plugin body — pinned sessions is a browser-only surface. */
function apply() {}

export { apply };
```

**依据 4 · 作者声明**：[README.md:105-117](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/README.md#L105-L117)

作者描述的兄弟节点形态与当前源码不一致。

<details>
<summary>查看原文（13行）</summary>

```text
Shadowing `sidebar.workspaces` would mean reimplementing the entire browser
(search, flat/grouped views, drag ordering, menus, hover cards, archive flow), so
instead this plugin mounts **next to the renderer's own outlet anchor**
(`div[data-slot="sidebar.workspaces"]`, `display: contents`) as its previous
sibling inside the region, and portals the group into that host node:

- nothing is ever inserted into the native component's DOM subtree;
- the host node is `flex: none`, so the native browser keeps `flex: 1` and simply
  gets a little less height — the pinned group stays put while the list scrolls;
- the anchor is re-resolved through a throttled `MutationObserver`, so the group
  survives re-renders and sidebar collapse/expand;
- if the anchor ever disappears (a future DSH changes the sidebar), the plugin
  renders nothing instead of breaking anything.
```

</details>

**依据 5 · 源码核查**：[lib/client.js:811-852](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L811-L852)

依赖插槽及内部 CSS class 识别位置、收起和有结果的搜索。

<details>
<summary>查看原文（42行）</summary>

```text
		const ANCHOR_SELECTOR = 'div[data-slot="sidebar.workspaces"]';
		/** Belt-and-braces revalidation interval; the observer alone can miss a swap. */
		const RECONCILE_MS = 1500;
		/** The native browser root rendered by the `sidebar.workspaces` occupant. */
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
		}
```

</details>

**依据 6 · 源码核查**：[lib/client.js:883-924](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L883-L924)

插入列表首位、周期重查、清理与 portal。

<details>
<summary>查看原文（42行）</summary>

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
				};
			}, [active]);
			return host;
		}
		/** Sidebar section: mounts into the list, or nothing while switched off. */
		function PinnedSectionMount(props) {
			const enabled = react.useSyncExternalStore(enabledSource.subscribe, enabledSource.getSnapshot, enabledSource.getSnapshot);
			const host = useListScrollerHost(enabled);
			if (host === null) return null;
			return reactDom.createPortal(h(PinnedSection, props), host);
		}
```

</details>

**依据 7 · 源码核查**：[lib/client.js:1016-1036](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L1016-L1036)

注册入口与设置。

<details>
<summary>查看原文（21行）</summary>

```text
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

#### 缺口

- 未验证宿主升级后的 DOM 选择器和零结果搜索表现
  **影响**：无法将声明的 DSH 版本范围当兼容矩阵
  **进一步探讨**：在候选宿主比较展开、收起、搜索无结果、列表替换及卸载下的实际挂载位置

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 两处会话行共享哪些状态，可能在哪里失去一致性？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

分组订阅 sessions.list、workspaces.list 和 uiSession.sessionStatus。它按待交互、运行、完成未读的顺序渲染状态点，缺少单条状态时才从摘要推断运行。选择态从当前会话摘要的 retainedBy.mainView 推导。归档和取消置顶交回宿主的 workspaces 方法，Promise 拒绝只记控制台，插件未提供可见的失败提示。归档会改变原生会话状态，不能把它当成只隐藏此行。

时钟来自可选的 remote.schedule.catalog，统计 active 任务且仅在空闲行显示。分组首次订阅时读取，收到目录变化和连接重置重新读取，epoch 拒绝过期响应，无订阅时清理。目录接口缺失时没有计数，读取失败不会产生新快照。如果已有成功快照，失败分支直接返回，会保留上次计数，时钟有可能陈旧。时钟消失也可能是待审批或运行状态优先，因而不能用它单独判断是否有任务。作者 changelog 声明当前行样式及自检覆盖，早期 VERIFY 的实测环境只提供历史线索。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:434-439](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L434-L439)

当前选中项采用主视图保留引用。

```text
		function currentSessionOf(sessions) {
			for (const id of sessions.ids ?? []) {
				const summary = sessions.byId?.[id];
				if (summary !== undefined && (summary.retainedBy?.mainView ?? 0) > 0) return id;
			}
			return undefined;
```

**依据 2 · 源码核查**：[lib/client.js:457-473](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L457-L473)

待交互、运行、完成未读和空闲的优先序。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/client.js:304-346](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L304-L346)

刷新失败不清除快照，最后一个订阅释放时清除。

<details>
<summary>查看原文（43行）</summary>

```text
			const read = async () => {
				if (deps === undefined) return;
				const current = ++epoch;
				let result;
				try {
					result = await deps.list();
				} catch {
					return;
				}
				if (current !== epoch || listeners.size === 0 || deps === undefined) return;
				if (result === undefined || result === null || result.ok !== true) return;
				const counts = Object.create(null);
				for (const record of Array.isArray(result.value) ? result.value : []) {
					if (record === null || typeof record !== "object") continue;
					if (record.status !== "active" || typeof record.sessionId !== "string") continue;
					counts[record.sessionId] = (counts[record.sessionId] ?? 0) + 1;
				}
				publish(Object.freeze(counts));
			};
			const invalidate = () => {
				void read();
			};
			/** Follow the Remote invalidation only while something is watching. */
			const follow = () => {
				if (deps === undefined || disposers.length !== 0) return;
				disposers = [deps.subscribeChanged(invalidate), deps.subscribeReset(invalidate)];
				invalidate();
			};
			const release = () => {
				for (const dispose of disposers) dispose();
				disposers = [];
				epoch += 1;
				snapshot = EMPTY_SCHEDULE_MARKS;
			};
			return {
				getSnapshot: () => snapshot,
				subscribe: (listener) => {
					listeners.add(listener);
					if (listeners.size === 1) follow();
					return () => {
						listeners.delete(listener);
						if (listeners.size !== 0) return;
						release();
```

</details>

**依据 4 · 源码核查**：[lib/client.js:548-562](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L548-L562)

时钟仅在有任务且空闲时显示。

<details>
<summary>查看原文（15行）</summary>

```text
		function PinnedRow(props) {
			const { summary, status, scheduleCount, where, selected, pinned, t, onOpen, onPin, onArchive } = props;
			const label = rowLabel(summary, t);
			const view = statusView(status, summary, t);
			/**
			 * The leading 16px cell is exclusive, exactly like the native row: a live
			 * state (pending interaction, spinning run, unread completion) owns it and
			 * the scheduled-task clock never appears beside that dot. An idle row with
			 * an active task shows the same clock the native row shows further down.
			 */
			const scheduleText = scheduleCount === undefined || scheduleCount < 1 ? "" : t("row.schedule", { count: scheduleCount });
			const marksSchedule = view.state === "idle" && scheduleText !== "";
			/** A warning's compact label takes the timestamp's place, exactly like the native row. */
			const timeText = view.trailing ?? formatTime(summary.updatedAt, t);
			const timeTitle = formatTimeAgo(summary.updatedAt, t);
```

</details>

**依据 5 · 源码核查**：[lib/client.js:628-633](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L628-L633)

行按钮直接接收归档和置顶动作。

```text
				h(
					"span",
					{ className: "dshps_actions" },
					action("menu.archiveSession", primitives.IconArchiveOutlineRegular, "archive", () => onArchive?.(summary.id)),
					action(pinnedNow ? "menu.unpinSession" : "menu.pinSession", pinnedNow ? primitives.IconPinFillRegular : primitives.IconPinOutlineRegular, "pin", () => onPin?.(summary.id))
				)
```

**依据 6 · 源码核查**：[lib/client.js:972-1014](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L972-L1014)

可选任务服务接入、状态 store 与宿主写方法。

<details>
<summary>查看原文（43行）</summary>

```text
			const scheduleMarks = createScheduleMarks();
			if (typeof ctx.inject === "function") {
				ctx.inject(["remote", "remote.schedule"], (inner) => scheduleMarks.attach({
					list: () => inner.remote.schedule.catalog(),
					subscribeChanged: (listener) => inner.remote.$on("schedule/changed", listener),
					subscribeReset: (listener) => inner.on("connection/reset", listener)
				}));
			}
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
				/** Active scheduled-task counts for every Session, from the Host catalog. */
				scheduleMarks,
				openSession: (sessionId) => {
					uiWorkspace.openSession(sessionId);
				},
				/*
				 * The same pin/archive surface the native row's hover buttons call
				 * (`workspaces.pinSession` / `unpinSession` / `archiveSession`), so both
				 * rows perform one action with one implementation.
				 */
				pinSession: (sessionId) => {
					workspaces.pinSession(sessionId).catch((reason) => {
						console.warn("@vfvrpq/dsh-pinned-sessions: pin rejected:", reason);
					});
				},
				unpinSession: (sessionId) => {
					workspaces.unpinSession(sessionId).catch((reason) => {
						console.warn("@vfvrpq/dsh-pinned-sessions: unpin rejected:", reason);
					});
				},
				archiveSession: (sessionId) => {
					workspaces.archiveSession(sessionId).catch((reason) => {
						console.warn("@vfvrpq/dsh-pinned-sessions: archive rejected:", reason);
					});
				}
```

</details>

**依据 7 · 作者声明**：[CHANGELOG.md:6-26](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/CHANGELOG.md#L6-L26)

作者当前版本声明，不作本轮复验结果。

<details>
<summary>查看原文（21行）</summary>

```text
## 0.6.0 — 2026-11-05

The pinned rows carried fewer decorations than the native rows for the very same
Sessions: no pin marker, a single hover button, a long time label, and no
highlight on the open Session. Each one is now the native row's own element.

- **The rest-state pin marker** (`已置顶`) sits where the native `.pinIndicator`
  sits — 16×20, caption color, 6px leading gap — and hides under the hover
  actions, exactly like the native row.
- **Hover actions follow the native order and gap**: 归档会话 then 置顶/取消置顶,
  in a 15px-gap cluster (`sidebar.workspaces.session.row.action` is archive at
  order 100, pin at 200). Both call the same `workspaces` methods the native
  buttons call, so one action has one implementation.
- **The time span prints the native bare unit** (`23分钟`/`2天`, never `2 天前`);
  the row tooltip keeps the hover card's "ago" form. The bucket vocabulary is the
  native sidebar's, verbatim.
- **The open Session's row is highlighted** by the native rule
  (`retainedBy.mainView`), with `aria-selected` set the way the native row sets it.
- The self-check grew to 134 assertions: marker glyph/label, hover-action order and
  ARIA, per-action behaviour (archive, unpin), the compact labels, the ago-form
  tooltip, and the selected-row rule.
```

</details>

**依据 8 · 作者声明**：[VERIFY.md:63-76](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/VERIFY.md#L63-L76)

作者早期宿主验证记录针对旧挂载形态。

<details>
<summary>查看原文（14行）</summary>

```text
## 2. 真实 DSH Web 客户端端到端（Playwright 驱动）

临时 profile：`dsh pinnedverify --from-default-profile web --no-open --port 0`，Playwright 打开它
打印的 `http://127.0.0.1:<port>/?token=…`，操作真实数据（与桌面端共用同一份 `~/.dsh` 存储）；
验证后已删除该 profile。

| 断言 | 结果 |
| --- | --- |
| 分组渲染在侧栏、且位置正确 | ✅ `.dshps_host` 是 `div[data-slot="sidebar.workspaces"]` 的**前一个兄弟**、父节点就是同一个 region area；侧栏文本顺序为 插件 → **置顶 1 → 行** → 工作区 → 默认工作区 |
| 与原生行度量像素对齐 | ✅ 我的分组头/行盒 = 原生分组头/原生行盒（x=12、w=256、h=34/32），行标题 x 均为 40px |
| 点行打开会话 | ✅ 打开 `session-99808fba…`，分组留在侧栏不动 |
| 取消置顶 | ✅ 数量 1→0、行消失、出现空态提示「在会话行上点图钉即可置顶」；原生侧栏的置顶标记同时归零；`workspace.json` 的 `pinnedSessionIds` 变空 |
| 原生置顶 → 分组实时更新 | ✅ 点原生行操作「置顶会话」后，分组立刻回到「置顶 1 + 该行」，存储恢复为原始的单条置顶 |
| 折叠 + 跨刷新保留 | ✅ 点头部 → 行/提示消失、`aria-expanded=false`、`localStorage["dsh-pinned-sessions.collapsed"]="true"`；刷新后仍是收起态；再点即可展开 |
```

</details>

#### 缺口

- 无当前宿主的拒绝、连接故障和键盘操作结果
  **影响**：无法确认宿主是否有额外提示或交互冲突，时钟陈旧持续时长未知
  **进一步探讨**：以测试会话检查拒绝写入、先成功再刷新失败和重连，核对原生行、置顶行及控制台

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪类用户适合试用，如何验收和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

多工作区且反复回访已置顶会话的用户可在测试 profile 试用。选用有工作区、会话及相应 UI 服务的 Web 客户端，按包声明核对 Node 22+ 与 DSH 0.2.0-rc.1+，版本范围仍需用自己的组合验收。作者安装命令针对指定 profile，载入后检查只出现一个置顶区。准备两组测试会话，比较原生置顶顺序、搜索打开结果、两处取消置顶后的反馈，并用可弃用的会话核对归档。没有可选任务服务仍可用分组。设置开关只改浏览器显示偏好，存储被拒绝时该改动可以在当前页面生效，跨刷新不可保证。切回原生导航前先关闭开关，若包接线冲突则按 profile 的管理方式移除。退出后原生 pin 仍由宿主管理，已经执行的归档或取消置顶需要按宿主状态核查，关闭开关不会撤销。源码无独立远程应用服务，未测宿主资源、排障时长或用户节时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:123-132](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/README.md#L123-L132)

作者提供 profile 安装入口。

<details>
<summary>查看原文（10行）</summary>

````text
## Install

```sh
dsh plugin --profile <your-profile> add @vfvrpq/dsh-pinned-sessions
```

The package is dual-face (`dsh.bundle.patch` + `dsh.client`): the Loader row
brings up the no-op Host half, and the browser half arrives through
`exports["./client"]`.

````

</details>

**依据 2 · 源码核查**：[package.json:50-73](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/package.json#L50-L73)

包声明的版本和必需客户端依赖。

<details>
<summary>查看原文（24行）</summary>

```text
  "engines": {
    "node": ">=22",
    "dsh": ">=0.2.0-rc.1"
  },
  "devDependencies": {
    "react": "^18.3.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-primitives",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-session",
        "@deepseek-ai/dsh-client-ui-workspace",
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-api-workspace-controller"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:207-240](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L207-L240)

设置保存在浏览器，存储拒绝时保留内存状态。

<details>
<summary>查看原文（34行）</summary>

```text
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
			};
		})();
```

</details>

**依据 4 · 源码核查**：[lib/client.js:919-942](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L919-L942)

设置决定 portal 是否挂载。

<details>
<summary>查看原文（24行）</summary>

```text
		function PinnedSectionMount(props) {
			const enabled = react.useSyncExternalStore(enabledSource.subscribe, enabledSource.getSnapshot, enabledSource.getSnapshot);
			const host = useListScrollerHost(enabled);
			if (host === null) return null;
			return reactDom.createPortal(h(PinnedSection, props), host);
		}
		/** Settings → General row: the visibility switch for the sidebar section. */
		function PinnedSettingsRow(props) {
			const { t } = props;
			const enabled = react.useSyncExternalStore(enabledSource.subscribe, enabledSource.getSnapshot, enabledSource.getSnapshot);
			return h(
				"div",
				{ className: "dshps_setting", "data-testid": "pinned-sessions-setting" },
				h(
					"div",
					null,
					h("div", { className: "dshps_settingTitle" }, t("setting.title")),
					h("div", { className: "dshps_settingDesc" }, t("setting.description"))
				),
				h(primitives.Switch, {
					checked: enabled,
					label: t("setting.title"),
					onChange: (next) => enabledSource.set(next)
				})
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1000-1014](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L1000-L1014)

宿主写方法会产生状态变化，拒绝记录在控制台。

<details>
<summary>查看原文（15行）</summary>

```text
				pinSession: (sessionId) => {
					workspaces.pinSession(sessionId).catch((reason) => {
						console.warn("@vfvrpq/dsh-pinned-sessions: pin rejected:", reason);
					});
				},
				unpinSession: (sessionId) => {
					workspaces.unpinSession(sessionId).catch((reason) => {
						console.warn("@vfvrpq/dsh-pinned-sessions: unpin rejected:", reason);
					});
				},
				archiveSession: (sessionId) => {
					workspaces.archiveSession(sessionId).catch((reason) => {
						console.warn("@vfvrpq/dsh-pinned-sessions: archive rejected:", reason);
					});
				}
```

</details>

#### 缺口

- 没有指定宿主升级后的接入和排障时间
  **影响**：无法估算维护投入与回访收益之比
  **进一步探讨**：记录一次安装、升级与退出的操作耗时，并用小样本测一周回访的节时

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 是否值得补充挂载状态提示？

**研究主题**：新假设与验证

#### 完整回答

可以验证在通用设置的开关旁提示“已启用，当前侧栏无法挂载”是否减少误判。现有开关只读 enabledSource，挂载是否成功由局部 host 状态决定。增加提示的理由是启用后定位失败直接返回空，用户看不出是无置顶、临时收起、搜索结果占用还是选择器失配。先把 rail 与有结果搜索标作暂不可见，仅在稳定展开仍失配时提示并提供原生导航的退路。保留现有开关作对照，在正常布局、搜索、重绘和更名布局下让用户判断应等待、改配置还是切回原生，记录正确判断率、决策时间和短暂状态引发的误报。若错误归因或提示噪声增多，或排障时间未缩短，则不采纳。该提示是本研究的未验证设想。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:883-908](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L883-L908)

无法定位时清空挂载，搜索和 rail 也会触发同样分支。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:919-942](https://github.com/439436269-ctrl/dsh-pinned-sessions/blob/e941456808def9a5b0854eceefe5539f357c53a2/lib/client.js#L919-L942)

开关和挂载成败是不同状态，设置行只消费前者。

<details>
<summary>查看原文（24行）</summary>

```text
		function PinnedSectionMount(props) {
			const enabled = react.useSyncExternalStore(enabledSource.subscribe, enabledSource.getSnapshot, enabledSource.getSnapshot);
			const host = useListScrollerHost(enabled);
			if (host === null) return null;
			return reactDom.createPortal(h(PinnedSection, props), host);
		}
		/** Settings → General row: the visibility switch for the sidebar section. */
		function PinnedSettingsRow(props) {
			const { t } = props;
			const enabled = react.useSyncExternalStore(enabledSource.subscribe, enabledSource.getSnapshot, enabledSource.getSnapshot);
			return h(
				"div",
				{ className: "dshps_setting", "data-testid": "pinned-sessions-setting" },
				h(
					"div",
					null,
					h("div", { className: "dshps_settingTitle" }, t("setting.title")),
					h("div", { className: "dshps_settingDesc" }, t("setting.description"))
				),
				h(primitives.Switch, {
					checked: enabled,
					label: t("setting.title"),
					onChange: (next) => enabledSource.set(next)
				})
```

</details>

#### 缺口

- 没有用户对照与误报统计
  **影响**：提示的排障收益未知
  **进一步探讨**：在同一组故障和正常状态比较开关原样与提示版，测误判及决策时间

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
