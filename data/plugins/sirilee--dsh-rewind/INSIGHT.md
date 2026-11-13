# dsh-rewind

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[99ad241](https://github.com/SiriLee/dsh-rewind/tree/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0)

<!-- BEGIN META -->
[![GitHub ★ 260](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=260&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SiriLee/dsh-rewind) [![npm 30d 40,496](https://img.shields.io/static/v1?label=npm+30d&message=40%2C496&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rewind-plugin) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rewind-plugin)
<!-- END META -->

> **功能**：在同一 DSH 对话内回退到用户消息前，并可一并恢复受跟踪的工作区文件。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 展示了同窗回退的组合贡献。插件复用 DSH 消息替换保持原日志，把真实用户消息同时作为文件检查点和提示词回填的锚点，使两种回退可以用一个界面发起。文件侧依靠稠密记录复用未变版本，适用范围由实际跟踪和保留窗口决定。

> **主要限制**：[Q02](#research-q02) 和 [Q03](#research-q03) 显示，宿主先提交对话标记，再逐文件删除或替换，旧格式快照会被忽略。跳过、版本缺失或进程中断后可能留下部分恢复，未被工具跟踪的改动也无法从这些文件记录追回。预览缺失或失败回执需触发独立核对。

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
  - [Q01 · 同窗口回退如何改变消息上下文，适合替代哪部分人工操作？](#detail-section-11)
  - [Q02 · 文件检查点如何生成和恢复，哪些状态会缺失或只恢复一部分？](#detail-section-12)
  - [Q03 · 在什么环境值得小范围试用，怎样核对预览及退出？](#detail-section-13)
  - [Q04 · 怎样降低用户将对话成功误读为文件完整恢复的概率？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在一个 DSH 会话中反复试探实现方案的开发者，可以回到某次指令之前，修改提示再发送。关键验收是上下文停在预期位置，选择文件恢复时工作区差异也符合预期。

Git 独立覆盖工作树版本，DSH 会话分支独立保留对话演进。将两者作为人工退路时，用户分别定位提交和提示词；插件提供按消息锚定的联动入口。README 将 Claude Code 风格检查点作为行为参照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 用户命令 | 撤回目标消息及之后的模型可见内容 | 目标仍在当前 surface，原日志保留 |
| 文件检查点 | 恢复目标消息时受跟踪的本地文件状态 | 部分路径会被跳过，需独立备份 |
| Web 操作与预览 | 按消息选择模式、查看影响并回填 | 依赖 Web profile 槽位、连接服务与 CSS 锚点定位 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ≥24.9.0 与清单声明 DSH 范围 | 是 | 宿主及 Web 出口 | 范围外能力未核实 |
| Web profile 与 CSS 锚点定位 | 界面需要 | 挂载行内动作、命令面板和预览 | 可出现按钮或预览不可用 |
| 本地可映射路径、fs 与 workingDirectory | 文件追踪需要 | 解析工具目标并读取前态 | 非本地后端或服务缺失会少记录 |
| 独立 Git 基准或备份 | 试用需要 | 核对部分恢复和退出 | 缺少对照时无法确认完整恢复 |

#### 操作流程

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 建立基准 | 用户 | 在可丢弃目录保存 Git 版本，固定 Web profile | 缺退路则先准备备份 |
| 运行一个编辑 | 用户及宿主 | 发送写入小文件的消息并检查存在可用检查点 | 无检查点时先只试对话 |
| 预览后回退 | 用户及插件 | 选消息并核对计划；先演练仅对话再演练带文件 | 预览缺失或回执失败时停止写入 |
| 核对及退出 | 用户 | 对照实际 diff 和会话，保留需恢复的快照 | 差异异常用 Git 恢复，再禁用或卸载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 隔离 profile 与备份空间 | 核对包名、宿主与浏览器 | 金额和工时未测 |
| 持续 | 每条消息的已跟踪集合扫描和变化版本副本 | 核对预览、回执及文件 diff | 保留最近 100 条，实际字节和延迟未知 |
| 失败恢复 | 独立备份及对照空间 | 对照会话、文件、权限，必要时从 Git 恢复 | 逐文件恢复可能部分成功 |
| 退出 | 按需暂留快照 | 禁用或卸载，按需新开分支保留旧上下文 | 原日志可含已撤回信息 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 上下文撤回 | 以真实人类消息定位并替换当前 surface | 不同宿主与模型实测结果 |
| 恢复已跟踪文件 | 目标检查点前态与逐文件动作 | 故障条件下完整恢复及耗时 |
| 同窗再试 | 回填同会话提示，保留现有文字草稿 | 浏览器覆盖和用户实际节省 |

> **思考**：[Q02](#research-q02) 和 [Q03](#research-q03) 显示，宿主先提交对话标记，再逐文件删除或替换，旧格式快照会被忽略。跳过、版本缺失或进程中断后可能留下部分恢复，未被工具跟踪的改动也无法从这些文件记录追回。预览缺失或失败回执需触发独立核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 展示了同窗回退的组合贡献。插件复用 DSH 消息替换保持原日志，把真实用户消息同时作为文件检查点和提示词回填的锚点，使两种回退可以用一个界面发起。文件侧依靠稠密记录复用未变版本，适用范围由实际跟踪和保留窗口决定。

[Q02](#research-q02) 的按消息稠密记录、明确 ENOENT 才记不存在、按路径重新检查锚定，以及 [Q03](#research-q03) 的按组件身份释放 Web 槽位都可复用。需要把回退和宿主状态分开验证，尤其关注同大小时间戳捷径和实际宿主鉴权。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 和 [Q03](#research-q03) 显示，宿主先提交对话标记，再逐文件删除或替换，旧格式快照会被忽略。跳过、版本缺失或进程中断后可能留下部分恢复，未被工具跟踪的改动也无法从这些文件记录追回。预览缺失或失败回执需触发独立核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在固定 Web profile 与可丢弃目录先试一个小文件，用 Git 差异确认结果；[Q02](#research-q02) 所列跳过、失败和追踪空白出现时暂停续写，先恢复独立基准。仅用对话功能时可以关闭文件检查点。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持同窗对话回退与局部文件恢复机制。将文件回执独立展示是待验证设计，真实浏览器、宿主版本和中断恢复表现仍待测。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、cordis.patch.yml、scripts/build.mjs、src/index.ts、src/rewind.ts、src/snapshot.ts、src/client/index.ts、src/client/rewind-flow.ts、src/client/mount.tsx、src/client/popover.ts、CHANGELOG.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仓库根插件的 Cordis/Web 双入口、命令及回填、快照捕获和逐路径恢复、主要安全与退出条件。抽读关键链路，未审计全部浏览器渲染、清理分支或宿主鉴权。
- 下一步：以一个受跟踪小文件、一个外部改动和一个失效版本构成对照，核对消息 surface、版本差异及分步回执，再在不同浏览器内核测预览和退出。记录运行版本与每次合格回退的耗时和增量字节。

**分析版本**

- **仓库**：[SiriLee/dsh-rewind](https://github.com/SiriLee/dsh-rewind)
- **版本号**：0.22.1（[固定提交 99ad241](https://github.com/SiriLee/dsh-rewind/tree/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出把预览覆盖缺口、对话提交和逐文件结果拆成可核对的状态。以缺失备份和同大小外部编辑为对照样本，比较误继续频率及核对耗时，判断是否值得增加确认步骤。

以一个受跟踪小文件、一个外部改动和一个失效版本构成对照，核对消息 surface、版本差异及分步回执，再在不同浏览器内核测预览和退出。记录运行版本与每次合格回退的耗时和增量字节。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 3093 | — | — | 35341 |
| .mjs | source | 7 | 959 | 668 | 219 | — |
| .tsx | source | 4 | 850 | 524 | 253 | — |
| .ts | source | 22 | 7170 | 4873 | 1830 | — |
| .ts | test | 39 | 7851 | 6062 | 1031 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/SiriLee/dsh-rewind/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=19&color=737b86&logo=github)](https://github.com/SiriLee/dsh-rewind/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=19&color=737b86&logo=github)](https://github.com/SiriLee/dsh-rewind/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在同一 DSH 会话中试错的开发者，何时能用一次消息锚定的回退恢复可继续工作的状态，哪些操作必须留给独立备份？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 同窗口回退如何改变消息上下文，适合替代哪部分人工操作？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合在同一 DSH 会话中反复改写实现指令的开发者。例如一次编辑方向错误时，用户选中发出错误指令的那条消息，回到发出它之前，再把原指令改写重发。Git 可以恢复已保存的文件版本，无法替当前会话切换模型可见消息；新建分支能保留另一条探索线，但用户要切换会话并重新整理下一条提示。插件用 DSH 自己的消息表面替换机制把这两步组织在同一界面，文件是否恢复仍要逐项核对。

规划只接受当前 surface 中真实用户发出的消息，注入上下文及压缩后已被遮蔽的目标会被拒绝。宿主对同一会话限制一个回退进行；如有运行回合，会先请求取消并保留 inbox，等待停止后清除待处理插话，接着重新读取事件和 surface，追加含替换范围及来源事件序号的 marker。目标和之后的可见内容从当前 surface 被替换，原日志仍保留，独立的计划模式也保持原状态。客户端只在收到此次命令成功结果并仍处于原会话时尝试回填，已有文字草稿会受保护，图片恢复另走尽力路径。这个回执证明上下文命令完成，文件结果仍可能是无检查点或部分失败。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:51-65](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/README.zh.md#L51-L65)

作者说明同窗操作、保留日志和退出后的分支办法。

<details>
<summary>查看原文（15行）</summary>

```text
## 使用

1. 在对话中找到要回退的那条用户消息，或输入 `/rewind`（或其别名 `/undo`）打开回退菜单。
2. **选中它。** 小浮层提供两种模式——「仅回退对话」或「回退对话和文件」。
3. 对话还原后，所选消息的原始提示词会回填到输入框，可重新发送或编辑。

**键盘操作**：候选列表与模式浮层均支持 ↑↓ 移动、Enter 确认、Esc 取消/返回。

<details>
<summary><b>边界说明</b></summary>

- **回退内容完整保存**——被撤回的内容仍在日志中，可在「轨迹」面板查看；也可禁用插件让它们重新显示（仅界面）。
- **回退无法原地撤销**——但可以先禁用插件让被撤回的内容重新显示，再在回退前的位置上点「在新对话中分支」，新会话的上下文即可包含这些内容。
- **插话也能回退**——模型尚未读取的 `steering` 插话消息，同样可作为回退目标，不会打断当前生成。
- **回退已读消息会打断当前正在运行的回合**——确保回退的安全执行。
```

</details>

**依据 2 · 源码核查**：[src/rewind.ts:213-238](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/rewind.ts#L213-L238)

验证真实人类消息、当前 surface 与包含目标的撤回范围。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/index.ts:608-646](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/index.ts#L608-L646)

取消、会话内串行与追加 marker 的执行顺序。

<details>
<summary>查看原文（39行）</summary>

```text
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
      return rewindErrorResult(error)
    }

    const marker = buildMarker()
    let event: ReturnType<Session['append']>
    try {
      event = agent.session.append('user/message', marker, {
        surfaceOp: { op: 'replace', startSeq: plan.surfaceStart as SessionSeq, endSeq: plan.surfaceEnd as SessionSeq },
```

</details>

**依据 4 · 源码核查**：[src/index.ts:645-660](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/index.ts#L645-L660)

替换范围绑定旧事件，计划模式属于另外的日志事件。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 5 · 源码核查**：[src/client/rewind-flow.ts:172-213](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/client/rewind-flow.ts#L172-L213)

执行回执、原会话校验、图片恢复与草稿保护。

<details>
<summary>查看原文（42行）</summary>

```text
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
  }
  let text: string | undefined
  let images: readonly MessageImageRef[] | undefined
  try {
    const chat = chatOf(session)
    text = messageTextAt(chat, seq)
    images = messageAttachmentsAt(chat, seq)
  } catch (error) {
    rewindLog.warn('refill', `reading target content for @${seq} threw`, error)
    return
  }
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
```

</details>

#### 缺口

- 回填在真实 Web profile、模型切换及压缩后任务中的可用性未测。
  **影响**：试用建议仅适用于已能选中有效消息的任务。
  **进一步探讨**：用同一脚本对照手工分支，核对模型可见上下文、旧日志、计划模式、草稿与附件。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件检查点如何生成和恢复，哪些状态会缺失或只恢复一部分？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

进入用户消息前，pre-step 等最终调度结果，筛出真实用户消息，按 ID 写检查点。一次批次由上一个检查点的文件集合重扫，给每条消息复制稠密记录，因此多个同批消息可共享同一批初始文件状态。未出现过的路径由工具拦截在执行前首触碰记录，明确 ENOENT 才记录此前不存在。实际入口只跟踪 write/edit，并通过宿主 fs 与工作目录解析本地可达路径，子 Agent 会话与非本地后端被跳过。外部编辑只能在已跟踪路径的后续边界被重扫发现，shell 新改动、后台进程、数据库和网络动作没有通用捕获。检查点创建失败或备份关闭会丢弃当前引用，避免之后的写入落到上一条消息的记录。

恢复以目标消息 ID 查检查点，从最新跟踪集合取目标自己的文件行，后来才出现的路径才查保留窗口中目标之后第一条含该路径的记录。版本文件缺失、父目录锚定不符及符号/硬链接风险会影响恢复。宿主先写对话 marker，再逐文件删除或原子替换；某路径失败时继续收集结果，失败并不回滚已完成的文件或对话。源码还存在尺寸一致、工作文件 mtime 早于备份即略过的快速分支，回填成功不证明任意外部文件内容已经逐字复核。存储只保留每会话最近 100 个检查点，旧格式快照读入时仅警告并忽略。作者说明没有 journal 式回滚、续做或撤销，不能把单文件临时复制和 rename 当作跨文件恢复事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1174-1207](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/index.ts#L1174-L1207)

用户消息去重和边界写入，失败时清除 current。

<details>
<summary>查看原文（34行）</summary>

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
      for (const warning of warnings) ctx.logger.warn(`[dsh-rewind] ${warning}`)
    } catch (error) {
      // A checkpoint failure must not consume the user's message. Drop the
      // current reference so this turn's later first touches are skipped, and
      // let the next admitted step retry from the same tracked set.
      await store.abandonCurrent(agent.session.id).catch(() => undefined)
      ctx.logger.warn(`[dsh-rewind] checkpoint creation failed: ${error instanceof Error ? error.message : String(error)}`)
    }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:256-276](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/index.ts#L256-L276)

追踪名称、子会话和本地宿主路径约束。

<details>
<summary>查看原文（21行）</summary>

```text
async function captureFirstTouch(
  ctx: Context,
  fs: FileSystem,
  workingDirectory: WorkingDirectoryService,
  store: SnapshotStore,
  exec: ToolExecution,
): Promise<void> {
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

**依据 3 · 源码核查**：[src/snapshot.ts:281-326](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/snapshot.ts#L281-L326)

首次记录前态、链接和上限，原子持久化失败撤回内存行。

<details>
<summary>查看原文（46行）</summary>

```text
  async captureFirstTouch(sessionId: string, path: string): Promise<{ recorded: boolean; warnings: string[] }> {
    return await this.withLock(sessionId, async (state) => {
      if (!state.loaded) throw new Error(`checkpoint store for ${sessionId} is not loaded`)
      if (state.unavailable !== undefined) throw state.unavailable
      const current = state.current
      if (current === undefined) return { recorded: false, warnings: [] }
      if (Object.hasOwn(current.files, path)) return { recorded: false, warnings: [] }
      const warnings: string[] = []
      let live: Stats | undefined
      try {
        live = await lstat(path)
      } catch (error) {
        if (!isEnoent(error)) {
          warnings.push(`first-touch probe failed for ${path}: ${messageOf(error)}`)
          return { recorded: false, warnings }
        }
      }
      const parent = await locationPin(path)
      if (parent === undefined) {
        warnings.push(`first-touch skipped ${path}: no location pin`)
        return { recorded: false, warnings }
      }
      let row: FileState
      if (live === undefined) {
        row = { v: 1, blob: null, parent }
      } else {
        if (!live.isFile() || live.nlink > 1) return { recorded: false, warnings }
        if (this.isOverFileCap(live.size)) return { recorded: false, warnings }
        let written: { name: string; size: number }
        try {
          written = await this.writeVersion(sessionId, path, 1)
        } catch (error) {
          warnings.push(`first-touch copy failed for ${path}: ${messageOf(error)}`)
          return { recorded: false, warnings }
        }
        row = { v: 1, blob: written.name, size: written.size, mode: live.mode & 0o7777, parent }
      }
      current.files[path] = row
      try {
        await writeJsonAtomic(current.file, checkpointToJson(current))
      } catch (error) {
        delete current.files[path]
        throw error
      }
      state.tracked.add(path)
      return { recorded: true, warnings }
```

</details>

**依据 4 · 源码核查**：[src/snapshot.ts:620-660](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/snapshot.ts#L620-L660)

目标行优先，后出现的路径走首条保留记录，并核对版本和父路径。

<details>
<summary>查看原文（41行）</summary>

```text
    const failed: { path: string; message: string }[] = []
    const uncovered: UncoveredPath[] = []
    for (const path of Object.keys(latest.files)) {
      const row = Object.hasOwn(target.files, path)
        ? target.files[path]!
        : this.firstRowAfter(state, target.time, path)
      if (row === undefined) {
        skipped.push({ path, reason: 'missing' })
        continue
      }
      if (row.parent === undefined) {
        skipped.push({ path, reason: 'parent' })
        continue
      }
      if (row.blob === null) {
        const live = await lstat(path).catch((error: unknown) => {
          if (!isEnoent(error)) return undefined
          return null
        })
        if (live === null) continue
        if (live !== undefined && live.isFile() && this.isOverFileCap(live.size)) {
          uncovered.push({ path, size: live.size })
        }
        if (live !== undefined && !(await parentStillMatches(path, row.parent))) {
          skipped.push({ path, reason: 'parent' })
          continue
        }
        if (await isUnsafeTarget(path)) {
          skipped.push({ path, reason: 'unsafe' })
          continue
        }
        actions.push({ path, action: 'delete', parent: row.parent })
        continue
      }
      const source = join(this.versionsDir(state.sessionId), row.blob)
      const version = await lstat(source).catch(() => undefined)
      if (version === undefined || !version.isFile() || version.size !== row.size) {
        failed.push({ path, message: 'recorded version is missing or has the wrong size' })
        continue
      }
      if (!(await parentStillMatches(path, row.parent))) {
```

</details>

**依据 5 · 源码核查**：[src/snapshot.ts:668-685](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/snapshot.ts#L668-L685)

相同大小和较早 mtime 时可绕过内容比较。

<details>
<summary>查看原文（18行）</summary>

```text
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

**依据 6 · 源码核查**：[src/snapshot.ts:351-388](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/snapshot.ts#L351-L388)

逐项删除、替换、跳过和失败，之前的成功不被回滚。

<details>
<summary>查看原文（38行）</summary>

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
    })
```

</details>

**依据 7 · 源码核查**：[src/snapshot.ts:711-736](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/snapshot.ts#L711-L736)

复制到同目录临时文件并重命名，权限恢复为尽力操作。

<details>
<summary>查看原文（26行）</summary>

```text
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
    }
```

</details>

**依据 8 · 源码核查**：[src/snapshot.ts:749-763](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/snapshot.ts#L749-L763)

旧数据被忽略，缺新元数据时丢弃新布局数据。

<details>
<summary>查看原文（15行）</summary>

```text
    if (this.hasLegacyMembers(names) && !this.legacyWarned.has(session.id)) {
      this.legacyWarned.add(session.id)
      warnings.push(`legacy snapshot data ignored for ${session.id}`)
    }
    const metaPath = join(dir, META_FILE)
    let raw: string
    try {
      raw = await readFile(metaPath, 'utf8')
    } catch (error) {
      if (!isEnoent(error)) throw error
      if (names.includes(CHECKPOINTS_DIR) || names.includes(VERSIONS_DIR)) {
        warnings.push(`checkpoint metadata missing for ${session.id}; discarded new storage`)
        await this.discardNewStorage(session.id)
      }
      return
```

</details>

**依据 9 · 源码核查**：[src/snapshot.ts:872-887](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/snapshot.ts#L872-L887)

仅保留固定窗口及被保留行引用的版本。

<details>
<summary>查看原文（16行）</summary>

```text
  private trimRetained(state: SessionState): void {
    if (state.order.length <= RETAINED_CHECKPOINTS) return
    const evicted = state.order.slice(0, state.order.length - RETAINED_CHECKPOINTS)
    for (const checkpoint of evicted) state.checkpoints.delete(checkpoint.file)
    state.order = state.order.slice(-RETAINED_CHECKPOINTS)
  }

  /** Delete unreferenced versions and non-retained manifests. */
  private async gc(sessionId: string, state: SessionState): Promise<string[]> {
    const warnings: string[] = []
    const retained = state.order.slice(-RETAINED_CHECKPOINTS)
    const retainedFiles = new Set(retained.map(checkpoint => checkpoint.file))
    const keep = new Set<string>()
    for (const checkpoint of retained) {
      for (const row of Object.values(checkpoint.files)) {
        if (row.blob !== null) keep.add(row.blob)
```

</details>

**依据 10 · 作者声明**：[CHANGELOG.md:45-59](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/CHANGELOG.md#L45-L59)

作者说明稠密检查点、旧格式与回滚职责变化。

<details>
<summary>查看原文（15行）</summary>

```text
### 新增功能

- **文件检查点改为按用户消息的 checkpoint 机制。** 每条用户消息（含中途插话）一张稠密检查点，记录当时每个已跟踪文件的状态；外部修改在下一个消息边界进入记录。「不变不存」只针对实际备份：未变的文件仍保留记录，只复用版本、不写新副本；每个会话保留最新 100 张检查点。（#87）@slev-agent @SiriLee

### 问题修复

- **回退与写前备份不再留下多余状态。** 回退直接取目标消息自己的行；目标之后才被追踪的文件用首次触碰前的状态兜底，不再向更晚的消息找。写前备份只在文件尚未被记录时执行，已跟踪文件的编辑不再产生没有消费者的额外副本（#85）。（#87）@slev-agent @SiriLee

### 体验优化

- **回退结果更明确。** 目标没有文件检查点时明确报告；每个被跳过的路径（超限、符号/硬链接、父目录被重指、没有记录行）都带原因逐项列出。（#87）@slev-agent @SiriLee

### 其他变更

- **升级与还原行为有变。** 旧快照不再读取或迁移；旧会话的文件回退历史不可用，旧数据会随会话目录的既有清理一并移除，不需要单独处理。`dedup` / `maxAnchorGroups` 旧配置照常加载但被忽略。还原不再提供回滚、续做或撤销；每个文件原子替换，整轮非事务，崩溃后重跑同一回退收敛。（#87）@slev-agent @SiriLee
```

</details>

#### 缺口

- 未在不同文件系统上模拟回退中断、重定向路径、权限变更和同大小外部写入。
  **影响**：不能承诺重启后重复调用一定恢复完整工作树。
  **进一步探讨**：在可丢弃目录故障注入，并逐文件比较内容、权限及对话状态；保留独立 Git 或备份对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 在什么环境值得小范围试用，怎样核对预览及退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

清单要求 Node ≥24.9.0、DSH ≥0.2.2-rc.1 且低于 0.3.0-0，Web 客户端依赖宿主槽位、命令 UI、会话、语言和配置服务。安装应按 README 所指的 dsh-rewind-plugin 名称核对包与宿主版本。浏览器行内按钮通过接管宿主标准渲染器插入并在释放时仅还原自己的替换，依赖 slot entries 接口及宿主行标识；无 entries 则无操作。浮层用 CSS anchor-name 与 position-anchor 跟随触发点，换宿主或浏览器内核应实际检查。预览与候选走 connection 的精确 POST 路由，处理器校验请求和挂载会话，缺连接或注册失败时不能依靠完整预览。此处只看到路由接线与会话查询，未核实宿主整条鉴权链。

建议会重复在同一对话中撤回指令的开发者，从隔离的 Web profile 和可丢弃的 Git 工作树试用。先保存一个 Git 基准，分别演练只回退对话，以及对一个已跟踪小文件的对话加文件回退，逐一对照预览、输出与实际 diff。备份会产生扫描、版本副本与保留清理成本，随文件集合和消息边界频率改变，当前无法量化。只需要对话操作可关闭新检查点。发现跳过、失败、预览缺失或工作树与预期不符就停止继续写入，先用独立备份恢复，再考虑禁用或卸载。卸载前保留仍需恢复的数据，重开旧上下文可在旧位置建立新会话分支。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:24-67](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/package.json#L24-L67)

包支持范围、宿主与客户端导出、Web 平台与注入服务。

<details>
<summary>查看原文（44行）</summary>

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
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "docs/DETAIL.md",
    "docs/DETAIL.zh.md",
    "docs/preview.svg",
    "docs/preview.zh.svg",
    "SECURITY.md",
    "locale/*.json",
    "assets/icon.svg"
  ],
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
  },
```

</details>

**依据 2 · 源码核查**：[src/client/mount.tsx:160-174](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/client/mount.tsx#L160-L174)

缺槽位枚举不挂载，实际按钮通过替换宿主渲染器实现。

<details>
<summary>查看原文（15行）</summary>

```text
export function installRowAction({ slots, render }: RowActionMount): () => void {
  if (typeof slots.entries !== 'function') return () => {}
  const readEntries = (key: string): readonly LedgerEntry[] => slots.entries!(key)
  /** Taken-over entries and the exact identity each replaced. */
  const taken = new Map<LedgerEntry, { readonly original: unknown; readonly replacement: Renderer }>()

  const takeOver = (entry: LedgerEntry): boolean => {
    if (taken.has(entry)) return false
    const official = rendererOf(entry.component)
    if (official === undefined) return false
    const replacement = rowWithAction(official, render)
    taken.set(entry, { original: entry.component, replacement })
    entry.component = replacement
    return true
  }
```

</details>

**依据 3 · 源码核查**：[src/client/mount.tsx:187-209](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/client/mount.tsx#L187-L209)

只接管目标优先级的行，并按组件身份释放。

<details>
<summary>查看原文（23行）</summary>

```text
  const sync = (): void => {
    let changed = false
    for (const entry of readEntries(CHAT_NODE_SLOT)) {
      const key = entry.options.key
      if (key === undefined || !ROW_KEYS.has(key)) continue
      // Decorate only the shipped row: a shadow resolves its delegate by
      // excluding its own identity, so replacing that identity would recurse.
      if ((entry.options.priority ?? SHIPPED_ROW_PRIORITY) !== SHIPPED_ROW_PRIORITY) continue
      changed = takeOver(entry) || changed
    }
    if (changed) tick()
  }

  sync()
  const unsubscribe = slots.subscribe?.(CHAT_NODE_SLOT, sync)
  return () => {
    unsubscribe?.()
    for (const [entry, record] of taken) {
      // Restore only our own identity: a later takeover of the same entry stays.
      if (entry.component === record.replacement) entry.component = record.original
    }
    taken.clear()
  }
```

</details>

**依据 4 · 源码核查**：[src/client/popover.ts:351-366](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/client/popover.ts#L351-L366)

使用 CSS anchor-name 和 position-anchor。

<details>
<summary>查看原文（16行）</summary>

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

  /** Re-check the anchor after a content render; CSS owns placement. */
  const recheck = (): void => {
    if (!root.isConnected) return
    if (!anchor.isConnected && popoverEl === root) closePopover()
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1211-1232](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/index.ts#L1211-L1232)

preview/candidates 依赖 connection.fetch 路由。

<details>
<summary>查看原文（22行）</summary>

```text
  // Read-only queries travel over exact `/api` routes; the Fetch registry does
  // not read `webServer` from Connection's own context. See audit U10.
  ctx.inject(['connection'], (scope) => {
    const connection = (scope as unknown as { readonly connection?: RewindFetchHost }).connection
    if (connection === undefined) return
    const agentsOf = (): AgentLookup | undefined => scope.get('agents') as AgentLookup | undefined
    const checkpointingEnabled = (): boolean => isFileCheckpointingEnabled(config)
    const register = (path: string, query: RewindQuery): void => {
      try {
        scope.effect(() => connection.fetch.register({
          path,
          methods: ['POST'],
          requestBody: 'buffered',
          fetch: createRewindQueryHandler(ctx, store, agentsOf, checkpointingEnabled, query),
        }), `dsh-rewind ${path} route`)
      } catch (error) {
        ctx.logger.error(`[dsh-rewind] route registration failed for ${path}: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    register(REWIND_PREVIEW_PATH, 'preview')
    register(REWIND_CANDIDATES_PATH, 'candidates')
  })
```

</details>

**依据 6 · 源码核查**：[src/index.ts:415-443](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/index.ts#L415-L443)

预览输入校验和已挂载 session 查找。

<details>
<summary>查看原文（29行）</summary>

```text
  return async (request) => {
    try {
      if (request.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase() !== 'application/json') {
        return new Response('content type must be application/json', { status: 415 })
      }
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

**依据 7 · 作者声明**：[README.zh.md:34-49](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/README.zh.md#L34-L49)

安装名和错包警告。

<details>
<summary>查看原文（16行）</summary>

````text
## 安装

**命令行**：

```sh
dsh plugin --profile <name> add dsh-rewind-plugin
```

**图形界面**：**插件**页 → **添加插件** → 填入 `dsh-rewind-plugin` → 安装。

<img src="assets/screenshots/add-plugin.png" width="600" alt="「添加插件」弹窗：在输入框填入 dsh-rewind-plugin"><br>

默认安装适配最新的 DSH 稳定版本。若你的 DSH 版本不同，请在 [Releases](https://github.com/SiriLee/dsh-rewind/releases) 页面找到匹配的插件版本。

> [!WARNING]
> npm 上的 `dsh-rewind` 属于其他作者，请用 `dsh-rewind-plugin` 安装。
````

</details>

**依据 8 · 作者声明**：[README.zh.md:69-90](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/README.zh.md#L69-L90)

作者描述存储、开关、可选清理与卸载。

<details>
<summary>查看原文（22行）</summary>

````text
## 快照管理

使用 dsh-rewind 时，在你每次发送一条会开启新一轮的提示词之前，检查点会自动捕获代码状态。这些检查点构成会话的**快照**，保存在 `<dsh home>/rewind-snapshots/`（默认 `~/.dsh/rewind-snapshots/`）。插件为每个会话保留最近 100 个检查点的文件快照；丢弃更早的检查点时，会删除不再被任何保留检查点引用的快照文件。

**快照备份**功能（默认开启）控制是否记录检查点。可在本插件的配置卡片中关闭。关闭后不再创建新的快照，关闭期间的文件改动无法还原；不需要文件还原的用户可以借此省去额外的副本与读写开销。

**快照自动清理**功能（默认关闭）启用后，会删除长期不活跃会话的快照目录——默认在会话闲置约 30 天后执行。可在本插件的配置卡片中配置和查看（自动清理开关与失活天数），详见[快照自动清理](docs/snapshot-auto-cleanup.zh.md)。

<img src="assets/screenshots/plugin-setting.png" alt="插件配置卡片：快照备份与自动清理" width="600">

## 卸载

```sh
# 卸载插件
dsh plugin --profile <name> remove dsh-rewind-plugin

# 如需同时删除本地数据
rm -rf <dsh home>/rewind-snapshots
rm <dsh home>/snapshot-cleanup-last-sweep.json
```

本插件的配置项保存在当前 Profile 的配置文件 `cordis.patch.yml` 中。如需彻底清理，可手动删除对应条目。
````

</details>

#### 缺口

- 未核对 npm tarball 和实际宿主 API 权限，也未测磁盘占用、首触碰延迟或浏览器回归。
  **影响**：仅适合有独立退路的试用，不能将声明范围视为验收结果。
  **进一步探讨**：固定包和宿主版本，在隔离 profile 比较可读预览、实际恢复、禁用和卸载；记录每个合格回退的耗时和增量字节。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样降低用户将对话成功误读为文件完整恢复的概率？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可以在确认前和执行后分别提供两份明确的回执。确认前列本次拟变更、已发现但无法覆盖、未纳入追踪三类范围，显示所依据的消息检查点 ID；执行后把对话 marker 已提交与文件各类结果独立展示，并对预览之后发生的漂移给出提示。现有预览由同一个 planLocked 生成 action 和 uncovered，但没有直接返回 skipped 或 failed；执行最终返回成功命令以及附加文字，客户端据此进入回填分支。因而用户可能从同一界面上的成功及提示词回填推断文件已完全恢复，这一推断需靠额外状态提示澄清。

这个方案仍是设计假设。用包含外部编辑、丢失版本文件及完全成功三种样本，对照现有界面与原型，测用户是否能正确决定继续编辑，以及核对所需步骤。若原型不能降低部分恢复后的误继续，或增加的确认负担抵消收益，就不增加流程。它也不会扩大可追踪文件集合，仍需独立版本控制。

#### 证据与依据

**依据 1 · 源码核查**：[src/snapshot.ts:334-346](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/snapshot.ts#L334-L346)

预览只输出 actions 与 uncovered。

<details>
<summary>查看原文（13行）</summary>

```text
  async preview(sessionId: string, messageId: string): Promise<{
    readonly files: readonly FileImpact[]
    readonly uncovered: readonly UncoveredPath[]
  }> {
    return await this.withLock(sessionId, async (state) => {
      this.assertUsable(state)
      const plan = await this.planLocked(state, messageId)
      return {
        files: plan.actions
          .map(action => ({ path: action.path, action: action.action }))
          .sort((a, b) => a.path.localeCompare(b.path)),
        uncovered: plan.uncovered,
      }
```

</details>

**依据 2 · 源码核查**：[src/snapshot.ts:351-388](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/snapshot.ts#L351-L388)

执行另外拥有 noCheckpoint、skipped 和 failed。

<details>
<summary>查看原文（38行）</summary>

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
    })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:690-716](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/index.ts#L690-L716)

失败和跳过通过附加文本呈现，外层命令可仍为 success。

<details>
<summary>查看原文（27行）</summary>

```text
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

**依据 4 · 源码核查**：[src/client/rewind-flow.ts:172-184](https://github.com/SiriLee/dsh-rewind/blob/99ad2414a69ff9b2ae9d2e18c67531cdda505ed0/src/client/rewind-flow.ts#L172-L184)

客户端收到 success 后继续原会话回填判断。

<details>
<summary>查看原文（13行）</summary>

```text
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
  }
```

</details>

#### 缺口

- 没有真实用户结果证明会发生误读或原型能降低误读。
  **影响**：不能将该推演当作版本已有价值。
  **进一步探讨**：在隔离环境按固定失败样本做有/无分离回执对照，记录误继续和额外步骤。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
