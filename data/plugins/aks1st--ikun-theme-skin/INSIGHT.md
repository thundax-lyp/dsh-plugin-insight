# ikun-theme-skin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c0e59e6](https://github.com/AKS1st/ikun-theme-skin/tree/c0e59e61332a5e3317365848f73240308d9d9345)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/ikun-theme-skin)
<!-- END META -->

> **实现功能**：给 DSH Web 添加三套 IKUN 配色、壁纸、音乐、发送音效与娱乐化 UI。

> **核心亮点**：把主题、媒体和互动彩蛋打包为 Web 主题体验，而非模型或工作流能力提升。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：启用时主动 setTheme('ikun-day')，清理未恢复先前偏好；远程媒体部分追踪 main/master，长期可用性不固定。详见[Q03](#research-q03)。

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
  - [Q01 · 谁会用，提供什么体验增量？](#detail-section-11)
  - [Q02 · 主题/壁纸/音效如何触发与清理？](#detail-section-12)
  - [Q03 · 默认主题和远程素材有什么边界？](#detail-section-13)
  - [Q04 · 成本、采用和验证怎样界定？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户在 DSH Web 中自愿使用娱乐主题。

使用 DSH 自带浅色/深色/跟随系统外观；该插件加娱乐视觉和声音。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 主题/壁纸 | 个性化外观 | 主动设置默认主题、远程图 |
| 音频/彩蛋 | 娱乐反馈 | 浏览器策略/远程源 |
| 设置/slot | 控制和挂载 UI | 宿主接口兼容未验 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 不满足时 |
| --- | --- | --- |
| DSH Web theme/slots | 主题与 UI | 功能不加载 |
| timer/styles/React | 轮播、样式与组件 | 部分功能退化 |
| 第三方媒体服务器 | 图片/音频 | 背景可渐变，音频可能失败 |
| 用户浏览器音频策略 | 自动播放音效 | play 可能拒绝 |


#### 使用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装 | 添加 bundle 到 web profile | 客户端加载 |
| 选择 | 切换三主题/音量 | 用户偏好明确 |
| 使用 | 看壁纸/听音乐与发送音效 | 不干扰工作 |
| 退出 | 卸载/停用 | 原界面和偏好检查 |

**效果与成本**

#### 成本

| 阶段 | 资源/人工 | 未知 |
| --- | --- | --- |
| 安装 | profile/重启或动态注入 | 宿主兼容 |
| 使用 | 动画、7秒图片切换、音频和网络 | CPU/带宽/打扰 |
| 退出 | 卸载并核原偏好 | 宿主如何处理失效主题 |


#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 三主题/UI | 注册与 slot 实现 | 实际布局/可读性 |
| 壁纸/音频 | 远程素材与事件 | 加载/自动播放成功 |
| 卸载 | disposer 移除注册/CSS | 原偏好是否恢复 |

> **思考**：启用时主动 setTheme('ikun-day')，清理未恢复先前偏好；远程媒体部分追踪 main/master，长期可用性不固定。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把主题、媒体和互动彩蛋打包为 Web 主题体验，而非模型或工作流能力提升。详见[Q01](#research-q01)、[Q02](#research-q02)。

把主题、媒体和互动彩蛋打包为 Web 主题体验，而非模型或工作流能力提升。详见[Q01](#research-q01)、[Q02](#research-q02)。

宿主端为空，浏览器端的 React、theme、slots、timer、styles 为关键依赖；异步音频拒绝有处理，外部素材仍影响离线和稳定性。

<a id="detail-section-5"></a>

### 1.4 主要限制

启用时主动 setTheme('ikun-day')，清理未恢复先前偏好；远程媒体部分追踪 main/master，长期可用性不固定。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人隔离试用，需能关闭音效并核原外观偏好；共享环境先经用户选择。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

功能与副作用路径有固定源码支持；真实显示、音频策略、性能和卸载后主题偏好未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、client.js、src/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码阅读 README、package、host/client 与动态版源文件；未运行插件、媒体或 DSH Web。
- 下一步：在不同原偏好、窄屏、媒体失效、浏览器静音策略、停用/重启下验证 UI 和偏好状态，测资源。

**分析版本**

- **仓库**：[AKS1st/ikun-theme-skin](https://github.com/AKS1st/ikun-theme-skin)
- **版本号**：1.0.0（[固定提交 c0e59e6](https://github.com/AKS1st/ikun-theme-skin/tree/c0e59e61332a5e3317365848f73240308d9d9345)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

改为显式选择、可恢复原偏好并固定/降级素材，比较启停状态保持和加载/性能；本版未实现。详见[Q04](#research-q04)。

在不同原偏好、窄屏、媒体失效、浏览器静音策略、停用/重启下验证 UI 和偏好状态，测资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1249 | 1139 | 110 | — |
| .md | source | 2 | 171 | — | — | 1973 |
| .mjs | source | 1 | 73 | 43 | 23 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/ikun-theme-skin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/ikun-theme-skin/issues?q=is%3Aissue+created%3A2026-09-22T05%3A33%3A21.324Z..2026-10-22T05%3A33%3A21.324Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/ikun-theme-skin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A33%3A21.324Z..2026-10-22T05%3A33%3A21.324Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实纯客户端主题、音频/壁纸、宿主 UI 改动、外部素材和退出边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会用，提供什么体验增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向想在 DSH Web 中使用 IKUN 娱乐化视觉/音效的个人用户。固定版声明三套配色、全屏壁纸轮播、主题音乐与发送音效、右下角角色、回复彩蛋和设置页。宿主 index.apply 为空，浏览器半注册主题、替换外观设置行并挂载输入监听、侧栏动作及 overlay。相对普通系统主题，它把多种媒体与交互彩蛋集中为可启停的主题体验；没有提升模型能力、代码质量或业务效率的证据。合格体验需视觉可读、无自动音效打扰、媒体加载失败可退化、停用后恢复原界面。README 为作者功能描述，尚非真实宿主/用户验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-17](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/README.md#L1-L17)

作者列三主题、壁纸、发送音效、音乐盒及彩蛋。

<details>
<summary>查看原文（17行）</summary>

```text
# 🏀 IKUN 主题皮肤（DeepSeek Harness）

> 一位虔诚的 ikun 收集与整理 · 唱跳RAP篮球 · 整活向主题皮肤

为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 制作的 **ikun 主题皮肤插件**（标准安装为静态 bundle，也可作为动态插件运行）。集成主题、全屏壁纸、音乐盒、发送音效与坤坤彩蛋，一键把整个界面变成坤味十足的样子。

## ✨ 功能一览

| 功能 | 说明 |
| --- | --- |
| 🎨 **三套主题** | 星蓝·昼（浅色，默认）/ 星蓝·夜（深蓝舞台）/ 背带裤黑金；已**插入系统外观主题列表**（设置 → 通用），与系统浅色/深色/跟随系统并列，互不冲突 |
| 🖼 **全屏壁纸轮播** | 蔡徐坤真实照片（Wikimedia Commons）+ 经典模因图铺满整个界面作为底图，每 7 秒自动切换，图片加载失败自动落到渐变底色 |
| 📨 **发送音效** | 点击「发送」或按回车发送消息时，自动播放坤坤「你干嘛~哎哟」经典台词 |
| 🎵 **音乐盒** | 基尼太美主题音乐：播放/暂停/再来亿遍/音量，播放时坤坤跳舞 + 手里篮球旋转 |
| 💃 **右下角小坤坤** | 常驻右下角，平时轻晃，播放音乐时狂舞转球 |
| ✨ **回复彩蛋** | 每条 AI 回复后随机出现坤坤脸 / 小鸡 / 🏀 / ⭐ / 🎤 |
| ⚙️ **设置页** | 设置面板新增「IKUN 主题」页：主题切换、壁纸手动切换、音乐控制、设计说明 |
```

</details>

**依据 2 · 源码核查**：[index.js:1-6](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/index.js#L1-L6)

宿主 apply 为空，功能在客户端。

```text
/**
 * ikun-theme-skin — node half.
 * The empty apply exists so the row activates in the host loader; the browser
 * half ships the theme skin through exports["./client"].
 */
export function apply() {}
```

**依据 3 · 源码核查**：[src/client.js:557-605](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/src/client.js#L557-L605)

主题、监听、设置、音乐和 overlay 席位注册。

<details>
<summary>查看原文（49行）</summary>

```text
    // ---------- 挂载（所有副作用都收集进 disposers，卸载时一并清理）----------
    ctx.effect(function () {
      const disposers = []
      function safe(fn) {
        try { return fn() } catch (e) { console.log('ikun: ' + e.message); return null }
      }
      disposers.push(safe(function () { return theme.register(DAY) }))
      disposers.push(safe(function () { return theme.register(NIGHT) }))
      disposers.push(safe(function () { return theme.register(GOLD) }))
      store.activeTheme = theme.getTheme().active.id
      store.preference = theme.getTheme().preference
      disposers.push(ctx.on('theme/change', function (snap) {
        setStore({ activeTheme: snap.active.id, preference: snap.preference })
        syncWallpaper()
      }))
      disposers.push(styles.insert(CSS))
      syncWallpaper()
      if (timer) {
        disposers.push(timer.interval(function () {
          if (!isIkunTheme(store.activeTheme)) return
          wallpaperIdx += 1
          applyWallpaper(WALLPAPERS[wallpaperIdx % WALLPAPERS.length])
        }, WALLPAPER_INTERVAL))
        disposers.push(timer.timeout(function () { if (!store.open) setStore({ open: true }) }, AUTO_OPEN_DELAY))
      } else {
        console.warn('ikun: timer service missing — wallpaper rotation and auto-open disabled')
      }
      disposers.push(slots.inject('settings.general.item', function () {
        // priority -1 低于系统的 0：顶替（shadow）系统外观行而非同 priority 抛错，卸载后系统行自动恢复
        return slots.register({ name: 'settings.general.item', id: 'appearance', order: 10, priority: -1 }, function () { return React.createElement(AppearanceRow2, null) })
      }))
      disposers.push(slots.inject('conversation.input.dock', function () {
        return slots.register({ name: 'conversation.input.dock', id: 'ikun-sendwatch', order: 30 }, function (props) { return React.createElement(SendWatcher, props) })
      }))
      disposers.push(slots.inject('sidebar.footer.action', function () {
        return slots.register({ name: 'sidebar.footer.action', id: 'ikun-music', label: 'IKUN 音乐' }, function (props) { return React.createElement(FooterAction, props) })
      }))
      disposers.push(slots.inject('shell.overlay', function () {
        return slots.register({ name: 'shell.overlay', id: 'ikun-player', order: 100 }, function () { return React.createElement(Player, null) })
      }))
      disposers.push(slots.inject('shell.overlay', function () {
        return slots.register({ name: 'shell.overlay', id: 'ikun-mascot', order: 110 }, function () { return React.createElement(Mascot, null) })
      }))
      disposers.push(slots.inject('settings.section', function () {
        return slots.register({ name: 'settings.section', id: 'ikun', order: 45, label: 'IKUN 主题' }, function (props) { return React.createElement(SettingsPage, props) })
      }))
      disposers.push(slots.inject('conversation.chat.turnTail', function () {
        return slots.register({ name: 'conversation.chat.turnTail', select: function (owner) { return { ikun: true } } }, function (props) { return React.createElement(TurnSticker, props) })
      }))
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 主题/壁纸/音效如何触发与清理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端通过 ctx.get(theme/slots/timer) 获取服务，三种 theme.register 后读取活动主题。主题变化事件同步 store 和背景；只在 IKUN 主题时向 body 插入壁纸 CSS，每7秒轮换一张。发送音效通过输入 dock 的 SendWatcher 观察发送相关相位/队列并做800毫秒去重，音乐与音效各有 audio 元素。播放器有播放 Promise 的拒绝处理，主题设置操作错误仅写日志。effect 返回清理函数，注销记录的主题/slot/事件/定时器并移除壁纸 CSS；但外部远程媒体下载及已写入的用户主题偏好不由 disposer 撤销。缺 timer 服务时仍能注册静态主题，轮播和自动打开失效。代码给出实现路径，不等于浏览器自动播放策略实际允许或所有发送方式都能被识别。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:21-67](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/src/client.js#L21-L67)

宿主服务获取、远程媒体常量、壁纸插入和撤下。

<details>
<summary>查看原文（47行）</summary>

```text
return {
  apply(ctx) {
    const theme = ctx.get('theme')
    const slots = ctx.get('slots')
    const timer = ctx.get('timer')
    if (!theme || !slots) return

    // ---------- 音频与参数 ----------
    const AUDIO_SRC = 'https://down.ear0.com:3321/index/preview?soundid=39338&type=mp3&audio=sound.mp3' // 基尼太美主题音乐
    const SEND_SRC = 'https://cdn.jsdelivr.net/gh/dreamhunter2333/ikun-whacamole@main/resources/audios/niganma.mp3' // 「你干嘛~哎哟」台词
    const SEND_START = 0 // 音效起点（秒）
    const WALLPAPER_INTERVAL = 7000 // 壁纸轮播间隔（毫秒）
    const SEND_DEDUPE_MS = 800 // 发送音效去抖窗口（毫秒），避免双信号重复触发
    const AUTO_OPEN_DELAY = 900 // 激活后自动弹出音乐盒的延迟（毫秒）

    // ---------- 真实图片全屏壁纸 ----------
    const WALLPAPERS = [
      'https://cdn.jsdelivr.net/gh/dreamhunter2333/ikun-whacamole@main/resources/images/kun.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/KUN_Charlotte_Tilbury_in_Shanghai_January_2026.jpg/960px-KUN_Charlotte_Tilbury_in_Shanghai_January_2026.jpg',
      'https://cdn.jsdelivr.net/gh/dreamhunter2333/ikun-whacamole@main/resources/images/ji.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Caixukun_concert_full_image.jpg/960px-Caixukun_concert_full_image.jpg',
      'https://cdn.jsdelivr.net/gh/dreamhunter2333/ikun-whacamole@main/resources/images/background.png',
      'https://cdn.jsdelivr.net/gh/MNTMDEV/cxk_gif@master/pic/cxk.gif',
    ]
    const BANNER_PHOTO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/KUN_Charlotte_Tilbury_in_Shanghai_January_2026.jpg/250px-KUN_Charlotte_Tilbury_in_Shanghai_January_2026.jpg'
    let wallpaperIdx = 0
    let wallpaperDisposer = null
    function isIkunTheme(id) { return id === 'ikun-night' || id === 'ikun-day' || id === 'ikun-gold' }
    function applyWallpaper(url) {
      if (wallpaperDisposer) { try { wallpaperDisposer() } catch (e) {} }
      // 第二层渐变是图片加载失败时的兜底，浅色主题配浅色渐变
      const grad = store.activeTheme === 'ikun-day'
        ? 'linear-gradient(160deg,rgba(242,245,253,.82),rgba(255,255,255,.86))'
        : 'linear-gradient(160deg,rgba(8,10,24,.55),rgba(16,8,32,.55))'
      wallpaperDisposer = styles.insert('body{background-image:url("' + url + '"),' + grad + '!important;background-size:cover,cover!important;background-position:center,center!important;background-repeat:no-repeat,no-repeat!important;background-attachment:fixed,fixed!important}')
    }
    function removeWallpaper() {
      if (wallpaperDisposer) { try { wallpaperDisposer() } catch (e) {} }
      wallpaperDisposer = null
    }
    function syncWallpaper() {
      if (isIkunTheme(store.activeTheme)) {
        applyWallpaper(WALLPAPERS[wallpaperIdx % WALLPAPERS.length])
      } else {
        removeWallpaper() // 切回系统主题时不干扰
      }
    }
```

</details>

**依据 2 · 源码核查**：[src/client.js:88-139](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/src/client.js#L88-L139)

音频引用、播放、拒绝处理与音量。

<details>
<summary>查看原文（52行）</summary>

```text
    // ---------- 音频控制 ----------
    function onAudioRef(el) {
      if (el) { store.el = el; el.volume = store.volume } else { store.el = null }
    }
    function onSendRef(el) {
      if (el) { store.sendEl = el; el.volume = store.volume } else { store.sendEl = null } // 卸载时清空引用
    }
    function onAudioError() { setStore({ error: true, playing: false }) }
    function doPlay(el) {
      const p = el.play()
      if (p && typeof p.then === 'function') {
        p.then(function () { setStore({ playing: true, error: false }) }).catch(function () { setStore({ error: true }) })
      } else {
        setStore({ playing: true, error: false })
      }
    }
    function togglePlay() {
      const el = store.el
      if (!el) return
      if (store.playing) { el.pause(); setStore({ playing: false }) } else { doPlay(el) }
    }
    function restart() {
      const el = store.el
      if (!el) return
      el.currentTime = 0
      if (!store.playing) doPlay(el)
    }
    function retryAudio() {
      const el = store.el
      if (!el) return
      setStore({ error: false })
      el.load()
      doPlay(el)
    }
    function setVolume(v) {
      setStore({ volume: v })
      if (store.el) store.el.volume = v
      if (store.sendEl) store.sendEl.volume = v // 发送音效跟随音量
    }
    // 发送时自动播放「你干嘛~哎哟」
    function playSendSound() {
      const el = store.sendEl
      if (!el) { console.log('ikun: send audio element not mounted'); return }
      try { el.currentTime = SEND_START } catch (e) {}
      const p = el.play()
      if (p && typeof p.then === 'function') {
        p.catch(function (e) { console.log('ikun: send sound play rejected: ' + e.message) })
      }
    }
    function setThemeSafe(id) {
      try { theme.setTheme(id) } catch (e) { console.log('ikun: setTheme failed ' + e.message) }
    }
```

</details>

**依据 3 · 源码核查**：[src/client.js:557-615](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/src/client.js#L557-L615)

主题事件、定时器、slot 及 effect 清理。

<details>
<summary>查看原文（59行）</summary>

```text
    // ---------- 挂载（所有副作用都收集进 disposers，卸载时一并清理）----------
    ctx.effect(function () {
      const disposers = []
      function safe(fn) {
        try { return fn() } catch (e) { console.log('ikun: ' + e.message); return null }
      }
      disposers.push(safe(function () { return theme.register(DAY) }))
      disposers.push(safe(function () { return theme.register(NIGHT) }))
      disposers.push(safe(function () { return theme.register(GOLD) }))
      store.activeTheme = theme.getTheme().active.id
      store.preference = theme.getTheme().preference
      disposers.push(ctx.on('theme/change', function (snap) {
        setStore({ activeTheme: snap.active.id, preference: snap.preference })
        syncWallpaper()
      }))
      disposers.push(styles.insert(CSS))
      syncWallpaper()
      if (timer) {
        disposers.push(timer.interval(function () {
          if (!isIkunTheme(store.activeTheme)) return
          wallpaperIdx += 1
          applyWallpaper(WALLPAPERS[wallpaperIdx % WALLPAPERS.length])
        }, WALLPAPER_INTERVAL))
        disposers.push(timer.timeout(function () { if (!store.open) setStore({ open: true }) }, AUTO_OPEN_DELAY))
      } else {
        console.warn('ikun: timer service missing — wallpaper rotation and auto-open disabled')
      }
      disposers.push(slots.inject('settings.general.item', function () {
        // priority -1 低于系统的 0：顶替（shadow）系统外观行而非同 priority 抛错，卸载后系统行自动恢复
        return slots.register({ name: 'settings.general.item', id: 'appearance', order: 10, priority: -1 }, function () { return React.createElement(AppearanceRow2, null) })
      }))
      disposers.push(slots.inject('conversation.input.dock', function () {
        return slots.register({ name: 'conversation.input.dock', id: 'ikun-sendwatch', order: 30 }, function (props) { return React.createElement(SendWatcher, props) })
      }))
      disposers.push(slots.inject('sidebar.footer.action', function () {
        return slots.register({ name: 'sidebar.footer.action', id: 'ikun-music', label: 'IKUN 音乐' }, function (props) { return React.createElement(FooterAction, props) })
      }))
      disposers.push(slots.inject('shell.overlay', function () {
        return slots.register({ name: 'shell.overlay', id: 'ikun-player', order: 100 }, function () { return React.createElement(Player, null) })
      }))
      disposers.push(slots.inject('shell.overlay', function () {
        return slots.register({ name: 'shell.overlay', id: 'ikun-mascot', order: 110 }, function () { return React.createElement(Mascot, null) })
      }))
      disposers.push(slots.inject('settings.section', function () {
        return slots.register({ name: 'settings.section', id: 'ikun', order: 45, label: 'IKUN 主题' }, function (props) { return React.createElement(SettingsPage, props) })
      }))
      disposers.push(slots.inject('conversation.chat.turnTail', function () {
        return slots.register({ name: 'conversation.chat.turnTail', select: function (owner) { return { ikun: true } } }, function (props) { return React.createElement(TurnSticker, props) })
      }))
      // 全部注册成功后再应用默认主题：避免中途失败把用户全局偏好持久化到 ikun-day 却无法回滚
      const pref = theme.getTheme().preference
      if (!isIkunTheme(pref)) {
        safe(function () { theme.setTheme('ikun-day') })
      }
      return function () {
        removeWallpaper()
        disposers.forEach(function (d) { if (d) { try { d() } catch (e) {} } })
      }
    }, 'ikun-theme: mount')
```

</details>

**依据 4 · 作者声明**：[README.md:83-89](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/README.md#L83-L89)

作者解释壁纸、发送双信号与生命周期设计。

```text
## 🧱 实现要点

- **纯 Client 插件**，全部用 `React.createElement` + 内联 SVG，无 JSX/TS/import
- **全屏壁纸**：主题底色做成半透明（`--dsw-alias-bg-base: rgba(...)`），在 `body` 层铺 `background-image` 轮播——照片从整个界面底层透出，文字保持可读；只在 ikun 主题激活时生效，切回系统主题自动撤下
- **发送检测**：在 `conversation.input.dock` 挂隐藏监视器，用「输入相位跳变 + 发送队列增长」双信号检测发送动作（单一相位信号会被 React 批处理漏掉），带 800ms 去抖
- **系统主题列表**：接管 `settings.general.item` 的 `appearance` 席位，渲染 6 选项（系统 3 项 + ikun 3 项），保留系统功能，卸载自动还原
- **生命周期**：所有副作用（theme 注册、样式、插槽、定时器、壁纸）都收集进 `ctx.effect` 的 disposers，停止/卸载时全部清理
```

#### 缺口

- 未在真实输入组件/浏览器自动播放策略下执行。
  **影响**：发送去重、音效与卸载清理无法作运行保证。
  **进一步探讨**：用点击/回车/流式发送、停用/重启和媒体加载失败矩阵验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认主题和远程素材有什么边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

effect 完成注册后，若当前偏好不是 IKUN 三主题，就调用 theme.setTheme('ikun-day')。因此安装/启用不是纯展示附加项，而会主动改写用户现有主题偏好；清理路径只移除背景和注销注册项，没有恢复之前偏好的操作。若宿主在注册撤销后如何处理失效主题偏好，需实测；不能按 README 所称“卸载自动还原”推断先前偏好必然恢复。壁纸和音频使用外部 URL，其中 jsDelivr 地址带 @main 或 @master 而非固定哈希，远程文件可能变化/不可用；README 同样提示热链无 SLA。CSS 渐变做图片失败背景，但音频失败只能显示错误/拒绝，不保证完整离线体验。第三方媒体在页面使用时可能向其主机发请求，用户需接受网络与隐私边界。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:28-45](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/src/client.js#L28-L45)

音频及壁纸远程 URL，部分依赖 main/master。

<details>
<summary>查看原文（18行）</summary>

```text
    // ---------- 音频与参数 ----------
    const AUDIO_SRC = 'https://down.ear0.com:3321/index/preview?soundid=39338&type=mp3&audio=sound.mp3' // 基尼太美主题音乐
    const SEND_SRC = 'https://cdn.jsdelivr.net/gh/dreamhunter2333/ikun-whacamole@main/resources/audios/niganma.mp3' // 「你干嘛~哎哟」台词
    const SEND_START = 0 // 音效起点（秒）
    const WALLPAPER_INTERVAL = 7000 // 壁纸轮播间隔（毫秒）
    const SEND_DEDUPE_MS = 800 // 发送音效去抖窗口（毫秒），避免双信号重复触发
    const AUTO_OPEN_DELAY = 900 // 激活后自动弹出音乐盒的延迟（毫秒）

    // ---------- 真实图片全屏壁纸 ----------
    const WALLPAPERS = [
      'https://cdn.jsdelivr.net/gh/dreamhunter2333/ikun-whacamole@main/resources/images/kun.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/KUN_Charlotte_Tilbury_in_Shanghai_January_2026.jpg/960px-KUN_Charlotte_Tilbury_in_Shanghai_January_2026.jpg',
      'https://cdn.jsdelivr.net/gh/dreamhunter2333/ikun-whacamole@main/resources/images/ji.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Caixukun_concert_full_image.jpg/960px-Caixukun_concert_full_image.jpg',
      'https://cdn.jsdelivr.net/gh/dreamhunter2333/ikun-whacamole@main/resources/images/background.png',
      'https://cdn.jsdelivr.net/gh/MNTMDEV/cxk_gif@master/pic/cxk.gif',
    ]
    const BANNER_PHOTO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/KUN_Charlotte_Tilbury_in_Shanghai_January_2026.jpg/250px-KUN_Charlotte_Tilbury_in_Shanghai_January_2026.jpg'
```

</details>

**依据 2 · 源码核查**：[src/client.js:606-615](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/src/client.js#L606-L615)

主动 setTheme 默认主题，清理未保存/恢复原偏好。

<details>
<summary>查看原文（10行）</summary>

```text
      // 全部注册成功后再应用默认主题：避免中途失败把用户全局偏好持久化到 ikun-day 却无法回滚
      const pref = theme.getTheme().preference
      if (!isIkunTheme(pref)) {
        safe(function () { theme.setTheme('ikun-day') })
      }
      return function () {
        removeWallpaper()
        disposers.forEach(function (d) { if (d) { try { d() } catch (e) {} } })
      }
    }, 'ikun-theme: mount')
```

</details>

**依据 3 · 作者声明**：[README.md:83-99](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/README.md#L83-L99)

作者称卸载还原系统行，亦承认热链无 SLA。

<details>
<summary>查看原文（17行）</summary>

```text
## 🧱 实现要点

- **纯 Client 插件**，全部用 `React.createElement` + 内联 SVG，无 JSX/TS/import
- **全屏壁纸**：主题底色做成半透明（`--dsw-alias-bg-base: rgba(...)`），在 `body` 层铺 `background-image` 轮播——照片从整个界面底层透出，文字保持可读；只在 ikun 主题激活时生效，切回系统主题自动撤下
- **发送检测**：在 `conversation.input.dock` 挂隐藏监视器，用「输入相位跳变 + 发送队列增长」双信号检测发送动作（单一相位信号会被 React 批处理漏掉），带 800ms 去抖
- **系统主题列表**：接管 `settings.general.item` 的 `appearance` 席位，渲染 6 选项（系统 3 项 + ikun 3 项），保留系统功能，卸载自动还原
- **生命周期**：所有副作用（theme 注册、样式、插槽、定时器、壁纸）都收集进 `ctx.effect` 的 disposers，停止/卸载时全部清理

## 📚 素材来源与版权

- 壁纸/头像照片：[Wikimedia Commons - Category:Cai Xukun](https://commons.wikimedia.org/wiki/Category:Cai_Xukun)
- 坤坤/小鸡模因图与「你干嘛~哎哟」音频：[dreamhunter2333/ikun-whacamole](https://github.com/dreamhunter2333/ikun-whacamole)（经 jsDelivr CDN 引用）
- 打篮球 GIF：[MNTMDEV/cxk_gif](https://github.com/MNTMDEV/cxk_gif)
- 音乐与音效：[耳聆网](https://www.ear0.com)（淘声网索引）
- 手绘 SVG 角色（坤坤全身/脸、白色中分小黄鸡）为本仓库原创

> ⚠️ 本插件为**整活向设计，仅供娱乐**。所有图片/音频版权归原作者所有，仅作粉丝文化展示；热链素材无 SLA，加载失败会自动降级为渐变底色，不影响使用。理性追星，快乐玩梗。
```

</details>

#### 缺口

- 未验证宿主撤销主题注册后对已存偏好的处理。
  **影响**：无法断言卸载后的实际主题状态。
  **进一步探讨**：在原有浅/深/跟随三种偏好下安装、启用、切换、卸载并重启，检查持久化偏好。
- 未访问远程媒体或核素材授权细节。
  **影响**：不能保证长期加载或再分发条件。
  **进一步探讨**：发布前逐一核具体素材来源/许可与失效降级，必要时换可控素材。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本、采用和验证怎样界定？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

用户需安装到 web profile、重启或按文档使用动态插件；持续有每7秒背景切换、动画、音频预加载、外部图片/音频网络流量和潜在注意力成本。现金成本未见收费说明，但素材来源与网络可用性需要管理。当前建议仅作为自愿主题试用，先确认已有外观偏好可恢复并提供明显静音/关闭途径，不宜自动施加给共享工作环境。未实现的改进假设是首次启用不自动覆盖旧偏好、显式选择后记录原值、退出时可选择恢复，并为素材使用固定版本/本地退化资源；在用户 A/B 的启动、切换、卸载和重启场景里测偏好保持、加载失败率、CPU/带宽与可读性。若视觉或网络负担超过娱乐收益就应关闭。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-54](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/README.md#L19-L54)

标准 bundle、动态插件与卸载路径。

<details>
<summary>查看原文（36行）</summary>

````text
## 📦 安装

### 方式一：远程仓库安装（标准，推荐）

纯 JS、零构建、即装即用，通过 `dsh plugin` 安装到 web profile 并自动登记为 bundle 层：

```bash
dsh plugin --profile web add github:AKS1st/ikun-theme-skin
dsh web   # 重启 web 服务使 profile 生效
```

本地安装（clone 后直接指向仓库目录）：

```bash
git clone https://github.com/AKS1st/ikun-theme-skin.git
dsh plugin --profile web add /path/to/ikun-theme-skin
dsh web
```

卸载：

```bash
dsh plugin --profile web remove ikun-theme-skin
```

> 若 pnpm 提示需要执行构建脚本（`ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` / `ERR_PNPM_IGNORED_BUILDS`），按提示把包加入 profile 的 `pnpm-workspace.yaml` 的 `allowBuilds` 后重试即可（本插件无构建脚本，通常不需要）。

### 方式二：动态插件（进程内运行，无需安装）

1. 在会话中让模型执行 `cordis_define`，`code.client` 粘贴 [`src/client.js`](./src/client.js) 的**函数体**（`return { apply(ctx) {...} }` 整段）
2. `cordis_run` 激活，在界面中允许运行
3. 完成！界面自动应用浅色主题并开始壁纸轮播

> 动态方式适合快速体验（不写入 profile，重启后需重新运行）；标准方式适合长期使用。两种方式功能一致。

详细步骤见 [`docs/INSTALL.md`](./docs/INSTALL.md)。
````

</details>

**依据 2 · 源码核查**：[src/client.js:28-45](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/src/client.js#L28-L45)

外部媒体和7秒壁纸间隔。

<details>
<summary>查看原文（18行）</summary>

```text
    // ---------- 音频与参数 ----------
    const AUDIO_SRC = 'https://down.ear0.com:3321/index/preview?soundid=39338&type=mp3&audio=sound.mp3' // 基尼太美主题音乐
    const SEND_SRC = 'https://cdn.jsdelivr.net/gh/dreamhunter2333/ikun-whacamole@main/resources/audios/niganma.mp3' // 「你干嘛~哎哟」台词
    const SEND_START = 0 // 音效起点（秒）
    const WALLPAPER_INTERVAL = 7000 // 壁纸轮播间隔（毫秒）
    const SEND_DEDUPE_MS = 800 // 发送音效去抖窗口（毫秒），避免双信号重复触发
    const AUTO_OPEN_DELAY = 900 // 激活后自动弹出音乐盒的延迟（毫秒）

    // ---------- 真实图片全屏壁纸 ----------
    const WALLPAPERS = [
      'https://cdn.jsdelivr.net/gh/dreamhunter2333/ikun-whacamole@main/resources/images/kun.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/KUN_Charlotte_Tilbury_in_Shanghai_January_2026.jpg/960px-KUN_Charlotte_Tilbury_in_Shanghai_January_2026.jpg',
      'https://cdn.jsdelivr.net/gh/dreamhunter2333/ikun-whacamole@main/resources/images/ji.png',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Caixukun_concert_full_image.jpg/960px-Caixukun_concert_full_image.jpg',
      'https://cdn.jsdelivr.net/gh/dreamhunter2333/ikun-whacamole@main/resources/images/background.png',
      'https://cdn.jsdelivr.net/gh/MNTMDEV/cxk_gif@master/pic/cxk.gif',
    ]
    const BANNER_PHOTO = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/KUN_Charlotte_Tilbury_in_Shanghai_January_2026.jpg/250px-KUN_Charlotte_Tilbury_in_Shanghai_January_2026.jpg'
```

</details>

**依据 3 · 源码核查**：[src/client.js:573-615](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/src/client.js#L573-L615)

轮播/自动打开、默认主题写入与清理。

<details>
<summary>查看原文（43行）</summary>

```text
      syncWallpaper()
      if (timer) {
        disposers.push(timer.interval(function () {
          if (!isIkunTheme(store.activeTheme)) return
          wallpaperIdx += 1
          applyWallpaper(WALLPAPERS[wallpaperIdx % WALLPAPERS.length])
        }, WALLPAPER_INTERVAL))
        disposers.push(timer.timeout(function () { if (!store.open) setStore({ open: true }) }, AUTO_OPEN_DELAY))
      } else {
        console.warn('ikun: timer service missing — wallpaper rotation and auto-open disabled')
      }
      disposers.push(slots.inject('settings.general.item', function () {
        // priority -1 低于系统的 0：顶替（shadow）系统外观行而非同 priority 抛错，卸载后系统行自动恢复
        return slots.register({ name: 'settings.general.item', id: 'appearance', order: 10, priority: -1 }, function () { return React.createElement(AppearanceRow2, null) })
      }))
      disposers.push(slots.inject('conversation.input.dock', function () {
        return slots.register({ name: 'conversation.input.dock', id: 'ikun-sendwatch', order: 30 }, function (props) { return React.createElement(SendWatcher, props) })
      }))
      disposers.push(slots.inject('sidebar.footer.action', function () {
        return slots.register({ name: 'sidebar.footer.action', id: 'ikun-music', label: 'IKUN 音乐' }, function (props) { return React.createElement(FooterAction, props) })
      }))
      disposers.push(slots.inject('shell.overlay', function () {
        return slots.register({ name: 'shell.overlay', id: 'ikun-player', order: 100 }, function () { return React.createElement(Player, null) })
      }))
      disposers.push(slots.inject('shell.overlay', function () {
        return slots.register({ name: 'shell.overlay', id: 'ikun-mascot', order: 110 }, function () { return React.createElement(Mascot, null) })
      }))
      disposers.push(slots.inject('settings.section', function () {
        return slots.register({ name: 'settings.section', id: 'ikun', order: 45, label: 'IKUN 主题' }, function (props) { return React.createElement(SettingsPage, props) })
      }))
      disposers.push(slots.inject('conversation.chat.turnTail', function () {
        return slots.register({ name: 'conversation.chat.turnTail', select: function (owner) { return { ikun: true } } }, function (props) { return React.createElement(TurnSticker, props) })
      }))
      // 全部注册成功后再应用默认主题：避免中途失败把用户全局偏好持久化到 ikun-day 却无法回滚
      const pref = theme.getTheme().preference
      if (!isIkunTheme(pref)) {
        safe(function () { theme.setTheme('ikun-day') })
      }
      return function () {
        removeWallpaper()
        disposers.forEach(function (d) { if (d) { try { d() } catch (e) {} } })
      }
    }, 'ikun-theme: mount')
```

</details>

**依据 4 · 源码核查**：[package.json:1-46](https://github.com/AKS1st/ikun-theme-skin/blob/c0e59e61332a5e3317365848f73240308d9d9345/package.json#L1-L46)

私有包、1.0.0 和 Web bundle 声明。

<details>
<summary>查看原文（46行）</summary>

```text
{
  "name": "ikun-theme-skin",
  "version": "1.0.0",
  "description": "IKUN 主题皮肤 for DeepSeek Harness — ikun 应援主题（星蓝昼/夜、背带裤黑金三套配色接入系统主题列表）、全屏壁纸轮播、基尼太美音乐盒、发送自动播「你干嘛~哎哟」",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "files": [
    "index.js",
    "client.js",
    "cordis.patch.yml",
    "src",
    "docs",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "node scripts/build-bundle.mjs",
    "check": "node --check index.js && node --check client.js"
  },
  "keywords": [
    "dsh",
    "deepseek-harness",
    "plugin",
    "dsh-plugin",
    "ikun",
    "theme",
    "skin",
    "wallpaper",
    "web-ui"
  ],
  "license": "MIT",
  "author": "AKS1st",
  "repository": {
```

</details>

#### 缺口

- 没有真实用户评价、性能/带宽或宿主兼容性测试。
  **影响**：无法量化娱乐价值与打扰程度。
  **进一步探讨**：隔离 Web profile 记录首屏、网络、动画/音频偏好和卸载后状态。
- 偏好保护与固定素材版本未实现。
  **影响**：改进方案不是现版能力。
  **进一步探讨**：实现原型后进行 A/B 状态保持与离线退化测试。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
