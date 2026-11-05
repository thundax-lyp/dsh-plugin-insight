# Deep Whale 昼夜主题

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3f6c4f1](https://github.com/GGBond2424648901/deep-whale-day-night-theme/tree/3f6c4f14716d1e500f585be0c0d3c139c7a8a90b)

<!-- BEGIN META -->
[![GitHub ★ 130](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=130&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GGBond2424648901/deep-whale-day-night-theme)
<!-- END META -->

> **功能**：为 DSH Web 提供成套切换的昼夜皮肤

> **亮点**：[Q01](#research-q01) 统一替换角色场景、控件装饰和动效。

> **主要限制**：[Q03](#research-q03) 宿主 DOM、可读性与非商业分发范围影响采用。

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
  - [Q01 · 用户得到什么？](#detail-section-11)
  - [Q02 · 入口和清理怎样实现？](#detail-section-12)
  - [Q03 · 兼容与性能边界是什么？](#detail-section-13)
  - [Q04 · 分发与许可怎样界定？](#detail-section-14)
  - [Q05 · 如何验证体验？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户希望更换 DSH Web 昼夜外观。

使用内置浅色与深色主题。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 使用内置浅色与深色主题。 | 可直接比较 | 保留人工步骤 |
| Deep Whale 昼夜主题 | 统一替换角色场景、控件装饰和动效。 | 宿主 DOM、可读性与非商业分发范围影响采用。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 客户端挂载装饰和监听器并随宿主主题切换。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 个人用户希望更换 DSH Web 昼夜外观。 | 保留原流程 |
| 试验 | 客户端挂载装饰和监听器并随宿主主题切换。 | 观察固定版本 |
| 复核 | 在匹配宿主版本验证启停、键盘与降低动效。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 切换昼夜视觉时保持原输入与导航可用 | 主题可在保留关键操作的同时满足个人定制。 | 在匹配宿主版本验证启停、键盘与降低动效。 |

> **思考**：[Q03](#research-q03) 宿主 DOM、可读性与非商业分发范围影响采用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 统一替换角色场景、控件装饰和动效。

客户端 effect 对挂载的元素及监听器提供清理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 宿主 DOM、可读性与非商业分发范围影响采用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在匹配宿主版本验证启停、键盘与降低动效。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的切换昼夜视觉时保持原输入与导航可用。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/client/index.ts、src/client/motion.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的切换昼夜视觉时保持原输入与导航可用。未执行目标代码或实际宿主验证。
- 下一步：执行同样的键盘导航和消息输入脚本。

**分析版本**

- **仓库**：[GGBond2424648901/deep-whale-day-night-theme](https://github.com/GGBond2424648901/deep-whale-day-night-theme)
- **版本号**：0.1.12（[固定提交 3f6c4f1](https://github.com/GGBond2424648901/deep-whale-day-night-theme/tree/3f6c4f14716d1e500f585be0c0d3c139c7a8a90b)）
- **版本日期**：2026-08-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 主题可在保留关键操作的同时满足个人定制。

执行同样的键盘导航和消息输入脚本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1095 | — | — | 10114 |
| .js | source | 2 | 966 | 912 | 88 | — |
| .mjs | source | 4 | 346 | 289 | 26 | — |
| .ts | source | 12 | 1049 | 842 | 145 | — |
| .ts | test | 6 | 2092 | 1867 | 27 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/GGBond2424648901/deep-whale-day-night-theme/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：切换昼夜视觉时保持原输入与导航可用

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户得到什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者展示两组角色插画和配色，由原主题按钮切换。适合个人定制 DSH Web 外观。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-27](https://github.com/GGBond2424648901/deep-whale-day-night-theme/blob/3f6c4f14716d1e500f585be0c0d3c139c7a8a90b/README.md#L15-L27)

作者描述成套昼夜视觉和截图版本

<details>
<summary>查看原文（13行）</summary>

```text
## About · 关于

Deep Whale Day & Night is a complete non-commercial presentation skin for the official DeepSeek Harness Web GUI. It combines two coordinated interfaces rather than applying a simple color filter: a shy white-dress whale maid in a luminous crystal workshop by day, and a softly alluring blue-dress whale maid in a moonlit observatory by night. The native Harness theme button switches the scene, palette, translucent surfaces, composer crown, sidebar ornaments, chibi companion, title colors, and restrained ambience as one coherent set.

Deep Whale 昼夜主题是一套面向官方 DeepSeek Harness Web GUI 的完整非商业界面皮肤，并非简单换色。白昼是身着小白裙、神情羞涩楚楚的鲸鱼女仆与明亮水晶工坊；黑夜是柔和魅惑的蓝裙鲸鱼娘与月潮观测室。右上角 Harness 原生主题按钮会同步切换背景角色、整体色板、磨砂玻璃界面、输入框顶饰、侧栏花边、Q 版伙伴、标题颜色与克制的环境动效。

The skin is intentionally limited to the client presentation layer. It does not read or modify chat content, model requests, credentials, or workspace files. It uses the official `@deepseek-ai/dsh-client-ui-theme` service and an independent profile bundle entry, so it neither depends on a private theme catalog nor replaces Harness itself.

本主题严格限定在客户端展示层，不读取或修改对话内容、模型请求、凭据或工作区文件。它使用官方 `@deepseek-ai/dsh-client-ui-theme` 服务和独立 profile bundle 入口，不依赖私有主题目录，也不会替代 Harness 主程序。

## v0.1.12 update · v0.1.12 更新

- Replaced the stale repository covers with authoritative captures reverified in a clean official Harness rc.7 profile. The published screenshots now show the current no-viewport-frame layout rather than the retired full-screen border artwork. / 使用官方 Harness rc.7 干净 profile 重新核验权威仓库封面；公开截图现在展示无整屏边框的当前布局，不再误用已废弃的全屏边框方案。
```

</details>

#### 缺口

- 主题喜好取决于用户。
  **影响**：有独立皮肤替代纯色切换。
  **进一步探讨**：与默认主题比较可读性。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口和清理怎样实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主入口为空，客户端 effect 挂载皮肤。清理监听器、标记和样式，并在仍拥有标题时恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-2](https://github.com/GGBond2424648901/deep-whale-day-night-theme/blob/3f6c4f14716d1e500f585be0c0d3c139c7a8a90b/src/index.ts#L1-L2)

宿主入口为空

```text
/** Host half for the Deep Whale profile bundle; browser activation is declared by dsh.client. */
export function apply(): void {}
```

**依据 2 · 源码核查**：[src/client/index.ts:586-625](https://github.com/GGBond2424648901/deep-whale-day-night-theme/blob/3f6c4f14716d1e500f585be0c0d3c139c7a8a90b/src/client/index.ts#L586-L625)

退出时清理 DOM、观察器及主题元数据

<details>
<summary>查看原文（40行）</summary>

```text
  let active = true
  return () => {
    if (!active) return
    active = false
    disposeMotion()
    delete body.dataset.dshMaidAtelier
    delete body.dataset.maidComposerMotion
    delete body.dataset.maidSidebarCompact
    delete body.dataset.maidSidebarSize
    delete body.dataset.maidThemeTransition
    if (composerMotionTimer !== undefined) clearTimeout(composerMotionTimer)
    if (themeTransitionTimer !== undefined) clearTimeout(themeTransitionTimer)
    themeToggle.removeEventListener('click', switchTheme)
    observer.disconnect()
    themeColorObserver.disconnect()
    titlebarOverlay?.removeEventListener('geometrychange', syncTitlebarHeight)
    resizeObserver?.disconnect()
    for (const [property, value] of previous) {
      body.style.setProperty(property, value)
    }
    document.querySelectorAll(`[data-skin-owner='${SKIN_OWNER}']`).forEach(element => element.remove())
    document.querySelectorAll<HTMLElement>(
      '[data-maid-composer-selector-row], [data-maid-sidebar-footer], [data-maid-workspace-group], [data-maid-workspace-row], [data-maid-workspace-active], [data-maid-session-row], [data-maid-session-flat], [data-maid-session-first], [data-maid-session-last]',
    ).forEach((element) => {
      delete element.dataset.maidComposerSelectorRow
      delete element.dataset.maidSidebarFooter
      delete element.dataset.maidWorkspaceGroup
      delete element.dataset.maidWorkspaceRow
      delete element.dataset.maidWorkspaceActive
      delete element.dataset.maidSessionRow
      delete element.dataset.maidSessionFlat
      delete element.dataset.maidSessionFirst
      delete element.dataset.maidSessionLast
    })
    if (themeColorMeta?.isConnected
      && (themeColorMeta.content === SKIN_SYSTEM_CHROME_DAY
        || themeColorMeta.content === SKIN_SYSTEM_CHROME_NIGHT)) {
      themeColorMeta.content = previousThemeColor ?? ''
    }
    if (document.title === SKIN_TITLE) document.title = originalTitle
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:629-632](https://github.com/GGBond2424648901/deep-whale-day-night-theme/blob/3f6c4f14716d1e500f585be0c0d3c139c7a8a90b/src/client/index.ts#L629-L632)

客户端通过 effect 挂载

```text
/** Activate the complete skin while this browser plugin fiber is mounted. */
export function apply(ctx: Context): void {
  ctx.effect(() => activateMaidAtelier(ctx), 'ui-skin-deep-whale-day-night: browser skin')
}
```

#### 缺口

- 与其他修改相同 DOM 的扩展可能交互。
  **影响**：有可追踪的回退路径。
  **进一步探讨**：检测启停后按钮、标题和快捷键。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 兼容与性能边界是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

样式通过客户端装饰 DOM，动态循环含可见性和减少动效判断。作者给出的验证宿主集中在 rc.7。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/motion.ts:49-66](https://github.com/GGBond2424648901/deep-whale-day-night-theme/blob/3f6c4f14716d1e500f585be0c0d3c139c7a8a90b/src/client/motion.ts#L49-L66)

读取动效偏好与可见性并清理

<details>
<summary>查看原文（18行）</summary>

```text
  const prefersReducedMotion = matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const acceleratedWebGL = detectAcceleratedWebGL(documentRef)
  const sync = (): void => {
    body.dataset.maidMotion = resolveMotionMode({
      acceleratedWebGL,
      hidden: documentRef.hidden,
      prefersReducedMotion,
    })
  }

  documentRef.addEventListener('visibilitychange', sync)
  sync()

  let active = true
  return () => {
    if (!active) return
    active = false
    documentRef.removeEventListener('visibilitychange', sync)
```

</details>

**依据 2 · 作者声明**：[README.md:50-52](https://github.com/GGBond2424648901/deep-whale-day-night-theme/blob/3f6c4f14716d1e500f585be0c0d3c139c7a8a90b/README.md#L50-L52)

作者说明测试版本

```text
- DeepSeek Harness Web GUI. This release is tested with `@deepseek-ai/dsh@0.1.0-rc.7`.
- `dsh` or `pnpm dlx @deepseek-ai/dsh@0.1.0-rc.7` available for plugin installation.
- Node.js and pnpm are required only when rebuilding or running tests from source.
```

#### 缺口

- 较新宿主 DOM 和屏幕阅读体验未验。
  **影响**：界面回归需按宿主和尺寸覆盖。
  **进一步探讨**：检查窄屏、隐藏页和降低动效。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 分发与许可怎样界定？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者提供 runtime 分支与 SHA-256 校验的 release，README 声明 CC BY-NC-SA 4.0。个人采用时按已声明分发条件选择固定包。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-7](https://github.com/GGBond2424648901/deep-whale-day-night-theme/blob/3f6c4f14716d1e500f585be0c0d3c139c7a8a90b/README.md#L1-L7)

作者标明非商业许可范围

```text
# Deep Whale Day & Night Theme · 鲸鱼娘昼夜工坊

> **Non-commercial / 禁止商用：** This project is released under CC BY-NC-SA 4.0. Personal and other non-commercial use is permitted with attribution; commercial use is prohibited, and adaptations must use the same license. 本项目采用 CC BY-NC-SA 4.0，允许保留署名的个人及其他非商业使用，禁止商业使用，衍生作品必须以相同许可证共享。

A complete day/night character UI skin for the DeepSeek Harness Web GUI. It replaces only the presentation layer: the native theme service switches the full scene, character, companion, controls, ornaments, and lightweight atmosphere without reading or changing sessions, model requests, or workspace data.

面向 DeepSeek Harness Web GUI 的完整鲸鱼娘昼夜主题。它只修改展示层：原生主题服务会同步切换场景、角色、侧栏宠物、控件、花边与轻量动态特效，不读取或更改会话、模型请求和工作区数据。
```

**依据 2 · 作者声明**：[README.md:54-79](https://github.com/GGBond2424648901/deep-whale-day-night-theme/blob/3f6c4f14716d1e500f585be0c0d3c139c7a8a90b/README.md#L54-L79)

作者给出运行时及发行包安装

<details>
<summary>查看原文（26行）</summary>

````text
## Recommended lightweight install · 推荐轻量安装

Install the reviewed runtime-only branch from the public GitHub repository. It contains the prebuilt plugin, two preview covers, license, and documentation, but excludes editable source artwork and development dependencies.

从公开 GitHub 仓库安装经过审查的纯运行时分支。该分支只包含预构建插件、两张主题封面、许可和说明，不包含可编辑素材与开发依赖。

```sh
dsh plugin --profile web add git+https://github.com/GGBond2424648901/deep-whale-day-night-theme.git#runtime
```

Use the explicit `git+https://` form shown above. pnpm may resolve the shorter `github:` form through SSH and fail with `Permission denied (publickey)` on machines without a GitHub SSH key. / 请使用上面的显式 `git+https://` 地址。pnpm 可能把较短的 `github:` 写法解析为 SSH，未配置 GitHub SSH Key 的电脑会出现 `Permission denied (publickey)`。

If `dsh` is not globally installed:

```sh
pnpm dlx @deepseek-ai/dsh@0.1.0-rc.7 plugin --profile web add git+https://github.com/GGBond2424648901/deep-whale-day-night-theme.git#runtime
```

## Install the Release package · 安装 Release 包

Download `deep-whale-day-night-theme-0.1.12.tgz` and `SHA256SUMS.txt` from the [v0.1.12 release](https://github.com/GGBond2424648901/deep-whale-day-night-theme/releases/tag/v0.1.12), verify SHA-256, then run from the download directory.

从 [v0.1.12 Release](https://github.com/GGBond2424648901/deep-whale-day-night-theme/releases/tag/v0.1.12) 下载 `deep-whale-day-night-theme-0.1.12.tgz` 与 `SHA256SUMS.txt`，核对 SHA-256 后在下载目录执行：

```powershell
dsh plugin --profile web add .\deep-whale-day-night-theme-0.1.12.tgz
````

</details>

#### 缺口

- 主分支与运行时产物可能不同。
  **影响**：须核对实际安装包和版本。
  **进一步探讨**：核验 release 散列。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证体验？

**研究主题**：新假设与验证

#### 完整回答

与默认主题比较昼夜切换、键盘焦点、对比度、输入区布局及启停后的恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:586-625](https://github.com/GGBond2424648901/deep-whale-day-night-theme/blob/3f6c4f14716d1e500f585be0c0d3c139c7a8a90b/src/client/index.ts#L586-L625)

存在启停清理路径

<details>
<summary>查看原文（40行）</summary>

```text
  let active = true
  return () => {
    if (!active) return
    active = false
    disposeMotion()
    delete body.dataset.dshMaidAtelier
    delete body.dataset.maidComposerMotion
    delete body.dataset.maidSidebarCompact
    delete body.dataset.maidSidebarSize
    delete body.dataset.maidThemeTransition
    if (composerMotionTimer !== undefined) clearTimeout(composerMotionTimer)
    if (themeTransitionTimer !== undefined) clearTimeout(themeTransitionTimer)
    themeToggle.removeEventListener('click', switchTheme)
    observer.disconnect()
    themeColorObserver.disconnect()
    titlebarOverlay?.removeEventListener('geometrychange', syncTitlebarHeight)
    resizeObserver?.disconnect()
    for (const [property, value] of previous) {
      body.style.setProperty(property, value)
    }
    document.querySelectorAll(`[data-skin-owner='${SKIN_OWNER}']`).forEach(element => element.remove())
    document.querySelectorAll<HTMLElement>(
      '[data-maid-composer-selector-row], [data-maid-sidebar-footer], [data-maid-workspace-group], [data-maid-workspace-row], [data-maid-workspace-active], [data-maid-session-row], [data-maid-session-flat], [data-maid-session-first], [data-maid-session-last]',
    ).forEach((element) => {
      delete element.dataset.maidComposerSelectorRow
      delete element.dataset.maidSidebarFooter
      delete element.dataset.maidWorkspaceGroup
      delete element.dataset.maidWorkspaceRow
      delete element.dataset.maidWorkspaceActive
      delete element.dataset.maidSessionRow
      delete element.dataset.maidSessionFlat
      delete element.dataset.maidSessionFirst
      delete element.dataset.maidSessionLast
    })
    if (themeColorMeta?.isConnected
      && (themeColorMeta.content === SKIN_SYSTEM_CHROME_DAY
        || themeColorMeta.content === SKIN_SYSTEM_CHROME_NIGHT)) {
      themeColorMeta.content = previousThemeColor ?? ''
    }
    if (document.title === SKIN_TITLE) document.title = originalTitle
```

</details>

**依据 2 · 作者声明**：[README.md:9-13](https://github.com/GGBond2424648901/deep-whale-day-night-theme/blob/3f6c4f14716d1e500f585be0c0d3c139c7a8a90b/README.md#L9-L13)

提供昼夜截图作为静态对照

```text
## Screenshots · 主题截图

| Day · 白昼 | Night · 黑夜 |
| --- | --- |
| ![Deep Whale day theme](screenshots/day.png) | ![Deep Whale night theme](screenshots/night.png) |
```

#### 缺口

- 截图不能覆盖交互和无障碍。
  **影响**：可按操作任务验证。
  **进一步探讨**：执行同样的键盘导航和消息输入脚本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
