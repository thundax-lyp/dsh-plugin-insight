# dsh-checkpoint-rewind

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6be3f52](https://github.com/PerryLink/dsh-checkpoint-rewind/tree/6be3f52baad3430dfce4e857366f6ed125c94486)

<!-- BEGIN META -->
[![GitHub ★ 30](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=30&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-checkpoint-rewind) [![npm 30d 5,429](https://img.shields.io/static/v1?label=npm+30d&message=5%2C429&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-checkpoint-rewind) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-checkpoint-rewind)
<!-- END META -->

> **功能**：为 DeepSeek Harness 保存工作区、会话游标和插件配置检查点，支持预览差异与确认后恢复。

> **亮点**：[Q01](#research-q01) 显示，变更前事件与三种状态关联，提供对比及确认恢复入口；[Q03](#research-q03) 以生成子会话保留原记录。

> **主要限制**：[Q03](#research-q03) 显示，回退分段执行且失败时可能已经改写文件，默认保护快照失败只警告；[Q02](#research-q02) 的 Git 和 copy 覆盖范围也不同。

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
  - [Q01 · 变更前实际捕获什么？](#detail-section-11)
  - [Q02 · 文件恢复、重置和留存范围怎样区分？](#detail-section-12)
  - [Q03 · 确认、保护、配置与会话回放如何衔接？](#detail-section-13)
  - [Q04 · 怎样试用并评估绑定预览及失败恢复？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：让 DSH 编辑项目文件的开发者，可以为变更前保存可定位的检查点，并回读一部分工作区或会话。

手工 Git 备份、恢复文件与保留会话可以实现类似目标。插件把这些引用集中在同一条记录。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 捕获检查点 | 保存文件、配置和游标 | 依宿主事件与存储，工作区去重会跳过 |
| 预览与恢复 | 选择范围后恢复文件及配置 | 确认后分阶段执行，失败可能留下部分状态 |
| 会话回放 | 保留原会话并从边界创建子会话 | 只使用最近闭合轮次或空种子 |

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH commands、sessions 和宿主存储 | 基础功能需要 | 注册入口、储存及定位检查点 | 命令无法保存或读取 |
| 可用 Git 或 copy 存储 | 文件快照需要 | 捕获及恢复文件 | 运行失败或切换提供者 |
| 宿主确认服务 | 覆盖写入需要 | 让用户明确选择 | 失败关闭 |
| 设置服务 | 跨重启恢复配置需要 | 写设置或 profile | 仅进程内生效 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在一次性仓库保存一个标记文件及已有状态 | 回读保护和快照位置 |
| 预览 | 用户确认目标文件和提供者 | 影响范围可解释 |
| 恢复 | 用户选择性恢复并核验内容、索引 | 不一致时逐项用原备份回查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主环境、快照储存 | 配置兼容服务及备份 | 耗时与空间未知 |
| 持续 | 捕获、存储和清理开支 | 管理保留范围与处理未跟踪文件 | 项目规模影响未测 |
| 失败恢复 | 部分恢复后的额外文件检查 | 核查设置、会话、保护点及手动恢复 | 真实时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 定位 | 按检查点绑定会话和工作区 | 实际覆盖全部改动 |
| 恢复 | 逐段执行与结果提示 | 异常后的完整一致性 |
| 预览 | Web 时间线、差异和影响预览 | 人工判断速度与误操作率 |

> **思考**：[Q03](#research-q03) 显示，回退分段执行且失败时可能已经改写文件，默认保护快照失败只警告；[Q02](#research-q02) 的 Git 和 copy 覆盖范围也不同。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 显示，变更前事件与三种状态关联，提供对比及确认恢复入口；[Q03](#research-q03) 以生成子会话保留原记录。

捕获和不同存储提供者各自封装。重放使用最近闭合轮次，恢复报告按段输出；阶段失败后仍要核对已写状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示，回退分段执行且失败时可能已经改写文件，默认保护快照失败只警告；[Q02](#research-q02) 的 Git 和 copy 覆盖范围也不同。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先在一次性工作区预览并测试单个文件覆盖，核对内容与索引。遇到保护点或分段结果不清楚时停止，并用独立备份核查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持快照接线、确认、文件及会话恢复，未在真实宿主测得链路与故障恢复。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、index.mjs、client/index.js、lib/providers/registry.mjs、lib/providers/git.mjs、lib/providers/copy.mjs、lib/gate.mjs、lib/constants.mjs、lib/session.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖固定源码的捕获、Git/copy、确认、恢复及回放。未运行插件、宿主或任何目标代码。
- 下一步：在隔离工作区比较 tracked、untracked、配置失败及重载，回读部分阶段和保护点，核验独立备份。

**分析版本**

- **仓库**：[PerryLink/dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)
- **版本号**：0.6.34（[固定提交 6be3f52](https://github.com/PerryLink/dsh-checkpoint-rewind/tree/6be3f52baad3430dfce4e857366f6ed125c94486)）
- **版本日期**：2026-11-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出用确认中的影响范围与实际保护点摘要约束执行，以测量确认后变化及恢复代价。

在隔离工作区比较 tracked、untracked、配置失败及重载，回读部分阶段和保护点，核验独立备份。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 3682 | — | — | 47625 |
| .js | source | 1 | 809 | 733 | 22 | — |
| .mjs | source | 27 | 6342 | 4063 | 1996 | — |
| .mjs | test | 22 | 5639 | 4362 | 933 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PerryLink/dsh-checkpoint-rewind/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/PerryLink/dsh-checkpoint-rewind/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PerryLink/dsh-checkpoint-rewind/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 恢复一次不满意的代码操作时，检查点可以保留和恢复哪些状态，失败后从何处核对及撤回？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 变更前实际捕获什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

在 DSH 开发中反复让工具编辑工作区的用户，有时想撤回某一步又保留原会话。手工 Git 快照及另外保留会话历史可以完成类似操作，需要自行找出相同时点。插件把文件引用、会话序号和插件配置登记成一个检查点，提供时间线及差异入口，用户随后可以选择恢复哪部分。

宿主监听 fs 写入和编辑意图，并在预置的工具名命中时等待同一个捕获。开放步骤内按会话、轮次和步骤去重，并发共享；失败以结果或日志记录，后续工具继续，所以捕获不是强制阻断策略。捕获读取当前会话游标和最近闭合轮次，选 Git 或 copy 提供者，拿到工作区引用后把配置与短号写进宿主表。如果提供者判工作区不变，会提前返回去重结果，当前会话游标及配置也不会成为单独检查点。定时捕获在步骤事件上检查间隔，需要 DSH 步骤流，不能只看墙钟推定已生成。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:1055-1065](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L1055-L1065)

写入意图及列入设置的工具真实调用。

<details>
<summary>查看原文（11行）</summary>

```text
  const snapshotPassThrough = async (session, trigger, next) => {
    await snapshotForMutation(session, trigger)
    return next()
  }
  ctx.on('fs/write-intent', (target, actor, next) => snapshotPassThrough(sessionOfActor(actor), 'fs/write-intent', next), { prepend: true })
  ctx.on('fs/edit-intent', (target, actor, next) => snapshotPassThrough(sessionOfActor(actor), 'fs/edit-intent', next), { prepend: true })
  ctx.on('tools/pre-execute', (exec, next) => {
    if (getLive().mutationTools.includes(exec?.name)) {
      return snapshotPassThrough(exec?.agent?.session, exec.name, next)
    }
    return next()
```

</details>

**依据 2 · 源码核查**：[index.mjs:875-895](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L875-L895)

每步共享捕获及完成后标记。

<details>
<summary>查看原文（21行）</summary>

```text
  async function snapshotForMutation(session, triggerTool) {
    if (session === null || session === undefined) return
    const pos = currentStepOf(session)
    if (pos === undefined) return // 不在开放步骤内：没有可关联的边界。
    const state = ensureState(session)
    const windowKey = `${pos.turn}:${pos.step}`
    if (state.snapshotKey === windowKey) return
    if (state.inFlight !== undefined) {
      await state.inFlight.catch(() => {})
      return // 并发意图：共享同一捕获（成功与否都不重试本步骤）。
    }
    const run = (async () => {
      try {
        await captureCheckpoint(session, { kind: CHECKPOINT_KINDS.MUTATION, triggerTool })
      } finally {
        state.inFlight = undefined
        state.snapshotKey = windowKey
      }
    })()
    state.inFlight = run
    await run
```

</details>

**依据 3 · 源码核查**：[index.mjs:905-925](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L905-L925)

自动按步骤和配置间隔检查。

<details>
<summary>查看原文（21行）</summary>

```text
  async function autoCheckpointOnStep(session) {
    const auto = getLive().autoCheckpoint
    if (auto.enabled !== true) return
    const state = ensureState(session)
    const now = Date.now()
    if (auto.intervalMinutes > 0 && state.lastAutoAt !== undefined
      && now - state.lastAutoAt < auto.intervalMinutes * 60000) {
      return
    }
    if (state.autoInFlight !== undefined) {
      await state.autoInFlight.catch(() => {})
      return
    }
    const run = (async () => {
      const result = await captureCheckpoint(session, { kind: CHECKPOINT_KINDS.AUTO, triggerTool: AUTO_TRIGGER })
      if (result?.failed === undefined) state.lastAutoAt = Date.now()
    })()
    state.autoInFlight = run
    try {
      await run
    } finally {
```

</details>

**依据 4 · 源码核查**：[index.mjs:730-766](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L730-L766)

会话前置、游标、提供者及超时。

<details>
<summary>查看原文（37行）</summary>

```text
  async function captureCheckpoint(session, opts) {
    const cwd = session.header?.cwd
    if (typeof cwd !== 'string' || cwd.length === 0) {
      warn('checkpoint skipped: session has no cwd')
      return undefined
    }
    const pos = currentStepOf(session) ?? latestStepOf(session)
    if (pos === undefined) {
      logger.debug(`checkpoint skipped: session has no turn/step history yet (trigger ${opts.triggerTool})`)
      return undefined
    }
    try {
      const cursor = session.seq
      const boundary = sessionBoundaryAt(sessionEvents(session), cursor)
      const table = await getTablePromise()
      const provider = await registry.resolve(getLive().provider, { cwd, key: workspaceKeyOf(cwd) })
      const ownPrevious = latestRecordFor(table, session.id, cwd)
      const previous = ownPrevious ?? latestWorkspaceRecordFor(table, cwd, getLive().snapshotDir)
      const previousRef = previous !== undefined && previous.provider === provider.name ? previous.ref : undefined
      const forceCapture = ownPrevious === undefined && previousRef !== undefined
      let result
      const controller = new AbortController()
      let timedOut = false
      let timer
      const captureTimeoutMs = getLive().captureTimeoutMs ?? DEFAULTS.CAPTURE_TIMEOUT_MS
      const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => {
          timedOut = true
          controller.abort()
          reject(new Error(`checkpoint capture timed out after ${captureTimeoutMs} ms`))
        }, captureTimeoutMs)
      })
      try {
        result = await Promise.race([
          provider.snapshot(
            { cwd, key: workspaceKeyOf(cwd) },
            { triggerTool: opts.triggerTool, previousRef, signal: controller.signal, forceCapture },
```

</details>

**依据 5 · 源码核查**：[index.mjs:780-821](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L780-L821)

工作区去重提前返回，以及三态记录、编号和清理。

<details>
<summary>查看原文（42行）</summary>

```text
      if (result === null) {
        logger.debug(`checkpoint deduped: workspace unchanged (trigger ${opts.triggerTool})`)
        const detail = await dedupDetailOf(provider, previous, { cwd, key: workspaceKeyOf(cwd) })
        return { deduped: true, detail }
      }
      const note = typeof opts.note === 'string' && opts.note.trim().length > 0
        ? opts.note.trim().slice(0, LIMITS.MAX_NOTE_LENGTH)
        : undefined
      const id = randomUUID()
      const fields = {
        sessionId: session.id,
        cwd,
        seq: cursor,
        time: Date.now(),
        provider: provider.name,
        kind: opts.kind,
        triggerTool: opts.triggerTool,
        turn: pos.turn,
        step: pos.step,
        files: result.files,
        bytes: result.bytes,
        ref: result.ref,
        tree: result.tree ?? null,
        config: snapshotConfigOf(getLive()),
        ...(note === undefined ? {} : { note }),
        ...(typeof boundary === 'number' ? { sessionBoundary: boundary } : {}),
      }
      // 短号分配与记录落盘放在同一个 schedule 作业里：计数水的读-改-写绝不能被
      // 并发捕获（自动快照与变更安全网各有一条链）交错，否则两条记录会同号。
      const record = await schedule(async () => {
        const short = (await ensureShortNumbers(table, session.id)) + 1
        const withShort = { id, short, ...fields }
        await table.put(id, withShort)
        await raiseShortWatermark(session.id, short)
        return withShort
      })
      if (record.bytes > getLive().maxSnapshotBytes) {
        warn(`checkpoint ${record.id} alone exceeds maxSnapshotBytes (${record.bytes} > ${getLive().maxSnapshotBytes}); the per-session newest-retained floor keeps it, older checkpoints will be pruned`)
      }
      appendEvent(session, SESSION_EVENTS.SNAPSHOT, record)
      logger.info(`checkpoint #${record.short} ${record.id} captured (${record.kind}, ${record.provider}, turn ${record.turn} step ${record.step}, cursor seq ${record.seq}, ${record.files} files, ${record.bytes} bytes, trigger ${record.triggerTool})`)
      await pruneAll(session)
```

</details>

**依据 6 · 源码核查**：[client/index.js:781-799](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/client/index.js#L781-L799)

设置槽挂载时间线、差异及预览。

<details>
<summary>查看原文（19行）</summary>

```text
    async function apply(ctx) {
      ctx.effect(function () { return ctx.locale.register(NS, locales) }, 'dsh-checkpoint-rewind: dictionaries')
      ctx.effect(function () { installStyles() }, 'dsh-checkpoint-rewind: stylesheet')
      await ctx.remote.$mount({ package: 'dsh-checkpoint-rewind', descriptors: PANEL_INVOCATIONS })
      ctx.inject(['remote.checkpointPanel'], function (scope) {
        var t = scope.locale.bind(NS)
        var timeline = function (args) { return Promise.resolve(scope.remote.checkpointPanel.timeline(args && args.limit)).then(unwrap) }
        var diff = function (from, to) { return Promise.resolve(scope.remote.checkpointPanel.diff(from, to)).then(unwrap) }
        var restorePreview = function (id) { return Promise.resolve(scope.remote.checkpointPanel.restorePreview(id)).then(unwrap) }
        scope.slots.inject('settings.plugins.tab', function () {
          return scope.slots.register({
            name: 'settings.plugins.tab',
            id: 'checkpoints',
            order: 20,
            label: function () { return t('tab') },
            locale: NS,
            inject: function () { return { timeline, diff, restorePreview } },
          }, CheckpointTab)
        })
```

</details>

#### 缺口

- 固定宿主上未复测不同工具发出的事件及快照延迟。
  **影响**：无法断言每种文件变更都先被捕获。
  **进一步探讨**：在一次性工作区分别触发已登记工具和外部手工变更，核对检查点和事件顺序。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件恢复、重置和留存范围怎样区分？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

auto 先探测 Git，Git 不可用才选 copy。Git 捕获使用 stash create 或干净时的 commit-tree，另外更新 refs/dsh-checkpoints 引用防止回收，因而虽不需移动工作分支，也会写 Git 对象及引用。常规范围来自快照里的已跟踪路径；未跟踪文件不在这份保证中。恢复先校验对象与所选路径，再按批只向工作树还原快照内路径，报告遗留文件，不主动清除快照之后新增的其余路径。显式 reset-hard 则直接调用 Git 重置，影响 HEAD、索引和文件，不能把常规工作树覆盖的边界套过去。

copy 使用自己的文件清单，恢复前检查所选路径和写目标，发现路径逃逸或符号链接可拒绝。随后每个文件单独覆盖、核内容哈希，取消也只在逐文件检查，比集中一次写有更多可观察停点。第一项已写且后续失败时可能留下部分状态；哈希比较发生在覆盖之后，报哈希错误不能保证原内容还在。选择带文件清单覆盖的方式时，额外关注新文件、快照目录完整性、权限和磁盘占用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/providers/registry.mjs:65-74](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/lib/providers/registry.mjs#L65-L74)

auto 先探测 Git，退回 copy。

<details>
<summary>查看原文（10行）</summary>

```text
      case PROVIDER_MODES.AUTO: {
        const git = this.#providers.get(PROVIDERS.GIT)
        if (git !== undefined) {
          const probe = await git.available(workspace, signal)
          if (probe.ok) return git
        }
        const copy = this.#providers.get(PROVIDERS.COPY)
        if (copy === undefined) throw providerUnavailable(PROVIDERS.COPY, 'provider not registered (git unavailable)')
        return copy
      }
```

</details>

**依据 2 · 源码核查**：[lib/providers/git.mjs:210-229](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/lib/providers/git.mjs#L210-L229)

Git 实际对象和引用写入。

<details>
<summary>查看原文（20行）</summary>

```text
  snapshot(workspace, ctx) {
    return withLock(this.#chains, workspace.key, async () => {
      if (ctx.previousRef !== undefined) assertSafeRef(ctx.previousRef)
      let sha = (await this.#git(workspace.cwd, ['stash', 'create'])).stdout.trim()
      if (sha === '') {
        // 工作树干净：没有可 stash 的脏状态；用 commit-tree 固定 HEAD 树。
        // -p HEAD 让快照提交的父指针为 HEAD：变更集为空、增量字节为 0。
        const head = (await this.#git(workspace.cwd, ['rev-parse', 'HEAD'])).stdout.trim()
        sha = (await this.#git(workspace.cwd, ['commit-tree', `${head}^{tree}`, '-p', head, '-m', 'dsh-checkpoint-rewind snapshot'])).stdout.trim()
      }
      if (sha === '') throw providerFailed(PROVIDERS.GIT, 'snapshot', 'git produced an empty snapshot object id')
      // Pin the otherwise-unreferenced commit under refs/dsh-checkpoints/ so
      // git gc/prune cannot silently make the snapshot unrestorable (#24).
      const pinned = await this.#git(workspace.cwd, ['update-ref', `refs/dsh-checkpoints/${sha}`, sha])
      if (pinned.code !== 0) {
        throw providerFailed(PROVIDERS.GIT, 'snapshot', pinned.stderr.trim() || `git update-ref exited ${pinned.code}`)
      }
      if (ctx.previousRef !== undefined && ctx.forceCapture !== true) {
        const same = await this.#git(workspace.cwd, ['diff', '--quiet', ctx.previousRef, sha, '--'])
        if (same.code === 0) return null
```

</details>

**依据 3 · 源码核查**：[lib/providers/git.mjs:288-327](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/lib/providers/git.mjs#L288-L327)

Git 对象校验、按路径覆盖及遗留报告。

<details>
<summary>查看原文（40行）</summary>

```text
  async restore(workspace, ref, _signal, files) {
    assertSafeRef(ref)
    return withLock(this.#chains, workspace.key, async () => {
      // 存在性探测：快照对象被 gc/prune 清理时响亮失败（关闭 FAQ 记载的静默 restored: 0 盲区）
      const exists = await this.#git(workspace.cwd, ['cat-file', '-e', ref])
      if (exists.code !== 0) {
        throw providerFailed(PROVIDERS.GIT, 'restore', `checkpoint commit object ${ref} is missing or garbage-collected`)
      }
      const tracked = (await this.#git(workspace.cwd, ['ls-tree', '-r', '--name-only', ref])).stdout
        .trim().split('\n').filter(line => line.length > 0)
      const trackedSet = new Set(tracked)
      if (files !== undefined) {
        const unknown = files.filter(name => !trackedSet.has(name))
        if (unknown.length > 0) {
          throw providerFailed(PROVIDERS.GIT, 'restore', `unknown file(s) not present in the checkpoint tree: ${unknown.join(', ')}`)
        }
      }
      const restorable = files === undefined ? tracked : tracked.filter(name => files.includes(name))
      const changed = (await this.#git(workspace.cwd, ['diff', '--name-only', ref, '--'])).stdout
        .trim().split('\n').filter(line => line.length > 0)
      const changedSet = new Set(changed)
      const restoredCount = restorable.filter(name => changedSet.has(name)).length
      for (const chunk of chunkList(restorable, RESTORE_PATH_BATCH)) {
        const applied = await this.#git(workspace.cwd, ['restore', `--source=${ref}`, '--worktree', '--', ...chunk])
        if (applied.code !== 0) {
          throw providerFailed(PROVIDERS.GIT, 'restore', applied.stderr.trim() || `git restore exited ${applied.code}`)
        }
      }
      // 遗留报告：未跟踪新文件 ∪ 检查点后新增且已进入索引的文件（工作树相对
      // ref 的新增路径）——都只报告、不删除，与 copy provider 对称。
      const untracked = await this.#untracked(workspace.cwd)
      const added = (await this.#git(workspace.cwd, ['diff', '--name-only', '--diff-filter=A', ref, '--'])).stdout
        .trim().split('\n').filter(line => line.length > 0)
      const leftovers = [...new Set([...untracked, ...added])].sort()
      return {
        restored: restoredCount,
        leftovers,
        notes: leftovers.length > 0
          ? [`${leftovers.length} file(s) created after the checkpoint were left in place (never deleted without git clean)`]
          : [],
```

</details>

**依据 4 · 源码核查**：[lib/providers/git.mjs:407-422](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/lib/providers/git.mjs#L407-L422)

显式 reset --hard 的实际调用。

<details>
<summary>查看原文（16行）</summary>

```text
  async resetHard(workspace, ref, _signal) {
    assertSafeRef(ref)
    return withLock(this.#chains, workspace.key, async () => {
      const changed = (await this.#git(workspace.cwd, ['diff', '--name-only', ref, '--'])).stdout
        .trim().split('\n').filter(line => line.length > 0)
      const applied = await this.#git(workspace.cwd, ['reset', '--hard', ref])
      if (applied.code !== 0) {
        throw providerFailed(PROVIDERS.GIT, 'reset', applied.stderr.trim() || `git reset exited ${applied.code}`)
      }
      const untracked = await this.#untracked(workspace.cwd)
      return {
        restored: changed.length,
        leftovers: untracked,
        notes: [
          `branch head moved to snapshot commit ${ref.slice(0, 12)} (git reset --hard); pre-snapshot history remains recoverable via reflog`,
          ...(untracked.length > 0 ? [`${untracked.length} untracked file(s) were left in place (never deleted without git clean)`] : []),
```

</details>

**依据 5 · 源码核查**：[lib/providers/copy.mjs:221-253](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/lib/providers/copy.mjs#L221-L253)

文件清单、逐文件取消和路径验证。

<details>
<summary>查看原文（33行）</summary>

```text
  async restore(workspace, ref, signal, files) {
    return withLock(this.#chains, workspace.key, async () => {
      const base = this.#baseDir(workspace)
      const manifest = await this.#loadManifest(base, ref)
      const byRel = new Map(manifest.files.map(entry => [entry.rel, entry]))
      let targetEntries = manifest.files
      if (files !== undefined) {
        const unknown = files.filter(rel => !byRel.has(rel))
        if (unknown.length > 0) {
          throw providerFailed(PROVIDERS.COPY, 'restore', `unknown file(s) not present in the checkpoint manifest: ${unknown.join(', ')}`)
        }
        targetEntries = files.map(rel => /** @type {ManifestFile} */ (byRel.get(rel)))
      }
      const snapshotRoot = path.join(base, ref)
      const workspaceRoot = path.resolve(workspace.cwd)
      const notes = []
      const checkedDirs = new Set([workspaceRoot])
      let restored = 0
      for (const entry of targetEntries) {
        signal?.throwIfAborted()
        const src = path.join(snapshotRoot, entry.rel)
        const dst = path.resolve(workspace.cwd, entry.rel)
        if (!dst.startsWith(workspaceRoot + path.sep) && dst !== workspaceRoot) {
          throw new Error(`checkpoint manifest entry escapes the workspace: ${entry.rel}`)
        }
        // 写目标必须走真实路径：copyFile 会跟随符号链接，dst 或其祖先被换成
        // 指向工作区外的 symlink 时会把内容写到工作区之外——响亮拒绝。
        await this.#assertRealFileTarget(workspaceRoot, dst, checkedDirs)
        // 快照存储内的符号链接同样拒绝：跟随它读会把外部文件内容拷进工作区。
        const srcStat = await fs.lstat(src).catch(() => undefined)
        if (srcStat?.isSymbolicLink() === true) {
          throw providerFailed(PROVIDERS.COPY, 'restore', `snapshot storage contains a symbolic link: ${entry.rel} (refusing to read through it)`)
        }
```

</details>

**依据 6 · 源码核查**：[lib/providers/copy.mjs:254-275](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/lib/providers/copy.mjs#L254-L275)

覆盖后核验和逐项权限处理。

<details>
<summary>查看原文（22行）</summary>

```text
        await fs.mkdir(path.dirname(dst), { recursive: true })
        try {
          await fs.copyFile(src, dst)
        } catch (error) {
          throw providerFailed(PROVIDERS.COPY, 'restore', `copying ${entry.rel}: ${error instanceof Error ? error.message : String(error)}`)
        }
        if (entry.hash !== undefined) {
          const actual = await hashFile(dst)
          if (actual !== entry.hash) {
            throw providerFailed(PROVIDERS.COPY, 'restore', `content hash mismatch for ${entry.rel}: checkpoint storage may be corrupted`)
          }
        }
        try {
          await fs.chmod(dst, entry.mode & 0o7777)
        } catch (error) {
          notes.push(`mode restore failed for ${entry.rel} (content restored): ${error instanceof Error ? error.message : String(error)}`)
        }
        restored += 1
      }
      const leftovers = await this.#listLeftovers(workspace, manifest.files)
      if (leftovers.length > 0) {
        notes.push(`${leftovers.length} file(s) created after the checkpoint were left in place (overwrite rollback never deletes files)`)
```

</details>

#### 缺口

- 未在真实工作区复现文件竞态、索引变化或恢复中断。
  **影响**：无法保证多文件同一时刻完成或所有路径情形都受测。
  **进一步探讨**：准备跟踪、未跟踪和只读样本，比较覆盖前后摘要、索引和剩余文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 确认、保护、配置与会话回放如何衔接？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

命令先生成影响说明，再向宿主确认。自动选择优先用 userQuestions，缺失时可能走 approval；两种都缺、自由文本、拒绝或失败时中止。approval 需要开放轮次，跨轮次命令在该通道可直接拒绝。确认后尝试保护快照，捕获明确报错时只有 require 会中止，默认 warn 继续。若工作区未变触发去重，guard 可以没有新记录，也不证明当时配置单独留存。

工作区先执行，失败时不继续配置和回放，已经恢复的路径可能存在。之后配置写设置服务，缺服务时还原到进程内，重启会加载 profile 默认。会话恢复按检查点之前最近的 turn/end 截取，优先用官方 fork，否则 create seeded child；没有闭合轮次时种子空。原会话保留。配置或会话失败会分段返回 partial，不自动逆转前面的文件写入。即使用户收到命令错误，也应分别检查工作区、设置及有没有子会话，以保护点或另外的备份作为恢复依据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/gate.mjs:42-47](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/lib/gate.mjs#L42-L47)

确认通道选择。

```text
export function pickChannel(confirmVia, ctx) {
  if (confirmVia === CONFIRM_CHANNELS.USER_QUESTIONS) return CONFIRM_CHANNELS.USER_QUESTIONS
  if (confirmVia === CONFIRM_CHANNELS.APPROVAL) return CONFIRM_CHANNELS.APPROVAL
  if (ctx.get('userQuestions') !== undefined) return CONFIRM_CHANNELS.USER_QUESTIONS
  if (ctx.get('approval') !== undefined) return CONFIRM_CHANNELS.APPROVAL
  return 'none'
```

**依据 2 · 源码核查**：[lib/gate.mjs:94-130](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/lib/gate.mjs#L94-L130)

确认结果与无开放轮次的拒绝条件。

<details>
<summary>查看原文（37行）</summary>

```text
      const item = answer?.answers?.find(entry => entry.id === CONFIRM_QUESTION_ID)
      const selected = Array.isArray(item?.selected) ? item.selected : []
      const custom = typeof item?.custom === 'string' && item.custom.length > 0 ? item.custom : undefined
      if (custom !== undefined) {
        return { allowed: false, channel, reason: 'free-text answer is not an approval' }
      }
      if (selected.includes(text.approveLabel)) return { allowed: true, channel }
      return { allowed: false, channel, reason: 'user chose not to restore' }
    } catch (error) {
      return { allowed: false, channel, reason: `userQuestions ask failed: ${error instanceof Error ? error.message : String(error)}` }
    } finally {
      if (timer !== undefined) clearTimeout(timer)
    }
  }
  if (channel === CONFIRM_CHANNELS.APPROVAL) {
    // 宿主的 approval.request 无开放轮次即抛（审计对必须包在 turn 内），
    // 而 /rewind 命令运行于轮次之间：这里前置检测并给出可操作文案。
    if (!hasOpenTurn(typeof agentRef?.session?.snapshotEvents === 'function' ? agentRef.session.snapshotEvents() : agentRef?.session?.events)) {
      return {
        allowed: false,
        channel,
        reason: 'approval requires an open turn; /rewind commands run between turns — mount userQuestions or set confirmVia: userQuestions',
      }
    }
    const service = /** @type {{request?: (input: object) => Promise<string>}} */ (deps.ctx.get('approval'))
    if (service === undefined || typeof service.request !== 'function') {
      return { allowed: false, channel, reason: 'no approval answerer (fail closed)' }
    }
    try {
      const outcome = await service.request({ agent, toolName: 'rewind', reason: deps.summary, signal })
      if (outcome === 'allowed-once') return { allowed: true, channel }
      return { allowed: false, channel, reason: `approval outcome ${JSON.stringify(outcome)}` }
    } catch (error) {
      return { allowed: false, channel, reason: `approval ask failed: ${error instanceof Error ? error.message : String(error)}` }
    }
  }
  return { allowed: false, channel: 'none', reason: 'no confirmation answerer available (fail closed)' }
```

</details>

**依据 3 · 源码核查**：[lib/constants.mjs:147-158](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/lib/constants.mjs#L147-L158)

默认保护失败 warn，工作区用常规 restore。

<details>
<summary>查看原文（12行）</summary>

```text
    'Library', 'Temp', 'Logs', 'obj', 'bin', '.vs', '.idea', 'UserSettings',
  ]),
  CONFIRM_VIA: CONFIRM_CHANNELS.AUTO,
  LIST_LIMIT: 10,
  PRE_REWIND_CHECKPOINT: PRE_REWIND_MODES.WARN,
  VERIFY_BY_HASH: false,
  // 自动间隔快照（step/start 时检查；intervalMinutes=0 表示每步；enabled=false 关闭）。
  AUTO_CHECKPOINT_ENABLED: true,
  AUTO_CHECKPOINT_INTERVAL_MINUTES: 0,
  // 工作区回滚实现（restore 为安全默认；reset-hard 为 CC 对标模式）。
  WORKSPACE_RESTORE: WORKSPACE_RESTORE_MODES.RESTORE,
  // 设置页两两 diff 的默认渲染器（pairwise 行级文本为现状默认；side-by-side 可选）。
```

</details>

**依据 4 · 源码核查**：[index.mjs:940-949](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L940-L949)

保护捕获报错与无记录分支。

<details>
<summary>查看原文（10行）</summary>

```text
    const result = await captureCheckpoint(session, {
      kind: CHECKPOINT_KINDS.GUARD,
      triggerTool: PRE_REWIND_TRIGGER,
      retryWithoutBaseline: true,
    })
    // 保护检查点失败必须上抛（require → 中止；warn → 降级继续），
    // 与"保护失败只警告"的语义区分由 handleRewind 的 catch 承担。
    if (result?.failed !== undefined) throw new Error(result.failed)
    if (result === undefined || result.record === undefined) return undefined
    return result
```

</details>

**依据 5 · 源码核查**：[index.mjs:1632-1667](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L1632-L1667)

真正确认后的保护阶段和告警继续。

<details>
<summary>查看原文（36行）</summary>

```text
    // 确认门：任何覆盖/回滚写操作必须先经 ask 语义，无回答者失败关闭。
    const texts = confirmTextsFor(targets)
    const verdict = await confirmRewind({ ctx, confirmVia: getLive().confirmVia, summary, ...texts }, agent, signal)
    if (!verdict.allowed) {
      appendEvent(session, SESSION_EVENTS.REWIND, {
        checkpointId: record.id, sessionId: session.id, outcome: REWIND_OUTCOMES.DENIED,
        target: parsed.kind === 'target' ? parsed.target : REWIND_TARGETS.ALL, error: verdict.reason,
      })
      logger.info(`rewind denied: checkpoint ${record.id} (${verdict.channel}: ${verdict.reason})`)
      const err = rewindDenied(verdict.reason ?? 'denied')
      return { kind: 'error', text: `rewind: ${err.message}` }
    }
    logger.info(`rewind approved (${verdict.channel}): checkpoint ${record.id}, targets ${JSON.stringify(targets)}, phase 0.5 = pre-rewind guard`)

    // 阶段 0.5：保护当前状态 —— 先捕获 pre-rewind 检查点，让本次回退可撤回。
    let guard
    try {
      guard = await captureRewindGuard(session)
    } catch (error) {
      const message = messageOf(error)
      if (getLive().preRewindCheckpoint === PRE_REWIND_MODES.REQUIRE) {
        appendEvent(session, SESSION_EVENTS.REWIND, {
          checkpointId: record.id, sessionId: session.id, outcome: REWIND_OUTCOMES.FAILED,
          target: parsed.kind === 'target' ? parsed.target : REWIND_TARGETS.ALL,
          error: `pre-rewind checkpoint failed: ${message}`,
        })
        logger.error(`rewind aborted (pre-rewind checkpoint required): ${message}`)
        return {
          kind: 'error',
          text: `rewind: aborted — the pre-rewind guard checkpoint could not be captured (${message}). Nothing was changed.`,
        }
      }
      logger.warn(`pre-rewind guard checkpoint failed (continuing without reversibility): ${message}`)
    }
    const guardLine = guard?.record !== undefined
      ? `\nrewind guard: ${guard.record.id} (checkpoint #${addressOf(guard.record)}; run "/rewind ${addressOf(guard.record)}" to undo this rewind)`
```

</details>

**依据 6 · 源码核查**：[index.mjs:1685-1718](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L1685-L1718)

文件可能部分写入，配置失败独立处理。

<details>
<summary>查看原文（34行）</summary>

```text
      const useResetHard = impact.mode === WORKSPACE_RESTORE_MODES.RESET_HARD && typeof provider.resetHard === 'function'
      const resetHard = useResetHard && typeof provider.resetHard === 'function' ? provider.resetHard : undefined
      let restore
      try {
        restore = resetHard !== undefined
          ? await resetHard({ cwd, key: workspaceKeyOf(cwd) }, record.ref, signal)
          : await provider.restore({ cwd, key: workspaceKeyOf(cwd) }, record.ref, signal, parsed.files)
      } catch (error) {
        const message = messageOf(error)
        appendEvent(session, SESSION_EVENTS.REWIND, {
          checkpointId: record.id, sessionId: session.id, outcome: REWIND_OUTCOMES.FAILED,
          target: parsed.kind === 'target' ? parsed.target : REWIND_TARGETS.ALL, error: message,
        })
        logger.error(`rewind phase 1 failed (checkpoint ${record.id}, provider ${record.provider}): ${message}`)
        return {
          kind: 'error',
          text: `rewind: failed to restore files from checkpoint ${record.id} (${message}). No session was replayed, no config was restored, and the checkpoint was kept; the workspace may be partially restored.${guardLine}`,
        }
      }
      segments.workspace = { restored: restore.restored, mode: useResetHard ? WORKSPACE_RESTORE_MODES.RESET_HARD : WORKSPACE_RESTORE_MODES.RESTORE }
      notes.push(...(restore.notes ?? []))
      logger.info(`rewind phase 1 ok: ${segments.workspace.mode} restored ${restore.restored} file(s) from checkpoint ${record.id} (${record.provider})`)
    }

    // 阶段 2：配置还原（settings 命名空间写回；失败不阻断会话回退，报告 partial）。
    if (targets.config) {
      try {
        const restored = await restoreConfig(record.config ?? {})
        segments.config = restored
        logger.info(`rewind phase 2 ok: config restored (${restored.durable ? 'persisted' : 'in-process only'}) from checkpoint ${record.id}`)
      } catch (error) {
        const message = messageOf(error)
        segments.config = { error: message }
        logger.error(`rewind phase 2 failed (checkpoint ${record.id}): ${message}`)
```

</details>

**依据 7 · 源码核查**：[index.mjs:1435-1479](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L1435-L1479)

配置持久或内存，以及 fork/create 两条路径。

<details>
<summary>查看原文（45行）</summary>

```text
  async function restoreConfig(snapshot) {
    if (legacySettingsScope !== undefined) {
      await legacySettingsScope.replace(snapshot)
      return { durable: true, note: 'config restored through the settings namespace (persisted in the settings document)' }
    }
    if (settingsForms !== undefined) {
      await settingsForms.replace(checkpointSettingsNamespace(), snapshot)
      return { durable: true, note: 'config restored through the settings forms (persisted in the profile patch)' }
    }
    const next = { ...resolved, ...snapshot }
    validateCheckpointSettings(next)
    setLive(next)
    return { durable: false, note: 'no settings service attached: config restored in-process only (a harness restart reloads cordis.yml defaults)' }
  }

  /**
   * 会话回退：官方重放 —— 以检查点边界为界 seed 出全新子会话。优先走
   * SessionStore.fork（边界前缀深拷贝，fork 自行设定 isSeeded /
   * inheritedEventCount / cwd；0.2.2-rc.3 起 ordinary fork 不再记录
   * parentSession，该字段留给 subagent 的直接创建者）。宿主无 fork 时手搓
   * 回退：create + 显式 `inheritedEventCount: seed.length` + `meta.isSeeded:
   * true`（两者必须同批——宿主对 seeded 构造校验三条），并由本插件显式写入
   * parentSession。原会话完整保留（非破坏，CC 差异化）。
   * @param {import('@deepseek-ai/dsh-session').Session} source - 源会话。
   * @param {import('./types.d.ts').CheckpointRecord} record - 目标检查点。
   * @returns {import('@deepseek-ai/dsh-session').Session} 子会话。
   */
  function replaySession(source, record) {
    const boundary = typeof record.sessionBoundary === 'number' ? record.sessionBoundary : undefined
    if (boundary !== undefined && typeof ctx.sessions.fork === 'function') {
      // 官方 fork：边界前缀深拷贝进子会话（fork 自行设定 isSeeded /
      // inheritedEventCount / cwd；rc.3 起不再记录 parentSession）。
      // boundary 是现有事件 seq，按 SessionSeq 品牌构造（运行时即原数字）。
      return ctx.sessions.fork(source, SessionSeq(boundary))
    }
    // 手搓回退：无闭合边界（空种子全新子会话）或宿主无 fork 时 —— create +
    // 显式 `inheritedEventCount: seed.length` + `meta.isSeeded: true`
    // （两者必须同批——宿主对 seeded 构造校验三条）。
    const seed = replaySeedOf(sessionEvents(source), boundary)
    const meta = {
      ...(typeof source.header?.cwd === 'string' && source.header.cwd.length > 0 ? { cwd: source.header.cwd } : {}),
      parentSession: source.id,
      isSeeded: true,
    }
    return ctx.sessions.create(undefined, { seed, inheritedEventCount: SessionLogOffset(seed.length), meta })
```

</details>

**依据 8 · 源码核查**：[lib/session.mjs:19-37](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/lib/session.mjs#L19-L37)

最近闭合轮次和前缀。

<details>
<summary>查看原文（19行）</summary>

```text
export function sessionBoundaryAt(events, cursor) {
  let boundary
  for (const event of events) {
    if (event.seq > cursor) break
    if (event.type === 'turn/end') boundary = event.seq
  }
  return boundary
}

/**
 * 重放种子事件：边界存在时取 [0, boundary]（含 turn/end 的稳定前缀，
 * 结束于轮次之间）；无边界时为空数组（全新上下文，仅保留血缘）。
 * @param {readonly {type: string, seq: number}[]} events - 会话事件日志（元素含 seq）。
 * @param {number|undefined} boundary - sessionBoundaryAt 的结果。
 * @returns {import('@deepseek-ai/dsh-session').SessionEvent[]} 可交给 sessions.create({seed}) 的事件前缀。
 */
export function replaySeedOf(events, boundary) {
  if (typeof boundary !== 'number') return []
  return /** @type {import('@deepseek-ai/dsh-session').SessionEvent[]} */ (events.slice(0, boundary + 1))
```

</details>

**依据 9 · 源码核查**：[index.mjs:1722-1755](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L1722-L1755)

恢复分段及审计结果。

<details>
<summary>查看原文（34行）</summary>

```text
    // 阶段 3：会话回退（seed 重放新子会话；失败仅报告，原会话不受影响）。
    if (targets.session) {
      try {
        const child = replaySession(session, record)
        segments.session = { childSessionId: child.id, seedLength: child.inheritedEventCount }
        injectReplayNotice(child, record, segments, guard)
        logger.info(`rewind phase 3 ok: replayed session ${child.id} from checkpoint ${record.id} (boundary ${record.sessionBoundary ?? 'none'})`)
      } catch (error) {
        const message = messageOf(error)
        segments.session = { error: message }
        logger.error(`rewind phase 3 failed (checkpoint ${record.id}): ${message}`)
      }
    }

    const workspaceFailed = segments.workspace === undefined && targets.workspace
    const configError = segments.config !== undefined && 'error' in segments.config ? segments.config.error : undefined
    const sessionError = segments.session?.error
    const configFailed = configError !== undefined
    const sessionFailed = sessionError !== undefined
    const outcome = workspaceFailed || configFailed || sessionFailed
      ? (workspaceFailed ? REWIND_OUTCOMES.FAILED : REWIND_OUTCOMES.PARTIAL)
      : REWIND_OUTCOMES.RESTORED
    appendEvent(session, SESSION_EVENTS.REWIND, {
      checkpointId: record.id, sessionId: session.id, outcome,
      target: parsed.kind === 'target' ? parsed.target : REWIND_TARGETS.ALL,
      workspace: segments.workspace !== undefined ? { restored: segments.workspace.restored, mode: segments.workspace.mode } : undefined,
      config: segments.config !== undefined
        ? ('error' in segments.config
          ? { durable: false, error: segments.config.error }
          : { durable: segments.config.durable })
        : undefined,
      session: segments.session !== undefined ? { childSessionId: segments.session.childSessionId, error: segments.session.error } : undefined,
      preCheckpointId: guard?.record?.id,
    })
```

</details>

#### 缺口

- 未在固定的真实宿主复查确认通道和部分恢复时的可观察结果。
  **影响**：不能声称一键恢复具有事务原子性。
  **进一步探讨**：分别模拟保护不可读、配置失败和回放拒绝，对照结果、现存文件、设置及会话。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用并评估绑定预览及失败恢复？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

经常让 DSH 修改代码的用户，可以先在一次性测试仓库保存一个已知状态，只预览并选择性恢复单个测试文件。将恢复后的内容及 staged 变化与预期对照，其他不确定时继续手动 Git 和保存会话。在保护点无法显示、预览有不明路径或确认通道不支持时先停止，不以一条成功消息替代核验。初次需要准备兼容宿主和确认能力，持续需要为快照写对象或文件并维护配额，失败时要人工比对部分状态。剪裁先删记录再尝试丢弃存储，丢弃失败可残留快照；实际磁盘和等待开销需测量。

可验证的变化是给确认时的影响表和保护点绑定工作树、配置和事件游标摘要，开始写入前核对变化，影响变动时要求重新确认。用同样的一次性仓库，在预览后修改一个文件、换配置或让第二阶段失败。与现版和手工快照比较错误覆盖、复核时间、能否恢复原状态。若多一步不能减少误覆盖或延长全部合格操作的时间，就没有证据支持这项设计。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:1622-1647](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L1622-L1647)

现有确认摘要与实际保护点顺序。

<details>
<summary>查看原文（26行）</summary>

```text
    const summary = [
      formatRewindSummary(record),
      '',
      'impact:',
      formatImpact(record, impact),
      ...(parsed.files !== undefined
        ? ['', `selective restore: only ${parsed.files.length} file(s) will be overwritten:`, ...parsed.files.map(file => `  ${file}`)]
        : []),
    ].join('\n')

    // 确认门：任何覆盖/回滚写操作必须先经 ask 语义，无回答者失败关闭。
    const texts = confirmTextsFor(targets)
    const verdict = await confirmRewind({ ctx, confirmVia: getLive().confirmVia, summary, ...texts }, agent, signal)
    if (!verdict.allowed) {
      appendEvent(session, SESSION_EVENTS.REWIND, {
        checkpointId: record.id, sessionId: session.id, outcome: REWIND_OUTCOMES.DENIED,
        target: parsed.kind === 'target' ? parsed.target : REWIND_TARGETS.ALL, error: verdict.reason,
      })
      logger.info(`rewind denied: checkpoint ${record.id} (${verdict.channel}: ${verdict.reason})`)
      const err = rewindDenied(verdict.reason ?? 'denied')
      return { kind: 'error', text: `rewind: ${err.message}` }
    }
    logger.info(`rewind approved (${verdict.channel}): checkpoint ${record.id}, targets ${JSON.stringify(targets)}, phase 0.5 = pre-rewind guard`)

    // 阶段 0.5：保护当前状态 —— 先捕获 pre-rewind 检查点，让本次回退可撤回。
    let guard
```

</details>

**依据 2 · 源码核查**：[index.mjs:1685-1706](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L1685-L1706)

支持文件选择和失败后部分状态。

<details>
<summary>查看原文（22行）</summary>

```text
      const useResetHard = impact.mode === WORKSPACE_RESTORE_MODES.RESET_HARD && typeof provider.resetHard === 'function'
      const resetHard = useResetHard && typeof provider.resetHard === 'function' ? provider.resetHard : undefined
      let restore
      try {
        restore = resetHard !== undefined
          ? await resetHard({ cwd, key: workspaceKeyOf(cwd) }, record.ref, signal)
          : await provider.restore({ cwd, key: workspaceKeyOf(cwd) }, record.ref, signal, parsed.files)
      } catch (error) {
        const message = messageOf(error)
        appendEvent(session, SESSION_EVENTS.REWIND, {
          checkpointId: record.id, sessionId: session.id, outcome: REWIND_OUTCOMES.FAILED,
          target: parsed.kind === 'target' ? parsed.target : REWIND_TARGETS.ALL, error: message,
        })
        logger.error(`rewind phase 1 failed (checkpoint ${record.id}, provider ${record.provider}): ${message}`)
        return {
          kind: 'error',
          text: `rewind: failed to restore files from checkpoint ${record.id} (${message}). No session was replayed, no config was restored, and the checkpoint was kept; the workspace may be partially restored.${guardLine}`,
        }
      }
      segments.workspace = { restored: restore.restored, mode: useResetHard ? WORKSPACE_RESTORE_MODES.RESET_HARD : WORKSPACE_RESTORE_MODES.RESTORE }
      notes.push(...(restore.notes ?? []))
      logger.info(`rewind phase 1 ok: ${segments.workspace.mode} restored ${restore.restored} file(s) from checkpoint ${record.id} (${record.provider})`)
```

</details>

**依据 3 · 源码核查**：[index.mjs:977-994](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/index.mjs#L977-L994)

剪裁先删记录，再尽力丢弃存储。

<details>
<summary>查看原文（18行）</summary>

```text
  async function removeRecords(entries, ids) {
    for (const id of ids) {
      const record = entries.find(entry => entry.key === id)?.value
      try {
        const table = await getTablePromise()
        await table.delete(id)
      } catch (error) {
        warn(`checkpoint ${id} record deletion failed: ${messageOf(error)}`)
        continue
      }
      if (record === undefined) continue
      const provider = registry.get(record.provider)
      if (provider === undefined) continue
      try {
        await provider.discard({ cwd: record.cwd, key: workspaceKeyOf(record.cwd) }, record.ref)
      } catch (error) {
        warn(`checkpoint ${id} storage discard failed (record removed; files may linger until cleanup): ${messageOf(error)}`)
      }
```

</details>

**依据 4 · 作者声明**：[README.md:37-39](https://github.com/PerryLink/dsh-checkpoint-rewind/blob/6be3f52baad3430dfce4e857366f6ed125c94486/README.md#L37-L39)

作者声明三态范围。

```text
## 它是什么

`dsh-checkpoint-rewind` 捕获一个**三态统一检查点**——工作区、会话游标与插件配置——并用一条经批准的命令恢复其中一个或全部。工作区快照优先走无副作用的 git 原语（`stash create` / `commit-tree`），非 git 目录（以及尚无 HEAD 的仓库）自动降级为带硬链接复用的增量 `copy` 快照。会话回退不截断原会话：它从检查点边界 fork 出一个新的子会话，原会话保留完整历史。变更工具执行前、自动间隔、手动 `/checkpoint` 以及每次回退前都会自动捕获；设置页还提供一条带逐行 diff 的检查点时间线。
```

#### 缺口

- 绑定预览的机制属于待验证设计，没有同任务对照。
  **影响**：无法量化节省或恢复可靠性。
  **进一步探讨**：使用预先配置的测试文件、脏索引和部分失败场景，记录逐段准确率及人工时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
