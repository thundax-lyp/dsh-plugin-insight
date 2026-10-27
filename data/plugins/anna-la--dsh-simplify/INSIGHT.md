# dsh-simplify

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5acef7c](https://github.com/Anna-la/dsh-simplify/tree/5acef7c1be296276af0db5a071b61db3bac1b14d)

<!-- BEGIN META -->
[![npm 30d 1,237](https://img.shields.io/static/v1?label=npm+30d&message=1%2C237&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-simplify) [![最新发布 2026-10-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-simplify)
<!-- END META -->

> **功能**：清理模式下右键移除DSH界面元素，并在设置页预览、恢复及持久保存记录。

> **亮点**：相对临时DOM编辑，提供无需写选择器的隐藏—预览—撤销流程，并补足随机端口下的持久化。[Q03](#research-q03) 该增量是成熟DOM机制的实用组合。

> **主要限制**：原节点收养支持交互保留，但HTML兜底不能恢复组件事件和状态，“原样恢复”须限定控件与宿主。[Q04](#research-q04) 全量PUT也缺少跨窗口冲突控制。

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
  - [Q01 · 谁需要界面简化，合格交付是什么？](#detail-section-11)
  - [Q02 · DOM移除、预览与持久化如何连接？](#detail-section-12)
  - [Q03 · 相对CSS隐藏或开发者工具，具体增量是什么？](#detail-section-13)
  - [Q04 · “原样恢复、刷新后可交互”在哪些条件下不成立？](#detail-section-14)
  - [Q05 · 启动、使用、恢复分别依赖什么？](#detail-section-15)
  - [Q06 · 持久化与扫描带来哪些成本和工程取舍？](#detail-section-16)
  - [Q07 · 稳定语义锚点加撤销日志是否能改善持久清理？](#detail-section-17)
  - [Q08 · 哪些用户可以试用，什么结果应停止？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合个人用户按需隐藏DSH Web非关键控件；合格结果包含可找回和不破坏常用交互。

参照开发者工具临时移除和自定义CSS选择器；它们不自动提供当前交互恢复与跨端口记录流程，未进行用户时间对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 点选隐藏与重扫 | 减少不常用界面元素 | 严格HTML匹配；动态控件可能不再匹配 |
| 预览与恢复 | 找回隐藏元素 | 原节点优先，HTML兜底不保证框架事件 |
| 持久记录 | 跨端口重启沿用 | 需webServer和可写数据目录；多窗口无版本冲突检测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web/React/slots | 前端必需 | 侧栏与设置页 | 无法显示入口；兼容性未运行验证 |
| webServer与回环同源访问 | 跨重启必需 | 读写记录 | 退化为按源localStorage |
| 可写 ~/.dsh-simplify 或指定目录 | 持久化必需 | records.json | 保存失败；前端未完整反馈 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装并重载Web | 侧栏和设置页出现 |
| 2 | 用户隐藏非关键按钮 | 原位置消失且预览可见 |
| 3 | 用户先恢复再重启复验 | 原动作可用；失败先停用并保留记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装与本地存储；金额未知 | 挑选及验证恢复；耗时未知 | 不涉及模型调用 |
| 持续使用 | DOM监听重扫与HTML记录 | UI更新后维护；频率未知 | 大页面开销未测 |
| 失败恢复 | 备份和重置记录 | 处理错位、丢失交互 | 多窗口覆盖无自动合并 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 隐藏与恢复流程 | 源码有节点暂存与设置入口 | 所有React组件能否交互恢复 |
| 跨重启记录 | 服务端读写稳定JSON路径 | 异常与多窗口下是否一致 |
| 个人效率 | 减少重复手动DOM修改的设计 | 节时和满意度没有对照 |

> **思考**：原节点收养支持交互保留，但HTML兜底不能恢复组件事件和状态，“原样恢复”须限定控件与宿主。[Q04](#research-q04) 全量PUT也缺少跨窗口冲突控制。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对临时DOM编辑，提供无需写选择器的隐藏—预览—撤销流程，并补足随机端口下的持久化。[Q03](#research-q03) 该增量是成熟DOM机制的实用组合。

原节点与持久化数据分离、严格指纹防误删和监听释放可借鉴。直接整表writeFile及未检查PUT状态削弱持久化可信度；移植需重新适配DOM结构和slots。

<a id="detail-section-5"></a>

### 1.4 主要限制

原节点收养支持交互保留，但HTML兜底不能恢复组件事件和状态，“原样恢复”须限定控件与宿主。[Q04](#research-q04) 全量PUT也缺少跨窗口冲突控制。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议仅对个人本地Web的非关键控件试用，先验证恢复与记录落盘；动态组件或多窗口重度使用先暂停扩展。[Q08](#research-q08)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已确认源码中的界面清理与恢复设计；交互恢复效果尚未宿主验证，语义规则假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、client/client.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交检查README、包清单、前后端核心；没有运行DOM fixture、插件测试或真实DSH。
- 下一步：在隔离profile依次测试静态按钮、动态导航、受控输入的隐藏、交互预览、恢复和重启；对比CSS方案，失败时检查记录备份，不以插入HTML视为恢复成功。

**分析版本**

- **仓库**：[Anna-la/dsh-simplify](https://github.com/Anna-la/dsh-simplify)
- **版本号**：0.1.0（[固定提交 5acef7c](https://github.com/Anna-la/dsh-simplify/tree/5acef7c1be296276af0db5a071b61db3bac1b14d)）
- **版本日期**：2026-08-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是稳定语义锚点配合带版本撤销日志可兼顾动态页面匹配和多窗口一致性；须用误隐藏、恢复失败和人工维护次数证伪。[Q07](#research-q07)

在隔离profile依次测试静态按钮、动态导航、受控输入的隐藏、交互预览、恢复和重启；对比CSS方案，失败时检查记录备份，不以插入HTML视为恢复成功。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1020 | 849 | 111 | — |
| .md | source | 1 | 48 | — | — | 899 |
| .mjs | test | 1 | 100 | 83 | 9 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Anna-la/dsh-simplify/issues?q=is%3Aissue+created%3A2026-09-23T07%3A59%3A07.994Z..2026-10-23T07%3A59%3A07.994Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Anna-la/dsh-simplify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T07%3A59%3A07.994Z..2026-10-23T07%3A59%3A07.994Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：界面简化插件能否可撤销地隐藏DSH页面元素，适配增量、恢复边界和长期维护负担是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要界面简化，合格交付是什么？

**研究主题**：场景与需求

#### 完整回答

面向长期使用同一DSH Web界面、希望隐藏不常用控件的个人用户。合格结果是控件退出原布局、常用操作仍可完成，用户可以找回被隐藏元素；不是精简模型上下文或删除会话数据。README明确给出清理模式、悬浮描边和设置页恢复，入口代码也确实注册侧栏按钮与设置页。一次性隐藏可用开发者工具或自定义CSS，插件主要降低持续维护和撤销门槛。页面布局频繁变更或多人共享环境并非同样合适。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-15](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/README.md#L1-L15)

作者说明用途及跨端口持久化。

<details>
<summary>查看原文（15行）</summary>

```text
# dsh-simplify

DeepSeek Harness 界面简化插件：进入清理模式后，右键移除页面元素，被移除的元素可在「设置 → 简化」中查看交互式预览并原样恢复。

Clean up the DeepSeek Harness (dsh) web UI: in clean mode, right-click any page element to remove it; removed elements can be previewed interactively and restored from the settings page.

## 功能 / Features

- 首页左下角、设置按钮上方的「简化」图标按钮，一键进入/退出清理模式（仅图标，无文字）。
- 清理模式中悬浮元素会显示红色描边，右键移除，左键操作完全不受影响，Esc 或再次点击按钮退出。
- 移除记录**跨重启持久化**：DSH 每次启动会换一个随机端口，按源隔离的 localStorage 在重启后即失效；因此移除记录默认写入 `~/.dsh-simplify/records.json`（服务端桥 `/api/dsh-simplify/records`，仿官方插件 token-stat 的回环只读/写接口），浏览器 localStorage 仅作本地镜像与离线兜底——重启后记录仍会保留并自动重新生效。可用环境变量 `DSH_SIMPLIFY_DATA_DIR` 更改数据目录。
- 记录实时防复活（MutationObserver 重扫）：只有与移除时完全相同的元素会被重新清除，列表重排后位置漂移的相邻元素不会被误删。
- 设置页侧栏新增「简化」页：列出所有被移除元素，每条带**可交互预览**——按原样式绘制，直接点击预览即可执行该元素原本的操作（如切换设置页）且不会还原位置；**即使刷新页面后依然可交互**（插件会自动收养应用重建的等价元素，页面仍保持移除状态）；可独立「恢复」或勾选后「批量恢复」，恢复的元素以原样回到原位置。
- 侧边栏折叠时，页脚按钮与其它插件统一排成一列，互不冲突。

```

</details>

**依据 2 · 源码核查**：[client/client.js:848-874](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L848-L874)

侧栏按钮和设置页是实际用户入口。

<details>
<summary>查看原文（27行）</summary>

```text
		function apply(ctx) {
			injectCss()
			engineStart()
			installTestHook()
			ctx.effect(() => engineStop, 'dsh-simplify: engine lifecycle')

			// Sidebar toggle: renders in the footer-actions row above the settings gear.
			ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
				name: 'sidebar.footer.action',
				id: 'dsh-simplify-toggle',
				order: 10,
				label: () => '简化',
			}, SimplifyToggle))

			// Settings nav entry "简化" + the restore list page.
			ctx.slots.inject('settings.section', () => ctx.slots.register({
				name: 'settings.section',
				id: 'simplify',
				order: 45,
				label: () => '简化',
			}, SimplifySection))
		}

		exports.name = 'dsh-simplify'
		exports.inject = inject
		exports.apply = apply
		return module.exports
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DOM移除、预览与持久化如何连接？

**研究主题**：功能与机制

#### 完整回答

移除时保存XPath、父位置、outerHTML、标签及运行时节点引用，把原节点移入limbo而非立即销毁；记录序列化时删除_live引用，写localStorage镜像并经PUT保存服务器JSON。MutationObserver在布局更新后重扫；相同XPath处只有outerHTML逐字匹配才被再次移除，重载后可收养等价节点。恢复优先移动仍存活的原节点，失去节点时从保存HTML重建。这个机制能解释交互预览的意图，但HTML重建并不会自动重建框架内部事件或组件状态。

#### 证据与依据

**依据 1 · 源码核查**：[client/client.js:86-115](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L86-L115)

序列化和延迟写入路径。

<details>
<summary>查看原文（30行）</summary>

```text
		function serializeRecords() {
			// `_live` is a runtime node reference — never persist it.
			return state.records.map((r) => {
				const copy = Object.assign({}, r)
				delete copy._live
				return copy
			})
		}
		function persistLocal() {
			try {
				localStorage.setItem(STORE_KEY, JSON.stringify(serializeRecords()))
			} catch (_) { /* quota / privacy mode — keep in-memory only */ }
		}
		function pushToServer() {
			if (!serverReachable) return
			try {
				fetch(SERVER_RECORDS_URL, {
					method: 'PUT',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ records: serializeRecords() }),
				}).catch(() => { /* bridge down mid-session — local mirror still holds */ })
			} catch (_) { /* fetch unavailable — local-only */ }
		}
		function schedulePersist() {
			if (persistTimer) clearTimeout(persistTimer)
			persistTimer = setTimeout(() => {
				persistTimer = 0
				persistLocal()
				pushToServer()
			}, 120)
```

</details>

**依据 2 · 源码核查**：[client/client.js:370-391](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L370-L391)

记录包含定位、HTML与原节点。

<details>
<summary>查看原文（22行）</summary>

```text
		function removeElement(el) {
			if (!el || !el.parentElement) return false
			if (isOwnUi(el) || isProtectedRoot(el) || inShadowDom(el) || !el.isConnected) return false
			const parent = el.parentElement
			const record = {
				id: 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
				removedAt: Date.now(),
				xpath: xpathOf(el),
				html: el.outerHTML,
				parentXpath: xpathOf(parent),
				index: indexAmongChildren(el),
				label: labelOf(el),
				idAttr: el.id || '',
				_live: el,
			}
			moveToLimbo(el)
			state.records.unshift(record)
			if (state.records.length > MAX_RECORDS) state.records.length = MAX_RECORDS
			pruneChecked()
			schedulePersist()
			notify()
			if (state.active) setHint('已移除「' + trimText(record.label, 36) + '」· 可在 设置 → 简化 中恢复')
```

</details>

**依据 3 · 源码核查**：[client/client.js:404-437](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L404-L437)

重扫采用严格HTML相等和节点收养。

<details>
<summary>查看原文（34行）</summary>

```text
		function sweep() {
			if (!document.body || destroyed) return
			for (const rec of state.records) {
				const el = findEl(rec.xpath)
				if (!el || !el.isConnected) continue
				// Our own live node (parked in limbo/preview) is never at the
				// recorded spot — but never touch it even if it somehow matches.
				if (rec._live && el.isSameNode(rec._live)) continue
				// Identity fingerprint: only ever act on an element whose markup is
				// byte-identical to the one the user originally removed. After a
				// re-render/list shift, the recorded position may now hold a
				// DIFFERENT element (e.g. the next nav row) — removing it would
				// cascade deletes down the column, so drifted neighbours are left
				// alone.
				if (el.outerHTML !== rec.html) continue
				if (isOwnUi(el) || isProtectedRoot(el) || inShadowDom(el)) continue
				if (rec._live) {
					// A newer twin replaced the live node (React remounted it) — drop
					// the twin so the removal stays applied.
					el.remove()
					continue
				}
				// After a page reload the live node is gone; the app re-created an
				// identical element. ADOPT it instead of deleting: the page stays
				// clean (element leaves its position) while the preview gains a
				// live, fully interactive handle on the re-created node — clicking
				// it performs the element's original action even after reloads.
				rec._live = el
				moveToLimbo(rec._live)
			}
		}
		function ensureObserver() {
			if (observer) return
			observer = new MutationObserver(() => scheduleSweep())
```

</details>

**依据 4 · 源码核查**：[client/client.js:443-482](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L443-L482)

原节点恢复与HTML重建是不同路径。

<details>
<summary>查看原文（40行）</summary>

```text
		function restoreById(id) {
			const ix = state.records.findIndex((r) => r.id === id)
			if (ix < 0) return 'missing'
			const rec = state.records[ix]
			const parent = findEl(rec.parentXpath)
			if (!parent || !parent.isConnected) return 'noparent'
			// Live node (still parked in limbo or a settings-preview row): move
			// the very same node back to its original position — id restored, so
			// the element is exactly as it was before removal.
			if (rec._live && rec._live.isConnected) {
				const twin = findEl(rec.xpath)
				if (twin && twin !== rec._live && twin.outerHTML === rec.html) twin.remove()
				if (rec.idAttr) rec._live.id = rec.idAttr
				const targetIndex = Math.min(rec.index, parent.children.length)
				parent.insertBefore(rec._live, parent.children[targetIndex] || null)
				rec._live = null
				state.records.splice(ix, 1)
				pruneChecked()
				schedulePersist()
				notify()
				return 'ok'
			}
			// Reload path: a re-created element must be byte-identical before we
			// treat it as "already back" — a drifted different element is not it.
			const existing = findEl(rec.xpath)
			if (existing && existing.isConnected && existing.outerHTML === rec.html) {
				state.records.splice(ix, 1)
				pruneChecked()
				schedulePersist()
				notify()
				return 'ok'
			}
			const tpl = document.createElement('template')
			tpl.innerHTML = rec.html
			const node = tpl.content.firstElementChild
			if (!node) return 'nomarkup'
			const targetIndex = Math.min(rec.index, parent.children.length)
			const ref = parent.children[targetIndex] || null
			parent.insertBefore(node, ref)
			state.records.splice(ix, 1)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对CSS隐藏或开发者工具，具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

已识别的增量是将点选隐藏、可交互的节点暂存预览、恢复列表及跨随机端口的记录持久化组合成面向最终用户的流程。纯CSS规则通常需维护选择器，开发者工具改动通常不跨重载保存；此处用户不必编写选择器即可记录和撤销。核心DOM API、XPath和本地JSON桥属于成熟机制，不能按功能数量或README将其评为新的界面抽象。严格HTML匹配以牺牲动态元素持续隐藏为代价减少位置漂移的误删，是真实可解释的取舍。

#### 证据与依据

**依据 1 · 源码核查**：[client/client.js:412-433](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L412-L433)

字节相等检查优先防止相邻节点被误删。

<details>
<summary>查看原文（22行）</summary>

```text
				// Identity fingerprint: only ever act on an element whose markup is
				// byte-identical to the one the user originally removed. After a
				// re-render/list shift, the recorded position may now hold a
				// DIFFERENT element (e.g. the next nav row) — removing it would
				// cascade deletes down the column, so drifted neighbours are left
				// alone.
				if (el.outerHTML !== rec.html) continue
				if (isOwnUi(el) || isProtectedRoot(el) || inShadowDom(el)) continue
				if (rec._live) {
					// A newer twin replaced the live node (React remounted it) — drop
					// the twin so the removal stays applied.
					el.remove()
					continue
				}
				// After a page reload the live node is gone; the app re-created an
				// identical element. ADOPT it instead of deleting: the page stays
				// clean (element leaves its position) while the preview gains a
				// live, fully interactive handle on the re-created node — clicking
				// it performs the element's original action even after reloads.
				rec._live = el
				moveToLimbo(rec._live)
			}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3-13](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/lib/index.js#L3-L13)

服务器桥针对随机端口导致localStorage隔离。

<details>
<summary>查看原文（11行）</summary>

```text
// The browser half (client/client.js) removes page elements and keeps removal
// records in localStorage, but localStorage is origin-scoped: DSH relaunches
// the web server on a fresh port each time, so a restarted origin would lose
// every record. This side registers a loopback-only bridge
//
//   GET /api/dsh-simplify/records  -> { ok: true, records: [...] }
//   PUT /api/dsh-simplify/records  -> { ok: true, count: n }
//
// backed by a stable JSON file (~/.dsh-simplify/records.json by default,
// overridable via $DSH_SIMPLIFY_DATA_DIR), so removals survive restarts.
// Follows the same webServer-bridge pattern as dsh-token-stat / dsh-free-search.
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · “原样恢复、刷新后可交互”在哪些条件下不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强支持是保留并移动原节点，以及重载后收养重新创建的同字节节点；这比仅保存HTML更有利于保留事件。关键限制是页面仍由React等框架管理，节点移出树后的事件委托和组件生命周期没有通用保证。找不到相同HTML时恢复退回template.innerHTML插入，其返回成功不代表原组件处理函数和状态恢复。保存HTML还可能含页面内容，不能当成无敏感数据的纯选择器。严格匹配避免相邻误删，但动态计数、文案或属性变化会使规则不再生效。这些是源码路径和框架依赖边界，未复现真实故障。

#### 证据与依据

**依据 1 · 源码核查**：[client/client.js:415-434](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L415-L434)

仅一致markup可被收养。

<details>
<summary>查看原文（20行）</summary>

```text
				// DIFFERENT element (e.g. the next nav row) — removing it would
				// cascade deletes down the column, so drifted neighbours are left
				// alone.
				if (el.outerHTML !== rec.html) continue
				if (isOwnUi(el) || isProtectedRoot(el) || inShadowDom(el)) continue
				if (rec._live) {
					// A newer twin replaced the live node (React remounted it) — drop
					// the twin so the removal stays applied.
					el.remove()
					continue
				}
				// After a page reload the live node is gone; the app re-created an
				// identical element. ADOPT it instead of deleting: the page stays
				// clean (element leaves its position) while the preview gains a
				// live, fully interactive handle on the re-created node — clicking
				// it performs the element's original action even after reloads.
				rec._live = el
				moveToLimbo(rec._live)
			}
		}
```

</details>

**依据 2 · 源码核查**：[client/client.js:451-482](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L451-L482)

HTML兜底重建没有框架状态恢复。

<details>
<summary>查看原文（32行）</summary>

```text
			// the element is exactly as it was before removal.
			if (rec._live && rec._live.isConnected) {
				const twin = findEl(rec.xpath)
				if (twin && twin !== rec._live && twin.outerHTML === rec.html) twin.remove()
				if (rec.idAttr) rec._live.id = rec.idAttr
				const targetIndex = Math.min(rec.index, parent.children.length)
				parent.insertBefore(rec._live, parent.children[targetIndex] || null)
				rec._live = null
				state.records.splice(ix, 1)
				pruneChecked()
				schedulePersist()
				notify()
				return 'ok'
			}
			// Reload path: a re-created element must be byte-identical before we
			// treat it as "already back" — a drifted different element is not it.
			const existing = findEl(rec.xpath)
			if (existing && existing.isConnected && existing.outerHTML === rec.html) {
				state.records.splice(ix, 1)
				pruneChecked()
				schedulePersist()
				notify()
				return 'ok'
			}
			const tpl = document.createElement('template')
			tpl.innerHTML = rec.html
			const node = tpl.content.firstElementChild
			if (!node) return 'nomarkup'
			const targetIndex = Math.min(rec.index, parent.children.length)
			const ref = parent.children[targetIndex] || null
			parent.insertBefore(node, ref)
			state.records.splice(ix, 1)
```

</details>

**依据 3 · 源码核查**：[client/client.js:374-384](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L374-L384)

outerHTML会被持久保存。

<details>
<summary>查看原文（11行）</summary>

```text
			const record = {
				id: 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
				removedAt: Date.now(),
				xpath: xpathOf(el),
				html: el.outerHTML,
				parentXpath: xpathOf(parent),
				index: indexAmongChildren(el),
				label: labelOf(el),
				idAttr: el.id || '',
				_live: el,
			}
```

</details>

#### 缺口

- 原节点跨容器预览在实际React宿主中的事件语义未独立验证
  **影响**：无法把可交互预览及原样恢复解释为所有控件保证
  **进一步探讨**：以导航、受控输入和异步按钮分别验证重载前后操作与状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、使用、恢复分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

前端通过ModuleLoader加载React并依赖slots注册sidebar.footer.action和settings.section；服务端注入webServer提供同源回环记录桥。桥缺失时浏览器镜像仍可用，但随机端口重启不能承诺持久化。socket、Host、Origin及cross-site校验降低外站直接写入风险，并有2MiB请求上限；它不是多用户认证或存储隔离。用户安装并重载后先隐藏非关键元素，在设置页恢复，重启再验证。退出清理模式仅结束点选，不等于恢复全部元素；停用时engineStop移除监听和observer，但没有逐个还原节点。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:32-52](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/lib/index.js#L32-L52)

回环与同源守卫。

<details>
<summary>查看原文（21行）</summary>

```text
/** Loopback-only guard: refuse anything that is not from the local page. */
function isLoopbackRequest(request) {
  const address = request.socket?.remoteAddress
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false
  const host = request.headers?.host
  if (typeof host !== 'string') return false
  let hostUrl
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') return false
  if (request.headers?.['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers?.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:77-84](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/lib/index.js#L77-L84)

webServer缺失会退化。

```text
export function apply(ctx) {
  const logger = ctx.logger ?? { info() {}, warn() {}, error() {} }

  ctx.inject(['webServer'], (sctx) => {
    const webServer = sctx.get('webServer')
    if (!webServer || typeof webServer.register !== 'function') {
      logger.warn?.('[dsh-simplify] webServer 服务不可用，跨重启持久化桥未注册（仅 localStorage 会话内持久化）')
      return
```

**依据 3 · 源码核查**：[lib/index.js:115-127](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/lib/index.js#L115-L127)

保存请求写入稳定文件。

<details>
<summary>查看原文（13行）</summary>

```text
          if (req.method === 'PUT') {
            const body = await readJsonBody(req)
            if (!body || !Array.isArray(body.records)) {
              writeJson(res, 400, { ok: false, error: 'body must be {"records": [...]}' })
              return
            }
            try {
              await mkdir(pluginDataDir(), { recursive: true })
              await writeFile(recordsFile(), JSON.stringify(body.records, null, 2), 'utf8')
              writeJson(res, 200, { ok: true, count: body.records.length })
            } catch (error) {
              logger.warn?.('[dsh-simplify] 写入 records 失败:', String(error?.message ?? error))
              writeJson(res, 500, { ok: false, error: 'write failed' })
```

</details>

**依据 4 · 源码核查**：[client/client.js:807-820](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L807-L820)

停止引擎不执行逐项恢复。

<details>
<summary>查看原文（14行）</summary>

```text
		function engineStop() {
			destroyed = true
			document.removeEventListener('contextmenu', onContextMenu, true)
			document.removeEventListener('pointermove', onPointerMove, true)
			document.removeEventListener('keydown', onKeyDown, true)
			window.removeEventListener('scroll', onScrollOrResize, true)
			window.removeEventListener('resize', onScrollOrResize)
			if (observer) { observer.disconnect(); observer = null }
			if (persistTimer) { clearTimeout(persistTimer); persistTimer = 0 }
			if (sweepTimer) { clearTimeout(sweepTimer); sweepTimer = 0 }
			state.active = false
			hideHighlight()
			removeHint()
		}
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 持久化与扫描带来哪些成本和工程取舍？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

首次成本是安装、选择隐藏对象和测试恢复；持续成本是每次页面变动触发延迟扫描及规则随UI变化复核。现金与耗时无可靠测量。服务端直接writeFile整个JSON，没有临时文件改名或并发版本号；多窗口全量PUT可能后写覆盖先写，崩溃写入损坏也没有独立恢复日志。前端PUT仅catch网络异常、未检查HTTP失败，用户可能只保留本地镜像却以为已经持久化。可借鉴之处是原节点与序列化记录分离、防相邻误删以及生命周期监听清理；移植需重做宿主slots和DOM策略。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:121-127](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/lib/index.js#L121-L127)

全量JSON直接写入。

```text
            try {
              await mkdir(pluginDataDir(), { recursive: true })
              await writeFile(recordsFile(), JSON.stringify(body.records, null, 2), 'utf8')
              writeJson(res, 200, { ok: true, count: body.records.length })
            } catch (error) {
              logger.warn?.('[dsh-simplify] 写入 records 失败:', String(error?.message ?? error))
              writeJson(res, 500, { ok: false, error: 'write failed' })
```

**依据 2 · 源码核查**：[client/client.js:99-115](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L99-L115)

PUT请求未检查res.ok。

<details>
<summary>查看原文（17行）</summary>

```text
		function pushToServer() {
			if (!serverReachable) return
			try {
				fetch(SERVER_RECORDS_URL, {
					method: 'PUT',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ records: serializeRecords() }),
				}).catch(() => { /* bridge down mid-session — local mirror still holds */ })
			} catch (_) { /* fetch unavailable — local-only */ }
		}
		function schedulePersist() {
			if (persistTimer) clearTimeout(persistTimer)
			persistTimer = setTimeout(() => {
				persistTimer = 0
				persistLocal()
				pushToServer()
			}, 120)
```

</details>

**依据 3 · 源码核查**：[client/client.js:807-820](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L807-L820)

监听和observer有释放路径。

<details>
<summary>查看原文（14行）</summary>

```text
		function engineStop() {
			destroyed = true
			document.removeEventListener('contextmenu', onContextMenu, true)
			document.removeEventListener('pointermove', onPointerMove, true)
			document.removeEventListener('keydown', onKeyDown, true)
			window.removeEventListener('scroll', onScrollOrResize, true)
			window.removeEventListener('resize', onScrollOrResize)
			if (observer) { observer.disconnect(); observer = null }
			if (persistTimer) { clearTimeout(persistTimer); persistTimer = 0 }
			if (sweepTimer) { clearTimeout(sweepTimer); sweepTimer = 0 }
			state.active = false
			hideHighlight()
			removeHint()
		}
```

</details>

#### 缺口

- 多窗口写入和大页面重扫的实际开销未知
  **影响**：不能量化长期负担或承诺跨窗口一致性
  **进一步探讨**：用两个窗口交替隐藏恢复，并记录大量规则下扫描时间与最终持久记录。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 稳定语义锚点加撤销日志是否能改善持久清理？

**研究主题**：新假设与验证

#### 完整回答

由严格HTML相等降低误删却降低动态匹配率，以及全量写入缺乏版本检查，可以推导未验证假设：优先采用宿主提供的稳定控件ID、限定页面范围的规则，并以带版本的增删操作日志保存，可在降低误删的同时减少多窗口覆盖。新增代价是宿主锚点契约、规则迁移和冲突处理；不能简单放宽HTML相等。最小验证比较现实现与语义规则在重排、动态计数、重载和双窗口操作中的误隐藏、恢复失败、人工修正规则次数。若误隐藏增加或维护次数不降，则否定改造收益。

#### 证据与依据

**依据 1 · 源码核查**：[client/client.js:412-433](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L412-L433)

严格markup策略形成假设起点。

<details>
<summary>查看原文（22行）</summary>

```text
				// Identity fingerprint: only ever act on an element whose markup is
				// byte-identical to the one the user originally removed. After a
				// re-render/list shift, the recorded position may now hold a
				// DIFFERENT element (e.g. the next nav row) — removing it would
				// cascade deletes down the column, so drifted neighbours are left
				// alone.
				if (el.outerHTML !== rec.html) continue
				if (isOwnUi(el) || isProtectedRoot(el) || inShadowDom(el)) continue
				if (rec._live) {
					// A newer twin replaced the live node (React remounted it) — drop
					// the twin so the removal stays applied.
					el.remove()
					continue
				}
				// After a page reload the live node is gone; the app re-created an
				// identical element. ADOPT it instead of deleting: the page stays
				// clean (element leaves its position) while the preview gains a
				// live, fully interactive handle on the re-created node — clicking
				// it performs the element's original action even after reloads.
				rec._live = el
				moveToLimbo(rec._live)
			}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:121-127](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/lib/index.js#L121-L127)

直接整表写入形成一致性改进动机。

```text
            try {
              await mkdir(pluginDataDir(), { recursive: true })
              await writeFile(recordsFile(), JSON.stringify(body.records, null, 2), 'utf8')
              writeJson(res, 200, { ok: true, count: body.records.length })
            } catch (error) {
              logger.warn?.('[dsh-simplify] 写入 records 失败:', String(error?.message ?? error))
              writeJson(res, 500, { ok: false, error: 'write failed' })
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 哪些用户可以试用，什么结果应停止？

**研究主题**：采用判断

#### 完整回答

建议个人本地Web用户仅在非关键控件上试用，先验证隐藏、设置页恢复与重启后恢复，确认记录目录及备份方式。收益主要是界面定制便利，不能宣称节约模型token。若核心导航或交互失效、恢复只能插入静态HTML、桥写入失败不易察觉，应恢复记录并暂缓持续使用。当前缺少同版本真实宿主验收，结论为试用而非值得安装；采用判断以Q04和Q06的恢复与一致性边界为条件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-38](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/README.md#L32-L38)

作者给出的操作步骤。

```text
## 使用 / Usage

1. 点击左侧底部设置按钮上方的「简化」图标进入清理模式（底部出现提示条）。
2. 移动鼠标，悬浮的元素会显示红色描边；对该元素单击右键即可移除。左键点击、拖拽等操作不受影响。
3. 按 `Esc` 或再次点击「简化」图标退出清理模式。
4. 打开「设置 → 简化」，可查看全部已移除元素：行内预览区显示元素原样式，点击可体验它原本的操作（不会还原位置）；勾选多条后点「批量恢复」，或对单条点「恢复」。

```

**依据 2 · 源码核查**：[client/client.js:443-482](https://github.com/Anna-la/dsh-simplify/blob/5acef7c1be296276af0db5a071b61db3bac1b14d/client/client.js#L443-L482)

恢复机制支持受控试用但有兜底边界。

<details>
<summary>查看原文（40行）</summary>

```text
		function restoreById(id) {
			const ix = state.records.findIndex((r) => r.id === id)
			if (ix < 0) return 'missing'
			const rec = state.records[ix]
			const parent = findEl(rec.parentXpath)
			if (!parent || !parent.isConnected) return 'noparent'
			// Live node (still parked in limbo or a settings-preview row): move
			// the very same node back to its original position — id restored, so
			// the element is exactly as it was before removal.
			if (rec._live && rec._live.isConnected) {
				const twin = findEl(rec.xpath)
				if (twin && twin !== rec._live && twin.outerHTML === rec.html) twin.remove()
				if (rec.idAttr) rec._live.id = rec.idAttr
				const targetIndex = Math.min(rec.index, parent.children.length)
				parent.insertBefore(rec._live, parent.children[targetIndex] || null)
				rec._live = null
				state.records.splice(ix, 1)
				pruneChecked()
				schedulePersist()
				notify()
				return 'ok'
			}
			// Reload path: a re-created element must be byte-identical before we
			// treat it as "already back" — a drifted different element is not it.
			const existing = findEl(rec.xpath)
			if (existing && existing.isConnected && existing.outerHTML === rec.html) {
				state.records.splice(ix, 1)
				pruneChecked()
				schedulePersist()
				notify()
				return 'ok'
			}
			const tpl = document.createElement('template')
			tpl.innerHTML = rec.html
			const node = tpl.content.firstElementChild
			if (!node) return 'nomarkup'
			const targetIndex = Math.min(rec.index, parent.children.length)
			const ref = parent.children[targetIndex] || null
			parent.insertBefore(node, ref)
			state.records.splice(ix, 1)
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
