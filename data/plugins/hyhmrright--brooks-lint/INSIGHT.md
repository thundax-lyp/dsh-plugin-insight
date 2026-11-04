# Brooks Lint

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[17cdd1c](https://github.com/hyhmrright/brooks-lint/tree/17cdd1c7a6507e19bfaae821cb7847496f34a2dd)

<!-- BEGIN META -->
[![GitHub ★ 1,558](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C558&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyhmrright/brooks-lint) [![npm 30d 1,110](https://img.shields.io/static/v1?label=npm+30d&message=1%2C110&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/brooks-lint) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/brooks-lint)
<!-- END META -->

> **功能**：基于工程书籍整理代码质量评审技能，提供风险诊断、分数与多种审查模式。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示项目把工程方法与四段诊断接入代理技能；[Q04](#research-q04) 另提供可消费报告的 CI 链路，但不保证问题真实。

> **主要限制**：[Q03](#research-q03) 的健康分取决于配置与模型发现，解析保真不能证明代码正确；[Q04](#research-q04) 中 CI 只看到选定 diff，还需检查传输边界。

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
  - [Q01 · 谁会使用它，它比既有代码评审流程多做什么？](#detail-section-11)
  - [Q02 · DSH 如何发现技能并读取共享材料？](#detail-section-12)
  - [Q03 · 诊断格式、健康分数和现有评估能够证明什么？](#detail-section-13)
  - [Q04 · 交互式评审和 CI 路径的依赖、成本和停止条件是什么？](#detail-section-14)
  - [Q05 · 能提出什么可证伪的改进方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有代码评审流程的开发者可以用它组织 diff 或项目审查，再逐项核对源码、影响和建议。

人工评审、现有静态检查和通用模型均可发现部分问题；本包主要增加统一风险框架、来源说明与报告解析。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Review | 按风险分析代码或 diff | 模型结果需人工核源码 |
| 其他审查技能 | 检查架构、债务、测试和健康 | 本次未逐项审计或运行 |
| Sweep | 组织扫描与修改 | 指南要求事前同意并验证 |
| CI 评审 | 处理选定 diff 和报告门禁 | 仅 review，模型须接收 diff |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH skills 服务及 Node | DSH 使用需要 | 发现并加载技能 | 宿主兼容尚未实测 |
| 可访问的代码与模型 | 评审需要 | 产生并核对诊断 | 范围缺失不能证明完整评审 |
| Git、模型 SDK 与授权 | CI 路径需要 | 收集 diff 并调用模型 | 引用或服务不可用时失败 |
| 人工复核 | 采用结论需要 | 校验位置、影响和修法 | 格式合法不保证事实正确 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 开发者确定允许发送的代码范围 | 敏感或不完整时停止 |
| 加载 | 开发者选择 review 技能 | 宿主实际读取共享指南 |
| 评审 | 模型按风险生成诊断 | 核对每项位置、后果及替代解释 |
| 决定 | 维护者结合原有测试判断 | 无法复核时不凭分数合并 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主与模型接入费用未知 | 配置权限及确认 diff 范围 | 宿主未实测 |
| 持续 | 模型 token 与网络费用未知 | 审阅诊断及源码上下文 | 准确率和节时未对照 |
| 失败恢复 | 重跑和上下文采集资源未知 | 丢弃误报并重新核对 | 截断或缺引用应停止 |
| 修改和退出 | 模型及执行资源未知 | sweep 修改需复核和回退 | 权限与回滚依实际仓库 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 诊断结构 | Skill 要求四段依据 | 模型遵守与发现准确率 |
| 宿主发现 | provider 注册与共享路径接线 | 实际 DSH 加载和行为 |
| CI 解析 | 空 diff、截断和格式检查有实现 | 报告事实正确或完整覆盖 |

> **思考**：[Q03](#research-q03) 的健康分取决于配置与模型发现，解析保真不能证明代码正确；[Q04](#research-q04) 中 CI 只看到选定 diff，还需检查传输边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示项目把工程方法与四段诊断接入代理技能；[Q04](#research-q04) 另提供可消费报告的 CI 链路，但不保证问题真实。

[Q02](#research-q02) 的每技能资源目录与共享指南简化复用，读取失败显式返回；[Q04](#research-q04) 的输入选择和报告校验有清晰边界，不能代替语义评审。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的健康分取决于配置与模型发现，解析保真不能证明代码正确；[Q04](#research-q04) 中 CI 只看到选定 diff，还需检查传输边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先在允许外发的小 diff 试用 review 并保留人工评审；选区不全或发现无法核对时停止依据报告作决策。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持技能接线与报告处理的条件性判断；模型评审效果、宿主行为与新设想未验证。

- 已检查：作者 README、包清单、源码路径 package.json、lib/index.js、skills/brooks-review/SKILL.md、skills/brooks-sweep/SKILL.md、skills/_shared/common.md、README.md、scripts/ci-diff.mjs、scripts/ci-review.mjs、scripts/ci-gate.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：复核旧场景、机制、分发、成本、采用、价值、工程、贡献、质疑与假设；检查 provider、review 与共享规则、独立 CI diff、调用和门禁。未执行目标代码、测试、模型、宿主或远端 CI，其他模式仅核边界。
- 下一步：固定模型和插件版本，在隔离仓库比较 staged/unstaged、空 diff、截断及已知缺陷；记录真实宿主与人工复核结果。

**分析版本**

- **仓库**：[hyhmrright/brooks-lint](https://github.com/hyhmrright/brooks-lint)
- **版本号**：1.9.1（[固定提交 17cdd1c](https://github.com/hyhmrright/brooks-lint/tree/17cdd1c7a6507e19bfaae821cb7847496f34a2dd)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出为每项结论保留反例与适用例外的未验证设想；若盲测不降低误报或增加漏报及负担，就不采用。

固定模型和插件版本，在隔离仓库比较 staged/unstaged、空 diff、截断及已知缺陷；记录真实宿主与人工复核结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 122 | 18354 | — | — | 132284 |
| .mjs | source | 31 | 4064 | 2787 | 908 | — |
| .js | source | 2 | 189 | 123 | 54 | — |
| .mjs | test | 9 | 3528 | 2935 | 202 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/hyhmrright/brooks-lint/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查固定版本如何将评审方法接入 DSH 与 CI，区分报告格式和实际发现正确性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会使用它，它比既有代码评审流程多做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

开发者可以将已有代码或 diff 交给评审技能，按维护性风险组织问题，并要求每项提供现象、出处、后果与修法。人工评审、静态检查和通用模型也能发现部分问题；本项目把工程文献中的风险分类及共同报告格式接入多个代理工作流，便于读者逐条核对，而非提供一个确定性程序来证明代码正确。它另有架构、债务、测试、健康检查及可修改文件的 sweep 模式；不同模式的权限与覆盖不应混为一次只读评审。未有本轮同一代码任务的准确率、误报或净节时对照。

#### 证据与依据

**依据 1 · 作者声明**：[skills/brooks-review/SKILL.md:1-14](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/skills/brooks-review/SKILL.md#L1-L14)

评审技能面向已有代码或 diff，说明报告形式。

<details>
<summary>查看原文（14行）</summary>

```text
---
name: brooks-review
description: >
  PR code review that surfaces decay risks, design smells, and maintainability
  issues with concrete Symptom → Source → Consequence → Remedy findings, drawing
  on twelve classic engineering books.
  Triggers when: user asks to review code, check a PR, shares a diff or pastes
  code asking "does this look right?" / "any issues here?" / "ready to merge?",
  or asks for feedback on a function, class, or file.
  Also triggers when user mentions: code smells / refactoring / clean architecture /
  DDD / SOLID principles / Hyrum's Law / deep modules / tactical programming /
  conceptual integrity / Brooks's Law / Mythical Man-Month / second system effect.
  Do NOT trigger for: questions about how to write code from scratch, language syntax
  questions, or framework/tool questions where no existing code is shared.
```

</details>

**依据 2 · 作者声明**：[skills/brooks-review/SKILL.md:21-39](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/skills/brooks-review/SKILL.md#L21-L39)

载入共享方法并要求逐项分析。

<details>
<summary>查看原文（19行）</summary>

```text
## Setup

Read in order:

1. `../_shared/common.md` — Iron Law, Project Config, Report Template, Health Score
2. `../_shared/source-coverage.md` — book coverage, exceptions, tradeoffs
3. `../_shared/decay-risks.md` — symptom definitions and source attributions
4. `../_shared/test-decay-risks.md` — test risk definitions for the Quick Test Check
5. `pr-review-guide.md` (this directory) — the analysis process

## Process

**Scope:** if the user did not specify files or paste code, apply Auto Scope Detection
(`../_shared/common.md`) first.

1. Understand the review scope, then scan for each decay risk in the order specified (Steps 1–6 of the guide)
2. Run the Quick Test Check (Step 7 of the guide) — skip for docs-only or non-production changes
3. Apply the Iron Law to every finding
4. Output using the Report Template from common.md
```

</details>

**依据 3 · 作者声明**：[skills/_shared/common.md:6-14](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/skills/_shared/common.md#L6-L14)

四段诊断要求。

````text
## The Iron Law

```
NEVER suggest fixes before completing risk diagnosis.
EVERY finding must follow: Symptom → Source → Consequence → Remedy.
```

Violating this law produces reviews that list rule violations without explaining why they
matter. A finding without a consequence and a remedy is not a finding — it is noise.
````

**依据 4 · 作者声明**：[skills/brooks-sweep/SKILL.md:31-40](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/skills/brooks-sweep/SKILL.md#L31-L40)

sweep 要求同意并包含修改和验证。

<details>
<summary>查看原文（10行）</summary>

```text
## Process

**Scope:** if the user did not specify a project or directory, apply Auto Scope Detection
(`../_shared/common.md`) first.

1. Show the pre-flight consent notice and wait for one-time approval (Step 0 of the guide)
2. Enumerate scope and initialize pipeline state (Step 1 of the guide)
3. Run the four dimensions in sequence — review, test, debt, audit — each scanning, classifying, fixing, and verifying (Steps 2–5 of the guide)
4. Iterate over modified files and their consumers until a clean round or the cap (Step 6 of the guide)
5. Aggregate residual and unresolvable items and output the Full Sweep Report (Steps 7–8 of the guide)
```

</details>

#### 缺口

- 未针对相同变更对照人工、静态工具与模型
  **影响**：不能量化正确率、误报或节时
  **进一步探讨**：用带已知缺陷和合理例外的小 diff 做盲审并记录复核时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 如何发现技能并读取共享材料？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

包的 DSH bundle 入口注入 skills 服务，apply 在注册表安装 provider。provider 列出技能子目录并读取 SKILL.md，缺失文件的目录被跳过，其他读取错误或 frontmatter 缺失会报错；候选的 resourceBase 指向各技能目录，使 review 的 ../_shared 引用可按目录关系解析。get 再次读取候选正文。该接线可减少跨平台复制指南造成的漂移，但不能证明某个真实宿主会正确加载、模型会读完全套材料或遵循报告规则。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-24](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/package.json#L1-L24)

包入口、包含的 skills 与 DSH bundle 声明。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "brooks-lint",
  "version": "1.9.1",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "skills",
    "cordis.patch.yml",
    "README.md",
    "LICENSE",
    "bin",
    "scripts/install.sh",
    "scripts/npm-platforms.mjs"
  ],
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:62-68](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/lib/index.js#L62-L68)

解析 frontmatter 并在缺失时拒绝。

```text
function parseSkill(raw, path) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(raw);
	if (match === null) throw new Error(`${PROVIDER}: ${path} has no YAML frontmatter`);
	return {
		description: readDescription(match[1], path),
		content: raw.slice(match[0].length).trim()
	};
```

**依据 3 · 源码核查**：[lib/index.js:77-109](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/lib/index.js#L77-L109)

扫描子目录、错误处理与 resourceBase。

<details>
<summary>查看原文（33行）</summary>

```text
async function scan(assetRoot) {
	const entries = await readdir(assetRoot, { withFileTypes: true });
	const found = [];
	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		const directory = join(assetRoot, entry.name);
		const locator = join(directory, "SKILL.md");
		let raw;
		try {
			raw = await readFile(locator, "utf8");
		} catch (error) {
			if (error.code === "ENOENT") continue;
			throw new Error(`${PROVIDER}: failed to read ${locator}`, { cause: error });
		}
		const { description } = parseSkill(raw, locator);
		found.push({
			name: entry.name,
			description,
			invocation: {
				modelInvocable: true,
				userInvocable: true
			},
			provider: PROVIDER,
			source: "bundled",
			rank: RANK,
			resourceBase: {
				kind: "directory",
				path: directory.split(sep).join("/")
			},
			locator
		});
	}
	return found.sort((left, right) => left.name.localeCompare(right.name));
```

</details>

**依据 4 · 源码核查**：[lib/index.js:117-131](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/lib/index.js#L117-L131)

apply 注册 provider 并读取正文。

<details>
<summary>查看原文（15行）</summary>

```text
function apply(ctx, config = {}) {
	const assetRoot = config.assetRoot ?? fileURLToPath(new URL("../skills/", import.meta.url));
	const provider = {
		name: PROVIDER,
		list: () => scan(assetRoot),
		async get(candidate) {
			const { rank: _rank, locator, ...summary } = candidate;
			const { content } = parseSkill(await readFile(locator, "utf8"), locator);
			return {
				...summary,
				content
			};
		}
	};
	ctx.skills.registerProvider(() => provider);
```

</details>

**依据 5 · 作者声明**：[skills/brooks-review/SKILL.md:21-29](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/skills/brooks-review/SKILL.md#L21-L29)

review 依赖共享文档及本目录指南。

```text
## Setup

Read in order:

1. `../_shared/common.md` — Iron Law, Project Config, Report Template, Health Score
2. `../_shared/source-coverage.md` — book coverage, exceptions, tradeoffs
3. `../_shared/decay-risks.md` — symptom definitions and source attributions
4. `../_shared/test-decay-risks.md` — test risk definitions for the Quick Test Check
5. `pr-review-guide.md` (this directory) — the analysis process
```

#### 缺口

- 没有实际宿主加载或读取共享路径
  **影响**：不能确认真实版本和权限条件下可用
  **进一步探讨**：在隔离宿主验证注册目录、调用技能及共享资源读取。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 诊断格式、健康分数和现有评估能够证明什么？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

共享指南要求先依据实际后果定严重度，再按 strict、balanced 或 legacy-friendly 不同扣分规则从 100 扣分；同一发现集在不同配置下可以得到不同分数，且分数依赖模型找到并分级的项，不是独立代码质量真值。仓库 README 将 30 份冻结报告的解析保真与模型发现是否正确明确区分；文档所述评估是作者给定样本和方法，不是本次执行结果，也不能推广为实际生产召回率。指南可要求证据和后果，但生成质量仍需读代码与上下文人工审阅。

#### 证据与依据

**依据 1 · 作者声明**：[skills/_shared/common.md:23-53](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/skills/_shared/common.md#L23-L53)

先根据证据和影响定级，严厉程度调整扣分。

<details>
<summary>查看原文（31行）</summary>

```text
After completing each Iron Law diagnosis, choose severity from its evidenced
consequence and affected scope, before calculating the score. This calibration
governs every risk-specific severity guide and numeric smell threshold: a pattern,
ratio, file count, business label, or missing test is a diagnostic signal, not an
automatic severity assignment.

- **🔴 Critical:** evidence establishes serious impact and relevant exposure, such
  as data loss, security compromise, a widespread failure of an essential workflow,
  or an architectural/test barrier that makes a high-impact change unsafe. State
  the affected behavior, reach, and evidence in the Consequence. A hypothetical
  worst case or the risk code alone is insufficient.
- **🟡 Warning:** a demonstrated behavior defect, meaningful protection gap in
  changed behavior, or recurring change burden needs correction, but the evidence
  does not establish Critical impact. A bounded business-rule inconsistency or
  mocking the subject under test normally belongs here.
- **🟢 Suggestion:** a supported local maintainability or regression-protection
  improvement with limited evidenced impact. Missing tests in a small, isolated
  module alone may justify this tier; do not promote it merely because tests could
  prevent future bugs. Style preferences without a concrete consequence are not
  findings.

Distinguish a current defect from an additional recommendation to guard against its
recurrence. Do not inherit the defect's severity for that recommendation. Conversely,
do not downgrade an evidenced high-impact condition merely because its code is short.
If impact evidence is missing, state the limitation and use the lowest tier supported
by what was inspected; do not invent production scale, release exposure, or urgency.
Check each finding's title, emoji, prose, and score deduction for agreement.

Apply an explicit project `severity` override after this assessment and identify the
override when it changes the tier. `strictness` changes deduction weights and framing,
not the evidence threshold for Critical or the finding's severity.
```

</details>

**依据 2 · 作者声明**：[skills/_shared/common.md:270-281](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/skills/_shared/common.md#L270-L281)

三个预设对应不同扣分。

<details>
<summary>查看原文（12行）</summary>

```text
## Health Score Calculation

Base score: 100. Per-finding deductions depend on the `strictness` preset
(`balanced` is used when no preset is set):

| Preset | 🔴 Critical | 🟡 Warning | 🟢 Suggestion |
|--------|------------|-----------|--------------|
| `strict` | −20 | −8 | −2 |
| `balanced` (default) | −15 | −5 | −1 |
| `legacy-friendly` | −8 | −3 | −1 |

Floor: 0 (score cannot go below 0).
```

</details>

**依据 3 · 作者声明**：[README.md:214-232](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/README.md#L214-L232)

作者将冻结报告的解析保真与发现正确性区分。

<details>
<summary>查看原文（19行）</summary>

```text
### Reproducible benchmarks

The table above is illustrative. These numbers are **deterministic and you can reproduce them locally**:

**Parser fidelity** — SARIF export and the CI gates depend on parsing the model's Markdown report correctly. Against a **frozen corpus of 30 real, model-generated reports** spanning all six modes (`evals/benchmark-corpus.json`), each paired with an **independently graded** finding inventory (a separate model pass, spot-checked by hand), the shipped parser scores — run `npm run benchmark`:

| Metric (n = 30, frozen corpus) | Result |
|---|:---:|
| Exact severity-count match (parser vs. graded truth) | 30 / 30 |
| Risk-code precision / recall | 100% / 100% (56 finding-level codes, 0 FP / 0 FN) |
| Valid SARIF 2.1.0 emitted | 30 / 30 |

Because the parser is deterministic and the corpus is frozen, `npm run benchmark` gives everyone the same result, and `npm test` guards it as a regression. The corpus deliberately includes 9 false-positive / tradeoff reports (e.g. a ports-and-adapters design that *looks* like a dependency cycle) that must stay clean.

**Scoring determinism** — for a fixed finding set (2 Critical / 3 Warning / 1 Suggestion), the strictness presets produce exactly the scores their `common.md` table predicts: strict **34**, balanced **54**, legacy-friendly **74** — and only `legacy-friendly` leads with the top-three fixes.

**Eval contracts** — the **64-scenario eval suite** (`evals/evals.json`) checks scenario structure with `npm run evals` and model report structure/risk codes with `npm run evals:live` (requires `ANTHROPIC_API_KEY`). These deterministic checks do not establish semantic correctness. The API runner evaluates supplied fixtures in `review`, `audit`, `debt`, `test`, and `health`; it explicitly skips `sweep` in default runs, excludes it from pass rates, and rejects explicit selection. Full Sweep needs interactive execution. See [runner contracts](docs/runner-contracts.md).

> Scope & honesty: the parser numbers are deterministic and exactly reproducible. The strictness and eval-suite figures are single-run live measurements against the model and vary slightly run to run. The parser benchmark measures report-parsing fidelity (does the tooling read every finding the report states?), not whether a given finding is "correct." The severity-count match is the fully independent signal; risk-code agreement also reflects the shared canonical name→code legend.
```

</details>

#### 缺口

- 未执行基准或同任务语义评审
  **影响**：无法宣称本次验证分数、准确率或真实代码质量
  **进一步探讨**：固定版本先验证评估范围，再以专家独立标注检查实际发现。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 交互式评审和 CI 路径的依赖、成本和停止条件是什么？

**研究主题**：功能与机制、依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

交互路径需要兼容 DSH skills 服务、模型和被审代码；包声明 Node 20 以上。独立 CI 路径读取 Git diff，默认非 PR 时先选暂存 diff，有则不会同时读取未暂存部分；PR 从事件或显式参数取得 base/head，缺引用会报错，空 diff 返回 skipped 和 null 分数。它将 diff 和指南发送给 Anthropic SDK，拒绝截断或格式无效的报告，门禁还检查解析结果与分数一致；这些检查确保报告可消费，不验证诊断事实。首次需要配置服务和范围，持续可能产生模型调用费用并需人工核实，失败需重新获取上下文或修复环境，具体金额和时间未知。先对允许发送的非敏感小 diff 试用；范围不全、引用无法核实、模型输出被截断或敏感数据不可外发时停止依赖该结果，回到人工评审与静态工具。sweep 另有修改代码、确认与验证流程，不应默认为只读。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:70-72](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/package.json#L70-L72)

声明 Node 环境要求。

```text
  "engines": {
    "node": ">=20"
  },
```

**依据 2 · 源码核查**：[scripts/ci-diff.mjs:18-35](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/scripts/ci-diff.mjs#L18-L35)

PR 来源以及本地暂存优先和空 diff 判定。

<details>
<summary>查看原文（18行）</summary>

```text
  const isPR = env.GITHUB_EVENT_NAME?.startsWith("pull_request") || Boolean(env.GITHUB_BASE_REF);
  if (isPR) {
    let pr;
    if (env.GITHUB_EVENT_PATH) {
      try { pr = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, "utf8")).pull_request; }
      catch (error) { throw new Error("Cannot read GitHub pull request event", { cause: error }); }
    }
    baseRef ??= pr?.base?.sha;
    headRef ??= pr?.head?.sha;
    if (!baseRef || !headRef) throw new Error("PR review requires base/head SHAs from the GitHub event or explicit --base-ref and --head-ref.");
  }
  const result = (diff, scope, base = null) => ({ status: diff.trim() ? "ready" : "skipped", diff, scope, baseRef: base });
  const diff = (...args) => git("diff", "--no-ext-diff", "--no-textconv", ...args);
  if (!isPR && baseRef === undefined && headRef === undefined) {
    const staged = diff("--cached");
    if (staged.trim()) return result(staged, "staged changes (git diff --cached)");
    const unstaged = diff();
    if (unstaged.trim()) return result(unstaged, "unstaged changes (git diff)");
```

</details>

**依据 3 · 源码核查**：[scripts/ci-diff.mjs:43-51](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/scripts/ci-diff.mjs#L43-L51)

解析基线和 head，diff 不可用报错。

```text
    if (!baseRef) throw new Error("No comparison base is available. Fetch the base or pass --base-ref explicitly.");
  }
  headRef ??= "HEAD";
  const base = resolve(baseRef);
  const head = resolve(headRef);
  try {
    return result(diff(`${base}...${head}`), `branch changes ${baseRef}...${headRef}`, base);
  } catch (error) {
    throw new Error(`Cannot read diff ${baseRef}...${headRef}; fetch complete history and a common ancestor.`, { cause: error });
```

**依据 4 · 源码核查**：[scripts/ci-review.mjs:85-96](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/scripts/ci-review.mjs#L85-L96)

空 diff 显式跳过并返回 null。

<details>
<summary>查看原文（12行）</summary>

```text
// ── Main ──────────────────────────────────────────────────────────────────────
let input;
try { input = readCiDiff({ projectDir, baseRef: args["base-ref"], headRef: args["head-ref"] }); }
catch (error) { console.error(JSON.stringify({ error: error.message, mode })); process.exit(1); }
const { diff, scope } = input;
if (input.status === "skipped") {
  if (format === "sarif") {
    console.error("No diff to review; SARIF was not generated.");
  } else {
    console.log(JSON.stringify({ status: "skipped", reason: "No changes in the selected diff", report: "", score: null, mode, scope, findings: { critical: 0, warning: 0, suggestion: 0 } }));
  }
  process.exit(0);
```

</details>

**依据 5 · 源码核查**：[scripts/ci-review.mjs:119-157](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/scripts/ci-review.mjs#L119-L157)

将 diff 送模型并拒绝截断或无效结果。

<details>
<summary>查看原文（39行）</summary>

```text
const systemBlocks = [
  { type: "text", text: assembleSystemPrompt(mode, skillsDir) },
  { type: "text", text: configSystemBlock(projectConfig) },
  { type: "text", text: runnerInstructions("ci") },
];

// common.md makes custom-risks-guide.md a conditional read; CI has no on-demand
// read, so the condition has to be mirrored here or `Cx` codes arrive undefined.
if (projectConfig.content && hasCustomRisks(projectConfig.content)) {
  const guide = customRisksBlock(skillsDir);
  if (guide) systemBlocks.push({ type: "text", text: guide });
}

const userMessage = `Run brooks-lint ${mode} mode on the following diff.\n\nScope: ${scope}\n\n\`\`\`diff\n${diff}\n\`\`\``;

let message;
try {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  message = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemBlocks,
    messages: [{ role: "user", content: userMessage }],
  });
} catch (err) {
  console.error(JSON.stringify({ error: err.message, mode, scope }, null, 2));
  process.exit(1);
}

// Truncation is diagnostic output only; it cannot produce a passing CI result.
const truncated = warnIfTruncated(message);

const report = message.content.filter((block) => block.type === "text").map((block) => block.text).join("\n");

const parsed = parseReport(report, { mode });
if (truncated || !parsed.valid) {
  console.error(JSON.stringify({ status: "incomplete", error: truncated ? "Model response was truncated" : "Invalid review report", errors: parsed.errors, mode, scope, report }));
  process.exit(1);
```

</details>

**依据 6 · 源码核查**：[scripts/ci-gate.mjs:45-53](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/scripts/ci-gate.mjs#L45-L53)

门禁区分跳过与不完整报告。

```text
  if (report.status === "skipped") {
    console.log("brooks-lint skipped: no diff to review; no score or quality verdict.");
    process.exit(0);
  }
  const parsed = parseReport(report.report, { mode: report.mode });
  if (report.truncated || !parsed.valid || parsed.score !== report.score ||
      (report.status && report.status !== "complete")) {
    console.error("Quality gates require a complete, valid report and matching score.");
    process.exit(1);
```

**依据 7 · 作者声明**：[skills/brooks-sweep/SKILL.md:31-40](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/skills/brooks-sweep/SKILL.md#L31-L40)

sweep 模式含事前同意、修改与验证。

<details>
<summary>查看原文（10行）</summary>

```text
## Process

**Scope:** if the user did not specify a project or directory, apply Auto Scope Detection
(`../_shared/common.md`) first.

1. Show the pre-flight consent notice and wait for one-time approval (Step 0 of the guide)
2. Enumerate scope and initialize pipeline state (Step 1 of the guide)
3. Run the four dimensions in sequence — review, test, debt, audit — each scanning, classifying, fixing, and verifying (Steps 2–5 of the guide)
4. Iterate over modified files and their consumers until a clean round or the cap (Step 6 of the guide)
5. Aggregate residual and unresolvable items and output the Full Sweep Report (Steps 7–8 of the guide)
```

</details>

#### 缺口

- 未运行 DSH、模型、CI 或真实供应商
  **影响**：无法证明宿主兼容、实际报告质量和服务费用
  **进一步探讨**：在隔离仓库试验 staged/unstaged、空 diff、截断以及人工标注案例。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能提出什么可证伪的改进方向？

**研究主题**：新假设与验证

#### 完整回答

可探索要求每项评审结论显式列出最可能使其不成立的项目约束或合理例外，并把这项内容与证据和后果一起展示。现有诊断已要求现象、出处、后果和修法，也按影响校准严重度；新增部分是将反证和例外作为固定可比较对象，而不是声称现有指南从不考虑取舍。以已知合理例外的 PR 和已知缺陷对照盲审，记录误报、漏报与复核时间；若仅增加篇幅、未降低误报或明显增加漏报与耗时，就否定此方案。尚无实现与实验。

#### 证据与依据

**依据 1 · 作者声明**：[skills/_shared/common.md:6-14](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/skills/_shared/common.md#L6-L14)

已有四段诊断。

````text
## The Iron Law

```
NEVER suggest fixes before completing risk diagnosis.
EVERY finding must follow: Symptom → Source → Consequence → Remedy.
```

Violating this law produces reviews that list rule violations without explaining why they
matter. A finding without a consequence and a remedy is not a finding — it is noise.
````

**依据 2 · 作者声明**：[skills/_shared/common.md:23-48](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/skills/_shared/common.md#L23-L48)

已有按实际影响分级及缺证据时的约束。

<details>
<summary>查看原文（26行）</summary>

```text
After completing each Iron Law diagnosis, choose severity from its evidenced
consequence and affected scope, before calculating the score. This calibration
governs every risk-specific severity guide and numeric smell threshold: a pattern,
ratio, file count, business label, or missing test is a diagnostic signal, not an
automatic severity assignment.

- **🔴 Critical:** evidence establishes serious impact and relevant exposure, such
  as data loss, security compromise, a widespread failure of an essential workflow,
  or an architectural/test barrier that makes a high-impact change unsafe. State
  the affected behavior, reach, and evidence in the Consequence. A hypothetical
  worst case or the risk code alone is insufficient.
- **🟡 Warning:** a demonstrated behavior defect, meaningful protection gap in
  changed behavior, or recurring change burden needs correction, but the evidence
  does not establish Critical impact. A bounded business-rule inconsistency or
  mocking the subject under test normally belongs here.
- **🟢 Suggestion:** a supported local maintainability or regression-protection
  improvement with limited evidenced impact. Missing tests in a small, isolated
  module alone may justify this tier; do not promote it merely because tests could
  prevent future bugs. Style preferences without a concrete consequence are not
  findings.

Distinguish a current defect from an additional recommendation to guard against its
recurrence. Do not inherit the defect's severity for that recommendation. Conversely,
do not downgrade an evidenced high-impact condition merely because its code is short.
If impact evidence is missing, state the limitation and use the lowest tier supported
by what was inspected; do not invent production scale, release exposure, or urgency.
```

</details>

**依据 3 · 作者声明**：[README.md:218-230](https://github.com/hyhmrright/brooks-lint/blob/17cdd1c7a6507e19bfaae821cb7847496f34a2dd/README.md#L218-L230)

作者的冻结语料包含合理例外，但衡量的是解析和评估契约。

<details>
<summary>查看原文（13行）</summary>

```text
**Parser fidelity** — SARIF export and the CI gates depend on parsing the model's Markdown report correctly. Against a **frozen corpus of 30 real, model-generated reports** spanning all six modes (`evals/benchmark-corpus.json`), each paired with an **independently graded** finding inventory (a separate model pass, spot-checked by hand), the shipped parser scores — run `npm run benchmark`:

| Metric (n = 30, frozen corpus) | Result |
|---|:---:|
| Exact severity-count match (parser vs. graded truth) | 30 / 30 |
| Risk-code precision / recall | 100% / 100% (56 finding-level codes, 0 FP / 0 FN) |
| Valid SARIF 2.1.0 emitted | 30 / 30 |

Because the parser is deterministic and the corpus is frozen, `npm run benchmark` gives everyone the same result, and `npm test` guards it as a regression. The corpus deliberately includes 9 false-positive / tradeoff reports (e.g. a ports-and-adapters design that *looks* like a dependency cycle) that must stay clean.

**Scoring determinism** — for a fixed finding set (2 Critical / 3 Warning / 1 Suggestion), the strictness presets produce exactly the scores their `common.md` table predicts: strict **34**, balanced **54**, legacy-friendly **74** — and only `legacy-friendly` leads with the top-three fixes.

**Eval contracts** — the **64-scenario eval suite** (`evals/evals.json`) checks scenario structure with `npm run evals` and model report structure/risk codes with `npm run evals:live` (requires `ANTHROPIC_API_KEY`). These deterministic checks do not establish semantic correctness. The API runner evaluates supplied fixtures in `review`, `audit`, `debt`, `test`, and `health`; it explicitly skips `sweep` in default runs, excludes it from pass rates, and rejects explicit selection. Full Sweep needs interactive execution. See [runner contracts](docs/runner-contracts.md).
```

</details>

#### 缺口

- 反证字段设计未实现或评估
  **影响**：不能声称减少误报或工作量
  **进一步探讨**：预先设置已知缺陷和合理例外，盲测误报漏报及总复核时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
