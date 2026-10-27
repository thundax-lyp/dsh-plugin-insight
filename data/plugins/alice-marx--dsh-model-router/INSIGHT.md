# DSH Model Router

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[de82df4](https://github.com/Alice-Marx/dsh-model-router/tree/de82df4e737954ba0458d597ea82f9a6666c1a9b)

<!-- BEGIN META -->
[![GitHub ★ 383](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=383&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alice-Marx/dsh-model-router) [![npm 30d 4,234](https://img.shields.io/static/v1?label=npm+30d&message=4%2C234&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router)
<!-- END META -->

> **实现功能**：在DSH中规划任务、比较模型路由，并通过模型API或厂商CLI执行依赖工作包。

> **核心亮点**：相对手动选择一个模型，实质增量是把依赖工作包、候选路由和预算准入组成可回查的执行契约；相对纯最低价格排序，它把质量下限和路由交接成本纳入选择。小空间精确与大空间有界搜索是组合优化的工程适配，并非全局质量最优或实测省钱。作者主动限定历史厂商运行属于0.20.0，当前0.25.5没有新端到端厂商验收，故贡献只落在可见控制机制。 依据[Q03](#research-q03)。

> **风险与缺陷**：最关键的质疑是路由效用的质量与价格输入是否足够代表真实任务。分配器以数值qualityShortfall/score比较候选，有限预算排除未知价，却无法自行证明输入评分可靠；README明确公共LiveBench为聚合表，没有逐题质量成本矩阵。另一个影响持续采用的边界是中断后预留仍占额度，当前没有手工核销入口，不能为了恢复容量删除状态。它可防重复花费，但也把异常对账交给用户。 依据[Q04](#research-q04)。

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
  - [Q01 · 谁在什么场景需要它，合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、处理链及状态如何实现？](#detail-section-12)
  - [Q03 · 相对简单替代的实质增量是什么？](#detail-section-13)
  - [Q04 · 什么限制最可能使贡献不成立？](#detail-section-14)
  - [Q05 · 启动、持续与恢复依赖哪些条件？](#detail-section-15)
  - [Q06 · 全周期成本和实际效果支持到哪里？](#detail-section-16)
  - [Q07 · 实现有哪些可借鉴处和维护边界？](#detail-section-17)
  - [Q08 · 什么新假设值得验证，怎样推翻它？](#detail-section-18)
  - [Q09 · 对谁值得采用，何时停止？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已配置多家模型、需要把分析、执行和验收拆成依赖工作包的开发者。原办法是手工分配模型、搬运上游输出和记录账单；合格结果应包括每包输出、执行通道、已报用量及失败状态，而不只是一个低价推荐。README明确区分本地规划与付费执行，因此只有反复编排多路任务的人群才有足够采用动机，单一模型日常聊天通常不需要这层工作台。

固定一个强模型并人工分配任务；本次只比较可见编排机制，不主张效果胜出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 路由分配 | 为依赖工作包选择模型 | 代理质量不等于任务成功率 |
| 预算预留 | 并发准入与中断留账 | 预留不是发票 |
| CLI团队 | 用厂商工具串行交接 | 需登录及显式权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH模型及宿主服务 | 必需 | 发现路由和执行 | 不可执行 |
| 厂商CLI与登录 | CLI模式必需 | 运行工作包 | 退回手工/其他已配置路由 |
| 干净Git及写入授权 | 编辑时必需 | 隔离修改 | 不启动编辑 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户配置路由与价格 | 未知不填零 |
| 2 | 生成计划并确认权限 | 每包依赖与通道明确 |
| 3 | 执行后核对回执 | 未决预留先对账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型及CLI账户，费用未知 | 路由、价格、权限配置，耗时未知 | 需要已配宿主模型 |
| 持续使用 | API实付或订阅，非预留值 | 质量校准及逐包验收 | 无单位合格任务对照 |
| 失败恢复 | 可能有已发生调用费用 | 核对账单、保留工作树与预留 | 当前无手工核销入口 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 依赖路由 | 任务拓扑与价格约束 | 真实任务质量 |
| 防并发超支 | 持久预留与所有权检查 | 实际账单完整覆盖 |

> **思考**：最关键的质疑是路由效用的质量与价格输入是否足够代表真实任务。分配器以数值qualityShortfall/score比较候选，有限预算排除未知价，却无法自行证明输入评分可靠；README明确公共LiveBench为聚合表，没有逐题质量成本矩阵。另一个影响持续采用的边界是中断后预留仍占额度，当前没有手工核销入口，不能为了恢复容量删除状态。它可防重复花费，但也把异常对账交给用户。 依据[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手动选择一个模型，实质增量是把依赖工作包、候选路由和预算准入组成可回查的执行契约；相对纯最低价格排序，它把质量下限和路由交接成本纳入选择。小空间精确与大空间有界搜索是组合优化的工程适配，并非全局质量最优或实测省钱。作者主动限定历史厂商运行属于0.20.0，当前0.25.5没有新端到端厂商验收，故贡献只落在可见控制机制。 依据[Q03](#research-q03)。

相对手动选择一个模型，实质增量是把依赖工作包、候选路由和预算准入组成可回查的执行契约；相对纯最低价格排序，它把质量下限和路由交接成本纳入选择。小空间精确与大空间有界搜索是组合优化的工程适配，并非全局质量最优或实测省钱。作者主动限定历史厂商运行属于0.20.0，当前0.25.5没有新端到端厂商验收，故贡献只落在可见控制机制。 依据[Q03](#research-q03)。

值得借鉴的是将预算保留独立于UI作业、在同一状态事务内校验ownerToken，以及对依赖拓扑和未知价格显式拒绝。这些设计可移植到需要防止并发超支的执行器，但须一起移植状态锁、检查点和恢复语义。不能只复制搜索器就声称实现费用可靠性；收益仍受模型质量先验和账单回报完整性限制。

<a id="detail-section-5"></a>

### 1.4 主要限制

最关键的质疑是路由效用的质量与价格输入是否足够代表真实任务。分配器以数值qualityShortfall/score比较候选，有限预算排除未知价，却无法自行证明输入评分可靠；README明确公共LiveBench为聚合表，没有逐题质量成本矩阵。另一个影响持续采用的边界是中断后预留仍占额度，当前没有手工核销入口，不能为了恢复容量删除状态。它可防重复花费，但也把异常对账交给用户。 依据[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可供已有多路模型配置的开发者先在只读、小额、可人工验收的依赖任务里试用；先检查价格缺失、quality来源和执行权限，验收每包结果及通道回执。遇到未知费用、遗留预留或输出质量持续弱于固定模型时停止自动路由，保留历史与工作树，返回手工指定模型并对账。尚不支持把当前源码检查升级为日常自动编辑或持续安装验收。 依据[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的机制判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、.dsh-plugin/shared/assignment-solver.mjs、.dsh-plugin/shared/budget-reservations.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定版本的作者说明、注册入口和下列实际源码；未执行目标代码、安装或真实宿主验收。
- 下一步：- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

**分析版本**

- **仓库**：[Alice-Marx/dsh-model-router](https://github.com/Alice-Marx/dsh-model-router)
- **版本号**：0.25.5（[固定提交 de82df4](https://github.com/Alice-Marx/dsh-model-router/tree/de82df4e737954ba0458d597ea82f9a6666c1a9b)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把每类工作包的实际合格结果与资源回执绑定，按任务类别校准质量下限，能够减少聚合榜单与真实任务的错配。最小对照固定模型集合、输入与总预算，对比固定强模型、最低价路由和当前策略，记录全包合格率、实付额、重试及人工时间。若质量不降条件下实际支出没有改善，或校准样本的维护成本超过节约，应否定该方向而保留手工指定。 依据[Q08](#research-q08)。

- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 14483 | 14228 | 399 | — |
| .mjs | source | 107 | 24860 | 21652 | 2045 | — |
| .jsx | source | 7 | 3490 | 3238 | 130 | — |
| .md | source | 58 | 15424 | — | — | 180702 |
| .mjs | test | 104 | 23898 | 22164 | 399 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Alice-Marx/dsh-model-router/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Alice-Marx/dsh-model-router/issues?q=is%3Aissue+created%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Alice-Marx/dsh-model-router/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：预算敏感的多模型工作是否能靠可审计路由减少手工编排而不混淆估价与实际费用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么场景需要它，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

适合已配置多家模型、需要把分析、执行和验收拆成依赖工作包的开发者。原办法是手工分配模型、搬运上游输出和记录账单；合格结果应包括每包输出、执行通道、已报用量及失败状态，而不只是一个低价推荐。README明确区分本地规划与付费执行，因此只有反复编排多路任务的人群才有足够采用动机，单一模型日常聊天通常不需要这层工作台。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-24](https://github.com/Alice-Marx/dsh-model-router/blob/de82df4e737954ba0458d597ea82f9a6666c1a9b/README.md#L14-L24)

作者限定多路工作台和当前验证边界。

<details>
<summary>查看原文（11行）</summary>

```text

Official CLI teamwork runs packages sequentially with dependency context and no automatic model-directory API fallback. Editable teams explicitly choose the Harness sandbox or the vendor CLI's normal environment. In the latter, Git worktrees collect edits but do not restrict OS access. CLIs retain their configured model unless explicitly mapped. See [real Windows validation and its limits](docs/releases/0.20.0-validation.md).

Both README versions describe the same interfaces, formulas, defaults and limits. [Changelog](CHANGELOG.md) preserves release history. More walkthroughs: [workbench](docs/WORKBENCH_USER_GUIDE.zh.md), [installation](docs/INSTALLATION_GUIDE.zh.md), [migration](docs/archive/MIGRATION.md), and [experiment protocol](docs/ROUTING_SELFTEST_STEPS.zh.md).

<a id="quick-evaluation"></a>

## Quick evaluation

**One-line value:** A cost-aware DSH workbench for planning tasks, routing model calls, and running dependent work packages with explicit execution permissions.

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、处理链及状态如何实现？

**研究主题**：功能与机制

#### 完整回答

入口导入计划、预算预留、执行生命周期与CLI团队等独立模块，并声明tools、llm及sandbox等宿主服务。分配器先验证任务唯一ID和拓扑依赖，再过滤未知价格的有限预算候选；比较质量放宽、质量缺口、目标效用、费用和跨路由切换。预算模块把API预留与订阅用量分开，带ownerToken及active/interrupted状态，未知或中断已开始包不会被解释成无费用。由此能核实计划与计费约束的结构，不能认定实际模型质量符合代理分数。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/assignment-solver.mjs:52-70](https://github.com/Alice-Marx/dsh-model-router/blob/de82df4e737954ba0458d597ea82f9a6666c1a9b/.dsh-plugin/shared/assignment-solver.mjs#L52-L70)

任务拓扑与有限预算价格过滤。

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

**依据 2 · 源码核查**：[.dsh-plugin/shared/budget-reservations.mjs:46-59](https://github.com/Alice-Marx/dsh-model-router/blob/de82df4e737954ba0458d597ea82f9a6666c1a9b/.dsh-plugin/shared/budget-reservations.mjs#L46-L59)

订阅与API预留分开，未知留存。

<details>
<summary>查看原文（14行）</summary>

```text
/** Live and unreconciled interrupted work occupies today's and this month's room. */
export function reservationSpending(state, { excludeReservationId = null } = {}) {
  let reservedUsd = 0
  let unknownReservations = 0
  for (const entry of Object.values(state?.budgetReservations ?? {})) {
    if (!record(entry) || entry.id === excludeReservationId) continue
    for (const item of Array.isArray(entry.packages) ? entry.packages : []) {
      if (item.billing === 'subscription') continue
      if (amount(item.estimatedCostUsd)) reservedUsd += item.estimatedCostUsd
      if (!amount(item.estimatedCostUsd) || (entry.status === 'interrupted' && item.started)) unknownReservations += 1
    }
  }
  return { today: reservedUsd, month: reservedUsd, unknownToday: unknownReservations,
    unknownMonth: unknownReservations, reservedUsd, unknownReservations }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对简单替代的实质增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对手动选择一个模型，实质增量是把依赖工作包、候选路由和预算准入组成可回查的执行契约；相对纯最低价格排序，它把质量下限和路由交接成本纳入选择。小空间精确与大空间有界搜索是组合优化的工程适配，并非全局质量最优或实测省钱。作者主动限定历史厂商运行属于0.20.0，当前0.25.5没有新端到端厂商验收，故贡献只落在可见控制机制。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/assignment-solver.mjs:1-25](https://github.com/Alice-Marx/dsh-model-router/blob/de82df4e737954ba0458d597ea82f9a6666c1a9b/.dsh-plugin/shared/assignment-solver.mjs#L1-L25)

确定性代理目标而非实际质量。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * Deterministic assignment over retained candidate actions, not actual answer quality.
 * Small spaces enumerate exactly; larger spaces use safe boundary-state dominance
 * and future-aware bounded frontier retention without a global optimality claim.
 */
const EPSILON = 1e-12
const compareText = (a, b) => a < b ? -1 : a > b ? 1 : 0

const choiceSignature = option => {
  if (option.actionId === undefined && option.effort === undefined && option.reasoningEffort === undefined) return option.route
  return JSON.stringify([option.actionId ?? option.route, option.effort ?? option.reasoningEffort ?? null])
}

const signature = state => JSON.stringify(state.choices.map(choiceSignature))

const compareQuality = (left, right) =>
  left.relaxedCount - right.relaxedCount || left.qualityShortfall - right.qualityShortfall

function compareStates(left, right, minimizeCost = false) {
  return left.relaxedCount - right.relaxedCount
    || left.qualityShortfall - right.qualityShortfall
    || (minimizeCost ? left.cost - right.cost : right.score - left.score)
    || (minimizeCost ? right.score - left.score : left.cost - right.cost)
    || left.switches - right.switches
    || compareText(signature(left), signature(right))
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么限制最可能使贡献不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键的质疑是路由效用的质量与价格输入是否足够代表真实任务。分配器以数值qualityShortfall/score比较候选，有限预算排除未知价，却无法自行证明输入评分可靠；README明确公共LiveBench为聚合表，没有逐题质量成本矩阵。另一个影响持续采用的边界是中断后预留仍占额度，当前没有手工核销入口，不能为了恢复容量删除状态。它可防重复花费，但也把异常对账交给用户。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:405-417](https://github.com/Alice-Marx/dsh-model-router/blob/de82df4e737954ba0458d597ea82f9a6666c1a9b/README.md#L405-L417)

作者说明搜索范围及真实增益缺口。

<details>
<summary>查看原文（13行）</summary>

````text
$`U_c`$ is `costUtility`. The price symbols are the same as above. $`C_{\mathrm{ref}}`$ uses fixed reference prices (input 1, output 5, cache read/write 1 USD/million), not a vendor offer. Fixed scaling prevents an unrelated expensive candidate from flattening all cost penalties. Unknown prices produce a public estimate of `null` and cost utility 0. Internal unconstrained search uses a cost sentinel of 0, but finite-budget assignment excludes unknown-price candidates; the sentinel never means free execution.

### Candidate objective and quality floors

With normalized quality $`q`$ and normalized latency, specialty, reasoning-fit and risk proxies:

<!-- formula:latency-utility -->
```math
L = \begin{cases}
\dfrac{1}{1+t/10\,000}, & t\text{ known}, \\
1-\min(1,\max(0,\ell e_\ell)), & \text{otherwise}.
\end{cases}
```
````

</details>

#### 缺口

- 质量先验与真实任务成功率的映射未有逐题同条件结果。
  **影响**：不能证明自动路由省钱且质量不退步。
  **进一步探讨**：比较相同工作包的合格率、实付与人工核对成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续与恢复依赖哪些条件？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动依赖匹配peer范围的DSH服务，模型API路由要有宿主配置、凭据和可用网络；CLI执行另依赖已安装且登录的厂商工具。编辑模式需要干净Git工作区及当前授权，cli-native使用OS用户权限，工作树不构成权限沙箱。状态存入DSH_HOME下model-router/state.json；升级需停全Host并备份，旧版本拒读v3。中断时先核对原任务、保留工作树和厂商账单，不能自动重放或假定预留已经结清。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:46-54](https://github.com/Alice-Marx/dsh-model-router/blob/de82df4e737954ba0458d597ea82f9a6666c1a9b/README.md#L46-L54)

配置、状态、权限与兼容说明。

```text

**Permissions and risks:** Planning is local and makes no model call. Execution sends the selected task/context to the chosen model API or vendor CLI and may incur charges. The default Harness-restricted environment separates read-only runs from approved `workspace-write` runs. An explicitly selected `cli-native` editable team runs with the current OS user's permissions, outside the Harness process sandbox; a Git worktree collects changes but does not restrict OS access. External providers and CLI services apply their own data handling and billing terms.

**Compatibility:** Declared host support is DeepSeek Harness Desktop **0.2.0-rc.1**, **0.2.0-rc.2**, **0.2.1-rc.2**, and **0.2.1-rc.3**. Source builds pin the published **0.2.1-rc.3** SDK packages; retaining an older peer declaration does not turn offline tests into installed-Desktop acceptance. Node.js **>=22.19** and pnpm **10.34.6** are source development/build requirements, not plugin runtime prerequisites. Compatibility beyond the declared host versions is not claimed.

**Contents:** [Quick evaluation](#quick-evaluation) · [Capabilities](#capabilities) · [Install](#install) · [Workbench](#workbench) · [Architecture](#architecture) · [Session tools](#session-tools) · [Official tools](#official-tools) · [Team lifecycle](#team-lifecycle) · [Costs](#costs) · [Routing algorithm](#routing) · [Data](#data) · [Development](#development) · [Troubleshooting](#troubleshooting)

<a id="capabilities"></a>

```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 全周期成本和实际效果支持到哪里？

**研究主题**：效果与总成本

#### 完整回答

计量单位应是一组全部满足验收的依赖工作包。首次成本是配置模型、价格、权限和CLI，持续成本包括厂商调用、手工质量校准及记录复核，失败时还要核对未决预留和重复调用风险。订阅调用与API金额分账能避免把订阅余量当美元预算，但缺失token保持未知，估计预留不是账单。没有同条件任务样本、当前版本实付金额和人工时间，不能断言比固定强模型更便宜。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/budget-reservations.mjs:1-4](https://github.com/Alice-Marx/dsh-model-router/blob/de82df4e737954ba0458d597ea82f9a6666c1a9b/.dsh-plugin/shared/budget-reservations.mjs#L1-L4)

预留不是账单。

```text
/**
 * Durable execution holds. Every transition uses router-state's one file-lock
 * transaction, so another Host cannot approve against an out-of-date balance.
 * A hold is a remaining estimate, never an invoice or proof of a zero charge.
```

#### 缺口

- 当前版本单位合格任务的现金与人工总成本未知。
  **影响**：只能给小额只读试用建议。
  **进一步探讨**：对同一组依赖工作包保存通道回执与全部失败成本。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可借鉴处和维护边界？

**研究主题**：工程质量与复用

#### 完整回答

值得借鉴的是将预算保留独立于UI作业、在同一状态事务内校验ownerToken，以及对依赖拓扑和未知价格显式拒绝。这些设计可移植到需要防止并发超支的执行器，但须一起移植状态锁、检查点和恢复语义。不能只复制搜索器就声称实现费用可靠性；收益仍受模型质量先验和账单回报完整性限制。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/budget-reservations.mjs:92-99](https://github.com/Alice-Marx/dsh-model-router/blob/de82df4e737954ba0458d597ea82f9a6666c1a9b/.dsh-plugin/shared/budget-reservations.mjs#L92-L99)

所有权检查拒绝不匹配执行。

```text
function ownedReservation(current, reservationId, ownerToken) {
  const entry = current.budgetReservations?.[reservationId]
  if (!entry || entry.ownerToken !== ownerToken || entry.status !== 'active') {
    const error = new Error('执行预占不存在、已中断或属于其他执行；原记录未修改。')
    error.code = 'ROUTER_RESERVATION_OWNERSHIP'
    throw error
  }
  return entry
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 什么新假设值得验证，怎样推翻它？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把每类工作包的实际合格结果与资源回执绑定，按任务类别校准质量下限，能够减少聚合榜单与真实任务的错配。最小对照固定模型集合、输入与总预算，对比固定强模型、最低价路由和当前策略，记录全包合格率、实付额、重试及人工时间。若质量不降条件下实际支出没有改善，或校准样本的维护成本超过节约，应否定该方向而保留手工指定。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/assignment-solver.mjs:16-25](https://github.com/Alice-Marx/dsh-model-router/blob/de82df4e737954ba0458d597ea82f9a6666c1a9b/.dsh-plugin/shared/assignment-solver.mjs#L16-L25)

代理目标的排序为校准假设提供参照。

<details>
<summary>查看原文（10行）</summary>

```text
const compareQuality = (left, right) =>
  left.relaxedCount - right.relaxedCount || left.qualityShortfall - right.qualityShortfall

function compareStates(left, right, minimizeCost = false) {
  return left.relaxedCount - right.relaxedCount
    || left.qualityShortfall - right.qualityShortfall
    || (minimizeCost ? left.cost - right.cost : right.score - left.score)
    || (minimizeCost ? right.score - left.score : left.cost - right.cost)
    || left.switches - right.switches
    || compareText(signature(left), signature(right))
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得采用，何时停止？

**研究主题**：采用判断

#### 完整回答

可供已有多路模型配置的开发者先在只读、小额、可人工验收的依赖任务里试用；先检查价格缺失、quality来源和执行权限，验收每包结果及通道回执。遇到未知费用、遗留预留或输出质量持续弱于固定模型时停止自动路由，保留历史与工作树，返回手工指定模型并对账。尚不支持把当前源码检查升级为日常自动编辑或持续安装验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:164-172](https://github.com/Alice-Marx/dsh-model-router/blob/de82df4e737954ba0458d597ea82f9a6666c1a9b/README.md#L164-L172)

作者说明保留预留时需要原任务与账单核查。

````text
  CLI --> LEDGER[Results, identity, usage and cost ledger]
  API --> LEDGER
  PATCH --> LEDGER
```

| Path | Selection and permissions | Failure/fallback behavior |
| --- | --- | --- |
| Routed execution | `model_router_execute` / workbench `executor: "routed"`; read-only; CLI or Harness model API according to execution/billing policy. | An eligible API fallback can follow the configured subscription policy. |
| Official CLI, Harness environment | Single-tool `model_router_tool_run` or team execution; only currently supported/ready CLI modes; Host sandbox required. | Missing confinement or readiness blocks launch. No automatic API fallback. |
````

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
