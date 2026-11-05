# 550C 开机动画

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[df7d202](https://github.com/yannicksong0106/dsh-550c-boot/tree/df7d202f62088897f476961ef87f408fb525b1ac)

<!-- BEGIN META -->
[![GitHub ★ 218](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=218&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yannicksong0106/dsh-550c-boot) [![npm 30d 10,029](https://img.shields.io/static/v1?label=npm+30d&message=10%2C029&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-550c-boot) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-550c-boot)
<!-- END META -->

> **功能**：为 DSH 加入可跳过的 550C 片头与 UEG 授权动画，可配置声音和身份卡。

> **亮点**：[Q01](#research-q01) 将 550C 原稿移植到宿主，并提供 UEG 交互主题与设置。

> **主要限制**：[Q03](#research-q03) 动画只负责呈现；导入曲库依赖本地配额，更新 POST 可启动宿主 CLI。

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
  - [Q01 · 使用者获得的是哪些启动体验？](#detail-section-11)
  - [Q02 · 为什么需要宿主早期脚本与客户端分开？](#detail-section-12)
  - [Q03 · 音频导入和在线更新有什么独立风险？](#detail-section-13)
  - [Q04 · 想尝试的人怎样控制启动负担？](#detail-section-14)
  - [Q05 · 是否值得按冷启动和热刷新区分播放？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望改变 DSH 启动外观的用户可以先预览片头和授权主题。

使用原始加载页可直接观察宿主状态，静态主题不提供分幕交互。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 启动动画 | 自定义启动界面 | 档位可关闭 |
| 身份卡与声音 | 调整演示和本机音频 | 受解码与存储限制 |
| 更新操作 | 通过宿主 CLI 安装 | profile 和访问条件需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 客户端插槽 | 必需 | 呈现主题和设置 | 设置页或动画可能不可用 |
| 浏览器音频和存储 | 曲库必需 | 导入播放音乐 | 使用无声动画 |
| 受支持的 CLI profile | 内置更新必需 | 应用更新 | 走宿主管理器 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 预览 | 选择档位并试跳过 | 不合适就关闭 |
| 启用 | 刷新或重启验证首帧 | 核查失效后默认页可见 |
| 退出 | 关闭动画或禁用插件 | 确认音乐停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源与音频存储量随文件变化 | 安装和配置耗时未知 | 预览可提前判断 |
| 持续 | 渲染开销未知 | 启动额外等待未测 | 作者档位是名义时长 |
| 恢复 | 重新加载资源开销未知 | 处理存储与插件更新耗时未知 | 有关闭和宿主更新退路 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 启动主题 | 头部注入及互斥可追溯 | 闪屏和耗时实测 |
| 曲库 | 浏览器校验及写入 | 跨设备和存储配额 |

> **思考**：[Q03](#research-q03) 动画只负责呈现；导入曲库依赖本地配额，更新 POST 可启动宿主 CLI。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将 550C 原稿移植到宿主，并提供 UEG 交互主题与设置。

早期覆盖有轮询和时间上限，客户端退场另外清理音乐及覆盖层。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 动画只负责呈现；导入曲库依赖本地配额，更新 POST 可启动宿主 CLI。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先预览和确认跳过可用，再选择启动档位。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码覆盖首帧、客户端生命周期、曲库和更新。没有启动、音频或 CLI 运行结果。

- 已检查：作者 README、包清单、源码路径 README.md、src/login-gate.js、lib/index.js、src/client.js、src/music.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定宿主与客户端代码，未执行浏览器、动画、音频或更新命令。
- 下一步：测冷启动、快速刷新、脚本缺失、禁用及音频格式错误。

**分析版本**

- **仓库**：[yannicksong0106/dsh-550c-boot](https://github.com/yannicksong0106/dsh-550c-boot)
- **版本号**：0.5.2（[固定提交 df7d202](https://github.com/yannicksong0106/dsh-550c-boot/tree/df7d202f62088897f476961ef87f408fb525b1ac)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 只在会话首次打开播放，观察能否减少重复等待。

测冷启动、快速刷新、脚本缺失、禁用及音频格式错误。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 2516 | — | — | 31774 |
| .mjs | source | 19 | 3511 | 2655 | 630 | — |
| .js | source | 19 | 23538 | 9844 | 12611 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/yannicksong0106/dsh-550c-boot/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分装饰动画、宿主启动时序及更新路由的实际作用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 使用者获得的是哪些启动体验？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望个性化 DSH 的用户可配置片头或 UEG 动画。作者把片头原稿归于 Voidpocket，本插件贡献在宿主接线和加入可交互的 UEG 界面。界面有独立跳过和推进事件，授权通过是视觉叙事，没有证据支持它参与登录校验。相比静态主题，它改变打开页面时的交互节奏，但完整档也增加等待。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-17](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/README.md#L13-L17)

定位及自定义功能

```text
**给 DeepSeek Harness 加一段 550C 开机片头，接一段能点着玩的 UEG 访问授权。**

打开 DSH 先看片头。片头之后，你是一名为联合政府工作的操作员 —— 终端在跑、身份卡在核验、地球在转。点击或按 `Enter` 往下走，`Esc` 随时跳过。

0.5.0 起，身份卡上的二维码和片头音乐都可以换成你自己的。
```

**依据 2 · 作者声明**：[README.md:25-49](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/README.md#L25-L49)

档位、授权叙事及跳过

<details>
<summary>查看原文（25行）</summary>

```text
### 🎬 开机片头

- **两个档位**：简易档约 4 秒（logo 书写）／ 完整档约 17 秒（覆写全流程），也可以一键关掉
- **随时跳过**：点一下画面，或按 `Esc`
- **不露馅**：首帧由宿主半边在文档解析阶段就盖上去，DSH 自己的 `HARNESS / Loading plugins…` 卡片不会再闪出来
- **桌面端也照顾到**：片头播放时，窗口右上角那三个系统按钮会跟着变透明，符号色跟着主题走
- **开机音乐**：导入自己的音频，试听、改名、删除、指定曲目。音量和淡出时长（0.5–4 秒）都能调；
  淡出按片头时长提前排程，收在画面结束后约半秒，不会硬切。
  只在 550C 片头播放，曲库存在本机（上限 3.6 MB），所以建议剪 19 秒左右的片段再导入

### 🛰️ UEG 访问授权界面

片头之后可以接着走一段**可交互**的访问授权，一共三幕：

1. **过曝洗白 → 底板擦出** —— 终端、身份卡、地球依次到位
2. **五步授权** —— 身份核验、权限判定、许可证签发，一路打字机 + 语音播报
3. **色散揭幕** —— 终幕把整屏收成一句话

- 点击或按 `Enter` 推进，`Esc` 跳过
- **两套主题**：UEG 联合政府（浅色公文风）／ 550C 控制终端（暗色终端风）
- **可以 DIY 你的身份卡**：操作员姓名、头像、编号、授权等级、签发机构、有效期、许可范围、生物特征
- **二维码也能换成你自己的**：填一段文字或链接，本机编码成二维码；也可以选一张现成的二维码图片，本机识别出内容后按卡片风格重绘。全程不联网
- **结论落定的那一拍**：核验完成时整卡刷过一条读取光带，底部浮出「▸ 核验通过 · ACCESS GRANTED」，文字先乱码再逐字定格，底部竖条随之收平
- **配音**：男声已就绪；女声仍在制作中（界面标着「开发中」）
- **自动播放**：默认开启，也可以改成手动
```

</details>

**依据 3 · 作者声明**：[README.md:119-129](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/README.md#L119-L129)

说明片头原稿和移植归因

<details>
<summary>查看原文（11行）</summary>

```text
MIT © [Ziyang Song](https://github.com/yannicksong0106)

550C 片头动画与 HTML 原稿由 **[Voidpocket](https://github.com/Voidpocket)** 提供；插件工程、移植与 UEG 界面由 **Ziyang Song** 完成。详见 [CREDITS.md](CREDITS.md)。

## 贡献者

| 贡献者 | 分工 |
|---|---|
| **[Ziyang Song](https://github.com/yannicksong0106)** | 项目发起与维护：插件工程与移植、UEG 登录界面、设置页、身份卡二维码（本地编码与识别）、地球陆地点云重烘、核验结论状态条、发布与文档 |
| **[Voidpocket](https://github.com/Voidpocket)** | 550C 片头动画与 HTML 原稿。本项目在这份原稿上做定点移植，配色、面板布局与时间线节奏都出自其手 |
| **[Eileenes](https://github.com/Eileenes)**（提交署名 Duke） | 开机音乐：曲库导入 / 试听 / 重命名 / 删除 / 指定曲目，音量与淡出时长，以及片头结束时的淡出衔接 |
```

</details>

**依据 4 · 源码核查**：[src/login-gate.js:341-386](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/src/login-gate.js#L341-L386)

动画完成事件及交互处理

<details>
<summary>查看原文（46行）</summary>

```text
    play('reveal')
    host.classList.add('dsh550c-login-out')
    timer = window.setTimeout(() => {
      record.dispose()
      document.dispatchEvent(new CustomEvent(LOGIN_DONE_EVENT, { detail: { theme: theme.id } }))
    }, 560)
  }

  function onKey(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      skip()
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      hurry()
    }
  }

  document.addEventListener('keydown', onKey, true)
  host.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('button.skip') !== null) return
    hurry()
  })
  ui.skip.addEventListener('click', (event) => {
    event.stopPropagation()
    skip()
  })

  /** Act 0: the wash blows out, the board wipes on underneath it. */
  function start() {
    play('wash')
    play('sweep')
    timer = window.setTimeout(
      () => {
        play('board')
        play('scanline')
        play('reticle')
        timer = window.setTimeout(advance, Math.round(stepMs() * 0.35))
      },
      Math.round((WASH_MS[speedId] ?? WASH_MS.normal) * 0.55),
    )
  }

  document.body.appendChild(host)
```

</details>

#### 缺口

- 没有用户对照或可操作时间记录
  **影响**：不能判断新鲜感能否抵消启动等待
  **进一步探讨**：以重复打开任务比较偏好和可操作时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 为什么需要宿主早期脚本与客户端分开？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主把样式和脚本插进 HTML 头部，覆盖客户端模块到达之前的原生加载画面。脚本轮询卡片是否出现后消失或丢失 spinner，并以固定定时器作为清理兜底。客户端在模块求值期挂载片头，在 UEG 开启时销毁前一个覆盖层；关闭插件时另有片头、登录及音乐清理。加载时间和动画时间是两个不同指标，消除闪屏的设计无法证明宿主实际启动更快。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:355-382](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/lib/index.js#L355-L382)

首帧和定时退回

<details>
<summary>查看原文（28行）</summary>

```text
const FIRST_FRAME_SCRIPT =
  '(function(){' +
  'var mode=null;var login=null;' +
  'try{mode=window.localStorage.getItem(' +
  JSON.stringify(MODE_KEY) +
  ');login=window.localStorage.getItem("dsh-550c-boot:login")}catch(error){}' +
  'if(mode==="off"&&login!=="ueg")return;' +
  'var root=document.documentElement;' +
  'var watch=null;' +
  'var end=function(){' +
  'if(watch!==null){window.clearInterval(watch);watch=null}' +
  'root.classList.remove("dsh550c-first")' +
  '};' +
  'window.' +
  FIRST_FRAME_GLOBAL +
  '={end:end};' +
  'root.classList.add("dsh550c-first");' +
  'var seen=false;' +
  'watch=window.setInterval(function(){' +
  'var card=document.querySelector("[data-dsh-boot]");' +
  'if(card===null){if(seen)end();return}' +
  'seen=true;' +
  'if(card.querySelector("[data-dsh-boot-spinner]")===null)end()' +
  '},250);' +
  'window.setTimeout(end,' +
  String(FIRST_FRAME_MAX_MS) +
  ');' +
  '})()'
```

</details>

**依据 2 · 源码核查**：[lib/index.js:486-493](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/lib/index.js#L486-L493)

在页面头注入早期脚本

```text
export function apply(ctx) {
  ctx.on('webserver/index-inject', (table) => {
    table.push({ kind: 'style', text: FIRST_FRAME_CSS })
    table.push({ kind: 'script', placement: 'head', text: FIRST_FRAME_SCRIPT })
    // Ahead of the script rows: the settings row reads its own version from here
    // rather than asking the host for something it can already know.
    if (VERSION !== null) table.push({ kind: 'global', name: VERSION_GLOBAL, value: VERSION })
  })
```

**依据 3 · 源码核查**：[src/client.js:813-824](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/src/client.js#L813-L824)

禁用时清理

<details>
<summary>查看原文（12行）</summary>

```text
function installTeardown(ctx) {
  ctx.effect(
    () => () => {
      pluginTornDown = true
      liveLogin?.dispose()
      if (bootSplash !== null) bootSplash.dispose()
      if (liveOverlay !== null) liveOverlay.dispose()
      // 插件被关掉时音乐必须立刻停：那 1.5 秒的淡出是留给片头正常收尾的。
      stopBgm()
    },
    'dsh-550c-boot: splash teardown',
  )
```

</details>

**依据 4 · 源码核查**：[src/client.js:852-875](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/src/client.js#L852-L875)

求值时挂载与互斥

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * Mount the boot splash at MODULE EVALUATION time.
 *
 * This is as early as a client plugin can possibly draw: the factory below runs
 * while the module system is still draining, before cordis has resolved the
 * service graph and called apply(). Every millisecond here is a millisecond of
 * DSH's own "Loading plugins…" card that the splash covers instead.
 *
 * The lifecycle is still owned by the plugin: apply() registers the teardown
 * effect, so disabling the plugin removes whatever this started.
 */
const bootSplash = mountOverlay(false)
// 互斥：UEG 档自带完整的三幕片头，所以 UEG 开着就别再播 550C 片头 ——
// 两者都开会先播 17 秒片头、再播 UEG 三幕，等于两段片头。
// 注意 bootSplash 是 const，只调 dispose()、不重新赋值。
try {
  if (bootSplash !== null && typeof readLoginScreen === 'function' && readLoginScreen() === 'ueg') bootSplash.dispose()
} catch (error) {
  console.error('[dsh-550c-boot] splash exclusion failed', error)
}

exports.name = 'boot-550c'
exports.inject = ['slots']
exports.apply = apply
```

</details>

#### 缺口

- 首帧是否覆盖了所有宿主加载分支未实测
  **影响**：无法保证任何平台都无闪屏
  **进一步探讨**：记录冷启动、加载失败与禁用时的画面序列

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 音频导入和在线更新有什么独立风险？

**研究主题**：缺陷与关键质疑

#### 完整回答

曲库导入先检查 MIME 和时长，再把数据写入 localStorage。索引失败会尝试清理新写数据，浏览器配额和解码错误会返回具体失败。在线更新是独立宿主 POST 路由，判断 profile 和 CLI 后启动安装命令，成功提示重启。它包含宿主状态变更，不能从装饰插件用途推出路由访问规则；已核查 handler 的方法和 profile 判断，部署时还要核对宿主外层访问控制。桌面受管理 profile 有明确拒绝提示。

#### 证据与依据

**依据 1 · 源码核查**：[src/music.js:389-421](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/src/music.js#L389-L421)

格式、解码、存储与回退

<details>
<summary>查看原文（33行）</summary>

```text
  const support = bgmCanPlayType(mime)
  if (support === 'no' || support === '') {
    // AIFF 是 Mac 录音的默认格式，撞上的人不少，单独说一句人话。
    if (mime === 'audio/aiff') {
      return { ok: false, text: 'AIFF 不受支持（Mac 录音默认格式），请转成 WAV 或 MP3。' }
    }
    const label = BGM_FORMAT_LABELS[mime] ?? mime
    return { ok: false, text: '当前环境不支持 ' + label + ' 格式，请转成 MP3 / WAV / OGG。' }
  }
  const duration = await probeBgmDuration(bytes, mime)
  if (duration === null) {
    return { ok: false, text: '文件无法解码，换一个文件试试。' }
  }
  const id = 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  const name = typeof file.name === 'string' && file.name !== '' ? file.name : '未命名'
  try {
    window.localStorage.setItem(BGM_DATA_KEY + id, bytesToBase64(bytes))
  } catch (error) {
    console.error('[dsh-550c-boot] 音频数据存不进去', error)
    return { ok: false, text: '浏览器存储写不下了，请先删除一首再试。' }
  }
  const next = index.concat([{ id: id, name: name, mime: mime, bytes: size, duration: duration, createdAt: Date.now() }])
  if (!writeBgmIndex(next)) {
    try {
      window.localStorage.removeItem(BGM_DATA_KEY + id)
    } catch (error) {
      /* 存不下就算了 */
    }
    return { ok: false, text: '曲库索引写不进去，请重试。' }
  }
  // 第一首曲子直接设为开机曲目：曲库里没有别的东西可播。
  if (readBgmCurrent() === '') writeBgmCurrent(id)
  return { ok: true, text: '已导入 ' + name + '（' + formatBgmDuration(duration) + '）。', id: id }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:259-286](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/lib/index.js#L259-L286)

POST、profile 条件和启动 CLI

<details>
<summary>查看原文（28行）</summary>

```text
async function applyHandler(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { allow: 'POST' })
    res.end()
    return
  }
  await readBody(req).catch(() => '')
  const who = profileInfo()
  if (!who.canApply) {
    sendJson(res, 409, {
      ok: false,
      reason: who.reason,
      profile: who.profile,
      hint:
        who.reason === 'desktop-profile'
          ? `桌面客户端独占管理 desktop profile，请在 设置 → 插件 里安装 ${PACKAGE_NAME}@latest，然后重启客户端。`
          : `无法确定当前 profile，请在插件管理器里安装 ${PACKAGE_NAME}@latest。`,
    })
    return
  }
  const entry = cliEntry()
  if (entry === null) {
    sendJson(res, 409, { ok: false, reason: 'no-cli', hint: `找不到 DSH CLI，请在插件管理器里安装 ${PACKAGE_NAME}@latest。` })
    return
  }
  const command = installCommand(who.profile)
  const result = await new Promise((resolve) => {
    const child = spawn(command.file, command.args, { cwd: process.env.DSH_PROFILE_DIR ?? undefined, windowsHide: true })
```

</details>

**依据 3 · 源码核查**：[lib/index.js:293-320](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/lib/index.js#L293-L320)

进程超时和返回结果

<details>
<summary>查看原文（28行）</summary>

```text
    const timer = setTimeout(() => {
      output += `\n[update] timed out after ${String(APPLY_TIMEOUT_MS)} ms`
      child.kill()
    }, APPLY_TIMEOUT_MS)
    child.on('error', (error) => {
      clearTimeout(timer)
      resolve({ code: null, output: `${output}\n${error.message}` })
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      resolve({ code, output })
    })
  })
  const ok = result.code === 0
  // The row normally checks first, which fills the cache; an apply that arrives on
  // its own looks the version up once more so the answer always names a version.
  const version = ok ? (cachedRelease?.latest ?? (await latestPublished().then((found) => found.latest).catch(() => null))) : null
  sendJson(res, ok ? 200 : 500, {
    ok,
    code: result.code,
    output: result.output.slice(0, APPLY_OUTPUT_LIMIT),
    profile: who.profile,
    package: PACKAGE_NAME,
    restart: ok,
    version,
    hint: ok
      ? '更新完成，重启客户端生效。'
      : `更新失败。也可以在插件管理器里安装 ${PACKAGE_NAME}@latest。`,
```

</details>

#### 缺口

- 未验证外层路由授权和真实更新结果
  **影响**：不能判断非本机部署暴露范围或更新后是否可重启
  **进一步探讨**：先看测试 profile 的访问拒绝并手动验证生命周期

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 想尝试的人怎样控制启动负担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

偏好启动主题的人可在测试 profile 先使用预览，比较简易档与默认启动。若选择 UEG，片头让位。浏览器需要可用的脚本、宿主客户端插槽；音频需要支持对应解码格式及存储。出现额外等待或对设置操作形成阻碍，关闭两个动画并刷新，必要时移除插件。作者给出名义时长，不是本轮机器上的交互延迟。安装和排障耗时未量化。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:83-113](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/README.md#L83-L113)

安装、设置、互斥和平台限制

<details>
<summary>查看原文（31行）</summary>

````text
## 安装

```bash
npm i dsh-550c-boot
```

或者直接在 DSH 里：**设置 → 插件 → 安装** `dsh-550c-boot@latest`。装完重启一次客户端。

---

## 怎么用

```
设置 → 550C
  ├─ 550C 开机动画   选档位（简易 / 完整 / 关闭）、换配色
  └─ UEG 登录界面    选界面、开自动播放、选配音、改身份卡、点「预览」看效果
```

> 片头和 UEG 界面**只能留一个**：UEG 自带完整三幕，所以它开着的时候片头会自动让位。关掉其中一个就能用另一个。

---

## 已知限制

- **女声配音**还在做（界面上标着「开发中」）
- **桌面端不能自动更新**（desktop profile 由客户端独占管理）—— 点「检查更新」会告诉你去「设置 → 插件」里装
- 片头和 UEG 界面互斥，不能同时开
- **开机音乐只存在本机**（曲库上限 3.6 MB，再高会撞浏览器存储配额），不随插件同步，换设备要重新导入
- **音乐要比片头长 2 秒以上**（完整档约 17 秒），否则会先播完、听不到淡出
- **二维码内容建议控制在 80 字节以内**，太长模块会变密、手机不好扫
- **UEG 登录界面开启时不播开机音乐** —— 那里自带配音，避免两个声音打架
````

</details>

**依据 2 · 源码核查**：[src/client.js:773-788](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/src/client.js#L773-L788)

注册设置页

<details>
<summary>查看原文（16行）</summary>

```text
  if (dsh550cGet('bootPageOwned') === true) return
  dsh550cSet('bootPageOwned', true)
  ctx.slots.inject('settings.section', () =>
    ctx.slots.register(
      {
        name: 'settings.section',
        id: '550c',
        order: 30,
        label: () => '550C',
        // 子插槽的声明只在 src/panel.js 里写一次，这里只引用 ——
        // 以后加新动画时不会再出现"页面声明了、行注册的地方忘了改"的崩。
        children: Object.assign({}, PANEL_SLOTS),
      },
      Panel550c,
    ),
  )
```

</details>

**依据 3 · 源码核查**：[src/client.js:813-824](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/src/client.js#L813-L824)

停用清理覆盖层

<details>
<summary>查看原文（12行）</summary>

```text
function installTeardown(ctx) {
  ctx.effect(
    () => () => {
      pluginTornDown = true
      liveLogin?.dispose()
      if (bootSplash !== null) bootSplash.dispose()
      if (liveOverlay !== null) liveOverlay.dispose()
      // 插件被关掉时音乐必须立刻停：那 1.5 秒的淡出是留给片头正常收尾的。
      stopBgm()
    },
    'dsh-550c-boot: splash teardown',
  )
```

</details>

#### 缺口

- 未运行客户端
  **影响**：不能保证键盘跳过、配额及卸载恢复在具体平台成立
  **进一步探讨**：先使用本地预览，随后比对启动和跳过

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 是否值得按冷启动和热刷新区分播放？

**研究主题**：新假设与验证

#### 完整回答

已有可跳过、关闭与预览，可验证同一浏览器会话只在首次启动播放，刷新走快速路径，是否能减少重复进入页面的等待又保留首次个性化体验。对照原版与每会话只播一次，在相同设备测首次与重复可操作时间、跳过频次及主题偏好。如果重复时间没有下降或首次体验明显变差，则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:355-381](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/lib/index.js#L355-L381)

页面每次执行的首帧逻辑

<details>
<summary>查看原文（27行）</summary>

```text
const FIRST_FRAME_SCRIPT =
  '(function(){' +
  'var mode=null;var login=null;' +
  'try{mode=window.localStorage.getItem(' +
  JSON.stringify(MODE_KEY) +
  ');login=window.localStorage.getItem("dsh-550c-boot:login")}catch(error){}' +
  'if(mode==="off"&&login!=="ueg")return;' +
  'var root=document.documentElement;' +
  'var watch=null;' +
  'var end=function(){' +
  'if(watch!==null){window.clearInterval(watch);watch=null}' +
  'root.classList.remove("dsh550c-first")' +
  '};' +
  'window.' +
  FIRST_FRAME_GLOBAL +
  '={end:end};' +
  'root.classList.add("dsh550c-first");' +
  'var seen=false;' +
  'watch=window.setInterval(function(){' +
  'var card=document.querySelector("[data-dsh-boot]");' +
  'if(card===null){if(seen)end();return}' +
  'seen=true;' +
  'if(card.querySelector("[data-dsh-boot-spinner]")===null)end()' +
  '},250);' +
  'window.setTimeout(end,' +
  String(FIRST_FRAME_MAX_MS) +
  ');' +
```

</details>

**依据 2 · 源码核查**：[src/client.js:852-870](https://github.com/yannicksong0106/dsh-550c-boot/blob/df7d202f62088897f476961ef87f408fb525b1ac/src/client.js#L852-L870)

模块求值触发动画

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * Mount the boot splash at MODULE EVALUATION time.
 *
 * This is as early as a client plugin can possibly draw: the factory below runs
 * while the module system is still draining, before cordis has resolved the
 * service graph and called apply(). Every millisecond here is a millisecond of
 * DSH's own "Loading plugins…" card that the splash covers instead.
 *
 * The lifecycle is still owned by the plugin: apply() registers the teardown
 * effect, so disabling the plugin removes whatever this started.
 */
const bootSplash = mountOverlay(false)
// 互斥：UEG 档自带完整的三幕片头，所以 UEG 开着就别再播 550C 片头 ——
// 两者都开会先播 17 秒片头、再播 UEG 三幕，等于两段片头。
// 注意 bootSplash 是 const，只调 dispose()、不重新赋值。
try {
  if (bootSplash !== null && typeof readLoginScreen === 'function' && readLoginScreen() === 'ueg') bootSplash.dispose()
} catch (error) {
  console.error('[dsh-550c-boot] splash exclusion failed', error)
```

</details>

#### 缺口

- 未核查用户重复打开行为
  **影响**：只能作为设计假设
  **进一步探讨**：对照冷启动和重复刷新

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
