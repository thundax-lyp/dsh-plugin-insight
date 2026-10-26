# AIR-pixel Liquid Glass

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c0e2fbf](https://github.com/AIR-pixel/air-pixel-liquid-glass/tree/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AIR-pixel/air-pixel-liquid-glass)
<!-- END META -->

> **实现功能**：为DSH提供可配置的液态玻璃主题、壁纸、桌面透明、光标与点击涟漪。

> **核心亮点**：把完整视觉主题、配置持久化和宿主 UI 插槽封装成插件，降低重复手工改样式的负担。它相对“手工注入 CSS、浏览器用户样式或直接修改宿主前端资源”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **风险与缺陷**：视觉效果依赖宿主 DOM、CSS 层叠与桌面透明能力，源码和截图不能证明不同屏幕、主题与可访问性条件都成立。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

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
  - [Q01 · 目标用户、反复任务、原有办法与合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、调用链、数据和状态如何实现核心能力？](#detail-section-12)
  - [Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？](#detail-section-15)
  - [Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？](#detail-section-16)
  - [Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？](#detail-section-17)
  - [Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？](#detail-section-18)
  - [Q09 · 对谁值得观察或试用，成功与停止标准是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望统一调整 DSH 桌面/Web 视觉外观并保留可配置入口的用户可用它通过客户端样式和宿主配置接口为 DSH 增加磨砂表面、壁纸、透明度、光标与点击反馈；合格结果是主题在目标宿主正确加载、关键文字可读、交互区域不被遮挡且可以安全恢复默认。详见[Q01](#research-q01)。

基线是手工注入 CSS、浏览器用户样式或直接修改宿主前端资源。本项的价值主要来自把完整视觉主题、配置持久化和宿主 UI 插槽封装成插件，降低重复手工改样式的负担；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 液态玻璃主题 | 为主要界面表面应用磨砂、折射与透明视觉。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 壁纸与桌面透明 | 配置背景图和桌面窗口透明相关行为。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 交互装饰 | 提供自定义光标、点击涟漪和可调视觉参数。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web客户端槽位与稳定DOM/CSS | 必需 | 注入主题和设置入口 | 宿主结构变化时应降级为未应用 |
| webServer与配置存储目录 | 必需 | 读写主题设置和提供资源 | 写入失败保留旧配置并提示 |
| 桌面透明/壁纸/自定义光标能力 | 特定效果必需 | 实现背景与交互装饰 | 不支持时关闭单项而非破坏基础UI |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 在默认主题记录基线截图、对比度和交互路径 | 可回滚配置已保存 |
| 2 | 逐项启用磨砂、壁纸、透明、光标和涟漪 | 每次变更后关键文字和点击目标可用 |
| 3 | 用设置恢复默认并重启宿主 | 无残留样式、配置或资源路由 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 壁纸资源、GPU合成与本地配置 | 选择参数、做多窗口/分辨率截图检查 | 调优分钟与GPU增量未知 |
| 持续使用 | 透明/模糊/动画的GPU与电量 | 遇到宿主升级时复查视觉层叠 | 帧率、耗电和可访问性回归未知 |
| 失败恢复 | 重载样式和恢复配置 | 关闭主题、清缓存并核关键页面 | DOM遮挡时可能需手工编辑配置 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 视觉主题 | 客户端样式和配置路由存在 | 不同宿主/屏幕的一致性 |
| 交互装饰 | 光标与点击涟漪可配置 | 低性能设备帧率与误触影响 |
| 可恢复性 | 有配置存储与加载路径 | 宿主升级后能否一键回默认 |

> **思考**：视觉效果依赖宿主 DOM、CSS 层叠与桌面透明能力，源码和截图不能证明不同屏幕、主题与可访问性条件都成立。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把完整视觉主题、配置持久化和宿主 UI 插槽封装成插件，降低重复手工改样式的负担。它相对“手工注入 CSS、浏览器用户样式或直接修改宿主前端资源”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

把完整视觉主题、配置持久化和宿主 UI 插槽封装成插件，降低重复手工改样式的负担。它相对“手工注入 CSS、浏览器用户样式或直接修改宿主前端资源”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 index.js 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“用设置恢复默认并重启宿主｜无残留样式、配置或资源路由”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

视觉效果依赖宿主 DOM、CSS 层叠与桌面透明能力，源码和截图不能证明不同屏幕、主题与可访问性条件都成立。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

重视界面个性化者可在非关键工作区试用，先验证目标宿主版本、文字对比、性能与一键恢复。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：在两种DSH版本、三种分辨率和深浅背景下跑关键页面截图/键盘流程，记录WCAG对比失败数、遮挡数、平均帧率和恢复默认残留；任何设置页不可达即停止。

**分析版本**

- **仓库**：[AIR-pixel/air-pixel-liquid-glass](https://github.com/AIR-pixel/air-pixel-liquid-glass)
- **版本号**：0.2.1（[固定提交 c0e2fbf](https://github.com/AIR-pixel/air-pixel-liquid-glass/tree/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可把关键表面与对比度探针纳入主题配置预览，在应用前给出宿主版本和可访问性回归报告。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

在两种DSH版本、三种分辨率和深浅背景下跑关键页面截图/键盘流程，记录WCAG对比失败数、遮挡数、平均帧率和恢复默认残留；任何设置页不可达即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 4565 | 2377 | 1981 | — |
| .md | source | 2 | 106 | — | — | 1050 |
| .mjs | source | 19 | 10112 | 7067 | 2568 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AIR-pixel/air-pixel-liquid-glass/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 AIR-pixel Liquid Glass 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是希望统一调整 DSH 桌面/Web 视觉外观并保留可配置入口的用户。反复任务是通过客户端样式和宿主配置接口为 DSH 增加磨砂表面、壁纸、透明度、光标与点击反馈。原有办法为手工注入 CSS、浏览器用户样式或直接修改宿主前端资源。合格结果必须达到“主题在目标宿主正确加载、关键文字可读、交互区域不被遮挡且可以安全恢复默认”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

```text
# AIR-pixel Liquid Glass

A configurable Liquid Glass theme plugin for DeepSeek Harness. It adds translucent interface surfaces, an optional wallpaper, desktop transparency, window blur, custom cursors, click ripples, and per-side conversation contrast controls.

## Screenshots

Full transparency: strength 2.0 (效果强度) with desktop transparency on (透出桌面), so the desktop reaches the eye unfiltered. The per-side conversation plates are what keep the body copy readable this far up the slider.

![Liquid Glass with desktop transparency](assets/preview-transparent.png)

The same screen with and without the theme:

![The stock shell beside Liquid Glass](assets/preview-vs-stock.png)

At the default strength, over the theme's own wallpaper — sidebar, pane, dialog, menu and floating panel:

![Frosted panels at the default strength](assets/preview-surfaces.png)

| Custom cursors | Click ripple |
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

index.js 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“在默认主题记录基线截图、对比度和交互路径｜可回滚配置已保存；逐项启用磨砂、壁纸、透明、光标和涟漪｜每次变更后关键文字和点击目标可用；用设置恢复默认并重启宿主｜无残留样式、配置或资源路由”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:936-953](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/index.js#L936-L953)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * @param {object} ctx plugin context; needs the `webServer` service.
 */
export function apply(ctx) {
  const detail = detectWindowMaterialDetailed();
  ctx.logger?.info?.(`[liquid-glass] config file: ${CONFIG_FILE}`);
  // Logged eagerly even though the route would probe it lazily: ~80 ms once, and
  // "why does 透出桌面 do nothing" is otherwise a question with no visible
  // answer anywhere — the renderer cannot see this at all.
  ctx.logger?.info?.(
    `[liquid-glass] window material: ${detail.material}` +
      ` (${detail.materialWhy}` +
      (detail.materialPath === null ? '' : `, ${detail.materialPath}`) +
      (detail.materialScanVia === null ? '' : `, via ${detail.materialScanVia}`) +
      ')'
  );
  if (detail.materialScanError !== null) {
    // The one line that makes "scan-failed" actionable: which reader was tried,
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "air-pixel-liquid-glass",
  "version": "0.2.1",
  "description": "A configurable Liquid Glass theme for DeepSeek Harness with frosted surfaces, wallpaper, desktop transparency, custom cursors, and click ripples.",
  "type": "module",
  "main": "./index.js",
  "license": "MIT",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "client.js",
    "cordis.patch.yml",
    "index.js",
    "tools/asarpatch.py",
    "README.md",
    "DEVELOPMENT.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是把完整视觉主题、配置持久化和宿主 UI 插槽封装成插件，降低重复手工改样式的负担。参照是“手工注入 CSS、浏览器用户样式或直接修改宿主前端资源”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:936-953](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/index.js#L936-L953)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * @param {object} ctx plugin context; needs the `webServer` service.
 */
export function apply(ctx) {
  const detail = detectWindowMaterialDetailed();
  ctx.logger?.info?.(`[liquid-glass] config file: ${CONFIG_FILE}`);
  // Logged eagerly even though the route would probe it lazily: ~80 ms once, and
  // "why does 透出桌面 do nothing" is otherwise a question with no visible
  // answer anywhere — the renderer cannot see this at all.
  ctx.logger?.info?.(
    `[liquid-glass] window material: ${detail.material}` +
      ` (${detail.materialWhy}` +
      (detail.materialPath === null ? '' : `, ${detail.materialPath}`) +
      (detail.materialScanVia === null ? '' : `, via ${detail.materialScanVia}`) +
      ')'
  );
  if (detail.materialScanError !== null) {
    // The one line that makes "scan-failed" actionable: which reader was tried,
```

</details>

**依据 2 · 作者声明**：[README.md:1-19](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

```text
# AIR-pixel Liquid Glass

A configurable Liquid Glass theme plugin for DeepSeek Harness. It adds translucent interface surfaces, an optional wallpaper, desktop transparency, window blur, custom cursors, click ripples, and per-side conversation contrast controls.

## Screenshots

Full transparency: strength 2.0 (效果强度) with desktop transparency on (透出桌面), so the desktop reaches the eye unfiltered. The per-side conversation plates are what keep the body copy readable this far up the slider.

![Liquid Glass with desktop transparency](assets/preview-transparent.png)

The same screen with and without the theme:

![The stock shell beside Liquid Glass](assets/preview-vs-stock.png)

At the default strength, over the theme's own wallpaper — sidebar, pane, dialog, menu and floating panel:

![Frosted panels at the default strength](assets/preview-surfaces.png)

| Custom cursors | Click ripple |
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是视觉效果依赖宿主 DOM、CSS 层叠与桌面透明能力，源码和截图不能证明不同屏幕、主题与可访问性条件都成立。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:936-953](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/index.js#L936-L953)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * @param {object} ctx plugin context; needs the `webServer` service.
 */
export function apply(ctx) {
  const detail = detectWindowMaterialDetailed();
  ctx.logger?.info?.(`[liquid-glass] config file: ${CONFIG_FILE}`);
  // Logged eagerly even though the route would probe it lazily: ~80 ms once, and
  // "why does 透出桌面 do nothing" is otherwise a question with no visible
  // answer anywhere — the renderer cannot see this at all.
  ctx.logger?.info?.(
    `[liquid-glass] window material: ${detail.material}` +
      ` (${detail.materialWhy}` +
      (detail.materialPath === null ? '' : `, ${detail.materialPath}`) +
      (detail.materialScanVia === null ? '' : `, via ${detail.materialScanVia}`) +
      ')'
  );
  if (detail.materialScanError !== null) {
    // The one line that makes "scan-failed" actionable: which reader was tried,
```

</details>

#### 缺口

- 缺少针对“视觉效果依赖宿主 DOM、CSS 层叠与桌面透明能力，源码和截图不能证明不同屏幕、主题与可访问性条件都成立”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：在两种DSH版本、三种分辨率和深浅背景下跑关键页面截图/键盘流程，记录WCAG对比失败数、遮挡数、平均帧率和恢复默认残留；任何设置页不可达即停止。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：DSH Web客户端槽位与稳定DOM/CSS｜必需｜注入主题和设置入口｜宿主结构变化时应降级为未应用；webServer与配置存储目录｜必需｜读写主题设置和提供资源｜写入失败保留旧配置并提示；桌面透明/壁纸/自定义光标能力｜特定效果必需｜实现背景与交互装饰｜不支持时关闭单项而非破坏基础UI。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“用设置恢复默认并重启宿主｜无残留样式、配置或资源路由”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "air-pixel-liquid-glass",
  "version": "0.2.1",
  "description": "A configurable Liquid Glass theme for DeepSeek Harness with frosted surfaces, wallpaper, desktop transparency, custom cursors, and click ripples.",
  "type": "module",
  "main": "./index.js",
  "license": "MIT",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "client.js",
    "cordis.patch.yml",
    "index.js",
    "tools/asarpatch.py",
    "README.md",
    "DEVELOPMENT.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
```

</details>

**依据 2 · 源码核查**：[index.js:936-953](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/index.js#L936-L953)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * @param {object} ctx plugin context; needs the `webServer` service.
 */
export function apply(ctx) {
  const detail = detectWindowMaterialDetailed();
  ctx.logger?.info?.(`[liquid-glass] config file: ${CONFIG_FILE}`);
  // Logged eagerly even though the route would probe it lazily: ~80 ms once, and
  // "why does 透出桌面 do nothing" is otherwise a question with no visible
  // answer anywhere — the renderer cannot see this at all.
  ctx.logger?.info?.(
    `[liquid-glass] window material: ${detail.material}` +
      ` (${detail.materialWhy}` +
      (detail.materialPath === null ? '' : `, ${detail.materialPath}`) +
      (detail.materialScanVia === null ? '' : `, via ${detail.materialScanVia}`) +
      ')'
  );
  if (detail.materialScanError !== null) {
    // The one line that makes "scan-failed" actionable: which reader was tried,
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：在两种DSH版本、三种分辨率和深浅背景下跑关键页面截图/键盘流程，记录WCAG对比失败数、遮挡数、平均帧率和恢复默认残留；任何设置页不可达即停止。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“主题在目标宿主正确加载、关键文字可读、交互区域不被遮挡且可以安全恢复默认”为合格单位。三阶段投入为：首次使用｜壁纸资源、GPU合成与本地配置｜选择参数、做多窗口/分辨率截图检查｜调优分钟与GPU增量未知；持续使用｜透明/模糊/动画的GPU与电量｜遇到宿主升级时复查视觉层叠｜帧率、耗电和可访问性回归未知；失败恢复｜重载样式和恢复配置｜关闭主题、清缓存并核关键页面｜DOM遮挡时可能需手工编辑配置。当前源码只支持机制存在，效果维度为“视觉主题｜客户端样式和配置路由存在｜不同宿主/屏幕的一致性；交互装饰｜光标与点击涟漪可配置｜低性能设备帧率与误触影响；可恢复性｜有配置存储与加载路径｜宿主升级后能否一键回默认”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

```text
# AIR-pixel Liquid Glass

A configurable Liquid Glass theme plugin for DeepSeek Harness. It adds translucent interface surfaces, an optional wallpaper, desktop transparency, window blur, custom cursors, click ripples, and per-side conversation contrast controls.

## Screenshots

Full transparency: strength 2.0 (效果强度) with desktop transparency on (透出桌面), so the desktop reaches the eye unfiltered. The per-side conversation plates are what keep the body copy readable this far up the slider.

![Liquid Glass with desktop transparency](assets/preview-transparent.png)

The same screen with and without the theme:

![The stock shell beside Liquid Glass](assets/preview-vs-stock.png)

At the default strength, over the theme's own wallpaper — sidebar, pane, dialog, menu and floating panel:

![Frosted panels at the default strength](assets/preview-surfaces.png)

| Custom cursors | Click ripple |
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "air-pixel-liquid-glass",
  "version": "0.2.1",
  "description": "A configurable Liquid Glass theme for DeepSeek Harness with frosted surfaces, wallpaper, desktop transparency, custom cursors, and click ripples.",
  "type": "module",
  "main": "./index.js",
  "license": "MIT",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "client.js",
    "cordis.patch.yml",
    "index.js",
    "tools/asarpatch.py",
    "README.md",
    "DEVELOPMENT.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：在两种DSH版本、三种分辨率和深浅背景下跑关键页面截图/键盘流程，记录WCAG对比失败数、遮挡数、平均帧率和恢复默认残留；任何设置页不可达即停止。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 index.js 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“把完整视觉主题、配置持久化和宿主 UI 插槽封装成插件，降低重复手工改样式的负担”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“用设置恢复默认并重启宿主｜无残留样式、配置或资源路由”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:936-953](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/index.js#L936-L953)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * @param {object} ctx plugin context; needs the `webServer` service.
 */
export function apply(ctx) {
  const detail = detectWindowMaterialDetailed();
  ctx.logger?.info?.(`[liquid-glass] config file: ${CONFIG_FILE}`);
  // Logged eagerly even though the route would probe it lazily: ~80 ms once, and
  // "why does 透出桌面 do nothing" is otherwise a question with no visible
  // answer anywhere — the renderer cannot see this at all.
  ctx.logger?.info?.(
    `[liquid-glass] window material: ${detail.material}` +
      ` (${detail.materialWhy}` +
      (detail.materialPath === null ? '' : `, ${detail.materialPath}`) +
      (detail.materialScanVia === null ? '' : `, via ${detail.materialScanVia}`) +
      ')'
  );
  if (detail.materialScanError !== null) {
    // The one line that makes "scan-failed" actionable: which reader was tried,
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "air-pixel-liquid-glass",
  "version": "0.2.1",
  "description": "A configurable Liquid Glass theme for DeepSeek Harness with frosted surfaces, wallpaper, desktop transparency, custom cursors, and click ripples.",
  "type": "module",
  "main": "./index.js",
  "license": "MIT",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "client.js",
    "cordis.patch.yml",
    "index.js",
    "tools/asarpatch.py",
    "README.md",
    "DEVELOPMENT.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：在两种DSH版本、三种分辨率和深浅背景下跑关键页面截图/键盘流程，记录WCAG对比失败数、遮挡数、平均帧率和恢复默认残留；任何设置页不可达即停止。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“把完整视觉主题、配置持久化和宿主 UI 插槽封装成插件，降低重复手工改样式的负担”和“视觉效果依赖宿主 DOM、CSS 层叠与桌面透明能力，源码和截图不能证明不同屏幕、主题与可访问性条件都成立”推导的新方向是可把关键表面与对比度探针纳入主题配置预览，在应用前给出宿主版本和可访问性回归报告。它不是当前能力。最小验证为在两种DSH版本、三种分辨率和深浅背景下跑关键页面截图/键盘流程，记录WCAG对比失败数、遮挡数、平均帧率和恢复默认残留；任何设置页不可达即停止。 若合格结果不改善、误差/副作用越界或恢复负担高于“手工注入 CSS、浏览器用户样式或直接修改宿主前端资源”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:936-953](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/index.js#L936-L953)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * @param {object} ctx plugin context; needs the `webServer` service.
 */
export function apply(ctx) {
  const detail = detectWindowMaterialDetailed();
  ctx.logger?.info?.(`[liquid-glass] config file: ${CONFIG_FILE}`);
  // Logged eagerly even though the route would probe it lazily: ~80 ms once, and
  // "why does 透出桌面 do nothing" is otherwise a question with no visible
  // answer anywhere — the renderer cannot see this at all.
  ctx.logger?.info?.(
    `[liquid-glass] window material: ${detail.material}` +
      ` (${detail.materialWhy}` +
      (detail.materialPath === null ? '' : `, ${detail.materialPath}`) +
      (detail.materialScanVia === null ? '' : `, via ${detail.materialScanVia}`) +
      ')'
  );
  if (detail.materialScanError !== null) {
    // The one line that makes "scan-failed" actionable: which reader was tried,
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：在两种DSH版本、三种分辨率和深浅背景下跑关键页面截图/键盘流程，记录WCAG对比失败数、遮挡数、平均帧率和恢复默认残留；任何设置页不可达即停止。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为小范围试用。重视界面个性化者可在非关键工作区试用，先验证目标宿主版本、文字对比、性能与一键恢复。 试用成功标准是“主题在目标宿主正确加载、关键文字可读、交互区域不被遮挡且可以安全恢复默认”，并且 不同宿主/屏幕的一致性、低性能设备帧率与误触影响、宿主升级后能否一键回默认 有可接受结果；停止标准包括发生视觉效果依赖宿主 DOM、CSS 层叠与桌面透明能力，源码和截图不能证明不同屏幕、主题与可访问性条件都成立所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“手工注入 CSS、浏览器用户样式或直接修改宿主前端资源”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

```text
# AIR-pixel Liquid Glass

A configurable Liquid Glass theme plugin for DeepSeek Harness. It adds translucent interface surfaces, an optional wallpaper, desktop transparency, window blur, custom cursors, click ripples, and per-side conversation contrast controls.

## Screenshots

Full transparency: strength 2.0 (效果强度) with desktop transparency on (透出桌面), so the desktop reaches the eye unfiltered. The per-side conversation plates are what keep the body copy readable this far up the slider.

![Liquid Glass with desktop transparency](assets/preview-transparent.png)

The same screen with and without the theme:

![The stock shell beside Liquid Glass](assets/preview-vs-stock.png)

At the default strength, over the theme's own wallpaper — sidebar, pane, dialog, menu and floating panel:

![Frosted panels at the default strength](assets/preview-surfaces.png)

| Custom cursors | Click ripple |
```

</details>

**依据 2 · 源码核查**：[index.js:936-953](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/c0e2fbff0cbfeb5416e6d3542e5863ccb7360cbc/index.js#L936-L953)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * @param {object} ctx plugin context; needs the `webServer` service.
 */
export function apply(ctx) {
  const detail = detectWindowMaterialDetailed();
  ctx.logger?.info?.(`[liquid-glass] config file: ${CONFIG_FILE}`);
  // Logged eagerly even though the route would probe it lazily: ~80 ms once, and
  // "why does 透出桌面 do nothing" is otherwise a question with no visible
  // answer anywhere — the renderer cannot see this at all.
  ctx.logger?.info?.(
    `[liquid-glass] window material: ${detail.material}` +
      ` (${detail.materialWhy}` +
      (detail.materialPath === null ? '' : `, ${detail.materialPath}`) +
      (detail.materialScanVia === null ? '' : `, via ${detail.materialScanVia}`) +
      ')'
  );
  if (detail.materialScanError !== null) {
    // The one line that makes "scan-failed" actionable: which reader was tried,
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：在两种DSH版本、三种分辨率和深浅背景下跑关键页面截图/键盘流程，记录WCAG对比失败数、遮挡数、平均帧率和恢复默认残留；任何设置页不可达即停止。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
