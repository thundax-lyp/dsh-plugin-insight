# dsh-diff-approval

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a661a7a](https://github.com/9087/dsh-diff-approval/tree/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e)

<!-- BEGIN META -->
[![GitHub ★ 15](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=15&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/9087/dsh-diff-approval) [![npm 30d 5,099](https://img.shields.io/static/v1?label=npm+30d&message=5%2C099&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-diff-approval) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-diff-approval)
<!-- END META -->

> **功能**：将工具改动汇入会话内待审面板，支持差异决定、批注及有条件撤销。

> **亮点**：把改动捕获、细粒度审阅与批注入口放到会话流程中，不承担写前授权或测试验收。见[Q01](#research-q01)。

> **主要限制**：普通回退无展示内容比较前提，Undo读后再写也非原子CAS；新建删除和重启不在普遍Undo保证内。见[Q03](#research-q03)。

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
  - [Q01 · 会话内差异审阅比Git diff增加什么？](#detail-section-11)
  - [Q02 · 捕获、路径合并与权限如何绑定？](#detail-section-12)
  - [Q03 · 回退和Undo足以保证恢复吗？](#detail-section-13)
  - [Q04 · 源码与发布安装边界、使用步骤是什么？](#detail-section-14)
  - [Q05 · 总投入、可借鉴点和试用条件是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：共同编辑代码时逐块审阅和讨论；合格决定必须与盘面及测试一致。见[Q01](#research-q01)。

Git diff/编辑器更直接；插件减少会话切换的潜力以更多路径、谱系和恢复状态为代价。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工具结果捕获 | 自动汇集待审 | 事后处理指定工具，不是权限审批 |
| 块/范围/整文件决定 | 会话内选择保留/回退 | 应核盘面；Keep非测试通过 |
| Undo/Redo | 有条件恢复决定 | 检查与写分开，删除/重启例外 |
| VCS导入 | 补充工具外改动 | Git/SVN/P4 CLI，范围和扫描成本另核 |
| 批注入口/工具 | 围绕改动讨论 | 仅核注册/持久字段，未完整审问答与UI |
| 待审持久化 | 跨重启保留清单 | 全局pending文件；persistError需检查 |

**流程与依赖**

host服务和Web面板必需；VCS导入有额外CLI条件，源码缺lib需区别构建与发布包。表见[Q04](#research-q04)。

先临时树捕获/创建后编辑，冻结外写再回退，检查持久错误与重开。步骤见[Q04](#research-q04)。

**效果与成本**

按一次正确审阅决定及其恢复全过程计量，全文存储与人工语义判断不可略。完整表见[Q05](#research-q05)。

会话内便利可有限试验，不替代VCS和测试；收益成立需同时减少切换且不增误覆盖。见[Q05](#research-q05)。

> **思考**：普通回退无展示内容比较前提，Undo读后再写也非原子CAS；新建删除和重启不在普遍Undo保证内。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把改动捕获、细粒度审阅与批注入口放到会话流程中，不承担写前授权或测试验收。见[Q01](#research-q01)。

创建基线演进、原操作权限记录和部分写入报告可借鉴；全局路径与谱系状态要分别理解。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

普通回退无展示内容比较前提，Undo读后再写也非原子CAS；新建删除和重启不在普遍Undo保证内。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

单人可备份树有限试用；发现分歧或持久错误先停动作保现场。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持捕获/合并/策略/条件恢复；文档每工作区存储与普遍Undo需收窄，实际正确率和净节时未测。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/pending.ts、src/persist.ts、src/vcs.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核README/package、host工具结果捕获、路径基线、pending布局/持久错误、普通回退、Undo/策略和部分失败、VCS条件；未完整审客户端渲染/批注问答、各VCS适配、路径别名与跨进程实现。
- 下一步：未执行目标；构建/宿主冒烟为范围边界，外写/权限/恢复效果仍保留研究缺口。

**分析版本**

- **仓库**：[9087/dsh-diff-approval](https://github.com/9087/dsh-diff-approval)
- **版本号**：0.36.1（[固定提交 a661a7a](https://github.com/9087/dsh-diff-approval/tree/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

展示摘要绑定后端原子比较发布，联合部分完成/持久回执，是否减少误覆盖和总恢复成本须对照。见[Q05](#research-q05)。

未执行目标；构建/宿主冒烟为范围边界，外写/权限/恢复效果仍保留研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1280 | — | — | 14559 |
| .ts | test | 69 | 22130 | 16410 | 3725 | — |
| .ts | source | 54 | 28647 | 16496 | 10872 | — |
| .mjs | source | 4 | 1304 | 802 | 421 | — |
| .tsx | source | 10 | 16006 | 10117 | 5617 | — |
| .tsx | test | 6 | 18955 | 13418 | 3973 | — |
| .md | example | 4 | 419 | — | — | 2439 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/9087/dsh-diff-approval/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：审阅决定是否准确绑定盘面、范围和权限，回退与Undo能否覆盖并发/删除/重启？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话内差异审阅比Git diff增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合与 Agent 共同编辑、需要逐块保留/回退并讨论修改的开发者。合格结果是面板所示与实际文件一致，决定只作用预期范围，回退后还能检查内容和任务测试。

Git diff 或编辑器差异审阅是直接基线。插件增加指定工具结果自动汇集、会话待审列表、块/选择范围决定和批注的同屏入口，可能减少切换；它没有创造比代码更可靠的验收标准。工具成功后才捕获，所以 approval 指事后审阅，不是写入前权限批准。Keep 只接受当前差异，不证明语义正确或测试通过。

作者描述丰富快捷操作与任意回退可撤销，但源码对新建文件删除和重启有明确例外。不能把面板功能数、README截图或兼容脚本当成生产审阅收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-36](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/README.md#L29-L36)

作者块/范围决定、快捷入口及every undo声明。

```text
- **Diff view**: syntax-highlighted whole-file diff with +/− counts, an overview ruler on the scrollbar showing where changes sit, and an in-file search (`Ctrl+F`, step with `F3` / `Shift+F3`) that highlights matched words. Rows are virtualized, so huge files stay smooth. The line-number column keeps a surface of its own — a shade lighter than the code block, so the numbers read as a column rather than as part of the code — and stays pinned while the code scrolls sideways.
- **Block navigation & decisions**: jump between change blocks with `Ctrl+↑/↓` (or the previous/next buttons) — the focused block flashes, navigation is anchored to the scroll position and wraps at the top/bottom. Hover a block to **Keep** or **Revert** just that block from a small actions frame that also shows its position (e.g. "2/5"); after a single-block decision, focus advances to the next block. The lead rows left above the jumped-to block are configurable in settings.
- **Selection frame**: drag to select a range of lines and a frame appears to **Keep** / **Revert** exactly that range.
- **Per-file and bulk decisions**: the files in the file list can be kept / reverted one at a time, or **Keep all** / **Revert all** from its footer.
- **Resolved files stay listed**: once every change in a file has been kept/reverted, the entry remains in the list and the panel asks whether to remove it or keep it there.
- **Undo / Redo**: every keep, revert, import, and comment is undoable with `Ctrl+Z` / `Ctrl+Shift+Z` (rebindable in Shortcuts; `Ctrl+Y` remains an alias), active while the panel is open — text inputs keep their own editing.
- **Quick summon & file cycling**: `Ctrl+D` (configurable in settings) toggles the review panel from anywhere and `Esc` closes it; the panel is also one click away from the sidebar-foot row and from a button in the Session header beside the app's own controls; `Ctrl+Tab` / `Ctrl+Shift+Tab` cycle through the pending files.
- **Line references**: select text in the diff — the status bar shows its `(file:line)` / `(file:start-end)` reference; click it (or press `Ctrl+L`) to copy, and with the setting on it auto-pastes into the composer and focuses it. References in the composer and queued messages are **auto-aligned** when the referenced file changes: surviving lines re-map to their new range, and a fully-removed line becomes `(file:LINE_MISSING)`.
```

**依据 2 · 源码核查**：[src/index.ts:2484-2496](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2484-L2496)

监听成功工具结果，文件已在工具阶段修改。

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

#### 缺口

- 缺与Git/编辑器同任务的审阅结果和总耗时比较。
  **影响**：不能断言减少遗漏、切换或恢复时间。
  **进一步探讨**：同一改动集盲测决定准确率、外写误覆盖和总人工耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 捕获、路径合并与权限如何绑定？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

tools/result 接 edit/write 的成功结果，前后相同或缺结果跳过；str_replace_editor 走单独的意图前后捕获。按文件路径合并条目，保留较早基线和较新内容并汇集会话归属；若创建后又编辑，基线提升为刚创建内容，之后回退不再总是删除整个文件。

待审存储以路径为全局身份，源码用一个 pending.json，旧每工作区文件只在兼容迁移中读入。README仍说每workspace一个文件，不能据此推物理隔离；同路径/同谱系可见性与工作区应分别核对。工具捕获不等于完整覆盖shell或外部编辑，已有列表外写可被采纳，新路径可由VCS导入补充。

普通回退用点击请求者的session和sandbox policy写回，不借最后修改者的较宽权限。Undo/Redo栈按lineage root共享，pair记录原操作的policySession，恢复仍沿原操作会话执行；不能简化成“所有Undo都用当前点击者policy”。这是同谱系恢复契约，需要在实际宿主核一致的权限和可见性，源码不等于任意sandbox实现已验收。

与旧固定源码逐字对照，本次 index 的实质差异是字符范围的跨行护栏：Keep/Revert 任一侧切片含换行时退回块的行范围，单行才走字符拼接。它缩小了跨行切片破坏基线的路径，但不是跨行字符级决定已精确支持；还需核行范围和盘面是否符合用户选择。未执行该修复的例子，不把注释中的旧故障当本轮复现。

持久化 save 在本实例按全局文件排队并原子写；捕获先同步折叠内存再异步调度持久化。强制保存失败被flush捕获记录，list返回persistError；日志和错误字段是可观测入口，不是永不丢待审状态的保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2484-2496](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2484-L2496)

捕获名称/成功检查与同步fold异步persist。

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

**依据 2 · 源码核查**：[src/pending.ts:109-128](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/pending.ts#L109-L128)

路径主键、创建后编辑的基线规则。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 3 · 源码核查**：[src/index.ts:3028-3036](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L3028-L3036)

Keep跨行字符切片回退行范围。

```text
        let updatedOld: string
        if (chars === undefined || !charSpansStayOnOneLine(entry.oldText, entry.newText, chars)) {
          const accepted = contentRangeOf(entry.newText, blockTarget.block.newStart, blockTarget.block.newEnd)
          updatedOld = replaceContentLines(entry.oldText, blockTarget.block.oldStart, blockTarget.block.oldEnd, accepted)
        } else {
          const accepted = entry.newText.slice(chars.new.start, chars.new.end)
          const spliced = spliceChars(entry.oldText, chars.old.start, chars.old.end, accepted)
          if (spliced === undefined) return rpcError('block character span does not fit the file')
          updatedOld = spliced
```

**依据 4 · 源码核查**：[src/index.ts:3072-3081](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L3072-L3081)

Revert使用同一跨行门禁。

<details>
<summary>查看原文（10行）</summary>

```text
        const revertChars = charSpansOf(blockTarget.block)
        let revertedText: string
        if (revertChars === undefined || !charSpansStayOnOneLine(entry.oldText, entry.newText, revertChars)) {
          const restored = contentRangeOf(entry.oldText, blockTarget.block.oldStart, blockTarget.block.oldEnd)
          revertedText = replaceContentLines(entry.newText, blockTarget.block.newStart, blockTarget.block.newEnd, restored)
        } else {
          const restored = entry.oldText.slice(revertChars.old.start, revertChars.old.end)
          const spliced = spliceChars(entry.newText, revertChars.new.start, revertChars.new.end, restored)
          if (spliced === undefined) return rpcError('block character span does not fit the file')
          revertedText = spliced
```

</details>

**依据 5 · 源码核查**：[src/index.ts:3800-3808](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L3800-L3808)

任一侧切片含换行即拒字符路径。

```text
function charSpansStayOnOneLine(
  oldText: string,
  newText: string,
  spans: { old: { start: number; end: number }; new: { start: number; end: number } },
): boolean {
  const oldSlice = oldText.slice(spans.old.start, spans.old.end)
  const newSlice = newText.slice(spans.new.start, spans.new.end)
  return !oldSlice.includes('\n') && !newSlice.includes('\n')
}
```

**依据 6 · 源码核查**：[src/persist.ts:140-169](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/persist.ts#L140-L169)

全局pending及旧布局兼容。

<details>
<summary>查看原文（30行）</summary>

```text
/**
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
```

</details>

**依据 7 · 作者声明**：[README.md:45-48](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/README.md#L45-L48)

作者外写/VCS与每workspace持久描述。

```text
- **External changes**: files already in the pending list are monitored — if one is later modified outside the reviewed edits (another tool, an editor), the panel adopts the new content and flags the divergence.
- **Open / Reveal**: while reviewing a file's diff, open it in its default app or reveal it in the system file manager with one click.
- **Import version-control changes**: when the list is empty, click the button to import the workspace's local changes from **Git / SVN / Perforce** — everything that is **not committed yet, staged or not** (Git is read against the last commit, the `git diff HEAD` view), plus deleted files and, opt-in, files the VCS has never seen (untracked / unversioned). The VCS root is found by walking up from the workspace, so a workspace inside a subdirectory works too.
- **Persistence**: pending state is stored per workspace at `<dshHome>/diff-approval/workspaces/<workspaceId>.json` and survives restarts — unhandled changes are still there when you come back, even in a fresh session.
```

**依据 8 · 源码核查**：[src/index.ts:2804-2814](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2804-L2814)

普通回退实际传请求session。

<details>
<summary>查看原文（11行）</summary>

```text
        // The REQUESTER governs the WRITE: the sandbox and workspace a revert runs under are the pressing
        // seat's own, never another session's (see `DiffApprovalUndoPair.policySession`). Visibility has
        // already established that this session shares a workspace with an owner of the row, so the file is
        // inside this session's workspace — and a press runs under the authority of the seat that pressed it
        // rather than silently borrowing a wider grant from whoever touched the file last. The undo pair
        // below is filed under that same pressing session (`pushUndo` canonicalizes the STACK, not this).
        // A revert that deletes a created file is not undoable (the file is
        // gone); a revert that writes keeps a snapshot for Ctrl+Z.
        let undo: { before: DiffApprovalUndoState; after: DiffApprovalUndoState } | undefined
        try {
          undo = await revertEntryContent(entry, target.sessionId, signal)
```

</details>

**依据 9 · 源码核查**：[src/index.ts:3142-3163](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L3142-L3163)

Undo用pair.policySession并恢复失败保留pair。

<details>
<summary>查看原文（22行）</summary>

```text
        }
        // EVERY write this undo will make is checked BEFORE the first one, under the pair's RECORDED seat:
        // a refusal anywhere means no file is touched, so a Ctrl+Z can never take back half a decision (see
        // `preflightRestore`). A refused undo leaves the pair exactly where it was — it is still takeable.
        const writes = restoreWritesOf(pair.before, pair.after)
        const refused = await preflightRestore(writes, pair.policySession, signal)
        if (refused !== undefined) {
          undoStackOf(root).push(pair)
          return restoreFailure('undo', refused.path, refused.error, { written: 0, total: writes.length, path: refused.path })
        }
        const progress: RestoreProgress = { written: 0, total: writes.length, path: pair.before.path }
        try {
          // The write policy is the pair's OWN recorded session — the seat that PERFORMED the action — never
          // the seat that popped it and never re-derived from the entry: the stack is keyed by the lineage
          // root, so any seat of that lineage may take this pair back, and a restore must not silently run
          // under a wider grant than the action did (see `DiffApprovalUndoPair.policySession`). The comment
          // scope stays the presser's for the same reason: it is the pair's own attribution.
          await restoreState(pair.policySession, pair.before, pair.after, signal, commentScopeOf(pair.pressedBy, view), progress)
        } catch (error: unknown) {
          // Keep the pair on the stack so a later, still-valid undo works.
          undoStackOf(root).push(pair)
          return restoreFailure('undo', progress.path, error, progress)
```

</details>

**依据 10 · 源码核查**：[src/index.ts:2423-2443](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2423-L2443)

flush失败日志。

<details>
<summary>查看原文（21行）</summary>

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
    }
```

</details>

**依据 11 · 源码核查**：[src/index.ts:2604-2610](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2604-L2610)

列表持久错误可见字段。

```text
          commentSkill: commentSkill(),
          // The last failure to write the pending state, so the panel can say that the list will not
          // survive a restart — the one thing a reader cannot find out from the panel itself.
          persistError: persistFailureReported,
          // …and the same for the comment files, which are their own files: a thread written
          // to memory while its file refuses the write is erased by a restart just as silently.
          commentPersistError: comments.persistError(),
```

**依据 12 · 源码核查**：[src/persist.ts:187-195](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/persist.ts#L187-L195)

原子写与实例内promise队列。

```text
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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回退和Undo足以保证恢复吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

不是。整文件回退先读当前内容作快照，再把oldText写回；writeRevert不带展示时内容摘要或内容比较前提。新增文件直接remove并返回undefined，不生成可Undo快照。旧README的every revert undoable应收窄，重启后内存Undo栈也不会恢复。

Undo确实先读当前内容并比较expectedFile，不同则拒绝，优于不检查；但随后另一次writeRevert调用，检查与发布不是源码可证明的原子CAS。不能由这个guard推断所有回退、块回退或批量恢复无并发窗口。用户应先冻结其他写入，重读实际文件再决定，遇divergence先保留外部版本，不反复点Undo。

批量Undo/Redo有预检查和写入计数，恢复失败错误会说明已经写了多少文件；这恰好说明需按部分完成核对，而不是把失败当所有文件未动。持久化是另一阶段，错误字段/日志需要被看到；源码未证跨进程写入协调、所有路径别名规范化或所有客户端错误显示。以上是调用链边界，没有执行并发或权限实验，不将潜在窗口说成已复现误覆盖。

面板帮助审阅，不能替代工作树备份、VCS与语义测试。删除前特别核该文件是否仍真正新增；外部写入或新任务接续可能改变判断。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1813-1817](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L1813-L1817)

回写没有内容比较参数。

```text
  async function writeRevert(target: FsTarget, content: string, sessionId: SessionId, signal: AbortSignal): Promise<unknown> {
    const policy = sandboxPolicyOf(sessionId)
    return policy === undefined
      ? ctx.fs.writeText(target, content, undefined, signal)
      : ctx.fs.writeText(target, content, undefined, signal, policy)
```

**依据 2 · 源码核查**：[src/index.ts:2046-2075](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2046-L2075)

整文件基线回退、新建删除不可Undo及内存栈。

<details>
<summary>查看原文（30行）</summary>

```text
  /**
   * Revert one entry's file back to its baseline (the shared per-entry logic
   * behind both the single `revert` endpoint and the bulk `revert-all`). An
   * entry with no earlier version (`earlierVersion: 'none'`) has its file
   * deleted (not undoable: the file is gone); one that has an earlier version
   * (`'file'`) writes it back and yields the before/after undo snapshot.
   * @param entry - the entry to revert.
   * @param sessionId - the entry's session (for the per-session write policy).
   * @param signal - aborts before atomic publication takes effect.
   * @returns the undo snapshot, or `undefined` when the revert is not undoable.
   */
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

**依据 3 · 源码核查**：[src/index.ts:2351-2364](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2351-L2364)

Undo先比较再分步写入。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2035-2043](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2035-L2043)

恢复失败报告已写进度。

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

**依据 5 · 源码核查**：[src/index.ts:2423-2443](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2423-L2443)

持久失败不会由等待自动变成成功。

<details>
<summary>查看原文（21行）</summary>

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
    }
```

</details>

#### 缺口

- 未复现整文件/块/批量与外写交错、不同policy席位及持久失败。
  **影响**：不能给安全恢复、隔离或实际误覆盖概率保证。
  **进一步探讨**：可备份临时工作树交错外写、删除和不同授权会话，核实际文件/部分完成/list错误与重开。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 源码与发布安装边界、使用步骤是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 条件

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH的fs/connection/webServer/workspace/session/agent服务 | host必需 | 捕获、可见性、策略和RPC | 缺服务无法等同可工作；固定宿主组合核验 |
| Web客户端及React/连接/UI服务 | 面板必需 | 差异、动作与设置 | host捕获不证明面板可用 |
| 可写pending与批注存储 | 跨重启保留必需 | 持久待审和讨论 | list的persistError/commentPersistError及日志需检查 |
| diff/shiki/marked/dompurify等依赖 | 对应功能/包依赖 | 差异、语法/Markdown渲染 | 未独立审其实现或性能/净化安全 |
| Git/SVN/Perforce及宿主执行器 | 相应VCS导入可选 | 工具外改动补入 | 导入失败不说明工作树无改动，未跟踪扫描另计成本 |
| 可备份工作树与无竞争写入窗口 | 恢复验收必需 | 避免未知外写/不可撤销删除 | 不能满足则先保持Git/编辑器审阅 |

包版本0.36.1，main/exports指lib/index.js；当前固定checkout没有该文件，仓库build声明为tsc加tsdown。这是需要构建的源码交付边界，不是已确认可直接安装的发布包。本轮没有构建、安装、执行测试或核npm制品对应；README兼容结论仍属作者报告。

#### 步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定宿主/发布包、备份工作树及待审/批注数据 | 记录加载/存储位置，源码目录不能当制品已备 |
| 捕获 | 用户在临时文件做edit/write及新建再编辑 | 面板前后内容、路径、创建基线与盘面一致 |
| 决定 | 用户先Keep一块，再冻结外写测试回退 | 保留/回退范围正确；拒绝或分歧先核盘面 |
| 恢复 | 用户核普通Undo、删除与批量部分失败 | 新建删除不能靠Undo恢复；错误按已完成计数核对 |
| 重开 | 用户观察list持久错误并重启读回 | 待审可恢复，Undo栈不在；异常保留备份 |
| 退出 | 用户清点未决项后禁用 | 回Git/编辑器和测试，不把Keep作为最终验收 |


#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-21](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/package.json#L2-L21)

实际版本与发布lib入口。

<details>
<summary>查看原文（20行）</summary>

```text
  "name": "dsh-diff-approval",
  "version": "0.36.1",
  "description": "DeepSeek Harness plugin: pending-edit review with whole-file diff and Keep/Revert",
  "packageManager": "pnpm@11.21.0",
  "author": "Wu Zhiwei",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/9087/dsh-diff-approval.git"
  },
  "homepage": "https://github.com/9087/dsh-diff-approval#readme",
  "bugs": {
    "url": "https://github.com/9087/dsh-diff-approval/issues"
  },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
```

</details>

**依据 2 · 源码核查**：[package.json:44-60](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/package.json#L44-L60)

Web依赖服务与build命令。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/index.ts:91-102](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L91-L102)

host必需服务声明。

<details>
<summary>查看原文（12行）</summary>

```text
export const name = 'diff-approval'

/**
 * Services required before the review surface activates. `webServer` rides with
 * `connection` (both come from the web bundle), and is named explicitly because
 * the channel's owner context must be able to resolve it — see
 * `ConnectionServiceSurface`. `sessionController` and `agents` are what a comment is
 * asked through and what reports the turn that claimed it: both come from the same
 * base composition this plugin already requires for `sessions`, so a host that could
 * list pending changes at all has them.
 */
export const inject = ['fs', 'connection', 'webServer', 'workspaceRegistry', 'sessions', 'sessionController', 'agents']
```

</details>

**依据 4 · 源码核查**：[src/vcs.ts:2-20](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/vcs.ts#L2-L20)

VCS基线与未跟踪扫描条件。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[src/index.ts:2604-2610](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2604-L2610)

待审/批注持久错误字段。

```text
          commentSkill: commentSkill(),
          // The last failure to write the pending state, so the panel can say that the list will not
          // survive a restart — the one thing a reader cannot find out from the panel itself.
          persistError: persistFailureReported,
          // …and the same for the comment files, which are their own files: a thread written
          // to memory while its file refuses the write is erased by a restart just as silently.
          commentPersistError: comments.persistError(),
```

**依据 6 · 源码核查**：[src/index.ts:225-238](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L225-L238)

批注工具注册路径。

<details>
<summary>查看原文（14行）</summary>

```text
 * @param deps - what fulfils one call (see `annotate-tool.ts`).
 * @returns whether the tool is now in the registry.
 */
function registerAnnotateTool(ctx: Context, deps: AnnotateRunDeps): boolean {
  if (typeof (ctx.get('tools') as { register?: unknown } | undefined)?.register !== 'function') return false
  let registered = false
  ctx.effect(() => {
    const tools = ctx.get('tools') as { register?: (definition: unknown) => unknown } | undefined
    if (typeof tools?.register !== 'function') return () => {}
    try {
      const dispose = tools.register(annotateToolDefinition(annotateRun(deps)))
      registered = true
      return typeof dispose === 'function' ? dispose as () => void : () => {}
    } catch (error: unknown) {
```

</details>

**依据 7 · 源码核查**：[src/index.ts:3643-3666](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L3643-L3666)

连接RPC与资源路由注册。

<details>
<summary>查看原文（24行）</summary>

```text
  // is this plugin's own context — the one that injects `webServer` (see
  // `ConnectionServiceSurface`). `rpc.handle` stays as the fallback for a build
  // that no longer exposes `register`. The trust policy rides along because the
  // 0.1.0 line reads it from the options argument.
  ctx.effect(() => {
    const service = ctx.connection as unknown as ConnectionServiceSurface
    return typeof service.register === 'function'
      ? service.register(ctx, DIFF_APPROVAL_CHANNEL, handle, { authority: 'trusted-host' })
      : service.rpc.handle(DIFF_APPROVAL_CHANNEL, handle, { authority: 'trusted-host' })
  }, 'diff-approval: review channel')

  // Serve the bundled code font's slices. The panel asks for a family whose one
  // CJK glyph is exactly twice one Latin glyph, and the files that back it ship
  // with the plugin: a CDN is not an option (Google Fonts is unreachable in
  // mainland China, and a handful of sliced woff2 files is not what any font CDN
  // distributes) and asking the reader to install a font is not one either.
  ctx.effect(() => {
    const route = fontRoute((message) => ctx.logger.warn(message))
    const server = ctx.get('webServer') as WebServerSurface | undefined
    if (typeof server?.register !== 'function') {
      ctx.logger.debug('diff-approval: no web server, so the bundled code font is not served')
      return () => {}
    }
    return server.register(route)
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 总投入、可借鉴点和试用条件是什么？

**研究主题**：效果与总成本、工程质量与复用、新假设与验证、采用判断

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 客户端/本地存储与构建或发布包 | 备份、核策略/基线及动作 | 宿主兼容和配置时间未测 |
| 持续使用 | 前后全文、差异/高亮与批注存储；VCS扫描 | 逐块理解语义、回源测试 | 不把虚拟化或快捷键当节时证据 |
| 失败恢复 | 工作树备份、部分写回与持久修复 | 冻结外写、逐文件核对和重开 | 新建删除不可Undo；内存栈不跨重启 |
| 升级退出 | pending/批注与代码备份 | 核全局路径身份、迁移和未决项 | 清单不是代码备份替代品 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 审阅汇集 | 指定成功工具结果与路径级待审 | 所有外部写入覆盖、审阅遗漏率 |
| 作用范围 | 普通回退跟请求者、Undo保留原操作policy | 实际宿主权限/谱系组合是否始终一致 |
| 恢复可观测 | expected内容检查、部分完成计数和persistError | 原子防覆盖、删除/重启后恢复、面板错误可见性 |
| 流程收益 | 会话内块/范围操作接线 | 相对Git/编辑器的正确率与总耗时 |

可借鉴结构化工具结果捕获、创建基线演进、权限归属记录和部分失败进度；代价是路径、谱系、待审、评论、Undo与磁盘状态必须一致。建议在单人可备份临时工作树有限试用，确认盘面和面板一致、回退范围及重开边界后再决定保留。若出现来源/权限不明、持久错误或外写竞态，停止回退，保存现场回到VCS/编辑器恢复；不用总体功能数证明收益。

未验证方向是让所有回退绑定展示时摘要，由后端原子比较再发布，并返回部分完成与持久状态。比当前整文件无前提、Undo读后再写，可能减少过期决定覆盖新改动；需要后端支持且增加冲突/重审成本。用同一临时改动集交错外写，对照现版与候选方案，量误覆盖、误拒绝、恢复时间和最终正确率；若后端不能原子执行或只增加确认时间而不减误覆盖/总成本，否定优势。

#### 证据与依据

**依据 1 · 源码核查**：[src/pending.ts:109-128](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/pending.ts#L109-L128)

基线状态管理负担。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 2 · 源码核查**：[src/index.ts:1813-1817](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L1813-L1817)

原子比较方案对应的当前无前提写。

```text
  async function writeRevert(target: FsTarget, content: string, sessionId: SessionId, signal: AbortSignal): Promise<unknown> {
    const policy = sandboxPolicyOf(sessionId)
    return policy === undefined
      ? ctx.fs.writeText(target, content, undefined, signal)
      : ctx.fs.writeText(target, content, undefined, signal, policy)
```

**依据 3 · 源码核查**：[src/index.ts:2351-2364](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2351-L2364)

Undo检查/写入分离。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2035-2043](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2035-L2043)

已有部分恢复进度。

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

**依据 5 · 源码核查**：[src/index.ts:2604-2610](https://github.com/9087/dsh-diff-approval/blob/a661a7a31583057c8ba8bbeb73721a9b3ee0c57e/src/index.ts#L2604-L2610)

已有持久错误观测基线。

```text
          commentSkill: commentSkill(),
          // The last failure to write the pending state, so the panel can say that the list will not
          // survive a restart — the one thing a reader cannot find out from the panel itself.
          persistError: persistFailureReported,
          // …and the same for the comment files, which are their own files: a thread written
          // to memory while its file refuses the write is erased by a restart just as silently.
          commentPersistError: comments.persistError(),
```

#### 缺口

- 缺大文件/多会话审阅与恢复的资源、人工和结果数据。
  **影响**：不能定量净节时、误覆盖改善或独立付费需求。
  **进一步探讨**：与Git/编辑器同改动集比较决定正确率、资源、全部恢复和人工时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
