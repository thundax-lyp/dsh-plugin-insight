# SandBase Skills

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[cbab581](https://github.com/sandbaseai/sandbase-skills/tree/cbab58188611e626ccaf54ac346b437d12ea4729)

<!-- BEGIN META -->
[![GitHub ★ 206](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=206&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sandbaseai/sandbase-skills)
<!-- END META -->

> **功能**：提供可移植 Agent 工作流技能集合，含 DSH 目录挂载、单技能复制工具和多源研究证据账本样本。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 规范Skill源与多端包装分离，样本将有限检索、共同来源溯源与账本校验集成，便于复用研究流程。仅样本与分发机制已核查，不从245条声明推全库效果。

> **主要限制**：[Q03](#research-q03) validator只核声明与内部关系，不验证网页真实性、共同origin或引文支持；不同URL与自报独立数仍可语义失真。[Q02](#research-q02) force先删旧目录再复制，remove删全目录，不保证本地修改恢复。

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
  - [Q01 · 谁使用该集合，相对临时提示增加什么？](#detail-section-11)
  - [Q02 · DSH bundle与单Skill安装卸载怎样改文件？](#detail-section-12)
  - [Q03 · 多来源和离线validator能证明什么？](#detail-section-13)
  - [Q04 · 成本与采用怎样限定为具体工作流？](#detail-section-14)
  - [Q05 · 外部事实与内部账本脱节可怎样验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要复用研究工作流的Agent用户可按具体任务选择Skill；本次聚焦multi-source-search，不把目录数量当全部能力或质量证明。

临时研究提示和手工复制目录是直接替代；本包把方法、参考与一致性检查组织为可分发资源，不自带事实真实性裁判。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| DSH目录挂载 | 发现随包Skills | 依赖官方provider，保留默认roots |
| 单Skill复制/删除 | 项目级选择工作流 | force/remove会删目录，先备份 |
| 多源研究样本 | 有限检索、溯源和账本 | 依赖真实搜索/读页能力 |
| 离线账本validator | 核结构/引用/声明阈值 | 不访问网络，不证真与独立性 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 支持Skill的宿主/DSH provider | 必需 | 发现和执行工作流 | 包复制不证明加载 |
| 搜索与读页，至少两能力 | 样本完整标准必需 | 多能力研究与溯源 | 不能伪填provider，披露覆盖不足 |
| Python3.9+ | 离线validator必需 | 检查账本一致性 | 未校验不能称通过 |
| Node>=20 | 单Skill安装器声明 | 复制/删除目录 | 需预读并备份 |
| SandBase API/凭据 | 专门Skill按需 | 可选模型/数据能力 | 样本已有宿主搜索可不用，价格未查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 选题 | 预读一个Skill及资源，在测试项目备份 | 不先装全集合 |
| 研究 | 声明问题/预算，检索并回源 | 记录实际能力及缺口 |
| 账本 | 关联主张/原件/独立性与冲突 | 不以不同URL自动独立 |
| 核查 | 离线一致性后人工语义核对 | VALID不当事实真，缺口降低结论 |
| 退出 | 备份后移除测试目录 | 不依赖force恢复本地定制 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 下载/环境/可选API费用未知 | 预读、选Skill、工具与脚本核对 | 未装/未运行 |
| 持续 | 模型/搜索/可选provider未知 | 原页、origin和冲突检查 | 预算上限不是实际节费 |
| 失败恢复 | 补查或重做资源未知 | 修账本/补证/从备份恢复目录 | force先删不保证恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工作流复用 | 提示、参考与完整目录包装 | 全245项质量/适用性 |
| 账本一致性 | URL/ID/引用/声明阈值检查 | 来源真、独立和引文支持 |
| 检索预算 | 默认有限调用与停止规则 | 实际遵循/节时效果 |
| 真实研究质量 | 有方法约束 | 无同任务准确率/总成本结果 |

> **思考**：[Q03](#research-q03) validator只核声明与内部关系，不验证网页真实性、共同origin或引文支持；不同URL与自报独立数仍可语义失真。[Q02](#research-q02) force先删旧目录再复制，remove删全目录，不保证本地修改恢复。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 规范Skill源与多端包装分离，样本将有限检索、共同来源溯源与账本校验集成，便于复用研究流程。仅样本与分发机制已核查，不从245条声明推全库效果。

[Q02](#research-q02)、[Q03](#research-q03) 源与包装分离、保留默认roots及离线约束可借鉴；脚本边界明确不认证真相。复制替换缺暂存/备份，迁移本地定制需额外保护；Python与大量提示不纳JS/TS原创工作量。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) validator只核声明与内部关系，不验证网页真实性、共同origin或引文支持；不同URL与自报独立数仍可语义失真。[Q02](#research-q02) force先删旧目录再复制，remove删全目录，不保证本地修改恢复。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 可在测试项目只取multi-source-search，预读资源并对一个不敏感主张试用；用真实能力名，不为通过伪造第二来源。原页、独立性或支持关系不明时降低结论并回人工核对，force/remove前备份完整目录。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查DSH/单Skill分发和multi-source-search及离线validator；未审全集合、未运行真实检索或脚本。语义抽样核查是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh/cordis.patch.yml、lib/dsh-installer.mjs、bin/sandbase-dsh-skills.mjs、research/multi-source-search/SKILL.md、research/multi-source-search/scripts/validate_report.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根分发/DSH patch/安装器，具体研究样本multi-source-search与validator；未逐项审全Skill和可选SandBase API，未执行安装/检索/校验。
- 下一步：按 [Q05](#research-q05) 比较共同稿源、过时和相反引文案例的语义误判与新增复核成本，实验材料不导入真实研究。

**分析版本**

- **仓库**：[sandbaseai/sandbase-skills](https://github.com/sandbaseai/sandbase-skills)
- **版本号**：0.3.5（[固定提交 cbab581](https://github.com/sandbaseai/sandbase-skills/tree/cbab58188611e626ccaf54ac346b437d12ea4729)）
- **版本日期**：2026-09-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是对账本抽样做独立语义回源，记录引用支持和origin错误，比较现有流程的漏判与新增成本；已有溯源提示不能重复算新贡献。

按 [Q05](#research-q05) 比较共同稿源、过时和相反引文案例的语义误判与新增复核成本，实验材料不导入真实研究。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 521 | 21518 | — | — | 181088 |
| .mjs | source | 5 | 276 | 241 | 5 | — |
| .md | example | 3 | 525 | — | — | 2073 |
| .mjs | test | 3 | 97 | 86 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/sandbaseai/sandbase-skills/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Skill集合和DSH包装如何支持可核查研究，离线账本校验实际证明什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用该集合，相对临时提示增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

集合面向希望复用工作流的Agent用户，README声明245个可安装Skill，根包提供DSH原生配置bundle与单Skill复制工具。数量是作者目录规模，不是245项质量或效果已验。本次以multi-source-search作为具体研究样本，考察证据多样性、有限检索预算和JSON账本，不将样本判断外推所有营销/媒体/数据Skill。

对照临时写一段搜索提示，样本增量是把来源溯源、重复来源去重、声明独立数与置信度限制、输出账本及离线检查打包成可携带资料。它依赖宿主模型和搜索能力执行，不自带可靠性裁判或搜索引擎。合格结果是每条重要判断有可追溯原件、相互独立的来源和冲突说明，报告结构通过只是辅助。没有真实研究任务对照，不能承诺更准确或更节省。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-33](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/README.md#L17-L33)

作者目录规模与Skill/服务分工。

<details>
<summary>查看原文（17行）</summary>

```text
**245 installable Agent Skills** for research, social intelligence, marketing, media generation, software engineering, data science, and business workflows. Install into any compatible agent (DeepSeek Harness, Claude Code, Codex, Cursor, Gemini CLI) and start working immediately. The flagship research Skill works with host-provided search tools; connect SandBase when you want broader provider coverage.

SandBase also exposes [2,000+ models and APIs](https://www.sandbase.ai/docs/store/),
including a unified surface for [LLM, image, and video generation](https://blog.sandbase.ai/unified-ai-api-llm-image-video-2026/).
Skills define the workflow; the SandBase API or MCP bridge supplies optional model,
media, search, social, and data capabilities when a workflow needs them.

Start with `multi-source-search`: it runs with your agent's existing search tools,
ships a worked evidence-ledger example, and includes an offline validator. If it
improves a real workflow, [star the repository](https://github.com/sandbaseai/sandbase-skills)
so other builders can discover it.

![Multi-source search workflow: search capabilities, source-origin tracing, evidence ledger, and offline validation](assets/multi-source-search-workflow.svg)

## What are Skills?

A Skill is an instruction file that teaches an AI agent how to do one specific job. Each Skill defines a repeatable workflow, evidence rules, and output format. Portable Skills can use capabilities already provided by the host agent; specialized social, market, and data workflows can add SandBase providers when configured.
```

</details>

**依据 2 · 源码核查**：[research/multi-source-search/SKILL.md:32-63](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/research/multi-source-search/SKILL.md#L32-L63)

已有能力优先、来源规则和预算停止条件。

<details>
<summary>查看原文（32行）</summary>

```text
## Select available search capabilities

Start with the host agent's native web search, page-open, browser, or academic-search
tools. Do not stop merely because SandBase is unavailable. Record the actual capability
names in the report's `providers` field and disclose missing coverage.

If `sandbase_discover`, `sandbase_inspect`, and `sandbase_run` are available, use them
for additional provider diversity. Use the capability identifiers below as discovery hints, not MCP tool names. Find the matching endpoint with `sandbase_discover(q: "<provider and capability>")`; use its returned `name` in `sandbase_inspect(name: "<returned name>")`. Read `inputSchema`, pricing, and `execute_as`, then call `sandbase_run` using `execute_as.arguments.name` and schema-defined `arguments`. If a `run_id` is returned, poll `sandbase_run_get(run_id: "<returned run_id>")` within the task budget until `completed` or `failed`; report pending or failed runs without resubmitting them automatically.

## Operating principles

- Use multiple sources to validate claims — single-source findings are hypotheses.
- Score confidence based on source agreement: 3+ sources = high, 2 = medium, 1 = low.
- Each source has strengths: Exa for semantic relevance, Tavily for recency, Scholar for academic rigor, Cloudsway for broad coverage.
- Cite which source(s) back each finding.
- Trace derivative articles to their common origin so circular reporting counts once.
- Never send private, proprietary, or personal content to a provider without explicit consent.

## Workflow

### 0. Set a search budget and stop condition

Before the first query, state the claim or decision being researched and set a finite
budget. Unless the user asks for exhaustive research, use at most six search calls and
six page opens. Stop early when every material claim has enough independent sources for
its declared confidence and another query is unlikely to add a new publisher, source
type, or contradiction.

Never repeat the same query after it returns no new evidence. Change the hypothesis,
source type, date window, or domain constraint; otherwise stop and report the gap. If
the budget is exhausted, return the best supported result with lower confidence instead
of continuing a tool loop.
```

</details>

**依据 3 · 源码核查**：[research/multi-source-search/SKILL.md:84-102](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/research/multi-source-search/SKILL.md#L84-L102)

账本与内部一致性边界。

<details>
<summary>查看原文（19行）</summary>

````text
### 4. Validate the evidence ledger

Read [the report schema](references/report-schema.md), save the result as JSON, and validate it before presenting the synthesis:

```bash
python3 scripts/validate_report.py research-report.json
```

The validator runs offline. It checks structure, canonical URL identity, unique IDs,
source references, provider diversity, and whether confidence exceeds the declared
independent-source count. It strips fragments and common tracking parameters without
following redirects or making network requests. Validation establishes internal
consistency, not source credibility or truth.

## Output

Return: findings organized by confidence level, source map, agreements/disagreements between sources, and research gaps.

Keep citations adjacent to claims. Distinguish sourced facts from inference, disclose unavailable providers and failed searches, and include the search date for time-sensitive topics.
````

</details>

#### 缺口

- 未逐项审阅全245条且没有样本研究质量对照
  **影响**：不能给集合全体效果/风险保证
  **进一步探讨**：按要做的具体工作流逐项预读，先比较一个事实核查任务与临时提示。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH bundle与单Skill安装卸载怎样改文件？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

package声明patch，DSH包装配置复用官方filesystem Skill provider，includeDefaultRoots=true并加marketing和research目录；因此本包不是独立搜索服务，实际发现/加载由宿主提供。单Skill安装器从两个目录的直接子目录寻找SKILL.md，按名字生成.project/.dsh/skills/name目标，递归复制整个源目录，保留脚本/参考资料，不只复制提示正文。

默认目标已存在拒绝；显式force时先递归删除旧目录再cp，没有暂存替换或自动备份。若复制中断，旧本地定制内容不能据源码保证恢复。卸载检查目标SKILL.md是文件后rm整目录，不核对目录是否仍是原安装内容，用户修改过也会删除。CLI只是调用这些函数并返回路径；Installed表示复制返回，不能证明宿主已发现、更不能证明研究流程已执行。

可借鉴的是规范源与不同平台包装分开、按单Skill携带资源，以及保留默认发现根。对真实目录的force/remove应先自行备份，不能把可重装源文件当可恢复本地修改。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-25](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/package.json#L1-L25)

根包与patch/打包目录。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "@sandbaseai/dsh-skills",
  "version": "0.3.5",
  "description": "Install SandBase Agent Skills into DeepSeek Harness projects.",
  "type": "module",
  "bin": {
    "sandbase-dsh-skills": "bin/sandbase-dsh-skills.mjs"
  },
  "exports": "./lib/dsh-installer.mjs",
  "dsh": {
    "bundle": {
      "patch": "./dsh/cordis.patch.yml"
    }
  },
  "files": [
    "bin",
    "dsh",
    "lib",
    "imports",
    "marketing",
    "research",
    "README.md",
    "THIRD_PARTY_NOTICES.md",
    "LICENSE"
  ],
```

</details>

**依据 2 · 源码核查**：[dsh/cordis.patch.yml:1-13](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/dsh/cordis.patch.yml#L1-L13)

官方provider与两个目录、保留默认roots。

<details>
<summary>查看原文（13行）</summary>

```text
# SandBase Skills bundle layer for DeepSeek Harness.
#
# The bundle keeps the default Skill roots and mounts both directories shipped
# by this package. Paths are resolved relative to this installed patch file, so
# source and packaged GitHub installs behave the same way.
- id: skill-filesystem
  name: '@deepseek-ai/dsh-skill-filesystem'
  config:
    providerName: filesystem
    includeDefaultRoots: true
    customSkillDirs:
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../marketing/', baseUrl))"
      - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('../research/', baseUrl))"
```

</details>

**依据 3 · 源码核查**：[lib/dsh-installer.mjs:8-31](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/lib/dsh-installer.mjs#L8-L31)

实际扫描SKILL.md目录。

<details>
<summary>查看原文（24行）</summary>

```text
export async function availableSkills(root = packageRoot) {
  const result = new Map();
  for (const category of categories) {
    const categoryPath = join(root, category);
    let entries;
    try {
      entries = await readdir(categoryPath, { withFileTypes: true });
    } catch (error) {
      if (error?.code === 'ENOENT') continue;
      throw error;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const skillPath = join(categoryPath, entry.name);
      try {
        if ((await stat(join(skillPath, 'SKILL.md'))).isFile()) {
          result.set(entry.name, skillPath);
        }
      } catch (error) {
        if (error?.code !== 'ENOENT') throw error;
      }
    }
  }
  return new Map([...result].sort(([a], [b]) => a.localeCompare(b)));
```

</details>

**依据 4 · 源码核查**：[lib/dsh-installer.mjs:40-58](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/lib/dsh-installer.mjs#L40-L58)

目标、默认拒绝、force先删后复制。

<details>
<summary>查看原文（19行）</summary>

```text
export async function installSkill(name, project = process.cwd(), options = {}) {
  assertSkillName(name);
  const skills = await availableSkills(options.root ?? packageRoot);
  const source = skills.get(name);
  if (!source) throw new Error(`Unknown skill "${name}". Run with --list to inspect names.`);

  const destination = join(resolve(project), '.dsh', 'skills', name);
  try {
    await stat(destination);
    if (!options.force) {
      throw new Error(`${destination} already exists. Pass --force to replace it.`);
    }
    await rm(destination, { recursive: true, force: true });
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true });
  return destination;
```

</details>

**依据 5 · 源码核查**：[lib/dsh-installer.mjs:61-72](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/lib/dsh-installer.mjs#L61-L72)

marker检查后删除全目录。

<details>
<summary>查看原文（12行）</summary>

```text
export async function removeSkill(name, project = process.cwd()) {
  assertSkillName(name);
  const destination = join(resolve(project), '.dsh', 'skills', name);
  try {
    const marker = await stat(join(destination, 'SKILL.md'));
    if (!marker.isFile()) throw new Error(`${destination} is not a DSH skill installation.`);
  } catch (error) {
    if (error?.code === 'ENOENT') throw new Error(`${name} is not installed in ${resolve(project)}.`);
    throw error;
  }
  await rm(destination, { recursive: true });
  return destination;
```

</details>

**依据 6 · 源码核查**：[bin/sandbase-dsh-skills.mjs:17-26](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/bin/sandbase-dsh-skills.mjs#L17-L26)

CLI输出仅绑定安装/移除返回。

<details>
<summary>查看原文（10行）</summary>

```text
try {
  if (args.includes('--list') || positional[0] === 'list') {
    const names = [...(await availableSkills()).keys()];
    output({ skills: names }, names.join('\n'));
  } else if (positional[0] === 'add' && positional[1]) {
    const destination = await installSkill(positional[1], project, { force });
    output({ skill: positional[1], destination }, `Installed ${positional[1]} to ${destination}`);
  } else if (positional[0] === 'remove' && positional[1]) {
    const destination = await removeSkill(positional[1], project);
    output({ skill: positional[1], destination }, `Removed ${positional[1]} from ${destination}`);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多来源和离线validator能证明什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

Skill明确先用宿主搜索/读页，SandBase为可选扩展覆盖，并要求至少两个不同搜索能力、回溯共同来源，避免把循环转述算独立。若用户只有一个搜索能力，可继续做有边界研究但不能伪填第二provider来使账本通过；满足该标准需要真有第二能力或报告未满足。

validator在离线JSON中检查provider唯一数、source ID/规范URL去重、引用存在、独立来源数不超过引用数、置信度最低数、未使用证据和high confidence时冲突标记。URL规范化只去fragment/跟踪参数等，不追重定向、不取网页、不判断证据是否支持结论。independent_source_count是填入值，检查器不能验证三篇不同URL是否同一新闻源，也不能发现作者漏标的冲突。

因此“3来源=high”的规则是内部档位政策，不是经校准的真实性概率。Skill本身已要求原始来源和溯源，不能据validator有限性说它没有证据方法；真实内容、独立性和引用支持仍由研究者回源核对。离线VALID不等于事实真实或可直接发布。

#### 证据与依据

**依据 1 · 源码核查**：[research/multi-source-search/SKILL.md:32-48](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/research/multi-source-search/SKILL.md#L32-L48)

宿主能力、至少多源及共同origin规则。

<details>
<summary>查看原文（17行）</summary>

```text
## Select available search capabilities

Start with the host agent's native web search, page-open, browser, or academic-search
tools. Do not stop merely because SandBase is unavailable. Record the actual capability
names in the report's `providers` field and disclose missing coverage.

If `sandbase_discover`, `sandbase_inspect`, and `sandbase_run` are available, use them
for additional provider diversity. Use the capability identifiers below as discovery hints, not MCP tool names. Find the matching endpoint with `sandbase_discover(q: "<provider and capability>")`; use its returned `name` in `sandbase_inspect(name: "<returned name>")`. Read `inputSchema`, pricing, and `execute_as`, then call `sandbase_run` using `execute_as.arguments.name` and schema-defined `arguments`. If a `run_id` is returned, poll `sandbase_run_get(run_id: "<returned run_id>")` within the task budget until `completed` or `failed`; report pending or failed runs without resubmitting them automatically.

## Operating principles

- Use multiple sources to validate claims — single-source findings are hypotheses.
- Score confidence based on source agreement: 3+ sources = high, 2 = medium, 1 = low.
- Each source has strengths: Exa for semantic relevance, Tavily for recency, Scholar for academic rigor, Cloudsway for broad coverage.
- Cite which source(s) back each finding.
- Trace derivative articles to their common origin so circular reporting counts once.
- Never send private, proprietary, or personal content to a provider without explicit consent.
```

</details>

**依据 2 · 源码核查**：[research/multi-source-search/SKILL.md:65-96](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/research/multi-source-search/SKILL.md#L65-L96)

至少两个能力与离线校验边界。

<details>
<summary>查看原文（32行）</summary>

````text
### 1. Search across sources

Run at least two distinct available search capabilities. Native host search tools count;
separate queries to the same capability do not. Prefer original documents, official
documentation, repositories, and research papers over derivative summaries.

When SandBase is connected, use `tavily_search` for recency control, `exa_search`
for semantic discovery, `scholar_search_mixed` for academic coverage, and
`cloudsway_search` for broad web coverage.

### 2. Deep extraction (if needed)

Open primary pages with the host's page or browser tools. When using SandBase, use
`exa_contents` or `tavily_extract` to extract selected results.

### 3. Synthesize

Cross-reference findings, note agreements and disagreements, produce confidence-scored summary.

### 4. Validate the evidence ledger

Read [the report schema](references/report-schema.md), save the result as JSON, and validate it before presenting the synthesis:

```bash
python3 scripts/validate_report.py research-report.json
```

The validator runs offline. It checks structure, canonical URL identity, unique IDs,
source references, provider diversity, and whether confidence exceeds the declared
independent-source count. It strips fragments and common tracking parameters without
following redirects or making network requests. Validation establishes internal
consistency, not source credibility or truth.
````

</details>

**依据 3 · 源码核查**：[research/multi-source-search/scripts/validate_report.py:27-49](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/research/multi-source-search/scripts/validate_report.py#L27-L49)

URL规范化不访问远端。

<details>
<summary>查看原文（23行）</summary>

```text
def canonical_url_identity(value):
    """Return a conservative identity key without fetching or resolving the URL."""
    parsed = urlsplit(value)
    hostname = (parsed.hostname or "").lower()
    try:
        port = parsed.port
    except ValueError:
        return value
    default_port = (parsed.scheme.lower(), port) in {("http", 80), ("https", 443)}
    host = f"[{hostname}]" if ":" in hostname else hostname
    if port is not None and not default_port:
        host = f"{host}:{port}"
    if parsed.username is not None:
        credentials = parsed.username
        if parsed.password is not None:
            credentials += f":{parsed.password}"
        host = f"{credentials}@{host}"
    query = urlencode([
        (key, item)
        for key, item in parse_qsl(parsed.query, keep_blank_values=True)
        if not key.lower().startswith("utm_") and key.lower() not in TRACKING_QUERY_KEYS
    ], doseq=True)
    return urlunsplit((parsed.scheme.lower(), host, parsed.path or "/", query, ""))
```

</details>

**依据 4 · 源码核查**：[research/multi-source-search/scripts/validate_report.py:60-98](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/research/multi-source-search/scripts/validate_report.py#L60-L98)

provider、source结构与唯一性检查。

<details>
<summary>查看原文（39行）</summary>

```text
    providers = report.get("providers")
    if not isinstance(providers, list) or not all(nonempty(item) for item in providers):
        errors.append("providers must be an array of non-empty strings")
        providers = []
    if len(set(providers)) < 2:
        errors.append("providers must contain at least two unique capabilities")
    if len(set(providers)) != len(providers):
        errors.append("providers must not contain duplicates")
    unavailable = report.get("unavailable_providers")
    if not isinstance(unavailable, list) or not all(nonempty(item) for item in unavailable):
        errors.append("unavailable_providers must be an array of non-empty strings")

    sources = report.get("sources")
    if not isinstance(sources, list) or not sources:
        errors.append("sources must be a non-empty array")
        sources = []
    source_ids, source_urls = set(), set()
    for index, source in enumerate(sources):
        label = f"sources[{index}]"
        if not isinstance(source, dict):
            errors.append(f"{label} must be an object")
            continue
        source_id, url = source.get("id"), source.get("url")
        if not nonempty(source_id):
            errors.append(f"{label}.id must be a non-empty string")
        elif source_id in source_ids:
            errors.append(f"duplicate source id: {source_id}")
        else:
            source_ids.add(source_id)
        if not valid_url(url):
            errors.append(f"{label}.url must be an HTTP(S) URL")
        elif canonical_url_identity(url) in source_urls:
            errors.append(f"duplicate source URL: {url}")
        else:
            source_urls.add(canonical_url_identity(url))
        if not nonempty(source.get("publisher")):
            errors.append(f"{label}.publisher must be a non-empty string")
        if source.get("source_type") not in SOURCE_TYPES:
            errors.append(f"{label}.source_type must be primary, secondary, or aggregator")
```

</details>

**依据 5 · 源码核查**：[research/multi-source-search/scripts/validate_report.py:120-149](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/research/multi-source-search/scripts/validate_report.py#L120-L149)

独立数/引用数及conflict检查只依赖声明字段。

<details>
<summary>查看原文（30行）</summary>

```text
            errors.append(f"{label}.kind must be sourced or inference")
        confidence = claim.get("confidence")
        if confidence not in CONFIDENCE_MINIMUMS:
            errors.append(f"{label}.confidence must be low, medium, or high")
        refs = claim.get("source_ids")
        if not isinstance(refs, list) or not refs or not all(nonempty(item) for item in refs):
            errors.append(f"{label}.source_ids must be a non-empty string array")
            refs = []
        if len(set(refs)) != len(refs):
            errors.append(f"{label}.source_ids must not contain duplicates")
        for source_id in refs:
            if source_id not in source_ids:
                errors.append(f"{label} references unknown source id: {source_id}")
            else:
                used_sources.add(source_id)
        count = claim.get("independent_source_count")
        if not isinstance(count, int) or isinstance(count, bool) or count < 0:
            errors.append(f"{label}.independent_source_count must be a non-negative integer")
        else:
            if count > len(set(refs)):
                errors.append(f"{label} independent source count exceeds its source references")
            minimum = CONFIDENCE_MINIMUMS.get(confidence)
            if minimum is not None and count < minimum:
                errors.append(f"{label} confidence {confidence} requires at least {minimum} independent sources")
        if not isinstance(claim.get("conflict"), bool):
            errors.append(f"{label}.conflict must be true or false")
        elif claim.get("conflict") and confidence == "high":
            errors.append(f"{label} cannot be high confidence while conflict is true")
    for source_id in sorted(source_ids - used_sources):
        errors.append(f"source is not referenced by any claim: {source_id}")
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本与采用怎样限定为具体工作流？

**研究主题**：效果与总成本、采用判断

#### 完整回答

可在测试项目只取multi-source-search，先预读提示和参考/校验脚本，再用一个不敏感、可核对主张的事实核查任务。已有宿主搜索/读页就不必先建SandBase账户；专门社交/市场/数据Skill可能另需API和付费服务，不能把样本无账户外推全目录。离线validator要求Python3.9+，Node安装器声明>=20。

首次有预读、安装和工具/环境核对，持续有搜索/模型/可选provider费用、原页检查、独立性溯源与冲突解释，失败后要修账本或补证，目录覆盖则需备份恢复。金额与时间未知，六搜索/六读页是默认上限不是实际节费证明。

若来源无法打开、实际只有一能力却需填第二、独立性缺乏或内部通过与证据支持矛盾，应降低/保留未知，停止扩查或回人工原页核对；不为凑high继续循环。退出可移除测试目录，force/remove前完整备份，不在带本地修改的正式Skill上实验。

#### 证据与依据

**依据 1 · 源码核查**：[research/multi-source-search/SKILL.md:3-4](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/research/multi-source-search/SKILL.md#L3-L4)

样本工具、Python和账户条件。

```text
description: Portable multi-source research with cross-source validation and an offline evidence ledger. Use for fact-checking, comprehensive research, or any question requiring multiple independent perspectives; work with the host agent's search tools and optionally add SandBase Tavily, Exa, Scholar, and Cloudsway coverage.
compatibility: Requires an Agent Skills-compatible host with web search and page-reading tools plus network access for live research. The optional offline evidence-ledger validator requires Python 3.9+. No SandBase account is required when the host provides search.
```

**依据 2 · 源码核查**：[research/multi-source-search/SKILL.md:52-63](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/research/multi-source-search/SKILL.md#L52-L63)

预算和不重复查询规则。

<details>
<summary>查看原文（12行）</summary>

```text
### 0. Set a search budget and stop condition

Before the first query, state the claim or decision being researched and set a finite
budget. Unless the user asks for exhaustive research, use at most six search calls and
six page opens. Stop early when every material claim has enough independent sources for
its declared confidence and another query is unlikely to add a new publisher, source
type, or contradiction.

Never repeat the same query after it returns no new evidence. Change the hypothesis,
source type, date window, or domain constraint; otherwise stop and report the gap. If
the budget is exhausted, return the best supported result with lower confidence instead
of continuing a tool loop.
```

</details>

**依据 3 · 作者声明**：[README.md:82-84](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/README.md#L82-L84)

专门Skill另有API条件，不能泛化样本。

```text
`multi-source-search` needs no SandBase account when the host agent already provides
search and page-reading tools. For specialized social, market, and data-provider Skills,
set `SANDBASE_API_KEY` in your environment—never in a prompt or committed file.
```

**依据 4 · 源码核查**：[lib/dsh-installer.mjs:46-57](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/lib/dsh-installer.mjs#L46-L57)

force覆盖成本来源。

<details>
<summary>查看原文（12行）</summary>

```text
  const destination = join(resolve(project), '.dsh', 'skills', name);
  try {
    await stat(destination);
    if (!options.force) {
      throw new Error(`${destination} already exists. Pass --force to replace it.`);
    }
    await rm(destination, { recursive: true, force: true });
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  await mkdir(dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true });
```

</details>

#### 缺口

- 缺少真实事实核查结果、总调用和人工复核成本
  **影响**：不能给准确率/节时/现金收益
  **进一步探讨**：固定同一主张与预算对比临时提示，记录正确支持/错误引用、全部调用与复核时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 外部事实与内部账本脱节可怎样验证？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为抽样主张附原页摘录及共同origin判据，再由第二次独立核查记录“引用是否真支持、来源是否独立”，可减少格式正确但语义错误。当前Skill已要求来源溯源与未信任网页，不能把增加一段同样提示当创新；增量在实证抽样与错误统计，不是再加JSON字段就声称解决。

对照现有账本，构造三篇不同URL但同一稿源、过时原页、引用与结论相反和漏标冲突的固定案例；比较validator通过后有多少语义错误被识别，以及第二核查增加的模型/人工时间。若已有执行同样完成溯源，或抽样未改善错误率/总负担更高，则否定。不得将合成案例导入真实研究或把实验未执行写成成果。

#### 证据与依据

**依据 1 · 源码核查**：[research/multi-source-search/SKILL.md:43-48](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/research/multi-source-search/SKILL.md#L43-L48)

已有origin规则是反证，限定增量。

```text
- Use multiple sources to validate claims — single-source findings are hypotheses.
- Score confidence based on source agreement: 3+ sources = high, 2 = medium, 1 = low.
- Each source has strengths: Exa for semantic relevance, Tavily for recency, Scholar for academic rigor, Cloudsway for broad coverage.
- Cite which source(s) back each finding.
- Trace derivative articles to their common origin so circular reporting counts once.
- Never send private, proprietary, or personal content to a provider without explicit consent.
```

**依据 2 · 源码核查**：[research/multi-source-search/SKILL.md:92-96](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/research/multi-source-search/SKILL.md#L92-L96)

内部一致不证真提供推导。

```text
The validator runs offline. It checks structure, canonical URL identity, unique IDs,
source references, provider diversity, and whether confidence exceeds the declared
independent-source count. It strips fragments and common tracking parameters without
following redirects or making network requests. Validation establishes internal
consistency, not source credibility or truth.
```

**依据 3 · 源码核查**：[research/multi-source-search/scripts/validate_report.py:135-147](https://github.com/sandbaseai/sandbase-skills/blob/cbab58188611e626ccaf54ac346b437d12ea4729/research/multi-source-search/scripts/validate_report.py#L135-L147)

独立数和冲突是声明校验。

<details>
<summary>查看原文（13行）</summary>

```text
        count = claim.get("independent_source_count")
        if not isinstance(count, int) or isinstance(count, bool) or count < 0:
            errors.append(f"{label}.independent_source_count must be a non-negative integer")
        else:
            if count > len(set(refs)):
                errors.append(f"{label} independent source count exceeds its source references")
            minimum = CONFIDENCE_MINIMUMS.get(confidence)
            if minimum is not None and count < minimum:
                errors.append(f"{label} confidence {confidence} requires at least {minimum} independent sources")
        if not isinstance(claim.get("conflict"), bool):
            errors.append(f"{label}.conflict must be true or false")
        elif claim.get("conflict") and confidence == "high":
            errors.append(f"{label} cannot be high confidence while conflict is true")
```

</details>

#### 缺口

- 没有语义抽样校验对照
  **影响**：不能认定第二核查改善质量或值得投入
  **进一步探讨**：在独立实验材料对照误支持和独立性错误及额外成本，无净改善则不用。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
