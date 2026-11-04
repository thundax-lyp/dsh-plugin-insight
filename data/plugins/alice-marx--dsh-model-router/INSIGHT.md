# DSH Model Router

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3197b1e](https://github.com/Alice-Marx/dsh-model-router/tree/3197b1e81978af87fffe2712fd79238ef3d51dda)

<!-- BEGIN META -->
[![GitHub ★ 700](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=700&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alice-Marx/dsh-model-router) [![npm 30d 5,824](https://img.shields.io/static/v1?label=npm+30d&message=5%2C824&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-router)
<!-- END META -->

> **功能**：为 DSH 提供多模型任务路由、依赖工作包、预算记账及官方 CLI 执行入口。

> **亮点**：[Q02](#research-q02)、[Q03](#research-q03) 支持把依赖路由和预算准入组成可回查执行约束；[Q04](#research-q04) 的托管任务保留UNKNOWN及对账能力，但未证明端到端节约或全部远程安全。

> **主要限制**：[Q01](#research-q01) 的README仍指旧预览与稳定版，而固定包是preview.7且默认启动Bot产品；[Q02](#research-q02)、[Q04](#research-q04) 的质量先验与迁移、远端恢复证据不足，使无人值守采用条件未成立。

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
  - [Q01 · 固定包真实类型、默认入口与目标用户是什么？](#detail-section-11)
  - [Q02 · 分配搜索提供何种相对增量，质量输入能证明什么？](#detail-section-12)
  - [Q03 · 预算预留和检查点如何处理重复执行与未知费用？](#detail-section-13)
  - [Q04 · 默认Bot、托管任务和迁移栅栏怎样接线及限定恢复？](#detail-section-14)
  - [Q05 · 全周期成本和采用结论应如何约束？](#detail-section-15)
  - [Q06 · 能从质量和状态不确定性推导什么可证伪方向？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有多路模型或官方CLI配置、反复处理依赖工作包的开发者，提供路由规划和带回执的执行组织；当前预览须与生产数据隔离。

参照手工精确路由、固定强模型和最低已知价选择；聚合质量和预估金额不能替代任务验收与账单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 候选路由分配 | 按任务依赖和预算选动作 | 代理质量不等真实质量 |
| API及订阅记账 | 区分货币与用量 | 未知账单保留未知 |
| 检查点执行 | 保留启动、结果和费用 | 故障停后续，非外部回滚 |
| 官方CLI入口 | 使用固定工具执行 | 需账户、入口和权限验证 |
| 默认Bot产品 | 统一运行时与SQLite状态 | 预览迁移未完整验收 |
| 托管任务 | 派发、读取、取消与对账 | 后端和目标能力单独约束 |
| 远程后端组合 | 文件、命令和可选CLI | 全链安全与结果未在本次核实 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| package声明的精确Host服务 | 启动必需 | 原生工具与Web产品 | 版本声明不等加载验收 |
| 独立home、SQLite和状态副本 | 预览采用必需 | 默认Bot及持久任务 | 不迁生产数据，保留稳定配置 |
| 精确模型路由与账户 | 对应执行必需 | 调用配置模型 | 未配置不应静默切换 |
| 已知价格和预算 | 有限API预算必需 | 准入与对账 | 未知价格或费用需暂停核对 |
| 固定CLI入口与权限 | 对应CLI必需 | 校验可执行入口与模型 | 不由任务自由指定 |
| 远程目标授权 | 远程能力必需 | 文件、命令与CLI后端 | 全链行为尚未核实 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户隔离home并核版本、路由、价格 | 不触生产状态，迁移门允许 |
| 规划 | Agent生成依赖工作包 | 人工确认输出、通道、权限与预算 |
| 执行 | 从只读小任务开始，Host预留与检查点 | 每包结果及用量未知都明确 |
| 验收 | 人工验交付并对账 | 不把取消或UNKNOWN当未执行 |
| 失败 | 停后续任务保状态 | 先查账单和对账能力，再决定重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型或CLI账户、本地SQLite | 路由、价格、权限与隔离配置 | 时间及preview迁移成本未知 |
| 持续使用 | API实付或订阅、任务存储 | 校准质量与逐包验收 | 无合格任务单位成本 |
| 失败恢复 | 已发生调用、未决预留 | 账单、状态与远端结果对账 | 取消不等无费用 |
| 迁移和退出 | 状态备份与独立稳定配置 | 保留任务记录手工接管 | 不删除预留腾额度 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 依赖路由 | 拓扑与已知价约束搜索 | 实际任务质量与净节约 |
| 预算控制 | ownerToken与启动结果检查点 | 外部账单完整性 |
| 托管恢复 | UNKNOWN与绑定对账入口 | 默认产品跨Host及远端全链正确性 |
| 迁移准入 | 新启动检查维护门 | 停止旧Host与完整迁移验收 |

> **思考**：[Q01](#research-q01) 的README仍指旧预览与稳定版，而固定包是preview.7且默认启动Bot产品；[Q02](#research-q02)、[Q04](#research-q04) 的质量先验与迁移、远端恢复证据不足，使无人值守采用条件未成立。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)、[Q03](#research-q03) 支持把依赖路由和预算准入组成可回查执行约束；[Q04](#research-q04) 的托管任务保留UNKNOWN及对账能力，但未证明端到端节约或全部远程安全。

[Q03](#research-q03) 将强制检查点与UI分离、保留未知金额值得借鉴；[Q04](#research-q04) 派发引用和对账租约限定恢复权限，但必须连同后端和旧Host生命周期核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 的README仍指旧预览与稳定版，而固定包是preview.7且默认启动Bot产品；[Q02](#research-q02)、[Q04](#research-q04) 的质量先验与迁移、远端恢复证据不足，使无人值守采用条件未成立。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 当前保持观察，隔离home只评估可人工验收的只读小任务；未决费用、迁移拒绝或状态不符时停止新任务，保留状态并回独立稳定配置。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

路由、预算、默认Bot与任务对账接线获得源码支持；preview.7宿主、真实厂商、迁移及远端全链验收未取得，采用保持观察；资格过滤校准是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、.dsh-plugin/index.mjs、.dsh-plugin/shared/router.mjs、.dsh-plugin/shared/assignment-solver.mjs、.dsh-plugin/shared/budget-reservations.mjs、.dsh-plugin/shared/execution-lifecycle.mjs、packages/orchestration/src/product-composition.mjs、packages/orchestration/src/task-service.mjs、packages/orchestration/src/migration-startup-gate.mjs、.dsh-plugin/shared/task-executors.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件抽读包与默认apply、路由solver、预算生命周期、Bot组合、task-service和迁移启动门；未穷举vendor Bot、远程服务、全部CLI或迁移全链。根inventory包含大量第三方与新模块，不将总行数当原创贡献。未执行目标代码。
- 下一步：隔离home固定只读任务、模型和预算，对比手工与路由；注入检查点失败、断连和旧Host并发，核UNKNOWN、账单、任务回执与恢复人工时间。

**分析版本**

- **仓库**：[Alice-Marx/dsh-model-router](https://github.com/Alice-Marx/dsh-model-router)
- **版本号**：0.26.0-preview.7（[固定提交 3197b1e](https://github.com/Alice-Marx/dsh-model-router/tree/3197b1e81978af87fffe2712fd79238ef3d51dda)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出未验证方向，仅让合格任务与范围明确的费用回执参与现有质量资源校准；若同预算不改善合格率或净成本，或对账负担超过收益则否定。

隔离home固定只读任务、模型和预算，对比手工与路由；注入检查点失败、断连和旧Host并发，核UNKNOWN、账单、任务回执与恢复人工时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 31997 | 31194 | 902 | — |
| .mjs | source | 143 | 33789 | 29685 | 2712 | — |
| .jsx | source | 9 | 3570 | 3310 | 128 | — |
| .md | source | 8 | 947 | — | — | 15097 |
| .ts | source | 18 | 2531 | 1952 | 518 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/Alice-Marx/dsh-model-router/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定preview.7的路由、预算与默认Bot任务组合能支持何种可核对执行，哪些效果与迁移保证仍缺证据？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 固定包真实类型、默认入口与目标用户是什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

固定package是@ljwei-stak/dsh-model-router 0.26.0-preview.7，出口为.dsh-plugin/index.mjs并带DSH bundle及Web客户端，属于原生插件。目标是已配置多路模型或官方CLI、需要按依赖工作包分工和对账的开发者；简单单模型聊天通常没有足够理由承担这套状态和配置。合格结果应有每包输出、实际通道、用量或费用未知状态及人工验收，而非只有低价推荐。

README的稳定说明仍是0.25.5，预览段也停在preview.2；不能据此把preview.7直接称为稳定版本或沿用旧兼容与执行验收。当前apply默认botProduct=true，满足真实Host服务时组合DS Bot运行时并打开延迟SQLite状态，不再仅是一个无状态路由工具。轻量测试context会保留legacy路径，所以直接函数调用通过也不能代表默认宿主产品成功。应在独立home/profile中检查实际版本、启动服务和旧插件内部ID冲突。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-38](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/package.json#L1-L38)

固定版本、包入口、bundle与客户端构成真实类型。

<details>
<summary>查看原文（38行）</summary>

```text
{
  "name": "@ljwei-stak/dsh-model-router",
  "version": "0.26.0-preview.7",
  "type": "module",
  "description": "Model Router for official DeepSeek Harness Desktop: cost-aware task routing, dependent work packages and official vendor CLI discovery, installation and execution. GAL is available separately as @ljwei-stak/dsh-galgame.",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Alice-Marx/dsh-model-router.git"
  },
  "homepage": "https://github.com/Alice-Marx/dsh-model-router#readme",
  "bugs": {
    "url": "https://github.com/Alice-Marx/dsh-model-router/issues"
  },
  "publishConfig": {
    "access": "public"
  },
  "main": "./.dsh-plugin/index.mjs",
  "exports": {
    ".": "./.dsh-plugin/index.mjs",
    "./client": "./.dsh-plugin/client.js",
    "./web-search": "./modules/bot-runtime/web-search.mjs",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-plugin-manager"
      ]
```

</details>

**依据 2 · 作者声明**：[README.md:11-17](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/README.md#L11-L17)

作者仅限定旧预览和稳定说明及历史厂商验收。

```text
**Opt-in preview: 0.26.0-preview.2.** This compatibility update adds the exact **0.2.1-rc.5** Host peer version and pins the source SDK to rc.5; preview.1 is rejected by rc.5 before its plugin loads. Publication is established by the actual registry entry, not this text. This model-router plugin preview is for isolated evaluation, not automatic production upgrades. Integration with the DS Bot desktop application and computer-operation features is still in progress; a complete integrated DS Bot application has not yet been delivered. In **Harness Desktop → Plugins → Add plugin**, use `@ljwei-stak/dsh-model-router@0.26.0-preview.2` only in a separate test profile/home with backups. The stable instructions below stay on 0.25.5; `latest` is not the preview channel. Read the [preview trial guide](https://gitlab.com/Alice_marx/dsh-model-router/-/blob/main/docs/releases/0.26.0-preview.2-trial.md) and [validation limits](https://gitlab.com/Alice_marx/dsh-model-router/-/blob/main/docs/releases/0.26.0-preview.2-validation.md) before installing. Full migration activation, all-domain stop-write and post-activation rollback remain unavailable. No new real-provider or production-profile acceptance is claimed.

A cost-aware model-routing workbench for **DeepSeek Harness Desktop**. Plan locally, compare configured routes, inspect execution permissions, and run dependent work packages through model APIs or supported official vendor CLIs.

Stable version: **0.25.5** (`@ljwei-stak/dsh-model-router`). This update fixes garbled ZCode TUI box drawing, CJK text and broken color sequences in Windows embedded terminals. Each new ZCode PTY enables UTF-8 before Node starts; system settings remain unchanged. The standalone community ZCode CLI retains both npm and GitHub Release installation methods. It retains the **0.2.1-rc.3** SDK and existing Host peer range. API calls use monetary accounting and daily/monthly budget reservations; subscriptions use a separate ledger of calls and reported tokens. Confirmed subscription execution is not blocked only because the API budget is exhausted or API prices are missing. A switch to an API must be priced and admitted before that API call; mixed results retain both channel receipts. The workbench separates API spending/reservations from subscription usage, with unknown counters kept unknown. Workbench execution shows live elapsed time and per-package progress, supports cancellation with completed results and reported costs retained, and reconnects to the active job when the panel is reopened. Choose algorithm recommendations or manually assign each decomposed package to an exact model API or official tool, preserving dependencies, refreshed cost previews and retry targets. Routing now supports task-specific quality evidence, joint model/effort selection, historical P90 resource estimates and dependency-aware search. Manual mixed execution is read-only; tools use their configured default model, while the existing editable official-team workflow remains available. Compatibility covers **DeepSeek Harness Desktop 0.2.0-rc.1 / 0.2.0-rc.2 / 0.2.1-rc.2 / 0.2.1-rc.3**, including Hermes/Pi installation and terminal support; neither has a verified managed runner yet. Real vendor execution evidence remains tied to **0.20.0**, with no new model experiments in this release. The router and [GAL](https://github.com/Alice-Marx/deepseek-harness-galgame) have been independent plugins since 0.12.0.

Official CLI teamwork runs packages sequentially with dependency context and no automatic model-directory API fallback. Editable teams explicitly choose the Harness sandbox or the vendor CLI's normal environment. In the latter, Git worktrees collect edits but do not restrict OS access. CLIs retain their configured model unless explicitly mapped. See [real Windows validation and its limits](https://gitlab.com/Alice_marx/dsh-model-router/-/blob/main/docs/releases/0.20.0-validation.md).
```

**依据 3 · 源码核查**：[.dsh-plugin/index.mjs:75-93](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/index.mjs#L75-L93)

默认Bot产品与合并服务声明。

<details>
<summary>查看原文（19行）</summary>

```text
import { inject as botRuntimeInject } from '../modules/bot-runtime/index.mjs'
import { createDiagnosticAccountStream, startBotProduct } from '../packages/orchestration/src/product-composition.mjs'
import { createDeferredRouterState } from '../packages/orchestration/src/deferred-router-state.mjs'
import { BotRuntimeConfig, normalizeBotRuntimeConfig } from '../packages/orchestration/src/bot-runtime-config.mjs'
import { assertMigrationStartupAllowed } from '../packages/orchestration/src/migration-startup-gate.mjs'

// Cordis plugin name, matching the profile entry id; unchanged by the 0.13.0 package rename.
export const name = 'model-router-galgame'
// One plugin entry: the DS Bot runtime injects are merged with the MR body's.
export const inject = [...new Set([...botRuntimeInject, 'commands', 'llm', 'tools', 'typert', 'sandboxPolicy', 'sandbox'])]

export const Config = z.object({
  requireBotPolicy: z.boolean().default(false),
  // Unified Bot product composition (DS Bot runtime + this plugin). Isolated
  // test compositions provide their own policy/runtime and disable this.
  botProduct: z.boolean().default(true),
  // The former ds-bot entry's runtime options, kept separately from MR settings.
  // Non-volatile: changing home/workspace restarts the owning runtime.
  botRuntime: BotRuntimeConfig,
```

</details>

**依据 4 · 源码核查**：[.dsh-plugin/index.mjs:2251-2280](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/index.mjs#L2251-L2280)

真实Host条件、SQLite状态和Bot产品启动实际接线。

<details>
<summary>查看原文（30行）</summary>

```text
export function apply(ctx, config = {}) {
  // The unified Bot product composes the frozen DS Bot runtime with this plugin
  // body inside one Host. Lightweight direct apply() callers (plain-object test
  // contexts) have no Cordis surface or DS services and keep the legacy MR
  // behavior; a real DSH Host always provides the runtime's services.
  const botProductEnabled = (() => { const value = config?.botProduct; return (typeof value === 'function' ? value() : value) !== false })()
  const productHost = botProductEnabled && typeof ctx?.provide === 'function' && typeof ctx?.effect === 'function'
    && ['llm', 'tools', 'systemPrompt', 'sessionController', 'sessions', 'sessionTitle', 'workspaceRegistry', 'connection']
      .every(name => { try { return ctx.get(name) !== undefined } catch { return false } })
  if (typeof ctx?.provide === 'function' && typeof ctx?.effect === 'function') assertMigrationStartupAllowed({ home: resolveStateHome() })
  let deferredRouterState = null
  if (productHost && ctx.get('botIntegrationPolicy') === undefined) {
    const storageFile = join(resolveStateHome(), 'model-router', 'orchestration.sqlite')
    deferredRouterState = createDeferredRouterState({ file: storageFile })
    installRouterStateStore(deferredRouterState.state)
  }
  let botProduct
  const taskCli = (() => { const value = config?.taskCli; return (typeof value === 'function' ? value() : value) ?? null })()
  try {
    botProduct = productHost ? startBotProduct(ctx, { accountStream: createDiagnosticAccountStream(),
      deferredRouterState, storageFile: deferredRouterState?.state.file, legacyFile: defaultStatePath(),
      // N09: the managed Task runner reuses this plugin's own execution entries,
      // so the composition never needs a second copy of the MR runtime.
      mr: { executeConfiguredAssignment, rerunRecordedStep, routerStateStore }, taskCli,
      runtimeConfig: normalizeBotRuntimeConfig(config?.botRuntime) }) : null
  } catch (error) {
    deferredRouterState?.reject(error)
    throw error
  }
  if (botProduct) ctx.effect(() => async () => { await botProduct.dispose() }, 'model-router-galgame: bot product')
```

</details>

#### 缺口

- README未给出preview.7同版完整迁移和宿主验收说明。
  **影响**：不能把stable或preview.2的指导直接升级为当前持续采用依据。
  **进一步探讨**：由维护者给出该完整提交对应的独立profile启动、迁移、回滚与任务验收记录。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 分配搜索提供何种相对增量，质量输入能证明什么？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

路由模块导入solveCandidateAssignments，把候选动作交给确定性分配器。分配器要求唯一任务ID和已按拓扑排列的依赖；有限预算下只保留cost可用且pricingKnown=true的候选。小空间精确枚举，超过阈值改用有界前沿搜索；源码明确不保证大空间全局最优。比较器先看质量放宽与缺口，再按成本或效用等字段决策，支持把任务依赖、价格与质量约束组成可回查计划。

相对手工逐个选模型或只按最低价，它增加依赖分工和约束记录；但质量、任务类型及资源预测仍依赖输入证据。公开聚合榜、用户估计或启发式不能自动代表当前任务合格率，缺价格也不应填零。router保留qualitySource并在质量证据不全时不输出节约结论。此处可确认控制机制和有界算法，不可确认实际输出更好、更快或更便宜，也不把组合优化归为全新算法首创。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/router.mjs:1-17](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/router.mjs#L1-L17)

真实调用方导入分配器和质量资源预测模块。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Shared, deterministic routing model used by the Host and GAL client.
 * It intentionally exposes an auditable decision record, not private model
 * reasoning. The optimizer is a constrained assignment heuristic over a small
 * task DAG; this keeps plan generation bounded and reproducible in a desktop
 * process while retaining the same objective used in the thesis model.
 */

import { DEFAULT_ROUTING_PRESET, normalizeRoutingPreset, presetFloor, presetWeights } from './routing-presets.mjs'
import { liveBenchRow } from './livebench.mjs'
import { solveCandidateAssignments } from './assignment-solver.mjs'
import { predictQuality, predictResources } from './routing-evidence.mjs'

export const OBJECTIVE_WEIGHTS = Object.freeze({
  simple: Object.freeze({ quality: 0.28, cost: 0.45, latency: 0.14, specialty: 0.04, reasoning: 0.07, risk: 0.02 }),
  balanced: Object.freeze({ quality: 0.40, cost: 0.26, latency: 0.10, specialty: 0.09, reasoning: 0.10, risk: 0.05 }),
  complex: Object.freeze({ quality: 0.48, cost: 0.14, latency: 0.06, specialty: 0.14, reasoning: 0.11, risk: 0.07 }),
```

</details>

**依据 2 · 源码核查**：[.dsh-plugin/shared/assignment-solver.mjs:1-23](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/assignment-solver.mjs#L1-L23)

明确作用为候选动作优化而非真实回答质量，比较质量缺口。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[.dsh-plugin/shared/assignment-solver.mjs:52-70](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/assignment-solver.mjs#L52-L70)

拓扑约束与有限预算已知价过滤。

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

**依据 4 · 源码核查**：[.dsh-plugin/shared/assignment-solver.mjs:108-122](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/assignment-solver.mjs#L108-L122)

实际精确与beam路径选择。

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

**依据 5 · 源码核查**：[.dsh-plugin/shared/router.mjs:1125-1134](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/router.mjs#L1125-L1134)

质量证据不完整时节约值不产生。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预算预留和检查点如何处理重复执行与未知费用？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

执行生命周期独立于UI观察器，先创建ownerToken和预算管理器、恢复已死执行，再登记预留。每包启动前强制检查点并复核预算，结果返回后记录完成集合再持久；保存失败将生命周期置poisoned，阻止后续步骤。ownerToken与active状态在预留变更时校验，避免另一个执行随意释放原预留。

API预估金额与订阅用量分开；活跃和未核对中断预留仍占预算。已开始但未收到结果的包保留costUsd=null及interrupted-usage-unknown，不解释为未收费。正常finish才删除预留；中断保留记录是避免重复超支的保守选择，也会让用户为未决费用对账。预留估计和已报用量不是外部账单的完整证明，取消无法撤销已发生调用。当前旧式预算记录的手工核销入口在README中明确缺失，不能因新增托管task/reconcile就推断旧账全部可核销。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/execution-lifecycle.mjs:8-63](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/execution-lifecycle.mjs#L8-L63)

预留、ownerToken和强制持久失败停止链。

<details>
<summary>查看原文（56行）</summary>

```text
export async function beginExecutionLifecycle({ state, buildRun, packageEstimates, settings = {}, confirmOverBudget = false, managedExecution }) {
  // Host-only seam. Wire commands never accept this binding or callback.
  const managed=prepareManagedExecution(managedExecution)
  const funding=await state.prepareExecutionFunding?.({packageEstimates,managedExecution})
  if(funding){state=funding.state;packageEstimates=funding.packageEstimates}
  const ownerToken = randomUUID()
  const manager = createBudgetReservations({ state })
  await manager.recoverInterruptedExecutions()
  const started = new Map(), results = new Map(), completed = new Set()
  const estimates = new Map(packageEstimates.map(item => [item.id, { estimatedCostUsd: item.estimatedCostUsd ?? item.estimatedCost ?? null, billing: item.billing ?? 'api' }]))
  let workspace = {}, poisoned = null, closed = false
  const current = (status = 'running') => {
    const receipts = [...started].map(([id, item]) => results.get(id) ?? {
      ...item, id, ok: false, notStarted: true, answer: '', channel: item.channel ?? null,
    })
    for (const [id, result] of results) if (!started.has(id)) receipts.push(result)
    const run = managed.stamp(buildRun({ status, results: receipts, workspace }))
    funding?.stamp(run)
    if (status === 'running' || status === 'interrupted') {
      run.status = status
      if (status === 'running') run.finishedAt = null
      for (const item of run.packages ?? []) {
        if (!started.has(item.id) || completed.has(item.id)) continue
        item.status = 'running'; item.inFlight = true
        if (!results.has(item.id) || results.get(item.id)?.notStarted) item.billing = estimates.get(item.id)?.billing ?? 'api'
        if (!results.has(item.id)) Object.assign(item, { ran: false, costUsd: null, costSource: 'pending-receipt' })
      }
    }
    run.checkpoint = { at: Date.now(), completedIds: [...completed], startedIds: [...started.keys()] }
    return run
  }
  const initial = current()
  await managed.prepared(initial.id)
  const accepted = await manager.beginExecution({ run: initial, packageEstimates, ownerToken, ...settings, confirmOverBudget })
  if (!accepted.accepted) return accepted
  funding?.bind({runId:initial.id,packageId:()=>[...started.keys()].findLast(id=>!completed.has(id)),active:()=>!closed&&!poisoned})
  const identity = { reservationId: accepted.reservationId, ownerToken }
  const rejectBudget = changed => {
    const error = new Error(changed.budget?.message || '费用或预占已变化，已暂停启动后续步骤，请重新核对预算。')
    error.code = 'ROUTER_BUDGET_CHANGED'
    error.budget = { ...changed.budget, paused: true, exceeded: changed.budget?.exceeded ?? 'unknown' }
    error.runId = initial.id
    error.reason = changed.reason
    throw error
  }
  const required = async operation => {
    if (poisoned) throw poisoned
    try { return await operation() }
    catch (cause) {
      poisoned = new Error('执行检查点保存失败，已停止启动后续步骤；请核对历史记录与费用。', { cause })
      poisoned.code = 'ROUTER_CHECKPOINT_FAILED'
      throw poisoned
    }
  }
  const save = run => required(() => manager.checkpointExecution({ ...identity, run,
    completedIds: [...completed], startedIds: [...started.keys()] }))
```

</details>

**依据 2 · 源码核查**：[.dsh-plugin/shared/execution-lifecycle.mjs:78-107](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/execution-lifecycle.mjs#L78-L107)

每包启动和结果保存的具体顺序。

<details>
<summary>查看原文（30行）</summary>

```text
    async onCheckpointStart(item) {
      const previous = started.get(item.id)
      const alreadyStarted = started.has(item.id)
      started.set(item.id, item)
      const changed = await required(() => manager.checkpointExecution({ ...identity, run: current(),
        completedIds: [...completed], startedIds: [...started.keys()], checkBudget: true, ...settings, confirmOverBudget }))
      if (changed.accepted === false) {
        if (alreadyStarted) started.set(item.id, previous)
        else started.delete(item.id)
        rejectBudget(changed)
      }
    },
    async onCheckpointResult(result) {
      // Mutate the executor's receipt so later aggregate/final builds use the
      // same observed settlement time, even after another day or month starts.
      if (!receiptTimestamp(result.finishedAt)) result.finishedAt = Date.now()
      results.set(result.id, result); completed.add(result.id); await save(current())
    },
    async onWorkspace(value) { workspace = { ...workspace, ...value }; await save(current()) },
    async partialResult(result, { checkBudget = false } = {}) {
      // The next attempt's unknown receipt is durable dispatch evidence, not
      // an already-observed unknown invoice. Authorize against the previous
      // observed receipt plus its newly reserved estimate, then save both in
      // the same locked transaction before starting that attempt.
      const budgetRun = checkBudget ? current() : undefined
      const hadResult = results.has(result.id), previous = results.get(result.id)
      if (!receiptTimestamp(result.finishedAt)) result.finishedAt = Date.now()
      results.set(result.id, result)
      const changed = await required(() => manager.checkpointExecution({ ...identity, run: current(), budgetRun,
        completedIds: [...completed], startedIds: [...started.keys()], checkBudget, ...settings, confirmOverBudget: false }))
```

</details>

**依据 3 · 源码核查**：[.dsh-plugin/shared/budget-reservations.mjs:46-59](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/budget-reservations.mjs#L46-L59)

订阅不混算API预留，中断未知仍占额度。

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

**依据 4 · 源码核查**：[.dsh-plugin/shared/budget-reservations.mjs:92-99](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/budget-reservations.mjs#L92-L99)

所有权检查。

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

**依据 5 · 源码核查**：[.dsh-plugin/shared/budget-reservations.mjs:233-274](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/budget-reservations.mjs#L233-L274)

正常结束清预留，中断保留未知账单。

<details>
<summary>查看原文（42行）</summary>

```text
  const finishExecution = ({ reservationId, ownerToken, run: nextRun }) => {
    const run = checkedRun(nextRun, reservationId)
    return update(current => {
      ownedReservation(current, reservationId, ownerToken)
      upsertRun(current, run)
      delete current.budgetReservations[reservationId]
      return { reservationId, run, ...reservationSpending(current) }
    })
  }
  const markInterrupted = (current, entry, run, at) => {
    entry.status = 'interrupted'
    entry.interruptedAt = at
    entry.updatedAt = at
    if (run) {
      run.status = 'interrupted'
      run.finishedAt = at
      for (const pending of entry.packages.filter(item => item.started)) {
        const item = [...run.packages, ...(run.reviews ?? [])].find(item => item.id === pending.id)
        if (!item || (!item.inFlight && !['pending', 'running'].includes(item.status))
          || amount(item.costUsd) || amount(item.knownCostUsd) || Array.isArray(item.qualityAttempts)) continue
        // We know a request began, but never observed its receipt. Keep that
        // uncertainty in the ledger as well as the durable estimate hold.
        item.status = 'interrupted'
        item.inFlight = false
        item.ran = true
        item.costUsd = null
        item.costSource = 'interrupted-usage-unknown'
        item.billing = pending.billing === 'subscription' || item.billing === 'subscription' ? 'subscription' : 'api'
        item.finishedAt = at
      }
      run.interruption = { at, unreconciled: true, pendingPackageIds: entry.packages.map(item => item.id),
        startedPackageIds: entry.packages.filter(item => item.started).map(item => item.id) }
    } else current.historyIncomplete = true
  }
  const interruptExecution = ({ reservationId, ownerToken, run: nextRun }) => {
    const run = checkedRun(nextRun, reservationId)
    return update(current => {
      const entry = ownedReservation(current, reservationId, ownerToken)
      markInterrupted(current, entry, run, now())
      upsertRun(current, run)
      return { reservationId, run, ...reservationSpending(current) }
    })
```

</details>

**依据 6 · 作者声明**：[README.md:122-126](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/README.md#L122-L126)

作者明确取消和重启边界以及手工对账控制缺口。

```text
After execution starts, the workbench shows elapsed time, the current package and each package's state. **取消执行** requests cancellation of the active call and stops later packages from starting; **正在取消** remains visible until the executor finishes cleanup. Completed results and reported usage remain in history. Cancelling cannot undo charges already incurred or changes already integrated. Closing the panel does not cancel a run; reopening it in the same browser session can reconnect while the Host retains that job. Host restarts clear these in-memory jobs; durably saved package receipts and budget reservations remain. A confirmed dead execution owner is marked `interrupted`, without automatically resuming calls or releasing its hold.

Preview, progress and cancellation requests stop waiting after 15 seconds. Progress reads retry against the same job; an unacknowledged cancellation can be retried explicitly. A transport timeout does not establish that the Host task stopped and never automatically resubmits `startRun`. Before retrying a recorded step, budget checks include that step and all unfinished downstream packages that will execute; reassignment uses the selected route estimate and unknown prices remain unknown. The [timeout recovery screenshot](https://gitlab.com/Alice_marx/dsh-model-router/-/raw/main/docs/assets/workbench-run-timeout.png) is an offline simulation.

History shows active and interrupted budget reservations separately from actual spending. Runs with a reservation cannot be rerun or reassigned. If a Host crash or checkpoint failure leaves a reservation, first inspect the original task, retained worktree and provider bill; this release has no manual reconciliation/release control. Do not delete state to make the capacity appear free.
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 默认Bot、托管任务和迁移栅栏怎样接线及限定恢复？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

当前默认产品用同一orchestration.sqlite连接资金、组件和托管任务日志，并注册task工具。模型后端按Bot已提交绑定取精确模型、价格与预算；本地CLI需配置固定可执行文件及哈希，不能由任务文本任意指定。组合器也接入远程文件、命令和可选远程CLI后端，这些已进入默认产品能力范围，不能继续以纯只读路由器描述整个包；本次未遍历远端服务和每种写操作，不评价其全链安全性。

task-service在派发前保存beginDispatch，传operationId、attemptId对应记录和targetHash；有执行引用但结果未观测时保留unknown，未证未派发的admission也转unknown。对账仅允许needs-reconciliation状态、后端可观察并有专用能力，租约绑定task、attempt和目标。迁移startup-gate校验文件并在非committed/rolled-back阶段拒绝新产品启动，composition拿共享栅栏后再检查；注释明确它不停止旧Host。这些是恢复边界和防旧执行误写的可见机制，不证明跨进程、远端断连、取消或迁移全周期已经验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/orchestration/src/product-composition.mjs:75-81](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/packages/orchestration/src/product-composition.mjs#L75-L81)

Bot grant受已配置精确模型约束。

```text
export function compileProductGrant(bot, { routes, hydrated }) {
  const key = typeof bot?.model === 'string' ? bot.model : ''
  const slash = key.indexOf('/')
  const provider = slash > 0 ? key.slice(0, slash) : ''
  const model = slash > 0 ? key.slice(slash + 1) : ''
  return { tools: [...PRODUCT_TOOLS],
    modelRoutes: hydrated && provider && model && routes.has(key) ? [{ provider, model }] : [] }
```

**依据 2 · 源码核查**：[packages/orchestration/src/product-composition.mjs:102-132](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/packages/orchestration/src/product-composition.mjs#L102-L132)

CLI入口由Host配置固定并校验，非任务自由命令。

<details>
<summary>查看原文（31行）</summary>

```text
 * Host-configured official CLI entry. The executable, digest and version come
 * from installation verification (`pinCodexExecutable` re-pins them at probe
 * time); neither a Bot nor a Task input can supply an entry.
 */
export function normalizeTaskCli(value) {
  if (value === undefined || value === null) return null
  const entry = value.entry
  const remote = (Array.isArray(value.remote) ? value.remote : []).map(profile => {
    if (!profile || typeof profile !== 'object' || Array.isArray(profile)
      || Object.keys(profile).some(key => !['machineId','rootId','profileId','profileRevision','entry'].includes(key))
      || !['machineId','rootId','profileId'].every(key => typeof profile[key] === 'string' && /^[-A-Za-z0-9_.]{1,128}$/.test(profile[key]))
      || !Number.isSafeInteger(profile.profileRevision) || profile.profileRevision < 1
      || !profile.entry || Object.keys(profile.entry).some(key => !['sha256','version'].includes(key))
      || !/^[a-f0-9]{64}$/.test(profile.entry.sha256 ?? '') || !CLI_ENTRY_VERSION.test(profile.entry.version ?? '')) throw new TypeError('TASK_CLI_REMOTE_PROFILE_INVALID')
    return Object.freeze({ machineId: profile.machineId, rootId: profile.rootId, profileId: profile.profileId, profileRevision: profile.profileRevision,
      entry: Object.freeze({ sha256: profile.entry.sha256, version: profile.entry.version }) })
  })
  if (new Set(remote.map(profile => `${profile.machineId}/${profile.rootId}`)).size !== remote.length) throw new TypeError('TASK_CLI_REMOTE_PROFILE_DUPLICATE')
  if (!entry && !remote.length) throw new TypeError('TASK_CLI_ENTRY_REQUIRED')
  if (entry && (typeof entry.executable !== 'string' || !isAbsolute(entry.executable)
    || typeof entry.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(entry.sha256)
    || typeof entry.version !== 'string' || !CLI_ENTRY_VERSION.test(entry.version))) throw new TypeError('TASK_CLI_ENTRY_REQUIRED')
  const models = (Array.isArray(value.models) ? value.models : []).map(model => {
    if (!model || typeof model.provider !== 'string' || typeof model.model !== 'string'
      || typeof model.cliModel !== 'string' || !CLI_MODEL.test(model.cliModel)) throw new TypeError('TASK_CLI_MODEL_REQUIRED')
    return { provider: model.provider, model: model.model, cliModel: model.cliModel }
  })
  if (new Set(models.map(model => `${model.provider}/${model.model}/${model.cliModel}`)).size !== models.length) throw new TypeError('TASK_CLI_MODEL_DUPLICATE')
  if (value.sessionFactory !== undefined && typeof value.sessionFactory !== 'string') throw new TypeError('TASK_CLI_SESSION_FACTORY_REQUIRED')
  return Object.freeze({ entry: entry ? Object.freeze({ executable: entry.executable, sha256: entry.sha256, version: entry.version }) : null,
    models: Object.freeze(models), remote: Object.freeze(remote), sessionFactory: value.sessionFactory ?? null })
```

</details>

**依据 3 · 源码核查**：[packages/orchestration/src/product-composition.mjs:440-446](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/packages/orchestration/src/product-composition.mjs#L440-L446)

共享迁移锁后再查启动门。

```text
  const boot = (async () => {
    try{
      await Promise.race([refresh(), new Promise(resolve => { const pending = setTimeout(resolve, INITIAL_ROUTE_TIMEOUT_MS); pending.unref() })])
      if(deferredRouterState){
        sharedAdmission=await acquireMigrationShared(resolveStateHome())
        assertMigrationStartupAllowed({home:resolveStateHome()})
        funding=await openProductFunding({Database,file:storageFile,legacyFile,policy,authority,pricingFor:bindingFunding,now})
```

**依据 4 · 源码核查**：[packages/orchestration/src/product-composition.mjs:489-541](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/packages/orchestration/src/product-composition.mjs#L489-L541)

任务日志、模型和远程后端、租约runner及工具注册真实接线。

<details>
<summary>查看原文（53行）</summary>

```text
        // N09: one managed Task runner over the same SQLite authority. The
        // journal, funding store and component tables share orchestration.sqlite;
        // backends stay stable per kind while each Bot's binding supplies the
        // execution target, model and money at run time.
        if (typeof mr?.executeConfiguredAssignment !== 'function' || typeof mr?.rerunRecordedStep !== 'function'
          || typeof mr?.routerStateStore !== 'function') throw new TypeError('BOT_PRODUCT_MR_SEAM_REQUIRED')
        const managedRoot = join(dirname(storageFile), 'managed')
        const managedWorkspace = join(managedRoot, 'read-workspace')
        await mkdir(managedWorkspace, { recursive: true })
        if (cliConfig?.entry&&cliConfig.sessionFactory) {
          const factory = await import(cliConfig.sessionFactory).then(module => module.createCliSession ?? module.default, () => null)
          if (typeof factory !== 'function') throw new TypeError('TASK_CLI_SESSION_FACTORY_REQUIRED')
          cliSessionFactory = factory
        }
        journal = funding.store.openTaskJournal()
        const modelBackends = createTaskBackends({ ctx, mr, authority, directory, store: funding.store,
          machineId, workspaceId, workspace: managedWorkspace, runtimeRoot: join(managedRoot, 'cli-runtime'),
          bindingFor: botId => botSettings.get(botId, { publishChange: false }),
          cli: cliConfig?.entry ? { entry: cliConfig.entry, sessionFactory: cliSessionFactory ?? (await import('../../cli-runtime/src/codex-runtime.mjs')).createCodexSession } : null })
        const remoteWrite=createRemoteWriteBackend({machines:()=>machines,directory})
        const remoteCommand=createRemoteCommandBackend({machines:()=>machines,directory})
        if(cliConfig?.remote.length)remoteCliBackend=createRemoteCliTaskBackend({machines:()=>machines,directory,store:funding.store,authority,profiles:cliConfig.remote,bindingFor:botId=>botSettings.get(botId,{publishChange:false})})
        const remoteBackends=[remoteWrite,remoteCommand,...(remoteCliBackend?[remoteCliBackend]:[])]
        taskBackends=Object.freeze({backends:Object.freeze([...modelBackends.backends,...remoteBackends]),catalog:()=>[...modelBackends.catalog(),...remoteBackends.map(backend=>({id:backend.id,version:backend.version,effect:backend.effect,location:'remote',capability:backend.capability,label:backend.id==='remote-codex-read'?'已授权远程官方 CLI 只读任务':backend.id==='remote-write'?'已授权远程文件写入任务':'已授权容器命令任务（仅别名argv）'}))]})
        taskService = createTaskService({ journal, authority, directory, backends: [...taskBackends.backends],
          within: (subject, signal, work) => policy.executionContext(subject, signal, work),
          planTargetsFor: (subject,plan,caller) => {
            const id=authority.describe(subject).botId
            const bot=product?.lifecycle.committedBot(id)
            const privateCall=caller.owner===true||bot&&caller.sessionId===(bot.sessionId??bot.id)
            if(caller.sessionId!==undefined&&plan.origin.kind==='private'&&!privateCall)throw Object.assign(new Error('TASK_PLAN_ORIGIN_MISMATCH'),{code:'TASK_PLAN_ORIGIN_MISMATCH'})
            if(caller.owner===true&&plan.origin.kind==='private'&&plan.origin.sessionId!==null&&plan.origin.sessionId!==(bot?.sessionId??bot?.id))throw Object.assign(new Error('TASK_PLAN_ORIGIN_MISMATCH'),{code:'TASK_PLAN_ORIGIN_MISMATCH'})
            return privateCall&&plan.origin.kind==='private'&&product?.lifecycle.committedMainBotIds().includes(id)?product.lifecycle.committedBots().map(bot=>bot.id):[id]
          },
          runnerTtlMs: TASK_RUNNER_TTL_MS, taskTtlMs: TASK_TTL_MS,
          // The committed binding's maxConcurrentTasks is the per-Bot limit; an
          // unconfigured Bot keeps the conservative single-task default.
          concurrencyFor: botId => {
            try {
              const value = botSettings?.get(botId, { publishChange: false })
              return value?.status === 'available' ? value.settings.maxConcurrentTasks ?? 1 : 1
            } catch { return 1 }
          } })
        // A previous Host that died without releasing its runner lease blocks the
        // claim until the lease expires; waiting is safer than dropping tasks.
        const claimDeadline = now() + TASK_RUNNER_CLAIM_MS
        for (;;) {
          try { taskService.start(); break } catch (error) {
            if (error?.code !== 'TASK_RUNNER_BUSY' || now() >= claimDeadline) throw error
            await new Promise(resolve => { const pending = setTimeout(resolve, 250); pending.unref() })
          }
        }
        releaseTaskTools = registerTaskTools(ctx, defineTool, { service: taskService, directory })
```

</details>

**依据 5 · 源码核查**：[packages/orchestration/src/task-service.mjs:69-111](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/packages/orchestration/src/task-service.mjs#L69-L111)

派发检查点、结果未知保留与陈旧runner处理。

<details>
<summary>查看原文（43行）</summary>

```text
        executionSignal=signal
        const run=()=>{
        // A delayed within/admission callback cannot dispatch after this
        // invocation has settled or after its authority was cancelled.
        if(backendClosed||backendStarted)fail('TASK_DISPATCH_CLOSED')
        signal.throwIfAborted();journal.beginDispatch(identity,task.ownerBotId,task.taskId,task.attemptId,now());backendStarted=true
        return backend.run({
        input:JSON.parse(canonicalTaskJson(task.input.input)),target:task.input.target,signal,binding,attemptNumber:task.attemptNumber,
        previous:task.attemptNumber>1?journal.get(task.ownerBotId,task.taskId).attempts.at(-2):null,
        legacyRunIds:task.legacyRunIds,
        operationId:task.operationId,targetHash:task.input.targetHash,
        ownerBotId:task.ownerBotId,
        checkpoint:reference=>admission?admission.checkpoint(reference):journal.linkExecution(identity,task.ownerBotId,task.taskId,task.attemptId,reference,now()),
        beforeAdmission:()=>admission?journal.assertPreparing(identity,task.ownerBotId,task.taskId,task.attemptId,now()):journal.assertDispatch(identity,task.ownerBotId,task.taskId,task.attemptId,now()),
        beforeRequest:()=>journal.assertDispatch(identity,task.ownerBotId,task.taskId,task.attemptId,now()),
        })}
        const value=await (admission?withinTaskAdmission(admission,run):run())
        canonicalTaskJson(value)
        observedResult=value
        return value
      }),{signal:controller.signal})
      if(!result||!['succeeded','failed','cancelled','unknown','waiting-budget'].includes(result.outcome))fail('INVALID_TASK_BACKEND_RESULT')
      canonicalTaskJson(result)
      outcome=result.outcome
    } catch(error) {
      backendClosed=true
      outcome=controller.signal.aborted||['GRANT_CHANGED','SUBJECT_REVOKED','LEASE_EXPIRED','AUTHORITY_CLOSED'].includes(error.code)?'cancelled':'failed'
      const hasReference=!!journal.get(task.ownerBotId,task.taskId).executionRef
      if(observedResult?.outcome==='unknown'||!observedResult&&hasReference)outcome='unknown'
      result={code:error instanceof PolicyError?error.code:'TASK_BACKEND_FAILED',
        ...(!backendStarted&&!hasReference?{notStarted:true}:{}),
        ...(observedResult?.legacyRunId?{legacyRunId:observedResult.legacyRunId}:{}),
        ...(observedResult?.summary?{summary:observedResult.summary}:{})}
    } finally {backendClosed=true;clearTimeout(timer);clearInterval(renewal);if(lease)authority.release(lease.token)}
    if(!backendStarted)journal.closeDispatch(identity,task.ownerBotId,task.taskId,task.attemptId,now())
    if(admission&&!admission.committed()){
      let proven=false;try{proven=admission.notDispatched()}catch{}
      if(!proven)outcome='unknown'
      else if(['unknown','succeeded'].includes(outcome))outcome=controller.signal.aborted?'cancelled':'failed'
      result={...result,admissionCommitted:false,notDispatched:proven}
    }
    try {journal.finish(identity,task.ownerBotId,task.taskId,task.attemptId,outcome,result,now())}
    catch(error) {if(error.code==='STALE_TASK_RUNNER')stopRunner();else{stopRunner();throw error}}
```

</details>

**依据 6 · 源码核查**：[packages/orchestration/src/task-service.mjs:224-248](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/packages/orchestration/src/task-service.mjs#L224-L248)

对账状态、观察能力和绑定租约。

<details>
<summary>查看原文（25行）</summary>

```text
    async reconcile(subject,request) {
      writable();const id=owner(subject,'task/reconcile'),parsed=parseTaskReconcile(request)
      const hash=taskHash({kind:'reconcile',taskId:parsed.taskId})
      const replay=journal.reconciliationReplay(identity,id,parsed.taskId,parsed.requestKey,hash,now())
      if(replay)return replay
      const task=journal.get(id,parsed.taskId),backend=registry.get(task.input.backend)
      if(task.state!=='needs-reconciliation')fail('TASK_RECONCILE_NOT_ALLOWED')
      if(!backend||typeof backend.reconcile!=='function'||!backend.reconcileCapability)fail('TASK_RECONCILER_UNAVAILABLE')
      const observeAllowed=backend.canObserve?backend.canObserve(subject,task.input.target,task.input.input):taskHash(target(backend))===task.input.targetHash
      if(!observeAllowed)fail('TASK_RECONCILER_UNAVAILABLE')
      authority.assertTool(subject,backend.reconcileCapability)
      const existing=observations.get(task.taskId)
      if(existing){if(existing.key!==parsed.requestKey)fail('TASK_RECONCILIATION_BUSY');return existing.work}
      if(observations.size>=4)fail('TASK_RECONCILIATION_BUSY')
      const controller=new AbortController()
      const work=(async()=>{
        const binding={taskId:task.taskId,attemptId:task.attemptId,machineId:task.input.target.machineId,workspaceId:task.input.target.workspaceId,location:task.input.target.location}
        let lease
        try{
          lease=authority.issue(subject,{binding,tools:['task/reconcile',backend.reconcileCapability],ttlMs:5000})
          const snapshot={taskId:task.taskId,attemptId:task.attemptId,operationId:task.operationId,input:{targetHash:task.input.targetHash}}
          const verdict=await authority.run(lease.token,binding,backend.reconcileCapability,({signal})=>backend.reconcile({task:snapshot,reference:task.executionRef,signal,ownerBotId:id}),{signal:controller.signal})
          canonicalTaskJson(verdict)
          const result=journal.reconcile(identity,id,task.taskId,task.attemptId,parsed.requestKey,hash,verdict,now());schedule();return result
        }finally{if(lease)authority.release(lease.token);observations.delete(task.taskId)}
```

</details>

**依据 7 · 源码核查**：[packages/orchestration/src/migration-startup-gate.mjs:5-28](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/packages/orchestration/src/migration-startup-gate.mjs#L5-L28)

启动门校验与不会停止旧Host的明确边界。

<details>
<summary>查看原文（24行）</summary>

```text
export function readMigrationStartupGate({home}={}){
 if(typeof home!=='string')fail('PROFILE_MIGRATION_GATE_INVALID')
 // DSH_HOME itself can be an intentional Windows junction. Bind to its
 // canonical home, while the gate file must remain a regular unlinked file.
 let directory;try{directory=realpathSync(resolve(home))}catch(e){if(e.code==='ENOENT')return null;fail('PROFILE_MIGRATION_GATE_UNREADABLE')}
 const file=join(directory,'migration-gate.json');let before
 try{before=lstatSync(file)}catch(e){if(e.code==='ENOENT')return null;fail('PROFILE_MIGRATION_GATE_UNREADABLE')}
 if(!before.isFile()||before.isSymbolicLink()||before.nlink!==1||before.size>16384||realpathSync(directory)!==directory)fail('PROFILE_MIGRATION_GATE_INVALID')
 const fd=openSync(file,constants.O_RDONLY|(constants.O_NOFOLLOW??0))
 try{
  const opened=fstatSync(fd),bytes=readFileSync(fd),after=fstatSync(fd),named=lstatSync(file)
  if(bytes.length>16384||[opened,after,named].some(s=>s.dev!==before.dev||s.ino!==before.ino||s.size!==before.size||s.mtimeMs!==before.mtimeMs||s.ctimeMs!==before.ctimeMs))fail('PROFILE_MIGRATION_GATE_CHANGED')
  let value;try{value=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes))}catch{fail('PROFILE_MIGRATION_GATE_INVALID')}
  if(value?.schemaVersion!==1)fail('PROFILE_MIGRATION_GATE_VERSION_UNSUPPORTED')
  if(value.kind!=='profile-migration-gate'||value.home!==directory||typeof value.operationId!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(value.operationId)||!phases.has(value.phase)||typeof value.operationDirectory!=='string'||!/^[a-f0-9]{64}$/.test(value.planDigest??'')||!Number.isSafeInteger(value.journalEvents)||value.journalEvents<0||!/^[a-f0-9]{64}$/.test(value.journalHead??''))fail('PROFILE_MIGRATION_GATE_INVALID')
  return value
 }finally{closeSync(fd)}
}

/** Invoke before opening any new product writer. This does not stop old Hosts. */
export function assertMigrationStartupAllowed({home}={}){
 const gate=readMigrationStartupGate({home})
 if(gate&&!['committed','rolled-back'].includes(gate.phase))fail('PROFILE_MIGRATION_PENDING')
 return {allowed:true,maintenanceRecorded:gate!==null}
```

</details>

#### 缺口

- 未完整核查全部远端后端、旧Host写入与实际迁移中断恢复。
  **影响**：不能承诺默认预览产品可直接承载无人值守远程写入或生产迁移。
  **进一步探讨**：对该提交建立隔离home及受控远端矩阵，检查授权拒绝、断连、UNKNOWN对账和旧Host同时写入。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 全周期成本和采用结论应如何约束？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前保持观察。仅研究路由的用户也应先用隔离profile/home确认默认Bot是否启动、SQLite与旧状态如何处理，不把现有生产数据迁入预览。若要评估，先使用人工可验收的只读小任务、精确路由和小额预算，关闭自动安装与远程写入，核对每包通道和账单。遇到未知费用、残留预留、迁移门拒绝或实际版本与说明不符，应停止新任务，保留SQLite、旧状态和执行记录，回到独立稳定配置手动选模型；不要删预留制造可用额度。

首次成本包括账户、CLI或模型配置、价格和权限核对以及数据副本；持续成本包括模型实付或订阅、质量校准和结果验收；失败成本包括未知费用、保留工作目录与迁移状态对账。源码没有当前preview.7真实厂商任务和全周期成本测量，历史0.20.0报告不能证明该版本。即使只读任务，也可能花钱且把私有输入发给配置供应商，预算和数据条件需按实际任务决定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-17](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/README.md#L11-L17)

作者限定历史执行和隔离预览，不构成当前运行证据。

```text
**Opt-in preview: 0.26.0-preview.2.** This compatibility update adds the exact **0.2.1-rc.5** Host peer version and pins the source SDK to rc.5; preview.1 is rejected by rc.5 before its plugin loads. Publication is established by the actual registry entry, not this text. This model-router plugin preview is for isolated evaluation, not automatic production upgrades. Integration with the DS Bot desktop application and computer-operation features is still in progress; a complete integrated DS Bot application has not yet been delivered. In **Harness Desktop → Plugins → Add plugin**, use `@ljwei-stak/dsh-model-router@0.26.0-preview.2` only in a separate test profile/home with backups. The stable instructions below stay on 0.25.5; `latest` is not the preview channel. Read the [preview trial guide](https://gitlab.com/Alice_marx/dsh-model-router/-/blob/main/docs/releases/0.26.0-preview.2-trial.md) and [validation limits](https://gitlab.com/Alice_marx/dsh-model-router/-/blob/main/docs/releases/0.26.0-preview.2-validation.md) before installing. Full migration activation, all-domain stop-write and post-activation rollback remain unavailable. No new real-provider or production-profile acceptance is claimed.

A cost-aware model-routing workbench for **DeepSeek Harness Desktop**. Plan locally, compare configured routes, inspect execution permissions, and run dependent work packages through model APIs or supported official vendor CLIs.

Stable version: **0.25.5** (`@ljwei-stak/dsh-model-router`). This update fixes garbled ZCode TUI box drawing, CJK text and broken color sequences in Windows embedded terminals. Each new ZCode PTY enables UTF-8 before Node starts; system settings remain unchanged. The standalone community ZCode CLI retains both npm and GitHub Release installation methods. It retains the **0.2.1-rc.3** SDK and existing Host peer range. API calls use monetary accounting and daily/monthly budget reservations; subscriptions use a separate ledger of calls and reported tokens. Confirmed subscription execution is not blocked only because the API budget is exhausted or API prices are missing. A switch to an API must be priced and admitted before that API call; mixed results retain both channel receipts. The workbench separates API spending/reservations from subscription usage, with unknown counters kept unknown. Workbench execution shows live elapsed time and per-package progress, supports cancellation with completed results and reported costs retained, and reconnects to the active job when the panel is reopened. Choose algorithm recommendations or manually assign each decomposed package to an exact model API or official tool, preserving dependencies, refreshed cost previews and retry targets. Routing now supports task-specific quality evidence, joint model/effort selection, historical P90 resource estimates and dependency-aware search. Manual mixed execution is read-only; tools use their configured default model, while the existing editable official-team workflow remains available. Compatibility covers **DeepSeek Harness Desktop 0.2.0-rc.1 / 0.2.0-rc.2 / 0.2.1-rc.2 / 0.2.1-rc.3**, including Hermes/Pi installation and terminal support; neither has a verified managed runner yet. Real vendor execution evidence remains tied to **0.20.0**, with no new model experiments in this release. The router and [GAL](https://github.com/Alice-Marx/deepseek-harness-galgame) have been independent plugins since 0.12.0.

Official CLI teamwork runs packages sequentially with dependency context and no automatic model-directory API fallback. Editable teams explicitly choose the Harness sandbox or the vendor CLI's normal environment. In the latter, Git worktrees collect edits but do not restrict OS access. CLIs retain their configured model unless explicitly mapped. See [real Windows validation and its limits](https://gitlab.com/Alice_marx/dsh-model-router/-/blob/main/docs/releases/0.20.0-validation.md).
```

**依据 2 · 源码核查**：[.dsh-plugin/index.mjs:2251-2280](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/index.mjs#L2251-L2280)

默认Bot与SQLite启动使隔离home重要。

<details>
<summary>查看原文（30行）</summary>

```text
export function apply(ctx, config = {}) {
  // The unified Bot product composes the frozen DS Bot runtime with this plugin
  // body inside one Host. Lightweight direct apply() callers (plain-object test
  // contexts) have no Cordis surface or DS services and keep the legacy MR
  // behavior; a real DSH Host always provides the runtime's services.
  const botProductEnabled = (() => { const value = config?.botProduct; return (typeof value === 'function' ? value() : value) !== false })()
  const productHost = botProductEnabled && typeof ctx?.provide === 'function' && typeof ctx?.effect === 'function'
    && ['llm', 'tools', 'systemPrompt', 'sessionController', 'sessions', 'sessionTitle', 'workspaceRegistry', 'connection']
      .every(name => { try { return ctx.get(name) !== undefined } catch { return false } })
  if (typeof ctx?.provide === 'function' && typeof ctx?.effect === 'function') assertMigrationStartupAllowed({ home: resolveStateHome() })
  let deferredRouterState = null
  if (productHost && ctx.get('botIntegrationPolicy') === undefined) {
    const storageFile = join(resolveStateHome(), 'model-router', 'orchestration.sqlite')
    deferredRouterState = createDeferredRouterState({ file: storageFile })
    installRouterStateStore(deferredRouterState.state)
  }
  let botProduct
  const taskCli = (() => { const value = config?.taskCli; return (typeof value === 'function' ? value() : value) ?? null })()
  try {
    botProduct = productHost ? startBotProduct(ctx, { accountStream: createDiagnosticAccountStream(),
      deferredRouterState, storageFile: deferredRouterState?.state.file, legacyFile: defaultStatePath(),
      // N09: the managed Task runner reuses this plugin's own execution entries,
      // so the composition never needs a second copy of the MR runtime.
      mr: { executeConfiguredAssignment, rerunRecordedStep, routerStateStore }, taskCli,
      runtimeConfig: normalizeBotRuntimeConfig(config?.botRuntime) }) : null
  } catch (error) {
    deferredRouterState?.reject(error)
    throw error
  }
  if (botProduct) ctx.effect(() => async () => { await botProduct.dispose() }, 'model-router-galgame: bot product')
```

</details>

**依据 3 · 源码核查**：[.dsh-plugin/shared/budget-reservations.mjs:233-274](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/budget-reservations.mjs#L233-L274)

中断预留保留，解释停止与账单恢复负担。

<details>
<summary>查看原文（42行）</summary>

```text
  const finishExecution = ({ reservationId, ownerToken, run: nextRun }) => {
    const run = checkedRun(nextRun, reservationId)
    return update(current => {
      ownedReservation(current, reservationId, ownerToken)
      upsertRun(current, run)
      delete current.budgetReservations[reservationId]
      return { reservationId, run, ...reservationSpending(current) }
    })
  }
  const markInterrupted = (current, entry, run, at) => {
    entry.status = 'interrupted'
    entry.interruptedAt = at
    entry.updatedAt = at
    if (run) {
      run.status = 'interrupted'
      run.finishedAt = at
      for (const pending of entry.packages.filter(item => item.started)) {
        const item = [...run.packages, ...(run.reviews ?? [])].find(item => item.id === pending.id)
        if (!item || (!item.inFlight && !['pending', 'running'].includes(item.status))
          || amount(item.costUsd) || amount(item.knownCostUsd) || Array.isArray(item.qualityAttempts)) continue
        // We know a request began, but never observed its receipt. Keep that
        // uncertainty in the ledger as well as the durable estimate hold.
        item.status = 'interrupted'
        item.inFlight = false
        item.ran = true
        item.costUsd = null
        item.costSource = 'interrupted-usage-unknown'
        item.billing = pending.billing === 'subscription' || item.billing === 'subscription' ? 'subscription' : 'api'
        item.finishedAt = at
      }
      run.interruption = { at, unreconciled: true, pendingPackageIds: entry.packages.map(item => item.id),
        startedPackageIds: entry.packages.filter(item => item.started).map(item => item.id) }
    } else current.historyIncomplete = true
  }
  const interruptExecution = ({ reservationId, ownerToken, run: nextRun }) => {
    const run = checkedRun(nextRun, reservationId)
    return update(current => {
      const entry = ownedReservation(current, reservationId, ownerToken)
      markInterrupted(current, entry, run, now())
      upsertRun(current, run)
      return { reservationId, run, ...reservationSpending(current) }
    })
```

</details>

#### 缺口

- 缺少当前版本合格工作包、迁移和失败恢复的全周期测量。
  **影响**：不支持节省比例、单位任务成本或持续安装建议。
  **进一步探讨**：固定模型集合、任务和预算，记录全部尝试、实付额、验收与恢复人工时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能从质量和状态不确定性推导什么可证伪方向？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把每类工作包的合格结果、实际通道回执与未决费用统一用于质量和资源校准，同时把不确定状态留给人工对账而不是当成成功样本。推导来自两个事实：优化器只对代理质量字段决策，生命周期已保留检查点与未知费用；组合数据有机会缩小真实任务与聚合先验之间的差距。当前已存在routing-evidence和资源预测，因而新方向不是再造一个评分表，而是检查“只有可验收且账单范围明确的样本进入校准”是否改善决策。

最小实验固定一组可独立验收的只读依赖任务、候选模型、预算和输入，比较固定强模型、最低已知价、当前策略及加入结果资格过滤的策略。记录全包合格率、所有失败重试、未知账单比例、实付额和人工校准时间。若质量不降时净支出没有改善，或过滤造成样本稀疏使结果更差，或对账投入超过收益，应否定该方向并保留手工精确路由。不能据此宣称真实业务需求或商业成功。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/router.mjs:9-17](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/router.mjs#L9-L17)

已有任务质量和资源预测模块是参照。

```text
import { DEFAULT_ROUTING_PRESET, normalizeRoutingPreset, presetFloor, presetWeights } from './routing-presets.mjs'
import { liveBenchRow } from './livebench.mjs'
import { solveCandidateAssignments } from './assignment-solver.mjs'
import { predictQuality, predictResources } from './routing-evidence.mjs'

export const OBJECTIVE_WEIGHTS = Object.freeze({
  simple: Object.freeze({ quality: 0.28, cost: 0.45, latency: 0.14, specialty: 0.04, reasoning: 0.07, risk: 0.02 }),
  balanced: Object.freeze({ quality: 0.40, cost: 0.26, latency: 0.10, specialty: 0.09, reasoning: 0.10, risk: 0.05 }),
  complex: Object.freeze({ quality: 0.48, cost: 0.14, latency: 0.06, specialty: 0.14, reasoning: 0.11, risk: 0.07 }),
```

**依据 2 · 源码核查**：[.dsh-plugin/shared/assignment-solver.mjs:1-23](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/assignment-solver.mjs#L1-L23)

代理质量优化的能力边界。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[.dsh-plugin/shared/execution-lifecycle.mjs:78-107](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/execution-lifecycle.mjs#L78-L107)

结果检查点可作为待验证校准输入。

<details>
<summary>查看原文（30行）</summary>

```text
    async onCheckpointStart(item) {
      const previous = started.get(item.id)
      const alreadyStarted = started.has(item.id)
      started.set(item.id, item)
      const changed = await required(() => manager.checkpointExecution({ ...identity, run: current(),
        completedIds: [...completed], startedIds: [...started.keys()], checkBudget: true, ...settings, confirmOverBudget }))
      if (changed.accepted === false) {
        if (alreadyStarted) started.set(item.id, previous)
        else started.delete(item.id)
        rejectBudget(changed)
      }
    },
    async onCheckpointResult(result) {
      // Mutate the executor's receipt so later aggregate/final builds use the
      // same observed settlement time, even after another day or month starts.
      if (!receiptTimestamp(result.finishedAt)) result.finishedAt = Date.now()
      results.set(result.id, result); completed.add(result.id); await save(current())
    },
    async onWorkspace(value) { workspace = { ...workspace, ...value }; await save(current()) },
    async partialResult(result, { checkBudget = false } = {}) {
      // The next attempt's unknown receipt is durable dispatch evidence, not
      // an already-observed unknown invoice. Authorize against the previous
      // observed receipt plus its newly reserved estimate, then save both in
      // the same locked transaction before starting that attempt.
      const budgetRun = checkBudget ? current() : undefined
      const hadResult = results.has(result.id), previous = results.get(result.id)
      if (!receiptTimestamp(result.finishedAt)) result.finishedAt = Date.now()
      results.set(result.id, result)
      const changed = await required(() => manager.checkpointExecution({ ...identity, run: current(), budgetRun,
        completedIds: [...completed], startedIds: [...started.keys()], checkBudget, ...settings, confirmOverBudget: false }))
```

</details>

**依据 4 · 源码核查**：[.dsh-plugin/shared/budget-reservations.mjs:249-264](https://github.com/Alice-Marx/dsh-model-router/blob/3197b1e81978af87fffe2712fd79238ef3d51dda/.dsh-plugin/shared/budget-reservations.mjs#L249-L264)

未知账单应独立保留，不能充当零成本成功样本。

<details>
<summary>查看原文（16行）</summary>

```text
      for (const pending of entry.packages.filter(item => item.started)) {
        const item = [...run.packages, ...(run.reviews ?? [])].find(item => item.id === pending.id)
        if (!item || (!item.inFlight && !['pending', 'running'].includes(item.status))
          || amount(item.costUsd) || amount(item.knownCostUsd) || Array.isArray(item.qualityAttempts)) continue
        // We know a request began, but never observed its receipt. Keep that
        // uncertainty in the ledger as well as the durable estimate hold.
        item.status = 'interrupted'
        item.inFlight = false
        item.ran = true
        item.costUsd = null
        item.costSource = 'interrupted-usage-unknown'
        item.billing = pending.billing === 'subscription' || item.billing === 'subscription' ? 'subscription' : 'api'
        item.finishedAt = at
      }
      run.interruption = { at, unreconciled: true, pendingPackageIds: entry.packages.map(item => item.id),
        startedPackageIds: entry.packages.filter(item => item.started).map(item => item.id) }
```

</details>

#### 缺口

- 尚无该资格过滤策略的受控实验。
  **影响**：方向仅是推断，不计入已有创新和采用收益。
  **进一步探讨**：执行上述同预算任务对照，并事先固定合格与否定标准。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
