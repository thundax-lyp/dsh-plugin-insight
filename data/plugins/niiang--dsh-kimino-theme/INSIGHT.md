# Kimi no Na wa Theme

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[87e1519](https://github.com/niiang/dsh-kimino-theme/tree/87e15197f2542dbc43649d64cb51d5423c968416)

<!-- BEGIN META -->
[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/niiang/dsh-kimino-theme) [![npm 30d 3,551](https://img.shields.io/static/v1?label=npm+30d&message=3%2C551&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-kimino-theme) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-kimino-theme)
<!-- END META -->

> **功能**：为 DeepSeek Harness Web 提供《你的名字。》静态与动态壁纸、玻璃化界面、Logo 和输入卡主题。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将主题 token、包内媒体和切换控制组合为可选视觉覆盖。

> **主要限制**：[Q03](#research-q03) 动效偏好 change 监听未出现在卸载清理中，同一页面的旧回调可能重新触发动态显示。

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
  - [Q01 · 主题解决哪种需求？](#detail-section-11)
  - [Q02 · 发布包如何接入资产和动态控制？](#detail-section-12)
  - [Q03 · 卸载时能否清理动态主题全部监听？](#detail-section-13)
  - [Q04 · 怎样试用并回退到默认？](#detail-section-14)
  - [Q05 · 统一释放媒体查询监听能否避免卸载复挂？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望统一 DSH Web 的壁纸、品牌和输入卡风格，且能按设备情况切回静态模式。

宿主默认配色和用户自行维护的少量 CSS。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 视觉主题 | 修改壁纸、颜色和输入界面 | 兼容 DSH Web 与浏览器 CSS |
| 动态壁纸 | 播放包内视频 | 受系统动效、媒体解码和可见状态约束 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web 和浏览器 | 必需 | 加载主题与媒体 | 回默认主题 |
| 视频解码和 CSS 支持 | 动态时必需 | 显示动画和玻璃效果 | 优先切静态 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户用隔离配置加载主题 | 资产和输入区正常 |
| 试穿 | 用户切静态和动态 | 文字和操作不受遮挡 |
| 退出 | 用户停用并刷新 | 默认界面恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 媒体加载和浏览器资源 | 检查主题与浏览器 | 耗时未知 |
| 持续 | 视频解码和 CSS 合成 | 排查可读性、输入和滚动 | GPU 负担未测 |
| 失败 | 原主题仍可用 | 关闭主题并刷新 | 同页监听清理需核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 视觉覆盖 | 主题 token 和包内媒体 | 实际对比度和体验 |
| 动态回退 | 可依据媒体状态切静态 | 各设备资源和卸载效果 |

> **思考**：[Q03](#research-q03) 动效偏好 change 监听未出现在卸载清理中，同一页面的旧回调可能重新触发动态显示。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将主题 token、包内媒体和切换控制组合为可选视觉覆盖。

[Q02](#research-q02) 资产路由与视觉状态分开。多数效果有清理，[Q03](#research-q03) 媒体查询监听是可定位例外。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 动效偏好 change 监听未出现在卸载清理中，同一页面的旧回调可能重新触发动态显示。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先试静态主题，核对输入与滚动。出现意外状态时停用主题并刷新。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查发布 bundle 源码、资产路由和卸载分支。视觉效果、媒体资源和实际残留未验收。

- 已检查：作者 README、包清单、源码路径 bundle/client.js、bundle/host.js、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 npm 包导出的 bundle，未逐项审查单独皮肤分发、媒体授权和浏览器实际表现。
- 下一步：用同一页面切静态、动态和系统动效，停用后核对视频层与监听，再刷新比较默认。

**分析版本**

- **仓库**：[niiang/dsh-kimino-theme](https://github.com/niiang/dsh-kimino-theme)
- **版本号**：68.4.2（[固定提交 87e1519](https://github.com/niiang/dsh-kimino-theme/tree/87e15197f2542dbc43649d64cb51d5423c968416)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将媒体查询监听与视频同生命周期释放，可在同一页面的反复启停中验证是否消除复挂。

用同一页面切静态、动态和系统动效，停用后核对视频层与监听，再刷新比较默认。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 2971 | 2551 | 367 | — |
| .md | source | 3 | 637 | — | — | 5767 |
| .mjs | source | 7 | 758 | 562 | 144 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/niiang/dsh-kimino-theme/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/niiang/dsh-kimino-theme/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/niiang/dsh-kimino-theme/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH Web 用户能否试用动态主题并可靠切回原界面？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 主题解决哪种需求？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望个性化 DSH Web 界面的用户，可同时替换壁纸、品牌、输入卡与交互色，避免自己维护多份 CSS。合格结果是显示一致、聊天输入和阅读仍可用，并可切回默认界面。主题的增量在视觉覆盖与控制方式。任务效果、可读性和节电不能由截图推出。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-53](https://github.com/niiang/dsh-kimino-theme/blob/87e15197f2542dbc43649d64cb51d5423c968416/README.md#L38-L53)

作者给出默认宿主与主题的视觉对比和还原声明。

<details>
<summary>查看原文（16行）</summary>

```text
## 是什么

dsh-kimino-theme 把 DSH Web GUI 变成新海诚《你的名字。》的模样：**一段无声循环的动态电影壁纸**垫底，全部界面表面换成半透明毛玻璃，交互色统一为彗星蓝（`#93C5FD`），侧边栏品牌与首页标题替换为电影 Logo，输入卡重绘为藏蓝玻璃胶囊，占位文案换成「黄昏之时，我在这里等你。」。

它是一个标准的 dsh 插件包：一条 `dsh plugin` 命令装进 profile，随 DSH 启动常驻，不修改任何 DSH 源码；卸载后页面完全还原。

| 维度 | 原生 dsh web | dsh-kimino-theme |
| --- | --- | --- |
| 背景 | 纯色 / 纯色渐变 | **静态/动态电影壁纸一键切换**（输入框开关；1080p 无声无缝循环视频）+ 全局模糊遮罩 |
| 界面表面 | 不透明分层 | 半透明毛玻璃（backdrop-filter） |
| 品牌标识 | DSH 默认 | 电影 Logo（展开态 + 折叠态） |
| 输入卡 | 默认样式 | 藏蓝玻璃卡片，占位文案主题化 |
| 滚动条 | 默认 | 全局蓝紫玻璃细滚动条 |
| 消息列底部 | 直切 | 40px 渐变淡出蒙版 |
| 安装 | — | `dsh plugin --profile web add ...` 一条命令 |
| 还原 | — | 卸载即完全还原 |
```

</details>

**依据 2 · 源码核查**：[bundle/client.js:51-64](https://github.com/niiang/dsh-kimino-theme/blob/87e15197f2542dbc43649d64cb51d5423c968416/bundle/client.js#L51-L64)

客户端调用主题 token 覆盖。

<details>
<summary>查看原文（14行）</summary>

```text
        return () => observer.disconnect();
      };
      const disposePlaceholders = patchPlaceholders();
      const pair = (v) => ({ light: v, dark: v });
      const dispose = ctx.theme.overrideTokens('kimino-bg', {
        '--dsw-alias-bg-base': pair('rgba(5,8,20,0)'),
        '--dsw-alias-bg-layer-1': pair('rgba(15,23,42,0.88)'),
        '--dsw-alias-bg-layer-2': pair('rgba(15,23,42,0.9)'),
        '--dsw-alias-bg-layer-3': pair('rgba(15,23,42,0.92)'),
        '--dsw-alias-bg-overlay': pair('rgba(10,14,26,0.9)'),
        '--dsw-alias-bg-module-platform': pair('rgba(255,255,255,0.08)'),
        '--dsw-alias-bg-multi-select': pair('rgba(147,197,253,0.15)'),
        '--dsw-alias-border-l1': pair('rgba(147,197,253,0.14)'),
        '--dsw-alias-border-l2': pair('rgba(147,197,253,0.22)'),
```

</details>

#### 缺口

- 没有用户阅读或对比度实测。
  **影响**：不能证明主题改善可读性。
  **进一步探讨**：用同一长对话比较静态、动态和默认显示。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 发布包如何接入资产和动态控制？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

package.json 指向 bundle 的宿主与客户端，宿主注册固定媒体和 Logo 路由，从包内文件读取，缺件返回 404。客户端设置本地偏好，创建静音循环视频。仅在可播放数据就绪时改变动态显示标识，媒体错误则回退。主题 token 通过服务覆盖，动态壁纸另由 DOM 生命周期管理。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-26](https://github.com/niiang/dsh-kimino-theme/blob/87e15197f2542dbc43649d64cb51d5423c968416/package.json#L7-L26)

实际发布入口和 web 声明。

<details>
<summary>查看原文（20行）</summary>

```text
  "main": "bundle/host.js",
  "exports": {
    ".": "./bundle/host.js",
    "./client": "./bundle/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "plugin",
    "bundle",
    "assets",
    "cordis.patch.yml"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [],
      "immediately": true
```

</details>

**依据 2 · 源码核查**：[bundle/host.js:16-36](https://github.com/niiang/dsh-kimino-theme/blob/87e15197f2542dbc43649d64cb51d5423c968416/bundle/host.js#L16-L36)

固定媒体文件和路由映射。

<details>
<summary>查看原文（21行）</summary>

```text
const ROUTES = [
  {
    path: '/kimino-bg/current.jpg',
    file: join(assets, 'current.jpg'),
    type: 'image/jpeg',
  },
  {
    path: '/kimino-bg/live.mp4',
    file: join(assets, 'live.mp4'),
    type: 'video/mp4',
  },
  {
    path: '/kimino-bg/logo-blue.svg',
    file: join(assets, 'logo', 'your-name-movie-logo-blue.svg'),
    type: 'image/svg+xml',
  },
  {
    path: '/kimino-bg/logo-letter.svg',
    file: join(assets, 'logo', 'logo-letter.svg'),
    type: 'image/svg+xml',
  },
```

</details>

**依据 3 · 源码核查**：[bundle/host.js:49-73](https://github.com/niiang/dsh-kimino-theme/blob/87e15197f2542dbc43649d64cb51d5423c968416/bundle/host.js#L49-L73)

读取文件、失败返回及路由释放。

<details>
<summary>查看原文（25行）</summary>

```text
        dispose = ctx.webServer.register({
          kind: 'exact',
          path: route.path,
          handler: async (req, res) => {
            try {
              const bytes = await readFile(route.file);
              res.writeHead(200, {
                'Content-Type': route.type,
                'Content-Length': bytes.length,
                'Cache-Control': 'public, max-age=3600',
              });
              res.end(bytes);
            } catch (err) {
              console.error(`[kimino-theme] asset route failed: ${route.path}`, err);
              res.writeHead(404, { 'Content-Type': 'text/plain' });
              res.end('kimino asset not found');
            }
          },
        });
        registered += 1;
      } catch (e) {
        console.warn(`[kimino-theme] route ${route.path} already served elsewhere, skipping:`, e?.message ?? e);
        continue;
      }
      ctx.effect(() => dispose);
```

</details>

**依据 4 · 源码核查**：[bundle/client.js:249-312](https://github.com/niiang/dsh-kimino-theme/blob/87e15197f2542dbc43649d64cb51d5423c968416/bundle/client.js#L249-L312)

偏好、动态判断、视频及可见性处理。

<details>
<summary>查看原文（64行）</summary>

```text
      const CONTROLS_KEY = 'kimino-controls';
      const LIVE_KEY = 'kimino-live';
      const CONTROL_DEFAULTS = { live: true, bgBlur: 1, veil: 0, cardBlur: 0 };
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
      const clampNum = (v, min, max, dflt) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : dflt);
      const loadControls = () => {
        let saved = {};
        try { saved = JSON.parse(localStorage.getItem(CONTROLS_KEY) || '{}'); } catch { saved = {}; }
        return {
          live: typeof saved.live === 'boolean' ? saved.live : (localStorage.getItem(LIVE_KEY) === null ? CONTROL_DEFAULTS.live : localStorage.getItem(LIVE_KEY) === '1'),
          bgBlur: clampNum(saved.bgBlur, 0, 20, CONTROL_DEFAULTS.bgBlur),
          veil: clampNum(saved.veil, 0, 100, CONTROL_DEFAULTS.veil),
          cardBlur: clampNum(saved.cardBlur, 0, 20, CONTROL_DEFAULTS.cardBlur),
        };
      };
      let ctrl = loadControls();
      const saveControls = () => localStorage.setItem(CONTROLS_KEY, JSON.stringify(ctrl));
      const wantsLive = () => ctrl.live && !reducedMotion.matches;
      const applyControls = () => {
        const root = document.documentElement;
        root.style.setProperty('--kimino-bg-blur', `${ctrl.bgBlur}px`);
        root.style.setProperty('--kimino-veil', (ctrl.veil / 100).toFixed(2));
        root.style.setProperty('--kimino-card-blur', `${ctrl.cardBlur}px`);
        applyLive(wantsLive());
      };
      const bgLayer = document.createElement('div');
      bgLayer.setAttribute('data-kimino-backdrop', '');
      bgLayer.setAttribute('aria-hidden', 'true');
      bgLayer.style.cssText = 'position:fixed;top:0;right:0;bottom:0;left:0;z-index:-2;pointer-events:none;overflow:hidden;';
      const liveVideo = document.createElement('video');
      liveVideo.src = '/kimino-bg/live.mp4';
      liveVideo.muted = true;
      liveVideo.loop = true;
      liveVideo.autoplay = true;
      liveVideo.playsInline = true;
      liveVideo.setAttribute('aria-hidden', 'true');
      liveVideo.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;';
      bgLayer.append(liveVideo);
      const setLiveAttr = (on) => {
        if (on) document.documentElement.setAttribute('data-kimino-live', '');
        else document.documentElement.removeAttribute('data-kimino-live');
      };
      const applyLive = (on) => {
        if (on) {
          document.body.append(bgLayer);
          liveVideo.play().catch(() => {});
          // 只在视频真的解出第一帧后才把 body 背景切到纯渐变；
          // 路由缺失 / 解码失败时保持静态图，绝不白屏。
          if (liveVideo.readyState >= 2) setLiveAttr(true);
          else {
            liveVideo.addEventListener('loadeddata', () => { if (bgLayer.isConnected) setLiveAttr(true); }, { once: true });
            liveVideo.addEventListener('error', () => { if (bgLayer.isConnected) applyLive(false); }, { once: true });
          }
        } else {
          setLiveAttr(false);
          bgLayer.remove();
          liveVideo.pause();
        }
      };
      const onVisibility = () => {
        if (document.hidden) liveVideo.pause();
        else if (bgLayer.isConnected) liveVideo.play().catch(() => {});
      };
      document.addEventListener('visibilitychange', onVisibility);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 卸载时能否清理动态主题全部监听？

**研究主题**：缺陷与关键质疑

#### 完整回答

降低动态效果的媒体查询 change 监听使用匿名回调。对应卸载清理断开观察器、移除文档监听、清样式和视频，但没有移除该媒体查询监听。若原页面继续存活并触发系统动效偏好变更，旧回调具备再次调用 applyLive 的代码路径。它是固定代码的监听释放缺口，实际宿主是否在卸载时销毁页面或阻止复挂尚待验证。

#### 证据与依据

**依据 1 · 源码核查**：[bundle/client.js:448-466](https://github.com/niiang/dsh-kimino-theme/blob/87e15197f2542dbc43649d64cb51d5423c968416/bundle/client.js#L448-L466)

媒体查询回调与卸载清理可逐项对照。

<details>
<summary>查看原文（19行）</summary>

```text
      document.addEventListener('keydown', onCcKey, true);
      // React 重挂输入卡（切换会话）后补挂按钮与面板、对齐引擎状态。
      const liveToggleObserver = new MutationObserver(() => {
        mountControlCenter();
        if (wantsLive() !== bgLayer.isConnected) applyLive(wantsLive());
      });
      liveToggleObserver.observe(document.body, { subtree: true, childList: true });
      reducedMotion.addEventListener?.('change', () => applyLive(wantsLive()));
      ctx.effect(() => () => {
        liveToggleObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        document.removeEventListener('mousedown', onCcPointer, true);
        document.removeEventListener('keydown', onCcKey, true);
        document.querySelectorAll('[data-kimino-toggle], [data-kimino-panel]').forEach((el) => el.remove());
        ccPanel = null;
        const root = document.documentElement;
        for (const p of ['--kimino-bg-blur', '--kimino-veil', '--kimino-card-blur']) root.style.removeProperty(p);
        applyLive(false);
      });
```

</details>

**依据 2 · 源码核查**：[bundle/client.js:266-305](https://github.com/niiang/dsh-kimino-theme/blob/87e15197f2542dbc43649d64cb51d5423c968416/bundle/client.js#L266-L305)

旧回调可依据偏好重新添加视频层。

<details>
<summary>查看原文（40行）</summary>

```text
      const wantsLive = () => ctrl.live && !reducedMotion.matches;
      const applyControls = () => {
        const root = document.documentElement;
        root.style.setProperty('--kimino-bg-blur', `${ctrl.bgBlur}px`);
        root.style.setProperty('--kimino-veil', (ctrl.veil / 100).toFixed(2));
        root.style.setProperty('--kimino-card-blur', `${ctrl.cardBlur}px`);
        applyLive(wantsLive());
      };
      const bgLayer = document.createElement('div');
      bgLayer.setAttribute('data-kimino-backdrop', '');
      bgLayer.setAttribute('aria-hidden', 'true');
      bgLayer.style.cssText = 'position:fixed;top:0;right:0;bottom:0;left:0;z-index:-2;pointer-events:none;overflow:hidden;';
      const liveVideo = document.createElement('video');
      liveVideo.src = '/kimino-bg/live.mp4';
      liveVideo.muted = true;
      liveVideo.loop = true;
      liveVideo.autoplay = true;
      liveVideo.playsInline = true;
      liveVideo.setAttribute('aria-hidden', 'true');
      liveVideo.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;';
      bgLayer.append(liveVideo);
      const setLiveAttr = (on) => {
        if (on) document.documentElement.setAttribute('data-kimino-live', '');
        else document.documentElement.removeAttribute('data-kimino-live');
      };
      const applyLive = (on) => {
        if (on) {
          document.body.append(bgLayer);
          liveVideo.play().catch(() => {});
          // 只在视频真的解出第一帧后才把 body 背景切到纯渐变；
          // 路由缺失 / 解码失败时保持静态图，绝不白屏。
          if (liveVideo.readyState >= 2) setLiveAttr(true);
          else {
            liveVideo.addEventListener('loadeddata', () => { if (bgLayer.isConnected) setLiveAttr(true); }, { once: true });
            liveVideo.addEventListener('error', () => { if (bgLayer.isConnected) applyLive(false); }, { once: true });
          }
        } else {
          setLiveAttr(false);
          bgLayer.remove();
          liveVideo.pause();
```

</details>

#### 缺口

- 未在真实宿主切换主题与动效偏好。
  **影响**：不能判定缺口的现场复现率。
  **进一步探讨**：在同一已打开标签卸载后切换系统动效，再核对节点、网络和监听。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用并回退到默认？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容的 DSH Web、浏览器媒体和 CSS 支持。用户可以在隔离 profile 比较静态、动态和默认模式，先用非敏感长对话核对输入、滚动、可读性。媒体请求和视频解码消耗未量化。若滚动、输入或可读性受影响，切回静态或停用主题并重新加载页面；单次卸载前后的页面状态需要核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-80](https://github.com/niiang/dsh-kimino-theme/blob/87e15197f2542dbc43649d64cb51d5423c968416/README.md#L65-L80)

作者给出开关和静态回退。

<details>
<summary>查看原文（16行）</summary>

```text
### 控制中心

输入框工具栏的胶片图标打开「君の名は · 控制中心」面板（点外部 / Esc / 再点图标关闭），全部调节即时生效、偏好本地记忆：

| 控件 | 范围 | 默认 |
| --- | --- | --- |
| 动态壁纸 | 开 / 关 | **开**（1080p 无缝循环视频） |
| 背景模糊 | 0-20px | **1px** |
| 背景加深 | 0-100% | 0% |
| 输入卡模糊 | 0-20px | **0px** |

「重置」恢复默认视觉参数。稳定性保障：视频解出首帧前不切换背景（加载失败自动回落静态图）；后台标签页暂停解码；系统"减弱动效"用户自动使用静态图。另有一枚自绘「回到底部」圆钮（贴会话内容列右缘，离底 120px 以上出现），点进会话自动落底。

### 壁纸与 Logo

- **双版本壁纸**：皮肤形态提供 `kimino`（静态电影壁纸）与 `kimino-live`（1080p 无声无缝循环视频，首尾 0.6 秒交叉淡化处理，仅 0.78MB）两个版本——玻璃面板下的光影缓缓流动或纯净静态，各取所需（见「皮肤中心方式」）；插件形态**默认动态壁纸**（`/kimino-bg/live.mp4` 路由，包内 `assets/live.mp4`），可在控制中心一键切回静态（`/kimino-bg/current.jpg`）；两种形态均叠加轻微深色渐变保证文字可读性；
```

</details>

**依据 2 · 作者声明**：[README.md:106-108](https://github.com/niiang/dsh-kimino-theme/blob/87e15197f2542dbc43649d64cb51d5423c968416/README.md#L106-L108)

浏览器支持限制由作者声明。

```text
## 快速开始

> **浏览器建议**：主题大量使用 backdrop-filter 毛玻璃、滚动条定制与 CSS 蒙版，推荐使用 **Microsoft Edge** 或 **Google Chrome**；Firefox 下部分显示效果不兼容（滚动条、渐变蒙版等可能打折）。
```

**依据 3 · 源码核查**：[bundle/client.js:294-312](https://github.com/niiang/dsh-kimino-theme/blob/87e15197f2542dbc43649d64cb51d5423c968416/bundle/client.js#L294-L312)

视频移除、暂停和恢复。

<details>
<summary>查看原文（19行）</summary>

```text
          liveVideo.play().catch(() => {});
          // 只在视频真的解出第一帧后才把 body 背景切到纯渐变；
          // 路由缺失 / 解码失败时保持静态图，绝不白屏。
          if (liveVideo.readyState >= 2) setLiveAttr(true);
          else {
            liveVideo.addEventListener('loadeddata', () => { if (bgLayer.isConnected) setLiveAttr(true); }, { once: true });
            liveVideo.addEventListener('error', () => { if (bgLayer.isConnected) applyLive(false); }, { once: true });
          }
        } else {
          setLiveAttr(false);
          bgLayer.remove();
          liveVideo.pause();
        }
      };
      const onVisibility = () => {
        if (document.hidden) liveVideo.pause();
        else if (bgLayer.isConnected) liveVideo.play().catch(() => {});
      };
      document.addEventListener('visibilitychange', onVisibility);
```

</details>

#### 缺口

- GPU、耗电与 Firefox 表现未测。
  **影响**：持续采用的设备负担未知。
  **进一步探讨**：在目标浏览器测帧率、后台播放状态及回退后 DOM。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 统一释放媒体查询监听能否避免卸载复挂？

**研究主题**：新假设与验证

#### 完整回答

可以给媒体查询监听一个稳定引用，随视频层和观察器释放，并使卸载后的回调检查生命周期。对照现有实现，在同一标签反复启用、关闭和切换动效设置，比较旧监听数和卸载后视频节点。若现有宿主始终重建页面而两者均无残留，则对该宿主没有可观察增量。

#### 证据与依据

**依据 1 · 源码核查**：[bundle/client.js:448-466](https://github.com/niiang/dsh-kimino-theme/blob/87e15197f2542dbc43649d64cb51d5423c968416/bundle/client.js#L448-L466)

现有监听与清理范围提供对照。

<details>
<summary>查看原文（19行）</summary>

```text
      document.addEventListener('keydown', onCcKey, true);
      // React 重挂输入卡（切换会话）后补挂按钮与面板、对齐引擎状态。
      const liveToggleObserver = new MutationObserver(() => {
        mountControlCenter();
        if (wantsLive() !== bgLayer.isConnected) applyLive(wantsLive());
      });
      liveToggleObserver.observe(document.body, { subtree: true, childList: true });
      reducedMotion.addEventListener?.('change', () => applyLive(wantsLive()));
      ctx.effect(() => () => {
        liveToggleObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        document.removeEventListener('mousedown', onCcPointer, true);
        document.removeEventListener('keydown', onCcKey, true);
        document.querySelectorAll('[data-kimino-toggle], [data-kimino-panel]').forEach((el) => el.remove());
        ccPanel = null;
        const root = document.documentElement;
        for (const p of ['--kimino-bg-blur', '--kimino-veil', '--kimino-card-blur']) root.style.removeProperty(p);
        applyLive(false);
      });
```

</details>

#### 缺口

- 修复及真实宿主复挂未验证。
  **影响**：不能量化影响范围。
  **进一步探讨**：同页面循环启停后观察回调和节点。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
