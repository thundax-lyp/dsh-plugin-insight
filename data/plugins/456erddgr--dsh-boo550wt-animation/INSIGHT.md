# dsh-boo550wt-animation

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[62e0132](https://github.com/456erddgr/dsh-boo550wt-animation/tree/62e013256d2020e292849e6321a426d50aeca719)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation)
<!-- END META -->

> **实现功能**：为DSH启动增加视频、图片、网页或内置游戏遮罩，支持素材上传与跳过。

> **核心亮点**：提前注入并整合素材管理、四模式与跳过交接，减少定制启动内容的接线；3D基础明确来自上游。参见[Q01](#research-q01)。

> **风险与缺陷**：视频metadata会清初始maxSeconds并改按媒体时长；同源HTML允许脚本且消息不核来源，不能据硬上限/sandbox字样承诺隔离和交还。参见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 启动遮罩为谁创造什么价值，哪些属于上游？](#detail-section-11)
  - [Q02 · 注入、退出和定时器是否实现一致硬上限？](#detail-section-12)
  - [Q03 · 上传/网页的信任与存储成本是什么？](#detail-section-13)
  - [Q04 · 当前采用及交接设计假设怎么验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：重视启动展示的桌面用户定制开场；合格结果须可可靠跳过并交还工作，不视为启动加速。

宿主原启动页/不加遮罩是简单参照；增量为展示定制，不能由更长动画推产品效率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 四模式开场 | 展示定制 | 额外等待，硬上限需核 |
| 素材管理 | 上传/本地路径 | 512MB，上层权限未知 |
| 跳过/交还 | 返回工作 | 多信号，frame来源未核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer/index-inject/slots | 启动必需 | 遮罩与设置 | 无注入/设置，禁用 |
| 可读媒体/可写配置上传目录 | 自定义必需 | 读取/保存素材 | 错误交还，核路径 |
| 编解码/WebGL/远程网络 | 对应模式必需 | 播放/场景 | 换图像或跳过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装并选可信本地图像 | 短时长与声音可控 |
| 2 | 用户重启观测与跳过 | 遮罩可结束、工作界面可用 |
| 3 | 用户核错误/禁用/路径 | 不困住窗口，清理按真实存储 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 素材/内置WebGL与上传存储 | 安装、制作素材、调时长 | 上传限512MB，峰值/金额未知 |
| 持续使用 | 解码/GPU/网络/声音 | 每次启动等待或跳过 | 真实设备耗时未测 |
| 失败恢复 | 残留/坏素材与重试 | 跳过、禁用、清理真实路径 | 硬上限不统一，恢复工时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 开场 | 预ready挂遮罩、多模式 | 本机首帧/闪烁与偏好价值 |
| 交还 | finish幂等、多信号 | 所有模式严格硬上限 |
| 素材 | 上传流控和摘要 | 不可信HTML隔离/跨源边界 |

> **思考**：视频metadata会清初始maxSeconds并改按媒体时长；同源HTML允许脚本且消息不核来源，不能据硬上限/sandbox字样承诺隔离和交还。参见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：提前注入并整合素材管理、四模式与跳过交接，减少定制启动内容的接线；3D基础明确来自上游。参见[Q01](#research-q01)。

提前注入并整合素材管理、四模式与跳过交接，减少定制启动内容的接线；3D基础明确来自上游。参见[Q01](#research-q01)。

幂等finish、真实跳过按钮、tmp/hash/rename可借鉴；媒体时长、启动deadline与frame信任应分开，源资产体积不代表原创工程量。

<a id="detail-section-5"></a>

### 1.4 主要限制

视频metadata会清初始maxSeconds并改按媒体时长；同源HTML允许脚本且消息不核来源，不能据硬上限/sandbox字样承诺隔离和交还。参见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；有明确需求者仅本地图像短时长隔离验Esc/按钮/错误与禁用，不先用不可信HTML/远程/重3D。参见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

多模式与交接机制有源码支持；硬上限/不可信HTML和真实资源边界未验，统一deadline是假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/inject.js、lib/config.js、lib/upload.js、lib/media.js、lib/games.js、THIRD-PARTY.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查Host/config/inject/upload/media主链及第三方归属，未审计全部vendoredWebGL/小游戏或执行媒体。
- 下一步：未运行目标。隔离五故障对照deadline、Esc/按钮和资源，先核路由认证，不用敏感路径/不可信HTML。

**分析版本**

- **仓库**：[456erddgr/dsh-boo550wt-animation](https://github.com/456erddgr/dsh-boo550wt-animation)
- **版本号**：1.5.0（[固定提交 62e0132](https://github.com/456erddgr/dsh-boo550wt-animation/tree/62e013256d2020e292849e6321a426d50aeca719)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为统一绝对deadline与可信frame来源，按长素材/延迟/错误/假消息/低帧率对照交还。参见[Q04](#research-q04)。

未运行目标。隔离五故障对照deadline、Esc/按钮和资源，先核路由认证，不用敏感路径/不可信HTML。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 7 | 3034 | 2468 | 352 | — |
| .md | source | 2 | 209 | — | — | 2867 |
| .mjs | source | 5 | 1485 | 1231 | 153 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation/issues?q=is%3Aissue+created%3A2026-09-23T01%3A49%3A26.981Z..2026-10-23T01%3A49%3A26.981Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T01%3A49%3A26.981Z..2026-10-23T01%3A49%3A26.981Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多模式启动展示的贡献、可靠交还与素材信任成本是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 启动遮罩为谁创造什么价值，哪些属于上游？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

重视桌面启动仪式、品牌展示或小游戏的用户可在DSH加载时观看视频/图片/网页/内置游戏。合格结果不仅播放正确，还要在结束、跳过和故障时可靠交还工作界面；它不是提升启动速度的性能插件。相对宿主原启动页，增量是可管理素材、多模式与提前注入。

earth-migration场景和three.js明确为内置上游资产，3D画面不能全算作者原创；插件自身在整合、讲解和宿主交接。README称约25MB及真实截图为作者报告，本轮没下载媒体或运行截图。对不重视启动展示的用户，每次额外等待可能没有净价值。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-31](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/README.md#L1-L31)

四模式、默认声音和上游。

<details>
<summary>查看原文（31行）</summary>

```text
# dsh-boo550wt-animation

给 **DeepSeek Harness** 加一段开机动画：打开 DSH 时全屏展示一段内容，播完（或者按 `Esc`）才进入界面。

支持四种模式，全部可以在设置面板里改：

| 模式 | 内容 | 结束方式 |
| --- | --- | --- |
| `video` | 视频（默认：自带的 550W 风格动画，16.6 秒） | 播完自动进入 |
| `image` | 图片 | 显示 `durationMs` 后进入 |
| `web` | 网页（URL 或本地 HTML 文件） | 页面发完成消息，或超时 |
| `game` | 内置内容（五款小游戏 + 一部流浪地球讲解） | 通关 / 讲完自动进入 |

素材来源有两条路：**直接上传**（设置面板里点选或拖入文件，存进插件自己的目录），或**填绝对路径**指向你已有的文件。视频默认**带声音播放**。

## 内置内容

| 内容 | 玩法 | 结束方式 |
| --- | --- | --- |
| 贪吃蛇 | 方向键 / WASD 吃豆子 | 吃满 30 个 |
| 2048 | 方向键 / WASD 合并数字 | 拼出 2048 |
| 打砖块 | ← → 移动挡板接球 | 清空全部砖块 |
| 记忆翻牌 | 点击翻牌配对 | 8 组全部配对 |
| 打字冲刺 | 照抄单词回车提交 | 完成 12 个 |
| **流浪地球 · 行星发动机计划** | 自动播放讲解运镜，鼠标接管自由查看 | 讲完自动进入，或随时 Esc |

**跳过永远可用**：按 `Esc`，或点右下角的「跳过」按钮。内容跑在 iframe 里会吃掉键盘，所以每一项都内置了把 Esc 转发给宿主页面的中继；右下角那个是真正的按钮，可以点。

### 流浪地球讲解（3D）

接入开源项目 **[oxomkbk/earth-migration](https://github.com/oxomkbk/earth-migration)**（MIT 协议）——基于 three.js 的电影级 WebGL 场景：真实地球贴图、云层、行星发动机群、赤道转向阵列、太空电梯、银河背景。整套 three.js、贴图和模型**内置在插件里**（`vendor/earth-migration/`，约 25 MB），不联网、不依赖 CDN。
```

</details>

**依据 2 · 源码核查**：[THIRD-PARTY.md:6-22](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/THIRD-PARTY.md#L6-L22)

上游资产与新增HUD归属。

<details>
<summary>查看原文（17行）</summary>

```text
## The Earth Migration Project

- Source: https://github.com/oxomkbk/earth-migration
- Licence: MIT (`vendor/earth-migration/LICENSE`)
- Vendored at: `vendor/earth-migration/`
- Used for: the "行星发动机 3D" boot game. The scene, textures and models are
  served unchanged from this copy; the ignition game and its HUD are added by
  `vendor/earth-migration/ignite.html`, which is this package's own file.

## three.js

- Source: https://github.com/mrdoob/three.js
- Licence: MIT (`vendor/earth-migration/vendor/three/LICENSE`)
- Vendored at: `vendor/earth-migration/vendor/three/`
- Version: r160, as shipped by the project above.

Both licences permit redistribution and modification with attribution; the
```

</details>

**依据 3 · 源码核查**：[lib/index.js:212-235](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/index.js#L212-L235)

启动ready前注入。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.on("webserver/index-inject", (table) => {
    table.push({ kind: "style", text: BOOT_STYLE });
    table.push({
      kind: "script",
      placement: "body",
      text: bootScript({
        base: BASE,
        mode: defaults.mode,
        // The script reads the live settings itself via /config, so the
        // injected row only carries the default mode as a first paint hint.
        url: `${BASE}${VIDEO_ROUTE}`,
        durationMs: defaults.durationMs,
        zIndex: defaults.zIndex,
        skipHint: defaults.skipHint,
        silentHint: defaults.silentHint,
        blockedHint: defaults.blockedHint,
        errorHint: defaults.errorHint,
        hintDelayMs: defaults.hintDelayMs,
        maxSeconds: defaults.maxSeconds,
        graceMs: 1500,
        fadeMs: defaults.fadeMs,
        sound: defaults.sound,
        mutedFallback: defaults.mutedFallback,
      }),
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 注入、退出和定时器是否实现一致硬上限？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host在webserver/index-inject提供样式/脚本，脚本挂全屏层后异步读配置，再创建视频、图片或iframe；全局Esc、真实跳过按钮、媒体ended/error与frame消息都可结束。finish用finished标志幂等，清监听、暂停媒体并淡出卸载，保留底下正常加载的应用是可复用交接设计。

硬上限需要细看：启动设置一个CONFIG.maxSeconds timer；视频loadedmetadata把当前guard清掉并改为media.duration+grace，未与maxSeconds取min，所以长视频会越过声明的硬上限。图片/iframe另设guard但没有清初始timer，留下两个结束路径且使用注入默认与实时配置不同，时间语义不统一。不能把注释“absolute ceiling”当所有模式可靠保证。onGameMessage只看data标记，不核source/origin，其他frame也可能触发提前结束；这是静态边界，未复现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/inject.js:193-228](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/inject.js#L193-L228)

幂等退出和视频重设计时器。

<details>
<summary>查看原文（36行）</summary>

```text
  function finish() {
    if (finished) return;
    finished = true;
    if (guard !== null) clearTimeout(guard);
    if (hintTimer !== null) clearTimeout(hintTimer);
    guard = null;
    hintTimer = null;
    disarmGesture();
    window.removeEventListener("keydown", onKeyDown, true);
    if (media !== null) {
      media.removeEventListener("ended", finish);
      media.removeEventListener("loadedmetadata", onMetadata);
      media.removeEventListener("error", onMediaError);
      if (typeof media.pause === "function") { try { media.pause(); } catch (ignored) { /* ignore */ } }
    }
    window.removeEventListener("message", onGameMessage);
    layer.setAttribute("data-dsh-boo550wt-animation", "done");
    layer.classList.add("dsh-boo550wt-animation-out");
    fade = setTimeout(unmount, CONFIG.fadeMs);
  }

  function unmount() {
    if (fade !== null) clearTimeout(fade);
    fade = null;
    doc.documentElement.classList.remove("dsh-boo550wt-animation-locked");
    if (layer.parentNode !== null) layer.parentNode.removeChild(layer);
    if (media !== null && typeof media.load === "function") { try { media.removeAttribute("src"); media.load(); } catch (ignored) { /* ignore */ } }
    try { delete globalThis.__DSH_BOOT_ANIMATION__; } catch (ignored) { /* ignore */ }
  }

  function onMetadata() {
    if (guard !== null) clearTimeout(guard);
    var seconds = media !== null && typeof media.duration === "number" && media.duration > 0
      ? media.duration
      : CONFIG.maxSeconds;
    guard = setTimeout(finish, Math.round(seconds * 1000) + CONFIG.graceMs);
```

</details>

**依据 2 · 源码核查**：[lib/inject.js:259-270](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/inject.js#L259-L270)

消息未核来源。

<details>
<summary>查看原文（12行）</summary>

```text
  function onGameMessage(event) {
    var data = event.data;
    if (data === null || typeof data !== "object") return;
    // The frame reported completion: hand over.
    if (data.__bootGameDone === true) {
      finish();
      return;
    }
    // The frame relayed a skip request (its own script saw the Esc).
    if (data.__bootSkip === true) {
      finish();
    }
```

</details>

**依据 3 · 源码核查**：[lib/inject.js:313-344](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/inject.js#L313-L344)

图片/frame定时器。

<details>
<summary>查看原文（32行）</summary>

```text
      var img = doc.createElement("img");
      img.className = "dsh-boo550wt-animation-media";
      img.alt = "boot image";
      img.src = cfg.url;
      layer.appendChild(img);
      media = img;
      img.addEventListener("error", onMediaError);
      guard = setTimeout(finish, cfg.durationMs);
    } else if (mode === "web") {
      var frame = doc.createElement("iframe");
      frame.className = "dsh-boo550wt-animation-frame";
      frame.setAttribute("allow", "autoplay; fullscreen");
      frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups");
      frame.src = cfg.url;
      layer.appendChild(frame);
      media = frame;
      window.addEventListener("message", onGameMessage);
      // Key events inside the frame never reach this window, so bring the
      // focus back and accept an Esc relayed by the frame's own script.
      releaseFrameFocus(frame);
      guard = setTimeout(finish, cfg.durationMs);
    } else if (mode === "game") {
      var frame2 = doc.createElement("iframe");
      frame2.className = "dsh-boo550wt-animation-frame";
      frame2.setAttribute("allow", "autoplay; fullscreen");
      frame2.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups");
      frame2.src = cfg.url;
      layer.appendChild(frame2);
      media = frame2;
      window.addEventListener("message", onGameMessage);
      releaseFrameFocus(frame2);
      guard = setTimeout(finish, cfg.maxSeconds * 1000);
```

</details>

**依据 4 · 源码核查**：[lib/inject.js:363-373](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/inject.js#L363-L373)

启动默认硬上限。

<details>
<summary>查看原文（11行）</summary>

```text
  // ---- boot ------------------------------------------------------------

  // The absolute ceiling: never hold the user hostage if anything stalls.
  guard = setTimeout(finish, CONFIG.maxSeconds * 1000);

  try {
    globalThis.__DSH_BOOT_ANIMATION__ = { skip: finish, element: layer };
  } catch (ignored) { /* ignore */ }

  window.addEventListener("keydown", onKeyDown, true);
  fetchSettings();
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 上传/网页的信任与存储成本是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

上传支持图片/视频/HTML，512MB上限，流写tmp/摘要去重/rename发布有助避免半文件；settings与uploads路径在无DSH_HOME时分别取homedir与cwd，不是始终相邻，迁移清理需核真实路径。公开config把settings、media spec、configFile及内置绝对路径返回，不能按注释称路径不泄露到页。

本地或上传HTML由宿主同源服务，iframe同时allow-scripts和allow-same-origin并允许forms/popups，不能把sandbox属性当不可信HTML安全隔离；管理路由未见局部Origin/Connection检查，上层保护未验。远程web URL直入frame，仍依网络与目标frame限制。首次安装/素材制作/上传，持续每次启动解码/GPU/等待/声音，失败需跳过、删坏素材、核磁盘与禁用；金额、峰值和人时未测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/upload.js:31-45](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/upload.js#L31-L45)

上限和HTML类型。

<details>
<summary>查看原文（15行）</summary>

```text
export const UPLOAD_MAX_BYTES = 512 * 1024 * 1024;
const CONTROL_MAX_BYTES = 1024 * 1024;
const BODY_IDLE_MS = 60_000;

/** MIME type -> extension for the kinds the boot animation accepts. */
const UPLOAD_EXT = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "text/html": "html",
  "application/xhtml+xml": "html",
```

</details>

**依据 2 · 源码核查**：[lib/upload.js:55-60](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/upload.js#L55-L60)

无DSH_HOME取cwd。

```text
/** Directory holding uploaded assets; created on demand. */
export function uploadDir() {
  const base = process.env.DSH_HOME?.trim() || process.cwd();
  const dir = join(base, "boot-animation-uploads");
  mkdirSync(dir, { recursive: true });
  return dir;
```

**依据 3 · 源码核查**：[lib/config.js:30-32](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/config.js#L30-L32)

配置无环境变量取homedir。

```text
export function configPath() {
  const home = process.env.DSH_HOME?.trim() || homedir();
  return join(home, "boot-animation-settings.json");
```

**依据 4 · 源码核查**：[lib/config.js:187-195](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/config.js#L187-L195)

公开响应含绝对路径。

```text
/** Public view of the settings for the /config route and the settings panel. */
export function publicSettings(settings) {
  const spec = mediaSpec(settings);
  return {
    ...settings,
    media: spec,
    configFile: configPath(),
    builtinVideo: BUNDLED_VIDEO,
    builtinImage: BUNDLED_IMAGE,
```

**依据 5 · 源码核查**：[lib/inject.js:321-338](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/inject.js#L321-L338)

脚本和同源组合。

<details>
<summary>查看原文（18行）</summary>

```text
    } else if (mode === "web") {
      var frame = doc.createElement("iframe");
      frame.className = "dsh-boo550wt-animation-frame";
      frame.setAttribute("allow", "autoplay; fullscreen");
      frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups");
      frame.src = cfg.url;
      layer.appendChild(frame);
      media = frame;
      window.addEventListener("message", onGameMessage);
      // Key events inside the frame never reach this window, so bring the
      // focus back and accept an Esc relayed by the frame's own script.
      releaseFrameFocus(frame);
      guard = setTimeout(finish, cfg.durationMs);
    } else if (mode === "game") {
      var frame2 = doc.createElement("iframe");
      frame2.className = "dsh-boo550wt-animation-frame";
      frame2.setAttribute("allow", "autoplay; fullscreen");
      frame2.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups");
```

</details>

**依据 6 · 源码核查**：[lib/index.js:90-106](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/index.js#L90-L106)

配置读写未见局部围栏。

<details>
<summary>查看原文（17行）</summary>

```text
    if (path === `${BASE}/config`) {
      if (req.method === "GET" || req.method === "HEAD") {
        const settings = await loadSettings();
        sendJson(res, 200, publicSettings(settings));
        return;
      }
      if (req.method === "POST" || req.method === "PUT") {
        let raw;
        try {
          raw = await readJson(req);
        } catch {
          sendJson(res, 400, { error: "invalid JSON body" });
          return;
        }
        const next = normalizeConfig({ ...defaults, ...raw });
        const saved = await saveSettings(next);
        sendJson(res, saved ? 200 : 500, saved ? publicSettings(next) : { error: "could not save settings" });
```

</details>

#### 缺口

- 目标宿主上层认证和浏览器/低端设备行为未验
  **影响**：管理/HTML边界、跳过可达与资源峰值未知
  **进一步探讨**：先核目标路由访问契约，再隔离测本地HTML、长视频、远程拒frame和低端WebGL，不用敏感路径

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前采用及交接设计假设怎么验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议观察，仅有明确启动展示需求的人先本地图像短时长验证，先不启用不可信HTML、远程网页或重3D。至少核Esc/按钮/错误/长素材都能交还，关闭声音和禁用后不遮挡工作。不能因作者截图成功认定本机可靠。

未验证假设是以启动时刻统一deadline管理所有模式，实际配置只允许缩短，所有结束信号汇聚一个状态机并核frame来源；展示许可与素材信任分开。由混合定时器、视频覆盖硬上限和消息无来源推导，可能降低交还异常而保留定制，新增状态测试成本。最小对照超长视频、配置延迟、素材错误、frame假消息与低帧率，量实际交还时间/跳过可达/CPU，若仍超过deadline或引入新阻塞则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/inject.js:223-228](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/inject.js#L223-L228)

视频重置deadline依据。

```text
  function onMetadata() {
    if (guard !== null) clearTimeout(guard);
    var seconds = media !== null && typeof media.duration === "number" && media.duration > 0
      ? media.duration
      : CONFIG.maxSeconds;
    guard = setTimeout(finish, Math.round(seconds * 1000) + CONFIG.graceMs);
```

**依据 2 · 源码核查**：[lib/inject.js:259-270](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/inject.js#L259-L270)

frame来源依据。

<details>
<summary>查看原文（12行）</summary>

```text
  function onGameMessage(event) {
    var data = event.data;
    if (data === null || typeof data !== "object") return;
    // The frame reported completion: hand over.
    if (data.__bootGameDone === true) {
      finish();
      return;
    }
    // The frame relayed a skip request (its own script saw the Esc).
    if (data.__bootSkip === true) {
      finish();
    }
```

</details>

**依据 3 · 源码核查**：[lib/inject.js:363-373](https://github.com/456erddgr/dsh-boo550wt-animation/blob/62e013256d2020e292849e6321a426d50aeca719/lib/inject.js#L363-L373)

初始deadline依据。

<details>
<summary>查看原文（11行）</summary>

```text
  // ---- boot ------------------------------------------------------------

  // The absolute ceiling: never hold the user hostage if anything stalls.
  guard = setTimeout(finish, CONFIG.maxSeconds * 1000);

  try {
    globalThis.__DSH_BOOT_ANIMATION__ = { skip: finish, element: layer };
  } catch (ignored) { /* ignore */ }

  window.addEventListener("keydown", onKeyDown, true);
  fetchSettings();
```

</details>

#### 缺口

- 统一deadline与交还收益未验证
  **影响**：只能作设计假设，当前仍需保守采用
  **进一步探讨**：按五故障对照交还时间和跳过可达

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
