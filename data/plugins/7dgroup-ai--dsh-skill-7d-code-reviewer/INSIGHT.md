# 7d-code-reviewer

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[bd0069f](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/tree/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057)

<!-- BEGIN META -->
[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer)
<!-- END META -->

> **实现功能**：一个注册到 DSH skills 的模板驱动代码审查 Skill，要求模型输出分级问题、评分与文字/HTML 报告。

> **核心亮点**：封装五步审查、严重度/四维评分和报告样式，使输出结构一致。详见[Q01](#research-q01)。

> **风险与缺陷**：没有确定性报告渲染器，动态 HTML 转义/占位符完整性只是 Skill 文本要求；评分无校准。详见[Q02](#research-q02)。

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
  - [Q01 · 插件提供何种代码审查能力？](#detail-section-11)
  - [Q02 · HTML 报告的安全与完整性由谁保证？](#detail-section-12)
  - [Q03 · 分级评分适用何种审查？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：团队希望用统一结构辅助审阅代码改动和整理可读报告。

人工代码审查或通用模型直接审查；该包提供固定提示和模板。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 审查 Skill | 分级评分 | 模型判断 |
| HTML 模板 | 归档展示 | 无程序转义 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH skills registry 与可读代码 | 必需 | 挂载 Skill 并提供审查材料 | 无法触发该流程 |
| 模型与人工审阅 | 完成审查必需 | 按规则生成判断并核证据 | 模板本身不能检测缺陷 |
| 可写报告目录 | 仅生成 HTML 时 | 保存报告 | 须另选输出位置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 限定 diff | 明确文件/行 | 范围可核 |
| 审查 | 逐项证据 | 可复现 |
| 报告 | 检占位/转义 | 安全可读 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH skills registry、模型和可读代码；许可/模型价格未知 | 限定 diff、读审查清单/模板并指定安全报告目录；耗时未知 | 截图只属作者展示 |
| 持续使用 | 每次模型读代码/写 HTML 可能耗 token、文件空间；单位成本未知 | 逐条核行号、复现、严重度与 HTML 转义/占位；工时未知 | 四维评分无校准样本 |
| 失败恢复 | 错误报告需重新生成/存档，可能追加模型用量；金额未知 | 清理危险 HTML、补缺失占位、纠正误报漏报；耗时未知 | 浏览器打开未转义报告的实际影响未复现 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| Skill 发现 | provider 注册 | 实际调用 |
| 五步/评分 | 文本指引 | 一致性/检出率 |
| HTML | 纯模板 | 转义正确率 |

> **思考**：没有确定性报告渲染器，动态 HTML 转义/占位符完整性只是 Skill 文本要求；评分无校准。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：封装五步审查、严重度/四维评分和报告样式，使输出结构一致。详见[Q01](#research-q01)。

封装五步审查、严重度/四维评分和报告样式，使输出结构一致。详见[Q01](#research-q01)。

TypeScript Cordis provider 读取 SKILL.md；无模型工具、后台路由或可执行 HTML 生成器。

<a id="detail-section-5"></a>

### 1.4 主要限制

没有确定性报告渲染器，动态 HTML 转义/占位符完整性只是 Skill 文本要求；评分无校准。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

以小范围 diff 试用，人工核行号/复现与 HTML 安全；避免分数代替审查结论。详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Skill 注册与资源可核；审查准确率、评分校准和 HTML 转义仅靠模型遵循，未独立验证。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、package.json、src/index.ts、assets/7d-code-reviewer/SKILL.md、assets/7d-code-reviewer/scripts/html-report-generation.md、assets/7d-code-reviewer/templates/report-template.html 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交 README、Host provider、SKILL 与 HTML 说明；未调用该 Skill 审查实际代码。 普通安装、宿主加载及目标测试属本轮范围边界，具体机制/效果未知仍在逐题缺口保留。
- 下一步：带已知缺陷的 diff 盲测，多次比较一致性；恶意 HTML 字符样例检查报告。

**分析版本**

- **仓库**：[7dgroup-ai/dsh-skill-7d-code-reviewer](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer)
- **版本号**：0.1.0（[固定提交 bd0069f](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/tree/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057)）
- **版本日期**：2026-10-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

加入安全模板渲染与残留占位检查，并用已标注缺陷集校准严重度/分数，可提高可复核性；待验证。详见[Q02](#research-q02)、[Q03](#research-q03)。

带已知缺陷的 diff 盲测，多次比较一致性；恶意 HTML 字符样例检查报告。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1810 | — | — | 12210 |
| .ts | source | 3 | 111 | 66 | 33 | — |
| .ts | test | 1 | 46 | 42 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/issues?q=is%3Aissue+created%3A2026-09-22T06%3A55%3A46.053Z..2026-10-22T06%3A55%3A46.053Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A55%3A46.053Z..2026-10-22T06%3A55%3A46.053Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实审查 Skill 注册、五步/四维评分输出与 HTML 转义是否由代码保证。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件提供何种代码审查能力？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

Cordis 入口只向 ctx.skills 注册一个可由模型/用户调用的 bundled 7d-code-reviewer provider；provider.get 读取 SKILL.md，resourceBase 指向本包资源目录。Skill 文本要求五步审查、严重/中等/轻微分级、四维评分，并可按需查 references，最终生成文字和 HTML。插件本体没有读取待审代码、运行安全扫描或计算分数的执行函数，这些均依赖调用后的模型按照 Skill 文本行动。README 的截图是作者展示，不能视为独立质量验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:17-62](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/src/index.ts#L17-L62)

注册一个 bundled Skill，无审查引擎。

<details>
<summary>查看原文（46行）</summary>

```text
const PROVIDER_NAME = '7d-code-reviewer'
const SKILL_BODY_URL = new URL('../assets/7d-code-reviewer/SKILL.md', import.meta.url)
const RESOURCE_BASE = {
  kind: 'directory',
  path: fileURLToPath(new URL('../assets/7d-code-reviewer/', import.meta.url)),
} as const
const INVOCATION = { modelInvocable: true, userInvocable: true } as const
const DESCRIPTION = '7DGroup 模板驱动的代码审查：按命名、安全、性能、异常处理维度逐行审查代码，问题分为严重/中等/轻微三级并评分，输出文本摘要与 HTML 审查报告。当用户要求审查代码、评审改动、评估代码质量或生成代码审查报告时使用。'

/* jscpd:ignore-start */
const CANDIDATE: SkillCandidate = {
  name: PROVIDER_NAME,
  description: DESCRIPTION,
  invocation: INVOCATION,
  provider: PROVIDER_NAME,
  source: 'bundled',
  resourceBase: RESOURCE_BASE,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_BODY_URL,
}

const provider: SkillProvider = {
  name: PROVIDER_NAME,
  list: () => Promise.resolve([CANDIDATE]),
  async get(_candidate): Promise<SkillDefinition> {
    return {
      name: CANDIDATE.name,
      description: CANDIDATE.description,
      invocation: CANDIDATE.invocation,
      provider: CANDIDATE.provider,
      source: CANDIDATE.source,
      resourceBase: RESOURCE_BASE,
      content: await readFile(SKILL_BODY_URL, 'utf8'),
    }
  },
}

/** Cordis plugin name. */
export const name = 'skill-7d-code-reviewer'
/** Service required by the bundled provider. */
export const inject = ['skills']

/** Register the bundled `7d-code-reviewer` provider on `ctx.skills`. */
export function apply(ctx: Context): void {
  ctx.skills.registerProvider(() => provider)
}
```

</details>

**依据 2 · 源码核查**：[assets/7d-code-reviewer/SKILL.md:20-51](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/assets/7d-code-reviewer/SKILL.md#L20-L51)

五步、严重度和双输出文本规则。

<details>
<summary>查看原文（32行）</summary>

```text
## 审查流程（5步骤）

### Step 1：接收审查任务
- 用户提交代码或文件路径
- 确定代码语言和业务场景

### Step 2：快速浏览
- 判断改动性质（新业务/修bug/重构）
- 识别核心文件和关键逻辑

### Step 3：逐行审查（加载references）
根据代码语言加载对应规范：
- **命名规范**：检查函数名、变量名是否清晰
- **安全检查**：对照 `security-checklist.md` 逐项检查
  - SQL注入风险
  - XSS漏洞
  - 认证授权问题
  - 敏感信息泄露
- **性能问题**：N+1查询、大循环、内存泄漏
- **异常处理**：try-catch完善度、边界情况

### Step 4：问题分级
| 级别 | 标识 | 定义 | 处理要求 |
|------|------|------|----------|
| 严重 | 🔴 | 安全漏洞、崩溃风险 | 必须修复 |
| 中等 | 🟡 | 性能隐患、逻辑缺陷 | 建议修复 |
| 轻微 | 🟢 | 命名优化、注释补充 | 可选改进 |

### Step 5：生成报告（模板填充）
**必须输出两个格式**：
1. **文本摘要**（快速浏览）
2. **HTML报告**（详细存档）
```

</details>

**依据 3 · 作者声明**：[README.md:17-54](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/README.md#L17-L54)

作者宣称评分、双输出、案例截图。

<details>
<summary>查看原文（38行）</summary>

```text
# @7dgroup/dsh-skill-7d-code-reviewer

**Author: 7DGroup**

A professional, template-driven code review skill plugin for DeepSeek Harness (DSH), developed by the 7DGroup team for AI-assisted code review in any dsh session. Built on TypeScript + Cordis, it installs as a composable bundle and registers the `7d-code-reviewer` skill with `ctx.skills`: a five-step review flow, critical/medium/minor severity grading, four-dimension scoring, and dual text + HTML report output. Zero core changes — install to enable, remove the bundle row to uninstall.

---
## 📌 Project Info

| Field | Value |
|---|---|
| Author | 7DGroup |
| Version | 0.1.0 |
| Runtime | Node `^22.19.0 || >=24.0.0` · pnpm 10+ · dsh CLI |
| Supported dsh versions | 0.2.0-rc.2+ (0.2.x) |
| Peer dependencies | `@deepseek-ai/cordis` · `@deepseek-ai/dsh-skill` · `@deepseek-ai/dsh-invariants` |
| Skill name | `7d-code-reviewer` |
| Repository | [github.com/7dgroup-ai/dsh-skill-7d-code-reviewer](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer) |
| License | MIT |

## 🖼️ Plugin Effect

Skill invocation in a dsh session:

![Invoking the 7d-code-reviewer skill for a code review](screenshots/skills.png)

Sample HTML report generated from the pure-placeholder template:

![Sample code review HTML report](screenshots/report-preview.png)

**Core Capabilities**:

- **Template-driven mode** — separation of concerns: `SKILL.md` decides what to review and how severe it is, `templates/` only presents. The HTML report template stays pure placeholders; all placeholders must be filled, and every dynamic value is HTML-escaped.
- **Five-step review flow** — accept the task → quick scan → line-by-line review (loading `references/` on demand) → severity grading → report generation.
- **Three-level severity grading** — 🔴 critical (must fix) / 🟡 medium (should fix) / 🟢 minor (optional polish).
- **Four-dimension scoring** — code quality / security / performance / maintainability, each on a 1–10 scale, plus an overall score and an auto-generated summary.
- **Dual output** — a text summary for quick reading, plus a full HTML report saved as `code-review-report-{timestamp}.html`.
- **Built-in knowledge base** — coding standards, security checklist (SQL injection, XSS, authentication/authorization, sensitive-data leaks) and worked review examples, loaded on demand instead of bloating the prompt.
```

</details>

#### 缺口

- 已知缺陷变更集上的检出率、误报率与评分一致性缺少对照。
  **影响**：不能从审查步骤与模板推断真实代码质量提升。
  **进一步探讨**：对带独立标签的同一diff盲评，并分别记录证据命中、误报和评分波动。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · HTML 报告的安全与完整性由谁保证？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

报告模板只是占位 HTML，资源中“html-report-generation.md”是一份让 AI 自行填充/转义的说明；没有可执行渲染器做全占位符检查或 HTML escaping。故 README 所说“所有占位符必填/所有动态值转义”是对模型的要求，不是代码级保证。若模型把被审查代码中的 <script> 等原样插入 HTML，打开报告可能执行；模型也可能遗留占位符或写到未指定目录。建议用确定性渲染脚本做转义、占位检查与安全输出路径，并在生成后解析/检索残留。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-55](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/README.md#L47-L55)

作者承诺模板纯占位和动态值转义。

```text
**Core Capabilities**:

- **Template-driven mode** — separation of concerns: `SKILL.md` decides what to review and how severe it is, `templates/` only presents. The HTML report template stays pure placeholders; all placeholders must be filled, and every dynamic value is HTML-escaped.
- **Five-step review flow** — accept the task → quick scan → line-by-line review (loading `references/` on demand) → severity grading → report generation.
- **Three-level severity grading** — 🔴 critical (must fix) / 🟡 medium (should fix) / 🟢 minor (optional polish).
- **Four-dimension scoring** — code quality / security / performance / maintainability, each on a 1–10 scale, plus an overall score and an auto-generated summary.
- **Dual output** — a text summary for quick reading, plus a full HTML report saved as `code-review-report-{timestamp}.html`.
- **Built-in knowledge base** — coding standards, security checklist (SQL injection, XSS, authentication/authorization, sensitive-data leaks) and worked review examples, loaded on demand instead of bloating the prompt.
- **Zero core changes** — pure composable bundle; no patches to the DSH core, safe to install and remove.
```

**依据 2 · 源码核查**：[assets/7d-code-reviewer/SKILL.md:83-110](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/assets/7d-code-reviewer/SKILL.md#L83-L110)

占位符表及模型填充规则。

<details>
<summary>查看原文（28行）</summary>

```text
## HTML报告生成（模板填充）

### 模板选择逻辑
- **默认模板**：`templates/report-template.html`
- **模板用途**：标准化的 HTML 报告输出

### 占位符填充规则

| 占位符 | 填充内容 | 规则 |
|--------|----------|------|
| `{{report_title}}` | 报告标题 | "代码审查报告 - {文件名}" |
| `{{review_timestamp}}` | 审查时间 | ISO格式时间戳 |
| `{{total_score}}` | 总体评分 | 1-10 的整数 |
| `{{total_score_percent}}` | 评分百分比 | 评分 × 10 + "%" |
| `{{summary_description}}` | 摘要描述 | 根据评分自动生成 |
| `{{critical_count}}` | 严重问题数量 | 整数 |
| `{{medium_count}}` | 中等问题数量 | 整数 |
| `{{minor_count}}` | 轻微问题数量 | 整数 |
| `{{good_points_count}}` | 优点数量 | 整数 |
| `{{code_quality_score}}` | 代码质量评分 | 1-10 |
| `{{security_score}}` | 安全性评分 | 1-10 |
| `{{performance_score}}` | 性能评分 | 1-10 |
| `{{maintainability_score}}` | 可维护性评分 | 1-10 |
| `{{critical_issues}}` | 严重问题HTML | 格式见下方 |
| `{{medium_issues}}` | 中等问题HTML | 格式见下方 |
| `{{minor_issues}}` | 轻微问题HTML | 格式见下方 |
| `{{good_points}}` | 优点HTML | 格式见下方 |
| `{{improvement_suggestions}}` | 改进建议HTML | 格式见下方 |
```

</details>

**依据 3 · 源码核查**：[assets/7d-code-reviewer/SKILL.md:185-209](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/assets/7d-code-reviewer/SKILL.md#L185-L209)

指示模型生成/保存 HTML。

<details>
<summary>查看原文（25行）</summary>

```text
## 工作流程

当用户显式调用此 Skill（如通过 `/7d-code-reviewer` 或选择代码审查工具）时：

1. **读取references（按需）**
   - 需要检查命名规范 → 加载 `references/coding-standards.md`
   - 需要检查安全漏洞 → 加载 `references/security-checklist.md`
   - 需要参考示例 → 加载 `references/review-examples.md`

2. **执行代码审查**
   - 按审查维度逐项分析
   - 识别问题并分级
   - 记录优点

3. **填充模板**
   - 计算各项评分
   - 生成问题HTML片段
   - **对所有动态内容进行HTML转义**（`<`→`&lt;`, `>`→`&gt;`, `&`→`&amp;`）
   - 替换模板中的所有占位符

4. **输出结果**
   - 先输出文本摘要（快速浏览）
   - 然后输出完整HTML报告
   - 将HTML保存到文件：`code-review-report-{timestamp}.html`
   - 告知用户报告文件路径
```

</details>

**依据 4 · 源码核查**：[assets/7d-code-reviewer/scripts/html-report-generation.md:3-13](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/assets/7d-code-reviewer/scripts/html-report-generation.md#L3-L13)

明确 AI 直接填模板，无外部脚本。

<details>
<summary>查看原文（11行）</summary>

```text
## 模板填充流程

本 Skill 使用模板驱动模式生成 HTML 报告。AI 直接填充模板，无需外部脚本执行。

### 填充流程

1. 读取 `templates/report-template.html`
2. 根据审查结果计算各占位符值
3. 对所有动态内容进行 **HTML 转义**
4. 替换所有占位符
5. 保存到 `code-review-report-{timestamp}.html`
```

</details>

**依据 5 · 源码核查**：[src/index.ts:38-62](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/src/index.ts#L38-L62)

Host 只返回 Skill 文本。

<details>
<summary>查看原文（25行）</summary>

```text
const provider: SkillProvider = {
  name: PROVIDER_NAME,
  list: () => Promise.resolve([CANDIDATE]),
  async get(_candidate): Promise<SkillDefinition> {
    return {
      name: CANDIDATE.name,
      description: CANDIDATE.description,
      invocation: CANDIDATE.invocation,
      provider: CANDIDATE.provider,
      source: CANDIDATE.source,
      resourceBase: RESOURCE_BASE,
      content: await readFile(SKILL_BODY_URL, 'utf8'),
    }
  },
}

/** Cordis plugin name. */
export const name = 'skill-7d-code-reviewer'
/** Service required by the bundled provider. */
export const inject = ['skills']

/** Register the bundled `7d-code-reviewer` provider on `ctx.skills`. */
export function apply(ctx: Context): void {
  ctx.skills.registerProvider(() => provider)
}
```

</details>

#### 缺口

- 未生成并打开恶意字符样例报告。
  **影响**：实际 XSS 或残留占位发生率未量测。
  **进一步探讨**：隔离输入包含 HTML 特殊字符的代码，检查输出转义和 CSP。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 分级评分适用何种审查？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

该 Skill 适合需要统一审查呈现的人工辅助流程：模型根据命名、安全、性能、异常处理及参考清单给出建议，用户仍需验证行号和复现路径。固定 1–10 的四维分数为规则说明，没有校准样本或可重复的机器指标；“无严重问题”模板文案只代表当前模型未发现，不能作为安全合格证明。每次都要求 HTML 报告，可能增加写盘/校对成本，尤其是小改动。引入时应在具体 diff 限定审查范围，要求每项问题有文件行号和复现依据，并对严重度/评分跨次一致性做对照。

成本分期：首次使用涉及DSH skills registry、模型和可读代码；许可/模型价格未知，人工需限定 diff、读审查清单/模板并指定安全报告目录；耗时未知；持续使用涉及每次模型读代码/写 HTML 可能耗 token、文件空间；单位成本未知，人工需逐条核行号、复现、严重度与 HTML 转义/占位；工时未知；失败恢复涉及错误报告需重新生成/存档，可能追加模型用量；金额未知，人工需清理危险 HTML、补缺失占位、纠正误报漏报；耗时未知。金额、频次、实际耗时均未有同条件证据，不能填0或推算单位收益。

创新假设推导：Q02 资源只给 AI 填 HTML 的文本说明，没有执行性转义和占位校验；相对直接模型拼接，确定性渲染器加残留占位扫描可提高报告完整性。条件是维护模板字段/输出路径并让人复核代码问题，不能据此提升检测率。最小证伪：给含 <script>、引号及缺字段的审查样例，解析输出 HTML 并扫描占位；若脚本可执行、占位残留或字段被静默丢弃，假设失败。

#### 证据与依据

**依据 1 · 源码核查**：[assets/7d-code-reviewer/SKILL.md:30-47](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/assets/7d-code-reviewer/SKILL.md#L30-L47)

检查维度与三级严重度。

<details>
<summary>查看原文（18行）</summary>

```text
### Step 3：逐行审查（加载references）
根据代码语言加载对应规范：
- **命名规范**：检查函数名、变量名是否清晰
- **安全检查**：对照 `security-checklist.md` 逐项检查
  - SQL注入风险
  - XSS漏洞
  - 认证授权问题
  - 敏感信息泄露
- **性能问题**：N+1查询、大循环、内存泄漏
- **异常处理**：try-catch完善度、边界情况

### Step 4：问题分级
| 级别 | 标识 | 定义 | 处理要求 |
|------|------|------|----------|
| 严重 | 🔴 | 安全漏洞、崩溃风险 | 必须修复 |
| 中等 | 🟡 | 性能隐患、逻辑缺陷 | 建议修复 |
| 轻微 | 🟢 | 命名优化、注释补充 | 可选改进 |

```

</details>

**依据 2 · 源码核查**：[assets/7d-code-reviewer/SKILL.md:146-181](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/assets/7d-code-reviewer/SKILL.md#L146-L181)

无问题占位与主观评分标准。

<details>
<summary>查看原文（36行）</summary>

```text
### 无内容填充规则
- 如果没有严重问题，`{{critical_issues}}` 填充：`<p style="color: #27ae60;">🎉 未发现严重问题！</p>`
- 如果没有中等问题，`{{medium_issues}}` 填充：`<p style="color: #27ae60;">🎉 未发现中等问题！</p>`
- 如果没有轻微问题，`{{minor_issues}}` 填充：`<p style="color: #27ae60;">🎉 未发现轻微问题！</p>`
- 如果没有优点，`{{good_points}}` 填充：`<p style="color: #666;">暂无特别突出的优点。</p>`

### 评分到描述的映射

| 评分 | 描述 |
|------|------|
| 9-10 | 优秀，代码质量高，符合最佳实践 |
| 7-8 | 良好，有少量改进空间 |
| 5-6 | 中等，存在一些需要修复的问题 |
| 3-4 | 较差，有较多问题需要解决 |
| 1-2 | 很差，存在严重问题必须立即修复 |

---

## 评分标准

### 总体评分（1-10分）

- **9-10分**：优秀，代码质量高，几乎没有问题
- **7-8分**：良好，有少量改进空间
- **5-6分**：中等，存在一些需要修复的问题
- **3-4分**：较差，有较多问题需要解决
- **1-2分**：很差，存在严重问题

### 各维度评分

| 维度 | 优秀(8-10) | 良好(6-7) | 需改进(4-5) | 差(1-3) |
|------|-----------|-----------|-------------|---------|
| **代码质量** | 命名清晰，结构合理，无重复代码 | 基本规范，少量问题 | 命名混乱或复杂度过高 | 严重违反编码规范 |
| **安全性** | 无安全风险，参数化查询，完整验证 | 基本安全，小瑕疵 | 存在安全隐患 | 有严重安全漏洞 |
| **性能** | 算法高效，使用缓存，无N+1查询 | 性能可接受 | 有明显性能问题 | 严重性能缺陷 |
| **可维护性** | 文档完善，模块化，测试覆盖高 | 基本可维护 | 缺少注释或测试 | 难以维护 |
```

</details>

**依据 3 · 源码核查**：[assets/7d-code-reviewer/SKILL.md:199-209](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/assets/7d-code-reviewer/SKILL.md#L199-L209)

强制双输出与写文件。

<details>
<summary>查看原文（11行）</summary>

```text
3. **填充模板**
   - 计算各项评分
   - 生成问题HTML片段
   - **对所有动态内容进行HTML转义**（`<`→`&lt;`, `>`→`&gt;`, `&`→`&amp;`）
   - 替换模板中的所有占位符

4. **输出结果**
   - 先输出文本摘要（快速浏览）
   - 然后输出完整HTML报告
   - 将HTML保存到文件：`code-review-report-{timestamp}.html`
   - 告知用户报告文件路径
```

</details>

**依据 4 · 作者声明**：[README.md:57-75](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/README.md#L57-L75)

作者列使用场景与能力。

<details>
<summary>查看原文（19行）</summary>

```text
**Use Cases**:

- Code review before commit / merge request
- Security audit of existing code
- Quality assessment before refactoring
- Enforcing team coding standards
- Any code quality question inside a dsh conversation

## ✅ Features

- ✅ Five-step template-driven review flow
- ✅ Three-level severity grading with fix suggestions
- ✅ Four-dimension scoring rubric (code quality / security / performance / maintainability)
- ✅ Text summary + HTML report dual output
- ✅ Pure-placeholder HTML report template with mandatory filling rules
- ✅ Documented HTML escaping rules for all filled content
- ✅ On-demand knowledge base (coding standards / security checklist / review examples)
- ✅ No executable scripts ship with the skill
- ✅ Installable from GitHub (`github:` shorthand), npm or tarball
```

</details>

#### 缺口

- 未量测模型多次审查一致性、漏报及工作量。
  **影响**：分数与真实代码质量关联未知。
  **进一步探讨**：同一带标签 diff 多次运行，比较问题证据/评分和人工审查。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
