# dsh-neo-skin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[fe5ef0e](https://github.com/0nt-one/dsh-neo-skin/tree/fe5ef0e671fab5ab8c8700013f3966eb9642455f)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0nt-one/dsh-neo-skin) [![npm 30d 101](https://img.shields.io/static/v1?label=npm+30d&message=101&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-neo-skin) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-neo-skin)
<!-- END META -->

> **功能**：为 DSH Web UI 叠加两套新粗野主义配色和结构样式。

> **亮点**：复用主题 token 服务与设置插槽，而非覆盖整个原生主题。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：大量 !important 与后缀类名选择器易随宿主结构变化或其他插件样式冲突；缺本轮视觉验收。详见[Q03](#research-q03)。

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
  - [Q01 · 两套皮肤如何与 DSH 原生浅色/深色主题共存？](#detail-section-11)
  - [Q02 · 切换、关闭和卸载时覆写会留下吗？](#detail-section-12)
  - [Q03 · 结构 CSS 和语音插件适配对哪些实现细节敏感？](#detail-section-13)
  - [Q04 · 发布物和文档版本是否一致，部署要做什么？](#detail-section-14)
  - [Q05 · 什么验证能支撑长期作为 UI 皮肤使用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户想在保留系统浅深主题切换下自选更高对比、更硬朗的视觉皮肤。

DSH 原生浅/深/系统主题；插件叠加样式与额外方案。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 界面 | 主题 token 与结构层 | CSS 后缀耦合 |

**流程与依赖**

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH theme/slots/locale | token/设置 | 宿主版本 |
| CSS 类名 | 结构覆写 | 重构易碎 |
| localStorage | 设置 | 跨端不同步 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装 | 固定版本与 bundle | Client 加载 |
| 比对 | 双方案×浅深 | 可读/无冲突 |
| 清理 | 开关/卸载 | 原生主题恢复 |

**效果与成本**

| 项目 | 边界 |
| --- | --- |
| 初装 | 构建、注册、重启 |
| 维护 | DSH 类名和语音 CSS |
| 使用 | 浏览器 localStorage |

| 能力 | 源码状态 |
| --- | --- |
| token 叠加 | overrideTokens |
| 结构层 | CSS !important |
| 设置 | localStorage 本机持久化 |

> **思考**：大量 !important 与后缀类名选择器易随宿主结构变化或其他插件样式冲突；缺本轮视觉验收。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：复用主题 token 服务与设置插槽，而非覆盖整个原生主题。详见[Q01](#research-q01)、[Q02](#research-q02)。

Host no-op 挂载 Client；template/build 生成模块 bundle，theme/slots/locale 服务与 DOM style 配合。

<a id="detail-section-5"></a>

### 1.4 主要限制

大量 !important 与后缀类名选择器易随宿主结构变化或其他插件样式冲突；缺本轮视觉验收。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人隔离 profile 先做浅/深/系统、双方案与开关的视觉回归。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持开关/方案切换与层清理；CSS 后缀选择器较依赖宿主实现，README 版本徽章落后 package。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、src/bundle.template.js、src/schemes/blue.tokens.json、src/schemes/newspaper.tokens.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 SHA 静态审阅 README、package、Host/Client 模板和方案文件；未运行构建/浏览器。
- 下一步：目标 DSH 浏览器视觉矩阵、键盘/焦点、语音插件适配、切换/卸载清理和发布 bundle 对比。

**分析版本**

- **仓库**：[0nt-one/dsh-neo-skin](https://github.com/0nt-one/dsh-neo-skin)
- **版本号**：0.6.1（[固定提交 fe5ef0e](https://github.com/0nt-one/dsh-neo-skin/tree/fe5ef0e671fab5ab8c8700013f3966eb9642455f)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

改用稳定语义 token/插槽并接入宿主设置可降低样式耦合、跨端设置漂移；尚未实现。详见[Q05](#research-q05)。

目标 DSH 浏览器视觉矩阵、键盘/焦点、语音插件适配、切换/卸载清理和发布 bundle 对比。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 633 | 455 | 130 | — |
| .md | source | 1 | 142 | — | — | 1122 |
| .mjs | source | 1 | 47 | 29 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/0nt-one/dsh-neo-skin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/0nt-one/dsh-neo-skin/issues?q=is%3Aissue+created%3A2026-09-22T06%3A28%3A08.447Z..2026-10-22T06%3A28%3A08.447Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/0nt-one/dsh-neo-skin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A28%3A08.447Z..2026-10-22T06%3A28%3A08.447Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核主题叠加、持久化、CSS 耦合和版本一致性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两套皮肤如何与 DSH 原生浅色/深色主题共存？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

客户端通过 theme.overrideTokens 叠加所选 scheme 的 light/dark 语义 token，另一层结构 CSS 调整阴影、边框、圆角。蓝统治与做旧报纸的配色表及专属 CSS 分离，开关和方案位于常规设置行；不替换原生主题，理论上可沿用浅/深/系统切换。源码支持叠加与移除，视觉对比和无障碍质量未本轮独立实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-44](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/README.md#L20-L44)

作者方案与功能说明。

<details>
<summary>查看原文（25行）</summary>

```text
| 方案 | Light 浅色 | Dark 深色 |
|---|---|---|
| **蓝统治 Blue Command**（默认） | 深蓝侧栏 + 米白纸感 | 蓝黑画布 |
| **做旧报纸 Aged Newspaper** | 泛黄纸 + 墨字 + 衬线报头 | 报纸夜间版 |

---

## English — What is this?

A zero-dependency **client skin plugin** for the DeepSeek Harness Web UI. It stacks a
neo-brutalism palette and structure over the built-in light/dark themes via the official
`theme` service — **it never replaces the built-in theme**, so the Appearance row
(light / dark / system) keeps working and your skin applies to both palettes.

### Features

- 🎨 **Two built-in schemes**, switchable live from Settings → General → *Neo 皮肤*
  (persisted in `localStorage`, no reinstall):
  - **Blue Command** — deep-blue sidebar & buttons, blue-black dark mode
  - **Aged Newspaper** — yellowed paper, ink text, serif editorial type, masthead red
- 🧱 **Structure layer** — hard offset shadows (theme-aware black/white), sharp corners,
  2px borders, button press feedback
- 🎛️ **On/off toggle** + scheme picker in the settings row
- 🎙️ **Adapts `dsh-voice-input`** UI (popover, pills, states) to the skin
- 🌗 Fully theme-aware: light/dark/system all work
```

</details>

**依据 2 · 源码核查**：[src/bundle.template.js:37-48](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/src/bundle.template.js#L37-L48)

编译方案与持久化键。

<details>
<summary>查看原文（12行）</summary>

```text
		/** Source id of this token layer (the package id the façade pins). */
		const SOURCE = __PKG_NAME__;

		/** Compiled schemes: { blue: { label, css, tokens }, newspaper: {...} }. */
		const SCHEMES = __SCHEMES__;

		/** Locale namespace for the General settings row's copy. */
		const SETTINGS_NS = "settings.dsh-neo-skin";

		/** localStorage keys: skin on/off flag + active scheme id. */
		const STORAGE_KEY = "dsh-neo-skin.enabled";
		const SCHEME_KEY = "dsh-neo-skin.scheme";
```

</details>

**依据 3 · 源码核查**：[src/bundle.template.js:244-257](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/src/bundle.template.js#L244-L257)

主题 token 和结构层启停。

<details>
<summary>查看原文（14行）</summary>

```text
			const applyLayer = (enabled) => {
				if (enabled && layer === null) {
					const def = SCHEMES[readScheme()];
					layer = ctx.theme.overrideTokens(SOURCE, def.tokens);
				} else if (!enabled && layer !== null) {
					layer();
					layer = null;
				}
				if (enabled && structureTag === null) {
					structureTag = createStructureStyle(readScheme());
				} else if (!enabled && structureTag !== null) {
					structureTag.remove();
					structureTag = null;
				}
```

</details>

**依据 4 · 源码核查**：[src/bundle.template.js:289-296](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/src/bundle.template.js#L289-L296)

常规设置行。

```text
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "neo-skin",
				order: 15,
				store,
				locale: SETTINGS_NS,
				inject: injected
			}, ToggleRow));
```

#### 缺口

- 未在 DSH 页面视觉验收。
  **影响**：色彩/可读性仍需实测。
  **进一步探讨**：隔离浏览器测两方案×浅深系统与键盘焦点。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 切换、关闭和卸载时覆写会留下吗？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

enabled 与 scheme 读写 localStorage，默认开启与首个编译方案；setScheme 先移除旧 token layer 和 style 再应用新方案；关闭时调用 token disposer 并删结构 style；ctx.effect 清理卸载。设置行 CSS 注入有 id 防重复，但切换结构 style 会重建。数据只在当前浏览器存储，跨设备/浏览器不共享。

#### 证据与依据

**依据 1 · 源码核查**：[src/bundle.template.js:145-181](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/src/bundle.template.js#L145-L181)

localStorage 读取、默认与持久化。

<details>
<summary>查看原文（37行）</summary>

```text
		/** First scheme id (the default when nothing is persisted). */
		function defaultScheme() {
			return Object.keys(SCHEMES)[0];
		}

		/** Read the persisted on/off flag (default enabled). */
		function readStored() {
			try {
				if (typeof localStorage === "undefined") return true;
				const v = localStorage.getItem(STORAGE_KEY);
				return v === null ? true : v !== "0" && v !== "false";
			} catch {
				return true;
			}
		}
		/** Persist the on/off flag. */
		function writeStored(enabled) {
			try {
				if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
			} catch {}
		}
		/** Read the persisted scheme id (fallback to the default). */
		function readScheme() {
			try {
				if (typeof localStorage === "undefined") return defaultScheme();
				const v = localStorage.getItem(SCHEME_KEY);
				return v && SCHEMES[v] ? v : defaultScheme();
			} catch {
				return defaultScheme();
			}
		}
		/** Persist the scheme id. */
		function writeScheme(name) {
			try {
				if (typeof localStorage !== "undefined") localStorage.setItem(SCHEME_KEY, name);
			} catch {}
		}
```

</details>

**依据 2 · 源码核查**：[src/bundle.template.js:183-195](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/src/bundle.template.js#L183-L195)

结构 style 置换。

<details>
<summary>查看原文（13行）</summary>

```text
		/** Create (or replace) the structure <style> element for one scheme. */
		function createStructureStyle(scheme) {
			if (typeof document === "undefined") return null;
			const existing = document.querySelector("style[data-plugin-css=" + JSON.stringify(STRUCTURE_TAG_ID) + "]");
			if (existing !== null) existing.remove();
			const def = SCHEMES[scheme] || SCHEMES[defaultScheme()];
			const tag = document.createElement("style");
			tag.dataset.plugin = SOURCE;
			tag.dataset.pluginCss = STRUCTURE_TAG_ID;
			tag.textContent = STRUCTURE_CSS + "\n" + (def.css || "");
			document.head.appendChild(tag);
			return tag;
		}
```

</details>

**依据 3 · 源码核查**：[src/bundle.template.js:244-280](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/src/bundle.template.js#L244-L280)

启停、切换、清理。

<details>
<summary>查看原文（37行）</summary>

```text
			const applyLayer = (enabled) => {
				if (enabled && layer === null) {
					const def = SCHEMES[readScheme()];
					layer = ctx.theme.overrideTokens(SOURCE, def.tokens);
				} else if (!enabled && layer !== null) {
					layer();
					layer = null;
				}
				if (enabled && structureTag === null) {
					structureTag = createStructureStyle(readScheme());
				} else if (!enabled && structureTag !== null) {
					structureTag.remove();
					structureTag = null;
				}
			};

			const setScheme = (name) => {
				if (!SCHEMES[name] || name === readScheme()) return;
				writeScheme(name);
				if (layer !== null) { layer(); layer = null; }
				if (structureTag !== null) { structureTag.remove(); structureTag = null; }
				applyLayer(readStored());
				bound?.syncScheme(name);
			};

			const setEnabled = (v) => {
				writeStored(v);
				applyLayer(v);
				bound?.syncEnabled(v);
			};

			applyLayer(readStored());

			ctx.effect(() => () => {
				if (layer !== null) { layer(); layer = null; }
				if (structureTag !== null) { structureTag.remove(); structureTag = null; }
			}, "dsh-neo-skin: layers cleanup");
```

</details>

#### 缺口

- 未执行热重载/多标签页试验。
  **影响**：多标签页设置同步和重复 style 行为未知。
  **进一步探讨**：双标签切换与卸载后 DOM/CSS 检查。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 结构 CSS 和语音插件适配对哪些实现细节敏感？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

结构层用 `[class*="_card"]` 等后缀和 `!important` 覆写组件，依赖 DSH CSS 类名形态；对 dsh-voice-input 的 .dvi_* 类再做定制。作者亦承认大版本重构类名需微调。选择器可能命中别的后缀组件或与其他皮肤/语音样式冲突，具体影响需页面回归。theme、slots、locale 是客户端注入服务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:84-97](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/README.md#L84-L97)

作者说明后缀选择器和 localStorage。

<details>
<summary>查看原文（14行）</summary>

```text
- **结构层（v0.3.0）**：硬偏移阴影（浅色黑 / 深色白，随主题）、关键面板直角化
  （`_card`/`_bubble`/`_panel`/`_code`/`_option`…）、2px 粗边框、按钮按下位移反馈。
- **语音插件适配（v0.5.0）**：`dsh-voice-input` 弹层/按钮/状态色主题化（它引用了
  不存在的 `--dsw-alias-*` token，走 fallback 会在浅色下黑底黑字，皮肤里已修正）。
- **对比度纪律**：所有色面文字对比逐一校验（"推荐"徽章蓝底蓝字、深色主按钮蓝底黑字
  这类事故已修复）。

> 注意：结构层通过 `[class*="_xxx"]` 可读后缀选择器命中组件（哈希变化不碎），
> DSH 大版本重构类名时可能需要微调；圆形小元素（状态点、头像、spinner）保持圆形。
>
> 为什么用 `localStorage` 而不是 `dsh-settings` 命名空间：host apiproxy 只对白名单
> （`WEB_SETTINGS_NAMESPACES`）开放 `settings.describe`，第三方插件注册的命名空间会得到
> `settings-not-exposed`；官方把"让插件自行暴露配置"列为 deferred work。用 localStorage
> 保证插件自包含、可直接发布，无需改 DSH 核心。
```

</details>

**依据 2 · 源码核查**：[src/bundle.template.js:50-112](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/src/bundle.template.js#L50-L112)

结构和语音 CSS 目标。

<details>
<summary>查看原文（63行）</summary>

```text
		/**
		 * Neo-brutalism structure layer shared by every scheme: shadows, corners,
		 * borders, press feel, and the dsh-voice-input adaptation. Shadow color is
		 * theme-aware — --dsw-alias-border-l4 resolves to black in the light
		 * palette and white in the dark palette. Component class names carry
		 * stable readable suffixes (hash_name), so `[class*="_card"]` style
		 * selectors survive DSH rebuilds that only rotate the hash.
		 */
		const STRUCTURE_CSS = [
			"body{",
			"--dsw-shadow-lv1:2px 2px 0 var(--dsw-alias-border-l4)!important;",
			"--dsw-shadow-lv1-blur:2px 2px 0 var(--dsw-alias-border-l4)!important;",
			"--dsw-shadow-lv2:3px 3px 0 var(--dsw-alias-border-l4)!important;",
			"--dsw-shadow-lv3:4px 4px 0 var(--dsw-alias-border-l4)!important;",
			"}",
			"[class*=\"_card\"],[class*=\"_bubble\"],[class*=\"_panel\"],[class*=\"_code\"],",
			"[class*=\"_crumb\"],[class*=\"_option\"],[class*=\"_callRow\"],[class*=\"_notice\"],",
			"[class*=\"_selector\"],[class*=\"_workspace\"],[class*=\"_sectionHeader\"],",
			"[class*=\"_crumbBar\"]{",
			"border-radius:0!important;",
			"}",
			"[class*=\"_card\"],[class*=\"_option\"],[class*=\"_panel\"]{",
			"border-width:2px!important;",
			"}",
			"button:active:not(:disabled){",
			"transform:translate(1px,1px)!important;",
			"}",
			"[class*=\"_card\"]:active,[class*=\"_panel\"]:active{",
			"box-shadow:1px 1px 0 var(--dsw-alias-border-l4)!important;",
			"}",
			"/* dsh-voice-input adaptation: its CSS uses non-existent --dsw-alias-* tokens",
			"   (bg-elevated / bg-hover / accent-strong) so it falls back to hardcoded dark",
			"   values that break on light backgrounds; re-theme + neo-brutalize here. */",
			".dvi_pop{",
			"background:var(--dsw-specific-menu)!important;",
			"border-width:2px!important;",
			"border-radius:0!important;",
			"box-shadow:4px 4px 0 var(--dsw-alias-border-l4)!important;",
			"}",
			".dvi_btn,.dvi_pill,.dvi_done{",
			"border-radius:0!important;",
			"}",
			".dvi_pill,.dvi_done{",
			"border-width:2px!important;",
			"}",
			".dvi_btn:hover,.dvi_done:hover{",
			"background:var(--dsw-alias-interactive-bg-hover)!important;",
			"}",
			".dvi_listening{",
			"color:var(--dsw-alias-state-error-primary)!important;",
			"}",
			".dvi_listening:hover{",
			"background:var(--dsw-alias-interactive-bg-hover-danger)!important;",
			"}",
			".dvi_err{",
			"color:var(--dsw-alias-state-error-primary)!important;",
			"}",
			".dvi_pill.dvi_on{",
			"background:var(--dsw-alias-brand-primary)!important;",
			"border-color:var(--dsw-alias-brand-primary)!important;",
			"color:var(--dsw-alias-brand-primary-invert)!important;",
			"}"
		].join("\n");
```

</details>

**依据 3 · 源码核查**：[src/bundle.template.js:227-229](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/src/bundle.template.js#L227-L229)

客户端服务依赖。

```text
		/** Cordis service-level inject: theme + the settings-row surface services. */
		const inject = ["theme", "slots", "locale"];

```

#### 缺口

- 未测其他皮肤及新 DSH 版本。
  **影响**：样式冲突与误命中范围未知。
  **进一步探讨**：对目标版本 DOM/截图做视觉回归。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 发布物和文档版本是否一致，部署要做什么？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

package.json 固定版本 0.6.1，README 顶部徽章仍写 0.6.0，显示文档未同步。源码 template 和 schemes 需由构建脚本产出 client.js，仓库也提交了 client.js；Host index 仅 no-op apply 以让客户端 bundle 被挂载。README 说本地安装先 npm run build、注册行并重启 Host；本轮未运行目标构建，也未比对已提交 bundle 与 template 的字节等价。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:6-9](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/README.md#L6-L9)

徽章版本 0.6.0。

```text
[![version](https://img.shields.io/badge/version-0.6.0-1B3CC4)](package.json)
[![license](https://img.shields.io/badge/license-MIT-green)](#license)
[![dsh-plugin](https://img.shields.io/badge/dsh-client--plugin-web-2340A8)](#)
[![DeepSeek Harness](https://img.shields.io/badge/platform-DeepSeek%20Harness-0D1630)](#)
```

**依据 2 · 源码核查**：[package.json:1-7](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/package.json#L1-L7)

包版本 0.6.1。

```text
{
  "name": "dsh-neo-skin",
  "version": "0.6.1",
  "description": "Neo-brutalism skin for DeepSeek Harness Web UI — stacks hard-border / high-contrast --dsw-alias-* token overrides (DS-native blue + black-white + green + orange) on top of the built-in light/dark palettes.",
  "type": "module",
  "main": "lib/index.js",
  "license": "MIT",
```

**依据 3 · 源码核查**：[src/bundle.template.js:1-20](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/src/bundle.template.js#L1-L20)

模板与构建说明。

<details>
<summary>查看原文（20行）</summary>

```text
/* dsh-neo-skin — client bundle template.
 *
 * This file is NOT served directly. scripts/build.mjs replaces the two
 * placeholder tokens (the package id and the compiled SCHEMES map) and writes
 * the final self-contained bundle to client.js — the exact artifact format the
 * official packages emit (tsdown), which the shell kernel loads via
 * window.__ModuleLoader__.load({ id, factory }).
 *
 * The factory body resolves three shared client-runtime modules the same way
 * the official ui-theme package does (react/jsx-runtime for JSX, primitives
 * for the Pill control, runtime-client for defineStore), then:
 *   - stacks the selected scheme's token layer through the `theme` service,
 *   - injects a neo-brutalism STRUCTURE layer (hard shadows / sharp corners /
 *     2px borders / press feedback / voice-plugin adaptation) + the scheme's
 *     own structure extras while enabled,
 *   - persists the on/off flag and the active scheme in localStorage
 *     (self-contained; a dsh-settings namespace would not be exposed to the
 *     Web client — see lib/index.js),
 *   - registers a settings row (on/off + scheme picker) into the General
 *     settings item slot.
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1-27](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/lib/index.js#L1-L27)

Host no-op。

<details>
<summary>查看原文（27行）</summary>

```text
/* dsh-neo-skin — host half (dual-face package shape, mirroring the official
 * dsh-client-* packages).
 *
 * The loader mounts a cordis entry for this package by its root export; the
 * modules node half only composes client bundles from entries that mounted a
 * fiber. This skin needs no host-side behaviour — the whole effect lives in
 * the client half (client.js), which stacks the token layer through the
 * `theme` service in the browser. Keeping a real (no-op) host apply makes the
 * fiber mount so the client bundle reaches window.__DSH_BOOT__.
 *
 * NOTE (settings): the on/off toggle persists in the browser's localStorage
 * rather than a `dsh-settings` namespace, because the host apiproxy only
 * serves settings namespaces on an explicit allowlist
 * (`WEB_SETTINGS_NAMESPACES` in @deepseek-ai/dsh-host-apiproxy). A
 * third-party namespace registers fine but answers `settings-not-exposed`
 * to the Web client; letting a plugin expose its own namespace is deferred
 * upstream work. localStorage keeps this skin self-contained and publishable
 * without patching the harness.
 */

/** Stable Cordis plugin name. */
const name = "dsh-neo-skin";

/** No host-side services or registries are required by this skin. */
function apply() {}

export { apply, name };
```

</details>

**依据 5 · 作者声明**：[README.md:46-64](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/README.md#L46-L64)

作者安装步骤。

<details>
<summary>查看原文（19行）</summary>

````text
### Quick install (offline / dev)

```powershell
# 1. build the bundle (zero deps, no npm install)
npm run build

# 2. install into the web profile
dsh plugin --profile web add <path\to\dsh-neo-skin>

# 3. register the roster row in .dsh/profiles/web/cordis.patch.yml:
#    - insert:
#        - id: dsh-neo-skin
#          name: 'dsh-neo-skin'

# 4. restart `dsh --profile web`
```

> On the first install the host must restart to mount the plugin; afterwards a browser
> hard-refresh is enough to pick up rebuilt bundles.
````

</details>

#### 缺口

- 未运行插件 build 或 bundle 差异核对。
  **影响**：发布件是否与源码一致未知。
  **进一步探讨**：仅在隔离评估环境比对固定版本构建产物。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么验证能支撑长期作为 UI 皮肤使用？

**研究主题**：采用判断、新假设与验证

#### 完整回答

在目标 DSH 版本上测试两方案×浅/深/系统、关闭/切换/卸载、语音弹层与键盘焦点/文本对比，确认无误命中后可作为个人偏好试用。跨设备一致性需额外设置同步，当前 localStorage 只管本机浏览器。若宿主提供插件 settings namespace，可迁移持久化；若结构层改用稳定语义 token/专用插槽，可减小类名耦合，这些是改进设想。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:70-97](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/README.md#L70-L97)

主题机制及已知耦合。

<details>
<summary>查看原文（28行）</summary>

```text
### 它怎么工作

DSH 官方主题插件（`@deepseek-ai/dsh-client-ui-theme`）提供 `theme` 服务，
`ui-layout` 把当前主题快照的 token 以 inline CSS 变量写到 `<body>`。
本插件调用 `ctx.theme.overrideTokens(source, tokens)`，把 `--dsw-alias-*` 语义 token 的
`{ light, dark }` 双配色表**叠加**到官方浅色/深色之上——右上角外观里的
浅色 / 深色 / 跟随系统 三档照常工作。

### 功能清单

- **开关（v0.2.0）**：设置 → 常规 → Neo 皮肤，开启/关闭胶囊按钮，持久化在
  `localStorage: dsh-neo-skin.enabled`（默认开启）；关闭即回到官方配色。
- **双方案（v0.6.0）**：同一行「方案」选择器（蓝统治 / 做旧报纸），持久化在
  `dsh-neo-skin.scheme`，**实时切换**整套配色 + 结构覆写。
- **结构层（v0.3.0）**：硬偏移阴影（浅色黑 / 深色白，随主题）、关键面板直角化
  （`_card`/`_bubble`/`_panel`/`_code`/`_option`…）、2px 粗边框、按钮按下位移反馈。
- **语音插件适配（v0.5.0）**：`dsh-voice-input` 弹层/按钮/状态色主题化（它引用了
  不存在的 `--dsw-alias-*` token，走 fallback 会在浅色下黑底黑字，皮肤里已修正）。
- **对比度纪律**：所有色面文字对比逐一校验（"推荐"徽章蓝底蓝字、深色主按钮蓝底黑字
  这类事故已修复）。

> 注意：结构层通过 `[class*="_xxx"]` 可读后缀选择器命中组件（哈希变化不碎），
> DSH 大版本重构类名时可能需要微调；圆形小元素（状态点、头像、spinner）保持圆形。
>
> 为什么用 `localStorage` 而不是 `dsh-settings` 命名空间：host apiproxy 只对白名单
> （`WEB_SETTINGS_NAMESPACES`）开放 `settings.describe`，第三方插件注册的命名空间会得到
> `settings-not-exposed`；官方把"让插件自行暴露配置"列为 deferred work。用 localStorage
> 保证插件自包含、可直接发布，无需改 DSH 核心。
```

</details>

**依据 2 · 源码核查**：[src/bundle.template.js:150-181](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/src/bundle.template.js#L150-L181)

浏览器本地存储。

<details>
<summary>查看原文（32行）</summary>

```text
		/** Read the persisted on/off flag (default enabled). */
		function readStored() {
			try {
				if (typeof localStorage === "undefined") return true;
				const v = localStorage.getItem(STORAGE_KEY);
				return v === null ? true : v !== "0" && v !== "false";
			} catch {
				return true;
			}
		}
		/** Persist the on/off flag. */
		function writeStored(enabled) {
			try {
				if (typeof localStorage !== "undefined") localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
			} catch {}
		}
		/** Read the persisted scheme id (fallback to the default). */
		function readScheme() {
			try {
				if (typeof localStorage === "undefined") return defaultScheme();
				const v = localStorage.getItem(SCHEME_KEY);
				return v && SCHEMES[v] ? v : defaultScheme();
			} catch {
				return defaultScheme();
			}
		}
		/** Persist the scheme id. */
		function writeScheme(name) {
			try {
				if (typeof localStorage !== "undefined") localStorage.setItem(SCHEME_KEY, name);
			} catch {}
		}
```

</details>

**依据 3 · 源码核查**：[src/bundle.template.js:244-280](https://github.com/0nt-one/dsh-neo-skin/blob/fe5ef0e671fab5ab8c8700013f3966eb9642455f/src/bundle.template.js#L244-L280)

启停与清理路径。

<details>
<summary>查看原文（37行）</summary>

```text
			const applyLayer = (enabled) => {
				if (enabled && layer === null) {
					const def = SCHEMES[readScheme()];
					layer = ctx.theme.overrideTokens(SOURCE, def.tokens);
				} else if (!enabled && layer !== null) {
					layer();
					layer = null;
				}
				if (enabled && structureTag === null) {
					structureTag = createStructureStyle(readScheme());
				} else if (!enabled && structureTag !== null) {
					structureTag.remove();
					structureTag = null;
				}
			};

			const setScheme = (name) => {
				if (!SCHEMES[name] || name === readScheme()) return;
				writeScheme(name);
				if (layer !== null) { layer(); layer = null; }
				if (structureTag !== null) { structureTag.remove(); structureTag = null; }
				applyLayer(readStored());
				bound?.syncScheme(name);
			};

			const setEnabled = (v) => {
				writeStored(v);
				applyLayer(v);
				bound?.syncEnabled(v);
			};

			applyLayer(readStored());

			ctx.effect(() => () => {
				if (layer !== null) { layer(); layer = null; }
				if (structureTag !== null) { structureTag.remove(); structureTag = null; }
			}, "dsh-neo-skin: layers cleanup");
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
