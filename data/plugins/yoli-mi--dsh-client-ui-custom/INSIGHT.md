# 客制化 DSH

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[edf1ef7](https://github.com/yoli-mi/dsh-client-ui-custom/tree/edf1ef701e360577ddde1a5c6d79fdce17a1744e)

<!-- BEGIN META -->
[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yoli-mi/dsh-client-ui-custom) [![npm 30d 134](https://img.shields.io/static/v1?label=npm+30d&message=134&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ha-na-bi/dsh-client-ui-custom) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ha-na-bi/dsh-client-ui-custom)
<!-- END META -->

> **功能**：为 DSH Web 添加外观、快捷键、用量和动效等可选界面模块。

> **亮点**：[Q01](#research-q01) 将常用操作放到组合键，[Q02](#research-q02) 提供按功能启用的宿主配置。

> **主要限制**：[Q03](#research-q03) 的全局捕获可能与已有组合键争用。动作失败可静默，用户需要核实际结果。

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
  - [Q01 · 哪类 DSH Web 操作能因快捷键和外观受益？](#detail-section-11)
  - [Q02 · 宿主设置怎样驱动浏览器模块？](#detail-section-12)
  - [Q03 · 全局键盘与样式有哪些成本和退出条件？](#detail-section-13)
  - [Q04 · 怎样验证减少操作且不误发？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向频繁新建会话和切换模型的 DSH Web 用户，提供快捷动作与外观调节。

对照原生按钮、设置和键盘输入，检查实际选中模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 快捷操作 | 新建会话及选模型 | 核冲突与实际结果 |
| 外观 | 调整样式和对比度 | 自定义 CSS 需核恢复 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、settings 和主题服务 | 必需 | 加载功能和设置 | 查看命名空间是否就绪 |
| 无冲突按键 | 快捷键需要 | 派发目标动作 | 使用原生按钮 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选隔离配置及单功能 | 先保留默认输入 |
| 验证 | 用户试键并核实际目标 | 检查输入法和冲突 |
| 退出 | 移除绑定或重载 | 回默认外观与操作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 环境未知 | 核键位和界面 | 真实宿主未验 |
| 持续 | 浏览器资源未知 | 检查版本与行为 | 静默失败需读回 |
| 恢复 | 重载开销未知 | 去冲突、还原外观 | 保留原生入口 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 快捷动作 | 捕获、派发和移除 | 实际节时与误触 |
| 外观 | 根样式变量和设置 | 组合主题退出 |

> **思考**：[Q03](#research-q03) 的全局捕获可能与已有组合键争用。动作失败可静默，用户需要核实际结果。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将常用操作放到组合键，[Q02](#research-q02) 提供按功能启用的宿主配置。

[Q02](#research-q02) 等设置快照后注册功能，并在配置更新时先撤旧监听。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的全局捕获可能与已有组合键争用。动作失败可静默，用户需要核实际结果。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 从一个非发送类动作开始，回查会话和模型。按键或外观冲突时恢复原生设置。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持实际设置、样式和快捷键，真实宿主交互未验。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/index.ts、src/index.ts、src/client/shortcuts.ts、src/client/apply.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定设置、外观和快捷键代表路径，未覆盖全部模块或运行宿主。
- 下一步：按 [Q04](#research-q04) 比较按键与原生按钮，核错选、误发和退出。

**分析版本**

- **仓库**：[yoli-mi/dsh-client-ui-custom](https://github.com/yoli-mi/dsh-client-ui-custom)
- **版本号**：0.1.0-rc.7（[固定提交 edf1ef7](https://github.com/yoli-mi/dsh-client-ui-custom/tree/edf1ef701e360577ddde1a5c6d79fdce17a1744e)）
- **版本日期**：2026-09-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对照按钮与快捷键，并加入输入法和冲突键负例。

按 [Q04](#research-q04) 比较按键与原生按钮，核错选、误发和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 52 | 13508 | 11103 | 2831 | — |
| .md | source | 1 | 694 | — | — | 5445 |
| .mjs | source | 1 | 25 | 16 | 6 | — |
| .ts | source | 34 | 6211 | 4215 | 1623 | — |
| .tsx | source | 16 | 2565 | 2112 | 320 | — |
| .ts | test | 11 | 2200 | 1827 | 182 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/yoli-mi/dsh-client-ui-custom/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH Web 客制化怎样改变外观和快捷操作，哪些副作用影响试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类 DSH Web 操作能因快捷键和外观受益？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

频繁新建会话、切模型，或需要在当前界面改变字号和对比度的 DSH Web 用户，可以把重复点击改成键盘动作，把界面调整留在设置。相较原生按钮和主题，固定客户端捕获预设的组合键后直接派发动作，命中后消耗事件。它不会证明操作本身已经成功，因为动作失败被静默捕获。只偶尔切模型时保留原生按钮更容易确认目标。合格结果须核实际会话和模型，不能只凭按键后没有反馈。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-24](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/README.md#L17-L24)

作者描述功能集合。

```text
Dsh-client-ui-custom 是一个纯前端插件，它为用户提供了浮动历史记录条、用户消息md渲染、外观调试、插件市场、快捷键、用量统计和动效功能。

- **修改了通用设置项** —— 在「设置 → 通用」里新增了历史记录条（位置、数量）和用户消息 Markdown 渲染开关；
- **修改了插件项** —— 在「设置 → 插件」里新增了「插件市场」；
- **新增了四个设置页** —— 「外观」「快捷键」「用量统计」「动效」。

所有功能默认关闭，不配置时保持与原生界面一致，全程零 shell 改动。

```

**依据 2 · 源码核查**：[src/client/index.ts:107-144](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/src/client/index.ts#L107-L144)

捕获按键，标准动作先于直达模型，失败静默。

<details>
<summary>查看原文（38行）</summary>

```text
function installShortcuts(
  ctx: ClientContext,
  shortcuts: ShortcutConfig,
  disabledActions: ReadonlySet<ShortcutAction> = new Set(),
): () => void {
  const combos = buildShortcutMap(shortcuts)
  // Only dispatcher actions dispatch; sendMessage/newline are composer remaps.
  const actions = (Object.keys(SHORTCUT_HANDLERS) as (keyof typeof SHORTCUT_HANDLERS)[])
    .filter((action) => !disabledActions.has(action))
  const modelShortcuts = shortcuts.modelShortcuts
    .map(entry => ({ entry, combo: parseKeyCombo(entry.combo) }))
    .filter((item): item is { entry: ModelShortcut; combo: KeyCombo } => item.combo !== null)
  const enabled = actions.some((action) => comboEnabled(combos[action])) || modelShortcuts.length > 0
  if (!enabled) return () => {}
  const handler = (event: KeyboardEvent): void => {
    // Don't hijack plain typing: combos without Mod are suppressed while an
    // editable field has focus; Mod combos still fire.
    if (isEditableTarget(event.target) && !(event.ctrlKey || event.metaKey)) return
    for (const action of actions) {
      const combo = combos[action]
      if (combo === null || !matchesKeyCombo(combo, event)) continue
      event.preventDefault()
      event.stopPropagation()
      const handler = SHORTCUT_HANDLERS[action]
      if (handler === undefined) continue
      void Promise.resolve(handler(ctx, shortcuts)).catch(() => { /* action failure is silent */ })
      return
    }
    for (const { entry, combo } of modelShortcuts) {
      if (!matchesKeyCombo(combo, event)) continue
      event.preventDefault()
      event.stopPropagation()
      void Promise.resolve(selectModelDirect(ctx, entry.provider, entry.model)).catch(() => { /* action failure is silent */ })
      return
    }
  }
  window.addEventListener('keydown', handler, true)
  return () => window.removeEventListener('keydown', handler, true)
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:350-361](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/src/client/index.ts#L350-L361)

实际外观面板挂载。

<details>
<summary>查看原文（12行）</summary>

```text
    ctx.slots.inject('settings.section', () => ctx.slots.register({
      name: 'settings.section',
      id: 'appearance',
      order: 10,
      label: () => appearanceT('nav'),
      locale: APPEARANCE_NS,
      children: { 'settings.appearance.item': { kind: 'list', scope: 'root' } },
      inject: (): AppearanceInjected => ({
        hooks: { appearance: appearance.store },
        ...appearanceActions,
      }),
    }, AppearanceSection))
```

</details>

#### 缺口

- 用户的重复操作频率和成功率未测。
  **影响**：不能把按键数量换算为效率收益。
  **进一步探讨**：对照同一组新会话和模型选择操作。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主设置怎样驱动浏览器模块？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

宿主入口注入 settings 后注册基础命名空间，浏览器绑定这个 scope，等首份 ready 快照才注册受功能列表控制的入口。外观不在允许列表时不执行主题写入。快捷键从运行设置取值，变更先移除旧监听，再装派发和输入框重映射。使用量面板未挂载则不会派发对应快捷动作。卸载显式释放监听、订阅和外观控制器。首份设置到达时间与宿主版本会影响入口出现，不能从页面未立刻出现判断功能缺失。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:141-158](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/src/index.ts#L141-L158)

宿主实际设置注册。

<details>
<summary>查看原文（18行）</summary>

```text
export function apply(ctx: Context, config?: UiCustomConfig): void {
  ctx.inject(['settings'], (settingsCtx) => {
    const shortcuts = config?.shortcuts
    settingsCtx.settings.register(settingsNamespace(UI_CUSTOM_SETTINGS_NS), UiCustomSectionSchema, {
      base: {
        wallpaper: config?.wallpaper ?? '',
        glass: config?.glass ?? 'frosted',
        accent: config?.accent ?? '#4176e6',
        autoAccent: config?.autoAccent ?? false,
        surfaceOpacity: config?.surfaceOpacity ?? 100,
        sidebarOpacity: config?.sidebarOpacity ?? 100,
        chatSurfaceOpacity: config?.chatSurfaceOpacity ?? 100,
        inputOpacity: config?.inputOpacity ?? 100,
        codeBlockOpacity: config?.codeBlockOpacity ?? 100,
        darkSurfaceOpacity: config?.darkSurfaceOpacity ?? 100,
        gradient: config?.gradient ?? '',
        darkScrim: config?.darkScrim ?? 0,
        fontFamily: config?.fontFamily ?? '',
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:154-161](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/src/client/index.ts#L154-L161)

浏览器绑定同一命名空间。

```text
export function apply(ctx: ClientContext, config?: Partial<CustomThemeConfig>): void {
  const scope = ctx.settingsScope.bind<UiCustomSection>({ namespace: UI_CUSTOM_SETTINGS_NS })
  const presetId = typeof config?.preset === 'string' ? config.preset : ''
  const normalized = normalizeConfig(config, resolvePreset(presetId))
  // The runtime settings scope is the only config channel that reaches the
  // browser (the loader config arrives via the host-registered namespace
  // base, never as the apply argument). Its first snapshot arrives
  // asynchronously, so feature registration waits for it (registerFeatures).
```

**依据 3 · 源码核查**：[src/client/index.ts:270-281](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/src/client/index.ts#L270-L281)

等待 ready 快照和功能列表。

<details>
<summary>查看原文（12行）</summary>

```text
  let featuresRegistered = false
  const registerFeatures = (): void => {
    if (featuresRegistered) return
    const snapshot = scope.getSnapshot()
    if (snapshot.status !== 'ready' || snapshot.value === undefined) return
    featuresRegistered = true
    const features = resolveFeatures(snapshot.value)
    const enabled = (feature: PluginFeature): boolean => features.has(feature)

    // Theme application belongs to the 外观 feature: without it the plugin
    // never touches the document theme and the config stays inert.
    if (enabled('appearance')) applyConfig(normalized)
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:403-439](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/src/client/index.ts#L403-L439)

重新安装、跨功能判断和释放。

<details>
<summary>查看原文（37行）</summary>

```text
    let disposeShortcuts: (() => void) | undefined
    const applyShortcuts = (): void => {
      disposeShortcuts?.()
      const section = scope.getSnapshot().value
      const shortcuts: ShortcutConfig = {
        newConversation: section?.newConversation ?? normalized.shortcuts.newConversation,
        switchModel: section?.switchModel ?? normalized.shortcuts.switchModel,
        cycleThinking: section?.cycleThinking ?? normalized.shortcuts.cycleThinking,
        sendMessage: section?.sendMessage ?? normalized.shortcuts.sendMessage,
        newline: section?.newline ?? normalized.shortcuts.newline,
        usagePanel: section?.usagePanel ?? normalized.shortcuts.usagePanel,
        defaultWorkspace: section?.defaultWorkspace ?? normalized.shortcuts.defaultWorkspace,
        modelShortcuts: section?.modelShortcuts ?? normalized.shortcuts.modelShortcuts,
      }
      const disposeActions = installShortcuts(
        ctx,
        shortcuts,
        // Cross-feature gate: the usage-panel binding only dispatches when the
        // usage feature is mounted too.
        enabled('usage') ? undefined : new Set<ShortcutAction>(['usagePanel']),
      )
      const disposeComposer = installComposerInput(shortcuts)
      disposeShortcuts = () => {
        disposeActions()
        disposeComposer()
      }
    }
    applyShortcuts()
    ctx.effect(() => scope.subscribe(applyShortcuts), 'ui-custom: shortcut settings sync')
    ctx.effect(() => () => disposeShortcuts?.(), 'ui-custom: shortcut listener teardown')

    const controller = new ShortcutsSettingsController(
      scope,
      normalized.shortcuts,
      () => modelCatalogOptions(ctx),
    )
    const { dispose: disposeScope, actions } = controller.mount()
```

</details>

#### 缺口

- 未验证加载、切 profile 和热重载。
  **影响**：源码回收分支不能证明所有版本都只装一次。
  **进一步探讨**：在隔离 Web 中改快捷键并连续重载。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 全局键盘与样式有哪些成本和退出条件？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

全局捕获会跳过输入控件中的非 Ctrl/Meta 按键，但保留 Ctrl/Meta 组合，可能覆盖既有编辑或插件动作。输入框 Enter 重映射显式排除正在输入法组字的事件。外观可以写根 CSS 变量或写入用户自定义 style；中性配置移除激活标记和自定义样式节点。真实复合主题和热卸载是否恢复所有呈现需另核。建议在隔离配置先只启快捷键，给一个不会误发的动作分配按键。首次要核冲突，持续要检查宿主变化，出现错误派发、输入法异常或聊天难读时移除按键、恢复中性外观并重载。资源和耗时未测。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:121-144](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/src/client/index.ts#L121-L144)

全局捕获、可编辑输入和静默失败。

<details>
<summary>查看原文（24行）</summary>

```text
  const handler = (event: KeyboardEvent): void => {
    // Don't hijack plain typing: combos without Mod are suppressed while an
    // editable field has focus; Mod combos still fire.
    if (isEditableTarget(event.target) && !(event.ctrlKey || event.metaKey)) return
    for (const action of actions) {
      const combo = combos[action]
      if (combo === null || !matchesKeyCombo(combo, event)) continue
      event.preventDefault()
      event.stopPropagation()
      const handler = SHORTCUT_HANDLERS[action]
      if (handler === undefined) continue
      void Promise.resolve(handler(ctx, shortcuts)).catch(() => { /* action failure is silent */ })
      return
    }
    for (const { entry, combo } of modelShortcuts) {
      if (!matchesKeyCombo(combo, event)) continue
      event.preventDefault()
      event.stopPropagation()
      void Promise.resolve(selectModelDirect(ctx, entry.provider, entry.model)).catch(() => { /* action failure is silent */ })
      return
    }
  }
  window.addEventListener('keydown', handler, true)
  return () => window.removeEventListener('keydown', handler, true)
```

</details>

**依据 2 · 源码核查**：[src/client/shortcuts.ts:192-209](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/src/client/shortcuts.ts#L192-L209)

Enter 重映射和组合输入排除。

<details>
<summary>查看原文（18行）</summary>

```text
export function composerRemapDecision(
  sendCombo: KeyCombo | null,
  newlineCombo: KeyCombo | null,
  event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'isComposing'>,
): ComposerRemap {
  if (event.isComposing) return null
  if (event.key !== 'Enter') return null
  const nativeSend = !event.shiftKey && !event.altKey
  const nativeNewline = event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey
  const sendIsNative = sendCombo !== null && !sendCombo.mod && !sendCombo.shift && !sendCombo.alt && sendCombo.key === 'Enter'
  const newlineIsNative = newlineCombo !== null && newlineCombo.key === 'Enter' && newlineCombo.shift && !newlineCombo.mod && !newlineCombo.alt
  const isUserSend = sendCombo !== null && matchesKeyCombo(sendCombo, event)
  const isUserNewline = newlineCombo !== null && matchesKeyCombo(newlineCombo, event)
  if (isUserSend) return sendIsNative ? null : 'send'
  if (isUserNewline && !newlineIsNative) return 'newline'
  if (nativeSend && sendCombo !== null && !sendIsNative) return 'suppress'
  if (nativeNewline && newlineCombo !== null && !newlineIsNative) return 'suppress'
  return null
```

</details>

**依据 3 · 源码核查**：[src/client/apply.ts:113-128](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/src/client/apply.ts#L113-L128)

中性配置与根元素写入。

<details>
<summary>查看原文（16行）</summary>

```text
export function applyConfig(config: CustomThemeConfig): void {
  const root = document.documentElement
  if (isNeutralConfig(config)) {
    // Nothing to override: drop the gate so every override disappears.
    root.removeAttribute('data-dsu-active')
    document.getElementById(CUSTOM_STYLE_ID)?.remove()
    return
  }
  root.setAttribute('data-dsu-active', '1')

  const set = (name: string, value: string): void => root.style.setProperty(name, value)
  const wallpaper = cleanString(config.wallpaper, '')
  if (wallpaper === '') root.style.removeProperty('--dsu-wallpaper')
  else set('--dsu-wallpaper', `url("${escapeUrl(wallpaper)}")`)
  set('--dsu-blur', `${clampNumber(config.wallpaperBlur, 0, 60, 14)}px`)
  set('--dsu-saturate', String(GLASS_LEVELS[config.glass]?.saturate ?? 1.25))
```

</details>

**依据 4 · 源码核查**：[src/client/apply.ts:174-192](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/src/client/apply.ts#L174-L192)

用户 CSS 和变量写入、样式移除。

<details>
<summary>查看原文（19行）</summary>

```text
  // customVars: write each entry ('' removes the property).
  for (const [key, value] of Object.entries(config.customVars)) {
    if (value === '') root.style.removeProperty(key)
    else root.style.setProperty(key, value)
  }

  // customCss: a single plugin-owned style tag, kept in sync.
  let style = document.getElementById(CUSTOM_STYLE_ID) as HTMLStyleElement | null
  if (config.customCss !== '') {
    if (style === null) {
      style = document.createElement('style')
      style.id = CUSTOM_STYLE_ID
      style.dataset.plugin = 'dsh-client-ui-custom'
      document.head.appendChild(style)
    }
    style.textContent = config.customCss
  } else {
    style?.remove()
  }
```

</details>

#### 缺口

- 未运行真实键盘、输入法或其他主题组合。
  **影响**：不能承诺无冲突和完整退出。
  **进一步探讨**：在 Web 验证输入、焦点与恢复默认。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证减少操作且不误发？

**研究主题**：新假设与验证

#### 完整回答

假设专用组合键能缩短重复切换模型的操作时间，且不会增加误发和错误选模。让用户以交叉顺序完成同样的新会话及选模脚本，一组用按钮一组用快捷键。插入带中文输入法组字的 Enter 和一个故意冲突键，记录实际生效模型、错误动作、时间和恢复成本。若命中被吞但目标未改变，或错误操作增加，则保留原生操作。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:121-143](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/src/client/index.ts#L121-L143)

按键消费与动作调用可分别观察。

<details>
<summary>查看原文（23行）</summary>

```text
  const handler = (event: KeyboardEvent): void => {
    // Don't hijack plain typing: combos without Mod are suppressed while an
    // editable field has focus; Mod combos still fire.
    if (isEditableTarget(event.target) && !(event.ctrlKey || event.metaKey)) return
    for (const action of actions) {
      const combo = combos[action]
      if (combo === null || !matchesKeyCombo(combo, event)) continue
      event.preventDefault()
      event.stopPropagation()
      const handler = SHORTCUT_HANDLERS[action]
      if (handler === undefined) continue
      void Promise.resolve(handler(ctx, shortcuts)).catch(() => { /* action failure is silent */ })
      return
    }
    for (const { entry, combo } of modelShortcuts) {
      if (!matchesKeyCombo(combo, event)) continue
      event.preventDefault()
      event.stopPropagation()
      void Promise.resolve(selectModelDirect(ctx, entry.provider, entry.model)).catch(() => { /* action failure is silent */ })
      return
    }
  }
  window.addEventListener('keydown', handler, true)
```

</details>

**依据 2 · 源码核查**：[src/client/shortcuts.ts:192-209](https://github.com/yoli-mi/dsh-client-ui-custom/blob/edf1ef701e360577ddde1a5c6d79fdce17a1744e/src/client/shortcuts.ts#L192-L209)

输入法及 Enter 可设负例。

<details>
<summary>查看原文（18行）</summary>

```text
export function composerRemapDecision(
  sendCombo: KeyCombo | null,
  newlineCombo: KeyCombo | null,
  event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey' | 'isComposing'>,
): ComposerRemap {
  if (event.isComposing) return null
  if (event.key !== 'Enter') return null
  const nativeSend = !event.shiftKey && !event.altKey
  const nativeNewline = event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey
  const sendIsNative = sendCombo !== null && !sendCombo.mod && !sendCombo.shift && !sendCombo.alt && sendCombo.key === 'Enter'
  const newlineIsNative = newlineCombo !== null && newlineCombo.key === 'Enter' && newlineCombo.shift && !newlineCombo.mod && !newlineCombo.alt
  const isUserSend = sendCombo !== null && matchesKeyCombo(sendCombo, event)
  const isUserNewline = newlineCombo !== null && matchesKeyCombo(newlineCombo, event)
  if (isUserSend) return sendIsNative ? null : 'send'
  if (isUserNewline && !newlineIsNative) return 'newline'
  if (nativeSend && sendCombo !== null && !sendIsNative) return 'suppress'
  if (nativeNewline && newlineCombo !== null && !newlineIsNative) return 'suppress'
  return null
```

</details>

#### 缺口

- 未执行交叉对照。
  **影响**：不能把设计目的写成实测结果。
  **进一步探讨**：保存按键、宿主动作和结果的对应记录。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
