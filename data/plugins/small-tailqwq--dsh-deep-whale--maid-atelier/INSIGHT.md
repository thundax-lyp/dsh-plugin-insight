# maid-atelier 深海女仆工坊

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[dc56112](https://github.com/Small-tailqwq/dsh-deep-whale/tree/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/maid-atelier)

<!-- BEGIN META -->
[![GitHub ★ 2,879](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C879&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Small-tailqwq/dsh-deep-whale) [![npm 30d 59,613](https://img.shields.io/static/v1?label=npm+30d&message=59%2C613&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-maid-atelier) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-maid-atelier)
<!-- END META -->

> **功能**：为DSH Web加入鲸鱼娘女仆主题、亮暗背景、角色装饰和可配置侧栏展示。

> **亮点**：[Q02](#research-q02)、[Q03](#research-q03) 将美术、状态装饰、素材交付和释放归属集成为可逆主题，减少手写CSS接线；不改变模型或业务能力。

> **主要限制**：[Q03](#research-q03) DOM与宿主样式契约变化可能使主题失配或遮挡核心控件，版本声明和清理函数存在不等于交互与停用已验收。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 皮肤改变什么，谁值得采用？](#detail-section-15)
  - [Q02 · 展示作用域与资源、清理怎样实现？](#detail-section-16)
  - [Q03 · 可逆主题的贡献、版本风险和成本是什么？](#detail-section-17)
  - [Q04 · 核心交互不遮挡检查能否使主题升级更可靠？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：偏好角色主题的DSH用户个性化界面，同时保持输入与阅读可用。

官方主题与自定义CSS为简单替代，不宣称模型能力或任务效率提升。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 女仆主题 | 个性化DSH展示 | 不改变模型能力 |
| 资源与清理 | 包内素材和切换还原 | 真实宿主兼容未验 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 退路 |
|---|---|---|
| 匹配DSH Web版本 | DOM与样式接线 | 不匹配先官方主题 |
| 完整包内图片 | 角色和背景 | 缺产物则重装完整包 |
| 单皮肤/管理器互斥 | 避免样式叠加 | 不叠装不同发行方式 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与判据 | 失败处理 |
|---|---|---|
| 核对发行方式 | 用户确认非叠装 | 清理重复主题 |
| 选单皮肤启用 | 用户检查输入与阅读 | 受影响立即官方 |
| 切主题并停用检查 | 用户核对清理 | 保留故障版本和截图 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | 包与图片下载，资源未知 | 版本/单皮肤确认，未知 |
| 持续 | 浏览器绘制与图片缓存，未知 | 升级复查交互，未知 |
| 失败恢复 | 重载资源，未知 | 切官方、检查残留，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 任务 | 支持 | 缺口 |
|---|---|---|
| 角色主题展示 | 作用域、图片和状态装饰 | 真实可读性/性能 |
| 停用恢复 | 自有资源清理逻辑 | 宿主实际残留未知 |

> **思考**：[Q03](#research-q03) DOM与宿主样式契约变化可能使主题失配或遮挡核心控件，版本声明和清理函数存在不等于交互与停用已验收。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q02](#research-q02)、[Q03](#research-q03) 将美术、状态装饰、素材交付和释放归属集成为可逆主题，减少手写CSS接线；不改变模型或业务能力。

可借鉴原样式快照、自有节点/observer释放与hash图片allowlist；移植需重核DOM语义和素材授权，不能只复制全局选择器。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q03](#research-q03) DOM与宿主样式契约变化可能使主题失配或遮挡核心控件，版本声明和清理函数存在不等于交互与停用已验收。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q03](#research-q03) 仅凭风格偏好试用，先确认核心控件不遮挡；单皮肤最小配置，多皮肤按合集管理器规则处理，不叠装dsh-web适配版。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已检查展示、清理和资源路由；未运行，交互回归清单是假设。

- 已检查：作者 README、包清单、源码路径 maid-atelier/README.md、maid-atelier/package.json、maid-atelier/skin.json、maid-atelier/src/index.ts、maid-atelier/src/client/index.ts、shared/skin-assets.ts、README.md 及固定范围 inventory；组件：maid-atelier。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码展示与静态资源抽读；不运行截图、浏览器、目标测试或宿主安装，不将代码规模当用户价值。
- 下一步：隔离宿主测试亮暗、窄屏、工作台与停用，再注入遮挡做兼容回归；未执行。

**分析版本**

- **仓库**：[Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale)
- **版本号**：0.1.9（[固定提交 dc56112](https://github.com/Small-tailqwq/dsh-deep-whale/tree/dc561129f3bb3bc94c4a7c3e4007eaa274650d31)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证假设是跨主题/宽度的核心可点击区域回归并绑定宿主版本，以遮挡注入比较漏检和维护成本；无改善即停止。

隔离宿主测试亮暗、窄屏、工作台与停用，再注入遮挡做兼容回归；未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 89 | — | — | 1678 |
| .js | source | 2 | 3451 | 3095 | 417 | — |
| .ts | source | 27 | 3779 | 2980 | 517 | — |
| .ts | test | 12 | 5933 | 4911 | 477 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 38](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=38&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+created%3A2026-09-27T02%3A07%3A15.875Z..2026-10-27T02%3A07%3A15.875Z) [![近30天关闭 41](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=41&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A07%3A15.875Z..2026-10-27T02%3A07%3A15.875Z)



统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查可逆主题、同源素材与宿主DOM兼容的边界。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 皮肤改变什么，谁值得采用？

**研究主题**：场景与需求、采用判断

#### 完整回答

它面向喜爱鲸鱼娘女仆主题、愿为界面偏好承担兼容维护的DSH Web用户，增加背景、角色层、侧栏与图标展示。合格结果是亮暗主题和窄屏下仍能阅读、输入、操作核心控件，停用后恢复；不应按装饰数量推断效率或模型质量。简单替代是官方主题或用户CSS。本皮肤包装角色与多处视觉状态，不给模型增加工具、推理或业务功能；个性化偏好本身可以有价值，但没有用户实测证明舒适度或节时。

#### 证据与依据

**依据 1 · 作者声明**：[maid-atelier/README.md:1-12](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/maid-atelier/README.md#L1-L12)

作者明确纯展示层及背景、角色、同源资源。

<details>
<summary>查看原文（12行）</summary>

```text
# maid-atelier · 深海女仆工坊

DeepSeek Harness Web GUI 的深海女仆工坊皮肤：两位鲸鱼娘女仆、深海蓝蕾丝与 Q 版侧栏，把 DSH 布置成女仆工坊。纯展示层客户端插件——`apply()` 设置 `data-dsh-maid-atelier` 作用域、按亮/暗主题切换宫殿背景、以独立透明层挂载双女仆角色、装饰可折叠侧栏,并为加载/思考/工具运行状态预留稳定动画钩子。effect 销毁器还原全部 CSS/DOM 写入;不注入服务、不发出 Cordis 事件、不触达模型请求。

## 特性

- 双女仆工坊场景对话背景(亮/暗自动切换)
- 深海蓝、陶瓷白、长春花蓝、柔金构成的可热切换 UI 覆盖层
- Q 版侧栏角色与视口装饰、favicon
- 启动插件加载失败时，默认以左右独立的双女仆立绘装饰原生错误报告，支持窄屏重排，遵循现有立绘显示与时段设置。此效果依赖皮肤已成功执行；皮肤自身或内核尚未加载时保留原生页面。
- 双女仆与宫殿背景整层挂在**对话区(centerCol)内部**:随聊天区域尺寸自适应(右/下工作台推开聊天区时背景与女仆同步收缩,不再固定于视口),左女仆贴聊天区左下、右女仆贴右下,均位于聊天记录与输入器之下;聊天态与着陆页按比例切换构图
- 图片素材随包分发，由皮肤自己的同源路由提供(不内嵌进 client bundle),激活不依赖任何远程 URL 或外部资源服务器
```

</details>

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 展示作用域与资源、清理怎样实现？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

client apply捕获body原样式和状态，设置自有作用域、角色和装饰，注册MutationObserver观察宿主结构与状态。effect销毁器删除自有dataset、释放lease、移除事件/定时器、disconnect observer、还原原样式并移除ownedNodes，体现明确资源所有权；函数存在不证明真实宿主所有边缘都清干净。后端index调用共享installSkinAssets，按包内allowlist和64位hash文件名提供同源只读GET/HEAD，缓存immutable而非依赖外部图片服务器。因此不是完全“只有CSS”，仍有本地资源路由，但所查路径没有模型请求机制。需要宿主DOM/slot契约、完整图片产物与对应版本。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/src/client/index.ts:508-528](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/maid-atelier/src/client/index.ts#L508-L528)

初始化记录原状态与资源lease。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: PanelContext): void {
  const body = document.body
  installPanelPageState(ctx, body, 'data-maid-panel-page')
  installMaidRelationalMarkers(ctx)
  ctx.effect(() => installMaidCustomization(), 'ui-skin-maid-atelier: customization declaration')
  // The loader claims untagged <style> tags for whichever plugin loads last and
  // sweeps them when it unloads; hand other plugins' tags back before that.
  ctx.effect(() => () => releaseClaimedStyles(), 'ui-skin-maid-atelier: release styles claimed by the loader')
  ctx.effect(() => installMaidBootError(), 'ui-skin-maid-atelier: boot failure presentation')
  const originalTitle = document.title
  const layoutResizeLease = createBodyAttributeLease(body, 'data-maid-layout-resizing')
  const lowPowerLease = createBodyAttributeLease(body, 'data-maid-low-power')
  const foreignShellLease = createBodyAttributeLease(body, 'data-maid-shell', 'foreign')
  const previous = new Map<string, string>()
  for (const property of BACKDROP_PROPERTIES) {
    previous.set(property, body.style.getPropertyValue(property))
  }
  const previousProjectedStates = new Map<string, string | null>()
  for (const attribute of Object.values(PROJECTED_STATE_ATTRIBUTES)) {
    previousProjectedStates.set(attribute, body.getAttribute(attribute))
  }
```

</details>

**依据 2 · 源码核查**：[maid-atelier/src/client/index.ts:556-592](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/maid-atelier/src/client/index.ts#L556-L592)

清理还原链路。

<details>
<summary>查看原文（37行）</summary>

```text
  ctx.effect(() => () => {
    delete body.dataset.dshMaidAtelier
    delete body.dataset.maidComposerMotion
    delete body.dataset.maidSidebarCompact
    delete body.dataset.maidSidebarSize
    for (const [attribute, value] of previousProjectedStates) {
      if (value === null) body.removeAttribute(attribute)
      else body.setAttribute(attribute, value)
    }
    disposeMaidComposerCapsule()
    disposeMaidComposerScroll()
    disposeMaidTableCards()
    if (composerMotionTimer !== undefined) clearTimeout(composerMotionTimer)
    if (viewportResizeTimer !== undefined) clearTimeout(viewportResizeTimer)
    if (handleViewportResize !== undefined) window.removeEventListener('resize', handleViewportResize)
    layoutResizeLease.release()
    lowPowerLease.release()
    foreignShellLease.release()
    if (railSearchFocusFrame !== undefined) cancelAnimationFrame(railSearchFocusFrame)
    if (recoverRailSearchFocus !== undefined) {
      document.removeEventListener('click', recoverRailSearchFocus)
    }
    observer?.disconnect()
    clearSidebarCarriers()
    taggedSettingsOverlay?.removeAttribute(SETTINGS_OVERLAY_ATTRIBUTE)
    taggedSettingsOverlay = null
    themeColorObserver?.disconnect()
    if (titlebarOverlay !== undefined && syncTitlebarHeight !== undefined) {
      titlebarOverlay.removeEventListener('geometrychange', syncTitlebarHeight)
    }
    if (titlebarSyncFrame !== undefined) cancelAnimationFrame(titlebarSyncFrame)
    titlebarSyncFrame = undefined
    resizeObserver?.disconnect()
    for (const [property, value] of previous) {
      body.style.setProperty(property, value)
    }
    ownedNodes.forEach(element => element.remove())
```

</details>

**依据 3 · 源码核查**：[maid-atelier/src/client/index.ts:1015-1037](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/maid-atelier/src/client/index.ts#L1015-L1037)

观察宿主结构和属性，体现耦合边界。

<details>
<summary>查看原文（23行）</summary>

```text
  // this observer. Keep structural decoration in the MutationObserver checkpoint
  // before paint: delaying every change made the wide/rail hand-off visibly late.
  // Skin-owned insertions are ignored so decorating a React-owned node cannot
  // schedule a redundant whole-sidebar pass.
  observer = new MutationObserver((records) => {
    let sidebarStructureChanged = false
    let workspaceStateChanged = false
    let backdropChanged = false
    let composerChanged = false
    let chatStructureChanged = false
    let settingsStateChanged = false
    let projectedStateChanged = false
    let rootLayoutChanged = false
    for (const record of records) {
      const target = record.target instanceof Element ? record.target : undefined
      if (target?.closest(TERMINAL_SELECTOR) !== null) continue

      if (record.type === 'attributes') {
        const conversationPhaseChanged = record.attributeName === 'data-phase'
          && isConversationPhaseRoot(target)
        if (record.attributeName === 'aria-expanded'
          && target !== undefined
          && target.closest("[data-slot='sidebar.settings']") !== null) {
```

</details>

**依据 4 · 源码核查**：[maid-atelier/src/index.ts:1-8](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/maid-atelier/src/index.ts#L1-L8)

后端资源接线。

```text
import type { Context } from '@deepseek-ai/cordis'
import { installSkinAssets } from '../../shared/skin-assets.ts'
import files from '../assets/runtime/manifest.json'

/** Serve only this package's immutable presentation assets while the skin is enabled. */
export function apply(ctx: Context): void {
  installSkinAssets(ctx, 'maid-atelier', new URL('../assets/runtime/', import.meta.url), files)
}
```

**依据 5 · 源码核查**：[shared/skin-assets.ts:9-47](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/shared/skin-assets.ts#L9-L47)

allowlist、只读路由和不可变缓存。

<details>
<summary>查看原文（39行）</summary>

```text
/** Public, immutable artwork only. Paths come from the shipped allowlist, never from disk traversal. */
export function installSkinAssets(ctx: Context, id: string, directory: URL, files: readonly string[]): void {
  const prefix = `/skin-assets/${id}`
  const allowed = new Set(files)
  ctx.inject(['webServer'], webCtx => {
    const server = webCtx.get('webServer') as AssetServer
    webCtx.effect(() => server.register({ kind: 'prefix', path: prefix, handler: async (req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { Allow: 'GET, HEAD' }).end()
        return
      }
      const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
      const file = pathname.slice(prefix.length + 1)
      if (!pathname.startsWith(`${prefix}/`) || !allowed.has(file) || !/^[a-f0-9]{64}\.(png|webp)$/.test(file)) {
        res.writeHead(404).end()
        return
      }
      let bytes: Buffer
      try {
        bytes = await readFile(new URL(file, directory))
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
        res.writeHead(404).end()
        return
      }
      const etag = `"${file.split('.')[0]}"`
      const headers = {
        'Content-Type': file.endsWith('.webp') ? 'image/webp' : 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        ETag: etag,
      }
      if (req.headers['if-none-match']?.split(',').some(value => value.trim().replace(/^W\//, '') === etag || value.trim() === '*')) {
        res.writeHead(304, headers).end()
        return
      }
      res.writeHead(200, { ...headers, 'Content-Length': bytes.length })
      res.end(req.method === 'HEAD' ? undefined : bytes)
    } }), `${id}: packaged artwork`)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 可逆主题的贡献、版本风险和成本是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑、效果与总成本

#### 完整回答

贡献是把完整美术主题、宿主状态装饰与可释放资源组织为皮肤包，相对手工CSS减少素材接线与清理工作，常规DOM/观察机制不作算法创新。主要质疑是宿主结构改变后选择器与装饰仍可能遮挡输入或失配；skin.json声明兼容与README回退说明只能减少已知不匹配，不能证明新宿主正常。装多个皮肤需管理器互斥，不与dsh-web适配版叠装。首次要确认宿主版本和包/图片一致，持续需升级复查阅读与交互，失败回官方界面。现金无独立服务的源码线索但未计下载/资源与维护，不填0；时间未知。所查README区分MIT代码与非商业美术许可，应按各自素材条件使用，不能把代码MIT扩展为全部美术无限复用。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/skin.json:16-24](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/maid-atelier/skin.json#L16-L24)

兼容声明与稳定wiring身份，不等于运行验收。

```text
  ],
  "accent": "#c5a468",
  "bodyAttr": "data-dsh-maid-atelier",
  "dshCompatibility": "0.2.1rc2",
  "package": "@smalltailqwq/dsh-client-ui-skin-maid-atelier",
  "wiring": {
    "id": "ui-skin-maid-atelier",
    "bundleWired": false
  },
```

**依据 2 · 作者声明**：[README.md:36-50](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/README.md#L36-L50)

两种发行方式不可叠装与多皮肤需管理器。

<details>
<summary>查看原文（15行）</summary>

```text
> 如果你用的是 dsh-web（装过 `@linxin666/dsh-web-all`），请直接在 dsh-web 自带的皮肤中心里安装 `maid-atelier` 和 `orca-link`，不要再运行下面的命令。两边的皮肤是分别适配的，装在同一个 profile 里会让界面显示错乱。

### 官方桌面版

1. 按需选择一套或多套皮肤。打开侧栏「插件」，点击「添加插件」，逐个填入下面对应的 npm 包名并安装。

   | 插件 | npm 包名 |
   |---|---|
   | [maid-atelier](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-maid-atelier) | `@smalltailqwq/dsh-client-ui-skin-maid-atelier` |
   | [orca-link](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-orca-link) | `@smalltailqwq/dsh-client-ui-skin-orca-link` |
   | [皮肤管理器](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-deep-whale-manager) | `@smalltailqwq/dsh-client-ui-skin-deep-whale-manager` |

2. **只装一套皮肤**时，管理器可选；不装就无法使用配置面板、图形化版本兼容放行和自动多皮肤互斥管理。**同时装多套皮肤必须安装并保持管理器启用**，否则皮肤同时启用会让界面错乱。管理器一旦安装，即使只用一套皮肤也应保持启用。安装完成后按提示启用插件，然后**重启一次 DSH**。
3. 如果安装了皮肤管理器，重启后打开「设置 → 皮肤管理」。首次启动若仍显示官方界面，到这里选择要启用的皮肤即可。

```

</details>

**依据 3 · 作者声明**：[maid-atelier/README.md:37-47](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/maid-atelier/README.md#L37-L47)

代码与美术许可/来源分开。

<details>
<summary>查看原文（11行）</summary>

```text

皮肤素材为衍生创作,署名链(详见 `NOTICE`):

1. **一创 上善**（[Pixiv](https://www.pixiv.net/users/62155430) · [Bilibili：上善无形](https://b23.tv/8h5L4xz)）—— 鲸鱼娘角色形象原作者
2. **二创 ZipZipPipe**（[Pixiv](https://www.pixiv.net/users/18604994) · [Bilibili：ZipZipPipe](https://b23.tv/Pnw6nG8)）—— 在其形象上加入 DeepSeek 元素的女仆鲸鱼娘二次设计(生成模型 GPT Image 2)
3. **三创(本皮肤)Small-tailqwq** —— DeepSeek 元素再设计

许可范围与 MIT 正文见 [LICENSE](LICENSE)，美术许可正文见 [LICENSE-ARTWORK](LICENSE-ARTWORK)，署名链见 [NOTICE](NOTICE)。

## 开发与构建

```

</details>

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 核心交互不遮挡检查能否使主题升级更可靠？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为输入器、发送、侧栏、工作台和错误页维护一组跨亮暗/窄屏的可点击区域与可见性检查，再把宿主版本绑定到皮肤验收结果，而不是仅声明版本。推导来自Q02的DOM耦合和Q03的失配风险；新增负担是宿主UI变化时维护检查与截图，不能用一个快照代表全部状态。最小验证在两个宿主版本、三种窗口宽度注入已知遮挡，比较仅版本声明与检查清单的漏检和维护分钟；不减少遮挡漏检或维护过重即停止。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/src/client/index.ts:1019-1037](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/maid-atelier/src/client/index.ts#L1019-L1037)

对结构和aria状态的观察提供回归检查的具体对象。

<details>
<summary>查看原文（19行）</summary>

```text
  observer = new MutationObserver((records) => {
    let sidebarStructureChanged = false
    let workspaceStateChanged = false
    let backdropChanged = false
    let composerChanged = false
    let chatStructureChanged = false
    let settingsStateChanged = false
    let projectedStateChanged = false
    let rootLayoutChanged = false
    for (const record of records) {
      const target = record.target instanceof Element ? record.target : undefined
      if (target?.closest(TERMINAL_SELECTOR) !== null) continue

      if (record.type === 'attributes') {
        const conversationPhaseChanged = record.attributeName === 'data-phase'
          && isConversationPhaseRoot(target)
        if (record.attributeName === 'aria-expanded'
          && target !== undefined
          && target.closest("[data-slot='sidebar.settings']") !== null) {
```

</details>

**依据 2 · 源码核查**：[maid-atelier/skin.json:16-24](https://github.com/Small-tailqwq/dsh-deep-whale/blob/dc561129f3bb3bc94c4a7c3e4007eaa274650d31/maid-atelier/skin.json#L16-L24)

兼容元数据是验收绑定入口。

```text
  ],
  "accent": "#c5a468",
  "bodyAttr": "data-dsh-maid-atelier",
  "dshCompatibility": "0.2.1rc2",
  "package": "@smalltailqwq/dsh-client-ui-skin-maid-atelier",
  "wiring": {
    "id": "ui-skin-maid-atelier",
    "bundleWired": false
  },
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
