# DSH Mobile APK

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[664376f](https://github.com/kelai141/dsh-mobile-apk/tree/664376fde91af8a4cff3555a7d563ac999bc142f)

<!-- BEGIN META -->
[![GitHub ★ 982](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=982&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kelai141/dsh-mobile-apk)
<!-- END META -->

> **功能**：把 DSH 与设备控制交互带到 Android 手机。

> **亮点**：[Q02](#research-q02) 以用户范围与动态屏幕映射连接设备工具；不证明系统级沙箱。

> **主要限制**：[Q03](#research-q03) 本次未核查完整 native 构建，不能从桥代码推断 APK 全路径安全。

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
  - [Q01 · 手机本地运行给谁带来什么，与远程网页相比？](#detail-section-11)
  - [Q02 · 屏幕范围和虚拟屏如何在源码中约束？](#detail-section-12)
  - [Q03 · 权限、宿主和项目源码边界是什么？](#detail-section-13)
  - [Q04 · 安装、保活和恢复的成本有哪些？](#detail-section-14)
  - [Q05 · 哪些设计可复用，如何验证假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在手机上使用 DSH 并按需控制设备的用户。

桌面 DSH、远程网页和 Android 手动操作可完成部分任务，无需手机本地运行环境。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 本地手机交互 | 移动使用 | 实际设备未运行 |
| 虚拟屏目标 | 避免默认为物理屏 | 需注册表和 Shizuku |
| 物理屏控制 | 读取及输入 | 需无障碍和用户扩大范围 |
| 后台恢复 | 持续任务 | 文档声明，未测 |

**流程与依赖**

| 条件 | 用途 | 不满足时 |
|---|---|---|
| Android 和可用 DSH 环境 | 移动运行 | 无法按此路径使用 |
| 无障碍及用户允许实屏 | 物理屏操作 | 实屏能力受限 |
| Shizuku | 虚拟屏和特权操作 | 高级能力不可用 |

[Q01](#research-q01) 安装和配置后在手机发起任务，按用户授权访问设备。

**效果与成本**

[Q04](#research-q04) 权限、后台电池、可选 Shizuku、模型和恢复维护均有成本。

[Q01](#research-q01) 潜在移动场景便利；[Q03](#research-q03) 设备与安全效果未实测。

> **思考**：[Q03](#research-q03) 本次未核查完整 native 构建，不能从桥代码推断 APK 全路径安全。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 以用户范围与动态屏幕映射连接设备工具；不证明系统级沙箱。

[Q02](#research-q02) 虚拟屏动态映射失败不可默默回退 display 0，但不等于全部路径隔离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 本次未核查完整 native 构建，不能从桥代码推断 APK 全路径安全。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在隔离设备先验证权限、会话恢复并备份，保留桌面退路。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根仓静态核查桥接和文档；未运行 APK、Shizuku 或设备。

- 已检查：作者 README、包清单、源码路径 README.en.md、plugins/dsh-android-bridge/src/screen-scope.ts、plugins/dsh-android-bridge/src/index.ts、plugins/dsh-android-vdisplay/src/status.ts、plugins/dsh-android-vdisplay/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根仓桥接源码及 README；不执行 APK、设备或 native 服务。
- 下一步：对照现有状态入口与增加探针展示，测试权限撤销、注册表变化和超时，测错误启用/重试、误判、时延与电耗；另核查完整 native。

**分析版本**

- **仓库**：[kelai141/dsh-mobile-apk](https://github.com/kelai141/dsh-mobile-apk)
- **版本号**：未声明（[固定提交 664376f](https://github.com/kelai141/dsh-mobile-apk/tree/664376fde91af8a4cff3555a7d563ac999bc142f)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在现有状态入口附带受控探针时间和目标可帮助用户决定启用或重试；对照如无改善、误导或成本抵消收益即否定。

对照现有状态入口与增加探针展示，测试权限撤销、注册表变化和超时，测错误启用/重试、误判、时延与电耗；另核查完整 native。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 198 | 21462 | — | — | 531241 |
| .js | source | 20 | 10877 | 8026 | 2715 | — |
| .mjs | source | 160 | 45753 | 32808 | 11331 | — |
| .ts | source | 129 | 33815 | 22427 | 9615 | — |
| .tsx | source | 18 | 3999 | 3000 | 822 | — |
| .ts | test | 58 | 14227 | 11562 | 1490 | — |
| .tsx | test | 12 | 3621 | 2981 | 306 | — |
| .mjs | test | 166 | 28466 | 23158 | 3234 | — |
| .js | example | 86 | 186615 | 156945 | 31441 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/kelai141/dsh-mobile-apk/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对手机能力、屏幕目标边界、依赖和静态证据局限。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 手机本地运行给谁带来什么，与远程网页相比？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

项目面向希望在 Android 手机工作并让 AI 操作设备的用户。README 描述本地运行与通知回复，远程网页或桌面连接已有相似交互但不必在手机维护运行环境；本地便携的真实收益和经常使用频次未知。

#### 证据与依据

**依据 1 · 源码核查**：[README.en.md:16-29](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/README.en.md#L16-L29)

产品能力由作者描述。

<details>
<summary>查看原文（14行）</summary>

```text

> This project is open source under the MIT License. Forks, modifications, and redistribution are welcome. Contributions, suggestions, and feedback are appreciated.
> Judge AI-generated content and actions yourself; experimental features are labeled as such.

## What it can do

- **Real bash**: commands the AI runs actually execute in the built-in Termux environment — not simulated output.
- **Runs in the background, self-recovers**: lock the screen or switch apps and tasks keep running; the engine is watchdogged and relaunched when it wedges, and comes back on its own after a reboot. Background use drains more battery than an average app — allow "ignore battery optimizations" when the app guides you to.
- **AI browser** (experimental): the AI opens and drives web pages in a separate window whose cookies and logins are fully isolated from your daily browser — it never touches your accounts.
- **Virtual display** (experimental, needs Shizuku): the AI launches and operates third-party apps on a separate virtual screen without taking over yours, and you can watch it work in a floating window.
- **Phone control**: after you grant accessibility, the AI can read the screen and tap, swipe, type and screenshot for you on a real phone. By default only the virtual screen is allowed — touching the real screen requires you to widen the scope in settings.
- **Notification replies & approvals**: the AI's questions and approvals land in the notification shade; reply, pick options, approve or deny without switching back to the app (Android 13+ requires allowing notifications in system settings).
- **Floating bubble**: a desktop bubble shows live progress; expand the panel to answer the AI's questions and read task reports; triple-tap the status line to jump back into the app. Hide it any time.
- **Stable & self-healing**: a broken plugin that wrecks the page is auto-removed and the engine restarts within a minute; safe mode starts the app on a minimal setup for repair; startup failures get a repair assistant and a sanitized diagnostics bundle that is only sent when you tap share.
```

</details>

#### 缺口

- 未实机比较远程与本地任务
  **影响**：无法量化效率或需求强度
  **进一步探讨**：选同一任务在手机与远程环境记录耗时及恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 屏幕范围和虚拟屏如何在源码中约束？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

screen-scope 默认 virtual-only，逐操作读取原生偏好；读取失败或值无效回到默认。桥接解析虚拟别名时要求注册表确认动态 displayId；未就绪不回退物理屏 0。屏幕范围仅覆盖可识别路径与判定，不证明任意 shell 或所有设备权限形成完整沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-android-bridge/src/screen-scope.ts:3-9](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/plugins/dsh-android-bridge/src/screen-scope.ts#L3-L9)

默认范围和别名。

```text
/** User-owned, stable screen aliases exposed to model-facing Android tools. */
export type ScreenId = string
export type UserScreenScope = 'virtual-only' | 'real-only' | 'all'

export const DEFAULT_SCREEN_SCOPE: UserScreenScope = 'virtual-only'
export const REAL_SCREEN_ID = 'real'
export const VIRTUAL_SCREEN_ID = 'virtual-1'
```

**依据 2 · 源码核查**：[plugins/dsh-android-bridge/src/screen-scope.ts:1215-1255](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/plugins/dsh-android-bridge/src/screen-scope.ts#L1215-L1255)

偏好读取和未就绪规则。

<details>
<summary>查看原文（41行）</summary>

```text
/** Normalize only the three product settings values; corrupt data fails closed. */
export function normalizeScreenScope(value: unknown): UserScreenScope {
  return value === 'virtual-only' || value === 'real-only' || value === 'all' ? value : DEFAULT_SCREEN_SCOPE
}

/** Parse the native ScreenScopePrefs XML without allowing an engine plugin to write that preference. */
export function parseScreenScopePrefsXml(xml: string): UserScreenScope {
  const match = /<string\s+name="scope">([^<]*)<\/string>/.exec(xml)
  return normalizeScreenScope(match?.[1])
}

function scopePrefsPath(env: NodeJS.ProcessEnv): string | undefined {
  if (env.DSH_SCREEN_SCOPE_PREFS_PATH) return env.DSH_SCREEN_SCOPE_PREFS_PATH
  if (env.TERMUX__PREFIX && env.DSH_HOME) return SHELL_SCREEN_SCOPE_PREFS_DEFAULT
  return undefined
}

/**
 * Read the native preference afresh for each device operation. Test-only environment input is
 * intentionally gated, so a stale generic environment value cannot override the shell preference.
 */
export function currentScreenScope(env: NodeJS.ProcessEnv = process.env): UserScreenScope {
  if (env.DSH_SCREEN_SCOPE_TEST === '1' || env.DSH_SCREEN_SCOPE_TEST === 'true') {
    return normalizeScreenScope(env.DSH_SCREEN_SCOPE)
  }
  const path = scopePrefsPath(env)
  if (path === undefined) return DEFAULT_SCREEN_SCOPE
  try {
    return parseScreenScopePrefsXml(readFileSync(path, 'utf8'))
  } catch {
    return DEFAULT_SCREEN_SCOPE
  }
}

/**
 * Decide the executable physical/virtual-screen target for the user-owned scope.
 *
 * VirtualDisplay is deliberately not guessed from an Android numeric id: the alias must be resolved
 * through the native registry (`screens()` / `vdInfo`) and passed in via [ScreenAccessOptions].
 * Without a resolved id, before the display is ready every virtual request fails explicitly
 * (`screen-not-ready`) — never a silent fallback to display 0 (U-3).
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-android-bridge/src/index.ts:759-780](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/plugins/dsh-android-bridge/src/index.ts#L759-L780)

逐次读取及动态映射。

<details>
<summary>查看原文（22行）</summary>

```text
  /** Native user preference, read live; model code has no write surface for it. */
  screenScope(): UserScreenScope {
    return currentScreenScope()
  }

  /** Fail-closed screen target decision shared by all real/virtual content tool paths. */
  screenAccess(screenId?: string): ScreenAccessDecision {
    return decideScreenAccess(this.screenScope(), screenId)
  }

  /**
   * review C11 alias 契约：把 `virtual-1` 解析为**当次**动态 displayId（经壳侧 vdInfo 注册表）。
   * 只认原生回报的 kind=virtual 且 displayId>0 的条目；未就绪/不可达一律 null（绝不回退 display 0）。
   */
  async resolveScreenDisplayId(screenId: string): Promise<number | null> {
    if (screenId === 'real') return 0
    if (!isVirtualScreenId(screenId)) return null
    try {
      const r = await this.controlExec('vdInfo', {})
      if (!r.ok) return null
      const data = (r.data ?? {}) as { screens?: Array<{ alias?: string; displayId?: number; kind?: string }> }
      const hit = (data.screens ?? []).find((s) => s.alias === screenId && s.kind === 'virtual')
```

</details>

#### 缺口

- 未运行 native 注册表和全部命令路径
  **影响**：不能证明边界在设备上无绕过
  **进一步探讨**：隔离设备验证非法目标、注册表失效及原生命令复查。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限、宿主和项目源码边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

README 将虚拟显示标为实验性并要求 Shizuku；实屏操作需无障碍并扩大范围。权限选择器和远程 Web 均有各自交互边界，不能以默认虚拟屏视作系统级隔离证明。本次固定检出未见 Android Kotlin/Java 主工程，README 指明打包在协调仓库；不得由桥源码推断 APK 中原生端所有检查或实际表现。

#### 证据与依据

**依据 1 · 源码核查**：[README.en.md:23-26](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/README.en.md#L23-L26)

设备能力与权限条件。

```text
- **Runs in the background, self-recovers**: lock the screen or switch apps and tasks keep running; the engine is watchdogged and relaunched when it wedges, and comes back on its own after a reboot. Background use drains more battery than an average app — allow "ignore battery optimizations" when the app guides you to.
- **AI browser** (experimental): the AI opens and drives web pages in a separate window whose cookies and logins are fully isolated from your daily browser — it never touches your accounts.
- **Virtual display** (experimental, needs Shizuku): the AI launches and operates third-party apps on a separate virtual screen without taking over yours, and you can watch it work in a floating window.
- **Phone control**: after you grant accessibility, the AI can read the screen and tap, swipe, type and screenshot for you on a real phone. By default only the virtual screen is allowed — touching the real screen requires you to widen the scope in settings.
```

**依据 2 · 源码核查**：[README.en.md:78-87](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/README.en.md#L78-L87)

安装、权限与无障碍说明。

<details>
<summary>查看原文（10行）</summary>

```text
| Foreground service | Keep-alive, so AI tasks keep running in the background |
| All files access | Needed for external workspace directories; you grant it manually in system settings |
| Install unknown apps | Launches the system installer for in-app updates; you must grant it explicitly |

Picking directories and images goes through the system pickers — no extra permission needed. Virtual displays and privileged actions require you to install, start and authorize [Shizuku](https://github.com/RikkaApps/Shizuku).

## FAQ

**Why is accessibility required?**
It is the data channel for the AI to see the screen and operate it; without it only the virtual screen works. By default the AI may only operate the virtual screen; touching the real screen requires you to widen the scope in settings.
```

</details>

**依据 3 · 源码核查**：[README.en.md:101-105](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/README.en.md#L101-L105)

协调仓库与构建说明。

```text
## For developers

- **Build it yourself**: snapshots and packaging happen in the coordination repo [dsh-mobile](https://github.com/kelai141/dsh-mobile); this repository is the shell. Environment requirements: [`CONTRIBUTING.md`](CONTRIBUTING.md) and `docs/AGENTS/build-and-env.md`.
- **Bridge protocol** (`window.androidBridge`): see [`docs/AGENTS/BRIDGE-API.md`](docs/AGENTS/BRIDGE-API.md).
- **Model-visible tool surface**: see [`docs/AGENTS/modules.md`](docs/AGENTS/modules.md) (the current code is the authority).
```

#### 缺口

- 缺少完整 native 源码和设备执行
  **影响**：不能断言原生强制边界或机型兼容性
  **进一步探讨**：获取固定版本完整构建来源并隔离手机复核。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、保活和恢复的成本有哪些？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

README 描述后台自恢复、前台服务、电池优化豁免和可选 Shizuku；这是产品声明，不是本次验证结果。需用户配置 Android 权限、模型及本地运行环境，并在不适用机型或策略下退回常规桌面或远程 DSH。进程存活、重启后会话一致性、电耗和隐私均未测。

#### 证据与依据

**依据 1 · 源码核查**：[README.en.md:23-29](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/README.en.md#L23-L29)

后台和自恢复声明。

```text
- **Runs in the background, self-recovers**: lock the screen or switch apps and tasks keep running; the engine is watchdogged and relaunched when it wedges, and comes back on its own after a reboot. Background use drains more battery than an average app — allow "ignore battery optimizations" when the app guides you to.
- **AI browser** (experimental): the AI opens and drives web pages in a separate window whose cookies and logins are fully isolated from your daily browser — it never touches your accounts.
- **Virtual display** (experimental, needs Shizuku): the AI launches and operates third-party apps on a separate virtual screen without taking over yours, and you can watch it work in a floating window.
- **Phone control**: after you grant accessibility, the AI can read the screen and tap, swipe, type and screenshot for you on a real phone. By default only the virtual screen is allowed — touching the real screen requires you to widen the scope in settings.
- **Notification replies & approvals**: the AI's questions and approvals land in the notification shade; reply, pick options, approve or deny without switching back to the app (Android 13+ requires allowing notifications in system settings).
- **Floating bubble**: a desktop bubble shows live progress; expand the panel to answer the AI's questions and read task reports; triple-tap the status line to jump back into the app. Hide it any time.
- **Stable & self-healing**: a broken plugin that wrecks the page is auto-removed and the engine restarts within a minute; safe mode starts the app on a minimal setup for repair; startup failures get a repair assistant and a sanitized diagnostics bundle that is only sent when you tap share.
```

**依据 2 · 源码核查**：[README.en.md:78-82](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/README.en.md#L78-L82)

系统权限与可选特权。

```text
| Foreground service | Keep-alive, so AI tasks keep running in the background |
| All files access | Needed for external workspace directories; you grant it manually in system settings |
| Install unknown apps | Launches the system installer for in-app updates; you must grant it explicitly |

Picking directories and images goes through the system pickers — no extra permission needed. Virtual displays and privileged actions require you to install, start and authorize [Shizuku](https://github.com/RikkaApps/Shizuku).
```

#### 缺口

- 无安装、断电重启、电耗数据
  **影响**：不能保证保活和任务不重复
  **进一步探讨**：先备份，以设备测试锁屏、杀进程、重启、权限撤销和恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些设计可复用，如何验证假设？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

动态注册表比硬编码物理 id 更适合虚拟屏重建，实时读取偏好可反映用户更改，但设备竞态和原生复查未证明。现有 android_privilege_status 已聚合 gates、控制与路由状态；android_vdisplay_status 优先向控制队列请求 vdInfo，失败给出错误和指引。已有注释记录过去状态误报不可用，不能假定缺少诊断。本次未查完整 native，现有状态展示未穷尽。假设在现有状态入口上明确显示最近一次受控探针的时间、目标屏、权限及未知状态，可帮助用户决定是否启用控制或重试；不把探针成功解释为后续动作必然安全。对照：同设备同任务随机使用现有状态入口或增加探针的展示，依次注入权限撤销、注册表失效或变更、控制队列超时和正常情况，记录是否启用/重试是否正确、可用误报不可用、不可用误报可用、决定时间、额外耗电和探针成本。若错误决策率无改善、误导增加或成本抵消收益，则否定该假设。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-android-bridge/src/index.ts:759-780](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/plugins/dsh-android-bridge/src/index.ts#L759-L780)

即时偏好与动态映射。

<details>
<summary>查看原文（22行）</summary>

```text
  /** Native user preference, read live; model code has no write surface for it. */
  screenScope(): UserScreenScope {
    return currentScreenScope()
  }

  /** Fail-closed screen target decision shared by all real/virtual content tool paths. */
  screenAccess(screenId?: string): ScreenAccessDecision {
    return decideScreenAccess(this.screenScope(), screenId)
  }

  /**
   * review C11 alias 契约：把 `virtual-1` 解析为**当次**动态 displayId（经壳侧 vdInfo 注册表）。
   * 只认原生回报的 kind=virtual 且 displayId>0 的条目；未就绪/不可达一律 null（绝不回退 display 0）。
   */
  async resolveScreenDisplayId(screenId: string): Promise<number | null> {
    if (screenId === 'real') return 0
    if (!isVirtualScreenId(screenId)) return null
    try {
      const r = await this.controlExec('vdInfo', {})
      if (!r.ok) return null
      const data = (r.data ?? {}) as { screens?: Array<{ alias?: string; displayId?: number; kind?: string }> }
      const hit = (data.screens ?? []).find((s) => s.alias === screenId && s.kind === 'virtual')
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-android-bridge/src/screen-scope.ts:1232-1255](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/plugins/dsh-android-bridge/src/screen-scope.ts#L1232-L1255)

失败默认与不回退。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * Read the native preference afresh for each device operation. Test-only environment input is
 * intentionally gated, so a stale generic environment value cannot override the shell preference.
 */
export function currentScreenScope(env: NodeJS.ProcessEnv = process.env): UserScreenScope {
  if (env.DSH_SCREEN_SCOPE_TEST === '1' || env.DSH_SCREEN_SCOPE_TEST === 'true') {
    return normalizeScreenScope(env.DSH_SCREEN_SCOPE)
  }
  const path = scopePrefsPath(env)
  if (path === undefined) return DEFAULT_SCREEN_SCOPE
  try {
    return parseScreenScopePrefsXml(readFileSync(path, 'utf8'))
  } catch {
    return DEFAULT_SCREEN_SCOPE
  }
}

/**
 * Decide the executable physical/virtual-screen target for the user-owned scope.
 *
 * VirtualDisplay is deliberately not guessed from an Android numeric id: the alias must be resolved
 * through the native registry (`screens()` / `vdInfo`) and passed in via [ScreenAccessOptions].
 * Without a resolved id, before the display is ready every virtual request fails explicitly
 * (`screen-not-ready`) — never a silent fallback to display 0 (U-3).
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-android-bridge/src/index.ts:1469-1497](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/plugins/dsh-android-bridge/src/index.ts#L1469-L1497)

现有权限状态聚合 gates、控制状态和路由等。

<details>
<summary>查看原文（29行）</summary>

```text
    gates: { type: 'object', additionalProperties: true, description: '结构化授权事实（a11yEnabled/a11ySource/a11yHeartbeatAgeMs/fullAccess/allowSwitch/paired/wirelessDebug/adbReady）' },
    control: { type: 'object', additionalProperties: true, description: '控制通道运行时状态（a11yEnabled/queue/tokenConfigured）' },
    route: { type: 'object', additionalProperties: true, description: '每个常用操作走哪条通道/为什么/另一条缺什么（结构化路由）' },
    shell: { type: 'object', additionalProperties: true, description: '壳侧声明的协议版本与能力（caps.ops/view/gz）与协商结论' },
  },
}

/**
 * exact 路由 /api/android/privilege/status 的返回体（与工具面同源）。
 *
 * 出口必过 [toLosslessJson]：svc.status() 的 message、controlStats() 的 caps 都可能是
 * undefined——可选键缺省**整键不发**，否则返回体被工具体判为 not lossless JSON
 * （与 #204 同型：声明面与返回面脱钩）。
 */
export function buildPrivilegeStatusPayload(
  svc: AndroidPrivilegeService,
  controlTokenConfigured: boolean,
): Record<string, unknown> {
  return toLosslessJson({
    ...svc.status(),
    // 0.13.8 #172：结构化通道事实（两通道各自的门）——展示面与诊断共用，
    // adbReady 只看引擎级三道门（部署档位视图不参与，坑 29）。
    gates: svc.gateFacts(),
    // 0.13.5 W4：控制通道事实（只读；令牌本身绝不回显）
    control: {
      a11yEnabled: svc.a11yEnabled(),
      queue: svc.controlStats(),
      tokenConfigured: controlTokenConfigured,
    },
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-android-vdisplay/src/status.ts:202-226](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/plugins/dsh-android-vdisplay/src/status.ts#L202-L226)

模型端状态优先调用 vdInfo，失败返回归因和指引。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * 读一次能力状态——**模型工具专用**，走与控制 op 完全相同的通路。
 *
 * 为什么模型工具不能复用 `readVdSnapshot(faceOf())`：引擎侧 androidPrivilege 服务只暴露
 * `controlExec`（create/destroy 都从这条路走通），**没有** `vdisplayStatus`。工具只认桥面就必然
 * 恒报「未接通」。这里优先控制队列 `vdInfo`，与 create/destroy 同源；控制队列不可用时才回退桥面。
 *
 * @param face - 引擎侧 androidPrivilege 面（可选服务）。
 * @returns 状态快照；任何失败都带**归因准确**的 code/guidance，绝不把「读不到」说成「没落地」。
 */
export async function readVdToolSnapshot(face: VdisplayFace | undefined): Promise<VdSnapshot> {
  const service = face
  if (service?.controlExec !== undefined) {
    try {
      const reply = await service.controlExec('vdInfo', {}, 8_000)
      if (reply !== null && typeof reply === 'object' && reply.ok === true) {
        const data = reply.data
        if (data !== null && typeof data === 'object') return snapshotFromRaw(data as VdStatusPayload)
      }
      const detail = reply !== null && typeof reply === 'object' && typeof reply.error === 'string' && reply.error !== ''
        ? reply.error
        : undefined
      return snapshotFromRaw(undefined, {
        code: 'vdisplay-control-failed',
        guidance: '虚拟屏控制通道未回执 vdInfo：' + (detail ?? '控制队列未返回结果')
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-android-vdisplay/src/index.ts:165-178](https://github.com/kelai141/dsh-mobile-apk/blob/664376fde91af8a4cff3555a7d563ac999bc142f/plugins/dsh-android-vdisplay/src/index.ts#L165-L178)

源码注释记录过去状态误报与决策影响。

<details>
<summary>查看原文（14行）</summary>

```text
      //
      // 缺陷形态：`android_vdisplay_create` 成功（displayId=25/state=active），同一时刻
      // `android_vdisplay_status` 报「虚拟屏桥面尚未接通」。真因不是壳侧没落地，而是两条通路
      // 形状不同——create 走 controlExec（引擎侧 androidPrivilege 只暴露这一个面），
      // status 却去读 `vdisplayStatus?.()`，而**该字段在引擎侧服务上从未存在**。
      // 于是 status 恒拿 undefined → 恒报 blocked/vdisplay-shell-not-wired。
      //
      // 后果（用户实测）：模型看到「有屏但没用处」，据此判定能力不可用而放弃整条路径。
      // **声称不可用而实际可用**，与「声称可用而实际不可用」危害相同——都会让模型做出错误决策。
      //
      // 修法：`readVdToolSnapshot` 优先走控制队列 vdInfo（与 create/destroy 同源），
      // 拿不到才回退桥面；失败时的 code/guidance 必须**归因准确**（读不到 ≠ 没落地）。
      const snap = await readVdToolSnapshot(faceOf())
      return { ...snap, text: snap.ok ? snap.guidance : '虚拟屏不可用：' + snap.code + '。' + snap.guidance }
```

</details>

#### 缺口

- 未穷尽 native 状态展示，未测探针准确度或设备成本
  **影响**：不能认定现状缺口或新展示改善决策
  **进一步探讨**：与现有状态入口作设备对照，权限撤销、注册表变更及超时下测错误决策、时延与电耗，无改善或误导则否定。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
