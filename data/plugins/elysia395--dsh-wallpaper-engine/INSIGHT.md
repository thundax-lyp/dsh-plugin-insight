# Wallpaper Engine

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[42459ec](https://github.com/elysia395/dsh-wallpaper-engine/tree/42459ec505aedfe0bc0a6f76b52132f8b2cf9224)

<!-- BEGIN META -->
[![GitHub ★ 4,356](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C356&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/elysia395/dsh-wallpaper-engine) [![npm 30d 82,452](https://img.shields.io/static/v1?label=npm+30d&message=82%2C452&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-wallpaper-engine) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-wallpaper-engine)
<!-- END META -->

> **功能**：将本机 Wallpaper Engine 与自定义媒体带入 DSH Web 界面，并提供外观设置。

> **亮点**：将本地媒体发现、图层、宿主持久化和设置入口整合进 DSH Web，而非发明壁纸格式或渲染引擎。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：动态壁纸的显示和可读性收益能否超过设备开销、兼容排障及素材授权成本？[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 谁适合使用，与普通静态背景相比增加什么？](#detail-section-11)
  - [Q02 · 选择的壁纸如何进入宿主界面？](#detail-section-12)
  - [Q03 · 播放失败、设置保存和资源访问有什么边界？](#detail-section-13)
  - [Q04 · 兼容条件和使用成本是什么？](#detail-section-14)
  - [Q05 · 哪些贡献成立，下一步假设如何推翻？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH Web 用户为聊天界面选择本地壁纸及调整视觉效果；无相关需要者可继续使用静态背景。[Q01](#research-q01)

普通静态背景及宿主原生外观不需要动态渲染和媒体转码；WebWallGL 本身是外部依赖。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Scene/Web | 将壁纸项目用于聊天背景 | 依赖浏览器及素材兼容 |
| 图片/视频 | 选择本机或上传素材 | 转码和资源消耗视情况 |
| 外观设置 | 调节玻璃、字体和预设 | 子包与宿主版本需匹配 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web 与 Node | 必需 | 装载 host/client | 无法假定可加载 |
| 本机媒体与 WebGL | 对应壁纸类型需要 | 渲染 Scene/Web 或播放视频 | 更换媒体或静态背景 |
| ffmpeg | 部分转码需要 | 生成降帧视频 | 原媒体可能回退，须验证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户检查版本、素材授权和资源 | 条件不明时先不安装 |
| 试用 | 隔离 profile 选择可信图片或视频 | 页面显示、控制及重启后设置符合预期 |
| 验收 | 按需试 Scene/Web 并查看资源 | 失败或影响可读性时停用动态层 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源及素材费用未知 | 安装、确认授权与兼容 | 未测配置时间 |
| 持续 | CPU、GPU、磁盘及下载成本未知 | 调整及维护素材 | 随内容和设备变化 |
| 恢复 | 未测 | 停用动态效果和排查 | 宿主持久化回退需验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 动态背景 | 代码有图层、设置与媒体接线 | 具体素材可播放及视觉收益 |
| 数据保存 | 有宿主文件和本地回退路径 | 故障恢复后最终一致性 |

> **思考**：动态壁纸的显示和可读性收益能否超过设备开销、兼容排障及素材授权成本？[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将本地媒体发现、图层、宿主持久化和设置入口整合进 DSH Web，而非发明壁纸格式或渲染引擎。[Q01](#research-q01) [Q02](#research-q02)

宿主媒体路由、客户端图层、按命名空间设置和失败看护组成代表接缝；路径围栏只证明所查路由自身的机制。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

动态壁纸的显示和可读性收益能否超过设备开销、兼容排障及素材授权成本？[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离 profile 试可信图片或短视频，再逐步验证 Scene/Web；若画面、性能或授权不适合，停用动态层并使用静态背景。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代表路径和有限保护判断；没有运行宿主、浏览器、媒体与性能实验。

- 已检查：作者 README、包清单、源码路径 README.md、src/client.js、lib/index.js、src/live-layer-pointer.js、src/live-layer-watch.js、src/persistence.js、lib/serve.js、package.json、lib/media/transcode.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本静态检查主包入口、代表播放、持久化及媒体围栏；未全面审计子包、全部路由和浏览器安全，也未执行目标代码。
- 下一步：在隔离 profile 分别检查图片、视频、Scene/Web，故障注入宿主断连和重启，并记录设备资源、兼容和授权。

**分析版本**

- **仓库**：[elysia395/dsh-wallpaper-engine](https://github.com/elysia395/dsh-wallpaper-engine)
- **版本号**：1.4.0（[固定提交 42459ec](https://github.com/elysia395/dsh-wallpaper-engine/tree/42459ec505aedfe0bc0a6f76b52132f8b2cf9224)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

假设基于设备和页面可见性选择静态预览或动态层可减少资源消耗；与现有暂停和降级做同素材对照，若资源不改善或视觉体验明显变差则否定。[Q05](#research-q05)

在隔离 profile 分别检查图片、视频、Scene/Web，故障注入宿主断连和重启，并记录设备资源、兼容和授权。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 74 | 22120 | — | — | 592729 |
| .cjs | source | 2 | 341 | 324 | 1 | — |
| .mjs | source | 11 | 2800 | 1628 | 1060 | — |
| .js | source | 178 | 56069 | 34075 | 21193 | — |
| .mjs | test | 158 | 81792 | 59114 | 20024 | — |

</details>

**活跃度**

[![Issue 未关闭 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=27&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 100](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=100&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 84](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=84&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 壁纸插件的用户价值、媒体接线、失败边界与采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁适合使用，与普通静态背景相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望在 DSH Web 聊天时个性化界面的用户可选本机 Wallpaper Engine 项目或自有媒体，并调节玻璃、字体等视觉效果。相比静态背景，它把 Scene、Web、视频播放及本地素材选择接到宿主页面；WebWallGL 是外部渲染引擎，不能归功为插件独创。动态画面也可能分散注意或增加资源消耗，静态背景仍是低成本替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-33](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/README.md#L31-L33)

作者界定视觉场景与不向 agent 注入工具。

```text
<h2 id="简介"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/section-intro-dark.png"><img src="assets/readme/section-intro-light.png" alt="INTRO · 简介" width="1440"></picture></h2>

把本机 **Wallpaper Engine** 的 Scene、Web 与视频壁纸带进 DSH 对话界面，再配上液态玻璃、字体、吉祥物与可分享的外观预设。插件不向 agent 注册工具、不注入提示文本，**不增加模型 token 开销**。
```

**依据 2 · 作者声明**：[README.md:66-83](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/README.md#L66-L83)

作者列出壁纸类型、外观功能及 Application 不支持。

<details>
<summary>查看原文（18行）</summary>

```text
<h2 id="主要能力"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/section-features-dark.png"><img src="assets/readme/section-features-light.png" alt="能做什么" width="1440"></picture></h2>

- **壁纸**：Scene / Web 实时渲染，Video 直接播放；支持自定义图片 / 视频上传与 WE 项目目录。
- **外观**：设置窗、对话区与侧栏液态玻璃；配色、透明度、模糊、边框与字体可调。
- **玻璃子包**：液态玻璃是独立子包行 `wallpaper-engine-glass`，可在插件管理器单独停用；停用后，除内容区壁纸外界面回到宿中原生外观，壁纸、字体与吉祥物等功能不受影响。
- **扩展**：吉祥物、会话头像、点击 / 拖尾特效、3D 视差；可选官方 `dsh-pet` 联动。
- **壁纸库**：筛选、隐藏 / 恢复、自动轮播；外观预设整套导入导出。

<h2 id="支持哪些壁纸"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/section-formats-dark.png"><img src="assets/readme/section-formats-light.png" alt="支持哪些壁纸类型" width="1440"></picture></h2>

| 类型 | 在 DSH 中的路径 | 支持情况 |
|---|---|---|
| **Scene（场景）** | 内置 WebWallGL 实时渲染，失败时按降级链回退 | 支持，不需要 WE 在后台运行 |
| **Web（网页）** | 网页挂载、WE API 注入与沙箱隔离 | 支持；效果取决于网页与浏览器能力 |
| **Video（视频）** | 浏览器播放，配合转码、帧率上限与暂停控制 | 支持 |
| **自定义图片 / 视频** | 上传本地 JPG / PNG / MP4 | 支持，文件保存在本机 |

Application（应用）类壁纸需要启动第三方程序，**不支持**，也不会进入壁纸库或轮播候选。
```

</details>

**依据 3 · 源码核查**：[src/client.js:6278-6289](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/src/client.js#L6278-L6289)

在 settings.section 注册设置界面。

<details>
<summary>查看原文（12行）</summary>

```text
  //    in dsh-web-ui-all: its own nav entry, rendered inside the panel content
  //    column). The picker renders inside the liquid-glass card shell.
  //    `label` 用 **thunk**（官方 SlotLabel 支持"每次读取时求值"）：语言切换后设置导航里
  //    的那一行跟着换文字，不需要重注册座位。nav-icon.js / sidebar-right.js 的 DOM 锚点
  //    认的就是这个词的当前译文。
  if (ctx.slots) {
    ctx.slots.inject("settings.section", () =>
      ctx.slots.register(
        { name: "settings.section", id: "wallpaper-engine", order: 500, label: () => weT("壁纸引擎") },
        () => React.createElement(WallpaperPickerSection),
      ),
    );
```

</details>

#### 缺口

- 缺少真实用户对照，无法证明更高生产率或视觉可读性。
  **影响**：结论限于固定源码与作者声明，不能推断真实运行效果。
  **进一步探讨**：以同一批任务对比静态背景和动态壁纸的可读性与资源占用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 选择的壁纸如何进入宿主界面？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主入口硬注入 webServer，注册自身路由并提供组件服务；客户端 apply 预取清单、订阅选择状态、挂载壁纸与遮罩层，再注册设置区。Scene/Web 通过 live iframe 接入渲染，视频走浏览器播放；作者提供的 WebWallGL 与本组件的清单、路由、界面和接线共同完成体验。具体网页与 GPU 的渲染成功不能由静态代码保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:170-200](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/lib/index.js#L170-L200)

宿主注入 webServer 并提供组件服务。

<details>
<summary>查看原文（31行）</summary>

```text
 * concurrently and the webserver may not exist yet, which would silently skip
 * route registration and let the SPA fallback answer every request. This bundle
 * is web-only (its dsh.client declares platform "web"), so a hard injection is
 * correct; it is simply not added to headless/TUI profiles.
 */
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
```

</details>

**依据 2 · 源码核查**：[src/client.js:5918-5945](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/src/client.js#L5918-L5945)

预取清单及通过 effect 订阅图层。

<details>
<summary>查看原文（28行）</summary>

```text
function apply(ctx) {
  // 0. i18n：把插件文案接上宿主的 locale 服务（`ctx.get("locale")`，可选服务 + 短轮询 ——
  //    缺服务时静默停在默认语言，见 src/i18n.js）。放在最前面：界面首次渲染就要按当前
  //    语言取词；服务通常已在（dsh-web-app 的 base bundle 自带），轮询只是兜底。
  if (ctx.effect) ctx.effect(() => weI18nAttach(ctx) || undefined);

  // 0b. 启动预取：inventory / 字体集清单与设置无关，启动链却要等 settings 之后才发。
  //     在这里先发出去，链走到它们时通常已经回来（只预取一次；失败不影响启动链）。
  try {
    prefetchInventoryOnce();
    prefetchFontSetList();
  } catch { /* 预取失败走原路径（启动链各步自己会发请求） */ }

  // 1. Mount the behind-body wallpaper + scrim layers and keep them in sync
  //    with the selection store. ctx.effect gives fiber-lifetime cleanup.
  if (ctx.effect) {
    ctx.effect(() => {
      const unsub = subscribe(syncLayers);
      const unsubEffects = subscribe(applyEffects);
      // 「扩展」页签的那几层（P-A 起统一走注册表）：接法与壁纸层同形 —— 每次 emit 重判一次
      // "该不该活"。三层各自的性质不同（画布层内容驱动、视差层收敛驱动、头像层改宿主 DOM），
      // 但**接法只有一个**：注册表说有哪些层，这里就 subscribe 谁的 sync；参数不在这里传，
      // 每一层自己每帧现读 `selection`。三项里两项住在自己的包里，本 bundle 的作用域里
      // 根本没有它们的函数名 —— 这正是这张注册表存在的理由。
      const layerUnsubs = new Map();
      const attachLayer = (layerId, hooks) => {
        if (layerUnsubs.has(layerId)) return;
        layerUnsubs.set(layerId, subscribe(hooks.sync));
```

</details>

**依据 3 · 源码核查**：[src/client.js:6278-6289](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/src/client.js#L6278-L6289)

设置插槽注册。

<details>
<summary>查看原文（12行）</summary>

```text
  //    in dsh-web-ui-all: its own nav entry, rendered inside the panel content
  //    column). The picker renders inside the liquid-glass card shell.
  //    `label` 用 **thunk**（官方 SlotLabel 支持"每次读取时求值"）：语言切换后设置导航里
  //    的那一行跟着换文字，不需要重注册座位。nav-icon.js / sidebar-right.js 的 DOM 锚点
  //    认的就是这个词的当前译文。
  if (ctx.slots) {
    ctx.slots.inject("settings.section", () =>
      ctx.slots.register(
        { name: "settings.section", id: "wallpaper-engine", order: 500, label: () => weT("壁纸引擎") },
        () => React.createElement(WallpaperPickerSection),
      ),
    );
```

</details>

**依据 4 · 源码核查**：[src/live-layer-pointer.js:398-426](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/src/live-layer-pointer.js#L398-L426)

创建并配置 live iframe。

<details>
<summary>查看原文（29行）</summary>

```text
    }
    entry.timer = setTimeout(tick, LIVE_MOUNT_POLL_MS);
  };
  entry.timer = setTimeout(tick, Math.min(LIVE_MOUNT_POLL_MS, delayMs)); // 首拍稍早：小 pkg 可能一帧内就绪
}

function createLiveFrame(sel) {
  const frame = document.createElement("iframe");
  const url = liveRenderUrl(sel);
  // **不该现在拉载荷就先不赋 src**（隐藏 / 用户暂停 / 省电暂停）：首帧等于整包到齐，
  // 而这样的实例根本出不了帧（Chromium 冻结隐藏页的 rAF），拉下来只会和**可见**那个
  // 实例抢带宽与解码器 —— 实测 3 个实例同时挂同一份 336MB 包，唯一走完的是最后那个，
  // 可见那个在 15s 时一帧都没出。层键仍算 live（`wantKey` 里没变）⇒ 不触发重建，
  // 垫底图照旧；补 src 由 armDeferredLiveFrame 在"可见且应播"时做（可见性变化会 emit）。
  if (liveFrameShouldDefer()) {
    frame.dataset.weLiveSrc = url;
    liveLog("live-payload-defer", "wid=" + (sel && sel.id) + " 隐藏/未播放中 → 先不加载载荷（可见时补）", "info", true);
  } else {
    frame.src = url;
  }
  frame.setAttribute("frameborder", "0");
  frame.setAttribute("scrolling", "no");
  // iframe 内音频（HTMLAudioElement / 网页壁纸的媒体）的自动播放授权。
  frame.setAttribute("allow", "autoplay");
  frame.className = "we-media we-iframe we-live-iframe";
  frame.addEventListener("load", () => {
    // onload 只说明文档加载完成（模块还在执行 / pkg 未拉取），真正「活」
    // 由心跳判定；文档若已被重建移除则直接放弃。
    // **延迟载荷的帧要跳过**：载荷暂停时我们把 src 摘成 about:blank（也会触发 load），
```

</details>

**依据 5 · 作者声明**：[README.md:74-83](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/README.md#L74-L83)

作者描述不同媒体对应路径。

<details>
<summary>查看原文（10行）</summary>

```text
<h2 id="支持哪些壁纸"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/section-formats-dark.png"><img src="assets/readme/section-formats-light.png" alt="支持哪些壁纸类型" width="1440"></picture></h2>

| 类型 | 在 DSH 中的路径 | 支持情况 |
|---|---|---|
| **Scene（场景）** | 内置 WebWallGL 实时渲染，失败时按降级链回退 | 支持，不需要 WE 在后台运行 |
| **Web（网页）** | 网页挂载、WE API 注入与沙箱隔离 | 支持；效果取决于网页与浏览器能力 |
| **Video（视频）** | 浏览器播放，配合转码、帧率上限与暂停控制 | 支持 |
| **自定义图片 / 视频** | 上传本地 JPG / PNG / MP4 | 支持，文件保存在本机 |

Application（应用）类壁纸需要启动第三方程序，**不支持**，也不会进入壁纸库或轮播候选。
```

</details>

#### 缺口

- 未启动浏览器，也未检验各平台 Scene/Web 内容兼容性。
  **影响**：结论限于固定源码与作者声明，不能推断真实运行效果。
  **进一步探讨**：在隔离 profile 选取静态图、视频和两个不同的 Scene/Web 项目观察实际显示。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 播放失败、设置保存和资源访问有什么边界？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

live 看护检测网页加载错误并触发失败处理；作者声明 Scene 失败会逐级降级，不能据此保证每个项目最终均可播放。设置以宿主文件为真源，浏览器 localStorage 用作缓存、迁移和宿主不可达时的回退；回退并不证明宿主持久化成功。scene-files 对路径进行字面与 realpath 包含性检查并拒绝最终符号链接，属于所读资源路由的保护，不能外推为整套服务或不可信网页的完整安全证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/live-layer-watch.js:304-317](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/src/live-layer-watch.js#L304-L317)

网页 iframe 加载错误交给失败分支。

<details>
<summary>查看原文（14行）</summary>

```text
    if (!frame.isConnected) { liveLog("watch-stop", "iframe 已从文档移除", "info", true); stopLiveWatch(); return; }
    // 先读统计、后下发控制：虽然 applyLiveControls 已去重（只在变化时
    // resume/pause），保持这个顺序让读数不受任何控制调用的副作用影响。
    const stats = liveStats(frame);
    applyLiveControls(frame);
    const isWeb = selection.type === "web";
    const wstate = isWeb ? liveStateOf(frame) : null;
    const alive = liveHeartbeatAlive(frame, stats, wstate, isWeb);
    // 渲染页明确记录了 iframe 加载错误 → 立即降级，不必等 15 秒超时。
    if (isWeb && wstate && wstate.iframeLoaded === false && wstate.webError) {
      liveFail("load");
      return;
    }
    liveLog("tick", () => liveStateBrief("fps=" + (stats ? Math.round(stats.fps * 10) / 10 : "null")
```

</details>

**依据 2 · 作者声明**：[README.md:121-125](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/README.md#L121-L125)

作者声明 WebGL 差异与降级。

```text
<h2 id="兼容与限制"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/section-compat-dark.png"><img src="assets/readme/section-compat-light.png" alt="兼容与限制" width="1440"></picture></h2>

- Windows / macOS / Linux 使用同一份源码；macOS 没有 WE 客户端，可上传图片 / 视频或指向 WE 项目目录。
- Scene 渲染依赖浏览器 WebGL 与显卡驱动，复杂工坊项目可能存在兼容差异；失败会逐级降级。
- 遮挡暂停、窗口失焦暂停与音频回环采集按平台适配；在线歌词默认关闭。
```

**依据 3 · 源码核查**：[src/persistence.js:80-84](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/src/persistence.js#L80-L84)

宿主文件与本地缓存职责。

```text
// Host persistence: debounced PUT to /wallpaper-engine/settings (same origin;
// the host writes ~/.dsh-wallpaper-engine/config.json — port-independent).
// localStorage stays a synchronous-read cache + migration source + rollback,
// never the source of truth — and its WRITE is debounced together with the
// PUT: a full JSON.stringify + synchronous localStorage write on every input
```

**依据 4 · 源码核查**：[src/persistence.js:250-254](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/src/persistence.js#L250-L254)

宿主不可达时使用本地回退。

```text
// GET /wallpaper-engine/settings: the host file is the source of truth (it
// survives DSH Desktop's random --port 0 restarts and browser data clears;
// localStorage is origin-scoped). Migration: when the host has nothing yet but
// localStorage does, upload it once so the host becomes the truth. On any host
// failure fall back to localStorage so a plain web load keeps working.
```

**依据 5 · 源码核查**：[lib/serve.js:464-500](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/lib/serve.js#L464-L500)

scene-files 路径和 realpath 围栏。

<details>
<summary>查看原文（37行）</summary>

```text
      //   a) **字面路径**必须落在 root 内（`resolve()` + `startsWith`）—— 挡 `..` 与绝对路径；
      //   b) **解析后的真实路径**也必须落在 root 内 —— `resolve()` 不认识链接，而 `serveFile`
      //      会跟随链接 ⇒ 只有 (a) 不足以把目标钉在壁纸目录里。
      //      `lstatSync` 拒最终组件是链接；`realpathSync.native` 的包含性比对覆盖"中间目录是
      //      链接"（**必须 native**：JS 版 realpathSync 在 Windows 上不解析 junction —— 实测
      //      junction 内的文件它原样返回，native 才给出真实路径）。
      // 两层共用同一个 403 出口 ⇒ 响应形状（状态码 + 体）固定。
      const root = dirname(abs);
      const target = resolve(root, subpath);
      const fenceOut = (why) => {
        appendDiagLine('fence', { route: 'scene-files', why, subpath: subpath.slice(0, 160), referer: String(req.headers.referer || '').slice(0, 120), dest: req.headers['sec-fetch-dest'] || '' });
        // 围栏拒绝 = 有请求被挡下（多半是路径拼错或第三方 HTML 在越界取文件）⇒ 影响显示效果 ⇒ warn。
        log.warn(`scene-files fenced (${why}): subpath="${subpath}" referer="${req.headers.referer || '-'}" dest=${req.headers['sec-fetch-dest'] || '-'}`);
        res.setHeader('Cache-Control', 'no-store');
        res.statusCode = 403; res.end(`forbidden-scene-files[${subpath}]`);
      };
      if (target === root || !target.startsWith(root + sep)) { fenceOut('path'); return; }
      // 「压根不存在」不在这里判 —— 交给下游的 `existsSync` / `serveFile` 出 404，免得把
      // "文件不在"报成"越界"（那会把排除故障的人引向错误方向）。**其余错误一律围栏**：
      // 解析不出来就不发。这一层刻意是 **fail-closed** —— 若"catch 里一律放行"，一个解析
      // 异常就等于围栏整层失效（`verify-scene-live` 的 junction 判据钉住这条）。
      let linked = false;
      let realTarget = '';
      let unresolved = false;
      try {
        linked = lstatSync(target).isSymbolicLink();
        realTarget = realpathSync.native(target);
      } catch (e) {
        const code = e && e.code;
        if (code !== 'ENOENT' && code !== 'ENOTDIR') unresolved = true;
      }
      if (linked) { fenceOut('symlink'); return; }
      if (unresolved) { fenceOut('unresolved'); return; }
      let realRoot;
      try { realRoot = realpathSync.native(root); } catch { realRoot = ''; }
      if (!realRoot) { fenceOut('unresolved-root'); return; }
      if (realTarget && realTarget !== realRoot && !realTarget.startsWith(realRoot + sep)) { fenceOut('realpath'); return; }
```

</details>

#### 缺口

- 没有故障注入、跨源对抗和多浏览器实测。
  **影响**：结论限于固定源码与作者声明，不能推断真实运行效果。
  **进一步探讨**：断开宿主后修改再恢复，检查设置冲突；对受控项目复现渲染失败与路径边界。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 兼容条件和使用成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包声明 Node >= 22.12.0、DSH ^0.2.0-rc.1，并配置 Web 客户端；作者要求 DSH 0.2 内核与 pnpm。可从本机资源或上传媒体开始，Scene 还受 WebGL、驱动和素材影响，Application 类型明确不支持。按需转码路径可使用 ffmpeg，代码还包含固定摘要的延迟下载链；下载网络、磁盘及 CPU/GPU 成本、素材授权和多包维护都需自行核查。若本机缺少条件，可停用动态层并回到静态背景。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-10](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/package.json#L1-L10)

包版本与引擎声明。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "dsh-plugin-wallpaper-engine",
  "version": "1.4.0",
  "description": "Wallpaper Engine backgrounds for the DSH web GUI: render your local Wallpaper Engine wallpapers behind the chat — Scene and Web in real time through the bundled WebWallGL engine, Video played directly — with iOS-style liquid glass, adjustable blur/scrim/border/opacity, custom typography and caret, and a liquid-glass makeover of the whole settings window. Prerequisite: DeepSeek Harness 0.2 kernel (including 0.2.0-rc.1/rc.2) and Node.js >=22.12.0. No version restriction on dsh-better-sidebar.",
  "type": "module",
  "engines": {
    "node": ">=22.12.0",
    "dsh": "^0.2.0-rc.1"
  },
  "main": "lib/index.js",
```

</details>

**依据 2 · 源码核查**：[package.json:143-151](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/package.json#L143-L151)

bundle 与 web 客户端配置。

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
```

**依据 3 · 作者声明**：[README.md:83-97](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/README.md#L83-L97)

不支持 Application、安装前提及多包发布说明。

<details>
<summary>查看原文（15行）</summary>

````text
Application（应用）类壁纸需要启动第三方程序，**不支持**，也不会进入壁纸库或轮播候选。

<h2 id="快速开始"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/section-start-dark.png"><img src="assets/readme/section-start-light.png" alt="快速开始" width="1440"></picture></h2>

前置：**Node.js >= 22.12.0**、**DSH 0.2 内核**（含 `0.2.0-rc.1/rc.2`）与 **pnpm**。安装前完全退出 DSH。

**npm（推荐）**

```sh
dsh plugin --profile web add dsh-plugin-wallpaper-engine
```

桌面端把 `web` 改为 `desktop`。

本仓按**多包发布集**发布：主包与同版本子包一起解析（具体包数、tarball 数与 `publishOrder` 见[发布说明](docs/RELEASING.md)，各版本变化见[变更记录](docs/CHANGELOG.md)）。
````

</details>

**依据 4 · 作者声明**：[README.md:121-126](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/README.md#L121-L126)

跨平台和 GPU 兼容限制。

```text
<h2 id="兼容与限制"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/section-compat-dark.png"><img src="assets/readme/section-compat-light.png" alt="兼容与限制" width="1440"></picture></h2>

- Windows / macOS / Linux 使用同一份源码；macOS 没有 WE 客户端，可上传图片 / 视频或指向 WE 项目目录。
- Scene 渲染依赖浏览器 WebGL 与显卡驱动，复杂工坊项目可能存在兼容差异；失败会逐级降级。
- 遮挡暂停、窗口失焦暂停与音频回环采集按平台适配；在线歌词默认关闭。
- 与其他皮肤 / 插件同时启用时，先看 [共存说明](docs/HOW-IT-WORKS.md#共存玻璃表面与其他-ui-插件)。
```

**依据 5 · 源码核查**：[lib/media/transcode.js:107-122](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/lib/media/transcode.js#L107-L122)

ffmpeg 缓存、固定 SHA256 与按平台资源。

<details>
<summary>查看原文（16行）</summary>

```text
  // ── Lazy ffmpeg provisioning (B + C + D) ─────────────────────────────────────
  // Resolution chain (each level falls through to the next):
  //   B. system PATH (bare name)                       ← last resort
  //   C. lazy download cache ~/.dsh-wallpaper-engine/ffmpeg/ffmpeg[.exe]
  //      (pinned single-file ffmpeg-static release asset, magic-byte + size
  //      verified, atomic rename; runs once per machine, then cached)
  //   env DSH_WE_FFMPEG  /  plugin-local ./ffmpeg/     ← explicit overrides
  // Downloaded binaries are pinned by sha256 (FFMPEG_STATIC_SHA256, computed from
  // the b6.0 release bytes) — a mismatch aborts before anything is executed; the
  // magic-byte + size checks remain as a second layer.
  const FFMPEG_STATIC_TAG = 'b6.0';
  // process.platform → process.arch → release asset name (ffmpeg-static naming).
  const FFMPEG_STATIC_ASSETS = {
    win32: { x64: 'ffmpeg-win32-x64', ia32: 'ffmpeg-win32-ia32' },
    linux: { x64: 'ffmpeg-linux-x64', ia32: 'ffmpeg-linux-ia32', arm: 'ffmpeg-linux-arm', arm64: 'ffmpeg-linux-arm64' },
    darwin: { x64: 'ffmpeg-darwin-x64', arm64: 'ffmpeg-darwin-arm64' },
```

</details>

**依据 6 · 作者声明**：[README.md:165-165](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/README.md#L165-L165)

作者提醒素材授权可能与代码不同。

```text
<p align="center"><sub>代码以 <a href="LICENSE">MIT License</a> 开源；壁纸、角色与字体素材的授权可能不同，再分发或商用前请核对 <a href="assets/readme/SOURCES.md">素材说明</a>。</sub></p>
```

#### 缺口

- 现金、性能和首次配置时间均未测；不把未知写作零。
  **影响**：结论限于固定源码与作者声明，不能推断真实运行效果。
  **进一步探讨**：先选小型可信媒体，核验依赖、授权和网络策略，再测设备资源。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些贡献成立，下一步假设如何推翻？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

本包的可归因增量是把本地壁纸发现、宿主媒体路径、持久化、图层和设置界面组合进 DSH；引擎、浏览器和素材并非自身独创。可提出未验证假设：在弱 GPU 上按媒体、页面可见性选择静态预览或动态层，可能降低资源消耗且保留外观。固定素材、设备和播放时长，比较现有降级/暂停与候选策略的 CPU、GPU、首帧、掉帧及用户可接受度；若开销无改善或画面体验明显变差，则否定该假设。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:170-200](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/lib/index.js#L170-L200)

宿主服务接入。

<details>
<summary>查看原文（31行）</summary>

```text
 * concurrently and the webserver may not exist yet, which would silently skip
 * route registration and let the SPA fallback answer every request. This bundle
 * is web-only (its dsh.client declares platform "web"), so a hard injection is
 * correct; it is simply not added to headless/TUI profiles.
 */
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
```

</details>

**依据 2 · 源码核查**：[src/client.js:5918-5945](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/src/client.js#L5918-L5945)

选择状态接至图层。

<details>
<summary>查看原文（28行）</summary>

```text
function apply(ctx) {
  // 0. i18n：把插件文案接上宿主的 locale 服务（`ctx.get("locale")`，可选服务 + 短轮询 ——
  //    缺服务时静默停在默认语言，见 src/i18n.js）。放在最前面：界面首次渲染就要按当前
  //    语言取词；服务通常已在（dsh-web-app 的 base bundle 自带），轮询只是兜底。
  if (ctx.effect) ctx.effect(() => weI18nAttach(ctx) || undefined);

  // 0b. 启动预取：inventory / 字体集清单与设置无关，启动链却要等 settings 之后才发。
  //     在这里先发出去，链走到它们时通常已经回来（只预取一次；失败不影响启动链）。
  try {
    prefetchInventoryOnce();
    prefetchFontSetList();
  } catch { /* 预取失败走原路径（启动链各步自己会发请求） */ }

  // 1. Mount the behind-body wallpaper + scrim layers and keep them in sync
  //    with the selection store. ctx.effect gives fiber-lifetime cleanup.
  if (ctx.effect) {
    ctx.effect(() => {
      const unsub = subscribe(syncLayers);
      const unsubEffects = subscribe(applyEffects);
      // 「扩展」页签的那几层（P-A 起统一走注册表）：接法与壁纸层同形 —— 每次 emit 重判一次
      // "该不该活"。三层各自的性质不同（画布层内容驱动、视差层收敛驱动、头像层改宿主 DOM），
      // 但**接法只有一个**：注册表说有哪些层，这里就 subscribe 谁的 sync；参数不在这里传，
      // 每一层自己每帧现读 `selection`。三项里两项住在自己的包里，本 bundle 的作用域里
      // 根本没有它们的函数名 —— 这正是这张注册表存在的理由。
      const layerUnsubs = new Map();
      const attachLayer = (layerId, hooks) => {
        if (layerUnsubs.has(layerId)) return;
        layerUnsubs.set(layerId, subscribe(hooks.sync));
```

</details>

**依据 3 · 源码核查**：[src/live-layer-watch.js:304-317](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/src/live-layer-watch.js#L304-L317)

已有加载失败判定，新增策略不可冒充现成功能。

<details>
<summary>查看原文（14行）</summary>

```text
    if (!frame.isConnected) { liveLog("watch-stop", "iframe 已从文档移除", "info", true); stopLiveWatch(); return; }
    // 先读统计、后下发控制：虽然 applyLiveControls 已去重（只在变化时
    // resume/pause），保持这个顺序让读数不受任何控制调用的副作用影响。
    const stats = liveStats(frame);
    applyLiveControls(frame);
    const isWeb = selection.type === "web";
    const wstate = isWeb ? liveStateOf(frame) : null;
    const alive = liveHeartbeatAlive(frame, stats, wstate, isWeb);
    // 渲染页明确记录了 iframe 加载错误 → 立即降级，不必等 15 秒超时。
    if (isWeb && wstate && wstate.iframeLoaded === false && wstate.webError) {
      liveFail("load");
      return;
    }
    liveLog("tick", () => liveStateBrief("fps=" + (stats ? Math.round(stats.fps * 10) / 10 : "null")
```

</details>

**依据 4 · 作者声明**：[README.md:121-125](https://github.com/elysia395/dsh-wallpaper-engine/blob/42459ec505aedfe0bc0a6f76b52132f8b2cf9224/README.md#L121-L125)

作者说明 Scene 降级与平台暂停能力。

```text
<h2 id="兼容与限制"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/section-compat-dark.png"><img src="assets/readme/section-compat-light.png" alt="兼容与限制" width="1440"></picture></h2>

- Windows / macOS / Linux 使用同一份源码；macOS 没有 WE 客户端，可上传图片 / 视频或指向 WE 项目目录。
- Scene 渲染依赖浏览器 WebGL 与显卡驱动，复杂工坊项目可能存在兼容差异；失败会逐级降级。
- 遮挡暂停、窗口失焦暂停与音频回环采集按平台适配；在线歌词默认关闭。
```

#### 缺口

- 没有相邻方案、真实环境与用户实验。
  **影响**：结论限于固定源码与作者声明，不能推断真实运行效果。
  **进一步探讨**：按同一媒体集合完成盲测与性能比较，保留失败案例。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
