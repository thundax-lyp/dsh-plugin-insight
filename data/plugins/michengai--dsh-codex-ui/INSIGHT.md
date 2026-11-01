# DSH Codex UI

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2e1ac7d](https://github.com/MichengAI/dsh-codex-ui/tree/2e1ac7d0033f3e689b04a900baf60f8b5476d159)

<!-- BEGIN META -->
[![GitHub ★ 255](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=255&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-codex-ui) [![npm 30d 117,030](https://img.shields.io/static/v1?label=npm+30d&message=117%2C030&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-codex-ui) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-codex-ui)
<!-- END META -->

> **功能**：为 DSH 提供输入历史、设置皮肤、主题和侧栏等界面增强。

> **亮点**：[Q02](#research-q02) 在宿主输入状态上增加按范围召回与有限持久历史。

> **主要限制**：[Q03](#research-q03) 同 cwd 会话共享历史，localStorage 保存文本且停用后删除未证。

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
  - [Q01 · 套件相对原生 DSH 界面增加什么？](#detail-section-11)
  - [Q02 · 输入历史如何从事件到可召回状态？](#detail-section-12)
  - [Q03 · 工作区范围与浏览器历史是否是隐私隔离？](#detail-section-13)
  - [Q04 · 采用和退出需要什么条件？](#detail-section-14)
  - [Q05 · 怎样帮助用户决定哪些输入可保留？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要频繁召回输入或调整 DSH Web 界面的用户。

宿主原生输入、设置、主题和手工复制历史。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 输入历史 | 召回范围内文本 | cwd 优先；浏览器存储可能留存 |
| 任务建议 | 预填空草稿 | 有文本、附件或提及时不覆盖 |
| 设置与主题 | 调整展示 | 本次未运行或逐路核查 |
| 浏览器回退 | 存储失败时内存可用 | 重载后不保证保留 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 声明范围内 DSH 与 Node | 包声明必需 | 加载套件 | 实际兼容仍需验证 |
| 宿主 session、输入与 UI 接口 | 历史功能必需 | 监听和写回草稿 | 不能正常绑定或召回 |
| 浏览器 localStorage | 跨重载持久化所需 | 保存历史 | 失败时仅本次内存 |
| 用户同意保存范围 | 敏感输入场景必需 | 控制本地留存 | 不适用时停用并核查残留 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户在隔离 profile 核对宿主和数据敏感度 | 不满足时停用 |
| 加载 | 宿主注册客户端组件 | 绑定缺失时核查兼容性 |
| 使用 | 用户发送及召回文本 | 核对 scope 与草稿后继续 |
| 退出与验收 | 用户停用并检查浏览器历史 | 按浏览器策略清理并验证残留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 软件及设备费用未知 | 宿主配置与兼容测试时间未知 | 需匹配接口 |
| 持续使用 | 浏览器存储与模型费用未知 | 历史选择与敏感内容核对时间未知 | 同 cwd 可共享 |
| 退出恢复 | 浏览器资源费用未知 | 核查和清理旧键时间未知 | 停用不证明删除数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 输入历史 | 源码监听与范围存储 | 真实召回准确率及节时 |
| 草稿保护 | 建议预填检查已有草稿与附件 | 全宿主编辑路径 |
| 隐私 | 本地文本持久化及容量上限 | 停用清理、浏览器隔离和敏感识别 |

> **思考**：[Q03](#research-q03) 同 cwd 会话共享历史，localStorage 保存文本且停用后删除未证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 在宿主输入状态上增加按范围召回与有限持久历史。

[Q02](#research-q02) 事件增量与提交回退组合，存储失败回内存；[Q03](#research-q03) cwd scope 非单会话隔离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 同 cwd 会话共享历史，localStorage 保存文本且停用后删除未证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 隔离 profile 验证并核对本地历史，敏感输入不适用时停用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根组件静态核查客户端接线、输入历史与草稿保护；未运行宿主或浏览器，其余外观未逐路验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/client/index.ts、src/client/composer/InputHistoryDock.tsx、src/client/composer/input-history.ts、src/client/composer/new-conversation-draft.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根源码静态核查注册、输入历史和草稿保护；未运行目标或逐路验证所有界面功能。
- 下一步：隔离浏览器测同 cwd、多会话、存储拒绝、附件草稿和停用后残留。

**分析版本**

- **仓库**：[MichengAI/dsh-codex-ui](https://github.com/MichengAI/dsh-codex-ui)
- **版本号**：2.0.11（[固定提交 2e1ac7d](https://github.com/MichengAI/dsh-codex-ui/tree/2e1ac7d0033f3e689b04a900baf60f8b5476d159)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照既有容量和回退机制，验证用户选择仅内存保存的效果。

隔离浏览器测同 cwd、多会话、存储拒绝、附件草稿和停用后残留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1966 | — | — | 27198 |
| .mjs | source | 21 | 3771 | 3461 | 255 | — |
| .js | source | 1 | 9596 | 8724 | 877 | — |
| .js | example | 1 | 22 | 21 | 1 | — |
| .mjs | example | 1 | 11 | 10 | 1 | — |
| .ts | source | 46 | 10645 | 8919 | 935 | — |
| .tsx | source | 7 | 2116 | 1891 | 105 | — |
| .ts | test | 40 | 7080 | 5932 | 464 | — |
| .mjs | test | 3 | 250 | 238 | 8 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/MichengAI/dsh-codex-ui/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查界面套件接线及代表性输入历史和草稿边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 套件相对原生 DSH 界面增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

频繁在 DSH Web 中输入重复提示、切换设置或整理侧栏的用户，可使用输入历史、设置皮肤、主题和侧栏增强。宿主原生输入与设置仍能完成基本任务；本轮代表性核查输入历史与草稿保护，其他外观能力以作者描述和接线为线索，不能推断模型能力或实际效率提升。合格使用应能找回期望文本且不覆盖已有草稿。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:21-31](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/README.md#L21-L31)

作者定位界面增强及输入召回。

<details>
<summary>查看原文（11行）</summary>

```text
> **Notice**: DSH Codex UI is a community-maintained interface enhancement suite for DeepSeek Harness (DSH), not an official DeepSeek AI product.

---

## Why Codex UI 2.0?

When working across complex projects in DeepSeek Harness, users often encounter cramped settings modals, plain monocolor palettes, unstructured sidebars, and lost prompt history. **Codex UI 2.0 rearchitects the entire frontend experience through six decoupled sub-plugins**, delivering a high-performance, non-intrusive, native-grade modern design:

* 🚀 **Instant Prompt Recall**: Terminal-style input history (`↑` / `↓` quick recall) with isolated workspace memory and adaptive width sizing;
* 🪟 **Full-Screen Dual-Island Settings**: Replaces cramped dialogs with Ambient Ground diffuse lighting canvas and dual floating island cards;
* 🎨 **Native Physical Glass Themes**: 7 built-in high-quality color schemes (featuring Codex Dark & Paper Light), dual layout modes (Stock Flat vs. Mica Floating), 3-tier material presets, and ground glow switch;
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:3-15](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/cordis.patch.yml#L3-L15)

组合注册多个子入口。

<details>
<summary>查看原文（13行）</summary>

```text
- insert:
    - id: codex-ui-session-title
      name: '@michengai/dsh-codex-ui/session-title'
    - id: codex-ui-settings-skin
      name: '@michengai/dsh-codex-ui/settings-skin'
    - id: codex-ui-composer
      name: '@michengai/dsh-codex-ui/composer'
    - id: codex-ui-sidebar
      name: '@michengai/dsh-codex-ui/sidebar'
    - id: codex-ui-theme
      name: '@michengai/dsh-codex-ui/theme'
    - id: codex-ui
      name: '@michengai/dsh-codex-ui'
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:23-50](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/index.ts#L23-L50)

客户端 effect 接线。

<details>
<summary>查看原文（28行）</summary>

```text
  const t = ctx.locale.bind(NS)

  ctx.effect(() => observeTheme(ctx), 'michengai-codex-ui: theme & appearance')
  ctx.effect(() => observeSidebarNav(ctx), 'michengai-codex-ui: sidebar navigation')
  // 工作区分区随侧栏子插件一起启停：探活失败（子插件被停用或 Host 路由缺失）时不注入任何标题。
  ctx.effect(() => {
    let stop: (() => void) | undefined
    let cancelled = false
    void checkSidebarEnabled().then(enabled => {
      if (cancelled || !enabled) return
      const translate = (key: string, fallback?: string): string => {
        try {
          const value = (t as unknown as (name: string) => string)(key)
          return typeof value === 'string' && value !== '' && value !== key ? value : (fallback ?? key)
        } catch {
          return fallback ?? key
        }
      }
      stop = observeWorkspaceSections(ctx, translate)
    })
    return () => {
      cancelled = true
      stop?.()
    }
  }, 'michengai-codex-ui: workspace sections')
  ctx.effect(() => observeComposerEnhancements(ctx), 'michengai-codex-ui: composer enhancements')
  ctx.effect(() => observeSettingsSkin(), 'michengai-codex-ui: official settings skin')
  ctx.effect(() => observeSettingsNavIcon(() => t('about.nav')), 'michengai-codex-ui: settings nav icon')
```

</details>

#### 缺口

- 未在真实浏览器比较原生界面
  **影响**：不能量化效率、兼容或视觉效果
  **进一步探讨**：相同任务对照宿主输入并记录召回与干扰。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 输入历史如何从事件到可召回状态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

组件绑定当前 session，scope 取会话 cwd，缺失时回退 sessionId；订阅增量 user/message 的文本块加入历史，另在提交状态回到空白时为无附件和提及的先前草稿补记录。历史仅保留非空、最多 8000 字的文本，连续相同不重复，每 scope 最多 200 条、最多 20 个 scope，并受总序列化长度约束；保存使用浏览器 localStorage，读取或写入失败时保留当前内存状态。键盘事件绑定依赖能定位唯一编辑器。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/composer/InputHistoryDock.tsx:43-69](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/InputHistoryDock.tsx#L43-L69)

session 绑定、scope、事件与提交回退。

<details>
<summary>查看原文（27行）</summary>

```text
    const binding = ctx.sessions.binding(sessionId)
    if (binding === undefined) return
    const scope = ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd ?? sessionId
    const input = ctx.conversation.input.for(binding.ctx)
    const menu = ctx.inputTriggers.sessionOf(binding.ctx).menu
    // 挂载只建立版本基线，历史窗口和未挂载期间的输入不回灌；多实例共用版本去重。
    seen.set(binding, binding.eventSource.getSnapshot().revision)
    const collect = () => {
      const snapshot = binding.eventSource.getSnapshot()
      // 完整窗口替换可重设版本基线，兼容宿主重建窗口后计数归零；不回灌窗口内容。
      if (snapshot.change.kind !== 'replace' && snapshot.revision <= (seen.get(binding) ?? -1)) return
      seen.set(binding, snapshot.revision)
      if (snapshot.change.kind !== 'append') return
      for (const entry of snapshot.change.entries) {
        if (entry.event.type !== 'user/message' || entry.event.data.source?.kind !== 'user') continue
        const text = entry.event.data.content.filter(block => block.type === 'text').map(block => block.text).join('')
        history.add(scope, text)
      }
    }
    const offEvents = binding.eventSource.subscribe(collect)
    let previous = input.state.getSnapshot()
    const offInput = input.state.subscribe(() => {
      const next = input.state.getSnapshot()
      // 宿主成功提交命令后才清空草稿并回到 plain；失败保留 claimed 和原文。
      if (previous.phase === 'submitting' && next.phase === 'plain' && next.draft === ''
        && !hasDraftAttachments(previous) && previous.occurrences.length === 0) {
        history.add(scope, previous.draft)
```

</details>

**依据 2 · 源码核查**：[src/client/composer/InputHistoryDock.tsx:73-87](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/InputHistoryDock.tsx#L73-L87)

编辑器定位及绑定。

<details>
<summary>查看原文（15行）</summary>

```text
    let editor: HTMLElement | undefined
    let offKeys = () => {}
    const connect = () => {
      const next = anchor.current === null ? undefined : findComposer(anchor.current)
      if (next === editor) return
      offKeys()
      editor = next
      if (editor === undefined) return
      offKeys = bindHistoryKeys(editor, {
        draft: () => input.state.getSnapshot().draft,
        entries: () => history.list(scope),
        setDraft: text => input.setDraft(text),
        blocked: () => {
          const state = input.state.getSnapshot()
          return state.phase === 'adjudicating' || state.phase === 'submitting'
```

</details>

**依据 3 · 源码核查**：[src/client/composer/InputHistoryDock.tsx:99-104](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/InputHistoryDock.tsx#L99-L104)

浏览器存储与历史实例。

```text
}

export function registerInputHistory(ctx: Context): () => void {
  let storage: Storage | undefined
  try { storage = window.localStorage } catch { console.warn('[michengai-codex-ui] 浏览器存储不可用，使用内存输入历史。') }
  const history = new InputHistory(storage)
```

**依据 4 · 源码核查**：[src/client/composer/input-history.ts:1-22](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/input-history.ts#L1-L22)

读取、迁移与异常回退。

<details>
<summary>查看原文（22行）</summary>

```text
export const HISTORY_KEY = 'michengai.codex-ui.input-history.v1'
const LEGACY_HISTORY_KEY = 'michengai.btw.history.v1'
const MAX_STORAGE_LENGTH = 1_000_000
type StorageFace = Pick<Storage, 'getItem' | 'setItem'>

/** 只保存已发送文本；浏览器存储失败时仍保留本次内存历史。 */
export class InputHistory {
  private readonly scopes = new Map<string, string[]>()
  constructor(private readonly storage?: StorageFace, private readonly limit = 200, private readonly warn: (message: string) => void = console.warn) {
    try {
      const current = storage?.getItem(HISTORY_KEY)
      const raw = current ?? storage?.getItem(LEGACY_HISTORY_KEY)
      if (!raw) return
      if (raw.length > MAX_STORAGE_LENGTH) throw new Error('历史数据过大')
      const data: unknown = JSON.parse(raw)
      if (typeof data !== 'object' || data === null || Array.isArray(data)) throw new Error('历史格式无效')
      for (const [key, value] of Object.entries(data).slice(-20)) {
        if (Array.isArray(value)) this.scopes.set(key, value.filter((item): item is string => typeof item === 'string' && item.length <= 8_000).slice(-limit))
      }
      // 迁移后只写新键，保留旧数据供回退；已有新键时不重复导入。
      if (current === null || current === undefined) storage?.setItem(HISTORY_KEY, JSON.stringify(Object.fromEntries(this.scopes)))
    } catch { warn('输入历史读取失败，本次使用内存历史。') }
```

</details>

**依据 5 · 源码核查**：[src/client/composer/input-history.ts:24-41](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/input-history.ts#L24-L41)

范围、去重及持久写入。

<details>
<summary>查看原文（18行）</summary>

```text
  list(scope: string): readonly string[] { return this.scopes.get(scope) ?? [] }
  add(scope: string, text: string): void {
    if (!text.trim() || text.length > 8_000) return
    const previous = this.scopes.get(scope) ?? []
    if (previous.at(-1) === text) return
    this.scopes.delete(scope)
    this.scopes.set(scope, [...previous, text].slice(-this.limit))
    while (this.scopes.size > 20) this.scopes.delete(this.scopes.keys().next().value!)
    let serialized = JSON.stringify(Object.fromEntries(this.scopes))
    while (serialized.length > MAX_STORAGE_LENGTH && this.scopes.size) {
      const oldest = this.scopes.keys().next().value!
      const entries = this.scopes.get(oldest)!
      entries.shift()
      if (!entries.length) this.scopes.delete(oldest)
      serialized = JSON.stringify(Object.fromEntries(this.scopes))
    }
    try { this.storage?.setItem(HISTORY_KEY, serialized) }
    catch { this.warn('输入历史无法保存到浏览器，本次仍可使用。') }
```

</details>

#### 缺口

- 未运行 DSH 事件和浏览器
  **影响**：无法确认实际宿主版本下监听和召回完全兼容
  **进一步探讨**：隔离宿主验证事件、附件提交、多个编辑器与存储失败。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 工作区范围与浏览器历史是否是隐私隔离？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

scope 使用 cwd 优先而非每个 session 均独立，同 cwd 的不同会话会共享历史；无 cwd 时才以 sessionId 分区。源码把被收集的文本序列化到 localStorage，没有在此路径看到凭据识别或加密；浏览器同源存储的保护取决于宿主和设备，不能宣称是安全保管。仅监听挂载后的增量事件，历史窗口不回灌；浏览器存储失败只保留内存，因此重载后不保证仍有历史。任务建议写入前检查非空草稿、附件、提及和忙碌状态，提供现有防覆盖措施。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/composer/InputHistoryDock.tsx:43-59](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/InputHistoryDock.tsx#L43-L59)

cwd scope 与不回灌。

<details>
<summary>查看原文（17行）</summary>

```text
    const binding = ctx.sessions.binding(sessionId)
    if (binding === undefined) return
    const scope = ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd ?? sessionId
    const input = ctx.conversation.input.for(binding.ctx)
    const menu = ctx.inputTriggers.sessionOf(binding.ctx).menu
    // 挂载只建立版本基线，历史窗口和未挂载期间的输入不回灌；多实例共用版本去重。
    seen.set(binding, binding.eventSource.getSnapshot().revision)
    const collect = () => {
      const snapshot = binding.eventSource.getSnapshot()
      // 完整窗口替换可重设版本基线，兼容宿主重建窗口后计数归零；不回灌窗口内容。
      if (snapshot.change.kind !== 'replace' && snapshot.revision <= (seen.get(binding) ?? -1)) return
      seen.set(binding, snapshot.revision)
      if (snapshot.change.kind !== 'append') return
      for (const entry of snapshot.change.entries) {
        if (entry.event.type !== 'user/message' || entry.event.data.source?.kind !== 'user') continue
        const text = entry.event.data.content.filter(block => block.type === 'text').map(block => block.text).join('')
        history.add(scope, text)
```

</details>

**依据 2 · 源码核查**：[src/client/composer/input-history.ts:24-41](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/input-history.ts#L24-L41)

文本序列化及写入失败。

<details>
<summary>查看原文（18行）</summary>

```text
  list(scope: string): readonly string[] { return this.scopes.get(scope) ?? [] }
  add(scope: string, text: string): void {
    if (!text.trim() || text.length > 8_000) return
    const previous = this.scopes.get(scope) ?? []
    if (previous.at(-1) === text) return
    this.scopes.delete(scope)
    this.scopes.set(scope, [...previous, text].slice(-this.limit))
    while (this.scopes.size > 20) this.scopes.delete(this.scopes.keys().next().value!)
    let serialized = JSON.stringify(Object.fromEntries(this.scopes))
    while (serialized.length > MAX_STORAGE_LENGTH && this.scopes.size) {
      const oldest = this.scopes.keys().next().value!
      const entries = this.scopes.get(oldest)!
      entries.shift()
      if (!entries.length) this.scopes.delete(oldest)
      serialized = JSON.stringify(Object.fromEntries(this.scopes))
    }
    try { this.storage?.setItem(HISTORY_KEY, serialized) }
    catch { this.warn('输入历史无法保存到浏览器，本次仍可使用。') }
```

</details>

**依据 3 · 源码核查**：[src/client/composer/new-conversation-draft.ts:29-41](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/new-conversation-draft.ts#L29-L41)

已有草稿和附件检查。

<details>
<summary>查看原文（13行）</summary>

```text
type DraftInput = {
  state: { getSnapshot: () => { phase: string; draft: string; imageIds?: readonly unknown[]; attachmentIds?: readonly unknown[]; occurrences: readonly unknown[] } }
  setDraft: (text: string) => void
}

/** 任务建议只能填入空闲且空白的草稿，不覆盖附件、提及或正在提交的内容。 */
export function prefillNewConversation(input: DraftInput | undefined, text: string): PrefillResult {
  if (input === undefined) return 'workspace'
  const state = input.state.getSnapshot()
  if (state.phase !== 'plain') return 'busy'
  if (state.draft.trim() !== '' || hasDraftAttachments(state) || state.occurrences.length > 0) return 'draft'
  input.setDraft(text)
  return 'ready'
```

</details>

#### 缺口

- 未审计全套件的数据处理或浏览器隔离
  **影响**：不能证明无其他泄露或完整删除能力
  **进一步探讨**：隔离浏览器检查同 cwd 会话、存储失败及卸载后的残留。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和退出需要什么条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包声明 Node ^22.19 或 >=24、DSH >=0.2.0-rc.1 <0.3.0-0；还依赖宿主 session、输入和 UI 接口。声明不是实际兼容验收。用户应按数据敏感程度评估浏览器持久化，先在隔离 profile 验证，并在不适用时停用相关插件、按浏览器策略核查和清理本地历史；停用不会由所查代码证明自动删除 localStorage 或旧迁移键。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:18-24](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/package.json#L18-L24)

Node、DSH 版本声明。

```text
  "type": "module",
  "packageManager": "pnpm@11.22.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.1 <0.3.0-0"
  },
  "main": "lib/index.mjs",
```

**依据 2 · 源码核查**：[src/client/composer/InputHistoryDock.tsx:43-47](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/InputHistoryDock.tsx#L43-L47)

实际宿主接口。

```text
    const binding = ctx.sessions.binding(sessionId)
    if (binding === undefined) return
    const scope = ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd ?? sessionId
    const input = ctx.conversation.input.for(binding.ctx)
    const menu = ctx.inputTriggers.sessionOf(binding.ctx).menu
```

**依据 3 · 源码核查**：[src/client/composer/input-history.ts:10-22](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/input-history.ts#L10-L22)

新旧键和读取回退。

<details>
<summary>查看原文（13行）</summary>

```text
    try {
      const current = storage?.getItem(HISTORY_KEY)
      const raw = current ?? storage?.getItem(LEGACY_HISTORY_KEY)
      if (!raw) return
      if (raw.length > MAX_STORAGE_LENGTH) throw new Error('历史数据过大')
      const data: unknown = JSON.parse(raw)
      if (typeof data !== 'object' || data === null || Array.isArray(data)) throw new Error('历史格式无效')
      for (const [key, value] of Object.entries(data).slice(-20)) {
        if (Array.isArray(value)) this.scopes.set(key, value.filter((item): item is string => typeof item === 'string' && item.length <= 8_000).slice(-limit))
      }
      // 迁移后只写新键，保留旧数据供回退；已有新键时不重复导入。
      if (current === null || current === undefined) storage?.setItem(HISTORY_KEY, JSON.stringify(Object.fromEntries(this.scopes)))
    } catch { warn('输入历史读取失败，本次使用内存历史。') }
```

</details>

**依据 4 · 源码核查**：[src/client/composer/input-history.ts:32-41](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/input-history.ts#L32-L41)

本地保存。

<details>
<summary>查看原文（10行）</summary>

```text
    let serialized = JSON.stringify(Object.fromEntries(this.scopes))
    while (serialized.length > MAX_STORAGE_LENGTH && this.scopes.size) {
      const oldest = this.scopes.keys().next().value!
      const entries = this.scopes.get(oldest)!
      entries.shift()
      if (!entries.length) this.scopes.delete(oldest)
      serialized = JSON.stringify(Object.fromEntries(this.scopes))
    }
    try { this.storage?.setItem(HISTORY_KEY, serialized) }
    catch { this.warn('输入历史无法保存到浏览器，本次仍可使用。') }
```

</details>

#### 缺口

- 未运行安装、停用或浏览器数据清理
  **影响**：不知实际兼容和退出后残留
  **进一步探讨**：用隔离 profile 测启停、存储权限和手动清理结果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样帮助用户决定哪些输入可保留？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有非空和长度限制、范围数量上限、内存回退及草稿防覆盖，是直接反证；这些并非用户针对敏感文本的持久化选择。假设在输入历史功能附近提供明确的“仅本次内存”选择和可见保存范围，帮助用户在发送前决定是否保留；须先确认套件其他设置未提供等价功能。对照现有持久化，在普通文本、敏感模拟文本、同 cwd 多会话和存储不可用场景测误保留、误丢失、找回成功率、操作时间及提示干扰；若误保留不降、误丢增加或成本抵消收益则否定，且不以识别规则声称能识别所有秘密。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/composer/input-history.ts:1-22](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/input-history.ts#L1-L22)

读取上限、迁移和内存回退。

<details>
<summary>查看原文（22行）</summary>

```text
export const HISTORY_KEY = 'michengai.codex-ui.input-history.v1'
const LEGACY_HISTORY_KEY = 'michengai.btw.history.v1'
const MAX_STORAGE_LENGTH = 1_000_000
type StorageFace = Pick<Storage, 'getItem' | 'setItem'>

/** 只保存已发送文本；浏览器存储失败时仍保留本次内存历史。 */
export class InputHistory {
  private readonly scopes = new Map<string, string[]>()
  constructor(private readonly storage?: StorageFace, private readonly limit = 200, private readonly warn: (message: string) => void = console.warn) {
    try {
      const current = storage?.getItem(HISTORY_KEY)
      const raw = current ?? storage?.getItem(LEGACY_HISTORY_KEY)
      if (!raw) return
      if (raw.length > MAX_STORAGE_LENGTH) throw new Error('历史数据过大')
      const data: unknown = JSON.parse(raw)
      if (typeof data !== 'object' || data === null || Array.isArray(data)) throw new Error('历史格式无效')
      for (const [key, value] of Object.entries(data).slice(-20)) {
        if (Array.isArray(value)) this.scopes.set(key, value.filter((item): item is string => typeof item === 'string' && item.length <= 8_000).slice(-limit))
      }
      // 迁移后只写新键，保留旧数据供回退；已有新键时不重复导入。
      if (current === null || current === undefined) storage?.setItem(HISTORY_KEY, JSON.stringify(Object.fromEntries(this.scopes)))
    } catch { warn('输入历史读取失败，本次使用内存历史。') }
```

</details>

**依据 2 · 源码核查**：[src/client/composer/input-history.ts:24-41](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/input-history.ts#L24-L41)

容量及保存。

<details>
<summary>查看原文（18行）</summary>

```text
  list(scope: string): readonly string[] { return this.scopes.get(scope) ?? [] }
  add(scope: string, text: string): void {
    if (!text.trim() || text.length > 8_000) return
    const previous = this.scopes.get(scope) ?? []
    if (previous.at(-1) === text) return
    this.scopes.delete(scope)
    this.scopes.set(scope, [...previous, text].slice(-this.limit))
    while (this.scopes.size > 20) this.scopes.delete(this.scopes.keys().next().value!)
    let serialized = JSON.stringify(Object.fromEntries(this.scopes))
    while (serialized.length > MAX_STORAGE_LENGTH && this.scopes.size) {
      const oldest = this.scopes.keys().next().value!
      const entries = this.scopes.get(oldest)!
      entries.shift()
      if (!entries.length) this.scopes.delete(oldest)
      serialized = JSON.stringify(Object.fromEntries(this.scopes))
    }
    try { this.storage?.setItem(HISTORY_KEY, serialized) }
    catch { this.warn('输入历史无法保存到浏览器，本次仍可使用。') }
```

</details>

**依据 3 · 源码核查**：[src/client/composer/new-conversation-draft.ts:34-41](https://github.com/MichengAI/dsh-codex-ui/blob/2e1ac7d0033f3e689b04a900baf60f8b5476d159/src/client/composer/new-conversation-draft.ts#L34-L41)

已有草稿防覆盖。

```text
/** 任务建议只能填入空闲且空白的草稿，不覆盖附件、提及或正在提交的内容。 */
export function prefillNewConversation(input: DraftInput | undefined, text: string): PrefillResult {
  if (input === undefined) return 'workspace'
  const state = input.state.getSnapshot()
  if (state.phase !== 'plain') return 'busy'
  if (state.draft.trim() !== '' || hasDraftAttachments(state) || state.occurrences.length > 0) return 'draft'
  input.setDraft(text)
  return 'ready'
```

#### 缺口

- 未穷尽其他设置入口，也未进行用户验证
  **影响**：不能断言缺少等价选项或新方案有效
  **进一步探讨**：固定模拟数据在隔离 profile 对照两种选择及退出残留。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
