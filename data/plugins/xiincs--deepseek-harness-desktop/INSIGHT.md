# DeepSeek Harness Desktop（xiincs）

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5765537](https://github.com/xiincs/deepseek-harness-desktop/tree/57655379bbab0b9ae92ff3b344126f55f12c4921)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiincs/deepseek-harness-desktop)
<!-- END META -->

> **功能**：用 Tauri 封装本地 DSH Web 服务，提供托盘常驻、文件面板、终端和确认后安装插件的入口。

> **亮点**：把DSH服务运行、文件和终端操作统一到桌面生命周期，安装区分启动与完成状态；这些是桌面适配的增量，不归因于上游模型能力。[Q01](#research-q01)

> **主要限制**：自动恢复可能移除缺失插件，文件保存直接覆盖而无版本比较；便利同时带来profile和文件状态所有权，必须核对恢复副作用。[Q03](#research-q03)

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
  - [Q01 · 桌面壳相对直接运行dsh web多负责什么？](#detail-section-11)
  - [Q02 · 市场安装与文件保存是否真正经原生通道执行？](#detail-section-12)
  - [Q03 · 自动恢复会做哪些写操作，依赖和退出边界是什么？](#detail-section-13)
  - [Q04 · 何种使用路径值得试，什么改进有依据？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地DSH用户可把启动、文件、终端和市场放到桌面壳中，核心模型与会话仍来自上游服务。[Q01](#research-q01)

浏览器加终端和编辑器可完成同类任务；本组件集中入口与托盘生命周期，未证明更快或更省资源。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面服务管理 | 启动/重启/停止DSH | 依赖runtime和实际进程所有权 |
| 文件预览保存 | 在工作区内编辑现有文件 | 路径canonical检查；直接覆盖无版本比较 |
| 确认安装 | 展示命令后执行插件add | 单飞且结果异步，不证明插件可用 |
| 终端入口 | 在壳内运行本地命令 | 拥有本地进程副作用 |
| 故障恢复 | 重启服务、清理特定残留/缺失插件 | 会改变profile，需审阅日志 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Tauri发行物与系统WebView | 必需 | 桌面壳 | 目标OS运行未知 |
| Node和DSH runtime | 服务必需 | 启动dsh web | 构建默认0.1.5-rc.2，发行物另验 |
| 模型与凭据/网络 | 任务依赖 | 上游模型工作 | 离线壳不等于模型可用 |
| pnpm和网络 | 安装插件时必需 | 官方CLI安装 | 确认前检测或返回错误 |
| 独立HOME与副本项目 | 本次试用前提 | 隔离恢复与覆盖副作用 | 不满足则暂缓 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选择发行物并隔离HOME | 保留插件清单和项目副本 |
| 启动 | 壳准备服务并显示运行/错误状态 | 启动失败读日志，不无限重试 |
| 安装或编辑 | 用户确认命令，壳执行CLI或写文件 | 分清启动与最终完成；核对文件差异 |
| 恢复与退出 | 壳限频重启，用户审阅移除日志 | 异常时退出并回原浏览器/终端 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 发行物/构建下载和宿主资源未知 | 隔离、凭据与系统允许设置 | 实际发布物未验 |
| 持续使用 | WebView、DSH、终端和模型费用未知 | 核对编辑和插件状态 | 未测小快/节时 |
| 失败恢复 | 重装插件和重启资源未知 | 审阅自动移除、处理冲突和进程树 | 不能理解为无损恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中桌面入口 | Tauri命令与UI接线 | 实际操作节时 |
| 确认安装 | 单飞、参数化CLI与完成事件 | 安装插件本身可用性 |
| 文件保存 | canonical路径范围检查 | 并发编辑冲突和原子性 |
| 服务恢复 | 限频重启与明确移除路径 | 跨系统恢复完整性 |

> **思考**：自动恢复可能移除缺失插件，文件保存直接覆盖而无版本比较；便利同时带来profile和文件状态所有权，必须核对恢复副作用。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把DSH服务运行、文件和终端操作统一到桌面生命周期，安装区分启动与完成状态；这些是桌面适配的增量，不归因于上游模型能力。[Q01](#research-q01)

single-flight在runtime解析前占位，避免并行安装竞态；安装启动/完成分离清楚。文件路径约束可借鉴，但直接写入及自动remove使恢复必须可见。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

自动恢复可能移除缺失插件，文件保存直接覆盖而无版本比较；便利同时带来profile和文件状态所有权，必须核对恢复副作用。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

只在独立HOME和副本项目试用，核对自动恢复变更与后台进程；出现非预期覆盖或移除就回到原工具与备份。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

原生安装、文件和恢复关键链有固定源码依据；跨系统发行物、数据安全和资源优势未验证，改进为假设。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、ui/app.js、scripts/prepare-runtime.mjs、src-tauri/src/server.rs、src-tauri/src/lib.rs、src-tauri/src/panel.rs、src-tauri/capabilities/default.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：补读固定Rust原生代码及capability（默认SOURCE未含Rust），装配source_paths保全；未运行Tauri、目标代码或构建，不据JS/TS统计表示Rust规模。
- 下一步：隔离HOME与副本工程验收WebView IPC边界、安装事件、并发保存、崩溃移除和真正退出的进程树；跨系统分别记录。

**分析版本**

- **仓库**：[xiincs/deepseek-harness-desktop](https://github.com/xiincs/deepseek-harness-desktop)
- **版本号**：1.5.9（[固定提交 5765537](https://github.com/xiincs/deepseek-harness-desktop/tree/57655379bbab0b9ae92ff3b344126f55f12c4921)）
- **版本日期**：2026-09-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

恢复变更预览和带版本保存可能减少无意移除/覆盖，需同故障轨迹比较损失、时间与操作负担；目前未实现或验证。[Q04](#research-q04)

隔离HOME与副本工程验收WebView IPC边界、安装事件、并发保存、崩溃移除和真正退出的进程树；跨系统分别记录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 631 | — | — | 9508 |
| .mjs | source | 4 | 371 | 219 | 117 | — |
| .js | source | 1 | 2722 | 1803 | 744 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/xiincs/deepseek-harness-desktop/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌面集中入口的便利是否能在服务所有权、文件写入和自动恢复边界清楚时成立？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面壳相对直接运行dsh web多负责什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它是Tauri桌面客户端而非DSH插件。面向希望双击启动、托盘常驻并同时查看文件和终端的本地用户。核心模型与会话由上游DSH服务提供，本组件增加服务启动/重启、窗口组织、文件编辑和确认安装入口；合格结果是用户能区分桌面壳与服务状态，文件操作落在选择的工作区，退出能清理自己拥有的进程。相比浏览器加终端，增量是把这些操作集中；README关于小和快是作者主张，没有同条件性能对照，不能把系统WebView等同于已测启动更快。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-55](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/README.md#L41-L55)

作者定位及功能主张。

<details>
<summary>查看原文（15行）</summary>

```text
## 🚀 这个应用能做什么

- **双击即用**：打开应用，自动帮你把后台服务准备好，不需要敲命令行、不需要搞懂端口是什么。
- **关窗不等于退出**：点右上角的关闭按钮只是把窗口藏起来，工作还在继续；托盘图标右键才是真的退出。
- **数据和网页版完全通用**：所有会话、配置都存在同一个地方，网页版和桌面版随便切换，互不冲突。
- **文件面板**：右侧一键唤出文件目录树，点开任意文件直接预览、编辑、保存，改动会用颜色标出来，
  不用再切去别的编辑器来回对照。
- **插件市场**：浏览、搜索、安装社区插件，目录持续更新、条目数以百计——插件来自社区众包目录，
  安装前会先给你看清楚要执行的确切命令，确认后才会真正安装，不会点一下就悄悄装上。
- **内置终端**：需要跑个命令的时候，不用再额外开一个终端窗口，应用里直接就有。
- **崩溃了自己爬起来**：后台服务万一意外挂掉，应用会自动帮你重启一次；实在起不来也会告诉你原因，
  而不是一片空白让你猜。
- **有新版本会提醒你**：打开应用时自动检查更新，一键装上，不用跑去发布页面翻。
- **体积小、开得快**：走的是系统自带的浏览器内核，不用像很多同类应用那样自带一个完整的 Chromium，
  装包小很多，打开也更快。
```

</details>

**依据 2 · 源码核查**：[package.json:1-12](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/package.json#L1-L12)

private Tauri客户端。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "dsh-desktop",
  "private": true,
  "version": "1.5.9",
  "description": "Desktop app for DeepSeek Harness (Tauri wrapper around `dsh web`)",
  "scripts": {
    "tauri": "tauri",
    "dev": "tauri dev",
    "build": "tauri build",
    "bundle": "npm run fetch:node && npm run prepare:runtime && tauri build",
    "fetch:node": "node scripts/fetch-node.mjs",
    "prepare:runtime": "node scripts/prepare-runtime.mjs",
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/lib.rs:1240-1279](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/src-tauri/src/lib.rs#L1240-L1279)

服务、文件和终端命令被注册。

<details>
<summary>查看原文（40行）</summary>

```text
        .invoke_handler(tauri::generate_handler![
            resolve_close_choice,
            get_default_workspace,
            set_default_workspace,
            get_status,
            get_info,
            start_server,
            restart_server,
            stop_server,
            get_log_tail,
            install_plugin,
            check_pnpm_available,
            install_pnpm,
            open_in_browser,
            open_external_url,
            open_data_dir,
            get_autostart_enabled,
            trigger_menu_action,
            check_for_update,
            install_update,
            get_git_status,
            get_known_workspaces,
            get_editable_preview,
            save_file_content,
            create_file,
            create_dir,
            rename_entry,
            move_entry,
            delete_entry,
            reveal_in_file_manager,
            open_with_default_app,
            get_absolute_path,
            terminal::terminal_spawn,
            terminal::terminal_write,
            terminal::terminal_resize,
            terminal::terminal_close,
            harness_set_bounds,
            harness_show,
            harness_reveal,
            harness_hide
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 市场安装与文件保存是否真正经原生通道执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

UI确认视图从候选安装字段取包参数，点击后invoke install_plugin；invoke成功只表示子进程启动，最终完成经事件返回。Rust对安装设single-flight占位，在解析runtime前就阻止第二个安装，用Command参数传node、bin、plugin --profile web add -w和一个package参数，未通过shell拼接候选。文件保存先将根和目标canonicalize，拒绝目标不在根下，然后直接fs::write现有文件；错误返回，但未见版本比较或原子替换，所以同文件外部更改可能被覆盖。远程DSH页面与壳分离的WebView和本地capability配置体现IPC隔离意图，不能据此宣称完整安全。

#### 证据与依据

**依据 1 · 源码核查**：[ui/app.js:1531-1552](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/ui/app.js#L1531-L1552)

确认触发及启动/完成分离。

<details>
<summary>查看原文（22行）</summary>

```text
// Fires only from the confirm view's own button — never directly off a
// grid card — so every install has already shown its exact command next to
// the standing third-party-code warning before this runs.
async function installConfirmedPlugin() {
  const plugin = pluginConfirmTarget;
  if (!plugin) return;
  const pkg = packageFromInstallCommand(plugin.install);
  els.btnPluginConfirmInstall.disabled = true;
  setInstallButtonState("loader", t("installing"));
  pluginInstallButton = els.btnPluginConfirmInstall;
  showPluginInstallLog();
  appendPluginInstallLog(`$ dsh plugin --profile web add ${pkg}`);
  try {
    await invoke("install_plugin", { package: pkg });
  } catch (err) {
    appendPluginInstallLog(t("installStartFailed", err));
    resetPluginInstallButton();
  }
  // On success, re-enabling the button happens in the "plugin-install"
  // event listener below, keyed on the Done event — the invoke() call
  // above only confirms the child process *started*, not that `pnpm add`
  // itself finished.
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/server.rs:640-695](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/src-tauri/src/server.rs#L640-L695)

single-flight与命令参数。

<details>
<summary>查看原文（56行）</summary>

```text
pub fn install_plugin(app: &AppHandle, server: &Shared, package: &str) -> Result<(), String> {
    let lang = i18n::detect();
    {
        let mut s = server.lock().unwrap();
        if s.plugin_install_pid.is_some() {
            return Err(i18n::tr(
                lang,
                "已有插件正在安装，请等待完成后再试。",
                "A plugin install is already in progress — wait for it to finish first.",
            )
            .to_string());
        }
        // Reserved with a placeholder before resolve_node/resolve_bin (which
        // can themselves install the runtime and take a while) so a second
        // call arriving during that window is still rejected, not raced.
        s.plugin_install_pid = Some(0);
    }

    let node = match resolve_node(app) {
        Ok(v) => v,
        Err(e) => {
            server.lock().unwrap().plugin_install_pid = None;
            return Err(e);
        }
    };
    let bin = match resolve_bin(app, server) {
        Ok(v) => v,
        Err(e) => {
            server.lock().unwrap().plugin_install_pid = None;
            return Err(e);
        }
    };

    let mut cmd = Command::new(&node);
    // -w (forwarded to pnpm as --workspace-root): dsh scaffolds every
    // profile directory as a single-package pnpm workspace (`packages: [.]`
    // in its own generated pnpm-workspace.yaml — not something dsh-desktop
    // creates), and dsh's own `plugin add` never passes pnpm the flag that
    // acknowledges this. Without it, pnpm refuses outright with
    // ERR_PNPM_ADDING_TO_ROOT ("Running this command will add the
    // dependency to the workspace root... if you really meant it, make it
    // explicit by running this command again with the -w flag") — every
    // plugin-market install fails this way on the currently pinned dsh
    // version. Confirmed directly (`dsh plugin --profile web add -w
    // <pkg>` against a real profile) before adding: installs cleanly.
    // `dsh plugin`'s own arguments are forwarded to pnpm verbatim, so this
    // rides along with no other change needed. `heal_missing_plugin`'s
    // `remove` doesn't need the same flag — pnpm's workspace-root guard
    // only exists for `add` (which package.json would a *new* dependency
    // even go into?); removing an already-declared one is unambiguous.
    cmd.arg(&bin).arg("plugin").arg("--profile").arg("web").arg("add").arg("-w").arg(package);
    // Same PATH rebuild as the server process itself — pnpm needs a real
    // PATH to find node/git, not whatever this GUI process happened to
    // inherit at launch. See `effective_path`'s own doc comment.
    cmd.env("PATH", effective_path());
    cmd.stdin(Stdio::null()).stdout(Stdio::piped()).stderr(Stdio::piped());
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/panel.rs:425-461](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/src-tauri/src/panel.rs#L425-L461)

路径约束及直接覆盖。

<details>
<summary>查看原文（37行）</summary>

```text
fn resolve_within_root(root: &Path, rel_path: &str) -> Result<PathBuf, String> {
    let lang = crate::i18n::detect();
    let candidate = root.join(rel_path);
    let root_canon = root.canonicalize().map_err(|e| {
        if lang == crate::i18n::Lang::En {
            format!("Failed to resolve workspace path: {e}")
        } else {
            format!("无法解析工作区路径: {e}")
        }
    })?;
    let candidate_canon = candidate.canonicalize().map_err(|e| {
        if lang == crate::i18n::Lang::En {
            format!("Failed to resolve file path: {e}")
        } else {
            format!("无法解析文件路径: {e}")
        }
    })?;
    if !candidate_canon.starts_with(&root_canon) {
        return Err(crate::i18n::tr(lang, "路径超出工作区范围", "Path is outside the workspace").to_string());
    }
    Ok(candidate_canon)
}

/// Overwrites an existing file's content. Refuses to create a new file
/// (`resolve_within_root`'s `canonicalize()` requires the target to already
/// exist) — this is an edit-and-save path for a file the tree already
/// listed, not a general file-creation API.
pub fn save_file(root: &Path, rel_path: &str, content: &str) -> Result<(), String> {
    let lang = crate::i18n::detect();
    let full_path = resolve_within_root(root, rel_path)?;
    fs::write(&full_path, content).map_err(|e| {
        if lang == crate::i18n::Lang::En {
            format!("Save failed: {e}")
        } else {
            format!("保存失败: {e}")
        }
    })
```

</details>

**依据 4 · 源码核查**：[src-tauri/capabilities/default.json:1-13](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/src-tauri/capabilities/default.json#L1-L13)

本地壳capability。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Capabilities for the local boot page in the main window. The remote dsh page (http://127.0.0.1:<port>) is never granted IPC access.",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "core:window:allow-minimize",
    "core:window:allow-toggle-maximize",
    "core:window:allow-close",
    "core:window:allow-start-dragging"
  ]
}
```

</details>

#### 缺口

- 未运行WebView能力边界与外部并发改文件情形。
  **影响**：不能确认实际平台隔离及覆盖冲突时用户是否得到充分提醒。
  **进一步探讨**：固定发行物核对远程页面无IPC，并在文件外部修改后检查保存冲突提示。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动恢复会做哪些写操作，依赖和退出边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

后台退出后按最小间隔决定自动重启，间隔内再次失败显示需手动重试，因此不是无限重启。恢复不仅重启：代码可删除预期目录内的空普通目录，并在检测市场插件文件缺失时调用web profile remove移除插件，日志说明需重装。恢复会改变profile依赖，用户必须核对日志，不能理解为无损回到旧态。默认构建脚本安装DSH 0.1.5-rc.2或复制提供的runtime，bundled源码不证明发布物完整或与当前网页DSH一致。Tauri、系统WebView、Node/runtime及插件安装所需pnpm/网络都是前提；关闭窗口与真正退出含不同生命周期，不能据界面消失认为后台任务已停止。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/server.rs:928-958](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/src-tauri/src/server.rs#L928-L958)

限定空目录自动清理。

<details>
<summary>查看原文（31行）</summary>

```text
fn heal_stale_symlink(app: &AppHandle, server: &Shared, path: &Path) -> bool {
    let expected_prefix = dsh_home_dir(app).join("profiles").join("node_modules").join("@deepseek-ai");
    if !path.starts_with(&expected_prefix) {
        push_log(server, format!("跳过自动清理（路径不在预期范围内）：{}", path.display()));
        return false;
    }
    let meta = match fs::symlink_metadata(path) {
        Ok(m) => m,
        Err(_) => return false, // already gone (e.g. a stale re-detection of an earlier heal)
    };
    if meta.file_type().is_symlink() || !meta.is_dir() {
        push_log(server, format!("跳过自动清理（不是预期的普通目录）：{}", path.display()));
        return false;
    }
    let is_empty = fs::read_dir(path).map(|mut it| it.next().is_none()).unwrap_or(false);
    if !is_empty {
        push_log(server, format!("跳过自动清理（目录非空，可能有需要保留的内容）：{}", path.display()));
        return false;
    }
    match fs::remove_dir(path) {
        Ok(()) => {
            push_log(
                server,
                format!("已自动清理残留目录（dsh 将在下次启动时重建为符号链接）：{}", path.display()),
            );
            true
        }
        Err(e) => {
            push_log(server, format!("自动清理残留目录失败：{} ({e})", path.display()));
            false
        }
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/server.rs:1026-1059](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/src-tauri/src/server.rs#L1026-L1059)

缺失插件自动remove及日志。

<details>
<summary>查看原文（34行）</summary>

```text
fn heal_missing_plugin(server: &Shared, node: &str, bin: &str, name: &str) -> bool {
    {
        let mut s = server.lock().unwrap();
        if s.plugin_install_pid.is_some() {
            return false;
        }
        s.plugin_install_pid = Some(0);
    }
    push_log(server, format!("检测到插件 {name} 的文件缺失，正在自动移除以恢复启动…"));
    let mut cmd = Command::new(node);
    cmd.arg(bin).arg("plugin").arg("--profile").arg("web").arg("remove").arg(name);
    cmd.env("PATH", effective_path());
    cmd.stdin(Stdio::null()).stdout(Stdio::null()).stderr(Stdio::null());
    own_process_group(&mut cmd);
    hide_console(&mut cmd);
    let result = cmd.status();
    server.lock().unwrap().plugin_install_pid = None;
    match result {
        Ok(status) if status.success() => {
            push_log(
                server,
                format!("已自动移除插件 {name}（文件缺失，可能是安装未完成或被外部程序删除）。如需继续使用请重新安装。"),
            );
            true
        }
        Ok(status) => {
            push_log(server, format!("自动移除插件 {name} 失败(exit {:?})。", status.code()));
            false
        }
        Err(e) => {
            push_log(server, format!("自动移除插件 {name} 失败：{e}"));
            false
        }
    }
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/server.rs:1458-1488](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/src-tauri/src/server.rs#L1458-L1488)

重启限频与手动失败状态。

<details>
<summary>查看原文（31行）</summary>

```text
        let allow_restart = {
            let s = srv4.lock().unwrap();
            match s.last_auto_restart {
                Some(t) => t.elapsed() >= AUTO_RESTART_MIN_GAP,
                None => true,
            }
        };
        if allow_restart {
            {
                let mut s = srv4.lock().unwrap();
                s.last_auto_restart = Some(Instant::now());
            }
            set_status(
                &app3,
                &srv4,
                ServerStatus::Error {
                    message: if lang == Lang::En {
                        format!("dsh service exited unexpectedly (exit {code:?}) — restarting automatically in 1s…")
                    } else {
                        format!("dsh 服务异常退出 (exit {code:?})，1 秒后自动重启…")
                    },
                },
            );
            thread::sleep(Duration::from_secs(1));
            let _ = start(&app3, &srv4);
        } else {
            let status = ServerStatus::Error {
                message: if lang == Lang::En {
                    format!("dsh service exited unexpectedly (exit {code:?}). Automatic restart has stopped — retry manually.")
                } else {
                    format!("dsh 服务异常退出 (exit {code:?})，自动重启已停止，请手动重试。")
```

</details>

**依据 4 · 源码核查**：[scripts/prepare-runtime.mjs:1-35](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/scripts/prepare-runtime.mjs#L1-L35)

默认runtime与复制/安装。

<details>
<summary>查看原文（35行）</summary>

```text
// Installs the @deepseek-ai/dsh production dependency tree into
// src-tauri/resources/runtime so packaged builds can serve the harness
// without a network connection or a system npm. Part of the "bundled runtime"
// milestone.
//
// Usage: node scripts/prepare-runtime.mjs
// Env:   DSH_DESKTOP_DSH_VERSION  npm version spec (default 0.1.5-rc.2, which
//                                 tracks npm's `latest`; keep in step with
//                                 server.rs's DSH_VERSION_DEFAULT —
//                                 check-dsh-version.mjs cross-checks the two)
//        DSH_RUNTIME_SOURCE       directory containing node_modules/@deepseek-ai/dsh
//                                 (e.g. an existing npx cache root) — copies it
//                                 locally instead of hitting the npm registry.

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const runtimeDir = join(root, "src-tauri", "resources", "runtime");
const version = process.env.DSH_DESKTOP_DSH_VERSION ?? "0.1.5-rc.2";
mkdirSync(runtimeDir, { recursive: true });

const source = process.env.DSH_RUNTIME_SOURCE;
const sourceBin = source
  ? join(source, "node_modules", "@deepseek-ai", "dsh", "lib", "bin.js")
  : null;
if (sourceBin && existsSync(sourceBin)) {
  console.log(`Copying runtime from DSH_RUNTIME_SOURCE: ${source}`);
  cpSync(join(source, "node_modules"), join(runtimeDir, "node_modules"), {
    recursive: true,
    force: true,
  });
} else {
```

</details>

#### 缺口

- 发行物runtime、退出进程树和目标OS表现未验收。
  **影响**：不能保证现有会话、插件和终端退出后全部保留或停止。
  **进一步探讨**：在隔离DSH_HOME记录子进程、插件清单和关闭/退出/崩溃后的状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何种使用路径值得试，什么改进有依据？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

首次需要对应系统发行物与模型凭据，构建还要Rust/Tauri、Node与下载；持续有DSH、终端和WebView资源以及模型费用，时间金额未知。桌面集中入口可能减少窗口切换，但恢复时核对移除插件和编辑覆盖会增加人工负担。可在独立HOME和副本工作区做小范围试用，保留浏览器/终端退路；重要数据先不交给未经验证的保存与恢复链。由Q02/Q03可提出恢复前预览变更、文件保存带版本校验的未验证假设，在同一崩溃/并发编辑轨迹中比较误覆盖、恢复时间和人工动作；不能降低损失或增加明显负担则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/panel.rs:452-461](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/src-tauri/src/panel.rs#L452-L461)

直接写入现有文件。

<details>
<summary>查看原文（10行）</summary>

```text
pub fn save_file(root: &Path, rel_path: &str, content: &str) -> Result<(), String> {
    let lang = crate::i18n::detect();
    let full_path = resolve_within_root(root, rel_path)?;
    fs::write(&full_path, content).map_err(|e| {
        if lang == crate::i18n::Lang::En {
            format!("Save failed: {e}")
        } else {
            format!("保存失败: {e}")
        }
    })
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/server.rs:1034-1048](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/src-tauri/src/server.rs#L1034-L1048)

恢复会移除插件。

<details>
<summary>查看原文（15行）</summary>

```text
    push_log(server, format!("检测到插件 {name} 的文件缺失，正在自动移除以恢复启动…"));
    let mut cmd = Command::new(node);
    cmd.arg(bin).arg("plugin").arg("--profile").arg("web").arg("remove").arg(name);
    cmd.env("PATH", effective_path());
    cmd.stdin(Stdio::null()).stdout(Stdio::null()).stderr(Stdio::null());
    own_process_group(&mut cmd);
    hide_console(&mut cmd);
    let result = cmd.status();
    server.lock().unwrap().plugin_install_pid = None;
    match result {
        Ok(status) if status.success() => {
            push_log(
                server,
                format!("已自动移除插件 {name}（文件缺失，可能是安装未完成或被外部程序删除）。如需继续使用请重新安装。"),
            );
```

</details>

**依据 3 · 作者声明**：[README.md:64-68](https://github.com/xiincs/deepseek-harness-desktop/blob/57655379bbab0b9ae92ff3b344126f55f12c4921/README.md#L64-L68)

作者声明系统分发与更新差异。

```text
| Windows | `.exe` | 已签名，支持自动更新，双击安装即可 |
| macOS | `.dmg` | 首次打开需要在「系统设置 → 隐私与安全性」里手动允许一次（未加入 Apple 开发者计划，属正常现象） |
| Linux | `.deb` | `dpkg -i` 或用系统自带的安装器打开即可 |

> macOS / Linux 版暂不支持自动更新，有新版本时需要自己回来这个页面重新下载。
```

#### 缺口

- 没有桌面与浏览器/终端同任务的资源、时间和恢复对照。
  **影响**：不能量化便利或证明总负担更低。
  **进一步探讨**：用副本项目测操作时间、资源与错误恢复，改进原型另做同轨迹对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
