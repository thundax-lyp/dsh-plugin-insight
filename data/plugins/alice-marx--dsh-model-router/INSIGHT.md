# DSH Model Router

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[e1f7aaa](https://github.com/Alice-Marx/dsh-model-router/tree/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78)

<!-- BEGIN META -->
[![GitHub ★ 281](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=281&color=yellow&logo=github&style=flat)](https://github.com/Alice-Marx/dsh-model-router) [![npm 30d 4,168](https://img.shields.io/static/v1?label=npm+30d&message=4%2C168&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router)
<!-- END META -->

> **实现功能**：在DSH工作台规划任务、比较模型路由并通过API或官方CLI执行依赖工作包。

> **核心亮点**：相对手动单模型分配，实质增量是把依赖约束、可行性和成本不确定性纳入统一计划，并将执行结果回接账本。质量评分仍为代理，贡献限于可解释编排机制。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：代理质量能否约束真实交付，是成本感知路由是否有用的关键。字符token估计、配置价格和历史评分均不能替代同任务实测；不完整尝试账本保留未知，反馈不等于准确率。[Q03](#research-q03)

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
  - [Q01 · 谁需要多模型任务分配，合格交付是什么？](#detail-section-11)
  - [Q02 · 评分、搜索及依赖执行怎样接线？](#detail-section-12)
  - [Q03 · 质量与价格估计能否证明真实收益？](#detail-section-13)
  - [Q04 · 启动、权限和恢复需要什么？](#detail-section-14)
  - [Q05 · 怎样检验路由收益的新假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已配置多模型的开发者需要对依赖任务形成可解释的分配与执行记录；合格结果包含实际交付与验收。

简单替代是手动选定一个模型，逐包执行并手工记账；本轮只比较机制，不对宿主现有版本或竞品做未查证的效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 路由规划 | 比较多模型依赖任务分配 | 本地代理目标；不证明真实质量与全局最优 |
| API/CLI执行 | 执行选定工作包并保留结果 | 需账户、网络与明确权限；worktree非OS沙箱 |
| 账本与反馈 | 区分估计、实际与未知费用 | 人工评分只代表偏好，不替代客观正确性 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 支持版本Desktop与宿主模型目录 | 启动必需 | 装配宿主工具和列出路由 | 作者声明版本范围外兼容未知 |
| 供应商API或已登录CLI | 执行必需 | 执行选定工作包 | 登录与实际模型需核对，可能产生费用 |
| 价格、质量与任务验收 | 效果必需 | 约束计划和验收交付 | 未知价格保留未知；质量不是答对概率 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置模型和价格 | 用户 | 目录可见后仍需核对账户权限 |
| 本地计划并核对包依赖 | 用户/插件 | 确认预算可行性，不能只看推荐名称 |
| 只读执行与验收 | 插件/用户 | 核对实际模型、完整费用和包结果，失败停止复核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主、CLI与模型接入 | 价格/权限/任务配置 | 金额与耗时未测 |
| 持续使用 | 全部工作包与评审的模型/API费用 | 复核交付和更新价格 | 未知不补零，无合格任务对照 |
| 失败恢复 | 已运行尝试费用仍计入 | 诊断身份、保留工作树和重试验收 | 可能存在未知费用部分，时间未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 计划可行性和搜索范围 | 源码明确过滤与搜索元数据 | 代理目标不等于业务质量 |
| 质量/节费 | 作者明确无当前版本新增真实实验 | 无本轮独立收益量化 |
| 费用完整性 | 不完整级联返回null及已知小计 | 下界不是总实付 |

> **思考**：代理质量能否约束真实交付，是成本感知路由是否有用的关键。字符token估计、配置价格和历史评分均不能替代同任务实测；不完整尝试账本保留未知，反馈不等于准确率。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手动单模型分配，实质增量是把依赖约束、可行性和成本不确定性纳入统一计划，并将执行结果回接账本。质量评分仍为代理，贡献限于可解释编排机制。[Q01](#research-q01) [Q02](#research-q02)

相对手动单模型分配，实质增量是把依赖约束、可行性和成本不确定性纳入统一计划，并将执行结果回接账本。质量评分仍为代理，贡献限于可解释编排机制。[Q01](#research-q01) [Q02](#research-q02)

求解器独立于宿主接线，拓扑校验和未知价格准入值得复用；账本保持费用未知、反馈过滤未执行结果，减少误学习。复杂CLI安装/权限/模型映射仍需逐供应商适配，未读模块不纳入完整安全审计。

<a id="detail-section-5"></a>

### 1.4 主要限制

代理质量能否约束真实交付，是成本感知路由是否有用的关键。字符token估计、配置价格和历史评分均不能替代同任务实测；不完整尝试账本保留未知，反馈不等于准确率。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议多模型开发者在隔离小仓库试用只读流程，逐包盲评与核对全部支出；身份或权限不清、支出未知时暂停扩大使用。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定版本的规划、搜索和账本机制；端到端质量与节费未验证，新设计是假设。

- 已检查：作者 README、包清单、源码路径 README.md、.dsh-plugin/shared/assignment-solver.mjs、.dsh-plugin/shared/router.mjs、.dsh-plugin/index.mjs、.dsh-plugin/shared/run-ledger.mjs、.dsh-plugin/shared/adaptive-feedback.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的作者材料与关键源码只读核查；未安装或执行目标代码，未运行作者测试，未安排真实宿主验收。引用的既有作者运行记录不视为本轮独立验证。
- 下一步：最小验收固定任务、模型和预算，对照手工路线，记录合格率、所有尝试成本、人工分钟、取消和退出结果。当前未执行任何目标代码。

**分析版本**

- **仓库**：[Alice-Marx/dsh-model-router](https://github.com/Alice-Marx/dsh-model-router)
- **版本号**：0.22.2（[固定提交 e1f7aaa](https://github.com/Alice-Marx/dsh-model-router/tree/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是用任务匹配的客观通过证据形成保守可行域，再用显式人工反馈微调选择。应对照固定模型与当前算法，并计入失败重试和人工复核；收益消失或依赖额外预算即否定。[Q05](#research-q05)

最小验收固定任务、模型和预算，对照手工路线，记录合格率、所有尝试成本、人工分钟、取消和退出结果。当前未执行任何目标代码。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 16155 | 15902 | 398 | — |
| .mjs | source | 98 | 22945 | 19884 | 1975 | — |
| .jsx | source | 7 | 3124 | 2886 | 117 | — |
| .md | source | 49 | 14943 | — | — | 168136 |
| .mjs | test | 83 | 18527 | 17105 | 365 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Alice-Marx/dsh-model-router/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Alice-Marx/dsh-model-router/issues?q=is%3Aissue+created%3A2026-09-23T07%3A58%3A16.196Z..2026-10-23T07%3A58%3A16.196Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Alice-Marx/dsh-model-router/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T07%3A58%3A16.196Z..2026-10-23T07%3A58%3A16.196Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：模型路由如何在成本约束下分配任务，执行与结果证据是否足以支持收益？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要多模型任务分配，合格交付是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已经配置多条模型路由、需要在预算内完成依赖任务的DSH使用者。作者将本地规划、路由比较、CLI/API执行和历史审阅放在一个工作台；合格结果应是依赖包均交付且通过用户验收，并能解释实际使用的模型与支出，单有推荐计划不合格。与用户手动指定一条模型的简单办法相比，源码可见增量是显式任务包、代价和切换惩罚的联合决策，以及执行后的可追溯记录。不能据此推出比固定强模型便宜或质量更高，README明确当前版本没有新的真实供应商实验，旧版本执行记录也不能证明自动路由有效。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-19](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/README.md#L11-L19)

作者定位是成本感知工作台，并明确当前版本无新的模型实验；用于限定目标和效果归属。

```text
A cost-aware model-routing workbench for **DeepSeek Harness Desktop**. Plan locally, compare configured routes, inspect execution permissions, and run dependent work packages through model APIs or supported official vendor CLIs.

Current version: **0.22.2** (`@ljwei-stak/dsh-model-router`). Choose algorithm recommendations or manually assign each decomposed package to an exact model API or official tool, preserving dependencies, refreshed cost previews and retry targets. Routing now supports task-specific quality evidence, joint model/effort selection, historical P90 resource estimates and dependency-aware search. Manual mixed execution is read-only; tools use their configured default model, while the existing editable official-team workflow remains available. Compatibility remains **DeepSeek Harness Desktop 0.2.0-rc.1 / 0.2.0-rc.2 / 0.2.1-rc.2**, including Hermes/Pi installation and terminal support; neither has a verified managed runner yet. Real vendor execution evidence remains tied to **0.20.0**, with no new model experiments in this release. The router and [GAL](https://github.com/Alice-Marx/deepseek-harness-galgame) have been independent plugins since 0.12.0.

Official CLI teamwork runs packages sequentially with dependency context and no automatic model-directory API fallback. Editable teams explicitly choose the Harness sandbox or the vendor CLI's normal environment. In the latter, Git worktrees collect edits but do not restrict OS access. CLIs retain their configured model unless explicitly mapped. See [real Windows validation and its limits](docs/releases/0.20.0-validation.md).

Both README versions describe the same interfaces, formulas, defaults and limits. [Changelog](CHANGELOG.md) preserves release history. More walkthroughs: [workbench](docs/WORKBENCH_USER_GUIDE.zh.md), [installation](docs/INSTALLATION_GUIDE.zh.md), [migration](docs/archive/MIGRATION.md), and [experiment protocol](docs/ROUTING_SELFTEST_STEPS.zh.md).

<a id="quick-evaluation"></a>
```

**依据 2 · 源码核查**：[.dsh-plugin/shared/assignment-solver.mjs:52-70](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/.dsh-plugin/shared/assignment-solver.mjs#L52-L70)

依赖拓扑和价格已知条件进入候选分配，支持识别显式约束贡献。

<details>
<summary>查看原文（19行）</summary>

```text
export function solveCandidateAssignments({ tasks = [], pools = [], budget = Infinity, beamWidth = 256, exactLimit = 4096, handoffPenalty = 0.015, minimizeCost = false } = {}) {
  if (!tasks.length || tasks.length !== pools.length) return null
  const taskCount = tasks.length
  const taskIndexById = new Map()
  const preceding = new Set()
  for (let index = 0; index < taskCount; index++) {
    const task = tasks[index]
    if (!task || !task.id || preceding.has(task.id) || (task.dependsOn ?? []).some(id => !preceding.has(id))) {
      throw new RangeError('Assignment tasks must have unique ids and known dependencies in topological order')
    }
    preceding.add(task.id)
    taskIndexById.set(task.id, index)
  }

  const constrained = Number.isFinite(budget)
  const options = pools.map(pool => (Array.isArray(pool) ? pool : []).filter(option =>
    option && Number.isFinite(option.cost) && option.cost >= 0 && Number.isFinite(option.score)
    && (!constrained || option.pricingKnown === true)))
  if (options.some(pool => pool.length === 0)) return null
```

</details>

#### 缺口

- 未取得同任务的独立合格交付对照
  **影响**：无法确认端到端收益
  **进一步探讨**：固定任务、模型和预算比较手工单模型与自动分配，盲评交付

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 评分、搜索及依赖执行怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

求解器先要求每个任务ID唯一且依赖按拓扑顺序已出现，再从任务候选池中过滤非法成本/效用。预算有限时进一步剔除价格未知选项；默认在保留候选笛卡尔空间不超过4096时精确求解，否则走宽度256的beam，并将路由切换作为代价。这里“精确”只针对经过候选池筛选的代理目标，无法推出所有供应商和真实任务质量的全局最优。router自身保留最多12个候选并构造质量/成本等代理项；本地计划不产生模型调用。入口注册宿主工具并交给执行模块，真正执行仍依赖已配置API或受支持CLI。值得借鉴的是可行性、未知价格和搜索范围显式暴露，移植需要替换宿主模型目录和执行适配，不是复制评分公式即可。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/assignment-solver.mjs:52-70](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/.dsh-plugin/shared/assignment-solver.mjs#L52-L70)

拓扑约束与预算过滤明确分开。

<details>
<summary>查看原文（19行）</summary>

```text
export function solveCandidateAssignments({ tasks = [], pools = [], budget = Infinity, beamWidth = 256, exactLimit = 4096, handoffPenalty = 0.015, minimizeCost = false } = {}) {
  if (!tasks.length || tasks.length !== pools.length) return null
  const taskCount = tasks.length
  const taskIndexById = new Map()
  const preceding = new Set()
  for (let index = 0; index < taskCount; index++) {
    const task = tasks[index]
    if (!task || !task.id || preceding.has(task.id) || (task.dependsOn ?? []).some(id => !preceding.has(id))) {
      throw new RangeError('Assignment tasks must have unique ids and known dependencies in topological order')
    }
    preceding.add(task.id)
    taskIndexById.set(task.id, index)
  }

  const constrained = Number.isFinite(budget)
  const options = pools.map(pool => (Array.isArray(pool) ? pool : []).filter(option =>
    option && Number.isFinite(option.cost) && option.cost >= 0 && Number.isFinite(option.score)
    && (!constrained || option.pricingKnown === true)))
  if (options.some(pool => pool.length === 0)) return null
```

</details>

**依据 2 · 源码核查**：[.dsh-plugin/shared/assignment-solver.mjs:108-122](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/.dsh-plugin/shared/assignment-solver.mjs#L108-L122)

默认精确阈值及beam宽度和搜索元数据，限定精确性。

<details>
<summary>查看原文（15行）</summary>

```text
  if (constrained && suffixMinimum[0] > budget + EPSILON) return null
  const parsedExactLimit = Number(exactLimit)
  const exactThreshold = Number.isFinite(parsedExactLimit)
    ? Math.max(1, parsedExactLimit)
    : exactLimit === Infinity ? Number.MAX_SAFE_INTEGER : 4096
  const parsedBeamWidth = Number(beamWidth)
  const width = Number.isFinite(parsedBeamWidth) ? Math.max(1, Math.floor(parsedBeamWidth) || 256) : 256
  const exact = !searchSpaceCapped && searchSpace <= exactThreshold

  const search = {
    method: exact ? 'exact' : 'beam',
    exact,
    strategy: exact ? 'exact-enumeration' : 'boundary-frontier-lookahead',
    searchSpace,
    searchSpaceCapped,
```

</details>

**依据 3 · 源码核查**：[.dsh-plugin/shared/router.mjs:603-608](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/.dsh-plugin/shared/router.mjs#L603-L608)

候选上限仅描述保留空间。

```text
  return packages.map(task => ({ ...task, qualityFloor: taskQualityFloor(band, task) }))
}

const SYNTHESIS_WEIGHTS = Object.freeze({ quality: 0.58, cost: 0.08, latency: 0.04, specialty: 0.08, reasoning: 0.16, risk: 0.06 })
const ROUTING_BEAM_WIDTH = 256
const ROUTING_CANDIDATE_LIMIT = 12
```

**依据 4 · 源码核查**：[.dsh-plugin/index.mjs:1813-1826](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/.dsh-plugin/index.mjs#L1813-L1826)

apply作为宿主装配入口。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx, config = {}) {
  // Install addresses (directory, npm source, per-tool method and script source)
  // are volatile refs: Loader changes them without re-applying the plugin.
  // Read them after the owning fiber's live update, before a saved view is sent.
  let installPreferenceError = null
  const syncInstallPreferences = () => {
    try {
      const next = parseInstallPreferences(config, { tools: OFFICIAL_TOOLS, ...currentInstallOptions() })
      setInstallPreferences(next)
      installPreferenceError = null
    } catch (error) { installPreferenceError = errorText(error) }
  }
  const installFields = new Set(['toolInstallDir', 'toolNpmRegistry', 'toolInstallMethodsJson', 'toolScriptUrlsJson', 'toolAllowScriptInstall', 'zcodeInstallDir'])
  syncInstallPreferences()
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 质量与价格估计能否证明真实收益？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

不能。router的基础输入token由字符串长度/3.7估算，价格来自配置，质量门槛同样不是答对概率。缺少价格或质量来源时savings置空，即便有值也只是相对“最强质量候选”的估计差额，不能当实付节省。账本对质量级联的每次尝试分别核价，任何一次未知就使costUsd为null，同时保留knownCostUsd及未知尝试数，这避免把部分成本冒充总成本。主观偏好只接受执行成功、ran与ok均为true且明确±1的反馈；CLI实际模型不匹配时不学习。模型评审和缺失反馈不构成用户满意度。效果主张最强支持是这种证据分层，最关键缺口则是代理质量是否能外推目标任务，不能以“有质量门槛”回避这点。首次配置要人工校准价格/模型，日常要计入包间上下文和评审，失败恢复也要保留前次支出；现金与人工耗时均无本轮测量。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/router.mjs:276-287](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/.dsh-plugin/shared/router.mjs#L276-L287)

字符启发式说明估算成本口径。

<details>
<summary>查看原文（12行）</summary>

```text
export function estimateCost(model, text, outputTokens = 900, pricingOverrides = {}, cacheReadRatio = 0, cacheWriteRatio = 0) {
  const pricing = pricingFor(model, pricingOverrides)
  if (pricing === null) return null
  const inputTokens = Math.max(80, Math.ceil(String(text ?? '').length / 3.7))
  const ratios = normalizedCacheRatios(cacheReadRatio, cacheWriteRatio)
  const cacheReadTokens = Math.min(inputTokens, Math.max(0, Math.round(inputTokens * ratios.read)))
  const cacheWriteTokens = Math.min(inputTokens - cacheReadTokens, Math.max(0, Math.round(inputTokens * ratios.write)))
  const billableInputTokens = inputTokens - cacheReadTokens - cacheWriteTokens
  return ((billableInputTokens * pricing.input)
    + (cacheReadTokens * pricing.cacheRead)
    + (cacheWriteTokens * pricing.cacheWrite)
    + (outputTokens * pricing.output)) / 1_000_000
```

</details>

**依据 2 · 源码核查**：[.dsh-plugin/shared/router.mjs:1123-1139](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/.dsh-plugin/shared/router.mjs#L1123-L1139)

savings条件及未校准质量明确限制收益解释。

<details>
<summary>查看原文（17行）</summary>

```text
  const baselineCost = baselineRows.every(item => item.strongest?.pricing !== null && item.strongest !== null)
    ? baselineRows.reduce((sum, { task, strongest }) => sum + taskCost(strongest, task, text, complexity.band, cacheReadRatio, cacheWriteRatio), 0)
    : null
  const knownQualitySources = ['livebench', 'route', 'user', 'recorded-query-evidence']
  const qualityEvidenceComplete = assignments.length > 0 && assignments.every(({ row, task }) => knownQualitySources.includes(qualitySourceForTask(row, task.type)))
    && baselineRows.every(({ strongest, task }) => knownQualitySources.includes(qualitySourceForTask(strongest, task.type)))
  const budgetExceeded = Number(budgetUsd) > 0 && totalEstimate !== null ? totalEstimate > Number(budgetUsd) : null
  const savings = baselineCost === null || totalEstimate === null || !qualityEvidenceComplete
    ? null : baselineCost <= 0 ? 0 : clamp((baselineCost - totalEstimate) / baselineCost)
  const paretoPruned = (optimized?.candidatePools ?? []).reduce((sum, pool) => sum + pool.pruned, 0)
  const minimumFeasibleCost = rows.every(row => row.pricing !== null)
    ? (optimized?.minimumFeasibleCost ?? minimumCostPlan?.cost ?? 0) : null
  const reason = selected === null
    ? unassignableTasks.length > 0
      ? `图像工作包 ${unassignableTasks.join('、')} 没有可用的图像模型，无法形成完整分配计划。`
      : '尚未发现可用模型，保留 Harness 原始模型选择。'
    : `${complexity.band === 'simple' ? '低复杂度优先成本、响应速度与较低推理开销' : complexity.band === 'balanced' ? '在质量、成本、推理等级、延迟与风险之间平衡' : '高复杂度执行包含推理等级的依赖感知约束分配'}；任务类型为 ${taskType}，${String(subtasks.length)} 个工作包采用${optimized?.search?.exact ? '保留候选空间内的精确搜索' : '保留候选空间内的有界近似搜索'}。质量分与门槛是未校准的估计，不是答对概率。`
```

</details>

**依据 3 · 源码核查**：[.dsh-plugin/shared/run-ledger.mjs:48-67](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/.dsh-plugin/shared/run-ledger.mjs#L48-L67)

级联不完整时总成本未知，保留已知下界。

<details>
<summary>查看原文（20行）</summary>

```text
export function actualCost(result, pricing) {
  if (result && Object.hasOwn(result, 'qualityAttempts')) {
    const attempts = result.qualityAttempts
    if (!Array.isArray(attempts) || attempts.length < 1 || attempts.length > 2
      || attempts.some(item => !item || typeof item !== 'object' || Object.hasOwn(item, 'qualityAttempts')
        || item.channel === 'official-cli' || item.billing === 'subscription')) {
      return { costUsd: null, costSource: 'quality-attempts-invalid' }
    }
    const costs = attempts.map(item => clearlyNotStarted(item)
      ? { costUsd: 0, costSource: 'not-run' }
      : actualCost(item, item.pricingSnapshot ?? null))
    if (costs.some(item => item.costUsd === null)) {
      const knownCostUsd = costs.filter(item => item.costUsd !== null).reduce((sum, item) => sum + item.costUsd, 0)
      return finite(knownCostUsd) ? { costUsd: null, costSource: 'quality-attempts-incomplete', knownCostUsd,
        unknownAttemptCount: costs.filter(item => item.costUsd === null).length }
        : { costUsd: null, costSource: 'cost-invalid' }
    }
    const total = costs.reduce((sum, item) => sum + item.costUsd, 0)
    return finite(total) && total >= 0 ? { costUsd: total, costSource: 'quality-attempts' }
      : { costUsd: null, costSource: 'cost-invalid' }
```

</details>

**依据 4 · 源码核查**：[.dsh-plugin/shared/adaptive-feedback.mjs:64-85](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/.dsh-plugin/shared/adaptive-feedback.mjs#L64-L85)

显式成功反馈及实际模型匹配条件约束学习。

<details>
<summary>查看原文（22行）</summary>

```text
function evidenceOf(run, item, options) {
  const reject = reason => ({ event: null, reason })
  const provider = clean(own(item, 'provider'))
  const model = clean(own(item, 'model'))
  if (!provider || !model || provider.includes('\u0000') || model.includes('\u0000')) return reject('invalid-route')
  if (own(item, 'ran') !== true || own(item, 'ok') !== true
    || item.blocked === true || item.waiting === true || item.paused === true
    || item.cancelled === true || (item.status !== undefined && !['succeeded', 'fallback'].includes(item.status))) return reject('not-successful')
  const rating = own(item, 'rating')
  if (rating !== 1 && rating !== -1) return reject(rating === undefined || rating === null || rating === 0 ? 'unrated' : 'invalid-rating')
  // A CLI default or a different actual model must not train the recommended
  // model. Aliases are not silently equated; a future verified adapter may do so.
  if (item.channel === 'official-cli' && clean(own(item, 'actualModel')) !== model) return reject('cli-model-unverified')
  const finishedAt = completedAt(run, item)
  if (finishedAt === null) return reject('invalid-time')
  if (finishedAt > options.now) return reject('future-time')
  if (finishedAt <= options.resetAt) return reject('before-reset')
  const suppliedRatedAt = own(item, 'ratedAt')
  if (suppliedRatedAt !== undefined && suppliedRatedAt !== null) {
    if (!finite(suppliedRatedAt) || suppliedRatedAt < finishedAt) return reject('invalid-time')
    if (suppliedRatedAt > options.now) return reject('future-time')
  }
```

</details>

#### 缺口

- 真实计费、合格率和人工复核量未实测
  **影响**：不支持单位合格任务成本或质量提高结论
  **进一步探讨**：收集全部尝试账单与盲评、人工分钟；未知费用样本单列

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、权限和恢复需要什么？

**研究主题**：依赖、兼容与流程、采用判断

#### 完整回答

作者声明适配Desktop 0.2.0-rc.1/rc.2及0.2.1-rc.2。必须先配置宿主模型目录与凭据，使用CLI还需独立安装登录及可执行模式；目录有模型不等于账户有权限。本地预览可先做，实际执行将任务送给供应商。可编辑CLI工作流中的Git worktree用于收集修改，不提供操作系统隔离；cli-native应按当前用户权限理解。历史任务和答案有截断上限，不能依赖历史记录无损恢复长上下文。建议只在隔离小仓库中先试用只读路由，核对真实模型、完整成本和每包验收，再考虑写入模式；发现计费未知、模型身份不明或补丁不能安全合并应停止，保留工作树由用户复核。当前仅源码级，不能给持续安装结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:46-58](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/README.md#L46-L58)

作者描述宿主配置、执行权限和兼容边界。

<details>
<summary>查看原文（13行）</summary>

```text

**Permissions and risks:** Planning is local and makes no model call. Execution sends the selected task/context to the chosen model API or vendor CLI and may incur charges. The default Harness-restricted environment separates read-only runs from approved `workspace-write` runs. An explicitly selected `cli-native` editable team runs with the current OS user's permissions, outside the Harness process sandbox; a Git worktree collects changes but does not restrict OS access. External providers and CLI services apply their own data handling and billing terms.

**Compatibility:** Declared host support is DeepSeek Harness Desktop **0.2.0-rc.1**, **0.2.0-rc.2**, and **0.2.1-rc.2**. Node.js **>=22.19** and pnpm **10.34.6** are source development/build requirements, not plugin runtime prerequisites. Compatibility beyond the declared host versions is not claimed.

**Contents:** [Quick evaluation](#quick-evaluation) · [Capabilities](#capabilities) · [Install](#install) · [Workbench](#workbench) · [Architecture](#architecture) · [Session tools](#session-tools) · [Official tools](#official-tools) · [Team lifecycle](#team-lifecycle) · [Costs](#costs) · [Routing algorithm](#routing) · [Data](#data) · [Development](#development) · [Troubleshooting](#troubleshooting)

<a id="capabilities"></a>

## What is included

| Capability | Current behavior |
| --- | --- |
```

</details>

**依据 2 · 源码核查**：[.dsh-plugin/shared/run-ledger.mjs:10-11](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/.dsh-plugin/shared/run-ledger.mjs#L10-L11)

任务及答案保存上限限制历史恢复完整性。

```text
export const MAX_STORED_ANSWER = 4_000
export const MAX_STORED_TASK = 20_000
```

**依据 3 · 作者声明**：[README.md:15-19](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/README.md#L15-L19)

CLI执行环境与worktree非沙箱的边界。

```text
Official CLI teamwork runs packages sequentially with dependency context and no automatic model-directory API fallback. Editable teams explicitly choose the Harness sandbox or the vendor CLI's normal environment. In the latter, Git worktrees collect edits but do not restrict OS access. CLIs retain their configured model unless explicitly mapped. See [real Windows validation and its limits](docs/releases/0.20.0-validation.md).

Both README versions describe the same interfaces, formulas, defaults and limits. [Changelog](CHANGELOG.md) preserves release history. More walkthroughs: [workbench](docs/WORKBENCH_USER_GUIDE.zh.md), [installation](docs/INSTALLATION_GUIDE.zh.md), [migration](docs/archive/MIGRATION.md), and [experiment protocol](docs/ROUTING_SELFTEST_STEPS.zh.md).

<a id="quick-evaluation"></a>
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验路由收益的新假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是以任务类型匹配的客观通过率与完整尝试成本建立保守可行域，再让人工反馈只在可行域内微调偏好，可以比单纯质量先验更稳定地选择路线。推导来自Q02的约束搜索与Q03的主观反馈/未知费用分层，而不是声称现有默认评分已取得收益。新增负担是采集同任务多路线结果、冻结质量判据以及维护证据时效。最小验证用一批固定任务、相同预算上限和相同模型账户，对照手工单路由、当前路由、证据约束路由，盲评合格率并汇总全部失败和重试支出。只有在合格率不降且每份合格交付总支出或人工量降低时支持；若收益仅来自更强模型、更多预算或主观评分则否定机制收益。缺失计费不能补零，应单列不完整成本而非进入节省平均数。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/assignment-solver.mjs:66-70](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/.dsh-plugin/shared/assignment-solver.mjs#L66-L70)

可行域已能排除未知价候选，提供改进接点。

```text
  const constrained = Number.isFinite(budget)
  const options = pools.map(pool => (Array.isArray(pool) ? pool : []).filter(option =>
    option && Number.isFinite(option.cost) && option.cost >= 0 && Number.isFinite(option.score)
    && (!constrained || option.pricingKnown === true)))
  if (options.some(pool => pool.length === 0)) return null
```

**依据 2 · 源码核查**：[.dsh-plugin/shared/adaptive-feedback.mjs:64-85](https://github.com/Alice-Marx/dsh-model-router/blob/e1f7aaa82c1fd7bc921c16ce77937889d3ca9a78/.dsh-plugin/shared/adaptive-feedback.mjs#L64-L85)

反馈准入为客观结果和主观偏好分层提供约束。

<details>
<summary>查看原文（22行）</summary>

```text
function evidenceOf(run, item, options) {
  const reject = reason => ({ event: null, reason })
  const provider = clean(own(item, 'provider'))
  const model = clean(own(item, 'model'))
  if (!provider || !model || provider.includes('\u0000') || model.includes('\u0000')) return reject('invalid-route')
  if (own(item, 'ran') !== true || own(item, 'ok') !== true
    || item.blocked === true || item.waiting === true || item.paused === true
    || item.cancelled === true || (item.status !== undefined && !['succeeded', 'fallback'].includes(item.status))) return reject('not-successful')
  const rating = own(item, 'rating')
  if (rating !== 1 && rating !== -1) return reject(rating === undefined || rating === null || rating === 0 ? 'unrated' : 'invalid-rating')
  // A CLI default or a different actual model must not train the recommended
  // model. Aliases are not silently equated; a future verified adapter may do so.
  if (item.channel === 'official-cli' && clean(own(item, 'actualModel')) !== model) return reject('cli-model-unverified')
  const finishedAt = completedAt(run, item)
  if (finishedAt === null) return reject('invalid-time')
  if (finishedAt > options.now) return reject('future-time')
  if (finishedAt <= options.resetAt) return reject('before-reset')
  const suppliedRatedAt = own(item, 'ratedAt')
  if (suppliedRatedAt !== undefined && suppliedRatedAt !== null) {
    if (!finite(suppliedRatedAt) || suppliedRatedAt < finishedAt) return reject('invalid-time')
    if (suppliedRatedAt > options.now) return reject('future-time')
  }
```

</details>

#### 缺口

- 新证据约束策略尚未实现及对照
  **影响**：只是设计假设，不纳入现有贡献
  **进一步探讨**：实现离线对照后按预注册合格率和成本判据验收

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
