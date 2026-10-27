# Learn Harness Engineering

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[a9342ff](https://github.com/walkinglabs/learn-harness-engineering/tree/a9342ff471f2c0e60be0c08b9f4a7c502df4e442)

<!-- BEGIN META -->
[![GitHub ★ 21,413](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=21%2C413&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/walkinglabs/learn-harness-engineering)
<!-- END META -->

> **实现功能**：项目式编码 Agent 工程课程，提供状态、验证、范围与跨会话恢复教材、示例和脚手架 Skill。

> **核心亮点**：相对散落工程文章和手写约定，课程以 instructions、state、verification、scope、lifecycle 五部分组织问题，并把它落实为可生成、可结构检查的最小文件组。贡献在教学与工程启动流程；框架原理有明确外部来源，结构评分也不等于 Agent 效果评测。[Q02](#research-q02)

> **风险与缺陷**：结构评估主要检查文件、JSON字段及关键词是否出现，能发现缺少入口，却无法证明验证命令足以覆盖目标任务或 Agent 会执行它。Skill 本身承认 benchmark 是结构性的。README 中引述的外部成本案例还有预算和时间变化，本轮未独立复核，不能用它证明同预算可靠性提升。[Q03](#research-q03)

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
  - [Q01 · 课程和附带 Skill 分别交付什么，谁需要它？](#detail-section-11)
  - [Q02 · 五部分框架怎样变成项目文件及检查？](#detail-section-12)
  - [Q03 · 结构分可以证明可靠性提升吗？](#detail-section-13)
  - [Q04 · 从学习到可靠任务还需要投入什么？](#detail-section-14)
  - [Q05 · 如何从结构检查走向可证伪效果，谁值得采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向学习如何让编码 Agent 跨会话保持状态、范围和验证约束的开发者，提供项目式课程、示例及 harness-creator Skill。交付应是能在真实任务中遵守验证和恢复规则的项目环境；课程仓库本身不是 DSH 功能插件。

原始工程文章加人工编写AGENTS、状态和验证入口是基线。比较应控制任务、模型与预算，区分结构缺项改善和实际交付改善。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 项目式课程 | 学习 Agent 环境与控制机制 | 是学习资源，不是运行保证 |
| 最小环境脚手架 | 生成指令、状态、交接与验证入口 | 需替换占位功能和核对真实命令 |
| 结构评估 | 发现文件和约定缺项 | 关键词与字段检查，不测任务正确性 |

<a id="dependencies-and-flow"></a>

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 可阅读课程的开发基础 | 学习必需 | 理解项目状态和测试约束 | 需先完成基础工程练习 |
| Node 与本地项目写权限 | 脚手架必需 | 检测项目并生成文件 | 可只阅读模板，不能生成项目文件 |
| 项目真实验证命令 | 效果必需 | 判断功能是否合格 | 模板存在仍不能证明质量 |
| Agent、模型与代表性任务 | 效果检验必需 | 测量遵循度和恢复 | 只能获得结构检查结果 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 开发者阅读课程并检查已有项目规则 | 明确一个当前问题，避免堆叠重复文件 |
| 2 | 开发者在临时副本生成最小环境 | 已有文件默认跳过；覆盖前需核对内容 |
| 3 | 开发者替换占位功能与验证命令 | 命令对应真实任务，失败会阻止完成声明 |
| 4 | 开发者运行代表性跨会话任务 | 以产物和执行证据判定，结构分仅辅助 |

<a id="cost-and-value"></a>

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次学习 | 文档构建或模型资源；金额未知 | 阅读、练习、项目规则适配 | 学习曲线与首次配置时间未测 |
| 持续使用 | 真实测试与 Agent 调用资源 | 更新功能状态、证据与交接文件 | 文档维护负担取决于项目 |
| 失败恢复 | 重跑检查与重新启动任务 | 排查失效命令、状态偏差和错误完成 | 没有恢复时间及合格率样本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 学习与启动 | 五部分模型和生成脚本 | 学习后真实任务收益 |
| 结构缺项发现 | 文件、字段及关键词检查 | 命令语义、覆盖率和实际遵循 |
| 跨会话状态 | 模板中有 progress 和 handoff | 恢复正确率与人工介入变化 |

> **思考**：结构评估主要检查文件、JSON字段及关键词是否出现，能发现缺少入口，却无法证明验证命令足以覆盖目标任务或 Agent 会执行它。Skill 本身承认 benchmark 是结构性的。README 中引述的外部成本案例还有预算和时间变化，本轮未独立复核，不能用它证明同预算可靠性提升。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对散落工程文章和手写约定，课程以 instructions、state、verification、scope、lifecycle 五部分组织问题，并把它落实为可生成、可结构检查的最小文件组。贡献在教学与工程启动流程；框架原理有明确外部来源，结构评分也不等于 Agent 效果评测。[Q02](#research-q02)

相对散落工程文章和手写约定，课程以 instructions、state、verification、scope、lifecycle 五部分组织问题，并把它落实为可生成、可结构检查的最小文件组。贡献在教学与工程启动流程；框架原理有明确外部来源，结构评分也不等于 Agent 效果评测。[Q02](#research-q02)

默认跳过已有文件、从项目检测验证命令和保持最小规则值得参考；结构评分保留逐项检查比黑箱总分可解释，但须避免把静态指标当成果。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

结构评估主要检查文件、JSON字段及关键词是否出现，能发现缺少入口，却无法证明验证命令足以覆盖目标任务或 Agent 会执行它。Skill 本身承认 benchmark 是结构性的。README 中引述的外部成本案例还有预算和时间变化，本轮未独立复核，不能用它证明同预算可靠性提升。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已经遇到跨会话丢状态或提前报完成的开发者，先选一个真实失败，在项目副本上加入最少文件，并用相同任务比较前后。已有成熟工程规范的仓库可只参考课程而不全套生成。若只是结构评分变高、实际错误和人工介入没有下降，应删减无效约定，不继续扩充模板。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查课程定位与最小脚手架、结构检查；未验证学习效果或Agent可靠性收益；任务证据设计为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、skills/harness-creator/SKILL.md、skills/harness-creator/scripts/create-harness.mjs、skills/harness-creator/scripts/validate-harness.mjs、skills/harness-creator/scripts/lib/harness-utils.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根文档与附带 harness-creator 模型、生成器及结构评分，不全量审阅15种翻译和全部项目，不运行目标脚本或模型实验。
- 下一步：取一次真实失败，固定同任务和模型预算，比较最小改造前后错误完成、验证遗漏、跨会话恢复与人工投入。

**分析版本**

- **仓库**：[walkinglabs/learn-harness-engineering](https://github.com/walkinglabs/learn-harness-engineering)
- **版本号**：0.1.0（[固定提交 a9342ff](https://github.com/walkinglabs/learn-harness-engineering/tree/a9342ff471f2c0e60be0c08b9f4a7c502df4e442)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是在五部分结构检查外，为每条“完成”规则绑定一个代表性任务及失败注入，从静态约定转为可观察遵循度。固定同模型、仓库和预算，对比未改造、仅模板与任务证据三种环境，测漏跑验证、错误完成、跨会话恢复和人工介入。若结构分提高而任务指标不变，或维护验证任务的成本超过节省，则不继续加机制。[Q05](#research-q05)

取一次真实失败，固定同任务和模型预算，比较最小改造前后错误完成、验证遗漏、跨会话恢复与人工投入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1731 | 105674 | — | — | 1057009 |
| .mts | source | 1 | 1529 | 1418 | 7 | — |
| .js | source | 17 | 754 | 623 | 18 | — |
| .ts | source | 359 | 57682 | 42931 | 7482 | — |
| .tsx | source | 111 | 8489 | 7878 | 117 | — |
| .mjs | source | 5 | 753 | 658 | 13 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/walkinglabs/learn-harness-engineering/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/walkinglabs/learn-harness-engineering/issues?q=is%3Aissue+created%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/walkinglabs/learn-harness-engineering/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查课程与脚手架如何把工程原则落地，并明确结构检查与真实Agent效果之间的边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 课程和附带 Skill 分别交付什么，谁需要它？

**研究主题**：场景与需求

#### 完整回答

根包描述是 VitePress 课程文档，private 且没有 dsh.bundle；README 指向 harness-creator 子目录作为快速启动辅助。因此本次对象是课程资源工程，不能把14课、8项目或多语言数量当作可安装插件数量。用户是构建或维护编码Agent环境的开发者，合格产物是自己项目中可执行的范围、状态、验证和恢复流程。直接替代是阅读原始工程文章并手工编写项目规则，是否更容易学会需实际任务测量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-38](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/README.md#L28-L38)

作者项目式课程定位

<details>
<summary>查看原文（11行）</summary>

```text
<p align="center"><strong>A project-based course on building the environment, state management, verification, and control mechanisms that make AI coding agents work reliably.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Lectures-14-blue?style=flat-square" alt="14 Lectures">
  <img src="https://img.shields.io/badge/Projects-8-green?style=flat-square" alt="8 Projects">
  <img src="https://img.shields.io/badge/Languages-15-yellow?style=flat-square" alt="15 Languages">
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square" alt="MIT License">
  <a href="https://github.com/walkinglabs"><img src="https://img.shields.io/badge/Discord-Join_Community-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Join the Discord community"></a>
</p>

> 🌍 This course is available in **15 languages**: English, 简体中文, 繁體中文, 日本語, 한국어, Español, Français, Русский, Deutsch, العربية, Tiếng Việt, Oʻzbekcha, Türkçe, Portuguese (BR), Українська. Choose your language from the badges above.
```

</details>

**依据 2 · 作者声明**：[README.md:83-90](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/README.md#L83-L90)

外部来源与附带 Skill 位置

```text
Learn Harness Engineering is a course dedicated to the engineering of AI coding agents. We have deeply studied and synthesized the most advanced Harness Engineering theories and practices in the industry. Our core references include:

- [OpenAI: Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Anthropic: Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Awesome Harness Engineering](https://github.com/walkinglabs/awesome-harness-engineering)

> **Quick start?** The [`skills/harness-creator/`](./skills/harness-creator/) skill can help you scaffold a production-grade harness (AGENTS.md, feature lists, init.sh, verification workflows) for your own project in minutes.
```

**依据 3 · 源码核查**：[package.json:1-19](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/package.json#L1-L19)

private 文档工程与构建命令

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "learn-harness-engineering",
  "private": true,
  "version": "0.1.0",
  "description": "Course docs for Learn Harness Engineering powered by VitePress.",
  "license": "MIT",
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs",
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs",
    "lecture:run": "tsx",
    "anchors:build": "node --import tsx scripts/build-anchor-map.ts",
    "anchors:check": "node --import tsx scripts/validate-anchors.ts",
    "screenshots:readme": "node --import tsx scripts/capture-readme-screenshots.ts",
    "pdf:export": "node --import tsx scripts/build-course-pdfs.ts",
    "pdf:build": "npm run docs:build && npm run pdf:export"
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 五部分框架怎样变成项目文件及检查？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Skill 将 instructions/state/verification/scope/lifecycle 映射到明确文件，要求先读现有规则并保持最小。create-harness 检测项目与包管理器，将真实或推断的命令填入模板，生成 AGENTS、feature_list、progress、handoff 和 init；已有文件默认跳过。validate-harness 读取文件并调用 scoreHarness，以阈值决定退出码。新增价值是教学模型到可操作工程入口的一致组织，不是发明新的Agent运行内核，也不应把上游文章所述机制归为本项目原创。

#### 证据与依据

**依据 1 · 源码核查**：[skills/harness-creator/SKILL.md:20-36](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/skills/harness-creator/SKILL.md#L20-L36)

五部分模型和最小化策略

<details>
<summary>查看原文（17行）</summary>

```text
## Core Model

Every useful coding-agent harness has five subsystems:

| Subsystem | Minimal artifact | Purpose |
|---|---|---|
| Instructions | `AGENTS.md` or `CLAUDE.md` | Startup path, working rules, definition of done |
| State | `feature_list.json`, `progress.md` | Current feature, status, evidence, next step |
| Verification | `init.sh` or documented commands | Tests/checks the agent must run before claiming done |
| Scope | Feature dependencies and done criteria | Prevents overreach and half-finished work |
| Lifecycle | `session-handoff.md`, end-of-session routine | Makes the next session restartable |

## First Move

1. Inspect what already exists: instruction files, feature/state files, verification commands, docs, package manifests.
2. Ask only for missing context that cannot be inferred safely: target agent, desired file name, tolerance for structure, and whether overwriting is allowed.
3. Prefer a minimal harness first. Add memory, tool safety, multi-agent, or benchmark details only when the user's problem calls for them.
```

</details>

**依据 2 · 源码核查**：[skills/harness-creator/scripts/create-harness.mjs:31-64](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/skills/harness-creator/scripts/create-harness.mjs#L31-L64)

检测、模板替换和默认不覆盖

<details>
<summary>查看原文（34行）</summary>

```text
const target = path.resolve(args.target || args._[0] || process.cwd());
const agentFile = args.agentFile || 'AGENTS.md';
const force = Boolean(args.force);
const project = await detectProject(target);
project.packageManager = detectPackageManager(target, args.packageManager);
const commands = args.commands
  ? String(args.commands).split(',').map((command) => command.trim()).filter(Boolean)
  : verificationCommands(project, args.packageManager);

await mkdir(target, { recursive: true });

const replacements = {
  AGENT_FILE_NAME: agentFile,
  PROJECT_PURPOSE: project.stack === 'generic'
    ? 'Project harness for reliable agent-assisted development.'
    : `Project harness for reliable agent-assisted development in a ${project.stack} codebase.`,
  VERIFICATION_COMMANDS: commands.map((command) => `- \`${command}\``).join('\n'),
  PRIMARY_VERIFICATION_COMMAND: './init.sh'
};

const results = [];
results.push(await copyTemplate('agents.md', path.join(target, agentFile), replacements, { force }));
results.push(await copyTemplate('feature-list.json', path.join(target, 'feature_list.json'), {}, { force }));
results.push(await copyTemplate('progress.md', path.join(target, 'progress.md'), {}, { force }));
results.push(await copyTemplate('session-handoff.md', path.join(target, 'session-handoff.md'), {}, { force }));

const initPath = path.join(target, 'init.sh');
if (force || !await exists(initPath)) {
  await writeText(initPath, initScriptFromCommands(commands));
  await chmod(initPath, 0o755);
  results.push({ path: initPath, status: 'written' });
} else {
  results.push({ path: initPath, status: 'skipped', reason: 'exists' });
}
```

</details>

**依据 3 · 源码核查**：[skills/harness-creator/scripts/validate-harness.mjs:24-42](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/skills/harness-creator/scripts/validate-harness.mjs#L24-L42)

结构评分和阈值退出

<details>
<summary>查看原文（19行）</summary>

```text
const target = path.resolve(args.target || args._[0] || process.cwd());
const minScore = Number(args.minScore || 70);
const files = await loadHarnessFiles(target);
const result = scoreHarness(files);

if (args.html) {
  const htmlPath = path.resolve(args.html);
  await writeText(htmlPath, htmlReport(result, `Harness Assessment: ${path.basename(target)}`));
  console.log(`HTML report written to ${htmlPath}`);
}

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(formatScoreReport(result, target));
}

if (result.overall < minScore) {
  process.exitCode = 1;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 结构分可以证明可靠性提升吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

scoreHarness 检查文件存在、JSON基本字段、标题与关键词，按通过比例汇总五部分分数。它可以指出明显缺少验证入口或交接字段，但不能判断 test 命令是否跑了正确测试，也不能从出现 Evidence 文字证明真实执行。结构化关键词过滤比任意散文匹配更谨慎，仍然属于启发式。Skill 明确要求代表任务的前后Agent会话才能判断效果。README 的外部案例同时改变了成本和耗时，本轮仅核查引述存在，未独立核实其原始实验，不将其当作本项目同条件收益。

#### 证据与依据

**依据 1 · 源码核查**：[skills/harness-creator/scripts/lib/harness-utils.mjs:230-284](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/skills/harness-creator/scripts/lib/harness-utils.mjs#L230-L284)

按文件与关键词汇总结构评分

<details>
<summary>查看原文（55行）</summary>

```text
    instructions: [
      hasFile(byPath, ['AGENTS.md', 'CLAUDE.md'], 'Agent instruction file exists'),
      structuredHas(agents, ['Startup Workflow', 'Before writing code'], 'Startup workflow documented'),
      structuredHas(agents, ['Definition of Done', 'done only when'], 'Definition of done documented'),
      structuredHas(agents, ['Verification Commands', './init.sh', 'test', 'verify'], 'Verification commands discoverable'),
      structuredHas(agents, ['feature_list.json', 'progress.md'], 'State artifacts routed from instructions')
    ],
    state: [
      hasFile(byPath, ['feature_list.json', 'feature-list.json'], 'Feature tracker exists'),
      jsonFeatureList(featureList, 'Feature tracker is valid and has feature fields'),
      hasFile(byPath, ['progress.md'], 'Progress log exists'),
      structuredHas(progress, ['Current State', 'What', 'Next'], 'Progress log supports restart'),
      structuredHas(handoff || progress, ['Blockers', 'Files', 'Next Session'], 'Handoff captures blockers/files/next step')
    ],
    verification: [
      hasFile(byPath, ['init.sh'], 'Verification entrypoint exists'),
      textHas(init, ['set -e'], 'Verification fails fast'),
      textHas(init + agents, ['test', 'pytest', 'vitest', 'cargo test', 'go test', 'dotnet test'], 'Test command documented'),
      textHas(init + agents, ['build', 'type', 'lint', 'compile'], 'Static/build check documented'),
      textHas(allText, ['Evidence', 'Verification Evidence', 'command and output'], 'Verification evidence is recorded')
    ],
    scope: [
      structuredHas(agents, ['One feature at a time', 'one-feature-at-a-time'], 'One-feature-at-a-time rule exists'),
      textHas(featureList, ['dependencies'], 'Feature dependencies are tracked'),
      textHas(agents + featureList, ['status'], 'Feature status is explicit'),
      structuredHas(agents, ['Stay in scope', 'scope'], 'Scope boundary documented'),
      structuredHas(agents, ['Definition of Done'], 'Completion gate limits scope closure')
    ],
    lifecycle: [
      hasFile(byPath, ['init.sh'], 'Startup script exists'),
      structuredHas(agents, ['End of Session', 'Before ending'], 'End-of-session procedure exists'),
      hasFile(byPath, ['session-handoff.md'], 'Session handoff template exists'),
      structuredHas(progress + '\n' + handoff, ['Last Updated', 'Current Objective', 'Recommended Next Step'], 'Session restart markers exist'),
      textHas(agents + init, ['restartable', 'clean', 'Next steps'], 'Clean restart path documented')
    ]
  };

  const subsystems = Object.fromEntries(Object.entries(checks).map(([name, subsystemChecks]) => {
    const passed = subsystemChecks.filter((check) => check.pass).length;
    const score = Math.max(1, Math.round((passed / subsystemChecks.length) * 5));
    return [name, {
      score,
      passed,
      total: subsystemChecks.length,
      checks: subsystemChecks
    }];
  }));

  const total = Object.values(subsystems).reduce((sum, item) => sum + item.score, 0);
  const overall = Math.round((total / (SUBSYSTEMS.length * 5)) * 100);
  const ranked = Object.entries(subsystems).sort((a, b) => a[1].score - b[1].score);
  // A bottleneck only means something when a subsystem is weaker than the rest.
  // When every subsystem already maxes out, reporting one is misleading.
  const bottleneck = ranked[0][1].score === 5 ? null : ranked[0][0];
  return { overall, bottleneck, subsystems };
```

</details>

**依据 2 · 源码核查**：[skills/harness-creator/scripts/lib/harness-utils.mjs:287-318](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/skills/harness-creator/scripts/lib/harness-utils.mjs#L287-L318)

文本与结构化关键词启发式

<details>
<summary>查看原文（32行）</summary>

````text
function hasFile(byPath, names, message) {
  return { pass: names.some((name) => byPath.has(name)), message };
}

function textHas(text, needles, message) {
  const lower = text.toLowerCase();
  return { pass: needles.some((needle) => lower.includes(needle.toLowerCase())), message };
}

// A real instruction doc carries its load-bearing phrases in structure — headings,
// list items, tables, fenced code, or bold lead-ins — not in free prose. Scoring only
// the structured lines means a genuine harness still passes, while a file that just
// sprinkles the right keywords across a paragraph to game the score does not.
function structuredText(markdown) {
  const kept = [];
  let inFence = false;
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim();
    if (/^(```|~~~)/.test(line)) { inFence = !inFence; continue; }
    if (inFence) { kept.push(line); continue; }
    if (!line) continue;
    const isHeading = /^#{1,6}\s/.test(line);
    const isList = /^([-*+]|\d+\.)\s/.test(line);
    const isTable = line.startsWith('|');
    const isBoldLead = /^\*\*[^*]+\*\*/.test(line);
    if (isHeading || isList || isTable || isBoldLead) kept.push(line);
  }
  return kept.join('\n');
}

function structuredHas(markdown, needles, message) {
  return textHas(structuredText(markdown), needles, message);
````

</details>

**依据 3 · 源码核查**：[skills/harness-creator/SKILL.md:65-76](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/skills/harness-creator/SKILL.md#L65-L76)

作者明确结构benchmark边界

<details>
<summary>查看原文（12行）</summary>

````text
Report the five subsystem scores, the lowest-scoring area, and the first 2-3 changes that would improve reliability. Treat the lowest score as a candidate bottleneck; confirm with failures, logs, or task outcomes before claiming causality.

### Produce a report

Use when the user wants a shareable assessment:

```bash
node skills/harness-creator/scripts/render-assessment-html.mjs --target /path/to/project
node skills/harness-creator/scripts/run-benchmark.mjs --target /path/to/project --html /path/to/report.html
```

Be clear that this is a structural benchmark. The benchmark first runs a self-check — it scaffolds a throwaway harness and validates it, proving the bundled scripts work end-to-end — then scores the target and eval coverage. Real effectiveness still needs before/after agent sessions on representative tasks.
````

</details>

**依据 4 · 作者声明**：[README.md:136-148](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/README.md#L136-L148)

作者外部效果引述，不是本项目运行证据

<details>
<summary>查看原文（13行）</summary>

```text
## The Model Is Smart, The Harness Makes It Reliable

There's a hard truth most people learn the hard way: **the strongest model in the world will still fail on real engineering tasks if you don't build a proper environment around it.**

You've probably seen this yourself. You give Claude or GPT a task in your repo. It starts well — reads files, writes code, looks productive. Then something goes wrong. It skips a step. It breaks a test. It says "done" but nothing actually works. You spend more time cleaning up than if you'd done it yourself.

This isn't a model problem. It's a harness problem.

The evidence is clear. Anthropic ran a controlled experiment: same model (Opus 4.5), same prompt ("build a 2D retro game editor"). Without a harness, it spent $9 in 20 minutes and produced something that didn't work. With a full harness (planner + generator + evaluator), it spent $200 in 6 hours and built a game you could actually play. The model didn't change. The harness did.

OpenAI reported the same thing with Codex: in a well-harnessed repository, the same model goes from "unreliable" to "reliable." Not a marginal improvement — a qualitative shift.

**This course teaches you how to build that environment.**
```

</details>

#### 缺口

- 没有课程使用者的同条件任务与失败日志
  **影响**：不能把结构满分解释为真实可靠或因果改善
  **进一步探讨**：对固定仓库任务比较错误完成、验证遗漏与恢复，控制模型和预算

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 从学习到可靠任务还需要投入什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

只读课程可不运行网站，构建网站才需 Node、VitePress 等开发依赖。脚手架会向目标目录写文件，而项目真实验证命令才是效果依赖。默认跳过已有文件意味着生成成功不保证旧规则已协调一致；--force 会覆盖，需自行核对。以一个任务完成且证据可复核为单位计量，学习、模板适配、真实测试和状态维护都不能省略。

首次成本是学习与项目适配，持续成本是测试和状态维护，失败成本是检查失效规则及恢复上下文。需把这些人工投入和模型/测试资源分别记录，不能按模板生成耗时推算ROI。具体分阶段表与效果边界见[成本与效果](#cost-and-value)，启动条件见[依赖与流程](#dependencies-and-flow)。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-28](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/package.json#L7-L28)

文档与工具依赖

<details>
<summary>查看原文（22行）</summary>

```text
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs",
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs",
    "lecture:run": "tsx",
    "anchors:build": "node --import tsx scripts/build-anchor-map.ts",
    "anchors:check": "node --import tsx scripts/validate-anchors.ts",
    "screenshots:readme": "node --import tsx scripts/capture-readme-screenshots.ts",
    "pdf:export": "node --import tsx scripts/build-course-pdfs.ts",
    "pdf:build": "npm run docs:build && npm run pdf:export"
  },
  "devDependencies": {
    "mermaid": "^11.14.0",
    "pdf-lib": "^1.17.1",
    "playwright": "^1.59.1",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0",
    "vitepress": "^1.6.4",
    "vitepress-plugin-mermaid": "^2.0.17"
```

</details>

**依据 2 · 源码核查**：[skills/harness-creator/scripts/create-harness.mjs:31-64](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/skills/harness-creator/scripts/create-harness.mjs#L31-L64)

写入与跳过语义

<details>
<summary>查看原文（34行）</summary>

```text
const target = path.resolve(args.target || args._[0] || process.cwd());
const agentFile = args.agentFile || 'AGENTS.md';
const force = Boolean(args.force);
const project = await detectProject(target);
project.packageManager = detectPackageManager(target, args.packageManager);
const commands = args.commands
  ? String(args.commands).split(',').map((command) => command.trim()).filter(Boolean)
  : verificationCommands(project, args.packageManager);

await mkdir(target, { recursive: true });

const replacements = {
  AGENT_FILE_NAME: agentFile,
  PROJECT_PURPOSE: project.stack === 'generic'
    ? 'Project harness for reliable agent-assisted development.'
    : `Project harness for reliable agent-assisted development in a ${project.stack} codebase.`,
  VERIFICATION_COMMANDS: commands.map((command) => `- \`${command}\``).join('\n'),
  PRIMARY_VERIFICATION_COMMAND: './init.sh'
};

const results = [];
results.push(await copyTemplate('agents.md', path.join(target, agentFile), replacements, { force }));
results.push(await copyTemplate('feature-list.json', path.join(target, 'feature_list.json'), {}, { force }));
results.push(await copyTemplate('progress.md', path.join(target, 'progress.md'), {}, { force }));
results.push(await copyTemplate('session-handoff.md', path.join(target, 'session-handoff.md'), {}, { force }));

const initPath = path.join(target, 'init.sh');
if (force || !await exists(initPath)) {
  await writeText(initPath, initScriptFromCommands(commands));
  await chmod(initPath, 0o755);
  results.push({ path: initPath, status: 'written' });
} else {
  results.push({ path: initPath, status: 'skipped', reason: 'exists' });
}
```

</details>

**依据 3 · 源码核查**：[skills/harness-creator/SKILL.md:90-109](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/skills/harness-creator/SKILL.md#L90-L109)

工程交付规则

<details>
<summary>查看原文（20行）</summary>

```text
## Design Rules

- Keep the root instruction file short: routing and invariants, not a full manual.
- Put project facts in project docs, not in the skill.
- Make verification commands explicit and runnable.
- Require evidence before marking a feature done.
- Use one active feature unless the harness has explicit multi-agent ownership boundaries.
- Prefer append/update state files over relying on chat history.
- Never hide destructive behavior in scripts; overwrites require explicit user approval.

## Deliverable Checklist

For a usable minimal harness, leave the target project with:

- [ ] `AGENTS.md` or `CLAUDE.md`
- [ ] `feature_list.json`
- [ ] `progress.md`
- [ ] `init.sh`
- [ ] Optional `session-handoff.md` for multi-session work
- [ ] Documented verification evidence or next action
```

</details>

#### 缺口

- 学习时间、模板维护和测试成本未实测
  **影响**：不能得出课程能在几分钟改善生产可靠性
  **进一步探讨**：跟踪一个实际项目从学习、改造、任务执行到恢复的完整人工和资源投入

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何从结构检查走向可证伪效果，谁值得采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

现有静态模型有助于组织核查，但实际失败可能来自验证命令不足、Agent未执行或状态错误。提出每条完成规则绑定代表任务与失败注入的未验证设计，避免用结构分替代最终产物。控制同一模型、任务、预算并设置未改造、模板和任务证据三组，观察错误完成率、漏验和恢复时间。对于已有故障的项目，可先改一个最弱环节；没有明确失败时不宜为了课程模型堆文件。结构提升而实际指标不改善时应撤除多余机制。

#### 证据与依据

**依据 1 · 源码核查**：[skills/harness-creator/scripts/lib/harness-utils.mjs:244-263](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/skills/harness-creator/scripts/lib/harness-utils.mjs#L244-L263)

当前结构验证与生命周期字段为实验提供干预点

<details>
<summary>查看原文（20行）</summary>

```text
    verification: [
      hasFile(byPath, ['init.sh'], 'Verification entrypoint exists'),
      textHas(init, ['set -e'], 'Verification fails fast'),
      textHas(init + agents, ['test', 'pytest', 'vitest', 'cargo test', 'go test', 'dotnet test'], 'Test command documented'),
      textHas(init + agents, ['build', 'type', 'lint', 'compile'], 'Static/build check documented'),
      textHas(allText, ['Evidence', 'Verification Evidence', 'command and output'], 'Verification evidence is recorded')
    ],
    scope: [
      structuredHas(agents, ['One feature at a time', 'one-feature-at-a-time'], 'One-feature-at-a-time rule exists'),
      textHas(featureList, ['dependencies'], 'Feature dependencies are tracked'),
      textHas(agents + featureList, ['status'], 'Feature status is explicit'),
      structuredHas(agents, ['Stay in scope', 'scope'], 'Scope boundary documented'),
      structuredHas(agents, ['Definition of Done'], 'Completion gate limits scope closure')
    ],
    lifecycle: [
      hasFile(byPath, ['init.sh'], 'Startup script exists'),
      structuredHas(agents, ['End of Session', 'Before ending'], 'End-of-session procedure exists'),
      hasFile(byPath, ['session-handoff.md'], 'Session handoff template exists'),
      structuredHas(progress + '\n' + handoff, ['Last Updated', 'Current Objective', 'Recommended Next Step'], 'Session restart markers exist'),
      textHas(agents + init, ['restartable', 'clean', 'Next steps'], 'Clean restart path documented')
```

</details>

**依据 2 · 源码核查**：[skills/harness-creator/SKILL.md:65-76](https://github.com/walkinglabs/learn-harness-engineering/blob/a9342ff471f2c0e60be0c08b9f4a7c502df4e442/skills/harness-creator/SKILL.md#L65-L76)

作者要求用真实结果确认瓶颈与效果

<details>
<summary>查看原文（12行）</summary>

````text
Report the five subsystem scores, the lowest-scoring area, and the first 2-3 changes that would improve reliability. Treat the lowest score as a candidate bottleneck; confirm with failures, logs, or task outcomes before claiming causality.

### Produce a report

Use when the user wants a shareable assessment:

```bash
node skills/harness-creator/scripts/render-assessment-html.mjs --target /path/to/project
node skills/harness-creator/scripts/run-benchmark.mjs --target /path/to/project --html /path/to/report.html
```

Be clear that this is a structural benchmark. The benchmark first runs a self-check — it scaffolds a throwaway harness and validates it, proving the bundled scripts work end-to-end — then scores the target and eval coverage. Real effectiveness still needs before/after agent sessions on representative tasks.
````

</details>

#### 缺口

- 任务证据附着是否减少失败尚无数据
  **影响**：新方向仍是实验假设，不可算当前课程效果
  **进一步探讨**：选取真实失败样本和留出任务，记录机制成本和实际错误，再决定是否继续

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
