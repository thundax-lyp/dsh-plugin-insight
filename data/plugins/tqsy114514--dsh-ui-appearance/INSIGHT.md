# DSH UI Appearance

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f1d2c8a](https://github.com/TQSY114514/dsh-ui-appearance/tree/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TQSY114514/dsh-ui-appearance) [![npm 30d 7,085](https://img.shields.io/static/v1?label=npm+30d&message=7%2C085&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ui-appearance) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ui-appearance)
<!-- END META -->

> **功能**：为 DSH Web 提供深浅双模式配色，以及壁纸、视频、透明度与模糊设置。

> **亮点**：在宿主设置里提供分模式调整与独立媒体层，保留组件级外观设置，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

> **主要限制**：低对比配色与媒体替换可以留下不可读或无法恢复的状态，见 [Q03](#research-q03)。

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
  - [Q01 · 哪类用户需要更细的 DSH 外观配置？](#detail-section-11)
  - [Q02 · 颜色和背景何时真正生效？](#detail-section-12)
  - [Q03 · 远端背景、被替换资产和对比度有什么边界？](#detail-section-13)
  - [Q04 · 怎样试用并判断是否值得继续？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合希望在 DSH Web 分别定制深浅色及阅读背景的使用者，见 [Q01](#research-q01)。

以原生深浅主题或手工 CSS 为对照，比较调节与恢复，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 分模式主题 | 独立配置界面配色 | 依赖宿主主题令牌，实际对比需核对 |
| 媒体背景 | 从本机或 URL 设置背景 | 依赖浏览器存储、编解码及 CORS |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、slots、theme、locale | 需要 | 注册控件并覆盖主题 | 加载或效果缺失 |
| 浏览器存储 | 保存所需 | 本机保留设置与媒体 | 刷新可丢失 |
| 可解码素材及 CORS | 媒体按场景需要 | 背景渲染及 URL 访问 | 显示空背景或错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定隔离 Web profile | 保留原主题与可读样例 |
| 试用 | 分别测试两模式和本地图 | 退出前确认可见及刷新保存 |
| 恢复 | 重置或卸载并查原主题 | 站点存储按需处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 初次 | Web 资源和存储 | 核对接线与素材 | 耗时未知 |
| 持续 | 媒体解码、存储和渲染 | 核颜色与跨标签变更 | 未实测 |
| 退出 | 本地持久数据 | 重置及检查界面 | 卸载本身不清站点存储 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 定制 | 分模式配色及局部透明 | 真实阅读效果 |
| 撤回 | 清理覆写与媒体对象 | 目标宿主恢复和跨标签体验 |

> **思考**：低对比配色与媒体替换可以留下不可读或无法恢复的状态，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在宿主设置里提供分模式调整与独立媒体层，保留组件级外观设置，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

设置与视觉覆写分层，媒体对象按 effect 生命周期释放。存储失败及替换时序仍需独立检查，见 [Q02](#research-q02) 和 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

低对比配色与媒体替换可以留下不可读或无法恢复的状态，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先试本地静态图片，核对菜单、正文和输入区。背景失败或对比不合适时重置并恢复原主题，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持设置卡、浏览器存储、主题覆写和卸载清理。目标宿主、所有对比度和媒体复用未运行验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、tsdown.standalone.config.ts、README.md、src/client/index.ts、src/index.ts、src/client/applier.ts、src/client/tokens.ts、src/client/url-load.ts、src/client/AppearanceCustomizerRow.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核固定源码、发布声明与作者说明，未实际打开目标插件、加载媒体或做对比度验收。
- 下一步：在固定 Web 和两标签对照深浅色、低对比与无媒体场景，测重置、退出和替换失败，见 [Q04](#research-q04)。

**分析版本**

- **仓库**：[TQSY114514/dsh-ui-appearance](https://github.com/TQSY114514/dsh-ui-appearance)
- **版本号**：0.1.28（[固定提交 f1d2c8a](https://github.com/TQSY114514/dsh-ui-appearance/tree/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6)）
- **版本日期**：2026-11-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用实际复合表面的对比预览与保存后再清理旧媒体减少误判和替换丢失，见 [Q04](#research-q04)。

在固定 Web 和两标签对照深浅色、低对比与无媒体场景，测重置、退出和替换失败，见 [Q04](#research-q04)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1173 | — | — | 21607 |
| .ts | source | 17 | 4038 | 2819 | 1001 | — |
| .tsx | source | 1 | 847 | 758 | 61 | — |
| .ts | test | 13 | 2456 | 1955 | 263 | — |
| .tsx | test | 2 | 439 | 374 | 28 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/TQSY114514/dsh-ui-appearance/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/TQSY114514/dsh-ui-appearance/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/TQSY114514/dsh-ui-appearance/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户能否在不丢失阅读对比度和原有背景的前提下定制 Web 外观？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类用户需要更细的 DSH 外观配置？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

长时间在 DSH Web 阅读代码和对话的用户，如需浅色、深色分别选择背景和控制菜单透明度，宿主基本主题可以作为对照。该插件的增量是把这些角色、壁纸及局部透明度放进 General 的外观控件，代码按模式更新独立对象而不污染旧的全局颜色。合格结果是切换宿主模式后仍保持对应的用户配置，输入框、菜单及文字可辨，退出后原有外观恢复；截图和颜色值不够证明对比可用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:36-52](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/README.md#L36-L52)

作者描述分模式、媒体和组件透明度。

<details>
<summary>查看原文（17行）</summary>

```text
## 功能

**深浅双模式独立外观** —— 设置面板顶部提供「浅色模式 / 深色模式」独立分段卡，分别配置双模式下的 6 种颜色角色与预设，实时跟随宿主状态与系统 `prefers-color-scheme` 自适应切换。接入 WCAG 2.1 动态反解算法（次级文字 $\ge 7:1$、三级说明字 $\ge 4.5:1$），彻底杜绝浅色模式“白底淡字”或深色模式图标隐形。

**主题颜色** —— 6 个核心颜色角色：主色、背景色、面板色、输入框色、文字色、边框色。每个角色支持原生取色器与 HEX 精确输入，全局色彩严格遵循**所见即所得**（不隐式篡改你手选的文字色）；主操作按钮、文字选区高亮、键盘焦点环跟随主色，用户消息气泡跟随面板色，并在局部实心/半透明表面自动做可读性对比度兜底。

**壁纸与视频背景（最高 200MB）** —— 支持上传或拖拽图片（JPG / PNG / WebP / GIF），或**粘贴 URL 一键加载**（自动按扩展名分流，支持 CORS 友好直链）。原画质通过 IndexedDB Blob 存储（零额外堆内存复制，不占 localStorage 配额；超 4096px 等比缩边，限内 GIF 保留动效）。上传时自动采样平均亮度并**智能提取主色衍生周边色阶**。支持原生流式硬解**动态视频背景**（MP4 / WebM，静音循环播放，最高 200MB）。

**毛玻璃与多维独立半透明机制** —— **主面板、侧边栏、设置与弹窗、菜单与浮层、输入框、代码块**均拥有独立的 0%~100% 连续不透明度滑块，互不干扰（彻底解决主面板全透时设置弹窗或下拉菜单/浮窗看不清字的问题）。**毛玻璃强度（`glassBlur`）与背景模糊（`backgroundBlur`）完全解耦**：背景模糊仅作用于底层壁纸/视频，而毛玻璃精准作用于侧边栏、输入框、斜杠命令（`/`）浮层、下拉菜单与浮窗、消息气泡、代码块、设置弹窗及弹窗外围遮罩。行内代码等强调字保留低透明度主色相，配合「强调字浓度」滑块精细微调；中性控件与菜单项 hover / 选中状态同步烘焙对应透明度，鼠标悬停平滑自然，绝不闪现死白/死黑的实心水泥块（解决 `hover snapped opaque`）。

**背景三层架构与氛围** —— 独创三层渲染架构：底层基础画布（承载自定义纯色背景）、中层媒体层（承载壁纸/视频的独立不透明度与模糊）、顶层防眩光遮罩（随深浅色模式自动配色的纱帘渐变）。调低壁纸不透明度时平滑融入自定义背景底色，消除白斑；遮罩层有效保证亮图之上的文字易读性。

**双模式专属预设** —— 浅色 5 款专属预设（晨曦、云天、薄荷、樱粉、雅灰）+ 深色 6 款经典预设（默认、午夜、海洋、森林、玫瑰、单色），一键应用并支持自由微调。

**配色方案分享** —— 一键导出配色 JSON 至剪贴板，粘贴即可导入应用；欢迎在 GitHub Discussions 社区分享交流你的专属配色方案。

所有修改实时生效，无需刷新，无需保存。
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:237-255](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/index.ts#L237-L255)

单模式编辑及防止另一模式继承误值。

<details>
<summary>查看原文（19行）</summary>

```text
  const setModeRole = (mode: ThemeMode, role: AppearanceRole, value: string): void => {
    const patch = { ...current }
    patch[mode] = {
      ...patch[mode],
      [role]: value,
      preset: 'custom',
      invert: {
        ...patch[mode].invert,
        accent: true,
        background: false,
      },
    }
    // Top-level role fields are a legacy mirror only: dual-mode writes must
    // NOT pollute them, or the untouched mode falls back to this value via
    // getRole() and shows the wrong color (e.g. light mode leaks dark edits).
    patch.preset = 'custom'
    current = patch
    commit()
  }
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:372-392](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/index.ts#L372-L392)

将设置控件注册到 General。

<details>
<summary>查看原文（21行）</summary>

```text
  const injected = (actions: BoundActions<typeof store>): AppearanceCustomizerInjected => {
    bound = actions
    // Push the initial section so the row renders the persisted values.
    publish()
    // Replay a decode failure that landed before the row's store was bound.
    if (videoPlaybackError) actions.setVideoPlaybackError(true)
    return {
      set, setModeRole, setModeInvert, setImage, setVideo,
      applyModePreset, applyModeColors, resetMode,
      applyPreset, applyColors, resetAll,
    }
  }

  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'appearance-custom',
    order: 1000,
    store,
    locale: SETTINGS_NS,
    inject: injected,
  }, AppearanceCustomizerRow))
```

</details>

#### 缺口

- 未做阅读任务的体验比较
  **影响**：个性化价值只能按场景推断
  **进一步探讨**：用同一界面在原主题与插件上核实阅读、暗色和焦点

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 颜色和背景何时真正生效？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

宿主 apply 为空，profile 通过补丁和配置声明装入浏览器模块。客户端需要 slots、locale 和 theme，加载时从 localStorage 读取配置并清洗，颜色修改即时保存并发布。渲染覆写合并到动画帧，调用 theme.overrideTokens，并以 CSS 变量和元素属性控制背景媒体。相同站点的另一标签通过 storage 事件重读整个设置，无合并并发字段的逻辑。浏览器拒绝 localStorage 写入时页面内可工作，但刷新后可能恢复旧配置。卸载取消帧、退回 token、清除媒体、样式、属性和监听，持久化的设置及媒体存储没有在卸载中删除。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:18-22](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/index.ts#L18-L22)

宿主壳空。

```text
/**
 * No host-side work: everything runs in the browser half.
 * @param ctx - Host context (unused).
 */
export function apply(_ctx: Context): void {}
```

**依据 2 · 源码核查**：[src/client/index.ts:51-71](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/index.ts#L51-L71)

运行依赖和设置读取。

<details>
<summary>查看原文（21行）</summary>

```text
/** Required services: slots/locale for the row, theme for token overrides. */
export const inject = ['slots', 'locale', 'theme']

/** localStorage key holding the whole settings section. */
export const STORAGE_KEY = 'dsh-ui-appearance.settings'

/**
 * Read the persisted section, tolerating a missing, corrupt, or out-of-schema
 * entry: parse failures fall back to the stock defaults, and every parsed
 * field is validated against the schema bounds before it reaches the UI.
 * @returns the stored settings, or the stock defaults.
 */
function readStoredSettings(): AppearanceSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return { ...DEFAULT_SETTINGS }
    return sanitizeSettings(JSON.parse(raw))
  } catch (_unreadableStorage) {
    return { ...DEFAULT_SETTINGS }
  }
}
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:117-153](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/index.ts#L117-L153)

动画帧合并及状态发布。

<details>
<summary>查看原文（37行）</summary>

```text
  // Token override rebuilds (applier.apply) are the expensive part of a
  // commit. Drag-style writes fire on every pointermove / color-picker input,
  // so coalesce rebuilds onto the animation frame: at most one rebuild per
  // rendered frame, aligned with vsync. The trailing edge still applies the
  // very last value one frame later, so a drag never drops its final position.
  // localStorage and the store sync stay synchronous so swatches, React rows,
  // and persistence never lag behind the drag.
  let applyRaf: number | undefined
  let applyPending = false

  const scheduleApply = (): void => {
    if (applyRaf !== undefined) {
      applyPending = true
      return
    }
    applyRaf = requestAnimationFrame(() => {
      applyRaf = undefined
      applyPending = false
      applier?.apply(current)
    })
  }

  /** Cancel any pending frame and apply the latest state right now. */
  const flushApply = (): void => {
    if (applyRaf !== undefined) {
      cancelAnimationFrame(applyRaf)
      applyRaf = undefined
    }
    applyPending = false
    applier?.apply(current)
  }

  const publish = (): void => {
    revision += 1
    bound?.sync(current, revision)
    scheduleApply()
  }
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:183-213](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/index.ts#L183-L213)

清理、跨标签重读及写入失败。

<details>
<summary>查看原文（31行）</summary>

```text
    return () => {
      if (applyRaf !== undefined) {
        cancelAnimationFrame(applyRaf)
        applyRaf = undefined
        applyPending = false
      }
      applier?.dispose()
      applier = undefined
    }
  }, 'ui-appearance: DOM applier')

  // Cross-tab sync: another tab persisted a section change.
  ctx.effect(() => {
    const onStorage = (event: StorageEvent): void => {
      if (event.key !== null && event.key !== STORAGE_KEY) return
      current = readStoredSettings()
      publish()
    }
    window.addEventListener('storage', onStorage)
    return () => { window.removeEventListener('storage', onStorage) }
  }, 'ui-appearance: storage sync')

  const commit = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
    } catch (_storageQuota) {
      // Quota exceeded (e.g. an oversized image): keep the in-memory state so
      // this session still works; the change just does not survive a reload.
    }
    publish()
  }
```

</details>

**依据 5 · 源码核查**：[src/client/applier.ts:519-549](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/applier.ts#L519-L549)

主题覆写及背景属性。

<details>
<summary>查看原文（31行）</summary>

```text
  apply(settings: AppearanceSettings | undefined): void {
    const value = settings ?? DEFAULT_SETTINGS
    const oldRemove = this.removeOverrides
    const tokens = buildTokenOverrides(value)
    this.removeOverrides = Object.keys(tokens).length > 0
      ? this.ctx.theme.overrideTokens(OVERRIDE_SOURCE, tokens)
      : undefined
    oldRemove?.()
    const body = document.body
    // Windows desktop host frame punch-out (Issue #31):
    // DSH 0.2.0 desktop on Windows sets `[data-windows-titlebar] .BynINW_frame { background: var(--dsw-specific-sidebar-fill) }`
    // which encloses the entire viewport with opaque sidebar color, blocking the wallpaper on the main canvas.
    // Setting `data-dsw-has-bg` on <html> triggers the transparent frame rule when wallpaper/video is active,
    // aligning Windows desktop behavior with Web and macOS.
    const hasMedia = value.backgroundImage !== '' || value.backgroundVideo !== ''
    if (hasMedia) {
      document.documentElement.setAttribute('data-dsw-has-bg', '')
    } else {
      document.documentElement.removeAttribute('data-dsw-has-bg')
    }
    const effectiveSidebarAlpha = typeof value.sidebarAlpha === 'number'
      ? value.sidebarAlpha
      : (value.sidebarOpaque ? 1 : value.surfaceAlpha)
    if (effectiveSidebarAlpha < 1) {
      body.setAttribute('data-dsw-translucent-sidebar', '')
    } else {
      body.removeAttribute('data-dsw-translucent-sidebar')
    }
    // The wallpaper rides a CSS variable like every other knob; the value is
    // a record key (or legacy inline data URL) and resolves asynchronously.
    void this.syncImage(value.backgroundImage)
```

</details>

**依据 6 · 源码核查**：[src/client/applier.ts:810-844](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/applier.ts#L810-L844)

撤销视觉效果和释放临时对象。

<details>
<summary>查看原文（35行）</summary>

```text
  /** Remove the video element and revoke its object URL. */
  private teardownVideo(): void {
    this.videoEl?.remove()
    this.videoEl = undefined
    if (this.videoUrl !== undefined) {
      URL.revokeObjectURL(this.videoUrl)
      this.videoUrl = undefined
    }
  }

  /** Retract the override layer, the stylesheet, the layer element, and body variables. */
  dispose(): void {
    this.removeOverrides?.()
    this.removeOverrides = undefined
    // Drop the keys BEFORE tearing down: a getVideo()/getImage() still in
    // flight resolves after dispose, and the key comparison is what stops it
    // from recreating media on the removed layer.
    this.videoKey = ''
    this.teardownVideo()
    this.imageToken = ''
    this.teardownImage()
    this.style.remove()
    this.layer.remove()
    const body = document.body
    for (const name of BODY_VARIABLES) body.style.removeProperty(name)
    body.style.removeProperty('--dsw-mask-blur')
    body.style.removeProperty('--dsw-menu-backdrop-filter')
    body.removeAttribute('data-dsw-bubble-ink-light')
    body.removeAttribute('data-dsw-bubble-ink-dark')
    body.removeAttribute('data-dsw-translucent-sidebar')
    body.removeAttribute('data-dsw-sliding')
    // Compositor anchor cleanup: remove the html attribute so the host's natural
    // background resumes after the plugin is unloaded.
    document.documentElement.removeAttribute('data-dsw-has-bg')
  }
```

</details>

#### 缺口

- 未在真实宿主和多标签加载
  **影响**：并发设置、宿主槽和旧包兼容未知
  **进一步探讨**：同站点双标签改不同字段后卸载刷新查状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 远端背景、被替换资产和对比度有什么边界？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

URL 明确加载时由浏览器 fetch，跨源需 CORS。先整份读入 Blob 再作类型和大小判断，配置上限不能限制下载前的数据量。支持的容器也不保证解码或自动播放，播放拒绝被捕捉且不直接报解码失败。旧视频在部分替换入口先发起异步删除再保存新视频，保存失败可留下指向旧记录的设置，旧视频能否恢复不能保证。切换成图片时清空视频引用的 setter 没在这个分支删除旧视频对象，也不能据 README 保证无孤儿。图片与视频主要放 IndexedDB，对磁盘、内存和浏览器策略仍有投入。

作者称可保证目标对比度，但算法在原字色对面板低于阈值时直接返回原色。再叠加透明、图片以及宿主不同元件，不可把若干变量的计算目标写成全界面可访问性验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:115-124](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/README.md#L115-L124)

作者宣称对比度和无孤儿的范围。

<details>
<summary>查看原文（10行）</summary>

```text
## 工作原理

| 能力 | 机制 |
|---|---|
| **颜色与对比度** | `ctx.theme.overrideTokens()` 覆写 `--dsw-alias-*` 语义 Token，支持深浅双模式独立配置与所见即所得色彩还原。内置 WCAG 2.1 动态反解算法（`a11yLabelStep`）保证次级文字 $\ge 7:1$、三级文字 $\ge 4.5:1$；针对用户消息气泡（`bubbleInk`，综合面板透明度与底层画布/壁纸合成色）、文字选区（`selectionColors`）及主色按钮提供局部对比度自动兜底，既保留自定义文字色又杜绝撞色隐形 |
| **背景三层架构** | 自主研发三层独立图层（底层纯色画布 + 中层媒体层 + 顶层防眩光遮罩），沉底在 `position: fixed; z-index: -1`。当壁纸/视频生效时，自动对宿主底座（`--dsw-alias-bg-base`）进行**透明打孔**，绝不给 `#root` 赋予 `position`/`z-index`，从原理上消除层叠上下文（Stacking Context）陷阱，保证宿主与设置弹窗永远位于最顶层 |
| **组件级毛玻璃与边缘抗虚** | 背景模糊采用底层画布 `filter: blur` 配合 `inset: -48px` 外扩延伸，彻底消除屏幕四周半透明羽化白边；毛玻璃强度（`glassBlur`）则解耦为组件级 `backdrop-filter`，并在侧边栏（`[class*="_sidebarCol"]::before`）与输入框卡片（`[data-composer-card]::before`）采用伪元素隔离技术，既不捕获 Windows 桌面端 `position: fixed` 标题栏按钮，也不形成 CSS Backdrop Root 裁剪斜杠命令（`/`）浮层 |
| **交互悬停闭环** | 中性控件与操作按钮的 Hover 态 Token（`--dsw-alias-interactive-bg-hover` 及 `-solid`）在半透明模式下同步烘焙当前透明度，保持悬停微调明暗（10%~15%）的同时严格透出背景，杜绝鼠标滑过按钮闪烁成实心水泥块（避免 `hover snapped opaque`） |
| **视频原生硬解** | 基于 Chromium 原生硬件加速流式解码，静音循环播放。视频文件通过 IndexedDB Blob 引用直存（最高 200MB），不经 Base64 编码，零额外堆内存复制 |
| **持久化与清理** | 外观配置存入浏览器 `localStorage`（键 `dsh-ui-appearance.settings`），跨标签页瞬时同步；图片与视频存入 `IndexedDB`。更换媒体或“恢复全部默认”时自动执行 Blob 垃圾回收（`deleteImage` / `deleteVideo`），绝不产生孤儿文件残留 |
```

</details>

**依据 2 · 源码核查**：[src/client/tokens.ts:48-75](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/tokens.ts#L48-L75)

原色低于阈值时保持原值。

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * Pick the largest mix weight toward `base` that satisfies the target WCAG contrast
 * ratio against `surf` using binary search in `[0, stockWeight]`.
 * Falls back to `text` itself if `text` on `surf` already fails the target.
 */
function a11yLabelStep(
  text: string,
  base: string,
  surf: string,
  targetRatio: number,
  stockWeight: number,
): string {
  if (text === '' || surf === '') return ''
  if (contrastRatio(text, surf) < targetRatio) return text
  if (contrastRatio(mixHex(text, base, stockWeight), surf) >= targetRatio) {
    return mixHex(text, base, stockWeight)
  }
  let lo = 0
  let hi = stockWeight
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (contrastRatio(mixHex(text, base, mid), surf) >= targetRatio) {
      lo = mid
    } else {
      hi = mid
    }
  }
  return mixHex(text, base, lo)
```

</details>

**依据 3 · 源码核查**：[src/client/url-load.ts:46-62](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/url-load.ts#L46-L62)

浏览器取得完整 Blob 才返回。

<details>
<summary>查看原文（17行）</summary>

```text
export async function fetchBlob(url: string): Promise<Blob> {
  let response: Response
  try {
    response = await fetch(url, { mode: 'cors' })
  } catch {
    // A cross-origin request without CORS headers rejects with a TypeError.
    throw new UrlLoadFailure('cors')
  }
  if (!response.ok) throw new UrlLoadFailure('http')
  let blob: Blob
  try {
    blob = await response.blob()
  } catch {
    throw new UrlLoadFailure('network')
  }
  if (blob.size === 0) throw new UrlLoadFailure('network')
  return blob
```

</details>

**依据 4 · 源码核查**：[src/client/url-load.ts:90-111](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/url-load.ts#L90-L111)

大小及类型在下载后核对。

<details>
<summary>查看原文（22行）</summary>

```text
export async function loadImageFromUrl(url: string): Promise<PreparedImage> {
  const kind = classifyUrl(url)
  const blob = await fetchBlob(url)
  const type = blob.type === '' ? mimeFor(kind) : blob.type
  if (!type.startsWith('image/')) throw new UrlLoadFailure('type')
  if (blob.size > MAX_INPUT_BYTES) throw new UrlLoadFailure('size')
  return prepareImage(new File([blob], urlToName(url), { type }))
}

/**
 * Load a video from a URL into a File ready for the IndexedDB store.
 * @param url - the remote video URL.
 * @returns the video file.
 * @throws UrlLoadFailure with a 'type' or 'size' code past the fetch stage.
 */
export async function loadVideoFromUrl(url: string): Promise<File> {
  const kind = classifyUrl(url)
  const blob = await fetchBlob(url)
  const type = blob.type === '' ? mimeFor(kind) : blob.type
  if (!type.startsWith('video/')) throw new UrlLoadFailure('type')
  if (blob.size > MAX_VIDEO_BYTES) throw new UrlLoadFailure('size')
  return new File([blob], urlToName(url), { type })
```

</details>

**依据 5 · 源码核查**：[src/client/AppearanceCustomizerRow.tsx:391-433](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/AppearanceCustomizerRow.tsx#L391-L433)

部分视频替换先发起删除，失败处理。

<details>
<summary>查看原文（43行）</summary>

```text
    setVideoReading(true)
    setVideoError(null)
    try {
      // Replacing a video must drop the previous IndexedDB record, or the
      // store accumulates one entry per upload.
      const oldKey = settings.backgroundVideo
      if (oldKey !== '') void deleteVideo(oldKey)
      const key = await saveVideo(file, file.name)
      setVideo(key)
    } catch {
      setVideoError('read')
    } finally {
      setVideoReading(false)
    }
  }
  const removeVideo = (): void => {
    if (settings.backgroundVideo !== '') void deleteVideo(settings.backgroundVideo)
    setVideo(null)
  }
  const loadFromUrl = async (): Promise<void> => {
    const url = urlDraft.trim()
    if (url === '') return
    setUrlReading(true)
    setUrlError(null)
    try {
      if (classifyUrl(url) === 'video') {
        const file = await loadVideoFromUrl(url)
        // Replacing a video must drop the previous record (same rule as uploads).
        const oldKey = settings.backgroundVideo
        if (oldKey !== '') void deleteVideo(oldKey)
        const key = await saveVideo(file, file.name)
        setVideo(key)
      } else {
        const payload = await loadImageFromUrl(url)
        // Store by reference (same rule as uploads).
        const key = await saveImage(payload.blob, urlToName(url))
        setImage({ url: key, imageDark: payload.imageDark })
        // Auto-palette, same rule as uploads.
        if (payload.accent !== null) applyWallpaperPalette(payload.accent, payload.imageDark)
      }
      setUrlDraft('')
    } catch (error) {
      setUrlError(error instanceof UrlLoadFailure ? error.code : 'network')
```

</details>

**依据 6 · 源码核查**：[src/client/index.ts:266-301](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/index.ts#L266-L301)

图片和视频互斥，替换路径有不同清理。

<details>
<summary>查看原文（36行）</summary>

```text
  const setImage = (image: { url: string; imageDark: boolean } | null): void => {
    const patch = { ...current }
    // A replacement supersedes the previous record; drop it so repeated swaps
    // cannot accumulate orphaned blobs (inline legacy data URLs need no
    // cleanup — they never entered IndexedDB).
    const old = patch.backgroundImage
    if (old !== '' && !old.startsWith('data:') && old !== (image?.url ?? '')) {
      void deleteImage(old)
    }
    patch.backgroundImage = image?.url ?? ''
    patch.imageDark = image?.imageDark ?? false
    // Image and video backgrounds are mutually exclusive.
    if (image !== null) patch.backgroundVideo = ''
    current = patch
    commit()
    flushApply()
  }
  const setVideo = (key: string | null): void => {
    // A replacement supersedes the previous record; drop it now so repeated
    // swaps cannot accumulate orphaned blobs in IndexedDB.
    if (key !== null && key !== current.backgroundVideo && current.backgroundVideo !== '') {
      void deleteVideo(current.backgroundVideo)
    }
    const patch = { ...current }
    patch.backgroundVideo = key ?? ''
    // Image and video backgrounds are mutually exclusive. Dropping the image
    // also drops its IndexedDB record (legacy inline data URLs need none).
    if (key !== null) {
      const oldImage = patch.backgroundImage
      if (oldImage !== '' && !oldImage.startsWith('data:')) void deleteImage(oldImage)
      patch.backgroundImage = ''
      patch.imageDark = false
    }
    current = patch
    commit()
    flushApply()
```

</details>

**依据 7 · 源码核查**：[src/client/applier.ts:743-782](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/applier.ts#L743-L782)

解码与自动播放失败边界。

<details>
<summary>查看原文（40行）</summary>

```text
  private async syncVideo(key: string): Promise<void> {
    if (key === '') {
      this.videoKey = ''
      this.teardownVideo()
      this.layer.removeAttribute('data-video')
      this.reportVideoError(false)
      return
    }
    if (key === this.videoKey) return
    this.videoKey = key
    this.teardownVideo()
    const record = await getVideo(key)
    if (record === undefined || this.videoKey !== key) {
      // Deleted while loading, or superseded by a newer apply.
      this.videoKey = ''
      this.layer.removeAttribute('data-video')
      this.reportVideoError(false)
      return
    }
    const video = this.ensureVideo()
    this.videoUrl = URL.createObjectURL(record)
    video.src = this.videoUrl
    // Unsupported codec (e.g. HEVC in an mp4): drop the video layer so the
    // wallpaper fallback (if any) shows instead of a black frame, and tell the
    // row — otherwise the failure is indistinguishable from "no background".
    video.onerror = (): void => {
      this.videoKey = ''
      this.layer.removeAttribute('data-video')
      this.teardownVideo()
      this.reportVideoError(true)
    }
    // Decoding started: the codec is supported after all (a swapped-in video
    // may recover from a previous failure).
    video.onloadeddata = (): void => { this.reportVideoError(false) }
    this.layer.setAttribute('data-video', '')
    video.play().catch(() => {
      // Autoplay policy or unsupported codec: keep the layer fallback silent.
      // `onerror` owns the unsupported-codec report; a play() rejection on its
      // own is not a decode failure and must not claim one.
    })
```

</details>

#### 缺口

- 未模拟浏览器存储不足和低对比环境
  **影响**：可能有视觉失败与媒体丢失
  **进一步探讨**：用不支持视频、拒绝持久化、低对比文字和透明菜单做验证

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用并判断是否值得继续？

**研究主题**：采用判断、新假设与验证

#### 完整回答

用已知图片和默认主题做测试，分别比较静态背景、半透明菜单、浅色与深色下的长对话。记录焦点、正文、菜单、表格的可读性及帧率和恢复原主题的人工时间。遇到字体与背景撞色、跨标签不一致或设置不保留，使用重置或卸载回到原主题。不建议把插件作为必要的无障碍补救。可为可见组件提供复合表面的即时对比预览，并在切换前保留现有视频，直到新媒体保存成功。测试能否减少低对比漏判与换背景后丢原样式。若预览与真实渲染不一致或存储成本上升，退回静态原生主题。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/tokens.ts:53-75](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/tokens.ts#L53-L75)

低对比反例及设计动机。

<details>
<summary>查看原文（23行）</summary>

```text
function a11yLabelStep(
  text: string,
  base: string,
  surf: string,
  targetRatio: number,
  stockWeight: number,
): string {
  if (text === '' || surf === '') return ''
  if (contrastRatio(text, surf) < targetRatio) return text
  if (contrastRatio(mixHex(text, base, stockWeight), surf) >= targetRatio) {
    return mixHex(text, base, stockWeight)
  }
  let lo = 0
  let hi = stockWeight
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (contrastRatio(mixHex(text, base, mid), surf) >= targetRatio) {
      lo = mid
    } else {
      hi = mid
    }
  }
  return mixHex(text, base, lo)
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:353-370](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/index.ts#L353-L370)

重置两模式和媒体键。

<details>
<summary>查看原文（18行）</summary>

```text
  const resetAll = (): void => {
    const oldImage = current.backgroundImage
    if (oldImage !== '' && !oldImage.startsWith('data:')) {
      void deleteImage(oldImage)
    }
    const oldVideo = current.backgroundVideo
    if (oldVideo !== '') {
      void deleteVideo(oldVideo)
    }
    current = {
      ...DEFAULT_SETTINGS,
      preset: 'default',
      light: { ...DEFAULT_LIGHT_THEME, invert: { ...DEFAULT_LIGHT_THEME.invert } },
      dark: { ...DEFAULT_DARK_THEME, invert: { ...DEFAULT_DARK_THEME.invert } },
    }
    commit()
    flushApply()
  }
```

</details>

**依据 3 · 源码核查**：[src/client/AppearanceCustomizerRow.tsx:391-402](https://github.com/TQSY114514/dsh-ui-appearance/blob/f1d2c8a6345f48fe4e8a8010696d3e171d8591e6/src/client/AppearanceCustomizerRow.tsx#L391-L402)

替换非事务化，为延迟删除提供依据。

<details>
<summary>查看原文（12行）</summary>

```text
    setVideoReading(true)
    setVideoError(null)
    try {
      // Replacing a video must drop the previous IndexedDB record, or the
      // store accumulates one entry per upload.
      const oldKey = settings.backgroundVideo
      if (oldKey !== '') void deleteVideo(oldKey)
      const key = await saveVideo(file, file.name)
      setVideo(key)
    } catch {
      setVideoError('read')
    } finally {
```

</details>

#### 缺口

- 未做目标宿主体验与性能试验
  **影响**：采用仅限有退路的小范围试用
  **进一步探讨**：测低端浏览器、深浅色、重置与退出

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
