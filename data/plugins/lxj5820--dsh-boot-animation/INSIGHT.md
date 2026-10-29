# DSH Boot Animation（lxj5820）

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[14e40fe](https://github.com/lxj5820/dsh-boot-animation/tree/14e40fe921b671f29f7344e5948172fc7c1d9e55)

<!-- BEGIN META -->
[![GitHub ★ 285](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=285&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lxj5820/dsh-boot-animation) [![npm 30d 8,234](https://img.shields.io/static/v1?label=npm+30d&message=8%2C234&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-boot-animation) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-boot-animation)
<!-- END META -->

> **功能**：预框架启动短片覆盖层，带 client 交接、设置、失败提示和可选媒体 faststart 优化。

> **亮点**：独立预框架视觉、首帧/卡顿监测与键盘退出，设置和交接隔离；效果仍需真实浏览器验。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：ready只是本client激活；15秒仅提示而非自动退出；默认首击可能解音、全禁素材会回全集。优化会改磁盘且同名backup覆盖，不是播放成功/绝对恢复保证。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 真实插件入口及相对原生加载页价值？](#detail-section-11)
  - [Q02 · 首帧、ready、卡顿和用户跳过如何组合？](#detail-section-12)
  - [Q03 · 素材服务、优化写入、设置及兼容依赖如何？](#detail-section-13)
  - [Q04 · 总成本、采用建议与可检验方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：明确喜欢启动短片的DSH本地Web用户；产物是等待视觉体验，不是内核加速或模型能力。见[Q01](#research-q01)。

原生DSH加载页与直接进入；可选faststart重排只改变容器布局，不增加codec支持。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 启动覆盖层 | 短片/淡入/进度 | 不加速内核，依赖宿主DOM契约 |
| ready与退出 | client交接和手动/watchdog | 激活非业务成功，15秒仅提示 |
| 素材池 | 本地多片/失败尝试 | 全禁用回全集，总开关才停注入 |
| 优化 | moov前移和backup | 按需改盘，结构通过不保音画/崩溃恢复 |

**流程与依赖**

Web契约、schema与浏览器可播素材，优化另需可写目录/备份空间；表见[Q04](#research-q04)。

非私人片/静音/一击进入试小样，验按键/ready慢/失败，关总开关刷新退路；优化另验；表见[Q04](#research-q04)。

**效果与成本**

本地无需必需账号，解码/每次传输、等待和兼容/恢复成本未知；表见[Q04](#research-q04)。

改变等待体验和诊断接线，不证明启动更快、审美普适或优化绝对无损；效果见[Q04](#research-q04)。

> **思考**：ready只是本client激活；15秒仅提示而非自动退出；默认首击可能解音、全禁素材会回全集。优化会改磁盘且同名backup覆盖，不是播放成功/绝对恢复保证。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：独立预框架视觉、首帧/卡顿监测与键盘退出，设置和交接隔离；效果仍需真实浏览器验。见[Q01](#research-q01)、[Q02](#research-q02)。

预框架独立覆盖层与优先client交接、首帧/卡顿watchdog可借鉴；宿主DOM/英文错误、Config和写路由边界需持续回归。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

ready只是本client激活；15秒仅提示而非自动退出；默认首击可能解音、全禁素材会回全集。优化会改磁盘且同名backup覆盖，不是播放成功/绝对恢复保证。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可在信任本地Web用非私人素材、sound=false/clickToEnter=true有限试用，核键盘和一次点击放行；无效、状态误读或媒体结果未知时停用刷新回原生，先查backup而非重复优化。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Host注入、媒体/ready/退出及优化恢复主要源码链已查；未运行目标、播放或改媒体。限本地非私人素材可回退试用，假设不计现有效果。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、cordis.patch.yml、entry.js、src/boot-screen.js、src/client.js、lib/client.js、src/remux.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向检查entry全主要注入/配置/路由链，boot-screen的ready/首帧/卡顿/退出/manifest分支，client交接并核lib对应输出，完整读optimizeInPlace；固定git tree核素材/安装入口存在。不通读全部媒体算法/设置UI，不执行/播放/改媒体。
- 下一步：后续固定宿主/片源验证静音及默认音频、手动按键、ready迟到、无帧/冻结/全禁用；可丢弃素材另测优化/备份与并发，不以作者自检替代。

**分析版本**

- **仓库**：[lxj5820/dsh-boot-animation](https://github.com/lxj5820/dsh-boot-animation)
- **版本号**：0.2.0（[固定提交 14e40fe](https://github.com/lxj5820/dsh-boot-animation/tree/14e40fe921b671f29f7344e5948172fc7c1d9e55)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是分清装饰退出/client激活/应用可操作及原因，用卡顿/客户端迟到比较误判与进入时间，原生提示足够则止于提示改进。见[Q04](#research-q04)。

后续固定宿主/片源验证静音及默认音频、手动按键、ready迟到、无帧/冻结/全禁用；可丢弃素材另测优化/备份与并发，不以作者自检替代。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 995 | — | — | 19676 |
| .mjs | source | 13 | 2887 | 2077 | 594 | — |
| .js | source | 5 | 4574 | 2570 | 1749 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/lxj5820/dsh-boot-animation/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：装饰启动如何不阻塞用户，交接与可选媒体写入有哪些实际边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真实插件入口及相对原生加载页价值？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

真实DSH bundle插件，entry.js的apply提供视频清单/字节/优化路由，并在index head注入配置和独立启动脚本；client apply优先通知overlay.clientReady，再接可选设置卡。它是启动视觉装饰和可诊断等待界面，不是模型工具或让内核更快的加速器。

针对明确喜欢鲸鱼娘短片、愿在本地Web启动时看动画的用户，基线是DSH原生加载页和直接进入界面。增量是素材随机/避免近期重复、配真实宿主进度映射的覆盖层、首帧/卡顿失败提示、可跳过和三种进入方式；这种等待体验价值是个人偏好，不能推定提高工作产出。

素材预处理faststart有缩短可播准备的合理工程目的，但不改变视频编码，也不让所有浏览器支持原本不兼容的codec。README大量开发自检与实测描述属于作者材料，本轮不运行这些脚本，不把作者假时钟/桩渲染当独立GUI和声音效果验收。

#### 证据与依据

**依据 1 · 源码核查**：[entry.js:610-638](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/entry.js#L610-L638)

真实index注入及关闭分支。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.on('webserver/index-inject', (table) => {
    const settings = currentSettings()

    // Switched off means switched off: no configuration row, no screen script, no
    // overlay, and not one request for a clip. The kernel's own boot page is what
    // shows. Injecting a disabled screen and making the script bail out would look
    // the same and leave the whole thing running; this is the only version of
    // "off" that is actually off.
    if (!settings.enabled) return

    // The row reads a plain global the script fills in, so the injection stays
    // JSON-serializable data and the script itself stays a static asset.
    table.push({
      kind: 'script',
      placement: 'head',
      text: `globalThis.__DSH_BOOT_ANIM_CFG__=${JSON.stringify({
        base: ROUTE,
        manifest: `${ROUTE}/clips.json`,
        holdMs: 15000,
        fadeMs: settings.fadeMs,
        enterMode: settings.enterMode,
        sound: settings.sound,
        clickToEnter: settings.clickToEnter,
        showHint: settings.showHint,
      })}`,
    })
    table.push({ kind: 'script', placement: 'head', text: bootScreenSource() })
  })
}
```

</details>

**依据 2 · 源码核查**：[src/client.js:860-879](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/client.js#L860-L879)

clientReady优先通知。

<details>
<summary>查看原文（20行）</summary>

```text

/**
 * Report activation, then contribute the settings card if the shell is willing.
 * @param ctx - Client plugin context.
 */
exports.apply = function apply(ctx) {
  // 1. Priority one, and it must not be able to fail for any other reason.
  try {
    const overlay = globalThis[OVERLAY]
    // A missing overlay means the Host half contributed nothing (for example a
    // static deployment whose boot payload carries no injection), in which case
    // the kernel boot page is the only screen and there is nothing to hand over.
    if (overlay !== undefined && typeof overlay.clientReady === 'function') {
      overlay.clientReady()
    }
  } catch (error) {
    // Never break the client roster over a decorative overlay.
    console.warn('boot-animation: client half failed', error)
  }

```

</details>

**依据 3 · 源码核查**：[entry.js:477-509](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/entry.js#L477-L509)

素材清单和版本URL。

<details>
<summary>查看原文（33行）</summary>

```text
  // register. An exact manifest route plus a `/clip` prefix leaves every other
  // path under ROUTE to its owner.
  ctx.effect(() => server.register({
    kind: 'exact',
    path: `${ROUTE}/clips.json`,
    handler: (req, res) => {
      void (async () => {
        const clips = await listClips()
        const disabled = new Set(currentSettings().disabledClips)
        sendJson(res, 200, {
          clips: clips.map(clip => ({
            // The revision is the size+time pair the bytes route also answers as
            // its ETag, and the URL is what makes a stale cache entry unreachable:
            // it changes whenever the file does — or whenever the scheme that
            // produced a bad entry changes. The first scheme (mtime alone) left
            // truncated `immutable` entries that a normal reload kept reusing, and
            // nothing but a hard reload could dislodge them.
            src: `${ROUTE}/clip/${encodeURIComponent(basename(clip.file))}`
              + `?v=${String(clip.revision)}-${String(clip.bytes)}`,
            name: basename(clip.file),
            // Everything on disk is listed, with the pool decision carried as a
            // field. The screen plays only the enabled ones; the settings card
            // needs the whole list to offer them back.
            enabled: !disabled.has(basename(clip.file)),
            bytes: clip.bytes,
            faststart: clip.faststart,
          })),
        })
      })().catch((error) => {
        ctx.logger?.error?.('boot-animation: manifest route failed', error)
        if (!res.headersSent) sendJson(res, 500, { error: 'internal' })
        else res.end()
      })
```

</details>

**依据 4 · 源码核查**：[package.json:17-47](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/package.json#L17-L47)

Host/client及bundle分发。

<details>
<summary>查看原文（31行）</summary>

```text
  "exports": {
    ".": "./entry.js",
    "./client": {
      "default": "./lib/client.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "assets",
    "lib",
    "src",
    "cordis.patch.yml",
    "entry.js",
    "package.json"
  ],
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/schemastery": "*"
  },
  "dsh": {
    "client": {
      "platform": "web"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
}
```

</details>

#### 缺口

- 未实际播放素材或比较启动可用时刻
  **影响**：不能称加速启动或所有浏览器音画正常
  **进一步探讨**：固定同宿主/片源比较原生加载和动画的可操作时间、跳过与声音。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 首帧、ready、卡顿和用户跳过如何组合？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

head脚本先于应用壳建立覆盖层并请求manifest。自动进入主要取决clipDone与bootedAt，click模式明确只靠用户；clientReady由本插件client apply发出，表示该客户端激活到达，不是业务工具、会话或所有插件功能测试通过。进度通过[data-dsh-boot] spinner的--dsh-boot-arc样式读取，失败靠英文文本Failed to load plugins/did not activate识别，属于宿主DOM/文案契约，不保证今后所有错误/语言都能命中。

play() resolved不能代表出画，因此whenFramePresents合并readyState/loadeddata/canplay/requestVideoFrameCallback/timeupdate信号来reveal，六秒没首帧tryNext；manifest十秒没回应设clipDone，就绪后自动进；已出帧后用timeupdate/playing心跳、每秒检查，六秒不进展直接enter，不再等完整片尾。这个stall分支不等待bootedAt，也可能把尚未就绪的原生页面露出，优先保证装饰不扣住用户。未知时长20秒fallback通过maybeEnter，仍需ready且非click模式，不是20秒全局硬释放。

HOLD_MS=15秒的分支仅attention“启动较慢，点击继续”，没有自动enter。失败提示同样是可点入口，不是报错后自动消失；原生启动本身仍可能失败。Esc/空格/Enter直接enter，鼠标press在sound被阻且有audioRetry时默认先解锁声音并返回，下一下才进入；clickToEnter=true才确保这一点击只负责进。不能统称任何配置下一次点击必定跳过。

素材池全部disabled时浏览器将空筛选回退到published全集，所以“全不勾选”并不能停动画。正确总开关在Host enabled=false时根本不注入两行，须刷新新页面生效；已挂覆盖层不是即时卸载。自动tail依媒体剩余时间和ready组合，边界/后台节流需要真实浏览器验证，本轮只有源码推导。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:860-879](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/client.js#L860-L879)

就绪只是client apply。

<details>
<summary>查看原文（20行）</summary>

```text

/**
 * Report activation, then contribute the settings card if the shell is willing.
 * @param ctx - Client plugin context.
 */
exports.apply = function apply(ctx) {
  // 1. Priority one, and it must not be able to fail for any other reason.
  try {
    const overlay = globalThis[OVERLAY]
    // A missing overlay means the Host half contributed nothing (for example a
    // static deployment whose boot payload carries no injection), in which case
    // the kernel boot page is the only screen and there is nothing to hand over.
    if (overlay !== undefined && typeof overlay.clientReady === 'function') {
      overlay.clientReady()
    }
  } catch (error) {
    // Never break the client roster over a decorative overlay.
    console.warn('boot-animation: client half failed', error)
  }

```

</details>

**依据 2 · 源码核查**：[src/boot-screen.js:533-568](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/boot-screen.js#L533-L568)

进度样式与英文错误文案。

<details>
<summary>查看原文（36行）</summary>

```text
  function observeProgress() {
    var boot = document.querySelector('[data-dsh-boot]')
    if (boot === null) return
    var spinner = boot.querySelector('[data-dsh-boot-spinner]')
    if (spinner === null) return
    var update = function () {
      var raw = parseFloat(spinner.style.getPropertyValue('--dsh-boot-arc'))
      var ratio = Number.isFinite(raw) ? Math.min(Math.max((raw - ARC_MIN) / ARC_SPAN, 0), 1) : 0
      parts.fill.style.width = (ratio * 100).toFixed(1) + '%'
    }
    update()
    new MutationObserver(update).observe(spinner, { attributes: true, attributeFilter: ['style'] })
  }

  /**
   * Detect the kernel's failure rendering. The kernel replaces the boot card's
   * children with a failure report and never mounts the application, so without
   * this the screen would hold the viewport forever and hide the diagnosis.
   */
  function observeFailure() {
    var boot = document.querySelector('[data-dsh-boot]')
    if (boot === null) return
    var check = function () {
      if (namespace.failed) return
      var text = boot.textContent || ''
      if (text.indexOf('Failed to load plugins') < 0 && text.indexOf('did not activate') < 0) return
      namespace.failed = true
      attention('启动失败，点击查看')
    }
    new MutationObserver(check).observe(boot, { childList: true, subtree: true, characterData: true })
    check()
  }

  // Set by the clip loader once a clip is playing silently; called by the
  // entering gesture to retry with sound. Declared here because the entering
  // handler is defined outside the loader's scope.
```

</details>

**依据 3 · 源码核查**：[src/boot-screen.js:603-620](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/boot-screen.js#L603-L620)

自动进入条件及click模式。

<details>
<summary>查看原文（18行）</summary>

```text
   * the clip finishes first the last frame is simply held; `clientReady` calls
   * back here the moment the kernel catches up.
   */
  function maybeEnter() {
    // In `click` mode the clip is the whole show and the user decides when it
    // ends; nothing about the clip or the kernel releases the screen but a press.
    if (ENTER_MODE === 'click') return
    if (!clipDone || namespace.failed) return
    if (namespace.bootedAt === null) {
      // Deliberately not the amber attention state: nothing is wrong yet, and
      // flashing the warning for an ordinary slow start would cry wolf on a
      // condition that resolves itself. The amber hint is saved for a real stall.
      parts.hint.textContent = '启动较慢，就绪后自动进入'
      return
    }
    enter()
  }

```

</details>

**依据 4 · 源码核查**：[src/boot-screen.js:648-687](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/boot-screen.js#L648-L687)

首帧信号。

<details>
<summary>查看原文（40行）</summary>

```text
  }

  /**
   * Call back once the clip has a frame to show — starting it is not that moment.
   *
   * A resolved `play()` promise only means the element left the paused state. It
   * says nothing about whether a picture exists, and treating it as success
   * disarmed the retry watchdog, so a clip whose frames never arrived left the
   * screen on the bare gradient with no error and no further attempt.
   *
   * Nor may this wait for a frame to be COMPOSITED, which was the first attempt at
   * fixing that and locked the screen up instead: the element starts fully
   * transparent and this callback is what makes it visible, so
   * `requestVideoFrameCallback` can sit waiting for a frame that will not be
   * submitted until the very style change it is blocking. The signal is *decoded
   * data for the first frame*, from whichever report arrives first, with a
   * presented frame kept as one more route to the same fact.
   * @param video - the clip element.
   * @param done - called once the clip can show something.
   */
  function whenFramePresents(video, done) {
    var fired = false
    var once = function () {
      if (fired) return
      fired = true
      done()
    }
    // "Data for the current playback position is available", which for a fresh
    // element is the first frame.
    if (video.readyState >= 2) {
      once()
      return
    }
    video.addEventListener('loadeddata', once, { once: true })
    video.addEventListener('canplay', once, { once: true })
    if (typeof video.requestVideoFrameCallback === 'function') {
      video.requestVideoFrameCallback(once)
    }
    // Advancing time is the same fact reported by none of the above, and it is the
    // case a MediaRecorder WebM can land in: it may never report `readyState >= 2`
```

</details>

**依据 5 · 源码核查**：[src/boot-screen.js:1056-1089](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/boot-screen.js#L1056-L1089)

manifest有限窗口及全disabled回全集。

<details>
<summary>查看原文（34行）</summary>

```text
    // someone in front of it.
    var releaseWithoutClip = function (message) {
      if (cache.loaded || clipDone) return
      cache.loaded = true
      if (message && parts.root.getAttribute('data-state') !== 'leaving') {
        parts.hint.textContent = message
      }
      clipDone = true
      maybeEnter()
    }
    var manifestWindow = globalThis.setTimeout(function () {
      releaseWithoutClip('素材清单没有回应 · 就绪后自动进入')
    }, 10000)

    // Discover the pool, then play one clip. Loading is deferred until the
    // manifest answers so a page load without clips shows only the gradient.
    var manifest = earlyManifest || requestManifest()
    earlyManifest = null
    manifest
      .then(function (payload) {
        globalThis.clearTimeout(manifestWindow)
        if (previewName === null) marks.manifest = now()
        var published = payload && Array.isArray(payload.clips) ? payload.clips : []
        // The pool the user curated in the settings card. Switching every clip off
        // would leave nothing to play and therefore nothing to trigger the
        // hand-off, so a filter that would empty the pool is dropped rather than
        // obeyed — the same fallback the Host keeps, repeated here because this
        // manifest is the only input this script has.
        var clips = published.filter(function (clip) { return clip.enabled !== false })
        if (clips.length === 0) clips = published
        if (clips.length === 0) {
          releaseWithoutClip('素材池是空的 · 就绪后自动进入')
          return
        }
```

</details>

**依据 6 · 源码核查**：[src/boot-screen.js:1264-1277](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/boot-screen.js#L1264-L1277)

出帧后stall直接enter。

<details>
<summary>查看原文（14行）</summary>

```text
        // clip that is merely buffering must not take that decision away.
        var armStallWatch = function (video, clip) {
          stopStallWatch()
          if (ENTER_MODE === 'click') return
          lastProgress = Date.now()
          stallWatch = globalThis.setInterval(function () {
            if (clipDone || video.ended) { stopStallWatch(); return }
            if (Date.now() - lastProgress < STALL_LIMIT_MS) return
            stopStallWatch()
            noteFailure(clip, 'stalled')
            enter()
          }, 1000)
        }

```

</details>

**依据 7 · 源码核查**：[src/boot-screen.js:1312-1325](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/boot-screen.js#L1312-L1325)

首帧watchdog。

<details>
<summary>查看原文（14行）</summary>

```text
          var advance = globalThis.setTimeout(function () {
            // The clip was given its six seconds and never showed anything. Say so
            // before moving on: "skipped silently" is indistinguishable from "the
            // whole screen is broken" when all you can see is a gradient.
            noteFailure(clip, 'no-frame')
            tryNext()
          }, 6000)
          // Armed only for a clip whose duration cannot be known; see below.
          var endless = null
          var reveal = function () {
            if (settled) return
            settled = true
            globalThis.clearTimeout(advance)
            armStallWatch(video, clip)
```

</details>

**依据 8 · 源码核查**：[src/boot-screen.js:1363-1386](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/boot-screen.js#L1363-L1386)

ended和未知时长fallback。

<details>
<summary>查看原文（24行）</summary>

```text
            maybeEnter()
          }, { once: true })

          // ...but a clip whose length is unknown never reports an end at all.
          // `duration` is Infinity for a MediaRecorder WebM, and `ended` on such
          // an element may never fire, so an unbounded wait would hold the screen
          // indefinitely. This is the only fallback for that case, and it is
          // armed only when the duration is genuinely unknowable.
          video.addEventListener('loadedmetadata', function () {
            if (Number.isFinite(video.duration)) return
            namespace.unknownLength = true
            endless = globalThis.setTimeout(function () {
              clipDone = true
              maybeEnter()
            }, ENDLESS_MS)
          }, { once: true })
          // The heartbeat the stall watchdog reads. Deliberately NOT bumped by
          // `stalled` / `waiting` below: those events are the clock stopping, and
          // treating them as progress would disarm the very thing watching for it.
          video.addEventListener('timeupdate', function () {
            lastProgress = Date.now()
          })
          video.addEventListener('playing', function () {
            lastProgress = Date.now()
```

</details>

**依据 9 · 源码核查**：[src/boot-screen.js:897-923](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/boot-screen.js#L897-L923)

默认鼠标先解音。

<details>
<summary>查看原文（27行）</summary>

```text
  function press() {
    if (entered) return
    // A clip that has already finished is never a sound-unlock target: the retry
    // path calls play(), and play() on a finished element restarts it from zero.
    // That case is reachable — the clip can end while the kernel is still
    // starting — and pressing then means "let me in", not "replay that".
    var finished = parts.video().ended === true
    // Click-to-enter skips the unlock: this press IS the entry, so there is no
    // first press spent on audio and no second press needed. With sound off the
    // condition below is already false (no audioRetry was ever armed), and this
    // flag is what makes the same shortcut explicit.
    if (!CLICK_TO_ENTER && !finished && namespace.audioBlocked !== null && typeof audioRetry === 'function') {
      // This press is the user activation the retry wants, so the clip is on its
      // way to being audible and both the reason and the button say so here. The
      // order matters: the optimistic write comes first and the retry's own
      // refusal puts the reason back, so a policy that still says no cannot end up
      // with a button claiming sound that never started.
      setAudioBlocked(null)
      audioRetry()
      if (!namespace.failed) parts.hint.textContent = HINT_SOUND
      return
    }
    enter()
  }

  /**
   * Whether a pointer event landed on the sound control.
```

</details>

**依据 10 · 源码核查**：[src/boot-screen.js:954-969](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/boot-screen.js#L954-L969)

键盘退出及15秒仅提示。

<details>
<summary>查看原文（16行）</summary>

```text
  globalThis.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter') {
      entered = true
      enter()
    }
  })

  // The hold budget covers the case the kernel never settles: without it a boot
  // that neither activates the roster nor renders a failure report would trap
  // the user on a decorative screen.
  globalThis.setTimeout(function () {
    if (parts.root.getAttribute('data-state') === 'leaving') return
    if (namespace.bootedAt !== null) return
    attention('启动较慢，点击继续')
  }, HOLD_MS)

```

</details>

**依据 11 · 源码核查**：[entry.js:610-638](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/entry.js#L610-L638)

enabled关闭不注入。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.on('webserver/index-inject', (table) => {
    const settings = currentSettings()

    // Switched off means switched off: no configuration row, no screen script, no
    // overlay, and not one request for a clip. The kernel's own boot page is what
    // shows. Injecting a disabled screen and making the script bail out would look
    // the same and leave the whole thing running; this is the only version of
    // "off" that is actually off.
    if (!settings.enabled) return

    // The row reads a plain global the script fills in, so the injection stays
    // JSON-serializable data and the script itself stays a static asset.
    table.push({
      kind: 'script',
      placement: 'head',
      text: `globalThis.__DSH_BOOT_ANIM_CFG__=${JSON.stringify({
        base: ROUTE,
        manifest: `${ROUTE}/clips.json`,
        holdMs: 15000,
        fadeMs: settings.fadeMs,
        enterMode: settings.enterMode,
        sound: settings.sound,
        clickToEnter: settings.clickToEnter,
        showHint: settings.showHint,
      })}`,
    })
    table.push({ kind: 'script', placement: 'head', text: bootScreenSource() })
  })
}
```

</details>

#### 缺口

- 未复现自动播放策略、后台、真实codec及客户端激活时机
  **影响**：只能给条件化放行链，不能保证每种启动失败都自动退出
  **进一步探讨**：在临时浏览器测试音频被拒、无帧、出帧后冻结、ready慢、click模式和全禁用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 素材服务、优化写入、设置及兼容依赖如何？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

启动需宿主webServer/index-inject、可解析schemastery与相应Web客户端契约。Config静态导入，volatile方法存在时才标字段，缺此方法降为普通schema且告警，设置卡可能隐藏；schema包无法解析则整个模块求值失败，不能靠Config fallback挽救。设置值逐字段从live引用读取，新index render才按最新配置注入，不能把保存成功等同当前覆盖层已更新。

视频从固定assets目录提供，路径通过basename/扩展名和目录包含关系处理，Range返回206/416，HEAD无实体，stream按需读取并在连接关闭销毁。no-store避免重复使用中断片段，但每次页面加载仍有本地文件/解码资源成本；它不保证网络永远传完整，也不证明播放器codec支持。视频扩展名识别不是完整媒体内容校验。

“优化”是按需POST会改磁盘，不在普通启动播放自动执行：限定素材名、同name在进程内Set防重，调用optimizeInPlace，100MB上限、检查moov/mdat、重排后长度/leadingBox自检。先产出scratch文件，再删除同名旧backup，把当前片移originals，放新片，失败尝试恢复。成功回包仅证明这些结构检查，不代表音画可解码或已保存最初历史原件；原片更换后再次优化会覆盖同名backup。中途进程崩溃与底层rename失败不等于正常catch已恢复。

Set只防同name并发，scratchDir是共享.faststart-work，完成/失败会递归清理，不能把它描述为跨片或多进程事务锁；并发不同片的干扰未复现。entry优化路由检查POST/名字，未见自身Origin/身份/trust fence，外层宿主是否保护本轮未知，只适合信任本地服务范围评估，不能凭此推断可公开暴露。

停用/总开关回原生加载页，不撤已优化媒体、originals或scratch残留。可借鉴预框架覆盖层把client handoff与设置卡隔离、失败watchdog、可控素材改写；迁移要维护index/DOM/Config与codec实际兼容，不能按README“不因升级失效”泛化未来版本。

#### 证据与依据

**依据 1 · 源码核查**：[entry.js:43-44](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/entry.js#L43-L44)

静态schema和remux导入。

```text
import { optimizeInPlace } from './src/remux.js'
import z from '@deepseek-ai/schemastery'
```

**依据 2 · 源码核查**：[entry.js:117-134](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/entry.js#L117-L134)

volatile能力降级。

<details>
<summary>查看原文（18行）</summary>

```text
 * Whether the resolved schemastery can mark a Config field live-editable.
 *
 * `.volatile()` is what makes `dsh-settings` project a field into the form the
 * settings page renders: `volatileForm()` keeps only fields with `meta.volatile`,
 * and `describe()` drops every entry whose projected form is empty. The kernel's
 * copy (3.18.4, inside the app payload) has the method. An older copy linked next
 * to this package — the 3.18.1 build that sits beside a workspace checkout — does
 * not, and calling it there would throw while this module is being evaluated,
 * taking the routes and the boot screen down with the settings card.
 *
 * So the method is probed once and the schema degrades to non-volatile when it is
 * absent. The cost is a hidden settings card; `apply` warns with the fix.
 */
const LIVE_CAPABLE = typeof z.boolean().volatile === 'function'

/** Mark one Config field live-editable, where the schema library allows it. */
function live(schema) {
  return LIVE_CAPABLE ? schema.volatile() : schema
```

</details>

**依据 3 · 源码核查**：[entry.js:193-207](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/entry.js#L193-L207)

Config与服务依赖。

<details>
<summary>查看原文（15行）</summary>

```text
export const Config = z.object({
  enabled: live(z.boolean().default(DEFAULT_SETTINGS.enabled)),
  fadeMs: live(z.number().min(300).max(5000).default(DEFAULT_SETTINGS.fadeMs)),
  enterMode: live(z.union([...ENTER_MODES]).default(DEFAULT_SETTINGS.enterMode)),
  disabledClips: live(z.array(z.string()).default([])),
  sound: live(z.boolean().default(DEFAULT_SETTINGS.sound)),
  clickToEnter: live(z.boolean().default(DEFAULT_SETTINGS.clickToEnter)),
  showHint: live(z.boolean().default(DEFAULT_SETTINGS.showHint)),
})

/** Package name the loader mounts this row as. */
export const name = 'dsh-boot-animation'

/** Services this half consumes. */
export const inject = ['webServer']
```

</details>

**依据 4 · 源码核查**：[entry.js:447-470](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/entry.js#L447-L470)

live值逐字段读取。

<details>
<summary>查看原文（24行）</summary>

```text
  function currentSettings() {
    try {
      const enabled = readField(config, 'enabled')
      const fadeMs = readField(config, 'fadeMs')
      const enterMode = readField(config, 'enterMode')
      const disabledClips = readField(config, 'disabledClips')
      const sound = readField(config, 'sound')
      const clickToEnter = readField(config, 'clickToEnter')
      const showHint = readField(config, 'showHint')
      return {
        enabled: typeof enabled === 'boolean' ? enabled : DEFAULT_SETTINGS.enabled,
        fadeMs: typeof fadeMs === 'number' ? fadeMs : DEFAULT_SETTINGS.fadeMs,
        enterMode: ENTER_MODES.includes(enterMode) ? enterMode : DEFAULT_SETTINGS.enterMode,
        disabledClips: Array.isArray(disabledClips) ? disabledClips : [],
        sound: typeof sound === 'boolean' ? sound : DEFAULT_SETTINGS.sound,
        clickToEnter: typeof clickToEnter === 'boolean' ? clickToEnter : DEFAULT_SETTINGS.clickToEnter,
        showHint: typeof showHint === 'boolean' ? showHint : DEFAULT_SETTINGS.showHint,
      }
    } catch (error) {
      ctx.logger?.warn?.('boot-animation: settings unreadable, using defaults', error)
      return DEFAULT_SETTINGS
    }
  }

```

</details>

**依据 5 · 源码核查**：[entry.js:311-397](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/entry.js#L311-L397)

Range/stream/no-store。

<details>
<summary>查看原文（87行）</summary>

```text
 * Parse one `Range` header against a known length.
 * @param header - raw header value, if present.
 * @param size - complete resource length.
 * @returns inclusive byte range, or undefined for a full response.
 */
function parseRange(header, size) {
  if (typeof header !== 'string') return undefined
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim())
  if (match === null) return undefined
  const [, rawStart, rawEnd] = match
  if (rawStart === '' && rawEnd === '') return undefined
  if (rawStart === '') {
    const length = Number(rawEnd)
    if (!Number.isFinite(length) || length <= 0) return undefined
    return { start: Math.max(size - length, 0), end: size - 1 }
  }
  const start = Number(rawStart)
  if (!Number.isFinite(start) || start >= size) return { unsatisfiable: true }
  const end = rawEnd === '' ? size - 1 : Math.min(Number(rawEnd), size - 1)
  if (!Number.isFinite(end) || end < start) return { unsatisfiable: true }
  return { start, end }
}

/**
 * Stream one clip, honouring range requests so the browser can seek and so a
 * repeated load does not re-download bytes it already holds.
 * @param absolute - resolved clip path on disk.
 * @param req - incoming request.
 * @param res - outgoing response.
 */
async function serveClip(absolute, req, res) {
  const info = await stat(absolute)
  const type = contentType(absolute)
  const range = parseRange(req.headers.range, info.size)
  if (range?.unsatisfiable === true) {
    res.writeHead(416, { 'content-range': `bytes */${String(info.size)}` })
    res.end()
    return
  }

  // Nothing about a clip response may be stored, complete or not.
  //
  // The overlay replaces the media element when it hands over or skips on, which
  // aborts the in-flight request; whatever arrived is a TRUNCATED body. Any
  // directive that lets the browser keep it — `immutable`, or `no-cache` plus an
  // ETag — turns that into a poisoned cache entry: the next normal reload decodes
  // the fragment, and a clip whose `moov` sits at the end has no index in a
  // fragment, so it paints nothing while a faststart clip still plays. An ETag is
  // no defence, because it only ever claimed the FILE had not changed, never that
  // the copy in hand was complete — and answering `If-None-Match` with 304 is
  // precisely what made the browser confident in a fragment.
  //
  // The cost is that each page load streams the chosen clip again. These are local
  // files over loopback — a few tens of milliseconds — and it buys the only
  // guarantee that matters: what the player decodes is always the whole file.
  const headers = {
    'content-type': type,
    'accept-ranges': 'bytes',
    'cache-control': 'no-store',
  }

  // Streamed from disk rather than read whole and sliced. A browser playing a
  // clip issues many overlapping range requests, and reading a 10 MB file per
  // request holds the whole clip in memory on every one of them; the original
  // implementation did exactly that. Streaming also lets the response start
  // before the file is fully read, which is what keeps playback fed while the
  // element seeks into the parts it still needs.
  const from = range === undefined ? 0 : range.start
  const to = range === undefined ? info.size - 1 : range.end
  res.writeHead(range === undefined ? 200 : 206, {
    ...headers,
    'content-length': String(to - from + 1),
    ...(range === undefined ? {} : {
      'content-range': `bytes ${String(from)}-${String(to)}/${String(info.size)}`,
    }),
  })
  if (req.method === 'HEAD') {
    res.end()
    return
  }
  const stream = createReadStream(absolute, { start: from, end: to })
  stream.on('error', () => { res.destroy() })
  res.on('close', () => { stream.destroy() })
  stream.pipe(res)
}

/**
```

</details>

**依据 6 · 源码核查**：[entry.js:550-587](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/entry.js#L550-L587)

POST优化条件、局部Set及共享目录。

<details>
<summary>查看原文（38行）</summary>

```text
  const optimising = new Set()
  ctx.effect(() => server.register({
    kind: 'prefix',
    path: `${ROUTE}/optimize`,
    handler: (req, res) => {
      void (async () => {
        if (req.method !== 'POST') {
          sendJson(res, 405, { ok: false, error: '这个地址只接受 POST。' })
          return
        }
        const requested = new URL(req.url ?? '/', 'http://localhost').searchParams.get('name') ?? ''
        // The same containment rule as `resolveClip`: a bare file name from this
        // pool, nothing that could name a path. Comparing against `basename`
        // rejects any separator the query carried in, encoded or not.
        const name = basename(requested)
        const absolute = resolve(assetDir, name)
        if (name === '' || name !== requested
          || !VIDEO_EXTENSIONS.has(extname(name).toLowerCase())
          || !absolute.startsWith(assetDir + sep)) {
          sendJson(res, 400, { ok: false, error: '素材名不合法。' })
          return
        }
        if (optimising.has(name)) {
          sendJson(res, 409, { ok: false, error: '这一条正在处理，稍等一下再点。' })
          return
        }
        optimising.add(name)
        try {
          const result = await optimizeInPlace({
            file: absolute,
            backupDir: join(assetDir, 'originals'),
            scratchDir: join(assetDir, '.faststart-work'),
          })
          sendJson(res, 200, result)
        } finally {
          optimising.delete(name)
        }
      })().catch((error) => {
```

</details>

**依据 7 · 源码核查**：[src/remux.js:306-367](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/remux.js#L306-L367)

原地优化、自检、backup替换及catch恢复。

<details>
<summary>查看原文（62行）</summary>

```text
export async function optimizeInPlace(options) {
  const file = options.file
  const name = basename(file)
  const backupDir = options.backupDir
  const scratchDir = options.scratchDir
  const max = options.maxBytes ?? MAX_OPTIMIZE_BYTES
  const info = statSync(file)

  if (info.size > max) {
    throw refusal('E_TOO_BIG',
      `${name} 有 ${(info.size / 1024 / 1024).toFixed(1)}MB，超过 ${String(Math.round(max / 1024 / 1024))}MB 上限，不处理。`)
  }

  const leading = await leadingBox(file)
  if (leading === true) return { ok: true, status: 'already', name }
  if (leading !== false) {
    throw refusal('E_UNSUPPORTED', `${name} 的文件头里读不到 moov/mdat（可能不是 mp4），不敢动。`)
  }

  const sizeBefore = info.size
  const backup = join(backupDir, name)
  const produced = join(scratchDir, `${basename(name, extname(name))}.faststart.mp4`)
  let staged = false

  try {
    mkdirSync(scratchDir, { recursive: true })
    remux(file, scratchDir, true)
    if (!existsSync(produced)) throw new Error('重排没有产出文件')
    if (statSync(produced).size !== sizeBefore) throw new Error('重排后的长度变了')
    if (await leadingBox(produced) !== true) throw new Error('重排后的文件里 moov 仍在 mdat 之后')

    mkdirSync(backupDir, { recursive: true })
    if (existsSync(backup)) rmSync(backup, { force: true })
    renameSync(file, backup)
    staged = true
  } catch (error) {
    rmSync(scratchDir, { recursive: true, force: true })
    if (staged) {
      // The original is in originals/ and the pool path is empty: put it back.
      if (!existsSync(file) && existsSync(backup)) renameSync(backup, file)
      throw refusal('E_FAILED', `重排失败，原片已留在原地：${error.message}`)
    }
    if (typeof error.code === 'string' && error.code.startsWith('E_')) throw error
    throw refusal('E_FAILED', `重排失败，原片没动：${error.message}`)
  }

  // From here the original lives in originals/ and MUST end up valid somewhere:
  // either the rewritten file passes its self-check, or the original comes back.
  try {
    renameSync(produced, file)
    if (await leadingBox(file) !== true) throw new Error('重排后 moov 仍在 mdat 之后')
    if (statSync(file).size !== sizeBefore) throw new Error('重排后长度变了')
  } catch (error) {
    rmSync(file, { force: true })
    renameSync(backup, file)
    rmSync(scratchDir, { recursive: true, force: true })
    throw refusal('E_FAILED', `重排自检没过，已还原原片：${error.message}`)
  }

  rmSync(scratchDir, { recursive: true, force: true })
  return { ok: true, status: 'done', name, bytes: sizeBefore, backup: basename(backupDir) + '/' + name }
}
```

</details>

#### 缺口

- 宿主外层认证、并发不同片/断电恢复与播放器兼容未验证
  **影响**：不能承诺公开写路由安全或绝对无损/崩溃恢复
  **进一步探讨**：仅本地可丢弃片验证备份/回读/并发；先核宿主路由防护再考虑更广部署。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 总成本、采用建议与可检验方向？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

明确喜欢启动短片的本地Web用户可以有限试用，先用随包非私人素材、sound=false与clickToEnter=true，使一击退出含义明确；验证ready慢、播放失败和键盘退出，再决定是否保留。它改变等待体验，不是完成更多业务任务的证据，优化写入应另用可丢弃备份样本评估。

#### 启动与依赖

| 条件 | 是否必需 | 用途 | 缺失后果 |
|---|---|---|---|
| 兼容DSH Web/index与client契约 | 启动必需 | head覆盖层与ready | 宿主变更可能失去进度/交接 |
| 可解析schema及volatile支持 | 配置/卡片前提 | 声明live字段 | 无包模块失败；无方法卡片可能隐藏 |
| 可播媒体/浏览器解码 | 动画必需 | 首帧与音画 | 扩展名/结构通过不保可播 |
| 素材目录写权限和额外磁盘 | 优化可选 | scratch/backup/替换 | 普通播放不应自动改片 |

#### 步骤

| 阶段 | 动作 | 判据 |
|---|---|---|
| 准备 | 记录原入口，使用本地非私人片 | 可关enabled回原生 |
| 小样 | sound=false/clickToEnter=true刷新 | 键盘与一次点击可进入 |
| 失败验收 | ready慢/坏片/无帧/冻结 | 不因装饰无限等待，提示含义准确 |
| 配置 | 改总开关后刷新 | 新启动页无两行覆盖层注入/其素材请求（展开设置卡探测另算） |
| 可选优化 | 可丢弃片先备份再点 | 比结构/真实音画和原件，不盲重试 |

#### 成本

| 阶段 | 现金/资源 | 人工与时间 | 边界 |
|---|---|---|---|
| 首次 | 包/本地媒体无必需账号，资源量未知 | 验证schema、设置、解码 | 不等于所有浏览器可播 |
| 每次启动 | 解码/GPU/音频及no-store传输未知 | 看短片或跳过的等待 | 不证明原生启动更快 |
| 升级 | 宿主注入/DOM/Config兼容未知 | 回归卡片与交接 | 作者自检不作本轮实测 |
| 恢复退出 | backup/scratch和替换媒体空间未知 | 关总开关刷新、恢复原片 | stop不撤优化写入 |

#### 效果

| 效果 | 源码支持 | 未验证 |
|---|---|---|
| 启动视觉 | 预框架脚本+短片/淡入 | 用户舒适与真实性能 |
| 放行 | 手动键/点击与watchdog | 15秒只是提示，非全自动释放 |
| 可诊断 | 无帧/卡顿/错误提示 | 当前宿主全错误/语言识别 |
| faststart | 结构重排及自检/backup | codec音画质量与崩溃恢复 |

若按键无效、手势含义混乱、界面未就绪却误以为成功或媒体写入状态不清，先停用刷新回原生页；不要重复优化，先核当前/backup实际内容。

未验证方向是把装饰退出、client激活、应用可操作三种状态和原因独立记录/显示。当前ready来自本插件apply、stall直接enter、15秒仅提示，混称“启动成功”易误读。用正常/客户端迟到/宿主失败/卡顿样本比较用户误判可用率和进入耗时；若仅原生加载页加清晰状态已满足，止于提示改进，不再叠装饰插件，也不把假设记现有收益。

#### 证据与依据

**依据 1 · 源码核查**：[entry.js:610-638](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/entry.js#L610-L638)

真实总开关注入语义。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.on('webserver/index-inject', (table) => {
    const settings = currentSettings()

    // Switched off means switched off: no configuration row, no screen script, no
    // overlay, and not one request for a clip. The kernel's own boot page is what
    // shows. Injecting a disabled screen and making the script bail out would look
    // the same and leave the whole thing running; this is the only version of
    // "off" that is actually off.
    if (!settings.enabled) return

    // The row reads a plain global the script fills in, so the injection stays
    // JSON-serializable data and the script itself stays a static asset.
    table.push({
      kind: 'script',
      placement: 'head',
      text: `globalThis.__DSH_BOOT_ANIM_CFG__=${JSON.stringify({
        base: ROUTE,
        manifest: `${ROUTE}/clips.json`,
        holdMs: 15000,
        fadeMs: settings.fadeMs,
        enterMode: settings.enterMode,
        sound: settings.sound,
        clickToEnter: settings.clickToEnter,
        showHint: settings.showHint,
      })}`,
    })
    table.push({ kind: 'script', placement: 'head', text: bootScreenSource() })
  })
}
```

</details>

**依据 2 · 源码核查**：[src/boot-screen.js:897-969](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/boot-screen.js#L897-L969)

鼠标/按键及提示。

<details>
<summary>查看原文（73行）</summary>

```text
  function press() {
    if (entered) return
    // A clip that has already finished is never a sound-unlock target: the retry
    // path calls play(), and play() on a finished element restarts it from zero.
    // That case is reachable — the clip can end while the kernel is still
    // starting — and pressing then means "let me in", not "replay that".
    var finished = parts.video().ended === true
    // Click-to-enter skips the unlock: this press IS the entry, so there is no
    // first press spent on audio and no second press needed. With sound off the
    // condition below is already false (no audioRetry was ever armed), and this
    // flag is what makes the same shortcut explicit.
    if (!CLICK_TO_ENTER && !finished && namespace.audioBlocked !== null && typeof audioRetry === 'function') {
      // This press is the user activation the retry wants, so the clip is on its
      // way to being audible and both the reason and the button say so here. The
      // order matters: the optimistic write comes first and the retry's own
      // refusal puts the reason back, so a policy that still says no cannot end up
      // with a button claiming sound that never started.
      setAudioBlocked(null)
      audioRetry()
      if (!namespace.failed) parts.hint.textContent = HINT_SOUND
      return
    }
    enter()
  }

  /**
   * Whether a pointer event landed on the sound control.
   *
   * The overlay listens on pointerdown in the capture phase, which runs before
   * the button's own handlers and before any click, so a button that only stopped
   * propagation on click was never reached — pressing it entered the screen. The
   * check has to be on the event target instead of on propagation order.
   * @param event - the pointer event.
   * @returns true when the press belongs to the sound control.
   */
  function onSoundControl(event) {
    var node = event && event.target
    return !!(node && node.closest && node.closest('.dshba-sound'))
  }

  /**
   * Wire one overlay root to the enter gesture.
   *
   * A function rather than a bare statement because a PREVIEW rebuilds the overlay
   * — the hint line and the sound button are decided at build time from the
   * settings, so a preview of a differently-configured screen needs a fresh DOM —
   * and a rebuilt root would otherwise have no pointer handler at all.
   * @param root - the overlay root to listen on.
   */
  function wireRoot(root) {
    root.addEventListener('pointerdown', function (event) {
      if (onSoundControl(event)) return
      press()
    }, true)
  }

  wireRoot(parts.root)
  globalThis.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter') {
      entered = true
      enter()
    }
  })

  // The hold budget covers the case the kernel never settles: without it a boot
  // that neither activates the roster nor renders a failure report would trap
  // the user on a decorative screen.
  globalThis.setTimeout(function () {
    if (parts.root.getAttribute('data-state') === 'leaving') return
    if (namespace.bootedAt !== null) return
    attention('启动较慢，点击继续')
  }, HOLD_MS)

```

</details>

**依据 3 · 源码核查**：[src/client.js:860-879](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/client.js#L860-L879)

client激活交接。

<details>
<summary>查看原文（20行）</summary>

```text

/**
 * Report activation, then contribute the settings card if the shell is willing.
 * @param ctx - Client plugin context.
 */
exports.apply = function apply(ctx) {
  // 1. Priority one, and it must not be able to fail for any other reason.
  try {
    const overlay = globalThis[OVERLAY]
    // A missing overlay means the Host half contributed nothing (for example a
    // static deployment whose boot payload carries no injection), in which case
    // the kernel boot page is the only screen and there is nothing to hand over.
    if (overlay !== undefined && typeof overlay.clientReady === 'function') {
      overlay.clientReady()
    }
  } catch (error) {
    // Never break the client roster over a decorative overlay.
    console.warn('boot-animation: client half failed', error)
  }

```

</details>

**依据 4 · 源码核查**：[src/boot-screen.js:1264-1277](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/boot-screen.js#L1264-L1277)

stall直接放行。

<details>
<summary>查看原文（14行）</summary>

```text
        // clip that is merely buffering must not take that decision away.
        var armStallWatch = function (video, clip) {
          stopStallWatch()
          if (ENTER_MODE === 'click') return
          lastProgress = Date.now()
          stallWatch = globalThis.setInterval(function () {
            if (clipDone || video.ended) { stopStallWatch(); return }
            if (Date.now() - lastProgress < STALL_LIMIT_MS) return
            stopStallWatch()
            noteFailure(clip, 'stalled')
            enter()
          }, 1000)
        }

```

</details>

**依据 5 · 源码核查**：[src/remux.js:306-367](https://github.com/lxj5820/dsh-boot-animation/blob/14e40fe921b671f29f7344e5948172fc7c1d9e55/src/remux.js#L306-L367)

优化写入及备份边界。

<details>
<summary>查看原文（62行）</summary>

```text
export async function optimizeInPlace(options) {
  const file = options.file
  const name = basename(file)
  const backupDir = options.backupDir
  const scratchDir = options.scratchDir
  const max = options.maxBytes ?? MAX_OPTIMIZE_BYTES
  const info = statSync(file)

  if (info.size > max) {
    throw refusal('E_TOO_BIG',
      `${name} 有 ${(info.size / 1024 / 1024).toFixed(1)}MB，超过 ${String(Math.round(max / 1024 / 1024))}MB 上限，不处理。`)
  }

  const leading = await leadingBox(file)
  if (leading === true) return { ok: true, status: 'already', name }
  if (leading !== false) {
    throw refusal('E_UNSUPPORTED', `${name} 的文件头里读不到 moov/mdat（可能不是 mp4），不敢动。`)
  }

  const sizeBefore = info.size
  const backup = join(backupDir, name)
  const produced = join(scratchDir, `${basename(name, extname(name))}.faststart.mp4`)
  let staged = false

  try {
    mkdirSync(scratchDir, { recursive: true })
    remux(file, scratchDir, true)
    if (!existsSync(produced)) throw new Error('重排没有产出文件')
    if (statSync(produced).size !== sizeBefore) throw new Error('重排后的长度变了')
    if (await leadingBox(produced) !== true) throw new Error('重排后的文件里 moov 仍在 mdat 之后')

    mkdirSync(backupDir, { recursive: true })
    if (existsSync(backup)) rmSync(backup, { force: true })
    renameSync(file, backup)
    staged = true
  } catch (error) {
    rmSync(scratchDir, { recursive: true, force: true })
    if (staged) {
      // The original is in originals/ and the pool path is empty: put it back.
      if (!existsSync(file) && existsSync(backup)) renameSync(backup, file)
      throw refusal('E_FAILED', `重排失败，原片已留在原地：${error.message}`)
    }
    if (typeof error.code === 'string' && error.code.startsWith('E_')) throw error
    throw refusal('E_FAILED', `重排失败，原片没动：${error.message}`)
  }

  // From here the original lives in originals/ and MUST end up valid somewhere:
  // either the rewritten file passes its self-check, or the original comes back.
  try {
    renameSync(produced, file)
    if (await leadingBox(file) !== true) throw new Error('重排后 moov 仍在 mdat 之后')
    if (statSync(file).size !== sizeBefore) throw new Error('重排后长度变了')
  } catch (error) {
    rmSync(file, { force: true })
    renameSync(backup, file)
    rmSync(scratchDir, { recursive: true, force: true })
    throw refusal('E_FAILED', `重排自检没过，已还原原片：${error.message}`)
  }

  rmSync(scratchDir, { recursive: true, force: true })
  return { ok: true, status: 'done', name, bytes: sizeBefore, backup: basename(backupDir) + '/' + name }
}
```

</details>

#### 缺口

- 真实浏览器放行/声音/视觉性能和状态分层方案均未执行
  **影响**：只推荐受控装饰试用，未来收益不计
  **进一步探讨**：固定宿主与片源记录键盘/手势放行、可操作时刻和恢复结果。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
