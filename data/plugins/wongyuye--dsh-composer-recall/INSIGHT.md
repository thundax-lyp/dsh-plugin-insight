# dsh-composer-recall

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3a816a3](https://github.com/WongYuYe/dsh-composer-recall/tree/3a816a36648007a9eb266798234118600a3e88c9)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WongYuYe/dsh-composer-recall) [![npm 30d 777](https://img.shields.io/static/v1?label=npm+30d&message=777&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-composer-recall) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-composer-recall)
<!-- END META -->

> **功能**：在 DSH 输入框用方向键召回本会话已显示的用户消息，并恢复草稿。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 为已显示消息提供就地键盘召回；缺实际对照，不能量化节省。

> **主要限制**：[Q03](#research-q03) 闭包状态未按会话隔离，DOM 全局查询和静默异常使实际会话切换及恢复值得验证。

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
  - [Q01 · 谁需要输入历史，相比手动查找增加什么？](#detail-section-11)
  - [Q02 · 事件如何找到会话、收集历史并写入草稿？](#detail-section-12)
  - [Q03 · 什么时候会误触或丢失原草稿？](#detail-section-13)
  - [Q04 · 部署需要什么依赖，失败如何恢复？](#detail-section-14)
  - [Q05 · 怎样安全试用，何时停止？](#detail-section-15)
  - [Q06 · 按会话隔离游标是否值得扩展？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在兼容 DSH 输入框反复编辑已发送消息的用户。

手动从聊天记录复制，或使用目标宿主既有历史快捷键；效果差异未测。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 上下键 | 浏览已渲染用户文本 | 非跨会话持久历史 |
| Esc | 恢复暂存草稿 | 会话切换和输入法未验证 |

**流程与依赖**

| 依赖 | 作用 | 边界 |
|---|---|---|
| 兼容 DSH 客户端 | 提供输入 shell 和 DOM | conversation peer 指定版本范围 |
| 浏览器端 | 接收键盘与渲染消息 | DOM 变化可能失效 |

| 步骤 | 动作 | 结果或处理 |
|---|---|---|
| 安装 | 为目标 profile 安装并重载 | 核对版本 |
| 召回 | 输入为空或光标在首位按上 | 从已渲染消息取文本 |
| 退出 | 按 Esc 或前进到末尾 | 恢复草稿；失败时手工复制 |

**效果与成本**

| 阶段 | 现金和资源 | 人工时间 |
|---|---|---|
| 首次 | 未知 | 安装与版本测试 |
| 持续 | 未测 | 核对快捷键和文本 |
| 恢复 | 未测 | 重新复制草稿 |

| 效果 | 源码支持 | 未确定 |
|---|---|---|
| 召回 | 按键遍历页面文本 | 实际节省时间 |
| 草稿恢复 | 保存与写回机制 | 宿主切换和异常表现 |

> **思考**：[Q03](#research-q03) 闭包状态未按会话隔离，DOM 全局查询和静默异常使实际会话切换及恢复值得验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 为已显示消息提供就地键盘召回；缺实际对照，不能量化节省。

[Q02](#research-q02) 事件捕获有卸载路径；[Q03](#research-q03) 静默异常和跨会话闭包状态需要验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 闭包状态未按会话隔离，DOM 全局查询和静默异常使实际会话切换及恢复值得验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先用非敏感文本验证按键、会话切换和恢复，异常时停止并手动复制。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持静态机制判断；未验证桌面宿主和实际操作。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态核查包声明与客户端主要路径，未安装、运行或比较目标宿主。
- 下一步：在目标桌面版本测试多会话、虚拟滚动、输入法、草稿恢复和卸载。

**分析版本**

- **仓库**：[WongYuYe/dsh-composer-recall](https://github.com/WongYuYe/dsh-composer-recall)
- **版本号**：0.1.3（[固定提交 3a816a3](https://github.com/WongYuYe/dsh-composer-recall/tree/3a816a36648007a9eb266798234118600a3e88c9)）
- **版本日期**：2026-09-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出按会话隔离游标和草稿，需用实例生命周期及切换测试确认。

在目标桌面版本测试多会话、虚拟滚动、输入法、草稿恢复和卸载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 197 | 155 | 20 | — |
| .md | source | 2 | 98 | — | — | 519 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/WongYuYe/dsh-composer-recall/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/WongYuYe/dsh-composer-recall/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/WongYuYe/dsh-composer-recall/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查输入历史的用户价值、实际接线、兼容和风险。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要输入历史，相比手动查找增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

使用兼容 DSH Lexical 输入框、反复编辑本会话已发消息的人，可以用方向键从显示的用户消息中召回文本，减少切到聊天记录复制的步骤；Esc 或前进到末尾可恢复暂存草稿。相对手动查找复制，这是键盘就地操作；未比较实际时间、准确率或宿主原生快捷键，不能声称独有或更高效。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-12](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/README.md#L9-L12)

作者说明用途和旧方案差异。

```text
给 [DSH Desktop](https://github.com/anywhere-labs/dsh-desktop) 输入框用的方向键历史：空着按 **↑** 召回本会话刚发过的话，**↓** 前进，**Esc** 还原正在打的草稿。

适配现在的 Lexical 输入框。去读 `session.getSnapshot().nodes` 或 `<textarea>` 的旧历史插件，在这个版本上会崩或没反应。

```

**依据 2 · 源码核查**：[lib/client.js:131-163](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L131-L163)

触发和恢复逻辑。

<details>
<summary>查看原文（33行）</summary>

```text
				if (e.key === 'ArrowUp') {
					if (cursor === -1) {
						const caret = caretOffset(composer)
						if (draft !== '' && caret !== 0) return
						const next = userHistory()
						if (next.length === 0) return
						hist = next
						draftStash = draft
						cursor = hist.length - 1
						e.preventDefault()
						e.stopPropagation()
						setDraft(shell, hist[cursor])
					} else {
						e.preventDefault()
						e.stopPropagation()
						if (cursor > 0) {
							cursor -= 1
							setDraft(shell, hist[cursor])
						}
					}
					return
				}

				if (cursor === -1) return
				e.preventDefault()
				e.stopPropagation()
				if (cursor < hist.length - 1) {
					cursor += 1
					setDraft(shell, hist[cursor])
				} else {
					cursor = -1
					setDraft(shell, draftStash)
				}
```

</details>

#### 缺口

- 缺实际使用与原生能力对照
  **影响**：无法确认效益或快捷键冲突
  **进一步探讨**：在目标版本对比手动复制和原生快捷键。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 事件如何找到会话、收集历史并写入草稿？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端捕获 keydown，确认目标是输入区并处于焦点，通过 sessions 当前 ID 和 conversation.input.for 获取 shell；首次上键读取页面所有匹配的用户消息行，取 bubble 文本并去空格，再保存当前草稿和数组游标。上下移动调用 shell.setDraft；可信 input 退出浏览，effect 卸载监听器。历史来自渲染 DOM 而非持久存储，快照建立后不会同步新增消息；抓取、读取或写入异常被吞掉，可能无反馈。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:20-57](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L20-L57)

查找 shell 和读取写入草稿。

<details>
<summary>查看原文（38行）</summary>

```text
		function composerOf(target) {
			if (!(target instanceof HTMLElement)) return undefined
			const editable = target.closest(COMPOSER_SEL)
			if (editable instanceof HTMLElement && editable.closest(SCROLL_SEL) !== null) return editable
			return undefined
		}

		/** The per-session input shell (SessionInputShell face), or undefined. */
		function currentShell(ctx) {
			try {
				const sessions = ctx.get('sessions')
				const conversation = ctx.get('conversation')
				const id = sessions?.list?.getSnapshot?.()?.current
				if (id === undefined) return undefined
				const actx = sessions.scope(id)
				if (actx === undefined) return undefined
				return conversation.input.for(actx)
			} catch {
				return undefined
			}
		}

		/** Authoritative plain-text draft of the current composer. */
		function currentDraft(shell) {
			try {
				return shell.state.getSnapshot().draft ?? ''
			} catch {
				return ''
			}
		}

		/** Replace the whole draft via the official input shell (editor.update). */
		function setDraft(shell, text) {
			if (shell === undefined) return
			try {
				shell.setDraft(text)
			} catch {}
		}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:59-75](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L59-L75)

页面范围收集文本。

<details>
<summary>查看原文（17行）</summary>

```text
		/**
		 * Submitted user prompts for the current session, oldest first, read from
		 * rendered chat rows. Each `[data-chat-flow-kind="user"]` row carries its
		 * text in a `.bubble` element (the row also contains a timestamp / copy
		 * action, so the bubble is the reliable text face).
		 */
		function userHistory() {
			const out = []
			try {
				for (const row of document.querySelectorAll(USER_SEL)) {
					const bubble = row.querySelector('[class*="bubble"]')
					const text = (bubble !== null ? bubble.textContent : row.textContent) ?? ''
					const t = text.replace(/\u00a0/g, ' ').trim()
					if (t !== '') out.push(t)
				}
			} catch {}
			return out
```

</details>

**依据 3 · 源码核查**：[lib/client.js:109-168](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L109-L168)

按键与输入状态。

<details>
<summary>查看原文（60行）</summary>

```text
			const onKeyDown = (e) => {
				if (e.key === 'Escape') {
					if (composerOf(e.target) === undefined) return
					if (cursor === -1) return
					cursor = -1
					setDraft(currentShell(ctx), draftStash)
					return
				}

				if (composing || e.isComposing) return
				if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
				if (e.ctrlKey || e.metaKey || e.altKey) return

				const composer = composerOf(e.target)
				if (composer === undefined) return
				if (document.activeElement !== composer) return

				const shell = currentShell(ctx)
				if (shell === undefined) return

				const draft = currentDraft(shell)

				if (e.key === 'ArrowUp') {
					if (cursor === -1) {
						const caret = caretOffset(composer)
						if (draft !== '' && caret !== 0) return
						const next = userHistory()
						if (next.length === 0) return
						hist = next
						draftStash = draft
						cursor = hist.length - 1
						e.preventDefault()
						e.stopPropagation()
						setDraft(shell, hist[cursor])
					} else {
						e.preventDefault()
						e.stopPropagation()
						if (cursor > 0) {
							cursor -= 1
							setDraft(shell, hist[cursor])
						}
					}
					return
				}

				if (cursor === -1) return
				e.preventDefault()
				e.stopPropagation()
				if (cursor < hist.length - 1) {
					cursor += 1
					setDraft(shell, hist[cursor])
				} else {
					cursor = -1
					setDraft(shell, draftStash)
				}
			}

			const onInput = (e) => {
				if (cursor !== -1 && composerOf(e.target) !== undefined && e.isTrusted) cursor = -1
			}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:170-185](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L170-L185)

注册和卸载。

<details>
<summary>查看原文（16行）</summary>

```text
			document.addEventListener('compositionstart', onCompositionStart, true)
			document.addEventListener('compositionend', onCompositionEnd, true)
			document.addEventListener('keydown', onKeyDown, true)
			document.addEventListener('input', onInput, true)

			ctx.effect(() => () => {
				document.removeEventListener('compositionstart', onCompositionStart, true)
				document.removeEventListener('compositionend', onCompositionEnd, true)
				document.removeEventListener('keydown', onKeyDown, true)
				document.removeEventListener('input', onInput, true)
			}, 'dsh-composer-recall: history')
		}

		exports.name = name
		exports.inject = inject
		exports.apply = apply
```

</details>

#### 缺口

- 未在实际页面检查渲染、虚拟列表或 shell 写入
  **影响**：不能保证完整历史或实际联动
  **进一步探讨**：使用多消息与滚动加载的目标页面人工验证。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么时候会误触或丢失原草稿？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

首次上键仅在空草稿或光标偏移为零时触发，拒绝 Ctrl、Meta、Alt 及输入法组合；但 Escape 分支在组合状态检查之前，且未阻止事件继续传播。游标与暂存草稿保存在插件级闭包，不按会话键隔离，源码没有会话切换时重置；若在浏览历史中切换会话，后续事件可能对当前 shell 使用旧会话历史或草稿，这是静态风险而非已复现缺陷。DOM 查询是 document 全局范围，实际是否混入其他可见或隐藏会话取决于宿主页面。setDraft 异常被吞掉，按键已被拦截时也可能无修改。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:96-127](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L96-L127)

闭包状态、Escape 和组合顺序。

<details>
<summary>查看原文（32行）</summary>

```text
		function apply(ctx) {
			let cursor = -1
			let hist = []
			let draftStash = ''
			let composing = false

			const onCompositionStart = () => {
				composing = true
			}
			const onCompositionEnd = () => {
				composing = false
			}

			const onKeyDown = (e) => {
				if (e.key === 'Escape') {
					if (composerOf(e.target) === undefined) return
					if (cursor === -1) return
					cursor = -1
					setDraft(currentShell(ctx), draftStash)
					return
				}

				if (composing || e.isComposing) return
				if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
				if (e.ctrlKey || e.metaKey || e.altKey) return

				const composer = composerOf(e.target)
				if (composer === undefined) return
				if (document.activeElement !== composer) return

				const shell = currentShell(ctx)
				if (shell === undefined) return
```

</details>

**依据 2 · 源码核查**：[lib/client.js:131-163](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L131-L163)

草稿保存、阻止按键和写入。

<details>
<summary>查看原文（33行）</summary>

```text
				if (e.key === 'ArrowUp') {
					if (cursor === -1) {
						const caret = caretOffset(composer)
						if (draft !== '' && caret !== 0) return
						const next = userHistory()
						if (next.length === 0) return
						hist = next
						draftStash = draft
						cursor = hist.length - 1
						e.preventDefault()
						e.stopPropagation()
						setDraft(shell, hist[cursor])
					} else {
						e.preventDefault()
						e.stopPropagation()
						if (cursor > 0) {
							cursor -= 1
							setDraft(shell, hist[cursor])
						}
					}
					return
				}

				if (cursor === -1) return
				e.preventDefault()
				e.stopPropagation()
				if (cursor < hist.length - 1) {
					cursor += 1
					setDraft(shell, hist[cursor])
				} else {
					cursor = -1
					setDraft(shell, draftStash)
				}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:65-75](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L65-L75)

全页面用户行查询。

<details>
<summary>查看原文（11行）</summary>

```text
		function userHistory() {
			const out = []
			try {
				for (const row of document.querySelectorAll(USER_SEL)) {
					const bubble = row.querySelector('[class*="bubble"]')
					const text = (bubble !== null ? bubble.textContent : row.textContent) ?? ''
					const t = text.replace(/\u00a0/g, ' ').trim()
					if (t !== '') out.push(t)
				}
			} catch {}
			return out
```

</details>

**依据 4 · 源码核查**：[lib/client.js:51-57](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L51-L57)

写入异常静默。

```text
		/** Replace the whole draft via the official input shell (editor.update). */
		function setDraft(shell, text) {
			if (shell === undefined) return
			try {
				shell.setDraft(text)
			} catch {}
		}
```

#### 缺口

- 未复现切换会话、IME 与多个页面容器
  **影响**：不能确认风险在指定宿主实际发生
  **进一步探讨**：隔离桌面验证切换会话、输入法和多窗口。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署需要什么依赖，失败如何恢复？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包版本 0.1.3，声明 Node >=20、Cordis ^4.0.1 与可选 conversation peer >=0.1.2-alpha.1 <0.2.0-0；客户端平台 web 并注入会话与 conversation。README 给出 Desktop 安装及刷新，源码依赖 Lexical 区域的 data 属性、用户行和 bubble 类名，宿主布局变动可造成空历史或取错文本。首次需配置并重载，持续需检查版本与快捷键冲突，未测现金、耗时；若失效可停用插件并手工从聊天复制。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:39-64](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/package.json#L39-L64)

运行环境和兼容范围。

<details>
<summary>查看原文（26行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-ui-conversation": ">=0.1.2-alpha.1 <0.2.0-0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-client-ui-conversation": {
      "optional": true
    }
```

</details>

**依据 2 · 作者声明**：[README.md:14-35](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/README.md#L14-L35)

安装与刷新步骤。

<details>
<summary>查看原文（22行）</summary>

````text

```sh
dsh plugin --profile desktop add dsh-composer-recall
```

或从 GitHub：

```sh
dsh plugin --profile desktop add github:WongYuYe/dsh-composer-recall
```

装完刷新 Web GUI，或重启 DSH Desktop。

从源码：

```sh
git clone https://github.com/WongYuYe/dsh-composer-recall.git
cd dsh-composer-recall
dsh plugin --profile desktop add .
```

需要 DeepSeek Harness `0.1.2-alpha.1` 及以上（Lexical 输入框）。
````

</details>

**依据 3 · 源码核查**：[lib/client.js:8-13](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L8-L13)

依赖与 DOM 选择器。

```text
		const name = 'dsh-composer-recall'
		const inject = ['conversation', 'sessions']

		const COMPOSER_SEL = '[data-composer-input]'
		const SCROLL_SEL = '[data-input-scroll]'
		const USER_SEL = '[data-chat-flow-kind="user"]'
```

**依据 4 · 源码核查**：[lib/client.js:65-75](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L65-L75)

文本提取依赖 bubble。

<details>
<summary>查看原文（11行）</summary>

```text
		function userHistory() {
			const out = []
			try {
				for (const row of document.querySelectorAll(USER_SEL)) {
					const bubble = row.querySelector('[class*="bubble"]')
					const text = (bubble !== null ? bubble.textContent : row.textContent) ?? ''
					const t = text.replace(/\u00a0/g, ' ').trim()
					if (t !== '') out.push(t)
				}
			} catch {}
			return out
```

</details>

#### 缺口

- 未安装也未核线上包与具体桌面版本
  **影响**：不能证实兼容性或依赖解析
  **进一步探讨**：在可回退配置中安装并验证目标版本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样安全试用，何时停止？

**研究主题**：采用判断、效果与总成本

#### 完整回答

有兼容宿主且主要处理纯文本的用户可在可回退配置用非敏感短语测试上下、Esc、编辑后退出、切换会话与输入法；结果与原记录逐字比对，保留临时草稿。若召回错误会话、文本被截断、恢复失败或影响输入法，应停止使用并退回手动复制。未测试富文本、附件、虚拟化和长期使用，不应依赖它保存唯一草稿。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:65-75](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L65-L75)

只从文本内容提取。

<details>
<summary>查看原文（11行）</summary>

```text
		function userHistory() {
			const out = []
			try {
				for (const row of document.querySelectorAll(USER_SEL)) {
					const bubble = row.querySelector('[class*="bubble"]')
					const text = (bubble !== null ? bubble.textContent : row.textContent) ?? ''
					const t = text.replace(/\u00a0/g, ' ').trim()
					if (t !== '') out.push(t)
				}
			} catch {}
			return out
```

</details>

**依据 2 · 源码核查**：[lib/client.js:96-118](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L96-L118)

状态及 Escape 顺序。

<details>
<summary>查看原文（23行）</summary>

```text
		function apply(ctx) {
			let cursor = -1
			let hist = []
			let draftStash = ''
			let composing = false

			const onCompositionStart = () => {
				composing = true
			}
			const onCompositionEnd = () => {
				composing = false
			}

			const onKeyDown = (e) => {
				if (e.key === 'Escape') {
					if (composerOf(e.target) === undefined) return
					if (cursor === -1) return
					cursor = -1
					setDraft(currentShell(ctx), draftStash)
					return
				}

				if (composing || e.isComposing) return
```

</details>

**依据 3 · 源码核查**：[lib/client.js:154-168](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L154-L168)

前进恢复和编辑退出。

<details>
<summary>查看原文（15行）</summary>

```text
				if (cursor === -1) return
				e.preventDefault()
				e.stopPropagation()
				if (cursor < hist.length - 1) {
					cursor += 1
					setDraft(shell, hist[cursor])
				} else {
					cursor = -1
					setDraft(shell, draftStash)
				}
			}

			const onInput = (e) => {
				if (cursor !== -1 && composerOf(e.target) !== undefined && e.isTrusted) cursor = -1
			}
```

</details>

#### 缺口

- 没有真实宿主测试
  **影响**：不能证明上述试用步骤成功
  **进一步探讨**：测试前保存草稿并记录宿主版本。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 按会话隔离游标是否值得扩展？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可验证的设计假设是把历史游标和草稿绑定会话 ID，切换时重置或恢复该会话状态；相比现有单闭包可减少跨会话串用的可能，但额外状态可能引入过期草稿或内存管理复杂度。以多会话切换与失败写入案例比较现有版本和原型，记录错误草稿和操作成本；若宿主本就会销毁实例或新状态带来更多误恢复，则不应假定此改动有价值。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:28-36](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L28-L36)

当前会话 ID 的获取。

```text
		function currentShell(ctx) {
			try {
				const sessions = ctx.get('sessions')
				const conversation = ctx.get('conversation')
				const id = sessions?.list?.getSnapshot?.()?.current
				if (id === undefined) return undefined
				const actx = sessions.scope(id)
				if (actx === undefined) return undefined
				return conversation.input.for(actx)
```

**依据 2 · 源码核查**：[lib/client.js:96-100](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L96-L100)

游标和暂存位于 apply 闭包。

```text
		function apply(ctx) {
			let cursor = -1
			let hist = []
			let draftStash = ''
			let composing = false
```

**依据 3 · 源码核查**：[lib/client.js:109-115](https://github.com/WongYuYe/dsh-composer-recall/blob/3a816a36648007a9eb266798234118600a3e88c9/lib/client.js#L109-L115)

Escape 恢复当前 shell。

```text
			const onKeyDown = (e) => {
				if (e.key === 'Escape') {
					if (composerOf(e.target) === undefined) return
					if (cursor === -1) return
					cursor = -1
					setDraft(currentShell(ctx), draftStash)
					return
```

#### 缺口

- 没有切换生命周期证据或原型对照
  **影响**：不能确定潜在风险是否发生或改动收益
  **进一步探讨**：在真实宿主记录切换和实例生命周期后验证原型。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
