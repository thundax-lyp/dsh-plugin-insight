# dsh-diff-approval

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6f7e674](https://github.com/9087/dsh-diff-approval/tree/6f7e6745f475d87da6a95782de15f737e6b12759)

<!-- BEGIN META -->
[![GitHub ★ 15](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=15&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9087/dsh-diff-approval) [![npm 30d 4,518](https://img.shields.io/static/v1?label=npm+30d&message=4%2C518&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-diff-approval)
<!-- END META -->

> **功能**：在 DSH 会话旁捕获文件改动，提供差异审阅、保留回退、批注和版本控制变更导入。

> **亮点**：[Q01](#research-q01) 支持把改动、引用与批注接到会话审阅流程，降低往返定位的潜在负担；它是已有写入后的审阅辅助。

> **主要限制**：[Q02](#research-q02) 的普通回退没有所见内容比较前提，Undo读比较也不是原子比较发布；新建删除和重启不享有普遍Undo保证。

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
  - [Q01 · 从工具写入到待审列表，增加了什么且不保证什么？](#detail-section-11)
  - [Q02 · 回退、撤销和权限是否防止覆盖并发变更？](#detail-section-12)
  - [Q03 · 持久化、构建及VCS需要哪些条件？](#detail-section-13)
  - [Q04 · 什么任务值得试用，如何计量负担并验证新方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：与 Agent 共同编辑代码的开发者可在会话旁逐文件和逐块审阅，实际盘面与测试仍是验收依据。

参照外部git diff、编辑器与会话往返；不把Keep等同测试或写前审批。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自动改动捕获 | 建立待审差异 | 监听成功工具，非写前审批 |
| 文件与块决策 | 保留或恢复基线 | 需核盘面，普通回退无原子内容前提 |
| Undo与Redo | 反向操作审阅动作 | 内存栈，删除与重启有例外 |
| 差异批注 | 与Agent讨论具体行 | 语义正确性仍需人工 |
| VCS导入 | 查看未提交改动 | 依赖CLI，Git按HEAD基线 |
| 持久待审状态 | 重启后保留工作 | 写失败日志可见，不等操作回执成功落盘 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 构建产物与兼容DSH Web | 必需 | 加载Host与客户端 | 原源码目录不能冒充已验证包 |
| 宿主fs与会话策略 | 变更必需 | 文件读写和权限 | 拒绝或失败需核对部分进度 |
| 可写状态目录 | 持久化必需 | pending与评论存储 | 错误记日志，内存仍可见 |
| Git、SVN或Perforce CLI | 对应导入必需 | 获取未提交变更 | CLI和权限失败不能完成导入 |
| VCS起点、备份与单写者 | 试用条件 | 撤退和盘面对账 | 不以Undo代替备份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户保存VCS起点并核对构建包 | 保留可恢复文件 |
| 编辑 | Agent成功写文件后捕获 | 面板基线与盘面匹配 |
| 决定 | 人工逐项Keep或Revert | 文件内容符合意图并另跑测试 |
| 验收 | 重载检查待审与评论 | 保存错或部分完成先停动作，按VCS核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建包与本地资源 | 备份、宿主兼容和快捷键确认 | 耗时未知 |
| 持续使用 | 全文pending与评论存储 | 读差异、语义审查和测试 | 无单位合格审阅对照 |
| 失败恢复 | 文件和状态副本 | 核对并发覆盖与部分写入 | Undo仅内存，重启需VCS |
| 退出 | 保留未处理改动与批注 | 外部diff接管 | 先核对盘面再停用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话内审阅 | 成功写入后捕获与谱系过滤 | 代码正确性与节时 |
| 受策略恢复 | 原操作策略和内容检查 | 并发窗口内无覆盖 |
| 跨重启状态 | 原子JSON与部分错误回报 | 所有持久调用实际成功 |

> **思考**：[Q02](#research-q02) 的普通回退没有所见内容比较前提，Undo读比较也不是原子比较发布；新建删除和重启不享有普遍Undo保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 支持把改动、引用与批注接到会话审阅流程，降低往返定位的潜在负担；它是已有写入后的审阅辅助。

[Q02](#research-q02) 原策略归属与部分写入进度值得复用；[Q03](#research-q03) 针对临时rename失败重试有明确范围，不能扩成完整事务保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的普通回退没有所见内容比较前提，Undo读比较也不是原子比较发布；新建删除和重启不享有普遍Undo保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 备份后只在单写者树中小批试用，逐项核盘面与测试；分歧、保存失败或部分恢复时停止动作，用VCS和备份恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

捕获、谱系过滤、策略与部分恢复回报有源码支持；误覆盖率和审阅节时未知，原子比较方向未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/pending.ts、src/persist.ts、src/atomic-write.ts、src/vcs.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件抽读捕获、路径store、谱系动作、回退与Undo、持久化和VCS条件；未穷举客户端渲染、批注问答或各VCS适配，未执行目标。
- 下一步：在备份树中制造所见版本后外部写入和批次中途拒写，核文件、列表、评论及重载，比较外部diff流程总审阅时间和误覆盖。

**分析版本**

- **仓库**：[9087/dsh-diff-approval](https://github.com/9087/dsh-diff-approval)
- **版本号**：0.37.1（[固定提交 6f7e674](https://github.com/9087/dsh-diff-approval/tree/6f7e6745f475d87da6a95782de15f737e6b12759)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出未验证方向，将显示摘要与后端原子比较发布、持久和部分完成回执结合；并发与中断对照若不减少误覆盖及总恢复时间则放弃。

在备份树中制造所见版本后外部写入和批次中途拒写，核文件、列表、评论及重载，比较外部diff流程总审阅时间和误覆盖。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1342 | — | — | 15403 |
| .ts | test | 69 | 21523 | 15837 | 3701 | — |
| .mjs | example | 1 | 89 | 46 | 33 | — |
| .ts | source | 54 | 28379 | 16377 | 10733 | — |
| .mjs | source | 5 | 1343 | 815 | 446 | — |
| .tsx | source | 10 | 16163 | 10230 | 5667 | — |
| .tsx | test | 6 | 19077 | 13533 | 3973 | — |
| .md | example | 4 | 419 | — | — | 2439 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/9087/dsh-diff-approval/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/9087/dsh-diff-approval/issues?q=is%3Aissue+created%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z)

暂未获取：近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话内差异捕获与审阅是否提供可控文件决策，以及回退和撤销的状态边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从工具写入到待审列表，增加了什么且不保证什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

它适合与Agent共同编辑代码、希望在会话旁逐文件或逐块作决定的开发者。合格结果应是面板所见与盘面一致，保留或回退符合意图，随后另行通过代码测试。工具监听在成功的edit/write或编辑器结果之后捕获，不是写入前审批；Keep不能证明代码正确，Revert也不是取消尚未发生的动作。

PendingDiffStore以文件路径为全局唯一键，累计最早oldText到最新newText，并合并触及会话。谱系视图决定请求者可见和可操作哪些条目，actionableEntryOf拒绝不可见条目。相对外部git diff加会话往返，它把未处理改动、行引用和批注放到同一界面，增量是交接和定位便利。路径合并不等于多个工作区或租户隔离，仍须按文件实际所有权理解；Shell任意写入也不能仅凭这两个工具监听宣称全被捕获。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-17](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/README.md#L11-L17)

作者定位会话内差异审阅入口。

```text
A DeepSeek Harness (DSH) plugin for pending-change review: it automatically tracks every successful `edit`, `write`, and editor (`str_replace_editor`) mutation, folds them into a single pending list in the sidebar where each file's diff can be reviewed and kept/reverted — and it can also import the workspace's version-control repository's local changes (Git / SVN / Perforce) in one click.

![Floating review panel](docs/images/floating-panel.png)

The panel also collapses its review sidebar into a floating card; while floating, each of its four edges — the left sidebar, the header above, the right sidebar, the composer below — can be chosen to be covered (all four is what used to be fullscreen, and covering nothing is a plain floating card).

Two entries open it: the row at the sidebar foot, and a button in the Session header's right-hand controls — the cluster the app keeps its own per-session actions in (where "Download session log" lives) — so the review stays one click away with the sidebar collapsed or hidden.
```

**依据 2 · 源码核查**：[src/index.ts:2484-2496](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/index.ts#L2484-L2496)

成功工具结果后才捕获与异步持久化，证明不是写前审批。

<details>
<summary>查看原文（13行）</summary>

```text
  ctx.on('tools/result', (exec: Readonly<ToolExecution>, result: Readonly<ToolExecutionResult>) => {
    if (exec.name === 'str_replace_editor') {
      void captureEditorMutation(exec, result)
      return
    }
    if (result.isError || exec.agent === undefined) return
    const outcome = exec.name === 'edit' ? editOutcomeOf(result.value) : exec.name === 'write' ? writeOutcomeOf(result.value) : undefined
    if (outcome === undefined || outcome.oldText === outcome.newText) return
    const sessionId = exec.agent.id
    const entry: PendingEntry = { id: outcome.path, sessionId, ...outcome, updatedAt: Date.now(), sessionIds: [sessionId], lineage: lineageOf(sessionId, exec.agent), unseen: true }
    // Fold synchronously so the very next list sees the capture; persistence
    // (hydration + save) rides the same turn asynchronously.
    if (store.fold(entry)) persistSession()
```

</details>

**依据 3 · 源码核查**：[src/pending.ts:1-19](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/pending.ts#L1-L19)

全局路径身份与累计基线。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * In-memory pending-diff store: one entry per file path, globally, holding the
 * file's full set of unhandled changes as one cumulative span (earliest basis →
 * latest content) across every session and workspace that touched it. Every
 * later operation to a tracked path folds into its entry — `oldText` stays the
 * earliest basis, `newText` takes the latest content, and the touching sessions
 * accumulate in `sessionIds` — even when the chain breaks (an outside writer
 * changed the file between operations). Pure state and transitions; the plugin
 * body owns the `tools/result` observation, the RPC surface, and the
 * filesystem I/O.
 * @module dsh-diff-approval/src/pending
 */

import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { PendingEntry } from './types.ts'

/** Map key: the file path (the single global identity of a pending change). */
function pathKeyOf(path: string): string {
  return path
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1783-1800](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/index.ts#L1783-L1800)

实际动作按谱系可见性过滤。

<details>
<summary>查看原文（18行）</summary>

```text
  /**
   * The entry one id names, when the requesting session may act on it; `undefined` otherwise.
   *
   * Every action path resolves its entry through this, so an id outside the requester's lineage is
   * answered exactly like an id that names nothing — `missing` — and no action can reach a row the
   * requester cannot see.
   * @param view - the request's lineage view.
   * @param sessionId - the requesting session.
   * @param id - the entry id (its path).
   * @returns the entry, or `undefined` when it is absent or outside the view.
   */
  function actionableEntryOf(
    view: { sees: (sessionId: SessionId, entry: PendingEntry) => boolean },
    sessionId: SessionId,
    id: string,
  ): PendingEntry | undefined {
    const entry = store.get(id)
    return entry !== undefined && view.sees(sessionId, entry) ? entry : undefined
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 回退、撤销和权限是否防止覆盖并发变更？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

普通整文件回退先读当前文件用于Undo快照，再把记录的oldText写回，没有把面板所见newText作为写入前必须相等的条件。writeRevert传递请求会话的sandbox策略，但没有传预期内容；因此授权约束与防止陈旧覆盖是不同问题。删除新建文件时走removeRevert并检查策略，且该类回退不产生普通Undo快照。

Undo/Redo保留原操作的policySession，在同谱系间使用同一历史，避免换一个权限更宽的座位弹栈后扩大写权。恢复对预期文件有读比较，批次预检也检查权限与内容；不过比较之后另行调用writeText，源码未建立比较与发布不可分割的原子操作，仍有读写间并发窗口。多文件恢复逐个写入，失败回报已写数量，不是全批事务。Undo栈仅内存，重启丢失；不能依据README的每项可撤销宣传推导删除或重启都可恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1803-1848](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/index.ts#L1803-L1848)

写入携带策略、删除有策略检查，但write无expected参数。

<details>
<summary>查看原文（46行）</summary>

```text
  /**
   * Write a Revert through `ctx.fs`, carrying the session's sandbox policy
   * only when a confining backend is mounted (so the plain 4-arg call shape is
   * preserved for the unsandboxed composition).
   * @param target - the resolved target to write.
   * @param content - the restored file content.
   * @param sessionId - the entry's session, for the per-session policy.
   * @param signal - aborts before atomic publication takes effect.
   * @returns the write outcome.
   */
  async function writeRevert(target: FsTarget, content: string, sessionId: SessionId, signal: AbortSignal): Promise<unknown> {
    const policy = sandboxPolicyOf(sessionId)
    return policy === undefined
      ? ctx.fs.writeText(target, content, undefined, signal)
      : ctx.fs.writeText(target, content, undefined, signal, policy)
  }

  /**
   * Delete one file as a Revert, under the same session sandbox policy the write
   * path carries.
   *
   * A Revert of a created file removes it, and a removal is a mutation like any
   * other: going through a raw `processPath` + `rm` bypassed the confinement
   * entirely, so a `workspace-write` session could delete a file the very same
   * policy would refuse to write. The mode is therefore checked here, against the
   * target's own path, and the backend that does confine is handed the policy as
   * well: the check is what a build with no confining backend still enforces, and
   * passing the policy through is what lets a confining one enforce its own,
   * stricter rules. The plain `rm` remains the last resort for a deployment whose
   * `ctx.fs` has no delete verb of its own.
   * @param target - the resolved target to delete.
   * @param sessionId - the session whose policy governs the delete.
   * @param signal - aborts before the delete is issued.
   */
  async function removeRevert(target: FsTarget, sessionId: SessionId, signal: AbortSignal): Promise<void> {
    const policy = sandboxPolicyOf(sessionId)
    const osPath = processPathOf(target)
    if (policy !== undefined && !withinSandboxRoot(osPath, policy)) {
      throw new Error(sandboxDenial(osPath, policy))
    }
    const fs = ctx.fs as unknown as { remove?: (target: FsTarget, policy: SandboxExecutionPolicyLike, signal: AbortSignal) => Promise<unknown> }
    if (policy !== undefined && typeof fs.remove === 'function') {
      await fs.remove(target, policy, signal)
      return
    }
    await rm(osPath, { force: true })
```

</details>

**依据 2 · 源码核查**：[src/index.ts:2057-2094](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/index.ts#L2057-L2094)

普通回退不比较预期内容，删除例外与内存栈、原策略归属。

<details>
<summary>查看原文（38行）</summary>

```text
  async function revertEntryContent(entry: PendingEntry, sessionId: SessionId, signal: AbortSignal): Promise<{ before: DiffApprovalUndoState; after: DiffApprovalUndoState } | undefined> {
    const resolved = await ctx.fs.resolve(entry.path, { signal })
    if (entry.earlierVersion === 'none') {
      await removeRevert(resolved, sessionId, signal)
      return undefined
    }
    const preWrite = await ctx.fs.readText(resolved, undefined) ?? entry.newText
    const content = reencodeEol(entry.oldText, detectEol(entry.newText))
    await writeRevert(resolved, content, sessionId, signal)
    return {
      before: { id: entry.id, path: entry.path, entry, fileText: preWrite },
      after: { id: entry.id, path: entry.path, entry: undefined, fileText: content },
    }
  }

  // Undo/redo stacks, in memory only (lost on restart). Every undoable
  // keep/revert/block action pushes its before/after pair; undo restores
  // `before`, redo re-applies `after`. Actions that delete a file (revert of a
  // created file, block-revert to empty) are not pushed.
  //
  // PER LINEAGE ROOT, not per session and not global: an entry's id is globally unique (it is the path),
  // and a single LIFO queue across every session meant session B's Ctrl+Z could pop session A's keep and
  // report success — an action the reader never took, on a file they may not even be looking at.
  //
  // The key is the requester's CANONICAL session — its lineage root, `canonicalOf` — because the seats of
  // one lineage read ONE list: a row a teammate recorded is the lead's row, and the human who supervises
  // the root is the one who presses Ctrl+Z. So the ACCEPTED consequence, and the point of the change
  // rather than an accident of it: a teammate's Ctrl+Z can take back the root's last action, and the
  // root's can take back a teammate's — one history per lineage, taken back from wherever it is read.
  //
  // The POLICY a restore writes under is canonicalized in the opposite direction: the pair RECORDS the
  // session the action ran under (`policySession`) and the restore replays exactly that — never the seat
  // that popped the pair, and never the entry's owner re-derived at restore time. That is what makes a
  // cross-seat Ctrl+Z safe: the popper's wider (or narrower) grant cannot leak into a write the presser
  // made, and a lineage whose seats do NOT share a workspace still writes each file under the seat that
  // actually acted on it.
  const undoStacks = new Map<SessionId, DiffApprovalUndoPair[]>()
  const redoStacks = new Map<SessionId, DiffApprovalUndoPair[]>()
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1998-2021](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/index.ts#L1998-L2021)

预检读比较与权限检查。

<details>
<summary>查看原文（24行）</summary>

```text
    policySession: SessionId,
    signal: AbortSignal,
  ): Promise<{ path: string; error: unknown } | undefined> {
    const policy = sandboxPolicyOf(policySession)
    for (const write of writes) {
      let resolved: FsTarget
      try {
        // `resolve` only: it is the path half of the write's own prologue, and a failure here is a refusal
        // for the whole restore rather than a mid-way surprise.
        resolved = await ctx.fs.resolve(write.path, { signal })
      } catch (error: unknown) {
        return { path: write.path, error }
      }
      if (policy !== undefined && !withinSandboxRoot(processPathOf(resolved), policy)) {
        return { path: write.path, error: new Error(sandboxDenial(processPathOf(resolved), policy)) }
      }
      if (write.expected !== undefined) {
        const current = await ctx.fs.readText(resolved, undefined)
        if (current !== write.expected) {
          return { path: write.path, error: new Error('the file changed outside the review after the action; undo is unavailable') }
        }
      }
    }
    return undefined
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2336-2376](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/index.ts#L2336-L2376)

恢复读比较后另写、批次逐项递归。

<details>
<summary>查看原文（41行）</summary>

```text
  async function restoreState(
    sessionId: SessionId,
    state: DiffApprovalUndoState,
    expectedFile: DiffApprovalUndoState | undefined,
    signal: AbortSignal,
    scope: CommentScope,
    progress?: RestoreProgress,
  ): Promise<void> {
    // A comment pair carries no file and no entry, so it takes the one branch that has neither.
    // Dispatching on the pair's own kind is what keeps ONE stack honest: the top of it decides what
    // the pop means, and everything below this line is about files.
    if (state.kind === 'comments') {
      restoreComments(state, expectedFile, scope)
      return
    }
    if (state.fileText !== undefined) {
      const resolved = await ctx.fs.resolve(state.path, { signal })
      if (expectedFile?.fileText !== undefined) {
        const current = await ctx.fs.readText(resolved, undefined)
        if (current !== expectedFile.fileText) {
          throw new Error('the file changed outside the review after the action; undo is unavailable')
        }
      }
      // The snapshot is the exact bytes the action wrote (line-endings already
      // adjusted), so restore writes it verbatim — reproducing the action
      // regardless of the current line-ending-sensitivity setting.
      if (progress !== undefined) progress.path = state.path
      await writeRevert(resolved, state.fileText, sessionId, signal)
      if (progress !== undefined) progress.written += 1
    }
    if (state.batch !== undefined) {
      // A batch is ONE decision over several entries — one VCS import, or one keep/revert asked of a
      // pick of files — so restoring it is restoring each item in turn. An item that carries `fileText`
      // writes its file exactly as a lone state does: the session-wide 全部回退 has always put the bytes
      // each file held into its undo states, and this branch used to ignore them, so undoing it brought
      // the rows back while the files stayed reverted on disk. The counterpart item is the same index on
      // the other side, so a single restore's divergence guard applies here too.
      const counterpart = expectedFile?.batch
      for (const [index, item] of state.batch.entries()) {
        await restoreState(sessionId, { ...item, batch: undefined }, counterpart?.[index], signal, scope, progress)
      }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:2035-2043](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/index.ts#L2035-L2043)

失败明确已写进度，不应称无副作用。

```text
  function restoreFailure(action: 'undo' | 'redo', path: string, error: unknown, progress: RestoreProgress): RpcResult<unknown> {
    if (isPolicyRefusal(error)) {
      const far = progress.written === 0
        ? ''
        : ` The ${action} had already written ${progress.written} of ${progress.total} files before that.`
      return rpcError(refusalText(path, error) + far)
    }
    const far = progress.written === 0 ? '' : ` after writing ${progress.written} of ${progress.total} files`
    return rpcError(`${action} failed${far}: ${errorMessage(error)}`)
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 持久化、构建及VCS需要哪些条件？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

正式包声明出口lib/index.js和lib/client.js，当前固定树以src为主、未见这两个构建产物，package配置prepare和build执行TypeScript及tsdown。它是原生DSH bundle类型，但不能把未构建源码目录说成已验证可加载制品。Web客户端依赖宿主连接、语言、设置和侧栏服务，文件变更依赖ctx.fs；VCS导入另需对应CLI及shell执行器，Git比较HEAD，不能把Git暂存等同于该面板Keep。

待审状态实际由一个全局pending.json保存，旧按workspace布局可迁入；README的按workspace保存描述与当前实现不完全一致，应以源码为准。JSON采用同目录临时文件加rename，短暂EPERM/EACCES/EBUSY会重试，缓解Windows打开句柄导致的写失败。内存状态和磁盘仍需区分，flushPersist失败只记录错误，persistSession不reject；动作等待Promise并不能单独证明落盘成功。评论是独立文件，单文件原子替换不构成多状态事务。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-81](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/package.json#L14-L81)

包出口、bundle、客户端依赖与构建步骤。

<details>
<summary>查看原文（68行）</summary>

```text
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
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "lib/types/**/*.d.ts",
    "assets/fonts/*.woff2",
    "assets/fonts/manifest.json",
    "assets/fonts/OFL.txt",
    "assets/fonts/FONTLOG.md",
    "assets/fonts/README.md",
    "cordis.patch.yml",
    "docs/images/**"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "typecheck": "tsc -b tsconfig.json",
    "build": "tsc -b tsconfig.json && tsdown --env.DSH_BUILD_FACE client",
    "test": "vitest run",
    "e2e": "playwright test",
    "compat": "node scripts/dsh-compat.mjs",
    "compat:newer": "node scripts/dsh-compat.mjs --newer",
    "verify:release": "node scripts/verify-release.mjs",
    "screenshots": "node scripts/screenshots.mjs",
    "fonts:check": "python -m scripts.fonts.build --check",
    "fonts:plan": "python -m scripts.fonts.build --plan",
    "prepare": "tsc -b tsconfig.json && tsdown --env.DSH_BUILD_FACE client",
    "release": "release-it && node scripts/verify-release.mjs"
  },
  "license": "MIT",
  "dependencies": {
    "@deepseek-ai/dsh-home-paths": "^0.1.0-rc.5",
    "@shikijs/langs": "^4.4.3",
    "diff": "^9.0.0",
    "dompurify": "^3.4.15",
    "marked": "^18.0.11",
    "shiki": "^4.4.3"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.1",
```

</details>

**依据 2 · 源码核查**：[src/vcs.ts:1-22](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/vcs.ts#L1-L22)

VCS导入范围、HEAD基线与shell依赖。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * Version-control integration, host half: detect which VCS (git/svn/p4)
 * encloses a workspace by walking up the directory tree, and enumerate the
 * workspace's LOCAL changes for import into the pending list. The workspace
 * is often a subdirectory of the VCS root, so the root is found by walking up
 * from the workspace path and the imported changes are filtered to files
 * inside the workspace. Commands run through the deployment's `ctx.shell`
 * executor (applying its sandbox/policy) with the VCS root as the working
 * directory.
 *
 * Scope of one import (mirrors the panel's preferences):
 * - modified files, imported as `edit` (old = baseline, new = working). The GIT baseline is the
 *   last commit, not the index: this list answers "what is not committed yet", so a change the
 *   reader already `git add`ed is as much a review item as one they have not — staging is a step
 *   towards a commit, not a decision this panel records (`git diff HEAD` semantics). svn compares
 *   against BASE and p4 against `#have`, which are their "last commit" already;
 * - deleted files, imported as `edit` with an empty new side (revert restores);
 * - new/untracked files, imported as `create` ONLY when the untracked preference is on: git `??`
 *   (never added), svn unversioned, p4 not-yet-opened. For p4 that means a full workspace scan
 *   (`p4 status`, which can be slow); with the preference off only already-opened files are read.
 *   A file that is new but already under version control (git `A`, svn `added`) needs no
 *   preference: it is an uncommitted change like any other.
```

</details>

**依据 3 · 源码核查**：[src/persist.ts:141-194](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/persist.ts#L141-L194)

单个全局pending文件与同实例写序列。

<details>
<summary>查看原文（54行）</summary>

```text
 * File-backed pending entries, one global file keyed by path.
 */
export class PendingPersistence {
  private readonly tails = new Map<string, Promise<unknown>>()
  private readonly globalFile: string

  /**
   * @param root - directory holding the global `pending.json` (and, pre-migration,
   * one JSON file per workspace).
   */
  constructor(private readonly root: string) {
    this.globalFile = join(root, 'pending.json')
  }

  /**
   * Load every persisted entry. Returns the global file's entries, or — when the
   * global file is absent — flattens the legacy per-workspace files so the
   * caller can fold them once and then save (which clears the legacy files).
   * @returns the entries plus whether they came from the legacy layout (awaiting
   * a save to finalize the migration).
   */
  async loadAll(): Promise<{ entries: PendingEntry[]; migratedLegacy: boolean }> {
    const global = await readJson(this.globalFile)
    if (global !== undefined) {
      const parsed = globalFileOf(this.globalFile, global)
      const entries: PendingEntry[] = []
      for (const row of parsed.entries) {
        const entry = pendingEntryOf(row)
        if (entry !== undefined) entries.push(entry)
      }
      return { entries: entries.sort((l, r) => l.updatedAt - r.updatedAt), migratedLegacy: false }
    }
    const legacy = await collectLegacy(this.root)
    if (legacy.length > 0) {
      return { entries: legacy.sort((l, r) => l.updatedAt - r.updatedAt), migratedLegacy: true }
    }
    return { entries: [], migratedLegacy: false }
  }

  /**
   * Replace the persisted entry set durably. Saves to the one file are
   * serialized; a previous save's failure does not block the next one. On a
   * legacy migration this also removes the per-workspace files.
   * @param entries - the complete entry list, possibly empty.
   * @returns resolution after the file is durable.
   */
  save(entries: readonly PendingEntry[]): Promise<void> {
    const task = async () => {
      await writeJsonAtomic(this.globalFile, { version: FILE_VERSION, entries })
      await removeLegacy(this.root)
    }
    const tail = this.tails.get(this.globalFile) ?? Promise.resolve()
    const run = tail.then(task, task)
    this.tails.set(this.globalFile, run.catch(() => {}))
```

</details>

**依据 4 · 源码核查**：[src/atomic-write.ts:50-104](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/atomic-write.ts#L50-L104)

重试策略与实际临时文件rename。

<details>
<summary>查看原文（55行）</summary>

```text
}

/**
 * The default policy: five attempts, 25ms then 50, 100, 200 — a little over a third of a second in all.
 *
 * Long enough for the handle that refused the rename to be closed (a reader gets its next turn of the
 * loop, an antivirus finishes its scan), and short enough that a caller who is waiting on the write
 * — the panel's keep, a comment being added — cannot tell it retried at all.
 */
export const ATOMIC_WRITE_RETRY: AtomicWriteRetry = { attempts: 5, delayMs: 25 }

/**
 * Whether one rename error is the transient "somebody else has this file open" refusal.
 *
 * Windows answers `EPERM` for a replace whose target is open; `EACCES` and `EBUSY` are the same
 * situation seen through a network share or a mapped drive. Nothing else is retried.
 *
 * @param error - whatever the rename threw.
 * @returns whether another attempt is worth making.
 */
export function isHeldOpen(error: unknown): boolean {
  const code = (error as NodeJS.ErrnoException | null | undefined)?.code
  return code === 'EPERM' || code === 'EACCES' || code === 'EBUSY'
}

/**
 * Write one JSON envelope atomically, retrying a rename that a held handle refused.
 *
 * @param file - the file to replace.
 * @param value - the value to serialise into it.
 * @param options - the fs verbs and the retry policy, for tests.
 * @throws the rename's own error when the attempts run out, or at once when it is not a held handle.
 */
export async function writeJsonAtomic(
  file: string,
  value: unknown,
  options: { fs?: Partial<AtomicWriteFs> | undefined; retry?: AtomicWriteRetry | undefined } = {},
): Promise<void> {
  const io: AtomicWriteFs = {
    mkdir,
    writeFile,
    rename,
    remove: staged => rm(staged, { force: true }),
    ...options.fs,
  }
  const retry = options.retry ?? ATOMIC_WRITE_RETRY
  await io.mkdir(dirname(file), { recursive: true })
  const staged = `${file}.${process.pid}.${Date.now()}.tmp`
  await io.writeFile(staged, JSON.stringify(value), 'utf8')
  for (let attempt = 1; ; attempt++) {
    try {
      await io.rename(staged, file)
      return
    } catch (error: unknown) {
      if (attempt >= retry.attempts || !isHeldOpen(error)) {
```

</details>

**依据 5 · 源码核查**：[src/index.ts:2398-2467](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/index.ts#L2398-L2467)

持久失败仅日志，不reject动作链。

<details>
<summary>查看原文（70行）</summary>

```text
  /**
   * Mirror the whole (globally-unique) entry set to disk. A write fault logs a
   * warning and leaves the in-memory view intact: the review flow must not
   * break on a storage fault, and the next successful mutation rewrites the
   * file.
   * @returns resolution after the write settles (successful or logged).
   */
  // Persistence writes are throttled: coalesce to at most one durable write per
  // PERSIST_THROTTLE_MS. A write runs immediately when the store has been idle
  // longer than the window (write-through for a single change), so a lone
  // capture persists without delay; a burst of agent captures coalesces to one
  // write per window instead of one per event — the fix for the I/O/CPU storm.
  // User actions (keep/revert/undo/redo) pass `force` so their outcome is
  // durable immediately, not left in a throttled window.
  const PERSIST_THROTTLE_MS = 1000
  let persistDirty = false
  let persistScheduled = false
  let lastPersistAt = 0
  let persistTimer: ReturnType<typeof setTimeout> | undefined

  /** The last persist failure reported, so a writer that keeps failing says so once (cleared by a
   *  write that works, which is what makes a later, different failure report again). */
  let persistFailureReported: string | undefined

  /** Actually write the (dirty) store to disk; one coalesced write. */
  async function flushPersist(): Promise<void> {
    if (!persistDirty) return
    persistDirty = false
    lastPersistAt = Date.now()
    try {
      await ensureLoaded()
      await persistence.save(store.all())
      persistFailureReported = undefined
    } catch (error: unknown) {
      const message = errorMessage(error)
      // Not a detail to file away. This file is what makes the list survive a restart, and a filesystem
      // that refuses the write — no permission, no space, a directory this host cannot create (issue #6:
      // a hand-rolled split of the path answered `.` for a Windows path, so the write threw ENOENT; the
      // atomic write's `dirname(file)` is what fixed it) — leaves the reader with a list that silently
      // disappears, which is the one failure nobody can diagnose from the outside. At
      // error level, once per distinct message, so a writer retrying every second cannot bury it.
      if (persistFailureReported !== message) {
        persistFailureReported = message
        ctx.logger.error(`diff-approval: persisting pending changes failed, so the list will not survive a restart: ${message}`)
      }
    }
  }

  /** Mark the store dirty and schedule one throttled, coalesced write. Pass
   * `force` to write immediately (user actions need durable, immediate results). */
  /**
   * Mark the list dirty and start its write. The throttle is for the panel's own churn; `force` writes
   * NOW and, since 2026-10-06, RETURNS the write's promise.
   *
   * That return value is a durability guarantee, not a convenience: a caller that is about to write
   * something NAMING an entry — the annotate tool's comment — has to know the entry is readable at the
   * next boot first. Folded in memory and written on a later flush, an entry can be lost to a host that
   * stops in between, and the load-time sweep then hides (and used to delete) the comments that named
   * it. Awaiting here is what makes "the comment exists" imply "its entry was on disk first".
   *
   * @param force - write immediately rather than on the throttle's schedule.
   * @returns a promise that settles when the write this call started has finished (never rejects: a
   * failure is logged and reported through `persistFailureReported`, because a store that cannot write
   * must keep answering reads).
   */
  function persistSession(force = false): Promise<void> {
    persistDirty = true
    if (force) {
      if (persistScheduled) { clearTimeout(persistTimer); persistScheduled = false }
      return flushPersist()
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么任务值得试用，如何计量负担并验证新方向？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合有版本控制和备份、能在单写者工作树中逐项核对盘面的用户小范围试用。先提交或备份起点，用少量文件确认捕获、保留、回退和重载，并在每个决定后查看实际文件与测试；不要同时让别的Agent或编辑器写同一路径。出现面板与盘面分歧、持久错误或部分恢复时，停止继续回退，保存现场并用VCS和备份手工核对，不能把Undo作为唯一退路。

总成本按一次正确审阅决定计量，包含看差异、语义检查、测试、保存全文状态、错误修复和被恢复的评论核对。源码没有提供同任务节时、误覆盖率或单位资源测量。未验证方向是在用户看到的版本摘要与后端实际文件原子比较后才发布回退，同时提供持久成功、待写和部分完成回执。现有Undo读比较与部分计数已提供一部分材料，增量必须是消除比较后再写窗口。副本中并发改同文件、在批次中途拒写，比较误覆盖、正确保留和全部恢复时间；收益不改善或后端适配成本太高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2057-2069](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/index.ts#L2057-L2069)

普通回退的基线写入使单写者试用条件必要。

<details>
<summary>查看原文（13行）</summary>

```text
  async function revertEntryContent(entry: PendingEntry, sessionId: SessionId, signal: AbortSignal): Promise<{ before: DiffApprovalUndoState; after: DiffApprovalUndoState } | undefined> {
    const resolved = await ctx.fs.resolve(entry.path, { signal })
    if (entry.earlierVersion === 'none') {
      await removeRevert(resolved, sessionId, signal)
      return undefined
    }
    const preWrite = await ctx.fs.readText(resolved, undefined) ?? entry.newText
    const content = reencodeEol(entry.oldText, detectEol(entry.newText))
    await writeRevert(resolved, content, sessionId, signal)
    return {
      before: { id: entry.id, path: entry.path, entry, fileText: preWrite },
      after: { id: entry.id, path: entry.path, entry: undefined, fileText: content },
    }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:2336-2376](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/index.ts#L2336-L2376)

新方向针对真实读写窗口与批次恢复。

<details>
<summary>查看原文（41行）</summary>

```text
  async function restoreState(
    sessionId: SessionId,
    state: DiffApprovalUndoState,
    expectedFile: DiffApprovalUndoState | undefined,
    signal: AbortSignal,
    scope: CommentScope,
    progress?: RestoreProgress,
  ): Promise<void> {
    // A comment pair carries no file and no entry, so it takes the one branch that has neither.
    // Dispatching on the pair's own kind is what keeps ONE stack honest: the top of it decides what
    // the pop means, and everything below this line is about files.
    if (state.kind === 'comments') {
      restoreComments(state, expectedFile, scope)
      return
    }
    if (state.fileText !== undefined) {
      const resolved = await ctx.fs.resolve(state.path, { signal })
      if (expectedFile?.fileText !== undefined) {
        const current = await ctx.fs.readText(resolved, undefined)
        if (current !== expectedFile.fileText) {
          throw new Error('the file changed outside the review after the action; undo is unavailable')
        }
      }
      // The snapshot is the exact bytes the action wrote (line-endings already
      // adjusted), so restore writes it verbatim — reproducing the action
      // regardless of the current line-ending-sensitivity setting.
      if (progress !== undefined) progress.path = state.path
      await writeRevert(resolved, state.fileText, sessionId, signal)
      if (progress !== undefined) progress.written += 1
    }
    if (state.batch !== undefined) {
      // A batch is ONE decision over several entries — one VCS import, or one keep/revert asked of a
      // pick of files — so restoring it is restoring each item in turn. An item that carries `fileText`
      // writes its file exactly as a lone state does: the session-wide 全部回退 has always put the bytes
      // each file held into its undo states, and this branch used to ignore them, so undoing it brought
      // the rows back while the files stayed reverted on disk. The counterpart item is the same index on
      // the other side, so a single restore's divergence guard applies here too.
      const counterpart = expectedFile?.batch
      for (const [index, item] of state.batch.entries()) {
        await restoreState(sessionId, { ...item, batch: undefined }, counterpart?.[index], signal, scope, progress)
      }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2398-2443](https://github.com/9087/dsh-diff-approval/blob/6f7e6745f475d87da6a95782de15f737e6b12759/src/index.ts#L2398-L2443)

持久状态回执需区别日志失败。

<details>
<summary>查看原文（46行）</summary>

```text
  /**
   * Mirror the whole (globally-unique) entry set to disk. A write fault logs a
   * warning and leaves the in-memory view intact: the review flow must not
   * break on a storage fault, and the next successful mutation rewrites the
   * file.
   * @returns resolution after the write settles (successful or logged).
   */
  // Persistence writes are throttled: coalesce to at most one durable write per
  // PERSIST_THROTTLE_MS. A write runs immediately when the store has been idle
  // longer than the window (write-through for a single change), so a lone
  // capture persists without delay; a burst of agent captures coalesces to one
  // write per window instead of one per event — the fix for the I/O/CPU storm.
  // User actions (keep/revert/undo/redo) pass `force` so their outcome is
  // durable immediately, not left in a throttled window.
  const PERSIST_THROTTLE_MS = 1000
  let persistDirty = false
  let persistScheduled = false
  let lastPersistAt = 0
  let persistTimer: ReturnType<typeof setTimeout> | undefined

  /** The last persist failure reported, so a writer that keeps failing says so once (cleared by a
   *  write that works, which is what makes a later, different failure report again). */
  let persistFailureReported: string | undefined

  /** Actually write the (dirty) store to disk; one coalesced write. */
  async function flushPersist(): Promise<void> {
    if (!persistDirty) return
    persistDirty = false
    lastPersistAt = Date.now()
    try {
      await ensureLoaded()
      await persistence.save(store.all())
      persistFailureReported = undefined
    } catch (error: unknown) {
      const message = errorMessage(error)
      // Not a detail to file away. This file is what makes the list survive a restart, and a filesystem
      // that refuses the write — no permission, no space, a directory this host cannot create (issue #6:
      // a hand-rolled split of the path answered `.` for a Windows path, so the write threw ENOENT; the
      // atomic write's `dirname(file)` is what fixed it) — leaves the reader with a list that silently
      // disappears, which is the one failure nobody can diagnose from the outside. At
      // error level, once per distinct message, so a writer retrying every second cannot bury it.
      if (persistFailureReported !== message) {
        persistFailureReported = message
        ctx.logger.error(`diff-approval: persisting pending changes failed, so the list will not survive a restart: ${message}`)
      }
    }
```

</details>

#### 缺口

- 缺少同一审阅任务的外部diff流程对照和失败测量。
  **影响**：不能声称减少错误或端到端审阅时间。
  **进一步探讨**：在固定文件改动和验收规则下比较任务合格率、人工时间、误覆盖及恢复全部成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
