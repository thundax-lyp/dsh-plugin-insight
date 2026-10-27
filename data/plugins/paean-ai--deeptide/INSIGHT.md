# DeepTide

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b48688d](https://github.com/paean-ai/deeptide/tree/b48688d56c3eb61d0c028de2fa73dd674be2f3e8)

<!-- BEGIN META -->
[![GitHub ★ 1,105](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C105&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/paean-ai/deeptide) [![npm 30d 100](https://img.shields.io/static/v1?label=npm+30d&message=100&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deeptide) [![最新发布 2026-05-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-05-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deeptide)
<!-- END META -->

> **功能**：提供 DeepTide 编码客户端入口、Zero CLI 命令别名、Rust实现与 Apple Silicon 本地推理引导。

> **亮点**：根npm普通路径主要是Zero CLI命令入口包装；仓库另有Rust与本地bootstrap，不能把全部上游工具算根原创或同版能力。[Q01](#research-q01)

> **主要限制**：不同形态的权限、资源和成功信号容易混读；本地自测失败exitCode2后仍写settings，npm安装成功也不证明Rust二进制已下载。[Q03](#research-q03)

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
  - [Q01 · 这个仓库与deeptide npm包分别代表什么？](#detail-section-11)
  - [Q02 · 本地bootstrap如何选择资源并改配置？](#detail-section-12)
  - [Q03 · 权限模式和自测失败能否给可靠采用保证？](#detail-section-13)
  - [Q04 · 已有DeepSeek用户应从什么最小范围试起？](#detail-section-14)
  - [Q05 · 怎样避免本地自测失败却切换现用Agent配置？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要DeepSeek编码客户端或本地模型的开发者，先区分Zero别名/Rust/原生形态再选；合格结果是可审代码任务。[Q01](#research-q01)

直接Zero CLI或已有编码客户端，local另对照云API；根品牌入口不等独立新Agent机制。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| deeptide/tide | 编码CLI入口 | 普通路径依赖外部Zero CLI/Bun |
| tide local | Apple Silicon本地引导 | native布局/大内存；失败仍需核配置 |
| Rust形态 | 独立客户端实现 | 独立发行与权限，不归根npm字节 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Bun和上游Zero CLI | 根普通CLI必需 | 实际Agent执行 | Node声明不替代Bun |
| 平台Rust发行物 | Rust形态必需 | 原生客户端 | 安装未下载则首运行失败 |
| Apple Silicon/native源码与大内存 | 本地路线必需 | 构建gateway和模型 | 先doctor，不满足停止 |
| API凭据或有效本地模型 | 任务必需 | 推理 | 无推理不等任务完成 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选择 | 用户固定单一形态和版本 | 别名/Rust/native不混读 |
| 准备 | 用户备份配置并doctor/dry-run | 资源与路径满足 |
| 核验 | 用户可丢弃repo检查工具往返 | 自测失败不切现用配置 |
| 退出 | 用户停服务并恢复settings | 不能只删CLI |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Bun或原生运行物；local需大内存/权重 | 选形态、审来源、备份配置 | 普通npm不含native布局 |
| 持续使用 | 云模型或本地硬件/电力 | diff、测试和模型结果复核 | 合格任务成本未知 |
| 失败恢复 | 下载/构建/重试资源 | 停LaunchAgent、恢复settings | 自测失败不阻写配置 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 命令别名 | 普通路径转Zero CLI | 实际上游版本任务质量 |
| 本地引导 | 资源计划和服务/自测步骤 | 模型效果、稳定与总成本 |
| Rust客户端 | 独立源码和模式定义 | 不能套到根npm权限 |

> **思考**：不同形态的权限、资源和成功信号容易混读；本地自测失败exitCode2后仍写settings，npm安装成功也不证明Rust二进制已下载。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：根npm普通路径主要是Zero CLI命令入口包装；仓库另有Rust与本地bootstrap，不能把全部上游工具算根原创或同版能力。[Q01](#research-q01)

平台/资源计划和dry-run可借鉴，形态与版本边界需明确；自测和配置提交应分别处理，不从小客户端体积推模型可运行。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

不同形态的权限、资源和成功信号容易混读；本地自测失败exitCode2后仍写settings，npm安装成功也不证明Rust二进制已下载。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议先观察并固定单一形态和上游版本；本地profile不满足或自测失败时不继续切配置，保留原客户端/云API作为退路。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

命令分派、本地资源条件和自测后配置行为有源码支持；外部上游、真实任务、权限和本地模型效果未验证。两阶段配置为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、bin.js、scripts/tide-local.mjs、crates/deeptide-core/src/permissions.rs、npm/deeptide-rs/install.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定README/manifest/bin、本地引导、Rust权限定义及Rust包安装器；未完整审Swift/Rust loop或外部Zero CLI，未构建、下载模型、执行测试或客户端。Rust/Swift不计JS/TS LOC。
- 下一步：固定单一形态与用户目录，四类bootstrap故障核配置/进程归属，再做真实编码任务；本轮未执行。[Q05](#research-q05)

**分析版本**

- **仓库**：[paean-ai/deeptide](https://github.com/paean-ai/deeptide)
- **版本号**：0.11.8（[固定提交 b48688d](https://github.com/paean-ai/deeptide/tree/b48688d56c3eb61d0c028de2fa73dd674be2f3e8)）
- **版本日期**：2026-08-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是在临时profile自测后才提交现用配置，失败保留原状态，以故障注入比较配置变动和残留服务。[Q05](#research-q05)

固定单一形态与用户目录，四类bootstrap故障核配置/进程归属，再做真实编码任务；本轮未执行。[Q05](#research-q05)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 196 | 13116 | — | — | 82422 |
| .js | source | 663 | 157447 | 121238 | 9733 | — |
| .md | test | 1 | 40 | — | — | 181 |
| .js | example | 3 | 522 | 466 | 0 | — |
| .md | example | 3 | 39 | — | — | 172 |
| .mjs | source | 1 | 802 | 708 | 40 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/paean-ai/deeptide/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/paean-ai/deeptide/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/paean-ai/deeptide/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多形态编码客户端与根npm别名的真实归属、资源条件和失败恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个仓库与deeptide npm包分别代表什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

仓库是DeepTide多个形态的社区入口，包含Swift原生、Zero CLI别名、Rust CLI/GUI和本地推理组件；不能把这些实现和运行条件混为一个包。根npm deeptide 0.11.8安装deeptide/tide命令，实际普通路径转入外部@paean-ai/zero-cli；合格结果仍是用户当前repo中可审代码与测试。相对直接装Zero CLI，根普通路径的增量主要是品牌/命令别名，不是原创Agent loop、工具或权限系统；Rust源与本地bootstrap才是该仓库另有实现。用户如果只需成熟上游CLI，直接用上游可能更清楚。README内存数字和作者归属说明只是作者报告，未独立实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-54](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/README.md#L21-L54)

作者区分三个形态与上游归属。

<details>
<summary>查看原文（34行）</summary>

```text
## Three flavors, same team

| | DeepTide for macOS | DeepTide CLI (`deeptide`) | DeepTide CLI Rust (`deeptide-rs`) |
|---|---|---|---|
| **Form factor** | Native macOS app | Cross-platform terminal CLI | Cross-platform terminal CLI **+ native desktop GUI** ([`--gui`](#desktop-gui-deeptide-rs)) |
| **Runtime** | Swift 6 native binary, ~15 MB idle | Bun, ~50 MB resident | Native Rust binary, ~10 MB on disk, no runtime |
| **Platforms** | macOS 15+ | Linux · Windows · macOS | Linux · Windows · macOS |
| **Install** | `curl -fsSL https://deeptide.sh/install.sh \| sh` | `bun add -g deeptide` (this package) | `npm install -g deeptide-rs` |
| **CLI name(s)** | DeepTide.app | `deeptide`, `tide` | `deeptide-rs` |
| **Lineage** | 100% authored by DeepSeek V4 | Powered by open-source [Zero CLI](https://github.com/a8e-ai/zero-cli) | Authored under [`crates/`](./crates) in this repo |
| **Best for** | macOS users who want a tuned native experience | Existing users; richest plugin surface | Headless CI, slow laptops, single-binary deploys |

This repository is the **community front door for all three** — docs, FAQ,
issue tracking — and is the home of two npm packages:

- [`deeptide`](./package.json) — the current TypeScript/Bun CLI (forwards to
  [`@paean-ai/zero-cli`](https://www.npmjs.com/package/@paean-ai/zero-cli))
- [`deeptide-rs`](./npm/deeptide-rs) — the Rust CLI (ships a native binary
  via GitHub Releases postinstall)

The two CLI packages **do not conflict** — they expose different binary
names (`deeptide`/`tide` vs `deeptide-rs`) so you can install both and
switch between them freely while we mature the Rust port.

The Rust port lives under [`crates/`](./crates). It is intended to grow
into the canonical cross-platform CLI over time, but the `deeptide` package
will remain available as long as users find value in it — there is no
forced migration.

It also contains the open-source native local inference runtime under
[`native/`](./native): a hard-forked `ds4` DeepSeek V4 Flash Metal engine plus
`dsgo`, the local OpenAI/Anthropic-compatible gateway intended to pair with
DeepTide.

```

</details>

**依据 2 · 源码核查**：[package.json:1-19](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/package.json#L1-L19)

根npm明确薄重定向和依赖范围。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "deeptide",
  "version": "0.11.8",
  "description": "DeepTide CLI — cross-platform terminal AI coding agent. Thin redirect to @paean-ai/zero-cli; installs `deeptide` and `tide` commands.",
  "type": "module",
  "bin": {
    "deeptide": "./bin.js",
    "tide": "./bin.js"
  },
  "scripts": {
    "build:native": "sh native/build.sh",
    "build:ds4": "make -C native/ds4",
    "build:dsgo": "swift build --package-path native/dsgo",
    "check:npm-files": "npm pack --dry-run"
  },
  "dependencies": {
    "@paean-ai/zero-cli": "^0.11.6"
  },
  "files": [
```

</details>

**依据 3 · 源码核查**：[bin.js:16-24](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/bin.js#L16-L24)

普通命令实际转入外部Zero CLI。

```text
process.env.ZERO_CLI_INVOKED_AS = 'tide'
process.env.NODE_ENV ??= 'production'

if (process.argv[2] === 'local') {
  const mod = await import('./scripts/tide-local.mjs')
  await mod.run(process.argv.slice(3))
} else {
  await import('@paean-ai/zero-cli/dist/_cli.js')
}
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地bootstrap如何选择资源并改配置？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

bin.js只截获tide local进入本仓库脚本，其余import上游。local探平台、架构、总内存，自动按96/192GiB门槛选Q2/Q4配置，明确权重约81/153GiB及不同上下文；这些是配置选择而非实际性能保证。repoLayout要求包根下native/ds4与native/dsgo存在，根npm files却不含native，因此npm别名安装不自动具备源码本地构建布局；源码checkout与发行安装不能互相替代。bootstrap依次构建、下载、写LaunchAgent、启动gateway、自测并写settings/local state。可借鉴先doctor/dry-run说明资源计划和服务状态，但平台、源码和下载均是实质依赖，不能称一命令对所有机器可用。

#### 证据与依据

**依据 1 · 源码核查**：[bin.js:19-24](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/bin.js#L19-L24)

local与上游分派。

```text
if (process.argv[2] === 'local') {
  const mod = await import('./scripts/tide-local.mjs')
  await mod.run(process.argv.slice(3))
} else {
  await import('@paean-ai/zero-cli/dist/_cli.js')
}
```

**依据 2 · 源码核查**：[scripts/tide-local.mjs:39-59](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/scripts/tide-local.mjs#L39-L59)

量化配置、权重/内存与context条件。

<details>
<summary>查看原文（21行）</summary>

```text
const PROFILES = {
  flash: {
    canonicalId: 'deepseek-v4-flash',
    aliases: ['flash', 'fast', 'v4-flash', 'deepseek-v4-flash'],
    downloadTarget: 'q2',
    ggufFile: 'DeepSeek-V4-Flash-IQ2XXS-w2Q2K-AProjQ8-SExpQ8-OutQ8-chat-v2.gguf',
    sizeGiB: 81,
    contextWindow: 64_000,
    minHostRAMGiB: 96,
    notes: 'IQ2_XXS asymmetric — capped at 64k ctx (Q2 attention quality cliff)',
  },
  'flash-q4': {
    canonicalId: 'deepseek-v4-flash-q4k',
    aliases: ['flash-q4', 'flash-q4k', 'v4-flash-q4', 'v4-flash-q4k', 'deepseek-v4-flash-q4k'],
    downloadTarget: 'q4',
    ggufFile: 'DeepSeek-V4-Flash-Q4KExperts-F16HC-F16Compressor-F16Indexer-Q8Attn-Q8Shared-Q8Out-chat-v2.gguf',
    sizeGiB: 153,
    contextWindow: 1_000_000,
    minHostRAMGiB: 192,
    notes: 'Q4_K mixed-precision — 1M ctx, needs M3/M4 Ultra-class memory',
  },
```

</details>

**依据 3 · 源码核查**：[scripts/tide-local.mjs:231-245](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/scripts/tide-local.mjs#L231-L245)

本地源码布局必要条件。

<details>
<summary>查看原文（15行）</summary>

```text
function repoLayout() {
  const root = PKG_ROOT
  const ds4Dir = join(root, 'native', 'ds4')
  const dsgoDir = join(root, 'native', 'dsgo')
  if (!existsSync(ds4Dir) || !existsSync(dsgoDir)) {
    return null
  }
  return {
    root,
    ds4Dir,
    dsgoDir,
    ds4ServerBin: join(ds4Dir, 'ds4-server'),
    dsgoBin: join(dsgoDir, '.build', 'release', 'dsgo'),
    downloadScript: join(ds4Dir, 'download_model.sh'),
    ggufDir: join(ds4Dir, 'gguf'),
```

</details>

**依据 4 · 源码核查**：[package.json:20-28](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/package.json#L20-L28)

npm发布文件不含native目录。

```text
    "bin.js",
    "scripts/tide-local.mjs",
    "README.md",
    "LICENSE",
    "NOTICE",
    "assets/logo.svg"
  ],
  "engines": {
    "node": ">=18.0.0"
```

**依据 5 · 源码核查**：[scripts/tide-local.mjs:627-640](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/scripts/tide-local.mjs#L627-L640)

构建、下载和服务启动实际顺序。

<details>
<summary>查看原文（14行）</summary>

```text
  logStep(3, total, 'Build native runtime')
  if (args.noBuild) logLine('skipped (--no-build)')
  else await ensureNativeBuilt(layout, { dryRun: args.dryRun })

  logStep(4, total, 'Download weights')
  let ggufPath = join(layout.ggufDir, profile.ggufFile)
  if (args.noDownload) {
    if (!existsSync(ggufPath)) fail(`--no-download set but ${ggufPath} not present`)
    logLine(`skipped (--no-download); using ${ggufPath}`)
  } else {
    ggufPath = await ensureWeightsDownloaded(layout, profile, { dryRun: args.dryRun })
  }

  logStep(5, total, `Start services (LaunchAgent ${LAUNCHD_LABEL})`)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限模式和自测失败能否给可靠采用保证？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能把Rust permissions.rs的Default/Plan/Bypass定义套到根npm实际Zero CLI版本，因普通执行依赖外部semver ^0.11.6，固定仓库提交不固定已安装上游字节。本地自测失败catch仅设置exitCode=2，随后仍可写Agent settings与local state；所以“gateway有响应/配置已保存”与“工具往返通过”必须分开，不能见Ready字样就认为可用了。自动全量资源bootstrap可能产生大模型下载与持久LaunchAgent，失败需核现有服务/配置并恢复。Rust包postinstall下载失败不致命，npm安装成功也不证明二进制已存在。最关键限制是多个形态同名导致版本、权限和成功信号混读。

#### 证据与依据

**依据 1 · 源码核查**：[crates/deeptide-core/src/permissions.rs:15-35](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/crates/deeptide-core/src/permissions.rs#L15-L35)

此权限模式属于Rust实现，不是上游npm全链。

<details>
<summary>查看原文（21行）</summary>

```text
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum PermissionMode {
    Default,
    AcceptEdits,
    Plan,
    Bypass,
}

impl PermissionMode {
    pub fn description(self) -> &'static str {
        match self {
            Self::Default => {
                "Ask before running commands, writing files, or making network requests."
            }
            Self::AcceptEdits => "Auto-approve file edits. Ask for everything else.",
            Self::Plan => {
                "Allow reads and exploration (Read, Bash, …); block file writes and high-risk tools until you exit plan mode."
            }
            Self::Bypass => "YOLO mode: bypass all permission checks.",
        }
```

</details>

**依据 2 · 源码核查**：[package.json:16-19](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/package.json#L16-L19)

上游semver未绑定精确字节。

```text
  "dependencies": {
    "@paean-ai/zero-cli": "^0.11.6"
  },
  "files": [
```

**依据 3 · 源码核查**：[scripts/tide-local.mjs:663-679](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/scripts/tide-local.mjs#L663-L679)

自测失败exitCode2仍写settings/state。

<details>
<summary>查看原文（17行）</summary>

```text
  logStep(6, total, 'Self-test (streaming tool_use round-trip)')
  if (args.noSelfTest || args.dryRun) {
    logLine(args.dryRun ? 'skipped (--dry-run)' : 'skipped (--no-self-test)')
  } else {
    try {
      await selfTest({ host: '127.0.0.1', port: args.dsgoPort, profile })
    } catch (e) {
      logWarn(`self-test failed: ${e.message}`)
      logWarn(`see logs: ${join(LOG_DIR, 'dsgo.err.log')}, ${join(LOG_DIR, 'dsgo.out.log')}`)
      process.exitCode = 2
    }
  }

  if (!args.noSettings) {
    await writeAgentSettings({ dsgoPort: args.dsgoPort, profile, ctx, dryRun: args.dryRun })
  }
  await writeLocalState({ profile, ctx, ggufPath, dsgoPort: args.dsgoPort, ds4Port: args.ds4Port, dryRun: args.dryRun })
```

</details>

**依据 4 · 源码核查**：[npm/deeptide-rs/install.js:17-29](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/npm/deeptide-rs/install.js#L17-L29)

作者设计下载失败不致命。

<details>
<summary>查看原文（13行）</summary>

```text
// * The script is **never fatal**. If the download fails (offline
//   install, no release published yet, sandboxed CI) we exit 0 and
//   print clear remediation steps. bin.js then surfaces an
//   actionable error at first run instead of breaking
//   `npm install -g deeptide-rs` outright. This matches the
//   convention `npm` itself uses for native-add-on packages.
//
// * The release artifact URL convention is:
//     https://github.com/paean-ai/deeptide/releases/download/
//       deeptide-rs-v<version>/deeptide-rs-<os>-<arch>.<ext>
//   where <ext> is `tar.gz` on Unix, `zip` on Windows. The
//   archive contains a single `deeptide` (or `deeptide.exe`) at
//   its root.
```

</details>

#### 缺口

- 外部Zero CLI当前字节、各形态权限执行与本地模型质量无运行记录。
  **影响**：不能将权限文档或配置成功当编码任务通过。
  **进一步探讨**：分别固定发行物/上游版本，在可丢弃repo核审批、写入、退出与真实任务。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 已有DeepSeek用户应从什么最小范围试起？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议观察本仓库多形态组合；先明确自己要Zero别名、Rust客户端还是Apple Silicon本地推理，不能按同一教程混装。普通根npm需要Bun，即使Node engines>=18也不替代Bun；持续云端编码有模型费用、人工diff和测试复核。本地路线另需大量内存/磁盘、工具链、下载与常驻服务，README小内存Rust客户端不是模型权重需求。首次/持续/恢复耗时与金额未知，退出要停LaunchAgent并恢复settings而非只删CLI。若上游版本不明、机器不满足profile或自测失败，应停用自动改配置并回原编码客户端/云API。源码证据不足支持持续安装。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:88-105](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/README.md#L88-L105)

普通npm路线仍需Bun。

<details>
<summary>查看原文（18行）</summary>

````text
entrypoint powered by [Zero CLI](https://github.com/a8e-ai/zero-cli). It
installs the `deeptide` and `tide` aliases for a workflow close to Deeptide,
but it is not the Swift-native macOS build from `deeptide.sh`.

```bash
# bun (recommended, fastest install)
bun add -g deeptide

# npm (works too; bun is still required at runtime)
npm install -g deeptide

# pnpm
pnpm add -g deeptide
```

Two commands are installed; pick whichever your fingers prefer:

```bash
````

</details>

**依据 2 · 源码核查**：[scripts/tide-local.mjs:39-59](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/scripts/tide-local.mjs#L39-L59)

本地模型资源与轻量客户端不同。

<details>
<summary>查看原文（21行）</summary>

```text
const PROFILES = {
  flash: {
    canonicalId: 'deepseek-v4-flash',
    aliases: ['flash', 'fast', 'v4-flash', 'deepseek-v4-flash'],
    downloadTarget: 'q2',
    ggufFile: 'DeepSeek-V4-Flash-IQ2XXS-w2Q2K-AProjQ8-SExpQ8-OutQ8-chat-v2.gguf',
    sizeGiB: 81,
    contextWindow: 64_000,
    minHostRAMGiB: 96,
    notes: 'IQ2_XXS asymmetric — capped at 64k ctx (Q2 attention quality cliff)',
  },
  'flash-q4': {
    canonicalId: 'deepseek-v4-flash-q4k',
    aliases: ['flash-q4', 'flash-q4k', 'v4-flash-q4', 'v4-flash-q4k', 'deepseek-v4-flash-q4k'],
    downloadTarget: 'q4',
    ggufFile: 'DeepSeek-V4-Flash-Q4KExperts-F16HC-F16Compressor-F16Indexer-Q8Attn-Q8Shared-Q8Out-chat-v2.gguf',
    sizeGiB: 153,
    contextWindow: 1_000_000,
    minHostRAMGiB: 192,
    notes: 'Q4_K mixed-precision — 1M ctx, needs M3/M4 Ultra-class memory',
  },
```

</details>

**依据 3 · 源码核查**：[scripts/tide-local.mjs:663-679](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/scripts/tide-local.mjs#L663-L679)

自测和配置修改需要分别核对。

<details>
<summary>查看原文（17行）</summary>

```text
  logStep(6, total, 'Self-test (streaming tool_use round-trip)')
  if (args.noSelfTest || args.dryRun) {
    logLine(args.dryRun ? 'skipped (--dry-run)' : 'skipped (--no-self-test)')
  } else {
    try {
      await selfTest({ host: '127.0.0.1', port: args.dsgoPort, profile })
    } catch (e) {
      logWarn(`self-test failed: ${e.message}`)
      logWarn(`see logs: ${join(LOG_DIR, 'dsgo.err.log')}, ${join(LOG_DIR, 'dsgo.out.log')}`)
      process.exitCode = 2
    }
  }

  if (!args.noSettings) {
    await writeAgentSettings({ dsgoPort: args.dsgoPort, profile, ctx, dryRun: args.dryRun })
  }
  await writeLocalState({ profile, ctx, ggufPath, dsgoPort: args.dsgoPort, ds4Port: args.ds4Port, dryRun: args.dryRun })
```

</details>

#### 缺口

- 运行成本、配置回退、session迁移和量化质量无本轮验收。
  **影响**：只能提出明确补证路线。
  **进一步探讨**：固定单一形态/版本，备份配置并记录安装、任务、退出与恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样避免本地自测失败却切换现用Agent配置？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将bootstrap变为两阶段：先在独立临时profile验证gateway、模型及tool_use，再明确提交设置；失败保持原配置和服务归属不变。由Q03自测exitCode后仍写设置推导，增量是失败可逆与避免半配置切换，不是提高推理质量。最小实验固定无模型、gateway超时、工具返回错误和成功四情形，比较当前与事务原型的原配置变化、残留服务、恢复步骤及真实任务结果。若失败仍覆盖原配置或残留不归属进程，则否定；加入阶段也增加实现/维护，不把它记成当前已完成。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/tide-local.mjs:663-679](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/scripts/tide-local.mjs#L663-L679)

失败后写settings是事务化动因。

<details>
<summary>查看原文（17行）</summary>

```text
  logStep(6, total, 'Self-test (streaming tool_use round-trip)')
  if (args.noSelfTest || args.dryRun) {
    logLine(args.dryRun ? 'skipped (--dry-run)' : 'skipped (--no-self-test)')
  } else {
    try {
      await selfTest({ host: '127.0.0.1', port: args.dsgoPort, profile })
    } catch (e) {
      logWarn(`self-test failed: ${e.message}`)
      logWarn(`see logs: ${join(LOG_DIR, 'dsgo.err.log')}, ${join(LOG_DIR, 'dsgo.out.log')}`)
      process.exitCode = 2
    }
  }

  if (!args.noSettings) {
    await writeAgentSettings({ dsgoPort: args.dsgoPort, profile, ctx, dryRun: args.dryRun })
  }
  await writeLocalState({ profile, ctx, ggufPath, dsgoPort: args.dsgoPort, ds4Port: args.ds4Port, dryRun: args.dryRun })
```

</details>

**依据 2 · 源码核查**：[scripts/tide-local.mjs:640-659](https://github.com/paean-ai/deeptide/blob/b48688d56c3eb61d0c028de2fa73dd674be2f3e8/scripts/tide-local.mjs#L640-L659)

启动服务和等待就绪有独立失败阶段。

<details>
<summary>查看原文（20行）</summary>

```text
  logStep(5, total, `Start services (LaunchAgent ${LAUNCHD_LABEL})`)
  if (args.noService) {
    logLine('skipped (--no-service)')
  } else {
    await writeAndLoadAgent({
      dsgoBin: layout.dsgoBin,
      ds4ServerBin: layout.ds4ServerBin,
      ggufPath,
      dsgoPort: args.dsgoPort,
      ds4Port: args.ds4Port,
      ctx,
      dryRun: args.dryRun,
    })
    if (!args.dryRun) {
      try {
        await waitForReady({ host: '127.0.0.1', port: args.dsgoPort, timeoutMs: 60_000 })
        logOk(`dsgo gateway ready at http://127.0.0.1:${args.dsgoPort}`)
      } catch (e) {
        logWarn(e.message)
      }
```

</details>

#### 缺口

- 事务化能否减少恢复负担与兼容现有安装未知。
  **影响**：尚是设计假设。
  **进一步探讨**：用可丢弃用户目录与四类故障记录原配置和服务差异。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
