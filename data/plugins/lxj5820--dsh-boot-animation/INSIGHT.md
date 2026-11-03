# DSH Boot Animation

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b7786cd](https://github.com/lxj5820/dsh-boot-animation/tree/b7786cd749ef18608340a8f5e2071a3656ebf009)

<!-- BEGIN META -->
[![GitHub ★ 313](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=313&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lxj5820/dsh-boot-animation) [![npm 30d 14,896](https://img.shields.io/static/v1?label=npm+30d&message=14%2C896&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-boot-animation) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-boot-animation)
<!-- END META -->

> **功能**：为 DSH 提供可配置的全屏启动动画和闲置屏保，支持视频、图片、动图及外接 Live2D。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把预框架启动交接、可选素材和独立页面屏保组合为无需修改 DSH 源码的插件；显式区分首帧、媒体结束与客户端通知，有受控跳过路径。

> **主要限制**：[Q01](#research-q01)、[Q03](#research-q03) 装饰是否增加不必要等待与维护？15 秒只提示，默认首击可能只解音；屏保非锁屏，非 Windows 触发降级。素材优化会写盘并覆盖同名备份，宿主与资源实际成本未测。

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
  - [Q01 · 启动覆盖层如何早于 DSH 界面生效，又如何在素材或内核异常时交还界面？](#detail-section-11)
  - [Q02 · 屏保如何判断闲置、轮换和退出，哪些平台或能力不能保证？](#detail-section-12)
  - [Q03 · 配置、素材与安装卸载需要什么条件，失败恢复和退出由谁承担？](#detail-section-13)
  - [Q04 · 相比保留原生启动页与系统屏保，值得试用的增量是什么，如何验证新方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01)、[Q04](#research-q04) 面向明确希望个性化 DSH 启动与闲置画面的用户。合格结果是展示结束或手动收回后能继续原任务，收益属于个人视觉偏好。

[Q04](#research-q04) 对照保留原生 DSH 启动页、直接进入和系统屏保。未做同条件运行比较；系统锁屏的鉴权职责不由页面装饰替代。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 启动动画与交接 | 用自选素材覆盖原生启动页并淡出进入 | 依赖宿主注入与客户端通知，可能增加等待，可按键跳过 |
| 页面屏保 | 闲置或失焦后展示素材并点击/按键收回 | 默认关闭，非系统锁屏；非 Windows 仅失焦触发 |
| 素材池与渲染 | 分别管理片头和屏保的视频/图片/动图 | 需浏览器可解码；Live2D 另需外部适配器 |
| 设置卡与预览 | 调整声音、交接和屏保选项 | 依赖宿主 Config/volatile 接线；启动项通常下次刷新生效 |
| mp4 索引优化 | 将媒体索引前置以供更早读取 | 用户触发写盘、默认100MiB上限，同名旧备份会替换，不改变编码支持 |
| 打开素材目录 | 从设置卡定位本地素材池 | Host 发起系统文件管理器，需信任本地环境 |

**流程与依赖**

[Q03](#research-q03) 的依赖表区分宿主、schema、媒体、Windows 探测、Live2D 和素材权利；不将安装成功视为兼容通过。

[Q03](#research-q03) 的步骤表按准备、加载、单项配置、屏保与退出展开；建议先静音与一次点击进入，后启屏保，不先做媒体优化。

**效果与成本**

[Q03](#research-q03) 的成本表按首次、持续、恢复与退出分开，现金与资源、人工与时间分别记录，量化成本未知。

[Q04](#research-q04) 的效果表区分已接线机制与未验证体验、可靠性和效率；没有同条件运行收益。

> **思考**：[Q01](#research-q01)、[Q03](#research-q03) 装饰是否增加不必要等待与维护？15 秒只提示，默认首击可能只解音；屏保非锁屏，非 Windows 触发降级。素材优化会写盘并覆盖同名备份，宿主与资源实际成本未测。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把预框架启动交接、可选素材和独立页面屏保组合为无需修改 DSH 源码的插件；显式区分首帧、媒体结束与客户端通知，有受控跳过路径。

[Q01](#research-q01)、[Q02](#research-q02) 首帧和播放调用结果分开、媒体 renderer 与覆盖层生命周期解耦值得借鉴；移植代价是重接 DOM 进度、激活通知、可见性和系统闲置。[Q03](#research-q03) 同名媒体备份替换是明确取舍，不能当作版本归档。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01)、[Q03](#research-q03) 装饰是否增加不必要等待与维护？15 秒只提示，默认首击可能只解音；屏保非锁屏，非 Windows 触发降级。素材优化会写盘并覆盖同名备份，宿主与资源实际成本未测。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先确认 DSH/Chromium/schema 条件并备份 profile，用自有短视频关闭声音、开启一次点击进入，保持屏保关闭且不点优化，核对按键与慢启动能放行。再单独验证屏保；误遮挡、不能退出或资源负担明显时关闭两个开关并刷新，按原安装方式撤销。不要将屏保用于敏感会话保护。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本 Host/client、启动交接、屏保触发与退出、安装和媒体改写路径已源码核查；可在信任本地环境做可回退的偏好试用，未执行宿主/媒体/子进程验收。未来提示假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、entry.js、src/client.js、src/boot-screen.js、src/screensaver.js、src/idle-probe.js、src/renderers.js、src/remux.js、tools/install.sh、tools/uninstall.sh、LICENSE、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本仓库根组件，核查 README、package.json、Host 注入与路由、client 激活、boot-screen 交接、screensaver 触发/退出/清理、idle-probe、renderers、remux 和 shell 安装卸载；非全仓审计。
- 下一步：未执行目标代码、安装、离线测试、真实宿主、浏览器媒体播放与 Windows 子进程；后续按四题的对照和故障路径验收，不把代码存在写成运行通过。

**分析版本**

- **仓库**：[lxj5820/dsh-boot-animation](https://github.com/lxj5820/dsh-boot-animation)
- **版本号**：0.3.0（[固定提交 b7786cd](https://github.com/lxj5820/dsh-boot-animation/tree/b7786cd749ef18608340a8f5e2071a3656ebf009)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证方向是在已有诊断和提示基础上，将客户端激活、素材仍播与可跳过并列解释，并明确首击解音含义；以同场景用户误判、额外等待和干扰对照检验，无改善即否定。

未执行目标代码、安装、离线测试、真实宿主、浏览器媒体播放与 Windows 子进程；后续按四题的对照和故障路径验收，不把代码存在写成运行通过。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1151 | — | — | 23139 |
| .mjs | source | 6 | 2184 | 1363 | 624 | — |
| .js | source | 8 | 11680 | 5960 | 5163 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-03），可前往 [GitHub Issues](https://github.com/lxj5820/dsh-boot-animation/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的启动动画与屏保是否为希望个性化 DSH 的用户提供可控、可退出的界面增强，代价和兼容边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 启动覆盖层如何早于 DSH 界面生效，又如何在素材或内核异常时交还界面？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

它是原生 DSH 插件。Host 的 apply 注册媒体路由，并订阅 webserver/index-inject，依次向 head 写入配置、渲染器、屏保与可选启动脚本。启动开关只控制最后一行，因此关掉启动动画仍可独立保留屏保。相比保留原生加载页，其增量是可选素材和可配置的视听交接，适合明确希望个性化启动体验的用户；代码没有减少内核初始化工作，不能解释为启动加速。

自动交接同时受素材完成与本插件 clientReady 通知约束。client apply 先尝试通知覆盖层，再接可选配置卡；因此配置卡失败不应阻断这个通知。clientReady 的事实是本插件客户端入口已激活，不能当成所有工具和业务页面均可操作的验收。进度显示和失败识别另依赖原生 [data-dsh-boot] 元素、进度 CSS 属性及两段英文错误文案，宿主变动会使观察路径失效。

素材清单超过 10 秒未回应时标记素材完成，等待客户端就绪；单项 6 秒无首帧则尝试下一项；未知时长走 20 秒完成路径。15 秒 HOLD 只改提示为“启动较慢，点击继续”，并非强制自动退出。Esc、空格或回车直接调用 enter；默认第一次点击在音频被拦截且有重试函数时只解锁声音，要明确设置 clickToEnter 才把一次点击用作进入。enter 通过淡出后移除覆盖 DOM，交还界面并不证明底层启动成功。

另一个易误解之处是全部素材被禁用时，客户端过滤为空便恢复完整池。用户想完全退出装饰，应关启动总开关并刷新，而不是逐项取消勾选。上述超时与人工放行是有价值的边界控制，但没有真实浏览器故障演练，不能保证所有解码冻结和宿主失败都自动恢复。

#### 证据与依据

**依据 1 · 源码核查**：[entry.js:1623-1683](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/entry.js#L1623-L1683)

真实 head 注入顺序与仅控制启动脚本的开关。

<details>
<summary>查看原文（61行）</summary>

```text
    const rowsBefore = table.length
    table.push({
      kind: 'script',
      placement: 'head',
      text: `globalThis.__DSH_BOOT_ANIM_CFG__=${JSON.stringify({
        base: ROUTE,
        manifest: `${ROUTE}/clips.json`,
        // The screensaver's own manifest and settings. The screensaver itself runs
        // in the CLIENT half rather than in this injected screen, because it has to
        // be alive long after the boot path has handed over — but it reads its
        // configuration from here, so there is still exactly one source of truth for
        // what a pool is and where it lives.
        screensaverManifest: `${ROUTE}/screensaver.json`,
        // Where the OS idle counter is read. The screensaver polls this rather than
        // being handed a value once, because the answer changes continuously.
        systemIdle: `${ROUTE}/system-idle.json`,
        // Where the page reports what it sees, so a problem can be read from outside.
        // The desktop app has no console and no address bar, so this is the only channel
        // a diagnosis can travel on.
        saverReport: `${ROUTE}/saver-report`,
        // Where the screensaver re-reads the settings before each appearance. This exists because
        // the values below are a SNAPSHOT taken when the page loaded: saving the document does not
        // rebuild this object, and the desktop shell has no reload key. Without the route a
        // changed picker applied to the document and never to the running screensaver.
        liveSettings: `${ROUTE}/live-settings.json`,
        holdMs: 15000,
        fadeMs: settings.fadeMs,
        enterMode: settings.enterMode,
        sound: settings.sound,
        clickToEnter: settings.clickToEnter,
        showHint: settings.showHint,
        screensaverEnabled: settings.screensaverEnabled,
        screensaverIdleMs: settings.screensaverIdleMs,
        screensaverBreakEffect: settings.screensaverBreakEffect,
        screensaverBreakStyle: settings.screensaverBreakStyle,
        screensaverHint: settings.screensaverHint,
        screensaverPointerEffect: settings.screensaverPointerEffect,
        screensaverSound: settings.screensaverSound,
        screensaverVolume: settings.screensaverVolume,
        screensaverRotateMs: settings.screensaverRotateMs,
      })}`,
    })
    table.push({ kind: 'script', placement: 'head', text: readSource(RENDERERS_PATH) })
    // The screensaver, third because it depends on both the config above and the
    // renderer factory before it. It installs itself and then keeps its own timer:
    // nothing else in the page has to call into it.
    //
    // UNCONDITIONAL, like the two rows above. It has its own switch
    // (`screensaverEnabled`, which the screensaver reads from CFG and from the live
    // route), so the boot animation's switch has no business deciding whether its
    // script exists at all.
    table.push({ kind: 'script', placement: 'head', text: readSource(SCREENSAVER_PATH) })

    // The boot screen is the ONE row `enabled` governs. Switched off means the
    // kernel's own boot page shows: no overlay, and not one request for a clip.
    // Injecting a disabled screen and making the script bail out would look the same
    // and leave the whole overlay running; not injecting it at all is the only
    // version of "off" that is actually off.
    const bootInjected = settings.enabled
    if (bootInjected) {
      table.push({ kind: 'script', placement: 'head', text: readSource(BOOT_SCREEN_PATH) })
```

</details>

**依据 2 · 源码核查**：[src/client.js:2187-2199](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/client.js#L2187-L2199)

客户端先通知覆盖层，异常被捕获。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/boot-screen.js:606-621](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/boot-screen.js#L606-L621)

自动交接的双条件和点击模式例外。

<details>
<summary>查看原文（16行）</summary>

```text
  function maybeEnter() {
    // In `click` mode the clip is the whole show and the user decides when it
    // ends; nothing about the clip or the kernel releases the screen but a press.
    if (ENTER_MODE === 'click') return
    if (!clipDone || namespace.failed) return
    if (namespace.bootedAt === null) {
      // The clip is over but the kernel is not ready. The last frame is simply
      // held, which is the behaviour every version before the screensaver had.
      //
      // Deliberately not the amber attention state: nothing is wrong yet, and
      // flashing the warning for an ordinary slow start would cry wolf on a
      // condition that resolves itself. The amber hint is saved for a real stall.
      parts.hint.textContent = '启动较慢，就绪后自动进入'
      return
    }
    enter()
```

</details>

**依据 4 · 源码核查**：[src/boot-screen.js:957-971](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/boot-screen.js#L957-L971)

按键放行与 15 秒只提示的实际分支。

<details>
<summary>查看原文（15行）</summary>

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

**依据 5 · 源码核查**：[src/boot-screen.js:1064-1095](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/boot-screen.js#L1064-L1095)

10 秒清单等待和全禁用回全集。

<details>
<summary>查看原文（32行）</summary>

```text
      clipDone = true
      maybeEnter()
    }
    var manifestWindow = globalThis.setTimeout(function () {
      releaseWithoutClip('素材清单没有回应 · 就绪后自动进入')
    }, 10000)

    // Discover the pool, then show one entry. Loading is deferred until the
    // manifest answers so a page load without entries shows only the gradient.
    //
    // A preview names the pool it wants, because the two pools are separate
    // directories and one name can exist in both: previewing a screensaver entry out
    // of the boot manifest would either find nothing or find a different file.
    var manifestUrl = previewName !== null && previewPool === 'screensaver'
      && typeof cfg.screensaverManifest === 'string'
      ? cfg.screensaverManifest
      : cfg.manifest
    fetch(manifestUrl, { cache: 'no-store' })
      .then(function (response) { return response.ok ? response.json() : { items: [] } })
      .then(function (payload) {
        globalThis.clearTimeout(manifestWindow)
        var published = payload && Array.isArray(payload.items) ? payload.items : []
        // The pool the user curated in the settings card. Switching every entry off
        // would leave nothing to show and therefore nothing to trigger the
        // hand-off, so a filter that would empty the pool is dropped rather than
        // obeyed — the same fallback the Host keeps, repeated here because this
        // manifest is the only input this script has.
        var clips = published.filter(function (clip) { return clip.enabled !== false })
        if (clips.length === 0) clips = published
        if (clips.length === 0) {
          releaseWithoutClip('素材池是空的 · 就绪后自动进入')
          return
```

</details>

**依据 6 · 源码核查**：[src/boot-screen.js:1314-1326](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/boot-screen.js#L1314-L1326)

6 秒首帧 watchdog 到换下一条。

<details>
<summary>查看原文（13行）</summary>

```text
          var advance = globalThis.setTimeout(function () {
            // The entry was given its six seconds and never showed anything. Say so
            // before moving on: "skipped silently" is indistinguishable from "the
            // whole screen is broken" when all you can see is a gradient.
            noteFailure(clip, 'no-frame')
            tryNext()
          }, 6000)
          // Armed only for an entry whose duration cannot be known; see below.
          var endless = null
          var reveal = function () {
            if (settled) return
            settled = true
            globalThis.clearTimeout(advance)
```

</details>

**依据 7 · 源码核查**：[src/boot-screen.js:1389-1395](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/boot-screen.js#L1389-L1395)

未知时长 20 秒完成路径。

```text
          var knownLength = typeof media.duration === 'function' && Number.isFinite(media.duration())
          if (!knownLength) {
            namespace.unknownLength = true
            endless = globalThis.setTimeout(function () {
              clipDone = true
              maybeEnter()
            }, ENDLESS_MS)
```

**依据 8 · 源码核查**：[src/boot-screen.js:905-922](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/boot-screen.js#L905-L922)

默认点击可能只进行音频解锁。

<details>
<summary>查看原文（18行）</summary>

```text
    var media = parts.media()
    var finished = media !== null && typeof media.isEnded === 'function' && media.isEnded() === true
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
```

</details>

**依据 9 · 源码核查**：[src/boot-screen.js:543-574](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/boot-screen.js#L543-L574)

进度和失败识别依赖具体宿主 DOM 与文案。

<details>
<summary>查看原文（32行）</summary>

```text
  /** Drive the bar from the kernel's own progress arc. */
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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 屏保如何判断闲置、轮换和退出，哪些平台或能力不能保证？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

屏保是页面内覆盖层，默认关闭，不是操作系统锁屏或访问控制。触发条件是系统闲置超过阈值，或窗口失焦持续超过阈值，两者任一即可。启动覆盖层仍在时不出现；visibilityState 连续 hidden 满 5 秒时让出，避免瞬时可见性抖动造成闪屏。但别的窗口遮住 DSH 不必然改变 visibilityState，因此不能据此承诺只在真正可见时渲染。

已经出现的屏保由点击或任意按键退出，鼠标移动不退出；tick 没有把系统闲置读数归零当成 dismiss。一次按键会调用 hide(true)，代码本身没有提供密码验证，因此既不适合保护敏感会话，也不应拿它代替系统锁屏。系统闲置值由 Host 侧 Windows PowerShell 长驻子进程调用 GetLastInputInfo 获取；失败有 30 秒退避，读数有 5 秒有效期。其他平台返回不可用并依赖窗口失焦，用户停留在前台长时间不操作的场景并没有同等系统闲置覆盖。

媒体通过统一 renderer 接口呈现，视频有时间线，图片与动图没有可靠结束；Live2D 是可选外部全局适配器，插件不带运行时，缺适配器会报告 no-adapter。屏保能按配置轮换媒体，退出特效与减少动态效果偏好有降级路径。可借鉴的是把媒体生命周期和覆盖层生命周期分开，让 dispose、首帧与结束各表达不同事实；移植仍要重新接实际宿主可见性、媒体策略和焦点事件。

安装函数返回清理定时器、监听和媒体的 disposer，Host 探测器也注册了 dispose。这里确认的是清理实现存在；浏览器脚本卸载时是否总被宿主调用、窗口关闭是否清理 Windows 子进程，都没有本轮运行验收。默认关闭也仍会安装隐藏 DOM、轮询及状态报告，不能宣称关闭屏保即零常驻成本。

#### 证据与依据

**依据 1 · 源码核查**：[entry.js:194-210](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/entry.js#L194-L210)

屏保默认关闭及默认阈值。

<details>
<summary>查看原文（17行）</summary>

```text
   * Whether the screensaver runs at all.
   *
   * The screensaver covers the app after the user has been idle for a while, and
   * any real input brings it back. OFF BY DEFAULT, and that is deliberate rather
   * than cautious: this feature TAKES OVER THE SCREEN, so a user who never asked
   * for it would have the app covered while they were reading. A feature that
   * interrupts has to be opted into.
   */
  screensaverEnabled: false,
  /**
   * How long the app must be idle before the screensaver appears, in milliseconds.
   *
   * Bounded at both ends: below the lower bound it would fire while someone is
   * still reading a sentence, and above the upper bound it would never fire in a
   * normal session at all.
   */
  screensaverIdleMs: 180000,
```

</details>

**依据 2 · 源码核查**：[src/screensaver.js:489-529](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/screensaver.js#L489-L529)

触发双条件、隐藏宽限与让出启动层。

<details>
<summary>查看原文（41行）</summary>

```text
const HIDDEN_GRACE_MS = 5000

/** Whether either idle condition has been met. */
function shouldShow() {
  // THE LIVE `screensaverEnabled`, not the install-time snapshot. The layer is installed
  // unconditionally now (see `installScreensaver` for why), so this line is the ONLY thing that
  // decides whether it appears — and it is asked on every tick, which is what makes the switch
  // take effect the moment it is saved instead of after a reload the desktop shell cannot offer.
  if (!saverEnabled()) return false
  // A dismissal holds until the machine is seen to be in use again. Without this the
  // layer reappears about two seconds after the user dismisses it — on the reading the
  // poll was already holding, which still said "idle" — and getting rid of it takes a
  // second click. See `dismissedUntilActive`.
  if (dismissedUntilActive) return false
  // The boot overlay owns the screen until it hands over. A screensaver that covered
  // it would be the boot animation's own failure mode reproduced by a different
  // feature: the user would never see the animation they configured, and the hand-off
  // would happen underneath a layer they did not ask for. The overlay removes itself
  // when it is done, so this clears by itself a few seconds later.
  if (globalThis.__DSH_BOOT_ANIM__ !== undefined && globalThis.__DSH_BOOT_ANIM__.el?.parentNode) {
    return false
  }
  // A window nobody can see should not be covered. This is the half of "is anybody
  // looking" that the page CAN answer — but only once the answer has PERSISTED, because
  // in the Electron shell `visibilityState` flickers while the window is plainly on
  // screen. Believing each flip showed and hid the layer in turn, and the screen strobed.
  //
  // The other half is not answerable and is NOT attempted: a window merely COVERED by
  // another window still reports 'visible', because that is an operating-system fact the
  // renderer cannot see.
  if (hiddenFor() >= HIDDEN_GRACE_MS) return false
  // The OS half. Only a reading counts: 'starting' means the probe has not answered
  // yet, and 'unavailable' means it never will, so neither may be read as "idle".
  //
  // The threshold is resolved live, per check, for the same reason as the switch above: 闲置时长
  // is one of the fields the card promises is already in effect.
  if (idleStatus === 'ok' && lastIdleMs !== null && lastIdleMs >= idleThresholdMs()) return true
  // The focus half. Always available, and the only half on a platform without an OS
  // idle counter.
  if (blurredFor() >= idleThresholdMs()) return true
  return false
```

</details>

**依据 3 · 源码核查**：[src/screensaver.js:2251-2281](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/screensaver.js#L2251-L2281)

读数下降不会自动收回已出现屏保。

<details>
<summary>查看原文（31行）</summary>

```text
/** Check both idle conditions and act on the result. */
function tick() {
  if (disposed) return
  pollSystemIdle()
  if (shouldShow()) {
    if (!visible) show()
    return
  }
  // The layer is up and the idle reading has dropped. That does NOT mean "dismiss it".
  //
  // The rule this feature is built on is that MOVEMENT IS NOT DISMISSAL: the user asked
  // for a screensaver that survives a nudged mouse, so that reading a long page does not
  // clear the screen. The idle counter drops to zero the moment the mouse moves, so
  // treating "no longer idle" as a dismissal silently deleted that rule — and it did it
  // WITHOUT the break effect, because this path passes `false`. The visible symptom was
  // exactly that: the screensaver vanished on a mouse move, with no tear, which reads as
  // "the effect is broken" rather than as "the dismissal rule was inverted".
  //
  // So a shown layer stays up until something actually dismisses it: a click, a key, or
  // the window having been hidden for long enough to believe. The last of those is
  // decided here rather than on the event, because acting on the event is what made the
  // screen strobe.
  if (!visible) return
  // A PREVIEW is not subject to the automatic stand-downs, and this is the bug the user
  // reported as "the preview dismisses itself". The poll runs every couple of seconds, so a
  // preview raised while the boot overlay was still finishing would be taken down by this
  // very line — before the user had seen anything, and with no effect. A preview is a
  // deliberate, momentary act by somebody who is demonstrably present: it ends when THEY end
  // it, with a click or a key.
  if (previewing) return
  if (shouldYieldToOverlay() || hiddenFor() >= HIDDEN_GRACE_MS) hide(false)
```

</details>

**依据 4 · 源码核查**：[src/screensaver.js:2527-2546](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/screensaver.js#L2527-L2546)

点击/按键退出，鼠标移动不会退出。

<details>
<summary>查看原文（20行）</summary>

```text
  on(pieces.catcher, 'pointerdown', (event) => {
    event.preventDefault()
    event.stopPropagation()
    hide(true)
  })
  on(globalThis, 'keydown', () => {
    if (visible) hide(true)
  }, true)
  // A pointer press anywhere in the window, not only on the catcher: the catcher
  // covers the layer, but the window may also receive presses through other paths
  // (a shortcut handler, an OS-level event) and a press is unambiguous intent.
  on(globalThis, 'pointerdown', () => {
    if (visible) hide(true)
  }, true)
  // Moving the mouse does not dismiss, but it must not leave a stale "unfocused"
  // measurement either: activity proves the user is present.
  on(globalThis, 'pointermove', () => {
    // Deliberately empty of dismissal. It exists so the intent is recorded in one
    // place: this listener is what says "movement is activity, not dismissal".
  })
```

</details>

**依据 5 · 源码核查**：[src/idle-probe.js:32-70](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/idle-probe.js#L32-L70)

Windows 调用、TTL 与失败退避常量。

<details>
<summary>查看原文（39行）</summary>

```text
const PROBE_SCRIPT = [
  'Add-Type -TypeDefinition @"',
  'using System;',
  'using System.Runtime.InteropServices;',
  'public class DshIdleProbe {',
  '    [StructLayout(LayoutKind.Sequential)]',
  '    public struct LASTINPUTINFO { public uint cbSize; public uint dwTime; }',
  '    [DllImport("user32.dll")]',
  '    public static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);',
  '    public static long Ms() {',
  '        LASTINPUTINFO lii = new LASTINPUTINFO();',
  '        lii.cbSize = (uint)Marshal.SizeOf(lii);',
  '        if (!GetLastInputInfo(ref lii)) return -1;',
  '        return (long)((uint)Environment.TickCount - lii.dwTime);',
  '    }',
  '}',
  '"@',
  'while ($true) {',
  '    Write-Output ("DSHIDLE " + [DshIdleProbe]::Ms())',
  '    Start-Sleep -Milliseconds 1000',
  '}',
].join('\n')

/** How long a reading stays usable. The child ticks every second; this allows for a
 *  few missed ticks before the value is treated as unknown rather than stale. */
const READING_TTL_MS = 5000

/** How long to wait for the child to produce its first line before giving up. */
const FIRST_LINE_TIMEOUT_MS = 8000

/**
 * How long to wait before trying again after a failure.
 *
 * A failure is rarely permanent — a child can fail to spawn under load, or die hours in —
 * so giving up for the rest of the session is the wrong default. Long enough that a machine
 * which genuinely cannot run the probe is not spawning a process every few seconds, short
 * enough that a transient failure repairs itself within a poll or two.
 */
const RETRY_MS = 30000
```

</details>

**依据 6 · 源码核查**：[src/idle-probe.js:188-201](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/idle-probe.js#L188-L201)

真实 PowerShell 子进程入口。

<details>
<summary>查看原文（14行）</summary>

```text
      let spawned
      try {
        spawned = spawn('powershell', [
          '-NoProfile',
          '-NonInteractive',
          '-ExecutionPolicy', 'Bypass',
          '-Command', PROBE_SCRIPT,
        ], {
          // Piped stdout is the point: the values arrive on it. stderr is captured
          // so a PowerShell parse error can be reported instead of looking like a
          // probe that simply never answers.
          stdio: ['ignore', 'pipe', 'pipe'],
          windowsHide: true,
        })
```

</details>

**依据 7 · 源码核查**：[src/renderers.js:265-309](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/renderers.js#L265-L309)

Live2D 全局适配器、缺失与异常分支。

<details>
<summary>查看原文（45行）</summary>

```text
    var adapter = globalThis.__DSH_BOOT_ANIM_LIVE2D__
    var canvas = document.createElement('canvas')
    canvas.className = 'dshba-media dshba-live2d'

    var shownCbs = []
    var errorCbs = []
    var handle = null
    var fireShown = once(function () {
      for (var i = 0; i < shownCbs.length; i += 1) shownCbs[i]()
    })
    function fail(reason) {
      if (options && typeof options.onDiagnostic === 'function') {
        options.onDiagnostic('live2d:' + String(reason))
      }
      for (var i = 0; i < errorCbs.length; i += 1) errorCbs[i](0)
    }

    if (typeof adapter !== 'function') {
      // Deferred by a tick so the screen has attached its error listener before
      // this fires; otherwise the failure happens before anyone is listening and
      // the entry looks like it simply never started.
      globalThis.setTimeout(function () { fail('no-adapter') }, 0)
    } else {
      try {
        handle = adapter({
          modelUrl: entry.src,
          canvas: canvas,
          onReady: fireShown,
          onError: fail,
        })
      } catch (error) {
        globalThis.setTimeout(function () { fail(error && error.message ? error.message : 'adapter-threw') }, 0)
      }
    }

    return {
      kind: 'live2d',
      el: function () { return canvas },
      start: function () {
        if (handle && typeof handle.start === 'function') return handle.start()
        return undefined
      },
      dispose: function () {
        if (handle && typeof handle.dispose === 'function') {
          try { handle.dispose() } catch (error) { /* the adapter owns its own cleanup */ }
```

</details>

**依据 8 · 源码核查**：[src/screensaver.js:2585-2595](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/screensaver.js#L2585-L2595)

显式 disposer 清理轮询、报告、轮换与监听。

<details>
<summary>查看原文（11行）</summary>

```text
  return () => {
    disposed = true
    if (timer !== null) clearInterval(timer)
    timer = null
    // Every timer this module owns is cleared here, so "the plugin is unloaded" means no
    // interval survives it — the tick, the rotation (via `releaseMedia`'s path and the
    // explicit stop below) and the state report.
    stopReporting()
    stopRotation()
    for (const off of listeners.splice(0, listeners.length)) off()
    releaseMedia()
```

</details>

**依据 9 · 源码核查**：[src/screensaver.js:2562-2575](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/screensaver.js#L2562-L2575)

轮询及状态报告不以屏保可见为前提。

<details>
<summary>查看原文（14行）</summary>

```text
  timer = setInterval(tick, CHECK_MS)
  tick()

  // The state report runs UNCONDITIONALLY, and that is the point of it.
  //
  // The desktop app has no console and no address bar, so the `?dshbootdiag=1` gate below
  // is unreachable for the person who actually has the problem. Reporting to the Host
  // instead means the answer can be read from outside, with nothing asked of the user.
  // It runs even when the screensaver is switched off, because "switched off" is one of
  // the states worth being able to see.
  //
  // Its disposer is KEPT and spliced into the one below: the handle used to be dropped, so an
  // unload left this interval POSTing the state of a layer that no longer existed.
  const stopReporting = startStateReporting()
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 配置、素材与安装卸载需要什么条件，失败恢复和退出由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者对本版声明 DSH 0.2.0-rc.2、Node ^22.19.0 或 >=24 和 Chromium。Host 直接 import schemastery，并导出 Config；live 包装探测 volatile 方法，不支持时回退非动态 schema，可能失去设置卡而不是自动修复依赖。配置与注入存在明确宿主耦合，不能把 README 的“不改源码”推广成未来升级无须复核。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 0.2.0-rc.2 与 webServer/index 注入契约 | 启动必需，版本为作者声明 | 提供 Host 路由和预框架脚本 | 其他宿主版本兼容未知，先回原生页 |
| Node ^22.19.0 或 >=24、schemastery | 启动必需 | 加载 Host 与配置 schema | 缺 peer 会影响模块加载；没有 volatile 方法时配置卡可能不显示 |
| Chromium 与可解码的本地媒体 | 播放必需 | 播放、DOM 和音频策略 | 解码失败换素材；Firefox 未获作者验证 |
| Windows / PowerShell | 仅系统闲置触发必需 | 读取整机输入闲置值 | 非 Windows 仅剩窗口失焦条件 |
| Live2D 适配器 | 仅模型播放必需 | 提供模型渲染与清理 | 未提供则跳过模型 |
| 可写素材目录和额外磁盘空间 | 仅优化/打开目录操作必需 | 改写 mp4 和备份 | 不做优化仍可播放可用素材 |
| 自有或许可匹配的素材 | 使用素材的条件 | 遵守作者列明的代码与媒体许可差异 | 商业场景须替换素材或向作者取得许可 |

安装脚本针对 profile 建目录链接、追加 patch 行，保留备份且不自动安装包依赖；读取 DSH_HOME 或默认路径属于安装动作。本轮没有执行。卸载脚本只匹配自己写入的三行块，校验删除字节，并只移除链接；用户手动改过 YAML 或使用官方安装方式时不能假定它覆盖所有状态。

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份 profile patch，确认宿主、schema 与素材 | 保留可恢复配置和插件目录 |
| 加载 | 用户按 INSTALL 选对应 web/desktop 安装路由 | 刷新可见覆盖层、配置卡；无卡先查 schema 告警 |
| 配置 | 用户先关闭声音、启用一次点击进入，仅用自有普通视频 | 观察正常启动、按键放行，不先启用屏保或优化 |
| 屏保 | 用户单独开启并配置阈值 | 前台闲置/失焦按平台边界出现，点击或按键能退 |
| 恢复与退出 | 用户关两个开关并刷新，必要时移除安装行/链接 | 原生页恢复，检查旧页面与进程退出；按备份恢复 patch |

“优化”不是纯预览。Host POST 路由调用 optimizeInPlace，限制文件名和同文件并发；重排模块默认拒绝大于 100MiB 的文件，在暂存自检后将原片改名进 originals。存在同名备份时会先删除旧备份，因此 originals 不是多版本归档。替换后失败有还原路径，但进程在 rename 间异常终止的结果本轮未演练。只是想试视觉效果时无需碰这个写盘功能。打开文件夹同样是 Host 发起本地程序的副作用，部署应限制在信任的本地环境；没有核查整个宿主的远程认证与跨站防护。

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地媒体存储，下载量与许可成本未知 | 安装、profile/schema 核对和素材选择 | 没有量化耗时，不依赖模型账号 |
| 持续使用 | 媒体解码、轮询及 Windows 探测子进程 | 每次启动可能等到片尾，升级后复核交接 | GPU/内存/等待总量未测，不能记为零 |
| 失败恢复 | 日志、备份与重写暂存空间 | 查启动跟踪、媒体格式与恢复 profile | 备份不是历史版本库；重复优化同名备份会替换 |
| 升级和退出 | 保留自有素材与配置备份 | 检查宿主 DOM/API、移除 patch 行和目录链接、刷新 | 热加载取决于 profile，实际退出清理未运行 |

代码的 MIT 声明不覆盖作者的视频素材；LICENSE 单列个人/非商业使用和商业授权限制。这里记录项目许可文本，不推定用户实际素材权利。一次合格任务定义为启动或屏保按预期展示且用户能收回并继续原任务，现有资料没有它的端到端耗时、资源或成功率，因此无法给出节时与单位成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-41](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/README.md#L23-L41)

作者声明运行环境与官方 web 安装范围。

<details>
<summary>查看原文（19行）</summary>

````text
## 环境要求

| 条件 | 要求 |
|---|---|
| DSH | `0.2.0-rc.2`。这一版换了插件提供设置的接法（声明 `Config`，不再注册命名空间），更旧的 DSH 要用旧版插件 |
| Node.js | `^22.19.0` 或 `>=24` |
| 浏览器 | Chromium 内核（Chrome / Edge）。Firefox 没测过 |

## 装法

三条路，选一条。细节与撤销办法见 [INSTALL.md](INSTALL.md)。

**路 A：官方命令**

```sh
dsh plugin --profile web add <解压出来的目录>
```

这条路会让 pnpm 把依赖也装好，**装完重启一次 DSH**。桌面版（DSH Desktop）的 profile 叫 `desktop`，而这条命令不允许直接改它，桌面版请走路 B 或路 C。
````

</details>

**依据 2 · 源码核查**：[entry.js:358-362](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/entry.js#L358-L362)

动态配置能力探测。

```text
const LIVE_CAPABLE = typeof z.boolean().volatile === 'function'

/** Mark one Config field live-editable, where the schema library allows it. */
function live(schema) {
  return LIVE_CAPABLE ? schema.volatile() : schema
```

**依据 3 · 源码核查**：[entry.js:421-434](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/entry.js#L421-L434)

Config 中的独立开关和阈值。

<details>
<summary>查看原文（14行）</summary>

```text
export const Config = z.object({
  enabled: live(z.boolean().default(DEFAULT_SETTINGS.enabled)),
  fadeMs: live(z.number().min(300).max(5000).default(DEFAULT_SETTINGS.fadeMs)),
  enterMode: live(z.union([...ENTER_MODES]).default(DEFAULT_SETTINGS.enterMode)),
  disabledClips: live(z.array(z.string()).default([])),
  sound: live(z.boolean().default(DEFAULT_SETTINGS.sound)),
  clickToEnter: live(z.boolean().default(DEFAULT_SETTINGS.clickToEnter)),
  showHint: live(z.boolean().default(DEFAULT_SETTINGS.showHint)),
  screensaverEnabled: live(z.boolean().default(DEFAULT_SETTINGS.screensaverEnabled)),
  // Bounded at both ends rather than merely positive: a threshold under 30s would
  // cover the screen while somebody is still reading, and one over an hour would
  // never fire in a normal session.
  screensaverIdleMs: live(z.number().min(30000).max(3600000)
    .default(DEFAULT_SETTINGS.screensaverIdleMs)),
```

</details>

**依据 4 · 源码核查**：[tools/install.sh:9-18](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/tools/install.sh#L9-L18)

安装动作及热加载依赖 profile。

<details>
<summary>查看原文（10行）</summary>

```text
# What it does:
#   1. a symlink at <profile>/node_modules/dsh-boot-animation
#   2. one appended row in <profile>/cordis.patch.yml
# It does NOT touch package.json, does NOT run pnpm, and does NOT restart dsh.
#
# A profile whose package.json says `dsh.profile.patchReload: "live"` (the
# default when the field is absent) gets a Cordis HMR watcher on cordis.patch.yml,
# so the change is picked up without a restart. Profiles that opt out of live
# patching still install fine - they just need the restart, and the script says so
# instead of promising a hot reload it cannot deliver.
```

</details>

**依据 5 · 源码核查**：[tools/install.sh:116-121](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/tools/install.sh#L116-L121)

profile、链接与备份路径。

```text
PROFILE_DIR="$DSH_HOME_DIR/profiles/$PROFILE"
PATCH_FILE="$PROFILE_DIR/cordis.patch.yml"
PROFILE_MANIFEST="$PROFILE_DIR/package.json"
LINK_PATH="$PROFILE_DIR/node_modules/$PLUGIN_NAME"
STAMP=$(date '+%Y%m%d-%H%M%S')
BACKUP="$DSH_HOME_DIR/.dsh-rollback-$PLUGIN_NAME-$STAMP"
```

**依据 6 · 源码核查**：[tools/uninstall.sh:137-175](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/tools/uninstall.sh#L137-L175)

删除匹配项的字节核对及只删除链接。

<details>
<summary>查看原文（39行）</summary>

```text
if [ "${removed:-0}" = '0' ]; then
  say "  no row for $PLUGIN_NAME found; the patch layer is already clean"
  rm -f "$REWRITTEN" "$REPORT"
else
  # The one invariant worth asserting before the rewrite goes back: the bytes that
  # left the file are exactly the bytes of the rows that were matched. If anything
  # else were dropped or mangled, this does not add up. The only benign mismatch is
  # one byte, and only when a final newline was missing (awk gives every line it
  # prints a newline) - that case is reported rather than failed.
  expected=$((rewritten_bytes + removed_bytes))
  if [ "$expected" -eq "$original_bytes" ]; then
    cat "$REWRITTEN" > "$PATCH_FILE" || fail "cannot write '$PATCH_FILE'."
    rm -f "$REWRITTEN" "$REPORT"
    say "  removed $removed row(s) ($removed_bytes bytes); everything else is byte-identical"
  elif [ "$((expected - 1))" -eq "$original_bytes" ] &&
       [ "$(tail -c 1 "$BACKUP/cordis.patch.yml" | wc -l | tr -d ' ')" = '0' ]; then
    cat "$REWRITTEN" > "$PATCH_FILE" || fail "cannot write '$PATCH_FILE'."
    rm -f "$REWRITTEN" "$REPORT"
    say "  removed $removed row(s); the file had no final newline, which is now added"
  else
    say "  WARNING: the rewrite did not account for every byte"
    say "    $PATCH_FILE   : $original_bytes bytes"
    say "    kept          : $rewritten_bytes bytes"
    say "    removed rows  : $removed_bytes bytes in $removed row(s)"
    say '  The patch layer is left exactly as it was; nothing was written.'
    say "  The version this script would have written is at $REWRITTEN if you want to diff it,"
    say "  and the untouched original is in the backup beside it."
  fi
fi

say '=== 3/3 remove the directory link ==='
if [ -L "$LINK_PATH" ]; then
  target=$(readlink "$LINK_PATH")
  rm -f "$LINK_PATH" || fail "cannot remove the link at '$LINK_PATH'."
  say "  removed $LINK_PATH (was -> $target)"
elif [ -e "$LINK_PATH" ]; then
  say "  WARNING: $LINK_PATH is not a symlink, so it was left alone."
  say '  This script only removes the link it created; if that directory is a copy'
  say '  of the package, delete it yourself.'
```

</details>

**依据 7 · 源码核查**：[entry.js:1230-1273](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/entry.js#L1230-L1273)

优化写盘路由与单项锁。

<details>
<summary>查看原文（44行）</summary>

```text
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
        // The pool travels in the query too, because the two pools are separate
        // directories and the same file name can exist in both. The prefix is
        // stripped before the containment check, which is then identical for both.
        const inScreensaver = requested.startsWith('screensaver/')
        const bare = inScreensaver ? requested.slice('screensaver/'.length) : requested
        const dir = poolDir(inScreensaver ? 'screensaver' : 'clips')
        // The same containment rule as `resolvePoolFile`: a bare file name from
        // this pool, nothing that could name a path. Comparing against `basename`
        // rejects any separator the query carried in, encoded or not.
        const name = basename(bare)
        const absolute = resolve(dir, name)
        // Only a video can be faststart-optimised: `moov` is an mp4 box, and an
        // image has no index table to move. Refusing here is what keeps the card
        // from offering a button that cannot work.
        if (name === '' || name !== bare
          || mediaTypeOf(name)?.kind !== 'video'
          || !absolute.startsWith(dir + sep)) {
          sendJson(res, 400, { ok: false, error: '素材名不合法。' })
          return
        }
        // The lock is keyed by the full pool-qualified name so two pools cannot
        // collide on one file name and report a spurious "already running".
        const key = (inScreensaver ? 'screensaver/' : '') + name
        if (optimising.has(key)) {
          sendJson(res, 409, { ok: false, error: '这一条正在处理，稍等一下再点。' })
          return
        }
        optimising.add(key)
        try {
          const result = await optimizeInPlace({
            file: absolute,
            backupDir: join(dir, 'originals'),
            scratchDir: join(dir, '.faststart-work'),
          })
```

</details>

**依据 8 · 源码核查**：[src/remux.js:324-384](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/remux.js#L324-L384)

大小限制、暂存、同名备份覆盖与错误恢复。

<details>
<summary>查看原文（61行）</summary>

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
```

</details>

**依据 9 · 作者声明**：[README.md:166-172](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/README.md#L166-L172)

项目明列代码和媒体许可差异。

```text
## 许可

**代码**是 MIT，见 [LICENSE](LICENSE)：改、用、再分发、商用都可以，保留版权声明即可。

**素材不是。** `assets/videos/` 和 `assets/screensaver/` 里的视频是作者自己的原创动画，作者保留全部权利，**不在 MIT 范围内**。随插件原样使用（非商用）没问题；**不得转售、不得商用、不得抽出来单独分发**。要商用请先取得作者书面许可，或者把这些片子删掉换成你自己的。

`assets/icon/` 里的三个图标属于代码，跟着 MIT 走。
```

#### 缺口

- 未测目标场景的等待、解码内存和失败恢复耗时
  **影响**：不能证明个性化收益超过长期负担，也不能给单位成本
  **进一步探讨**：用固定宿主、自有短视频与原生页做同条件启动/长时闲置对照，记录等待、CPU/GPU/内存及恢复时间。
- 未核实远程部署的宿主认证与跨站防护
  **影响**：不支持将改媒体与打开目录路由推广到不可信远程访问
  **进一步探讨**：若有远程需求，先核宿主认证中间件、来源校验及写操作权限。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 相比保留原生启动页与系统屏保，值得试用的增量是什么，如何验证新方向？

**研究主题**：贡献与相对优势、效果与总成本、工程质量与复用、新假设与验证、采用判断

#### 完整回答

相对什么也不装、直接保留 DSH 原生启动页，本组件把用户自选素材、启动交接与页面屏保放在宿主界面内，避免为了个人视觉偏好直接修改 DSH 源码。相对系统屏保，它能读取 DSH 启动覆盖层状态并让出，也能在设置卡中针对同一应用管理素材；代价是局限页面、耦合内部 DOM/API，且不具备系统锁屏的鉴权职责。这是有具体机制的界面集成增量，没有发现它改变核心开发任务分工或模型输出的证据，不能以视频种类和特效数量推导业务创新。

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 个性化启动 | 预框架脚本、素材选择及多种交接路径存在 | 实际主观满意度与总等待变化 |
| 闲置展示 | 系统闲置/窗口失焦双触发、点击/按键退出链存在 | 各桌面平台可靠性和长时资源量 |
| 故障诊断 | 首帧等待、清单超时、可读状态和日志 | 所有故障是否被识别、用户能否更快恢复 |
| 工作效率与隐私 | 没有任务加速或锁屏鉴权机制 | 不能据此宣称提高任务成功率或保护敏感会话 |

对已经有上述个人偏好、使用信任本地环境且能回滚 profile 的用户，可做小范围试用。先用一个自有短视频关闭声音、开启一次点击进入，保留屏保关闭，确认原生异常能看见且按键能退出；再单独试屏保。不要同时引入 Live2D 和写盘优化，否则无法判断哪条依赖出了问题。如果实际启动更慢到影响工作、一次点击无法放行、屏保误遮挡或占用不可接受，应关闭两个开关并刷新，必要时按安装方式撤销 patch/链接；敏感会话保护直接使用系统锁屏。

可借鉴的是显式区分 play 调用成功、首帧可见、媒体完成与客户端通知，避免把一个“ready”当作所有成功。新假设是让启动提示并列呈现“客户端已激活、素材仍播放、可跳过”，并对默认第一次点击仅解锁声音作即时解释，可能减少等待状态误读。现有代码已有诊断读数、慢启动提示和点击配置，故新增方向应评价这些日常提示是否比已有诊断更容易理解，而不是声称缺少观测。

最小验证采用同一宿主、相同视频和音频策略，分别模拟客户端先就绪、视频先结束、无首帧和音频拒绝，比较当前提示与改进提示。记录用户判断界面是否已可进入的错误数、实际多等时间、退出失误和提示干扰；若当前提示已足够、误判未降，或新增提示增加干扰，则否定该方向。该假设未经验证，不计入本版本贡献或采用收益。

#### 证据与依据

**依据 1 · 源码核查**：[entry.js:1674-1683](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/entry.js#L1674-L1683)

独立屏保脚本与可退出原生启动页的开关。

<details>
<summary>查看原文（10行）</summary>

```text
    table.push({ kind: 'script', placement: 'head', text: readSource(SCREENSAVER_PATH) })

    // The boot screen is the ONE row `enabled` governs. Switched off means the
    // kernel's own boot page shows: no overlay, and not one request for a clip.
    // Injecting a disabled screen and making the script bail out would look the same
    // and leave the whole overlay running; not injecting it at all is the only
    // version of "off" that is actually off.
    const bootInjected = settings.enabled
    if (bootInjected) {
      table.push({ kind: 'script', placement: 'head', text: readSource(BOOT_SCREEN_PATH) })
```

</details>

**依据 2 · 源码核查**：[src/boot-screen.js:349-357](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/boot-screen.js#L349-L357)

客户端通知与素材尾部交接状态。

```text
    clientReady: function () {
      if (namespace.bootedAt === null) namespace.bootedAt = Date.now()
      if (namespace.failed) return
      setState('ready')
      parts.hint.textContent = namespace.audioBlocked === null ? HINT_SOUND : HINT_SILENT
      // If the clip is already inside its final window the dissolve starts here,
      // rather than on whatever the next frame happens to be.
      if (typeof nudgeTail === 'function') nudgeTail()
      maybeEnter()
```

**依据 3 · 源码核查**：[src/boot-screen.js:905-922](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/boot-screen.js#L905-L922)

点击解锁声音与进入的分歧为假设提供依据。

<details>
<summary>查看原文（18行）</summary>

```text
    var media = parts.media()
    var finished = media !== null && typeof media.isEnded === 'function' && media.isEnded() === true
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
```

</details>

**依据 4 · 源码核查**：[src/boot-screen.js:973-992](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/boot-screen.js#L973-L992)

现有诊断状态构成“已有观测”的反证。

<details>
<summary>查看原文（20行）</summary>

```text
  // `?dshbootdiag=1` turns the hint line into a live readout of the clip and the
  // audio-policy outcome. Reported from the page itself so a stuck screen can be
  // diagnosed from a screenshot instead of a description: the fields say whether
  // frames are flowing, whether sound was allowed, and why not.
  function startDiagnostics() {
    if (globalThis.location.search.indexOf('dshbootdiag=1') < 0) return
    setInterval(function () {
      if (parts.root.getAttribute('data-state') === 'leaving') return
      var media = parts.media()
      // Every field is answered through the renderer and defaults to '-' when the
      // renderer has no such concept, so the line stays readable for an image or a
      // model instead of printing `undefined` for facts that do not exist.
      var el = media === null ? null : media.el()
      var num = function (value) { return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(1) : '?' }
      var text = 'diag kind=' + (media === null ? '-' : media.kind)
        + ' shown=' + (el === null ? '-' : (el.getAttribute('data-shown') || '-'))
        + ' muted=' + (media !== null && typeof media.isMuted === 'function' ? media.isMuted() : '-')
        + ' t=' + (media !== null && typeof media.currentTime === 'function' ? num(media.currentTime()) : '-')
        + ' dur=' + (media !== null && typeof media.duration === 'function' ? num(media.duration()) : '-')
        + ' paused=' + (media !== null && typeof media.isPaused === 'function' ? media.isPaused() : '-')
```

</details>

**依据 5 · 源码核查**：[src/screensaver.js:503-528](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/src/screensaver.js#L503-L528)

应用特有的覆盖让出与触发边界。

<details>
<summary>查看原文（26行）</summary>

```text
  // The boot overlay owns the screen until it hands over. A screensaver that covered
  // it would be the boot animation's own failure mode reproduced by a different
  // feature: the user would never see the animation they configured, and the hand-off
  // would happen underneath a layer they did not ask for. The overlay removes itself
  // when it is done, so this clears by itself a few seconds later.
  if (globalThis.__DSH_BOOT_ANIM__ !== undefined && globalThis.__DSH_BOOT_ANIM__.el?.parentNode) {
    return false
  }
  // A window nobody can see should not be covered. This is the half of "is anybody
  // looking" that the page CAN answer — but only once the answer has PERSISTED, because
  // in the Electron shell `visibilityState` flickers while the window is plainly on
  // screen. Believing each flip showed and hid the layer in turn, and the screen strobed.
  //
  // The other half is not answerable and is NOT attempted: a window merely COVERED by
  // another window still reports 'visible', because that is an operating-system fact the
  // renderer cannot see.
  if (hiddenFor() >= HIDDEN_GRACE_MS) return false
  // The OS half. Only a reading counts: 'starting' means the probe has not answered
  // yet, and 'unavailable' means it never will, so neither may be read as "idle".
  //
  // The threshold is resolved live, per check, for the same reason as the switch above: 闲置时长
  // is one of the fields the card promises is already in effect.
  if (idleStatus === 'ok' && lastIdleMs !== null && lastIdleMs >= idleThresholdMs()) return true
  // The focus half. Always available, and the only half on a platform without an OS
  // idle counter.
  if (blurredFor() >= idleThresholdMs()) return true
```

</details>

**依据 6 · 源码核查**：[tools/uninstall.sh:167-185](https://github.com/lxj5820/dsh-boot-animation/blob/b7786cd749ef18608340a8f5e2071a3656ebf009/tools/uninstall.sh#L167-L185)

移除链接和刷新/重启的退出路径。

<details>
<summary>查看原文（19行）</summary>

```text
say '=== 3/3 remove the directory link ==='
if [ -L "$LINK_PATH" ]; then
  target=$(readlink "$LINK_PATH")
  rm -f "$LINK_PATH" || fail "cannot remove the link at '$LINK_PATH'."
  say "  removed $LINK_PATH (was -> $target)"
elif [ -e "$LINK_PATH" ]; then
  say "  WARNING: $LINK_PATH is not a symlink, so it was left alone."
  say '  This script only removes the link it created; if that directory is a copy'
  say '  of the package, delete it yourself.'
else
  say '  no link present'
fi

say ''
say 'DONE. Refresh the page; restart dsh if this profile does not hot-reload its'
say 'patch layer.'
say 'The package directory itself was not touched.'
say "Backup: $BACKUP"
exit 0
```

</details>

#### 缺口

- 没有用户偏好、状态理解或原生页对照结果
  **影响**：试用价值为条件判断，新提示方向不能算已验证收益
  **进一步探讨**：按本题同条件实验记录误判、等待、退出失误与干扰，决定是否保留。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
