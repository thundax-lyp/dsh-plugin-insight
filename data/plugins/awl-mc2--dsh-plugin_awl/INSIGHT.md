# dsh-type-tune

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[02b8cec](https://github.com/AWL-MC2/DSH-Plugin_awl/tree/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：为 DSH Web 提供对比度/字体/内容样式与预览调节，Host 状态和浏览器本地缓存协同。

> **核心亮点**：把 CSS/字体调整集成到 DSH 设置与聊天命令，避免手工改主题。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：无认证状态 POST 接受无 Origin 请求；若 Web 暴露 LAN 可被网络客户端改写。写盘错误被吞、并发状态无版本保护。详见[Q03](#research-q03)。

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
  - [Q01 · 它解决哪类可读性与定制负担？](#detail-section-11)
  - [Q02 · 设置、字体与状态怎样在 Host/浏览器之间流动？](#detail-section-12)
  - [Q03 · 无认证 Web 路由与写入失败的边界是什么？](#detail-section-13)
  - [Q04 · 采用时如何验证可读性与部署条件？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：壁纸让次级文本难读，用户希望低成本调字体和 Markdown 样式。

手改 Web CSS/主题或更换壁纸；插件提供设置卡、命令与字体管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| CSS 调节 | 提升视觉可读性 | 未独立视觉验证 |
| 字体扫描 | 自定义家族 | 文件来源需管理 |
| 状态同步 | 命令/UI 共用 | LAN 无认证、写失败静默 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH Web token/slots | 样式与设置 UI | UI 降级/样式失效 |
| Webserver 路由 | 跨页面状态/字体 | 本地缓存降级 |
| 可写 DSH_HOME | 持久化命令设置 | 仍可能假成功 |
| 回环访问或认证 | 限路由写入 | LAN 可改状态 |

#### 视觉验证

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 对照 | 默认/调节后截图 | 次级文字实测可读 |
| 性能 | 长会话开/关动画 | 帧率与清晰度可接受 |
| 状态 | 命令、设置、多标签交错 | 无丢更新/假成功 |
| 回滚 | /style recover | 主题恢复 |

**效果与成本**

#### 成本

| 阶段 | 资源与人工 | 边界 |
| --- | --- | --- |
| 初次 | 安装、选壁纸、调样式和字体 | 宿主版本依赖 |
| 使用 | 看对比度与性能 | 动效可能降清晰度 |
| 运维 | 状态备份与 LAN 安全 | 无认证 POST/写失败静默 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 对比/字体 | token CSS 与字体 manifest | 实际对比达标率 |
| 状态同步 | Host 文件/localStorage 轮询 | 并发丢更新概率 |
| 命令 | /style 操作 | 多人权限边界 |

> **思考**：无认证状态 POST 接受无 Origin 请求；若 Web 暴露 LAN 可被网络客户端改写。写盘错误被吞、并发状态无版本保护。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把 CSS/字体调整集成到 DSH 设置与聊天命令，避免手工改主题。详见[Q01](#research-q01)、[Q02](#research-q02)。

把 CSS/字体调整集成到 DSH 设置与聊天命令，避免手工改主题。详见[Q01](#research-q01)、[Q02](#research-q02)。

Host 扫字体、提供 manifest/state/font 路由和 /style 命令；客户端注入 CSS、预览、localStorage 与轮询。状态 .tmp 重命名但无 CAS，写失败静默。

<a id="detail-section-5"></a>

### 1.4 主要限制

无认证状态 POST 接受无 Origin 请求；若 Web 暴露 LAN 可被网络客户端改写。写盘错误被吞、并发状态无版本保护。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅回环、单人 Web 可审慎试用，留默认恢复路径；LAN/多人环境先补认证与错误反馈。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

样式与状态机制可静态核查；视觉收益未验，无 Origin 的 JSON POST 可绕过浏览器同源意图，写盘失败仍报告成功。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定 README、Host index.js、client.js；未加载 DSH、访问路由或视觉测量。
- 下一步：在目标 DSH Web 亮暗主题和多壁纸测对比度/性能；LAN 无 Origin POST、不可写状态目录、多标签并发与回滚实测。

**分析版本**

- **仓库**：[AWL-MC2/DSH-Plugin_awl](https://github.com/AWL-MC2/DSH-Plugin_awl)
- **版本号**：0.1.1（[固定提交 02b8cec](https://github.com/AWL-MC2/DSH-Plugin_awl/tree/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

加入 Host 身份验证、明确写失败和 CAS/临时文件唯一名，再做真实对比度/性能测量可提高多人部署可靠性；现版未实现。详见[Q04](#research-q04)。

在目标 DSH Web 亮暗主题和多壁纸测对比度/性能；LAN 无 Origin POST、不可写状态目录、多标签并发与回滚实测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2147 | 1608 | 408 | — |
| .md | source | 1 | 137 | — | — | 1865 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AWL-MC2/DSH-Plugin_awl/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AWL-MC2/DSH-Plugin_awl/issues?q=is%3Aissue+created%3A2026-09-22T05%3A54%3A58.143Z..2026-10-22T05%3A54%3A58.143Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AWL-MC2/DSH-Plugin_awl/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A54%3A58.143Z..2026-10-22T05%3A54%3A58.143Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 DSH Web 可读性/字体定制的样式与状态同步路径，界定视觉效果和无认证路由的风险。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它解决哪类可读性与定制负担？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是 DSH Web 更换壁纸后次级文字对比不足，以及希望针对会话 Markdown 调整链接、标题、字体和特效的用户。客户端通过 color-mix 覆盖部分标签 token、注入范围化样式和悬浮预览；Host 扫描自定义字体并提供 /style 聊天命令、共享状态路由。相较手改 CSS，操作者可在设置卡或命令里调节并在页面即时看到变化。作者说“可读性修复”和 WCAG 徽标，但实际视觉质量、对比度达标率和不同主题兼容未在本轮浏览器中检验。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-45](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/README.md#L1-L45)

作者描述可读性、内容规则、特效和自定义字体。

<details>
<summary>查看原文（45行）</summary>

````text
# dsh-type-tune

DSH Web GUI 排版与可读性调校插件：专治「改了壁纸之后原版字体发虚 / 发淡」这一类问题，并提供轻量的字体特效与内容规则。

- **可读性修复（核心）**：覆盖 `--dsw-alias-label-secondary/tertiary/caption` 三个低对比 token（用 `color-mix` 向 `label-primary` 靠拢，亮/暗主题自适应），再叠一个可调强度的文字光晕，把叠在壁纸上的次级文字（轨迹、重试提示、工具摘要）拉回可读。
- **内容规则**：链接加粗 / 常驻下划线 / 变色，标题变色，正文变色——作用范围精确锁定在会话 Markdown（`[class*="_markdown_"]`），不碰侧栏和设置页。
- **特效**：彩虹描边（`@property --dtt-hue` 做色相循环）与渐变填充（`background-clip: text` 平移），速度 / 方向 / 渐变角度 / 描边宽度 / 色标全部可调；默认只作用于标题、强调、链接。
- **预览小窗**：可拖动的悬浮 WYSIWYG 预览，正文区透明、壁纸直接透出，附带 WCAG 对比度徽标。
- **两档 UI**：简单模式只有预设卡片 + 对比 + 光晕 + 链接/特效开关；高级模式展开渐变角度、描边宽度、色标等细节。

## 安装

从 GitHub 安装（推荐；零构建，无需编译）：

```bash
dsh plugin --profile <你的 profile> add github:AWL-MC2/DSH-Plugin_awl
```

或以本地目录安装（开发 / 自用）：

```bash
dsh plugin --profile <你的 profile> add <插件目录绝对路径>
```

安装后**重启一次 DSH 并刷新 Web UI**（改设置之后无需再重启）。

## 使用

打开 **设置 → 通用 → 「字体与可读性」**。改完即时生效。

- 字号基准仍由 **设置 → 外观 → 对话字号** 控制；本插件的「正文字号偏移」在其上做增量，不与之冲突。
- 预览窗可用右上角 ✕ 临时隐藏；在设置里取消再勾选「显示预览窗」可重新打开。

## 自定义字体

把字体文件丢进插件目录下的 **`fonts/`**（首次启动会自动创建，里面带一份 `README.txt`），
刷新页面就能在字体下拉框的「自定义」分组里选到它们。

```
dsh-type-tune/fonts/          ← 主目录，跟着插件走
$DSH_HOME/fonts/              ← 备用目录，重装插件也不会丢
```

| 项目 | 说明 |
|---|---|
````

</details>

**依据 2 · 源码核查**：[client.js:274-355](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/client.js#L274-L355)

客户端生成对比 token 与样式规则。

<details>
<summary>查看原文（82行）</summary>

```text
		/** Pull a label token toward `label-primary` by pct% to raise contrast
		 * (mode-agnostic: label-primary already flips light/dark). */
		function contrastMix(pct) {
			return "color-mix(in oklab, var(--dsw-alias-label-primary) " + pct + "%, #7c818a)";
		}
		const CONTRAST_LEVELS = {
			0: { secondary: 0, tertiary: 0, caption: 0 },
			1: { secondary: 30, tertiary: 45, caption: 45 },
			2: { secondary: 45, tertiary: 65, caption: 65 },
			3: { secondary: 60, tertiary: 82, caption: 82 }
		};
		const HALO_LIGHT = ["none", "0 0 1px 1px rgba(255,255,255,.55)", "0 0 2px 2px rgba(255,255,255,.7)", "0 0 3px 3px rgba(255,255,255,.85)"];
		const HALO_DARK = ["none", "0 0 1px 1px rgba(0,0,0,.5)", "0 0 2px 2px rgba(0,0,0,.65)", "0 0 3px 3px rgba(0,0,0,.8)"];

		function targetSel(target) {
			switch (target) {
				case "heading": return ":is(h1,h2,h3,h4,h5,h6)";
				case "strong": return "strong";
				case "link": return "a[href]";
				case "body": return ":is(p, li, td, th, dd, blockquote, h1, h2, h3, h4, h5, h6)";
				default: return "";
			}
		}

		/**
		 * Resolve a UI-font selection to a CSS stack.
		 * @param {string} value - "auto", a built-in id, or a family name.
		 * @returns {string | null} the stack, or null to leave DSH's own alone.
		 */
		function resolveUiStack(value) {
			if (value === "auto") return null;
			const builtin = UI_FONTS.find((f) => f.id === value);
			if (builtin !== undefined) return builtin.stack;
			return '"' + value + '", ' + DEFAULT_UI_STACK;
		}

		/**
		 * Resolve a code-font selection to a CSS stack.
		 * @param {string} value - "auto", a built-in id, or a family name.
		 * @returns {string | null} the stack, or null to leave DSH's own alone.
		 */
		function resolveCodeStack(value) {
			if (value === "auto") return null;
			const builtin = CODE_FONTS.find((f) => f.id === value);
			if (builtin !== undefined) return builtin.stack;
			return '"' + value + '", ' + DEFAULT_CODE_STACK;
		}

		/** Token/global rules (contrast, halo, fonts). */
		function buildGlobalCss(cfg) {
			const rules = [];
			const lv = CONTRAST_LEVELS[cfg.contrast] || CONTRAST_LEVELS[0];
			const tokenDecls = [];
			if (lv.secondary > 0) tokenDecls.push("--dsw-alias-label-secondary: " + contrastMix(lv.secondary) + ";");
			if (lv.tertiary > 0) tokenDecls.push("--dsw-alias-label-tertiary: " + contrastMix(lv.tertiary) + ";");
			if (lv.caption > 0) tokenDecls.push("--dsw-alias-label-caption: " + contrastMix(lv.caption) + ";");
			if (tokenDecls.length > 0) {
				// Emit on both `body` and the dark palette selector so a later
				// stylesheet wins the cascade in BOTH color schemes.
				rules.push("body, body[data-ds-dark-theme] { " + tokenDecls.join(" ") + " }");
			}

			if (cfg.halo > 0) {
				const h = cfg.halo;
				rules.push("body:not([data-ds-dark-theme]) " + MARKDOWN_SCOPE + ", body:not([data-ds-dark-theme]) [data-text-shimmer] { text-shadow: " + HALO_LIGHT[h] + "; }");
				rules.push("body[data-ds-dark-theme] " + MARKDOWN_SCOPE + ", body[data-ds-dark-theme] [data-text-shimmer] { text-shadow: " + HALO_DARK[h] + "; }");
			}

			const uiStack = resolveUiStack(cfg.uiFont);
			const codeStack = resolveCodeStack(cfg.codeFont);
			const fontDecls = [];
			if (uiStack !== null) fontDecls.push("--dsw-font-family: " + uiStack + ";");
			if (codeStack !== null) fontDecls.push("--ds-font-family-code: " + codeStack + ";");
			if (fontDecls.length > 0) rules.push(":root, body { " + fontDecls.join(" ") + " }");

			return rules;
		}

		/** Scoped rules (content rules + effects) under one scope selector. */
		function buildScopedCss(cfg, scope) {
			const rules = [];

```

</details>

**依据 3 · 源码核查**：[index.js:479-589](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/index.js#L479-L589)

/style 命令读取并更新共享状态。

<details>
<summary>查看原文（111行）</summary>

```text
export function runStyleCommand(rawInput) {
	const tokens = String(rawInput ?? "").trim().split(/\s+/).filter(Boolean);
	const sub = (tokens[0] ?? "").toLowerCase();
	const rest = tokens.slice(1);
	const arg = rest.join(" ");

	const reply = (text) => ({ kind: "success", text });
	const fail = (text) => ({ kind: "error", text });

	if (sub === "" || sub === "status") {
		const state = loadState();
		const { fonts } = scanFonts();
		return reply([
			`字体与可读性：${summarize(state.config)}`,
			`自定义字体：${String(fonts.length)} 个${fonts.length > 0 ? `（${fonts.slice(0, 6).map((f) => f.family).join("、")}${fonts.length > 6 ? " 等" : ""}）` : ""}`,
			"改完约 1 秒内在页面上生效，无需刷新。",
			"输入 /style help 查看全部命令。"
		].join("\n"));
	}
	if (sub === "help" || sub === "-h" || sub === "--help") return reply(HELP);

	if (sub === "recover" || sub === "reset" || sub === "default") {
		saveState(null);
		return reply("已恢复默认：所有覆盖已清空（对比、光晕、字体、字号、特效、链接样式、预览窗）。约 1 秒内在页面上生效。");
	}

	if (sub === "fonts") {
		const { fonts, rejected } = scanFonts();
		const lines = [`扫描目录：`, ...fontDirs().map((d) => `  ${d}`), `共发现 ${String(fonts.length)} 个可用字体：`];
		for (const font of fonts.slice(0, 40)) lines.push(`  ${font.family}  (${font.file}, ${font.format}, ${String(Math.round(font.bytes / 1024))} KB)`);
		if (fonts.length > 40) lines.push(`  … 另有 ${String(fonts.length - 40)} 个`);
		if (rejected.length > 0) {
			lines.push("", `跳过了 ${String(rejected.length)} 个文件：`);
			for (const item of rejected.slice(0, 15)) lines.push(`  ${item.file} — ${item.reason}`);
		}
		lines.push("", "把字体文件放进上面的目录后刷新页面即可看到。");
		return reply(lines.join("\n"));
	}

	if (sub === "preset") {
		const ids = Object.keys(PRESETS).concat(["off"]);
		if (!ids.includes(arg)) return fail(`未知预设「${arg || "(空)"}」。可用：${ids.join(" | ")}`);
		if (arg === "off") {
			saveState(null);
			return reply("已关闭全部覆盖（等同 /style recover）：对比、光晕、字体、字号、特效、链接样式与预览窗全部回到默认。");
		}
		patchState(PRESETS[arg]);
		return reply(`已应用预设「${arg}」：${summarize(loadState().config)}`);
	}

	const intArg = (label, min, max) => {
		const value = Number(arg);
		if (arg === "" || !Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) return null;
		return value;
	};

	if (sub === "contrast" || sub === "halo") {
		const value = intArg(sub, 0, 3);
		if (value === null) return fail(`用法：/style ${sub} <0-3>`);
		patchState({ [sub]: value });
		return reply(`已设置${sub === "contrast" ? "对比增强" : "文字光晕"} = ${String(value)}`);
	}

	if (sub === "size") {
		const value = intArg(sub, -2, 4);
		if (value === null) return fail("用法：/style size <-2..4>（0 表示不干预「外观」里的对话字号）");
		patchState({ sizeOffset: value });
		return reply(`已设置正文字号偏移 = ${value > 0 ? `+${String(value)}` : String(value)} px`);
	}

	if (sub === "fx") {
		const modes = ["off", "rainbow-edge", "gradient-fill"];
		if (!modes.includes(arg)) return fail(`用法：/style fx <${modes.join("|")}>`);
		patchState({ fx: arg });
		return reply(arg === "off" ? "已关闭字体特效" : `已开启特效「${arg}」`);
	}

	if (sub === "links") {
		const modes = {
			off: { linkBold: false, linkUnderline: false },
			bold: { linkBold: true, linkUnderline: false },
			underline: { linkBold: false, linkUnderline: true },
			both: { linkBold: true, linkUnderline: true }
		};
		if (!(arg in modes)) return fail(`用法：/style links <${Object.keys(modes).join("|")}>`);
		patchState(modes[arg]);
		return reply(`链接样式已设为「${arg}」`);
	}

	if (sub === "font" || sub === "code") {
		if (arg === "") return fail(`用法：/style ${sub} <家族名|auto>（用 /style fonts 查看可用家族名）`);
		const key = sub === "font" ? "uiFont" : "codeFont";
		if (arg === "auto" || arg === "默认" || arg === "default") {
			patchState({ [key]: "auto" });
			return reply(`已把${sub === "font" ? "界面" : "代码"}字体恢复为默认`);
		}
		// Custom families are stored under their real name so @font-face matches.
		patchState({ [key]: arg });
		return reply(`已把${sub === "font" ? "界面" : "代码"}字体设为「${arg}」。若是自定义字体，请确认它出现在 /style fonts 列表里。`);
	}

	if (sub === "preview") {
		if (arg !== "on" && arg !== "off") return fail("用法：/style preview <on|off>");
		patchState({ previewVisible: arg === "on" });
		return reply(arg === "on" ? "预览小窗已显示" : "预览小窗已隐藏");
	}

	return fail(`未知子命令「${sub}」。\n${HELP}`);
}
//#endregion

```

</details>

#### 缺口

- 未在 DSH Web 和不同壁纸/主题中进行视觉检查。
  **影响**：不能认定 WCAG 对比度或实际阅读效率改善。
  **进一步探讨**：对多主题/壁纸及长文本进行浏览器截图、对比度和性能测量。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设置、字体与状态怎样在 Host/浏览器之间流动？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 扫描插件 fonts/ 与 DSH_HOME/fonts/，识别 TTF/OTF 的 name 表，对字体清单去重并生成可索引 ID；浏览器按 manifest 加载 @font-face。状态文件 $DSH_HOME/type-tune.json 供聊天命令和设置卡共用；浏览器本地 localStorage 作为首帧缓存或无 webserver 降级，页面每 2 秒轮询 Host 状态。Host saveState 使用临时文件重命名，能减少半文件风险；但固定 .tmp 文件名与先读后写 revision 没并发锁，多个命令/页面同时写仍可能覆盖更新。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:252-360](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/index.js#L252-L360)

字体目录扫描、格式过滤、去重及签名。

<details>
<summary>查看原文（109行）</summary>

```text
 * Scan the drop folders for loadable fonts.
 *
 * Never throws: an unreadable directory simply contributes nothing, and every
 * skipped file is reported with a reason so the UI can explain itself.
 * @param {string[]} [dirs] - directories to scan; defaults to {@link fontDirs}.
 * @returns {{ fonts: Array<{id: string, family: string, file: string, dir: string, format: string, bytes: number}>, rejected: Array<{file: string, reason: string}> }}
 */
export function scanFonts(dirs = fontDirs()) {
	/** Every loadable candidate, before duplicate-family arbitration. */
	const candidates = [];
	/** @type {Array<{file:string,reason:string}>} */
	const rejected = [];

	/** Cap the total files inspected, so a directory with tens of thousands of
	 * entries cannot make the manifest handler read (and parse) every one. */
	const SCAN_BUDGET = 1000;
	let scanned = 0;

	outer:
	for (const dir of dirs) {
		let entries;
		try {
			entries = fs.readdirSync(dir, { withFileTypes: true });
		} catch {
			continue; // folder absent (or unreadable): nothing to report
		}
		// Stable order so the manifest does not shuffle between requests.
		entries.sort((a, b) => a.name.localeCompare(b.name));
		for (const entry of entries) {
			scanned += 1;
			if (scanned > SCAN_BUDGET) break outer;
			if (!entry.isFile() || entry.name.startsWith(".")) continue;
			const ext = path.extname(entry.name).toLowerCase();
			const filePath = path.join(dir, entry.name);
			if (COLLECTION_EXT.has(ext)) {
				rejected.push({ file: entry.name, reason: "字体集合（.ttc/.otc）浏览器无法通过 @font-face 加载，请改用 .ttf/.otf/.woff2" });
				continue;
			}
			if (!SUPPORTED_EXT.has(ext)) {
				if (ext !== ".txt" && ext !== ".md") rejected.push({ file: entry.name, reason: `不支持的扩展名 ${ext || "(无)"}` });
				continue;
			}
			let stats;
			try {
				stats = fs.statSync(filePath);
			} catch {
				continue;
			}
			if (stats.size === 0) {
				rejected.push({ file: entry.name, reason: "空文件" });
				continue;
			}
			const parsed = familyOf(filePath, stats);
			if (parsed.collection) {
				rejected.push({ file: entry.name, reason: "该 .ttf/.otf 实为 TrueType 字体集合（TTC），浏览器无法通过 @font-face 加载" });
				continue;
			}
			const family = parsed.family;
			if (family === null || family === "") {
				rejected.push({ file: entry.name, reason: "无法确定字体家族名（文件可能已损坏）" });
				continue;
			}
			const hash = createHash("sha1")
				.update(`${entry.name}:${String(stats.size)}:${String(Math.round(stats.mtimeMs))}`)
				.digest("hex")
				.slice(0, 8);
			const familySlug = slug(family).slice(0, 40) || "font";
			candidates.push({
				id: `${familySlug}-${hash}`,
				family,
				file: entry.name,
				dir,
				format: ext.slice(1),
				bytes: stats.size,
				// A file named after its own family is the better keeper.
				exact: slug(path.basename(entry.name, ext)) === slug(family)
			});
		}
	}

	// One family, one slot: the file whose name matches the family wins, then the
	// shorter name, then the earlier name. Deterministic, and the losers are
	// reported instead of silently vanishing.
	const byFamily = new Map();
	for (const candidate of candidates) {
		const list = byFamily.get(candidate.family);
		if (list === undefined) byFamily.set(candidate.family, [candidate]);
		else list.push(candidate);
	}
	const fonts = [];
	for (const [family, list] of byFamily) {
		list.sort((a, b) => (Number(b.exact) - Number(a.exact)) || (a.file.length - b.file.length) || a.file.localeCompare(b.file));
		fonts.push(list[0]);
		for (const loser of list.slice(1)) {
			rejected.push({ file: loser.file, reason: `字体家族「${family}」已由 ${list[0].file} 提供` });
		}
	}
	fonts.sort((a, b) => a.family.localeCompare(b.family));
	return { fonts: fonts.slice(0, MAX_FONTS), rejected };
}

/**
 * A short signature of the current font set, so the browser half can tell
 * whether a refresh changed anything.
 * @param {Array<{id: string, bytes: number}>} fonts - scanned fonts.
 * @returns {string} signature.
 */
export function fontSignature(fonts) {
	return createHash("sha1").update(fonts.map((f) => `${f.id}:${String(f.bytes)}`).join("|")).digest("hex").slice(0, 12);
```

</details>

**依据 2 · 源码核查**：[index.js:375-437](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/index.js#L375-L437)

状态读取、revision 加一及 .tmp 后 rename。

<details>
<summary>查看原文（63行）</summary>

```text
export function loadState() {
	/** @type {{ revision: number, config: object | null, updatedAt: string | null, present: boolean }} */
	const absent = { revision: 0, config: null, updatedAt: null, present: false };
	let raw;
	try {
		raw = fs.readFileSync(stateFile(), "utf8");
	} catch {
		return absent;
	}
	try {
		const parsed = JSON.parse(raw);
		if (parsed === null || typeof parsed !== "object") return absent;
		const config = parsed.config;
		return {
			revision: Number.isFinite(parsed.revision) ? Math.max(0, Math.floor(parsed.revision)) : 0,
			config: config !== null && typeof config === "object" && !Array.isArray(config) ? config : null,
			updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
			present: true
		};
	} catch {
		return absent;
	}
}

/**
 * Write the shared state, bumping the revision so pollers notice.
 * @param {object | null} config - the full browser config, or null for defaults.
 * @returns {{ revision: number, config: object | null, updatedAt: string | null, present: boolean }} the stored state.
 */
export function saveState(config) {
	const previous = loadState();
	const next = {
		revision: previous.revision + 1,
		config: config === null || typeof config !== "object" || Array.isArray(config) ? null : config,
		updatedAt: new Date().toISOString(),
		present: true
	};
	try {
		const file = stateFile();
		fs.mkdirSync(path.dirname(file), { recursive: true });
		// Write-then-rename: a crash mid-write can never leave a half state file.
		const temp = `${file}.tmp`;
		fs.writeFileSync(temp, `${JSON.stringify(next, null, 2)}\n`, "utf8");
		fs.renameSync(temp, file);
	} catch {
		// Unwritable home: the browser keeps its own localStorage copy.
	}
	return next;
}

/**
 * Merge a partial patch onto the stored config, honouring the null (defaults)
 * base and dropping unknown keys is left to the browser half's normalizer —
 * this half only guarantees the object stays a plain, bounded JSON object.
 * @param {object} patch - the keys to set.
 * @returns {{ revision: number, config: object | null, updatedAt: string | null }} the stored state.
 */
export function patchState(patch) {
	const current = loadState().config;
	const merged = { ...(current ?? {}), ...patch };
	return saveState(merged);
}
//#endregion
```

</details>

**依据 3 · 源码核查**：[client.js:708-820](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/client.js#L708-L820)

客户端 fetch 状态、播种及更新路径。

<details>
<summary>查看原文（113行）</summary>

```text
		 * @param {object} [init] - fetch init.
		 * @returns {Promise<any | null>} parsed body or null.
		 */
		async function fetchJson(url, init) {
			try {
				const response = await window.fetch(url, init);
				if (response === undefined || response === null || response.ok !== true) return null;
				return await response.json();
			} catch {
				return null;
			}
		}

		/**
		 * Apply a host state revision when it is newer than the last applied one.
		 * @param {any} state - a `/state` or manifest `state` payload.
		 * @returns {boolean} whether anything was applied.
		 */
		function applyState(state) {
			if (state === null || typeof state !== "object") return false;
			// "No state file yet" is not "the user asked for defaults": keeping the
			// browser's own config is what makes an upgrade non-destructive.
			if (state.present === false) return false;
			const revision = Number.isFinite(state.revision) ? state.revision : -1;
			if (revision <= appliedRevision) return false;
			appliedRevision = revision;
			// A null config is an explicit "/style recover": back to defaults.
			cfgRef = normalizeConfig(state.config === null || state.config === undefined ? {} : state.config);
			saveConfig(cfgRef); // cache for the next first paint
			applyCss(cfgRef);
			renderPreview(cfgRef);
			notifySubscribers();
			return true;
		}

		/**
		 * Seed the host state from this browser's config the first time we meet it,
		 * so a later `/style contrast 3` merges onto what the user actually has
		 * instead of onto defaults.
		 * @returns {Promise<void>} resolves once the write answered (or failed).
		 */
		async function seedHost() {
			const state = await fetchJson(`${ROUTE_BASE}/state`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ config: cfgRef })
			});
			if (state !== null && Number.isFinite(state.revision)) appliedRevision = state.revision;
		}

		/**
		 * Read the manifest once: the font set, the drop folders, and the state.
		 * @returns {Promise<void>} resolves once applied.
		 */
		async function loadFromHost() {
			const manifest = await fetchJson(`${ROUTE_BASE}/manifest`);
			if (manifest === null) {
				hostMode = false;
				return;
			}
			hostMode = true;
			const signature = typeof manifest.signature === "string" ? manifest.signature : "";
			if (signature !== manifestSignature) {
				manifestSignature = signature;
				customFonts = cleanFonts(manifest.fonts);
				customRejected = Array.isArray(manifest.rejected)
					? manifest.rejected.filter((entry) => entry !== null && typeof entry === "object").slice(0, 50)
					: [];
				customDirs = Array.isArray(manifest.dirs) ? manifest.dirs.filter((dir) => typeof dir === "string").slice(0, 4) : [];
				applyFontFaces();
				notifySubscribers();
			}
			if (applyState(manifest.state ?? null) === false && manifest.state?.present === false) {
				await seedHost();
			}
		}

		/**
		 * Poll the lightweight state route so a `/style` command lands within about
		 * a second. Hidden tabs skip the round trip entirely.
		 * @returns {Promise<void>} resolves once checked.
		 */
		async function pollHostState() {
			if (typeof document.visibilityState === "string" && document.visibilityState !== "visible") return;
			const state = await fetchJson(`${ROUTE_BASE}/state`);
			if (state === null) return;
			hostMode = true;
			applyState(state);
		}

		/** Re-read the folder (the card's "重新扫描" button). */
		async function rescanFonts() {
			manifestSignature = "";
			await loadFromHost();
			notifySubscribers();
		}

		/** Persist to the host, coalescing a slider drag into one write. */
		function scheduleHostWrite() {
			if (!hostMode) return;
			if (postTimer !== null) window.clearTimeout(postTimer);
			postTimer = window.setTimeout(async () => {
				postTimer = null;
				// Fold in any host change that has not reached us yet (e.g. a /style
				// command issued just before this edit), so a stale local config can
				// never overwrite it.
				await pollHostState();
				const state = await fetchJson(`${ROUTE_BASE}/state`, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ config: cfgRef })
				});
				// Record the revision we caused so the next poll does not echo it back.
```

</details>

**依据 4 · 源码核查**：[client.js:1238-1250](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/client.js#L1238-L1250)

客户端轮询状态定时器。

<details>
<summary>查看原文（13行）</summary>

```text
			applyCss(cfgRef);
			mountPreview(cfgRef);
			renderPreview(cfgRef);

			// The host channel: fetch the custom fonts and the shared state, then
			// poll for tiny state-only changes so a `/style` command lands without a
			// refresh. Polling stops with the fiber and skips hidden tabs.
			void loadFromHost();
			const pollTimer = window.setInterval(() => { void pollHostState(); }, HOST_POLL_MS);
			const onVisible = () => { if (document.visibilityState === "visible") void pollHostState(); };
			document.addEventListener("visibilitychange", onVisible);

			ctx.effect(() => () => {
```

</details>

#### 缺口

- 未用多标签页/命令并发与写入失败测试状态同步。
  **影响**：可能丢失配置更新或客户端显示与文件不一致。
  **进一步探讨**：交错双写与不可写目录/崩溃注入，比较响应、文件和 UI 状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 无认证 Web 路由与写入失败的边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

本组件 GET manifest/state/font handler 未独立认证，字体 ID 白名单限制路径；POST /state 检查 JSON Content-Type 和 Origin 与 Host 同源，但明确允许无 Origin 请求。若 DSH Web 被绑定到 LAN、请求可达且外层未另设身份校验，非浏览器客户端可发送无 Origin 的 JSON POST 改写样式状态；这形成条件性的未授权配置变更路径，不是源码已证明发生的远程代码执行。saveState 捕获磁盘错误并仍返回 next，路由可报 200、命令也可能声称成功而持久化未发生。README 已承认无认证和 LAN 可读，写入保护只覆盖普通跨站浏览器请求。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:619-638](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/index.js#L619-L638)

sameOriginJson 接受无 Origin 的 application/json 请求。

<details>
<summary>查看原文（20行）</summary>

```text
 * The routes are unauthenticated by design (the webserver is loopback-only
 * unless an operator deliberately binds `0.0.0.0`), so writes are additionally
 * gated on a same-origin `Origin` and a JSON content type — a cross-site form
 * or `fetch` cannot satisfy both without a CORS preflight this server never
 * grants.
 * @param {import('node:http').IncomingMessage} req - the request.
 * @returns {boolean} whether the write is allowed.
 */
function sameOriginJson(req) {
	const type = String(req.headers["content-type"] ?? "");
	if (!type.toLowerCase().includes("application/json")) return false;
	const origin = req.headers.origin;
	if (typeof origin !== "string" || origin === "") return true; // curl / same-origin without Origin
	try {
		return new URL(origin).host === req.headers.host;
	} catch {
		return false;
	}
}

```

</details>

**依据 2 · 源码核查**：[index.js:674-716](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/index.js#L674-L716)

无认证 GET/POST 状态路由。

<details>
<summary>查看原文（43行）</summary>

```text
export async function handleRoute(req, res) {
	try {
		const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "127.0.0.1"}`);
		const pathname = url.pathname;
		const method = (req.method ?? "GET").toUpperCase();

		if (pathname === `${ROUTE_BASE}/manifest` && method === "GET") {
			sendJson(res, 200, manifestPayload());
			return;
		}
		if (pathname === `${ROUTE_BASE}/state`) {
			if (method === "GET") {
				sendJson(res, 200, loadState());
				return;
			}
			if (method === "POST") {
				if (!sameOriginJson(req)) {
					sendJson(res, 403, { error: "forbidden" });
					return;
				}
				const body = await readBody(req);
				if (body === null) {
					sendJson(res, 413, { error: "body too large" });
					return;
				}
				let parsed;
				try {
					parsed = JSON.parse(body);
				} catch {
					sendJson(res, 400, { error: "invalid json" });
					return;
				}
				if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
					sendJson(res, 400, { error: "expected a config object" });
					return;
				}
				const mode = parsed.mode === "recover" ? "recover" : "set";
				const state = mode === "recover" ? saveState(null) : saveState(parsed.config);
				sendJson(res, 200, state);
				return;
			}
			sendJson(res, 405, { error: "method not allowed" });
			return;
```

</details>

**依据 3 · 源码核查**：[index.js:404-422](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/index.js#L404-L422)

落盘错误被吞且返回成功形态。

<details>
<summary>查看原文（19行）</summary>

```text
export function saveState(config) {
	const previous = loadState();
	const next = {
		revision: previous.revision + 1,
		config: config === null || typeof config !== "object" || Array.isArray(config) ? null : config,
		updatedAt: new Date().toISOString(),
		present: true
	};
	try {
		const file = stateFile();
		fs.mkdirSync(path.dirname(file), { recursive: true });
		// Write-then-rename: a crash mid-write can never leave a half state file.
		const temp = `${file}.tmp`;
		fs.writeFileSync(temp, `${JSON.stringify(next, null, 2)}\n`, "utf8");
		fs.renameSync(temp, file);
	} catch {
		// Unwritable home: the browser keeps its own localStorage copy.
	}
	return next;
```

</details>

**依据 4 · 作者声明**：[README.md:69-74](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/README.md#L69-L74)

作者说明状态/字体路由不带认证及 LAN 可读。

```text
## 数据与安全

- 设置存在 **`$DSH_HOME/type-tune.json`**，是聊天命令与设置卡**唯一**的共享真相源；浏览器另存一份 `localStorage` 仅作首帧缓存。宿主的 `webserver` 不可用时（桌面端 / Electron）自动退回纯 `localStorage` 模式。
- 状态文件里有一个 `present` 标志：区分「还没有状态文件」与「用户主动恢复了默认」。**升级不会覆盖你已有的设置**——首次联通时反而会把你现有的配置播种给宿主，这样后续 `/style` 的改动是在你的真实配置上叠加，而不是叠在默认值上。
- 宿主半开的 `prefix` 路由是**只读优先**的：`GET` 供页面读取字体与状态；唯一的写入口 `POST /state` 额外要求 `Content-Type: application/json` 且 `Origin` 与 `Host` 同源，跨站表单/请求拿不到这个组合（不授予任何 CORS 预检）。字体 id 也做了白名单校验，路径穿越无效。
- 该路由**不带认证**：默认只在回环地址可用；如果你把 DSH 绑到 `0.0.0.0`，字体与状态对那个网络可读（写入仍受同源保护）。
```

#### 缺口

- 未在真实网络绑定/代理环境验证 Host 认证边界。
  **影响**：实际可访问范围取决于 DSH Web 部署配置。
  **进一步探讨**：隔离 LAN 用无 Origin 请求和不可写目录测试状态/响应。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用时如何验证可读性与部署条件？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合自用、仅回环访问的 DSH Web 先试用。选择壁纸与亮暗主题测量次级文字/链接/标题的真实对比和可读性，并在低配置设备、长 Markdown 中观察动画开销；自定义字体需核来源和许可证。若提供 LAN/多人访问，应先给写路由增加认证，报告持久化失败，并处理并发写/版本冲突；当前只实现同源浏览器保护。安装后用 `/style recover` 与移除/状态删除验证回滚。作者提到三套离线测试但测试文件在未发布的 dev/，本轮不可复核。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:76-107](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/README.md#L76-L107)

作者说明动画取舍、回滚与未发布 dev/ 测试。

<details>
<summary>查看原文（32行）</summary>

````text
## 已知取舍（重要）

- 彩色循环 / 描边会牺牲 Windows ClearType 次像素锐度，且天然与高对比冲突；插件默认只在标题/强调/链接等少量节点上启用。
- 「正文特效」会显著增加渲染开销，长文本请慎用（UI 有警告）。
- 字体文件通过 `@font-face` 按需加载（`font-display: swap`），首次选择某个自定义字体时会有一次极短的切换。

## 回滚

```bash
dsh plugin --profile 0.1.7-rc.2 remove dsh-type-tune
```

或只清掉状态与本地偏好：

```bash
del %USERPROFILE%\.dsh\type-tune.json
```

浏览器控制台：`localStorage.removeItem('dsh-type-tune:v1')` 后刷新。

## 开发

- 零构建：`index.js`（宿主半）+ `client.js`（`window.__ModuleLoader__.load` 包裹的浏览器半）。
- 语法检查：`node --check index.js && node --check client.js`。
- 三套离线测试（全部无依赖、无需 DSH 进程）。
  **说明**：测试文件位于作者开发工作区的 `dev/` 目录，**不随本仓库发布**；下表记录的是本插件实际被验证过的范围。

| 命令 | 覆盖 |
|---|---|
| `node dev/test-host.mjs` | 用**真实系统字体**验证 `name` 表解析（Georgia / Consolas / Noto Sans SC）、`.ttc` 与损坏文件拒绝、目录扫描与同名家族仲裁、状态读写、全部 `/style` 子命令、路由（含 CSRF 与路径穿越拒绝）、字体字节、无 webserver 宿主的降级 |
| `node dev/test.mjs` | 浏览器半：vm 加载、种子词约束（守住曾导致 boot 失败的那条 require）、配置归一化与 CSS 注入、字体值反注入、降级路径 |
| `node dev/test-integration.mjs` | **端到端**：把浏览器半的 `fetch` 直接桥接到真实路由处理器，验证「升级不丢设置并把配置播种给宿主 → manifest 变成 `@font-face` → 字体路由返回正确字节 → 卡片写入落到状态文件 → `/style` 回流到页面 → `/style recover` 清空覆盖」 |
````

</details>

**依据 2 · 源码核查**：[index.js:404-437](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/index.js#L404-L437)

状态写盘及补丁合并。

<details>
<summary>查看原文（34行）</summary>

```text
export function saveState(config) {
	const previous = loadState();
	const next = {
		revision: previous.revision + 1,
		config: config === null || typeof config !== "object" || Array.isArray(config) ? null : config,
		updatedAt: new Date().toISOString(),
		present: true
	};
	try {
		const file = stateFile();
		fs.mkdirSync(path.dirname(file), { recursive: true });
		// Write-then-rename: a crash mid-write can never leave a half state file.
		const temp = `${file}.tmp`;
		fs.writeFileSync(temp, `${JSON.stringify(next, null, 2)}\n`, "utf8");
		fs.renameSync(temp, file);
	} catch {
		// Unwritable home: the browser keeps its own localStorage copy.
	}
	return next;
}

/**
 * Merge a partial patch onto the stored config, honouring the null (defaults)
 * base and dropping unknown keys is left to the browser half's normalizer —
 * this half only guarantees the object stays a plain, bounded JSON object.
 * @param {object} patch - the keys to set.
 * @returns {{ revision: number, config: object | null, updatedAt: string | null }} the stored state.
 */
export function patchState(patch) {
	const current = loadState().config;
	const merged = { ...(current ?? {}), ...patch };
	return saveState(merged);
}
//#endregion
```

</details>

**依据 3 · 源码核查**：[client.js:322-355](https://github.com/AWL-MC2/DSH-Plugin_awl/blob/02b8cec919d8857187eef74cf7bb6dc7fd7ddc19/client.js#L322-L355)

对比与特效 CSS 生成。

<details>
<summary>查看原文（34行）</summary>

```text
		/** Token/global rules (contrast, halo, fonts). */
		function buildGlobalCss(cfg) {
			const rules = [];
			const lv = CONTRAST_LEVELS[cfg.contrast] || CONTRAST_LEVELS[0];
			const tokenDecls = [];
			if (lv.secondary > 0) tokenDecls.push("--dsw-alias-label-secondary: " + contrastMix(lv.secondary) + ";");
			if (lv.tertiary > 0) tokenDecls.push("--dsw-alias-label-tertiary: " + contrastMix(lv.tertiary) + ";");
			if (lv.caption > 0) tokenDecls.push("--dsw-alias-label-caption: " + contrastMix(lv.caption) + ";");
			if (tokenDecls.length > 0) {
				// Emit on both `body` and the dark palette selector so a later
				// stylesheet wins the cascade in BOTH color schemes.
				rules.push("body, body[data-ds-dark-theme] { " + tokenDecls.join(" ") + " }");
			}

			if (cfg.halo > 0) {
				const h = cfg.halo;
				rules.push("body:not([data-ds-dark-theme]) " + MARKDOWN_SCOPE + ", body:not([data-ds-dark-theme]) [data-text-shimmer] { text-shadow: " + HALO_LIGHT[h] + "; }");
				rules.push("body[data-ds-dark-theme] " + MARKDOWN_SCOPE + ", body[data-ds-dark-theme] [data-text-shimmer] { text-shadow: " + HALO_DARK[h] + "; }");
			}

			const uiStack = resolveUiStack(cfg.uiFont);
			const codeStack = resolveCodeStack(cfg.codeFont);
			const fontDecls = [];
			if (uiStack !== null) fontDecls.push("--dsw-font-family: " + uiStack + ";");
			if (codeStack !== null) fontDecls.push("--ds-font-family-code: " + codeStack + ";");
			if (fontDecls.length > 0) rules.push(":root, body { " + fontDecls.join(" ") + " }");

			return rules;
		}

		/** Scoped rules (content rules + effects) under one scope selector. */
		function buildScopedCss(cfg, scope) {
			const rules = [];

```

</details>

#### 缺口

- 缺少独立视觉、性能和真实宿主测试。
  **影响**：不能给出普遍可读性提升或开销结论。
  **进一步探讨**：在目标 DSH 版本上截图/计帧并测多主题 WCAG 对比。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
