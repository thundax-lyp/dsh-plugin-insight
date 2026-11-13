# dsh-workbench-plugin

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[421282d](https://github.com/loadingvx/deepseek-harness-workbench-plugin/tree/421282dc771c72ccf5fac60d70e3d6571a4e62e3)

<!-- BEGIN META -->
[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/loadingvx/deepseek-harness-workbench-plugin) [![npm 30d 720](https://img.shields.io/static/v1?label=npm+30d&message=720&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-workbench-plugin) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-workbench-plugin)
<!-- END META -->

> **功能**：在 DSH Web 聊天旁提供文件编辑、Git、终端及会话控制。

> **亮点**：[Q01](#research-q01) 把 Web 会话与实际工作区和 Git 操作接起来。[Q03](#research-q03) 会话设置绑定到真实代理事件。

> **主要限制**：[Q02](#research-q02) 通用 Host 路由和已认证文件传输的身份检查有区别，PTY 还会继承环境。[Q03](#research-q03) 控制面会修改提示词，浏览代理发起 Host 网络请求。

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
  - [Q01 · 工作台怎样把 DSH 会话与实际的文件和 Git 操作接起来？](#detail-section-11)
  - [Q02 · 文件、Git 和真实终端由哪些权限边界约束？](#detail-section-12)
  - [Q03 · 控制面和浏览器代理实际改变哪些状态？](#detail-section-13)
  - [Q04 · 采用前怎样验证权限和工作流收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH Web 与代理协作的开发者需要查看修改、处理本地代码和 Git。

原生 DSH 会话配合独立 IDE 和 Git CLI，操作者在各入口分别管理会话和本机工作区。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 文件及 Git | 编辑、查看差异及提交 | 依赖配置的工作区及 Git |
| PTY | 执行交互 shell | Host 进程权限和环境 |
| 代理控制 | 模型、提示词及工具限制 | 检查会话访问控制 |
| 浏览代理 | 查看和选取网页元素 | Host 发起请求，核对网络边界 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web 和 Node | 必需 | Host 与客户端注册 | 检查注入服务和 Node 声明 |
| 本机 Git | Git 功能必需 | 查看变更和提交 | 使用已知测试仓或本机 CLI |
| node-pty | 终端必需 | 启动实际 shell | 核对平台二进制及错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 操作者在无凭证的独立测试 Host 配置仓库 | 确认两个隔离会话和测试用户 |
| 编辑 | 打开文件，做可撤销修改及本地 commit | 文件和 diff 一致 |
| 权限与退出 | 检查跨会话请求及卸载 | 未授权请求拒绝，受管进程结束 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 测试 Host 和原生依赖 | 核对版本及权限 | 安装时间未测 |
| 持续 | 终端进程及代理内存 | 维护适配和身份配置 | 跨工具节时未测 |
| 失败 | 隔离环境和恢复时间 | 退出终端、还原临时仓 | 进程回收待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 集中操作 | 真实文件和 Git 路由 | 相对 IDE 和 CLI 的效率 |
| 会话控制 | 设置接入代理运行机制 | 多会话权限及稳定性 |

> **思考**：[Q02](#research-q02) 通用 Host 路由和已认证文件传输的身份检查有区别，PTY 还会继承环境。[Q03](#research-q03) 控制面会修改提示词，浏览代理发起 Host 网络请求。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把 Web 会话与实际工作区和 Git 操作接起来。[Q03](#research-q03) 会话设置绑定到真实代理事件。

文件 API 使用路径边界，PTY 运行真实 shell。会话设置经 Host 事件生效。卸载有终端清理回调。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 通用 Host 路由和已认证文件传输的身份检查有区别，PTY 还会继承环境。[Q03](#research-q03) 控制面会修改提示词，浏览代理发起 Host 网络请求。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先验 Host 权限、网络和进程退出，再用同一份本地修改与 IDE／CLI 对照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证实真实工作台操作和代理控制。部署认证、网络边界及平台运行结果待验证。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、package.json、src/client/index.ts、src/client/workbench/BrowserView.tsx、src/host/browser-proxy.ts、src/host/control-plane/http.ts、src/host/control-plane/service.ts、src/host/file-transfer/http.ts、src/host/git-service.ts、src/host/http.ts、src/host/terminal.ts、src/host/tools.ts、src/host/workspace-fs.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本 Host、Web、文件、Git、PTY、控制面及浏览代理源码检查。未执行或安装目标。
- 下一步：在无凭证隔离 Host 对照两用户两会话，核查文件、终端、控制面和浏览代理的权限与退出。

**分析版本**

- **仓库**：[loadingvx/deepseek-harness-workbench-plugin](https://github.com/loadingvx/deepseek-harness-workbench-plugin)
- **版本号**：0.1.38（[固定提交 421282d](https://github.com/loadingvx/deepseek-harness-workbench-plugin/tree/421282dc771c72ccf5fac60d70e3d6571a4e62e3)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 以连接身份绑定工作区与会话，对浏览代理另设目标约束，用拒绝率和正常任务开销验证。

在无凭证隔离 Host 对照两用户两会话，核查文件、终端、控制面和浏览代理的权限与退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 1845 | — | — | 25764 |
| .js | source | 2 | 12099 | 11383 | 731 | — |
| .ts | source | 185 | 29003 | 24929 | 1825 | — |
| .tsx | source | 49 | 15694 | 14645 | 274 | — |
| .ts | test | 103 | 11492 | 10296 | 264 | — |
| .md | test | 1 | 240 | — | — | 968 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-13），可前往 [GitHub Issues](https://github.com/loadingvx/deepseek-harness-workbench-plugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH Web 用户能否在聊天旁处理代码和 Git，同时控制 Host 文件、终端及代理配置的权限？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工作台怎样把 DSH 会话与实际的文件和 Git 操作接起来？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合已经在 DSH 会话内协作、又需要查看修改和管理 Git 的开发者。Host 的 apply 实际装配 Git、文件、审阅和控制组件，Web 端向宿主注册会话和侧栏位置。文件和 Git 面板的价值在于减少聊天、编辑器和 shell 来回切换。

与原生 DSH 聊天搭配 IDE、Git CLI 相比，插件把 Host 工作区操作移到 Web 界面。通用 Host 路由从请求中读取 workspaceId 并解析工作区，分别调用文件写入和 Git 操作。推送会检查分支和远端，随后执行真实 Git push。适配依赖 DSH Web 服务、Node 和本机 Git。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:6-31](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/package.json#L6-L31)

声明 Host 和 Web 客户端。

<details>
<summary>查看原文（26行）</summary>

```text
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "cordis.patch.yml",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-tool",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-input-trigger",
        "@deepseek-ai/dsh-client-ui-sidebar-right"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:27-39](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/index.ts#L27-L39)

装配实际能力。

<details>
<summary>查看原文（13行）</summary>

```text
export function apply(ctx: Context): void {
  const git = new GitService()
  const fs = new WorkspaceFs()
  const review = new PendingReviewStore(fs)
  const canvasOpen = new CanvasOpenQueue()
  ctx.effect(() => registerGitHttp(ctx, git, fs, review, undefined, undefined, canvasOpen), 'workbench: http')
  ctx.effect(() => registerControlPlane(ctx), 'workbench: control-plane')
  ctx.effect(() => registerFileTransferHttp(ctx), 'workbench: file transfer')
  ctx.effect(() => registerAgentAssets(ctx, fs), 'workbench: agent-assets')
  ctx.effect(() => registerGitTools(ctx, git), 'workbench: tools')
  ctx.effect(() => registerPendingReview(ctx, review), 'workbench: pending review')
  ctx.effect(() => registerCanvasOpenQueue(ctx, canvasOpen, review), 'workbench: canvas open')
  applyUltraSlash(ctx)
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:86-119](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/client/index.ts#L86-L119)

注册会话和右栏入口。

<details>
<summary>查看原文（34行）</summary>

```text
  ctx.slots.inject('conversation.input.overlay', () => ctx.slots.register({
    name: 'conversation.input.overlay',
    id: 'workbench-host',
    locale: NS,
    inject: () => ({
      ...injected,
      mount: 'host' as const,
      fileRefs,
      browserEls,
      netRefs,
      termRefs,
      editorRefs,
    }),
  }, Workbench))

  ctx.slots.inject('tool.call.toolview', function* () {
    for (const key of ['git_status', 'git_diff', 'git_log', 'git_branch', 'git_commit']) {
      yield ctx.slots.register({
        name: 'tool.call.toolview',
        key,
        locale: NS,
      }, GitToolRow)
    }
  })

  ctx.slots.inject('conversation.chat.turnTail', () => ctx.slots.register({
    name: 'conversation.chat.turnTail',
    id: 'workbench-svg-tail',
    locale: NS,
    select: selectSvgTailGated,
  }, SvgTailView))

  ctx.slots.inject('sidebar.right.tab.files.actions', () => ctx.slots.register({
    name: 'sidebar.right.tab.files.actions',
```

</details>

**依据 4 · 源码核查**：[src/host/http.ts:205-215](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/http.ts#L205-L215)

工作区请求参数和解析。

<details>
<summary>查看原文（11行）</summary>

```text
    const workspaceId = query(url, 'workspaceId')
    const rootOf = (body?: Record<string, unknown>): string => {
      const id = typeof body?.workspaceId === 'string' ? body.workspaceId : workspaceId
      return resolveWorkspacePath(ctx, id)
    }
    const repoOf = (body?: Record<string, unknown>): string | undefined => {
      if (typeof body?.repo === 'string' && body.repo !== '') return body.repo
      return query(url, 'repo')
    }
    const gitRootOf = (body?: Record<string, unknown>): Promise<string> => {
      return resolveNearbyGitPath(rootOf(body), repoOf(body))
```

</details>

**依据 5 · 源码核查**：[src/host/http.ts:352-360](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/http.ts#L352-L360)

真实 Git 写操作路由。

```text
      } else if (method === 'POST' && route === '/git/push') {
        const body = await readJson(req)
        result = await wrap(async () => git.push(await gitRootOf(body), undefined, parsePushMode(body.pushMode)))
      } else if (method === 'POST' && route === '/git/pull') {
        const body = await readJson(req)
        result = await wrap(async () => git.pull(await gitRootOf(body), undefined, parsePullMode(body.pullMode)))
      } else if (method === 'POST' && route === '/git/fetch') {
        const body = await readJson(req)
        result = await wrap(async () => git.fetch(await gitRootOf(body)))
```

**依据 6 · 源码核查**：[src/host/git-service.ts:595-627](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/git-service.ts#L595-L627)

推送的前置检查和执行。

<details>
<summary>查看原文（33行）</summary>

```text
  async push(root: string, signal?: AbortSignal, pushMode: PushMode = 'safe'): Promise<GitPushResult> {
    const mode = parsePushMode(pushMode)
    return this.mutex.run(async () => {
      await this.requireRepo(root, signal)
      let probe = await this.probe(root, signal)
      if (probe.detached) throw new GitError('DETACHED_HEAD')
      if (probe.remote === undefined) throw new GitError('NO_REMOTE')
      if (!probe.hasHead) throw new GitError('NOTHING_TO_PUSH')
      // Use local ahead/behind only; let `git push` reject non-fast-forward (REMOTE_AHEAD).
      if (probe.ahead === 0 && probe.upstream !== undefined) throw new GitError('NOTHING_TO_PUSH')
      const branch = probe.branch
      if (branch === undefined || branch.trim() === '') throw new GitError('BRANCH_MISSING')
      const setUpstream = probe.upstream === undefined
      await runGit({ cwd: root, args: pushArgs(mode, probe.remote, setUpstream), signal, timeoutMs: 90_000 })
      return { remote: probe.remote, branch, setUpstream }
    })
  }

  async pull(root: string, signal?: AbortSignal, pullMode: PullMode = 'merge'): Promise<GitPullResult> {
    const mode = parsePullMode(pullMode)
    return this.mutex.run(async () => {
      await this.requireRepo(root, signal)
      const probe = await this.probe(root, signal)
      if (probe.detached) throw new GitError('DETACHED_HEAD')
      if (probe.remote === undefined) throw new GitError('NO_REMOTE')
      if (probe.upstream === undefined) throw new GitError('NO_UPSTREAM')
      const snapshot = await this.status(root, signal)
      const dirty = snapshot.staged.length + snapshot.unstaged.length + snapshot.untracked.length
      if (dirty > 0) throw new GitError('DIRTY_WORKTREE')
      const branch = probe.branch
      if (branch === undefined || branch.trim() === '') throw new GitError('BRANCH_MISSING')
      try {
        await runGit({ cwd: root, args: pullArgs(mode), signal, timeoutMs: 90_000 })
```

</details>

#### 缺口

- 未测相同 Host 版本的加载及面板联动
  **影响**：集成价值有源码支持，实际可用性待验证
  **进一步探讨**：在隔离测试仓打开文件、修改、查看 diff 并做本地 commit

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件、Git 和真实终端由哪些权限边界约束？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

文件模块对工作区和目标做真实路径检查，处理新增文件的父目录，能约束文件 API 的目标。交互终端在工作区启动本机 shell，默认继承 Host 环境，输入写入 PTY。初始 cwd 不限制 shell 可读写的路径。卸载回调关闭受管终端。Git 模型工具的 pre-execute 会询问提交，通用 Web 路由独立处理 Git 请求。

文件传输路由显式拒绝缺少连接身份的请求，并从会话绑定工作区。通用 Web 文件和终端处理器可见 Host、路径和工作区解析，源码未发现等价的插件级连接与对象授权。是否能从未授权客户端命中这些处理器仍取决于真实宿主监听、认证与部署方式。远程或共享宿主采用前需要验证这一差异。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/workspace-fs.ts:67-114](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/workspace-fs.ts#L67-L114)

文件路径边界。

<details>
<summary>查看原文（48行）</summary>

```text
 * Jail check after realpath. Must not use the caller-facing `root` string:
 * macOS tmpdir is often `/var/folders/...` → `/private/var/...`; WSL bind
 * mounts and workspace-root symlinks have the same shape. `relative(symlink, real)`
 * then starts with `..` and a legitimate file looks like an escape.
 *
 * Windows/WSL extra: `relative()` of different drives returns an absolute path,
 * not `..`. A first path segment of `..` is the escape; a file named `..foo` is not.
 */
function leavesWorkspace(rootReal: string, candidate: string): boolean {
  const rel = relative(rootReal, candidate)
  if (rel === '') return false
  if (isAbsolute(rel)) return true
  return rel.split(/[/\\]/)[0] === '..'
}

async function canonicalRoot(root: string): Promise<string> {
  try {
    return await realpath(root)
  } catch (error) {
    if (isNotFound(error)) throw new GitError('FS_NOT_FOUND')
    throw new GitError('INVALID_PATH')
  }
}

async function resolveInside(root: string, rel: string): Promise<string> {
  const rootReal = await canonicalRoot(root)
  const full = rel === '' ? rootReal : join(rootReal, rel)
  let real: string
  try {
    real = await realpath(full)
  } catch (error) {
    if (isNotFound(error)) {
      if (rel === '') throw new GitError('FS_NOT_FOUND')
      const parent = dirname(full)
      try {
        const parentReal = await realpath(parent)
        if (leavesWorkspace(rootReal, parentReal)) throw new GitError('INVALID_PATH')
        return join(parentReal, basename(rel))
      } catch (inner) {
        if (inner instanceof GitError) throw inner
        throw new GitError('FS_NOT_FOUND')
      }
    }
    throw new GitError('INVALID_PATH')
  }
  if (leavesWorkspace(rootReal, real)) throw new GitError('INVALID_PATH')
  return real
}
```

</details>

**依据 2 · 源码核查**：[src/host/http.ts:155-173](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/http.ts#L155-L173)

通用 Host 路由的入口校验。

<details>
<summary>查看原文（19行）</summary>

```text
  const server = ctx.webServer
  if (server === undefined) {
    throw new Error('dsh-workbench-plugin: 需要 webServer 才能提供工作台接口，请把本插件装到 web profile。')
  }

  const handler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const host = req.headers.host ?? '127.0.0.1'
    const url = new URL(req.url ?? '/git', `http://${host}`)
    const route = url.pathname.replace(/\/+$/, '') || '/git'
    const method = (req.method ?? 'GET').toUpperCase()

    if (method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    if (method === 'GET' && route === '/git/browser/inspect.js') {
      res.statusCode = 200
```

</details>

**依据 3 · 源码核查**：[src/host/http.ts:469-505](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/http.ts#L469-L505)

文件写入与终端输入路由。

<details>
<summary>查看原文（37行）</summary>

```text
      } else if (method === 'POST' && route === '/git/fs/write') {
        const body = await readJson(req)
        const path = typeof body.path === 'string' ? body.path : ''
        const content = typeof body.content === 'string' ? body.content : null
        if (path === '' || content === null) {
          result = fail('BAD_REQUEST')
        } else {
          result = await wrap(() => fs.write(rootOf(body), path, content))
        }
      } else if (method === 'GET' && route === '/git/fs/editors') {
        result = await wrap(() => editors.list())
      } else if (method === 'POST' && route === '/git/fs/open') {
        const body = await readJson(req)
        const path = typeof body.path === 'string' ? body.path : ''
        const app = typeof body.app === 'string' ? body.app : undefined
        result = await wrap(() => editors.open(rootOf(body), path, app))
      } else if (method === 'GET' && route === '/git/term/stream') {
        const id = workspaceId
        if (id === undefined) {
          result = fail('NO_WORKSPACE')
        } else {
          const cols = Number(query(url, 'cols') ?? '80')
          const rows = Number(query(url, 'rows') ?? '24')
          await term.attach(id, rootOf(), res, cols, rows, sanitizeTermId(query(url, 'termId')))
          return
        }
      } else if (method === 'POST' && route === '/git/term/write') {
        const body = await readJson(req)
        const data = typeof body.data === 'string' ? body.data : ''
        result = await wrap(() => term.write(
          typeof body.workspaceId === 'string' ? body.workspaceId : workspaceId ?? '',
          rootOf(body),
          data,
          80,
          24,
          sanitizeTermId(body.termId),
        ))
```

</details>

**依据 4 · 源码核查**：[src/host/terminal.ts:303-314](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/terminal.ts#L303-L314)

输入转发到 PTY。

<details>
<summary>查看原文（12行）</summary>

```text
    res.on('error', drop)
  }

  async write(workspaceId: string, cwd: string, data: string, cols = DEFAULT_COLS, rows = DEFAULT_ROWS, termId?: string): Promise<{ ok: true }> {
    if (data.length > MAX_WRITE) throw new GitError('BAD_REQUEST')
    const session = await this.ensure(workspaceId, cwd, cols, rows, termId)
    session.pty.write(data)
    return { ok: true }
  }

  async resize(workspaceId: string, cwd: string, cols: number, rows: number, termId?: string): Promise<{ ok: true; cols: number; rows: number }> {
    const nextCols = clampSize(cols, 10, 400, DEFAULT_COLS)
```

</details>

**依据 5 · 源码核查**：[src/host/terminal.ts:372-390](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/terminal.ts#L372-L390)

真实 shell 与环境继承。

<details>
<summary>查看原文（19行）</summary>

```text
  private async ensure(workspaceId: string, cwd: string, cols: number, rows: number, termId?: string): Promise<Session> {
    const key = this.key(workspaceId, termId)
    const existing = this.sessions.get(key)
    if (existing !== undefined && existing.cwd === cwd) return existing
    if (existing !== undefined) this.kill(key)
    const shell = await pickShell(this.deps.env ?? process.env, this.deps.exists)
    const spawnPty = this.deps.spawnPty ?? defaultSpawnPty
    const nextCols = clampSize(cols, 10, 400, DEFAULT_COLS)
    const nextRows = clampSize(rows, 4, 200, DEFAULT_ROWS)
    const pty = await spawnPty(shell, cwd, nextCols, nextRows, this.deps.env ?? process.env)
    const session: Session = {
      cwd, shell, pty, buffer: '', cols: nextCols, rows: nextRows, listeners: new Set(),
    }
    this.sessions.set(key, session)
    pty.onData((chunk) => {
      this.emit(session, { type: 'out', text: chunk })
    })
    pty.onExit((event) => {
      if (this.sessions.get(key) !== session) return
```

</details>

**依据 6 · 源码核查**：[src/host/http.ts:548-555](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/http.ts#L548-L555)

卸载时关闭终端。

```text
    send(res, result.ok ? 200 : 400, result)
  }

  const dispose = server.register({ kind: 'prefix', path: '/git', handler })
  return () => {
    term.disposeAll()
    dispose()
  }
```

**依据 7 · 源码核查**：[src/host/file-transfer/http.ts:60-90](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/file-transfer/http.ts#L60-L90)

传输路由显式校验连接。

<details>
<summary>查看原文（31行）</summary>

```text
export function registerFileTransferHttp(ctx: Context): () => void {
  const server = ctx.webServer
  if (server === undefined || typeof server.register !== 'function') return () => {}
  const disposers: Array<() => void> = []

  const route = (action: TransferAction) => async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
      // Resolved per request: this plugin does not inject `connection`, and an effect can run
      // before the fence is published. Missing fence means refused, never unguarded.
      const connection = ctx.get('connection') as ConnectionGate | undefined
      if (connection === undefined || typeof connection.requestRejection !== 'function') throw new GitError('AUTH_REQUIRED')
      const sessions = ctx.get('sessions') as SessionRegistry | undefined
      const rejection = connection.requestRejection(req)
      if (rejection !== undefined) throw new GitError('AUTH_REQUIRED')
      const method = (req.method ?? 'GET').toUpperCase()
      if (method !== (action === 'upload' ? 'POST' : 'GET')) throw new GitError('BAD_REQUEST')
      const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'transfer.invalid'}`)
      const sessionId = url.searchParams.get('sessionId')
      const root = sessionId === null || sessions === undefined ? undefined : sessions.get(sessionId)?.header?.cwd
      if (root === undefined) throw new GitError('UNKNOWN_WORKSPACE')
      const path = assertTransferPath(url.searchParams.get('path') ?? '')
      if (action === 'sizes') {
        const value = await listFileSizes(root, path)
        res.statusCode = 200
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.setHeader('cache-control', 'no-store')
        res.end(JSON.stringify({ ok: true, value }))
        return
      }
      if (action === 'upload') {
        const value = await uploadFile(req, root, path)
```

</details>

**依据 8 · 源码核查**：[src/host/tools.ts:121-159](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/tools.ts#L121-L159)

模型 Git 工具单独请求许可。

<details>
<summary>查看原文（39行）</summary>

```text

  const disposeCommit = ctx.tools.register(defineTool({
    name: 'git_commit',
    description: 'Create a git commit from already-staged files. Requires a non-empty message. Does not stage, delete, restore, reset, push, or amend. The user must approve this call.',
    parameters: {
      message: { type: 'string', required: true, description: 'Commit message' },
    },
    output: {
      schema: { type: 'object', additionalProperties: true, properties: {} },
      render: (_args, value) => text(value),
    },
    async execute(args, exec) {
      try {
        if (typeof args.message !== 'string') throw new GitError('EMPTY_MESSAGE')
        return { ok: true, ...(await git.commit(cwdOf(ctx, exec), args.message, exec.signal)) }
      } catch (error) {
        return failPayload(error)
      }
    },
    presentCall: (args) => ({
      card: 'generic',
      title: 'Git 提交',
      content: typeof args.message === 'string' ? args.message : '',
    }),
  }))

  const offAsk = ctx.on('tools/pre-execute', async (exec, next) => {
    const call = exec as ToolRunContext
    if (call.name !== 'git_commit') return (next as () => unknown)()
    return { kind: 'ask', reason: '提交会写入 Git 历史。请确认提交说明和已暂存文件后再允许。' }
  })

  return () => {
    disposeStatus()
    disposeDiff()
    disposeLog()
    disposeBranch()
    disposeCommit()
    offAsk()
```

</details>

#### 缺口

- 缺少相同 DSH 版本的访问矩阵与退出观察
  **影响**：无法确定哪些客户端可触达 Host 文件和进程
  **进一步探讨**：用无凭证测试 Host 覆盖未登录、跨会话和合法用户，再检查卸载进程

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 控制面和浏览器代理实际改变哪些状态？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

控制面按 sessionId 更新模型选择、工具拒绝、提示词附录和步骤阻止，并对会话重新绑定。服务在模型与工具事件中读取设置，提示词附录进入代理的 system prompt 片段。路由自身没有显示与文件传输等价的连接身份和会话归属校验，仍要核查宿主上游是否有拦截。

浏览代理从 Host 请求 URL 并跟随重定向，读取响应后检查大小，再回传或包装内容。Web iframe sandbox 限制网页在浏览器中的权限。需要分别核对 Host 可达的地址、重定向的最终目标和响应内存，浏览器属性没有覆盖这些 Host 行为。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/control-plane/http.ts:54-110](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/control-plane/http.ts#L54-L110)

控制面的会话更新入口。

<details>
<summary>查看原文（57行）</summary>

```text
export function registerControlPlane(ctx: Context): () => void {
  const server = ctx.webServer
  if (server === undefined || typeof server.register !== 'function') {
    return () => {}
  }

  const store = new ControlPlaneKnobStore()
  const service = new ControlPlaneService(ctx, store)
  const unwire = service.wire()

  const handler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const host = req.headers.host ?? '127.0.0.1'
    const url = new URL(req.url ?? '/git/control-plane', `http://${host}`)
    const route = url.pathname.replace(/\/+$/, '') || '/git/control-plane'
    const method = (req.method ?? 'GET').toUpperCase()

    if (method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    let result: GitResult<unknown>
    try {
      if (method === 'GET' && route === '/git/control-plane') {
        const sessionId = query(url, 'sessionId')
        result = { ok: true, value: await service.snapshot(sessionId) }
      } else if (method === 'GET' && route === '/git/control-plane/trajectory') {
        const sessionId = query(url, 'sessionId')
        result = { ok: true, value: await buildHostTrajectory(ctx, sessionId) }
      } else if (method === 'POST' && route === '/git/control-plane/knobs') {
        const body = await readJson(req)
        const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : ''
        if (sessionId === '') {
          result = fail('BAD_REQUEST', '缺少 sessionId。请先打开左侧会话，再调整控制面旋钮。')
        } else {
          const patch: ControlPlaneKnobPatch = {}
          if (body.reset === true) patch.reset = true
          if (Object.prototype.hasOwnProperty.call(body, 'modelOverride')) {
            patch.modelOverride = body.modelOverride as ControlPlaneKnobPatch['modelOverride']
          }
          if (Object.prototype.hasOwnProperty.call(body, 'toolDeny')) {
            patch.toolDeny = body.toolDeny as string[]
          }
          if (typeof body.promptAppend === 'string') patch.promptAppend = body.promptAppend
          if (typeof body.preStepReject === 'boolean') patch.preStepReject = body.preStepReject
          const knobs = store.patch(sessionId, patch)
          service.rebind(sessionId)
          result = { ok: true, value: { knobs, snapshot: await service.snapshot(sessionId) } }
        }
      } else {
        result = fail('BAD_REQUEST', '未知的控制面接口。')
      }
    } catch (error) {
      result = toFail(error)
    }
    send(res, result.ok ? 200 : 400, result)
```

</details>

**依据 2 · 源码核查**：[src/host/control-plane/service.ts:235-269](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/control-plane/service.ts#L235-L269)

模型覆盖、步骤拒绝和工具拒绝。

<details>
<summary>查看原文（35行）</summary>

```text
    disposers.push(this.ctx.on('agent/request', async (payload: unknown, next: () => Promise<unknown>) => {
      const config = await next()
      const agent = (payload as { agent?: LiveAgent } | undefined)?.agent
      if (agent === undefined || typeof agent.id !== 'string') return config
      const override = this.store.get(agent.id).modelOverride
      if (override === null) return config
      if (typeof config !== 'object' || config === null) {
        return { provider: override.provider, model: override.model }
      }
      return { ...(config as Record<string, unknown>), provider: override.provider, model: override.model }
    }) as () => void)

    disposers.push(this.ctx.on('agent/pre-step', async (payload: unknown, next: () => Promise<unknown>) => {
      const agent = (payload as { agent?: LiveAgent } | undefined)?.agent
      if (agent !== undefined && typeof agent.id === 'string' && this.store.get(agent.id).preStepReject) {
        return { kind: 'reject' }
      }
      return next()
    }) as () => void)

    disposers.push(this.ctx.on('tools/pre-execute', async (payload: unknown, next: () => Promise<unknown>) => {
      const exec = payload as { name?: string; agent?: LiveAgent } | undefined
      const agent = exec?.agent
      const name = exec?.name
      if (agent === undefined || typeof agent.id !== 'string' || typeof name !== 'string') {
        return next()
      }
      if (this.store.get(agent.id).toolDeny.includes(name)) {
        return {
          kind: 'deny',
          reason: `智能体控制面已禁用工具「${name}」。可在工作台控制面面板中重新启用。`,
        }
      }
      return next()
    }) as () => void)
```

</details>

**依据 3 · 源码核查**：[src/host/control-plane/service.ts:286-315](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/control-plane/service.ts#L286-L315)

会话重绑及提示词。

<details>
<summary>查看原文（30行）</summary>

```text
  /** Apply latest knobs to a live agent (scoped restrict + prompt section). */
  rebind(sessionId: string): void {
    this.clearBinder(sessionId)
    const agents = asAgents(this.ctx)
    const agent = agents?.get(sessionId)
    if (agent === undefined) return
    const knobs = this.store.get(sessionId)
    const local: Array<() => void> = []

    const tools = asTools(agent.ctx)
    if (knobs.toolDeny.length > 0 && typeof tools?.restrict === 'function') {
      try {
        local.push(tools.restrict({ deny: knobs.toolDeny }))
      } catch {
        /* unknown tool names / unscoped — waterfall deny still applies */
      }
    }

    const prompt = asSystemPrompt(agent.ctx)
    const text = knobs.promptAppend.trim()
    if (text !== '' && typeof prompt?.section === 'function') {
      try {
        local.push(prompt.section({
          name: 'workbench:control-plane',
          order: 250,
          text,
        }))
      } catch {
        /* duplicate name under hot reload — ignore */
      }
```

</details>

**依据 4 · 源码核查**：[src/host/http.ts:180-202](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/http.ts#L180-L202)

浏览路由解析目标并阻止直接访问自身。

<details>
<summary>查看原文（23行）</summary>

```text
    if (method === 'GET' && route === '/git/browser/view') {
      const target = readBrowserViewTarget(req.url ?? '')
      if (target === null) {
        sendHtml(res, 400, browserFailPage(fail('BROWSER_BAD_URL')))
        return
      }
      const selfHref = workbenchHrefFromHost(host)
      if (isWorkbenchSelfUrl(target, selfHref)) {
        sendHtml(res, 400, browserFailPage(fail('BROWSER_SELF'), target))
        return
      }
      const ua = typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : undefined
      try {
        const page = await fetchBrowserPage(target, ua)
        if (!page.ok) {
          sendHtml(res, 502, browserFailPage(page.fail, page.url ?? target))
          return
        }
        sendHtml(res, 200, injectBrowserHooks(page.body, page.url))
      } catch (error) {
        sendHtml(res, 502, browserFailPage(toFail(error), target))
      }
      return
```

</details>

**依据 5 · 源码核查**：[src/host/browser-proxy.ts:101-131](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/browser-proxy.ts#L101-L131)

Host 跟随重定向并读全量响应。

<details>
<summary>查看原文（31行）</summary>

```text
async function fetchPage(
  url: string,
  userAgent: string | undefined,
  signal: AbortSignal,
): Promise<{ url: string; contentType: string; body: Buffer }> {
  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    signal,
    headers: requestHeaders(userAgent),
  })
  const finalUrl = normalizeBrowserUrl(response.url) ?? url
  const contentType = headerOf(response.headers, 'content-type') || 'text/html; charset=utf-8'
  const body = Buffer.from(await response.arrayBuffer())
  return { url: finalUrl, contentType, body }
}

export async function fetchBrowserPage(
  rawUrl: string,
  userAgent?: string,
): Promise<{ ok: true; url: string; contentType: string; body: string } | { ok: false; fail: GitFail; url?: string }> {
  const url = normalizeBrowserUrl(rawUrl)
  if (url === null) return { ok: false, fail: fail('BROWSER_BAD_URL') }
  const controller = new AbortController()
  const timer = setTimeout(() => { controller.abort() }, FETCH_TIMEOUT_MS)
  try {
    const page = await fetchPage(url, userAgent, controller.signal)
    const finalUrl = page.url
    if (page.body.byteLength > MAX_HTML_BYTES) {
      return { ok: false, fail: fail('BROWSER_TOO_LARGE'), url: finalUrl }
    }
```

</details>

**依据 6 · 源码核查**：[src/client/workbench/BrowserView.tsx:370-380](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/client/workbench/BrowserView.tsx#L370-L380)

客户端 iframe 约束。

<details>
<summary>查看原文（11行）</summary>

```text
          <iframe
            ref={frameRef}
            key={src}
            className={css.frame}
            title={t('browser.frame')}
            src={src}
            sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
            referrerPolicy="no-referrer"
            onLoad={() => {
              if (inspectRef.current) postInspect(true)
              frameRef.current?.contentWindow?.postMessage(
```

</details>

#### 缺口

- 未验证不同身份、内网目标和重定向时的实际响应
  **影响**：无法确定部署的会话权限和网络暴露范围
  **进一步探讨**：在无敏感数据的隔离 Host 用两个测试会话和本地假服务记录拒绝与命中

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用前怎样验证权限和工作流收益？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

当前观察。先准备无凭证的临时 Host 和测试 Git 仓，验证登录和会话归属检查、PTY 的环境和退出、浏览代理重定向。再与原生 DSH 加 IDE／CLI 对照完成同一次本地修改、审阅和提交，记录跨工具次数、错误和清理时间。若无法证明未授权请求被拒绝、退出时进程可回收，维持现有工具链。

可验证的改进是让文件、PTY 和控制面统一按已认证主体绑定目标工作区或会话，给浏览代理独立的网络约束，再与现有处理器比较越权请求拒绝率和正常流程开销。终端操作需要覆盖环境继承及进程回收。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/file-transfer/http.ts:60-90](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/file-transfer/http.ts#L60-L90)

现有连接认证可作比较基准。

<details>
<summary>查看原文（31行）</summary>

```text
export function registerFileTransferHttp(ctx: Context): () => void {
  const server = ctx.webServer
  if (server === undefined || typeof server.register !== 'function') return () => {}
  const disposers: Array<() => void> = []

  const route = (action: TransferAction) => async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
      // Resolved per request: this plugin does not inject `connection`, and an effect can run
      // before the fence is published. Missing fence means refused, never unguarded.
      const connection = ctx.get('connection') as ConnectionGate | undefined
      if (connection === undefined || typeof connection.requestRejection !== 'function') throw new GitError('AUTH_REQUIRED')
      const sessions = ctx.get('sessions') as SessionRegistry | undefined
      const rejection = connection.requestRejection(req)
      if (rejection !== undefined) throw new GitError('AUTH_REQUIRED')
      const method = (req.method ?? 'GET').toUpperCase()
      if (method !== (action === 'upload' ? 'POST' : 'GET')) throw new GitError('BAD_REQUEST')
      const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'transfer.invalid'}`)
      const sessionId = url.searchParams.get('sessionId')
      const root = sessionId === null || sessions === undefined ? undefined : sessions.get(sessionId)?.header?.cwd
      if (root === undefined) throw new GitError('UNKNOWN_WORKSPACE')
      const path = assertTransferPath(url.searchParams.get('path') ?? '')
      if (action === 'sizes') {
        const value = await listFileSizes(root, path)
        res.statusCode = 200
        res.setHeader('content-type', 'application/json; charset=utf-8')
        res.setHeader('cache-control', 'no-store')
        res.end(JSON.stringify({ ok: true, value }))
        return
      }
      if (action === 'upload') {
        const value = await uploadFile(req, root, path)
```

</details>

**依据 2 · 源码核查**：[src/host/http.ts:469-505](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/http.ts#L469-L505)

文件与终端矩阵的目标。

<details>
<summary>查看原文（37行）</summary>

```text
      } else if (method === 'POST' && route === '/git/fs/write') {
        const body = await readJson(req)
        const path = typeof body.path === 'string' ? body.path : ''
        const content = typeof body.content === 'string' ? body.content : null
        if (path === '' || content === null) {
          result = fail('BAD_REQUEST')
        } else {
          result = await wrap(() => fs.write(rootOf(body), path, content))
        }
      } else if (method === 'GET' && route === '/git/fs/editors') {
        result = await wrap(() => editors.list())
      } else if (method === 'POST' && route === '/git/fs/open') {
        const body = await readJson(req)
        const path = typeof body.path === 'string' ? body.path : ''
        const app = typeof body.app === 'string' ? body.app : undefined
        result = await wrap(() => editors.open(rootOf(body), path, app))
      } else if (method === 'GET' && route === '/git/term/stream') {
        const id = workspaceId
        if (id === undefined) {
          result = fail('NO_WORKSPACE')
        } else {
          const cols = Number(query(url, 'cols') ?? '80')
          const rows = Number(query(url, 'rows') ?? '24')
          await term.attach(id, rootOf(), res, cols, rows, sanitizeTermId(query(url, 'termId')))
          return
        }
      } else if (method === 'POST' && route === '/git/term/write') {
        const body = await readJson(req)
        const data = typeof body.data === 'string' ? body.data : ''
        result = await wrap(() => term.write(
          typeof body.workspaceId === 'string' ? body.workspaceId : workspaceId ?? '',
          rootOf(body),
          data,
          80,
          24,
          sanitizeTermId(body.termId),
        ))
```

</details>

**依据 3 · 源码核查**：[src/host/control-plane/http.ts:73-110](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/control-plane/http.ts#L73-L110)

可构建跨会话更新矩阵。

<details>
<summary>查看原文（38行）</summary>

```text
      return
    }

    let result: GitResult<unknown>
    try {
      if (method === 'GET' && route === '/git/control-plane') {
        const sessionId = query(url, 'sessionId')
        result = { ok: true, value: await service.snapshot(sessionId) }
      } else if (method === 'GET' && route === '/git/control-plane/trajectory') {
        const sessionId = query(url, 'sessionId')
        result = { ok: true, value: await buildHostTrajectory(ctx, sessionId) }
      } else if (method === 'POST' && route === '/git/control-plane/knobs') {
        const body = await readJson(req)
        const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : ''
        if (sessionId === '') {
          result = fail('BAD_REQUEST', '缺少 sessionId。请先打开左侧会话，再调整控制面旋钮。')
        } else {
          const patch: ControlPlaneKnobPatch = {}
          if (body.reset === true) patch.reset = true
          if (Object.prototype.hasOwnProperty.call(body, 'modelOverride')) {
            patch.modelOverride = body.modelOverride as ControlPlaneKnobPatch['modelOverride']
          }
          if (Object.prototype.hasOwnProperty.call(body, 'toolDeny')) {
            patch.toolDeny = body.toolDeny as string[]
          }
          if (typeof body.promptAppend === 'string') patch.promptAppend = body.promptAppend
          if (typeof body.preStepReject === 'boolean') patch.preStepReject = body.preStepReject
          const knobs = store.patch(sessionId, patch)
          service.rebind(sessionId)
          result = { ok: true, value: { knobs, snapshot: await service.snapshot(sessionId) } }
        }
      } else {
        result = fail('BAD_REQUEST', '未知的控制面接口。')
      }
    } catch (error) {
      result = toFail(error)
    }
    send(res, result.ok ? 200 : 400, result)
```

</details>

**依据 4 · 源码核查**：[src/host/terminal.ts:328-355](https://github.com/loadingvx/deepseek-harness-workbench-plugin/blob/421282dc771c72ccf5fac60d70e3d6571a4e62e3/src/host/terminal.ts#L328-L355)

关停与清理观察点。

<details>
<summary>查看原文（28行）</summary>

```text

  async close(workspaceId: string, termId?: string): Promise<{ ok: true }> {
    this.kill(this.key(workspaceId, termId))
    return { ok: true }
  }

  async restart(workspaceId: string, cwd: string, cols = DEFAULT_COLS, rows = DEFAULT_ROWS, termId?: string): Promise<TerminalHello> {
    const key = this.key(workspaceId, termId)
    const existing = this.sessions.get(key)
    const listeners = existing === undefined ? new Set<(event: TerminalEvent) => void>() : new Set(existing.listeners)
    if (existing !== undefined) {
      existing.listeners.clear()
      this.sessions.delete(key)
      try { existing.pty.kill() } catch { /* already gone */ }
    }
    const session = await this.ensure(workspaceId, cwd, cols, rows, termId)
    for (const listener of listeners) session.listeners.add(listener)
    return { cwd: session.cwd, shell: basename(session.shell), cols: session.cols, rows: session.rows }
  }

  disposeAll(): void {
    for (const id of [...this.sessions.keys()]) this.kill(id)
  }

  private kill(key: string): void {
    const session = this.sessions.get(key)
    if (session === undefined) return
    this.sessions.delete(key)
```

</details>

#### 缺口

- 没有同版本权限及任务成本测量
  **影响**：潜在集成增益尚不足以给出试用结论
  **进一步探讨**：先跑登录、会话归属、PTY 回收测试，再比较同任务操作与排障成本

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
