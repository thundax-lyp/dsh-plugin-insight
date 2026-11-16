# Maid Atelier

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[811fa53](https://github.com/Small-tailqwq/dsh-deep-whale/tree/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier)

<!-- BEGIN META -->
[![GitHub ★ 3,112](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C112&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Small-tailqwq/dsh-deep-whale) [![npm 30d 99,162](https://img.shields.io/static/v1?label=npm+30d&message=99%2C162&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-maid-atelier) [![最新发布 2026-11-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-maid-atelier)
<!-- END META -->

> **功能**：为 DSH Web GUI 提供深海女仆主题、随对话区变化的装饰与宽表格展开。

> **亮点**：皮肤把视觉元素和窄屏交互接到宿主。macOS 侧栏填充是本版本变化，导航与抽屉是继续保留的机制。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：移动抽屉和设置导航依赖宿主 DOM 选择器与事件时序；宿主结构变化、弹层或拖动手势可能引发误关/误触。视觉主题本身也可能降低部分用户的阅读偏好或可访问性；当前没有目标浏览器、窄屏设备与禁用清理的运行证据。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 皮肤针对哪些界面任务，更新的用户可见增量是什么？](#detail-section-11)
  - [Q02 · 移动设置导航和抽屉怎样响应尺寸、选择与外部点击？](#detail-section-12)
  - [Q03 · 资源加载、宿主兼容与退出边界如何？](#detail-section-13)
  - [Q04 · 谁适合试用，怎样核验价值、成本和恢复？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Maid Atelier 是 DSH Web 皮肤，面向偏好该视觉风格并希望改善窄屏操作的用户。当前增量集中在设置导航溢出提示、移动侧栏关闭交互和视觉适配；任务主体仍是对话与阅读，收益依赖偏好和宿主布局。

基线为手工完成相同任务或旧研究固定版本；没有同条件效果测量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话区主题 | 组合角色和按明暗切换的背景 | 依赖宿主会话区与主题标记 |
| 宽表格展开 | 辅助阅读长表格 | 依赖宿主表格结构，原表格保留 |
| 错误页装饰 | 在识别到宿主加载错误时装饰报告 | 皮肤已加载，标题及结构匹配 |
| 静态图片路由 | 向客户端提供包内资源 | 请求限于白名单 PNG/WebP |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 声明范围内的 DSH Web 与布局面 | 皮肤加载需要 | 挂载客户端并找到目标 DOM | 切回默认并核对实际宿主 |
| 两端 JS、资源清单及包内图片 | 完整主题需要 | 提供同源图像和样式 | 先核对包与 Host 路由 |
| 匹配的安装渠道和皮肤管理器 | 作者建议 | 管理选择和设置 | 已有聚合生态时用其适配版 |
| 作者声明的美术使用条件 | 使用前核对 | 约束资源使用 | 条件不明时保留默认界面 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对兼容范围、包和素材条件 | 同一个测试 profile 只用适配的发行 |
| 激活 | 由宿主加载皮肤并取得本地图片 | 背景、会话内容和输入均可见 |
| 验收 | 用户切明暗、用键盘展开和退出长表格 | 可读可操作，诊断可见 |
| 退出 | 停用并回到默认主题 | 输入、表格与样式恢复，必要时重载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包下载和图片缓存，实际用量未知 | 核对版本、渠道和许可 | 真实部署未验收 |
| 持续 | 观察器、绘制和合成，未计量 | 升级宿主后复查控件 | 无任务节省数据 |
| 失败恢复 | 重载与重复下载可能消耗资源，未计量 | 查源图、错误报告和残留 | 服务注销不清浏览器缓存 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 主题视觉 | 组合独立装饰、明暗素材和表格视图 | 用户偏好与实际阅读舒适度 |
| 错误页 | 匹配固定报告后加样式，保留正文 | 新宿主布局和诊断可读性 |
| 退出 | 源码释放监听并恢复部分状态 | 实际浏览器和并发写入下的恢复 |

> **思考**：移动抽屉和设置导航依赖宿主 DOM 选择器与事件时序；宿主结构变化、弹层或拖动手势可能引发误关/误触。视觉主题本身也可能降低部分用户的阅读偏好或可访问性；当前没有目标浏览器、窄屏设备与禁用清理的运行证据。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：皮肤把视觉元素和窄屏交互接到宿主。macOS 侧栏填充是本版本变化，导航与抽屉是继续保留的机制。[Q01](#research-q01) [Q02](#research-q02)

[Q02](#research-q02) 的图片服务只读明列文件，降低对外部资源的依赖。[Q03](#research-q03) 的错误标记用多所有者租约回收，可用于其它共享 DOM 装饰，但仍需针对宿主选择器验证真实启停。

<a id="detail-section-5"></a>

### 1.4 主要限制

移动抽屉和设置导航依赖宿主 DOM 选择器与事件时序；宿主结构变化、弹层或拖动手势可能引发误关/误触。视觉主题本身也可能降低部分用户的阅读偏好或可访问性；当前没有目标浏览器、窄屏设备与禁用清理的运行证据。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

偏好该视觉风格且常用窄屏 DSH Web 的用户可在测试 profile 试用。先验证会话切换、外部点击、弹层/拖动、设置溢出及禁用后恢复；若出现误关、背景误触、重要控件遮挡或卸载后残留，就回到默认主题并停用。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交源码支持接线与关键机制；真实宿主、外部服务、用户效果及实际成本均未在本轮验证。

- 已检查：作者 README、包清单、源码路径 maid-atelier/README.md、maid-atelier/src/client/mobile-drawer.ts、maid-atelier/src/client/settings-navigation.ts、maid-atelier/package.json、maid-atelier/cordis.patch.yml、maid-atelier/lib/index.js、maid-atelier/src/client/customization.ts、maid-atelier/src/client/maid-atelier.module.css、maid-atelier/tests/darwin-sidebar.spec.ts、maid-atelier/src/client/index.ts 及固定范围 inventory；组件：maid-atelier。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取本轮固定组件源码、既有目录统计及上一版本研究；未安装或运行插件，未执行宿主、浏览器、外部服务或真实用户验证。
- 下一步：在目标宿主隔离环境按 [Q04](#research-q04) 逐项执行小规模任务，记录失败、质量、人工时间与资源成本；任一停止条件触发则回滚。

**分析版本**

- **仓库**：[Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale)
- **版本号**：0.1.11（[固定提交 811fa53](https://github.com/Small-tailqwq/dsh-deep-whale/tree/811fa53b712a16ce5f5278529bb76d5a033a1d13)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：窄屏用户频繁切换会话时，自动收起抽屉且吞掉落到背景的点击，能减少误操作而不妨碍弹层与拖动。用 1024px 两侧断点、会话切换、外部点击、弹层/拖动和设置溢出任务与默认界面对照，记录误触、完成时间与禁用后残留；若误操作未减少或弹层受损则推翻。[Q04](#research-q04)

在目标宿主隔离环境按 [Q04](#research-q04) 逐项执行小规模任务，记录失败、质量、人工时间与资源成本；任一停止条件触发则回滚。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 93 | — | — | 1820 |
| .js | source | 2 | 3682 | 3321 | 428 | — |
| .ts | source | 29 | 3945 | 3105 | 554 | — |
| .ts | test | 15 | 6628 | 5515 | 519 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=19&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=20&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定提交的 DSH 皮肤是否改善窄屏界面操作，且能在目标宿主中安全退出？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 皮肤针对哪些界面任务，更新的用户可见增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Maid Atelier 向 DSH Web 注入界面布局和视觉样式，面向有条件核对宿主布局的皮肤用户。本版本差异之一是 macOS 非抽屉模式恢复侧栏列底色，再对 sidebar 槽位根层加遮罩底色。仓库静态断言核对选择器优先级和吉祥物叠层，本轮未运行。窄屏抽屉和导航提示仍存在，但其模块不属于这两次固定提交之间的改动。

#### 证据与依据

**依据 1 · 作者声明**：[maid-atelier/README.md:1-30](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/README.md#L1-L30)

作者描述主题和适用范围。

<details>
<summary>查看原文（30行）</summary>

````text
# maid-atelier · 深海女仆工坊

DeepSeek Harness Web GUI 的深海女仆工坊皮肤：两位鲸鱼娘女仆、深海蓝蕾丝与 Q 版侧栏，把 DSH 布置成女仆工坊。纯展示层客户端插件——`apply()` 设置 `data-dsh-maid-atelier` 作用域、按亮/暗主题切换宫殿背景、以独立透明层挂载双女仆角色、装饰可折叠侧栏,并为加载/思考/工具运行状态预留稳定动画钩子。effect 销毁器还原全部 CSS/DOM 写入;不注入服务、不发出 Cordis 事件、不触达模型请求。

## 特性

- 双女仆工坊场景对话背景(亮/暗自动切换)
- 深海蓝、陶瓷白、长春花蓝、柔金构成的可热切换 UI 覆盖层
- 亮色主题采用半透明磨砂消息气泡，可在「设置 → 皮肤管理」中调节背景亮度（60%～100%，默认 80%），也可开启「简洁过程行」去掉过程底色并调整字色（默认关闭）
- Q 版侧栏角色与视口装饰、favicon
- 在「设置 → 皮肤管理 → 深海女仆工坊」中可关闭「显示侧栏 U 形花边」（默认开启），同时移除会话列表底部渐隐和装饰留白，保留输入框装饰；分区过高时可单独调低「工作区横幅高度」。
- 启动插件加载失败时，默认以左右独立的双女仆立绘装饰原生错误报告，支持窄屏重排，遵循现有立绘显示与时段设置。此效果依赖皮肤已成功执行；皮肤自身或内核尚未加载时保留原生页面。
- 双女仆与宫殿背景整层挂在**对话区(centerCol)内部**:随聊天区域尺寸自适应(右/下工作台推开聊天区时背景与女仆同步收缩,不再固定于视口),左女仆贴聊天区左下、右女仆贴右下,均位于聊天记录与输入器之下;聊天态与着陆页按比例切换构图
- 图片素材随包分发，由皮肤自己的同源路由提供(不内嵌进 client bundle),激活不依赖任何远程 URL 或外部资源服务器

## 安装

> 若已安装 `@linxin666/dsh-web-all`（dsh-web），请从 dsh-web 自带的皮肤中心/安装入口安装其适配版 `maid-atelier` 与 `orca-link`，不要执行下面的 standalone 安装命令。两种发行方式的组件与样式契约不同，不能在同一 profile 中叠装。

推荐连同皮肤管理器一起，从 npm 安装稳定版：

```sh
dsh plugin --profile web add '@smalltailqwq/dsh-client-ui-skin-deep-whale-manager' && dsh plugin --profile web add '@smalltailqwq/dsh-client-ui-skin-maid-atelier'
```

PowerShell 版本见仓库 README。未指定 dist-tag 时 npm 使用 `latest`。首次安装后重启一次 DSH，然后在“设置 → 皮肤管理”中选择“深海女仆工坊”；之后切换走配置热重载。独立子包 link 仅用于本地开发。

加载即生效、卸载即复原(与皮肤中心/dsh-skin 的互斥切换兼容,`wiring.id` 为 `ui-skin-maid-atelier`)。

## 网页与应用图标
````

</details>

**依据 2 · 源码核查**：[maid-atelier/src/client/mobile-drawer.ts:1-27](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/mobile-drawer.ts#L1-L27)

注释说明窄屏切换和外部点击摩擦。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * `@deepseek-ai/dsh-client-ui-layout` closes its narrow sidebar only from the
 * toggle button. Two gestures a phone user expects are therefore missing:
 *
 * 1. picking a session calls `openSession`, which never touches
 *    `narrowExpanded`, so the drawer keeps covering the conversation after a
 *    session switch and has to be closed by hand;
 * 2. tapping outside the open drawer does nothing at all — the host's
 *    `overlayLayer` is only an overlay container (`pointer-events: none`, no
 *    handler), not a scrim, so the drawer stays up until the toggle is found
 *    again.
 *
 * Both are mirrored here: a row activation closes the overlay on the next
 * frame, and a pointer that lands outside the open column dismisses it. The tap
 * that dismisses is then swallowed, because on a phone the control behind the
 * drawer is usually the composer — and its send button sits exactly in the
 * corner a reader aims at when dismissing.
 *
 * A settings dialog opened from the drawer is deliberately *not* a dismissal:
 * closing one surface must not close another the reader opened. The drawer
 * stays where it was and the dialog closes on its own.
 *
 * The breakpoint mirrors `SIDEBAR_AUTO_COLLAPSE` in the layout package: below it
 * the collapsed column is a rail and the expanded column is an overlay, above it
 * the column is docked and must stay open.
 */
const DRAWER_AUTO_COLLAPSE = 1024
```

</details>

**依据 3 · 源码核查**：[maid-atelier/src/client/settings-navigation.ts:1-12](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/settings-navigation.ts#L1-L12)

声明设置导航提示用途。

<details>
<summary>查看原文（12行）</summary>

```text
// rc.1 mounts the panel in the settings slot; rc.2 portals it to <body>.
const NAV_SELECTOR = "[data-slot='sidebar.settings'] > [role='presentation'] > [role='dialog'] > nav, "
  + "body > [role='presentation'] > [role='dialog'][data-shortcut-modal='settings'] > nav"
const MORE_ATTRIBUTE = 'data-maid-settings-more'
interface SettingsNavigation {
  synchronize: () => void
  dispose: () => void
}

const installations = new WeakMap<Document, { users: number, controller: SettingsNavigation }>()

/** The existing settings observer calls synchronize when the host replaces its navigation. */
```

</details>

**依据 4 · 源码核查**：[maid-atelier/src/client/maid-atelier.module.css:735-748](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/maid-atelier.module.css#L735-L748)

限定平台、侧栏模式和根层填充。

<details>
<summary>查看原文（14行）</summary>

```text
/* macOS desktop clears SidebarRoot's fill and swaps the column's for a
   translucent vibrancy tint. The maid sidebar is an opaque navy panel, and
   the root fill is what veils the sidebar mascot into a watermark; without
   it the full-colour chibi sits under the transparent session rows. Restore
   both fills. The column selector mirrors the host's non-drawer condition so
   it also outranks the host's dark-theme variant. */
html[data-platform='darwin'] body[data-dsh-maid-atelier]
  [class*='frame']:not([data-sidebar-drawer]) > [class*='sidebarCol'] {
  background: #0a173b;
}

html[data-platform='darwin'] body[data-dsh-maid-atelier] [data-slot='sidebar'] > [class*='root'] {
  background: var(--dsw-specific-sidebar-fill);
}
```

</details>

**依据 5 · 源码核查**：[maid-atelier/tests/darwin-sidebar.spec.ts:49-69](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/tests/darwin-sidebar.spec.ts#L49-L69)

测试代码断言选择器优先级与叠层。

<details>
<summary>查看原文（21行）</summary>

```text
describe('Maid Atelier macOS sidebar fills', () => {
  it('restores the opaque navy column outside the drawer', () => {
    expect(declarations(COLUMN)).toContain('background: #0a173b')
  })

  it('restores the root fill that veils the sidebar mascot', () => {
    expect(declarations(ROOT)).toContain('background: var(--dsw-specific-sidebar-fill)')
  })

  it('outranks the host darwin column and root rules, dark theme included', () => {
    const column = specificity(COLUMN)
    expect(outranks(column, specificity("[data-platform='darwin'] .frame:not([data-sidebar-drawer]) .sidebarCol"))).toBe(true)
    expect(outranks(column, specificity("[data-platform='darwin'] [data-ds-dark-theme] .frame:not([data-sidebar-drawer]) .sidebarCol"))).toBe(true)
    expect(outranks(specificity(ROOT), specificity("[data-platform='darwin'] .root"))).toBe(true)
  })

  it('keeps the mascot layered below the sidebar content root', () => {
    const mascot = CSS.match(/body\[data-dsh-maid-atelier\] \[data-skin-chrome='sidebar-mascot'\]\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(mascot).toContain('z-index: 0')
    expect(CSS).toMatch(/\[class\*='sidebarCol'\] > div > :not\(\s*\[data-skin-chrome='sidebar-mascot'\],[^)]*\)\s*\{\s*position: relative;\s*z-index: 2;/)
  })
```

</details>

#### 缺口

- 没有用户可用性测试，舒适度、误触与偏好覆盖未知。
  **影响**：在目标窄屏设备比较默认主题与皮肤下的任务完成和误触。
  **进一步探讨**：在目标窄屏设备比较默认主题与皮肤下的任务完成和误触。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 移动设置导航和抽屉怎样响应尺寸、选择与外部点击？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

设置列表在 scrollHeight-clientHeight-max(0,scrollTop) 大于 1 时写更多提示，尺寸变化和滚动触发更新。重挂或释放时，仅当当前属性等于插件最后一次写入才恢复原值。抽屉条件为视口严格小于 1024 px、无折叠标记、实际列宽正数。外部主指针点按在排除拖柄、内置控件和弹层后调用宿主 toggle，并在 400 ms 内拦对应 click；取消或下一主指针清除拦截。会话行和新会话按键要等宿主当帧处理后再关，内部操作按钮保留。模拟 click 走独立关闭分支。卸载清理四类捕获监听、计时器与待执行帧；宿主找不到 toggle 时关闭路径可能没有效果，实际设备待验证。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/src/client/settings-navigation.ts:35-84](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/settings-navigation.ts#L35-L84)

计算溢出、观察尺寸并同步提示属性。

<details>
<summary>查看原文（50行）</summary>

```text
function createNavigation(body: HTMLElement): SettingsNavigation {
  let active = true
  let nav: HTMLElement | null = null
  let list: HTMLElement | null = null
  let originalMore: string | null = null
  let writtenMore: string | null = null
  let resizeObserver: ResizeObserver | undefined

  const update = (): void => {
    if (!active || nav === null || list === null) return
    const more = list.scrollHeight - list.clientHeight - Math.max(0, list.scrollTop) > 1
    writtenMore = more ? '' : null
    if (nav.getAttribute(MORE_ATTRIBUTE) === writtenMore) return
    if (writtenMore === null) nav.removeAttribute(MORE_ATTRIBUTE)
    else nav.setAttribute(MORE_ATTRIBUTE, writtenMore)
  }

  const detach = (): void => {
    resizeObserver?.disconnect()
    resizeObserver = undefined
    list?.removeEventListener('scroll', update)
    if (nav !== null && nav.getAttribute(MORE_ATTRIBUTE) === writtenMore) {
      if (originalMore === null) nav.removeAttribute(MORE_ATTRIBUTE)
      else nav.setAttribute(MORE_ATTRIBUTE, originalMore)
    }
    nav = null
    list = null
  }

  const synchronize = (): void => {
    if (!active) return
    const nextNav = body.querySelector<HTMLElement>(NAV_SELECTOR)
    const nextList = nextNav?.querySelector<HTMLElement>(':scope > :last-child') ?? null
    if (nav !== nextNav || list !== nextList) {
      detach()
      nav = nextNav
      list = nextList
      originalMore = nav?.getAttribute(MORE_ATTRIBUTE) ?? null
      writtenMore = originalMore
      if (list !== null) {
        try {
          list.addEventListener('scroll', update, { passive: true })
          if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(update)
            resizeObserver.observe(list)
          }
        } catch (error) {
          detach()
          throw error
        }
```

</details>

**依据 2 · 源码核查**：[maid-atelier/src/client/mobile-drawer.ts:27-43](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/mobile-drawer.ts#L27-L43)

定义窄屏断点和需要保留的交互选择器。

<details>
<summary>查看原文（17行）</summary>

```text
const DRAWER_AUTO_COLLAPSE = 1024
const SIDEBAR_COLUMN_SELECTOR = "[class*='sidebarCol']"
const SESSION_ROW_SELECTOR = '[data-maid-session-row], [role="treeitem"][class*="sessionRow"]'
const ROW_AFFORDANCE_SELECTOR = '[role="menu"], [role="dialog"], input, textarea, [aria-haspopup]'
/** Popups own the tap that dismisses them, so the drawer waits its turn. */
const OPEN_POPUP_SELECTOR = [
  '[role="menu"]',
  '[role="listbox"]',
  '[role="dialog"]',
  '[aria-modal="true"]',
  '[data-radix-popper-content-wrapper]',
  '[data-floating-ui-portal]',
].join(',')
/** The host's resize handle is a drag, not a dismissal. */
const DRAG_HANDLE_SELECTOR = "[class*='handle']"
/** How long a dismissing pointer keeps swallowing the click it produced. */
const SWALLOW_WINDOW_MS = 400
```

</details>

**依据 3 · 源码核查**：[maid-atelier/src/client/mobile-drawer.ts:51-67](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/mobile-drawer.ts#L51-L67)

窄屏检查和关闭操作。

<details>
<summary>查看原文（17行）</summary>

```text
export function installMaidMobileDrawerAutoClose(body: HTMLElement): () => void {
  const doc = body.ownerDocument
  const view = doc.defaultView
  if (view === null) return () => {}
  let pendingFrame: number | null = null
  let swallowTimer: ReturnType<typeof setTimeout> | null = null

  const drawerOpen = (): boolean => view.innerWidth < DRAWER_AUTO_COLLAPSE
    && doc.querySelector('div[data-sidebar-collapsed]') === null
    && (doc.querySelector(SIDEBAR_COLUMN_SELECTOR)?.getBoundingClientRect().width ?? 0) > 0

  const closeDrawer = (): void => {
    if (!drawerOpen()) return
    doc.querySelector(SIDEBAR_COLUMN_SELECTOR)
      ?.querySelector<HTMLElement>("button[class*='toggle']")
      ?.click()
  }
```

</details>

**依据 4 · 源码核查**：[maid-atelier/src/client/mobile-drawer.ts:90-154](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/mobile-drawer.ts#L90-L154)

处理 pointer、吞 click 与卸载。

<details>
<summary>查看原文（65行）</summary>

```text
    swallowTimer = null
    return true
  }

  const onPointerDown = (event: PointerEvent): void => {
    // Secondary buttons and extra touches during a pinch are not dismissals.
    if (event.isPrimary === false || event.button > 0) return
    // A new gesture must not inherit suppression from a dismissal with no click.
    releaseSwallow()
    const target = event.target
    if (!(target instanceof Element) || !dismissOutside(target)) return
    armSwallow()
  }

  const onPointerCancel = (event: PointerEvent): void => {
    if (event.isPrimary !== false) releaseSwallow()
  }

  const onMouseDown = (event: MouseEvent): void => {
    // Cancelling the default focus keeps a dismissing tap from raising the phone
    // keyboard on the composer behind the drawer.
    if (swallowTimer !== null) event.preventDefault()
  }

  const onClick = (event: MouseEvent): void => {
    const target = event.target
    if (!(target instanceof Element)) return

    // The pointerdown that dismissed the drawer already did the work: swallow the
    // click it produced so it cannot activate the control behind the overlay.
    if (releaseSwallow()) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    // Synthetic clicks (no pointerdown) still dismiss; for a real pointer the
    // drawer is already closed by now, so this is a no-op.
    if (drawerOpen() && dismissOutside(target)) return

    // Row-internal affordances (overflow menu, inline rename, popovers) own the
    // gesture and keep the drawer open.
    if (target.closest(ROW_AFFORDANCE_SELECTOR) !== null) return
    const row = target.closest(SESSION_ROW_SELECTOR)
    const newSession = target.closest<HTMLElement>("button[class*='newSession']")
    if (row === null && newSession === null) return
    if (target.closest(SIDEBAR_COLUMN_SELECTOR) === null) return
    // A row carries a nested "Session actions" control that has no aria-haspopup,
    // so it is recognised structurally instead.
    const control = target.closest('button, [role="button"], a')
    if (control !== null && row !== null && control !== row && row.contains(control)) return
    if (!drawerOpen() || pendingFrame !== null) return
    // Let the host apply the selection first, then close the overlay.
    pendingFrame = view.requestAnimationFrame(() => {
      pendingFrame = null
      closeDrawer()
    })
  }

  doc.addEventListener('pointerdown', onPointerDown, true)
  doc.addEventListener('pointercancel', onPointerCancel, true)
  doc.addEventListener('mousedown', onMouseDown, true)
  doc.addEventListener('click', onClick, true)
  return () => {
    doc.removeEventListener('pointerdown', onPointerDown, true)
```

</details>

**依据 5 · 源码核查**：[maid-atelier/src/client/settings-navigation.ts:24-62](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/settings-navigation.ts#L24-L62)

引用计数和原始属性恢复。

<details>
<summary>查看原文（39行）</summary>

```text
    synchronize: () => { if (active) current.controller.synchronize() },
    dispose: () => {
      if (!active) return
      active = false
      if (--current.users > 0) return
      current.controller.dispose()
      installations.delete(doc)
    },
  }
}

function createNavigation(body: HTMLElement): SettingsNavigation {
  let active = true
  let nav: HTMLElement | null = null
  let list: HTMLElement | null = null
  let originalMore: string | null = null
  let writtenMore: string | null = null
  let resizeObserver: ResizeObserver | undefined

  const update = (): void => {
    if (!active || nav === null || list === null) return
    const more = list.scrollHeight - list.clientHeight - Math.max(0, list.scrollTop) > 1
    writtenMore = more ? '' : null
    if (nav.getAttribute(MORE_ATTRIBUTE) === writtenMore) return
    if (writtenMore === null) nav.removeAttribute(MORE_ATTRIBUTE)
    else nav.setAttribute(MORE_ATTRIBUTE, writtenMore)
  }

  const detach = (): void => {
    resizeObserver?.disconnect()
    resizeObserver = undefined
    list?.removeEventListener('scroll', update)
    if (nav !== null && nav.getAttribute(MORE_ATTRIBUTE) === writtenMore) {
      if (originalMore === null) nav.removeAttribute(MORE_ATTRIBUTE)
      else nav.setAttribute(MORE_ATTRIBUTE, originalMore)
    }
    nav = null
    list = null
  }
```

</details>

**依据 6 · 源码核查**：[maid-atelier/src/client/mobile-drawer.ts:68-128](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/mobile-drawer.ts#L68-L128)

排除手势、原生和合成 click 分流。

<details>
<summary>查看原文（61行）</summary>

```text

  /** Gestures that keep the drawer open: its own chrome, a popup, a drag handle. */
  const ownsGesture = (target: Element): boolean => target.closest(SIDEBAR_COLUMN_SELECTOR) !== null
    || target.closest(ROW_AFFORDANCE_SELECTOR) !== null
    || target.closest(DRAG_HANDLE_SELECTOR) !== null
    || doc.querySelector(OPEN_POPUP_SELECTOR) !== null

  /** Dismiss the drawer for a gesture outside it; true when it was open to close. */
  const dismissOutside = (target: Element): boolean => {
    if (!drawerOpen() || ownsGesture(target)) return false
    closeDrawer()
    return true
  }

  const armSwallow = (): void => {
    if (swallowTimer !== null) clearTimeout(swallowTimer)
    swallowTimer = setTimeout(() => { swallowTimer = null }, SWALLOW_WINDOW_MS)
  }

  const releaseSwallow = (): boolean => {
    if (swallowTimer === null) return false
    clearTimeout(swallowTimer)
    swallowTimer = null
    return true
  }

  const onPointerDown = (event: PointerEvent): void => {
    // Secondary buttons and extra touches during a pinch are not dismissals.
    if (event.isPrimary === false || event.button > 0) return
    // A new gesture must not inherit suppression from a dismissal with no click.
    releaseSwallow()
    const target = event.target
    if (!(target instanceof Element) || !dismissOutside(target)) return
    armSwallow()
  }

  const onPointerCancel = (event: PointerEvent): void => {
    if (event.isPrimary !== false) releaseSwallow()
  }

  const onMouseDown = (event: MouseEvent): void => {
    // Cancelling the default focus keeps a dismissing tap from raising the phone
    // keyboard on the composer behind the drawer.
    if (swallowTimer !== null) event.preventDefault()
  }

  const onClick = (event: MouseEvent): void => {
    const target = event.target
    if (!(target instanceof Element)) return

    // The pointerdown that dismissed the drawer already did the work: swallow the
    // click it produced so it cannot activate the control behind the overlay.
    if (releaseSwallow()) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    // Synthetic clicks (no pointerdown) still dismiss; for a real pointer the
    // drawer is already closed by now, so this is a no-op.
    if (drawerOpen() && dismissOutside(target)) return
```

</details>

**依据 7 · 源码核查**：[maid-atelier/src/client/mobile-drawer.ts:130-161](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/mobile-drawer.ts#L130-L161)

会话帧、事件和计时器的撤销。

<details>
<summary>查看原文（32行）</summary>

```text
    // Row-internal affordances (overflow menu, inline rename, popovers) own the
    // gesture and keep the drawer open.
    if (target.closest(ROW_AFFORDANCE_SELECTOR) !== null) return
    const row = target.closest(SESSION_ROW_SELECTOR)
    const newSession = target.closest<HTMLElement>("button[class*='newSession']")
    if (row === null && newSession === null) return
    if (target.closest(SIDEBAR_COLUMN_SELECTOR) === null) return
    // A row carries a nested "Session actions" control that has no aria-haspopup,
    // so it is recognised structurally instead.
    const control = target.closest('button, [role="button"], a')
    if (control !== null && row !== null && control !== row && row.contains(control)) return
    if (!drawerOpen() || pendingFrame !== null) return
    // Let the host apply the selection first, then close the overlay.
    pendingFrame = view.requestAnimationFrame(() => {
      pendingFrame = null
      closeDrawer()
    })
  }

  doc.addEventListener('pointerdown', onPointerDown, true)
  doc.addEventListener('pointercancel', onPointerCancel, true)
  doc.addEventListener('mousedown', onMouseDown, true)
  doc.addEventListener('click', onClick, true)
  return () => {
    doc.removeEventListener('pointerdown', onPointerDown, true)
    doc.removeEventListener('pointercancel', onPointerCancel, true)
    doc.removeEventListener('mousedown', onMouseDown, true)
    doc.removeEventListener('click', onClick, true)
    if (pendingFrame !== null) view.cancelAnimationFrame(pendingFrame)
    pendingFrame = null
    releaseSwallow()
  }
```

</details>

#### 缺口

- 未在触屏、辅助技术或真实 DSH 版本运行验证。
  **影响**：覆盖多 viewport、键盘、弹层、拖动和输入框点击，确认误触和监听清理。
  **进一步探讨**：覆盖多 viewport、键盘、弹层、拖动和输入框点击，确认误触和监听清理。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 资源加载、宿主兼容与退出边界如何？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

客户端安装皮肤状态、DOM 标记，以及各自可释放的导航和抽屉 effect。卸载释放布局租约、断开观察器、移除插入节点和侧栏标记、恢复记录的 CSS 值。包宿主只服务列在允许名单中的资源。现有证据支持可定位的清理路径，宿主升级后的 DOM 选择器、真实退出效果和素材发行许可仍须另查。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/package.json:1-24](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/package.json#L1-L24)

声明独立 DSH skin 包、入口与 peer 范围。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "@smalltailqwq/dsh-client-ui-skin-maid-atelier",
  "description": "Two whale maids, navy lace and a chibi sidebar turn DSH into a maid atelier.",
  "icon": "assets/plugin-icon.png",
  "version": "0.1.11",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./skin.json": "./skin.json",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": ["@deepseek-ai/dsh-client-ui-layout"],
      "platform": "web"
    }
  },
  "scripts": {
```

</details>

**依据 2 · 源码核查**：[maid-atelier/cordis.patch.yml:1-7](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/cordis.patch.yml#L1-L7)

bundle 挂载客户端入口。

```text
# maid-atelier skin bundle patch: inserts its public dsh.client entry into the web plugin roster.
# The bundle is the official dsh plugin shape — install it with
# `dsh plugin --profile <name> add <path-or-git-url>`; mutual exclusion between
# skins is managed by scripts/dsh-skin (home-layer disabled rows).
- insert:
    - id: ui-skin-maid-atelier
      name: '@smalltailqwq/dsh-client-ui-skin-maid-atelier'
```

**依据 3 · 源码核查**：[maid-atelier/lib/index.js:4-35](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/lib/index.js#L4-L35)

host 服务允许访问 manifest 白名单资源。

<details>
<summary>查看原文（32行）</summary>

```text
function installSkinAssets(ctx, id, directory, files) {
	const prefix = `/skin-assets/${id}`;
	const allowed = new Set(files);
	ctx.inject(["webServer"], (webCtx) => {
		const server = webCtx.get("webServer");
		webCtx.effect(() => server.register({
			kind: "prefix",
			path: prefix,
			handler: async (req, res) => {
				if (req.method !== "GET" && req.method !== "HEAD") {
					res.writeHead(405, { Allow: "GET, HEAD" }).end();
					return;
				}
				const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
				const file = pathname.slice(prefix.length + 1);
				if (!pathname.startsWith(`${prefix}/`) || !allowed.has(file) || !/^[a-f0-9]{64}\.(png|webp)$/.test(file)) {
					res.writeHead(404).end();
					return;
				}
				let bytes;
				try {
					bytes = await readFile(new URL(file, directory));
				} catch (error) {
					if (error.code !== "ENOENT") throw error;
					res.writeHead(404).end();
					return;
				}
				const etag = `"${file.split(".")[0]}"`;
				const headers = {
					"Content-Type": file.endsWith(".webp") ? "image/webp" : "image/png",
					"Cache-Control": "public, max-age=31536000, immutable",
					"X-Content-Type-Options": "nosniff",
```

</details>

**依据 4 · 源码核查**：[maid-atelier/src/client/mobile-drawer.ts:149-162](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/mobile-drawer.ts#L149-L162)

返回 disposer 并清理事件监听。

<details>
<summary>查看原文（14行）</summary>

```text
  doc.addEventListener('pointerdown', onPointerDown, true)
  doc.addEventListener('pointercancel', onPointerCancel, true)
  doc.addEventListener('mousedown', onMouseDown, true)
  doc.addEventListener('click', onClick, true)
  return () => {
    doc.removeEventListener('pointerdown', onPointerDown, true)
    doc.removeEventListener('pointercancel', onPointerCancel, true)
    doc.removeEventListener('mousedown', onMouseDown, true)
    doc.removeEventListener('click', onClick, true)
    if (pendingFrame !== null) view.cancelAnimationFrame(pendingFrame)
    pendingFrame = null
    releaseSwallow()
  }
}
```

</details>

**依据 5 · 源码核查**：[maid-atelier/src/client/index.ts:578-625](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/index.ts#L578-L625)

清除皮肤状态、样式与节点。

<details>
<summary>查看原文（48行）</summary>

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
    decoratedElements.forEach((element) => {
      delete element.dataset.maidSidebarFooter
      delete element.dataset.maidWorkspaceGroup
      delete element.dataset.maidWorkspaceRow
      delete element.dataset.maidWorkspaceNested
      delete element.dataset.maidWorkspaceSessions
      delete element.dataset.maidSessionRow
      delete element.dataset.maidSessionFlat
      delete element.dataset.maidSessionFirst
      delete element.dataset.maidSessionLast
    })
```

</details>

**依据 6 · 源码核查**：[maid-atelier/src/client/index.ts:660-670](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/index.ts#L660-L670)

安装导航与抽屉清理入口。

<details>
<summary>查看原文（11行）</summary>

```text
  body.dataset.dshMaidAtelier = ''
  // Composer presentation modes (skin setting 「输入框显示方式」):
  // capsule collapses the empty unfocused card, scroll fades it on scroll-up.
  ctx.effect(() => installMaidComposerDismiss(body), 'ui-skin-maid-atelier: composer stats dismissal')
  const disposeMaidComposerCapsule = installMaidComposerCapsule(body)
  const disposeMaidComposerScroll = installMaidComposerScroll(body)
  const settingsNavigation = createMaidSettingsNavigation(body)
  ctx.effect(() => settingsNavigation.dispose, 'ui-skin-maid-atelier: settings navigation hint')
  ctx.effect(() => installMaidMobileDrawerAutoClose(body), 'ui-skin-maid-atelier: mobile drawer auto-close')
  ctx.effect(() => installMaidMobileViewport(body), 'ui-skin-maid-atelier: phone viewport')
  disposeMaidTableCards = installMaidTableCards(ctx).dispose
```

</details>

#### 缺口

- 未核验实际发布包、宿主版本矩阵和素材来源链。
  **影响**：在计划使用版本验证启停/资源和许可，检查禁用后监听与 DOM 状态。
  **进一步探讨**：在计划使用版本验证启停/资源和许可，检查禁用后监听与 DOM 状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁适合试用，怎样核验价值、成本和恢复？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

偏好主题且常在窄屏切换会话的 DSH Web 用户可在测试配置尝试切换、外部点击、弹层与设置溢出任务。成本主要是安装/兼容维护与视觉资源；相较默认主题的可用性改善是假设，尚无性能或用户数据。出现误关、背后按钮误触、诊断遮挡或禁用残留即回默认界面。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/src/client/mobile-drawer.ts:1-27](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/mobile-drawer.ts#L1-L27)

窄屏交互问题和界定。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * `@deepseek-ai/dsh-client-ui-layout` closes its narrow sidebar only from the
 * toggle button. Two gestures a phone user expects are therefore missing:
 *
 * 1. picking a session calls `openSession`, which never touches
 *    `narrowExpanded`, so the drawer keeps covering the conversation after a
 *    session switch and has to be closed by hand;
 * 2. tapping outside the open drawer does nothing at all — the host's
 *    `overlayLayer` is only an overlay container (`pointer-events: none`, no
 *    handler), not a scrim, so the drawer stays up until the toggle is found
 *    again.
 *
 * Both are mirrored here: a row activation closes the overlay on the next
 * frame, and a pointer that lands outside the open column dismisses it. The tap
 * that dismisses is then swallowed, because on a phone the control behind the
 * drawer is usually the composer — and its send button sits exactly in the
 * corner a reader aims at when dismissing.
 *
 * A settings dialog opened from the drawer is deliberately *not* a dismissal:
 * closing one surface must not close another the reader opened. The drawer
 * stays where it was and the dialog closes on its own.
 *
 * The breakpoint mirrors `SIDEBAR_AUTO_COLLAPSE` in the layout package: below it
 * the collapsed column is a rail and the expanded column is an overlay, above it
 * the column is docked and must stay open.
 */
const DRAWER_AUTO_COLLAPSE = 1024
```

</details>

**依据 2 · 源码核查**：[maid-atelier/src/client/settings-navigation.ts:35-84](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/settings-navigation.ts#L35-L84)

溢出提示更新机制。

<details>
<summary>查看原文（50行）</summary>

```text
function createNavigation(body: HTMLElement): SettingsNavigation {
  let active = true
  let nav: HTMLElement | null = null
  let list: HTMLElement | null = null
  let originalMore: string | null = null
  let writtenMore: string | null = null
  let resizeObserver: ResizeObserver | undefined

  const update = (): void => {
    if (!active || nav === null || list === null) return
    const more = list.scrollHeight - list.clientHeight - Math.max(0, list.scrollTop) > 1
    writtenMore = more ? '' : null
    if (nav.getAttribute(MORE_ATTRIBUTE) === writtenMore) return
    if (writtenMore === null) nav.removeAttribute(MORE_ATTRIBUTE)
    else nav.setAttribute(MORE_ATTRIBUTE, writtenMore)
  }

  const detach = (): void => {
    resizeObserver?.disconnect()
    resizeObserver = undefined
    list?.removeEventListener('scroll', update)
    if (nav !== null && nav.getAttribute(MORE_ATTRIBUTE) === writtenMore) {
      if (originalMore === null) nav.removeAttribute(MORE_ATTRIBUTE)
      else nav.setAttribute(MORE_ATTRIBUTE, originalMore)
    }
    nav = null
    list = null
  }

  const synchronize = (): void => {
    if (!active) return
    const nextNav = body.querySelector<HTMLElement>(NAV_SELECTOR)
    const nextList = nextNav?.querySelector<HTMLElement>(':scope > :last-child') ?? null
    if (nav !== nextNav || list !== nextList) {
      detach()
      nav = nextNav
      list = nextList
      originalMore = nav?.getAttribute(MORE_ATTRIBUTE) ?? null
      writtenMore = originalMore
      if (list !== null) {
        try {
          list.addEventListener('scroll', update, { passive: true })
          if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(update)
            resizeObserver.observe(list)
          }
        } catch (error) {
          detach()
          throw error
        }
```

</details>

**依据 3 · 源码核查**：[maid-atelier/src/client/customization.ts:87-171](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/src/client/customization.ts#L87-L171)

安装与卸载外观处理。

<details>
<summary>查看原文（85行）</summary>

```text
export function installMaidCustomization(root: HTMLElement = document.documentElement): () => void {
  const projector = new SkinAttributeProjector(root)
  const properties = new SkinPropertyProjector(root)
  let observer: MutationObserver | undefined
  let frame: number | undefined
  let activeState: SkinCustomizationState | null = null
  let mobile = window.innerWidth <= 700

  const synchronizeModel = (): void => {
    let family: ReturnType<typeof modelFamily> = null
    for (const trigger of document.querySelectorAll<HTMLElement>("[data-composer-card] button[aria-haspopup='menu']")) {
      family = modelFamily(`${trigger.title} ${trigger.getAttribute('aria-label') ?? ''} ${trigger.textContent ?? ''}`)
      if (family !== null) break
    }
    if (family === null) projector.unset(ATTR_MODEL)
    else projector.set(ATTR_MODEL, family)
  }

  const scheduleModelSync = (): void => {
    if (frame !== undefined) return
    frame = requestAnimationFrame(() => {
      frame = undefined
      synchronizeModel()
    })
  }

  const startModelObserver = (): void => {
    if (observer !== undefined) return
    observer = new MutationObserver(records => {
      if (records.some(record => {
        const element = record.target instanceof Element ? record.target : undefined
        if (record.type === 'childList' && element?.closest('[data-composer-input]')) return false
        if (record.type === 'attributes') return element?.matches("button[aria-haspopup='menu']") === true
        if (element?.closest("[data-composer-card] button[aria-haspopup='menu']")) return true
        return [...record.addedNodes, ...record.removedNodes].some(node => (
          node instanceof Element
          && (node.matches("[data-composer-card], button[aria-haspopup='menu']")
            || node.querySelector("[data-composer-card], button[aria-haspopup='menu']"))
        ))
      })) scheduleModelSync()
    })
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['aria-label', 'title'],
      childList: true,
      subtree: true,
    })
    synchronizeModel()
  }

  const stopModelObserver = (): void => {
    observer?.disconnect()
    observer = undefined
    if (frame !== undefined) cancelAnimationFrame(frame)
    frame = undefined
    projector.release(ATTR_MODEL)
  }

  const synchronizeModelMode = (): void => {
    if (activeState === null) return
    const modelExit = mobile
      ? activeState.values.mobileModelExit !== false
      : activeState.values.modelExit === true
    projector.set(ATTR_MODEL_EXIT, modelExit ? 'enabled' : 'disabled')
    if (modelExit) startModelObserver()
    else stopModelObserver()
  }

  const onResize = (): void => {
    const nextMobile = window.innerWidth <= 700
    if (mobile === nextMobile) return
    mobile = nextMobile
    synchronizeModelMode()
  }

  const apply = (state: SkinCustomizationState | null): void => {
    if (state === null) {
      window.removeEventListener('resize', onResize)
      activeState = null
      stopModelObserver()
      projector.release()
      properties.release()
      return
    }
    if (activeState === null) window.addEventListener('resize', onResize)
```

</details>

**依据 4 · 作者声明**：[maid-atelier/README.md:1-30](https://github.com/Small-tailqwq/dsh-deep-whale/blob/811fa53b712a16ce5f5278529bb76d5a033a1d13/maid-atelier/README.md#L1-L30)

用户侧使用和限制说明。

<details>
<summary>查看原文（30行）</summary>

````text
# maid-atelier · 深海女仆工坊

DeepSeek Harness Web GUI 的深海女仆工坊皮肤：两位鲸鱼娘女仆、深海蓝蕾丝与 Q 版侧栏，把 DSH 布置成女仆工坊。纯展示层客户端插件——`apply()` 设置 `data-dsh-maid-atelier` 作用域、按亮/暗主题切换宫殿背景、以独立透明层挂载双女仆角色、装饰可折叠侧栏,并为加载/思考/工具运行状态预留稳定动画钩子。effect 销毁器还原全部 CSS/DOM 写入;不注入服务、不发出 Cordis 事件、不触达模型请求。

## 特性

- 双女仆工坊场景对话背景(亮/暗自动切换)
- 深海蓝、陶瓷白、长春花蓝、柔金构成的可热切换 UI 覆盖层
- 亮色主题采用半透明磨砂消息气泡，可在「设置 → 皮肤管理」中调节背景亮度（60%～100%，默认 80%），也可开启「简洁过程行」去掉过程底色并调整字色（默认关闭）
- Q 版侧栏角色与视口装饰、favicon
- 在「设置 → 皮肤管理 → 深海女仆工坊」中可关闭「显示侧栏 U 形花边」（默认开启），同时移除会话列表底部渐隐和装饰留白，保留输入框装饰；分区过高时可单独调低「工作区横幅高度」。
- 启动插件加载失败时，默认以左右独立的双女仆立绘装饰原生错误报告，支持窄屏重排，遵循现有立绘显示与时段设置。此效果依赖皮肤已成功执行；皮肤自身或内核尚未加载时保留原生页面。
- 双女仆与宫殿背景整层挂在**对话区(centerCol)内部**:随聊天区域尺寸自适应(右/下工作台推开聊天区时背景与女仆同步收缩,不再固定于视口),左女仆贴聊天区左下、右女仆贴右下,均位于聊天记录与输入器之下;聊天态与着陆页按比例切换构图
- 图片素材随包分发，由皮肤自己的同源路由提供(不内嵌进 client bundle),激活不依赖任何远程 URL 或外部资源服务器

## 安装

> 若已安装 `@linxin666/dsh-web-all`（dsh-web），请从 dsh-web 自带的皮肤中心/安装入口安装其适配版 `maid-atelier` 与 `orca-link`，不要执行下面的 standalone 安装命令。两种发行方式的组件与样式契约不同，不能在同一 profile 中叠装。

推荐连同皮肤管理器一起，从 npm 安装稳定版：

```sh
dsh plugin --profile web add '@smalltailqwq/dsh-client-ui-skin-deep-whale-manager' && dsh plugin --profile web add '@smalltailqwq/dsh-client-ui-skin-maid-atelier'
```

PowerShell 版本见仓库 README。未指定 dist-tag 时 npm 使用 `latest`。首次安装后重启一次 DSH，然后在“设置 → 皮肤管理”中选择“深海女仆工坊”；之后切换走配置热重载。独立子包 link 仅用于本地开发。

加载即生效、卸载即复原(与皮肤中心/dsh-skin 的互斥切换兼容,`wiring.id` 为 `ui-skin-maid-atelier`)。

## 网页与应用图标
````

</details>

#### 缺口

- 真实设备误触率、性能、维护成本和偏好未知。
  **影响**：对照默认主题记录任务成功、误触、加载与恢复
  **进一步探讨**：出现操作/退出问题立即停用。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
