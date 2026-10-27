# DSH Wallpaper Engine

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[7ba44b2](https://github.com/elysia395/dsh-wallpaper-engine/tree/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3)

<!-- BEGIN META -->
[![GitHub ★ 3,022](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C022&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/elysia395/dsh-wallpaper-engine) [![npm 30d 81,334](https://img.shields.io/static/v1?label=npm+30d&message=81%2C334&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-wallpaper-engine) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-wallpaper-engine)
<!-- END META -->

> **实现功能**：把本地图片、视频及 Wallpaper Engine 场景和网页壁纸接入 DSH Web 界面。

> **核心亮点**：相对单张CSS背景，把本地Scene/Web/Video组织为DSH内可配置和切换的背景流程；WebWallGL与七子包贡献归各自实现。见[Q01](#research-q01)。

> **风险与缺陷**：源码根包不等于完整八包发行集，复杂壁纸的播放成功也不证明前台可读性与资源开销可接受。见[Q03](#research-q03)。

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
  - [Q01 · 谁需要将本地壁纸放进 DSH，根包交付什么？](#detail-section-11)
  - [Q02 · 根入口怎样连接扫描、媒体读取和前端渲染？](#detail-section-12)
  - [Q03 · 多包安装与网页内容带来什么关键限制？](#detail-section-13)
  - [Q04 · 资源投入和失败恢复是否支撑受控试用？](#detail-section-14)
  - [Q05 · 如何检验多媒体复杂度是否值得？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有本地壁纸资源的个人DSH用户，可把可信内容作为聊天背景并管理切换。

单张CSS背景或继续使用桌面壁纸软件是简单替代；对只需要静态图的人，多类型引擎未证明更值得。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 壁纸清单和选择 | 整理本地图片/视频/WE资源 | 内容可信；Application不执行 |
| 背景播放和切换 | 准备后交接媒体 | 特定类型依WebWallGL及平台工具 |
| 上传及设置 | 持久自定义资源与配置 | 预设可能覆盖资产，应先备份 |
| 七子包接线 | 加载字体/特效等独立扩展 | 不是根包独立能力；需完整发布集 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 0.2内核、webServer、客户端 | 必需 | 路由与界面 | TUI不加载，需核实际内核 |
| Node >=22.12及完整八包 | 必需 | 主/子包接线 | 解析失败，不能只装开发主包 |
| 可信本地媒体 | 本次试用必需 | 限制内容风险 | 不据沙箱声明放行任意网页 |
| WebWallGL/平台媒体工具 | 特定类型必需 | Scene与派生媒体 | 对应类型不可用，退回静态图 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份profile/资产，核内核及完整发布集 | 八包和客户端与版本可追溯 |
| 加载 | 用户退出宿主后安装并重启 | 主子行解析与壁纸设置出现 |
| 试用 | 用户先选可信图片/小视频 | 背景显示、输入可读且资源可接受 |
| 恢复 | 用户停止异常行并重启 | 回原生界面，必要时恢复备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 八包与客户端构建/下载资源；金额未知 | 核profile、退出宿主、安装与重启；工时未知 | 发布集完整性需核 |
| 持续使用 | GPU/解码/转码/缓存；量与金额未知 | 配置媒体、保证可读性 | 资源预算未测 |
| 失败恢复 | 重取媒体/恢复存储；金额未知 | 停用行、核目录、恢复profile及资产 | 预设覆盖与跨卷失败须人工核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| DSH背景集成 | Host媒体路由、bundle和客户端 | 多宿主真实兼容 |
| 切换准备 | poster或当前帧就绪再交接 | 黑屏率与端到端延迟 |
| 用户价值 | 统一背景设置流程 | 可读性、任务表现和净资源代价 |

> **思考**：源码根包不等于完整八包发行集，复杂壁纸的播放成功也不证明前台可读性与资源开销可接受。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对单张CSS背景，把本地Scene/Web/Video组织为DSH内可配置和切换的背景流程；WebWallGL与七子包贡献归各自实现。见[Q01](#research-q01)。

相对单张CSS背景，把本地Scene/Web/Video组织为DSH内可配置和切换的背景流程；WebWallGL与七子包贡献归各自实现。见[Q01](#research-q01)。

先登记teardown再注册路由、显式deps与媒体token同作用域值得参考，移植需理解Cordis fiber和宿主媒体隔离。双侧子包解析能暴露开发/宿主依赖脱节，但强耦合八包发布带来运维负担，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

源码根包不等于完整八包发行集，复杂壁纸的播放成功也不证明前台可读性与资源开销可接受。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有profile恢复经验的个人用户可在临时环境从可信静态图和小视频开始；复杂动态内容和发布集需先核对。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核心接线和资源生命周期有源码支持，分发完整性与真实兼容未验；前台任务预算闭环为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/media-origin.js、lib/routes/scene-serve.js、lib/routes/upload.js、lib/fs-paths.js、src/video-layer.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮检查根包关键接线、媒体生命周期和分发条件，未对七子包逐一研究或执行测试、安装、宿主。
- 下一步：在临时profile分类型核加载、切换、停用与恢复，记录前台输入延迟、可读性和资源峰值；不得把作者旧演示或注释性能数值当作本版本独立验收。

**分析版本**

- **仓库**：[elysia395/dsh-wallpaper-engine](https://github.com/elysia395/dsh-wallpaper-engine)
- **版本号**：1.4.0（[固定提交 7ba44b2](https://github.com/elysia395/dsh-wallpaper-engine/tree/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是以输入延迟和可读性预算放行动态背景，超预算回退静态图；同任务多档对照无改善则停止。见[Q05](#research-q05)。

在临时profile分类型核加载、切换、停用与恢复，记录前台输入延迟、可读性和资源峰值；不得把作者旧演示或注释性能数值当作本版本独立验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 87 | 25582 | — | — | 650415 |
| .cjs | source | 2 | 341 | 324 | 1 | — |
| .mjs | source | 11 | 2814 | 1615 | 1087 | — |
| .js | source | 166 | 53324 | 32625 | 19929 | — |
| .mjs | test | 149 | 77240 | 55696 | 19011 | — |

</details>

**活跃度**

[![Issue 未关闭 45](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=45&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 96](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=96&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+created%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z)

暂未获取：近30天关闭。

统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根包壁纸集成相对简单背景的贡献、多包分发与资源代价

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要将本地壁纸放进 DSH，根包交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用人群是已经有本地图片、视频或Wallpaper Engine资源，希望在DSH聊天界面持续使用这些背景的个人用户。合格结果是壁纸能加载、切换与暂停，文字和操作仍可辨认；它不直接改善模型回答或软件交付。根包提供宿主扫描/媒体路由、设置和客户端壁纸层，并通过bundle管理七个独立子包。相对桌面壁纸软件或一张CSS背景图，其增量是把Scene/Web/Video资源整合到DSH界面、持久设置与准备后切换；前者只改变桌面而非聊天内部，后者更简单且对静态图片需求可能足够。WebWallGL是显式依赖，不能把其场景渲染算法归为插件原创；字体、特效等子包能力也不能全算根包独立实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:126-132](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/README.md#L126-L132)

作者列出壁纸类型及Application不支持

```text

| 类型 | 在 DSH 中的路径 | 支持情况 |
|---|---|---|
| **Scene（场景）** | 内置 WebWallGL 实时 WebGL 渲染；失败按降级链回退 | 支持，不需要 WE 在后台运行 |
| **Web（网页）** | 网页挂载、WE API 注入与沙箱隔离 | 支持；效果取决于网页及浏览器能力 |
| **Video（视频）** | 浏览器播放，配合转码、帧率上限与暂停控制 | 支持 |
| **Application（应用）** | 需要启动第三方可执行程序 | **不支持**，不进入壁纸库与轮播候选 |
```

**依据 2 · 源码核查**：[package.json:159-169](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/package.json#L159-L169)

bundle与web客户端清单

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:106-109](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/lib/index.js#L106-L109)

组件实现从真实子包导入

```text
import { applyImpl as applyAboutNoticeImpl } from 'dsh-plugin-wallpaper-engine-about-notice';
import { applyImpl as applyMascotAvatarImpl } from 'dsh-plugin-wallpaper-engine-mascot-avatar';
// 第三件组件（媒体桥入包）：路由族、后端实现与 macOS 音频 tap 源码随包走 ⇒ 门面只剩分发点。
import { applyImpl as applyMediaBridgeImpl } from 'dsh-plugin-wallpaper-engine-media-bridge';
```

**依据 4 · 作者声明**：[README.md:206-212](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/README.md#L206-L212)

筛选、轮播及准备后切换的用户流程

```text
### 壁纸库与自动轮播

- **筛选**：按内容分级与类型过滤；筛选同时作用于库视图与轮播候选。
- **隐藏 / 恢复**：只改变列表，不删除源文件。支持批量隐藏与恢复；隐藏当前壁纸不会中断播放。
- **自动轮播**：创建列表，选择壁纸并设置间隔与顺序 / 随机播放。至少需要两张可播放壁纸。
- **准备后切换**：下一张准备完成后再交接；失败候选自动跳过。可选择硬切、淡化、推移等过场，系统「减少动态效果」开启时使用硬切。
- **壁纸属性**：Scene / Web 壁纸可显示作者定义的颜色、开关、滑块等属性，按壁纸保存，并可恢复默认。
```

#### 缺口

- 持续美化需求和可读性改善缺少独立用户证据
  **影响**：不能由功能广度推断生产率或普遍采用价值
  **进一步探讨**：在同一对话任务比较原生背景与壁纸模式的可读性、分心和持续使用意愿

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 根入口怎样连接扫描、媒体读取和前端渲染？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

host强依赖webServer，apply先提供跨包wallpaperEngineHost服务，读取patch并分别检查仓库和宿主profile的子包解析，再创建会话套件。teardown在注册任何路由前交给宿主，避免后续注册失败留下半装载残留；这是一项可借鉴的资源所有权安排。之后注册inventory、派生媒体、媒体字节、场景服务、上传与设置等路由，各族通过显式deps消费共享句柄。媒体源工厂将token与清单保持同作用域，桌面形态或大场景可懒起独立loopback源；其实现意图是避免宿主能力头挡住不透明源网页，并减少大场景传输瓶颈。浏览器视频通道以真正poster已到或HAVE_CURRENT_DATA为就绪判据，避免仅设置URL便交接。该组合把“选择”与“可播放”分开，但作者注释中的带宽和首帧数字不是本轮实测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:194-255](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/lib/index.js#L194-L255)

服务提供、双侧子包检查、先交teardown再注册

<details>
<summary>查看原文（62行）</summary>

```text
export const inject = ['webServer'];

export function apply(ctx) {
  const webServer = ctx.webServer;
  if (!webServer || typeof webServer.register !== 'function') {
    return () => {}; // defensive: never expected in practice
  }

  // 0a. 跨包服务面（BUNDLE-SPLIT §5.1 ①，P-A 的 B 方案）─────────────────────────
  // 子包宿主半边 `export const inject = ['wallpaperEngineHost']`，靠这一个服务拿到
  // 冻结键集 / 拆卸交接 / 纯符号面；`provide` 由 cordis 记在**主包自己的 fiber** 上，
  // 主包一卸服务即撤销 ⇒ 子包 fiber 随之 park（D-13 B「关主包 = 关整族」的物理基础）。
  // 判据：test/verify-subpackage-purity.mjs（子包半边零主包说明符 + inject 名逐字对账）。
  provideSubpackageHost(ctx);

  // 0b. 子包启动自检（BUNDLE-SPLIT §7.6①，P-A）──────────────────────────────────
  // 为什么要有这一段：宿主对**行级**失败是静默的（§4.1 I5 —— Loader 只把那一行记成
  // failed，主包照常起来），而"子包行解析不到"的后果恰好是浏览器半边**静默消失**：
  // 用户的界面少一块，终端里却没有指向原因的报错。所以这里按 patch 里**净新增的子包行**
  // 自己 resolve 一遍，解析不到就抛（大声失败），错误消息带包名与行 id。
  // **两条腿缺一不可**（2026-10-16 真机事故：三条组件行 `failed to import`，主包却报通过）：
  //   ① 仓库腿 —— 解析根 = 本仓 `node_modules`（开发期 `file:` 自链、发布期主包自己的依赖树），
  //      发现的是"patch 行与主包 manifest 脱节"；
  //   ② 宿主腿 —— 解析根 = **每个会装载本主包的 profile** 的 `cordis.yml` 旁（§8.1 spike：
  //      本版 `boot()` 只传 4 实参 ⇒ `bareModuleBaseUrl` 恒 undefined ⇒ 宿主恒按裸包名从
  //      profile 根解析行名），发现的是①结构性看不见的"仓库里在、profile 侧缺链接"。
  // 判据：test/verify-subpackage-boot.mjs（硬档；它同时钉住"静默实现必须判红"与两条腿的顺序）。
  const rootManifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const subpackageRows = subpackageSpecifiers(
    readFileSync(new URL('../cordis.patch.yml', import.meta.url), 'utf8'), rootManifest.name);
  assertSubpackagesResolvable(subpackageRows, (name) => {
    try { return createRequire(import.meta.url).resolve(name); } catch { return null; }
  });
  assertSubpackagesResolvableInHost(subpackageRows, { mainName: rootManifest.name });

  // 会话段（版本戳 / 日志与提示 / token 表 / faststart / 启动清扫 / 字节出站 / 媒体源 /
  // 清单构建 ＋ teardown）由 lib/kernel/host-session.js 一次建好；这里只解构出注册要用的
  // 名字（顶格声明 ⇒ test/tools/host-route-index.mjs 的 `applyScope` 仍能把它们列进依赖）。
  const { log, notice, mediaMap, tokenFor, serveFile, serveLayout, handleSceneFiles,
    faststartVariant, pinnedFaststartVariant, trackStream, disposers, mediaOriginApi,
    buildInventory, SCENE_VIDEO_INFLIGHT, dispose } = createHostSession(hostKernel, { base: BASE, ctx });

  // R-1（BUNDLE-SPLIT §13.1）：teardown 的交接**必须先于任何一次注册**。
  // 为什么不能像原来那样留在本函数最后一行：`apply` 中间任何一处抛错（最现实的是上一次装载
  // 残留导致的 `webserver: duplicate … route`）都会让最后一行**永不执行** ⇒ `ctx.effect` 从未
  // 登记 ⇒ fiber 卸载时 `dispose()` 不跑 ⇒ 前面各族**已经注册成功**的路由留在宿主路由表里
  // ⇒ 下一次启用继续撞重复路由，插件直到进程重启都起不来（半装载残留，正是 R-1 要消灭的形态）。
  // 为什么「先登记」就够、不必在这里再包 `try/catch`：cordis 的 `Fiber._reload()` 捕获 `apply`
  // 抛出的错后把 epoch 打回 `INACTIVE`，随即转入 `_unload()`，而那条路径 `clear()` 并逐条执行
  // `_disposables` ⇒ **抛错前登记的 effect 一定被回滚**（`handOffTeardown()` 已包 `once`，
  // 将来两条通道若同时被收也只真跑一次 —— 见 lib/host-boot.js 的 JSDoc）。
  // 为什么位置选在 `createHostSession()` **之后**：注册顺序仍排在会话自己的 effect 之后 ⇒
  // 卸载时反序执行的**顺序逐字不变**（本 teardown 仍最先跑）；成功路径的返回值仍是同一个
  // `once` 包装（函数末尾原样交回直调方）。
  // 判据 test/verify-bundle-rows.mjs ⑧c（apply 实测向 `ctx.effect` 交 1 个 teardown）。
  const teardown = handOffTeardown(ctx, dispose);

  // 1. Inventory JSON → lib/routes/inventory.js（路径/头/状态码/错误文案逐字未变）。
  //    `componentsProbe` 是**只读**行状态面（与 3c-6 的 /diag-log 同一个探针、同一批账）：
  //    浏览器半边按它在 `/inventory` 里的 `components` 字段决定"该组件的界面渲不渲染"
  //    （ADR-0013 D3 的状态面；形状与失效口径写在那个族的文件头）。
  registerInventoryRoutes(webServer, {
```

</details>

**依据 2 · 源码核查**：[lib/media-origin.js:68-89](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/lib/media-origin.js#L68-L89)

独立媒体源解决桌面不透明源与宿主能力头冲突的设计

<details>
<summary>查看原文（22行）</summary>

```text
  /** 网页壁纸载荷要不要走独立媒体源。`/media-origin` 是显式探测，不经这条。 */
  function mediaOriginNeeded() {
    if (adapterOverride === 'browser') return false;  // 手选浏览器：显式走应用源
    if (adapterOverride !== 'auto') return true;      // 手选桌面：恒走独立源
    return adapterFenceSeen || adapterShellSeen;      // 自动：观测到桌面形态才需要
  }

  // 3c-3a. 壁纸媒体源：独立 loopback 监听（壁纸载荷的落点）。
  //
  // 为什么需要第二个源 —— DSH Desktop 给**每一个**插件路由套了能力头栅栏
  //（desktop-browser-access 分片 → decideDesktopBrowserAccess：请求必须带
  // x-dsh-desktop-renderer，而该头只由 Electron 主进程注入给「frame.origin === 应用源
  // 且顶层 frame 同源」的请求）。网页壁纸按设计必须跑在 sandbox="allow-scripts" 的
  // 不透明源里：它的 frame.origin 是 "null"，永远拿不到这个头 —— 于是入口 HTML 一律
  // 403 Forbidden，服务端连一行请求日志都不会有（表现为预览图先正常、随后整块黑掉）。
  // 增强模式下普通浏览器访问也不可用（desktopBrowserAccessAvailable 只认兼容模式），
  // 唯一干净的出路是让壁纸载荷根本不经过宿主插件路由：我们自己在 127.0.0.1 上再监听
  // 一个随机端口，只服务 /scene-files/<token>/…，行为与同源那条完全一致（同一段处理
  // 函数：两层目录围栏 / CORS / shim+seed 注入 / Range）。顺带的好处是第三方 HTML 连
  // 「同源」都不再沾边，沙箱之外又多一层隔离。
  // **场景壁纸也走这条**：100–336MB 的 `scene.pkg` 走应用源那条路挤不过
  // 首帧预算（15 秒里还要买纹理解码与 shader 编译），把它的载荷也指向自建源即可。
```

</details>

**依据 3 · 源码核查**：[src/video-layer.js:181-185](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/src/video-layer.js#L181-L185)

真实画面就绪判据

```text
function videoContentReady(video) {
  if (!video) return true;
  const hasPoster = !!(video.getAttribute && video.getAttribute("poster"));
  if (hasPoster && video.__wePosterReady === true) return true; // 海报真到了 ⇒ 屏上有图
  if (Number(video.readyState) >= 2) return true;              // HAVE_CURRENT_DATA = 手上有帧
```

#### 缺口

- 多种宿主/媒体类型的同版本运行结果缺失
  **影响**：无法确认各路由和切换路径在目标环境兼容
  **进一步探讨**：在临时profile逐一核对静态图、视频、可信Web和Scene，保存首帧、切换及禁用结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多包安装与网页内容带来什么关键限制？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

当前根package的七个内部包位于devDependencies的file路径，而作者声明发布集会将真实精确版本转换为运行依赖，必须先发布子包再发布主包；所以源码根npm pack不等同完整可安装发行物。源码路径要构建所有客户端、登记八个持久link并保留源码目录，宿主必须先退出再重启。README安装指引还链接Fish-under-sea分支，与当前研究仓库不同，这属于需核对的分发依据，不能直接把目录版本和远端发行物同一化。运行时依赖DSH 0.2内核、Node和webServer；Scene依赖WebWallGL，某些媒体转码/系统联动另有平台条件。网页壁纸有脚本执行能力，独立媒体源和sandbox设计减少与应用同源接触，并不证明任意第三方内容安全。上传路由核方法、类型和大小/流式生命周期，目录与资产访问亦需边界；本轮未全面审计所有路由或宿主授权，故仅限可信本机内容。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:211-227](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/package.json#L211-L227)

外部WebWallGL与内部file开发依赖

<details>
<summary>查看原文（17行）</summary>

```text
  "dependencies": {
    "webwallgl": "^3.0.0",
    "x11": "^4.3.1"
  },
  "overrides": {
    "js-yaml": "4.3.2"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/node": "^26.6.5",
    "dsh-plugin-wallpaper-engine-about-notice": "file:packages/about-notice",
    "dsh-plugin-wallpaper-engine-fonts": "file:packages/fonts",
    "dsh-plugin-wallpaper-engine-fx": "file:packages/fx",
    "dsh-plugin-wallpaper-engine-mascot-avatar": "file:packages/mascot-avatar",
    "dsh-plugin-wallpaper-engine-media-bridge": "file:packages/media-bridge",
    "dsh-plugin-wallpaper-engine-parallax": "file:packages/parallax",
    "dsh-plugin-wallpaper-engine-pet-link": "file:packages/pet-link",
```

</details>

**依据 2 · 作者声明**：[README.md:139-165](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/README.md#L139-L165)

源码八包持久link、发行集转换与主包最后发布

<details>
<summary>查看原文（27行）</summary>

````text
`1.4.0` 已发布到 npm（推荐直接用下面的 [npm 通道](#npm-通道仅适用于整套包已发布的版本)）。想拿**本分支最新、尚未发版的改动**，才需要走源码部署 —— 那条路只能从 GitHub 取源码。

要求 **Node.js >=22.12.0、DSH 0.2 内核（包含 0.2.0-rc.1/rc.2）**，并已安装可用的 DSH CLI 和 pnpm。桌面应用外部版本号不等于内核版本。下载 [本轮评审分支 `official-pet-bridge-20261020`](https://github.com/Fish-under-sea/dsh-wallpaper-engine/tree/official-pet-bridge-20261020) 的完整 ZIP，或克隆该分支，不要用 Fork 默认分支代替；进入包含 `package.json` 的目录。先完全退出目标 DSH 应用，然后执行：

```sh
node scripts/install-source.mjs --profile desktop --dsh-home "<目标 DSH 数据目录>" --app-closed
```

网页宿主把 `desktop` 改为 `web`。数据目录应从目标宿主环境确认，不要假定始终是 `~/.dsh`。先加 `--dry-run` 可核对目标和八条链接。**桌面 profile 必须使用桌面宿主安装的 carrier CLI**；独立 npm 安装的 `dsh` 不允许管理 `desktop`，不能把它当成桌面 CLI。网页版若 `dsh` 不在 PATH，可使用 `--dsh-cli "<DSH CLI 的 lib/bin.js 路径>"`。

脚本会安装仓库依赖、构建所有客户端，并通过 DSH 将**主包和 7 个子包**登记成目标 profile 的持久 `link:` 依赖。只保留主包的 bundle 选择，防止子包自带 patch 重复插入同一组行；现有行级开关和其他 bundle 选择不变。之后重启目标宿主。

更新时先退出宿主，再更新整个源码目录并重跑同一命令。安装完成后不要删除或移动源码目录。不要只安装主包，不要用裸 `github:` 直装，也不要只运行临时子包链接工具。

### npm 通道（`1.4.0` 起可用）

正式发布者必须先运行 `npm run pack:release`，生成含构建产物的八个 tarball，并按生成清单先发布子包、最后发布主包。主包发布清单以七个子包的**真实精确版本**声明运行依赖，不包含 pet 或 Electron。单独在源码根目录执行 `npm pack` 得到的开发形态主包不能代表完整发布集。

子包没发全时，主包在用户机器上会以 `ERR_PNPM_FETCH_404` 失败并回滚——"只拿到母包"就是这个形态。发布顺序、GitHub Release 的八件套资产、发布后自证与回滚办法见 **[`docs/RELEASING.md`](docs/RELEASING.md)**；离线安装发布集用 `npm run install:release -- --set <目录> --profile <name> --dsh-home <目录> --app-closed`。

**自 `1.4.0` 起**，直接执行（一条命令即装齐八个包，主包会把七个子包按精确版本解析下来）：

```sh
dsh plugin --profile web add dsh-plugin-wallpaper-engine
```

桌面宿主将 `web` 改为 `desktop`，安装前完全退出，完成后重启。不要单独启用子包 bundle；整组行由主包 patch 管理。源码部署和发布说明见 [贡献指南](CONTRIBUTING.md)。
````

</details>

**依据 3 · 源码核查**：[lib/routes/scene-serve.js:91-110](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/lib/routes/scene-serve.js#L91-L110)

场景静态目录前缀围栏

<details>
<summary>查看原文（20行）</summary>

```text
      const method = (req.method || 'GET').toUpperCase();
      if (method !== 'GET' && method !== 'HEAD') { res.statusCode = 405; res.end('method not allowed'); return; }
      let rest;
      try {
        rest = decodeURIComponent(new URL(req.url || '/', 'http://x').pathname.slice(`${BASE}/scene-live`.length));
      } catch {
        res.statusCode = 400; res.end('bad request'); return;
      }
      rest = rest.replace(/^\/+/, '');
      if (!rest || rest.endsWith('/')) rest += 'index.html';
      const isEngine = rest.startsWith(ENGINE_PREFIX);
      if (isEngine && !WEBWALLGL_PKG_DIR) {
        log.warn('scene-live engine missing: npm dependency `webwallgl` is not installed');
        res.setHeader('Cache-Control', 'no-store');
        res.statusCode = 404; res.end('webwallgl-not-installed'); return;
      }
      const rootDir = isEngine ? WEBWALLGL_PKG_DIR : WEBWALLGL_DIR;
      const abs = resolve(rootDir, isEngine ? rest.slice(ENGINE_PREFIX.length) : rest);
      // Directory fence: nothing outside the page tree / the engine package is ever served.
      if (abs === rootDir || !abs.startsWith(rootDir + sep)) {
```

</details>

**依据 4 · 源码核查**：[lib/routes/upload.js:74-90](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/lib/routes/upload.js#L74-L90)

上传方法和内容类型检查

<details>
<summary>查看原文（17行）</summary>

```text
    path: `${BASE}/upload`,
    handler: (req, res) => {
      const method = (req.method || 'GET').toUpperCase();
      if (method !== 'POST') {
        res.statusCode = 405; res.end('method not allowed'); return;
      }
      const query = new URL(req.url || '/', 'http://x').searchParams;
      const title = (query.get('title') || '').trim().slice(0, 80);
      const ctype = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
      const ext = UPLOAD_EXT[ctype];
      if (!ext) {
        res.statusCode = 415;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({
          error: '不支持的格式：' + ctype + '（仅支持 JPG / PNG / MP4）',
        }));
        return;
```

</details>

#### 缺口

- 当前发布集的八包完整性及与此提交绑定未独立核实
  **影响**：无法把源码可见性当作普通用户可安装保证
  **进一步探讨**：只接受可回溯此版本且包含精确七包依赖和客户端产物的发布集，先在临时profile验收

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 资源投入和失败恢复是否支撑受控试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次采用除了下载构建，还需确认profile、carrier CLI及八包解析，已有用户必须备份配置和自定义资产；持续播放会消耗GPU、视频解码、存储和可选转码资源，不能从装饰功能推断资源轻。设置存在帧率/暂停、隐藏和清除当前壁纸等退路，但预设可能覆盖或清除自定义资产，不能把所有操作当纯显示切换。上传有临时文件、哈希去重、背压和中断清理设计；跨卷移动用rename失败后copy+unlink，返回false时需要核原/目标位置，不可推断完全事务。对已有部署经验且能恢复profile的个人用户，可信静态图/小视频构成可控试用；初学者直接导入复杂Web/Scene或在唯一工作profile启用整套配置不合适。壁纸黑屏、聊天可读性下降、CPU/GPU持续异常或设置覆盖不符时，应停用行并回到原生界面，恢复备份；现金、耗时和单位使用成本没有对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:167-174](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/README.md#L167-L174)

行级启停需要重载/重启，媒体联动退出语义例外

```text
### 插件行与启停

插件管理器中的主包、关于、吉祥物与头像、媒体联动、桌宠联动、特效、视差和字体分别由对应行管理。**行级开关需要重新加载或重启对应宿主，不是即时切换**。

- 关于、吉祥物与头像行停用后，相应宿主能力及浏览器区块一起退出；不会隐藏无关的整个设置页签。
- 特效、视差和字体由各自子包提供；桌宠联动可独立停用，不影响壁纸主体。
- 媒体联动行是例外：停用会撤下媒体路由，当前没有与其他组件完全相同的界面整块隐藏语义。
- 主包关闭后不再提供整套壁纸界面。各行以插件管理器和 [行清单](cordis.patch.yml) 为准。
```

**依据 2 · 作者声明**：[README.md:224-228](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/README.md#L224-L228)

主题跟随与预设覆盖资产条件

```text
- **主题随壁纸默认关闭**。开启后才按作者配色与画面取色切换深浅主题；本张壁纸下手动改过主题后，自动切换会让位。
- 字体支持按角色 / 组件细调、系统字体枚举与字体集管理。终端里的 Nerd Font 图标需要对应字体。
- 「主题预设」保存的是整套配置，不只是玻璃参数。导入只加入列表，不立即应用；分享时可选择携带字体、吉祥物和头像。
- **预设可以携带深浅偏好**：「作者自用」声明深色，套用它会把界面一并切到深色（与「主题随壁纸」是两条独立通道）。全新安装默认套用「作者自用」+ 深色，不再弹窗询问；已有存档的用户一概不受影响。
- **套用预设前注意覆盖范围**：预设可能更换或清除自定义资产。保存、导出与套用前，阅读对应确认提示。
```

**依据 3 · 源码核查**：[lib/fs-paths.js:58-70](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/lib/fs-paths.js#L58-L70)

跨卷复制删除及失败false

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * 移动文件；跨卷时回落到「复制 + 删除」（Windows 上 C: → D: 就是用户实际会踩的那条）。
 * @param {string} src
 * @param {string} dst
 * @returns {Promise<boolean>} 成功 true / 失败 false（不抛）
 */
export async function moveFileP(src, dst) {
  try { await renameP(src, dst); return true; } catch { /* 跨卷 */ }
  try {
    await copyFileP(src, dst);
    await unlinkP(src);
    return true;
  } catch { return false; }
```

</details>

**依据 4 · 源码核查**：[lib/routes/upload.js:35-49](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/lib/routes/upload.js#L35-L49)

临时文件、断连清理与背压约束

<details>
<summary>查看原文（15行）</summary>

```text
 *   · **上传目录是跨族共享的可变量**：本模块一律经上面那些模块级助手读写它，**不得**缓存目录值的
 *     副本 —— `setUploadDir` 会重新赋值它，缓存副本会让"改了目录却仍写回老目录"静默发生。
 *   · **流式落盘**：边收边写 `.tmp`、边更新 sha256，完成后 rename 发布。**不得**把上限 512MB 的
 *     请求体整个缓冲在内存里；`.tmp` 与目标同目录，rename 才是同设备原子操作。
 *   · **中途断开必须清理**：上传中途关标签页 / 断网不会走 `req 'end'` / `'error'` / 超时
 *     ⇒ `req 'close'` 里必须销毁写流并清 `.tmp`，否则上传目录里留下一个打开的文件描述符与
 *     最多 512MB 的 `.tmp`（启动清扫只看 transcode / ffmpeg / preview 目录，不扫 uploads）。
 *     而 `completed` 置位后**不得**再销毁写流 —— 否则发布回调不执行，文件永远停在 `.tmp`。
 *   · **内容去重**：同 sha256 的重复上传返回既有条目（`duplicate: true`）并丢弃刚收的临时文件；
 *     meta 的 sha256 **无条件写**（没有 title 也要写），否则去重比对不到哈希、形同虚设。
 *   · **背压**：`ws.write` 返回 false ⇒ `req.pause()`，`'drain'` 后恢复。
 *   · `armBodyIdleTimeout` 60s 无数据 ⇒ 408（客户端连上不发数据不得永久占住 socket）。
 *   · `/remove` 只删 uploads 目录内、`up-…` 形状的 id：`resolveUploadFile` 复检规范化后的前缀
 *     ⇒ 路径穿越不可能（id 由宿主生成，不接受调用方给的路径）。
 *   · `/upload-dir` 只接受**绝对路径**（`normalizeUserDir`），且该路径必须能解析成目录
```

</details>

#### 缺口

- 全周期资源与配置恢复未实测
  **影响**：不支持持续安装或低成本结论
  **进一步探讨**：在备份的临时profile记录首次配置、连续播放和恢复原生界面的耗时与资源峰值

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验多媒体复杂度是否值得？

**研究主题**：新假设与验证

#### 完整回答

由准备后切换与真实画面就绪判据可推导未验证假设：把用户的可读性和前台任务预算作为壁纸放行条件，而不是只问媒体是否已就绪。先提供可信静态图、小视频和Scene三个固定档位，在同一聊天任务下比较首帧、输入延迟、掉帧及用户可读性；当资源超过用户预设或可读性下降时回退静态图。增量在将背景体验的成功定义从“能渲染”改为“不妨碍前台任务”，新增负担是采样与偏好配置。若静态图已满足用户，或者预算控制带来明显闪烁/额外配置而不能减少前台干扰，就否定作为默认机制的必要性。现有暂停/帧率能力只是推导材料，不代表已实现该任务预算闭环。

#### 证据与依据

**依据 1 · 源码核查**：[src/video-layer.js:181-185](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/src/video-layer.js#L181-L185)

已有就绪门槛是媒体层指标

```text
function videoContentReady(video) {
  if (!video) return true;
  const hasPoster = !!(video.getAttribute && video.getAttribute("poster"));
  if (hasPoster && video.__wePosterReady === true) return true; // 海报真到了 ⇒ 屏上有图
  if (Number(video.readyState) >= 2) return true;              // HAVE_CURRENT_DATA = 手上有帧
```

**依据 2 · 作者声明**：[README.md:206-212](https://github.com/elysia395/dsh-wallpaper-engine/blob/7ba44b2424e55b70fe28fea753a7abf27ae7cdb3/README.md#L206-L212)

准备后交接与失败跳过提供可扩展点

```text
### 壁纸库与自动轮播

- **筛选**：按内容分级与类型过滤；筛选同时作用于库视图与轮播候选。
- **隐藏 / 恢复**：只改变列表，不删除源文件。支持批量隐藏与恢复；隐藏当前壁纸不会中断播放。
- **自动轮播**：创建列表，选择壁纸并设置间隔与顺序 / 随机播放。至少需要两张可播放壁纸。
- **准备后切换**：下一张准备完成后再交接；失败候选自动跳过。可选择硬切、淡化、推移等过场，系统「减少动态效果」开启时使用硬切。
- **壁纸属性**：Scene / Web 壁纸可显示作者定义的颜色、开关、滑块等属性，按壁纸保存，并可恢复默认。
```

#### 缺口

- 任务预算设计和用户价值未验证
  **影响**：不计入本插件贡献或评分
  **进一步探讨**：先比较同任务原生/静态/视频/Scene的前台性能与感知，再决定是否开发自动回退

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
