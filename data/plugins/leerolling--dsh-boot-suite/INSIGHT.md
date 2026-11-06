# dsh-boot-suite

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[baec191](https://github.com/LeeRolling/dsh-boot-suite/tree/baec191c80fa057cab690997e269392dc9ca841e)

<!-- BEGIN META -->
[![GitHub ★ 61](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=61&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LeeRolling/dsh-boot-suite) [![npm 30d 4,496](https://img.shields.io/static/v1?label=npm+30d&message=4%2C496&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-boot-suite) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-boot-suite)
<!-- END META -->

> **功能**：为 DSH 提供可配置启动动画、声音与模板，并设置聊天图片或循环视频背景。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持在同包组合首屏媒体和持久聊天背景，保留取消释放、模板来源隔离和更新摘要。底层HTML、媒体与脚本机制是通用技术，价值主要是个性化体验。

> **主要限制**：[Q03](#research-q03)、[Q04](#research-q04)最影响采用的是首屏可达性与本机副作用。startup栅栏fail-closed而wallpaper缺服务/异常放行，后者含媒体删除；更新started不是完成，回滚尽力恢复并非完整事务保证。

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
  - [Q01 · 首屏动画和聊天壁纸为谁提供什么增量？](#detail-section-11)
  - [Q02 · 首屏如何注入、播放和跳过？](#detail-section-12)
  - [Q03 · 图片音乐、壁纸删除和请求权限边界是什么？](#detail-section-13)
  - [Q04 · 安装、更新和黑屏恢复有什么负担？](#detail-section-14)
  - [Q05 · 能推导什么可验证的首屏设计方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供自愿追求DSH启动与聊天个性化的用户使用，目标是喜欢且可退出的外观，不改善模型推理或真实任务结果。

相对单背景CSS增加启动时序与媒体模板，相对外部播放器接入DSH生命周期；没有独立启动性能或生产收益证据，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 首屏动画与声音 | 个性化启动体验 | 控制首屏，可跳过与兜底仍需目标环境验收 |
| 数据/iframe模板 | 自定义播放内容 | iframe能执行脚本，非受信有sandbox与token边界 |
| 聊天背景/循环视频 | 持续个性化界面 | 资源/可读性未测，删除视频会动Host文件 |
| 自备媒体导入 | 保存动画与音乐 | 动画64MB、音乐100MB，目的地是DSH Host |
| 更新与应急恢复资源 | 下载核摘要、启动外部安装及卸载 | Windows依赖，started不等完成，无全系统恢复保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer与connection | Host必需 | 首屏与媒体路由/请求检查 | 两侧栅栏异常策略不同，须核对部署 |
| 浏览器音视频与存储 | 播放必需 | 动画、声音、会话/每日模式 | 权限或存储失败可能无声/重播 |
| Host媒体目录与磁盘 | 自备素材才需 | 保存图片、动画、音乐 | 上传去Host，远端部署非浏览器本机 |
| Windows CMD/PowerShell与退出DSH | 外部更新/应急恢复才需 | 修改安装与profile | started不等安装完成，跨平台未验 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对profile和界面外恢复 | 首次只用自带静态内容，不先导私密媒体 |
| 加载 | Host注入首屏，splash播放 | 可跳过并进入聊天，不能只等进程存在 |
| 退出播放 | 用户跳过/结束 | 根、音频与滚动锁释放，异常另核兜底范围 |
| 维护 | 关闭DSH后按明确步骤更新或卸载 | 回读版本/profile，外部更新器启动不当成功 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 包/媒体下载与磁盘资源未知 | 安装重启、设置与恢复准备 | 无模型增效依据 |
| 持续 | 动画、音视频与背景渲染未知 | 选择素材、维护可读性和目录 | 娱乐收益及进入任务耗时未测 |
| 失败恢复 | 界面外脚本、日志和重装资源未知 | 完全退出、核对profile和媒体保留 | 黑屏可能无法用界面设置 |
| 升级退出 | 外部更新改安装，恢复可能失败 | 摘要核对、备份与版本回读 | 未保证完整profile事务回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 个性化 | 启动/壁纸/素材设置真实接线 | 喜好、长期保留与干扰 |
| 可达恢复 | 取消释放、boot兜底和应急脚本 | 所有阶段黑屏与真实桌面可靠性 |
| 来源约束 | 模板sandbox/token与更新摘要 | 目标部署权限与完整恢复 |

> **思考**：[Q03](#research-q03)、[Q04](#research-q04)最影响采用的是首屏可达性与本机副作用。startup栅栏fail-closed而wallpaper缺服务/异常放行，后者含媒体删除；更新started不是完成，回滚尽力恢复并非完整事务保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持在同包组合首屏媒体和持久聊天背景，保留取消释放、模板来源隔离和更新摘要。底层HTML、媒体与脚本机制是通用技术，价值主要是个性化体验。

取消/finish集中释放、模板sandbox与来源token、更新摘要和候选目录校验可借鉴；两侧权限策略不一致与外部安装器完整恢复仍需复核，不能以合并包装推断边界统一。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)、[Q04](#research-q04)最影响采用的是首屏可达性与本机副作用。startup栅栏fail-closed而wallpaper缺服务/异常放行，后者含媒体删除；更新started不是完成，回滚尽力恢复并非完整事务保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

先确认自己需要外观体验并准备界面外恢复，不以它改善工作性能。首次只用自带静态背景，测试跳过、禁用和文字可读后再考虑素材；不把视频删除当关闭。更新需完全退出并核对实际结果，首屏受阻或权限/恢复不清就停用回原生。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

仅源码核查首屏、播放释放、媒体路由和更新恢复关键链路；未运行媒体、桌面、更新或故障实验。非阻塞外观是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/host-startup.js、lib/host-wallpaper.js、lib/client.js、lib/splash.js、lib/security.js、tools/update-apply.ps1、tools/emergency-uninstall.ps1 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码抽读Host双侧入口、HTML注入、splash退出/iframe、导入路由、壁纸删除/权限、外部更新与应急卸载；未审计全部模板媒体和安装器所有profile改写。
- 下一步：未运行目标脚本、安装、媒体、浏览器、Windows更新、删除或故障实验；只作源码条件判断，不宣称已利用权限问题或已验收恢复。

**分析版本**

- **仓库**：[LeeRolling/dsh-boot-suite](https://github.com/LeeRolling/dsh-boot-suite)
- **版本号**：2.16.11（[固定提交 baec191](https://github.com/LeeRolling/dsh-boot-suite/tree/baec191c80fa057cab690997e269392dc9ca841e)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的非阻塞首屏和统一路由拒绝策略，保留独立进入聊天入口。比较故障矩阵中的可达时间、黑屏、播放和拒绝一致性；无改善或用户不保留则收窄，不计已有贡献。

未运行目标脚本、安装、媒体、浏览器、Windows更新、删除或故障实验；只作源码条件判断，不宣称已利用权限问题或已验收恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 102 | 11906 | — | — | 181624 |
| .tsx | source | 19 | 1404 | 1242 | 86 | — |
| .ts | source | 4 | 216 | 165 | 17 | — |
| .mjs | source | 11 | 1590 | 1277 | 200 | — |
| .js | source | 17 | 13808 | 11861 | 1590 | — |
| .mjs | test | 15 | 5366 | 4646 | 411 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/LeeRolling/dsh-boot-suite/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断首屏动画与聊天背景的实际接线、数据和退出边界及采用负担。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 首屏动画和聊天壁纸为谁提供什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Boot Suite面向愿意把DSH启动和聊天界面个性化的用户，提供开场动画、声音、模板和聊天图片/循环视频背景。合格结果是用户喜欢并能及时进入聊天、壁纸不妨碍阅读且能关闭；它不是加速模型、改进任务结果或优化真实宿主启动时间的插件。相对纯背景CSS，它把启动时序、媒体导入与聊天背景设置组合起来；相对独立启动视频，不需要用户另开播放器。

Host入口合并startup和wallpaper两侧，仍保留两份配置，壁纸apply抛错时被catch而startup继续；客户端也提供两组设置。底层HTML注入、CSS/Canvas/媒体与浏览器存储是通用技术，具体贡献是DSH生命周期和外观控制组合。README六幕与package两幕描述不完全同一口径，不能以幕数当质量证据。

每天多次打开只想立即工作的用户可能没有采用需求，声音、视频和等待反而增加干扰。没有独立用户喜好或启动对照数据，不能把“仪式感”合理定位升级为生产收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-35](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/README.md#L19-L35)

作者定位动画和壁纸两个侧面。

<details>
<summary>查看原文（17行）</summary>

```text
## 它是什么

DeepSeek Harness（DSH）冷启动时会先播六幕动画，播完进聊天，再落在你自己设的底图上：

    黑幕 DeepSeek 标识 → 过曝洗白 → 暖白「技术档案」底板
      → 五步交互式访问授权 → 色散故障揭幕 → 聊天壁纸

**不是视频文件，是代码动画**：`lib/splash.js`（3288 行）+ `lib/splash.css`（1410 行），源码合计约 196 KB。
用 DOM + CSS 动画 + WebAudio 现场绘制，没有图片序列帧或视频素材。

| | 开机动画 | 聊天壁纸 |
|---|---|---|
| 入口 | DSH 设置页 →「启动动画」 | DSH 设置页 →「聊天背景」 |
| 内容 | 六幕序列、逐字打出的英文副标题、环形准星、色散故障 | 静态底图 / 大字横幅 |
| 素材 | 5 句真声台词 + 终幕欢迎语 + 2 个界面音效（mp3） | 插件自带默认底图 + 你自己的图片 |
| 可调 | 34 项：身份名称 / 编号 / 权限等级 / 配色 / 速度 / 音色 / 语速 / 每处文案 | 默认/自选底图、循环视频、纱的浓度、横幅文字、丢图即换 |

```

</details>

**依据 2 · 源码核查**：[lib/index.js:1-26](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/index.js#L1-L26)

两侧合并、配置保留与壁纸失败隔离。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * dsh-boot-suite — 宿主半侧（合并版）
 * ---------------------------------------------------------------------------
 *   · host-startup.js   开机动画：/dsh-startup/* 路由 + index.html 首屏注入
 *   · host-wallpaper.js 聊天壁纸：/chat-wallpaper/* 路由 + 底图/横幅配置与静态图片路由
 *
 * 两份配置刻意**没有合并**，继续读原来的两个文件，老用户的设置原样生效：
 *   · $DSH_HOME/dsh-startup.json
 *   · $DSH_HOME/chat-wallpaper.json
 */
import * as startup from './host-startup.js'
import wallpaperPlugin from './host-wallpaper.js'

const name = 'dsh-boot-suite'
const inject = ['webServer', 'connection']

function apply(ctx) {
  /* 壁纸半侧"绝不抛异常"：壁纸坏了只能是没有壁纸，绝不能影响 DSH 启动。 */
  try {
    wallpaperPlugin.apply(ctx)
  } catch (err) {
    try {
      ctx.logger?.warn?.('[dsh-boot-suite] 聊天壁纸半侧启动失败，已跳过：' + String((err && err.message) || err))
    } catch (e2) { /* 日志失败不影响加载 */ }
  }
  startup.apply(ctx)
```

</details>

**依据 3 · 源码核查**：[lib/client.js:3073-3083](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/client.js#L3073-L3083)

聊天背景设置真实注册。

<details>
<summary>查看原文（11行）</summary>

```text
    function apply(ctx) {
      /* 设置页入口：与「启动动画」并列的「聊天背景」（order 27）。 */
      try {
        if (ctx && ctx.slots && typeof ctx.slots.inject === 'function') {
          ctx.slots.inject('settings.section', function () {
            return ctx.slots.register(
              { name: 'settings.section', id: 'chat-wallpaper', order: 27, label: '聊天背景' },
              function () { return cwH(WallpaperPanel, {}) }
            )
          })
          wdiag('settings.section 已注册（聊天背景）')
```

</details>

#### 缺口

- 缺少用户持续保留、可读性和进入聊天耗时记录。
  **影响**：不能判断娱乐收益抵消等待与干扰。
  **进一步探讨**：同一用户比较原生、静态背景和动画+背景，记录主动保留与进入任务耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 首屏如何注入、播放和跳过？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

startup通过webServer.tapIndex在HTML头部加样式、body前插根节点、内联配置和defer splash.js；它先于正常设置界面影响首屏，因此失败可能比普通设置页故障更难退出。splash对Host判定本次不播保留API而不建DOM，对仍是dsu-boot的根设置9秒兜底移除并解滚动锁。这个兜底检查只针对boot类状态，不能当任何阶段/任何异常都保证9秒退出。

正常finish停止BGM、配音、等待、时钟与iframe清理，移除滚动锁并延迟删根，requestSkip会releaseAll再finish；session/daily播放状态写入浏览器存储，存储失败忽略，因而刷新可能重播。数据模板会校验结构、深度、节点、字符串和幕数；iframe模板则可以执行iframe脚本，非受信模板sandbox allow-scripts不含same-origin，并以source校验消息、只允许结束/跳过，不能把所有模板统称为“不执行任何代码”。

这些防线证明有退出设计，不证明真实桌面、媒体权限和异常组合都通过。尤其浏览器自动播放限制、慢素材、窗口生命周期和用户跳过时的音频释放需要实际核对。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host-startup.js:2077-2103](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/host-startup.js#L2077-L2103)

HTML首屏注入与dispose。

<details>
<summary>查看原文（27行）</summary>

```text
  disposers.push(webServer.tapIndex((html) => {
    diag('tapIndex len=' + (html ? html.length : 0))
    if (html && html.length > 1000) dumpHtml(html)
    if (!html || html.includes(ROUTE_BASE + '/splash.js')) return html
    const cfg = readConfig()
    const head =
      '<link rel="stylesheet" href="' + ROUTE_BASE + '/splash.css">' +
      '<style id="dsh-startup-critical">' + CRITICAL_CSS + '</style>'
    const body =
      '<div id="dsh-startup-root" class="dsu-root dsu-boot"></div>' +
      '<script>window.__DSH_STARTUP_BOOT__="index";window.__DSH_STARTUP_VERSION__=' + safeJson(PLUGIN_VERSION) + ';window.__DSH_STARTUP__=' + safeJson(cfg) + ';' + BOOTSTRAP_JS + '</script>' +
      '<script defer src="' + ROUTE_BASE + '/splash.js"></script>'

    let out = html
    if (out.includes('</head>')) out = out.replace('</head>', head + '</head>')
    else out = head + out
    if (out.includes('<body>')) out = out.replace('<body>', '<body>' + body)
    else if (out.includes('</body>')) out = out.replace('</body>', body + '</body>')
    else out = out + body
    return out
  }))

  ctx.effect(() => () => {
    for (const dispose of disposers) {
      try { dispose() } catch (err) { /* noop */ }
    }
  })
```

</details>

**依据 2 · 源码核查**：[lib/splash.js:550-579](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/splash.js#L550-L579)

不播API与9秒boot根兜底范围。

<details>
<summary>查看原文（30行）</summary>

```text

  /* Host 侧的首屏兜底脚本已经判定"这次不播"（未启用 / 本会话已播 / 今日已播）：
     这里不再建 DOM，但仍然暴露 API，方便设置页按需重播。 */
  if (window.__DSH_STARTUP_SKIP__ === true) {
    window.__DSH_STARTUP_API__ = {
      steps: STEPS,
      template: (TEMPLATE && TEMPLATE.id) || '',
      replay: injectSelf,
      pause: pause,
      resume: resume,
      paused: function () { return PAUSED },
      skip: function () {},
      finish: function () {},
      config: C
    }
    return
  }

  /* 最后一道保险：无论前面哪一步抛异常，都不许把用户留在黑幕里 */
  setTimeout(function () {
    try {
      var r = document.getElementById(ROOT_ID)
      if (r && r.classList && r.classList.contains('dsu-boot')) {
        if (r.parentNode) r.parentNode.removeChild(r)
        document.documentElement.classList.remove('dsu-lock')
        if (document.body) document.body.style.overflow = ''
        window.__DSH_STARTUP_FAILED__ = true
      }
    } catch (e) { /* 兜底本身不许再抛 */ }
  }, 9000)
```

</details>

**依据 3 · 源码核查**：[lib/splash.js:3938-3983](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/splash.js#L3938-L3983)

finish和skip实际清理链。

<details>
<summary>查看原文（46行）</summary>

```text
  function finish() {
    bgm.stop()
    if (iframeCleanup) { try { var cleanIframe = iframeCleanup; iframeCleanup = null; cleanIframe() } catch (eIframe) { /* noop */ } }
    if (finished) return
    diagRun('finish videos=' + videoCount())
    finished = true
    invalidateRun()   /* 取消体系：本次播放的延时任务全部作废 */
    /* v2.12.0：转场覆盖层兜底清理。transOut 的「揭开」阶段要保留覆盖层，
       此时 transPreserve=true，由 transPlayReveal 负责移除。 */
    if (!transPreserve) { try { transCleanup() } catch (eTrans) { /* 忽略 */ } }
    audio.bedStop()   /* 本地补丁：通道常开，到这里才关 */
    releaseAll()
    stopHex()
    voice.stop()
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null }
    try {
      if (C.mode === 'session') window.sessionStorage.setItem('dsh-startup-screen:shown', '1')
      if (C.mode === 'daily') {
        window.localStorage.setItem('dsh-startup-screen:day', new Date().toISOString().slice(0, 10))
      }
    } catch (err) { /* 隐私模式下不可写，忽略 */ }
    /* 解锁：Host 注入的关键样式用 html.dsu-lock 锁滚动，这里必须一并摘掉，
       否则揭幕后主界面会永远滚不动。 */
    /* 标题栏还回去：移除探针样式会让 DSH 重新测量一次，恢复它自己的颜色 */
    try {
      var capStyle = document.getElementById('dsh-startup-caption')
      if (capStyle && capStyle.parentNode) capStyle.parentNode.removeChild(capStyle)
    } catch (e3) { /* noop */ }
    document.documentElement.classList.remove('dsu-lock')
    document.documentElement.style.overflow = ''
    if (document.body) document.body.style.overflow = ''
    root.classList.remove('dsu-boot')
    /* 正常揭幕时内容与底色都已经淡完，只剩收尾；跳过/异常路径没走两段，用 dsu-gone 兜一层。 */
    var faded = (root.className || '').indexOf('dsu-handoff') !== -1
    root.classList.add('dsu-gone')
    setTimeout(function () {
      if (root && root.parentNode) root.parentNode.removeChild(root)
      try { window.dispatchEvent(new CustomEvent('dsh-startup:done')) } catch (err) { /* noop */ }
    }, faded ? ms(200) : ms(900))
  }

  function requestSkip() {
    if (skipped || finished) return
    skipped = true
    releaseAll()
    finish()
```

</details>

**依据 4 · 源码核查**：[lib/security.js:95-125](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/security.js#L95-L125)

模板结构校验及iframe引擎存在。

<details>
<summary>查看原文（31行）</summary>

```text
export function validateTemplate(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, reason: 'not-object' }
  const id = String(raw.id || '').trim()
  if (!TEMPLATE_ID_RE.test(id)) return { ok: false, reason: 'bad-id' }
  let json = ''
  try {
    json = JSON.stringify(raw)
  } catch (err) {
    return { ok: false, reason: 'unserializable' }
  }
  if (json.length > MAX_TEMPLATE_BYTES) return { ok: false, reason: 'too-large' }
  const state = { nodes: 0 }
  const r = sanitizeValue(raw, 0, state)
  if (!r.ok) return r
  const out = r.value
  out.id = id
  if (Array.isArray(out.steps)) out.steps = out.steps.slice(0, 24)
  if (out.layers !== undefined) {
    if (!Array.isArray(out.layers)) return { ok: false, reason: 'bad-layers' }
    for (const layer of out.layers) {
      if (!layer || typeof layer !== 'object' || Array.isArray(layer)) return { ok: false, reason: 'bad-layer' }
      if (layer.type !== undefined && typeof layer.type !== 'string') return { ok: false, reason: 'bad-layer-type' }
    }
  }
  if (out.engine !== undefined && typeof out.engine !== 'string') return { ok: false, reason: 'bad-engine' }
  if (out.engine === 'iframe') {
    if (out.entry !== undefined && (typeof out.entry !== 'string' || !TEMPLATE_ENTRY_RE.test(out.entry))) {
      return { ok: false, reason: 'bad-entry' }
    }
  }
  return { ok: true, value: out }
```

</details>

**依据 5 · 源码核查**：[lib/splash.js:2013-2036](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/splash.js#L2013-L2036)

iframe sandbox、source消息检查和受信差异。

<details>
<summary>查看原文（24行）</summary>

```text
      wrap.setAttribute('data-dsh-iframe-template', tpl.id)
      wrap.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#000;overflow:hidden'
      var frame = document.createElement('iframe')
      frame.setAttribute('allow', 'autoplay; fullscreen')
      frame.setAttribute('allowfullscreen', 'true')
      if (sandboxed) frame.setAttribute('sandbox', 'allow-scripts')
      frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;background:#000;display:block'
      frame.style.visibility = 'hidden'
      frame.src = frameSrc
      wrap.appendChild(frame)
      document.body.appendChild(wrap)

      var settle = null
      var done = new Promise(function (resolve) { settle = resolve })
      function finishOnce() { if (settle) { var fn2 = settle; settle = null; fn2() } }
      function onMessage(e) {
        /* F-03：只接受来自本 iframe 的消息（sandbox 时 origin 为 "null"，只能靠 source 校验） */
        if (!e || e.source !== frame.contentWindow) return
        var d = e.data
        if (d && typeof d === 'object' && (d.type === 'dsh-startup-done' || d.type === 'dsh-startup-skip')) finishOnce()
        /* 第三方 sandbox 模板只允许结束/跳过，不允许控 BGM/配音（内置受信模板才可） */
        if (sandboxed) return
        if (d && typeof d === 'object' && d.type === 'dsh-startup-voice') bgm.duck(d.on === true)
        if (d && typeof d === 'object' && d.type === 'dsh-startup-bgm') { if (d.on === false) bgm.cut(); else bgm.restart() }
```

</details>

#### 缺口

- 未验证所有播放阶段异常、自动播放权限与跳过后的资源释放。
  **影响**：不能保证无黑屏或全平台可靠进入聊天。
  **进一步探讨**：在可恢复环境分别测试慢/坏媒体、自动播放禁止、iframe失联与每阶段跳过并核对根/声音/滚动清理。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 图片音乐、壁纸删除和请求权限边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

自备动画POST接收指定扩展并有64MB字节上限；音乐POST限制扩展和100MB，写入Host的startup-music并记录索引。这是浏览器到DSH Host的上传，不是第三方云服务，但Host若在远端，媒体也会离开浏览器机器；“本机存储”不能脱离部署位置理解。模板能力token有随机32字节、模板root和10分钟截止，为非同源sandbox取资源提供限定入口。

权限实现两侧不一致。startup的registerRoute对connection.requestRejection缺失/异常采取拒绝；wallpaper的rejected缺服务或catch异常直接返回false而放行。后者路由还包括根据配置视频root定位文件/项目后rmSync删除，因此并不只是无副作用取背景。正常Host提供connection并拒绝时会挡住，但栅栏故障条件下的两侧行为不同，不宜假定统一fail-closed。这里是源码确认的条件，不是已证明任意远程利用。

首次宜只用自带静态背景，不导入私人媒体、不加入重要视频目录，也不点删除来代替停止播放。多用户、远程Host、代理与具体目录权限仍需定向核查，不能从本组件接口字段推出完整隔离。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host-startup.js:1428-1439](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/host-startup.js#L1428-L1439)

动画导入扩展与64MB上限。

<details>
<summary>查看原文（12行）</summary>

```text
    kind: 'exact',
    path: ROUTE_BASE + '/import-animation',
    handler: async (req, res) => {
      if ((req.method || 'GET').toUpperCase() !== 'POST') { sendJson(res, 405, { ok: false }); return }
      let u = null
      try { u = new URL(String(req.url || ''), 'http://localhost') } catch (eU) { sendJson(res, 400, { ok: false, error: 'bad url' }); return }
      const rawName = String(u.searchParams.get('name') || '').trim().slice(0, 120)
      const extMatch = rawName.match(IMPORT_ANIM_RE)
      if (!extMatch) { sendJson(res, 400, { ok: false, error: '只支持 mp4 / webm / gif / png / jpg / webp' }); return }
      const kind = /^\.(mp4|webm)$/i.test(extMatch[0]) ? 'video' : 'image'
      const bytes = await readRawBody(req, 64 * 1024 * 1024)
      if (!bytes || !bytes.length) { sendJson(res, 413, { ok: false, error: '文件为空或超过 64MB' }); return }
```

</details>

**依据 2 · 源码核查**：[lib/host-startup.js:1541-1563](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/host-startup.js#L1541-L1563)

音乐上传、100MB和Host文件写入。

<details>
<summary>查看原文（23行）</summary>

```text
    kind: 'exact',
    path: ROUTE_BASE + '/music/upload',
    handler: async (req, res) => {
      if ((req.method || 'GET').toUpperCase() !== 'POST') { sendJson(res, 405, { ok: false }); return }
      let u = null
      try { u = new URL(String(req.url || ''), 'http://localhost') } catch (eU) { sendJson(res, 400, { ok: false }); return }
      const rawName = String(u.searchParams.get('name') || '').replace(/[\\/]/g, '').trim().slice(0, 160)
      const m = rawName.match(MUSIC_EXT_RE)
      if (!m) { sendJson(res, 400, { ok: false, error: '只支持 mp3 / wav / ogg / m4a / aac / flac' }); return }
      const bytes = await readRawBody(req, 100 * 1024 * 1024)
      if (!bytes || !bytes.length) { sendJson(res, 413, { ok: false, error: '文件为空或超过 100MB' }); return }
      const ext = m[0].toLowerCase()
      const stamp = Date.now().toString(36)
      const rand = Math.random().toString(36).slice(2, 8)
      const file = 'music-' + stamp + '-' + rand + ext
      try {
        fs.mkdirSync(MUSIC_DIR, { recursive: true })
        fs.writeFileSync(path.join(MUSIC_DIR, file), bytes)
        const list = readMusicIndex()
        list.unshift({ file, name: rawName.replace(MUSIC_EXT_RE, '').slice(0, 80) || file, size: bytes.length, added: Date.now() })
        writeMusicIndex(list.slice(0, 60))
        sendJson(res, 200, { ok: true, file, name: rawName.replace(MUSIC_EXT_RE, ''), size: bytes.length })
      } catch (err) { sendJson(res, 500, { ok: false, error: String((err && err.message) || err) }) }
```

</details>

**依据 3 · 源码核查**：[lib/host-startup.js:807-822](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/host-startup.js#L807-L822)

随机模板能力token与范围/截止。

<details>
<summary>查看原文（16行）</summary>

```text
    path: ROUTE_BASE + '/frame-session',
    handler: async (req, res) => {
      if ((req.method || 'GET').toUpperCase() !== 'POST') { sendJson(res, 405, { ok: false, error: 'method not allowed' }); return }
      try {
        const text = await readBody(req, 8 * 1024)
        let payload = {}
        try { payload = text ? JSON.parse(text) : {} } catch (err) { sendJson(res, 400, { ok: false, error: 'invalid json' }); return }
        const id = String((payload && payload.id) || '')
        const hit = resolveTemplateDir(id)
        if (!hit) { sendJson(res, 404, { ok: false, error: 'template not found' }); return }
        const now = Date.now()
        pruneFrameTokens(now)
        while (frameTokens.size >= 200) { const oldest = frameTokens.keys().next(); if (oldest.done) break; frameTokens.delete(oldest.value) }
        const token = randomBytes(32).toString('hex')
        frameTokens.set(token, { id, root: hit.root, untrusted: hit.untrusted, expires: now + 10 * 60 * 1000 })
        sendJson(res, 200, { ok: true, token, expires: now + 10 * 60 * 1000, untrusted: hit.untrusted })
```

</details>

**依据 4 · 源码核查**：[lib/host-startup.js:355-390](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/host-startup.js#L355-L390)

startup统一路由fail-closed。

<details>
<summary>查看原文（36行）</summary>

```text
  /** 浏览器信任栅栏：自定义路由必须过一遍，否则可被任意网页读写。
      fail-closed：栅栏自身出错、或宿主没有 connection 服务时一律拒绝，绝不“放行兜底”。 */
  function rejected(req, res) {
    let code = null
    let failure = null
    try {
      const conn = (typeof ctx.get === 'function' ? ctx.get('connection') : undefined) || ctx.connection
      if (!conn || typeof conn.requestRejection !== 'function') {
        failure = new Error('connection guard unavailable')
      } else {
        code = conn.requestRejection(req)
      }
    } catch (err) {
      failure = err
    }
    if (failure) diag('trust guard fail-closed (' + String((failure && failure.message) || failure) + ') url=' + String((req && req.url) || ''))
    const decision = guardDecision(failure ? null : code, failure)
    if (!decision.reject) return false
    try {
      res.statusCode = decision.status
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.end(JSON.stringify({ ok: false, error: decision.reason || 'request rejected' }))
    } catch (err) { /* 响应对象已坏就放弃 */ }
    return true
  }

  function registerRoute(route) {
    const inner = route && route.handler
    const wrapped = Object.assign({}, route, {
      handler: async (req, res) => {
        if (rejected(req, res)) return
        return inner(req, res)
      }
    })
    return webServer.register(wrapped)
```

</details>

**依据 5 · 源码核查**：[lib/host-wallpaper.js:724-738](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/host-wallpaper.js#L724-L738)

wallpaper栅栏缺失或异常返回false放行。

<details>
<summary>查看原文（15行）</summary>

```text
    function rejected(req, res) {
      try {
        const conn = (typeof ctx.get === 'function' ? ctx.get('connection') : undefined) || ctx.connection
        if (!conn || typeof conn.requestRejection !== 'function') return false
        const code = conn.requestRejection(req)
        if (!code) return false
        res.statusCode = code
        res.end()
        return true
      } catch { return false }
    }
    function registerRoute(route) {
      const ws = resolveWebServer(ctx)
      const handler = route.handler
      ws.register(Object.assign({}, route, { handler: (req, res) => (rejected(req, res) ? undefined : handler(req, res)) }))
```

</details>

**依据 6 · 源码核查**：[lib/host-wallpaper.js:623-639](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/host-wallpaper.js#L623-L639)

视频删除是文件或项目目录写操作，有root检查但非只读。

<details>
<summary>查看原文（17行）</summary>

```text
    /** POST /chat-wallpaper/videos/delete —— 删除视频（普通视频删文件；壁纸项目删整个文件夹） */
    const videosDeleteHandler = (req, res) => {
      if ((req.method || 'GET').toUpperCase() !== 'POST') { json(res, 405, { ok: false }); return }
      let body = ''
      req.on('data', (c) => { body += c; if (body.length > 16384) req.destroy() })
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}')
          const cfg = readConfig()
          const item = videoById(cfg, payload.id)
          if (!item) { json(res, 404, { ok: false, error: 'not found' }); return }
          const target = item.kind === 'project' ? item.folder.replace(/\//g, '\\') : item.file.replace(/\//g, '\\')
          if (!isInside(target, item.root)) { json(res, 400, { ok: false, error: 'outside root' }); return }
          if (resolve(target).toLowerCase() === resolve(item.root).toLowerCase()) { json(res, 400, { ok: false, error: 'refuse root' }); return }
          rmSync(target, { recursive: item.kind === 'project', force: true })
          if (cfg.videoId && cfg.videoId === item.id) writeConfig({ ...cfg, videoId: '' })
          json(res, 200, { ok: true, id: item.id, kind: item.kind, deleted: item.kind === 'project' ? item.folder : item.file })
```

</details>

#### 缺口

- 未验证远端/多用户Host的访问隔离与栅栏故障可达性。
  **影响**：不能宣称统一安全、全链路本机隐私或删除总符合用户意图。
  **进一步探讨**：在目标部署审查connection、代理和目录配置，先用无价值媒体验证拒绝与文件范围，保留重要素材备份。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、更新和黑屏恢复有什么负担？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需符合包声明Node与DSH Web/desktop profile，桌面安装器另依赖Windows PowerShell/CMD。默认外观使用不需模型调用，但媒体、渲染、存储、重启及设置人工时间未知；视频背景会持续占用资源，不能因本地播放称零成本。当前建议观察，重点是它控制首屏且恢复可能需要界面外脚本，收益又主要为个人喜好。

update-apply路由先检查本地ZIP完整、GitHub Release官方SHA256摘要，再生成CMD并spawn外部更新器，返回started:true不是更新已完成。PowerShell脚本临时解压、校验版本、备份旧pkg与startup配置后运行安装器，失败尽力恢复旧目录/配置；恢复自身也可能失败且只是记录日志，不是全系统事务回滚保证。实际安装器对profile的全部修改本次没有完整审计。

应急卸载脚本会备份profile package，再移除boot-suite及两个旧插件依赖、bundles和对应node_modules目录，需要用户先完全退出DSH；它不是界面开关，也不是普通跨平台方案。只关启动或壁纸不等删除已导入媒体。想继续评估应在可恢复安装上先验禁用和黑屏恢复，再考虑可选媒体/更新；若首屏卡住、字体对比不足或恢复路径不明确，停止并回原生界面。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:55-68](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/package.json#L55-L68)

Node和Web插件声明。

<details>
<summary>查看原文（14行）</summary>

```text
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
  },
  "author": "沈宏宏 · LeeRolling",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/LeeRolling/dsh-boot-suite.git"
  },
  "homepage": "https://github.com/LeeRolling/dsh-boot-suite#readme",
```

</details>

**依据 2 · 源码核查**：[lib/host-startup.js:2009-2056](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/host-startup.js#L2009-L2056)

更新摘要、外部CMD/PowerShell启动与started返回。

<details>
<summary>查看原文（48行）</summary>

```text
  /* 自动更新：启动外部更新器（本进程不能替换自己，必须等 DSH 退出） */
  disposers.push(registerRoute({
    kind: 'exact',
    path: ROUTE_BASE + '/update-apply',
    handler: async (req, res) => {
      if ((req.method || 'GET').toUpperCase() !== 'POST') { sendJson(res, 405, { ok: false, error: 'method not allowed' }); return }
      try {
        const rel = await readLatestRelease(false)
        const version = rel.latest
        const zip = path.join(DSH_HOME, 'boot-suite-updates', version + '.zip')
        if (!fs.existsSync(zip)) throw new Error('安装包不存在，请先下载')
        /* 启动更新器前再校验一次：坏包直接删掉并让用户重下，避免更新器先解压再报“找不到中央目录” */
        let zbuf = null
        try { zbuf = fs.readFileSync(zip) } catch (e0) { throw new Error('安装包读取失败：' + String((e0 && e0.message) || e0)) }
        if (!zipComplete(zbuf, rel.size || 0)) {
          try { fs.unlinkSync(zip) } catch (e1) {}
          diag('update-apply rejected corrupt zip size=' + zbuf.length)
          throw new Error('安装包不完整或已损坏（zip 校验失败，' + zbuf.length + ' 字节），已删除，请重新下载后再更新')
        }
        const digestHex = parseDigest(rel.digest)
        if (!digestHex) throw new Error('最新发布缺少官方 SHA-256 摘要，已拒绝更新（请等发布修复后的版本）')
        if (!digestMatches(zbuf, rel.digest).ok) {
          try { fs.unlinkSync(zip) } catch (e2) {}
          diag('update-apply rejected digest mismatch size=' + zbuf.length)
          throw new Error('安装包 SHA-256 与官方发布不一致，已删除，请重新下载后再更新')
        }
        const exe = process.execPath
        const script = path.join(PACKAGE_ROOT, 'tools', 'update-apply.ps1')
        if (!fs.existsSync(script)) throw new Error('找不到更新脚本')
        const q = (s3) => "'" + String(s3).replace(/'/g, "''") + "'"
        const inner = '& ' + q(script) + ' -Zip ' + q(zip) + ' -Version ' + q(String(version)) + ' -Exe ' + q(exe) + ' -Config ' + q(CONFIG_FILE) + ' -Digest ' + q('sha256:' + digestHex)
        const encoded = Buffer.from(inner, 'utf16le').toString('base64')
        const outDir = path.join(process.env.LOCALAPPDATA || DSH_HOME, 'dsh-boot-suite-update')
        fs.mkdirSync(outDir, { recursive: true })
        const cmdFile = path.join(outDir, 'run-update.cmd')
        const cmdText = '@echo off' + String.fromCharCode(13, 10) + 'powershell.exe -NoProfile -ExecutionPolicy Bypass -EncodedCommand ' + encoded + String.fromCharCode(13, 10)
        fs.writeFileSync(cmdFile, cmdText, 'ascii')
        const bootLog = path.join(DSH_HOME, 'boot-suite-updates', 'update-apply-bootstrap.log')
        fs.mkdirSync(path.dirname(bootLog), { recursive: true })
        const blog = (m) => { try { fs.appendFileSync(bootLog, new Date().toISOString() + '  ' + m + String.fromCharCode(10)) } catch (e) {} }
        blog('cmd file=' + cmdFile)
        /* F-09：shell:true + 路径含空格时 .cmd 会静默不执行；显式 cmd.exe /c */
        const child = spawn('cmd.exe', ['/c', cmdFile], { detached: true, stdio: 'ignore', windowsHide: false })
        child.on('error', (eC) => blog('launch error: ' + String((eC && eC.message) || eC)))
        child.unref()
        blog('launched pid=' + (child.pid || '?'))
        diag('update-apply launched updater window v' + version)
        sendJson(res, 200, { ok: true, version, started: true, manualClose: true })
```

</details>

**依据 3 · 源码核查**：[tools/update-apply.ps1:110-182](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/tools/update-apply.ps1#L110-L182)

候选目录、旧目录配置备份、安装器与尽力恢复。

<details>
<summary>查看原文（73行）</summary>

```text
  $bk = Join-Path $work 'backup'
  New-Item -ItemType Directory -Force -Path $bk | Out-Null
  if (Test-Path $Config) { Copy-Item $Config (Join-Path $bk 'dsh-startup.json') -Force }

  Log '解压新版本到临时目录…'
  if (Test-Path $pkgNew) { Remove-Item $pkgNew -Recurse -Force -ErrorAction SilentlyContinue }
  New-Item -ItemType Directory -Force -Path $pkgNew | Out-Null
  try {
    Expand-Archive -Path $Zip -DestinationPath $pkgNew -Force -ErrorAction Stop
  } catch {
    Fail ('解压失败（安装包可能损坏）：' + $_.Exception.Message)
  }

  $pkgJson = Join-Path $pkgNew 'package.json'
  if (-not (Test-Path $pkgJson)) { Fail '解压后没有 package.json' }
  $bytes = [System.IO.File]::ReadAllBytes($pkgJson)
  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    [System.IO.File]::WriteAllBytes($pkgJson, $bytes[3..($bytes.Length - 1)])
    Log '已移除 package.json 的 BOM'
  }
  try {
    $obj = [System.IO.File]::ReadAllText($pkgJson, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
  } catch {
    Fail ('包内 package.json 不是合法 JSON：' + $_.Exception.Message)
  }
  if ([string]$obj.version -ne $Version) { Fail ('版本不匹配：包内为 ' + $obj.version + '，期望 ' + $Version) }
  Log ('临时目录校验通过：v' + $obj.version)

  $hadOld = Test-Path $pkg
  if (Test-Path $pkgOld) { Remove-Item $pkgOld -Recurse -Force -ErrorAction SilentlyContinue }
  if ($hadOld) {
    Log '备份旧版本目录…'
    Move-Item $pkg $pkgOld -Force
  }
  try {
    Move-Item $pkgNew $pkg -Force
  } catch {
    if ($hadOld -and (Test-Path $pkgOld)) { Move-Item $pkgOld $pkg -Force }
    Fail ('替换目录失败：' + $_.Exception.Message)
  }
  Log '新版本目录已就位（旧目录已备份，安装成功后清理）'

  Log '运行安装器（可能需要几十秒）…'
  $installer = Join-Path $pkg 'tools\install.ps1'
  if (-not (Test-Path $installer)) { Fail '安装包里没有 tools/install.ps1' }
  $proc = Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File', $installer) -Wait -PassThru -NoNewWindow
  if ($proc.ExitCode -ne 0) { Fail ('安装器退出码 ' + $proc.ExitCode) }

  Log '安装完成，清理旧版本目录…'
  if (Test-Path $pkgOld) { Remove-Item $pkgOld -Recurse -Force -ErrorAction SilentlyContinue }
  Log '回滚按钮已就绪：桌面上「紧急回滚-V<旧版本>」可在新版打不开时用；更新成功后旧按钮已被安装器自动清理。'

  Log '正在重新打开 DSH…'
  if (Test-Path $Exe) { Start-Process -FilePath $Exe } else { Log '找不到 DSH 可执行文件，请手动打开客户端' }
  Log '更新成功。本窗口 10 秒后自动关闭。'
  Start-Sleep -Seconds 10
  exit 0
} catch {
  Log ('更新失败：' + $_.Exception.Message)

  try {
    if ($hadOld -and (Test-Path $pkgOld)) {
      if (Test-Path $pkg) { Remove-Item $pkg -Recurse -Force -ErrorAction SilentlyContinue }
      Move-Item $pkgOld $pkg -Force
      Log '已恢复旧版本目录。'
    }
  } catch { Log ('恢复旧版本目录失败：' + $_.Exception.Message) }

  try {
    $bk = Join-Path $work 'backup'
    if (Test-Path (Join-Path $bk 'dsh-startup.json')) { Copy-Item (Join-Path $bk 'dsh-startup.json') $Config -Force }
    Log '配置已恢复。'
  } catch {}
```

</details>

**依据 4 · 源码核查**：[tools/emergency-uninstall.ps1:28-58](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/tools/emergency-uninstall.ps1#L28-L58)

应急卸载对profile选择与依赖修改。

<details>
<summary>查看原文（31行）</summary>

```text
} else {
  foreach ($p in @('desktop', 'web')) { if (Test-Path (Join-Path $profilesRoot $p)) { $targets += $p } }
}
if ($targets.Count -eq 0) { Die '没有找到 desktop / web profile。' }

$pluginNames = @('dsh-boot-suite', 'dsh-startup-screen', 'dsh-chat-wallpaper')
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'

foreach ($profile in $targets) {
  $dir = Join-Path $profilesRoot $profile
  $pj = Join-Path $dir 'package.json'
  Say ''
  Say ('=== profile: ' + $profile + ' ===')
  if (-not (Test-Path $pj)) { Say '  （没有 package.json，跳过）'; continue }

  $bk = Join-Path $dir ('_backup-uninstall-' + $stamp)
  New-Item -ItemType Directory -Force -Path $bk | Out-Null
  Copy-Item $pj (Join-Path $bk 'package.json') -Force
  Say ('  备份 → ' + $bk)

  # 1) 从 dependencies 删掉（直接改 JSON，不依赖 pnpm/npm 是否可用）
  $pkg = [System.IO.File]::ReadAllText($pj) | ConvertFrom-Json
  $removed = @()
  if ($pkg.dependencies) {
    foreach ($name in $pluginNames) {
      if ($pkg.dependencies.PSObject.Properties[$name]) {
        $pkg.dependencies.PSObject.Properties.Remove($name)
        $removed += $name
      }
    }
  }
```

</details>

**依据 5 · 源码核查**：[tools/emergency-uninstall.ps1:59-93](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/tools/emergency-uninstall.ps1#L59-L93)

bundles/node_modules清理与重启核对。

<details>
<summary>查看原文（35行）</summary>

```text

  # 2) bundles 列表清理
  $keep = @()
  if ($pkg.dsh -and $pkg.dsh.profile -and $pkg.dsh.profile.bundles) {
    foreach ($b in @($pkg.dsh.profile.bundles)) {
      if ($b -in $pluginNames) { continue }
      $keep += $b
    }
    $pkg.dsh.profile.bundles = $keep
  }
  [System.IO.File]::WriteAllText($pj, ($pkg | ConvertTo-Json -Depth 20), (New-Object System.Text.UTF8Encoding($false)))
  Say ('  依赖已移除：' + (($removed -join ', ') -replace '^$', '（本来就没有）'))
  Say ('  bundles = ' + (($keep -join ', ') -replace '^$', '（空）'))

  # 3) 删 node_modules 里的链接/目录
  $nm = Join-Path $dir 'node_modules'
  if (Test-Path $nm) {
    foreach ($name in $pluginNames + @('dsh-boot-suite-link')) {
      $inst = Join-Path $nm $name
      if (-not (Test-Path $inst)) { continue }
      $item = Get-Item $inst -Force
      try {
        if ($item.LinkType) { cmd /c rmdir "$inst" | Out-Null }
        else { Remove-Item $inst -Recurse -Force -ErrorAction SilentlyContinue }
        Say ('  已删除 node_modules\' + $name)
      } catch { Say ('  [!] 删除失败：' + $inst) }
    }
  }
  # 4) 残留 lockfile 备份，不删
}

Say ''
Say '完成。请重新打开 DeepSeek Harness，确认界面恢复且没有开机动画。'
Say '如果仍有动画：说明还有第二份安装（另一个 profile 或另一个插件目录），'
Say '请双击「诊断.cmd」生成报告发给作者。'
```

</details>

#### 缺口

- 实际Windows更新、中断、profile恢复和跨平台资源成本未验。
  **影响**：不能把有回滚脚本当已验收无损更新，不能推荐长期采用。
  **进一步探讨**：在可丢弃安装分别验禁用、坏包、外部更新器失败和界面外卸载，核对profile和媒体保留范围。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能推导什么可验证的首屏设计方向？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

值得借鉴的是把媒体播放的等待纳入统一取消/释放，给首屏根节点设置兜底，更新使用发布摘要检查并在候选目录校验。它们是资源生命周期与来源完整性的已有方法在外观插件中的组合，不能据此认定动画增效或当前所有退出都可靠。壁纸与startup请求栅栏不一致也说明“合并成一个包”不代表边界自动统一。

未验证方向是把首屏当可随时退出的非阻塞装饰：始终保留独立可见的进入聊天入口，将音视频与聊天就绪分离，并让所有路由统一使用同一拒绝策略。相对当前方案改变的是可达性和策略一致性，而不是加入更多媒体；代价是少些沉浸效果、更多生命周期状态和维护检查。

最小实验比较原生、当前首屏和非阻塞版本在慢媒体、禁止自动播放、iframe失联及栅栏故障下的进入聊天耗时、黑屏比例、无意播放与拒绝一致性。若不改善可达性或娱乐用户明确不愿保留，则收窄或放弃；本次未实现该方向，也不把它计入当前已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/splash.js:3938-3983](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/splash.js#L3938-L3983)

统一释放为取消设计的依据。

<details>
<summary>查看原文（46行）</summary>

```text
  function finish() {
    bgm.stop()
    if (iframeCleanup) { try { var cleanIframe = iframeCleanup; iframeCleanup = null; cleanIframe() } catch (eIframe) { /* noop */ } }
    if (finished) return
    diagRun('finish videos=' + videoCount())
    finished = true
    invalidateRun()   /* 取消体系：本次播放的延时任务全部作废 */
    /* v2.12.0：转场覆盖层兜底清理。transOut 的「揭开」阶段要保留覆盖层，
       此时 transPreserve=true，由 transPlayReveal 负责移除。 */
    if (!transPreserve) { try { transCleanup() } catch (eTrans) { /* 忽略 */ } }
    audio.bedStop()   /* 本地补丁：通道常开，到这里才关 */
    releaseAll()
    stopHex()
    voice.stop()
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null }
    try {
      if (C.mode === 'session') window.sessionStorage.setItem('dsh-startup-screen:shown', '1')
      if (C.mode === 'daily') {
        window.localStorage.setItem('dsh-startup-screen:day', new Date().toISOString().slice(0, 10))
      }
    } catch (err) { /* 隐私模式下不可写，忽略 */ }
    /* 解锁：Host 注入的关键样式用 html.dsu-lock 锁滚动，这里必须一并摘掉，
       否则揭幕后主界面会永远滚不动。 */
    /* 标题栏还回去：移除探针样式会让 DSH 重新测量一次，恢复它自己的颜色 */
    try {
      var capStyle = document.getElementById('dsh-startup-caption')
      if (capStyle && capStyle.parentNode) capStyle.parentNode.removeChild(capStyle)
    } catch (e3) { /* noop */ }
    document.documentElement.classList.remove('dsu-lock')
    document.documentElement.style.overflow = ''
    if (document.body) document.body.style.overflow = ''
    root.classList.remove('dsu-boot')
    /* 正常揭幕时内容与底色都已经淡完，只剩收尾；跳过/异常路径没走两段，用 dsu-gone 兜一层。 */
    var faded = (root.className || '').indexOf('dsu-handoff') !== -1
    root.classList.add('dsu-gone')
    setTimeout(function () {
      if (root && root.parentNode) root.parentNode.removeChild(root)
      try { window.dispatchEvent(new CustomEvent('dsh-startup:done')) } catch (err) { /* noop */ }
    }, faded ? ms(200) : ms(900))
  }

  function requestSkip() {
    if (skipped || finished) return
    skipped = true
    releaseAll()
    finish()
```

</details>

**依据 2 · 源码核查**：[lib/splash.js:568-579](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/splash.js#L568-L579)

boot状态兜底限定范围。

<details>
<summary>查看原文（12行）</summary>

```text
  /* 最后一道保险：无论前面哪一步抛异常，都不许把用户留在黑幕里 */
  setTimeout(function () {
    try {
      var r = document.getElementById(ROOT_ID)
      if (r && r.classList && r.classList.contains('dsu-boot')) {
        if (r.parentNode) r.parentNode.removeChild(r)
        document.documentElement.classList.remove('dsu-lock')
        if (document.body) document.body.style.overflow = ''
        window.__DSH_STARTUP_FAILED__ = true
      }
    } catch (e) { /* 兜底本身不许再抛 */ }
  }, 9000)
```

</details>

**依据 3 · 源码核查**：[lib/host-startup.js:355-390](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/host-startup.js#L355-L390)

startup拒绝策略。

<details>
<summary>查看原文（36行）</summary>

```text
  /** 浏览器信任栅栏：自定义路由必须过一遍，否则可被任意网页读写。
      fail-closed：栅栏自身出错、或宿主没有 connection 服务时一律拒绝，绝不“放行兜底”。 */
  function rejected(req, res) {
    let code = null
    let failure = null
    try {
      const conn = (typeof ctx.get === 'function' ? ctx.get('connection') : undefined) || ctx.connection
      if (!conn || typeof conn.requestRejection !== 'function') {
        failure = new Error('connection guard unavailable')
      } else {
        code = conn.requestRejection(req)
      }
    } catch (err) {
      failure = err
    }
    if (failure) diag('trust guard fail-closed (' + String((failure && failure.message) || failure) + ') url=' + String((req && req.url) || ''))
    const decision = guardDecision(failure ? null : code, failure)
    if (!decision.reject) return false
    try {
      res.statusCode = decision.status
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.end(JSON.stringify({ ok: false, error: decision.reason || 'request rejected' }))
    } catch (err) { /* 响应对象已坏就放弃 */ }
    return true
  }

  function registerRoute(route) {
    const inner = route && route.handler
    const wrapped = Object.assign({}, route, {
      handler: async (req, res) => {
        if (rejected(req, res)) return
        return inner(req, res)
      }
    })
    return webServer.register(wrapped)
```

</details>

**依据 4 · 源码核查**：[lib/host-wallpaper.js:724-738](https://github.com/LeeRolling/dsh-boot-suite/blob/baec191c80fa057cab690997e269392dc9ca841e/lib/host-wallpaper.js#L724-L738)

另一半策略不同，支撑统一边界假设。

<details>
<summary>查看原文（15行）</summary>

```text
    function rejected(req, res) {
      try {
        const conn = (typeof ctx.get === 'function' ? ctx.get('connection') : undefined) || ctx.connection
        if (!conn || typeof conn.requestRejection !== 'function') return false
        const code = conn.requestRejection(req)
        if (!code) return false
        res.statusCode = code
        res.end()
        return true
      } catch { return false }
    }
    function registerRoute(route) {
      const ws = resolveWebServer(ctx)
      const handler = route.handler
      ws.register(Object.assign({}, route, { handler: (req, res) => (rejected(req, res) ? undefined : handler(req, res)) }))
```

</details>

#### 缺口

- 非阻塞设计的可达性收益与娱乐偏好取舍未知。
  **影响**：不能认定是已确认需求或已解决黑屏。
  **进一步探讨**：在同故障矩阵测进入聊天和策略一致性，再由自愿用户判断是否愿意保留。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
