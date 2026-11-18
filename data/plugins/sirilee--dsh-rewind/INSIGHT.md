# DSH Rewind

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[536d788](https://github.com/SiriLee/dsh-rewind/tree/536d78816cd753164977537301bf221385de3179)

<!-- BEGIN META -->
[![npm 30d 52,411](https://img.shields.io/static/v1?label=npm+30d&message=52%2C411&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rewind-plugin) [![最新发布 2026-11-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rewind-plugin)
<!-- END META -->

> **功能**：在同一个 DSH 会话撤回到指定用户消息之前，回填原提示，并可选恢复被跟踪的工作区文件。

> **亮点**：[Q01](#research-q01) 使用同一条真实用户消息划定对话退回边界并回填草稿，[Q02](#research-q02) 可用消息检查点恢复已跟踪文件。[Q03](#research-q03) 的 Firefox 兜底只在测得面板越界时介入。

> **主要限制**：[Q02](#research-q02) 的对话标记先于逐文件恢复，部分文件失败时会话仍已回退。快照不覆盖任意改动，回执和工作区差异需要分别核对。

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
  - [Q01 · 同一对话如何撤回到选定消息，输入草稿如何回填？](#detail-section-11)
  - [Q02 · 哪些文件进入快照，什么情况下会部分恢复？](#detail-section-12)
  - [Q03 · Firefox 面板修复怎样工作，当前宿主兼容和退路有哪些条件？](#detail-section-13)
  - [Q04 · 什么范围值得试用，怎样判断对话与文件之间的恢复偏差？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 会话里反复改写实现指令的开发者，可选择一条真实用户消息撤回，并在原会话修改后再发送。

以宿主内另开会话并复制指令为对话比较基线，以 Git 与独立备份为文件基线。会话回退缩短同窗重新尝试的操作路径，独立备份仍承担未跟踪文件及失败恢复。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话回退 | 从当前投影撤回目标及之后的内容 | 目标必须是当前可见的人类用户消息 |
| 文件检查点及恢复 | 按消息还原已跟踪路径 | 本机可映射的 write 或 edit 路径，可能部分恢复 |
| 影响预览 | 查询候选和可能受影响的文件 | 未跟踪改动与异常文件不能由预览保证 |
| 草稿回填 | 把目标指令带回同一会话 | 等待当前回执，保留现有文字草稿 |
| Firefox 面板校正 | 面板越界时按触发按钮重新定位 | 命中 Firefox 且越界才启动 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 清单声明 Node >=24.9.0 与 DSH >=0.2.2-rc.1、<0.3.0-0 | 必需 | 加载宿主和客户端产物 | 范围外兼容未核实 |
| DSH 对话插件服务与 Web 插槽 | 界面必需 | 挂载历史消息动作和回填 | 按钮、预览或草稿可能不可用 |
| 本机路径、fs 与 workingDirectory | 文件跟踪必需 | 工具目标解析与捕获 | 无本机映射时不能产生可靠文件覆盖 |
| Git 基准或独立备份 | 文件试用需要 | 核对工具之外的差异及部分恢复 | 无法独立确认最终工作区 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在临时 Web profile 确认插件和会话版本 | 宿主命令与对应消息动作可用 |
| 选择 | 用户选目标及只对话或加文件 | 目标是真实用户消息且仍处于投影 |
| 执行 | 宿主等待空闲后附加标记，按模式恢复文件 | 若显示缺失或跳过，检查 Git 基线再继续 |
| 复核 | 确认回填和工作区实际差异 | 空草稿按条件恢复，必要时人工找回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 临时 profile 与独立备份的磁盘成本未知 | 核对包名、会话动作和浏览器 | 清单版本属于声明 |
| 持续 | 按消息扫描已跟踪集合及保存变化副本，增量资源未知 | 确认预览、回执和 Git 差异 | 单会话窗口有限，实际空间和延迟未测 |
| 失败恢复 | 保留 Git 或外部基线 | 按文件比对、辩明缺失版本或跳过 | 命令成功可能仍留未恢复文件 |
| 退出 | 可能要另行管理本地快照 | 保存必要上下文，停用插件回到原工作流 | 会话原日志仍能含撤回内容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同窗退回 | 按真实用户消息设定替换后缀 | 多种宿主部署下的实际投影和回填 |
| 文件恢复 | 已跟踪且符合路径约束的文件可逐项恢复 | 外部写入和中断下的覆盖率 |
| Firefox 可操作性 | 确认越界后根据按钮位置修正 | 实际版本、缩放和窄窗下的可点击性 |

> **思考**：[Q02](#research-q02) 的对话标记先于逐文件恢复，部分文件失败时会话仍已回退。快照不覆盖任意改动，回执和工作区差异需要分别核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 使用同一条真实用户消息划定对话退回边界并回填草稿，[Q02](#research-q02) 可用消息检查点恢复已跟踪文件。[Q03](#research-q03) 的 Firefox 兜底只在测得面板越界时介入。

[Q02](#research-q02) 的每路径校验、备份副本与原子替换适合借鉴，跨路径和会话仍缺共同事务。[Q03](#research-q03) 先让官方布局生效，仅在 Firefox 发生越界后写入修正，并在卸载时释放当前实例的锚点。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的对话标记先于逐文件恢复，部分文件失败时会话仍已回退。快照不覆盖任意改动，回执和工作区差异需要分别核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先试只撤回对话。需要恢复文件时，使用隔离工作区和独立 Git 基线，预览后逐个查看被删除、恢复和跳过项目。发现草稿缺失或工作区差异留存时先人工核对再继续。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持对话退回、文件检查点、草稿回填和 Firefox 面板位置保护。真实浏览器、宿主鉴权及工作区故障条件未执行验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/rewind.ts、src/index.ts、src/client/rewind-flow.ts、src/snapshot.ts、package.json、docs/compat/audit.md、src/client/placement-guard.ts、src/client/popover.ts、cordis.patch.yml、scripts/build.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定源码的双入口、消息替换、文件捕获和恢复、Firefox 面板定位与关键宿主接线。未执行安装、构建、目标插件、测试、真实宿主或浏览器。未完整审计所有清理命令、浏览器样式或宿主鉴权。
- 下一步：按 [Q04](#research-q04) 在临时会话及可丢弃目录对照正常、备份缺失、外部时间戳、忙时撤回四种情形，记录能否继续正确完成任务及人工核对时间。另在 Firefox 滚动和缩放后检查面板。

**分析版本**

- **仓库**：[SiriLee/dsh-rewind](https://github.com/SiriLee/dsh-rewind)
- **版本号**：0.22.2（[固定提交 536d788](https://github.com/SiriLee/dsh-rewind/tree/536d78816cd753164977537301bf221385de3179)）
- **版本日期**：2026-11-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出把对话、文件和草稿结果显示为三个可检查的状态。用缺失备份和同大小旧时间戳作对照，验证是否能降低开发者的误续写率。

按 [Q04](#research-q04) 在临时会话及可丢弃目录对照正常、备份缺失、外部时间戳、忙时撤回四种情形，记录能否继续正确完成任务及人工核对时间。另在 Firefox 滚动和缩放后检查面板。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 3118 | — | — | 35660 |
| .mjs | source | 7 | 959 | 668 | 219 | — |
| .tsx | source | 4 | 850 | 524 | 253 | — |
| .ts | source | 23 | 7292 | 4951 | 1862 | — |
| .ts | test | 39 | 7851 | 6062 | 1031 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-18），可前往 [GitHub Issues](https://github.com/SiriLee/dsh-rewind/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在同一个 DSH 会话试错时，如何让对话位置、重填草稿和工作区文件都到达用户预期的状态，当前 Firefox 绘制变化改善哪一段？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 同一对话如何撤回到选定消息，输入草稿如何回填？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适用者是在同一 DSH 会话中反复调整实现指令的开发者。新会话能隔离旧方向，手动复制提示需要另行找回上下文。此插件让真实用户消息同时充当可见对话边界和候选草稿的来源。计划按会话序号或倒数序位找事件，拒绝注入上下文、合成消息和已经被此前压缩或替换遮蔽的目标；目标消息本身和它后续的可见后缀一起退出当前对话投影。

服务器按会话锁防重复，忙时取消当前轮并等待空闲，保留后续轮次队列，清掉待交付的引导输入，再追加带 replace 范围和引用序号的事件。原始日志仍可能含撤回内容，独立的计划模式状态也不会回滚。浏览器只等本次命令的新回执，最多等 20 秒。用户切去其他会话或已经在编辑非空文字时不会自动填原提示，附件尝试回填失败也不会阻断后续文字路径。因此应分别看上下文和草稿的结果。

#### 证据与依据

**依据 1 · 源码核查**：[src/rewind.ts:213-245](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/rewind.ts#L213-L245)

目标必须是仍在投影中的人类用户消息，替换包括目标本身。

<details>
<summary>查看原文（33行）</summary>

```text
  const targetEvent = events.find(event => event.seq === targetSeq)
  if (targetEvent === undefined) {
    throw new RewindError('not-a-user-message', `no session event at seq ${targetSeq}`)
  }
  // Only a HUMAN user message is a valid rewind boundary: injected
  // context / compaction checkpoints arrive as `user/message` with a
  // non-`'user'` source and must not be rewindable.
  if (!isHumanUserMessageEvent(targetEvent)) {
    throw new RewindError(
      'not-a-user-message',
      `session event at seq ${targetSeq} is not a human user message (${targetEvent.type})`,
    )
  }

  const targetIndex = surface.indexOf(targetSeq)
  if (targetIndex === -1) {
    throw new RewindError(
      'not-on-surface',
      `user message at seq ${targetSeq} is no longer in the model context (shadowed by compaction)`,
    )
  }
  // Rewinding to a message WITHDRAWS it and everything after it (time-travel
  // semantics: the conversation returns to before that message; its content
  // is offered back in the composer for re-sending). The replacement range
  // therefore ALWAYS includes the target.
  const shadowedSeqs = surface.slice(targetIndex)
  return {
    targetSeq,
    targetIndex,
    shadowedSeqs,
    surfaceStart: shadowedSeqs[0]!,
    surfaceEnd: shadowedSeqs[shadowedSeqs.length - 1]!,
  }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:602-638](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/index.ts#L602-L638)

会话防重、取消繁忙轮、保留队列与清除待发引导的时序。

<details>
<summary>查看原文（37行）</summary>

```text
  const { agent } = invocation
  const sessionId = agent.session.id
  // Per-session in-flight guard: two concurrent rewinds (double-click, a
  // second tab) would both plan against the same surface; the second append's
  // replace range would then target nodes the first marker already shadowed,
  // and `Session.append` rejects with "start seq not found in surface".
  if (inflight.has(sessionId)) {
    return { kind: 'error', text: t('inflight') }
  }
  inflight.add(sessionId)
  try {
    // A running turn (the LLM is thinking or streaming) must be stopped before
    // the surface can be cut: force-cancel it (user cause), wait for quiescence,
    // then rewind. The inbox is KEPT by the cancel (keepInbox) — only the
    // pending steering (next-step) messages are dropped below: they belong to
    // the future being rolled back. Queued (next-turn) messages are left
    // untouched: the harness QueueDock already offers per-item edit/remove, so
    // a rewind must not silently drop messages the user may still want to send.
    if (agent.status !== 'idle') {
      agent.cancel({ kind: 'user' }, { keepInbox: true })
      const stopped = await waitForAgentIdle(agent, invocation.signal)
      if (!stopped) {
        return { kind: 'error', text: t('stopFailed') }
      }
    }
    // Idle or not, rewinding to a point before them must not keep pending
    // steering messages alive to be delivered first on the next send.
    dropPendingSteering(agent)
    // The command was cancelled (or its caller aborted) while we waited for
    // quiescence: stop here instead of executing a rewind nobody asked for.
    if (invocation.signal.aborted) {
      return { kind: 'error', text: t('cancelled') }
    }
    let plan: RewindPlan
    try {
      plan = resolveOrError(agent.session.snapshotEvents(), agent.session.surface.nodes, rawTarget)
    } catch (error) {
```

</details>

**依据 3 · 源码核查**：[src/index.ts:642-660](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/index.ts#L642-L660)

附加替换标记，保留原日志及独立的计划模式。

<details>
<summary>查看原文（19行）</summary>

```text
    const marker = buildMarker()
    let event: ReturnType<Session['append']>
    try {
      event = agent.session.append('user/message', marker, {
        surfaceOp: { op: 'replace', startSeq: plan.surfaceStart as SessionSeq, endSeq: plan.surfaceEnd as SessionSeq },
        sourceEventSeqs: [...plan.shadowedSeqs] as SessionSeq[],
      })
    } catch (error) {
      return {
        kind: 'error',
        text: t('failed', { error: error instanceof Error ? error.message : String(error) }),
      }
    }

    // A rewind cuts only the model-visible surface and never touches the
    // log-only `plan/mode` events — plan mode is a separate state the plugin
    // does not manage. `/plan text` is two independent actions (enter plan
    // mode + steer the message); rewinding the message undoes only the
    // message, leaving plan mode for the user to leave with `/plan off`.
```

</details>

**依据 4 · 源码核查**：[src/client/rewind-flow.ts:158-183](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/client/rewind-flow.ts#L158-L183)

等待本次成功命令，超时或切换会话时停止草稿回填。

<details>
<summary>查看原文（26行）</summary>

```text
  // The executed rewind lands as a CommandNode with a marker-carrying
  // success outcome; wait for exactly that (longer than the preview route
  // timeout: a running turn is cancelled first, which can take seconds).
  let outcome: Awaited<ReturnType<typeof waitForCommand>>
  try {
    outcome = await waitForCommand(session, chatOf, node => isExecutedRewindCommand(node, seq) && !known.has(node.seq), 20_000, cb => watchChat(session.sessionId, cb))
  } catch (error) {
    rewindLog.warn('refill', `waiting for rewind @${seq} outcome threw`, error)
    return
  }
  if (outcome === null) {
    rewindLog.warn('refill', `rewind @${seq} never settled within timeout, no refill`)
    return
  }
  if (outcome.kind !== 'success') {
    // The host rejected the rewind (e.g. the target was shadowed by
    // compaction and is no longer in the model context). The refusal is the
    // correct behavior, but it must not fail silently — surface the host's
    // reason instead.
    showHint(outcome.text ?? 'rewind failed')
    return
  }
  // The user may have switched sessions while the rewind ran — fill only
  // the composer of the session the rewind actually happened in.
  if (!isMainViewSession(session.sessionId)) {
    return
```

</details>

**依据 5 · 源码核查**：[src/client/rewind-flow.ts:195-218](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/client/rewind-flow.ts#L195-L218)

图片尽力恢复，非空文字草稿有保护。

<details>
<summary>查看原文（24行）</summary>

```text
  // Restore the withdrawn message's images FIRST: adding draft attachments
  // never clobbers an in-progress draft, so this is NOT gated by the
  // empty-composer guard below. Best-effort — a restore failure leaves the
  // text refill intact (the image stays in the hidden history message).
  if (restoreImages !== undefined && images !== undefined && images.length > 0) {
    try {
      await restoreImages(session.sessionId, images)
    } catch (error) {
      rewindLog.warn('refill', `image restore for @${seq} threw`, error)
    }
  }
  if (text === undefined || text === '') {
    return
  }
  // Empty-composer guard (Claude Code parity): never clobber a draft the user
  // is already editing.
  if (composerText().trim() !== '') {
    return
  }
  try {
    setComposerText(session.sessionId, text)
  } catch (error) {
    rewindLog.warn('refill', `composer refill @${seq} threw`, error)
    return
```

</details>

#### 缺口

- 同版本宿主实际消息投影和附件回填未复核
  **影响**：命令成功仍可能不回填文字或附件
  **进一步探讨**：用临时会话分别验证空草稿、非空草稿、切会话和附件四种路径。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些文件进入快照，什么情况下会部分恢复？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

进入用户轮前，以人类消息 ID 建立检查点。从本轮第一次受支持的文件工具访问前捕获状态，后续检查点遍历已跟踪集合并复用不变的版本。跟踪只识别 write 和 edit，目标必须解析为本机可映射路径，直接子 Agent 会话跳过；shell、自定义编辑工具、手工和外部进程改动的覆盖不能从界面预览推断。作者说明每会话保留 100 个最近检查点，关闭新快照会出现空窗。

文件模式在会话标记提交后执行，按路径校验父目录和不安全目标，记录备份缺失与超尺寸等情况。保存记录中标为从前不存在的安全文件会尝试删除，曾存在的文件经独占临时副本和 rename 更换。单文件完成后不会因下一文件失败而回滚，旧或不支持的快照也可能无法恢复。遇到同大小且当前 mtime 早于备份 mtime 的文件，规划会跳过进一步逐字节比较；这使保留旧时间戳的同大小外部编辑成为合理的故障用例。截至该提交，命令可返回成功并附恢复、跳过或报错列表，文件恢复后的观察缓存刷新是另一条补偿路径。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:68-73](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/README.md#L68-L73)

作者说明保留窗口和快照目录。

```text

## Snapshot management

As you work with dsh-rewind, checkpointing automatically captures the state of your code before each prompt you send that starts a turn. This creates the session's **snapshots** and saves them to `<dsh home>/rewind-snapshots/` (default: `~/.dsh/rewind-snapshots/`). The plugin keeps file snapshots for the 100 most recent checkpoints in a session. Discarding an older checkpoint deletes the snapshot files that no remaining checkpoint references.

The **Snapshot backups** feature (on by default) controls checkpointing. It can be switched off in this plugin's configuration card. When off, no new snapshots are created; file changes made while off cannot be restored. Users who do not need file restore can avoid the extra copies and read/write overhead.
```

**依据 2 · 源码核查**：[src/index.ts:117-135](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/index.ts#L117-L135)

工具白名单和子会话排除。

<details>
<summary>查看原文（19行）</summary>

```text
 * Tool names whose mutations the checkpoint tracker follows. `str_replace_editor`
 * is not tracked: it is an optional package, not a default tool.
 */
const TRACKED_TOOLS = new Set(['write', 'edit'])

/**
 * Whether a session is a subagent child: a direct-delegation session this
 * plugin neither tracks nor rewinds. THE single predicate for every skip site —
 * checkpoint creation, first-touch capture, the agent-created load, and the
 * lazy cleanup trigger. The Harness refuses every generic
 * Session RPC for such an identity (`session/agent-busy`, "use subagent
 * delivery for this child session"), so a checkpoint recorded under a child
 * session id could never be restored by ANY rewind — parent or child — and
 * `/rewind` cannot even execute there. One predicate keeps those facts from
 * drifting apart again (SiriLee/dsh-rewind#26).
 */
function isSubagentSession(session: Session): boolean {
  const header = session.header
  return header.origin === 'subagent' || (header.delegationDepth ?? 0) > 0
```

</details>

**依据 3 · 源码核查**：[src/index.ts:263-276](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/index.ts#L263-L276)

首触要求可解析且可映射至本地文件。

<details>
<summary>查看原文（14行）</summary>

```text
  if (!TRACKED_TOOLS.has(exec.name)) return
  const agent = exec.agent
  if (agent === undefined) return
  if (isSubagentSession(agent.session)) return
  const path = mutationPathOf(exec)
  if (path === undefined) return
  const cwd = await workingDirectory.ensure(agent, exec.signal)
  const target = await resolveTarget(fs, path, cwd, exec.signal)
  if (target === undefined) return
  // A non-local backend has no host path a node:fs restore could safely touch.
  if (fs.processPathFromHostPath(target.displayPath) === undefined) return
  await ensureStoreSession(store, agent.session, message => ctx.logger.warn(message))
  const { warnings } = await store.captureFirstTouch(agent.session.id, target.displayPath)
  for (const warning of warnings) ctx.logger.warn(`[dsh-rewind] ${warning}`)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1174-1199](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/index.ts#L1174-L1199)

用户轮开始前检查开关且按消息 ID 建检查点。

<details>
<summary>查看原文（26行）</summary>

```text
  ctx.on('agent/pre-step', async ({ agent }, next) => {
    const decision = await next()
    if (decision.kind !== 'enter' || lifecycle.signal.aborted) return decision
    const session = agent.session
    if (isSubagentSession(session)) return decision
    // Subagents returned above; only a real session may claim the sweep's
    // active-session exemption.
    void maybeRunAutoCleanup(ctx, store, session.id, dshHome, config?.autoSweepIntervalMs, lifecycle.signal)
    try {
      if (!isFileCheckpointingEnabled(config)) {
        // The off period is a coverage gap: the previous message's manifest
        // must not receive first-touch rows after the switch flips back on.
        await store.abandonCurrent(session.id).catch(() => undefined)
        return decision
      }
      if (inflight.has(session.id)) return decision
      await ensureStoreSession(store, session, message => ctx.logger.warn(message))
      const batch: string[] = []
      const seen = new Set<string>()
      for (const message of decision.messages) {
        if (message.source.kind !== 'user' || seen.has(message.id)) continue
        seen.add(message.id)
        batch.push(message.id)
      }
      if (batch.length === 0) return decision
      const { warnings } = await store.createCheckpoints(session.id, session.header.version, batch)
```

</details>

**依据 5 · 源码核查**：[src/index.ts:675-716](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/index.ts#L675-L716)

对话先前已修改，按文件结果拼接回执，同时刷新观察。

<details>
<summary>查看原文（42行）</summary>

```text
          outcome = await store.restoreAfter(agent.session.id, targetMessageId)
        } catch (error) {
          // A store written by a newer build fails the FILE RESTORE closed
          // (nothing changed) while the conversation rewind above already
          // succeeded — the two are independent.
          if (!(error instanceof UnknownStoreVersionError)) throw error
          const version = await store.readStoreVersion(agent.session.id)
          restore = `${t('sep.clause')}${t('storeUnsupported', { version: version ?? error.version })}`
        }
      }
      if (outcome !== undefined) {
        // The restore wrote through plain node:fs, invisible to the harness
        // observation policy: re-sync it so the session's next write of a
        // restored/deleted file is not judged against the stale pre-restore
        // observation (see syncRestoreObservations).
        await syncRestoreObservations(ctx, fs, agent, outcome)
        if (outcome.noCheckpoint) {
          restore = `${t('sep.clause')}${t('noCheckpoint')}`
        } else {
          const parts: string[] = []
          if (outcome.restored.length > 0) parts.push(t('restore.count', { count: outcome.restored.length }))
          if (outcome.deleted.length > 0) parts.push(t('delete.count', { count: outcome.deleted.length }))
          if (outcome.skipped.length > 0) {
            parts.push(t('skip.count', { count: outcome.skipped.length }))
            // A conservative leave-alone must still be visible, never a silent
            // omission.
            const skippedLines = renderSkipped(outcome, store.fileCapBytes)
            if (skippedLines !== '') parts.push(skippedLines)
          }
          if (!checkpointingEnabled) parts.push(t('backupOff'))
          restore = parts.length > 0 ? `${t('sep.clause')}${parts.join(t('sep.list'))}` : t('noRestorable')
        }
        restore += renderFailures(outcome.failed)
      }
    }

    // Every rewind withdraws the target message and everything after it; its
    // content is offered back in the composer for re-sending.
    return {
      kind: 'success',
      text: t('success', { targetSeq: plan.targetSeq, restore }),
      sourceEventSeq: event.seq,
```

</details>

**依据 6 · 源码核查**：[src/snapshot.ts:351-387](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/snapshot.ts#L351-L387)

逐文件修改和记录失败，后续仍继续。

<details>
<summary>查看原文（37行）</summary>

```text
  async restoreAfter(sessionId: string, messageId: string): Promise<RestoreOutcome> {
    return await this.withLock(sessionId, async (state) => {
      this.assertUsable(state)
      const plan = await this.planLocked(state, messageId)
      const restored: string[] = []
      const deleted: string[] = []
      const skipped: SkippedPath[] = [...plan.skipped]
      const failed: { path: string; message: string }[] = [...plan.failed]
      if (plan.noCheckpoint) {
        return { restored, deleted, skipped, failed, noCheckpoint: true }
      }
      for (const action of plan.actions) {
        if (!(await parentStillMatches(action.path, action.parent))) {
          skipped.push({ path: action.path, reason: 'parent' })
          continue
        }
        if (await isUnsafeTarget(action.path)) {
          skipped.push({ path: action.path, reason: 'unsafe' })
          continue
        }
        if (action.action === 'delete') {
          try {
            await unlink(action.path)
            deleted.push(action.path)
          } catch (error) {
            if (!isEnoent(error)) failed.push({ path: action.path, message: messageOf(error) })
          }
          continue
        }
        try {
          await this.applyRestore(action)
          restored.push(action.path)
        } catch (error) {
          failed.push({ path: action.path, message: messageOf(error) })
        }
      }
      return { restored, deleted, skipped, failed, noCheckpoint: false }
```

</details>

**依据 7 · 源码核查**：[src/snapshot.ts:654-686](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/snapshot.ts#L654-L686)

备份和目标检查，同大小旧时间戳先行跳过。

<details>
<summary>查看原文（33行）</summary>

```text
      const source = join(this.versionsDir(state.sessionId), row.blob)
      const version = await lstat(source).catch(() => undefined)
      if (version === undefined || !version.isFile() || version.size !== row.size) {
        failed.push({ path, message: 'recorded version is missing or has the wrong size' })
        continue
      }
      if (!(await parentStillMatches(path, row.parent))) {
        skipped.push({ path, reason: 'parent' })
        continue
      }
      if (await isUnsafeTarget(path)) {
        skipped.push({ path, reason: 'unsafe' })
        continue
      }
      const live = await lstat(path).catch(() => undefined)
      if (live !== undefined && live.isFile() && this.isOverFileCap(live.size)) {
        uncovered.push({ path, size: live.size })
        skipped.push({ path, reason: 'oversized' })
        continue
      }
      if (live !== undefined && live.isFile() && live.size === row.size && live.mtimeMs < version.mtimeMs) {
        continue
      }
      if (live !== undefined && live.isFile()) {
        let same: boolean
        try {
          same = await sameFileBytes(source, path)
        } catch (error) {
          failed.push({ path, message: messageOf(error) })
          continue
        }
        if (same) continue
      }
```

</details>

**依据 8 · 源码核查**：[src/snapshot.ts:710-735](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/snapshot.ts#L710-L735)

单个文件先复制到独占临时路径再替换和恢复权限。

<details>
<summary>查看原文（26行）</summary>

```text
  /** Atomically replace one target with a version file. */
  private async applyRestore(action: Extract<PlannedAction, { action: 'restore' }>): Promise<void> {
    await mkdir(dirname(action.path), { recursive: true })
    const temp = `${action.path}.rewind-tmp`
    try {
      // The target directory is workspace-writable; never follow a symlink an
      // attacker planted at the temp name. EXCL refuses an existing entry.
      await rm(temp, { force: true }).catch(() => undefined)
      await copyFile(action.source, temp, constants.COPYFILE_EXCL)
      const copied = await stat(temp)
      if (copied.size !== action.size) throw new Error(`version ${basename(action.source)} changed size during restore`)
      await this.hooks.beforeRestoreRename?.()
      try {
        await rename(temp, action.path)
      } catch (error) {
        // A read-only target can block replacement on some filesystems. The
        // content is already complete in the temp file; widening the target
        // for the rename never exposes a half-written file.
        const current = await stat(action.path).catch(() => undefined)
        if (current === undefined || (current.mode & 0o200) !== 0) throw error
        await chmod(action.path, current.mode | 0o200).catch(() => undefined)
        await rename(temp, action.path)
      }
      if (action.mode !== undefined) await chmod(action.path, action.mode).catch(() => undefined)
    } finally {
      await rm(temp, { force: true }).catch(() => undefined)
```

</details>

#### 缺口

- 异步外部文件修改、异常备份和中断未运行测试
  **影响**：预览可能漏掉未跟踪、相同大小旧时间戳或新出现的工作区差异
  **进一步探讨**：以 Git 及独立备份为对照注入缺失版本、路径替换和同大小旧时间戳内容，逐项比对回执与文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Firefox 面板修复怎样工作，当前宿主兼容和退路有哪些条件？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

当前清单给出 Node >=24.9.0、DSH >=0.2.2-rc.1 且低于 0.3.0-0，以及具名 Web 插槽和宿主服务。宿主端从 Cordis 插入命令行与跟踪功能，预览 handler 从已附着的 Agent 中按 sessionId 查找并校验消息序号。作者将兼容审计目标移到 rc.3，真实 HTTP 桥、Cookie 鉴权、已服务页面与若干 provider 在作者列出的自动验证范围之外。该文档只证明作者口径，本轮未运行宿主。

更新只在 navigator.userAgent 匹配 Firefox 时装配校正逻辑。面板进文档后，检查尺寸和边界；首检在内时原生 CSS 锚定继续负责。发生越界后，按动作按钮位置计算两侧可用位置，限制在可用视口，并用手工 insets 禁用锚点定位，余下检查仍沿用 pinned 状态。渲染和内容变化可重新检查，路径没有为滚动和缩放持续绑定监听。面板关闭时移除键盘、点击监听并在自己仍拥有锚点时恢复旧值。窄窗中超宽或超高的面板无法仅靠位置计算容纳，浏览器验证仍需覆盖缩放和长预览。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:24-39](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/package.json#L24-L39)

声明宿主版本及两套构建出口。

<details>
<summary>查看原文（16行）</summary>

```text
  "engines": {
    "node": ">=24.9.0",
    "dsh": ">=0.2.2-rc.1 <0.3.0-0"
  },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
```

</details>

**依据 2 · 源码核查**：[package.json:54-66](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/package.json#L54-L66)

Cordis 入口与 Web 插槽依赖。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-commands",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:420-443](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/index.ts#L420-L443)

候选和影响预览按会话与序号查找。

<details>
<summary>查看原文（24行）</summary>

```text
      let payload: unknown
      try {
        payload = await request.json()
      } catch {
        return new Response('body is not JSON', { status: 400 })
      }
      if (!isRecord(payload)) return queryResponse(queryFailure('rewind/bad-request', 'invalid payload'))
      const sessionId = payload['sessionId']
      if (typeof sessionId !== 'string' || sessionId.length === 0) {
        return queryResponse(queryFailure('rewind/bad-request', 'sessionId must be a non-empty string'))
      }
      const agents = agentsOf()
      if (agents === undefined) return queryResponse(queryFailure('rewind/agents-unavailable', 'agent registry is unavailable'))
      const agent = agents.get(sessionId as SessionId)
      if (agent === undefined) return queryResponse(queryFailure('rewind/session-not-found', `session ${sessionId} is not attached`))
      const session = agent.session
      if (query === 'preview') {
        const seq = payload['seq']
        if (!Number.isSafeInteger(seq)) return queryResponse(queryFailure('rewind/bad-request', 'seq must be an integer'))
        return queryResponse({ ok: true, value: await previewImpact(ctx, store, session, seq as number, checkpointingEnabled()) })
      }
      return queryResponse({
        ok: true,
        value: { candidates: listRewindCandidates(session.snapshotEvents(), session.surface.nodes) },
```

</details>

**依据 4 · 作者声明**：[docs/compat/audit.md:144-157](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/docs/compat/audit.md#L144-L157)

作者明确列出真实 HTTP 桥和浏览器鉴权边界。

<details>
<summary>查看原文（14行）</summary>

```text
- **Providers outside the verification dependencies**: `dsh-attachment-local` (so image refill is
  manual), `dsh-session-telemetry-otel`, `dsh-session-query-sqlite` (mounted in the shipped
  profile; its index is configured `openAt: never`, so it is never opened) and
  `dsh-session-persistence-jsonl` (a real JSONL write round-trip needs the platform prebuilt
  `node-addon-system` flock addon).
- **Real LLM streaming / auto title (L2 stubbed)**, and
  **`session-reference`'s `SessionReferenceResolver.prepare`** (needs a full session-query
  service; its data base is already covered by the G1 probe).
- **Real HTTP carrier and browser authentication**: `verify-host` mounts the real
  `HostConnectionService` and drives the exact `/api` routes through its shared Fetch handler;
  the HTTP bridge, browser cookie authentication and the served page are verified manually on
  a live Web host, not in CI.
- **Policy-enabled restore sync**: the compensation is checked by its `fs/observed` emissions,
  not by a following write under the re-enabled policy.
```

</details>

**依据 5 · 源码核查**：[src/client/placement-guard.ts:52-78](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/client/placement-guard.ts#L52-L78)

根据按钮、面板尺寸和视口决定翻转与坐标限位。

<details>
<summary>查看原文（27行）</summary>

```text
/** Pure pin math, kept separate from the DOM read/write. */
function pinnedPosition(
  anchor: AnchorEdges,
  size: PanelSize,
  viewport: ViewportSize,
  placement: 'above' | 'below',
  topInset: number,
): { left: number; top: number } {
  const maxLeft = Math.max(SIDE_INSET, viewport.width - size.width - SIDE_INSET)
  const left = Math.min(Math.max(anchor.left, SIDE_INSET), maxLeft)

  const above = anchor.top - size.height - GAP
  const below = anchor.bottom + GAP
  const preferred = placement === 'above' ? above : below
  const opposite = placement === 'above' ? below : above
  const maxTop = Math.max(topInset, viewport.height - size.height - SIDE_INSET)
  const fits = (top: number): boolean => top >= topInset && top <= maxTop

  const chosen = !fits(preferred) && fits(opposite) ? opposite : preferred
  return { left, top: Math.min(Math.max(chosen, topInset), maxTop) }
}

/** The official top inset also reserves the host's frame overlay. */
function readTopInset(panel: HTMLElement): number {
  const raw = Number.parseFloat(getComputedStyle(panel).getPropertyValue('--dsh-frame-overlay-top'))
  return Number.isFinite(raw) ? Math.max(SIDE_INSET, raw) : SIDE_INSET
}
```

</details>

**依据 6 · 源码核查**：[src/client/placement-guard.ts:81-118](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/client/placement-guard.ts#L81-L118)

只在 Firefox 介入，首个越界后改用固定坐标。

<details>
<summary>查看原文（38行）</summary>

```text
export function guardPlacement(
  panel: HTMLElement,
  anchor: HTMLElement,
  placement: 'above' | 'below',
): () => void {
  if (!IS_GECKO) return () => {}

  let pinned = false
  let topInset = SIDE_INSET
  let insetResolved = false

  return (): void => {
    if (!panel.isConnected || !anchor.isConnected) return
    const rect = panel.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    const viewport = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    }
    const inside = rect.left >= -EPSILON
      && rect.top >= -EPSILON
      && rect.right <= viewport.width + EPSILON
      && rect.bottom <= viewport.height + EPSILON
    if (!pinned && inside) return

    if (!insetResolved) {
      insetResolved = true
      topInset = readTopInset(panel)
    }
    const position = pinnedPosition(anchor.getBoundingClientRect(), rect, viewport, placement, topInset)
    pinned = true
    panel.style.setProperty('position-anchor', 'none')
    panel.style.setProperty('position-try-fallbacks', 'none')
    panel.style.setProperty('right', 'auto')
    panel.style.setProperty('bottom', 'auto')
    panel.style.setProperty('left', `${Math.round(position.left)}px`)
    panel.style.setProperty('top', `${Math.round(position.top)}px`)
  }
```

</details>

**依据 7 · 源码核查**：[src/client/popover.ts:352-370](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/client/popover.ts#L352-L370)

先装官方锚点再接定位检查。

<details>
<summary>查看原文（19行）</summary>

```text
function mountShell(root: HTMLElement, anchor: HTMLElement, onKeyDown: (event: KeyboardEvent) => void, placement: 'above' | 'below' = 'above'): PopoverShell {
  if (placement === 'below') root.classList.add(CLASS.popoverBelow)
  const anchorName = `--dsh-rewind-popover-${++anchorSequence}`
  const previousAnchorName = anchor.style.getPropertyValue('anchor-name')
  const previousPriority = anchor.style.getPropertyPriority('anchor-name')
  const previousList = previousAnchorName.trim()
  const ownAnchorName = previousList === '' || previousList === 'none'
    ? anchorName
    : `${previousList} ${anchorName}`
  anchor.style.setProperty('anchor-name', ownAnchorName)
  root.style.setProperty('position-anchor', anchorName)
  const recheckPlacement = guardPlacement(root, anchor, placement)

  /** Re-check the anchor after a content render; CSS owns placement. */
  const recheck = (): void => {
    if (!root.isConnected) return
    if (!anchor.isConnected && popoverEl === root) closePopover()
    recheckPlacement()
  }
```

</details>

**依据 8 · 源码核查**：[src/client/popover.ts:384-397](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/client/popover.ts#L384-L397)

追加面板立即检查，关闭解除监听及锚点。

<details>
<summary>查看原文（14行）</summary>

```text
  }, 0)

  document.body.append(root)
  recheck()

  const dispose = (): void => {
    clearTimeout(deferred)
    document.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('keydown', onKeyDown, true)
    if (anchor.style.getPropertyValue('anchor-name') === ownAnchorName) {
      anchor.style.setProperty('anchor-name', previousAnchorName, previousPriority)
    }
  }
  return { recheck, dispose }
```

</details>

#### 缺口

- 未在真实 Firefox、DSH Web 和缩放条件复现
  **影响**：定位兜底可从源码追溯，但可操作范围和鉴权仍需各自验证
  **进一步探讨**：在滚动后的消息、窄窗和缩放状态对比原版和新版，并独立确认预览请求只对已授权会话可用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么范围值得试用，怎样判断对话与文件之间的恢复偏差？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

如果只想修改提示，可用对话模式先试同窗撤回，在不需要文件检查点时关闭新快照。在临时配置和可丢弃 Git 工作区中试文件模式时，准备两次相同任务回放，先确认目标消息、影响预览和拟保留草稿，再以 git diff 和备份对照实际恢复。从小文件开始，跳过或缺少检查点应先人工恢复，避免在上下文已后退而文件仍在后续状态时向模型续写。首次需要配置和备份，持续需要扫描已跟踪集合、保存变化副本与核对结果，暂无单位合格任务资源或人工数据。

待验证设计是在执行结果面明确并列上下文已撤回、文件部分恢复或完成、草稿是否处理，外加预览覆盖的不确定性。它在当前合并回执之外直接暴露恢复阶段。在对照里故意删除一个合法备份或保留有误导性的 mtime，比较两种界面在开发者继续写之前能否发现偏差、耗费多久以及无故中断多少次。若误续写率和核对工时均未改善，则没有依据加入额外确认步骤。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:675-716](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/index.ts#L675-L716)

会话标记和文件结果存在独立状态，当前文件详情再合入成功文本。

<details>
<summary>查看原文（42行）</summary>

```text
          outcome = await store.restoreAfter(agent.session.id, targetMessageId)
        } catch (error) {
          // A store written by a newer build fails the FILE RESTORE closed
          // (nothing changed) while the conversation rewind above already
          // succeeded — the two are independent.
          if (!(error instanceof UnknownStoreVersionError)) throw error
          const version = await store.readStoreVersion(agent.session.id)
          restore = `${t('sep.clause')}${t('storeUnsupported', { version: version ?? error.version })}`
        }
      }
      if (outcome !== undefined) {
        // The restore wrote through plain node:fs, invisible to the harness
        // observation policy: re-sync it so the session's next write of a
        // restored/deleted file is not judged against the stale pre-restore
        // observation (see syncRestoreObservations).
        await syncRestoreObservations(ctx, fs, agent, outcome)
        if (outcome.noCheckpoint) {
          restore = `${t('sep.clause')}${t('noCheckpoint')}`
        } else {
          const parts: string[] = []
          if (outcome.restored.length > 0) parts.push(t('restore.count', { count: outcome.restored.length }))
          if (outcome.deleted.length > 0) parts.push(t('delete.count', { count: outcome.deleted.length }))
          if (outcome.skipped.length > 0) {
            parts.push(t('skip.count', { count: outcome.skipped.length }))
            // A conservative leave-alone must still be visible, never a silent
            // omission.
            const skippedLines = renderSkipped(outcome, store.fileCapBytes)
            if (skippedLines !== '') parts.push(skippedLines)
          }
          if (!checkpointingEnabled) parts.push(t('backupOff'))
          restore = parts.length > 0 ? `${t('sep.clause')}${parts.join(t('sep.list'))}` : t('noRestorable')
        }
        restore += renderFailures(outcome.failed)
      }
    }

    // Every rewind withdraws the target message and everything after it; its
    // content is offered back in the composer for re-sending.
    return {
      kind: 'success',
      text: t('success', { targetSeq: plan.targetSeq, restore }),
      sourceEventSeq: event.seq,
```

</details>

**依据 2 · 源码核查**：[src/snapshot.ts:654-685](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/snapshot.ts#L654-L685)

可构造缺备份和时间戳捷径的对照。

<details>
<summary>查看原文（32行）</summary>

```text
      const source = join(this.versionsDir(state.sessionId), row.blob)
      const version = await lstat(source).catch(() => undefined)
      if (version === undefined || !version.isFile() || version.size !== row.size) {
        failed.push({ path, message: 'recorded version is missing or has the wrong size' })
        continue
      }
      if (!(await parentStillMatches(path, row.parent))) {
        skipped.push({ path, reason: 'parent' })
        continue
      }
      if (await isUnsafeTarget(path)) {
        skipped.push({ path, reason: 'unsafe' })
        continue
      }
      const live = await lstat(path).catch(() => undefined)
      if (live !== undefined && live.isFile() && this.isOverFileCap(live.size)) {
        uncovered.push({ path, size: live.size })
        skipped.push({ path, reason: 'oversized' })
        continue
      }
      if (live !== undefined && live.isFile() && live.size === row.size && live.mtimeMs < version.mtimeMs) {
        continue
      }
      if (live !== undefined && live.isFile()) {
        let same: boolean
        try {
          same = await sameFileBytes(source, path)
        } catch (error) {
          failed.push({ path, message: messageOf(error) })
          continue
        }
        if (same) continue
```

</details>

**依据 3 · 源码核查**：[src/client/rewind-flow.ts:158-183](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/src/client/rewind-flow.ts#L158-L183)

回填由浏览器在看到当前命令结果后单独执行。

<details>
<summary>查看原文（26行）</summary>

```text
  // The executed rewind lands as a CommandNode with a marker-carrying
  // success outcome; wait for exactly that (longer than the preview route
  // timeout: a running turn is cancelled first, which can take seconds).
  let outcome: Awaited<ReturnType<typeof waitForCommand>>
  try {
    outcome = await waitForCommand(session, chatOf, node => isExecutedRewindCommand(node, seq) && !known.has(node.seq), 20_000, cb => watchChat(session.sessionId, cb))
  } catch (error) {
    rewindLog.warn('refill', `waiting for rewind @${seq} outcome threw`, error)
    return
  }
  if (outcome === null) {
    rewindLog.warn('refill', `rewind @${seq} never settled within timeout, no refill`)
    return
  }
  if (outcome.kind !== 'success') {
    // The host rejected the rewind (e.g. the target was shadowed by
    // compaction and is no longer in the model context). The refusal is the
    // correct behavior, but it must not fail silently — surface the host's
    // reason instead.
    showHint(outcome.text ?? 'rewind failed')
    return
  }
  // The user may have switched sessions while the rewind ran — fill only
  // the composer of the session the rewind actually happened in.
  if (!isMainViewSession(session.sessionId)) {
    return
```

</details>

**依据 4 · 作者声明**：[README.md:68-86](https://github.com/SiriLee/dsh-rewind/blob/536d78816cd753164977537301bf221385de3179/README.md#L68-L86)

作者描述快照窗口及卸载方式。

<details>
<summary>查看原文（19行）</summary>

````text

## Snapshot management

As you work with dsh-rewind, checkpointing automatically captures the state of your code before each prompt you send that starts a turn. This creates the session's **snapshots** and saves them to `<dsh home>/rewind-snapshots/` (default: `~/.dsh/rewind-snapshots/`). The plugin keeps file snapshots for the 100 most recent checkpoints in a session. Discarding an older checkpoint deletes the snapshot files that no remaining checkpoint references.

The **Snapshot backups** feature (on by default) controls checkpointing. It can be switched off in this plugin's configuration card. When off, no new snapshots are created; file changes made while off cannot be restored. Users who do not need file restore can avoid the extra copies and read/write overhead.

The **Snapshot auto-cleanup** feature (off by default) deletes the snapshot directories of long-inactive sessions when enabled, once the session has been idle for about 30 days (by default). Configure and review it in this plugin's configuration card (the auto-cleanup switch and the idle-day cutoff). See [Snapshot auto-cleanup](docs/snapshot-auto-cleanup.md) for details.

<img src="assets/screenshots/plugin-setting.png" alt="Plugin configuration card: snapshot backups and auto cleanup" width="600">

## Uninstall

```sh
# Uninstall the plugin
dsh plugin --profile <name> remove dsh-rewind-plugin

# To also delete local data
rm -rf <dsh home>/rewind-snapshots
````

</details>

#### 缺口

- 未实测误继续概率及恢复工时
  **影响**：无法以源码估计是否需要额外确认
  **进一步探讨**：对照故障注入和普通小任务，记录回退覆盖、通知发现率、误续写和退出用时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
