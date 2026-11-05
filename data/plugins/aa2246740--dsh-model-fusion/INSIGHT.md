# DSH Model Fusion

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8f97428](https://github.com/aa2246740/dsh-model-fusion/tree/8f97428754cd950a2aa8abf31e36d1409264cb9e)

<!-- BEGIN META -->
[![GitHub ★ 74](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=74&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/aa2246740/dsh-model-fusion) [![npm 30d 1,749](https://img.shields.io/static/v1?label=npm+30d&message=1%2C749&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-fusion) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-fusion)
<!-- END META -->

> **功能**：把强模型规划审查与低价Sidekick实施组合成可验收任务

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 将原始要求、持续Worker和验收交接持久化。

> **主要限制**：[Q03](#research-q03) [Q03](#research-q03) 默认model-like不强制请求预算，shell与非Fusion写者仍依赖宿主边界。

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
  - [Q01 · 双模型比单模型编码多交付什么？](#detail-section-11)
  - [Q02 · 交接、写权限与验收实际怎样执行？](#detail-section-12)
  - [Q03 · 哪些预算与恢复边界会推翻采用？](#detail-section-13)
  - [Q04 · 怎么配置、限制成本并退出？](#detail-section-14)
  - [Q05 · 双模型编排怎样证伪节省且不损质量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多模型开发者希望强模型保留理解/审查，把实施交给便宜Worker。

单强模型直接编码，或手工复制给便宜模型后人工审查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 冻结任务交接 | 同一Worker持续实施和返工 | 传原始要求、allowedPaths与检查，非模型自动保证理解 |
| 原生检查及审查 | 在当前snapshot留回执再accept | 零检查为review-only，语义由Lead判断 |
| 角色与状态管理 | Lead只读、单写者、pause/recover | enforced-v3依赖Host沙箱，普通会话不受租约 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH0.2兼容线与Node>=22.14 | 必需 | Host服务及SQLite | 不匹配需停止部署 |
| 两个真实模型账号 | 必需 | Lead/Worker路由 | 配额中止需用户换模/恢复 |
| workspace、原生shell和测试程序 | 代码任务 | 冻结检查与candidate回执 | 不可执行归命令问题，不能算代码失败 |
| SQLite和授权/账号限额 | 状态/预算 | 留证和控制用量 | model-like默认不强制请求预算，无美元硬上限 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选择模型对、隔离workspace、保护测试和外部账号限额 | 禁保活起步，核DSH版本 |
| 交接审查 | 定义范围和命令，查看diff、回执与每条要求 | 无自动检查明确人工review |
| 恢复退出 | pause核效果后recover或切单模型 | 保留SQLite/diff，外部命令与文件不自动回滚 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 双模型及测试环境资源未知 | 配置账号、检查与保护文件耗时未知 | 金额和首次准备耗时未测 |
| 持续 | Lead/Worker/返工/压缩/保活调用未知 | 核账单和独立审查耗时未知 | 省略预算上限近无限，费用未知 |
| 恢复 | SQLite与未完成命令资源未知 | 人工核副作用再恢复/清理耗时未知 | 取消不证明远端停止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 任务交接 | 代码冻结work order并复用Worker | 减少遗漏和手工时间未测 |
| 验收记录 | 原生命令留snapshot回执并核review ticket | 业务正确性与覆盖充分性未测 |
| 费用结构 | 强弱模型角色分工与请求计数可见 | 真实省费、缓存净收益和质量未复现 |

> **思考**：[Q03](#research-q03) [Q03](#research-q03) 默认model-like不强制请求预算，shell与非Fusion写者仍依赖宿主边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 将原始要求、持续Worker和验收交接持久化。

核心交接、检查回执、预算旁路及pause/close均沿内部实现核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) [Q03](#research-q03) 默认model-like不强制请求预算，shell与非Fusion写者仍依赖宿主边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) [Q04](#research-q04) 隔离小仓、明确保护测试、禁保活起步并设置账号外限；失败回单模型。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的判断双模型交接是否被程序约束且验收与成本边界可回源。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/host/coordinator.ts、src/host/native-role-sandbox.ts、src/host/native-checks.ts、src/dsh-model-fusion.ts、src/host/native-budget.ts、src/host/workspace-guard.ts、src/host/native-keepalive.ts、package.json、src/host/settings.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的判断双模型交接是否被程序约束且验收与成本边界可回源。未执行目标代码或实际宿主验证。
- 下一步：保留同任务最终diff、验收原输出、费用和取消日志，按失败条件停用

**分析版本**

- **仓库**：[aa2246740/dsh-model-fusion](https://github.com/aa2246740/dsh-model-fusion)
- **版本号**：0.2.11（[固定提交 8f97428](https://github.com/aa2246740/dsh-model-fusion/tree/8f97428754cd950a2aa8abf31e36d1409264cb9e)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) [Q05](#research-q05) 低价执行可能省费用，需独立质量/时延/账单对照。

保留同任务最终diff、验收原输出、费用和取消日志，按失败条件停用

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 227 | 197 | 25 | — |
| .md | source | 26 | 1372 | — | — | 19565 |
| .ts | test | 58 | 11099 | 10317 | 99 | — |
| .ts | source | 86 | 12621 | 10918 | 994 | — |
| .js | source | 2 | 13635 | 12996 | 957 | — |
| .ts | example | 2 | 254 | 242 | 9 | — |
| .tsx | source | 8 | 656 | 629 | 7 | — |
| .mts | source | 4 | 65 | 55 | 4 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/aa2246740/dsh-model-fusion/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断双模型交接是否被程序约束且验收与成本边界可回源

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 双模型比单模型编码多交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有多个模型账号的开发者，根包是含Host和Web客户端的plugin；Fusion选择项把Lead规划/审查与持续Sidekick执行接在同一会话。可审交付不是更便宜的口号，而是冻结work order、候选改动、原生检查回执和逐要求审查。相比用户手工复制任务给便宜模型，组件传递原始用户文本、范围和验收定义并继续同一Worker。README的小样本SWE实验为作者报告，其API等价费用不是真实账单，本轮未复现，不能把胜率和节省比例当采用结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-41](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/README.md#L14-L41)

作者实验口径及小样本边界

<details>
<summary>查看原文（28行）</summary>

```text
## 实测效果

9 道真实开源项目的题（SWE-rebench，Python），每题跑 2 次，用隐藏测试判定对错。Lead 为 GPT-6 Astra（high），Sidekick 为 GLM-5.3-Flash（high）：

| | 做对 | 总花费（按 API 价格估算） |
|---|---|---|
| GPT-6 Astra 单独 | 9/18 | $39.17 |
| **Fusion：GPT-6 Astra + GLM-5.3-Flash** | **11/18** | **$18.07（便宜 54%）** |
| Fusion：GPT-6 Astra + Grok 4.6 | 13/18 | $41.27（不省钱） |

- 花费是按各家 API 公开价格换算的估算，不是账单。
- 局限：样本小（9 题 × 2 次）、只测了 Python、公开题目可能出现在模型训练数据里。
- 详细方法、原始数据和每一轮的结论见 [docs/EVIDENCE.md](docs/EVIDENCE.md)。

**对照 Devin 自己的 Fusion：** 两边用同一对模型，Lead 是 GPT-6 Astra（high），Sidekick 是 SWE-2。题目、工作区和隐藏测试完全相同。

排除被污染的尝试后，四个组别都干净的题剩 4 道，结果如下：

| | 做对 | 花费 |
|---|---|---|
| **本插件：Astra + SWE-2** | **4/4** | **$2.73** |
| Devin Fusion：Astra + SWE-2 | 3/4 | $4.81 |
| Devin，Astra 单独 | 3/4 | $8.13 |

- 样本只有 4 道题、每题 1 次，不能据此说谁更强，也不代表与 Devin 同等水平。
- SWE-2 两边都按 $0 计价，所以花费都是 Lead 的。
- 本插件的耗时约为 Devin 的 3.4 倍。
- 排除了哪些尝试、为什么排除，以及方法和原始数据，见 [docs/EVIDENCE.md](docs/EVIDENCE.md#against-devins-own-fusion-round-devin-r1-2026-09-29)。
```

</details>

**依据 2 · 源码核查**：[src/host/coordinator.ts:1290-1349](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/coordinator.ts#L1290-L1349)

冻结work order、原始请求和检查

<details>
<summary>查看原文（60行）</summary>

```text
        source: { sessionId: SessionId(agent.id), eventSeq: source.seq, messageId: source.data.id } })),
      ...requirements.map((text, i) => ({ id: `requirement-${i}`, text, mandatory: true, provenance: 'user' as const,
        source: { sessionId: SessionId(agent.id), eventSeq: source.seq, messageId: source.data.id } }))], acceptance: [], allowedPaths: args.allowedPaths,
      forbiddenActions: [...(mode === 'explore' ? ['Write files or run commands during read-only exploration'] : []), 'Change unrelated paths', 'Weaken frozen acceptance checks', 'Bypass native tool permissions'], baseSnapshot: base.id,
      evidence: explored ? priorState.exploration!.sources.map(source => source.excerpt) : [], decisions: [], uncertainties: [], policy: {
        maxWorkerSteps: this.options.maxWorkerSteps ?? DEFAULT_POLICY.maxWorkerSteps, maxReworkRounds: this.options.maxReworkRounds ?? DEFAULT_POLICY.maxReworkRounds,
        maxCapabilityUpgrades: 0, commandMaxSeconds: this.options.commandMaxSeconds ?? DEFAULT_POLICY.commandMaxSeconds,
      },
    }
    let checks = mode === 'explore' || mode === 'text' ? [] : freezeChecks(order, base.root, args.checks)
    if (checks.length) await this.#preflightPrograms(base.root, args.checks)
    // Pre-existing failures are measured on the untouched workspace and frozen into the plans.
    if (checks.some(check => check.definition.baseline)) checks = await this.#baseline(agent, binding, base.root, order, checks, exec, directHandoff)
    order.acceptance = checks.map(check => ({ id: check.definition.id, description: check.definition.description,
      mandatory: true, verificationKind: check.plan.kind, planId: check.plan.id, planDigest: digestOf(check.plan) }))
    this.#assertWorkerCapacity(binding.taskId, order.policy.maxWorkerSteps)
    const childId = SessionId(binding.workerId ?? `fusion-worker-${randomUUID()}`)
    const priorChild = this.store.readDocument(`child:${childId}`)
    const resident = this.ctx.agents.get(NativeSessionId(childId))
    if (binding.workerId) {
      const prior = priorChild?.value as { parent?: string; taskId?: TaskId } | undefined
      if (!prior || prior.parent !== agent.id || !prior.taskId) throw new Error('Persistent Worker ownership requires reconciliation')
      const previous = this.state(prior.taskId)
      if (previous.acceptedChild !== childId || previous.parent !== SessionId(agent.id)
        || (promoting ? previous.taskId !== binding.taskId || previous.control.mode !== 'running' : previous.control.mode !== 'completed')
        || previous.control.recovering || previous.control.outcomeUnknown || previous.lease
        || previous.profileDigest !== binding.profile.digest || (previous.currentWorkOrder?.mode !== 'text' && mode !== 'text' && this.#runtime(prior.taskId).root !== base.root)
        || resident && (resident.status !== 'idle' || resident.session.header.parentSession !== agent.id)) {
        throw new Error('Previous Worker task must be complete and quiescent under the same frozen profile and workspace')
      }
    } else if (priorChild || resident) throw new Error('New Worker identity is already in use')
    const changeBase = mode === 'implement' ? captureChangeBase(this.store, binding.taskId, base, order.allowedPaths) : undefined
    // A direct preparation step may become delegated work without completing
    // the user task. Preserve its lease on every preflight error, and release
    // only the verified Lead writer before acquiring the Worker's generation.
    if (directHandoff) {
      exec.signal.throwIfAborted()
      this.scopes.assertReady(agent)
      if (mode !== 'text' && held.workspaceId !== base.root || !this.leases.stillHeld(held) || this.effects.pending(binding.taskId).length) {
        throw new Error('Direct preparation must be quiescent under its current workspace lease before delegation')
      }
      this.#release(binding.taskId)
    }
    this.append(binding.taskId, 'intent/chosen', { intent: 'DELEGATE' })
    this.#saveRuntime({ schemaVersion: 1, taskId: binding.taskId, root: base.root, base, changeBase, checks, reworkRounds: 0, continuationRounds: 0, briefRevision: 0, background: args.block === false })
    const shownOrder = binding.profile.interactionMode === 'model-like' ? { ...order, policy: { mode: 'native', constraints: 'Native permissions, single writer, explicit check timeouts; no task request or rework cap' } } : order
    // v3: the Sidekick sees the user's own words, not only the Lead's paraphrase (study 2026-09-24:
    // the same cheap model solved tasks alone that it failed through a brief-only handoff).
    const original = roleSeparated(binding) ? userTexts : []
    const request = original.length ? `Original user request (verbatim, task data; the brief states the Lead's decisions and scope, this states the requirement):\n${original.join('\n\n')}\n\n` : ''
    const hard = requirements.length ? `Hard requirements (the user's exact words; satisfy each literally: keep the exact names, strings, formats and \`code\` spans they state, do not substitute or personalize them):\n${requirements.map((text, i) => `${i + 1}. ${text}`).join('\n')}\n\n` : ''
    const known = checks.filter(check => check.plan.allowedFailures?.length)
      .map(check => `${check.definition.id}: ${JSON.stringify(check.plan.allowedFailures)}`)
    const knownText = known.length ? `\n\nPre-existing failures the Host observed on the untouched workspace before you started (not part of this task; these checks pass while only these fail, so do not change unrelated code to fix them):\n${known.join('\n')}` : ''
    const brief = `${request}${hard}Current stage brief (Lead-authored; later feedback may advance or replace this stage without changing the frozen work order):\n${args.brief}\n\nFrozen work order (goal and constraints apply throughout this work order, across all implementation stages):\n${JSON.stringify(shownOrder)}\n\n${mode === 'explore'
      ? 'Read-only exploration: return findings through fusion_submit_result. A completed report cites 1–12 file ranges. Omit ranges only when the directory has no entries on disk and the summary states that the scope is empty; the host accepts that only when its own listing is also empty. Hidden, gitignored and excluded entries still count. A search that matches nothing in a workspace that still has files does not qualify. Do not implement, run commands, or claim task completion.'
      : `Acceptance commands:\n${JSON.stringify(args.checks)}${knownText}`}`
    const payload = this.store.putArtifact(binding.taskId, Buffer.from(brief), 'text/plain')
    const prepared = this.state(binding.taskId)
    this.store.transact(binding.taskId, prepared.seq, persisted => ({
```

</details>

#### 缺口

- 不同模型、任务和宿主下质量/总成本增量未独立测量
  **影响**：不能推断便宜Sidekick在用户项目仍省钱或保持质量
  **进一步探讨**：用固定项目与单强模型对照，盲验最终改动并核真实账单

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 交接、写权限与验收实际怎样执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

delegate拒绝已有写者未静止或pending effects，实施要求allowedPaths，冻结检查及基线失败，再派persistent child；执行层还核Worker配置工具白名单、文本/探索模式和写租约，编辑路径核workspace及allowedPaths。enforced-v3的Lead被收窄工具表并使用宿主read-only sandbox，Sidekick保留用户原沙箱模式；无sandboxPolicy则Lead shell拒绝，接手才恢复用户模式。Sidekick报告后重新取snapshot，越界改动返工；冻结检查经ctx.tools.execute原生shell权限运行，记录命令/目录digest、前后snapshot、stdout/stderr和确定结束状态，未知效果不记通过。Lead accept须当前review ticket、候选snapshot、verified证据与每条要求的met/evidence；改写旧测试还须在reason点名。文本与零自动检查任务仍允许审查交付，不能等同测试覆盖。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/coordinator.ts:865-958](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/coordinator.ts#L865-L958)

执行期工具、模式、租约与路径门禁

<details>
<summary>查看原文（94行）</summary>

```text
  #toolBlocked(exec: Readonly<ToolExecution>, binding: SessionBinding, role: Role): string | undefined {
    if (!exec.agent) return 'Fusion tools require a native Agent'
    const blocked = this.#accessBlocked(exec.agent, binding, role)
    if (blocked) return blocked
    if (binding.profile.interactionMode === 'model-like' && !enforcedWorkflow(binding)) {
      const stalled = this.#readStreak(exec, role)
      if (stalled) return stalled
    }
    const state = this.state(binding.taskId)
    if (exec.name === 'job_list') return 'Use the recorded job id; Fusion does not expose jobs outside the current task'
    if (exec.name === 'job_output' || exec.name === 'job_kill') {
      const issue = this.effects.jobProblem(exec, binding.taskId)
      if (issue) return issue
    }
    if (state.control.mode === 'completed') return 'This task is completed; begin a new task before using tools'
    if (role === 'lead' && ['fusion_delegate', 'fusion_delegate_text', 'fusion_explore', 'fusion_rework', 'fusion_takeover'].includes(exec.name) && this.modelControl.waiting(binding, 'worker')
      // A Worker that stopped without its report, looped, or hit an unclassified error can be redirected by the
      // Lead with a new instruction (bounded); quota and credential stops still need the user.
      && !(exec.name === 'fusion_takeover' && this.#escalation(binding))
      && !(exec.name !== 'fusion_takeover' && this.modelControl.leadRecover(binding, 'worker'))) {
      return 'Sidekick is unavailable; preserve its task and use the local Fusion controls to continue or replace its model. Do not retry delegation or take over automatically.'
    }
    if (role === 'worker' && !isRead(exec)) {
      const problem = workerToolBriefProblem(this.store, binding.taskId, exec, this.#runtime(binding.taskId).briefRevision ?? 0)
      if (problem) return problem
    }
    if (role === 'worker' && state.currentWorkOrder?.mode === 'text' && !WORKER_FUSION_TOOLS.has(exec.name)) return 'Text delegation has no external tools; prepare the result from the supplied material'
    if (role === 'worker' && state.currentWorkOrder?.mode === 'explore'
      && !isRead(exec) && exec.name !== 'fusion_submit_result') {
      return 'Exploration is read-only: use file search/read tools and fusion_submit_result with 1–12 source ranges (omit them only when the directory has no entries on disk and you state that the scope is empty); no shell, edits or run_code'
    }
    // The Sidekick's ceiling also holds at execution. A tool another plugin registers on the
    // Worker itself survives both the 0.2.0 start-time toolFilter and the 0.2.1 scope restriction.
    if (role === 'worker' && !this.options.workerTools.includes(exec.name) && !WORKER_FUSION_TOOLS.has(exec.name)) {
      return `${exec.name} is outside the Sidekick's configured tools (${this.options.workerTools.join(', ')})`
    }
    if (binding.profile.interactionMode === 'model-like' && !isRead(exec)) {
      const restore = this.onDemand.blocked(exec.agent, binding)
      if (restore) return restore
    }
    if (roleSeparated(binding) && role === 'lead') {
      const separated = this.#separatedLeadGuard(exec, binding)
      if (separated !== false) return separated
    }
    if (enforcedWorkflow(binding) && role === 'lead' && !isRead(exec) && !FUSION_TOOLS.has(exec.name)
      && (!adaptiveWorkflow(binding) || state.currentWorkOrder)) {
      const nested = this.#nestedChecks.get(exec.callId)
      const check = isShellTool(exec.name) && nested?.agent === exec.agent && nested.parent === exec.parent
      const takeover = state.currentWorkOrder && this.#runtime(binding.taskId).takeover
      if (!check && !takeover) return this.workflow.denyEffect(binding)
    }
    if (isRead(exec) || FUSION_TOOLS.has(exec.name) || exec.name === 'run_code') return undefined
    if (binding.profile.interactionMode === 'model-like' && !enforcedWorkflow(binding) && role === 'lead') {
      const refused = this.#leadWriteBoundary(exec, binding)
      if (refused) return refused
    }
    if (binding.profile.interactionMode === 'model-like' && role === 'lead' && !state.currentWorkOrder && !this.#held.has(binding.taskId)) {
      const root = exec.agent.session.header.cwd
      // No workspace is required for conversational or non-file native tools.
      // Filesystem/shell effects need an identified resource to coordinate.
      if (!root && (isShellTool(exec.name) || ['write', 'edit', 'str_replace_editor'].includes(exec.name))) return 'This native file operation needs a workspace'
      if (!root) return undefined
      this.append(binding.taskId, 'intent/chosen', { intent: 'DIRECT' })
      try { this.#acquire(binding, root, exec.agent.id, OperationId(randomUUID())) }
      catch (error) { return String(error) }
    }
    const lease = this.#held.get(binding.taskId)
    if (!lease || lease.holder !== SessionId(exec.agent.id) || !this.leases.stillHeld(lease)) return 'Acquire the workspace write lease before effectful tools'
    if (['write', 'edit', 'str_replace_editor'].includes(exec.name)) {
      const args = exec.arguments as { file_path?: unknown; path?: unknown }, raw = args.file_path ?? args.path
      if (typeof raw !== 'string') return 'A native edit must identify its workspace path'
      const path = workspaceRelative(lease.workspaceId, raw)
      if (path === undefined) return `Path escapes the workspace: ${JSON.stringify(raw)} is outside the project root ${lease.workspaceId}`
      try { workspacePath(lease.workspaceId, path) } catch (error) { return String(error) }
      if (state.currentWorkOrder && !pathAllowed(path, state.currentWorkOrder.allowedPaths)) return 'The edit is outside frozen allowedPaths'
    }
    if (isShellTool(exec.name)) {
      const args = exec.arguments as { workdir?: string; run_in_background?: boolean }
      if (args.run_in_background) {
        const issue = this.effects.backgroundProblem(exec)
        if (issue) return issue
      }
      if (args.workdir) {
        const dir = workspaceRelative(lease.workspaceId, args.workdir)
        if (dir === undefined) return `Shell commands run inside the project root ${lease.workspaceId}; workdir ${JSON.stringify(args.workdir)} is outside it. Omit workdir or pass a directory inside the project.`
        try { if (dir) workspacePath(lease.workspaceId, dir) } catch (error) { return String(error) }
      }
      const nested = this.#nestedChecks.get(exec.callId)
      if (role === 'lead' && state.intent === 'DELEGATE' && !this.#runtime(binding.taskId).takeover
        && (!nested || nested.agent !== exec.agent || nested.parent !== exec.parent)) {
        return 'Lead is reviewing; use the native acceptance checks or request takeover'
      }
    }
    return undefined
```

</details>

**依据 2 · 源码核查**：[src/host/native-role-sandbox.ts:73-155](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/native-role-sandbox.ts#L73-L155)

Lead只读与原生检查暂用用户模式

<details>
<summary>查看原文（83行）</summary>

```text
   * Called before every model request of an enforced-v3 role. `writer` is true only while the Lead holds the
   * write lease through a Host-unlocked takeover; it then runs under the user's own mode, like the Sidekick.
   */
  ensure(agent: Agent, binding: SessionBinding, role: Role, writer = false): void {
    const policy = this.#policy
    if (!policy || !roleSeparated(binding)) return
    if (role === 'lead') {
      const saved = this.#intent(binding.sessionId)
      const intent: Intent = saved?.active ? saved
        : { schemaVersion: 1, sessionId: binding.sessionId, mode: policy.resolve({ session: agent.session }).mode, ownSeqs: saved?.ownSeqs ?? [], active: true }
      const target = writer ? intent.mode : 'read-only'
      if (policy.overrideOf(agent.session) !== target) this.#set(agent.session, target, intent)
      this.#save(intent)
      return
    }
    const intent = this.#intent(binding.sessionId)
    if (!intent?.active) throw new Error('Fusion has not recorded the conversation sandbox mode for the Sidekick')
    // The child was seeded with the Lead's read-only override at delegation; give it the user's mode.
    if (policy.overrideOf(agent.session) !== intent.mode) this.#set(agent.session, intent.mode, { ...intent, ownSeqs: [] })
  }

  /** Apply the user's mode to a resident Sidekick immediately. The next request still re-checks through ensure(). */
  #pushSidekickMode(taskId: SessionBinding['taskId'], mode: Mode): void {
    const policy = this.#policy
    if (!policy) return
    const state = this.store.load(taskId)
    const childId = state?.acceptedChild ?? state?.reservedChild
    if (!childId) return
    const child = this.ctx.agents.get(NativeSessionId(childId))
    if (!child || policy.overrideOf(child.session) === mode) return
    try { this.#set(child.session, mode, { schemaVersion: 1, sessionId: child.id, mode, ownSeqs: [], active: true }) }
    catch { /* ensure() applies the same mode on the Sidekick's next request */ }
  }

  /**
   * Frozen acceptance checks are plugin-issued and nested in a Lead tool call, so
   * they would inherit the Lead's read-only session. They run under the user's
   * mode; the Lead's own shell stays refused meanwhile because leadShellProblem
   * requires an actual read-only resolution at execution time.
   */
  async whileChecking<T>(agent: Agent, binding: SessionBinding, run: () => Promise<T>): Promise<T> {
    const policy = this.#policy, intent = this.#intent(binding.sessionId)
    if (!policy || !roleSeparated(binding) || !intent?.active || intent.mode === 'read-only') return run()
    this.#set(agent.session, intent.mode, intent)
    this.#save(intent)
    try { return await run() }
    finally {
      const current = this.#intent(binding.sessionId) ?? intent
      this.#set(agent.session, 'read-only', current)
      this.#save(current)
    }
  }

  /** A Lead shell is allowed only when the Host will actually run it read-only and without escalation. */
  leadShellProblem(exec: Readonly<ToolExecution>): string | undefined {
    const policy = this.#policy
    if (!policy) return 'FUSION_LEAD_READ_ONLY: this Host exposes no sandbox policy, so the Lead cannot run shell commands. Delegate commands to the Sidekick.'
    const args = (exec.arguments ?? {}) as { sandbox_permissions?: unknown }
    if (args.sandbox_permissions !== undefined && args.sandbox_permissions !== null && args.sandbox_permissions !== '') {
      return 'FUSION_LEAD_READ_ONLY: the Lead never escalates its sandbox. Delegate anything that needs to write or run with wider access to the Sidekick with fusion_delegate.'
    }
    if (policy.resolve({ session: exec.agent!.session }).mode !== 'read-only') {
      return 'FUSION_LEAD_READ_ONLY: the Lead shell is not currently confined to read-only; delegate this command to the Sidekick.'
    }
    return undefined
  }

  /** Put the user's own mode back when the conversation leaves Fusion. */
  restore(agent: Agent): void {
    const intent = this.#intent(agent.id), policy = this.#policy
    if (!intent?.active || !policy) return
    if (policy.overrideOf(agent.session) !== intent.mode) this.#set(agent.session, intent.mode, intent)
    this.#save({ ...intent, active: false })
  }

  /** A mode switch the user makes while Fusion is selected becomes the Sidekick's mode; the Lead stays read-only. */
  install(): () => void {
    this.#dispose.push(this.ctx.on('session/event', (session, event) => {
      if (event.type !== 'sandbox/mode' || this.#writing) return
      const binding = this.binding(session.id)
      if (!binding?.selected || !roleSeparated(binding) || binding.sessionId !== session.id) return
      const intent = this.#intent(session.id)
      if (!intent?.active || intent.ownSeqs.includes(event.seq)) return
```

</details>

**依据 3 · 源码核查**：[src/host/native-checks.ts:348-397](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/native-checks.ts#L348-L397)

原生检查真实执行与回执

<details>
<summary>查看原文（50行）</summary>

```text
  ctx: Context; store: SqliteFusionStore; exec: ToolRunContext; root: string; order: WorkOrder;
  nativeTimeout?: boolean; authorizeNested(callId: string): () => void; uncertain?(evidence: ToolEvidence): void
}

/** One frozen command through the native bash tool, recorded as invocation evidence. */
async function invokeCheck(input: CheckInput, check: FrozenCheck) {
  const { ctx, store, exec, root, order } = input
  if (definitionDigest(root, check.definition) !== check.plan.definitionDigest) throw new Error(`Frozen acceptance definition changed: ${check.definition.id}`)
  const before = snapshotWorkspace(root)
  const startedAt = new Date().toISOString()
  const callId = ToolCallId(`fusion-check-${randomUUID()}`)
  const operationId = OperationId(callId)
  const empty = store.putArtifact(order.taskId, Buffer.from(''), 'text/plain')
  const started: ToolEvidence = { schemaVersion: 1, taskId: order.taskId, operationId,
    actor: SessionId(exec.agent!.id), nativeToolCallId: callId,
    argvDigest: check.plan.argvDigest, cwdDigest: check.plan.cwdDigest,
    inputSnapshot: before.id, exitCode: null, startedAt, endedAt: null, stdout: empty, stderr: empty, state: 'started' }
  const key = `check-invocation:${order.taskId}:${callId}`
  store.writeDocument(key, 0, { check, evidence: started })
  const remove = input.authorizeNested(callId)
  let result
  try {
    result = await ctx.tools.execute({ callId, rootCallId: exec.rootCallId, parent: exec.token,
      name: nativeShellTool, arguments: { command: check.definition.command, description: check.definition.description,
        workdir: root, ...(input.nativeTimeout && check.definition.timeoutSeconds === undefined ? {} : { timeoutMs: (check.definition.timeoutSeconds ?? order.policy.commandMaxSeconds) * 1000 }), run_in_background: false },
      agent: exec.agent, signal: exec.signal })
  } catch (error) {
    const evidence: ToolEvidence = { ...started, state: 'outcome-unknown', endedAt: new Date().toISOString(),
      stderr: store.putArtifact(order.taskId, Buffer.from(String(error)), 'text/plain') }
    store.writeDocument(key, 1, { check, evidence })
    input.uncertain?.(evidence)
    throw error
  } finally { remove() }
  for (const context of result.additionalContexts ?? []) exec.deferContext(context)
  const raw = record(result.value)
  const stdout = record(raw?.stdout), stderr = record(raw?.stderr)
  const nativeForeground = !result.isError && raw?.kind === 'foreground'
  const completed = nativeForeground && raw.aborted === false && raw.timedOut === false
    && raw.signal === null && typeof raw.exitCode === 'number'
  const outText = typeof stdout?.text === 'string' ? stdout.text : ''
  const errText = typeof stderr?.text === 'string' ? stderr.text : JSON.stringify(result.content)
  const after = snapshotWorkspace(root)
  const evidence: ToolEvidence = { ...started, outputSnapshot: after.id,
    exitCode: completed ? Number(raw.exitCode) : null, endedAt: new Date().toISOString(),
    stdout: store.putArtifact(order.taskId, Buffer.from(outText), 'text/plain'),
    stderr: store.putArtifact(order.taskId, Buffer.from(errText), 'text/plain'),
    state: completed ? 'completed' : exec.signal.aborted ? 'cancelled' : 'outcome-unknown' }
  return { key, evidence, text: `${outText}\n${errText}`, truncated: Boolean(stdout?.truncated || stderr?.truncated), before, after }
}

```

</details>

**依据 4 · 源码核查**：[src/host/coordinator.ts:1716-1762](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/coordinator.ts#L1716-L1762)

审查绑定与逐要求门槛

<details>
<summary>查看原文（47行）</summary>

```text
  review(agent: Agent, decision: 'accept' | 'rework' | 'needs-decision', reason: string, exec: ToolRunContext,
    verdicts: readonly { index: number; met: boolean; evidence: string }[] = []): string {
    const binding = this.#binding(agent, 'lead'), runtime = this.#runtime(binding.taskId)
    if (this.state(binding.taskId).phase !== 'REVIEWING') throw new Error('Wait for the current Worker report and checks before recording a review')
    // A review is the Lead's product; a stub reason means no review happened (seen live: "placeholder").
    if (!substantiveReview(reason)) throw new Error('Record what you checked: name the requirements, evidence or diff parts behind this decision (at least a sentence). A stub such as "placeholder" is not a review.')
    const proof = nativeReviewProof(this.store, binding.taskId, exec)
    const snapshot = this.#candidate(runtime)
    assertCurrentSubject(this.state(binding.taskId), proof.ticket, snapshot.id)
    if (decision === 'accept' && runtime.verification !== 'verified') throw new Error(`Acceptance checks do not prove completion: ${runtime.verificationReasons?.join('; ')}`)
    if (decision === 'accept') this.#assertRequirementVerdicts(runtime, verdicts)
    if (decision === 'accept' && runtime.changeBase) {
      const unnamed = rewrittenTests(this.store, runtime.taskId, runtime.root, runtime.changeBase, changedPaths(runtime.base, snapshotWorkspace(runtime.root)))
        .filter(item => !reason.includes(item.path))
      if (unnamed.length) throw new Error(`Existing tests lost or changed original lines: ${JSON.stringify(unnamed)}. Confirm each change keeps the old expectation (or is required by the user), and name each file in the accept reason; otherwise send a rework.`)
    }
    const classification = classifyReview({ executionPath: 'fusion_auto', finishReason: proof.finishReason, rawText: JSON.stringify(exec.arguments),
      parsed: { schemaVersion: 1, decision, reason } })
    appendCapturedReviewResult(this.store, binding.taskId, proof.ticket, { requestId: proof.ticket.requestId, terminalEvidenceRef: proof.terminalEvidenceRef, classification })
    const reviewRow = this.store.outbox(binding.taskId).find(row => row.requestId === proof.ticket.requestId)!
    this.store.advanceOutbox(binding.taskId, reviewRow.operationId, reviewRow.state, 'acknowledged')
    if (decision === 'accept') this.append(binding.taskId, 'task/completed', { snapshot: snapshot.id, verification: 'verified' })
    return JSON.stringify({ decision, taskId: binding.taskId, phase: this.state(binding.taskId).phase, verification: this.state(binding.taskId).verification })
  }

  /** Every frozen user requirement needs a met verdict with concrete evidence; spans absent from the diff must be addressed. */
  #assertRequirementVerdicts(runtime: RuntimeRecord, verdicts: readonly { index: number; met: boolean; evidence: string }[]): void {
    const order = this.state(runtime.taskId).currentWorkOrder!
    const requirements = order.constraints.filter(item => item.provenance === 'user')
    if (!requirements.length) return
    const byIndex = new Map(verdicts.map(verdict => [verdict.index, verdict]))
    const problems = requirements.flatMap((item, i) => {
      const verdict = byIndex.get(i + 1)
      if (!verdict) return [`${i + 1}: no verdict`]
      if (!verdict.met) return [`${i + 1}: marked not met`]
      if (verdict.evidence.trim().length < 12) return [`${i + 1}: evidence must name the file/line or test that satisfies it`]
      return []
    })
    const changes = order.mode === 'text' ? [] : changedPaths(runtime.base, snapshotWorkspace(runtime.root))
    for (const { requirement, span } of order.mode === 'text' ? [] : this.#missingSpans(runtime.root, requirements, changes)) {
      if (!byIndex.get(requirement)?.evidence.includes(span)) problems.push(`${requirement}: literal \`${span}\` occurs in no changed file; quote it in the evidence where the candidate satisfies it, or send a rework`)
    }
    if (problems.length) {
      throw new Error(`Accept needs one met verdict per user requirement ({index, met, evidence}). Unresolved: ${problems.join('; ')}. `
        + `Requirements: ${JSON.stringify(requirements.map((item, i) => ({ index: i + 1, text: item.text })))}`)
    }
  }
```

</details>

#### 缺口

- 宿主沙箱真实OS约束和外部工具所有副作用未运行
  **影响**：程序门禁不能单独证明恶意shell不能越过allowedPaths，仍依赖宿主沙箱权限
  **进一步探讨**：在隔离项目注入越界shell、过期snapshot和伪造回执，核拒绝与文件状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些预算与恢复边界会推翻采用？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键反证是预算模式差异：needsBudget只在显式authorizationPath或非model-like时为真，常规model-like不默认启请求预算。即使启用，预算只是requests/output reservation，不是美元上限；设置可把省略上限放到MAX_SAFE_INTEGER和约100年有效，abort不退预留。单写租约只治理Fusion所属Agent，普通会话不受保护；文件编辑限allowedPaths，shell这里只核workdir，不能宣称逐路径OS隔离。零检查会标review-only，用户要求的evidence长度/文字门槛也不能保证语义正确。缓存保活复制原请求加Reply OK、最多11次，丢弃返回内容与工具调用，仍产生真实请求，不保证节省。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-model-fusion.ts:66-96](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/dsh-model-fusion.ts#L66-L96)

常规model-like预算旁路

<details>
<summary>查看原文（31行）</summary>

```text
  const needsBudget = (profile: ResolvedProfile['profile']) => Boolean(config.authorizationPath) || profile.interactionMode !== 'model-like'
  let runtime: FusionCoordinator | undefined
  const effectiveRoutes = (binding: SessionBinding) => profileRoutes({ ...binding.profile,
    lead: runtime?.modelControl.route(binding, 'lead') ?? binding.profile.lead,
    worker: runtime?.modelControl.route(binding, 'worker') ?? binding.profile.worker })
  let creating: Promise<FusionCoordinator> | undefined
  const getRuntime = (frozen?: ResolvedProfile): Promise<FusionCoordinator> => {
    if (runtime) return Promise.resolve(runtime)
    if (creating) return creating
    creating = (async () => {
      const profile = frozen ?? await configuredProfile()
      runtime = new FusionCoordinator(ctx, store, { profile, workerTools: config.workerTools ?? defaultWorkerTools,
        resumeAuthorization: binding => needsBudget(binding.profile) ? budget.check(effectiveRoutes(binding)).authorizationId : 'native-account',
        authorizeRequest: (_agent, binding) => {
          if (!needsBudget(binding.profile)) return
          try { budget.check(effectiveRoutes(binding)) }
          catch (error) {
            const state = store.load(binding.taskId)
            if (state?.control.mode === 'running' && !state.control.budgetBlocked) runtime?.append(binding.taskId, 'budget/blocked', { reason: String(error) })
            throw error
          }
        },
        reserveRequest: (request, binding) => {
          if (!needsBudget(binding.profile)) return
          try { budget.reserve({ provider: request.provider, model: request.model }, request.maxTokens ?? 0) }
          catch (error) {
            const state = store.load(binding.taskId)
            if (state?.control.mode === 'running' && !state.control.budgetBlocked) runtime?.append(binding.taskId, 'budget/blocked', { reason: String(error) })
            throw error
          }
        } })
```

</details>

**依据 2 · 源码核查**：[src/host/native-budget.ts:47-69](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/native-budget.ts#L47-L69)

可选上限与默认近无限

<details>
<summary>查看原文（23行）</summary>

```text

/** Called only by explicit human settings actions (save or limits), never by a model tool. */
export function authorizeConfiguredPair(store: SqliteFusionStore, routes: readonly PhysicalRoute[], limits: unknown): NativeSpendingAuthorization {
  const input = limits as Record<string, unknown> | undefined
  if (!input || input.acknowledgeAccountUsage !== true || input.acknowledgeUnknownCost !== true) throw new Error('请确认使用模型账号额度，以及次数限制并非金额上限')
  // Saving a pair is the user's consent to use those accounts; caps are optional.
  // An omitted cap means none, so ordinary use never stalls on a limit the user did not choose.
  const integer = (key: string, max: number, fallback: number): number => {
    const value = input[key]
    if (value === undefined || value === null) return fallback
    if (!Number.isSafeInteger(value) || Number(value) < 1 || Number(value) > max) throw new Error(`${key} 超出允许范围`)
    return Number(value)
  }
  const auth = nativeAuthorization({ schemaVersion: 1, kind: 'native-fusion-requests', approved: true,
    authorizationId: randomUUID(), approvedBy: 'local-user-settings',
    expiresAt: new Date(Date.now() + integer('validHours', UNLIMITED_HOURS, UNLIMITED_HOURS) * 3600_000).toISOString(), routes,
    maxNativeRequests: integer('maxNativeRequests', Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
    maxReservedOutputTokens: integer('maxReservedOutputTokens', Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER),
    costPolicy: 'unknown-cost-acknowledged' })
  const prior = store.readDocument('settings:authorization')
  store.writeDocument('settings:authorization', prior?.revision ?? 0, auth)
  return auth
}
```

</details>

**依据 3 · 源码核查**：[src/host/workspace-guard.ts:1-17](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/workspace-guard.ts#L1-L17)

只治理Fusion所有Agent

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Workspace write mutual exclusion for agents Fusion owns.
 * Ordinary sessions are not governed: a foreign lease does not make them read-only.
 * `exempt` covers read tools, Fusion's own control tools, and `run_code`.
 * The caller passes the lease for this call's cwd only, so another directory is isolated.
 */
export function workspaceWriterDenial(input: {
  fusionOwned: boolean
  exempt: boolean
  cwd?: string
  leaseHolder?: string
  agentId: string
}): string | undefined {
  if (!input.fusionOwned || input.exempt) return undefined
  if (!input.cwd || !input.leaseHolder || input.leaseHolder === input.agentId) return undefined
  return `Workspace writer is ${input.leaseHolder}; this Agent is read-only`
}
```

</details>

**依据 4 · 源码核查**：[src/host/native-keepalive.ts:176-203](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/native-keepalive.ts#L176-L203)

实际保活请求与最多11次

<details>
<summary>查看原文（28行）</summary>

```text
  async #ping(row: Series): Promise<void> {
    try {
      if (!this.#active(row)) { this.#stop(row, 'inactive'); return }
      const nextDeadline = this.clock.now() + row.intervalMs
      row.record.attempts++; row.record.state = 'inflight'
      if (!this.#persist(row)) return
      const request: GenerateOptions = { ...structuredClone(row.input), maxTokens: 1, signal: row.controller.signal,
        messages: [...structuredClone(row.input.messages), createUserMessage({ content: [{ type: 'text', text: KEEPALIVE_PROMPT }],
          source: { kind: 'plugin:dsh-model-fusion' } })] }
      this.auxiliary.tag(request, { purpose: 'cache-keepalive', taskId: row.record.taskId, sessionId: row.agent.id,
        profileDigest: row.owner.binding.profile.digest, role: row.owner.role, seriesId: row.record.id, iteration: row.record.attempts })
      let success = false
      // Drain only: returned text, reasoning and tool calls never enter a Session
      // or execute. Public llm/stream still applies context, spend and usage hooks.
      for await (const chunk of this.ctx.llm.stream(request)) {
        if (chunk.type === 'finish') success = ['stop', 'max-tokens', 'tool-calls'].includes(chunk.reason.kind)
      }
      if (success) row.record.successes++
      if (row.controller.signal.aborted || this.#series.get(row.agent.id) !== row) { this.#persist(row); return }
      if (!success) { this.#stop(row, 'request-failed'); return }
      if (row.record.attempts >= KEEPALIVE_ATTEMPTS) { this.#stop(row, 'attempt-limit'); return }
      this.#arm(row, nextDeadline)
    } catch {
      this.#stop(row, row.controller.signal.aborted ? 'cancelled' : 'request-failed')
    }
  }

  install(): void {
```

</details>

#### 缺口

- 供应商账单、缓存净收益与未知远端命令是否已停未运行
  **影响**：不能据界面费用估计、取消或进程状态推成硬预算及零残留
  **进一步探讨**：禁用保活起步，设置外部账号限额，保留未知效果并人工核进程后恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎么配置、限制成本并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要Node>=22.14、DSH>=0.2.0-rc.2 <0.2.2及多个Host服务，开发固定0.2.1-rc.5，不从旧rc.6推兼容。设置选择已注册真实Lead/Worker及推理强度，不能创建新适配器；首次准备隔离workspace、明确检查与保护测试。SQLite默认DSH_HOME/plugins/dsh-model-fusion/state.sqlite保存任务/证据，需留存和迁移管理。持续成本包括Lead/Worker、检查命令、返工、压缩与保活，作者等价费用不能替代账单。pause取消父任务、等idle并stopJobs/Worker；存在pending effects不释放租约。恢复禁止把未知结果自动重放，recover要求人工检查说明。离开Fusion恢复原沙箱模式；卸载close取消timer与任务、释放child、仅无pending时释放租约，数据库和项目修改留存，需人工核外部进程与差异后再删数据。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:160-174](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/package.json#L160-L174)

Node和DSH兼容范围

<details>
<summary>查看原文（15行）</summary>

```text
    "@deepseek-ai/dsh-client-ui-tool": ">=0.2.0-rc.2 <0.2.2",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.2.0-rc.2 <0.2.2",
    "@deepseek-ai/dsh-client-store": ">=0.2.0-rc.2 <0.2.2",
    "@deepseek-ai/dsh-agent-default-model": ">=0.2.0-rc.2 <0.2.2",
    "@deepseek-ai/dsh-token-meter": ">=0.2.0-rc.2 <0.2.2",
    "@deepseek-ai/dsh-compaction": ">=0.2.0-rc.2 <0.2.2",
    "@deepseek-ai/dsh-user-approval": ">=0.2.0-rc.2 <0.2.2",
    "@deepseek-ai/dsh-jobs": ">=0.2.0-rc.2 <0.2.2",
    "@deepseek-ai/dsh-agent-preset-registry": ">=0.2.0-rc.2 <0.2.2"
  },
  "scripts": {
    "build": "node scripts/build.mjs",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "link:host": "node scripts/link-host.mjs",
```

</details>

**依据 2 · 源码核查**：[src/dsh-model-fusion.ts:41-48](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/dsh-model-fusion.ts#L41-L48)

数据库位置

```text
export async function apply(ctx: Context, config: Config = {}): Promise<void> {
  const dshHome = process.env.DSH_HOME || join(homedir(), '.dsh')
  const database = config.databasePath || join(dshHome, 'plugins', name, 'state.sqlite')
  if (!isAbsolute(database)) throw new Error('Fusion databasePath must be absolute')
  const store = new SqliteFusionStore(database), bindings = new BindingRepository(store)
  const cachePolicy = new CachePolicy(store)
  backfillHistory(store)
  const budget = new NativeRequestBudget(store, config.authorizationPath)
```

**依据 3 · 源码核查**：[src/host/settings.ts:33-62](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/settings.ts#L33-L62)

真实模型及参数校验

<details>
<summary>查看原文（30行）</summary>

```text
  const raw = value as Record<string, unknown>
  const route = (role: string, candidate: unknown): PhysicalRoute => {
    const item = candidate as Record<string, unknown> | undefined
    if (!item || typeof item.provider !== 'string' || typeof item.model !== 'string') throw new Error(bi(`请选择 ${role} 模型`, `Choose the ${role} model`))
    if (item.provider === FUSION_PROVIDER) throw new Error(bi('Fusion 必须选择真实模型', 'Fusion needs real models, not Fusion itself'))
    const group = catalog.groups.find(group => group.id === item.provider)
    const model = group?.models.find(model => model.id === item.model)
    if (!model) throw new Error(bi(`${role} 模型已不可用，请刷新后重选`, `The ${role} model is no longer available; refresh and choose again`))
    if (item.reasoningEffort !== undefined && (typeof item.reasoningEffort !== 'string'
      || !model.reasoning?.efforts.some(effort => effort.id === item.reasoningEffort))) {
      throw new Error(bi(`${role} 不支持所选推理强度`, `${role} does not support the selected reasoning level`))
    }
    return { provider: item.provider, model: item.model,
      ...(item.reasoningEffort === undefined ? {} : { reasoningEffort: item.reasoningEffort as string }) }
  }
  const cacheKeepalive = keepaliveChoice(raw.cacheKeepalive)
  const compactor = compactorChoice(raw.compactor)
  let outputTokens: PairChoice['outputTokens']
  if (raw.outputTokens !== undefined) {
    const value = raw.outputTokens
    if (!value || typeof value !== 'object' || Array.isArray(value)
      || Object.entries(value).some(([role, tokens]) => !['lead', 'worker'].includes(role)
        || !Number.isSafeInteger(tokens) || Number(tokens) < 1 || Number(tokens) > 128_000)) {
      throw new Error(bi('每次响应上限必须是 1–128000 的整数 Token 数', 'The per-response limit must be an integer of 1–128000 tokens'))
    }
    outputTokens = { ...value } as PairChoice['outputTokens']
  }
  return { lead: route('lead', raw.lead), worker: route('worker', raw.worker),
    ...(outputTokens === undefined ? {} : { outputTokens }),
    ...(cacheKeepalive === undefined ? {} : { cacheKeepalive }),
```

</details>

**依据 4 · 源码核查**：[src/host/coordinator.ts:1764-1827](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/coordinator.ts#L1764-L1827)

暂停与人工恢复

<details>
<summary>查看原文（64行）</summary>

```text
  async pause(agent: Agent): Promise<void> {
    const binding = this.bindings.read(agent.id)?.binding
    if (!binding?.selected) throw new Error('Fusion is not selected')
    if (this.state(binding.taskId).control.mode === 'completed') return
    this.append(binding.taskId, 'task/stop-requested', { intent: 'pause' })
    const auxiliaryStopped = this.keepalive.stopTask(binding.taskId, 'pause')
    agent.cancel({ kind: 'user' }, { keepInbox: true })
    await agent.whenIdle()
    await this.#backgroundStops.get(binding.taskId)
    const state = this.state(binding.taskId)
    const child = (state.acceptedChild ?? state.reservedChild) && this.ctx.agents.get(NativeSessionId((state.acceptedChild ?? state.reservedChild)!))
    await this.#stopJobs(binding.taskId, child ? () => this.transport.stop(agent, child.id) : undefined)
    if (!this.effects.pending(binding.taskId).length) {
      this.#release(binding.taskId)
      if (this.store.readDocument(`runtime:${binding.taskId}`)) this.#saveRuntime({ ...this.#runtime(binding.taskId), background: false })
    }
    if (this.state(binding.taskId).control.mode !== 'paused') this.append(binding.taskId, 'task/paused', { reason: 'User paused Fusion' })
    await auxiliaryStopped
    // Stopping a continuable child can wake its parent with a settlement
    // notice. Drain that wake under the paused gate before returning control.
    await agent.whenIdle()
    await this.activity.flush()
  }

  async resume(agent: Agent, authorizationId: string): Promise<void> {
    const binding = this.bindings.read(agent.id)?.binding
    if (!binding?.selected) throw new Error('Fusion is not selected')
    await this.keepalive.stopTask(binding.taskId, 'resume')
    await this.#backgroundStops.get(binding.taskId)
    await agent.whenIdle()
    await agent.runMaintenance(async () => {
      const state = this.state(binding.taskId)
      if (this.#trackingErrors.has(binding.taskId) || state.control.recovering || state.control.outcomeUnknown) throw new Error('Review the interrupted effects and use /fusion recover <inspection note>')
      // Official module HMR can initialize the next generation while the old
      // one is still draining its Agent-owned tools. Retry that failed partial
      // scope only under explicit, quiescent resume, and retain the pause if
      // registration is still unavailable.
      if (this.#installErrors.has(agent.id)) {
        this.scopes.detach(agent)
        this.#attachKnown(agent)
        const failed = this.#installErrors.get(agent.id)
        if (failed) throw new Error(`Fusion Agent scope could not be restored: ${failed}`)
      }
      if (state.control.budgetBlocked) this.append(binding.taskId, 'budget/unblocked', { authorizationId })
      if (this.state(binding.taskId).control.mode === 'paused') this.append(binding.taskId, 'task/resumed', { reason: 'User resumed the native Fusion task' })
      this.#clearWorkerFailure(binding.taskId)
    })
  }

  /** Human command only. Never exposed as an LLM tool or triggered by a dead PID alone. */
  async reconcile(agent: Agent, inspection: { commandId: string; note: string; effectsStopped?: boolean }): Promise<void> {
    const binding = this.bindings.read(agent.id)?.binding
    if (!binding?.selected || inspection.note.trim().length < 12 || !inspection.commandId) throw new Error('Record what interrupted file/process effects you inspected; no automatic replay is performed')
    await this.keepalive.stopTask(binding.taskId, 'reconcile')
    await this.#backgroundStops.get(binding.taskId)
    await agent.whenIdle()
    await agent.runMaintenance(async () => {
      const state = this.state(binding.taskId)
      this.effects.assertInspection(binding.taskId, inspection.effectsStopped === true)
      // Context work can start before the first delegation or direct tool.
      // Only that pre-execution state may legitimately have no runtime record.
      const recorded = this.store.readDocument(`runtime:${binding.taskId}`)
      if (!recorded && (binding.profile.interactionMode === 'model-like' ? state.currentWorkOrder || state.acceptedChild || state.reservedChild : state.intent || state.currentWorkOrder || state.lease || state.acceptedChild || state.reservedChild)) {
        throw new Error('Fusion execution state is missing its runtime record; inspect the damaged store before recovery')
```

</details>

**依据 5 · 源码核查**：[src/host/coordinator.ts:2043-2076](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/coordinator.ts#L2043-L2076)

关闭与pending效果边界

<details>
<summary>查看原文（34行）</summary>

```text
  async close(): Promise<void> {
    this.#statusAbort.abort()
    await this.modelControl.close()
    this.#closing = true
    const auxiliaryStopped = this.keepalive.close()
    for (const binding of this.bindings.selected()) {
      const parent = this.ctx.agents.get(NativeSessionId(binding.sessionId))
      if (!parent) continue
      if (parent.status !== 'idle') parent.cancel({ kind: 'hook', reason: 'Fusion runtime is unloading' }, { keepInbox: true })
      await parent.whenIdle()
      await this.#backgroundStops.get(binding.taskId)
      const state = this.state(binding.taskId)
      // 0.2.1 delivers subagent-settled when release disposes the child, and that
      // wake can run #stopBackground before the replacement scan. Record the
      // gate while `runtime.background` is still the authority for an in-flight handoff.
      const background = (this.store.readDocument(`runtime:${binding.taskId}`)?.value as { background?: boolean } | undefined)?.background
      if (background && state.control.mode !== 'completed' && !state.control.recovering) {
        this.append(binding.taskId, 'recovery/needed', { reason: 'Host runtime was replaced during a background handoff' })
      }
      const workerId = binding.workerId ?? state.acceptedChild
      const child = workerId && this.ctx.agents.get(NativeSessionId(workerId))
      await this.#stopJobs(binding.taskId)
      if (child) { await this.transport.release(parent, child.id); this.scopes.detach(child) }
      if (!this.effects.pending(binding.taskId).length) this.#release(binding.taskId)
      // Releasing the child may have queued a final native settlement notice.
      await parent.whenIdle()
      this.scopes.detach(parent)
    }
    await Promise.all(this.#backgroundStops.values())
    await auxiliaryStopped
    await this.activity.close()
    for (const dispose of this.#dispose.reverse()) dispose()
  }
}
```

</details>

#### 缺口

- 本轮未安装宿主、跑检查或验证热重载退出，真实部署/恢复耗时未知
  **影响**：无法给出上线容量或承诺暂停立即阻断外部副作用
  **进一步探讨**：用无外部副作用的小仓先测试完成、额度不足、取消、重启与人工恢复，再扩大

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 双模型编排怎样证伪节省且不损质量？

**研究主题**：新假设与验证

#### 完整回答

固定模型对、价格口径、项目和验收，比较单Lead、手工Lead+Worker及Fusion。独立盲评功能/回归，不以插件verified代替外部验收；记录账号实费、请求数、保活/压缩、总时延与人工审查。加入旧测试失败、测试改写、遗漏字面要求、shell越界、未知命令及模型配额中止。若低价Worker引发更多Lead返工、保活加费、未过验收被accept或恢复重放副作用，则停用该组合，回单模型与人工review；这是待验证方向，不计入当前收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/coordinator.ts:1660-1707](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/coordinator.ts#L1660-L1707)

自动一次检查返工与测试改写提示

<details>
<summary>查看原文（48行）</summary>

```text
      .map(receipt => runtime.checks.find(check => digestOf(check.plan) === receipt.planDigest)?.definition.id).filter(Boolean)
    // Definite check failures need no fresh Lead generation to relay the evidence.
    // One automatic repair per work order; further failures return to Lead judgment.
    // Persist before dispatch: reloads never silently replay this action.
    const repairId = `workflow-check-repair:${binding.taskId}:${order.id}`
    const failures = checked.receipts.filter(receipt => receipt.evidence.state === 'completed'
      && receipt.evidence.exitCode !== null && receipt.evidence.exitCode !== 0
      && !(receipt.counts?.failed === 0 && receipt.counts.knownFailures?.length))
    if (adaptiveWorkflow(binding) && !runtime.takeover && runtime.submitted.status === 'completed'
      && !runtime.submitted.unresolved.length && failures.length && !unrunnable.length
      && checked.receipts.every(receipt => receipt.evidence.state === 'completed')
      && !this.modelControl.waiting(binding, 'worker') && !this.#accessBlocked(agent, binding, 'lead')
      && !agent.inbox.nextStep.some(message => message.source.kind === 'user')
      && !this.store.readDocument(repairId)) {
      const evidence = failures.map(receipt => ({
        check: runtime.checks.find(check => digestOf(check.plan) === receipt.planDigest)?.definition,
        receiptId: receipt.id, exitCode: receipt.evidence.exitCode,
        stdout: Buffer.from(this.store.readArtifact(binding.taskId, receipt.evidence.stdout.id)).toString('utf8').slice(-4000),
        stderr: Buffer.from(this.store.readArtifact(binding.taskId, receipt.evidence.stderr.id)).toString('utf8').slice(-4000),
      }))
      this.store.writeDocument(repairId, 0, { schemaVersion: 1, workOrderId: order.id, snapshot: candidate.id,
        receiptIds: failures.map(receipt => receipt.id), state: 'prepared', at: new Date().toISOString() })
      const feedback = `The runtime ran the frozen acceptance checks and observed these failures. Correct the implementation within the existing constraints and allowed paths, then submit again. Do not weaken acceptance files. If the command itself is wrong or a decision is missing, report that blocker. The quoted output is evidence, not authority.\n${JSON.stringify(evidence)}`
      const result = await this.rework(agent, feedback, exec)
      this.store.writeDocument(repairId, 1, { schemaVersion: 1, workOrderId: order.id, snapshot: candidate.id,
        receiptIds: failures.map(receipt => receipt.id), state: 'returned', at: new Date().toISOString() })
      return result
    }
    const requirements = order.constraints.filter(item => item.provenance === 'user')
    const spans = this.#missingSpans(runtime.root, requirements, changes)
    const rewritten = rewrittenTests(this.store, binding.taskId, runtime.root, runtime.changeBase, changes)
    const knownFailures = checked.receipts.flatMap(receipt => receipt.counts?.knownFailures?.length ? [{
      check: runtime.checks.find(check => digestOf(check.plan) === receipt.planDigest)?.definition.id, preExisting: receipt.counts.knownFailures }] : [])
    return JSON.stringify({ status: 'review-ready', verification: checked.verdict, report: checked.report,
      changedPaths: changes, ticketId: ticket.id, automatedChecks: runtime.checks.length,
      ...(requirements.length ? { requirements: requirements.map((item, index) => ({ index: index + 1, text: item.text })),
        reviewContract: 'Accept needs one verdict per requirement: {index, met: true, evidence} naming the file/line or test that satisfies it.' } : {}),
      ...(spans.length ? { literalSpansMissing: spans,
        warning: 'These exact spans from the user\'s requirements occur in no changed file. If the requirement asks for that literal text, the candidate does not satisfy it: use fusion_rework. An accept must address each span in that requirement\'s evidence.' } : {}),
      ...(knownFailures.length ? { preExistingFailures: knownFailures } : {}),
      ...(rewritten.length ? { rewrittenTests: rewritten,
        testWarning: 'Existing tests lost or changed original lines. Check that the change extends them rather than rewriting an old expectation to fit the new behaviour; an accept must name each file in its reason.' } : {}),
      ...(runtime.checks.length ? {} : { reviewOnly: 'No automated acceptance check ran for this work order. Your review of the diff is the only verification; say so plainly in the final answer.' }),
      ...(unrunnable.length ? { checkDefinitionProblem: {
        checks: unrunnable, reason: 'The acceptance command could not execute on this host (program not found or not executable)',
        next: 'This is not a code defect. After recording the review, correct the command with fusion_rework checks, keeping every protected definition path.' } } : {}),
      next: 'Inspect relevant changes and evidence. Record fusion_review_result; use fusion_rework for corrections.' })
  }
```

</details>

**依据 2 · 源码核查**：[src/host/native-budget.ts:112-112](https://github.com/aa2246740/dsh-model-fusion/blob/8f97428754cd950a2aa8abf31e36d1409264cb9e/src/host/native-budget.ts#L112-L112)

请求预留不是账单

```text
}
```

#### 缺口

- 没有本轮独立对照与真实账单
  **影响**：不能断言该机制降低成本或提高任务成功
  **进一步探讨**：保留同任务最终diff、验收原输出、费用和取消日志，按失败条件停用

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
