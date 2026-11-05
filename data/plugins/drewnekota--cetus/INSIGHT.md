# Cetus

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d0f8594](https://github.com/drewnekota/cetus/tree/d0f8594c06792d478c329b241767a41580703aa1)

<!-- BEGIN META -->
[![GitHub ★ 150](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=150&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/drewnekota/cetus)
<!-- END META -->

> **功能**：在一个桌面客户端中管理多个 Agent CLI 的会话，包括通过 ACP 接入 DSH。

> **亮点**：[Q01](#research-q01) 将 DSH 的 ACP 会话接到多运行时客户端。

> **主要限制**：[Q02](#research-q02) 启动准备会读环境和处理配置，实际边界需核查。

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
  - [Q01 · 怎样接 DSH？](#detail-section-11)
  - [Q02 · 启动影响什么本地状态？](#detail-section-12)
  - [Q03 · 如何控制试用和退出？](#detail-section-13)
  - [Q04 · 怎样让启动变化可见？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在同一桌面入口处理多个 Agent CLI 会话的开发者。

在多个原生终端与客户端分别处理会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话客户端 | 管理多运行时 | 依赖平台与已装 CLI |
| DSH 接入 | 用 ACP 驱动宿主 | 核对启动配置与环境 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Apple Silicon macOS | 客户端必需 | 运行桌面应用 | 继续使用 CLI |
| 兼容 DSH CLI | DSH 接入必需 | 提供 ACP 进程 | 停止接入 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 核对 | 用户选固定制品及临时 DSH_HOME | 隔离配置 |
| 验证 | 操作者测试对话和停止 | 读回本地文件 |
| 退出 | 回到 CLI 并核对目录 | 保留所需历史 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 应用与宿主资源未知 | 准备账号和环境 | 未实测 |
| 持续 | 各 CLI 模型费用 | 维护会话配置 | 未对账 |
| 恢复 | 重装和备份未知 | 核对旧配置及会话 | 真实退出未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中会话 | DSH ACP 后端入口 | 实际操作效率 |
| 准备 | 版本门及 overlay | 真实宿主兼容 |

> **思考**：[Q02](#research-q02) 启动准备会读环境和处理配置，实际边界需核查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将 DSH 的 ACP 会话接到多运行时客户端。

[Q01](#research-q01) 标准 ACP 后端与 DSH 特定启动准备分离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 启动准备会读环境和处理配置，实际边界需核查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用临时 home 验证。[Q02](#research-q02) 检查配置改写和环境。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定客户端和 DSH 适配路径静态核对，未运行应用。

- 已检查：作者 README、包清单、源码路径 README.md、src-tauri/cetus-bridge/src/cli_agent.rs、src-tauri/cetus-bridge/src/cli_agent/dsh.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根应用的 DSH 适配代表源码，未运行应用。
- 下一步：用虚拟配置验证进程、凭据键、overlay 和退出。

**分析版本**

- **仓库**：[drewnekota/cetus](https://github.com/drewnekota/cetus)
- **版本号**：0.4.18（[固定提交 d0f8594](https://github.com/drewnekota/cetus/tree/d0f8594c06792d478c329b241767a41580703aa1)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 预览启动准备以减少状态误判。

用虚拟配置验证进程、凭据键、overlay 和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 810 | — | — | 6980 |
| .mjs | source | 10 | 1595 | 1384 | 100 | — |
| .md | example | 4 | 37 | — | — | 217 |
| .js | example | 5 | 110 | 95 | 0 | — |
| .ts | source | 110 | 26361 | 21528 | 3212 | — |
| .js | source | 7 | 2032 | 1906 | 39 | — |
| .tsx | source | 144 | 43764 | 38043 | 3900 | — |
| .js | test | 16 | 1458 | 1274 | 45 | — |
| .ts | test | 2 | 148 | 135 | 1 | — |
| .tsx | example | 2 | 73 | 72 | 0 | — |
| .ts | example | 2 | 26 | 24 | 2 | — |
| .mjs | test | 1 | 48 | 46 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/drewnekota/cetus/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Cetus 客户端怎样运行 DSH，会改变什么状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 怎样接 DSH？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

维护多个 CLI Agent 的操作者原本在独立终端查状态。Cetus 是独立客户端，DSH 后端解析 dsh 名称并以 acp profile 启动，与其他 ACP 后端共用协议入口。适配层负责版本、会话配置映射和 DSH 特定启动准备。产品增量是把既有 CLI 纳入客户端任务流，协议能力和授权仍取决于 DSH。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-56](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/README.md#L39-L56)

作者对比多客户端

<details>
<summary>查看原文（18行）</summary>

```text
## Why Cetus

Agents are no longer the slow part. Claude Code, Codex, and DeepSeek Harness can work for an hour on their own. What slows them down is the person they are waiting on: a permission prompt, a clarifying question, a finished task that nobody has reviewed yet.

And that person is usually juggling several products. Claude Code in one window, Codex in another, scheduled jobs that each report back in a different client. Every switch costs attention, and every minute you don't notice an agent waiting is a minute it sits idle.

Some tools, like Superset, put different runtimes side by side, but in a TUI. A terminal is a fine place for an agent to run and a poor place for a person to read: everything is monospaced text, plans, diffs, and questions all look alike, and whatever scrolls off is gone.

Cetus is built for the human side of the loop: a real desktop app where every agent's work is easy to read, easy to answer, and easy to review.

## One client for every runtime

![Cetus runtime picker — Claude Code, Codex, DeepSeek Harness, OpenCode, Grok Build, and Kimi CLI in one macOS app](docs/screenshot-runtime-picker.png)

- **Every runtime in one window.** Use the CLI you already have installed and signed in to. Cetus reuses its login, model, and tools, so there is no second account to set up.
- **One place to respond.** Permission prompts, questions, and plans from any runtime show up as cards in the conversation. Steer a running turn or queue the next message without waiting for it to finish.
- **One board for review.** Every conversation is a card in **In progress · Needs review · Done**. Finished work waits for you instead of scrolling away in a terminal.
- **Parallel without collisions.** Per-conversation git worktrees let several agents edit the same repo at once.
```

</details>

**依据 2 · 源码核查**：[src-tauri/cetus-bridge/src/cli_agent.rs:65-97](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/src-tauri/cetus-bridge/src/cli_agent.rs#L65-L97)

后端名称及 ACP 参数

<details>
<summary>查看原文（33行）</summary>

```text
            "opencode" => Some(CliBackend::OpenCode),
            "grok" | "grok-build" => Some(CliBackend::Grok),
            "kimi" | "kimi-cli" => Some(CliBackend::Kimi),
            "dsh" | "deepseek-harness" => Some(CliBackend::Dsh),
            _ => None,
        }
    }

    /// Default executable name resolved on `PATH` (overridable by the caller).
    pub fn default_bin(self) -> &'static str {
        match self {
            CliBackend::ClaudeCode => "claude",
            CliBackend::Codex => "codex",
            CliBackend::OpenCode => "opencode",
            CliBackend::Grok => "grok",
            CliBackend::Kimi => "kimi",
            CliBackend::Dsh => "dsh",
        }
    }

    pub fn is_acp(self) -> bool {
        matches!(self, Self::OpenCode | Self::Grok | Self::Kimi | Self::Dsh)
    }

    /// Arguments that start the vendor's native ACP stdio server.
    pub fn acp_args(self) -> &'static [&'static str] {
        match self {
            Self::OpenCode => &["acp"],
            Self::Grok => &["agent", "stdio"],
            Self::Kimi => &["acp"],
            Self::Dsh => &["--profile", "acp"],
            _ => &[],
        }
```

</details>

**依据 3 · 源码核查**：[src-tauri/cetus-bridge/src/cli_agent/dsh.rs:7-15](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/src-tauri/cetus-bridge/src/cli_agent/dsh.rs#L7-L15)

适配职责

```text
// ===========================================================================
// DSH backend: dsh's `acp` profile is a standard ACP v1 stdio server, so a
// conversation drives `dsh --profile acp` through the same `spawn_acp_session`
// path as the other native ACP runtimes. What stays dsh-specific lives here:
// the Flash model overlay, legacy plugin cleanup, `.env` credential passthrough,
// the version gate
// (dsh < 0.1.2 has no `acp` profile), and the mapping from Cetus's model /
// effort choice onto dsh's `session/set_config_option` catalog.
// ===========================================================================
```

#### 缺口

- 未运行实际客户端与 CLI
  **影响**：无法确认卡片、恢复或多个运行时体验
  **进一步探讨**：以隔离 DSH 后端核对启动、对话和确认

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动影响什么本地状态？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

准备函数读取 DSH_HOME 下 cordis.patch.yml，如找到成对旧管理标记会删除该段并重写；同时在 cetus-runtime 写默认模型 overlay。dotenv helper 从同一根读取 .env 并提取键值，注释说明给子进程，避免依赖交互 shell。复用登录不意味着配置无副作用，若版本门仅识别基础数字，也不能保证每个候选版本能力相同。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/cetus-bridge/src/cli_agent/dsh.rs:16-32](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/src-tauri/cetus-bridge/src/cli_agent/dsh.rs#L16-L32)

Cetus 模型 overlay

<details>
<summary>查看原文（17行）</summary>

```text
// Applied only to Cetus-launched ACP processes, after user profile overlays.
const DSH_FLASH_PATCH: &str = r#"- id: llm-deepseek
  config:
    models:
      - id: deepseek-flash
        name: DeepSeek V4.1 Flash
        contextWindow: 1000000
        maxTokens: 384000
        inputModalities: [text, image]
- id: agent-default-model
  config:
    provider: deepseek-official
    model: deepseek-flash
- id: acp
  config:
    provider: deepseek-official
    model: deepseek-flash
```

</details>

**依据 2 · 源码核查**：[src-tauri/cetus-bridge/src/cli_agent/dsh.rs:34-63](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/src-tauri/cetus-bridge/src/cli_agent/dsh.rs#L34-L63)

读取用户配置、重写旧段及运行目录

<details>
<summary>查看原文（30行）</summary>

```text
pub(super) fn dsh_home() -> std::path::PathBuf {
    std::env::var("DSH_HOME")
        .map(std::path::PathBuf::from)
        .unwrap_or_else(|_| {
            std::path::PathBuf::from(std::env::var("HOME").unwrap_or_default()).join(".dsh")
        })
}

/// Prepare only the model overlay. App capabilities are exposed through the
/// shared Cetus CLI, not through dsh-specific plugins.
pub(super) fn dsh_prepare_runtime(home: &std::path::Path) -> Result<std::path::PathBuf> {
    let config = home.join("cordis.patch.yml");
    match std::fs::read_to_string(&config) {
        Ok(text) => {
            let (user, previous) = dsh_split_managed_block(&text);
            if previous.is_some() {
                std::fs::write(&config, user)
                    .context("could not remove retired Cetus plugin mounts")?;
            }
        }
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
        Err(error) => return Err(error).context("could not read dsh plugin overlay"),
    }
    let root = home.join("cetus-runtime");
    std::fs::create_dir_all(&root)?;
    let patch = root.join("flash.patch.yml");
    if std::fs::read_to_string(&patch).ok().as_deref() != Some(DSH_FLASH_PATCH) {
        std::fs::write(&patch, DSH_FLASH_PATCH)?;
    }
    Ok(root)
```

</details>

**依据 3 · 源码核查**：[src-tauri/cetus-bridge/src/cli_agent/dsh.rs:66-93](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/src-tauri/cetus-bridge/src/cli_agent/dsh.rs#L66-L93)

匹配标记及保留文本

<details>
<summary>查看原文（28行）</summary>

```text
const DSH_MANAGED_BEGIN: &str = "# >>> dsh-companion managed block (do not edit)";
const DSH_MANAGED_END: &str = "# <<< dsh-companion managed block";

/// Split `cordis.patch.yml` into the user's text and Cetus's managed block
/// (`None` when there is none). The block is returned in the exact form the
/// writer emits, so an unchanged mount is a no-op write.
fn dsh_split_managed_block(text: &str) -> (String, Option<String>) {
    let Some(begin) = text.find(DSH_MANAGED_BEGIN) else {
        return (text.to_string(), None);
    };
    let Some(end_rel) = text[begin..].find(DSH_MANAGED_END) else {
        return (text.to_string(), None);
    };
    let end = begin + end_rel + DSH_MANAGED_END.len();
    let end = end
        + text[end..]
            .find('\n')
            .map(|n| n + 1)
            .unwrap_or(text.len() - end);
    let before = text[..begin].trim_end_matches('\n');
    let mut user = String::from(before);
    if !before.is_empty() {
        user.push('\n');
    }
    user.push_str(&text[end..]);
    let block = format!("\n{}", &text[begin..end]);
    (user, Some(block))
}
```

</details>

**依据 4 · 源码核查**：[src-tauri/cetus-bridge/src/cli_agent/dsh.rs:95-125](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/src-tauri/cetus-bridge/src/cli_agent/dsh.rs#L95-L125)

基础版本判断

<details>
<summary>查看原文（31行）</summary>

```text
/// Oldest dsh whose `acp` profile Cetus can drive. Earlier releases only had
/// the ApiProxy gateway that the retired companion bridge wrapped.
const DSH_MIN_VERSION: (u64, u64, u64) = (0, 1, 2);

/// `major.minor.patch` from a version string, ignoring any prerelease or build
/// suffix (`0.1.2-rc.1` → `(0, 1, 2)`).
fn parse_semver_triple(text: &str) -> Option<(u64, u64, u64)> {
    let core = text
        .trim()
        .trim_start_matches('v')
        .split(['-', '+'])
        .next()?;
    let mut parts = core.split('.').map(|part| part.trim().parse::<u64>().ok());
    Some((parts.next()??, parts.next()??, parts.next()??))
}

/// Reject a dsh that predates the `acp` profile with a message that says what
/// to install, instead of the opaque boot error `--profile acp` would produce.
fn dsh_check_version(version: &str) -> Result<()> {
    let parsed = parse_semver_triple(version)
        .with_context(|| format!("could not parse the dsh version {version:?}"))?;
    anyhow::ensure!(
        parsed >= DSH_MIN_VERSION,
        "dsh {} is too old for Cetus: it drives dsh over the `acp` profile, which needs dsh \
         {}.{}.{} or newer. Upgrade with `npm i -g @deepseek-ai/dsh@latest` and retry.",
        version.trim(),
        DSH_MIN_VERSION.0,
        DSH_MIN_VERSION.1,
        DSH_MIN_VERSION.2
    );
    Ok(())
```

</details>

**依据 5 · 源码核查**：[src-tauri/cetus-bridge/src/cli_agent/dsh.rs:163-180](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/src-tauri/cetus-bridge/src/cli_agent/dsh.rs#L163-L180)

dotenv helper

<details>
<summary>查看原文（18行）</summary>

```text
/// `$DSH_HOME/.env` is dsh's own credential file; hand it to the child so the
/// native model adapters see their keys regardless of which shell
/// rc files a non-interactive login shell reads. Caller-supplied env is applied
/// afterwards and wins.
pub(super) fn dsh_dotenv() -> Vec<(String, String)> {
    let Ok(text) = std::fs::read_to_string(dsh_home().join(".env")) else {
        return Vec::new();
    };
    text.lines()
        .map(str::trim)
        .filter(|line| !line.is_empty() && !line.starts_with('#'))
        .filter_map(|line| {
            let (key, value) = line.split_once('=')?;
            let value = value.trim().trim_matches('"').trim_matches('\'');
            Some((key.trim().to_string(), value.to_string()))
        })
        .collect()
}
```

</details>

#### 缺口

- 未验证具体设备权限、实际子进程环境或并发改文件
  **影响**：不能判断本机兼容性与写入竞争
  **进一步探讨**：用虚拟 DSH_HOME、哨兵配置和虚拟环境键确认副作用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何控制试用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者列 Apple Silicon 及分发版本要求，DSH CLI 需已安装及适配 ACP。建议在临时 DSH_HOME 用可丢弃任务核对真实 binary、配置写入和停止。使用多个 Agent 仍消耗各账户额度，初次准备、保留历史与切回独立 CLI 的人力未测。若启动改写范围或账号复用未确认，保留原 CLI 工作方式。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:98-113](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/README.md#L98-L113)

作者安装和环境

<details>
<summary>查看原文（16行）</summary>

```text
## Get started

Cetus runs on **Apple Silicon** Macs. There are two builds of the same app:

| Build | Download | Requires |
| --- | --- | --- |
| **Cetus** — the original app, built with Tauri | [Cetus.dmg](https://github.com/drewnekota/cetus/releases/latest/download/Cetus.dmg) | macOS 13+ |
| **Cetus Swift** (Beta) — a native SwiftUI build, still missing some polish | [Cetus-Swift.dmg](https://github.com/drewnekota/cetus/releases/download/swift/Cetus-Swift.dmg) | macOS 15+ |

Both update themselves. Then:

1. Open the DMG and move Cetus to Applications.
2. Use the built-in runtime, or pick an installed and signed-in `claude`, `codex`, or `dsh` (DeepSeek Harness) CLI.
3. Choose a workspace and give the agent its first task.

> **Early release:** Cetus is under active development. Please [open an issue](https://github.com/drewnekota/cetus/issues) if something breaks or a workflow is missing.
```

</details>

**依据 2 · 源码核查**：[src-tauri/cetus-bridge/src/cli_agent/dsh.rs:128-160](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/src-tauri/cetus-bridge/src/cli_agent/dsh.rs#L128-L160)

版本探测超时与缓存

<details>
<summary>查看原文（33行）</summary>

```text
/// Binaries already verified this process lifetime; `dsh --version` boots node,
/// so it is only worth paying once per install.
static DSH_VERIFIED_BINS: std::sync::Mutex<Vec<String>> = std::sync::Mutex::new(Vec::new());

/// Run `dsh --version` and gate on [`DSH_MIN_VERSION`]. Cached per binary.
pub(super) async fn dsh_require_supported_version(bin: &str) -> Result<()> {
    if DSH_VERIFIED_BINS
        .lock()
        .unwrap()
        .iter()
        .any(|verified| verified == bin)
    {
        return Ok(());
    }
    let output = tokio::time::timeout(
        Duration::from_secs(30),
        TokioCommand::new(bin)
            .arg("--version")
            .stdin(Stdio::null())
            .output(),
    )
    .await
    .context("`dsh --version` timed out")?
    .with_context(|| format!("failed to run `{bin} --version`"))?;
    let stdout = String::from_utf8_lossy(&output.stdout);
    let version = stdout
        .lines()
        .map(str::trim)
        .find(|line| parse_semver_triple(line).is_some())
        .unwrap_or_else(|| stdout.trim());
    dsh_check_version(version)?;
    DSH_VERIFIED_BINS.lock().unwrap().push(bin.to_string());
    Ok(())
```

</details>

**依据 3 · 源码核查**：[src-tauri/cetus-bridge/src/cli_agent/dsh.rs:42-63](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/src-tauri/cetus-bridge/src/cli_agent/dsh.rs#L42-L63)

退出时需要核对的文件

<details>
<summary>查看原文（22行）</summary>

```text
/// Prepare only the model overlay. App capabilities are exposed through the
/// shared Cetus CLI, not through dsh-specific plugins.
pub(super) fn dsh_prepare_runtime(home: &std::path::Path) -> Result<std::path::PathBuf> {
    let config = home.join("cordis.patch.yml");
    match std::fs::read_to_string(&config) {
        Ok(text) => {
            let (user, previous) = dsh_split_managed_block(&text);
            if previous.is_some() {
                std::fs::write(&config, user)
                    .context("could not remove retired Cetus plugin mounts")?;
            }
        }
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
        Err(error) => return Err(error).context("could not read dsh plugin overlay"),
    }
    let root = home.join("cetus-runtime");
    std::fs::create_dir_all(&root)?;
    let patch = root.join("flash.patch.yml");
    if std::fs::read_to_string(&patch).ok().as_deref() != Some(DSH_FLASH_PATCH) {
        std::fs::write(&patch, DSH_FLASH_PATCH)?;
    }
    Ok(root)
```

</details>

#### 缺口

- 未核实真实发行物、卸载与故障恢复
  **影响**：不能量化本机成本
  **进一步探讨**：固定制品与临时 home 检查安装、退出

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样让启动变化可见？

**研究主题**：新假设与验证

#### 完整回答

在实际启动前预览准备动作，列出将移除的旧管理块与独立 overlay 的路径，只显示 dotenv 键名而非值。用含旧块、无旧块、版本拒绝的虚拟配置对照，测正确识别影响范围和恢复时间。若没有降低误判则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/cetus-bridge/src/cli_agent/dsh.rs:42-63](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/src-tauri/cetus-bridge/src/cli_agent/dsh.rs#L42-L63)

现有副作用边界

<details>
<summary>查看原文（22行）</summary>

```text
/// Prepare only the model overlay. App capabilities are exposed through the
/// shared Cetus CLI, not through dsh-specific plugins.
pub(super) fn dsh_prepare_runtime(home: &std::path::Path) -> Result<std::path::PathBuf> {
    let config = home.join("cordis.patch.yml");
    match std::fs::read_to_string(&config) {
        Ok(text) => {
            let (user, previous) = dsh_split_managed_block(&text);
            if previous.is_some() {
                std::fs::write(&config, user)
                    .context("could not remove retired Cetus plugin mounts")?;
            }
        }
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
        Err(error) => return Err(error).context("could not read dsh plugin overlay"),
    }
    let root = home.join("cetus-runtime");
    std::fs::create_dir_all(&root)?;
    let patch = root.join("flash.patch.yml");
    if std::fs::read_to_string(&patch).ok().as_deref() != Some(DSH_FLASH_PATCH) {
        std::fs::write(&patch, DSH_FLASH_PATCH)?;
    }
    Ok(root)
```

</details>

**依据 2 · 源码核查**：[src-tauri/cetus-bridge/src/cli_agent/dsh.rs:128-160](https://github.com/drewnekota/cetus/blob/d0f8594c06792d478c329b241767a41580703aa1/src-tauri/cetus-bridge/src/cli_agent/dsh.rs#L128-L160)

现有版本错误信息

<details>
<summary>查看原文（33行）</summary>

```text
/// Binaries already verified this process lifetime; `dsh --version` boots node,
/// so it is only worth paying once per install.
static DSH_VERIFIED_BINS: std::sync::Mutex<Vec<String>> = std::sync::Mutex::new(Vec::new());

/// Run `dsh --version` and gate on [`DSH_MIN_VERSION`]. Cached per binary.
pub(super) async fn dsh_require_supported_version(bin: &str) -> Result<()> {
    if DSH_VERIFIED_BINS
        .lock()
        .unwrap()
        .iter()
        .any(|verified| verified == bin)
    {
        return Ok(());
    }
    let output = tokio::time::timeout(
        Duration::from_secs(30),
        TokioCommand::new(bin)
            .arg("--version")
            .stdin(Stdio::null())
            .output(),
    )
    .await
    .context("`dsh --version` timed out")?
    .with_context(|| format!("failed to run `{bin} --version`"))?;
    let stdout = String::from_utf8_lossy(&output.stdout);
    let version = stdout
        .lines()
        .map(str::trim)
        .find(|line| parse_semver_triple(line).is_some())
        .unwrap_or_else(|| stdout.trim());
    dsh_check_version(version)?;
    DSH_VERIFIED_BINS.lock().unwrap().push(bin.to_string());
    Ok(())
```

</details>

#### 缺口

- 未走查 UI 是否有同类展示
  **影响**：增量未知
  **进一步探讨**：先核对界面后做虚拟启动对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
