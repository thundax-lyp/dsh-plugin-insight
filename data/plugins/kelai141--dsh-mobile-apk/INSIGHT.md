# dsh-mobile-apk（DeepCode）

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[842dfdd](https://github.com/kelai141/dsh-mobile-apk/tree/842dfdd81ee53c6c8d1f0ca5d634319309d026c4)

<!-- BEGIN META -->
[![GitHub ★ 897](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=897&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kelai141/dsh-mobile-apk)
<!-- END META -->

> **功能**：将DeepSeek Harness和本地命令环境封装到Android应用，提供通知、设备控制与移动界面。

> **亮点**：把本地命令环境、通知应答与原生设备控制组织成手机上的Agent工作流，贡献在系统集成而非模型能力。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：局部屏幕检查不证明所有shell/ADB入口受同等限制；WebView独立profile也不保证完整擦除，后台服务存活不能直接证明任务继续。[Q02](#research-q02) [Q04](#research-q04)

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
  - [Q01 · 手机本地DSH比远程网页多做什么？](#detail-section-11)
  - [Q02 · 真实屏范围和独立浏览器是否只是界面设置？](#detail-section-12)
  - [Q03 · 首次安装、后台运行和恢复需要什么代价？](#detail-section-13)
  - [Q04 · 运行时恢复设计哪些值得复用，怎样检验保活？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在Android本地执行命令、监督Agent并按需控制App的用户。

手机访问远程DSH网页，或Termux单独运行命令。原生通知和设备能力是额外价值，同时带来权限与后台适配成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 本地Agent运行 | 手机本地命令与会话 | 匹配ABI和模型服务 |
| 屏幕范围控制 | 限制已查无障碍操作目标 | 不代表所有shell/ADB通道审计 |
| 独立浏览profile | 会话浏览器数据分隔 | 需WebView支持，有限清理 |
| 运行时快照阶段 | 支持刷新与恢复 | 完整设备故障链未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Android和匹配arm64/x86_64 APK | 本地运行必需 | 内嵌运行环境 | 架构不符无法启动 |
| 模型API和网络 | 模型任务必需 | 推理与工具规划 | 无内置模型服务 |
| 前台服务/电池策略、通知 | 后台与应答相关 | 保活和审批 | 厂商仍可能限制 |
| 无障碍/Shizuku/WebView多profile | 指定控制能力必需 | 屏幕、虚拟屏和隔离浏览器 | 权限或特性不足明确受限 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份数据并装同渠道匹配ABI包 | 完成运行时解压，异常不强杀重装 |
| 2 | 仅开任务需要权限并配置模型 | 先非敏感目录命令验收 |
| 3 | 先虚拟屏/独立浏览器小任务 | 核对目标、输出和清理边界 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | APK、运行时磁盘 | 解压、权限、模型配置 | 作者称数分钟至十余分钟，未实测 |
| 持续使用 | 电池、内存、模型调用与流量 | 监督、权限维护与设备适配 | 未测电耗或合格任务费用 |
| 失败恢复 | 快照与备份空间 | 对账日志、Safe Mode或明确快照恢复 | 没可信目标时不应自动选最新 |
| 退出 | 数据导出与凭据清理 | 撤无障碍/Shizuku/悬浮权限、备份会话 | 浏览器profile清理不保证全擦除 |

熟悉Android权限的用户可在备用机或非敏感环境试用，先保持virtual-only。没有恢复与备份能力，或需要厂商锁屏后绝对持续运行的人，不宜据README承诺部署关键任务。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 范围控制 | 无障碍分派前检查 | 所有设备控制通道 |
| 浏览隔离 | 非Default profile且失败拒绝 | 各WebView及完整数据擦除 |
| 恢复 | 事务阶段与文档策略 | 崩溃/锁屏任务可靠性和电耗 |

> **思考**：局部屏幕检查不证明所有shell/ADB入口受同等限制；WebView独立profile也不保证完整擦除，后台服务存活不能直接证明任务继续。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把本地命令环境、通知应答与原生设备控制组织成手机上的Agent工作流，贡献在系统集成而非模型能力。[Q01](#research-q01) [Q02](#research-q02)

SnapshotTransaction在搬动前写SWAPPING，全部替换后写SWAPPED，持久化文档据此区分回滚与向前完成。可借鉴的是将阶段日志作为恢复依据，并把会话/凭据等用户数据与运行时刷新范围分开，避免把恢复等同覆盖整个HOME；本次未完成所有回滚调用链或设备故障测试，不宣称崩溃下零丢失。

<a id="detail-section-5"></a>

### 1.4 主要限制

局部屏幕检查不证明所有shell/ADB入口受同等限制；WebView独立profile也不保证完整擦除，后台服务存活不能直接证明任务继续。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉Android权限和备份的用户可在备用机非敏感任务试用，先保持virtual-only并逐项开权限；关键后台任务和敏感账号控制暂不依赖未经设备核验的恢复承诺。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

局部权限执行点、profile和事务标记有源码支持；后台可靠性、全通道权限和设备兼容未实测。

- 已检查：作者 README、包清单、源码路径 README.md、app/src/main/java/com/dsharnessmobile/shell/ScreenScope.kt、app/src/main/java/com/dsharnessmobile/shell/DeviceControlService.kt、app/src/main/java/com/dsharnessmobile/shell/BrowserHostProfile.kt、app/src/main/java/com/dsharnessmobile/shell/SnapshotTransaction.kt、docs/AGENTS/PERSISTENT-DATA.md、docs/AGENTS/ARCHITECTURE.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查安卓壳README、原生屏幕门、浏览器profile与事务阶段；非全root/ADB、构建来源链或设备兼容审计。
- 下一步：备用机按固定Android/WebView测权限范围、profile失败拒绝及锁屏/进程重启，分别记录服务与任务进度。

**分析版本**

- **仓库**：[kelai141/dsh-mobile-apk](https://github.com/kelai141/dsh-mobile-apk)
- **版本号**：未声明（[固定提交 842dfdd](https://github.com/kelai141/dsh-mobile-apk/tree/842dfdd81ee53c6c8d1f0ca5d634319309d026c4)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

分层展示服务、引擎、任务与通知健康，用备用机中断测试验证是否减少误判自愈；尚未验证。[Q04](#research-q04)

备用机按固定Android/WebView测权限范围、profile失败拒绝及锁屏/进程重启，分别记录服务与任务进度。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 114 | 14406 | — | — | 424172 |
| .mjs | source | 145 | 32873 | 24614 | 7036 | — |
| .js | source | 19 | 10200 | 7598 | 2470 | — |
| .ts | source | 119 | 29956 | 20697 | 7671 | — |
| .tsx | source | 17 | 3927 | 2957 | 797 | — |
| .ts | test | 54 | 11242 | 9401 | 924 | — |
| .tsx | test | 12 | 3522 | 2929 | 285 | — |
| .mjs | test | 120 | 20925 | 17318 | 2061 | — |
| .js | example | 84 | 183886 | 154578 | 31058 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/kelai141/dsh-mobile-apk/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：安卓本地DSH运行与监督提供什么增量，屏幕权限、隔离及恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 手机本地DSH比远程网页多做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是在Android上运行真实命令、接收任务问题并按需控制App的用户。相较手机访问远程DSH网页，本项目把Termux环境、宿主WebView、前台服务、通知和设备控制放入APK，任务与手机文件及原生权限连接。合格结果仍应是可检查命令产物或App最终状态，悬浮球显示完成不能代替业务验收。

贡献是安卓运行与监督的系统集成；Agent推理属于DSH和模型，Termux/系统能力也不应算壳原创。浏览器与虚拟屏为实验特性；只需聊天或远程提交任务者可能继续网页更省电省维护。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-29](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/README.md#L13-L29)

作者列真实bash、保活、隔离浏览器与原生监督。

<details>
<summary>查看原文（17行）</summary>

```text
> **一个 APK 装下完整的 AI agent：AI 能操作浏览器与手机、真实执行 bash——无需 root，无需刷机。**

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的安卓壳。应用名 `DeepCode`，包名 `com.dsharnessmobile.shell`。

> 本项目基于 MIT 开源，欢迎二次开发，二次分发，为项目提交建议与反馈。
> AI 生成内容与执行的操作请自行判断；实验性能力会在对应条目如实标注。

## 它能做什么

- **真实执行 bash**：AI 跑的命令在内置 Termux 环境里真实生效，不是模拟输出。
- **后台持续运行与自动恢复**：切走应用、锁屏，任务照跑；引擎异常自动探活恢复，手机重启后自动回到运行状态。后台耗电高于普通应用，建议按应用内引导允许忽略电池优化。
- **AI 独立浏览器**（实验特性）：AI 用一个独立窗口打开和操作网页，cookie 与登录状态和你的日常浏览器完全隔离，不碰你的账号。
- **虚拟屏**（实验特性，需 Shizuku）：AI 在一块独立虚拟屏幕上启动并操作第三方 App，不占你正在用的屏幕，还能在浮窗里围观它操作。
- **AI 操作手机**：开启无障碍授权后，AI 能看到屏幕内容并替你点击、滑动、输入、截屏；默认只允许操作虚拟屏，要动真实屏幕需要你在设置里主动放开。
- **通知栏应答与审批**：AI 的提问、审批直接推到通知栏，直接回复、选选项、批准或拒绝，不用切回应用（Android 13 及以上需在系统设置里允许通知）。
- **桌面悬浮球**：实时显示 AI 进度，展开面板能直接回答 AI 的提问、看任务报告，三击状态行跳回应用；不想被打扰可一键隐藏。
- **稳定与自愈**：页面被装坏的插件搞挂时自动摘除并恢复；环境被改坏可用安全模式启动修复；启动失败有修复助手与脱敏诊断包（仅你主动点击才会发出）。
```

</details>

**依据 2 · 作者声明**：[README.md:101-105](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/README.md#L101-L105)

作者区分壳仓库与构建协调仓库。

```text
## 面向开发者

- **自己构建**：构建与快照链在协调仓库 [dsh-mobile](https://github.com/kelai141/dsh-mobile) 完成，本仓库是壳子仓库；环境要求见 [`CONTRIBUTING.md`](CONTRIBUTING.md) 与 `docs/AGENTS/build-and-env.md`。
- **桥协议**（`window.androidBridge`）：见 [`docs/AGENTS/BRIDGE-API.md`](docs/AGENTS/BRIDGE-API.md)。
- **模型可见工具面**：见 [`docs/AGENTS/modules.md`](docs/AGENTS/modules.md)（以当前代码为准）。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 真实屏范围和独立浏览器是否只是界面设置？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

ScreenScope将未知值归为virtual-only；DeviceControlService.handle在屏幕操作分派前调用realScreenScopeError，检查scope.allows，虚拟屏ID只由VdisplayController解析，真实屏拒绝caller指定其他displayId。这是实际执行点检查，不只是UI隐藏。它只证明已查的无障碍操作入口，未审计所有shell、ADB或root通道，不能泛称全设备不可越权。

BrowserHostProfile要求WebView MULTI_PROFILE并设置会话派生的非Default profile，回读名称不符即失败，不回退默认。cookie/第三方cookie与service worker有单独策略；dispose后停止worker网络。清理方法明确不能保证删除IndexedDB、CacheStorage或worker注册，因此独立profile与完整数据擦除是不同承诺。

#### 证据与依据

**依据 1 · 源码核查**：[app/src/main/java/com/dsharnessmobile/shell/ScreenScope.kt:12-30](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/app/src/main/java/com/dsharnessmobile/shell/ScreenScope.kt#L12-L30)

范围枚举和未知回退virtual-only。

<details>
<summary>查看原文（19行）</summary>

```text
enum class ScreenScope(val wire: String) {
  VIRTUAL_ONLY("virtual-only"),
  REAL_ONLY("real-only"),
  ALL("all");

  /** Whether this user choice includes one stable product screen alias. */
  fun allows(screenId: String): Boolean = when (this) {
    VIRTUAL_ONLY -> ScreenTargets.isVirtual(screenId)
    REAL_ONLY -> screenId == ScreenTargets.REAL
    ALL -> screenId == ScreenTargets.REAL || ScreenTargets.isVirtual(screenId)
  }

  /** Stable execution-point denial for virtual-display input. */
  fun inputDenial(screenId: String): String? =
    if (allows(screenId)) null else "screen-out-of-scope"

  companion object {
    fun fromWire(value: String?): ScreenScope = entries.firstOrNull { it.wire == value } ?: VIRTUAL_ONLY
  }
```

</details>

**依据 2 · 源码核查**：[app/src/main/java/com/dsharnessmobile/shell/DeviceControlService.kt:637-656](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/app/src/main/java/com/dsharnessmobile/shell/DeviceControlService.kt#L637-L656)

屏幕操作分派前实际范围检查。

<details>
<summary>查看原文（20行）</summary>

```text
  fun handle(op: String, args: JSONObject): JSONObject {
    // 0.14.1 块G F4（注释更正）：本服务**已承载虚拟屏**——`realScreenScopeError` 会经
    // `VdisplayController.displayIdForAlias` 解析 `virtual-N` 的动态 displayId 并把
    // `activeScreenId/activeDisplayId` 固定到该屏（见下方 realScreenScopeError 与
    // VdisplayController 的注册表）。一切内容读取与动作仍**先过范围门**（范围不含时结构化拒绝，
    // 绝不静默回退 display 0），但「虚拟屏不可用 / 永不路由到 caller 给的 display id」的旧述已失真：
    // caller 给的 displayId 对真实屏被拒（screen-display-mismatch），虚拟屏则一律由壳侧注册表裁决。
    if (op in REAL_SCREEN_OPS) {
      val scopeError = realScreenScopeError(args)
      if (scopeError != null) return scopeError
    }
    val result = when (op) {
      "snapshot" -> handleSnapshot(args)
      "click" -> handleClick(args)
      "longClick" -> handleLongClick(args)
      "setText" -> handleSetText(args)
      "scroll" -> handleScroll(args)
      "global" -> handleGlobal(args)
      "screenshot" -> handleScreenshot(args)
      "state" -> handleState()
```

</details>

**依据 3 · 源码核查**：[app/src/main/java/com/dsharnessmobile/shell/DeviceControlService.kt:749-779](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/app/src/main/java/com/dsharnessmobile/shell/DeviceControlService.kt#L749-L779)

拒绝越界并由原生注册表裁定显示ID。

<details>
<summary>查看原文（31行）</summary>

```text
      return error("screen-not-found：未知屏幕 $requested")
        .put("reason", "screen-not-found")
        .put("screenId", requested)
    }
    if (!scope.allows(requested)) {
      return error("screen-out-of-scope：用户当前开放范围为 ${scope.wire}，不允许访问 $requested")
        .put("reason", "screen-out-of-scope")
        .put("screenId", requested)
        .put("scope", scope.wire)
    }
    if (ScreenTargets.isVirtual(requested)) {
      // 虚拟屏：语义树/截屏只有无障碍通道可达；displayId 由 VdisplayController 动态分配（永不为 0）。
      val displayId = VdisplayController.displayIdForAlias(requested)
        ?: return error("screen-not-found：虚拟屏 $requested 尚未建立或已销毁；请先 android_vdisplay_create")
          .put("reason", "screen-not-found")
          .put("screenId", requested)
          .put("scope", scope.wire)
      activeScreenId = requested
      activeDisplayId = displayId
      return null
    }
    if (args.has("displayId") && !args.isNull("displayId") &&
      args.optInt("displayId", ScreenTargets.REAL_DISPLAY_ID) != ScreenTargets.REAL_DISPLAY_ID
    ) {
      return error("screen-display-mismatch：真实屏幕固定为 display 0，拒绝 caller 指定的其它 displayId")
        .put("reason", "screen-display-mismatch")
        .put("screenId", ScreenTargets.REAL)
        .put("displayId", ScreenTargets.REAL_DISPLAY_ID)
    }
    activeScreenId = ScreenTargets.REAL
    activeDisplayId = ScreenTargets.REAL_DISPLAY_ID
```

</details>

**依据 4 · 源码核查**：[app/src/main/java/com/dsharnessmobile/shell/BrowserHostProfile.kt:45-82](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/app/src/main/java/com/dsharnessmobile/shell/BrowserHostProfile.kt#L45-L82)

要求MULTI_PROFILE并验证非Default profile，失败拒绝。

<details>
<summary>查看原文（38行）</summary>

```text
  /** Must be the first operation on a newly constructed browser WebView, before even settings. */
  fun attach(browser: WebView) {
    if (!supported()) throw Failure("browser-profile-unsupported")
    val assigned = try {
      WebViewCompat.setProfile(browser, name)
      WebViewCompat.getProfile(browser).also {
        if (it.name != name || it.name == Profile.DEFAULT_PROFILE_NAME) {
          throw Failure("browser-profile-assignment-failed")
        }
      }
    } catch (failure: Failure) { throw failure
    } catch (failure: Throwable) { throw Failure("browser-profile-assignment-failed", failure) }
    // Even a provider policy failure leaves this view unusable, never a Default fallback.
    profile = assigned
    active = false
    try {
      val workers = assigned.serviceWorkerController
      workers.serviceWorkerWebSettings.apply {
        blockNetworkLoads = true
        allowFileAccess = false
        allowContentAccess = false
        cacheMode = WebSettings.LOAD_NO_CACHE
      }
      workers.setServiceWorkerClient(object : ServiceWorkerClient() {
        override fun shouldInterceptRequest(request: WebResourceRequest): WebResourceResponse? {
          if (blockedRequestReason(request.url.toString()) == null) return null
          serviceWorkerBlockedRequests.incrementAndGet()
          return blockedResponse()
        }
      })
      assigned.cookieManager.setAcceptCookie(true)
      assigned.cookieManager.setAcceptThirdPartyCookies(browser, false)
      active = true
      workers.serviceWorkerWebSettings.blockNetworkLoads = false
    } catch (failure: Throwable) {
      active = false
      try { assigned.serviceWorkerController.serviceWorkerWebSettings.blockNetworkLoads = true } catch (_: Throwable) { /* Still fail closed. */ }
      throw Failure("browser-profile-policy-failed", failure)
```

</details>

**依据 5 · 源码核查**：[app/src/main/java/com/dsharnessmobile/shell/BrowserHostProfile.kt:94-118](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/app/src/main/java/com/dsharnessmobile/shell/BrowserHostProfile.kt#L94-L118)

dispose与有限清理边界。

<details>
<summary>查看原文（25行）</summary>

```text
  /** Stop workers after the session's views are destroyed; retain its own login data for reuse. */
  fun dispose() {
    active = false
    val own = profile ?: return
    check(own.name == name && own.name != Profile.DEFAULT_PROFILE_NAME)
    own.serviceWorkerController.serviceWorkerWebSettings.blockNetworkLoads = true
    // A disposed service worker must not regain network access via a stale callback.
    own.serviceWorkerController.setServiceWorkerClient(object : ServiceWorkerClient() {
      override fun shouldInterceptRequest(request: WebResourceRequest): WebResourceResponse = blockedResponse()
    })
    own.cookieManager.flush()
  }

  /**
   * Limited, profile-only clear after dispose. AndroidX 1.12.1 has no complete browsing-data clear:
   * this does NOT promise erasure of IndexedDB, CacheStorage or service worker registrations.
   * Never use CookieManager.getInstance/WebStorage.getInstance or a loaded-profile delete fallback.
   */
  fun clearCookieAndWebStorageData(completed: () -> Unit) {
    check(!active) { "dispose the session before clearing its data" }
    val own = profile ?: run { completed(); return }
    check(own.name == name && own.name != Profile.DEFAULT_PROFILE_NAME)
    own.webStorage.deleteAllData()
    own.geolocationPermissions.clearAll()
    own.cookieManager.removeAllCookies { own.cookieManager.flush(); completed() }
```

</details>

#### 缺口

- 其他设备控制通道及不同Android/WebView实现的隔离一致性未完整核验。
  **影响**：不能从局部无障碍门和profile设计推出所有设备操作或数据擦除保证。
  **进一步探讨**：固定设备/WebView版本测试所有控制入口与profile生命周期，单列不支持和未覆盖。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 首次安装、后台运行和恢复需要什么代价？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Android和匹配arm64/x86_64 APK | 本地运行必需 | 内嵌运行环境 | 架构不符无法启动 |
| 模型API和网络 | 模型任务必需 | 推理与工具规划 | 无内置模型服务 |
| 前台服务/电池策略、通知 | 后台与应答相关 | 保活和审批 | 厂商仍可能限制 |
| 无障碍/Shizuku/WebView多profile | 指定控制能力必需 | 屏幕、虚拟屏和隔离浏览器 | 权限或特性不足明确受限 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份数据并装同渠道匹配ABI包 | 完成运行时解压，异常不强杀重装 |
| 2 | 仅开任务需要权限并配置模型 | 先非敏感目录命令验收 |
| 3 | 先虚拟屏/独立浏览器小任务 | 核对目标、输出和清理边界 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | APK、运行时磁盘 | 解压、权限、模型配置 | 作者称数分钟至十余分钟，未实测 |
| 持续使用 | 电池、内存、模型调用与流量 | 监督、权限维护与设备适配 | 未测电耗或合格任务费用 |
| 失败恢复 | 快照与备份空间 | 对账日志、Safe Mode或明确快照恢复 | 没可信目标时不应自动选最新 |
| 退出 | 数据导出与凭据清理 | 撤无障碍/Shizuku/悬浮权限、备份会话 | 浏览器profile清理不保证全擦除 |

熟悉Android权限的用户可在备用机或非敏感环境试用，先保持virtual-only。没有恢复与备份能力，或需要厂商锁屏后绝对持续运行的人，不宜据README承诺部署关键任务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-52](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/README.md#L41-L52)

系统、ABI和首次解压说明。

<details>
<summary>查看原文（12行）</summary>

```text
## 快速开始

| 项目 | 要求 |
|---|---|
| 系统版本 | Android 8.0 及以上 |
| 安装包大小 | 约 150-160 MB，建议 Wi-Fi 下载 |
| root | 不需要（可选装 Shizuku 解锁高级设备控制） |

1. 下载与本机匹配的 APK（见下一节）：真机选 arm64，模拟器选 x86_64。
2. 安装并首次启动。首次启动或升级后需要解压/刷新运行环境，可能需要几分钟到十余分钟，期间请勿强杀应用。
3. 按需开权限：无障碍、通知、Shizuku，应用内有引导。
4. 在设置里配置模型 API，跑第一条命令。
```

</details>

**依据 2 · 作者声明**：[README.md:68-96](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/README.md#L68-L96)

升级、权限与厂商电池/模型条件。

<details>
<summary>查看原文（29行）</summary>

```text
**请始终从同一渠道获取升级**：应用自带应用内检查更新；跨渠道混装出问题时，先完整卸载重装再反馈。

覆盖升级会保留会话、设置与插件配置；若触发运行环境刷新，可能需要十余分钟，期间请勿强杀应用。

## 权限说明

| 权限 | 用途 |
|---|---|
| 网络连接 | 加载 AI 对话、探测本地引擎、检查更新（仅手动触发） |
| 通知 | 通知栏应答与任务提醒（Android 13 及以上需在系统设置里允许） |
| 前台服务 | 保活运行，让 AI 任务在后台持续跑 |
| 所有文件访问 | 使用外部工作区目录时需要，你在系统页手动授予 |
| 安装未知应用 | 应用内检查更新时唤起系统安装器，须你在系统页显式授权 |

选择目录与图片走系统选择器，无需额外权限。虚拟屏与特权操作需你自行安装、启动并授权 [Shizuku](https://github.com/RikkaApps/Shizuku)。

## 常见问题

**为什么必须给无障碍权限？**
无障碍是 AI 看屏幕内容、替你操作的数据通道；不开启则仅虚拟屏可用。默认只允许 AI 操作虚拟屏，要动真实屏幕需要你在设置里主动放开范围。

**后台被杀怎么办？**
按应用内引导把本应用加入电池优化白名单；个别厂商的激进省电策略可能仍需手动加白。

**应用出问题去哪反馈？**
到 [issues](https://github.com/kelai141/dsh-mobile-apk/issues) 反馈，请附机型、应用版本（关于页可见）与复现步骤；也可以加文末用户群直接说。

**模型 API 从哪来、怎么配？**
在设置页的模型条目里直接选择协议与思考档位，应用不内置任何模型服务。
```

</details>

**依据 3 · 作者声明**：[docs/AGENTS/PERSISTENT-DATA.md:52-74](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/docs/AGENTS/PERSISTENT-DATA.md#L52-L74)

事务恢复状态和无可信目标的停止边界。

<details>
<summary>查看原文（23行）</summary>

```text
### Snapshot transaction interruption matrix

| Journal state at next startup | Recovery action | Data and retry consequence |
|---|---|---|
| `STAGED` | Delete the staged tree and previous tree, then clear the journal. | The swap had not started; the live runtime and HOME remain in place. A later start can retry refresh. |
| `SWAPPING` | Roll back journaled/discovered displaced entries in reverse order after validating the previous tree. | On complete rollback, clear the journal and retry refresh on a later start. If any entry cannot be restored, retain the journal and previous tree, report the failed entries, and retry recovery at a later start. |
| `SWAPPED` | Treat this phase as the commit signal: write the journal fingerprint, then remove previous/stage trees and clear the journal. | Keep the activated snapshot and roll forward; do not restore the previous tree. |
| No journal | If the snapshot is fresh, reclaim transaction residue; otherwise remove only the stage tree. | A markerless previous tree may still be the only rollback source for an incomplete swap, so it is reclaimed only after freshness proves the live snapshot is activated. |

Before a journal is written, extraction happens in `.snapshot-stage` and does not change the live runtime. Extraction failure or staged-runtime validation failure discards the stage and returns without swapping the live runtime. A stale stage is discarded on refresh; if it cannot be deleted, startup may move it to `.snapshot-stage-orphan-<timestamp>` and continue. If that move also fails, refresh stops and retains the residue for diagnosis.

Automatic `UndoGate` restores only an explicit shell-recorded `known-good` ID for the current fingerprint. The emergency CLI's `restore-last-good` remains a separate manual command; the plugin Undo UI uses its API and explicit snapshot ID. Keep these separate from automatic rollback: `restore-last-good` is unsafe as an automatic fallback because plugin boot-state can advance without the whole engine becoming healthy.

### User recovery when automatic rollback has no trusted target

No current-fingerprint `known-good` target is an intentional stop, not a recovery claim. The automatic path must not substitute the plugin-authored `restore-last-good` pointer. The Error guide exposes Safe Mode startup as its primary action (it also writes the repair prompt to the clipboard) and may additionally run one bounded runtime-tree recovery when the previous refusal was a confirmed incomplete live runtime (`GuidePageRenderer.kt:503-515`); no number of guide actions is promised, and the guide never tells the user any command. The manual paths below (`node "$DSH_FILES_DIR/undo-emergency.mjs" list` / `restore <id>`) are reachable through the built-in Console only — they are neither printed on the guide nor auto-run:

1. If the engine identifies exactly one failed non-hard plugin, `UndoGate` removes only that plugin entry before checking for a whole-snapshot target. A missing/pruned/cross-install known-good pointer does not block this surgical path. Hard-manifest plugins are never pulled automatically.
2. The Error guide's primary **Safe Mode startup** action requires the exact Hard ownership manifest, creates a verified backup, removes third-party insert entries, preserves shipped plugins and retries startup. If the manifest is missing/corrupt, it reports that Safe Mode did not start and leaves the patch unchanged. From the built-in Console, `dsh safe status`, `dsh safe`, and `dsh safe off` inspect, enter, and restore that exact pre-Safe-Mode patch. Safe Mode is useful for third-party plugin failures; it does not disable a broken shipped plugin.
3. For an intentional whole-Soft/config restore, open the built-in Console (available from the guide, and also when the engine is down) and inspect available IDs with `node "$DSH_FILES_DIR/undo-emergency.mjs" list`. The shell exports `DSH_FILES_DIR`, and the app deploys this CLI into that directory before the engine start attempt. After choosing a listed ID, restore only that exact ID with `node "$DSH_FILES_DIR/undo-emergency.mjs" restore <id>`; do not use `restore-last-good` or `latest` as an automatic substitute. This explicit action may replace plugin/config state from the chosen snapshot; sessions, workspaces, attachments, and credentials are outside its restore set. It requires the embedded bash/Node runtime to be usable.
4. If the runtime tree itself is incomplete, the guide's existing snapshot-repair path rebuilds Hard from the bundled snapshot while preserving DSH_HOME user data. A missing bash/Node runtime cannot run the emergency CLI; the guide's Safe Mode action and snapshot repair do not depend on the CLI.

If Safe Mode cannot restore startup, no uniquely attributable Soft plugin can be removed, and the runtime is incomplete or broken, the app may still require a corrected APK/runtime update. Do not claim the automatic known-good path covers these cases.
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 运行时恢复设计哪些值得复用，怎样检验保活？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

SnapshotTransaction在搬动前写SWAPPING，全部替换后写SWAPPED，持久化文档据此区分回滚与向前完成。可借鉴的是将阶段日志作为恢复依据，并把会话/凭据等用户数据与运行时刷新范围分开，避免把恢复等同覆盖整个HOME；本次未完成所有回滚调用链或设备故障测试，不宣称崩溃下零丢失。

未验证假设是将“后台已运行”拆成前台服务存活、引擎健康、当前任务继续和通知可达四个状态，在锁屏、省电和进程重启时分别对账。最小测试固定备用设备/系统，在四类中断点记录同一个无副作用长任务的进度和恢复时间；若服务存活但任务没有前进，应显示任务恢复而不是已自愈。若现有健康面已准确表达四层，则只补缺少的用户说明。

#### 证据与依据

**依据 1 · 源码核查**：[app/src/main/java/com/dsharnessmobile/shell/SnapshotTransaction.kt:591-601](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/app/src/main/java/com/dsharnessmobile/shell/SnapshotTransaction.kt#L591-L601)

动live树之前持久化SWAPPING并开始替换。

<details>
<summary>查看原文（11行）</summary>

```text
    // 预检必须在**动第一棵树之前**：这里失败 = 本次刷新干净失败（live 未动、可重试），
    // 而不是「live 已搬走、staged 搬不进来」的半搬态。
    requireDeletableResidue(previous, ownerProbe)
    SnapshotFs.deletePathStrict(previous)
    SnapshotFs.createDirectories(previous)
    writeMarker(filesDir, Marker(Phase.SWAPPING, fingerprint, startedAt, purpose = purpose, priorFingerprint = priorFingerprint, baseFingerprint = baseFingerprint))
    val moved = mutableListOf<String>()
    // #214：profiles 合并期间的工厂语义纠正说明（返回给调用方写日志/诊断）。
    val notes = mutableListOf<String>()

    replaceEntry(filesDir, moved, fingerprint, startedAt, "usr", stagedUsr, usrDir, File(previous, "usr"), onEntry, move, purpose, priorFingerprint, baseFingerprint)
```

</details>

**依据 2 · 源码核查**：[app/src/main/java/com/dsharnessmobile/shell/SnapshotTransaction.kt:652-658](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/app/src/main/java/com/dsharnessmobile/shell/SnapshotTransaction.kt#L652-L658)

最终写SWAPPED作为阶段结果。

```text
            "home/" + entry.name, entry, liveEntry, File(previous, "home/" + entry.name), onEntry, move,
          )
        }
      }
    }
    writeMarker(filesDir, Marker(Phase.SWAPPED, fingerprint, startedAt, moved, purpose, priorFingerprint, baseFingerprint))
    return notes
```

**依据 3 · 作者声明**：[docs/AGENTS/PERSISTENT-DATA.md:52-74](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/docs/AGENTS/PERSISTENT-DATA.md#L52-L74)

不同恢复阶段和无目标时停止的文档。

<details>
<summary>查看原文（23行）</summary>

```text
### Snapshot transaction interruption matrix

| Journal state at next startup | Recovery action | Data and retry consequence |
|---|---|---|
| `STAGED` | Delete the staged tree and previous tree, then clear the journal. | The swap had not started; the live runtime and HOME remain in place. A later start can retry refresh. |
| `SWAPPING` | Roll back journaled/discovered displaced entries in reverse order after validating the previous tree. | On complete rollback, clear the journal and retry refresh on a later start. If any entry cannot be restored, retain the journal and previous tree, report the failed entries, and retry recovery at a later start. |
| `SWAPPED` | Treat this phase as the commit signal: write the journal fingerprint, then remove previous/stage trees and clear the journal. | Keep the activated snapshot and roll forward; do not restore the previous tree. |
| No journal | If the snapshot is fresh, reclaim transaction residue; otherwise remove only the stage tree. | A markerless previous tree may still be the only rollback source for an incomplete swap, so it is reclaimed only after freshness proves the live snapshot is activated. |

Before a journal is written, extraction happens in `.snapshot-stage` and does not change the live runtime. Extraction failure or staged-runtime validation failure discards the stage and returns without swapping the live runtime. A stale stage is discarded on refresh; if it cannot be deleted, startup may move it to `.snapshot-stage-orphan-<timestamp>` and continue. If that move also fails, refresh stops and retains the residue for diagnosis.

Automatic `UndoGate` restores only an explicit shell-recorded `known-good` ID for the current fingerprint. The emergency CLI's `restore-last-good` remains a separate manual command; the plugin Undo UI uses its API and explicit snapshot ID. Keep these separate from automatic rollback: `restore-last-good` is unsafe as an automatic fallback because plugin boot-state can advance without the whole engine becoming healthy.

### User recovery when automatic rollback has no trusted target

No current-fingerprint `known-good` target is an intentional stop, not a recovery claim. The automatic path must not substitute the plugin-authored `restore-last-good` pointer. The Error guide exposes Safe Mode startup as its primary action (it also writes the repair prompt to the clipboard) and may additionally run one bounded runtime-tree recovery when the previous refusal was a confirmed incomplete live runtime (`GuidePageRenderer.kt:503-515`); no number of guide actions is promised, and the guide never tells the user any command. The manual paths below (`node "$DSH_FILES_DIR/undo-emergency.mjs" list` / `restore <id>`) are reachable through the built-in Console only — they are neither printed on the guide nor auto-run:

1. If the engine identifies exactly one failed non-hard plugin, `UndoGate` removes only that plugin entry before checking for a whole-snapshot target. A missing/pruned/cross-install known-good pointer does not block this surgical path. Hard-manifest plugins are never pulled automatically.
2. The Error guide's primary **Safe Mode startup** action requires the exact Hard ownership manifest, creates a verified backup, removes third-party insert entries, preserves shipped plugins and retries startup. If the manifest is missing/corrupt, it reports that Safe Mode did not start and leaves the patch unchanged. From the built-in Console, `dsh safe status`, `dsh safe`, and `dsh safe off` inspect, enter, and restore that exact pre-Safe-Mode patch. Safe Mode is useful for third-party plugin failures; it does not disable a broken shipped plugin.
3. For an intentional whole-Soft/config restore, open the built-in Console (available from the guide, and also when the engine is down) and inspect available IDs with `node "$DSH_FILES_DIR/undo-emergency.mjs" list`. The shell exports `DSH_FILES_DIR`, and the app deploys this CLI into that directory before the engine start attempt. After choosing a listed ID, restore only that exact ID with `node "$DSH_FILES_DIR/undo-emergency.mjs" restore <id>`; do not use `restore-last-good` or `latest` as an automatic substitute. This explicit action may replace plugin/config state from the chosen snapshot; sessions, workspaces, attachments, and credentials are outside its restore set. It requires the embedded bash/Node runtime to be usable.
4. If the runtime tree itself is incomplete, the guide's existing snapshot-repair path rebuilds Hard from the bundled snapshot while preserving DSH_HOME user data. A missing bash/Node runtime cannot run the emergency CLI; the guide's Safe Mode action and snapshot repair do not depend on the CLI.

If Safe Mode cannot restore startup, no uniquely attributable Soft plugin can be removed, and the runtime is incomplete or broken, the app may still require a corrected APK/runtime update. Do not claim the automatic known-good path covers these cases.
```

</details>

**依据 4 · 作者声明**：[docs/AGENTS/ARCHITECTURE.md:3-7](https://github.com/kelai141/dsh-mobile-apk/blob/842dfdd81ee53c6c8d1f0ca5d634319309d026c4/docs/AGENTS/ARCHITECTURE.md#L3-L7)

服务世代与通知持久化有明确边界，不承诺跨系统exactly-once。

```text
## fx2 生命周期与恢复增量

`EngineService` 的启动属主快速复查预算耗尽后转为五分钟慢速复查；定时任务绑定 Service epoch，销毁时取消，迟到回调不得启动旧世代引擎。端口外来占用、启动门和用户开机选项仍按原有失败分类处理。

`NotifySuppressQueue` 在现有 `dsh-notify` 私有 preferences 内保存 v1 有界延后日志，`NotifyStore.start` 恢复并重启 tick。延后成功必须先同步提交；失败不消费来源偏移。补投后同步结算，借助完整条目哈希和系统活动通知回执缩小崩溃重复窗口，不承诺跨 Android 通知与 preferences 的原子 exactly-once。容量、TTL、会话覆盖语义不变，不迁移模型、HOME 或用户插件目录。
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
