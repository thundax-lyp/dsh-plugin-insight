# dsh-wsl-workspace

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[fff7300](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/tree/fff73002cfa3cfe9ffadd21df95631a8e6c2369d)

<!-- BEGIN META -->
[![GitHub ★ 97](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=97&color=yellow&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) [![npm 30d 2,975](https://img.shields.io/static/v1?label=npm+30d&message=2%2C975&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace)
<!-- END META -->

> **实现功能**：从DSH界面创建WSL工作区，使会话命令、文件操作和搜索在选定发行版中协同运行。

> **核心亮点**：将工作区选择、路径翻译、shell、文件、搜索与客户端入口组合成会话级 WSL 运行平面。它相对“手动在 WSL 终端运行命令，再在 Windows/UNC 路径与 DSH 文件工具之间转换”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **风险与缺陷**：WSL bash 不受 Windows ACL 沙箱包裹，文件工具与 bash 的隔离边界不同；源码不能证明所有发行版和宿主组合均通过。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 目标用户、反复任务、原有办法与合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、调用链、数据和状态如何实现核心能力？](#detail-section-12)
  - [Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？](#detail-section-15)
  - [Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？](#detail-section-16)
  - [Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？](#detail-section-17)
  - [Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？](#detail-section-18)
  - [Q09 · 对谁值得观察或试用，成功与停止标准是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 Windows 上以 WSL Linux 工程为主工作区的开发者可用它把整个 DSH 会话映射到选定 WSL 发行版，并补齐 bash、文件、搜索、终端和工作区界面接线；合格结果是模型看到一致的 Linux 路径，命令与文件工具指向同一项目且写入边界可解释。详见[Q01](#research-q01)。

基线是手动在 WSL 终端运行命令，再在 Windows/UNC 路径与 DSH 文件工具之间转换。本项的价值主要来自将工作区选择、路径翻译、shell、文件、搜索与客户端入口组合成会话级 WSL 运行平面；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| WSL 工作区创建 | 在 Web 界面选择发行版与路径并创建会话。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| WSL 会话工具平面 | 将 shell、文件与搜索能力接到 WSL 路径语义。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 路径与客户端接线 | 把 Linux/Windows/UNC 地址转换用于文件引用与界面打开。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Windows 主机与可用 WSL 发行版 | 必需 | 运行 wsl.exe、UNC/9P 与 Linux 命令 | 发行版缺失时无法创建工作区 |
| DSH Web/Desktop 声明版本与 Node >=24 | 必需 | 挂载 workspace、shell、fs、search 与客户端槽位 | API 漂移时应拒绝而非留空工作区 |
| GNU grep/find 与 WSL 文件权限 | 搜索时必需 | 在发行版内执行 grep/glob | 缺失时搜索明确失败，不能回退成 Windows 结果 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 选择发行版和 Linux 绝对路径，先执行路径检查 | 路径存在且发行版身份明确；失败则不创建 |
| 2 | 创建并打开 WSL variant 会话 | bash、文件、搜索看到同一 Linux cwd；不一致则关闭会话 |
| 3 | 分别验证 bash 权限、文件 writableRoots 和 /mnt 路径引用 | 权限平面差异被记录，越界写入被拒绝 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本机 WSL/磁盘资源 | 安装插件、核对发行版与 DSH 版本、创建工作区 | 发行版准备与兼容排障耗时未知 |
| 持续使用 | WSL 进程、9P/UNC I/O、轮询 Skill 目录 | 处理路径差异、搜索语义和权限提示 | 每任务时延与轮询负担未知 |
| 失败恢复 | 残留 wsl.exe/会话与配置文件核对 | 关闭会话、检查 wsl-workspaces.json 并重建 | 命令已执行时不能靠重开回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话路径一致性 | 源码提供 WSL variant、路径翻译和工具替换 | 不同发行版/宿主组合的端到端一致率 |
| 权限边界 | 文件写入读取 sandboxPolicy，README 明示 bash 以 WSL 为隔离边界 | 同任务下越界命令与文件写入的差异 |
| 搜索与引用 | 源码补 grep/glob 和文件地址翻译 | 大仓库性能、符号链接与特殊路径正确率 |

> **思考**：WSL bash 不受 Windows ACL 沙箱包裹，文件工具与 bash 的隔离边界不同；源码不能证明所有发行版和宿主组合均通过。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将工作区选择、路径翻译、shell、文件、搜索与客户端入口组合成会话级 WSL 运行平面。它相对“手动在 WSL 终端运行命令，再在 Windows/UNC 路径与 DSH 文件工具之间转换”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

将工作区选择、路径翻译、shell、文件、搜索与客户端入口组合成会话级 WSL 运行平面。它相对“手动在 WSL 终端运行命令，再在 Windows/UNC 路径与 DSH 文件工具之间转换”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 src/index.ts 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“分别验证 bash 权限、文件 writableRoots 和 /mnt 路径引用｜权限平面差异被记录，越界写入被拒绝”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

WSL bash 不受 Windows ACL 沙箱包裹，文件工具与 bash 的隔离边界不同；源码不能证明所有发行版和宿主组合均通过。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

Windows 上长期使用 WSL 工程者可在隔离项目试用，先核对双平面权限边界与固定 DSH 版本。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：在同一可丢弃仓库对照原生 Windows 工作区和 WSL 工作区，执行20个含空格、符号链接、/mnt与越界写入的任务；记录路径正确数、拒绝数、人工修正分钟和残留进程，任何静默跨界或路径错投即否定试用。

**分析版本**

- **仓库**：[dsh-wsl-workspace-maintainers/dsh-wsl-workspace](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace)
- **版本号**：0.7.9（[固定提交 fff7300](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/tree/fff73002cfa3cfe9ffadd21df95631a8e6c2369d)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可探索在会话创建时生成可见的双平面权限清单，并对 bash 与文件工具分别给出可执行的最小权限探针。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

在同一可丢弃仓库对照原生 Windows 工作区和 WSL 工作区，执行20个含空格、符号链接、/mnt与越界写入的任务；记录路径正确数、拒绝数、人工修正分钟和残留进程，任何静默跨界或路径错投即否定试用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 30 | 4907 | — | — | 179230 |
| .mjs | source | 36 | 6514 | 4420 | 1740 | — |
| .js | source | 17 | 9772 | 6471 | 3394 | — |
| .mjs | test | 44 | 12658 | 8471 | 3460 | — |
| .tsx | source | 2 | 530 | 398 | 109 | — |
| .ts | source | 31 | 12163 | 6828 | 4713 | — |
| .ts | test | 24 | 5692 | 3922 | 1321 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 dsh-wsl-workspace 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是在 Windows 上以 WSL Linux 工程为主工作区的开发者。反复任务是把整个 DSH 会话映射到选定 WSL 发行版，并补齐 bash、文件、搜索、终端和工作区界面接线。原有办法为手动在 WSL 终端运行命令，再在 Windows/UNC 路径与 DSH 文件工具之间转换。合格结果必须达到“模型看到一致的 Linux 路径，命令与文件工具指向同一项目且写入边界可解释”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

````text
# dsh-wsl-workspace

[![dsh.so security](https://www.dsh.so/badge/dsh-wsl-workspace.svg)](https://www.dsh.so/artifact/dsh-wsl-workspace) [![dsh.so install](https://www.dsh.so/badge/install/dsh-wsl-workspace.svg)](https://www.dsh.so/artifact/dsh-wsl-workspace)

[English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Русский](README.ru.md)
![alt text](https://raw.githubusercontent.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/HEAD/image-3.png)
Add a WSL workspace from the DeepSeek Harness web GUI and run the whole agent session — bash commands and file reads/writes — inside a local WSL distribution with Linux paths. Nothing needs to be installed inside WSL. The session can reach both WSL and Windows at the same time: bash commands run inside the WSL distribution, while Windows files stay accessible via `/mnt/<drive>` (for example `/mnt/c/Users/...`).

## Install

Pick one of the three ways below, then restart `dsh web`:

```powershell
# 1) npm package
dsh plugin --profile web add dsh-wsl-workspace

# 2) GitHub repository (ships the prebuilt lib/, no local build required)
dsh plugin --profile web add https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace

````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

src/index.ts 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“选择发行版和 Linux 绝对路径，先执行路径检查｜路径存在且发行版身份明确；失败则不创建；创建并打开 WSL variant 会话｜bash、文件、搜索看到同一 Linux cwd；不一致则关闭会话；分别验证 bash 权限、文件 writableRoots 和 /mnt 路径引用｜权限平面差异被记录，越界写入被拒绝”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-15](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/src/index.ts#L1-L15)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Host half of dsh-wsl-workspace. Three responsibilities:
 *
 * 1. Publish a `wsl-<mode>` variant for every healthy roster preset, so the
 *    WSL execution world — `shell-wsl` + `fs-wsl` behind one entry-local
 *    realm, with `tool-bash`/`tool-fs` consumers — composes with ANY mode
 *    instead of being a mode itself. The channel follows the release:
 *    `0.1.7-alpha.1+` stopped scanning any user preset root and builds its roster
 *    from declarative `@deepseek-ai/dsh-agent-preset` rows, so there a variant
 *    is a *declaration registered through `ctx.agentPresets`* — and only that
 *    path rewrites the absolute provider specifiers below into `file:` URLs,
 *    because a registered preset's entry tree does not translate them the way
 *    the boot-time Include does; earlier releases still get a variant directory
 *    under `<dshHome>/.agent-presets/`, whose legacy standalone `wsl` directory
 *    and stale variants are removed on boot.
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-wsl-workspace",
  "description": "WSL workspace support for DeepSeek Harness: add a WSL workspace from the web GUI and run the whole agent session (bash + file tools) inside the WSL distribution, VS Code Remote-WSL style. No toolchain install inside WSL required. Works on DSH Desktop as well as dsh web.",
  "version": "0.7.9",
  "type": "module",
  "packageManager": "npm@11.19.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace.git"
  },
  "main": "lib/index.js",
  "scripts": {
    "clean": "node scripts/clean-lib.mjs",
    "build": "npm run clean && tsdown && node scripts/verify-lib.mjs",
    "verify": "node scripts/verify-lib.mjs",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "typecheck:gate": "node scripts/typecheck-gate.mjs",
    "verify:install": "node scripts/verify-install.mjs",
    "verify:artifact": "node scripts/verify-artifact-identity.mjs",
    "verify:lib-sync": "node scripts/verify-lib-sync.mjs",
    "verify:plane": "node scripts/verify-plane-log.mjs",
    "ci:pinned": "node ci/install-pinned.mjs",
    "test:unit": "node --experimental-strip-types --test tests/variants.test.ts tests/paths.test.ts tests/references.test.ts tests/locales.test.ts tests/readme-compat.test.mjs tests/wsl-output-decode.test.ts tests/default-distro-parity.test.ts tests/deliberate-reds.test.mjs tests/probe-hygiene.test.mjs tests/client-classnames.test.ts tests/support/fake-child-process.test.mjs tests/wsl-env.test.ts tests/wsl-bash-protocol.test.ts tests/wsl-bash-starve.test.ts tests/wsl-bash-tty.test.ts tests/pty-readiness.test.mjs scripts/check-portable-spelling.test.mjs scripts/check-unit-closure.mjs tests/tool-contract.test.mjs tests/script-reachability.test.mjs tests/parity-claims.test.mjs tests/workflow-shape.test.mjs tests/docs-debt.test.mjs tests/wsl-run-code-guard.test.ts",
    "lint:portability": "node scripts/check-portable-spelling.mjs",
    "lint:portability:strict": "node scripts/check-portable-spelling.mjs --strict",
    "test:win32": "node --experimental-strip-types --test tests/wsl-skills.test.ts tests/fs-policy.test.ts tests/relay-node.test.mjs",
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是将工作区选择、路径翻译、shell、文件、搜索与客户端入口组合成会话级 WSL 运行平面。参照是“手动在 WSL 终端运行命令，再在 Windows/UNC 路径与 DSH 文件工具之间转换”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-15](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/src/index.ts#L1-L15)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Host half of dsh-wsl-workspace. Three responsibilities:
 *
 * 1. Publish a `wsl-<mode>` variant for every healthy roster preset, so the
 *    WSL execution world — `shell-wsl` + `fs-wsl` behind one entry-local
 *    realm, with `tool-bash`/`tool-fs` consumers — composes with ANY mode
 *    instead of being a mode itself. The channel follows the release:
 *    `0.1.7-alpha.1+` stopped scanning any user preset root and builds its roster
 *    from declarative `@deepseek-ai/dsh-agent-preset` rows, so there a variant
 *    is a *declaration registered through `ctx.agentPresets`* — and only that
 *    path rewrites the absolute provider specifiers below into `file:` URLs,
 *    because a registered preset's entry tree does not translate them the way
 *    the boot-time Include does; earlier releases still get a variant directory
 *    under `<dshHome>/.agent-presets/`, whose legacy standalone `wsl` directory
 *    and stale variants are removed on boot.
```

</details>

**依据 2 · 作者声明**：[README.md:1-19](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

````text
# dsh-wsl-workspace

[![dsh.so security](https://www.dsh.so/badge/dsh-wsl-workspace.svg)](https://www.dsh.so/artifact/dsh-wsl-workspace) [![dsh.so install](https://www.dsh.so/badge/install/dsh-wsl-workspace.svg)](https://www.dsh.so/artifact/dsh-wsl-workspace)

[English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Русский](README.ru.md)
![alt text](https://raw.githubusercontent.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/HEAD/image-3.png)
Add a WSL workspace from the DeepSeek Harness web GUI and run the whole agent session — bash commands and file reads/writes — inside a local WSL distribution with Linux paths. Nothing needs to be installed inside WSL. The session can reach both WSL and Windows at the same time: bash commands run inside the WSL distribution, while Windows files stay accessible via `/mnt/<drive>` (for example `/mnt/c/Users/...`).

## Install

Pick one of the three ways below, then restart `dsh web`:

```powershell
# 1) npm package
dsh plugin --profile web add dsh-wsl-workspace

# 2) GitHub repository (ships the prebuilt lib/, no local build required)
dsh plugin --profile web add https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace

````

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是WSL bash 不受 Windows ACL 沙箱包裹，文件工具与 bash 的隔离边界不同；源码不能证明所有发行版和宿主组合均通过。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-15](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/src/index.ts#L1-L15)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Host half of dsh-wsl-workspace. Three responsibilities:
 *
 * 1. Publish a `wsl-<mode>` variant for every healthy roster preset, so the
 *    WSL execution world — `shell-wsl` + `fs-wsl` behind one entry-local
 *    realm, with `tool-bash`/`tool-fs` consumers — composes with ANY mode
 *    instead of being a mode itself. The channel follows the release:
 *    `0.1.7-alpha.1+` stopped scanning any user preset root and builds its roster
 *    from declarative `@deepseek-ai/dsh-agent-preset` rows, so there a variant
 *    is a *declaration registered through `ctx.agentPresets`* — and only that
 *    path rewrites the absolute provider specifiers below into `file:` URLs,
 *    because a registered preset's entry tree does not translate them the way
 *    the boot-time Include does; earlier releases still get a variant directory
 *    under `<dshHome>/.agent-presets/`, whose legacy standalone `wsl` directory
 *    and stale variants are removed on boot.
```

</details>

#### 缺口

- 缺少针对“WSL bash 不受 Windows ACL 沙箱包裹，文件工具与 bash 的隔离边界不同；源码不能证明所有发行版和宿主组合均通过”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：在同一可丢弃仓库对照原生 Windows 工作区和 WSL 工作区，执行20个含空格、符号链接、/mnt与越界写入的任务；记录路径正确数、拒绝数、人工修正分钟和残留进程，任何静默跨界或路径错投即否定试用。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：Windows 主机与可用 WSL 发行版｜必需｜运行 wsl.exe、UNC/9P 与 Linux 命令｜发行版缺失时无法创建工作区；DSH Web/Desktop 声明版本与 Node >=24｜必需｜挂载 workspace、shell、fs、search 与客户端槽位｜API 漂移时应拒绝而非留空工作区；GNU grep/find 与 WSL 文件权限｜搜索时必需｜在发行版内执行 grep/glob｜缺失时搜索明确失败，不能回退成 Windows 结果。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“分别验证 bash 权限、文件 writableRoots 和 /mnt 路径引用｜权限平面差异被记录，越界写入被拒绝”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-wsl-workspace",
  "description": "WSL workspace support for DeepSeek Harness: add a WSL workspace from the web GUI and run the whole agent session (bash + file tools) inside the WSL distribution, VS Code Remote-WSL style. No toolchain install inside WSL required. Works on DSH Desktop as well as dsh web.",
  "version": "0.7.9",
  "type": "module",
  "packageManager": "npm@11.19.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace.git"
  },
  "main": "lib/index.js",
  "scripts": {
    "clean": "node scripts/clean-lib.mjs",
    "build": "npm run clean && tsdown && node scripts/verify-lib.mjs",
    "verify": "node scripts/verify-lib.mjs",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "typecheck:gate": "node scripts/typecheck-gate.mjs",
    "verify:install": "node scripts/verify-install.mjs",
    "verify:artifact": "node scripts/verify-artifact-identity.mjs",
    "verify:lib-sync": "node scripts/verify-lib-sync.mjs",
    "verify:plane": "node scripts/verify-plane-log.mjs",
    "ci:pinned": "node ci/install-pinned.mjs",
    "test:unit": "node --experimental-strip-types --test tests/variants.test.ts tests/paths.test.ts tests/references.test.ts tests/locales.test.ts tests/readme-compat.test.mjs tests/wsl-output-decode.test.ts tests/default-distro-parity.test.ts tests/deliberate-reds.test.mjs tests/probe-hygiene.test.mjs tests/client-classnames.test.ts tests/support/fake-child-process.test.mjs tests/wsl-env.test.ts tests/wsl-bash-protocol.test.ts tests/wsl-bash-starve.test.ts tests/wsl-bash-tty.test.ts tests/pty-readiness.test.mjs scripts/check-portable-spelling.test.mjs scripts/check-unit-closure.mjs tests/tool-contract.test.mjs tests/script-reachability.test.mjs tests/parity-claims.test.mjs tests/workflow-shape.test.mjs tests/docs-debt.test.mjs tests/wsl-run-code-guard.test.ts",
    "lint:portability": "node scripts/check-portable-spelling.mjs",
    "lint:portability:strict": "node scripts/check-portable-spelling.mjs --strict",
    "test:win32": "node --experimental-strip-types --test tests/wsl-skills.test.ts tests/fs-policy.test.ts tests/relay-node.test.mjs",
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1-15](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/src/index.ts#L1-L15)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Host half of dsh-wsl-workspace. Three responsibilities:
 *
 * 1. Publish a `wsl-<mode>` variant for every healthy roster preset, so the
 *    WSL execution world — `shell-wsl` + `fs-wsl` behind one entry-local
 *    realm, with `tool-bash`/`tool-fs` consumers — composes with ANY mode
 *    instead of being a mode itself. The channel follows the release:
 *    `0.1.7-alpha.1+` stopped scanning any user preset root and builds its roster
 *    from declarative `@deepseek-ai/dsh-agent-preset` rows, so there a variant
 *    is a *declaration registered through `ctx.agentPresets`* — and only that
 *    path rewrites the absolute provider specifiers below into `file:` URLs,
 *    because a registered preset's entry tree does not translate them the way
 *    the boot-time Include does; earlier releases still get a variant directory
 *    under `<dshHome>/.agent-presets/`, whose legacy standalone `wsl` directory
 *    and stale variants are removed on boot.
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：在同一可丢弃仓库对照原生 Windows 工作区和 WSL 工作区，执行20个含空格、符号链接、/mnt与越界写入的任务；记录路径正确数、拒绝数、人工修正分钟和残留进程，任何静默跨界或路径错投即否定试用。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“模型看到一致的 Linux 路径，命令与文件工具指向同一项目且写入边界可解释”为合格单位。三阶段投入为：首次使用｜本机 WSL/磁盘资源｜安装插件、核对发行版与 DSH 版本、创建工作区｜发行版准备与兼容排障耗时未知；持续使用｜WSL 进程、9P/UNC I/O、轮询 Skill 目录｜处理路径差异、搜索语义和权限提示｜每任务时延与轮询负担未知；失败恢复｜残留 wsl.exe/会话与配置文件核对｜关闭会话、检查 wsl-workspaces.json 并重建｜命令已执行时不能靠重开回滚。当前源码只支持机制存在，效果维度为“会话路径一致性｜源码提供 WSL variant、路径翻译和工具替换｜不同发行版/宿主组合的端到端一致率；权限边界｜文件写入读取 sandboxPolicy，README 明示 bash 以 WSL 为隔离边界｜同任务下越界命令与文件写入的差异；搜索与引用｜源码补 grep/glob 和文件地址翻译｜大仓库性能、符号链接与特殊路径正确率”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

````text
# dsh-wsl-workspace

[![dsh.so security](https://www.dsh.so/badge/dsh-wsl-workspace.svg)](https://www.dsh.so/artifact/dsh-wsl-workspace) [![dsh.so install](https://www.dsh.so/badge/install/dsh-wsl-workspace.svg)](https://www.dsh.so/artifact/dsh-wsl-workspace)

[English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Русский](README.ru.md)
![alt text](https://raw.githubusercontent.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/HEAD/image-3.png)
Add a WSL workspace from the DeepSeek Harness web GUI and run the whole agent session — bash commands and file reads/writes — inside a local WSL distribution with Linux paths. Nothing needs to be installed inside WSL. The session can reach both WSL and Windows at the same time: bash commands run inside the WSL distribution, while Windows files stay accessible via `/mnt/<drive>` (for example `/mnt/c/Users/...`).

## Install

Pick one of the three ways below, then restart `dsh web`:

```powershell
# 1) npm package
dsh plugin --profile web add dsh-wsl-workspace

# 2) GitHub repository (ships the prebuilt lib/, no local build required)
dsh plugin --profile web add https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace

````

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-wsl-workspace",
  "description": "WSL workspace support for DeepSeek Harness: add a WSL workspace from the web GUI and run the whole agent session (bash + file tools) inside the WSL distribution, VS Code Remote-WSL style. No toolchain install inside WSL required. Works on DSH Desktop as well as dsh web.",
  "version": "0.7.9",
  "type": "module",
  "packageManager": "npm@11.19.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace.git"
  },
  "main": "lib/index.js",
  "scripts": {
    "clean": "node scripts/clean-lib.mjs",
    "build": "npm run clean && tsdown && node scripts/verify-lib.mjs",
    "verify": "node scripts/verify-lib.mjs",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "typecheck:gate": "node scripts/typecheck-gate.mjs",
    "verify:install": "node scripts/verify-install.mjs",
    "verify:artifact": "node scripts/verify-artifact-identity.mjs",
    "verify:lib-sync": "node scripts/verify-lib-sync.mjs",
    "verify:plane": "node scripts/verify-plane-log.mjs",
    "ci:pinned": "node ci/install-pinned.mjs",
    "test:unit": "node --experimental-strip-types --test tests/variants.test.ts tests/paths.test.ts tests/references.test.ts tests/locales.test.ts tests/readme-compat.test.mjs tests/wsl-output-decode.test.ts tests/default-distro-parity.test.ts tests/deliberate-reds.test.mjs tests/probe-hygiene.test.mjs tests/client-classnames.test.ts tests/support/fake-child-process.test.mjs tests/wsl-env.test.ts tests/wsl-bash-protocol.test.ts tests/wsl-bash-starve.test.ts tests/wsl-bash-tty.test.ts tests/pty-readiness.test.mjs scripts/check-portable-spelling.test.mjs scripts/check-unit-closure.mjs tests/tool-contract.test.mjs tests/script-reachability.test.mjs tests/parity-claims.test.mjs tests/workflow-shape.test.mjs tests/docs-debt.test.mjs tests/wsl-run-code-guard.test.ts",
    "lint:portability": "node scripts/check-portable-spelling.mjs",
    "lint:portability:strict": "node scripts/check-portable-spelling.mjs --strict",
    "test:win32": "node --experimental-strip-types --test tests/wsl-skills.test.ts tests/fs-policy.test.ts tests/relay-node.test.mjs",
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：在同一可丢弃仓库对照原生 Windows 工作区和 WSL 工作区，执行20个含空格、符号链接、/mnt与越界写入的任务；记录路径正确数、拒绝数、人工修正分钟和残留进程，任何静默跨界或路径错投即否定试用。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 src/index.ts 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“将工作区选择、路径翻译、shell、文件、搜索与客户端入口组合成会话级 WSL 运行平面”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“分别验证 bash 权限、文件 writableRoots 和 /mnt 路径引用｜权限平面差异被记录，越界写入被拒绝”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-15](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/src/index.ts#L1-L15)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Host half of dsh-wsl-workspace. Three responsibilities:
 *
 * 1. Publish a `wsl-<mode>` variant for every healthy roster preset, so the
 *    WSL execution world — `shell-wsl` + `fs-wsl` behind one entry-local
 *    realm, with `tool-bash`/`tool-fs` consumers — composes with ANY mode
 *    instead of being a mode itself. The channel follows the release:
 *    `0.1.7-alpha.1+` stopped scanning any user preset root and builds its roster
 *    from declarative `@deepseek-ai/dsh-agent-preset` rows, so there a variant
 *    is a *declaration registered through `ctx.agentPresets`* — and only that
 *    path rewrites the absolute provider specifiers below into `file:` URLs,
 *    because a registered preset's entry tree does not translate them the way
 *    the boot-time Include does; earlier releases still get a variant directory
 *    under `<dshHome>/.agent-presets/`, whose legacy standalone `wsl` directory
 *    and stale variants are removed on boot.
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-wsl-workspace",
  "description": "WSL workspace support for DeepSeek Harness: add a WSL workspace from the web GUI and run the whole agent session (bash + file tools) inside the WSL distribution, VS Code Remote-WSL style. No toolchain install inside WSL required. Works on DSH Desktop as well as dsh web.",
  "version": "0.7.9",
  "type": "module",
  "packageManager": "npm@11.19.0",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace.git"
  },
  "main": "lib/index.js",
  "scripts": {
    "clean": "node scripts/clean-lib.mjs",
    "build": "npm run clean && tsdown && node scripts/verify-lib.mjs",
    "verify": "node scripts/verify-lib.mjs",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "typecheck:gate": "node scripts/typecheck-gate.mjs",
    "verify:install": "node scripts/verify-install.mjs",
    "verify:artifact": "node scripts/verify-artifact-identity.mjs",
    "verify:lib-sync": "node scripts/verify-lib-sync.mjs",
    "verify:plane": "node scripts/verify-plane-log.mjs",
    "ci:pinned": "node ci/install-pinned.mjs",
    "test:unit": "node --experimental-strip-types --test tests/variants.test.ts tests/paths.test.ts tests/references.test.ts tests/locales.test.ts tests/readme-compat.test.mjs tests/wsl-output-decode.test.ts tests/default-distro-parity.test.ts tests/deliberate-reds.test.mjs tests/probe-hygiene.test.mjs tests/client-classnames.test.ts tests/support/fake-child-process.test.mjs tests/wsl-env.test.ts tests/wsl-bash-protocol.test.ts tests/wsl-bash-starve.test.ts tests/wsl-bash-tty.test.ts tests/pty-readiness.test.mjs scripts/check-portable-spelling.test.mjs scripts/check-unit-closure.mjs tests/tool-contract.test.mjs tests/script-reachability.test.mjs tests/parity-claims.test.mjs tests/workflow-shape.test.mjs tests/docs-debt.test.mjs tests/wsl-run-code-guard.test.ts",
    "lint:portability": "node scripts/check-portable-spelling.mjs",
    "lint:portability:strict": "node scripts/check-portable-spelling.mjs --strict",
    "test:win32": "node --experimental-strip-types --test tests/wsl-skills.test.ts tests/fs-policy.test.ts tests/relay-node.test.mjs",
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：在同一可丢弃仓库对照原生 Windows 工作区和 WSL 工作区，执行20个含空格、符号链接、/mnt与越界写入的任务；记录路径正确数、拒绝数、人工修正分钟和残留进程，任何静默跨界或路径错投即否定试用。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“将工作区选择、路径翻译、shell、文件、搜索与客户端入口组合成会话级 WSL 运行平面”和“WSL bash 不受 Windows ACL 沙箱包裹，文件工具与 bash 的隔离边界不同；源码不能证明所有发行版和宿主组合均通过”推导的新方向是可探索在会话创建时生成可见的双平面权限清单，并对 bash 与文件工具分别给出可执行的最小权限探针。它不是当前能力。最小验证为在同一可丢弃仓库对照原生 Windows 工作区和 WSL 工作区，执行20个含空格、符号链接、/mnt与越界写入的任务；记录路径正确数、拒绝数、人工修正分钟和残留进程，任何静默跨界或路径错投即否定试用。 若合格结果不改善、误差/副作用越界或恢复负担高于“手动在 WSL 终端运行命令，再在 Windows/UNC 路径与 DSH 文件工具之间转换”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-15](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/src/index.ts#L1-L15)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Host half of dsh-wsl-workspace. Three responsibilities:
 *
 * 1. Publish a `wsl-<mode>` variant for every healthy roster preset, so the
 *    WSL execution world — `shell-wsl` + `fs-wsl` behind one entry-local
 *    realm, with `tool-bash`/`tool-fs` consumers — composes with ANY mode
 *    instead of being a mode itself. The channel follows the release:
 *    `0.1.7-alpha.1+` stopped scanning any user preset root and builds its roster
 *    from declarative `@deepseek-ai/dsh-agent-preset` rows, so there a variant
 *    is a *declaration registered through `ctx.agentPresets`* — and only that
 *    path rewrites the absolute provider specifiers below into `file:` URLs,
 *    because a registered preset's entry tree does not translate them the way
 *    the boot-time Include does; earlier releases still get a variant directory
 *    under `<dshHome>/.agent-presets/`, whose legacy standalone `wsl` directory
 *    and stale variants are removed on boot.
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：在同一可丢弃仓库对照原生 Windows 工作区和 WSL 工作区，执行20个含空格、符号链接、/mnt与越界写入的任务；记录路径正确数、拒绝数、人工修正分钟和残留进程，任何静默跨界或路径错投即否定试用。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为小范围试用。Windows 上长期使用 WSL 工程者可在隔离项目试用，先核对双平面权限边界与固定 DSH 版本。 试用成功标准是“模型看到一致的 Linux 路径，命令与文件工具指向同一项目且写入边界可解释”，并且 不同发行版/宿主组合的端到端一致率、同任务下越界命令与文件写入的差异、大仓库性能、符号链接与特殊路径正确率 有可接受结果；停止标准包括发生WSL bash 不受 Windows ACL 沙箱包裹，文件工具与 bash 的隔离边界不同；源码不能证明所有发行版和宿主组合均通过所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“手动在 WSL 终端运行命令，再在 Windows/UNC 路径与 DSH 文件工具之间转换”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

````text
# dsh-wsl-workspace

[![dsh.so security](https://www.dsh.so/badge/dsh-wsl-workspace.svg)](https://www.dsh.so/artifact/dsh-wsl-workspace) [![dsh.so install](https://www.dsh.so/badge/install/dsh-wsl-workspace.svg)](https://www.dsh.so/artifact/dsh-wsl-workspace)

[English](README.md) · [中文](README.zh.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Русский](README.ru.md)
![alt text](https://raw.githubusercontent.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/HEAD/image-3.png)
Add a WSL workspace from the DeepSeek Harness web GUI and run the whole agent session — bash commands and file reads/writes — inside a local WSL distribution with Linux paths. Nothing needs to be installed inside WSL. The session can reach both WSL and Windows at the same time: bash commands run inside the WSL distribution, while Windows files stay accessible via `/mnt/<drive>` (for example `/mnt/c/Users/...`).

## Install

Pick one of the three ways below, then restart `dsh web`:

```powershell
# 1) npm package
dsh plugin --profile web add dsh-wsl-workspace

# 2) GitHub repository (ships the prebuilt lib/, no local build required)
dsh plugin --profile web add https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace

````

</details>

**依据 2 · 源码核查**：[src/index.ts:1-15](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/fff73002cfa3cfe9ffadd21df95631a8e6c2369d/src/index.ts#L1-L15)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Host half of dsh-wsl-workspace. Three responsibilities:
 *
 * 1. Publish a `wsl-<mode>` variant for every healthy roster preset, so the
 *    WSL execution world — `shell-wsl` + `fs-wsl` behind one entry-local
 *    realm, with `tool-bash`/`tool-fs` consumers — composes with ANY mode
 *    instead of being a mode itself. The channel follows the release:
 *    `0.1.7-alpha.1+` stopped scanning any user preset root and builds its roster
 *    from declarative `@deepseek-ai/dsh-agent-preset` rows, so there a variant
 *    is a *declaration registered through `ctx.agentPresets`* — and only that
 *    path rewrites the absolute provider specifiers below into `file:` URLs,
 *    because a registered preset's entry tree does not translate them the way
 *    the boot-time Include does; earlier releases still get a variant directory
 *    under `<dshHome>/.agent-presets/`, whose legacy standalone `wsl` directory
 *    and stale variants are removed on boot.
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：在同一可丢弃仓库对照原生 Windows 工作区和 WSL 工作区，执行20个含空格、符号链接、/mnt与越界写入的任务；记录路径正确数、拒绝数、人工修正分钟和残留进程，任何静默跨界或路径错投即否定试用。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
