# DSH Agent Team GUI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[9e952e0](https://github.com/toolclub/dsh-agent-team-gui/tree/9e952e0681d528975444568b70f3c554ac2984be)

<!-- BEGIN META -->
[![GitHub ★ 283](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=283&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/toolclub/dsh-agent-team-gui)
<!-- END META -->

> **功能**：为 DSH Web 保存可复用多模型团队，编排任务依赖、查看运行记录并汇总供应商报告的 Token 用量。

> **亮点**：可持久复用的团队定义、消息认领、有界依赖计划和逐尝试计量覆盖，把一次性分派组织为可检查运行。源码存在真正子Agent调用，超出纯静态流程图，但不证明更优交付，见 [Q01](#research-q01)、[Q02](#research-q02) 和 [Q04](#research-q04)。

> **主要限制**：质量门只审阅有界成员交接文本且无工具，重启只是把活动记录结算为中断；这些机制不独立验收代码或回滚外部副作用。用户仍须核对真实文件、测试与重复写入，见 [Q03](#research-q03)。

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
  - [Q01 · 团队对象与原生子Agent相比增加什么？](#detail-section-11)
  - [Q02 · 用户输入如何成为真正的子Agent执行？](#detail-section-12)
  - [Q03 · 重试、质量门、取消和重启恢复保证到哪？](#detail-section-13)
  - [Q04 · 模型、工具权限和Token数据如何影响成本？](#detail-section-14)
  - [Q05 · 采用建议和新的可证伪方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：固定兼容DSH Web环境的开发者可保存规划、实现和评审成员，用于反复需要分工的任务；最终合格交付仍须检查文件与测试，见 [Q01](#research-q01)。

参照原生单Agent、一次性子Agent调用和人工组织分工。本插件的贡献在团队复用与运行管理，底层自主工具循环来自DSH宿主；没有同条件效果比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 团队定义 | 保存成员与模型/工具配置 | 团队不是用户或单次运行 |
| 任务分派 | 结构化计划及依赖就绪成员执行 | 依赖宿主subagents与能力过滤，最多32成员计划 |
| 有限续跑 | 主Agent重审部分失败任务 | 取消/中断需用户审视，不回滚副作用 |
| 质量门 | 评审交接文本并有限修复 | 无工具，只看成员所报材料 |
| 运行中心 | 查看状态、成员输出与取消 | 状态不等于交付合格 |
| Token观察 | 查看供应商报告量与覆盖 | 缺失不等于免费，非完整账单 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web 0.1.5兼容范围、Node ^22.19或≥24 | 启动必需 | 宿主服务与客户端接线 | 0.1.7在声明范围外，不能换安装源假定支持 |
| storageDomain、subagents、tools、llm等服务 | 执行必需 | 定义、运行、工具与模型 | 关键provider缺过滤/深度能力会拒绝执行 |
| 已配置模型路由和明确成员工具 | 每次任务必需 | 真正执行成员分工 | 未知工具allow拒绝，权限不等于文件隔离 |
| session tokenUsage投影 | 完整计量时必需 | 供应商用量统计 | 无投影显示覆盖不足，不代表零费用 |
| jobs适配 | 可选 | 相应后台能力 | 不据可选依赖声明全部环境可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定兼容profile并配置模型路由 | 团队设置与宿主服务可用 |
| 定义 | 用户保存成员、工具、并发与明确职责 | 先用同一模型和独占文件范围核查 |
| 分派 | 事件或主Agent调用工具，宿主规划/执行 | 查看实际调用、成员结果、失败与用量覆盖 |
| 验收 | 用户或主Agent独立检查产物与测试 | approved不替代真实交付验收 |
| 失败/退出 | 用户核对现有写入后选择有限续跑或Solo | 重启记录为中断，未知副作用先核对不盲重放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、模型接入和存储资源未知 | 团队、角色、工具与版本配置耗时未知 | 需要旧范围宿主环境 |
| 持续使用 | 成员、规划、诊断、评审与修复调用，金额未知 | 任务拆分、交接和最终验收 | 未报告用量不为零，Token不等于账单 |
| 失败恢复 | 重试和续跑增加用量，副作用补偿成本未知 | 核对已有产物与中断状态 | budget是调度观察阈值，非美元硬封顶 |
| 退出 | 保留定义/运行记录所需资源未知 | 切回Solo并核对未完成任务 | 不自动撤销已写文件或外部状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 团队复用 | 持久定义、模式与浏览器入口 | 配置节时与真实需求频率 |
| 执行管理 | 实际subagents、DAG、失败/取消状态 | 业务合格率及外部副作用恢复 |
| 用量观察 | 官方投影和独立full/partial/none覆盖 | 完整账单与相对节费 |

> **思考**：质量门只审阅有界成员交接文本且无工具，重启只是把活动记录结算为中断；这些机制不独立验收代码或回滚外部副作用。用户仍须核对真实文件、测试与重复写入，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：可持久复用的团队定义、消息认领、有界依赖计划和逐尝试计量覆盖，把一次性分派组织为可检查运行。源码存在真正子Agent调用，超出纯静态流程图，但不证明更优交付，见 [Q01](#research-q01)、[Q02](#research-q02) 和 [Q04](#research-q04)。

值得复用的是 [Q02](#research-q02) 的消息级认领和有界计划校验，以及 [Q04](#research-q04) 把计量覆盖与总数分开的设计。迁移必须匹配宿主Service、子Agent能力和持久化协议；[Q03](#research-q03) 的无工具评审和中断结算则要求使用者保留独立产物验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

质量门只审阅有界成员交接文本且无工具，重启只是把活动记录结算为中断；这些机制不独立验收代码或回滚外部副作用。用户仍须核对真实文件、测试与重复写入，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在匹配宿主的空白项目，用一个模型与有限成员验证完整交付，给成员明确且不重叠的文件范围；逐次核对产物、测试和计量覆盖。发现反复覆盖、成本不明或文本评审漏掉实际缺陷时切回Solo和人工验收，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码确认原生宿主入口、团队持久化、真实子Agent分派及计量边界。建议兼容环境中的隔离任务试用，未做宿主、模型或业务收益验收；未来产物验证评审未实现。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/client/index.ts、src/index.ts、src/tools/application/execution-service.ts、src/tools/delegation-policy.ts、src/tools/infrastructure/official-usage-meter.ts、src/tools/orchestration.ts、src/tools/run-history.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：inventory统计完整根组件，人工抽读宿主/客户端入口、编排、成员执行、重试/评审、守卫、取消、重启和Token投影；未逐行审计全部RPC、导入迁移、GUI和第三方宿主实现。
- 下一步：以同宿主、同模型/预算、相同开发任务对照单Agent、手工子Agent和保存团队；核对交付合格、返工、实际副作用、总现金/人工时间及用量覆盖，并注入取消和重启。本轮未执行目标插件、测试或模型任务。

**分析版本**

- **仓库**：[toolclub/dsh-agent-team-gui](https://github.com/toolclub/dsh-agent-team-gui)
- **版本号**：1.3.0（[固定提交 9e952e0](https://github.com/toolclub/dsh-agent-team-gui/tree/9e952e0681d528975444568b70f3c554ac2984be)）
- **版本日期**：2026-10-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索带产物摘要与独立验证记录的交接，并给最终评审受限验证能力，补足纯文本approved与真实交付之间的空隙。这是未验证假设；同预算下若错误放行和人工返工不降、只增调用，即停止，见 [Q05](#research-q05)。

以同宿主、同模型/预算、相同开发任务对照单Agent、手工子Agent和保存团队；核对交付合格、返工、实际副作用、总现金/人工时间及用量覆盖，并注入取消和重启。本轮未执行目标插件、测试或模型任务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 3538 | — | — | 36100 |
| .mjs | source | 10 | 2396 | 2219 | 64 | — |
| .tsx | source | 6 | 1579 | 1443 | 18 | — |
| .ts | source | 32 | 7969 | 7210 | 321 | — |
| .ts | test | 16 | 4679 | 4344 | 27 | — |
| .tsx | test | 3 | 1596 | 1511 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/toolclub/dsh-agent-team-gui/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：可复用团队是否通过真实子Agent调用完成有界任务，并保留可核查的执行、质量与成本边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 团队对象与原生子Agent相比增加什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

这是面向DSH Web profile的原生插件，既有宿主Service入口、组合patch，也有浏览器界面。团队是持久成员与设置的组合，不是单次运行或用户身份：init打开agents、squads、会话模式、消息认领和runs等表，成员模型和工具策略可复用；单次dispatch生成运行记录。它适合反复需要规划、实现、评审分工的开发者，合格结果应是可检查交付和测试，而非出现多份成员回答。

相对原生一次性子Agent调用，增量在于可重用团队定义、可见任务依赖与运行历史；底层模型和子Agent循环来自宿主，不应归为本插件原创。README明确演示用例和Token不是实跑基准，还列出1.3.0只支持0.1.5范围，0.1.7在范围外。故不把当前日期下较新DSH当成自动兼容。使用前应固定匹配宿主、模型路由和工具，再从空白项目的小任务开始；没有业务频率或单Agent对照，不能证明多成员安排值得额外成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-22](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/README.md#L10-L22)

作者定位并明确演示非基准。

<details>
<summary>查看原文（13行）</summary>

```text
**Give DeepSeek Harness a reusable team: one Agent plans, another implements, and a third reviews.**

Save the team once, choose a model for each member, and reuse it across projects and conversations.
Follow the plan, member outputs, retries, and provider-reported Token usage in one Run Center.
This is an unofficial community plugin for the **DeepSeek Harness Web profile**.

[Watch the 80-second UI guide](https://github.com/toolclub/dsh-agent-team-gui/blob/main/assets/promotion-walkthrough-zh.mp4) · [Install v1.3.0](#install) · [Run your first team](docs/first-team.md) ·
[Example recipe](examples/full-stack-delivery.recipe.json) ·
[Share a workflow](https://github.com/toolclub/dsh-agent-team-gui/discussions/1)

[![UI walkthrough: reusable team setup, run inspection, and recipes](https://raw.githubusercontent.com/toolclub/dsh-agent-team-gui/main/assets/promotion-walkthrough-preview.gif)](https://github.com/toolclub/dsh-agent-team-gui/blob/main/assets/promotion-walkthrough-zh.mp4)

*Screenshot-based UI guide with example data and Chinese synthetic narration. Displayed task results, timings, and Tokens are not a live-run benchmark. [Sources and captions](docs/promotion/demo-guide.md).*
```

</details>

**依据 2 · 作者声明**：[README.md:43-76](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/README.md#L43-L76)

固定版本兼容与边界。

<details>
<summary>查看原文（34行）</summary>

````text
| Plugin release | DSH target | Upgrade guidance |
| --- | --- | --- |
| **1.3.0** | `>=0.1.5-rc.1 <0.1.6-0` | Recommended; selectable on-demand delegation and consistent mode boundaries |
| 1.2.0 | `>=0.1.5-rc.1 <0.1.6-0` | Failure diagnosis and bounded lead-driven continuation |
| 1.1.1 | `>=0.1.5-rc.1 <0.1.6-0` | Earlier workflow fixes; retries still replay the assignment |
| 1.1.0 | `>=0.1.5-rc.1 <0.1.6-0` | Initial 0.1.5 compatibility; upgrade the plugin to 1.3.0 |
| 1.0.1 | Verified with `0.1.1-rc.2` | Previous integration; upgrade both DSH and the plugin together |

The walkthrough has [English subtitles](https://github.com/toolclub/dsh-agent-team-gui/blob/main/docs/promotion/demo-captions.en.srt)
and [Chinese subtitles](https://github.com/toolclub/dsh-agent-team-gui/blob/main/docs/promotion/demo-captions.zh-CN.srt).
Load the SRT alongside the existing video in a compatible player; GitHub does not attach it automatically.

Upgrading DSH from 0.1.1? Use plugin **v1.3.0** for DSH **0.1.5**. This release fixes
`source.subscribe` during plugin loading, migrates reconnect and Session APIs, and keeps the existing
team definitions and run store. Restart DSH and refresh the browser after upgrading. The CLI may
report `0.1.5-rc.1` while its compatible internal packages resolve to `0.1.5-rc.2`.

Requirements: a working DeepSeek Harness **Web** profile, at least one configured provider/model,
Node.js `>=22.19.0 <23` or `>=24.0.0`, and pnpm. Declared DSH compatibility is
`>=0.1.5-rc.1 <0.1.6-0`; the v1.3.0 release was verified against DSH `0.1.5-rc.1`.

**Recommended: install the compiled release package.** It includes the built Host and client files,
so installation does not run this plugin's Git `prepare` build or require its `allowBuilds` entry.

```sh
dsh plugin --profile web add https://github.com/toolclub/dsh-agent-team-gui/releases/download/v1.3.0/dsh-agent-team-gui-1.3.0.tgz
dsh --profile web
```

Stop and restart an already-running DSH Web process after installing or upgrading. Then open
**Settings → Teams**. If a plugin marketplace chooses Git installation and fails, use the direct
release command above; see [installation troubleshooting](docs/first-team.md#installation-troubleshooting).

DSH `0.1.7-rc.2` is outside this release's declared host range; its installer rejects v1.3.0's peer ranges and rolls back the installation (reproduced on macOS arm64, Node 26.5.0, pnpm 12.6.0). Do not treat a change of installation source as runtime support. The Node engine range is not a claim that every newer Node/DSH combination has been tested.
````

</details>

**依据 3 · 源码核查**：[src/index.ts:35-80](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/index.ts#L35-L80)

宿主依赖、持久表、工具和提示注册。

<details>
<summary>查看原文（46行）</summary>

```text
export class AgentTeamService extends ExecutionApplicationService {
  static inject = ['storageDomain', 'tools', 'subagents', 'llm', 'agents', 'sessions', 'systemPrompt']

  static Config: z<AgentTeamConfig> = z.object({
    defaultProvider: z.string().default('spawn'),
    defaultExecutionMode: z.union(['serial', 'parallel'] as const).default('serial'),
    defaultContextMode: z.union(['spawn', 'fork', 'chain'] as const).default('spawn'),
    historyMaxRuns: z.number().min(0).max(5_000).step(1).default(0),
    historyMaxAgeDays: z.number().min(0).max(3_650).step(1).default(0),
    versionMaxPerSquad: z.number().min(0).max(1_000).step(1).default(0),
  })

  constructor(ctx: Context, config: AgentTeamConfig) {
    super(ctx, config)
    registerAgentTeamRpc(ctx, this)
  }

  protected async [Service.init](): Promise<void> {
    const domain = await this.ctx.storageDomain.open(agentTeamDomainSpec)
    this.ctx.effect(() => () => domain.close(), 'agent_team_gui.domainClose')
    this.attachTables({
      agents: domain.table('agents'),
      squads: domain.table('squads'),
      sessionModes: domain.table('session_modes'),
      nextModes: domain.table('next_modes'),
      messageClaims: domain.table('message_claims'),
      runs: domain.table('runs'),
      squadVersions: domain.table('squad_versions'),
      projectDefaults: domain.table('project_defaults'),
    })

    const { reconciled, pruned } = await this.recoverRunHistory()
    const prunedClaims = await this.pruneMessageClaims()
    if (reconciled > 0 || pruned > 0 || prunedClaims > 0) {
      this.ctx.logger.info(`[agent-team-gui] recovered ${reconciled} interrupted runs and pruned ${pruned} old runs/${prunedClaims} message receipts`)
    }

    this.ctx.tools.register(createDispatchToSquadTool(this))
    this.ctx.tools.register(createContinueSquadRunTool(this))
    this.ctx.tools.guard(teamChildToolGuard(this.ctx.tools))
    const systemPrompt = this.ctx.get('systemPrompt') as SystemPromptService
    systemPrompt.section({
      name: 'agent-team:squad-mode',
      order: 118,
      text: context => this.squadModeGuidance(context.agent),
    })
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:59-87](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/client/index.ts#L59-L87)

团队设置、输入模式和运行中心接线。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'agent-teams',
    order: 25,
    label: () => controller.i18n.t('teams'),
    inject: () => ({ controller }),
  }, TeamSettingsPage))

  ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
    name: 'conversation.input.right',
    id: 'agent-team-gui-mode',
    order: 80,
    inject: () => ({ controller }),
  }, TeamComposerControl))

  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
    name: 'conversation.input.dock',
    id: 'agent-team-run-dock',
    order: 15,
    inject: () => ({ controller }),
  }, TeamRunDock))

  ctx.slots.inject('conversation.view', () => ctx.slots.register({
    name: 'conversation.view',
    id: 'agent-team-runs',
    order: 20,
    label: () => controller.i18n.t('runs'),
    inject: () => ({ controller }),
  }, TeamRunCenter))
```

</details>

**依据 5 · 源码核查**：[cordis.patch.yml:1-10](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/cordis.patch.yml#L1-L10)

Web组合加载入口。

<details>
<summary>查看原文（10行）</summary>

```text
# agent_team_gui is a Web-profile bundle. dsh-web-app already owns the storage,
# Connection RPC and browser module rows this plugin consumes. `insert` never
# deduplicates an existing id, so this layer inserts only its own unique row.
- insert:
    - id: agent-team-gui
      name: 'dsh-agent-team-gui'
      config:
        defaultProvider: spawn
        defaultExecutionMode: serial
        defaultContextMode: spawn
```

</details>

#### 缺口

- 没有重复任务频率和同预算单Agent结果对照。
  **影响**：可复用组织价值尚未转为已测业务收益。
  **进一步探讨**：以相同任务和预算记录单Agent、手动子Agent和本插件的交付合格率与人工复核。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 用户输入如何成为真正的子Agent执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

实际执行链存在，不能把此项目仅归为静态流程图。agent/pre-step先调用next，忽略拒绝、取消及被委派Agent，找到直接用户消息，解析单次Solo/Team和会话/项目团队模式，再通过消息认领避免同消息重复dispatch。前台把结构化团队结果加入主Agent上下文；后台只告知启动，代码明确禁止暗示未完成结果已经纳入。

执行服务把计划结构化为最多32个成员、每成员独立任务和dependsOn，校验身份、重复、自依赖、顺序和环；动态规划本身由无工具、有限深度的子运行给出结构化计划，能力不足会拒绝。执行时按依赖就绪波次和并发上限运行，真实调用ctx.subagents.start，传入父Agent、模型、persona、工具过滤、深度与signal，等到run.result并持久成员状态及用量。依赖失败是否继续受failurePolicy影响，continue不是严格“失败依赖禁止下游”的保证。成员能否办结任务仍取决于配置工具、模型和工作区；源代码证明接线及边界，不证明交付质量。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:85-125](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/index.ts#L85-L125)

用户消息、模式和认领进入dispatch。

<details>
<summary>查看原文（41行）</summary>

```text
  private registerConversationOrchestration(): void {
    this.ctx.on('agent/pre-step', async ({ agent, signal }, next) => {
      const decision = await next()
      if (decision.kind === 'reject' || signal.aborted || this.isDelegatedAgent(agent)) return decision
      const submitted = [...decision.messages].reverse()
        .find((message): message is UserMessage => message.source.kind === 'user')
      if (submitted === undefined) return decision
      const task = this.messageText(submitted)
      if (task.trim() === '') return decision

      const nextMode = await this.claimNextSessionSquadMode(agent.id, submitted.id)
      if (nextMode?.state === 'solo') {
        await this.claimGuaranteedMessage(agent, submitted.id, 'solo')
        await this.clearClaimedNextSessionSquadMode(agent.id, submitted.id)
        return { ...decision, messages: [...decision.messages, createUserMessage({
          content: [{ type: 'text', text: 'The user selected Solo for this message. Answer directly; do not call dispatch_to_squad or continue_squad_run. This one-shot choice overrides the conversation team default.' }],
          source: { kind: 'plugin', plugin: 'dsh-agent-team-gui', form: 'notice', summary: 'Solo for this message' },
        })] }
      }
      const mode = nextMode?.state === 'team' && nextMode.squadId !== undefined
        ? (() => {
            const selected = this.getSquad(nextMode.squadId!)
            return selected === undefined ? undefined : { sessionId: agent.id, squadId: nextMode.squadId!, squadName: selected.name }
          })()
        : this.getEffectiveSessionSquadMode(agent)
      if (mode === undefined) return decision
      const squad = this.getSquad(mode.squadId)
      const explicitOnce = nextMode?.state === 'team'
      if (squad === undefined
        || (!explicitOnce && (squad.triggerMode ?? 'guaranteed') !== 'guaranteed')
        || (!explicitOnce && (squad.activationMode ?? 'always') === 'manual')) return decision

      const claimed = await this.claimGuaranteedMessage(agent, submitted.id, 'team')
      if (explicitOnce) await this.clearClaimedNextSessionSquadMode(agent.id, submitted.id)
      if (!claimed) return decision
      if ((squad.responseMode ?? 'foreground') === 'background') {
        try {
          const run = await this.startBackgroundDispatch({ squadId: mode.squadId, task }, agent, {
            sessionId: agent.id,
            sourceMessageId: submitted.id,
          }, signal)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:145-169](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/index.ts#L145-L169)

前台失败披露与结果加入上下文。

<details>
<summary>查看原文（25行）</summary>

```text
      let result: SquadDispatchResult
      try {
        result = await this.dispatch({ squadId: mode.squadId, task }, agent, signal, {
          sessionId: agent.id,
          sourceMessageId: submitted.id,
        })
      } catch (error: unknown) {
        this.ctx.logger.warn(`[agent-team-gui] guaranteed dispatch failed; allowing lead model to continue: ${this.errorText(error)}`)
        return {
          kind: 'enter' as const,
          messages: [...decision.messages, createUserMessage({
            content: [{ type: 'text', text: `The selected squad could not run: ${this.errorText(error)}. Continue answering the user directly and disclose the team failure briefly.` }],
            source: { kind: 'plugin', plugin: 'dsh-agent-team-gui', form: 'notice', summary: 'Squad dispatch failed' },
          })],
        }
      }
      return {
        kind: 'enter' as const,
        messages: [...decision.messages, createUserMessage({
          content: [{ type: 'text', text: this.renderSquadContext(result) }],
          source: {
            kind: 'plugin', plugin: 'dsh-agent-team-gui', form: 'notice',
            summary: `${result.squadName}: ${result.status}, ${result.usage.totalTokens} tokens`,
          },
        })],
```

</details>

**依据 3 · 源码核查**：[src/tools/orchestration.ts:33-101](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/orchestration.ts#L33-L101)

计划身份、顺序、环和有界校验。

<details>
<summary>查看原文（69行）</summary>

```text
  if (plan.assignments.length === 0) throw new Error('a running plan must select at least one member')
  if (plan.assignments.length > 32 || plan.memberOrder.length > 32) throw new Error('a plan may contain at most 32 members')
  const squadIds = new Set(squad.members)
  const assignments = new Map<AgentId, SquadPlanAssignment>()
  for (const node of plan.assignments) {
    if (!squadIds.has(node.agentId)) throw new Error(`plan member "${node.agentId}" is not in the squad`)
    if (assignments.has(node.agentId)) throw new Error(`plan member "${node.agentId}" appears more than once`)
    if (node.task.trim() === '') throw new Error(`plan assignment for "${node.agentId}" is empty`)
    if (node.task.length > 100_000 || node.dependsOn.length > 32) throw new Error(`plan assignment for "${node.agentId}" exceeds bounded limits`)
    if (new Set(node.dependsOn).size !== node.dependsOn.length) {
      throw new Error(`plan dependencies for "${node.agentId}" must be unique`)
    }
    assignments.set(node.agentId, { ...node, task: node.task.trim(), dependsOn: [...node.dependsOn] })
  }
  if (options.requireAllMembers && assignments.size !== squad.members.length) {
    throw new Error('the plan must assign every configured member')
  }
  for (const node of assignments.values()) {
    for (const dependency of node.dependsOn) {
      if (dependency === node.agentId) throw new Error(`plan member "${node.agentId}" cannot depend on itself`)
      if (!assignments.has(dependency)) {
        throw new Error(`plan dependency "${dependency}" is not a selected member`)
      }
    }
  }

  const claimed = new Set(plan.memberOrder)
  if (plan.memberOrder.length !== assignments.size || claimed.size !== assignments.size
    || [...assignments.keys()].some(id => !claimed.has(id))) {
    throw new Error('memberOrder must contain every selected plan member exactly once')
  }
  // The planner's order is authoritative for otherwise-ready nodes. Requiring
  // each dependency to appear first makes that order a valid topological
  // ordering instead of silently rewriting the Main Agent's workflow.
  const stableIndex = new Map(plan.memberOrder.map((id, index) => [id, index]))
  for (const node of assignments.values()) {
    for (const dependency of node.dependsOn) {
      if ((stableIndex.get(dependency) ?? Number.MAX_SAFE_INTEGER) >= (stableIndex.get(node.agentId) ?? -1)) {
        throw new Error(`memberOrder places dependency "${dependency}" after "${node.agentId}"`)
      }
    }
  }

  const indegree = new Map<AgentId, number>()
  const followers = new Map<AgentId, AgentId[]>()
  for (const node of assignments.values()) {
    indegree.set(node.agentId, node.dependsOn.length)
    for (const dependency of node.dependsOn) {
      const list = followers.get(dependency) ?? []
      list.push(node.agentId)
      followers.set(dependency, list)
    }
  }
  const ready = [...assignments.keys()].filter(id => indegree.get(id) === 0)
    .sort((left, right) => (stableIndex.get(left) ?? 0) - (stableIndex.get(right) ?? 0))
  const order: AgentId[] = []
  while (ready.length > 0) {
    const id = ready.shift()!
    order.push(id)
    for (const follower of followers.get(id) ?? []) {
      const next = (indegree.get(follower) ?? 1) - 1
      indegree.set(follower, next)
      if (next === 0) {
        ready.push(follower)
        ready.sort((left, right) => (stableIndex.get(left) ?? 0) - (stableIndex.get(right) ?? 0))
      }
    }
  }
  if (order.length !== assignments.size) throw new Error('plan dependencies contain a cycle')
```

</details>

**依据 4 · 源码核查**：[src/tools/application/execution-service.ts:1033-1058](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/application/execution-service.ts#L1033-L1058)

结构化无工具规划实际调用。

<details>
<summary>查看原文（26行）</summary>

```text
    try {
      if (capabilities === undefined || !capabilities.outputSchema || !capabilities.toolFilter || !capabilities.depthLimit) {
        throw new Error(`planner provider "${provider}" cannot enforce structured, tool-filtered, depth-bounded planning`)
      }
      run = await this.ctx.subagents.start(provider, {
        label: `${squad.name}/${useMainAgent ? 'Main workflow planner' : 'Squad leader planner'}`,
        parent,
        signal,
        prompt: [{ type: 'text', text: plannerPrompt }],
        outputSchema,
        ...Object.keys(plannerAgentOptions).length === 0 ? {} : { agentOptions: plannerAgentOptions },
        ...plannerToolScope === undefined ? {} : { toolFilter: plannerToolScope },
        maxDepth: 1,
        ...capabilities?.persona === false ? {} : { persona: useMainAgent
          ? 'You are the main Agent\'s workflow planner. Produce only a concise, executable division of work. Do not execute the task, call tools, dispatch teams, or create subagents.'
          : `${leader?.systemPrompt ?? ''}\nYou are the fallback squad leader planner. Produce only a concise executable division of work. Do not execute the task, call tools, dispatch teams, or create subagents.` },
      })
      baseline = this.usageBaselineFor(run)
      if (dispatchId !== undefined) stopUsageTracking = this.trackAuxiliaryUsage(dispatchId, 'planner', run, baseline)
      const result = await run.result
      const usage = await finishPlannerUsage()
      const structured = result.structured as { decision?: unknown; reason?: unknown; summary?: unknown; memberOrder?: unknown; assignments?: unknown } | undefined
      if (result.stopReason !== 'completed' || structured === undefined
        || (structured.decision !== 'run' && structured.decision !== 'skip')
        || typeof structured.reason !== 'string' || typeof structured.summary !== 'string' || !Array.isArray(structured.memberOrder)
        || !Array.isArray(structured.assignments)) throw new Error(`planner ended without a valid plan (${result.stopReason})`)
```

</details>

**依据 5 · 源码核查**：[src/tools/application/execution-service.ts:620-655](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/application/execution-service.ts#L620-L655)

成员真实subagent调用及等待。

<details>
<summary>查看原文（36行）</summary>

```text
      const run = await this.ctx.subagents.start(provider, {
        label: `${squad.name}/${member.record.name}`,
        prompt: [{ type: 'text', text: prompt }],
        parent,
        signal: memberSignal,
        agentOptions: {
          agentTeamGuiChild: true,
          ...(member.record.toolScope?.deny === undefined ? {} : { agentTeamGuiDeniedTools: [...member.record.toolScope.deny] }),
          provider: selectedRoute.provider,
          model: selectedRoute.model,
          ...member.record.maxTokens === undefined ? {} : { maxTokens: member.record.maxTokens },
        },
        ...childToolScope === undefined ? {} : { toolFilter: childToolScope },
        ...member.record.systemPrompt.length === 0 ? {} : { persona: member.record.systemPrompt },
        ...capabilities?.outputSchema === true ? { outputSchema: handoffSchema } : {},
        ...capabilities?.depthLimit === true ? { maxDepth: 1 } : {},
      })
      const baseline = this.usageBaselineFor(run)
      const previousUsage = persist
        ? this.runs().get(dispatchId)?.members.find(item => item.agentId === member.id)?.usage
        : undefined
      const stopUsageTracking = persist
        ? this.trackRunUsage(dispatchId, member.id, run, baseline, previousUsage)
        : auxiliaryUsage === undefined ? async () => undefined : this.trackAuxiliaryUsage(dispatchId, auxiliaryUsage, run, baseline)
      let settled: SquadMemberResult
      let finalAttemptUsage: AgentTokenUsage | undefined
      try {
        settled = await this.settleRun(
          member,
          run,
          attempt,
          startedAt,
          squad.handoffSummaryMaxChars ?? DEFAULT_HANDOFF_SUMMARY_MAX_CHARS,
          baseline,
        )
      } finally {
```

</details>

**依据 6 · 源码核查**：[src/tools/application/execution-service.ts:1521-1556](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/application/execution-service.ts#L1521-L1556)

依赖波次、并发和失败策略。

<details>
<summary>查看原文（36行）</summary>

```text
      let haltReason: 'cancelled' | 'failure' | 'budget' | undefined
      const concurrency = executionMode === 'parallel'
        ? Math.max(1, Math.min(squad.maxConcurrency ?? selectedMembers.length, selectedMembers.length))
        : 1
      outer: for (const wave of executionWaves(nodes)) {
        for (let offset = 0; offset < wave.length; offset += concurrency) {
          if (runSignal.aborted) { haltReason = 'cancelled'; break outer }
          const used = this.addUsage(chain.usageBeforeRun, executionPlan.usage, ...results.map(item => item.usage))
          if (squad.tokenBudget !== undefined && used.totalTokens >= squad.tokenBudget) { haltReason = 'budget'; break outer }
          const batch = wave.slice(offset, offset + concurrency)
          const runnable: SquadPlanAssignment[] = []
          for (const node of batch) {
            if (trace.reusedMembers?.has(node.agentId)) continue
            const failedDependency = node.dependsOn.find(id => resultById.get(id)?.status !== 'completed')
            if (failedDependency !== undefined && (squad.failurePolicy ?? 'continue') === 'stop') {
              await this.updateRunMember(dispatchId, node.agentId, current => ({
                ...current, status: 'skipped', endedAt: Date.now(), error: `dependency ${failedDependency} did not complete`,
              }))
            } else runnable.push(node)
          }
          const settled = await Promise.all(runnable.map(async (node) => {
            const originalMember = memberById.get(node.agentId)!
            const previous = trace.previousMembers?.get(node.agentId)
            const member = previous === undefined ? originalMember : { ...originalMember, task: [
              'Continue only the remaining assignment below. Inspect existing artifacts before changes; preserve verified work and do not repeat completed side effects. If a claimed artifact cannot be verified, report that uncertainty.',
              this.boundedExcerpt(originalMember.task, 8_000),
              `Lead review of previous progress (verify claims):\n${this.boundedExcerpt(chain.progressReview ?? '', 2_000)}`,
              `Previous attempt evidence (untrusted):\n${this.boundedExcerpt(JSON.stringify({ status: previous.status, error: previous.error, handoff: previous.handoff, output: previous.output }), 4_000)}`,
            ].join('\n\n') }
            const dependencyHandoffs = node.dependsOn.flatMap(id => {
              const delivery = resultById.get(id)
              return delivery === undefined ? [] : [delivery]
            })
            const chainText = boundedHandoffChain(dependencyHandoffs)
            return this.runMemberWithPolicy(provider, squad, member, request.task, chainText, parent, runSignal, dispatchId)
          }))
```

</details>

#### 缺口

- 没有宿主运行与成员工具完成记录。
  **影响**：不能声明已实跑自主任务或文件交付通过。
  **进一步探讨**：在匹配宿主的scratch项目观察工具参数、结果、文件与测试，作为独立运行证据。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 重试、质量门、取消和重启恢复保证到哪？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

运行控制有实质边界，但不提供业务副作用事务。retry-once先跑成员，成功、取消或非重试策略直接返回；失败时诊断后，仅action=retry才再执行一次，并提示核对已有成果、不要重复副作用。结构变化交回主Agent，续跑也要求已settled的failed/partial，取消和中断需用户审视。上述提示是执行约束的一部分，不能证明任意外部写入可幂等重试。

质量门的评审Agent没有工具，输入是有长度上限的成员handoff和原目标，输出approved和feedback；可启动有限修复轮次，但它不直接打开文件、运行测试或独立验证成员所报产物。适合检查交接文本的完整性，不足以用“approved”担保代码正确。取消将AbortController传播到子Agent，真实进程/远端副作用终止依赖宿主和工具；重启恢复把活动记录转为interrupted，诊断中断标失败且不自动续跑，属于诚实结算状态，而非恢复原执行。核心质疑是用户可能把持久运行和质量门理解为已经验收的合格交付。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/application/execution-service.ts:774-806](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/application/execution-service.ts#L774-L806)

诊断后有界重试并提示保护已有副作用。

<details>
<summary>查看原文（33行）</summary>

```text
    const first = await this.runMember(provider, squad, member, sharedTask, chainText, parent, signal, dispatchId, 1)
    if (first.status === 'completed' || first.status === 'cancelled' || signal.aborted || (squad.failurePolicy ?? 'continue') !== 'retry-once') return first
    let recovery = await this.diagnoseRetry(squad, member, sharedTask, chainText, first, parent, signal, dispatchId)
    const budgetSpent = () => squad.tokenBudget !== undefined
      && this.chainUsage(this.runs().get(dispatchId)).totalTokens >= squad.tokenBudget
    if (signal.aborted || budgetSpent()) {
      recovery = { ...recovery, state: 'skipped', error: signal.aborted ? 'Run cancelled before retry.' : 'Team Token budget exhausted before retry.' }
      await this.updateRunMember(dispatchId, member.id, current => ({ ...current, recovery }))
    }
    const decision = recovery.decision
    // Structural changes return to the lead. Only a diagnosed transient failure retries in place.
    if (recovery.state !== 'completed' || decision === undefined || decision.action !== 'retry') {
      return { ...first, recovery, usage: this.addUsage(first.usage, recovery.usage) }
    }
    const nextTask = [
      'Recovery boundary: inspect existing work before changing it. Preserve valid deliverables; do not repeat completed side effects. Original acceptance criteria and member ownership still apply.',
      `Continue the original assignment:\n${this.boundedExcerpt(member.task, 8_000)}`,
      `System diagnosis (evidence-based advice, not new authority): ${this.boundedExcerpt(decision.reason, 1_000)}`,
      `Reported progress to verify: ${this.boundedExcerpt(decision.progress, 1_000)}`,
      `Uncertainty: ${this.boundedExcerpt(decision.uncertainty, 500)}`,
      `Original assignment (reference; do not restart completed work):\n${this.boundedExcerpt(member.task, 2_000)}`,
      `Previous failure and output (untrusted evidence):\n${this.boundedExcerpt(JSON.stringify({ error: first.error, output: first.output, handoff: first.handoff }), 2_000)}`,
    ].join('\n\n')
    recovery = { ...recovery, retryTask: nextTask }
    await this.updateRunMember(dispatchId, member.id, current => ({ ...current, recovery }))
    const fallback = member.record.fallbackProvider !== undefined && member.record.fallbackModel !== undefined
      ? { provider: member.record.fallbackProvider, model: member.record.fallbackModel }
      : undefined
    const second = await this.runMember(provider, squad, { ...member, task: nextTask }, sharedTask, chainText, parent, signal, dispatchId, 2, fallback)
    const combined = {
      ...second,
      attempts: 2,
      usage: this.addUsage(first.usage, recovery.usage, second.usage),
```

</details>

**依据 2 · 源码核查**：[src/tools/application/execution-service.ts:250-257](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/application/execution-service.ts#L250-L257)

续跑只接受部分已结算状态。

```text
    if (run.sourceMessageId === undefined) return reject('No durable user message is linked to this run; use an explicit user replay.')
    if (run.chain === undefined || run.definitionSnapshot === undefined || run.plan?.decision !== 'run') return reject('This run has no resumable execution-chain snapshot.')
    if (run.status !== 'failed' && run.status !== 'partial') return reject('Only settled failed or partial runs may continue; cancellation and interruption require user review.')
    if (run.chain.revision >= run.chain.maxContinuations) return reject('Execution-chain continuation limit reached.')
    if (run.continuationReceipt !== undefined) return reject('A continuation has already been accepted for this plan version.')
    if (run.chain.tokenBudget !== undefined && this.chainUsage(run).totalTokens >= run.chain.tokenBudget) return reject('Execution-chain Token budget exhausted.')
    if (run.members.some(member => member.status !== 'completed' && (exhaustedQuota(member.error) || exhaustedQuota(member.recovery?.error)))) return reject('Provider billing quota or balance is exhausted; user action is required.')
    if (!run.plan.assignments.some(node => run.members.find(member => member.agentId === node.agentId)?.status !== 'completed')) return reject('No unfinished member task; quality-only failures require user review.')
```

**依据 3 · 源码核查**：[src/tools/application/execution-service.ts:1148-1185](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/application/execution-service.ts#L1148-L1185)

质量门无工具且只看bounded handoffs。

<details>
<summary>查看原文（38行）</summary>

```text
      run = await this.ctx.subagents.start(provider, {
        label: `${squad.name}/Quality review ${round}`,
        parent,
        signal: reviewSignal,
        prompt: [{ type: 'text', text: [
          'Review contract: return only a bounded verdict. Do not repair, call tools, dispatch teams, or create subagents.',
          `Quality criteria:\n${squad.qualityGate?.criteria?.trim() || 'Correct, complete, internally consistent, and supported by the reported deliverables.'}`,
          `Bounded handoffs:\n${boundedHandoffChain(memberResults, 32_000)}`,
          'Return approved=true only if no repair is required. Feedback must be concrete and bounded. Do not do the repair, call tools, dispatch teams, or create subagents.',
          `Original goal (bounded head/tail excerpt):\n${this.boundedExcerpt(sharedTask, 24_000)}`,
        ].join('\n\n') }],
        agentOptions: {
          provider: reviewer.record.provider,
          agentTeamGuiChild: true,
          model: reviewer.record.model,
          maxTokens: reviewer.record.maxTokens ?? 2_048,
        },
        outputSchema: {
          type: 'object', additionalProperties: false,
          properties: { approved: { type: 'boolean' }, feedback: { type: 'string' } },
          required: ['approved', 'feedback'],
        },
        toolFilter: { allow: [] as string[] },
        maxDepth: 1,
        ...capabilities?.persona === false ? {} : { persona: reviewer.record.systemPrompt },
      })
      baseline = this.usageBaselineFor(run)
      stopUsageTracking = this.trackAuxiliaryUsage(dispatchId, 'review', run, baseline)
      const settled = await run.result
      const usage = await finishReviewUsage()
      const structured = settled.structured as { approved?: unknown; feedback?: unknown } | undefined
      if (settled.stopReason !== 'completed' || typeof structured?.approved !== 'boolean' || typeof structured.feedback !== 'string') {
        throw new Error(`quality reviewer ended without a valid verdict (${settled.stopReason})`)
      }
      const status = timeout.signal.aborted ? 'timed-out' : signal.aborted ? 'cancelled' : 'completed'
      const feedback = structured.feedback.slice(0, 8_000)
      return {
        approved: status === 'completed' && structured.approved,
```

</details>

**依据 4 · 源码核查**：[src/tools/application/execution-service.ts:1231-1242](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/application/execution-service.ts#L1231-L1242)

评审/修复轮次与预算入口。

<details>
<summary>查看原文（12行）</summary>

```text
    const gate = squad.qualityGate
    if (gate === undefined || signal.aborted || memberResults.length === 0) return undefined
    const reviewerRecord = agents.get(gate.reviewerAgentId)
    const repairRecord = agents.get(gate.repairAgentId)
    if (reviewerRecord === undefined || repairRecord === undefined) return undefined
    const reviewer: ResolvedMember = { id: gate.reviewerAgentId, record: reviewerRecord, task: '' }
    const repair: ResolvedMember = { id: gate.repairAgentId, record: repairRecord, task: '' }
    const rounds: SquadQualityRound[] = []
    let current = memberResults
    let consumed = usageBeforeQuality
    for (let index = 0; index <= gate.maxRounds; index += 1) {
      if (signal.aborted || (squad.tokenBudget !== undefined && consumed.totalTokens >= squad.tokenBudget)) break
```

</details>

**依据 5 · 源码核查**：[src/tools/application/execution-service.ts:1914-1927](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/application/execution-service.ts#L1914-L1927)

取消控制器而非外部副作用回滚。

<details>
<summary>查看原文（14行）</summary>

```text
  cancelRun(id: DispatchId): boolean {
    const controller = this.activeRunControllers.get(id)
    if (controller === undefined) return false
    controller.abort(new Error('cancelled from Agent Team GUI'))
    if (this.pendingBackgroundRuns.delete(id)) {
      this.activeRunControllers.delete(id)
      const endedAt = Date.now()
      void this.updateRun(id, run => ({
        ...run,
        status: 'cancelled',
        phase: 'settled',
        endedAt,
        error: 'cancelled before background execution started',
        members: run.members.map(member => ({
```

</details>

**依据 6 · 源码核查**：[src/tools/run-history.ts:123-137](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/run-history.ts#L123-L137)

重启结算为interrupted，不自动继续。

<details>
<summary>查看原文（15行）</summary>

```text
  async reconcileInterrupted(now = Date.now()): Promise<number> {
    let changed = 0
    for (const [id, run] of this.table.entries()) {
      if (!ACTIVE.has(run.status)) continue
      changed += 1
      await this.table.update(id, current => ({
        ...current,
        status: 'interrupted',
        phase: 'settled',
        endedAt: now,
        error: 'DSH stopped or restarted before this run completed.',
        members: current.members.map(member => ({
          ...member,
          ...(member.status === 'pending' || member.status === 'running' ? { status: 'interrupted' as const, endedAt: now, error: 'Host restarted before this member completed.' } : {}),
          ...(member.recovery?.state === 'diagnosing' ? { recovery: { ...member.recovery, state: 'failed' as const, endedAt: now, error: 'Host restarted during diagnosis. No automatic continuation.' } } : {}),
```

</details>

#### 缺口

- 没有取消、重启和部分外部写入的故障注入结果。
  **影响**：不能承诺无重复副作用或取消后全部进程停止。
  **进一步探讨**：用可核对事务ID的隔离写入任务在响应丢失、取消、宿主重启处中断并核对实际结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 模型、工具权限和Token数据如何影响成本？

**研究主题**：依赖、兼容与流程、效果与总成本、功能与机制

#### 完整回答

成员的模型路由、工具允许/拒绝策略和maxTokens进入宿主start。childToolScope要求provider能够工具过滤与深度约束，未知allow工具拒绝，递归委派工具被过滤；运行时guard还按子Agent标记拦截作用域别名和配置deny，诊断Agent不能执行工具。这比仅在提示词里写“不要再委派”更强，但过滤不是文件系统隔离，不代表不同成员自动获得独占工作区。

Token读取宿主session tokenUsage投影，fork减去既有基线，零总数保留未知样本；run-history单独算full/partial/none覆盖，把规划、每次尝试、诊断、评审和修复纳入。没有本地Agent或投影时可能无数据，不能把汇总0当免费。团队budget在调度批次、重试和质量轮次前比较已报告用量，不是正在运行调用的美元硬上限；并行一批已启动后及未报告用量都可能使实际开销超过该观察阈值。首次配成员、路由、工具及验收需人工，持续多模型、诊断和评审会消耗资源，价格和同任务收益未采集，不能声称节费。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/application/execution-service.ts:731-760](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/application/execution-service.ts#L731-L760)

provider能力和工具过滤。

<details>
<summary>查看原文（30行）</summary>

```text
  private childToolScope(record: AgentRecord, provider: string, parent: Agent): AgentRecord['toolScope'] | undefined {
    const runtime = this.ctx.subagents as unknown as {
      getProvider?(name: string): { readonly capabilities: { readonly toolFilter: boolean; readonly depthLimit: boolean } } | undefined
    }
    const capabilities = runtime.getProvider?.(provider)?.capabilities
    if (capabilities === undefined || capabilities.toolFilter === false || capabilities.depthLimit === false) {
      throw new AgentTeamError(`subagent provider "${provider}" cannot enforce the recursive-tool deny list and depth limit`, 'INVALID_DISPATCH')
    }
    const schemas = this.ctx.tools.schemas(parent)
    const globalSchemas = this.ctx.tools.schemas()
    const restrictable = new Set(globalSchemas.map(tool => tool.name).filter(name => name !== 'run_code'))
    const known = new Set(schemas.map(tool => tool.name))
    const unknownAllowed = (record.toolScope?.allow ?? []).filter(name => !known.has(name))
    if (unknownAllowed.length > 0) {
      throw new AgentTeamError(`member tool allow-list is unavailable in this session: ${unknownAllowed.join(', ')}`, 'INVALID_DISPATCH')
    }
    const recursiveTools = new Set([...globalSchemas, ...schemas].filter(isDelegationTool).map(tool => tool.name))
    // DSH validates deny entries against its global registry. A parent's
    // scope-local alias is not necessarily restrictable by a child. Preserve
    // scoped allows, and enforce recursive aliases with the execution guard.
    const deny = new Set([...record.toolScope?.deny ?? [], ...recursiveTools].filter(name => restrictable.has(name)))
    const allow = record.toolScope?.allow
    const recursiveAllowed = allow?.filter(name => recursiveTools.has(name) || deny.has(name)) ?? []
    if (recursiveAllowed.length > 0) {
      throw new AgentTeamError(`member tool allow-list cannot expose recursive delegation tools: ${recursiveAllowed.join(', ')}`, 'INVALID_DISPATCH')
    }
    if (allow === undefined && deny.size === 0) return undefined
    return {
      ...(allow === undefined ? {} : { allow: [...allow] }),
      ...(deny.size === 0 ? {} : { deny: [...deny] }),
```

</details>

**依据 2 · 源码核查**：[src/tools/delegation-policy.ts:19-49](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/delegation-policy.ts#L19-L49)

运行时拦截递归/deny及诊断工具。

<details>
<summary>查看原文（31行）</summary>

```text
const DELEGATION_NAMES = new Set(['dispatch_to_squad', 'continue_squad_run', 'subagent', 'subagent_fork', 'subagent_spawn', 'workflow'])

/** Recognize official delegation contracts even when optional route controls are added. */
export function isDelegationTool(tool: ToolShape): boolean {
  if (DELEGATION_NAMES.has(tool.name)) return true
  const parameters = tool.parameters as {
    properties?: Record<string, { type?: string }>
    required?: unknown
  } | undefined
  const properties = parameters?.properties
  if (properties === undefined) return false
  const required = new Set(Array.isArray(parameters?.required) ? parameters.required : [])
  return (properties['description']?.type === 'string' && required.has('description')
      && properties['prompt']?.type === 'string' && required.has('prompt'))
    || (properties['script']?.type === 'string' && required.has('script')
      && properties['meta']?.type === 'object' && required.has('meta'))
}

/** Catch scoped/renamed delegation at execution, including nested PTC calls. */
export function teamChildToolGuard(tools: Pick<ToolRuntime, 'get'>): ToolGuard {
  return execution => {
    if (execution.agent?.options.agentTeamGuiDiagnosis === true) return 'System recovery diagnosis cannot execute tools.'
    if (execution.agent?.options.agentTeamGuiChild !== true) return undefined
    if (execution.agent.options.agentTeamGuiDeniedTools?.includes(execution.name)) {
      return 'This tool is denied by the configured squad member policy.'
    }
    const definition = tools.get(execution.name, execution.agent)
    if (isDelegationTool(definition ?? { name: execution.name })) {
      return 'Squad members cannot create further subagents or workflows; return a handoff to the lead Agent.'
    }
    return undefined
```

</details>

**依据 3 · 源码核查**：[src/tools/infrastructure/official-usage-meter.ts:42-82](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/infrastructure/official-usage-meter.ts#L42-L82)

官方投影、未知与fork基线。

<details>
<summary>查看原文（41行）</summary>

```text
  private projectionFor(run: SubagentRun): TokenUsageProjection | undefined {
    if (run.localAgent === undefined) return undefined
    try {
      const projections = this.ctx.get('sessionProjections') as SessionProjectionService | undefined
      if (projections === undefined) return undefined
      const value = projections.snapshot(run.localAgent.session).values['tokenUsage'] as Partial<TokenUsageProjection> | undefined
      if (value === undefined) return undefined
      const projection = {
        uncachedInputTokens: value.uncachedInputTokens ?? 0,
        outputTokens: value.outputTokens ?? 0,
        cacheReadTokens: value.cacheReadTokens ?? 0,
        cacheWriteTokens: value.cacheWriteTokens ?? 0,
      }
      return Object.values(projection).every(item => Number.isSafeInteger(item) && item >= 0) ? projection : undefined
    } catch (error: unknown) {
      this.ctx.logger.warn(`[agent-team-gui] official tokenUsage read failed: ${error instanceof Error ? error.message : String(error)}`)
      return undefined
    }
  }

  usageFor(run: SubagentRun, baseline?: TokenUsageProjection): AgentTokenUsage | undefined {
    const current = this.projectionFor(run)
    if (current === undefined) return undefined
    const buckets = {
      uncachedInputTokens: Math.max(0, current.uncachedInputTokens - (baseline?.uncachedInputTokens ?? 0)),
      outputTokens: Math.max(0, current.outputTokens - (baseline?.outputTokens ?? 0)),
      cacheReadTokens: Math.max(0, current.cacheReadTokens - (baseline?.cacheReadTokens ?? 0)),
      cacheWriteTokens: Math.max(0, current.cacheWriteTokens - (baseline?.cacheWriteTokens ?? 0)),
    }
    const totalTokens = buckets.uncachedInputTokens + buckets.outputTokens + buckets.cacheReadTokens + buckets.cacheWriteTokens
    // The projection initializes at zero before a provider reports; absence is
    // more honest than displaying an invented zero sample.
    return totalTokens === 0 ? undefined : { ...buckets, totalTokens, providerReported: true }
  }

  baselineFor(run: SubagentRun): TokenUsageProjection | undefined {
    if (run.localAgent === undefined) return undefined
    try {
      if (run.localAgent.session.firstLiveSeq === 0) return undefined
    } catch { return undefined }
    return this.projectionFor(run)
```

</details>

**依据 4 · 源码核查**：[src/tools/run-history.ts:30-67](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/run-history.ts#L30-L67)

独立计量覆盖率。

<details>
<summary>查看原文（38行）</summary>

```text
export function runMeteringCoverage(run: SquadRunRecord): 'full' | 'partial' | 'none' {
  const expected: Array<AgentTokenUsage | undefined> = []
  const plannerAttempted = run.phase === 'planning'
    || run.liveUsage?.planner !== undefined
    || (run.plan !== undefined && run.plan.planner !== 'lead-continuation' && (run.plan.planner !== 'deterministic-fallback'
      || run.plan.plannerProvider !== undefined || run.plan.plannerModel !== undefined))
  if (plannerAttempted) expected.push(run.plan?.usage ?? run.liveUsage?.planner)
  for (const member of run.members) {
    if (member.recovery?.attempted) expected.push(member.recovery.usage)
    if (member.attemptUsage !== undefined && member.attemptUsage.length > 0) {
      for (const attempt of member.attemptUsage) expected.push(attempt.usage)
    } else if (member.usageSamples !== undefined) {
      for (let index = 0; index < member.usageSamples.metered; index += 1) expected.push(member.usage)
      for (let index = member.usageSamples.metered; index < member.usageSamples.total; index += 1) expected.push(undefined)
    } else if (member.attempts > 0 || member.startedAt !== undefined || member.status === 'running') {
      // Old rows have only an aggregate. A retry-once row cannot prove that
      // every attempt was metered, so never call attempts>1 fully covered.
      expected.push(member.usage)
      if (member.attempts > 1) expected.push(undefined)
    }
  }
  for (const round of run.quality?.rounds ?? []) {
    expected.push(round.reviewer.usage)
    if (round.repair !== undefined) expected.push(round.repair.usage)
  }
  if (run.qualityProgress?.state === 'reviewing'
    && (run.quality?.rounds.length ?? 0) < run.qualityProgress.round) {
    expected.push(run.liveUsage?.review)
  }
  if (run.qualityProgress?.state === 'repairing') {
    const round = run.quality?.rounds.find(item => item.round === run.qualityProgress!.round)
    if (round?.repair === undefined) expected.push(run.liveUsage?.repair)
  }
  if (expected.length === 0) return run.usage.providerReported ? 'full' : 'none'
  const metered = expected.filter(sample => sample?.providerReported === true).length
  if (metered === expected.length) return 'full'
  if (metered > 0 || run.usage.providerReported) return 'partial'
  return 'none'
```

</details>

**依据 5 · 源码核查**：[src/tools/application/execution-service.ts:1521-1541](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/application/execution-service.ts#L1521-L1541)

批次前检查已报告用量。

<details>
<summary>查看原文（21行）</summary>

```text
      let haltReason: 'cancelled' | 'failure' | 'budget' | undefined
      const concurrency = executionMode === 'parallel'
        ? Math.max(1, Math.min(squad.maxConcurrency ?? selectedMembers.length, selectedMembers.length))
        : 1
      outer: for (const wave of executionWaves(nodes)) {
        for (let offset = 0; offset < wave.length; offset += concurrency) {
          if (runSignal.aborted) { haltReason = 'cancelled'; break outer }
          const used = this.addUsage(chain.usageBeforeRun, executionPlan.usage, ...results.map(item => item.usage))
          if (squad.tokenBudget !== undefined && used.totalTokens >= squad.tokenBudget) { haltReason = 'budget'; break outer }
          const batch = wave.slice(offset, offset + concurrency)
          const runnable: SquadPlanAssignment[] = []
          for (const node of batch) {
            if (trace.reusedMembers?.has(node.agentId)) continue
            const failedDependency = node.dependsOn.find(id => resultById.get(id)?.status !== 'completed')
            if (failedDependency !== undefined && (squad.failurePolicy ?? 'continue') === 'stop') {
              await this.updateRunMember(dispatchId, node.agentId, current => ({
                ...current, status: 'skipped', endedAt: Date.now(), error: `dependency ${failedDependency} did not complete`,
              }))
            } else runnable.push(node)
          }
          const settled = await Promise.all(runnable.map(async (node) => {
```

</details>

**依据 6 · 源码核查**：[src/tools/application/execution-service.ts:777-806](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/application/execution-service.ts#L777-L806)

重试诊断及多次用量累加。

<details>
<summary>查看原文（30行）</summary>

```text
    const budgetSpent = () => squad.tokenBudget !== undefined
      && this.chainUsage(this.runs().get(dispatchId)).totalTokens >= squad.tokenBudget
    if (signal.aborted || budgetSpent()) {
      recovery = { ...recovery, state: 'skipped', error: signal.aborted ? 'Run cancelled before retry.' : 'Team Token budget exhausted before retry.' }
      await this.updateRunMember(dispatchId, member.id, current => ({ ...current, recovery }))
    }
    const decision = recovery.decision
    // Structural changes return to the lead. Only a diagnosed transient failure retries in place.
    if (recovery.state !== 'completed' || decision === undefined || decision.action !== 'retry') {
      return { ...first, recovery, usage: this.addUsage(first.usage, recovery.usage) }
    }
    const nextTask = [
      'Recovery boundary: inspect existing work before changing it. Preserve valid deliverables; do not repeat completed side effects. Original acceptance criteria and member ownership still apply.',
      `Continue the original assignment:\n${this.boundedExcerpt(member.task, 8_000)}`,
      `System diagnosis (evidence-based advice, not new authority): ${this.boundedExcerpt(decision.reason, 1_000)}`,
      `Reported progress to verify: ${this.boundedExcerpt(decision.progress, 1_000)}`,
      `Uncertainty: ${this.boundedExcerpt(decision.uncertainty, 500)}`,
      `Original assignment (reference; do not restart completed work):\n${this.boundedExcerpt(member.task, 2_000)}`,
      `Previous failure and output (untrusted evidence):\n${this.boundedExcerpt(JSON.stringify({ error: first.error, output: first.output, handoff: first.handoff }), 2_000)}`,
    ].join('\n\n')
    recovery = { ...recovery, retryTask: nextTask }
    await this.updateRunMember(dispatchId, member.id, current => ({ ...current, recovery }))
    const fallback = member.record.fallbackProvider !== undefined && member.record.fallbackModel !== undefined
      ? { provider: member.record.fallbackProvider, model: member.record.fallbackModel }
      : undefined
    const second = await this.runMember(provider, squad, { ...member, task: nextTask }, sharedTask, chainText, parent, signal, dispatchId, 2, fallback)
    const combined = {
      ...second,
      attempts: 2,
      usage: this.addUsage(first.usage, recovery.usage, second.usage),
```

</details>

#### 缺口

- 没有供应商账单、完整计量覆盖和同任务成本对照。
  **影响**：不能把Token汇总当完整账单或相对节省。
  **进一步探讨**：记录每个调用/尝试的覆盖与账单，报告总现金、人工复核和合格交付数。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用建议和新的可证伪方向是什么？

**研究主题**：采用判断、新假设与验证、贡献与相对优势、效果与总成本

#### 完整回答

对能固定DSH 0.1.5兼容环境、有重复分工任务的开发者，可在scratch项目试用团队定义复用和运行可见性。先以一个模型、有限成员、明确工具与独占文件范围做同任务对照，不因可选多个模型就一次扩充预算。用户验收应检查实际交付、测试和变更范围，而非成员完成状态或质量approved。简单单文件任务、无法固定宿主版本或无人承担最终验收时，原生单Agent更可能合适。

从Q03的限制可推导一个未验证方向：让handoff携带可读取产物位置、内容摘要和独立验证记录，并为最终评审提供受限只读验证能力，可能减少“自报完成通过文本评审”的空隙。该改变增加评审调用、权限及无效读取成本，必须与当前无工具评审在同预算任务比较；观察隐藏缺陷检出、错误放行、人工复核时间和总调用成本。若只增加Token、没有减少错误放行或返工，停止该方向。当前插件已有的持久定义、消息认领和计量覆盖仍值得借鉴，未来验证能力不计入现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/application/execution-service.ts:1152-1171](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/application/execution-service.ts#L1152-L1171)

新假设来自只读handoff、无工具评审边界。

<details>
<summary>查看原文（20行）</summary>

```text
        prompt: [{ type: 'text', text: [
          'Review contract: return only a bounded verdict. Do not repair, call tools, dispatch teams, or create subagents.',
          `Quality criteria:\n${squad.qualityGate?.criteria?.trim() || 'Correct, complete, internally consistent, and supported by the reported deliverables.'}`,
          `Bounded handoffs:\n${boundedHandoffChain(memberResults, 32_000)}`,
          'Return approved=true only if no repair is required. Feedback must be concrete and bounded. Do not do the repair, call tools, dispatch teams, or create subagents.',
          `Original goal (bounded head/tail excerpt):\n${this.boundedExcerpt(sharedTask, 24_000)}`,
        ].join('\n\n') }],
        agentOptions: {
          provider: reviewer.record.provider,
          agentTeamGuiChild: true,
          model: reviewer.record.model,
          maxTokens: reviewer.record.maxTokens ?? 2_048,
        },
        outputSchema: {
          type: 'object', additionalProperties: false,
          properties: { approved: { type: 'boolean' }, feedback: { type: 'string' } },
          required: ['approved', 'feedback'],
        },
        toolFilter: { allow: [] as string[] },
        maxDepth: 1,
```

</details>

**依据 2 · 源码核查**：[src/tools/run-history.ts:30-67](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/src/tools/run-history.ts#L30-L67)

同预算比较需保留计量覆盖。

<details>
<summary>查看原文（38行）</summary>

```text
export function runMeteringCoverage(run: SquadRunRecord): 'full' | 'partial' | 'none' {
  const expected: Array<AgentTokenUsage | undefined> = []
  const plannerAttempted = run.phase === 'planning'
    || run.liveUsage?.planner !== undefined
    || (run.plan !== undefined && run.plan.planner !== 'lead-continuation' && (run.plan.planner !== 'deterministic-fallback'
      || run.plan.plannerProvider !== undefined || run.plan.plannerModel !== undefined))
  if (plannerAttempted) expected.push(run.plan?.usage ?? run.liveUsage?.planner)
  for (const member of run.members) {
    if (member.recovery?.attempted) expected.push(member.recovery.usage)
    if (member.attemptUsage !== undefined && member.attemptUsage.length > 0) {
      for (const attempt of member.attemptUsage) expected.push(attempt.usage)
    } else if (member.usageSamples !== undefined) {
      for (let index = 0; index < member.usageSamples.metered; index += 1) expected.push(member.usage)
      for (let index = member.usageSamples.metered; index < member.usageSamples.total; index += 1) expected.push(undefined)
    } else if (member.attempts > 0 || member.startedAt !== undefined || member.status === 'running') {
      // Old rows have only an aggregate. A retry-once row cannot prove that
      // every attempt was metered, so never call attempts>1 fully covered.
      expected.push(member.usage)
      if (member.attempts > 1) expected.push(undefined)
    }
  }
  for (const round of run.quality?.rounds ?? []) {
    expected.push(round.reviewer.usage)
    if (round.repair !== undefined) expected.push(round.repair.usage)
  }
  if (run.qualityProgress?.state === 'reviewing'
    && (run.quality?.rounds.length ?? 0) < run.qualityProgress.round) {
    expected.push(run.liveUsage?.review)
  }
  if (run.qualityProgress?.state === 'repairing') {
    const round = run.quality?.rounds.find(item => item.round === run.qualityProgress!.round)
    if (round?.repair === undefined) expected.push(run.liveUsage?.repair)
  }
  if (expected.length === 0) return run.usage.providerReported ? 'full' : 'none'
  const metered = expected.filter(sample => sample?.providerReported === true).length
  if (metered === expected.length) return 'full'
  if (metered > 0 || run.usage.providerReported) return 'partial'
  return 'none'
```

</details>

**依据 3 · 作者声明**：[README.md:97-109](https://github.com/toolclub/dsh-agent-team-gui/blob/9e952e0681d528975444568b70f3c554ac2984be/README.md#L97-L109)

作者scratch项目与检查交付的试用路径。

<details>
<summary>查看原文（13行）</summary>

```text
Use the included [full-stack delivery recipe](examples/full-stack-delivery.recipe.json), with a
planner, implementation engineer, and reviewer. You can bind all three to the same working model
for the first run; multiple providers are optional.

1. Download the recipe JSON. Open **Settings → Teams → Recipes & data** and choose **Choose recipe file**.
2. Map the placeholder routes to your configured provider/model routes, review the preview, and choose
   **Create a copy → Import reviewed recipe**. In **Member library**, confirm each member's exact model and tool access.
3. For this first walkthrough, set **Team usage → Host dispatches first**, **Dispatch policy → Run assigned work**, and member selection to
   **All members**, then save. The supplied recipe otherwise uses Smart/adaptive selection.
4. Select an empty scratch project, choose the imported team beside the composer, select **Select team for this conversation**, and send the
   [ready-to-copy task](docs/first-team.md#try-a-small-development-task): build and test a small to-do list.
5. Open **Team runs** to inspect the plan, outputs, review, and actual Token coverage. Check the delivered
   files and test results before treating the task as complete.
```

</details>

#### 缺口

- 产物验证评审未实现或对照验证，真实需求频率未知。
  **影响**：不能声称新方向改善质量或当前多Agent有收益。
  **进一步探讨**：先收集重复开发任务，再比较当前评审和受限验证评审的真实错误及返工。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
