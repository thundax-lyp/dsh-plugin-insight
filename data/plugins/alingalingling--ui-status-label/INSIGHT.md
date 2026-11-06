# ui-status-label

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a162141](https://github.com/alingalingling/ui-status-label/tree/a1621413a4700cb489655ad3ebf7fa8484c3645f)

<!-- BEGIN META -->
[![GitHub ★ 51](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=51&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/alingalingling/ui-status-label)
<!-- END META -->

> **功能**：自定义 DSH Web 运行中状态字样，以持久设置、可选服务和 DOM 回退呈现。

> **亮点**：持久个性化入口与新旧渲染适配，继承Host设置/槽与可选服务模式。见 [Q03](#research-q03)。

> **主要限制**：显示不等保存；全局role匹配与WeakSet可继续覆盖别的状态，停用不恢复已写Text。见 [Q02](#research-q02)。

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
  - [Q01 · 用户输入怎样改变状态，写入与即时显示是否同一成功？](#detail-section-11)
  - [Q02 · 失败、共享设置和卸载是否真能恢复原状态？](#detail-section-12)
  - [Q03 · 相对默认文案贡献什么，安装维护与效果成本如何？](#detail-section-13)
  - [Q04 · 什么用法可控，改进方向怎样证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在意默认字样的Web用户自定义状态；合格是显示与刷新保留，不是执行进度。见 [Q01](#research-q01)。

接受原生Deep diving...；偶尔控制台改字或自己改UI。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| General输入 | 自定义字样 | HTML长度40，不是服务端上限 |
| Host设置 | 同home偏好 | void写无保存UI |
| 可选provider | 原生渲染 | Host须消费服务 |
| DOM回退 | 旧状态替换 | 全局role/直接Text匹配 |
| 停用 | 断订阅observer | 已写Text须刷新 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web/浏览器 | 必需 | 状态呈现 | TUI/headless无价值 |
| dsh-settings >=rc.1 <0.2.0 / schemastery^3.18.1 | 必需 | Host设置schema | 无持久接线 |
| Cordis^4.0.1/client peers >=rc.1 <0.2.0 | 声明 | 槽/快照/连接 | 实际合同需核 |
| React^18.2/settingsScope/slots/locale/connection/remote | 必需 | 输入与同步 | Client不能正常挂载 |
| conversationStatus消费者或旧英文DOM | 二择一 | 真正呈现 | provider无人读/DOM失配无效 |
| Node | 未声明engines | 构建/Host环境 | 不补造最低版本 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核可信git/tarball/Host | npm尚404 |
| 启用 | 重启Web/刷新 | General出现输入 |
| 修改 | 输入短文字/空串 | 本地立即显示 |
| 核存 | 刷新与第二窗口 | 接受值不等即时显示 |
| 退出 | 停插件并刷新 | 旧Text不由disposer恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包/环境现金未知 | 安装/重启/刷新 | 无新增模型链 |
| 持续使用 | observer/浏览器资源未知 | DOM/Host升级维护 | 负载未测 |
| 失败恢复 | 资源费用未知 | 核保存/刷新 | 无写失败UI |
| 退出 | 保存值可能保留 | 停插件/刷新/核设置 | 不承诺清文件 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 输入显示 | snapshot先发布 | 是否已落盘 |
| 旧版替换 | role文本精确匹配 | 全Host兼容/误改频度 |
| provider | label服务存在 | 正式Host已消费 |
| 清理 | observer/订阅断开 | 已改Text与设置未恢复 |
| 用户价值 | 个性化字样 | 需求强度/净收益 |

> **思考**：显示不等保存；全局role匹配与WeakSet可继续覆盖别的状态，停用不恢复已写Text。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：持久个性化入口与新旧渲染适配，继承Host设置/槽与可选服务模式。见 [Q03](#research-q03)。

设置/服务分层可借鉴，但乐观写与DOM拥有权缺成功/恢复回执。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

显示不等保存；全局role匹配与WeakSet可继续覆盖别的状态，停用不恢复已写Text。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离home试短文案/空串/刷新及其他状态，失配停插件刷新回默认。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

输入、Host设置委托、服务/DOM与发行产物关键链已核；未运行真实Host。

- 已检查：作者 README、包清单、源码路径 README.md、UPSTREAM-PR.md、lib/client.js、package.json、src/client/StatusLabelRow.tsx、src/client/index.ts、src/client/status-label-injector.ts、src/client/status-label-policy.ts、src/index.ts、src/schema.ts、src/status-settings.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核全部src逻辑与lib入口/策略/DOM、包依赖和作者上游提案；未核固定Host SettingsScope内部或执行目标。
- 下一步：隔离home五条件对照并核真实设置/DOM，未执行。

**分析版本**

- **仓库**：[alingalingling/ui-status-label](https://github.com/alingalingling/ui-status-label)
- **版本号**：0.1.0（[固定提交 a162141](https://github.com/alingalingling/ui-status-label/tree/a1621413a4700cb489655ad3ebf7fa8484c3645f)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

复用Host保存错误/能力合同做回执和显式适配，五条件对照；原生已足够则不增复杂度。见 [Q04](#research-q04)。

隔离home五条件对照并核真实设置/DOM，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 12 | 520 | 293 | 232 | — |
| .md | source | 2 | 135 | — | — | 1773 |
| .ts | source | 9 | 427 | 244 | 145 | — |
| .tsx | source | 1 | 49 | 33 | 11 | — |
| .ts | test | 3 | 149 | 130 | 5 | — |
| .tsx | test | 1 | 62 | 54 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/alingalingling/ui-status-label/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/alingalingling/ui-status-label/issues?q=is%3Aissue+created%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/alingalingling/ui-status-label/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：状态字样从输入到持久化/渲染的真实链与兼容、退出边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户输入怎样改变状态，写入与即时显示是否同一成功？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它是面向DSH Web用户的运行状态文案个性化插件，原办法是接受Deep diving...或自己修改界面。合格结果只是运行中显示所选文字并在刷新后保留，不是更准确的执行进度、工具状态或模型能力。是否有值得维护插件的反复痛点主要是个人偏好，未测真实需求。

Host仅在settings服务存在时注册ui-status-label字符串schema；Client绑定同一namespace，注册General输入行与中英词条，提供conversationStatus.label()并始终安装DOM回退。输入onChange立即把snapshot改掉，然后void host.set；Host快照订阅再采纳接受值。空串在输入框可保留，但显示回默认“小难梁在0721”，空白字符没有trim。40限制只在HTML maxLength，不在schema/策略层，因此不能称所有设置来源都受40字符服务端约束。

支持扩展的Host要真正读取conversationStatus才走服务渲染；本仓库只附上游扩展提案，不能证明固定正式Host已合入。旧Host依靠document全树MutationObserver，扫描所有role=status元素的直接Text子节点，只有等于Deep diving...或本实例曾写入的节点才替换。不是递归寻找嵌套文本，也不校验当前会话/具体轮次。已核lib/client.js实际发行具有同样乐观写入、服务和observer，非只有类型定义。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:22-29](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/index.ts#L22-L29)

Host注册设置。

```text
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(
      settingsNamespace(STATUS_NAMESPACE),
      StatusLabelSettingsSchema,
    )
  })
}
```

**依据 2 · 源码核查**：[src/client/index.ts:46-71](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/client/index.ts#L46-L71)

General行、服务和DOM回退接线。

<details>
<summary>查看原文（26行）</summary>

```text
export function apply(ctx: Context): void {
  const scope = ctx.settingsScope.bind<StatusLabelSettings>({ namespace: STATUS_NAMESPACE })
  const policy = new StatusLabelPolicy(scope)
  ctx.effect(() => { return ctx.locale.register(NS, { zh, en }) }, 'ui-status-label: dictionaries')
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'status-label',
    order: 30,
    locale: NS,
    inject: () => ({
      hooks: { statusLabel: policy.statusLabel },
      setStatusLabel: (text: string) => { policy.setStatusLabel(text) },
    }),
  }, StatusLabelRow))
  // The chat view reaches this face via ctx.get, so its absence — this plugin
  // composed out — is the built-in label state.
  const status: ConversationStatus = {
    label: () => policy.getDisplayLabel(),
  }
  ctx.provide('conversationStatus', status)
  // DOM fallback for official releases that hard-code the status text and do
  // not read conversationStatus yet; inert once an upstream label renders.
  ctx.effect(
    () => installStatusLabelInjector(policy.statusLabel, DEFAULT_STATUS_LABEL),
    'ui-status-label: dom status injector',
  )
```

</details>

**依据 3 · 源码核查**：[src/client/StatusLabelRow.tsx:30-46](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/client/StatusLabelRow.tsx#L30-L46)

输入行仅HTML maxlength。

<details>
<summary>查看原文（17行）</summary>

```text
export function StatusLabelRow({ useStatusLabel, setStatusLabel, t }: StatusLabelRowProps) {
  const label = useStatusLabel(value => value)

  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div className={css.title}>{t('settings.status.title')}</div>
        <div className={css.desc}>{t('settings.status.description')}</div>
      </div>
      <input
        type="text"
        className={css.input}
        value={label}
        maxLength={MAX_STATUS_LABEL_LENGTH}
        spellCheck={false}
        onChange={(event) => { setStatusLabel(event.target.value) }}
      />
```

</details>

**依据 4 · 源码核查**：[src/client/status-label-policy.ts:31-68](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/client/status-label-policy.ts#L31-L68)

先发布再写Host与采纳/空串显示。

<details>
<summary>查看原文（38行）</summary>

```text
  constructor(host?: SettingsScope<StatusLabelSettings>) {
    this.host = host
    if (host !== undefined) {
      host.subscribe(() => { this.adopt(host) })
      this.adopt(host)
    }
  }

  /**
   * Change the running-turn status text; the live value publishes before the
   * durable write starts.
   * @param text - the next status label.
   */
  setStatusLabel(text: string): void {
    if (this.statusLabel.getSnapshot() === text) return
    this.statusLabel.set(text)
    void this.host?.set(STATUS_LABEL_FIELD, text)
  }

  /**
   * Resolve the label actually shown: an empty stored value (the user cleared
   * the field) falls back to the default, so a blank input never renders an
   * empty status line.
   * @returns the effective status text.
   */
  getDisplayLabel(): string {
    return this.statusLabel.getSnapshot() || DEFAULT_STATUS_LABEL
  }

  /**
   * Adopt the scope's accepted durable text without writing it back.
   * @param host - the constructor-narrowed scope driving this adoption.
   */
  private adopt(host: SettingsScope<StatusLabelSettings>): void {
    const section = host.getSnapshot().value
    if (section === undefined || this.statusLabel.getSnapshot() === section.statusLabel) return
    this.statusLabel.set(section.statusLabel)
  }
```

</details>

**依据 5 · 源码核查**：[src/schema.ts:6-9](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/schema.ts#L6-L9)

Host只字符串默认，无长度限制。

```text
/** Durable status-label schema; also the wire envelope the browser scope validates against. */
export const StatusLabelSettingsSchema: z<StatusLabelSettings> = z.object({
  [STATUS_LABEL_FIELD]: z.string().default(DEFAULT_STATUS_LABEL),
})
```

**依据 6 · 源码核查**：[src/status-settings.ts:4-14](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/status-settings.ts#L4-L14)

namespace字段与实际默认值。

<details>
<summary>查看原文（11行）</summary>

```text
export const STATUS_NAMESPACE = 'ui-status-label'

/** Field carrying the running-turn status text shown in the chat view. */
export const STATUS_LABEL_FIELD = 'statusLabel'

/**
 * Default status text. Mirrors the ui-conversation extension-point default
 * (`DEFAULT_STATUS_LABEL`) so composing this provider in or out leaves the
 * chat-view label unchanged; keep both in sync.
 */
export const DEFAULT_STATUS_LABEL = '小难梁在0721'
```

</details>

**依据 7 · 源码核查**：[src/client/status-label-injector.ts:24-50](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/client/status-label-injector.ts#L24-L50)

实际DOM匹配及清理。

<details>
<summary>查看原文（27行）</summary>

```text
export function installStatusLabelInjector(label: SnapshotStore<string>, fallback: string): () => void {
  if (typeof document === 'undefined') return () => {}
  // Text nodes this injector wrote; live preference changes rewrite them, and
  // an upstream label (never injected) is left alone.
  const injected = new WeakSet<Text>()
  const replace = (): void => {
    const text = label.getSnapshot() || fallback
    for (const element of document.querySelectorAll<HTMLElement>(STATUS_SELECTOR)) {
      for (const node of element.childNodes) {
        if (!(node instanceof Text)) continue
        if (node.nodeValue === text) continue
        if (node.nodeValue === OFFICIAL_FALLBACK_TEXT || injected.has(node)) {
          node.nodeValue = text
          injected.add(node)
        }
      }
    }
  }
  replace()
  const observer = new MutationObserver(replace)
  observer.observe(document.body, { childList: true, characterData: true, subtree: true })
  // Follow live preference changes; rapid writes coalesce per store commit.
  const unsubscribe = label.subscribe(replace)
  return () => {
    observer.disconnect()
    unsubscribe()
  }
```

</details>

**依据 8 · 源码核查**：[lib/client.js:110-132](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/lib/client.js#L110-L132)

发行乐观写入。

<details>
<summary>查看原文（23行）</summary>

```text
			setStatusLabel(text) {
				if (this.statusLabel.getSnapshot() === text) return;
				this.statusLabel.set(text);
				this.host?.set(STATUS_LABEL_FIELD, text);
			}
			/**
			* Resolve the label actually shown: an empty stored value (the user cleared
			* the field) falls back to the default, so a blank input never renders an
			* empty status line.
			* @returns the effective status text.
			*/
			getDisplayLabel() {
				return this.statusLabel.getSnapshot() || "小难梁在0721";
			}
			/**
			* Adopt the scope's accepted durable text without writing it back.
			* @param host - the constructor-narrowed scope driving this adoption.
			*/
			adopt(host) {
				const section = host.getSnapshot().value;
				if (section === void 0 || this.statusLabel.getSnapshot() === section.statusLabel) return;
				this.statusLabel.set(section.statusLabel);
			}
```

</details>

**依据 9 · 源码核查**：[lib/client.js:203-224](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/lib/client.js#L203-L224)

发行入口实际接线。

<details>
<summary>查看原文（22行）</summary>

```text
		function apply(ctx) {
			const policy = new StatusLabelPolicy(ctx.settingsScope.bind({ namespace: STATUS_NAMESPACE }));
			ctx.effect(() => {
				return ctx.locale.register(NS, {
					zh,
					en
				});
			}, "ui-status-label: dictionaries");
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "status-label",
				order: 30,
				locale: NS,
				inject: () => ({
					hooks: { statusLabel: policy.statusLabel },
					setStatusLabel: (text) => {
						policy.setStatusLabel(text);
					}
				})
			}, StatusLabelRow));
			ctx.provide("conversationStatus", { label: () => policy.getDisplayLabel() });
			ctx.effect(() => installStatusLabelInjector(policy.statusLabel, DEFAULT_STATUS_LABEL), "ui-status-label: dom status injector");
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 失败、共享设置和卸载是否真能恢复原状态？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

持久写入没有await、catch、错误UI或本地回滚。若Host set返回拒绝Promise，插件自身没有显式处理；Host是否统一处理拒绝未知，不宣称已发生未处理异常。即时显示不等落盘，刷新可能回旧值。Host订阅会直接采纳新快照，插件无版本号/CAS或多窗口协调；多窗口写入次序/冲突依赖SettingsScope，不能推断最后本地输入必然持久。README称settings.yaml跟同home跨端口，属于作者/Host持久机制声明，本插件没有自己写文件或提供多用户隔离。访问授权由Host负责，不能把namespace当租户边界。

DOM回退有两个具体取舍：选择器未限定聊天，其他role=status且同字样节点也可能被改；WeakSet会继续覆盖本实例写过的同一Text，即使随后其他代码把该节点改为不同状态。因此“上游出现任意新文案后自动让位”只对没被本实例接管的节点成立，不是探测服务支持后的明确停用。整个body变化会扫描，实际负载未测；框架更换节点、嵌套结构或英文原文改变会使替换失效。

disposer确实disconnect observer及unsubscribe，但没有把已改Text恢复为原字样；停插件后当前DOM可能暂留定制字样，须Host重渲染或刷新。设置namespace注销/已存值删除及多窗口生命周期由Host，未运行确认，不承诺卸载清空settings.yaml。预构建lib也注入CSS标签，标签存在检查阻止重复添加，但未见对应移除；这只是样式残留，不等模型或文件操作。未发现本组件模型调用/执行命令，它的真实写副作用是Host设置和浏览器呈现。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/status-label-policy.ts:31-68](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/client/status-label-policy.ts#L31-L68)

未等待写结果、Host采纳。

<details>
<summary>查看原文（38行）</summary>

```text
  constructor(host?: SettingsScope<StatusLabelSettings>) {
    this.host = host
    if (host !== undefined) {
      host.subscribe(() => { this.adopt(host) })
      this.adopt(host)
    }
  }

  /**
   * Change the running-turn status text; the live value publishes before the
   * durable write starts.
   * @param text - the next status label.
   */
  setStatusLabel(text: string): void {
    if (this.statusLabel.getSnapshot() === text) return
    this.statusLabel.set(text)
    void this.host?.set(STATUS_LABEL_FIELD, text)
  }

  /**
   * Resolve the label actually shown: an empty stored value (the user cleared
   * the field) falls back to the default, so a blank input never renders an
   * empty status line.
   * @returns the effective status text.
   */
  getDisplayLabel(): string {
    return this.statusLabel.getSnapshot() || DEFAULT_STATUS_LABEL
  }

  /**
   * Adopt the scope's accepted durable text without writing it back.
   * @param host - the constructor-narrowed scope driving this adoption.
   */
  private adopt(host: SettingsScope<StatusLabelSettings>): void {
    const section = host.getSnapshot().value
    if (section === undefined || this.statusLabel.getSnapshot() === section.statusLabel) return
    this.statusLabel.set(section.statusLabel)
  }
```

</details>

**依据 2 · 源码核查**：[src/client/status-label-injector.ts:13-50](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/client/status-label-injector.ts#L13-L50)

全局role选择、WeakSet与不恢复清理。

<details>
<summary>查看原文（38行）</summary>

```text
const OFFICIAL_FALLBACK_TEXT = 'Deep diving...'

/** Selector for the running-turn status element (official markup: `role="status" aria-live="polite"`). */
const STATUS_SELECTOR = '[role="status"]'

/**
 * Install the DOM fallback injector.
 * @param label - reactive source of the user-configured status text.
 * @param fallback - text shown when the stored label is empty (cleared field).
 * @returns the disposer removing the observer and the subscription.
 */
export function installStatusLabelInjector(label: SnapshotStore<string>, fallback: string): () => void {
  if (typeof document === 'undefined') return () => {}
  // Text nodes this injector wrote; live preference changes rewrite them, and
  // an upstream label (never injected) is left alone.
  const injected = new WeakSet<Text>()
  const replace = (): void => {
    const text = label.getSnapshot() || fallback
    for (const element of document.querySelectorAll<HTMLElement>(STATUS_SELECTOR)) {
      for (const node of element.childNodes) {
        if (!(node instanceof Text)) continue
        if (node.nodeValue === text) continue
        if (node.nodeValue === OFFICIAL_FALLBACK_TEXT || injected.has(node)) {
          node.nodeValue = text
          injected.add(node)
        }
      }
    }
  }
  replace()
  const observer = new MutationObserver(replace)
  observer.observe(document.body, { childList: true, characterData: true, subtree: true })
  // Follow live preference changes; rapid writes coalesce per store commit.
  const unsubscribe = label.subscribe(replace)
  return () => {
    observer.disconnect()
    unsubscribe()
  }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:22-29](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/index.ts#L22-L29)

持久行为委托Host。

```text
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(
      settingsNamespace(STATUS_NAMESPACE),
      StatusLabelSettingsSchema,
    )
  })
}
```

**依据 4 · 源码核查**：[lib/client.js:11-18](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/lib/client.js#L11-L18)

样式标签添加未含移除。

```text
		const tagId = "dsh-ui-status-label/StatusLabelRow.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-ui-status-label";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
```

#### 缺口

- 固定Host的SettingsScope授权、set返回契约/失败统一处理、并发写入与卸载持久值未核。
  **影响**：不能保证输入显示等于持久成功或卸载已恢复所有DOM/设置。
  **进一步探讨**：隔离home用写失败、两窗口交错、重复装卸与刷新对照真实settings值。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对默认文案贡献什么，安装维护与效果成本如何？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

增量是把个人状态字样做成持久General设置，并用可选服务与旧DOM回退适配两种渲染合同；底层设置快照/传输、React槽与Host持久化都继承。相比手改DOM更能跟随新节点，但仍只更改文字，不增加进度信息或业务交付。UPSTREAM-PR明确镜像现有chatFileMentions可选服务模式，且是仓库提案而非已合入证明。未改变任务组织、交接责任、交付成果、明确新准入人群或供给/计价/服务责任结构，个性化与少操作不能据此加业务创新。

0.1.0，MIT；package无engines声明，不能补造Node最低版本。直接依赖dsh-settings>=0.0.1-rc.1 <0.2.0、schemastery^3.18.1和React^18.2；Cordis^4.0.1及各client peer同rc.1到<0.2.0范围，实际还需settingsScope/slots/locale/connection/remote服务。Web专用，TUI/headless没有价值。README提供tarball/git安装且提示npm尚未发布，本次META也404，不能建议直接npm包已可装；lib已经提交，prepare构建权限不应误作无条件必要。安装后作者要求重启Web并刷新，本次未安装验证。

首次负担是可信来源安装、重启/刷新、试两个文案和空串；持续负担主要是Host DOM/服务升级兼容与同home设置管理。没有新增模型推理链，但CPU observer扫描、包资源、安装维护人工和现金环境未知，不能写零总成本。失败要核Host保存及刷新后的值，回默认状态或卸载刷新；卸载不承诺删除已保存设置。作用是否值得插件长期维护需对照原字样，不能由功能存在推算节时。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:27-61](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/package.json#L27-L61)

Web声明/构建/许可/具体依赖。

<details>
<summary>查看原文（35行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "bundle": "tsdown",
    "prepare": "tsdown",
    "pack": "pnpm run bundle && pnpm pack"
  },
  "license": "MIT",
  "dependencies": {
    "@deepseek-ai/dsh-settings": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/schemastery": "^3.18.1",
    "react": "^18.2.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-connection": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-client-locale": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-client-runtime": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-client-ui-conversation": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-client-ui-settings": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-invariants": ">=0.0.1-rc.1 <0.2.0"
```

</details>

**依据 2 · 源码核查**：[UPSTREAM-PR.md:1-15](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/UPSTREAM-PR.md#L1-L15)

扩展是镜像既有模式的提案。

<details>
<summary>查看原文（15行）</summary>

```text
# PR: Add optional `conversationStatus` provider for the running-turn status text

> 中文摘要：给 ui-conversation 的聊天视图加一个**可选状态文案服务**（`conversationStatus`），让第三方插件可以自定义智能体运行期间的状态文字（当前硬编码为 `Deep diving...`）。方案完全镜像官方已有的 `chatFileMentions` 可选服务模式，服务缺席时行为不变。

---

## Title

feat(ui-conversation): expose the running-turn status text through an optional `conversationStatus` service

## Summary

The chat view's `TurnStatus` hard-codes the label `Deep diving...`. This change lets a plugin provide the label through an optional `conversationStatus` service — the same optional-service convention the view already uses for `chatFileMentions` — and falls back to a built-in default when no provider is composed in. Behavior is unchanged with no plugin installed.

## Motivation
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:38-48](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/client/index.ts#L38-L48)

实际服务必需。

<details>
<summary>查看原文（11行）</summary>

```text
/** Services required for the settings row registration and its dictionaries. */
export const inject = ['slots', 'settingsScope', 'locale', 'connection', 'remote']

/**
 * Client plugin body: register the dictionaries, the settings row, and the
 * conversationStatus provider.
 * @param ctx - client root context.
 */
export function apply(ctx: Context): void {
  const scope = ctx.settingsScope.bind<StatusLabelSettings>({ namespace: STATUS_NAMESPACE })
  const policy = new StatusLabelPolicy(scope)
```

</details>

**依据 4 · 源码核查**：[README.md:17-44](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/README.md#L17-L44)

安装分发/构建授权与卸载。

<details>
<summary>查看原文（28行）</summary>

````text

本包声明了 `dsh.bundle`，`dsh plugin add` 会自动激活它的 `cordis.patch.yml` 层（把 `dsh-ui-status-label` 行插入 Web roster）。

```sh
# ① tarball（需要先在仓库根执行 pnpm pack 生成 dsh-ui-status-label-0.1.0.tgz）
dsh plugin --profile web add ./dsh-ui-status-label-0.1.0.tgz

# ② git 仓库直装
dsh plugin --profile web add github:alingalingling/ui-status-label

# ③ npm（当前 npm 上尚未发布，发布后可用）
dsh plugin --profile web add dsh-ui-status-label
```

**git 安装注意**：pnpm ≥10 默认**阻止运行 git 依赖的 `prepare` 脚本**——首次 `add` 可能报 "Ignored build scripts"，报错会打印一个包 key。把它加入 profile 目录下 `pnpm-workspace.yaml` 的 `allowBuilds` 后重新 `add` 即可（这是**允许执行该包构建代码**的授权，只对你信任的包开启）：

```yaml
allowBuilds:
  dsh-ui-status-label: true
```

不过本仓库**已把预构建的 `lib/`（含类型声明）随源码一起提交**，git 安装即使跳过 `prepare` 也能直接用产物；`allowBuilds` 只在你想从源码重新构建时才需要。

卸载用 `dsh plugin --profile web remove dsh-ui-status-label`。

> 仅在使用**内置了本插件的定制 dsh 构建**（如 deepseek-harness 仓库本地构建）时，不要重复安装——`ui-status-label` settings 命名空间会注册两次。官方发布版未内置本插件，正常安装即可。

## 安装后生效
````

</details>

**依据 5 · 源码核查**：[README.md:46-57](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/README.md#L46-L57)

重启和两种兼容路径作者说明。

<details>
<summary>查看原文（12行）</summary>

```text
装完需要**重启 dsh web 进程**（当前运行中的 GUI 不会热加载新插件 bundle），重启后刷新页面即可在设置里看到入口。

## 兼容性

本插件同时提供两条生效路径，**官方正式版（含 0.1.0-rc.6）即可直接生效**：

1. **DOM 注入（默认兜底）**：插件监听聊天视图的运行状态元素（官方标记 `role="status"` + 硬编码 `Deep diving...`），把文本替换为你配置的文案。不依赖官方任何新机制，装完即用。
2. **`conversationStatus` 可选服务**：当 ui-conversation 带上了扩展点（随 `UPSTREAM-EXTENSION.patch` 合入官方后），聊天视图直接渲染你配置的文案，DOM 注入自动让位，两者不会冲突。

## 设置

安装并重启后，修改入口在 dsh Web 页面里：
```

</details>

#### 缺口

- 同版本Host显示/持久化、实际DOM负载及偏好收益未测。
  **影响**：不能承诺所有Host兼容或个性化收益足以覆盖维护。
  **进一步探讨**：固定Host以默认文案对照两窗口/刷新/卸载，记显示错误与维护时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么用法可控，改进方向怎样证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可条件试用：确实介意默认状态字样的本机DSH Web用户，在隔离home输入短文案、清空一次，再刷新核保留与默认回退，运行时观察是否只改预期状态。它比控制台手改多了设置入口与Host快照接线，但不会报告更真实的模型进展。若刷新丢值、其他状态被覆盖或升级失配，就停插件并刷新恢复原界面，继续默认文案；别用这行字判断任务成功。

值得先验证的是“持久结果可见+显式渲染适配”：复用SettingsScope的已接受/错误状态给输入行反馈，宿主明确支持conversationStatus时关闭DOM回退；旧Host仅在聊天根内匹配并记录原节点值供清理。依据是目前void set与WeakSet接管没有成功/恢复合同，非另造状态管理框架。用拒绝写入、快速多窗口修改、同Text被上游改字、其他role=status、卸载这五种情形与原版对照，测误判已保存/错误覆盖和恢复步骤。若Host已统一呈现保存错误并保证局部状态生命周期，优先消费现成合同；若用户并不在意文案，直接用原生默认更简单，新增适配也不值得。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/status-label-policy.ts:44-48](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/client/status-label-policy.ts#L44-L48)

持久回执方向依据。

```text
  setStatusLabel(text: string): void {
    if (this.statusLabel.getSnapshot() === text) return
    this.statusLabel.set(text)
    void this.host?.set(STATUS_LABEL_FIELD, text)
  }
```

**依据 2 · 源码核查**：[src/client/status-label-injector.ts:29-50](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/client/status-label-injector.ts#L29-L50)

范围与恢复方向依据。

<details>
<summary>查看原文（22行）</summary>

```text
  const replace = (): void => {
    const text = label.getSnapshot() || fallback
    for (const element of document.querySelectorAll<HTMLElement>(STATUS_SELECTOR)) {
      for (const node of element.childNodes) {
        if (!(node instanceof Text)) continue
        if (node.nodeValue === text) continue
        if (node.nodeValue === OFFICIAL_FALLBACK_TEXT || injected.has(node)) {
          node.nodeValue = text
          injected.add(node)
        }
      }
    }
  }
  replace()
  const observer = new MutationObserver(replace)
  observer.observe(document.body, { childList: true, characterData: true, subtree: true })
  // Follow live preference changes; rapid writes coalesce per store commit.
  const unsubscribe = label.subscribe(replace)
  return () => {
    observer.disconnect()
    unsubscribe()
  }
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:62-70](https://github.com/alingalingling/ui-status-label/blob/a1621413a4700cb489655ad3ebf7fa8484c3645f/src/client/index.ts#L62-L70)

当前同时启用两路径。

```text
  const status: ConversationStatus = {
    label: () => policy.getDisplayLabel(),
  }
  ctx.provide('conversationStatus', status)
  // DOM fallback for official releases that hard-code the status text and do
  // not read conversationStatus yet; inert once an upstream label renders.
  ctx.effect(
    () => installStatusLabelInjector(policy.statusLabel, DEFAULT_STATUS_LABEL),
    'ui-status-label: dom status injector',
```

#### 缺口

- 候选回执/能力协商改进及偏好用户需求未验证。
  **影响**：不计当前贡献，也不能承诺收益。
  **进一步探讨**：先核Host已有错误/能力合同，再做五条件对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
