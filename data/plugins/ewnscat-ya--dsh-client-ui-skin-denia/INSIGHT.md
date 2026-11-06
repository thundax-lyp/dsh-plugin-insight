# 达妮娅 · 虚无之泡

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[217a5cb](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/tree/217a5cbb6034917c0176f5bc0c6843855e9a7309)

<!-- BEGIN META -->
[![GitHub ★ 55](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=55&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia)
<!-- END META -->

> **功能**：为 DSH Web GUI 提供达妮娅主题、亮暗装饰与可保存的背景及调色板。

> **亮点**：具体角色素材与亮暗装饰、侧栏联动和持久化调色板；工程结构明确借鉴已有皮肤。见 [Q03](#research-q03)。

> **主要限制**：DOM清理选择器不符属性意图、异步写未全受生命周期管控，保存无CAS且失败仅日志；跨版本与读写效果未验。见 [Q02](#research-q02)。

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
  - [Q01 · 主题与调色板怎样改变界面并跨刷新保存？](#detail-section-11)
  - [Q02 · 持久化、网络、DOM适配和退出有哪些失败边界？](#detail-section-12)
  - [Q03 · 比默认配色增加什么，继承素材和维护成本如何归因？](#detail-section-13)
  - [Q04 · 当前怎样试用，哪个小改进值得先验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：偏好鸣潮角色主题的个人用户个性化本机DSH界面。见 [Q01](#research-q01)。

默认主题或简单CSS配色，优先保证正文/导航可读。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 亮暗装饰 | 角色主题显示 | 依赖Host DOM |
| 调色板 | 布局/动画开关 | 会有保存失败 |
| 背景导入 | 图像裁剪/压缩 | Host上限另限 |
| 持久化 | profile JSON恢复 | 无revision并发控制 |
| 版本提示 | 查GitHub release | 不自动安装 |
| 撤回 | 清主要自有资源 | 属性/异步缺口 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web/桌面客户端 | 必需 | ModuleLoader/DOM装饰 | 类名变化可局部失效 |
| client声明0.1.0-rc.6至0.2.0-rc.2 | 声明范围 | 作者适配 | 本次未运行核验 |
| Cordis ^4.0.1与webServer | 必需 | Host设置路由 | 无持久化入口 |
| 可写当前profile | 保存所需 | 背景/调色板JSON | 失败仅日志/400 |
| 本机loopback连接 | 路由所需 | 设置GET/PUT | 非本机403 |
| 外部选肤/互斥接线 | 按部署而定 | 避免皮肤叠加 | 本包元数据非完整管理器 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份profile、停其他皮肤 | 固定支持Host |
| 加载 | bundle两半并激活DOM/CSS | 核正文/侧栏/亮暗 |
| 调色 | 修改/导入背景防抖PUT | 查真实保存再刷新 |
| 重启 | GET恢复profile | 坏JSON回默认须辨别 |
| 退出 | 停用、核DOM和文件 | 在途写/残留另查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包/内嵌素材资源未知 | 备份、选肤与阅读核验 | 非模型能力 |
| 持续使用 | 动画/模糊/图片内存未知 | 跟Host DOM升级 | 自动GitHub版本查询 |
| 失败恢复 | 大图/文件保留未知 | 查日志、冲突及原配置 | 无CAS且失败可丢旧文件 |
| 退出 | profile背景继续保留 | 撤回检查/恢复默认 | 不保证全部异步已停 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 个性化 | 亮暗角色/装饰接线 | 真实美观和偏好收益 |
| 保存 | Host profile JSON | 大图/多标签与失败一致性 |
| 自适应 | DOM/resize检测 | 新Host稳定与帧率 |
| 退出 | 清理主要observer/DOM | 全属性/异步无残留 |
| 任务能力 | 未新增模型工具 | 不推断生产力提高 |

> **思考**：DOM清理选择器不符属性意图、异步写未全受生命周期管控，保存无CAS且失败仅日志；跨版本与读写效果未验。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：具体角色素材与亮暗装饰、侧栏联动和持久化调色板；工程结构明确借鉴已有皮肤。见 [Q03](#research-q03)。

部分原样式保存和timer registry可借鉴，撤回选择器/在途异步和保存失败必须统一。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

DOM清理选择器不符属性意图、异步写未全受生命周期管控，保存无CAS且失败仅日志；跨版本与读写效果未验。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

独立个人测试profile先备份，核亮暗/保存/重启/快速停用；正文受扰或保存失败就回默认。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定Host/Client显示与保存主链已核；未渲染、未运行兼容或性能验收。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/client.js、lib/index.js、package.json、skin.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整Host设置路由、Client入口/CSS插入、DOM监听、调色板读写/背景处理、版本请求及disposer；base64仅确认八素材字面量，不评价图像，未全审全部样式选择器，未运行目标。
- 下一步：隔离profile做快速切换/大图/双标签/写失败及阅读/帧率矩阵；均未执行。

**分析版本**

- **仓库**：[Ewnscat-ya/dsh-client-ui-skin-denia](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia)
- **版本号**：1.0.0（[固定提交 217a5cb](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/tree/217a5cbb6034917c0176f5bc0c6843855e9a7309)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先统一皮肤撤回与保存回执，再以快速开关/大图停用/双标签/写失败证伪；原生API足够则迁入。见 [Q04](#research-q04)。

隔离profile做快速切换/大图/双标签/写失败及阅读/帧率矩阵；均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2027 | 1667 | 287 | — |
| .md | source | 1 | 206 | — | — | 2785 |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：主题怎样注册、显示、保存并退出，实际失败与采用边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 主题与调色板怎样改变界面并跨刷新保存？

**研究主题**：场景与需求、功能与机制

#### 完整回答

这是面向偏好鸣潮达妮娅角色风格的 DSH Web/桌面界面皮肤，目标是个性化工作环境，不增加模型工具或任务执行能力。基线是默认主题/简单配色；合格结果首先是正文、工具结果和导航仍清楚可操作，再看角色和动画偏好。本项不作未渲染截图的审美评价。

bundle patch插入插件，Host注册调色板GET/PUT路由，客户端经__ModuleLoader__提供apply。CSS在模块工厂执行时插入，apply给body加主题属性、同步背景/标题/装饰并监听宿主DOM和尺寸；随data-ds-dark-theme切换亮暗。它直接依赖已有DOM类名，不是新Agent或原生跨版本主题API。skin.json提供身份/预览元数据，但当前包没有自行注册完整皮肤管理器；README所述选择/互斥还依赖外部宿主或管理脚本接线。

调色板修改CSS变量和角色/泡泡显示，350ms防抖PUT完整设置；背景用FileReader，非GIF按当时窗口比例裁剪、最长1920px并尝试JPEG压缩，GIF原样。Host按DSH_PROFILE_DIR优先、否则DSH_HOME/profiles/档案名落palette-settings.json，重启后GET读取；旧localStorage只作迁移。源文件确有八个内嵌data URI素材，不因preview目录缺失就称没有角色素材。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-7](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/cordis.patch.yml#L1-L7)

bundle插入入口。

```text
# denia skin bundle patch: inserts its public dsh.client entry into the web plugin roster.
# The bundle is the official dsh plugin shape — install it with
# `dsh plugin --profile <name> add <path-or-git-url>`; mutual exclusion between
# skins is managed by scripts/dsh-skin (home-layer disabled rows).
- insert:
    - id: ui-skin-denia
      name: '@dsh-external/dsh-client-ui-skin-denia'
```

**依据 2 · 源码核查**：[lib/index.js:29-45](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/index.js#L29-L45)

profile配置落点。

<details>
<summary>查看原文（17行）</summary>

```text
function profileName() {
	// Desktop host (0.2+) exposes the active profile as DSH_PROFILE; the old
	// DSH_DESKTOP_PROFILE name is kept as a fallback for third-party wrappers.
	const profile = process.env.DSH_PROFILE || process.env.DSH_DESKTOP_PROFILE;
	return profile && /^[A-Za-z0-9_-]+$/.test(profile) ? profile : "web";
}

function profileDir() {
	// DSH_PROFILE_DIR is authoritative when present: it already points at the
	// active profile even if its name fails the allowlist above.
	if (process.env.DSH_PROFILE_DIR) return process.env.DSH_PROFILE_DIR;
	return join(process.env.DSH_HOME || join(homedir(), ".dsh"), "profiles", profileName());
}

function settingsPath() {
	return join(profileDir(), "data", SETTINGS_DIR, SETTINGS_FILE);
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:155-173](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/index.js#L155-L173)

实际Host注册。

<details>
<summary>查看原文（19行）</summary>

```text
// SKIN_SYSTEM_CHROME_COLOR, which Electron's WCO follows on desktop.

function apply(ctx) {
	// A duplicated plugin entry (e.g. the package listed in the bundle array AND
	// inserted again by an agent-driven install) re-runs apply, and the second
	// route registration crashes the whole plugin ("duplicate exact route").
	// Warn instead: the first instance keeps serving the API.
	try {
		ctx.webServer.register({
			kind: "exact",
			path: SETTINGS_ROUTE,
			handler: handleSettingsRoute
		});
	} catch (error) {
		console.warn("[denia] palette settings route not registered (duplicate plugin instance?):", String((error && error.message) || error));
	}
}

export { apply, inject, name };
```

</details>

**依据 4 · 源码核查**：[lib/client.js:408-432](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/client.js#L408-L432)

样式插入与DOM选择器。

<details>
<summary>查看原文（25行）</summary>

```text

		var tagId = "@dsh-external/dsh-client-ui-skin-denia/denia.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			var styleTag = document.createElement("style");
			styleTag.dataset.plugin = "@dsh-external/dsh-client-ui-skin-denia";
			styleTag.dataset.pluginCss = tagId;
			// data-skin-owner lets dispose() retract this sheet together with the chrome nodes.
			styleTag.dataset.skinOwner = SKIN_OWNER;
			styleTag.textContent = css;
			document.head.appendChild(styleTag);
		}

		// ═══════════════════════════════════════════════════════════════
		//  SELECTORS
		// ═══════════════════════════════════════════════════════════════

		var SIDEBAR_COLUMN_SELECTOR = ":is([data-pane='sidebar'], [class*='sidebarCol'])";
		var DETAILS_COLUMN_SELECTOR = "[class*='detailsCol']";
		// Desktop 0.2 renamed the right panel column: HASH_rightbarCol (dsh-client-ui-layout).
		var RIGHTBAR_COLUMN_SELECTOR = "[class*='rightbarCol']";
		// Desktop 0.2 draws an opaque titlebar-era fill on the layout frame itself
		// (html[data-windows-titlebar] .frame{background:var(--dsw-specific-sidebar-fill)}),
		// which sits above the body backdrop. The frame is the sidebar column's parent.
		var DESKTOP_FLAG_SELECTOR = "[data-windows-titlebar]";
		var BACKDROP_PROPERTIES = [
```

</details>

**依据 5 · 源码核查**：[lib/client.js:688-739](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/client.js#L688-L739)

apply/主题与原样式记录。

<details>
<summary>查看原文（52行）</summary>

```text

		function apply(ctx) {
			var body = document.body;
			var originalTitle = document.title;
			var themeColorMeta = null;
			var previousThemeColor = void 0;

			// --- Timer registry: every deferred callback dies with the skin ---
			// One-shot retries (mascot/theme-toggle re-decoration) used to survive
			// dispose() and re-attach decorations a few seconds after deactivation.
			var pendingTimers = [];
			var disposed = false;
			var safeTimeout = function(fn, delay) {
				var id = setTimeout(function() {
					var at = pendingTimers.indexOf(id);
					if (at >= 0) pendingTimers.splice(at, 1);
					if (!disposed) fn();
				}, delay);
				pendingTimers.push(id);
				return id;
			};

			// --- Theme color sync ---
			var syncSystemChrome = function() {
				var meta = document.head.querySelector("meta[name=\"theme-color\"]");
				if (meta === null) return;
				if (meta !== themeColorMeta) {
					themeColorMeta = meta;
					previousThemeColor = meta.content;
				}
				if (meta.content !== SKIN_SYSTEM_CHROME_COLOR) meta.content = SKIN_SYSTEM_CHROME_COLOR;
			};
			var themeColorObserver = new MutationObserver(syncSystemChrome);
			themeColorObserver.observe(document.head, {
				attributes: true,
				attributeFilter: ["content"],
				childList: true,
				subtree: true
			});
			syncSystemChrome();

			// --- Save previous body styles ---
			var previous = new Map();
			BACKDROP_PROPERTIES.forEach(function(prop) {
				previous.set(prop, body.style.getPropertyValue(prop));
			});

			// --- Activate skin body attribute ---
			body.dataset.dshDenia = "";

			// --- Backdrop: set body background-image inline (like maid-atelier) ---
			// --- Backdrop: body background-image with light scrim (miku pattern) ---
```

</details>

**依据 6 · 源码核查**：[lib/client.js:1375-1426](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/client.js#L1375-L1426)

保存读取和迁移。

<details>
<summary>查看原文（52行）</summary>

```text
			function writePaletteSettings() {
				paletteSaveTimer = null;
				if (!paletteDirty || typeof fetch === "undefined") return;
				paletteDirty = false;
				fetch(PALETTE_SETTINGS_URL, {
					method: "PUT",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ settings: palettePayload() })
				}).then(function(response) {
					if (!response.ok) throw new Error("HTTP " + response.status);
				}).catch(function(error) {
					paletteDirty = true;
					console.warn("[denia] palette settings save failed:", error.message || error);
				});
			}

			function savePaletteSettings() {
				paletteDirty = true;
				if (paletteSaveTimer !== null) clearTimeout(paletteSaveTimer);
				paletteSaveTimer = setTimeout(writePaletteSettings, 350);
			}

			function loadPaletteSettings() {
				if (typeof fetch === "undefined") return;
				fetch(PALETTE_SETTINGS_URL)
					.then(function(response) { return response.ok ? response.json() : null; })
					.then(function(data) {
						if (data && data.ok && data.settings && Object.keys(data.settings).length) {
							mergePaletteSettings(data.settings);
							applyPaletteSettings();
							refreshPalettePanel();
							return;
						}
						// One-time best-effort migration from the old per-origin localStorage key.
						try {
							var legacy = JSON.parse(localStorage.getItem(PALETTE_KEY) || "{}");
							if (legacy && Object.keys(legacy).length) {
								mergePaletteSettings(legacy);
								applyPaletteSettings();
								refreshPalettePanel();
								savePaletteSettings();
							}
						} catch (error) {}
					})
					.catch(function(error) { console.warn("[denia] palette settings load failed:", error.message || error); });
			}

			function createPalettePanel() {
				// Toggle button
				paletteToggle = document.createElement("button");
				paletteToggle.dataset.skinChrome = "palette-toggle";
				paletteToggle.dataset.skinOwner = SKIN_OWNER;
```

</details>

**依据 7 · 源码核查**：[lib/client.js:1517-1590](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/client.js#L1517-L1590)

用户背景处理。

<details>
<summary>查看原文（74行）</summary>

```text
				// Non-GIF imports are auto-compressed before saving: longest side capped
				// at 1920px, re-encoded as JPEG q0.85 (original kept if that comes out
				// larger). GIFs keep animation only when stored as-is, so they stay on
				// the strict 5MB limit; everything else may come in up to 20MB.
				function makeUpload(label, mode) {
					var row = document.createElement("div");
					row.className = "pp-row";
					var lab = document.createElement("label");
					lab.textContent = label;
					lab.style.flex = "1";
					var btn = document.createElement("label");
					btn.className = "pp-upload";
					btn.textContent = "上传";
					var input = document.createElement("input");
					input.type = "file";
					input.accept = "image/png,image/jpeg,image/webp,image/gif";
					input.addEventListener("change", function() {
						var file = input.files[0];
						if (!file) return;
						var isGif = /gif/i.test(file.type || "");
						var limit = isGif ? 5 * 1024 * 1024 : 20 * 1024 * 1024;
						if (file.size > limit) {
							console.warn("[denia] background image is larger than " + (limit / (1024 * 1024)) + "MB and was not saved");
							input.value = "";
							return;
						}
						var applyUri = function(uri) {
							if (mode === "light") { DENIA_PALACE_LIGHT = uri; }
							else { DENIA_PALACE_DARK = uri; }
							syncBackdrop();
							savePaletteSettings();
						};
						var reader = new FileReader();
						reader.onload = function() {
							var uri = reader.result;
							if (isGif) { applyUri(uri); return; }
							var img = new Image();
							img.onload = function() {
								try {
									// Cover-crop to the LIVE window ratio (WYSIWYG): imported art
									// rarely matches the viewport, and cover-on-display would
									// re-crop unpredictably. Center-crop to the current window
									// aspect here, then cap the longest side at 1920px.
									var targetRatio = window.innerWidth / Math.max(1, window.innerHeight);
									var imgW = img.naturalWidth;
									var imgH = img.naturalHeight;
									var imgRatio = imgW / Math.max(1, imgH);
									var cropW, cropH;
									if (imgRatio > targetRatio) {
										cropH = imgH;
										cropW = Math.round(imgH * targetRatio);
									} else {
										cropW = imgW;
										cropH = Math.round(imgW / targetRatio);
									}
									var cx = Math.floor((imgW - cropW) / 2);
									var cy = Math.floor((imgH - cropH) / 2);
									var scale = Math.min(1, 1920 / Math.max(cropW, cropH));
									var w = Math.max(1, Math.round(cropW * scale));
									var h = Math.max(1, Math.round(cropH * scale));
									var canvas = document.createElement("canvas");
									canvas.width = w;
									canvas.height = h;
									canvas.getContext("2d").drawImage(img, cx, cy, cropW, cropH, 0, 0, w, h);
									var jpeg = canvas.toDataURL("image/jpeg", 0.85);
									applyUri(jpeg.length < uri.length ? jpeg : uri);
								} catch (e) {
									console.warn("[denia] background compression failed, keeping original:", e);
									applyUri(uri);
								}
							};
							img.onerror = function() { applyUri(uri); };
							img.src = uri;
						};
```

</details>

**依据 8 · 源码核查**：[skin.json:17-29](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/skin.json#L17-L29)

元数据而非注册器。

<details>
<summary>查看原文（13行）</summary>

```text
  "accent": "#9B6BD8",
  "bodyAttr": "data-dsh-denia",
  "package": "@dsh-external/dsh-client-ui-skin-denia",
  "wiring": {
    "id": "ui-skin-denia",
    "bundleWired": false
  },
  "preview": {
    "light": "preview/light.webp",
    "dark": "preview/dark.webp"
  },
  "order": 8
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 持久化、网络、DOM适配和退出有哪些失败边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Host只接受socket远端为loopback的设置请求，其他来源403；路由代码未自行验证用户token或Origin，是否还有上层Host防护未核，不能称完整认证。背景Host端只校验data:image前缀和7MiB字符串上限，并不解码图片。客户端20MiB非GIF即使被接受，压缩失败/变大保留原图后仍可能超Host限制；显示预览成功不等于持久化成功。请求总上限15MiB，两张背景和JSON也要合计考虑。

写文件用.tmp和rename；第一次rename失败会先删原文件再重试，因此第二次也失败时不能承诺原配置还在。读坏JSON默默回空设置；前端保存失败只console.warn并标dirty，没有revision/CAS，多个标签的完整设置写会最后写入覆盖。清浏览器存储不清Host背景，停皮肤也不删除profile文件。

清理确实断开多个observer、interval、resize事件并移除自有DOM/CSS，恢复部分原样式。然而staleAttrs.join生成的是data-denia-...标签选择器而非[data-denia-...]属性选择器，所以该扫尾不能按意图找到带属性的宿主节点；不是全部DOM写都已可靠撤回。paletteSaveTimer和在途fetch/FileReader未进disposed守卫，可能停用后仍保存/回调，未做运行重现。移除CSS后再次启用是否重跑模块工厂也需宿主生命周期验证。

客户端启动还向GitHub releases/latest检查版本，超时15秒、失败仅日志；只提示链接，不自动安装。素材为内嵌data URI，未见把自定义背景发往GitHub的此请求，但不应称完全离线。依赖类名匹配、动画/模糊、全树observer及周期检测会有兼容/资源负担，未测帧率和辅助阅读。仓库引用的preview文件和NOTICE在固定tracked范围缺失，README运行验证为作者报告，不是本次验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:47-81](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/index.js#L47-L81)

loopback与背景弱校验。

<details>
<summary>查看原文（35行）</summary>

```text
function isLoopback(req) {
	const address = req.socket && req.socket.remoteAddress;
	return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
}

function sendJson(res, status, value) {
	const data = Buffer.from(JSON.stringify(value), "utf8");
	res.writeHead(status, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-store",
		"content-length": String(data.length)
	});
	res.end(data);
}

function isBackground(value) {
	if (value === null) return true;
	return typeof value === "string" && /^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(value) && Buffer.byteLength(value, "utf8") <= MAX_BACKGROUND_BYTES;
}

function sanitizeSettings(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const clean = {};
	for (const key of BOOLEAN_KEYS) {
		if (typeof value[key] === "boolean") clean[key] = value[key];
	}
	for (const [key, range] of Object.entries(NUMBER_RANGES)) {
		if (typeof value[key] !== "number" || !Number.isFinite(value[key]) || value[key] < range[0] || value[key] > range[1]) continue;
		clean[key] = value[key];
	}
	for (const key of ["lightBackground", "darkBackground"]) {
		if (isBackground(value[key])) clean[key] = value[key];
	}
	return clean;
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:84-107](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/index.js#L84-L107)

读失败与非全原子的写恢复。

<details>
<summary>查看原文（24行）</summary>

```text
	const path = settingsPath();
	if (!existsSync(path)) return {};
	try {
		return sanitizeSettings(JSON.parse(readFileSync(path, "utf8"))) || {};
	} catch {
		return {};
	}
}

function writeSettings(settings) {
	const clean = sanitizeSettings(settings);
	if (clean === null) throw new Error("invalid settings");
	const path = settingsPath();
	const dir = join(profileDir(), "data", SETTINGS_DIR);
	mkdirSync(dir, { recursive: true });
	const temporary = path + ".tmp";
	writeFileSync(temporary, JSON.stringify(clean), "utf8");
	try { renameSync(temporary, path); } catch {
		rmSync(path, { force: true });
		renameSync(temporary, path);
	}
	return clean;
}

```

</details>

**依据 3 · 源码核查**：[lib/index.js:129-152](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/index.js#L129-L152)

GET/PUT及错误。

<details>
<summary>查看原文（24行）</summary>

```text
		res.end("forbidden");
		return;
	}
	if (req.method === "GET") {
		sendJson(res, 200, { ok: true, settings: readSettings() });
		return;
	}
	if (req.method !== "PUT") {
		res.writeHead(405, { allow: "GET, PUT" });
		res.end();
		return;
	}
	try {
		const parsed = JSON.parse(await readBody(req));
		const settings = writeSettings(parsed && parsed.settings);
		sendJson(res, 200, { ok: true, settings });
	} catch (error) {
		sendJson(res, 400, { ok: false, message: String((error && error.message) || error) });
	}
}

// ── Window Controls Overlay theming: resolved in v0.0.16 ──────────────────
// Probing (electron-probe.json) proved this plugin host is NOT the Electron
// main process (import("electron") lacks BrowserWindow), so runtime
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1375-1410](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/client.js#L1375-L1410)

console告警保存无CAS。

<details>
<summary>查看原文（36行）</summary>

```text
			function writePaletteSettings() {
				paletteSaveTimer = null;
				if (!paletteDirty || typeof fetch === "undefined") return;
				paletteDirty = false;
				fetch(PALETTE_SETTINGS_URL, {
					method: "PUT",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ settings: palettePayload() })
				}).then(function(response) {
					if (!response.ok) throw new Error("HTTP " + response.status);
				}).catch(function(error) {
					paletteDirty = true;
					console.warn("[denia] palette settings save failed:", error.message || error);
				});
			}

			function savePaletteSettings() {
				paletteDirty = true;
				if (paletteSaveTimer !== null) clearTimeout(paletteSaveTimer);
				paletteSaveTimer = setTimeout(writePaletteSettings, 350);
			}

			function loadPaletteSettings() {
				if (typeof fetch === "undefined") return;
				fetch(PALETTE_SETTINGS_URL)
					.then(function(response) { return response.ok ? response.json() : null; })
					.then(function(data) {
						if (data && data.ok && data.settings && Object.keys(data.settings).length) {
							mergePaletteSettings(data.settings);
							applyPaletteSettings();
							refreshPalettePanel();
							return;
						}
						// One-time best-effort migration from the old per-origin localStorage key.
						try {
							var legacy = JSON.parse(localStorage.getItem(PALETTE_KEY) || "{}");
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1796-1851](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/client.js#L1796-L1851)

disposer与错误属性选择器。

<details>
<summary>查看原文（56行）</summary>

```text
			// --- Dispose: retract every DOM and CSS write ---
			ctx.effect(function() {
				return function() {
					disposed = true;
					pendingTimers.forEach(function(id) { clearTimeout(id); });
					pendingTimers.length = 0;
					delete body.dataset.dshDenia;
					delete body.dataset.deniaComposerMotion;
					delete body.dataset.deniaSidebarCompact;
					delete body.dataset.deniaSidebarSize;
					delete body.dataset.deniaSessionPhase;
					if (heroOverlay && heroOverlay.isConnected) heroOverlay.remove();
					if (composerMotionTimer !== void 0) clearTimeout(composerMotionTimer);
					if (msgFrameTimer) clearTimeout(msgFrameTimer);
					if (detailsIntervalId) clearInterval(detailsIntervalId);
					window.removeEventListener("resize", syncOnResize);
					delete body.dataset.deniaMsgFrame;
					delete body.dataset.deniaMsgColor;
					delete body.dataset.deniaDetails;
					delete body.dataset.deniaDevtools;
					observer.disconnect();
					themeColorObserver.disconnect();
					if (msgFrameObserver) msgFrameObserver.disconnect();
					if (titlebarOverlay) titlebarOverlay.removeEventListener("geometrychange", syncWindowChrome);
					if (resizeObserver) resizeObserver.disconnect();
					if (frameEl) {
						if (framePreviousBackground !== null) frameEl.style.setProperty("background", framePreviousBackground);
						else frameEl.style.removeProperty("background");
						frameEl = null;
						framePreviousBackground = null;
					}
					previous.forEach(function(value, prop) {
						body.style.setProperty(prop, value);
					});
					document.querySelectorAll("[data-skin-owner='" + SKIN_OWNER + "']").forEach(function(el) {
						el.remove();
					});
					var staleAttrs = ["data-denia-sidebar-footer", "data-denia-workspace-group", "data-denia-workspace-row", "data-denia-workspace-active", "data-denia-session-row", "data-denia-session-flat", "data-denia-session-first", "data-denia-session-last", "data-denia-theme-label", "data-denia-msg", "data-denia-bubble", "data-denia-bubble-bg"];
					var staleSel = staleAttrs.join(",");
					document.querySelectorAll(staleSel).forEach(function(el) {
						staleAttrs.forEach(function(attr) {
							var key = attr.replace("data-", "").replace(/-([a-z])/g, function(m, c) { return c.toUpperCase(); });
							delete el.dataset[key];
						});
					});
					if (themeColorMeta && themeColorMeta.isConnected && themeColorMeta.content === SKIN_SYSTEM_CHROME_COLOR) {
						themeColorMeta.content = previousThemeColor || "";
					}
					if (document.title === SKIN_TITLE) document.title = originalTitle;
				};
			}, "ui-skin-denia: layered background, bubble field, character art, chain border, form transition, echo ripple, void erosion");
		}

		exports.apply = apply;
		return module.exports;
	}
```

</details>

**依据 6 · 源码核查**：[lib/client.js:1697-1731](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/client.js#L1697-L1731)

版本检查而非自动安装。

<details>
<summary>查看原文（35行）</summary>

```text
			// --- Version check (GitHub API, silent fail if blocked) ---
			var checkForUpdates = function() {
				var el = document.querySelector("[data-skin-chrome='palette-version']");
				if (!el || typeof fetch === "undefined") return;
				el.textContent = "当前版本 v" + SKIN_VERSION;
				var controller = new AbortController();
				var timeoutId = setTimeout(function() { controller.abort(); }, 15000);
				fetch("https://api.github.com/repos/" + SKIN_REPO + "/releases/latest", { signal: controller.signal })
					.then(function(r) { console.log("[denia] version check: HTTP " + r.status); return r.json(); })
					.then(function(data) {
						clearTimeout(timeoutId);
						if (data && data.tag_name) {
							var latest = data.tag_name.replace(/^v/, "");
							var a = latest.split("."), b = SKIN_VERSION.split(".");
							var newer = false;
							for (var i = 0; i < Math.max(a.length, b.length); i++) {
								var ai = parseInt(a[i]) || 0, bi = parseInt(b[i]) || 0;
								if (ai > bi) { newer = true; break; }
								if (ai < bi) break;
							}
							console.log("[denia] version check: latest=" + latest + " current=" + SKIN_VERSION + " newer=" + newer);
							if (newer) {
								el.textContent = "当前版本 v" + SKIN_VERSION + " ";
								var link = document.createElement("a");
								link.href = "https://github.com/" + SKIN_REPO + "/releases";
								link.target = "_blank";
								link.rel = "noopener noreferrer";
								link.style.cssText = "color:var(--denia-pink);text-decoration:none;font-weight:600";
								link.textContent = "✨ v" + latest + " 可用 →";
								el.append(link);
							}
						}
					})
					.catch(function(e) { clearTimeout(timeoutId); console.log("[denia] version check failed:", e.message || e); });
			};
```

</details>

**依据 7 · 源码核查**：[README.md:95-105](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/README.md#L95-L105)

兼容与运行验证作者主张。

<details>
<summary>查看原文（11行）</summary>

```text
## 兼容性

- DSH Web：0.1.0-rc.6 至 0.1.1-rc.2（dsh-web-frontend）
- DSH 官方桌面端：0.2.0-rc.2（Electron，bundle 方式挂载；v0.0.8 起适配，见更新日志）
- 平台：Web / 桌面端
- 最近验证日期：2026-10-08

## 更新日志
### v1.0.0 — 2026-10-08

**首个正式版。桌面端（DSH 0.2.0-rc.2）适配 + Web 版修复 + 背景图导入增强，合并 v0.0.8–v0.0.17 全部迭代；关键修复均经桌面端 DevTools 运行时取证验证。**
```

</details>

#### 缺口

- 固定Host生命周期、上层认证/CORS和停用异步回调未运行核验。
  **影响**：不能推断跨站请求已可利用，也不能承诺热切换完全恢复。
  **进一步探讨**：隔离profile核同/异源请求、快速停用、双标签写和再次启用，检查DOM/文件/网络。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 比默认配色增加什么，继承素材和维护成本如何归因？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

新增的是具体角色主题、亮暗素材/装饰、侧栏联动和可持久化调色板，不是可靠执行或更高模型智能。README明确借鉴maid-atelier的模块/舞台结构、miku的玻璃层与dsh-web-ui脚手架；本包的实现和角色视觉组合应与这些上游思路分开归因，不能把所有CSS/DOM方法当原创。

包private1.0.0，适合按固定源目录bundle安装；Cordis peer ^4.0.1，dsh.client声明0.1.0-rc.6至0.2.0-rc.2，README分别声称旧Web和桌面0.2.0-rc.2验证，本次未独立运行。需Host webServer、客户端ModuleLoader/DOM和可写当前profile。未见本插件新增模型调用或聊天内容外发，自动更新查询只是网络元数据；不能由此推断总内存/CPU为零。

首次要备份当前设置、确认包与选肤/互斥路径，持续需维护随Host DOM变化的选择器和大型内嵌素材，动态泡泡/模糊可能增加资源消耗；自定义背景压缩/保存失败需要查看控制台和profile文件。退出应停用并核DOM/在途写，历史profile背景另行清理。代码声明CC BY-NC-SA 4.0，角色原作权属和实现分列；NOTICE缺失使署名链不能仅依赖该引用，本次不提供可商用结论。

相对默认主题，个性化呈现没有改变任务供给、计价、计算资源池、服务交付责任或风险承担；经济创新未识别。审美偏好可能有使用价值，但不把它变成未经测量的生产力/ROI。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-36](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/package.json#L1-L36)

private版本/客户端范围/Cordis。

<details>
<summary>查看原文（36行）</summary>

```text
{
    "name":  "@dsh-external/dsh-client-ui-skin-denia",
    "description":  "Denia (Wuthering Waves) themed skin with bubble-and-chain ornaments and void-star palette for the dsh web GUI",
    "version":  "1.0.0",
    "private":  true,
    "type":  "module",
    "main":  "lib/index.js",
    "exports":  {
                    ".":  "./lib/index.js",
                    "./client":  "./lib/client.js",
                    "./skin.json":  "./skin.json",
                    "./package.json":  "./package.json"
                },
    "dsh":  {
                "bundle":  {
                               "patch":  "./cordis.patch.yml"
                           },
                "client":  {
                               "inject":  [

                                          ],
                               "platform":  "web",
                               "version":  "0.1.0-rc.6 - 0.2.0-rc.2"
                           }
            },
    "license":  "CC-BY-NC-SA-4.0",
    "peerDependencies":  {
                             "@deepseek-ai/cordis":  "^4.0.1"
                         },
    "files":  [
                  "lib/index.js",
                  "lib/client.js",
                  "cordis.patch.yml",
                  "skin.json",
                  "preview",
                  "LICENSE",
```

</details>

**依据 2 · 源码核查**：[README.md:27-35](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/README.md#L27-L35)

角色与实现归属。

```text
## 版权所有人

| 版权所有人 | 版权所有内容 |
|---|---|
| Kuro Games（库洛游戏） | 「鸣潮」游戏作品及达妮娅（Denia）角色形象原作 |
| Ewnscat | 皮肤覆盖层实现（CSS 配色、SVG 装饰、DOM 装饰逻辑） |

\*背景 / 角色 / 画框素材及预览截图来自用户本地素材库。本皮肤为同人创作，与 Kuro Games 无关联。

```

**依据 3 · 源码核查**：[README.md:190-206](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/README.md#L190-L206)

上游致谢与许可。

<details>
<summary>查看原文（17行）</summary>

```text
## 致谢

| 来源 | 说明 |
|---|---|
| [maid-atelier](https://github.com/Small-tailqwq/dsh-deep-whale)（Small-tailqwq） | 皮肤工程结构思路：模块加载工厂模式、内联背景同步、侧边栏伪元素装饰、工作区树标记逻辑、固定层角色舞台架构 |
| [dsh-client-ui-skin-miku](https://github.com/linxin6666)（@linxin6666） | 玻璃卡片层级方式：`[id=root]` backdrop-filter + scrim 遮罩模式 |
| [dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)（zhu1090093659） | 皮肤工程脚手架 |
| [@frewily](https://github.com/frewily) | 调色板默认折叠与 Q版竖直偏移范围优化 |
| [@1691695205](https://github.com/1691695205) | 消息文字配色开关及亮色/暗色消息配色规则优化 |

\*反馈问题尽可能在 issue 中发起。

## 许可

本仓库以 **CC BY-NC-SA 4.0**（署名-非商业性使用-相同方式共享）发布，禁止商业性使用。署名链见 `NOTICE`。

Character "Denia" (达妮娅) and "Wuthering Waves" (鸣潮) are trademarks of Kuro Games. This skin is a fan work and is not affiliated with or endorsed by Kuro Games.
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1170-1196](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/client.js#L1170-L1196)

DOM监听依赖。

<details>
<summary>查看原文（27行）</summary>

```text
			// --- Main MutationObserver ---
			var isSkinChrome = function(node) {
				return node instanceof Element && node.getAttribute("data-skin-owner") === SKIN_OWNER;
			};
			var observer = new MutationObserver(function(records) {
				var sidebarStructureChanged = false;
				var workspaceStateChanged = false;
				var backdropChanged = false;
				var composerChanged = false;
				var detailsChanged = false;
				for (var i = 0; i < records.length; i++) {
					var record = records[i];
					if (record.type === "attributes") {
						if (record.attributeName === "aria-expanded" || record.attributeName === "aria-selected") workspaceStateChanged = true;
						else if (record.attributeName === "data-ds-dark-theme") backdropChanged = true;
						else if (record.attributeName === "data-phase") composerChanged = true;
						continue;
					}
					// Only treat childList changes as sidebar/details changes if they're IN those columns
					var targetInSidebar = record.target instanceof Element && record.target.closest && record.target.closest(SIDEBAR_COLUMN_SELECTOR);
					var targetInDetails = record.target instanceof Element && record.target.closest && record.target.closest(DETAILS_COLUMN_SELECTOR);
					if (!targetInSidebar && !targetInDetails) continue;
					if (targetInDetails) { detailsChanged = true; continue; }
					var nodes = Array.from(record.addedNodes).concat(Array.from(record.removedNodes));
					for (var j = 0; j < nodes.length; j++) {
						if (nodes[j] instanceof Element && !isSkinChrome(nodes[j])) {
							sidebarStructureChanged = true;
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1697-1731](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/client.js#L1697-L1731)

网络目的边界。

<details>
<summary>查看原文（35行）</summary>

```text
			// --- Version check (GitHub API, silent fail if blocked) ---
			var checkForUpdates = function() {
				var el = document.querySelector("[data-skin-chrome='palette-version']");
				if (!el || typeof fetch === "undefined") return;
				el.textContent = "当前版本 v" + SKIN_VERSION;
				var controller = new AbortController();
				var timeoutId = setTimeout(function() { controller.abort(); }, 15000);
				fetch("https://api.github.com/repos/" + SKIN_REPO + "/releases/latest", { signal: controller.signal })
					.then(function(r) { console.log("[denia] version check: HTTP " + r.status); return r.json(); })
					.then(function(data) {
						clearTimeout(timeoutId);
						if (data && data.tag_name) {
							var latest = data.tag_name.replace(/^v/, "");
							var a = latest.split("."), b = SKIN_VERSION.split(".");
							var newer = false;
							for (var i = 0; i < Math.max(a.length, b.length); i++) {
								var ai = parseInt(a[i]) || 0, bi = parseInt(b[i]) || 0;
								if (ai > bi) { newer = true; break; }
								if (ai < bi) break;
							}
							console.log("[denia] version check: latest=" + latest + " current=" + SKIN_VERSION + " newer=" + newer);
							if (newer) {
								el.textContent = "当前版本 v" + SKIN_VERSION + " ";
								var link = document.createElement("a");
								link.href = "https://github.com/" + SKIN_REPO + "/releases";
								link.target = "_blank";
								link.rel = "noopener noreferrer";
								link.style.cssText = "color:var(--denia-pink);text-decoration:none;font-weight:600";
								link.textContent = "✨ v" + latest + " 可用 →";
								el.append(link);
							}
						}
					})
					.catch(function(e) { clearTimeout(timeoutId); console.log("[denia] version check failed:", e.message || e); });
			};
```

</details>

#### 缺口

- Host升级维护频率、性能代价和真实偏好收益未知。
  **影响**：无法判断装饰收益是否超过维护与阅读干扰。
  **进一步探讨**：同设备默认/主题比较长会话输入、正文定位、帧率和个人偏好。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前怎样试用，哪个小改进值得先验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可在已有支持宿主的个人非商业测试profile观察，先备份palette文件，禁用其他皮肤，用默认素材确认正文/导航与亮暗切换、保存/重启/停用。当前只观察而不建议直接生产采用：停用残留与保存回执不足会影响退路。若目标是专注工作、远程访问或无障碍阅读，默认主题是低负担替代；出现文本遮挡、资源占用或保存异常就停用恢复默认并检查profile残留。

最值得验证的是“可逆皮肤事务”：把所有样式/DOM/定时器/异步回调放在同一生命周期，保存显示真实成功/失败和revision，减少装饰无需覆盖持久化可靠性。依据是当前已记录部分原样式与disposed但未覆盖全部异步和属性清理。最小实验不新增视觉功能，反复快速开关、导入大图后停用、双标签改设置、强制第二次rename失败，比较残留节点/属性/文件变化与用户是否误认已保存。若宿主原生皮肤API已提供这些契约，应迁入该API；若个性化用户不需要持久化，可先只保留可撤销CSS而不增加事务层。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:699-708](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/client.js#L699-L708)

已有disposed定时器原语。

<details>
<summary>查看原文（10行）</summary>

```text
			var disposed = false;
			var safeTimeout = function(fn, delay) {
				var id = setTimeout(function() {
					var at = pendingTimers.indexOf(id);
					if (at >= 0) pendingTimers.splice(at, 1);
					if (!disposed) fn();
				}, delay);
				pendingTimers.push(id);
				return id;
			};
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1375-1395](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/client.js#L1375-L1395)

未确认式保存。

<details>
<summary>查看原文（21行）</summary>

```text
			function writePaletteSettings() {
				paletteSaveTimer = null;
				if (!paletteDirty || typeof fetch === "undefined") return;
				paletteDirty = false;
				fetch(PALETTE_SETTINGS_URL, {
					method: "PUT",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ settings: palettePayload() })
				}).then(function(response) {
					if (!response.ok) throw new Error("HTTP " + response.status);
				}).catch(function(error) {
					paletteDirty = true;
					console.warn("[denia] palette settings save failed:", error.message || error);
				});
			}

			function savePaletteSettings() {
				paletteDirty = true;
				if (paletteSaveTimer !== null) clearTimeout(paletteSaveTimer);
				paletteSaveTimer = setTimeout(writePaletteSettings, 350);
			}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1796-1851](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/client.js#L1796-L1851)

撤回不完整的机制依据。

<details>
<summary>查看原文（56行）</summary>

```text
			// --- Dispose: retract every DOM and CSS write ---
			ctx.effect(function() {
				return function() {
					disposed = true;
					pendingTimers.forEach(function(id) { clearTimeout(id); });
					pendingTimers.length = 0;
					delete body.dataset.dshDenia;
					delete body.dataset.deniaComposerMotion;
					delete body.dataset.deniaSidebarCompact;
					delete body.dataset.deniaSidebarSize;
					delete body.dataset.deniaSessionPhase;
					if (heroOverlay && heroOverlay.isConnected) heroOverlay.remove();
					if (composerMotionTimer !== void 0) clearTimeout(composerMotionTimer);
					if (msgFrameTimer) clearTimeout(msgFrameTimer);
					if (detailsIntervalId) clearInterval(detailsIntervalId);
					window.removeEventListener("resize", syncOnResize);
					delete body.dataset.deniaMsgFrame;
					delete body.dataset.deniaMsgColor;
					delete body.dataset.deniaDetails;
					delete body.dataset.deniaDevtools;
					observer.disconnect();
					themeColorObserver.disconnect();
					if (msgFrameObserver) msgFrameObserver.disconnect();
					if (titlebarOverlay) titlebarOverlay.removeEventListener("geometrychange", syncWindowChrome);
					if (resizeObserver) resizeObserver.disconnect();
					if (frameEl) {
						if (framePreviousBackground !== null) frameEl.style.setProperty("background", framePreviousBackground);
						else frameEl.style.removeProperty("background");
						frameEl = null;
						framePreviousBackground = null;
					}
					previous.forEach(function(value, prop) {
						body.style.setProperty(prop, value);
					});
					document.querySelectorAll("[data-skin-owner='" + SKIN_OWNER + "']").forEach(function(el) {
						el.remove();
					});
					var staleAttrs = ["data-denia-sidebar-footer", "data-denia-workspace-group", "data-denia-workspace-row", "data-denia-workspace-active", "data-denia-session-row", "data-denia-session-flat", "data-denia-session-first", "data-denia-session-last", "data-denia-theme-label", "data-denia-msg", "data-denia-bubble", "data-denia-bubble-bg"];
					var staleSel = staleAttrs.join(",");
					document.querySelectorAll(staleSel).forEach(function(el) {
						staleAttrs.forEach(function(attr) {
							var key = attr.replace("data-", "").replace(/-([a-z])/g, function(m, c) { return c.toUpperCase(); });
							delete el.dataset[key];
						});
					});
					if (themeColorMeta && themeColorMeta.isConnected && themeColorMeta.content === SKIN_SYSTEM_CHROME_COLOR) {
						themeColorMeta.content = previousThemeColor || "";
					}
					if (document.title === SKIN_TITLE) document.title = originalTitle;
				};
			}, "ui-skin-denia: layered background, bubble field, character art, chain border, form transition, echo ripple, void erosion");
		}

		exports.apply = apply;
		return module.exports;
	}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:94-107](https://github.com/Ewnscat-ya/dsh-client-ui-skin-denia/blob/217a5cbb6034917c0176f5bc0c6843855e9a7309/lib/index.js#L94-L107)

故障实验依据。

<details>
<summary>查看原文（14行）</summary>

```text
	const clean = sanitizeSettings(settings);
	if (clean === null) throw new Error("invalid settings");
	const path = settingsPath();
	const dir = join(profileDir(), "data", SETTINGS_DIR);
	mkdirSync(dir, { recursive: true });
	const temporary = path + ".tmp";
	writeFileSync(temporary, JSON.stringify(clean), "utf8");
	try { renameSync(temporary, path); } catch {
		rmSync(path, { force: true });
		renameSync(temporary, path);
	}
	return clean;
}

```

</details>

#### 缺口

- 生命周期统一和revision方案尚未实现/验证。
  **影响**：只是新假设，不能计入现有质量。
  **进一步探讨**：先复核原生皮肤API再做四故障矩阵，效果无改善就不加复杂度。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
