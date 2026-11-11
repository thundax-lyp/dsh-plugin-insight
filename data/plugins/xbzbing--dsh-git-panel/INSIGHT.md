# DSH Git Panel

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[76308c1](https://github.com/xbzbing/dsh-git-panel/tree/76308c1f03f62214386ecc94166033e82ec5b46d)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xbzbing/dsh-git-panel) [![npm 30d 9,327](https://img.shields.io/static/v1?label=npm+30d&message=9%2C327&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xbzbing/dsh-git-panel) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xbzbing/dsh-git-panel)
<!-- END META -->

> **功能**：在 DeepSeek Harness 对话工作区展示 Git 分支、历史和差异，并提供暂存、提交和变更管理。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 把 Git 状态与差异带到会话，并在宿主执行时重建可用的工作树路径集。

> **主要限制**：[Q03](#research-q03) 未跟踪删除分多项执行，后续失败不恢复已删除项，错误需结合实际工作树核对。

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
  - [Q01 · 面板适合什么审阅任务？](#detail-section-11)
  - [Q02 · 全量丢弃如何确定目标？](#detail-section-12)
  - [Q03 · 报错后哪些文件可能已变化？](#detail-section-13)
  - [Q04 · 如何评估采用并保留退路？](#detail-section-14)
  - [Q05 · 能否减少预览与删除之间的范围漂移？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者在 DSH 会话内审阅工作树和暂存区，按文件核对当前改动。

命令行 git status、git diff 与 IDE Git 面板。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 变更审阅 | 核对工作树和暂存状态 | 用户应回读实际 Git 状态 |
| 丢弃工作树改动 | 按路径还原或删除 | 可能部分失败，未跟踪文件需备份 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web 与 Git | 必需 | 会话面板和仓库操作 | 切终端直接核对 |
| 备份或一次性仓库 | 破坏性试用必需 | 恢复未跟踪数据 | 保持只读 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户开一次性仓库 | 记录 Git 基线 |
| 审阅 | 对照面板状态和差异 | 区分暂存与工作树 |
| 恢复 | 部分失败时停止并回读 | 确认实际变化再继续 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主和 Git 资源 | 核对仓库与版本 | 耗时未知 |
| 持续 | 状态与 diff 进程 | 核对变更范围 | 大型仓库开销未测 |
| 失败 | 备份存储 | 人工恢复与检查 | 未跟踪项可能无法从 Git 恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话审阅 | 提供状态和执行入口 | 真实节时 |
| 范围保护 | 裁剪拒绝和嵌套仓库检查 | 竞争窗口与部分失败 |

> **思考**：[Q03](#research-q03) 未跟踪删除分多项执行，后续失败不恢复已删除项，错误需结合实际工作树核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 把 Git 状态与差异带到会话，并在宿主执行时重建可用的工作树路径集。

[Q02](#research-q02) 拒绝不完整状态流，[Q03](#research-q03) 对部分失败明确告知结果边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 未跟踪删除分多项执行，后续失败不恢复已删除项，错误需结合实际工作树核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用一次性仓库做只读对照，部分失败时停止并回终端核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持状态、删除护栏与部分错误处理。真实宿主及并发场景未运行。

- 已检查：作者 README、包清单、源码路径 src/host/actions.ts、src/host/git.ts、README.md、src/host/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：聚焦工作树丢弃与 host Git runner。未全面审查提交、远程推送、AI 路由或文件浏览。
- 下一步：在一次性仓库测试裁剪输出、嵌套仓库、路径变化及失败后的文件状态。

**分析版本**

- **仓库**：[xbzbing/dsh-git-panel](https://github.com/xbzbing/dsh-git-panel)
- **版本号**：1.13.2（[固定提交 76308c1](https://github.com/xbzbing/dsh-git-panel/tree/76308c1f03f62214386ecc94166033e82ec5b46d)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在预览和执行之间绑定工作树目标身份，可测量范围漂移是否减少。

在一次性仓库测试裁剪输出、嵌套仓库、路径变化及失败后的文件状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 62 | 2793 | — | — | 62734 |
| .mjs | source | 3 | 401 | 268 | 116 | — |
| .tsx | source | 49 | 12440 | 8825 | 2979 | — |
| .ts | source | 134 | 24133 | 16455 | 6534 | — |
| .mjs | test | 131 | 36395 | 29763 | 4652 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/xbzbing/dsh-git-panel/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=28&color=737b86&logo=github)](https://github.com/xbzbing/dsh-git-panel/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=29&color=737b86&logo=github)](https://github.com/xbzbing/dsh-git-panel/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 对话中审阅 Git 改动时，操作者能否可靠识别丢弃范围及部分失败？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面板适合什么审阅任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

开发者在会话中频繁查看变更与对照 diff，可用同一页核对工作树和暂存状态，避免反复切终端。合格结果是找到目标文件并确认操作范围与 Git 实际状态。命令行和 IDE 是可直接核对的替代，面板的增量是上下文和交互便利，非 Git 新语义。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-9](https://github.com/xbzbing/dsh-git-panel/blob/76308c1f03f62214386ecc94166033e82ec5b46d/README.md#L7-L9)

作者定义面板及 subprocess 方式。

```text
`dsh-git-panel` 是一个 DSH Web GUI 插件，在对话工作区里提供 IDE 风格的 Git 面板。它把分支列表、提交历史图、未提交变更的提交与 amend、语法高亮的差异对照集中到一个常驻标签页，并在输入框左侧放一个 zsh 风格的分支标记，让你在对话过程中随手查看仓库状态、提交改动，不必切到终端或另开 IDE。

面板只读取当前会话工作目录所在的 Git 仓库，所有 git 命令都以 argv 数组经宿主的 subprocess 服务执行，不拼接 shell 字符串，工作目录锁定在仓库根，并带超时与输出上限。插件默认不改动 git 配置；写入 tracking 配置（`branch.<name>.remote` / `merge`）只有三处：你点击「设置上游」（不推送、不联网）、你点击「发布」（`git push -u`，会联网并在远端创建同名分支），以及从远端分支创建本地分支时 git 的 `--track` 行为。写操作（提交、amend、暂存、丢弃）都有明确入口。
```

**依据 2 · 作者声明**：[README.md:29-31](https://github.com/xbzbing/dsh-git-panel/blob/76308c1f03f62214386ecc94166033e82ec5b46d/README.md#L29-L31)

作者说明工作树与 index 的选择语义。

```text
- **Git 总览**：分支 / 标签列表、提交历史图和提交详情，点文件即看该提交里的差异。历史支持“消息 / 哈希”和“文件 / 路径”两种搜索；文件 / 路径按历史路径做不区分英文大小写的字面子串匹配，文件名和目录片段都可搜，作者、日期、分支筛选继续叠加。该搜索只匹配路径、不搜代码内容，已删除路径仍可命中，改名不会自动追溯旧名。Git 默认的路径历史可能简化部分合并与支线，提交详情仍显示完整文件列表。
- **变更记录**：逐文件或批量暂存、放弃，提交与 **Amend**，贮藏，增删行统计；列表可切「平铺 / 树形」两种视图（树形按目录折叠、汇总每个目录的变更数，可整目录暂存或放弃，重命名显示旧路径），默认平铺、可在插件配置中改，操作栏尾部的一个图标随时切换（图标即当前视图，空间不足时自动隐藏）。勾选按行记「侧」：只勾暂存侧的那一行就按 index 现有内容提交（不会把工作区未暂存的改动再 `git add` 进来，`git add -p` 的部分暂存得以保留），勾工作区侧则按整份文件提交。
- **常用 Git 操作**：切换分支、新建分支（基于分支或提交创建，创建后不切换）、合并分支、拣选提交（cherry-pick），删除本地 / 远程分支（本地未合并时需在确认框中再次勾选强制删除；删除远程分支必须勾选确认）、增删标签、还原 / 重置提交；合并与拣选遇冲突会自动中止并恢复到操作前状态；破坏性操作需二次确认，除删除远程分支外只改本地仓库、不自动推送。没有上游、但有远端已有同名分支且与 HEAD 同提交时，同步按钮会显示「设置上游」：点击后选择一个远端（默认 origin），只写 tracking 配置，不推送也不联网；其余情况才提供「发布」（`push -u`）。
```

#### 缺口

- 真实切换频率和节省时间未知。
  **影响**：不能推断整体开发效率。
  **进一步探讨**：对同一改动集记录终端和面板操作、误选与完成时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 全量丢弃如何确定目标？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

请求本身不带路径。宿主运行机器可读 status，拒绝超时、取消、非零或输出裁剪，再提取非暂存侧的路径。未跟踪项直接走文件系统，已跟踪项进入普通 Git restore 路径。宿主 runner 使用 argv、cwd、输出上限和 pathspec 环境，降低 shell 与路径扩张风险。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/actions.ts:632-675](https://github.com/xbzbing/dsh-git-panel/blob/76308c1f03f62214386ecc94166033e82ec5b46d/src/host/actions.ts#L632-L675)

状态完整性门槛、工作树侧与未跟踪分流。

<details>
<summary>查看原文（44行）</summary>

```text
  // `discard-all` carries no paths on the wire: the host re-runs status itself
  // and refuses when the stream was lossy (a clipped read cannot honestly back
  // an "every change" claim). The resolved working-tree paths then ride the
  // normal `discard` pipeline below, keeping the untracked deletion guards
  // (nested-repo refusal, per-path re-check) in one place.
  if (request.action.kind === 'discard-all') {
    const status = await runCommand(deps.run, ['git', 'status', '--porcelain=v1', '-z', '--untracked-files=all'], root, 'discard-all-status', deps.signal)
    if ('failure' in status) return { ok: false, error: { code: 'git-unavailable', message: status.failure instanceof Error ? status.failure.message : String(status.failure) } }
    if (status.run.cancelled) return { ok: false, error: { code: 'cancelled' } }
    if (status.run.timedOut) return { ok: false, error: { code: 'timeout' } }
    if (status.run.exitCode !== 0) {
      const failure = classifyActionFailure(status.run.stdout, status.run.stderr, status.run.exitCode ?? -1)
      return { ok: false, error: failure }
    }
    if (status.run.stdoutLossy) {
      return { ok: false, error: { code: 'status-lossy', message: 'status output was clipped; refusing to discard an incomplete change set' } }
    }
    const all = parseStatus(status.run.stdout)
    // Working-tree side only: staged-only entries are out of scope (same
    // contract as the picked batch), so `:w` picks are the whole target set.
    const paths = [...new Set(all.filter((c) => !c.staged).map((c) => c.path))].sort()
    if (paths.length === 0) {
      const snapshot = await snapshotForSession(deps, config, request.sessionId, { repo: request.repo })
      if (!snapshot.ok) return { ok: false, error: { code: 'git-error', message: 'snapshot after action failed' } }
      return { ok: true, snapshot: snapshot.value, output: '' }
    }
    request = { ...request, action: { kind: 'discard', paths } }
  }

  // Discard of an untracked path can't go through `git restore` (pathspec does
  // not match a known file); delete those from the work tree directly, with a
  // realpath-containment check, and let git restore only the tracked ones.
  if (request.action.kind === 'discard') {
    const removed = await discardUntracked(deps, config, root, request.sessionId, request.repo, request.action.paths)
    if (removed !== null) {
      if (!removed.ok) return removed.result
      if (removed.remainingTracked.length === 0) {
        const snapshot = await snapshotForSession(deps, config, request.sessionId, { repo: request.repo })
        if (!snapshot.ok) return { ok: false, error: { code: 'git-error', message: 'snapshot after action failed' } }
        return { ok: true, snapshot: snapshot.value, output: '' }
      }
      request = { ...request, action: { kind: 'discard', paths: removed.remainingTracked } }
    }
  }
```

</details>

**依据 2 · 源码核查**：[src/host/git.ts:82-119](https://github.com/xbzbing/dsh-git-panel/blob/76308c1f03f62214386ecc94166033e82ec5b46d/src/host/git.ts#L82-L119)

argv 与 cwd，限制输出并设 pathspec。

<details>
<summary>查看原文（38行）</summary>

```text
        const signal = opts.signal === undefined
          ? controller.signal
          : AbortSignal.any([controller.signal, opts.signal])
        const handle = subprocess.spawn({
          argv,
          cwd: opts.cwd,
          env: {
            // Never let a network command (fetch/pull) block on an interactive
            // credential or host-key prompt: with stdin ignored git would hang
            // until the timeout. GIT_TERMINAL_PROMPT=0 makes it fail fast instead,
            // and is harmless for the non-network commands that share this runner.
            GIT_TERMINAL_PROMPT: '0',
            // Read-only commands (`status`, `diff`) refresh the stat cache and
            // write `.git/index` behind an `index.lock`; a user or agent running
            // `git add` at that moment then fails on the lock. Optional locks off
            // keeps those refresh writes out of the index; commands that must
            // write it (add/commit/restore) take their own lock as usual.
            GIT_OPTIONAL_LOCKS: '0',
            // Path arguments are work-tree paths from git's own output, never
            // patterns: with pathspec expansion on, a name containing glob
            // metacharacters (`app/[id].tsx`) or magic (`:/`) also matches other
            // files, so a discard would rewrite them. Commands that consume
            // pathspecs themselves (`check-ignore`, `stash -u`) reject or misread
            // the literal flag. The opposite case is `log` / `rev-list`, whose
            // pattern this plugin builds: a GIT_*PATHSPECS setting inherited from
            // the shell would silently change that pattern (literal or no-glob
            // finds nothing, glob stops `*` at a `/`), so their expansion mode is
            // pinned as well. See pathspecEnv.
            ...pathspecEnv(argv),
            ...opts.env,
          },
          stdio: {
            stdin: opts.stdinData === undefined ? 'ignore' : { data: opts.stdinData },
            stdout: { collect: { maxBytes, spill: { maxBytes: spillMaxBytes } } },
            stderr: { collect: { maxBytes, spill: { maxBytes: spillMaxBytes } } },
          },
          graceMs: 200,
          signal,
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 报错后哪些文件可能已变化？

**研究主题**：缺陷与关键质疑

#### 完整回答

未跟踪项按路径逐个检查真实位置和嵌套仓库，再删除。检查期间路径仍可能变化；若较后项失败，较早项已删，后续已跟踪 restore 可能根本未运行。代码用 nested-repo-partial 或失败列表报告部分状态。操作者应先核对仓库和备份，不能把错误当作未写入或通用撤销。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/actions.ts:895-937](https://github.com/xbzbing/dsh-git-panel/blob/76308c1f03f62214386ecc94166033e82ec5b46d/src/host/actions.ts#L895-L937)

逐项护栏及删除。

<details>
<summary>查看原文（43行）</summary>

```text
  // Remove every untracked target, collecting failures: a removal that did not
  // happen must not come back as a successful discard (a directory without
  // `recursive`, a permission error, …). Paths already gone stay gone — the
  // caller gets an error instead of a silent no-op.
  const failures: string[] = []
  let removedCount = 0
  for (const path of untracked) {
    if (!isSafePath(path)) return { ok: false, result: { ok: false, error: { code: 'invalid-path', message: `unsafe path: ${path}` } } }
    const target = join(root, path)
    const link = await lstatOrNull(deps, target)
    if (link === null) {
      // Nothing at that path: the entry is already gone (another process, or a
      // refresh that raced). Continuing is truthful — there is nothing to undo.
      continue
    }
    // A dangling symlink resolves to nothing, so `realpath` below cannot place
    // it; contain the link's own directory instead. `fs.remove` deletes the
    // link itself, never the target, so this is the same containment rule as a
    // regular entry — without it the link would be silently left behind.
    const targetReal = await deps.fs.realpath(target).catch(() => null)
    const containReal = targetReal ?? (link.isSymbolicLink()
      ? await deps.fs.realpath(dirname(target)).catch(() => null)
      : null)
    if (containReal === null || (containReal !== rootReal && !containReal.startsWith(rootReal + sep))) {
      return { ok: false, result: { ok: false, error: { code: 'invalid-path', message: `path escapes repository: ${path}` } } }
    }
    // Last-moment re-check: the pre-flight above can be raced by a repository
    // appearing under a directory target after it scanned. Statting again
    // immediately before the removal narrows that window to the few syscalls
    // between this call and the `rm` itself. Nothing has been removed yet in
    // the normal case, so the refusal still means "the batch is untouched"; if
    // it fires after earlier paths were deleted, say so with its own code —
    // the generic copy would read as if the whole batch had been skipped.
    if (await looksLikeRepository(deps, target)) {
      const code = removedCount === 0 ? 'nested-repo' : 'nested-repo-partial'
      const detail = removedCount === 0 ? '' : `; ${removedCount} path(s) already removed`
      return { ok: false, result: { ok: false, error: { code, message: `repository directory: ${path}${detail}` } } }
    }
    try {
      await deps.fs.remove(target)
      removedCount += 1
    } catch (e) {
      failures.push(`${path}: ${e instanceof Error ? e.message : String(e)}`)
```

</details>

**依据 2 · 源码核查**：[src/host/actions.ts:940-949](https://github.com/xbzbing/dsh-git-panel/blob/76308c1f03f62214386ecc94166033e82ec5b46d/src/host/actions.ts#L940-L949)

失败汇总与未恢复的跟踪项。

<details>
<summary>查看原文（10行）</summary>

```text
  if (failures.length > 0) {
    // Named shortfalls: which paths failed, and that the tracked half of the
    // request never ran because the untracked deletions are attempted first.
    const skipped = tracked.length > 0 ? `; ${tracked.length} tracked path(s) not restored` : ''
    return {
      ok: false,
      result: { ok: false, error: { code: 'git-error', message: `could not discard ${failures.length} path(s): ${failures.join('; ')}${skipped}` } },
    }
  }
  return { ok: true, remainingTracked: tracked }
```

</details>

#### 缺口

- 不同文件系统上的并发替换与保留效果未复现。
  **影响**：不能承诺所有竞争都被护栏阻止。
  **进一步探讨**：在一次性仓库交错创建子仓库、改链接和权限失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何评估采用并保留退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH Web、仓库和 Git。先在一次性仓库核对 diff、两侧文件和官方 status，避免在真实工作区用全量丢弃试错。只有主动使用 AI 提交消息才涉及作者明确披露的 diff 模型外发，本次未核查完整数据流，试用可跳过。遇到范围不符或部分失败时停止，保存状态并回终端逐项核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-32](https://github.com/xbzbing/dsh-git-panel/blob/76308c1f03f62214386ecc94166033e82ec5b46d/README.md#L32-L32)

作者披露 AI 提交信息的外发。

```text
- **AI 生成提交信息**：参照仓库既有提交风格生成，模型默认跟随当前会话，可在详情页固定。**生成会把 diff 内容发送给所选模型的供应商。**
```

**依据 2 · 源码核查**：[src/host/actions.ts:646-652](https://github.com/xbzbing/dsh-git-panel/blob/76308c1f03f62214386ecc94166033e82ec5b46d/src/host/actions.ts#L646-L652)

工作树与截断限制。

```text
    if (status.run.stdoutLossy) {
      return { ok: false, error: { code: 'status-lossy', message: 'status output was clipped; refusing to discard an incomplete change set' } }
    }
    const all = parseStatus(status.run.stdout)
    // Working-tree side only: staged-only entries are out of scope (same
    // contract as the picked batch), so `:w` picks are the whole target set.
    const paths = [...new Set(all.filter((c) => !c.staged).map((c) => c.path))].sort()
```

**依据 3 · 源码核查**：[src/host/actions.ts:928-946](https://github.com/xbzbing/dsh-git-panel/blob/76308c1f03f62214386ecc94166033e82ec5b46d/src/host/actions.ts#L928-L946)

部分失败需额外核对。

<details>
<summary>查看原文（19行）</summary>

```text
    if (await looksLikeRepository(deps, target)) {
      const code = removedCount === 0 ? 'nested-repo' : 'nested-repo-partial'
      const detail = removedCount === 0 ? '' : `; ${removedCount} path(s) already removed`
      return { ok: false, result: { ok: false, error: { code, message: `repository directory: ${path}${detail}` } } }
    }
    try {
      await deps.fs.remove(target)
      removedCount += 1
    } catch (e) {
      failures.push(`${path}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }
  if (failures.length > 0) {
    // Named shortfalls: which paths failed, and that the tracked half of the
    // request never ran because the untracked deletions are attempted first.
    const skipped = tracked.length > 0 ? `; ${tracked.length} tracked path(s) not restored` : ''
    return {
      ok: false,
      result: { ok: false, error: { code: 'git-error', message: `could not discard ${failures.length} path(s): ${failures.join('; ')}${skipped}` } },
```

</details>

#### 缺口

- 宿主版本与大型仓库性能未验收。
  **影响**：不能估算持续加载或恢复负担。
  **进一步探讨**：用合成仓库验证大输出和部分失败。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否减少预览与删除之间的范围漂移？

**研究主题**：新假设与验证

#### 完整回答

可以在确认前保存工作树目标及其可复核身份，执行前比较快照并展示新增或改变项。当前宿主重新读取状态能避免依赖旧客户端路径，却不保证预览后没有新增变更。用同一仓库在确认后添加文件、修改内容和制造输出裁剪，对比错误删除数及阻止次数。若比较仍遗漏竞争，或使常见工作流频繁误拒，需缩小承诺。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/actions.ts:632-658](https://github.com/xbzbing/dsh-git-panel/blob/76308c1f03f62214386ecc94166033e82ec5b46d/src/host/actions.ts#L632-L658)

执行时重新计算路径。

<details>
<summary>查看原文（27行）</summary>

```text
  // `discard-all` carries no paths on the wire: the host re-runs status itself
  // and refuses when the stream was lossy (a clipped read cannot honestly back
  // an "every change" claim). The resolved working-tree paths then ride the
  // normal `discard` pipeline below, keeping the untracked deletion guards
  // (nested-repo refusal, per-path re-check) in one place.
  if (request.action.kind === 'discard-all') {
    const status = await runCommand(deps.run, ['git', 'status', '--porcelain=v1', '-z', '--untracked-files=all'], root, 'discard-all-status', deps.signal)
    if ('failure' in status) return { ok: false, error: { code: 'git-unavailable', message: status.failure instanceof Error ? status.failure.message : String(status.failure) } }
    if (status.run.cancelled) return { ok: false, error: { code: 'cancelled' } }
    if (status.run.timedOut) return { ok: false, error: { code: 'timeout' } }
    if (status.run.exitCode !== 0) {
      const failure = classifyActionFailure(status.run.stdout, status.run.stderr, status.run.exitCode ?? -1)
      return { ok: false, error: failure }
    }
    if (status.run.stdoutLossy) {
      return { ok: false, error: { code: 'status-lossy', message: 'status output was clipped; refusing to discard an incomplete change set' } }
    }
    const all = parseStatus(status.run.stdout)
    // Working-tree side only: staged-only entries are out of scope (same
    // contract as the picked batch), so `:w` picks are the whole target set.
    const paths = [...new Set(all.filter((c) => !c.staged).map((c) => c.path))].sort()
    if (paths.length === 0) {
      const snapshot = await snapshotForSession(deps, config, request.sessionId, { repo: request.repo })
      if (!snapshot.ok) return { ok: false, error: { code: 'git-error', message: 'snapshot after action failed' } }
      return { ok: true, snapshot: snapshot.value, output: '' }
    }
    request = { ...request, action: { kind: 'discard', paths } }
```

</details>

**依据 2 · 源码核查**：[src/host/actions.ts:921-931](https://github.com/xbzbing/dsh-git-panel/blob/76308c1f03f62214386ecc94166033e82ec5b46d/src/host/actions.ts#L921-L931)

每项最后检查只缩小竞争窗口。

<details>
<summary>查看原文（11行）</summary>

```text
    // Last-moment re-check: the pre-flight above can be raced by a repository
    // appearing under a directory target after it scanned. Statting again
    // immediately before the removal narrows that window to the few syscalls
    // between this call and the `rm` itself. Nothing has been removed yet in
    // the normal case, so the refusal still means "the batch is untouched"; if
    // it fires after earlier paths were deleted, say so with its own code —
    // the generic copy would read as if the whole batch had been skipped.
    if (await looksLikeRepository(deps, target)) {
      const code = removedCount === 0 ? 'nested-repo' : 'nested-repo-partial'
      const detail = removedCount === 0 ? '' : `; ${removedCount} path(s) already removed`
      return { ok: false, result: { ok: false, error: { code, message: `repository directory: ${path}${detail}` } } }
```

</details>

#### 缺口

- 快照绑定交互未验证。
  **影响**：无法估算误拒及实际保护。
  **进一步探讨**：对照多进程变更下的范围差异。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
