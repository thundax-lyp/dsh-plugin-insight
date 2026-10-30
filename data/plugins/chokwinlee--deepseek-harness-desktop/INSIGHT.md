# DeepSeek Harness Desktop（chokwinlee）

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[1b17b8d](https://github.com/chokwinlee/deepseek-harness-desktop/tree/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce)

<!-- BEGIN META -->
[![GitHub ★ 285](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=285&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chokwinlee/deepseek-harness-desktop)
<!-- END META -->

> **功能**：以 Tauri 托管官方 DSH Web 运行时，加入会话备份迁移、插件变更恢复、费用概览和可选原生手机 Remote 接入。

> **亮点**：启动错误恢复、资料备份校验、profile变更记录和回滚、真实受限Remote代理，以及未知费用不记零的显示，见 [Q02](#research-q02) 至 [Q04](#research-q04)。

> **主要限制**：启动稳定/manifest差异不等功能通过；备份/回滚范围有限，LAN bearer非TLS、回执有限缓存非业务完成，关窗也不等退出，见 [Q02](#research-q02)、[Q03](#research-q03) 与 [Q05](#research-q05)。

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
  - [Q01 · 当前主桌面路径是什么，Runtime和UI贡献归谁？](#detail-section-11)
  - [Q02 · 启动前迁移与插件回滚保存什么，何时称验证？](#detail-section-12)
  - [Q03 · Remote真实可做什么，配对和重复请求边界在哪里？](#detail-section-13)
  - [Q04 · 费用与运行指标怎样显示，能否当账单/成果？](#detail-section-14)
  - [Q05 · 试用、失败和退出如何限定，关窗口是否停止？](#detail-section-15)
  - [Q06 · 未来应补什么，不能重复算现有快照和恢复？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望免手动启动并管理本机DSH资料/插件变更的macOS用户，Remote可选；主循环和会话UI归官方Runtime，见 [Q01](#research-q01)。

手动启动官方Web/维护profile和会话备份，以及其他桌面壳；当前贡献是托管与恢复/桥接组合，不是新Agent模型或安全沙箱。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面托管 | 自启动/显示官方Runtime | 包含资源未独立验成品 |
| 备份/迁移/恢复 | 会话与profile变更 | 有排除/拒绝/部分回滚，不等语义保真 |
| Settings插件管理 | UI→官方CLI→pending | 启动稳定不等功能通过 |
| Remote | 手机发任务/审批/看会话 | 持凭据有实权；LAN HTTP/缓存边界 |
| 用量 | 本地日志+公共价格 | 未知标明，非账单/预算上限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 正确Tauri成品/Node/pnpm资源 | Mac主路径必需 | 启动官方Web | 不能用旧Electron入口代证Mac |
| 固定DSH与桌面Settings私有模块 | 必需 | 上游Loop/UI/Remote兼容层 | 版本/接口变化需复核 |
| home/.dsh、备份空间/写权限 | 首启/变更需要 | 会话迁移/profile恢复 | 并发变化/备份错误可拒，非OS沙箱 |
| 模型/插件账号和工作区授权 | 真正任务需要 | 上游执行 | 打包不代配置/权限与费用 |
| 可信私网/bearer或Tailscale | Remote可选 | 原生手机控制电脑任务 | 不等多用户隔离/全部TLS |
| 本地session logs/公共价格 | 用量显示 | token/估价 | 无匹配标未知，非provider账单 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 首启 | Shell备份/委托迁移/启动上游 | 日志ready与存活非任务验收 |
| 显示 | WebView/Settings slot及native桥 | 限origin/token，未实测UI |
| 插件变更 | 快照/pending/官方CLI/manifest变化 | 重启验证；失败可回滚也可再失败 |
| 远控 | 配对/受限代理/上游gateway | rpcId回执不等任务完成 |
| 复核 | 用户核功能/资料/费用 | verified/估价不能代真值 |
| 退出 | 真退出停受管进程和Remote | 关窗hide、资料/凭据另处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包/备份复制/迁移/模型配置未知 | 独立home核版本/旧会话/授权 | 100MB和成品签名未验 |
| 持续使用 | 本机服务/日志/备份/模型/Remote未知 | 依赖、双端协议与功能复核 | 估价不等账单或控费 |
| 失败恢复 | pending/依赖同步/外部副作用未知 | 分迁移/启动/回滚/请求未知对账 | 文件恢复不等全局事务 |
| 退出 | profile/会话/Key/配对/云资料另计 | 真退出/撤Remote配对/资料备份 | 关窗仍运行，关闭不等token轮换 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 启动便利 | 自带资源/托管/回环Web接线 | 成品体积/各平台成功 |
| 变更恢复 | 快照/pending/回滚再启动 | 会话语义/功能正确/外部效果撤销 |
| 远控任务 | 实际代理到prompt/审批 | 手机全链/跨重启去重与权限隔离 |
| 用量透明 | 未知价格/估价/可见token | 完整账单/经济收益/任务价值 |

> **思考**：启动稳定/manifest差异不等功能通过；备份/回滚范围有限，LAN bearer非TLS、回执有限缓存非业务完成，关窗也不等退出，见 [Q02](#research-q02)、[Q03](#research-q03) 与 [Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：启动错误恢复、资料备份校验、profile变更记录和回滚、真实受限Remote代理，以及未知费用不记零的显示，见 [Q02](#research-q02) 至 [Q04](#research-q04)。

[Q02](#research-q02) 备份并发校验/变更journal可借鉴，必须把启动、配置、功能、外部结果分层；[Q03](#research-q03) 配对/receipt和[Q04](#research-q04)未知费用也不能扩大含义。

<a id="detail-section-5"></a>

### 1.4 主要限制

启动稳定/manifest差异不等功能通过；备份/回滚范围有限，LAN bearer非TLS、回执有限缓存非业务完成，关窗也不等退出，见 [Q02](#research-q02)、[Q03](#research-q03) 与 [Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

独立home和无敏感会话先核启动/迁移/无害故障恢复；Remote另批、核token与任务结果，失败停变更保资料，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码的Mac主路径、真实client slot/安装桥、迁移/恢复、Remote网关与用量显示可核；未打包运行或核手机/所有升级器。建议独立资料目录有限试用。

- 已检查：作者 README、包清单、源码路径 package.json、scripts/build-tauri.sh、scripts/lan-remote-proxy.mjs、src-tauri/Cargo.toml、src-tauri/scripts/acknowledge-onboarding.mjs、src-tauri/src/main.rs、src-tauri/tauri.conf.json、src/dsh-desktop-settings-plugin/desktop.patch.yml、src/dsh-desktop-settings-plugin/lib/client.js、src/dsh-desktop-settings-plugin/lib/index.js、src/dsh-desktop-settings-plugin/lib/launch.js、src/dsh-desktop-settings-plugin/lib/remote-v1.js、src/dsh-desktop-settings-plugin/lib/upgrade.js、src/recovery-bridge.js、src/usage-meter.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：四材料摘要与固定身份核对；集中macOS Tauri主启动/实际lib launch与Settings client、备份迁移/插件profile安装恢复、LAN代理/compat gateway/有限receipt、用量UI及退出。未执行目标/测试/成品验证；Electron/原生手机UI/所有自动更新、Tailscale ACL、上游Agent Loop和迁移实现未全审，不宣称全项目审计。
- 下一步：独立home核旧会话/异常备份/功能错但存活/回滚失败和关窗真退出；Remote测试账户核同ID/丢回执/重启/reset，价格与账单独立对照。

**分析版本**

- **仓库**：[chokwinlee/deepseek-harness-desktop](https://github.com/chokwinlee/deepseek-harness-desktop)
- **版本号**：0.5.0（[固定提交 1b17b8d](https://github.com/chokwinlee/deepseek-harness-desktop/tree/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce)）
- **版本日期**：2026-09-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在既有快照/回滚之上绑定固定Runtime/profile/变更的非破坏功能验收和恢复再验；启动失败时应外部启动器承载，不强作进程内插件，见 [Q06](#research-q06)。

独立home核旧会话/异常备份/功能错但存活/回滚失败和关窗真退出；Remote测试账户核同ID/丢回执/重启/reset，价格与账单独立对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 25 | 2604 | — | — | 28897 |
| .mjs | source | 9 | 1019 | 923 | 6 | — |
| .js | source | 14 | 5182 | 4796 | 83 | — |
| .ts | source | 4 | 601 | 521 | 18 | — |
| .ts | test | 8 | 1928 | 1755 | 34 | — |
| .mjs | example | 1 | 84 | 77 | 4 | — |
| .mjs | test | 1 | 117 | 113 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/chokwinlee/deepseek-harness-desktop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/chokwinlee/deepseek-harness-desktop/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/chokwinlee/deepseek-harness-desktop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：macOS桌面托管/变更恢复和Remote是否支持可控采用，启动/回执/费用状态与真正任务结果如何区分？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前主桌面路径是什么，Runtime和UI贡献归谁？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

这是独立桌面客户端，当前macOS主路径是Tauri系统WebView；根包仍有Electron main/start是另一条路径，不能只看package.main就把Mac交付说成Electron。应用/配置与Rust crate为0.5.0，捆绑依赖DSH 0.1.5-rc.2是另一版本。用户得到本地运行时托管、插件变更恢复入口、费用概览及可选手机Remote；模型/Agent loop和主要会话UI来自官方Runtime，不是作者重新实现的Agent。相对手动开Node+dsh web与其他桌面壳，直接增量在打包、自启动/恢复、桌面桥接，而非“所有任务都会正确”。

Tauri config带Node/dsh/pnpm sidecar与node_modules，setup调用launch_normal_with_pending_fallback。spawn_harness定位Node及launch.js，附desktop.patch，在127.0.0.1随机port启动官方Web；launch.js最终import官方bin.runCli。readiness只接明确回环URL/可选token并核短暂存活，失败进恢复窗口；show_harness_window实际建WebView并注入恢复/用量/Remote脚本，导航仅允许当前Harness origin/恢复页，外链交系统打开。实际settings私有模块由patch插入，client exports接slots注册插件tab/版本footer，安装点击走bridge请求到native handler，不能只凭导出声明说UI已实测渲染。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-42](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/package.json#L1-L42)

应用版本/旧Electron入口与Mac构建分支。

<details>
<summary>查看原文（42行）</summary>

```text
{
  "name": "dsh-desktop",
  "version": "0.5.0",
  "description": "Compact unofficial desktop host for DeepSeek Harness, powered by Tauri on macOS",
  "private": true,
  "license": "MIT",
  "author": "chokwinlee",
  "homepage": "https://github.com/chokwinlee/deepseek-harness-desktop#readme",
  "repository": {
    "type": "git",
    "url": "https://github.com/chokwinlee/deepseek-harness-desktop.git"
  },
  "bugs": {
    "url": "https://github.com/chokwinlee/deepseek-harness-desktop/issues"
  },
  "keywords": [
    "deepseek",
    "tauri",
    "lightweight",
    "small-bundle",
    "desktop",
    "macos",
    "windows"
  ],
  "type": "module",
  "main": "dist/src/main.js",
  "engines": {
    "node": ">=22.19.0"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "npm run build && node --test dist/test/desktop-preferences.test.js dist/test/harness-supervisor.test.js dist/test/plugin-ui.test.js dist/test/remote.test.js dist/test/smooth-stream.test.js dist/test/upstream-onboarding.test.js dist/test/updater.test.js dist/test/usage-meter.test.js && node --expose-internals --test test/harness-upgrade.test.mjs",
    "start": "npm run build && electron .",
    "pack": "npm run build && electron-builder --dir",
    "dist": "npm run build && electron-builder",
    "verify:packaged": "node scripts/verify-packaged-runtime.mjs",
    "build:mac": "scripts/build-tauri.sh",
    "verify:tauri": "scripts/verify-tauri.sh",
    "android:check": "cd android && ./gradlew testDebugUnitTest lintDebug lintRelease validateDebugScreenshotTest verifyReleaseVersionCodeOrdering --no-daemon",
    "android:apk": "cd android && ./gradlew assembleDebug --no-daemon",
    "check:release-size": "node scripts/check-release-size.mjs",
    "check:version": "node scripts/check-version-sync.mjs"
```

</details>

**依据 2 · 源码核查**：[src-tauri/tauri.conf.json:1-25](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/tauri.conf.json#L1-L25)

当前Tauri/sidecar资源。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "DSH Desktop",
  "version": "0.5.0",
  "identifier": "com.chokwinlee.deepseek-harness-desktop",
  "build": {
    "frontendDist": "./ui"
  },
  "app": {
    "windows": [],
    "withGlobalTauri": true,
    "security": {
      "csp": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'"
    }
  },
  "bundle": {
    "active": true,
    "targets": ["app", "dmg"],
    "externalBin": ["binaries/node", "binaries/dsh", "binaries/pnpm"],
    "resources": [
      "../node_modules/**/*",
      "scripts/acknowledge-onboarding.mjs",
      "../scripts/lan-remote-proxy.mjs"
    ],
    "icon": ["../build/icon.icns", "../build/icon.png", "../build/icon.ico"],
```

</details>

**依据 3 · 源码核查**：[src-tauri/Cargo.toml:1-8](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/Cargo.toml#L1-L8)

原生版本。

```text
[package]
name = "dsh-desktop"
version = "0.5.0"
edition = "2021"
default-run = "dsh-desktop"
description = "Tauri shell that boots @deepseek-ai/dsh web and shows it in the system webview"
license = "MIT"

```

**依据 4 · 源码核查**：[src-tauri/src/main.rs:4379-4405](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L4379-L4405)

真实setup/failure/exit。

<details>
<summary>查看原文（27行）</summary>

```text
        .invoke_handler(tauri::generate_handler![
            recovery_status,
            retry_harness,
            restore_last_good,
            start_safe_mode
        ])
        .setup(|app| {
            install_signal_handler(app.handle().clone()).map_err(std::io::Error::other)?;
            let handle = app.handle().clone();
            if let Err(error) = launch_normal_with_pending_fallback(&handle) {
                stop_managed_child();
                eprintln!("[dsh] startup failed: {error}");
                set_recovery_state("failed", &error, false);
                show_recovery_window(&handle).map_err(std::io::Error::other)?;
            }
            start_profile_watcher(handle);
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("failed to build tauri app")
        .run(|app_handle, event| match event {
            tauri::RunEvent::Exit => {
                println!("[dsh] exiting, stopping Remote and harness");
                stop_remote_serve_process();
                stop_lan_remote_process();
                stop_managed_child();
            }
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/main.rs:1763-1829](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L1763-L1829)

真实spawn/patch/loopback动态端口。

<details>
<summary>查看原文（67行）</summary>

```text
fn spawn_harness(mode: LaunchMode) -> Result<Child, String> {
    let node = resolve_node();
    let script = resolve_script();
    let paths = harness_paths();
    ensure_desktop_settings_module_link(&paths.dsh_home)?;
    let desktop_patch = desktop_settings_patch_path();
    if !desktop_patch.is_file() {
        return Err(format!(
            "桌面安装包缺少 Settings 插件扩展：{}",
            desktop_patch.display()
        ));
    }
    if mode == LaunchMode::Safe {
        prepare_safe_profile(&paths.dsh_home)?;
    }

    // The harness is spawned with `current_dir(home)`, and macOS refuses to
    // start a child whose working directory does not exist (ENOENT). That used
    // to surface as a setup error -> tauri panic -> abort() (panic = "abort"
    // in the release profile), so create the directory (and any missing
    // parents) up front so a missing SPIKE_HOME/HOME cannot abort startup.
    fs::create_dir_all(&paths.home).map_err(|error| {
        format!(
            "failed to create harness home directory {}: {error}",
            paths.home.display()
        )
    })?;

    println!(
        "[dsh] node={} script={} home={} profile={}",
        node.display(),
        script.display(),
        paths.home.display(),
        mode.profile_name()
    );
    let mut command = Command::new(&node);
    command.arg("--expose-internals").arg(&script);
    match mode {
        LaunchMode::Normal => {
            command.args(["--profile", "web"]);
        }
        LaunchMode::Safe => {
            command.args(["--profile", SAFE_PROFILE_NAME]);
        }
    }
    command.arg("--patch").arg(&desktop_patch);
    command.args(["--host", "127.0.0.1", "--port", "0", "--no-open"]);
    if mode == LaunchMode::Normal {
        if let Some(trusted_host) = REMOTE_TRUSTED_HOST
            .lock()
            .ok()
            .and_then(|value| value.clone())
        {
            command.args(["--trusted-host", &trusted_host]);
        }
    }
    command
        .current_dir(&paths.home)
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    apply_harness_environment(&mut command, &paths)?;
    #[cfg(unix)]
    command.process_group(0);
    command
        .spawn()
        .map_err(|error| format!("failed to spawn {}: {error}", node.display()))
```

</details>

**依据 6 · 源码核查**：[src/dsh-desktop-settings-plugin/lib/launch.js:1-16](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/lib/launch.js#L1-L16)

包装器最终官方runCli。

<details>
<summary>查看原文（16行）</summary>

```text
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { backupHome, migrateSessions } from './upgrade.js'
const require = createRequire(import.meta.url)
if (!process.argv.slice(2).some(value => ['--version', '-V', '--help', '-h'].includes(value))) {
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  const backup = await backupHome(home)
  const report = await migrateSessions(home, backup)
  if (report.refused.length) console.error(`[dsh-desktop] ${report.refused.length} historical sessions could not be migrated. Originals retained; report: ${join(backup, 'migration.json')}`)
}
const bin = join(dirname(require.resolve('@deepseek-ai/dsh/package.json')), 'lib/bin.js')
process.argv[1] = bin
const { runCli } = await import(pathToFileURL(bin).href)
await runCli()
```

</details>

**依据 7 · 源码核查**：[src-tauri/src/main.rs:1832-1846](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L1832-L1846)

readiness地址约束。

<details>
<summary>查看原文（15行）</summary>

```text
fn parse_readiness(line: &str) -> Option<tauri::Url> {
    let raw = line.trim().strip_prefix(READINESS_MARK)?.trim();
    let url: tauri::Url = raw.parse().ok()?;
    let valid = url.scheme() == "http"
        && url.host_str() == Some("127.0.0.1")
        && url.port().is_some()
        && url.username().is_empty()
        && url.password().is_none()
        && url.path() == "/"
        && url.query().is_none_or(|_| {
            let pairs: Vec<_> = url.query_pairs().collect();
            pairs.len() == 1 && pairs[0].0 == "token" && !pairs[0].1.is_empty()
        })
        && url.fragment().is_none();
    valid.then_some(url)
```

</details>

**依据 8 · 源码核查**：[src-tauri/src/main.rs:1898-1912](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L1898-L1912)

ready后短暂存活。

<details>
<summary>查看原文（15行）</summary>

```text
            startup_tail_text(&tail)
        )
    })?;
    let url = received.map_err(|error| format!("{error}{}", startup_tail_text(&tail)))?;
    thread::sleep(READINESS_GRACE);
    if let Some(status) = child
        .try_wait()
        .map_err(|error| format!("failed to inspect dsh after readiness: {error}"))?
    {
        return Err(format!(
            "dsh exited immediately after readiness: {status}{}",
            startup_tail_text(&tail)
        ));
    }
    Ok((url, tail))
```

</details>

**依据 9 · 源码核查**：[src-tauri/src/main.rs:3474-3514](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3474-L3514)

实际WebView/注入/导航限制。

<details>
<summary>查看原文（41行）</summary>

```text
    let builder = WebviewWindowBuilder::new(handle, "main", url)
        .title(title)
        .inner_size(width, height)
        .min_inner_size(min_width, min_height)
        .initialization_script(updater_script)
        .initialization_script(recovery_bridge_script)
        .initialization_script(theme_sync_script)
        .initialization_script(usage_meter_script)
        .initialization_script(SELECTION_GUARD_SCRIPT)
        .initialization_script(smooth_stream_script)
        .initialization_script(remote_bridge_script)
        .on_navigation(move |destination| {
            if destination.scheme() == "dsh-desktop" {
                handle_desktop_action(navigation_handle.clone(), destination);
                return false;
            }
            if is_recovery_asset_url(destination) {
                if destination.path().ends_with("index.html") {
                    if let Some(window) = navigation_handle.get_webview_window("main") {
                        let _ = window.set_title(RECOVERY_TITLE);
                        let _ = window.set_min_size(Some(tauri::LogicalSize::new(640.0, 520.0)));
                        let _ = window.set_size(tauri::LogicalSize::new(820.0, 680.0));
                    }
                }
                return true;
            }
            let allowed = ALLOWED_HARNESS_ORIGIN
                .lock()
                .ok()
                .and_then(|origin| origin.clone());
            if allowed.as_deref() == Some(&destination.origin().ascii_serialization()) {
                return true;
            }
            if matches!(destination.scheme(), "http" | "https" | "mailto") {
                println!("[dsh] external navigation: {destination}");
                let _ = navigation_handle
                    .opener()
                    .open_url(destination.as_str(), None::<&str>);
            }
            false
        });
```

</details>

**依据 10 · 源码核查**：[src/dsh-desktop-settings-plugin/desktop.patch.yml:1-3](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/desktop.patch.yml#L1-L3)

真实插入Settings模块。

```text
- insert:
    - id: ui-settings-desktop-plugin-manager
      name: dsh-desktop-settings-plugin
```

**依据 11 · 源码核查**：[src/dsh-desktop-settings-plugin/lib/client.js:533-553](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/lib/client.js#L533-L553)

实际client slot注册。

<details>
<summary>查看原文（21行）</summary>

```text
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'desktop plugin manager dictionaries')
      const t = ctx.locale.bind(NS)
      const api = ctx.remote
      ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
        name: 'settings.plugins.tab',
        id: 'desktop-manager',
        order: -10,
        label: () => t('tab'),
        locale: NS
      }, props => React.createElement(DesktopPluginManagerTab, { ...props, api })))
      ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
        name: 'sidebar.footer.action',
        id: 'desktop-runtime',
        order: 10
      }, DesktopRuntimeStatus))
    }

    exports.NS = NS
    exports.apply = apply
    exports.inject = inject
```

</details>

**依据 12 · 源码核查**：[src/dsh-desktop-settings-plugin/lib/client.js:313-325](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/lib/client.js#L313-L325)

安装UI到bridge请求。

<details>
<summary>查看原文（13行）</summary>

```text
        loadProductDefaults()
      }, [loadProductDefaults])

      React.useEffect(() => {
        if (!state.busyOperation) setInstallingProduct('')
      }, [state.busyOperation])

      const submit = event => {
        event.preventDefault()
        const value = spec.trim()
        if (!value || busy || pending) return
        bridge?.request('install-plugin', { spec: value })
      }
```

</details>

**依据 13 · 源码核查**：[src/recovery-bridge.js:40-50](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/recovery-bridge.js#L40-L50)

bridge真正custom导航。

<details>
<summary>查看原文（11行）</summary>

```text
  function actionUrl(action, values = {}) {
    if (!ALLOWED_ACTIONS.has(action)) throw new Error(`Unsupported Desktop action: ${action}`)
    const query = new URLSearchParams({ token: ACTION_TOKEN })
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined && value !== null) query.set(key, String(value))
    }
    return `dsh-desktop://action/${action}?${query.toString()}`
  }

  function request(action, values) {
    location.assign(actionUrl(action, values))
```

</details>

**依据 14 · 源码核查**：[src-tauri/src/main.rs:3183-3193](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3183-L3193)

native动作token校验。

<details>
<summary>查看原文（11行）</summary>

```text
fn handle_desktop_action(handle: tauri::AppHandle, destination: &tauri::Url) {
    if destination.host_str() != Some("action") {
        return;
    }
    let parameters: BTreeMap<String, String> = destination.query_pairs().into_owned().collect();
    if parameters.get("token") != Some(&*DESKTOP_ACTION_TOKEN) {
        eprintln!("[dsh] rejected desktop action with an invalid token");
        return;
    }
    let action = destination.path().trim_start_matches('/');
    match action {
```

</details>

**依据 15 · 源码核查**：[src-tauri/src/main.rs:3344-3357](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3344-L3357)

native实际调插件安装。

<details>
<summary>查看原文（14行）</summary>

```text
        "install-plugin" => {
            let Some(spec) = parameters.get("spec").cloned() else {
                emit_action_error(&handle, "请输入插件包名或 GitHub 地址。");
                return;
            };
            emit_bridge_event(
                &handle,
                "operation-started",
                serde_json::json!({ "operation": "install-plugin" }),
            );
            thread::spawn(move || match perform_plugin_install(spec) {
                Ok(status) => emit_bridge_event(&handle, "plugin-installed", status),
                Err(error) => emit_action_error(&handle, error),
            });
```

</details>

**依据 16 · 源码核查**：[package.json:44-53](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/package.json#L44-L53)

固定官方Runtime依赖，区别应用版本。

<details>
<summary>查看原文（10行）</summary>

```text
  "dependencies": {
    "@deepseek-ai/cordis-plugin-group": "1.0.2",
    "@deepseek-ai/dsh": "0.1.5-rc.2",
    "@deepseek-ai/dsh-anonymous-user-id": "0.1.5-rc.2",
    "@deepseek-ai/dsh-api-gateway": "0.1.5-rc.2",
    "@deepseek-ai/dsh-atomic-write": "0.1.5-rc.2",
    "@deepseek-ai/dsh-attachment": "0.1.5-rc.2",
    "@deepseek-ai/dsh-authorization": "0.1.5-rc.2",
    "@deepseek-ai/dsh-bash-local": "0.1.5-rc.2",
    "@deepseek-ai/dsh-client-ui-settings-models": "0.1.5-rc.2",
```

</details>

#### 缺口

- 未打包启动Mac或核发布binary/全部Electron与手机端/会话任务。
  **影响**：源码能证主路径与桥接，不能证100MB体积、签名、各平台发行或模型任务正确。
  **进一步探讨**：在独立资料目录核固定包/版本、正常/失败启动、真实slot与最小会话结果，再单独核各平台发行。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动前迁移与插件回滚保存什么，何时称验证？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

启动不是完全只读：launch.js先backupHome/migrateSessions，备份按Runtime版本目录，对受管home文件做前后清单/hash、临时目录发布；排除node_modules/.cache/旧upgrade备份，symlink只记录不跟随复制。已有备份先校内容，源变化拒继续。迁移通过官方Persistence以write模式打开会话/read，逐项拒绝进报告；本轮未审上游迁移实现，不能只据注释称所有旧会话语义/原字节必然保真。start_harness还尝试写上游welcomeNoticeVersion，helper失败仅warning，不能把app启动等同用户主动确认过上游提示。

插件安装native先拒并行pending、快照profile三文件、写installing，再跑官方plugin add并比较真实manifest变化，置restart-required；命令成功但无变化也失败。失败或下次见installing会restore快照、同步modules再清pending；启动失败可自动回滚再起，回滚本身也可失败并报告。三个文件恢复与依赖重建不撤插件已写其他资料/外部动作，也不是整个home事务。监控在ready存活5秒后可写last-known-good并清pending发plugin-verified，依据启动/配置状态而非插件功能断言；不能把这个label当工具/任务通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-desktop-settings-plugin/lib/launch.js:5-11](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/lib/launch.js#L5-L11)

启动前备份/迁移真调用。

```text
import { backupHome, migrateSessions } from './upgrade.js'
const require = createRequire(import.meta.url)
if (!process.argv.slice(2).some(value => ['--version', '-V', '--help', '-h'].includes(value))) {
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  const backup = await backupHome(home)
  const report = await migrateSessions(home, backup)
  if (report.refused.length) console.error(`[dsh-desktop] ${report.refused.length} historical sessions could not be migrated. Originals retained; report: ${join(backup, 'migration.json')}`)
```

**依据 2 · 源码核查**：[src/dsh-desktop-settings-plugin/lib/upgrade.js:6-21](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/lib/upgrade.js#L6-L21)

备份排除/链接与hash清单。

<details>
<summary>查看原文（16行）</summary>

```text
export const HARNESS_VERSION = '0.1.5-rc.2'
const excluded = new Set(['node_modules', '.cache', 'desktop-upgrades'])
const hash = bytes => createHash('sha256').update(bytes).digest('hex')

// Capture links as links in the inventory, never follow them into unrelated data.
async function inventory(root, directory = root) {
  const entries = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue
    const path = join(directory, entry.name)
    const name = relative(root, path)
    if (entry.isSymbolicLink()) entries.push({ path: name, link: await readlink(path) })
    else if (entry.isDirectory()) entries.push(...await inventory(root, path))
    else if (entry.isFile()) entries.push({ path: name, sha256: hash(await readFile(path)) })
  }
  return entries.sort((a, b) => a.path.localeCompare(b.path))
```

</details>

**依据 3 · 源码核查**：[src/dsh-desktop-settings-plugin/lib/upgrade.js:25-55](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/lib/upgrade.js#L25-L55)

已有备份校验、复制/前后清单/临时发布。

<details>
<summary>查看原文（31行）</summary>

```text
export async function backupHome(home, version = HARNESS_VERSION) {
  if (!/^\d+\.\d+\.\d+(?:-[a-z0-9.]+)?$/.test(version)) throw new Error('Invalid backup version')
  await mkdir(home, { recursive: true, mode: 0o700 })
  const parent = join(home, 'desktop-upgrades')
  await mkdir(parent, { recursive: true, mode: 0o700 })
  const destination = join(parent, version)
  try {
    const receipt = JSON.parse(await readFile(join(destination, 'backup.json'), 'utf8'))
    if (receipt.version !== version || receipt.home !== home) throw new Error('Mismatched upgrade backup')
    for (const item of receipt.files) {
      if (item.sha256 && hash(await readFile(join(destination, 'data', item.path))) !== item.sha256) throw new Error(`Upgrade backup is damaged: ${item.path}`)
    }
    return destination
  } catch (error) { if (error.code !== 'ENOENT') throw error }
  const stage = join(parent, `.${version}-${randomUUID()}`)
  await mkdir(join(stage, 'data'), { recursive: true, mode: 0o700 })
  try {
    const before = await inventory(home)
    for (const item of before) {
      if (item.link !== undefined) continue // recorded for deliberate recovery, not activated in backup
      const destinationFile = join(stage, 'data', item.path)
      await mkdir(join(destinationFile, '..'), { recursive: true, mode: 0o700 })
      await copyFile(join(home, item.path), destinationFile, constants.COPYFILE_EXCL)
      await chmod(destinationFile, 0o600)
      if (hash(await readFile(destinationFile)) !== item.sha256) throw new Error(`Data changed during backup: ${item.path}`)
    }
    if (JSON.stringify(before) !== JSON.stringify(await inventory(home))) throw new Error('DSH data changed during backup; quit other DSH processes and retry')
    await writeFile(join(stage, 'backup.json'), JSON.stringify({ version, home, createdAt: new Date().toISOString(), files: before }, null, 2), { mode: 0o600, flag: 'wx' })
    await rename(stage, destination)
    return destination
  } finally { await rm(stage, { recursive: true, force: true }) }
```

</details>

**依据 4 · 源码核查**：[src/dsh-desktop-settings-plugin/lib/upgrade.js:59-87](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/lib/upgrade.js#L59-L87)

迁移调用/拒绝报告与写权限。

<details>
<summary>查看原文（29行）</summary>

```text
export async function migrateSessions(home, backup) {
  const reportPath = join(backup, 'migration.json')
  try { return JSON.parse(await readFile(reportPath, 'utf8')) } catch (error) { if (error.code !== 'ENOENT') throw error }
  const root = join(home, 'sessions')
  const report = { version: HARNESS_VERSION, completedAt: '', migrated: [], refused: [] }
  try {
    if (!(await lstat(root)).isDirectory()) throw new Error('Session storage must be a local directory; migration stopped')
  } catch (error) { if (error.code !== 'ENOENT') throw error; return report }
  const { Context } = await import('@deepseek-ai/cordis')
  const { default: Persistence } = await import('@deepseek-ai/dsh-session-persistence-jsonl')
  const ctx = new Context()
  try {
    await ctx.plugin(Persistence, { root, compression: 'zstd' })
    for (const snapshot of await ctx.sessionPersistence.list()) {
      const id = snapshot.header.id
      let handle
      try {
        handle = await ctx.sessionPersistence.open(id, 'write')
        await handle.read()
        report.migrated.push(id)
      } catch (error) {
        report.refused.push({ id, reason: error.message })
      } finally { await handle?.close() }
    }
  } finally { await ctx.fiber.dispose() }
  report.completedAt = new Date().toISOString()
  const temp = `${reportPath}.${randomUUID()}.tmp`
  await writeFile(temp, JSON.stringify(report, null, 2), { mode: 0o600, flag: 'wx' })
  await rename(temp, reportPath)
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/main.rs:3641-3645](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3641-L3645)

实际自动ack与warning。

```text
    match acknowledge_onboarding(&url) {
        Ok(()) => println!("[dsh] upstream welcome notice acknowledged"),
        Err(error) => eprintln!("[dsh] warning: {error}"),
    }
    Ok((child, url, tail))
```

**依据 6 · 源码核查**：[src-tauri/scripts/acknowledge-onboarding.mjs:1-16](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/scripts/acknowledge-onboarding.mjs#L1-L16)

真实welcome设置写入。

<details>
<summary>查看原文（16行）</summary>

```text
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
export const UPSTREAM_WELCOME_NOTICE_VERSION = '2026-08-13.1'
const [origin, modulesDirectory] = process.argv.slice(2)
if (!origin || !modulesDirectory) throw new Error('usage: acknowledge-onboarding.mjs ORIGIN NODE_MODULES')
const { connectLoopback, callRemote } = await import(pathToFileURL(join(modulesDirectory, 'dsh-desktop-settings-plugin/lib/rpc.js')).href)
const connection = await connectLoopback(origin)
const described = await callRemote(connection, 'settings/describe', {})
const view = described.namespaces.find(item => item.ns === 'ui-onboarding')
if (!view) throw new Error('Harness onboarding settings are unavailable')
if (view.value?.welcomeNoticeVersion !== UPSTREAM_WELCOME_NOTICE_VERSION) {
  const updated = await callRemote(connection, 'settings/mutate', {
    ns: 'ui-onboarding', ops: [{ op: 'set', path: ['welcomeNoticeVersion'], value: UPSTREAM_WELCOME_NOTICE_VERSION }],
  })
  if (updated.value?.welcomeNoticeVersion !== UPSTREAM_WELCOME_NOTICE_VERSION) throw new Error('Harness did not retain the welcome notice acknowledgement')
}
```

</details>

**依据 7 · 源码核查**：[src-tauri/src/main.rs:4204-4263](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L4204-L4263)

真实安装快照/pending/CLI/manifest差异及失败回滚。

<details>
<summary>查看原文（60行）</summary>

```text
fn perform_plugin_install(spec: String) -> Result<serde_json::Value, String> {
    let spec = validate_plugin_spec(&spec)?;
    let _operation = OperationGuard::acquire()?;
    let paths = harness_paths();
    if read_pending_install(&paths.dsh_home)?.is_some() {
        return Err("已有一个插件等待重启验证；请先重启或撤销，再安装下一个。".into());
    }
    let before = read_web_manifest(&paths.dsh_home)?;
    let before_state = plugin_profile_state(&before);
    let before_fingerprint = plugin_state_fingerprint(&before_state);
    write_profile_snapshot(&paths.dsh_home, BEFORE_PLUGIN_INSTALL)?;
    write_pending_change(
        &paths.dsh_home,
        PendingChange {
            source: "desktop",
            spec: Some(&spec),
            state: "installing",
            packages: &[],
            changes: &[],
            rollback_snapshot: BEFORE_PLUGIN_INSTALL,
            before_fingerprint: Some(&before_fingerprint),
            after_fingerprint: None,
        },
    )?;

    let install_result = run_plugin_add(&spec).and_then(|()| {
        let after = read_web_manifest(&paths.dsh_home)?;
        let after_state = plugin_profile_state(&after);
        let changes = plugin_state_changes(&before_state, &after_state);
        if changes.is_empty() {
            return Err("安装命令完成，但 web profile 没有出现可识别的插件变化。".into());
        }
        let packages = changed_plugin_names(&changes);
        let after_fingerprint = plugin_state_fingerprint(&after_state);
        write_pending_change(
            &paths.dsh_home,
            PendingChange {
                source: "desktop",
                spec: Some(&spec),
                state: "restart-required",
                packages: &packages,
                changes: &changes,
                rollback_snapshot: BEFORE_PLUGIN_INSTALL,
                before_fingerprint: Some(&before_fingerprint),
                after_fingerprint: Some(&after_fingerprint),
            },
        )
    });

    if let Err(error) = install_result {
        let rollback = rollback_pending_install(&paths.dsh_home);
        return Err(match rollback {
            Ok(_) => format!("{error}\n\n安装产生的 profile 改动已自动撤销。"),
            Err(rollback_error) => {
                format!("{error}\n\n安装失败后的自动撤销也未完成：{rollback_error}")
            }
        });
    }
    drop(_operation);
    plugin_manager_status_value()
```

</details>

**依据 8 · 源码核查**：[src-tauri/src/main.rs:1680-1718](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L1680-L1718)

官方CLI真实安装子进程。

<details>
<summary>查看原文（39行）</summary>

```text
fn run_plugin_command(action: &str, arguments: &[&str], failure_label: &str) -> Result<(), String> {
    let pnpm = bundled_pnpm_path();
    if !pnpm.is_file() {
        return Err(format!("桌面安装包缺少内置 pnpm：{}", pnpm.display()));
    }
    let paths = harness_paths();
    let node = resolve_node();
    let script = resolve_script();
    let mut command = Command::new(node);
    command
        .arg("--expose-internals")
        .arg(script)
        .args(["plugin", "--profile", "web", action])
        .args(arguments)
        .current_dir(&paths.home)
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    apply_harness_environment(&mut command, &paths)?;
    apply_noninteractive_pnpm_environment(&mut command);
    let output = command
        .output()
        .map_err(|error| format!("无法启动插件安装器：{error}"))?;
    if output.status.success() {
        return Ok(());
    }
    let mut details = plugin_output_tail(&output.stderr);
    if details.is_empty() {
        details = plugin_output_tail(&output.stdout);
    }
    Err(if details.is_empty() {
        format!("{failure_label}（{}）。", output.status)
    } else {
        format!("{failure_label}（{}）：\n{details}", output.status)
    })
}

fn run_plugin_add(spec: &str) -> Result<(), String> {
    run_plugin_command("add", &[spec], "插件安装失败")
```

</details>

**依据 9 · 源码核查**：[src-tauri/src/main.rs:39-39](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L39-L39)

profile快照范围三文件。

```text
const SNAPSHOT_FILES: [&str; 3] = ["package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml"];
```

**依据 10 · 源码核查**：[src-tauri/src/main.rs:632-661](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L632-L661)

恢复已存在/原缺失文件，不是所有资料。

<details>
<summary>查看原文（30行）</summary>

```text
    let present: BTreeSet<&str> = metadata["files"]
        .as_array()
        .ok_or("recovery snapshot does not list its files")?
        .iter()
        .filter_map(serde_json::Value::as_str)
        .collect();
    if !present.contains("package.json") {
        return Err("recovery snapshot does not contain package.json".into());
    }

    if let Some(name) = backup_name {
        write_profile_snapshot(dsh_home, name)?;
    }
    let destination = dsh_home.join("profiles/web");
    fs::create_dir_all(&destination)
        .map_err(|error| format!("failed to create {}: {error}", destination.display()))?;
    for filename in SNAPSHOT_FILES {
        let destination_file = destination.join(filename);
        if present.contains(filename) {
            copy_atomic(&source.join(filename), &destination_file)?;
        } else if destination_file.exists() {
            fs::remove_file(&destination_file).map_err(|error| {
                format!(
                    "failed to restore absence of {}: {error}",
                    destination_file.display()
                )
            })?;
        }
    }
    Ok(())
```

</details>

**依据 11 · 源码核查**：[src-tauri/src/main.rs:3658-3670](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3658-L3670)

回滚→同步modules→清pending。

<details>
<summary>查看原文（13行）</summary>

```text
fn rollback_pending_install(dsh_home: &Path) -> Result<String, String> {
    let pending = read_pending_install(dsh_home)?.ok_or("没有等待验证的插件安装事务。")?;
    let label = pending_install_label(&pending);
    let snapshot = pending["rollbackSnapshot"]
        .as_str()
        .unwrap_or(BEFORE_PLUGIN_INSTALL);
    restore_profile_snapshot(dsh_home, snapshot, None)?;
    sync_profile_modules_after_restore(dsh_home)?;
    clear_pending_install(dsh_home)?;
    println!("[dsh] rolled back pending plugin change: {label}");
    Ok(label)
}

```

</details>

**依据 12 · 源码核查**：[src-tauri/src/main.rs:3671-3715](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3671-L3715)

启动pending和失败回滚再启动。

<details>
<summary>查看原文（45行）</summary>

```text
fn launch_normal_with_pending_fallback(handle: &tauri::AppHandle) -> Result<(), String> {
    let paths = harness_paths();
    detect_external_change_before_launch(&paths.dsh_home)?;
    let pending = read_pending_install(&paths.dsh_home)?;
    let mut notice = None;
    let mut should_fallback = false;

    if let Some(transaction) = pending.as_ref() {
        let label = pending_install_label(transaction);
        if transaction["state"].as_str() == Some("installing") {
            rollback_pending_install(&paths.dsh_home)?;
            notice = Some(HarnessNotice::InstallRolledBack(label));
        } else {
            rewrite_pending_state(&paths.dsh_home, transaction, "verifying")?;
            notice = Some(HarnessNotice::InstallVerifying(label));
            should_fallback = true;
        }
    }

    match start_harness(LaunchMode::Normal) {
        Ok((child, url, tail)) => {
            register_harness(handle, child, &url, LaunchMode::Normal, tail)?;
            show_harness_window(handle, url, LaunchMode::Normal, notice)
        }
        Err(first_error) if should_fallback => {
            let label = rollback_pending_install(&paths.dsh_home).map_err(|rollback_error| {
                format!(
                    "新插件启动失败，自动回滚也未完成。\n启动错误：{first_error}\n回滚错误：{rollback_error}"
                )
            })?;
            let (child, url, tail) = start_harness(LaunchMode::Normal).map_err(|rollback_error| {
                format!(
                    "新插件启动失败；profile 已回滚，但 Harness 仍无法启动。\n首次错误：{first_error}\n回滚后错误：{rollback_error}"
                )
            })?;
            register_harness(handle, child, &url, LaunchMode::Normal, tail)?;
            show_harness_window(
                handle,
                url,
                LaunchMode::Normal,
                Some(HarnessNotice::InstallRolledBack(label)),
            )
        }
        Err(error) => Err(error),
    }
```

</details>

**依据 13 · 源码核查**：[src-tauri/src/main.rs:3813-3845](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3813-L3845)

5秒稳定后保存/清pending/verified。

<details>
<summary>查看原文（33行）</summary>

```text
                    if !snapshot_attempted && ready_at.elapsed() >= SNAPSHOT_STABILITY {
                        let paths = harness_paths();
                        if read_pending_install(&paths.dsh_home)
                            .ok()
                            .flatten()
                            .and_then(|pending| pending["state"].as_str().map(str::to_string))
                            .as_deref()
                            == Some("restart-required")
                        {
                            continue;
                        }
                        snapshot_attempted = true;
                        match write_profile_snapshot(&paths.dsh_home, "last-known-good") {
                            Ok(()) => {
                                println!("[dsh] last-known-good profile snapshot saved");
                                if let Some(pending) =
                                    read_pending_install(&paths.dsh_home).ok().flatten()
                                {
                                    let label = pending_install_label(&pending);
                                    let outcome = pending_change_outcome(&pending);
                                    match clear_pending_install(&paths.dsh_home) {
                                        Ok(()) => {
                                            println!("[dsh] plugin change verified");
                                            emit_bridge_event(
                                                &handle,
                                                "plugin-verified",
                                                serde_json::json!({
                                                    "label": label,
                                                    "outcome": outcome,
                                                }),
                                            );
                                        }
                                        Err(error) => eprintln!("[dsh] warning: {error}"),
```

</details>

**依据 14 · 源码核查**：[src-tauri/src/main.rs:25-39](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L25-L39)

启动/稳定阈值和快照三文件常量。

<details>
<summary>查看原文（15行）</summary>

```text
const READINESS_MARK: &str = "dsh web:";
const STARTUP_TAIL_LINES: usize = 40;
const STARTUP_TIMEOUT: Duration = Duration::from_secs(120);
const READINESS_GRACE: Duration = Duration::from_millis(300);
const STOP_GRACE: Duration = Duration::from_secs(5);
const MONITOR_INTERVAL: Duration = Duration::from_millis(500);
const PROFILE_WATCH_INTERVAL: Duration = Duration::from_millis(750);
const PROFILE_STABLE_POLLS: u8 = 2;
const SNAPSHOT_STABILITY: Duration = Duration::from_secs(5);
const SAFE_PROFILE_NAME: &str = "desktop-safe";
const RECOVERY_DIR_NAME: &str = "desktop-recovery";
const BEFORE_PLUGIN_INSTALL: &str = "before-plugin-install";
const PENDING_CHANGE_FILE: &str = "pending-plugin-change.json";
const LEGACY_PENDING_INSTALL_FILE: &str = "pending-plugin-install.json";
const SNAPSHOT_FILES: [&str; 3] = ["package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml"];
```

</details>

#### 缺口

- 未跑已有数据迁移、破坏/中断备份、安装脚本副作用、回滚失败或功能失败但进程存活。
  **影响**：不能把备份/启动稳定证明完整数据恢复或插件业务正确，也不能在真实home盲目依赖自动回滚。
  **进一步探讨**：固定旧会话/无害故障插件在独立home核字节和语义、pending各状态、modules与外部残留；对启动正常但功能错单独验。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Remote真实可做什么，配对和重复请求边界在哪里？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

可选LAN Remote不是只读屏幕投影：native启用后以本地保存的随机64hex bearer启Node代理，代理只放行POST白名单与events.mux升级，认证后把上游回环cookie带给固定目标。白名单含session创建/prompt/取消/附件和respond审批；settings模块installRemoteV1真正注册这些路径，invokeLegacy将session.prompt交上游gateway的session.prompt，结果带rpcId返回。持有配对凭据的人可在该受信电脑上下达任务/影响会话，不是独立低权限只读账号。

LAN代理用http server绑定私网IPv4；bearer不是加密，不能把可信Wi-Fi模式说成TLS或多租户隔离。tailnet分支用loopback代理交Tailscale，另需账户/HTTPS/网络配置，本轮不全审该客户端和ACL。凭据落盘Unix目录700/文件600；普通关闭停代理/清内存，重置配对才rotate持久token，不能把关闭等同撤销所有已配对设备。promptReceipts按session+requestId合并pending并缓存最多2048成功结果，requestId传上游；这是进程内有限去重，跨重启/失败后已接收未回执及上游去重未全核，不能宣称永不重复或任务已经完成。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/main.rs:2794-2822](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L2794-L2822)

安全模式拒、凭据与启用真实调用。

<details>
<summary>查看原文（29行）</summary>

```text
fn perform_lan_remote_enable(handle: tauri::AppHandle) -> Result<(), String> {
    let _operation = OperationGuard::acquire()?;
    let paths = harness_paths();
    if RECOVERY_STATE
        .lock()
        .map(|state| state.safe_mode)
        .unwrap_or(true)
    {
        return Err("安全模式下不能开启局域网 Remote。".into());
    }
    let harness_url: tauri::Url = CURRENT_HARNESS_URL
        .lock()
        .map_err(|_| "Harness 地址锁已损坏。".to_string())?
        .clone()
        .ok_or("Harness 尚未启动完成。")?
        .parse()
        .map_err(|error| format!("Harness 地址无效：{error}"))?;
    let token = load_or_create_lan_remote_credential(&lan_remote_credential_path(&paths.dsh_home))?;
    if let Ok(mut saved) = LAN_REMOTE_TOKEN.lock() {
        *saved = Some(token);
    }
    LAN_REMOTE_DESIRED.store(true, Ordering::SeqCst);
    if let Ok(mut state) = REMOTE_STATE.lock() {
        state.lan_busy = true;
        state.lan_enabled = false;
        state.lan_error.clear();
    }
    if let Err(error) = sync_lan_remote(&handle, &harness_url) {
        LAN_REMOTE_DESIRED.store(false, Ordering::SeqCst);
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/main.rs:2299-2307](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L2299-L2307)

Node proxy真实启动。

```text
    let mut command = Command::new(resolve_node());
    command
        .arg(script)
        .args(["--target", target, "--token", token, "--port"])
        .arg(if tailnet {
            "0".to_string()
        } else {
            remote::LAN_REMOTE_PORT.to_string()
        })
```

**依据 3 · 源码核查**：[scripts/lan-remote-proxy.mjs:99-105](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/scripts/lan-remote-proxy.mjs#L99-L105)

Bearer/loopback授权条件。

```text
function authorized(request, token) {
  if (token === null) return ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(request.socket.remoteAddress)
  const value = request.headers.authorization
  if (typeof value !== 'string' || !value.startsWith('Bearer ')) return false
  const received = Buffer.from(value.slice(7), 'utf8')
  const expected = Buffer.from(token, 'utf8')
  return received.length === expected.length && timingSafeEqual(received, expected)
```

**依据 4 · 源码核查**：[scripts/lan-remote-proxy.mjs:10-30](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/scripts/lan-remote-proxy.mjs#L10-L30)

能力白名单含发任务/审批。

<details>
<summary>查看原文（21行）</summary>

```text
const ALLOWED_HTTP_PATHS = new Set([
  '/api/host.describe',
  '/api/workspace.list',
  '/api/session.list',
  '/api/session.create',
  '/api/session.history',
  '/api/session.attachment',
  '/api/session.models',
  '/api/session.selectModel',
  '/api/session.prompt',
  '/api/session.updateQueue',
  '/api/session.cancel',
  '/api/fileReferences/list',
  '/api/sessionReferenceResolver/candidates',
  '/api/subagent.list',
  '/api/subagent.history',
  '/api/subagent.prompt',
  '/api/subagent.interrupt',
  '/api/respond',
])
const ALLOWED_UPGRADE_PATH = '/api/events.mux'
```

</details>

**依据 5 · 源码核查**：[scripts/lan-remote-proxy.mjs:125-134](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/scripts/lan-remote-proxy.mjs#L125-L134)

实际上游cookie/Host转发。

<details>
<summary>查看原文（10行）</summary>

```text
export function proxyHeaders(request, target, declaredBytes) {
  const headers = {
    accept: request.headers.accept || 'application/json',
    host: `${target.hostname}:${target.port}`,
  }
  if (target.dshCookie) headers.cookie = target.dshCookie
  if (request.headers['content-type']) headers['content-type'] = request.headers['content-type']
  if (request.headers['user-agent']) headers['user-agent'] = request.headers['user-agent']
  if (declaredBytes !== undefined) headers['content-length'] = String(declaredBytes)
  return headers
```

</details>

**依据 6 · 源码核查**：[scripts/lan-remote-proxy.mjs:218-241](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/scripts/lan-remote-proxy.mjs#L218-L241)

POST/路径/长度前置拒绝。

<details>
<summary>查看原文（24行）</summary>

```text
function inspectHttpRequest(request, response, token) {
  const path = new URL(request.url || '/', 'http://remote.invalid').pathname
  if (!authorized(request, token)) {
    reject(response, 401, 'Unauthorized', true)
    request.resume()
    return undefined
  }
  if (request.method !== 'POST' || !ALLOWED_HTTP_PATHS.has(path)) {
    reject(response, 404, 'Not Found', true)
    request.resume()
    return undefined
  }
  const declared = inspectDeclaredBodyLength(request.headers['content-length'])
  if (declared.status === 'invalid') {
    reject(response, 400, 'Bad Request', true)
    request.resume()
    return undefined
  }
  if (declared.status === 'too-large') {
    reject(response, 413, 'Payload Too Large', true)
    request.resume()
    return undefined
  }
  return { path, declaredBytes: declared.bytes }
```

</details>

**依据 7 · 源码核查**：[scripts/lan-remote-proxy.mjs:258-264](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/scripts/lan-remote-proxy.mjs#L258-L264)

实际HTTP代理。

```text
    upstream = http.request({
      hostname: target.hostname,
      port: Number(target.port),
      method: 'POST',
      path: inspected.path,
      headers: proxyHeaders(request, target, inspected.declaredBytes),
    }, value => {
```

**依据 8 · 源码核查**：[scripts/lan-remote-proxy.mjs:319-339](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/scripts/lan-remote-proxy.mjs#L319-L339)

WebSocket升级真实转发。

<details>
<summary>查看原文（21行）</summary>

```text
export function createLanRemoteServer(target, token) {
  const server = http.createServer()
  server.on('request', (request, response) => {
    void proxyHttpRequest(request, response, target, token)
  })
  server.on('checkContinue', (request, response) => {
    void proxyHttpRequest(request, response, target, token, true)
  })

  server.on('upgrade', (request, socket, head) => {
    const path = new URL(request.url || '/', 'http://remote.invalid').pathname
    if (!authorized(request, token)) return reject(socket, 401, 'Unauthorized')
    if (path !== ALLOWED_UPGRADE_PATH) return reject(socket, 404, 'Not Found')
    const upstream = net.connect(Number(target.port), target.hostname, () => {
      upstream.write(upgradeRequest(request, target))
      if (head.length) upstream.write(head)
      socket.pipe(upstream).pipe(socket)
    })
    upstream.on('error', () => socket.destroy())
    socket.on('error', () => upstream.destroy())
  })
```

</details>

**依据 9 · 源码核查**：[scripts/lan-remote-proxy.mjs:358-388](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/scripts/lan-remote-proxy.mjs#L358-L388)

loopback目标/auth交换/私网HTTP监听/退出。

<details>
<summary>查看原文（31行）</summary>

```text
async function main() {
  const targetValue = option('--target')
  const tailnet = process.argv.includes('--tailnet')
  const token = tailnet ? null : option('--token')
  const port = Number(option('--port'))
  if (!targetValue || (!tailnet && !token) || !Number.isInteger(port) || port < (tailnet ? 0 : 1) || port > 65535) {
    fail('usage: --target http://127.0.0.1:<port> --token <secret> --port <port>')
  }
  if (!tailnet && !/^[a-f0-9]{64}$/.test(token)) fail('token must be 64 lowercase hexadecimal characters')

  const target = new URL(targetValue)
  if (target.protocol !== 'http:' || target.hostname !== '127.0.0.1' || !target.port) {
    fail('target must be an explicit loopback HTTP endpoint')
  }
  if (target.searchParams.has('token')) {
    const login = await fetch(target, { redirect: 'manual', signal: AbortSignal.timeout(10_000) })
    if (login.status !== 303) fail(`Harness authentication failed (${login.status})`)
    target.dshCookie = login.headers.getSetCookie().map(value => value.split(';', 1)[0]).join('; ')
    if (!target.dshCookie) fail('Harness authentication did not issue a cookie')
    target.search = ''
  }
  const advertisedAddress = tailnet ? '127.0.0.1' : preferredAddress()
  if (!advertisedAddress) fail('no private IPv4 address is available')

  const server = createLanRemoteServer(target, token)
  server.listen(port, advertisedAddress, () => {
    process.stdout.write(`${tailnet ? "dsh tailnet remote:" : READINESS_MARK} http://${advertisedAddress}:${server.address().port}/\n`)
  })

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => server.close(() => process.exit(0)))
```

</details>

**依据 10 · 源码核查**：[src/dsh-desktop-settings-plugin/lib/index.js:1-4](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/lib/index.js#L1-L4)

Host模块实际安装Remote。

```text
import { installRemoteV1 } from './remote-v1.js'
export const inject = ['connection', 'typertGateway', 'sessions', 'webServer']
/** Desktop settings and the compatibility boundary for existing native Remotes. */
export function apply(ctx) { installRemoteV1(ctx) }
```

**依据 11 · 源码核查**：[src/dsh-desktop-settings-plugin/lib/remote-v1.js:59-88](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/lib/remote-v1.js#L59-L88)

真实session.prompt/请求ID/路由返回。

<details>
<summary>查看原文（30行）</summary>

```text
    case 'subagent.list': return invoke('subagents', 'list', { parentSessionId: payload.parentSessionId })
    case 'subagent.prompt': return invoke('subagents', 'prompt', { request: payload })
    case 'subagent.interrupt': return invoke('subagents', 'interruptByParent', { childSessionId: payload.childSessionId, parentSessionId: payload.parentSessionId, mode: payload.mode })
    case 'session.prompt': return invoke('session', 'prompt', { request: { ...payload, requestId: payload.requestId ?? randomUUID() } })
    default: {
      if (!methods.has(endpoint)) throw new Error('Unsupported Remote method')
      return invoke('session', endpoint.slice('session.'.length), { request: payload })
    }
  }
}

/** Keep the installed native Remote v1 clients on the reviewed API surface. */
export function installRemoteV1(ctx) {
  const admitPrompt = promptReceipts()
  for (const endpoint of methods) ctx.effect(() => ctx.connection.fetch.register({
    path: `/api/${endpoint}`, methods: ['POST'], requestBody: 'buffered',
    fetch: async request => {
      let envelope
      try {
        envelope = await request.json()
        if (envelope.type !== 'client-request' || envelope.method !== endpoint || typeof envelope.rpcId !== 'string' || !envelope.rpcId) return Response.json({ error: 'Invalid RPC envelope' }, { status: 400 })
        const payload = endpoint === 'session.prompt' ? { ...envelope.payload, requestId: envelope.rpcId } : envelope.payload
        const invoke = () => invokeLegacy(ctx, endpoint, payload, request.signal)
        const value = endpoint === 'session.prompt'
          ? await admitPrompt(payload.sessionId, envelope.rpcId, invoke)
          : await invoke()
        return Response.json({ type: 'server-response', rpcId: envelope.rpcId, result: { ok: true, value } })
      } catch (error) { return Response.json({ type: 'server-response', rpcId: envelope?.rpcId, result: failure(error) }) }
    },
  }), `desktop Remote v1 ${endpoint}`)
```

</details>

**依据 12 · 源码核查**：[src/dsh-desktop-settings-plugin/lib/remote-v1.js:9-23](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/lib/remote-v1.js#L9-L23)

进程内有限receipt。

<details>
<summary>查看原文（15行）</summary>

```text
export function promptReceipts(limit = 2048) {
  const pending = new Map()
  const accepted = new Map()
  return (sessionId, requestId, admit) => {
    const key = JSON.stringify([sessionId, requestId])
    if (accepted.has(key)) return Promise.resolve(accepted.get(key))
    if (pending.has(key)) return pending.get(key)
    const receipt = Promise.resolve().then(admit).then(value => {
      accepted.set(key, value)
      if (accepted.size > limit) accepted.delete(accepted.keys().next().value)
      return value
    }).finally(() => pending.delete(key))
    pending.set(key, receipt)
    return receipt
  }
```

</details>

**依据 13 · 源码核查**：[src-tauri/src/main.rs:426-470](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L426-L470)

随机token与持久权限。

<details>
<summary>查看原文（45行）</summary>

```text
fn generate_lan_remote_token() -> String {
    format!("{}{}", Uuid::new_v4().simple(), Uuid::new_v4().simple())
}

fn write_lan_remote_credential(path: &Path, token: &str) -> Result<(), String> {
    if !valid_lan_remote_token(token) {
        return Err("无法保存局域网 Remote 配对凭据：凭据格式无效。".into());
    }
    let parent = path
        .parent()
        .ok_or_else(|| format!("局域网 Remote 配对凭据路径无效：{}", path.display()))?;
    fs::create_dir_all(parent)
        .map_err(|error| format!("无法创建 {}：{error}", parent.display()))?;
    #[cfg(unix)]
    fs::set_permissions(parent, fs::Permissions::from_mode(0o700))
        .map_err(|error| format!("无法保护 {}：{error}", parent.display()))?;

    let temporary = parent.join(format!(
        ".{LAN_REMOTE_CREDENTIAL_FILE}.{}-{}",
        std::process::id(),
        Uuid::new_v4().simple()
    ));
    let mut options = fs::OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt;
        options.mode(0o600);
    }
    let mut file = options
        .open(&temporary)
        .map_err(|error| format!("无法写入 {}：{error}", temporary.display()))?;
    file.write_all(token.as_bytes())
        .and_then(|()| file.sync_all())
        .map_err(|error| format!("无法写入 {}：{error}", temporary.display()))?;
    drop(file);
    #[cfg(windows)]
    if path.exists() {
        fs::remove_file(path).map_err(|error| format!("无法替换 {}：{error}", path.display()))?;
    }
    fs::rename(&temporary, path)
        .map_err(|error| format!("无法保存 {}：{error}", path.display()))?;
    #[cfg(unix)]
    fs::set_permissions(path, fs::Permissions::from_mode(0o600))
        .map_err(|error| format!("无法保护 {}：{error}", path.display()))?;
```

</details>

**依据 14 · 源码核查**：[src-tauri/src/main.rs:2831-2848](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L2831-L2848)

关闭停代理不旋转磁盘凭据。

<details>
<summary>查看原文（18行）</summary>

```text
fn perform_lan_remote_disable(handle: tauri::AppHandle) -> Result<(), String> {
    let _operation = OperationGuard::acquire()?;
    if let Ok(mut state) = REMOTE_STATE.lock() {
        state.lan_busy = true;
        state.lan_error.clear();
    }
    LAN_REMOTE_DESIRED.store(false, Ordering::SeqCst);
    stop_lan_remote_process();
    if let Ok(mut saved) = LAN_REMOTE_TOKEN.lock() {
        *saved = None;
    }
    if let Ok(mut state) = REMOTE_STATE.lock() {
        state.lan_enabled = false;
        state.lan_busy = false;
        state.lan_endpoint.clear();
        state.lan_pairing_url.clear();
        state.lan_qr_svg.clear();
        state.lan_error.clear();
```

</details>

**依据 15 · 源码核查**：[src-tauri/src/main.rs:2854-2877](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L2854-L2877)

reset真正轮换token。

<details>
<summary>查看原文（24行）</summary>

```text
fn perform_lan_remote_reset(handle: tauri::AppHandle) -> Result<(), String> {
    let _operation = OperationGuard::acquire()?;
    let was_enabled = LAN_REMOTE_DESIRED.load(Ordering::SeqCst)
        && REMOTE_STATE
            .lock()
            .map(|state| state.lan_enabled)
            .unwrap_or(false);
    let harness_url = if was_enabled {
        Some(
            CURRENT_HARNESS_URL
                .lock()
                .map_err(|_| "Harness 地址锁已损坏。".to_string())?
                .clone()
                .ok_or("Harness 尚未启动完成。")?
                .parse::<tauri::Url>()
                .map_err(|error| format!("Harness 地址无效：{error}"))?,
        )
    } else {
        None
    };
    let paths = harness_paths();
    let token = rotate_lan_remote_credential(&lan_remote_credential_path(&paths.dsh_home))?;
    if let Ok(mut saved) = LAN_REMOTE_TOKEN.lock() {
        *saved = Some(token);
```

</details>

#### 缺口

- 未接手机/联网/核全部Tailscale ACL与上游权限或断连后任务和审批去重。
  **影响**：配对可带来真实工具和模型支出，不能保证按设备/工作区隔离或“已发/已接收”即完成。
  **进一步探讨**：只在测试账户和可信私网核错误token/端点/体积、同ID重发与重启、配对关闭/reset差异，再以实际任务和审批真值验结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 费用与运行指标怎样显示，能否当账单/成果？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

用量不是截图里声明而已：Tauri注入usage-meter脚本；其custom usage-snapshot动作带token/cutoff，native扫本地session logs返回records与warnings，Web端接事件合并并渲染今日token、估算费用/任务和吞吐。价格优先官方映射再OpenRouter公开模型数据，未配上价格累加unpricedCalls，全部未知显示未定价、部分未知加+，优于把缺价格当零。

这仍是日志/价格模型观察层，不是provider账单、全量经济上限或业务交付验收。扫描/旧格式/流式聚合、路由模型映射和缓存价格正确性本轮未全审；读取公共价格会联网，不把“本地用量计算”当全应用无网络。已经花的钱、重复任务或Agent错误不由显示成本撤销，不能以吞吐/活跃数称任务有价值。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/main.rs:3478-3484](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3478-L3484)

真实脚本注入。

```text
        .initialization_script(updater_script)
        .initialization_script(recovery_bridge_script)
        .initialization_script(theme_sync_script)
        .initialization_script(usage_meter_script)
        .initialization_script(SELECTION_GUARD_SCRIPT)
        .initialization_script(smooth_stream_script)
        .initialization_script(remote_bridge_script)
```

**依据 2 · 源码核查**：[src/usage-meter.js:384-400](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/usage-meter.js#L384-L400)

真实snapshot请求/价格网络调用。

<details>
<summary>查看原文（17行）</summary>

```text
  function requestSnapshot() {
    const query = new URLSearchParams({
      token: ACTION_TOKEN,
      cutoff: String(startOfLocalDay(Date.now(), 6)),
    })
    location.assign(`dsh-desktop://action/${SNAPSHOT_ACTION}?${query.toString()}`)
  }

  async function loadOpenRouterPricing() {
    try {
      const response = await fetch(OPENROUTER_MODELS_URL, { cache: 'force-cache', mode: 'cors' })
      if (!response.ok) throw new Error(`OpenRouter models: HTTP ${response.status}`)
      const body = await response.json()
      openRouterIndex = createOpenRouterIndex(body?.data)
    } catch (error) {
      console.warn('[dsh-usage] OpenRouter pricing unavailable:', error)
    } finally {
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/main.rs:3194-3221](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3194-L3221)

native动作/cutoff/回事件。

<details>
<summary>查看原文（28行）</summary>

```text
        "usage-snapshot" => {
            let Some(cutoff_ms) = parameters
                .get("cutoff")
                .and_then(|value| value.parse::<u64>().ok())
            else {
                emit_bridge_event(
                    &handle,
                    "usage-snapshot-error",
                    serde_json::json!({ "message": "invalid usage cutoff" }),
                );
                return;
            };
            let now_ms = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap_or_default()
                .as_millis() as u64;
            let oldest_allowed = now_ms.saturating_sub(31 * 24 * 60 * 60 * 1_000);
            if cutoff_ms < oldest_allowed || cutoff_ms > now_ms.saturating_add(60_000) {
                emit_bridge_event(
                    &handle,
                    "usage-snapshot-error",
                    serde_json::json!({ "message": "usage cutoff is outside the allowed range" }),
                );
                return;
            }
            thread::spawn(move || {
                let snapshot = usage_snapshot_value(cutoff_ms);
                emit_bridge_event(&handle, "usage-snapshot", snapshot);
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/main.rs:3122-3145](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3122-L3145)

本地日志实际扫描和warning。

<details>
<summary>查看原文（24行）</summary>

```text
fn usage_snapshot_value(cutoff_ms: u64) -> serde_json::Value {
    let sessions = harness_paths().dsh_home.join("sessions");
    let mut paths = Vec::new();
    collect_usage_log_paths(&sessions, cutoff_ms, &mut paths);
    let mut records = Vec::new();
    let mut warnings = 0_u64;
    for path in &paths {
        if let Err(error) = scan_usage_log(path, cutoff_ms, &mut records) {
            warnings += 1;
            eprintln!("[dsh] usage scan warning: {error}");
        }
    }
    records.sort_by_key(|record| {
        record
            .get("time")
            .and_then(serde_json::Value::as_u64)
            .unwrap_or(0)
    });
    serde_json::json!({
        "records": records,
        "warnings": warnings,
        "scannedFiles": paths.len(),
        "scannedAt": SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default().as_millis(),
    })
```

</details>

**依据 5 · 源码核查**：[src/usage-meter.js:667-675](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/usage-meter.js#L667-L675)

事件实际消费。

```text
  function handleDesktopEvent(event) {
    const detail = event?.detail
    if (detail?.type === 'usage-snapshot') {
      for (const record of detail.payload?.records || []) {
        if (record?.id) records.set(record.id, record)
      }
      scanWarnings = number(detail.payload?.warnings)
      snapshotLoaded = true
      scheduleRender()
```

**依据 6 · 源码核查**：[src/usage-meter.js:241-246](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/usage-meter.js#L241-L246)

价格选择。

```text
  function priceForRecord(record, openRouterIndex) {
    const usage = usageOf(record)
    const official = deepseekOfficialPrice(record.time, record.provider, record.model)
    if (official) return official
    const model = matchOpenRouterModel(openRouterIndex, record.provider, record.model)
    return openRouterPrice(model, usage.inputTokens + usage.cacheReadTokens + usage.cacheWriteTokens)
```

**依据 7 · 源码核查**：[src/usage-meter.js:298-309](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/usage-meter.js#L298-L309)

未知价格非零。

<details>
<summary>查看原文（12行）</summary>

```text
    bucket.inputTokens += usage.inputTokens
    bucket.outputTokens += usage.outputTokens
    bucket.cacheReadTokens += usage.cacheReadTokens
    bucket.cacheWriteTokens += usage.cacheWriteTokens
    bucket.calls += 1
    const pricing = costForRecord(record, openRouterIndex)
    if (pricing.priced) {
      bucket.cost += pricing.cost
      bucket.sources.add(pricing.source)
    } else {
      bucket.unpricedCalls += 1
    }
```

</details>

**依据 8 · 源码核查**：[src/usage-meter.js:505-511](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/usage-meter.js#L505-L511)

未知/部分未知格式。

```text
  function costLabel(bucket, compact = false) {
    if (bucket.calls === 0) return '$0.00'
    if (bucket.unpricedCalls === bucket.calls) return t.unpriced
    const precision = bucket.cost < 0.01 ? 4 : 2
    const label = `$${bucket.cost.toFixed(precision)}`
    if (bucket.unpricedCalls > 0) return `${label}+`
    return compact ? label : `${label} USD`
```

**依据 9 · 源码核查**：[src/usage-meter.js:553-562](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/usage-meter.js#L553-L562)

可见摘要估算/吞吐。

<details>
<summary>查看原文（10行）</summary>

```text
    if (!ready) {
      summaryButton.innerHTML = `<span class="dsh-usage-pulse"></span><span>${t.loading}</span>`
    } else {
      const todayTokens = totalTokens(today)
      const roundedTps = Math.round(runningTps)
      const rateDigits = Math.min(3, String(Math.abs(roundedTps)).length)
      summaryButton.innerHTML = `
        <span class="dsh-usage-today">${t.today} ${formatTokens(todayTokens, language)} · ${costLabel(today, true)} <small>${t.estimated}</small></span>
        <span class="dsh-usage-divider"></span>
        <span class="dsh-usage-live"><i class="${runningCount ? 'is-running' : ''}"></i><span>${runningCount} ${t.tasks} ·</span><span class="dsh-usage-live-rate" data-digits="${rateDigits}">${roundedTps} tok/s</span></span>`
```

</details>

#### 缺口

- 未对实际账单/多模型历史缓存/全部session格式核口径或完成任务质量。
  **影响**：不能用费用UI决定准确预算、全额结算或把低token高吞吐当成功。
  **进一步探讨**：已知账单/日志测试样本核模型/缓存/时间窗口与漏项，保留unknown；任务验收另核输出与错误。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 试用、失败和退出如何限定，关窗口是否停止？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断

#### 完整回答

适合希望免手工启动且能核资料迁移/恢复的macOS DSH用户，先用独立资料目录和无敏感会话，本轮不建议从手机远控直接碰生产工作区。源码支持SPIKE_HOME隔离home/.dsh、默认读取HOME/DSH_HOME；这只是资料位置，不是OS工具沙箱。固定打包有Node/DSH/pnpm，不代表模型Key、插件脚本、Tailscale和系统网络条件自动满足；从源码还需Node/Rust/平台构建工具。

首次有备份复制/旧session迁移、模型配置、profile与Remote授权成本；持续有本地服务内存/磁盘、备份/日志、模型费用和双端兼容，估价不控费。失败分缺Runtime/启动过早退出、迁移拒绝、profile变化/模块同步失败、Remote未知请求；保留快照/报告和requestId先对账，重启会打断任务。退出分关窗口和退出应用：macOS CloseRequested隐藏窗口仍运行，真正RunEvent::Exit才停Remote和受管child，child先SIGTERM再强杀。已经写文件/云或会话/凭据/备份不会因此删除；关LAN不撤持久配对token，重置才轮换；未核所有异常强退/外部进程清理。金额、操作耗时与净节省未知。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/main.rs:353-366](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L353-L366)

真实独立home与默认路径，非沙箱。

<details>
<summary>查看原文（14行）</summary>

```text
fn harness_paths() -> HarnessPaths {
    let spike_home = env::var("SPIKE_HOME").ok();
    let home = spike_home
        .as_ref()
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from(env::var("HOME").unwrap_or_default()));
    let dsh_home = spike_home
        .map(|value| PathBuf::from(value).join(".dsh"))
        .unwrap_or_else(|| {
            env::var("DSH_HOME")
                .map(PathBuf::from)
                .unwrap_or_else(|_| home.join(".dsh"))
        });
    HarnessPaths { home, dsh_home }
```

</details>

**依据 2 · 源码核查**：[src-tauri/tauri.conf.json:20-25](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/tauri.conf.json#L20-L25)

自带资源声明。

```text
    "resources": [
      "../node_modules/**/*",
      "scripts/acknowledge-onboarding.mjs",
      "../scripts/lan-remote-proxy.mjs"
    ],
    "icon": ["../build/icon.icns", "../build/icon.png", "../build/icon.ico"],
```

**依据 3 · 源码核查**：[scripts/build-tauri.sh:30-37](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/scripts/build-tauri.sh#L30-L37)

构建脚本配置Homebrew及Rust/Cargo工具目录和PATH；此区段不是Node版本声明。

```text

[ -d /opt/homebrew/bin ] && export PATH="/opt/homebrew/bin:$PATH"

export RUSTUP_HOME="${RUSTUP_HOME:-$REPO_ROOT/.rustup}"
export CARGO_HOME="${CARGO_HOME:-$REPO_ROOT/.cargo}"
export PATH="$CARGO_HOME/bin:$PATH"

restore_dev_dependencies() {
```

**依据 4 · 源码核查**：[src/dsh-desktop-settings-plugin/lib/upgrade.js:25-55](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/lib/upgrade.js#L25-L55)

首次备份和磁盘/并发校验。

<details>
<summary>查看原文（31行）</summary>

```text
export async function backupHome(home, version = HARNESS_VERSION) {
  if (!/^\d+\.\d+\.\d+(?:-[a-z0-9.]+)?$/.test(version)) throw new Error('Invalid backup version')
  await mkdir(home, { recursive: true, mode: 0o700 })
  const parent = join(home, 'desktop-upgrades')
  await mkdir(parent, { recursive: true, mode: 0o700 })
  const destination = join(parent, version)
  try {
    const receipt = JSON.parse(await readFile(join(destination, 'backup.json'), 'utf8'))
    if (receipt.version !== version || receipt.home !== home) throw new Error('Mismatched upgrade backup')
    for (const item of receipt.files) {
      if (item.sha256 && hash(await readFile(join(destination, 'data', item.path))) !== item.sha256) throw new Error(`Upgrade backup is damaged: ${item.path}`)
    }
    return destination
  } catch (error) { if (error.code !== 'ENOENT') throw error }
  const stage = join(parent, `.${version}-${randomUUID()}`)
  await mkdir(join(stage, 'data'), { recursive: true, mode: 0o700 })
  try {
    const before = await inventory(home)
    for (const item of before) {
      if (item.link !== undefined) continue // recorded for deliberate recovery, not activated in backup
      const destinationFile = join(stage, 'data', item.path)
      await mkdir(join(destinationFile, '..'), { recursive: true, mode: 0o700 })
      await copyFile(join(home, item.path), destinationFile, constants.COPYFILE_EXCL)
      await chmod(destinationFile, 0o600)
      if (hash(await readFile(destinationFile)) !== item.sha256) throw new Error(`Data changed during backup: ${item.path}`)
    }
    if (JSON.stringify(before) !== JSON.stringify(await inventory(home))) throw new Error('DSH data changed during backup; quit other DSH processes and retry')
    await writeFile(join(stage, 'backup.json'), JSON.stringify({ version, home, createdAt: new Date().toISOString(), files: before }, null, 2), { mode: 0o600, flag: 'wx' })
    await rename(stage, destination)
    return destination
  } finally { await rm(stage, { recursive: true, force: true }) }
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/main.rs:3671-3715](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3671-L3715)

启动恢复有失败。

<details>
<summary>查看原文（45行）</summary>

```text
fn launch_normal_with_pending_fallback(handle: &tauri::AppHandle) -> Result<(), String> {
    let paths = harness_paths();
    detect_external_change_before_launch(&paths.dsh_home)?;
    let pending = read_pending_install(&paths.dsh_home)?;
    let mut notice = None;
    let mut should_fallback = false;

    if let Some(transaction) = pending.as_ref() {
        let label = pending_install_label(transaction);
        if transaction["state"].as_str() == Some("installing") {
            rollback_pending_install(&paths.dsh_home)?;
            notice = Some(HarnessNotice::InstallRolledBack(label));
        } else {
            rewrite_pending_state(&paths.dsh_home, transaction, "verifying")?;
            notice = Some(HarnessNotice::InstallVerifying(label));
            should_fallback = true;
        }
    }

    match start_harness(LaunchMode::Normal) {
        Ok((child, url, tail)) => {
            register_harness(handle, child, &url, LaunchMode::Normal, tail)?;
            show_harness_window(handle, url, LaunchMode::Normal, notice)
        }
        Err(first_error) if should_fallback => {
            let label = rollback_pending_install(&paths.dsh_home).map_err(|rollback_error| {
                format!(
                    "新插件启动失败，自动回滚也未完成。\n启动错误：{first_error}\n回滚错误：{rollback_error}"
                )
            })?;
            let (child, url, tail) = start_harness(LaunchMode::Normal).map_err(|rollback_error| {
                format!(
                    "新插件启动失败；profile 已回滚，但 Harness 仍无法启动。\n首次错误：{first_error}\n回滚后错误：{rollback_error}"
                )
            })?;
            register_harness(handle, child, &url, LaunchMode::Normal, tail)?;
            show_harness_window(
                handle,
                url,
                LaunchMode::Normal,
                Some(HarnessNotice::InstallRolledBack(label)),
            )
        }
        Err(error) => Err(error),
    }
```

</details>

**依据 6 · 源码核查**：[src-tauri/src/main.rs:3998-4019](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3998-L4019)

受管child真实终止。

<details>
<summary>查看原文（22行）</summary>

```text
fn terminate_child(child: &mut Child) {
    if child.try_wait().ok().flatten().is_some() {
        return;
    }

    #[cfg(unix)]
    signal_process_group(child, libc::SIGTERM);
    #[cfg(not(unix))]
    let _ = child.kill();

    let deadline = std::time::Instant::now() + STOP_GRACE;
    while std::time::Instant::now() < deadline {
        if child.try_wait().ok().flatten().is_some() {
            return;
        }
        thread::sleep(Duration::from_millis(100));
    }

    #[cfg(unix)]
    signal_process_group(child, libc::SIGKILL);
    let _ = child.kill();
    let _ = child.wait();
```

</details>

**依据 7 · 源码核查**：[src-tauri/src/main.rs:4399-4414](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L4399-L4414)

退出清理与关窗hide分开。

<details>
<summary>查看原文（16行）</summary>

```text
        .run(|app_handle, event| match event {
            tauri::RunEvent::Exit => {
                println!("[dsh] exiting, stopping Remote and harness");
                stop_remote_serve_process();
                stop_lan_remote_process();
                stop_managed_child();
            }
            tauri::RunEvent::WindowEvent { label, event, .. } =>
            {
                #[cfg(target_os = "macos")]
                if label == "main" {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        if let Some(window) = app_handle.get_webview_window("main") {
                            let _ = window.hide();
                        }
```

</details>

**依据 8 · 源码核查**：[src-tauri/src/main.rs:2831-2877](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L2831-L2877)

关闭与配对撤销不同。

<details>
<summary>查看原文（47行）</summary>

```text
fn perform_lan_remote_disable(handle: tauri::AppHandle) -> Result<(), String> {
    let _operation = OperationGuard::acquire()?;
    if let Ok(mut state) = REMOTE_STATE.lock() {
        state.lan_busy = true;
        state.lan_error.clear();
    }
    LAN_REMOTE_DESIRED.store(false, Ordering::SeqCst);
    stop_lan_remote_process();
    if let Ok(mut saved) = LAN_REMOTE_TOKEN.lock() {
        *saved = None;
    }
    if let Ok(mut state) = REMOTE_STATE.lock() {
        state.lan_enabled = false;
        state.lan_busy = false;
        state.lan_endpoint.clear();
        state.lan_pairing_url.clear();
        state.lan_qr_svg.clear();
        state.lan_error.clear();
    }
    emit_remote_status(&handle);
    Ok(())
}

fn perform_lan_remote_reset(handle: tauri::AppHandle) -> Result<(), String> {
    let _operation = OperationGuard::acquire()?;
    let was_enabled = LAN_REMOTE_DESIRED.load(Ordering::SeqCst)
        && REMOTE_STATE
            .lock()
            .map(|state| state.lan_enabled)
            .unwrap_or(false);
    let harness_url = if was_enabled {
        Some(
            CURRENT_HARNESS_URL
                .lock()
                .map_err(|_| "Harness 地址锁已损坏。".to_string())?
                .clone()
                .ok_or("Harness 尚未启动完成。")?
                .parse::<tauri::Url>()
                .map_err(|error| format!("Harness 地址无效：{error}"))?,
        )
    } else {
        None
    };
    let paths = harness_paths();
    let token = rotate_lan_remote_credential(&lan_remote_credential_path(&paths.dsh_home))?;
    if let Ok(mut saved) = LAN_REMOTE_TOKEN.lock() {
        *saved = Some(token);
```

</details>

#### 缺口

- 未测打包成品/资料迁移恢复和退出工时、系统资源/模型账单或手机任务的真实结果。
  **影响**：不能保证免配置、全自动恢复、关窗就停算/撤权或统一消除所有持久资料。
  **进一步探讨**：独立home小会话核启动/迁移/无害插件故障/关窗与退出、Remote关闭/reset和强退，记录四阶段总工时/资料残留后再扩大。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 未来应补什么，不能重复算现有快照和恢复？

**研究主题**：新假设与验证、采用判断

#### 完整回答

备份、pending变更、回滚/安全模式、来源token、Remote请求缓存和未知价格展示都已存在，不能把“加日志/回滚/手机入口”当新量。当前profile晋为last-known-good的关键条件是ready后存活5秒与快照成功，不是某插件实际工具/页面结果正确。未来可为少数明确插件任务，在固定Runtime/profile/插件版本和变更事务之上绑定非破坏功能断言及恢复后再验结果，把“启动通过”“功能通过”“未验证”分开；不是称当前没有恢复工程。

用正常启动但工具缺失/结果错、安装半途退出、回滚后依赖不同和Remote回执丢失样本，比较手工官方Web、当前客户端和结果门槛版。度量误标verified、错误交付、资料丢失/重复外部动作、人工恢复与持续维护/模型成本；若只延长启动、多写状态或不减误采，则不做独立插件，先收窄现有verified文案。未实现或证实收益，不把本机存活/日志数计业务价值。

普通Host进程内插件在启动失败时未必能加载，因此这一方向更适合外部启动器/验收工具或本客户端恢复层，不应为了目录定位强行包装成DSH插件。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/main.rs:3813-3845](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L3813-L3845)

已有last-known-good和verified条件。

<details>
<summary>查看原文（33行）</summary>

```text
                    if !snapshot_attempted && ready_at.elapsed() >= SNAPSHOT_STABILITY {
                        let paths = harness_paths();
                        if read_pending_install(&paths.dsh_home)
                            .ok()
                            .flatten()
                            .and_then(|pending| pending["state"].as_str().map(str::to_string))
                            .as_deref()
                            == Some("restart-required")
                        {
                            continue;
                        }
                        snapshot_attempted = true;
                        match write_profile_snapshot(&paths.dsh_home, "last-known-good") {
                            Ok(()) => {
                                println!("[dsh] last-known-good profile snapshot saved");
                                if let Some(pending) =
                                    read_pending_install(&paths.dsh_home).ok().flatten()
                                {
                                    let label = pending_install_label(&pending);
                                    let outcome = pending_change_outcome(&pending);
                                    match clear_pending_install(&paths.dsh_home) {
                                        Ok(()) => {
                                            println!("[dsh] plugin change verified");
                                            emit_bridge_event(
                                                &handle,
                                                "plugin-verified",
                                                serde_json::json!({
                                                    "label": label,
                                                    "outcome": outcome,
                                                }),
                                            );
                                        }
                                        Err(error) => eprintln!("[dsh] warning: {error}"),
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/main.rs:4204-4260](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src-tauri/src/main.rs#L4204-L4260)

已有快照/变更事务与回滚不重复当新功能。

<details>
<summary>查看原文（57行）</summary>

```text
fn perform_plugin_install(spec: String) -> Result<serde_json::Value, String> {
    let spec = validate_plugin_spec(&spec)?;
    let _operation = OperationGuard::acquire()?;
    let paths = harness_paths();
    if read_pending_install(&paths.dsh_home)?.is_some() {
        return Err("已有一个插件等待重启验证；请先重启或撤销，再安装下一个。".into());
    }
    let before = read_web_manifest(&paths.dsh_home)?;
    let before_state = plugin_profile_state(&before);
    let before_fingerprint = plugin_state_fingerprint(&before_state);
    write_profile_snapshot(&paths.dsh_home, BEFORE_PLUGIN_INSTALL)?;
    write_pending_change(
        &paths.dsh_home,
        PendingChange {
            source: "desktop",
            spec: Some(&spec),
            state: "installing",
            packages: &[],
            changes: &[],
            rollback_snapshot: BEFORE_PLUGIN_INSTALL,
            before_fingerprint: Some(&before_fingerprint),
            after_fingerprint: None,
        },
    )?;

    let install_result = run_plugin_add(&spec).and_then(|()| {
        let after = read_web_manifest(&paths.dsh_home)?;
        let after_state = plugin_profile_state(&after);
        let changes = plugin_state_changes(&before_state, &after_state);
        if changes.is_empty() {
            return Err("安装命令完成，但 web profile 没有出现可识别的插件变化。".into());
        }
        let packages = changed_plugin_names(&changes);
        let after_fingerprint = plugin_state_fingerprint(&after_state);
        write_pending_change(
            &paths.dsh_home,
            PendingChange {
                source: "desktop",
                spec: Some(&spec),
                state: "restart-required",
                packages: &packages,
                changes: &changes,
                rollback_snapshot: BEFORE_PLUGIN_INSTALL,
                before_fingerprint: Some(&before_fingerprint),
                after_fingerprint: Some(&after_fingerprint),
            },
        )
    });

    if let Err(error) = install_result {
        let rollback = rollback_pending_install(&paths.dsh_home);
        return Err(match rollback {
            Ok(_) => format!("{error}\n\n安装产生的 profile 改动已自动撤销。"),
            Err(rollback_error) => {
                format!("{error}\n\n安装失败后的自动撤销也未完成：{rollback_error}")
            }
        });
```

</details>

**依据 3 · 源码核查**：[src/dsh-desktop-settings-plugin/lib/remote-v1.js:9-23](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/dsh-desktop-settings-plugin/lib/remote-v1.js#L9-L23)

已有receipt基础但非业务完成。

<details>
<summary>查看原文（15行）</summary>

```text
export function promptReceipts(limit = 2048) {
  const pending = new Map()
  const accepted = new Map()
  return (sessionId, requestId, admit) => {
    const key = JSON.stringify([sessionId, requestId])
    if (accepted.has(key)) return Promise.resolve(accepted.get(key))
    if (pending.has(key)) return pending.get(key)
    const receipt = Promise.resolve().then(admit).then(value => {
      accepted.set(key, value)
      if (accepted.size > limit) accepted.delete(accepted.keys().next().value)
      return value
    }).finally(() => pending.delete(key))
    pending.set(key, receipt)
    return receipt
  }
```

</details>

**依据 4 · 源码核查**：[src/usage-meter.js:505-511](https://github.com/chokwinlee/deepseek-harness-desktop/blob/1b17b8d82cd2b7d4b03fad3eade1de6bbc4acbce/src/usage-meter.js#L505-L511)

已有unknown呈现值得保留。

```text
  function costLabel(bucket, compact = false) {
    if (bucket.calls === 0) return '$0.00'
    if (bucket.unpricedCalls === bucket.calls) return t.unpriced
    const precision = bucket.cost < 0.01 ? 4 : 2
    const label = `$${bucket.cost.toFixed(precision)}`
    if (bucket.unpricedCalls > 0) return `${label}+`
    return compact ? label : `${label} USD`
```

#### 缺口

- 无功能门槛版/真实用户迁移和恢复对照。
  **影响**：不能从丰富运维状态推出插件方向已验证需求，或承诺可自动撤销外部效果。
  **进一步探讨**：限定无破坏任务与固定原件/预期输出，盲核verified误读/恢复真值和总工时，收益不成立就只改标签并停扩大。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
