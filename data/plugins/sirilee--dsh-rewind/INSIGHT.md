# dsh-rewind

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[69c8c3d](https://github.com/SiriLee/dsh-rewind/tree/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948)

<!-- BEGIN META -->
[![GitHub ★ 225](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=225&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SiriLee/dsh-rewind) [![npm 30d 28,940](https://img.shields.io/static/v1?label=npm+30d&message=28%2C940&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rewind-plugin) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-rewind-plugin)
<!-- END META -->

> **功能**：在 DSH 原会话内回退到较早用户消息，并可按轻量写前备份还原已跟踪的工作区文件。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 用追加标记保留原日志并改变模型/界面可见内容，结合消息锚定的轻量文件备份与影响预览，形成更连贯的探索退路。源码机制不能证明所有状态已恢复。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03) 对话先重绕，文件可能跳过/失败；journal写入和rescue取得均可降级继续，无法无条件保证崩溃完整回滚。未跟踪、超限和关闭备份的历史仍有缺口。

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
  - [Q01 · 谁需要重绕，实际贡献超出会话编辑什么？](#detail-section-11)
  - [Q02 · 快照、预览和执行如何接线，有何部分失败？](#detail-section-12)
  - [Q03 · 启动、保存成本、清理和退出能否支持试用？](#detail-section-13)
  - [Q04 · 如何验证重绕的恢复承诺而非只看成功消息？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在同一DSH会话探索方案的用户，可撤回错误轮次并选择恢复已跟踪文件，减少另建分支的切换。

[Q01](#research-q01) 相对宿主分支加人工/Git恢复，增量是原会话上下文与局部检查点联动；并非整树历史或外部副作用撤销。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 同会话重绕 | 撤回目标消息及后续可见上下文 | 原日志仍保留，导出不是秘密擦除 |
| 影响预览 | 显示将恢复/删除和未覆盖路径 | 只代表已跟踪范围 |
| 轻量文件恢复 | 写回备份并分类报告结果 | 可能部分成功，不撤外部副作用 |
| 快照管理 | 保留和可选清理文件备份 | 清理会失去相应文件恢复依据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=24.9.0及声明DSH范围 | 必需 | Host/Client与surface机制 | 需精确固定，不能推断范围外兼容 |
| fs/workingDirectory/会话服务 | 文件备份时必需 | 路径解析、捕获与锚定 | 无法取得的路径不构成可恢复覆盖 |
| 可写DSH home和磁盘空间 | 文件恢复必需 | 快照、rescue、journal | I/O错误可能使恢复保障降级 |
| Git或独立备份 | 本研究试用前提 | 覆盖未跟踪和恢复失败 | 插件不替代整树历史 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/插件并保存独立备份 | 先用可丢弃目录，本轮未安装 |
| 编辑 | Host捕获父Agent写类工具并提交快照 | 关注超限/备份关闭/捕获告警 |
| 预览 | 用户选择历史消息与chat/both | 核查文件影响和uncovered |
| 执行 | 停轮重计划、追加标记再恢复文件 | 分别读restored/deleted/skipped/failed |
| 验收退出 | 用户核对上下文和磁盘 | 不一致则停止续写，独立备份恢复；不提前清快照 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 插件和独立备份空间 | 核版本与追踪边界 | 金额和时间未知 |
| 持续使用 | 写前快照、边界重扫、rescue/journal I/O | 审阅影响和备份保留策略 | 不变不存省重复，实际规模成本未测 |
| 失败恢复 | 独立备份与重试/回滚空间 | 分别核对对话和文件状态 | journal/rescue降级不保证全还原 |
| 退出 | 保留需恢复快照与原日志 | 卸载/偏好清理、独立恢复 | 原始导出仍含撤回内容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 上下文撤回 | 当前surface人类消息范围被追加标记替换 | 所有宿主/模型兼容与实际行为 |
| 局部文件还原 | 写前捕获与分类恢复结果 | 未跟踪/缺口历史、外部副作用 |
| 中断处理 | journal/rescue及逐文件回执 | I/O失败后完整恢复保证 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03) 对话先重绕，文件可能跳过/失败；journal写入和rescue取得均可降级继续，无法无条件保证崩溃完整回滚。未跟踪、超限和关闭备份的历史仍有缺口。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 用追加标记保留原日志并改变模型/界面可见内容，结合消息锚定的轻量文件备份与影响预览，形成更连贯的探索退路。源码机制不能证明所有状态已恢复。

[Q02](#research-q02) 人类消息规划、每会话inflight、明确不存在才记创建以及分类恢复回执值得借鉴。journal和rescue失败降级使可用性优先于强恢复保证，移植时应把这项取舍写进用户决策。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03) 对话先重绕，文件可能跳过/失败；journal写入和rescue取得均可降级继续，无法无条件保证崩溃完整回滚。未跟踪、超限和关闭备份的历史仍有缺口。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 固定版本并保留Git/独立备份，只在可丢弃目录先核对预览与实际结果。不要用它撤销数据库/网络副作用；有跳过、失败或状态不一致便停止自动续写，不在恢复前清理快照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查写前捕获、规划、会话标记与逐文件恢复失败分支；无目标运行或真实宿主验收。局部恢复支持与无条件完整恢复分开，未来协议未验证。

- 已检查：作者 README、包清单、源码路径 README.md、docs/compat/tracking-boundary.zh.md、package.json、src/index.ts、src/rewind.ts、src/snapshot.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根plugin，重点Host写前捕获/预览/规划/执行与snapshot逐文件恢复，未穷尽整个安全模型、全部清理分支或Client兼容；未执行目标代码。
- 下一步：按[Q04](#research-q04)在副本中注入追踪缺口、超限、journal/rescue失败，比较恢复等级是否减少错误续写；额外成本抵消收益或等级不对应真实状态则否定。本轮未执行。

**分析版本**

- **仓库**：[SiriLee/dsh-rewind](https://github.com/SiriLee/dsh-rewind)
- **版本号**：0.20.0-alpha.1（[固定提交 69c8c3d](https://github.com/SiriLee/dsh-rewind/tree/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在已有预览与分类结果上研究可恢复等级，把覆盖、rescue完整性和journal持久化结果转成确认前决策，比较误继续与额外负担；尚未验证。

按[Q04](#research-q04)在副本中注入追踪缺口、超限、journal/rescue失败，比较恢复等级是否减少错误续写；额外成本抵消收益或等级不对应真实状态则否定。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 23 | 2650 | — | — | 28616 |
| .mjs | source | 7 | 1922 | 1304 | 475 | — |
| .ts | source | 18 | 8386 | 5229 | 2686 | — |
| .tsx | source | 2 | 1206 | 676 | 465 | — |
| .ts | test | 42 | 9656 | 7277 | 1473 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/SiriLee/dsh-rewind/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=10&color=737b86&logo=github)](https://github.com/SiriLee/dsh-rewind/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/SiriLee/dsh-rewind/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对话重绕与文件快照如何对齐，恢复边界能否支持退出错误轮次？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要重绕，实际贡献超出会话编辑什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-rewind面向在DSH同一会话里探索方案、希望撤回错误用户消息及其后上下文的人。基线是宿主另建会话分支加人工/Git恢复文件。插件增加同窗口原会话surface替换，以及可选恢复已跟踪文件；合格结果必须分别检查模型可见上下文、界面与文件状态，而不是只看到消息变短。

对话日志仅追加标记而不删除历史，便于回查，但这不是擦除秘密：作者明确导出原始日志仍包含撤回内容。文件只跟踪写类工具处理过的路径与后续已跟踪外部变化，不是整树快照；从未跟踪的命令写入、子Agent编辑或备份关闭期间不可据此完整回滚。贡献是会话视图操作和轻量文件检查点的组合，不把Claude Code对齐声明当完全等价或原创算法证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-18](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/README.md#L16-L18)

作者说明消息和轻量文件备份。

```text
- **就地消息回退**——目标消息及其之后的内容同时从**模型上下文**和**渲染对话**中撤回，目标消息文本自动回填输入框。始终在原会话内完成，不新建分支、不残留副本。
- **轻量备份还原**——对齐 Claude Code：追踪写类工具编辑过的文件，回退时一并还原，已跟踪文件的外部变更也能还原。**局部追踪、写前备份、不变不存**，不依赖 git。
- **安全保障**——会话日志仅追加回退标记，从不删改；文件备份与还原经安全加固；**完备测试**，随 DSH 升级长期维护。安全模型：[SECURITY.md](SECURITY.md)。
```

**依据 2 · 作者声明**：[README.md:94-108](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/README.md#L94-L108)

作者给出分支/Git参照和追加标记机制。

<details>
<summary>查看原文（15行）</summary>

```text
相较于默认行为，本插件带来的变化：

| 维度 | 默认行为 | 本插件 |
| --- | --- | --- |
| 对话回退 | 新建分支对话 | **就地回退**——不用新建会话分支、不切窗口，也不产生残留会话副本，回退更便捷 |
| 文件还原 | 手动还原 / Git 管理 | **一键还原**——写前轻量备份，回退对话时可选一并还原文件，贴合 Agent 工作流 |
| 还原依赖 | 常依赖 Git 仓库或完整快照引擎 | **无依赖**——不依赖 Git 仓库，也不要求是代码项目，普通目录即可用 |

## 原理

整套设计只有两条主线，核心哲学朴素却克制：**对话部分「只遮蔽、不删除」**，使用 DSH 原生的「隐藏 + 替换」机制；**文件部分「局部追踪，写前轻量备份」**，参考 Claude Code 的检查点语义。

### 1. 对话回退：一次「遮蔽」，而不是「删除」

`append-only` 是铁律：会话日志只追加、从不改写——这是可审计与信息安全的地基。回退从不动历史，它只做一步：往日志末尾追加一条 **“空消息”标记**，把目标消息及其之后的全部内容「遮蔽 + 替换」掉，让模型和界面都只看得到目标之前的部分。
```

</details>

**依据 3 · 作者声明**：[README.md:129-150](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/README.md#L129-L150)

整树/子Agent边界与原始导出仍含撤回内容。

<details>
<summary>查看原文（22行）</summary>

```text
## 明确不做的事

本插件刻意保持轻量、聚焦「对话回退」这一件事，以下场景**不属于它的职责**：

- **整树 / Git 级快照**——只跟踪写类工具编辑 + 已跟踪文件的外部改动，从未被工具碰过的文件不还原。需要工作树级的完整快照回退时，请交给更专业的快照工具（git）。
- **子代理的编辑**——不追踪，子代理会话内也不提供回退（同 Claude Code）：子代理运行在自己的会话里，其备份无法由父会话的回退还原，因此也不会为子会话保留备份。
- **fork / 分支回退**——DSH 已内置「在新对话中分支」，不重复造轮子。

## 兼容性

- Node.js `>=24.9.0`。
- 支持的 DSH 版本由 `package.json` 的 `engines.dsh` 声明。
- 兼容性定义、验证方法与版本对齐详见 [docs/compat/audit.md](docs/compat/audit.md)。

> [!WARNING]
> 本项目与 DeepSeek Harness 均处于开发者预览阶段。可复现环境请 pin 精确版本，
> 并阅读上述行为说明。

## 已知问题

1. **导出的日志是完整内容**——`/export` 导出整个会话日志（原始 JSONL），包含**已撤回的内容**；本插件无法改动导出。
2. **轻量文件回退存在代价**——特定情况可能无法回退所有修改。行为与 Claude Code 一致。详见：[文件回退的追踪边界](docs/compat/tracking-boundary.zh.md)。
```

</details>

**依据 4 · 源码核查**：[src/rewind.ts:213-245](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/rewind.ts#L213-L245)

只接受当前surface中的人类用户消息，包含目标本身的替换范围。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 快照、预览和执行如何接线，有何部分失败？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Host在tools/execute前捕获指定写类工具目标，在post-execute提交，异常结果路径丢弃暂存。captureBefore只接有会话的父Agent写类工具，先通过fs解析与stat；只有明确不存在才记为新文件，过大或非普通文件跳过，避免把读取失败当“原本不存在”而误删。预览按会话和目标seq计算文件影响与uncovered，并标明备份关闭。

执行有每会话inflight防双击，非idle先请求取消并等待静止，重新用当前surface规划，追加标记后才恢复文件。由此对话成功和文件恢复不是事务；不支持的新存储版本会让文件不变但对话已重绕。恢复按文件继续，分别返回restored/deleted/skipped/failed，不能只读总体success。父目录移动会拒绝该文件，单文件失败不阻断整轮。

journal和rescue记录为恢复提供设计支持，但saveJournal持久化失败被吞掉，rescue复制失败也继续，后续rollback会跳过不能取得原状态的路径。不能把存在journal代码等同所有I/O失败后均可完整回滚。对话标记和磁盘实际状态应分别回读；恢复还会同步宿主文件观察，减少后续写入依赖旧状态。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:321-365](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/index.ts#L321-L365)

写前捕获的来源、缺失和大小边界。

<details>
<summary>查看原文（45行）</summary>

```text
async function captureBefore(
  fs: FileSystem,
  workingDirectory: WorkingDirectoryService,
  store: SnapshotStore,
  exec: ToolExecution,
  pending: Map<string, PendingCapture>,
): Promise<void> {
  if (!TRACKED_TOOLS.has(exec.name)) return
  // No agent Session → no anchor to commit the capture under (see `commitEntry`).
  const agent = exec.agent
  if (agent === undefined) return
  // Claude Code alignment: subagent edits are NOT tracked (official
  // checkpointing limitation). A subagent runs its own session, so a backup
  // recorded under the subagent session id could never be restored by a
  // rewind of the parent session — it would only leak on disk (the subagent
  // log is short, so the per-session 100-group prune never fires for it).
  // Skipping the capture here mirrors Claude Code's behavior exactly.
  if (isSubagentSession(agent.session)) return
  const path = mutationPathOf(exec)
  if (path === undefined) return
  // The fs tools' own base: the Session's current directory (`ensure` also
  // recovers a vanished one).
  const cwd = await workingDirectory.ensure(agent, exec.signal)
  const target = await resolveTarget(fs, path, cwd, exec.signal)
  if (target === undefined) return
  const info = await fs.stat(target, exec.signal).catch((error: unknown) => {
    // Only an affirmative "not found" answer becomes a creation. Any other
    // failure abandons the capture (the caller logs it and the tool proceeds
    // without a backup) — never a "was created" record, which a rewind would
    // turn into a delete of a file that exists.
    if (isNotFoundError(error)) return undefined
    throw error
  })
  // The SERVICE decides whether the file exists. Only `undefined` (no file)
  // records a creation; a non-regular target (directory / FIFO / device) is
  // never copied — it would either hang the copy or produce a meaningless
  // "backup".
  if (info !== undefined && info.type !== 'file') return
  // SIZE CAP: too large to back up, so record NOTHING — never a `before: null`
  // "was created" record, which a rewind would turn into a DELETE of a file
  // that exists. Uses the `size` the stat above already returned (no extra IO)
  // and lands before the staged copy, so a very large file is never read
  // (issue #39). The path is deliberately not registered as tracked: with no
  // record there is no history to contradict, so nothing can be mis-restored.
  if (info !== undefined && store.isOverFileCap(info.size)) return
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1432-1476](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/index.ts#L1432-L1476)

捕获、提交与异常暂存清理接线。

<details>
<summary>查看原文（45行）</summary>

```text
    scope.on('tools/execute', async (exec: ToolExecution, next): Promise<ToolExecutionResult> => {
      try {
        if (isFileCheckpointingEnabled(config)) {
          await captureBefore(fs, workingDirectory, store, exec, pending)
        }
      } catch (error) {
        ctx.logger.warn(`[dsh-rewind] before-capture failed for ${exec.name}: ${error instanceof Error ? error.message : String(error)}`)
      }
      return next()
    })

    scope.on('tools/post-execute', async (exec: ToolExecution, result: ToolExecutionResult, next): Promise<PostToolDecision> => {
      try {
        // Lazy 24h auto-cleanup: a tool result is the fallback trigger (covers
        // LLM work that never landed a user/message); the session id is the
        // directory that must never be pruned. A subagent session is SKIPPED:
        // it owns no snapshot, so its id would claim the sweep's
        // active-session exemption while shielding nothing, and the session the
        // user is actually in (the parent) would lose that exemption. Nothing
        // is lost — the parent's own tool result (the subagent call itself)
        // triggers the same one-shot sweep with the correct id.
        const session = exec.agent?.session
        if (session !== undefined && !isSubagentSession(session)) {
          void maybeRunAutoCleanup(ctx, store, session.id, dshHome, config?.autoSweepIntervalMs, lifecycle.signal)
        }
        await commitEntry(store, pending, anchorCache, trackedBySession, exec, result, isFileCheckpointingEnabled(config))
      } catch (error) {
        ctx.logger.warn(`[dsh-rewind] checkpoint commit failed for ${exec.name}: ${error instanceof Error ? error.message : String(error)}`)
      }
      return next()
    })

    scope.on('tools/result', (exec: ToolExecution): undefined => {
      // A THROW inside the `tools/execute` waterfall — from another wrapper,
      // not from the tool body (`dispatchToolBody` catches body errors and
      // still produces a post-result, so the body path keeps post-execute) —
      // short-circuits the registry's catch straight to `final-result`,
      // skipping `tools/post-execute`; its before-capture would otherwise leak
      // in `pending` forever (staged bytes on disk, not just memory).
      // `tools/result` fires on BOTH the normal and the throw path: drop the
      // staged copy here as the safety net (a no-op once commit consumed it).
      const key = `${exec.agent?.id ?? 'anon'}:${exec.callId}`
      const capture = pending.get(key)
      pending.delete(key)
      void discardCapture(capture)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:512-527](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/index.ts#L512-L527)

预览绑定当前会话/seq并显示uncovered。

<details>
<summary>查看原文（16行）</summary>

```text
async function previewImpact(
  store: SnapshotStore,
  session: Session,
  seq: number,
  checkpointingEnabled: boolean,
): Promise<PreviewImpact> {
  const plan = resolveOrError(session.snapshotEvents(), session.surface.nodes, `@${seq}`)
  let impacts: readonly FileImpact[]
  try {
    impacts = await store.impactsAfter(session.id, plan.targetSeq)
  } catch (error) {
    if (!(error instanceof UnknownStoreVersionError)) throw error
    throw new Error(t('storeUnsupported', { version: await store.readStoreVersion(session.id) ?? 0 }))
  }
  const uncovered = await store.uncoveredPaths(session.id).catch(() => [] as UncoveredPath[])
  return { files: impacts, uncovered, backupOff: !checkpointingEnabled }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:743-819](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/index.ts#L743-L819)

inflight、停轮、重计划、先标记后恢复及版本失败边界。

<details>
<summary>查看原文（77行）</summary>

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
      return rewindErrorResult(error)
    }

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

    let restore = ''
    if (mode === 'both') {
      // The restore touches the real worktree through raw node:fs (unlink /
      // writeFile), not the fs service, because it must also reach paths the
      // service would refuse as stale/absent. That is safe only because the
      // action set is the closed `planRestore`-derived one: paths the session
      // recorded, no symlink/hard link, differing from the disk.
      let outcome: RestoreOutcome | undefined
      try {
        outcome = await store.restoreAfter(agent.session.id, plan.targetSeq, path => unlink(path))
      } catch (error) {
        // Snapshots written by a newer build: fail the FILE RESTORE closed
        // (nothing was changed) while the conversation rewind above already
        // succeeded — the two are independent.
        if (!(error instanceof UnknownStoreVersionError)) throw error
        const version = await store.readStoreVersion(agent.session.id)
        restore = `${t('sep.clause')}${t('storeUnsupported', { version: version ?? error.version })}`
```

</details>

**依据 5 · 源码核查**：[src/index.ts:821-850](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/index.ts#L821-L850)

分类恢复结果和总体success的实际语义。

<details>
<summary>查看原文（30行）</summary>

```text
      if (outcome !== undefined) {
        // The restore wrote through plain node:fs, invisible to the harness
        // observation policy: re-sync it so the session's next write of a
        // restored/deleted file is not judged against the stale pre-restore
        // observation (see syncRestoreObservations).
        await syncRestoreObservations(ctx, fs, agent, outcome)
        const parts: string[] = []
        if (outcome.restored.length > 0) parts.push(t('restore.count', { count: outcome.restored.length }))
        if (outcome.deleted.length > 0) parts.push(t('delete.count', { count: outcome.deleted.length }))
        if (outcome.skipped.length > 0) {
          parts.push(t('skip.count', { count: outcome.skipped.length }))
          // Name the cap refusals: the conservative choice (leave a file alone)
          // must still be visible, never a silent omission.
          const capped = await store.uncoveredPaths(agent.session.id).catch(() => [] as UncoveredPath[])
          const skippedLines = renderSkipped(outcome, capped, store.fileCapBytes)
          if (skippedLines !== '') parts.push(skippedLines)
        }
        if (!checkpointingEnabled) parts.push(t('backupOff'))
        restore = parts.length > 0 ? `${t('sep.clause')}${parts.join(t('sep.list'))}` : t('noRestorable')
        restore += renderFailures(outcome.failed)
      }
    }

    // Every rewind withdraws the target message and everything after it; its
    // content is offered back in the composer for re-sending.
    return {
      kind: 'success',
      text: t('success', { targetSeq: plan.targetSeq, restore }),
      sourceEventSeq: event.seq,
    }
```

</details>

**依据 6 · 源码核查**：[src/snapshot.ts:1683-1737](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/snapshot.ts#L1683-L1737)

逐文件应用、父目录变化、失败继续与最终结果。

<details>
<summary>查看原文（55行）</summary>

```text
    const journal = await this.beginRestore(sessionId, targetSeq, actions, probe)
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i]!
      opts?.crash?.('before-action', i) // test-only: crash before the fs op
      const journalAction = journal.actions[i]!
      let applied: 'restored' | 'deleted' | 'enoent' | 'skipped'
      try {
        applied = await this.applyActionToDisk(
          action.action,
          action.path,
          action.action === 'restore' ? action.before : null,
          deleteFile,
          {
            ...(action.action === 'restore' && action.mode !== undefined ? { mode: action.mode } : {}),
            ...(action.parent !== undefined ? { parent: action.parent } : {}),
          },
        )
        if (applied === 'skipped') {
          // The directory moved between planning and this write: refuse, and
          // record why so the journal cannot claim the op completed.
          journalAction.failed = `parent directory moved or repointed: ${dirname(action.path)}`
          await this.saveJournal(journal)
          failed.push({ path: action.path, message: journalAction.failed })
          continue
        }
        if (applied === 'enoent') {
          // Already absent: the delete is already done — the target state is
          // reached. Mark the action and count nothing (Claude Code tolerates
          // the same).
          journalAction.done = true
          await this.saveJournal(journal)
          continue
        }
      } catch (error) {
        // Per-file failure, never aborting the pass (unchanged semantics).
        journalAction.failed = error instanceof Error ? error.message : String(error)
        await this.saveJournal(journal)
        failed.push({ path: action.path, message: journalAction.failed })
        continue
      }
      // Test-only crash: right after the fs op, before the done-mark — the
      // journal then shows done=false while the disk may already match, which
      // reconciliation resolves from the REAL disk (disk is truth).
      opts?.crash?.('after-action', i)
      journalAction.done = true
      await this.saveJournal(journal)
      if (applied === 'restored') restored.push(action.path)
      else deleted.push(action.path)
    }
    if (failed.length === 0) {
      journal.state = 'completed'
      journal.finishedAt = Date.now()
    }
    await this.saveJournal(journal)
    return { restored, deleted, skipped, failed }
```

</details>

**依据 7 · 源码核查**：[src/snapshot.ts:1764-1780](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/snapshot.ts#L1764-L1780)

journal保存失败非致命。

<details>
<summary>查看原文（17行）</summary>

```text
  /**
   * Best-effort journal persist: journal IO failures are non-fatal by design —
   * a restore must never fail because its audit journal could not be written.
   * reconcileRestores() re-derives the true state from the disk, so a missing
   * or stale journal only loses the trail, never the recovery ability.
   *
   * A journal read back from a legacy file is rewritten IN PLACE (same file),
   * so a redo / rollback of a pre-upgrade op never leaves two divergent
   * versions of the same op on disk.
   */
  private async saveJournal(journal: RestoreJournal): Promise<void> {
    try {
      const file = journal.sourceFile ?? this.journalPath(journal.sessionId, journal.id)
      await writeJsonAtomic(file, journalToJson(journal, this.sessionDir(journal.sessionId)))
    } catch {
      // Non-fatal (see above).
    }
```

</details>

**依据 8 · 源码核查**：[src/snapshot.ts:1811-1828](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/snapshot.ts#L1811-L1828)

rescue复制失败仍继续且限制回滚。

<details>
<summary>查看原文（18行）</summary>

```text
    for (const [index, action] of actions.entries()) {
      let rescue: ByteSource | null = null
      let rescueError: string | undefined
      const dest = join(rescueDir, `${index}${SIDECAR_SUFFIX}`)
      try {
        if (!rescueDirReady) {
          await mkdir(rescueDir, { recursive: true })
          rescueDirReady = true
        }
        const copied = await probe.copy(action.path, dest)
        if (copied.kind === 'copied') rescue = { kind: 'blob', path: dest }
        else if (copied.kind === 'failed') rescueError = copied.message
        // 'absent': the file is gone — rescue stays null, which is exactly
        // what rollback should restore (an absent path).
      } catch (error) {
        // The restore still proceeds exactly as before; rollback will skip
        // this path and report it instead of guessing.
        rescueError = error instanceof Error ? error.message : String(error)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动、保存成本、清理和退出能否支持试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

manifest要求Node>=24.9.0、DSH>=0.2.2-alpha.2且<0.3.0-0，必须固定实际宿主与插件版本。快照默认开启，存于DSH home，自动清理默认关闭；每条消息重扫已跟踪文件，体积上限和只存变化减少部分存储，但大工作区实际I/O、rescue空间与长会话负担未测。关闭备份、容量跳过或清理会产生不能补回的历史缺口，不可把后来重新开启当恢复了旧状态。

适合能保留Git/独立备份、理解局部追踪的个人开发者，在可丢弃目录先试用对话与跟踪文件。先核对预览与外部变更，避开不可撤销的服务/命令副作用；文件恢复不能撤销已发网络请求、数据库变化或未跟踪文件。出现uncovered、failed、缺少rescue/journal或对话/磁盘不一致，应停止自动续写并从备份人工核对。卸载可移除插件，日志仍保留；快照清理是另一个数据操作，不应在尚需恢复时删除备份。作者称禁用可显示撤回内容，但它只是界面回显，不是原地撤销本次重绕。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-27](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/package.json#L23-L27)

manifest精确宿主范围。

```text
  "license": "MIT",
  "engines": {
    "node": ">=24.9.0",
    "dsh": ">=0.2.2-alpha.2 <0.3.0-0"
  },
```

**依据 2 · 作者声明**：[README.md:64-90](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/README.md#L64-L90)

界面回显/无法原地撤销、快照开关清理和卸载边界。

<details>
<summary>查看原文（27行）</summary>

````text
- **回退内容完整保存**——被撤回的内容仍在日志中，可在「轨迹」面板查看；也可禁用插件让它们重新显示（仅界面）。
- **回退无法原地撤销**——但可以先禁用插件让被撤回的内容重新显示，再在回退前的位置上点「在新对话中分支」，新会话的上下文即可包含这些内容。
- **插话也能回退**——模型尚未读取的 `steering` 插话消息，同样可作为回退目标，不会打断当前生成。
- **回退已读消息会打断当前正在运行的回合**——确保回退的安全执行。

</details>

## 存储管理

**快照备份**（默认开启）：用于文件还原；可在本插件的配置卡片中关闭。关闭后不再创建新的快照，关闭期间的文件改动无法还原。快照存储于 `<dsh home>/rewind-snapshots/`（默认 `~/.dsh/rewind-snapshots/`）。手动删除该目录仅清除文件备份，对话回退不受影响，插件可自动重建。

**快照自动清理**（默认关闭）：把长期不活跃的会话快照整目录移除，不影响活动会话与对话日志。可在配置卡片查看与配置（自动清理开关、失活天数），也可用 `/snapshot-auto-cleanup` 命令查看、设置和运行。详见：[快照自动清理](docs/snapshot-auto-cleanup.zh.md)。

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

**依据 3 · 作者声明**：[docs/compat/tracking-boundary.zh.md:25-47](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/docs/compat/tracking-boundary.zh.md#L25-L47)

跟踪、上限/关闭与向后找备份造成覆盖范围限制。

<details>
<summary>查看原文（23行）</summary>

```text
### 备份从哪里来：追踪列表

插件不扫描整个工作区，只认一张**追踪列表**：文件被写类工具处理**一次**即加入；此后每条新的用户消息到达时，只复查名单里的文件；不在名单里的文件没有任何备份。

备份有两个来源：

- **写前备份**：模型调用写类工具时，在改动落盘**之前**取当前内容，记在**触发这一轮的那条用户消息**名下；
- **消息边界复查**：新消息到达时，若名单里某个文件当前的磁盘内容与**最近一份备份**不一致，就把当前内容记为**这条消息**的备份。这是外部编辑唯一的入口。

### 几种不产生备份的情形

- **不变不存**：边界复查发现磁盘与最近一份备份一致时，这次复查不写备份；若本回合稍后写类工具改动了该文件，那份写前备份照常记录。所以"没有改动文件的消息"自己不产生备份。
- **超量不存**：准备写备份之前若发现单个文件超过体积上限（默认 8 MiB，可用插件配置项 `maxFileBytes` 调整，设为 `0` 关闭），插件**拒绝备份**；这个文件在回到限制以下之前不会产生新的备份（旧备份仍在）。
- **主动关闭快照备份**：关闭期间，写前捕获与消息边界复查都不记录；重新开启后，关闭期间的状态仍是一个缺口，回退可能不充分。

### 还原：只依据备份

还原不读工作区的其他内容，也不做推断：

1. **找备份**：对每个文件，取**目标消息及其之后最早**的一份备份；目标消息自己没有备份时，就向更晚的消息找最早的那一份。
2. **与磁盘比对**：一致 → 不做任何操作；不一致 → 写回备份的内容（`null` → 删除该文件）。

向更晚的消息找，是因为"不变不存"意味着目标消息开始时的状态与最近一份备份相同——更晚消息的最早备份，记的正是那一刻的状态（前提是目标消息之后、那份备份之前没有未被记录的改动，见限制二）。反过来，不取"目标消息之前最近"的那份备份，是因为它可能早于一个**缺口**（限制二·表现 3）：写回它等于用更旧的版本覆盖当前文件。**宁可少还原，也不写错内容。**
```

</details>

**依据 4 · 源码核查**：[src/index.ts:821-840](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/index.ts#L821-L840)

已提供skipped/failed与backupOff提示，不误称全部静默。

<details>
<summary>查看原文（20行）</summary>

```text
      if (outcome !== undefined) {
        // The restore wrote through plain node:fs, invisible to the harness
        // observation policy: re-sync it so the session's next write of a
        // restored/deleted file is not judged against the stale pre-restore
        // observation (see syncRestoreObservations).
        await syncRestoreObservations(ctx, fs, agent, outcome)
        const parts: string[] = []
        if (outcome.restored.length > 0) parts.push(t('restore.count', { count: outcome.restored.length }))
        if (outcome.deleted.length > 0) parts.push(t('delete.count', { count: outcome.deleted.length }))
        if (outcome.skipped.length > 0) {
          parts.push(t('skip.count', { count: outcome.skipped.length }))
          // Name the cap refusals: the conservative choice (leave a file alone)
          // must still be visible, never a silent omission.
          const capped = await store.uncoveredPaths(agent.session.id).catch(() => [] as UncoveredPath[])
          const skippedLines = renderSkipped(outcome, capped, store.fileCapBytes)
          if (skippedLines !== '') parts.push(skippedLines)
        }
        if (!checkpointingEnabled) parts.push(t('backupOff'))
        restore = parts.length > 0 ? `${t('sep.clause')}${parts.join(t('sep.list'))}` : t('noRestorable')
        restore += renderFailures(outcome.failed)
```

</details>

#### 缺口

- 没有同版本真实宿主、崩溃恢复与外部修改场景的独立执行。
  **影响**：不能保证恢复覆盖或所有失败后的可回滚性。
  **进一步探讨**：在副本注入超限、关闭备份、journal/rescue写失败并逐字节回读。
- 缺少真实任务节时、误恢复率、存储和I/O负担数据。
  **影响**：无法证明比原生分支与Git恢复更省总成本。
  **进一步探讨**：固定探索任务对照分支/Git与插件，记录错误及完整恢复时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证重绕的恢复承诺而非只看成功消息？

**研究主题**：新假设与验证

#### 完整回答

现有预览、uncovered和分类结果已经暴露重要边界，不应再提出“加一张影响清单”作为新功能。由对话先提交、文件部分恢复和journal尽力写入，可推导一个假设：在确认前把本次恢复的覆盖范围、rescue是否完整和持久journal是否成功作为明确的可恢复等级，并由用户选择有条件继续或只重绕对话，可能减少误把整个任务回滚成功的行为。它会增加检查和失败处理，不能无成本地改成全部阻断。

最小实验用副本中已跟踪/未跟踪文件、超限文件、外部变更、journal写失败和rescue复制失败，比较当前信息与新增等级的两组用户决策。观测错误继续写入率、实际文件一致性、恢复完成率、额外存储/延迟和人工核查时间。若等级无法对应真实状态、导致误导或检查负担抵消减少的恢复损失，则否定。已有journal和rescue不等于该决策协议已被验证；未来设计不计入本插件已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:512-527](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/index.ts#L512-L527)

已有预览与uncovered作为基线。

<details>
<summary>查看原文（16行）</summary>

```text
async function previewImpact(
  store: SnapshotStore,
  session: Session,
  seq: number,
  checkpointingEnabled: boolean,
): Promise<PreviewImpact> {
  const plan = resolveOrError(session.snapshotEvents(), session.surface.nodes, `@${seq}`)
  let impacts: readonly FileImpact[]
  try {
    impacts = await store.impactsAfter(session.id, plan.targetSeq)
  } catch (error) {
    if (!(error instanceof UnknownStoreVersionError)) throw error
    throw new Error(t('storeUnsupported', { version: await store.readStoreVersion(session.id) ?? 0 }))
  }
  const uncovered = await store.uncoveredPaths(session.id).catch(() => [] as UncoveredPath[])
  return { files: impacts, uncovered, backupOff: !checkpointingEnabled }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:783-819](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/index.ts#L783-L819)

对话和文件分阶段，是可恢复等级的针对点。

<details>
<summary>查看原文（37行）</summary>

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

    let restore = ''
    if (mode === 'both') {
      // The restore touches the real worktree through raw node:fs (unlink /
      // writeFile), not the fs service, because it must also reach paths the
      // service would refuse as stale/absent. That is safe only because the
      // action set is the closed `planRestore`-derived one: paths the session
      // recorded, no symlink/hard link, differing from the disk.
      let outcome: RestoreOutcome | undefined
      try {
        outcome = await store.restoreAfter(agent.session.id, plan.targetSeq, path => unlink(path))
      } catch (error) {
        // Snapshots written by a newer build: fail the FILE RESTORE closed
        // (nothing was changed) while the conversation rewind above already
        // succeeded — the two are independent.
        if (!(error instanceof UnknownStoreVersionError)) throw error
        const version = await store.readStoreVersion(agent.session.id)
        restore = `${t('sep.clause')}${t('storeUnsupported', { version: version ?? error.version })}`
```

</details>

**依据 3 · 源码核查**：[src/snapshot.ts:1764-1780](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/snapshot.ts#L1764-L1780)

持久journal尽力写入的故障条件。

<details>
<summary>查看原文（17行）</summary>

```text
  /**
   * Best-effort journal persist: journal IO failures are non-fatal by design —
   * a restore must never fail because its audit journal could not be written.
   * reconcileRestores() re-derives the true state from the disk, so a missing
   * or stale journal only loses the trail, never the recovery ability.
   *
   * A journal read back from a legacy file is rewritten IN PLACE (same file),
   * so a redo / rollback of a pre-upgrade op never leaves two divergent
   * versions of the same op on disk.
   */
  private async saveJournal(journal: RestoreJournal): Promise<void> {
    try {
      const file = journal.sourceFile ?? this.journalPath(journal.sessionId, journal.id)
      await writeJsonAtomic(file, journalToJson(journal, this.sessionDir(journal.sessionId)))
    } catch {
      // Non-fatal (see above).
    }
```

</details>

**依据 4 · 源码核查**：[src/snapshot.ts:1811-1828](https://github.com/SiriLee/dsh-rewind/blob/69c8c3d3e41bdfcaa8f366684bccf5ff240dc948/src/snapshot.ts#L1811-L1828)

rescue不完整可能继续恢复。

<details>
<summary>查看原文（18行）</summary>

```text
    for (const [index, action] of actions.entries()) {
      let rescue: ByteSource | null = null
      let rescueError: string | undefined
      const dest = join(rescueDir, `${index}${SIDECAR_SUFFIX}`)
      try {
        if (!rescueDirReady) {
          await mkdir(rescueDir, { recursive: true })
          rescueDirReady = true
        }
        const copied = await probe.copy(action.path, dest)
        if (copied.kind === 'copied') rescue = { kind: 'blob', path: dest }
        else if (copied.kind === 'failed') rescueError = copied.message
        // 'absent': the file is gone — rescue stays null, which is exactly
        // what rollback should restore (an absent path).
      } catch (error) {
        // The restore still proceeds exactly as before; rollback will skip
        // this path and report it instead of guessing.
        rescueError = error instanceof Error ? error.message : String(error)
```

</details>

#### 缺口

- 恢复等级是否改善用户决策以及其延迟/存储负担未测。
  **影响**：不能声称它已降低恢复事故。
  **进一步探讨**：用固定副本故障集比较两组决策与真实状态，不一致则否定。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
