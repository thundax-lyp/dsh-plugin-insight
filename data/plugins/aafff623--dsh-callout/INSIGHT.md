# dsh-callout

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[0e92c13](https://github.com/Aafff623/dsh-callout/tree/0e92c135644be8d84601ea846098f2799ef4dcf7)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在DSH Web将首行五类GitHub式提示标记呈现为主题卡片，监听流式DOM更新并在卸载时有条件恢复标记。

> **核心亮点**：结合规范Markdown/首Text保正文、own mutation与增量dirty树、条件卸载恢复，提供五类主题重点卡片而不改session存储。详见[Q02](#research-q02)。

> **风险与缺陷**：assistant范围依chat-flow/markdown DOM而非role，无flow退document；解析后转义歧义，属性恢复只核source，视觉/伪元素不等内容或可达认证。详见[Q03](#research-q03)。

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
  - [Q01 · 适合什么阅读任务，卡片意味着什么？](#detail-section-11)
  - [Q02 · 标记匹配、流式更新与卸载如何实现？](#detail-section-12)
  - [Q03 · 渲染范围/原文与状态边界有什么不足？](#detail-section-13)
  - [Q04 · 启动步骤与三阶段成本效果是什么？](#detail-section-14)
  - [Q05 · 推荐与继续探讨入口是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在DSH Web阅读长回复、想更快看到前提/要点/建议/风险的用户。插件把符合首行[!NOTE/TIP/IMPORTANT/WARNING/CAUTION]的blockquote升级成五类主题卡片，源消息仍是可读Markdown，不改存储session内容。

合格结果是正确识别而不过度改普通文本/代码、保留正文交互、流式编辑不留下错卡片，收起/卸载能恢复安全的源标记。颜色/标题只是表达类型，不证明内容是真实警告、正确决策或安全审查。基线普通blockquote与手工加粗标题，增量是固定语义呈现/主题一致，不增加模型事实正确性。

普通blockquote/手工加粗标题；插件改变呈现样式与流式管理，不改变内容真值/任务验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 五类卡片 | 重点语义视觉呈现 | 非内容真实性/安全认证 |
| 严格首Text匹配 | 少改代码/链接/未知标记 | 依Markdown DOM，源转义未知 |
| 增量observer | 流式重建/自mutation | assistant来源靠DOM约定 |
| 卸载/HMR | 条件恢复/清样式 | 不覆写外部新文本，非源码重编译 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH Web client loader/Cordis | 加载预构建client/生命周期 | package作者基线0.1.2-rc.1，不外推未来DOM |
| systemPrompt WEB_SURFACE order接口 | 输出规范提示 | host层会占上下文但不强制模型遵循 |
| chat-flow/MarkdownText DOM与CSS主题属性 | 匹配/亮暗色 | 无flow退document，不是真实role鉴别 |
| Node>=20与包lib | host/client入口 | Git有预构建，更新src应同步lib |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核host/client/DOM代际并刷新Web | 无配置，npm作者称未发布需核归档 |
| 写标记 | 用blockquote首直接文本类型 | 不把颜色当安全认证 |
| 看流式 | 核正文/链接、code/非首标记不变 | observer不把自己的strip当编辑 |
| 切换/卸载 | 主题/会话/HMR/卸载 | 样式/observer清理且不覆写已编辑文本 |
| 升级 | 固定样例重新核DOM契约 | 不因测试数自动宣全host兼容 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地预构建包/样式，无外部服务 | 安装刷新/核标记形状与DOM | 工时/金额未知 |
| 持续使用 | prompt契约token、body observer/200ms增量扫描、state集合 | 选择少量恰当卡片/阅读 | 无独立模型API不等总上下文费用0，大会话CPU未知 |
| 失败恢复 | 清DOM属性/style与重载资源 | 查误卡片/外部edit与插件冲突 | 不改持久源利恢复，但复杂React恢复时序未知 |



#### 效果

| 目标 | 增量 | 边界 |
| --- | --- | --- |
| 重点可见 | 五类标题/颜色/图标 | 不证明内容可靠/无障碍通知 |
| 保源可读 | canonical Markdown+呈现升级 | 源转义信息已丢无法重建 |
| 少破坏正文 | 仅首Text改动保子树 | 依DOM/role约定 |
| 流式/卸载 | own mutation/dirty/精确恢复 | 实际renderer需核 |

测试设计用GFM形状与VM fake DOM状态机，直接读built bundle的测试面；能支撑规则和状态路径覆盖，不替代当前宿主浏览器验证。本轮仅源码核查。

> **思考**：assistant范围依chat-flow/markdown DOM而非role，无flow退document；解析后转义歧义，属性恢复只核source，视觉/伪元素不等内容或可达认证。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：结合规范Markdown/首Text保正文、own mutation与增量dirty树、条件卸载恢复，提供五类主题重点卡片而不改session存储。详见[Q02](#research-q02)。

结合规范Markdown/首Text保正文、own mutation与增量dirty树、条件卸载恢复，提供五类主题重点卡片而不改session存储。详见[Q02](#research-q02)。

实现按data-chat-flow范围扫blockquote/p，不显式检查消息role=assistant；没有chat-flow时退整个document，blockquote分支也不核markdown根。因此“仅助手”依赖当前DSH把human当纯文本和DOM布局约定，未来渲染变化/别处同形blockquote可能被升级。裸P只看直接父class包含markdown，不是消息来源鉴别。

DOM解析后真实marker与源码反斜线转义marker可能变相同Text，无法回推出原Markdown转义意图。它还原的是自己保存的DOM前缀，不是读session原文再编译；持久源不改是代码范围结论，不能说每次DOM回退精确恢复所有源码。未知/非首/代码等形状有明确拒绝路径，但零误判仍需按实际renderer核。

属性observer只在source属性不等插件值时重applyAlert，若仅type/title/kind被移除而source仍相等会continue不修；外部样式冲突也不在文本状态机范围。样式选择[data-md-alert][data-md-alert-source]不核source具体值，依插件命名不冲突的信任前提。其伪元素标题/颜色有助视觉提示，但无alert role/实时朗读策略，不应当无障碍送达保证。每次mutation依范围查询/dirty合并仍有成本，大会话性能无数据。

<a id="detail-section-5"></a>

### 1.4 主要限制

assistant范围依chat-flow/markdown DOM而非role，无flow退document；解析后转义歧义，属性恢复只核source，视觉/伪元素不等内容或可达认证。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用，兼容Web/偏好重点卡片用户先核流式/主题/卸载与非标记拒绝；不将视觉类型当内容审查。详见[Q05](#research-q05)。

合格结果是正确识别而不过度改普通文本/代码、保留正文交互、流式编辑不留下错卡片，收起/卸载能恢复安全的源标记。颜色/标题只是表达类型，不证明内容是真实警告、正确决策或安全审查。基线普通blockquote与手工加粗标题，增量是固定语义呈现/主题一致，不增加模型事实正确性。

采用建议：有试用，兼容Web/偏好重点卡片用户先核流式/主题/卸载与非标记拒绝；不将视觉类型当内容审查。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。首Text/自身mutation/编辑与卸载路径细致，来源/DOM契约和转义可见性需保持边界。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/client/index.ts、lib/index.js、lib/client.js、test/callout.test.mjs、build.mjs、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：host与client关键完整匹配/状态/卸载、built关键路径及package/作者测试设计；不运行build/VM测试/真实浏览器或改对话。
- 下一步：可继续固定Markdown/role/属性/edit/HMR矩阵比较误改/漏标、精确回退与阅读/CPU，无真实对话。

**分析版本**

- **仓库**：[Aafff623/dsh-callout](https://github.com/Aafff623/dsh-callout)
- **版本号**：0.2.0（[固定提交 0e92c13](https://github.com/Aafff623/dsh-callout/tree/0e92c135644be8d84601ea846098f2799ef4dcf7)）
- **版本日期**：2026-09-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索来源作用域/AST或role适配与完整属性恢复，保未知源语法原文，对照误改/漏标/CPU；未实现。详见[Q05](#research-q05)。

可继续固定Markdown/role/属性/edit/HMR矩阵比较误改/漏标、精确回退与阅读/CPU，无真实对话。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 405 | — | — | 3189 |
| .mjs | source | 1 | 54 | 35 | 13 | — |
| .js | source | 2 | 473 | 460 | 9 | — |
| .ts | source | 2 | 626 | 450 | 125 | — |
| .mjs | test | 1 | 297 | 219 | 42 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aafff623/dsh-callout/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Aafff623/dsh-callout/issues?q=is%3Aissue+created%3A2026-09-22T09%3A43%3A43.184Z..2026-10-22T09%3A43%3A43.184Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aafff623/dsh-callout/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A43%3A43.184Z..2026-10-22T09%3A43%3A43.184Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核视觉语义/内容真值区别、严格Text匹配/observer/卸载、assistant来源/转义边界、上下文与DOM成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合什么阅读任务，卡片意味着什么？

**研究主题**：场景与需求

#### 完整回答

面向在DSH Web阅读长回复、想更快看到前提/要点/建议/风险的用户。插件把符合首行[!NOTE/TIP/IMPORTANT/WARNING/CAUTION]的blockquote升级成五类主题卡片，源消息仍是可读Markdown，不改存储session内容。

合格结果是正确识别而不过度改普通文本/代码、保留正文交互、流式编辑不留下错卡片，收起/卸载能恢复安全的源标记。颜色/标题只是表达类型，不证明内容是真实警告、正确决策或安全审查。基线普通blockquote与手工加粗标题，增量是固定语义呈现/主题一致，不增加模型事实正确性。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-42](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/README.md#L19-L42)

作者呈现定位/源不变。

<details>
<summary>查看原文（24行）</summary>

````text

## See it first

```markdown
> [!WARNING]
> This operation may overwrite existing configuration.
```

Install the plugin, refresh DSH Web, then send that assistant Markdown. A qualifying leading marker becomes a warning card; malformed or unknown markers remain ordinary text.

## Why this plugin exists

A warning should look like a warning before the reader reaches the command. A key decision should be easy to find without wrapping the entire answer in a colored box.

`dsh-callout` keeps the source format readable Markdown and upgrades it only at presentation time:

```text
assistant Markdown → DSH MarkdownText → ordinary blockquote → callout card
```

It does not modify stored session content, providers, permissions, tools, or the DSH core renderer.

## Supported types

````

</details>

**依据 2 · 源码核查**：[src/client/index.ts:71-73](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L71-L73)

五类标记规则。

```text
const ALERT_RE = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?=\s|$)/i
// Strip the marker plus at most one following line ending; never touch the body.
const ALERT_STRIP_RE = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(?:\r?\n[ \t]*)?/i
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 标记匹配、流式更新与卸载如何实现？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

host延迟inject systemPrompt，提供canonical多行/同行写法与使用指引，属于模型输出建议而非渲染器强制次数/安全规则；client不注册模型工具。首blockquote子元素须P、P首子节点须直接Text，开头类型后需空白/结尾，拒绝未知/粘连标记；嵌套blockquote不升级。另有直父class含markdown的裸P兼容fallback。

升级只截去该首Text节点的marker，给容器加自有data属性，CSS伪元素显示标题/图标/颜色，保正文/链接/强调节点。WeakMap保存所剥文本/prefix，自己的Text变更计数避免observer echo误当真实编辑；外部领先文字改变则clear卡片。dirty roots合并祖先/子树，200ms调度一次增量扫描，而非每个token扫整个document。

卸载disconnect observer/清timer/dirty与自有样式，只有领先文字仍等于自己产物才还原prefix，避免覆写React/用户新文本；HMR先调上一dispose、旧fiber晚销毁不移新style。贡献是谨慎DOM状态/生命周期与易读Markdown约定结合，不是新Markdown AST或安全验证技术。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:58-65](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/index.ts#L58-L65)

host输出契约。

```text
export function apply(ctx: Context): void {
	ctx.inject(['systemPrompt'], (injected) => {
		const { systemPrompt } = injected as PromptContext
		systemPrompt.section({
			name: 'dsh-callout:github-alerts',
			order: systemPrompt.getSectionOrder('WEB_SURFACE'),
			text: () => ALERTS_SECTION,
		})
```

**依据 2 · 源码核查**：[src/client/index.ts:292-333](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L292-L333)

首Text/blockquote/裸P匹配。

<details>
<summary>查看原文（42行）</summary>

```text
function firstDirectTextChild(el: Element): Text | null {
	const first = el.firstChild
	return first && first.nodeType === TEXT_NODE ? (first as Text) : null
}

/** Extract the callout type when `nodeValue` starts with `[!TYPE]`, else null. */
function matchMarker(nodeValue: string): AlertType | null {
	const m = nodeValue.match(ALERT_RE)
	return m ? (m[1].toLowerCase() as AlertType) : null
}

/** Strip the leading marker (and one following line ending). Returns a
 *  STRING — the DOM requires strings; assigning anything else corrupts
 *  the text node (the historical `[object Object]` bug). */
function stripMarker(nodeValue: string): string {
	return nodeValue.replace(ALERT_STRIP_RE, '')
}

/** A blockquote is a callout only when its first block is a bare paragraph
 *  whose first child is plain text starting with `[!TYPE]`. Lists, nested
 *  blockquotes, fenced/inline code, emphasis, links and images as a leading
 *  node all disqualify, so ordinary content is never rewritten. */
function blockquoteType(bq: Element): { type: AlertType; text: Text } | null {
	const firstBlock = bq.firstElementChild
	if (!firstBlock || firstBlock.tagName !== 'P') return null
	const text = firstDirectTextChild(firstBlock)
	if (!text) return null
	const type = matchMarker(text.nodeValue ?? '')
	if (!type) return null
	return { type, text }
}

/** A bare paragraph is only upgraded when its direct parent is the
 *  MarkdownText render root (CSS-module class containing "markdown"),
 *  so ordinary prose, human bodies and other UI text are never touched. */
function inMarkdownTextRoot(p: Element): boolean {
	const parent = p.parentElement
	if (!parent) return false
	// Guard for test environment where document.body may not exist.
	if (typeof document !== 'undefined' && parent === document.body) return false
	const cls = typeof parent.className === 'string' ? parent.className : ''
	return /markdown/i.test(cls)
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:362-421](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L362-L421)

Text变更/外部edit。

<details>
<summary>查看原文（60行）</summary>

```text
function upgradeBlockquote(el: Element): void {
	if (hasBlockquoteAncestor(el)) return
	const hit = blockquoteType(el)
	const owned = state.get(el)
	if (hit) {
		const original = hit.text.nodeValue ?? ''
		const stripped = stripMarker(original)
		const prefix = original.slice(0, original.length - stripped.length)
		// A positive hit means the marker is present in the current DOM (for
		// example React restored it during streaming), so always strip this
		// fresh text node. Mark the write before assigning so the observer can
		// distinguish our mutation from a React/user mutation.
		markOwnTextMutation(hit.text)
		hit.text.nodeValue = stripped
		claim(el, stripped, hit.type, 'blockquote', prefix)
		applyAlert(el, hit.type, 'blockquote')
		externallyChanged.delete(el)
		return
	}
	if (!owned) return
	const currentText = el.firstElementChild?.firstChild
	if (!externallyChanged.has(el) || currentText?.nodeType === TEXT_NODE && currentText.nodeValue === owned.text) {
		// No external change, or React rebuilt the surrounding nodes while
		// preserving the exact text produced by our strip: keep the card.
		externallyChanged.delete(el)
		return
	}
	// The leading text changed without a marker: treat it as a real edit.
	externallyChanged.delete(el)
	clearAlert(el)
}

function upgradeBareParagraph(el: Element): void {
	const owned = state.get(el)
	if (!inMarkdownTextRoot(el)) return
	const text = firstDirectTextChild(el)
	if (!text) {
		if (owned && externallyChanged.has(el)) {
			externallyChanged.delete(el)
			clearAlert(el)
		}
		return
	}
	const type = matchMarker(text.nodeValue ?? '')
	if (type) {
		const original = text.nodeValue ?? ''
		const stripped = stripMarker(original)
		const prefix = original.slice(0, original.length - stripped.length)
		// The marker is present in this current DOM text, so normalize it
		// again if React rebuilt the text node during streaming.
		markOwnTextMutation(text)
		text.nodeValue = stripped
		claim(el, stripped, type, 'bare', prefix)
		applyAlert(el, type, 'bare')
		externallyChanged.delete(el)
		return
	}
	if (owned && externallyChanged.has(el)) {
		externallyChanged.delete(el)
		clearAlert(el)
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:151-211](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L151-L211)

dirty合并/自身mutation。

<details>
<summary>查看原文（61行）</summary>

```text
function collectDirty(node: Node | null | undefined): void {
	const root = nearestScanRoot(node)
	if (!root || !isInsideChatFlow(root)) return
	// Keep the dirty set minimal: an ancestor scan already covers every
	// descendant, while a descendant adds no value once its ancestor is queued.
	for (const queued of dirtyRoots) {
		if (queued === root || queued.contains?.(root)) return
	}
	for (const queued of [...dirtyRoots]) {
		if (root.contains?.(queued)) dirtyRoots.delete(queued)
	}
	dirtyRoots.add(root)
}

function isAttached(node: Element): boolean {
	if ('isConnected' in node && (node as Element & { isConnected?: boolean }).isConnected) return true
	if (node.parentElement) return true
	if (typeof document !== 'undefined' && typeof document.contains === 'function') return document.contains(node)
	return false
}

function releaseRemovedNode(node: Node | null | undefined): void {
	if (!node || node.nodeType !== 1) return
	const removed = node as Element
	// React may report a remove and an add for the same moved subtree in one
	// observer batch. A node with a new parent is still live; release only
	// genuinely detached roots.
	if (isAttached(removed)) return
	dirtyRoots.delete(removed)
	for (const dirty of [...dirtyRoots]) {
		if (removed.contains?.(dirty)) dirtyRoots.delete(dirty)
	}
	for (const el of [...ownedElements]) {
		if (el === removed || removed.contains?.(el)) release(el)
	}
}

function handleMutations(records: MutationRecord[]): void {
	for (const record of records) {
		if (record.type === 'characterData' && consumeOwnTextMutation(record.target)) {
			// Own strip: the card is already applied. Do not dirty or treat as an edit.
			continue
		}
		const owner = ownerForNode(record.target)
		if (record.type === 'attributes' && owner) {
			// External code removed or altered one of our card attributes.
			// Re-assert our chrome only when it is actually wrong — our own
			// no-op writes (same values) must not re-enter as records.
			if (owner.getAttribute('data-md-alert-source') !== PLUGIN_SOURCE) {
				const owned = state.get(owner)
				if (owned) applyAlert(owner, owned.type, owned.kind)
			}
			continue
		}
		if (owner) externallyChanged.add(owner)
		collectDirty(record.target)
		for (const added of record.addedNodes ?? []) collectDirty(added)
		for (const removed of record.removedNodes ?? []) releaseRemovedNode(removed)
	}
	if (dirtyRoots.size === 0) return
	scheduleScan()
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:479-541](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L479-L541)

HMR/清理/条件恢复。

<details>
<summary>查看原文（63行）</summary>

```text
export function apply(ctx: Context): void {
	// HMR / re-inject guard: a replacement instance takes over. Dispose the
	// previous one first so observers never stack. Disposal is synchronous
	// here, which also closes the case where Cordis later tears down the old
	// fiber (that late call will see it is no longer the current instance).
	if (typeof window.__dshCalloutDispose === 'function') window.__dshCalloutDispose()
	const style = injectCss()
	let disposed = false
	const observer = new MutationObserver((records) => {
		if (!disposed) handleMutations(records)
	})
	observer.observe(document.body, {
		childList: true,
		subtree: true,
		characterData: true,
		attributes: true,
		attributeFilter: ['data-md-alert', 'data-md-alert-title', 'data-md-alert-source', 'data-md-alert-kind'],
	})
	// Attach the observer before the first scan so the initial marker strip is
	// classified as our own mutation rather than leaking into the next edit.
	// The first pass is a full scan; later observer ticks only walk dirty roots.
	scanAll()
	const dispose = (): void => {
		if (disposed) return
		disposed = true
		if (scheduled) {
			clearTimeout(scheduled)
			scheduled = 0
		}
		dirtyRoots.clear()
		observer.disconnect()
		const isCurrent = window.__dshCalloutDispose === dispose
		// Shared resources (the <style> node and the global handle) are only
		// released by the live instance; a late teardown from an old fiber must
		// not remove the stylesheet the new instance is rendering with.
		if (isCurrent) {
			if (style && document.getElementById('dsh-callout-css') === style) style.remove()
			window.__dshCalloutDispose = null
		}
		// Element chrome is per-instance: always restore the source marker when
		// the leading text node still holds exactly the value this plugin
		// produced (never overwrite a React/user edit), then clear the card.
		for (const el of [...ownedElements]) {
			const owned = state.get(el)
			const paragraph = el.tagName === 'BLOCKQUOTE' ? el.firstElementChild : el
			const text = paragraph?.tagName === 'P' ? firstDirectTextChild(paragraph) : null
			if (owned && owned.prefix && text && text.nodeValue === owned.text) {
				// No markOwnTextMutation: the observer is already detached, so a
				// mark would never be consumed and would leak into the next
				// instance, swallowing one future real-edit classification.
				text.nodeValue = owned.prefix + owned.text
			}
			clearAlert(el)
		}
		// Drop pending own-write markers so a re-injected instance cannot
		// mistake an old observer echo for its first real edit.
		for (const node of ownedTextNodes) ownTextMutations.delete(node)
		ownedTextNodes.clear()
	}
	window.__dshCalloutDispose = dispose
	// Cordis fiber teardown disposes us automatically (same pattern as
	// dsh-client-hmr), instead of relying only on the manual global.
	ctx.effect(() => () => dispose(), 'dsh-callout: observer + styles')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 渲染范围/原文与状态边界有什么不足？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

实现按data-chat-flow范围扫blockquote/p，不显式检查消息role=assistant；没有chat-flow时退整个document，blockquote分支也不核markdown根。因此“仅助手”依赖当前DSH把human当纯文本和DOM布局约定，未来渲染变化/别处同形blockquote可能被升级。裸P只看直接父class包含markdown，不是消息来源鉴别。

DOM解析后真实marker与源码反斜线转义marker可能变相同Text，无法回推出原Markdown转义意图。它还原的是自己保存的DOM前缀，不是读session原文再编译；持久源不改是代码范围结论，不能说每次DOM回退精确恢复所有源码。未知/非首/代码等形状有明确拒绝路径，但零误判仍需按实际renderer核。

属性observer只在source属性不等插件值时重applyAlert，若仅type/title/kind被移除而source仍相等会continue不修；外部样式冲突也不在文本状态机范围。样式选择[data-md-alert][data-md-alert-source]不核source具体值，依插件命名不冲突的信任前提。其伪元素标题/颜色有助视觉提示，但无alert role/实时朗读策略，不应当无障碍送达保证。每次mutation依范围查询/dirty合并仍有成本，大会话性能无数据。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:141-148](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L141-L148)

无flow退宽范围。

```text
function isInsideChatFlow(root: Element): boolean {
	if (typeof document === 'undefined') return true
	const flows = document.querySelectorAll('[data-chat-flow]')
	if (flows.length === 0) return true
	for (const flow of flows) {
		if (flow === root || flow.contains?.(root)) return true
	}
	return false
```

**依据 2 · 源码核查**：[src/client/index.ts:327-333](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L327-L333)

裸P仅class。

```text
function inMarkdownTextRoot(p: Element): boolean {
	const parent = p.parentElement
	if (!parent) return false
	// Guard for test environment where document.body may not exist.
	if (typeof document !== 'undefined' && parent === document.body) return false
	const cls = typeof parent.className === 'string' ? parent.className : ''
	return /markdown/i.test(cls)
```

**依据 3 · 源码核查**：[src/client/index.ts:188-203](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L188-L203)

属性只核source。

<details>
<summary>查看原文（16行）</summary>

```text
function handleMutations(records: MutationRecord[]): void {
	for (const record of records) {
		if (record.type === 'characterData' && consumeOwnTextMutation(record.target)) {
			// Own strip: the card is already applied. Do not dirty or treat as an edit.
			continue
		}
		const owner = ownerForNode(record.target)
		if (record.type === 'attributes' && owner) {
			// External code removed or altered one of our card attributes.
			// Re-assert our chrome only when it is actually wrong — our own
			// no-op writes (same values) must not re-enter as records.
			if (owner.getAttribute('data-md-alert-source') !== PLUGIN_SOURCE) {
				const owned = state.get(owner)
				if (owned) applyAlert(owner, owned.type, owned.kind)
			}
			continue
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:436-473](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L436-L473)

全扫/增量与200ms。

<details>
<summary>查看原文（38行）</summary>

```text
function scanRoots(): Iterable<ParentNode> {
	const flows = document.querySelectorAll('[data-chat-flow]')
	return flows.length > 0 ? flows : [document]
}

/** Upgrade `root` when it is a blockquote/p, then every matching descendant.
 *  `querySelectorAll` is optional so the vm fake DOM can omit it. */
function upgradeTree(root: ParentNode): void {
	if ('tagName' in root) upgrade(root as Element)
	if (typeof root.querySelectorAll !== 'function') return
	for (const el of root.querySelectorAll('blockquote, p')) {
		upgrade(el)
	}
}

let scheduled: ReturnType<typeof setTimeout> | 0 = 0

/** Full-document scan. Used once on apply() so the initial render is complete. */
function scanAll(): void {
	dirtyRoots.clear()
	for (const root of scanRoots()) upgradeTree(root)
}

/** Incremental scan: only the subtrees collected by handleMutations. */
function scanDirty(): void {
	if (dirtyRoots.size === 0) return
	const roots = [...dirtyRoots]
	dirtyRoots.clear()
	for (const root of roots) upgradeTree(root)
}

function scan(): void {
	scheduled = 0
	scanDirty()
}
function scheduleScan(): void {
	if (scheduled) return
	scheduled = setTimeout(scan, 200)
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:518-535](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L518-L535)

精确条件还原。

<details>
<summary>查看原文（18行）</summary>

```text
		// Element chrome is per-instance: always restore the source marker when
		// the leading text node still holds exactly the value this plugin
		// produced (never overwrite a React/user edit), then clear the card.
		for (const el of [...ownedElements]) {
			const owned = state.get(el)
			const paragraph = el.tagName === 'BLOCKQUOTE' ? el.firstElementChild : el
			const text = paragraph?.tagName === 'P' ? firstDirectTextChild(paragraph) : null
			if (owned && owned.prefix && text && text.nodeValue === owned.text) {
				// No markOwnTextMutation: the observer is already detached, so a
				// mark would never be consumed and would leak into the next
				// instance, swallowing one future real-edit classification.
				text.nodeValue = owned.prefix + owned.text
			}
			clearAlert(el)
		}
		// Drop pending own-write markers so a re-injected instance cannot
		// mistake an old observer echo for its first real edit.
		for (const node of ownedTextNodes) ownTextMutations.delete(node)
```

</details>

#### 缺口

- 真实DSH流式/主题/会话切换、转义marker和屏幕阅读器的交互未独立核。
  **影响**：不能承诺全版本无误判或所有读者可达。
  **进一步探讨**：用无秘密固定Markdown/DOM及role/flow变更、仅type丢失/全clear/HMR/辅助技术检查，区分拒绝/恢复/呈现。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动步骤与三阶段成本效果是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH Web client loader/Cordis | 加载预构建client/生命周期 | package作者基线0.1.2-rc.1，不外推未来DOM |
| systemPrompt WEB_SURFACE order接口 | 输出规范提示 | host层会占上下文但不强制模型遵循 |
| chat-flow/MarkdownText DOM与CSS主题属性 | 匹配/亮暗色 | 无flow退document，不是真实role鉴别 |
| Node>=20与包lib | host/client入口 | Git有预构建，更新src应同步lib |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核host/client/DOM代际并刷新Web | 无配置，npm作者称未发布需核归档 |
| 写标记 | 用blockquote首直接文本类型 | 不把颜色当安全认证 |
| 看流式 | 核正文/链接、code/非首标记不变 | observer不把自己的strip当编辑 |
| 切换/卸载 | 主题/会话/HMR/卸载 | 样式/observer清理且不覆写已编辑文本 |
| 升级 | 固定样例重新核DOM契约 | 不因测试数自动宣全host兼容 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地预构建包/样式，无外部服务 | 安装刷新/核标记形状与DOM | 工时/金额未知 |
| 持续使用 | prompt契约token、body observer/200ms增量扫描、state集合 | 选择少量恰当卡片/阅读 | 无独立模型API不等总上下文费用0，大会话CPU未知 |
| 失败恢复 | 清DOM属性/style与重载资源 | 查误卡片/外部edit与插件冲突 | 不改持久源利恢复，但复杂React恢复时序未知 |

#### 效果

| 目标 | 增量 | 边界 |
| --- | --- | --- |
| 重点可见 | 五类标题/颜色/图标 | 不证明内容可靠/无障碍通知 |
| 保源可读 | canonical Markdown+呈现升级 | 源转义信息已丢无法重建 |
| 少破坏正文 | 仅首Text改动保子树 | 依DOM/role约定 |
| 流式/卸载 | own mutation/dirty/精确恢复 | 实际renderer需核 |

测试设计用GFM形状与VM fake DOM状态机，直接读built bundle的测试面；能支撑规则和状态路径覆盖，不替代当前宿主浏览器验证。本轮仅源码核查。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:13-23](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/package.json#L13-L23)

host/client声明。

<details>
<summary>查看原文（11行）</summary>

```text
    "engines": {
      "dsh": ">=0.1.2-rc.1"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": []
    }
  },
```

</details>

**依据 2 · 源码核查**：[package.json:31-38](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/package.json#L31-L38)

Cordis与分发。

```text
  },
  "files": [
    "lib",
    "src",
    "cordis.patch.yml",
    "README.md"
  ],
  "keywords": [
```

**依据 3 · 源码核查**：[src/index.ts:58-65](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/index.ts#L58-L65)

提示依赖。

```text
export function apply(ctx: Context): void {
	ctx.inject(['systemPrompt'], (injected) => {
		const { systemPrompt } = injected as PromptContext
		systemPrompt.section({
			name: 'dsh-callout:github-alerts',
			order: systemPrompt.getSectionOrder('WEB_SURFACE'),
			text: () => ALERTS_SECTION,
		})
```

**依据 4 · 源码核查**：[src/client/index.ts:471-473](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L471-L473)

增量调度。

```text
function scheduleScan(): void {
	if (scheduled) return
	scheduled = setTimeout(scan, 200)
```

**依据 5 · 源码核查**：[test/callout.test.mjs:150-173](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/test/callout.test.mjs#L150-L173)

作者状态测试设计。

<details>
<summary>查看原文（24行）</summary>

```text
test('state: the first pass strips the marker and applies the card', () => {
	const plugin = loadPlugin()
	const { blockquote, text } = makeCallout()

	plugin.upgrade(blockquote)

	assert.equal(text.nodeValue, 'body')
	assert.equal(blockquote.getAttribute('data-md-alert'), 'note')
	assert.equal(blockquote.getAttribute('data-md-alert-title'), 'NOTE')
	assert.equal(blockquote.getAttribute('data-md-alert-source'), 'dsh-callout')
	assert.equal(blockquote.getAttribute('data-md-alert-kind'), 'blockquote')
})

test('state: nested blockquotes never activate an inner card', () => {
	const plugin = loadPlugin()
	const outer = fakeElement('BLOCKQUOTE')
	const inner = makeCallout('[!NOTE]\\ninner')
	inner.blockquote.parentElement = outer
	plugin.upgrade(inner.blockquote)
	assert.equal(inner.blockquote.getAttribute('data-md-alert'), null)
	assert.equal(plugin.hasState(inner.blockquote), false)
})

test('state: the observer echo of our own strip keeps the card', () => {
```

</details>

#### 缺口

- 与普通blockquote/加粗的查找时间、误读率和大会话开销没有对照。
  **影响**：不量化阅读效率或安全改善。
  **进一步探讨**：固定等长无秘密回答，比较找结论/风险的时间与误读，并记录DOM扫描/状态回收开销。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 推荐与继续探讨入口是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有条件试用。对使用当前兼容Web DOM、偏好重点卡片的个人用户，保正文/不改session源和精确卸载路径是实际优点。先核流式/主题/编辑与普通文本拒绝，严格assistant来源/辅助技术通知需求另评估，不让视觉类型代替内容判断。

由DOM范围推断来源、属性恢复只核source与源转义丢失可推导“来源作用域明确的渲染适配”。优先宿主提供的助手Markdown渲染扩展/AST标志；无正式接口则以消息role/root显式限定，marker源语法未知时保原文而不猜。属性恢复核完整自有四属性，记录来源版本与拒绝原因供调试，不持久化对话。

未实现。反例是宿主没有稳定role/AST接口，过度严格会漏流式尚未成形标记；不能为了全匹配重新扫整个页面或改存储源。最小对照含human/assistant同形DOM、escaped/bare/code、分块流式、仅type/title丢失、真实edit/节点移除/HMR晚销毁。若仍改错来源、覆写编辑或无法卸载原样，核心假设被反证；同时测漏标记/CPU/阅读负担，不以卡片数量多为成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:141-148](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L141-L148)

来源范围基线。

```text
function isInsideChatFlow(root: Element): boolean {
	if (typeof document === 'undefined') return true
	const flows = document.querySelectorAll('[data-chat-flow]')
	if (flows.length === 0) return true
	for (const flow of flows) {
		if (flow === root || flow.contains?.(root)) return true
	}
	return false
```

**依据 2 · 源码核查**：[src/client/index.ts:188-203](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L188-L203)

属性基线。

<details>
<summary>查看原文（16行）</summary>

```text
function handleMutations(records: MutationRecord[]): void {
	for (const record of records) {
		if (record.type === 'characterData' && consumeOwnTextMutation(record.target)) {
			// Own strip: the card is already applied. Do not dirty or treat as an edit.
			continue
		}
		const owner = ownerForNode(record.target)
		if (record.type === 'attributes' && owner) {
			// External code removed or altered one of our card attributes.
			// Re-assert our chrome only when it is actually wrong — our own
			// no-op writes (same values) must not re-enter as records.
			if (owner.getAttribute('data-md-alert-source') !== PLUGIN_SOURCE) {
				const owned = state.get(owner)
				if (owned) applyAlert(owner, owned.type, owned.kind)
			}
			continue
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:518-535](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts#L518-L535)

编辑/卸载基线。

<details>
<summary>查看原文（18行）</summary>

```text
		// Element chrome is per-instance: always restore the source marker when
		// the leading text node still holds exactly the value this plugin
		// produced (never overwrite a React/user edit), then clear the card.
		for (const el of [...ownedElements]) {
			const owned = state.get(el)
			const paragraph = el.tagName === 'BLOCKQUOTE' ? el.firstElementChild : el
			const text = paragraph?.tagName === 'P' ? firstDirectTextChild(paragraph) : null
			if (owned && owned.prefix && text && text.nodeValue === owned.text) {
				// No markOwnTextMutation: the observer is already detached, so a
				// mark would never be consumed and would leak into the next
				// instance, swallowing one future real-edit classification.
				text.nodeValue = owned.prefix + owned.text
			}
			clearAlert(el)
		}
		// Drop pending own-write markers so a re-injected instance cannot
		// mistake an old observer echo for its first real edit.
		for (const node of ownedTextNodes) ownTextMutations.delete(node)
```

</details>

#### 缺口

- 来源适配/AST或role约束与完整属性恢复方案未实现。
  **影响**：不计现有来源保证/创新优势。
  **进一步探讨**：固定DOM矩阵/状态转换模拟比较误改/漏标/回收，无真实对话材料。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
