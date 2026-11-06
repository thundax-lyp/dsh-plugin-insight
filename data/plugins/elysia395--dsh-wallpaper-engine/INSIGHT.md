# dsh-wallpaper-engine

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[17f659a](https://github.com/elysia395/dsh-wallpaper-engine/tree/17f659a872c3a42e40d6a03af8d1c17c23caccd2)

<!-- BEGIN META -->
[![GitHub ★ 5,300](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C300&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/elysia395/dsh-wallpaper-engine) [![npm 30d 124,435](https://img.shields.io/static/v1?label=npm+30d&message=124%2C435&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-wallpaper-engine) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-wallpaper-engine)
<!-- END META -->

> **功能**：将本地 Wallpaper Engine 素材或上传媒体作为 DSH Web 背景，适配视频、Scene/Web 与外观设置。

> **亮点**：将本地发现、映射媒体出站、上游引擎适配、失败fallback与设置接进DSH Web；不是发明壁纸格式/引擎或全部子行都独立验收，见 [Q01](#research-q01)-[Q02](#research-q02)。

> **主要限制**：动态视觉收益是否足抵资源/兼容/授权成本；写文件异常会被吞、HTTP200可能不耐久，媒体路径围栏不等整体安全，见 [Q03](#research-q03)-[Q06](#research-q06)。

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
  - [Q01 · 这是壁纸引擎、主题还是插件集合，谁值得用？](#detail-section-11)
  - [Q02 · 本地文件怎样变成可见背景，失败怎么呈现？](#detail-section-12)
  - [Q03 · 媒体token、独立监听与iframe提供什么安全边界？](#detail-section-13)
  - [Q04 · 设置真正保存了吗，本地回退能否掩盖失败？](#detail-section-14)
  - [Q05 · 已有省电/降级和退出做了什么，仍有什么未知？](#detail-section-15)
  - [Q06 · 怎样最小试用，成本和退路是什么？](#detail-section-16)
  - [Q07 · 有什么值得迁移或继续验证，怎样推翻？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有聊天背景装饰需要的DSH用户，在隔离profile用可信授权静态素材起步，见 [Q01](#research-q01)/[Q06](#research-q06)。

原生界面/静态背景，或手工媒体嵌入。无需动态装饰者使用静态即可，不把视觉装饰等同任务自动化。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 本地清单 | WE/上传素材 | token是路径映射非秘密 |
| 视频/图像 | 背景播放 | 浏览器能力/授权素材 |
| Scene/Web | WebWallGL适配 | 上游沙箱/兼容未全审 |
| 偏好 | Host+local cache | 200可能未写盘 |
| 暂停/降级 | 可见性/失败/资源调节 | 未测净省电 |
| 子行 | 字体/玻璃/系统媒体等 | 非全部独立验收 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=22.12/声明DSH ^0.2.0-rc.1/Web | 原生入口 | 成品兼容未实测 |
| 本地可信素材/可选WE安装或上传 | 发现/播放 | 授权与脚本仍需审 |
| 浏览器video/img/WebGL/WebWallGL | 渲染 | 引擎能力归上游 |
| 根及匹配子包/可写目录 | 服务/设置/扩展 | 不等全部子行已验 |
| 可选ffmpeg/缓存 | 派生预览/限FPS | 可能下载/失败退原片 |
| Host认证/本机监听 | 控制与媒体访问 | token非用户凭据 |

#### 步骤

| 阶段 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 副本备份/可信单图/关不需子行 | 核成品依赖/对比度输入 |
| 保存 | 改一偏好回读文件/重启 | HTTP200不等耐久 |
| 逐步动态 | 短视频再小Scene | 首帧/音频/资源/隐藏态 |
| 异常 | 停live/选静态 | 不盲装陌生HTML/引擎 |
| 退出 | 核层/路由/进程后清缓存 | 卸载非删除偏好/素材 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工与未知 |
| --- | --- | --- |
| 首次 | 素材/可选WE授权/依赖下载 | 选材/配置/备份，价格工时未知 |
| 持续 | CPU/GPU/显存/电力/缓存 | 调参/依赖/兼容，未测 |
| 失败 | 下载/原片回退/残留 | 核首帧/保存/真实进程 |
| 退出 | 数据与缓存保留 | 关层/行/根/清敏感路径 |

#### 效果

| 项目 | 当前支持 | 尚未验证 |
| --- | --- | --- |
| 背景 | 清单→真实video/img/引擎调用 | 素材兼容/可读性收益 |
| 优化 | 暂停/降级/转码机制 | 净省电/设备负荷 |
| 保存 | Host队列/local fallback | 写盘失败可200，耐久不保证 |
| 路径 | 所查媒体Map/双层围栏 | 整体路由/脚本安全 |
| 退出 | disposer/流/kill/timer清理 | 全部连接/子树结束 |

> **思考**：动态视觉收益是否足抵资源/兼容/授权成本；写文件异常会被吞、HTTP200可能不耐久，媒体路径围栏不等整体安全，见 [Q03](#research-q03)-[Q06](#research-q06)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将本地发现、映射媒体出站、上游引擎适配、失败fallback与设置接进DSH Web；不是发明壁纸格式/引擎或全部子行都独立验收，见 [Q01](#research-q01)-[Q02](#research-q02)。

主/子行共享Map避免不同token域，真实媒体/层与保存队列有接线；失败吞写、路径与身份分离、关闭/kill不等全部资源回收，见 [Q02](#research-q02)-[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

动态视觉收益是否足抵资源/兼容/授权成本；写文件异常会被吞、HTTP200可能不耐久，媒体路径围栏不等整体安全，见 [Q03](#research-q03)-[Q06](#research-q06)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离profile单张授权可信静态图，保存必须回读/重启核，再决定短视频/Scene；输入可读性、资源或状态不明就停动态退原生/静态，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根bundle1.4.2/source，454文件只定向核心。核主/媒体子行共享接线、发现清单/媒体出站、真实DOM/video/WebWallGL调用、路径/独立监听、设置队列/失败、现有降级与退出；未运行/全审所有子包/媒体/引擎沙箱/平台/发布安装与性能。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、lib/index.js、lib/inventory.js、lib/kernel/config.js、lib/kernel/host-session.js、lib/media-origin.js、lib/media/transcode.js、lib/routes/settings.js、lib/serve.js、lib/webwallgl/renderer.js、package.json、packages/media-bridge/lib/index.js、packages/media-bridge/lib/routes/inventory.js、packages/media-bridge/lib/routes/media-bytes.js、packages/media-bridge/lib/routes/scene-serve.js、src/client.js、src/live-layer-pointer.js、src/live-layer-watch.js、src/live-layer.js、src/media-prep.js、src/occlusion.js、src/persistence.js、src/video-layer.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根package/patch/lib index到media-bridge inject/路由；inventory rescan/tokenMap/代表media与scene-files；client清单/选择/层/video与WebWallGL实际调用；媒体origin/围栏；config queue/吞写/settings200/local基线；可见性/降级/转码/卸载代表链。未运行或全454文件、全部子包/路由/发现容器/引擎内部安全、ffmpeg完整下载校验/平台/成品树/真实性能。
- 下一步：- 下一步副本单图核输入与保存文件/重启一致，再独立验证短视频首帧和退出。
- 磁盘禁写/rename失败仅副本，比较HTTP/UI/磁盘/重启状态。
- 已有暂停/降级需同素材资源测量；未执行目标或证明视觉净收益。

**分析版本**

- **仓库**：[elysia395/dsh-wallpaper-engine](https://github.com/elysia395/dsh-wallpaper-engine)
- **版本号**：1.4.2（[固定提交 17f659a](https://github.com/elysia395/dsh-wallpaper-engine/tree/17f659a872c3a42e40d6a03af8d1c17c23caccd2)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

对设置保存提供实际提交/本地待重试可核状态，针对写盘失败后200误信；与人工回读/导出对照，无恢复收益或误告警过多即否定，见 [Q07](#research-q07)。

- 下一步副本单图核输入与保存文件/重启一致，再独立验证短视频首帧和退出。
- 磁盘禁写/rename失败仅副本，比较HTTP/UI/磁盘/重启状态。
- 已有暂停/降级需同素材资源测量；未执行目标或证明视觉净收益。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 76 | 22416 | — | — | 603559 |
| .cjs | source | 2 | 341 | 324 | 1 | — |
| .mjs | source | 11 | 2800 | 1628 | 1060 | — |
| .js | source | 196 | 61530 | 37789 | 22778 | — |
| .mjs | test | 169 | 85862 | 62251 | 20712 | — |

</details>

**活跃度**

[![Issue 未关闭 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=29&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 101](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=101&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 77](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=77&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核根bundle到真实媒体/图层/设置保存与退出，分上游引擎/子行、耐久失败和资源未知。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是壁纸引擎、主题还是插件集合，谁值得用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

固定dsh-plugin-wallpaper-engine 1.4.2是原生DSH Host/Web根bundle，Node>=22.12、DSH ^0.2.0-rc.1是清单声明。面向已有可信本地壁纸、希望装饰DSH聊天背景的用户，静态图/原生界面是更简单基线；无此需求无需动态插件。不是独立桌面Wallpaper Engine本体，也不是新Scene渲染引擎。WebWallGL依赖负责实际引擎，浏览器负责video/img，主包整合发现、媒体服务、设置和层管理。没有模型工具/prompt介入主链证据，不把视觉装饰当Agent工作流。

patch有主行及media-bridge/fonts/glass/fx/parallax/pet-link等独立子行，主包实际provide wallpaperEngineHost、自检子包可解析并创建共享Host session，子行消费同一apply媒体表；关一个子行不等全部功能退出。本项只定向核根到媒体桥代表闭环，不把目录/路由/子行数量当每个独立子插件通过。源码清单未证明已发布tarball含所有运行依赖与成品客户端，成品安装兼容仍需验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-16](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/package.json#L1-L16)

真实包名/版本/Node与DSH声明。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-plugin-wallpaper-engine",
  "version": "1.4.2",
  "description": "Wallpaper Engine backgrounds for the DSH web GUI: render your local Wallpaper Engine wallpapers behind the chat — Scene and Web in real time through the bundled WebWallGL engine, Video played directly — with iOS-style liquid glass, adjustable blur/scrim/border/opacity, custom typography and caret, and a liquid-glass makeover of the whole settings window. Prerequisite: DeepSeek Harness 0.2 kernel (including 0.2.0-rc.1/rc.2) and Node.js >=22.12.0. No version restriction on dsh-better-sidebar.",
  "type": "module",
  "engines": {
    "node": ">=22.12.0",
    "dsh": "^0.2.0-rc.1"
  },
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "icon": "./icon.png",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/elysia395/dsh-wallpaper-engine.git"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:26-44](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/package.json#L26-L44)

Host/client exports。

<details>
<summary>查看原文（19行）</summary>

```text
  "publishConfig": {
    "access": "public"
  },
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
    "./package.json": "./package.json"
  },
  "files": [
    "icon.png",
    "lib/index.js",
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:28-40](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/cordis.patch.yml#L28-L40)

主行及真实子行起点。

<details>
<summary>查看原文（13行）</summary>

```text
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
    # Third row: the `mascot-avatar` component's host half (C6, P2-2) — the custom
```

</details>

**依据 4 · 源码核查**：[lib/index.js:192-229](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/index.js#L192-L229)

共享服务/子包解析自检与session创建。

<details>
<summary>查看原文（38行）</summary>

```text
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

  // 会话段（版本戳 / 日志与提示 / token 表 / faststart / 启动清扫 / 字节出站 / 媒体源 /
  // 清单构建 ＋ teardown）由 lib/kernel/host-session.js 一次建好；这里只解构出注册要用的
  // 名字（顶格声明 ⇒ test/tools/host-route-index.mjs 的 `applyScope` 仍能把它们列进依赖）。
  const { log, notice, mediaMap, tokenFor, serveFile, serveLayout, handleSceneFiles,
    faststartVariant, pinnedFaststartVariant, trackStream, disposers, mediaOriginApi,
    buildInventory, SCENE_VIDEO_INFLIGHT, dispose } = createHostSession(hostKernel, { base: BASE, ctx });

  // S5c 刀2：子包 9 族路由的 per-apply 实例/引用面（服务面第七键 `apply` 的真正内容）。
```

</details>

**依据 5 · 源码核查**：[lib/webwallgl/renderer.js:15-16](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/webwallgl/renderer.js#L15-L16)

真实依赖WebWallGL对象而非自研引擎。

```text
if (!globalThis.WebWallGL) throw new Error("WebWallGL 引擎未加载（./engine/webwallgl.global.min.js）");
const { createScene, httpSource, fileSource, createMediaSource } = globalThis.WebWallGL;
```

#### 缺口

- 根454文件未全审所有子包/发布构建与安装树，未真实浏览器效果/需求对照。
  **影响**：只能支持组合主链和类型，不证明所有扩展可用。
  **进一步探讨**：隔离profile用可信静态素材核真实成品/子行状态，再决定是否需要动态背景。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地文件怎样变成可见背景，失败怎么呈现？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

媒体桥子行真实inject webServer+wallpaperEngineHost，取主包apply表注册inventory/媒体族；inventory handler await buildInventory再返回JSON，非只读接口声明。rescan调用Steam定位/库目录/异步枚举和assemble，上传目录项目也会扫描，tokenFor把绝对路径base64url并登记Map，媒体路由只从Map查路径。普通media支持GET/HEAD、Range交serveFile或钉住faststart布局，预览可生成缩图失败回原图；不是任意输入path直接读取。

client loadPersisted→loadFontSet→loadInventory，清单失败带error、避免把暂时不可达当用户已删库；applySelection持久id并把条目media/frame URL写选择，syncLayers建DOM层→buildMedia。优先live Scene/Web，再Scene内嵌视频/静态帧，普通视频实际设video.src，图片img；Web兼容iframe allow-scripts无allow-same-origin。live外层iframe加载自己的renderer，renderer createScene并inst.load真实调用依赖，error release后挂fallback；onload只文档到达，startLiveWatch才检查帧/运行状态。未执行素材，不把playable标记、iframe load或fallback有图当原素材正确渲染。Application包不在所读可执行启动路径，不能由清单收录推出会执行壁纸应用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/media-bridge/lib/index.js:74-103](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/packages/media-bridge/lib/index.js#L74-L103)

媒体子行实际获取共享Host服务。

<details>
<summary>查看原文（30行）</summary>

```text
 * `ctx.wallpaperEngineHost` 才读得到。
 */
export const inject = ['webServer', 'wallpaperEngineHost'];

/** 独立 plugin 入口：宿主按 patch 行加载本子包时走这里，转调本模块的实现（不经门面）。 */
export function apply(ctx, config) {
  // ⚠️ 这个字面形态是**承重**的：`test/verify-inject-contracts.mjs` 的 `tableBindingNames()` 按
  // `const <host> = ctx.<服务名>` 认「本文件里的冻结表绑定」（`recvRe`），再据此把下面调用点的
  // `...keys` 展开成叶子冻结表。写成 `ctx && ctx.<服务名>` 守卫就认不出表 ⇒ 整包调用点判 dynamic
  // 而红（nc-sub7 钉的就是这条：接收者必须源自 `ctx.<服务名>`）。
  const host = ctx.wallpaperEngineHost;
  // 拿不到服务名就大声失败：静默 `undefined` 会让下面每一步都在 undefined 上取属性（半死态）。
  if (!host) {
    throw new Error('[wallpaper-engine] wallpaper 没拿到 wallpaperEngineHost 服务'
      + '（inject 声明与宿主装载顺序不匹配）');
  }
  // 键视图 = `lib/subpackage-boot.js` 的 SUBPACKAGE_KEY_TABLE 里本包那一行（值全部来自主包模块级绑定）。
  // 记账 / 错误留证 / 「失败仍原样抛」三件事都在 `keys.runComponent()`（门面 `applyComponent`
  // 走的是同一个函数）⇒ 两条装载路径共用一份语义，不可能一条记了、另一条忘了。
  const keys = host.keys('media-bridge', ctx);
  // `http` 面（`sendJson` / `bodyReader`）不在冻结键表里，与 `packages/fonts` 同款：按需显式带上。
  const deps = Object.freeze({ ...keys, http: host.http });
  return keys.handOffTeardown(ctx, keys.runComponent('media-bridge', ctx, config, deps, applyImpl));
}

/**
 * 组件实现。第三个形参名取 `c`（与 `lib/kernel/host-session.js` 同一约定）：
 * `test/tools/host-route-index.mjs --deps` 按 `const { … } = c;` 现抽契约；路由族调用点的
 * `...keys` 展开则由 `test/verify-inject-contracts.mjs` 按冻结表认（`keys` 与 `apply()` 里那个
 * 绑定同名 ⇒ 两边指的是同一份键视图）。
```

</details>

**依据 2 · 源码核查**：[packages/media-bridge/lib/routes/inventory.js:100-115](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/packages/media-bridge/lib/routes/inventory.js#L100-L115)

真实inventory handler调用builder。

<details>
<summary>查看原文（16行）</summary>

```text
export function registerInventoryRoutes(webServer, c) {
  const { disposers, base: BASE, mediaOriginApi, buildInventory, componentsProbe } = c;

  // 1. Inventory JSON.
  disposers.push(webServer.register({
    kind: 'exact',
    path: `${BASE}/inventory`,
    handler: async (req, res) => {
      try {
        mediaOriginApi.observeAdapter(req);   // 先观测再建库：媒体源起不起由本次请求的形态决定
        const payload = await buildInventory();
        // 组件行状态（只读，形状与失效口径见文件头「组件行状态」）：探针不可用时**不写**该字段 ——
        // 消费方据此按"可用"渲染，而不是把"探测失败"渲染成"组件都没了"。
        const components = rowStatusOf(componentsProbe);
        const body = Buffer.from(JSON.stringify(components ? { ...payload, components } : payload), 'utf8');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
```

</details>

**依据 3 · 源码核查**：[lib/inventory.js:448-463](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/inventory.js#L448-L463)

实际定位/枚举/装配/缓存。

<details>
<summary>查看原文（16行）</summary>

```text
  async function rescan() {
    const installDir = await locateWallpaperEngineP();
    const libraryDirs = await owningLibrariesP();
    const sig = await scanSignatureP(installDir, libraryDirs);
    const we = liveEntries(await enumerateWallpapersAsync(installDir, libraryDirs));
    // 探测记忆**跨扫描延续**：上一次索引里的条目只要项目目录 mtime 没变就不重探
    // （`assembleInventory` 的 revalidate 那一支）—— 于是"库里新增一张壁纸"只探测新的那一条。
    const prev = (await loadIndex())?.probes;
    const probes = prev && typeof prev === 'object' ? { ...prev } : {};
    const payload = await assembleInventory(we, probes, installDir, libraryDirs, true);
    // 丢掉已经不在库里的条目：索引不该随删除无限长（也不该把早已删除的路径当"记得"）。
    const live = new Set(we.map((w) => (w.fileAbs ? pathKey(w.fileAbs) : '')).filter(Boolean));
    for (const key of Object.keys(probes)) {
      if (!live.has(key)) delete probes[key];
    }
    await saveIndex({ builtAt: Date.now(), sig, installDir, libraryDirs, we, probes });
```

</details>

**依据 4 · 源码核查**：[lib/inventory.js:337-370](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/inventory.js#L337-L370)

用户上传项目也扫描与生成media URL。

<details>
<summary>查看原文（34行）</summary>

```text
    // the Steam scan, so a scene from either source plays identically
    // (live WebWallGL / static frame / embedded video / packaged audio).
    const uploadsDir = ensureUploadDir();
    const uploadMeta = readUploadMeta();
    const uploads = await Promise.all((await enumerateUploadsP(uploadsDir)).map(async (w) => {
      const isDirProject = w.id.startsWith('up-dir-');
      const me = metaEntry(uploadMeta, w.id);
      const [hasMedia, hasPreview, sceneMtime] = await Promise.all([
        (w.type === 'video' || w.type === 'web' || w.type === 'image') && w.fileAbs
          ? pathExistsP(w.fileAbs) : Promise.resolve(false),
        w.previewAbs ? pathExistsP(w.previewAbs) : Promise.resolve(false),
        // 同 Steam 扫描：mtime 兼作存在性与 sceneVideo 探测缓存键。
        w.type === 'scene' && w.fileAbs ? mtimeOrNullP(w.fileAbs) : Promise.resolve(null),
      ]);
      const hasFrame = sceneMtime !== null;
      const webMediaBase = w.type === 'web' && hasMedia ? await mediaOriginApi.mediaOriginBase() : '';
      return {
        id: w.id,
        // Project directories carry their own project.json title/rating;
        // single-file uploads use uploads/.meta.json (written by the upload route).
        title: isDirProject ? (w.title || w.id) : (me.title || w.id),
        contentrating: isDirProject ? (w.contentrating || null) : me.contentrating,
        type: w.type,
        // Single-file uploads exist by construction (they came from readdir);
        // directory entries report real existence. Scenes need no media —
        // they go through frameUrl / live render.
        playable: isDirProject ? hasMedia : true,
        media: w.type === 'scene' ? null : `${BASE}/media/${tokenFor(w.fileAbs)}`,
        // 同 Steam 扫描：真实容器后缀（见那里的注释）。
        mediaExt: w.fileAbs ? extOf(w.fileAbs) : null,
        // 同 Steam 扫描：图片 / 幻灯片的图集字段（见那里的注释）。
        slideCount: w.type === 'image' && Array.isArray(w.slides) ? w.slides.length : 0,
        slidesUrl: w.type === 'image' && hasMedia && Array.isArray(w.slides) && w.slides.length > 1
          ? `${BASE}/slides/${tokenFor(w.fileAbs)}`
```

</details>

**依据 5 · 源码核查**：[lib/kernel/host-session.js:158-168](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/kernel/host-session.js#L158-L168)

真实tokenFor与Map登记。

<details>
<summary>查看原文（11行）</summary>

```text

  // Token → absolute path map. Tokens are base64url of the abs path, so the
  // route never exposes an arbitrary filesystem string the client could not
  // otherwise obtain from the inventory.
  const mediaMap = new Map();
  const tokenFor = (absPath) => {
    const token = Buffer.from(absPath, 'utf8').toString('base64url');
    mediaMap.set(token, absPath);
    return token;
  };

```

</details>

**依据 6 · 源码核查**：[packages/media-bridge/lib/routes/media-bytes.js:34-72](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/packages/media-bridge/lib/routes/media-bytes.js#L34-L72)

方法/Map查路径到真实媒体发送。

<details>
<summary>查看原文（39行）</summary>

```text
  const { disposers, base: BASE, serveFile, serveLayout, mediaMap, log, pinnedFaststartVariant, ensureImagePreview } = c;

  // 2/3. Media + preview (stream, with Range support for `<video>` seeking).
  for (const seg of ['media', 'preview']) {
    const prefix = `${BASE}/${seg}/`;
    disposers.push(webServer.register({
      kind: 'prefix',
      path: `${BASE}/${seg}`,
      handler: (req, res) => {
        // GET 流式返回；HEAD 返回与 GET 相同的头但无 body；其余方法 405。
        const method = (req.method || 'GET').toUpperCase();
        if (method !== 'GET' && method !== 'HEAD') {
          res.statusCode = 405;
          res.setHeader('Allow', 'GET, HEAD');
          res.end('method not allowed');
          return;
        }
        const pathname = new URL(req.url || '/', 'http://x').pathname;
        const token = decodeURIComponent(pathname.slice(prefix.length));
        const abs = mediaMap.get(token);
        // faststart 虚拟布局（moov 在尾部的源）：有就按段表发 —— 播放器第一段就能拿到 moov，
        // 不必顺流整读整个文件，而磁盘上一个字节都不用搬（见 lib/mp4-vfs.js）。**但同一次播放
        // 必须始终是同一份布局**（原片与虚拟布局的偏移不同），所以由第一次请求定音、之后钉住：
        // 见 pinnedFaststartVariant。判不了就退回原片。
        const pick = seg === 'media' ? pinnedFaststartVariant(abs, token, log) : null;
        if (pick) { serveLayout(pick.layout, pick.abs, req, res, method === 'HEAD'); return; }
        if (seg !== 'preview') { serveFile(abs, req, res, method === 'HEAD'); return; }
        // ── /preview（issue #240）：**图片走缩略图**，缺失/生成失败回落原图 ──────────
        // 卡片只有 92px 高，此前让浏览器下载并解码整张原图（8064×5376 = 43 MP × 24 张/页）
        // ⇒ 整个渲染进程被解码/内存带宽拖住（翻页卡死数秒）。这里按需把源图缩到 320px 再发；
        // `ensureImagePreview` 失败一律回落原图（"慢一点但可用"），绝不返回 404。
        // 同时开 `{ revalidate: true }`：内容由 size+mtime 唯一确定，可安全走 304 ——
        // 重开面板 / 翻页 / 换筛选不该把同样的字节重新下一遍（原响应既无 ETag 也无 Cache-Control）。
        // ⚠️ revalidate 只开在这一条：`/media` 要支持 Range 且播放中不能换字节语义，
        // 保持默认（无缓存头）。
        if (!/\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(String(abs || ''))) {
          serveFile(abs, req, res, method === 'HEAD', { revalidate: true });
          return;
        }
```

</details>

**依据 7 · 源码核查**：[src/client.js:914-977](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/client.js#L914-L977)

真实清单读取/失败及最新序列。

<details>
<summary>查看原文（64行）</summary>

```text
async function loadInventory() {
  const seq = ++inventorySeq;
  setTransient("loading", true);
  emit();
  let next;
  const prefetched = inventoryBootPrefetch;
  inventoryBootPrefetch = null;
  try {
    let pre = null;
    try { pre = prefetched ? await prefetched : null; } catch { pre = null; }
    const res = pre && pre.ok ? pre : await apiJson(INVENTORY_URL);
    // 两种失败（宿主不可达 / 非 2xx）由 hostFailureReason 统一翻译，面板那一行据此显示。
    if (!res.ok) throw new Error(hostFailureReason(res));
    const data = res.data || {};
    next = {
      installDir: data.installDir,
      uploadDir: data.uploadDir || null,
      cacheDir: data.cacheDir || null,
      weAssetsDir: data.weAssetsDir || null,
      weAssetsAvailable: Boolean(data.weAssetsAvailable),
      // 场景载荷的源（独立壁纸媒体源的 origin；空串 = 回落应用源，见 live-layer 的 liveRenderUrl）。
      sceneMediaBase: typeof data.sceneMediaBase === "string" ? data.sceneMediaBase : "",
      wallpapers: data.wallpapers || [],
      total: data.total || 0,
      portableCount: data.portableCount || 0,
      playlists: Array.isArray(data.playlists) ? data.playlists : [],
      // 组件行状态面（ADR-0013 D3②）：原样透传，**不做归一化** —— 判据与失效口径都在
      // `weComponentVisible` 一处（字段缺席 / 形状不对 ⇒ 按可用渲染）。失败分支（下面的
      // catch）**有意不带这个键**：宿主不可达时可见面照常渲染，不许静默消失（D3③）。
      components: data.components,
      error: null,
    };
    // 玻璃行停用时回收残留（新开面板 / 手动刷新 / 上传完成都会走到这里）。
    // 放在"拿到新 components"之后、写 store 之前：门控与变量必须先撤干净，
    // 随后这次 render 才不会在"行已停用但玻璃还在"的中间态上画一帧。
    reclaimGlassResidue(data.components);
  } catch (err) {
    next = {
      installDir: null,
      uploadDir: null,
      cacheDir: null,
      weAssetsDir: null,
      weAssetsAvailable: false,
      sceneMediaBase: "",
      wallpapers: [],
      total: 0,
      portableCount: 0,
      playlists: [],
      error: String(err && err.message ? err.message : err),
    };
  }
  if (seq !== inventorySeq) return; // superseded by a newer loadInventory()
  setTransient("inventory", next);
  setTransient("loading", false);
  setTransient("loaded", true);
  // 宿主一次不可达 ≠ 库空了（#295）：上面 catch 造的是一份**全空**的 next，只够让面板显示
  // 「未检测到…」+「重试」。拿它继续跑下面的播种 / 列表校验 / 轮播开关，等于把"这次没读到"
  // 当成"用户把壁纸全删了"——首载失败会先烧掉 `rotationSeeded` 再播种（下次真加载反而不播种），
  // 并把 `rotationEnabled` 永久置 false 落盘（重启后仍是关着的）。轮播那一组状态因此整块跳过；
  // 仍需 `revalidateSelection()` 按这一版库存重算「当前壁纸还在不在」（空库落到未选择态，
  // 重试成功后会被再校验回填），然后只刷一次 UI，把错误态交给面板。
  if (next.error) {
    revalidateSelection();
    emit();
```

</details>

**依据 8 · 源码核查**：[src/client.js:6467-6476](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/client.js#L6467-L6476)

初始化实际串联保存加载与inventory。

<details>
<summary>查看原文（10行）</summary>

```text
  // selection restore inside loadInventory()'s revalidateSelection() sees the persisted id
  // and can resolve its media URL, and the first paint already has the user's fonts.
  //
  // ⚠️ 终止 `.catch` 是**必须**的：这条链上任何一步 reject，后面的 `loadInventory` 就永不执行 ——
  // 选择器永久停在「扫描 Wallpaper Engine…」，一次性提示也不收敛（用户只能靠刷新或禁用插件自救）。
  // 各步内部已各自消化可预期的失败（宿主不可达 / 存储被拒 / 坏 JSON），这一条兜的是"没预料到的那次抛"。
  loadPersisted().then(loadFontSet).then(loadInventory).then(loadGlassPresets).catch((err) => {
    // 链断在任何一步都可能留下没被消费的启动预取；它们属于**这一次**启动链，
    // 不能留到用户后来的手动刷新 / 切字体集时冒充新响应（陈旧库存/清单）。
    inventoryBootPrefetch = null;
```

</details>

**依据 9 · 源码核查**：[src/media-prep.js:434-440](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/media-prep.js#L434-L440)

选id并调用持久化。

```text
  const idChanged = selection.id !== (id || "");
  if (idChanged) cancelLiveMount("selection");
  // 手动切换不走渐变 → 立即放行轮换音频闸（轮换提交由旧层退场放行）。
  if (!opts || !opts.fromRotation) releaseRotationAudioGate();
  selection.id = id || "";
  persistSelection();
  if (!selection.id) {
```

**依据 10 · 源码核查**：[src/media-prep.js:472-501](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/media-prep.js#L472-L501)

无条目清状态、有条目选择URL。

<details>
<summary>查看原文（30行）</summary>

```text
  if (!w || !keepPlayingWallpaper(w, selection.contentRatingFilter)) {
    // 被过滤条件排除 / 条目消失时必须留下可读原因（#84），见 selectionBlockedNote。
    selection.blockedNote = selectionBlockedNote(w);
    selection.url = null;
    selection.type = null;
    selection.previewUrl = null;
    selection.mediaExt = null;
    selection.slidesUrl = null;
    selection.slideIntervalMs = null;
    selection.liveFrame = null;
    selection.sceneVideo = null;
    selection.sceneLiveSrc = null;
    selection.webLiveSrc = null;
    selection.propsUrl = null;
    selection.sceneLiveActive = false;
    selection.sceneAudioUrl = null;
    selection.sceneHasAudio = false;
    selection.schemeColor = null;
    selection.mediaInfo = null;
    selection.transcodeState = "idle";
    invalidateMediaInfoProbe();
    abortTranscodeUpgrade();
    syncSceneAudio(selection);
    syncRotationTimer();
    emit();
    return;
  }
  const savedVariant = Number(selection.frameVariants && selection.frameVariants[String(w.id)]) || 0;
  selection.url = w.type === "scene" ? frameUrlWithVariant(w.frameUrl, savedVariant) : w.media;
  // 宿主 inventory 权威标记：已有自定义画面时同步进本地记忆（换机/清配置后恢复）。
```

</details>

**依据 11 · 源码核查**：[src/live-layer.js:296-309](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/live-layer.js#L296-L309)

真正buildMedia并append至body。

<details>
<summary>查看原文（14行）</summary>

```text
  if (!node) {
    node = document.createElement("div");
    node.id = LAYER_ID;
    node.className = "we-layer";
    node.dataset.weKey = wantKey;
    node.dataset.weWid = String(selection.id || "");
    const built = buildMedia(selection);
    if (Array.isArray(built)) for (const el of built) node.appendChild(el);
    else node.appendChild(built);
    document.body.appendChild(node);
  }
  return node;
}

```

</details>

**依据 12 · 源码核查**：[src/media-prep.js:594-625](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/media-prep.js#L594-L625)

live优先/Scene视频/静态选择。

<details>
<summary>查看原文（32行）</summary>

```text
function buildMedia(sel) {
  // 换壁纸会重造这一层的媒体节点，但过场图挂在**层**上、不在媒体节点里：
  // 不先摘掉上一档的过场层，新媒体插回原位后旧图集仍压在上面（最多等一个周期才被
  // tick 的失联判定收走）。摘了等于回到「只有底层首图」，这一拍的交叉过渡也照旧。
  if (activeImageSlideshow) activeImageSlideshow.stop();
  // 壁纸播放形态优先级:
  //   1. live — WebWallGL 实时 iframe（scene.pkg 走场景管线；web 壁纸走它的
  //      web 挂载 + 宿主注入的 WE shim，严格沙箱隔离）。心跳判定失败后自动
  //      降级，见 startLiveWatch/liveFail。
  //   2. sceneVideo — 场景内嵌 MP4 (作者主分支, 硬件解码 <video>, poster=静态帧)
  //   3. 静态帧 img (frameUrl) / 网页壁纸的裸 iframe 兼容路径
  const isLive = (sel.type === "scene" || sel.type === "web") && liveRenderEnabled(sel);
  const isSceneVideo = sel.type === "scene" && Boolean(sel.sceneVideo) && !isLive;
  const isStill = sel.type === "image" || (sel.type === "scene" && !isLive && !isSceneVideo);
  if (isLive) {
    reportClientDiag("live-build", "type=" + sel.type + " delay=" + sel.liveBootDelay + " boot=" + bootRestore);
    // 轮换提交不走这里：live 的领养是节点级（staging 容器整体转为新层，
    // 见 syncLayers 的 pendingStagedLayerNode 分支），iframe 绝不移动。
    liveLog("build-live", "wid=" + sel.id + " 冷启动渲染页（重新加载） " + liveStateBrief());
    const poster = buildLivePoster(sel);
    const frame = createLiveFrame(sel);
    // 启动等待（仅「重启恢复上次壁纸」阶段，bootRestore）：**延迟期照常加载**（iframe 已建，
    // 正在拉 pkg / 解码纹理 / 编译 shader —— 让首帧先热起来才是这一档存在的理由），只是先显示
    // 占位图；`liveBootDelay` 是**上限**：首帧一就绪就立刻挂载，到上限仍未出帧也挂载。
    // 用户一开始交互 bootRestore 即为 false（见其声明处），手动切换壁纸 → 立即挂载、不等待。
    // 切换离开时由 cancelLiveMount 终止这个预热页（否则它会在后台抢资源压住新壁纸）。
    const delaySecs = clampNum(sel.liveBootDelay, 0, 30, 3);
    const delayMs = bootRestore && delaySecs > 0 ? delaySecs * 1000 : 0;
    if (delayMs <= 0) return [poster, frame];
    reportClientDiag("live-delayed", "ms=" + delayMs);
    scheduleLiveMount(sel, frame, delayMs);
    return poster;
```

</details>

**依据 13 · 源码核查**：[src/video-layer.js:218-234](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/video-layer.js#L218-L234)

真实video.src原片或转码。

<details>
<summary>查看原文（17行）</summary>

```text
  const media = prepared || warmed || document.createElement("video");
  const tok = String(sel.url || "").split("/").pop();
  const rc = selection.transcodeReady;
  const useCached = Boolean(rc && rc.url && rc.fps === selection.fpsCap && rc.token === tok);
  if ((!prepared && !warmed)
      || (useCached && media.dataset.weTranscoded !== String(rc.fps))) {
    // 已经转好的抽帧版（上一次在"已上屏"状态下就绪、刻意没换源的那一份）：
    // **建层时就用它当 src** —— 这样整个生命周期里一次换源都不发生（换源 = 清掉当前帧 = 纯色）。
    // 判据只看"这份抽帧版是不是当前上限的"：**不看原生可解性** —— 帧率上限的意义就是压解码
    // 占用，原生可解的源照样可能帧率超标（4K120 的 H.264），拿它当免转条件会让上限在实际
    // 在用的 mp4 上完全失效（见 capNeedsTranscode 的注释）。
    media.src = useCached ? rc.url : sel.url;
    if (useCached) {
      try { media.dataset.weTranscoded = String(rc.fps); } catch { /* ignore */ }
      selection.transcodeState = "ready";
      selection.transcodeProgress = null;
    }
```

</details>

**依据 14 · 源码核查**：[src/media-prep.js:679-692](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/media-prep.js#L679-L692)

兼容Web iframe真实src和sandbox。

<details>
<summary>查看原文（14行）</summary>

```text
    // 节点级领养（staging 容器整体转为新层），此处只会是手动选择路径。
    media = document.createElement("iframe");
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
}
```

</details>

**依据 15 · 源码核查**：[src/live-layer-pointer.js:404-430](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/live-layer-pointer.js#L404-L430)

真正外层iframe/延迟src/加载后看护。

<details>
<summary>查看原文（27行）</summary>

```text
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
    // 那时武装心跳只会让看护对着一个空白页烧掉预算 → 15s 后误判首帧超时。
    if (frame.isConnected && !liveFrameDeferred(frame)) startLiveWatch(frame, sel.id);
  });
  return frame;
```

</details>

**依据 16 · 源码核查**：[lib/webwallgl/renderer.js:94-105](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/webwallgl/renderer.js#L94-L105)

真实createScene。

<details>
<summary>查看原文（12行）</summary>

```text
  fit: fitOf(params.get("fit")),
  fps: Number(params.get("sceneFps")) || 60,
  volume: params.get("muted") === "false" ? 1 : 0,
  renderDpr: Number(params.get("renderDpr")) || 0,
  videoTexScale: Number(params.get("vidscale")) || 0,
  ...(params.get("autoq") === "0" ? { autoQuality: false } : {}),
  ...(params.get("bake") === "0" ? { bake: false } : {}),
  onDiagnostic: reportDiag,
});

// ── 网页壁纸就绪态（getState）：很多网页壁纸不靠 rAF 出帧，「iframe 已 load」才是就绪信号 ──
const webState = { loaded: false, error: null };
```

</details>

**依据 17 · 源码核查**：[lib/webwallgl/renderer.js:126-164](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/webwallgl/renderer.js#L126-L164)

真实依赖load及error兜底。

<details>
<summary>查看原文（39行）</summary>

```text
function showFallback() {
  if (fallbackFrame) return;
  try {
    inst.release();
  } catch {
    /* 已释放 */
  }
  const f = document.createElement("iframe");
  f.className = "we-fallback";
  f.setAttribute("sandbox", "allow-scripts");
  f.src = new URL("./default-wallpaper/index.html", import.meta.url).href;
  host.appendChild(f);
  fallbackFrame = f;
}

inst.on("error", (err) => {
  if (current.type === "web") webState.error = String(err?.message ?? err);
  reportDiag(`装配失败：${err?.message ?? err}`, "error");
  showFallback();
});

let volume = params.get("muted") === "false" ? 1 : 0;

function loadCurrent(source) {
  clearFallback();
  webState.loaded = false;
  webState.error = null;
  const src = source ?? sourceOf(current);
  if (!src) {
    reportDiag(current.type === "web" ? "网页壁纸：缺少 src" : "场景壁纸缺少 mediaBase/src", "error");
    showFallback();
    return;
  }
  inst
    .load(src)
    .then(() => inst.setVolume(volume))
    .catch(() => {
      /* 失败已经 error 事件上报并挂上兜底页；这里只吞掉 Promise */
    });
```

</details>

#### 缺口

- 未审全部发现/容器解析/Range细节/引擎内部和所有素材，未运行视频/Scene/Web。
  **影响**：代码闭环不等兼容率/视觉正确或媒体版权可用。
  **进一步探讨**：同设备一图、一短视频、一小Scene分别核首帧/音频/失败fallback来源，异常先回静态，不开启自动轮播。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 媒体token、独立监听与iframe提供什么安全边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

token是绝对路径可逆base64url，不是随机密钥；Map让未登记token404，是路径映射限制，不能当用户身份认证。scene-files把token查Map后以dirname为root，resolve包含性、lstat最终链接及native realpath中间链接包含性双重检查，拒越界/无法解析，之后才serve/read HTML并注入shim。该检查是所读文件路由的围栏，不证明全部上传/删除/字体/媒体控制等路由安全。

独立媒体origin实际createServer并随机端口listen127.0.0.1，只接scene-files与diag，未见这条监听另做用户认证；scene-files给CORS *，OPTIONS允许GET/HEAD并为opaque网页资源服务。不能因为只听loopback就承诺所有本机脚本/不可信浏览页无法探测访问；主Host其他API认证和部署外露另依Host，不作本轮保证。URL/清单/日志还可能含本地路径，应保护。

外层live renderer是同源、不sandbox，父页通过__wp控制；兼容Web内层iframe明确sandbox allow-scripts不带allow-same-origin。WebWallGL自身web/Scene脚本隔离只见适配说明和调用，依赖内部实现未审，不说全部第三方脚本无Host权限/不外联。可信素材仍需本地授权，未知HTML/脚本不作为首次试用；“本地素材”不等无网络内容。

#### 证据与依据

**依据 1 · 源码核查**：[lib/kernel/host-session.js:158-168](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/kernel/host-session.js#L158-L168)

可逆路径token/Map。

<details>
<summary>查看原文（11行）</summary>

```text

  // Token → absolute path map. Tokens are base64url of the abs path, so the
  // route never exposes an arbitrary filesystem string the client could not
  // otherwise obtain from the inventory.
  const mediaMap = new Map();
  const tokenFor = (absPath) => {
    const token = Buffer.from(absPath, 'utf8').toString('base64url');
    mediaMap.set(token, absPath);
    return token;
  };

```

</details>

**依据 2 · 源码核查**：[lib/serve.js:443-519](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/serve.js#L443-L519)

token查表/双层路径围栏/HTML注入与实际serve。

<details>
<summary>查看原文（77行）</summary>

```text
      return;
    }
    if (method !== 'GET' && method !== 'HEAD') { res.setHeader('Cache-Control', 'no-store'); res.statusCode = 405; res.end('method not allowed'); return; }
      let rest;
      try {
        rest = decodeURIComponent(new URL(req.url || '/', 'http://x').pathname.slice(`${BASE}/scene-files/`.length));
      } catch {
        res.setHeader('Cache-Control', 'no-store');
        res.statusCode = 400; res.end('bad request'); return;
      }
      const token = rest.split('/')[0] ?? '';
      const abs = mediaMap.get(token);
      // 错误响应一律 no-store（与 serveFile 的 404 同纪律）：可重验证缓存只放行**载荷**，
      // 缓存住一个 404 会让"文件后来到位了"仍然显示旧错误。
      if (!abs) { res.setHeader('Cache-Control', 'no-store'); res.statusCode = 404; res.end('unknown-token'); return; }
      const subpath = rest.slice(token.length).replace(/^\/+/, '');
      if (!subpath) { res.setHeader('Cache-Control', 'no-store'); res.statusCode = 404; res.end('missing-subpath'); return; }
      // The wallpaper root is the directory holding scene.pkg / scene.json;
      // project.json and the web entry sit next to them. Fence the target.
      //
      // 围栏**两层，缺一不可**：
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
      res.setHeader('Access-Control-Allow-Origin', '*');
      if (method === 'GET' && /\.html?$/i.test(target)) {
        // 入口 HTML 必须 no-store：它带着注入的 shim + 用户属性种子，且上游同步会
        // 换掉它携带的哈希引用（缓存住了就等于把旧种子喂给壁纸）。
        res.setHeader('Cache-Control', 'no-store');
        if (!existsSync(target)) { res.statusCode = 404; res.end('not found'); return; }
        let html;
        try { html = readFileSync(target, 'utf8'); } catch { res.statusCode = 500; res.end('read failed'); return; }
        html = injectEntryHtml(html, {
          token, htmlPath: target, readWebShim, buildSeedScript, weFocusGuardSource, BASE,
        });
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(html);
        return;
      }
      // 其余壁纸自有文件（`scene.pkg` 100–336MB、`project.json`）：内容由 size+mtime
      // 唯一确定 ⇒ 走可重验证缓存（ETag/304），并记进载荷账本 ——
      // 大包每次重建 live 层都重读一遍盘的代价，就靠这两条一起消掉。
      serveFile(target, req, res, method === 'HEAD', { revalidate: true, payloadToken: token });
```

</details>

**依据 3 · 源码核查**：[lib/media-origin.js:140-184](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/media-origin.js#L140-L184)

真实独立监听路由与127绑定/close。

<details>
<summary>查看原文（45行）</summary>

```text
        server = createServer((req, res) => {
          let pathname;
          try { pathname = new URL(req.url || '/', 'http://x').pathname; } catch { pathname = ''; }
          // 渲染页的诊断信标打的是 `{mediaBase origin}/diag`（**根路径**，见 routes/diag.js 的
          // Kg()）。场景壁纸的 mediaBase 指向本媒体源之后，这个根路径必须在这里也有落点 ——
          // 否则「大场景 pkg 首帧超时」时渲染页的告警会以 404 **静默丢掉**，而那正是排查现场
          // 唯一的内窗（同一条不变量见 routes/diag.js）。
          // 纪律与 /scene-files 一致：**同一个 handleDiag**，不另起一份缓冲（`/diag-log` 读的是
          // 同一份）；`${base}/diag` 一并接上，与 app 源的两条通道保持对称。
          if (pathname === '/diag' || pathname === `${base}/diag`) {
            // 未武装只可能发生在启动竞态里；此时**不假装成功** —— 落到下面的 404，
            // 让"告警丢了"当场可见，而不是被一个 204 吞掉。
            if (mediaDiagHandler) { mediaDiagHandler(req, res); return; }
          }
          if (!pathname.startsWith(`${base}/scene-files/`)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Cache-Control', 'no-store');
            res.end('not found');
            return;
          }
          handleSceneFiles(req, res, 'media');
        });
      } catch (cause) { unavailable(cause); return; }
      server.on('clientError', (_err, socket) => { try { socket.destroy(); } catch { /* ignore */ } });
      server.on('error', unavailable);
      // #241：桌面端优雅退出（DesktopHost.stop 等 10s）时，未 unref 的 listen 服务会一直撑着
      // 事件循环 ⇒ graceful deadline exceeded ⇒ 放弃安装更新。本服务只是渲染页的媒体源，不需要
      // "保活进程"：unref 后照常响应请求，但不再阻止退出；连接也 unref（keep-alive 同样会撑）。
      try { server.unref?.(); } catch { /* ignore */ }
      server.on('connection', (socket) => { try { socket.unref?.(); } catch { /* ignore */ } });
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address();
        const port = addr && typeof addr === 'object' ? addr.port : 0;
        if (!port) { unavailable(new Error('listen 未返回端口')); return; }
        mediaOrigin = { server, port, base: `http://127.0.0.1:${port}` };
        appendDiagLine('media-origin', { base: mediaOrigin.base });
        // 成功事实：**不发日志**，只走提示通道（D4）。文案惰性构造 —— 闸门关掉时不必拼。
        notice('media-origin', () => `壁纸媒体源已监听 ${mediaOrigin.base}（网页壁纸载荷不再经过插件路由的能力头栅栏）`);
        done(mediaOrigin);
      });
    });
    return mediaOriginTask;
  }
  disposers.push(() => { try { mediaOrigin?.server?.close(); } catch { /* ignore */ } });
```

</details>

**依据 4 · 源码核查**：[lib/serve.js:428-443](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/serve.js#L428-L443)

OPTIONS放行和CORS。

<details>
<summary>查看原文（16行）</summary>

```text
  function handleSceneFiles(req, res, mount) {
    const tracePath = () => new URL(req.url || '/', 'http://x').pathname.slice(`${BASE}/scene-files/`.length);
    if (mount === 'app') traceRequests(res, 'scene-files', tracePath());
    else traceMediaRequests(req, res, tracePath());
    const method = (req.method || 'GET').toUpperCase();
    if (method === 'OPTIONS') {
      // 跨源预检（媒体源上的 fetch + 自定义头，例如 Range）：直接放行。
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'range, content-type',
        'Access-Control-Max-Age': '600',
        'Cache-Control': 'no-store',
      });
      res.end();
      return;
```

</details>

**依据 5 · 源码核查**：[src/live-layer-pointer.js:404-430](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/live-layer-pointer.js#L404-L430)

外层live iframe不设置sandbox。

<details>
<summary>查看原文（27行）</summary>

```text
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
    // 那时武装心跳只会让看护对着一个空白页烧掉预算 → 15s 后误判首帧超时。
    if (frame.isConnected && !liveFrameDeferred(frame)) startLiveWatch(frame, sel.id);
  });
  return frame;
```

</details>

**依据 6 · 源码核查**：[src/media-prep.js:679-692](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/media-prep.js#L679-L692)

兼容Web脚本iframe有opaque sandbox。

<details>
<summary>查看原文（14行）</summary>

```text
    // 节点级领养（staging 容器整体转为新层），此处只会是手动选择路径。
    media = document.createElement("iframe");
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
}
```

</details>

**依据 7 · 源码核查**：[packages/media-bridge/lib/routes/scene-serve.js:81-113](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/packages/media-bridge/lib/routes/scene-serve.js#L81-L113)

真实渲染页/engine路径注册与缺依赖404。

<details>
<summary>查看原文（33行）</summary>

```text
  // 3c-2. WebWallGL live renderer page: our adapter page from lib/webwallgl/,
  //       plus the engine itself from the `webwallgl` npm dependency under
  //       `engine/`. Same-origin and NOT sandboxed: the parent page drives it
  //       through frame.contentWindow.__wp / __wpStats, and backdrop-filter
  //       (liquid glass) can sample the composited output. Scene scripts stay
  //       confined inside WebWallGL's own SceneScript sandbox.
  disposers.push(webServer.register({
    kind: 'prefix',
    path: `${BASE}/scene-live`,
    handler: (req, res) => {
      traceRequests(res, 'scene-live', new URL(req.url || '/', 'http://x').pathname);
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
      // #218：按请求现解析（依赖可能在宿主启动后才装上；加载期快照会让“刚装上”一直 404）。
      const pkgDir = typeof webwallglPkgDir === 'function' ? webwallglPkgDir() : webwallglPkgDir;
      if (isEngine && !pkgDir) {
        log.warn('scene-live engine missing: npm dependency `webwallgl` is not installed');
        res.setHeader('Cache-Control', 'no-store');
        res.statusCode = 404; res.end('webwallgl-not-installed'); return;
      }
      const rootDir = isEngine ? pkgDir : WEBWALLGL_DIR;
      const abs = resolve(rootDir, isEngine ? rest.slice(ENGINE_PREFIX.length) : rest);
      // Directory fence: nothing outside the page tree / the engine package is ever served.
      if (abs === rootDir || !abs.startsWith(rootDir + sep)) {
```

</details>

#### 缺口

- 未全审所有路由、浏览器跨源/Host认证、上游WebWallGL脚本沙箱及恶意素材行为。
  **影响**：不能给完整安全/无外联结论或把路径token当秘密。
  **进一步探讨**：仅本机隔离Host/可信图起步；未来针对原始路径/链接/未知token测试路由围栏，第三方脚本另审依赖与网络。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 设置真正保存了吗，本地回退能否掩盖失败？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

host按schema消毒并在单进程config queue内读-改-写，mergeSettings只覆盖出现键，避免不同namespace正常并发互相覆盖；不等跨实例锁。客户端localStorage缓存并200ms合并写，通过PUT整段/各namespace发送，成功簇更新冻结基线，失败dirty等下次修改/可见性重试而非无限自旋。GET host可用时优先Host，初次空档可迁本地，GET途中用户已修改则不覆盖；Host不可达回本地。换随机端口的持久目标是Host文件而非origin缓存。

重要反证：atomicWriteFileSync虽temp fsync→rename，但rename失败退直接write；writeConfig捕获所有mkdir/写文件错误并不抛。mergeSettings在writeConfig后直接return next，settings route以resolve回200 ok，浏览器putSettingsBody只看res.ok。因此写盘失败条件下仍可能看似保存成功并推进基线/清dirty，重启回旧Host配置；不能照注释“响应即持久化”承诺。并非已复现，静态失败路径足以要求独立回读/重启验证；localStorage还可能保留本次UI但后续可用Host旧配置优先，不能证明最终一致。

数据包含偏好/素材路径/缓存/上传，卸载不代表清除；本轮未全审所有namespace、fontset迁移或双浏览器冲突。先备份，保存后重读文件与重启结果，失败不要用反复刷新盖掉本地证据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/kernel/config.js:118-128](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/kernel/config.js#L118-L128)

单进程queue和真实读取。

<details>
<summary>查看原文（11行）</summary>

```text
  function enqueueConfigWrite(fn) {
    const p = configWriteQueue.then(fn, fn);
    // 队列本身永不 reject：一次失败只影响它自己的调用方，不阻塞后续写入。
    configWriteQueue = p.then(() => {}, () => {});
    return p;
  }

  function readSettings() {
    const cfg = readConfig();
    const s = cfg[SETTINGS_FIELD];
    return s && typeof s === 'object' ? s : null;
```

</details>

**依据 2 · 源码核查**：[lib/kernel/config.js:157-172](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/kernel/config.js#L157-L172)

真实merge读改写后return。

<details>
<summary>查看原文（16行）</summary>

```text
    return enqueueConfigWrite(() => {
      const cfg = readConfig();
      const prev = cfg[SETTINGS_FIELD];
      // 存量 base **先规范化到当前刻度**再叠加 patch：老档（缺 `settingsVersion`）在这里迁一次并
      // 带上当前版本号，随后第二次 `sanitizeFromSchema` 因版本号已到当前而短路 ⇒ patch 里那些
      // 已经是当前刻度的值不会被再换算一遍（版本号已到当前时 `sanitizeFromSchema` 短路）。
      const base = (prev && typeof prev === 'object' && !Array.isArray(prev))
        ? (sanitizeFromSchema(prev, 'host') || {})
        : (sanitizeFromSchema({}, 'host') || {});
      const merged = sanitizeFromSchema(Object.assign({}, base, patch), 'host') || {};
      const next = withLegacyFontValues(merged);
      cfg[SETTINGS_FIELD] = next;
      writeConfig(cfg);
      return next;
    });
  }
```

</details>

**依据 3 · 源码核查**：[lib/kernel/config.js:52-67](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/kernel/config.js#L52-L67)

temp fsync/rename失败直接写退路。

<details>
<summary>查看原文（16行）</summary>

```text
  function atomicWriteFileSync(filePath, data) {
    const tmp = filePath + '.tmp';
    const fd = openSync(tmp, 'w');
    try {
      writeFileSync(fd, data);
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    try {
      renameSync(tmp, filePath);
    } catch {
      // Cross-device / locked-target fallback: keep best-effort plain write.
      writeFileSync(filePath, data);
    }
  }
```

</details>

**依据 4 · 源码核查**：[lib/kernel/config.js:91-97](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/kernel/config.js#L91-L97)

writeConfig吞全部写异常。

```text
  function writeConfig(cfg) {
    try {
      mkdirSync(dirname(configPath()), { recursive: true });
      atomicWriteFileSync(configPath(), JSON.stringify(cfg));
    } catch { /* ignore */ }
  }

```

**依据 5 · 源码核查**：[lib/routes/settings.js:225-250](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/routes/settings.js#L225-L250)

merge resolve回200，只有reject回500。

<details>
<summary>查看原文（26行）</summary>

```text
          // 写已串行化（`mergeSettings` 把读-改-写整条放进写队列），等写盘完成再应答，
          // 保持原有「响应即已持久化」的语义。
          mergeSettings(patch).then(
            (next) => json(200, { ok: true, ns, settings: nsView(next, ns), ignored }),
            (err) => json(500, { error: String(err && err.message ? err.message : err) }),
          );
        });
        return;
      }

      // ── 兼容整段入口：`PUT /settings` ───────────────────────────────────
      readSettingsBody(req, res, json, (parsed, sanitized) => {
        // **按键合并**（P1-S1 的核心语义变更）：只保留 body 里**出现**过的键 ——
        // `sanitizeSettings` 会给缺键补默认值，整段交给写路径就等于退回「整段替换」。
        for (const key of Object.keys(sanitized)) if (!hasOwn(parsed, key)) delete sanitized[key];
        if (!Object.keys(sanitized).length) {
          // body 里一个合法键都没有（含 `PUT {}`）⇒ 一字不写。旧语义会在这里把整段重置成默认值。
          json(200, { ok: true, settings: readSettings() }); return;
        }
        // 迁移前的护栏：字体值还没进字体集时，这次写入不得抹掉磁盘上的老字体值
        //（`withLegacyFontValues` 的完整理由见它的注释）。迁移落定后它自动失效。
        const persisted = withLegacyFontValues(sanitized);
        mergeSettings(persisted).then(
          (next) => json(200, { ok: true, settings: next }),
          (err) => json(500, { error: String(err && err.message ? err.message : err) }),
        );
```

</details>

**依据 6 · 源码核查**：[src/persistence.js:157-213](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/persistence.js#L157-L213)

真实PUT/成功冻结基线/dirty与重试。

<details>
<summary>查看原文（57行）</summary>

```text
// `keepalive` 让挂起的 flush 能活过 pagehide/close。apiFetch 不抛（见其契约）。
async function putSettingsBody(url, body) {
  const res = await apiFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  });
  return !!(res && res.ok);
}
async function pushPersisted() {
  if (persistInFlight) {
    persistQueued = true;
    return;
  }
  persistInFlight = true;
  persistQueued = false;
  try {
    let snapshot;
    try {
      snapshot = serializeSelection();
    } catch {
      // 只剩 serializeSelection() 自己抛这一条路径（apiFetch 不抛，见其契约）。
      persistDirty = true;
      return;
    }
    // 还不知道宿主有什么（首启迁移 / 宿主不可达）⇒ 老整段入口：整段快照一次发完。
    if (!pushedSnapshot) {
      /** @type {boolean} */
      let ok;
      try { ok = await putSettingsBody(SETTINGS_URL, snapshot); } catch { ok = false; }
      persistDirty = !ok;
      if (ok) pushedSnapshot = cloneSettingsSnapshot(snapshot);
      return;
    }
    const groups = changedGroupsOf(snapshot, pushedSnapshot);
    const names = Object.keys(groups);
    if (!names.length) { persistDirty = false; return; } // 无改动 ⇒ 一个请求都不发
    let ok = true;
    for (const ns of names) {
      let nsOk;
      try { nsOk = await putSettingsBody(SETTINGS_URL + "/" + ns, groups[ns]); }
      catch { nsOk = false; }
      // 按成功的簇确认基线：别的簇失败时，用户仍可能把已成功的键改回旧值。
      // 值同样要冻结（#292）：`groups[ns]` 里是 `snapshot` 的引用，直接并进基线会再次与
      // `selection` 共用数组 ⇒ 下一次就地修改又会被"引用相同"吞掉。
      if (nsOk) Object.assign(pushedSnapshot, cloneSettingsSnapshot(groups[ns]));
      else ok = false;
    }
    persistDirty = !ok;
    // 全批成功才推进基线；且必须是冻结副本（#292：直接存 `snapshot` 会让基线继续与
    // `selection` 共用数组，下一次就地修改又被"引用相同"吞掉）。
    if (ok) pushedSnapshot = cloneSettingsSnapshot(snapshot);
  } finally {
    persistInFlight = false;
    // 仅处理在途时明确请求的 flush；失败本身不自旋，仍由后续改动/可见性重试。
    if (persistQueued) pushPersisted();
```

</details>

**依据 7 · 源码核查**：[src/persistence.js:216-241](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/persistence.js#L216-L241)

200ms缓存/页面离开和可见重试。

<details>
<summary>查看原文（26行）</summary>

```text
function flushPersist() {
  persistTimer = null;
  writeLocalCache();
  pushPersisted();
}
function schedulePersist() {
  if (persistTimer) return;
  if (typeof window === "undefined" || typeof window.setTimeout !== "function") {
    flushPersist();
    return;
  }
  persistTimer = window.setTimeout(flushPersist, 200);
}

// Flush a pending write when the page goes away (tab close / navigate), and
// retry a failed PUT when the page becomes visible again.
// 监听器必须是具名函数、由 apply 的 ctx.effect 注册/注销: 模块作用域注册的监听器
// 每次 client-plugin 重载/HMR 重新求值 bundle 都会再叠一对, 且永远无法移除。
function onPageHideFlush() {
  if (persistTimer && typeof window.clearTimeout === "function") {
    window.clearTimeout(persistTimer);
    flushPersist();
  }
}
function onVisibilityResyncPersist() {
  if (!document.hidden && persistDirty && !persistTimer) schedulePersist();
```

</details>

**依据 8 · 源码核查**：[src/persistence.js:259-318](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/persistence.js#L259-L318)

Host优先、stale保护/迁移与本地回退。

<details>
<summary>查看原文（60行）</summary>

```text
  // response is STALE (their pending PUT is newer) and must not overwrite the
  // live selection.
  const writesAtStart = persistWrites;
  try {
    const res = await apiJson(SETTINGS_URL);
    // ⚠️ `!res.error` 不能省（不变量）：**"宿主回了 200 但体不是 JSON" 与 "宿主没有存档"
    // 必须分开** —— 前者按"宿主不可达"回落本地，后者要把本地副本 PUT 上去；只看 `ok` 会把
    // 前者读成后者（多一次写盘、语义也不同）。`error` 是 apiFetch 为"成功但解析失败"留的信号。
    if (res.ok && !res.error) {
      const data = res.data;
      hostSettings = data && data.settings;
      // 侧栏玻璃控制组只在 dsh-better-sidebar 已安装且启用时显示（host 检测）。
      selection.sidebarPresent = !!(data && data.betterSidebar);
      // 适配目标的宿主观测值（能力头栅栏 + 桌面壳 UA）。缺字段时 adapter.js 保持
      // null ⇒ 回落本地判定，不能因为响应里没有 adapter 就抛。
      setAdapterFromHost(data && data.adapter);
      hostOk = true;
    }
  } catch { /* 宿主不可达：apiFetch 已不抛，这里兜住赋值/消毒期的异常 */ }

  const stale = persistWrites !== writesAtStart;
  if (hostOk && hostSettings && typeof hostSettings === "object") {
    // Host is the truth: apply it and refresh the local cache copy — unless the
    // user edited settings during the fetch (their write wins).
    if (!stale) {
      Object.assign(selection, sanitizeSettings(hostSettings));
      writeLocalCache();
      // 差分基线 = 宿主现在持有的那份（客户端形状）。⚠️ 只在真的采纳宿主值时推进：GET 在途时
      // 用户改过设置的话，他们那次整段 PUT 已经写进宿主，别拿过期应答当基线（会漏发后续改动）。
      pushedSnapshot = cloneSettingsSnapshot(serializeSelection());
    }
  } else if (hostOk) {
    // Host has nothing saved yet: migrate any existing localStorage data once.
    // ⚠️ 整条读（含 `getItem` 本身）必须走带守卫的实现：站点数据被禁 / 不透明源嵌入时
    // `getItem` 会抛 SecurityError，裸露它会让 loadPersisted() 整体 reject、启动链断掉
    //（选择器永久卡在「扫描 Wallpaper Engine…」）。判据见 readPersistedRaw() 的注释。
    const parsedLocal = readPersistedRaw();
    if (!stale) Object.assign(selection, parsedLocal ? sanitizeSettings(parsedLocal) : { id: "", ...DEFAULTS });
    if (parsedLocal) pushPersisted();
    else if (!stale) {
      // ── 首次安装：宿主没存档，本机也没有 ⇒ 套用「深色 + 作者自用」──
      // 判据就是**两边都空**（用户口径：新装默认好看，升级用户一概不受影响）。
      // `!parsedLocal` 这一条是关键：宿主文件被删但浏览器 localStorage 还在（老用户重装宿主）时，
      // 本地存档说了算，绝不能拿默认外观盖掉他。
      // 不设任何哨兵键：本分支只在"真正第一次"成立，套用后 pushPersisted() 写出存档 ⇒
      // 下次启动走宿主分支，天然只触发一次。
      // ⚠️ 本文件在 INLINE_MODULES 里排在 `preset-store.js` **之前**，直接调 applyPreset 会撞 TDZ ⇒
      // 经注入钩子 `firstRunAdopt`（在 client.js 里定义、读到的是已初始化的函数）。
      if (typeof firstRunAdopt === "function") firstRunAdopt();
    }
  } else {
    // Host unreachable (route missing / static load): localStorage fallback.
    if (!stale) Object.assign(selection, readPersisted());
  }

  // Settings applied (host or fallback). Mark loaded so gated UI — the one-time
  // notice — knows the persisted noticeSeen is final before it renders.
  selection.hostLoaded = true;
  applyEffects();
  emit();
```

</details>

#### 缺口

- 未注入磁盘错误/多实例/端口变化或实测本地与Host冲突，未全审所有存储。
  **影响**：正常保存链明确，但200不能证耐久，丢偏好风险依条件。
  **进一步探讨**：副本禁写配置目录后保存，核HTTP/UI/磁盘/重启四层；保留local备份，未一致先停自动迁移/人工恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有省电/降级和退出做了什么，仍有什么未知？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

已有live失败记忆/会话软失败、首帧看护、静态垫底/Scene视频/Web兼容fallback，隐藏未播时延迟赋live src，首帧未出隐藏中可摘about:blank暂停载荷，页面hidden持续后暂停有效播放，遮挡轮询/longtask降FPS也已存在。不能把“按页面可见性暂停/自动降质量”泛泛再提为新能力；资源改善值仍需同素材/设备测，occlusion无数据会clear并允许全速，不是失败自动最省电。

视频FPS上限可触发真实ffmpeg后台转码与缓存，不只是CSS帧率参数；可能懒下载ffmpeg二进制，也有系统/缓存路径。此处只核实际调用/下载/卸载，不全审校验/所有平台/硬编解码；资源和下载可信性需单独验收。失败可退原片，因此设置cap不保证所有时刻真实解码负荷都受限。

Host session先交teardown后注册，session dispose注销各族、释放共享kernel租约、destroy登记流/清Map；最后租约释放才杀在飞ffmpeg并清任务表。媒体origin server.close不等待全部连接，进程kill不证明子树已退出；已有页面/缓存/磁盘文件也不随关主包全清。client dispose解绑监听/订阅、释放layers、取消预热与待持久timer；这不证明已发PUT/下载全部取消。未运行退出，不照注释零残留给全量保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/live-layer.js:75-92](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/live-layer.js#L75-L92)

实际live失败门和首帧常量。

<details>
<summary>查看原文（18行）</summary>

```text
function liveRenderEnabled(selLike) {
  return Boolean(selLike && selLike.sceneLive !== false
    // 失败记忆的值是失败原因（'timeout' / 'stall'）；兼容旧的 true。
    && !(selLike.sceneLiveFailures && selLike.sceneLiveFailures[String(selLike.id)])
    // 会话内的软失败（传输未完成）同样让位给回退链，但它**不落盘**、且在
    // 冷却后被自动重试清掉（见 scheduleLiveTransferRetry）。
    && !liveSessionFailures.has(String(selLike.id))
    && ((selLike.type === "scene" && selLike.sceneLiveSrc)
      || (selLike.type === "web" && selLike.webLiveSrc)));
}
// 失败原因 → 可读文案（设置面板展示，便于用户反馈「为什么黑」）。
//
// ⚠️ 文案里的时长**从常量插值**，不写死数字：这几个阈值一旦调参，写死的文案就会对用户撒谎。
// 为此这两个阈值常量的声明被**提到本常量之前** —— 顶层模板字符串引用后面声明的 `const` 会撞 TDZ。
const LIVE_FIRST_FRAME_MS = 15000;
const LIVE_STALL_TICKS = 20;
// 取值用 getter 现取（不在模块级冻结）：语言由 locale 服务在 bundle 求值之后确定，
// 冻结的值会让 en 界面的失败行永远停在中文（见 src/i18n.js 的"模块级冻结"纪律）。
```

</details>

**依据 2 · 源码核查**：[src/live-layer-pointer.js:404-430](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/live-layer-pointer.js#L404-L430)

实际隐藏/暂停先不赋src。

<details>
<summary>查看原文（27行）</summary>

```text
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
    // 那时武装心跳只会让看护对着一个空白页烧掉预算 → 15s 后误判首帧超时。
    if (frame.isConnected && !liveFrameDeferred(frame)) startLiveWatch(frame, sel.id);
  });
  return frame;
```

</details>

**依据 3 · 源码核查**：[src/live-layer-watch.js:659-669](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/live-layer-watch.js#L659-L669)

未首帧隐藏时摘src。

<details>
<summary>查看原文（11行）</summary>

```text
 * 拆掉它反而会让切回来的那一刻重新下载整包。
 */
function suspendLivePayload(frame, watch) {
  if (!frame || !watch || watch.firstFrame) return false;
  if (typeof document === "undefined" || !document.hidden) return false; // 只有"真的隐藏"才停
  const url = frame.getAttribute && frame.getAttribute("src");
  if (!url || url === "about:blank") return false;
  frame.dataset.weLiveSrc = url;
  try { frame.src = "about:blank"; } catch { return false; }
  liveLog("live-payload-suspend", "wid=" + watch.wid + " 隐藏中且首帧未出 → 停掉载荷（可见时补回）", "info");
  stopLiveWatch();
```

</details>

**依据 4 · 源码核查**：[src/client.js:6077-6099](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/client.js#L6077-L6099)

真实持续hidden暂停标记和监听。

<details>
<summary>查看原文（23行）</summary>

```text
      let hiddenDebounce = 0;
      let hiddenHoldBound = false;
      const applyHiddenHold = () => {
        const hidden = typeof document !== "undefined" && document.hidden === true;
        if (!hidden) {
          if (hiddenDebounce) { clearTimeout(hiddenDebounce); hiddenDebounce = 0; }
          if (hiddenHoldActive) { hiddenHoldActive = false; emit(); }
          return;
        }
        if (hiddenHoldActive || hiddenDebounce) return;
        hiddenDebounce = setTimeout(() => {
          hiddenDebounce = 0;
          if (typeof document !== "undefined" && document.hidden === true) {
            hiddenHoldActive = true;
            emit();
          }
        }, HIDDEN_PAUSE_DEBOUNCE_MS);
      };
      applyHiddenHold();
      if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
        document.addEventListener("visibilitychange", applyHiddenHold);
        hiddenHoldBound = true;
      }
```

</details>

**依据 5 · 源码核查**：[src/occlusion.js:137-146](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/occlusion.js#L137-L146)

无遮挡数据清空而非强暂停。

<details>
<summary>查看原文（10行）</summary>

```text
function deliverOcclusionSnapshot(frame, snap, targetOrigin) {
  // 不看 backend 名字：hub 契约里 backend 是开放集合（x11/sway/KDE/GNOME…），
  // own/rects 才是实质判据 —— 硬编码相等会让未来后端被当"无数据"静默清遮挡。
  const hasData = snap.own && snap.own.w > 0
    && Array.isArray(snap.rects);
  if (!hasData) {
    occlusionRendererPause = false; // 无数据 ≠ 遮挡：渲染器自会全速
    deliverOcclusionOp(frame, 'clearOcclusion', null, '', snap.gen, targetOrigin);
    return;
  }
```

</details>

**依据 6 · 源码核查**：[src/live-layer-watch.js:288-306](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/live-layer-watch.js#L288-L306)

实际guard降FPS/恢复。

<details>
<summary>查看原文（19行）</summary>

```text
  if (typeof document !== "undefined" && document.hidden) return;
  const now = Date.now();
  const step = liveGuardStep(liveGuardUntil, now, true);
  liveGuardUntil = step.until;
  if (step.start) {
    reportClientDiag("live-guard",
      "stall=" + Math.round(ms) + "ms glass=on → fps=" + liveGuardTargetFps() + " hold=" + (LIVE_GUARD_HOLD_MS / 1000) + "s");
  }
  applyLiveGuardFps(frame, step.until, now);
}

// 每拍调用：窗口未到期就续着，到期则恢复用户档位。
function liveGuardTick(frame) {
  if (liveGuardIsDisabled() || !liveGuardUntil) return;
  const now = Date.now();
  if (now < liveGuardUntil) { applyLiveGuardFps(frame, liveGuardUntil, now); return; }
  liveGuardUntil = 0;
  applyLiveGuardFps(frame, 0, now);
}
```

</details>

**依据 7 · 源码核查**：[src/video-layer.js:654-676](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/video-layer.js#L654-L676)

真实转码URL请求/过时响应防护。

<details>
<summary>查看原文（23行）</summary>

```text
  const pollTimer = setInterval(pollProgress, 500);
  upgradePollTimer = pollTimer;
  pollProgress();
  const transcodedUrl = transcodedUrlFor(token, cap);
  // Trigger + completion probe: a tiny Range request that blocks until the host
  // has the transcode cached, then answers 206 with one byte (discarded). The
  // <video> then streams the SAME url via range requests — no full-file blob is
  // ever held in memory and playback starts as soon as the first bytes arrive.
  // 探测响应是 1 字节二进制体 ⇒ `parse: false`（默认路径会先 json() 吃掉 body，
  // 显式的 arrayBuffer() 只能靠 catch 兜住；这里直接不走解析）。
  apiFetch(transcodedUrl, { signal: ctrl.signal, headers: { Range: "bytes=0-0" }, parse: false })
    .then(async (res) => {
      if (ctrl.signal.aborted) return; // superseded by a newer request
      if (pollTimer) clearInterval(pollTimer); // only ever this request's own timer
      if (!res.ok) { transcodeUpgradeFailed(video, token); return; }
      try { await res.response.arrayBuffer(); } catch { /* 1-byte body; discard */ }
      if (ctrl.signal.aborted) return;
      if (selection.fpsCap !== cap || !video.isConnected) {
        // The user changed the cap (or the wallpaper) while this request was in
        // flight: its output is stale. NEVER swap a stale-fps re-encode in —
        // drop the request state and re-decide for the CURRENT cap instead.
        abortTranscodeUpgrade();
        if (video.isConnected && selection.url && token === selection.url.split("/").pop()) {
```

</details>

**依据 8 · 源码核查**：[lib/media/transcode.js:240-254](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/media/transcode.js#L240-L254)

真实ffmpeg外部下载URL与fetch。

<details>
<summary>查看原文（15行）</summary>

```text
    if (env) return [env];
    return [
      'https://registry.npmmirror.com/-/binary/ffmpeg-static/' + FFMPEG_STATIC_TAG + '/' + asset,
      'https://github.com/eugeneware/ffmpeg-static/releases/download/' + FFMPEG_STATIC_TAG + '/' + asset,
    ];
  }

  // Stream one source to its .part file (visible progress on disk, no 70MB
  // in-memory buffer), computing a streaming sha256. The caller owns the abort
  // signal (per-source timeout / loser cancellation).
  async function downloadFfmpegToFile(url, tmp, ctrl, job) {
    const res = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': 'dsh-wallpaper-engine' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    if (!res.body) throw new Error('no response body');
    const reader = res.body.getReader();
```

</details>

**依据 9 · 源码核查**：[lib/media/transcode.js:432-457](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/media/transcode.js#L432-L457)

真实spawn及abort kill。

<details>
<summary>查看原文（26行）</summary>

```text
          // → spawn ENOENT → ffmpeg 必然启动失败（cwd 必须是真实存在的目录）。
          const spawnCwd = process.env.SystemRoot
            || (process.platform === 'win32' ? 'C:\\' : undefined);
          proc = spawn(a.file || ff, a.args || args,
            { ...a.opts, cwd: spawnCwd, stdio: errFd ? ['ignore', 'ignore', errFd] : 'ignore' });
        } catch (err) {
          if (errFd) { try { closeSync(errFd); } catch { /* ignore */ } }
          errors.push(a.name + ' spawn throw ' + (err && err.code ? err.code : err));
          runNext();
          return;
        }
        curProc = proc;
        // Track the child so a job deadline (see TRANSCODE_TIMEOUT_MS) can kill it
        // even while it is detached / mid-encode.
        ACTIVE_FFMPEG.add(proc);
        // spawn 与上面的 signal 检查之间的 abort 竞态: 此时 onAbort 早已返回
        // (curProc 还是 null), 该子进程不会收到任何取消 → 刚起的进程立刻杀掉并
        // 结束整个尝试链 (不 spawn 第二次), 避免切换壁纸后它继续编码到超时。
        if (signal && signal.aborted) {
          if (proc.pid !== undefined) { try { proc.kill(); } catch { /* ignore */ } }
          ACTIVE_FFMPEG.delete(proc);
          curProc = null;
          if (errFd) { try { closeSync(errFd); } catch { /* ignore */ } }
          signal.removeEventListener('abort', onAbort);
          try { unlinkSync(errLog); } catch { /* ignore */ }
          reject(new Error('ffmpeg aborted'));
```

</details>

**依据 10 · 源码核查**：[lib/index.js:264-273](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/index.js#L264-L273)

路由注册前交teardown。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

**依据 11 · 源码核查**：[lib/kernel/host-session.js:258-271](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/kernel/host-session.js#L258-L271)

真实流/表与共享lease清理。

<details>
<summary>查看原文（14行）</summary>

```text
    dispose: () => {
      for (const d of disposers) { try { d(); } catch { /* ignore */ } }
      // 转码套件的收尾（ensureDirOnce 记忆化 / 在途 ffmpeg 子进程 / 进度账本 / 在途表）已搬进
      // lib/media/transcode.js 的 `dispose()` —— 原有的逐条理由注释随实现一起搬过去了。
      // 这里经租约释放：多行共享内核时，只有计数归零的那次 release 才真的 dispose。
      releaseKernelLease(kernel);
      // Destroy every in-flight media stream so the fiber (HMR / plugin stop)
      // releases all file descriptors — zero residue.
      for (const s of activeStreams) {
        if (!s.destroyed) { try { s.destroy(); } catch { /* ignore */ } }
      }
      activeStreams.clear();
      mediaMap.clear();
    },
```

</details>

**依据 12 · 源码核查**：[lib/media/transcode.js:682-703](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/media/transcode.js#L682-L703)

实际kill在飞进程/标任务error/清表。

<details>
<summary>查看原文（22行）</summary>

```text
    dispose() {
      // 目录创建记忆化 (ensureDirOnce) 只对本次 apply 的路径有意义, 卸载后同一
      // 模块实例可能被再次 apply 且路径不同 → 清空, 避免 Set 无界增长。
      ensuredDirs.clear();
      // 杀掉所有在途 ffmpeg 子进程：插件卸载 / HMR 后宿主再无权管理它们，
      // 不杀就是孤儿进程继续吃 CPU/GPU（detached 模式下尤甚）。它们写一半
      // 的 .tmp<pid> 输出留给下次 apply 的 sweepTranscodeArtifacts 清理。
      for (const proc of ACTIVE_FFMPEG) {
        if (proc.pid !== undefined) { try { proc.kill(); } catch { /* ignore */ } }
      }
      ACTIVE_FFMPEG.clear();
      // 在途转码任务置 error：正在轮询 transcode-progress 的客户端立刻看到
      // 失败并回退原始文件，而不是等一个永远不会 done 的任务。
      for (const job of transcodeJobs.values()) {
        if (job.phase === 'download' || job.phase === 'transcode') job.phase = 'error';
      }
      // 在途 Promise 本身无法取消，但其 finally 的 delete 对空 Map 是 no-op；
      // 清空后新 apply 的同名任务不会被旧的 inflight 条目误命中。
      TRANSCODE_INFLIGHT.clear();
    },
  };
}
```

</details>

**依据 13 · 源码核查**：[src/client.js:6215-6234](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/client.js#L6215-L6234)

真实unsubscribe/监听清理。

<details>
<summary>查看原文（20行）</summary>

```text
        petLink.dispose();
        unsub();
        unsubEffects();
        weSetLayerAttacher(null);
        weSetRegistryListener(null);
        for (const [, unsubLayer] of layerUnsubs) unsubLayer();
        layerUnsubs.clear();
        if (ocWatch) { try { clearInterval(ocWatch); } catch { /* ignore */ } ocWatch = 0; }
        if (typeof window !== "undefined" && typeof window.removeEventListener === "function") {
          for (const t of ocListeners) window.removeEventListener(t, onOcclusionChange);
          if (pageShowBound) window.removeEventListener("pageshow", onBackVisible);
          window.removeEventListener("error", onClientError);
          window.removeEventListener("unhandledrejection", onClientError);
          if (pageHideBound) window.removeEventListener("pagehide", onPageHideFlush);
          if (fontPageHideBound) window.removeEventListener("pagehide", onPageHideFlushFontSet);
        }
        if (backVisBound && typeof document !== "undefined" && typeof document.removeEventListener === "function") {
          document.removeEventListener("visibilitychange", onBackVisible);
        }
        if (warmBound && typeof document !== "undefined" && typeof document.removeEventListener === "function") {
```

</details>

**依据 14 · 源码核查**：[src/client.js:6278-6288](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/client.js#L6278-L6288)

预热/待保存尾任务清理。

<details>
<summary>查看原文（11行）</summary>

```text
        // 禁用后正在播的 BGM 不会停止。
        rotationAudioGate = null;
        retireFadingLayer();
        stopSceneAudioEl();
        cancelLiveFrameBackfill(); // 卸载后不得再发 HEAD/PUT（少这一步就漏一次）
        stopLiveWatch();
        cancelLiveMount("unload"); // 延迟期那个正在预热的渲染页也要终止（否则卸载后仍在后台跑）
        abortTranscodeUpgrade(); // 含 clearUpgradePoll + AbortController.abort（否则卸载后 500ms 轮询永久泄漏）
        cancelPendingPersist(); // 模块级 persistTimer 不属于 fiber：不取消则 200ms 后仍会写一次
        cancelPendingFontSet(); // 字体集那条通道的 timer 同理（各自一个模块级 timer）
        cancelUserPropsCommit(); // 「壁纸属性」拖动期的尾部提交也是模块级 timer（同上）
```

</details>

#### 缺口

- 未测CPU/GPU/显存/电量、硬件编码、遮挡平台与完整进程树/退出。
  **影响**：现有优化不等净省电或全部取消，cap/close/kill均有层次。
  **进一步探讨**：同素材前台/隐藏/弱设备三态查首帧、资源和退出pid/socket；高开销就关live/原片动态，退可信静态图。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样最小试用，成本和退路是什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

只对有背景装饰需要且能管理本地素材的用户建议有边界trial。先隔离profile固定1.4.2成品，备份数据目录/浏览器偏好，确认DSH0.2/Node与子行解析；只用授权可信静态图，关闭不需media-bridge系统控制/宠物/特效/玻璃扩展，再单独短视频，最后小Scene。根与子行互依需核实际成品，不把关一个开关当整族已卸。不可读、影响输入/对比度、写盘不一致或资源超预算即停动态退原生/静态。

首次可能要Wallpaper Engine/素材授权或自有上传、匹配浏览器WebGL、Node/成品依赖、磁盘可写；ffmpeg仅某些派生路径需，缺失可能下载/转码失败回退，非所有显示都必需。持续CPU/GPU/显存/网络/电力、缓存/转码磁盘与原图解码成本随素材/设备变化，现金/人工与性能未测，不能填0或用作者帧率宣称省电。首次选材/权限、持续调参/版本/依赖、失败恢复/删缓存和退出都有人工。

先量同素材原生静态基线的输入可读性、首帧/切换、CPU/GPU/内存和保存重启一致性，再决定开live。退出清选择、停相应行/根并核浏览器层、Host监听与ffmpeg，保留所需配置后按策略清cache/upload和路径记录；卸载不撤素材授权/外联脚本或已经执行的系统媒体操作。本轮无安装/浏览器/下载/性能/恢复实验。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-16](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/package.json#L1-L16)

版本/运行声明。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-plugin-wallpaper-engine",
  "version": "1.4.2",
  "description": "Wallpaper Engine backgrounds for the DSH web GUI: render your local Wallpaper Engine wallpapers behind the chat — Scene and Web in real time through the bundled WebWallGL engine, Video played directly — with iOS-style liquid glass, adjustable blur/scrim/border/opacity, custom typography and caret, and a liquid-glass makeover of the whole settings window. Prerequisite: DeepSeek Harness 0.2 kernel (including 0.2.0-rc.1/rc.2) and Node.js >=22.12.0. No version restriction on dsh-better-sidebar.",
  "type": "module",
  "engines": {
    "node": ">=22.12.0",
    "dsh": "^0.2.0-rc.1"
  },
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "icon": "./icon.png",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/elysia395/dsh-wallpaper-engine.git"
  },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:214-229](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/index.js#L214-L229)

子包可解析与主会话真实依赖。

<details>
<summary>查看原文（16行）</summary>

```text
  const rootManifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const subpackageRowList = subpackageRows(
    readFileSync(new URL('../cordis.patch.yml', import.meta.url), 'utf8'), rootManifest.name);
  assertSubpackagesResolvable(subpackageRowList, (name) => {
    try { return createRequire(import.meta.url).resolve(name); } catch { return null; }
  });
  assertSubpackagesResolvableInHost(subpackageRowList, { mainName: rootManifest.name });

  // 会话段（版本戳 / 日志与提示 / token 表 / faststart / 启动清扫 / 字节出站 / 媒体源 /
  // 清单构建 ＋ teardown）由 lib/kernel/host-session.js 一次建好；这里只解构出注册要用的
  // 名字（顶格声明 ⇒ test/tools/host-route-index.mjs 的 `applyScope` 仍能把它们列进依赖）。
  const { log, notice, mediaMap, tokenFor, serveFile, serveLayout, handleSceneFiles,
    faststartVariant, pinnedFaststartVariant, trackStream, disposers, mediaOriginApi,
    buildInventory, SCENE_VIDEO_INFLIGHT, dispose } = createHostSession(hostKernel, { base: BASE, ctx });

  // S5c 刀2：子包 9 族路由的 per-apply 实例/引用面（服务面第七键 `apply` 的真正内容）。
```

</details>

**依据 3 · 源码核查**：[src/media-prep.js:594-625](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/media-prep.js#L594-L625)

动态优先/退静态分支。

<details>
<summary>查看原文（32行）</summary>

```text
function buildMedia(sel) {
  // 换壁纸会重造这一层的媒体节点，但过场图挂在**层**上、不在媒体节点里：
  // 不先摘掉上一档的过场层，新媒体插回原位后旧图集仍压在上面（最多等一个周期才被
  // tick 的失联判定收走）。摘了等于回到「只有底层首图」，这一拍的交叉过渡也照旧。
  if (activeImageSlideshow) activeImageSlideshow.stop();
  // 壁纸播放形态优先级:
  //   1. live — WebWallGL 实时 iframe（scene.pkg 走场景管线；web 壁纸走它的
  //      web 挂载 + 宿主注入的 WE shim，严格沙箱隔离）。心跳判定失败后自动
  //      降级，见 startLiveWatch/liveFail。
  //   2. sceneVideo — 场景内嵌 MP4 (作者主分支, 硬件解码 <video>, poster=静态帧)
  //   3. 静态帧 img (frameUrl) / 网页壁纸的裸 iframe 兼容路径
  const isLive = (sel.type === "scene" || sel.type === "web") && liveRenderEnabled(sel);
  const isSceneVideo = sel.type === "scene" && Boolean(sel.sceneVideo) && !isLive;
  const isStill = sel.type === "image" || (sel.type === "scene" && !isLive && !isSceneVideo);
  if (isLive) {
    reportClientDiag("live-build", "type=" + sel.type + " delay=" + sel.liveBootDelay + " boot=" + bootRestore);
    // 轮换提交不走这里：live 的领养是节点级（staging 容器整体转为新层，
    // 见 syncLayers 的 pendingStagedLayerNode 分支），iframe 绝不移动。
    liveLog("build-live", "wid=" + sel.id + " 冷启动渲染页（重新加载） " + liveStateBrief());
    const poster = buildLivePoster(sel);
    const frame = createLiveFrame(sel);
    // 启动等待（仅「重启恢复上次壁纸」阶段，bootRestore）：**延迟期照常加载**（iframe 已建，
    // 正在拉 pkg / 解码纹理 / 编译 shader —— 让首帧先热起来才是这一档存在的理由），只是先显示
    // 占位图；`liveBootDelay` 是**上限**：首帧一就绪就立刻挂载，到上限仍未出帧也挂载。
    // 用户一开始交互 bootRestore 即为 false（见其声明处），手动切换壁纸 → 立即挂载、不等待。
    // 切换离开时由 cancelLiveMount 终止这个预热页（否则它会在后台抢资源压住新壁纸）。
    const delaySecs = clampNum(sel.liveBootDelay, 0, 30, 3);
    const delayMs = bootRestore && delaySecs > 0 ? delaySecs * 1000 : 0;
    if (delayMs <= 0) return [poster, frame];
    reportClientDiag("live-delayed", "ms=" + delayMs);
    scheduleLiveMount(sel, frame, delayMs);
    return poster;
```

</details>

**依据 4 · 源码核查**：[lib/media/transcode.js:240-254](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/media/transcode.js#L240-L254)

可选派生下载资源。

<details>
<summary>查看原文（15行）</summary>

```text
    if (env) return [env];
    return [
      'https://registry.npmmirror.com/-/binary/ffmpeg-static/' + FFMPEG_STATIC_TAG + '/' + asset,
      'https://github.com/eugeneware/ffmpeg-static/releases/download/' + FFMPEG_STATIC_TAG + '/' + asset,
    ];
  }

  // Stream one source to its .part file (visible progress on disk, no 70MB
  // in-memory buffer), computing a streaming sha256. The caller owns the abort
  // signal (per-source timeout / loser cancellation).
  async function downloadFfmpegToFile(url, tmp, ctrl, job) {
    const res = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'User-Agent': 'dsh-wallpaper-engine' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    if (!res.body) throw new Error('no response body');
    const reader = res.body.getReader();
```

</details>

**依据 5 · 源码核查**：[lib/kernel/config.js:91-97](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/kernel/config.js#L91-L97)

保存失败边界决定首次回读。

```text
  function writeConfig(cfg) {
    try {
      mkdirSync(dirname(configPath()), { recursive: true });
      atomicWriteFileSync(configPath(), JSON.stringify(cfg));
    } catch { /* ignore */ }
  }

```

**依据 6 · 源码核查**：[lib/kernel/host-session.js:258-271](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/kernel/host-session.js#L258-L271)

退出清理不等删磁盘。

<details>
<summary>查看原文（14行）</summary>

```text
    dispose: () => {
      for (const d of disposers) { try { d(); } catch { /* ignore */ } }
      // 转码套件的收尾（ensureDirOnce 记忆化 / 在途 ffmpeg 子进程 / 进度账本 / 在途表）已搬进
      // lib/media/transcode.js 的 `dispose()` —— 原有的逐条理由注释随实现一起搬过去了。
      // 这里经租约释放：多行共享内核时，只有计数归零的那次 release 才真的 dispose。
      releaseKernelLease(kernel);
      // Destroy every in-flight media stream so the fiber (HMR / plugin stop)
      // releases all file descriptors — zero residue.
      for (const s of activeStreams) {
        if (!s.destroyed) { try { s.destroy(); } catch { /* ignore */ } }
      }
      activeStreams.clear();
      mediaMap.clear();
    },
```

</details>

#### 缺口

- 未测素材可播/运行与授权成本/可读性，未审全部系统媒体控制/扩展。
  **影响**：可给小试条件，不给整体装饰收益和资源保证。
  **进一步探讨**：先单图副本记录对照；只有读取/保存/输入/退出都清楚才开一段短视频，收益不值维护即停。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 有什么值得迁移或继续验证，怎样推翻？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

贡献是把本地发现、映射媒体出站、引擎适配、失败fallback和Host偏好整合为聊天背景；上游WebWallGL/浏览器渲染和全部子包能力分别归因。已有可见性暂停/降FPS/失败记忆和local fallback，旧资源自适应方向若不比这些更具体便无增量。

新候选收窄为可核查的设置提交：写盘失败必须使保存确认保持未提交，并保留本地待重试状态；独立回读/内容版本使用户能辨“屏幕已改/仅本地/Host已保存”，不声称当前已具备。用正常写、目录禁写、rename失败转直接写也失败三个副本样本，对照当前200与人工检查文件/导出，测重启偏好丢失/误信已保存/恢复工时。若当前Host外层已可靠检测该失败、用户并不需要跨重启保存，或新确认增加误告警/同步复杂性而无恢复收益，则推翻；不是新增模型/自动化工作流，也不计已交付创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/kernel/config.js:91-97](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/kernel/config.js#L91-L97)

写错误被吞是具体剩余缺口。

```text
  function writeConfig(cfg) {
    try {
      mkdirSync(dirname(configPath()), { recursive: true });
      atomicWriteFileSync(configPath(), JSON.stringify(cfg));
    } catch { /* ignore */ }
  }

```

**依据 2 · 源码核查**：[lib/kernel/config.js:168-172](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/kernel/config.js#L168-L172)

调用后仍return next。

```text
      cfg[SETTINGS_FIELD] = next;
      writeConfig(cfg);
      return next;
    });
  }
```

**依据 3 · 源码核查**：[lib/routes/settings.js:225-250](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/lib/routes/settings.js#L225-L250)

resolve回200链。

<details>
<summary>查看原文（26行）</summary>

```text
          // 写已串行化（`mergeSettings` 把读-改-写整条放进写队列），等写盘完成再应答，
          // 保持原有「响应即已持久化」的语义。
          mergeSettings(patch).then(
            (next) => json(200, { ok: true, ns, settings: nsView(next, ns), ignored }),
            (err) => json(500, { error: String(err && err.message ? err.message : err) }),
          );
        });
        return;
      }

      // ── 兼容整段入口：`PUT /settings` ───────────────────────────────────
      readSettingsBody(req, res, json, (parsed, sanitized) => {
        // **按键合并**（P1-S1 的核心语义变更）：只保留 body 里**出现**过的键 ——
        // `sanitizeSettings` 会给缺键补默认值，整段交给写路径就等于退回「整段替换」。
        for (const key of Object.keys(sanitized)) if (!hasOwn(parsed, key)) delete sanitized[key];
        if (!Object.keys(sanitized).length) {
          // body 里一个合法键都没有（含 `PUT {}`）⇒ 一字不写。旧语义会在这里把整段重置成默认值。
          json(200, { ok: true, settings: readSettings() }); return;
        }
        // 迁移前的护栏：字体值还没进字体集时，这次写入不得抹掉磁盘上的老字体值
        //（`withLegacyFontValues` 的完整理由见它的注释）。迁移落定后它自动失效。
        const persisted = withLegacyFontValues(sanitized);
        mergeSettings(persisted).then(
          (next) => json(200, { ok: true, settings: next }),
          (err) => json(500, { error: String(err && err.message ? err.message : err) }),
        );
```

</details>

**依据 4 · 源码核查**：[src/persistence.js:157-207](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/persistence.js#L157-L207)

仅按HTTP ok推进保存基线。

<details>
<summary>查看原文（51行）</summary>

```text
// `keepalive` 让挂起的 flush 能活过 pagehide/close。apiFetch 不抛（见其契约）。
async function putSettingsBody(url, body) {
  const res = await apiFetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  });
  return !!(res && res.ok);
}
async function pushPersisted() {
  if (persistInFlight) {
    persistQueued = true;
    return;
  }
  persistInFlight = true;
  persistQueued = false;
  try {
    let snapshot;
    try {
      snapshot = serializeSelection();
    } catch {
      // 只剩 serializeSelection() 自己抛这一条路径（apiFetch 不抛，见其契约）。
      persistDirty = true;
      return;
    }
    // 还不知道宿主有什么（首启迁移 / 宿主不可达）⇒ 老整段入口：整段快照一次发完。
    if (!pushedSnapshot) {
      /** @type {boolean} */
      let ok;
      try { ok = await putSettingsBody(SETTINGS_URL, snapshot); } catch { ok = false; }
      persistDirty = !ok;
      if (ok) pushedSnapshot = cloneSettingsSnapshot(snapshot);
      return;
    }
    const groups = changedGroupsOf(snapshot, pushedSnapshot);
    const names = Object.keys(groups);
    if (!names.length) { persistDirty = false; return; } // 无改动 ⇒ 一个请求都不发
    let ok = true;
    for (const ns of names) {
      let nsOk;
      try { nsOk = await putSettingsBody(SETTINGS_URL + "/" + ns, groups[ns]); }
      catch { nsOk = false; }
      // 按成功的簇确认基线：别的簇失败时，用户仍可能把已成功的键改回旧值。
      // 值同样要冻结（#292）：`groups[ns]` 里是 `snapshot` 的引用，直接并进基线会再次与
      // `selection` 共用数组 ⇒ 下一次就地修改又会被"引用相同"吞掉。
      if (nsOk) Object.assign(pushedSnapshot, cloneSettingsSnapshot(groups[ns]));
      else ok = false;
    }
    persistDirty = !ok;
    // 全批成功才推进基线；且必须是冻结副本（#292：直接存 `snapshot` 会让基线继续与
```

</details>

**依据 5 · 源码核查**：[src/live-layer-pointer.js:404-430](https://github.com/elysia395/dsh-wallpaper-engine/blob/17f659a872c3a42e40d6a03af8d1c17c23caccd2/src/live-layer-pointer.js#L404-L430)

可见性延迟已有，避免重复发明。

<details>
<summary>查看原文（27行）</summary>

```text
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
    // 那时武装心跳只会让看护对着一个空白页烧掉预算 → 15s 后误判首帧超时。
    if (frame.isConnected && !liveFrameDeferred(frame)) startLiveWatch(frame, sel.id);
  });
  return frame;
```

</details>

#### 缺口

- 未复现实际文件系统失败/确认用户跨设备保存需求或全部外层检测。
  **影响**：候选机制有源码依据但商业/可用性收益未证。
  **进一步探讨**：先副本三故障样本和用户理解对照，错误不降就保留人工导出/静态配置退路。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
