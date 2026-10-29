# Open Sea

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[387740c](https://github.com/d-dev0101/open-sea-skin/tree/387740c974f3fd47ef22eebd7c20da4645f2f213)

<!-- BEGIN META -->
[![GitHub ★ 385](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=385&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/d-dev0101/open-sea-skin) [![npm 30d 7,094](https://img.shields.io/static/v1?label=npm+30d&message=7%2C094&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/open-sea-skin) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/open-sea-skin)
<!-- END META -->

> **功能**：为 DSH 添加实时海洋背景、可调日光与玻璃透明界面，并提供皮肤设置面板。

> **亮点**：相对静态壁纸，增加即时可调的海浪、日光与玻璃视觉层，并以共享控制器适配原生插件路径；它服务视觉偏好，未证明提高工作效率。见[Q01](#research-q01)与[Q02](#research-q02)。

> **主要限制**：减少动态仍继续渲染，窗口路径和宿主样式变化也可能使背景或可读性不成立；只有目标设备中的清晰与舒适才支持保留。见[Q03](#research-q03)与[Q04](#research-q04)。

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
  - [Q01 · 谁需要海洋皮肤，相比静态背景多什么？](#detail-section-11)
  - [Q02 · 设置如何到达海洋渲染，是否影响聊天数据？](#detail-section-12)
  - [Q03 · 性能、减少动态、宿主与退出有哪些边界？](#detail-section-13)
  - [Q04 · 全周期成本与效果是什么？](#detail-section-14)
  - [Q05 · 谁可试用，什么假设可检验？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望个性化DSH界面的人可调海洋、日光和玻璃层，合格结果仍须文字输入清楚且可退出。见[Q01](#research-q01)。

直接替代是宿主原生主题或静态壁纸，开销与适配更简单。实时海洋和共享控制器是本项集成，three.js图形能力不算原创，也没有效率实测。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 实时海洋与日光 | 可调背景与自动光照循环 | 图形后端可用，未证明效率收益 |
| 玻璃调整 | 控制40–90不透明度 | 宿主控件对比度需本机检查 |
| 偏好与快捷面板 | 当前页调整并保存数值 | 原生路径localStorage，禁用存储不保证持久 |
| 设备降载 | 限帧、自适应分辨率及隐藏暂停 | 减少动态仍动画，不是静止或功耗保证 |
| 可退出视觉层 | 撤去自己挂载的iframe与样式 | 关闭保留面板，停用后刷新核恢复 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web宿主和webServer | 原生插件必需 | 加载客户端及本地渲染资源 | 入口不兼容时停用，不能套用旧源码接入路径 |
| 浏览器图形能力及硬件 | 海洋必需 | three的WebGPU或WebGL2渲染 | 两种后端均失败则无海洋，需关闭视觉层 |
| 根/open-sea-skin/资源可达 | iframe必需 | 获取skin.html及相对资源 | 仅前缀代理可能失败，应核URL |
| localStorage | 偏好持久化 | 保存视觉数值 | 禁用存储时仅当前页生效或重载回默认 |
| 用户可读性与设备预算 | 保留前提 | 控制视觉与功耗负担 | 不满足时返回静态或原生主题 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户只选一种安装方式并保留原主题 | 不混装扩展和插件 |
| 加载 | 按README安装原生插件并按宿主提示刷新/重启 | 本轮未安装验收，确认资源与海洋加载 |
| 调整 | 用户在面板调玻璃、海浪和日光 | 输入、代码和弹窗清楚可用 |
| 保留判断 | 用户比较开关前后设备与舒适度 | 发热、卡顿或不适则关闭 |
| 退出 | 面板关闭海洋或停用插件并刷新 | 原界面恢复，偏好可能仍保留 |

**效果与成本**

动态皮肤的主要代价是设备资源和界面适配，而非模型费用。是否值得保留应由同设备的阅读与输入任务决定，阶段成本表见[Q04](#research-q04)。

源码能证明控制与降载分支存在，不能替用户确定美观、舒适或节能。把画面加载、任务可读和愿意持续开启分别观察，具体效果支持与未知见[Q04](#research-q04)。

> **思考**：减少动态仍继续渲染，窗口路径和宿主样式变化也可能使背景或可读性不成立；只有目标设备中的清晰与舒适才支持保留。见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对静态壁纸，增加即时可调的海浪、日光与玻璃视觉层，并以共享控制器适配原生插件路径；它服务视觉偏好，未证明提高工作效率。见[Q01](#research-q01)与[Q02](#research-q02)。

共享控制器加存储适配、iframe隔离渲染、保留关闭后的设置入口与生命周期清理可借鉴。自动分辨率关注帧率而非功耗；固定DOM选择器和根资源路径使宿主升级与代理部署需要复核。shared/native渲染文件逐字一致，未运行构建或浏览器验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

减少动态仍继续渲染，窗口路径和宿主样式变化也可能使背景或可读性不成立；只有目标设备中的清晰与舒适才支持保留。见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在自己的设备只试原生插件一条路径，检查长文本、代码与弹窗，再观察开关前后发热和输入延迟。减少动态仍不适或视觉妨碍任务时关闭海洋，见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持本地渲染控制、降载和可退出机制；1.2.6真实宿主画面、设备负担和阅读舒适度没有独立验证。静止预算模式为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、plugin/index.js、plugin/client.js、shared/skin-core.js、shared/ocean.js、native-dist/ocean.js、native-dist/skin.html 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查原生plugin服务端与client关键链、共享控制器、渲染初始化/动画/退出、本地skin入口与作者兼容说明；不全审three/vendor、浏览器扩展、静态安装器或旧源码接入。
- 下一步：在固定设备和宿主对照原生主题、动态与静止海洋的阅读错误、输入延迟、GPU/功耗与舒适度，验证关闭清理；当前为建议，未执行。

**分析版本**

- **仓库**：[d-dev0101/open-sea-skin](https://github.com/d-dev0101/open-sea-skin)
- **版本号**：1.2.6（[固定提交 387740c](https://github.com/d-dev0101/open-sea-skin/tree/387740c974f3fd47ef22eebd7c20da4645f2f213)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可检验显式静止帧与用户资源预算是否在保留外观时减少运动和GPU负担；当前源码未实现该保证。见[Q05](#research-q05)。

在固定设备和宿主对照原生主题、动态与静止海洋的阅读错误、输入延迟、GPU/功耗与舒适度，验证关闭清理；当前为建议，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 21 | 1884 | — | — | 18011 |
| .js | source | 15 | 6038 | 4822 | 663 | — |
| .mjs | source | 12 | 1253 | 1141 | 26 | — |
| .ts | source | 8 | 392 | 297 | 60 | — |
| .tsx | source | 3 | 306 | 256 | 24 | — |
| .mjs | test | 4 | 396 | 355 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/d-dev0101/open-sea-skin/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Open Sea的原生插件路径能否提供可调且可退出的海洋背景，它与静态壁纸相比的增量是否值得图形和兼容成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要海洋皮肤，相比静态背景多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Open Sea服务于希望把DSH工作界面改成可调海洋背景的人。它的合格结果是海浪、日光与玻璃不透明度可控制，文字与输入控件仍清楚可用，而且用户能够关闭背景。美观与沉浸感有个人差异，不能从动态画面推出专注度或工作效率提高。

本包有默认宿主插件、Web客户端和bundle，属于原生DSH插件；仓库另外提供浏览器扩展、静态前端修改和源码集成，它们不是同一安装路径。本研究以package默认plugin/index.js及plugin/client.js为主，不把旧源码集成的兼容基线套到当前安装插件。

相对静态壁纸，本项增加实时海浪、光照循环、玻璃调整与即时控制，且不要求修改宿主源码。渲染建立在three.js与TSL之上，不把通用图形库能力当本插件原创。对只需要清晰、稳定背景的人，原生主题或静态图仍是更轻的直接替代；作者动图说明目标外观，未独立证明设备负担或主观体验。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:62-72](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/README.md#L62-L72)

作者描述海洋、日光、玻璃和本地资源。

<details>
<summary>查看原文（11行）</summary>

```text
## ✨ 不只是换一张壁纸

| 特色 | 你能体验到什么 |
| --- | --- |
| 🌊 实时海洋 | 实时渲染海浪与反射，不是循环播放的壁纸视频。 |
| 🌅 阳光与夕阳 | 自己选择光照，或开启 12 分钟自动昼夜循环。 |
| 🫧 透明玻璃界面 | 玻璃不透明度可在 **40%–90%** 间调整，适配 Harness 深色与浅色布局。 |
| 🎛️ 快捷调节 | 左下角打开皮肤设置，即时调整波浪、日光和透明度。 |
| 🏠 保留你的主页 | 不接管浏览器新标签页，不改掉原来安装的主页插件。 |
| 🔒 本地资源 | 海洋脚本、three.js 与字体随包提供，无皮肤遥测或运行时 CDN 请求。 |
| ⌨️ 顺手的交互 | 中英文界面、键盘操作、Esc 关闭，以及减少动态效果支持。 |
```

</details>

**依据 2 · 源码核查**：[plugin/index.js:1-20](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/plugin/index.js#L1-L20)

宿主插件服务本地资源，默认入口成立。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Installable DeepSeek Harness Host plugin for Open Sea.
 * Serves the self-contained renderer under /open-sea-skin without patching
 * the Harness checkout.
 */
import { readFile } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'open-sea-skin'
export const inject = ['webServer']

const ROUTE = '/open-sea-skin'
const ASSET_ROOT = resolve(fileURLToPath(new URL('../native-dist/', import.meta.url)))
const MIME = Object.freeze({
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
})
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-6](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/cordis.patch.yml#L1-L6)

bundle挂载当前插件路径。

```text
# DeepSeek Harness bundle layer. Installing this repository with
# `dsh plugin --profile web add github:d-dev0101/open-sea-skin` adds the Host
# route and the matching browser module without modifying Harness source.
- insert:
    - id: open-sea-skin
      name: open-sea-skin
```

#### 缺口

- 缺同设备静态与动态背景的体验对照。
  **影响**：不能把视觉表现转成专注或效率收益。
  **进一步探讨**：由目标用户在同任务中比较阅读错误、舒适度与设备负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设置如何到达海洋渲染，是否影响聊天数据？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主只为/open-sea-skin提供GET/HEAD静态资源，解析路径后限定目标仍在native-dist内。客户端加载同一共享控制器，读取ossEnabled、ossSea等本地偏好，建立背景iframe及玻璃样式，再把波浪、时间和自动循环通过query与postMessage传给海洋页。skin.html从包内相对地址加载ocean.js，ocean再导入本地vendor库；本轮逐字核对shared/ocean.js与native-dist/ocean.js相同。

控制器把iframe置于底层且pointer-events:none，设置按钮与面板由DOM挂载。滑块改状态、保存偏好并更新玻璃CSS或通知iframe，手动日光会关闭自动循环。面板处理Esc和Tab焦点循环，关闭后还原先前焦点。可借鉴的是共享控制器加存储适配器，让原生插件与扩展复用界面和退出机制；DOM与宿主选择器仍有耦合。

已核路径没有订阅聊天消息、上传聊天或分析接口，传给iframe的是视觉数值而非会话正文。因此可以限定说明这条皮肤主链不以聊天内容为输入，不能据此替宿主和全部第三方库作隐私保证。插件路径使用localStorage存偏好；扩展的同步存储是另一条适配路径，不应混写成插件会跨设备同步。存储不可用时异常被捕获，当前页仍可调整，重载后可能回默认。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/index.js:31-66](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/plugin/index.js#L31-L66)

GET/HEAD静态读取及路径边界，不是聊天API。

<details>
<summary>查看原文（36行）</summary>

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
    return
  }

  try {
    const body = await readFile(target)
    res.writeHead(200, {
      'cache-control': 'no-cache',
      'content-length': String(body.byteLength),
      'content-type': MIME[extname(target)] ?? 'application/octet-stream',
      'x-content-type-options': 'nosniff',
    })
    res.end(req.method === 'HEAD' ? undefined : body)
  } catch (error) {
    if (error instanceof Error && 'code' in error
      && (error.code === 'ENOENT' || error.code === 'EISDIR')) {
      finish(res, 404)
```

</details>

**依据 2 · 源码核查**：[plugin/client.js:562-606](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/plugin/client.js#L562-L606)

真实客户端接入localStorage和stop生命周期。

<details>
<summary>查看原文（45行）</summary>

```text
  const KEYS = Object.freeze({
    enabled: 'ossEnabled',
    sea: 'ossSea',
    time: 'ossTime',
    glass: 'ossGlass',
    autoCycle: 'ossAutoCycle',
  });

  function readSetting(key, fallback) {
    try {
      const value = localStorage.getItem(KEYS[key]);
      if (value === null) return fallback;
      if (key === 'enabled' || key === 'autoCycle') return value !== 'false';
      return Number(value);
    } catch {
      return fallback;
    }
  }

  exports.name = 'open-sea-skin-client';
  exports.inject = [];
  exports.apply = function apply(ctx) {
    const controller = globalThis.OpenSeaSkinCore.createController({
      assetUrl: (path) => '/open-sea-skin/' + path,
      storage: {
        get: async (defaults) => ({
          enabled: readSetting('enabled', defaults.enabled),
          sea: readSetting('sea', defaults.sea),
          time: readSetting('time', defaults.time),
          glass: readSetting('glass', defaults.glass),
          autoCycle: readSetting('autoCycle', defaults.autoCycle),
        }),
        set: async (patch) => {
          try {
            for (const [key, value] of Object.entries(patch)) {
              localStorage.setItem(KEYS[key], String(value));
            }
          } catch {
            // Locked-down storage keeps the live value for this page.
          }
        },
      },
    });
    void controller.start();
    ctx.effect(() => () => controller.stop(), 'open-sea-skin: browser surface');
```

</details>

**依据 3 · 源码核查**：[shared/skin-core.js:255-263](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/shared/skin-core.js#L255-L263)

postMessage只传视觉设置。

```text
    const postToOcean = () => {
      const frame = document.getElementById(IDS.frame);
      if (!(frame instanceof HTMLIFrameElement) || !frame.contentWindow) return;
      let targetOrigin = '*';
      try { targetOrigin = new URL(frame.src).origin; } catch { /* local test documents may have no absolute base URL */ }
      frame.contentWindow.postMessage({
        type: 'oss-set', sea: state.sea, t: state.time, auto: state.autoCycle,
      }, targetOrigin);
    };
```

**依据 4 · 源码核查**：[shared/skin-core.js:311-334](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/shared/skin-core.js#L311-L334)

背景iframe与玻璃CSS挂载。

<details>
<summary>查看原文（24行）</summary>

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

      const style = document.createElement('style');
      style.id = IDS.glass;
      style.textContent = glassCss(state.glass);
      (document.head || document.documentElement).appendChild(style);
      ownsSurface = true;
      return true;
```

</details>

**依据 5 · 源码核查**：[shared/skin-core.js:413-474](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/shared/skin-core.js#L413-L474)

调整、自动循环与键盘处理。

<details>
<summary>查看原文（62行）</summary>

```text
      on(seaRange, 'input', () => {
        state.sea = clamp(seaRange.value, 0, 100, DEFAULTS.sea);
        seaOut.textContent = String(state.sea).padStart(2, '0');
        void save({ sea: state.sea });
        postToOcean();
      });
      on(timeRange, 'input', () => {
        state.time = clamp(timeRange.value, 0, 100, DEFAULTS.time);
        state.autoCycle = false;
        timeOut.textContent = timeLabel(copy, state.time);
        cycleBox.checked = false;
        void save({ time: state.time, autoCycle: false });
        postToOcean();
      });
      on(glassRange, 'input', () => {
        state.glass = clamp(glassRange.value, 40, 90, DEFAULTS.glass);
        glassOut.textContent = `${state.glass}%`;
        updateGlass();
        void save({ glass: state.glass });
      });

      on(enabledBox, 'change', () => {
        state.enabled = enabledBox.checked;
        void save({ enabled: state.enabled });
        // Only tear down the ocean surface, never the button/panel: otherwise
        // a disabled skin has no settings entry left to re-enable it.
        applyEnabled();
      });
      on(cycleBox, 'change', () => {
        state.autoCycle = cycleBox.checked;
        void save({ autoCycle: state.autoCycle });
        postToOcean();
      });
      on(resetBtn, 'click', () => {
        void save({ ...DEFAULTS }).then(() => {
          syncUi();
          updateGlass();
          postToOcean();
          applyEnabled();
        });
      });

      on(button, 'click', () => setPanelOpen(!panelOpen));
      on(panel.querySelector('.oss-close'), 'click', () => setPanelOpen(false));
      on(document, 'click', (event) => {
        if (panelOpen && !panel.contains(event.target) && !button.contains(event.target)) setPanelOpen(false);
      });
      on(document, 'keydown', (event) => {
        if (!panelOpen) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          setPanelOpen(false);
          return;
        }
        if (event.key !== 'Tab') return;
        const focusable = [...panel.querySelectorAll('button, input')].filter((element) => !element.disabled);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });
```

</details>

**依据 6 · 源码核查**：[native-dist/skin.html:23-27](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/native-dist/skin.html#L23-L27)

海洋页本地模块入口。

```text
<body>
  <div id="vignette" aria-hidden="true"></div>
  <script type="module" src="./ocean.js?skin=1"></script>
</body>
</html>
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 性能、减少动态、宿主与退出有哪些边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

渲染器在皮肤模式请求low-power图形适配器，按设备与减少动态偏好限制像素比和帧率，并每两秒依据帧率调整分辨率。页面隐藏时暂停动画。源码允许three的WebGL2后端回退，回退后降低像素比、帧率与初始渲染比例；不能只凭项目名WebGPU宣称所有无WebGPU设备必然不可用，但具体设备成功仍需试验。

“减少动态”不是停止动画。它将时间推进乘0.12并设较低帧率，仍继续render；用户需要静止背景时应关闭海洋。图形初始化失败在iframe内部报告，父控制器仍可能注入玻璃CSS；画面失败时应以开关撤去海洋与玻璃，而不是继续认为皮肤已正确加载。截图里可读也不保证所有宿主弹窗、主题和长内容可读。

客户端资源URL固定为根路径/open-sea-skin/，若部署只把/app/dsh/之类前缀代理到宿主、却没有暴露根资源，该iframe会请求错误位置；这是有条件的路径兼容限制，不是本轮复现失败。控制器关闭时移除自己拥有的iframe与玻璃，保留按钮以便重新开启；插件卸载生命周期stop还清理观察器、事件与面板。共享ID防重复背景，但作者仍建议只选一种安装方式，不能依赖ID去保证任意双安装顺序可靠。

#### 证据与依据

**依据 1 · 源码核查**：[shared/ocean.js:420-464](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/shared/ocean.js#L420-L464)

帧率、减速与自适应分辨率，减少动态仍渲染。

<details>
<summary>查看原文（45行）</summary>

```text
let PIXEL_RATIO_CAP = REDUCED_MOTION ? 0.9 : LOW_END_DEVICE ? 1.0 : 1.5;
let BASE_PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP);
let FRAME_RATE_CAP = REDUCED_MOTION ? 20 : LOW_END_DEVICE ? 30 : 60;
let FRAME_MS = 1000 / FRAME_RATE_CAP;
let TARGET_FPS = REDUCED_MOTION ? 18 : LOW_END_DEVICE ? 28 : SKIN ? 40 : 55;
const MIN_SCALE = REDUCED_MOTION ? 0.5 : SKIN ? 0.5 : 0.55;
let renderScale = 1;

function applyResolutionScale(scale) {
  renderer.setPixelRatio(BASE_PIXEL_RATIO * scale);
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(now) {
  // high-resolution timestamp -> delta, clamped so hitches never cause jumps
  const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
  lastFrameTime = now;

  uTime.value += dt * (REDUCED_MOTION ? 0.12 : 1);
  controls.update();

  // frame cap: skip work when the display fires faster than 60 Hz
  if (now - lastRenderAt < FRAME_MS - 0.5) return;
  lastRenderAt = now;

  postProcessing.render();

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
```

</details>

**依据 2 · 源码核查**：[shared/ocean.js:491-505](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/shared/ocean.js#L491-L505)

low-power图形初始化。

<details>
<summary>查看原文（15行）</summary>

```text
async function boot() {
  // 不再预检 navigator.gpu：无 WebGPU API（低配/无显卡环境）时 three 自动
  // 回退 WebGL2 backend（2026-08-23 冒烟测试：预检导致黑底白字异常画面，
  // 实际 WebGL2 渲染完全可用）；两个 backend 都失败由 init() 抛出走
  // showInitError（准确错误信息，而不是笼统的「WEBGPU UNAVAILABLE」）。

  try {
    // --- renderer (no MSAA; low-power adapter in skin mode) ---------------
    renderer = new THREE.WebGPURenderer({
      antialias: false, // MSAA is inert under the post pipeline — pure savings
      powerPreference: SKIN ? 'low-power' : 'high-performance',
    });
    renderer.setPixelRatio(BASE_PIXEL_RATIO);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
```

</details>

**依据 3 · 源码核查**：[shared/ocean.js:603-634](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/shared/ocean.js#L603-L634)

隐藏暂停与WebGL2回退分支。

<details>
<summary>查看原文（32行）</summary>

```text
    // --- lifecycle: pause when the tab is hidden -------------------------------
    document.addEventListener('visibilitychange', () => {
      if (!loopStarted) return;
      if (document.hidden) {
        renderer.setAnimationLoop(null);
      } else {
        lastFrameTime = performance.now();
        lastRenderAt = 0;
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
      applyResolutionScale(renderScale);
    }

    loopStarted = true;
    renderer.setAnimationLoop(animate);
  } catch (err) {
    showInitError(err);
  }
```

</details>

**依据 4 · 源码核查**：[plugin/client.js:583-606](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/plugin/client.js#L583-L606)

根资源路径与生命周期清理。

<details>
<summary>查看原文（24行）</summary>

```text
  exports.apply = function apply(ctx) {
    const controller = globalThis.OpenSeaSkinCore.createController({
      assetUrl: (path) => '/open-sea-skin/' + path,
      storage: {
        get: async (defaults) => ({
          enabled: readSetting('enabled', defaults.enabled),
          sea: readSetting('sea', defaults.sea),
          time: readSetting('time', defaults.time),
          glass: readSetting('glass', defaults.glass),
          autoCycle: readSetting('autoCycle', defaults.autoCycle),
        }),
        set: async (patch) => {
          try {
            for (const [key, value] of Object.entries(patch)) {
              localStorage.setItem(KEYS[key], String(value));
            }
          } catch {
            // Locked-down storage keeps the live value for this page.
          }
        },
      },
    });
    void controller.start();
    ctx.effect(() => () => controller.stop(), 'open-sea-skin: browser surface');
```

</details>

**依据 5 · 源码核查**：[shared/skin-core.js:482-519](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/shared/skin-core.js#L482-L519)

退出、保留控制入口及共享ID边界。

<details>
<summary>查看原文（38行）</summary>

```text
    const unmount = () => {
      panelOpen = false;
      placementObserver?.disconnect();
      placementObserver = null;
      cancelAnimationFrame(placementFrame);
      while (surfaceCleanups.length > 0) surfaceCleanups.pop()();
      if (ownsSurface) {
        document.getElementById(IDS.frame)?.remove();
        document.getElementById(IDS.glass)?.remove();
      }
      document.getElementById(IDS.button)?.remove();
      document.getElementById(IDS.panel)?.remove();
      document.getElementById(IDS.uiStyle)?.remove();
      ownsSurface = false;
    };

    const applyEnabled = () => {
      // The button/panel are the only way back in: mount the UI entry
      // regardless of enabled state, so a skin that starts disabled (or on a
      // host page that saved disabled) still offers the enable switch
      // (2026-08-23: previously the button was created only on first enable,
      // leaving a disabled-after-reload skin with no entry point at all).
      if (!document.getElementById(IDS.button)) mountUi();
      if (!state.enabled) {
        // Tear down only the ocean surface (frame + glass), keeping the
        // button/panel so the skin can be re-enabled from the same page.
        if (ownsSurface) {
          document.getElementById(IDS.frame)?.remove();
          document.getElementById(IDS.glass)?.remove();
          ownsSurface = false;
        }
        return;
      }
      // The extension and both native paths intentionally share the same ids.
      // Whichever implementation mounted first owns the surface; later ones
      // leave it untouched instead of double-rendering WebGPU.
      if (document.getElementById(IDS.frame)) return;
      if (mountOcean()) mountUi();
```

</details>

#### 缺口

- 具体设备、宿主主题与图形回退性能未实测。
  **影响**：不能保证可读性、帧率、耗电或兼容覆盖。
  **进一步探讨**：固定设备和宿主检查文字、弹窗、开关和显卡负担。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 全周期成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

一次合格使用应是在用户的真实DSH界面上维持文字输入和阅读，同时提供其愿意保留的视觉体验。动态背景不是业务自动化，也没有模型token节省机制；成本主要是GPU、内存、用电、加载和调试时间。代码中的限帧和低功耗请求只说明优化手段，不证明低耗电。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 插件及本地渲染资源下载、图形初始化；费用未知 | 选择唯一安装路径、调整透明度和检查主题 | 本轮未安装，实际加载时长未知 |
| 持续使用 | GPU渲染、内存与用电；金额和功耗未知 | 检查输入、弹窗与阅读是否受干扰 | 隐藏暂停和降载不等于零开销 |
| 失败恢复 | 重新载入或关闭渲染 | 区分图形、路径和样式问题，停用后核对原界面 | 父页不主动验证iframe画面成功 |
| 退出 | 偏好仍可能留在localStorage | 关闭海洋或停用/卸载插件并刷新 | 关闭只撤视觉层，不清全部浏览器偏好 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 动态海洋与日光 | 本地three渲染与控制消息链 | 设备上是否流畅、是否符合偏好 |
| 可控玻璃层 | 40–90数值约束、即时CSS更新 | 全宿主组件的对比度与可读性 |
| 降低后台负担 | 隐藏暂停、低功耗请求和动态分辨率 | 实际GPU利用率、功耗和电池影响 |

README自述官方macOS Desktop上验证的是v1.2.5，当前固定包是1.2.6，不能继承成同版本真实宿主验收；Windows原生Desktop也被作者明确标为尚未完成端到端测试。本轮没有运行作者浏览器或桌面脚本。

#### 证据与依据

**依据 1 · 源码核查**：[shared/ocean.js:420-464](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/shared/ocean.js#L420-L464)

资源控制机制但无实测功耗。

<details>
<summary>查看原文（45行）</summary>

```text
let PIXEL_RATIO_CAP = REDUCED_MOTION ? 0.9 : LOW_END_DEVICE ? 1.0 : 1.5;
let BASE_PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP);
let FRAME_RATE_CAP = REDUCED_MOTION ? 20 : LOW_END_DEVICE ? 30 : 60;
let FRAME_MS = 1000 / FRAME_RATE_CAP;
let TARGET_FPS = REDUCED_MOTION ? 18 : LOW_END_DEVICE ? 28 : SKIN ? 40 : 55;
const MIN_SCALE = REDUCED_MOTION ? 0.5 : SKIN ? 0.5 : 0.55;
let renderScale = 1;

function applyResolutionScale(scale) {
  renderer.setPixelRatio(BASE_PIXEL_RATIO * scale);
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(now) {
  // high-resolution timestamp -> delta, clamped so hitches never cause jumps
  const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
  lastFrameTime = now;

  uTime.value += dt * (REDUCED_MOTION ? 0.12 : 1);
  controls.update();

  // frame cap: skip work when the display fires faster than 60 Hz
  if (now - lastRenderAt < FRAME_MS - 0.5) return;
  lastRenderAt = now;

  postProcessing.render();

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
```

</details>

**依据 2 · 源码核查**：[shared/skin-core.js:427-439](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/shared/skin-core.js#L427-L439)

玻璃范围及关闭入口。

<details>
<summary>查看原文（13行）</summary>

```text
      on(glassRange, 'input', () => {
        state.glass = clamp(glassRange.value, 40, 90, DEFAULTS.glass);
        glassOut.textContent = `${state.glass}%`;
        updateGlass();
        void save({ glass: state.glass });
      });

      on(enabledBox, 'change', () => {
        state.enabled = enabledBox.checked;
        void save({ enabled: state.enabled });
        // Only tear down the ocean surface, never the button/panel: otherwise
        // a disabled skin has no settings entry left to re-enable it.
        applyEnabled();
```

</details>

**依据 3 · 作者声明**：[README.md:234-249](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/README.md#L234-L249)

作者兼容版本和性能说明，非本轮独立验证。

<details>
<summary>查看原文（16行）</summary>

```text

<details>
<summary><strong>是否保证兼容所有最新版 Harness / Desktop？</strong></summary>

不做全版本兼容承诺。原生源码集成的验证基线为 Harness `0.1.2-alpha.3`、提交 `dd6322d60`（2026 年 8 月 31 日）。**官方 macOS Desktop `0.2.0-rc.2`** 已在隔离配置中实装 v1.2.5 并目视验证。社区 DSH Desktop Beta `2.0.5-beta.1` 有 24 组外壳回归组合；官方 0.2.x 的 macOS/Windows 页面结构也加入了浏览器回归测试。Windows 原生 Desktop 尚未完成端到端测试。

如果升级后遇到问题，请[提供 Harness 版本、安装方式，以及去除敏感信息的截图或日志](https://github.com/d-dev0101/open-sea-skin/issues)。

</details>

<details>
<summary><strong>会占用很多性能吗？聊天数据安全吗？</strong></summary>

渲染器支持自适应分辨率、隐藏标签页暂停和减少动态效果。动态 3D 海洋仍会使用 GPU，建议先在官网用自己的设备体验。

皮肤不收集或上传聊天数据；扩展权限仅用于存储设置和访问本地 Harness。这描述的是 Open Sea，不代表宿主应用自身的数据处理行为。[隐私与权限说明 →](docs/privacy.md)
```

</details>

#### 缺口

- 缺1.2.6固定版本同设备开关前后资源与可读性记录。
  **影响**：不能证明持续体验收益超过性能成本。
  **进一步探讨**：比较同屏任务的输入延迟、GPU占用、耗电和阅读错误，不用截图替代。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可试用，什么假设可检验？

**研究主题**：采用判断、新假设与验证

#### 完整回答

重视界面个性化、能接受图形开销且可以随时关闭视觉层的DSH用户，可先小范围试用原生插件路径。只选一种安装方式，保留原主题设置，先核对输入框、长文本、代码、菜单和弹窗的清晰度，再调玻璃不透明度；在自己的设备比较开关前后发热、风扇和输入延迟。只有显示效果符合偏好且不妨碍工作时才保留，不把它当效率插件。

若海洋未加载但界面透明、出现明显卡顿或发热、减少动态仍让人不适，先关闭面板内海洋；需要完整退出时停用插件并刷新，核对DOM与样式恢复。只希望静止背景、低电量或必须保证高对比度的人，应优先原生主题或静态壁纸。以上是基于源码可退出机制的试用建议，不是已安装通过。

可提出未验证的“显式静止与资源预算”假设。当前减少动态仍渲染，自动降分辨率只盯帧率；若加入明确静止帧与用户设备预算，可能保留海洋色彩和玻璃外观，同时降低运动刺激及资源开销。它不是现有的减少动态功能，需要新增状态与恢复逻辑。

最小验证用同一设备同一工作界面对比原生主题、当前动态与静止海洋，记录阅读错误、输入延迟、GPU/功耗和主观舒适度。若静止方案没有降低负担或用户不愿保留效果，就否定假设；若动态同样满足预算，也无需为想象中的需求扩展功能。

#### 证据与依据

**依据 1 · 源码核查**：[shared/skin-core.js:498-519](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/shared/skin-core.js#L498-L519)

关闭撤去视觉层并保留设置入口。

<details>
<summary>查看原文（22行）</summary>

```text
    const applyEnabled = () => {
      // The button/panel are the only way back in: mount the UI entry
      // regardless of enabled state, so a skin that starts disabled (or on a
      // host page that saved disabled) still offers the enable switch
      // (2026-08-23: previously the button was created only on first enable,
      // leaving a disabled-after-reload skin with no entry point at all).
      if (!document.getElementById(IDS.button)) mountUi();
      if (!state.enabled) {
        // Tear down only the ocean surface (frame + glass), keeping the
        // button/panel so the skin can be re-enabled from the same page.
        if (ownsSurface) {
          document.getElementById(IDS.frame)?.remove();
          document.getElementById(IDS.glass)?.remove();
          ownsSurface = false;
        }
        return;
      }
      // The extension and both native paths intentionally share the same ids.
      // Whichever implementation mounted first owns the surface; later ones
      // leave it untouched instead of double-rendering WebGPU.
      if (document.getElementById(IDS.frame)) return;
      if (mountOcean()) mountUi();
```

</details>

**依据 2 · 源码核查**：[shared/ocean.js:420-445](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/shared/ocean.js#L420-L445)

减少动态仍有动画和渲染，支持静止假设的具体差异。

<details>
<summary>查看原文（26行）</summary>

```text
let PIXEL_RATIO_CAP = REDUCED_MOTION ? 0.9 : LOW_END_DEVICE ? 1.0 : 1.5;
let BASE_PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP);
let FRAME_RATE_CAP = REDUCED_MOTION ? 20 : LOW_END_DEVICE ? 30 : 60;
let FRAME_MS = 1000 / FRAME_RATE_CAP;
let TARGET_FPS = REDUCED_MOTION ? 18 : LOW_END_DEVICE ? 28 : SKIN ? 40 : 55;
const MIN_SCALE = REDUCED_MOTION ? 0.5 : SKIN ? 0.5 : 0.55;
let renderScale = 1;

function applyResolutionScale(scale) {
  renderer.setPixelRatio(BASE_PIXEL_RATIO * scale);
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(now) {
  // high-resolution timestamp -> delta, clamped so hitches never cause jumps
  const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
  lastFrameTime = now;

  uTime.value += dt * (REDUCED_MOTION ? 0.12 : 1);
  controls.update();

  // frame cap: skip work when the display fires faster than 60 Hz
  if (now - lastRenderAt < FRAME_MS - 0.5) return;
  lastRenderAt = now;

  postProcessing.render();
```

</details>

**依据 3 · 源码核查**：[plugin/client.js:605-606](https://github.com/d-dev0101/open-sea-skin/blob/387740c974f3fd47ef22eebd7c20da4645f2f213/plugin/client.js#L605-L606)

stop清理绑定宿主生命周期。

```text
    void controller.start();
    ctx.effect(() => () => controller.stop(), 'open-sea-skin: browser surface');
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
