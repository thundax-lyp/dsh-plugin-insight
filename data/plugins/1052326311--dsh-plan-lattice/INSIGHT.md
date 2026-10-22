# Plan Lattice

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[ea4d4f7](https://github.com/1052326311/dsh-plan-lattice/tree/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice)
<!-- END META -->

> **实现功能**：在 DSH 历史替换后恢复原生任务依据，并可显式启用完整执行门禁。

> **核心亮点**：把 DSH 自有 Session/plan/委派事实在真实 surface 替换后有界回填，避免创建第二个自动计划器；显式模式把契约、目标事实与受保护变更绑定，详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：默认 auto 不装写入门禁，显式模式也仅守护列名工具且外部副作用依赖 adapter；12/12 是手工设计机制样本，V17/V18/V20 不支持通用提升，详见[Q02](#research-q02)、[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 默认 auto 究竟何时恢复哪些原生事实？](#detail-section-11)
  - [Q02 · 显式 full Lattice 对受保护变更如何授权，边界在哪里？](#detail-section-12)
  - [Q03 · 作者实验能证明什么，当前采用和创新假设如何检验？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长任务经上下文替换后仍需沿用已批准计划、人类要求和已返回委派结果；高风险写入可显式启用完整控制。

只依赖 DSH 原生 plan/Todo/Session 历史与人工在压缩后复述任务；高风险写入靠代理自觉复读和外部审查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| auto 原生连续性投影 | 替换后回填隐藏人类消息、已批准计划与前台委派结果 | 必须是真实 surface 替换；不新增模型工具或全图门禁 |
| 显式模型工具 16 项 | intake、reframe、refresh、图节点/租约/checkpoint 等 | 仅 full Lattice；不把 auto 视为自动调用 |
| 受保护工具 guard | 核文件目标、契约/图/租约及外部前提 | 只覆盖 guardedTools；外部副作用需 adapter |
| 事件/恢复收据 | 记录执行身份和不确定副作用 | 收据为机械证据，不等同语义完成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主及匹配版本 | 必需 | Session、surface、工具与 agent 事件钩子 | 插件可能无法加载或失去恢复边界 |
| Node >=22.19、发行包/profile | 必需 | 运行社区插件 | 安装兼容性需按实际包核验 |
| Session 追加日志和可见替换事件 | auto 必需 | 锚定并恢复隐藏原生事实 | 不推断缺失要求，无法保证恢复 |
| guardedTools 与外部 preconditionAdapters | 显式 full 模式按副作用配置 | 绑定写入/外部动作 | 未列工具不守护；列出而无适配器的外部动作拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选版本 | 管理员核 DSH/profile 与公开包 | 固定包 SHA 和宿主版本 |
| auto 试点 | 在隔离长任务中观察真实 surface replace | 隐藏权威/计划/前台结果精确恢复；不新增 lattice_* |
| full 门禁 | 需要时明确启用，列出写入/外部工具并配置 adapter | 合法变更通过、过期依据与未映射副作用拦截 |
| 验收/回退 | 比对 Session 原文、工具收据、任务结果 | 异常时停用/改配置并复核已发生副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH 宿主、Node >=22.19 与安装包；下载/运行费用未知 | 管理员选稳定 v0.3 或公开 rc.6、核 profile/宿主兼容；显式模式还需列受保护工具与 adapter，工时未知 | 本检出 rc.8 未发布，不能直接按此源码认定线上版本 |
| 持续使用 | auto 恢复文本占上下文 token，完整模式有状态/快照/外部核验 IO；金额与频次未知 | 审查恢复事件、契约变更、受保护工具清单及验收证据，工时未知 | 自动模式通常不新增工具/控制调用；真实开销未独立测量 |
| 失败恢复 | 若错误恢复、误拦或漏守导致重试/回滚，可增加模型和工程资源；数值未知 | 核 Session 原文、目标状态/副作用收据、重新授权或停用，耗时未知 | 未证生产误报率、事故率或 ROI |

#### 效果

| 目标 | 现有证据 | 不可外推处 |
| --- | --- | --- |
| 原生权威恢复 | Q01 固定源码显示按真实 surface 替换、有界回填 | 模型是否据此完成任务未验证 |
| 显式受保护变更 | Q02 源码有 guard/前置条件核对；作者报告手工压力测试 | 非列名工具与外部部署不在门禁范围 |
| 一般编码收益 | 无有效同条件、完成预算的外部对照 | V17/V18/V20 均不能支持提升，Q03 |

> **思考**：默认 auto 不装写入门禁，显式模式也仅守护列名工具且外部副作用依赖 adapter；12/12 是手工设计机制样本，V17/V18/V20 不支持通用提升，详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把 DSH 自有 Session/plan/委派事实在真实 surface 替换后有界回填，避免创建第二个自动计划器；显式模式把契约、目标事实与受保护变更绑定，详见[Q01](#research-q01)、[Q02](#research-q02)。

把 DSH 自有 Session/plan/委派事实在真实 surface 替换后有界回填，避免创建第二个自动计划器；显式模式把契约、目标事实与受保护变更绑定，详见[Q01](#research-q01)、[Q02](#research-q02)。

Session 事件锚定与投影模块隔离；完整模式用可观察前置条件、工具定义身份和二次执行校验收窄 TOCTOU。复杂度高，依赖 DSH 具体内部契约、可用 Hook 和适配器完整性；作者大量协议/负结果说明机制成熟度不能由单个绿色徽章推断。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认 auto 不装写入门禁，显式模式也仅守护列名工具且外部副作用依赖 adapter；12/12 是手工设计机制样本，V17/V18/V20 不支持通用提升，详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用作者公开稳定包/候选在相同 DSH 版本隔离试点，重点比较替换后权威保真和门禁对合法写入的影响；无需把 rc.8 或机制比例当生产收益，详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

auto 源码层被动恢复明确；完整门禁覆盖配置的受保护工具。作者机制实验有限，通用软件质量和当前 rc.8 生产效果未证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、BENCHMARK.md、demo/results/crash-continuity-benchmark.md、src/index.ts、src/native-continuity.ts、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 ea4d4f7 源码、包描述、README 和作者实验结果静态审阅；未执行目标插件/测试/宿主或付费矩阵，不把作者数据当独立复现。
- 下一步：以固定包/宿主重跑机制用例并复核环境；对自动恢复做压缩/冷启动/委派 wire 审查，再以预注册盲任务评价质量和成本。

**分析版本**

- **仓库**：[1052326311/dsh-plan-lattice](https://github.com/1052326311/dsh-plan-lattice)
- **版本号**：0.4.0-rc.8（[固定提交 ea4d4f7](https://github.com/1052326311/dsh-plan-lattice/tree/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3)）
- **版本日期**：2026-08-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

已有实现已过滤隐藏来源、保成功计划/前台最近3项并按maxContextBytes降级；进一步可研究在合格候选内部按当前子任务需求提供来源引用/缺口、必要时回退原投影。若遗漏权威或增加错续写则反证。此方向尚未实现，详见[Q03](#research-q03)。

以固定包/宿主重跑机制用例并复核环境；对自动恢复做压缩/冷启动/委派 wire 审查，再以预注册盲任务评价质量和成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 72 | 8122 | — | — | 62377 |
| .mjs | source | 285 | 65400 | 61299 | 240 | — |
| .ts | example | 1 | 130 | 121 | 0 | — |
| .js | example | 5 | 42 | 35 | 0 | — |
| .md | example | 17 | 90 | — | — | 584 |
| .mjs | example | 64 | 3814 | 3179 | 330 | — |
| .js | source | 98 | 6842 | 6273 | 0 | — |
| .mjs | test | 24 | 3271 | 3085 | 11 | — |
| .ts | source | 23 | 12113 | 11013 | 400 | — |
| .ts | test | 79 | 19850 | 18373 | 84 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice/issues?q=is%3Aissue+created%3A2026-09-22T08%3A59%3A39.048Z..2026-10-22T08%3A59%3A39.048Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T08%3A59%3A39.048Z..2026-10-22T08%3A59%3A39.048Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分 Plan Lattice 的被动原生恢复、显式事务门禁与作者实验边界，判断何时值得采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 默认 auto 究竟何时恢复哪些原生事实？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

配置未指定时 activationMode=auto。原生连续性只在 DSH Session 的模型可见 surface 真正 replace 后生效，compaction/summary 日志本身、普通用户消息或冷启动并非独立触发。它从追加式 Session 日志校验并按替换事件 seq 冻结权威人类消息、成功批准的 exit_plan_mode 计划、已通过前台 tool/result 返回的最近委派结果；仅在原事件已不在 surface 时呈给模型。Todo 在每个 turn/start 清空，既不成为跨轮权威，也不被当作长期任务图。新 child 原样接收 DSH 独立 prompt，待其自身 surface 替换才恢复锚定首条指令；冷恢复复用持久替换身份而不重复插消息。auto 不暴露 lattice_* 工具，不执行完整契约/图/写入门禁；因此它修复的是特定上下文丢失，不保证模型照办或阻止全部漂移。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-27](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/README.md#L14-L27)

作者说明 auto 为被动连续性层与完整控制区分。

<details>
<summary>查看原文（14行）</summary>

```text
restores exact authority already recorded by DSH only when a committed
`surfaceOp.replace` removed its source from the model-visible Session. A cold
resume reuses DSH's restored surface, and a fresh child receives only DSH's
native standalone prompt. Auto adds no Lattice tools, state, contract, graph,
or guard.
A recursive graph and one-use action bases remain available only as explicit
full-Lattice control.

![First-drift mechanism results](demo/results/first-drift-summary.svg)

**Hand-designed mechanism stress test using real Harness runtime services:**

- Unsafe stale-basis mutations: native `12/12`; Plan Lattice `0/12`.
- Matched legitimate controls: native `7/7`; Plan Lattice `7/7`.
```

</details>

**依据 2 · 源码核查**：[src/index.ts:713-761](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L713-L761)

默认 activationMode 与配置边界。

<details>
<summary>查看原文（49行）</summary>

```text
  const activationMode = config.intakeMode === undefined ? config.activationMode ?? 'auto' : 'always'
  const clarificationPolicy = config.intakeMode === undefined
    ? config.clarificationPolicy ?? 'critical'
    : config.intakeMode === 'guided' ? 'always' : config.intakeMode === 'adaptive' ? 'critical' : 'never'
  const controlCeiling = config.controlCeiling ?? 'lattice'
  if (activationMode !== 'off' && activationMode !== 'auto' && activationMode !== 'always') {
    throw new Error('activationMode must be off, auto, or always')
  }
  if (clarificationPolicy !== 'critical' && clarificationPolicy !== 'always' && clarificationPolicy !== 'never') {
    throw new Error('clarificationPolicy must be critical, always, or never')
  }
  if (controlCeiling !== 'contract' && controlCeiling !== 'lattice') {
    throw new Error('controlCeiling must be contract or lattice')
  }
  const guardedTools = new Set(config.guardedTools ?? ['write', 'edit', 'str_replace_editor'])
  const strictShell = config.strictBash ?? config.intakeMode === undefined
  if (strictShell) {
    guardedTools.add('bash')
    guardedTools.add('pwsh')
  }
  for (const tool of guardedTools) {
    if (tool.trim().length === 0) throw new Error('guardedTools must not contain an empty name')
  }
  const preconditionAdapters = new Map(Object.entries(config.preconditionAdapters ?? {}))
  for (const [toolName, adapter] of preconditionAdapters) {
    if (toolName.trim().length === 0) throw new Error('preconditionAdapters must not contain an empty tool name')
    if (typeof adapter.snapshot !== 'function' || typeof adapter.verify !== 'function') {
      throw new Error(`precondition adapter for ${JSON.stringify(toolName)} must provide snapshot and verify`)
    }
    if ((adapter.snapshotScope === undefined) !== (adapter.verifyScope === undefined)) {
      throw new Error(`precondition adapter for ${JSON.stringify(toolName)} must provide both snapshotScope and verifyScope`)
    }
  }
  return {
    ...(config.intakeMode === undefined ? {} : { legacyIntakeMode: config.intakeMode }),
    activationMode,
    clarificationPolicy,
    controlCeiling,
    longTaskThreshold: positiveInteger(config.longTaskThreshold, 8, 'longTaskThreshold'),
    // A legacy intake-only setup never scheduled work by itself. Preserve that
    // behavior unless the caller migrates to the v0.4 control configuration.
    maxTokenContinuations: nonNegativeInteger(config.maxTokenContinuations, 0, 'maxTokenContinuations'),
    guardedTools,
    maxContextBytes: positiveInteger(config.maxContextBytes, 256 * 1024, 'maxContextBytes'),
    topLevelLimit: positiveInteger(config.topLevelLimit, 2, 'topLevelLimit'),
    nestedLimit: positiveInteger(config.nestedLimit, 5, 'nestedLimit'),
    snapshotEvery: positiveInteger(config.snapshotEvery, 1024, 'snapshotEvery'),
    contractAnchorRoot: resolve(config.contractAnchorRoot ?? defaultContractAnchorRoot()),
    preconditionAdapters,
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2371-2471](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L2371-L2471)

按 replacement seq 对隐藏权威、计划与前台委派结果有界投影。

<details>
<summary>查看原文（101行）</summary>

```text
  function renderPassiveNativeContinuity(agent: Agent, control: AgentControl): string {
    const boundary = control.contextReplacement
    if (boundary === undefined) return ''
    const registry = ctx.get('agents')
    const root = registry?.get(control.rootSessionId as never)
    if (root === undefined) {
      return 'Plan Lattice native continuity projection:\n- The exact root Session is unavailable. Return the missing authority boundary through DSH native parent/result channels; do not invent it.'
    }
    const parentId = agent.session.header.parentSession
    const delegated = isDelegatedSession(agent)
    const rootProjection = delegated
      ? undefined
      : projectNativeContinuity(root.session.events, boundary.seq)
    const localProjection = projectNativeContinuity(agent.session.events, boundary.seq)
    // A child receives its exact authority through DSH's native first user
    // message. Repeating root authority in that fresh child changes its scope;
    // only a later child-surface replacement warrants recovery below.
    const authority = delegated ? '' : renderUncommittedHumanAuthority(agent, control, boundary.seq, true)
    let usedBytes = Buffer.byteLength(authority)
    const optional: string[] = []
    const appendBounded = (label: string, value: string): void => {
      const text = `## ${label}\n\n${value}`
      const bytes = Buffer.byteLength(text)
      if (usedBytes + bytes <= resolved.maxContextBytes) {
        optional.push(text)
        usedBytes += bytes
      } else {
        optional.push(`## ${label}\n\nExact native content omitted from this projection because the combined recovery context exceeds ${resolved.maxContextBytes} bytes. sha256:${createHash('sha256').update(value).digest('hex')}. Read the corresponding DSH Session event before relying on it.`)
      }
    }

    if (rootProjection?.approvedPlan !== undefined
      && (rootProjection.approvedPlan.messageSeq === undefined
        || !root.session.surface.nodes.includes(rootProjection.approvedPlan.messageSeq)
        || !root.session.surface.nodes.includes(rootProjection.approvedPlan.resultSeq))) {
      appendBounded(
        `DSH-approved plan (${rootProjection.approvedPlan.callId}, result event ${rootProjection.approvedPlan.resultSeq})`,
        rootProjection.approvedPlan.plan,
      )
    }
    for (const outcome of localProjection.delegatedOutcomes
      .filter(candidate => !agent.session.surface.nodes.includes(candidate.resultSeq))) {
      appendBounded(
        `Native subagent result (${outcome.description ?? outcome.callId})`,
        [
          `Call: ${outcome.callId}`,
          `Prompt sha256: ${outcome.promptDigest}`,
          `Result event: ${outcome.resultSeq}`,
          `Result sha256: ${outcome.resultDigest}`,
          '',
          outcome.result,
        ].join('\n'),
      )
    }

    const proof = delegatedInitialInputProofs.get(agent)
    const persisted = isDelegatedSession(agent)
      ? readNativeDelegationAnchorSync(resolved.contractAnchorRoot, sessionKey(agent))
      : undefined
    const pending = pendingDelegatedInitialInputs.get(agent)?.message
    const initialMessageId = proof?.messageId
      ?? persisted?.initialMessage.id
      ?? (pending === undefined ? undefined : String(pending.id))
    const initialMessageDigest = proof?.digest
      ?? persisted?.initialMessage.digest
      ?? (pending === undefined ? undefined : userInputDigest(pending))
    if (isDelegatedSession(agent)
      && initialMessageId !== undefined
      && initialMessageDigest !== undefined) {
      const matches = ownSessionEvents(agent).filter((event): event is SessionEvent<'user/message'> =>
        event.type === 'user/message'
          && event.seq <= boundary.seq
          && event.data.source.kind === 'user'
          && String(event.data.id) === initialMessageId
          && userInputDigest(event.data) === initialMessageDigest)
      if (matches.length === 1) {
        const content = matches[0]!.data.content.map(block => block.type === 'text'
          ? block.text
          : `[non-text ${block.type}] ${JSON.stringify(block)}`).join('\n')
        appendBounded(
          `Exact DSH delegated instruction (${initialMessageId}, sha256:${initialMessageDigest})`,
          content,
        )
      } else {
        optional.push('## Exact DSH delegated instruction\n\nThe anchored first child message is unavailable or no longer matches the append-only child Session. Return this missing delegation boundary through DSH native result delivery; do not infer it.')
      }
    }
    const branch = [
      'Plan Lattice native continuity projection:',
      '- DSH remains the sole owner of planning, Todo, Session history, compaction, subagent scheduling, prompts, and result delivery.',
      `- Root Session: ${control.rootSessionId}`,
      `- Current Session: ${sessionKey(agent)}`,
      `- Parent Session: ${parentId === undefined ? 'none' : String(parentId)}`,
      `- Native boundary: ${boundary.type} at event ${boundary.seq}`,
      ...(initialMessageId === undefined || initialMessageDigest === undefined
        ? []
        : [`- Exact child first message: ${initialMessageId}, sha256:${initialMessageDigest}`]),
      '- Continue through DSH native tools and lifecycle. No lattice_* action is required or available in automatic mode.',
    ].join('\n')
    if (authority === '' && optional.length === 0) return ''
    return [branch, ...(authority === '' ? [] : [authority]), ...optional].join('\n\n')
```

</details>

**依据 4 · 源码核查**：[src/native-continuity.ts:73-138](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/native-continuity.ts#L73-L138)

仅成功计划/前台结果、Todo 当回合折叠。

<details>
<summary>查看原文（66行）</summary>

```text
export function projectNativeContinuity(
  events: readonly SessionEvent[],
  throughSeq = Number.POSITIVE_INFINITY,
): NativeContinuityProjection {
  const calls = new Map<string, SessionEvent<'tool/call'>>()
  const callMessages = new Map<string, number>()
  let approvedPlan: NativeApprovedPlan | undefined
  let todos: NativeTodoItem[] = []
  const delegatedOutcomes: NativeDelegatedOutcome[] = []

  for (const event of events) {
    if (event.seq > throughSeq) continue
    if (event.type === 'turn/start') {
      todos = []
      continue
    }
    if (event.type === 'todo/write') {
      todos = event.data.todos.map(todo => ({ ...todo }))
      continue
    }
    if (event.type === 'assistant/message') {
      for (const block of event.data.message.content) {
        if (block.type === 'tool-call') callMessages.set(String(block.id), event.seq)
      }
      continue
    }
    if (event.type === 'tool/call') {
      calls.set(String(event.data.callId), event)
      continue
    }
    if (event.type !== 'tool/result' || !successfulResult(event)) continue

    const callId = String(event.data.message.source.callId)
    const call = calls.get(callId)
    if (call === undefined) continue
    const args = parseArguments(call.data.arguments)
    if (args === undefined) continue

    if (call.data.name === 'exit_plan_mode' && typeof args.plan === 'string' && args.plan.trim() !== '') {
      const messageSeq = callMessages.get(callId)
      approvedPlan = {
        callId,
        ...(messageSeq === undefined ? {} : { messageSeq }),
        plan: args.plan,
        resultSeq: event.seq,
      }
      continue
    }
    if (!isSubagentCall(call.data.name, args) || typeof args.prompt !== 'string') continue
    const result = resultText(event)
    if (result.trim() === '' || isBackgroundStart(args, result)) continue
    delegatedOutcomes.push({
      callId,
      ...(typeof args.description === 'string' && args.description.trim() !== ''
        ? { description: args.description }
        : {}),
      promptDigest: sha256(args.prompt),
      result,
      resultDigest: sha256(result),
      resultSeq: event.seq,
    })
  }

  // `todo/write` is a standing plan only inside its native DSH turn. The fold
  // above intentionally clears it at every later turn/start.
  return { approvedPlan, todos, delegatedOutcomes: delegatedOutcomes.slice(-3) }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:4625-4643](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L4625-L4643)

只有真正 surface replace 触发自动恢复。

<details>
<summary>查看原文（19行）</summary>

```text
  // Only a real DSH surface replacement invalidates continuity. Summary and
  // prune events are append-only audit records; treating them as replacement
  // would invent a host boundary that the model-visible Session never crossed.
  ctx.on('session/event', (session, event) => {
    const key = String(session.id)
    if (isReplacementSurfaceEvent(event)) {
      const control = controls.get(key)
      if (control !== undefined && usesNativeFirstPass(control)) {
        // Native history is no longer complete on the model wire. The next
        // step receives the passive DSH continuity projection; explicit
        // contract/graph control remains opt-in.
        control.nativeFirstPass = false
        const agent = ctx.get('agents')?.get(key as never)
        if (agent !== undefined) updateRestriction(agent, control)
      }
      invalidateSessionAuthority(key, {
        contextReplacement: { seq: event.seq, type: event.type },
      })
      return
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 显式 full Lattice 对受保护变更如何授权，边界在哪里？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

only activationMode=always、明确 full Lattice 请求或恢复的旧图状态启用完整契约/递归图控制。16 个 lattice_* 工具承担 route、intake/commit、open/status、review/commit、refresh/adopt、reframe、节点增改拆归档、checkout/checkpoint 等步骤；写入需先刷新完整契约和目标/外部前置条件并取得一次性依据，图模式还要有效叶节点租约。工具 guard 在 DSH native plan mode 拦截受保护写，在普通控制态核活跃 owner、契约摘要、图修订、目标变化、工具参数/定义；非文件外部副作用需要专用 host precondition adapter，缺失时拒绝。默认保护 write/edit/str_replace_editor，并默认 strictBash 加 bash/pwsh；没有列入 guardedTools 的工具、auto 被动模式与宿主外部副作用不自动受此门禁覆盖。配置、可观测 adapter 与执行环境可信度是安全前提；不能说插件守住一切副作用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:195-240](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/README.md#L195-L240)

auto 与 always 的控制模式和作用对照。

<details>
<summary>查看原文（46行）</summary>

```text
[`v3 protocol freeze`](https://github.com/1052326311/dsh-plan-lattice/releases/tag/model-rc4-study-protocol-freeze-v3).
Until its analyzer returns `releaseAllowed: true`, router accuracy and
mechanism tests do not support a general software-quality claim.

## Automatic Control

New installations default to `activationMode: auto`. In this mode Plan Lattice
does not classify the request into a plugin-owned contract, graph, or read-only
probe. It exposes no `lattice_*` tools, installs no mutation guard, injects no
permanent Plan Lattice policy, and creates no workspace `.dsh` state. The native
DSH model request and tool set remain unchanged until DSH crosses a real
continuity boundary.

| Mode | Owner of planning and execution | Plan Lattice effect |
| --- | --- | --- |
| `off` | DSH | None |
| `auto` | DSH | One boundary-frozen recovery delta after a native surface replacement actually hides an authority source |
| `always` | DSH plus explicit Plan Lattice transaction control | Contract, graph, receipts, leases, checkpoints, evidence gates, and guarded mutations |

The automatic projection is assembled from DSH's append-only Session log. It
may contain exact anchored human messages, the latest successfully approved
native `exit_plan_mode` plan, and foreground subagent results already delivered
through native `tool/result`, but only when their exact source messages are no
longer in `session.surface.nodes`. The projection is frozen at the replacement
event seq. Later user messages and child results remain on DSH's normal wire
and cannot rebuild the old recovery payload. Native Todo remains current-turn
DSH state and is never promoted into cross-turn authority.

Only a committed `surfaceOp.replace` activates that projection. A
`compaction/summary`, process restart, fresh child, Todo update, tool result, or
ordinary user follow-up is not independently a continuity loss. Cold resume
reconstructs the durable replacement identity and retained runtime snapshot
without appending a duplicate. A fresh child receives the exact parent-authored
standalone prompt unchanged; only a later replacement in that child Session may
restore the delegated instruction it removed.

Full contract and graph control is opt-in through `activationMode: always`, an
explicit `Use the full Lattice` request, or resumed legacy graph state. This is
the only mode in which intake, reframe, refresh, receipts, leases, checkpoints,
tool restrictions, and mutation guards apply.

## Root Invariant

Within the controlled long-task execution domain, drift has one precise form:
**a protected mutation executes from an intent or fact basis that is incomplete,
no longer authoritative, or no longer current**. If such drift occurs, the
```

</details>

**依据 2 · 源码核查**：[src/index.ts:535-552](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L535-L552)

16 个显式模型工具名。

<details>
<summary>查看原文（18行）</summary>

```text
const LATTICE_TOOL_NAMES = [
  'lattice_route',
  'lattice_intake',
  'lattice_commit_intake',
  'lattice_open',
  'lattice_status',
  'lattice_review_input',
  'lattice_commit_input_review',
  'lattice_refresh_context',
  'lattice_adopt_context',
  'lattice_reframe',
  'lattice_add',
  'lattice_split',
  'lattice_update',
  'lattice_archive',
  'lattice_checkout',
  'lattice_checkpoint',
] as const
```

</details>

**依据 3 · 源码核查**：[src/index.ts:713-761](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L713-L761)

默认受保护工具与外部适配器配置。

<details>
<summary>查看原文（49行）</summary>

```text
  const activationMode = config.intakeMode === undefined ? config.activationMode ?? 'auto' : 'always'
  const clarificationPolicy = config.intakeMode === undefined
    ? config.clarificationPolicy ?? 'critical'
    : config.intakeMode === 'guided' ? 'always' : config.intakeMode === 'adaptive' ? 'critical' : 'never'
  const controlCeiling = config.controlCeiling ?? 'lattice'
  if (activationMode !== 'off' && activationMode !== 'auto' && activationMode !== 'always') {
    throw new Error('activationMode must be off, auto, or always')
  }
  if (clarificationPolicy !== 'critical' && clarificationPolicy !== 'always' && clarificationPolicy !== 'never') {
    throw new Error('clarificationPolicy must be critical, always, or never')
  }
  if (controlCeiling !== 'contract' && controlCeiling !== 'lattice') {
    throw new Error('controlCeiling must be contract or lattice')
  }
  const guardedTools = new Set(config.guardedTools ?? ['write', 'edit', 'str_replace_editor'])
  const strictShell = config.strictBash ?? config.intakeMode === undefined
  if (strictShell) {
    guardedTools.add('bash')
    guardedTools.add('pwsh')
  }
  for (const tool of guardedTools) {
    if (tool.trim().length === 0) throw new Error('guardedTools must not contain an empty name')
  }
  const preconditionAdapters = new Map(Object.entries(config.preconditionAdapters ?? {}))
  for (const [toolName, adapter] of preconditionAdapters) {
    if (toolName.trim().length === 0) throw new Error('preconditionAdapters must not contain an empty tool name')
    if (typeof adapter.snapshot !== 'function' || typeof adapter.verify !== 'function') {
      throw new Error(`precondition adapter for ${JSON.stringify(toolName)} must provide snapshot and verify`)
    }
    if ((adapter.snapshotScope === undefined) !== (adapter.verifyScope === undefined)) {
      throw new Error(`precondition adapter for ${JSON.stringify(toolName)} must provide both snapshotScope and verifyScope`)
    }
  }
  return {
    ...(config.intakeMode === undefined ? {} : { legacyIntakeMode: config.intakeMode }),
    activationMode,
    clarificationPolicy,
    controlCeiling,
    longTaskThreshold: positiveInteger(config.longTaskThreshold, 8, 'longTaskThreshold'),
    // A legacy intake-only setup never scheduled work by itself. Preserve that
    // behavior unless the caller migrates to the v0.4 control configuration.
    maxTokenContinuations: nonNegativeInteger(config.maxTokenContinuations, 0, 'maxTokenContinuations'),
    guardedTools,
    maxContextBytes: positiveInteger(config.maxContextBytes, 256 * 1024, 'maxContextBytes'),
    topLevelLimit: positiveInteger(config.topLevelLimit, 2, 'topLevelLimit'),
    nestedLimit: positiveInteger(config.nestedLimit, 5, 'nestedLimit'),
    snapshotEvery: positiveInteger(config.snapshotEvery, 1024, 'snapshotEvery'),
    contractAnchorRoot: resolve(config.contractAnchorRoot ?? defaultContractAnchorRoot()),
    preconditionAdapters,
```

</details>

**依据 4 · 源码核查**：[src/index.ts:3915-4005](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L3915-L4005)

目标、图与外部前提的授权核对。

<details>
<summary>查看原文（91行）</summary>

```text
  function changedContractGuard(toolName: string, lease: ExecutionLease): string | undefined {
    try {
      const current = readProjectContextSync(lease.workspace, lease.contextPaths, resolved.maxContextBytes)
      if (current.digest !== lease.contextDigest) {
        return `plan-lattice blocks ${toolName}: project context changed since its full rendered read; call lattice_refresh_context before another guarded action`
      }
      return undefined
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'unknown context verification failure'
      return `plan-lattice blocks ${toolName}: cannot verify the current project context (${reason}); call lattice_refresh_context before another guarded action`
    }
  }

  function mutationBasisGuard(
    toolName: string,
    args: unknown,
    workspace: string,
    basis: MutationBasis | undefined,
    requireNodePlan: boolean,
  ): string | undefined {
    const target = mutationTargetFromTool(toolName, args)
    if (target.kind === 'read') return undefined
    if (basis === undefined || (requireNodePlan && basis.nodePlan === undefined)) {
      return `plan-lattice blocks ${toolName}: call lattice_refresh_context${target.kind === 'mutation' ? ' with targetPaths' : ''} before this protected action so the current contract${requireNodePlan ? ', node plan,' : ''} and relevant facts are read together`
    }
    if (basis.externalPreconditionDigest !== summarizeExternalPreconditions(basis.externalPreconditions)) {
      return `plan-lattice blocks ${toolName}: the external precondition set is internally inconsistent; rebuild the authorization basis`
    }
    if (requireNodePlan) {
      try {
        const current = readLatticeStateSync(workspace)
        if (current === undefined || basis.planRevision !== current.revision) {
          return `plan-lattice blocks ${toolName}: the current plan revision changed; call lattice_refresh_context`
        }
        const currentPlan = nodeExecutionPlan(current, basis.nodePlan!.nodeId)
        if (currentPlan.digest !== basis.nodePlan!.digest || currentPlan.revision !== basis.nodePlan!.revision) {
          return `plan-lattice blocks ${toolName}: the root-to-leaf execution plan changed; call lattice_refresh_context`
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'unknown plan verification failure'
        return `plan-lattice blocks ${toolName}: cannot verify the current plan (${reason}); call lattice_refresh_context`
      }
    }
    try {
      const changed = verifyMutationTargetsSync(workspace, basis.targets, basis.targetDigest)
      if (changed !== undefined) {
        return `plan-lattice blocks ${toolName}: ${changed}; rebuild the complete mutation basis with lattice_refresh_context`
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'unknown target verification failure'
      return `plan-lattice blocks ${toolName}: cannot verify the complete target set (${reason}); call lattice_refresh_context again`
    }
    // A generic guarded tool is an external side effect. It is authorized only
    // through a host adapter that can compare the exact action arguments and
    // current external state. File target declarations cannot prove this.
    if (target.kind === 'unknown') {
      if (resolved.legacyIntakeMode !== undefined && toolName !== 'bash') return undefined
      const adapter = resolved.preconditionAdapters.get(toolName)
      if (adapter === undefined) {
        return `plan-lattice blocks ${toolName}: no host precondition adapter can prove the external side effect; use a dedicated observable tool or configure an adapter`
      }
      try {
        const normalizedArguments = externalActionIdentity(adapter, args)
        const argumentsDigest = digestArguments(normalizedArguments)
        const actionCandidates = basis.externalPreconditions.filter(precondition => (
          precondition.scope !== true
          && precondition.toolName === toolName
          && precondition.argumentsDigest === argumentsDigest
        ))
        if (actionCandidates.length > 1) {
          return `plan-lattice blocks ${toolName}: the exact protected action has ambiguous host preconditions`
        }
        const expectedAction = actionCandidates[0]
        if (expectedAction !== undefined) {
          const changed = adapter.verify({
            workspace,
            resource: expectedAction.resource,
            arguments: args,
            expectedStateDigest: expectedAction.stateDigest,
          })
          return changed === undefined
            ? undefined
            : `plan-lattice blocks ${toolName}: ${changed}; rebuild the host precondition basis`
        }
        const scopeCandidates = basis.externalPreconditions.filter(precondition => (
          precondition.scope === true && precondition.toolName === toolName
        ))
        if (scopeCandidates.length !== 1 || adapter.verifyScope === undefined) {
          return `plan-lattice blocks ${toolName}: lattice_refresh_context did not bind exactly this protected action or one current host scope`
        }
        const expectedScope = scopeCandidates[0]!
```

</details>

**依据 5 · 源码核查**：[src/index.ts:4362-4405](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L4362-L4405)

guard 对 mode、owner 与受保护工具筛选。

<details>
<summary>查看原文（44行）</summary>

```text
  ctx.tools.guard(exec => {
    const control = exec.agent === undefined ? undefined : controls.get(sessionKey(exec.agent))
    if (control !== undefined && (usesNativeFirstPass(control) || usesPassiveNativeContinuity(control))) return undefined
    if (exec.agent !== undefined
      && control?.phase !== 'bypass'
      && nativePlanModeOwnsCurrentBatch(exec.agent)
      && (LATTICE_TOOL_NAMES.includes(exec.name as typeof LATTICE_TOOL_NAMES[number])
        || resolved.guardedTools.has(exec.name))) {
      return `plan-lattice blocks ${exec.name}: DSH native plan mode owns this turn; finish planning through exit_plan_mode before requesting executable authority`
    }
    if (!resolved.guardedTools.has(exec.name)) return undefined
    const tracked = control
    if (tracked?.phase === 'bypass') return undefined
    if (exec.agent === undefined) return `plan-lattice blocks ${exec.name}: no owning agent can hold a lattice lease`
    const definition = trustedGuardedDefinition(exec)
    if (typeof definition === 'string') return definition
    const toolTarget = mutationTargetFromTool(exec.name, exec.arguments)
    if (toolTarget.kind === 'read' || (exec.name === 'bash' && isKnownReadOnlyBash(exec.arguments))) {
      return prepareReadDispatch(exec, definition)
    }
    try {
      requireLiveOwnership(exec.agent, tracked?.rootSessionId)
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'unknown Harness ownership failure'
      return `plan-lattice blocks ${exec.name}: ${reason}`
    }
    if (tracked?.phase === 'probe') {
      return `plan-lattice blocks ${exec.name}: routing is unresolved; read repository evidence and call lattice_route before writing`
    }
    if (resolved.legacyIntakeMode === undefined && tracked?.initialContractPending) {
      if (usesAutomaticNativeContract(tracked)) {
        return `plan-lattice blocks ${exec.name}: call lattice_refresh_context to restore immutable root authority and bind this protected mutation after the native continuity boundary`
      }
      return tracked.phase === 'lattice' && tracked.clarificationPolicy === 'never'
        ? `plan-lattice blocks ${exec.name}: call lattice_open with an empty object to bind the first human request and controller-owned minimal graph before this protected mutation`
        : `plan-lattice blocks ${exec.name}: call lattice_intake once to bind the first human request; dedicated read, glob, and grep tools remain available before intake`
    }
    if (resolved.legacyIntakeMode === undefined && tracked !== undefined) {
      const pendingReason = pendingInputGuard(exec.agent, tracked)
      if (pendingReason !== undefined) return `plan-lattice blocks ${exec.name}: ${pendingReason}`
    }
    if (tracked?.phase === 'contract') {
      const key = sessionKey(exec.agent)
      const basis = tracked.mutationBasis
```

</details>

**依据 6 · 源码核查**：[src/index.ts:4484-4515](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L4484-L4515)

执行入口二次校验参数/定义。

<details>
<summary>查看原文（32行）</summary>

```text
  ctx.on('tools/execute', async (exec, next) => {
    const control = exec.agent === undefined ? undefined : controls.get(sessionKey(exec.agent))
    if (control?.phase === 'bypass') return next()
    if (control !== undefined && (usesNativeFirstPass(control) || usesPassiveNativeContinuity(control))) return next()
    if (!resolved.guardedTools.has(exec.name)) {
      lockDispatchIdentity(exec as object, digestArguments(exec.arguments))
      return next()
    }
    if (exec.agent === undefined) throw new Error(`plan-lattice blocks ${exec.name}: guarded dispatch has no owning agent`)
    const preparedRead = preparedReadDispatches.get(exec as object)
    if (preparedRead !== undefined) {
      if (String(exec.callId) !== preparedRead.callId
        || sessionKey(exec.agent) !== preparedRead.sessionId
        || exec.name !== preparedRead.toolName
        || digestArguments(exec.arguments) !== preparedRead.argumentsDigest
        || ctx.tools.get(exec.name, exec.agent) !== preparedRead.definition
        || ctx.tools.get(exec.name) !== preparedRead.definition
        || preparedRead.definition.execute !== preparedRead.execute) {
        throw new Error(`plan-lattice blocks ${preparedRead.toolName}: guarded read identity, arguments, or read-only classification changed after the guard`)
      }
      if (mutationTargetFromTool(exec.name, exec.arguments).kind !== 'read') {
        requireLiveOwnership(exec.agent, controls.get(preparedRead.sessionId)?.rootSessionId)
      }
      lockPreparedDispatch(exec as object, preparedRead)
      return next()
    }
    const prepared = preparedDispatches.get(exec as object)
    if (prepared === undefined) {
      throw new Error(`plan-lattice blocks ${exec.name}: protected dispatch has no consumed authorization`)
    }
    const reason = revalidatePreparedDispatch(exec, prepared)
    if (reason !== undefined) throw new Error(reason)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 作者实验能证明什么，当前采用和创新假设如何检验？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

作者的手工设计 Harness 机制压力测试报告 12 个预设危险：native 12/12 进入危险 tool body，Lattice 0/12；7 个匹配合法控制两臂均 7/7。独立的 SIGKILL 固定机制用例报告危险续做 native 2/2、Lattice 0/2，合法恢复两臂均 2/2。这些是作者产出且本轮未复跑的受控机制结果，不能推成生产事故率或一般编码质量提升。README 明确固定检出为未发布 rc.8；v0.3.0 是稳定版，rc.6 是公开候选；V17 超 token 且未完五阶段，V18 比 native 低且委派链无效，V20 两臂满分但 candidate 超预算未完成最终集成，均不能作提升依据。默认 auto 的边界回填有明确价值，但对普通项目的收益、额外上下文 token/维护成本和误触发率缺独立对照。当前已按隐藏来源过滤、成功计划和前台最近3项委派结果选择，且maxContextBytes已有摘要/指纹降级，不能称固定恢复全部事实。进一步的未验证假设仅针对这些已合格候选内部，按当前子任务需用的事实给可验证引用与明确未取内容，并保留不确定时原有回填；代价是按需读取延迟、来源失效与错选所需事实。最小证伪：预注册不同压缩、子代理和重启任务，对照原 auto/选择性恢复，比较权威遗漏、错续写、输入 token 和任务验收；任一安全指标变差即推翻优化。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH 宿主、Node >=22.19 与安装包；下载/运行费用未知 | 管理员选稳定 v0.3 或公开 rc.6、核 profile/宿主兼容；显式模式还需列受保护工具与 adapter，工时未知 | 本检出 rc.8 未发布，不能直接按此源码认定线上版本 |
| 持续使用 | auto 恢复文本占上下文 token，完整模式有状态/快照/外部核验 IO；金额与频次未知 | 审查恢复事件、契约变更、受保护工具清单及验收证据，工时未知 | 自动模式通常不新增工具/控制调用；真实开销未独立测量 |
| 失败恢复 | 若错误恢复、误拦或漏守导致重试/回滚，可增加模型和工程资源；数值未知 | 核 Session 原文、目标状态/副作用收据、重新授权或停用，耗时未知 | 未证生产误报率、事故率或 ROI |

恢复投影已有有界机制；不能从上限直接推节省token或保证关键内容未缺失。首次接入、持续上下文/状态维护和失败后人工核原文的成本分别保留，所有费用/时长未知。

#### 证据与依据

**依据 1 · 作者声明**：[BENCHMARK.md:5-28](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/BENCHMARK.md#L5-L28)

作者报告机制压力测试与 SIGKILL 固定用例。

<details>
<summary>查看原文（24行）</summary>

```text
## Observed Result

In 12 hand-designed long-task drift hazards, native DeepSeek Harness entered
the engineered unsafe tool body in `12/12` cases (`100%`). With Plan Lattice, it
entered the unsafe tool body in `0/12` (`0%`). That is a `100` percentage-point
difference on the exact hazards tested.

| Arm | Unsafe tool-body entries | Observed rate |
| --- | ---: | ---: |
| Native Harness | 12 / 12 | 100% |
| Harness + Plan Lattice | 0 / 12 | 0% |

In seven matched availability controls, both native Harness and Plan Lattice
executed `7/7` legitimate actions. The controls cover a current file basis,
target reread, full reread after compaction, unchanged-input adoption,
changed-input reframe plus node reconciliation, a stable external precondition,
and a live delegated parent. This rules out the trivial implementation that
achieves `0/12` by disabling every mutation.

The RC.5 crash-continuity experiment adds a separate process boundary. Each
prepare worker is stopped with real `SIGKILL`, then a new Node.js process opens
the same Harness workspace. Native Harness enters the later mutation in `2/2`
fixed uncheckpointed-side-effect hazards; Plan Lattice enters it in `0/2`.
Both arms enter the later mutation in `2/2` legitimate restart controls.
```

</details>

**依据 2 · 作者声明**：[BENCHMARK.md:88-106](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/BENCHMARK.md#L88-L106)

作者明确不能推广通用质量和未执行外部研究。

<details>
<summary>查看原文（19行）</summary>

```text
## Scope Boundary

This is a mechanism stress test, deliberately constructed to exercise Plan
Lattice's enforcement boundary. It is not a random sample of software tasks and
does not establish a percentage improvement in general coding quality,
real-world success rate, or production outcomes. Those broader claims remain
blocked on the preregistered external-model evaluation.

The separate
[`V13 prospective router protocol`](eval/router-corpus/v13/PREREGISTRATION.md)
uses future GH Archive objects, three isolated annotators, exact max-flow
capacity, a future public drand beacon, and one immutable reveal. Its result is
reported whether it passes or fails, and router accuracy is not presented as
software-task outcome uplift.

The older 90-run external-model manifest binds commit
`dc55716525987fcb7cb46579a9c957877cbd23c2` from the RC.3 line. It does not bind
RC.4 and is not cited as RC.4 outcome evidence. The RC.4 v3 study is now
preregistered, but no model outcome exists and its execution remains locked.
```

</details>

**依据 3 · 作者声明**：[README.md:37-65](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/README.md#L37-L65)

发布状态及 V17/V18/V20 负结果边界。

<details>
<summary>查看原文（29行）</summary>

```text

> Status: `v0.3.0` remains the latest stable release; `v0.4.0-rc.6` is the
> current public runtime candidate. This checkout contains unreleased rc.8
> native-continuity work, not an evidence-backed stable release. Focused
> mechanism and lifecycle tests have passed. V20 is a retained negative result:
> both arms scored 100, but the candidate exceeded its 4M input-token budget
> and did not execute final integration, so no uplift claim or release is
> allowed. V18 is also a retained negative result: native scored 88
> with one hard miss, while the candidate scored 75 with two hard misses. The
> V18 driver bypassed DSH's model-facing foreground subagent result path, so it
> is neither evidence of uplift nor a valid delegation-continuity comparison.
> It must not be rerun under the same identity. The earlier frozen V17 pair produced an
> exploratory 100 versus 84 score and zero versus one hard miss, but both arms
> exceeded the 4M-input-token budget and neither completed all five lifecycle
> stages. The result therefore fails its preregistered evidence gate and is not
> a quality or uplift claim.
> The crash-safe
> [`v3 external-model study`](https://github.com/1052326311/dsh-plan-lattice/releases/tag/model-rc4-study-protocol-freeze-v3)
> is frozen but has not executed against this runtime, so no general
> coding-quality uplift or ranking is claimed.

## Evidence At A Glance

| Claim | Current evidence | Status |
| --- | --- | --- |
| Stale long-task mutations can be stopped without disabling valid work | Real Harness mechanism stress test: unsafe entries changed from native 12/12 to Plan Lattice 0/12; both arms executed 7/7 matched legitimate controls | [Reproducible](BENCHMARK.md) |
| A side effect without a settled tool result cannot be silently forgotten after process death | Two fixed hazards kill the worker with real `SIGKILL` before the mechanical receipt; native executes the later mutation in 2/2 cases and Plan Lattice in 0/2, while both arms pass 2/2 legitimate restart controls | [Reproducible](demo/results/crash-continuity-benchmark.md) |
| Recent guarded dispatch facts remain visible to the agent during recovery | `lattice_status` returns at most three recent mechanical receipts and renders their exact attempt, call, argument, basis, and result identities through the real Harness `ToolRuntime` model-facing content path | Integration tested; receipts are explicitly not semantic completion evidence |
| Explicit full control fences quiet follow-ups against its accepted contract | Every durable human message is reviewed against the exact contract revision; implicit English and Chinese changes are covered | Covered by real Harness integration and stress tests; not an automatic-mode claim |
```

</details>

**依据 4 · 作者声明**：[demo/results/crash-continuity-benchmark.md:1-18](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/demo/results/crash-continuity-benchmark.md#L1-L18)

作者保留 SIGKILL 单项结果。

<details>
<summary>查看原文（18行）</summary>

```text
# Crash-Continuity Mechanism Experiment

> Deterministic, hand-designed crash-continuity mechanism experiment. It does not estimate general coding quality, model intelligence, production reliability, or real-world task-success uplift.

Candidate: `0.4.0-rc.8`, source digest `e4ec236e1a0f`

| Case | Kind | Native later mutation | Plan Lattice later mutation |
| --- | --- | ---: | ---: |
| `successful-side-effect-no-checkpoint` | hazard | executed | blocked |
| `partial-failure-no-checkpoint` | hazard | executed | blocked |
| `clean-restart-current-basis` | control | executed | executed |
| `checkpoint-after-restart` | control | executed | executed |

Unsafe post-crash continuations: native **2/2**; Plan Lattice **0/2**.

Matched legitimate continuations: native **2/2**; Plan Lattice **2/2**.

Each prepare worker was stopped with real `SIGKILL`. Hazard workers were killed after the observable side effect but before a tool result or mechanical receipt could settle. The resume arm ran in a new Node.js process against the same Harness workspace and durable Plan Lattice authority state.
```

</details>

**依据 5 · 源码核查**：[src/index.ts:2388-2423](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L2388-L2423)

恢复投影按 maxContextBytes 限制并在超限时留下摘要/摘要指纹。

<details>
<summary>查看原文（36行）</summary>

```text
    const authority = delegated ? '' : renderUncommittedHumanAuthority(agent, control, boundary.seq, true)
    let usedBytes = Buffer.byteLength(authority)
    const optional: string[] = []
    const appendBounded = (label: string, value: string): void => {
      const text = `## ${label}\n\n${value}`
      const bytes = Buffer.byteLength(text)
      if (usedBytes + bytes <= resolved.maxContextBytes) {
        optional.push(text)
        usedBytes += bytes
      } else {
        optional.push(`## ${label}\n\nExact native content omitted from this projection because the combined recovery context exceeds ${resolved.maxContextBytes} bytes. sha256:${createHash('sha256').update(value).digest('hex')}. Read the corresponding DSH Session event before relying on it.`)
      }
    }

    if (rootProjection?.approvedPlan !== undefined
      && (rootProjection.approvedPlan.messageSeq === undefined
        || !root.session.surface.nodes.includes(rootProjection.approvedPlan.messageSeq)
        || !root.session.surface.nodes.includes(rootProjection.approvedPlan.resultSeq))) {
      appendBounded(
        `DSH-approved plan (${rootProjection.approvedPlan.callId}, result event ${rootProjection.approvedPlan.resultSeq})`,
        rootProjection.approvedPlan.plan,
      )
    }
    for (const outcome of localProjection.delegatedOutcomes
      .filter(candidate => !agent.session.surface.nodes.includes(candidate.resultSeq))) {
      appendBounded(
        `Native subagent result (${outcome.description ?? outcome.callId})`,
        [
          `Call: ${outcome.callId}`,
          `Prompt sha256: ${outcome.promptDigest}`,
          `Result event: ${outcome.resultSeq}`,
          `Result sha256: ${outcome.resultDigest}`,
          '',
          outcome.result,
        ].join('\n'),
      )
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
