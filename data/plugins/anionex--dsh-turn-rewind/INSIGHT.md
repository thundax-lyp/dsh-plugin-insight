# DSH Turn Rewind

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[5b33fd5](https://github.com/Anionex/dsh-turn-rewind/tree/5b33fd51925dbd615836d72323e89262796efae5)

<!-- BEGIN META -->
[![GitHub ★ 135](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=135&color=yellow&logo=github&style=flat)](https://github.com/Anionex/dsh-turn-rewind) [![npm 30d 4,574](https://img.shields.io/static/v1?label=npm+30d&message=4%2C574&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@anionex/dsh-turn-rewind)
<!-- END META -->

> **实现功能**：按用户消息关联检查点恢复项目文件，并可独立或同时创建回退后的新会话。

> **核心亮点**：把用户消息、路径预览计划、rescue和中断journal组合成恢复生命周期，文件与会话可分开处理。[Q03](#research-q03)

> **风险与缺陷**：检查点可能部分覆盖，ignored/超限路径及外部副作用不会整体撤销；恢复还需控制外部写入者，不能当完整环境时光机。[Q04](#research-q04)

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
  - [Q01 · 消息锚定回退解决哪种开发问题？](#detail-section-11)
  - [Q02 · 文件恢复与会话重启怎样分离？](#detail-section-12)
  - [Q03 · 相比Git回退或文件复制增加什么？](#detail-section-13)
  - [Q04 · “回到消息之前”覆盖完整项目状态吗？](#detail-section-14)
  - [Q05 · 启动、检查点及恢复有什么依赖？](#detail-section-15)
  - [Q06 · 检查点和恢复的总成本怎样评估？](#detail-section-16)
  - [Q07 · 恢复失败的状态分类是否值得复用？](#detail-section-17)
  - [Q08 · 怎样让用户更准确理解部分恢复？](#detail-section-18)
  - [Q09 · 什么用户适合试用，恢复前应检查什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向Agent修改项目后，开发者想回到某条用户请求之前再尝试的场景。合格结果应明确哪些文件恢复、哪些未纳入、当前Git控制状态及新会话从何处开始。简单替代是提前Git提交或复制目录，再手工找到聊天分叉点；本插件把消息边界与文件检查点关联，但不能撤销已发送邮件、数据库写入或外部部署。

基线为提前Git提交/目录备份加手动聊天分叉；不把文件hash一致等同外部业务全部恢复。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|消息检查点|记录请求前文件状态|可能skip或部分覆盖|
|文件预览计划|选择恢复路径并检查漂移|有TTL和session绑定|
|文件恢复|rescue后写入并校验|仅纳入路径，外部副作用不回退|
|会话重启|创建/分叉到消息前|保留原日志，不截断|
|失败补偿|恢复失败或fork失败时回救援点|补偿失败需人工恢复|
|存储管理|列出并清理未受保护point|Git对象空间回收由Git GC处理|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|Node ^22.19.0或>=24.0.0、兼容DSH与Cordis ^4.0.1|启动必需|changeLedger及宿主生命周期|加载或操作失败|
|可写且独立的storageDir|检查点/恢复必需|blob、manifest与journal|拒绝重叠或持久化失败|
|Git|git-native模式必需|复用对象存储|普通目录走自有存储|
|Web会话控制与客户端插槽|界面重启必需|按消息创建/分叉|服务API与UI能力分开|
|停止同工作区写入者|恢复必需|减少并发漂移|DSH活跃会话会阻止文件恢复|

#### 启动步骤

|步骤|执行者与动作|成功判据或失败处理|
|---|---|---|
|准备|用户安装并在副本设覆盖/存储|消息产生可用point或明确skip|
|预览|用户选择消息和文件/会话模式|列出差异及未覆盖项|
|恢复|用户确认当前计划，系统建rescue|过期或漂移拒绝并重预览|
|验收|用户检查路径hash及业务结果|失败查journal/rescue，外部状态单独处理|

#### 成本

|阶段|现金与资源成本|人工与时间投入|已知条件与未知项|
|---|---|---|---|
|首次使用|检查点存储与构建资源，金额未知|配置覆盖和恢复演练，耗时未知|storage不得重叠工作区|
|持续使用|扫描IO、blob/Git对象，金额未知|审阅覆盖与保留策略，耗时未知|cache加速依工作负载|
|失败恢复|额外rescue与journal，金额未知|核对部分状态和外部副作用，耗时未知|补偿也可能失败|

#### 效果

|效果项|当前证据支持|尚不能确定|
|---|---|---|
|文件恢复|计划新鲜度、rescue和hash验证|真实故障恢复率|
|会话重启|messages与both独立分支|宿主新版本兼容|
|捕获开销|身份缓存和部分覆盖机制|本地耗时与空间|

> **思考**：检查点可能部分覆盖，ignored/超限路径及外部副作用不会整体撤销；恢复还需控制外部写入者，不能当完整环境时光机。[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把用户消息、路径预览计划、rescue和中断journal组合成恢复生命周期，文件与会话可分开处理。[Q03](#research-q03)

把用户消息、路径预览计划、rescue和中断journal组合成恢复生命周期，文件与会话可分开处理。[Q03](#research-q03)

值得借鉴的是失败后先写rollback-running、尝试rescue恢复并验证，成功与失败分别写rolled-back和recovery-required，且journal写失败保留告警。它避免把“尝试回滚”谎称“已恢复”，但回滚也会失败，需用户按rescue与journal处理。只读计划和mutation分开、session确认及path-level hash可迁移到其他批量文件工具，复用要同时保留恢复日志和存储分离约束。

<a id="detail-section-5"></a>

### 1.4 主要限制

检查点可能部分覆盖，ignored/超限路径及外部副作用不会整体撤销；恢复还需控制外部写入者，不能当完整环境时光机。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

经常让Agent改本地项目且愿意审阅差异的开发者可在非关键副本试用。先手工备份并覆盖新增/删除/二进制/符号链接样本，核对skip清单，再测试预览后改文件会拒绝、fork失败补偿和rescue可读。正式项目恢复前停掉其他写入者；外部部署和服务状态由用户单独处理。未做本版本安装与恢复演练，因此只支持可控试用，不代替备份制度。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码级检查恢复计划、rescue、journal及会话补偿，未实际运行恢复；完整环境回滚不在能力范围，未来假设未验证。

- 已检查：作者 README、包清单、源码路径 src/engine.ts、src/rewind-host.ts、src/snapshot.ts、src/path-cache.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查engine计划/应用/回滚、rewind-host三模式与活跃会话门禁、snapshot部分覆盖与cache；未完整审计Git对象发布、Web权限和全部路径写入实现。
- 下一步：在隔离目录演练部分point、预览后修改、并发写入、fork失败与补偿失败，核对journal和rescue并计量IO/人工。

**分析版本**

- **仓库**：[Anionex/dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind)
- **版本号**：0.3.10（[固定提交 5b33fd5](https://github.com/Anionex/dsh-turn-rewind/tree/5b33fd51925dbd615836d72323e89262796efae5)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是回退预览显式列出“文件覆盖矩阵+外部副作用清单”，并让任务运行时记录潜在外部写操作，可减少用户把文件回退当整体撤销。推导来自partial point和会话/文件分离。最小验证用有超大文件、ignored配置及模拟外部写入的任务，比较普通差异列表与覆盖矩阵对用户恢复范围判断正确率、漏确认和人工时间；若用户仍误判或负担明显增加，应缩小为更明确的“已记录文件恢复”。 [Q08](#research-q08)

在隔离目录演练部分point、预览后修改、并发写入、fork失败与补偿失败，核对journal和rescue并计量IO/人工。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 1048 | — | — | 12335 |
| .js | source | 17 | 7754 | 7238 | 516 | — |
| .mjs | source | 2 | 167 | 156 | 2 | — |
| .tsx | source | 1 | 1950 | 1661 | 191 | — |
| .ts | source | 16 | 7712 | 6758 | 487 | — |
| .mjs | test | 6 | 4629 | 4207 | 102 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/Anionex/dsh-turn-rewind/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：消息锚定的文件与会话回退能否形成可检查、可补偿的恢复边界，而不让用户误以为所有副作用已撤销？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 消息锚定回退解决哪种开发问题？

**研究主题**：场景与需求

#### 完整回答

面向Agent修改项目后，开发者想回到某条用户请求之前再尝试的场景。合格结果应明确哪些文件恢复、哪些未纳入、当前Git控制状态及新会话从何处开始。简单替代是提前Git提交或复制目录，再手工找到聊天分叉点；本插件把消息边界与文件检查点关联，但不能撤销已发送邮件、数据库写入或外部部署。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:129-143](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/README.md#L129-L143)

三模式与append-only新会话流程。

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

### Q02 · 文件恢复与会话重启怎样分离？

**研究主题**：功能与机制

#### 完整回答

planRestore重新捕获当前树，验证检查点兼容、预览hash与仓库状态，选择路径后生成带过期时间、sessionId与精确confirmation的计划。apply再查仓库和路径新鲜度，先建rescue、写operation journal，再改文件并验hash。messages-only直接创建/分叉会话不触碰文件；both先恢复文件，若创建新会话失败再从rescue补偿。原日志保留，不是截断原会话。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:547-611](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/src/engine.ts#L547-L611)

计划绑定、选择与freshness。

<details>
<summary>查看原文（65行）</summary>

```text
  async planRestore(options: {
    readonly cwd: string
    readonly restorePointId: string
    readonly sessionId?: string
    readonly paths?: readonly string[]
    readonly allowHeadChange?: boolean
    readonly expectedCurrentTreeHash?: string
    readonly expectedRepository?: RestorePointManifest['repository']
    readonly signal?: AbortSignal
  }): Promise<RestorePlan> {
    await this.ready
    this.expirePlans()
    const source = await discoverWorkspace(options.cwd, this.config, options.signal)
    await this.assertStorageSeparated(source.state.root)
    const release = await this.acquireWorkspace(source.state, options.signal)
    try {
      const manifest = await this.store.readManifest(source.state.root, options.restorePointId)
      if (manifest.version === 2) await verifyGitCheckpoint(manifest, options.signal)
      const current = await captureStableTree({
        cwd: source.state.root,
        config: this.config,
        store: this.store,
        pathCache: await this.pathCacheFor(this.store.workspaceDirectory(source.state.root)),
        ...(manifest.version === 2 ? { gitObjectFormat: manifest.git.objectFormat } : {}),
        ...(options.signal === undefined ? {} : { signal: options.signal }),
      })
      const currentEntries = manifest.version === 2 ? current.gitEntries : current.entries
      if (currentEntries === undefined) throw new ChangeLedgerError('STATE_CORRUPT', 'Git comparison entries are unavailable')
      if (options.expectedCurrentTreeHash !== undefined && options.expectedCurrentTreeHash !== current.treeHash) {
        throw new ChangeLedgerError('PLAN_STALE', 'workspace changed after inspection; inspect and plan again')
      }
      if (options.expectedRepository !== undefined && !sameWorkspaceFence(options.expectedRepository, current.source.state)) {
        throw workspaceStaleError(options.expectedRepository, current.source.state, 'inspection')
      }
      assertRepositoryCompatible(manifest, current.source.state, options.allowHeadChange === true)
      const changes = filterUnobservedChanges(manifest, diffTrees(manifest.entries, current.entries, manifest.entries, currentEntries))
      if (changes.length === 0) {
        throw new ChangeLedgerError('NO_CHANGES', `workspace already matches restore point ${manifest.id}`)
      }
      const selected = selectChanges(changes, options.paths)
      await assertNoUnmanagedRestoreConflicts(
        source.state.root,
        manifest.entries,
        current.entries,
        selected.map((change) => change.path),
      )
      const expected: Record<string, SnapshotEntry | null> = Object.create(null) as Record<string, SnapshotEntry | null>
      for (const change of selected) expected[change.path] = current.entries[change.path] ?? null
      const now = Date.now()
      const plan: RestorePlan = {
        id: makeId('plan'),
        restorePointId: manifest.id,
        workspace: manifest.workspace,
        repository: current.source.state,
        ...(options.sessionId === undefined ? {} : { sessionId: options.sessionId }),
        createdAt: now,
        expiresAt: now + this.config.planTtlMs,
        confirmation: `RESTORE-${randomBytes(4).toString('hex').toUpperCase()}`,
        allowHeadChange: options.allowHeadChange === true,
        paths: selected.map((change) => change.path),
        changes: selected,
        expected,
      }
      this.plans.set(plan.id, plan)
      return clonePlan(plan)
```

</details>

**依据 2 · 源码核查**：[src/rewind-host.ts:476-529](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/src/rewind-host.ts#L476-L529)

messages/code/both分支及fork失败补偿。

<details>
<summary>查看原文（54行）</summary>

```text
        const body = objectBody(await readBody(request))
        const mode = body.mode
        if (mode !== 'code' && mode !== 'both' && mode !== 'messages') {
          throw new ChangeLedgerError('INVALID_ARGUMENTS', 'mode must be "code", "both", or "messages"')
        }
        const sessionId = requiredText(body.sessionId, 'sessionId')
        const messageSeq = nonNegativeInteger(body.messageSeq, 'messageSeq')
        // Messages-only rewind never reads or writes project files, so it needs
        // neither a checkpoint nor an exclusive workspace: it resolves the turn
        // boundary straight from the Session log and forks there.
        if (mode === 'messages') {
          const target = messageTarget(await readSession(ctx, sessionId), messageSeq)
          const fork = await createConversationRestart(ctx, sessionId, target)
          json(response, 200, { status: 'completed', mode, sessionId: fork.sessionId })
          return
        }
        const checkpointId = requiredText(body.checkpointId, 'checkpointId')
        const checkpoint = await checkpointForRequest(ctx, engine, sessionId, messageSeq, checkpointId)
        const activeSessionIds = await sharedWorkspaceSessions(ctx.agents, checkpoint.cwd)
        if (activeSessionIds.length > 0) {
          throw new ChangeLedgerError(
            'WORKSPACE_IN_USE',
            `project files are also used by active sessions: ${activeSessionIds.slice(0, 5).join(', ')}`,
          )
        }
        const planId = optionalText(body.planId, 'planId')
        const confirmation = optionalText(body.confirmation, 'confirmation')
        if (planId === undefined || confirmation === undefined) {
          throw new ChangeLedgerError('NO_CHANGES', 'the selected turn has no project files to restore')
        }
        const restoreResult = await engine.applyRestore({ planId, confirmation, sessionId })
        if (mode === 'code') {
          json(response, 200, { status: 'completed', mode, ...restoreResult })
          return
        }

        try {
          const fork = await createConversationRestart(ctx, sessionId, checkpoint)
          json(response, 200, { status: 'completed', mode, sessionId: fork.sessionId, ...restoreResult })
        } catch (forkError) {
          if (restoreResult === undefined) throw forkError
          try {
            const rollbackPlan = await engine.planRestore({
              cwd: checkpoint.cwd,
              restorePointId: restoreResult.rescuePointId,
              sessionId,
            })
            await engine.applyRestore({
              planId: rollbackPlan.id,
              confirmation: rollbackPlan.confirmation,
              sessionId,
            })
          } catch (rollbackError) {
            throw new AggregateError([forkError, rollbackError], 'conversation fork failed and code compensation also failed')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比Git回退或文件复制增加什么？

**研究主题**：贡献与相对优势

#### 完整回答

增量是用户消息锚定、可审阅的路径计划、rescue和中断journal组成的恢复生命周期，且会话与文件两个维度可分别选择。相比git reset，它不要求用分支/索引控制操作来实现工作树回退；相比复制目录，它显式检查预览后变化并提供失败补偿。底层Git对象存储与内容hash为既有机制，本项目贡献是语义边界与宿主生命周期整合，不是通用系统时光机。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:618-683](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/src/engine.ts#L618-L683)

确认、新鲜度、rescue及journal形成恢复协议。

<details>
<summary>查看原文（66行）</summary>

```text
  async applyRestore(options: {
    readonly planId: string
    readonly confirmation: string
    readonly sessionId?: string
    readonly signal?: AbortSignal
  }): Promise<RestoreResult> {
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
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · “回到消息之前”覆盖完整项目状态吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

不覆盖。源码允许超大文件、不支持类型和预算上限产生partial checkpoint，并记录skipped/truncated；恢复只能操作已纳入路径，ignored文件、外部服务状态、ACL/所有者等不在范围。README早段仍说超限会使point创建失败，与当前源码和后文部分保留表述不一致，应以检查点实际skip清单为准。此外Web检查正在运行的DSH Agent，不等于冻结编辑器/构建器等外部写入者；新鲜度检查减小竞态，不能作跨进程文件系统事务保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/snapshot.ts:50-65](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/src/snapshot.ts#L50-L65)

部分保留和truncated是明确语义。

<details>
<summary>查看原文（16行）</summary>

```text
  const source = await discoverWorkspace(options.cwd, options.config, options.signal)
  // Limits never discard an entire restore point: an over-limit path is left out
  // and reported, and the remaining eligible paths are still captured. A restore
  // only ever rewrites captured paths, so a partial point stays safe to apply.
  const skipped: CaptureSkip[] = [...source.skipped]
  let skippedCount = source.skippedCount
  let truncated: CaptureTruncation | undefined = source.truncated
  const recordSkip = (path: string, reason: CaptureSkipReason): void => {
    skippedCount += 1
    if (skipped.length < MAX_RECORDED_SKIPS) skipped.push({ path, reason })
    else truncated ??= reason === 'snapshot-limit' ? 'snapshot-limit' : 'file-limit'
  }
  const paths = source.paths.length > options.config.maxFiles
    ? source.paths.slice(0, options.config.maxFiles)
    : source.paths
  if (source.paths.length > options.config.maxFiles) truncated ??= 'file-limit'
```

</details>

**依据 2 · 源码核查**：[src/snapshot.ts:103-129](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/src/snapshot.ts#L103-L129)

超大/特殊文件记录skip并继续，聚合预算耗尽同样跳过。

<details>
<summary>查看原文（27行）</summary>

```text
    if (budgetSpent) {
      // The aggregate budget is gone, but the path is still recorded so a
      // restore can prove this point never observed it.
      recordSkip(path, 'snapshot-limit')
      return
    }
    let entry: Awaited<ReturnType<typeof captureEntry>>
    try {
      entry = await captureEntry(source.state.root, path, options.config.maxFileBytes, options.signal)
    } catch (error) {
      if (error instanceof ChangeLedgerError && error.code === 'FILE_TOO_LARGE') {
        recordSkip(path, 'file-too-large')
        return
      }
      if (error instanceof ChangeLedgerError && error.code === 'UNSUPPORTED_FILE_TYPE') {
        recordSkip(path, 'unsupported-file-type')
        return
      }
      throw error
    }
    if (entry === undefined) return
    if (entry.kind === 'file') {
      if (budgetSpent || totalBytes + entry.content.length > options.config.maxSnapshotBytes) {
        budgetSpent = true
        truncated ??= 'snapshot-limit'
        recordSkip(path, 'snapshot-limit')
        return
```

</details>

#### 缺口

- 真实项目未纳入路径与恢复中外部编辑竞态影响未测
  **影响**：不能承诺完整环境回滚或所有并发条件下正确
  **进一步探讨**：用含ignored、大文件、符号链接及并行写入的隔离项目，核对skip清单与恢复结果

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、检查点及恢复有什么依赖？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要Node ^22.19.0 || >=24.0.0、兼容DSH、Cordis ^4.0.1及本地可写存储；dsh-settings是可选peer，不能把其范围当作全部宿主版本门槛，Web回退另需会话控制与conversation客户端插槽。Git工作树可用git-native检查点，普通目录用插件内容存储；storageDir不得与受管工作区重叠。pre-step捕获失败不会阻断用户轮次，但该消息没有文件恢复点，messages-only仍可用。恢复要停止同工作区运行的Agent并审阅实际覆盖范围，旧计划过期后需重新预览。

#### 证据与依据

**依据 1 · 源码核查**：[src/rewind-host.ts:476-506](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/src/rewind-host.ts#L476-L506)

纯消息分支不依赖point；文件分支检查活跃Agent及计划。

<details>
<summary>查看原文（31行）</summary>

```text
        const body = objectBody(await readBody(request))
        const mode = body.mode
        if (mode !== 'code' && mode !== 'both' && mode !== 'messages') {
          throw new ChangeLedgerError('INVALID_ARGUMENTS', 'mode must be "code", "both", or "messages"')
        }
        const sessionId = requiredText(body.sessionId, 'sessionId')
        const messageSeq = nonNegativeInteger(body.messageSeq, 'messageSeq')
        // Messages-only rewind never reads or writes project files, so it needs
        // neither a checkpoint nor an exclusive workspace: it resolves the turn
        // boundary straight from the Session log and forks there.
        if (mode === 'messages') {
          const target = messageTarget(await readSession(ctx, sessionId), messageSeq)
          const fork = await createConversationRestart(ctx, sessionId, target)
          json(response, 200, { status: 'completed', mode, sessionId: fork.sessionId })
          return
        }
        const checkpointId = requiredText(body.checkpointId, 'checkpointId')
        const checkpoint = await checkpointForRequest(ctx, engine, sessionId, messageSeq, checkpointId)
        const activeSessionIds = await sharedWorkspaceSessions(ctx.agents, checkpoint.cwd)
        if (activeSessionIds.length > 0) {
          throw new ChangeLedgerError(
            'WORKSPACE_IN_USE',
            `project files are also used by active sessions: ${activeSessionIds.slice(0, 5).join(', ')}`,
          )
        }
        const planId = optionalText(body.planId, 'planId')
        const confirmation = optionalText(body.confirmation, 'confirmation')
        if (planId === undefined || confirmation === undefined) {
          throw new ChangeLedgerError('NO_CHANGES', 'the selected turn has no project files to restore')
        }
        const restoreResult = await engine.applyRestore({ planId, confirmation, sessionId })
```

</details>

**依据 2 · 源码核查**：[package.json:123-125](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/package.json#L123-L125)

Node引擎范围为^22.19.0 || >=24.0.0。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

**依据 3 · 源码核查**：[package.json:104-114](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/package.json#L104-L114)

Cordis peer为^4.0.1，dsh-settings通过peerDependenciesMeta标为optional。

<details>
<summary>查看原文（11行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-settings": ">=0.1.0-rc.8 <0.2.0 || ^0.1.1-rc.1 || ^0.1.2-alpha.1 || ^0.1.5-rc.1 || 0.2.0-rc.2 || 0.2.1-rc.2",
    "@deepseek-ai/schemastery": "^3.18.1"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-settings": {
      "optional": true
    }
  },
  "devDependencies": {
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 检查点和恢复的总成本怎样评估？

**研究主题**：效果与总成本

#### 完整回答

以“恢复目标路径并通过hash和业务核对”为合格单位。首次需构建/安装、配置存储与覆盖规则；持续每轮扫描和持久检查点消耗磁盘、IO及等待，path identity cache减少重复读取但不能把作者单个工作负载的237秒到7秒外推到本地。失败恢复额外产生rescue、journal与人工核对，保留点和Git对象回收也有维护成本。未测相同任务下的总耗时和空间，不能宣称无成本安全网。

#### 证据与依据

**依据 1 · 源码核查**：[src/path-cache.ts:28-53](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/src/path-cache.ts#L28-L53)

缓存按文件系统身份判断可复用，而非每次重读。

<details>
<summary>查看原文（26行）</summary>

```text
/** Stable identity string for one observed filesystem object. */
export function pathCacheKey(info: BigIntStats): string {
  return `${info.dev}:${info.ino}:${info.size}:${info.mtimeNs}:${info.ctimeNs}:${info.mode.toString()}`
}

/** Remember what one unknown does not already describe. */
export function toPathCacheEntry(info: BigIntStats, entry: SnapshotEntry): PathCacheEntry {
  return {
    dev: info.dev.toString(),
    ino: info.ino.toString(),
    size: info.size.toString(),
    mtimeNs: info.mtimeNs.toString(),
    ctimeNs: info.ctimeNs.toString(),
    mode: Number(info.mode & 0o777n),
    entry,
  }
}

/** Whether a cached record still describes the object the filesystem reports now. */
export function matchesPathCache(record: PathCacheEntry, info: BigIntStats): boolean {
  return record.dev === info.dev.toString()
    && record.ino === info.ino.toString()
    && record.size === info.size.toString()
    && record.mtimeNs === info.mtimeNs.toString()
    && record.ctimeNs === info.ctimeNs.toString()
    && record.mode === Number(info.mode & 0o777n)
```

</details>

#### 缺口

- 缺少实际项目规模、变化比例、恢复时间和存储曲线
  **影响**：无法给出本地节时/空间估计
  **进一步探讨**：按不同文件数、二进制比例与变化率记录冷/热捕获、恢复及清理的全部成本

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 恢复失败的状态分类是否值得复用？

**研究主题**：工程质量与复用

#### 完整回答

值得借鉴的是失败后先写rollback-running、尝试rescue恢复并验证，成功与失败分别写rolled-back和recovery-required，且journal写失败保留告警。它避免把“尝试回滚”谎称“已恢复”，但回滚也会失败，需用户按rescue与journal处理。只读计划和mutation分开、session确认及path-level hash可迁移到其他批量文件工具，复用要同时保留恢复日志和存储分离约束。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:688-743](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/src/engine.ts#L688-L743)

主失败、补偿失败与日志失败被分别处理。

<details>
<summary>查看原文（56行）</summary>

```text
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
              'RESTORE_FAILED_ROLLED_BACK',
              `restore failed and the pre-restore state was recovered from ${rescue.id}: ${primaryError}${warningText}`,
              { cause: error },
            )
          }

          const rollbackMessage = errorMessage(rollbackFailure)
          let recoveryJournalWarning: string | undefined
          try {
            await this.store.writeOperation({
              ...operation,
              state: 'recovery-required',
              error: primaryError,
              rollbackError: rollbackMessage,
            })
          } catch (journalError) {
            recoveryJournalWarning = `could not persist recovery-required state: ${errorMessage(journalError)}`
          }
          const warnings = [journalWarning, recoveryJournalWarning].filter((value): value is string => value !== undefined)
          const warningText = warnings.length === 0 ? '' : `; journal warning: ${warnings.join('; ')}`
          throw new ChangeLedgerError(
            'RECOVERY_REQUIRED',
            `restore and automatic rollback both failed; operation ${operation.id} can be recovered from rescue point ${rescue.id}: ${primaryError}; rollback: ${rollbackMessage}${warningText}`,
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 怎样让用户更准确理解部分恢复？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是回退预览显式列出“文件覆盖矩阵+外部副作用清单”，并让任务运行时记录潜在外部写操作，可减少用户把文件回退当整体撤销。推导来自partial point和会话/文件分离。最小验证用有超大文件、ignored配置及模拟外部写入的任务，比较普通差异列表与覆盖矩阵对用户恢复范围判断正确率、漏确认和人工时间；若用户仍误判或负担明显增加，应缩小为更明确的“已记录文件恢复”。

#### 证据与依据

**依据 1 · 源码核查**：[src/snapshot.ts:179-189](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/src/snapshot.ts#L179-L189)

checkpoint携带skipped、truncated、数量与hash，足以作为覆盖矩阵输入。

<details>
<summary>查看原文（11行）</summary>

```text
  return {
    source,
    entries,
    ...(gitCapture === undefined ? {} : { gitEntries: gitCapture.entries }),
    skipped,
    skippedCount,
    skippedListTruncated: skippedCount > skipped.length,
    ...(truncated === undefined ? {} : { truncated }),
    treeHash: hashTree(entries),
    fileCount: Object.keys(entries).length,
    totalBytes,
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 什么用户适合试用，恢复前应检查什么？

**研究主题**：采用判断

#### 完整回答

经常让Agent改本地项目且愿意审阅差异的开发者可在非关键副本试用。先手工备份并覆盖新增/删除/二进制/符号链接样本，核对skip清单，再测试预览后改文件会拒绝、fork失败补偿和rescue可读。正式项目恢复前停掉其他写入者；外部部署和服务状态由用户单独处理。未做本版本安装与恢复演练，因此只支持可控试用，不代替备份制度。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:624-661](https://github.com/Anionex/dsh-turn-rewind/blob/5b33fd51925dbd615836d72323e89262796efae5/src/engine.ts#L624-L661)

精确确认、session及rescue前后重复检查是可验收路径。

<details>
<summary>查看原文（38行）</summary>

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
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
