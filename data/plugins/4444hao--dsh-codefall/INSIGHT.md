# dsh-codefall

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[68159fc](https://github.com/4444Hao/dsh-codefall/tree/68159fcced1d65c7ea356821859ea80d365c523a)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/4444Hao/dsh-codefall) [![npm 30d 407](https://img.shields.io/static/v1?label=npm+30d&message=407&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-codefall) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-codefall)
<!-- END META -->

> **实现功能**：DSH Web/桌面首帧数字雨与绿色主题插件，支持光门、画质和播放时机设置。

> **核心亮点**：将视觉动画嵌进 DSH 首帧并避免重复注入，提供设置与主题映射。详见[Q02](#research-q02)。

> **风险与缺陷**：恢复重播/跨平台实机未验，主题只覆盖宿主 token；loopback 诊断路由返回本机路径，外层代理访问边界待核。详见[Q03](#research-q03)。

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
  - [Q01 · 开屏动画与绿色主题给用户什么，何时会阻断进入？](#detail-section-11)
  - [Q02 · 怎样在首帧注入且避免双重动画？](#detail-section-12)
  - [Q03 · 主题覆盖、窗口恢复和设置接口有哪些边界？](#detail-section-13)
  - [Q04 · 安装与视觉渲染成本如何控制？](#detail-section-14)
  - [Q05 · 怎样验证这种视觉插件不损害基本可用性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户个性化开屏与主题，仍需快速可靠地进入可交互界面。

宿主默认开屏与主题或手工 CSS；本包提供设置化动画和颜色映射。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 首帧注入 | 开屏显示 | 需宿主接口 |
| Canvas 转场 | 视觉个性化 | 设备性能/交互 |
| 主题 | 色相可调 | 第三方组件覆盖有限 |
| 设置/诊断 | 调参与排查 | loopback/反代边界 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| DSH Web 注入和 Client slots | 开屏/设置 | 功能缺失 |
| Canvas2D/RAF | 绘制 | 失败退场 |
| 宿主主题 token/桌面事件 | 主题/重播 | 部分覆盖或不重播 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装 | 非关键 profile 重启 | 首帧可见 |
| 验收 | 交互、迟到、减少动态、恢复 | 不阻断界面 |
| 调整 | 画质/关闭/卸载 | 性能可接受 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 安装 | Web/桌面 profile 与重启 | 平台兼容 |
| 首帧 | 内联脚本与 Canvas | 可交互延迟/功耗 |
| 维护 | 主题 token/窗口事件 | 新版 UI 覆盖 |

| 结果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 动画 | Canvas、watchdog、退出 | 各设备流畅 |
| 主题 | token 映射 | 第三方 UI 覆盖 |
| 重播 | 可见性事件 | 真实托盘/跨平台 |

> **思考**：恢复重播/跨平台实机未验，主题只覆盖宿主 token；loopback 诊断路由返回本机路径，外层代理访问边界待核。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将视觉动画嵌进 DSH 首帧并避免重复注入，提供设置与主题映射。详见[Q02](#research-q02)。

将视觉动画嵌进 DSH 首帧并避免重复注入，提供设置与主题映射。详见[Q02](#research-q02)。

Host 双注入机制以 sentinel 去重并热读脚本；设置只归一化白名单字段，但 loopback 地址判断受反代拓扑影响，diag 返回绝对路径。

<a id="detail-section-5"></a>

### 1.4 主要限制

恢复重播/跨平台实机未验，主题只覆盖宿主 token；loopback 诊断路由返回本机路径，外层代理访问边界待核。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

非关键 profile 先试，实机核启动/窗口恢复/减少动态/卸载；卡顿时先关闭动画。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持动画/主题机制；真实窗口恢复与部分平台未验，路由诊断暴露需核外层访问。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/boot.js、lib/renderer.js、lib/client.js、docs/PORTAL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交 README、包、Host、boot、Client/渲染结构；未运行应用或视觉实测。
- 下一步：跨 Windows/macOS/Linux 桌面与 Web，测启动可交互时间、帧率/功耗、减少动态、反代访问诊断和卸载恢复。

**分析版本**

- **仓库**：[4444Hao/dsh-codefall](https://github.com/4444Hao/dsh-codefall)
- **版本号**：0.2.0（[固定提交 68159fc](https://github.com/4444Hao/dsh-codefall/tree/68159fcced1d65c7ea356821859ea80d365c523a)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

增加首帧进出时延预算、可用性验收与按权限裁剪诊断，可提高视觉定制的可靠性；尚未实现。详见[Q05](#research-q05)。

跨 Windows/macOS/Linux 桌面与 Web，测启动可交互时间、帧率/功耗、减少动态、反代访问诊断和卸载恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1002 | — | — | 17242 |
| .js | source | 4 | 3329 | 2492 | 686 | — |
| .mjs | source | 14 | 3144 | 2457 | 501 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/4444Hao/dsh-codefall/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/4444Hao/dsh-codefall/issues?q=is%3Aissue+created%3A2026-09-22T05%3A50%3A44.301Z..2026-10-22T05%3A50%3A44.301Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/4444Hao/dsh-codefall/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A50%3A44.301Z..2026-10-22T05%3A50%3A44.301Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：分离数字雨视觉价值、首帧注入机制与真实桌面可用性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 开屏动画与绿色主题给用户什么，何时会阻断进入？

**研究主题**：场景与需求

#### 完整回答

插件在 DSH Web/桌面启动首帧显示 Canvas 数字雨和光门转场，另提供绿色主题；价值是个性化视觉，而非生产能力。默认等宿主就绪并有用户交互才退出；宿主未就绪有约 15 秒 watchdog，用户若没交互可继续停留，属预期体验但会延迟进入。合格结果是不卡住界面、符合减少动态效果、设置可恢复且覆盖范围明确。基线是原生开屏/主题或静态 CSS。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-28](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/README.md#L20-L28)

作者功能与范围。

```text
## 使用效果

- **数字雨开屏**：默认无标题、无提示文字，启动时进入绿色字符瀑布。
- **矩阵光门**：界面就绪并收到进入交互后，中央细长矩形光门向左右展开，逐渐露出 Harness 界面；也可选择淡出。
- **按需重播**：可选择仅应用启动时播放，或桌面窗口从后台、最小化状态恢复时重播。Web 标签切换不重播。
- **绿色主题**：将界面的蓝色强调色映射到绿色，支持雨绿、经典、青碧预设与色相调节；主题可单独关闭。
- **画面调节**：雨密度、雨速、画质与明暗模式均可设置。浅色模式呈现白底深绿的“墨迹雨”。

动画使用 Canvas2D 绘制，无需加载视频或在线动画素材；退出后清理雨场和动画帧。系统开启“减少动态效果”时，光门改用淡出。
```

**依据 2 · 作者声明**：[README.md:79-91](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/README.md#L79-L91)

默认交互/动画设置。

<details>
<summary>查看原文（13行）</summary>

```text
| 设置 | 可选项 | 默认值 |
| --- | --- | --- |
| 播放时机 | 仅应用启动时 / 每次打开窗口 | 仅应用启动时 |
| 结束方式 | 交互后结束 / 3 秒后自动继续 | 交互后结束 |
| 退出转场 | 矩阵光门 / 淡出 | 矩阵光门 |
| 雨密度 | 滑块调节 | 85% |
| 雨速 | 滑块调节 | ×1.00 |
| 画质 | 高 / 标准 / 省电 | 标准 |
| 明暗 | 跟随 / 深色 / 浅色 | 跟随 |
| 绿色主题 | 开 / 关 | 开 |
| 绿色色调 | 滑块调节；雨绿 / 经典 / 青碧 | 雨绿 145° |

播放时机与转场保存后用于后续播放，调整后无需再次重启；绿色主题与色相立即生效。“3 秒后自动继续”仍需等待宿主界面就绪。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:65-127](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/lib/index.js#L65-L127)

默认值。

<details>
<summary>查看原文（63行）</summary>

```text
/** Everything the boot needs, with the deployment defaults. */
const DEFAULTS = {
  animation: true,
  playback: 'startup', // 'startup' | 'every-open'; preserve existing playback on upgrade
  transition: 'portal', // 'portal' | 'fade'
  theme: true,
  appearance: 'auto', // 'auto' follows the host's resolved theme
  quality: 'standard', // 'high' | 'standard' | 'economy'
  density: 0.85,
  ghostShare: 0.15,
  speed: 1,
  fontSize: 18,
  columnSpacing: 1.35,
  glyphs: 'code', // 'code' | 'katakana' | 'mixed'
  charset: '',
  /**
   * Empty by default: the product is PURE digital rain — no title, no status
   * line, no hint. Both stay configurable: set `titleText` for the converging
   * title treatment, or `hintReady` for an affordance line.
   */
  titleText: '',
  titleScale: 3.3,
  /**
   * Dismissal policy.
   *   'interaction' — the rain stays until the user moves the pointer, clicks,
   *                   scrolls or presses a key (a boot screen you acknowledge).
   *   'ready'       — the rain leaves once the host is ready and the display
   *                   floor has passed. `'ready'` + `minDisplayMs: 3000` is
   *                   exactly the "3 秒" choice.
   */
  dismiss: 'interaction',
  /** Floor on the visible time. */
  minDisplayMs: 900,
  /** Optional status line once the host is ready — empty, so only rain shows. */
  hintReady: '',
  /** Optional status line for an early interaction — empty by default. */
  hintWaitingAcknowledged: '',
  /** Idle power tiers: slow the rain past this age, then stop drawing at all. */
  idleSlowMs: 20000,
  idleStaticMs: 60000,
  /** Fires only when the host never reports ready — never a display cap. */
  timeoutMs: 15000,
  readyElementThreshold: 80,
  /**
   * Windows desktop only: hide the caption glyphs (minimize / maximize / close)
   * while the boot overlay is up. They are Chromium's title-bar overlay, drawn
   * ABOVE the page, so this works by painting them in the caption fill color —
   * invisible but still clickable. See the caption notes in lib/boot.js.
   */
  hideWindowControls: true,
  /**
   * Green theme: replace the blue brand ramps with green at this hue. The
   * browser half remaps the shipped source colours at runtime, so changing this
   * takes effect immediately rather than at the next launch.
   */
  greenHue: 145,
  /**
   * Page-side self-check. Off by default; when on, the injected script POSTs a
   * small report back to this plugin's own route on the first painted frame and
   * again at hand-off. It is the only way to observe real-browser execution from
   * the host side, and it costs one loopback request.
   */
  beacon: false
```

</details>

**依据 4 · 源码核查**：[lib/boot.js:135-149](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/lib/boot.js#L135-L149)

宿主就绪与交互状态。

<details>
<summary>查看原文（15行）</summary>

```text
    // Dismissal state. `dismiss: 'interaction'` keeps the rain up until the user
    // does something, which is the whole point of a boot screen — but it must
    // never become a trap, hence hostReady/interacted and the grace timer below.
    // NOTE: readiness is a BOOLEAN, not the timestamp: `now()` is 0 at t=0, so
    // testing the timestamp for truthiness silently misreads a ready-at-zero host.
    var hostReady = false
    var interacted = false
    var readyAt = 0
    var interactedAt = 0
    var moveAccum = 0
    var lastX = null
    var lastY = null
    var minTimer = 0
    var graceTimer = 0
    var idleStopped = false
```

</details>

#### 缺口

- 未在真实桌面/移动端体验。
  **影响**：可用性和负担未知。
  **进一步探讨**：实机观察启动、休眠恢复、键盘与减少动态设置。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎样在首帧注入且避免双重动画？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host 既监听 webserver/index-inject 结构化脚本行，又注册 tapIndex 原始 HTML 转换作后备，脚本含 sentinel 以防两路叠加；每次请求从 mtime 缓存读取 renderer/boot 并内联约数十 KB。boot.js 创建 Canvas overlay、宿主就绪/交互、转场、watchdog 和清理；Client 负责主题变量映射与设置 UI。增量是对 DSH 首帧注入和主题 token 的适配，数字雨渲染是常见视觉模式。README 中 GIF/截图仅展示作者准备的预览，不是独立实机验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:316-380](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/lib/index.js#L316-L380)

结构化和 tapIndex 双机制。

<details>
<summary>查看原文（65行）</summary>

```text
  /** The current boot script, or '' when the animation is off or unreadable. */
  function currentScript() {
    try {
      const options = readSettings(cache)
      if (!options.animation) return ''
      return buildScript(options, cache)
    } catch (error) {
      diag.lastError = String((error && error.message) || error)
      return ''
    }
  }

  // Mechanism 1 — the structured injection table. Registered on the plugin's own
  // context (the event needs no service) and APPENDED, not prepended: see the
  // module header. `ctx.on(name, listener, options?)` takes an options object;
  // it has no label parameter.
  ctx.on(
    'webserver/index-inject',
    (table) => {
      const script = currentScript()
      if (!script || !table || typeof table.push !== 'function') return
      table.push({ kind: 'script', placement: 'body', text: script })
      diag.structuredRows++
      diag.lastInjectAt = new Date().toISOString()
      diag.lastScriptBytes = script.length
    },
    { prepend: false }
  )

  ctx.inject(['webServer'], (http) => {
    // Mechanism 2 — the raw index transform, kept as a fallback for a build
    // where the structured table is not rendered. The sentinel makes it a no-op
    // whenever mechanism 1 already carried the response.
    http.effect(
      () =>
        http.webServer.tapIndex((html) => {
          try {
            if (typeof html === 'string' && html.indexOf(SENTINEL) !== -1) {
              diag.tapSkipped++
              return html
            }
            const script = currentScript()
            if (!script) return html
            diag.tapRenders++
            diag.lastInjectAt = new Date().toISOString()
            diag.lastScriptBytes = script.length
            return injectIntoHtml(html, script)
          } catch (error) {
            diag.lastError = String((error && error.message) || error)
            return html
          }
        }),
      'dsh-codefall: first-frame boot (tap fallback)'
    )

    http.effect(
      () =>
        http.webServer.register({
          kind: 'exact',
          path: API_PATH,
          handler: createSettingsHandler(cache)
        }),
      'dsh-codefall: settings route'
    )
  })
```

</details>

**依据 2 · 源码核查**：[lib/boot.js:105-206](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/lib/boot.js#L105-L206)

overlay 和 Canvas 初始化。

<details>
<summary>查看原文（102行）</summary>

```text
  function boot(options) {
    var o = options || {}
    var doc = root.document

    // Idempotent: a second boot (hot reload, duplicate injection) attaches to
    // the live controller instead of stacking a second overlay.
    if (root.__codefallController) return root.__codefallController
    if (!doc || !root.CodefallRenderer) return null

    var appearance = o.appearance === 'light' || o.appearance === 'dark' ? o.appearance : autoAppearance(doc, root)
    var start = now()
    var phase = 'playing' // playing -> portal/draining -> closing -> done
    var portalAt = 0
    var portalRing = null
    var reason = null
    var paused = false
    var frames = 0
    var fps = 0
    var fpsAt = start
    var raf = 0
    var lastFrame = 0
    var fadeTimer = 0
    var drainTimer = 0
    var watchdog = 0
    var resizeTimer = 0
    var observer = null
    var heuristicTimer = 0
    var beaconed = false
    var HEURISTIC_MIN_MS = 500

    // Dismissal state. `dismiss: 'interaction'` keeps the rain up until the user
    // does something, which is the whole point of a boot screen — but it must
    // never become a trap, hence hostReady/interacted and the grace timer below.
    // NOTE: readiness is a BOOLEAN, not the timestamp: `now()` is 0 at t=0, so
    // testing the timestamp for truthiness silently misreads a ready-at-zero host.
    var hostReady = false
    var interacted = false
    var readyAt = 0
    var interactedAt = 0
    var moveAccum = 0
    var lastX = null
    var lastY = null
    var minTimer = 0
    var graceTimer = 0
    var idleStopped = false

    // The overlay styles itself inline and depends on no stylesheet row: an
    // earlier version relied on a separate <style> injection, and when that was
    // dropped the overlay silently lost position:fixed (and with it its size),
    // rendering a 155px strip in normal document flow.
    var mount = o.host && o.host.nodeType === 1 ? o.host : doc.body || doc.documentElement
    var fixed = mount === doc.body || mount === doc.documentElement

    var wrap = doc.createElement('div')
    wrap.id = ID
    wrap.setAttribute('aria-hidden', 'true')
    var ws = wrap.style
    ws.position = fixed ? 'fixed' : 'absolute'
    if (fixed) {
      ws.top = '0'
      ws.right = '0'
      ws.bottom = '0'
      ws.left = '0'
      ws.zIndex = '2147483000'
    } else {
      ws.top = '0'
      ws.left = '0'
      ws.width = '100%'
      ws.height = '100%'
    }
    ws.background = bgFor(appearance)
    ws.opacity = '1'
    ws.transition = 'opacity ' + FADE_MS + 'ms linear'
    ws.touchAction = 'none'
    ws.contain = 'layout paint'
    ws.willChange = 'opacity'

    var canvas = doc.createElement('canvas')
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    wrap.appendChild(canvas)

    var renderer = root.CodefallRenderer.create(canvas, {
      appearance: appearance,
      quality: o.quality || 'standard',
      seed: o.seed || 0,
      glyphs: o.glyphs || 'code',
      charset: o.charset || '',
      density: o.density == null ? undefined : o.density,
      ghostShare: o.ghostShare == null ? undefined : o.ghostShare,
      speed: o.speed == null ? undefined : o.speed,
      fontSize: o.fontSize || undefined,
      fontFamily: o.fontFamily || undefined,
      columnSpacing: o.columnSpacing || undefined,
      titleText: o.titleText == null ? undefined : o.titleText,
      titleY: o.titleY == null ? undefined : o.titleY,
      statusText: o.statusText || ''
    })
    // Atlas/context creation can fail (for example after a GPU reset). Keep the
    // overlay detached until it succeeds so a failed restore cannot block the UI.
    mount.appendChild(wrap)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:173-197](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/lib/index.js#L173-L197)

mtime 缓存。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * mtime-keyed file cache. Keeps the per-request cost of inlining ~37 KB of
 * source at roughly one stat() per file, while still picking up an edit on the
 * very next render (which is what makes the refresh-only dev loop work).
 */
function createCache() {
  const files = new Map()
  return {
    read(file) {
      try {
        const st = statSync(file)
        const hit = files.get(file)
        if (hit && hit.mtimeMs === st.mtimeMs && hit.size === st.size) return hit.text
        const text = readFileSync(file, 'utf8')
        files.set(file, { mtimeMs: st.mtimeMs, size: st.size, text })
        return text
      } catch {
        return ''
      }
    },
    invalidate(file) {
      files.delete(file)
    }
  }
}
```

</details>

**依据 4 · 作者声明**：[README.md:14-18](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/README.md#L14-L18)

预览边界。

```text
[安装与使用](#安装与使用) · [设置](#设置) · [GitHub](https://github.com/4444Hao/dsh-codefall) · [npm](https://www.npmjs.com/package/dsh-codefall)

![数字瀑布效果预览：黑底绿色数字雨循环动图](docs/images/boot-waterfall-v2.gif)

*数字雨由插件自带渲染器生成；此动图展示雨场，不包含光门转场。*
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 主题覆盖、窗口恢复和设置接口有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

绿色主题只重映射宿主已采用的颜色 token，第三方自绘组件可能不覆盖；窗口恢复重播依赖桌面可见性事件，作者承认真实托盘/最小化恢复与 macOS/Linux 未验。设置 JSON 写到 DSH_HOME/codefall.json，POST 只按可写键归一化，响应可诊断；路由以 socket remoteAddress 是否 loopback 决定访问，若 Web 由本机反代转发外部请求，组件只能看到反代地址，外层鉴权仍需核。诊断 GET 带 diag 返回源码绝对路径、加载时间和 beacon，可能泄露宿主布局给所有能到路由的本地/代理客户端。没有形式化的视觉可用性证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:106-112](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/README.md#L106-L112)

作者跨平台/主题限制。

```text
## 兼容与说明

- 建议使用 Harness **0.2.0-rc.2 或更高版本**。安装或更新插件后，请完整退出并重启应用。
- 窗口恢复重播依赖桌面环境的可见性事件；当前实现针对 `dsh-app:` 桌面页面，其他桌面壳需单独验证。
- Windows 设置截图见上文链接。光门已通过浏览器预览及离线测试；真实托盘 / 最小化恢复仍需按[实机验收步骤](docs/PORTAL.md#实机验收)验证。macOS / Linux 尚未实机验证，macOS 完全遮挡窗口也可能产生可见性事件。
- 不同宿主版本及第三方插件可能使用自己的配色；绿色主题的覆盖范围取决于它们是否采用宿主主题变量。
- 在应用的插件管理中停用或卸载即可移除主题层。CLI 管理环境可运行 `dsh plugin --profile web remove dsh-codefall`，profile 按实际环境调整。
```

**依据 2 · 源码核查**：[lib/index.js:205-223](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/lib/index.js#L205-L223)

可写键归一化。

<details>
<summary>查看原文（19行）</summary>

```text
/** Whitelist, coerce and clamp an untrusted settings object. */
export function normalize(input) {
  const src = input && typeof input === 'object' ? input : {}
  const out = {}
  for (const key of WRITABLE) {
    const raw = src[key]
    const fallback = DEFAULTS[key]
    if (typeof fallback === 'boolean') {
      out[key] = typeof raw === 'boolean' ? raw : fallback
    } else if (typeof fallback === 'number') {
      out[key] = raw === undefined ? fallback : clampNumber(raw, fallback, RANGE[key] || [0, 1])
    } else if (ENUM[key]) {
      out[key] = ENUM[key].includes(raw) ? raw : fallback
    } else {
      out[key] = typeof raw === 'string' ? raw.slice(0, 400) : fallback
    }
  }
  return out
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:386-475](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/lib/index.js#L386-L475)

loopback、诊断及 POST 设置。

<details>
<summary>查看原文（90行）</summary>

```text
function isLoopback(address) {
  if (!address) return true // no socket info: the server itself is loopback-bound
  return (
    address === '127.0.0.1' ||
    address === '::1' ||
    address === '::ffff:127.0.0.1' ||
    address.startsWith('127.')
  )
}

function createSettingsHandler(cache) {
  return async function handler(req, res) {
    const send = (code, body) => {
      const text = JSON.stringify(body)
      res.writeHead(code, {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'content-length': Buffer.byteLength(text)
      })
      res.end(text)
    }

    const remote = req.socket && req.socket.remoteAddress
    if (!isLoopback(remote)) return send(403, { ok: false, error: 'loopback-only' })

    // Self-report: which injection mechanism is actually carrying the page.
    try {
      const url = new URL(req.url || '/', 'http://codefall.local')
      if (url.searchParams.has('diag')) {
        return send(200, {
          ok: true,
          diag,
          files: { renderer: RENDERER_FILE, boot: BOOT_FILE, bootReadable: !!cache.read(BOOT_FILE) }
        })
      }
    } catch {
      /* a malformed URL is not worth failing over */
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      return send(200, { ok: true, value: readSettings(cache), defaults: DEFAULTS })
    }
    if (req.method !== 'POST') return send(405, { ok: false, error: 'method-not-allowed' })

    const contentType = String(req.headers['content-type'] || '')
    if (!contentType.includes('application/json')) return send(415, { ok: false, error: 'json-required' })

    let raw = ''
    try {
      for await (const chunk of req) {
        raw += chunk
        if (raw.length > MAX_BODY_BYTES) {
          send(413, { ok: false, error: 'payload-too-large' })
          req.destroy()
          return
        }
      }
    } catch {
      return send(400, { ok: false, error: 'unreadable-body' })
    }

    let patch
    try {
      patch = JSON.parse(raw || '{}')
    } catch {
      return send(400, { ok: false, error: 'bad-json' })
    }

    // `{patch:{...}}` mirrors the shape other DSH plugins use; a bare object
    // is accepted too so the route is easy to poke by hand.
    const delta = patch && typeof patch === 'object' && patch.patch ? patch.patch : patch

    // Page-side self-check reports are recorded, never persisted.
    if (patch && typeof patch === 'object' && patch.beacon && typeof patch.beacon === 'object') {
      const report = { ...patch.beacon, receivedAt: new Date().toISOString() }
      diag.beacons.push(report)
      if (diag.beacons.length > 20) diag.beacons.shift()
      return send(200, { ok: true, diag: { beacons: diag.beacons.length } })
    }

    const next = normalize({ ...readSettings(cache), ...(delta && typeof delta === 'object' ? delta : {}) })

    try {
      writeSettings(next)
      cache.invalidate(settingsFile())
    } catch {
      return send(500, { ok: false, error: 'write-failed' })
    }
    return send(200, { ok: true, value: next })
  }
```

</details>

**依据 4 · 源码核查**：[lib/boot.js:1127-1187](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/lib/boot.js#L1127-L1187)

可见性恢复监听。

<details>
<summary>查看原文（61行）</summary>

```text
  /** One lightweight visibility listener survives each individual animation. */
  function install(options) {
    if (root.__codefallSession) {
      root.__codefallSession.configure(options)
      return root.__codefallSession
    }
    var doc = root.document
    if (!doc || !doc.addEventListener) return null
    var latest = Object.assign({}, options || {})
    var appReady = false
    var disposed = false
    var wasHidden = !!doc.hidden
    // Do not mistake browser-tab switching for opening the desktop window.
    // Electron hide/minimize publishes visibilitychange on Windows/Linux.
    var desktop = !!(root.location && root.location.protocol === 'dsh-app:')

    function configure(next) {
      if (disposed || !next) return
      latest = Object.assign({}, latest, next)
      var ctl = root.__codefallController
      if (ctl && ctl.configure) ctl.configure(next)
    }
    function onVisibility() {
      if (disposed) return
      if (doc.hidden) {
        wasHidden = true
        // Discard a hidden splash so restore starts a fresh scene and input guard.
        if (desktop && latest.playback === 'every-open' && root.__codefallController) {
          root.__codefallController.destroy()
        }
        return
      }
      if (!wasHidden) return
      wasHidden = false
      if (!desktop || !appReady || latest.animation === false || latest.playback !== 'every-open') return
      if (root.__codefallController) return
      var ctl
      try {
        ctl = boot(Object.assign({}, latest, { readyHeuristic: false }))
        if (ctl) ctl.ready() // the existing UI is already mounted
      } catch (error) {
        if (root.__codefallController) root.__codefallController.destroy()
      }
    }
    var session = {
      configure: configure,
      ready: function () {
        if (disposed) return
        appReady = true
        if (root.__codefallController) root.__codefallController.ready()
      },
      destroy: function () {
        if (disposed) return
        disposed = true
        doc.removeEventListener('visibilitychange', onVisibility)
        if (root.__codefallController) root.__codefallController.destroy()
        if (root.__codefallSession === session) delete root.__codefallSession
      },
      state: function () { return { ready: appReady, desktop: desktop, playback: latest.playback || 'startup' } }
    }
    doc.addEventListener('visibilitychange', onVisibility)
```

</details>

#### 缺口

- 未核真实反代/宿主鉴权。
  **影响**：外部访问设置和诊断的可达性未知。
  **进一步探讨**：隔离反代与非本机客户端测试。
- 未测真实桌面恢复。
  **影响**：跨平台重播可靠性未知。
  **进一步探讨**：Windows/macOS/Linux 实机矩阵。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装与视觉渲染成本如何控制？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包 0.2.0 MIT、Node>=18、DSH>=0.2.0-rc.1 声明，Web client 依赖 runtime/slots/theme/settings。首次注入脚本增加首帧 HTML 体积，Canvas 每帧绘制有 GPU/CPU 开销；源码提供 high/standard/economy 画质、空闲减速/停画、关闭动画/主题和 watchdog，但本轮未测设备耗电或帧率。图片预览/离线测试不是实际应用性能数据。设置路由本机写配置、开发时 mtime 热读带来每次 index stat 成本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-80](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/package.json#L1-L80)

版本和客户端依赖。

<details>
<summary>查看原文（80行）</summary>

```text
{
  "name": "dsh-codefall",
  "version": "0.2.0",
  "description": "dsh-codefall — green digital-rain boot animation plus a green semantic theme for the DeepSeek Harness client.",
  "license": "MIT",
  "author": "4444Hao",
  "type": "module",
  "main": "lib/index.js",
  "publishConfig": {
    "registry": "https://registry.npmjs.org",
    "access": "public"
  },
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/4444Hao/dsh-codefall.git"
  },
  "homepage": "https://github.com/4444Hao/dsh-codefall#readme",
  "bugs": {
    "url": "https://github.com/4444Hao/dsh-codefall/issues"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "docs",
    "LICENSE"
  ],
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "boot",
    "startup-animation",
    "digital-rain",
    "theme"
  ],
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node tools/host-test.mjs && node tools/client-test.mjs && node tools/smoke.mjs",
    "test:fast": "node tools/host-test.mjs && node tools/client-test.mjs",
    "prepublishOnly": "node tools/host-test.mjs && node tools/client-test.mjs",
    "check": "node --check lib/renderer.js && node --check lib/boot.js && node --check lib/client.js && node --check lib/index.js",
    "frames": "node tools/render-frames.mjs",
    "docs:images": "node tools/make-docs-images.mjs",
    "docs:animation": "node tools/make-docs-animation.mjs",
    "theme": "node tools/extract-app-assets.mjs && node tools/extract-theme-css.mjs && node tools/green-map.mjs --emit"
  },
  "devDependencies": {
    "@napi-rs/canvas": "^0.1.80",
    "gifenc": "^1.0.3"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "react": "^18.2.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-theme",
        "@deepseek-ai/dsh-client-ui-settings"
      ]
    },
    "engines": {
      "dsh": ">=0.2.0-rc.1"
    }
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:97-127](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/lib/index.js#L97-L127)

空闲、超时与 beacon。

<details>
<summary>查看原文（31行）</summary>

```text
  minDisplayMs: 900,
  /** Optional status line once the host is ready — empty, so only rain shows. */
  hintReady: '',
  /** Optional status line for an early interaction — empty by default. */
  hintWaitingAcknowledged: '',
  /** Idle power tiers: slow the rain past this age, then stop drawing at all. */
  idleSlowMs: 20000,
  idleStaticMs: 60000,
  /** Fires only when the host never reports ready — never a display cap. */
  timeoutMs: 15000,
  readyElementThreshold: 80,
  /**
   * Windows desktop only: hide the caption glyphs (minimize / maximize / close)
   * while the boot overlay is up. They are Chromium's title-bar overlay, drawn
   * ABOVE the page, so this works by painting them in the caption fill color —
   * invisible but still clickable. See the caption notes in lib/boot.js.
   */
  hideWindowControls: true,
  /**
   * Green theme: replace the blue brand ramps with green at this hue. The
   * browser half remaps the shipped source colours at runtime, so changing this
   * takes effect immediately rather than at the next launch.
   */
  greenHue: 145,
  /**
   * Page-side self-check. Off by default; when on, the injected script POSTs a
   * small report back to this plugin's own route on the first painted frame and
   * again at hand-off. It is the only way to observe real-browser execution from
   * the host side, and it costs one loopback request.
   */
  beacon: false
```

</details>

**依据 3 · 源码核查**：[lib/index.js:173-197](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/lib/index.js#L173-L197)

缓存每次 stat。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * mtime-keyed file cache. Keeps the per-request cost of inlining ~37 KB of
 * source at roughly one stat() per file, while still picking up an edit on the
 * very next render (which is what makes the refresh-only dev loop work).
 */
function createCache() {
  const files = new Map()
  return {
    read(file) {
      try {
        const st = statSync(file)
        const hit = files.get(file)
        if (hit && hit.mtimeMs === st.mtimeMs && hit.size === st.size) return hit.text
        const text = readFileSync(file, 'utf8')
        files.set(file, { mtimeMs: st.mtimeMs, size: st.size, text })
        return text
      } catch {
        return ''
      }
    },
    invalidate(file) {
      files.delete(file)
    }
  }
}
```

</details>

**依据 4 · 作者声明**：[README.md:106-116](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/README.md#L106-L116)

作者验收边界。

<details>
<summary>查看原文（11行）</summary>

```text
## 兼容与说明

- 建议使用 Harness **0.2.0-rc.2 或更高版本**。安装或更新插件后，请完整退出并重启应用。
- 窗口恢复重播依赖桌面环境的可见性事件；当前实现针对 `dsh-app:` 桌面页面，其他桌面壳需单独验证。
- Windows 设置截图见上文链接。光门已通过浏览器预览及离线测试；真实托盘 / 最小化恢复仍需按[实机验收步骤](docs/PORTAL.md#实机验收)验证。macOS / Linux 尚未实机验证，macOS 完全遮挡窗口也可能产生可见性事件。
- 不同宿主版本及第三方插件可能使用自己的配色；绿色主题的覆盖范围取决于它们是否采用宿主主题变量。
- 在应用的插件管理中停用或卸载即可移除主题层。CLI 管理环境可运行 `dsh plugin --profile web remove dsh-codefall`，profile 按实际环境调整。

## 开发与预览

光门实现、窗口恢复逻辑与验收记录见[矩阵光门与窗口恢复播放](docs/PORTAL.md)。打开本地 `preview/index.html`，先点“就绪”，再点“交互”观察光门；该页面为离线演示，不是实际 Harness 窗口。
```

</details>

#### 缺口

- 未测首帧延迟、帧率和功耗。
  **影响**：净体验与电池成本未知。
  **进一步探讨**：按画质在多设备记录 Web Vitals/CPU/GPU。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证这种视觉插件不损害基本可用性？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先在非关键 DSH profile 试点，验证键盘/鼠标能进入、宿主迟到或失败时自动退、减少动态模式、恢复重播与卸载回退。未实现的改进是假设首帧注入提供可观察的进出状态与持续时间预算，并将诊断路径字段按权限裁剪；与无插件、静态主题对照启动可交互时间、帧率、操作误触、用户偏好和故障恢复。真实桌面验收不能由离线预览代替。

#### 证据与依据

**依据 1 · 源码核查**：[lib/boot.js:1032-1056](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/lib/boot.js#L1032-L1056)

减少动态和 watchdog。

<details>
<summary>查看原文（25行）</summary>

```text
      if (reduced) {
        // Honour the user's system setting: no loop at all, one settled frame.
        // The interaction wait still applies — it is a dismissal rule, not motion.
        renderer.frameAt(renderer.state().titleCompleteAt + 60)
        addListeners()
        emit('reduced-motion', {})
        beacon({ phase: 'reduced-motion', elapsed: 0 })
      } else {
        addListeners()
        startHeuristic()
        lastFrame = 0
        raf = root.requestAnimationFrame(loop)
      }

      // The caption glyphs are painted above the page, so they cannot be covered:
      // repaint them in the caption fill color instead. Independently of the
      // frame loop, and a no-op wherever the probe does not exist.
      scheduleCaptionHide()
      beacon({ phase: 'caption', elapsed: Math.round(now() - start), caption: captionReport() })

      // This watchdog covers exactly one thing: the host never reported ready.
      // Once it has, waiting for the user IS the intended state, not a timeout.
      watchdog = root.setTimeout(function () {
        watchdog = 0
        if (phase === 'playing' && !hostReady) fail('host-not-ready')
```

</details>

**依据 2 · 源码核查**：[lib/index.js:411-475](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/lib/index.js#L411-L475)

诊断接口和设置。

<details>
<summary>查看原文（65行）</summary>

```text
    // Self-report: which injection mechanism is actually carrying the page.
    try {
      const url = new URL(req.url || '/', 'http://codefall.local')
      if (url.searchParams.has('diag')) {
        return send(200, {
          ok: true,
          diag,
          files: { renderer: RENDERER_FILE, boot: BOOT_FILE, bootReadable: !!cache.read(BOOT_FILE) }
        })
      }
    } catch {
      /* a malformed URL is not worth failing over */
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      return send(200, { ok: true, value: readSettings(cache), defaults: DEFAULTS })
    }
    if (req.method !== 'POST') return send(405, { ok: false, error: 'method-not-allowed' })

    const contentType = String(req.headers['content-type'] || '')
    if (!contentType.includes('application/json')) return send(415, { ok: false, error: 'json-required' })

    let raw = ''
    try {
      for await (const chunk of req) {
        raw += chunk
        if (raw.length > MAX_BODY_BYTES) {
          send(413, { ok: false, error: 'payload-too-large' })
          req.destroy()
          return
        }
      }
    } catch {
      return send(400, { ok: false, error: 'unreadable-body' })
    }

    let patch
    try {
      patch = JSON.parse(raw || '{}')
    } catch {
      return send(400, { ok: false, error: 'bad-json' })
    }

    // `{patch:{...}}` mirrors the shape other DSH plugins use; a bare object
    // is accepted too so the route is easy to poke by hand.
    const delta = patch && typeof patch === 'object' && patch.patch ? patch.patch : patch

    // Page-side self-check reports are recorded, never persisted.
    if (patch && typeof patch === 'object' && patch.beacon && typeof patch.beacon === 'object') {
      const report = { ...patch.beacon, receivedAt: new Date().toISOString() }
      diag.beacons.push(report)
      if (diag.beacons.length > 20) diag.beacons.shift()
      return send(200, { ok: true, diag: { beacons: diag.beacons.length } })
    }

    const next = normalize({ ...readSettings(cache), ...(delta && typeof delta === 'object' ? delta : {}) })

    try {
      writeSettings(next)
      cache.invalidate(settingsFile())
    } catch {
      return send(500, { ok: false, error: 'write-failed' })
    }
    return send(200, { ok: true, value: next })
  }
```

</details>

**依据 3 · 作者声明**：[README.md:106-116](https://github.com/4444Hao/dsh-codefall/blob/68159fcced1d65c7ea356821859ea80d365c523a/README.md#L106-L116)

作者真实设备验收限制。

<details>
<summary>查看原文（11行）</summary>

```text
## 兼容与说明

- 建议使用 Harness **0.2.0-rc.2 或更高版本**。安装或更新插件后，请完整退出并重启应用。
- 窗口恢复重播依赖桌面环境的可见性事件；当前实现针对 `dsh-app:` 桌面页面，其他桌面壳需单独验证。
- Windows 设置截图见上文链接。光门已通过浏览器预览及离线测试；真实托盘 / 最小化恢复仍需按[实机验收步骤](docs/PORTAL.md#实机验收)验证。macOS / Linux 尚未实机验证，macOS 完全遮挡窗口也可能产生可见性事件。
- 不同宿主版本及第三方插件可能使用自己的配色；绿色主题的覆盖范围取决于它们是否采用宿主主题变量。
- 在应用的插件管理中停用或卸载即可移除主题层。CLI 管理环境可运行 `dsh plugin --profile web remove dsh-codefall`，profile 按实际环境调整。

## 开发与预览

光门实现、窗口恢复逻辑与验收记录见[矩阵光门与窗口恢复播放](docs/PORTAL.md)。打开本地 `preview/index.html`，先点“就绪”，再点“交互”观察光门；该页面为离线演示，不是实际 Harness 窗口。
```

</details>

#### 缺口

- 时延预算/诊断裁剪未实现。
  **影响**：不能算当前价值。
  **进一步探讨**：加入遥测后做 A/B 实机评估。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
