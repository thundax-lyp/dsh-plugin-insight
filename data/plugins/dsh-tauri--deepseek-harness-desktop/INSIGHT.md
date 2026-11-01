# DeepSeek Harness Tauri Desktop

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[3fada7d](https://github.com/dsh-tauri/deepseek-harness-desktop/tree/3fada7d06854f9d79b8ed6c021bf88db954cca3d)

<!-- BEGIN META -->
[![GitHub ★ 3,385](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C385&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-tauri/deepseek-harness-desktop)
<!-- END META -->

> **功能**：提供 DSH 桌面界面、内核与运行时管理和数据迁移。

> **亮点**：将运行时、内核和档案管理集成到第三方桌面；不是单一 DSH 插件。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：迁移统计仅比较文件数和字节，链接重建失败只告警；不能据成功提示断言关键内容和插件完全恢复。[Q03](#research-q03)

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
  - [Q01 · 桌面应用为谁减少什么操作？](#detail-section-11)
  - [Q02 · 内核来源与版本配置怎样影响启动？](#detail-section-12)
  - [Q03 · 迁移完成能否证明数据和插件完全恢复？](#detail-section-13)
  - [Q04 · 安装、远程和迁移的成本及停止条件？](#detail-section-14)
  - [Q05 · 如何检验分层就绪与迁移证据？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望图形化管理 DSH 内核、profile 和数据的用户；基线是 CLI、浏览器与手工目录管理。[Q01](#research-q01)

自行管理 DSH CLI、Node/pnpm、profile 与数据目录。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 桌面运行 | 管理内核与 profile | 实际就绪须验证 |
| 数据迁移 | 复制并保留备份 | 计数非内容哈希 |
| 远程入口 | 跨设备连接 | 访问权限须核对 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容桌面系统 | 必需 | 运行 Tauri 应用 | 无法启动 |
| 可用内核与运行时 | 必需 | 执行 DSH | 核心未就绪 |
| 已验证备份 | 迁移必需 | 恢复数据 | 不迁移 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 安装 | 选择桌面及内核版本 | 确认真实启动 |
| 准备迁移 | 停止使用并保存副本 | 确认可恢复 |
| 回读 | 检查会话、配置和插件 | 失败停止切换 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载与存储 | 环境及 profile 配置 | 首启可能联网 |
| 持续 | 更新与远程资源 | 版本及权限管理 | 效率未测 |
| 迁移 | 双份磁盘与备份 | 逐项回读 | 计数不能证明内容一致 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 内核管理 | local/app 选择逻辑 | 所有版本兼容 |
| 迁移 | 文件和字节覆盖检查 | 内容及链接全部恢复 |

> **思考**：迁移统计仅比较文件数和字节，链接重建失败只告警；不能据成功提示断言关键内容和插件完全恢复。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将运行时、内核和档案管理集成到第三方桌面；不是单一 DSH 插件。[Q01](#research-q01) [Q02](#research-q02)

分离 local/app 内核；迁移核对文件数和字节，链接重建失败仅告警。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

迁移统计仅比较文件数和字节，链接重建失败只告警；不能据成功提示断言关键内容和插件完全恢复。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

在副本上验证核心、插件与关键数据；失败停止切换并核验备份。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持内核选择和迁移统计/链接边界；未运行桌面、内核或迁移。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、apps/desktop/src-tauri/src/service/core/mod.rs、apps/desktop/src-tauri/src/config/manifest.rs、apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs、apps/desktop/src-tauri/src/service/data_dir/migrate.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 1047 个指定扩展名文件、排除 21、解析错误 0；静态核查 monorepo 桌面管理和迁移代表路径，未运行目标。
- 下一步：固定桌面与内核，用副本检查链接、同大小损坏、会话和插件恢复。

**分析版本**

- **仓库**：[dsh-tauri/deepseek-harness-desktop](https://github.com/dsh-tauri/deepseek-harness-desktop)
- **版本号**：0.3.0-pre.alpha.2（[固定提交 3fada7d](https://github.com/dsh-tauri/deepseek-harness-desktop/tree/3fada7d06854f9d79b8ed6c021bf88db954cca3d)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：分层展示内核、插件及关键文件/链接核对结果，可减少迁移成功误判；须测漏报和成本。[Q05](#research-q05)

固定桌面与内核，用副本检查链接、同大小损坏、会话和插件恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | test | 3 | 298 | 281 | 0 | — |
| .mjs | source | 9 | 1624 | 1453 | 66 | — |
| .md | source | 53 | 7100 | — | — | 80998 |
| .js | source | 5 | 183 | 177 | 1 | — |
| .ts | source | 751 | 50807 | 43828 | 2712 | — |
| .ts | test | 52 | 11147 | 9654 | 539 | — |
| .tsx | test | 31 | 9312 | 8296 | 389 | — |
| .tsx | source | 138 | 22163 | 20378 | 604 | — |
| .mjs | example | 2 | 457 | 441 | 4 | — |
| .md | example | 1 | 29 | — | — | 273 |
| .md | test | 2 | 236 | — | — | 2506 |

</details>

**活跃度**

[![Issue 未关闭 35](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=35&color=737b86&logo=github)](https://github.com/dsh-tauri/deepseek-harness-desktop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 130](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=130&color=737b86&logo=github)](https://github.com/dsh-tauri/deepseek-harness-desktop/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 108](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=108&color=737b86&logo=github)](https://github.com/dsh-tauri/deepseek-harness-desktop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：第三方 DSH 桌面如何管理内核，迁移与就绪证明有何边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面应用为谁减少什么操作？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

这是第三方 DSH Tauri 桌面应用与托管环境，不是单一 npm 插件；面向希望通过图形界面管理内核、运行时和 profile 的用户。对照为自行安装 DSH CLI/Node/pnpm 并用浏览器与手工目录管理。作者描述集成插件、迁移和远程入口，窗口打开不证明内核、插件或任务就绪；首次初始化可能需要联网。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:7-11](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/README.md#L7-L11)

作者说明桌面用途与首次联网。

```text
<h1 align="center">DSH Tauri 桌面版</h1>

<p align="center">
  在桌面上运行 <a href="https://github.com/deepseek-ai/deepseek-harness">DeepSeek Harness</a> ——<br />
  无需手动安装 Node.js、pnpm 或 Docker；普通安装首次启动可能需要联网初始化。
```

**依据 2 · 源码核查**：[README.md:45-53](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/README.md#L45-L53)

作者描述托管、插件和迁移。

```text
## 功能

- 🪶 **原生桌面** — Tauri 2(Electron Runtime) + React 19 + Hero 3，内嵌本地 Harness 界面。
- 📱 **远程连接** — Android / iOS 移动端扫码连接电脑上的 DSH，支持局域网与 Cloudflare 公网隧道。
- 🔄 **运行时管理** — 安装依赖、选择内核版本，并提供桌面端与内核更新入口。
- 🧩 **插件管理** — 12 个内置插件；支持本地路径安装、内置插件停用、社区插件安装、升级、卸载与错误查看。
- 🗂️ **档案配置** — 分别管理插件与设置，支持一键迁移档案数据、备份、克隆；
- 💽 **数据目录** — 安装时（Windows）可选择数据存放位置；能在设置里整体迁移与回滚。
- ⌨️ **命令行集成** — 通过托管 shim 提供 `dsh` / `pnpm` 命令行工具，不是全局 npm 内核安装。
```

**依据 3 · 源码核查**：[package.json:1-8](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/package.json#L1-L8)

私有 monorepo 与桌面定位。

```text
{
  "name": "monorepo",
  "type": "module",
  "version": "0.3.0-pre.alpha.2",
  "private": true,
  "packageManager": "pnpm@11.7.0",
  "description": "Electron Runtime infrastructure for DeepSeek Harness",
  "scripts": {
```

#### 缺口

- 未运行桌面应用、内核、迁移或远程连接
  **影响**：不能证明初始化、数据恢复和兼容性
  **进一步探讨**：固定桌面及内核版本，在可丢弃副本验证关键数据

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 内核来源与版本配置怎样影响启动？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

源码区分 local 用户自行安装内核和 app 桌面管理多版本；模块说明自动模式在本地内核满足基线时优先，否则使用预打包，显式选择可持久化。manifest 类型支持 declared 版本或插件/核心版本矩阵。该机制降低手动版本管理负担，但配置匹配、下载和本机就绪仍须实际验证，不能以清单存在等同启动成功。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src-tauri/src/service/core/mod.rs:1-17](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/apps/desktop/src-tauri/src/service/core/mod.rs#L1-L17)

local/app 内核与选择。

<details>
<summary>查看原文（17行）</summary>

```text
//! Harness 核心管理。
//!
//! 核心来源：
//! - `local`：用户通过 CLI（npm/pnpm 全局安装）自行安装的 dsh，安装目录与
//!   配置（`$DSH_HOME`）都不归桌面端管理；
//! - `app`：桌面端预打包管理的 deepseek-harness-pkg 多版本副本。激活版本固定
//!   位于 `dependencies/dsh`（既有代码全部依赖该路径），通过「核心」面板下载的
//!   历史版本存放在 `dependencies/dsh-<tag>` 槽位，切换时两个目录互换。debug 与
//!   release 的整个 AppData 根目录不同，因此两套构建不会互换或覆盖对方核心。
//!
//! 启动优先级（需求）：本地核心存在且不低于内置插件基线时优先使用本地核心；未检测到
//! 或低于基线（随包内置插件按推荐核心版本编译，见 [`source`]）才走预打包。用户在
//! 「核心」面板可显式切回预打包；显式选择持久化在 store 设置（`active_core`），
//! `None` = 自动（本地优先）。
//!
//! 本地核心更新通过其包管理器 CLI 完成（npm `update -g` / pnpm `add -g`），
//! 不触碰用户安装本身之外的文件。
```

</details>

**依据 2 · 源码核查**：[apps/desktop/src-tauri/src/config/manifest.rs:65-95](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/apps/desktop/src-tauri/src/config/manifest.rs#L65-L95)

插件与核心版本声明。

<details>
<summary>查看原文（31行）</summary>

```text
    /// 仓库地址（历史字段名 `repoUrl`）
    pub repo: String,
    /// profile `dependencies`/`bundles` 中的实际包名；缺省与 `id` 相同
    pub package: Option<String>,
    pub recommended: bool,
    /// 「修复」类项（Windows 极简模式），默认勾选
    pub fix: bool,
    /// 首次引导默认勾选
    pub checked: bool,
    /// 仅 Windows 列出
    #[serde(rename = "winOnly")]
    pub win_only: bool,
    /// 版本区间声明：`"latest"` 字符串或（插件版本区间 ↔ 核心版本区间）配对矩阵
    #[serde(default, deserialize_with = "deserialize_version")]
    pub version: Option<PluginVersion>,
}

/// 插件版本声明
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize)]
#[serde(untagged)]
pub enum PluginVersion {
    /// 无区间语义的字符串声明（如 `"latest"`）
    Declared(String),
    /// （插件版本区间 ↔ 核心版本区间）配对矩阵
    Matrix(Vec<VersionPair>),
}

/// 版本配对：`dsh` 核心区间命中时，兼容的插件版本为 `version` 区间
#[derive(Debug, Clone, PartialEq, Eq, serde::Serialize, Deserialize)]
pub struct VersionPair {
    pub version: String,
```

</details>

**依据 3 · 源码核查**：[README.md:45-53](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/README.md#L45-L53)

作者描述桌面运行时管理。

```text
## 功能

- 🪶 **原生桌面** — Tauri 2(Electron Runtime) + React 19 + Hero 3，内嵌本地 Harness 界面。
- 📱 **远程连接** — Android / iOS 移动端扫码连接电脑上的 DSH，支持局域网与 Cloudflare 公网隧道。
- 🔄 **运行时管理** — 安装依赖、选择内核版本，并提供桌面端与内核更新入口。
- 🧩 **插件管理** — 12 个内置插件；支持本地路径安装、内置插件停用、社区插件安装、升级、卸载与错误查看。
- 🗂️ **档案配置** — 分别管理插件与设置，支持一键迁移档案数据、备份、克隆；
- 💽 **数据目录** — 安装时（Windows）可选择数据存放位置；能在设置里整体迁移与回滚。
- ⌨️ **命令行集成** — 通过托管 shim 提供 `dsh` / `pnpm` 命令行工具，不是全局 npm 内核安装。
```

#### 缺口

- 未运行桌面应用、内核、迁移或远程连接
  **影响**：不能证明初始化、数据恢复和兼容性
  **进一步探讨**：固定桌面及内核版本，在可丢弃副本验证关键数据

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 迁移完成能否证明数据和插件完全恢复？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

迁移树统计只要求目标文件数和字节数不少于源，既不核哈希也不保证逐路径内容一致；链接不计入文件与字节校验。复制时链接重建为 best-effort，读取或创建失败只告警不阻断；普通文件复制错误会返回失败。成功迁移因此不能单凭计数证明每个关键文件或 pnpm 链接可用，应保持备份并对会话、配置、插件逐项回读。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs:16-32](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs#L16-L32)

文件数和字节覆盖，链接另计。

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

**依据 2 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs:130-162](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs#L130-L162)

文件复制与链接 best effort。

<details>
<summary>查看原文（33行）</summary>

```text
        fs::read_dir(src).map_err(|e| format!("DATA_DIR_COPY_READ: {}: {e}", src.display()))?;
    let entries: Vec<fs::DirEntry> = read_dir
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("DATA_DIR_COPY_ENTRY: {e}"))?;
    entries.par_iter().try_for_each(|entry| -> Result<(), String> {
        let name = entry.file_name();
        if name.to_str().map(is_skipped).unwrap_or(false) {
            return Ok(());
        }
        let src_path = entry.path();
        let dst_path = dst.join(&name);
        let meta = fs::symlink_metadata(&src_path)
            .map_err(|e| format!("DATA_DIR_COPY_META: {}: {e}", src_path.display()))?;
        if is_reparse_point(&meta) {
            copy_link(&src_path, &dst_path);
            progress.record_link();
        } else if meta.is_dir() {
            copy_tree(&src_path, &dst_path, progress)?;
        } else if meta.is_file() {
            fs::copy(&src_path, &dst_path)
                .map_err(|e| format!("DATA_DIR_COPY_FILE: {}: {e}", src_path.display()))?;
            progress.record_file(meta.len());
        }
        Ok(())
    })
}

/// 重建一条重复解析点（best-effort）。
///
/// 不跟随链接：pnpm 的 `node_modules` 链接指向全局 store，跟随复制既会成倍放大
/// 数据量，也会让新旧目录共享同一份文件。重建失败（Windows 创建符号链接需要
/// 权限或开发者模式）只告警、不阻断迁移——链接可以由插件重装流程重建，
/// 而数据文件不能重来。
```

</details>

**依据 3 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/migrate.rs:130-151](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/apps/desktop/src-tauri/src/service/data_dir/migrate.rs#L130-L151)

复制后覆盖统计检查。

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

#### 缺口

- 未运行桌面应用、内核、迁移或远程连接
  **影响**：不能证明初始化、数据恢复和兼容性
  **进一步探讨**：固定桌面及内核版本，在可丢弃副本验证关键数据

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、远程和迁移的成本及停止条件？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需要兼容桌面系统、网络获取运行时或内核、正确 profile 和存储空间；远程功能作者描述包括局域网及公网隧道，须明确访问控制和凭据边界。迁移前停止使用并保留备份，完成后核对关键会话、配置、插件和目标环境；缺失或验证失败时停止切换并从验证过的备份恢复。未测安装、网络、远程或实际迁移时间。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:7-11](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/README.md#L7-L11)

首次联网说明。

```text
<h1 align="center">DSH Tauri 桌面版</h1>

<p align="center">
  在桌面上运行 <a href="https://github.com/deepseek-ai/deepseek-harness">DeepSeek Harness</a> ——<br />
  无需手动安装 Node.js、pnpm 或 Docker；普通安装首次启动可能需要联网初始化。
```

**依据 2 · 源码核查**：[README.md:45-53](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/README.md#L45-L53)

远程、档案及迁移能力为作者描述。

```text
## 功能

- 🪶 **原生桌面** — Tauri 2(Electron Runtime) + React 19 + Hero 3，内嵌本地 Harness 界面。
- 📱 **远程连接** — Android / iOS 移动端扫码连接电脑上的 DSH，支持局域网与 Cloudflare 公网隧道。
- 🔄 **运行时管理** — 安装依赖、选择内核版本，并提供桌面端与内核更新入口。
- 🧩 **插件管理** — 12 个内置插件；支持本地路径安装、内置插件停用、社区插件安装、升级、卸载与错误查看。
- 🗂️ **档案配置** — 分别管理插件与设置，支持一键迁移档案数据、备份、克隆；
- 💽 **数据目录** — 安装时（Windows）可选择数据存放位置；能在设置里整体迁移与回滚。
- ⌨️ **命令行集成** — 通过托管 shim 提供 `dsh` / `pnpm` 命令行工具，不是全局 npm 内核安装。
```

**依据 3 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/migrate.rs:195-206](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/apps/desktop/src-tauri/src/service/data_dir/migrate.rs#L195-L206)

回滚前检查宿主停止。

<details>
<summary>查看原文（12行）</summary>

```text
/// 存在才是「一键回滚」敢按下去的前提。
pub(super) fn rollback(
    app_handle: &AppHandle,
    current: &Path,
    backup: Option<&Path>,
    emit: ProgressSink<'_>,
) -> Result<MigrationOutcome, String> {
    if !harness_stopped(current) {
        return Err(format!(
            "DATA_DIR_HARNESS_RUNNING: {} 仍在使用数据目录",
            current.display()
        ));
```

</details>

#### 缺口

- 未运行桌面应用、内核、迁移或远程连接
  **影响**：不能证明初始化、数据恢复和兼容性
  **进一步探讨**：固定桌面及内核版本，在可丢弃副本验证关键数据

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验分层就绪与迁移证据？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：分别展示进程启动、核心版本、插件加载和关键文件/链接核对结果，可减少窗口启动或计数成功被误认完全恢复。现有覆盖统计、迁移备份和内核选择是反证，不是原本没有检查；哈希仍不能证明密钥有效或任务可执行。对照现有 UI，用缺失文件、同大小损坏、链接失败和插件不兼容样本测发现率、误报、恢复时间与成本；不改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs:16-32](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs#L16-L32)

已有文件数与字节覆盖检查。

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

**依据 2 · 源码核查**：[apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs:157-162](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/apps/desktop/src-tauri/src/service/data_dir/fs_ops.rs#L157-L162)

链接失败不阻断。

```text
/// 重建一条重复解析点（best-effort）。
///
/// 不跟随链接：pnpm 的 `node_modules` 链接指向全局 store，跟随复制既会成倍放大
/// 数据量，也会让新旧目录共享同一份文件。重建失败（Windows 创建符号链接需要
/// 权限或开发者模式）只告警、不阻断迁移——链接可以由插件重装流程重建，
/// 而数据文件不能重来。
```

**依据 3 · 源码核查**：[apps/desktop/src-tauri/src/service/core/mod.rs:1-14](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/3fada7d06854f9d79b8ed6c021bf88db954cca3d/apps/desktop/src-tauri/src/service/core/mod.rs#L1-L14)

已有核心来源选择。

<details>
<summary>查看原文（14行）</summary>

```text
//! Harness 核心管理。
//!
//! 核心来源：
//! - `local`：用户通过 CLI（npm/pnpm 全局安装）自行安装的 dsh，安装目录与
//!   配置（`$DSH_HOME`）都不归桌面端管理；
//! - `app`：桌面端预打包管理的 deepseek-harness-pkg 多版本副本。激活版本固定
//!   位于 `dependencies/dsh`（既有代码全部依赖该路径），通过「核心」面板下载的
//!   历史版本存放在 `dependencies/dsh-<tag>` 槽位，切换时两个目录互换。debug 与
//!   release 的整个 AppData 根目录不同，因此两套构建不会互换或覆盖对方核心。
//!
//! 启动优先级（需求）：本地核心存在且不低于内置插件基线时优先使用本地核心；未检测到
//! 或低于基线（随包内置插件按推荐核心版本编译，见 [`source`]）才走预打包。用户在
//! 「核心」面板可显式切回预打包；显式选择持久化在 store 设置（`active_core`），
//! `None` = 自动（本地优先）。
```

</details>

#### 缺口

- 未运行桌面应用、内核、迁移或远程连接
  **影响**：不能证明初始化、数据恢复和兼容性
  **进一步探讨**：固定桌面及内核版本，在可丢弃副本验证关键数据

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
