# dsh-chat-width

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5d61f65](https://github.com/764475881/dsh-chat-width/tree/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/764475881/dsh-chat-width)
<!-- END META -->

> **功能**：为旧版 DSH web 扩大聊天内容列并提供拖拽调宽，检测到新版原生把手时让位。

> **亮点**：旧版把一个宽度变量、右缘拖拽和持久化组成协调调宽路径；相对用户手工改 CSS 有便利。新版原生实现不属于插件增量。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：原生检测依赖 DOM 特征；cleanup 移除 style 与把手，却未撤销旧版路径写在 root 上的内联变量，热禁用后可能残留宽度。未在本轮复现。详见[Q03](#research-q03)。

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
  - [Q01 · 谁仍需要它，交付何种宽度体验？](#detail-section-11)
  - [Q02 · 宽度变量、把手和记忆怎样工作？](#detail-section-12)
  - [Q03 · 自动让位与卸载是否完全可靠？](#detail-section-13)
  - [Q04 · 安装、持续维护和效果成本有哪些证据？](#detail-section-14)
  - [Q05 · 应如何采用，哪项改进假设值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：仍用 DSH 0.1.7 前 web 版本、希望在宽屏调节正文宽度的用户。

旧版 DSH 固定较窄文字列，用户可接受原样或手工 CSS；新版 DSH 已提供原生宽度把手。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 变量调宽 | 同步正文和输入栏宽度 | 旧版 DOM 与变量约定 |
| 拖拽与记忆 | 交互调宽并存 localStorage | PointerEvent 和页面持久化 |
| 原生让位 | 新版避免重复把手 | 依赖特征检测，非硬版本判断 |
| 控制台助手 | 输入具体宽度 | 新旧版本写不同变量和键 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH web 客户端模块 | 必需 | 装载 client.js | 纯 host 无功能 |
| 旧版宽度变量与根节点 | 旧版效果必需 | 覆写正文/输入栏宽度 | DOM 变化可能失效 |
| localStorage、PointerEvent、MutationObserver | 交互必需 | 记忆、拖拽、延后挂载 | 失败时调节/记忆受限 |
| 新版原生把手/钩子 | 让位条件 | 避免重复 UI | 检测依赖 DOM 特征 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 核版本 | 用户确认 DSH 是否已原生调宽 | 0.1.7+ 优先原生 |
| 旧版安装 | 用户按核实来源安装并重启 web | 把手出现，正文/输入栏同步 |
| 调节 | 拖右缘或用控制台助手 | 宽度在 520~2400 范围记忆 |
| 退出 | 移除 bundle/重启并核样式 | style、把手和内联变量恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地浏览器资源，现金未知 | 安装、重启、调宽和查排版 | 旧版宿主匹配未验 |
| 持续使用 | DOM 观察与样式资源未测 | 跟踪宿主版本与选择器变化 | 新版原生使插件价值下降 |
| 失败恢复 | 重载资源未知 | 移除插件、核内联变量及原生把手 | 热禁用残留未验证 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 旧版调宽 | CSS 与拖拽源码可见 | 实际排版和阅读效率 |
| 宽度记忆 | localStorage 写/读路径可见 | 多 profile 和热重载下的一致性 |
| 新版让位 | DOM 检测与移除路径可见 | 初始加载/误检测和卸载残留 |

> **思考**：原生检测依赖 DOM 特征；cleanup 移除 style 与把手，却未撤销旧版路径写在 root 上的内联变量，热禁用后可能残留宽度。未在本轮复现。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：旧版把一个宽度变量、右缘拖拽和持久化组成协调调宽路径；相对用户手工改 CSS 有便利。新版原生实现不属于插件增量。详见[Q01](#research-q01)、[Q02](#research-q02)。

共享 CSS 变量使多处宽度联动，2× 映射让右缘把手跟指针同步；MutationObserver 与 raf 合并挂载。自动让位基于 DOM 特征，而 root 内联变量未在 cleanup 撤回，设计说明的无残留主张需限缩。

<a id="detail-section-5"></a>

### 1.4 主要限制

原生检测依赖 DOM 特征；cleanup 移除 style 与把手，却未撤销旧版路径写在 root 上的内联变量，热禁用后可能残留宽度。未在本轮复现。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前组件推荐观察。新版用户用原生调宽；旧版需要者可核安装、正文/输入栏同步与禁用恢复后再小范围试用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

旧版 CSS 与把手机制有源码支持；新版原生替代及热禁用完整恢复未在本轮宿主验证；版本门控改进是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/client.js、lib/index.js、docs/DESIGN.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取固定提交 README、设计说明、package 与客户端源码；未在旧版或新版 DSH 执行。
- 下一步：在 DSH 0.1.7 前后和冲突 DOM 下检验把手、选择器、热禁用残留及同任务阅读，区分旧版增量与新版原生能力。

**分析版本**

- **仓库**：[764475881/dsh-chat-width](https://github.com/764475881/dsh-chat-width)
- **版本号**：0.1.2（[固定提交 5d61f65](https://github.com/764475881/dsh-chat-width/tree/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd)）
- **版本日期**：2026-09-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可用宿主版本/公开能力与 DOM 双门控，并在卸载时仅撤销本实例内联变量；以旧版、新版和冲突 DOM 比较误让位、重复 UI 与残留。当前未实现。详见[Q05](#research-q05)。

在 DSH 0.1.7 前后和冲突 DOM 下检验把手、选择器、热禁用残留及同任务阅读，区分旧版增量与新版原生能力。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 153 | — | — | 1776 |
| .js | source | 2 | 292 | 228 | 46 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/764475881/dsh-chat-width/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/764475881/dsh-chat-width/issues?q=is%3Aissue+created%3A2026-09-22T05%3A15%3A16.078Z..2026-10-22T05%3A15%3A16.078Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/764475881/dsh-chat-width/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A15%3A16.078Z..2026-10-22T05%3A15%3A16.078Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本宽度插件对旧版 DSH 的实际增量、对新版原生功能的让位条件与维护成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁仍需要它，交付何种宽度体验？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本包最明确的人群是仍使用 DSH web 0.1.7 之前版本、在宽屏上认为旧文字列过窄的人。作者称旧版把正文宽度设为 748px；插件默认覆写至 1040px，并提供右缘拖拽与控制台助手，值记入 localStorage。合格结果是正文、输入框和工具栏在同一布局变量下协调变宽，拖拽能保持居中且重开会话后宽度可恢复，而不是单独把某个 DOM 元素撑开。旧版直接替代是接受原宽度或手工改浏览器 CSS。

README 又明确声明 DSH 0.1.7+ 已内置宽度把手和自己的偏好键，新版用户应直接使用原生功能。此插件在检测原生把手时移除自己样式与把手，但仍保留控制台助手转写原生钩子。因此本包的实用增量有明确时间和宿主版本窗口；不能把新版原生能力记为插件贡献，也不能把插件仍能加载解释为新版值得安装。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-14](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/README.md#L1-L14)

作者界定旧版需求与新版原生替代。

<details>
<summary>查看原文（14行）</summary>

```text
# dsh-chat-width

> **dsh 0.1.7+ 已内置本功能**：新版自带会话宽度把手（文字列左右两侧的全高把手，拖拽即调宽，
> 偏好存于 localStorage 键 `dsh.conversation.contentWidth`）。插件在检测到内置实现时会**自动
> 让位**（不注入样式、不渲染自己的把手），因此在新版上它等同不存在——直接拖内置把手即可。
> 本插件现在只对 **dsh < 0.1.7** 有意义。详见 [CHANGELOG](CHANGELOG.md)。

调宽 dsh 网页会话区的聊天内容宽度。旧版 dsh 把会话文字列限制在 **748px**，在大屏上左右浪费大量空间；本插件通过客户端 CSS 把 `--dsh-chat-content-width` 覆盖为 **1040px**（默认值，可调）。

输入框、底部工具栏等宽度由同一变量派生（`calc(var(--dsh-chat-content-width) + 32px)`），会自动跟着变宽。

## 调整宽度

两种方式，任选其一：
```

</details>

**依据 2 · 作者声明**：[README.md:15-32](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/README.md#L15-L32)

作者描述拖拽、控制台助手与持久化入口。

<details>
<summary>查看原文（18行）</summary>

````text

1. **拖拽把手**（推荐）：会话文字列**右缘**（垂直中点）有一个细长的竖向把手，鼠标按住左右拖动即可实时调整宽度，松开自动记忆。**双击把手恢复默认值 1040px**。把手的半透明样式与主题融合，悬停/拖动时高亮。
2. **控制台**（F12）：

   ```js
   __setChatWidth(960)   // 任意值，范围 520~2400，立即生效
   __setChatWidth(1040)  // 恢复默认
   ```

   dsh 0.1.7+ 上该助手会自动改为驱动内置钩子（写 `dsh.conversation.contentWidth` + `--dsh-chat-user-width`）。

选择会记忆到 localStorage（键 `dsh_chat_width`），下次打开页面仍生效。

## 安装

**方式一：插件市场（推荐）** —— 在 dsh 网页的设置 → 插件市场中搜索 `dsh-chat-width`，一键安装。

**方式二：命令行**（dsh >= 0.1.0-rc.7）：
````

</details>

**依据 3 · 源码核查**：[lib/client.js:204-227](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/lib/client.js#L204-L227)

检测原生时让位，不注入旧样式。

<details>
<summary>查看原文（24行）</summary>

```text
		function apply(ctx) {
			ctx.effect(() => {
				let handle = null;
				let raf = 0;
				let yielded = false;

				// 让位给 dsh 内置实现：移除本插件注入的样式与把手
				const yieldToNative = () => {
					if (handle) { handle.remove(); handle = null; }
					document.querySelectorAll("style[data-dsh-chat-width]").forEach((s) => s.remove());
					if (!yielded) {
						yielded = true;
						console.info("[dsh-chat-width] 检测到 dsh 已内置聊天宽度把手（0.1.7+），本插件自动停用——直接拖拽文字列两侧的细长把手即可。");
					}
				};

				// 1) 注入样式（仅旧版 dsh；幂等：已存在则跳过）
				if (nativeWidthControls()) yieldToNative();
				else if (!document.querySelector("style[data-dsh-chat-width]")) {
					const style = document.createElement("style");
					style.dataset.dshChatWidth = "dsh-chat-width";
					style.textContent = pluginCSS();
					document.head.appendChild(style);
				}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宽度变量、把手和记忆怎样工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

旧版路径用 __ModuleLoader__ 注册客户端模块，ctx.effect 注入 style，把 .wSkVaW_root 或 [data-phase] 的 --dsh-chat-content-width 设为 localStorage 中的合法宽度，缺省 1040px、范围 520 到 2400。把手绝对定位在居中文字列的右缘；拖拽时用两倍指针位移改变量，使右缘与指针位移同速，并通过 pointer capture、松手后 persist 保存。双击恢复 1040。MutationObserver 监听 body 子树，遇到会话根出现或切换时通过 requestAnimationFrame 挂把手。

贡献是围绕一个共享 CSS 变量实现正文与输入区同步，而非逐个改 DOM 宽度；把右缘位移与居中列宽度变化的几何关系写入交互也是具体工程判断。设计说明称选择器兜底具有版本独立性，但 [data-phase] 仍是 DOM 约定，不能当作稳定公开 API。旧版与新版采用两个不同 localStorage 键，新版助手写 dsh.conversation.contentWidth 和 --dsh-chat-user-width，不能误称整个插件无任何行为。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:26-35](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/lib/client.js#L26-L35)

默认、范围与旧偏好键。

<details>
<summary>查看原文（10行）</summary>

```text
		const LS_CHAT_WIDTH = "dsh_chat_width";
		const CHAT_WIDTH_DEFAULT = 1040;
		const WIDTH_MIN = 520;
		const WIDTH_MAX = 2400;

		// 读取 localStorage 记忆值，越界时回退默认
		function chatContentWidth() {
			const v = Number(localStorage.getItem(LS_CHAT_WIDTH));
			return Number.isFinite(v) && v >= WIDTH_MIN && v <= WIDTH_MAX ? Math.round(v) : CHAT_WIDTH_DEFAULT;
		}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:57-73](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/lib/client.js#L57-L73)

CSS 变量与把手定位。

<details>
<summary>查看原文（17行）</summary>

```text
		function pluginCSS() {
			return [
				// ── 1) 宽度覆盖：会话根元素上的 --dsh-chat-content-width（dsh 默认 748px）──
				// 双类/双属性选择器把特异性提到 (0,2,0)，压过 dsh 自带定义，与样式加载顺序无关；
				// 若未来 dsh 版本改了类名哈希，[data-phase][data-phase] 兜底仍然命中会话根元素。
				".wSkVaW_root.wSkVaW_root,",
				"[data-phase][data-phase] {",
				"  --dsh-chat-content-width: " + chatContentWidth() + "px;",
				"  position: relative;",
				"}",
				"",
				// ── 2) 拖拽把手：锚定在文字列右缘（由 CSS 变量实时驱动，无需 JS 计算定位）──
				".dsh-cw-handle {",
				"  position: absolute;",
				"  top: 50%;",
				"  right: calc((100% - var(--dsh-chat-content-width)) / 2 - 7px);",
				"  width: 14px;",
```

</details>

**依据 3 · 源码核查**：[lib/client.js:123-201](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/lib/client.js#L123-L201)

拖拽、2× 映射、记忆和双击。

<details>
<summary>查看原文（79行）</summary>

```text
		function makeHandle() {
			const el = document.createElement("div");
			el.className = "dsh-cw-handle";
			el.title = "拖拽调整聊天宽度 · 双击恢复默认";
			const grip = document.createElement("div");
			grip.className = "dsh-cw-grip";
			const label = document.createElement("div");
			label.className = "dsh-cw-label";
			el.append(grip, label);

			let dragging = false;
			let startX = 0;
			let startWidth = CHAT_WIDTH_DEFAULT;

			const currentWidth = () => {
				const root = el.parentElement;
				if (!root) return chatContentWidth();
				const v = parseFloat(root.style.getPropertyValue("--dsh-chat-content-width"));
				return Number.isFinite(v) ? v : chatContentWidth();
			};

			const setWidth = (w) => {
				const root = el.parentElement;
				if (!root) return;
				const maxW = Math.max(WIDTH_MIN, root.clientWidth - 40);
				const v = Math.min(Math.max(Math.round(w), WIDTH_MIN), WIDTH_MAX, maxW);
				root.style.setProperty("--dsh-chat-content-width", v + "px");
				label.textContent = v + "px";
				return v;
			};

			const persist = () => {
				const root = el.parentElement;
				const v = root ? parseFloat(root.style.getPropertyValue("--dsh-chat-content-width")) : NaN;
				if (Number.isFinite(v) && v >= WIDTH_MIN && v <= WIDTH_MAX) {
					localStorage.setItem(LS_CHAT_WIDTH, String(Math.round(v)));
					document.querySelectorAll("style[data-dsh-chat-width]").forEach((s) => { s.textContent = pluginCSS(); });
				}
			};

			const onMove = (e) => {
				if (!dragging) return;
				// 2× 映射：文字列居中布局下，右缘位移 = 宽度变化的一半。
				// 宽度按指针位移的 2 倍变化，把手（锚定在右缘）才能 1:1 跟手，
				// 且列始终居中、松手无回弹。
				setWidth(startWidth + 2 * (e.clientX - startX));
			};
			const onUp = () => {
				if (!dragging) return;
				dragging = false;
				el.classList.remove("dragging");
				el.removeEventListener("pointermove", onMove);
				el.removeEventListener("pointerup", onUp);
				el.removeEventListener("pointercancel", onUp);
				persist();
			};
			const onDown = (e) => {
				e.preventDefault();
				dragging = true;
				startX = e.clientX;
				startWidth = currentWidth();
				el.classList.add("dragging");
				label.textContent = Math.round(startWidth) + "px";
				try { el.setPointerCapture(e.pointerId); } catch (err) { /* 旧浏览器忽略 */ }
				el.addEventListener("pointermove", onMove);
				el.addEventListener("pointerup", onUp);
				el.addEventListener("pointercancel", onUp);
			};
			const onDbl = () => {
				localStorage.setItem(LS_CHAT_WIDTH, String(CHAT_WIDTH_DEFAULT));
				document.querySelectorAll("style[data-dsh-chat-width]").forEach((s) => { s.textContent = pluginCSS(); });
				const root = el.parentElement;
				if (root) root.style.setProperty("--dsh-chat-content-width", CHAT_WIDTH_DEFAULT + "px");
				console.log("[dsh-chat-width] 已恢复默认宽度 " + CHAT_WIDTH_DEFAULT + "px");
			};

			el.addEventListener("pointerdown", onDown);
			el.addEventListener("dblclick", onDbl);
			return el;
```

</details>

**依据 4 · 源码核查**：[lib/client.js:229-269](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/lib/client.js#L229-L269)

观察器和新版控制台助手。

<details>
<summary>查看原文（41行）</summary>

```text
				// 2) 把手挂到会话根元素上；会话可能在 boot 后才挂载（hero 阶段），
				//    用 MutationObserver 跟随根元素出现/切换，并随时检测内置实现是否出现。
				const attach = () => {
					if (raf) return;
					raf = requestAnimationFrame(() => {
						raf = 0;
						if (nativeWidthControls()) { yieldToNative(); return; }
						const root = document.querySelector(".wSkVaW_root") || document.querySelector("[data-phase]");
						if (!root) return;
						if (handle && handle.parentElement === root) return;
						if (handle) handle.remove();
						handle = makeHandle();
						root.appendChild(handle);
					});
				};
				attach();
				const mo = new MutationObserver(attach);
				mo.observe(document.body, { childList: true, subtree: true });

				// 3) 控制台助手：window.__setChatWidth(px)（520~2400）
				window.__setChatWidth = (px) => {
					const v = Math.round(Number(px));
					if (!Number.isFinite(v) || v < WIDTH_MIN || v > WIDTH_MAX) {
						console.warn("[dsh-chat-width] __setChatWidth(px)：px 需为 " + WIDTH_MIN + "~" + WIDTH_MAX + " 的数值，当前值被忽略");
						return;
					}
					// 新版：写入 dsh 自己的偏好键 + 官方钩子
					if (nativeWidthControls()) {
						localStorage.setItem(LS_NATIVE_PREF, String(v));
						const body = document.querySelector(".wSkVaW_body");
						const target = body === null ? null : (body.parentElement ?? body);
						if (target) target.style.setProperty("--dsh-chat-user-width", v + "px");
						console.log("[dsh-chat-width] 已通过 dsh 内置钩子把宽度设为 " + v + "px（新版可直接拖拽两侧把手）");
						return;
					}
					localStorage.setItem(LS_CHAT_WIDTH, String(v));
					document.querySelectorAll("style[data-dsh-chat-width]").forEach((s) => { s.textContent = pluginCSS(); });
					const root = document.querySelector(".wSkVaW_root") || document.querySelector("[data-phase]");
					if (root) root.style.setProperty("--dsh-chat-content-width", v + "px");
					console.log("[dsh-chat-width] 聊天内容宽度已设为 " + v + "px（dsh 原生 748px，本插件默认 " + CHAT_WIDTH_DEFAULT + "px）");
				};
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动让位与卸载是否完全可靠？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

自动让位依赖 DOM 特征而非明确宿主版本。nativeWidthControls 若看到任何 [data-width-handle] 就返回 true；否则检查 .wSkVaW_root/[data-phase] 和 body 的计算后自定义属性。新页面初期根节点尚未出现时可能先注入旧样式，随后 body 观察器触发才撤掉；代码确有 yieldToNative 移除 style 和把手的路径。误匹配其它组件同名 data 属性、宿主改类名或变量布置，均可能导致错误让位或未让位，概率未知。

cleanup 断开 observer、取消 raf、移除把手和 style、删除全局助手；但拖拽和控制台助手在旧版路径给 root 写入内联 --dsh-chat-content-width，cleanup 没有逐个移除该内联属性。若宿主没有重建根节点，卸载后宽度可能残留；这与设计说明的“不残留任何全局副作用”不完全一致。localStorage 偏好也会保留，这是正常记忆却不应描述为完全无痕。源码无法证明插件在真实宿主热禁用和新版早期页面均正确恢复。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:37-55](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/lib/client.js#L37-L55)

原生检测以 DOM 特征和计算样式为条件。

<details>
<summary>查看原文（19行）</summary>

```text
		// ── 与 dsh 0.1.7+ 的兼容检测 ──────────────────────────────────────────
		// 新版把 --dsh-chat-content-width 定义在会话 body（.wSkVaW_body）上，而旧版定义在
		// 会话根元素（.wSkVaW_root）上——变量定义下沉后，在 root 上的覆盖会被 body 自身的
		// 声明遮蔽，这正是旧版插件在新版"拖了没反应"的原因。新版同时自带左右两个全高
		// 把手（[data-width-handle]）与官方钩子 --dsh-chat-user-width。
		// 检测到内置实现时，本插件彻底让位，不做任何覆盖。
		const LS_NATIVE_PREF = "dsh.conversation.contentWidth";

		function nativeWidthControls() {
			if (document.querySelector("[data-width-handle]") !== null) return true;
			const root = document.querySelector(".wSkVaW_root") || document.querySelector("[data-phase]");
			if (root === null) return false;
			const body = root.querySelector(".wSkVaW_body") || document.querySelector(".wSkVaW_body");
			if (body === null) return false;
			// 新版：变量只在 body 上定义 → body 非空而 root 为空；旧版两者同值（root 定义）
			const rootVar = getComputedStyle(root).getPropertyValue("--dsh-chat-content-width").trim();
			const bodyVar = getComputedStyle(body).getPropertyValue("--dsh-chat-content-width").trim();
			return bodyVar !== "" && rootVar === "";
		}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:144-160](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/lib/client.js#L144-L160)

旧版拖拽会写 root 内联变量。

<details>
<summary>查看原文（17行）</summary>

```text
			const setWidth = (w) => {
				const root = el.parentElement;
				if (!root) return;
				const maxW = Math.max(WIDTH_MIN, root.clientWidth - 40);
				const v = Math.min(Math.max(Math.round(w), WIDTH_MIN), WIDTH_MAX, maxW);
				root.style.setProperty("--dsh-chat-content-width", v + "px");
				label.textContent = v + "px";
				return v;
			};

			const persist = () => {
				const root = el.parentElement;
				const v = root ? parseFloat(root.style.getPropertyValue("--dsh-chat-content-width")) : NaN;
				if (Number.isFinite(v) && v >= WIDTH_MIN && v <= WIDTH_MAX) {
					localStorage.setItem(LS_CHAT_WIDTH, String(Math.round(v)));
					document.querySelectorAll("style[data-dsh-chat-width]").forEach((s) => { s.textContent = pluginCSS(); });
				}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:271-278](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/lib/client.js#L271-L278)

清理路径未清 root 内联变量。

```text
				return () => {
					mo.disconnect();
					if (raf) cancelAnimationFrame(raf);
					if (handle) handle.remove();
					document.querySelectorAll("style[data-dsh-chat-width]").forEach((s) => s.remove());
					if (window.__setChatWidth) delete window.__setChatWidth;
				};
			}, "dsh-chat-width: apply");
```

**依据 4 · 作者声明**：[docs/DESIGN.md:48-52](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/docs/DESIGN.md#L48-L52)

作者声称卸载不残留副作用，需与源码边界分开。

```text
## 生命周期

- 会话根元素在 boot 后才挂载（hero 阶段），插件用 `MutationObserver` 观察 `[data-phase]` 根元素的出现/切换，把把手挂到当前根元素上；换会话自动迁移。
- 所有宽度选择写入 localStorage（键 `dsh_chat_width`），刷新/换会话后仍生效。
- 插件卸载时移除样式与把手，不残留任何全局副作用（`__setChatWidth` 一并删除）。
```

#### 缺口

- 没有真实宿主热禁用、新版初始渲染与重名特征场景。
  **影响**：无法确认自动让位总成功或残余内联宽度会否持续。
  **进一步探讨**：在旧版/新版分别加载、拖拽、热禁用、切会话并检查 style、内联变量和原生把手。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、持续维护和效果成本有哪些证据？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

使用前需要支持 web client 模块的 DSH，旧版还需会话 DOM 保持 .wSkVaW_root 或 data-phase、共享宽度变量与输入栏派生关系。README 给市场、CLI 和本地 link 三种安装路径；命令是否在用户当前宿主可用本轮未验证。旧版首次要安装、重启、调整并确认正文/输入框没有溢出；持续成本是本地 body 子树观察、DOM 变更和宿主样式适配，现金成本没有证据。失败恢复可移除包并重启，若热禁用则需核内联变量是否残留。

源码证明存在 CSS 和拖拽路径，不证明阅读效率、视觉舒适、任务错误率有改善。README 的 748px 与 1040px 是作者布局口径，本轮没在固定宿主测量；旧版上更宽可能减少换行也可能降低长行可读性。新版已内置这一能力，继续安装插件增加检测和维护负担却难有独立增益。`node --check` 只验证 JS 语法，不能当布局或卸载验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:33-67](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/README.md#L33-L67)

作者给出安装、移除和实现范围。

<details>
<summary>查看原文（35行）</summary>

````text

```bash
dsh plugin --profile web add github:764475881/dsh-chat-width
```

**方式三：本地开发（link）**：

```bash
# 在 web profile 目录（~/.dsh/profiles/web）下
pnpm add link:/home/miku/dsh-chat-width
# 并在该 profile 的 package.json 中把 "dsh-chat-width" 加入 dsh.profile.bundles
# 然后重启 dsh web（新增 bundle 需重启生效）
```

卸载同理：从 `package.json` 的 dependencies 与 bundles 移除，`pnpm install`，重启。

## 原理

- 服务端占位 `lib/index.js`：空 `apply`，仅让 loader 行可挂载。
- 客户端 `lib/client.js`：注册为 DSH 客户端模块，注入 `<style>` 覆盖：
  - `.wSkVaW_root.wSkVaW_root`（当前 dsh 版本的会话根元素类名）
  - `[data-phase][data-phase]`（版本无关兜底选择器，特异性 (0,2,0) 压过 dsh 自带定义）
- 拖拽把手 `.dsh-cw-handle` 绝对定位锚定在文字列右缘：`right: calc((100% - var(--dsh-chat-content-width)) / 2 - 7px)`，宽度变化由 CSS 变量实时驱动，无需 JS 计算位置；pointer 事件 + setPointerCapture 完成拖拽，松手写入 localStorage。
- **跟手映射**：文字列居中布局下右缘位移 = 宽度变化的一半，因此拖拽时宽度按指针位移的 **2×** 变化，把手（锚定右缘）才能 1:1 跟随鼠标，且列始终居中、松手无回弹。
- 会话根元素可能在 boot 后才挂载（hero 阶段），插件用 MutationObserver 跟随根元素出现/切换并挂载把手。

详细设计决策见 [docs/DESIGN.md](docs/DESIGN.md)。

## 开发

```bash
node --check lib/client.js
```

改完 `lib/client.js` 后，运行中的 dsh 会在约 1 秒内通过 HMR 热替换（无需重启）。
````

</details>

**依据 2 · 源码核查**：[lib/client.js:220-278](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/lib/client.js#L220-L278)

旧版注入、观察、助手与清理路径。

<details>
<summary>查看原文（59行）</summary>

```text
				// 1) 注入样式（仅旧版 dsh；幂等：已存在则跳过）
				if (nativeWidthControls()) yieldToNative();
				else if (!document.querySelector("style[data-dsh-chat-width]")) {
					const style = document.createElement("style");
					style.dataset.dshChatWidth = "dsh-chat-width";
					style.textContent = pluginCSS();
					document.head.appendChild(style);
				}

				// 2) 把手挂到会话根元素上；会话可能在 boot 后才挂载（hero 阶段），
				//    用 MutationObserver 跟随根元素出现/切换，并随时检测内置实现是否出现。
				const attach = () => {
					if (raf) return;
					raf = requestAnimationFrame(() => {
						raf = 0;
						if (nativeWidthControls()) { yieldToNative(); return; }
						const root = document.querySelector(".wSkVaW_root") || document.querySelector("[data-phase]");
						if (!root) return;
						if (handle && handle.parentElement === root) return;
						if (handle) handle.remove();
						handle = makeHandle();
						root.appendChild(handle);
					});
				};
				attach();
				const mo = new MutationObserver(attach);
				mo.observe(document.body, { childList: true, subtree: true });

				// 3) 控制台助手：window.__setChatWidth(px)（520~2400）
				window.__setChatWidth = (px) => {
					const v = Math.round(Number(px));
					if (!Number.isFinite(v) || v < WIDTH_MIN || v > WIDTH_MAX) {
						console.warn("[dsh-chat-width] __setChatWidth(px)：px 需为 " + WIDTH_MIN + "~" + WIDTH_MAX + " 的数值，当前值被忽略");
						return;
					}
					// 新版：写入 dsh 自己的偏好键 + 官方钩子
					if (nativeWidthControls()) {
						localStorage.setItem(LS_NATIVE_PREF, String(v));
						const body = document.querySelector(".wSkVaW_body");
						const target = body === null ? null : (body.parentElement ?? body);
						if (target) target.style.setProperty("--dsh-chat-user-width", v + "px");
						console.log("[dsh-chat-width] 已通过 dsh 内置钩子把宽度设为 " + v + "px（新版可直接拖拽两侧把手）");
						return;
					}
					localStorage.setItem(LS_CHAT_WIDTH, String(v));
					document.querySelectorAll("style[data-dsh-chat-width]").forEach((s) => { s.textContent = pluginCSS(); });
					const root = document.querySelector(".wSkVaW_root") || document.querySelector("[data-phase]");
					if (root) root.style.setProperty("--dsh-chat-content-width", v + "px");
					console.log("[dsh-chat-width] 聊天内容宽度已设为 " + v + "px（dsh 原生 748px，本插件默认 " + CHAT_WIDTH_DEFAULT + "px）");
				};

				return () => {
					mo.disconnect();
					if (raf) cancelAnimationFrame(raf);
					if (handle) handle.remove();
					document.querySelectorAll("style[data-dsh-chat-width]").forEach((s) => s.remove());
					if (window.__setChatWidth) delete window.__setChatWidth;
				};
			}, "dsh-chat-width: apply");
```

</details>

**依据 3 · 源码核查**：[package.json:1-43](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/package.json#L1-L43)

包清单只提供 web bundle 与语法检查脚本。

<details>
<summary>查看原文（43行）</summary>

```text
{
  "name": "dsh-chat-width",
  "version": "0.1.2",
  "description": "调宽 dsh 网页会话区的聊天内容宽度（默认 748px → 1040px；右缘把手拖拽可调，控制台 __setChatWidth(px) 亦可）",
  "type": "module",
  "main": "lib/index.js",
  "scripts": {
    "check": "node --check lib/client.js && node --check lib/index.js"
  },
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "CHANGELOG.md",
    "LICENSE"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/764475881/dsh-chat-width.git"
  },
  "homepage": "https://github.com/764475881/dsh-chat-width",
  "bugs": {
    "url": "https://github.com/764475881/dsh-chat-width/issues"
  },
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "cordis",
    "chat-width",
    "ui"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 应如何采用，哪项改进假设值得验证？

**研究主题**：新假设与验证、采用判断、贡献与相对优势

#### 完整回答

对 DSH 0.1.7+ 用户，不推荐新增安装这个插件，直接使用原生宽度把手；这个判断基于作者说明和插件自己的让位逻辑，仍需以用户实际宿主版本为准。对无法升级的旧版宽屏用户，插件具备可控的局部试用价值，先检查正文与输入框同步、拖拽记忆和退出恢复；但总体组件推荐取观察，因为当前主流版本范围与真实宿主结果未核。无论旧版还是新版，辅助控制台助手都不应被误当作插件给新版新增的核心功能。

可以探索一个未实现的版本与 DOM 双重门控，明确读取宿主版本/公开能力标识，同时对未知布局完全退出；旧版卸载时只撤销本实例写入的 root 内联变量。最小验证在 0.1.7 前后和特征冲突 DOM 中比较误让位、重复把手、内联残留与正常拖拽，若提高误拒或破坏新版本原生偏好，则不值得采用。设计假设不能并入本版已有贡献。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-7](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/README.md#L1-L7)

作者声明新版有原生宽度功能，本插件仅旧版有意义。

```text
# dsh-chat-width

> **dsh 0.1.7+ 已内置本功能**：新版自带会话宽度把手（文字列左右两侧的全高把手，拖拽即调宽，
> 偏好存于 localStorage 键 `dsh.conversation.contentWidth`）。插件在检测到内置实现时会**自动
> 让位**（不注入样式、不渲染自己的把手），因此在新版上它等同不存在——直接拖内置把手即可。
> 本插件现在只对 **dsh < 0.1.7** 有意义。详见 [CHANGELOG](CHANGELOG.md)。

```

**依据 2 · 源码核查**：[lib/client.js:204-278](https://github.com/764475881/dsh-chat-width/blob/5d61f65224b1d811047d5eb1d9d4772dbf0e7bfd/lib/client.js#L204-L278)

源码中检测、让位与卸载边界是改进比较基线。

<details>
<summary>查看原文（75行）</summary>

```text
		function apply(ctx) {
			ctx.effect(() => {
				let handle = null;
				let raf = 0;
				let yielded = false;

				// 让位给 dsh 内置实现：移除本插件注入的样式与把手
				const yieldToNative = () => {
					if (handle) { handle.remove(); handle = null; }
					document.querySelectorAll("style[data-dsh-chat-width]").forEach((s) => s.remove());
					if (!yielded) {
						yielded = true;
						console.info("[dsh-chat-width] 检测到 dsh 已内置聊天宽度把手（0.1.7+），本插件自动停用——直接拖拽文字列两侧的细长把手即可。");
					}
				};

				// 1) 注入样式（仅旧版 dsh；幂等：已存在则跳过）
				if (nativeWidthControls()) yieldToNative();
				else if (!document.querySelector("style[data-dsh-chat-width]")) {
					const style = document.createElement("style");
					style.dataset.dshChatWidth = "dsh-chat-width";
					style.textContent = pluginCSS();
					document.head.appendChild(style);
				}

				// 2) 把手挂到会话根元素上；会话可能在 boot 后才挂载（hero 阶段），
				//    用 MutationObserver 跟随根元素出现/切换，并随时检测内置实现是否出现。
				const attach = () => {
					if (raf) return;
					raf = requestAnimationFrame(() => {
						raf = 0;
						if (nativeWidthControls()) { yieldToNative(); return; }
						const root = document.querySelector(".wSkVaW_root") || document.querySelector("[data-phase]");
						if (!root) return;
						if (handle && handle.parentElement === root) return;
						if (handle) handle.remove();
						handle = makeHandle();
						root.appendChild(handle);
					});
				};
				attach();
				const mo = new MutationObserver(attach);
				mo.observe(document.body, { childList: true, subtree: true });

				// 3) 控制台助手：window.__setChatWidth(px)（520~2400）
				window.__setChatWidth = (px) => {
					const v = Math.round(Number(px));
					if (!Number.isFinite(v) || v < WIDTH_MIN || v > WIDTH_MAX) {
						console.warn("[dsh-chat-width] __setChatWidth(px)：px 需为 " + WIDTH_MIN + "~" + WIDTH_MAX + " 的数值，当前值被忽略");
						return;
					}
					// 新版：写入 dsh 自己的偏好键 + 官方钩子
					if (nativeWidthControls()) {
						localStorage.setItem(LS_NATIVE_PREF, String(v));
						const body = document.querySelector(".wSkVaW_body");
						const target = body === null ? null : (body.parentElement ?? body);
						if (target) target.style.setProperty("--dsh-chat-user-width", v + "px");
						console.log("[dsh-chat-width] 已通过 dsh 内置钩子把宽度设为 " + v + "px（新版可直接拖拽两侧把手）");
						return;
					}
					localStorage.setItem(LS_CHAT_WIDTH, String(v));
					document.querySelectorAll("style[data-dsh-chat-width]").forEach((s) => { s.textContent = pluginCSS(); });
					const root = document.querySelector(".wSkVaW_root") || document.querySelector("[data-phase]");
					if (root) root.style.setProperty("--dsh-chat-content-width", v + "px");
					console.log("[dsh-chat-width] 聊天内容宽度已设为 " + v + "px（dsh 原生 748px，本插件默认 " + CHAT_WIDTH_DEFAULT + "px）");
				};

				return () => {
					mo.disconnect();
					if (raf) cancelAnimationFrame(raf);
					if (handle) handle.remove();
					document.querySelectorAll("style[data-dsh-chat-width]").forEach((s) => s.remove());
					if (window.__setChatWidth) delete window.__setChatWidth;
				};
			}, "dsh-chat-width: apply");
```

</details>

#### 缺口

- 版本/能力双门控和内联变量清理未实现、未比较误判代价。
  **影响**：只能作为待验证设计，不计现有能力或评分。
  **进一步探讨**：在明确旧版、新版和冲突 DOM 条件下比较重复 UI、误拒与退出后样式。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
