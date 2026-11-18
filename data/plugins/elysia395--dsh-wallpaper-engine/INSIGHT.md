# DSH Wallpaper Engine

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b8d5c3a](https://github.com/elysia395/dsh-wallpaper-engine/tree/b8d5c3a10956d4c7a86748a77a5d64292a6820f2)

<!-- BEGIN META -->
[![GitHub ★ 7,355](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C355&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/elysia395/dsh-wallpaper-engine) [![npm 30d 155,386](https://img.shields.io/static/v1?label=npm+30d&message=155%2C386&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-wallpaper-engine) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-wallpaper-engine)
<!-- END META -->

> **功能**：在 DSH 对话页显示本地 Wallpaper Engine 场景、网页和视频壁纸，并提供外观预设、字体和玻璃效果。

> **亮点**：[Q01](#research-q01) 的多级素材准备能在同一 DSH 背景里复用 Scene、Web 和视频。[Q03](#research-q03) 的启动暂停与软渲染末帧为用户保留选择、限制持续重绘提供了两个控制点。[Q04](#research-q04) 将界面帧率与壁纸帧率并列，帮助追查掉帧落在哪条链路。

> **主要限制**：[Q03](#research-q03) 的软渲染保护依赖父页面探测且要等首帧，首帧前的卡顿仍需验证。Web 素材的脚本仍可执行，试用时应核对来源和网络请求。[Q04](#research-q04) 的进程 CPU 读数未覆盖浏览器和 GPU。

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
  - [Q01 · 用户能把哪些已有素材变成对话背景，失败时会看到什么？](#detail-section-11)
  - [Q02 · 主插件与子包怎样挂载，关掉玻璃或停用时还能保留什么？](#detail-section-12)
  - [Q03 · 启动暂停、自动画质和软渲染暂停能保护哪些资源边界？](#detail-section-13)
  - [Q04 · 内置性能模块能证明什么，怎样才能辨别整页变慢与壁纸慢？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有可信本地壁纸素材、想在 DSH Web 对话时显示个性化背景的用户，可从同一设置页选择、暂停和切换素材。

固定图片主题只需要宿主样式。Wallpaper Engine 桌面程序可保留本机动态背景，但与 DSH 对话内容分离。保留后者作为第三方项目的原生显示参照，比较的是环境内复用及交互代价。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 壁纸选择与准备 | 在对话背景复用已有图像、视频、Scene 或 Web 素材 | 可能降级到静态预览或跳过 |
| 启动暂停 | 保留所选壁纸，并在打开页面时暂停动态播放 | 设置加载后生效，仍可手动恢复 |
| 软渲染暂停 | 识别软件渲染并保留末帧 | 首帧完成后才触发，探测也可能失效 |
| 性能监控 | 显示壁纸及界面帧率、DSH 进程 CPU | 区分读数口径，浏览器和 GPU 需外测 |
| 玻璃外观与预设 | 设置聊天表面装饰，恢复隐藏的出厂预设 | 玻璃子包和宿主版本须匹配 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 服务及客户端；清单声明 DSH ^0.2.0-rc.1、Node >=22.12.0 | 必需 | 绑定 Cordis、HTTP 路由及浏览器入口 | 无注册接口时不绑定路由，版本边界未实测 |
| 带实际子包的主包依赖树及 profile | 必需 | 解析 Cordis 补丁里声明的子包名 | 主包解析检查可能中止启动 |
| 可信的本地 Web 壁纸素材或可用视频／图像 | 按选用内容 | 提供可显示背景 | 材料缺失或脚本不兼容时尝试回退或跳过 |
| 可用浏览器 WebGL 与驱动 | 实时场景按需 | 将场景绘制成实时背景 | 可能显示静帧、视频或在首次成功后暂停 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份现有主题并选择独立 Web profile | 确认读取所需子包和一项可信素材 |
| 恢复 | 浏览器取宿主设置并恢复库存及选中壁纸 | 启用启动暂停时先设置瞬态，再建立背景 |
| 试用 | 用户播放并观察聊天、画面及性能读数 | 一直降级或妨碍输入时切回静态 |
| 退出 | 用户关闭玻璃行或主插件并重新打开界面 | 核对目标样式、预设和渲染确已退出 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 素材授权、机器条件及首次扫描资源未知 | 备份主题和 profile，核对来源与子包解析 | Steam 库或已有图片／视频可作为输入 |
| 持续 | 实时渲染、解码、轮询及缓存占用未知 | 调整画质、暂停或回退并核对输入响应 | 软渲染保留末帧要等首帧，宿主 CPU 不含 GPU |
| 退出 | 缓存和媒体文件占用随素材变化，实值未知 | 逐项关玻璃效果或停用插件，重新加载后确认 | 子包卸载及实际清理需用当前宿主检验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 背景准备 | 各素材分类走不同分支，Scene 可尝试视频和静态回退 | 实际素材覆盖、首帧成功率 |
| 保护和退出 | 启动暂停、软渲染末帧和玻璃样式清理有源码接线 | 实际设备是否误判、整个卸载是否留活动 |
| 性能诊断 | 界面帧率、壁纸帧率和 DSH 进程 CPU 使用不同数据源 | 达到同水平输入响应的成本、监控自身开销 |

> **思考**：[Q03](#research-q03) 的软渲染保护依赖父页面探测且要等首帧，首帧前的卡顿仍需验证。Web 素材的脚本仍可执行，试用时应核对来源和网络请求。[Q04](#research-q04) 的进程 CPU 读数未覆盖浏览器和 GPU。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的多级素材准备能在同一 DSH 背景里复用 Scene、Web 和视频。[Q03](#research-q03) 的启动暂停与软渲染末帧为用户保留选择、限制持续重绘提供了两个控制点。[Q04](#research-q04) 将界面帧率与壁纸帧率并列，帮助追查掉帧落在哪条链路。

[Q02](#research-q02) 的双环境解析检查使缺失子包能在宿主装载期显露。[Q04](#research-q04) 的性能订阅共享采样并在退订时停止。页面诊断只反映选中的可观测数据，实际重载清理由宿主和各子包共同完成。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的软渲染保护依赖父页面探测且要等首帧，首帧前的卡顿仍需验证。Web 素材的脚本仍可执行，试用时应核对来源和网络请求。[Q04](#research-q04) 的进程 CPU 读数未覆盖浏览器和 GPU。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 可在临时 DSH Web 配置中启用启动暂停，先试已有可信图片或短视频。[Q04](#research-q04) 用同一段打字及滚动任务判断输入响应；若画面频繁降级或输入变慢，停用后回到原主题。使用 Web 项目之前先核脚本与网络来源。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持壁纸分流、两个暂停控制点、分包退出和性能采样机制。具体素材兼容、交互延迟与实际资源节省仍待验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/media-prep/prepare.js、src/layer-core.js、src/video-layer.js、package.json、cordis.patch.yml、lib/index.js、packages/glass/src/client.js、lib/glass-presets-store.js、src/client.js、src/live-layer/probe.js、src/live-layer/watch.js、src/live-layer.js、src/persistence.js、src/media-prep.js、src/ext-perf.js、lib/routes/diag.js、lib/perf-metrics.js、scripts/build-client.mjs、packages/glass/src/glass-css.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮读根包及被其挂载的子包关键接线、选择与降级、设置恢复、性能采样、Web 备用沙箱及代表性清理分支。未审计所有壁纸格式和所有网络路由，未执行安装、构建、目标代码、测试或宿主验证。
- 下一步：按 [Q04](#research-q04) 在同设备固定素材和任务回放，对照静态、实时与软渲染暂停三组的首屏、输入延迟、渲染进程指标及退出动作。

**分析版本**

- **仓库**：[elysia395/dsh-wallpaper-engine](https://github.com/elysia395/dsh-wallpaper-engine)
- **版本号**：1.4.2（[固定提交 b8d5c3a](https://github.com/elysia395/dsh-wallpaper-engine/tree/b8d5c3a10956d4c7a86748a77a5d64292a6820f2)）
- **版本日期**：2026-11-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出将界面帧率、壁纸帧率与输入延迟并读，以辨别低画质是否足以恢复对话交互。若同一素材的硬件与软件渲染无法从读数和任务结果区分，这一诊断方法需要外部指标补足。

按 [Q04](#research-q04) 在同设备固定素材和任务回放，对照静态、实时与软渲染暂停三组的首屏、输入延迟、渲染进程指标及退出动作。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 75 | 19388 | — | — | 541895 |
| .cjs | source | 2 | 368 | 337 | 14 | — |
| .mjs | source | 12 | 3113 | 1838 | 1151 | — |
| .js | source | 211 | 65343 | 40404 | 23890 | — |
| .mjs | test | 175 | 89364 | 64983 | 21369 | — |

</details>

**活跃度**

[![Issue 未关闭 18](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=18&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 65](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=65&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 72](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=72&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH Web 用户何时能把已有 Wallpaper Engine 素材作为可控背景使用，此版的启动暂停、性能观察和预设恢复如何改变试用边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户能把哪些已有素材变成对话背景，失败时会看到什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

已有可信本地素材的 DSH Web 用户可从对话界面内选择壁纸。相对原生主题的固定背景和另开的 Wallpaper Engine 桌面，插件改变的是对话页内背景素材的复用与播放。作者文档列出 Scene、Web、视频、幻灯片和图片／视频上传，并把需启动可执行程序的 Application 类型排除。

进入过场准备时，Scene 先走实时入口；探测失败时尝试场景内嵌视频，视频不可用再走静帧与预览，仍没有可用画面才跳过。Web 先尝试实时包装页，失败后交给另一个 iframe 探测。单靠缩略图仍无法判断动态分支能否成功。《轮播》中的随机选项在实际换层时才选择具体过场和方向，候选排除了直接切换和随机自身；界面查询配置时只计算最大过场时长。新版另外拦截视频元素的原生右键菜单。这些改动改善背景交互，未改变用户能导入的主要素材类型。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-84](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/README.md#L65-L84)

作者列出素材类型、外观与轮播能力及 Application 排除条件。

<details>
<summary>查看原文（20行）</summary>

```text

<h2 id="主要能力"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/section-features-dark.png"><img src="assets/readme/section-features-light.png" alt="能做什么" width="1440"></picture></h2>

- **壁纸**：Scene / Web 实时渲染，Video 直接播放；支持自定义图片 / 视频上传与 WE 项目目录。
- **外观**：设置窗、对话区与侧栏液态玻璃；配色、透明度、模糊、边框与字体可调。
- **玻璃子包**：液态玻璃是独立子包行 `wallpaper-engine-glass`，可在插件管理器单独停用；停用后，除内容区壁纸外界面回到宿中原生外观，壁纸、字体与吉祥物等功能不受影响。
- **扩展**：吉祥物、会话头像、点击 / 拖尾特效、3D 视差；可选桌宠联动 [dsh-pet-dshwe](https://github.com/Fish-under-sea/dsh-pet-dshwe)（dsh-pet 全量 fork），设置页卡片可一键安装，未装 / 关闭 / 版本过旧时回落原生吉祥物。
- **壁纸库**：筛选、隐藏 / 恢复、自动轮播；外观预设整套导入导出。

<h2 id="支持哪些壁纸"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/section-formats-dark.png"><img src="assets/readme/section-formats-light.png" alt="支持哪些壁纸类型" width="1440"></picture></h2>

| 类型 | 在 DSH 中的路径 | 支持情况 |
|---|---|---|
| **Scene（场景）** | 内置 WebWallGL 实时渲染，失败时按降级链回退 | 支持，不需要 WE 在后台运行 |
| **Web（网页）** | 网页挂载、WE API 注入与沙箱隔离 | 支持；效果取决于网页与浏览器能力 |
| **Video（视频）** | 浏览器播放，配合转码、帧率上限与暂停控制 | 支持 |
| **Picture（图片 / 幻灯片项目）** | 读取 WE `preset` 项目的图片目录，按 WE 里设的周期在本机交叉淡化轮播 | 支持；图片不上传、留在本机 |
| **自定义图片 / 视频** | 上传本地 JPG / PNG / MP4 | 支持，文件保存在本机 |

Application（应用）类壁纸需要启动第三方程序，**不支持**，也不会进入壁纸库或轮播候选。
```

</details>

**依据 2 · 源码核查**：[src/media-prep/prepare.js:86-118](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/media-prep/prepare.js#L86-L118)

Scene 准备链在实时、内嵌视频及静态结果之间依次降级。

<details>
<summary>查看原文（33行）</summary>

```text
  if (w.type === "scene") {
    // 优先级不变量（与 buildMedia 一致）：live > sceneVideo > 静态帧。
    // live 探测失败回退 sceneVideo（host 对每个 scene 都 mint
    // sceneVideo URL，是否有内嵌视频只有请求后才知道），404/解码失败再降
    // 出图来源；那一帧拿不到 → preview → onFail 跳过。
    const liveSel = {
      type: "scene", id: w.id,
      sceneLiveSrc: w.sceneLiveSrc || null,
      objectFit: selection.objectFit,
      sceneLiveFps: selection.sceneLiveFps,
      sceneLive: selection.sceneLive,
      sceneLiveFailures: selection.sceneLiveFailures, sceneAutoQuality: selection.sceneAutoQuality,
    };
    if (liveRenderEnabled(liveSel) && !prepareLiveExhausted(w.id)) {
      prepareSceneLiveStage(w, prep, onReady, () => {
        if (w.sceneVideo) {
          prep.kind = "sceneVideo";
          prepareVideoProbe(w.sceneVideo, w.frameUrl || w.preview, prep, onReady,
            () => prepareSceneStaticStage(w, prep, onReady, onFail));
          return;
        }
        prepareSceneStaticStage(w, prep, onReady, onFail);
      });
      return;
    }
    if (w.sceneVideo) {
      prep.kind = "sceneVideo";
      prepareVideoProbe(w.sceneVideo, w.frameUrl || w.preview, prep, onReady,
        () => prepareSceneStaticStage(w, prep, onReady, onFail));
      return;
    }
    prepareSceneStaticStage(w, prep, onReady, onFail);
    return;
```

</details>

**依据 3 · 源码核查**：[src/media-prep/prepare.js:120-135](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/media-prep/prepare.js#L120-L135)

Web 实时探测失败会回到普通 iframe 探测。

<details>
<summary>查看原文（16行）</summary>

```text
  // web (iframe)：live 渲染页探测优先（webLiveSrc），失败回退旧链裸 iframe
  // load 探测（慢页超时兜底提交）。
  const webLiveSel = {
    type: "web", id: w.id,
    webLiveSrc: w.webLiveSrc || null,
    objectFit: selection.objectFit,
    sceneLiveFps: selection.sceneLiveFps,
    sceneLive: selection.sceneLive,
    sceneLiveFailures: selection.sceneLiveFailures, sceneAutoQuality: selection.sceneAutoQuality,
  };
  if (liveRenderEnabled(webLiveSel) && !prepareLiveExhausted(w.id)) {
    prepareSceneLiveStage(w, prep, onReady, () => prepareWebProbe(w, prep, onReady));
    return;
  }
  prep.kind = "web";
  prepareWebProbe(w, prep, onReady);
```

</details>

**依据 4 · 源码核查**：[src/layer-core.js:154-173](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/layer-core.js#L154-L173)

换层时抽取具体过场及方向，配置预览保留随机语义。

<details>
<summary>查看原文（20行）</summary>

```text
  // #254：draw === true 是**真正换层**那一跳 —— 'random' 在这里才抽成具体值；面板侧
  // 不抽（否则每次 emit 都变），返回代表值：方向行照常显示、时长取池内最长。
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const want = selLike && SWITCH_TRANSITION_VALUES.includes(selLike.switchTransition)
    ? selLike.switchTransition : DEFAULTS.switchTransition;
  const pool = SWITCH_TRANSITIONS.filter((t) => t.id !== "cut" && t.id !== "random");
  const drawn = draw === true && want === "random" ? pick(pool) : null;
  const id = drawn ? drawn.id : want;
  const def = drawn || SWITCH_TRANSITIONS.find((t) => t.id === id) || SWITCH_TRANSITIONS[0];
  const speed = SWITCH_SPEEDS.find((s) => s.id === (selLike && selLike.switchTransitionSpeed))
    || SWITCH_SPEEDS[1];
  const dirWant = selLike && SWITCH_DIRS.includes(selLike.switchTransitionDir)
    ? selLike.switchTransitionDir : DEFAULTS.switchTransitionDir;
  const dir = draw === true && dirWant === "random" ? pick(SWITCH_DIRS.filter((d) => d !== "random")) : dirWant;
  const msOf = (t) => (t.ms > 0 ? Math.max(60, Math.round(t.ms * speed.factor)) : 0);
  return {
    id,
    dir,
    directional: id === "random" ? true : SWITCH_DIRECTIONAL.includes(id),
    ms: id === "random" ? Math.max(...pool.map(msOf)) : msOf(def),
```

</details>

**依据 5 · 源码核查**：[src/video-layer.js:215-226](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/video-layer.js#L215-L226)

视频背景绑定 contextmenu 处理。

<details>
<summary>查看原文（12行）</summary>

```text
// 所以用元素上的标记保证只挂一次监听（重复 addEventListener 会让同一个事件跑 N 次）。
function suppressVideoContextMenu(media) {
  if (!media || media.__weNoContextMenu) return media;
  media.__weNoContextMenu = true;
  try {
    media.addEventListener("contextmenu", (e) => {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
    });
  } catch { /* 守卫沙箱里 EventTarget 可能被裁掉：不影响媒体构建 */ }
  return media;
}
function buildVideoMedia(sel, fitClass) {
```

</details>

#### 缺口

- 真实素材覆盖未测
  **影响**：需要滤镜、音频或专用效果的项目可能只有预览可用
  **进一步探讨**：至少各选一个代表性 Scene、Web 和视频素材，区分首屏、持续播放和降级。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 主插件与子包怎样挂载，关掉玻璃或停用时还能保留什么？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

根 manifest 将宿主入口和 Web 客户端分开导出，Cordis 补丁给上游 Web 配置插入主行与各子包。宿主 apply 需要 webServer 的注册方法，给依赖方发布 wallpaperEngineHost，并按补丁中的子包名分别在主包与宿主解析环境检查。配置不完整时可定位包解析问题，浏览器的 lib/client.js 则由构建器根据源码生成。子包路由与浏览器表现分开接线。

玻璃子包关闭时从 DOM 撤回玻璃 CSS，执行行为与表面清理；这为用户保留壁纸而关掉界面装饰提供了分离路径。新版玻璃的计划卡、文件卡及预览规则主要调整这些元素的落点，仍要验证宿主对应界面变更时选择器是否命中。预设的出厂项和用户项采用不同的删除语义：用户预设有独立数量上限，隐藏出厂项会写入标记并可删除该标记恢复；因而调整列表时可以恢复系统预设。停用宿主插件时浏览器的 iframe 清理包含显式导航到 about:blank，静态代码支持撤出路径，仍需检查实际重载和本机缓存。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:29-39](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/package.json#L29-L39)

两套导出分别指向服务器和浏览器产物。

<details>
<summary>查看原文（11行）</summary>

```text
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client.d.ts",
      "default": "./lib/client.js"
    },
    "./subpackage-boot.js": "./lib/subpackage-boot.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
```

</details>

**依据 2 · 源码核查**：[package.json:149-163](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/package.json#L149-L163)

Web 客户端运行时声明和构建命令。

<details>
<summary>查看原文（15行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime"
      ],
      "platform": "web",
      "immediately": true
    }
  },
  "license": "MIT",
  "scripts": {
    "build": "node scripts/build-client.mjs",
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:21-39](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/cordis.patch.yml#L21-L39)

主行与独立子行注入。

<details>
<summary>查看原文（19行）</summary>

```text
- insert:
    # Host half: discovers the local Wallpaper Engine install (Steam app 431960),
    # enumerates Scene/Video/Web wallpapers from the Workshop + default projects
    # (Application wallpapers are listed but never rendered),
    # and serves their media + a JSON inventory over same-origin HTTP routes
    # the browser half fetches directly (GET /wallpaper-engine/inventory, /media,
    # /preview, …; docs/ROUTE-INDEX.md is the authoritative table — it is generated
    # and machine-checked, so the route count is deliberately not repeated here).
    - id: wallpaper-engine
      name: 'dsh-plugin-wallpaper-engine'
    # Second row: the `about-notice` component's host half (C8′, P2-1). The host
    # loads it as its own plugin — its entry re-enters this bundle's
    # `applyComponent` — so disabling just this row removes the About tab's
    # /star-count + /about-qr routes and leaves the other 40 untouched.
    # P-F (2026-10-16): this component moved out to `packages/about-notice/`, so the
    # row `name` is now the real package name (resolved through <profile>/node_modules,
    # same as the fx / parallax / fonts rows below). The `id` is frozen.
    - id: wallpaper-engine-about-notice
      name: 'dsh-plugin-wallpaper-engine-about-notice'
```

</details>

**依据 4 · 源码核查**：[lib/index.js:175-220](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/lib/index.js#L175-L220)

检查宿主 Web 服务并发布依赖面，同时核验子包解析。

<details>
<summary>查看原文（46行）</summary>

```text
export const inject = ['webServer'];

export function apply(ctx) {
  // issue #267：注册面容错（只吞本插件命名空间内的"重复路由" = 1.3.3 残留；其余错误照抛）。
  // JSDoc 与边界见 lib/host-boot.js 的 tolerantWebServer。告警用惰性闭包：log 在本次 apply
  // 稍后由 createHostSession 产出，而回调只在注册期（log 已就绪）才可能被调用。
  const webServer = tolerantWebServer(ctx.webServer, (route, err) => {
    try {
      log('skip stale route ' + String(route && route.path) + ': ' + String((err && err.message) || err), 'warn');
    } catch { /* ignore */ }
  });
  if (!webServer || typeof webServer.register !== 'function') {
    return () => {}; // defensive: never expected in practice
  }

  // 0a. 跨包服务面（ADR-0014 S5.1 / S5.4，P-A 的 B 方案）─────────────────────────
  // 子包宿主半边 `export const inject = ['wallpaperEngineHost']`，靠这一个服务拿到
  // 冻结键集 / 拆卸交接 / 纯符号面；`provide` 由 cordis 记在**主包自己的 fiber** 上，
  // 主包一卸服务即撤销 ⇒ 子包 fiber 随之 park（D-13 B「关主包 = 关整族」的物理基础）。
  // 判据：test/verify-subpackage-purity.mjs（子包半边零主包说明符 + inject 名逐字对账）。
  // S5c 刀2（R-1）：服务值现在带第七键 `apply`（9 族路由的 per-apply 实例/引用面）。它必须是
  // **惰性**访问器 —— 本行在 `createHostSession()` 之前执行，`applyView` 此刻还不存在；读取发生
  // 在子包 apply / 组件行装载时（都晚于本函数返回）。判据 test/verify-token-domain.mjs（token
  // 铸造点与消费点必须同一份 `mediaMap`/`serveFile`）。
  let applyView = null;
  provideSubpackageHost(ctx, { applyView: () => applyView });

  // 0b. 子包启动自检（P-A 的子包装载序）──────────────────────────────────────────
  // 为什么要有这一段：宿主对**行级**失败是静默的（§4.1 I5 —— Loader 只把那一行记成
  // failed，主包照常起来），而"子包行解析不到"的后果恰好是浏览器半边**静默消失**：
  // 用户的界面少一块，终端里却没有指向原因的报错。所以这里按 patch 里**净新增的子包行**
  // 自己 resolve 一遍，解析不到就抛（大声失败），错误消息带包名与行 id。
  // **两条腿缺一不可**（真机事故：三条组件行 `failed to import`，主包却报通过）：
  //   ① 仓库腿 —— 解析根 = 本仓 `node_modules`（开发期 `file:` 自链、发布期主包自己的依赖树），
  //      发现的是"patch 行与主包 manifest 脱节"；
  //   ② 宿主腿 —— 解析根 = **每个会装载本主包的 profile** 的 `cordis.yml` 旁（§8.1 spike：
  //      本版 `boot()` 只传 4 实参 ⇒ `bareModuleBaseUrl` 恒 undefined ⇒ 宿主恒按裸包名从
  //      profile 根解析行名），发现的是①结构性看不见的"仓库里在、profile 侧缺链接"。
  // 判据：test/verify-subpackage-boot.mjs（硬档；它同时钉住"静默实现必须判红"与两条腿的顺序）。
  const rootManifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const subpackageRowList = subpackageRows(
    readFileSync(new URL('../cordis.patch.yml', import.meta.url), 'utf8'), rootManifest.name);
  assertSubpackagesResolvable(subpackageRowList, (name) => {
    try { return createRequire(import.meta.url).resolve(name); } catch { return null; }
  });
  assertSubpackagesResolvableInHost(subpackageRowList, { mainName: rootManifest.name });
```

</details>

**依据 5 · 源码核查**：[packages/glass/src/client.js:304-333](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/packages/glass/src/client.js#L304-L333)

关闭玻璃时执行样式与表面行为层清理。

<details>
<summary>查看原文（30行）</summary>

```text
  }
  // ⚠️ 不要提前写状态：一旦 apply/dispose 中途抛错（宿主右栏正在重排、表面管理器
  // 拿不到几何等），下面的 catch 会把错误吞掉；提前写状态会让后续 3s 探测直接
  // early-return、永不重试 —— 表现就是“开关后右栏一层坏滤镜，刷新才恢复”。
  // 成功走完再提交状态，失败保持原状态，下一轮探测会重新执行整段。
  try {
    if (disabled) {
      // 撤样式表 + 跑行为层的 dispose（门控属性 / --we-* 变量 / 额外补雾化标签成对收走）
      // ⇒ 宿主立即回到原生外观；sync 在停用期间是空操作，不会再写任何东西。
      glassRightNudgePending = false;
      stopPendingRightNudgeWatch();
      const tag = document.querySelector('style[data-plugin-css="dsh-wallpaper-engine/glass"]');
      glassSurfaceResyncToken += 1;
      if (tag) tag.remove();
      disposeGlassLayer();
      try { if (typeof disposeGlassSurfaces === 'function') disposeGlassSurfaces(); } catch { /* 已由 disposeGlassLayer 兜底 */ }
      nudgeGlassPlateLayers();
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => {
        if (glassRowDisabled) nudgeGlassPlateLayers();
      });
    } else {
      // 行开关不重载页面：启用前强制丢弃上一轮表面状态（可能残留旧装饰根/标记，
      // 或右栏是在停用期间才挂载的），再从干净状态重建一次。
      try { if (typeof disposeGlassSurfaces === 'function') disposeGlassSurfaces(); } catch { /* ignore */ }
      ensureGlassCss();
      applyGlassLayer();
      glassRightNudgePending = true;
      nudgeGlassPlateLayers();
      nudgePendingRightPanel();
      watchPendingRightPanel();
```

</details>

**依据 6 · 源码核查**：[lib/glass-presets-store.js:189-208](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/lib/glass-presets-store.js#L189-L208)

用户预设数量、出厂项隐藏列表分别计算。

<details>
<summary>查看原文（20行）</summary>

```text
export function countUserPresets(c) {
  const tomb = tombstonedIds(c);
  let n = 0;
  for (const id of listPresetIds(userDir(c))) {
    if (!tomb.has(id)) n++;
  }
  return n;
}

/** 被隐藏（墓碑遮蔽）的出厂预设清单 —— 面板「已隐藏」区与恢复动作的数据源。 */
export function listHiddenBuiltin(c) {
  const tomb = tombstonedIds(c);
  const rows = [];
  for (const id of listPresetIds(builtinDir(c))) {
    if (!tomb.has(id)) continue;
    const read = readPresetAt(builtinDir(c), id);
    rows.push(read.ok
      ? { id, name: read.doc.name, origin: 'builtin' }
      : { id, name: id, origin: 'builtin', broken: read.reason });
  }
```

</details>

**依据 7 · 源码核查**：[lib/glass-presets-store.js:428-451](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/lib/glass-presets-store.js#L428-L451)

持久化隐藏标记，恢复时清除该标记。

<details>
<summary>查看原文（24行）</summary>

```text
export async function writeTombstone(c, id) {
  const dir = userDir(c);
  c.ensureDirOnce(dir);
  const doc = { $schema: GLASS_PRESET_TOMBSTONE_TAG, id };
  await c.atomicWriteFileP(presetPath(dir, id), JSON.stringify(doc, null, 2) + '\n');
  return doc;
}

/**
 * 恢复一套被隐藏的出厂预设（#219）：只认「随包层有 + 用户层是墓碑」这一种形态 ——
 * 删掉用户层墓碑文件，随包层那套就会重新出现在清单里（随包文件从不被写）。
 * 其它形态一律 `false`：用户层是正常预设（不是隐藏，无需恢复）、随包层没有这个 id（未知预设）、
 * 或用户层根本没有文件（本来就是可见的）。恢复不动当前外观，也不恢复任何"应用历史"。
 * @returns 是否真的恢复了一份
 */
export function restorePreset(c, id) {
  if (!isGlassPresetId(id)) return false;
  if (readPresetAt(userDir(c), id).reason !== 'deleted') return false;
  if (!readPresetAt(builtinDir(c), id).ok) return false;
  try { unlinkSync(presetPath(userDir(c), id)); } catch { return false; }
  return true;
}

/** 取一个未被占用的 id：客户端给的就用它，真撞了顺延 `-2`、`-3` …（不给用户看细节）。 */
```

</details>

**依据 8 · 源码核查**：[src/layer-core.js:182-194](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/layer-core.js#L182-L194)

媒体层清理显式重置 iframe。

<details>
<summary>查看原文（13行）</summary>

```text
  // live / web 层的 <iframe> 才是大头：Chromium 实测：「从 DOM 摘除的 iframe 其 JS
  // 世界仍在跑」（contentWindow 已 null 而 setInterval 照跳）—— 只 remove() 等于把它
  // 交给 GC，回收时序不可控，每个渐变周期都可能多留一个活着的渲染页。
  // 显式导航到 about:blank 终止它（与 disposeMediaEl 的 iframe 分支同一手法）。
  if (typeof node.querySelectorAll !== "function") return; // 精简 mock：无选择器即跳过
  for (const f of node.querySelectorAll("iframe")) {
    try { f.src = "about:blank"; } catch { /* ignore */ }
  }
}
function openRotationAudioGate(node, outgoing) {
  if (!node) return;
  rotationAudioGate = { node, outgoing: outgoing || null, released: false };
  muteNodeAudio(node);
```

</details>

#### 缺口

- 发布构建和真实 profile 未核对
  **影响**：源码存在构建与停用路径，但实际宿主解析和撤出仍依赖当前 Web 配置
  **进一步探讨**：在隔离 profile 核查主行、玻璃单行、主包停用及重新启动四种状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动暂停、自动画质和软渲染暂停能保护哪些资源边界？

**研究主题**：缺陷与关键质疑、效果与总成本、工程质量与复用

#### 完整回答

启动暂停先等待宿主设置应用，然后在恢复库存及选择前关闭 playing 与 videoPlaying 两个瞬态。原壁纸选择仍可恢复，用户当次可手动播放。WebGL 软渲染保护走另一条路径，监看器看到首帧后探测父页面渲染器，让渲染页暂停并留住最后一帧，随后将缺帧视为预期状态。渲染器检测用有限的字符串匹配，扩展不可用会读普通参数，异常回到默认，首帧无法完成时保护尚未触发。该保护是止损手段，不能证明渲染前的峰值已经消除。

关闭自动画质把 autoq=0 发给渲染页，过场准备也转交 sceneAutoQuality，从而能给画质对照固定一个变量。宿主设置加载仍以文件为主，但客户端合并时保留内存中已有的设备专用抽帧及自定义画面设置，避免主机快照的默认值覆盖本机。Web 素材回退 iframe 给 allow-scripts 并保留不透明来源，限制它借宿主来源调用同源 API；脚本本身仍可执行，外部请求、CPU 占用和可信度需分开判断。若要试用，优先静态图或小视频，Web 项目应先核脚本和网络来源。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:6221-6249](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/client.js#L6221-L6249)

宿主设置应用之后、库存之前设置启动暂停，位于首帧前的恢复链。

<details>
<summary>查看原文（29行）</summary>

```text
  // 启动时暂停（#349）：宿主设置落地后（`loadPersisted` 末尾置 `hostLoaded`）统一在这里
  // 把播放意图置为暂停。位置在库存恢复**之前**（`loadInventory → revalidateSelection →
  // applySelection`），于是壁纸以暂停态挂载，而不是"先自动播放、随后才被暂停"（会闪一帧）。
  // 两个瞬态都置位：`playing` 是用户意图（面板按钮/出图闸门读它），`videoPlaying` 是元素
  // 真实态，启动时元素尚未挂载 ⇒ 不置位的话视频卡会在首帧前谎报「播放中」。
  // 只改瞬态、不落盘；手动点「播放」后本次会话照常播放。
  function applyStartPaused() {
    if (selection.startPaused === true && selection.playing) {
      setTransient("playing", false);
      setTransient("videoPlaying", false);
    }
  }

  // Settings first (host file, port-independent), then the ACTIVE FONTSET (its values live in
  // fontsets/<id>.json — a different store on the same host), then inventory — so the
  // selection restore inside loadInventory()'s revalidateSelection() sees the persisted id
  // and can resolve its media URL, and the first paint already has the user's fonts.
  //
  // ⚠️ 终止 `.catch` 是**必须**的：这条链上任何一步 reject，后面的 `loadInventory` 就永不执行 ——
  // 选择器永久停在「扫描 Wallpaper Engine…」，一次性提示也不收敛（用户只能靠刷新或禁用插件自救）。
  // 各步内部已各自消化可预期的失败（宿主不可达 / 存储被拒 / 坏 JSON），这一条兜的是"没预料到的那次抛"。
  // #158：库存这一腿排在**首帧之后**再跑（`afterFirstPaint` 见上）。大库上它要等一轮全盘
  // 扫描，而首帧之前没有任何界面等它 ⇒ 没必要在宿主启动那几百毫秒里跟它抢 I/O。
  // 与 settings / fontset 分离不影响正确性：链尾的 `revalidateSelection()` 只依赖库存本身。
  loadPersisted()
    .then(applyStartPaused)
    .then(loadFontSet)
    .then(afterFirstPaint)
    .then(() => { prefetchInventoryOnce(); return loadInventory(); })
```

</details>

**依据 2 · 源码核查**：[src/live-layer/probe.js:39-74](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/live-layer/probe.js#L39-L74)

软件渲染判定、人工覆盖及例外。

<details>
<summary>查看原文（36行）</summary>

```text
const LIVE_SOFT_RENDER_RE = /swiftshader|software|llvmpipe|softpipe|microsoft basic render|angle \(software|stack-gl/i;
let liveSoftRenderProbe;      // undefined = 未探测 · true = 软件/无 WebGL · false = 硬件
let liveSoftRenderName = "";  // 诊断用：UNMASKED_RENDERER_WEBGL / VENDOR
function liveSoftRenderProbeNow() {
  if (liveSoftRenderProbe !== undefined) return liveSoftRenderProbe;
  liveSoftRenderProbe = false;
  try {
    const q = (typeof location !== "undefined" && location.search) || "";
    const flag = new URLSearchParams(q).get("we-softrender");
    if (flag === "on" || flag === "1") return (liveSoftRenderProbe = true);
    if (flag === "off" || flag === "0") return (liveSoftRenderProbe = false);
    if (typeof document === "undefined" || typeof document.createElement !== "function") return liveSoftRenderProbe;
    const canvas = document.createElement("canvas");
    if (!canvas || typeof canvas.getContext !== "function") return (liveSoftRenderProbe = true);
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return (liveSoftRenderProbe = true);
    let renderer = "";
    let vendor = "";
    try {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
        vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
      }
    } catch { /* 扩展被禁用：退回普通参数 */ }
    if (!renderer) renderer = gl.getParameter(gl.RENDERER);
    if (!vendor) vendor = gl.getParameter(gl.VENDOR);
    liveSoftRenderName = String(renderer || "") + " / " + String(vendor || "");
    liveSoftRenderProbe = LIVE_SOFT_RENDER_RE.test(liveSoftRenderName);
    try { const lose = gl.getExtension("WEBGL_lose_context"); if (lose) lose.loseContext(); } catch { /* ignore */ }
  } catch { liveSoftRenderProbe = false; }
  return liveSoftRenderProbe;
}
// 本拍该不该把实时渲染钉在暂停：探测到软渲染 + 用户没关兜底开关。
function liveSoftRenderPauseOn() {
  return liveSoftRenderProbe === true && Boolean(selection) && selection.sceneSoftRenderPause !== false;
```

</details>

**依据 3 · 源码核查**：[src/live-layer/watch.js:255-277](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/live-layer/watch.js#L255-L277)

首帧后暂停，预期暂停免计失联；网页载入异常即时降级。

<details>
<summary>查看原文（23行）</summary>

```text
    const stats = liveStats(frame);
    applyLiveControls(frame);
    liveGuardTick(frame);
    const isWeb = selection.type === "web";
    const wstate = isWeb ? liveStateOf(frame) : null;
    const alive = liveHeartbeatAlive(frame, stats, wstate, isWeb);
    // 软渲染兜底（#270）：首帧出来后探测一次 GPU 后端。软渲染（SwiftShader /
    // llvmpipe / 无 WebGL）撑不起实时 WebGL，继续跑会把整页拖死；这时 pause()
    // 渲染页、留住最后一帧当静态画面。用户关掉「软件渲染时暂停」即恢复旧行为。
    if (watch.firstFrame && !watch.softRender && liveSoftRenderProbeNow()
      && selection.sceneSoftRenderPause !== false) {
      watch.softRender = true;
      watch.stall = 0;
      liveLog("soft-render-pause", "wid=" + watch.wid + " 检测到软件渲染（"
        + (liveSoftRenderName || weT("无 WebGL")) + "）→ 暂停实时渲染，保留最后一帧", "warn");
      try { const wp = frame.contentWindow && frame.contentWindow.__wp; if (wp) wp.pause(); } catch { /* ignore */ }
    }
    // 兜底暂停期间：无帧是预期行为，不计 stall / 不判失联（与暂停期同一条纪律）。
    if (watch.softRender && liveSoftRenderPauseOn()) { watch.stall = 0; watch.resumed = false; return; }
    // 渲染页明确记录了 iframe 加载错误 → 立即降级，不必等 15 秒超时。
    if (isWeb && wstate && wstate.iframeLoaded === false && wstate.webError) {
      liveFail("load");
      return;
```

</details>

**依据 4 · 源码核查**：[src/live-layer.js:179-190](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/live-layer.js#L179-L190)

实时 iframe 组装自动画质查询值。

<details>
<summary>查看原文（12行）</summary>

```text
    //（否则可冒用宿主身份调宿主 API / 读宿主存储）——只给 allow-scripts，
    // 控制经渲染页的 postMessage 通道下发，shim 由宿主注入 HTML 响应。
    + (isWeb ? "&webSandbox=strict" : "")
    + "&fit=" + fit + "&sceneFps=" + fps + "&muted=" + muted
    // 自动画质（webwallgl 的 autoQuality）：渲染页的关闭开关是 `autoq=0`。默认不传 = 引擎按
    // 帧率自行降后处理/粒子/AA；**关掉本设置**（sceneAutoQuality=false）才显式关掉，保住发光 /
    // 音频可视化 / 光晕 —— 弱 GPU 上帧率压不住上限时它会一路降到 postProcessing=off，
    // 视觉上就是"动态效果全没了"，而用户往往要的是效果，不是那几帧。
    + (selLike.sceneAutoQuality === false ? "&autoq=0" : "")
    // WE 官方素材（local-assets）：host 报告素材目录可用时才打开渲染页的
    // 本地素材通路（探测 /api/local-assets，按名取官方像素）；否则渲染页
    // 静默走程序化复刻，连探测请求都不发。
```

</details>

**依据 5 · 源码核查**：[src/media-prep/prepare.js:91-98](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/media-prep/prepare.js#L91-L98)

出场前的 Scene 预备也使用 sceneAutoQuality。

```text
    const liveSel = {
      type: "scene", id: w.id,
      sceneLiveSrc: w.sceneLiveSrc || null,
      objectFit: selection.objectFit,
      sceneLiveFps: selection.sceneLiveFps,
      sceneLive: selection.sceneLive,
      sceneLiveFailures: selection.sceneLiveFailures, sceneAutoQuality: selection.sceneAutoQuality,
    };
```

**依据 6 · 源码核查**：[src/persistence.js:280-301](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/persistence.js#L280-L301)

接管宿主设置时仍保留设备限定字段，避免旧应答覆盖。

<details>
<summary>查看原文（22行）</summary>

```text
  const stale = persistWrites !== writesAtStart;
  if (hostOk && hostSettings && typeof hostSettings === "object") {
    // Host is the truth: apply it and refresh the local cache copy — unless the
    // user edited settings during the fetch (their write wins).
    if (!stale) {
      // CLIENT_ONLY 的键宿主**从来不收**（它们只住 localStorage：设备本地的抽帧 / 自定义画面记忆）。宿主 GET 回的是
      // 宿主快照，而 `sanitizeSettings()` 是客户端视角的消毒 —— 它会给这两个键补上**默认值**。整份 assign 下去 ⇒
      // 每次启动都把本地记忆清成默认值，随后 `writeLocalCache()` 再把清空结果写回缓存（真·数据丢失，且与"宿主不可达
      // 就回落本地缓存"那条路径合并结果不同 —— #371 的附带发现，两条加载路径语义必须一致）。所以这两个键一律取已有的本地值。
      const fromHost = sanitizeSettings(hostSettings);
      // 本地值取**内存里的 `selection`**：它初始化时就铺了 `readPersisted()`（client.js 的 store 初始化），
      // 再读一遍 localStorage 既是重复的 parse + 消毒，也埋了一个边界 —— 启动瞬间 localStorage 不可用时
      // `readPersisted()` 回落 `DEFAULTS`，反而把内存里已采纳的本地记忆清空。
      for (const key of CLIENT_ONLY) {
        if (key in selection) fromHost[key] = selection[key];
      }
      Object.assign(selection, fromHost);
      writeLocalCache();
      // 差分基线 = 宿主现在持有的那份（客户端形状）。⚠️ 只在真的采纳宿主值时推进：GET 在途时
      // 用户改过设置的话，他们那次整段 PUT 已经写进宿主，别拿过期应答当基线（会漏发后续改动）。
      pushedSnapshot = cloneSettingsSnapshot(serializeSelection());
    }
```

</details>

**依据 7 · 源码核查**：[src/media-prep.js:475-485](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/media-prep.js#L475-L485)

备用网页容器保留脚本执行并隔离来源。

<details>
<summary>查看原文（11行）</summary>

```text
    media.src = sel.url;
    media.setAttribute("frameborder", "0");
    media.setAttribute("scrolling", "no");
    // 安全隔离：WE web 壁纸是 workshop 第三方 HTML/JS，而 media 路由与宿主
    // 同源 —— 不 sandbox 的话壁纸脚本可以 DSH 宿主 origin 身份调用宿主全部
    // API。allow-scripts 保留动态壁纸能力，但拿到 opaque origin（无
    // allow-same-origin），无法再冒用宿主身份。
    media.setAttribute("sandbox", "allow-scripts");
    media.className = "we-media we-iframe";
  }
  return media;
```

</details>

#### 缺口

- 探测命中与页面负载未知
  **影响**：软渲染设备可能误判，首帧前仍可能拖慢交互
  **进一步探讨**：分别在硬件与软件渲染、关闭／开启保护下记录首帧和网络侧行为。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 内置性能模块能证明什么，怎样才能辨别整页变慢与壁纸慢？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

性能扩展给用户提供同页诊断入口。实时分支读选中 iframe 的渲染状态，视频按帧计数差和时间差计算，暂停后清空计数起点，静态项显示没有渲染帧。界面帧率由父页 requestAnimationFrame 单独统计，frameMs 是壁纸 FPS 的倒数估计，不能提供帧耗时分布。CPU 通过诊断 HTTP 轮询读取 DSH 宿主 Node 进程 user+system 增量除以墙钟增量，多核可超过单核百分比，未覆盖浏览器进程、GPU、外部编解码和墙上时间任务收益。面板与浮窗共享一个采样者，最后一个订阅离开后停止计时，能降低两个展示各取一套数据的开销；还需要测监控打开自身对任务的影响。

待验证假设是，在同一 DSH profile、窗口尺寸、对话回放和刷新率下，固定启动暂停与自动画质变量、再对照静态和实时 Scene，可借两套帧率区分场景降级与整页交互卡顿。使用同一项任务记录首屏、切换、输入延迟和退出后的监控停止，并从系统监视器读取浏览器和 GPU 数据。如果壁纸 FPS 降但输入稳定，则可保留更低画质；如果面板正常却输入明显变慢、资源升高、网页有意外请求或停用后仍活动，就退回静态主题。若指标走势不能区分已知软件渲染与硬件基线，就不能基于该面板做采用归因。

#### 证据与依据

**依据 1 · 源码核查**：[src/ext-perf.js:121-151](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/ext-perf.js#L121-L151)

界面 RAF 和宿主 CPU 分开读取，CPU 轮询防重入。

<details>
<summary>查看原文（31行）</summary>

```text
/** 界面帧率：整页合成，与壁纸帧率分开算；只刷新样本里的 uiFps 字段。 */
function perfUiTick() {
  if (!perfTimer) return;
  perfUiFrames += 1;
  const now = perfNow();
  if (now - perfUiFrom >= PERF_UI_WINDOW_MS) {
    perfUiFps = Math.round((perfUiFrames * 1000) / (now - perfUiFrom));
    perfUiFrames = 0;
    perfUiFrom = now;
    if (perfSampleLatest) perfPublish({ ...perfSampleLatest, uiFps: perfUiFps });
  }
  perfRaf = requestAnimationFrame(perfUiTick);
}

/** 本进程 CPU：宿主 /diag-log?perf=1 已经做差，这里只取最后一次读数（单飞，防重入）。 */
function perfFetchCpu() {
  if (perfCpuBusy) return;
  perfCpuBusy = true;
  apiJson("/diag-log?perf=perf-monitor")
    .then((res) => {
      const p = res && res.data && res.data.perf;
      const next = p ? Number(p.cpu) : NaN;
      if (Number.isFinite(next) && next >= 0) {
        perfCpu = next;
        // CPU 是整进程读数，与哪张壁纸无关：样本在就顺手刷新，不必等到下一拍。
        if (perfSampleLatest) perfPublish({ ...perfSampleLatest, cpu: perfCpu });
      }
    })
    .catch(() => { /* 下一拍再试 */ })
    .then(() => { perfCpuBusy = false; });
}
```

</details>

**依据 2 · 源码核查**：[src/ext-perf.js:154-197](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/ext-perf.js#L154-L197)

按壁纸类型计算 FPS，frameMs 通过 FPS 换算。

<details>
<summary>查看原文（44行）</summary>

```text
function perfSampleTick() {
  if (!perfTimer) return;
  const kind = perfKindOf(perfSel);
  let wallFps = 0;
  let note;
  if (kind === "live") {
    const r = perfLiveSample(liveFrameEl());
    wallFps = r.fps;
    note = r.note;
  } else if (kind === "video") {
    const v = perfVideoEl();
    const now = perfNow();
    if (!v) note = weT("等待视频");
    else if (v.paused || v.ended) {
      // 暂停时把基线也清掉：恢复播放的第一拍要重新起算，不能把暂停时长算进帧率。
      note = weT("已暂停");
      perfVideoElRef = null;
      perfVideoAt = 0;
    } else {
      const frames = perfVideoFrames(v);
      if (v !== perfVideoElRef || !perfVideoAt) {
        perfVideoElRef = v;
        perfVideoFramesVal = frames;
        perfVideoAt = now;
        note = weT("等待视频");
      } else {
        const dt = (now - perfVideoAt) / 1000;
        const df = frames - perfVideoFramesVal;
        perfVideoElRef = v;
        perfVideoFramesVal = frames;
        perfVideoAt = now;
        if (dt > 0 && df >= 0) wallFps = Math.round(df / dt);
        note = weT("视频");
      }
    }
  } else {
    note = weT("静态壁纸没有渲染帧");
  }
  const frameMs = wallFps > 0 ? 1000 / wallFps : 0;
  perfPublish({
    kind: kind, wallFps: wallFps, frameMs: frameMs,
    uiFps: perfUiFps, cpu: perfCpu, note: note,
  });
  perfFetchCpu();
```

</details>

**依据 3 · 源码核查**：[src/ext-perf.js:201-248](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/src/ext-perf.js#L201-L248)

采样在订阅期间运行，退订后停止。

<details>
<summary>查看原文（48行）</summary>

```text
function perfStop() {
  if (perfTimer) clearInterval(perfTimer);
  if (perfRaf) { try { cancelAnimationFrame(perfRaf); } catch { /* ignore */ } }
  perfTimer = 0;
  perfRaf = 0;
  perfSampleLatest = null;
  perfSel = null;
  perfKey = "";
  perfCpuBusy = false;
  perfCpu = 0;
  perfUiFrames = 0;
  perfUiFps = 0;
  perfVideoElRef = null;
  perfVideoAt = 0;
  perfVideoFramesVal = 0;
}

/** 订阅：返回退订函数。第一个消费者启动单例，最后一个离开时停表。 */
function perfSubscribe(selLike, push) {
  perfSampleSubs.add(push);
  perfSel = selLike;
  const key = perfSampleKey(selLike);
  if (key !== perfKey) {
    perfKey = key;
    perfVideoElRef = null;
    perfVideoAt = 0;
    perfVideoFramesVal = 0;
    perfPublish(null);
  }
  if (!perfTimer) {
    perfUiFrames = 0;
    perfUiFps = 0;
    perfUiFrom = perfNow();
    perfTimer = setInterval(perfSampleTick, PERF_SAMPLE_MS);
    if (typeof requestAnimationFrame === "function") perfRaf = requestAnimationFrame(perfUiTick);
    perfSampleTick();
  } else {
    push(perfSampleLatest);
  }
  return function unsubscribe() {
    perfSampleSubs.delete(push);
    if (perfSampleSubs.size === 0) perfStop();
  };
}

/**
 * 岛与浮窗共用的读数 hook。开关关着时也**无条件**调用它（hooks 规则），
 * 只是 effect 里立刻清空、不启动采样器。
```

</details>

**依据 4 · 源码核查**：[lib/routes/diag.js:159-175](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/lib/routes/diag.js#L159-L175)

后端仅带 perf 查询时返回性能快照。

<details>
<summary>查看原文（17行）</summary>

```text
      // `components`（P2-4 A2）：组件装载探针 —— 只在**这里**读一次，仍走 `res.end(JSON.stringify(…))`
      // 与 `application/json`（不得改用 sendJson：那会换掉 Content-Type，老客户端按 JSON 解析的假设会破）。
      // `perf`（#263）：性能监控面板带 `?perf=1` 轮询时，回本进程 CPU 快照；
      // 不带参数时为 `null`（不影响既有读诊断日志的调用方）。
      let perf = null;
      try {
        const wantPerf = new URL(req.url || '/diag-log', 'http://x').searchParams.has('perf');
        if (wantPerf) perf = snapshot();
      } catch { /* ignore malformed */ }
      res.end(JSON.stringify({
        entries: diagLog.slice(-80),
        components: typeof componentsProbe === 'function' ? componentsProbe() : null,
        perf,
      }));
    },
  }));
  // 出参交付（见文件头的 `onHandleDiag`）：媒体源的根路径 `/diag` 必须落到**同一个**
```

</details>

**依据 5 · 源码核查**：[lib/perf-metrics.js:18-43](https://github.com/elysia395/dsh-wallpaper-engine/blob/b8d5c3a10956d4c7a86748a77a5d64292a6820f2/lib/perf-metrics.js#L18-L43)

CPU 是进程级增量，首次值没有差分基线。

<details>
<summary>查看原文（26行）</summary>

```text
import { cpuUsage } from 'node:process';

/** 上次 CPU 采样。 */
let lastCpu = null;
/** 上次 CPU 采样的墙钟毫秒。 */
let lastCpuAt = 0;

/**
 * 快照本进程 CPU 占用（%，单核 100% 满）。
 * 用 `process.cpuUsage()` 的**增量**除以墙钟增量 —— 累计值本身没有意义。
 * @returns {{cpu:number}}
 */
export function snapshot() {
  const now = Date.now();
  const usage = cpuUsage();
  if (!lastCpu || !lastCpuAt) {
    lastCpu = usage;
    lastCpuAt = now;
    return { cpu: 0 };
  }
  const delta = (usage.user - lastCpu.user) + (usage.system - lastCpu.system);
  const elapsed = now - lastCpuAt;
  lastCpu = usage;
  lastCpuAt = now;
  const cpu = elapsed > 0 ? (delta / 1000) / elapsed * 100 : 0;
  return { cpu };
```

</details>

#### 缺口

- 无同环境任务对照
  **影响**：不能从源码认定输入延迟、耗电或持续成本变好
  **进一步探讨**：锁定素材与任务回放，记录静态、动态与软渲染暂停三组资源及交互指标。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
