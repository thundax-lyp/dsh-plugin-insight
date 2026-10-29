# DSHBox

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[95f4e16](https://github.com/WSK-build/DSHBox/tree/95f4e1688c03ef73d08795ea65504c0b061aa20b)

<!-- BEGIN META -->
[![GitHub ★ 351](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=351&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WSK-build/DSHBox)
<!-- END META -->

> **功能**：在 Android 中集成 PRoot/Debian、Node 与 DSH 运行时、WebView、终端和文件工作区，并附浏览器与手机助手适配。

> **亮点**：集成启动、当前token刷新、分层数据和移动交互，减少环境拼接，见 [Q01](#research-q01)。

> **主要限制**：PRoot/共享与Android授权非安全VM，自动化全执行链未穷核，后台/更新和真实数据恢复未验，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · DSHBox如何在手机运行DSH，是什么交付类型？](#detail-section-11)
  - [Q02 · “沙箱”、共享与手机/浏览器权限有哪些边界？](#detail-section-12)
  - [Q03 · 是否值得手机替代手搭，如何验证恢复而非看功能数量？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望手机使用DSH、避免手搭Termux环境的Android用户；本地DSH不等本地模型推理，见 [Q01](#research-q01)。

Termux/PRoot手搭DSH与系统浏览器或远程桌面DSH。当前集成运行管理/移动UI，仍承担Linux/Android与模型成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Android工作台 | 本地DSH/Web入口 | 设备/WebView/模型前提 |
| runtime | 分层启动/健康恢复 | 非VM隔离/未真机验收 |
| 资料 | userdata与share绑定 | 用户目录/Android权限 |
| 自动化适配 | Browser/Pilot权限面 | 只抽核审批设计，非全能力认证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Android10+ ARM64/兼容WebView | 必需 | APK与DSH移动页面 | 可能白屏/无法运行 |
| PRoot/Debian/Node/DSH层 | 必需 | 本机服务 | 首次下载/离线导入核来源 |
| 存储/网络/模型配置 | 必需 | runtime/会话/模型 | 本地Host不等无云费用 |
| 共享/相机/录音/自动化权限 | 按功能 | 文件/设备能力 | 不授只失相应能力，另核实际链 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备用设备/测试资料装环境 | 核来源/空间/WebView |
| 启动 | App启动proot与DSH | 当前token+页面真实可用 |
| 作业 | 用户小任务/按需自动化 | Android权限与范围分别确认 |
| 恢复 | 分层查服务/鉴权/权限 | 不以健康状态替任务结果 |
| 退出 | 停服务/导出/资料分管 | 公共共享不随app默认擦 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | APK/runtime下载空间未知 | 来源/设备/WebView/模型配置 | 未装设备 |
| 持续使用 | CPU/RAM/电量/token未知 | 休眠/权限/更新维护 | 无功耗或节时实证 |
| 失败恢复 | 下载/重建未知 | userdata备份/分层排错 | 不建议盲清数据 |
| 退出 | 私有/共享资料未知 | 停自动化/导出/权限撤回 | 卸载不擦共享副本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 移动集成 | proot/runtime/Web链 | 真机兼容与效率 |
| 鉴权恢复 | 当前token替换 | 后台/升级后实际无损 |
| 自动化 | 代表身份/审批设计 | 全能力权限与结果保障 |

> **思考**：PRoot/共享与Android授权非安全VM，自动化全执行链未穷核，后台/更新和真实数据恢复未验，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：集成启动、当前token刷新、分层数据和移动交互，减少环境拼接，见 [Q01](#research-q01)。

[Q01](#research-q01) runtime/userdata分层与token轮换值得复用；[Q02](#research-q02) Android权限、共享与自动化不能被“沙箱”统称覆盖。

<a id="detail-section-5"></a>

### 1.4 主要限制

PRoot/共享与Android授权非安全VM，自动化全执行链未穷核，后台/更新和真实数据恢复未验，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

备用兼容设备测试资料先启动/文件/终端，再单核Browser/Pilot，不以数量代验收，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定Android/runtime/token与代表权限设计已核，建议备用设备测试资料有限试用，未有设备或APK验收。

- 已检查：作者 README、包清单、源码路径 README.md、app/build.gradle.kts、app/src/main/AndroidManifest.xml、app/src/main/java/com/dshbox/app/runtime/RuntimeUpdateManager.kt、app/src/main/java/com/dshbox/app/ui/webview/DshUrl.kt、app/src/main/java/com/dshbox/app/ui/webview/DshWebViewScreen.kt、browser/browser-runtime/src/main/java/com/dshbox/browser/runtime/BrowserControlApprovalCoordinator.kt、pilot/interlock-relay-core/src/main/java/interlock/relay/core/interlock/InterlockGate.kt、sandbox-manager/src/main/java/com/dshbox/app/sandbox/DefaultSandboxManager.kt、sandbox-manager/src/main/java/com/dshbox/app/sandbox/SandboxConfig.kt 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：四准备材料身份固定一致，catalog无旧研究。Kotlin/XML不在稀疏树时通过git show固定源核；读gradle/manifest/config/manager/Web URL容器、代表Browser/Pilot授权、更新管理说明。未全审内置二进制/自动化全部入口执行器、runtime完整供应链/回滚，不构建/安装/运行。
- 下一步：无APK/Android设备/模型任务实测；先备用设备失败矩阵和手搭对照，截图/健康日志不替资料及任务验收。

**分析版本**

- **仓库**：[WSK-build/DSHBox](https://github.com/WSK-build/DSHBox)
- **版本号**：1.5.0（Gradle versionName）（[固定提交 95f4e16](https://github.com/WSK-build/DSHBox/tree/95f4e1688c03ef73d08795ea65504c0b061aa20b)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

分层健康+可恢复任务检查点，对照手搭测休眠/升级/撤权后资料与任务恢复，未实现，见 [Q03](#research-q03)。

无APK/Android设备/模型任务实测；先备用设备失败矩阵和手搭对照，截图/健康日志不替资料及任务验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 5 | 4495 | 3882 | 422 | — |
| .cjs | test | 6 | 2280 | 2082 | 127 | — |
| .js | test | 16 | 5487 | 5162 | 105 | — |
| .md | source | 16 | 2295 | — | — | 37563 |
| .mjs | source | 6 | 436 | 293 | 106 | — |
| .js | source | 20 | 9493 | 7883 | 1239 | — |
| .mjs | test | 4 | 2629 | 2244 | 193 | — |

</details>

**活跃度**

[![Issue 未关闭 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=23&color=737b86&logo=github)](https://github.com/WSK-build/DSHBox/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 42](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=42&color=737b86&logo=github)](https://github.com/WSK-build/DSHBox/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=22&color=737b86&logo=github)](https://github.com/WSK-build/DSHBox/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：手机本地DSH集成的运行、资料和权限恢复是否比手搭更可控？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSHBox如何在手机运行DSH，是什么交付类型？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

固定DSHBox是Android应用/客户端，Gradle自报1.5.0、minSdk29，不是安装到DSH的单个插件。作者目标是Android10+ ARM64把PRoot/Debian/Node/DSH、WebView、终端/文件和手机/网页助手集中，减少Termux手搭；本地运行的是DSH与Linux用户态环境，不等所有模型推理离线。

实际manager把rootfs、Node/DSH层、userdata、shim与Pilot/Browser/用户share绑定传入启动命令，并start proot dsh。config默认127.0.0.1:3080，区分runtime/sandbox/user-data/logs/backups/updates。进程raw line解析启动token放StateFlow，重启有新token就更新；Web容器跟当前token刷新，URL helper剥旧token重写，非只硬编码一条无鉴权网页。源码支持集成本地运行链，但没有安装APK/设备实测就不能保证机型、WebView或服务任务工作。

#### 证据与依据

**依据 1 · 源码核查**：[app/build.gradle.kts:35-43](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/app/build.gradle.kts#L35-L43)

真实Android身份版本/minSdk。

```text
    defaultConfig {
        applicationId = "com.dshbox.app"
        minSdk = 29
        targetSdk = 36
        // 多语言版本：联合国六语 + 语言选择器 + 硬编码清零 + 布局恒 LTR + i18n 门禁。
        versionCode = 9
        versionName = "1.5.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
```

**依据 2 · 作者声明**：[README.md:24-31](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/README.md#L24-L31)

作者设备/在线或离线运行环境/WebView条件。

```text
| 项目 | 说明 |
|---|---|
| 系统要求 | Android 10+ · ARM64 |
| 权限 | 无需 Root · 无需 Termux |
| 内置 | DSH 层 · WebView · PRoot（Debian 与 Node.js 改为首次运行时多镜像源检测在线获取或离线导入） |
| 安装包 | 以 Release 页面所附 APK 为准 |
| 首次准备 | 按分步引导安装精简 Debian 与 Node.js，支持多镜像源检测、失败重试或离线导入；引导页提供 WebView 版本探测与兼容性提示 |
| **特别注意** | 由于 DSH 官方对系统 WebView 内核要求较高，较低版本可能导致白屏、工作区加载异常等问题。遇到此类情况，可通过谷歌商店更新系统 WebView，或咨询 AI，选择适合自己设备的 WebView 版本进行升级或替换。 |
```

**依据 3 · 源码核查**：[sandbox-manager/src/main/java/com/dshbox/app/sandbox/SandboxConfig.kt:5-45](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/sandbox-manager/src/main/java/com/dshbox/app/sandbox/SandboxConfig.kt#L5-L45)

loopback/port和多层数据目录。

<details>
<summary>查看原文（41行）</summary>

```text
data class SandboxConfig(
    val appFilesDir: File,
    val nativeLibraryDir: String? = null,
    /** 应用 cacheDir（可随系统/清理功能释放）；1.1.1 起 npm 下载缓存放这里。 */
    val appCacheDir: File? = null,
    val dshHost: String = "127.0.0.1",
    val dshPort: Int = 3080,
    val healthPath: String = "/",
    val maxAutoRestartAttempts: Int = 3,
    /**
     * 首次启动的就绪超时（毫秒）：进程仍存活却始终不就绪时，超过该时长即判启动失败
     * （清理进程并置 ERROR），不再重启。
     *
     * 与 [dshUnresponsiveGraceMs] 语义不同、当前默认值相同（都是两分钟）：前者管
     * 「启动阶段始终不就绪」，后果是失败退场；后者管「已就绪后持续不应答」，后果是
     * 有界重启。两者是彼此独立的旋钮，调整其一时不要顺手改动另一个。
     */
    val dshReadyTimeoutMs: Long = 120_000L,
    /**
     * 已就绪的 DSH 实例「探测持续失败多久」才判定不可用（毫秒）。
     *
     * 进程句柄仍存活时，单次探测失败不足以说明 DSH 出了故障：设备休眠或系统冻结
     * 后台应用期间，整个 guest 会被挂起——端口仍在监听、HTTP 不应答，属可自愈的
     * 暂时状态。只有连续失败超过该窗口才进入有界重启。
     */
    val dshUnresponsiveGraceMs: Long = 120_000L,
    /** Browser CLI assets and screenshots, exposed only to guest as `/opt/browser`. */
    val browserEntryDir: File = File(appFilesDir, "browser-tools"),
    /**
     * 共享区绑定清单提供者（guest 别名 → 宿主目录）：内建 `DSHBox` + 用户挂载目录。
     *
     * 每次起会话时现取——用户新授权或新增挂载后无需重建配置；目录缺失的条目由
     * 调用侧按存在性跳过，会话照常启动。
     */
    val shareBindsProvider: () -> List<Pair<String, File>> = { emptyList() },
) {
    val runtimeDir: File = File(appFilesDir, "runtime")
    val sandboxDir: File = File(appFilesDir, "sandbox")
    val userDataDir: File = File(appFilesDir, "user-data")
    val logsDir: File = File(appFilesDir, "logs")
    val backupsDir: File = File(appFilesDir, "backups")
```

</details>

**依据 4 · 源码核查**：[sandbox-manager/src/main/java/com/dshbox/app/sandbox/DefaultSandboxManager.kt:235-249](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/sandbox-manager/src/main/java/com/dshbox/app/sandbox/DefaultSandboxManager.kt#L235-L249)

真实启动参数、绑定与raw日志token接线。

<details>
<summary>查看原文（15行）</summary>

```text
                        prootBinary = prootBinary().absolutePath,
                        rootfsDir = baseRootfs().absolutePath,
                        workspaceBind = config.userDataDir.absolutePath,
                        nodeDir = nodeLayerDir().takeIf { it.isDirectory }?.absolutePath,
                        dshDir = dshLayerDir().takeIf { it.isDirectory }?.absolutePath,
                        shimHostDir = linkShimHostDir(),
                        dshPatchGuestPaths = dshOverlayGuestPaths(),
                        pilotHostDir = pilotHostDir(),
                        browserHostDir = browserHostDir(),
                        shareBinds = shareAreaBinds(),
                    )
                    val prootEnv = buildProotEnv(runtimeDir, "dsh")
                    Log.i(TAG, "starting dsh proot")
                    dshProcess = processRunner.start(command, tag = "dsh", env = prootEnv, onRawLine = ::ingestDshWebLaunchToken)
                    Log.i(TAG, "dsh proot process started")
```

</details>

**依据 5 · 源码核查**：[sandbox-manager/src/main/java/com/dshbox/app/sandbox/DefaultSandboxManager.kt:1378-1393](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/sandbox-manager/src/main/java/com/dshbox/app/sandbox/DefaultSandboxManager.kt#L1378-L1393)

token轮换内存更新。

<details>
<summary>查看原文（16行）</summary>

```text
    private fun ingestDshWebLaunchToken(line: String) {
        val marker = "dsh web: http"
        val idx = line.indexOf(marker)
        if (idx < 0) return
        val tokenAt = line.indexOf("token=", idx)
        if (tokenAt < 0) return
        val start = tokenAt + "token=".length
        val end = line.indexOf('&', start).let { if (it < 0) line.length else it }
        val token = line.substring(start, end).trim().takeIf { it.isNotEmpty() }
        if (token != null) {
            // 修正)：DSH 进程重启会生成新 launchToken，旧值随即失效——
            // 每次捕获都更新（不因已持有旧值而跳过），WebView 侧随 StateFlow 变化
            // 自动用新 token 重载，避免 401 + ERR_HTTP_RESPONSE_CODE_FAILURE。
            _dshLaunchToken.value = token
            Log.i(TAG, "dsh web launch token refreshed")
        }
```

</details>

**依据 6 · 源码核查**：[app/src/main/java/com/dshbox/app/ui/webview/DshUrl.kt:23-42](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/app/src/main/java/com/dshbox/app/ui/webview/DshUrl.kt#L23-L42)

URL替换旧token。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * 给 DSH 基础地址写入**当前**启动 token（`?token=<值>`）。
 *
 * ## 语义是"替换"而不是"追加"
 *
 * DSH 网页端以启动 token 鉴权，而 **token 会随 DSH 重启轮换**。WebView 容器持有的
 * `url` 里烤的是建容器那一刻的旧 token，重启后若这里遇到 `token=` 就原样返回，
 * 那么「手动刷新」与「401 自动重试」两条路径都会拿旧 token 去请求 —— 表现就是
 * 白屏 + 进度条卡住、连手动刷新也不好使（且因 `autoRefreshedForAuth` 已置位而无法自愈）。
 *
 * 因此这里**先剥离已有的 `token=` 再写入新值**（同时保留其它 query 参数），
 * 使「带旧 token 的 URL + 新 token」也能得到正确结果。
 *
 * 本函数是纯函数（不依赖 Android API），便于 JVM 单测锁住上述语义。
 */
internal fun dshUrlWithToken(base: String, token: String?): String {
    if (token.isNullOrEmpty()) return base
    val encoded = encodeQueryValue(token)
    val queryStart = base.indexOf('?')
    if (queryStart < 0) return "$base?token=$encoded"
```

</details>

**依据 7 · 源码核查**：[app/src/main/java/com/dshbox/app/ui/webview/DshWebViewScreen.kt:529-560](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/app/src/main/java/com/dshbox/app/ui/webview/DshWebViewScreen.kt#L529-L560)

容器更新/刷新使用当前token。

<details>
<summary>查看原文（32行）</summary>

```text
    /** DSH 换新 launchToken 时由 UI 调用：更新 token 并重新武装 401 重试。 */
    fun onLaunchTokenChanged(token: String?) {
        if (token != launchToken) {
            launchToken = token
            autoRefreshedForAuth = false
        }
    }

    /**
     * 手动重新加载（错误覆盖层的"重试"、刷新按钮、面板按钮共用）。
     *
     * 三处入口都必须**带当前 token 加载**：裸 `webView.reload()` 请求的是当前文档地址，
     * 一旦 DSH 换过 token（重启/健康循环拉起），手动刷新拿到的仍是旧（或无）token 的地址，
     * 页面继续白屏，表现为"连手动刷新都不好使"。同时把 401 自动重试重新武装 ——
     * 手动重试应获得新的一次机会。
     *
     * 注意取的是容器自己的 [launchToken]（由 [onLaunchTokenChanged] 持续更新），
     * 而不是组合期捕获的值 —— 点击发生在组合之后，捕获值会是旧的。
     */
    fun reloadWithToken() {
        autoRefreshedForAuth = false
        val token = launchToken
        if (token != null) {
            // 手动刷新/重试：同一地址也要真重新走一次，故 force。
            loadIfNeeded(dshUrlWithToken(url, token), force = true)
        } else {
            webView.reload()
        }
    }

    /**
     * 应用宿主主题到 WebView 画布（背景色）。
```

</details>

#### 缺口

- 未安装APK/核机型与WebView，完整启动/模型调用和恢复未实证。
  **影响**：无法承诺特定手机/WebView可启动、自动token恢复有效或工作任务成功，只能确认源码集成设计。
  **进一步探讨**：备用兼容设备隔离资料验证首次准备、启动/重启token、WebView交互与真实小任务，记录版本/资源。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · “沙箱”、共享与手机/浏览器权限有哪些边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

PRoot是应用内Linux用户态运行和路径绑定，不应当成独立内核VM或恶意工具安全隔离证明。shareBinds明确让用户授权目录映射进guest；Manifest还声明所有文件访问、相机、录音、前台服务等能力。声明不等已授权或每项必开，但启用后数据可达范围必须按实际Android授权与绑定理解，不能把本地/无root说成没有权限成本。

Browser与Pilot是另两套能力面。代表Browser coordinator处理request/status/cancel，绑定当前page identity、nonce/冲突和展示失败取消；Pilot InterlockGate接口包含capability/argsIdentity/预算/系统探测与授权屏标志，说明细化授权设计。这里只追代表结构，未完整核CLI/tool入口到每项执行器，不能据此认证所有网页/原生动作逐项确认、截屏无敏感泄漏或跨会话隔离。重启token刷新解决可达性，不认证整套信任；权限撤回/后台杀进程/新页面身份都需设备验证。

#### 证据与依据

**依据 1 · 源码核查**：[sandbox-manager/src/main/java/com/dshbox/app/sandbox/SandboxConfig.kt:31-45](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/sandbox-manager/src/main/java/com/dshbox/app/sandbox/SandboxConfig.kt#L31-L45)

Browser路径与用户share绑定。

<details>
<summary>查看原文（15行）</summary>

```text
    /** Browser CLI assets and screenshots, exposed only to guest as `/opt/browser`. */
    val browserEntryDir: File = File(appFilesDir, "browser-tools"),
    /**
     * 共享区绑定清单提供者（guest 别名 → 宿主目录）：内建 `DSHBox` + 用户挂载目录。
     *
     * 每次起会话时现取——用户新授权或新增挂载后无需重建配置；目录缺失的条目由
     * 调用侧按存在性跳过，会话照常启动。
     */
    val shareBindsProvider: () -> List<Pair<String, File>> = { emptyList() },
) {
    val runtimeDir: File = File(appFilesDir, "runtime")
    val sandboxDir: File = File(appFilesDir, "sandbox")
    val userDataDir: File = File(appFilesDir, "user-data")
    val logsDir: File = File(appFilesDir, "logs")
    val backupsDir: File = File(appFilesDir, "backups")
```

</details>

**依据 2 · 源码核查**：[app/src/main/AndroidManifest.xml:8-32](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/app/src/main/AndroidManifest.xml#L8-L32)

前台/录音/相机/所有文件权限声明。

<details>
<summary>查看原文（25行）</summary>

```text
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- DSH Web 侧能力的运行时权限：语音输入需要录音，附件来源菜单的「拍照/录像」
         需要相机。两者都在使用时按需请求，未授予时只有对应功能不可用。
         注意：本应用一旦声明 CAMERA，系统会要求 ACTION_IMAGE_CAPTURE 调用方持有
         该权限，因此相机入口必须先确保权限已授予再发起拍摄。 -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.CAMERA" />

    <!-- 普通权限（安装即授，无运行时弹窗）。Chromium 的录音设备检查要求它与
         RECORD_AUDIO **同时**具备，否则 WebView 内拿不到录音设备：
         日志表现为 `Requires MODIFY_AUDIO_SETTINGS and RECORD_AUDIO. No audio
         device will be available for recording`，页面侧则表现为语音输入启动失败。 -->
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <!-- 共享区（公共存储 DSHBox 目录，与 guest /root/share/DSHBox 同一份数据）。
         Android 11+ 读写公共存储需要「所有文件访问」特殊权限（在设置页授予）；
         Android 10 走旧式存储（requestLegacyExternalStorage + WRITE_EXTERNAL_STORAGE）。 -->
    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />
    <uses-permission
        android:name="android.permission.WRITE_EXTERNAL_STORAGE"
        android:maxSdkVersion="29" />
```

</details>

**依据 3 · 源码核查**：[sandbox-manager/src/main/java/com/dshbox/app/sandbox/DefaultSandboxManager.kt:235-244](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/sandbox-manager/src/main/java/com/dshbox/app/sandbox/DefaultSandboxManager.kt#L235-L244)

实际用户目录与自动化adapter绑定。

<details>
<summary>查看原文（10行）</summary>

```text
                        prootBinary = prootBinary().absolutePath,
                        rootfsDir = baseRootfs().absolutePath,
                        workspaceBind = config.userDataDir.absolutePath,
                        nodeDir = nodeLayerDir().takeIf { it.isDirectory }?.absolutePath,
                        dshDir = dshLayerDir().takeIf { it.isDirectory }?.absolutePath,
                        shimHostDir = linkShimHostDir(),
                        dshPatchGuestPaths = dshOverlayGuestPaths(),
                        pilotHostDir = pilotHostDir(),
                        browserHostDir = browserHostDir(),
                        shareBinds = shareAreaBinds(),
```

</details>

**依据 4 · 源码核查**：[browser/browser-runtime/src/main/java/com/dshbox/browser/runtime/BrowserControlApprovalCoordinator.kt:63-82](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/browser/browser-runtime/src/main/java/com/dshbox/browser/runtime/BrowserControlApprovalCoordinator.kt#L63-L82)

Browser审批动作与生命周期关闭。

<details>
<summary>查看原文（20行）</summary>

```text
    fun execute(request: JSONObject): JSONObject = onMainBlocking {
        if (closed.get()) return@onMainBlocking response("SERVICE_CLOSED", JSONObject())
        when (request.optString("action")) {
            "request" -> requestApproval(request)
            "status" -> status(request)
            "cancel" -> cancel(request)
            else -> response("INVALID_ARGUMENT", JSONObject())
        }
    } ?: response("APPROVAL_SURFACE_UNAVAILABLE", JSONObject())

    /** Called when Browser session/page identity changes; any old approval is settled and dismissed. */
    fun onHostStateChanged() = runOnMain {
        refreshPendingState()
    }

    /** Called when the Activity that owns a foreground confirmation is closing. */
    fun onActivityClosed() = runOnMain {
        refreshExpiration()
        val approval = store.pending(elapsedNow())
        if (approval != null) finish(approval, BrowserControlApprovalStatus.CANCELLED)
```

</details>

**依据 5 · 源码核查**：[browser/browser-runtime/src/main/java/com/dshbox/browser/runtime/BrowserControlApprovalCoordinator.kt:121-143](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/browser/browser-runtime/src/main/java/com/dshbox/browser/runtime/BrowserControlApprovalCoordinator.kt#L121-L143)

身份/nonce冲突与呈现失败取消。

<details>
<summary>查看原文（23行）</summary>

```text
        val host = hostSupplier() ?: return response("NO_ACTIVE_SESSION", JSONObject())
        val state = hostState(host)
        BrowserControlApprovalPolicy.requestError(state)?.let { return response(it, JSONObject()) }
        val identity = state.identity ?: return response("NO_ACTIVE_SESSION", JSONObject())
        if (host.controlTransferPending && !store.hasPending()) return response("CONTROL_TRANSFER_PENDING", JSONObject())
        val id = UUID.randomUUID().toString().replace("-", "")
        val nonce = randomNonce()
        val created = store.start(id, nonce, summary, taskId, identity, elapsedNow(), wallNow())
        when (created) {
            BrowserControlApprovalStore.Start.PendingConflict -> return response("CONTROL_REQUEST_PENDING", JSONObject())
            is BrowserControlApprovalStore.Start.Coalesced -> return response("OK", data(created.approval, coalesced = true))
            is BrowserControlApprovalStore.Start.Created -> {
                val approval = created.approval
                if (host.controlTransferPending) {
                    store.settle(approval.id, approval.nonce, BrowserControlApprovalStatus.CANCELLED, elapsedNow())
                    return response("CONTROL_TRANSFER_PENDING", JSONObject())
                }
                val presented = tryPresent(host, approval)
                if (!presented) {
                    store.settle(approval.id, approval.nonce, BrowserControlApprovalStatus.CANCELLED, elapsedNow())
                    runCatching { host.dismissForeground(approval.id) }
                    dismissAll()
                    return response("APPROVAL_SURFACE_UNAVAILABLE", data(approval.copy(status = BrowserControlApprovalStatus.CANCELLED)))
```

</details>

**依据 6 · 源码核查**：[pilot/interlock-relay-core/src/main/java/interlock/relay/core/interlock/InterlockGate.kt:63-81](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/pilot/interlock-relay-core/src/main/java/interlock/relay/core/interlock/InterlockGate.kt#L63-L81)

Pilot授权接口的路线/系统/授权屏条件。

<details>
<summary>查看原文（19行）</summary>

```text
     * [budgetMs] 为本次调用在通道里剩下的预算，用于给确认框窗口封顶，见 [InterlockBroker.request]。
     *
     * [system] 是调用方按本次裁决出的执行路线探测出的系统权限快照：同一能力在不同路线
     * 上需要的系统条件不同（坐标四条走可信屏就不需要无障碍），先定路线再探测才不会
     * 用「另一条路」的权限状态放行或挡下这一次调用。
     *
     * [consentScreen]：目标落在系统授权界面上（见 [ConsentSurfaces]）。这一条把会话授权
     * 与「本会话内允许」那颗按钮一起关掉 —— 用户在别处答过一次"读通讯录"，不等于答过
     * "替任意应用批准权限"。档位为「完全访问」时同样强制当场问。
     */
    suspend fun authorize(
        descriptor: CapabilityDescriptor,
        targetLabel: String?,
        paramDetail: String?,
        argsIdentity: String,
        volatileTarget: Boolean,
        budgetMs: Long,
        consentScreen: Boolean = false,
        system: ProbeResult,
```

</details>

#### 缺口

- 全能力执行/审批接线、Android权限撤回、共享目录和跨会话隔离未穷核。
  **影响**：无法把PRoot/代表审批结构当全自动化安全认证，重要目录和手机权限不宜默认全开。
  **进一步探讨**：设备上分别从关闭/拒绝/撤权/页面切换/后台恢复核实际调用；只授测试目录，确认Browser/Pilot各自权限与操作结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 是否值得手机替代手搭，如何验证恢复而非看功能数量？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议有备用Android10+ ARM64设备的DSH用户有限试用，先只启动/文件/终端小任务，Browser/Pilot按需求分别核，不能用内置工具数量作可靠性。第一次有APK来源、在线Debian/Node或离线导入、空间/下载、WebView版本与模型配置；持续有CPU/RAM/电量/温控/前台通知及模型token/网络；失败需要保userdata、分层检查服务/运行时/权限/token，不把重装清数据当普通刷新。具体金额、启动时长/功耗/节时未知。

config区分首次ready120秒和已ready持续无响应120秒，maxAutoRestartAttempts3，体现休眠/卡死恢复思路；不证明设备上不误重启或会话无损。更新管理器会探npm版本并在guest构建所选DSH层再交正常更新管线，运行环境变化比普通UI更新更重，本轮未全核验证/回滚链。退出先停止服务和自动化，区分app私有数据/备份与公共共享目录，卸载不等擦外部共享副本。

方向是分层健康与可恢复任务检查点：明示runtime/DSH/Web鉴权/Android权限/自动化控制分别状态与最近有效检查，不让健康页代替真实任务成功。对手搭Termux/当前/检查点版本比较冷启动、休眠杀后台、更新失败后资料完整/任务恢复、耗电和人工时间；无改善则停止，未实现。

#### 证据与依据

**依据 1 · 源码核查**：[sandbox-manager/src/main/java/com/dshbox/app/sandbox/SandboxConfig.kt:13-30](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/sandbox-manager/src/main/java/com/dshbox/app/sandbox/SandboxConfig.kt#L13-L30)

不同启动/持续无响应预算和有界重启配置。

<details>
<summary>查看原文（18行）</summary>

```text
    val maxAutoRestartAttempts: Int = 3,
    /**
     * 首次启动的就绪超时（毫秒）：进程仍存活却始终不就绪时，超过该时长即判启动失败
     * （清理进程并置 ERROR），不再重启。
     *
     * 与 [dshUnresponsiveGraceMs] 语义不同、当前默认值相同（都是两分钟）：前者管
     * 「启动阶段始终不就绪」，后果是失败退场；后者管「已就绪后持续不应答」，后果是
     * 有界重启。两者是彼此独立的旋钮，调整其一时不要顺手改动另一个。
     */
    val dshReadyTimeoutMs: Long = 120_000L,
    /**
     * 已就绪的 DSH 实例「探测持续失败多久」才判定不可用（毫秒）。
     *
     * 进程句柄仍存活时，单次探测失败不足以说明 DSH 出了故障：设备休眠或系统冻结
     * 后台应用期间，整个 guest 会被挂起——端口仍在监听、HTTP 不应答，属可自愈的
     * 暂时状态。只有连续失败超过该窗口才进入有界重启。
     */
    val dshUnresponsiveGraceMs: Long = 120_000L,
```

</details>

**依据 2 · 源码核查**：[app/src/main/java/com/dshbox/app/runtime/RuntimeUpdateManager.kt:60-69](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/app/src/main/java/com/dshbox/app/runtime/RuntimeUpdateManager.kt#L60-L69)

选择npm版本guest构建更新的当前流程说明。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * online DSH update, redesigned:
 *  - probe every source in [DshSources.ALL] IN PARALLEL: latency + dist-tags.latest
 *    + the full published-version list. (1.0.0 probed mirrors one by one and could
 *    then only fail at the never-configured prebuilt-layer download — the feature
 *    could never install anything.)
 *  - install a chosen version from a chosen source by BUILDING the layer inside
 *    the guest via npm ([SandboxManager.installDshFromNpm]) — replicating
 *    runtime-bundle/scripts/install_dsh.sh, the exact way the bundled layer is
 *    produced — then hand it to the normal updateDsh pipeline.
```

</details>

**依据 3 · 源码核查**：[sandbox-manager/src/main/java/com/dshbox/app/sandbox/SandboxConfig.kt:34-46](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/sandbox-manager/src/main/java/com/dshbox/app/sandbox/SandboxConfig.kt#L34-L46)

共享/私有数据/备份分层。

<details>
<summary>查看原文（13行）</summary>

```text
     * 共享区绑定清单提供者（guest 别名 → 宿主目录）：内建 `DSHBox` + 用户挂载目录。
     *
     * 每次起会话时现取——用户新授权或新增挂载后无需重建配置；目录缺失的条目由
     * 调用侧按存在性跳过，会话照常启动。
     */
    val shareBindsProvider: () -> List<Pair<String, File>> = { emptyList() },
) {
    val runtimeDir: File = File(appFilesDir, "runtime")
    val sandboxDir: File = File(appFilesDir, "sandbox")
    val userDataDir: File = File(appFilesDir, "user-data")
    val logsDir: File = File(appFilesDir, "logs")
    val backupsDir: File = File(appFilesDir, "backups")
    val updatesDir: File = File(appFilesDir, "updates")
```

</details>

**依据 4 · 作者声明**：[README.md:24-31](https://github.com/WSK-build/DSHBox/blob/95f4e1688c03ef73d08795ea65504c0b061aa20b/README.md#L24-L31)

首次在线/离线/WebView前提。

```text
| 项目 | 说明 |
|---|---|
| 系统要求 | Android 10+ · ARM64 |
| 权限 | 无需 Root · 无需 Termux |
| 内置 | DSH 层 · WebView · PRoot（Debian 与 Node.js 改为首次运行时多镜像源检测在线获取或离线导入） |
| 安装包 | 以 Release 页面所附 APK 为准 |
| 首次准备 | 按分步引导安装精简 Debian 与 Node.js，支持多镜像源检测、失败重试或离线导入；引导页提供 WebView 版本探测与兼容性提示 |
| **特别注意** | 由于 DSH 官方对系统 WebView 内核要求较高，较低版本可能导致白屏、工作区加载异常等问题。遇到此类情况，可通过谷歌商店更新系统 WebView，或咨询 AI，选择适合自己设备的 WebView 版本进行升级或替换。 |
```

#### 缺口

- 未测真设备功耗、后台/更新故障恢复、数据导出与用户任务收益。
  **影响**：无法判断集成便利是否抵消设备资源、下载/更新及恢复成本，也不能承诺升级或卸载无资料损失。
  **进一步探讨**：备用设备/测试资料做冷启动、休眠、撤权、断网/升级失败和退出清单，对照手搭，核可见任务结果及资料。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
