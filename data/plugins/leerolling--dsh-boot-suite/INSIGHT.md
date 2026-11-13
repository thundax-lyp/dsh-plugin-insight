# dsh-boot-suite

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[83645b8](https://github.com/LeeRolling/dsh-boot-suite/tree/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd)

<!-- BEGIN META -->
[![GitHub ★ 139](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=139&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LeeRolling/dsh-boot-suite) [![npm 30d 18,783](https://img.shields.io/static/v1?label=npm+30d&message=18%2C783&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-boot-suite) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-boot-suite)
<!-- END META -->

> **功能**：为 DSH 提供可配置的启动动画、声音、转场和聊天背景，支持导入图片及视频。

> **亮点**：[Q01](#research-q01) 用同一包挂载首屏动画及持久聊天背景。[Q02](#research-q02) 主题、对比度、渐变与 iframe 来源各有实际处理。

> **主要限制**：[Q03](#research-q03) 壁纸管理路由在认证缺失或异常时仍调用处理器。[Q04](#research-q04) Windows 更新脚本含非 PowerShell 注释标记，启动回执也不足以确认更新完成。

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
  - [Q01 · 从冷启动到可操作聊天，首屏通过什么路径释放？](#detail-section-11)
  - [Q02 · 聊天背景和自定义模板依赖哪些宿主与浏览器行为？](#detail-section-12)
  - [Q03 · 连接认证缺失时哪些路由继续响应？](#detail-section-13)
  - [Q04 · 摘要校验和回滚能否证明新版更新可达？](#detail-section-14)
  - [Q05 · 哪些验证足以改变当前观察判断？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：愿意个性化冷启动和聊天背景的 DSH 用户，希望外观变化能随时跳过且可恢复。

原生主题无需额外覆盖启动页面；桌面或浏览器主题可改变外观。插件进一步组合启动转场和聊天区域素材，需要验证宿主版本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 启动动画 | 播放并可跳过首屏 | 依赖宿主注入和浏览器运行时 |
| 聊天背景 | 设置静态图片与循环视频 | 可读性受主题、素材和外壳影响 |
| 模板设置 | 切换内置及导入素材 | 用户 iframe 按来源隔离 |
| 更新入口 | 验证包摘要并尝试启动更新器 | Windows 脚本与回滚须单独验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Host 与 Web 设置插槽 | 主要能力必需 | 提供首屏、背景设置与路由 | 验证自举和认证拒绝，缺服务时保留观察 |
| 浏览器媒体与存储 | 依配置 | 播放视频、声音、记住已播放 | 可能静音、失败或重复播放 |
| Windows PowerShell | 现有内置更新路径必需 | 校验、替换目录及重启 | 先解析固定脚本，更新状态单独核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在隔离 profile 核对启动和媒体路由 | 能在界面外禁用 |
| 验证 | 用内置静态素材对比原生主题 | 正常与异常都能进入聊天 |
| 退出 | 发现权限或恢复异常时停用 | 确认原生聊天可用，保留日志与备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 素材下载与磁盘 | 安装重启、核对设置 | 启动影响待测 |
| 持续 | 音视频及背景渲染 | 核对主题及升级兼容 | 资源占用待测 |
| 失败 | 临时解包和备份空间 | 界面外禁用、修复配置 | 完整恢复路径未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 个性化 | 启动和背景双入口及实际设置 | 偏好、长期保留和性能代价 |
| 恢复 | 动画收尾释放和更新备份路径 | 所有阶段真实可恢复性 |

> **思考**：[Q03](#research-q03) 壁纸管理路由在认证缺失或异常时仍调用处理器。[Q04](#research-q04) Windows 更新脚本含非 PowerShell 注释标记，启动回执也不足以确认更新完成。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 用同一包挂载首屏动画及持久聊天背景。[Q02](#research-q02) 主题、对比度、渐变与 iframe 来源各有实际处理。

首屏标记、取消清理和 iframe 来源隔离可独立复用。透明层与亮度配置依赖外壳，更新先摘要校验但脚本存在语法风险。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 壁纸管理路由在认证缺失或异常时仍调用处理器。[Q04](#research-q04) Windows 更新脚本含非 PowerShell 注释标记，启动回执也不足以确认更新完成。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 保持观察。先核对同版桌面首屏可达、媒体路由拒绝和独立禁用方法，再考虑安装。退出与恢复不清时继续原生主题。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持首屏与背景接线，并显示具体的认证和更新边界。真实桌面播放、端点暴露及更新脚本运行未验证。

- 已检查：作者 README、包清单、源码路径 CHANGELOG.md、README.md、cordis.patch.yml、lib/client.js、lib/host-startup.js、lib/host-wallpaper.js、lib/index.js、lib/open-path.js、lib/splash.js、package.json、tools/update-apply.ps1 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码抽读首屏注入、播放释放、背景管理、媒体隔离、跨平台打开器及 Windows 更新。未执行脚本、插件或宿主。
- 下一步：先静态解析更新脚本，再用隔离 profile 检查脚本故障、认证缺失、退出可达和主题可读性。

**分析版本**

- **仓库**：[LeeRolling/dsh-boot-suite](https://github.com/LeeRolling/dsh-boot-suite)
- **版本号**：2.16.13（[固定提交 83645b8](https://github.com/LeeRolling/dsh-boot-suite/tree/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可以让宿主随时独立绕开首屏动画，并统一管理路由认证失败行为。对比故障条件下首次可输入时间、滚动恢复与请求拒绝，检验设计能否成立。

先静态解析更新脚本，再用隔离 profile 检查脚本故障、认证缺失、退出可达和主题可读性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 104 | 12028 | — | — | 183071 |
| .tsx | source | 19 | 1404 | 1242 | 86 | — |
| .ts | source | 4 | 216 | 165 | 17 | — |
| .mjs | source | 11 | 1590 | 1277 | 200 | — |
| .js | source | 18 | 13937 | 11933 | 1644 | — |
| .mjs | test | 16 | 5528 | 4771 | 446 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/LeeRolling/dsh-boot-suite/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/LeeRolling/dsh-boot-suite/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/LeeRolling/dsh-boot-suite/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：个性化冷启动和聊天背景能否在保持首屏可达、管理权限清楚且更新可退出的前提下值得采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从冷启动到可操作聊天，首屏通过什么路径释放？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

适合自愿在启动时看一段动画、进入聊天后使用自选背景的 DSH 用户。合格结果是可预测地播放、随时跳过并恢复输入与滚动。相比原生主题，增加首屏两段素材、转场和聊天背景的统一设置，但用户也承担冷启动额外时间与兼容风险。任务目标是可退出的外观体验，代码没有提供模型性能改善依据。

Host 先注入关键样式和首屏容器，设置 boot 标记、配置与版本，再用结构化 script-src 启动运行时。空第一幕模板在配置归一化时选默认模板，构造注入行又将读取失败的选择回退到默认模板，修复历史空值导致缺行的路径。客户端用 boot 标记避免重复启动，并有运行时没起来时的自举检查。收尾将旧定时任务失效，停止音乐和配音，释放运行时资源与滚动锁，移除挂载点，再发完成事件。应用还能正常进入取决于各阶段的故障路径和宿主实际注入能力，不能从一条正常收尾函数推断所有黑屏都会恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-36](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/README.md#L19-L36)

作者描述冷启动和聊天背景的实际使用入口。

<details>
<summary>查看原文（18行）</summary>

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

两个半侧**各自独立**：动画坏了不影响壁纸，壁纸坏了不影响动画，界面照常进。
```

</details>

**依据 2 · 源码核查**：[lib/host-startup.js:235-241](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/host-startup.js#L235-L241)

空模板在配置归一化阶段回退。

```text
    out.identityId = String(out.identity).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12)
  }
  if (!String(out.identityId).trim()) out.identityId = 'OPERATOR'
  /* 第一幕没有“不播放”语义：空串 = 内置档案暖白。归一化时就补默认值，
     否则设置页保存的 template:"" 会一路传到首屏注入，导致模板行缺失、动画秒退。 */
  if (!String(out.template || '').trim()) out.template = DEFAULTS.template
  return out
```

**依据 3 · 源码核查**：[lib/host-startup.js:1213-1241](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/host-startup.js#L1213-L1241)

结构化注入挂载点、运行时及默认模板回退。

<details>
<summary>查看原文（29行）</summary>

```text
  function indexInjectionRows() {
    const cfg = readConfig()
    const rows = [
      /* head：先兜底样式，保证首帧就是黑幕，不是 DSH 的启动界面 */
      { kind: 'style', text: CRITICAL_CSS },
      { kind: 'html', placement: 'head', html: '<link rel="stylesheet" href="' + ROUTE_BASE + '/splash.css">' },
      { kind: 'global', name: '__DSH_STARTUP_BOOT__', value: 'index' },
      { kind: 'global', name: '__DSH_STARTUP_VERSION__', value: PLUGIN_VERSION },
      { kind: 'global', name: '__DSH_STARTUP__', value: cfg },
      /* body：挂载点 → 兜底脚本 → 运行时 */
      { kind: 'html', placement: 'body', html: '<div id="dsh-startup-root" class="dsu-root dsu-boot"></div>' },
      { kind: 'script', placement: 'body', text: BOOTSTRAP_JS },
      /* 运行时脚本必须用 script-src（一等公民行），**不能**包在 html 行里：
         桌面端（file:// + IPC）的页面侧解释器按 HTML 文本插入行，innerHTML 里的
         <script> 不会执行 —— 实测脚本标签在文档里躺着、splash.js 从不运行，
         表现为开机动画整段消失、直接进壁纸。DSH 自己的 bundle 也是用 script-src。
         placement=body 让它排在挂载点之后、应用主包之前（不再等主包 2~4 秒）。 */
      { kind: 'script-preload', src: ROUTE_BASE + '/splash.js' },
      { kind: 'script-src', placement: 'body', src: ROUTE_BASE + '/splash.js' }
    ]
    /* 选中的模板以纯数据形式下发（global 行）：运行时只读它，不执行任何代码。
       放在 __DSH_STARTUP__ 之后，保证运行时能同时拿到配置与模板。 */
    /* 双保险：即使旧配置/手工 JSON 里 template 是空串，也回落到内置档案暖白。 */
    const tpl = readTemplate(cfg.template) || readTemplate(DEFAULTS.template)
    let at = 5
    if (tpl) { rows.splice(at, 0, { kind: 'global', name: '__DSH_STARTUP_TEMPLATE__', value: tpl }); at += 1 }
    const tpl2 = readTemplate(cfg.act2)
    if (tpl2) rows.splice(at, 0, { kind: 'global', name: '__DSH_STARTUP_TEMPLATE2__', value: tpl2 })
    return rows
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1978-2005](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/client.js#L1978-L2005)

客户端观察运行时启动并考虑自愈。

<details>
<summary>查看原文（28行）</summary>

```text
    var healDone = false
    function healBlackScreen() {
      try {
        setTimeout(function () {
          try {
            if (typeof window === 'undefined' || typeof document === 'undefined') return
            if (window.__DSH_STARTUP_FAILED__ === true) return
            if (window.__DSH_STARTUP_LOADED__) return
            if (window.__DSH_STARTUP_API__) return
            var root = document.getElementById('dsh-startup-root')
            if (!root) return
            if ((root.className || '').indexOf('dsu-boot') === -1) return
            /* 注意：判据只看"运行时有没有真的跑起来"，不看"文档里有没有 script 标签"。
               2.1.1 就是栽在这上面 —— 标签在文档里但被当成 innerHTML 插进去、永远
               不执行，于是自愈以为"只等就好"，动画彻底不出现。
               这里直接补一次 DOM 注入的 loadScript（这条路实测一定能执行），
               splash.js 自身的 __DSH_STARTUP_LOADED__ 单例守卫会挡住第二次初始化。 */
            healDone = true
            reportDiag('heal: 800ms 运行时未起来，自行注入（boot=' + String(window.__DSH_STARTUP_BOOT__) + '）')
            markBooted()
            injectRoot(window.__DSH_STARTUP__ || {})
          } catch (e) { /* 自愈失败也不能带崩宿主 */ }
        }, 800)
      } catch (e) { /* noop */ }
    }

    /* 启动期错误回传：只关心来自 /dsh-startup/ 的脚本错误 */
    try {
```

</details>

**依据 5 · 源码核查**：[lib/splash.js:3938-3976](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/splash.js#L3938-L3976)

释放声音、异步任务、滚动锁与首屏节点。

<details>
<summary>查看原文（39行）</summary>

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
```

</details>

#### 缺口

- 未核对同版桌面端在样式和脚本故障时的实际首屏
  **影响**：冷启动可达性仍是采用门槛
  **进一步探讨**：在隔离 profile 分别用正常与故障素材，记录首次可操作和跳过恢复时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 聊天背景和自定义模板依赖哪些宿主与浏览器行为？

**研究主题**：工程质量与复用、依赖、兼容与流程、功能与机制

#### 完整回答

聊天背景需要宿主 DOM 与外观变量。新版在亮度复核时同时重判深浅模式，照顾只有 CSS 变量变动、DOM 属性未变的宿主。外壳背景变量设为透明，将侧栏填充交给对应面板类，避免同一变量覆盖整窗；这是特定外壳的适配。设置滑块根据默认渐变比例同时更新两端，零强度时两端透明。其他主题仍可能覆盖变量或改变容器结构，文字可读性需要按实际浅色、深色和视频帧核对。

首屏 iframe 按模板来源划分。用户模板使用 allow-scripts sandbox 并且不加 allow-same-origin，能力会话初始化失败的回退仍保留 sandbox。消息处理核对 iframe source，用户模板只允许发出结束类事件，控制背景音乐的路径仅留给受信内置模板。这个边界允许载入动效同时保留宿主信任区，但不能只凭 sandbox 判断用户素材均可用。浏览器禁用自动播放、媒体解码差异和用户自备资源质量仍影响效果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:2549-2568](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/client.js#L2549-L2568)

亮度复核时重判主题。

<details>
<summary>查看原文（20行）</summary>

```text

    function refreshContrast() {
      if (!current) return
      /* 主题可能只改 CSS 变量、不改 html/body 属性，MutationObserver 抓不到；
         每次亮度复核时顺带重判一次主题，保证浅色/深色切换跟手。 */
      var darkNow = looksDark()
      var wantClass = darkNow ? 'dsh-cw-dark' : 'dsh-cw-light'
      if (themeClass !== wantClass) setThemeClass(darkNow)
      var lum = effectiveLum()
      if (!(lum >= 0)) {
        /* 壁纸还没画出来（或视频未就绪）：先按外观主题给文字一个初值，
           别让侧边栏/输入框在加载空档里没有对比色 */
        setTxtMode(looksDark() ? 'dark' : 'light')
        return
      }
      var mode = lum < 0.45 ? 'dark' : 'light'
      setBgClass(mode)
      setTxtMode(mode)
    }

```

</details>

**依据 2 · 源码核查**：[lib/client.js:2606-2622](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/client.js#L2606-L2622)

外壳透明变量接线。

<details>
<summary>查看原文（17行）</summary>

```text
      if (hasVisual || hasBanner) {
        L.push('/* 让开的只是 html/body 自己的底色 */')
        L.push('html.dsh-cw-light, html.dsh-cw-light body,')
        L.push('html.dsh-cw-dark, html.dsh-cw-dark body { background: transparent !important; }')
        L.push('html.dsh-cw-light body {')
        L.push('  --dsw-alias-bg-base: transparent;')
        /* v2.16.12：这个变量在 DSH 0.2.2 外壳里被当成整窗底色用（不只是侧栏），
           填 sidebarLight/Dark 会变成覆盖整个壁纸的一层膜。侧栏填充改由
           .dsh-cw-panel-* 类负责，这里必须让外壳真正透明。 */
        L.push('  --dsw-specific-sidebar-fill: transparent !important;')
        L.push('}')
        L.push('html.dsh-cw-dark body {')
        L.push('  --dsw-alias-bg-base: transparent;')
        L.push('  --dsw-specific-sidebar-fill: transparent !important;')
        L.push('}')
        /* ── Windows 右上角：最小化 / 最大化 / 关闭 ────────────────────────
           DSH Desktop 的 preload 在 body 里放一个隐藏 span 探针，用它的
```

</details>

**依据 3 · 源码核查**：[lib/client.js:3490-3506](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/client.js#L3490-L3506)

滑块计算和写入两端颜色。

<details>
<summary>查看原文（17行）</summary>

```text
              value: Math.round(veilAlpha * 100), disabled: busy,
              style: { flex: 1 },
              onChange: function (ev) {
                var v = Number(ev.target.value) / 100
                var patch = {}
                /* 滑块是“整体强度”，两端一起缩放；否则只改 A，0% 仍会剩 B 的半层纱。
                   基准取默认渐变（浅 .80/.68，深 .74/.62）：80% 保持默认观感，0% 两端全透明。 */
                var BASE = dark ? { a: 0.74, b: 0.62 } : { a: 0.80, b: 0.68 }
                var k = BASE.a > 0 ? v / BASE.a : 0
                patch[dark ? 'veilDarkA' : 'veilLightA'] = withAlpha(veilNow, Math.min(1, BASE.a * k))
                patch[dark ? 'veilDarkB' : 'veilLightB'] = withAlpha(dark ? data.veilDarkB : data.veilLightB, Math.min(1, BASE.b * k))
                apply(patch, false)
                var d = Object.assign({}, data); d.veil[dark ? 'dark' : 'light'] = v; setData(d)
              }
            }),
            cwH('span', { className: '__ss_status' }, Math.round(veilAlpha * 100) + '%')
          ),
```

</details>

**依据 4 · 源码核查**：[lib/splash.js:1989-2036](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/splash.js#L1989-L2036)

iframe 来源与 sandbox 回退、事件来源检查。

<details>
<summary>查看原文（48行）</summary>

```text
    var entry = String(tpl.entry || 'index.html').replace(/^\/+/, '')
    /* F-03：先向已认证的宿主申请一次性能力 token，再决定 iframe 地址。
       - 用户目录里的模板（untrusted）→ sandbox（无 allow-same-origin），拿不到 DSH Cookie/同源数据
       - 插件自带模板（trusted）→ 不加 sandbox，保留原来的同源注入（样式/Esc/焦点）
       - token 申请失败时退回旧的 template-file 同源地址，避免插件故障时开机动画卡死 */
    var sessionP = fetch('/dsh-startup/frame-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: tpl.id })
    }).then(function (r) { return r.json() }).catch(function () { return { ok: false } })
    return sessionP.then(function (ts) {
      var sandboxed = false
      var frameSrc = ''
      if (ts && ts.ok === true && ts.token) {
        sandboxed = ts.untrusted === true
        frameSrc = '/dsh-startup/template-frame/' + encodeURIComponent(ts.token) + '/' + entry + (C.bigfishForceEgg ? '?egg=1' : '')
      } else {
        /* F-04：能力会话失败时绝不能再退回“同源且无 sandbox”的旧地址——
           那会让用户模板拿到 DSH 同源权限。回退也强制 sandbox，宁可动画能力受限也不放行同源。 */
        diagRun('frame-session failed; fallback template-file (sandboxed)')
        sandboxed = true
        frameSrc = '/dsh-startup/template-file/' + encodeURIComponent(tpl.id) + '/' + entry + (C.bigfishForceEgg ? '?egg=1' : '')
      }
      var wrap = document.createElement('div')
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

- 实际深浅主题、视频解码及不同外壳的可读性没有验证
  **影响**：不能承诺不同宿主版本的视觉和播放一致
  **进一步探讨**：先用内置静态图在两种主题核对聊天文字，再逐项验证视频与模板

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 连接认证缺失时哪些路由继续响应？

**研究主题**：缺陷与关键质疑、功能与机制、依赖、兼容与流程

#### 完整回答

启动模块区分静态素材与管理接口。CSS、JS 及包内按文件名约束的 MP3 路由绕过插件自身的认证栅栏，因此 connection 服务不可用时仍有机会加载首屏素材。其余启动路由通过 requestRejection，缺服务或出错交给默认拒绝逻辑。静态音效受扩展名与目录约束，不能从这条例外推导用户导入文件也免鉴权。

壁纸模块的认证包装在连接认证服务缺失或抛错时返回 false，外层继续调用处理器。实际注册的路由包括修改配置、目录管理和删除视频。删除按扫描清单定位素材，对项目可能递归删除；这与关闭壁纸是两种行为。新版打开目录委托跨平台 helper，能把 ENOENT 等异常收进返回值，但 spawn 事件和一秒兜底的成功都不保证用户看到了窗口。当前组件源码已显示两半的认证缺失行为不同，是否可由某一不受信客户端到达仍要检查宿主路由暴露和上游拒绝。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host-startup.js:359-402](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/host-startup.js#L359-L402)

默认启动栅栏异常拒绝，只有 guard=false 静态路由例外。

<details>
<summary>查看原文（44行）</summary>

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
    /* 静态资源（splash.js/css、音效）不碰用户数据，不挂信任栅栏：
       桌面端 0.2.2 的 connection 服务不可用时，栅栏 fail-closed 会把
       script 请求一起拒掉，表现为 failed to load /dsh-startup/splash.js。 */
    if (route && route.guard === false) {
      const clean = Object.assign({}, route)
      delete clean.guard
      return webServer.register(clean)
    }
    const wrapped = Object.assign({}, route, {
      handler: async (req, res) => {
        if (rejected(req, res)) return
        return inner(req, res)
      }
    })
    return webServer.register(wrapped)
```

</details>

**依据 2 · 源码核查**：[lib/host-startup.js:457-495](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/host-startup.js#L457-L495)

CSS、JS 和包目录白名单音效实际采用例外。

<details>
<summary>查看原文（39行）</summary>

```text
  disposers.push(registerRoute({
    kind: 'exact',
    guard: false,
    path: ROUTE_BASE + '/splash.css',
    handler: (req, res) => sendText(res, 'text/css; charset=utf-8', readSplashCss())
  }))

  disposers.push(registerRoute({
    kind: 'exact',
    guard: false,
    path: ROUTE_BASE + '/splash.js',
    handler: (req, res) => sendText(res, 'application/javascript; charset=utf-8', readSplashJs())
  }))

  /* 音频素材：从用户提供的音轨里抠出来的音效（选项/确认音）。
     只读、白名单、不含子路径 —— 杜绝目录穿越。素材缺失时浏览器会自动回落到合成音。 */
  disposers.push(registerRoute({
    kind: 'prefix',
    guard: false,
    path: ROUTE_BASE + '/asset',
    handler: (req, res) => {
      const decodedAsset = safeDecodeURIComponent((req.url || '').split('?')[0])
      if (decodedAsset === null) { res.writeHead(400); res.end(); return }
      const name = path.basename(decodedAsset)
      if (!/^[a-z0-9._-]+\.mp3$/i.test(name) || name.includes('..')) {
        res.writeHead(404); res.end(); return
      }
      const file = path.join(PACKAGE_ROOT, 'lib', 'assets', name)
      let bytes
      try { bytes = fs.readFileSync(file) } catch (err) {
        res.writeHead(404); res.end(); return
      }
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
        'Content-Length': String(bytes.length)
      })
      res.end(bytes)
    }
```

</details>

**依据 3 · 源码核查**：[lib/host-wallpaper.js:627-644](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/host-wallpaper.js#L627-L644)

按扫描结果删除视频或项目目录。

<details>
<summary>查看原文（18行）</summary>

```text
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
        } catch (e) { json(res, 500, { ok: false, error: String(e && e.message) }) }
      })
```

</details>

**依据 4 · 源码核查**：[lib/host-wallpaper.js:728-757](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/host-wallpaper.js#L728-L757)

壁纸认证异常后继续处理，且挂载写入与删除端点。

<details>
<summary>查看原文（30行）</summary>

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
    }

    /* v2.13.17：开机就把丢图目录建好；老用户/新装用户都不会再看到「?」 */
    try { mkdirSync(wallpaperImageDir(), { recursive: true }) } catch { /* 忽略 */ }
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/config', handler: configHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/image', handler: imageHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/images', handler: imagesHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/set', handler: setHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/open-dir', handler: openDirHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/videos', handler: videosHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/video', handler: videoHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/video-preview', handler: videoPreviewHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/videos/delete', handler: videosDeleteHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/videos/roots', handler: videoRootsHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/status', handler: statusHandler }))
```

</details>

**依据 5 · 源码核查**：[lib/host-wallpaper.js:658-665](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/host-wallpaper.js#L658-L665)

打开目录先确认目标在配置根目录内。

```text
          if (action === 'open') {
            const target = raw ? resolve(raw) : defaultVideoRoot()
            const allowed = videoRootList(cfg).some((r) => resolve(r).toLowerCase() === target.toLowerCase())
            if (!allowed) { json(res, 400, { ok: false, error: 'not a configured root' }); return }
            if (!existsSync(target)) mkdirSync(target, { recursive: true })
            const opened = await openTarget(target)
            if (!opened.ok) { json(res, 200, { ok: false, error: '无法打开目录：' + opened.error }); return }
            json(res, 200, { ok: true, opened: target.replace(/\\/g, '/') })
```

**依据 6 · 源码核查**：[lib/open-path.js:49-84](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/open-path.js#L49-L84)

捕获启动错误，但成功只取子进程启动或兜底。

<details>
<summary>查看原文（36行）</summary>

```text
export function openTarget(target, opts = {}) {
  const platform = opts.platform || process.platform
  const picked = opts.cmd
    ? { cmd: String(opts.cmd), args: Array.isArray(opts.args) ? opts.args : [String(target)] }
    : openCommandFor(target, platform)
  const spawnFn = opts.spawnFn || spawn
  const spawnOpts = { detached: true, stdio: 'ignore' }
  if (picked.windowsHide !== undefined) spawnOpts.windowsHide = picked.windowsHide
  return new Promise((resolve) => {
    let settled = false
    let timer = null
    const done = (result) => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      resolve(result)
    }
    /* Node >= 20 的 spawn 一定会发 'spawn' 或 'error' 二者之一，正常不会等到这个兜底；
       留着只是防止将来行为变化时路由永久挂起（ENOENT 的 'error' 在同一 tick 更早到达）。 */
    timer = setTimeout(() => done({ ok: true, cmd: picked.cmd }), 1000)
    if (timer && typeof timer.unref === 'function') timer.unref()
    let child
    try {
      child = spawnFn(picked.cmd, picked.args, spawnOpts)
    } catch (err) {
      done({ ok: false, cmd: picked.cmd, error: errorText(err) })
      return
    }
    /* 关键一步：不监听 'error' 的话，spawn 找不到命令会变成 uncaughtException */
    if (child && typeof child.on === 'function') {
      child.on('error', (err) => done({ ok: false, cmd: picked.cmd, error: errorText(err) }))
      child.on('spawn', () => done({ ok: true, cmd: picked.cmd }))
    } else {
      done({ ok: true, cmd: picked.cmd })
    }
    try { if (child && typeof child.unref === 'function') child.unref() } catch (err) { /* 忽略 */ }
```

</details>

#### 缺口

- 尚未核实目标 Host 如何在插件路由前拒绝未授权请求
  **影响**：影响带副作用接口的部署判断
  **进一步探讨**：用无价值文件、隔离 profile 和不受信请求分别验证缺 connection、拒绝和抛错路径

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 摘要校验和回滚能否证明新版更新可达？

**研究主题**：缺陷与关键质疑、工程质量与复用、效果与总成本

#### 完整回答

更新端先核对摘要，再生成 cmd 文件，以 PowerShell EncodedCommand 调用更新脚本。Host 捕获子进程 error 后写启动日志，但 HTTP 响应直接报告 started，无法证明摘要复核、安装或重启完成。脚本源码设计先比对 SHA-256、必要文件和包版本，正常更新等待退出，备份启动配置和旧插件目录，替换目录并运行安装器。失败时尽力恢复旧目录和启动配置，恢复过程仍能失败，也不覆盖安装器的全部 profile 副作用。

固定提交中的更新脚本第 39 至 40 行将说明写成 /* … */。PowerShell 的块注释标记是 <# 与 #>。这两行不会被当作注释，构成脚本在进入摘要复核和恢复逻辑之前失败的具体风险。作者把这段变更描述为缺 Get-FileHash 时走 .NET SHA256，但仅凭代码不可将其视为已可执行。先用 Windows PowerShell 只解析固定字节，再在隔离配置做 dry-run 与中断验证。首屏能播与更新能成功需要分别验收。

#### 证据与依据

**依据 1 · 作者声明**：[CHANGELOG.md:6-13](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/CHANGELOG.md#L6-L13)

作者说明版本变化含摘要兜底和桌面静态资源调整。

```text
## [2.16.12] — 2026-11-12

- 修复：第一幕配置为 `template: ""`（设置页「内置档案暖白」历史保存值）时不再丢模板行、开机动画秒退；空值/非法 id 统一回落 `archive-warm`（#4）。
- 修复：聊天背景「纱的浓度」滑块改为整体强度，浅色/深色渐变两端一起缩放；0% 两端全透明，不再剩半层纱（#4）。
- 修复：DSH 0.2.2 外壳把 `--dsw-specific-sidebar-fill` 当整窗底色使用，导致壁纸上盖一层白膜；改为 transparent，侧栏填充交给 panel 类（#4 评论）。
- 修复：外观主题切换只在属性变化时更新；亮度复核时同时重判主题，浅色/深色切换即时跟手（#3）。
- 修复：桌面端 0.2.2 `connection` 服务不可用时，splash.js/css 被 fail-closed 信任栅栏一起拒绝；静态资源改为不挂栅栏，路由仍只读、无用户数据（#5）。
- 修复：CI 里 `Get-FileHash` 不存在导致 updater dry-run 失败；改用 .NET SHA256 兜底，并恢复脚本 UTF-8 BOM。
```

**依据 2 · 源码核查**：[lib/host-startup.js:2051-2076](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/host-startup.js#L2051-L2076)

摘要拒绝与只返回启动状态的分界。

<details>
<summary>查看原文（26行）</summary>

```text
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

**依据 3 · 源码核查**：[tools/update-apply.ps1:37-65](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/tools/update-apply.ps1#L37-L65)

固定文件新增非 PowerShell 块注释标记及摘要函数。

<details>
<summary>查看原文（29行）</summary>

```text
function Fail($m) { throw $m }

/* Get-FileHash 在部分 CI/精简 PowerShell 环境里不存在（模块被裁掉），
   这里用 .NET SHA256 兜底，避免更新器 dry-run 在 CI 里整段失败。 */
function Get-Sha256([string]$Path) {
  try { return (Get-FileHash -Path $Path -Algorithm SHA256).Hash.ToLower() } catch { }
  $sha = $null; $fs = $null
  try {
    $sha = [System.Security.Cryptography.SHA256]::Create()
    $fs = [System.IO.File]::OpenRead($Path)
    $bytes = $sha.ComputeHash($fs)
    return ([System.BitConverter]::ToString($bytes) -replace '-', '').ToLower()
  } finally {
    if ($fs) { $fs.Dispose() }
    if ($sha) { $sha.Dispose() }
  }
}

function Test-UpdateZip($path, $expectVersion) {
  if (-not (Test-Path $path)) { Fail ('安装包不存在：' + $path) }
  $fi = Get-Item $path
  Log ('安装包：' + $path)
  Log ('大小：' + $fi.Length + ' 字节')
  $actual = Get-Sha256 $path
  Log ('SHA256：' + $actual)
  $expected = ([string]$Digest).ToLower() -replace '^sha256:', ''
  if ($expected -notmatch '^[0-9a-f]{64}$') { Fail '缺少官方 SHA-256 摘要，拒绝更新（防止安装包被替换）' }
  if ($actual -ne $expected) { Fail ('安装包 SHA-256 与官方发布不一致，拒绝更新。实际 ' + $actual) }
  Log 'SHA256 与官方发布一致'
```

</details>

**依据 4 · 源码核查**：[tools/update-apply.ps1:123-136](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/tools/update-apply.ps1#L123-L136)

退出后备份启动配置并暂存解包。

<details>
<summary>查看原文（14行）</summary>

```text
  Log '已检测到 DSH 退出，开始安装…'

  Log '备份配置…'
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
```

</details>

**依据 5 · 源码核查**：[tools/update-apply.ps1:154-206](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/tools/update-apply.ps1#L154-L206)

交换目录、安装器退出码、恢复范围和失败路径。

<details>
<summary>查看原文（53行）</summary>

```text
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

  if (-not $DryRun) {
    Log '旧版插件应仍可用，正在重新打开 DSH…'
    if (Test-Path $Exe) { Start-Process -FilePath $Exe }
    Log ('请把「更新日志」文件发给作者：' + $log)
    Start-Sleep -Seconds 30
  }
  exit 1
```

</details>

#### 缺口

- 未运行 Windows PowerShell 解析或脚本，没有观察到具体错误码
  **影响**：不能把风险表述为本轮已复现，也不能依赖回滚
  **进一步探讨**：先用 Windows PowerShell Parser.ParseFile 验证固定字节，只有无解析错误才在空 profile 测摘要错误与故障恢复

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些验证足以改变当前观察判断？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

当前建议观察。插件可以提供启动和背景的个性化，但首屏可达和带文件操作的路由边界没有真实宿主验证，更新脚本又存在源码可见的语法问题。频繁进入聊天或不能接受启动延迟的用户可以沿用原生主题。对确有需求的使用者，在获得明确测试授权后用隔离 profile 与内置静态图做对照，依次验收可操作时间、Esc、资源缺失、退出清理、深浅主题可读性和未授权请求拒绝。任一故障使原生聊天无法进入，或管理副作用路由未按预期拒绝，就停止并通过界面外路径禁用。实际安装、网络和磁盘、渲染资源、配置时间以及故障恢复时间分别记录。

未验证的设计假设是将首屏动效从必须释放的覆盖层改成默认可从宿主独立绕开的装饰层，同时让所有管理副作用路由统一在认证不可用时拒绝。比较正常、缺媒体、缺认证和深浅主题变化下的首次可输入时间、滚动释放、错误拒绝与用户保留偏好。若首屏可达性无改善、出现错拦配置或常用主题不可读，则推翻或收窄假设。

#### 证据与依据

**依据 1 · 源码核查**：[lib/splash.js:3938-3976](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/splash.js#L3938-L3976)

现有首屏释放依赖 finish 与对应取消路径。

<details>
<summary>查看原文（39行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/host-wallpaper.js:728-755](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/host-wallpaper.js#L728-L755)

管理副作用和认证异常放行是设计假设的对照。

<details>
<summary>查看原文（28行）</summary>

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
    }

    /* v2.13.17：开机就把丢图目录建好；老用户/新装用户都不会再看到「?」 */
    try { mkdirSync(wallpaperImageDir(), { recursive: true }) } catch { /* 忽略 */ }
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/config', handler: configHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/image', handler: imageHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/images', handler: imagesHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/set', handler: setHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/open-dir', handler: openDirHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/videos', handler: videosHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/video', handler: videoHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/video-preview', handler: videoPreviewHandler }))
    ctx.effect(() => registerRoute({ kind: 'exact', path: '/chat-wallpaper/videos/delete', handler: videosDeleteHandler }))
```

</details>

**依据 3 · 源码核查**：[lib/host-startup.js:2056-2076](https://github.com/LeeRolling/dsh-boot-suite/blob/83645b8aa9e5b9d8f964dc6e29b4c66dc40f8ddd/lib/host-startup.js#L2056-L2076)

页面更新启动响应不能作为退出后恢复判据。

<details>
<summary>查看原文（21行）</summary>

```text
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

#### 缺口

- 没有真实用户偏好和首次可输入时间对照
  **影响**：无法估计个性化收益与采用负担
  **进一步探讨**：先按可达性和拒绝矩阵通过，再同一台机器对照原生与插件并记录用户是否保留

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
