# dsh-message-copy-enhance

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9d85955](https://github.com/Asianfleet/dsh-message-copy-enhance/tree/9d8595501224621db5942fadddcbdb0efceba686)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Asianfleet/dsh-message-copy-enhance) [![npm 30d 1,109](https://img.shields.io/static/v1?label=npm+30d&message=1%2C109&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-message-copy-enhance) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-message-copy-enhance)
<!-- END META -->

> **功能**：将助手消息选区复制为 Markdown，恢复链接、LaTeX 源码和代码围栏。

> **亮点**：[Q01](#research-q01) 的具体增量是部分选区的格式恢复，[Q02](#research-q02) 将plain code、Shiki与KaTeX分别处理以减少可见文本复制的损失。DOM到Markdown是成熟技术，此处主要是宿主数据形状适配。

> **主要限制**：[Q03](#research-q03) 的限制是渲染结果不唯一反推出原稿；起点消息门槛和部分公式扩展也使选区语义需验收。源码分支不等于复杂复制无损。

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
  - [Q01 · 复制增强解决哪种交付问题？](#detail-section-11)
  - [Q02 · 选区如何进入剪贴板，代码和公式如何处理？](#detail-section-12)
  - [Q03 · DOM逆转换何时不能等于原始Markdown？](#detail-section-13)
  - [Q04 · 哪些用户可低范围试用，代价和停止条件是什么？](#detail-section-14)
  - [Q05 · 消息原始结构能否替代DOM逆转换？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向把模型回答粘贴到Markdown笔记、文稿或代码编辑器的用户。浏览器普通选区复制通常只保留可见文本，链接目标、数学TeX与代码语言可能丢失；合格交付是选定语义在目标编辑器仍可读且关键符号保真。此项将渲染DOM中的元信息重新编码成Markdown，属于格式恢复和宿主适配，未改变模型回答质量。相比复制整个原始消息，它支持部分选区，但部分结构在DOM中可能已丢失。

浏览器普通选区复制和原始消息复制；不与未核实同类插件作效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 选区Markdown复制 | 摘录技术回答 | 仅助手消息且有格式特征 |
| 公式源恢复 | 保留LaTeX | 依赖KaTeX annotation，部分选区会扩展 |
| 代码复制 | 保留围栏、语言与换行 | plain与Shiki分支，复杂选区需核对 |
| 链接恢复 | 保留链接目标 | DOM需含href |

#### 启动与依赖
| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web客户端加载器 | 必需 | 安装copy监听 | 无增强 |
| assistant属性与Markdown DOM | 必需 | 识别消息和结构 | 回默认或恢复不全 |
| 剪贴板事件数据 | 必需 | 写两种MIME | 保留默认复制 |
| KaTeX注解与Shiki行 | 特定格式必需 | 源码和换行恢复 | 保真未知 |

#### 启动步骤
| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 加载 | 用户安装并确认客户端 | 有激活标记 |
| 复制 | 用户选助手内容并复制 | 剪贴板含Markdown |
| 验收 | 用户粘贴常用编辑器 | 符号、URL与换行一致 |
| 退出 | 用户禁用插件 | 默认copy恢复 |

#### 成本
| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 客户端资源，费用未知 | 安装并检查格式，耗时未知 | Git来源可能需构建 |
| 持续使用 | copy时DOM遍历，无模型调用 | 特殊格式复核 | 大选区延迟未测 |
| 失败恢复 | 重新复制资源 | 禁用、保留原稿并手工补格式 | 复核时间未知 |

#### 效果
| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 链接恢复 | 读取href并编码 | 目标编辑器渲染保真 |
| 公式与代码 | KaTeX源与Shiki行分支 | 复杂跨节点选区 |
| 默认路径保护 | 门槛不符或异常回默认 | 各浏览器事件行为 |

> **思考**：[Q03](#research-q03) 的限制是渲染结果不唯一反推出原稿；起点消息门槛和部分公式扩展也使选区语义需验收。源码分支不等于复杂复制无损。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的具体增量是部分选区的格式恢复，[Q02](#research-q02) 将plain code、Shiki与KaTeX分别处理以减少可见文本复制的损失。DOM到Markdown是成熟技术，此处主要是宿主数据形状适配。

转换器与事件入口分开，UI装饰过滤和code原样路径有明确用途，适合借鉴到相同渲染栈；移植需确认Markdown方言及DOM shape，不能从独立零依赖推断零维护。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的限制是渲染结果不唯一反推出原稿；起点消息门槛和部分公式扩展也使选区语义需验收。源码分支不等于复杂复制无损。

<a id="detail-section-6"></a>

### 1.5 使用建议

经常摘录技术回答的人可先试，选取链接、公式和多行代码各一段，粘贴到常用编辑器并逐字核对URL、TeX和换行，再测试禁用后默认复制恢复。首次涉及客户端加载，持续在copy时遍历选区DOM，不调用模型；现金、延迟和人工复核时间没有实测值，不写为零。发布包和Git源码的构建路径不同，源码安装含prepare构建，需确认拿到可加载客户端。失败时可禁用并用原消息或手工复制；若静默丢掉代码符号、公式或链接目标，应停止自动依赖。它不适合要求逐字原始Markdown的归档流程。 [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

DOM转换和copy拦截有源码支持；复杂选区及目标编辑器效果未测；源映射是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/index.ts、src/client/toMarkdown.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定README、客户端入口、DOM转换与包声明。
- 下一步：- 已检查固定源码。
- 未执行测试或浏览器复制。
- 复杂选区、目标编辑器和发布包加载未验证。

**分析版本**

- **仓库**：[Asianfleet/dsh-message-copy-enhance](https://github.com/Asianfleet/dsh-message-copy-enhance)
- **版本号**：0.2.1（[固定提交 9d85955](https://github.com/Asianfleet/dsh-message-copy-enhance/tree/9d8595501224621db5942fadddcbdb0efceba686)）
- **版本日期**：2026-08-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出未验证的原始消息源区间映射。须用语义保真与维护量对照，如果动态内容映射持续失效便不优于当前分支恢复。

- 已检查固定源码。
- 未执行测试或浏览器复制。
- 复杂选区、目标编辑器和发布包加载未验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 285 | — | — | 2599 |
| .js | source | 1 | 20 | 3 | 14 | — |
| .mjs | source | 1 | 158 | 115 | 28 | — |
| .ts | source | 3 | 732 | 485 | 187 | — |
| .ts | test | 4 | 576 | 446 | 61 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/Asianfleet/dsh-message-copy-enhance/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：消息复制增强能否将复杂回答可靠转成Markdown供复用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 复制增强解决哪种交付问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向把模型回答粘贴到Markdown笔记、文稿或代码编辑器的用户。浏览器普通选区复制通常只保留可见文本，链接目标、数学TeX与代码语言可能丢失；合格交付是选定语义在目标编辑器仍可读且关键符号保真。此项将渲染DOM中的元信息重新编码成Markdown，属于格式恢复和宿主适配，未改变模型回答质量。相比复制整个原始消息，它支持部分选区，但部分结构在DOM中可能已丢失。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-30](https://github.com/Asianfleet/dsh-message-copy-enhance/blob/9d8595501224621db5942fadddcbdb0efceba686/README.md#L10-L30)

明确选区复制和格式恢复目标。

<details>
<summary>查看原文（21行）</summary>

```text
A DeepSeek Harness client UI plugin: **when you select text in a model message and copy it, the clipboard content is rewritten to Markdown**, so links, LaTeX source, code-fence language info, and more are no longer lost.

## How it works

DSH renders model output via `dsh-client-ui-conversation` → `dsh-client-ui-primitives`:

| Content | DOM shape | Recovery |
|---|---|---|
| Links | `<a href="...">` | Take the `href` directly, output `[label](url)` |
| Inline / block LaTeX | KaTeX-rendered `.katex` / `.katex-display` | Retrieve the **TeX source** from the `<annotation encoding="application/x-tex">` in the MathML branch, output `$...$` / `$$...$$` |
| Code blocks | `.md-code-block` (banner shows the language) + `pre` | Output a fenced code block; the language comes from the `language-*` class or the banner's infostring |
| Headings / emphasis / lists / quotes / tables | Standard HTML | Recovered as GFM |

The plugin listens for `copy` on `document` in the **capture phase**, and takes over only when the selection starts inside a `[data-chat-flow-kind="assistant"]` message and contains markdown-significant elements:

1. Expand the selection to the full `.katex` element (selecting in the middle of a formula still gets the complete source)
2. Clone the selection DOM with `Range.cloneContents()`
3. Recover the markdown with the built-in zero-dependency DOM→Markdown converter (`src/client/toMarkdown.ts`, written in TypeScript, type-erased and inlined into the bundle)
4. `preventDefault()` and write `text/plain` and `text/markdown`

Other selections (user bubbles, tool cards, plain text) and empty selections are completely unaffected; if conversion fails, the default copy behavior is restored automatically.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 选区如何进入剪贴板，代码和公式如何处理？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

客户端以capture监听document.copy，从选区起点找到data-chat-flow-kind，只有assistant前缀且消息存在Markdown特征元素才拦截。选区先扩展到完整公式，plain code内部选区直接用range.toString以免转义破坏代码；其余cloneContents后交给DOM转换器。转换器从a.href恢复链接，从KaTeX annotation恢复公式，对Shiki的.line补换行，然后写text/plain和text/markdown。没有clipboardData、空选区或不匹配消息时保留默认复制。依赖浏览器DOM、剪贴板事件和宿主的稳定属性，不需要模型服务。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:69-94](https://github.com/Asianfleet/dsh-message-copy-enhance/blob/9d8595501224621db5942fadddcbdb0efceba686/src/client/index.ts#L69-L94)

纯代码选区特判与DOM复制。

<details>
<summary>查看原文（26行）</summary>

```text
function selectionInsideCode(range: Range): string | null {
	const startEl = elementOf(range.startContainer);
	const endEl = elementOf(range.endContainer);
	const startCode = startEl != null ? startEl.closest(CODE_CONTAINER_SELECTOR) : null;
	const endCode = endEl != null ? endEl.closest(CODE_CONTAINER_SELECTOR) : null;
	// Both endpoints inside the same code element implies the whole range sits
	// inside it, so the selection cannot include the container itself; a
	// selection that reaches outside the block (fence-worthy) fails here.
	if (startCode == null || startCode !== endCode) return null;
	// Shiki layout: let the converter rebuild newlines from the .line spans.
	if (startCode.querySelector(".line") != null) return null;
	return range.toString();
}

function selectionToMarkdown(range: Range): string {
	expandToWholeMath(range);
	// Code is never markdown prose: a selection strictly inside a plain code
	// element must copy verbatim, not be escaped by the converter (which only
	// sees the bare text nodes once the wrapper is gone).
	const code = selectionInsideCode(range);
	if (code !== null) return code;
	const fragment = range.cloneContents();
	const container = document.createElement("div");
	container.appendChild(fragment);
	return domToMarkdown(container);
}
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:99-137](https://github.com/Asianfleet/dsh-message-copy-enhance/blob/9d8595501224621db5942fadddcbdb0efceba686/src/client/index.ts#L99-L137)

拦截门槛、两种MIME和fallback。

<details>
<summary>查看原文（39行）</summary>

```text
export function apply(ctx: Context): void {
	const onCopy = (event: ClipboardEvent): void => {
		try {
			const selection = window.getSelection();
			if (selection == null || selection.rangeCount === 0 || selection.isCollapsed) return;
			const range = selection.getRangeAt(0);
			// Only intercept assistant output. The flow item carrying the
			// selection decides: `data-chat-flow-kind` is the stable attribute
			// DSH's conversation view sets on message rows. Assistant content
			// appears as both `assistant` (turn nodes) and `assistant-step`
			// (step nodes), so any assistant-prefixed kind qualifies.
			const startEl = elementOf(range.startContainer);
			const flowItem = startEl != null ? startEl.closest("[data-chat-flow-kind]") : null;
			const kind = flowItem == null ? null : flowItem.getAttribute("data-chat-flow-kind");
			if (kind == null || !kind.startsWith("assistant")) return;
			// Item-scoped gate: intercept when the message contains any
			// markdown-signature content, regardless of where inside it the
			// selection started (mouse selections begin at plain-text positions
			// all the time). Messages with none of these are plain text and keep
			// the default (identical) copy.
			if (flowItem == null || flowItem.querySelector(ASSISTANT_SIGNATURE_SELECTOR) == null) return;

			const markdown = selectionToMarkdown(range);
			if (markdown === "") return;

			// Synthetic events may carry no data transfer; fall through to the
			// default copy in that case instead of swallowing it.
			const data = event.clipboardData;
			if (data == null) return;

			event.preventDefault();
			data.setData("text/plain", markdown);
			// Some editors (Obsidian, Typora, VS Code) read the dedicated type.
			data.setData("text/markdown", markdown);
		} catch (error) {
			// Never break the default copy path.
			if (typeof console !== "undefined") {
				console.error("[dsh-message-copy-enhance] copy interception failed, falling back to default", error);
			}
```

</details>

**依据 3 · 源码核查**：[src/client/toMarkdown.ts:118-166](https://github.com/Asianfleet/dsh-message-copy-enhance/blob/9d8595501224621db5942fadddcbdb0efceba686/src/client/toMarkdown.ts#L118-L166)

公式、Shiki行及链接恢复。

<details>
<summary>查看原文（49行）</summary>

```text
	// ---- KaTeX math first: the whole element is one atomic unit ----
	if (hasClass(el, "katex-display")) {
		const tex = mathTexSource(el).trim();
		return tex ? `\n\n$$\n${tex}\n$$\n\n` : "";
	}
	if (hasClass(el, "katex")) return mathInline(el);
	if (hasClass(el, "katex-error")) {
		const tex = el.textContent?.trim() ?? "";
		return tex ? `$${tex}$` : "";
	}
	// shiki code lines: verbatim text (code is not markdown prose, so no
	// escaping), one markdown line per rendered source line. Reached when a
	// selection cuts through a code block without including the `pre`/`code`
	// wrapper; shiki token spans inside each `.line` then join with their
	// original spacing.
	if (hasClass(el, "line")) return (el.textContent ?? "") + "\n";

	switch (t) {
		case "BR":
			return "  \n";
		case "STRONG":
		case "B": {
			const inner = childrenInline(el);
			return inner ? `**${inner}**` : "";
		}
		case "EM":
		case "I": {
			const inner = childrenInline(el);
			return inner ? `*${inner}*` : "";
		}
		case "DEL":
		case "S":
		case "STRIKE": {
			const inner = childrenInline(el);
			return inner ? `~~${inner}~~` : "";
		}
		case "CODE":
			return renderInlineCode(el);
		case "A": {
			const href = el.getAttribute("href");
			const label = childrenInline(el).trim();
			if (!href) return label;
			if (!label) return escapeUrl(href);
			return `[${label}](${escapeUrl(href)})`;
		}
		case "IMG": {
			const src = el.getAttribute("src");
			const alt = (el.getAttribute("alt") ?? "").trim();
			return src ? `![${alt}](${escapeUrl(src)})` : alt;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · DOM逆转换何时不能等于原始Markdown？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

逆转换只能恢复DOM保留的结构，原稿中的引用链接写法、空白和部分标记风格并不唯一。公式选中一部分被扩展成完整公式是主动语义取舍，不是字符范围严格一致；代码采用plain与Shiki两条路径体现具体保真设计。入口只用起点确定assistant范围，跨消息或嵌套复杂选区的边界需实际确认。转换器独立、跳过UI按钮和aria-hidden，便于复用；但宿主DOM和KaTeX/Shiki结构变化会产生持续维护负担。没有同版本浏览器复制结果，不能宣称任意复杂回答无损。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/toMarkdown.ts:39-48](https://github.com/Asianfleet/dsh-message-copy-enhance/blob/9d8595501224621db5942fadddcbdb0efceba686/src/client/toMarkdown.ts#L39-L48)

过滤UI装饰。

<details>
<summary>查看原文（10行）</summary>

```text
/** Elements that only carry UI chrome and must never leak into the copy. */
function shouldSkip(el: Element): boolean {
	if (tag(el) === "BUTTON") return true;
	if (el.getAttribute("role") === "button") return true;
	if (el.getAttribute("aria-hidden") === "true") return true;
	// The composer's live-preview decorations are never part of assistant output,
	// but dropping any data-decoration chrome keeps the copy clean if the
	// selection ever spans into them.
	if (el.hasAttribute("data-decoration")) return true;
	return false;
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:105-121](https://github.com/Asianfleet/dsh-message-copy-enhance/blob/9d8595501224621db5942fadddcbdb0efceba686/src/client/index.ts#L105-L121)

按选区起点和消息特征决定拦截。

<details>
<summary>查看原文（17行）</summary>

```text
			// Only intercept assistant output. The flow item carrying the
			// selection decides: `data-chat-flow-kind` is the stable attribute
			// DSH's conversation view sets on message rows. Assistant content
			// appears as both `assistant` (turn nodes) and `assistant-step`
			// (step nodes), so any assistant-prefixed kind qualifies.
			const startEl = elementOf(range.startContainer);
			const flowItem = startEl != null ? startEl.closest("[data-chat-flow-kind]") : null;
			const kind = flowItem == null ? null : flowItem.getAttribute("data-chat-flow-kind");
			if (kind == null || !kind.startsWith("assistant")) return;
			// Item-scoped gate: intercept when the message contains any
			// markdown-signature content, regardless of where inside it the
			// selection started (mouse selections begin at plain-text positions
			// all the time). Messages with none of these are plain text and keep
			// the default (identical) copy.
			if (flowItem == null || flowItem.querySelector(ASSISTANT_SIGNATURE_SELECTOR) == null) return;

			const markdown = selectionToMarkdown(range);
```

</details>

**依据 3 · 源码核查**：[src/client/toMarkdown.ts:70-84](https://github.com/Asianfleet/dsh-message-copy-enhance/blob/9d8595501224621db5942fadddcbdb0efceba686/src/client/toMarkdown.ts#L70-L84)

正文转义与代码raw模式分开。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Escape markdown-significant characters in plain text.
 * - "raw": no escaping at all (code content must stay verbatim)
 * - "text": escape `\`, `` ` ``, `*`, `_`, `[`, `]` — except **intraword**
 *   underscores (`node_modules`): CommonMark never treats those as emphasis
 *   (`_` needs word boundaries), so a backslash would only corrupt verbatim
 *   text. Underscores that could actually open/close emphasis (word-boundary
 *   positions) are still escaped for round-trip fidelity.
 */
function escapeText(text: string, mode: "raw" | "text"): string {
	if (mode === "raw") return text;
	return text.replace(/([\\`*_[\]])/g, (ch, _group, offset, whole) => {
		if (ch === "_" && isIntrawordUnderscore(whole, offset)) return ch;
		return `\\${ch}`;
	});
```

</details>

#### 缺口

- 跨消息、嵌套表格及不同目标编辑器的粘贴保真未验证。
  **影响**：不能保证所有部分选区与原始消息语义完全一致。
  **进一步探讨**：用链接、公式、列表嵌代码和跨消息选区矩阵逐一对照目标Markdown渲染。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些用户可低范围试用，代价和停止条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

经常摘录技术回答的人可先试，选取链接、公式和多行代码各一段，粘贴到常用编辑器并逐字核对URL、TeX和换行，再测试禁用后默认复制恢复。首次涉及客户端加载，持续在copy时遍历选区DOM，不调用模型；现金、延迟和人工复核时间没有实测值，不写为零。发布包和Git源码的构建路径不同，源码安装含prepare构建，需确认拿到可加载客户端。失败时可禁用并用原消息或手工复制；若静默丢掉代码符号、公式或链接目标，应停止自动依赖。它不适合要求逐字原始Markdown的归档流程。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:129-150](https://github.com/Asianfleet/dsh-message-copy-enhance/blob/9d8595501224621db5942fadddcbdb0efceba686/src/client/index.ts#L129-L150)

写剪贴板与监听生命周期。

<details>
<summary>查看原文（22行）</summary>

```text
			event.preventDefault();
			data.setData("text/plain", markdown);
			// Some editors (Obsidian, Typora, VS Code) read the dedicated type.
			data.setData("text/markdown", markdown);
		} catch (error) {
			// Never break the default copy path.
			if (typeof console !== "undefined") {
				console.error("[dsh-message-copy-enhance] copy interception failed, falling back to default", error);
			}
		}
	};

	// ctx.effect semantics: the callback is the effect BODY (runs now); its
	// return value is the disposer, run when the plugin scope is torn down.
	ctx.effect(() => {
		document.addEventListener("copy", onCopy, true);
		// One-line activation marker so the plugin's presence is verifiable in
		// the browser console (DevTools → Console).
		if (typeof console !== "undefined") {
			console.info("[dsh-message-copy-enhance] active — assistant copy is rewritten to Markdown");
		}
		return () => {
```

</details>

**依据 2 · 作者声明**：[README.md:50-58](https://github.com/Asianfleet/dsh-message-copy-enhance/blob/9d8595501224621db5942fadddcbdb0efceba686/README.md#L50-L58)

构建和测试命令是作者流程，非本轮执行。

````text
## Build & test

```bash
npm install           # dev deps: typescript / vite / vitest / @types/node / linkedom / @deepseek-ai/cordis (official types)
npm run typecheck     # tsc -p tsconfig.json — full type check (strict)
npm run build         # vite build — bundle src/client into dist/client.js in the DSH module-loader format
npm test              # vitest run — 36 cases (converter / real bundle / package layout)
npm run test:watch    # vitest — watch mode
npm run test:coverage # vitest run --coverage — v8 coverage report
````

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 消息原始结构能否替代DOM逆转换？

**研究主题**：新假设与验证

#### 完整回答

从逆转换歧义与复杂选区边界推导，未验证方向是宿主提供原始Markdown及渲染节点到源区间的映射，让插件按选区定位源文；对于公式则明确选择原区间或完整节点。这样可能减少重建猜测，但增加宿主接口耦合、源位置维护和部分节点映射成本。最小比较使用同一批复杂消息，检查DOM逆转换与源区间映射的语义保真、选区一致性和升级维护量。若源映射在动态消息失效或仍需同等多的修复分支，便削弱方案。当前没有此实现，不能计入插件能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:83-93](https://github.com/Asianfleet/dsh-message-copy-enhance/blob/9d8595501224621db5942fadddcbdb0efceba686/src/client/index.ts#L83-L93)

当前依靠克隆DOM而非原始消息。

<details>
<summary>查看原文（11行）</summary>

```text
function selectionToMarkdown(range: Range): string {
	expandToWholeMath(range);
	// Code is never markdown prose: a selection strictly inside a plain code
	// element must copy verbatim, not be escaped by the converter (which only
	// sees the bare text nodes once the wrapper is gone).
	const code = selectionInsideCode(range);
	if (code !== null) return code;
	const fragment = range.cloneContents();
	const container = document.createElement("div");
	container.appendChild(fragment);
	return domToMarkdown(container);
```

</details>

**依据 2 · 源码核查**：[src/client/toMarkdown.ts:118-133](https://github.com/Asianfleet/dsh-message-copy-enhance/blob/9d8595501224621db5942fadddcbdb0efceba686/src/client/toMarkdown.ts#L118-L133)

数学和Shiki需专用恢复分支。

<details>
<summary>查看原文（16行）</summary>

```text
	// ---- KaTeX math first: the whole element is one atomic unit ----
	if (hasClass(el, "katex-display")) {
		const tex = mathTexSource(el).trim();
		return tex ? `\n\n$$\n${tex}\n$$\n\n` : "";
	}
	if (hasClass(el, "katex")) return mathInline(el);
	if (hasClass(el, "katex-error")) {
		const tex = el.textContent?.trim() ?? "";
		return tex ? `$${tex}$` : "";
	}
	// shiki code lines: verbatim text (code is not markdown prose, so no
	// escaping), one markdown line per rendered source line. Reached when a
	// selection cuts through a code block without including the `pre`/`code`
	// wrapper; shiki token spans inside each `.line` then join with their
	// original spacing.
	if (hasClass(el, "line")) return (el.textContent ?? "") + "\n";
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
