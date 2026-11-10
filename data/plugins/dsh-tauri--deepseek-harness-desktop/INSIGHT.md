# DeepSeek Harness Tauri Desktop

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[fa55bd6](https://github.com/dsh-tauri/deepseek-harness-desktop/tree/fa55bd68883ef86c3d92161bbc535cf3cc291519)

<!-- BEGIN META -->
[![GitHub ★ 3,550](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C550&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-tauri/deepseek-harness-desktop)
<!-- END META -->

> **功能**：提供 DSH 桌面界面、内核与运行时管理和数据迁移。

> **亮点**：在一个桌面客户端衔接内核选择、按档案的进程管理和已认证的 Harness 页面，让用户可以从图形界面启动同一档案。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：进程就绪、页面可信与会话可用是不同状态。目录迁移比较文件数和字节下限，链接重建失败只告警，仍需独立读验后再切换。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 这套桌面客户端为已有 DSH 工作流的用户减少哪些步骤？](#detail-section-11)
  - [Q02 · 本地与托管内核如何选择，启动成功如何区别于应用可用？](#detail-section-12)
  - [Q03 · 桌面怎样确认页面来自该 Harness，认证结果和本地日志有哪些边界？](#detail-section-13)
  - [Q04 · 整体数据目录迁移和回滚会修改什么，何时值得试用？](#detail-section-14)
  - [Q05 · 把启动和迁移验收分层展示，能否减少错误切换？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH 的用户希望用一个桌面入口选内核、启动档案、查看会话和管理本地数据。[Q01](#research-q01)

用原生 DSH CLI 启动相同内核，在浏览器打开页面，另用命令和目录工具管理档案与备份。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 桌面 Harness 界面 | 打开已认证的本机档案页面 | 依赖兼容平台与内核，不由启动信号推断插件可用 |
| 内核与档案进程 | 选本地或托管内核并启停 | 以固定清单版本为准 |
| 数据目录迁移与回滚 | 复制档案并切换用户数据目录 | 文件计数和字节不证明完整性，链接需另验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- |
| 兼容平台及桌面运行时 | 必需 | 装载 Tauri/Electron 应用 | 无法启动 |
| 资源清单要求的 DSH 内核 | 必需 | 运行桌面会话和插件 | 回退至可用托管内核或提示错误 |
| 可写独立档案和已验证副本 | 试用需要 | 核对功能与恢复 | 不覆盖工作档案 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择独立账户和副本，记录版本 | 不与生产目录混用 |
| 启动 | 用户选择内核并打开档案 | 认证、插件与会话各自可读 |
| 恢复 | 停止切换并回旧内核与目录 | 对关键文件和链接独立回读 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 下载安装包与依赖，占用本机资源 | 核对平台和内核版本 | 下载流量和时间未测 |
| 持续使用 | 内核、桌面和模型资源未测 | 管理两组版本与插件 | 启动时间和效率未比较 |
| 失败恢复 | 数据副本占空间 | 核对会话、链接和环境 | 计数不能验证内容或可恢复性 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 桌面启动 | 内核选择、进程管理与页面认证 | 真实平台与插件兼容 |
| 迁移 | 复制覆盖、目录变更和补偿分支 | 内容一致性、链接可读与目标宿主恢复 |
| 退出 | 停止档案进程与切回旧目录的路径 | 真机清理和耗时 |

> **思考**：进程就绪、页面可信与会话可用是不同状态。目录迁移比较文件数和字节下限，链接重建失败只告警，仍需独立读验后再切换。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在一个桌面客户端衔接内核选择、按档案的进程管理和已认证的 Harness 页面，让用户可以从图形界面启动同一档案。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

进程登记和核心切换共享互斥，重复 loader 早退有窄重试分支。认证按启动代复查，复制和环境写之间存在补偿；仍需针对外部 runtime 与真实数据做独立验收。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

进程就绪、页面可信与会话可用是不同状态。目录迁移比较文件数和字节下限，链接重建失败只告警，仍需独立读验后再切换。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在独立测试账户用不含敏感资料的档案核对真实启动、插件加载和一次会话读取。用副本单独验迁移，出现异常回原 CLI 及已验证备份，勿从文件数量推断内容已经恢复。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码支持内核选择、进程和页面接线、复制检查与回滚分支。真实系统运行、迁移结果和发布包未验收。

- 已检查：作者 README、包清单、源码路径 README.md、apps/desktop/src-tauri/tauri.conf.json、apps/desktop/src-tauri/src/desktop/builder.rs、apps/desktop/src-tauri/src/bridge/lifecycle.rs、apps/desktop/src-tauri/resources/manifest.jsonc、apps/desktop/src-tauri/src/service/core/source.rs、apps/desktop/src-tauri/src/service/workflow/launch.rs、apps/desktop/src-tauri/src/service/workflow/health.rs、apps/desktop/src-tauri/src/service/workflow/auth.rs、apps/desktop/src-tauri/src/service/workflow/utils.rs、apps/desktop/src-tauri/src/desktop/window.rs、apps/desktop/src-tauri/capabilities/hosted-shell.json、apps/desktop/src-tauri/src/bridge/data_dir.rs、apps/desktop/src-tauri/src/service/data_dir/migrate.rs、apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Rust/Tauri 宿主启动、窗口认证及数据目录迁移的源码抽核。Electron gitlink 依赖、打包产物和远程运行未覆盖。
- 下一步：只读固定 Git 源码。未编译、安装、执行桌面、内核、迁移或远程服务。对照与故障注入见 [Q05](#research-q05)。

**分析版本**

- **仓库**：[dsh-tauri/deepseek-harness-desktop](https://github.com/dsh-tauri/deepseek-harness-desktop)
- **版本号**：0.31.3（[固定提交 fa55bd6](https://github.com/dsh-tauri/deepseek-harness-desktop/tree/fa55bd68883ef86c3d92161bbc535cf3cc291519)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证方向是分别呈现进程、认证、会话和关键数据的检查结果，观察能否降低用户过早切换和误判成功。[Q05](#research-q05)

只读固定 Git 源码。未编译、安装、执行桌面、内核、迁移或远程服务。对照与故障注入见 [Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | test | 4 | 524 | 479 | 7 | — |
| .mjs | source | 7 | 867 | 777 | 3 | — |
| .md | source | 44 | 5478 | — | — | 57815 |
| .js | source | 4 | 128 | 124 | 1 | — |
| .ts | source | 565 | 37368 | 32226 | 2004 | — |
| .cjs | source | 1 | 310 | 295 | 1 | — |
| .cjs | test | 2 | 716 | 668 | 0 | — |
| .ts | test | 74 | 12410 | 10969 | 534 | — |
| .tsx | test | 35 | 9857 | 8794 | 478 | — |
| .tsx | source | 108 | 18235 | 16590 | 621 | — |
| .md | test | 2 | 235 | — | — | 2546 |

</details>

**活跃度**

[![Issue 未关闭 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=19&color=737b86&logo=github)](https://github.com/dsh-tauri/deepseek-harness-desktop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 188](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=188&color=737b86&logo=github)](https://github.com/dsh-tauri/deepseek-harness-desktop/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 184](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=184&color=737b86&logo=github)](https://github.com/dsh-tauri/deepseek-harness-desktop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：第三方 DSH Tauri 桌面端如何把内核、页面和数据目录接成可操作工作流，何时可以相信启动或迁移结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这套桌面客户端为已有 DSH 工作流的用户减少哪些步骤？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合经常打开 DSH Web 会话并要在一个桌面应用中查看内核和档案的用户。原流程可用 DSH CLI 启停、浏览器访问并手工管理路径。这里的增量是把本机 Harness 进程和 Web 文档交给桌面窗口，同时提供按窗口档案触发的启动、停止与重启入口。它可以打包桌面资源和内置插件，但仓库根交付是 Tauri 桌面应用，真实类型应是客户端。应用清单包含平台包、Electron runtime 资源和桌面安装元数据，builder 实际使用 ElectronRuntime 承载 Tauri 命令与窗口。聊天模型和 Harness 能力仍由内核及外部服务负责。判断这套客户端能否减少操作，应比较从打开应用到可继续一项会话任务的实际步骤、恢复情况与时间。只看界面截图不能验证内核与档案管理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:45-62](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/README.md#L45-L62)

作者说明桌面、内核与档案定位。

<details>
<summary>查看原文（18行）</summary>

```text
## 功能

- 🪶 **原生桌面** — Tauri 2(Electron Runtime) + React 19 + Hero 3，内嵌本地 Harness 界面。
- 📱 **远程连接** — Android / iOS 移动端扫码连接电脑上的 DSH，支持局域网与 Cloudflare 公网隧道。
- 🔄 **运行时管理** — 安装依赖、选择内核版本，并提供桌面端与内核更新入口。
- 🧩 **插件管理** — 12 个内置插件；支持本地路径安装、内置插件停用、社区插件安装、升级、卸载与错误查看。
- 🗂️ **档案配置** — 分别管理插件与设置，支持一键迁移档案数据、备份、克隆；
- 💽 **数据目录** — 安装时（Windows）可选择数据存放位置；能在设置里整体迁移与回滚。
- ⌨️ **命令行集成** — 通过托管 shim 提供 `dsh` / `pnpm` 命令行工具，不是全局 npm 内核安装。
- 🐾 **桌宠** — 由 `dsh-pet-lite` 预设插件提供，见下方「预设插件」。
- 🎨 **个性化** — 8 种配色、本机界面缩放、终端模式，以及可调不透明度与可选磨砂模糊。

## 内置插件

随桌面资源分发的一方插件：

- [DSH Tauri](https://dshtauri.mintlify.site/zh-CN/built-in-plugins/dsh-tauri) — 核心插件，桌面端与 Harness 通信、版本适配器、插件依赖管理
- [DSH Tauri UI](https://dshtauri.mintlify.site/zh-CN/built-in-plugins/dsh-tauri-ui) — 桌面设置界面、原生核心组件、主题与配色
```

</details>

**依据 2 · 源码核查**：[apps/desktop/src-tauri/tauri.conf.json:2-17](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/tauri.conf.json#L2-L17)

应用身份、构建命令与前端资源。

<details>
<summary>查看原文（16行）</summary>

```text
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "DSH Tauri",
  "version": "0.31.3",
  "identifier": "dsh-tauri",
  "build": {
    "beforeBuildCommand": "pnpm -w build:plugins && pnpm build",
    "beforeBundleCommand": "node ../../crates/tauri-runtime-electron/tools/macos-sign/sign.mjs",
    "frontendDist": "../dist"
  },
  "app": {
    "security": {
      "assetProtocol": {
        "enable": true,
        "scope": []
      }
    }
```

</details>

**依据 3 · 源码核查**：[apps/desktop/src-tauri/tauri.conf.json:34-55](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/tauri.conf.json#L34-L55)

桌面分发资源含 Electron runtime。

<details>
<summary>查看原文（22行）</summary>

```text
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico",
      "icons/icon.png"
    ],
    "resources": {
      "target/electron": "runtime",
      "resources": "resources",
      "icons/32x32.png": "icons/32x32.png"
    },
    "licenseFile": "licenses/INSTALLER-LICENSE.txt",
    "category": "DeveloperTool",
    "macOS": {
      "minimumSystemVersion": "12.0",
      "hardenedRuntime": true,
      "infoPlist": "Info.plist",
```

</details>

**依据 4 · 源码核查**：[apps/desktop/src-tauri/src/desktop/builder.rs:1461-1472](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/desktop/builder.rs#L1461-L1472)

真实应用构建注册 Electron runtime 和主窗口。

<details>
<summary>查看原文（12行）</summary>

```text
pub fn builder() -> tauri::Builder<ElectronRuntime> {
    let builder = tauri::Builder::<tauri_runtime_electron::ElectronRuntime>::new()
        .plugin(tauri_runtime_electron::init())
        .plugin(tauri_runtime_electron::window::init());

    let builder = builder
        .setup(|app| {
            let app_handle = app.handle().clone();
            crate::desktop::autostart::init(&app_handle)?;
            crate::config::detect_first_install(&app_handle);
            build_main_window(&app_handle)?;
            let language = crate::config::get_store_dat_setting(&app_handle).language;
```

</details>

**依据 5 · 源码核查**：[apps/desktop/src-tauri/src/bridge/lifecycle.rs:363-401](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/bridge/lifecycle.rs#L363-L401)

按窗口档案调用启动、停止和重启。

<details>
<summary>查看原文（39行）</summary>

```text
/// 启动 Harness 服务
#[tauri::command]
pub async fn launch_harness(
    window: crate::Window,
    app_handle: AppHandle,
) -> Result<(), String> {
    let profile = crate::service::workflow::instances::window_profile(&app_handle, window.label());
    crate::service::workflow::instances::scope(profile, async move {
        workflow::launch(app_handle).await
    })
    .await
}

/// 停止 Harness 服务
#[tauri::command]
pub async fn shutdown_harness(
    window: crate::Window,
    app_handle: AppHandle,
) -> Result<(), String> {
    let profile = crate::service::workflow::instances::window_profile(&app_handle, window.label());
    crate::service::workflow::instances::scope(
        profile,
        async move { workflow::stop(app_handle).await },
    )
    .await
}

/// 重启 Harness 服务
#[tauri::command]
pub async fn restart_harness(
    window: crate::Window,
    app_handle: AppHandle,
) -> Result<(), String> {
    let profile = crate::service::workflow::instances::window_profile(&app_handle, window.label());
    crate::service::workflow::instances::scope(profile, async move {
        workflow::restart(app_handle).await
    })
    .await
}
```

</details>

#### 缺口

- 未用实际操作系统、同内核对比原生 CLI 加浏览器。
  **影响**：不能判定操作时间、可靠性或兼容性收益。
  **进一步探讨**：在同一复制档案上分别记录首次启动、选档案、继续会话和退出。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地与托管内核如何选择，启动成功如何区别于应用可用？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

核心选择读取显式设置和本地内核，按资源清单最低版本过滤。显式选托管入口时选 App，其他情况下优先可用本地，若选择本地但已失效则临时回退而不覆盖用户设置。清单最低版本为 0.2.2-rc.1，与 README 的 0.2.1-rc.4 声明不一致，判定应以实际入口读取的清单为准。启动对核心切换与进程登记使用共同临界区，检查已拥有进程、包内入口及目录写权限。启动可能重置档案根 cordis.yml，再通过补丁组合恢复，手写配置需要放在受支持的覆盖层。进程监控在已登记后先报告启动，另监控早退并仅在退出码 1 且命中特定重复加载诊断时重试。输出读取器失败会尝试终止和回收子进程。健康检查则以拥有进程且捕获当代启动 URL 为依据，不能代表认证、插件激活或会话读取已成功。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src-tauri/resources/manifest.jsonc:1-9](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/resources/manifest.jsonc#L1-L9)

固定 Git blob 声明最低内核和 pnpm 基线。

```text
{
  "engines": {
    "dsh": {
      // 离线包随包内核、下载目标与更新提示都跟随 pkg 仓库的最新稳定发行版；
      // 清单不再声明「推荐版本」，也没有固定的随包版本。
      "minimum": "0.2.2-rc.1"
    },
    "pnpm": {
      "version": ">=11.7.0",
```

**依据 2 · 作者声明**：[README.md:140-145](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/README.md#L140-L145)

作者 README 的最低内核仍为另一版本。

```text
| 当前基线 | 版本 |
| --- | --- |
| 推荐 Harness 内核 | `0.2.1-rc.4` |
| 支持的内核最低版本 | `0.2.1-rc.4`，不保证所有插件兼容 |

更早内核不再支持；旧兼容记录仅保留历史事实，不代表当前支持范围。
```

**依据 3 · 源码核查**：[apps/desktop/src-tauri/src/service/core/source.rs:154-195](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/core/source.rs#L154-L195)

实际读取清单并选路径，保留原设置。

<details>
<summary>查看原文（42行）</summary>

```text
pub fn active_source<R: tauri::Runtime>(app_handle: &AppHandle<R>) -> CoreSource {
    let setting = config::get_store_dat_setting(app_handle);
    let local = local_core(app_handle);
    let baseline = config::manifest::minimum_dsh_version(app_handle);
    let local_usable = local
        .as_ref()
        .is_some_and(|core| core_supports_bundled_plugins(&core.version, baseline.as_deref()));
    if local.is_some() && !local_usable {
        warn_unsupported_local_core(
            local
                .as_ref()
                .map(|core| core.version.as_str())
                .unwrap_or_default(),
            baseline.as_deref(),
        );
    }
    match setting.active_core.as_deref().and_then(CoreSource::parse) {
        Some(CoreSource::App) => CoreSource::App,
        // 显式选择本地但本地已失效/低于基线 → 回退预打包
        Some(CoreSource::Local) if local_usable => CoreSource::Local,
        // 未设置（自动）或显式本地不可用：本地可用时优先
        _ => {
            if local_usable {
                CoreSource::Local
            } else {
                CoreSource::App
            }
        }
    }
}

/// 当前活动核心的 dsh 入口（bin.js 绝对路径）。
///
/// 供服务启动（workflow::launch）与插件操作（plugin::install 等）统一取用，
/// 本地核心解析在调用瞬间失效时回退预打包入口。
pub fn active_dsh_binary<R: tauri::Runtime>(app_handle: &AppHandle<R>) -> PathBuf {
    match active_source(app_handle) {
        CoreSource::Local => local_core(app_handle)
            .map(|c| c.bin)
            .unwrap_or_else(|| config::get_dsh_binary_path(app_handle)),
        CoreSource::App => config::get_dsh_binary_path(app_handle),
    }
```

</details>

**依据 4 · 源码核查**：[apps/desktop/src-tauri/src/service/workflow/launch.rs:497-528](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/workflow/launch.rs#L497-L528)

互斥和托管 ASAR 入口验证。

<details>
<summary>查看原文（32行）</summary>

```text
    let mut setting = config::get_store_dat_setting(&app_handle);
    setting.port = super::instances::port(&app_handle);
    let transition = super::process::acquire_core_transition();
    tokio::pin!(transition);
    let _transition_guard = loop {
        if launch_guard().load(Ordering::SeqCst) && has_owned_process() {
            return Ok(());
        }
        tokio::select! {
            guard = &mut transition => break guard?,
            _ = tokio::time::sleep(std::time::Duration::from_millis(20)) => {}
        }
    };
    let dsh_binary_path = crate::service::core::active_dsh_binary(&app_handle);

    log::debug!("Checking Harness path: {:?}", dsh_binary_path);
    // 托管核心是 asar 归档，入口在归档内部：std::fs 看不到它，只能按归档判定。
    if !config::core_entry_exists(&dsh_binary_path) {
        log::error!("Harness not installed");
        return Err("HARNESS_NOT_FOUND: Harness not installed".to_string());
    }
    if dsh_binary_path == config::get_dsh_binary_path(&app_handle) {
        let core_dir = config::get_dsh_install_path(&app_handle);
        let tag = (config::dependencies::bundled_core_dir(&app_handle).as_ref() != Some(&core_dir))
            .then(|| config::get_dsh_pkg_tag(&app_handle))
            .flatten();
        let baseline = config::manifest::minimum_dsh_version(&app_handle);
        crate::service::core::ensure_app_core_supported(
            &core_dir,
            tag.as_deref(),
            baseline.as_deref(),
        )?;
```

</details>

**依据 5 · 源码核查**：[apps/desktop/src-tauri/src/service/workflow/launch.rs:249-265](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/workflow/launch.rs#L249-L265)

重建档案组合根的实际写入。

<details>
<summary>查看原文（17行）</summary>

```text
/// 文件，再叠加同一批 patch → `duplicate loader entry`。spawn 前与「早期退出
/// 重试」各调用一次，把竞态窗口关闭到最小；文件已是空根时静默跳过。
fn reset_active_profile_root(profile_root: &Path) {
    if !profile_root.is_dir() {
        return;
    }
    let root_config = profile_root.join("cordis.yml");
    const PROFILE_ROOT_EMPTY: &str = "# dsh profile root — an empty entry list. The tree is composed as patches:\n# each bundle in package.json's dsh.profile.bundles, then cordis.patch.yml, then any\n# --patch overlays. Edit cordis.patch.yml, not this file.\n[]\n";
    if std::fs::read_to_string(&root_config).ok().as_deref() != Some(PROFILE_ROOT_EMPTY) {
        if let Err(e) = std::fs::write(&root_config, PROFILE_ROOT_EMPTY) {
            log::warn!("PROFILE_ROOT_RESET_FAILED: {}: {e}", root_config.display());
        } else {
            log::info!(
                "Reset stale profile root before spawn: {}",
                root_config.display()
            );
        }
```

</details>

**依据 6 · 源码核查**：[apps/desktop/src-tauri/src/service/workflow/launch.rs:366-401](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/workflow/launch.rs#L366-L401)

输出读取器创建失败尝试清理进程。

<details>
<summary>查看原文（36行）</summary>

```text
            let signature = match signature {
                Ok(signature) => {
                    persist(pid);
                    Ok(signature)
                }
                Err(error) => {
                    let error = format!("PROCESS_START_FAILED: spawn output reader: {error}");
                    #[cfg(windows)]
                    let cleanup = {
                        use std::os::windows::io::AsRawHandle;
                        super::process::terminate_windows_process(
                            pid,
                            child.as_raw_handle(),
                            super::process::kill_pid_tree,
                        )
                    };
                    #[cfg(unix)]
                    let cleanup = (|| {
                        if child.try_wait()?.is_none() {
                            // 线程耗尽时不依赖再创建外部 kill 进程；未 reap 的 PID 不会复用。
                            unsafe { libc::kill(-(pid as libc::pid_t), libc::SIGKILL) };
                            if let Err(kill) = child.kill() {
                                if child.try_wait()?.is_none() {
                                    return Err(kill);
                                }
                            }
                        }
                        child.wait().map(|_| ())
                    })()
                    .map_err(|cleanup: std::io::Error| {
                        format!("HARNESS_CLEANUP_FAILED: process {pid}: {cleanup}")
                    });
                    match cleanup {
                        Ok(()) => return Err(error),
                        Err(cleanup) => Err(format!("{error}; {cleanup}")),
                    }
```

</details>

**依据 7 · 源码核查**：[apps/desktop/src-tauri/src/service/workflow/launch.rs:416-455](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/workflow/launch.rs#L416-L455)

进程登记与早退监控分开。

<details>
<summary>查看原文（40行）</summary>

```text
        let signature = signature?;
        log::info!("Harness process spawned and registered: pid={pid}, attempt={attempt}");
        if let Some(started) = started.take() {
            let _ = started.send(Ok(()));
        }
        let mut wait = |timeout| {
            let result = probe(&mut child, timeout);
            if let Err(error) = &result {
                log::error!(
                    "{error}; terminating this Harness process before releasing its monitor"
                );
                #[cfg(windows)]
                {
                    use std::os::windows::io::AsRawHandle;
                    super::process::terminate_windows_process(
                        pid,
                        child.as_raw_handle(),
                        super::process::kill_pid_tree,
                    )?;
                }
                #[cfg(unix)]
                {
                    super::process::kill_pid_tree(pid);
                    child
                        .wait()
                        .map_err(|cleanup| format!("{error}; cleanup failed: {cleanup}"))?;
                }
                on_exit(pid, None, Some(&report_path));
            }
            result
        };
        let code = match wait(Some(std::time::Duration::from_millis(2500)))? {
            Some(code) => code,
            None => {
                let (launch, transition) = guards.take().unwrap();
                drop(launch);
                drop(transition);
                let code = wait(None)?.flatten();
                on_exit(pid, code, Some(&report_path));
                return Ok(());
```

</details>

**依据 8 · 源码核查**：[apps/desktop/src-tauri/src/service/workflow/launch.rs:458-472](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/workflow/launch.rs#L458-L472)

重试限特定重复 loader 错误。

<details>
<summary>查看原文（15行）</summary>

```text
        // 子孙进程可能继承 stderr 写端；只等本轮签名，不能等无界 EOF。
        let duplicate = matches!(
            signature.recv_timeout(std::time::Duration::from_millis(250)),
            Ok(true)
        );
        if code == Some(1) && duplicate && attempt < 3 {
            log_fatal_report(log_path, &report_path);
            log::warn!(
                "DUPLICATE_LOADER_ENTRY: dsh exited early with duplicate loader entry \
                 (pid={pid}, code=1); resetting profile root and relaunching (attempt {attempt}/3)"
            );
            previous_exit = Some((pid, code));
            continue;
        }
        on_exit(pid, code, Some(&report_path));
```

</details>

**依据 9 · 源码核查**：[apps/desktop/src-tauri/src/service/workflow/health.rs:14-31](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/workflow/health.rs#L14-L31)

健康信号只要求持有和启动 URL。

<details>
<summary>查看原文（18行）</summary>

```text
fn not_owned_probe_signal(launch_in_progress: bool) -> &'static str {
    if launch_in_progress {
        "HARNESS_NOT_READY: Harness service is still starting"
    } else {
        "HARNESS_NOT_OWNED: no Harness process is owned by this app"
    }
}

pub async fn proxy_health_check(port: u16) -> Result<HealthCheck, String> {
    if !has_owned_process() {
        return Err(not_owned_probe_signal(launch_guard().load(Ordering::SeqCst)).to_string());
    }
    super::auth::launch_url(port)?;
    Ok(HealthCheck {
        status: "healthy - Harness process ready".into(),
        boot_html: String::new(),
        service_url: config::get_dsh_service_url(port),
    })
```

</details>

#### 缺口

- 未在实际桌面验证多窗口、重启和早退重试。
  **影响**：进程拥有权和清单门槛不能证明该插件组可运行。
  **进一步探讨**：用两个复制档案分别注入低版本、端口占用、早退和权限错误，核对实际生效内核和进程回收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 桌面怎样确认页面来自该 Harness，认证结果和本地日志有哪些边界？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

受管进程 stdout 的就绪行需是特定前缀和明确端口的 HTTP 回环根 URL，带非空 token，不允许用户名、密码或片段。输出读取者把首个匹配值保存在相应启动代。认证读取该值并调用 Electron runtime 绑定，认证结束后再比较启动 URL，防止在重启后使用旧结果。页面挂载要求来自合适壳窗口且 URL 端口与当前 profile 实例一致，认证后复查 profile。运行时记住所绑定来源。某些页面另检测来源、启动对象和 WebView 标签，这类 DOM 证明仍不等于插件业务可用。动态 ACL 和相邻 Electron 子模块实现需要另核验，不能用这几个检查推断所有 IPC 均安全。输出读取器将捕获启动行后继续按普通行记录，日志写入是原行内容，因此代码路径会把带 token 的启动行写到本地服务日志。分享诊断材料前需要检查和处理访问参数。本轮没有验证日志访问范围、token 生命周期或远程窗口权限。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src-tauri/src/service/workflow/auth.rs:3-19](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/workflow/auth.rs#L3-L19)

启动行接受的固定形态及 token。

<details>
<summary>查看原文（17行）</summary>

```text
pub(super) fn launch_url_in(text: &str, port: u16) -> Option<String> {
    text.lines()
        .filter_map(|line| line.trim().strip_prefix("dsh web: "))
        .filter_map(|value| tauri::Url::parse(value.trim()).ok())
        .find(|url| {
            url.scheme() == "http"
                && url.host_str() == Some("127.0.0.1")
                && url.port() == Some(port)
                && url.path() == "/"
                && url.username().is_empty()
                && url.password().is_none()
                && url.fragment().is_none()
                && url
                    .query_pairs()
                    .any(|(key, value)| key == "token" && !value.is_empty())
        })
        .map(Into::into)
```

</details>

**依据 2 · 源码核查**：[apps/desktop/src-tauri/src/service/workflow/utils.rs:91-113](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/workflow/utils.rs#L91-L113)

按当前启动代捕获首条匹配输出。

<details>
<summary>查看原文（23行）</summary>

```text
        let generation = instance
            .launch_url
            .lock()
            .unwrap_or_else(|error| error.into_inner())
            .clone();
        let port = *instance
            .port
            .lock()
            .unwrap_or_else(|error| error.into_inner());
        #[cfg(test)]
        check_output_reader_spawn()?;
        thread::Builder::new().spawn(move || {
            drain_subprocess_output(BufReader::new(stdout), log_path, log::Level::Info, |line| {
                if let Some((port, url)) = port
                    .and_then(|port| super::auth::launch_url_in(line, port).map(|url| (port, url)))
                {
                    let mut output = generation.lock().unwrap_or_else(|error| error.into_inner());
                    if output.is_none() {
                        *output = Some((port, url));
                    }
                }
            });
        })?;
```

</details>

**依据 3 · 源码核查**：[apps/desktop/src-tauri/src/service/workflow/utils.rs:149-164](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/workflow/utils.rs#L149-L164)

原行在回调后仍交日志。

<details>
<summary>查看原文（16行）</summary>

```text
    loop {
        let mut bytes = Vec::new();
        match reader.read_until(b'\n', &mut bytes) {
            Ok(0) => break, // EOF
            Ok(_) => {
                // 去除行尾 \n / \r\n（与旧 lines() 行为一致）
                let bytes = bytes.strip_suffix(b"\n").unwrap_or(&bytes);
                let bytes = bytes.strip_suffix(b"\r").unwrap_or(bytes);
                let line = decode_process_line(bytes);
                on_line(&line);
                match level {
                    log::Level::Warn => log::warn!(target: "dsh", "{}", line),
                    _ => log::info!(target: "dsh", "{}", line),
                }
                append_log(&log_path, &line);
            }
```

</details>

**依据 4 · 源码核查**：[apps/desktop/src-tauri/src/service/workflow/utils.rs:204-211](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/workflow/utils.rs#L204-L211)

本地文件追加收到的行。

```text
    if let Ok(mut file) = std::fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(log_path)
    {
        let _ = writeln!(file, "{}", line);
        let _ = file.flush();
    }
```

**依据 5 · 源码核查**：[apps/desktop/src-tauri/src/service/workflow/auth.rs:43-66](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/workflow/auth.rs#L43-L66)

认证、缓存和重启时的过期比较。

<details>
<summary>查看原文（24行）</summary>

```text
pub(crate) async fn authenticated_host(
    app: &crate::AppHandle,
    port: u16,
) -> Result<tauri_runtime_electron::AuthenticatedWebHost, String> {
    let instance = super::instances::instance();
    let launch = launch_url(port)?;
    let mut cached = instance.authenticated_host.lock().await;
    if let Some((generation, host)) = cached.as_ref()
        && generation == &launch
    {
        return Ok(host.clone());
    }
    let client = app
        .state::<tauri_runtime_electron::ElectronClient>()
        .inner()
        .clone();
    let host = tauri_runtime_electron::authenticate_web_host(&client, &launch)
        .await
        .map_err(|error| format!("HARNESS_AUTH_FAILED: {error}"))?;
    if launch_url(port)? != launch {
        return Err("HARNESS_AUTH_STALE: launch URL changed during authentication".into());
    }
    *cached = Some((launch, host.clone()));
    Ok(host)
```

</details>

**依据 6 · 源码核查**：[apps/desktop/src-tauri/src/desktop/window.rs:90-122](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/desktop/window.rs#L90-L122)

壳窗口标签和多个受认可来源条件。

<details>
<summary>查看原文（33行）</summary>

```text
pub(crate) fn require_shell(webview: &Webview) -> Result<(), String> {
    let url = webview.url().map_err(|error| error.to_string())?;
    let packaged = (url.scheme() == "tauri" && url.host_str() == Some("localhost"))
        || (matches!(url.scheme(), "http" | "https") && url.host_str() == Some("tauri.localhost"));
    let dev = cfg!(debug_assertions)
        && webview
            .config()
            .build
            .dev_url
            .as_ref()
            .is_some_and(|dev| dev.origin() == url.origin());
    let hosted = webview.label() == webview.window().label()
        && matches!(url.scheme(), "http" | "https")
        && (crate::service::workflow::instances::dsh_service_origin(webview)
            .is_some_and(|service| service.origin() == url.origin())
            || webview
                .app_handle()
                .try_state::<HostedOrigins>()
                .is_some_and(|origins| {
                    origins
                        .0
                        .lock()
                        .unwrap_or_else(|error| error.into_inner())
                        .get(webview.label())
                        .is_some_and(|origin| origin == &url.origin().ascii_serialization())
                }));
    let remote = webview.label() == webview.window().label()
        && remote_shell_state(webview.app_handle(), webview.window().label())
            .is_some_and(|state| state.trusted_origin == url.origin().ascii_serialization());
    if webview.label() != webview.window().label() || !(packaged || dev || hosted || remote) {
        return Err("HARNESS_WEBVIEW_SHELL_REQUIRED".into());
    }
    Ok(())
```

</details>

**依据 7 · 源码核查**：[apps/desktop/src-tauri/src/desktop/window.rs:505-539](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/desktop/window.rs#L505-L539)

页面先鉴权，复查 profile 后绑定来源。

<details>
<summary>查看原文（35行）</summary>

```text
pub async fn host_harness_document(
    app: AppHandle,
    webview: Webview,
    url: String,
) -> Result<(), String> {
    require_shell(&webview)?;
    let url = harness_guest_url(&url)?;
    remember_harness_bootstrap(&app, &webview)?;
    let profile =
        crate::service::workflow::instances::window_profile(&app, webview.window().label());
    let restart = app.try_state::<HarnessRestartState>().and_then(|state| {
        state
            .0
            .lock()
            .unwrap_or_else(|error| error.into_inner())
            .get(webview.window().label(), &profile)
    });
    let host = authenticate_harness_host(&app, &webview, &url).await?;
    if crate::service::workflow::instances::window_profile(&app, webview.window().label())
        != profile
    {
        forget_harness_restart(&app, webview.window().label());
        return Err("HARNESS_DOCUMENT_PROFILE_CHANGED".into());
    }
    tauri_runtime_electron::bind_authenticated_web_host(&webview, &host)
        .map_err(|error| format!("HARNESS_AUTH_BIND_FAILED: {error}"))?;
    app.manage(HostedOrigins::default());
    app.state::<HostedOrigins>()
        .0
        .lock()
        .unwrap_or_else(|error| error.into_inner())
        .insert(
            webview.label().to_owned(),
            url.origin().ascii_serialization(),
        );
```

</details>

**依据 8 · 源码核查**：[apps/desktop/src-tauri/src/desktop/window.rs:552-566](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/desktop/window.rs#L552-L566)

校验本 profile 端口并调用认证。

<details>
<summary>查看原文（15行）</summary>

```text
async fn authenticate_harness_host(
    app: &AppHandle,
    webview: &Webview,
    url: &Url,
) -> Result<tauri_runtime_electron::AuthenticatedWebHost, String> {
    let profile = crate::service::workflow::instances::window_profile(app, webview.window().label());
    let port = crate::service::workflow::instances::scope_sync(profile.clone(), || {
        crate::service::workflow::instances::port(app)
    });
    if url.port() != Some(port) {
        return Err("HARNESS_DOCUMENT_ORIGIN_MISMATCH".into());
    }
    crate::service::workflow::instances::scope(profile,
        crate::service::workflow::auth::authenticated_host(app, port),
    ).await
```

</details>

**依据 9 · 源码核查**：[apps/desktop/src-tauri/src/desktop/window.rs:569-596](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/desktop/window.rs#L569-L596)

WebView 加载后的 DOM/来源证明。

<details>
<summary>查看原文（28行）</summary>

```text
fn track_harness_document(app: &AppHandle, guest: &Webview, owner: &str, url: &Url) -> Result<(), String> {
    app.manage(HarnessDocuments::default());
    let document = Arc::new(Mutex::new(HarnessDocument {
        label: guest.label().to_owned(), owner: owner.to_owned(), ..Default::default()
    }));
    app.state::<HarnessDocuments>().0.lock().unwrap().insert(guest.label().to_owned(), document.clone());
    let app = app.clone();
    let view = guest.clone();
    let proof = format!(
        "Boolean(location.origin === {} && Array.isArray(window.__DSH_BOOT__?.entries) && window.__TAURI_INTERNALS__?.metadata?.currentWebview?.label === {})",
        serde_json::to_string(&url.origin().ascii_serialization()).unwrap(),
        serde_json::to_string(guest.label()).unwrap()
    );
    tauri_runtime_electron::on_webview_load_state(guest, move |event| {
        let (revision, snapshot) = {
            let mut document = document.lock().unwrap();
            let revision = document.advance(event);
            (revision, document.clone())
        };
        snapshot.emit(&app);
        if event == tauri_runtime_electron::WebviewLoadState::Finished {
            let document = document.clone();
            let app = app.clone();
            if let Err(error) = view.eval_with_callback(proof.clone(), move |value| {
                let snapshot = {
                    let mut document = document.lock().unwrap();
                    document
                        .confirm(revision, value == "true")
```

</details>

**依据 10 · 源码核查**：[apps/desktop/src-tauri/capabilities/hosted-shell.json:2-15](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/capabilities/hosted-shell.json#L2-L15)

回环来源和 hosted-shell 命令能力声明，实际注册需另核。

<details>
<summary>查看原文（14行）</summary>

```text
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "hosted-shell",
  "description": "文档即 DSH：主窗口直接加载本机 DSH 服务页面，壳层 UI 注入其上，需要同一套 IPC 权限。仅对回环开放。",
  "local": false,
  "remote": {
    "urls": [
      "http://127.0.0.1:*/*",
      "http://localhost:*/*"
    ]
  },
  "windows": [],
  "permissions": [
    "allow-shell-commands",
    "allow-harness-commands",
```

</details>

#### 缺口

- 没有编译和独立核查 gitlink 所指的 Electron runtime 认证实现。
  **影响**：无法确认恶意网页、同机不受信进程或多窗口切换的完整安全边界。
  **进一步探讨**：用本机受控的错误来源与旧代认证试验，检查拒绝、日志脱敏和实际插件启用状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 整体数据目录迁移和回滚会修改什么，何时值得试用？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

迁移入口绑定窗口档案，获取变更锁、要求独占，读取已有进程标记后停止服务并再次确认。后台对源和目标检查后复制，再比较普通文件数和字节是否至少覆盖。它既不逐文件核对哈希，也不把链接计入覆盖判据。内部绝对链接会改到新目录，外部或相对链接保留原值；重建失败只告警，进度还会记录处理了该链接，因此计数不能当作链接可用证据。覆盖通过后写迁移记录、重命名旧目录并写用户级 DSH_HOME，写环境失败会尝试改回旧目录名。回滚路径保留现有非空恢复目录的副本，再移动所选备份并改环境。源码存在补偿，但每一步都可能受权限或盘符限制。首次成本包括桌面、内核、依赖下载及 profile 复核，持续成本包括两组版本、插件和本机执行权限。迁移另占双份磁盘，并要核对关键会话、附件、设置和链接。适合已有 DSH 的用户在独立测试账户和数据副本中试验图形化启动，迁移和切换仅在复制数据里验收。任一关键文件或插件异常就停止切换并回原内核及已验证备份。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src-tauri/src/bridge/data_dir.rs:100-119](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/bridge/data_dir.rs#L100-L119)

迁移前变更锁、独占、进程标记和停服。

<details>
<summary>查看原文（20行）</summary>

```text
#[tauri::command]
pub async fn migrate_data_dir(
    window: crate::Window,
    app_handle: AppHandle,
    parent: String,
    leaf: String,
) -> Result<data_dir::MigrationOutcome, String> {
    let profile = crate::service::workflow::instances::window_profile(&app_handle, window.label());
    crate::service::workflow::instances::scope(profile, async move {
        let mutation = crate::service::profile::mutation::acquire().await?;
        crate::service::workflow::instances::require_exclusive_profile()?;
        // 标记要在 `stop()` 之前读：停成功时它会顺手删掉标记，删掉之后就再也查不出
        // 「崩溃残留、不在 owned 注册表里的 Harness」是否还在写这个目录。
        let recorded =
            data_dir::all_harness_markers(&crate::config::get_dsh_data_path(&app_handle));
        reject_unreadable_markers(recorded.clone())?;
        crate::service::workflow::stop(app_handle.clone()).await?;
        confirm_harness_stopped(recorded)?;
        let app = app_handle.clone();
        data_dir::migrate(app, PathBuf::from(parent), leaf, mutation).await
```

</details>

**依据 2 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/migrate.rs:123-157](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/data_dir/migrate.rs#L123-L157)

复制前确认停服，覆盖失败保留原目录。

<details>
<summary>查看原文（35行）</summary>

```text
    // 动手前的最后一道安全网：调用方（`data_dir::migrate`）已经停过服，这里再确认一次，
    // 避免 Harness 在停服与迁移之间被重新拉起。
    if !harness_stopped(source) {
        return Err(format!(
            "DATA_DIR_HARNESS_RUNNING: {} 仍在使用数据目录",
            source.display()
        ));
    }
    validate_target(source, target)?;
    emit(step("migrate", "scan", 0, 0, 0, 0));
    let mut expected = TreeStats::default();
    fs_ops::scan_tree(source, &mut expected)?;

    let tick = |files: u64, bytes: u64| {
        emit(step("migrate", "copy", files, bytes, expected.files, expected.bytes));
    };
    let progress = CopyProgress::new(&tick);
    fs_ops::copy_tree(source, target, &progress)?;
    let copied = progress.stats();

    emit(step("migrate", "verify", copied.files, copied.bytes, expected.files, expected.bytes));
    let mut actual = TreeStats::default();
    fs_ops::scan_tree(target, &mut actual)?;
    if !actual.covers(&expected) {
        // 目标少于源：绝不继续改名，也绝不删目标（可能只是磁盘满，用户能腾出空间重试）
        return Err(format!(
            "DATA_DIR_COPY_INCOMPLETE: {} -> {}: {} files/{} bytes, expected {} files/{} bytes",
            source.display(),
            target.display(),
            actual.files,
            actual.bytes,
            expected.files,
            expected.bytes
        ));
    }
```

</details>

**依据 3 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs:16-32](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs#L16-L32)

覆盖只检查普通文件数和字节下限。

<details>
<summary>查看原文（17行）</summary>

```text
/// 目录树统计。`links` 单列：重复解析点不复制内容，因此不参与「文件数 + 字节数」
/// 校验，但必须让用户知道有多少条链接需要重建。
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub(super) struct TreeStats {
    pub files: u64,
    pub bytes: u64,
    pub links: u64,
}

impl TreeStats {
    /// 复制是否覆盖了源：文件数或字节数任一少于源即视为不完整。
    ///
    /// 只用「不少于」而不是「相等」：迁移期间用户可能有程序在往源目录写新文件，
    /// 目标比源多不算失败；目标比源少才是真丢数据。
    pub(super) fn covers(&self, source: &TreeStats) -> bool {
        self.files >= source.files && self.bytes >= source.bytes
    }
```

</details>

**依据 4 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs:175-180](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs#L175-L180)

内部绝对链接改到目标，其他保留。

```text
fn relocated_link_target(target: &Path, roots: &CopyRoots) -> PathBuf {
    [&roots.source, &roots.canonical_source]
        .into_iter()
        .find_map(|source| internal_link_suffix(target, source))
        .map(|suffix| roots.destination.join(suffix))
        .unwrap_or_else(|| target.to_path_buf())
```

**依据 5 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs:204-215](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs#L204-L215)

处理链接与实际文件复制分别计数。

<details>
<summary>查看原文（12行）</summary>

```text
            let meta = fs::symlink_metadata(&src_path)
                .map_err(|e| format!("DATA_DIR_COPY_META: {}: {e}", src_path.display()))?;
            if is_reparse_point(&meta) {
                copy_link(&src_path, &dst_path, roots);
                progress.record_link();
            } else if meta.is_dir() {
                copy_tree_contents(&src_path, &dst_path, progress, roots)?;
            } else if meta.is_file() {
                fs::copy(&src_path, &dst_path)
                    .map_err(|e| format!("DATA_DIR_COPY_FILE: {}: {e}", src_path.display()))?;
                progress.record_file(meta.len());
            }
```

</details>

**依据 6 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs:220-239](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs#L220-L239)

链接读取或重建失败只告警。

<details>
<summary>查看原文（20行）</summary>

```text
/// 重建一条重复解析点（best-effort）。
///
/// 不跟随链接：pnpm 的 `node_modules` 链接指向全局 store，跟随复制既会成倍放大
/// 数据量，也会让新旧目录共享同一份文件。重建失败（Windows 创建符号链接需要
/// 权限或开发者模式）只告警、不阻断迁移——链接可以由插件重装流程重建，
/// 而数据文件不能重来。
fn copy_link(src: &Path, dst: &Path, roots: &CopyRoots) {
    let Ok(target) = fs::read_link(src) else {
        log::warn!("DATA_DIR_COPY_LINK_READ: {}", src.display());
        return;
    };
    let target = relocated_link_target(&target, roots);
    #[cfg(unix)]
    let created = std::os::unix::fs::symlink(&target, dst);
    #[cfg(windows)]
    let created = std::os::windows::fs::symlink_dir(&target, dst)
        .or_else(|_| std::os::windows::fs::symlink_file(&target, dst));
    if let Err(error) = created {
        log::warn!("DATA_DIR_COPY_LINK_CREATE: {}: {error}", dst.display());
    }
```

</details>

**依据 7 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/migrate.rs:159-177](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/data_dir/migrate.rs#L159-L177)

修改旧目录、用户环境及失败补偿。

<details>
<summary>查看原文（19行）</summary>

```text
    emit(step("migrate", "finalize", copied.files, copied.bytes, expected.files, expected.bytes));
    let stamp = env::now_stamp();
    let moved = state::with_moved_suffix(source, &stamp)?;
    // 记录先写：跨盘搬家后旧目录留在原盘，只有这条记录能把它找回来（issue E）
    state::write_last_migration(app_handle, &source.to_string_lossy())?;
    fs::rename(source, &moved)
        .map_err(|e| format!("DATA_DIR_RENAME: {} -> {}: {e}", source.display(), moved.display()))?;

    let text = target.to_string_lossy().into_owned();
    if let Err(error) = env::write_user_home(&text) {
        // 环境变量写不进去：把旧目录改回原名，用户至少还能从原来的位置启动
        if let Err(restore) = fs::rename(&moved, source) {
            log::error!("DATA_DIR_RENAME_BACK: {}: {restore}", moved.display());
        }
        return Err(error);
    }
    // 本进程立刻生效：后续 get_dsh_data_path / shim 生成 / 拉起的 Harness 都读新值
    unsafe { std::env::set_var(env::DATA_DIR_ENV, &text); }
    refresh_shims(app_handle, target);
```

</details>

**依据 8 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/migrate.rs:223-272](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/data_dir/migrate.rs#L223-L272)

回滚时挪开非空目标并修改环境。

<details>
<summary>查看原文（50行）</summary>

```text
    // 目标非空时先挪到一边（issue F）：直接覆盖会把用户当前的数据删掉
    let stamp = env::now_stamp();
    let aside = if fs_ops::is_dir_empty(&restore_to) {
        if restore_to.exists() {
            fs::remove_dir(&restore_to).map_err(|e| {
                format!("DATA_DIR_ROLLBACK_CLEAR: {}: {e}", restore_to.display())
            })?;
        }
        String::new()
    } else {
        let target = state::with_current_suffix(&restore_to, &stamp)?;
        fs::rename(&restore_to, &target).map_err(|e| {
            format!("DATA_DIR_ROLLBACK_ASIDE: {}: {e}", restore_to.display())
        })?;
        target.to_string_lossy().into_owned()
    };

    emit(step("rollback", "finalize", 0, 0, 0, 0));
    if let Some(parent) = restore_to.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("DATA_DIR_ROLLBACK_MKDIR: {e}"))?;
    }
    if let Err(error) = fs::rename(&chosen, &restore_to) {
        if !aside.is_empty() {
            let _ = fs::rename(&aside, &restore_to);
        }
        return Err(format!(
            "DATA_DIR_ROLLBACK_MOVE: {} -> {}: {error}",
            chosen.display(),
            restore_to.display()
        ));
    }

    // 回到默认目录就清掉变量：默认目录不该在注册表里留一条冗余记录
    let back_to_default = same_path(&restore_to, &env::default_home());
    let apply = |text: &str| {
        if back_to_default {
            let cleared = env::clear_user_home();
            if cleared.is_ok() {
                unsafe { std::env::remove_var(env::DATA_DIR_ENV); }
            }
            cleared
        } else {
            let written = env::write_user_home(text);
            if written.is_ok() {
                unsafe { std::env::set_var(env::DATA_DIR_ENV, text); }
            }
            written
        }
    };
    rewrite_env_or_undo(&chosen, &restore_to, &aside, apply)?;
```

</details>

**依据 9 · 作者声明**：[README.md:109-112](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/README.md#L109-L112)

作者说明首启依赖联网和平台分发差异。

```text
- 普通安装包首次启动需联网下载缺失的运行时与内核；Git 功能需要可用的 Git。
- 包含 `Bundle` 后缀为离线安装包（`_Bundle_*.exe`、`_Bundle_*.deb`、两种 `_Bundle_*.dmg`）。
- 本地运行不等于完全离线：模型服务、插件安装、更新与桌宠预设素材仍可能联网。
- Linux 显示、Wayland、AppImage 与权限问题的处理见[安装与故障排查文档](https://dshtauri.mintlify.site/zh-CN/help/troubleshooting)。
```

#### 缺口

- 未执行任一平台的数据迁移、环境回滚或已发布安装包验证。
  **影响**：无法判断关键文件、会话或插件在目标系统可恢复。
  **进一步探讨**：只在复制数据中覆盖不同盘、断电、同大小损坏和权限拒绝，保留旧环境并分别读验。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 把启动和迁移验收分层展示，能否减少错误切换？

**研究主题**：新假设与验证

#### 完整回答

可检验方向是在桌面状态里分开给出受管进程、认证与页面、插件和会话、数据复制四类结果。现有进程健康信号只要求启动代 URL，迁移只比较数量与字节，这些信息对定位阶段有用，但不足以判断可以切换。原型可把关键文件摘要、链接可解析性和一项宿主会话读验加入迁移确认，保留失败时的旧目录和回滚状态。用同一副本注入文件等长改坏、链接无权限、进程早退和认证过期，对照当前界面和原型，统计漏报、误切换、任务时间和日志数据最小化。若原型仍无法让操作者识别错误切换，或需大量扫描才能发现罕见问题并拖慢可靠路径，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src-tauri/src/service/workflow/health.rs:22-31](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/workflow/health.rs#L22-L31)

现有进程健康状态。

<details>
<summary>查看原文（10行）</summary>

```text
pub async fn proxy_health_check(port: u16) -> Result<HealthCheck, String> {
    if !has_owned_process() {
        return Err(not_owned_probe_signal(launch_guard().load(Ordering::SeqCst)).to_string());
    }
    super::auth::launch_url(port)?;
    Ok(HealthCheck {
        status: "healthy - Harness process ready".into(),
        boot_html: String::new(),
        service_url: config::get_dsh_service_url(port),
    })
```

</details>

**依据 2 · 源码核查**：[apps/desktop/src-tauri/src/desktop/window.rs:569-596](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/desktop/window.rs#L569-L596)

现有页面检查与加载回调。

<details>
<summary>查看原文（28行）</summary>

```text
fn track_harness_document(app: &AppHandle, guest: &Webview, owner: &str, url: &Url) -> Result<(), String> {
    app.manage(HarnessDocuments::default());
    let document = Arc::new(Mutex::new(HarnessDocument {
        label: guest.label().to_owned(), owner: owner.to_owned(), ..Default::default()
    }));
    app.state::<HarnessDocuments>().0.lock().unwrap().insert(guest.label().to_owned(), document.clone());
    let app = app.clone();
    let view = guest.clone();
    let proof = format!(
        "Boolean(location.origin === {} && Array.isArray(window.__DSH_BOOT__?.entries) && window.__TAURI_INTERNALS__?.metadata?.currentWebview?.label === {})",
        serde_json::to_string(&url.origin().ascii_serialization()).unwrap(),
        serde_json::to_string(guest.label()).unwrap()
    );
    tauri_runtime_electron::on_webview_load_state(guest, move |event| {
        let (revision, snapshot) = {
            let mut document = document.lock().unwrap();
            let revision = document.advance(event);
            (revision, document.clone())
        };
        snapshot.emit(&app);
        if event == tauri_runtime_electron::WebviewLoadState::Finished {
            let document = document.clone();
            let app = app.clone();
            if let Err(error) = view.eval_with_callback(proof.clone(), move |value| {
                let snapshot = {
                    let mut document = document.lock().unwrap();
                    document
                        .confirm(revision, value == "true")
```

</details>

**依据 3 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs:25-32](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs#L25-L32)

现有迁移覆盖口径。

```text
impl TreeStats {
    /// 复制是否覆盖了源：文件数或字节数任一少于源即视为不完整。
    ///
    /// 只用「不少于」而不是「相等」：迁移期间用户可能有程序在往源目录写新文件，
    /// 目标比源多不算失败；目标比源少才是真丢数据。
    pub(super) fn covers(&self, source: &TreeStats) -> bool {
        self.files >= source.files && self.bytes >= source.bytes
    }
```

**依据 4 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/migrate.rs:159-174](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/fa55bd68883ef86c3d92161bbc535cf3cc291519/apps/desktop/src-tauri/src/service/data_dir/migrate.rs#L159-L174)

已有切换与失败补偿可作对照。

<details>
<summary>查看原文（16行）</summary>

```text
    emit(step("migrate", "finalize", copied.files, copied.bytes, expected.files, expected.bytes));
    let stamp = env::now_stamp();
    let moved = state::with_moved_suffix(source, &stamp)?;
    // 记录先写：跨盘搬家后旧目录留在原盘，只有这条记录能把它找回来（issue E）
    state::write_last_migration(app_handle, &source.to_string_lossy())?;
    fs::rename(source, &moved)
        .map_err(|e| format!("DATA_DIR_RENAME: {} -> {}: {e}", source.display(), moved.display()))?;

    let text = target.to_string_lossy().into_owned();
    if let Err(error) = env::write_user_home(&text) {
        // 环境变量写不进去：把旧目录改回原名，用户至少还能从原来的位置启动
        if let Err(restore) = fs::rename(&moved, source) {
            log::error!("DATA_DIR_RENAME_BACK: {}: {restore}", moved.display());
        }
        return Err(error);
    }
```

</details>

#### 缺口

- 尚无原型和操作者对照。
  **影响**：无法推断错误切换或恢复时间能否减少。
  **进一步探讨**：对固定故障集做盲测，记录每个阶段能确认的状态和用户决策耗时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
