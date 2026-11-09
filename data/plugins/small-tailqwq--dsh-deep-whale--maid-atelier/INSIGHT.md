# Maid Atelier

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d9bb498](https://github.com/Small-tailqwq/dsh-deep-whale/tree/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier)

<!-- BEGIN META -->
[![GitHub ★ 3,065](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C065&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Small-tailqwq/dsh-deep-whale) [![npm 30d 88,454](https://img.shields.io/static/v1?label=npm+30d&message=88%2C454&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-maid-atelier) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-maid-atelier)
<!-- END META -->

> **功能**：为 DSH Web GUI 提供深海女仆主题、随对话区变化的装饰与宽表格展开。

> **亮点**：[Q01](#research-q01) 的增量是把对话区内的角色装饰和宽表格展开做成可启停的组合。[Q02](#research-q02) 通过包内图片路由把两端资产与主题生命周期接起来。

> **主要限制**：[Q03](#research-q03) 的错误页识别依赖具体英文文本和宿主 DOM。普通样式和停用清理也与宿主标记有关，皮肤能加载不代表错误诊断、表格和输入始终可用。

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
  - [Q01 · 皮肤给谁带来什么，原界面和手写 CSS 能否满足？](#detail-section-11)
  - [Q02 · 页面和图片如何实际加载？](#detail-section-12)
  - [Q03 · 错误页装饰和停用还原有哪些边界？](#detail-section-13)
  - [Q04 · 试用需要哪些宿主、发行和授权条件？](#detail-section-14)
  - [Q05 · 能否用界面任务验收降低皮肤升级错配？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：偏好深海女仆风格且使用符合素材条件的个人 DSH Web 用户，可在保持日常阅读和输入的前提下尝试整套主题。[Q01](#research-q01)

宿主原生明暗模式能维持默认工作流，少量配色也可由手写 CSS 完成。组合角色、主题切换及表格阅读组件需要额外接线。[Q01](#research-q01)

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

> **思考**：[Q03](#research-q03) 的错误页识别依赖具体英文文本和宿主 DOM。普通样式和停用清理也与宿主标记有关，皮肤能加载不代表错误诊断、表格和输入始终可用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的增量是把对话区内的角色装饰和宽表格展开做成可启停的组合。[Q02](#research-q02) 通过包内图片路由把两端资产与主题生命周期接起来。

[Q02](#research-q02) 的图片服务只读明列文件，降低对外部资源的依赖。[Q03](#research-q03) 的错误标记用多所有者租约回收，可用于其它共享 DOM 装饰，但仍需针对宿主选择器验证真实启停。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的错误页识别依赖具体英文文本和宿主 DOM。普通样式和停用清理也与宿主标记有关，皮肤能加载不代表错误诊断、表格和输入始终可用。

<a id="detail-section-6"></a>

### 1.5 使用建议

依 [Q04](#research-q04)，只在符合素材条件的测试配置用一次宽表格、输入和切换任务。发现诊断被遮住、键盘不易退出或停用有残留时，先回默认界面再确认宿主结构。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

样式作用域、资源路由、错误页条件装饰和释放路径有源码证据。浏览器性能、用户阅读体验与跨宿主行为待验证。

- 已检查：作者 README、包清单、源码路径 maid-atelier/README.md、maid-atelier/src/client/index.ts、maid-atelier/src/client/table-card.ts、maid-atelier/cordis.patch.yml、maid-atelier/package.json、maid-atelier/src/index.ts、shared/skin-assets.ts、maid-atelier/src/client/asset-url.ts、maid-atelier/src/client/boot-error.ts、maid-atelier/src/client/boot-error.module.css、maid-atelier/src/client/release-claimed-styles.ts、maid-atelier/tests/apply.spec.ts、maid-atelier/tests/table-card.spec.ts 及固定范围 inventory；组件：maid-atelier。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计为子组件的指定 Markdown、JS/TS 范围，含生成或构建文件时不推算原创量。实际读子包和直接使用的共享图片服务，未审所有 CSS、素材版权链、宿主源码或发布包。未运行目标皮肤、宿主、浏览器和测试。
- 下一步：在实际计划使用的 DSH Web 版本上以同一对话做启用、错误诊断、展开宽表格、输入和停用对照。拟议宿主测试见 [Q05](#research-q05)。

**分析版本**

- **仓库**：[Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale)
- **版本号**：0.1.10（[固定提交 d9bb498](https://github.com/Small-tailqwq/dsh-deep-whale/tree/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出用固定宿主上的错误阅读、长表格、输入和停用任务补足模拟 DOM 的覆盖，比较漏检与维护开销。

在实际计划使用的 DSH Web 版本上以同一对话做启用、错误诊断、展开宽表格、输入和停用对照。拟议宿主测试见 [Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 93 | — | — | 1820 |
| .js | source | 2 | 3625 | 3266 | 426 | — |
| .ts | source | 27 | 3906 | 3072 | 550 | — |
| .ts | test | 14 | 6503 | 5409 | 508 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=23&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 30](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=30&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH Web 用户启用 Maid Atelier 后，样式与错误页装饰如何挂载和恢复，哪些宿主变化最可能影响正常阅读？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 皮肤给谁带来什么，原界面和手写 CSS 能否满足？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

偏好女仆工坊视觉且素材使用符合作者条件的个人 DSH Web 用户，可用这个子包调整聊天背景、侧栏与输入界面。原生明暗主题可保留默认布局，简单 CSS 也能改颜色。这里增加的是把按明暗切换的背景、跟随对话区的角色装饰和宽表格展开组合成可启停的皮肤，不需用户逐处拼样式。宽表格展开使用克隆面板，按关闭或 Escape 可退回，原表格节点留在宿主位置。合格试用以同一会话能读表格、发消息和切会话为条件，图案出现并不足够。主题审美与实际舒适度需用户自行判断。

#### 证据与依据

**依据 1 · 作者声明**：[maid-atelier/README.md:3-14](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/README.md#L3-L14)

作者说明视觉目标、主题切换和布局。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[maid-atelier/src/client/index.ts:238-260](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/index.ts#L238-L260)

创建独立、对辅助技术隐藏的装饰层。

<details>
<summary>查看原文（23行）</summary>

```text
function createCharacterStage(): HTMLDivElement {
  const stage = document.createElement('div')
  stage.dataset.skinChrome = 'character-stage'
  stage.dataset.skinOwner = SKIN_OWNER
  stage.setAttribute('aria-hidden', 'true')

  const left = document.createElement('img')
  left.dataset.maidCharacter = 'left'
  left.alt = ''
  left.src = MAID_ATELIER_MAID_LEFT

  const right = document.createElement('img')
  right.dataset.maidCharacter = 'right'
  right.alt = ''
  right.src = MAID_ATELIER_MAID_RIGHT

  const vision = document.createElement('img')
  vision.dataset.maidCharacter = 'vision'
  vision.alt = ''
  vision.src = MAID_ATELIER_MAID_RIGHT_VISION

  stage.append(left, right, vision)
  return stage
```

</details>

**依据 3 · 源码核查**：[maid-atelier/src/client/index.ts:274-279](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/index.ts#L274-L279)

装饰层挂到实际会话列。

```text
function ensureChatAreaStage(stage: HTMLElement): boolean {
  const chat = document.querySelector<HTMLElement>(CONVERSATION_COLUMN_SELECTOR)
  if (!chat) return false
  if (stage.parentElement !== chat) chat.prepend(stage)
  return true
}
```

**依据 4 · 源码核查**：[maid-atelier/src/client/table-card.ts:285-320](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/table-card.ts#L285-L320)

克隆宿主表格，保留原节点并接线关闭和键盘退出。

<details>
<summary>查看原文（36行）</summary>

```text
    const scroller = document.createElement('div')
    scroller.dataset.maidTableExpandedScroller = ''
    // Keep the host Markdown typography and link states around the portaled clone.
    scroller.className = wrapper.closest(MARKDOWN_CONTAINER_SELECTOR)?.className ?? ''

    const clone = wrapper.cloneNode(true) as HTMLElement
    // The panel scroller owns overflow; the host wide-table hook forces a bar on hover.
    clone.classList.remove('md-table-wide')
    clone.removeAttribute(FRAME_ATTRIBUTE)
    clone.removeAttribute(EXPANDABLE_ATTRIBUTE)
    clone.removeAttribute(OPEN_ATTRIBUTE)
    clone.removeAttribute('tabindex')
    clone.removeAttribute('aria-label')
    clone.querySelector(`[${CONTROL_ATTRIBUTE}]`)?.remove()
    clone.dataset.maidTableExpanded = ''
    scroller.append(clone)
    panel.append(close, scroller)
    root.append(backdrop, panel)

    const onClick = (event: MouseEvent): void => {
      const target = event.target
      if (target instanceof Element
        && (target.closest('[data-maid-table-close]') !== null || target.hasAttribute('data-maid-table-backdrop'))) {
        closeOverlay()
      }
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') closeOverlay()
    }

    root.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeyDown)
    document.body.append(root)
    setLeasedAttribute(wrapper, OPEN_ATTRIBUTE, owner, true)
    overlay = { root, source: wrapper, onClick, onKeyDown }
    close.focus({ preventScroll: true })
```

</details>

#### 缺口

- 没有用户任务对照或真实视觉测量
  **影响**：无法判断对阅读和交互的改善
  **进一步探讨**：同一宽表格在原生和皮肤下分别核查键盘、窄屏和主任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 页面和图片如何实际加载？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

补丁插入 Web skin 的真实包名，清单分别给出包根与客户端入口。包根 apply 以自家运行时目录和生成的资源清单调用共享图片服务。宿主有 webServer 时，服务挂载前缀路由，只接受 GET 或 HEAD，要求文件在白名单且名字是 64 位十六进制加 png 或 webp，路径不符和缺文件均返回 404。可读文件按名字里的摘要生成 ETag，并设置长期缓存；读请求不会重算内容哈希。浏览器端基于 document.baseURI 生成资源 URL，在 body 写入皮肤作用域，把主题背景和装饰放到实际对话列，明暗变化触发切换。这个路径依赖同源宿主资源可解析，404 时无该图；禁用释放服务器路由，浏览器已缓存的公开图片不随之清除。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/cordis.patch.yml:5-7](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/cordis.patch.yml#L5-L7)

实际安装行指定本皮肤包。

```text
- insert:
    - id: ui-skin-maid-atelier
      name: '@smalltailqwq/dsh-client-ui-skin-maid-atelier'
```

**依据 2 · 源码核查**：[maid-atelier/package.json:7-23](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/package.json#L7-L23)

包根入口和 Web 客户端声明。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[maid-atelier/src/index.ts:1-8](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/index.ts#L1-L8)

Host apply 实际交给共享服务和静态白名单。

```text
import type { Context } from '@deepseek-ai/cordis'
import { installSkinAssets } from '../../shared/skin-assets.ts'
import files from '../assets/runtime/manifest.json'

/** Serve only this package's immutable presentation assets while the skin is enabled. */
export function apply(ctx: Context): void {
  installSkinAssets(ctx, 'maid-atelier', new URL('../assets/runtime/', import.meta.url), files)
}
```

**依据 4 · 源码核查**：[shared/skin-assets.ts:10-32](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/shared/skin-assets.ts#L10-L32)

挂载服务、方法限制、文件格式和未找到处理。

<details>
<summary>查看原文（23行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[shared/skin-assets.ts:34-48](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/shared/skin-assets.ts#L34-L48)

ETag、缓存和效果生命周期绑定。

<details>
<summary>查看原文（15行）</summary>

```text
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
  })
```

</details>

**依据 6 · 源码核查**：[maid-atelier/src/client/asset-url.ts:1-4](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/asset-url.ts#L1-L4)

资源 URL 以宿主页基址解析。

```text
/** Resolve against the host base, including reverse-proxy mounts and dsh-app desktop forwarding. */
export function skinAssetUrl(file: string): string {
  return new URL(`skin-assets/maid-atelier/${file}`, document.baseURI).href
}
```

**依据 7 · 源码核查**：[maid-atelier/src/client/index.ts:659-672](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/index.ts#L659-L672)

客户端注册主题作用域、装饰和组件。

<details>
<summary>查看原文（14行）</summary>

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
  body.style.setProperty('--maid-top-trim-art', `url(${MAID_ATELIER_TOP_TRIM_TILE})`)
  body.style.setProperty('--maid-boot-error-left-art', `url(${MAID_BOOT_ERROR_LEFT})`)
  body.style.setProperty('--maid-boot-error-right-art', `url(${MAID_BOOT_ERROR_RIGHT})`)
```

</details>

**依据 8 · 源码核查**：[maid-atelier/src/client/index.ts:701-713](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/index.ts#L701-L713)

按宿主主题写入明暗背景。

<details>
<summary>查看原文（13行）</summary>

```text
  const syncBackdrop = (): void => {
    const source = body.hasAttribute('data-ds-dark-theme')
      ? MAID_ATELIER_PALACE_DARK
      : MAID_ATELIER_PALACE_LIGHT
    const next = `url(${source})`
    // The palace rides a custom property so the stage inside the conversation
    // column owns the backdrop — the column's box (not the viewport) defines
    // where the art lives and how it re-fits when the chat area is pushed.
    if (body.style.getPropertyValue('--maid-palace-art') !== next) {
      body.style.setProperty('--maid-palace-art', next)
    }
  }
  syncBackdrop()
```

</details>

**依据 9 · 源码核查**：[maid-atelier/src/client/index.ts:1130-1141](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/index.ts#L1130-L1141)

聊天结构或明暗变化时更新装饰。

<details>
<summary>查看原文（12行）</summary>

```text
    }
    if (rootLayoutChanged) syncShellKind()
    if (projectedStateChanged || settingsStateChanged) syncProjectedState()
    if (!sidebarStructureChanged && settingsStateChanged) syncSidebarCarriers()
    if (sidebarStructureChanged) syncSidebarDecorations()
    else if (workspaceStateChanged) decorateWorkspaceTree(decoratedElements)
    if (!sidebarStructureChanged && chatStructureChanged) {
      ensureChatAreaStage(characterStage)
      ensureChatAreaChrome(topTrim, bottomTrim)
      ensureResizeObserved()
    }
    if (backdropChanged) syncBackdrop()
```

</details>

#### 缺口

- 未测试部署在子路径、代理或 Desktop 的图片加载
  **影响**：实际同源路径和资源包完整性仍需验收
  **进一步探讨**：在拟用宿主检查 URL、状态码及停用后的路由行为。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 错误页装饰和停用还原有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

错误页装饰由客户端 apply 注册。它在 [data-dsh-boot] 内寻找没有子元素且文本完全等于 Failed to load plugins 的 div，匹配才加标记。CSS 在标记下改变原错误报告的布局，并用不接管指针的伪元素显示图像，手机尺寸把报告排在前面。它没有替换错误正文，也无法在皮肤自身没加载时装饰页面。若宿主翻译该标题、改变标签或 DOM 层级，识别会失效或样式不适配。清理会断开监听、释放 owned 标记、恢复部分记录值并移除节点。错误标记有多所有者租约且仅在末个所有者退出、值仍符合预期时还原。皮肤还会移除被 loader 误标到自己的外来 style 上的标签，以便宿主清扫时保留这些样式。该判据依赖宿主的标记规则，且普通样式恢复有直接写回快照的路径，不能由此保证与另一个写同一位置的皮肤并发无冲突。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/src/client/index.ts:529-548](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/index.ts#L529-L548)

客户端实际注册错误页、样式归还并保存一组旧值。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[maid-atelier/src/client/boot-error.ts:17-24](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/boot-error.ts#L17-L24)

错误标记只在末个租约释放且属性仍符合条件时恢复。

```text
  const release = (element: Element): void => {
    owned.delete(element)
    const lease = leases.get(element)
    if (!lease || !lease.owners.delete(owner) || lease.owners.size > 0) return
    leases.delete(element)
    if (element.getAttribute(ERROR_ATTRIBUTE) !== '') return
    if (lease.original === null) element.removeAttribute(ERROR_ATTRIBUTE)
    else element.setAttribute(ERROR_ATTRIBUTE, lease.original)
```

**依据 3 · 源码核查**：[maid-atelier/src/client/boot-error.ts:27-47](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/boot-error.ts#L27-L47)

只识别固定英文标题和标记下的结构。

<details>
<summary>查看原文（21行）</summary>

```text
  const synchronize = (): void => {
    const failed = new Set<Element>()
    for (const boot of document.querySelectorAll(BOOT_SELECTOR)) {
      // rc1 exposes a boot owner but no failure-state attribute. Match the
      // kernel's exact report heading; unknown markup keeps the native page.
      const hasReport = [...boot.querySelectorAll('div')].some(element =>
        element.childElementCount === 0 && element.textContent === 'Failed to load plugins',
      )
      if (!hasReport) continue
      failed.add(boot)
      if (owned.has(boot)) continue
      let lease = leases.get(boot)
      if (!lease) {
        lease = { original: boot.getAttribute(ERROR_ATTRIBUTE), owners: new Set() }
        leases.set(boot, lease)
      }
      lease.owners.add(owner)
      owned.add(boot)
      boot.setAttribute(ERROR_ATTRIBUTE, '')
    }
    for (const element of owned) if (!failed.has(element)) release(element)
```

</details>

**依据 4 · 源码核查**：[maid-atelier/src/client/boot-error.ts:50-70](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/boot-error.ts#L50-L70)

观察器与租约在释放或安装抛错时回收。

<details>
<summary>查看原文（21行）</summary>

```text
  const dispose = (): void => {
    observer?.disconnect()
    for (const element of owned) release(element)
  }

  try {
    observer = new MutationObserver(records => {
      if (records.some(record => {
        const target = record.target instanceof Element ? record.target : record.target.parentElement
        if (target?.closest(BOOT_SELECTOR)) return true
        return [...record.addedNodes, ...record.removedNodes].some(node =>
          node instanceof Element && (node.matches(BOOT_SELECTOR) || node.querySelector(BOOT_SELECTOR)),
        )
      })) synchronize()
    })
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true })
    synchronize()
    return dispose
  } catch (error) {
    dispose()
    throw error
```

</details>

**依据 5 · 源码核查**：[maid-atelier/src/client/boot-error.module.css:58-77](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/boot-error.module.css#L58-L77)

立绘为伪元素且不处理指针。

<details>
<summary>查看原文（20行）</summary>

```text
html:not([data-dsh-whale-maid-art='hidden']) body[data-dsh-maid-atelier] [data-maid-boot-error]::before,
html:not([data-dsh-whale-maid-art='hidden']) body[data-dsh-maid-atelier] [data-maid-boot-error]::after {
  content: '';
  display: block;
  justify-self: start;
  width: calc(var(--maid-boot-figure-height) * .5);
  height: var(--maid-boot-figure-height);
  background: center / contain no-repeat;
  pointer-events: none;
}

html:not([data-dsh-whale-maid-art='hidden']) body[data-dsh-maid-atelier] [data-maid-boot-error]::before {
  grid-area: left;
  background-image: var(--maid-boot-error-left-art);
}

html:not([data-dsh-whale-maid-art='hidden']) body[data-dsh-maid-atelier] [data-maid-boot-error]::after {
  grid-area: right;
  margin-left: calc(var(--maid-boot-figure-height) * -.175);
  background-image: var(--maid-boot-error-right-art);
```

</details>

**依据 6 · 源码核查**：[maid-atelier/src/client/boot-error.module.css:103-117](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/boot-error.module.css#L103-L117)

窄屏将报告放在第一行。

<details>
<summary>查看原文（15行）</summary>

```text
/* Keep the report first and give each figure its own row on phones. */
@media (max-width: 420px) {
  html:not([data-dsh-whale-maid-art='hidden']) body[data-dsh-maid-atelier] [data-maid-boot-error] {
    --maid-boot-figure-height: min(22dvh, 150px);
    grid-template-areas: 'report' 'left' 'right';
    grid-template-columns: minmax(0, 1fr);
    row-gap: 8px;
  }

  html:not([data-dsh-whale-maid-art='hidden']) body[data-dsh-maid-atelier] [data-maid-boot-error]::before,
  html:not([data-dsh-whale-maid-art='hidden']) body[data-dsh-maid-atelier] [data-maid-boot-error]::after {
    width: min(100%, 200px);
    height: var(--maid-boot-figure-height);
    justify-self: center;
  }
```

</details>

**依据 7 · 源码核查**：[maid-atelier/src/client/index.ts:577-613](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/index.ts#L577-L613)

清理真实接线涵盖 DOM 属性、组件、观察器和内联样式。

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

**依据 8 · 源码核查**：[maid-atelier/src/client/release-claimed-styles.ts:22-27](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/release-claimed-styles.ts#L22-L27)

符合宿主标记的非皮肤 CSS 标签被解除归属。

```text
export function releaseClaimedStyles(doc: Document = document, id: string = SKIN_PACKAGE_ID): void {
  const claimed = doc.querySelectorAll<HTMLStyleElement>(
    `style[data-plugin=${JSON.stringify(id)}]:not([data-plugin-css])`,
  )
  for (const style of claimed) style.removeAttribute('data-plugin')
}
```

#### 缺口

- 未在真实宿主制造失败页、切换和并发 DOM 改动
  **影响**：不能保证错误诊断可读和全面无残留
  **进一步探讨**：隔离配置测试已加载与未加载场景并切回默认，核查正文、控件和样式。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试用需要哪些宿主、发行和授权条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

源树子包是 0.1.10，声明 Web 平台、宿主布局注入、Cordis ^4.0.1 和 DSH >=0.2.2-0 且 <0.2.3-0。应使用相符的运行宿主与完整包，客户端、Host 入口和 runtime 图片必须配套。作者推荐与皮肤管理器一起安装，已使用 dsh-web 聚合生态时应选其适配版，避免把两套发行叠装。素材文档区分 MIT 代码和禁止商业使用的美术许可，采用前需按发布说明核对使用条件。先在单主题测试 profile 用包含宽表格和设置对话框的会话，验证亮暗切换、输入和停用。首次投入有包下载、图像缓存和核对配置的时间，持续需承担观察器和图片绘制，失败要重载或回退。没有金额、耗时、CPU 和内存实测。若输入受遮挡、表格键盘退出不顺、错误内容读不全或停用后有样式残留，应恢复默认并回读。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/package.json:1-23](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/package.json#L1-L23)

固定包版本与客户端宿主能力声明。

<details>
<summary>查看原文（23行）</summary>

```text
{
  "name": "@smalltailqwq/dsh-client-ui-skin-maid-atelier",
  "description": "Two whale maids, navy lace and a chibi sidebar turn DSH into a maid atelier.",
  "icon": "assets/plugin-icon.png",
  "version": "0.1.10",
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
```

</details>

**依据 2 · 源码核查**：[maid-atelier/package.json:42-50](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/package.json#L42-L50)

明确 peer 声明和 optional 标记。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh": ">=0.2.2-0 <0.2.3-0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh": {
      "optional": true
    }
  },
```

**依据 3 · 源码核查**：[maid-atelier/package.json:58-73](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/package.json#L58-L73)

发布清单包含两端产物、运行时美术和许可。

<details>
<summary>查看原文（16行）</summary>

```text
  "files": [
    "lib/index.js",
    "lib/client.js",
    "cordis.patch.yml",
    "skin.json",
    "skin.build.json",
    "preview",
    "assets/icons/*.ico",
    "LICENSE",
    "LICENSE-ARTWORK",
    "NOTICE",
    "README.md",
    "docs",
    "assets/runtime",
    "locale/*.json",
    "assets/plugin-icon.png"
```

</details>

**依据 4 · 作者声明**：[maid-atelier/README.md:16-32](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/README.md#L16-L32)

作者区分适配与独立版，并描述启停和浏览器图标边界。

<details>
<summary>查看原文（17行）</summary>

````text
## 安装

> 若已安装 `@linxin666/dsh-web-all`（dsh-web），请从 dsh-web 自带的皮肤中心/安装入口安装其适配版 `maid-atelier` 与 `orca-link`，不要执行下面的 standalone 安装命令。两种发行方式的组件与样式契约不同，不能在同一 profile 中叠装。

推荐连同皮肤管理器一起，从 npm 安装稳定版：

```sh
dsh plugin --profile web add '@smalltailqwq/dsh-client-ui-skin-deep-whale-manager' && dsh plugin --profile web add '@smalltailqwq/dsh-client-ui-skin-maid-atelier'
```

PowerShell 版本见仓库 README。未指定 dist-tag 时 npm 使用 `latest`。首次安装后重启一次 DSH，然后在“设置 → 皮肤管理”中选择“深海女仆工坊”；之后切换走配置热重载。独立子包 link 仅用于本地开发。

加载即生效、卸载即复原(与皮肤中心/dsh-skin 的互斥切换兼容,`wiring.id` 为 `ui-skin-maid-atelier`)。

## 网页与应用图标

标签页在每次加载皮肤模块时从三种表情中随机选择图标，本次加载内保持不变。安装为 Web App 时固定使用托腮图，任务栏图标由浏览器和系统据此生成；已安装或已固定的应用可能需要重新安装或固定才能更新。关闭女仆皮肤时恢复宿主的 favicon 和 manifest 声明。
````

</details>

**依据 5 · 作者声明**：[maid-atelier/README.md:36-46](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/README.md#L36-L46)

作者分别声明代码和美术的使用条件。

<details>
<summary>查看原文（11行）</summary>

```text
## 素材来源与许可

本皮肤代码采用 **MIT**；全部美术资源（包括 AI 生成及加工的图片）**禁止商业性使用**，保留相应权利人的版权及既有 **CC BY-NC-SA 4.0** 授权（署名、非商业、相同方式共享）。随包分发的图片同样遵守美术许可。

皮肤素材为衍生创作,署名链(详见 `NOTICE`):

1. **一创 上善**（[Pixiv](https://www.pixiv.net/users/62155430) · [Bilibili：上善无形](https://b23.tv/8h5L4xz)）—— 鲸鱼娘角色形象原作者
2. **二创 ZipZipPipe**（[Pixiv](https://www.pixiv.net/users/18604994) · [Bilibili：ZipZipPipe](https://b23.tv/Pnw6nG8)）—— 在其形象上加入 DeepSeek 元素的女仆鲸鱼娘二次设计(生成模型 GPT Image 2)
3. **三创(本皮肤)Small-tailqwq** —— DeepSeek 元素再设计

许可范围与 MIT 正文见 [LICENSE](LICENSE)，美术许可正文见 [LICENSE-ARTWORK](LICENSE-ARTWORK)，署名链见 [NOTICE](NOTICE)。
```

</details>

**依据 6 · 作者声明**：[maid-atelier/README.md:48-57](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/README.md#L48-L57)

作者要求配套两端 JS、图像与构建指纹。

<details>
<summary>查看原文（10行）</summary>

````text
## 开发与构建

构建预设源自 [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)(作者:Solitude)，当前皮肤在本仓库维护。在本皮肤目录执行：

```sh
npm run build       # 校验静态图片、构建两端 JS、生成指纹
npm test            # 行为测试
```

PNG/WebP 以原字节随包分发，通过宿主同源资源路由加载。升级时需同步 `lib/`、`assets/runtime/` 与 `skin.build.json`；仅替换客户端文件会缺少图片服务。资源路径、缓存与素材更新方式见 [静态图片说明](../docs/asset-delivery.md)。
````

</details>

#### 缺口

- 未核实发布包对应固定提交或运行负担
  **影响**：不能由源码版本和外观截图推断实际安装兼容或资源成本
  **进一步探讨**：使用精确包，在目标桌面与窄屏环境比较启停前后和每次阅读任务。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用界面任务验收降低皮肤升级错配？

**研究主题**：新假设与验证

#### 完整回答

当前 jsdom 测试已经构造可控 DOM 与尺寸，检查表格展开、Escape 和销毁，以及侧栏宽度回写。拟议补充是在实际 DSH Web 版本上保留固定的阅读与启停任务，检查打开长诊断、输入发消息、展开宽表格、切换明暗、停用后恢复。重点是 DOM 与真实布局的错配，比如宿主改了错误标题、会话列选择器或 overlay 顺序，而不是再写一次相同节点断言。用包含已知错配和正常样本的固定宿主矩阵，对比现有断言与增加的任务检查，记录漏检、误报和维护时间。若只重复现有测试、漏检不降或维护时长超过约定，停止扩大矩阵。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/tests/apply.spec.ts:1-12](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/tests/apply.spec.ts#L1-L12)

现有 apply 测试的 jsdom 环境和释放契约。

<details>
<summary>查看原文（12行）</summary>

```text
// @vitest-environment jsdom
/**
 * Maid Atelier skin apply spec — the template contract: the body
 * attribute the stylesheet is scoped on is set on apply and retracted on
 * dispose, and every injected chrome element (marked data-skin-chrome) is
 * removed. Extend with assertions specific to your surface.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context, type Fiber } from '@deepseek-ai/cordis'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { apply } from '../src/client/index.ts'
```

</details>

**依据 2 · 源码核查**：[maid-atelier/tests/apply.spec.ts:3160-3187](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/tests/apply.spec.ts#L3160-L3187)

模拟宽度，核查作用域规则和销毁后恢复。

<details>
<summary>查看原文（28行）</summary>

```text
  it('keeps the skin chrome aligned to the live sidebar width and restores the prior value', async () => {
    document.body.style.setProperty('--maid-sidebar-width', 'legacy')
    document.body.innerHTML = '<div class="AppFrame_sidebarCol"><div></div></div>'
    const sidebar = document.querySelector<HTMLElement>("[class*='sidebarCol']")
    sidebar!.getBoundingClientRect = () => ({
      x: 0,
      y: 0,
      width: 312,
      height: 900,
      top: 0,
      right: 312,
      bottom: 900,
      left: 0,
      toJSON: () => ({}),
    })

    fiber = await mount()
    const widthRule = document.head
      .querySelector<HTMLStyleElement>("[data-skin-chrome='sidebar-width-rule']")!
    expect(widthRule.sheet!.cssRules[0].cssText).toContain('--maid-sidebar-width: 312px')
    // The derived sizes follow the animated width inside the rule itself, so a
    // per-frame pass writes one property instead of three.
    expect(widthRule.sheet!.cssRules[0].cssText).toContain('--maid-sidebar-swag-height: clamp(54px,calc(var(--maid-sidebar-width)*0.2575),94px)')
    expect(widthRule.sheet!.cssRules[0].cssText).toContain('--maid-sidebar-mascot-width: min(320px,calc(var(--maid-sidebar-width)*0.82))')
    expect(document.body.dataset.maidSidebarSize).toBe('wide')
    await fiber.dispose()
    expect(document.body.style.getPropertyValue('--maid-sidebar-width')).toBe('legacy')
    expect(document.head.querySelector("[data-skin-chrome='sidebar-width-rule']")).toBeNull()
```

</details>

**依据 3 · 源码核查**：[maid-atelier/tests/table-card.spec.ts:110-143](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/tests/table-card.spec.ts#L110-L143)

构造宽表格，触发 Escape 并检查销毁。

<details>
<summary>查看原文（34行）</summary>

```text
  it('removes injected controls and overlays on dispose', () => {
    vi.useFakeTimers()
    try {
      vi.stubGlobal('ResizeObserver', class {
        constructor() {}
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
      })

      const bubble = document.createElement('div')
      bubble.className = 'fixture_markdown'
      Object.defineProperty(bubble, 'clientWidth', { configurable: true, value: 680 })
      const card = document.createElement('div')
      card.className = 'md-table-wide'
      Object.defineProperty(card, 'clientWidth', { configurable: true, value: 680 })
      Object.defineProperty(card, 'scrollWidth', { configurable: true, value: 960 })
      bubble.append(card)
      document.body.append(bubble)

      const runtime = installMaidTableCards({} as never)
      card.querySelector<HTMLButtonElement>('[data-maid-table-expand]')?.click()
      expect(document.querySelector('[data-maid-table-lightbox]')).not.toBeNull()

      const timerBaseline = vi.getTimerCount()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      expect(document.querySelector('[data-maid-table-closing]')).not.toBeNull()
      expect(vi.getTimerCount()).toBe(timerBaseline + 1)

      runtime.dispose()
      expect(vi.getTimerCount()).toBe(timerBaseline)
      vi.runAllTimers()

      expect(card.hasAttribute('data-maid-table-frame')).toBe(false)
```

</details>

**依据 4 · 源码核查**：[maid-atelier/src/client/boot-error.ts:27-35](https://github.com/Small-tailqwq/dsh-deep-whale/blob/d9bb4989c941d4d1d5cee1fa8388f2d14f0a771b/maid-atelier/src/client/boot-error.ts#L27-L35)

固定错误标题是拟议真实宿主验证的触发条件。

```text
  const synchronize = (): void => {
    const failed = new Set<Element>()
    for (const boot of document.querySelectorAll(BOOT_SELECTOR)) {
      // rc1 exposes a boot owner but no failure-state attribute. Match the
      // kernel's exact report heading; unknown markup keeps the native page.
      const hasReport = [...boot.querySelectorAll('div')].some(element =>
        element.childElementCount === 0 && element.textContent === 'Failed to load plugins',
      )
      if (!hasReport) continue
```

#### 缺口

- 未执行宿主界面任务与升级故障对照
  **影响**：不能确认新增检查有净收益
  **进一步探讨**：先挑一对宿主版本和一个已知结构差异做盲测。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
