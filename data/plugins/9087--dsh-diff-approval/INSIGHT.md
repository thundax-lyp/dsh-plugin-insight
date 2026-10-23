# dsh-diff-approval

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c6edcac](https://github.com/9087/dsh-diff-approval/tree/c6edcac3d89968e1213ce61ce2c52435aefefd05)

<!-- BEGIN META -->
[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval) [![npm 30d 4,906](https://img.shields.io/static/v1?label=npm+30d&message=4%2C906&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-diff-approval)
<!-- END META -->

> **实现功能**：捕获DSH成功文件编辑并集中展示差异，支持Keep/Revert、评论、撤销及VCS变更导入。

> **核心亮点**：把工具捕获、差异/评论与文件决策连成连续审阅，lineage视图与请求方策略分离可借鉴；算法依成熟库。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：普通回退不做写时版本比较、创建删除不可undo，持久失败不拒动作成功；外改检测/undo预检不能当无损保证。参见[Q03](#research-q03)。

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
  - [Q01 · 集中审阅增加什么，是否构成写前审批？](#detail-section-11)
  - [Q02 · 状态怎样聚合、持久与按会话展示？](#detail-section-12)
  - [Q03 · 回退与撤销能否保证外部修改不丢、所有动作可撤销？](#detail-section-13)
  - [Q04 · 成本、受控试用与新的恢复假设是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：编码用户在宿主中事后审阅已发生的修改，验收决定与实际文件一致，不当写前审批。

IDE/Git差异加手工恢复是参照；插件省宿主交接，但不覆盖所有shell写或替代版本控制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自动捕获 | 事后集中审阅 | 仅支持工具成功结果，非写前 |
| Keep/Revert | 文件/块决策 | 普通回退无写时CAS，删除不可undo |
| Undo/Redo | 恢复已记录动作 | 内存lineage历史，批量可部分 |
| 持久 | 重启保pending | 全局JSON，失败日志非动作拒绝 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 宿主fs/connection/workspace/session等 | 启动必需 | 捕获/RPC/策略 | 停用，外部审阅工具 |
| 客户端模块/React | 界面必需 | 差异/评论展示 | 无审阅面板 |
| Git/SVN/Perforce CLI | 导入可选 | 读取本地变化 | 仅自动捕获或手工比较 |
| 备份/可写存储 | 恢复必需 | 真实回退/重启保存 | 停止破坏动作，先核日志 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份并固定宿主启用 | 工具变化捕获正确 |
| 2 | 用户事后审差异/评论 | 接受或回退前核当前文件 |
| 3 | 用户验证回退/undo/持久 | 实际字节一致；删除/故障走备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 客户端/字体/依赖与备份 | 核宿主、理解回退和留存 | 金额/时间未知 |
| 持续使用 | old/new快照、JSON/diff与外改检查 | 逐文件/块审阅，AI评论另计费 | 全局快照隐私和规模未测 |
| 失败恢复 | 备份/重写/部分恢复 | 查已写和持久日志、冲突修复 | 非事务，创建删除不可undo |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 审阅接线 | 捕获/块/评论/决策 | 漏审与人工时间下降 |
| 归属 | lineage/workspace视图和请求策略 | 未知workspace/多源符合预期 |
| 恢复 | undo预检、部分计数、重试保存 | 无损回退/断电/多进程耐久 |

> **思考**：普通回退不做写时版本比较、创建删除不可undo，持久失败不拒动作成功；外改检测/undo预检不能当无损保证。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把工具捕获、差异/评论与文件决策连成连续审阅，lineage视图与请求方策略分离可借鉴；算法依成熟库。参见[Q01](#research-q01)、[Q02](#research-q02)。

把工具捕获、差异/评论与文件决策连成连续审阅，lineage视图与请求方策略分离可借鉴；算法依成熟库。参见[Q01](#research-q01)、[Q02](#research-q02)。

Pending状态与I/O分离、内容缓存、策略归属和rename退避值得复用；全局按路径快照不能误当按workspace隔离，写时内容版本和耐久需补契约。

<a id="detail-section-5"></a>

### 1.4 主要限制

普通回退不做写时版本比较、创建删除不可undo，持久失败不拒动作成功；外改检测/undo预检不能当无损保证。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

单人可备份工作树试用；普通回退先冻结其他写入，删除先确认，保留Git/备份和持久日志核查。参见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

捕获/展示/恢复接线有源码支持；普通回退竞争、不可undo删除与持久弱确认限制无损承诺；动作收据未验证。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/pending.ts、src/persist.ts、src/atomic-write.ts、src/client/markdown-preview.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核捕获、pending/lineage、持久、普通回退/删除与undo、预览净化；未全面审计VCS解析/所有UI和AI评论，不运行目标。
- 下一步：未运行目标。隔离外改竞争、创建删除、磁盘满和批量中断，核文件字节、已写计数及重启状态。

**分析版本**

- **仓库**：[9087/dsh-diff-approval](https://github.com/9087/dsh-diff-approval)
- **版本号**：0.36.1（[固定提交 c6edcac](https://github.com/9087/dsh-diff-approval/tree/c6edcac3d89968e1213ce61ce2c52435aefefd05)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为expected hash动作收据、删除恢复包及显式持久结果，批量按已写状态恢复；故障对照检查丢改/误报。参见[Q04](#research-q04)。

未运行目标。隔离外改竞争、创建删除、磁盘满和批量中断，核文件字节、已写计数及重启状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1280 | — | — | 14559 |
| .ts | test | 61 | 18637 | 13540 | 3301 | — |
| .ts | source | 52 | 22114 | 11688 | 9376 | — |
| .mjs | source | 4 | 1304 | 802 | 421 | — |
| .tsx | source | 10 | 15565 | 9830 | 5474 | — |
| .tsx | test | 6 | 18633 | 13160 | 3923 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/9087/dsh-diff-approval/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：集中差异审阅的贡献、归属与回退恢复的一致性边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 集中审阅增加什么，是否构成写前审批？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH编码用户可集中查看成功edit/write/editor产生的差异，逐文件/块Keep/Revert，评论与复制行引用，也可导入Git/SVN/Perforce本地变更。合格交付是看清哪些变化已发生、哪些被接受/恢复，以及实际文件与决定一致。相对切到IDE/Git工具，增量是把工具捕获、宿主差异展示、评论和恢复动作连起来。

捕获发生tools/result且需成功结果，文件在审阅前已修改；Keep是接受已有变化，不是事前批准。名称approval不能推为写前防护，也不能捕获所有shell写。算法使用diff/marked/DOMPurify/Shiki等既有库，贡献集中接线、状态和交互，不是新diff算法。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:11-16](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/README.md#L11-L16)

作者集中差异定位。

```text
A DeepSeek Harness (DSH) plugin for pending-change review: it automatically tracks every successful `edit`, `write`, and editor (`str_replace_editor`) mutation, folds them into a single pending list in the sidebar where each file's diff can be reviewed and kept/reverted — and it can also import the workspace's version-control repository's local changes (Git / SVN / Perforce) in one click.

![Pending changes panel](docs/images/pending-panel.png)

The panel also collapses its file list into a floating card; while floating, each of its four edges — the left sidebar, the header above, the right sidebar, the composer below — can be chosen to be covered (all four is what used to be fullscreen, and covering nothing is a plain floating card), and it can dock as a tab in the right sidebar:

```

**依据 2 · 源码核查**：[src/index.ts:2484-2496](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/index.ts#L2484-L2496)

成功结果后捕获。

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

**依据 3 · 源码核查**：[package.json:71-80](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/package.json#L71-L80)

依赖来源。

<details>
<summary>查看原文（10行）</summary>

```text
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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态怎样聚合、持久与按会话展示？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

PendingStore按绝对路径全局唯一，后续同路径fold保最早基线、最新内容并累计sessionIds。正式持久为一个pending.json v3，源码明确不同于README“每workspace一个JSON”的说明。list/action用lineage root相等且同workspace过滤；未知workspace维持旧允许答案，不能当多租户强隔离。

undo/redo在内存按lineage root共享，实际写入记录发起动作座位的policySession，避免借另一会话宽权限。持久采用同实例串行写，捕获1秒节流、用户动作force；tmp+rename对EPERM/EACCES/EBUSY有限退避。状态/I/O分层和内容版本缓存值得借鉴，但全文件快照、单全局JSON与跨进程写无锁有规模/留存负担，rename不等fsync耐久。

#### 证据与依据

**依据 1 · 源码核查**：[src/pending.ts:103-128](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/pending.ts#L103-L128)

路径fold与sessionIds聚合。

<details>
<summary>查看原文（26行）</summary>

```text
   * Combine a stored entry and a new capture. `oldText` comes from the earlier capture (the file's
   * original basis) — except where that capture was the file's creation and this one edits it, when
   * the creation's own content becomes the basis — and `newText` from the later (latest content).
   * The session set is the union, so the entry always spans the whole pending change regardless of
   * which session contributed which part.
   */
  private mergeEntry(a: PendingEntry, b: PendingEntry): PendingEntry {
    const earlier = a.updatedAt <= b.updatedAt ? a : b
    const later = earlier === a ? b : a
    const sessionIds = [...new Set([...touchedBy(a), b.sessionId])]
    // A creation is the whole change only while creations are all there is: the entry is anchored at a
    // path that did not exist, and `earlierVersion: 'none'` is what makes a revert remove the file. As
    // soon as a later capture EDITS that file, the reader is reviewing rounds of work on a file that
    // exists, so the basis becomes the content it was created with and `回退` writes that back, keeping the
    // file. Freezing the field at 'none' (the rule from 2026-08-31 until now) left a file that had been
    // rewritten many times still tagged 新增 and still offering 删除.
    const onlyCreations = earlier.earlierVersion === 'none' && later.earlierVersion === 'none'
    return {
      ...later,
      // The global identity is the path; `id` must always equal it.
      id: later.path,
      // With no old side of the file's own to keep, the creation's content is the basis: `earlier.newText`
      // is the file as it stood right after it was created.
      oldText: onlyCreations ? '' : earlier.earlierVersion === 'none' ? earlier.newText : earlier.oldText,
      earlierVersion: onlyCreations ? 'none' : 'file',
      sessionIds,
```

</details>

**依据 2 · 源码核查**：[src/persist.ts:1-15](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/persist.ts#L1-L15)

实际全局pending与旧布局迁移。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Durable pending-entry persistence under the harness home: one global JSON
 * file holding one entry per file path (across all sessions and workspaces), at
 * `<storageDir>/pending.json`; the default root is `<dshHome>/diff-approval/workspaces`
 * and the plugin's `storageDir` config relocates it. Saves rewrite the whole
 * file (the entry set is small), staged as a sibling temp file and atomically
 * renamed, so a crash leaves either the old or the new file. A missing file
 * reads as empty; corrupt content and unknown versions throw.
 *
 * Legacy layout: the pre-global schema stored one JSON file per workspace
 * (`<storageDir>/<workspaceId>.json`, `{ version: 2, sessions: { [sessionId]:
 * PendingEntry[] } }`). On first load without a global file, `loadAll` scans for
 * those files, flattens every session's entries, and reports them so the caller
 * can fold them into the global store once; `save` then writes the global file
 * and deletes the legacy files.
```

</details>

**依据 3 · 源码核查**：[src/persist.ts:180-195](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/persist.ts#L180-L195)

实例内串行。

<details>
<summary>查看原文（16行）</summary>

```text
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
    return run
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1559-1594](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/index.ts#L1559-L1594)

可见性和未知workspace语义。

<details>
<summary>查看原文（36行）</summary>

```text
   * The rule is ROOT-EQUAL **AND SAME-WORKSPACE**: an entry is visible when any session that touched it
   * walks to the same lineage root as the requester AND can be shown to sit in the requester's workspace.
   * Walking is `knownLineageOf` links only, so a teammate's rows appear in the lead's list (both walk to
   * the lead) and the lead's appear in the teammate's — while a host fork, which names a parent but is not
   * a subagent child, stays an independent root and shares nothing.
   *
   * The workspace half is not redundant with the lineage half, because NOTHING ELSE IN THE LIST PATH
   * SCOPES BY WORKSPACE: the store is one map keyed by absolute path persisted to one `pending.json` under
   * the storage root (`pending.ts`, `persist.ts` — the `workspaces/` component of the default path is the
   * legacy per-workspace layout, folded in and deleted on load). So without this a row recorded by a
   * session in ANOTHER workspace would be listed here whenever the two share a lineage root — which is a
   * real shape: this view merges every subagent child (see the KNOWN LIMIT below), and the harness's
   * out-of-process shape lets a child run under a configured `cwd` of its own, its cwd being documented as
   * the child's "workspace identity" (`dsh-subagent/lib/types/out-of-process.js`:
   * `resolveChildCwd`/`assertUsableCwd`). An in-process child copies its parent's cwd verbatim
   * (`…/child-agent.js:childSessionMeta`), so the two agree there; this rule is what makes the plugin's
   * answer independent of which of those two shapes it is handed.
   *
   * A session the registry does not account is NOT refused: `sameWorkspace` answers true when either
   * side's workspace is unknown, so an unaccounted or memory-only session keeps exactly the view it had
   * before this term existed. UNKNOWN DEGRADES TO SELF on the lineage half and TO THE OLD ANSWER here —
   * never to a guess, and never to a refusal the reader cannot see the reason for.
   *
   * UNKNOWN DEGRADES TO SELF, never to a guess: with no recorded lineage and no header facts every
   * session is its own root, so only the requester matches — byte-for-byte today's behaviour. A cycle
   * (which no shell should produce) stops at the first repeat, and the walk is bounded by
   * {@link MAX_LINEAGE_DEPTH}.
   *
   * TWO THINGS A MERGED VIEW DOES NOT MERGE, so the next reader does not expect them:
   * comments stay per-session (`comments` is read with the requester's id, so a merged list shows the
   * requester's threads only), and undo stacks stay per-lineage — every ACTION records its pair under the
   * canonical session of the seat that PRESSED it, so the seats of one lineage share one history and a
   * different lineage cannot reach into it (`undoStackOf`/`popOwnPair` are keyed by that root). The
   * session-scoped thing a merged press does NOT take from the ROW is the write policy: an action's file
   * write runs under the REQUESTING session's own workspace and sandbox (see
   * `DiffApprovalUndoPair.policySession`), never the owner's.
```

</details>

**依据 5 · 源码核查**：[src/index.ts:2072-2094](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/index.ts#L2072-L2094)

lineage内存undo/写策略。

<details>
<summary>查看原文（23行）</summary>

```text
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

**依据 6 · 源码核查**：[src/atomic-write.ts:95-110](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/atomic-write.ts#L95-L110)

临时写和有限退避。

<details>
<summary>查看原文（16行）</summary>

```text
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
        // The staged bytes are this write's own and nothing else points at them: leaving them behind
        // would litter the state directory with files nothing reads (and `loadAll` skips `.tmp`).
        await io.remove(staged).catch(() => {})
        throw error
      }
      await new Promise(resolve => setTimeout(resolve, retry.delayMs * 2 ** (attempt - 1)))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回退与撤销能否保证外部修改不丢、所有动作可撤销？

**研究主题**：缺陷与关键质疑

#### 完整回答

普通文件revert读当前文本用于undo快照，然后直接写oldText，writeRevert未传expected内容；没有写时CAS。若面板显示后或读写之间有外部修改，普通revert仍可覆盖，而新建文件revert调用remove且不生成undo。README“every revert undoable”被这条删除路径明确收窄。外部监视和undo前内容检查不能追溯保护已发生普通回退。

undo/redo有预检和每文件当前内容等于对侧快照的比较，能拒已知漂移，仍存在检查到写之间的竞争；批量恢复顺序逐项进行，已写数量在失败中返回，不能当原子回滚。持久失败会记录error但persistSession永不reject，部分动作调用未await它，因此RPC成功不必然表示重启可恢复。静态发现不等已复现数据丢失，但会改变采用范围。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2057-2075](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/index.ts#L2057-L2075)

普通回退无内容比较、创建删除不可undo。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1813-1818](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/index.ts#L1813-L1818)

writeText未带expected。

```text
  async function writeRevert(target: FsTarget, content: string, sessionId: SessionId, signal: AbortSignal): Promise<unknown> {
    const policy = sandboxPolicyOf(sessionId)
    return policy === undefined
      ? ctx.fs.writeText(target, content, undefined, signal)
      : ctx.fs.writeText(target, content, undefined, signal, policy)
  }
```

**依据 3 · 源码核查**：[src/index.ts:2336-2375](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/index.ts#L2336-L2375)

undo内容检查和批量顺序写。

<details>
<summary>查看原文（40行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2035-2043](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/index.ts#L2035-L2043)

部分恢复计数。

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

**依据 5 · 源码核查**：[src/index.ts:2457-2467](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/index.ts#L2457-L2467)

持久promise永不reject。

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 6 · 源码核查**：[src/index.ts:2825-2836](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/index.ts#L2825-L2836)

force未await即返回。

<details>
<summary>查看原文（12行）</summary>

```text
        if ((payload as Record<string, unknown>).keepListed === true) {
          const content = undo?.after.fileText ?? ''
          store.update(target.id, { newText: content })
          const afterEntry: PendingEntry = { ...entry, newText: content, updatedAt: Date.now() }
          if (undo !== undefined) {
            pushUndo(target.sessionId,
              { id: entry.path, path: entry.path, entry, fileText: undo.before.fileText },
              { id: entry.path, path: entry.path, entry: afterEntry, fileText: content })
          }
          persistSession(true)
          const value: DiffApprovalActionValue = { outcome: 'reverted', resolved: true }
          return { ok: true, value }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本、受控试用与新的恢复假设是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

启动依赖fs/connection/webServer/workspaceRegistry/sessions/controller/agents及客户端模块与React，VCS导入还需相关CLI。普通人工审阅无强制模型调用，评论/AI协作另有模型费。首次要固定宿主/备份和理解Keep/Revert，持续为old/new全文件内存/JSON、diff渲染、外改检测及人工逐块核查，失败恢复要区分已写/未写与持久失败；金额、峰值与人时未知。Markdown预览用DOMPurify可减少直接HTML注入，但不是所有网络/文件面的安全验收。

建议单人可备份工作树试用事后审阅，创建文件删除不可undo先确认，回退前冻结其他写入并查实际文件，保留Git/备份。多来源同文件或敏感全局快照先观察。未验证假设是版本绑定动作收据和删除恢复包，所有revert/undo带expected hash，批量记录逐项已写并将持久结果回给UI。由普通回退和部分恢复/持久弱确认推导，可能减少覆盖/误以为持久，但增加存储和冲突交互。最小验证回退前/检查后外改、创建删除、写满磁盘和批量中断，对照丢改、可恢复与人工操作；若仍覆盖或UI误报耐久则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:102-102](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/index.ts#L102-L102)

Host必需服务。

```text
export const inject = ['fs', 'connection', 'webServer', 'workspaceRegistry', 'sessions', 'sessionController', 'agents']
```

**依据 2 · 源码核查**：[src/client/markdown-preview.ts:699-703](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/client/markdown-preview.ts#L699-L703)

预览净化。

```text
/** Render one top-level token's Markdown, sanitized, as detached elements. */
function renderToken(raw: string): HTMLElement[] {
  const holder = document.createElement('div')
  holder.innerHTML = DOMPurify.sanitize(marked.parse(raw, { async: false }) as string)
  return [...holder.children].filter((node): node is HTMLElement => node instanceof HTMLElement)
```

**依据 3 · 源码核查**：[src/index.ts:2057-2075](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/index.ts#L2057-L2075)

删除与普通回退边界导出假设。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2423-2442](https://github.com/9087/dsh-diff-approval/blob/c6edcac3d89968e1213ce61ce2c52435aefefd05/src/index.ts#L2423-L2442)

持久失败保内存/报告。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

#### 缺口

- 目标宿主沙箱、并发、制品与真实恢复未验
  **影响**：不能宣称无损回退/全部undo或重启耐久
  **进一步探讨**：隔离工作树做外改/删除/磁盘故障/批量中断对照，核字节与持久状态

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
