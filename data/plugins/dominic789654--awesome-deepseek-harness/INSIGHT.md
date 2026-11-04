# Awesome DeepSeek Harness

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[1527962](https://github.com/Dominic789654/awesome-deepseek-harness/tree/15279621171720bc3b376be62dab971dcbce0bf7)

<!-- BEGIN META -->
[![GitHub ★ 414](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=414&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Dominic789654/awesome-deepseek-harness)
<!-- END META -->

> **功能**：按任务分类收录 DeepSeek Harness 插件、Skill、MCP、客户端及其他配套资源的双语目录。

> **亮点**：项目把跨类型候选组织成可直接浏览的双语索引，并为部分精选保留原帖线索。新增重复的检查按分类和语言与基线对比，能提示新冲突而不要求先清理历史行。其贡献限于候选组织和投稿反馈。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：新增校验没有覆盖历史行，也未在可见代码中强制两份 README 成对改动。精选样例还使用随分支移动的安装命令。对兼容性敏感的任务，应先回源确认组件和固定版本。见 [Q02](#research-q02)、[Q04](#research-q04)。

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
  - [Q01 · 跨类型目录相对直接搜 GitHub topic 提供什么增量？](#detail-section-11)
  - [Q02 · 投稿校验拦截哪些情况，近期和星标字段从哪里来？](#detail-section-12)
  - [Q03 · 根目录和四个示例的运行边界在哪里？](#detail-section-13)
  - [Q04 · 什么任务值得先浏览目录，何时停止并切换来源？](#detail-section-14)
  - [Q05 · 带身份和证据状态的候选卡能否降低误选？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要为 DSH 找记忆、界面或其他扩展，却还不知道项目名时，可以从任务分类拿到一组可回源的候选。

对照 GitHub topic 搜索与直接打开原仓库。前者也能广泛找项目，但需要读者自己组织类型与任务，后者在已知项目名时步骤更少。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 双语分类索引 | 从任务找到项目链接 | 两份首页覆盖须分别核对 |
| 精选与原帖链接 | 回看目录保存的推荐线索 | 安装例子和推荐日期不绑定固定提交 |
| 投稿反馈 | 检查新增条目和提示重复 | 目录历史行与目标可安装性另行核查 |

**流程与依赖**

| 依赖 | 用途 | 条件与边界 |
| --- | --- | --- |
| Markdown 或 Git 快照 | 浏览根目录 | 阅读本地固定快照无需安装 DSH |
| GitHub Actions、curl、GitHub API | 投稿检查 | 依赖 runner 网络及 API；topic 请求失败只警告 |
| 对应 DSH Profile、目标包或服务 | 验证某个候选 | 随所选组件单独核对，与根目录分开 |

| 步骤 | 操作 | 失败或退出 |
| --- | --- | --- |
| 筛选 | 按任务分类记录最多三个链接 | 目标已知时直接回源 |
| 回源 | 核对组件路径、版本和兼容条件 | 信息缺失则换候选或去发布页 |
| 另行验收 | 仅在确需目标时按目标方案验证 | 目录阶段不改宿主配置 |

**效果与成本**

| 成本 | 承担者与计量 | 条件 |
| --- | --- | --- |
| 首次 | 读者按一次候选筛选记录浏览时间 | 静态阅读无需改 Profile |
| 持续 | 读者核对上游版本，维护者同步双语 | 未测人工耗时及现金成本 |
| 失败恢复 | 读者重新搜索或换候选 | 错把目录行当安装验证会增加回源次数 |

| 预期效果 | 合格判据 | 证据边界 |
| --- | --- | --- |
| 形成短名单 | 保存可以核对原始项目的少量链接 | 分类与链接存在，筛选耗时和成功率未测 |
| 发现投稿格式问题 | PR 对新增行给出具体错误反馈 | 代码可见，真实 runner 与分支保护未验证 |

> **思考**：新增校验没有覆盖历史行，也未在可见代码中强制两份 README 成对改动。精选样例还使用随分支移动的安装命令。对兼容性敏感的任务，应先回源确认组件和固定版本。见 [Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：项目把跨类型候选组织成可直接浏览的双语索引，并为部分精选保留原帖线索。新增重复的检查按分类和语言与基线对比，能提示新冲突而不要求先清理历史行。其贡献限于候选组织和投稿反馈。见 [Q01](#research-q01)、[Q02](#research-q02)。

投稿去重从可信 base 运行并按事件 SHA 校验 head，之后只读取 Git 数据。分类级仓库键适合提示目录重复，但会合并同仓不同路径，不能作为组件身份。星趋势按日采集本目录仓库自身的数据，和条目星标快照分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

新增校验没有覆盖历史行，也未在可见代码中强制两份 README 成对改动。精选样例还使用随分支移动的安装命令。对兼容性敏感的任务，应先回源确认组件和固定版本。见 [Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当读者尚不熟悉某类扩展时，可限时浏览目录，先从任务分类挑少量目标并记录链接，进入原仓库后另行核对版本和组件。若无法完成回源，直接转向发布页或 topic 搜索。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

双语分类、链接与投稿工作流已在固定版本中核对。候选卡为待验证假设。精选归属按项目页面记录，实际远端保护、各候选兼容性及收益尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh-CN.md、CONTRIBUTING.md、.github/workflows/validate-pr.yml、.github/workflows/check-duplicates.yml、.scripts/dsh_recent_added.py、.scripts/annotate_stars.py、.github/workflows/star-history.yml、plugins/README.md、plugins/dsh-viz/package.json、LICENSE、docs/official-picks.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根目录、两个首页相关片段、投稿与星趋势工作流、近期与星标脚本、四个示例文档及一个代表性包清单。未逐项验证大清单、原帖、外部 cron、分支保护或示例运行。统计包含子包源码，不能用来推断根运行规模。
- 下一步：选同一任务比较目录浏览与 topic 搜索，记录短名单中组件身份核对成功率、误选次数、人工回源时间。若要采用具体示例，应按子包和宿主版本另行做隔离 Profile 验收。

**分析版本**

- **仓库**：[Dominic789654/awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness)
- **版本号**：未声明（[固定提交 1527962](https://github.com/Dominic789654/awesome-deepseek-harness/tree/15279621171720bc3b376be62dab971dcbce0bf7)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

候选卡若单列组件路径、固定提交与验证状态，可能减少将仓库推荐误读为可安装组件的次数。可用同批任务比较误选率和总人时。见 [Q05](#research-q05)。

选同一任务比较目录浏览与 topic 搜索，记录短名单中组件身份核对成功率、误选次数、人工回源时间。若要采用具体示例，应按子包和宿主版本另行做隔离 Profile 验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 18298 | — | — | 564818 |
| .ts | source | 4 | 669 | 530 | 96 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/Dominic789654/awesome-deepseek-harness/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Dominic789654/awesome-deepseek-harness/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Dominic789654/awesome-deepseek-harness/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：这个双语目录如何帮助 DSH 用户找到可回源的候选，其提示和投稿校验在哪一步失效，使用者还要自行核对什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨类型目录相对直接搜 GitHub topic 提供什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目录适合已经知道任务类别、还不知道候选项目名的 DSH 用户。例如在需要给会话补记忆时，先沿 Session & Memory Management 分类查看短说明，再保存一至三个指向原仓库的候选。相对逐个搜索 dsh、dsh-plugin 等 topic，目录把任务分类、双语入口和来源线索组织在一起，精选段还提供原帖跳转。两份首页徽章显示的 entries 分别是 5657 与 5649，这只能证明页面声明不同，不能解释差额或换算出独立插件数。目录同时收录 Skill、MCP、UI 等形态，合格结果是一个可回源且类型待核对的短名单。已知精确项目名时，直接访问原仓库更短；一行描述或精选标签不能替代选中组件的接入验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-24](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/README.md#L16-L24)

作者界定跨类型收录范围与投稿入口

```text
> A curated list of **plugins, skills, MCP servers, patch/profile layers, orchestrators, aggregators & UIs** for **DeepSeek Harness (DSH)** — DeepSeek's official agent runtime built around the idea **`Model + Harness = Agent`**.

**English** | [简体中文](./README.zh-CN.md)

DeepSeek Harness ("DSH") is DeepSeek's agent runtime / harness layer — the "hands" that turn the model's reasoning into real actions (context management, tool-call orchestration, execution sandbox, feedback loop, session persistence). Its defining feature is an **open plugin ecosystem**: the community contributes plugins, skills, MCP servers, orchestrators, aggregators, and UIs.

This list collects the best of that ecosystem. Contributions welcome — see [Contributing](#contributing).

> **Tip for authors:** DeepSeek asks plugin repositories to carry the **`#dsh`** GitHub topic so they can be discovered. Add it to your repo, then open a PR here.
```

**依据 2 · 源码核查**：[README.md:64-86](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/README.md#L64-L86)

按任务类别组织入口

<details>
<summary>查看原文（23行）</summary>

```text
## Contents

- [Official Picks](#official-picks)
- [Official](#official)
- [Profiles & Patch Layers](#profiles--patch-layers)
- [Harnesses & Runtimes](#harnesses--runtimes)
- [Security & Permissions](#security--permissions)
- [Session & Memory Management](#session--memory-management)
- [Cost & Usage Tracking](#cost--usage-tracking)
- [Channel / IM Bridges](#channel--im-bridges)
- [Plugin Marketplaces & Ecosystem](#plugin-marketplaces--ecosystem)
- [Visualization](#visualization)
- [Slides / PPT](#slides--ppt)
- [Documents & Export](#documents--export)
- [Coding](#coding)
- [Agents](#agents)
- [Loops (Auto-Research, Self-Improve, etc.)](#loops-auto-research-self-improve-etc)
- [MCP Servers](#mcp-servers)
- [Tools & Integrations](#tools--integrations)
- [Orchestrators & Aggregators](#orchestrators--aggregators)
- [UI / Clients](#ui--clients)
- [Skills](#skills)
- [Resources](#resources)
```

</details>

**依据 3 · 源码核查**：[README.md:91-104](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/README.md#L91-L104)

精选区混有插件和目录，并给出来源链接

<details>
<summary>查看原文（14行）</summary>

```text
## Official Picks

_Highlights personally recommended by **Tianyi Cui** ([@tianyi](https://x.com/tianyi)), DeepSeek Harness team lead, in his **【DSH 社区插件推荐】** series on X. Newest first; each entry links the original post. Kept in sync with [README.zh-CN.md](./README.zh-CN.md)._

- [oh-my-dsh/dsh-plugin-upgrade-skill](https://github.com/oh-my-dsh/dsh-plugin-upgrade-skill) — Upgrade skills for DSH plugin authors: 195 versioned upgrade cards (0.1.0-rc.8 → 0.2.0-rc.1) and 11 skills that list breaking changes, patch the plugin, test and publish — so Claude Code / Codex / Gemini can migrate an old plugin to a new DSH release, scored by a 63-task public benchmark.  `⭐287` · Team pick 2026-10-05 · [post](https://x.com/tianyi/status/2107030904233460208)
- [bowenliang123/dsh-context](https://github.com/bowenliang123/dsh-context) — Context insight and management suite: a context dashboard, browser, sidebar and `context` command that show what the model's window is made of — composition vs. window size, per-request history, compression and injection events, per-message token stats, and multi-agent views.  `⭐2304` · Team pick 2026-09-30 · [post](https://x.com/tianyi/status/2105256532657267119)

### 🔍 Plugin Directories (team pick #3 · 2026-09-28)

- [dshfind](https://dshfind.com/) · [hikariming/dshfind](https://github.com/hikariming/dshfind) — Learning site + plugin marketplace in one: a systematic course from the basics to Cordis papers, plus a marketplace auto-aggregated from the GitHub `dsh-plugin` topic, S/A/B/C ratings, a dev guide, and an author leaderboard.  `⭐280`
- [dshmarket](https://dshmarket.com/) · [dsh-market/dsh-market](https://github.com/dsh-market/dsh-market) — The only marketplace that installs into the DSH settings page: browse / search / one-click install / theme switch across 4000+ plugins, most take effect on refresh.  Install: `dsh plugin --profile web add dshmarket`  `⭐4837`
- [awesome-dsh-plugin](https://awesome-dsh-plugin.com/) · [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) — Community-curated directory: a repo must be installable via `dsh plugin add` to be listed; bilingual categories, continuously human-verified.  `⭐17192`
- _In their words:_ “今天提名几个广泛使用、内容丰富、更新及时的 DSH 插件导航站吧～ dshfind.com / dshmarket.com / awesome-dsh-plugin.com。其中 dshmarket 也可直接作为 DSH 插件安装到设置页中。（不代表公司立场，不对非官方网站的内容负责。）”
- Starter path: install dshmarket → filter for quality with awesome-dsh-plugin → learn the internals and read ratings on dshfind. [post](https://x.com/tianyi/status/2104565558712959065)
```

</details>

**依据 4 · 源码核查**：[README.md:5-13](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/README.md#L5-L13)

英文首页徽章文本 5657

```text
# Awesome DeepSeek Harness [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

<p align="center">
  <img src="https://img.shields.io/badge/entries-5657-4d6bfe?style=flat-square" alt="entries">
  <img src="https://img.shields.io/github/stars/Dominic789654/awesome-deepseek-harness?style=flat-square&color=4d6bfe" alt="stars">
  <img src="https://img.shields.io/github/last-commit/Dominic789654/awesome-deepseek-harness?style=flat-square" alt="last commit">
  <img src="https://img.shields.io/github/contributors/Dominic789654/awesome-deepseek-harness?style=flat-square" alt="contributors">
  <a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs welcome"></a>
  <a href="./docs/official-picks.md"><img src="https://img.shields.io/badge/Official%20Picks-ff8c42?style=flat-square" alt="Official Picks"></a>
```

**依据 5 · 源码核查**：[README.zh-CN.md:5-13](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/README.zh-CN.md#L5-L13)

中文首页徽章文本 5649

```text
# Awesome DeepSeek Harness [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

<p align="center">
  <img src="https://img.shields.io/badge/entries-5649-4d6bfe?style=flat-square" alt="entries">
  <img src="https://img.shields.io/github/stars/Dominic789654/awesome-deepseek-harness?style=flat-square&color=4d6bfe" alt="stars">
  <img src="https://img.shields.io/github/last-commit/Dominic789654/awesome-deepseek-harness?style=flat-square" alt="last commit">
  <img src="https://img.shields.io/github/contributors/Dominic789654/awesome-deepseek-harness?style=flat-square" alt="contributors">
  <a href="./CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs welcome"></a>
  <a href="./docs/official-picks.md"><img src="https://img.shields.io/badge/%E5%AE%98%E6%96%B9%E6%8E%A8%E8%8D%90-ff8c42?style=flat-square" alt="Official Picks"></a>
```

#### 缺口

- 双语条目是否逐项对齐及差额来源未核实
  **影响**：双语读者可能看到不同候选，不能从徽章推断真实覆盖
  **进一步探讨**：对两个文件解析普通分类并按仓库、组件路径和语言对账

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 投稿校验拦截哪些情况，近期和星标字段从哪里来？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

文档要求两份 README 同步、只新增，且说明会做链接和 topic 检查。固定工作流先取 PR head 计算 merge base，把非目录 PR 分流，再限制目录 PR 的改动范围并抽取新增行中的 Markdown 条目。可见实现没有拒绝任一 README 缺席或任意删除行，也没有逐项验证历史记录。仅直接 GitHub 仓库 URL 进入 topic API 分支，API 失败记警告。链接探测拒绝指定状态，不能替代安装或维护检查。独立去重 workflow 以可信 base 执行、把 head 当作数据，按分类对比重复数，GitHub 键舍弃路径和分支。因此同仓多个合法组件可能碰到同一键，不同分类的重复仍可保留。近期脚本以 README 的 Git 新增行为输入，反映目录近期编辑，不代表项目发布。单项星标脚本取快照表；仓库自身星趋势 workflow 是另一条按日采样链路。

#### 证据与依据

**依据 1 · 作者声明**：[CONTRIBUTING.md:70-85](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/CONTRIBUTING.md#L70-L85)

贡献文档声明增量检验规则

<details>
<summary>查看原文（16行）</summary>

```text
## Automated checks

Every PR that touches `README.md` / `README.zh-CN.md` runs an automated check.
It only inspects the lines **you added** (existing rows are grandfathered in), and it verifies:

| Check | What it requires |
| --- | --- |
| Format | `- [Name](https://link) — Concise one-line description.` |
| Description | Non-empty (a trailing `` `⭐N` `` badge alone doesn't count) |
| Link | Resolves — a `404` / `410` / unreachable URL fails the check |
| Topic | GitHub repos must carry a `dsh` / `dsh-plugin` / `dsh-skill` / `deepseek-harness` topic |
| Scope | The PR touches only the two README files |
| Insert-only | Your diff adds lines without modifying or deleting existing entries |

If something fails, the bot posts a comment listing exactly what to fix.
Push a new commit to the same branch and the check re-runs automatically — no need to reopen the PR.
```

</details>

**依据 2 · 源码核查**：[.github/workflows/validate-pr.yml:28-83](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/.github/workflows/validate-pr.yml#L28-L83)

只要任一 README 改动即进入目录检查，筛新增列表行

<details>
<summary>查看原文（56行）</summary>

```text
      - name: Fetch PR head
        env:
          PR_NUM: ${{ github.event.pull_request.number }}
        run: |
          git fetch origin "pull/${PR_NUM}/head:pr-head"
          base_sha="$(git merge-base origin/${{ github.base_ref }} pr-head)"
          echo "BASE_SHA=$base_sha" >> "$GITHUB_ENV"

          # Does this PR touch the curated list files at all?
          if git diff --name-only "$base_sha" pr-head \
               | grep -qE '^(README\.md|README\.zh-CN\.md)$'; then
            echo "IS_LIST_PR=true" >> "$GITHUB_ENV"
          else
            echo "IS_LIST_PR=false" >> "$GITHUB_ENV"
            echo "This PR does not touch README.md / README.zh-CN.md."
            echo "Skipping list-entry validation (nothing to check)."
          fi

      - name: Check changed files scope
        if: env.IS_LIST_PR == 'true'
        env:
          BASE_SHA: ${{ env.BASE_SHA }}
        run: |
          changed=$(git diff --name-only "$BASE_SHA" pr-head)
          echo "Changed files:"
          echo "$changed"
          bad=$(echo "$changed" | grep -v -E '^(README\.md|README\.zh-CN\.md)$' || true)
          if [ -n "$bad" ]; then
            echo "::error::This PR touches files outside the README list files:"
            echo "$bad" | sed 's/^/  - /'
            echo "::error::List submissions should only modify README.md and/or README.zh-CN.md."
            exit 1
          fi

      - name: Validate new entries
        id: validate
        if: env.IS_LIST_PR == 'true'
        env:
          BASE_SHA: ${{ env.BASE_SHA }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          set -uo pipefail

          # Collect added lines that look like list entries
          git diff --unified=0 "$BASE_SHA" pr-head -- README.md README.zh-CN.md \
            | grep -E '^\+' | grep -v -E '^\+\+\+' | sed 's/^+//' > /tmp/added.txt || true

          grep -E '^\s*-\s*\[' /tmp/added.txt > /tmp/entries.txt || true

          added_count=$(wc -l < /tmp/entries.txt | tr -d ' ')
          echo "Added entry lines: $added_count"

          if [ "$added_count" = "0" ]; then
            echo "No new list entries detected — nothing to validate."
            echo "result=noentries" >> "$GITHUB_OUTPUT"
            exit 0
```

</details>

**依据 3 · 源码核查**：[.github/workflows/validate-pr.yml:114-148](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/.github/workflows/validate-pr.yml#L114-L148)

描述、有限状态码和仓库 URL topic 的失败分支

<details>
<summary>查看原文（35行）</summary>

```text
            # --- description present
            clean_desc=$(echo "$desc" | sed -E 's/`⭐[0-9]+`//g' | sed -E 's/[[:space:]—–-]//g')
            if [ -z "$clean_desc" ]; then
              echo "::error::Missing description: $line"
              echo "- ❌ **Description** — entry has no description text: $url" >> /tmp/report.md
              fail=1
            fi

            # --- link reachable
            code=$(curl -sS -o /dev/null -w '%{http_code}' -L --max-time 25 \
                    -H 'User-Agent: dsh-list-bot' "$url" 2>/dev/null || echo 000)
            echo "HTTP $code for $url"
            if [ "$code" = "404" ] || [ "$code" = "410" ] || [ "$code" = "000" ]; then
              echo "::error::Link unreachable (HTTP $code): $url"
              echo "- ❌ **Link** — unreachable (HTTP \`$code\`): $url" >> /tmp/report.md
              fail=1
              echo "::endgroup::"
              continue
            fi

            # --- GitHub repo: check dsh topic
            if echo "$url" | grep -qE '^https?://github\.com/[^/]+/[^/]+/?$'; then
              slug=$(echo "$url" | sed -E 's#^https?://github\.com/##; s#/$##')
              topics=$(gh api "repos/$slug" --jq '.topics | join(",")' 2>/dev/null || echo "__ERR__")
              if [ "$topics" = "__ERR__" ]; then
                echo "::warning::Could not read topics for $slug"
                echo "- ⚠️ **Topic** — could not read topics for \`$slug\` (private/renamed?)" >> /tmp/report.md
              elif echo "$topics" | grep -qE '(^|,)(dsh|dsh-plugin|dsh-skill|deepseek-harness)(,|$)'; then
                echo "dsh topic OK ($topics)"
              else
                echo "::warning::No dsh topic on $slug (topics: $topics)"
                echo "- ⚠️ **Topic** — \`$slug\` has no \`dsh\` / \`deepseek-harness\` topic (found: \`${topics:-none}\`). Please add the \`dsh\` topic to your repo." >> /tmp/report.md
                fail=1
              fi
            fi
```

</details>

**依据 4 · 源码核查**：[.github/workflows/check-duplicates.yml:1-41](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/.github/workflows/check-duplicates.yml#L1-L41)

比较基线、固定 head 与非阻塞定位

<details>
<summary>查看原文（41行）</summary>

```text
name: Check Duplicates

# Compare per-language, per-category URL counts against the PR merge base.
# Only increases in duplicate rows are reported; existing duplicates and
# cross-category listings are left alone. Findings are advisory, not a gate.
on:
  pull_request_target:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

concurrency:
  group: check-duplicates-${{ github.event.pull_request.number }}
  cancel-in-progress: true

jobs:
  check:
    runs-on: ubuntu-latest
    continue-on-error: true
    if: github.repository == 'Dominic789654/awesome-deepseek-harness'
    steps:
      - name: Checkout trusted base only
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.base.sha }}
          fetch-depth: 0
          persist-credentials: false

      - name: Fetch PR data without checking it out
        env:
          PR_NUM: ${{ github.event.pull_request.number }}
          HEAD_SHA: ${{ github.event.pull_request.head.sha }}
        run: |
          set -euo pipefail
          git fetch --no-tags origin "pull/${PR_NUM}/head"
          # A newer push must not be reported as if it were this event's head.
          test "$(git rev-parse FETCH_HEAD)" = "$HEAD_SHA"
          base_sha="$(git merge-base HEAD "$HEAD_SHA")"
          echo "BASE_SHA=$base_sha" >> "$GITHUB_ENV"
```

</details>

**依据 5 · 源码核查**：[.github/workflows/check-duplicates.yml:64-95](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/.github/workflows/check-duplicates.yml#L64-L95)

仓库键舍弃子路径，分类范围计数

<details>
<summary>查看原文（32行）</summary>

```text
          def key_of(url):
              url = url.strip().rstrip('/')
              try:
                  parsed = urlsplit(url)
              except ValueError:
                  return url.lower()
              parts = parsed.path.strip('/').split('/')
              if parsed.hostname and parsed.hostname.lower() == 'github.com' and len(parts) >= 2:
                  # GitHub project identity ignores branch/subpath/query/fragment.
                  return '/'.join(parts[:2]).lower().removesuffix('.git')
              return url.lower()

          def index(text):
              counts = Counter()
              section = None
              fence = None
              for line in text.splitlines():
                  stripped = line.lstrip()
                  if fence:
                      if re.fullmatch(re.escape(fence[0]) + '{' + str(len(fence)) + r',}\s*', stripped):
                          fence = None
                      continue
                  if match := re.match(r'(`{3,}|~{3,})', stripped):
                      fence = match.group(1)
                      continue
                  if line.startswith('## '):
                      section = line[3:].strip()
                      continue
                  if section is not None and section not in SKIP:
                      if match := ENTRY.match(line):
                          counts[(section, key_of(match.group(1)))] += 1
              return counts
```

</details>

**依据 6 · 源码核查**：[.scripts/dsh_recent_added.py:14-29](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/.scripts/dsh_recent_added.py#L14-L29)

以目录 Git diff 构造近期条目

<details>
<summary>查看原文（16行）</summary>

```text
def recent(days, limit):
    """Added README entry lines in the last N days (newest commits first)."""
    r = subprocess.run(["git", "log", f"--since={days} days ago", "--pretty=format:@@%H%x09%ad",
                        "--date=short", "-p", "--unified=0", "--", "README.md"],
                       cwd=REPO, text=True, capture_output=True)
    out, seen, commit = [], set(), None
    for line in r.stdout.splitlines():
        if line.startswith("@@"):
            commit = line[2:]
        elif ENTRY.match(line):
            entry = line[1:].strip()
            key = entry.split("](")[0]
            if key not in seen:
                seen.add(key)
                out.append((commit, entry))
    return out[:limit], len(out)
```

</details>

**依据 7 · 源码核查**：[.scripts/annotate_stars.py:8-29](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/.scripts/annotate_stars.py#L8-L29)

静态快照驱动单项星标

<details>
<summary>查看原文（22行）</summary>

```text
STARS_FILE = pathlib.Path.home() / "awesome-deepseek-harness" / ".stars-snapshot.tsv"
THRESHOLD = 10

# load stars: full_name -> stars
stars = {}
for line in STARS_FILE.read_text().splitlines():
    parts = line.split("\t")
    if len(parts) >= 2 and parts[1].isdigit():
        stars[parts[0].lower()] = int(parts[1])

badge_re = re.compile(r"\s*`?⭐[\d,]+`?")           # existing badge to strip
entry_re = re.compile(r"^(- \[)([^\]]+)(\]\()(https://github\.com/([A-Za-z0-9._-]+/[A-Za-z0-9._-]+))")

def process(path):
    p = pathlib.Path(path)
    out = []
    changed = 0
    for line in p.read_text().splitlines():
        m = entry_re.match(line)
        if m:
            repo = m.group(5).lower()
            st = stars.get(repo)
```

</details>

**依据 8 · 源码核查**：[.github/workflows/star-history.yml:23-41](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/.github/workflows/star-history.yml#L23-L41)

日采样生成目录仓库自身的趋势数据

<details>
<summary>查看原文（19行）</summary>

```text
jobs:
  sample:
    runs-on: ubuntu-latest
    # Never run on forks: it would try to push and would chart the wrong repo.
    if: github.repository == 'Dominic789654/awesome-deepseek-harness'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Record today's star count and render chart
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: python3 .scripts/star_history.py

      - name: Commit if changed
        run: |
          set -euo pipefail
          if git diff --quiet -- assets/star-history.tsv assets/star-history.svg; then
            echo "No change in star history; nothing to commit."
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 根目录和四个示例的运行边界在哪里？

**研究主题**：工程质量与复用、依赖、兼容与流程

#### 完整回答

根目录的使用面是 Markdown 索引。固定 Git 树没有根 package.json 或根 Host 挂载清单，根 LICENSE 开头为 CC0。示例索引把四个示例列在 plugins 子目录。直接核查其中 dsh-viz 的包清单，确认其独立入口是 lib/index.js，manifest 指向包内 cordis.patch.yml，构建脚本使用 tsc，DeepSeek peer 版本为通配。其余三个示例在本题只按索引说明识别用途。模板文档列出四个示例分别对应可视化、幻灯片、评审上下文和研究日志，并明示未在真实 DSH 验证。浏览根文档只需可读 Markdown 或 Git 快照；投稿需要 GitHub PR，自动验证需要 runner、curl 和 API；试用示例或外链目标则另需匹配的宿主、目标包与权限。子包的工具代码存在，不表示根目录具备同样的工具注册能力。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/README.md:24-44](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/plugins/README.md#L24-L44)

示例约定与独立子包挂载路径

<details>
<summary>查看原文（21行）</summary>

````text
### Minimal host-only plugin contract (as used here)

```text
my-plugin/
├── package.json        # type=module, main=lib/index.js, "dsh": { "bundle": { "patch": "./cordis.patch.yml" } }
├── dsh.plugin.json     # { id, version, main, description, engines: { dsh }, contributes: { tools, skills } }
├── cordis.patch.yml    # top-level array: - insert: [{ id, name, config: {} }]
├── tsconfig.json
├── src/index.ts        # exports: name, inject, Config (schemastery), apply(ctx, config)
├── skills/<name>/SKILL.md   # optional agent-facing skill (YAML frontmatter + checklist)
└── README.md
```

Key conventions observed in the wild:

- **Host entry** exports `name`, `inject` (required services, e.g. `['tools']`), `Config` (a `@deepseek-ai/schemastery` schema whose callable form applies defaults) and `apply(ctx, config)`. Long-lived resources are effect-owned and return disposers.
- **Tools** are registered with `ctx.tools.register(defineTool({ name, description, parameters, output: { schema, render }, async execute(args) { ... } }))` from `@deepseek-ai/dsh-tools`. Parameter entries are `{ type, required, description }`.
- **`cordis.patch.yml`** mounts the plugin into a profile layer stack; users tune the `config` object on the same row in their profile patch.
- **`dsh.plugin.json`** appears in the `omdsh-dev` family and `DSH-better-sidebar` but not in every plugin; the `package.json` `dsh` field + `cordis.patch.yml` are the parts every repo agrees on. We ship both.
- **Web/client bundles** (`dsh.client`, `./client` export, `lib/client.js`) exist only for plugins with UI surfaces. Per the community contract: *no web need → no client bundle*. All plugins here are host-only.
- **Install**: `dsh plugin --profile <name> add file:/absolute/path/to/plugin` (or a package/git ref), then restart that profile.
````

</details>

**依据 2 · 作者声明**：[plugins/README.md:48-59](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/plugins/README.md#L48-L59)

四个示例各自入口及作者运行边界

<details>
<summary>查看原文（12行）</summary>

```text
## The plugins

| Plugin | Tool(s) | What it does |
| --- | --- | --- |
| [`dsh-viz`](./dsh-viz/) | `chart_render` | Turn structured data into a self-contained ECharts HTML chart in the workspace |
| [`dsh-slides`](./dsh-slides/) | `slides_generate` | Turn a markdown outline into a reveal.js HTML slide deck |
| [`dsh-code-review`](./dsh-code-review/) | `code_review_context` (+ skill) | Collect git diff context deterministically; skill drives the review checklist |
| [`dsh-research-loop`](./dsh-research-loop/) | `research_log` (+ skill) | Durable JSONL research log; skill drives a plan→search→read→synthesize loop |

## Status / honesty note

These are **structurally faithful skeletons**: manifests, mounting, entry contract and tool schemas follow the observed conventions, and the tool `execute` bodies implement the core logic in plain Node. They have **not** been verified against a live DSH instance (public beta access required), and `@deepseek-ai/*` peer packages are declared loosely (`*`). Treat them as reference implementations, not production plugins.
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-viz/package.json:1-35](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/plugins/dsh-viz/package.json#L1-L35)

示例包独立入口、构建、MIT 声明及通配依赖

<details>
<summary>查看原文（35行）</summary>

```text
{
  "name": "dsh-viz",
  "description": "Visualization tool for DeepSeek Harness: chart_render turns structured data into a self-contained ECharts HTML artifact inside the active workspace.",
  "version": "0.1.0",
  "license": "MIT",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "dsh.plugin.json",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-tools": "*",
    "@deepseek-ai/schemastery": "*"
```

</details>

**依据 4 · 源码核查**：[README.md:52-62](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/README.md#L52-L62)

安装命令用 owner/repo 占位，指向选中目标

<details>
<summary>查看原文（11行）</summary>

````text
## Quick Start

```bash
# Launch the DSH Web UI
npx @deepseek-ai/dsh web

# Install a community plugin (from this list) into your profile
dsh plugin --profile web add "github:owner/repo#main"
```

Before installing, confirm the target repo carries the **`#dsh`** GitHub topic so the community hub can index it.
````

</details>

**依据 5 · 源码核查**：[LICENSE:1-5](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/LICENSE#L1-L5)

根许可证文本为 CC0

```text
CC0 1.0 Universal

Statement of Purpose

The laws of most jurisdictions throughout the world automatically confer
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么任务值得先浏览目录，何时停止并切换来源？

**研究主题**：效果与总成本、采用判断

#### 完整回答

在不熟悉选项、且任务可落到一个现有分类时，把该目录作为一次限时浏览入口。首先取不超过三个候选，再到其仓库核对确切组件、版本和兼容说明。目录正文可以静态读取，无须配置宿主；使用者的主要持续成本是人工去重和回源，维护者另有双语提交与 PR 修正成本。精选样例使用 #main，无法把原帖日期绑定到安装时检出的代码。链接跳转失败可以换用其他候选；若关键组件、固定版本或兼容说明仍不明确，结束目录浏览，转向项目发布页或直接搜索。计量单位应为获得一个可继续验收的候选所用时间和误选数。未测量时间、费用和净收益，不以链接或星数作为合格结果。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:52-86](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/README.md#L52-L86)

安装占位命令与读者可用的分类入口

<details>
<summary>查看原文（35行）</summary>

````text
## Quick Start

```bash
# Launch the DSH Web UI
npx @deepseek-ai/dsh web

# Install a community plugin (from this list) into your profile
dsh plugin --profile web add "github:owner/repo#main"
```

Before installing, confirm the target repo carries the **`#dsh`** GitHub topic so the community hub can index it.

## Contents

- [Official Picks](#official-picks)
- [Official](#official)
- [Profiles & Patch Layers](#profiles--patch-layers)
- [Harnesses & Runtimes](#harnesses--runtimes)
- [Security & Permissions](#security--permissions)
- [Session & Memory Management](#session--memory-management)
- [Cost & Usage Tracking](#cost--usage-tracking)
- [Channel / IM Bridges](#channel--im-bridges)
- [Plugin Marketplaces & Ecosystem](#plugin-marketplaces--ecosystem)
- [Visualization](#visualization)
- [Slides / PPT](#slides--ppt)
- [Documents & Export](#documents--export)
- [Coding](#coding)
- [Agents](#agents)
- [Loops (Auto-Research, Self-Improve, etc.)](#loops-auto-research-self-improve-etc)
- [MCP Servers](#mcp-servers)
- [Tools & Integrations](#tools--integrations)
- [Orchestrators & Aggregators](#orchestrators--aggregators)
- [UI / Clients](#ui--clients)
- [Skills](#skills)
- [Resources](#resources)
````

</details>

**依据 2 · 源码核查**：[docs/official-picks.md:19-34](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/docs/official-picks.md#L19-L34)

精选样例链接原帖，但安装示例跟随 main

<details>
<summary>查看原文（16行）</summary>

````text
## 1. dsh-TUI — 把 DSH 搬回终端

- 仓库：<https://github.com/ccch1mneyyy/dsh-TUI>
- 是什么：Claude Code 风格的全屏终端界面（TUI），补齐了 DSH 缺失的终端形态。像素鲸鱼顶栏、实时工作状态行、流式思考展开、双击 Esc 时间回溯、上下文进度条 + TPS 仪表。
- 官方推荐日期：**2026-09-26**
- tianyi 原话：

  > 推荐一下从 DeepSeek Harness 内测期间就持续开发的 dsh-TUI。做得非常用心，补齐了 DSH 缺失的 TUI 界面，并持续随 DSH 版本更新及打磨功能。

- 安装：

  ```bash
  dsh plugin --profile web add "github:ccch1mneyyy/dsh-TUI#main"
  ```

- 推荐原推：<https://x.com/tianyi/status/2103821968944533526>
````

</details>

**依据 3 · 作者声明**：[CONTRIBUTING.md:20-31](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/CONTRIBUTING.md#L20-L31)

投稿方承担双语和增量编辑成本

<details>
<summary>查看原文（12行）</summary>

````text
2. Fork this repo and edit **both** `README.md` and `README.zh-CN.md` (keep the two in sync).
3. Add your entry under the most fitting category, using this exact format:

   ```
   - [Name](https://link) — Concise one-line description.
   ```

   (Chinese file uses ` —— ` as the separator.)

4. **Only add new lines — never modify or delete existing ones.**
   Your diff should be pure insertions. Add your entry as its own complete line;
   don't append it onto a neighbouring row or split an existing row in half.
````

</details>

#### 缺口

- 无实际候选筛选耗时和后续成功率对照
  **影响**：无法量化节约的时间或误选成本
  **进一步探讨**：以同一类任务比较目录浏览与 GitHub topic 搜索并记录回源结果

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 带身份和证据状态的候选卡能否降低误选？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：给候选额外记录仓库、组件路径、固定提交与验证状态，可能减少把整仓链接、近期收录或精选标签误读为组件可安装的次数。该推导来自去重使用仓库级键和精选安装示例指向 main 的实际边界。用同一批分类任务和固定候选池，交替让读者使用原目录与候选卡，按盲审记录组件选错率、原始证据定位成功率和总人时，同时记录维护补卡时间。如果误选不降，或总人时连同维护成本上升而合格候选数未增，应撤回试验设计。这是研究者提出的目录改造，未在该仓库实现。

#### 证据与依据

**依据 1 · 源码核查**：[.github/workflows/check-duplicates.yml:64-74](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/.github/workflows/check-duplicates.yml#L64-L74)

仓库级键忽略子目录，解释需另存组件身份

<details>
<summary>查看原文（11行）</summary>

```text
          def key_of(url):
              url = url.strip().rstrip('/')
              try:
                  parsed = urlsplit(url)
              except ValueError:
                  return url.lower()
              parts = parsed.path.strip('/').split('/')
              if parsed.hostname and parsed.hostname.lower() == 'github.com' and len(parts) >= 2:
                  # GitHub project identity ignores branch/subpath/query/fragment.
                  return '/'.join(parts[:2]).lower().removesuffix('.git')
              return url.lower()
```

</details>

**依据 2 · 源码核查**：[docs/official-picks.md:21-34](https://github.com/Dominic789654/awesome-deepseek-harness/blob/15279621171720bc3b376be62dab971dcbce0bf7/docs/official-picks.md#L21-L34)

仓库、推荐日期与原帖有记录，但安装命令没有固定提交

<details>
<summary>查看原文（14行）</summary>

````text
- 仓库：<https://github.com/ccch1mneyyy/dsh-TUI>
- 是什么：Claude Code 风格的全屏终端界面（TUI），补齐了 DSH 缺失的终端形态。像素鲸鱼顶栏、实时工作状态行、流式思考展开、双击 Esc 时间回溯、上下文进度条 + TPS 仪表。
- 官方推荐日期：**2026-09-26**
- tianyi 原话：

  > 推荐一下从 DeepSeek Harness 内测期间就持续开发的 dsh-TUI。做得非常用心，补齐了 DSH 缺失的 TUI 界面，并持续随 DSH 版本更新及打磨功能。

- 安装：

  ```bash
  dsh plugin --profile web add "github:ccch1mneyyy/dsh-TUI#main"
  ```

- 推荐原推：<https://x.com/tianyi/status/2103821968944533526>
````

</details>

#### 缺口

- 没有候选卡原型及对照记录
  **影响**：推演尚不能算当前项目贡献
  **进一步探讨**：按上述同批任务和盲审指标做最小对照试验

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
