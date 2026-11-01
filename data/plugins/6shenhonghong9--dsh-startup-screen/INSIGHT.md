# dsh-startup-screen

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7f3d283](https://github.com/6shenhonghong9/dsh-startup-screen/tree/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8)

<!-- BEGIN META -->
[![GitHub ★ 666](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=666&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/6shenhonghong9/dsh-startup-screen)
<!-- END META -->

> **功能**：为 DSH 提供可配置的交互式启动动画。

> **亮点**：[Q01](#research-q01) 提供可配置开场，[Q02](#research-q02) 接入宿主首屏与设置。

> **主要限制**：[Q03](#research-q03) 默认交互和声音可能增加负担，信任检查缺失时该层放行，兜底不等于覆盖所有卡死。

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
  - [Q01 · 启动动画相对宿主原生启动提供什么？](#detail-section-11)
  - [Q02 · Host 注入、设置和动画结束如何接线？](#detail-section-12)
  - [Q03 · 跳过、故障兜底和配置访问的边界是什么？](#detail-section-13)
  - [Q04 · 环境、配置与采用退路是什么？](#detail-section-14)
  - [Q05 · 怎样帮助用户判断开场是否会阻碍进入工作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户希望自定义 DSH 打开时的视觉与声音体验。

使用 DSH 原生启动并直接进入界面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 首屏动画 | 提供个性化开场 | 不是实际身份授权 |
| 设置 | 配置交互、音频和文案 | 需兼容宿主与路由 |
| 跳过与兜底 | 允许提前进入或处理未启动 | 不证明所有卡死均恢复 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| DSH Web 或兼容 Desktop | 必需 | 注入与显示 | 启动界面可能不可用 |
| webServer 与 tapIndex | Host 注入需要 | 首屏和配置路由 | Host 跳过，客户端尝试自举 |
| 浏览器存储与音频 | 按模式/音频需要 | 记录播放与声音 | 可能重复或无声 |
| 宿主 connection 信任检查 | 路由保护需要 | 判断请求 | 缺失时该层放行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 隔离 profile 用非敏感文案 | 备份配置 |
| 配置 | 启用跳过并检查声音 | 不需要时禁用 |
| 试用 | 检查键盘及动画结束 | 无法进入时停止 |
| 恢复 | 禁用插件或退出 profile | 核界面与滚动恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 接入 | 本地资源和存储未知 | 配置文案与兼容核对 | Host 路由依赖 |
| 启动 | 动画与音频资源未知 | 交互和等待 | 具体时长未测 |
| 恢复 | 成本未知 | 查错误并禁用 | 兜底覆盖范围有限 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 开场 | 注入动画并注册设置 | 用户体验和启动耗时 |
| 跳过 | 配置允许时响应按钮和 Esc | 所有故障可退出 |
| 结束 | 清理根节点和部分状态 | 所有环境完全恢复 |

> **思考**：[Q03](#research-q03) 默认交互和声音可能增加负担，信任检查缺失时该层放行，兜底不等于覆盖所有卡死。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供可配置开场，[Q02](#research-q02) 接入宿主首屏与设置。

[Q03](#research-q03) 启动前 9 秒兜底不覆盖所有运行中问题；信任服务缺失或异常时该检查放行。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 默认交互和声音可能增加负担，信任检查缺失时该层放行，兜底不等于覆盖所有卡死。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在测试 profile 使用非敏感文案并保留跳过，检查键盘与声音；无法进入时禁用并核原界面。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核查注入、设置、跳过及清理代表路径；未运行宿主或浏览器。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/client.js、lib/splash.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定 README、清单、Host 路由、客户端设置和动画代表路径；未运行 Web、Desktop、音频或目标。
- 下一步：[Q05](#research-q05) 先核现有设置，再注入音频、资源与键盘失败。

**分析版本**

- **仓库**：[6shenhonghong9/dsh-startup-screen](https://github.com/6shenhonghong9/dsh-startup-screen)
- **版本号**：1.3.0（[固定提交 7f3d283](https://github.com/6shenhonghong9/dsh-startup-screen/tree/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设展示启动负担与未知可帮助用户选择；未验证。

[Q05](#research-q05) 先核现有设置，再注入音频、资源与键盘失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 655 | — | — | 6433 |
| .js | source | 3 | 3035 | 2558 | 375 | — |
| .mjs | test | 4 | 1524 | 1292 | 111 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/6shenhonghong9/dsh-startup-screen/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查启动注入、设置、跳过和故障边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 启动动画相对宿主原生启动提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:1-6、24-46 描述在 DSH 启动时播放可交互动画、声音和可调文案；相对直接进入宿主界面，它提供个性化开场，并增加等待或交互。界面的“访问许可”是作者描述的动画文案，所查路径不足以证明实际身份认证或权限控制。审美、品牌体验、耗时和可访问性未实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-6](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/README.md#L1-L6)

作者描述启动界面。

```text
# dsh-startup-screen

DeepSeek Harness 的启动界面与启动动画插件。

黑幕 DeepSeek 标识 → 过曝洗白 → 暖白「技术档案」底板 → 五步交互式访问授权 →
色散故障揭幕。
```

**依据 2 · 作者声明**：[README.md:24-46](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/README.md#L24-L46)

作者描述交互、音频和设置。

<details>
<summary>查看原文（23行）</summary>

```text
## 功能

**开机序列**　冷启动时播一段完整的开机动画，六幕连贯：厂牌标识 → 过曝洗白 →
暖白底板 → 五步授权 → 揭幕。中央一圈环形准星缓慢自转，缺口留在正下方，
不会挡住底部文字。

**液态玻璃底板**　底板、黑幕可以是半透明磨砂玻璃：整窗重磨砂，文字、线条、准星保持锐利。
玻璃不透明度、磨砂模糊、玻璃饱和度、背景模糊各自独立可调，随调随生效；关掉即回到实心底板。

**可交互，不是播片**　第一、二步要你点按钮或按 Enter 才会继续（可以关掉）。
右上角有跳过按钮，Esc 也能跳。

**中文主字 + 英文等宽副标题**　英文副标题逐字打出来，像终端在接收数据。

**真声台词 + 界面音效**　前五句台词取自原片真声，终幕欢迎语是自制落幕词（3.73 秒）；
界面音效取自同一段素材。浏览器要求先有一次点击才准出声，所以点过按钮之后才会听到声音。

**语音没播完不会推进**　每一步停留多久由实际音频时长决定。你点得快也不会把语音掐断。

**两套主题**　暖白与暗色，版式、文字位置、进度条与准星完全一致，只换底色与文字反相。

**三十三项设置**　身份名称、编号、权限等级、配色、速度、音色、语速、
开口留白、每处文案……都能在设置页实时改，改完立即生效。设置页带分类目录与常驻的底部操作条。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:37-48](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/index.js#L37-L48)

默认启动和交互选项。

<details>
<summary>查看原文（12行）</summary>

```text
/** 默认配置：字段与 lib/splash.js 的 DEFAULTS 一一对应。 */
const DEFAULTS = {
  enabled: true,
  mode: 'session',            // always | session | daily
  theme: 'light',             // light | dark
  speed: 1,
  requireInteraction: true,
  allowSkip: true,
  sound: true,                // 界面音效（WebAudio 合成，无音频文件）
  soundVolume: 0.5,
  voice: true,                // 女声播报（Web Speech API）
  voiceLang: 'en',            // en | zh | both
```

</details>

#### 缺口

- 未测真实用户和认证系统
  **影响**：不能将动画当实际授权或证明体验改善
  **进一步探讨**：对照原生启动测试耗时与可访问性。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Host 注入、设置和动画结束如何接线？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

index.js:228-241 取得具有路由和 tapIndex 的 webServer；缺少时 Host 跳过注入并提示客户端自举。194-201 的启动脚本根据 enabled、session/daily 存储决定是否展示，并在时间线未启动时 9 秒后移除遮罩。client.js:289-299、310-325 通过配置 API 读取和保存设置，853-862 注册设置页；splash.js:1407-1410 标记运行并启动卡顿监视，1677-1705 恢复界面、释放部分资源并移除根节点。桌面与浏览器真实接线未运行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:228-241](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/index.js#L228-L241)

缺少 Host 载体时跳过注入。

<details>
<summary>查看原文（14行）</summary>

```text
function apply(ctx) {
  const disposers = []
  const webServer = resolveWebServer(ctx)

  /** 没有可注册路由的 HTTP 载体：桌面端若走 IPC 下发前端就是这种形态。
      什么都不注册（plugin 仍然 APPLIED，不报错），页面由客户端半侧自举。 */
  if (!hasRoutes(webServer)) {
    try {
      ctx.logger?.warn?.(
        '[' + NS + '] 当前 profile 没有可用的 webServer（桌面端可能用 file:// + IPC 下发前端）；' +
        'Host 半侧跳过路由与首屏注入，改由浏览器半侧自举启动界面。'
      )
    } catch (err) { /* 日志失败不影响加载 */ }
    return
```

</details>

**依据 2 · 源码核查**：[lib/index.js:194-202](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/index.js#L194-L202)

启动模式和未启动 9 秒兜底。

```text
const BOOTSTRAP_JS = `(function(){try{
var c=window.__DSH_STARTUP__||{};
var root=document.getElementById('dsh-startup-root');
var off=!c.enabled;
if(!off&&c.mode==='session'&&sessionStorage.getItem('dsh-startup-screen:shown')==='1')off=true;
if(!off&&c.mode==='daily'&&localStorage.getItem('dsh-startup-screen:day')===new Date().toISOString().slice(0,10))off=true;
if(off){window.__DSH_STARTUP_SKIP__=true;if(root&&root.parentNode)root.parentNode.removeChild(root);}
else{document.documentElement.classList.add('dsu-lock');/* 兜底：连 splash.js 都没跑起来（404/被拦/语法错）时，9 秒后无条件放行，绝不锁黑屏。判据是「时间线有没有开始跑」而不是类名 —— dsu-boot 在 run() 之前就被摘掉，按类名判等于永不生效 */setTimeout(function(){try{if(window.__DSH_STARTUP_RUNNING__===true)return;var r=document.getElementById('dsh-startup-root');if(r&&r.parentNode)r.parentNode.removeChild(r);document.documentElement.classList.remove('dsu-lock');if(document.body)document.body.style.overflow='';window.__DSH_STARTUP_FAILED__=true;}catch(e){}},9000);}
}catch(e){} })()`
```

**依据 3 · 源码核查**：[lib/client.js:289-299](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/client.js#L289-L299)

客户端读取配置。

<details>
<summary>查看原文（11行）</summary>

```text
        return fetch(API, { headers: { Accept: 'application/json' } })
          .then((r) => r.json())
          .then((j) => {
            if (!j || j.ok !== true) throw new Error((j && j.error) || 'load failed')
            setDraft(Object.assign({}, FALLBACK, j.config))
            setDefaults(Object.assign({}, FALLBACK, j.defaults))
            setDirty(false)
            setFile(j.file || '')
            if (j.version) setVersion(String(j.version))
          })
          .catch((e) => setError('读取配置失败：' + String(e && e.message ? e.message : e)))
```

</details>

**依据 4 · 源码核查**：[lib/client.js:310-325](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/client.js#L310-L325)

客户端提交配置并处理失败。

<details>
<summary>查看原文（16行）</summary>

```text
      function save() {
        if (!draft) return
        setBusy(true); setNotice(null); setError(null)
        fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patch: draft })
        })
          .then((r) => r.json())
          .then((j) => {
            if (!j || j.ok !== true) throw new Error((j && j.error) || 'save failed')
            setDraft(j.config)
            setDirty(false)
            setNotice('已保存。下次打开 DSH 生效；点「立即预览」可以先看效果。')
          })
          .catch((e) => setError('保存失败：' + String(e && e.message ? e.message : e)))
```

</details>

**依据 5 · 源码核查**：[lib/client.js:850-862](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/client.js#L850-L862)

客户端自举和设置页注册。

<details>
<summary>查看原文（13行）</summary>

```text
    /* ── 插件 ────────────────────────────────────────────────────────────── */
    var inject = ['slots']

    function apply(ctx) {
      /* 桌面端兜底：Host 的 index 注入不生效时，由这里自举启动界面。
         正常 web 流程下 __DSH_STARTUP__/__DSH_STARTUP_BOOT__ 已就位，本调用直接返回。 */
      selfBoot()
      ctx.slots.inject('settings.section', function () {
        return ctx.slots.register(
          { name: 'settings.section', id: 'startup-screen', order: 26, label: '启动动画' },
          function () { return h(Panel, {}) }
        )
      })
```

</details>

**依据 6 · 源码核查**：[lib/splash.js:1407-1410](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/splash.js#L1407-L1410)

时间线开始并启用监视。

```text
  function run() {
    /* 标记「时间线真的跑起来了」：9 秒兜底只放行"压根没跑"的情况，不误杀正常播放 */
    window.__DSH_STARTUP_RUNNING__ = true
    armStall()
```

**依据 7 · 源码核查**：[lib/splash.js:1677-1705](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/splash.js#L1677-L1705)

结束与清理代表路径。

<details>
<summary>查看原文（29行）</summary>

```text
  function finish() {
    if (finished) return
    finished = true
    window.__DSH_STARTUP_FINISHED__ = true
    disarmStall()
    /* 揭幕即还原桌面端标题栏（root 被移除时 MutationObserver 还会再兜一次） */
    chromeSync.show()
    try { restoreAppBackdrop() } catch (e) { /* noop */ }
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
    document.documentElement.classList.remove('dsu-lock')
    document.documentElement.style.overflow = ''
    if (document.body) document.body.style.overflow = ''
    root.classList.remove('dsu-boot')
    root.classList.add('dsu-gone')
    setTimeout(function () {
      if (root && root.parentNode) root.parentNode.removeChild(root)
      try { window.dispatchEvent(new CustomEvent('dsh-startup:done')) } catch (err) { /* noop */ }
    }, ms(900))
```

</details>

#### 缺口

- 未运行 Web 或 Desktop
  **影响**：无法证明启动和恢复均成功
  **进一步探讨**：隔离宿主测正常、资源缺失和退出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 跳过、故障兜底和配置访问的边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

index.js:37-48 默认需要交互且允许跳过；splash.js:1708-1723 仅在 allowSkip 为真时注册按钮及 Escape。index.js:194-202 的 9 秒兜底专门检查时间线没有开始，不能把它当运行中任意卡死的保证；splash.js:1473-1479 对 Promise 链异常调用 finish。index.js:244-255 在 connection 或 requestRejection 缺失、抛错时返回 false，即该层检查放行，不能宣称插件独立验证所有请求。音频、焦点、减少动态效果与全部清理未实测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:37-48](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/index.js#L37-L48)

默认交互、跳过及声音。

<details>
<summary>查看原文（12行）</summary>

```text
/** 默认配置：字段与 lib/splash.js 的 DEFAULTS 一一对应。 */
const DEFAULTS = {
  enabled: true,
  mode: 'session',            // always | session | daily
  theme: 'light',             // light | dark
  speed: 1,
  requireInteraction: true,
  allowSkip: true,
  sound: true,                // 界面音效（WebAudio 合成，无音频文件）
  soundVolume: 0.5,
  voice: true,                // 女声播报（Web Speech API）
  voiceLang: 'en',            // en | zh | both
```

</details>

**依据 2 · 源码核查**：[lib/splash.js:1708-1723](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/splash.js#L1708-L1723)

跳过按配置启用。

<details>
<summary>查看原文（16行）</summary>

```text
  function requestSkip() {
    if (skipped || finished) return
    skipped = true
    releaseAll()
    finish()
  }

  if (C.allowSkip && ui.skip) {
    ui.skip.hidden = false
    ui.skip.addEventListener('click', function (e) { e.stopPropagation(); requestSkip() })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') requestSkip()
    })
  } else if (ui.skip) {
    ui.skip.hidden = true
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:194-202](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/index.js#L194-L202)

时间线未开始的 9 秒兜底。

```text
const BOOTSTRAP_JS = `(function(){try{
var c=window.__DSH_STARTUP__||{};
var root=document.getElementById('dsh-startup-root');
var off=!c.enabled;
if(!off&&c.mode==='session'&&sessionStorage.getItem('dsh-startup-screen:shown')==='1')off=true;
if(!off&&c.mode==='daily'&&localStorage.getItem('dsh-startup-screen:day')===new Date().toISOString().slice(0,10))off=true;
if(off){window.__DSH_STARTUP_SKIP__=true;if(root&&root.parentNode)root.parentNode.removeChild(root);}
else{document.documentElement.classList.add('dsu-lock');/* 兜底：连 splash.js 都没跑起来（404/被拦/语法错）时，9 秒后无条件放行，绝不锁黑屏。判据是「时间线有没有开始跑」而不是类名 —— dsu-boot 在 run() 之前就被摘掉，按类名判等于永不生效 */setTimeout(function(){try{if(window.__DSH_STARTUP_RUNNING__===true)return;var r=document.getElementById('dsh-startup-root');if(r&&r.parentNode)r.parentNode.removeChild(r);document.documentElement.classList.remove('dsu-lock');if(document.body)document.body.style.overflow='';window.__DSH_STARTUP_FAILED__=true;}catch(e){}},9000);}
}catch(e){} })()`
```

**依据 4 · 源码核查**：[lib/splash.js:1473-1479](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/splash.js#L1473-L1479)

动画链异常揭幕。

```text
      /* 六个阶段 */
      .then(function () { return stepLoop() })
      /* 终幕 */
      .then(function () { return finale() })
      .catch(function (err) {
        try { console.warn('[dsh-startup-screen] 动画异常，直接揭幕：', err) } catch (e2) {}
        return finish()
```

**依据 5 · 源码核查**：[lib/index.js:244-255](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/index.js#L244-L255)

宿主信任检查缺失或异常放行。

<details>
<summary>查看原文（12行）</summary>

```text
  /** 浏览器信任栅栏：自定义路由必须过一遍，否则可被任意网页读写。 */
  function rejected(req, res) {
    try {
      const conn = (typeof ctx.get === 'function' ? ctx.get('connection') : undefined) || ctx.connection
      if (!conn || typeof conn.requestRejection !== 'function') return false
      const code = conn.requestRejection(req)
      if (code === undefined || code === null || code === false) return false
      res.statusCode = typeof code === 'number' ? code : 403
      res.end()
      return true
    } catch (err) {
      return false
```

</details>

#### 缺口

- 未测所有卡死、音频和辅助技术
  **影响**：不能保证所有情况可退出或请求已认证
  **进一步探讨**：在隔离宿主注入资源失败及信任服务缺失。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 环境、配置与采用退路是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json 的 Web 客户端和 Node 要求、index.js:228-241 的 Host 载体或客户端自举是运行条件；动画、音频及浏览器存储耗时和资源未知。配置包含用户自定义名称等内容，保存与展示需自行避免敏感资料；禁用跳过可能增加等待，声音和闪动画面可能影响体验。先在测试 profile 启用允许跳过、用非敏感文案并检查键盘和声音，异常时通过设置禁用或退出该 profile，再核原界面。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:46-61](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/package.json#L46-L61)

Web 客户端与 Node 要求。

<details>
<summary>查看原文（16行）</summary>

```text
  },
  "homepage": "https://github.com/6shenhonghong9/dsh-startup-screen#readme",
  "engines": {
    "node": ">=20"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:228-241](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/index.js#L228-L241)

Host 载体缺失的分支。

<details>
<summary>查看原文（14行）</summary>

```text
function apply(ctx) {
  const disposers = []
  const webServer = resolveWebServer(ctx)

  /** 没有可注册路由的 HTTP 载体：桌面端若走 IPC 下发前端就是这种形态。
      什么都不注册（plugin 仍然 APPLIED，不报错），页面由客户端半侧自举。 */
  if (!hasRoutes(webServer)) {
    try {
      ctx.logger?.warn?.(
        '[' + NS + '] 当前 profile 没有可用的 webServer（桌面端可能用 file:// + IPC 下发前端）；' +
        'Host 半侧跳过路由与首屏注入，改由浏览器半侧自举启动界面。'
      )
    } catch (err) { /* 日志失败不影响加载 */ }
    return
```

</details>

**依据 3 · 源码核查**：[lib/index.js:37-48](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/index.js#L37-L48)

交互、跳过和声音默认。

<details>
<summary>查看原文（12行）</summary>

```text
/** 默认配置：字段与 lib/splash.js 的 DEFAULTS 一一对应。 */
const DEFAULTS = {
  enabled: true,
  mode: 'session',            // always | session | daily
  theme: 'light',             // light | dark
  speed: 1,
  requireInteraction: true,
  allowSkip: true,
  sound: true,                // 界面音效（WebAudio 合成，无音频文件）
  soundVolume: 0.5,
  voice: true,                // 女声播报（Web Speech API）
  voiceLang: 'en',            // en | zh | both
```

</details>

**依据 4 · 源码核查**：[lib/splash.js:1708-1723](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/splash.js#L1708-L1723)

跳过条件。

<details>
<summary>查看原文（16行）</summary>

```text
  function requestSkip() {
    if (skipped || finished) return
    skipped = true
    releaseAll()
    finish()
  }

  if (C.allowSkip && ui.skip) {
    ui.skip.hidden = false
    ui.skip.addEventListener('click', function (e) { e.stopPropagation(); requestSkip() })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') requestSkip()
    })
  } else if (ui.skip) {
    ui.skip.hidden = true
  }
```

</details>

#### 缺口

- 未测性能、用户辅助需求及卸载
  **影响**：无法保证兼容或恢复时间
  **进一步探讨**：在隔离 profile 验证键盘、声音及退出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样帮助用户判断开场是否会阻碍进入工作？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有 enabled、allowSkip、session/daily 及部分失败兜底；再加跳过按钮没有增量。设想在设置保存前本地展示本次选择的交互次数、最长已知等待及未知音频/故障分支，并允许用户选择一次性静态预览或关闭；不能把估算展示成启动保证。对照现有设置与跳过，用无声音权限、动画资源失败、需要交互及键盘导航测试进入时间、误以为可跳过和理解负担；若时间不可可靠界定、未知被当确定或妨碍启动则否定。先核现有设置和预览是否已有等价摘要。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:37-48](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/index.js#L37-L48)

已有开关、交互和跳过。

<details>
<summary>查看原文（12行）</summary>

```text
/** 默认配置：字段与 lib/splash.js 的 DEFAULTS 一一对应。 */
const DEFAULTS = {
  enabled: true,
  mode: 'session',            // always | session | daily
  theme: 'light',             // light | dark
  speed: 1,
  requireInteraction: true,
  allowSkip: true,
  sound: true,                // 界面音效（WebAudio 合成，无音频文件）
  soundVolume: 0.5,
  voice: true,                // 女声播报（Web Speech API）
  voiceLang: 'en',            // en | zh | both
```

</details>

**依据 2 · 源码核查**：[lib/index.js:194-202](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/index.js#L194-L202)

已有模式及启动兜底。

```text
const BOOTSTRAP_JS = `(function(){try{
var c=window.__DSH_STARTUP__||{};
var root=document.getElementById('dsh-startup-root');
var off=!c.enabled;
if(!off&&c.mode==='session'&&sessionStorage.getItem('dsh-startup-screen:shown')==='1')off=true;
if(!off&&c.mode==='daily'&&localStorage.getItem('dsh-startup-screen:day')===new Date().toISOString().slice(0,10))off=true;
if(off){window.__DSH_STARTUP_SKIP__=true;if(root&&root.parentNode)root.parentNode.removeChild(root);}
else{document.documentElement.classList.add('dsu-lock');/* 兜底：连 splash.js 都没跑起来（404/被拦/语法错）时，9 秒后无条件放行，绝不锁黑屏。判据是「时间线有没有开始跑」而不是类名 —— dsu-boot 在 run() 之前就被摘掉，按类名判等于永不生效 */setTimeout(function(){try{if(window.__DSH_STARTUP_RUNNING__===true)return;var r=document.getElementById('dsh-startup-root');if(r&&r.parentNode)r.parentNode.removeChild(r);document.documentElement.classList.remove('dsu-lock');if(document.body)document.body.style.overflow='';window.__DSH_STARTUP_FAILED__=true;}catch(e){}},9000);}
}catch(e){} })()`
```

**依据 3 · 源码核查**：[lib/client.js:310-325](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/client.js#L310-L325)

已有保存状态。

<details>
<summary>查看原文（16行）</summary>

```text
      function save() {
        if (!draft) return
        setBusy(true); setNotice(null); setError(null)
        fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patch: draft })
        })
          .then((r) => r.json())
          .then((j) => {
            if (!j || j.ok !== true) throw new Error((j && j.error) || 'save failed')
            setDraft(j.config)
            setDirty(false)
            setNotice('已保存。下次打开 DSH 生效；点「立即预览」可以先看效果。')
          })
          .catch((e) => setError('保存失败：' + String(e && e.message ? e.message : e)))
```

</details>

**依据 4 · 源码核查**：[lib/splash.js:1708-1723](https://github.com/6shenhonghong9/dsh-startup-screen/blob/7f3d2837c1aaef8293abc69093b0a35c80d0f0e8/lib/splash.js#L1708-L1723)

已有跳过。

<details>
<summary>查看原文（16行）</summary>

```text
  function requestSkip() {
    if (skipped || finished) return
    skipped = true
    releaseAll()
    finish()
  }

  if (C.allowSkip && ui.skip) {
    ui.skip.hidden = false
    ui.skip.addEventListener('click', function (e) { e.stopPropagation(); requestSkip() })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') requestSkip()
    })
  } else if (ui.skip) {
    ui.skip.hidden = true
  }
```

</details>

#### 缺口

- 未穷尽设置页且无原型
  **影响**：新增性及收益未知
  **进一步探讨**：先核现有界面，再注入资源与音频失败。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
