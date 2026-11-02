# dsh-launcher

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[e2a9f63](https://github.com/Ruler4396/dsh-launcher/tree/e2a9f633e36a56efd1444142fb8042b40afcef91)

<!-- BEGIN META -->
[![GitHub ★ 196](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=196&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ruler4396/dsh-launcher)
<!-- END META -->

> **功能**：Windows轻量启动器，双击启动DSH并管理服务生命周期与诊断。

> **亮点**：[Q01](#research-q01)把运行时准备、服务就绪与WebView入口合成Windows客户端；生命周期与诊断是本组件增量，DSH能力和配套插件不归根壳。

> **主要限制**：[Q02](#research-q02)身份门控仍以PID与探测时序为基础，真实竞争/恢复未验；[Q03](#research-q03)诊断脱敏并不清除所有凭据，且项目已停更。

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
  - [Q01 · Windows轻量壳的实际增量是否仍值得新增采用？](#detail-section-11)
  - [Q02 · 启动入口如何把运行时和服务身份变成可见窗口，失败怎样收口？](#detail-section-12)
  - [Q03 · 依赖补齐、诊断和退出边界需要承担哪些成本？](#detail-section-13)
  - [Q04 · 可验证的新方向是什么，如何证明退出更安全？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：它是Windows客户端，不是DSH插件：把Node/dsh服务与WebView2窗口装成双击入口，服务仍由DSH提供，模型能力、插件和对话功能不能归给启动器。参照是终端启动dsh web再用浏览器，以及作者公告的官方桌面替代。实际增量是运行时准备、服务生命周期和诊断，而不是更强的模型或完整离线运行。

固定README明确2026-09-29停更、0.5.3为无安装包的最终公告且不回复issue/PR，因此维护前提已改变。约1.4MB仅是作者的壳包大小描述，不包含Node/DSH/WebView2资源；三种驻留模式的设置由独立lifetime插件提供，本研究不把其贡献算入根客户端。新用户不因历史小包/Star自动采用；本轮只建议既有部署保留诊断材料、评估退出。公告链接不是本轮验证官方版兼容性的证据。

终端运行dsh web并用浏览器，及作者公告的官方桌面替代；未验证后者当前兼容。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 原生窗口 | 双击进入DSH | Windows与WebView2 |
| 服务编排 | 身份/就绪与恢复判断 | PID时序未实测 |
| 诊断 | 错误码/日志导出 | 仅路径脱敏，分享前检查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Windows/.NET/WebView2 | 客户端需 | 原生窗与网页 | 按先决检查处理 |
| Node与DSH | 服务需 | 实际会话 | 确认下载/首装失败收口 |
| 网络/npm与用户权限 | 首装更新相关 | 取依赖/执行 | 非离线或sandbox |
| lifetime插件 | 三模式设置另需 | 模式选择 | 不归根贡献 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 清点 | 既有用户先备份profile/settings | 不以卸载声明代替备份 |
| 启动 | 解析身份/补依赖/判端口 | Foreign拒启，失败看码 |
| 就绪 | TCP/HTTP/退出/日志裁决 | ready后才导航 |
| 恢复 | 核进程归属和日志 | 不盲重杀或分享原日志 |
| 退出 | 副本评估替代端 | 数据与任务不一致则回退 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Node/DSH/WebView/网络 | 环境核查 | 工时金额未知，壳体积非总量 |
| 持续 | 完整服务和模型资源 | 停更后的兼容维护 | 真实负载未知 |
| 失败恢复 | 副本/日志/缓存空间 | 进程与profile排查 | 无实机恢复验证 |
| 退出 | 数据备份/替代端 | 凭据/插件/残留核对 | 保留数据为作者声明 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 启动集中 | 实际依赖与就绪链 | 成功率/节时 |
| 进程保护 | 身份和账本门控 | PID复用/竞争 |
| 诊断 | 错误码和用户路径过滤 | 凭据全部去除不成立 |
| 退出 | 文档声明保留数据 | 迁移/卸载验收 |

> **思考**：[Q02](#research-q02)身份门控仍以PID与探测时序为基础，真实竞争/恢复未验；[Q03](#research-q03)诊断脱敏并不清除所有凭据，且项目已停更。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)把运行时准备、服务就绪与WebView入口合成Windows客户端；生命周期与诊断是本组件增量，DSH能力和配套插件不归根壳。

[Q02](#research-q02)组合根实际注入身份与就绪委托，失败状态明确；PID账本/清理时序和停更兼容仍需边界验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)身份门控仍以PID与探测时序为基础，真实竞争/恢复未验；[Q03](#research-q03)诊断脱敏并不清除所有凭据，且项目已停更。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03)新增部署observe；既有用户先离线清点、备份与人工审诊断，副本评估退出，不为假设安装停更版本。

固定README明确2026-09-29停更、0.5.3为无安装包的最终公告且不回复issue/PR，因此维护前提已改变。约1.4MB仅是作者的壳包大小描述，不包含Node/DSH/WebView2资源；三种驻留模式的设置由独立lifetime插件提供，本研究不把其贡献算入根客户端。新用户不因历史小包/Star自动采用；本轮只建议既有部署保留诊断材料、评估退出。公告链接不是本轮验证官方版兼容性的证据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

partial

- 已检查：作者 README、包清单、源码路径 README.md、src/DshShell/DiagnoseExport.cs、src/DshShell/LauncherApp.cs、src/DshShell/Managers/RuntimeManager.cs、src/DshShell/Managers/ServiceManager.cs、src/DshShell/Program.cs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定root client定向README、组合根、LauncherApp、RuntimeManager、ServiceManager与诊断脱敏；未全审更新下载/回滚、MSI、安全模式及配套插件，不运行目标。
- 下一步：[Q04](#research-q04)可丢弃Windows副本测数据/进程/退出，当前仅源码核查，无宿主或模型效果验收。

**分析版本**

- **仓库**：[Ruler4396/dsh-launcher](https://github.com/Ruler4396/dsh-launcher)
- **版本号**：未声明（[固定提交 e2a9f63](https://github.com/Ruler4396/dsh-launcher/tree/e2a9f633e36a56efd1444142fb8042b40afcef91)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)只读迁移清单可能帮助既有部署核数据与进程归属，尚未实现或验证，不计当前贡献。

[Q04](#research-q04)可丢弃Windows副本测数据/进程/退出，当前仅源码核查，无宿主或模型效果验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 36 | 6579 | — | — | 126945 |
| .js | source | 3 | 233 | 200 | 23 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Ruler4396/dsh-launcher/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Ruler4396/dsh-launcher/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Ruler4396/dsh-launcher/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核客户端启动身份与失败，说明停更和退出边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Windows轻量壳的实际增量是否仍值得新增采用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它是Windows客户端，不是DSH插件：把Node/dsh服务与WebView2窗口装成双击入口，服务仍由DSH提供，模型能力、插件和对话功能不能归给启动器。参照是终端启动dsh web再用浏览器，以及作者公告的官方桌面替代。实际增量是运行时准备、服务生命周期和诊断，而不是更强的模型或完整离线运行。

固定README明确2026-09-29停更、0.5.3为无安装包的最终公告且不回复issue/PR，因此维护前提已改变。约1.4MB仅是作者的壳包大小描述，不包含Node/DSH/WebView2资源；三种驻留模式的设置由独立lifetime插件提供，本研究不把其贡献算入根客户端。新用户不因历史小包/Star自动采用；本轮只建议既有部署保留诊断材料、评估退出。公告链接不是本轮验证官方版兼容性的证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/README.md#L1-L5)

固定停更公告。

```text
# dsh-launcher

> ⚠️ **已停更（2026-09-29）**：官方 DeepSeek Harness 桌面端已发布 → **<https://www.deepseek.com/download/>** ，
> 请改装官方版。本项目自此停止更新：**v0.5.3 是最后一个版本**（纯公告，不含安装包），issue 与 PR 不再回复。
> 源码、文档、测试与历史发布记录保持公开可读。
```

**依据 2 · 作者声明**：[README.md:24-57](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/README.md#L24-L57)

客户端定位、依赖、独立驻留插件和卸载声明。

<details>
<summary>查看原文（34行）</summary>

````text
## 这是什么

一个 Windows 原生壳：双击启动 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（`dsh`）、可设置开机自启，高度重视服务生命周期与出错诊断。安装包大小仅为 **~1.4MB**，不内置 dsh；缺失的依赖（Node.js 等）按需补齐，不改动系统环境。

**克制**：本项目意在打造一个舒适的 dsh 原版体验，不添加文件面板、内置终端等额外功能，一切交给dsh的插件，由用户自行决定。仅在推出安全性更新和dsh版本更新时发出提醒（屏幕右下角通知卡片 + 标题栏标记；系统 Toast 因 issue #25 已整体移除）。

## 安装

**MSI（推荐新手）**：从 [Releases](https://github.com/Ruler4396/dsh-launcher/releases) 下载 `dsh-launcher-<版本>.msi`，双击安装（向导里可勾选开机自启）。卸载：设置 → 应用 → dsh-launcher。

**便携版 ZIP**：下载 `dsh-launcher-windows-<版本>.zip`，解压后双击 `DshWeb.exe`；删文件夹即卸载。

> 双击没反应？先运行解压目录里的 `check-prereq.cmd`，它会检测 .NET / WebView2 / Node 并给出缺失项的安装命令。

## 特性

- 开机自启 · 独立小窗口（WebView2）· 自动拉起服务并等待就绪
- 出错弹窗带错误码，统一日志 `~/.dsh\dsh-launcher\dsh.log`
- `DshWeb.exe --diagnose` 一键导出信息脱敏诊断包
- 服务生命周期：跟随窗口 / 常驻 / 托盘驻留（见下"插件"）
- 主题跟随 · 窗口位置记忆 · dsh 延迟更新（不打断会话）

## 配套插件

安装 [dsh-launcher-lifetime](https://github.com/Ruler4396/dsh-launcher-lifetime) 后，拥有三种node.js的驻留模式（随窗口驻留、常驻、随托盘驻留），可在 dsh 设置页“Node服务驻留”中切换：

```sh
dsh plugin --profile web add dsh-launcher-lifetime
```

## 常见问题

- **MSI 和 ZIP 有区别吗？** 内容相同；MSI 有标准安装/卸载流程。
- **卸载会删 dsh 数据和插件吗？** 不会——只清启动器自有数据，`profiles/`、`settings.yaml` 等原样保留。
````

</details>

**依据 3 · 源码核查**：[src/DshShell/Program.cs:643-660](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/Program.cs#L643-L660)

真实WebView初始化与导航。

<details>
<summary>查看原文（18行）</summary>

```text
            var userDataFolder = Environment.GetEnvironmentVariable("DSH_WEBVIEW2_DATA");
            if (string.IsNullOrWhiteSpace(userDataFolder))
            {
                userDataFolder = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                    "DshWeb", "WebView2");
            }
            try
            {
                await InitWebViewAsync(web, userDataFolder);
                await InvalidateWebCacheOnVersionChangeAsync(web); // [v0.4.5] dsh 版本变更 → 仅磁盘缓存一次性失效（先于首航）
                web.CoreWebView2.Navigate(CurrentWebUrl); // token 跟随：dsh ≥0.1.2 根路径需 ?token=
                // [2026-08-29 token 栅栏] 瞬态失败自愈：唯一实现在 WebViewManager.ArmNavigationRetry，
                // 决策为纯函数 ShellLogic.NavigationResiliencePolicy（此处原有两份抄写且已互相漂移）。
                WebViewManager.ArmNavigationRetry(web, () => CurrentWebUrl, m => Trace(m),
                    () => BootMonitor?.OnNavigationCompleted(),
                    () => form.BeginInvoke(() => ShowError(ErrorCodes.E2004,
                            $"页面加载失败。\n\n请确认 {Target.Url} 上运行的是 dsh 服务（端口可能被其他程序占用，或服务已异常退出）。\n\n统一日志：{UnifiedLogPath}")));
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动入口如何把运行时和服务身份变成可见窗口，失败怎样收口？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

生产组合根注入RuntimeManager下载确认、带已知PID账本的ServiceManager以及PollReadiness委托。LauncherApp先解析Node身份，无物理DSH时调用EnsureDshInstalled，再重新发现身份；失败进入Fatal并返回false，不静默改走npx。服务探测以端口、node进程身份和HTTP判断Closed/Healthy/Zombie/Foreign；无HTTP且账本外的node判Foreign并拒启，账本内僵尸可清理后重启，Healthy可复用。其后以node与JS入口启动，等待TCP+HTTP就绪，成功才进入UI状态，Program初始化WebView并导航当前含token URL。

就绪轮询观察本轮新增服务日志及进程退出，返回ready/canceled/logerror/timeout/service-exited，失败映射错误码并调用残留清理。重启健康遗留进程还有外部托管、账本和模式门控；清理失败可能继续旧服务，不能把本次启动成功当配置一定重载。账本实际保存PID相等，不是进程启动时间或不可复用的身份；KillZombieTree重新查端口后调用kill，没有在该方法重验账本，故先前探测与杀进程之间的竞争及PID复用仍需实机验证，不能以注释宣称绝无误杀。源码支持防误判设计而非全场景生命期正确性。

#### 证据与依据

**依据 1 · 源码核查**：[src/DshShell/Program.cs:991-1043](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/Program.cs#L991-L1043)

生产注入链及残留重启门控。

<details>
<summary>查看原文（53行）</summary>

```text
        // [F4] 注入服务身份账本：ProbePort 对 HTTP 不通的 node 占用者，账本内才判 Zombie
        //（自愈清理），账本外判 Foreign 绝不强杀——用户自己的 node 程序不再被误杀。
        var service = new ServiceManager(knownServicePid: IsKnownDshServicePid);
        return new LauncherApp(
            runtime: new RuntimeManager(confirmDownload: () =>
                // 自动化环境不打断（原 EnsureNodeForStartupAsync 顶部语义）
                NoUiMode
                    ? Task.FromResult(false)
                    : confirm(
                        "dsh-launcher - 需要 Node.js",
                        "检测到 Node.js 问题（dsh 服务运行必需）。\n\n" +
                        (RuntimeResolver.NodeMissingReason() == "too-old"
                            ? "系统 Node.js 版本过低或不可用（需要 18 或更高版本）。\n"
                            : "未检测到 Node.js。\n") +
                        "是否自动下载便携版 Node.js 到用户目录？\n" +
                        "（约 30MB，仅用于本启动器，不改动系统环境；版本采用 LTS 固定版）")),
            service: service,
            staleCleanup: _ => SweepStaleServicePid(),
            updates: updates,
            serviceLogPath: UnifiedLogPath)
        {
            BackgroundMaintenance = ct => RunBackgroundMaintenance(updates, ct, _updateApplyProgress), // 阶段 0 可取消；进度桥接到 Splash
            SweepStaleAndApplyUpdate = () =>
            {
                // v0.4.0：pending 应用已上移到阶段 0（BackgroundMaintenance）——npm install -g
                // 可能耗时 30-60s，原在"正在启动 dsh 服务…"阶段会让用户误以为卡死且取消无效。
                if (!ShellLogic.ServiceReadiness.PortOpen("127.0.0.1", Target.Port))
                {
                    SweepStaleServicePid();   // 僵尸清扫：上次崩溃记录过、已不在监听的进程
                }
            },
            ReadinessProbe = ct => Task.Run(() =>
                service.PollReadiness(ct, Target.Port, Target.Url, UnifiedLogPath, E2EMode), ct),
            // [issue #28-3 伪重启修复] 健康残留服务是否必须清理重启：三重门控（非外部托管 ×
            // 账本内（本壳上次拉起且没停干净 = 上次会话异常终止）× 驻留模式要求服务跟随壳）。
            // 账本判定复用 ServiceManager 的已知服务身份账本（ServiceLifecycleOps.PidFilePath）。
            RestartHealthyLeftoverPolicy = () =>
            {
                if (ServerManagedExternally) return false;
                var owner = ShellLogic.ProcessManagement.GetProcessIdByPort(Target.Port);
                if (owner <= 0) return false;
                var restart = ShellLogic.LifecycleDecisions.ShouldRestartLeftoverService(
                    ReadLifetimeMode(),
                    ledgerOwned: IsKnownDshServicePid(owner, Target.Port),
                    externallyManaged: false);
                if (restart) Trace($"[leftover] healthy leftover service pid={owner} is ledger-owned and lifetime mode requires shell ownership");
                return restart;
            },
            // [issue #28-4] 初始拉起与所有重启路径共用同一条 profile 判定（EnsureSafeProfileIdentity）。
            // 修复前 "--profile .dsh-safe" 只在重启路径生效 → 同一份粘滞 safe-mode.json 下
            // "托盘退出重开插件都在，点 DSH 内置重启插件消失"。
            ServiceIdentityDecorator = EnsureSafeProfileIdentity,
        };
```

</details>

**依据 2 · 源码核查**：[src/DshShell/LauncherApp.cs:224-245](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/LauncherApp.cs#L224-L245)

首次安装失败收口与重新发现。

<details>
<summary>查看原文（22行）</summary>

```text
        // ---- 首装链（ADR-024）：身份为 NpxCache（本机无任何物理安装）时经更新引擎
        // npm -g 安装组件，成功后重发现身份。失败响亮 E2001 收口（组合根按
        // StartupFailurePolicy 映射 [E1012] 展示真实根因），绝不静默落 npx 冷路径。----
        if (!ServerManagedExternally
            && identity.Source == DshWeb.Domain.DshSource.NpxCache
            && _updates is not null)
        {
            progress?.Report("正在安装 dsh 组件（首次运行，仅需一次）…");
            var provisioned = await Task.Run(() => _updates.EnsureDshInstalled(identity), ct);
            if (!provisioned)
            {
                LastErrorCode = ErrorCodes.E2001;
                LastErrorDetail = "未能自动安装 dsh 组件（详见统一日志）。";
                Logger.Error(LastErrorDetail, LastErrorCode,
                    new { detail = (_updates as DshUpdateManager)?.FirstRunProvisionError });
                _lifecycle.Fire(LifecycleTrigger.Fatal); // → Failed
                return false;
            }
            // 发现链立见新装 shim/版本；同样包后台（发现 + 装饰都可能碰磁盘）
            identity = await Task.Run(() => DecorateIdentity(
                DshWeb.Domain.DshDiscovery.DiscoverCurrentRuntime()), ct);
        }
```

</details>

**依据 3 · 源码核查**：[src/DshShell/LauncherApp.cs:247-315](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/LauncherApp.cs#L247-L315)

端口分支与清理失败。

<details>
<summary>查看原文（69行）</summary>

```text
        // ---- StartingService：端口三重验证（任务一：TCP + 进程身份 + 快速 HTTP）。
        // 修复根因：仅凭 TCP PortOpen 决定"跳过拉起"会误判僵尸服务（端口开但 HTTP 死）为
        // 健康，导致对半死服务傻等 180s。现在 Zombie → 清理并重启；Foreign → 快速失败 E2004；
        // Healthy → 跳过拉起；Closed → 正常拉起。探针含同步 TcpClient.Connect（本机 2s 级）
        // 与 taskkill，必须后台执行。----
        var portState = ServerManagedExternally
            ? ShellLogic.ServicePortState.Healthy // 外部托管：不拉起、不清理，直接探测就绪
            : await Task.Run(() => _service.ProbePort(Port, Url), ct);

        // [issue #28-3 伪重启修复] 健康残留服务 + 本壳必须自己持有（FollowWindow/Tray）+
        // 该服务正是本壳账本记录的残留 → 就地清理，走正常拉起（插件/配置改动才真正生效）。
        // 三重门控全在纯函数 ShouldRestartLeftoverService 内（外部托管/账本外 node/常驻模式均不清理）。
        if (portState == ShellLogic.ServicePortState.Healthy && !ServerManagedExternally
            && RestartHealthyLeftoverPolicy?.Invoke() == true)
        {
            progress?.Report("检测到上次会话残留的 dsh 服务，正在重启以加载最新配置…");
            Logger.Info($"[leftover] shell-owned leftover service on port {Port}; "
                + "lifetime mode requires shell-owned service → restarting", ctx: new { port = Port });
            var cleaned = await Task.Run(() => _service.KillZombieTree(Port), ct);
            if (cleaned)
            {
                portState = ShellLogic.ServicePortState.Closed; // 端口已释放 → 正常拉起新服务
            }
            else
            {
                // 清理失败（杀不干净/端口未释放）：保底继续用旧服务，绝不把可用界面变成启不来
                Logger.Warn($"[leftover] failed to stop leftover service on port {Port}; continuing with it",
                    ErrorCodes.E2005, new { port = Port });
            }
        }

        // Zombie 清理成功 / Closed → 正常拉起；Healthy → 跳过拉起。统一为 bool 决策，
        // 避免 switch 内 goto 穿透到后续语句（HappyPath 测试暴露：break 后落入 StartService 块
        // 二次触发 ServiceStarted → 非法转移 WaitingForReadiness + ServiceStarted）。
        var needsStart = portState switch
        {
            ShellLogic.ServicePortState.Healthy => false,
            ShellLogic.ServicePortState.Zombie => true, // 清理在下面执行后再拉起
            _ => true, // Closed / Foreign 处理见下（Foreign 提前返回）
        };

        if (portState == ShellLogic.ServicePortState.Foreign)
        {
            // 端口被其他程序占用：快速失败提示冲突（不傻等、不误杀无关进程）
            var foreignPid = await Task.Run(() => ShellLogic.ProcessManagement.GetProcessIdByPort(Port), ct);
            Logger.Error($"port {Port} is occupied by a non-dsh process; aborting startup",
                ErrorCodes.E2004, new { port = Port, pid = foreignPid, url = Url });
            LastErrorCode = ErrorCodes.E2004;
            // [F4] Foreign 现含两类：非 node 程序占用 / 账本外的 node（绝不误杀，明确告知用户）。
            LastErrorDetail = $"端口 {Port} 已被其他程序占用（PID {(foreignPid > 0 ? foreignPid.ToString(CultureInfo.InvariantCulture) : "未知")}），且无 dsh HTTP 响应。请释放该端口后重试；若该端口被您自己的 Node.js 程序占用，请先退出它。";
            _lifecycle.Fire(LifecycleTrigger.Fatal); // → Failed
            return false;
        }

        if (portState == ShellLogic.ServicePortState.Zombie)
        {
            // 僵尸服务：TCP 开但 HTTP 不通、占用者是 node → 强杀进程树后重新拉起
            progress?.Report("检测到残留的 dsh 服务，正在清理并重新启动…");
            var cleaned = await Task.Run(() => _service.KillZombieTree(Port), ct);
            if (!cleaned)
            {
                // 清理失败（杀不干净/端口未释放）：快速失败，不让用户傻等 180s
                LastErrorCode = ErrorCodes.E2004;
                LastErrorDetail = $"dsh 服务残留进程无法清理（端口 {Port} 被僵尸进程占用且 HTTP 无响应）。请关闭占用进程后重试。";
                Logger.Error(LastErrorDetail, LastErrorCode, new { port = Port, url = Url });
                _lifecycle.Fire(LifecycleTrigger.Fatal); // StartingService + Fatal → Failed
                return false;
            }
        }
```

</details>

**依据 4 · 源码核查**：[src/DshShell/LauncherApp.cs:317-384](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/LauncherApp.cs#L317-L384)

实际启动到就绪/UI状态和失败清理。

<details>
<summary>查看原文（68行）</summary>

```text
        if (needsStart)
        {
            progress?.Report("正在启动 dsh 服务…");
            // 【ADR-024】服务拉起只信 Identity：node.exe × DshEntryJsPath 直启（Manager 契约），
            // 不再有 wscript/vbs/cmd 中间层。外部托管（ServerManagedExternally）永不进入此分支。
            var startOk = await Task.Run(() =>
            {
                SweepStaleAndApplyUpdate?.Invoke(); // 僵尸清扫 + 延迟更新（IO，后台）
                return _service.Start(identity, Port, _serviceLogPath);
            }, ct);
            if (!startOk)
            {
                LastErrorCode = ErrorCodes.E2001;
                LastErrorDetail = identity.CanLaunchDirectly
                    ? $"dsh 服务启动失败（{Url}）。请查看统一日志。"
                    : BuildEntryMissingDetail(identity, Url);
                Logger.Error(LastErrorDetail, LastErrorCode,
                    new
                    {
                        source = identity.Source.ToString(),
                        entry = identity.DshEntryJsPath,
                        probe = identity.EntryProbeFailures
                    });
                _lifecycle.Fire(LifecycleTrigger.Fatal); // StartingService + Fatal → Failed
                return false;
            }
            ServiceStartedByShell = true;
            _lifecycle.Fire(LifecycleTrigger.ServiceStarted);
        }
        else
        {
            _lifecycle.Fire(LifecycleTrigger.ServiceStarted); // Healthy：→ WaitingForReadiness
            progress?.Report("正在检查 dsh 服务…");
        }

        // ---- WaitingForReadiness：轮询 HTTP 就绪（异步探测；取消/超时/日志报错三态）----
        progress?.Report("正在等待 dsh 服务就绪…");
        // [修复] 就绪预算判定所需的 dsh 身份发现挪入后台线程：旧实现在 await 续体（UI 线程）
        // 上同步调 DiscoverCurrentRuntime()——全局安装场景会 spawn node --version 探测（数百 ms
        // ～3s，旧实现更可无限阻塞），Splash 因此冻结（用户回归"点击很久才有窗口"）。
        // 生产路径走组合根注入的 ReadinessProbe（自带后台线程与预算逻辑）；Headless 默认分支
        // 同样把发现+预算计算包进 Task.Run，保证方法在首个 await 即让出调用线程。
        var waitResult = ReadinessProbe is not null
            ? await ReadinessProbe(ct)
            : await Task.Run(async () =>
            {
                var networkFallback = DshWeb.Domain.DshDiscovery.DiscoverCurrentRuntime().Source
                    == DshWeb.Domain.DshSource.NpxCache;
                var budget = ShellLogic.ServiceReadiness.GetPollBudgetSeconds(networkFallback);
                return await _service.WaitReadyAsync(Port, TimeSpan.FromSeconds(budget), ct)
                    ? "ready" : "timeout";
            }, ct);
        WaitResult = waitResult;
        if (waitResult != "ready")
        {
            _lifecycle.Fire(LifecycleTrigger.ReadinessTimedOut); // → ShuttingDown
            // 错误码必须与用户弹窗同源（2026-09-20 真机：这里硬编码 E2002，弹窗按裁决给 E2010，
            // 同一事实两个码——按码归因的人只会看到"启动超时"，而真实形态是"进程就绪前退出"）。
            Logger.Error($"service readiness failed: {waitResult}",
                ShellLogic.ServiceReadiness.MapVerdictErrorCode(waitResult));
            _staleCleanup?.Invoke(Port); // 超时清理：Kill 孤儿进程（E2005 语义）
            return false;
        }

        // ---- UI 装配（WebView/Window 由组合根在返回后驱动）→ Running ----
        _lifecycle.Fire(LifecycleTrigger.ServiceReady);   // → InitializingUI
        _lifecycle.Fire(LifecycleTrigger.UIInitialized);  // → Running
        return true;
```

</details>

**依据 5 · 源码核查**：[src/DshShell/Managers/ServiceManager.cs:230-274](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/Managers/ServiceManager.cs#L230-L274)

探测账本条件与杀前重查端口。

<details>
<summary>查看原文（45行）</summary>

```text
        var pid = _pidLookup(port);
        // 进程身份验证：占用端口者必须是我们认识的 dsh 服务（node）进程
        if (pid <= 0 || !_identityCheck(pid))
            return ShellLogic.ServicePortState.Foreign;

        // 快速 HTTP 探测（短超时 3s）：能应答 = 健康；否则判定为僵尸
        using var http = new System.Net.Http.HttpClient { Timeout = TimeSpan.FromSeconds(3) };
        var httpOk = _httpProbe(url, http);
        if (!httpOk && !_knownServicePid(pid, port))
        {
            Logger.Warn($"port {port} occupied by unknown node pid={pid} without dsh HTTP; treating as foreign (not killing)", ErrorCodes.E2004, new { pid, port });
            return ShellLogic.ServicePortState.Foreign;
        }
        return httpOk
            ? ShellLogic.ServicePortState.Healthy
            : ShellLogic.ServicePortState.Zombie;
    }

    /// <summary>
    /// 强杀僵尸进程树（任务一）：杀监听端口的 node 进程树（taskkill /T /F），等待端口释放（最长 2s）。
    /// 返回是否清理成功（端口最终释放）。
    ///
    /// 【2026-09 删除/杀伤代码审计加固】**不再杀伤祖先链**：ADR-024 后 dsh 服务由 node.exe 直启，
    /// 其父进程是启动器自己或用户终端/explorer——旧版"cmd/npx 外壳"中间层已不存在，按祖先链
    /// （GetAncestorPids ≤8 层无条件收集）逐棵 /T /F 强杀存在自杀与误杀用户终端窗口的真实风险。
    /// 现在只对端口归属进程执行 taskkill /T（连同其全部子进程），即覆盖 dsh 服务树本身。
    /// 进程身份由调用方（ProbePort 的 Zombie 分支）先经 IsLikelyDshService（ProcessName==node）确认。
    /// </summary>
    public bool KillZombieTree(int port)
    {
        var pid = _pidLookup(port);
        if (pid <= 0)
            return true; // 端口已无占用者（自愈：僵尸进程恰好退出）

        _killProcessTree(pid); // taskkill /PID {pid} /T /F：覆盖 dsh 服务全部子进程

        // 等待端口释放（最长 2s，每 200ms 探测一次）
        var deadline = DateTime.UtcNow + _portReleaseTimeout;
        while (DateTime.UtcNow < deadline)
        {
            if (!_tcpProbeSync("127.0.0.1", port))
                return true; // 端口已释放
            System.Threading.Thread.Sleep(200);
        }
        return !_tcpProbeSync("127.0.0.1", port);
```

</details>

**依据 6 · 源码核查**：[src/DshShell/Program.cs:2511-2531](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/Program.cs#L2511-L2531)

PID账本只有数值相等。

<details>
<summary>查看原文（21行）</summary>

```text
    /// <summary>
    /// [F4] 服务身份账本查询（组合根注入 ServiceManager）："我们拉起过的 dsh"= 本会话
    /// 内存缓存的 PID ∪ 历史 pid 文件账本（崩溃/接管后依然有效）。仅账本内的 node 进程
    /// 才允许被 Zombie 清理——账本外的 node（用户自己的程序）绝不强杀。
    /// </summary>
    private static bool IsKnownDshServicePid(int pid, int port)
    {
        if (pid <= 0) return false;
        if (pid == _servicePid) return true;
        try
        {
            var f = Managers.ServiceLifecycleOps.PidFilePath(DataDir, port);
            return File.Exists(f)
                   && int.TryParse(File.ReadAllText(f).Trim(), out var recorded)
                   && recorded == pid;
        }
        catch (Exception ex)
        {
            Logger.Warn($"known-pid lookup failed for pid={pid} port={port}: {ex.Message}");
            return false;
        }
```

</details>

**依据 7 · 源码核查**：[src/DshShell/Managers/ServiceManager.cs:142-180](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/Managers/ServiceManager.cs#L142-L180)

轮询就绪、退出、错误宽限和超时分支。

<details>
<summary>查看原文（39行）</summary>

```text
                // 追加型，历史标志永不消失，增量语义下"seen 即宽限起点"与旧行为等价。
            }
            if (_tcpProbeSync("127.0.0.1", port))
            {
                if (_httpProbe(url, http))
                {
                    Logger.Info("poll: ready (tcp + http)");
                    return "ready"; // TCP + HTTP 都已就绪
                }
                // HTTP 尚未就绪（前端还在启动），继续等
            }
            // 【issue #26】就绪前服务进程已退出 = 启动失败，立即快速失败（不再盲等完整预算）。
            // 仅在非就绪时判定：HTTP 已就绪（上面已 return）说明服务健康，进程退出观测不适用。
            var exitCode = exitProbe();
            if (ShellLogic.ServiceReadiness.IsServiceExitFailFast(exitCode))
            {
                Logger.Info($"poll: service process exited before ready (code={exitCode}), failing fast");
                return ShellLogic.ServiceReadiness.ServiceExitedVerdict;
            }
            if (logErrorSeen && virtualMs - logErrorSinceMs >= graceMs)
            {
                Logger.Info("poll: log error markers persisted grace, giving up");
                return "logerror";
            }
            // 启动延迟优化：前 8 次快速轮询（200ms），之后 1s 粒度（虚拟时钟累加）。
            var stepMs = i < 8 ? 200 : 1000;
            delaySync(TimeSpan.FromMilliseconds(stepMs));
            virtualMs += stepMs;
        }
        Logger.Info($"poll: timeout after {pollBudget}s");
        return "timeout";
    }

    /// <summary>本轮新增内容是否命中启动错误标志（逐行；只认壳管道转发的服务行 +
    /// 跳过壳自写行——F2/F6：壳的 E1012 等错误文案内嵌 npm tail，任何整段匹配都会误伤）。</summary>
    private static bool ShowsStartupErrorIncrement(string content)
        => content.Split('\n')
            .Select(l => l.TrimEnd('\r'))
            .Any(l => l.Length > 0
```

</details>

#### 缺口

- Windows真实进程竞争、恢复、WebView导航和现行DSH兼容未运行。
  **影响**：防误杀/恢复与可用窗口不能视为验收通过。
  **进一步探讨**：丢弃Windows用户环境测外部node、残留PID、端口移交、启动前退出和取消，保留进程树及错误码。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖补齐、诊断和退出边界需要承担哪些成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Windows、.NET/WebView2与Node/DSH组成实际运行条件；Node缺失由生产确认后下载便携版，RuntimeManager在拒绝/下载失败/仍无可执行文件时返回不同错误，只前插进程PATH。DSH首装/更新仍涉及网络与npm，壳小不代表资源或权限小。普通用户账号的DSH及其插件仍可执行该账号能力，本组件不是安全沙箱。

诊断日志确实经过Sanitize，但实现只替换用户目录、USERPROFILE和用户名路径片段，没有通用token/key/消息内容过滤；导出前必须人工检查，不应直接发送含服务token或任务数据的日志。本轮未发送诊断包。卸载保留profiles/settings为作者声明，未执行MSI卸载或ZIP退出验证；需独立备份重要数据再迁移，不把删壳当删除Node/DSH/缓存或凭据。延迟更新/回滚的全数据一致性与下载完整性未完整审计，本结论不认证这些路径。停更后新增兼容修复由使用者承担，成本与官方替代迁移收益均未测。

#### 证据与依据

**依据 1 · 源码核查**：[src/DshShell/Managers/RuntimeManager.cs:17-42](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/Managers/RuntimeManager.cs#L17-L42)

Node确认/失败与进程PATH。

<details>
<summary>查看原文（26行）</summary>

```text
    public async Task<RuntimeResolution> EnsureRuntimeAsync(CancellationToken ct = default)
    {
        var env = RuntimeResolver.ResolveExisting();
        if (env.NodeExe is null)
        {
            // 无可用 Node：先确认再下载（用户拒绝 → E1002，与 v0.3.x TryEnsureNodeAsync 语义一致）
            if (_confirmDownload is not null && !await _confirmDownload())
                return RuntimeResolution.Failed(ErrorCodes.E1002, "已取消自动安装便携 Node.js。");
            var (ok, code, detail) = await RuntimeResolver.EnsurePortableNodeAsync(ct);
            if (!ok) return RuntimeResolution.Failed(code ?? ErrorCodes.E1003, detail ?? "便携 Node 安装失败。");
            env = RuntimeResolver.ResolveExisting();
            if (env.NodeExe is null)
                return RuntimeResolution.Failed("E1005", "便携 Node 安装后仍未解析到 node.exe");
        }
        if (env.IsPortable) PrependToPath(env.RootDir!);

        // 【ADR-024】Node 就绪 → 立即产出统一身份（发现层读 PATH/注册表/DSH_HOME）。
        // 便携 Node 刚前插进进程 PATH，发现层 FindNodeExe 必能命中；万一环境异常导致
        // 发现层拿不到 node 路径，则以已解析的物理路径补齐——身份的 NodeExePath 绝不为空地失败。
        var identity = DshWeb.Domain.DshDiscovery.DiscoverCurrentRuntime();
        if (identity.NodeExePath is null && File.Exists(env.NodeExe))
            identity = identity with { NodeExePath = env.NodeExe };
        return RuntimeResolution.Ready(identity);
    }

    public void PrependToPath(string nodeRoot) => RuntimeResolver.PrependToPath(nodeRoot);
```

</details>

**依据 2 · 源码核查**：[src/DshShell/Program.cs:993-1006](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/Program.cs#L993-L1006)

生产下载提示和确认。

<details>
<summary>查看原文（14行）</summary>

```text
        var service = new ServiceManager(knownServicePid: IsKnownDshServicePid);
        return new LauncherApp(
            runtime: new RuntimeManager(confirmDownload: () =>
                // 自动化环境不打断（原 EnsureNodeForStartupAsync 顶部语义）
                NoUiMode
                    ? Task.FromResult(false)
                    : confirm(
                        "dsh-launcher - 需要 Node.js",
                        "检测到 Node.js 问题（dsh 服务运行必需）。\n\n" +
                        (RuntimeResolver.NodeMissingReason() == "too-old"
                            ? "系统 Node.js 版本过低或不可用（需要 18 或更高版本）。\n"
                            : "未检测到 Node.js。\n") +
                        "是否自动下载便携版 Node.js 到用户目录？\n" +
                        "（约 30MB，仅用于本启动器，不改动系统环境；版本采用 LTS 固定版）")),
```

</details>

**依据 3 · 源码核查**：[src/DshShell/DiagnoseExport.cs:75-95](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/DiagnoseExport.cs#L75-L95)

日志通过Sanitize。

<details>
<summary>查看原文（21行）</summary>

```text
    /// <summary>按级别过滤统一日志：JSON 行按 level 字段；原始服务输出命中启动错误标志按告警计。
    /// 质量治理修复：输出行统一过 Sanitize（日志主体此前漏脱敏）。</summary>
    internal static string FilterByLevel(string logPath, Logger.Level minLevel)
    {
        if (!File.Exists(logPath)) return "（统一日志不存在：" + logPath + "）";
        var sb = new StringBuilder();
        foreach (var raw in ShellLogic.ReadLinesShared(logPath))
        {
            var line = raw.TrimEnd();
            if (line.Length == 0) continue;
            var level = TryGetJsonLevel(line);
            if (level is not null)
            {
                if (level >= minLevel) sb.AppendLine(Sanitize(line));
            }
            else if (minLevel <= Logger.Level.Warn && ShellLogic.ServiceReadiness.LogShowsStartupError(line))
            {
                sb.AppendLine(Sanitize(line));
            }
        }
        return sb.Length == 0 ? "（无告警/错误记录）" : sb.ToString();
```

</details>

**依据 4 · 源码核查**：[src/DshShell/DiagnoseExport.cs:216-251](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/DiagnoseExport.cs#L216-L251)

脱敏仅用户路径替换。

<details>
<summary>查看原文（36行）</summary>

```text
    /// <summary>脱敏：把用户目录及可推导的用户相关信息替换为占位符，避免日志/路径泄漏用户名。
    /// 顺序（均 OrdinalIgnoreCase）：
    ///   1) 当前用户目录全路径 → %USER%（保留原文覆盖）；
    ///   2) %USERPROFILE% 字面量 → %USER%（环境变量形式出现的路径）；
    ///   3) 波浪号缩写 "~\" → "%USER%\"（仅替换反斜杠后缀形式，避免误伤普通波浪号文本；
    ///      独立 "~" token 不替换，因其可能是正常文本中与路径无关的波浪号）；
    ///   4) 反斜杠分隔的 "…\用户名\" 路径片段 → "…\USERNAME\"（正则只在反斜杠之后才匹
    ///      配用户名，且要求其后紧跟反斜杠，故只命中路径上下文，防过度替换普通文本中的
    ///      用户名单词）。</summary>
    internal static string Sanitize(string? s)
    {
        if (string.IsNullOrEmpty(s)) return s ?? "";
        try
        {
            var up = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
            if (!string.IsNullOrWhiteSpace(up))
            {
                // 1) 全路径 — 覆盖默认形式 C:\Users\xxx
                s = s.Replace(up, "%USER%", StringComparison.OrdinalIgnoreCase);
                // 2) 环境变量字面量形式
                s = s.Replace("%USERPROFILE%", "%USER%", StringComparison.OrdinalIgnoreCase);
                // 3) 波浪号缩写形式（仅 "~\"，保守安全）
                s = s.Replace("~\\", "%USER%\\", StringComparison.OrdinalIgnoreCase);
                // 4) 用户名路径片段：仅 \用户名\ 上下文（用户名可能出现在 profile 名/短路径
                //    等未被全路径替换覆盖到的位置）。用户名取用户目录最后一段。
                var userName = Path.GetFileName(up.TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar));
                if (!string.IsNullOrEmpty(userName))
                {
                    // 模式：反斜杠 + 用户名 +（后随反斜杠，用前瞻保留它）；OrdinalIgnoreCase。
                    s = Regex.Replace(s, "\\\\" + Regex.Escape(userName) + "(?=\\\\)", "\\\\USERNAME",
                        RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);
                }
            }
        }
        catch { }
        return s;
```

</details>

**依据 5 · 作者声明**：[README.md:30-61](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/README.md#L30-L61)

安装/诊断/保留数据作者说明。

<details>
<summary>查看原文（32行）</summary>

````text
## 安装

**MSI（推荐新手）**：从 [Releases](https://github.com/Ruler4396/dsh-launcher/releases) 下载 `dsh-launcher-<版本>.msi`，双击安装（向导里可勾选开机自启）。卸载：设置 → 应用 → dsh-launcher。

**便携版 ZIP**：下载 `dsh-launcher-windows-<版本>.zip`，解压后双击 `DshWeb.exe`；删文件夹即卸载。

> 双击没反应？先运行解压目录里的 `check-prereq.cmd`，它会检测 .NET / WebView2 / Node 并给出缺失项的安装命令。

## 特性

- 开机自启 · 独立小窗口（WebView2）· 自动拉起服务并等待就绪
- 出错弹窗带错误码，统一日志 `~/.dsh\dsh-launcher\dsh.log`
- `DshWeb.exe --diagnose` 一键导出信息脱敏诊断包
- 服务生命周期：跟随窗口 / 常驻 / 托盘驻留（见下"插件"）
- 主题跟随 · 窗口位置记忆 · dsh 延迟更新（不打断会话）

## 配套插件

安装 [dsh-launcher-lifetime](https://github.com/Ruler4396/dsh-launcher-lifetime) 后，拥有三种node.js的驻留模式（随窗口驻留、常驻、随托盘驻留），可在 dsh 设置页“Node服务驻留”中切换：

```sh
dsh plugin --profile web add dsh-launcher-lifetime
```

## 常见问题

- **MSI 和 ZIP 有区别吗？** 内容相同；MSI 有标准安装/卸载流程。
- **卸载会删 dsh 数据和插件吗？** 不会——只清启动器自有数据，`profiles/`、`settings.yaml` 等原样保留。
- **服务占内存？** dsh 是完整服务，必须常驻node.js。
- **端口 3080 被占用？** 设置 `DSH_WEB_PORT=3090` 后重启。
- **收不到更新提醒？** 系统 Toast 通知因 Windows 通知平台（`wpnapps.dll`）的原生崩溃已**整体移除**（[issue #25](https://github.com/Ruler4396/dsh-launcher/issues/25)，Win10/Win11 均有崩溃报告）。现在所有提醒统一为屏幕右下角的自绘通知卡片：不依赖托盘图标、不抢你的焦点、到时自动收起、需要时可直接点击（如"点击下载更新""退出安全模式"）。同时标题栏会保留 `（有更新）` 标记，错过卡片也看得出没处理的更新。**插件自己的网页通知不受影响**（权限照常放行，仍由 WebView2 原生渲染）。
- **遇到问题？** 运行 `check-prereq.cmd`；仍不行用 `DshWeb.exe --diagnose` 导出诊断包，提交至 Issue（[模板](https://github.com/Ruler4396/dsh-launcher/issues/new/choose)）。日志在 `~/.dsh\dsh-launcher\dsh.log`。
````

</details>

#### 缺口

- 依赖当前分发、更新回滚、卸载残留和真实迁移效果未验证。
  **影响**：不能保证新环境可安装或无损退出。
  **进一步探讨**：固定旧环境副本清点profiles/settings、插件和凭据，再按官方说明单独评估迁移；核诊断包内容后才分享。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可验证的新方向是什么，如何证明退出更安全？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是面向既有启动器用户的只读迁移清单：列出实际Node/DSH身份、profile与插件数据位置、服务归属和待人工检查的日志敏感项，让用户在停更后可比较迁移前后状态。它从当前身份统一、PID账本和保留数据声明推导，不是已经实现的迁移器，也不是新增维护承诺。

最小验证用可丢弃Windows用户副本，比人工按README清点与清单辅助的同一组退出任务；验收是数据目录与设置保留、无误停其他node、任务仍可在选定替代端继续，并记录人工步骤/错误，而不预先许诺节时。若清单漏掉关键凭据/profile、无法区分PID复用或替代客户端无法读取数据，就推翻自动迁移价值，保留人工备份和原环境回退；没有必要为假设继续安装停止维护的壳。

#### 证据与依据

**依据 1 · 源码核查**：[src/DshShell/Program.cs:2511-2531](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/Program.cs#L2511-L2531)

当前身份账本局限。

<details>
<summary>查看原文（21行）</summary>

```text
    /// <summary>
    /// [F4] 服务身份账本查询（组合根注入 ServiceManager）："我们拉起过的 dsh"= 本会话
    /// 内存缓存的 PID ∪ 历史 pid 文件账本（崩溃/接管后依然有效）。仅账本内的 node 进程
    /// 才允许被 Zombie 清理——账本外的 node（用户自己的程序）绝不强杀。
    /// </summary>
    private static bool IsKnownDshServicePid(int pid, int port)
    {
        if (pid <= 0) return false;
        if (pid == _servicePid) return true;
        try
        {
            var f = Managers.ServiceLifecycleOps.PidFilePath(DataDir, port);
            return File.Exists(f)
                   && int.TryParse(File.ReadAllText(f).Trim(), out var recorded)
                   && recorded == pid;
        }
        catch (Exception ex)
        {
            Logger.Warn($"known-pid lookup failed for pid={pid} port={port}: {ex.Message}");
            return false;
        }
```

</details>

**依据 2 · 作者声明**：[README.md:54-61](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/README.md#L54-L61)

退出/数据保留的作者前提。

```text
## 常见问题

- **MSI 和 ZIP 有区别吗？** 内容相同；MSI 有标准安装/卸载流程。
- **卸载会删 dsh 数据和插件吗？** 不会——只清启动器自有数据，`profiles/`、`settings.yaml` 等原样保留。
- **服务占内存？** dsh 是完整服务，必须常驻node.js。
- **端口 3080 被占用？** 设置 `DSH_WEB_PORT=3090` 后重启。
- **收不到更新提醒？** 系统 Toast 通知因 Windows 通知平台（`wpnapps.dll`）的原生崩溃已**整体移除**（[issue #25](https://github.com/Ruler4396/dsh-launcher/issues/25)，Win10/Win11 均有崩溃报告）。现在所有提醒统一为屏幕右下角的自绘通知卡片：不依赖托盘图标、不抢你的焦点、到时自动收起、需要时可直接点击（如"点击下载更新""退出安全模式"）。同时标题栏会保留 `（有更新）` 标记，错过卡片也看得出没处理的更新。**插件自己的网页通知不受影响**（权限照常放行，仍由 WebView2 原生渲染）。
- **遇到问题？** 运行 `check-prereq.cmd`；仍不行用 `DshWeb.exe --diagnose` 导出诊断包，提交至 Issue（[模板](https://github.com/Ruler4396/dsh-launcher/issues/new/choose)）。日志在 `~/.dsh\dsh-launcher\dsh.log`。
```

**依据 3 · 源码核查**：[src/DshShell/DiagnoseExport.cs:216-251](https://github.com/Ruler4396/dsh-launcher/blob/e2a9f633e36a56efd1444142fb8042b40afcef91/src/DshShell/DiagnoseExport.cs#L216-L251)

需人工敏感项检查的现有边界。

<details>
<summary>查看原文（36行）</summary>

```text
    /// <summary>脱敏：把用户目录及可推导的用户相关信息替换为占位符，避免日志/路径泄漏用户名。
    /// 顺序（均 OrdinalIgnoreCase）：
    ///   1) 当前用户目录全路径 → %USER%（保留原文覆盖）；
    ///   2) %USERPROFILE% 字面量 → %USER%（环境变量形式出现的路径）；
    ///   3) 波浪号缩写 "~\" → "%USER%\"（仅替换反斜杠后缀形式，避免误伤普通波浪号文本；
    ///      独立 "~" token 不替换，因其可能是正常文本中与路径无关的波浪号）；
    ///   4) 反斜杠分隔的 "…\用户名\" 路径片段 → "…\USERNAME\"（正则只在反斜杠之后才匹
    ///      配用户名，且要求其后紧跟反斜杠，故只命中路径上下文，防过度替换普通文本中的
    ///      用户名单词）。</summary>
    internal static string Sanitize(string? s)
    {
        if (string.IsNullOrEmpty(s)) return s ?? "";
        try
        {
            var up = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
            if (!string.IsNullOrWhiteSpace(up))
            {
                // 1) 全路径 — 覆盖默认形式 C:\Users\xxx
                s = s.Replace(up, "%USER%", StringComparison.OrdinalIgnoreCase);
                // 2) 环境变量字面量形式
                s = s.Replace("%USERPROFILE%", "%USER%", StringComparison.OrdinalIgnoreCase);
                // 3) 波浪号缩写形式（仅 "~\"，保守安全）
                s = s.Replace("~\\", "%USER%\\", StringComparison.OrdinalIgnoreCase);
                // 4) 用户名路径片段：仅 \用户名\ 上下文（用户名可能出现在 profile 名/短路径
                //    等未被全路径替换覆盖到的位置）。用户名取用户目录最后一段。
                var userName = Path.GetFileName(up.TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar));
                if (!string.IsNullOrEmpty(userName))
                {
                    // 模式：反斜杠 + 用户名 +（后随反斜杠，用前瞻保留它）；OrdinalIgnoreCase。
                    s = Regex.Replace(s, "\\\\" + Regex.Escape(userName) + "(?=\\\\)", "\\\\USERNAME",
                        RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);
                }
            }
        }
        catch { }
        return s;
```

</details>

#### 缺口

- 迁移清单及替代端兼容尚未实现或比较。
  **影响**：不计现有贡献、效果或创新评分。
  **进一步探讨**：只在已有部署副本先做最小验证，失败则人工备份回退。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
