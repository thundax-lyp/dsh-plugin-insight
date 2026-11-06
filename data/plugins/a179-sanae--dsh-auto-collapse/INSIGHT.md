# dsh-auto-collapse

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[141a5c7](https://github.com/a179-sanae/dsh-auto-collapse/tree/141a5c71d7bf556a2feba030d0f6f43104e903d4)

<!-- BEGIN META -->
[![GitHub ★ 61](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=61&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/a179-sanae/dsh-auto-collapse) [![npm 30d 1,525](https://img.shields.io/static/v1?label=npm+30d&message=1%2C525&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-auto-collapse) [![最新发布 2026-09-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-auto-collapse)
<!-- END META -->

> **功能**：在 DSH Web 正文之间合并折叠思考、工具与上下文，保留原生内容和展开入口。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持正文边界分组、流式保留手动意图和可撤销属性租约的组合增量。原生内容所有权归宿主，插件提供阅读组织而非任务完成保证。

> **主要限制**：[Q03](#research-q03)的宿主DOM属性是关键前提；未知渲染器保留可见，但新data-state默认done可能让摘要过于乐观。显示收起、状态替换与模型执行无因果保证，重要结果仍需原生核对。

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
  - [Q01 · 相对原生回合摘要，按正文工作段折叠增加什么？](#detail-section-11)
  - [Q02 · 隐藏内容、搜索焦点和异常如何恢复？](#detail-section-12)
  - [Q03 · 宿主版本和配置如何限制采用成本？](#detail-section-13)
  - [Q04 · 什么人值得试用，如何证伪阅读收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为阅读长工具链的DSH Web用户保留正文、按工作段收起过程，需要时展开原生行；短会话或持续看工具细节者未必受益。

原生一级回合和三级单行之间增加工作段颗粒度，既不重写推理内容，也不压缩模型上下文，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 二级工作段 | 合并正文之间的思考、工具和上下文 | 原生一级与三级仍归宿主，依赖DOM契约 |
| 搜索焦点揭示 | 找到隐藏过程并保持输入可达 | 依赖浏览器beforematch/focus及宿主结构 |
| 流式展开意图 | 追加工作仍保留手动展开 | 内存状态，不保证跨刷新持久 |
| 异常/卸载恢复 | 释放自己租用的隐藏属性和按钮 | 其他插件所有权变化需核对 |
| 状态文字配置 | 替换运行提示，空值恢复官方 | 仅显示，不改变模型或工具执行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web与匹配DOM属性 | 核心必需 | 识别正文、思考、工具与原生折叠 | 未知节点保留可见，版本仍需核对 |
| MutationObserver、rAF与浏览器搜索事件 | 核心显示必需 | 追踪流式和隐藏内容揭示 | 不能承诺所有浏览器搜索可达 |
| slots/settingsScope | 配置增强可选 | 状态文字设置 | 服务晚到可重连，不阻断核心分组 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 接入 | 用户安装Web profile并选代表历史 | 不把包声明当全部版本兼容 |
| 分组 | 控制器按正文边界插二级入口 | 正文和未知节点保持原生，流式不抢手动展开 |
| 查找 | 用户展开/搜索/聚焦原生行 | 待输入与原内容可达，不据摘要验收执行 |
| 恢复 | 禁用并刷新 | stop和租约释放后核对原生展示 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 装包资源未知，无专用模型服务配置 | 检查目标DOM和代表历史，耗时未知 | 只读显示不等零成本 |
| 持续 | 观察器、布局读写资源未测 | 展开过程与升级复核 | 未证明阅读节时 |
| 失败恢复 | 刷新和排障资源未知 | 禁用并核对原生可达 | 同时改DOM的插件需另验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 阅读组织 | 正文边界与三级职责实现 | 查找时间和漏读率 |
| 可达恢复 | hidden租约、focus/search、异常释放 | 真实浏览器与其他插件组合 |
| 模型成本 | 只改显示与状态文字 | 无上下文压缩或节token证据 |

> **思考**：[Q03](#research-q03)的宿主DOM属性是关键前提；未知渲染器保留可见，但新data-state默认done可能让摘要过于乐观。显示收起、状态替换与模型执行无因果保证，重要结果仍需原生核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持正文边界分组、流式保留手动意图和可撤销属性租约的组合增量。原生内容所有权归宿主，插件提供阅读组织而非任务完成保证。

分组纯逻辑、DOM识别、属性租约与配置服务解耦，异常先恢复可见再等待宿主变化，便于复用。未知状态默认done与浏览器事件兼容需保留边界，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)的宿主DOM属性是关键前提；未知渲染器保留可见，但新data-state默认done可能让摘要过于乐观。显示收起、状态替换与模型执行无因果保证，重要结果仍需原生核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在目标版本用含正文、工具、上下文和待输入的会话核对二级入口、展开原顺序、搜索与焦点。再观察流式追加是否保留手动展开；不把摘要done当任务成功。发现漏行、不可达或更费力就禁用刷新回原生。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

仅固定源码核查分组、显示租约、恢复与配置接线；作者夹具验证不等本次真实宿主验收。unknown呈现为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client.ts、src/index.ts、src/host-contract.ts、src/work-groups.ts、src/work-model.ts、src/controller.ts、src/dom-view.ts、src/work-info.ts、src/summary.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定源码入口、正文分组、模型节点识别、DOM租约、搜索/输入、异常卸载及状态设置；未运行作者测试或目标浏览器。
- 下一步：仅固定版本源码和作者说明；未安装、运行插件、目标测试或真实宿主。作者夹具版本不外推为本次通过，阅读效果没有同条件实测。

**分析版本**

- **仓库**：[a179-sanae/dsh-auto-collapse](https://github.com/a179-sanae/dsh-auto-collapse)
- **版本号**：0.2.1（[固定提交 141a5c7](https://github.com/a179-sanae/dsh-auto-collapse/tree/141a5c71d7bf556a2feba030d0f6f43104e903d4)）
- **版本日期**：2026-09-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)提出未验证的unknown状态保留，避免新宿主状态被默认为done。比较错误完成判断、查找和阅读负担；不减少误判或噪声代价过高则放弃，不计已有贡献。

仅固定版本源码和作者说明；未安装、运行插件、目标测试或真实宿主。作者夹具版本不外推为本次通过，阅读效果没有同条件实测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 261 | — | — | 3601 |
| .mjs | source | 3 | 134 | 108 | 17 | — |
| .js | source | 2 | 1245 | 1218 | 55 | — |
| .ts | source | 13 | 1381 | 1191 | 81 | — |
| .mjs | test | 13 | 1063 | 960 | 35 | — |
| .jsx | example | 3 | 592 | 429 | 111 | — |
| .js | example | 1 | 2421 | 1906 | 517 | — |
| .md | example | 1 | 28 | — | — | 477 |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/a179-sanae/dsh-auto-collapse/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断工作段折叠能否在保留原生可达性的前提下减少长会话阅读噪声。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对原生回合摘要，按正文工作段折叠增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它适合阅读长会话、希望保留最终正文但不反复扫过思考、工具与上下文的DSH Web用户。原生一级回合摘要仍归宿主，插件在正文之间插入一个二级工作段入口，展开后显示原生三级行，不复制推理正文。相对每行独立收起或整回合收起，它提供介于两者之间的阅读颗粒度。合格结果是正文连续、过程仍可找到、需要输入的工作不被藏住，而非模型更省token。

work-model只接管带原生disclosure的工具/思考节点，正文、图片、SVG和未知渲染器保持边界；work-groups按正文与硬边界断组，不跨用户消息或不同turn，展开状态按组与原项目关联保留，避免流式追加一行就收回用户意图。贡献是尊重原生内容所有权的二级分组，不是摘要模型或新的上下文压缩算法。

短会话或主要看工具细节的人可能更喜欢原生展开；只有源码能说明分组规则，不能证明阅读时间减少或关键信息不被漏看。作者的浏览器夹具说明是作者验证范围，不作为本次真实宿主通过。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-23](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/README.md#L1-L23)

作者说明三级职责和阅读目标。

<details>
<summary>查看原文（23行）</summary>

````text
# dsh-auto-collapse

> DSH Web 工作段折叠：保留原生一级，把正文之间的思考、工具和上下文合成一个二级；展开后显示原生三级。
>
> [English](README.en.md) · [插件市场](https://www.dsh.so/artifact/dsh-auto-collapse/)

## 展示方式

```text
正文 A
▸ 已思考 · 使用了浏览器 · 已注入上下文 · 编辑了文件
正文 B
▸ 正在运行 npm run check
正文 C
```

每段只有一个二级入口。思考变成工具调用、工具后追加上下文，都继续归入当前段；新正文出现后，后续工作另起一段。只有思考、只有上下文或单条工具也可以成段。

- **一级：DSH 原生回合摘要。** 完成判断、计数、过程正文与最终回答由宿主负责。
- **二级：插件工作段。** 工作中可见，展开原生一级后也保留；默认收起，流式追加保持手动展开意图。
- **三级：原生工作行。** 二级展开后按原顺序展示思考、工具、上下文；每行自己的详情开合保持原样。

![混合工作段示例](assets/screenshot.png)
````

</details>

**依据 2 · 源码核查**：[src/work-model.ts:51-83](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/work-model.ts#L51-L83)

未知渲染器与正文/媒体保持边界，只接管可识别原生行。

<details>
<summary>查看原文（33行）</summary>

```text
  if (!ASSISTANT_KINDS.has(kind) && kind !== 'tool-call') {
    result.tokens.push(boundary('fence', true))
    return result
  }

  const roots = new Map<HTMLElement, WorkItem>()
  const paths = new Set<Element>([seat])
  const candidates = [...seat.querySelectorAll<HTMLElement>('[data-chat-call-id], [data-variant="think"]')]
  let thinkIndex = 0
  for (const row of candidates) {
    if (pluginOwned(row) || row.closest('[data-subcalls]') !== null) continue
    const outerCall = row.parentElement?.closest('[data-chat-call-id]')
    if (outerCall !== null && outerCall !== undefined && seat.contains(outerCall)) continue
    const isTool = row.hasAttribute('data-chat-call-id')
    if (!isTool && row.hasAttribute('data-tool')) continue
    // Require an actual host disclosure before taking control; unknown renderers stay visible.
    if (row.querySelector('[data-disclosure-row]') === null) continue
    const item = add(row, isTool ? 'tool' : 'think', isTool ? row.getAttribute('data-chat-call-id')! : String(thinkIndex++))
    roots.set(row, item)
    for (let parent = row.parentElement; parent !== null && seat.contains(parent); parent = parent.parentElement) paths.add(parent)
  }

  let bodyIndex = 0
  const visit = (node: Node): FlowToken[] => {
    if (pluginOwned(node) || node.nodeType === 8) return []
    if (node.nodeType === 3) return (node.textContent ?? '').trim() === '' ? [] : [boundary(`body:${bodyIndex++}`, false)]
    if (!(node instanceof Element)) return []
    if (node.matches('script, style, template')) return []
    const work = roots.get(node as HTMLElement)
    if (work !== undefined) return [token(work)]
    if (!paths.has(node)) {
      // Opaque prose/media remains untouched, including SVG and CSS-painted empty elements.
      return [boundary(`body:${bodyIndex++}`, false)]
```

</details>

**依据 3 · 源码核查**：[src/work-groups.ts:35-80](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/work-groups.ts#L35-L80)

正文断组、turn界限与流式展开意图保留。

<details>
<summary>查看原文（46行）</summary>

```text
export function groupWork(tokens: readonly FlowToken[]): WorkGroup[] {
  const groups: WorkGroup[] = []
  let left = 'start'
  let current: { id: string; turn: string | null; items: string[] } | null = null
  let lastItem = ''
  for (const token of resolveTurns(tokens)) {
    if (token.type === 'boundary') {
      left = token.id
      current = null
      continue
    }
    if (current !== null && current.turn !== token.turn) {
      left = `turn-after:${lastItem}`
      current = null
    }
    if (current === null) {
      current = { id: JSON.stringify([left, token.turn]), turn: token.turn, items: [] }
      groups.push(current)
    }
    current.items.push(token.id)
    lastItem = token.id
  }
  return groups
}

/** Expansion belongs to a work interval, not its current running item or DOM node. */
export class GroupState {
  private groups = new Map<string, WorkGroup>()
  private expanded = new Map<string, boolean>()

  reconcile(groups: readonly WorkGroup[]): void {
    const previousItems = new Map<string, boolean>()
    for (const group of this.groups.values()) {
      for (const id of group.items) previousItems.set(id, this.isExpanded(group.id))
    }
    const next = new Map<string, boolean>()
    for (const group of groups) {
      // If history insertion/splitting changes the left boundary, preserve explicit open intent.
      next.set(group.id, this.expanded.get(group.id) ?? group.items.some(id => previousItems.get(id) === true))
    }
    this.groups = new Map(groups.map(group => [group.id, group]))
    this.expanded = next
  }

  isExpanded(id: string): boolean { return this.expanded.get(id) ?? false }
  setExpanded(id: string, value: boolean): void { if (this.groups.has(id)) this.expanded.set(id, value) }
```

</details>

#### 缺口

- 没有长会话读者的查找时间和漏读对照。
  **影响**：不能从少显示几行推导实际阅读效率。
  **进一步探讨**：同一长会话对照原生与插件，测定位关键工具结果和最终回答的时间及漏读。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 隐藏内容、搜索焦点和异常如何恢复？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

client.apply创建FoldController并通过ctx.effect启动，卸载调用stop。控制器根据可见flow读取模型、分组并批量先读后写。GroupView只为原本未隐藏且非宿主隐藏所有权的元素租用hidden属性，写until-found并带自己的marker；释放时仅在marker仍属于自己且属性仍是该值时还原，不擅自覆盖宿主或另一插件后续控制。它添加二级按钮和样式，但不重写原生正文。

beforematch与focusin会把所属二级和原生一级展开，activeElement、选中元素、可输入控件和waiting状态会触发主动展开。异常catch断开observer、switchFlow(null)释放视图，再观察后续宿主变化，避免永久把失败隐藏留在页面；会话切换和stop也清状态与事件。这个成对租约比全局display:none更可恢复，但浏览器搜索对hidden=until-found与beforematch支持以及宿主DOM变化会影响实际表现，不能只因代码存在宣称无遗漏。

手动展开意图保存在内存的工作段状态中，并非跨刷新持久偏好。恢复边界是显示，不会删除聊天数据或减少模型上下文；工具已做的副作用也不会因为收起或卸载被撤销。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.ts:48-60](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/client.ts#L48-L60)

真实控制器启动和卸载接线。

<details>
<summary>查看原文（13行）</summary>

```text
export function apply(ctx: FoldClientCtx): void {
  const fallbackStatusText = () => DEFAULT_STATUS_TEXT
  // FoldController 一生只持有这个稳定闭包；settings 服务重连时
  // 替换其当前源，无需重建 observer 或折叠状态。
  let readStatusText: () => string | undefined = fallbackStatusText
  const controller = new FoldController(() => readStatusText())

  // 注意:cordis 的 ctx.effect(fn) 会【立即执行】fn,并把 fn 的返回值当作
  // 插件卸载时的清理函数(与 ui-slash 等官方插件同款写法)。
  ctx.effect(() => {
    controller.start()
    return () => controller.stop()
  }, 'dsh-auto-collapse: fold observer')
```

</details>

**依据 2 · 源码核查**：[src/dom-view.ts:50-81](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/dom-view.ts#L50-L81)

hidden租约、所有权和外部隐藏尊重。

<details>
<summary>查看原文（32行）</summary>

```text
  private fold(element: HTMLElement, group: string): void {
    if (nativeOwnsHidden(element)) { this.release(element); return }
    const existing = this.leases.get(element)
    if (existing === undefined) {
      if (element.hasAttribute('hidden')) return
      this.leases.set(element, { hidden: null, marker: element.getAttribute(FOLDED), group })
      element.setAttribute(FOLDED, this.owner)
    } else if (element.getAttribute(FOLDED) !== this.owner) {
      this.leases.delete(element)
      return
    }
    this.writeHidden(element, 'until-found')
  }

  private release(element: HTMLElement): void {
    const lease = this.leases.get(element)
    if (lease === undefined) return
    this.leases.delete(element)
    if (element.getAttribute(FOLDED) !== this.owner) return
    if (!nativeOwnsHidden(element) && element.getAttribute('hidden') === 'until-found') this.writeHidden(element, lease.hidden)
    if (lease.marker === null) element.removeAttribute(FOLDED)
    else element.setAttribute(FOLDED, lease.marker)
  }

  private externallyHidden(item: WorkItem): boolean {
    for (let element: HTMLElement | null = item.row; element !== null && element !== this.flow; element = element.parentElement) {
      let display = this.displays.get(element)
      if (display === undefined) { display = getComputedStyle(element).display; this.displays.set(element, display) }
      if (display === 'none') return true
      if (element.hasAttribute('hidden') && !this.leases.has(element)) return true
    }
    return false
```

</details>

**依据 3 · 源码核查**：[src/dom-view.ts:138-175](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/dom-view.ts#L138-L175)

按钮、原生隐藏和dispose释放。

<details>
<summary>查看原文（38行）</summary>

```text
  prepare(id: string, items: readonly WorkItem[], expanded: boolean, summary: GroupSummary, turnCollapsed: boolean): PreparedGroup {
    const available = items.filter(item => item.row.isConnected && !nativeHidden(item.row, this.flow) && !this.externallyHidden(item))
    // A scoped system prompt belongs under L1 even though DSH deliberately leaves it unmarked.
    // Keep its native row in place and lease hiding independently of the saved L2 open intent.
    const hiddenByTurn = (item: WorkItem) => turnCollapsed && item.followNativeTurn
    const anchor = available.find(item => !hiddenByTurn(item))?.cover
    const desired = new Set(available.filter(item => !expanded || hiddenByTurn(item)).map(item => item.cover))
    return { id, expanded, summary, anchor, desired }
  }

  apply({ id, expanded, summary, anchor, desired }: PreparedGroup): void {
    const row = this.rows.get(id) ?? this.create(id)
    row.button.hidden = anchor === undefined
    if (anchor !== undefined && (row.button.parentNode !== anchor.parentNode || row.button.nextSibling !== anchor)) {
      const focused = document.activeElement === row.button
      anchor.before(row.button)
      if (focused) row.button.focus({ preventScroll: true })
    }
    for (const target of row.targets) if (!desired.has(target)) this.release(target)
    for (const target of desired) this.fold(target, id)
    row.targets = desired
    this.summarize(id, summary, expanded)
  }

  focus(id: string): void { this.rows.get(id)?.button.focus({ preventScroll: true }) }

  remove(id: string): void {
    const row = this.rows.get(id)
    if (row === undefined) return
    for (const target of row.targets) this.release(target)
    row.button.remove()
    this.rows.delete(id)
  }

  dispose(): void {
    for (const id of [...this.rows.keys()]) this.remove(id)
    for (const target of [...this.leases.keys()]) this.release(target)
    this.style.remove()
```

</details>

**依据 4 · 源码核查**：[src/controller.ts:255-310](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/controller.ts#L255-L310)

异常可见恢复、搜索焦点展开与完整stop。

<details>
<summary>查看原文（56行）</summary>

```text
    } catch (error) {
      // Fail visible, then allow a later host change to re-establish a clean index.
      this.observer?.disconnect()
      this.switchFlow(null)
      // Reconnect after cleanup so our restoration cannot trigger an endless error/retry loop.
      if (!this.disposed && document.body !== null) this.observer?.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: OBSERVED_ATTRIBUTES })
      const message = String(error)
      if (this.lastError !== message) console.error('[dsh-auto-collapse] restored native view after an error', error)
      this.lastError = message
    } finally {
      this.dirtyGroups.clear()
      this.dirtyItems.clear()
      this.stats.lastDurationMs = performance.now() - start
    }
  }

  private toggle(id: string): void {
    const group = this.groups.get(id)
    if (group === undefined || this.disposed) return
    const expanded = !this.state.isExpanded(id)
    this.state.setExpanded(id, expanded)
    if (expanded && group.turn !== null) { openNative(this.controls.get(group.turn)); this.view?.focus(id) }
    this.dirtyGroups.add(id)
    this.scheduler.schedule()
  }

  private revealAt(node: Node, search: boolean): void {
    if (this.flow === null || pluginOwned(node)) return
    const item = this.itemAt(node)
    const groups = item !== undefined ? [this.itemGroups.get(item)!] : [...(this.seatGroups.get(seatOf(node, this.flow)!) ?? [])]
    for (const id of groups) {
      const group = this.groups.get(id)
      if (group === undefined) continue
      if (!search && this.state.isExpanded(id)) continue
      this.state.setExpanded(id, true)
      if (group.turn !== null) openNative(this.controls.get(group.turn))
      this.dirtyGroups.add(id)
    }
    if (groups.length > 0) this.scheduler.schedule()
  }

  stop(): void {
    if (this.disposed) return
    this.disposed = true
    this.started = false
    this.observer?.disconnect()
    this.scheduler.dispose()
    if (typeof document !== 'undefined') {
      document.removeEventListener('DOMContentLoaded', this.ready)
      document.removeEventListener('visibilitychange', this.visible)
    }
    this.switchFlow(null)
    this.status?.dispose()
    if (typeof document !== 'undefined') {
      const owner = document as OwnedDocument
      if (owner.__dshAutoCollapseV2 === this) delete owner.__dshAutoCollapseV2
```

</details>

**依据 5 · 源码核查**：[src/work-info.ts:28-34](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/work-info.ts#L28-L34)

焦点、选中、输入与waiting需要保持可达。

```text
export function needsAttention(items: readonly WorkItem[], infos: ReadonlyMap<string, WorkInfo>): boolean {
  return items.some(item =>
    item.cover.contains(document.activeElement)
    || item.row.hasAttribute('data-selected')
    || item.row.querySelector('[data-selected], input:not(:disabled), textarea:not(:disabled), select:not(:disabled)') !== null
    || infos.get(item.id)?.status === 'waiting',
  )
```

#### 缺口

- 未测真实浏览器查找、焦点与其他折叠插件同时修改。
  **影响**：不能保证所有DOM组合可达，需保留原生退路。
  **进一步探讨**：对包含审批输入、选中、流式和历史加载的同一会话逐项核对搜索与卸载恢复。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 宿主版本和配置如何限制采用成本？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

核心分组是DOM层，不要求slots/settings服务先到；设置卡和状态文案通过可选服务注入并可重连，服务缺席只跳过配置增强。Host只注册statusText，客户端核心折叠没有模型或额外网络服务，所以首次主要成本是正确Web profile安装、匹配宿主DOM与确认分组规则，而不是配置外部API。源码和包声明仍不能证明实际版本兼容。

关键依赖是data-chat-flow、data-disclosure-row、原生回合按钮等宿主属性。未知渲染器保留可见是一种保守策略，但已识别行的data-state如果出现新值，normalizeStatus默认映射done，摘要可能比原生状态乐观；它不应作为任务成功验收。状态文字“Deep sleeping...”是另一个显示替换，空设置恢复官方文案，不改变模型运行。

持续成本是DOM Mutation观察、重建/读取/写属性与升级复核，没有CPU、内存和耗时实测，不能称零成本。失败时禁用插件、刷新并检查原生行恢复；源码stop和租约提供明确退路，但与其他插件冲突和真实宿主恢复没有运行证据。对依赖工具过程实时可见的用户，折叠增加查找成本可能超过收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.ts:29-34](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/client.ts#L29-L34)

核心无强制服务，设置为可选增强。

```text
/**
 * 不声明必需服务：slots/settingsScope 只是可选增强能力，不能阻止核心折叠
 * 插件启动。下方通过 ctx.inject() 等待两个服务，支持晚于插件出现
 * 以及卸载后重连；服务永久缺席时仅跳过设置卡片与配置订阅。
 */
export const inject: string[] = []
```

**依据 2 · 源码核查**：[src/client.ts:65-93](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/client.ts#L65-L93)

设置服务晚到/重连与清理。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.inject?.(['settingsScope', 'slots'], (serviceCtx) => {
    serviceCtx.effect(() => {
      const settingsScope = serviceCtx.get?.<{ bind(spec: { namespace: string }): SettingsScopeLike }>('settingsScope')
      const slots = serviceCtx.get?.<SlotsLike>('slots')
      if (settingsScope === undefined || slots === undefined) return

      const scope = settingsScope.bind({ namespace: AUTO_COLLAPSE_NS })
      const scopedStatusText = statusTextProvider(scope)
      const offScope = scope.subscribe(() => controller.refreshStatus())
      let offSettings: () => void
      try {
        offSettings = setupSettingsCard({ slots }, scope)
      } catch (error) {
        offScope()
        throw error
      }
      readStatusText = scopedStatusText
      controller.refreshStatus()

      return () => {
        offScope()
        offSettings()
        // 旧服务的迟到 cleanup 不得覆盖已重连的新源。
        if (readStatusText === scopedStatusText) {
          readStatusText = fallbackStatusText
          controller.refreshStatus()
        }
      }
    }, 'dsh-auto-collapse: settings scope + plugin card')
```

</details>

**依据 3 · 源码核查**：[src/host-contract.ts:1-6](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/host-contract.ts#L1-L6)

核心DOM属性契约。

```text
/** DSH 0.1.2 DOM contract. Keep host recognition separate from grouping and rendering. */
export const FLOW = '[data-chat-flow]'
export const SEAT = '[data-chat-flow-kind]'
export const OWNED = '[data-dshcf-group]'
export const FOLDED = 'data-dshcf-folded'
export const NATIVE_HIDDEN = '[data-turn-process-hidden], [data-turn-process-inline]'
```

**依据 4 · 源码核查**：[src/summary.ts:16-21](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/summary.ts#L16-L21)

未知状态默认done的解释边界。

```text
export function normalizeStatus(value: string | null): WorkStatus {
  if (value === 'running') return 'running'
  if (value === 'error' || value === 'failed') return 'error'
  if (value === 'stopped' || value === 'interrupted' || value === 'cancelled') return 'stopped'
  if (value === 'waiting' || value === 'pending' || value === 'approval') return 'waiting'
  return 'done'
```

**依据 5 · 源码核查**：[src/index.ts:19-26](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/index.ts#L19-L26)

Host仅注册状态文字配置。

```text
export function apply(ctx: SettingsHostContext, config: Config = {}): void {
  ctx.inject(['settings'], service => {
    // The shipped SettingsProvider.register() creates a ctx.effect-owned registration.
    // The host half does not consume this setting, so no watcher or fiber-state mirror is needed.
    service.settings.register(name, z.object({ statusText: z.string().default(DEFAULT_STATUS_TEXT) }), {
      base: { statusText: config.statusText ?? DEFAULT_STATUS_TEXT },
    })
  })
```

#### 缺口

- 其他宿主版本DOM兼容与观察器资源开销未知。
  **影响**：不能从作者夹具版本扩展到全部DSH版本或承诺低开销。
  **进一步探讨**：在目标版本记录长历史和流式任务的帧/内存及未知节点行为，再决定是否保留。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么人值得试用，如何证伪阅读收益？

**研究主题**：采用判断、新假设与验证

#### 完整回答

对经常阅读长工具链且仍想随时查看原生过程的人，建议在可回退的Web会话试用。先用一段含正文、工具、思考、上下文和待输入的历史，确认每段只有一个二级入口、展开原顺序完整、搜索和焦点能到原生内容，再观察流式追加不重置展开。不要以摘要done或状态文案判断真实执行成功；重要结果回到原生行看。若漏显示、搜索找不到、焦点丢失、待审批被藏或阅读反而更慢，禁用并刷新回原生展示。

值得研究的未验证假设是为新data-state保留unknown而非默认done，并在二级摘要明确未知来源，可能避免宿主升级后乐观状态误导。增量是摘要证据边界，不是模型效果改善；代价是更多不确定提示和维护状态映射。

最小实验把现有状态、未知状态、waiting、error、流式追加和其他插件修改组成相同DOM序列，对照当前与unknown呈现，测错误完成判断、查找原行次数和阅读时间。若unknown没有减少误判断，或额外提示使查找负担明显增加，应收窄或放弃。该实验未做，不计当前创新；整体试用收益仍须读者任务对照。

#### 证据与依据

**依据 1 · 源码核查**：[src/dom-view.ts:50-81](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/dom-view.ts#L50-L81)

可回退隐藏所有权支持试用退路。

<details>
<summary>查看原文（32行）</summary>

```text
  private fold(element: HTMLElement, group: string): void {
    if (nativeOwnsHidden(element)) { this.release(element); return }
    const existing = this.leases.get(element)
    if (existing === undefined) {
      if (element.hasAttribute('hidden')) return
      this.leases.set(element, { hidden: null, marker: element.getAttribute(FOLDED), group })
      element.setAttribute(FOLDED, this.owner)
    } else if (element.getAttribute(FOLDED) !== this.owner) {
      this.leases.delete(element)
      return
    }
    this.writeHidden(element, 'until-found')
  }

  private release(element: HTMLElement): void {
    const lease = this.leases.get(element)
    if (lease === undefined) return
    this.leases.delete(element)
    if (element.getAttribute(FOLDED) !== this.owner) return
    if (!nativeOwnsHidden(element) && element.getAttribute('hidden') === 'until-found') this.writeHidden(element, lease.hidden)
    if (lease.marker === null) element.removeAttribute(FOLDED)
    else element.setAttribute(FOLDED, lease.marker)
  }

  private externallyHidden(item: WorkItem): boolean {
    for (let element: HTMLElement | null = item.row; element !== null && element !== this.flow; element = element.parentElement) {
      let display = this.displays.get(element)
      if (display === undefined) { display = getComputedStyle(element).display; this.displays.set(element, display) }
      if (display === 'none') return true
      if (element.hasAttribute('hidden') && !this.leases.has(element)) return true
    }
    return false
```

</details>

**依据 2 · 源码核查**：[src/controller.ts:281-310](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/controller.ts#L281-L310)

搜索揭示和stop释放支持验收动作。

<details>
<summary>查看原文（30行）</summary>

```text
  private revealAt(node: Node, search: boolean): void {
    if (this.flow === null || pluginOwned(node)) return
    const item = this.itemAt(node)
    const groups = item !== undefined ? [this.itemGroups.get(item)!] : [...(this.seatGroups.get(seatOf(node, this.flow)!) ?? [])]
    for (const id of groups) {
      const group = this.groups.get(id)
      if (group === undefined) continue
      if (!search && this.state.isExpanded(id)) continue
      this.state.setExpanded(id, true)
      if (group.turn !== null) openNative(this.controls.get(group.turn))
      this.dirtyGroups.add(id)
    }
    if (groups.length > 0) this.scheduler.schedule()
  }

  stop(): void {
    if (this.disposed) return
    this.disposed = true
    this.started = false
    this.observer?.disconnect()
    this.scheduler.dispose()
    if (typeof document !== 'undefined') {
      document.removeEventListener('DOMContentLoaded', this.ready)
      document.removeEventListener('visibilitychange', this.visible)
    }
    this.switchFlow(null)
    this.status?.dispose()
    if (typeof document !== 'undefined') {
      const owner = document as OwnedDocument
      if (owner.__dshAutoCollapseV2 === this) delete owner.__dshAutoCollapseV2
```

</details>

**依据 3 · 源码核查**：[src/summary.ts:16-29](https://github.com/a179-sanae/dsh-auto-collapse/blob/141a5c71d7bf556a2feba030d0f6f43104e903d4/src/summary.ts#L16-L29)

状态映射与汇总提供unknown假设依据。

<details>
<summary>查看原文（14行）</summary>

```text
export function normalizeStatus(value: string | null): WorkStatus {
  if (value === 'running') return 'running'
  if (value === 'error' || value === 'failed') return 'error'
  if (value === 'stopped' || value === 'interrupted' || value === 'cancelled') return 'stopped'
  if (value === 'waiting' || value === 'pending' || value === 'approval') return 'waiting'
  return 'done'
}

export function summarize(infos: readonly WorkInfo[]): GroupSummary {
  const last = infos[infos.length - 1]
  const running = [...infos].reverse().find(info => info.status === 'running' || info.status === 'waiting')
  const current = running ?? last
  const actions = [...new Set(infos.map(info => info.action))]
  const status = running?.status ?? (infos.some(info => info.status === 'error') ? 'error' : infos.some(info => info.status === 'stopped') ? 'stopped' : 'done')
```

</details>

#### 缺口

- 真实阅读收益、错误完成判断与unknown显示代价均未知。
  **影响**：有条件试用不等长期安装或效果已经验证。
  **进一步探讨**：比较同历史定位任务和状态判断；若收益不抵查找/干扰成本则退出。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
