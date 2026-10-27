# DeepSeek Harness Tauri Desktop

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[aea4896](https://github.com/dsh-tauri/deepseek-harness-desktop/tree/aea4896abd505db93cbd988e308d0fbd9a3e4ae1)

<!-- BEGIN META -->
[![GitHub ★ 3,294](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C294&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-tauri/deepseek-harness-desktop)
<!-- END META -->

> **功能**：提供DSH桌面界面、托管运行时和内核、插件与档案管理、数据迁移及移动远程访问。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的贡献是将CLI运行时与内核维护转为清单驱动的桌面管理，并用ABI探测和只缓存Ready避免仅按semver判断。迁移保留源、最后切环境的编排见[Q03](#research-q03)，是具体恢复设计；内置插件数量、桌面截图不是用户收益证据。

> **主要限制**：[Q03](#research-q03)表明迁移covers只检查聚合文件数/字节不少于源，链接重建失败可仅warning。done不能概括为逐文件完整或全部插件恢复；[Q02](#research-q02)的Unknown也允许启动。最影响采用的是用户把这几层就绪当成会话可恢复，本轮无数据损坏复现。

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
  - [Q01 · 桌面应用替用户减少哪一步，根组件是什么？](#detail-section-11)
  - [Q02 · 版本清单和原生探测怎样决定就绪？](#detail-section-12)
  - [Q03 · 迁移完成能否证明数据与插件完全恢复？](#detail-section-13)
  - [Q04 · 使用与迁移全周期成本及退出条件是什么？](#detail-section-14)
  - [Q05 · 分层就绪与关键文件迁移清单是否值得增加？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：这是DSH的第三方Tauri桌面应用与托管环境，不是单一npm插件。面向希望在本机用Harness而不愿手工安装Node/pnpm、管理profile和内核的人。合格结果是能在选定profile启动可用内核、执行预期任务，并在更新/搬迁后找到会话与配置；仅窗口打开或插件数量不能证明任务交付。

自行安装DSH CLI/Node/pnpm，用浏览器和手动目录/版本管理。比较同任务启动、升级、迁移与恢复的人时和结果，非插件数量或窗口外观。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 托管runtime/内核 | 减少用户手工安装 | 普通包可能初次联网，版本按清单 |
| local/app核心选择 | 划分用户与桌面管理环境 | 所有权不同，不随意覆盖全局 |
| 原生探测 | 检查模块与Node加载 | 仅Ready缓存，Unknown不等通过 |
| 数据迁移/回滚 | 复制后切换目录并保留旧源 | 聚合量校验、链接best-effort |
| 桌面管理入口 | profile和插件设置 | 内置列表非全部运行验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 平台WebView/运行库 | 是 | 桌面嵌入界面 | Windows/macOS/Linux要求分别核对 |
| Node/pnpm及DSH内核 | 是，可托管 | 原Agent服务 | 推荐/最低不保证全部插件 |
| 初次下载网络 | 普通包需要 | 缺失运行时与内核 | Bundle仅减少此环节 |
| 模型/provider及外部插件 | 相应任务需要 | 实际模型/能力 | 桌面代理不改模型/子进程网络 |
| 双份数据与备份 | 迁移需要 | 复制和回滚 | 链接/关键内容另验 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份旧数据，选独立profile与内核 | 明确local/app归属 |
| 2 | 应用准备依赖并启动 | 区分Ready/Failed/Unknown与日志 |
| 3 | 用非关键会话执行任务 | 内核/插件/会话分别检查 |
| 4 | 迁移先预检空间再停服 | 复制后查关键文件与链接 |
| 5 | 不符预期时停升级并回滚 | 保留两份数据，核对环境和shim |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装包、缺失runtime/内核下载、模型服务 | 初始化profile/模型 | Bundle减少下载，不等完全离线 |
| 持续使用 | 更新、模型和数据磁盘 | 核对内核/插件兼容、日志 | 金额耗时未知，latest不保证兼容 |
| 迁移 | 双份数据和预留空间 | 停服、复制、关键文件验收 | covers非逐内容校验，链接可失败 |
| 失败/退出 | 保留源备份、可能重装依赖 | 回滚并核对DSH_HOME/PATH/shim | 时间未知，不因卸载推断共享环境复原 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 托管启动 | 资源清单、local/app选择 | 用户净节时及平台实际兼容 |
| ABI治理 | 探测三态、仅Ready缓存 | Unknown仍可启动，非全面加载验收 |
| 迁移恢复 | 先复制、保留源与回滚入口 | 字节完整、链接和实际会话可读 |
| 手机远程 | 作者声明访问电脑内核 | 不在手机运行，权限非只读，未验收 |

> **思考**：[Q03](#research-q03)表明迁移covers只检查聚合文件数/字节不少于源，链接重建失败可仅warning。done不能概括为逐文件完整或全部插件恢复；[Q02](#research-q02)的Unknown也允许启动。最影响采用的是用户把这几层就绪当成会话可恢复，本轮无数据损坏复现。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的贡献是将CLI运行时与内核维护转为清单驱动的桌面管理，并用ABI探测和只缓存Ready避免仅按semver判断。迁移保留源、最后切环境的编排见[Q03](#research-q03)，是具体恢复设计；内置插件数量、桌面截图不是用户收益证据。

重要取舍是Unknown不阻断启动，交由日志兜底。这允许不确定情况下尝试运行，却不应把窗口可开或探测没有明确失败解释成全部原生依赖已验证。可借鉴处是环境声明、探测结论和健康缓存分开；迁移时需维护ABI、可执行身份和缓存失效，而不是只看版本字符串。 迁移路径先检查Harness停止，再复制、扫描目标、验证covers，最后把源改名备份、记原位置、写用户DSH_HOME并刷新shim。环境写失败会尝试把源目录改回，回滚不直接删除当前目录；这些安排让用户可以找到旧数据，明显优于先改环境再移动。

但covers只比较目标文件数和总字节不少于预期，不逐路径比较内容哈希，也不把链接数纳入覆盖条件。复制链接是best-effort，创建失败warning不阻断，理由是依赖链接可重装、数据不能重来。因此“迁移done”支持流程已按这个校验口径走完，不证明每个文件字节相同、所有链接有效或全部插件可加载。

这是一项性能/恢复取舍，不是本轮复现的数据损坏。关键数据路径如会话和凭据若要求强一致，需要独立备份及迁移后读取验收；同数量同字节的内容变化、链接重建失败及其他进程写入不能仅由总数检查排除。会话备份优先排序改善找回入口，但仍不能替代用户确认所恢复的是预期会话。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)表明迁移covers只检查聚合文件数/字节不少于源，链接重建失败可仅warning。done不能概括为逐文件完整或全部插件恢复；[Q02](#research-q02)的Unknown也允许启动。最影响采用的是用户把这几层就绪当成会话可恢复，本轮无数据损坏复现。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)、[Q05](#research-q05)建议有备份的独立profile用户先固定推荐内核，以非关键会话试托管启动与回退。迁移后核对关键会话和链接，不把done或窗口打开当通过；发现缺失就保留源并停止升级迁移。附加许可文本需按自己的使用目标进一步核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持托管版本、原生探测三态与迁移回滚编排；探测未知不等通过，聚合文件/字节校验不等全部内容恢复。未运行桌面、原生模块或迁移。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、LICENSE.details、src-tauri/resources/manifest.jsonc、src-tauri/src/config/manifest.rs、src-tauri/src/service/core/mod.rs、src-tauri/src/service/core/runtime.rs、src-tauri/src/service/data_dir/migrate.rs、src-tauri/src/service/data_dir/fs_ops.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根应用深入托管runtime与数据迁移，其他内置/社区插件只按作者说明定位；不逐项审计，不执行安装、原生探测、目标测试、迁移、宿主或手机。当前private根包不作为npm发布身份。
- 下一步：后续固定桌面安装包、内核、平台及profile，检查启动、ABI失败/未知、关键会话迁移、链接/磁盘错误与环境回退，并记录人工成本。

**分析版本**

- **仓库**：[dsh-tauri/deepseek-harness-desktop](https://github.com/dsh-tauri/deepseek-harness-desktop)
- **版本号**：0.25.0（[固定提交 aea4896](https://github.com/dsh-tauri/deepseek-harness-desktop/tree/aea4896abd505db93cbd988e308d0fbd9a3e4ae1)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的分层就绪与关键路径迁移清单。对会话等关键文件核对路径/哈希/链接，区分运行时、内核、插件、会话结果；用同体积变更/链接失败/未知探测/磁盘满对照误读和定位耗时，无增益或开销过大则停止。

后续固定桌面安装包、内核、平台及profile，检查启动、ABI失败/未知、关键会话迁移、链接/磁盘错误与环境回退，并记录人工成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 69 | 8736 | — | — | 131310 |
| .js | source | 5 | 260 | 201 | 48 | — |
| .ts | source | 842 | 60711 | 50699 | 5218 | — |
| .md | test | 2 | 330 | — | — | 4674 |
| .mjs | source | 8 | 1738 | 1491 | 126 | — |
| .tsx | test | 65 | 17017 | 15327 | 491 | — |
| .tsx | source | 144 | 23335 | 21111 | 1030 | — |
| .ts | test | 400 | 80262 | 67986 | 4064 | — |
| .ts | example | 1 | 65 | 57 | 3 | — |
| .mjs | test | 3 | 582 | 546 | 9 | — |
| .mjs | example | 3 | 579 | 552 | 4 | — |
| .md | example | 1 | 29 | — | — | 273 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/dsh-tauri/deepseek-harness-desktop/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：托管运行时和迁移如何降低DSH安装负担，兼容与恢复能证明到哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面应用替用户减少哪一步，根组件是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是DSH的第三方Tauri桌面应用与托管环境，不是单一npm插件。面向希望在本机用Harness而不愿手工安装Node/pnpm、管理profile和内核的人。合格结果是能在选定profile启动可用内核、执行预期任务，并在更新/搬迁后找到会话与配置；仅窗口打开或插件数量不能证明任务交付。

简单基线是自行安装DSH CLI和运行时，用浏览器访问，再手动管理版本和数据目录。桌面应用的增量是把运行时/内核选择、资源清单、原生界面和数据迁移组织到统一入口，普通用户少维护全局Node/pnpm。复杂性转移到发行清单、原生模块适配和应用数据目录，不会消失。

README列多个内置插件和可选社区预设，本轮不据列名确认每项能力运行或把全部视为根原创。移动端只是远程访问电脑内核，不在手机运行DSH；“无需手动装运行时”也不等于完全离线，普通安装首次可能下载且模型/素材/插件仍联网。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-11](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/README.md#L7-L11)

作者定位托管桌面与初次联网。

```text
<h1 align="center">DeepSeek Harness Tauri 桌面版</h1>

<p align="center">
  在桌面上运行 <a href="https://github.com/deepseek-ai/deepseek-harness">DeepSeek Harness</a> ——<br />
  无需手动安装 Node.js、pnpm 或 Docker；普通安装首次启动可能需要联网初始化。
```

**依据 2 · 作者声明**：[README.md:45-55](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/README.md#L45-L55)

应用管理能力声明，不以数量推价值。

<details>
<summary>查看原文（11行）</summary>

```text
## 功能

- 🪶 **原生桌面** — Tauri 2 + React 19 + Hero 3，内嵌本地 Harness 界面。
- 📱 **远程连接** — Android / iOS 移动端扫码连接电脑上的 DSH，支持局域网与 Cloudflare 公网隧道。
- 🔄 **运行时管理** — 安装依赖、选择内核版本，并提供桌面端与内核更新入口。
- 🧩 **插件管理** — 12 个内置插件；支持本地路径安装、内置插件停用、社区插件安装、升级、卸载与错误查看。
- 🗂️ **档案配置** — 分别管理插件与设置，支持一键迁移档案数据、备份、克隆；
- 💽 **数据目录** — 安装时（Windows）可选择数据存放位置；能在设置里整体迁移与回滚。
- ⌨️ **命令行集成** — 通过托管 shim 提供 `dsh` / `pnpm` 命令行工具，不是全局 npm 内核安装。
- 🐾 **桌宠** — Pets / Codex 资源管理、资源包导入与会话状态展示；预设素材来自远端。
- 🎨 **个性化** — 8 种配色、本机界面缩放、终端模式，以及可调不透明度与可选磨砂模糊。
```

</details>

**依据 3 · 作者声明**：[README.md:111-130](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/README.md#L111-L130)

安装、联网与移动边界。

<details>
<summary>查看原文（20行）</summary>

```text
- 普通安装包首次启动需联网下载缺失的运行时与内核；Git 功能需要可用的 Git。
- 包含 `Bundle` 后缀为离线安装包（`_Bundle_*.exe`、`_Bundle_*.deb`、两种 `_Bundle_*.dmg`）。
- 本地运行不等于完全离线：模型服务、插件安装、更新与桌宠预设素材仍可能联网。
- Linux 显示、Wayland、AppImage 与权限问题的处理见[安装与故障排查文档](https://dshtauri.mintlify.site/zh-CN/help/troubleshooting)。

### 桌面代理

- 在**配置 → 应用 → 代理地址**设置 HTTP、HTTPS、SOCKS5 或 SOCKS5H 代理。
- 仅用于桌面端依赖/内核下载、更新检查及插件元数据，不修改模型请求或插件子进程的网络配置。
- 留空沿用系统/环境代理；保存后对新请求生效，可重试失败的下载。
- SOCKS5H 通过代理解析目标域名；本机回环连接始终直连。

## 移动端支持

**DSH Mobile** 通过局域网或公网隧道访问电脑上的 Harness，不在手机运行内核。

- **Android**：从 [Releases](https://github.com/dsh-tauri/deepseek-harness-desktop/releases) 下载 APK。
- **iOS**：通过 [TestFlight 邀请](https://testflight.apple.com/join/kYXkpnp1)安装测试版，以审核与名额为准；Release 中的未签名 IPA 需自行签名。

在桌面顶部**远程**开启分享，手机扫码配对；电脑、Harness 与所用隧道须在线。远程访问并非只读，请勿公开二维码或访问码，详见[手机远程访问指南](https://dshtauri.mintlify.site/zh-CN/guides/mobile-remote-access)。
```

</details>

**依据 4 · 源码核查**：[package.json:1-8](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/package.json#L1-L8)

根私有应用包身份。

```text
{
  "name": "deepseek-harness-desktop",
  "type": "module",
  "version": "0.25.0",
  "private": true,
  "packageManager": "pnpm@11.7.0",
  "description": "Desktop application for DeepSeek Harness (dsh) — one-click local install and launch, no Node.js setup required.",
  "main": "./src-native/entry.ts",
```

#### 缺口

- 目标用户相比CLI的实际节时和维护负担未知
  **影响**：不能将一次安装入口等同全周期更简单
  **进一步探讨**：固定同一任务比较CLI与桌面首次/升级/恢复所需人工和完成率

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 版本清单和原生探测怎样决定就绪？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

manifest区分推荐和最低DSH版本、托管Node/pnpm路径与可覆盖入口；配置结构支持插件版本与内核版本配对。core模块又区分local与app：local由用户CLI维护，app为桌面管理的多版本预打包副本；自动选择优先满足基线的本地核心，显式选择持久化。不能把桌面推荐版本推成每个插件在任意更新内核下兼容。

runtime模块针对semver允许但原生ABI不匹配的问题，在启动前尝试加载原生模块。它区分Ready、Failed与Unknown，只有Ready写入指纹戳；指纹覆盖Node身份、核心和node_modules概要，变更后重新探测。扫描失败不输出成功标记，避免把“未扫完的空失败列表”当通过。

重要取舍是Unknown不阻断启动，交由日志兜底。这允许不确定情况下尝试运行，却不应把窗口可开或探测没有明确失败解释成全部原生依赖已验证。可借鉴处是环境声明、探测结论和健康缓存分开；迁移时需维护ABI、可执行身份和缓存失效，而不是只看版本字符串。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/resources/manifest.jsonc:1-61](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/resources/manifest.jsonc#L1-L61)

推荐/最低内核、运行时与入口的声明。

<details>
<summary>查看原文（61行）</summary>

```text
{
  "engines": {
    "dsh": {
      "recommend": "0.2.1-rc.2",
      "minimum": "0.1.7-rc.1"
    },
    "node": {
      "version": ">=22.22.0"
    },
    "pnpm": {
      "version": ">=11.7.0",
      "sha256": "deafa7ec98a1218b6a047289b92fbe2395c1e22d3495bb711653013218ee15ee"
    },
    "git": {
      "version": ">2.53.0.2",
      "sha256": {
        "x64": "d4bf83d6a860ccae9af44e508e1e00a39f09db6fa78a9ba5543b94d87ca22a29",
        "arm64": "842d50edc6bbcf39693e60a8ebb9dabb89b96b932b63aae12d218522b3e497f3"
      }
    }
  },
  "dependencies": {
    // 依赖映射规范：AppData 的 dependencies.json 只记录每个依赖的安装根
    // （null = 用系统环境）；入口相对路径与默认托管根以本表为准。
    // managedRoot / 映射值支持三种形态：
    //   $AppData/...    AppData 数据目录（debug 构建为 <base>/dev 的同级）
    //   $Resources/...  安装包资源目录（`resources/...` 为等价旧写法）
    //   绝对路径         任意位置（如加载本地捆绑版内核）
    "node": {
      "engine": ">=22.22.0",
      "entry": {
        "windows": "node.exe",
        "default": "bin/node"
      },
      "managedRoot": "$AppData/runtime",
      "overridable": true
    },
    "pnpm": {
      "engine": ">=11.7.0",
      "entry": "bin/pnpm.cjs",
      "managedRoot": "$AppData/dependencies/pnpm",
      "overridable": true
    },
    "dsh": {
      "engine": {
        "recommend": "0.2.1-rc.2",
        "minimum": "0.1.7-rc.1"
      },
      "entry": "node_modules/@deepseek-ai/dsh/lib/bin.js",
      "managedRoot": "$AppData/dependencies/dsh",
      "overridable": true
    },
    "git": {
      "engine": ">2.53.0.2",
      "entry": {
        "windows": "cmd/git.exe",
        "default": "bin/git"
      },
      "managedRoot": "$AppData/dependencies/git",
      "overridable": true
    }
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/config/manifest.rs:56-86](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/config/manifest.rs#L56-L86)

插件兼容版本声明结构。

<details>
<summary>查看原文（31行）</summary>

```text
/// 插件清单条目
#[derive(Debug, Clone, Default, serde::Serialize, Deserialize)]
#[serde(default)]
pub struct PluginEntry {
    pub id: String,
    pub spec: String,
    pub name: String,
    pub description: String,
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
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/service/core/mod.rs:1-22](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/core/mod.rs#L1-L22)

local/app所有权和选择。

<details>
<summary>查看原文（22行）</summary>

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
//!
//! 模块划分（参考 `service/cli/`、`service/download/`）：
//! - [`local`]：本地核心发现（PATH/全局安装目录探测、包目录解析、更新本地核心）
//! - [`source`]：核心来源与活动入口（`CoreSource` / `HarnessCore` / 活动核心）
//! - [`version`]：预打包核心多版本管理（列出 / 切换 / 下载 / 卸载）
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/service/core/runtime.rs:1-11](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/core/runtime.rs#L1-L11)

ABI不等semver的具体问题背景。

<details>
<summary>查看原文（11行）</summary>

```text
//! 活动预打包核心的运行时自愈：补齐插件入口并检查原生依赖（含 ABI 兼容性）。
//!
//! 用户插件由各自 profile 解析；共享核心只链接安装包内置插件，避免跨档案覆盖入口。
//! 用户自行安装的 local 核心不归桌面端管理，明确跳过本模块。
//!
//! 除了入口链接，启动前还要确认核心的原生模块能真正被当前 Node 运行时加载：
//! 预打包核心的原生模块（`fs-ext` 这类 node-gyp 包）在 pkg 构建期编译，ABI 只与
//! 构建期 Node 大版本一致；而本地 Node 只按 semver 挑选（`is_supported_node_version`），
//! 因此 Node 25（ABI 141）会加载 ABI 137 的 `fs_ext.node` 失败，dsh 在插件树加载
//! 阶段退出、前端只看到 `HARNESS_NOT_OWNED`（issue #441）。这里在 spawn 之前探测，
//! 先尝试与核心对齐的捆绑运行时，再尝试重建，最后给出可读的 ABI 诊断。
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/service/core/runtime.rs:45-69](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/core/runtime.rs#L45-L69)

只缓存Ready及指纹边界。

<details>
<summary>查看原文（25行）</summary>

```text
/// 已核验通过的原生依赖结论戳（issue #766）。
///
/// 探测要启动 node 子进程、把核心 `node_modules` 下每个原生包 require 一遍，前面还要
/// 再起一个子进程探测平台/架构，健康机器上这两步是纯开销。而结论在「同一个 node
/// 运行时 + 同一份核心 `node_modules`」下是稳定的，把结论连同输入指纹落到基础目录，
/// 命中即直接放行。
///
/// 只写 Ready：失败/未知一律不落盘，绝不把一次性修复结果固化成「以后都不用查」。
/// 指纹覆盖所有会造成结论变化的现实可变项——node 可执行文件身份（路径 + 大小 +
/// 修改时间）、核心目录与核心版本、`node_modules` 前两层的条目（名字 + 修改时间）：
/// 核心更新、node 升级/替换、平台包增删、`node_modules` 被重建都会失配，从而必然
/// 重新探测。清空依赖目录或删掉这个文件即可强制回到「每次探测」。
///
/// 指纹全部条目参与计算后压成 SHA-256 摘要再落盘：真实安装（pnpm 虚拟 store）
/// 的条目数已远超早先的固定上限，而摘要与条目数无关，比对精度不受规模影响。
const NATIVE_PROBE_STAMP_FILE: &str = "core-native-probe.stamp.json";
/// 指纹采集的条目上限：只在 `node_modules` 异常膨胀时兜底，正常安装远低于它
const NATIVE_PROBE_STAMP_MAX_ENTRIES: usize = 8192;
/// 原生模块探测脚本：列出无法被当前运行时加载的原生模块。
///
/// 1. `sharp` / `koffi`：NAPI 可选依赖，缺目标平台包时动态 import 失败（原有修复路径）；
/// 2. 原生包：带 `binding.gyp` 或自带原生产物目录（`build/Release`、`build/Debug`、
///    `prebuilds`、`prebuilt`）的包，逐个 require —— 与 dsh 自身的加载方式一致，
///    加载失败即为 dsh 启动时同样的失败（fs-ext 这类 node-gyp 包落在 build/Release）。
///    崩溃/异常退出时不会有标记行，Rust 侧按"结论未知"处理，不阻断启动。
```

</details>

**依据 6 · 源码核查**：[src-tauri/src/service/core/runtime.rs:129-174](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/core/runtime.rs#L129-L174)

扫描未知与三态结论，不阻断Unknown。

<details>
<summary>查看原文（46行）</summary>

```text
} catch (error) {
  process.stderr.write('native addon scan failed: ' + describe(error) + '\n');
  incomplete = true;
}
// 扫描没做完就不输出标记行：Rust 侧据此拿到「结论未知」（进而回退到 sharp/koffi
// 探测、不写结论戳），而不是一份「没有失败」的空清单被误判成 Ready。
if (!incomplete) process.stdout.write('__DSH_NATIVE_PROBE__' + JSON.stringify(failures) + '\n');
"#;

#[derive(Debug, Clone, PartialEq, Eq)]
struct NodeTarget {
    platform: String,
    arch: String,
}

/// 单个原生模块的加载失败记录（由探测脚本以 JSON 输出）
#[derive(Debug, Clone, PartialEq, Eq, serde::Deserialize)]
struct NativeProbeFailure {
    /// `import`：sharp/koffi 可选依赖；`addon`：带 binding.gyp 的原生包
    #[serde(default)]
    kind: String,
    /// 包名（作用域包为 `@scope/name`）
    #[serde(default)]
    name: String,
    #[serde(default)]
    message: String,
    /// 是否为 Node ABI 不匹配（错误文本含 NODE_MODULE_VERSION）
    #[serde(default)]
    abi: bool,
}

impl NativeProbeFailure {
    fn is_platform_import(&self) -> bool {
        self.kind == "import"
    }
}

/// 原生模块探测结果
#[derive(Debug, Clone, PartialEq, Eq)]
enum NativeProbe {
    /// 全部原生模块均可被当前运行时加载
    Ready,
    /// 探测完成，存在加载失败的模块
    Failed(Vec<NativeProbeFailure>),
    /// 探测无法得出结论（脚本崩溃/超时/输出不可解析）：不阻断启动，交由服务日志兜底
    Unknown(String),
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 迁移完成能否证明数据与插件完全恢复？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

迁移路径先检查Harness停止，再复制、扫描目标、验证covers，最后把源改名备份、记原位置、写用户DSH_HOME并刷新shim。环境写失败会尝试把源目录改回，回滚不直接删除当前目录；这些安排让用户可以找到旧数据，明显优于先改环境再移动。

但covers只比较目标文件数和总字节不少于预期，不逐路径比较内容哈希，也不把链接数纳入覆盖条件。复制链接是best-effort，创建失败warning不阻断，理由是依赖链接可重装、数据不能重来。因此“迁移done”支持流程已按这个校验口径走完，不证明每个文件字节相同、所有链接有效或全部插件可加载。

这是一项性能/恢复取舍，不是本轮复现的数据损坏。关键数据路径如会话和凭据若要求强一致，需要独立备份及迁移后读取验收；同数量同字节的内容变化、链接重建失败及其他进程写入不能仅由总数检查排除。会话备份优先排序改善找回入口，但仍不能替代用户确认所恢复的是预期会话。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/service/data_dir/migrate.rs:114-188](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/data_dir/migrate.rs#L114-L188)

停服、复制、校验、改名与环境写入次序。

<details>
<summary>查看原文（75行）</summary>

```text
/// 执行迁移：复制 → 校验 → 旧目录改名 → 记录原位置 → 改写用户级 `DSH_HOME`。
///
/// 顺序刻意如此：改名与环境变量写在最后，前面任何一步失败都不会让用户失去原目录。
pub(super) fn run(
    app_handle: &AppHandle,
    source: &Path,
    target: &Path,
    emit: ProgressSink<'_>,
) -> Result<MigrationOutcome, String> {
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
    std::env::set_var(env::DATA_DIR_ENV, &text);
    refresh_shims(app_handle, target);

    emit(step("migrate", "done", copied.files, copied.bytes, expected.files, expected.bytes));
    Ok(MigrationOutcome {
        source: source.to_string_lossy().into_owned(),
        target: text,
        moved_to: moved.to_string_lossy().into_owned(),
        files: copied.files,
        bytes: copied.bytes,
        links: copied.links,
        sessions: fs_ops::count_sessions(target),
    })
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/service/data_dir/fs_ops.rs:16-32](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/data_dir/fs_ops.rs#L16-L32)

covers仅总文件和字节>=，链接单列。

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

**依据 3 · 源码核查**：[src-tauri/src/service/data_dir/fs_ops.rs:123-175](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/data_dir/fs_ops.rs#L123-L175)

复制与链接best-effort，失败不等同全部恢复。

<details>
<summary>查看原文（53行）</summary>

```text
/// 递归复制目录树到 `dst`（目标必须已存在或可创建，且不得是源的子孙）。
///
/// 顶层条目并行处理（同 `service::profile::copy_dir_tree`）：pnpm 档案下
/// `node_modules` 层级深、文件多，串行复制会让 900MB 的迁移明显变慢。
pub(super) fn copy_tree(src: &Path, dst: &Path, progress: &CopyProgress) -> Result<(), String> {
    fs::create_dir_all(dst).map_err(|e| format!("DATA_DIR_COPY_MKDIR: {}: {e}", dst.display()))?;
    let read_dir =
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
fn copy_link(src: &Path, dst: &Path) {
    let Ok(target) = fs::read_link(src) else {
        log::warn!("DATA_DIR_COPY_LINK_READ: {}", src.display());
        return;
    };
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

**依据 4 · 源码核查**：[src-tauri/src/service/data_dir/migrate.rs:23-45](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/data_dir/migrate.rs#L23-L45)

备份按会话数/时间排序，便于发现不证明内容正确。

<details>
<summary>查看原文（23行）</summary>

```text
/// 发现可回滚的旧目录备份。
///
/// 搜索三处（issue E）：当前数据目录旁边、默认目录旁边、上次迁移记录的原位置旁边。
/// 跨盘搬家时旧目录留在原盘，既不在当前目录旁边也不在默认目录旁边，只有第三处能找到。
/// 排序用「会话数优先、时间戳其次」（issue G）：会话是用户唯一无法重建的数据，
/// 一个没有会话的新备份不该盖过旧备份被自动选中。
pub(super) fn find_backups(app_handle: &AppHandle, current: &Path) -> Vec<MigrationBackup> {
    let default = env::default_home();
    let recorded = state::read_last_migration(app_handle).map(PathBuf::from);
    let mut backups: Vec<MigrationBackup> =
        collect_backups(&search_places(current, &default, recorded.as_deref()))
            .into_iter()
            .map(|path| MigrationBackup {
                sessions: fs_ops::count_sessions(&path),
                stamp: stamp_of(&path),
                path: path.to_string_lossy().into_owned(),
            })
            .collect();
    backups.sort_by(|a, b| {
        b.sessions
            .cmp(&a.sessions)
            .then_with(|| b.stamp.cmp(&a.stamp))
    });
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/service/data_dir/migrate.rs:191-195](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/data_dir/migrate.rs#L191-L195)

回滚保留当前数据目录。

```text
/// 回滚到旧目录备份。
///
/// `backup` 为空时按 `find_backups` 的顺序取第一个（会话数优先、时间戳其次，与恢复
/// 脚本同一规则）。当前数据目录不会被删除——脚本同样只提示、不删除，两份数据同时
/// 存在才是「一键回滚」敢按下去的前提。
```

#### 缺口

- 关键会话文件内容及链接可用性在真实迁移后是否一致
  **影响**：不能把聚合覆盖检查当字节完整性或业务恢复保证
  **进一步探讨**：在备份副本对关键路径哈希、链接及会话读取做对照，包含磁盘满/权限/中断条件

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用与迁移全周期成本及退出条件是什么？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断

#### 完整回答

普通安装依赖系统WebView/平台运行库及首次网络，Bundle包减少首次下载但不消除模型/插件网络。桌面代理设置只管下载、更新和插件元数据，不改模型或插件子进程代理；所以“下载已走代理”不能作为模型请求已可达的证据。升级需核对推荐/最低内核和插件版本，不能只按latest。

首次成本是下载、初始化、profile及模型设置；持续成本是更新、存储和模型使用，迁移额外需要双份数据与停服时间，空间计划有5%余量但不提供实际耗时保证。失败时要区分下载、ABI、数据目录、链接和宿主日志；回退应先保留旧目录再核对会话，不用清会话来解决启动错误。所有金额、人工时间和恢复时长未知。

许可证文件在MIT之外附加No Commercial Secondary Development，文本明确商业直接使用允许、商业二次开发受限。本报告仅记录仓库声明，不将其概括为无条件MIT，也不给法律适用判断。想移植代码到付费产品的人要先解决自己的许可适用问题。个人有备份的非关键profile可试；退出需明确local/app核心与DSH_HOME/shim所有权，不以卸载应用推断所有用户数据和PATH均已回原状。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:92-121](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/README.md#L92-L121)

系统/联网/代理用途条件。

<details>
<summary>查看原文（30行）</summary>

````text
| 平台 | 要求 | 安装包 |
| --- | --- | --- |
| Windows | Windows 10+、WebView2 | x64 `.exe` / `.msi` |
| macOS | macOS 12+；Web 界面需 Safari 17.4+ 能力 | Intel / Apple Silicon `.dmg` |
| Linux | WebKit2GTK 4.1 运行库 | x64 `.AppImage` / `.deb` |

macOS 也可通过 Homebrew 安装：

```bash
brew install dsh-tauri/desktop/deepseek-harness
```

Fedora 43+（x64 / ARM64）可通过 Copr 仓库安装，升级随 `dnf upgrade` 进行，应用内更新已关闭；想跟进预发布版可改装 `dsh-tauri-beta`（与 `dsh-tauri` 互斥，用 `sudo dnf swap dsh-tauri dsh-tauri-beta` 切换）：

```bash
sudo dnf copr enable fairyband/dsh-tauri
sudo dnf install dsh-tauri        # 正式版
```

- 普通安装包首次启动需联网下载缺失的运行时与内核；Git 功能需要可用的 Git。
- 包含 `Bundle` 后缀为离线安装包（`_Bundle_*.exe`、`_Bundle_*.deb`、两种 `_Bundle_*.dmg`）。
- 本地运行不等于完全离线：模型服务、插件安装、更新与桌宠预设素材仍可能联网。
- Linux 显示、Wayland、AppImage 与权限问题的处理见[安装与故障排查文档](https://dshtauri.mintlify.site/zh-CN/help/troubleshooting)。

### 桌面代理

- 在**配置 → 应用 → 代理地址**设置 HTTP、HTTPS、SOCKS5 或 SOCKS5H 代理。
- 仅用于桌面端依赖/内核下载、更新检查及插件元数据，不修改模型请求或插件子进程的网络配置。
- 留空沿用系统/环境代理；保存后对新请求生效，可重试失败的下载。
- SOCKS5H 通过代理解析目标域名；本机回环连接始终直连。
````

</details>

**依据 2 · 作者声明**：[README.md:142-150](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/README.md#L142-L150)

版本和CLI shim边界。

```text
| 当前基线 | 版本 |
| --- | --- |
| 推荐 Harness 内核 | `0.2.1-rc.2` |
| 支持的内核最低版本 | `0.1.7-rc.1`，不保证所有插件兼容 |

更早内核不再支持；旧兼容记录仅保留历史事实，不代表当前支持范围。

- 内核与预设选择遵循[资源清单](<./src-tauri/resources/manifest.jsonc>)及插件声明的版本范围；不保证任意最新上游版本都兼容。
- 正式版默认启用 CLI 集成：Windows / macOS / Linux 自动更新 PATH。需重新打开终端，其他 shell 仍需要手动配置。
```

**依据 3 · 源码核查**：[LICENSE.details:1-14](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/LICENSE.details#L1-L14)

附加许可文本，非本研究法律判断。

<details>
<summary>查看原文（14行）</summary>

```text
Additional Terms — No Commercial Secondary Development

This file supplements the MIT License in the LICENSE file. In addition to the
rights and conditions granted there, the following condition applies to the
Software:

1. No Commercial Secondary Development: The Software may not be used for
   secondary development (including but not limited to modification,
   adaptation, or derivation) for commercial gain, monetary compensation,
   or as part of a paid commercial product or service. Direct use of the
   Software itself for commercial purposes remains permitted.

In the event of any conflict between the MIT License and these additional
terms, these additional terms prevail.
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/service/data_dir/migrate.rs:83-111](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/data_dir/migrate.rs#L83-L111)

迁移空间与只读预检。

<details>
<summary>查看原文（29行）</summary>

```text
/// 迁移预检：目标合法性、体积与磁盘空间。
///
/// 这里**不**检查 Harness 是否已退出：预检是只读的（`preview_data_dir_migration` 不停服），
/// 而用户点「预检」时 Harness 通常正在运行。停服由迁移命令本身完成，真正的安全网在
/// [`run`] 开头——那里一定已经停服，且是动手改盘前的最后一道检查。
pub(super) fn plan(
    app_handle: &AppHandle,
    source: &Path,
    target: &Path,
) -> Result<MigrationPlan, String> {
    validate_target(source, target)?;
    let mut stats = TreeStats::default();
    fs_ops::scan_tree(source, &mut stats)?;
    let free = env::free_bytes(target);
    let needed = stats.bytes + stats.bytes / 100 * SPACE_MARGIN_PERCENT;
    let remembered = state::read_last_migration(app_handle)
        .map(PathBuf::from)
        .is_some_and(|recorded| same_path(&recorded, target));
    Ok(MigrationPlan {
        source: source.to_string_lossy().into_owned(),
        target: target.to_string_lossy().into_owned(),
        total_files: stats.files,
        total_bytes: stats.bytes,
        links: stats.links,
        target_free_bytes: free.unwrap_or(0),
        enough_space: free.is_none_or(|available| available >= needed),
        parent_exists: target.parent().is_some_and(Path::exists),
        remembered,
    })
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/service/core/mod.rs:3-17](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/core/mod.rs#L3-L17)

用户local与托管app所有权。

<details>
<summary>查看原文（15行）</summary>

```text
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

#### 缺口

- 目标机器恢复原DSH_HOME、PATH及local/app切换的实际可逆性未知
  **影响**：退出成本与共享环境影响需核对
  **进一步探讨**：在独立profile记录迁移/卸载前后环境及shim，确认旧CLI与会话可用

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 分层就绪与关键文件迁移清单是否值得增加？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是把桌面“已启动”细分为运行时可加载、内核可服务、所选插件可加载和会话可读取；迁移时对用户关键文件生成路径/大小/哈希与链接恢复清单，只在该层验收后显示对应结论。Q02的Ready/Unknown与Q03的聚合covers都支持需要避免层级混淆，不能从启动或总字节推最终任务恢复。

代价是额外磁盘读取、隐私元数据、哈希耗时与状态失效规则，不能一律对可重建node_modules全量加重校验。最小验证先用真实结构的备份副本，包含同体积内容变更、符号链接失败、原生探测未知与磁盘满，比较原UI和分层清单的误以为成功次数、定位时间和总迁移时长。不能降低误读或显著增加负担则停止。

当前建议有独立profile和完整备份、希望减少CLI安装的人小范围试托管启动，先固定推荐内核，再用非关键会话验收与回退。旧会话缺失、链接损坏、原生未知被当通过或退出改坏共享环境时，停止迁移/升级并从保留目录恢复，不继续删除备份。根应用不宣称全部内置插件已测试通过。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/service/core/runtime.rs:166-174](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/core/runtime.rs#L166-L174)

三态探测为分层就绪起点。

```text
/// 原生模块探测结果
#[derive(Debug, Clone, PartialEq, Eq)]
enum NativeProbe {
    /// 全部原生模块均可被当前运行时加载
    Ready,
    /// 探测完成，存在加载失败的模块
    Failed(Vec<NativeProbeFailure>),
    /// 探测无法得出结论（脚本崩溃/超时/输出不可解析）：不阻断启动，交由服务日志兜底
    Unknown(String),
```

**依据 2 · 源码核查**：[src-tauri/src/service/data_dir/fs_ops.rs:16-32](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/data_dir/fs_ops.rs#L16-L32)

聚合覆盖不等内容证明，推导关键路径清单。

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

**依据 3 · 源码核查**：[src-tauri/src/service/data_dir/migrate.rs:114-188](https://github.com/dsh-tauri/deepseek-harness-desktop/blob/aea4896abd505db93cbd988e308d0fbd9a3e4ae1/src-tauri/src/service/data_dir/migrate.rs#L114-L188)

已有保留源的顺序是可扩展恢复基础。

<details>
<summary>查看原文（75行）</summary>

```text
/// 执行迁移：复制 → 校验 → 旧目录改名 → 记录原位置 → 改写用户级 `DSH_HOME`。
///
/// 顺序刻意如此：改名与环境变量写在最后，前面任何一步失败都不会让用户失去原目录。
pub(super) fn run(
    app_handle: &AppHandle,
    source: &Path,
    target: &Path,
    emit: ProgressSink<'_>,
) -> Result<MigrationOutcome, String> {
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
    std::env::set_var(env::DATA_DIR_ENV, &text);
    refresh_shims(app_handle, target);

    emit(step("migrate", "done", copied.files, copied.bytes, expected.files, expected.bytes));
    Ok(MigrationOutcome {
        source: source.to_string_lossy().into_owned(),
        target: text,
        moved_to: moved.to_string_lossy().into_owned(),
        files: copied.files,
        bytes: copied.bytes,
        links: copied.links,
        sessions: fs_ops::count_sessions(target),
    })
```

</details>

#### 缺口

- 分层清单能否减少真实用户恢复误读，关键路径选取是否完整
  **影响**：仅新假设，不计已有工程贡献
  **进一步探讨**：先在副本注入四类失败，比较误读、定位时间和开销

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
