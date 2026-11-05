# dsh-github

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f9cb4aa](https://github.com/PivotStackIntelligence/dsh-github/tree/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a)

<!-- BEGIN META -->
[![GitHub ★ 92](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PivotStackIntelligence/dsh-github) [![npm 30d 1,118](https://img.shields.io/static/v1?label=npm+30d&message=1%2C118&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-github) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-github)
<!-- END META -->

> **功能**：DSH Source Control 标签展示 Git 状态与差异，并调用本地 Git 管理仓库。

> **亮点**：[Q01](#research-q01) 将 diff 与提交放到当前会话。

> **主要限制**：[Q02](#research-q02) 删除不可逆，同步分步失败需核对。

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
  - [Q01 · 会话工作区如何变成可读的 Git 状态与 diff？](#detail-section-11)
  - [Q02 · 暂存、丢弃和同步的作用域及失败结果是什么？](#detail-section-12)
  - [Q03 · 怎样确认面板节省切换且不会掩盖范围？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：编码用户想在会话旁检查改动和提交。

终端或编辑器 Git 面板。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态与差异 | 按当前会话 cwd 查仓库并展示 staged/working/untracked | 解析到整个仓库根；二进制不展开，大文件标截断 |
| 暂存与提交 | 单路径或整个仓库暂存、提交、amend 与 soft undo | 实际提交 index，外部 Git 并发未锁定 |
| 丢弃 | 恢复已跟踪文件或删除未跟踪内容 | 全量操作影响仓库根；未跟踪 rm 无插件回收站 |
| 同步与远端 | pull 后 push、管理远端和分支 | 分步执行；push 失败不撤销已完成 pull |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Git 与兼容 DSH | 必需 | 状态和命令 | 远端使用本机认证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 查看 | 核对 diff 与终端 | 确认工作区 |
| 提交 | 测试分支写入 | 检查状态 |
| 失败 | 保留结果回终端 | 同步可能已 pull |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 无额外服务价格依据，安装工时未知 | 确认 Git PATH、profile 和当前会话 cwd | 远端使用已有 SSH 或 credential helper |
| 持续 | 人工核对时间未知 | 留意全仓库作用域、截断 diff 和外部 Git 并发 | 面板轮询时更新状态不锁 index |
| 失败 | 文件恢复和冲突处理时间未知 | 先核对 status/reflog，已 pull 未 push 时回终端修复 | 未跟踪文件被 rm 后只能靠事前备份 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 变更可见性 | 源码给 staged/working/untracked 分组和有界 diff | 真实 Host 的状态一致性 |
| 写入结果 | 源码调用 Git 后重新读状态 | 外部并发时是否误提交或误丢弃 |
| 效率 | 未取得终端对照 | 切换次数和完成时间 |

> **思考**：[Q02](#research-q02) 删除不可逆，同步分步失败需核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将 diff 与提交放到当前会话。

[Q02](#research-q02) 同步和删除按实际 Git 语义处理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 删除不可逆，同步分步失败需核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只读对照后试测试分支。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对 Git 入口与失败边界，未运行。

- 已检查：作者 README、包清单、源码路径 src/client/view.tsx、src/runtime.ts、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Host Git 及 README，未执行 Git 写入或目标。
- 下一步：双工作区、冲突与 push 拒绝。

**分析版本**

- **仓库**：[PivotStackIntelligence/dsh-github](https://github.com/PivotStackIntelligence/dsh-github)
- **版本号**：0.3.0（[固定提交 f9cb4aa](https://github.com/PivotStackIntelligence/dsh-github/tree/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a)）
- **版本日期**：2026-09-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照终端测切换时间。

双工作区、冲突与 push 拒绝。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 8 | 6 | 0 | — |
| .md | source | 5 | 624 | — | — | 8205 |
| .js | source | 1 | 8 | 7 | 0 | — |
| .tsx | source | 5 | 1144 | 953 | 95 | — |
| .ts | source | 10 | 2231 | 1804 | 274 | — |
| .ts | test | 3 | 1065 | 963 | 36 | — |
| .tsx | test | 2 | 603 | 508 | 13 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/PivotStackIntelligence/dsh-github/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/PivotStackIntelligence/dsh-github/issues?q=is%3Aissue+created%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PivotStackIntelligence/dsh-github/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：如何在 DSH 内检查并提交当前仓库？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话工作区如何变成可读的 Git 状态与 diff？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

SourceControlView 从当前 sessionId 的标准会话快照取 cwd；没有会话或目录则显示不可用，不提供任意工作区选择。Host root 要求绝对路径，再调用 git rev-parse --show-toplevel，所以子目录会扩展为整个仓库根。这里的范围是 UI 当前会话，而 Host Remote 方法本身接收 path，没有在已读 root 函数里绑定 session 授权；适合本机可信用户，不能据此描述为多租户仓库 ACL。文件参数拒绝绝对路径、NUL 和 .. 逃逸，未跟踪文件读取还做 realpath 核对，防止符号链接读出仓库。未跟踪 diff 只读 maxBytes+1 并检测 NUL，二进制返回“不展示”；文本合成新增 diff。已跟踪 diff 使用 --no-ext-diff 和 staged 的 --cached，最后按最大字节裁剪并标 truncated。因此这是一种有界变更预览，不是全部文件内容的完整证明。相对终端或编辑器 SCM，它把相同 Git 语义放到当前会话旁。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/view.tsx:43-58](https://github.com/PivotStackIntelligence/dsh-github/blob/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a/src/client/view.tsx#L43-L58)

会话快照取 cwd。

<details>
<summary>查看原文（16行）</summary>

```text
/** Render the Source Control panel for the current session's workspace. */
export function SourceControlView({ sessionId, useSessions, actions, t }: SourceControlViewProps) {
  const snapshot = useSessions(s => s)
  const summary = snapshot.byId[sessionId]
  const cwd = summary?.cwd

  if (summary === undefined || cwd === undefined || cwd === '') {
    return <div className="dsh-github-view"><div className="dsh-github-view-empty"><p>{t('panel.noSessionCwd')}</p></div></div>
  }

  return <div className="dsh-github-view">
    <GithubChangesPanel
      key={sessionId}
      path={cwd}
      title={summary.displayTitle || workspaceTitleOf(cwd)}
      actions={actions}
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:375-383](https://github.com/PivotStackIntelligence/dsh-github/blob/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a/src/runtime.ts#L375-L383)

根路径解析。

```text
  private async root(path: string, signal?: AbortSignal): Promise<string> {
    if (!isAbsolute(path)) throw new Error(`dsh-github: refusing relative path "${path}"`)
    if (this.knownRoots.has(path)) return path
    const cached = this.rootCache.get(path)
    if (cached !== undefined) return cached
    const found = (await this.git(['rev-parse', '--show-toplevel'], { cwd: path, signal })).trim()
    this.rootCache.set(path, found)
    this.knownRoots.add(found)
    return found
```

**依据 3 · 源码核查**：[src/runtime.ts:148-174](https://github.com/PivotStackIntelligence/dsh-github/blob/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a/src/runtime.ts#L148-L174)

文件路径与有界读。

<details>
<summary>查看原文（27行）</summary>

```text
function validateFilePath(root: string, filePath: string): string {
  if (isAbsolute(filePath) || filePath.includes('\0')) throw new Error('dsh-github: file path must be repository-relative')
  const absolute = resolve(root, filePath)
  const escaped = relative(root, absolute)
  if (escaped === '..' || escaped.startsWith(`..${sep}`)) throw new Error('dsh-github: file path escapes repository root')
  return escaped
}

function syntheticUntrackedDiff(filePath: string, text: string): string {
  const body = text.endsWith('\n') ? text.slice(0, -1) : text
  const lines = body === '' ? [] : body.split('\n')
  return [`diff --git a/${filePath} b/${filePath}`, 'new file mode 100644', '--- /dev/null', `+++ b/${filePath}`, `@@ -0,0 +${lines.length} @@`, ...lines.map(line => `+${line}`)].join('\n') + '\n'
}

async function readBoundedUntrackedFile(root: string, safePath: string, maxBytes: number): Promise<{ text: string; truncated: boolean; binary: boolean }> {
  const resolved = await realpath(resolve(root, safePath))
  const escaped = relative(root, resolved)
  if (escaped === '..' || escaped.startsWith(`..${sep}`) || isAbsolute(escaped)) throw new Error('dsh-github: file path escapes repository root')
  const handle = await open(resolved, 'r')
  try {
    const buffer = Buffer.alloc(maxBytes + 1)
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0)
    const bytes = buffer.subarray(0, bytesRead)
    return { text: bytes.toString('utf8'), truncated: bytesRead > maxBytes, binary: bytes.includes(0) }
  } finally {
    await handle.close()
  }
```

</details>

**依据 4 · 源码核查**：[src/runtime.ts:492-511](https://github.com/PivotStackIntelligence/dsh-github/blob/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a/src/runtime.ts#L492-L511)

两类 diff 与裁剪。

<details>
<summary>查看原文（20行）</summary>

```text
  /** Read one repository-relative file's bounded unified diff. */
  @Remote
  async getDiff(path: string, filePath: string, mode: GitDiffMode, signal?: AbortSignal): Promise<GitDiff> {
    const root = await this.root(path, signal)
    const safePath = validateFilePath(root, filePath)
    const statusOutput = await this.git(['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', safePath], { cwd: root, signal, maxBuffer: this.statusMaxBuffer() })
    const status = parseStatus(statusOutput, this.config.maxFiles * 4, () => null).files.find(file => file.path === safePath)
    let diff: string
    let truncated = false
    if (mode === 'working' && status?.kind === 'untracked') {
      const bounded = await readBoundedUntrackedFile(root, safePath, this.config.maxUntrackedBytes)
      if (bounded.binary) return { path: safePath, diff: `Binary file ${safePath} is not shown.\n`, truncated: bounded.truncated }
      diff = syntheticUntrackedDiff(safePath, bounded.text)
      truncated = bounded.truncated
    } else {
      const args = ['diff', '--no-ext-diff', '--unified=3', ...(mode === 'staged' ? ['--cached'] : []), '--', safePath]
      diff = await this.git(args, { cwd: root, signal })
    }
    const bounded = trimOutput(diff, this.config.maxDiffBytes)
    return { path: safePath, diff: bounded.text, truncated: truncated || bounded.truncated }
```

</details>

#### 缺口

- 未在目标 Host 核对切换、符号链接竞争和大文件
  **影响**：不能证明 UI 状态和实际仓库始终一致
  **进一步探讨**：两个仓库和子目录、二进制、符号链接与超限 diff 做对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 暂存、丢弃和同步的作用域及失败结果是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

单文件丢弃会先查当前状态，未跟踪文件走 rm recursive，已跟踪文件走 git restore；没有插件回收站。discardAll 在仓库根 restore .，可选 git clean -fd，所以会影响会话 cwd 之外的同仓库文件，嵌套目录用户必须理解这个范围。提交只提交 index，amend 改最近提交，Undo 使用 reset --soft 保留 index。sync 读取 fetch/push remote 并拒绝 detached HEAD，已有 upstream 时先 pull --no-edit 再 push，否则 push -u。push 失败不能撤销成功的 pull。外部 Git 进程在 UI 预览和执行之间可改变 index 或文件，未见这里有仓库锁或 expected-head 校验。mutating command 成功清 rootCache，随后重新读状态；这帮助发现结果，但不能把整个按钮解释成原子事务。运行使用 execFile 参数而非拼接 shell，复用本地 Git 配置和凭据。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:29-54](https://github.com/PivotStackIntelligence/dsh-github/blob/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a/src/runtime.ts#L29-L54)

进程参数及有界输出。

<details>
<summary>查看原文（26行）</summary>

```text
}

/** Run one executable, capture both streams, and record the bounded redacted execution. */
async function command(file: string, args: string[], options: ExecOptions = {}, record?: OutputRecorder): Promise<string> {
  const env = { ...process.env, GIT_EDITOR: 'true', GIT_TERMINAL_PROMPT: '0' }
  let ok = true
  let stdout = ''
  let stderr = ''
  try {
    const result = await execFileAsync(file, args, { ...options, encoding: 'utf8', env })
    stdout = result.stdout
    stderr = result.stderr
    return result.stdout
  } catch (error) {
    ok = false
    const captured = error as { stdout?: unknown; stderr?: unknown }
    stdout = typeof captured.stdout === 'string' ? captured.stdout : ''
    stderr = typeof captured.stderr === 'string' ? captured.stderr : ''
    throw error
  } finally {
    const combined = stdout !== '' && stderr !== '' ? `${stdout}\n${stderr}` : stdout !== '' ? stdout : stderr
    record?.({
      command: file,
      args: args.map(redactCredentials),
      ok,
      output: trimOutput(redactCredentials(combined), MAX_OUTPUT_BYTES).text,
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:351-368](https://github.com/PivotStackIntelligence/dsh-github/blob/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a/src/runtime.ts#L351-L368)

写入和缓存处理。

<details>
<summary>查看原文（18行）</summary>

```text
  /** Run a mutating Git command, map its failure, and invalidate the resolved-root cache. */
  private async write(args: string[], options: ExecOptions): Promise<string> {
    try {
      const output = await this.git(args, options)
      this.invalidateRootCache()
      return output
    } catch (error) {
      throw boundedGitError(error)
    }
  }

  /** Run a read-only Git validation command with a friendly error, without touching the root cache. */
  private async assertRef(args: string[], options: ExecOptions): Promise<void> {
    try { await this.git(args, options) } catch (error) { throw boundedGitError(error) }
  }

  private invalidateRootCache(): void {
    this.rootCache.clear()
```

</details>

**依据 3 · 源码核查**：[src/runtime.ts:551-588](https://github.com/PivotStackIntelligence/dsh-github/blob/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a/src/runtime.ts#L551-L588)

删除、提交和软回退。

<details>
<summary>查看原文（38行）</summary>

```text
  async discard(path: string, filePath: string, signal?: AbortSignal): Promise<GitStatus> {
    const root = await this.root(path, signal)
    const safePath = validateFilePath(root, filePath)
    const statusOutput = await this.git(['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', safePath], { cwd: root, signal, maxBuffer: this.statusMaxBuffer() })
    const file = parseStatus(statusOutput, 1, () => null).files.find(entry => entry.path === safePath)
    if (file?.kind === 'untracked') {
      await rm(resolve(root, safePath), { recursive: true, force: true })
      this.invalidateRootCache()
    } else {
      await this.write(['restore', '--', safePath], { cwd: root, signal })
    }
    return this.getStatus(root, signal)
  }

  /** Discard every working-tree change, optionally removing untracked files, and return fresh status. */
  @Remote
  async discardAll(path: string, includeUntracked: boolean, signal?: AbortSignal): Promise<GitStatus> {
    const root = await this.root(path, signal)
    await this.write(['restore', '--', '.'], { cwd: root, signal })
    if (includeUntracked) await this.write(['clean', '-fd'], { cwd: root, signal })
    return this.getStatus(root, signal)
  }

  /** Commit staged changes with an explicit message and return fresh status. */
  @Remote
  async commit(path: string, message: string, amend: boolean, signal?: AbortSignal): Promise<GitStatus> {
    const root = await this.root(path, signal)
    const checked = commitMessageSchema.parse(message)
    await this.write(amend ? ['commit', '--amend', '-m', checked] : ['commit', '-m', checked], { cwd: root, signal })
    return this.getStatus(root, signal)
  }

  /** Reset the last commit softly, preserving changes in the index, and return fresh status. */
  @Remote
  async undoLastCommit(path: string, signal?: AbortSignal): Promise<GitStatus> {
    const root = await this.root(path, signal)
    await this.write(['reset', '--soft', 'HEAD~1'], { cwd: root, signal })
    return this.getStatus(root, signal)
```

</details>

**依据 4 · 源码核查**：[src/runtime.ts:645-654](https://github.com/PivotStackIntelligence/dsh-github/blob/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a/src/runtime.ts#L645-L654)

分步同步。

<details>
<summary>查看原文（10行）</summary>

```text
  /** Pull then push without force. */
  @Remote
  async sync(path: string, signal?: AbortSignal): Promise<GitStatus> {
    const status = await this.getStatus(path, signal)
    if (status.branch.startsWith('HEAD ')) throw new Error('dsh-github: cannot sync a detached HEAD')
    if (status.remoteName === null || status.remoteUrl === null) throw new Error('dsh-github: a fetch remote is not configured')
    if (status.pushRemoteName === null || status.pushRemoteUrl === null) throw new Error('dsh-github: a push remote is not configured')
    if (status.upstream !== null) await this.write(['pull', '--no-edit'], { cwd: status.root, signal })
    await this.write(status.upstream === null ? ['push', '-u', status.pushRemoteName, status.branch] : ['push'], { cwd: status.root, signal })
    return this.getStatus(status.root, signal)
```

</details>

#### 缺口

- 无外部 Git 并发和远端拒绝的运行记录
  **影响**：预览不锁住实际提交或丢弃集合，失败后可能已发生部分变化
  **进一步探讨**：临时仓库中并发改 index、注入 pull 冲突及 push 拒绝后核对 reflog

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样确认面板节省切换且不会掩盖范围？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先从只读状态/diff 开始，用两个工作区和一个仓库子目录对照终端 git status、git diff 和 git diff --cached，要求 staged、working、untracked 和 binary 标记准确，截断应可见。写入只在可弃用分支演练，先保存未跟踪文件副本，核对单文件和全仓库操作的差异。合格结果是提交只包含预期 index，丢弃范围与文案一致，sync 后远端拒绝时能在新状态看出本地已 pull 的事实。与终端记录完成同一检查-暂存-提交任务的切换次数和时间；若未减少步骤或增加误作用域，就推翻便利假设并回编辑器 SCM。失败时先看 git status/reflog 和真实文件，不重按按钮；禁用插件即可回终端，但已经删除的未跟踪内容需独立副本，不能依赖禁用恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-42](https://github.com/PivotStackIntelligence/dsh-github/blob/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a/README.md#L22-L42)

本地认证与安装依赖。

<details>
<summary>查看原文（21行）</summary>

````text
The plugin uses the repository's normal local Git configuration, SSH keys, HTTPS credential helpers, and Git remotes. It does not call the GitHub API, store GitHub tokens, implement OAuth, depend on GitHub CLI, or expose arbitrary shell commands. GitHub links open the corresponding browser pages; the Compare page is the handoff for creating a pull request. Git writes require an explicit user action, and repository state is reloaded after each operation.

## Design notes

See [docs/ANALYSIS.md](docs/ANALYSIS.md) for the state model, VS Code Git alignment, local authentication boundary, and GitHub browser handoff design. The panel's visual design follows the DeepSeek design spec — see [docs/UI_DESIGN.md](docs/UI_DESIGN.md).

## Requirements

- DeepSeek Harness `>=0.1.0-rc.6`
- Git available on `PATH`
- A configured Git remote and credential helper for push/fetch/pull operations

## Install from a local checkout

```sh
pnpm install
pnpm run build
dsh plugin --profile web add .
```

Restart the Web Harness after rebuilding the plugin. A third "Source Control" tab appears in the session view ring (next to chat and trajectory).
````

</details>

**依据 2 · 源码核查**：[src/runtime.ts:492-511](https://github.com/PivotStackIntelligence/dsh-github/blob/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a/src/runtime.ts#L492-L511)

预览验收点。

<details>
<summary>查看原文（20行）</summary>

```text
  /** Read one repository-relative file's bounded unified diff. */
  @Remote
  async getDiff(path: string, filePath: string, mode: GitDiffMode, signal?: AbortSignal): Promise<GitDiff> {
    const root = await this.root(path, signal)
    const safePath = validateFilePath(root, filePath)
    const statusOutput = await this.git(['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', safePath], { cwd: root, signal, maxBuffer: this.statusMaxBuffer() })
    const status = parseStatus(statusOutput, this.config.maxFiles * 4, () => null).files.find(file => file.path === safePath)
    let diff: string
    let truncated = false
    if (mode === 'working' && status?.kind === 'untracked') {
      const bounded = await readBoundedUntrackedFile(root, safePath, this.config.maxUntrackedBytes)
      if (bounded.binary) return { path: safePath, diff: `Binary file ${safePath} is not shown.\n`, truncated: bounded.truncated }
      diff = syntheticUntrackedDiff(safePath, bounded.text)
      truncated = bounded.truncated
    } else {
      const args = ['diff', '--no-ext-diff', '--unified=3', ...(mode === 'staged' ? ['--cached'] : []), '--', safePath]
      diff = await this.git(args, { cwd: root, signal })
    }
    const bounded = trimOutput(diff, this.config.maxDiffBytes)
    return { path: safePath, diff: bounded.text, truncated: truncated || bounded.truncated }
```

</details>

**依据 3 · 源码核查**：[src/runtime.ts:551-588](https://github.com/PivotStackIntelligence/dsh-github/blob/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a/src/runtime.ts#L551-L588)

可逆和不可逆操作区分。

<details>
<summary>查看原文（38行）</summary>

```text
  async discard(path: string, filePath: string, signal?: AbortSignal): Promise<GitStatus> {
    const root = await this.root(path, signal)
    const safePath = validateFilePath(root, filePath)
    const statusOutput = await this.git(['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', safePath], { cwd: root, signal, maxBuffer: this.statusMaxBuffer() })
    const file = parseStatus(statusOutput, 1, () => null).files.find(entry => entry.path === safePath)
    if (file?.kind === 'untracked') {
      await rm(resolve(root, safePath), { recursive: true, force: true })
      this.invalidateRootCache()
    } else {
      await this.write(['restore', '--', safePath], { cwd: root, signal })
    }
    return this.getStatus(root, signal)
  }

  /** Discard every working-tree change, optionally removing untracked files, and return fresh status. */
  @Remote
  async discardAll(path: string, includeUntracked: boolean, signal?: AbortSignal): Promise<GitStatus> {
    const root = await this.root(path, signal)
    await this.write(['restore', '--', '.'], { cwd: root, signal })
    if (includeUntracked) await this.write(['clean', '-fd'], { cwd: root, signal })
    return this.getStatus(root, signal)
  }

  /** Commit staged changes with an explicit message and return fresh status. */
  @Remote
  async commit(path: string, message: string, amend: boolean, signal?: AbortSignal): Promise<GitStatus> {
    const root = await this.root(path, signal)
    const checked = commitMessageSchema.parse(message)
    await this.write(amend ? ['commit', '--amend', '-m', checked] : ['commit', '-m', checked], { cwd: root, signal })
    return this.getStatus(root, signal)
  }

  /** Reset the last commit softly, preserving changes in the index, and return fresh status. */
  @Remote
  async undoLastCommit(path: string, signal?: AbortSignal): Promise<GitStatus> {
    const root = await this.root(path, signal)
    await this.write(['reset', '--soft', 'HEAD~1'], { cwd: root, signal })
    return this.getStatus(root, signal)
```

</details>

**依据 4 · 源码核查**：[src/runtime.ts:645-654](https://github.com/PivotStackIntelligence/dsh-github/blob/f9cb4aa8499f3304ea1dd28cfc6c05766eb3ee5a/src/runtime.ts#L645-L654)

部分成功验收点。

<details>
<summary>查看原文（10行）</summary>

```text
  /** Pull then push without force. */
  @Remote
  async sync(path: string, signal?: AbortSignal): Promise<GitStatus> {
    const status = await this.getStatus(path, signal)
    if (status.branch.startsWith('HEAD ')) throw new Error('dsh-github: cannot sync a detached HEAD')
    if (status.remoteName === null || status.remoteUrl === null) throw new Error('dsh-github: a fetch remote is not configured')
    if (status.pushRemoteName === null || status.pushRemoteUrl === null) throw new Error('dsh-github: a push remote is not configured')
    if (status.upstream !== null) await this.write(['pull', '--no-edit'], { cwd: status.root, signal })
    await this.write(status.upstream === null ? ['push', '-u', status.pushRemoteName, status.branch] : ['push'], { cwd: status.root, signal })
    return this.getStatus(status.root, signal)
```

</details>

#### 缺口

- 没有真实任务效率和恢复演练
  **影响**：尚不能保证实际节时或状态一致
  **进一步探讨**：执行上述隔离对照，记录错误状态和人工恢复

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
