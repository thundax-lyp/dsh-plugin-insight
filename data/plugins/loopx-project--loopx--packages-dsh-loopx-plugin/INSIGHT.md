# LoopX for DSH

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[e1c42d1](https://github.com/loopx-project/loopx/tree/e1c42d1605669e6c03004585b070c70b5cb6a57e/packages/dsh-loopx-plugin)

<!-- BEGIN META -->
[![GitHub ★ 6,421](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C421&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/loopx-project/loopx)
<!-- END META -->

> **实现功能**：在DSH接入LoopX技能、同会话续轮Driver和GoalBar，展示权威目标状态并控制后续推进。

> **核心亮点**：相对手工搬运heartbeat，增量是把LoopX权威准入与DSH活会话关联，而不再维护第二份Goal/Todo状态。绑定与quota回执核对比简单定时“继续”更能收窄误续轮范围。GoalBar的状态显示和Start/Pause减少界面切换，但安装不等于激活、模型任务质量仍非Driver保证。 依据[Q03](#research-q03)。

> **风险与缺陷**：关键质疑是暂停和自动准入是否被用户误读成停止当前工作。README明确Pause只撤销未来queued/scheduled续轮，不中断已claimed/running turn；不能拿GoalBar暂停按钮当紧急撤销。跨CLI权威读取、队列提交和模型执行并非单个事务，代码的会话fence和typed回执能减少错绑，却不能单独证明业务动作exactly-once。 依据[Q04](#research-q04)。

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

> **用途**：面向已用LoopX管理长期目标、希望在DSH同一会话持续推进任务的用户。原办法是在终端手工读取quota和heartbeat再把任务贴回对话；合格结果应是唯一目标/Agent绑定、被允许的下一轮和可核对任务产物。此项只研究packages/dsh-loopx-plugin桥接，不把整仓LoopX所有能力归于插件。

相对手工搬运heartbeat，增量是把LoopX权威准入与DSH活会话关联，而不再维护第二份Goal/Todo状态。绑定与quota回执核对比简单定时“继续”更能收窄误续轮范围。GoalBar的状态显示和Start/Pause减少界面切换，但安装不等于激活、模型任务质量仍非Driver保证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 初始化 | 准备CLI与技能 | 首次加载会安装/升级 |
| 同会话Driver | 接回权威下一步 | 需typed激活和唯一绑定 |
| GoalBar | 展示目标与未来暂停 | Pause不终止当前轮 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| LoopX CLI>=1.2.4 | 必需 | 权威状态与heartbeat | 旧显式BIN拒绝 |
| Python3.11+/pip | 首次安装必需 | 私有runtime | 初始化失败用repair |
| 同一DSH home/profile | 必需 | 绑定和技能一致 | 换home导致不同状态 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 在独立工作区加载并核对初始化 | 确认CLI和技能 |
| 2 | 显式调用loopx并读唯一绑定 | 歧义不续轮 |
| 3 | 检查每轮产物与quota | Pause后仍核对当前轮 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI与依赖下载资源未知 | Node/Python/profile核对 | 启动可能自动安装 |
| 持续使用 | 模型调用与状态读取 | 产物验收 | 无同任务省时数据 |
| 失败恢复 | 已运行轮次不可退款 | 核对原绑定、quota和文件 | Pause不撤销当前执行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 准入 | 精确会话和typed回执 | 业务动作exactly-once |
| 交互 | 同会话续轮和GoalBar | 任务成功率提升 |

> **思考**：关键质疑是暂停和自动准入是否被用户误读成停止当前工作。README明确Pause只撤销未来queued/scheduled续轮，不中断已claimed/running turn；不能拿GoalBar暂停按钮当紧急撤销。跨CLI权威读取、队列提交和模型执行并非单个事务，代码的会话fence和typed回执能减少错绑，却不能单独证明业务动作exactly-once。 依据[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手工搬运heartbeat，增量是把LoopX权威准入与DSH活会话关联，而不再维护第二份Goal/Todo状态。绑定与quota回执核对比简单定时“继续”更能收窄误续轮范围。GoalBar的状态显示和Start/Pause减少界面切换，但安装不等于激活、模型任务质量仍非Driver保证。 依据[Q03](#research-q03)。

相对手工搬运heartbeat，增量是把LoopX权威准入与DSH活会话关联，而不再维护第二份Goal/Todo状态。绑定与quota回执核对比简单定时“继续”更能收窄误续轮范围。GoalBar的状态显示和Start/Pause减少界面切换，但安装不等于激活、模型任务质量仍非Driver保证。 依据[Q03](#research-q03)。

可借鉴的是不镜像业务权威、exact-session对象绑定、每阶段typed回执校验和副作用前复查ready。移植需要LoopX协议、SDK事件和bootstrap就绪边界一起适配。native-operation是显式额外传输而非默认注册，README说明默认不公开LoopX模型工具，不能把源码中可选接口算默认可用能力。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键质疑是暂停和自动准入是否被用户误读成停止当前工作。README明确Pause只撤销未来queued/scheduled续轮，不中断已claimed/running turn；不能拿GoalBar暂停按钮当紧急撤销。跨CLI权威读取、队列提交和模型执行并非单个事务，代码的会话fence和typed回执能减少错绑，却不能单独证明业务动作exactly-once。 依据[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议已使用LoopX的DSH开发者在可回滚工作区试用一个短目标，先核对唯一绑定、quota与回执，再允许续轮。相比手工终端粘贴，它把权威下一步接回同会话，仍不承担业务产物验收。绑定歧义、回执不匹配或暂停后误以为当前轮已停止时，应暂停未来推进并手工核对运行轮次与产物，退回CLI管理目标。 依据[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的机制判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-loopx-plugin/README.md、packages/dsh-loopx-plugin/src/driver.ts、packages/dsh-loopx-plugin/src/index.ts 及固定范围 inventory；组件：packages/dsh-loopx-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定版本的作者说明、注册入口和下列实际源码；未执行目标代码、安装或真实宿主验收。
- 下一步：- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

**分析版本**

- **仓库**：[loopx-project/loopx](https://github.com/loopx-project/loopx)
- **版本号**：0.1.1-beta.6（[固定提交 e1c42d1](https://github.com/loopx-project/loopx/tree/e1c42d1605669e6c03004585b070c70b5cb6a57e)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是给GoalBar同时显示“当前轮仍运行”和“未来续轮已暂停”的两种收据，能降低暂停含义误判。以相同长任务分别在queued、claimed、running时暂停，比较显示与实际续轮、重复动作和用户理解；若界面仍把未结束工作呈现为已停止，或只能靠重复点按钮确认，不应扩大自动推进。 依据[Q08](#research-q08)。

- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 22 | 7651 | 6973 | 172 | — |
| .md | source | 2 | 784 | — | — | 6076 |
| .mjs | source | 11 | 2799 | 2610 | 74 | — |
| .tsx | source | 2 | 184 | 160 | 9 | — |
| .ts | test | 13 | 6890 | 6390 | 25 | — |
| .tsx | test | 1 | 1078 | 1005 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 114](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=114&color=737b86&logo=github)](https://github.com/loopx-project/loopx/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 155](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=155&color=737b86&logo=github)](https://github.com/loopx-project/loopx/issues?q=is%3Aissue+created%3A2026-09-26T09%3A39%3A20.318Z..2026-10-26T09%3A39%3A20.318Z) [![近30天关闭 107](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=107&color=737b86&logo=github)](https://github.com/loopx-project/loopx/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A39%3A20.318Z..2026-10-26T09%3A39%3A20.318Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：面向已用LoopX管理长期目标、希望在DSH同一会话持续推进任务的用户，采用价值是否由固定机制与边界支持？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么场景需要它，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向已用LoopX管理长期目标、希望在DSH同一会话持续推进任务的用户。原办法是在终端手工读取quota和heartbeat再把任务贴回对话；合格结果应是唯一目标/Agent绑定、被允许的下一轮和可核对任务产物。此项只研究packages/dsh-loopx-plugin桥接，不把整仓LoopX所有能力归于插件。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-loopx-plugin/README.md:10-34](https://github.com/loopx-project/loopx/blob/e1c42d1605669e6c03004585b070c70b5cb6a57e/packages/dsh-loopx-plugin/README.md#L10-L34)

作者说明Driver与唯一权威。

<details>
<summary>查看原文（25行）</summary>

```text
- a passive same-session Driver becomes eligible only after the exact current
  Session successfully invokes the exact `loopx` skill. It then asks LoopX
  whether another turn may run and queues the authoritative heartbeat task
  into that live DSH Agent.
- the package-root Host registers GoalBar at the authenticated
  `/api/loopx.goalbar` route required by DSH 0.1.5. Its web Client adds a compact
  GoalBar between DSH's native GoalBar and Queue dock rows, visible only for one
  exact live `(goalId, loopxAgentId)` binding.

Installing the plugin and starting DSH load and prepare these capabilities;
neither creates a binding nor activates the Driver. The GoalBar
does one bounded read when a browser row mounts, then watches exact-Session
`step/end` and `turn/end` boundaries. It rereads LoopX only when the opaque
revision of the authoritative binding or active Goal state changes; a watch
lease also detects changes written outside that Session. DSH Agent-status
events update an existing row without a LoopX business read. Until one exact
Session contains valid typed `loopx` invocation evidence, its Driver makes no
LoopX CLI, binding, quota, or heartbeat call, creates no timer, and queues no
followup.

The package does not expose LoopX model tools, a binding sidecar, or its own
Goal/Todo state. Models use the installed LoopX skills and call the LoopX CLI
directly. LoopX remains the only authority for Goal, Agent, Todo, quota,
activation, and durable thread-binding data. The GoalBar protocol and its
deferred atomicity limit are specified in the versioned
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、处理链及状态如何实现？

**研究主题**：功能与机制

#### 完整回答

包分init、Driver与GoalBar三个Loader行。Host依赖agents、connection和loopxBootstrap；Driver从精确Session的typed技能调用折叠激活状态，未激活不启动业务轮询。buildPlan先resolveBinding，校验goal/agent，再读取quota并核对turnInstanceId，最后获取同一绑定heartbeat；多次ensureReady检查防止会话已替换，确认后才followup权威任务。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:905-978](https://github.com/loopx-project/loopx/blob/e1c42d1605669e6c03004585b070c70b5cb6a57e/packages/dsh-loopx-plugin/src/driver.ts#L905-L978)

真实绑定、quota、heartbeat与ready复查。

<details>
<summary>查看原文（74行）</summary>

```text
    }
  }

  private async buildPlan(
    state: DriverState,
    signal: AbortSignal,
  ): Promise<EvaluationPlan> {
    const session = state.agent.session
    this.ensureReady(state, signal, session)
    const command = await this.loopXCommand(signal)
    this.ensureReady(state, signal, session)
    const bindingPayload = await this.resolveBinding(command, state.agent, signal)
    this.ensureReady(state, signal, session)
    if (bindingPayload.ok !== true) {
      throw new LoopXCliError(
        'typed_failure',
        'LoopX binding authority rejected automatic continuation',
        false,
      )
    }
    const binding = exactBinding(bindingPayload, String(state.agent.id))
    if (binding === undefined) {
      return { kind: 'wait', schedulerToken: '', unchangedPolls: 0 }
    }

    const turnInstanceId = this.makeTurnInstanceId()
    const quota = await this.readQuota(command, state.agent, binding, turnInstanceId, signal)
    this.ensureReady(state, signal, session)
    if (quota.ok !== true) {
      throw new LoopXCliError(
        'typed_failure',
        'LoopX quota authority rejected automatic continuation',
        false,
      )
    }
    if (!exactQuotaContext(quota, binding)
      || (quota.should_run === true && !exactQuotaReceipt(quota, turnInstanceId))) {
      throw new LoopXCliError(
        'invalid_schema',
        'LoopX quota response did not match the bound Goal and Agent',
        false,
      )
    }
    if (quota.should_run !== true) {
      return schedulerWait(quota, state.schedulerToken, state.unchangedPolls)
    }
    const heartbeat = await this.readHeartbeat(
      command,
      state.agent,
      binding,
      turnInstanceId,
      signal,
    )
    this.ensureReady(state, signal, session)
    if (heartbeat.ok !== true) {
      throw new LoopXCliError(
        'typed_failure',
        'LoopX heartbeat authority rejected automatic continuation',
        false,
      )
    }
    const taskBody = exactHeartbeat(heartbeat, binding, turnInstanceId)
    if (taskBody === undefined) {
      throw new LoopXCliError(
        'invalid_schema',
        'LoopX heartbeat response did not match the bound Goal and Agent',
        false,
      )
    }
    return {
      kind: 'queue',
      ...binding,
      session,
      turnInstanceId,
```

</details>

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:875-895](https://github.com/loopx-project/loopx/blob/e1c42d1605669e6c03004585b070c70b5cb6a57e/packages/dsh-loopx-plugin/src/driver.ts#L875-L895)

确认后建立reservation并followup。

<details>
<summary>查看原文（21行）</summary>

```text
    if (!this.ready(state) || state.agent.session !== plan.session) return true
    const message = automaticMessage(plan)
    const reservation: Reservation = {
      messageId: message.id,
      content: message.content,
      source: message.source,
      session: plan.session,
      goalId: plan.goalId,
      agentId: plan.agentId,
      turnInstanceId: plan.turnInstanceId,
      phase: 'queued',
      preserveAcrossPause: false,
    }
    state.reservation = reservation
    try {
      state.agent.followup(message)
    } catch (error: unknown) {
      this.retireReservation(state)
      this.warn(`dsh-loopx-driver: could not queue same-session work: ${renderThrown(error)}`)
    }
    return true
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对简单替代的实质增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对手工搬运heartbeat，增量是把LoopX权威准入与DSH活会话关联，而不再维护第二份Goal/Todo状态。绑定与quota回执核对比简单定时“继续”更能收窄误续轮范围。GoalBar的状态显示和Start/Pause减少界面切换，但安装不等于激活、模型任务质量仍非Driver保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/index.ts:10-27](https://github.com/loopx-project/loopx/blob/e1c42d1605669e6c03004585b070c70b5cb6a57e/packages/dsh-loopx-plugin/src/index.ts#L10-L27)

Host仅注册GoalBar，不创建第二Driver。

<details>
<summary>查看原文（18行）</summary>

```text
export const name = 'dsh-loopx-plugin'
export const inject = ['agents', 'connection', 'loopxBootstrap']

/** Package-root Host plugin: one GoalBar service, never a second Driver. */
export function apply(ctx: Context): void {
  ctx.effect(() => {
    const service = createGoalBarService({
      getAgent: sessionId => ctx.agents.get(sessionId as Agent['id']),
      coordinator: goalBarCoordinator,
      resolveCommand: signal => resolvePluginLoopXCommand({ signal }),
      warn: message => { ctx.logger.warn(message) },
    })
    const disposeRpc = registerGoalBarConnectionTransport(ctx.connection, service)
    return async () => {
      await service.dispose()
      await disposeRpc()
    }
  }, 'dsh-loopx GoalBar Host service')
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么限制最可能使贡献不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键质疑是暂停和自动准入是否被用户误读成停止当前工作。README明确Pause只撤销未来queued/scheduled续轮，不中断已claimed/running turn；不能拿GoalBar暂停按钮当紧急撤销。跨CLI权威读取、队列提交和模型执行并非单个事务，代码的会话fence和typed回执能减少错绑，却不能单独证明业务动作exactly-once。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-loopx-plugin/README.md:115-122](https://github.com/loopx-project/loopx/blob/e1c42d1605669e6c03004585b070c70b5cb6a57e/packages/dsh-loopx-plugin/README.md#L115-L122)

Start激活与Pause不停止当前轮。

````text
```

`status=bound` with one exact pair admits the row; missing or ambiguous results
fail closed and render nothing. `Start` resumes a stopped Goal and asks the
Driver to evaluate only when that exact live Session already contains typed
`loopx` skill activation evidence. It never activates an inactive Session.
`Pause` stops the Goal and retires only future queued/scheduled continuation;
it does not abort a claimed or running turn.
````

#### 缺口

- 跨权威读取、队列与模型执行的原子性边界未做中断实测。
  **影响**：不支持业务动作exactly-once保证。
  **进一步探讨**：在queued/claimed/running边界中断，核对重复动作和收据。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续与恢复依赖哪些条件？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要匹配DSH发行版、稳定Node、pnpm及Python3.11+/pip，首次加载可能自动在私有runtime安装或升级LoopX CLI并安装技能。自定义LOOPX_BIN过旧时由所有者升级，不可静默覆盖。DSH_HOME与DSH_AGENTS_HOME需同安装/启动链一致，否则会看见不同profile或技能。恢复时先读原绑定和当前quota，不能盲目反复启动新目标。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-loopx-plugin/README.md:38-64](https://github.com/loopx-project/loopx/blob/e1c42d1605669e6c03004585b070c70b5cb6a57e/packages/dsh-loopx-plugin/README.md#L38-L64)

Node/Python、私有runtime与版本条件。

<details>
<summary>查看原文（27行）</summary>

```text

Requirements are stable Node.js 22.22.3+ (excluding Node.js 23), `pnpm`,
Python 3.11+ with `pip`, and network access for the first DSH start when no
compatible LoopX CLI is already installed. LoopX itself is deliberately not a
prerequisite. The initializer
honors an explicit `PYTHON_BIN`; otherwise it tries `python3`, then discovers
`python3.<minor>` executables on the supplied `PATH` in descending numeric
order, then tries the bare name `python`. The last name is what a python.org
Windows install registers, so it keeps that host reachable when `python3` is
absent or is the `WindowsApps` App Execution Alias that never starts Python.
Unlike the versioned names it is not a `PATH` scan result; it is resolved when
the candidate runs. Installation still checks the Python version and pip;
reopening the managed runtime uses the same discovery and validates the LoopX
CLI. No hard-coded minor-version list is maintained. When selecting Python for
installation, an invalid explicit interpreter fails instead of falling back.
Managed-runtime readback keeps the existing CLI fallback behavior. If the
plugin must install or upgrade LoopX, it writes an isolated
copy under `$DSH_AGENTS_HOME/runtime/dsh-loopx-plugin` (default
`~/.agents/runtime/dsh-loopx-plugin`) and never mutates the system Python
environment. This works with externally managed Python distributions that
enforce PEP 668; the plugin does not use `--break-system-packages`.
This version requires LoopX 1.2.4 or newer, the published release that
includes the Windows peer-file fix. Bootstrap, Driver and GoalBar use the same
version floor; an older global or managed CLI is upgraded or rejected before
business commands run. An explicit outdated `LOOPX_BIN` must be upgraded by its
owner. Older plugin releases retain their original CLI requirements.
Install the prebuilt release into the web profile:
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 全周期成本和实际效果支持到哪里？

**研究主题**：效果与总成本

#### 完整回答

首次可能下载Python环境依赖和CLI并写技能，持续有权威状态读取、heartbeat及后续模型调用，失败时要核对是否已运行的turn和产物。金额与人工时间未测；GoalBar减少终端切换属于机制推断，不是省钱结果。可暂停未来轮次，但已经发生调用、文件修改和当前轮次成本不能撤销。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-loopx-plugin/README.md:115-122](https://github.com/loopx-project/loopx/blob/e1c42d1605669e6c03004585b070c70b5cb6a57e/packages/dsh-loopx-plugin/README.md#L115-L122)

未来暂停与已运行成本边界。

````text
```

`status=bound` with one exact pair admits the row; missing or ambiguous results
fail closed and render nothing. `Start` resumes a stopped Goal and asks the
Driver to evaluate only when that exact live Session already contains typed
`loopx` skill activation evidence. It never activates an inactive Session.
`Pause` stops the Goal and retires only future queued/scheduled continuation;
it does not abort a claimed or running turn.
````

#### 缺口

- 同任务的状态读取、续轮费用与人工验收成本未知。
  **影响**：不能声称持续推进更经济。
  **进一步探讨**：记录短目标全部轮次及原CLI流程对照。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可借鉴处和维护边界？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴的是不镜像业务权威、exact-session对象绑定、每阶段typed回执校验和副作用前复查ready。移植需要LoopX协议、SDK事件和bootstrap就绪边界一起适配。native-operation是显式额外传输而非默认注册，README说明默认不公开LoopX模型工具，不能把源码中可选接口算默认可用能力。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:899-936](https://github.com/loopx-project/loopx/blob/e1c42d1605669e6c03004585b070c70b5cb6a57e/packages/dsh-loopx-plugin/src/driver.ts#L899-L936)

多次fence与精确绑定。

<details>
<summary>查看原文（38行）</summary>

```text
    state: DriverState,
    signal: AbortSignal,
    session: Agent['session'],
  ): void {
    if (signal.aborted || !this.ready(state) || state.agent.session !== session) {
      throw new LoopXCliError('aborted', 'automatic admission was fenced', false)
    }
  }

  private async buildPlan(
    state: DriverState,
    signal: AbortSignal,
  ): Promise<EvaluationPlan> {
    const session = state.agent.session
    this.ensureReady(state, signal, session)
    const command = await this.loopXCommand(signal)
    this.ensureReady(state, signal, session)
    const bindingPayload = await this.resolveBinding(command, state.agent, signal)
    this.ensureReady(state, signal, session)
    if (bindingPayload.ok !== true) {
      throw new LoopXCliError(
        'typed_failure',
        'LoopX binding authority rejected automatic continuation',
        false,
      )
    }
    const binding = exactBinding(bindingPayload, String(state.agent.id))
    if (binding === undefined) {
      return { kind: 'wait', schedulerToken: '', unchangedPolls: 0 }
    }

    const turnInstanceId = this.makeTurnInstanceId()
    const quota = await this.readQuota(command, state.agent, binding, turnInstanceId, signal)
    this.ensureReady(state, signal, session)
    if (quota.ok !== true) {
      throw new LoopXCliError(
        'typed_failure',
        'LoopX quota authority rejected automatic continuation',
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 什么新假设值得验证，怎样推翻它？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是给GoalBar同时显示“当前轮仍运行”和“未来续轮已暂停”的两种收据，能降低暂停含义误判。以相同长任务分别在queued、claimed、running时暂停，比较显示与实际续轮、重复动作和用户理解；若界面仍把未结束工作呈现为已停止，或只能靠重复点按钮确认，不应扩大自动推进。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:65-67](https://github.com/loopx-project/loopx/blob/e1c42d1605669e6c03004585b070c70b5cb6a57e/packages/dsh-loopx-plugin/src/driver.ts#L65-L67)

已claimed/admitted保留跨Pause状态。

```text
  phase: ReservationPhase
  /** Exact reservation already claimed/admitted when GoalBar Pause retired future work. */
  preserveAcrossPause: boolean
```

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得采用，何时停止？

**研究主题**：采用判断

#### 完整回答

建议已使用LoopX的DSH开发者在可回滚工作区试用一个短目标，先核对唯一绑定、quota与回执，再允许续轮。相比手工终端粘贴，它把权威下一步接回同会话，仍不承担业务产物验收。绑定歧义、回执不匹配或暂停后误以为当前轮已停止时，应暂停未来推进并手工核对运行轮次与产物，退回CLI管理目标。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:930-974](https://github.com/loopx-project/loopx/blob/e1c42d1605669e6c03004585b070c70b5cb6a57e/packages/dsh-loopx-plugin/src/driver.ts#L930-L974)

拒绝不匹配权威回执。

<details>
<summary>查看原文（45行）</summary>

```text
    const turnInstanceId = this.makeTurnInstanceId()
    const quota = await this.readQuota(command, state.agent, binding, turnInstanceId, signal)
    this.ensureReady(state, signal, session)
    if (quota.ok !== true) {
      throw new LoopXCliError(
        'typed_failure',
        'LoopX quota authority rejected automatic continuation',
        false,
      )
    }
    if (!exactQuotaContext(quota, binding)
      || (quota.should_run === true && !exactQuotaReceipt(quota, turnInstanceId))) {
      throw new LoopXCliError(
        'invalid_schema',
        'LoopX quota response did not match the bound Goal and Agent',
        false,
      )
    }
    if (quota.should_run !== true) {
      return schedulerWait(quota, state.schedulerToken, state.unchangedPolls)
    }
    const heartbeat = await this.readHeartbeat(
      command,
      state.agent,
      binding,
      turnInstanceId,
      signal,
    )
    this.ensureReady(state, signal, session)
    if (heartbeat.ok !== true) {
      throw new LoopXCliError(
        'typed_failure',
        'LoopX heartbeat authority rejected automatic continuation',
        false,
      )
    }
    const taskBody = exactHeartbeat(heartbeat, binding, turnInstanceId)
    if (taskBody === undefined) {
      throw new LoopXCliError(
        'invalid_schema',
        'LoopX heartbeat response did not match the bound Goal and Agent',
        false,
      )
    }
    return {
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
