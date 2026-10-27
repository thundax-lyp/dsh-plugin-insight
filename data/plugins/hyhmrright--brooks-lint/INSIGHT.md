# brooks-lint

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[15fa2d4](https://github.com/hyhmrright/brooks-lint/tree/15fa2d49877969f65a25b9f05897cd72fae32d33)

<!-- BEGIN META -->
[![GitHub ★ 1,546](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C546&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyhmrright/brooks-lint) [![npm 30d 582](https://img.shields.io/static/v1?label=npm+30d&message=582&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/brooks-lint) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/brooks-lint)
<!-- END META -->

> **实现功能**：以十二本工程经典的风险框架组织代码、架构和测试评审，提供六种 Agent Skills 模式。

> **核心亮点**：把既有工程书目与风险分类组织成症状—出处—后果—修法的评审流程，便于人工核对，不是新静态分析器。见[Q01](#research-q01)。

> **风险与缺陷**：冻结报告解析保真不等于发现正确；Health Score随范围和权重变化，不能当代码质量真值或DSH实测。见[Q03](#research-q03)。

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
  - [Q01 · 经典书目驱动的评审Skill为谁提供什么增量？](#detail-section-11)
  - [Q02 · DSH如何发现并执行这些Skill约束？](#detail-section-12)
  - [Q03 · 分数和基准能证明评审准确与低成本吗？](#detail-section-13)
  - [Q04 · 什么受控试用与未验证改进有依据？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有模型评审流程的开发者可用一致诊断结构检查非敏感小diff。

同模型原生PR提示与静态lint分别作为语义评审和确定性检查基线；不将不同模型评估混在一起。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| PR Review Skill | 诊断小diff维护风险 | 模型读共享框架，人工核结果 |
| Skill资源provider | 挂载六模式与共享资源 | DSH skills接口，未验真实加载 |
| Health Score | 汇总当前报告严重性 | 依范围和strictness，不是真实质量验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=20与DSH skills服务 | npm/DSH必需 | provider注册 | 安装不等于技能已加载 |
| 可读代码与共享指南 | 评审必需 | 给出本例诊断 | 不据书目名称编造发现 |
| 具备上下文能力的模型 | 必需 | 执行语义评审 | 输出质量不保证 |
| 人工核对 | 采用必需 | 排除误报和不当重构 | 不用分数自动放行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份工作区并核DSH Skill | review和共享资源可读 |
| 运行 | 用户选小diff和固定配置执行review | 发现有真实代码/后果/修法 |
| 验收 | 开发者逐项检查来源和例外 | 接受可执行发现，拒绝分数驱动重构 |
| 退出 | 用户停止调用或移除包 | 恢复原评审/静态lint，核历史文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包/Skill与模型接入；金额未知 | 核技能加载、配置和diff范围 | DSH真实运行未验 |
| 持续使用 | 指南上下文和模型调用；token/金额未知 | 核出处、后果和修法 | 无准确率/净节时对照 |
| 失败恢复 | 重跑与人工复核资源 | 丢弃误报、恢复代码/历史文件 | review外修复模式另有写入风险 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 诊断一致结构 | Skill要求四段发现链 | 模型遵守与发现正确率 |
| DSH加载 | provider与资源目录接线 | 实际宿主读取/触发 |
| 评分 | 严重性扣分规则 | 真实代码质量与跨项目可比性 |

> **思考**：冻结报告解析保真不等于发现正确；Health Score随范围和权重变化，不能当代码质量真值或DSH实测。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把既有工程书目与风险分类组织成症状—出处—后果—修法的评审流程，便于人工核对，不是新静态分析器。见[Q01](#research-q01)。

把既有工程书目与风险分类组织成症状—出处—后果—修法的评审流程，便于人工核对，不是新静态分析器。见[Q01](#research-q01)。

共享指南与每Skill resourceBase避免复制分叉，frontmatter错误显式失败便于维护；模型遵守仍无强制执行门槛，移植需验技能资源读取，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

冻结报告解析保真不等于发现正确；Health Score随范围和权重变化，不能当代码质量真值或DSH实测。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用小diff的review模式，保留人工评审与静态lint；不要凭健康分自动改代码或合并。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Skill注册与诊断要求有固定材料；真实发现准确性和DSH加载未验，反例槽属于未验证改进。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、cordis.patch.yml、skills/brooks-review/SKILL.md、skills/_shared/common.md、scripts/run-evals-live.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查DSH provider、review模式与共享框架及live评估入口；其余模式未逐条执行，未跑目标测试/模型/宿主。
- 下一步：固定同一批小PR、模型、预算和strictness，统计被接受发现、误报、引文准确性及复核时间；解析保真单独报告。

**分析版本**

- **仓库**：[hyhmrright/brooks-lint](https://github.com/hyhmrright/brooks-lint)
- **版本号**：1.9.1（[固定提交 15fa2d4](https://github.com/hyhmrright/brooks-lint/tree/15fa2d49877969f65a25b9f05897cd72fae32d33)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是每项发现显式记录反例与本例取舍，比较合理例外PR的误报和复核时间；只增篇幅无净收益则停止。见[Q04](#research-q04)。

固定同一批小PR、模型、预算和strictness，统计被接受发现、误报、引文准确性及复核时间；解析保真单独报告。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 117 | 17847 | — | — | 127130 |
| .mjs | source | 27 | 3578 | 2306 | 904 | — |
| .js | source | 2 | 189 | 123 | 54 | — |
| .mjs | test | 6 | 2592 | 2057 | 202 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hyhmrright/brooks-lint/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/hyhmrright/brooks-lint/issues?q=is%3Aissue+created%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/hyhmrright/brooks-lint/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查书目评审框架相对自写提示的增量、DSH技能加载及评估边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 经典书目驱动的评审Skill为谁提供什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户是已经用模型做PR评审、希望结构性问题能说清症状、原则出处、后果和修法的开发者。合格发现必须对应具体代码和后果，可由评审人接受或驳回，不是仅产生健康分。相对自己写“注意可维护性”的提示，它提供生产/测试风险分类、模式化流程和共享例外/取舍材料；相对ESLint等确定性规则，它依赖模型理解架构和领域，不替代语法/规则lint。作者十二书目的来源映射是对既有工程思想的组织，不能算新理论，也不能以引文增加证明发现正确。其可借鉴贡献是让建议必须经过诊断并以统一证据链交付。

#### 证据与依据

**依据 1 · 源码核查**：[skills/brooks-review/SKILL.md:22-40](https://github.com/hyhmrright/brooks-lint/blob/15fa2d49877969f65a25b9f05897cd72fae32d33/skills/brooks-review/SKILL.md#L22-L40)

先读共享框架、来源与风险再完成诊断

<details>
<summary>查看原文（19行）</summary>

```text

Read in order:

1. `../_shared/common.md` — Iron Law, Project Config, Report Template, Health Score
2. `../_shared/source-coverage.md` — book coverage, exceptions, tradeoffs
3. `../_shared/decay-risks.md` — symptom definitions and source attributions
4. `pr-review-guide.md` (this directory) — the analysis process

## Process

**Scope:** if the user did not specify files or paste code, apply Auto Scope Detection
(`../_shared/common.md`) first.

1. Understand the review scope, then scan for each decay risk in the order specified (Steps 1–6 of the guide)
2. Run the Quick Test Check (Step 7 of the guide) — skip for docs-only or non-production changes
3. Apply the Iron Law to every finding
4. Output using the Report Template from common.md

**Mode line in report:** `PR Review`
```

</details>

**依据 2 · 源码核查**：[skills/_shared/common.md:6-14](https://github.com/hyhmrright/brooks-lint/blob/15fa2d49877969f65a25b9f05897cd72fae32d33/skills/_shared/common.md#L6-L14)

每项发现要求症状/来源/后果/修法

````text
## The Iron Law

```
NEVER suggest fixes before completing risk diagnosis.
EVERY finding must follow: Symptom → Source → Consequence → Remedy.
```

Violating this law produces reviews that list rule violations without explaining why they
matter. A finding without a consequence and a remedy is not a finding — it is noise.
````

**依据 3 · 作者声明**：[README.md:230-232](https://github.com/hyhmrright/brooks-lint/blob/15fa2d49877969f65a25b9f05897cd72fae32d33/README.md#L230-L232)

作者主动区分模型质量和解析保真

```text
**Model quality** — whether the model finds the *right* risks on real code is measured by the **58-scenario eval suite** (`evals/evals.json`): `npm run evals` (structural) and `npm run evals:live` (live, needs `ANTHROPIC_API_KEY`).

> Scope & honesty: the parser numbers are deterministic and exactly reproducible. The strictness and eval-suite figures are single-run live measurements against the model and vary slightly run to run. The parser benchmark measures report-parsing fidelity (does the tooling read every finding the report states?), not whether a given finding is "correct." The severity-count match is the fully independent signal; risk-code agreement also reflects the shared canonical name→code legend.
```

#### 缺口

- 与同模型简短评审提示的有效发现率对照缺失
  **影响**：不能确认书目框架提高真实代码质量
  **进一步探讨**：同一批小PR以同模型和预算比较可执行且被接受的发现、误报及复核时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH如何发现并执行这些Skill约束？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

根清单声明DSH bundle，patch加载brooks-lint-skills行；lib注入skills，扫描每个子目录的SKILL.md，解析frontmatter描述并创建modelInvocable/userInvocable候选，resourceBase是该Skill目录。get时重读正文，因此相对路径../_shared保持目录语义，避免人工复制遗漏共享资源。注册的是六种评审模式的提示资源，不是六个模型工具或独立Agent定义；要求模型先读共享指南及应用Iron Law属于执行指令，provider没有强制检查模型最后报告是否遵守。代码把缺失SKILL跳过、其他读取错误抛出，描述缺失则失败，可解释包装完整性，但运行时加载仍取决于DSH技能接口与实际文件分发。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:77-109](https://github.com/hyhmrright/brooks-lint/blob/15fa2d49877969f65a25b9f05897cd72fae32d33/lib/index.js#L77-L109)

扫描、候选调用类型与resourceBase

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

**依据 2 · 源码核查**：[lib/index.js:117-131](https://github.com/hyhmrright/brooks-lint/blob/15fa2d49877969f65a25b9f05897cd72fae32d33/lib/index.js#L117-L131)

list/get及registerProvider

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

**依据 3 · 源码核查**：[skills/brooks-review/SKILL.md:22-40](https://github.com/hyhmrright/brooks-lint/blob/15fa2d49877969f65a25b9f05897cd72fae32d33/skills/brooks-review/SKILL.md#L22-L40)

实际审阅约束由模型读取指南执行

<details>
<summary>查看原文（19行）</summary>

```text

Read in order:

1. `../_shared/common.md` — Iron Law, Project Config, Report Template, Health Score
2. `../_shared/source-coverage.md` — book coverage, exceptions, tradeoffs
3. `../_shared/decay-risks.md` — symptom definitions and source attributions
4. `pr-review-guide.md` (this directory) — the analysis process

## Process

**Scope:** if the user did not specify files or paste code, apply Auto Scope Detection
(`../_shared/common.md`) first.

1. Understand the review scope, then scan for each decay risk in the order specified (Steps 1–6 of the guide)
2. Run the Quick Test Check (Step 7 of the guide) — skip for docs-only or non-production changes
3. Apply the Iron Law to every finding
4. Output using the Report Template from common.md

**Mode line in report:** `PR Review`
```

</details>

#### 缺口

- 固定DSH上的加载、共享资源读取与触发未运行
  **影响**：注册源码不等于宿主实际执行约束
  **进一步探讨**：在临时profile核一个review模式及共享文件引用，检查最终发现是否完整可回查

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 分数和基准能证明评审准确与低成本吗？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

不能。共享Health Score从100按发现严重性扣分，strictness改变扣分权重，禁用/ignore/focus也改变被检查范围；因此不同配置或PR不能直接按分数比较代码真实质量。README高精度数字主要是冻结报告解析保真，作者明确不衡量发现正确；live eval调用Anthropic模型，不能迁移为DSH当前模型实测。首次需安装npm/Skill并确认Node>=20与DSH skills服务，持续会消费模型上下文、读取指南及人工核实引用与后果；具体token、金额和工时未知。模型可能将一般原则过度应用，人工应对具体发现检查反例。流程还尝试写.brooks-lint-history.json，且修复模式/Full Sweep可能改代码，应先限制为review和小diff，保存工作区，不能把所有模式当只读lint。失败可回到原生评审提示和确定性lint，不以低健康分强制返工。

#### 证据与依据

**依据 1 · 源码核查**：[skills/_shared/common.md:33-56](https://github.com/hyhmrright/brooks-lint/blob/15fa2d49877969f65a25b9f05897cd72fae32d33/skills/_shared/common.md#L33-L56)

范围筛选和strictness改变报告与扣分

<details>
<summary>查看原文（24行）</summary>

```text
**`disable`** — list of risk codes to skip entirely. Findings for disabled risks are
silently omitted from the report and do not affect the Health Score.
Valid codes: `R1` `R2` `R3` `R4` `R5` `R6` `T1` `T2` `T3` `T4` `T5` `T6`

**`severity`** — override the severity of a specific risk for this project.
Valid values: `critical` `warning` `suggestion`
Example: `R1: suggestion` means every R1 finding is downgraded to Suggestion regardless
of what the guide says.

**`ignore`** — list of glob patterns. Files matching any pattern are excluded from
analysis. Findings that arise solely from ignored files are omitted.
Common entries: `**/*.generated.*`, `**/vendor/**`, `**/migrations/**`

**`focus`** — non-empty list of risk codes to evaluate; all others are skipped.
Omit this key (or leave it empty) to evaluate all non-disabled risks.
Cannot be combined with a non-empty `disable` list.

**`strictness`** — tune how harshly findings are scored, for teams at different
maturity stages. One of:
- `strict` — heavier deductions; for teams holding a high bar.
- `balanced` — the default, used when the key is absent.
- `legacy-friendly` — lighter deductions, and the Summary leads with the three
  highest-leverage fixes so a legacy codebase's first run is not a demoralizing
  wall of Criticals. Every finding is still reported — only the score and framing soften.
```

</details>

**依据 2 · 源码核查**：[skills/_shared/common.md:214-230](https://github.com/hyhmrright/brooks-lint/blob/15fa2d49877969f65a25b9f05897cd72fae32d33/skills/_shared/common.md#L214-L230)

扣分权重与历史记录写入

<details>
<summary>查看原文（17行）</summary>

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

## History Tracking

After generating the Health Score, attempt to append a record to `.brooks-lint-history.json`
in the project root.
```

</details>

**依据 3 · 作者声明**：[README.md:223-232](https://github.com/hyhmrright/brooks-lint/blob/15fa2d49877969f65a25b9f05897cd72fae32d33/README.md#L223-L232)

解析基准与真实模型评估边界

<details>
<summary>查看原文（10行）</summary>

```text
| Risk-code precision / recall | 100% / 100% (56 finding-level codes, 0 FP / 0 FN) |
| Valid SARIF 2.1.0 emitted | 30 / 30 |

Because the parser is deterministic and the corpus is frozen, `npm run benchmark` gives everyone the same result, and `npm test` guards it as a regression. The corpus deliberately includes 9 false-positive / tradeoff reports (e.g. a ports-and-adapters design that *looks* like a dependency cycle) that must stay clean.

**Scoring determinism** — for a fixed finding set (2 Critical / 3 Warning / 1 Suggestion), the strictness presets produce exactly the scores their `common.md` table predicts: strict **34**, balanced **54**, legacy-friendly **74** — and only `legacy-friendly` leads with the top-three fixes.

**Model quality** — whether the model finds the *right* risks on real code is measured by the **58-scenario eval suite** (`evals/evals.json`): `npm run evals` (structural) and `npm run evals:live` (live, needs `ANTHROPIC_API_KEY`).

> Scope & honesty: the parser numbers are deterministic and exactly reproducible. The strictness and eval-suite figures are single-run live measurements against the model and vary slightly run to run. The parser benchmark measures report-parsing fidelity (does the tooling read every finding the report states?), not whether a given finding is "correct." The severity-count match is the fully independent signal; risk-code agreement also reflects the shared canonical name→code legend.
```

</details>

**依据 4 · 源码核查**：[scripts/run-evals-live.mjs:23-29](https://github.com/hyhmrright/brooks-lint/blob/15fa2d49877969f65a25b9f05897cd72fae32d33/scripts/run-evals-live.mjs#L23-L29)

live模型默认来自Anthropic，非DSH宿主验收

```text
const root = path.resolve(__dirname, "..");

const args = parseArgs(process.argv.slice(2));
const filterRisk = args.risk ?? null;
const filterId   = args.id ? parseInt(args.id, 10) : null;
const filterMode = args.mode ?? null;
const model      = args.model ?? "claude-sonnet-4-6";
```

#### 缺口

- 同模型有效发现、引文准确率、token与复核时间未知
  **影响**：不支持准确率/节时或低成本承诺
  **进一步探讨**：固定配置与diff，分别报告被接受发现、误报、引用核对时间和总调用消耗

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么受控试用与未验证改进有依据？

**研究主题**：采用判断、新假设与验证

#### 完整回答

已有模型评审工作流的开发者可在备份的非敏感小diff上只用review模式，要求每项发现指出真实代码、可观察后果和可执行修法。与原生评审提示相比可获得统一诊断/来源结构，但人工复核不能省略；若引文无法定位、后果只是泛泛原则、要求为分数而重构，则停止应用建议并退回团队规则和静态lint。由格式正确与语义正确分离可推导未验证设计：每项报告增加反例/相邻方案取舍的证据槽，评审者可直接拒绝“原则正确但本例不适用”的发现。最小验证在含合理例外的同一批PR上比较现有框架与反例槽的误报、接受发现和人工时间；若只增加篇幅或抑制真问题而未改善净复核成本，则不推广。新增槽不应成为另一份固定问卷或伪造书籍原文。

#### 证据与依据

**依据 1 · 源码核查**：[skills/_shared/common.md:6-14](https://github.com/hyhmrright/brooks-lint/blob/15fa2d49877969f65a25b9f05897cd72fae32d33/skills/_shared/common.md#L6-L14)

已有诊断链可扩展反例槽

````text
## The Iron Law

```
NEVER suggest fixes before completing risk diagnosis.
EVERY finding must follow: Symptom → Source → Consequence → Remedy.
```

Violating this law produces reviews that list rule violations without explaining why they
matter. A finding without a consequence and a remedy is not a finding — it is noise.
````

**依据 2 · 作者声明**：[README.md:226-232](https://github.com/hyhmrright/brooks-lint/blob/15fa2d49877969f65a25b9f05897cd72fae32d33/README.md#L226-L232)

已有tradeoff语料与语义质量分离为推导依据

```text
Because the parser is deterministic and the corpus is frozen, `npm run benchmark` gives everyone the same result, and `npm test` guards it as a regression. The corpus deliberately includes 9 false-positive / tradeoff reports (e.g. a ports-and-adapters design that *looks* like a dependency cycle) that must stay clean.

**Scoring determinism** — for a fixed finding set (2 Critical / 3 Warning / 1 Suggestion), the strictness presets produce exactly the scores their `common.md` table predicts: strict **34**, balanced **54**, legacy-friendly **74** — and only `legacy-friendly` leads with the top-three fixes.

**Model quality** — whether the model finds the *right* risks on real code is measured by the **58-scenario eval suite** (`evals/evals.json`): `npm run evals` (structural) and `npm run evals:live` (live, needs `ANTHROPIC_API_KEY`).

> Scope & honesty: the parser numbers are deterministic and exactly reproducible. The strictness and eval-suite figures are single-run live measurements against the model and vary slightly run to run. The parser benchmark measures report-parsing fidelity (does the tooling read every finding the report states?), not whether a given finding is "correct." The severity-count match is the fully independent signal; risk-code agreement also reflects the shared canonical name→code legend.
```

#### 缺口

- 反例槽的净收益未经测试
  **影响**：仅为未验证设计，不记当前贡献
  **进一步探讨**：同模型预算与固定PR集对照人工接受/拒绝理由，再决定是否修改指南

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
