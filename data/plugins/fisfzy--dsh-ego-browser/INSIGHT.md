# DSH Ego Browser

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[3df0641](https://github.com/Fisfzy/dsh-ego-browser/tree/3df0641046b28936d223e062fc26d18483823f87)

<!-- BEGIN META -->
[![GitHub ★ 343](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=343&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fisfzy/dsh-ego-browser) [![npm 30d 12,596](https://img.shields.io/static/v1?label=npm+30d&message=12%2C596&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ego-browser) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ego-browser)
<!-- END META -->

> **功能**：以宿主模型工具调用 vendored ego 浏览器运行时，提供会话目标追踪、实时观看和直接交互，并支持可选登录导入。

> **亮点**：结构动作、session目标、观看UI与resident传输异常/冷启动分类恢复集成，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：持久profile与space隔离不同，cookie回读非正确账户；HTTP guard只检查cookie存在，传输异常/冷启动分类不等业务无执行证明，未知执行状态/脚本权限仍需核，见 [Q02](#research-q02)。

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
  - [Q01 · 工具调用和实时观看是否真接到浏览器？](#detail-section-11)
  - [Q02 · 持久登录、会话space、HTTP与执行重试有什么边界？](#detail-section-12)
  - [Q03 · 如何有限试用，观看与自动化效果如何区分？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要Agent处理网页且用户观看/接管的DSH用户，正确动作仍需目标/后置条件验收，见 [Q01](#research-q01)。

直接Playwright/MCP/浏览器脚本+人工查看。当前增加宿主工具与观看整合，不自动识别正确业务行为。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 动作 | selector/坐标/脚本 | 真实网页副作用需验 |
| 观看 | sidebar/SSE | 可见非正确/低延迟保证 |
| space | session目标追踪 | 不等登录身份隔离 |
| 导入 | cookie到jar | 域/凭据/账户另核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配Host tools/subprocess/Node22 | 必需 | 工具执行 | 无法运行vendored CLI |
| Chrome/Chromium/运行环境 | 必需 | 页面自动化 | 权限/平台另核 |
| Web/sidebar/capture | 观看可选 | 实时帧/人机交互 | headless可仅工具 |
| profile/cookie/扩展或拷贝 | 登录可选 | 复用身份 | 域范围/账户和退出另管 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户独立profile/本地页 | 不导主账号cookie |
| 观察 | Agent snapshot/用户看流 | 核当前session/tab |
| 操作 | 结构工具/脚本 | 后置DOM/业务状态验证 |
| 失败 | 先查可能已执行 | 不盲重复点击提交 |
| 退出 | 停工具/浏览器/登录分管 | 检查profile/下载/桥残留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器/runtime未知 | 核路径/权限/Host/本地例 | 未实装 |
| 持续使用 | Chrome/帧编码/磁盘/token未知 | profile/网站/工具兼容 | 无延迟/节时实测 |
| 失败恢复 | 可能重复动作成本未知 | 进程/space/流/后置状态 | 传输分类不等执行确认 |
| 退出 | cookie/下载/扩展留存未知 | 注销/停浏览器/资料分管 | 关面板不等登出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工具/观看 | 注册/子进程/EventSource链 | 真实任务/延迟 |
| 恢复 | 特定传输异常/冷启动分类 | 全链未知结果无重复 |
| 登录 | cookie写后回读 | 正确账户/权限/网站接受 |

> **思考**：持久profile与space隔离不同，cookie回读非正确账户；HTTP guard只检查cookie存在，传输异常/冷启动分类不等业务无执行证明，未知执行状态/脚本权限仍需核，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：结构动作、session目标、观看UI与resident传输异常/冷启动分类恢复集成，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

[Q02](#research-q02) resident非特定异常不回退、CLI执行前CDP检查与target追踪值得借鉴，但均不证明业务动作未执行；persistent身份、session space和cookie存在guard不要混称隔离/认证。

<a id="detail-section-5"></a>

### 1.4 主要限制

持久profile与space隔离不同，cookie回读非正确账户；HTTP guard只检查cookie存在，传输异常/冷启动分类不等业务无执行证明，未知执行状态/脚本权限仍需核，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

本地无账户页+独立profile先测，登录/提交另审，不因可见画面放宽动作验证，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定Host工具/Client观看与代表恢复/登录代码已核，建议独立无账户本地页面有限试用，未运行目标。

- 已检查：作者 README、包清单、源码路径 lib/client.js、lib/index.js、package.json、runtime/ego-linux/bin/ego-browser.mjs、src/cast-server.ts、src/client/index.ts、src/config.ts、src/index.ts、src/login-import.ts、src/resident.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：四准备材料身份一致，catalog无旧研究；读package、Host注册/代表click/script/subprocess/resident恢复、Client真实sidebar/SSE、config/cast guard/login jar；补对已提交lib Host/Client关键链及默认vendored路径、resident两异常构造/die、CLI的CDP检查到runMain。未穷审全部动作/平台capture/扩展桥、vendored运行时，不执行浏览器或登录。
- 下一步：未跑测试/Chrome/Host；需本地页多tab/session/断流/超时与凭据退出失败矩阵，观看不替业务结果。

**分析版本**

- **仓库**：[Fisfzy/dsh-ego-browser](https://github.com/Fisfzy/dsh-ego-browser)
- **版本号**：0.9.6（[固定提交 3df0641](https://github.com/Fisfzy/dsh-ego-browser/tree/3df0641046b28936d223e062fc26d18483823f87)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

动作计划和目标/副作用/结果关联，显示未发/可能执行/已验证并测错tab与重复/恢复成本，未实现，见 [Q03](#research-q03)。

未跑测试/Chrome/Host；需本地页多tab/session/断流/超时与凭据退出失败矩阵，观看不替业务结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 18 | 12071 | 8779 | 2932 | — |
| .md | source | 21 | 3174 | — | — | 46521 |
| .js | source | 9 | 11540 | 10858 | 728 | — |
| .ts | source | 39 | 14047 | 11738 | 1856 | — |
| .ts | test | 46 | 5023 | 4276 | 337 | — |
| .cjs | example | 1 | 32 | 24 | 8 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/Fisfzy/dsh-ego-browser/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：结构工具、任务space和观看流能否形成可核网页动作，凭据与未知结果边界如何？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工具调用和实时观看是否真接到浏览器？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

固定原生插件dsh-ego-browser0.9.6，Host需tools/subprocess，浏览器工具组注册后把参数变成vendored ego脚本，真实通过ctx.subprocess.spawn启动Node egoBin nodejs、stdin脚本。代表ego_click要求selector或坐标，包装器按调用session/space取得target pin和viewport再执行，结果回到模型；不是仅在README列工具。主场景是Agent做网页工作时用户能观看和接管，不替模型选择正确目标。

Client在具备原生sidebar服务时调用mountNativeSidebarTab，注册tab类型和sidebar.right.pane.tab组件；观看侧通过/api/ego/stream EventSource收帧。无Web/TUI服务时工具可独立注册，不将可选peer都当必装。相对直接Playwright脚本/MCP，它提供宿主结构工具、session目标追踪和观看UI整合；注册与帧到达不等点击正确或任务完成，本轮没有实际浏览器。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:2-6](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/package.json#L2-L6)

包身份版本/作者概述。

```text
  "name": "dsh-ego-browser",
  "version": "0.9.6",
  "description": "ego-browser (ego-lite) integration plugin for DSH: structured browser-automation tools (34 ego_*) that drive the vendored ego runtime through ctx.subprocess, plus a realtime watch panel (live SSE screencast + direct mouse interaction + download capture + human-verification notice). Web shell: native right sidebar tab (dsh-better-sidebar fallback; no floating panel). TUI hosts (optional services): settings page, activity status bar, text-only side panel. Login import: Chrome extension bridge (modern Chrome/Edge) or non-destructive profile copy. Headless hosts: tools-only. [0.1.2-rc.1: verified compatible with DSH v0.1.2-rc.1 and v0.1.3-alpha.1]",
  "type": "module",
  "main": "./lib/index.js",
```

**依据 2 · 源码核查**：[src/index.ts:68-68](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/index.ts#L68-L68)

Host tools/subprocess依赖。

```text
export const inject = ['tools', 'subprocess']
```

**依据 3 · 源码核查**：[src/index.ts:1509-1517](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/index.ts#L1509-L1517)

实际工具注册/生命周期。

```text
    const dispose = ctx.tools.register(tool) as unknown as () => void
    // Cordis lifecycle: unregister the tool when the plugin unmounts.
    ctx.effect?.(() => dispose)
  }
  registerEgoStatus(ctx, cfg, reg)
  registerAuthFlush(ctx, cfg, reg)
  registerLoginImport(ctx, cfg, reg)
  registerActionTools(ctx, cfg, reg)
  registerHelpAndDoctor(ctx, cfg, reg)
```

**依据 4 · 源码核查**：[src/index.ts:2166-2203](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/index.ts#L2166-L2203)

代表click输入校验。

<details>
<summary>查看原文（38行）</summary>

```text
      name: 'ego_click',
      description:
        'Click an element in the current page. Target with a CSS selector, an xpath=.../loc=.../ref=N value from ego_snapshot, or viewport coordinates.',
      parameters: {
        selector: {
          type: 'string',
          description:
            'CSS selector, xpath=..., loc=..., or ref=N from the snapshot. Required unless x/y are given.',
        },
        x: {
          type: 'number',
          description: 'Viewport x coordinate for a coordinate click.',
        },
        y: {
          type: 'number',
          description: 'Viewport y coordinate for a coordinate click.',
        },
        label: {
          type: 'string',
          description:
            'Short human label for the action, e.g. "click submit button".',
        },
        double: {
          type: 'boolean',
          description:
            'Double-click instead of single-click. Useful for opening files/rows or triggering dblclick handlers.',
        },
        space: spaceParam,
      },
      buildScript: (args) => {
        const sel = str(args.selector, '')
        const x = args.x as number | undefined
        const y = args.y as number | undefined
        if (sel === '' && !(typeof x === 'number' && typeof y === 'number')) {
          throw new Error(
            'ego_click: provide either `selector` (CSS/xpath/loc/ref from ego_snapshot) or both `x` and `y` viewport coordinates',
          )
        }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1346-1366](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/index.ts#L1346-L1366)

session/space target pin后执行。

<details>
<summary>查看原文（21行）</summary>

```text
          markEgoToolCall(sessionId)
          // Stale-space recovery (browser restart wiped the space table) is
          // handled inside runWithStaleSpaceRetry; the cold-start retry is one
          // level deeper.
          // The tab pin and the viewport are applied around buildScript only,
          // because both belong to the page tool that is about to run: the pin
          // is this space's remembered target, and the viewport must be applied
          // AFTER ensureRealTab() has switched to a tab (cdp has no session
          // before that). The script reports back the target it actually used.
          const spaceKey = scopedTargetKey(sessionId, str(args.space, cfg.defaultSpace))
          const buildScript = () => {
            pendingTargetPin = cfg.targetTracker.get(spaceKey)
            pendingViewport = cfg
            try {
              return opts.buildScript(args)
            } finally {
              pendingTargetPin = undefined
              pendingViewport = undefined
            }
          }
          const result = await runWithStaleSpaceRetry(ctx, cfg, exec, buildScript)
```

</details>

**依据 6 · 源码核查**：[src/index.ts:964-977](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/index.ts#L964-L977)

Node vendored CLI stdin脚本。

<details>
<summary>查看原文（14行）</summary>

```text
  let handle
  try {
    // User-configured extra ego-browser CLI args (settings field `egoCliArgs`).
    // Filtered against EGO_CLI_BLOCKED so a saved value with a mutually-
    // exclusive subcommand (--status/--stop/--help/...) cannot break every
    // ego_* call by exiting before the heredoc runs.
    const extraCliArgs = filterArgs(cfg.egoCliArgs ?? '', EGO_CLI_BLOCKED)
    handle = subprocess.spawn({
      // Run through the node interpreter so the vendored CLI needs no +x bit.
      argv: [process.execPath, cfg.egoBin, 'nodejs', ...extraCliArgs],
      cwd: process.cwd(),
      env: resolveEgoEnv(cfg),
      stdio: {
        stdin: { data: script },
```

</details>

**依据 7 · 源码核查**：[src/client/index.ts:1485-1492](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/client/index.ts#L1485-L1492)

实际调用native面板挂载。

```text
		if (typeof ctx.inject === 'function') {
			ctx.inject(['sidebarRight', 'sidebarRightTabs'], function (nativeCtx) {
				var sidebar = typeof nativeCtx.get === 'function' ? nativeCtx.get('sidebarRight') : undefined
				var tabs = typeof nativeCtx.get === 'function' ? nativeCtx.get('sidebarRightTabs') : undefined
				if (!sidebar || !tabs) return
				activatePanel(nativeCtx, 'native', function () { return mountNativeSidebarTab(nativeCtx, sidebar, tabs) })
			})
		}
```

**依据 8 · 源码核查**：[src/client/index.ts:3478-3503](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/client/index.ts#L3478-L3503)

真实tab类型/slot组件注册。

<details>
<summary>查看原文（26行）</summary>

```text
		function mountNativeSidebarTab(ctx, sidebar, tabs) {
			if (!sidebar || !tabs) return function () {}
			// Inject Tab CSS once (cleaned up on dispose)
			var styleEl = document.createElement('style')
			styleEl.textContent = TAB_CSS
			document.head.appendChild(styleEl)

			var disposeType = tabs.register({
				id: NATIVE_WATCH_ID,
				kind: NATIVE_WATCH_KIND,
				keepMounted: true,
				priority: 'extension',
				title: function () { return wt('title') },
				guide: [{
					id: 'ego-watch',
					order: 90,
					title: function () { return wt('title') },
					icon: EgoWatchIcon,
				}],
			})

			var disposeBody = ctx.slots.register({
				name: 'sidebar.right.pane.tab',
				key: NATIVE_WATCH_ID,
				inject: function () { return { ctx: ctx } },
			}, EgoNativeWatchBody)
```

</details>

**依据 9 · 源码核查**：[src/client/index.ts:2322-2332](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/client/index.ts#L2322-L2332)

EventSource收流。

<details>
<summary>查看原文（11行）</summary>

```text
			var self = this
			this.closeStream()
			try {
				this.sse = new EventSource('/api/ego/stream')
			} catch (e) { return }
			this.sse.addEventListener('frame', function (ev) {
				try {
					var m = JSON.parse(ev.data)
					if (!m || !m.targetId || !m.data) return
					if (Number.isFinite(m.vw) && Number.isFinite(m.vh)) {
						var cur = self.pageMeta.get(m.targetId) || { targetId: m.targetId }
```

</details>

**依据 10 · 源码核查**：[lib/index.js:4557-4557](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/lib/index.js#L4557-L4557)

实际main产物默认路径指向随包runtime/ego-linux/bin/ego-browser.mjs。

```text
const DEFAULT_EGO_BIN = fileURLToPath(new URL("../runtime/ego-linux/bin/ego-browser.mjs", import.meta.url));
```

**依据 11 · 源码核查**：[lib/index.js:5587-5597](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/lib/index.js#L5587-L5597)

已提交Host产物实际注册工具并挂cast。

<details>
<summary>查看原文（11行）</summary>

```text
		const dispose = ctx.tools.register(tool);
		ctx.effect?.(() => dispose);
	};
	registerEgoStatus(ctx, cfg, reg);
	registerAuthFlush(ctx, cfg, reg);
	registerLoginImport(ctx, cfg, reg);
	registerActionTools(ctx, cfg, reg);
	registerHelpAndDoctor(ctx, cfg, reg);
	ctx.inject?.(["webServer"], (wctx) => {
		try {
			initCastServer(wctx, cfg, bridge, ffmpegManager, () => openAgentWindow(ctx, cfg), (opts) => importLoginCookies(opts, { subprocess: ctx.subprocess }), () => residentDiagnostics(cfg));
```

</details>

**依据 12 · 源码核查**：[lib/index.js:5124-5135](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/lib/index.js#L5124-L5135)

已提交Host产物真实Node/egoBin/stdin脚本调用。

<details>
<summary>查看原文（12行）</summary>

```text
		const extraCliArgs = filterArgs(cfg.egoCliArgs ?? "", EGO_CLI_BLOCKED);
		handle = subprocess.spawn({
			argv: [
				process.execPath,
				cfg.egoBin,
				"nodejs",
				...extraCliArgs
			],
			cwd: process.cwd(),
			env: resolveEgoEnv(cfg),
			stdio: {
				stdin: { data: script },
```

</details>

**依据 13 · 源码核查**：[lib/client.js:2056-2062](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/lib/client.js#L2056-L2062)

已提交Client产物实际调用native sidebar挂载。

```text
			if (typeof ctx.inject === "function") ctx.inject(["sidebarRight", "sidebarRightTabs"], function(nativeCtx) {
				var sidebar = typeof nativeCtx.get === "function" ? nativeCtx.get("sidebarRight") : void 0;
				var tabs = typeof nativeCtx.get === "function" ? nativeCtx.get("sidebarRightTabs") : void 0;
				if (!sidebar || !tabs) return;
				activatePanel(nativeCtx, "native", function() {
					return mountNativeSidebarTab(nativeCtx, sidebar, tabs);
				});
```

**依据 14 · 源码核查**：[lib/client.js:2947-2958](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/lib/client.js#L2947-L2958)

已提交Client产物实际SSE和frame消费。

<details>
<summary>查看原文（12行）</summary>

```text
			if (this.disposed || frameRelayDisabled || this.sse) return;
			var self = this;
			this.closeStream();
			try {
				this.sse = new EventSource("/api/ego/stream");
			} catch (e) {
				return;
			}
			this.sse.addEventListener("frame", function(ev) {
				try {
					var m = JSON.parse(ev.data);
					if (!m || !m.targetId || !m.data) return;
```

</details>

#### 缺口

- 未独立运行Host/Chrome/截图流和动作结果，全部vendored实现未穷审。
  **影响**：只能确认工具/观看注册与子进程链，不能承诺当前Host兼容、帧实时性或网页任务成功。
  **进一步探讨**：独立测试profile先本地页面snapshot/click/fill，核当前session与target及DOM后置条件，再测面板/流断开。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 持久登录、会话space、HTTP与执行重试有什么边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

默认sessionScopedSpaces=true分任务space防串tab；isolateSpaces默认false保留磁盘登录，两者不同。用户显式space、兼容运行时与cookie导入仍需逐路核，不能把space名或target pin当登录账户/OS进程隔离。login-import支持空domains代表ALL cookies、dryRun；实际Storage.setCookies后readback按domain/name/path计命中，这只证cookie落入jar，不证目标网站账户正确、登录成功或没有多账户混用。

常驻执行器有两条不同的one-shot回退路径。异常路径只对ResidentNotRunningError回退：run在start后无活child时于write前抛该类型，或stdin.write同步抛错时转换该类型；超时、abort和进程error/exit经die拒绝pending为普通Error，catch直接返回失败。正常frame路径则在ok:false且错误匹配cold-start签名时执行重建/park并继续one-shot。vendored CLI确有在runMain前检测CDP已关并返回cold-start frame的分支。实现没有独立written标志或执行确认，错误类型和冷启动匹配不证明业务动作绝未执行；这些分类优点也不能提升为无重复执行保证。外层warmup/stale-space恢复和任意ego_script仍需核未知结果/真实动作影响。cast-server各路由guard检查dsh-auth-* cookie存在，不核其值；这是借SameSite cookie的来源围栏，不能写成独立强身份认证。网页点击/填表/脚本和登录导入是真实读写，观看面板/CAPTCHA提醒不等每个业务提交有确认门。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:269-276](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/config.ts#L269-L276)

持久profile与session space不同开关。

```text
    viewportHeight: finiteIn(config.viewportHeight, 0, 2160) ? config.viewportHeight : 0,
    deviceScaleFactor: finiteIn(config.deviceScaleFactor, 0, 4) ? config.deviceScaleFactor : 0,
    isolateSpaces: typeof config.isolateSpaces === 'boolean' ? config.isolateSpaces : config.isolateSpaces === 'true' || config.isolateSpaces === '1' || config.isolateSpaces === 1,
    // Default true: two sessions silently sharing one space was the root of
    // cross-session tab theft. Explicit opt-out keeps the old shared space.
    sessionScopedSpaces: typeof config.sessionScopedSpaces === 'boolean'
      ? config.sessionScopedSpaces
      : !(config.sessionScopedSpaces === 'false' || config.sessionScopedSpaces === '0' || config.sessionScopedSpaces === 0),
```

**依据 2 · 源码核查**：[src/login-import.ts:293-302](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/login-import.ts#L293-L302)

空域所有cookie、dryRun与源浏览器选项。

<details>
<summary>查看原文（10行）</summary>

```text
  /** Domain whitelist; empty/omitted = ALL cookies (prefer explicit domains). */
  domains?: string[]
  /** Source profile directory name (e.g. "Default"); default = first profile. */
  profile?: string
  /** Only report what would be imported; write nothing. */
  dryRun?: boolean
  /**
   * A running source browser holds an exclusive lock on its cookie store
   * (Windows). When true, gracefully close it (WM_CLOSE to the main process —
   * its windows/tabs restore on next launch), import, and report
```

</details>

**依据 3 · 源码核查**：[src/login-import.ts:595-605](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/login-import.ts#L595-L605)

写cookie后按key回读计数。

<details>
<summary>查看原文（11行）</summary>

```text
    // [#60] Server-side confirmation: write each jar, then read it back and
    // count what actually landed. A stale browser.json (dead or replaced agent
    // instance) otherwise reports success while the user's logins never arrive.
    const writeJar = async (contextId: string | undefined): Promise<number> => {
      const scoped = contextId === undefined ? {} : { browserContextId: contextId }
      for (let i = 0; i < params.length; i += BATCH) {
        await egoClient.call('Storage.setCookies', { cookies: params.slice(i, i + BATCH), ...scoped })
      }
      const back = (await egoClient.call('Storage.getCookies', scoped)) as { cookies?: CdpCookie[] }
      const have = new Set((back.cookies ?? []).map((c) => jarKey(c.domain, c.name, c.path)))
      return params.filter((p) => have.has(jarKey(p.domain, p.name, p.path))).length
```

</details>

**依据 4 · 源码核查**：[src/index.ts:904-953](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/index.ts#L904-L953)

正常cold-start frame回退与仅特定异常回退分开，非特定异常返回失败。

<details>
<summary>查看原文（50行）</summary>

```text
async function runEgoScript(subprocess: SubprocessService, script: string, exec: ExecLike, cfg: EgoRuntimeConfig, graceOverrideMs?: number): Promise<WarmupResult> {
  // Resident path (opt-in, issue #56). Only a request that was never written
  // falls back to the one-shot spawn below: once written, a retry could
  // double-execute a click/fill, so the resident reports the failure instead.
  if (cfg.residentExecutor && Date.now() >= residentCooldownUntil) {
    let transport: ResidentProcess | null = null
    try {
      transport = ensureResidentTransport(cfg)
    } catch {
      transport = null // spawn failed; the one-shot path below reports it
    }
    if (transport !== null) {
      try {
        const frame = await transport.run(script, {
          ...(exec.signal !== undefined ? { signal: exec.signal } : {}),
          ...(Number.isFinite(graceOverrideMs) && graceOverrideMs! > 0 ? { graceMs: graceOverrideMs! } : {}),
        })
        const result = residentFrameToResult(frame)
        if (result.ok) {
          residentConsecutiveFailures = 0
          residentParkReason = null
          return result
        }
        if (!isColdStartError(result.error ?? '')) return result
        // Cold-start failure: the script never reached the browser (dead CDP
        // channel, or a relaunch that has not settled). Safe to retry — park
        // the resident and let the one-shot path below (with its launch
        // retries) run this call. Three consecutive failures park it for good
        // (until the setting is toggled or the plugin restarts), so we stop
        // alternating park -> one-shot -> respawn (issue #73).
        const supervision = superviseResidentFailure(residentConsecutiveFailures, result.error ?? 'cold start')
        residentConsecutiveFailures = supervision.failures
        residentLastRebuildReason = `cold-start failure: ${result.error ?? 'unknown'}`
        if (supervision.parkReason !== null) {
          residentParkReason = supervision.parkReason
          residentCooldownUntil = Number.MAX_SAFE_INTEGER
        } else {
          residentCooldownUntil = Date.now() + 10_000
        }
        stopResidentTransport()
      } catch (err) {
        if (!(err instanceof ResidentNotRunningError)) {
          return {
            ok: false,
            error: err instanceof Error ? err.message : String(err),
            stdout: '',
            stderr: '',
          }
        }
        // not written → retry through the one-shot path
```

</details>

**依据 5 · 源码核查**：[src/resident.ts:122-126](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/resident.ts#L122-L126)

start后无活child在write前抛ResidentNotRunningError。

```text
  async run(script: string, { signal, graceMs }: { signal?: AbortSignal; graceMs?: number } = {}): Promise<ResidentFrame> {
    this.start()
    if (!this.alive || this.child === null) {
      throw new ResidentNotRunningError(this.deadReason ?? 'resident is not running')
    }
```

**依据 6 · 源码核查**：[src/resident.ts:130-169](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/resident.ts#L130-L169)

timeout/abort和同步stdin.write异常的真实分类；无独立written或执行确认。

<details>
<summary>查看原文（40行）</summary>

```text
    return await new Promise<ResidentFrame>((resolve, reject) => {
      let settled = false
      const timer = setTimeout(() => {
        // The script is still running inside the process; killing it is the
        // only way to guarantee it stops. The caller must NOT retry.
        this.die(`resident request timed out after ${timeoutMs}ms`)
      }, timeoutMs)
      const onAbort = (): void => {
        this.die('ego-browser tool aborted')
      }
      const finish = (fn: () => void): void => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        if (signal !== undefined) signal.removeEventListener('abort', onAbort)
        if (this.pending.get(id) === entry) this.pending.delete(id)
        fn()
      }
      const entry = {
        resolve: (frame: ResidentFrame) => finish(() => { this.touchIdle(); resolve(frame) }),
        reject: (error: Error) => finish(() => reject(error)),
      }
      this.pending.set(id, entry)
      if (signal !== undefined) {
        if (signal.aborted) {
          finish(() => reject(new Error('ego-browser tool aborted')))
          return
        }
        signal.addEventListener('abort', onAbort, { once: true })
      }
      try {
        child.stdin.write(`${JSON.stringify({ id, code: script })}\n`)
      } catch (error) {
        finish(() =>
          reject(
            new ResidentNotRunningError(
              `could not write to the resident process: ${(error as Error)?.message ?? String(error)}`,
            ),
          ),
        )
```

</details>

**依据 7 · 源码核查**：[src/resident.ts:230-248](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/resident.ts#L230-L248)

die拒绝pending使用普通Error。

<details>
<summary>查看原文（19行）</summary>

```text
  private die(reason: string): void {
    if (this.deadReason !== null) return
    this.deadReason = reason
    this.clearIdle()
    const child = this.child
    this.child = null
    try {
      child?.kill()
    } catch {
      // already gone
    }
    const pending = [...this.pending.values()]
    this.pending.clear()
    for (const entry of pending) {
      entry.reject(
        new Error(
          `${reason}${this.stderrText.trim() === '' ? '' : `: ${this.stderrText.trim().slice(-1_000)}`}`,
        ),
      )
```

</details>

**依据 8 · 源码核查**：[runtime/ego-linux/bin/ego-browser.mjs:448-469](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/runtime/ego-linux/bin/ego-browser.mjs#L448-L469)

CDP关闭先返回错误frame，runMain在其后调用。

<details>
<summary>查看原文（22行）</summary>

```text
      if (!shim.cdp.isOpen()) {
        writeLine({
          id,
          ok: false,
          error: "browser is not reachable: CDP channel is closed (the browser stopped)",
          stdout: "",
          stderr: "",
        });
        continue;
      }
      const snapshot = snapshotGlobals();
      const out = createCapture();
      const err = createCapture();

      let ok = true;
      let errorMessage;
      try {
        await runMain({
          argv: [],
          stdinText: String(request?.code ?? ""),
          stdout: out.sink,
          stderr: err.sink,
```

</details>

**依据 9 · 源码核查**：[lib/index.js:5097-5113](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/lib/index.js#L5097-L5113)

已提交产物保留正常coldframe与异常catch两路径。

<details>
<summary>查看原文（17行）</summary>

```text
			if (!isColdStartError(result.error ?? "")) return result;
			const supervision = superviseResidentFailure(residentConsecutiveFailures, result.error ?? "cold start");
			residentConsecutiveFailures = supervision.failures;
			residentLastRebuildReason = `cold-start failure: ${result.error ?? "unknown"}`;
			if (supervision.parkReason !== null) {
				residentParkReason = supervision.parkReason;
				residentCooldownUntil = Number.MAX_SAFE_INTEGER;
			} else residentCooldownUntil = Date.now() + 1e4;
			stopResidentTransport();
		} catch (err) {
			if (!(err instanceof ResidentNotRunningError)) return {
				ok: false,
				error: err instanceof Error ? err.message : String(err),
				stdout: "",
				stderr: ""
			};
		}
```

</details>

**依据 10 · 源码核查**：[src/index.ts:659-670](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/index.ts#L659-L670)

外层stale-space重试。

<details>
<summary>查看原文（12行）</summary>

```text
export async function runWithStaleSpaceRetry(  ctx: EgoContext,
  cfg: EgoRuntimeConfig,
  exec: ExecLike,
  buildScript: () => string,
  graceOverrideMs?: number,
): Promise<WarmupResult> {
  let result = await withWarmupRetry(() => runEgoScript(ctx.subprocess, buildScript(), exec, cfg, graceOverrideMs))
  if (!result.ok && /task space not found: \d+/.test(result.error ?? '')) {
    cfg.spaceTracker.resetToName()
    result = await withWarmupRetry(() => runEgoScript(ctx.subprocess, buildScript(), exec, cfg, graceOverrideMs))
  }
  if (!result.ok && isColdStartError(result.error ?? '')) cfg.onColdStartFailure?.()
```

</details>

**依据 11 · 源码核查**：[src/index.ts:3010-3018](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/index.ts#L3010-L3018)

raw script直接拼入执行。

```text
        execute: async (args: Record<string, unknown>, exec: ToolExec) => {
          const sessionId = callingSessionId(exec)
          pendingSessionId = sessionId
          try {
            markEgoToolCall(sessionId)
            const result = await runWithStaleSpaceRetry(ctx, cfg, exec, () =>
              rawScriptPrelude(cfg, str(args.tab, '')) + str(args.script, ''),
            )
            if (!result.ok) throw new Error(result.error)
```

**依据 12 · 源码核查**：[src/cast-server.ts:391-409](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/cast-server.ts#L391-L409)

cookie存在性guard非值验证。

<details>
<summary>查看原文（19行）</summary>

```text
  // Exact-path routes match BEFORE the host's `/api` prefix trust-fence route,
  // so every handler below would otherwise answer unauthenticated requests.
  // The host issues a `dsh-auth-<processKey>` cookie that is HttpOnly AND
  // SameSite=Strict: a cross-site page (CSRF driver-by) never carries it, so
  // requiring its mere presence closes the remote surface. A local process can
  // still forge the header, but that is the same threat tier as the host's own
  // token fence (a local process can read the process token too).
  const isTrustedRequest = (req: IncomingMessage): boolean =>
    /(?:^|;\s*)dsh-auth-[^=]+=/.test(String(req.headers.cookie ?? ''))
  const guardHandler = (handler: NonNullable<RegisterRouteOptions['handler']>) =>
    async (req: unknown, resRaw: unknown) => {
      const res = resRaw as ServerResponse
      if (!isTrustedRequest(req as IncomingMessage)) {
        res.statusCode = 401
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end('{"ok":false,"error":"unauthorized"}')
        return
      }
      return handler(req, res)
```

</details>

#### 缺口

- 跨会话/多账户、cookie作用域、未知执行结果与完整HTTP/脚本权限未实测。
  **影响**：不能承诺space等于身份隔离、cookie落jar等于正确登录，或把ResidentNotRunningError/cold-start分类当业务未执行证明，网络/工具失败后仍需核状态。
  **进一步探讨**：只用测试身份和显式域dry-run，核jar/会话/当前tab，断流或超时先查页面后置状态；另审路由身份和危险业务确认。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何有限试用，观看与自动化效果如何区分？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议匹配Host/Node22+且有Chrome/Chromium的用户，先独立profile和本地无账户表单有限试用。首次需浏览器路径/运行环境、权限、工具调用与面板兼容；持续有Chrome/截图/编码/流CPU内存、本地profile和下载空间、模型token；导入登录会搬凭据、可能操作源浏览器，不能为省登录把主profile全部cookie默默带入。金额、帧延迟、节时和资源占用未实测。

失败要分浏览器进程/space/target/cast与动作状态；一旦点击可能已发生先观察后置状态，不能仅为恢复画面重做提交。退出工具/插件和浏览器持久profile/下载/扩展桥是不同对象；不要把面板关闭当退出账户。若只要少量重复脚本，直接Playwright或原生浏览器工具更简单。

可证伪方向是动作前后身份/目标/副作用计划与结果检查关联，统一呈现未发送、可能已执行、已验证，而不是用“画面还在”表示业务成功。沿现有target追踪、特定传输异常和冷启动错误分类，比较当前/直接脚本/状态计划版的错tab、重复动作、人工接管和恢复时间；无收益或提示打断太多则停止。当前已有部分基础，新闭环未实现。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:93-95](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/package.json#L93-L95)

Node22依赖。

```text
  "engines": {
    "node": ">=22"
  },
```

**依据 2 · 源码核查**：[src/index.ts:904-953](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/index.ts#L904-L953)

分类回退为恢复基础，不是已证发送/执行状态。

<details>
<summary>查看原文（50行）</summary>

```text
async function runEgoScript(subprocess: SubprocessService, script: string, exec: ExecLike, cfg: EgoRuntimeConfig, graceOverrideMs?: number): Promise<WarmupResult> {
  // Resident path (opt-in, issue #56). Only a request that was never written
  // falls back to the one-shot spawn below: once written, a retry could
  // double-execute a click/fill, so the resident reports the failure instead.
  if (cfg.residentExecutor && Date.now() >= residentCooldownUntil) {
    let transport: ResidentProcess | null = null
    try {
      transport = ensureResidentTransport(cfg)
    } catch {
      transport = null // spawn failed; the one-shot path below reports it
    }
    if (transport !== null) {
      try {
        const frame = await transport.run(script, {
          ...(exec.signal !== undefined ? { signal: exec.signal } : {}),
          ...(Number.isFinite(graceOverrideMs) && graceOverrideMs! > 0 ? { graceMs: graceOverrideMs! } : {}),
        })
        const result = residentFrameToResult(frame)
        if (result.ok) {
          residentConsecutiveFailures = 0
          residentParkReason = null
          return result
        }
        if (!isColdStartError(result.error ?? '')) return result
        // Cold-start failure: the script never reached the browser (dead CDP
        // channel, or a relaunch that has not settled). Safe to retry — park
        // the resident and let the one-shot path below (with its launch
        // retries) run this call. Three consecutive failures park it for good
        // (until the setting is toggled or the plugin restarts), so we stop
        // alternating park -> one-shot -> respawn (issue #73).
        const supervision = superviseResidentFailure(residentConsecutiveFailures, result.error ?? 'cold start')
        residentConsecutiveFailures = supervision.failures
        residentLastRebuildReason = `cold-start failure: ${result.error ?? 'unknown'}`
        if (supervision.parkReason !== null) {
          residentParkReason = supervision.parkReason
          residentCooldownUntil = Number.MAX_SAFE_INTEGER
        } else {
          residentCooldownUntil = Date.now() + 10_000
        }
        stopResidentTransport()
      } catch (err) {
        if (!(err instanceof ResidentNotRunningError)) {
          return {
            ok: false,
            error: err instanceof Error ? err.message : String(err),
            stdout: '',
            stderr: '',
          }
        }
        // not written → retry through the one-shot path
```

</details>

**依据 3 · 源码核查**：[src/config.ts:269-276](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/config.ts#L269-L276)

profile/space维护成本。

```text
    viewportHeight: finiteIn(config.viewportHeight, 0, 2160) ? config.viewportHeight : 0,
    deviceScaleFactor: finiteIn(config.deviceScaleFactor, 0, 4) ? config.deviceScaleFactor : 0,
    isolateSpaces: typeof config.isolateSpaces === 'boolean' ? config.isolateSpaces : config.isolateSpaces === 'true' || config.isolateSpaces === '1' || config.isolateSpaces === 1,
    // Default true: two sessions silently sharing one space was the root of
    // cross-session tab theft. Explicit opt-out keeps the old shared space.
    sessionScopedSpaces: typeof config.sessionScopedSpaces === 'boolean'
      ? config.sessionScopedSpaces
      : !(config.sessionScopedSpaces === 'false' || config.sessionScopedSpaces === '0' || config.sessionScopedSpaces === 0),
```

**依据 4 · 源码核查**：[src/login-import.ts:293-302](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/login-import.ts#L293-L302)

导入范围/原浏览器副作用选项。

<details>
<summary>查看原文（10行）</summary>

```text
  /** Domain whitelist; empty/omitted = ALL cookies (prefer explicit domains). */
  domains?: string[]
  /** Source profile directory name (e.g. "Default"); default = first profile. */
  profile?: string
  /** Only report what would be imported; write nothing. */
  dryRun?: boolean
  /**
   * A running source browser holds an exclusive lock on its cookie store
   * (Windows). When true, gracefully close it (WM_CLOSE to the main process —
   * its windows/tabs restore on next launch), import, and report
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:2322-2332](https://github.com/Fisfzy/dsh-ego-browser/blob/3df0641046b28936d223e062fc26d18483823f87/src/client/index.ts#L2322-L2332)

流存在与动作验收不同。

<details>
<summary>查看原文（11行）</summary>

```text
			var self = this
			this.closeStream()
			try {
				this.sse = new EventSource('/api/ego/stream')
			} catch (e) { return }
			this.sse.addEventListener('frame', function (ev) {
				try {
					var m = JSON.parse(ev.data)
					if (!m || !m.targetId || !m.data) return
					if (Number.isFinite(m.vw) && Number.isFinite(m.vh)) {
						var cur = self.pageMeta.get(m.targetId) || { targetId: m.targetId }
```

</details>

#### 缺口

- 没有实际资源/延迟/业务动作与接管收益对照，退出凭据清理未验。
  **影响**：无法判断观看/工具便利是否抵消浏览器资源与凭据维护、接管和失败排查成本。
  **进一步探讨**：本地表单对照直接脚本，含多tab/并发session/断流/超时/卸载，核结果、凭据/下载残留与纠正时间。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
