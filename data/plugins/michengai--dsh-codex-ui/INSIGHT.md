# DSH Codex UI

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c7435bb](https://github.com/MichengAI/dsh-codex-ui/tree/c7435bb5ee3b2a09134de668155773827d1b5965)

<!-- BEGIN META -->
[![GitHub ★ 293](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=293&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-codex-ui) [![npm 30d 84,147](https://img.shields.io/static/v1?label=npm+30d&message=84%2C147&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-codex-ui) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-codex-ui)
<!-- END META -->

> **功能**：为 DSH 增加输入召回和预测、侧栏分区、主题及移动界面增强。

> **亮点**：在原生输入上增加默认会话级历史召回，并为移动可视区域和宿主侧栏提供补充交互。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：本地历史仍留在浏览器。预测可在提交前使用草稿，标题也可能额外调用模型；宿主 DOM 与服务会影响兼容和退出。[Q01](#research-q01) [Q02](#research-q02) [Q04](#research-q04)

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
  - [Q01 · 同一工作区的不同会话如何召回历史，是否会覆盖现有草稿？](#detail-section-11)
  - [Q02 · 行内建议什么时候调用模型，未发送草稿会去哪？](#detail-section-12)
  - [Q03 · 移动布局与侧栏增强如何接到宿主，能否局部撤销？](#detail-section-13)
  - [Q04 · 配套安装、标题与桌面重启各自会触发什么宿主副作用？](#detail-section-14)
  - [Q05 · 怎样验证内存历史是否足够便利，并控制预测与配套副作用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要反复召回提示、组织项目并用小屏操作的 DSH 用户。

使用宿主原生输入、侧栏和设置，手工从历史消息复制常用内容。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 输入历史 | 从当前会话召回输入 | 浏览器本地记录可残留 |
| 输入预测 | 生成下一步建议与续写 | 可能使用草稿和模型额度 |
| 移动与侧栏 | 调整显示和工作区入口 | 依赖宿主 DOM、槽与服务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Host 和 Web 服务 | 必需 | 输入、设置和界面接线 | 回退原生操作 |
| 浏览器本地存储 | 持久历史需要 | 召回已发送文本 | 本次内存历史 |
| LLM 路由和宿主会话 | 预测或标题需要 | 辅助生成 | 候选或标题无法提供 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 隔离 profile 并关闭不需子项 | 确认预测是否发出请求 |
| 试用 | 用户跨会话召回、移动输入 | 核草稿、布局和本地记录 |
| 退出 | 停用子项并检查存储与宿主 | 恢复原生输入和配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 浏览器和宿主本地资源未测 | 验证版本、配置与组件开关 | 配套安装可能需重启 |
| 持续 | 预测和标题可消耗模型额度 | 复核建议、维护历史和布局 | 单位合格操作的节省未测 |
| 退出 | 已发模型请求无法撤回 | 清理试用历史及宿主配置 | 停用不等于擦除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 历史召回 | 按会话或工作区及草稿保护 | 实际隔离和节时 |
| 移动界面 | 可视区和弹层适配 | 真实触屏、第三方插件共存 |
| 辅助建议 | 模型分支与站点开关 | 质量、费用及安全边界 |

> **思考**：本地历史仍留在浏览器。预测可在提交前使用草稿，标题也可能额外调用模型；宿主 DOM 与服务会影响兼容和退出。[Q01](#research-q01) [Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在原生输入上增加默认会话级历史召回，并为移动可视区域和宿主侧栏提供补充交互。[Q01](#research-q01) [Q03](#research-q03)

Web 适配提供监听销毁与本地存储降级，Host 在状态操作中区分失败和需要重启。稳定性取决于目标宿主公开与内部接口。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

本地历史仍留在浏览器。预测可在提交前使用草稿，标题也可能额外调用模型；宿主 DOM 与服务会影响兼容和退出。[Q01](#research-q01) [Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离 profile 先试会话历史与移动布局。对输入预测、标题、配套安装和重启按实际需求逐项打开，检查请求与退出状态。[Q02](#research-q02) [Q04](#research-q04) [Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持历史隔离、辅助调用和响应式接线。实际宿主、浏览器和隐私边界仍需验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、src/client/index.ts、src/client/composer/InputHistoryDock.tsx、src/client/composer/input-history.ts、src/client/composer/history-scope.ts、src/client/composer/prediction-state.ts、src/composer-plugin.ts、src/composer-prediction.ts、src/client/composer/ComposerPredictionOverlay.tsx、src/client/mobile-web.ts、src/index.ts、src/client/sidebar/sections/index.ts、src/client/sidebar/session-unread/model.ts、src/desktop-menu-route.ts、src/session-title-lifecycle.ts、src/session-title-provider.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：对比固定版本及旧稿，覆盖主要历史、自动调用、移动和宿主副作用。未实测目标宿主、模型、浏览器、更新或重启。
- 下一步：用隔离 profile 验证两会话、草稿保护、三态预测、移动键盘、卸载残留与实际重启状态。

**分析版本**

- **仓库**：[MichengAI/dsh-codex-ui](https://github.com/MichengAI/dsh-codex-ui)
- **版本号**：2.2.0（[固定提交 c7435bb](https://github.com/MichengAI/dsh-codex-ui/tree/c7435bb5ee3b2a09134de668155773827d1b5965)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

提供仅内存的可选历史并量化回读摩擦，可能保留短时召回同时减少退出后的文本残留。[Q05](#research-q05)

用隔离 profile 验证两会话、草稿保护、三态预测、移动键盘、卸载残留与实际重启状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 3731 | — | — | 53130 |
| .js | source | 1 | 16105 | 14899 | 1250 | — |
| .mjs | source | 23 | 6819 | 6315 | 389 | — |
| .js | example | 1 | 22 | 21 | 1 | — |
| .mjs | example | 1 | 11 | 10 | 1 | — |
| .ts | source | 64 | 17470 | 14941 | 1409 | — |
| .tsx | source | 10 | 3533 | 3043 | 266 | — |
| .ts | test | 52 | 11148 | 9354 | 622 | — |
| .mjs | test | 3 | 250 | 238 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/MichengAI/dsh-codex-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 48](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=48&color=737b86&logo=github)](https://github.com/MichengAI/dsh-codex-ui/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 47](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=47&color=737b86&logo=github)](https://github.com/MichengAI/dsh-codex-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户启用界面增强后，输入历史、模型预测和宿主状态分别如何改变，哪些功能可安全试用和退出？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 同一工作区的不同会话如何召回历史，是否会覆盖现有草稿？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

同目录反复输入同类指令的用户可以在宿主编辑器里召回已发送文本。默认会话隔离以 sessionId 为键，显式切换 workspace 才用 cwd（缺失时仍用 sessionId）；旧工作区数据没有因默认值变化被删除。历史监听只取新追加的用户来源消息，也在无附件、无触发项的成功提交状态切换保存草稿。召回通过宿主 setDraft，遇提交、附件、触发项或菜单会阻断。历史写入 localStorage，按最近 100 个作用域、每组默认 200 条及全局长度截断；迁移留旧键。界面关闭或改为会话模式并不擦除已保存文本。相对从对话回滚复制，召回步骤缩短，设备共享或敏感输入的存储边界需另处理。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/composer/history-scope.ts:21-35](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/composer/history-scope.ts#L21-L35)

显式 workspace 才共享，其他值回到 session。

<details>
<summary>查看原文（15行）</summary>

```text
function safeStorage(): Storage | undefined {
  try {
    if (typeof localStorage !== 'undefined') return localStorage
  } catch {
    // 浏览器存储被禁用时按默认值处理，不影响输入本身
  }
  return undefined
}

export function parseStoredHistoryScope(raw: string | null | undefined): HistoryScope {
  // 只有显式 'workspace' 才共享；其余（未存储、损坏、旧值）一律回落到会话级。
  return raw === 'workspace' ? 'workspace' : 'session'
}

let currentScope: HistoryScope = parseStoredHistoryScope(safeStorage()?.getItem(HISTORY_SCOPE_STORAGE_KEY))
```

</details>

**依据 2 · 源码核查**：[src/client/composer/InputHistoryDock.tsx:49-79](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/composer/InputHistoryDock.tsx#L49-L79)

绑定会话、作用域和已发送事件。

<details>
<summary>查看原文（31行）</summary>

```text
  useEffect(() => {
    const binding = ctx.sessions.binding(sessionId)
    if (binding === undefined) return
    const scope = scopeMode === 'workspace'
      ? ctx.sessions.list.getSnapshot().byId[sessionId]?.cwd ?? sessionId
      : sessionId
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
      }
```

</details>

**依据 3 · 源码核查**：[src/client/composer/InputHistoryDock.tsx:89-105](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/composer/InputHistoryDock.tsx#L89-L105)

状态或草稿附件阻断召回，卸载取消监听。

<details>
<summary>查看原文（17行）</summary>

```text
      if (editor === undefined) return
      offKeys = bindHistoryKeys(editor, {
        draft: () => input.state.getSnapshot().draft,
        entries: () => history.list(scope),
        setDraft: text => input.setDraft(text),
        blocked: () => {
          const state = input.state.getSnapshot()
          return state.phase === 'adjudicating' || state.phase === 'submitting'
            || hasDraftAttachments(state) || state.occurrences.length > 0 || menu.getSnapshot().open
        },
      })
    }
    connect()
    const parent = anchor.current?.parentElement?.parentElement
    const observer = new MutationObserver(connect)
    if (parent !== null && parent !== undefined) observer.observe(parent, { childList: true, subtree: true })
    return () => { observer.disconnect(); offKeys(); offInput(); offEvents() }
```

</details>

**依据 4 · 源码核查**：[src/client/composer/input-history.ts:1-44](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/composer/input-history.ts#L1-L44)

浏览器历史、旧键保留与容量策略。

<details>
<summary>查看原文（44行）</summary>

```text
export const HISTORY_KEY = 'michengai.codex-ui.input-history.v1'
const LEGACY_HISTORY_KEY = 'michengai.btw.history.v1'
const MAX_STORAGE_LENGTH = 1_000_000
/** 最多保留多少个作用域；会话级模式下即最近有输入的 100 个会话。 */
const MAX_SCOPES = 100
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
      for (const [key, value] of Object.entries(data).slice(-MAX_SCOPES)) {
        if (Array.isArray(value)) this.scopes.set(key, value.filter((item): item is string => typeof item === 'string' && item.length <= 8_000).slice(-limit))
      }
      // 迁移后只写新键，保留旧数据供回退；已有新键时不重复导入。
      if (current === null || current === undefined) storage?.setItem(HISTORY_KEY, JSON.stringify(Object.fromEntries(this.scopes)))
    } catch { warn('输入历史读取失败，本次使用内存历史。') }
  }
  list(scope: string): readonly string[] { return this.scopes.get(scope) ?? [] }
  add(scope: string, text: string): void {
    if (!text.trim() || text.length > 8_000) return
    const previous = this.scopes.get(scope) ?? []
    if (previous.at(-1) === text) return
    this.scopes.delete(scope)
    this.scopes.set(scope, [...previous, text].slice(-this.limit))
    while (this.scopes.size > MAX_SCOPES) this.scopes.delete(this.scopes.keys().next().value!)
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
  }
```

</details>

#### 缺口

- 未在共享浏览器和多个标签页验证隔离、残留
  **影响**：不能保证用户切换模式后已存内容不可读
  **进一步探讨**：两会话发送不同非敏感文本并检查作用域和两个 storage 键

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 行内建议什么时候调用模型，未发送草稿会去哪？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本、依赖、兼容与流程

#### 完整回答

用户偏好缺省为 all，空输入在回合结束后可请求 next，输入暂停且光标在草稿末端可请求 continue。only continue 阻断 next，用户 off 阻断客户端功能；站点设 config.prediction=false 时 Host 不注册预测引擎，效果与只关用户设置不同。请求含 sessionId、mode 和草稿，在 Host 解析活动会话；通过 connection.admit 时要求 owner，缺该服务代码回落到 owner，需要核对部署下宿主外层认证。预测把有界会话文本、配置允许的工具摘要和续写草稿送到宿主所选模型接口，可能有额外费用和数据传输。LLM 或路由缺失时无候选；缓存依 session、序号、mode 和草稿。模型建议仍需用户选用，不自动提交。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/composer/prediction-state.ts:54-75](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/composer/prediction-state.ts#L54-L75)

偏好默认 all，合成 Host 和用户开关。

<details>
<summary>查看原文（22行）</summary>

```text
export function parseStoredMode(raw: string | null): PredictionMode {
  if (raw === 'off' || raw === 'false' || raw === '0') return 'off'
  if (raw === 'continue') return 'continue'
  // 'all' / 'on' / 'true' / '1' 或未存储缺省值平滑兼容为 'all'
  return 'all'
}

let subPluginEnabled = true
let currentMode = parseStoredMode(safeGetItem(PREDICTION_STORAGE_KEY))
let hostAllowed = true

function snapshot(): PredictionSettingsState {
  const effective = subPluginEnabled && hostAllowed && currentMode !== 'off'
  return {
    subPluginEnabled,
    userEnabled: currentMode !== 'off',
    mode: currentMode,
    hostAllowed,
    enabled: effective,
    nextEnabled: effective && currentMode === 'all',
    continueEnabled: effective && (currentMode === 'continue' || currentMode === 'all'),
  }
```

</details>

**依据 2 · 源码核查**：[src/composer-plugin.ts:26-47](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/composer-plugin.ts#L26-L47)

显式站点 false 使预测引擎不注册。

<details>
<summary>查看原文（22行）</summary>

```text
/** 严格读取配置：只有显式 `false` 才关闭，其余（含未声明、类型错误）一律视为开启。 */
export function resolvePredictionAllowed(config: ComposerPluginConfig | undefined): boolean {
  if (config === null || typeof config !== 'object') return true
  return config.prediction !== false
}

/**
 * Composer 输入框增强子组件 (Host 侧)
 * 1. 暴露 /api/michengai/dsh-codex-ui/composer (启停状态 + 预测开关状态)
 * 2. 暴露 /composer/prediction 与 /composer/prediction/stream (流式预测)
 */
export function apply(ctx: Context, config?: ComposerPluginConfig): void {
  const statusEndpoint = CODEX_UI_API_ENDPOINTS.composer
  const predictionAllowed = resolvePredictionAllowed(config)

  // 1. 注册标准预测引擎（对齐成熟参考插件）；站点级关闭时完全不注册，也就不可能产生模型调用
  ctx.effect(() => {
    const disabled = isSubPluginDisabledOnDisk('codex-ui-composer', undefined, ctx)
    if (disabled || !predictionAllowed) return () => {}
    applyPredictions(ctx)
    return () => {}
  }, 'michengai-codex-ui: composer predictions engine')
```

</details>

**依据 3 · 源码核查**：[src/client/composer/ComposerPredictionOverlay.tsx:319-342](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/composer/ComposerPredictionOverlay.tsx#L319-L342)

发出预测请求的原始字段。

<details>
<summary>查看原文（24行）</summary>

```text
          if (sessionId === undefined || sessionId === null) return
          if (typeof document !== 'undefined' && document.hidden) return
          abortRef.current?.abort()
          const controller = new AbortController()
          abortRef.current = controller
          setGhost({ mode, items: [], index: 0, stream: '', active: true })

          const settle = (items: string[]) => {
            if (controller.signal.aborted) return
            setGhost((previous) => {
              if (previous.mode !== mode) return previous
              if (items.length === 0) return NO_GHOST
              return { mode, items, index: 0, stream: '', active: false }
            })
          }

          try {
            const response = await fetch(ENDPOINT, {
              method: 'POST',
              headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
              body: JSON.stringify({ sessionId, mode, draft: draftText }),
              signal: controller.signal,
            })
            if (!response.ok || controller.signal.aborted) {
```

</details>

**依据 4 · 源码核查**：[src/client/composer/ComposerPredictionOverlay.tsx:460-485](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/composer/ComposerPredictionOverlay.tsx#L460-L485)

空输入和打字暂停的不同触发。

<details>
<summary>查看原文（26行）</summary>

```text
      // `next`: ask once the turn has settled and the composer is empty.
      React.useEffect(() => {
        if (sessionId === undefined || sessionId === null) return undefined
        if (!allowNext || running || draft !== '') return undefined
        if (dismissedRef.current !== null && dismissedRef.current.draft === draft) return undefined
        const timer = setTimeout(() => {
          if (composingRef.current) return
          void request('next', '')
        }, SETTLE_MS)
        return () => clearTimeout(timer)
      }, [sessionId, running, draft, request, allowNext, compositionEnd])

      // `continue`: ask after a pause, only with the caret at the draft's end.
      React.useEffect(() => {
        if (sessionId === undefined || sessionId === null) return undefined
        if (!allowContinue || draft.trim() === '' || draft.length < CONTINUE_MIN_CHARS) return undefined
        if (isTriggerToken(draft)) return undefined
        if (dismissedRef.current !== null && dismissedRef.current.draft === draft) return undefined
        const timer = setTimeout(() => {
          if (composingRef.current) return
          const found = elements()
          if (found === null) return
          if (caretAtEnd(found.editor, draft) === null) return
          void request('continue', draft.slice(-MAX_DRAFT_CHARS))
        }, TYPE_PAUSE_MS)
        return () => clearTimeout(timer)
```

</details>

**依据 5 · 源码核查**：[src/composer-prediction.ts:224-275](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/composer-prediction.ts#L224-L275)

准入、活动会话及缓存键。

<details>
<summary>查看原文（52行）</summary>

```text
async function planRequest(ctx: any, request: any, response: any) {
  const connection = getService(ctx, 'connection')
  const admission = connection?.admit ? connection.admit(request) : { peer: { principal: { kind: 'owner' } } }
  if (admission && 'rejection' in admission) {
    return { status: admission.rejection, error: admission.rejection === 401 ? 'unauthorized' : 'forbidden' }
  }
  // Predictions read the owner's sessions and spend the owner's model tokens.
  if ((admission?.peer?.principal?.kind ?? 'owner') !== 'owner') return { status: 403, error: 'forbidden' }

  if (request.method !== 'POST') {
    respond(response, 405, { suggestion: null, suggestions: [], reason: 'method-not-allowed' })
    return null
  }

  if (request.headers['content-type']?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
    return { status: 415, error: 'unsupported-media-type' }
  }

  let body
  try {
    body = await readJsonBody(request)
  } catch {
    return { status: 400, error: 'invalid-body' }
  }
  if (body === null || typeof body !== 'object' || Array.isArray(body)) return { status: 400, error: 'invalid-body' }
  if (body.mode !== undefined && body.mode !== 'next' && body.mode !== 'continue') return { status: 400, error: 'invalid-mode' }

  const sessionId = typeof body?.sessionId === 'string' ? body.sessionId : ''
  if (sessionId === '') return { status: 400, error: 'missing-session' }

  const sessions = getService(ctx, 'sessions')
  if (!sessions || typeof sessions.get !== 'function') return { status: 503, error: 'no-sessions-service' }

  const session = sessions.get(sessionId)
  if (session === undefined) return { status: 200, error: 'session-not-live' }

  const mode = body?.mode === 'continue' ? 'continue' : 'next'
  const draft = mode === 'continue' && typeof body?.draft === 'string' ? body.draft.slice(-MAX_DRAFT_CHARS) : ''
  if (mode === 'continue' && draft.trim() === '') return { status: 200, error: 'no-draft' }

  const seq = Number(session.seq)
  const key = JSON.stringify([sessionId, seq, mode, draft])

  return { sessionId, session, mode, draft, seq, key }
}

/**
 * Run one prediction, serving from or filling the bounded result cache.
 * @returns `{ items, reason }`.
 */
async function runPrediction(ctx: any, options: any, cache: any, inflight: any, plan: any, signals: any[], onDelta?: (text: string) => void) {
  const remembered = cache.get(plan.key)
```

</details>

**依据 6 · 源码核查**：[src/composer-prediction.ts:341-365](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/composer-prediction.ts#L341-L365)

调用宿主选择的模型并转发 sessionId。

<details>
<summary>查看原文（25行）</summary>

```text
    const baseConfig: Record<string, any> = {
      provider: route.provider,
      model: route.model,
      maxTokens: options.maxOutputTokens,
    }
    const callConfig: Record<string, any> = { ...baseConfig }
    if (targetEffort !== undefined) {
      callConfig.reasoningEffort = targetEffort
    }

    let call: any
    try {
      call = await llm.prepareCall(callConfig, deadline.signal)
    } catch (error: any) {
      const msg = String(error?.message || error?.code || '')
      if (targetEffort !== undefined && (error?.code === 'UNSUPPORTED_REASONING_EFFORT' || msg.includes('does not support reasoning effort'))) {
        call = await llm.prepareCall(baseConfig, deadline.signal)
      } else {
        throw error
      }
    }
    const messages = [{ role: 'user', content: [{ type: 'text', text: prompt }] }]
    // `sessionId` 必须随请求下发：OpenCode 兼容网关按 `x-opencode-session` 头路由，
    // 缺失该头的辅助请求会被 400 拒绝（MissingSessionID），预测永远不会出现。
    for await (const chunk of call.stream({ ...call.config, messages, system, sessionId, purpose: 'composer-prediction', signal: deadline.signal })) {
```

</details>

**依据 7 · 源码核查**：[src/composer-prediction.ts:535-566](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/composer-prediction.ts#L535-L566)

会话尾部、工具概要和续写草稿的出站内容。

<details>
<summary>查看原文（32行）</summary>

```text
  if (mode === 'next' && (picked.length === 0 || picked.at(-1)?.role !== 'assistant')) return null

  const tail = picked.slice(-options.maxMessages)
  const kept = []
  let budget = options.maxChars
  for (let index = tail.length - 1; index >= 0; index -= 1) {
    const message = tail[index]
    if (message.text.length > budget) {
      if (budget > 200) kept.unshift({ role: message.role, text: `…${message.text.slice(-budget)}` })
      break
    }
    budget -= message.text.length
    kept.unshift(message)
  }

  const lines = ['Conversation tail (oldest first):', JSON.stringify(kept)]
  const recent = options.maxToolNotes > 0 ? notes.slice(-options.maxToolNotes) : []
  if (recent.length > 0) {
    lines.push('', 'Recent tool activity (oldest first):')
    for (const note of recent) {
      const status = note.failed ? 'failed' : 'ok'
      const result = note.result === '' ? '' : ` result=${JSON.stringify(clip(note.result, 320))}`
      lines.push(`- ${note.name}(${clip(note.input, 320)}) -> ${status}${result}`)
    }
  }

  if (mode === 'continue') {
    lines.push('', 'Draft text ending at the caret:', JSON.stringify(draft), '', CONTINUE_CUE)
  } else {
    lines.push('', NEXT_CUE)
  }
  return lines.join('\n')
```

</details>

#### 缺口

- 未实测授权绕过、默认预测请求数和各模型费用
  **影响**：不能将额外调用视为免费或无外发
  **进一步探讨**：隔离 profile 拦截 owner/非 owner、有无 connection 及 off/continue/all 的调用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 移动布局与侧栏增强如何接到宿主，能否局部撤销？

**研究主题**：贡献与相对优势、工程质量与复用、依赖、兼容与流程

#### 完整回答

Web 客户端观察 visualViewport，根据宽度和触屏特征激活移动样式，排除标记为原生窗口的宿主。软键盘使可视区域变窄时更新 CSS 变量和浮层位置，对若干侧栏按钮提供 44px 热区，输入最小 16px；缩放与键盘使用不同 frame 参数。卸载清除观察器、属性和样式。布局依赖宿主 DOM 标记，不能据此承诺实际 Safari、Android 与所有第三方样式都通过。侧栏增强需探活后挂载，添加工作区按钮要求宿主 directoryFlow 并复用原生按钮入口，未读操作改宿主集合并广播失败回滚。侧栏分区数据另在 Host 写入，撤销 DOM 不会自动清除配置。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:29-38](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/index.ts#L29-L38)

根客户端安装移动布局和外观。

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx: ClientContext): void {
  clientContext = ctx
  ctx.effect(() => ctx.locale.register(NS, { zh, en, ja, es, fr, de, ru, pt }), 'michengai-codex-ui: dictionaries')
  const t = ctx.locale.bind(NS)
  // 侧栏增强共用一次探活：分区标题与会话未读都随 sidebar 子插件启停，但不需要各发一次请求。
  const sidebarReady = checkSidebarEnabled()

  ctx.effect(() => observeMobileWeb(), 'michengai-codex-ui: mobile web layout')
  ctx.effect(() => observeTheme(ctx), 'michengai-codex-ui: theme & appearance')
  ctx.effect(() => observeSidebarNav(ctx), 'michengai-codex-ui: sidebar navigation')
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:59-92](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/index.ts#L59-L92)

侧栏探活及未读、分区启停。

<details>
<summary>查看原文（34行）</summary>

```text
  // 工作区分区随侧栏子插件一起启停：探活失败（子插件被停用或 Host 路由缺失）时不注入任何标题。
  ctx.effect(() => {
    let stop: (() => void) | undefined
    let cancelled = false
    void sidebarReady.then(enabled => {
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
  // 会话「标记为未读」也是侧栏增强：子插件停用或端点不可达时，既不注册菜单项也不接管右键。
  ctx.effect(() => {
    let stop: (() => void) | undefined
    let cancelled = false
    void sidebarReady.then(enabled => {
      if (cancelled || !enabled) return
      stop = observeSessionUnread(ctx)
    })
    return () => {
      cancelled = true
      stop?.()
    }
  }, 'michengai-codex-ui: session unread')
```

</details>

**依据 3 · 源码核查**：[src/client/mobile-web.ts:1-59](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/mobile-web.ts#L1-L59)

移动特征、宿主选择器和触屏尺寸。

<details>
<summary>查看原文（59行）</summary>

```text
const MOBILE_WEB_QUERY = '(max-width: 767px), (max-width: 1023px) and (pointer: coarse), (max-width: 1023px) and (hover: none)'
const NATIVE_CHROME = '[data-windows-titlebar], [data-platform="darwin"]'
const MOBILE_ATTR = 'data-dcu-mobile-web'
const SHORT_VIEWPORT_ATTR = 'data-dcu-short-viewport'
const MENU_ATTR = 'data-dcu-viewport-menu'
// Popovers, context menus, and slash-command trigger dropdowns.
// Matches anchor-side / context-menu popovers even during phase transitions where host omits role="menu".
// data-gitgraph-popover reserves viewport fitting for GitGraph popovers.
const POPUPS = '[data-trigger-menu], :is([data-anchor-side], [data-context-menu]), [data-gitgraph-popover]'
const POPUP_MARGIN = 8

const MOBILE_WEB_CSS = `
html[data-dcu-mobile-web] :is([class*="_frame"], :has(> [data-shell-bottom])):has(> [data-shell-overlay]) {
  height: var(--dcu-frame-height, 100dvh);
  top: var(--dcu-frame-top, 0px);
  box-sizing: border-box;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}
html[data-dcu-mobile-web] [data-sidebar-drawer] [data-shell-leading] {
  top: max(0px, calc(env(safe-area-inset-top) - 2px));
  left: max(4px, env(safe-area-inset-left));
}
html[data-dcu-mobile-web] [data-sidebar-drawer] [data-sidebar-mask] + div {
  box-sizing: border-box;
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom) env(safe-area-inset-left);
}
html[data-dcu-mobile-web] :is([data-sidebar-opener], [data-sidebar-toggle], [class*="_sidebarCol"] button[class*="_toggle"], [class*="_leadingSeat"] button) {
  min-width: 44px;
  min-height: 44px;
}

html[data-dcu-mobile-web] :is([data-sidebar-scrollport], [class*="_sidebarCol"]) :is(.dcu-sb-row, [data-row-key^="session:"], [data-row-key^="workspace:"], [class*="_searchResultRow"]) {
  min-height: 44px;
  max-height: none;
}
html[data-dcu-mobile-web] :is([data-sidebar-scrollport], [class*="_sidebarCol"]) :is([data-row-key^="session:"], [data-row-key^="workspace:"], [class*="_searchResultRow"]) [class*="_rowActions"] {
  display: inline-flex;
  align-items: center;
  gap: 0;
  height: auto;
}
html[data-dcu-mobile-web] :is([data-sidebar-scrollport], [class*="_sidebarCol"]) [data-row-key^="session:"] [class*="_timestamp"] {
  display: none;
}
html[data-dcu-mobile-web] :is([data-sidebar-scrollport], [class*="_sidebarCol"]) [class*="_rowActions"] button,
html[data-dcu-mobile-web] :is([data-sidebar-workspace-header], [class*="_sectionHeader"]) [class*="_clearButton"] {
  box-sizing: border-box;
  min-width: 44px;
  min-height: 44px;
  touch-action: manipulation;
}
html[data-dcu-mobile-web] :is([data-sidebar-workspace-header], [class*="_sectionHeader"]):has(input[class*="_searchInput"]),
html[data-dcu-mobile-web] :is([data-sidebar-workspace-header], [class*="_sectionHeader"]) [class*="_searchExpanded"] {
  min-height: 44px;
}
html[data-dcu-mobile-web] :is([data-sidebar-scrollport], [class*="_sidebarCol"]) :is([class*="_searchInput"], [class*="_renameInput"]),
html[data-dcu-mobile-web] [data-composer-input],
html[data-dcu-mobile-web] [data-shortcut-modal="settings"] :is(input, select, textarea) {
  font-size: max(16px, 1em) !important;
```

</details>

**依据 4 · 源码核查**：[src/client/mobile-web.ts:164-192](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/mobile-web.ts#L164-L192)

根据 visualViewport 与缩放计算视图。

<details>
<summary>查看原文（29行）</summary>

```text
export function observeMobileWeb(win = typeof window === 'undefined' ? undefined : window): () => void {
  if (win?.document.body == null || typeof win.matchMedia !== 'function') return () => {}
  const doc = win.document
  const root = doc.documentElement
  const viewport = win.visualViewport
  const mobile = win.matchMedia(MOBILE_WEB_QUERY)
  const sheet = doc.createElement('style')
  sheet.textContent = MOBILE_WEB_CSS
  doc.head.append(sheet)

  let active = false
  let frame: number | undefined
  let popups = new Set<HTMLElement>()
  const update = (): void => {
    frame = undefined
    if (!active) return
    const bounds = boundsOf(win, viewport)
    const unzoomed = Math.abs((viewport?.scale ?? 1) - 1) < 0.01
    // Some browsers resize only the visual viewport for the keyboard. Others
    // resize both viewports, where the available height alone signals the squeeze.
    root.toggleAttribute(SHORT_VIEWPORT_ATTR, unzoomed && (bounds.height < 600 || bounds.height < win.innerHeight - 100))
    const values = [bounds.left, bounds.top, bounds.width, bounds.height,
      unzoomed ? bounds.top : 0, unzoomed ? bounds.height : win.innerHeight]
    VIEWPORT_PROPERTIES.forEach((property, index) => setPixels(root.style, property, values[index]!))

    const visible = new Set(doc.querySelectorAll<HTMLElement>(POPUPS))
    for (const popup of popups) if (!visible.has(popup)) resetPopup(popup)
    for (const popup of visible) fitPopup(popup, bounds, win)
    popups = visible
```

</details>

**依据 5 · 源码核查**：[src/client/mobile-web.ts:205-243](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/mobile-web.ts#L205-L243)

按环境切换、卸载时移除观察及样式。

<details>
<summary>查看原文（39行）</summary>

```text
  const clear = (): void => {
    if (frame !== undefined) win.cancelAnimationFrame(frame)
    frame = undefined
    root.removeAttribute(MOBILE_ATTR)
    root.removeAttribute(SHORT_VIEWPORT_ATTR)
    VIEWPORT_PROPERTIES.forEach(property => root.style.removeProperty(property))
    for (const popup of popups) resetPopup(popup)
    popups.clear()
  }
  const sync = (): void => {
    const next = mobile.matches && !root.matches(NATIVE_CHROME)
    if (next === active) return
    active = next
    if (active) {
      root.setAttribute(MOBILE_ATTR, '')
      observer.observe(doc.body, { childList: true, subtree: true })
      update()
    } else {
      observer.disconnect()
      clear()
    }
  }
  const chrome = new win.MutationObserver(sync)
  chrome.observe(root, { attributes: true, attributeFilter: ['data-platform', 'data-windows-titlebar'] })
  sync()
  mobile.addEventListener('change', sync)
  win.addEventListener('resize', schedule)
  viewport?.addEventListener('resize', schedule)
  viewport?.addEventListener('scroll', schedule)
  return () => {
    active = false
    mobile.removeEventListener('change', sync)
    win.removeEventListener('resize', schedule)
    viewport?.removeEventListener('resize', schedule)
    viewport?.removeEventListener('scroll', schedule)
    observer.disconnect()
    chrome.disconnect()
    clear()
    sheet.remove()
```

</details>

**依据 6 · 源码核查**：[src/client/sidebar/sections/index.ts:458-468](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/sidebar/sections/index.ts#L458-L468)

分区添加依赖原生目录流。

<details>
<summary>查看原文（11行）</summary>

```text
  /**
   * 检查宿主是否已挂载目录选择流能力（`sidebar.workspaces.directoryFlow`）。
   * 仅当官方 slots 服务就绪且该 slot 被占用时显示分区内「添加工作区」按钮；
   * slots 缺失或未占用时不渲染无效入口，避免出现只能走兜底快捷键的残缺状态。
   */
  const isDirectoryFlowAvailable = (): boolean =>
    typeof ctx.slots?.entries === 'function' && ctx.slots.entries('sidebar.workspaces.directoryFlow').length > 0

  /**
   * 等待新工作区自动归属的目标分区 ID。
   * 用户在某个分区的菜单里点击「新建工作区」后暂存，当宿主创建新工作区时自动将其分配到该分区。
```

</details>

**依据 7 · 源码核查**：[src/client/sidebar/sections/index.ts:508-532](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/sidebar/sections/index.ts#L508-L532)

识别并调用宿主的添加入口。

<details>
<summary>查看原文（25行）</summary>

```text
  function isHostAddWorkspaceButton(btn: HTMLButtonElement): boolean {
    if (btn.hasAttribute('data-dcu-action')) return false
    if (btn.hasAttribute('data-context-menu-trigger') || btn.getAttribute('aria-haspopup') === 'menu') return false
    if (btn.closest('[data-row-key]') !== null) return false
    const shortcuts = btn.getAttribute('aria-keyshortcuts') ?? ''
    if (/\bo\b/i.test(shortcuts) || /(?:^|\+)o$/i.test(shortcuts)) return true
    const label = btn.getAttribute('aria-label')?.trim() ?? ''
    return HOST_ADD_WORKSPACE_LABELS.has(label)
  }

  function findHostAddWorkspaceButton(): HTMLButtonElement | null {
    const candidates = document.querySelectorAll<HTMLButtonElement>(
      'button:not([data-dcu-action]):not([data-context-menu-trigger]):not([aria-haspopup="menu"])',
    )
    for (const btn of candidates) {
      if (isHostAddWorkspaceButton(btn)) return btn
    }
    return null
  }

  function triggerHostAddWorkspace(): void {
    triggeringHostAdd = true
    try {
      // 优先寻找宿主侧边栏原生的「添加工作区」按钮并点击
      const hostAddBtn = findHostAddWorkspaceButton()
```

</details>

**依据 8 · 源码核查**：[src/client/sidebar/session-unread/model.ts:159-179](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/sidebar/session-unread/model.ts#L159-L179)

写宿主集合，发布失败回滚。

<details>
<summary>查看原文（21行）</summary>

```text
export function writeSessionUnread(
  host: SessionUnreadHost | undefined,
  sessionId: string,
  unread: boolean,
): boolean {
  const unreadSet = unreadSetOf(host)
  if (unreadSet === undefined || sessionId === '') return false

  const had = unreadSet.has(sessionId)
  if (had === unread) return true

  if (unread) unreadSet.add(sessionId)
  else unreadSet.delete(sessionId)

  try {
    ;(host as { publishStatus: () => void }).publishStatus()
    return true
  } catch {
    if (had) unreadSet.add(sessionId)
    else unreadSet.delete(sessionId)
    return false
```

</details>

**依据 9 · 源码核查**：[src/index.ts:186-220](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/index.ts#L186-L220)

分区文档由受认证 Host API 写入。

<details>
<summary>查看原文（35行）</summary>

```text
    const disposeSections = host.webServer.register({
      kind: 'exact',
      path: CODEX_UI_API_ENDPOINTS.sections,
      handler: async (request, response) => {
        if (!authenticateBusinessRequest(ctx, request, response)) return
        const json = (status: number, body: unknown): void => {
          response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
          response.end(JSON.stringify(body))
        }
        try {
          if (request.method === 'GET') {
            const document = readSectionsDocument(ctx)
            json(200, document ?? { version: 1, sections: [] })
            return
          }
          if (request.method !== 'POST' && request.method !== 'PUT') {
            response.writeHead(405)
            response.end()
            return
          }
          const body = await readRequestBody(request, SECTIONS_STORE_MAX_BYTES)
          if (body.trim() === '') {
            json(400, { error: '缺少分区数据。' })
            return
          }
          let parsed: unknown
          try {
            parsed = JSON.parse(body)
          } catch {
            json(400, { error: '分区数据不是合法 JSON。' })
            return
          }
          const document = validateSectionsDocument(parsed)
          writeSectionsDocument(ctx, document)
          json(200, { ok: true, sections: document.sections.length })
```

</details>

#### 缺口

- 未验真实浏览器触屏、软键盘和第三方样式叠加
  **影响**：可见性与误触改善待测
  **进一步探讨**：在 iOS Safari 和 Android 横竖屏检验遮挡、菜单与撤销

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配套安装、标题与桌面重启各自会触发什么宿主副作用？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

关于页的配套依赖路由经认证后调用宿主安装或批量更新，并返回失败、取消和需要重启的状态。桌面菜单的重启端点要求 loopback Host 和 token，GET 状态提供令牌，POST 验证后安排 helper 启动；计划启动成功仍需回读实际宿主状态。标题子项可注册替代 provider，它取首条消息和会话模型进行辅助生成，格式按语言选择；停用时释放自身并尝试恢复官方注册，目标有歧义时跳过替换。输入预测关闭不代表标题辅助调用也关闭。希望只调整外观的用户需单独核对这些子项和浏览器历史。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:102-133](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/index.ts#L102-L133)

原生插件管理器安装与更新路径。

<details>
<summary>查看原文（32行）</summary>

```text
export function apply(ctx: Context): void {
  const host = hostServices(ctx)
  ctx.effect(() => {
    if (typeof ctx.on !== 'function') return () => {}
    return (ctx.on as (event: string, listener: (arg: unknown) => void) => () => void)('plugin-manager/install-state', (event: unknown) => {
      noteHostInstallState(event)
    })
  }, 'codex-ui: host plugin-manager install state')
  ctx.effect(() => {
    const disposeDependencies = host.webServer.register({
      kind: 'exact',
      path: dependenciesEndpoint,
      handler: async (request, response) => {
        if (!authenticateBusinessRequest(ctx, request, response)) return
        const url = new URL(request.url ?? '/', 'http://localhost')
        try {
          if (request.method === 'GET') {
            if (url.searchParams.get('action') === 'progress') {
              response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
              response.end(JSON.stringify({ progress: installProgressSnapshot() }))
              return
            }
            const dependencies = await dependencyStatuses(resolveDependencyRuntime(ctx))
            response.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
            response.end(JSON.stringify({ dependencies }))
            return
          }
          if (request.method === 'POST') {
            const runtime = resolveDependencyRuntime(ctx)
            const result = url.searchParams.get('action') === 'update-all'
              ? await updateAllDependencies(runtime)
              : await installDependency(url.searchParams.get('dependency'), runtime)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:153-170](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/index.ts#L153-L170)

返回结果、错误和 restartRequired。

<details>
<summary>查看原文（18行）</summary>

```text
            const sanitizedResults = result.results.map(item => ({
              ...item,
              ...(item.error !== undefined ? {
                error: {
                  ...item.error,
                  ...(item.error.message !== undefined ? { message: publicDependencyError(new Error(item.error.message)) } : {}),
                  ...(item.error.diagnostic !== undefined ? { diagnostic: publicDependencyError(new Error(item.error.diagnostic)) } : {}),
                },
              } : {}),
            }))
            response.writeHead(failed ? 503 : 200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
            response.end(JSON.stringify({
              ...result,
              results: sanitizedResults,
              restartRequired: result.results.some(item => item.application === 'restart-required' || item.restore?.application === 'restart-required'),
              autoReload: false,
              ...(failed && failureMessage !== undefined ? { error: publicDependencyError(new Error(failureMessage)) } : {}),
            }))
```

</details>

**依据 3 · 源码核查**：[src/desktop-menu-route.ts:150-200](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/desktop-menu-route.ts#L150-L200)

状态、loopback、令牌与重启安排。

<details>
<summary>查看原文（51行）</summary>

```text
    if (!hostIsLoopback(headerValue(request.headers, 'host'))) {
      sendJson(response, 403, { ok: false, error: 'forbidden' })
      return
    }

    const action = url.searchParams.get('action')

    if (action === null) {
      // 兼容旧调用方：只回答子插件是否启用。
      sendJson(response, 200, { enabled: !deps.isDisabled() })
      return
    }

    if (action === 'status') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        sendJson(response, 405, { ok: false, error: 'method' })
        return
      }
      sendJson(response, 200, statusView())
      return
    }

    if (action === 'restart') {
      if (request.method !== 'POST') {
        sendJson(response, 405, { ok: false, error: 'method' })
        return
      }
      if (!tokenMatches(token, headerValue(request.headers, CODEX_UI_RESTART_HEADER))) {
        sendJson(response, 403, { ok: false, error: 'bad-token' })
        return
      }
      const app = target()
      if (!app.canRestart) {
        sendJson(response, 409, {
          ok: false,
          error: 'unsupported',
          reason: unsupportedReason(app.platform, app.kind),
        })
        return
      }
      if (scheduledAt !== 0 && Date.now() - scheduledAt < scheduleTimeoutMs) {
        sendJson(response, 409, { ok: false, error: 'busy' })
        return
      }
      scheduledAt = Date.now()
      const outcome = spawnPlan(buildPlan(app, {
        ...paths,
        mainPid: deps.mainPid ?? process.ppid,
        hostPid: deps.hostPid ?? process.pid,
        bootId,
      }))
```

</details>

**依据 4 · 源码核查**：[src/session-title-lifecycle.ts:119-136](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/session-title-lifecycle.ts#L119-L136)

遇歧义跳过，注册替代标题。

<details>
<summary>查看原文（18行）</summary>

```text
          // 排空期间身份发生变化，安全恢复官方条目以防两边都不工作
          await restore()
          restore = undefined
          return
        }
      } else if (matches.length > 0 && enabledMatches.length === 0) {
        console.warn('[michengai-codex-ui] all official session title targets are already disabled; skipping takeover.')
        return
      } else if (matches.length > 1) {
        console.warn('[michengai-codex-ui] multiple official session title targets found; skipping takeover.')
        return
      }
    }
    if (!cancelled) {
      provider = registerSessionTitleProvider(host)
      if (provider) silencing = true
    }
    if (!provider) { await restore?.(); restore = undefined }
```

</details>

**依据 5 · 源码核查**：[src/session-title-lifecycle.ts:141-165](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/session-title-lifecycle.ts#L141-L165)

卸载本人注册并恢复官方入口。

<details>
<summary>查看原文（25行）</summary>

```text
    dispose: () => {
      cancelled = true
      silencing = false
      const sessionTitle = host.get?.('sessionTitle') as { registration?: { provider?: { id?: string }; closing?: boolean } } | undefined
      // 只有当前 registration 确实是由本实例注册的（id === SESSION_TITLE_PROVIDER_ID），才标记 closing，
      // 绝不误标记或删除第三方或官方的注册！
      if (sessionTitle?.registration?.provider?.id === SESSION_TITLE_PROVIDER_ID) {
        sessionTitle.registration.closing = true
      }
      return disposal ??= serialize(key, async () => {
        try {
          await ready.catch(() => {})
          await provider?.()
          provider = undefined
          if (sessionTitle?.registration?.provider?.id === SESSION_TITLE_PROVIDER_ID && sessionTitle.registration?.closing) {
            delete sessionTitle.registration
          }
        } finally {
          const guard = restoreGuard
          guard?.()
          try {
            await restore?.()
          } finally {
            restore = undefined
          }
```

</details>

**依据 6 · 源码核查**：[src/session-title-provider.ts:120-166](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/session-title-provider.ts#L120-L166)

从首条消息和会话模型路由生成标题。

<details>
<summary>查看原文（47行）</summary>

```text
export async function generateCodexSessionTitle(llm: TitleLlm, request: TitleRequest, locale: SessionTitleLocale = 'zh'): Promise<{ title: string; messageSeqs: number[]; model?: TitleRoute }> {
  request.signal?.throwIfAborted()
  const session = request.session
  if (session === undefined || shouldSkipAutoTitle(session)) throw new Error('codex-ui session title skipped')
  const first = request.messages?.[0]
  const text = first?.text?.trim() ?? ''
  if (first === undefined || text === '') throw new Error('codex-ui session title missing message')
  const route = request.route
  if (route === undefined || route.provider === '' || route.model === '') throw new Error('codex-ui session title missing route')
  const prompt = sessionTitlePrompt(locale)
  const framed = `${prompt.userFrame}\n${JSON.stringify([{ seq: first.seq, text }])}`
  if (Buffer.byteLength(framed, 'utf8') > MAX_INPUT_BYTES) throw new Error('codex-ui session title input too large')
  const signal = abortableSignal(request.signal)
  const messages = [{
    id: crypto.randomUUID(),
    role: 'user',
    content: [{ type: 'text', text: framed }],
    source: { kind: 'plugin', plugin: 'michengai-codex-ui' },
  }]
  let chunks: AsyncIterable<unknown>
  if (typeof llm.prepareCall === 'function') {
    const call = await llm.prepareCall({
      provider: route.provider,
      model: route.model,
      maxTokens: MAX_OUTPUT_TOKENS,
    }, signal, (controls, model) => ({
      ...controls,
      ...(model.reasoning?.efforts?.[0]?.id !== undefined ? { reasoningEffort: model.reasoning.efforts[0].id } : {}),
    }))
    chunks = call.stream({
      ...call.config,
      messages,
      system: prompt.system,
      sessionId: session.id,
      purpose: 'session-title',
      signal,
    })
  } else {
    chunks = llm.stream({
      provider: route.provider,
      model: route.model,
      messages,
      system: prompt.system,
      maxTokens: MAX_OUTPUT_TOKENS,
      sessionId: session.id,
      purpose: 'session-title',
      signal,
```

</details>

#### 缺口

- 未安装配套项或运行桌面重启与标题辅助
  **影响**：升级、恢复、服务身份和实际开销需实测
  **进一步探讨**：在可恢复测试 profile 核对进度、部分失败、重启和卸载后的标题路径

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证内存历史是否足够便利，并控制预测与配套副作用？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

用隔离浏览器与无敏感输入先测会话召回、草稿保护和禁用恢复。默认先从站点关闭预测，标题、依赖安装和桌面重启分别验收；实测移动键盘及自定义主题的重叠。可以比较内存历史与当前浏览器持久化，用重新加载前后的召回成功、耗时和敏感字段残留衡量。如果频繁丢失必要输入而隐私差异很小，或站点数据能充分隔离，内存模式不一定值得。发现历史串用、草稿丢失、请求量或退出状态不明时停止试用，回到原生输入，按需清除该站点的测试存储。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/composer/input-history.ts:11-44](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/composer/input-history.ts#L11-L44)

内存回退、容量和持久历史可作为对照。

<details>
<summary>查看原文（34行）</summary>

```text
  constructor(private readonly storage?: StorageFace, private readonly limit = 200, private readonly warn: (message: string) => void = console.warn) {
    try {
      const current = storage?.getItem(HISTORY_KEY)
      const raw = current ?? storage?.getItem(LEGACY_HISTORY_KEY)
      if (!raw) return
      if (raw.length > MAX_STORAGE_LENGTH) throw new Error('历史数据过大')
      const data: unknown = JSON.parse(raw)
      if (typeof data !== 'object' || data === null || Array.isArray(data)) throw new Error('历史格式无效')
      for (const [key, value] of Object.entries(data).slice(-MAX_SCOPES)) {
        if (Array.isArray(value)) this.scopes.set(key, value.filter((item): item is string => typeof item === 'string' && item.length <= 8_000).slice(-limit))
      }
      // 迁移后只写新键，保留旧数据供回退；已有新键时不重复导入。
      if (current === null || current === undefined) storage?.setItem(HISTORY_KEY, JSON.stringify(Object.fromEntries(this.scopes)))
    } catch { warn('输入历史读取失败，本次使用内存历史。') }
  }
  list(scope: string): readonly string[] { return this.scopes.get(scope) ?? [] }
  add(scope: string, text: string): void {
    if (!text.trim() || text.length > 8_000) return
    const previous = this.scopes.get(scope) ?? []
    if (previous.at(-1) === text) return
    this.scopes.delete(scope)
    this.scopes.set(scope, [...previous, text].slice(-this.limit))
    while (this.scopes.size > MAX_SCOPES) this.scopes.delete(this.scopes.keys().next().value!)
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
  }
```

</details>

**依据 2 · 源码核查**：[src/composer-plugin.ts:26-47](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/composer-plugin.ts#L26-L47)

站点可关闭额外预测。

<details>
<summary>查看原文（22行）</summary>

```text
/** 严格读取配置：只有显式 `false` 才关闭，其余（含未声明、类型错误）一律视为开启。 */
export function resolvePredictionAllowed(config: ComposerPluginConfig | undefined): boolean {
  if (config === null || typeof config !== 'object') return true
  return config.prediction !== false
}

/**
 * Composer 输入框增强子组件 (Host 侧)
 * 1. 暴露 /api/michengai/dsh-codex-ui/composer (启停状态 + 预测开关状态)
 * 2. 暴露 /composer/prediction 与 /composer/prediction/stream (流式预测)
 */
export function apply(ctx: Context, config?: ComposerPluginConfig): void {
  const statusEndpoint = CODEX_UI_API_ENDPOINTS.composer
  const predictionAllowed = resolvePredictionAllowed(config)

  // 1. 注册标准预测引擎（对齐成熟参考插件）；站点级关闭时完全不注册，也就不可能产生模型调用
  ctx.effect(() => {
    const disabled = isSubPluginDisabledOnDisk('codex-ui-composer', undefined, ctx)
    if (disabled || !predictionAllowed) return () => {}
    applyPredictions(ctx)
    return () => {}
  }, 'michengai-codex-ui: composer predictions engine')
```

</details>

**依据 3 · 源码核查**：[src/client/composer/InputHistoryDock.tsx:89-105](https://github.com/MichengAI/dsh-codex-ui/blob/c7435bb5ee3b2a09134de668155773827d1b5965/src/client/composer/InputHistoryDock.tsx#L89-L105)

宿主草稿和召回保护的边界。

<details>
<summary>查看原文（17行）</summary>

```text
      if (editor === undefined) return
      offKeys = bindHistoryKeys(editor, {
        draft: () => input.state.getSnapshot().draft,
        entries: () => history.list(scope),
        setDraft: text => input.setDraft(text),
        blocked: () => {
          const state = input.state.getSnapshot()
          return state.phase === 'adjudicating' || state.phase === 'submitting'
            || hasDraftAttachments(state) || state.occurrences.length > 0 || menu.getSnapshot().open
        },
      })
    }
    connect()
    const parent = anchor.current?.parentElement?.parentElement
    const observer = new MutationObserver(connect)
    if (parent !== null && parent !== undefined) observer.observe(parent, { childList: true, subtree: true })
    return () => { observer.disconnect(); offKeys(); offInput(); offEvents() }
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
