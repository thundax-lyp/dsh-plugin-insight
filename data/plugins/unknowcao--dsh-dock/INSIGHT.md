# DSH Dock

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[1dffd8c](https://github.com/UnknowCao/dsh-dock/tree/1dffd8c74f45ed28bc8f8c8956143938efacaa5f)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/UnknowCao/dsh-dock) [![npm 30d 2,366](https://img.shields.io/static/v1?label=npm+30d&message=2%2C366&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dock) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dock)
<!-- END META -->

> **功能**：为 Windows DSH Web 提供桌面启动器、托盘状态、侧栏重启退出入口与可选开机自启。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 通过预编译启动器、认证就绪门、托盘和侧栏集中日常进程控制；源码可解释步骤减少，未验证实际节时或制品对应。

> **主要限制**：[Q03](#research-q03) 侧栏stop在appExit前就200声称已保存，6秒兜底会强退；托盘重启/退出直接Kill监听进程，不能泛化为优雅保存。完成语义需按入口与宿主核验。

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
  - [Q01 · 启动器为谁减少哪些交接？](#detail-section-11)
  - [Q02 · 启动和重启请求怎样从入口成为可见结果？](#detail-section-12)
  - [Q03 · 侧栏退出与托盘退出具有相同保存保证吗？](#detail-section-13)
  - [Q04 · 自动安装、驻留与自启的负担是否值得？](#detail-section-14)
  - [Q05 · 退出结果收据能否减少完成误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向频繁启动DSH Web的Windows个人用户，正确安装/端口、认证页面与会话可恢复是合格标准。

手工终端启动、复制token URL、浏览器全屏和查PID是基线；本包自动化Windows进程交接，不提供新的Agent或持久化算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自动安装套件 | 桌面/launcher生成物 | Windows激活后落盘，卸载不自动删 |
| 认证就绪门 | 避免开陈旧token页面 | HTTP200仅证明页面可打开 |
| 重启请求 | 侧栏交给tray重启 | tray需驻留，accepted非完成 |
| 侧栏退出 | 请求宿主dispose | exitCode契约与强退边界 |
| 托盘重启/退出 | 快速终止监听进程 | 直接Kill，不等同优雅保存 |
| 可选自启 | 登录后驻留启动 | 写HKCU Run，需另行关闭 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Windows10/11、Node/DSH Web | 核心必需 | 后端与native启动 | 非Windows不能按作者桌面流程使用 |
| PowerShell与本机进程权限 | 安装/控制必需 | 目录、候选和进程操作 | 自动安装失败仅告警 |
| Edge或默认浏览器 | 开窗必需 | 专用应用窗口或回退 | 显示就绪不等于模型任务成功 |
| appExit与正确宿主完成语义 | 侧栏优雅退出需要 | dispose和exitCode信号 | 无接口legacy硬杀，超时强退 |
| resident tray | 侧栏重启需要 | 消费request并重启 | 未驻留accepted:false |
| HKCU Run写入 | 可选自启 | 登录启动 | 默认选择和清理需用户核对 |

源码/预编译exe对应未重建，见 [Q01](#research-q01)。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户隔离profile，记录端口/候选并保持自启关闭 | 无重要在途任务 |
| 激活 | Host自动生成suite与桌面exe | 核真实路径/版本，不只看图标 |
| 启动 | C#选候选、取token并HTTP gate开窗 | 页面认证成功，后端任务另验 |
| 重启退出 | 用户逐入口核tray/侧栏结果 | accepted/200非保存确认 |
| 退出套件 | 用户移除插件/生成文件并关自启 | 保留日志/profile，确认无残留进程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 产物/浏览器/Node存储量和金额未知 | profile/端口/AV核对耗时未知 | 自动落盘需接受 |
| 持续 | 托盘轮询/浏览器与后端资源未知 | 版本与候选维护 | 作者耗时不外推 |
| 失败恢复 | 重启/状态损失成本未知 | 核会话、监听PID与文件 | Kill或强退不承诺落盘 |
| 退出 | 残留文件/注册表状态未知 | 手工删生成物、关闭自启 | 移除依赖非全部清理 |

以正确启动并安全恢复的一次任务为单位，未测尝试/合格数不输出单位成本。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 启动集中 | 桌面/托盘与token200 gate | 本机启动时延及制品一致 |
| 重启请求 | watcher+body内存去重 | 跨崩溃/并发精确一次 |
| 侧栏退出 | appExit与exitCode/backstop | 会话耐久与宿主信号可靠 |
| 托盘退出 | 终止监听PID并关窗口 | 与优雅保存不同，结果未验收 |

> **思考**：[Q03](#research-q03) 侧栏stop在appExit前就200声称已保存，6秒兜底会强退；托盘重启/退出直接Kill监听进程，不能泛化为优雅保存。完成语义需按入口与宿主核验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 通过预编译启动器、认证就绪门、托盘和侧栏集中日常进程控制；源码可解释步骤减少，未验证实际节时或制品对应。

[Q02](#research-q02) 认证页面门、watcher唤醒、删除重试和内存去重可借鉴；[Q03](#research-q03) 不同退出路径需统一语义，超时和Kill只能表示进程处理，不能证明业务耐久。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 侧栏stop在appExit前就200声称已保存，6秒兜底会强退；托盘重启/退出直接Kill监听进程，不能泛化为优雅保存。完成语义需按入口与宿主核验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先观察，在无重要会话profile核各入口、候选和生成目录，自启先关闭。状态缺失/端口错位就停套件、关自启并回手工启动核日志；重要任务不依赖200文案判断已保存。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已读取固定C#/构建脚本、Host安装与退出/重启源码；未编译、运行Windows或验证exe对应。退出收据为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、package.json、scripts/build-launcher.ps1、src/DshDockLauncher.cs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件源码：Host自动安装/路由、C#token gate/restart/exit、构建脚本和自启；未全审候选、C#所有渲染/Windows API、宿主完成信号和制品供应链。
- 下一步：未运行目标代码、exe、构建脚本、测试、Windows宿主或模型；最优先是各退出入口的保存/进程对照及二进制对应，不复用作者本机数字为本地结果。

**分析版本**

- **仓库**：[UnknowCao/dsh-dock](https://github.com/UnknowCao/dsh-dock)
- **版本号**：0.8.0（[固定提交 1dffd8c](https://github.com/UnknowCao/dsh-dock/tree/1dffd8c74f45ed28bc8f8c8956143938efacaa5f)）
- **版本日期**：2026-09-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用宿主可信结果状态区分受理/清理/强制/未知，检验能否减少退出误判；现有marker/log为基线，设计未验证。

未运行目标代码、exe、构建脚本、测试、Windows宿主或模型；最优先是各退出入口的保存/进程对照及二进制对应，不复用作者本机数字为本地结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 928 | 651 | 233 | — |
| .js | source | 2 | 2318 | 1773 | 494 | — |
| .md | source | 10 | 1154 | — | — | 21418 |
| .mjs | test | 2 | 454 | 357 | 79 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/UnknowCao/dsh-dock/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/UnknowCao/dsh-dock/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/UnknowCao/dsh-dock/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Windows启动/重启/退出能否减少手工交接，同时让请求受理、进程退出和会话保存的区别可核对？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 启动器为谁减少哪些交接？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Windows上反复启动DSH Web、从日志找token URL、打开浏览器和重启进程的个人用户是直接对象。原办法是终端启动、复制链接、手动全屏和查监听PID；本包提供桌面exe、托盘和侧栏入口，将这些步骤集中。合格结果应是选择预期DSH安装/端口、打开正确已认证页面，并在退出后核清进程与会话，不是桌面出现鲸鱼图标。

package声明DSH bundle与Web client，Host实际注册launcher_install并在Windows激活两秒后自动安装套件，属于原生插件而非单独脚本清单。运行核心是随包预编译C#程序，固定树同时提供源文件与构建脚本。JS安装复制按内容比较，脚本编译命令可追溯，但本次没有构建重现，不能证明提交exe与C#字节对应或无额外行为。

增量是Windows进程/浏览器/配置的交接自动化，不是新的Agent或会话持久化算法。README耗时数字仅是作者本机报告；对不使用Windows/Edge或现有启动方式足够的人，新增驻留与自动落盘未必有净价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-44](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/README.md#L31-L44)

作者描述重复启动/退出问题和入口。

<details>
<summary>查看原文（14行）</summary>

```text

## 它解决什么问题

如果你是 DeepSeek Harness 的日常用户,下面这段大概每天重复:开终端 → `npx dsh web --no-open` → 记下那串 token URL → 粘进浏览器 → 手动按 F11。想重启?先 `Get-NetTCPConnection -LocalPort 3080` 找到 PID 再 `Stop-Process`,然后从头再来一遍。

问题不在哪一步特别难,而在**每一步都要你亲手做**——尤其"重启"这种一天好几次的高频动作,却藏在进程列表里。

DSH Dock 把整件事收进三个入口 + 一个常驻状态位:

- **桌面一个黑鲸鱼图标**:服务器在跑 → 直接全屏打开;没在跑 → 自动拉起,就绪后开窗;开窗后鲸鱼**落入系统托盘常驻**(可在设置页关闭)。
- **托盘鲸鱼(状态入口)**:悬停显示「运行中/启动中…/未运行」;左键秒开;右键菜单 = 打开 DSH · 重启服务器 · ☑开机自启 · 完全退出。
- **侧栏一个「鲸湾」菜单**:换气(重载界面,服务器不动)/ 洄游(重启服务器,去而必归)/ 归湾(完全退出,两步确认)——三个动作全部取自鲸类行为谱,悬停即见功能注解。设置不进菜单——回到侧栏底部原生「设置」入口,dsh-dock 的专属设置页(托盘常驻/开机自启)就在那个设置弹窗里。
- **退出自动收尾**:完全退出 → 页面自动关闭 → 服务器优雅停止(整树 dispose)→ 会话实时保存,下次双击鲸鱼直接续上。

```

</details>

**依据 2 · 源码核查**：[package.json:47-54](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/package.json#L47-L54)

原生DSH bundle/client声明。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  }
```

**依据 3 · 源码核查**：[index.js:970-985](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/index.js#L970-L985)

Windows激活后自动安装套件。

<details>
<summary>查看原文（16行）</summary>

```text
  // Auto-install: the suite lands on disk by itself shortly after activation
  // — parameters are extracted from the environment (live listener port via
  // netstat on our own PID, node + start recipe via detection). Deferred a
  // beat so boot stays snappy; failures only log and never break activation.
  // The tool above remains for custom re-installs (name/host/port).
  if (process.platform === 'win32') {
    const timer = setTimeout(() => {
      try {
        const result = installSuite(resolveAutoOptions())
        console.info('[dsh-dock] launcher suite ' + (result.skipped ? 'already current' : 'installed')
          + ': ' + result.desktopExePath)
      } catch (e) {
        console.warn('[dsh-dock] auto-install skipped:', e.message)
      }
    }, 2000)
    ctx.effect(() => () => clearTimeout(timer), 'dsh-dock: auto-install timer')
```

</details>

**依据 4 · 源码核查**：[src/DshDockLauncher.cs:1-27](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/src/DshDockLauncher.cs#L1-L27)

C#启动器职责及编译路径。

<details>
<summary>查看原文（27行）</summary>

```text
// DshDockLauncher.cs — the single dsh-dock desktop launcher executable.
//
// One native exe replaces the old four-layer chain (.lnk -> wscript ->
// launch-dsh.vbs -> dsh-card.exe/HTA). Everything lives in this one file:
//
//   quick path  : server alive -> read the freshest token line, verify it
//                 really serves HTTP 200 (health gate with a cookie jar —
//                 DSH answers the token URL with 303 + Set-Cookie), then
//                 silently open the fullscreen Edge app window. No card UI.
//   exit race   : a fresh .stopping marker means the server is mid-shutdown;
//                 wait for the port to go down, then treat as cold start.
//   cold start  : show the breathing whale card, settle-probe, take the
//                 single-spawner lock, spawn start-server.cmd, poll, then
//                 open the window the moment the token URL serves 200.
//   stale server: port occupied by a non-responding / stale-token process
//                 (card did not spawn it) -> explicit failure with guidance
//                 instead of a 180 s silent wait.
//
// All paths (log, batch, profile, markers, whale png) come from
// %USERPROFILE%\.dsh\launcher\launcher.ini baked at install time, so the
// binary itself is build-independent — no csc at install, no VBS/HTA fallback.
//
// Compile (scripts/build-launcher.ps1):
//   csc /target:winexe /optimize+ /win32icon:assets/dsh-dock.ico
//       /r:System.Windows.Forms.dll /r:System.Drawing.dll src/DshDockLauncher.cs
//
// Language level: C# 5 (the Windows-bundled .NET Framework 4 csc).
```

</details>

**依据 5 · 源码核查**：[scripts/build-launcher.ps1:11-43](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/scripts/build-launcher.ps1#L11-L43)

固定源码到预编译exe构建命令。

<details>
<summary>查看原文（33行）</summary>

```text
$projectRoot = Split-Path -Parent $PSScriptRoot
$source = Join-Path $projectRoot 'src\DshDockLauncher.cs'
$icon = Join-Path $projectRoot 'assets\dsh-dock.ico'
$output = Join-Path $projectRoot 'assets\dsh-dock-launcher.exe'

if (-not (Test-Path -LiteralPath $source)) { throw "source not found: $source" }
if (-not (Test-Path -LiteralPath $icon)) { throw "icon not found: $icon" }

$compilerCandidates = @(
  'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe',
  'C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe'
)
$compiler = $compilerCandidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } |
  Select-Object -First 1
if (-not $compiler) { throw 'The .NET Framework C# compiler (csc.exe) was not found.' }

$compilerArgs = @(
  '/nologo',
  '/target:winexe',
  '/optimize+',
  "/win32icon:$icon",
  "/out:$output",
  '/reference:System.dll',
  '/reference:System.Core.dll',
  '/reference:System.Windows.Forms.dll',
  '/reference:System.Drawing.dll',
  '/reference:System.Web.Extensions.dll',
  '/reference:System.Management.dll',
  $source
)

& $compiler @compilerArgs
if ($LASTEXITCODE -ne 0) { throw "C# compiler failed with exit code $LASTEXITCODE" }
```

</details>

#### 缺口

- 未重建核源码/二进制对应，也无本机任务耗时对照。
  **影响**：不能把可读源码当发布exe已验证或复用作者耗时。
  **进一步探讨**：在授权Windows环境重建比对制品并对照同一启动/退出任务，记录成功、耗时和恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动和重启请求怎样从入口成为可见结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

热启动读取日志最后一条token URL，用带CookieContainer的HTTP GET跟随重定向，只有200才开界面；相比仅探测端口，它减少把陈旧token/半死服务当就绪的可能。冷路径由单文件程序和start-server.cmd配合，候选由JS扫描实际安装和Node，版本排序只是选择机制，不证明选中的后端与插件兼容。

侧栏restart先核托盘PID进程名，再写时间戳request文件并返回accepted:true，实际由resident tray执行。C# watcher唤醒轮询，ConsumeRestartRequest读文件、尝试删除、记住已处理body；在当前托盘进程内减少同一请求重复触发。它不是跨崩溃的耐久exactly-once协议：请求文件可覆盖且lastHandledRequest是内存，不能从注释EXACTLY ONCE推断所有并发/重启条件保证。

RestartServer关闭旧窗口、写停止marker并Kill监听PID，随后由poller等待端口落下再拉起。API accepted只代表交给托盘，token HTTP200只证明页面可打开，最终任务/模型服务仍需另验。可借鉴的是端口与认证页面双门、watcher唤醒与内存去重，但移植必须明确每个阶段的成功含义和副作用。

#### 证据与依据

**依据 1 · 源码核查**：[src/DshDockLauncher.cs:285-335](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/src/DshDockLauncher.cs#L285-L335)

最新日志URL和Cookie HTTP200 gate。

<details>
<summary>查看原文（51行）</summary>

```text
  /** Freshest `dsh web: http://…?token=…` line from the server log, or null. */
  internal static string ReadTokenUrl(string logPath)
  {
    try
    {
      using (var fs = new FileStream(logPath, FileMode.Open, FileAccess.Read,
        FileShare.ReadWrite | FileShare.Delete))
      using (var rd = new StreamReader(fs))
      {
        MatchCollection ms = Regex.Matches(rd.ReadToEnd(),
          "dsh web: (http://[^ \\t\\r\\n]+)");
        if (ms.Count > 0) return ms[ms.Count - 1].Groups[1].Value;
      }
    }
    catch { }
    return null;
  }

  /**
   * Health gate: only a token URL that really serves the page may open the
   * window. DSH answers a VALID token URL with 303 + Set-Cookie -> "/"; the
   * cookie jar lets the auto-redirect land on 200 exactly like a browser.
   * A STALE token answers a plain 401 (no redirect) -> WebException -> false,
   * so the launcher keeps waiting for a fresh line instead of opening a fake
   * 401 window at a half-dead server.
   */
  internal static bool HttpReady(string url)
  {
    try
    {
      var req = (HttpWebRequest)WebRequest.Create(url);
      req.Method = "GET";
      req.Timeout = HttpTimeoutMs;
      req.ReadWriteTimeout = HttpTimeoutMs;
      req.Proxy = null;
      req.CookieContainer = new CookieContainer();
      using (var resp = (HttpWebResponse)req.GetResponse())
      {
        Diag("HttpReady " + url + " -> " + (int)resp.StatusCode);
        return resp.StatusCode == HttpStatusCode.OK;
      }
    }
    catch (Exception e)
    {
      var we = e as WebException;
      string detail = we != null && we.Response != null
        ? "status=" + (int)((HttpWebResponse)we.Response).StatusCode
        : e.GetType().Name + ": " + e.Message;
      Diag("HttpReady " + url + " -> FAIL (" + detail + ")");
      return false;
    }
```

</details>

**依据 2 · 源码核查**：[index.js:1163-1190](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/index.js#L1163-L1190)

侧栏校验托盘、写request与accepted响应。

<details>
<summary>查看原文（28行）</summary>

```text
        const manifest = readManifestSafe()
        const trayPid = manifest !== undefined && Number.isInteger(manifest.trayPid)
          ? manifest.trayPid
          : 0
        let trayActive = false
        if (trayPid > 0) {
          const probe = spawnSync(POWERSHELL, ['-NoProfile', '-NonInteractive', '-Command',
            `$t = Get-Process -Id ${trayPid} -ErrorAction SilentlyContinue; if ($t -and ($t.ProcessName -like 'dsh-dock*' -or $t.ProcessName -like 'DSH Harness*')) { exit 0 } else { exit 1 }`],
          { encoding: 'utf8', timeout: 4000 })
          trayActive = probe.status === 0
        }
        if (!trayActive) {
          writeJson(res, 200, {
            ok: true,
            accepted: false,
            note: '托盘未驻留：请先双击桌面鲸鱼（或在设置中开启托盘常驻），再使用重启服务器。',
          })
          return
        }
        try {
          mkdirSync(LAUNCHER_DIR, { recursive: true })
          writeFileSync(RESTART_REQUEST, String(Date.now()), 'utf8')
        } catch (e) {
          writeJson(res, 500, { ok: false, error: { code: 'write-failed', message: e.message } })
          return
        }
        logStop('restart', `requested via sidebar; tray pid ${trayPid} will execute`)
        writeJson(res, 200, { ok: true, accepted: true, note: '托盘将重启服务器，就绪后自动开窗' })
```

</details>

**依据 3 · 源码核查**：[src/DshDockLauncher.cs:1735-1756](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/src/DshDockLauncher.cs#L1735-L1756)

watcher唤醒与失败回退节奏。

<details>
<summary>查看原文（22行）</summary>

```text
  void StartRestartWatch()
  {
    try
    {
      string path = RestartPath(cfg);
      string dir = string.IsNullOrEmpty(path) ? null : Path.GetDirectoryName(path);
      if (string.IsNullOrEmpty(dir) || !Directory.Exists(dir)) return;
      restartWatch = new FileSystemWatcher(dir);
      restartWatch.Filter = Path.GetFileName(path);
      restartWatch.NotifyFilter = NotifyFilters.FileName | NotifyFilters.LastWrite;
      restartWatch.Created += delegate { Wake(); };
      restartWatch.Changed += delegate { Wake(); };
      restartWatch.Renamed += delegate { Wake(); };
      restartWatch.EnableRaisingEvents = true;
      watchOk = true;
      DshDockProgram.Diag("tray: restart watcher armed on " + dir);
    }
    catch (Exception e)
    {
      // No watcher => PollIntervalMs() keeps the fast cadence, so 洄游 can
      // never sit unanswered for a whole steady interval.
      watchOk = false;
```

</details>

**依据 4 · 源码核查**：[src/DshDockLauncher.cs:1781-1799](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/src/DshDockLauncher.cs#L1781-L1799)

请求体去重与删除重试。

<details>
<summary>查看原文（19行）</summary>

```text
  bool ConsumeRestartRequest()
  {
    string path = RestartPath(cfg);
    if (path == null) return false;
    string body;
    try
    {
      if (!File.Exists(path)) return false;
      body = File.ReadAllText(path).Trim(); // throws while the host is mid-write
    }
    catch { return false; }                 // -> retried on the next tick
    for (int attempt = 0; attempt < 5; attempt++)
    {
      try { File.Delete(path); break; }
      catch { Thread.Sleep(120); }
    }
    if (body.Length > 0 && body == lastHandledRequest) return false;
    lastHandledRequest = body;
    return true;
```

</details>

**依据 5 · 源码核查**：[src/DshDockLauncher.cs:1846-1863](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/src/DshDockLauncher.cs#L1846-L1863)

重启实际Kill监听进程并让poller接管。

<details>
<summary>查看原文（18行）</summary>

```text
  void RestartServer()
  {
    if (stopping || state == "restarting") return;
    DshDockProgram.Diag("tray: restart server");
    state = "restarting";
    pendingOpen = true;
    // User preference: kill old dock windows first — they hold dead tokens
    // once the listener dies; only the freshly auto-opened window remains.
    CloseDockWindows();
    WriteStoppingMarker();
    foreach (int pid in ListenerPids())
    {
      try { System.Diagnostics.Process.GetProcessById(pid).Kill(); }
      catch { }
    }
    // The poller's spawn path takes over once the port is really down.
    spawnWanted = true;
    spawned = false;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 侧栏退出与托盘退出具有相同保存保证吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

没有相同保证。侧栏stop路由在请求围栏和POST检查后，先写stopping marker、停止托盘并返回200，文案称sessions were persisted；随后才调用armGracefulExit/appExit。编排观察process.exitCode相对基线变化作为宿主dispose完成信号，再延迟退出；若6秒没信号强制退出，appExit抛错也会force。该响应不能证明当时会话已经保存，且完成信号的含义依赖未在本仓复核的宿主实现。不能据日志名把所有副作用当耐久。

托盘ExitClicked和RestartServer则直接枚举监听PID并Process.Kill，不经侧栏appExit路径。托盘退出后等端口落下、关窗口再结束应用；这有助进程退出，但不同于宿主逐插件清理。因而“完全退出会话保存”需按入口和宿主版本分别验证，不能把侧栏的尽力优雅路径泛化给托盘重启/退出。

请求有Host、Sec-Fetch-Site和Origin hostname检查，并非无门槛任意网页都能调用；但Origin比较只有hostname，非完整scheme/port，缺Origin直接通过，不能称完整认证或多租户边界。适合本机个人控制面；远程/代理部署需额外核宿主网络与信任范围。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:988-1042](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/index.js#L988-L1042)

响应先于appExit并存在legacy硬杀。

<details>
<summary>查看原文（55行）</summary>

```text
    ctx.effect(() => webCtx.webServer.register({
      kind: 'exact',
      path: '/launcher/api/stop',
      handler: async (req, res) => {
        const webRuntime = ctx.get('webRuntime')
        const trustedHosts = webRuntime !== undefined && webRuntime.trustedHosts !== undefined
          ? webRuntime.trustedHosts
          : []
        if (!isTrustedStopRequest(req, trustedHosts)) {
          writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
          return
        }
        if (req.method !== 'POST') {
          writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
          return
        }
        const exit = ctx.get('appExit')
        const subprocess = ctx.get('subprocess')
        if (typeof exit !== 'function' && subprocess === undefined) {
          writeJson(res, 503, { ok: false, error: { code: 'unavailable', message: 'no graceful exit seam (appExit) and no subprocess kill fallback' } })
          return
        }
        // Shutdown marker: the launcher waits it out instead of opening the
        // dying server when a double-click lands mid-shutdown. Epoch SECONDS
        // on purpose: the launcher reads it as a plain number. Written for
        // both paths; deliberately never deleted — a stale marker (>15s) is
        // inert and the next stop overwrites it.
        try {
          mkdirSync(LAUNCHER_DIR, { recursive: true })
          writeFileSync(STOPPING_MARKER, String(Math.floor(Date.now() / 1000)), 'utf8')
        } catch { /* marker is best-effort */ }
        // v0.4.0: the whale must vanish with the server. Kill the tray
        // BEFORE the response (the process is provably alive here); anything
        // after the host's own exit is unreliable.
        const manifest = readManifestSafe()
        stopTraySync(manifest !== undefined ? manifest.trayPid : 0)
        writeJson(res, 200, { ok: true, note: 'server is stopping gracefully; sessions were persisted' })
        if (typeof exit === 'function') {
          // Graceful path (ctx.appExit provided by the dsh launcher): dispose
          // the whole Cordis tree, then exit the moment the host signals that
          // disposal finished (see armGracefulExit — the promise is not
          // reachable, so process.exitCode IS the signal), with a 6s backstop
          // for a host that never signals.
          logStop('stop', 'graceful path via ctx.appExit')
          armGracefulExit({ exit, force: (code) => process.exit(code), log: logStop })
        } else {
          // Legacy fallback (host without ctx.appExit): hard-kill via a
          // short-lived PowerShell, exactly as pre-v0.3.4.
          logStop('stop', 'fallback hard-kill (no ctx.appExit on this host)')
          const port = readInstalledPort()
          const hostAuth = parseAuthority(req.headers.host)
          const selfPid = hostAuth !== undefined && Number(hostAuth.port) === port
            ? process.pid
            : 0
          dispatchServerStop(subprocess, port, selfPid)
```

</details>

**依据 2 · 源码核查**：[index.js:728-777](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/index.js#L728-L777)

exitCode变化和backstop强制退出。

<details>
<summary>查看原文（50行）</summary>

```text
export function armGracefulExit(options) {
  const force = options.force ?? ((code) => process.exit(code))
  const log = options.log ?? (() => {})
  const graceMs = options.graceMs ?? EXIT_GRACE_MS
  const pollMs = options.pollMs ?? EXIT_POLL_MS
  const flushMs = options.flushMs ?? EXIT_FLUSH_MS
  const backstopMs = options.backstopMs ?? EXIT_BACKSTOP_MS
  // A pre-existing exitCode (a plugin that set one) is not our completion
  // signal — only a CHANGE is.
  const codeAtArm = process.exitCode
  const timers = []
  let finished = false
  const clearTimers = () => {
    for (const timer of timers) { clearTimeout(timer); clearInterval(timer) }
    timers.length = 0
  }
  const track = (timer) => {
    if (typeof timer.unref === 'function') timer.unref()
    timers.push(timer)
    return timer
  }
  // Log the evidence, then exit — exactly once, whichever branch gets here.
  const finish = (reason, code) => {
    if (finished) return
    finished = true
    clearTimers()
    log('stop', `${reason}; resources at exit: ${resourceSummary()}`)
    force(code)
  }
  log('stop', `resources at request: ${resourceSummary()}`)
  // Backstop: the host's disposal contract is 5s, so 6s means it never signalled.
  track(setTimeout(() => finish('backstop: host never signalled disposal', 0), backstopMs))
  track(setTimeout(() => {
    log('stop', 'requesting appExit(0)')
    const started = Date.now()
    try {
      options.exit(0)
    } catch (e) {
      finish(`appExit threw (${e && e.message})`, 1)
      return
    }
    track(setInterval(() => {
      if (process.exitCode === codeAtArm) return
      const code = Number(process.exitCode) || 0
      clearTimers()
      log('stop', `dispose finished in ${Date.now() - started}ms (exitCode=${code})`)
      track(setTimeout(() => finish('forcing process.exit after dispose', code), flushMs))
    }, pollMs))
  }, graceMs))
  return () => { finished = true; clearTimers() }
```

</details>

**依据 3 · 源码核查**：[src/DshDockLauncher.cs:1883-1900](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/src/DshDockLauncher.cs#L1883-L1900)

托盘退出直接Kill监听PID。

<details>
<summary>查看原文（18行）</summary>

```text
  /** 完全退出 — single click (user preference: no two-step guard on the
   * tray menu; the sidebar menu keeps its in-page two-step arm). */
  void ExitClicked()
  {
    if (stopping) return;
    if (exitItem != null) exitItem.Text = "完全退出";
    DshDockProgram.Diag("tray: full exit");
    stopping = true;
    WriteStoppingMarker();
    foreach (int pid in ListenerPids())
    {
      try { System.Diagnostics.Process.GetProcessById(pid).Kill(); }
      catch { }
    }
    DshDockProgram.WaitForPortDown(cfg, 15000);
    CloseDockWindows();
    TryDeleteMarker();
    Application.Exit();
```

</details>

**依据 4 · 源码核查**：[src/DshDockLauncher.cs:1846-1863](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/src/DshDockLauncher.cs#L1846-L1863)

托盘重启也直接Kill。

<details>
<summary>查看原文（18行）</summary>

```text
  void RestartServer()
  {
    if (stopping || state == "restarting") return;
    DshDockProgram.Diag("tray: restart server");
    state = "restarting";
    pendingOpen = true;
    // User preference: kill old dock windows first — they hold dead tokens
    // once the listener dies; only the freshly auto-opened window remains.
    CloseDockWindows();
    WriteStoppingMarker();
    foreach (int pid in ListenerPids())
    {
      try { System.Diagnostics.Process.GetProcessById(pid).Kill(); }
      catch { }
    }
    // The poller's spawn path takes over once the port is really down.
    spawnWanted = true;
    spawned = false;
```

</details>

**依据 5 · 源码核查**：[index.js:580-594](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/index.js#L580-L594)

现有围栏范围和Origin仅hostname比较。

<details>
<summary>查看原文（15行）</summary>

```text
function isTrustedStopRequest(req, trustedHosts = []) {
  const hostUrl = parseAuthority(req.headers.host)
  if (hostUrl === undefined) return false
  if (!isLoopbackHostname(hostUrl.hostname)
    && !trustedHosts.some(authority => authority !== undefined && String(authority).split(':')[0] === hostUrl.hostname)) {
    return false
  }
  if (req.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = req.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).hostname === hostUrl.hostname
  } catch {
    return false
  }
```

</details>

#### 缺口

- 宿主exitCode完成语义、各入口实际会话保存与真实网络边界未验收。
  **影响**：不能承诺退出不丢状态或用于共享/远程控制。
  **进一步探讨**：固定宿主，在无重要任务环境逐入口演练未落盘写入、慢dispose、超时、重启和同主机不同Origin，核日志/文件与进程。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自动安装、驻留与自启的负担是否值得？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

建议有Windows运维经验且能接受激活自动生成桌面exe/launcher目录的人，在无重要运行任务的profile观察后再试。首次需Windows10/11、可用Node/DSH Web、PowerShell和Edge（或浏览器回退），无需用户本机编译并不代表无运行依赖。开启自启会写HKCU Run，托盘常驻/候选发现/轮询和浏览器专用状态都有持续资源与维护成本。

比较基线可设为一次选正确DSH、打开认证界面、重启并恢复会话。源码支持减少复制链接和找PID动作；作者本机数字不能外推本机节时，也不能把API200当持久化成功。现金、CPU、内存、维护工时和误杀/丢会话损失未知，尤其托盘Kill路径需先验证。

先保持自启关闭，记录实际安装路径和端口，核目标候选、窗口和每种退出入口；如退出后会话缺失、端口/候选错位或托盘杀错进程，就停止套件并回手工终端启动、备份日志和profile。README说明卸载不自动删除产物，退出需同时移除插件/桌面exe/launcher目录，并单独关闭自启，不能把移除依赖当全部系统状态已恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:117-142](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/README.md#L117-L142)

作者Windows前提、自动安装与卸载说明。

<details>
<summary>查看原文（26行）</summary>

````text
dsh plugin --profile web add github:UnknowCao/dsh-dock#v0.8.0
```

重启服务器后**无需任何操作**:插件激活时自动从环境提取参数(自身监听端口、Node 路径、启动命令),~2 秒内桌面出现「DSH Harness.exe」(黑鲸鱼图标)+ 侧栏「鲸湾」菜单。日常两步:**双击鲸鱼开,菜单里退**。「完全退出」请求宿主整树 dispose,并以宿主写下的 `process.exitCode` 作为「dispose 已完成」信号,完成后自行收尾(耗时 = 实测 dispose + 0.25s,见 `stop.log`);宿主始终不发信号则 6s 兜底,仅在没有 `ctx.appExit` 的旧宿主上回退硬杀。

**从 v0.4 升级?** v0.5 只动侧栏菜单:更名「鲸湾」,收窄为 换气(刷新界面)/ 洄游(重启服务器)/ 归湾(完全退出) 三项,悬停显示功能注解,设置回到侧栏底部原生入口(设置页本身不变);修复了其他插件(如 Cordis 面板徽标)同时占用侧栏脚注槽位时的页面冻结问题;菜单文案改为跟随界面语言即时切换。托盘、重启、开机自启、设置页均不变。

想自定义(改名/换端口)再对 Agent 说:

```text
帮我把 DSH 桌面程序改名为 XX / 装到 3081 端口
```

卸载:删桌面 `DSH Harness.exe` 与 `~\.dsh\launcher\`;profile 里移除依赖与 bundle 条目。卸载不会自动删除任何文件。


## 能做什么

| 能力 | 交付 | 触发 |
|---|---|---|
| 一键启动 · 快路径 | 服务器在跑:静默**全屏**打开(独立 Edge 应用窗口,无卡片闪现) | 双击桌面程序 |
| 一键启动 · 冷路径 | 品牌卡片(鲸鱼呼吸灯)→ 静默拉起 → 就绪开窗 | 双击桌面程序 |
| 独立应用窗口 | 专属 Edge 配置:不并入主浏览器标签页,自带 30 天登录态 | 自动 |
| 侧栏「鲸湾」菜单(v0.5 改版) | 换气(重载界面)/ 洄游(重启服务器)/ 归湾(完全退出,两步确认)收进侧栏脚注一枚波纹按钮,悬停显示功能注解;弹层为 React Portal | 侧栏底部「鲸湾」 |
| 与其他侧栏插件共存(v0.5) | 以普通邻居条目渲染,零 DOM 迁移、不隐藏原生触发器;脚注槽纵向堆叠,Cordis 徽标等全宽条目与鲸湾各行其道,页面不再冻结 | 自动 |
| 界面语言跟随(v0.5) | 菜单 / 设置页 / 退出遮罩文案注册进宿主 locale,切换界面语言即时生效(≤ v0.4 不跟随) | 跟随 DSH 语言设置 |
````

</details>

**依据 2 · 源码核查**：[index.js:970-985](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/index.js#L970-L985)

激活自动落盘接线。

<details>
<summary>查看原文（16行）</summary>

```text
  // Auto-install: the suite lands on disk by itself shortly after activation
  // — parameters are extracted from the environment (live listener port via
  // netstat on our own PID, node + start recipe via detection). Deferred a
  // beat so boot stays snappy; failures only log and never break activation.
  // The tool above remains for custom re-installs (name/host/port).
  if (process.platform === 'win32') {
    const timer = setTimeout(() => {
      try {
        const result = installSuite(resolveAutoOptions())
        console.info('[dsh-dock] launcher suite ' + (result.skipped ? 'already current' : 'installed')
          + ': ' + result.desktopExePath)
      } catch (e) {
        console.warn('[dsh-dock] auto-install skipped:', e.message)
      }
    }, 2000)
    ctx.effect(() => () => clearTimeout(timer), 'dsh-dock: auto-install timer')
```

</details>

**依据 3 · 源码核查**：[index.js:848-872](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/index.js#L848-L872)

自启HKCU Run读写。

<details>
<summary>查看原文（25行）</summary>

```text
/** HKCU Run key for boot autostart (the entry's presence IS the state). */
const AUTOSTART_RUN_KEY = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
const AUTOSTART_VALUE_NAME = 'dsh-dock'
/** The command the Run entry launches: the suite exe with --boot (tray +
 * silent server start, no window — the preheated fast-open path). */
function autostartCommand() {
  return `"${LAUNCHER_EXE}" --boot`
}

/** Whether the HKCU Run autostart entry currently exists. */
function readAutostart() {
  const probe = spawnSync('reg', ['query', AUTOSTART_RUN_KEY, '/v', AUTOSTART_VALUE_NAME],
    { encoding: 'utf8' })
  return probe.status === 0 && (probe.stdout ?? '').includes(AUTOSTART_VALUE_NAME)
}

/** Create or remove the HKCU Run autostart entry. */
function writeAutostart(enabled) {
  const argv = enabled
    ? ['add', AUTOSTART_RUN_KEY, '/v', AUTOSTART_VALUE_NAME, '/t', 'REG_SZ', '/d', autostartCommand(), '/f']
    : ['delete', AUTOSTART_RUN_KEY, '/v', AUTOSTART_VALUE_NAME, '/f']
  const result = spawnSync('reg', argv, { encoding: 'utf8' })
  // Deleting an already-missing value is fine; a failed add is the real error.
  if (enabled && result.status !== 0) {
    throw new Error(`failed to write autostart registry entry: ${result.stderr || result.stdout}`)
```

</details>

**依据 4 · 源码核查**：[src/DshDockLauncher.cs:1885-1900](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/src/DshDockLauncher.cs#L1885-L1900)

退出代价与状态风险。

<details>
<summary>查看原文（16行）</summary>

```text
  void ExitClicked()
  {
    if (stopping) return;
    if (exitItem != null) exitItem.Text = "完全退出";
    DshDockProgram.Diag("tray: full exit");
    stopping = true;
    WriteStoppingMarker();
    foreach (int pid in ListenerPids())
    {
      try { System.Diagnostics.Process.GetProcessById(pid).Kill(); }
      catch { }
    }
    DshDockProgram.WaitForPortDown(cfg, 15000);
    CloseDockWindows();
    TryDeleteMarker();
    Application.Exit();
```

</details>

#### 缺口

- 没有本机Windows/AV/浏览器测试与全周期投入。
  **影响**：无法判断启动便利是否超过状态风险和清理负担。
  **进一步探讨**：隔离profile对照手工流程，记录每次选择、退出保存、资源和人工恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 退出结果收据能否减少完成误判？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

假设让所有入口共用可查询的退出事务状态，区分“请求已接收、宿主开始清理、清理信号、强制终止、最后持久化确认”，可以减少用户把200或进程消失当会话安全保存的误判。推导来自Q03的响应顺序和托盘Kill差异；它需要宿主提供可信完成接口，不能只让插件再写一个success字段。

已有stopping marker、stop.log、exitCode轮询和UI确认是反证，系统已有恢复/诊断机制。新增价值应是把不同入口的结果语义统一呈现，且当宿主没确认时显示未知，而不是简单多一个进度条。

最小验证在固定宿主上安排正常/慢dispose、写盘失败、6秒backstop与托盘重启，对照现有界面和结果收据。记录用户是否正确识别强制/未知、恢复会话是否完整、重复重启和等候时间；如果宿主无法给可信确认、状态迟到误导或只增加等待，则否定或缩小为诊断功能。该方案未实现/验证，不计入当前贡献。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1015-1032](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/index.js#L1015-L1032)

已有marker/log但200早于清理。

<details>
<summary>查看原文（18行）</summary>

```text
        try {
          mkdirSync(LAUNCHER_DIR, { recursive: true })
          writeFileSync(STOPPING_MARKER, String(Math.floor(Date.now() / 1000)), 'utf8')
        } catch { /* marker is best-effort */ }
        // v0.4.0: the whale must vanish with the server. Kill the tray
        // BEFORE the response (the process is provably alive here); anything
        // after the host's own exit is unreliable.
        const manifest = readManifestSafe()
        stopTraySync(manifest !== undefined ? manifest.trayPid : 0)
        writeJson(res, 200, { ok: true, note: 'server is stopping gracefully; sessions were persisted' })
        if (typeof exit === 'function') {
          // Graceful path (ctx.appExit provided by the dsh launcher): dispose
          // the whole Cordis tree, then exit the moment the host signals that
          // disposal finished (see armGracefulExit — the promise is not
          // reachable, so process.exitCode IS the signal), with a 6s backstop
          // for a host that never signals.
          logStop('stop', 'graceful path via ctx.appExit')
          armGracefulExit({ exit, force: (code) => process.exit(code), log: logStop })
```

</details>

**依据 2 · 源码核查**：[index.js:757-775](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/index.js#L757-L775)

已有完成信号与强制兜底。

<details>
<summary>查看原文（19行）</summary>

```text
  log('stop', `resources at request: ${resourceSummary()}`)
  // Backstop: the host's disposal contract is 5s, so 6s means it never signalled.
  track(setTimeout(() => finish('backstop: host never signalled disposal', 0), backstopMs))
  track(setTimeout(() => {
    log('stop', 'requesting appExit(0)')
    const started = Date.now()
    try {
      options.exit(0)
    } catch (e) {
      finish(`appExit threw (${e && e.message})`, 1)
      return
    }
    track(setInterval(() => {
      if (process.exitCode === codeAtArm) return
      const code = Number(process.exitCode) || 0
      clearTimers()
      log('stop', `dispose finished in ${Date.now() - started}ms (exitCode=${code})`)
      track(setTimeout(() => finish('forcing process.exit after dispose', code), flushMs))
    }, pollMs))
```

</details>

**依据 3 · 源码核查**：[src/DshDockLauncher.cs:1885-1900](https://github.com/UnknowCao/dsh-dock/blob/1dffd8c74f45ed28bc8f8c8956143938efacaa5f/src/DshDockLauncher.cs#L1885-L1900)

托盘Kill路径为统一语义的依据。

<details>
<summary>查看原文（16行）</summary>

```text
  void ExitClicked()
  {
    if (stopping) return;
    if (exitItem != null) exitItem.Text = "完全退出";
    DshDockProgram.Diag("tray: full exit");
    stopping = true;
    WriteStoppingMarker();
    foreach (int pid in ListenerPids())
    {
      try { System.Diagnostics.Process.GetProcessById(pid).Kill(); }
      catch { }
    }
    DshDockProgram.WaitForPortDown(cfg, 15000);
    CloseDockWindows();
    TryDeleteMarker();
    Application.Exit();
```

</details>

#### 缺口

- 缺宿主可信持久化完成接口与用户对照。
  **影响**：不能保证收据能证明安全保存。
  **进一步探讨**：先核宿主接口，记录unknown并做故障演练，避免只改文案冒充耐久确认。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
