# dsh-keyboard-manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[6e4d700](https://github.com/Aafff623/dsh-keyboard-manager/tree/6e4d700ca56445a11d6c185efe9332c3680ad4d7)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aafff623/dsh-keyboard-manager)
<!-- END META -->

> **实现功能**：在 DSH Web 用可配置 Ctrl 快捷键切换左右栏与设置。

> **核心亮点**：把常用布局/设置动作合并成三个可配置快捷键，降低鼠标点击。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：Ctrl+S 除 better-sidebar panelHost 外全局先 preventDefault，即便动作 no-op 也吞原有保存行为；模拟单测对此有确认。详见[Q03](#research-q03)。

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
  - [Q01 · 哪些用户及场景获得什么增量？](#detail-section-11)
  - [Q02 · 按键、右侧栏和配置怎么路由？](#detail-section-12)
  - [Q03 · Ctrl+S 与编辑/浏览器保存有何冲突？](#detail-section-13)
  - [Q04 · 采用成本、验证与改进假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：键盘用户快速切换 DSH Web 面板。

鼠标点侧栏与设置按钮，或使用宿主原有快捷键；插件集中定义三个键位。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 全局按键监听 | 面板/设置导航 | Ctrl+S 误拦截 |
| 配置路由 | 自定义物理键 | 失败回默认 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 不满足时 |
| --- | --- | --- |
| DSH Web layout/DOM | 侧栏与设置动作 | no-op/误路由 |
| host webServer | 配置传输 | 回退默认键 |
| better-sidebar 可选 | 右栏插件路径 | 回退原生详情 |


#### 使用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 配置 | 检查现有保存键/改键 | 无关键冲突 |
| 安装 | 添加 bundle/刷新 | 三键目标正确 |
| 测试 | 输入框/编辑器/面板矩阵 | 保存不被误拦截 |
| 退出 | 停用 | document listener 清理 |

**效果与成本**

#### 成本

| 阶段 | 资源/人工 | 边界 |
| --- | --- | --- |
| 安装 | profile 加 bundle、刷新 | 宿主 DOM 兼容 |
| 使用 | 一个 listener/一次 config fetch | 原保存键冲突 |
| 维护 | 重映射和 UI 改版检查 | 需跨焦点验收 |


#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 面板导航 | 三动作路由 | 真实 UI 命中 |
| 配置 | JSON 路由与热替换 | 部署读取成功 |
| 保存键让路 | better-sidebar 内 | 其它编辑器冲突 |

> **思考**：Ctrl+S 除 better-sidebar panelHost 外全局先 preventDefault，即便动作 no-op 也吞原有保存行为；模拟单测对此有确认。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把常用布局/设置动作合并成三个可配置快捷键，降低鼠标点击。详见[Q01](#research-q01)、[Q02](#research-q02)。

把常用布局/设置动作合并成三个可配置快捷键，降低鼠标点击。详见[Q01](#research-q01)、[Q02](#research-q02)。

客户端捕获阶段全局监听，动作依赖 DOM 标记；host 提供配置快照。配置拉取失败默认键，不会停止 Ctrl+S 拦截。

<a id="detail-section-5"></a>

### 1.4 主要限制

Ctrl+S 除 better-sidebar panelHost 外全局先 preventDefault，即便动作 no-op 也吞原有保存行为；模拟单测对此有确认。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，优先避免默认 Ctrl+S 或仅隔离试用；在编辑界面核保存键后再常用。详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

动作及配置逻辑可静态核查；Ctrl+S 在普通编辑目标和无设置按钮时也 preventDefault，真实宿主冲突未实测。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、package.json、src/index.ts、src/config.ts、src/client/index.ts、test/keyboard-manager.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版静态阅读 README、package、host/client TypeScript 与模拟 DOM 单测；未运行目标插件或真实 Web。
- 下一步：用真实 Web 在无面板、有面板、文本/富文本编辑器、better-sidebar、不同浏览器中记录动作及 defaultPrevented。

**分析版本**

- **仓库**：[Aafff623/dsh-keyboard-manager](https://github.com/Aafff623/dsh-keyboard-manager)
- **版本号**：0.2.0（[固定提交 6e4d700](https://github.com/Aafff623/dsh-keyboard-manager/tree/6e4d700ca56445a11d6c185efe9332c3680ad4d7)）
- **版本日期**：2026-09-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先判断焦点/目标有效再拦截，并让可编辑目标保存键优先；以多页面矩阵检验误拦截，现版未实现。详见[Q04](#research-q04)。

用真实 Web 在无面板、有面板、文本/富文本编辑器、better-sidebar、不同浏览器中记录动作及 defaultPrevented。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 283 | — | — | 2436 |
| .mjs | source | 1 | 55 | 35 | 14 | — |
| .js | source | 2 | 199 | 189 | 5 | — |
| .ts | source | 3 | 255 | 189 | 40 | — |
| .mjs | test | 1 | 443 | 394 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Aafff623/dsh-keyboard-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Aafff623/dsh-keyboard-manager/issues?q=is%3Aissue+created%3A2026-09-22T05%3A38%3A33.318Z..2026-10-22T05%3A38%3A33.318Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Aafff623/dsh-keyboard-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A38%3A33.318Z..2026-10-22T05%3A38%3A33.318Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核实三键快捷路由、配置传输、焦点冲突与使用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些用户及场景获得什么增量？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

面向频繁切换 DSH Web 侧栏、右详情/插件栏和设置页的键盘用户。默认 Ctrl+Q 左侧栏、Ctrl+E 右侧栏、Ctrl+S 设置，可在 profile 以物理 KeyboardEvent.code 改键。相对鼠标点击对应 UI，它提供一个捕获阶段监听器和配置映射；不是模型工具或业务自动化。README 声称不抢输入事件，但源码只排除 IME、重复、已 preventDefault，以及 Ctrl+S 在 better-sidebar 面板内，普通编辑目标并未豁免。合格体验需按键可预期且不吞编辑器/浏览器原有保存键，并在 UI 消失时不劫持快捷键。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:18-33](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/README.zh-CN.md#L18-L33)

作者列三个默认键位及宣称的行为边界。

<details>
<summary>查看原文（16行）</summary>

```text
为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）Web UI 提供快捷键 —— 一个监听器，三个聚焦的快捷键，并且会根据当前实际存在的右侧面板选择原生路径或插件路径。

## 快捷键

| 按键 | 功能 |
|---|---|
| `Ctrl+Q` | 切换 DSH 原生左侧栏 |
| `Ctrl+E` | 切换右侧栏：安装了 [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) 时控制 Files / git / terminal / browser 等插件面板，否则控制原生会话详情栏 |
| `Ctrl+S` | 打开 / 关闭设置面板 |

### 行为边界

- **只匹配严格组合键**：必须是单独的 `Ctrl`，带 `Cmd` / `Shift` / `Alt` 时不触发；`Cmd` 组合保留给浏览器或操作系统。
- **不抢页面事件**：IME 输入、按键自动重复、已经被其他监听器消费的事件都会让路。
- **`Ctrl+S` 让给 better-sidebar 编辑器**：焦点位于插件面板内时，交给它自己的 `Ctrl/Cmd+S` 保存逻辑。
- **`Ctrl+E` 需要已选中会话**：插件面板和原生详情栏都是会话级界面。
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:30-55](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/client/index.ts#L30-L55)

默认键位与自定义物理键码校验。

<details>
<summary>查看原文（26行）</summary>

```text
export const defaultKeymap: Readonly<ResolvedKeymap> = Object.freeze({
  sidebar: 'KeyQ',
  rightPanel: 'KeyE',
  settings: 'KeyS',
})

/** Stable DOM selectors used by this plugin's integration contract. */
export const SELECTORS = Object.freeze({
  betterSidebarCluster: '[data-dsh-toggle-cluster]',
  shellOverlay: '[data-shell-overlay]',
  settingsTrigger: 'button[aria-haspopup="dialog"]',
  panelHost: '[data-dsh-panel-host]',
  detailsCollapsed: 'data-details-collapsed',
})

function resolveKeymap(config?: KeymapConfig): typeof defaultKeymap {
  const valid = (value: string | undefined, fallback: string): string =>
    typeof value === 'string' && /^[A-Z][A-Za-z0-9]+$/.test(value) ? value : fallback
  const keymap = {
    sidebar: valid(config?.sidebar, defaultKeymap.sidebar),
    rightPanel: valid(config?.rightPanel, defaultKeymap.rightPanel),
    settings: valid(config?.settings, defaultKeymap.settings),
  }
  const values = Object.values(keymap)
  return new Set(values).size === values.length ? keymap : defaultKeymap
}
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:99-125](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/client/index.ts#L99-L125)

三动作实际映射。

<details>
<summary>查看原文（27行）</summary>

```text
function createChords(keymap: typeof defaultKeymap): Readonly<Record<string, ChordAction>> {
  return {
    [keymap.sidebar]: (ctx) => ctx.layout.toggleSidebar(),
    [keymap.rightPanel]: (ctx, doc) => {
      const cluster = doc.querySelector(SELECTORS.betterSidebarCluster)
      if (cluster) {
        const buttons = cluster.querySelectorAll('button')
        let toggle: HTMLButtonElement | null = null
        for (const button of [...buttons].reverse() as HTMLButtonElement[]) {
          if (isValidRightPanelToggle(button)) {
            toggle = button
            break
          }
        }
        // Compatibility fallback for current dsh-better-sidebar releases.
        if (!toggle) toggle = buttons[buttons.length - 1] as HTMLButtonElement | undefined ?? null
        if (!toggle || toggle.disabled) return
        toggle.click()
        return
      }
      const frame = findFrame(doc)
      if (!frame) return
      if (frame.hasAttribute(SELECTORS.detailsCollapsed)) ctx.layout.openDetails()
      else ctx.layout.closeDetails()
    },
    [keymap.settings]: (_ctx, doc) => toggleSettings(doc),
  }
```

</details>

#### 缺口

- 未在真实 Web UI 和不同平台键盘布局试用。
  **影响：**无法证明快捷键易用性或浏览器/编辑器兼容。
  **进一步探讨：**在 Windows/macOS/Linux 浏览器对输入框、插件编辑器和无会话页面测试。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 按键、右侧栏和配置怎么路由？

**研究主题：**功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

客户端注册 document capture keydown，只认单独 Ctrl、非组合/重复/已处理事件，以 event.code 选动作。左侧栏调用 layout.toggleSidebar；右侧栏先查 better-sidebar 的按钮组并从末尾找标记为 right 的按钮，找不到时用末按钮兜底；无插件时通过 shell overlay 属性判断原生详情栏开合；设置用找到的按钮 click 或派发 document Escape。host 半在 exact JSON 路由暴露启动时配置，客户端未获直接 config 时启动一次 fetch；失败保持默认，异步返回则热替换映射。冲突键码/不合法键码整体回退默认，配置修改须宿主重启与页面刷新。此设计依赖 DSH layout 服务、DOM data 属性和可见设置按钮，而非稳定公开的快捷键注册中心；只有固定源码和模拟 DOM 单测，宿主实际 DOM 改版需再验。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:34-52](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/index.ts#L34-L52)

配置 JSON exact 路由与启动时快照。

<details>
<summary>查看原文（19行）</summary>

```text
type HostContext = Context & { get(name: string, strict?: boolean): unknown }

export function apply(ctx: HostContext, config?: KeymapConfig): void {
  const webServer = ctx.get('webServer') as WebServerFace | undefined
  if (!webServer) return
  const body = JSON.stringify(config ?? {})
  ctx.effect(
    () => webServer.register({
      kind: 'exact',
      path: configRoutePath,
      handler: (_req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Cache-Control', 'no-store')
        res.end(body)
      },
    }),
    'keyboard-manager: keymap config route',
  )
}
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:36-80](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/client/index.ts#L36-L80)

DOM 标记、键码校验及设置按钮定位。

<details>
<summary>查看原文（45行）</summary>

```text
/** Stable DOM selectors used by this plugin's integration contract. */
export const SELECTORS = Object.freeze({
  betterSidebarCluster: '[data-dsh-toggle-cluster]',
  shellOverlay: '[data-shell-overlay]',
  settingsTrigger: 'button[aria-haspopup="dialog"]',
  panelHost: '[data-dsh-panel-host]',
  detailsCollapsed: 'data-details-collapsed',
})

function resolveKeymap(config?: KeymapConfig): typeof defaultKeymap {
  const valid = (value: string | undefined, fallback: string): string =>
    typeof value === 'string' && /^[A-Z][A-Za-z0-9]+$/.test(value) ? value : fallback
  const keymap = {
    sidebar: valid(config?.sidebar, defaultKeymap.sidebar),
    rightPanel: valid(config?.rightPanel, defaultKeymap.rightPanel),
    settings: valid(config?.settings, defaultKeymap.settings),
  }
  const values = Object.values(keymap)
  return new Set(values).size === values.length ? keymap : defaultKeymap
}

function getAttribute(element: Element, name: string): string | null {
  return typeof element.getAttribute === 'function' ? element.getAttribute(name) : null
}

function isValidRightPanelToggle(button: HTMLButtonElement): boolean {
  if (button.disabled) return false
  if (/right/i.test(getAttribute(button, 'aria-label') ?? '')) return true
  return /right/i.test(getAttribute(button, 'data-panel') ?? '')
}

function insideBetterSidebar(event: KeyboardEvent): boolean {
  const target = (event as { target?: Element | null }).target
  if (!target || typeof target.closest !== 'function') return false
  return target.closest(SELECTORS.panelHost) !== null
}

function findFrame(doc: Document): HTMLElement | null {
  const anchor = doc.querySelector(SELECTORS.shellOverlay) as HTMLElement | null
  return anchor?.parentElement ?? null
}

function findSettingsTrigger(doc: Document): HTMLButtonElement | null {
  const frame = findFrame(doc)
  return frame?.querySelector(SELECTORS.settingsTrigger) as HTMLButtonElement | null
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:99-125](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/client/index.ts#L99-L125)

原生/插件右栏和设置动作选择。

<details>
<summary>查看原文（27行）</summary>

```text
function createChords(keymap: typeof defaultKeymap): Readonly<Record<string, ChordAction>> {
  return {
    [keymap.sidebar]: (ctx) => ctx.layout.toggleSidebar(),
    [keymap.rightPanel]: (ctx, doc) => {
      const cluster = doc.querySelector(SELECTORS.betterSidebarCluster)
      if (cluster) {
        const buttons = cluster.querySelectorAll('button')
        let toggle: HTMLButtonElement | null = null
        for (const button of [...buttons].reverse() as HTMLButtonElement[]) {
          if (isValidRightPanelToggle(button)) {
            toggle = button
            break
          }
        }
        // Compatibility fallback for current dsh-better-sidebar releases.
        if (!toggle) toggle = buttons[buttons.length - 1] as HTMLButtonElement | undefined ?? null
        if (!toggle || toggle.disabled) return
        toggle.click()
        return
      }
      const frame = findFrame(doc)
      if (!frame) return
      if (frame.hasAttribute(SELECTORS.detailsCollapsed)) ctx.layout.openDetails()
      else ctx.layout.closeDetails()
    },
    [keymap.settings]: (_ctx, doc) => toggleSettings(doc),
  }
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:128-181](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/client/index.ts#L128-L181)

单独 Ctrl、配置拉取和 capture listener 生命周期。

<details>
<summary>查看原文（54行）</summary>

```text
function isPlainCtrl(event: KeyboardEvent): boolean {
  return event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey
}

export const inject = ['layout']

/**
 * Fetch the keymap overrides the node half serves. Returns `null` on any
 * failure — missing fetch (test sandbox), failed request, malformed body —
 * so the caller simply keeps whatever keymap is already in effect.
 */
async function pullKeymap(): Promise<KeymapConfig | null> {
  try {
    const retrieve = globalThis.fetch
    if (typeof retrieve !== 'function') return null
    const response = await retrieve(configRoutePath)
    if (!response.ok) return null
    const overrides: unknown = await response.json()
    return overrides !== null && typeof overrides === 'object' ? overrides as KeymapConfig : null
  } catch {
    return null
  }
}

export function apply(ctx: ClientContext, config?: KeymapConfig): void {
  // Mutable so a late-pulled config hot-swaps the bindings without rebinding
  // the document listener.
  let keymap = resolveKeymap(config)
  let chords = createChords(keymap)
  ctx.effect(() => {
    let disposed = false
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.isComposing || event.repeat || event.defaultPrevented) return
      const action = chords[event.code]
      if (!action || !isPlainCtrl(event)) return
      if (event.code === keymap.settings && insideBetterSidebar(event)) return
      event.preventDefault()
      action(ctx, document)
    }
    document.addEventListener('keydown', onKeyDown, true)
    // dsh mounts client halves without plugin config, so when the direct
    // argument is empty the served keymap is the only real source.
    if (config === undefined) {
      void pullKeymap().then((overrides) => {
        if (disposed || overrides === null) return
        keymap = resolveKeymap(overrides)
        chords = createChords(keymap)
      })
    }
    return () => {
      disposed = true
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, 'keyboard-manager: configurable sidebar, right panel, and settings chords')
```

</details>

#### 缺口

- 未在目标 DSH 版本/可选 better-sidebar 版本对照 DOM。
  **影响：**某个 DOM 标记变更可能静默 no-op 或点错末按钮。
  **进一步探讨：**在有/无 better-sidebar 与无会话/已选会话下手动验键位和目标。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Ctrl+S 与编辑/浏览器保存有何冲突？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

明显冲突。onKeyDown 在找到对应 chord 且单独 Ctrl 后，除了事件目标位于 [data-dsh-panel-host] 的 Ctrl+S 情况，先调用 preventDefault 再执行动作。未检查 input、textarea、contenteditable 或其它编辑器容器；因此在这些位置按 Ctrl+S 会阻止原生/应用保存并试图打开设置。即使 shell frame 或设置按钮不存在，toggleSettings 会静默返回，但 preventDefault 已发生。作者单测明确把“没有 frame 时无动作且 defaultPrevented=true”写成预期，因此不是偶然无法观察的边界。另 Ctrl+Q/E 也会覆盖页面/浏览器可能使用的相应组合键；实际冲突取决于平台和焦点。本轮只据静态控制流和测试，不声称已经造成用户数据丢失。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:83-97](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/client/index.ts#L83-L97)

设置目标不存在或不可见时直接返回。

<details>
<summary>查看原文（15行）</summary>

```text
function toggleSettings(doc: Document): void {
  const trigger = findSettingsTrigger(doc)
  if (!trigger || trigger.disabled) return
  if ('offsetParent' in trigger && trigger.offsetParent === null) return
  if (getAttribute(trigger, 'aria-expanded') === 'true') {
    doc.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      cancelable: true,
      bubbles: true,
    }))
  } else {
    trigger.click()
  }
}
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:157-167](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/client/index.ts#L157-L167)

仅 better-sidebar panelHost 豁免，其余先 preventDefault。

<details>
<summary>查看原文（11行）</summary>

```text
  ctx.effect(() => {
    let disposed = false
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.isComposing || event.repeat || event.defaultPrevented) return
      const action = chords[event.code]
      if (!action || !isPlainCtrl(event)) return
      if (event.code === keymap.settings && insideBetterSidebar(event)) return
      event.preventDefault()
      action(ctx, document)
    }
    document.addEventListener('keydown', onKeyDown, true)
```

</details>

**依据 3 · 源码核查**：[test/keyboard-manager.test.mjs:227-257](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/test/keyboard-manager.test.mjs#L227-L257)

单测断言没有 frame 时仍 defaultPrevented，better-sidebar 内则让路。

<details>
<summary>查看原文（31行）</summary>

```text
test('Ctrl+S opens Settings by clicking the sidebar trigger', () => {
  const harness = loadPlugin({ settingsOpen: false })
  const event = harness.dispatch({ code: 'KeyS' })
  assert.equal(harness.dom.settingsTrigger.clicks, 1)
  assert.equal(harness.dom.dispatched.length, 0)
  assert.equal(event.defaultPrevented, true)
})

test('Ctrl+S closes an open Settings modal via a document-level Escape', () => {
  const harness = loadPlugin({ settingsOpen: true })
  const event = harness.dispatch({ code: 'KeyS' })
  assert.equal(harness.dom.settingsTrigger.clicks, 0)
  assert.equal(harness.dom.dispatched.length, 1)
  assert.equal(harness.dom.dispatched[0].key, 'Escape')
  assert.equal(event.defaultPrevented, true)
})

test('Ctrl+S without a frame anchor stays a silent no-op', () => {
  const harness = loadPlugin({ withDom: false })
  const event = harness.dispatch({ code: 'KeyS' })
  assert.equal(harness.dom.settingsTrigger.clicks, 0)
  assert.equal(harness.dom.dispatched.length, 0)
  assert.equal(event.defaultPrevented, true)
})

test('Ctrl+S inside the better-sidebar surface yields to the editor save', () => {
  const harness = loadPlugin({ settingsOpen: false, betterSidebar: true })
  const event = harness.dispatch({ code: 'KeyS', target: targetInsideBetterSidebar() })
  assert.equal(event.defaultPrevented, false)
  assert.equal(harness.dom.settingsTrigger.clicks, 0)
  assert.equal(harness.dom.dispatched.length, 0)
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用成本、验证与改进假设？

**研究主题：**效果与总成本、采用判断、新假设与验证

#### 完整回答

安装是 Web bundle 并需刷新；用户要检查现有快捷键习惯、编辑器保存路径以及重映射与浏览器保留键是否冲突。性能成本低（一个监听器和一次配置 fetch），维护成本来自 DSH UI/可选 better-sidebar DOM 标记变化。当前建议观察，只有愿意避开 Ctrl+S 保存冲突的用户可在隔离 profile 试用，不能把“静默 no-op”视为未拦截。未实现的改进假设是仅在动作目标存在且可执行时 preventDefault，并对可编辑目标默认让路或显式配置；用输入框、富文本、文件编辑器、better-sidebar、无面板与设置开关矩阵测动作命中率和保存键误拦截。若保存误拦截不能归零，则应重选默认设置快捷键。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:39-78](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/README.zh-CN.md#L39-L78)

安装、物理键码覆盖及配置传输说明。

<details>
<summary>查看原文（40行）</summary>

````text
## 安装

默认是 `Ctrl+Q` / `Ctrl+E` / `Ctrl+S`。物理键码可在 profile 补丁里覆盖，见下方「快捷键配置」。

```sh
dsh plugin --profile web add github:Aafff623/dsh-keyboard-manager
```

安装后硬刷新浏览器（`Ctrl+Shift+R`）。`dsh.bundle.patch` 会把插件加入 profile bundle，不需要改 profile 文件。

`lib/` 是有意提交入库的：git 安装无需构建。改 `src/` 后执行 `npm run build`，并把刷新后的 `lib/` 一起提交；CI 会检查是否过期。

## 它是怎么工作的

DSH 的 layout service 提供了动作，但不提供状态读取；设置模态框的开关状态也只存在于组件内部。因此插件使用**稳定的 DOM 标记和界面自身的按钮**，不碰 React 内部状态，也不依赖哈希 CSS 类名。标记不存在时会静默 no-op，不会误触发。

<p align="center">
  <img src="./assets/readme/zh/flow.svg" width="100%" alt="一个捕获阶段 keydown 监听器校验严格 Ctrl 快捷键，检测当前面板，并调用原生服务或插件自己的按钮。">
</p>

- **`Ctrl+Q`**：直接调用 `ctx.layout.toggleSidebar()`。
- **`Ctrl+E`**：检测到 dsh-better-sidebar 时，点击 `[data-dsh-toggle-cluster]` 里的右侧栏开关（优先 `aria-label` / `data-panel` 含 `right` 的按钮，否则用最后一个）；没有插件时，调用 `ctx.layout.openDetails()/closeDetails()`，并通过 `[data-shell-overlay]` 读取 `data-details-collapsed` 判断方向。
- **`Ctrl+S`**：打开时点击侧栏设置按钮；关闭时派发带 `code: Escape` 的 document 级别 `Escape`，复用设置面板自己的关闭路径。

### 快捷键配置

默认绑定为 `KeyQ`、`KeyE`、`KeyS`。三个物理键码都可通过插件配置覆盖：

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml（profile 自己的补丁层）
- id: dsh-keyboard-manager
  config:
    sidebar: KeyQ
    rightPanel: KeyE
    settings: KeyS
```

配置会校验键码格式（`/^[A-Z][A-Za-z0-9]+$/`），并拒绝重复键码；无效配置回落到默认值。改完重启 `dsh` 并刷新页面生效。

**配置如何到达浏览器**：DSH 的 web 启动流程挂载客户端半区时不传插件配置（`loader.create({ name })`），浏览器端 `apply` 的第二个参数永远是 `undefined`。因此 node 半边把配置以 JSON 形式挂在 `/plugin-config/dsh-keyboard-manager` 路由上，浏览器半边激活后拉取一次并热更新绑定；拉取失败或无头 profile 下保持默认键位，不影响使用。
````

</details>

**依据 2 · 源码核查**：[src/client/index.ts:157-181](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/client/index.ts#L157-L181)

单监听器、配置热替换与卸载清理。

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.effect(() => {
    let disposed = false
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.isComposing || event.repeat || event.defaultPrevented) return
      const action = chords[event.code]
      if (!action || !isPlainCtrl(event)) return
      if (event.code === keymap.settings && insideBetterSidebar(event)) return
      event.preventDefault()
      action(ctx, document)
    }
    document.addEventListener('keydown', onKeyDown, true)
    // dsh mounts client halves without plugin config, so when the direct
    // argument is empty the served keymap is the only real source.
    if (config === undefined) {
      void pullKeymap().then((overrides) => {
        if (disposed || overrides === null) return
        keymap = resolveKeymap(overrides)
        chords = createChords(keymap)
      })
    }
    return () => {
      disposed = true
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, 'keyboard-manager: configurable sidebar, right panel, and settings chords')
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:83-125](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/client/index.ts#L83-L125)

改进对照所需的动作目标分支。

<details>
<summary>查看原文（43行）</summary>

```text
function toggleSettings(doc: Document): void {
  const trigger = findSettingsTrigger(doc)
  if (!trigger || trigger.disabled) return
  if ('offsetParent' in trigger && trigger.offsetParent === null) return
  if (getAttribute(trigger, 'aria-expanded') === 'true') {
    doc.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      cancelable: true,
      bubbles: true,
    }))
  } else {
    trigger.click()
  }
}

function createChords(keymap: typeof defaultKeymap): Readonly<Record<string, ChordAction>> {
  return {
    [keymap.sidebar]: (ctx) => ctx.layout.toggleSidebar(),
    [keymap.rightPanel]: (ctx, doc) => {
      const cluster = doc.querySelector(SELECTORS.betterSidebarCluster)
      if (cluster) {
        const buttons = cluster.querySelectorAll('button')
        let toggle: HTMLButtonElement | null = null
        for (const button of [...buttons].reverse() as HTMLButtonElement[]) {
          if (isValidRightPanelToggle(button)) {
            toggle = button
            break
          }
        }
        // Compatibility fallback for current dsh-better-sidebar releases.
        if (!toggle) toggle = buttons[buttons.length - 1] as HTMLButtonElement | undefined ?? null
        if (!toggle || toggle.disabled) return
        toggle.click()
        return
      }
      const frame = findFrame(doc)
      if (!frame) return
      if (frame.hasAttribute(SELECTORS.detailsCollapsed)) ctx.layout.openDetails()
      else ctx.layout.closeDetails()
    },
    [keymap.settings]: (_ctx, doc) => toggleSettings(doc),
  }
```

</details>

#### 缺口

- 无真实用户/编辑器/浏览器快捷键冲突测量。
  **影响：**不能量化便利与误拦截比例。
  **进一步探讨：**隔离 Web profile 按焦点和布局矩阵记录 defaultPrevented、保存结果和动作。
- 目标有效性/编辑焦点门控未实现。
  **影响：**改进方案不能算现有保护。
  **进一步探讨：**原型化后与现版比较保存误拦截和快捷动作命中。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
