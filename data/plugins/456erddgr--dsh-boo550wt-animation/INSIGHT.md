# dsh-boo550wt-animation

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[aeac4c9](https://github.com/456erddgr/dsh-boo550wt-animation/tree/aeac4c96f33b7947e19b44c36c421185ec2cda1a)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation)
<!-- END META -->

> **实现功能**：DSH Desktop/Web 启动前注入视频遮罩并经同源 Range 路由播放的个性化动画。

> **核心亮点**：把启动前遮罩与原生媒体栈结合，不需客户端 bundle；具备跳过与错误退出路径。详见[Q01](#research-q01)和[Q02](#research-q02)。

> **风险与缺陷**：maxSeconds 初始计时器被 metadata 清掉，长视频或无效 duration 可能延迟/失去自动解锁；数值配置未逐项校验。详见[Q03](#research-q03)和[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 开机动画如何覆盖应用启动，实际带来何种价值？](#detail-section-11)
  - [Q02 · 视频字节服务与失败回退如何实现？](#detail-section-12)
  - [Q03 · maxSeconds 是否真的构成绝对硬上限？](#detail-section-13)
  - [Q04 · 参数与无障碍边界是否受控？](#detail-section-14)
  - [Q05 · 安装与回退应怎样验收？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户为 DSH 开机增加品牌化 550W 风格视频，播毕或 Esc 后进入界面。详见[Q01](#research-q01)。

默认 DSH 直接进入界面；动画提升风格但增加启动等待和资源。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 视频开机 | 个性化体验 | 增加等待/解码 |
| Range 路由 | 浏览器原生解码 | 宿主代理未联调 |
| 跳过/超时 | 恢复界面 | maxSeconds 不是绝对上限 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH webServer/index-inject | 必需 | 早期脚本/路由 | 无遮罩或视频 |
| 浏览器媒体栈 | 必需 | H.264/AAC 解码与 Range | 播放失败回退 |
| boot.mp4/自定义视频 | 必需 | 内容 | 404/错误退出 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | Desktop profile CLI 加包、重启 | state 路由可读 |
| 播放 | 打开 DSH | 视频遮罩覆盖启动界面 |
| 跳过 | 按 Esc | 淡出并解除锁定 |
| 改视频 | 配 videoPath | 核长视频/超时边界 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH Desktop 与约 12.1MB 素材 | profile 安装/重启 | 版本兼容未测 |
| 播放 | 视频下载/解码、默认 16.6 秒等待 | 跳过/更换素材 | 首帧、电量未知 |
| 异常 | 长视频/坏配置可能拖延遮罩 | Esc 或停用配置 | 硬上限缺口 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 启动遮罩 | 注入视频、淡出 | 所有目标版本时序 |
| 失败回退 | Esc/错误/静音降级 | 真实自动播放策略 |
| 硬上限 | 初始 120 秒 guard | metadata 后仍生效，源码否定 |

> **思考**：maxSeconds 初始计时器被 metadata 清掉，长视频或无效 duration 可能延迟/失去自动解锁；数值配置未逐项校验。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把启动前遮罩与原生媒体栈结合，不需客户端 bundle；具备跳过与错误退出路径。详见[Q01](#research-q01)和[Q02](#research-q02)。

把启动前遮罩与原生媒体栈结合，不需客户端 bundle；具备跳过与错误退出路径。详见[Q01](#research-q01)和[Q02](#research-q02)。

Host-only 注入与 Range 服务可复用；独立硬上限和参数校验应补。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

maxSeconds 初始计时器被 metadata 清掉，长视频或无效 duration 可能延迟/失去自动解锁；数值配置未逐项校验。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人视觉定制可观察使用；先核 Esc、错误视频和长视频超时，减动效用户宜关闭。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核注入/Range/跳过；loadedmetadata 会替换 maxSeconds guard，所谓硬上限不成立，配置和减动效缺口未实测。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/inject.js、lib/media.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、Host/注入/媒体源码与素材大小；未运行插件、自检、浏览器或目标 Desktop；旧 META 仅复用。
- 下一步：目标 Desktop 冷启动、Range/解码、自动播放拒绝、无效/长 metadata、负值配置、减动效与 state 鉴权。

**分析版本**

- **仓库**：[456erddgr/dsh-boo550wt-animation](https://github.com/456erddgr/dsh-boo550wt-animation)
- **版本号**：1.0.0（[固定提交 aeac4c9](https://github.com/456erddgr/dsh-boo550wt-animation/tree/aeac4c96f33b7947e19b44c36c421185ec2cda1a)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向为独立绝对上限计时器、配置 schema/range、减动效门控和状态路由权限审计。详见[Q05](#research-q05)。

目标 Desktop 冷启动、Range/解码、自动播放拒绝、无效/长 metadata、负值配置、减动效与 state 鉴权。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 500 | 359 | 95 | — |
| .md | source | 1 | 148 | — | — | 1753 |
| .mjs | source | 4 | 900 | 744 | 84 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/456erddgr/dsh-boo550wt-animation/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**启动遮罩能否可靠交接且在长视频、异常配置和无障碍条件下及时释放界面？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 开机动画如何覆盖应用启动，实际带来何种价值？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

插件在 Desktop/Web 入口的 webserver/index-inject 中注入 style 和 body script，先于客户端模块加载建立全屏视频遮罩；应用在下面继续启动，视频播完或按 Esc 后淡出。自带 12.1MB 素材、可换本地 mp4，适合个人品牌化启动体验，不改变 DSH 工作流效率。README 的真实 Chromium 截图/自检是作者报告，本轮只看源码与资源存在，未复现目标 Desktop。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-23](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/README.md#L1-L23)

作者启动体验和预览声明

<details>
<summary>查看原文（23行）</summary>

````text
# dsh-boo550wt-animation

给 **DeepSeek Harness** 加一段开机动画：打开 DSH 时全屏播放一段视频，播完（或者按 `Esc`）才进入界面。

> 自带素材 `assets/boot.mp4` 是一段 **550W 风格**的启动动画 —— 16.6 秒、1024×576、H.264 + AAC、12.1 MB。

```
打开 DSH  ─▶  黑底 + 视频  ─▶  播完 / 按 Esc  ─▶  淡出  ─▶  正常界面
```

关键在于**交接时机**：遮罩在 DSH 结算「启动就绪」之前就已经挂上去了，所以应用是在遮罩底下正常渲染的，等动画结束再把界面让出来 —— 而不是先看到界面再盖一层。

## 效果预览

自带素材的分镜（2.0s / 6.0s / 12.0s / 15.0s）：

![开机动画分镜：550W 标志、量子计算机控制系统、剩余进度 69%、剩余进度 100%](docs/preview.png)

真实播放时的样子 —— 画面铺满窗口，右下角在 4 秒后浮现跳过提示：

![实际播放画面，右下角显示「按 Esc 跳过」](docs/boot-scene.png)

> 两张图都是从 `assets/boot.mp4` 里实拍的，不是效果图：用真实 Chromium 媒体栈经插件的 Range 路由解码后截帧生成（`tools/stills.mjs` 与 `tools/browser-check.mjs --shot=`）。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:127-148](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/index.js#L127-L148)

注入 style/script

<details>
<summary>查看原文（22行）</summary>

```text
  const disposers = [];
  disposers.push(ctx.effect(() => ctx.webServer.register({ kind: "prefix", path: BASE, handler }), "boot-animation: clip route"));

  ctx.on("webserver/index-inject", (table) => {
    table.push({ kind: "style", text: BOOT_STYLE });
    table.push({
      kind: "script",
      placement: "body",
      text: bootScript({
        src: `${BASE}${VIDEO_ROUTE}`,
        zIndex: settings.zIndex,
        skipHint: settings.skipHint,
        silentHint: settings.silentHint,
        blockedHint: settings.blockedHint,
        errorHint: settings.errorHint,
        hintDelayMs: settings.hintDelayMs,
        maxSeconds: settings.maxSeconds,
        graceMs: settings.graceMs,
        fadeMs: settings.fadeMs,
      }),
    });
  });
```

</details>

**依据 3 · 源码核查**：[lib/inject.js:49-81](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/inject.js#L49-L81)

视频遮罩在页面直接挂载

<details>
<summary>查看原文（33行）</summary>

```text
function bootClient(CONFIG) {
  var doc = document;
  var ID = "dsh-boo550wt-animation-layer";
  var existing = doc.getElementById(ID);
  if (existing !== null && existing.parentNode !== null) return; // already mounted

  var layer = doc.createElement("div");
  layer.id = ID;
  layer.className = "dsh-boo550wt-animation-layer";
  layer.setAttribute("aria-hidden", "true");
  layer.setAttribute("data-dsh-boo550wt-animation", "playing");
  layer.style.zIndex = String(CONFIG.zIndex);

  var video = doc.createElement("video");
  video.className = "dsh-boo550wt-animation-video";
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.setAttribute("preload", "auto");
  video.controls = false;
  video.loop = false;
  video.disablePictureInPicture = true;
  video.src = CONFIG.src;

  var hint = doc.createElement("div");
  hint.className = "dsh-boo550wt-animation-hint";
  hint.textContent = CONFIG.skipHint;

  layer.appendChild(video);
  layer.appendChild(hint);
  (doc.body !== null ? doc.body : doc.documentElement).appendChild(layer);
  doc.documentElement.classList.add("dsh-boo550wt-animation-locked");
```

</details>

**依据 4 · 源码核查**：[lib/inject.js:124-152](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/inject.js#L124-L152)

播毕淡出/解锁

<details>
<summary>查看原文（29行）</summary>

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
    video.removeEventListener("ended", finish);
    video.removeEventListener("loadedmetadata", onMetadata);
    video.removeEventListener("error", onVideoError);
    layer.setAttribute("data-dsh-boo550wt-animation", "done");
    try { video.pause(); } catch (ignored) { /* ignore */ }
    layer.classList.add("dsh-boo550wt-animation-out");
    fade = setTimeout(unmount, CONFIG.fadeMs);
  }

  function unmount() {
    if (fade !== null) clearTimeout(fade);
    fade = null;
    doc.documentElement.classList.remove("dsh-boo550wt-animation-locked");
    if (layer.parentNode !== null) layer.parentNode.removeChild(layer);
    try {
      video.removeAttribute("src");
      video.load();
    } catch (ignored) { /* ignore */ }
    try { delete globalThis.__DSH_BOOT_ANIMATION__; } catch (ignored) { /* ignore */ }
  }
```

</details>

#### 缺口

- 目标 Desktop 注入时序与用户体感未测
  **影响：**不能保证所有宿主版本首帧无遮挡或有收益
  **进一步探讨：**真实 Desktop 冷/热启动截图与主观等待测试

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 视频字节服务与失败回退如何实现？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

Host 把包内或 videoPath 指向的 mp4 通过同源 /boot-animation/video.mp4 路由提供 GET/HEAD，支持单字节 Range、206/416 与流式读取，遇文件不存在/非文件返回 404；脚本处理播放结束、视频错误、自动播放拒绝，先试静音并允许用户手势重播，Esc 可跳过，卸载时移除 DOM/监听、清视频 src。成功依赖 DSH webServer/index-inject 及浏览器媒体栈；未执行项目自检或目标宿主。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:90-129](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/index.js#L90-L129)

路由及视频路径

<details>
<summary>查看原文（40行）</summary>

```text
  const video = settings.videoPath === "" ? BUNDLED_VIDEO : resolve(settings.videoPath);
  const logger = ctx.logger?.("boot-animation");

  /** Answer the plugin's own subpaths; anything else is not ours. */
  const handler = async (req, res) => {
    const path = new URL(req.url ?? "/", "http://x").pathname;
    if (path === `${BASE}${VIDEO_ROUTE}`) {
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405, { allow: "GET, HEAD", "cache-control": "no-store" });
        res.end();
        return;
      }
      await serveVideo(video, req, res);
      return;
    }
    if (path === `${BASE}${STATE_ROUTE}` && (req.method === "GET" || req.method === "HEAD")) {
      let stat = null;
      try {
        const { promises: fs } = await import("node:fs");
        stat = await fs.stat(video);
      } catch {
        stat = null;
      }
      sendJson(res, 200, {
        plugin: "dsh-boo550wt-animation",
        base: BASE,
        video,
        videoAvailable: stat !== null && stat.isFile(),
        videoBytes: stat !== null && stat.isFile() ? stat.size : null,
        settings,
      });
      return;
    }
    res.writeHead(404, { "cache-control": "no-store" });
    res.end();
  };

  const disposers = [];
  disposers.push(ctx.effect(() => ctx.webServer.register({ kind: "prefix", path: BASE, handler }), "boot-animation: clip route"));

```

</details>

**依据 2 · 源码核查**：[lib/media.js:25-46](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/media.js#L25-L46)

Range 解析

<details>
<summary>查看原文（22行）</summary>

```text
/** Parse a single-range `Range` header against a known total size. */
export function parseRange(header, size) {
  if (typeof header !== "string" || header.length === 0) return { kind: "full" };
  const match = /^bytes=(.*)$/i.exec(header.trim());
  if (match === null) return { kind: "unsatisfiable" };
  const spec = match[1].split(",")[0].trim();
  const parts = /^(\d*)-(\d*)$/.exec(spec);
  if (parts === null) return { kind: "unsatisfiable" };
  const rawStart = parts[1];
  const rawEnd = parts[2];
  if (rawStart === "" && rawEnd === "") return { kind: "unsatisfiable" };
  if (rawStart === "") {
    const suffix = Number(rawEnd);
    if (!Number.isFinite(suffix) || suffix <= 0) return { kind: "unsatisfiable" };
    const start = Math.max(0, size - suffix);
    return { kind: "range", start, end: size - 1 };
  }
  const start = Number(rawStart);
  if (!Number.isFinite(start) || start >= size) return { kind: "unsatisfiable" };
  const end = rawEnd === "" ? size - 1 : Math.min(Number(rawEnd), size - 1);
  if (!Number.isFinite(end) || end < start) return { kind: "unsatisfiable" };
  return { kind: "range", start, end };
```

</details>

**依据 3 · 源码核查**：[lib/media.js:71-136](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/media.js#L71-L136)

GET/HEAD/206/416 与流输出

<details>
<summary>查看原文（66行）</summary>

```text
export async function serveVideo(file, req, res) {
  let stat;
  try {
    stat = await fs.stat(file);
  } catch (error) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
    res.end(`boot animation: clip is unavailable (${error.code ?? "unknown"})`);
    return;
  }
  if (!stat.isFile()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
    res.end("boot animation: clip path is not a file");
    return;
  }

  const size = stat.size;
  const range = parseRange(req.headers.range, size);

  if (range.kind === "unsatisfiable") {
    res.writeHead(416, {
      "content-range": `bytes */${size}`,
      "accept-ranges": "bytes",
      "cache-control": "no-store",
    });
    res.end();
    return;
  }

  if (req.method === "HEAD") {
    if (range.kind === "full") sendHead(res, 200, size, undefined);
    else sendHead(res, 206, size, range);
    res.end();
    return;
  }

  if (range.kind === "full") {
    sendHead(res, 200, size, undefined);
    await pump(createReadStream(file, { highWaterMark: CHUNK }), res);
    return;
  }

  sendHead(res, 206, size, range);
  await pump(createReadStream(file, { start: range.start, end: range.end, highWaterMark: CHUNK }), res);
}

/** Pipe a stream into the response, tolerating client disconnects. */
function pump(stream, res) {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    stream.on("error", () => {
      if (!res.headersSent) res.writeHead(500, { "cache-control": "no-store" });
      res.end();
      done();
    });
    res.on("close", () => {
      stream.destroy();
      done();
    });
    res.on("finish", done);
    stream.pipe(res);
  });
```

</details>

**依据 4 · 源码核查**：[lib/inject.js:91-116](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/inject.js#L91-L116)

跳过与手势处理

<details>
<summary>查看原文（26行）</summary>

```text
  function onKeyDown(event) {
    if (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      finish();
    }
  }

  function onGestureStart() {
    disarmGesture();
    var attempt = video.play();
    if (attempt !== undefined && typeof attempt.catch === "function") attempt.catch(noop);
  }

  function armGesture() {
    if (gestureArmed || finished) return;
    gestureArmed = true;
    window.addEventListener("pointerdown", onGestureStart, true);
    window.addEventListener("keydown", onGestureStart, true);
  }

  function disarmGesture() {
    if (!gestureArmed) return;
    gestureArmed = false;
    window.removeEventListener("pointerdown", onGestureStart, true);
    window.removeEventListener("keydown", onGestureStart, true);
```

</details>

**依据 5 · 源码核查**：[lib/inject.js:124-207](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/inject.js#L124-L207)

失败/结束/清理

<details>
<summary>查看原文（84行）</summary>

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
    video.removeEventListener("ended", finish);
    video.removeEventListener("loadedmetadata", onMetadata);
    video.removeEventListener("error", onVideoError);
    layer.setAttribute("data-dsh-boo550wt-animation", "done");
    try { video.pause(); } catch (ignored) { /* ignore */ }
    layer.classList.add("dsh-boo550wt-animation-out");
    fade = setTimeout(unmount, CONFIG.fadeMs);
  }

  function unmount() {
    if (fade !== null) clearTimeout(fade);
    fade = null;
    doc.documentElement.classList.remove("dsh-boo550wt-animation-locked");
    if (layer.parentNode !== null) layer.parentNode.removeChild(layer);
    try {
      video.removeAttribute("src");
      video.load();
    } catch (ignored) { /* ignore */ }
    try { delete globalThis.__DSH_BOOT_ANIMATION__; } catch (ignored) { /* ignore */ }
  }

  function onMetadata() {
    if (guard !== null) clearTimeout(guard);
    var seconds = video.duration;
    // Phrased as a negated comparison so the emitted text stays free of angle
    // brackets: the row is inserted verbatim inside a script element.
    if (typeof seconds !== "number" || !isFinite(seconds) || !(seconds > 0)) return;
    guard = setTimeout(finish, Math.round(seconds * 1000) + CONFIG.graceMs);
  }

  function onVideoError() {
    if (finished) return;
    showHint(CONFIG.errorHint);
    if (guard !== null) clearTimeout(guard);
    guard = setTimeout(finish, 900);
  }

  function onPlayRefused() {
    if (finished) return;
    // Sound was refused (or playback entirely). Muted playback is allowed by
    // every engine, so fall back to it and say so; a gesture retries with sound.
    video.muted = true;
    var retry = video.play();
    if (retry !== undefined && typeof retry.catch === "function") {
      retry.catch(function () {
        if (finished) return;
        showHint(CONFIG.blockedHint);
        armGesture();
      });
    }
    showHint(CONFIG.silentHint);
  }

  function start() {
    var attempt = video.play();
    if (attempt !== undefined && typeof attempt.catch === "function") attempt.catch(onPlayRefused);
  }

  video.addEventListener("ended", finish);
  video.addEventListener("loadedmetadata", onMetadata);
  video.addEventListener("error", onVideoError);
  window.addEventListener("keydown", onKeyDown, true);

  // Absolute ceiling: never hold the user hostage if the file stalls.
  guard = setTimeout(finish, CONFIG.maxSeconds * 1000);
  // The skip affordance only appears after the animation has had the stage.
  hintTimer = setTimeout(function () {
    if (!finished) hint.classList.add("dsh-boo550wt-animation-hint-on");
  }, CONFIG.hintDelayMs);

  try {
    globalThis.__DSH_BOOT_ANIMATION__ = { skip: finish, element: layer, video: video };
  } catch (ignored) { /* ignore */ }

  start();
```

</details>

#### 缺口

- 目标浏览器编码/自动播放/Range 代理行为未测
  **影响：**不能从源码保证实际解码播放
  **进一步探讨：**目标 Desktop 冷启动、错误视频和 Range 网络检查

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · maxSeconds 是否真的构成绝对硬上限？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

脚本在启动时设置 maxSeconds 定时器，但 loadedmetadata 事件会先 clearTimeout(guard)，再把 guard 改为 duration×1000+graceMs。若自定义视频长度超过 maxSeconds，或 metadata 上报很长而播放停住，上限可延到媒体时长以后；README 所称硬上限因此与源码不一致。若时长无效，旧 guard 已被清掉且代码直接 return，Esc 仍可跳过，但没有自动兜底 timer。该风险是代码路径判断，目标播放器时序未实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:73-85](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/README.md#L73-L85)

作者将 maxSeconds 称为硬上限

<details>
<summary>查看原文（13行）</summary>

```text
| 字段 | 默认值 | 含义 |
| --- | --- | --- |
| `enabled` | `true` | 设 `false` 可以临时停用而不卸载 |
| `videoPath` | `""` | 换成别的视频；留空 = 用自带素材 |
| `zIndex` | `2147483000` | 遮罩层级 |
| `maxSeconds` | `120` | 硬上限，卡死的视频也绝不会锁住窗口 |
| `graceMs` | `1500` | 上报时长之外再宽限多久才触发上限 |
| `fadeMs` | `380` | 交接时的淡出时长 |
| `hintDelayMs` | `4000` | 多久之后出现跳过提示 |
| `skipHint` | `按 Esc 跳过` | 提示文字 |
| `silentHint` | `按 Esc 跳过 · 点击开启声音` | 被降级成静音时显示 |
| `blockedHint` | `点击以播放开机动画` | 自动播放被彻底拦截时显示 |
| `errorHint` | `开机动画不可用` | 视频解不开时显示 |
```

</details>

**依据 2 · 源码核查**：[lib/inject.js:154-161](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/inject.js#L154-L161)

metadata 清旧 guard 并按媒体时长重设

```text
  function onMetadata() {
    if (guard !== null) clearTimeout(guard);
    var seconds = video.duration;
    // Phrased as a negated comparison so the emitted text stays free of angle
    // brackets: the row is inserted verbatim inside a script element.
    if (typeof seconds !== "number" || !isFinite(seconds) || !(seconds > 0)) return;
    guard = setTimeout(finish, Math.round(seconds * 1000) + CONFIG.graceMs);
  }
```

**依据 3 · 源码核查**：[lib/inject.js:191-201](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/inject.js#L191-L201)

初始 maxSeconds 守卫与跳过

<details>
<summary>查看原文（11行）</summary>

```text
  video.addEventListener("ended", finish);
  video.addEventListener("loadedmetadata", onMetadata);
  video.addEventListener("error", onVideoError);
  window.addEventListener("keydown", onKeyDown, true);

  // Absolute ceiling: never hold the user hostage if the file stalls.
  guard = setTimeout(finish, CONFIG.maxSeconds * 1000);
  // The skip affordance only appears after the animation has had the stage.
  hintTimer = setTimeout(function () {
    if (!finished) hint.classList.add("dsh-boo550wt-animation-hint-on");
  }, CONFIG.hintDelayMs);
```

</details>

#### 缺口

- 长/损坏 metadata 在目标媒体栈是否触发未测
  **影响：**不能承诺窗口最多锁 120 秒
  **进一步探讨：**保留独立 absolute guard，长视频/无效 metadata/停滞回归

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 参数与无障碍边界是否受控？

**研究主题：**缺陷与关键质疑、效果与总成本

#### 完整回答

resolveConfig 只校验 videoPath 为字符串和 zIndex 为有限数，其余 maxSeconds/graceMs/fadeMs/hintDelayMs 可接收负数、非数字或极大值，随后直接进入 setTimeout；hint 等文案虽经 JSON.stringify 注入，但无需假定 HTML 字符串拼接风险。启动脚本没有读取 prefers-reduced-motion，默认自动播视频且遮罩拦住界面，Esc/禁用配置可绕过。12.1MB 视频资源和重启加载成本在源码/资产中可见，电量和实际首帧延迟未测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:39-63](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/index.js#L39-L63)

配置默认值与有限校验

<details>
<summary>查看原文（25行）</summary>

```text
const DEFAULTS = Object.freeze({
  enabled: true,
  videoPath: "",
  zIndex: 2147483000,
  maxSeconds: 120,
  graceMs: 1500,
  fadeMs: 380,
  hintDelayMs: 4000,
  skipHint: "按 Esc 跳过",
  silentHint: "按 Esc 跳过 · 点击开启声音",
  blockedHint: "点击以播放开机动画",
  errorHint: "开机动画不可用",
});

/** Merge user config onto the defaults, rejecting unusable values. */
function resolveConfig(config) {
  const input = config !== null && typeof config === "object" ? config : {};
  const out = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS)) {
    if (input[key] === undefined || input[key] === null) continue;
    out[key] = key === "enabled" ? input[key] === true : input[key];
  }
  if (typeof out.videoPath !== "string") out.videoPath = DEFAULTS.videoPath;
  if (!Number.isFinite(out.zIndex)) out.zIndex = DEFAULTS.zIndex;
  return out;
```

</details>

**依据 2 · 源码核查**：[lib/inject.js:154-207](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/inject.js#L154-L207)

定时/自动播放，无 reduced-motion 分支

<details>
<summary>查看原文（54行）</summary>

```text
  function onMetadata() {
    if (guard !== null) clearTimeout(guard);
    var seconds = video.duration;
    // Phrased as a negated comparison so the emitted text stays free of angle
    // brackets: the row is inserted verbatim inside a script element.
    if (typeof seconds !== "number" || !isFinite(seconds) || !(seconds > 0)) return;
    guard = setTimeout(finish, Math.round(seconds * 1000) + CONFIG.graceMs);
  }

  function onVideoError() {
    if (finished) return;
    showHint(CONFIG.errorHint);
    if (guard !== null) clearTimeout(guard);
    guard = setTimeout(finish, 900);
  }

  function onPlayRefused() {
    if (finished) return;
    // Sound was refused (or playback entirely). Muted playback is allowed by
    // every engine, so fall back to it and say so; a gesture retries with sound.
    video.muted = true;
    var retry = video.play();
    if (retry !== undefined && typeof retry.catch === "function") {
      retry.catch(function () {
        if (finished) return;
        showHint(CONFIG.blockedHint);
        armGesture();
      });
    }
    showHint(CONFIG.silentHint);
  }

  function start() {
    var attempt = video.play();
    if (attempt !== undefined && typeof attempt.catch === "function") attempt.catch(onPlayRefused);
  }

  video.addEventListener("ended", finish);
  video.addEventListener("loadedmetadata", onMetadata);
  video.addEventListener("error", onVideoError);
  window.addEventListener("keydown", onKeyDown, true);

  // Absolute ceiling: never hold the user hostage if the file stalls.
  guard = setTimeout(finish, CONFIG.maxSeconds * 1000);
  // The skip affordance only appears after the animation has had the stage.
  hintTimer = setTimeout(function () {
    if (!finished) hint.classList.add("dsh-boo550wt-animation-hint-on");
  }, CONFIG.hintDelayMs);

  try {
    globalThis.__DSH_BOOT_ANIMATION__ = { skip: finish, element: layer, video: video };
  } catch (ignored) { /* ignore */ }

  start();
```

</details>

**依据 3 · 作者声明**：[README.md:3-11](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/README.md#L3-L11)

作者描述素材/遮罩

````text
给 **DeepSeek Harness** 加一段开机动画：打开 DSH 时全屏播放一段视频，播完（或者按 `Esc`）才进入界面。

> 自带素材 `assets/boot.mp4` 是一段 **550W 风格**的启动动画 —— 16.6 秒、1024×576、H.264 + AAC、12.1 MB。

```
打开 DSH  ─▶  黑底 + 视频  ─▶  播完 / 按 Esc  ─▶  淡出  ─▶  正常界面
```

关键在于**交接时机**：遮罩在 DSH 结算「启动就绪」之前就已经挂上去了，所以应用是在遮罩底下正常渲染的，等动画结束再把界面让出来 —— 而不是先看到界面再盖一层。
````

#### 缺口

- 减动效需求、解码性能和非数配置影响未测
  **影响：**不能称所有配置下硬上限/无障碍安全
  **进一步探讨：**参数边界、reduced-motion、内存/首帧性能矩阵

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装与回退应怎样验收？

**研究主题：**采用判断、新假设与验证

#### 完整回答

作者给 Desktop profile CLI 安装/重启流程，/boot-animation/state 可报告视频绝对路径、文件可用性/字节数和 settings，适合确认 Host 加载；但该状态路由也暴露本地文件路径与配置，目标 webServer 的鉴权边界本轮未核。启用前应确认开机可 Esc 跳过、错误视频 0.9 秒后退出及长视频不超过期望；可改进独立硬上限、数值范围校验和减动效门控。以上改进均未实现，建议个人环境观察使用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-59](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/README.md#L27-L59)

作者安装及状态路由自查

<details>
<summary>查看原文（33行）</summary>

````text
## 怎么用

### 1. 装

DSH 的插件用它自己的 CLI 安装（`desktop` 是保留 profile，由 Electron 应用托管）：

```powershell
# 先拿到仓库
git clone https://github.com/456erddgr/dsh-boo550wt-animation.git

# 再用 DSH 自带的 CLI 装进 desktop profile
$env:ELECTRON_RUN_AS_NODE = '1'
& "<你的安装目录>\DeepSeek Harness.exe" --expose-internals `
  "<你的安装目录>\resources\app.asar\dsh\node_modules\@deepseek-ai\dsh-desktop-host\lib\cli.js" `
  plugin --profile desktop add "<clone 出来的目录>"
```

`<你的安装目录>` 默认是 `%LOCALAPPDATA%\Programs\DeepSeek Harness`。

这条命令会做三件事：加一条 `link:` 依赖、在 `node_modules` 里建好入口、把 bundle 追加进 `dsh.profile.bundles`。

> `add` 底层是 pnpm，所以也接受 git 形式：
> `plugin --profile desktop add github:456erddgr/dsh-boo550wt-animation`

### 2. 重启 DSH

**必须重启。** Host 半侧的代码只在 DSH 启动时被 import 一次，热更新不会加载它。

重启后可以自查 —— 浏览器打开这个地址，返回 JSON 就说明 Host 半侧已经起来了：

```
http://127.0.0.1:19387/boot-animation/state
```
````

</details>

**依据 2 · 源码核查**：[lib/index.js:105-120](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/index.js#L105-L120)

状态路由返回绝对路径和配置

<details>
<summary>查看原文（16行）</summary>

```text
    if (path === `${BASE}${STATE_ROUTE}` && (req.method === "GET" || req.method === "HEAD")) {
      let stat = null;
      try {
        const { promises: fs } = await import("node:fs");
        stat = await fs.stat(video);
      } catch {
        stat = null;
      }
      sendJson(res, 200, {
        plugin: "dsh-boo550wt-animation",
        base: BASE,
        video,
        videoAvailable: stat !== null && stat.isFile(),
        videoBytes: stat !== null && stat.isFile() ? stat.size : null,
        settings,
      });
```

</details>

**依据 3 · 源码核查**：[lib/inject.js:163-167](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/inject.js#L163-L167)

错误 900ms 退出

```text
  function onVideoError() {
    if (finished) return;
    showHint(CONFIG.errorHint);
    if (guard !== null) clearTimeout(guard);
    guard = setTimeout(finish, 900);
```

**依据 4 · 源码核查**：[lib/inject.js:91-96](https://github.com/456erddgr/dsh-boo550wt-animation/blob/aeac4c96f33b7947e19b44c36c421185ec2cda1a/lib/inject.js#L91-L96)

Esc 退出

```text
  function onKeyDown(event) {
    if (event.key === "Escape" || event.key === "Esc" || event.keyCode === 27) {
      event.preventDefault();
      event.stopPropagation();
      finish();
    }
```

#### 缺口

- 目标 Desktop 安装/鉴权与回退实效未测
  **影响：**不可用状态路由或自测声明替代目标验收
  **进一步探讨：**目标环境做鉴权/安装/损坏素材/长视频/减动效验收

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
