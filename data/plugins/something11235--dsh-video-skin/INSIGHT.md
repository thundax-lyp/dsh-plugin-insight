# dsh-video-skin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2f954a1](https://github.com/Something11235/dsh-video-skin/tree/2f954a1d6ac6140880f1a58438ed746f2f7f3da4)

<!-- BEGIN META -->
[![GitHub ★ 106](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=106&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Something11235/dsh-video-skin) [![npm 30d 28,047](https://img.shields.io/static/v1?label=npm+30d&message=28%2C047&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-video-skin) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-video-skin)
<!-- END META -->

> **功能**：为 DSH 添加循环视频背景、可跳过的启动动画和透明度及素材设置。

> **亮点**：把视频外观与错误退场、静音回退和背景控制组合，避免只靠裸CSS；这些是界面集成增量，非模型能力提升。[Q01](#research-q01)

> **主要限制**：容器类型合法不保证可播放，任意素材的可读性与功耗未测；背景实时配置和启动快照不同，共存只遵循一个壁纸标记。[Q02](#research-q02)

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
  - [Q01 · 启动注入、背景和动画如何实际进入页面？](#detail-section-11)
  - [Q02 · 媒体/配置写回和共存有哪些边界？](#detail-section-12)
  - [Q03 · 适合谁试用，成本和改进假设如何检验？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：想个性化本地DSH界面的用户可试用视频皮肤，合格结果是可跳过且正文仍易读。[Q01](#research-q01)

静态壁纸或手动CSS更简单；本组件增加可控启动视频与实时媒体设置，也增加解码和兼容维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 视频背景 | 个性化聊天外观 | 静音循环，资源和可读性需核对 |
| 启动动画 | 播短片后进入界面 | 可点击/按键跳过，有声失败退静音 |
| 媒体替换 | 上传本地视频 | 96MiB、容器类型检查不保证编码可播 |
| 自动让路 | 与标记壁纸共存 | 仅data-we-wallpaper约定，own会接管 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22与宿主索引注入/Web路由 | 必需，声明/源码 | 注入与素材服务 | 注入失败回原生外观 |
| 浏览器视频解码及本地素材 | 必需 | 播放 | 容器名合法仍可能黑屏，错误撤层 |
| DSH_HOME可写 | 保存设置/上传时必需 | 配置与媒体文件 | 明确写失败，不能称已保存 |
| 其他壁纸标记约定 | 共存可选 | auto让路 | 未标记的其他主题不保证协调 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装后完整重启 | 启动可跳过，宿主正常进入 |
| 设置 | 用户选媒体与透明度 | 背景实时核对，启动媒体再重启 |
| 阅读 | 用户核对对比度和资源 | 不以旧素材指标替代当前观感 |
| 恢复 | 点击跳过、关闭槽或恢复默认 | 配置先备份，再重启确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 视频存储和安装资源 | 选素材、重启和可读性检查 | 金额及时间未知 |
| 持续 | 解码CPU/GPU、电量，量未知 | 调透明度与注意力负担 | 无模型增效依据 |
| 失败恢复 | 重新下载或替换本地素材 | 跳过、关闭与恢复配置 | 直接写配置需备份 |
| 退出 | 上传媒体可能保留 | 停用并完整重启 | 不假定自动清理所有文件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 视频外观 | 注入与DOM创建 | 当前宿主播放效果 |
| 失败退路 | 重试、静音、跳过和撤层 | 所有浏览器/素材兼容 |
| 阅读与性能 | 有遮罩与隐藏暂停机制 | 任意素材可读性与功耗 |

> **思考**：容器类型合法不保证可播放，任意素材的可读性与功耗未测；背景实时配置和启动快照不同，共存只遵循一个壁纸标记。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把视频外观与错误退场、静音回退和背景控制组合，避免只靠裸CSS；这些是界面集成增量，非模型能力提升。[Q01](#research-q01)

启动注入错误隔离、加载失败撤透明层和音频意图与跳过分离值得借鉴；直接配置写回及启动/实时双状态需要维护，文件类型不构成解码验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

容器类型合法不保证可播放，任意素材的可读性与功耗未测；背景实时配置和启动快照不同，共存只遵循一个壁纸标记。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用短视频和保守透明度核对阅读与发热，遇问题关闭对应槽，完整重启后确认回到默认外观。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

媒体和失败分支已有源码支持；运行、任意素材可读性和资源效果未测，自适应方案是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/injections.js、lib/config.js、lib/media.js、runtime/skin.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查索引注入、配置/上传、启动及背景关键失败路径；未完整审计主题自动切换、所有控件或网络部署访问控制，不运行目标代码。
- 下一步：后续同机器同文字任务比较静态和视频的读错、启动时间和功耗，任一关键体验退步即停止。

**分析版本**

- **仓库**：[Something11235/dsh-video-skin](https://github.com/Something11235/dsh-video-skin)
- **版本号**：0.1.6（[固定提交 2f954a1](https://github.com/Something11235/dsh-video-skin/tree/2f954a1d6ac6140880f1a58438ed746f2f7f3da4)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是以动态亮度调遮罩或暂停背景，兼顾视频与阅读；固定任务对照若读错不降或资源负担过大就放弃。[Q03](#research-q03)

后续同机器同文字任务比较静态和视频的读错、启动时间和功耗，任一关键体验退步即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 4448 | 3152 | 1021 | — |
| .md | source | 3 | 1077 | — | — | 13781 |
| .mjs | source | 12 | 3484 | 2714 | 570 | — |
| .mjs | test | 4 | 2638 | 2172 | 217 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Something11235/dsh-video-skin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/Something11235/dsh-video-skin/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Something11235/dsh-video-skin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：视频背景和启动动画如何接入DSH，失败、媒体替换与阅读可用性如何约束收益？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 启动注入、背景和动画如何实际进入页面？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

它面向希望个性化DSH界面的用户，目标是有可跳过的启动短片和不妨碍阅读的循环背景。与静态壁纸或修改宿主CSS相比，组件通过webserver/index-inject一次加入style和内联runtime脚本，配置先写全局，宿主webServer路由提供视频和实时配置。浏览器启动层监听ended、错误与无帧/无限时长上限，音频起播失败可退静音，点击或Escape等按键可跳过；背景是muted loop video，延后加载、隐藏页面暂停，加载错误撤掉半透明层。贡献是把媒体和启动降级/背景控制连接起来，不是改进模型任务效果。作者声明桌面注入表在启动时固定，所以新安装及启动素材变化应完整重启；该宿主行为本次未独立运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:262-303](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/index.js#L262-L303)

注入和配置路由接线。

<details>
<summary>查看原文（42行）</summary>

```text
  ctx.on('webserver/index-inject', (table) => {
    if (!Array.isArray(table)) return
    try {
      const { client, warnings } = current()
      for (const warning of warnings) warn(warning)
      const rows = buildInjectionRows({
        clientConfig: client,
        cssText: readRuntime('skin.css'),
        jsText: readRuntime('skin.js'),
      })
      table.push(...rows)
    } catch (error) {
      // 注入行生成失败只是"没有背景/没有开机动画"，绝不能让索引渲染失败。
      warn(`注入行生成失败，页面将回落到原生外观：${describe(error)}`)
    }
  })

  // ── ② 路由：webServer 是可选能力，晚到就晚接，不阻塞 apply ──
  ctx.inject(['webServer'], (child) => {
    child.effect(() => {
      /** @type {Array<() => void>} */
      const disposers = []

      disposers.push(
        child.webServer.register({
          kind: 'exact',
          path: CONFIG_ROUTE,
          handler: (req, res) => {
            let payload
            try {
              const { client, warnings } = current()
              payload = JSON.stringify({ ...client, warnings })
            } catch (error) {
              payload = JSON.stringify({ error: describe(error) })
            }
            res.writeHead(200, {
              'Content-Type': 'application/json; charset=utf-8',
              'Content-Length': Buffer.byteLength(payload),
              'Cache-Control': 'no-store',
            })
            res.end(payload)
          },
```

</details>

**依据 2 · 源码核查**：[lib/injections.js:28-40](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/lib/injections.js#L28-L40)

样式先于包含配置的脚本。

<details>
<summary>查看原文（13行）</summary>

```text
 */
export function buildInjectionRows(input) {
  const bootstrap = `globalThis.${BOOTSTRAP_GLOBAL}=${toInlineJson(input.clientConfig)};`
  return [
    // ① 样式先到：覆盖层的底色/层级、以及聊天背景的表面半透明规则。
    { kind: 'style', text: input.cssText },
    // ② 运行时。placement:'body' —— 在 dsh web 的直出形态里，这一行落在 <body> 开头，
    //    早于 head 里那个 type="module" 的 shell 脚本执行（模块脚本是 defer 语义），
    //    所以覆盖层在原生启动页出现之前就占住了视口；桌面壳只拿它当选 head/body 的
    //    落点，执行时机由 IPC 决定，同样是"应用挂载之前"。
    { kind: 'script', placement: 'body', text: `${bootstrap}\n${input.jsText}` },
  ]
}
```

</details>

**依据 3 · 源码核查**：[runtime/skin.js:635-677](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/runtime/skin.js#L635-L677)

结束、错误重试与无帧上限。

<details>
<summary>查看原文（43行）</summary>

```text
      // 时长未知（MediaRecorder 的 WebM 会报 duration=Infinity）永远不触发 ended，
      // 无限等下去会把用户永久扣在这块屏上，所以只有这一种情况给一个上界。
      var endless = null
      video.addEventListener('loadedmetadata', function () {
        if (isFinite(video.duration)) return
        endless = timer(function () {
          markClipDone('endless')
        }, endlessMs)
      })
      video.addEventListener('ended', function () {
        if (endless !== null) global.clearTimeout(endless)
        markClipDone('ended')
      })
      // 素材出错时**先重试一次**再放弃。
      //
      // 为什么值得重试：宿主刚启动时正忙着激活插件，这条本地素材路由偶尔会应答不上
      // （连接被重置 / 一时 5xx）。早先一次 error 就直接 markClipDone ⇒ 界面一就绪
      // 立刻退场，表现就是"开机动画有时候还没放完就切了"。重试一次能吃掉绝大多数
      // 这种瞬时抖动，而且只重试一次，不会把坏素材拖成长等待。
      var errorRetries = 0
      video.addEventListener('error', function () {
        global.clearTimeout(advance)
        if (endless !== null) global.clearTimeout(endless)
        var code = video.error ? video.error.code : 0
        api.state.failures.push('video-error:' + code)
        if (errorRetries >= 1) {
          markClipDone('error')
          return
        }
        errorRetries += 1
        api.state.failures.push('video-error-retry')
        try {
          video.src = src
          var again = video.play()
          if (again && typeof again.catch === 'function') again.catch(noop)
        } catch (error) {
          markClipDone('error-retry-throw')
        }
        // 重试也给一个新的"一帧都没出"看门狗，否则第一只已经被清掉了。
        advance = timer(function () {
          api.state.failures.push('no-frame-after-retry')
          markClipDone('no-frame-after-retry')
        }, noFrameMs)
```

</details>

**依据 4 · 源码核查**：[runtime/skin.js:706-731](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/runtime/skin.js#L706-L731)

有声失败退静音。

<details>
<summary>查看原文（26行）</summary>

```text
      var fallbackToMuted = function (reason) {
        state.audioBlocked = reason
        state.silenced = true
        try {
          video.muted = true
          video.setAttribute('muted', '')
        } catch (error) {
          /* 尽力而为 */
        }
        markAudioBlocked(reason)
        var retry = video.play()
        if (retry && typeof retry.catch === 'function') {
          retry.catch(function () {
            api.state.failures.push('muted-play-refused')
            markClipDone('muted-play-refused')
          })
        }
      }

      if (state.silenced) {
        var muted = video.play()
        if (muted && typeof muted.catch === 'function') {
          muted.catch(function () {
            api.state.failures.push('muted-play-refused')
            markClipDone('muted-play-refused')
          })
```

</details>

**依据 5 · 源码核查**：[runtime/skin.js:800-842](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/runtime/skin.js#L800-L842)

点击和按键跳过。

<details>
<summary>查看原文（43行）</summary>

```text
    // 点击/触摸/按键：任何阶段都立刻跳过。**只有声音开关例外** —— 它的唯一职责是开声音，
    // 所以它有自己的命中区，点它不会跳过（两个意图不互相踩）。
    root.addEventListener(
      'pointerdown',
      function (event) {
        if (onSoundControl(event)) return
        if (event && typeof event.preventDefault === 'function') event.preventDefault()
        if (!state.leaving) enter(skipFadeMs, 'skip')
      },
      true,
    )
    root.addEventListener('click', function (event) {
      if (onSoundControl(event)) return
      if (event && typeof event.preventDefault === 'function') event.preventDefault()
      if (!state.leaving) enter(skipFadeMs, 'skip')
    })

    /**
     * 命中测试：事件有没有落在声音开关上。
     *
     * 覆盖层是在 **capture 阶段**监听 pointerdown 的，所以它的处理器永远早于按钮自己的处理器；
     * 只靠 `stopPropagation` 是拦不住的（按钮根本还没轮到）。判据只能看事件目标本身。
     * @param {any} event 事件。
     * @returns {boolean} 是否属于声音开关。
     */
    function onSoundControl(event) {
      var node = event && event.target
      return !!(node && typeof node.closest === 'function' && node.closest('.dsvs-boot-sound'))
    }

    soundButton.addEventListener('pointerdown', function (event) {
      if (event && typeof event.stopPropagation === 'function') event.stopPropagation()
    })
    soundButton.addEventListener('click', function (event) {
      if (event && typeof event.stopPropagation === 'function') event.stopPropagation()
      if (event && typeof event.preventDefault === 'function') event.preventDefault()
      toggleSound()
    })

    var onKey = function (event) {
      if (!event || state.leaving) return
      if (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter') {
        enter(skipFadeMs, 'skip-key')
```

</details>

**依据 6 · 源码核查**：[runtime/skin.js:1200-1266](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/runtime/skin.js#L1200-L1266)

背景创建、错误撤层和隐藏暂停。

<details>
<summary>查看原文（67行）</summary>

```text
    var layer = el('div', null)
    layer.id = 'dsvs-backdrop'
    var video = doc.createElement('video')
    video.id = 'dsvs-backdrop-video'
    video.muted = true
    video.defaultMuted = true
    video.loop = true
    video.playsInline = true
    video.autoplay = false
    video.preload = 'none'
    video.setAttribute('playsinline', '')
    video.setAttribute('muted', '')
    video.setAttribute('aria-hidden', 'true')
    var veil = el('div', null)
    veil.id = 'dsvs-backdrop-veil'

    layer.appendChild(video)
    layer.appendChild(veil)
    doc.body.insertBefore(layer, doc.body.firstChild)
    doc.documentElement.setAttribute('data-dsvs', 'on')
    // 对外只读标记：别的壁纸插件据此避让，不用猜 #dsvs-backdrop 在不在。
    doc.documentElement.setAttribute(BACKGROUND_ATTR, 'on')
    // 用**已经合并过运行期配置**的值来算，所以不会先建好再跳一下。
    applyVisuals(liveCfg)

    backdrop = { layer: layer, video: video }

    video.addEventListener('loadeddata', function () {
      video.setAttribute('data-shown', '1')
    })
    video.addEventListener('error', function () {
      // 素材拿不到就必须撤掉半透明表面，否则界面会变成"没有背景、字还发灰"。
      api.state.failures.push('backdrop-error:' + (video.error ? video.error.code : 0))
      teardownBackdrop()
    })

    var delayMs = num(bg.delayMs, 1200, 0, 60000)
    var playbackRate = num(bg.playbackRate, 1, 0.25, 4)

    var load = function () {
      if (backdrop === null || backdrop.video !== video) return
      try {
        video.playbackRate = playbackRate
      } catch (error) {
        /* 有的实现不允许在 metadata 之前设置 */
      }
      video.src = src
      var played = video.play()
      if (played && typeof played.catch === 'function') played.catch(noop)
    }
    // 延后加载：开机阶段把带宽和 CPU 留给界面本身。
    var delayTimer = global.setTimeout(load, delayMs)

    var onVisibility = function () {
      if (backdrop === null) return
      if (doc.hidden === true) {
        try {
          video.pause()
        } catch (error) {
          /* 已经停了 */
        }
      } else {
        var played = video.play()
        if (played && typeof played.catch === 'function') played.catch(noop)
      }
    }
    doc.addEventListener('visibilitychange', onVisibility)
```

</details>

**依据 7 · 作者声明**：[README.md:65-70](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/README.md#L65-L70)

作者区分背景实时与启动快照。

```text
- **Your media, your rules.** The panel has one row per asset: turn the boot animation off and keep
  the background (or the other way round), or hit 更换… to upload your own mp4/webm/ogv (≤ 96 MiB).
  Uploads land in `$DSH_HOME/dsh-video-skin-media/` with a content-hash filename, so a replaced file
  can never be served from cache; 默认 restores the bundled asset. Background changes apply live,
  boot changes after a DSH restart (the boot overlay comes from a startup snapshot). Config accepts
  either a package-relative or an absolute `file`. Verified by `scripts/verify-media.mjs` (15 assertions).
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 媒体/配置写回和共存有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

上传只按MIME/扩展名接受mp4/webm/ogv，单文件96MiB，流式写临时文件并算内容hash，完成后改名再保存配置；容器名合法不证明编码器可播放，仍依赖浏览器解码。配置允许用户指定绝对文件，只有相对路径才限制包内，不能把文件路由泛称为只读包内资源。透明度写回只修改白名单字段，但直接writeFileSync而非临时文件原子替换，多处同时改配置或进程中断的保全未证实。auto背景共存只观察data-we-wallpaper这一约定，own会接管；它不是全插件冲突仲裁。减少动态效果在背景创建前检查，不能由此宣称启动动画也自动禁用。可读性取决于素材与透明度，作者旧素材的对比度数据不能推广为任意上传视频。

#### 证据与依据

**依据 1 · 源码核查**：[lib/media.js:24-38](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/lib/media.js#L24-L38)

槽位、96MiB与容器类型。

<details>
<summary>查看原文（15行）</summary>

```text
export const MEDIA_SLOTS = Object.freeze(['boot', 'background'])

/** 单个文件的上限（字节）。够放 4K 短片，又不至于让一次误选把磁盘写满。 */
export const MEDIA_LIMIT_BYTES = 96 * 1024 * 1024

/** 浏览器能直接播的容器 → 统一扩展名。 */
const EXT_BY_TYPE = Object.freeze({
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/ogg': '.ogv',
  'video/ogv': '.ogv',
})

/** 允许的扩展名（用户可能上传没有 MIME 的文件，靠扩展名兜底）。 */
const ALLOWED_EXT = Object.freeze(['.mp4', '.webm', '.ogv'])
```

</details>

**依据 2 · 源码核查**：[lib/media.js:66-82](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/lib/media.js#L66-L82)

类型推断和内容hash命名。

<details>
<summary>查看原文（17行）</summary>

```text
export function pickExtension(filename, contentType) {
  const type = typeof contentType === 'string' ? contentType.split(';')[0].trim().toLowerCase() : ''
  if (EXT_BY_TYPE[type] !== undefined) return EXT_BY_TYPE[type]
  const ext = path.extname(typeof filename === 'string' ? filename : '').toLowerCase()
  return ALLOWED_EXT.includes(ext) ? ext : undefined
}

/**
 * 算上传落盘的目标路径。
 *
 * 文件名里带内容哈希，换素材时 URL 一定变（否则浏览器会拿缓存的旧视频）。
 * @param {{ homeDir: string, slot: 'boot' | 'background', extension: string, digest: string }} input 输入。
 * @returns {string} 绝对路径。
 */
export function mediaTargetPath(input) {
  const digest = String(input.digest).replace(/[^a-f0-9]/giu, '').slice(0, 12) || 'unnamed'
  return path.join(mediaRoot(input.homeDir), `${input.slot}-${digest}${input.extension}`)
```

</details>

**依据 3 · 源码核查**：[index.js:832-878](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/index.js#L832-L878)

上传限额、背压、临时文件改名、改名失败与配置持久化调用。

<details>
<summary>查看原文（47行）</summary>

```text
            const hash = createHash('sha1')
            let received = 0
            sink.on('error', (error) => fail(500, { ok: false, error: `写文件失败：${describe(error)}` }))
            req.on('aborted', () => fail(400, { ok: false, error: 'upload aborted' }))
            req.on('error', () => fail(400, { ok: false, error: 'request stream failed' }))
            req.on('data', (chunk) => {
              if (failed) return
              received += chunk.length
              if (received > MEDIA_LIMIT_BYTES) {
                fail(413, { ok: false, error: `文件太大（上限 ${Math.round(MEDIA_LIMIT_BYTES / 1024 / 1024)} MiB）` })
                req.destroy()
                return
              }
              hash.update(chunk)
              if (sink !== null && !sink.write(chunk)) {
                req.pause()
                sink.once('drain', () => req.resume())
              }
            })
            req.on('end', () => {
              if (failed || sink === null) return
              if (received === 0) {
                fail(400, { ok: false, error: 'empty file' })
                return
              }
              sink.end(() => {
                if (failed) return
                const target = mediaTargetPath({
                  homeDir,
                  slot,
                  extension,
                  digest: hash.digest('hex'),
                })
                try {
                  fs.mkdirSync(path.dirname(target), { recursive: true })
                  fs.rmSync(target, { force: true })
                  fs.renameSync(tempPath, target)
                } catch (error) {
                  fail(500, { ok: false, error: `保存失败：${describe(error)}` })
                  return
                }
                persist(
                  { [slot]: { file: target, enabled: true } },
                  `素材已更新：${slot} → ${path.basename(target)}（${Math.round(received / 1024)} KiB）`,
                )
              })
            })
```

</details>

**依据 4 · 源码核查**：[lib/config.js:194-206](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/lib/config.js#L194-L206)

透明度白名单与直接写文件。

<details>
<summary>查看原文（13行）</summary>

```text
export function writeOverride(input) {
  const file = path.join(input.homeDir, HOME_CONFIG_FILE)
  const current = readJsonFile(file) ?? {}
  /** @type {Record<string, unknown>} */
  const background = isPlainObject(current.background) ? { ...current.background } : {}
  for (const key of OVERRIDE_KEYS) {
    const value = input.patch[key]
    if (typeof value === 'number' && Number.isFinite(value)) background[key] = value
  }
  const next = { ...current, background }
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  return { file, raw: next }
```

</details>

**依据 5 · 源码核查**：[lib/config.js:349-365](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/lib/config.js#L349-L365)

绝对路径与包内相对路径不同。

<details>
<summary>查看原文（17行）</summary>

```text
  const resolveAsset = (key, section, defaults, route) => {
    const relative = typeof section.file === 'string' && section.file !== '' ? section.file : defaults.file
    let absolute
    try {
      // 绝对路径 = 用户自己的素材（上传到 `$DSH_HOME/dsh-video-skin-media/`，或者他直接写了自己盘上的路径）。
      // 包内相对路径仍然走 `resolveInsidePackage`，防止 `../` 逃逸。
      absolute = path.isAbsolute(relative) ? path.normalize(relative) : resolveInsidePackage(options.packageRoot, relative)
    } catch (error) {
      warnings.push(`${key}.file: ${error.message}`)
      return undefined
    }
    try {
      const stat = fs.statSync(absolute)
      if (!stat.isFile() || stat.size <= 0) {
        warnings.push(`${key}.file: not a non-empty file (${relative})`)
        return undefined
      }
```

</details>

**依据 6 · 源码核查**：[runtime/skin.js:1096-1123](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/runtime/skin.js#L1096-L1123)

共存只看约定标记和own。

<details>
<summary>查看原文（28行）</summary>

```text
  function shouldYieldToWallpaper() {
    var bg = isObject(liveCfg.background) ? liveCfg.background : {}
    if (bg.mode === 'own') return false
    return otherWallpaperActive()
  }

  /** 把"是否在让路"记进运行期状态（日志/验收脚本都读它）。 */
  function markYield(yielding) {
    api.state.yielded = yielding === true
    if (yielding === true) api.state.reason = 'wallpaper-occupied'
    else if (api.state.reason === 'wallpaper-occupied') api.state.reason = 'active'
  }

  /**
   * 壁纸标记变了之后重新裁决：该让就让（撤层），该接就接（重建）。
   * 开机动画不在这一层，所以完全不受影响。
   */
  function syncWallpaperYield() {
    var bg = isObject(liveCfg.background) ? liveCfg.background : {}
    // 统一在这里裁决：三种情况都要处理（让路 / 接管时补建 / 什么都不用干）。
    var yielding = bg.mode !== 'own' && otherWallpaperActive()
    if (yielding) {
      if (backdrop !== null) detachBackdropMedia()
    } else if (backdrop === null && !backdropStarting && bg.enabled !== false) {
      // 用户点了「始终接管」，或者壁纸撤了 —— 把我们的层补回来。
      startBackdrop()
    }
    markYield(yielding)
```

</details>

**依据 7 · 源码核查**：[runtime/skin.js:1191-1197](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/runtime/skin.js#L1191-L1197)

减少动态效果只位于背景路径。

```text
    // 尊重系统的"减少动态效果"：常驻循环动画是这块设置主要管的东西。
    try {
      if (typeof global.matchMedia === 'function' && global.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }
    } catch (error) {
      /* 拿不到就照常播 */
```

**依据 8 · 源码核查**：[index.js:695-704](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/index.js#L695-L704)

改名后的配置写回失败返回500；成功才返回当前状态。

<details>
<summary>查看原文（10行）</summary>

```text
            /** @param {Record<string, Record<string, unknown>>} patch 素材改动。 */
            const persist = (patch, notice) => {
              try {
                writeMediaConfig({ homeDir, patch })
              } catch (error) {
                reply(500, { ok: false, error: `写配置失败：${describe(error)}` })
                return
              }
              if (typeof notice === 'string') info(notice)
              reply(200, state())
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 适合谁试用，成本和改进假设如何检验？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合愿意为外观承担视频解码负担、能随时关闭背景的本地DSH用户小范围试用；单纯要提高编码效率的人没有收益依据。首次需Node>=22、宿主注入及Web路由支持、可播放本地素材和可写DSH_HOME；不需要另付模型API，但持续有解码CPU/GPU、电量、磁盘和注意力成本，未测金额/功耗。失败时跳过启动层、关闭媒体槽或恢复默认，完整重启确认；手改配置先备份，不把切换背景生效推定启动素材同步。由任意视频会改变阅读对比度可提出未验证假设：自动在亮度变化大时加深遮罩或暂停背景，保持正文可读，可能比固定透明度更可用。对照静态界面、固定视频和自适应方案，以同文字任务记录读错、完成时间与资源消耗；若读错不降或资源增加过大就推翻。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:42-44](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/package.json#L42-L44)

Node声明。

```text
  "engines": {
    "node": ">=22"
  },
```

**依据 2 · 源码核查**：[index.js:695-704](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/index.js#L695-L704)

写配置失败明确返回。

<details>
<summary>查看原文（10行）</summary>

```text
            /** @param {Record<string, Record<string, unknown>>} patch 素材改动。 */
            const persist = (patch, notice) => {
              try {
                writeMediaConfig({ homeDir, patch })
              } catch (error) {
                reply(500, { ok: false, error: `写配置失败：${describe(error)}` })
                return
              }
              if (typeof notice === 'string') info(notice)
              reply(200, state())
```

</details>

**依据 3 · 源码核查**：[runtime/skin.js:1230-1266](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/runtime/skin.js#L1230-L1266)

错误撤层、延迟和暂停是具体退路。

<details>
<summary>查看原文（37行）</summary>

```text
    video.addEventListener('error', function () {
      // 素材拿不到就必须撤掉半透明表面，否则界面会变成"没有背景、字还发灰"。
      api.state.failures.push('backdrop-error:' + (video.error ? video.error.code : 0))
      teardownBackdrop()
    })

    var delayMs = num(bg.delayMs, 1200, 0, 60000)
    var playbackRate = num(bg.playbackRate, 1, 0.25, 4)

    var load = function () {
      if (backdrop === null || backdrop.video !== video) return
      try {
        video.playbackRate = playbackRate
      } catch (error) {
        /* 有的实现不允许在 metadata 之前设置 */
      }
      video.src = src
      var played = video.play()
      if (played && typeof played.catch === 'function') played.catch(noop)
    }
    // 延后加载：开机阶段把带宽和 CPU 留给界面本身。
    var delayTimer = global.setTimeout(load, delayMs)

    var onVisibility = function () {
      if (backdrop === null) return
      if (doc.hidden === true) {
        try {
          video.pause()
        } catch (error) {
          /* 已经停了 */
        }
      } else {
        var played = video.play()
        if (played && typeof played.catch === 'function') played.catch(noop)
      }
    }
    doc.addEventListener('visibilitychange', onVisibility)
```

</details>

**依据 4 · 源码核查**：[lib/config.js:194-206](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/lib/config.js#L194-L206)

备份建议的直接写配置依据。

<details>
<summary>查看原文（13行）</summary>

```text
export function writeOverride(input) {
  const file = path.join(input.homeDir, HOME_CONFIG_FILE)
  const current = readJsonFile(file) ?? {}
  /** @type {Record<string, unknown>} */
  const background = isPlainObject(current.background) ? { ...current.background } : {}
  for (const key of OVERRIDE_KEYS) {
    const value = input.patch[key]
    if (typeof value === 'number' && Number.isFinite(value)) background[key] = value
  }
  const next = { ...current, background }
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  return { file, raw: next }
```

</details>

**依据 5 · 作者声明**：[README.md:111-123](https://github.com/Something11235/dsh-video-skin/blob/2f954a1d6ac6140880f1a58438ed746f2f7f3da4/README.md#L111-L123)

作者对固定素材透明度和阅读权衡的说明。

<details>
<summary>查看原文（13行）</summary>

```text
`surface` (dark theme) and `surfaceLight` (light theme) are the two knobs that trade picture strength
against readability; `veil` / `veilLight` are the scrims over the video. They are deliberately different
per theme: text is light in dark mode and dark in light mode, and this asset is dark (`YAVG ≈ 0.25`), so
an equally thin *white* surface drops dark text below 3:1. Measured in a real browser:

| `surface` | `surfaceLight` | dark min / p5 / median | light min / p5 / median |
| --- | --- | --- | --- |
| **0.2** | **0.6** | **2.49 / 6.81 / 16.05** | **7.74 / 7.91 / 8.72** |
| 0.2 | 0.4 | 2.52 / 6.85 / 16.06 | 4.34 / 4.52 / 5.37 |
| 0.05 | 0.6 | 1.53 / 4.89 / 15.24 | 7.38 / 7.56 / 8.37 |
| 0 | 0.55 | 1.22 / 4.14 / 14.71 | 5.87 / 6.06 / 6.90 |

p5 (the 95% of frame area) is the meaningful readability number; `--sweep` prints this table live.
```

</details>

#### 缺口

- 没有任意上传素材下的阅读、功耗和启动时间对照。
  **影响**：不能认为外观收益不影响效率或对比度已普遍合格。
  **进一步探讨**：同机器和文字任务比较默认界面与所选视频，记录读错、时间、GPU和耗电。
- 自适应遮罩假设尚未验证。
  **影响**：不能把它列为当前已实现能力。
  **进一步探讨**：固定明暗切换素材对照遮罩策略，检查读错与额外资源。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
