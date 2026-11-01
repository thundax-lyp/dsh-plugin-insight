# dsh-client-ui-aqua

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[df0b087](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/tree/df0b08707547ff811f691881594a919bb3818690)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aliww2468/dsh-client-ui-aqua-patched) [![npm 30d 1,096](https://img.shields.io/static/v1?label=npm+30d&message=1%2C096&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-client-ui-aqua) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-client-ui-aqua)
<!-- END META -->

> **功能**：为 DSH Web 提供可配置的玻璃质感主题修补版。

> **亮点**：[Q01](#research-q01) 非官方修补主题提供视觉选项，[Q02](#research-q02) 将设置和生命周期接入宿主。

> **主要限制**：[Q03](#research-q03) 存储失败仅保留当前页状态，不能保证刷新后关闭或所有视觉效果可访问。

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
  - [Q01 · Aqua 主题相对宿主原生外观提供什么？](#detail-section-11)
  - [Q02 · 主题和设置如何接入及关闭？](#detail-section-12)
  - [Q03 · 存储、动画和兼容失败的边界是什么？](#detail-section-13)
  - [Q04 · 采用条件、资源成本和退出是什么？](#detail-section-14)
  - [Q05 · 怎样帮助用户判断当前主题是否适合工作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户希望自定义 DSH Web 视觉外观。

使用宿主原生主题与外观设置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 主题层 | 修改界面视觉 | 依赖宿主 DOM 与主题服务 |
| 设置 | 切换和调整外观 | 存储失败仅当前页 |
| 动画 | 提供流体效果 | 减少动态仅检查代表分支 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 兼容 DSH Web | 必需 | 主题与设置插槽 | 入口或样式失效 |
| 浏览器存储 | 保存偏好需要 | 保留开关及设置 | 回退当前页状态 |
| 授权壁纸素材 | 使用素材需要 | 自定义背景 | 使用默认背景 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份设置并核版本 | 不符先停止 |
| 启用 | 先用静态背景 | 检查对比度 |
| 测试 | 观察资源和刷新状态 | 异常关闭 |
| 恢复 | 关闭插件并核原生界面 | 不一致检查宿主状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 接入 | 本地存储未知 | 版本和素材核查 | 兼容未测 |
| 使用 | GPU 和视频资源未知 | 对比度与动画检查 | 性能未测 |
| 恢复 | 成本未知 | 切换并验证 | 存储可能失败 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 外观 | 主题层和设置入口 | 审美与可读性 |
| 关闭 | 删除部分属性并释放效果 | 所有 DOM 无残留 |
| 偏好 | 本地保存开关 | 存储受限后持久 |

> **思考**：[Q03](#research-q03) 存储失败仅保留当前页状态，不能保证刷新后关闭或所有视觉效果可访问。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 非官方修补主题提供视觉选项，[Q02](#research-q02) 将设置和生命周期接入宿主。

[Q03](#research-q03) 存储失败时开关只在当前页保持，减少动态只查到流体分支。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 存储失败仅保留当前页状态，不能保证刷新后关闭或所有视觉效果可访问。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在备份的隔离 profile 先用静态背景检查对比度与性能，异常时回原生主题。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查主题与开关代表路径；未运行宿主或浏览器。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、src/client/index.ts、src/client/theme-layer.ts、src/client/fluid-shader.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定 README、清单、客户端设置、主题层及流体代表路径；未运行 DSH 或比对全部发布构建。
- 下一步：[Q05](#research-q05) 核现有设置后比较状态摘要及存储故障。

**分析版本**

- **仓库**：[Aliww2468/dsh-client-ui-aqua-patched](https://github.com/Aliww2468/dsh-client-ui-aqua-patched)
- **版本号**：1.3.1-patch.4（[固定提交 df0b087](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/tree/df0b08707547ff811f691881594a919bb3818690)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设显示实际状态与持久化缺口可帮助切回原主题；未验证。

[Q05](#research-q05) 核现有设置后比较状态摘要及存储故障。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 999 | — | — | 11088 |
| .js | source | 6 | 4053 | 3539 | 585 | — |
| .tsx | source | 4 | 584 | 411 | 156 | — |
| .ts | source | 19 | 3924 | 2894 | 749 | — |
| .mjs | source | 3 | 261 | 211 | 25 | — |
| .mjs | test | 1 | 43 | 36 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对主题接入、存储、退出与兼容性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Aqua 主题相对宿主原生外观提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README.zh.md:1-17 表明这是非官方修补版，提供玻璃质感与背景；相对宿主默认主题，增量是可配置视觉层而非改变任务能力。package.json:1-4、14 也标记分支与版本。审美、可访问性和性能不能从图片或功能数推导，也未运行宿主对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-17](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/README.zh.md#L1-L17)

作者说明修补分支及主题。

<details>
<summary>查看原文（17行）</summary>

```text
> **非官方修补分支 —— `1.3.1-patch.4` 修复鼠标悬停输入框时底部弹出横向滚动条的问题。**
> 本次修复与验证范围见 **[输入框悬停修复说明](REPAIR-HOVER.md)**。
> 桌面显示修复与验证范围见 **[桌面布局修复说明](REPAIR-DESKTOP.md)**。
> 上游 `dsh-client-ui-aqua@1.3.1`（npm，2026-08-17）与上游仓库 HEAD 在 DSH 0.1.2 线上均无法工作。
> 最初修补版已在 DSH 0.1.2-rc.1 验证；patch.2 继续适配 0.2.1-rc.3 的版本校验、设置入口与图标。
> 本次验证范围见 **[DSH 0.2 修复说明](REPAIR-0.2.md)**。
> 诊断、逐项改动、证据与注意事项见 **[REPAIR.md](REPAIR.md)**。与上游作者无隶属、无背书、
> 无维护关系；按 **AGPL-3.0-only** 分发（见[许可证](#许可证)）。本分支所依据的上游源码说明
> 见[上游与本分支](#上游与本分支)。

# dsh-client-ui-aqua —— DeepSeek Harness 玻璃质感主题

[English](README.md) | 中文

## 一句话价值

装上它，DSH 网页端立刻变成磨砂玻璃——顶栏、侧边栏、输入框、统计行与轨迹视图化作悬浮玻璃片，背景可以是流动的流体板，也可以是你自己的壁纸。关掉唯一的总开关，界面完全还原，不留任何残留。
```

</details>

**依据 2 · 源码核查**：[package.json:1-4](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/package.json#L1-L4)

包的主题定位。

```text
{
  "name": "dsh-client-ui-aqua",
  "description": "Aqua: a highly customizable glassmorphism theme for the DSH Web surface — patched for DSH 0.1.2-rc.1 and 0.2.1-rc.3 (unofficial fork)",
  "keywords": [
```

**依据 3 · 源码核查**：[package.json:14-14](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/package.json#L14-L14)

固定版本。

```text
  "version": "1.3.1-patch.4",
```

#### 缺口

- 未进行视觉和无障碍对照
  **影响**：不能证明可读性和性能改善
  **进一步探讨**：固定环境比较原生主题。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 主题和设置如何接入及关闭？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

index.ts:35-46 注入 theme、slots、locale 并创建 AquaLayer；89-99 的开关调用 setEnabled，175-213 注册不同版本插件设置和通用外观行。theme-layer.ts:609-614 保存启用并同步，982-1008 在 unmount 删除自有属性、释放部分效果；这支持具体清理路径，不证明所有第三方 DOM 和样式都无残留。源码与发布 lib 的构建一致性、宿主安装均未复验。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:35-46](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/index.ts#L35-L46)

服务接线及创建主题层。

<details>
<summary>查看原文（12行）</summary>

```text
export const inject = ['theme', 'slots', 'locale']

/**
 * Client plugin body.
 * @param ctx - client cordis context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-aqua: settings dictionaries')

  // The layer owns its lifecycle: enable flag, token stack, and CSS attribute
  // are all effects released on disable/dispose.
  const layer = new AquaLayer(ctx)
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:89-99](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/index.ts#L89-L99)

开关更新层。

<details>
<summary>查看原文（11行）</summary>

```text
  const pluginInjected = (actions: BoundActions<typeof pluginStore>): AquaPluginCardInjected => {
    pluginBound = actions
    // Re-sync from the layer so no flip is lost between registration and
    // first render (the store's revision guard drops stale duplicates).
    sync()
    return {
      setEnabled: (enabled) => {
        layer.setEnabled(enabled)
        sync()
      },
    }
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:175-213](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/index.ts#L175-L213)

设置入口。

<details>
<summary>查看原文（39行）</summary>

```text
      },
    }
  }

  // Master switch card in the Plugins configurable tab.
  // `key` is what DSH 0.1.2 dispatches on: since the slot became keyed, the tab
  // renders one card per settings namespace the host serves, so the key has to
  // match the namespace the node half registers (`aqua`) or the card silently
  // never renders. `id` is kept for the older list-shaped slot.
  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    id: 'aqua',
    key: 'aqua',
    order: 5,
    store: pluginStore,
    locale: NS,
    inject: pluginInjected,
  }, AquaPluginCard))

  // DSH 0.2 removed settings.plugin.item and dispatches package configuration
  // by package name. inject() waits for the slot, so both generations can use
  // their own entry without version parsing or registering undeclared slots.
  ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
    name: 'plugins.bundle.config',
    key: 'dsh-client-ui-aqua',
    store: pluginStore,
    locale: NS,
    inject: pluginInjected,
  }, AquaPluginPage))

  // Glass knobs row in the General section, directly under Appearance (10).
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'aqua',
    order: 11,
    store: appearanceStore,
    locale: NS,
    inject: appearanceInjected,
  }, AquaAppearanceRow))
```

</details>

**依据 4 · 源码核查**：[src/client/theme-layer.ts:609-614](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/theme-layer.ts#L609-L614)

启用同步。

```text
  setEnabled(value: boolean): void {
    if (value === this.enabled) return
    this.enabled = value
    writeEnabled(value)
    this.sync()
  }
```

**依据 5 · 源码核查**：[src/client/theme-layer.ts:982-1008](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/theme-layer.ts#L982-L1008)

卸载属性与部分效果。

<details>
<summary>查看原文（27行）</summary>

```text
  private unmount(): void {
    document.documentElement.removeAttribute(AQUA_ATTRIBUTE)
    document.documentElement.removeAttribute('data-dsh-float')
    document.documentElement.removeAttribute('data-dsh-compat')
    document.documentElement.removeAttribute('data-dsh-aqua-wallpaper')
    document.documentElement.removeAttribute('data-dsh-aqua-media')
    document.documentElement.removeAttribute(SPOTLIGHT_ATTRIBUTE)
    document.documentElement.removeAttribute(PRESS_ATTRIBUTE)
    this.spotlightDisposer?.()
    this.spotlightDisposer = undefined
    this.whaleHandle?.dispose()
    this.whaleHandle = undefined
    this.meshHandle?.dispose()
    this.meshHandle = undefined
    this.tokenDisposer?.()
    this.tokenDisposer = undefined
    if (this.videoObjectUrl !== undefined) {
      URL.revokeObjectURL(this.videoObjectUrl)
      this.videoObjectUrl = undefined
      this.videoBlobId = undefined
    }
    this.teardownFluid()
    removeAmbientScene()
    removePageFades()
    this.seamDisposer?.()
    this.seamDisposer = undefined
  }
```

</details>

#### 缺口

- 未比对全部构建产物和真实宿主
  **影响**：无法证明完全恢复
  **进一步探讨**：运行固定构建开关并比较 DOM 与视觉。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 存储、动画和兼容失败的边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

theme-layer.ts:198-214 读不到开关时用默认值，写失败仅当前标签内生效；下次刷新不保证保留关闭。fluid-shader.ts:468-482 检查 prefers-reduced-motion，不能据此证明所有动态元素都遵循该设置；README.zh.md:1-8 的兼容和修补验证是作者声明，本轮未重跑。主题依赖宿主 DOM 与浏览器渲染，未知版本可能局部失效、对比不足或耗资源。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/theme-layer.ts:198-214](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/theme-layer.ts#L198-L214)

启用状态存储及失败回退。

<details>
<summary>查看原文（17行）</summary>

```text
/** Read the persisted enable flag (absent storage means on). */
function readEnabled(): boolean {
  try {
    const raw = localStorage.getItem(AQUA_ENABLED_KEY)
    return raw === null ? DEFAULT_ENABLED : raw === 'true'
  } catch {
    return DEFAULT_ENABLED
  }
}

/** Persist the enable flag (storage failures keep the in-memory state). */
function writeEnabled(value: boolean): void {
  try {
    localStorage.setItem(AQUA_ENABLED_KEY, String(value))
  } catch {
    /* in-memory state still applies for this tab */
  }
```

</details>

**依据 2 · 源码核查**：[src/client/fluid-shader.ts:468-482](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/fluid-shader.ts#L468-L482)

流体组件读取减少动态效果偏好。

<details>
<summary>查看原文（15行）</summary>

```text
    dispose: () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
    },
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    frame(performance.now())
    cancelAnimationFrame(raf)
    return handle
  }

  raf = requestAnimationFrame(frame)
  return handle
}
```

</details>

**依据 3 · 作者声明**：[README.zh.md:1-8](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/README.zh.md#L1-L8)

作者说明修复和验证范围。

```text
> **非官方修补分支 —— `1.3.1-patch.4` 修复鼠标悬停输入框时底部弹出横向滚动条的问题。**
> 本次修复与验证范围见 **[输入框悬停修复说明](REPAIR-HOVER.md)**。
> 桌面显示修复与验证范围见 **[桌面布局修复说明](REPAIR-DESKTOP.md)**。
> 上游 `dsh-client-ui-aqua@1.3.1`（npm，2026-08-17）与上游仓库 HEAD 在 DSH 0.1.2 线上均无法工作。
> 最初修补版已在 DSH 0.1.2-rc.1 验证；patch.2 继续适配 0.2.1-rc.3 的版本校验、设置入口与图标。
> 本次验证范围见 **[DSH 0.2 修复说明](REPAIR-0.2.md)**。
> 诊断、逐项改动、证据与注意事项见 **[REPAIR.md](REPAIR.md)**。与上游作者无隶属、无背书、
> 无维护关系；按 **AGPL-3.0-only** 分发（见[许可证](#许可证)）。本分支所依据的上游源码说明
```

**依据 4 · 源码核查**：[src/client/theme-layer.ts:982-1008](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/theme-layer.ts#L982-L1008)

部分清理逻辑。

<details>
<summary>查看原文（27行）</summary>

```text
  private unmount(): void {
    document.documentElement.removeAttribute(AQUA_ATTRIBUTE)
    document.documentElement.removeAttribute('data-dsh-float')
    document.documentElement.removeAttribute('data-dsh-compat')
    document.documentElement.removeAttribute('data-dsh-aqua-wallpaper')
    document.documentElement.removeAttribute('data-dsh-aqua-media')
    document.documentElement.removeAttribute(SPOTLIGHT_ATTRIBUTE)
    document.documentElement.removeAttribute(PRESS_ATTRIBUTE)
    this.spotlightDisposer?.()
    this.spotlightDisposer = undefined
    this.whaleHandle?.dispose()
    this.whaleHandle = undefined
    this.meshHandle?.dispose()
    this.meshHandle = undefined
    this.tokenDisposer?.()
    this.tokenDisposer = undefined
    if (this.videoObjectUrl !== undefined) {
      URL.revokeObjectURL(this.videoObjectUrl)
      this.videoObjectUrl = undefined
      this.videoBlobId = undefined
    }
    this.teardownFluid()
    removeAmbientScene()
    removePageFades()
    this.seamDisposer?.()
    this.seamDisposer = undefined
  }
```

</details>

#### 缺口

- 未测试其他动画、性能和版本
  **影响**：不能保证完全可访问或恢复
  **进一步探讨**：在多宿主和低性能环境测视觉及关闭。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用条件、资源成本和退出是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:41-55、62-65 明示 Web 客户端注入和部分 peer 范围；README.zh.md:1-8 声明修补版本，非官方分支。视频或动态效果可能使用 GPU、内存与电力，实际消耗未知，本地壁纸素材还需用户确认授权。先备份设置，在对应宿主测试静态模式、对比度和关闭开关；画面不清、性能下降或重启后状态不符时关闭插件并回原生主题。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:41-55](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/package.json#L41-L55)

Web 服务注入。

<details>
<summary>查看原文（15行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-store",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-theme",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-primitives"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[package.json:61-65](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/package.json#L61-L65)

许可与 peer。

```text
  "license": "AGPL-3.0-only",
  "peerDependencies": {
    "@deepseek-ai/dsh-client-locale": "^0.1.0-rc.5 || 0.2.1-rc.3",
    "@deepseek-ai/dsh-client-store": "^0.1.2-rc.1 || 0.2.1-rc.3",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.1.0-rc.5 || 0.2.1-rc.3",
```

**依据 3 · 作者声明**：[README.zh.md:1-8](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/README.zh.md#L1-L8)

非官方修补版本。

```text
> **非官方修补分支 —— `1.3.1-patch.4` 修复鼠标悬停输入框时底部弹出横向滚动条的问题。**
> 本次修复与验证范围见 **[输入框悬停修复说明](REPAIR-HOVER.md)**。
> 桌面显示修复与验证范围见 **[桌面布局修复说明](REPAIR-DESKTOP.md)**。
> 上游 `dsh-client-ui-aqua@1.3.1`（npm，2026-08-17）与上游仓库 HEAD 在 DSH 0.1.2 线上均无法工作。
> 最初修补版已在 DSH 0.1.2-rc.1 验证；patch.2 继续适配 0.2.1-rc.3 的版本校验、设置入口与图标。
> 本次验证范围见 **[DSH 0.2 修复说明](REPAIR-0.2.md)**。
> 诊断、逐项改动、证据与注意事项见 **[REPAIR.md](REPAIR.md)**。与上游作者无隶属、无背书、
> 无维护关系；按 **AGPL-3.0-only** 分发（见[许可证](#许可证)）。本分支所依据的上游源码说明
```

**依据 4 · 源码核查**：[src/client/theme-layer.ts:198-214](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/theme-layer.ts#L198-L214)

存储不可用时回退。

<details>
<summary>查看原文（17行）</summary>

```text
/** Read the persisted enable flag (absent storage means on). */
function readEnabled(): boolean {
  try {
    const raw = localStorage.getItem(AQUA_ENABLED_KEY)
    return raw === null ? DEFAULT_ENABLED : raw === 'true'
  } catch {
    return DEFAULT_ENABLED
  }
}

/** Persist the enable flag (storage failures keep the in-memory state). */
function writeEnabled(value: boolean): void {
  try {
    localStorage.setItem(AQUA_ENABLED_KEY, String(value))
  } catch {
    /* in-memory state still applies for this tab */
  }
```

</details>

**依据 5 · 源码核查**：[src/client/theme-layer.ts:982-1008](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/theme-layer.ts#L982-L1008)

清理代表路径。

<details>
<summary>查看原文（27行）</summary>

```text
  private unmount(): void {
    document.documentElement.removeAttribute(AQUA_ATTRIBUTE)
    document.documentElement.removeAttribute('data-dsh-float')
    document.documentElement.removeAttribute('data-dsh-compat')
    document.documentElement.removeAttribute('data-dsh-aqua-wallpaper')
    document.documentElement.removeAttribute('data-dsh-aqua-media')
    document.documentElement.removeAttribute(SPOTLIGHT_ATTRIBUTE)
    document.documentElement.removeAttribute(PRESS_ATTRIBUTE)
    this.spotlightDisposer?.()
    this.spotlightDisposer = undefined
    this.whaleHandle?.dispose()
    this.whaleHandle = undefined
    this.meshHandle?.dispose()
    this.meshHandle = undefined
    this.tokenDisposer?.()
    this.tokenDisposer = undefined
    if (this.videoObjectUrl !== undefined) {
      URL.revokeObjectURL(this.videoObjectUrl)
      this.videoObjectUrl = undefined
      this.videoBlobId = undefined
    }
    this.teardownFluid()
    removeAmbientScene()
    removePageFades()
    this.seamDisposer?.()
    this.seamDisposer = undefined
  }
```

</details>

#### 缺口

- 未测宿主、资源、许可素材和完整恢复
  **影响**：成本和兼容未知
  **进一步探讨**：隔离 profile 验证对比度、性能和退出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样帮助用户判断当前主题是否适合工作？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有总开关、视觉设置和流体的减少动态效果检测已覆盖基本控制；只加另一个开关没有增量。设想本地显示当前模式、动态效果、对比度待人工确认和是否已持久化的摘要，允许一键回原主题，并在无法判断时显示未知；不声称自动无障碍认证。对照现有设置，测存储受限、系统减少动态、低性能及低对比度案例，比较错误以为已关闭、找回设置所需时间与误报；若无法准确反映实际状态或增加误导则否定。先核现有设置是否已有等价状态。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:89-99](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/index.ts#L89-L99)

已有总开关。

<details>
<summary>查看原文（11行）</summary>

```text
  const pluginInjected = (actions: BoundActions<typeof pluginStore>): AquaPluginCardInjected => {
    pluginBound = actions
    // Re-sync from the layer so no flip is lost between registration and
    // first render (the store's revision guard drops stale duplicates).
    sync()
    return {
      setEnabled: (enabled) => {
        layer.setEnabled(enabled)
        sync()
      },
    }
```

</details>

**依据 2 · 源码核查**：[src/client/theme-layer.ts:198-214](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/theme-layer.ts#L198-L214)

存储失败时状态边界。

<details>
<summary>查看原文（17行）</summary>

```text
/** Read the persisted enable flag (absent storage means on). */
function readEnabled(): boolean {
  try {
    const raw = localStorage.getItem(AQUA_ENABLED_KEY)
    return raw === null ? DEFAULT_ENABLED : raw === 'true'
  } catch {
    return DEFAULT_ENABLED
  }
}

/** Persist the enable flag (storage failures keep the in-memory state). */
function writeEnabled(value: boolean): void {
  try {
    localStorage.setItem(AQUA_ENABLED_KEY, String(value))
  } catch {
    /* in-memory state still applies for this tab */
  }
```

</details>

**依据 3 · 源码核查**：[src/client/fluid-shader.ts:468-482](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/fluid-shader.ts#L468-L482)

已有减少动态检查。

<details>
<summary>查看原文（15行）</summary>

```text
    dispose: () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
    },
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    frame(performance.now())
    cancelAnimationFrame(raf)
    return handle
  }

  raf = requestAnimationFrame(frame)
  return handle
}
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:205-213](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/df0b08707547ff811f691881594a919bb3818690/src/client/index.ts#L205-L213)

已有外观设置行。

```text
  // Glass knobs row in the General section, directly under Appearance (10).
  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'aqua',
    order: 11,
    store: appearanceStore,
    locale: NS,
    inject: appearanceInjected,
  }, AquaAppearanceRow))
```

#### 缺口

- 未穷尽设置界面与无原型
  **影响**：新增性和收益未知
  **进一步探讨**：核现有状态后对照存储故障与视觉样本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
