# DSH Desktop

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[4e9c611](https://github.com/web-casa/DeepSeek-Harness-Desktop/tree/4e9c6113c475cb94ebffd3ba83828875361f3b16)

<!-- BEGIN META -->
[![GitHub ★ 128](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=128&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/web-casa/DeepSeek-Harness-Desktop)
<!-- END META -->

> **功能**：通过桌面控制器与 sidecar 启停内置 DeepSeek Harness，并管理插件和预设。

> **亮点**：[Q01](#research-q01) 将固定运行时及其就绪状态接到桌面界面。

> **主要限制**：[Q02](#research-q02) IPC 限制和宿主插件权限分开，卸载也有中间态。

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
  - [Q01 · 桌面如何启动内置宿主？](#detail-section-11)
  - [Q02 · 窗口隔离和卸载边界？](#detail-section-12)
  - [Q03 · 如何安全试用和退出？](#detail-section-13)
  - [Q04 · 怎样减少卸载状态误判？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望用独立桌面应用管理 DSH 启动和插件的用户。

通过命令行启动 DSH 并手工管理 profile。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 控制器 | 启停内置 DSH | 取决于固定平台制品 |
| 插件管理 | 操作 Web profile | 已执行步骤需读回 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 固定平台制品 | 必需 | 提供应用与运行时 | 继续用 CLI |
| 独立 profile | 隔离验证需要 | 保护原数据 | 暂停测试 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核对发行物及目录 | 确认版本 |
| 验证 | 测试启动、停止与惰性包 | 读回状态 |
| 退出 | 关闭应用并查进程 | 保留原 CLI |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 运行时资源未知 | 准备独立数据 | 未测 |
| 持续 | 进程与更新成本未知 | 检查插件和诊断 | 需实测 |
| 恢复 | 重装成本未知 | 核对预禁用与依赖 | 按状态恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 桌面启动 | 动态回环服务与就绪 | 平台实际兼容 |
| 插件管理 | 精确预禁用 | 异常恢复 |

> **思考**：[Q02](#research-q02) IPC 限制和宿主插件权限分开，卸载也有中间态。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将固定运行时及其就绪状态接到桌面界面。

[Q01](#research-q01) 固定版本与运行时就绪分离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) IPC 限制和宿主插件权限分开，卸载也有中间态。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先验证固定制品。[Q02](#research-q02) 失败后检查实际包状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定代表源码核对，未运行桌面或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、crates/dsh-sidecar/src/main.rs、runtime/runtime-manifest.json、src-tauri/capabilities/harness.json、src-tauri/src/harness/mod.rs、src-tauri/src/plugins.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定桌面、sidecar 和插件管理代表源码，未执行。
- 下一步：核对动态端口、IPC、精确卸载与退出。

**分析版本**

- **仓库**：[web-casa/DeepSeek-Harness-Desktop](https://github.com/web-casa/DeepSeek-Harness-Desktop)
- **版本号**：0.2.18（[固定提交 4e9c611](https://github.com/web-casa/DeepSeek-Harness-Desktop/tree/4e9c6113c475cb94ebffd3ba83828875361f3b16)）
- **版本日期**：2026-08-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将包操作的中间状态明确展示。

核对动态端口、IPC、精确卸载与退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 44 | 6984 | — | — | 47816 |
| .ts | source | 82 | 12195 | 10158 | 1166 | — |
| .ts | test | 34 | 3113 | 2908 | 46 | — |
| .mjs | source | 1 | 116 | 101 | 9 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/web-casa/DeepSeek-Harness-Desktop/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立桌面启动和插件管理有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面如何启动内置宿主？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

希望以图形界面管理 DSH 的开发者，可由独立桌面端维护本地运行时。固定清单分别列 Desktop、Harness、Node 和 sidecar 版本；启动消息将 DSH Web 绑定回环动态端口，sidecar 解析特定就绪文本的端口。相比手工开终端，应用把启动与本地 Web 入口连接起来，仍依赖上游 DSH 提供模型及工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:112-132](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/README.md#L112-L132)

作者说明组件分层

<details>
<summary>查看原文（21行）</summary>

````text
## 架构

```
Tauri 2 壳
 ├─ bootstrap 窗口：本地 Svelte UI · 有限桌面 IPC（ACL 授权）
 └─ harness 窗口：http://127.0.0.1:<随机端口> · 原版 Harness Web UI · 零 IPC
        │ NDJSON (stdin/stdout)
dsh-sidecar（Rust，无重依赖）
 ├─ 启动/停止/重启 · readiness · 挂死心跳 · 树清理
 └─ Unix process group / Windows Job Object
        │
内置 Node 24 + @deepseek-ai/dsh（pin 版本）
 └─ node lib/bin.js web --host 127.0.0.1 --port 0 · DSH_HOME 与 CLI 隔离
```

## 核心原则

1. **不 fork**：只 pin `@deepseek-ai/dsh`，上游发版 = 改版本号 + CI 冒烟。
2. **不改 Web UI**：直接加载原版 UI，`--port 0` + readiness 行即握手协议。
3. **安全边界**：harness 窗口 capability 为空集；桌面命令经 app ACL 仅授 bootstrap。
4. **版本单一事实源**：`runtime/runtime-manifest.json`。
````

</details>

**依据 2 · 源码核查**：[runtime/runtime-manifest.json:1-14](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/runtime/runtime-manifest.json#L1-L14)

固定版本和运行时哈希

<details>
<summary>查看原文（14行）</summary>

```text
{
  "desktopVersion": "0.2.18",
  "harnessVersion": "0.1.1-rc.2",
  "nodeVersion": "24.19.0",
  "sidecarVersion": "0.2.7",
  "nodeSha256": {
    "win32-x64": "57f71ab3652e797d84acddc79c81cc9ff1c6ddb2a1974cdb83f00fee9bff4c73",
    "darwin-arm64": "8294b7aa9b03997481c06babf1e8b270c859358f27da57a11509afe537ac381d",
    "darwin-x64": "d1b5e999db158c62fe8f7267a4476b035d8bd93b1a605bac24a3f0dd166e3316",
    "linux-x64": "14b342e71204f811bde6153be8e04b62aef63c236fef92b55f9c83154b409647",
    "linux-arm64": "01443c1e1a29e531ccad5a46fefa6df490d2189c49f7955904aecdbb0fe86fdc",
    "win32-arm64": "8502f4a50b458d4cc38ed8f2001556c2cd239d464920f74017926ccb1e1c157f"
  }
}
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/harness/mod.rs:1029-1043](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/src-tauri/src/harness/mod.rs#L1029-L1043)

实际启动参数

<details>
<summary>查看原文（15行）</summary>

```text
        .join("dsh")
        .join("lib")
        .join("bin.js");
    let cmd = serde_json::json!({
        "id": CMD_ID_START,
        "command": "start",
        "node": paths.node,
        "script": dsh_bin,
        "args": ["web", "--no-open", "--host", "127.0.0.1", "--port", "0"],
        "cwd": paths.harness_dir,
        // DSH_HOME: the harness' own data root. DSH_TELEMETRY_DISABLED:
        // upstream dsh honors any non-empty value by disabling the
        // session-telemetry row — a community wrapper defaults to OFF.
        "env": { "DSH_HOME": paths.dsh_home, "DSH_TELEMETRY_DISABLED": "1" },
    });
```

</details>

**依据 4 · 源码核查**：[crates/dsh-sidecar/src/main.rs:113-134](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/crates/dsh-sidecar/src/main.rs#L113-L134)

就绪 URL 提取

<details>
<summary>查看原文（22行）</summary>

```text
/// Extract `http://127.0.0.1:<port>` from the official readiness line:
/// `dsh web: http://127.0.0.1:49321` (optionally with a ` (LAN: …)` suffix).
pub fn extract_local_url(line: &str) -> Option<String> {
    const MARKER: &str = "dsh web: http://127.0.0.1:";
    let idx = line.find(MARKER)?;
    let rest = &line[idx + MARKER.len()..];
    let digits: String = rest.chars().take_while(|c| c.is_ascii_digit()).collect();
    if digits.is_empty() {
        return None;
    }
    // Port must be followed by end of line or the documented " (LAN: …)"
    // suffix — arbitrary trailing text must never count as readiness.
    let tail = &rest[digits.len()..];
    if !tail.is_empty() && !tail.starts_with(" (LAN: ") {
        return None;
    }
    let port: u16 = digits.parse().ok()?;
    if port == 0 {
        return None;
    }
    Some(format!("http://127.0.0.1:{port}"))
}
```

</details>

#### 缺口

- 未启动桌面应用或验证制品
  **影响**：不能确认目标系统服务就绪
  **进一步探讨**：固定制品和虚拟 profile 核对启动与停止

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 窗口隔离和卸载边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

harness 窗口 capability 列表为空，限定桌面 IPC 的声明面；页面仍通过 HTTP 使用 DSH，已装插件仍由宿主运行。卸载前检查指定名字及是否为已声明 Web profile 依赖，随后仅去除该包的 bundle 条目。预禁用与包移除是不同步骤，若后者失败，应读回配置和依赖，不能把前者成功当作已卸载。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/capabilities/harness.json:1-7](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/src-tauri/capabilities/harness.json#L1-L7)

窗口权限声明

```text
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "harness",
  "description": "The remote Harness WebView (http://127.0.0.1:<port>). Deliberately empty: this webview has NO IPC surface — no core modules, no app commands, no shell/fs/process. It can only talk HTTP to the local Harness server.",
  "windows": ["harness"],
  "permissions": []
}
```

**依据 2 · 源码核查**：[src-tauri/src/plugins.rs:930-968](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/src-tauri/src/plugins.rs#L930-L968)

精确预禁用判据与写入

<details>
<summary>查看原文（39行）</summary>

```text
/// Uninstall is exposed over IPC, so it must not let a caller disable an
/// in-box bundle merely by naming it. Require a real, non-empty dependency
/// entry before applying the exact pre-disable mutation; a missing installed
/// tree is still removable so broken installations remain recoverable.
pub fn pre_disable_installed_plugin(dsh_home: &Path, package_name: &str) -> Result<(), String> {
    if !is_valid_package_name(package_name) {
        return Err("cannot pre-disable an invalid plugin package name".to_string());
    }
    let (profile, mut manifest) = read_profile_manifest(dsh_home)?;
    let installed = profile_dependencies(&manifest)?
        .get(package_name)
        .and_then(Value::as_str)
        .is_some_and(|spec| !spec.is_empty());
    if !installed {
        return Err(format!(
            "plugin {package_name} is not an installed web-profile dependency"
        ));
    }
    pre_disable_profile_bundle(&profile, &mut manifest, package_name)
}

fn pre_disable_profile_bundle(
    profile: &Path,
    manifest: &mut Value,
    package_name: &str,
) -> Result<(), String> {
    let bundles = profile_bundles_mut(manifest)?;
    for bundle in bundles.iter() {
        if bundle.as_str().is_none() {
            return Err("web profile bundles contains a non-string value".to_string());
        }
    }
    let before = bundles.len();
    bundles.retain(|bundle| bundle.as_str() != Some(package_name));
    if bundles.len() != before {
        write_profile_manifest(profile, manifest)?;
    }
    Ok(())
}
```

</details>

**依据 3 · 作者声明**：[README.md:79-96](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/README.md#L79-L96)

作者说明后续包移除与重启

<details>
<summary>查看原文（18行）</summary>

````text
## ✨ 插件生态

Harness 的技能、工具、模型路由、MCP、预设——**全部是 Cordis 插件**。

**发现**：设置页「资源」一键打开插件市场 [cordis.run](https://cordis.run)。

**安装**：设置页「插件（用户安装）」输入 npm 包名即可安装、卸载。安装复用官方 `dsh plugin --profile web add`；卸载先精确 pre-disable 目标，再用随包 pnpm 关闭 lifecycle script 后直接移除，避免上游全局 reconcile 意外启用另一个仍处于 pending 的市场插件。CLI 与 pnpm 均随包携带（**无需系统 pnpm**），带实时日志与取消（整棵 node → dsh/pnpm 进程树一并清理）。

从 cordis.run 插件详情页点「安装到桌面版」会用 `dsharness://plugin/install?v=1&name=<包名>&source=<插件页>` 唤起桌面版；桌面版在 Rust 侧严格校验协议后，仅将链接定位到对应市场 slug，并重新拉取详情、核对当前 `entryRevision` 与嵌套 source，再由用户确认安装（旧版本桌面版或不支持的市场页仍可复制包名粘贴安装）。命令行等价路径（高级用法）：

```bash
# macOS
DSH_HOME="<诊断页 dshHome>" node "/Applications/DSH Desktop.app/Contents/Resources/runtime/harness/node_modules/@deepseek-ai/dsh/lib/bin.js" plugin --profile web add <包名>
# Windows PowerShell
$env:DSH_HOME="<诊断页 dshHome>"; node "<安装目录>\runtime\harness\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add <包名>
```

插件装入 `<dshHome>/profiles/web/`（用户数据目录，不写安装目录），装完在应用里「重新启动 Harness」生效。
````

</details>

**依据 4 · 作者声明**：[README.md:104-110](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/README.md#L104-L110)

日志与插件信任范围

```text
### 详细诊断（主动开启）

控制器默认只持久化有界的生命周期事实。遇到需要更完整错误线索的问题，可开启**详细诊断**、重启 Harness 后复现。开启期间，Desktop 只在本地记录尽力脱敏且有界的 Harness/插件 **stderr** 与 Desktop 自身错误；不会记录 Harness stdout、会话、提示词或工作区文件，也不会上传任何数据。只有你显式选择导出诊断 zip 时，这些记录才会进入压缩包。问题排查完成后请关闭该模式，并在不再需要导出包时使用「清除详细日志」；stderr 仍可能包含私密信息，分享前请逐项检查。

**预设**（`.dshpreset`）：把一组插件行打包成可分享的智能体配置。设置页提供安全导入/导出/删除——路径/符号链接/配额/密钥扫描 → 两阶段确认 → 原子安装到 `<dshHome>/.agent-presets/`，Harness 设置页立即可见。设置页还逐次复核预设根健康：损坏（`agent.cordis.yml` 缺失/不可读/为空，上游会拒绝挂载）、不安全（符号链接等上游跳过但占用 id 的条目）、缺元数据（`preset.yml`）即时可见并可删除。删除预设前请留意：桌面层直接移除目录，不清理 Harness 的默认预设设置——若删除的是当前默认预设，需在 Harness 设置页改选默认，否则下次会话可能无法启动。

> ⚠️ **信任模型**：插件与预设运行在 Harness 进程内，**与 Agent 同权限**。桌面校验拦截恶意构造的压缩包，拦不住内容有害的可信包——只安装可信来源。详见 [SECURITY.md](SECURITY.md)。
```

#### 缺口

- 未验证 IPC 实际拦截、故障和包代码
  **影响**：不能证明受限窗口覆盖宿主所有权限
  **进一步探讨**：以惰性插件验证卸载失败、后续恢复和跨窗调用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何安全试用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

选与平台匹配的固定发行物，核对内置版本和独立 DSH_HOME。用合成配置试启动、停止和一项无副作用的本地操作，再判断是否迁移真实 profile。初次和长期成本来自本机运行时、更新与诊断，详细日志启用时仍需检查敏感内容。出现兼容或配置变化时退出桌面应用，保留原 CLI 并核对进程、数据目录和包状态。

#### 证据与依据

**依据 1 · 源码核查**：[runtime/runtime-manifest.json:1-14](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/runtime/runtime-manifest.json#L1-L14)

组件版本

<details>
<summary>查看原文（14行）</summary>

```text
{
  "desktopVersion": "0.2.18",
  "harnessVersion": "0.1.1-rc.2",
  "nodeVersion": "24.19.0",
  "sidecarVersion": "0.2.7",
  "nodeSha256": {
    "win32-x64": "57f71ab3652e797d84acddc79c81cc9ff1c6ddb2a1974cdb83f00fee9bff4c73",
    "darwin-arm64": "8294b7aa9b03997481c06babf1e8b270c859358f27da57a11509afe537ac381d",
    "darwin-x64": "d1b5e999db158c62fe8f7267a4476b035d8bd93b1a605bac24a3f0dd166e3316",
    "linux-x64": "14b342e71204f811bde6153be8e04b62aef63c236fef92b55f9c83154b409647",
    "linux-arm64": "01443c1e1a29e531ccad5a46fefa6df490d2189c49f7955904aecdbb0fe86fdc",
    "win32-arm64": "8502f4a50b458d4cc38ed8f2001556c2cd239d464920f74017926ccb1e1c157f"
  }
}
```

</details>

**依据 2 · 作者声明**：[README.md:67-77](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/README.md#L67-L77)

作者的平台更新及诊断

<details>
<summary>查看原文（11行）</summary>

```text
## 特性一览

| | |
|---|---|
| 🔌 **插件生态** | Cordis 插件体系随包携带；插件市场浏览/搜索/一键安装；预设安全导入导出；离线 `.tgz` 侧载 |
| 🔄 **自动更新**（Windows NSIS） | x64/ARM64 更新包各自由内嵌 minisign 公钥校验；MSI、Microsoft Store、Snap、macOS 与其他 Linux 格式走其各自安全更新路径 |
| 💓 **挂死自愈** | 心跳检测 Harness「活着但无响应」并自动重启（退避+上限） |
| 🛡️ **安全边界** | Harness 窗口零 IPC 权限；桌面命令仅授权本地窗口；环境消毒 |
| 🔒 **隐私默认值** | 会话遥测默认关闭；子进程环境消毒（NODE_OPTIONS/loader 注入键等） |
| 🧰 **诊断与反馈** | 一键导出诊断 zip（尽力脱敏）、复制诊断、预填 issue 报告；用户显式开启后可为一次复现保留有界的本地 stderr/Desktop 错误证据 |
| 🪟 **桌面体验** | 单实例、窗口状态记忆、崩溃自动恢复、macOS 关闭=隐藏；托盘按 Harness 实时状态安全开放控制器/Harness、启动/重启与停止；控制器、托盘与 macOS 菜单可跟随系统语言或手选简体中文 / English，窗口标题同步但产品名保持 DSH Desktop |
```

</details>

**依据 3 · 作者声明**：[README.md:96-110](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/README.md#L96-L110)

数据路径与诊断代价

<details>
<summary>查看原文（15行）</summary>

```text
插件装入 `<dshHome>/profiles/web/`（用户数据目录，不写安装目录），装完在应用里「重新启动 Harness」生效。

如果升级中断或手动删除过插件文件，控制器会只读检查「`package.json` 仍声明、
直接包入口却缺失」的 Web profile 漂移。它绝不自动改写用户配置；只有能够证明
为无自定义配置、且属于**未启用包**的简单 `cordis.patch.yml` 条目时，才会展示逐项
预览并要求再次确认后移除该条目。已启用 bundle、符号链接、复杂 YAML 与其他不确定
状态只报告，留给 Harness 的安全恢复流程或用户人工处理。

### 详细诊断（主动开启）

控制器默认只持久化有界的生命周期事实。遇到需要更完整错误线索的问题，可开启**详细诊断**、重启 Harness 后复现。开启期间，Desktop 只在本地记录尽力脱敏且有界的 Harness/插件 **stderr** 与 Desktop 自身错误；不会记录 Harness stdout、会话、提示词或工作区文件，也不会上传任何数据。只有你显式选择导出诊断 zip 时，这些记录才会进入压缩包。问题排查完成后请关闭该模式，并在不再需要导出包时使用「清除详细日志」；stderr 仍可能包含私密信息，分享前请逐项检查。

**预设**（`.dshpreset`）：把一组插件行打包成可分享的智能体配置。设置页提供安全导入/导出/删除——路径/符号链接/配额/密钥扫描 → 两阶段确认 → 原子安装到 `<dshHome>/.agent-presets/`，Harness 设置页立即可见。设置页还逐次复核预设根健康：损坏（`agent.cordis.yml` 缺失/不可读/为空，上游会拒绝挂载）、不安全（符号链接等上游跳过但占用 id 的条目）、缺元数据（`preset.yml`）即时可见并可删除。删除预设前请留意：桌面层直接移除目录，不清理 Harness 的默认预设设置——若删除的是当前默认预设，需在 Harness 设置页改选默认，否则下次会话可能无法启动。

> ⚠️ **信任模型**：插件与预设运行在 Harness 进程内，**与 Agent 同权限**。桌面校验拦截恶意构造的压缩包，拦不住内容有害的可信包——只安装可信来源。详见 [SECURITY.md](SECURITY.md)。
```

</details>

#### 缺口

- 未验证平台制品、更新和卸载
  **影响**：本机运维成本未知
  **进一步探讨**：从独立 profile 做启动、退出和文件读回

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少卸载状态误判？

**研究主题**：新假设与验证

#### 完整回答

可在已有日志旁区分已预禁用、已删除依赖、等待重启和已确认，避免用户误以为配置已恢复。用模拟取消、包管理器失败和正常卸载对照，测误判及恢复时长，若无改善则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/plugins.rs:934-968](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/src-tauri/src/plugins.rs#L934-L968)

可读回的预禁用

<details>
<summary>查看原文（35行）</summary>

```text
pub fn pre_disable_installed_plugin(dsh_home: &Path, package_name: &str) -> Result<(), String> {
    if !is_valid_package_name(package_name) {
        return Err("cannot pre-disable an invalid plugin package name".to_string());
    }
    let (profile, mut manifest) = read_profile_manifest(dsh_home)?;
    let installed = profile_dependencies(&manifest)?
        .get(package_name)
        .and_then(Value::as_str)
        .is_some_and(|spec| !spec.is_empty());
    if !installed {
        return Err(format!(
            "plugin {package_name} is not an installed web-profile dependency"
        ));
    }
    pre_disable_profile_bundle(&profile, &mut manifest, package_name)
}

fn pre_disable_profile_bundle(
    profile: &Path,
    manifest: &mut Value,
    package_name: &str,
) -> Result<(), String> {
    let bundles = profile_bundles_mut(manifest)?;
    for bundle in bundles.iter() {
        if bundle.as_str().is_none() {
            return Err("web profile bundles contains a non-string value".to_string());
        }
    }
    let before = bundles.len();
    bundles.retain(|bundle| bundle.as_str() != Some(package_name));
    if bundles.len() != before {
        write_profile_manifest(profile, manifest)?;
    }
    Ok(())
}
```

</details>

**依据 2 · 作者声明**：[README.md:79-102](https://github.com/web-casa/DeepSeek-Harness-Desktop/blob/4e9c6113c475cb94ebffd3ba83828875361f3b16/README.md#L79-L102)

包操作和漂移场景

<details>
<summary>查看原文（24行）</summary>

````text
## ✨ 插件生态

Harness 的技能、工具、模型路由、MCP、预设——**全部是 Cordis 插件**。

**发现**：设置页「资源」一键打开插件市场 [cordis.run](https://cordis.run)。

**安装**：设置页「插件（用户安装）」输入 npm 包名即可安装、卸载。安装复用官方 `dsh plugin --profile web add`；卸载先精确 pre-disable 目标，再用随包 pnpm 关闭 lifecycle script 后直接移除，避免上游全局 reconcile 意外启用另一个仍处于 pending 的市场插件。CLI 与 pnpm 均随包携带（**无需系统 pnpm**），带实时日志与取消（整棵 node → dsh/pnpm 进程树一并清理）。

从 cordis.run 插件详情页点「安装到桌面版」会用 `dsharness://plugin/install?v=1&name=<包名>&source=<插件页>` 唤起桌面版；桌面版在 Rust 侧严格校验协议后，仅将链接定位到对应市场 slug，并重新拉取详情、核对当前 `entryRevision` 与嵌套 source，再由用户确认安装（旧版本桌面版或不支持的市场页仍可复制包名粘贴安装）。命令行等价路径（高级用法）：

```bash
# macOS
DSH_HOME="<诊断页 dshHome>" node "/Applications/DSH Desktop.app/Contents/Resources/runtime/harness/node_modules/@deepseek-ai/dsh/lib/bin.js" plugin --profile web add <包名>
# Windows PowerShell
$env:DSH_HOME="<诊断页 dshHome>"; node "<安装目录>\runtime\harness\node_modules\@deepseek-ai\dsh\lib\bin.js" plugin --profile web add <包名>
```

插件装入 `<dshHome>/profiles/web/`（用户数据目录，不写安装目录），装完在应用里「重新启动 Harness」生效。

如果升级中断或手动删除过插件文件，控制器会只读检查「`package.json` 仍声明、
直接包入口却缺失」的 Web profile 漂移。它绝不自动改写用户配置；只有能够证明
为无自定义配置、且属于**未启用包**的简单 `cordis.patch.yml` 条目时，才会展示逐项
预览并要求再次确认后移除该条目。已启用 bundle、符号链接、复杂 YAML 与其他不确定
状态只报告，留给 Harness 的安全恢复流程或用户人工处理。
````

</details>

#### 缺口

- 未核对所有 UI 状态
  **影响**：增量不明
  **进一步探讨**：先走查后做故障演练

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
