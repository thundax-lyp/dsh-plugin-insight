# Awesome DeepSeek Harness Plugins

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[0b50bd7](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/tree/0b50bd76ed13d69b6722a35cf63b834e5791c4ec)

<!-- BEGIN META -->
[![GitHub ★ 52](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=52&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/walkinglabs/awesome-deepseek-harness-plugins)
<!-- END META -->

> **功能**：面向 DSH 的双语插件、起步项目、工具与一手资源精选索引，含教程及源码级收录规范。

> **亮点**：把官方教学/任务分类与非插件身份区分整合为发现资源，并明确topic/名字不足以收录；这是文档贡献，不是独立验收市场，见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：静态筛选政策缺逐项固定审查原件，动态链接/兼容会漂移；verified字样不能代运行/安全保证，教程执行另带依赖与权限，见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 目录是什么，谁通过它多做成什么？](#detail-section-11)
  - [Q02 · 源码级验证和每日发现证明到哪，失败怎样暴露？](#detail-section-12)
  - [Q03 · 怎样具体使用及何时停止，负担是什么？](#detail-section-13)
  - [Q04 · 有哪些可证伪的目录改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：新开发者理解DSH插件机制，既有用户按一个任务找候选；结果是学习路径/直接仓库链接，见 [Q01](#research-q01)。

GitHub topic散搜与官方文档索引。目录集中分类/示例，未实现被收录的插件能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 使用条件与边界 |
| --- | --- | --- |
| 分类资源目录 | 按任务找候选 | 非可安装运行插件 |
| 入门教程 | 读机制/最小示例 | 执行需另固定版本/授权 |
| 收录规范 | 身份/静态检查原则 | 政策不代逐项证据 |
| 中英导航 | 中文理解/英文全目录 | 非逐条等量翻译保证 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 不满足时 |
| --- | --- | --- |
| Markdown/浏览器 | 阅读目录 | 无需DSH运行 |
| 官方文档/直接仓库 | 当前契约/版本 | 固定链接不代现状 |
| 源码与Host固定版本 | 真选插件 | 不清就停候选 |
| Node/pnpm/模型凭据 | 后续教程执行 | 独立安装/成本动作 |

#### 步骤

| 步骤 | 动作 | 判据与退路 |
| --- | --- | --- |
| 学习 | 读官方入口/最小示例 | 示例不是已装能力 |
| 选缺口 | 按类别挑一项 | 区分插件/客户端/目录 |
| 固定来源 | 到直接仓库核版本接线 | 不据verified默认运行 |
| 决定部署 | 另验一条任务/权限 | 缺依据回官方文档 |
| 退出 | 停阅读 | 已装包另按本包策略 |

**效果与成本**

#### 成本

| 阶段 | 资源/现金 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 阅读 | 本地文档/网页 | 学概念/看英文全目录 | 未测节时 |
| 维护 | 文档/Git变更 | 审来源/兼容/许可 | 静态检查非免费人工 |
| 下游 | 模型/云/安装未知 | 部署与排障 | 不由CC0推免费 |
| 退出 | 阅读无运行态 | 下游各自处理 | 目录无统一回滚 |

#### 效果

| 效果 | 当前支持 | 未确认 |
| --- | --- | --- |
| 身份/分类 | 插件与客户端/目录分开 | 每条身份独立复核 |
| 学习 | 最小教程/官方入口 | 当前版本可运行 |
| 收录 | 静态政策定义 | 全条执行/安全/兼容 |
| 发现效率 | 集中任务索引 | 用户对照/净收益 |

> **思考**：静态筛选政策缺逐项固定审查原件，动态链接/兼容会漂移；verified字样不能代运行/安全保证，教程执行另带依赖与权限，见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把官方教学/任务分类与非插件身份区分整合为发现资源，并明确topic/名字不足以收录；这是文档贡献，不是独立验收市场，见 [Q01](#research-q01)、[Q02](#research-q02)。

治理规则重来源与身份，但固定树是文档，无逐条自包含审查产物或自动失败/更新状态；不把教程或流程声明当执行证明，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

静态筛选政策缺逐项固定审查原件，动态链接/兼容会漂移；verified字样不能代运行/安全保证，教程执行另带依赖与权限，见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

试用作只读学习/找一个候选，随后回直接仓库固定版本另验。不要把目录/verified当安装许可；接线/兼容不清就停止回官方文档，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定文档目录、教程、收录与贡献规范、代表分类/条目已核；未追审全部外链、执行教程或验证每日发现。可只读学习/找候选，不能据目录直接授权安装。

- 已检查：作者 README、包清单、源码路径 CONTRIBUTING.md、README.md、README.zh.md、docs/INCLUSION_POLICY.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：README机制教程/官方入口/分类、代表插件与客户端/生态目录；中页定位与全目录路由、收录规范与贡献指南。未逐条审所有链接、验证外链当前状态、官方API或运行教程。
- 下一步：- 下一步按一个真实任务找候选，核直接仓库固定版本/接线/一条任务。
- 四身份样本比较目录与topic散搜的误判/维护负担。
- 两类对照尚未执行，不用作者政策替代结果。

**分析版本**

- **仓库**：[walkinglabs/awesome-deepseek-harness-plugins](https://github.com/walkinglabs/awesome-deepseek-harness-plugins)
- **版本号**：未声明（[固定提交 0b50bd7](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/tree/0b50bd76ed13d69b6722a35cf63b834e5791c4ec)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向为按条目公开身份/固定版本/静态/Host任务证据层，用四样本盲读测误判与维护成本，已有简介足够则放弃，见 [Q04](#research-q04)。

- 下一步按一个真实任务找候选，核直接仓库固定版本/接线/一条任务。
- 四身份样本比较目录与topic散搜的误判/维护负担。
- 两类对照尚未执行，不用作者政策替代结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1146 | — | — | 25581 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核目录的分类/学习价值与来源验证边界，不把收录当安装或宿主验收。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目录是什么，谁通过它多做成什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

本根是独立社区双语Markdown资源目录，真实类型resource，不是可安装DSH插件、客户端或原生市场。固定树为README中英、贡献/收录规范和LICENSE，教程中的apply/cordis示例是供读者创建的代码块，不是本库正在注册能力。面向初识DSH扩展面的开发者与找一个任务候选的用户，参照GitHub topic散搜：本目录把官方一手入口、运行机制教学、按任务分类插件以及非插件客户端/生态目录分开，减少身份混淆。它的结果是候选链接/学习路径，不是装好的能力。下游工具、流程、UI不归本目录已有贡献。中文页明确完整目录在英文页，不能期待两页逐条等量同步。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-9](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L3-L9)

作者定位和独立/预览边界。

```text
English | [简体中文](README.zh.md)

> A curated index of plugins, starters, tools, and primary resources for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness).

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) is DeepSeek AI's open-source, plugin-first agent harness: models, tools, skills, sessions, sandboxes, filesystems, loops, orchestration, and UI can all be composed as plugins.

> **Developer preview** — DSH is changing quickly and may introduce breaking changes. This independent community list is not endorsed by DeepSeek AI or walkinglabs. Review source code and pin a DSH version/commit before installing any third-party plugin. [中文说明](README.zh.md)
```

**依据 2 · 源码核查**：[README.md:53-79](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L53-L79)

示例是读者创建插件的教程。

<details>
<summary>查看原文（27行）</summary>

````text
Create `scratch-plugin/src/hello-plugin.ts`:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'hello-plugin'

export function apply(ctx: Context) {
  console.log('[hello-plugin] loaded')
}
```

Then create `scratch-plugin/cordis.yml`. Replace the path with the absolute path printed by `pwd` in the DSH checkout:

```yaml
- insert:
    - id: hello
      name: '/absolute/path/to/deepseek-harness/scratch-plugin/src/hello-plugin.ts'
```

Run the development overlay:

```sh
pnpm dsh web --patch ./scratch-plugin/cordis.yml
```

When DSH starts, the terminal should show `[hello-plugin] loaded`. This is the smallest valid DSH plugin: export `apply(ctx)` and register capabilities through the Cordis context. To add an agent-callable tool, declare `export const inject = ['tools']` and register it with the documented DSH tool API. Follow the official [first plugin](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.md) and [tool-plugin](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/tool.md) tutorials for the complete, current API.
````

</details>

**依据 3 · 源码核查**：[README.md:202-219](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L202-L219)

按用途划分目录。

<details>
<summary>查看原文（18行）</summary>

```text
## Contents

- [Start Here — Official DSH Resources](#start-here--official-dsh-resources)
- [Install and Discover Plugins](#install-and-discover-plugins)
- [Productivity & Agent Workflow](#productivity--agent-workflow)
- [Context, Memory & Observability](#context-memory--observability)
- [Tools, Integrations & Automation](#tools-integrations--automation)
- [Design & Creative Tools](#design--creative-tools)
- [Browser, Computer Use & Remote Execution](#browser-computer-use--remote-execution)
- [Interfaces & Web UI](#interfaces--web-ui)
- [Developer Tooling](#developer-tooling)
- [Utilities](#utilities)
- [Creative & Personal](#creative--personal)
- [Games & Play](#games--play)
- [Launchers & Clients](#launchers--clients)
- [Ecosystem Indexes](#ecosystem-indexes)
- [Contributing](#contributing)
- [License](#license)
```

</details>

**依据 4 · 源码核查**：[README.md:567-589](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L567-L589)

客户端和二级目录另列。

<details>
<summary>查看原文（23行）</summary>

```text
## Launchers & Clients

- [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) - Lightweight Windows autostart launcher with a minimal WebView2 window.
- [dsh-launcher](https://github.com/SnowCrescenter-tech/dsh-launcher) - Portable Windows one-click launcher without a Node.js setup.
- [DSHgo](https://github.com/Asuta/DSHgo) - Windows desktop launcher and profile manager.
- [dsh-desktop](https://github.com/bruc3van/dsh-desktop) - Electron desktop client with workspace, session-sharing, remote, and tray support.
- [dsh-web-desktop](https://github.com/ningbonb/dsh-web-desktop) - Electron launcher that reuses an existing DSH Web profile, including its plugins, sessions, and settings; verified with DSH 0.1.1-rc.2.
- [orbis](https://github.com/icodesign/orbis) - Mobile remote-control client for DeepSeek Harness.
- [oh-dsh-desktop](https://github.com/hust-open-atom-club/oh-dsh) - Extensible macOS workbench with native PTY, workspace tools, and isolated preview marketplace.

## Ecosystem Indexes

These are community indexes rather than individual plugins; use them as secondary discovery sources and verify entries yourself.

- [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) - Community-curated DSH plugin list.
- [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) - Bilingual DSH plugin index.
- [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) - Curated DSH extensions and development resources.
- [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) - DSH plugins, skills, MCP servers, orchestrators, and UIs.
- [dsh-suite](https://github.com/whyihaveyou/dsh-suite) - Bilingual directory with daily compatibility CI and a scaffold.
- [DSHPlugin.app](https://dshplugin.app/) - Independent DSH plugin directory with source-backed capability summaries, install information, repository activity, and security signals.
- [DSPlugin.app](https://dsplugin.app/) - Unofficial community DSH plugin directory/registry (Manifest/`dsh.bundle`).
- [oh-my-dsh](https://github.com/wangshunnn/oh-my-dsh) - DSH plugin collection.
- [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) - Large DSH extension ecosystem catalog.
```

</details>

**依据 5 · 源码核查**：[README.zh.md:251-260](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.zh.md#L251-L260)

中文页指向英文完整目录。

<details>
<summary>查看原文（10行）</summary>

```text
## 完整目录 / Full index

[英文完整目录](README.md) 按下列分类维护项目的英文说明；每一类均只收录符合上述 DSH 规则的项目：

- 生产力与 Agent 工作流 / Productivity & Agent Workflow
- 上下文、记忆与可观测性 / Context, Memory & Observability
- 工具、集成与自动化 / Tools, Integrations & Automation
- 设计与创意工具 / Design & Creative Tools
- 浏览器、计算机操作与远程执行 / Browser, Computer Use & Remote Execution
- 终端与 Web 界面 / Interfaces & Web UI
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 源码级验证和每日发现证明到哪，失败怎样暴露？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

政策要求真实manifest/package或明确DSH seam，排除topic/名字/README单方声明，客户端/启动器另标；每日发现设过去48小时、静态查脚本/依赖/入口/敏感操作并不执行代码。这个规则有正确的证据分级意图，但文本是维护者应做之事，不是每条已完成记录。固定树未提供自动发现/校验执行器、逐条固定commit/审查日期/证据行/审查结果档案或运行验收；不能将政策“通过才加入”转成独立验证所有条目安全/兼容。

代表条目既有精确Host兼容描述也有宽泛功能/verified数量文字；指向默认分支/动态网页会漂移，链接存在不保证当前包字节等于被看过版本。贡献指南要求链接和兼容现值，未见机器约束、失效状态/退库记录；故失链/过期可能先由读者发现。阅读机制图是解释，不能代实际DSH当前契约；本轮只研究目录文档治理，没有追审全部链接仓库或执行教程，不把静态初筛当稳定性认证。

#### 证据与依据

**依据 1 · 作者声明**：[docs/INCLUSION_POLICY.md:7-31](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/docs/INCLUSION_POLICY.md#L7-L31)

收录依据/排除和作者每日静态流程。

<details>
<summary>查看原文（25行）</summary>

```text
A project belongs in a plugin category only when its repository provides **source-level evidence** that it extends the official [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) runtime.

At least one of the following must be true:

1. The repository contains an installable DSH repository-plugin manifest, such as `.dsh-plugin/manifest.json`, `.dsh-plugin/package.json`, or a current equivalent documented by DSH.
2. The repository contains a DSH plugin package (for example `dsh.plugin.json` plus a package entry) whose source registers or consumes a documented DSH/Cordis extension seam.
3. It is an official DSH package, example, or documentation page in `deepseek-ai/deepseek-harness`.
4. It is a client, launcher, or development resource with explicit, inspectable DSH integration. Such entries are placed outside the plugin categories and labelled accordingly.

## What does not qualify

- A `dsh-plugin` GitHub topic, `dsh-` name, or README sentence alone.
- A generic DeepSeek model adapter, an unrelated agent tool, a fork/mirror, or a directory of links.
- A repository that cannot be inspected, has no source, or whose claimed DSH integration cannot be found.

## Daily discovery procedure

1. Search public GitHub repositories created or updated in the past 48 hours for `dsh-plugin`, `DeepSeek Harness`, and DSH manifest filenames.
2. Exclude repositories already listed, mirrors, and index-only repositories.
3. Inspect the tree and manifest/package files; confirm the DSH extension seam against the official source/docs.
4. Perform static security triage before inclusion: inspect install/build scripts, dependencies and lockfiles, plugin entrypoints, workflows, and network/process/file-system/credential operations. Reject unresolved risks such as secret exfiltration, opaque payloads, unsafe remote-code execution, approval/sandbox bypasses, or suspicious credential collection. Never execute candidate code or run its install/build scripts.
5. Add only candidates that pass both DSH verification and this basic security triage, with a neutral bilingual description and a compatibility note when supplied.
6. Commit and push only when there is a real change; otherwise leave the repository untouched.

This is static security triage, **not** a complete malware review, reliability certification, or endorsement.
```

</details>

**依据 2 · 源码核查**：[CONTRIBUTING.md:9-28](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/CONTRIBUTING.md#L9-L28)

手工提交与兼容链接维护要求。

<details>
<summary>查看原文（20行）</summary>

````text
An entry should be directly useful to people building with DeepSeek Harness. It must satisfy the [source-level DSH verification policy](docs/INCLUSION_POLICY.md), not only use a `dsh-` name or the `dsh-plugin` topic.

- Be publicly accessible and reasonably maintained.
- Clearly identify itself as a DSH plugin, starter, example, or development resource.
- Link to its source repository or a primary-source page.
- State compatible DSH versions or commit range when it is a plugin.
- Include a concise, neutral description in this format:

  ```markdown
  - [Project](https://example.com) - What it provides and its DSH compatibility.
  ```

Do not submit closed-source products with no DSH integration, duplicated links, promotional copy, topic-only claims, mirrors, or repositories that contain secrets, malware, or unclear licensing.

## Pull requests

1. Add entries in alphabetical order within the relevant section.
2. Keep descriptions factual, concise, and third-person.
3. Verify that every link works and that compatibility information is current.
4. Use the `dsh-plugin` GitHub topic on plugin repositories whenever appropriate.
````

</details>

**依据 3 · 源码核查**：[README.md:238-245](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L238-L245)

代表发现条目主张与政策边界。

```text
- [dsh-plugin-index](https://github.com/ymck-x/dsh-plugin-index) - In-DSH plugin index that trusts only the `dsh.bundle.patch` field in `package.json`: 10,000+ verified third-party plugins, one-click install, plus a companion website. Verified against the DSH developer preview (2026-10).
- [GitHub topic: `dsh-plugin`](https://github.com/topics/dsh-plugin) - The official recommended GitHub topic for DSH plugin repositories.
- [Plugin registry](https://github.com/vlln/plugin-registry) - A lightweight repository-plugin console and `make-dsh-plugin` development guide.
- [Plugin workshop](https://github.com/omdsh-dev/dsh-hub-workshop) - Community plugin-marketplace and registry workshop.

### Curation policy

The `dsh-plugin` topic, a `dsh-` repository name, or a README claim alone is **not enough** for an entry in this list. Every new plugin must meet the source-level verification policy in [INCLUSION_POLICY.md](docs/INCLUSION_POLICY.md): a real DSH plugin manifest/package or a verifiable, official DSH extension seam. Discovery runs daily over projects from the previous 48 hours; candidates also undergo static security triage of scripts, dependencies, entrypoints, workflows, and sensitive operations. Only candidates that pass both checks are added. This is not a complete security audit or a compatibility guarantee.
```

**依据 4 · 源码核查**：[README.md:249-257](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L249-L257)

兼容/能力粒度不同的代表条目。

```text
- [dsh-autocompose](https://github.com/Han-1413141/dsh-autocompose) - Find and compose DSH plugins from a task description, then open an independent chat environment or install the plan into the current profile. Compatible with DSH 0.2.0-rc.2.
- [dsh-file-claim](https://github.com/Nwflower/dsh-file-claim) - File claim/release protection for parallel DSH sessions in one workspace, with stale-heartbeat takeover and a pending three-way-merge area.
- [dsh-worktree](https://github.com/FlashingChen/dsh-worktree) - Permanent Codex-style Git worktrees, agent tools, `/worktree`, and per-repository manifests.
- [dsh-at-file](https://github.com/FSMargoo/dsh-at-file) - Codex-style `@file` mentions that search a workspace and attach file contents to prompts.
- [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) - Open a DSH workspace directly in VS Code from the Web UI.
- [dsh-plannotator](https://github.com/titanwings/dsh-plannotator) - Anchored plan annotations and structured agent feedback.

- [dsh-product-subagent-console](https://github.com/Jokasa7/dsh-product-subagent-console) - Conversation-level multi-agent workbench for editable task planning, real child-session observation, plan-versus-runtime comparison, and evidence-backed recovery previews; tested with DSH 0.1.1-rc.2.
- [dsh-crew](https://github.com/ZSeven-W/dsh-crew) - Dispatch DSH workers from Claude Code or Codex with in-host sessions, live progress, workspace locks, and recursion guards; external CLI workers are an explicit opt-in and use their documented always-approve modes.
```

**依据 5 · 源码核查**：[README.md:579-589](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L579-L589)

二级目录明确需自己验证。

<details>
<summary>查看原文（11行）</summary>

```text
These are community indexes rather than individual plugins; use them as secondary discovery sources and verify entries yourself.

- [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) - Community-curated DSH plugin list.
- [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) - Bilingual DSH plugin index.
- [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) - Curated DSH extensions and development resources.
- [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) - DSH plugins, skills, MCP servers, orchestrators, and UIs.
- [dsh-suite](https://github.com/whyihaveyou/dsh-suite) - Bilingual directory with daily compatibility CI and a scaffold.
- [DSHPlugin.app](https://dshplugin.app/) - Independent DSH plugin directory with source-backed capability summaries, install information, repository activity, and security signals.
- [DSPlugin.app](https://dsplugin.app/) - Unofficial community DSH plugin directory/registry (Manifest/`dsh.bundle`).
- [oh-my-dsh](https://github.com/wangshunnn/oh-my-dsh) - DSH plugin collection.
- [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) - Large DSH extension ecosystem catalog.
```

</details>

#### 缺口

- 条目逐项审查过程、当前链接/兼容和教程实际运行未核。
  **影响**：不能以目录收录准入/安全背书，也不宣称所有条目失效。
  **进一步探讨**：只选一项后固定其提交，核实际DSH接线、依赖/脚本和一条任务；分别保存作者主张/独立检查/运行结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样具体使用及何时停止，负担是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

可试用作只读学习/发现：新开发者先读官方入口和最小插件教学理解name/inject/apply，再按一个真实缺口选一个候选，分清插件/客户端/二级目录，打开直接仓库固定Host和插件版本另验。只读无需安装本库、账号或模型；不要直接执行“current Node”/未固定主分支的示例当兼容保证。教学的npx、pnpm install/build和API key会安装/运行外部代码或产生模型资源，是后续独立动作，本轮不授权/不执行。

首次负担是读图/英文完整目录及名词学习；持续是人审更新、下游漂移/许可证/凭据与付费服务核实。目录CC0只覆盖目录作品，不能把子项目同样视为CC0/免费。下游安装、模型/云和人工排障费用未知，不能因目录免费阅读就推零成本；本库没有帮下游回滚。当前只读退出直接停止阅读，若已另装按该包卸载/数据策略处理。缺少固定兼容/真实接线或安装权限解释就停在候选，回官方文档和直接仓库，不用点赞/收录/数量替代验收。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:31-50](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L31-L50)

外部安装/构建教学是真执行前置。

<details>
<summary>查看原文（20行）</summary>

````text
### 1. Install and run DeepSeek Harness

Install a current [Node.js](https://nodejs.org/) release, then run:

```sh
npx @deepseek-ai/dsh web
```

Open `http://127.0.0.1:3080`. In **Settings → Models**, add a DeepSeek API key; then select a workspace before starting a session. The official [Web UI guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/index.md) explains the next steps.

### 2. Create a minimal plugin from source

Plugin development currently starts from an official DSH checkout:

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
mkdir -p scratch-plugin/src
````

</details>

**依据 2 · 源码核查**：[README.md:73-79](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L73-L79)

教程回官方当前API。

````text
Run the development overlay:

```sh
pnpm dsh web --patch ./scratch-plugin/cordis.yml
```

When DSH starts, the terminal should show `[hello-plugin] loaded`. This is the smallest valid DSH plugin: export `apply(ctx)` and register capabilities through the Cordis context. To add an agent-callable tool, declare `export const inject = ['tools']` and register it with the documented DSH tool API. Follow the official [first plugin](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/index.md) and [tool-plugin](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/tool.md) tutorials for the complete, current API.
````

**依据 3 · 源码核查**：[README.md:223-230](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L223-L230)

官方原始入口。

```text
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) - Official source repository; the primary reference for releases, issues, and compatibility.
- [Documentation guide](https://deepseek-harness.github.io/deepseek-harness/guide) - Official documentation portal supplied by the DSH project.
- [Run DSH](https://github.com/deepseek-ai/deepseek-harness#run) - Start the local Web UI with `npx @deepseek-ai/dsh web`.
- [Architecture](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md) - How the plugin-first DSH runtime is structured.
- [Capability seams](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/capability-seams.md) - Extension boundaries for DSH capabilities.
- [Cordis primer](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/cordis-primer.md) - Introduction to the underlying composability framework.
- [Development guide](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/development.md) - Build DSH from source and contribute upstream.
- [Defensive patterns](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/defensive-patterns.md) - Official guidance for safer extensions.
```

**依据 4 · 源码核查**：[README.md:579-589](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L579-L589)

目录仍要求自行验证。

<details>
<summary>查看原文（11行）</summary>

```text
These are community indexes rather than individual plugins; use them as secondary discovery sources and verify entries yourself.

- [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) - Community-curated DSH plugin list.
- [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) - Bilingual DSH plugin index.
- [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) - Curated DSH extensions and development resources.
- [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) - DSH plugins, skills, MCP servers, orchestrators, and UIs.
- [dsh-suite](https://github.com/whyihaveyou/dsh-suite) - Bilingual directory with daily compatibility CI and a scaffold.
- [DSHPlugin.app](https://dshplugin.app/) - Independent DSH plugin directory with source-backed capability summaries, install information, repository activity, and security signals.
- [DSPlugin.app](https://dsplugin.app/) - Unofficial community DSH plugin directory/registry (Manifest/`dsh.bundle`).
- [oh-my-dsh](https://github.com/wangshunnn/oh-my-dsh) - DSH plugin collection.
- [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) - Large DSH extension ecosystem catalog.
```

</details>

**依据 5 · 源码核查**：[README.md:591-597](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L591-L597)

目录贡献与CC0范围。

```text
## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

To the extent possible under law, the maintainers have waived all copyright and related rights to this work under [CC0 1.0](LICENSE).
```

**依据 6 · 源码核查**：[CONTRIBUTING.md:21-27](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/CONTRIBUTING.md#L21-L27)

许可/当前兼容要求。

```text
Do not submit closed-source products with no DSH integration, duplicated links, promotional copy, topic-only claims, mirrors, or repositories that contain secrets, malware, or unclear licensing.

## Pull requests

1. Add entries in alphabetical order within the relevant section.
2. Keep descriptions factual, concise, and third-person.
3. Verify that every link works and that compatibility information is current.
```

#### 缺口

- 没有学习/选型效率与下游部署/费用对照。
  **影响**：推荐只读找候选，不是推荐安装目录收录包。
  **进一步探讨**：记录选错身份/步骤遗漏/查找时间，与直接官方文档/topic对照后决定是否继续使用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 有哪些可证伪的目录改进？

**研究主题**：新假设与验证

#### 完整回答

候选是每条链接旁给可复核的证据层：身份/固定commit/静态敏感面已查/Host运行任务已验分别表示，保留日期与范围，不再让单词verified承载不同含义。推导是政策定义严、代表条目却没有自包含版本审查记录，故读者仍需重做。相对当前自然语言简介，拿四样本（原生插件、客户端、二级目录、README自称但无接线）让读者盲选/判断安装前缺什么，测误把收录当验收及维护分钟。若现有简介和直接仓库已足以判断，或维护hash/状态成本超过减少误判，就推翻；不声称本目录已实现该机制。

#### 证据与依据

**依据 1 · 源码核查**：[docs/INCLUSION_POLICY.md:9-20](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/docs/INCLUSION_POLICY.md#L9-L20)

身份四类/不可作为证据的主张。

<details>
<summary>查看原文（12行）</summary>

```text
At least one of the following must be true:

1. The repository contains an installable DSH repository-plugin manifest, such as `.dsh-plugin/manifest.json`, `.dsh-plugin/package.json`, or a current equivalent documented by DSH.
2. The repository contains a DSH plugin package (for example `dsh.plugin.json` plus a package entry) whose source registers or consumes a documented DSH/Cordis extension seam.
3. It is an official DSH package, example, or documentation page in `deepseek-ai/deepseek-harness`.
4. It is a client, launcher, or development resource with explicit, inspectable DSH integration. Such entries are placed outside the plugin categories and labelled accordingly.

## What does not qualify

- A `dsh-plugin` GitHub topic, `dsh-` name, or README sentence alone.
- A generic DeepSeek model adapter, an unrelated agent tool, a fork/mirror, or a directory of links.
- A repository that cannot be inspected, has no source, or whose claimed DSH integration cannot be found.
```

</details>

**依据 2 · 源码核查**：[README.md:238-245](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L238-L245)

verified/兼容与静态边界同处入口。

```text
- [dsh-plugin-index](https://github.com/ymck-x/dsh-plugin-index) - In-DSH plugin index that trusts only the `dsh.bundle.patch` field in `package.json`: 10,000+ verified third-party plugins, one-click install, plus a companion website. Verified against the DSH developer preview (2026-10).
- [GitHub topic: `dsh-plugin`](https://github.com/topics/dsh-plugin) - The official recommended GitHub topic for DSH plugin repositories.
- [Plugin registry](https://github.com/vlln/plugin-registry) - A lightweight repository-plugin console and `make-dsh-plugin` development guide.
- [Plugin workshop](https://github.com/omdsh-dev/dsh-hub-workshop) - Community plugin-marketplace and registry workshop.

### Curation policy

The `dsh-plugin` topic, a `dsh-` repository name, or a README claim alone is **not enough** for an entry in this list. Every new plugin must meet the source-level verification policy in [INCLUSION_POLICY.md](docs/INCLUSION_POLICY.md): a real DSH plugin manifest/package or a verifiable, official DSH extension seam. Discovery runs daily over projects from the previous 48 hours; candidates also undergo static security triage of scripts, dependencies, entrypoints, workflows, and sensitive operations. Only candidates that pass both checks are added. This is not a complete security audit or a compatibility guarantee.
```

**依据 3 · 源码核查**：[README.md:567-589](https://github.com/walkinglabs/awesome-deepseek-harness-plugins/blob/0b50bd76ed13d69b6722a35cf63b834e5791c4ec/README.md#L567-L589)

四样本可区分类别。

<details>
<summary>查看原文（23行）</summary>

```text
## Launchers & Clients

- [dsh-launcher](https://github.com/Ruler4396/dsh-launcher) - Lightweight Windows autostart launcher with a minimal WebView2 window.
- [dsh-launcher](https://github.com/SnowCrescenter-tech/dsh-launcher) - Portable Windows one-click launcher without a Node.js setup.
- [DSHgo](https://github.com/Asuta/DSHgo) - Windows desktop launcher and profile manager.
- [dsh-desktop](https://github.com/bruc3van/dsh-desktop) - Electron desktop client with workspace, session-sharing, remote, and tray support.
- [dsh-web-desktop](https://github.com/ningbonb/dsh-web-desktop) - Electron launcher that reuses an existing DSH Web profile, including its plugins, sessions, and settings; verified with DSH 0.1.1-rc.2.
- [orbis](https://github.com/icodesign/orbis) - Mobile remote-control client for DeepSeek Harness.
- [oh-dsh-desktop](https://github.com/hust-open-atom-club/oh-dsh) - Extensible macOS workbench with native PTY, workspace tools, and isolated preview marketplace.

## Ecosystem Indexes

These are community indexes rather than individual plugins; use them as secondary discovery sources and verify entries yourself.

- [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) - Community-curated DSH plugin list.
- [awesome-dsh-plugin](https://github.com/bruc3van/awesome-dsh-plugin) - Bilingual DSH plugin index.
- [awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin) - Curated DSH extensions and development resources.
- [awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness) - DSH plugins, skills, MCP servers, orchestrators, and UIs.
- [dsh-suite](https://github.com/whyihaveyou/dsh-suite) - Bilingual directory with daily compatibility CI and a scaffold.
- [DSHPlugin.app](https://dshplugin.app/) - Independent DSH plugin directory with source-backed capability summaries, install information, repository activity, and security signals.
- [DSPlugin.app](https://dsplugin.app/) - Unofficial community DSH plugin directory/registry (Manifest/`dsh.bundle`).
- [oh-my-dsh](https://github.com/wangshunnn/oh-my-dsh) - DSH plugin collection.
- [oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) - Large DSH extension ecosystem catalog.
```

</details>

#### 缺口

- 分层状态的真实读者需求/维护净价值未测。
  **影响**：仅机会假设不计本版已有创新。
  **进一步探讨**：先做四样本判读对照，不先建新市场/审查平台。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
