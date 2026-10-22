# KRouter

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[e934696](https://github.com/398894496-arch/KRouter/tree/e9346963eca848a5012406ea5cb2f0cacc55fbb6)

<!-- BEGIN META -->
[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=yellow&logo=github&style=flat)](https://github.com/398894496-arch/KRouter)
<!-- END META -->

> **实现功能**：让多个编程Agent共享Markdown记忆，通过DSH七个查询工具提供canonical路由、分层全文召回、弱匹配拒答和来源收据。

> **核心亮点**：将canonical有效状态、ranked分层权重、弱近邻拒绝与来源hash设为默认，跨Agent共用可编辑Markdown；相同两规则BM25基线并未被证明显著超越。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **风险与缺陷**：canonical过滤无效页，但ranked对旧页仅乘0.25仍可召回；metadata缓存与followlinks不构成新鲜度/物理沙箱。DSH同步执行和可选writer lane权限需分开，未做越界复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 共享记忆适合谁，什么算合格？](#detail-section-11)
  - [Q02 · DSH路由、exact与ranked recall怎样连接？](#detail-section-12)
  - [Q03 · 纠错与作者对照支持什么结论？](#detail-section-13)
  - [Q04 · 可选写手与导入的安全边界是什么？](#detail-section-14)
  - [Q05 · 启动、维护和恢复依赖什么？](#detail-section-15)
  - [Q06 · 首次、持续和失败成本有哪些？](#detail-section-16)
  - [Q07 · 采用建议与未来假设如何证伪？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向跨Claude Code/Codex/Cursor/DSH工作的个人开发者，希望同一份Markdown记住决定与更改，不用每次重复说明。DSH包只提供七个查询工具接头，完整产品还含可选导入、夜间整理和备份，不会因dsh plugin add自动启动计时器。Obsidian是可选编辑/查看器，不是运行必须的服务。

合格查询是引用当前有效来源，旧决定被替代时先给纠错页，库里没有足够资料时明确不知道；最终Agent还需根据来源正确执行任务。canonical_match表示路由映射命中，不证明资料事实或模型答案正确，拒答率也需和可回答覆盖率一起看。

参照是grep/SQLite全文检索加手工笔记。插件在canonical有效页路由、ranked旧页降权、拒绝弱近邻和收据上有具体组合价值，不是新的语义向量检索。适合愿意维护可读笔记和明确适用范围的单用户；多人租户隔离、任意账户机密和无人审阅自进化不能只靠“第二大脑”文案保证。README的旧名DSH-KRouter可解释迁移线索，本轮目录成员关系仍unknown，不认定移除或确认当前收录。

grep/SQLite全文检索与人工状态笔记；相同拒答/旧页处理规则基线须单独比较，不归因全部收益给ranker。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH接头 | 七查询工具调用本机router | 同步spawn、实例固定vault，非宿主沙箱 |
| canonical | alias锁定有效来源 | 词面启发，不是事实认证 |
| ranked recall | 本地FTS5与拒答门 | 旧页dead仅降权，可能误引/漏答 |
| 收据 | 来源/map SHA与状态/时间 | 可追版本，不自动确认内容适用 |
| 可选完整产品 | 导入/夜间写手/备份 | 不由DSH plugin add自动启用，另审权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools、defineTool和schemastery | DSH接头必需 | 七工具注册与配置 | peer版本为*，兼容实际需核 |
| Node运行时 | 接头必需 | ESM和spawnSync | 包未声明最低版本，不硬填 |
| Python3及SQLite FTS5 | Python召回需要 | 本地FTS索引与状态路由 | 缺扩展会走错误/字面降级，非相同召回 |
| shell/路由脚本 | 非Windows优先路径 | bundled或installed router | 显式路径/env有执行权限影响 |
| vaultPath/环境与真实Markdown库 | 查询必需 | 每实例固定库目标 | 没有vault直接返回错误 |
| Obsidian | 可选 | 编辑/同步查看 | 不影响本地路由 |
| 模型key或明确CLI与timer | 可选夜间写手需要 | 导入蒸馏/整理 | DSH plugin add不安装timer |
| 独立备份位置/口令 | 可选备份需要 | 恢复vault历史 | 本轮未验证加密实现/恢复结果 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包/库，备份原件，先lookup-only | 不把空库当已有知识 |
| 接入 | 指定vaultPath与可信router，安装DSH接头 | 七工具返回ok/code和来源收据 |
| 查询 | 短词/问题核对canonical与recall状态 | none不猜，hint不当hit，打开原文 |
| 纠错 | 审核当前/替代状态与适用项目 | 旧页不再竞争，不靠同名文件夹当身份 |
| 写手 | 明确选择是否导入/timer/lane，先dry-run | 核数据外发与可读写范围 |
| 恢复 | 停timer后核原页/收据/备份，必要时重建缓存 | 不把接头卸载等于外部job停止 |

来源目录成员本轮unknown；README旧名是线索，不改固定身份。只检查源码，不运行任何router、安装、模型、job或宿主冒烟。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 路由/SQLite索引、个人Markdown材料 | 填有效决定与纠错状态，核库路径 | 作者110ms等不是本轮测量 |
| 持续使用 | 本地扫描/FTS刷新、每次同步spawn、查询日志 | 维护当前事实、审核引用与alias | 无向量服务，不代表零维护 |
| 可选写手 | 模型token、CLI进程、导入与备份 | 选择授权范围、检查nightly报告 | 每lane/库规模不同，无本轮费用/RSS |
| 失败恢复 | 原文/历史、查询收据与重建cache | 查误拒/错误引用、过期状态、写手变更 | 收据hash可核版本，不等于自动回滚 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 来源 | exact/recall收据、状态和SHA | 来源内容真实/当前任务适用 |
| 拒答 | 词面/coverage/库外词门槛 | 真用户错误引用与漏答平衡 |
| 纠错 | live页/替代状态参与路由 | 写手总能正确识别更改 |
| 跨Agent | 一个vault配多个socket | 多人隔离/所有客户端实际兼容 |

lookup本身没有模型调用，日志/缓存仍写本地；结果随后作为工具输出进入用户选定模型。作者held-out和真实开发集各有边界，匹配规则相同基线不显著落后。应把维护事实、拒答后人工查证、可选nightly消费与备份都计入，而非只算一次检索延迟。

> **思考**：canonical过滤无效页，但ranked对旧页仅乘0.25仍可召回；metadata缓存与followlinks不构成新鲜度/物理沙箱。DSH同步执行和可选writer lane权限需分开，未做越界复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将canonical有效状态、ranked分层权重、弱近邻拒绝与来源hash设为默认，跨Agent共用可编辑Markdown；相同两规则BM25基线并未被证明显著超越。详见[Q02](#research-q02)、[Q03](#research-q03)。

将canonical有效状态、ranked分层权重、弱近邻拒绝与来源hash设为默认，跨Agent共用可编辑Markdown；相同两规则BM25基线并未被证明显著超越。详见[Q02](#research-q02)、[Q03](#research-q03)。

夜间run.sh先执行writer，再按配置nightly步骤，dry-run走offline状态和各步发送量估计。DSH工具与nightly分开，插件卸载不自动删除vault，也不能据此认为外部系统timer已停止。导入、写手和备份要按实际安装路径判断，不能从包里存在代码推断用户已经授权或启用。

llm gate将Codex视可读整个账户的lane，只有点名或KROUTER_ALLOW_CODEX允许；其它不能约束CLI需ALLOW_UNCONFINED。writer_invoke为grok配置沙箱、Claude设dontAsk和带vault路径的工具白名单，Codex workspace-write+cwd vault。API文本lane不启本地Agent，但仍会把选定文本发模型。这里是程序参数/门控检查，不是本轮对第三方CLI强制约束的验收。

脱敏过滤已知key形态、label、URL/连接口令和secret页，不能覆盖任意无标识秘密或Agent自主读取。README/SECURITY也明确文本过滤不能管CLI自身读取；vault含不可信网页/聊天时，工具白名单与kernel沙箱不是同一种强度。备份/封账/修订链可提高恢复可读性，但对整个夜间写手和备份加密未做完整审计，不把作者“自动零维护”当无需审核。

<a id="detail-section-5"></a>

### 1.4 主要限制

canonical过滤无效页，但ranked对旧页仅乘0.25仍可召回；metadata缓存与followlinks不构成新鲜度/物理沙箱。DSH同步执行和可选writer lane权限需分开，未做越界复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用lookup-only。先非敏感个人vault核对来源、旧页与拒答，保持原件；nightly/导入/writer按各lane权限另评，不把接头卸载当timer停止。详见[Q07](#research-q07)。

合格查询是引用当前有效来源，旧决定被替代时先给纠错页，库里没有足够资料时明确不知道；最终Agent还需根据来源正确执行任务。canonical_match表示路由映射命中，不证明资料事实或模型答案正确，拒答率也需和可回答覆盖率一起看。

参照是grep/SQLite全文检索加手工笔记。插件在canonical有效页路由、ranked旧页降权、拒绝弱近邻和收据上有具体组合价值，不是新的语义向量检索。适合愿意维护可读笔记和明确适用范围的单用户；多人租户隔离、任意账户机密和无人审阅自进化不能只靠“第二大脑”文案保证。README的旧名DSH-KRouter可解释迁移线索，本轮目录成员关系仍unknown，不认定移除或确认当前收录。

采用建议：有试用lookup-only。先非敏感个人vault核对来源、旧页与拒答，保持原件；nightly/导入/writer按各lane权限另评，不把接头卸载当timer停止。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持词面锁定、状态路由与拒答/收据；ranked旧页只降权、同步执行及writer权限各有边界，作者合成实验不当真实收益。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、extras/dsh/README.md、extras/dsh/lib/index.js、extras/dsh/lib/register.js、extras/dsh/lib/route.js、skill/krouter-obsidian/scripts/canonical_lookup.py、skill/krouter-obsidian/scripts/route_knowledge.py、skill/krouter-obsidian/scripts/recall_index.py、skill/krouter-obsidian/scripts/llm.py、skill/krouter-obsidian/scripts/krouter_redact.py、extras/host-daily-evolution/run.sh、extras/host-daily-evolution/resolve.py、SECURITY.md、docs/BENCHMARK.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定DSH注册/同步路由、Python canonical与FTS刷新/门控、状态/脱敏、writer lane opt-in与argv、nightly编排及作者benchmark方法；未完整审计shell/Python等价、备份加密或所有导入器，不运行目标。目录membership本轮unknown。
- 下一步：进一步探讨从两项目同名规则、纠错、无答案近邻和人写双语题开始，对比错引/覆盖/维护时间；另用可丢弃vault核链接与指定writer权限。

**分析版本**

- **仓库**：[398894496-arch/KRouter](https://github.com/398894496-arch/KRouter)
- **版本号**：1.2.1（[固定提交 e934696](https://github.com/398894496-arch/KRouter/tree/e9346963eca848a5012406ea5cb2f0cacc55fbb6)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索来源版本/适用域/证据级别与冲突收据，区分词面lock和人工确认，比较跨项目错引、覆盖与维护开销；未实现。详见[Q07](#research-q07)。

进一步探讨从两项目同名规则、纠错、无答案近邻和人写双语题开始，对比错引/覆盖/维护时间；另用可丢弃vault核链接与指定writer权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 261 | 5945 | — | — | 69028 |
| .js | source | 3 | 309 | 284 | 3 | — |
| .mjs | source | 2 | 157 | 131 | 6 | — |
| .md | example | 8 | 79 | — | — | 394 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/398894496-arch/KRouter/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=grey&logo=github&style=flat)](https://github.com/398894496-arch/KRouter/issues?q=is%3Aissue+created%3A2026-09-22T05%3A50%3A45.974Z..2026-10-22T05%3A50%3A45.974Z) [![近30天关闭 7](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=7&color=grey&logo=github&style=flat)](https://github.com/398894496-arch/KRouter/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A50%3A45.974Z..2026-10-22T05%3A50%3A45.974Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**判断固定版本共享Markdown记忆路由的引用/拒答价值，区分DSH只读接头、ranked旧页权重和可选夜间写手边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 共享记忆适合谁，什么算合格？

**研究主题：**场景与需求

#### 完整回答

面向跨Claude Code/Codex/Cursor/DSH工作的个人开发者，希望同一份Markdown记住决定与更改，不用每次重复说明。DSH包只提供七个查询工具接头，完整产品还含可选导入、夜间整理和备份，不会因dsh plugin add自动启动计时器。Obsidian是可选编辑/查看器，不是运行必须的服务。

合格查询是引用当前有效来源，旧决定被替代时先给纠错页，库里没有足够资料时明确不知道；最终Agent还需根据来源正确执行任务。canonical_match表示路由映射命中，不证明资料事实或模型答案正确，拒答率也需和可回答覆盖率一起看。

参照是grep/SQLite全文检索加手工笔记。插件在canonical有效页路由、ranked旧页降权、拒绝弱近邻和收据上有具体组合价值，不是新的语义向量检索。适合愿意维护可读笔记和明确适用范围的单用户；多人租户隔离、任意账户机密和无人审阅自进化不能只靠“第二大脑”文案保证。README的旧名DSH-KRouter可解释迁移线索，本轮目录成员关系仍unknown，不认定移除或确认当前收录。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-17](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/README.md#L1-L17)

作者定位共享决定与拒答，固定文档实验口径。

<details>
<summary>查看原文（17行）</summary>

```text
# KRouter

**Your coding agents remember what you decided — and what you changed your mind about.**

Claude Code, Codex, Cursor and DeepSeek Harness share one memory: a folder of plain Markdown in [Obsidian](https://obsidian.md) that you can read and edit. Ask "how did we decide to ship?" and the agent answers with the page it came from. A correction replaces the old answer instead of competing with it. When the vault does not know, the agent is told so, rather than handed something close.

[![ci](https://github.com/398894496-arch/KRouter/actions/workflows/ci.yml/badge.svg)](https://github.com/398894496-arch/KRouter/actions/workflows/ci.yml) [![release](https://img.shields.io/github/v/release/398894496-arch/KRouter)](https://github.com/398894496-arch/KRouter/releases/latest) [![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE) · 中文：[`README.zh.md`](README.zh.md)

![Monday we decide A, Wednesday we change it to B, Thursday the agent answers B and cites the correction; a question the vault cannot answer is refused](docs/img/demo.gif)

**Measured, not claimed.** On 200 held-out questions in English and Chinese that it was never tuned on, at default
settings, KRouter cites a wrong page 26% of the time; claude-mem 64%, basic-memory 78%. Of 80 questions the vault
cannot answer, KRouter refuses 47; the other two refuse none. Of 60 questions about a decision that was later
changed, it gets 50 right; they get 34 and 16. Neither of them can refuse or knows a page was replaced, so part of
that gap is by construction: plain full-text search given KRouter's two rules is level with it. What KRouter adds is
having those rules on by default, plus receipts and a vault you can edit. [How it was measured](docs/BENCHMARK.md#third-bench-200-held-out-questions-on-a-vault-nobody-tunes-on-2026-10-13) · [rerun it in one second](#check-it-yourself)

```

</details>

**依据 2 · 源码核查**：[extras/dsh/README.md:3-7](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/extras/dsh/README.md#L3-L7)

DSH接头不自动启动timer。

```text
This directory is the **DeepSeek Harness socket** of KRouter, not a second product.

The product is the repo root: router (`skill/krouter-obsidian`) + writer (`extras/host-daily-evolution`) + this socket. One vault. `dsh plugin add` does not start the timer.

Uninstalling the socket does not delete notes.
```

**依据 3 · 源码核查**：[extras/dsh/lib/register.js:43-95](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/extras/dsh/lib/register.js#L43-L95)

七只读路由工具。

<details>
<summary>查看原文（53行）</summary>

```text
    name: "krouter_status",
    route: "status",
    needsQuery: false,
    description:
      "Agent second brain home / vault status. Includes lamp and self-evolution key. If host_action is present, tell the host (vault-page key or CLI login). Read-only. Cite the receipt source.",
  },
  {
    name: "krouter_preference",
    route: "preference",
    needsQuery: true,
    description:
      "Memory system: host preferences and constraints. Short noun. If canonical_match is true, open canonical_source.",
  },
  {
    name: "krouter_correction",
    route: "correction",
    needsQuery: true,
    description:
      "Memory system: corrections and supersedes. Short noun. If canonical_match is true, open canonical_source.",
  },
  {
    name: "krouter_memory",
    route: "memory",
    needsQuery: true,
    description:
      "Memory system: high-trust memory index. Short noun. Not a vector search. If canonical_match is true, open canonical_source.",
  },
  {
    name: "krouter_project",
    route: "project",
    needsQuery: true,
    description:
      "Knowledge base: literal search under 01 项目. Short noun. If canonical_match is true, open canonical_source.",
  },
  {
    name: "krouter_search",
    route: "search",
    needsQuery: true,
    description:
      "Knowledge base search: alias table first, then literal rg. Not a vector search. If canonical_match is true, open canonical_source.",
  },
  {
    name: "krouter_suggest",
    route: "suggest",
    needsQuery: true,
    description:
      "Nearest alias hints on a miss. Hints are not hits. Retry one alias with krouter_search.",
  },
];

export const KROUTER_TOOL_NAMES = TOOLS.map((t) => t.name);

export function registerKrouterTools(ctx, config, defineTool) {
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH路由、exact与ranked recall怎样连接？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

工具参数为短query，固定白名单只允许status/preference/correction/memory/project/search/suggest。runRoute按config/env选择vault与router，Windows优先Python，其它平台先shell，spawnSync带20秒timeout直接继承环境运行；没有调用ctx.subprocess或每会话vault选择。返回解析stdout首个同名冒号字段，模型文本输出仍需结合结构化ok/code与来源。

Python先查canonical alias映射和来源是否live，再输出来源/映射SHA-256与时间收据。exact并非只有逐字相等，规范化删除空格/标点，alias包含/被包含达到分数带也可锁源；同义语义仍依映射/词面。未锁定时FTS5按CJK双字/拉丁词召回，状态/tier提权，按分数底线、实词覆盖、库外词和margin决定confidence；缺乏足够覆盖报none，可扩到vault并显式标scope_widened，最后退字面检索。

贡献在把有效状态/旧页权重、纠错优先、弱匹配拒绝和可核对收据设为默认，并跨Agent共用透明库；作者自己说明匹配规则相同的BM25基线不显著落后。称“read-only”应限定为DSH不暴露写vault/别名工具，查询会刷新本地SQLite缓存并记查询JSONL，不能理解成机器上零写入。

#### 证据与依据

**依据 1 · 源码核查**：[extras/dsh/lib/route.js:11-19](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/extras/dsh/lib/route.js#L11-L19)

固定查询路由白名单。

```text
const ALLOWED = new Set([
  "status",
  "preference",
  "correction",
  "memory",
  "project",
  "search",
  "suggest",
]);
```

**依据 2 · 源码核查**：[extras/dsh/lib/route.js:65-111](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/extras/dsh/lib/route.js#L65-L111)

vault/router与同步子进程、timeout和继承环境。

<details>
<summary>查看原文（47行）</summary>

```text
  return explicit || process.env.OBSIDIAN_VAULT || process.env.KROUTER_VAULT || "";
}

export function runRoute({ route, query = "", vault, router, timeoutMs = 20000 } = {}) {
  if (!ALLOWED.has(route)) {
    return {
      ok: false,
      code: 2,
      stdout: "",
      stderr: `refused route: ${route}. read-only: ${[...ALLOWED].join("|")}\n`,
    };
  }
  const vaultRoot = resolveVault(vault);
  if (!vaultRoot) {
    return { ok: false, code: 2, stdout: "", stderr: "set OBSIDIAN_VAULT or vaultPath\n" };
  }
  const script = resolveRouter(router);
  if (!script) {
    return {
      ok: false,
      code: 2,
      stdout: "",
      stderr: "route_knowledge.sh not found. run ./scripts/install.sh or set KROUTER_ROUTER\n",
    };
  }
  const args = [route];
  if (query) args.push(query);
  const isPy = String(script).endsWith(".py");
  const result = isPy
    ? spawnSync(...pythonArgv(script, args), {
        encoding: "utf8",
        timeout: timeoutMs,
        cwd: dirname(script),
        env: { ...process.env, OBSIDIAN_VAULT: vaultRoot },
      })
    : spawnSync(script, args, {
        encoding: "utf8",
        timeout: timeoutMs,
        env: { ...process.env, OBSIDIAN_VAULT: vaultRoot },
      });
  return {
    ok: result.status === 0,
    code: result.status ?? 1,
    stdout: result.stdout || "",
    stderr: result.stderr || (result.error ? String(result.error) : ""),
  };
}
```

</details>

**依据 3 · 源码核查**：[skill/krouter-obsidian/scripts/canonical_lookup.py:139-163](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/canonical_lookup.py#L139-L163)

alias锁定不只是逐字等价。

<details>
<summary>查看原文（25行）</summary>

```text
def carries(a: str, q: str) -> bool:
    """An alias inside a longer question locks only when it carries the question.

    `日更` sits inside `日更能不能交给云端跑` without being what the question is about.
    """
    return len(a) >= 4 or len(a) * 2 >= len(q)


def alias_score(query: str, alias: str) -> int:
    q = normalize(query)
    a = normalize(alias)
    if not q or not a:
        return 0
    if a == q:
        return 1000 + len(a)
    if a in q:
        # below LOCK_BAND: still ranks the suggestion, never claims the page
        return 500 + len(a) if carries(a, q) else 60 + len(a)
    if q in a and stands_in_for(q, a):
        return 100 + len(q)
    return 0


HINT_FUNCTION = set("的了我你他她它吗呢吧啊么什怎样哪是有在要不能会该这那个")

```

</details>

**依据 4 · 源码核查**：[skill/krouter-obsidian/scripts/route_knowledge.py:76-93](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/route_knowledge.py#L76-L93)

来源/map SHA收据。

<details>
<summary>查看原文（18行）</summary>

```text
def emit_receipt(source: Path, retrieval_status: str, route: str, query: str, vault: Path, map_path: Path) -> None:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    print("receipt_version: knowledge-route-v2")
    print(f"observed_at: {now}")
    print(f"requested_route: {route}")
    print(f"query: {query}")
    print(f"retrieval_status: {retrieval_status}")
    print(f"source: {source}")
    if source.is_file():
        meta = parse_frontmatter(source)
        if meta.get("status"):
            print(f"source_status: {meta['status']}")
        if meta.get("verified_at"):
            print(f"source_verified_at: {meta['verified_at']}")
        print(f"source_sha256: {sha256_file(source)}")
    if map_path.is_file():
        print(f"canonical_map: {map_path}")
        print(f"canonical_map_sha256: {sha256_file(map_path)}")
```

</details>

**依据 5 · 源码核查**：[skill/krouter-obsidian/scripts/route_knowledge.py:343-379](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/route_knowledge.py#L343-L379)

ranked、扩域、拒绝及字面回退。

<details>
<summary>查看原文（37行）</summary>

```text
def bounded_search(scope: Path, vault: Path, map_path: Path, route: str, query: str) -> None:
    res = None
    try:
        from recall_index import recall

        rel = "" if scope == vault else scope.relative_to(vault).as_posix()
        res = recall(vault, query, rel, limit=3)
    except Exception:  # 召回缓存不可用时退回字面检索
        res = None
    widened = False
    if (res is None or not res["hits"] or res.get("confidence") == "none") and scope != vault:
        # 路由范围（单个偏好/纠错页、01 项目）里没有答案：扩到全库，规则页优先，并如实标出
        try:
            wide = recall(vault, query, "", limit=3)
            if wide["hits"] and wide.get("confidence") != "none":
                res, widened = wide, True
        except Exception:
            pass
    if res and res["hits"] and res.get("confidence") != "none":
        emit_receipt(scope, "ranked-recall-complete", route, query, vault, map_path)
        log_query(route, query, "ranked-recall-complete" + ("+widened" if widened else ""), res["hits"][0]["rel"], res.get("confidence", ""))
        emit_suggestions(query, vault, map_path)
        print(f"route: {route}")
        print(f"scope: {scope}")
        if widened:
            print("scope_widened: vault (the route scope had no page covering this question)")
        print_recall(res, vault, 4 if (scope.is_file() and not widened) else 1)
        print("open_page: only the top recall hit, and only if its how does not close the question")
        return
    emit_receipt(scope, "bounded-literal-search-complete", route, query, vault, map_path)
    log_query(route, query, "bounded-literal-search-complete")
    emit_suggestions(query, vault, map_path)
    print(f"route: {route}")
    print(f"scope: {scope}")
    if res is not None:
        print("recall: none (no page covers enough of the question; do not guess)")
    md_search(query, scope)
```

</details>

**依据 6 · 源码核查**：[skill/krouter-obsidian/scripts/route_knowledge.py:221-234](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/route_knowledge.py#L221-L234)

查询JSONL写本机。

<details>
<summary>查看原文（14行）</summary>

```text
def log_query(route: str, query: str, status: str, top: str = "", confidence: str = "") -> None:
    """One JSONL line per routed query, outside the vault. Feeds nightly trigger learning. Never fails the route."""
    if not query or os.environ.get("KROUTER_NO_QUERY_LOG") == "1":
        return
    try:
        import json

        base = Path(os.environ.get("KROUTER_STATE_DIR") or Path.home() / ".local" / "state" / "krouter")
        base.mkdir(parents=True, exist_ok=True)
        row = {"ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "route": route, "q": redact(query),
               "status": status, "top": top, "confidence": confidence}
        with (base / "queries.jsonl").open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(row, ensure_ascii=False) + "\n")
    except OSError:
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 纠错与作者对照支持什么结论？

**研究主题：**缺陷与关键质疑

#### 完整回答

canonical路由依据页面frontmatter有效状态过滤旧页；ranked recall却仅将superseded等标为dead、权重乘0.25，仍保留候选，print_recall也可输出其status/how/正文。所以作者“排除替代页”的简述不能泛化到所有查询路径。缓存按mtime_ns/size和alias map hash更新，问答卡还绑定页hash并核对文本。这样比无条件把所有历史文本混在一起更能表达“已改变决定”，但正确性依作者或写手把状态标对、有效期正确、当前答案仍有足够内容；没有自动验证事实。

刷新先遍历vault构seen，known里不再seen的页删除索引；mtime和size未变直接跳过，不用源内容hash判断所有页，所以保留元数据的编辑可能漏更新。walk_md followlinks=True，没有在该函数检查真实路径仍在vault或符号链接环；不应把给定vault目录当物理读取沙箱。同步spawnSync还阻塞DSH事件循环直到路由结束/20秒，timeout不等于整个后代树已取消。

作者公布200个synthetic held-out问句、双语和110页库，也明确问题由模型生成、不是人写，真实新流量盲测未做；与同样排除替代页/设拒答底线的BM25不显著领先。对比默认竞品可说明默认策略差异，不能证明ranker普遍胜出或真实工作流收益。本轮只检查代码/方法文档，不重跑实验，不把作者26%错误引用率外推当前用户，也不能把“拒绝猜测”读成零错误。

#### 证据与依据

**依据 1 · 源码核查**：[skill/krouter-obsidian/scripts/recall_index.py:248-291](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/recall_index.py#L248-L291)

mtime/size、map失效与卡片hash。

<details>
<summary>查看原文（44行）</summary>

```text
def refresh(vault: Path, con: sqlite3.Connection) -> dict[str, int]:
    seen: dict[str, tuple[int, int, Path]] = {}
    for full, rel in walk_md(vault):
        try:
            st = os.stat(full)
        except OSError:
            continue
        seen[rel] = (st.st_mtime_ns, st.st_size, full)
    known = {rel: (m, s, rid) for rel, m, s, rid in con.execute("SELECT rel, mtime_ns, size, rid FROM files")}
    aliases, map_sha = alias_map(vault)
    cards = card_triggers(vault)
    old_sha = (con.execute("SELECT v FROM meta WHERE k='map_sha'").fetchone() or [""])[0]
    if map_sha != old_sha:
        # 别名或触发词变了：全部重建（一次约 1–2 秒），避免被删掉的触发词残留
        known = {rel: (-1, s, rid) for rel, (_m, s, rid) in known.items()}
        con.execute("INSERT OR REPLACE INTO meta VALUES('map_sha', ?)", (map_sha,))
    changed = added = removed = 0
    for rel, (_m, _s, rid) in known.items():
        if rel not in seen:
            con.execute("DELETE FROM docs WHERE rowid=?", (rid,))
            con.execute("DELETE FROM files WHERE rel=?", (rel,))
            removed += 1
    for rel, (mtime, size, path) in seen.items():
        old = known.get(rel)
        if old and old[0] == mtime and old[1] == size:
            continue
        path = Path(path)
        try:
            raw_bytes = path.read_bytes()
        except OSError:
            continue
        # 索引、how、问答卡核对用的都是脱敏后的文字：密钥值不进缓存，也不会从这里被打印或外发
        text = redact(raw_bytes.decode("utf-8", errors="replace"))
        meta, body = split_frontmatter(text)
        page_hash = card_hashes(raw_bytes)
        title = meta.get("title") or path.stem
        status = (meta.get("status") or "").lower()
        # 卡片问题只在卡片还对得上这一页当前内容、且核对得过时才算触发词：页面一改旧卡不再影响排序，
        # 答案对不上原文或问题跟这页无关的卡也不能把这页顶上来
        mine = [c for c in cards.get(rel, []) if c.get("sha") in page_hash]
        terms = set(tokens(text)) if mine else set()
        live_cards = [c["q"] for c in mine if grounded(c, text, terms)]
        trig = " ".join([meta.get("triggers") or meta.get("aliases") or ""] + aliases.get(rel, []) + live_cards)
        secret = is_secret_page(zones.canon(vault, rel), meta)
```

</details>

**依据 2 · 源码核查**：[skill/krouter-obsidian/scripts/recall_index.py:205-216](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/recall_index.py#L205-L216)

followlinks=True无物理范围/环检查。

<details>
<summary>查看原文（12行）</summary>

```text
def walk_md(vault: Path):
    """(absolute path, vault-relative posix path) as plain strings: no per-file pathlib work."""
    base = str(vault).rstrip("/")
    cut = len(base) + 1
    for root, dirs, files in os.walk(base, followlinks=True):
        dirs[:] = [d for d in dirs if d not in SKIP_PARTS and not d.startswith(".")]
        # 库内相对路径一律用 `/`：Windows 上 os.walk 给的是 `\`，分级、区名映射、卡片、别名表都按 `/` 比对
        reldir = root[cut:].replace(os.sep, "/")
        for name in files:
            if name.endswith(".md"):
                yield f"{root}/{name}", (f"{reldir}/{name}" if reldir else name)

```

</details>

**依据 3 · 源码核查**：[skill/krouter-obsidian/scripts/recall_index.py:386-413](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/recall_index.py#L386-L413)

阈值与coverage启发。

<details>
<summary>查看原文（28行）</summary>

```text
    top = hits[0]["score"]
    second = hits[1]["score"] if len(hits) > 1 else 0.0
    margin = top / second if second else 9.9
    # bm25 的量级随库大小变化：小库按文档数等比缩放下限，千篇以上用满额
    scale = min(1.0, n_docs / 1000)
    # 关键词式查询（`DSH`、`SyGJ`）本身只有一个实词，命中它就够；整句问题仍要求至少两个实词
    need = min(MIN_STRONG_MATCH, query_content_terms(raw, df, titled))
    # 问题的核心词库里一次都没出现（`Kubernetes`），只靠一两个边角词凑上的，判为库外
    unknown = unknown_content_terms(raw, df)
    # 问题里有库里一次都没出现过的汉字（`咖啡`、`除垢`），而首条只对上一个实词：问的是库外的事，
    # 只是借了库里的一个词（`定时`）。字比词稳：换个说法会产生库里没有的双字，但不会凭空多出库里没有的字
    alien = alien_chars(raw, df)
    # 问题里的真词有两个以上整库都没有，而且比首条页对上的真词还多：问的主要是库外的事（`纠错之后的房贷利率`）
    absent_words, top_words = outside_words(con, hits[0]["rid"], raw, df)
    off_vault = absent_words >= 2 and absent_words > top_words
    unnamed = absent_names(query, df)
    if single:
        # 一个概念的短查询：只有一个词可比，不按"至少两个实词"拦；但仍要过（减半的）分数下限
        refuse = top < SCORE_MIN * scale * 0.5 or (unknown and strong == 0) or bool(unnamed)
    else:
        refuse = (top < SCORE_MIN * scale or (strong < need and top < SINGLE_TERM_SCORE * scale) or strong == 0
                  or (unknown and strong <= 2) or (strong < need and alien >= ALIEN_MIN) or off_vault or bool(unnamed))
    partial = not single and strong < need
    if gate and refuse:
        conf = "none"
    elif partial:
        conf = "low"
    elif margin >= 1.5 and hits[0]["tier"] in ("rule", "topic"):
```

</details>

**依据 4 · 源码核查**：[skill/krouter-obsidian/scripts/recall_index.py:191-203](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/recall_index.py#L191-L203)

旧状态为dead，而非移除。

<details>
<summary>查看原文（13行）</summary>

```text
def tier_of(rel: str, status: str) -> str:
    if status in DEAD_STATUS or status == "generated":
        return "dead"
    if rel.startswith(TOPIC_PREFIX):
        return "topic"
    if rel in RULE_FILES or rel.startswith(RULE_PREFIXES) or ("协作/" in rel and rel.startswith("90 系统文件/")):
        return "rule"
    if rel.startswith("05 时间日志/"):
        return "log"
    if rel.startswith("01 项目/") or rel.startswith("04 已完成与复盘/"):
        return "project"
    return "other"

```

</details>

**依据 5 · 源码核查**：[skill/krouter-obsidian/scripts/recall_index.py:320-320](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/recall_index.py#L320-L320)

dead仍有0.25非零权重。

```text
TIER_BOOST = {"rule": 1.6, "topic": 1.4, "project": 1.0, "other": 0.9, "log": 0.8, "dead": 0.25}
```

**依据 6 · 源码核查**：[skill/krouter-obsidian/scripts/route_knowledge.py:323-341](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/route_knowledge.py#L323-L341)

ranked输出所有hit并带状态/正文。

<details>
<summary>查看原文（19行）</summary>

```text
def print_recall(res: dict, vault: Path, lines: int) -> None:
    from recall_index import PARTIAL_NOTE, best_lines

    print(f"recall_confidence: {res.get('confidence', 'none')}")
    print(f"recall_margin: {res.get('margin', 0)}")
    print(f"recall_strong_terms: {res.get('strong', 0)}")
    if res.get("partial"):
        print(PARTIAL_NOTE)
    print("recall:")
    for h in res["hits"]:
        flag = f" status={h['status']}" if h["status"] else ""
        print(f"- {h['rel']} tier={h['tier']}{flag} score={h['score']}")
        if h.get("answer"):
            print(f"  answer (generated): {redact(h['answer'])}")
        if h["how"]:
            print(f"  how: {h['how']}")
        for ln, text in best_lines(vault / h["rel"], res["query_tokens"], lines):
            print(f"  L{ln}: {text}")

```

</details>

**依据 7 · 作者声明**：[docs/BENCHMARK.md:4-16](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/docs/BENCHMARK.md#L4-L16)

作者说明synthetic、模型题、真实盲测未做及匹配基线。

<details>
<summary>查看原文（13行）</summary>

```text
> **Current status of `main` (latest release v1.2.1, 2026-10-20). Measured, and what is not.** One-line installs get
> the latest release; anything under "Unreleased" in CHANGELOG.md is on `main` only. Every fact an evaluating agent
> needs, with sources: [`docs/FOR-AGENTS.md`](https://github.com/398894496-arch/KRouter/blob/main/docs/FOR-AGENTS.md).
> - **Held-out bench** (200 questions on a synthetic 110-page vault, never tuned on; *not* real traffic): KRouter 26%
>   wrong citations, 47 of 80 unanswerable questions refused, 102 of 120 answerable right. At their defaults claude-mem
>   64% and basic-memory 78%, 72 and 45 right; neither can refuse. BM25 given KRouter's two rules (skip replaced
>   pages, refuse a weak match) is level with KRouter: the lead is those rules being on by default, not the ranker.
> - **Real-traffic blind test on fresh queries** ([VERIFY.md](https://github.com/398894496-arch/KRouter/blob/main/docs/VERIFY.md)
>   layer 4): not run yet; it waits for 50 new queries.
> - **Who wrote the held-out questions:** Claude Opus in separate claude.ai sessions, not a person. A person-written
>   set is planned.
> - **Releases:** 1.2.0 (2026-10-19) came ahead of the planned 2026-11-12, at the maintainer's call. From here, minor
>   releases at most once a week and patches when ready; `KROUTER_TAG` pins one.
```

</details>

**依据 8 · 源码核查**：[extras/dsh/lib/route.js:95-111](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/extras/dsh/lib/route.js#L95-L111)

同步外部执行及20秒默认。

<details>
<summary>查看原文（17行）</summary>

```text
        encoding: "utf8",
        timeout: timeoutMs,
        cwd: dirname(script),
        env: { ...process.env, OBSIDIAN_VAULT: vaultRoot },
      })
    : spawnSync(script, args, {
        encoding: "utf8",
        timeout: timeoutMs,
        env: { ...process.env, OBSIDIAN_VAULT: vaultRoot },
      });
  return {
    ok: result.status === 0,
    code: result.status ?? 1,
    stdout: result.stdout || "",
    stderr: result.stderr || (result.error ? String(result.error) : ""),
  };
}
```

</details>

#### 缺口

- 符号链接、保留mtime/size编辑、不同库语言和新任务错误引用未独立验证。
  **影响：**不能给物理路径保密、新鲜度或真实任务收益保证。
  **进一步探讨：**固定可丢弃vault加外部链接/元数据保留改稿及人写问题，比较引用、拒答与覆盖。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可选写手与导入的安全边界是什么？

**研究主题：**工程质量与复用

#### 完整回答

夜间run.sh先执行writer，再按配置nightly步骤，dry-run走offline状态和各步发送量估计。DSH工具与nightly分开，插件卸载不自动删除vault，也不能据此认为外部系统timer已停止。导入、写手和备份要按实际安装路径判断，不能从包里存在代码推断用户已经授权或启用。

llm gate将Codex视可读整个账户的lane，只有点名或KROUTER_ALLOW_CODEX允许；其它不能约束CLI需ALLOW_UNCONFINED。writer_invoke为grok配置沙箱、Claude设dontAsk和带vault路径的工具白名单，Codex workspace-write+cwd vault。API文本lane不启本地Agent，但仍会把选定文本发模型。这里是程序参数/门控检查，不是本轮对第三方CLI强制约束的验收。

脱敏过滤已知key形态、label、URL/连接口令和secret页，不能覆盖任意无标识秘密或Agent自主读取。README/SECURITY也明确文本过滤不能管CLI自身读取；vault含不可信网页/聊天时，工具白名单与kernel沙箱不是同一种强度。备份/封账/修订链可提高恢复可读性，但对整个夜间写手和备份加密未做完整审计，不把作者“自动零维护”当无需审核。

#### 证据与依据

**依据 1 · 源码核查**：[extras/host-daily-evolution/run.sh:21-43](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/extras/host-daily-evolution/run.sh#L21-L43)

dry-run与writer/nightly编排。

<details>
<summary>查看原文（23行）</summary>

```text
if [ "${1:-}" = "--dry-run" ]; then
  # 什么都不调、不写：写手走哪条通道，夜间各步会发什么、估算多少 token、会写哪些文件
  python3 "$RESOLVE" --status --offline
  SK=$(dirname "$KROUTER_ROUTER")
  [ -f "$SK/nightly.py" ] || SK="$ROOT/skill/krouter-obsidian/scripts"
  [ -f "$SK/nightly.py" ] && python3 "$SK/nightly.py" --vault "$OBSIDIAN_VAULT" --dry-run
  exit 0
fi

rc=0
python3 "$RESOLVE" --exec || rc=$?

# Nightly upkeep after the seal. Runs with the job; KROUTER_NIGHTLY=0 turns it off.
# nightly.py runs the five steps (each independent; none changes the seal's exit code) and writes each
# one's outcome to 90 系统文件/自动化/夜间维护.md and the health page, where `status` reads it.
# Model steps use the writer's lane: *_API_KEY first, then the CLI the writer would pick.
if [ "${KROUTER_NIGHTLY:-1}" != 0 ]; then
  SK=$(dirname "$KROUTER_ROUTER")
  [ -f "$SK/nightly.py" ] || SK="$ROOT/skill/krouter-obsidian/scripts"
  python3 "$SK/nightly.py" --vault "$OBSIDIAN_VAULT" >&2 || printf '%s\n' "KRouter: nightly runner failed (rc=$?)" >&2
fi

exit "$rc"
```

</details>

**依据 2 · 源码核查**：[skill/krouter-obsidian/scripts/llm.py:210-244](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/llm.py#L210-L244)

Codex/未约束CLI opt-in gate。

<details>
<summary>查看原文（35行）</summary>

```text
CONFINED_KINDS = frozenset({"grok", "codex", "claude"})  # KRouter 能给这三家加约束：沙箱、只写库、工具白名单
UNCONFINED_FLAG = "KROUTER_ALLOW_UNCONFINED"


ACCOUNT_READ_KINDS = frozenset({"codex"})  # 只写库，但读得到整个账号（含 key 文件）：宿主点名才用
CODEX_FLAG = "KROUTER_ALLOW_CODEX"


def _flag(name: str) -> bool:
    if os.environ.get(name, "").strip() == "1":
        return True
    path = keys_file()
    if path.is_file():
        return _parse(path.read_text(encoding="utf-8", errors="replace")).get(name, "").strip() == "1"
    return False


def allow_unconfined() -> bool:
    """The host's explicit yes to a CLI KRouter cannot confine: `KROUTER_ALLOW_UNCONFINED=1`, env or keys file."""
    return _flag(UNCONFINED_FLAG)


def allow_codex() -> bool:
    """The host's explicit yes to Codex, which can read the whole account: `KROUTER_ALLOW_CODEX=1`, env or keys file."""
    return _flag(CODEX_FLAG)


def gate(result: str, named: bool = False) -> str:
    """A logged-in CLI outside CONFINED_KINDS counts only with the opt-in (`<kind>:unconfined`); Codex only when the
    host named it or opted in (`codex:reads-account`)."""
    if writer_ok(result) and writer_kind(result) not in CONFINED_KINDS and not allow_unconfined():
        return f"{writer_kind(result)}:unconfined"
    if writer_ok(result) and writer_kind(result) in ACCOUNT_READ_KINDS and not (named or allow_codex()):
        return f"{writer_kind(result)}:reads-account"
    return result
```

</details>

**依据 3 · 源码核查**：[extras/host-daily-evolution/resolve.py:368-427](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/extras/host-daily-evolution/resolve.py#L368-L427)

Claude allowlist/Codex workspace-write与不同lane。

<details>
<summary>查看原文（60行）</summary>

```text
    """Claude Code has no kernel sandbox here, so its tools are allow-listed instead: read and edit only inside
    the vault, run only the router, no other shell command, no web fetch; anything else is refused (`dontAsk`).

    Glob and Grep carry the vault path too. Up to 1.2.0 they were allowed bare, and a bare Grep prints matching lines
    from any file in the account (keys file included); measured with a canary file outside the vault."""
    v = str(vault).rstrip("/")
    r = str(router)
    return [f"Read(/{v}/**)", f"Edit(/{v}/**)", f"Glob(/{v}/**)", f"Grep(/{v}/**)", f"Bash(sh {r}:*)", f"Bash({r}:*)", f"Bash(bash {r}:*)",
            f"Bash(/bin/sh {r}:*)"]


def writer_invoke(writer: str, prompt: Path, vault: Path, router: Path | None = None) -> list[str]:
    """argv for the CLI writer. grok runs in a kernel sandbox; claude with an allow-list and no other shell;
    codex in its workspace-write sandbox (writes the vault only, can still read the account); other harnesses
    have no confinement KRouter can set, and the install prompt says so."""
    router = router or Path(os.environ.get("KROUTER_ROUTER") or timer_router())
    kind, _ = writer_probe_argv(writer)
    vault_s = str(vault)
    prompt_s = str(prompt)
    flagship = os.environ.get("KROUTER_DISTILL_MODEL", "").strip() or CLI_FLAGSHIP.get(kind, "")
    if kind == "grok":
        argv = [writer]
        if flagship:
            argv.extend(["--model", flagship])
        argv.extend(
            [
                "--prompt-file",
                prompt_s,
                "--always-approve",
                "--permission-mode",
                "bypassPermissions",
                "--sandbox",
                GROK_PROFILE,
                "--max-turns",
                "32",
                "--no-alt-screen",
                "--cwd",
                vault_s,
            ]
        )
        return argv
    if kind == "codex":
        return [
            writer,
            "exec",
            "--skip-git-repo-check",
            "--sandbox",
            "workspace-write",
            "-C",
            vault_s,
            "--add-dir",
            vault_s,
            "-",
        ]
    if kind == "claude":
        argv = [writer, "--print", "--no-session-persistence", "--permission-mode", "dontAsk",
                "--tools", "Read,Edit,Write,Glob,Grep,Bash", "--add-dir", vault_s]
        if flagship:
            argv.extend(["--model", flagship])
        return argv + ["--allowedTools", *claude_allow(vault, router)]  # prompt on stdin
```

</details>

**依据 4 · 源码核查**：[skill/krouter-obsidian/scripts/krouter_redact.py:1-28](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/krouter_redact.py#L1-L28)

secret页和已知secret过滤启发。

<details>
<summary>查看原文（28行）</summary>

```text
#!/usr/bin/env python3
"""Secrets never leave the vault through KRouter: not to a model, not into an agent's context, not into the cache.

Two layers.

By page: a secret page is never sent to a model and never quoted (only its path is shown). A page is secret when
its frontmatter says `secret: true`, when it is the key page (`90 系统文件/自动化/自进化钥匙.md`), or when its file
name or title says what it is (凭据 / 密钥 / 秘钥 / 钥匙 / 口令 / credential / secret / password / api key) — the
last needs no declaration, so a host who never configured anything is still covered.

By content, for everything else: every text KRouter prints, indexes, logs or sends goes through `redact()`, which
replaces with `<redacted>`
- values after key-like labels, in either language and any separator (`DEEPSEEK_API_KEY=…`, `Key: …`, `密钥：…`,
  `凭据 …`, `password = …`, `token: …`), including inside table cells;
- secret query parameters (`?key=…`, `&access_token=…`) and the password in a connection string (`user:…@host`);
- bearer tokens and well-known key shapes (`sk-…`, `ghp_…`, `AKIA…`, `AIza…`, `xox…`, `hf_…`, …);
- and, as the backstop, any unbroken run with a piece of ≥ 16 characters mixing letters and digits (keys without a
  known prefix: Mistral, Together, 智谱, Fireworks, Perplexity, NVIDIA, Cerebras …). Long hashes are masked too; that
  only affects what is printed or sent — source pages are never edited, and receipt SHAs are computed by KRouter.
Placeholders (`YOUR_…`, `CHANGE_ME`, `<…>`) and plain numbers stay readable so a page still explains itself.
"""

from __future__ import annotations

import re

SECRET_PAGES = ("90 系统文件/自动化/自进化钥匙.md",)
SECRET_NAME = re.compile(r"凭据|凭证|密钥|秘钥|私钥|钥匙|口令|credential|secret|password|passwd|api[ _-]?key", re.I)
```

</details>

**依据 5 · 作者声明**：[SECURITY.md:47-76](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/SECURITY.md#L47-L76)

作者区分lane权限及文本过滤已知限度。

<details>
<summary>查看原文（30行）</summary>

```text

**What the nightly writer can see.** It depends on the lane, and the install prompt says which one you are choosing:

| Lane | Runs on this machine | Can read | Can write |
|---|---|---|---|
| **API key (recommended)** | Nothing: a direct API call | — (KRouter sends only what `--dry-run` lists) | — |
| `grok` | grok, in a kernel-enforced sandbox profile (`strict` + the router) | The vault, the router, system paths | The vault, KRouter's cache and state |
| `claude` | Claude Code, with tools allow-listed (`dontAsk`): read / edit / glob / grep inside the vault, run the router, nothing else | The vault (tool-level rule, no kernel sandbox). Up to 1.2.0 Glob and Grep were allowed without a path, and Grep could print lines from any file in the account, keys file included | The vault |
| Codex | Codex in its `workspace-write` sandbox. **Not picked on its own**: only when you name it (`KROUTER_WRITER`, `KROUTER_LEARN_CLI`) or set `KROUTER_ALLOW_CODEX=1` | **Your whole account**, keys file included | The vault |
| Others (opencode, kimi, pi, vibe, antigravity, cursor-agent) | The CLI with no confinement KRouter can set. **Never picked on its own**: only with `KROUTER_ALLOW_UNCONFINED=1` in the environment or the keys file | **Your whole account** | **Your whole account** |

The vault is where untrusted text arrives (clipped web pages, pasted chats), so a writer that can do more than
read and write the vault is one prompt injection away from acting as you. Prefer the API-key lane; if you use a CLI,
prefer grok or claude. A logged-in CLI KRouter cannot confine is skipped (a confined one further down the list is
used instead) and reported as `<kind>:unconfined` until you opt in; Codex the same way, as `codex:reads-account`. Before 0.12.0 the claude and grok writers ran with permission prompts skipped and no
sandbox — able to read and write anything in the account; an outside review pointed this out and a test confirmed
it (grok read a file outside the vault through both its file tool and its shell; under the new profile it cannot).

Text filters (`krouter_redact.py`) protect what KRouter itself prints and sends; they cannot filter what an agent
reads on its own — that is what the sandbox and the allow-list are for.

**Known limits of the text filter.** An unlabeled key that is pure hexadecimal is not masked (that is how notes record
commits and digests), nor a key split into short hyphenated groups. Put keys in `~/.dsh-krouter-keys.env`, or keep them
on a page whose name says what it is.

**Long-lived CLI token.** For the claude lane, `claude setup-token` issues a token for unattended use; put it in
`~/.dsh-krouter-keys.env` as `CLAUDE_CODE_OAUTH_TOKEN=…` (the file is mode 600, never in the vault). KRouter passes it
only to the `claude` process. It avoids the logout that happens when another program (a proxy, another machine) holds
the same keychain login and spends its single-use refresh token.

```

</details>

#### 缺口

- 固定版本第三方CLI工具白名单/沙箱实际执行与所有夜间写入范围未核查。
  **影响：**代码参数不等于已验证隔离，不能声称写手只能看到所列片段。
  **进一步探讨：**采用写手前可先读dry-run，分别用无敏感canary核对选定lane的读写边界和清理。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、维护和恢复依赖什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools、defineTool和schemastery | DSH接头必需 | 七工具注册与配置 | peer版本为*，兼容实际需核 |
| Node运行时 | 接头必需 | ESM和spawnSync | 包未声明最低版本，不硬填 |
| Python3及SQLite FTS5 | Python召回需要 | 本地FTS索引与状态路由 | 缺扩展会走错误/字面降级，非相同召回 |
| shell/路由脚本 | 非Windows优先路径 | bundled或installed router | 显式路径/env有执行权限影响 |
| vaultPath/环境与真实Markdown库 | 查询必需 | 每实例固定库目标 | 没有vault直接返回错误 |
| Obsidian | 可选 | 编辑/同步查看 | 不影响本地路由 |
| 模型key或明确CLI与timer | 可选夜间写手需要 | 导入蒸馏/整理 | DSH plugin add不安装timer |
| 独立备份位置/口令 | 可选备份需要 | 恢复vault历史 | 本轮未验证加密实现/恢复结果 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包/库，备份原件，先lookup-only | 不把空库当已有知识 |
| 接入 | 指定vaultPath与可信router，安装DSH接头 | 七工具返回ok/code和来源收据 |
| 查询 | 短词/问题核对canonical与recall状态 | none不猜，hint不当hit，打开原文 |
| 纠错 | 审核当前/替代状态与适用项目 | 旧页不再竞争，不靠同名文件夹当身份 |
| 写手 | 明确选择是否导入/timer/lane，先dry-run | 核数据外发与可读写范围 |
| 恢复 | 停timer后核原页/收据/备份，必要时重建缓存 | 不把接头卸载等于外部job停止 |

来源目录成员本轮unknown；README旧名是线索，不改固定身份。只检查源码，不运行任何router、安装、模型、job或宿主冒烟。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:3-32](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/package.json#L3-L32)

包入口/files与通配peer声明。

<details>
<summary>查看原文（30行）</summary>

```text
  "version": "1.2.1",
  "description": "Zero-maintenance second brain for coding agents: one-line install, a plain-Markdown vault (Obsidian optional) distilled every night, exact lock + ranked recall that refuses instead of guessing. Chinese and English; macOS, Linux, Windows. Cursor, Codex, Claude Code, DeepSeek Harness. No vector store.",
  "type": "module",
  "main": "extras/dsh/lib/index.js",
  "exports": {
    ".": "./extras/dsh/lib/index.js"
  },
  "files": [
    "extras/dsh/lib",
    "extras/dsh/cordis.patch.yml",
    "extras/dsh/README.md",
    "extras/host-daily-evolution",
    "skill/krouter-obsidian",
    "scripts",
    "template",
    "template-zh",
    "extras/cursor",
    "extras/codex",
    "extras/claude-code",
    "extras/hooks"
  ],
  "dsh": {
    "bundle": {
      "patch": "./extras/dsh/cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-tools": "*",
    "@deepseek-ai/schemastery": "*"
```

</details>

**依据 2 · 源码核查**：[extras/dsh/lib/index.js:48-60](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/extras/dsh/lib/index.js#L48-L60)

vault/router配置。

<details>
<summary>查看原文（13行）</summary>

```text
export const Config = z.object({
  vaultPath: z
    .string()
    .default("")
    .description("Absolute Obsidian vault path. Empty uses OBSIDIAN_VAULT."),
  routerScript: z
    .string()
    .default("")
    .description(
      "Absolute path to route_knowledge.sh. Empty uses KROUTER_ROUTER, then ~/.agents/skills/krouter-obsidian.",
    ),
});

```

</details>

**依据 3 · 源码核查**：[extras/dsh/lib/route.js:27-65](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/extras/dsh/lib/route.js#L27-L65)

平台优先和Python启动。

<details>
<summary>查看原文（39行）</summary>

```text
export function resolveRouter(explicit) {
  const bundled = resolve(
    HERE,
    "../../../skill/krouter-obsidian/scripts/route_knowledge.sh",
  );
  const bundledPy = resolve(
    HERE,
    "../../../skill/krouter-obsidian/scripts/route_knowledge.py",
  );
  const installed = join(
    homedir(),
    ".agents/skills/krouter-obsidian/scripts/route_knowledge.sh",
  );
  const installedPy = join(
    homedir(),
    ".agents/skills/krouter-obsidian/scripts/route_knowledge.py",
  );
  const preferPy = platform() === "win32";
  const candidates = (
    preferPy
      ? [explicit, process.env.KROUTER_ROUTER, bundledPy, installedPy, bundled, installed]
      : [explicit, process.env.KROUTER_ROUTER, bundled, installed, bundledPy, installedPy]
  ).filter(Boolean);
  for (const path of candidates) {
    if (isForeignLiveRouter(path)) continue;
    if (existsSync(path)) return path;
  }
  return null;
}

function pythonArgv(script, args) {
  const exe = process.env.PYTHON || process.env.KROUTER_PYTHON || "";
  if (exe) return [exe, [script, ...args]];
  if (platform() === "win32") return ["py", ["-3", script, ...args]];
  return ["python3", [script, ...args]];
}

export function resolveVault(explicit) {
  return explicit || process.env.OBSIDIAN_VAULT || process.env.KROUTER_VAULT || "";
```

</details>

**依据 4 · 源码核查**：[extras/dsh/README.md:3-7](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/extras/dsh/README.md#L3-L7)

插件不启timer且不删笔记。

```text
This directory is the **DeepSeek Harness socket** of KRouter, not a second product.

The product is the repo root: router (`skill/krouter-obsidian`) + writer (`extras/host-daily-evolution`) + this socket. One vault. `dsh plugin add` does not start the timer.

Uninstalling the socket does not delete notes.
```

**依据 5 · 源码核查**：[skill/krouter-obsidian/scripts/recall_index.py:223-233](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/recall_index.py#L223-L233)

SQLite数据库与FTS表。

<details>
<summary>查看原文（11行）</summary>

```text
def connect(db: Path) -> sqlite3.Connection:
    db.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(db)
    con.execute("PRAGMA journal_mode=WAL")
    con.execute("CREATE TABLE IF NOT EXISTS meta(k TEXT PRIMARY KEY, v TEXT)")
    row = con.execute("SELECT v FROM meta WHERE k='schema'").fetchone()
    if not row or row[0] != SCHEMA_VERSION:
        con.executescript(
            """
            DROP TABLE IF EXISTS vcol; DROP TABLE IF EXISTS vinst; DROP TABLE IF EXISTS vrow; DROP TABLE IF EXISTS docs; DROP TABLE IF EXISTS files;
            CREATE VIRTUAL TABLE docs USING fts5(
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续和失败成本有哪些？

**研究主题：**效果与总成本

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 路由/SQLite索引、个人Markdown材料 | 填有效决定与纠错状态，核库路径 | 作者110ms等不是本轮测量 |
| 持续使用 | 本地扫描/FTS刷新、每次同步spawn、查询日志 | 维护当前事实、审核引用与alias | 无向量服务，不代表零维护 |
| 可选写手 | 模型token、CLI进程、导入与备份 | 选择授权范围、检查nightly报告 | 每lane/库规模不同，无本轮费用/RSS |
| 失败恢复 | 原文/历史、查询收据与重建cache | 查误拒/错误引用、过期状态、写手变更 | 收据hash可核版本，不等于自动回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 来源 | exact/recall收据、状态和SHA | 来源内容真实/当前任务适用 |
| 拒答 | 词面/coverage/库外词门槛 | 真用户错误引用与漏答平衡 |
| 纠错 | live页/替代状态参与路由 | 写手总能正确识别更改 |
| 跨Agent | 一个vault配多个socket | 多人隔离/所有客户端实际兼容 |

lookup本身没有模型调用，日志/缓存仍写本地；结果随后作为工具输出进入用户选定模型。作者held-out和真实开发集各有边界，匹配规则相同基线不显著落后。应把维护事实、拒答后人工查证、可选nightly消费与备份都计入，而非只算一次检索延迟。

#### 证据与依据

**依据 1 · 源码核查**：[extras/dsh/lib/route.js:95-111](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/extras/dsh/lib/route.js#L95-L111)

同步spawn局部成本。

<details>
<summary>查看原文（17行）</summary>

```text
        encoding: "utf8",
        timeout: timeoutMs,
        cwd: dirname(script),
        env: { ...process.env, OBSIDIAN_VAULT: vaultRoot },
      })
    : spawnSync(script, args, {
        encoding: "utf8",
        timeout: timeoutMs,
        env: { ...process.env, OBSIDIAN_VAULT: vaultRoot },
      });
  return {
    ok: result.status === 0,
    code: result.status ?? 1,
    stdout: result.stdout || "",
    stderr: result.stderr || (result.error ? String(result.error) : ""),
  };
}
```

</details>

**依据 2 · 源码核查**：[skill/krouter-obsidian/scripts/route_knowledge.py:221-234](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/route_knowledge.py#L221-L234)

本地query日志。

<details>
<summary>查看原文（14行）</summary>

```text
def log_query(route: str, query: str, status: str, top: str = "", confidence: str = "") -> None:
    """One JSONL line per routed query, outside the vault. Feeds nightly trigger learning. Never fails the route."""
    if not query or os.environ.get("KROUTER_NO_QUERY_LOG") == "1":
        return
    try:
        import json

        base = Path(os.environ.get("KROUTER_STATE_DIR") or Path.home() / ".local" / "state" / "krouter")
        base.mkdir(parents=True, exist_ok=True)
        row = {"ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"), "route": route, "q": redact(query),
               "status": status, "top": top, "confidence": confidence}
        with (base / "queries.jsonl").open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(row, ensure_ascii=False) + "\n")
    except OSError:
```

</details>

**依据 3 · 源码核查**：[skill/krouter-obsidian/scripts/recall_index.py:248-275](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/recall_index.py#L248-L275)

每次refresh扫描与元数据检查。

<details>
<summary>查看原文（28行）</summary>

```text
def refresh(vault: Path, con: sqlite3.Connection) -> dict[str, int]:
    seen: dict[str, tuple[int, int, Path]] = {}
    for full, rel in walk_md(vault):
        try:
            st = os.stat(full)
        except OSError:
            continue
        seen[rel] = (st.st_mtime_ns, st.st_size, full)
    known = {rel: (m, s, rid) for rel, m, s, rid in con.execute("SELECT rel, mtime_ns, size, rid FROM files")}
    aliases, map_sha = alias_map(vault)
    cards = card_triggers(vault)
    old_sha = (con.execute("SELECT v FROM meta WHERE k='map_sha'").fetchone() or [""])[0]
    if map_sha != old_sha:
        # 别名或触发词变了：全部重建（一次约 1–2 秒），避免被删掉的触发词残留
        known = {rel: (-1, s, rid) for rel, (_m, s, rid) in known.items()}
        con.execute("INSERT OR REPLACE INTO meta VALUES('map_sha', ?)", (map_sha,))
    changed = added = removed = 0
    for rel, (_m, _s, rid) in known.items():
        if rel not in seen:
            con.execute("DELETE FROM docs WHERE rowid=?", (rid,))
            con.execute("DELETE FROM files WHERE rel=?", (rel,))
            removed += 1
    for rel, (mtime, size, path) in seen.items():
        old = known.get(rel)
        if old and old[0] == mtime and old[1] == size:
            continue
        path = Path(path)
        try:
```

</details>

**依据 4 · 作者声明**：[docs/BENCHMARK.md:4-16](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/docs/BENCHMARK.md#L4-L16)

作者实验边界和匹配基线。

<details>
<summary>查看原文（13行）</summary>

```text
> **Current status of `main` (latest release v1.2.1, 2026-10-20). Measured, and what is not.** One-line installs get
> the latest release; anything under "Unreleased" in CHANGELOG.md is on `main` only. Every fact an evaluating agent
> needs, with sources: [`docs/FOR-AGENTS.md`](https://github.com/398894496-arch/KRouter/blob/main/docs/FOR-AGENTS.md).
> - **Held-out bench** (200 questions on a synthetic 110-page vault, never tuned on; *not* real traffic): KRouter 26%
>   wrong citations, 47 of 80 unanswerable questions refused, 102 of 120 answerable right. At their defaults claude-mem
>   64% and basic-memory 78%, 72 and 45 right; neither can refuse. BM25 given KRouter's two rules (skip replaced
>   pages, refuse a weak match) is level with KRouter: the lead is those rules being on by default, not the ranker.
> - **Real-traffic blind test on fresh queries** ([VERIFY.md](https://github.com/398894496-arch/KRouter/blob/main/docs/VERIFY.md)
>   layer 4): not run yet; it waits for 50 new queries.
> - **Who wrote the held-out questions:** Claude Opus in separate claude.ai sessions, not a person. A person-written
>   set is planned.
> - **Releases:** 1.2.0 (2026-10-19) came ahead of the planned 2026-11-12, at the maintainer's call. From here, minor
>   releases at most once a week and patches when ready; `KROUTER_TAG` pins one.
```

</details>

#### 缺口

- 没有本轮真实任务的错误引用/拒答覆盖、人工核查和资源/写手费用比较。
  **影响：**不能用作者延迟或synthetic数字给用户保证。
  **进一步探讨：**固定人写双语问题与真实变更序列，比较BM25同规则基线、任务答案质量和总人工/token。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 采用建议与未来假设如何证伪？

**研究主题：**采用判断、新假设与验证

#### 完整回答

可有条件试用lookup-only，适合明确需要跨Agent共享决定、愿意维护当前状态和打开原文的个人。默认弱匹配拒绝、有效状态/旧页降权和来源hash有实际参考价值；不要把canonical锁定当事实认证，尤其作者实验仍有错引且真正新流量结果未完成。nightly/导入/backup各自另评，不能从七只读工具的采用建议延伸成默认开启账户级Agent写手。

继续探讨可从人写问题、过期决定与无答案近邻集合开始，分别记录错引和拒答后人工耗时；再检查vault真实路径/符号链接及指定writer权限。目录unknown是本轮来源边界，不表明插件已不在生态。

未验证假设是对跨项目决定增加显式适用域/来源版本和证据级别，把词面lock、ranking与人工确认区分；当匹配强但适用域不符时给冲突收据而非直接锁定。相比只靠alias和状态，可能降低同名概念/跨项目错误，但增加标注与误拒。最小对照固定两个项目同名规则、后来纠错、无答案近邻与不同语言表达，比较错误引用、覆盖、任务质量及维护时间；若误拒/标注负担超过错引改善，则不支持。未实现，不计当前创新。

#### 证据与依据

**依据 1 · 源码核查**：[skill/krouter-obsidian/scripts/canonical_lookup.py:139-163](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/canonical_lookup.py#L139-L163)

词面包含锁定启发，不是适用域认证。

<details>
<summary>查看原文（25行）</summary>

```text
def carries(a: str, q: str) -> bool:
    """An alias inside a longer question locks only when it carries the question.

    `日更` sits inside `日更能不能交给云端跑` without being what the question is about.
    """
    return len(a) >= 4 or len(a) * 2 >= len(q)


def alias_score(query: str, alias: str) -> int:
    q = normalize(query)
    a = normalize(alias)
    if not q or not a:
        return 0
    if a == q:
        return 1000 + len(a)
    if a in q:
        # below LOCK_BAND: still ranks the suggestion, never claims the page
        return 500 + len(a) if carries(a, q) else 60 + len(a)
    if q in a and stands_in_for(q, a):
        return 100 + len(q)
    return 0


HINT_FUNCTION = set("的了我你他她它吗呢吧啊么什怎样哪是有在要不能会该这那个")

```

</details>

**依据 2 · 源码核查**：[skill/krouter-obsidian/scripts/route_knowledge.py:237-260](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/skill/krouter-obsidian/scripts/route_knowledge.py#L237-L260)

命中返回具体source与收据。

<details>
<summary>查看原文（24行）</summary>

```text
def canonical_lookup(query: str, vault: Path, map_path: Path, route: str) -> bool:
    if not query or not map_path.is_file():
        return False
    rows = load_rows(map_path)
    hit = lookup(query, rows, vault=vault)
    if hit is None:
        return False
    case_id, relative, anchor = hit
    source = vault / relative
    if not source.is_file():
        print(f"Canonical source missing: {source}", file=sys.stderr)
        return False
    emit_receipt(source, "canonical-match", route, query, vault, map_path)
    log_query(route, query, "canonical-match", relative, "lock")
    print("route: canonical")
    print(f"canonical_id: {case_id}")
    print(f"canonical_source: {source}")
    print("canonical_match: true")
    how, correction_first = how_for(vault, case_id, anchor)
    if correction_first:
        print("correction_first: yes")
    print(f"how: {how}")
    print("open_page: only if how does not close the question")
    return True
```

</details>

**依据 3 · 作者声明**：[docs/BENCHMARK.md:4-16](https://github.com/398894496-arch/KRouter/blob/e9346963eca848a5012406ea5cb2f0cacc55fbb6/docs/BENCHMARK.md#L4-L16)

作者仍有错误且真实盲测待做。

<details>
<summary>查看原文（13行）</summary>

```text
> **Current status of `main` (latest release v1.2.1, 2026-10-20). Measured, and what is not.** One-line installs get
> the latest release; anything under "Unreleased" in CHANGELOG.md is on `main` only. Every fact an evaluating agent
> needs, with sources: [`docs/FOR-AGENTS.md`](https://github.com/398894496-arch/KRouter/blob/main/docs/FOR-AGENTS.md).
> - **Held-out bench** (200 questions on a synthetic 110-page vault, never tuned on; *not* real traffic): KRouter 26%
>   wrong citations, 47 of 80 unanswerable questions refused, 102 of 120 answerable right. At their defaults claude-mem
>   64% and basic-memory 78%, 72 and 45 right; neither can refuse. BM25 given KRouter's two rules (skip replaced
>   pages, refuse a weak match) is level with KRouter: the lead is those rules being on by default, not the ranker.
> - **Real-traffic blind test on fresh queries** ([VERIFY.md](https://github.com/398894496-arch/KRouter/blob/main/docs/VERIFY.md)
>   layer 4): not run yet; it waits for 50 new queries.
> - **Who wrote the held-out questions:** Claude Opus in separate claude.ai sessions, not a person. A person-written
>   set is planned.
> - **Releases:** 1.2.0 (2026-10-19) came ahead of the planned 2026-11-12, at the maintainer's call. From here, minor
>   releases at most once a week and patches when ready; `KROUTER_TAG` pins one.
```

</details>

#### 缺口

- 适用域/证据级别锁定设计未实现或对照。
  **影响：**不提升当前canonical正确率或隔离保证。
  **进一步探讨：**以两个项目同名规则、纠错和双语近邻对照错引/覆盖/人工成本。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
