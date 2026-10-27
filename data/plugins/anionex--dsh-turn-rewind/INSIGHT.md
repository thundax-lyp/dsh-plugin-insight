# DSH Turn Rewind

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[737d716](https://github.com/Anionex/dsh-turn-rewind/tree/737d716c5f693f96eb2adc3e9a79f4e55cda8735)

<!-- BEGIN META -->
[![GitHub ★ 138](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=138&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Anionex/dsh-turn-rewind) [![npm 30d 4,502](https://img.shields.io/static/v1?label=npm+30d&message=4%2C502&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind)
<!-- END META -->

> **实现功能**：为DSH消息提供文件检查点、变更预览、选择恢复及会话重新开始。

> **核心亮点**：依据 [Q02](#research-q02) 和 [Q03](#research-q03)，它把消息锚点、短期会话计划、写前救援与恢复后校验串成持久生命周期。相对手工提交再分别重开对话，增量是两个状态的显式编排以及路径级防过期检查；普通目录CAS与Git对象复用均为既有技术的组合，不宣称原创。该贡献成立于所需路径确实被捕获、存储可用且用户能核对计划时，不能外推成环境级事务回滚或保证节时。

> **风险与缺陷**：[Q04](#research-q04)指出检查点管理集合小于整个工作环境，超限跳过文案与安全契约不一致，外部状态和忽略路径也不会回退。救援和journal是可核查保护而非绝对保证，恢复与回滚可能同时失败；试用应先检查覆盖清单和独立备份，否则“回到请求前”的心理模型会超过机制承诺。

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
  - [Q01 · 消息锚定恢复对哪类开发任务有价值，文件与会话怎样验收？](#detail-section-11)
  - [Q02 · 恢复计划如何绑定会话并避免预览之后覆盖新修改？](#detail-section-12)
  - [Q03 · 相比手工git提交与复制目录，增量是否超出入口包装？](#detail-section-13)
  - [Q04 · 哪些未覆盖路径会使“回到请求之前”这一理解不成立？](#detail-section-14)
  - [Q05 · 哪些宿主与存储条件决定捕获和恢复能否启用？](#detail-section-15)
  - [Q06 · 恢复安全链路带来哪些首次、持续与异常成本？](#detail-section-16)
  - [Q07 · 引擎哪些保护设计可复用，主要维护代价在哪里？](#detail-section-17)
  - [Q08 · 能否把“已捕获范围”作为恢复前的可验证覆盖契约？](#detail-section-18)
  - [Q09 · 应如何限定试用和停止条件？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在一个工作目录中连续让Agent改文件、又需要撤回某次请求的开发者。合格结果是恢复该消息前被管理路径的内容，并可新建截至前一轮的会话；原会话保留。简单办法是事前手工提交或复制目录，再分别重开对话。作者用消息按钮减少两类状态人工对齐，但这不等于数据库、外部服务或忽略文件也被恢复。

核心增量是把请求锚点、路径级计划、救援点和失败恢复组合成一个生命周期，且普通目录有独立内容寻址存储。相对手工git reset，它避免把Git索引与分支回退混入文件恢复；相对复制目录，可选择路径并检查预览过期。该贡献是恢复编排与保护机制的实质组合，不是版本控制原创。只关心已提交代码且熟悉Git的用户，手工restore可能已经足够。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 检查点 | 保留消息前文件状态 | Git工作树或普通目录；排除文件不托管 |
| 恢复预览与选择写回 | 恢复受管理路径 | 需有效会话计划和救援点空间 |
| 消息重新开始 | 保留源会话并新建会话 | 不等同于外部状态回滚 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Agent | 自动捕获必需 | 逐轮检查点 | 不能保证消息有检查点 |
| Web及会话服务 | 按钮必需 | 预览与分叉 | 仅服务API不等同按钮可用 |
| 独立可写存储与空间 | 必需 | 快照和救援 | 初始化或恢复失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户加载profile并重启 | 服务初始化成功 |
| 2 | Agent前置捕获 | 消息具备检查点，否则只分叉 |
| 3 | 用户审阅路径并恢复 | 写回校验通过，失败保留救援 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 磁盘与宿主资源，金额未知 | 安装重启与范围核对，耗时未知 | 存储须分离 |
| 持续 | 每轮捕获及对象保留 | 检查跳过路径 | 速度未复测 |
| 失败恢复 | 额外救援点空间 | 核对日志与恢复文件 | 双重失败仍需人工 |
| 退出 | 保留当前文件和历史存储 | 清理前处理未完成操作 | 不删除未恢复日志 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文件恢复 | 计划绑定、救援、写回校验存在 | 断电与竞争下完成率 |
| 请求重新开始 | 作者定义新建/分叉流程 | 同版本宿主效果 |
| 降低耗时 | 作者报告缓存加速 | 同任务节时与I/O |

> **思考**：[Q04](#research-q04)指出检查点管理集合小于整个工作环境，超限跳过文案与安全契约不一致，外部状态和忽略路径也不会回退。救援和journal是可核查保护而非绝对保证，恢复与回滚可能同时失败；试用应先检查覆盖清单和独立备份，否则“回到请求前”的心理模型会超过机制承诺。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：依据 [Q02](#research-q02) 和 [Q03](#research-q03)，它把消息锚点、短期会话计划、写前救援与恢复后校验串成持久生命周期。相对手工提交再分别重开对话，增量是两个状态的显式编排以及路径级防过期检查；普通目录CAS与Git对象复用均为既有技术的组合，不宣称原创。该贡献成立于所需路径确实被捕获、存储可用且用户能核对计划时，不能外推成环境级事务回滚或保证节时。

依据 [Q02](#research-q02) 和 [Q03](#research-q03)，它把消息锚点、短期会话计划、写前救援与恢复后校验串成持久生命周期。相对手工提交再分别重开对话，增量是两个状态的显式编排以及路径级防过期检查；普通目录CAS与Git对象复用均为既有技术的组合，不宣称原创。该贡献成立于所需路径确实被捕获、存储可用且用户能核对计划时，不能外推成环境级事务回滚或保证节时。

可借鉴的是把计划批准、变更前快照、写回校验和恢复日志分开，而非直接在UI点击中执行覆盖。引擎与Cordis服务隔离，其他插件可消费changeLedger；移植需要重做workspace身份、路径安全、锁与宿主会话边界。代码显式处理回滚失败并留可恢复状态，比吞错更可审计；但保护分支多且依赖文件系统语义，源码审阅无法证明竞争场景完备。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04)指出检查点管理集合小于整个工作环境，超限跳过文案与安全契约不一致，外部状态和忽略路径也不会回退。救援和journal是可核查保护而非绝对保证，恢复与回滚可能同时失败；试用应先检查覆盖清单和独立备份，否则“回到请求前”的心理模型会超过机制承诺。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合经常需要撤销Agent文件修改且愿意核对路径的开发者，在可丢弃副本中先做一次“文件恢复+消息新建”，对照受管理路径内容与原会话。只有预览范围、救援点和原有Git状态都符合预期才扩大使用；发现缺检查点、范围遗漏或回滚错误时停止写回，保留journal与rescue，以独立备份或手工Git恢复接管。不用于外部数据库或未纳管文件的整体事务回滚。 依据 [Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前贡献由固定源码支持并含解释判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/engine.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定提交源码、README、配置与相关测试定义；未安装或执行目标代码，未进行真实宿主验收。
- 下一步：未验证假设是给每个消息检查点生成覆盖契约，列出管理、跳过及无法恢复路径，并在恢复前将当前任务涉及路径与它对比。由超限跳过和排除项推得，显式覆盖差集可能减少“以为全恢复”的误用。最小验证是在同一目录分别加入超大文件、忽略配置和普通源码，对照现有预览及带覆盖差集预览，记录用户是否正确识别未恢复项；若误判无减少或提示淹没核心变化，则否定增加该层的价值。此设计未实现，也不计入当前贡献。

**分析版本**

- **仓库**：[Anionex/dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind)
- **版本号**：0.3.11（[固定提交 737d716](https://github.com/Anionex/dsh-turn-rewind/tree/737d716c5f693f96eb2adc3e9a79f4e55cda8735)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08)提出未验证的检查点覆盖差集契约，先将任务涉及路径与已管理、跳过和排除项对照，再允许用户明确选择恢复。它由超大文件跳过及非托管路径限制推导，相对现有变更预览增加的是“本次不能恢复什么”。在同目录放入普通、忽略及超大文件，对照两种预览下用户识别未恢复路径的正确率和操作时间；若误判率不下降或额外负担抵消收益，则否定此设计价值，不计为当前插件能力。

未验证假设是给每个消息检查点生成覆盖契约，列出管理、跳过及无法恢复路径，并在恢复前将当前任务涉及路径与它对比。由超限跳过和排除项推得，显式覆盖差集可能减少“以为全恢复”的误用。最小验证是在同一目录分别加入超大文件、忽略配置和普通源码，对照现有预览及带覆盖差集预览，记录用户是否正确识别未恢复项；若误判无减少或提示淹没核心变化，则否定增加该层的价值。此设计未实现，也不计入当前贡献。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 1053 | — | — | 12401 |
| .js | source | 17 | 7754 | 7238 | 516 | — |
| .mjs | source | 2 | 167 | 156 | 2 | — |
| .tsx | source | 1 | 1950 | 1661 | 191 | — |
| .ts | source | 16 | 7712 | 6758 | 487 | — |
| .mjs | test | 6 | 4630 | 4208 | 102 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Anionex/dsh-turn-rewind/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Anionex/dsh-turn-rewind/issues?q=is%3Aissue+created%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Anionex/dsh-turn-rewind/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本判断DSH Turn Rewind的贡献、关键质疑与可控采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 消息锚定恢复对哪类开发任务有价值，文件与会话怎样验收？

**研究主题**：场景与需求

#### 完整回答

适合在一个工作目录中连续让Agent改文件、又需要撤回某次请求的开发者。合格结果是恢复该消息前被管理路径的内容，并可新建截至前一轮的会话；原会话保留。简单办法是事前手工提交或复制目录，再分别重开对话。作者用消息按钮减少两类状态人工对齐，但这不等于数据库、外部服务或忽略文件也被恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:129-143](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/README.md#L129-L143)

三种模式分离文件状态与会话分叉，是任务及合格结果依据

<details>
<summary>查看原文（15行）</summary>

```text
## User flow

In the Web profile, each direct user message gains a compact, icon-only **Rewind** action after its timestamp and native Copy control. The tooltip reads “Return to before sending this message.” Opening Rewind checks the saved file state, shows a concise preview with a “view all files” action, and offers three modes:

| Mode | Code | Conversation |
| --- | --- | --- |
| **Restore files and restart** (default when files changed) | Restores the project files after automatically backing up their current state. | Creates and opens a Session ending before the selected message, then puts that message's text back in the composer. |
| **Restore files only** | Restores the project files after automatically backing up their current state. | Leaves the current Session open and unchanged. |
| **Rewind messages only** (default when no checkpoint or no file changes) | Leaves the project files exactly as they are. | Creates and opens a Session ending before the selected message, then puts that message's text back in the composer. |

The dialog itself is the confirmation: there is no duplicate checkbox. It describes each file as restoring an earlier version, finding a deleted file, removing a later-added file, or restoring permissions/type. **Rewind messages only** is always available — including when the checkpoint for that message is missing, was skipped (for example after disabling automatic checkpoints), or the project files already match the saved state — because it never touches the worktree. It is not blocked by other running Agents in the same worktree.

Before mutation, Turn Rewind rechecks the selected files and repository state, then creates an automatic backup. Changes made after preview invalidate the operation. Any running Agent using the same worktree, including the source Session, blocks restoration; idle Sessions do not block. A reviewed HEAD or branch difference does not block restoration: commits, refs, branch, and index remain unchanged, so restored content may appear as ordinary uncommitted changes against the current HEAD. An in-progress Git operation still blocks. If child creation fails after “restore and restart,” Change Ledger automatically restores the pre-operation files from the backup.

DSH Session logs are append-only, so “restart” creates a new Session instead of truncating the original. For the first message, the Host creates a blank Session in the same working directory; for later messages, it forks at the previous completed `turn/end`. A child may reuse an ancestor's prompt checkpoint only while both the selected `user/message` and its exact `turn/start` remain inside every durable `seedLength` fence. Direct child checkpoints take priority and sibling checkpoints never mix. **Turn Rewind** always treats the two dimensions independently: the two restore modes change project files (optionally followed by a new conversation), while **Rewind messages only** reuses the same fork lifecycle without touching files. The original Session is always retained.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 恢复计划如何绑定会话并避免预览之后覆盖新修改？

**研究主题**：功能与机制

#### 完整回答

ChangeLedgerService提供引擎并在agents可用时安装检查点协调器，Web服务依赖齐备后才挂路由。applyRestore先查短期计划、精确确认串和sessionId，再独占workspace锁并重捕当前树；版本身份、计划新鲜度和未托管冲突逐项核对。救援点落盘后才restorePaths并verifyPaths；失败时以救援点恢复并校验。源码支持持久恢复生命周期，而非仅显示diff；外部并发文件写入仍需具体竞争实验。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:59-81](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/src/index.ts#L59-L81)

service与条件路由安装

<details>
<summary>查看原文（23行）</summary>

```text
  constructor(ctx: Context, config: ChangeLedgerConfig = {}) {
    const normalized = unwrapVolatileConfig(config)
    ctx.provide('changeLedger', this)
    this.engine = new ChangeLedgerEngine(normalized)
    const checkpoints = new TurnCheckpointCoordinator(this.engine)
    ctx.logger.info(`[turn-rewind] v${pluginVersion()} active; workspace modes: git worktree, ordinary directory`)
    ctx.inject(['agents'], (scope: Context) => { checkpoints.install(scope) })
    // `apiProxy` is deliberately absent: DSH 0.1.2-alpha carriers (DSH Desktop 2.x)
    // provide `sessionController` instead, and the route must exist on both.
    ctx.inject(['webServer', 'sessions', 'sessionQuery', 'agents'], (scope: Context) => {
      installRewindHttp(scope, this.engine, checkpoints)
      installManageHttp(scope, this.engine)
    })
    installTurnRewindSettings(ctx, normalized, this.engine)
    void this.engine.initialize().then((reconciled) => {
      if (reconciled > 0) {
        ctx.logger.warn(`[change-ledger] reconciled ${reconciled} interrupted durable operation(s)`)
      } else {
        ctx.logger.info(`[change-ledger] ready; state=${this.engine.config.storageDir}`)
      }
    }).catch((error: unknown) => {
      ctx.logger.error(`[change-ledger] startup failed: ${error instanceof Error ? error.message : String(error)}`)
    })
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:624-688](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/src/engine.ts#L624-L688)

计划绑定、再检查、救援点和恢复校验

<details>
<summary>查看原文（65行）</summary>

```text
    await this.ready
    this.expirePlans()
    const plan = this.plans.get(options.planId)
    if (plan === undefined) throw new ChangeLedgerError('PLAN_NOT_FOUND', `restore plan ${options.planId} is absent or expired`)
    if (plan.confirmation !== options.confirmation) {
      throw new ChangeLedgerError('CONFIRMATION_MISMATCH', 'confirmation does not exactly match the restore plan')
    }
    if (plan.sessionId !== undefined && plan.sessionId !== options.sessionId) {
      throw new ChangeLedgerError('SESSION_MISMATCH', 'restore plan belongs to a different DSH session')
    }
    if (this.activePlans.has(plan.id)) {
      throw new ChangeLedgerError('PLAN_IN_PROGRESS', `restore plan ${plan.id} is already being applied`)
    }
    this.activePlans.add(plan.id)

    try {
      await this.assertStorageSeparated(plan.workspace)
      const release = await this.acquireWorkspace(plan.repository, options.signal)
      try {
        const manifest = await this.store.readManifest(plan.workspace, plan.restorePointId)
        if (manifest.version === 2) await verifyGitCheckpoint(manifest, options.signal)
        const current = await captureStableTree({ cwd: plan.workspace, config: this.config, ...(options.signal === undefined ? {} : { signal: options.signal }) })
        assertRepositoryCompatible(manifest, current.source.state, plan.allowHeadChange)
        assertPlanRepositoryFresh(plan.repository, current.source.state)
        assertPlanFresh(plan, current.entries)
        await assertNoUnmanagedRestoreConflicts(plan.workspace, manifest.entries, current.entries, plan.paths)

        const rescue = await this.createLocked({
          cwd: plan.workspace,
          kind: 'rescue',
          label: `Before restoring ${manifest.id}`,
          parentRestorePoint: manifest.id,
          ...(options.sessionId === undefined ? {} : { sessionId: options.sessionId }),
          ...(options.signal === undefined ? {} : { signal: options.signal }),
        })
        try {
          assertPlanFresh(plan, rescue.entries)
          await assertNoUnmanagedRestoreConflicts(plan.workspace, manifest.entries, rescue.entries, plan.paths)
        } catch (error) {
          await this.store.deleteManifest(plan.workspace, rescue.id)
          await this.store.collectGarbage(plan.workspace)
          throw error
        }
        const operation: RestoreOperation = {
          version: LEDGER_FORMAT_VERSION,
          id: makeId('op'),
          workspace: plan.workspace,
          restorePointId: manifest.id,
          rescuePointId: rescue.id,
          ...(options.sessionId === undefined ? {} : { sessionId: options.sessionId }),
          paths: plan.paths,
          startedAt: Date.now(),
          state: 'running',
        }
        await this.store.writeOperation(operation)

        try {
          await this.restorePaths(plan.workspace, manifest.entries, plan.paths, options.signal, plan.expected)
          await this.verifyPaths(
            plan.workspace,
            manifest.entries,
            plan.paths,
            options.signal,
            manifest.version === 2 ? manifest.git.objectFormat : undefined,
          )
```

</details>

#### 缺口

- 外部进程在捕获和恢复期间并发改同一路径的完整竞争覆盖未知
  **影响**：新鲜度和锁机制不保证所有非协作写入都被阻止
  **进一步探讨**：在可丢弃目录控制写入阶段，与计划过期及恢复后文件hash对照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比手工git提交与复制目录，增量是否超出入口包装？

**研究主题**：贡献与相对优势

#### 完整回答

核心增量是把请求锚点、路径级计划、救援点和失败恢复组合成一个生命周期，且普通目录有独立内容寻址存储。相对手工git reset，它避免把Git索引与分支回退混入文件恢复；相对复制目录，可选择路径并检查预览过期。该贡献是恢复编排与保护机制的实质组合，不是版本控制原创。只关心已提交代码且熟悉Git的用户，手工restore可能已经足够。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:51-76](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/README.md#L51-L76)

作者定义持久生命周期与控制面边界

<details>
<summary>查看原文（26行）</summary>

```text
## Why it has a Change Ledger engine

A diff button can show current changes, but it does not own a durable restore lifecycle. Change Ledger owns:

- content-addressed restore-point manifests;
- Git worktree, HEAD, branch, and in-progress-operation fences;
- stale-plan detection between review and mutation;
- exact two-step confirmation plus DSH human approval;
- automatic pre-restore rescue points;
- post-restore hash verification;
- rollback after a failed restore;
- startup reconciliation of interrupted restore journals;
- a public `ctx.changeLedger` service that other plugins can consume.

The durable format is documented in [docs/FORMAT.md](docs/FORMAT.md). The security and failure model is documented in [SECURITY.md](SECURITY.md).

## Safety contract

- **Explicit only:** nothing is restored automatically — every restore starts from the user pressing the final button in the Web dialog, or from an explicit call through the service API.
- **Read before write:** the dialog preview generates an expiring, session-bound plan from the current tree and changes no files.
- **Human gate:** the dialog's reviewed impact plus the final restore button is the human decision; direct mutation requests without a live session-bound plan pair fail closed.
- **Rescue before mutation:** every restore captures the current eligible tree as a durable rescue point before changing a path.
- **No silent omission:** unsupported submodules, sparse checkouts, oversized files, aggregate limits, and unsupported file types fail point creation.
- **No path escape:** every durable path is canonical and workspace-relative; restore refuses symlink parents and non-empty directory replacement.
- **No stale overwrite:** selected paths and the reviewed HEAD/branch/operation fence are checked again at apply time. Any relevant post-review change invalidates the plan.
- **No Git control-plane mutation:** the index, branch, HEAD, stash, and commits remain untouched.
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:639-701](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/src/engine.ts#L639-L701)

真实实现救援与校验，不仅是说明文档

<details>
<summary>查看原文（63行）</summary>

```text
    try {
      await this.assertStorageSeparated(plan.workspace)
      const release = await this.acquireWorkspace(plan.repository, options.signal)
      try {
        const manifest = await this.store.readManifest(plan.workspace, plan.restorePointId)
        if (manifest.version === 2) await verifyGitCheckpoint(manifest, options.signal)
        const current = await captureStableTree({ cwd: plan.workspace, config: this.config, ...(options.signal === undefined ? {} : { signal: options.signal }) })
        assertRepositoryCompatible(manifest, current.source.state, plan.allowHeadChange)
        assertPlanRepositoryFresh(plan.repository, current.source.state)
        assertPlanFresh(plan, current.entries)
        await assertNoUnmanagedRestoreConflicts(plan.workspace, manifest.entries, current.entries, plan.paths)

        const rescue = await this.createLocked({
          cwd: plan.workspace,
          kind: 'rescue',
          label: `Before restoring ${manifest.id}`,
          parentRestorePoint: manifest.id,
          ...(options.sessionId === undefined ? {} : { sessionId: options.sessionId }),
          ...(options.signal === undefined ? {} : { signal: options.signal }),
        })
        try {
          assertPlanFresh(plan, rescue.entries)
          await assertNoUnmanagedRestoreConflicts(plan.workspace, manifest.entries, rescue.entries, plan.paths)
        } catch (error) {
          await this.store.deleteManifest(plan.workspace, rescue.id)
          await this.store.collectGarbage(plan.workspace)
          throw error
        }
        const operation: RestoreOperation = {
          version: LEDGER_FORMAT_VERSION,
          id: makeId('op'),
          workspace: plan.workspace,
          restorePointId: manifest.id,
          rescuePointId: rescue.id,
          ...(options.sessionId === undefined ? {} : { sessionId: options.sessionId }),
          paths: plan.paths,
          startedAt: Date.now(),
          state: 'running',
        }
        await this.store.writeOperation(operation)

        try {
          await this.restorePaths(plan.workspace, manifest.entries, plan.paths, options.signal, plan.expected)
          await this.verifyPaths(
            plan.workspace,
            manifest.entries,
            plan.paths,
            options.signal,
            manifest.version === 2 ? manifest.git.objectFormat : undefined,
          )
        } catch (error) {
          const primaryError = errorMessage(error)
          let journalWarning: string | undefined
          try {
            await this.store.writeOperation({ ...operation, state: 'rollback-running', error: primaryError })
          } catch (journalError) {
            journalWarning = `could not persist rollback-running state: ${errorMessage(journalError)}`
          }

          let rollbackFailure: unknown
          try {
            await this.restorePaths(plan.workspace, rescue.entries, plan.paths)
            await this.verifyPaths(plan.workspace, rescue.entries, plan.paths)
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些未覆盖路径会使“回到请求之前”这一理解不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

恢复边界仅为检查点管理的文件集合，忽略文件、ACL、拥有者、时间戳与外部服务不在其中；因此不能称整个开发环境事务回滚。README安全契约仍写超限即失败，而更新说明明确超大文件可跳过，这是文案范围不一致，试用必须查看实际检查点跳过清单。恢复与自动回滚还可能同时失败，代码保留journal和rescue标识而不是保证永不丢状态。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:33-38](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/README.md#L33-L38)

超大文件跳过说明

```text
- **File rewind works in ordinary directories (0.3.0)** — when the working directory is not a Git repository it is snapshotted as an ordinary directory (`.git` and `node_modules` excluded by default, plus an optional `.dsh-rewindignore`), so messages-only rewind is no longer the only option.
- **The fastest path is now the default (0.3.8)** — the new `auto` mode uses Git-native checkpoints in a Git worktree (reusing the repository object database, so committed content is never stored twice) and the plugin's own store for ordinary directories.
- **Unchanged files are no longer re-read (0.3.5)** — each workspace keeps a persistent path identity cache; a measured 20 000-file / 351 MB workspace dropped from 237 s to about 7 s per capture.
- **One oversized file no longer discards a whole checkpoint (0.3.3)** — it is skipped and reported while the rest is still captured, and a restore never touches a path its checkpoint did not record, so a file that was too large then and small now is never deleted.
- **Checkpoint budget 5 s → 60 s, parallel capture (0.3.4)** — a 5-second budget in a large directory could only ever report a skip.
- **Rewind button and messages-only fixes (0.2.2 / 0.2.3)** — adapted to the DSH 0.1.2-alpha client hooks and restored the messages-only mode that the Host rejected.
```

**依据 2 · 作者声明**：[README.md:98-107](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/README.md#L98-L107)

明确排除范围

<details>
<summary>查看原文（10行）</summary>

```text
The following are rejected or deliberately outside the snapshot:

- sparse checkouts;
- submodule gitlinks (create a restore point inside each submodule instead);
- ignored files and files excluded by `.dsh-rewindignore`;
- special files, sockets, devices, and named pipes;
- extended attributes, ACLs, ownership, timestamps, and hard-link topology;
- the Git index and repository metadata.

If an ignored or otherwise unmanaged file occupies a path that restoration would replace, the restore fails rather than deleting it.
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:689-720](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/src/engine.ts#L689-L720)

恢复失败和回滚本身可失败的路径

<details>
<summary>查看原文（32行）</summary>

```text
        } catch (error) {
          const primaryError = errorMessage(error)
          let journalWarning: string | undefined
          try {
            await this.store.writeOperation({ ...operation, state: 'rollback-running', error: primaryError })
          } catch (journalError) {
            journalWarning = `could not persist rollback-running state: ${errorMessage(journalError)}`
          }

          let rollbackFailure: unknown
          try {
            await this.restorePaths(plan.workspace, rescue.entries, plan.paths)
            await this.verifyPaths(plan.workspace, rescue.entries, plan.paths)
          } catch (rollbackError) {
            rollbackFailure = rollbackError
          }

          if (rollbackFailure === undefined) {
            let terminalJournalWarning: string | undefined
            try {
              await this.store.writeOperation({
                ...operation,
                state: 'rolled-back',
                error: primaryError,
                finishedAt: Date.now(),
              })
            } catch (journalError) {
              terminalJournalWarning = `could not persist rolled-back state: ${errorMessage(journalError)}`
            }
            const warnings = [journalWarning, terminalJournalWarning].filter((value): value is string => value !== undefined)
            const warningText = warnings.length === 0 ? '' : `; journal warning: ${warnings.join('; ')}`
            throw new ChangeLedgerError(
```

</details>

**依据 4 · 作者声明**：[README.md:67-76](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/README.md#L67-L76)

安全契约73仍写超限失败，与更新说明36的超大文件跳过存在文案差异

<details>
<summary>查看原文（10行）</summary>

```text
## Safety contract

- **Explicit only:** nothing is restored automatically — every restore starts from the user pressing the final button in the Web dialog, or from an explicit call through the service API.
- **Read before write:** the dialog preview generates an expiring, session-bound plan from the current tree and changes no files.
- **Human gate:** the dialog's reviewed impact plus the final restore button is the human decision; direct mutation requests without a live session-bound plan pair fail closed.
- **Rescue before mutation:** every restore captures the current eligible tree as a durable rescue point before changing a path.
- **No silent omission:** unsupported submodules, sparse checkouts, oversized files, aggregate limits, and unsupported file types fail point creation.
- **No path escape:** every durable path is canonical and workspace-relative; restore refuses symlink parents and non-empty directory replacement.
- **No stale overwrite:** selected paths and the reviewed HEAD/branch/operation fence are checked again at apply time. Any relevant post-review change invalidates the plan.
- **No Git control-plane mutation:** the index, branch, HEAD, stash, and commits remain untouched.
```

</details>

#### 缺口

- 并发写入、断电及磁盘满的恢复完成率未知
  **影响**：不能将journal机制视为可靠性保证
  **进一步探讨**：在副本中按写入阶段中断并对比所有受管理及非托管路径

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些宿主与存储条件决定捕获和恢复能否启用？

**研究主题**：依赖、兼容与流程

#### 完整回答

必须有可写且独立于被恢复目录的持久存储，文件权限与磁盘空间应支持救援点；Agent服务供消息前捕获，Web相关服务供按钮与路由。普通目录走自有CAS，Git工作树auto模式复用对象库，不能把“不动索引分支”理解成完全不写Git对象。storageDir不能运行时移动；窗口内缺失检查点时只能消息分叉。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:63-80](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/src/index.ts#L63-L80)

服务注入及初始化失败只记录日志

<details>
<summary>查看原文（18行）</summary>

```text
    const checkpoints = new TurnCheckpointCoordinator(this.engine)
    ctx.logger.info(`[turn-rewind] v${pluginVersion()} active; workspace modes: git worktree, ordinary directory`)
    ctx.inject(['agents'], (scope: Context) => { checkpoints.install(scope) })
    // `apiProxy` is deliberately absent: DSH 0.1.2-alpha carriers (DSH Desktop 2.x)
    // provide `sessionController` instead, and the route must exist on both.
    ctx.inject(['webServer', 'sessions', 'sessionQuery', 'agents'], (scope: Context) => {
      installRewindHttp(scope, this.engine, checkpoints)
      installManageHttp(scope, this.engine)
    })
    installTurnRewindSettings(ctx, normalized, this.engine)
    void this.engine.initialize().then((reconciled) => {
      if (reconciled > 0) {
        ctx.logger.warn(`[change-ledger] reconciled ${reconciled} interrupted durable operation(s)`)
      } else {
        ctx.logger.info(`[change-ledger] ready; state=${this.engine.config.storageDir}`)
      }
    }).catch((error: unknown) => {
      ctx.logger.error(`[change-ledger] startup failed: ${error instanceof Error ? error.message : String(error)}`)
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:91-106](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/src/engine.ts#L91-L106)

存储根不可热切换

<details>
<summary>查看原文（16行）</summary>

```text
  updateConfig(config: ChangeLedgerConfig): void {
    const resolved = resolveConfig(config)
    if (resolved.storageDir !== this.currentConfig.storageDir) {
      throw new ChangeLedgerError('INVALID_CONFIG', 'storageDir cannot change while the engine is running')
    }
    Object.assign(this.currentConfig as WritableResolvedConfig, resolved)
  }

  /** Wait for startup reconciliation and return the number of interrupted journals found. */
  async initialize(): Promise<number> {
    return this.ready
  }

  private async initializeStore(): Promise<number> {
    const restoredOperations = await this.store.initialize()
    return restoredOperations + await this.reconcileGitCheckpointJournals()
```

</details>

**依据 3 · 作者声明**：[README.md:33-35](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/README.md#L33-L35)

auto后端选择

```text
- **File rewind works in ordinary directories (0.3.0)** — when the working directory is not a Git repository it is snapshotted as an ordinary directory (`.git` and `node_modules` excluded by default, plus an optional `.dsh-rewindignore`), so messages-only rewind is no longer the only option.
- **The fastest path is now the default (0.3.8)** — the new `auto` mode uses Git-native checkpoints in a Git worktree (reusing the repository object database, so committed content is never stored twice) and the plugin's own store for ordinary directories.
- **Unchanged files are no longer re-read (0.3.5)** — each workspace keeps a persistent path identity cache; a measured 20 000-file / 351 MB workspace dropped from 237 s to about 7 s per capture.
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 恢复安全链路带来哪些首次、持续与异常成本？

**研究主题**：效果与总成本

#### 完整回答

首次要安装到所需profile并重启，选择存储位置及限额。持续成本来自每轮捕获、CAS或Git对象、缓存与保留策略；作者20k文件耗时数据不是本轮复测，不能外推本项目。失败恢复至少需要救援点空间与人工核对journal；插件停用后保留原工作文件，但不应在未恢复操作时删状态。现金和每次捕获时间均未实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:109-127](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/README.md#L109-L127)

安装和逐轮捕获条件

<details>
<summary>查看原文（19行）</summary>

````text
## Install

Build the checked-out plugin, then add it to each DSH profile that should expose the service:

```sh
pnpm install --frozen-lockfile
pnpm run check

dsh plugin --profile web add @anionex/dsh-turn-rewind
dsh plugin --profile headless add @anionex/dsh-turn-rewind

dsh --profile web --dump-config | grep turn-rewind
```

Restart a running profile after changing its bundle list.

The package is a DSH Profile Bundle. `package.json` declares `dsh.bundle.patch`, and `cordis.patch.yml` mounts `@anionex/dsh-turn-rewind` without a DSH core patch.

When the profile also provides the DSH Agent service, the plugin captures a hidden checkpoint in the first `agent/pre-step` waterfall before the Agent processes the opening user message. Capture failures are reported but do not reject the user's turn; the corresponding message simply has no usable rewind point. In Web profiles, the same-origin `/turn-rewind` endpoint resolves the selected `user/message` sequence, exposes a paged file preview, mints a short-lived session-bound restore plan, and delegates child creation to DSH's official Host create/fork lifecycle. It never restores files automatically.
````

</details>

**依据 2 · 源码核查**：[src/engine.ts:53-65](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/src/engine.ts#L53-L65)

文件、空间和超时默认限额

<details>
<summary>查看原文（13行）</summary>

```text
const DEFAULTS = {
  maxRestorePoints: 50,
  maxTurnCheckpointsPerSession: 30,
  maxFiles: 20_000,
  maxFileBytes: 64 * 1024 * 1024,
  maxSnapshotBytes: 512 * 1024 * 1024,
  planTtlMs: 15 * 60 * 1_000,
  staleLockMs: 30_000,
  turnCheckpointMode: 'auto',
  turnCheckpointTimeoutMs: 60_000,
  turnCheckpointMaxNewBytes: 32 * 1024 * 1024,
  turnCheckpointTrust: 'fast',
} as const
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:651-678](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/src/engine.ts#L651-L678)

每次写回前额外救援点及操作日志

<details>
<summary>查看原文（28行）</summary>

```text
        const rescue = await this.createLocked({
          cwd: plan.workspace,
          kind: 'rescue',
          label: `Before restoring ${manifest.id}`,
          parentRestorePoint: manifest.id,
          ...(options.sessionId === undefined ? {} : { sessionId: options.sessionId }),
          ...(options.signal === undefined ? {} : { signal: options.signal }),
        })
        try {
          assertPlanFresh(plan, rescue.entries)
          await assertNoUnmanagedRestoreConflicts(plan.workspace, manifest.entries, rescue.entries, plan.paths)
        } catch (error) {
          await this.store.deleteManifest(plan.workspace, rescue.id)
          await this.store.collectGarbage(plan.workspace)
          throw error
        }
        const operation: RestoreOperation = {
          version: LEDGER_FORMAT_VERSION,
          id: makeId('op'),
          workspace: plan.workspace,
          restorePointId: manifest.id,
          rescuePointId: rescue.id,
          ...(options.sessionId === undefined ? {} : { sessionId: options.sessionId }),
          paths: plan.paths,
          startedAt: Date.now(),
          state: 'running',
        }
        await this.store.writeOperation(operation)
```

</details>

#### 缺口

- 当前目标工作区的捕获耗时、存储增长和失败恢复人工投入未测
  **影响**：不能用作者20k文件数值推定目标目录成本可接受
  **进一步探讨**：按目标目录文件分布记录捕获、保留及一次失败救援的资源/人工开销

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 引擎哪些保护设计可复用，主要维护代价在哪里？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴的是把计划批准、变更前快照、写回校验和恢复日志分开，而非直接在UI点击中执行覆盖。引擎与Cordis服务隔离，其他插件可消费changeLedger；移植需要重做workspace身份、路径安全、锁与宿主会话边界。代码显式处理回滚失败并留可恢复状态，比吞错更可审计；但保护分支多且依赖文件系统语义，源码审阅无法证明竞争场景完备。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:52-72](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/src/index.ts#L52-L72)

独立服务边界

<details>
<summary>查看原文（21行）</summary>

```text
/** Cordis service exposed as `ctx.changeLedger` for other DSH plugins. */
export class ChangeLedgerService {
  /** DSH 0.1.7 projects volatile Config fields into its settings form. */
  static Config = TurnRewindSettingsSchema
  readonly engine: ChangeLedgerEngine

  /** Register the service and startup reconciliation. */
  constructor(ctx: Context, config: ChangeLedgerConfig = {}) {
    const normalized = unwrapVolatileConfig(config)
    ctx.provide('changeLedger', this)
    this.engine = new ChangeLedgerEngine(normalized)
    const checkpoints = new TurnCheckpointCoordinator(this.engine)
    ctx.logger.info(`[turn-rewind] v${pluginVersion()} active; workspace modes: git worktree, ordinary directory`)
    ctx.inject(['agents'], (scope: Context) => { checkpoints.install(scope) })
    // `apiProxy` is deliberately absent: DSH 0.1.2-alpha carriers (DSH Desktop 2.x)
    // provide `sessionController` instead, and the route must exist on both.
    ctx.inject(['webServer', 'sessions', 'sessionQuery', 'agents'], (scope: Context) => {
      installRewindHttp(scope, this.engine, checkpoints)
      installManageHttp(scope, this.engine)
    })
    installTurnRewindSettings(ctx, normalized, this.engine)
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:149-175](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/src/engine.ts#L149-L175)

启动恢复journal

<details>
<summary>查看原文（27行）</summary>

```text
  private async reconcileGitCheckpointJournals(): Promise<number> {
    let reconciled = 0
    for (const journal of await this.store.listGitCheckpointJournals()) {
      const workspace = await resolveGitWorktreeRoot(journal.commonDir, journal.worktreeId, journal.workspace)
      const activeJournal = workspace === journal.workspace ? journal : { ...journal, workspace }
      const release = await this.acquireWorkspace({ type: 'git', root: workspace })
      try {
        const manifest = await this.tryReadManifest(workspace, journal.restorePointId)
        if (journal.action === 'publish') {
          if (manifest === undefined) {
            await deleteGitCheckpointRef(workspace, journal.ref, journal.commit, this.config.storageDir)
          } else {
            assertJournalMatchesManifest(activeJournal, manifest)
            await verifyGitCheckpoint(manifest)
          }
        } else {
          if (manifest !== undefined) {
            assertJournalMatchesManifest(activeJournal, manifest)
            await this.store.deleteManifest(workspace, journal.restorePointId)
          }
          await deleteGitCheckpointRef(workspace, journal.ref, journal.commit, this.config.storageDir)
        }
        await this.store.deleteGitCheckpointJournal(workspace, journal.restorePointId)
        reconciled += 1
      } finally {
        await release()
      }
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:689-718](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/src/engine.ts#L689-L718)

主错误与journal错误分开处理

<details>
<summary>查看原文（30行）</summary>

```text
        } catch (error) {
          const primaryError = errorMessage(error)
          let journalWarning: string | undefined
          try {
            await this.store.writeOperation({ ...operation, state: 'rollback-running', error: primaryError })
          } catch (journalError) {
            journalWarning = `could not persist rollback-running state: ${errorMessage(journalError)}`
          }

          let rollbackFailure: unknown
          try {
            await this.restorePaths(plan.workspace, rescue.entries, plan.paths)
            await this.verifyPaths(plan.workspace, rescue.entries, plan.paths)
          } catch (rollbackError) {
            rollbackFailure = rollbackError
          }

          if (rollbackFailure === undefined) {
            let terminalJournalWarning: string | undefined
            try {
              await this.store.writeOperation({
                ...operation,
                state: 'rolled-back',
                error: primaryError,
                finishedAt: Date.now(),
              })
            } catch (journalError) {
              terminalJournalWarning = `could not persist rolled-back state: ${errorMessage(journalError)}`
            }
            const warnings = [journalWarning, terminalJournalWarning].filter((value): value is string => value !== undefined)
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否把“已捕获范围”作为恢复前的可验证覆盖契约？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是给每个消息检查点生成覆盖契约，列出管理、跳过及无法恢复路径，并在恢复前将当前任务涉及路径与它对比。由超限跳过和排除项推得，显式覆盖差集可能减少“以为全恢复”的误用。最小验证是在同一目录分别加入超大文件、忽略配置和普通源码，对照现有预览及带覆盖差集预览，记录用户是否正确识别未恢复项；若误判无减少或提示淹没核心变化，则否定增加该层的价值。此设计未实现，也不计入当前贡献。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:33-38](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/README.md#L33-L38)

跳过路径引出覆盖契约假设

```text
- **File rewind works in ordinary directories (0.3.0)** — when the working directory is not a Git repository it is snapshotted as an ordinary directory (`.git` and `node_modules` excluded by default, plus an optional `.dsh-rewindignore`), so messages-only rewind is no longer the only option.
- **The fastest path is now the default (0.3.8)** — the new `auto` mode uses Git-native checkpoints in a Git worktree (reusing the repository object database, so committed content is never stored twice) and the plugin's own store for ordinary directories.
- **Unchanged files are no longer re-read (0.3.5)** — each workspace keeps a persistent path identity cache; a measured 20 000-file / 351 MB workspace dropped from 237 s to about 7 s per capture.
- **One oversized file no longer discards a whole checkpoint (0.3.3)** — it is skipped and reported while the rest is still captured, and a restore never touches a path its checkpoint did not record, so a file that was too large then and small now is never deleted.
- **Checkpoint budget 5 s → 60 s, parallel capture (0.3.4)** — a 5-second budget in a large directory could only ever report a skip.
- **Rewind button and messages-only fixes (0.2.2 / 0.2.3)** — adapted to the DSH 0.1.2-alpha client hooks and restored the messages-only mode that the Host rejected.
```

**依据 2 · 作者声明**：[README.md:98-107](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/README.md#L98-L107)

排除边界引出误解风险

<details>
<summary>查看原文（10行）</summary>

```text
The following are rejected or deliberately outside the snapshot:

- sparse checkouts;
- submodule gitlinks (create a restore point inside each submodule instead);
- ignored files and files excluded by `.dsh-rewindignore`;
- special files, sockets, devices, and named pipes;
- extended attributes, ACLs, ownership, timestamps, and hard-link topology;
- the Git index and repository metadata.

If an ignored or otherwise unmanaged file occupies a path that restoration would replace, the restore fails rather than deleting it.
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 应如何限定试用和停止条件？

**研究主题**：采用判断

#### 完整回答

适合经常需要撤销Agent文件修改且愿意核对路径的开发者，在可丢弃副本中先做一次“文件恢复+消息新建”，对照受管理路径内容与原会话。只有预览范围、救援点和原有Git状态都符合预期才扩大使用；发现缺检查点、范围遗漏或回滚错误时停止写回，保留journal与rescue，以独立备份或手工Git恢复接管。不用于外部数据库或未纳管文件的整体事务回滚。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:129-143](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/README.md#L129-L143)

模式与源会话保留依据

<details>
<summary>查看原文（15行）</summary>

```text
## User flow

In the Web profile, each direct user message gains a compact, icon-only **Rewind** action after its timestamp and native Copy control. The tooltip reads “Return to before sending this message.” Opening Rewind checks the saved file state, shows a concise preview with a “view all files” action, and offers three modes:

| Mode | Code | Conversation |
| --- | --- | --- |
| **Restore files and restart** (default when files changed) | Restores the project files after automatically backing up their current state. | Creates and opens a Session ending before the selected message, then puts that message's text back in the composer. |
| **Restore files only** | Restores the project files after automatically backing up their current state. | Leaves the current Session open and unchanged. |
| **Rewind messages only** (default when no checkpoint or no file changes) | Leaves the project files exactly as they are. | Creates and opens a Session ending before the selected message, then puts that message's text back in the composer. |

The dialog itself is the confirmation: there is no duplicate checkbox. It describes each file as restoring an earlier version, finding a deleted file, removing a later-added file, or restoring permissions/type. **Rewind messages only** is always available — including when the checkpoint for that message is missing, was skipped (for example after disabling automatic checkpoints), or the project files already match the saved state — because it never touches the worktree. It is not blocked by other running Agents in the same worktree.

Before mutation, Turn Rewind rechecks the selected files and repository state, then creates an automatic backup. Changes made after preview invalidate the operation. Any running Agent using the same worktree, including the source Session, blocks restoration; idle Sessions do not block. A reviewed HEAD or branch difference does not block restoration: commits, refs, branch, and index remain unchanged, so restored content may appear as ordinary uncommitted changes against the current HEAD. An in-progress Git operation still blocks. If child creation fails after “restore and restart,” Change Ledger automatically restores the pre-operation files from the backup.

DSH Session logs are append-only, so “restart” creates a new Session instead of truncating the original. For the first message, the Host creates a blank Session in the same working directory; for later messages, it forks at the previous completed `turn/end`. A child may reuse an ancestor's prompt checkpoint only while both the selected `user/message` and its exact `turn/start` remain inside every durable `seedLength` fence. Direct child checkpoints take priority and sibling checkpoints never mix. **Turn Rewind** always treats the two dimensions independently: the two restore modes change project files (optionally followed by a new conversation), while **Rewind messages only** reuses the same fork lifecycle without touching files. The original Session is always retained.
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:624-688](https://github.com/Anionex/dsh-turn-rewind/blob/737d716c5f693f96eb2adc3e9a79f4e55cda8735/src/engine.ts#L624-L688)

可控恢复操作边界

<details>
<summary>查看原文（65行）</summary>

```text
    await this.ready
    this.expirePlans()
    const plan = this.plans.get(options.planId)
    if (plan === undefined) throw new ChangeLedgerError('PLAN_NOT_FOUND', `restore plan ${options.planId} is absent or expired`)
    if (plan.confirmation !== options.confirmation) {
      throw new ChangeLedgerError('CONFIRMATION_MISMATCH', 'confirmation does not exactly match the restore plan')
    }
    if (plan.sessionId !== undefined && plan.sessionId !== options.sessionId) {
      throw new ChangeLedgerError('SESSION_MISMATCH', 'restore plan belongs to a different DSH session')
    }
    if (this.activePlans.has(plan.id)) {
      throw new ChangeLedgerError('PLAN_IN_PROGRESS', `restore plan ${plan.id} is already being applied`)
    }
    this.activePlans.add(plan.id)

    try {
      await this.assertStorageSeparated(plan.workspace)
      const release = await this.acquireWorkspace(plan.repository, options.signal)
      try {
        const manifest = await this.store.readManifest(plan.workspace, plan.restorePointId)
        if (manifest.version === 2) await verifyGitCheckpoint(manifest, options.signal)
        const current = await captureStableTree({ cwd: plan.workspace, config: this.config, ...(options.signal === undefined ? {} : { signal: options.signal }) })
        assertRepositoryCompatible(manifest, current.source.state, plan.allowHeadChange)
        assertPlanRepositoryFresh(plan.repository, current.source.state)
        assertPlanFresh(plan, current.entries)
        await assertNoUnmanagedRestoreConflicts(plan.workspace, manifest.entries, current.entries, plan.paths)

        const rescue = await this.createLocked({
          cwd: plan.workspace,
          kind: 'rescue',
          label: `Before restoring ${manifest.id}`,
          parentRestorePoint: manifest.id,
          ...(options.sessionId === undefined ? {} : { sessionId: options.sessionId }),
          ...(options.signal === undefined ? {} : { signal: options.signal }),
        })
        try {
          assertPlanFresh(plan, rescue.entries)
          await assertNoUnmanagedRestoreConflicts(plan.workspace, manifest.entries, rescue.entries, plan.paths)
        } catch (error) {
          await this.store.deleteManifest(plan.workspace, rescue.id)
          await this.store.collectGarbage(plan.workspace)
          throw error
        }
        const operation: RestoreOperation = {
          version: LEDGER_FORMAT_VERSION,
          id: makeId('op'),
          workspace: plan.workspace,
          restorePointId: manifest.id,
          rescuePointId: rescue.id,
          ...(options.sessionId === undefined ? {} : { sessionId: options.sessionId }),
          paths: plan.paths,
          startedAt: Date.now(),
          state: 'running',
        }
        await this.store.writeOperation(operation)

        try {
          await this.restorePaths(plan.workspace, manifest.entries, plan.paths, options.signal, plan.expected)
          await this.verifyPaths(
            plan.workspace,
            manifest.entries,
            plan.paths,
            options.signal,
            manifest.version === 2 ? manifest.git.objectFormat : undefined,
          )
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
