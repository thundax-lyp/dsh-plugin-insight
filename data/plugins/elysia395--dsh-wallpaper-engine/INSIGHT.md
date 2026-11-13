# dsh-wallpaper-engine

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[fd3e01f](https://github.com/elysia395/dsh-wallpaper-engine/tree/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91)

<!-- BEGIN META -->
[![GitHub ★ 6,484](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C484&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/elysia395/dsh-wallpaper-engine) [![npm 30d 149,325](https://img.shields.io/static/v1?label=npm+30d&message=149%2C325&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-wallpaper-engine) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-wallpaper-engine)
<!-- END META -->

> **功能**：在 DSH 对话界面显示本地场景、网页和视频壁纸，支持外观预设。

> **亮点**：[Q01](#research-q01) 把不同素材类型纳入同一个 DSH 背景流程。[Q02](#research-q02) 对子包分开检查解析与拆卸。

> **主要限制**：[Q03](#research-q03) 的 Web 素材保留脚本执行，设备开销和外部请求需要检查。预览正常也可能遇到实际实时画面失败。

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
  - [Q01 · 动态背景对 DSH 用户有什么具体增量？](#detail-section-11)
  - [Q02 · 宿主、子包和浏览器如何装载与拆卸？](#detail-section-12)
  - [Q03 · 隔离和资源限制如何影响试用？](#detail-section-13)
  - [Q04 · 如何验证动态背景的实际代价？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有本地壁纸素材、希望在 DSH 对话中显示动态背景的 Web 用户。

以现有静态主题图为基线。静态图无需场景脚本、实时渲染或对应媒体进程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Scene 与视频 | 加载动态背景 | 依赖 WebGL 或解码，失败回退 |
| Web 壁纸 | 加载本地页面 | 脚本沙箱及媒体源限制 |
| 设置与卸载 | 控制选择及恢复主题 | 宿主作用域和子包须可解析 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Web 宿主与插件子包 | 必需 | 挂载设置、媒体和界面 | 核 profile 两侧包解析 |
| WebGL 及驱动 | Scene 按需 | 实时渲染 | 尝试视频或静态回退 |
| 可信本地素材 | 试用需要 | 渲染目标 | 先用普通静态图或小视频 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选临时 Web profile 与可信素材 | 先保留原主题 |
| 试用 | 用户逐类加载并对照输入 | 能显示且输入流畅 |
| 退出 | 用户停用并检查路由和请求 | 回到原主题 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 素材与环境成本未知 | 核依赖和素材 | 旧驱动需单验 |
| 持续 | GPU、解码与缓存未知 | 调整清晰度和帧率 | 无设备实测 |
| 恢复 | 重新加载开销未知 | 核降级并恢复主题 | 可能需要检查子组件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 背景 | 按类型加载与回退 | 具体素材成功率 |
| 退出 | 向宿主移交 teardown | 真实重载清理效果 |

> **思考**：[Q03](#research-q03) 的 Web 素材保留脚本执行，设备开销和外部请求需要检查。预览正常也可能遇到实际实时画面失败。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把不同素材类型纳入同一个 DSH 背景流程。[Q02](#research-q02) 对子包分开检查解析与拆卸。

[Q02](#research-q02) 在宿主路由注册前交接拆卸，子包依赖检查覆盖主包和 profile 两侧。错误路径的实际生命周期仍需验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的 Web 素材保留脚本执行，设备开销和外部请求需要检查。预览正常也可能遇到实际实时画面失败。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 从来源明确的小素材开始，对比原主题的可读性和输入响应。第三方网页素材需单独查脚本请求，出现卡顿或意外网络行为时停用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持背景分流和分包接线，真实宿主、素材兼容和资源待验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/media-prep/prepare.js、package.json、cordis.patch.yml、lib/index.js、src/client.js、src/live-layer.js、src/media-prep.js、lib/media-origin.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查根包挂载、代表性壁纸加载、网页沙箱及拆卸。不执行构建、目标插件或本地媒体。
- 下一步：按 [Q04](#research-q04) 对照固定素材与原生背景，并分别记录渲染、网络和退出。

**分析版本**

- **仓库**：[elysia395/dsh-wallpaper-engine](https://github.com/elysia395/dsh-wallpaper-engine)
- **版本号**：1.4.2（[固定提交 fd3e01f](https://github.com/elysia395/dsh-wallpaper-engine/tree/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用同一回放比较静态背景、视频与 Scene，如果常降级、妨碍输入或退出有残留，则不采用动态方式。

按 [Q04](#research-q04) 对照固定素材与原生背景，并分别记录渲染、网络和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 75 | 19335 | — | — | 539452 |
| .cjs | source | 2 | 368 | 337 | 14 | — |
| .mjs | source | 12 | 3108 | 1838 | 1146 | — |
| .js | source | 209 | 64079 | 39519 | 23536 | — |
| .mjs | test | 174 | 88706 | 64445 | 21282 | — |

</details>

**活跃度**

[![Issue 未关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 88](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=88&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 86](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=86&color=737b86&logo=github)](https://github.com/elysia395/dsh-wallpaper-engine/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 本地动态壁纸在什么条件下能正常显示，怎样识别降级、隔离和资源边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 动态背景对 DSH 用户有什么具体增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

想在日常聊天中使用已有 Wallpaper Engine 场景、网页或视频的 Web 用户，可以在 DSH 界面预览并选择动态背景。相对固定主题图片，增量是沿素材类型决定展示方式，而非只把截图当背景。Scene 分支优先试实时渲染，失败时尝试内嵌视频或静态图。Web 优先加载实时渲染页，失败回到兼容 iframe。合格结果是聊天可读、背景类型符合预期、失败后能继续使用界面。只需清晰对话界面时，静态背景更简单。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:33-33](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/README.md#L33-L33)

作者说明动态背景和附属外观能力。

```text
把本机 **Wallpaper Engine** 的 Scene、Web 与视频壁纸带进 DSH 对话界面，再配上液态玻璃、字体、吉祥物与可分享的外观预设。插件不向 agent 注册工具、不注入提示文本，**不增加模型 token 开销**。
```

**依据 2 · 源码核查**：[src/media-prep/prepare.js:86-118](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/src/media-prep/prepare.js#L86-L118)

Scene 的实时、视频、静态路径。

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
      sceneLiveFailures: selection.sceneLiveFailures,
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

**依据 3 · 源码核查**：[src/media-prep/prepare.js:120-136](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/src/media-prep/prepare.js#L120-L136)

Web 加载和兼容回退。

<details>
<summary>查看原文（17行）</summary>

```text
  // web (iframe)：live 渲染页探测优先（webLiveSrc），失败回退旧链裸 iframe
  // load 探测（慢页超时兜底提交）。
  const webLiveSel = {
    type: "web", id: w.id,
    webLiveSrc: w.webLiveSrc || null,
    objectFit: selection.objectFit,
    sceneLiveFps: selection.sceneLiveFps,
    sceneLive: selection.sceneLive,
    sceneLiveFailures: selection.sceneLiveFailures,
  };
  if (liveRenderEnabled(webLiveSel) && !prepareLiveExhausted(w.id)) {
    prepareSceneLiveStage(w, prep, onReady, () => prepareWebProbe(w, prep, onReady));
    return;
  }
  prep.kind = "web";
  prepareWebProbe(w, prep, onReady);
}
```

</details>

#### 缺口

- 素材成功率与读屏影响未知。
  **影响**：无法判定特定项目能否实时渲染。
  **进一步探讨**：用固定 Scene、Web 和视频素材逐类对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主、子包和浏览器如何装载与拆卸？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

根包补丁插入壁纸主行和多条子组件。宿主以 webServer 注入注册 API；缺服务会退出。根初始化把共享状态提供给子组件，再从包自身和 profile 两侧检查子包能否解析，降低根加载而单个外观功能消失的概率。浏览器构建为独立 Web 模块，客户端 apply 执行背景和界面生命周期。路由注册前已向作用域移交 teardown，降低后续注册报错留下已挂路由的风险。这个保证依赖宿主作用域调用清理，固定源码检查未复现装载中断。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:148-162](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/package.json#L148-L162)

Web 立即装载声明及构建入口。

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

**依据 2 · 源码核查**：[cordis.patch.yml:21-39](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/cordis.patch.yml#L21-L39)

根与组件插入行。

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

**依据 3 · 源码核查**：[lib/index.js:175-200](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/lib/index.js#L175-L200)

宿主服务检查及共享组件接口。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:214-220](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/lib/index.js#L214-L220)

实际执行两侧子包解析验证。

```text
  const rootManifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const subpackageRowList = subpackageRows(
    readFileSync(new URL('../cordis.patch.yml', import.meta.url), 'utf8'), rootManifest.name);
  assertSubpackagesResolvable(subpackageRowList, (name) => {
    try { return createRequire(import.meta.url).resolve(name); } catch { return null; }
  });
  assertSubpackagesResolvableInHost(subpackageRowList, { mainName: rootManifest.name });
```

**依据 5 · 源码核查**：[lib/index.js:260-273](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/lib/index.js#L260-L273)

先向宿主移交 teardown。

<details>
<summary>查看原文（14行）</summary>

```text
  // R-1（卸载交接顺序）：teardown 的交接**必须先于任何一次注册**。
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
```

</details>

**依据 6 · 源码核查**：[src/client.js:6138-6142](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/src/client.js#L6138-L6142)

Web 入口导出。

```text
  });
}

exports.apply = apply;
exports.inject = inject;
```

#### 缺口

- 真实 profile 和部分注册失败未验。
  **影响**：无法保证装卸中断后的路由都按预期清除。
  **进一步探讨**：在隔离配置故意少一个子组件，再恢复加载并检查路由。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 隔离和资源限制如何影响试用？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

网页壁纸含能执行的第三方脚本。实时渲染 URL 请求严格沙箱，兼容分支也给 iframe 设置 allow-scripts 且不授予同源身份。桌面形态遇到宿主能力头限制时可改用按需的壁纸媒体源，浏览器形态通常走应用源。沙箱设置提供同源权限边界，网页脚本的实际外部请求、资源消耗与浏览器隔离仍需验证。

先用来源明确的一张静态图或小视频，随后在隔离 DSH Web profile 检查可信 Scene。Web 素材单独试，不以静态图成功推断脚本兼容。初始成本包括素材整理、核对 WebGL 和分包装载，持续成本包括解码、显存和缓存，失败可能引起黑屏与重新切换。金额、时长和资源未测。预览后黑屏、聊天输入卡顿或意外请求都可作为停止条件，清掉选择或停用后用原主题继续。

#### 证据与依据

**依据 1 · 源码核查**：[src/live-layer.js:148-187](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/src/live-layer.js#L148-L187)

严格 Web 渲染参数、FPS 与画质条件。

<details>
<summary>查看原文（40行）</summary>

```text
function liveRenderUrl(selLike) {
  const isWeb = selLike.type === "web";
  // scene：src 是 mediaBase 下的 token（渲染页用它拼 httpSource）。
  // web：src 必须是**完整入口 URL**（渲染页的 web 形态直接 iframe 加载它，
  // 并从同目录取 project.json）—— 传 token 会被当成相对 URL 而 404。
  //
  // host 给的 webLiveSrc 正常情况下已是**绝对 URL**：网页壁纸的整个载荷
  //（入口 HTML + 全部子资源）由 host 自己的壁纸媒体源（独立 loopback 端口）
  // 提供。原因见 host 的 ensureMediaOrigin：DSH Desktop 给每个插件路由套了
  // 能力头（x-dsh-desktop-renderer）栅栏，而该头只注入给同源 frame 的请求；
  // 严格沙箱 iframe 是不透明源，永远拿不到 —— 于是入口 HTML 一律 403，表现
  // 就是「预览图正常、随后整块黑」。只有旧 host / 媒体源启动失败时才回落成
  // 应用源相对路径（浏览器形态照常可用）。
  const webEntry = String(selLike.webLiveSrc || "");
  const src = isWeb
    ? (/^https?:\/\//i.test(webEntry) ? webEntry : location.origin + webEntry)
    : selLike.sceneLiveSrc;
  const fit = SCENE_LIVE_FIT[selLike.objectFit] || "cover";
  const fps = SCENE_LIVE_FPS_VALUES.includes(selLike.sceneLiveFps) ? selLike.sceneLiveFps : 30;
  const muted = weAudioVolume() > 0 ? "false" : "true";
  // 场景载荷的源：默认**宿主说了算**（inventory.sceneMediaBase = 独立壁纸媒体源的 origin，
  // 见 resolveSceneMediaBase —— 那里同时决定远程页面回落自身 origin 的口径）。
  // 宿主给空串（原生浏览器 / 媒体源不可用 / 库里没有可实时渲染的场景）⇒ 回落应用源，
  // 即改动前的行为。**客户端不再自己拼 location.origin**：70–90MB 的 scene.pkg 走应用源
  // 那条路挤不过首帧 LIVE_FIRST_FRAME_MS 预算（那里还要买纹理解码与 shader 编译）。
  // 网页壁纸**不走**这个源：它的入口是绝对 URL（webLiveSrc），mediaBase 对它只剩
  //「诊断信标打哪个 origin」一个用途，保持原样以免多动一条已经通的链。
  const mediaBase = (isWeb ? (typeof location !== "undefined" && location.origin ? location.origin : "") : resolveSceneMediaBase())
    + SCENE_FILES_PATH;
  return "/wallpaper-engine/scene-live/index.html?type=" + (isWeb ? "web" : "scene")
    // 网页壁纸必须严格沙箱：第三方 workshop HTML 不得继承 DSH 的 origin
    //（否则可冒用宿主身份调宿主 API / 读宿主存储）——只给 allow-scripts，
    // 控制经渲染页的 postMessage 通道下发，shim 由宿主注入 HTML 响应。
    + (isWeb ? "&webSandbox=strict" : "")
    + "&fit=" + fit + "&sceneFps=" + fps + "&muted=" + muted
    // 自动画质（webwallgl 的 autoQuality）：渲染页的关闭开关是 `autoq=0`。默认不传 = 引擎按
    // 帧率自行降后处理/粒子/AA；**关掉本设置**（sceneAutoQuality=false）才显式关掉，保住发光 /
    // 音频可视化 / 光晕 —— 弱 GPU 上帧率压不住上限时它会一路降到 postProcessing=off，
    // 视觉上就是"动态效果全没了"，而用户往往要的是效果，不是那几帧。
    + (selLike.sceneAutoQuality === false ? "&autoq=0" : "")
```

</details>

**依据 2 · 源码核查**：[src/media-prep.js:472-483](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/src/media-prep.js#L472-L483)

兼容 iframe 也保留脚本沙箱。

<details>
<summary>查看原文（12行）</summary>

```text
    // web 旧链不走元素级领养（iframe reparent 重载）：轮换的 web 提交是
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
```

</details>

**依据 3 · 源码核查**：[lib/media-origin.js:68-109](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/lib/media-origin.js#L68-L109)

桌面条件决定独立媒体源，浏览器通常使用应用源。

<details>
<summary>查看原文（42行）</summary>

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
  // 这条源的根路径 `/diag` 也要接（渲染页的诊断信标打的是 `{mediaBase origin}/diag`），
  // 否则 mediaBase 一指过来，渲染页的告警就 404 静默丢掉 —— 见下面的 `mediaDiagHandler`。
  let mediaOrigin = null;       // { server, port, base }
  let mediaOriginTask = null;
  let mediaOriginDead = false;  // 起过一次就不反复试（否则每次 inventory 都重试绑定）
  /**
   * 诊断族的根路径处理器（`routes/diag.js` 的 `handleDiag`），由 `registerDiagRoutes` 的**出参**
   * `onHandleDiag`（3c-7）武装。**为什么是一个可变量而不是常量**：媒体源（3c-3a）先创建、
   * 诊断族（3c-7）随后注册，两者在同一次 `apply` 内先后发生；而这个闭包只在**请求时**读它
   * （媒体源是按需懒启动的，任何请求都晚于 `apply` 返回）⇒ 读到的一定是已武装的值。
   * 传值会把 null 快照带进闭包。
   */
  let mediaDiagHandler = null;
  function mediaOriginBase() {
    // 适配器门控：**网页壁纸**的独立源只为「能力头栅栏」存在（栅栏只在桌面壳里）。
    // 原生浏览器没有栅栏 ⇒ 网页载荷走应用源相对路径即可，不必多开一个 loopback 监听。
    // 观测与手选都由 observeAdapter 收敛到 mediaOriginNeeded（见 3c-0）。
    // ⚠️ **场景载荷不走这条门控**（见 ensureSceneMediaOrigin）：它要独立源的理由是带宽。
    if (!mediaOriginNeeded()) return Promise.resolve('');
    return ensureMediaOrigin().then((m) => (m ? m.base : ''));
```

</details>

**依据 4 · 作者声明**：[README.md:122-127](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/README.md#L122-L127)

作者列 WebGL、平台和共存限制。

```text
<h2 id="兼容与限制"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/readme/section-compat-dark.png"><img src="assets/readme/section-compat-light.png" alt="兼容与限制" width="1440"></picture></h2>

- Windows / macOS / Linux 使用同一份源码；macOS 没有 WE 客户端，可上传图片 / 视频或指向 WE 项目目录。
- Scene 渲染依赖浏览器 WebGL 与显卡驱动，复杂工坊项目可能存在兼容差异；失败会逐级降级。
- 遮挡暂停、窗口失焦暂停与音频回环采集按平台适配。
- 与其他皮肤 / 插件同时启用时，先看 [共存说明](docs/HOW-IT-WORKS.md#共存玻璃表面与其他-ui-插件)。
```

#### 缺口

- 实际 Web 沙箱网络、GPU 负担和环境兼容未验证。
  **影响**：不能宣称全部素材安全或没有性能代价。
  **进一步探讨**：分别记录小视频、Scene、Web 的资源、请求和暂停行为。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证动态背景的实际代价？

**研究主题**：新假设与验证

#### 完整回答

假设支持分级回退的背景能在某个固定设备的 DSH Web 上满足外观需求，同时保持对话可操作。用同一对话回放测试静态主题、小视频和一个预先标注复杂度的 Scene，固定窗口和浏览器设置。记录首次可用画面、落入哪种回退、输入响应、隐藏后资源以及退出后的残留监听。若动态选择经常变黑、影响输入，或回退图本就能满足外观目标，应保留原主题。

#### 证据与依据

**依据 1 · 源码核查**：[src/media-prep/prepare.js:86-118](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/src/media-prep/prepare.js#L86-L118)

可区分三种降级结果。

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
      sceneLiveFailures: selection.sceneLiveFailures,
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

**依据 2 · 源码核查**：[src/live-layer.js:165-187](https://github.com/elysia395/dsh-wallpaper-engine/blob/fd3e01fd11cd5ad83f46940ab4d61d971cfbcf91/src/live-layer.js#L165-L187)

帧率和画质可固定为实验条件。

<details>
<summary>查看原文（23行）</summary>

```text
  const fit = SCENE_LIVE_FIT[selLike.objectFit] || "cover";
  const fps = SCENE_LIVE_FPS_VALUES.includes(selLike.sceneLiveFps) ? selLike.sceneLiveFps : 30;
  const muted = weAudioVolume() > 0 ? "false" : "true";
  // 场景载荷的源：默认**宿主说了算**（inventory.sceneMediaBase = 独立壁纸媒体源的 origin，
  // 见 resolveSceneMediaBase —— 那里同时决定远程页面回落自身 origin 的口径）。
  // 宿主给空串（原生浏览器 / 媒体源不可用 / 库里没有可实时渲染的场景）⇒ 回落应用源，
  // 即改动前的行为。**客户端不再自己拼 location.origin**：70–90MB 的 scene.pkg 走应用源
  // 那条路挤不过首帧 LIVE_FIRST_FRAME_MS 预算（那里还要买纹理解码与 shader 编译）。
  // 网页壁纸**不走**这个源：它的入口是绝对 URL（webLiveSrc），mediaBase 对它只剩
  //「诊断信标打哪个 origin」一个用途，保持原样以免多动一条已经通的链。
  const mediaBase = (isWeb ? (typeof location !== "undefined" && location.origin ? location.origin : "") : resolveSceneMediaBase())
    + SCENE_FILES_PATH;
  return "/wallpaper-engine/scene-live/index.html?type=" + (isWeb ? "web" : "scene")
    // 网页壁纸必须严格沙箱：第三方 workshop HTML 不得继承 DSH 的 origin
    //（否则可冒用宿主身份调宿主 API / 读宿主存储）——只给 allow-scripts，
    // 控制经渲染页的 postMessage 通道下发，shim 由宿主注入 HTML 响应。
    + (isWeb ? "&webSandbox=strict" : "")
    + "&fit=" + fit + "&sceneFps=" + fps + "&muted=" + muted
    // 自动画质（webwallgl 的 autoQuality）：渲染页的关闭开关是 `autoq=0`。默认不传 = 引擎按
    // 帧率自行降后处理/粒子/AA；**关掉本设置**（sceneAutoQuality=false）才显式关掉，保住发光 /
    // 音频可视化 / 光晕 —— 弱 GPU 上帧率压不住上限时它会一路降到 postProcessing=off，
    // 视觉上就是"动态效果全没了"，而用户往往要的是效果，不是那几帧。
    + (selLike.sceneAutoQuality === false ? "&autoq=0" : "")
```

</details>

#### 缺口

- 未执行设备对照。
  **影响**：不能给出帧率和响应改善数据。
  **进一步探讨**：按固定样本保存测量结果和失败日志。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
