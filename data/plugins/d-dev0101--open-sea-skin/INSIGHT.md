# Open Sea

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5a96909](https://github.com/d-dev0101/open-sea-skin/tree/5a969094a275768f88703776f44d3d9dd7f4c765)

<!-- BEGIN META -->
[![GitHub ★ 384](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=384&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/d-dev0101/open-sea-skin) [![npm 30d 7,224](https://img.shields.io/static/v1?label=npm+30d&message=7%2C224&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/open-sea-skin) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/open-sea-skin)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供可调节的实时海洋界面皮肤。

> **亮点**：将可调节的海洋动画和本地资源装配进宿主界面。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：WebGL2 回退不等于跨设备渲染和性能保证。[Q03](#research-q03)

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
  - [Q01 · 谁需要海洋皮肤，静态背景相比多什么？](#detail-section-11)
  - [Q02 · 设置如何到达海洋渲染？](#detail-section-12)
  - [Q03 · 是否要求 WebGPU，所有机器都能渲染吗？](#detail-section-13)
  - [Q04 · 使用、维护和退出需要什么？](#detail-section-14)
  - [Q05 · 现有性能自适应之外，静态切换能否进一步减少资源开销？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：偏好动态工作区的用户；基线是宿主静态主题。[Q01](#research-q01)

使用宿主默认或静态背景。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 海洋 | 动态背景 | 设备图形能力 |
| 设置 | 波浪日照与透明度 | 本地保存 |
| 回退 | 图形 backend 回退 | 不保证性能 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容的 Harness web 宿主 | 必需 | 加载插件与界面 | 使用默认主题 |
| 浏览器图形能力 | 必需 | 渲染海洋 | 停用主题 |
| 本地存储 | 保存设置时 | 持久化偏好 | 需重新设置 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 安装 | 检查宿主版本 | 保留回退 |
| 观察 | 调整海浪和透明度 | 确认可读 |
| 退出 | 禁用主题 | 卡顿时恢复原样 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 图形资源 | 检查兼容 | 设备未测 |
| 持续 | GPU 和电耗未知 | 调整可读性 | 无基准 |
| 恢复 | 无已知新增费用 | 停用并恢复 | 宿主版本影响 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 视觉 | 可调海洋动画 | 阅读效果 |
| 交互 | 消息校验及设置保存 | 所有宿主兼容 |

> **思考**：WebGL2 回退不等于跨设备渲染和性能保证。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将可调节的海洋动画和本地资源装配进宿主界面。[Q01](#research-q01) [Q02](#research-q02)

静态路由约束路径，iframe 通道检查来源；渲染器已具备低端与减动画档、FPS 自适应分辨率和隐藏暂停。[Q02](#research-q02) [Q03](#research-q03) [Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

WebGL2 回退不等于跨设备渲染和性能保证。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先测兼容、可读性和设置恢复；卡顿就停用。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持资源路由、设置通道及回退分支；未运行设备。

- 已检查：作者 README、包清单、源码路径 README.en.md、package.json、plugin/index.js、shared/skin-core.js、shared/native-entry.js、native-dist/ocean.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 67 文件、41 排除、零解析错误；额外核查生成的渲染文件，未执行目标。
- 下一步：固定宿主版本和图形设备检验渲染、设置保存及退出。

**分析版本**

- **仓库**：[d-dev0101/open-sea-skin](https://github.com/d-dev0101/open-sea-skin)
- **版本号**：1.2.7（[固定提交 5a96909](https://github.com/d-dev0101/open-sea-skin/tree/5a969094a275768f88703776f44d3d9dd7f4c765)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：在已有自适应分辨率、低端/减动画策略和隐藏暂停之外，提供可撤销静态模式可能进一步节能；须以同设备比较并保留否定条件。[Q05](#research-q05)

固定宿主版本和图形设备检验渲染、设置保存及退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 23 | 2127 | — | — | 22674 |
| .js | source | 15 | 6098 | 4854 | 699 | — |
| .mjs | source | 13 | 1560 | 1431 | 35 | — |
| .ts | source | 8 | 392 | 297 | 60 | — |
| .tsx | source | 3 | 306 | 256 | 24 | — |
| .mjs | test | 5 | 577 | 523 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/d-dev0101/open-sea-skin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/d-dev0101/open-sea-skin/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/d-dev0101/open-sea-skin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：海洋皮肤如何注入并调节，兼容性和资源开销有什么边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要海洋皮肤，静态背景相比多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

偏好动态界面的 Harness 用户可调整波浪、日照和透明度；作者描述昼夜周期与本地资源。相对静态背景它多动态控制，但不改善模型回答或保证更易阅读；不喜动画或资源受限时用原主题更合适。

#### 证据与依据

**依据 1 · 作者声明**：[README.en.md:64-74](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/README.en.md#L64-L74)

作者描述界面控制、本地资源和减动态。

<details>
<summary>查看原文（11行）</summary>

```text
## ✨ Your workspace, your sea

| Feature | What you can do |
| --- | --- |
| 🌊 Real-time ocean | Watch animated waves and reflections, rather than a looping wallpaper video. |
| 🌅 Daylight & sunset | Set your own light or enable the twelve-minute day/night cycle. |
| 🫧 Transparent interface | Adjust glass opacity from **40% to 90%** in light or dark Harness layouts. |
| 🎛️ Quick controls | Change sea state, sunlight and opacity from the lower-left skin settings panel. |
| 🏠 Your homepage stays yours | The extension does not replace new tabs or change your browser homepage. |
| 🔒 Local assets | Ocean scripts, three.js and fonts ship with the skin; no skin analytics or runtime CDN requests. |
| ⌨️ Thoughtful controls | Chinese/English UI, keyboard navigation, Escape to close, and reduced-motion support. |
```

</details>

**依据 2 · 源码核查**：[package.json:1-5](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/package.json#L1-L5)

包声明是 Harness 的海洋主题。

```text
{
  "name": "open-sea-skin",
  "version": "1.2.7",
  "type": "module",
  "description": "实时海洋皮肤 · Realtime ocean theme for DeepSeek Harness Desktop and Web",
```

#### 缺口

- 未运行宿主、浏览器或 GPU
  **影响**：无法确认显示兼容、帧率和耗电
  **进一步探讨**：指定宿主版本和设备测渲染、设置恢复及退出

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设置如何到达海洋渲染？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 注册静态资源前缀并检查路径落在资源根内；页面创建无交互 iframe，传递父 origin；向其发送 sea、time、auto 消息。渲染器检查发送者是 parent，若设置父 origin 则同时检查 origin。客户端使用 localStorage 保存设置；这条路径是外观控制，不能据此断言整个宿主没有其他数据流。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/index.js:31-50](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/plugin/index.js#L31-L50)

请求方法与路径限制。

<details>
<summary>查看原文（20行）</summary>

```text
async function serveAsset(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    finish(res, 405, { allow: 'GET, HEAD' })
    return
  }

  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url ?? ROUTE, 'http://dsh.local').pathname)
  } catch {
    finish(res, 400)
    return
  }

  const suffix = pathname === ROUTE || pathname === `${ROUTE}/`
    ? 'skin.html'
    : pathname.slice(`${ROUTE}/`.length)
  const target = resolve(ASSET_ROOT, suffix)
  if (target !== ASSET_ROOT && !target.startsWith(`${ASSET_ROOT}${sep}`)) {
    finish(res, 403)
```

</details>

**依据 2 · 源码核查**：[plugin/index.js:73-79](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/plugin/index.js#L73-L79)

注册资源路由。

```text
export function apply(ctx) {
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: ROUTE,
    handler: serveAsset,
  }), 'open-sea-skin: static renderer route')
}
```

**依据 3 · 源码核查**：[shared/skin-core.js:270-277](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/shared/skin-core.js#L270-L277)

向 iframe 发送设置。

```text
    const postToOcean = () => {
      const frame = document.getElementById(IDS.frame);
      if (!(frame instanceof HTMLIFrameElement) || !frame.contentWindow) return;
      let targetOrigin = '*';
      try { targetOrigin = new URL(frame.src).origin; } catch { /* local test documents may have no absolute base URL */ }
      frame.contentWindow.postMessage({
        type: 'oss-set', sea: state.sea, t: state.time, auto: state.autoCycle,
      }, targetOrigin);
```

**依据 4 · 源码核查**：[shared/skin-core.js:326-342](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/shared/skin-core.js#L326-L342)

创建 iframe 并传父 origin。

<details>
<summary>查看原文（17行）</summary>

```text
    const mountOcean = () => {
      const root = document.body || document.documentElement;
      if (!root || document.getElementById(IDS.frame)) return false;
      const frame = document.createElement('iframe');
      const query = new URLSearchParams({
        skin: '1',
        sea: String(state.sea),
        t: String(state.time),
        auto: state.autoCycle ? '1' : '0',
        parentOrigin: location.origin,
      });
      frame.id = IDS.frame;
      frame.src = `${options.assetUrl('skin.html')}?${query}`;
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('tabindex', '-1');
      frame.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;z-index:0;pointer-events:none;background:transparent;';
      root.insertBefore(frame, root.firstChild);
```

</details>

**依据 5 · 源码核查**：[native-dist/ocean.js:367-378](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/native-dist/ocean.js#L367-L378)

校验消息来源和 origin。

<details>
<summary>查看原文（12行）</summary>

```text
// skin controls: the host page sends 波浪大小/日光 adjustments here
if (SKIN) {
  window.addEventListener('message', (ev) => {
    if (ev.source !== window.parent) return;
    if (SKIN_PARENT_ORIGIN && ev.origin !== SKIN_PARENT_ORIGIN) return;
    const d = ev.data;
    if (d && d.type === 'oss-set') {
      manualTimeOfDay = d.auto !== true;
      const sea = Number(d.sea);
      const t = Number(d.t);
      if (Number.isFinite(sea) && sea >= 0 && sea <= 100) {
        uSea.value = 0.25 + (sea / 100) * 1.5;
```

</details>

**依据 6 · 源码核查**：[shared/native-entry.js:1-29](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/shared/native-entry.js#L1-L29)

本地存储设置。

<details>
<summary>查看原文（29行）</summary>

```text
// Static-dist adapter for the shared skin controller.
(() => {
  'use strict';
  const KEYS = {
    enabled: 'ossEnabled', sea: 'ossSea', time: 'ossTime', glass: 'ossGlass', autoCycle: 'ossAutoCycle',
  };
  const read = (key, fallback) => {
    try {
      const value = localStorage.getItem(KEYS[key]);
      if (value === null) return fallback;
      if (key === 'enabled' || key === 'autoCycle') return value !== 'false';
      return Number(value);
    } catch { return fallback; }
  };
  const controller = globalThis.OpenSeaSkinCore.createController({
    assetUrl: (path) => `/open-sea-skin/${path}`,
    storage: {
      get: async (defaults) => ({
        enabled: read('enabled', defaults.enabled),
        sea: read('sea', defaults.sea),
        time: read('time', defaults.time),
        glass: read('glass', defaults.glass),
        autoCycle: read('autoCycle', defaults.autoCycle),
      }),
      set: async (patch) => {
        try {
          for (const [key, value] of Object.entries(patch)) localStorage.setItem(KEYS[key], String(value));
        } catch { /* private or locked-down storage: keep the live value */ }
      },
```

</details>

#### 缺口

- 未运行宿主、浏览器或 GPU
  **影响**：无法确认显示兼容、帧率和耗电
  **进一步探讨**：指定宿主版本和设备测渲染、设置恢复及退出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 是否要求 WebGPU，所有机器都能渲染吗？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不保证。渲染器包含 WebGPU backend 不可用时的 WebGL2 回退分支；这不是所有驱动、远程桌面或宿主都能稳定运行的证明。动态渲染会产生设备开销，静态阅读或卡顿时禁用皮肤；本轮无帧率、电量或设备实测。

#### 证据与依据

**依据 1 · 源码核查**：[native-dist/ocean.js:610-625](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/native-dist/ocean.js#L610-L625)

检查 WebGPU backend 并处理 WebGL2 回退。

<details>
<summary>查看原文（16行）</summary>

```text
        renderer.setAnimationLoop(animate);
      }
    });

    // --- initialize the GPU and start rendering --------------------------------
    await renderer.init();

    if (renderer.backend.isWebGPUBackend !== true) {
      // WebGPU 不可用时 three 自动回退 WebGL2 backend：两种 backend 都允许渲染
      // （2026-08-23 webgui 冒烟测试：用户浏览器无 WebGPU → 纯 WebGPU 检查导致初始化失败）。
      PIXEL_RATIO_CAP = 1.0;
      BASE_PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP);
      FRAME_RATE_CAP = 30;
      FRAME_MS = 1000 / FRAME_RATE_CAP;
      TARGET_FPS = 28;
      renderScale = 0.6;
```

</details>

**依据 2 · 作者声明**：[README.en.md:68-74](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/README.en.md#L68-L74)

作者描述动画及减动态支持。

```text
| 🌊 Real-time ocean | Watch animated waves and reflections, rather than a looping wallpaper video. |
| 🌅 Daylight & sunset | Set your own light or enable the twelve-minute day/night cycle. |
| 🫧 Transparent interface | Adjust glass opacity from **40% to 90%** in light or dark Harness layouts. |
| 🎛️ Quick controls | Change sea state, sunlight and opacity from the lower-left skin settings panel. |
| 🏠 Your homepage stays yours | The extension does not replace new tabs or change your browser homepage. |
| 🔒 Local assets | Ocean scripts, three.js and fonts ship with the skin; no skin analytics or runtime CDN requests. |
| ⌨️ Thoughtful controls | Chinese/English UI, keyboard navigation, Escape to close, and reduced-motion support. |
```

#### 缺口

- 未运行宿主、浏览器或 GPU
  **影响**：无法确认显示兼容、帧率和耗电
  **进一步探讨**：指定宿主版本和设备测渲染、设置恢复及退出

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用、维护和退出需要什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包声明 web 客户端与宿主 bundle，Host 资源路由和本地资源需要兼容版本；GPU/浏览器支持影响显示。首次检查版本并备份当前设置，启动后确认文字可读、设置恢复和退出；异常则停用回原主题。开发脚本和声明的测试不能代替本轮真实设备结果。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:45-63](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/package.json#L45-L63)

客户端平台、构建和测试脚本声明。

<details>
<summary>查看原文（19行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
  },
  "scripts": {
    "build": "node scripts/build-runtime.mjs && node scripts/build-dsh-bundle.mjs",
    "build:site": "node scripts/build-pages.mjs",
    "check:generated": "node scripts/build-runtime.mjs --check && node scripts/build-dsh-bundle.mjs --check",
    "prepublishOnly": "npm run build && npm run check:generated",
    "test": "node --test tests/*.test.mjs",
    "check": "npm run build:site && npm run check:generated && npm test",
    "package:extension": "bash scripts/package-extension.sh",
    "test:browser": "node scripts/browser-acceptance.mjs",
    "test:desktop": "node scripts/desktop-acceptance.mjs && node scripts/official-desktop-acceptance.mjs",
```

</details>

**依据 2 · 源码核查**：[plugin/index.js:10-14](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/plugin/index.js#L10-L14)

依赖 webServer 与本地资源根。

```text
export const name = 'open-sea-skin'
export const inject = ['webServer']

const ROUTE = '/open-sea-skin'
const ASSET_ROOT = resolve(fileURLToPath(new URL('../native-dist/', import.meta.url)))
```

**依据 3 · 作者声明**：[README.en.md:68-74](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/README.en.md#L68-L74)

作者描述支持能力。

```text
| 🌊 Real-time ocean | Watch animated waves and reflections, rather than a looping wallpaper video. |
| 🌅 Daylight & sunset | Set your own light or enable the twelve-minute day/night cycle. |
| 🫧 Transparent interface | Adjust glass opacity from **40% to 90%** in light or dark Harness layouts. |
| 🎛️ Quick controls | Change sea state, sunlight and opacity from the lower-left skin settings panel. |
| 🏠 Your homepage stays yours | The extension does not replace new tabs or change your browser homepage. |
| 🔒 Local assets | Ocean scripts, three.js and fonts ship with the skin; no skin analytics or runtime CDN requests. |
| ⌨️ Thoughtful controls | Chinese/English UI, keyboard navigation, Escape to close, and reduced-motion support. |
```

#### 缺口

- 未运行宿主、浏览器或 GPU
  **影响**：无法确认显示兼容、帧率和耗电
  **进一步探讨**：指定宿主版本和设备测渲染、设置恢复及退出

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 现有性能自适应之外，静态切换能否进一步减少资源开销？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：在已有动态分辨率和帧率限制之外，当持续低帧率或用户选择时提供可撤销的静态背景，可能进一步减少耗电与卡顿。反证是当前已依据低端设备及减动画设置降低帧率和像素比、每两秒依据 FPS 调整分辨率、标签隐藏时暂停，并在 WebGL2 分支降级；因此不能把这些已有能力当作新增设计。未穷尽其他等价实现。以同设备对照当前策略、静态模式与用户手动关闭，测帧率、电耗、阅读和误切换；无额外收益或干扰过大则否定。

#### 证据与依据

**依据 1 · 源码核查**：[native-dist/ocean.js:35-41](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/native-dist/ocean.js#L35-L41)

读取减动画与低端设备判断。

```text
const REDUCED_MOTION = typeof matchMedia === 'function'
  && matchMedia('(prefers-reduced-motion: reduce)').matches;
const QUALITY = SKIN_QUERY.get('quality') || 'auto';
const LOW_END_DEVICE = QUALITY === 'low' || (QUALITY === 'auto' && (
  (navigator.hardwareConcurrency || 8) <= 4
  || ('deviceMemory' in navigator && Number(navigator.deviceMemory) <= 4)
));
```

**依据 2 · 源码核查**：[native-dist/ocean.js:419-425](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/native-dist/ocean.js#L419-L425)

设备档设置像素比、帧率及目标。

```text
let PIXEL_RATIO_CAP = REDUCED_MOTION ? 0.9 : LOW_END_DEVICE ? 1.0 : 1.5;
let BASE_PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP);
let FRAME_RATE_CAP = REDUCED_MOTION ? 20 : LOW_END_DEVICE ? 30 : 60;
let FRAME_MS = 1000 / FRAME_RATE_CAP;
let TARGET_FPS = REDUCED_MOTION ? 18 : LOW_END_DEVICE ? 28 : SKIN ? 40 : 55;
const MIN_SCALE = REDUCED_MOTION ? 0.5 : SKIN ? 0.5 : 0.55;
let renderScale = 1;
```

**依据 3 · 源码核查**：[native-dist/ocean.js:446-467](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/native-dist/ocean.js#L446-L467)

滚动帧率和动态分辨率调整。

<details>
<summary>查看原文（22行）</summary>

```text
  // rolling FPS + adaptive resolution (rechecked every 2 s)
  // wall-clock windows: skipped frames must not shrink the meter's time base
  fpsFrames += 1;
  fpsWindow += (now - fpsStamp) / 1000;
  fpsStamp = now;
  adaptWindow += (now - adaptStamp) / 1000;
  adaptStamp = now;
  if (fpsWindow >= 0.5) {
    fpsNow = fpsFrames / fpsWindow;
    fpsFrames = 0;
    fpsWindow = 0;
    if (fpsReadout) fpsReadout.textContent = String(Math.round(fpsNow)).padStart(2, '0') + ' FPS';
  }
  if (adaptWindow >= 2) {
    adaptWindow = 0;
    if (fpsNow > 0) {
      if (fpsNow < TARGET_FPS - 8 && renderScale > MIN_SCALE) {
        renderScale = Math.max(MIN_SCALE, +(renderScale * 0.92).toFixed(3));
        applyResolutionScale(renderScale);
      } else if (fpsNow > TARGET_FPS + 8 && renderScale < 1) {
        renderScale = Math.min(1, +(renderScale * 1.06).toFixed(3));
        applyResolutionScale(renderScale);
```

</details>

**依据 4 · 源码核查**：[native-dist/ocean.js:603-610](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/native-dist/ocean.js#L603-L610)

隐藏时暂停、恢复时继续渲染。

```text
    document.addEventListener('visibilitychange', () => {
      if (!loopStarted) return;
      if (document.hidden) {
        renderer.setAnimationLoop(null);
      } else {
        lastFrameTime = performance.now();
        lastRenderAt = 0;
        renderer.setAnimationLoop(animate);
```

**依据 5 · 源码核查**：[native-dist/ocean.js:617-626](https://github.com/d-dev0101/open-sea-skin/blob/5a969094a275768f88703776f44d3d9dd7f4c765/native-dist/ocean.js#L617-L626)

WebGL2 回退及分辨率上限。

<details>
<summary>查看原文（10行）</summary>

```text
    if (renderer.backend.isWebGPUBackend !== true) {
      // WebGPU 不可用时 three 自动回退 WebGL2 backend：两种 backend 都允许渲染
      // （2026-08-23 webgui 冒烟测试：用户浏览器无 WebGPU → 纯 WebGPU 检查导致初始化失败）。
      PIXEL_RATIO_CAP = 1.0;
      BASE_PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP);
      FRAME_RATE_CAP = 30;
      FRAME_MS = 1000 / FRAME_RATE_CAP;
      TARGET_FPS = 28;
      renderScale = 0.6;
      applyResolutionScale(renderScale);
```

</details>

#### 缺口

- 未运行宿主、浏览器或 GPU
  **影响**：无法确认显示兼容、帧率和耗电
  **进一步探讨**：指定宿主版本和设备测渲染、设置恢复及退出

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
