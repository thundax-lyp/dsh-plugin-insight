# DSH SSH

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[971cc3e](https://github.com/zhu1090093659/dsh-web/tree/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh)

<!-- BEGIN META -->
[![GitHub ★ 10,353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 113,274](https://img.shields.io/static/v1?label=npm+30d&message=113%2C274&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh)
<!-- END META -->

> **功能**：为 DSH 提供远端 SSH 主机管理、终端、命令、文件传输和转发。

> **亮点**：把浏览器和模型操作接到同一别名及连接池，终端视图脱离后可由宿主会话承接，见 [Q01](#research-q01)。

> **主要限制**：通道断开没有退出码时，远端可能已执行，重连后重发会产生重复副作用。主机信任也需单独核查，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 同一台远程主机的诊断如何在浏览器与 Agent 间交接？](#detail-section-11)
  - [Q02 · 远程命令断线后，何时会再发一次？](#detail-section-12)
  - [Q03 · 哪一层保护浏览器操作、凭据和远端身份？](#detail-section-13)
  - [Q04 · 为何应先观察，再决定是否把远端诊断纳入常用流程？](#detail-section-14)
  - [Q05 · 增加远端结果未知状态能否减少重复执行？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合需要在 DSH 诊断对话与远端终端间切换的运维人员，见 [Q01](#research-q01)。

使用已审查的 OpenSSH 配置与终端，再把必要的脱敏结果带入 DSH。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 远程命令 | 通过别名执行 | 损坏连接可能重试 |
| 浏览器终端 | 接入宿主 PTY 会话 | HTTP 升级须经过回环门槛 |
| 文件传输与转发 | 移动文件和访问远端服务 | 传输用宿主路径，转发有本地监听 |
| 集群操作 | 向选定多台主机派发 | 工具要求非空筛选 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 与 Node 24.9 及以上 | 启动必需 | 挂载宿主与界面 | 无法使用宿主路由与工具 |
| 低权限远端账户 | 诊断时 | 授权并限制命令 | 需先配置别名并独立验证远端 |
| ssh-agent | 选择 Agent 认证或转发时 | 使用本机签名服务 | 端点缺失明确报错 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 配置一次性远端和测试别名 | 核对目标及信任策略 |
| 核查 | 发一次只读命令并对照终端 | 独立核对输出和主机身份 |
| 退出 | 断线后查远端实际结果 | 保持原终端流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与远端测试机 | 配置别名、权限及身份验证 | 工时未知 |
| 持续 | 远端资源、模型与网络 | 审核输出及主机变更 | 没有单位诊断实测 |
| 失败恢复 | 可能再耗远端执行资源 | 查远端结果再决定操作 | 命令可能已执行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 交接 | 界面和 Agent 共享别名 | 实际减少的切换时间 |
| 远端执行 | 池与工具结果有接线 | 断线后的执行次数 |

> **思考**：通道断开没有退出码时，远端可能已执行，重连后重发会产生重复副作用。主机信任也需单独核查，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把浏览器和模型操作接到同一别名及连接池，终端视图脱离后可由宿主会话承接，见 [Q01](#research-q01)。

连接池区分健康连接上的业务异常和已坏连接，取消有独立处理。重放边界仍需远端结果证明，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

通道断开没有退出码时，远端可能已执行，重连后重发会产生重复副作用。主机信任也需单独核查，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用一次性测试机和只读命令核对远端身份与输出，保持原终端作为复核入口。遇到缺回执先查远端状态，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持 DSH 挂载、连接池、工具、终端及传输。远端主机身份、断线后的命令结果和会话权限需先核查。

- 已检查：作者 README、包清单、源码路径 packages/dsh-ssh/README.md、packages/dsh-ssh/cordis.patch.yml、packages/dsh-ssh/src/index.ts、packages/dsh-ssh/src/routes.ts、packages/dsh-ssh/src/tools.ts、packages/dsh-ssh/src/engine/connection-pool.ts、packages/dsh-ssh/src/store.ts 及固定范围 inventory；组件：packages/dsh-ssh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查双面挂载、主机认证配置、访问、连接池与代表工具；未连远端或复验各系统与跳板。
- 下一步：用可销毁 SSH 主机模拟错误 host key、正常回执及远端写入后断线，单独查远端实际次数。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.16（[固定提交 971cc3e](https://github.com/zhu1090093659/dsh-web/tree/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将已发出但没有退出回执的操作标为结果未知，比较默认停重试后是否更少重复写入，见 [Q05](#research-q05)。

用可销毁 SSH 主机模拟错误 host key、正常回执及远端写入后断线，单独查远端实际次数。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 292 | — | — | 6017 |
| .ts | source | 29 | 6515 | 4523 | 1664 | — |
| .tsx | source | 8 | 1972 | 1570 | 305 | — |
| .ts | test | 23 | 5058 | 3901 | 645 | — |
| .tsx | test | 7 | 1881 | 1417 | 242 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 155](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=155&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 156](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=156&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确定 DSH 如何复用同一 SSH 主机配置，以及凭据、身份验证与断线重放的实际边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 同一台远程主机的诊断如何在浏览器与 Agent 间交接？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对频繁在 DSH 询问远程状态并手工进终端复核的运维人员，统一别名的增量是让 Agent 与人从同一宿主配置选择目标。补丁挂载宿主与客户端，宿主实际注册 HTTP、终端升级和模型工具。终端断开浏览器视图时在宿主保留会话注册，能按 ID 重新附着。用现有 OpenSSH 与独立终端时仍能做同一诊断，还能保留熟悉的授权和已知主机核验流程。合格交付是目标主机和只读输出可独立复核，而非面板可打开。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-ssh/README.md:20-35](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/README.md#L20-L35)

作者说明共用别名与终端能力。

<details>
<summary>查看原文（16行）</summary>

```text
## Capabilities

| Capability | Description |
| --- | --- |
| Host management | CRUD, search, connection test; collapsible grouping by environment / tags with per-group batch test; config stored in `~/.dsh/dsh-ssh.json`; supports key / password / ssh-agent auth (OpenSSH agent, with Pageant still selectable on Windows), passphrase keys, ProxyJump jump hosts (multi-level) and OpenSSH `ProxyCommand` transports (bastion clients) |
| Config import | One-click parse of a standard `~/.ssh/config` (Host/HostName/User/Port/IdentityFile/IdentityAgent/ForwardAgent/ProxyJump/ProxyCommand, `Include` files, blocks without HostName); `ForwardAgent yes|true|on` imports as enabled and `no|false|off` (or no directive) as disabled; skipped blocks are listed with their reason (wildcard pattern, existing alias, Match block, invalid fields) |
| Persistent connection pool | Reuses a long-lived connection per host (opposite of the ssh-skill daemon), automatically disconnects after 30 minutes idle, auto-reconnects on disconnect (up to 3 times) |
| Agent forwarding | Opt-in per host through the `forwardAgent` flag (`ssh -A`); the form has an "Enable agent forwarding" checkbox, the host list shows an agent-forwarding badge for enabled hosts, and `ssh_list` reports `forwardAgent` with a forward column in its table. The endpoint is the host's configured agent path, otherwise `SSH_AUTH_SOCK`, otherwise the native OpenSSH named pipe (`\\.\pipe\openssh-ssh-agent`) on Windows; a host with no local endpoint fails with an explicit error instead of connecting without forwarding. A server that refuses the request (`AllowAgentForwarding no`) surfaces its own error and is never downgraded to a silent non-forwarded session. The flag never touches the stored profile when it is off |
| Command execution | exec with a timeout (default 60s), stdout/stderr separated, output truncation guard (2MB) |
| Web terminal | xterm.js + WebSocket PTY terminal, auto-sizing, real-time output; the panel holds several terminal tabs, each with its own host PTY — switch, close one at a time, run several tabs against the same host, and the "+" control opens another tab on the host the toolbar shows |
| File transfer | SFTP upload (browser file picker, NDJSON progress stream), download (progress bar + browser save); remote directory browsing |
| Port forwarding | Local port-forward tunnel (listens on 127.0.0.1 only) to reach a remote database / intranet service; list / stop supported |
| Cluster execution | One command run concurrently across many hosts (filter by alias / environment / tag, default concurrency 8) |
| Agent tools | `ssh_list` / `ssh_exec` / `ssh_upload` / `ssh_download` / `ssh_tunnel` / `ssh_cluster`; GUI and Agent share the same host config |

The panel loads its contents on first open. Closing and reopening it preserves the selected tab, form drafts and every terminal tab. A terminal tab that is not on screen keeps its remote shell in the Host: the view detaches, and returning to the tab reattaches by session id and replays the host's scrollback into the single xterm. A remote shell that exits keeps its tab and its last screen instead of vanishing, and a tab closed in the background is only removed once the Host confirms the close — a close that cannot be delivered keeps the tab and says so. The tunnel list refreshes every five seconds while its tab, panel and browser page are visible; automatic reads pause when hidden, resume immediately on return, and do not overlap slow reads. Port forwarding itself continues in the Host.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/cordis.patch.yml:6-12](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/cordis.patch.yml#L6-L12)

双面挂载。

```text
# The row is a bare plugin by package name: the node half (exports ".") runs
# in the host process (SSH engine, /api/dsh-ssh routes, agent tools), and the
# `dsh.client` declaration in package.json makes the browser half
# (exports "./client", served at /plugins/<id>/client.js) load in the web GUI.
- insert:
    - id: ssh
      name: '@linxin666/dsh-ssh'
```

**依据 3 · 源码核查**：[packages/dsh-ssh/src/index.ts:219-237](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/index.ts#L219-L237)

实际注册 HTTP、升级和模型工具。

<details>
<summary>查看原文（19行）</summary>

```text
    disposeRoutes = ctx.effect(
      () => {
        const disposers = routes.map(route => ctx.webServer.register(route))
        const upgradeDisposer = ctx.webServer.registerUpgrade(upgrade)
        return () => {
          for (const dispose of disposers) dispose()
          upgradeDisposer()
          // Dropping the routes also ends the terminal sessions they served:
          // a live shell must not outlive the surface that can reach it.
          terminalSessions.dispose()
        }
      },
      'dsh-ssh: routes',
    )
    disposeTools = ctx.effect(
      () => {
        const disposers = tools.map(tool => ctx.tools.register(tool))
        return () => { for (const dispose of disposers) dispose() }
      },
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/routes.ts:452-473](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/routes.ts#L452-L473)

终端按别名或会话 ID 接入注册表。

<details>
<summary>查看原文（22行）</summary>

```text
  // ---------------------------------------------- terminal (upgrade)
  // The shell outlives the view that opened it: a session is created once and
  // any later socket attaches by id, so a panel switch or a dropped socket
  // does not tear the remote shell down (engine/terminal-sessions.ts).
  const terminalSessions = new TerminalSessionRegistry({
    openShell: (alias, size, onKeyboardInteractive) => engine.openShell(alias, size, onKeyboardInteractive),
  })
  const upgrade: WebUpgradeRoute = {
    path: SSH_API.terminal,
    handler: (req, socket, head) => {
      if (!isLoopbackRequest(req)) {
        socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
        socket.destroy()
        return
      }
      const url = new URL(req.url ?? '/', 'http://localhost')
      const alias = queryParam(url, 'alias')
      const sessionId = queryParam(url, 'session')
      if (alias === undefined && sessionId === undefined) {
        socket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n')
        socket.destroy()
        return
```

</details>

#### 缺口

- 插件别名与现有 OpenSSH 主机识别是否一致未验证
  **影响**：影响人和 Agent 交接时的目标确定性
  **进一步探讨**：对同一测试别名核对实际远端身份、输出与断线重接

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 远程命令断线后，何时会再发一次？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具将别名、命令和取消信号转给引擎。连接池复用可用连接。调用异常且连接标记损坏时，可以进入下一次尝试；连接健康的异常直接上抛。通道关闭且未收到退出码会拒绝结果，进入池判断。超时尝试发 KILL、关通道并就地结算，取消也有独立分支，池见到取消会拒绝重放。但没有退出码并不能判断命令是否已经修改远端。业务脚本可能已经完成写入才失去回执，此时恢复连接后重复发命令存在副作用。需要远端任务标识或人工状态确认才能消除歧义。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/tools.ts:145-183](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/tools.ts#L145-L183)

工具把会话取消信号传给引擎。

<details>
<summary>查看原文（39行）</summary>

```text
export function sshExecTool(engine: SshEngine) {
  return defineTool({
    name: 'ssh_exec',
    description: 'Execute a shell command on a REMOTE SSH host by alias; the command runs on the remote host, never on this machine. For commands on this machine, use the local bash tool. Prefer combining independent read-only queries into one command.',
    parameters: {
      alias: { type: 'string', required: true, description: 'Host alias from ssh_list.' },
      command: { type: 'string', required: true, description: 'The shell command to run remotely.' },
      timeoutMs: { type: 'integer', description: 'Remote command execution timeout in milliseconds (default 60000); it starts after the connection is ready. The connection and authentication ceiling is the dsh-ssh connectTimeoutMs setting, not this argument.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          success: { type: 'boolean', required: true },
          exitCode: { oneOf: [{ type: 'integer' }, { type: 'null' }], required: true },
          timedOut: { type: 'boolean', required: true },
          stdout: { type: 'string', required: true },
          stderr: { type: 'string', required: true },
          durationMs: { type: 'integer', required: true },
          error: { type: 'string' },
        },
      },
      render: (_args, value: ExecResult) => text(renderExec(value)),
    },
    async execute(args, exec) {
      try {
        // Forward the caller's cancellation: aborting closes the remote channel
        // instead of leaving the command running on the host.
        return await engine.exec(args.alias, args.command, args.timeoutMs, exec.signal)
      } catch (error) {
        return {
          success: false,
          exitCode: null,
          timedOut: false,
          stdout: '',
          stderr: '',
          durationMs: 0,
          error: error instanceof Error ? error.message : String(error),
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:489-523](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/engine/connection-pool.ts#L489-L523)

仅标记断线的异常进入下一尝试，取消分支退出。

<details>
<summary>查看原文（35行）</summary>

```text
/**
 * Run `fn` with a live client for `alias`, reconnecting (up to the
 * attempt budget) when the connection broke mid-flight.
 */
export async function withClient<T>(engine: PoolEngine, alias: string, fn: (client: Client) => Promise<T>, attempts = 3, signal?: AbortSignal): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let record = engine.pool.get(alias)
    if (record === undefined || record.broken) {
      if (record !== undefined) disposeRecord(engine, alias, record)
      record = await acquire(engine, alias)
    }
    record.idleAt = Date.now()
    record.inFlight += 1
    try {
      const result = await fn(record.client)
      record.idleAt = Date.now()
      return result
    } catch (error) {
      lastError = error
      // A cancelled call is never replayed: the caller asked for it to stop,
      // and a retry would re-run a command that may not be idempotent.
      if (signal?.aborted === true) throw error
      // Retry only when the connection actually broke mid-flight: drop the
      // corpse and let the next attempt reconnect (a reconnect may replay a
      // non-idempotent command — the documented trade-off). A failure on a
      // healthy connection is a logic error and is rethrown, not replayed.
      if (!record.broken) throw error
      disposeRecord(engine, alias, record)
    } finally {
      record.inFlight -= 1
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:583-612](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/engine/connection-pool.ts#L583-L612)

超时、取消与缺退出码分支。

<details>
<summary>查看原文（30行）</summary>

```text
        const timer = setTimeout(() => {
          timedOut = true
          try { stream.signal('KILL') } catch { /* channel gone */ }
          try { stream.close() } catch { /* channel gone */ }
          // Hard deadline: settle now even if the peer never acks the
          // channel close (the stream 'close' handler is then a no-op).
          finish()
        }, budget)
        stream.on('data', (chunk: Buffer) => appendOutput(stdout, chunk, engine.opts.maxOutputBytes))
        stream.stderr.on('data', (chunk: Buffer) => appendOutput(stderr, chunk, engine.opts.maxOutputBytes))
        stream.on('close', (code: number | null) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          // A caller cancellation settles as cancelled, never as a broken
          // connection: the latter would send withClient into a retry that
          // re-runs a command the caller asked to stop.
          if (aborted) {
            resolve(cancelledResult())
            return
          }
          if (typeof code !== 'number' && !timedOut) {
            // The channel closed without an exit status: the connection
            // dropped mid-flight. Reject so withClient can reconnect and
            // retry within the attempt budget.
            reject(new Error('ssh: connection lost mid-flight (channel closed without an exit status)'))
            return
          }
          resolve({
```

</details>

#### 缺口

- 网络错误、远端执行与本地 broken 标志的实际先后未做故障注入
  **影响**：无法保证非幂等命令只执行一次或杀掉远程所有进程
  **进一步探讨**：在一次性主机用计数标记在回执前切断连接并检查变化次数

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪一层保护浏览器操作、凭据和远端身份？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

HTTP 路由与 WebSocket 升级都有回环判断，模型工具则通过 DSH 工具注册进入不同调用面。传输工具接受宿主本机路径，实际交给引擎；配置的密码和密钥口令写用户 JSON，临时文件以 0600 请求创建再重命名，文件权限并不加密。连接配置按密码、Agent 或读私钥构建，启用代理转发时会额外解析端点。所查连接配置未设置 hostVerifier，且作者的已知限制列出导入只覆盖部分 OpenSSH 语义，所以现有终端的主机信任设置不能直接当作插件的凭据。部署时仍需单独验证远端身份和会话可见工具。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/routes.ts:68-97](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/routes.ts#L68-L97)

HTTP 访问门槛。

<details>
<summary>查看原文（30行）</summary>

```text
  /** Guard helper: fence + method check. */
  const guard = (req: IncomingMessage, res: ServerResponse, method: string): boolean => {
    if (!isLoopbackRequest(req)) {
      writeJson(res, 403, { error: 'forbidden: loopback-only' })
      return false
    }
    if (req.method !== method) {
      writeJson(res, 405, { error: `method not allowed: ${req.method}` })
      return false
    }
    return true
  }

  const routes: WebRoute[] = [
    // ------------------------------------------------------------ hosts
    {
      kind: 'exact',
      path: SSH_API.hosts,
      handler: async (req, res) => {
        // One handler per path (the webserver keyed route registry rejects
        // duplicate (kind, path)); dispatch by HTTP method here.
        const method = req.method ?? 'GET'
        if (!isLoopbackRequest(req)) {
          writeJson(res, 403, { error: 'forbidden: loopback-only' })
          return
        }
        const url = new URL(req.url ?? '/', 'http://localhost')
        if (method === 'GET') {
          writeJson(res, 200, { hosts: engine.list(queryParam(url, 'query')) })
          return
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/routes.ts:459-465](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/routes.ts#L459-L465)

升级也走同一判断。

```text
  const upgrade: WebUpgradeRoute = {
    path: SSH_API.terminal,
    handler: (req, socket, head) => {
      if (!isLoopbackRequest(req)) {
        socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
        socket.destroy()
        return
```

**依据 3 · 源码核查**：[packages/dsh-ssh/src/tools.ts:193-218](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/tools.ts#L193-L218)

上传工具把本地路径交引擎。

<details>
<summary>查看原文（26行）</summary>

```text
    name: 'ssh_upload',
    description: 'Transfer a file FROM this machine (the dsh host) TO a remote SSH host. Use this only when the file must be copied to the remote host. Files that stay on this machine are handled with the local file tools (read / write / edit), not ssh_upload.',
    parameters: {
      alias: { type: 'string', required: true, description: 'Host alias from ssh_list.' },
      localPath: { type: 'string', required: true, description: 'Absolute path of the source file on THIS machine (the dsh host) — not a path on the remote host.' },
      remotePath: { type: 'string', required: true, description: 'Absolute destination path on the remote SSH host (parent dirs are created).' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          ok: { type: 'boolean', required: true },
          transferredBytes: { type: 'integer' },
          files: { type: 'integer' },
          error: { type: 'string' },
        },
      },
      render: (_args, value: { ok: boolean; transferredBytes?: number; files?: number; error?: string }) => text(value.ok
        ? `uploaded ${value.files ?? 1} file(s), ${value.transferredBytes ?? 0} bytes`
        : `upload failed: ${value.error ?? 'unknown error'}`),
    },
    async execute(args) {
      try {
        const outcome = await engine.upload(args.alias, args.localPath, args.remotePath, false)
        return { ok: true, transferredBytes: outcome.bytes, files: outcome.files }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/store.ts:395-403](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/store.ts#L395-L403)

JSON 明文落盘和临时文件权限。

```text
  private save(file: StoreFile): void {
    const dir = dirname(this.path)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true, mode: 0o700 })
    const tmp = this.path + '.tmp'
    // Secrets live in this file: keep it readable by the owner only. The
    // tmp file carries the 0600 mode through the rename.
    writeFileSync(tmp, JSON.stringify(file, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 })
    renameSync(tmp, this.path)
    this.cache = undefined
```

**依据 5 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:77-119](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/engine/connection-pool.ts#L77-L119)

构造认证配置并可转发 Agent。

<details>
<summary>查看原文（43行）</summary>

```text
export function buildConnectConfig(entry: SshHostEntry, sock: ConnectConfig['sock'] | undefined, opts: Required<EngineOptions>): ConnectConfig {
  const config: ConnectConfig = {
    host: entry.host,
    port: entry.port,
    username: entry.user,
    readyTimeout: opts.connectTimeoutMs,
    keepaliveInterval: opts.keepaliveIntervalMs,
    keepaliveCountMax: 3,
    tryKeyboard: true,
  }
  if (sock !== undefined) config.sock = sock
  if (entry.auth.kind === 'password') {
    config.password = entry.auth.password
  } else if (entry.auth.kind === 'agent') {
    const agentPath = resolveAgentPath(entry.auth.agentPath)
    if (agentPath === undefined) {
      throw new Error('ssh-agent is not available: set SSH_AUTH_SOCK or configure an agent path (use \'pageant\' for PuTTY Pageant on Windows)')
    }
    config.agent = agentPath
  } else {
    const keyPath = entry.auth.keyPath === undefined ? undefined : expandHome(entry.auth.keyPath)
    if (keyPath === undefined || !existsSync(keyPath)) {
      throw new Error('private key not found: ' + (entry.auth.keyPath ?? '(unset)'))
    }
    config.privateKey = readFileSync(keyPath, 'utf8')
    if (entry.auth.passphrase !== undefined && entry.auth.passphrase !== '') {
      config.passphrase = entry.auth.passphrase
    }
  }
  // Agent forwarding is additive: it never changes how the host
  // authenticates, it only lets this connection broker signatures from the
  // local agent for the remote side (OpenSSH ForwardAgent / ssh -A).
  if (entry.forwardAgent === true) {
    // Agent auth already resolved an endpoint, and reusing it keeps the
    // forwarded agent identical to the one that authenticated.
    const agentPath = typeof config.agent === 'string'
      ? config.agent
      : resolveForwardAgentPath(entry.auth.agentPath)
    if (agentPath === undefined) {
      // ssh2's own message for this case ("You must set a valid agent path to
      // allow agent forwarding") names neither the host nor a way out, so the
      // engine refuses first with an actionable one.
      throw new Error('agent forwarding is enabled for this host but no ssh-agent endpoint is available: '
```

</details>

**依据 6 · 作者声明**：[packages/dsh-ssh/README.md:37-50](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/README.md#L37-L50)

作者说明明文、转发及本机权限边界。

<details>
<summary>查看原文（14行）</summary>

```text
## Security model

- All `/api/dsh-ssh/*` routes are loopback-only (with same-origin checks) — the interfaces that execute commands against remote servers are not exposed to the LAN.
- Passwords / key passphrases are stored in plain text in `~/.dsh/dsh-ssh.json`, file mode 0600, directory 0700 (the same trust model as ssh-skill writing passwords into ssh-config comments).
- ssh-agent auth stores only the agent socket path (or the special value `pageant`); it never reads or stores private-key material. An empty agent path is not a secret and is always saved: it means auto-detect (`SSH_AUTH_SOCK`, then the native OpenSSH named pipe on Windows), so switching a host to SSH Agent takes effect even with the field left blank.
- Agent forwarding is opt-in per host and off by default. With `forwardAgent` enabled, every exec and PTY session on that host asks the server for `auth-agent-req@openssh.com`, which means the remote host can authenticate as this machine with your local keys. Enable it only for hosts you trust, and remember every session on such a host can use the forwarded agent. When no agent endpoint resolves (the configured agent path, `SSH_AUTH_SOCK`, the native OpenSSH named pipe on Windows) the connection fails instead of forwarding nothing, and a server that refuses the request surfaces its error exactly as it comes back.
- Tunnels only listen on `127.0.0.1`.
- Deleting a host or changing its connection fields (host / port / user / auth / proxyJump / proxyCommand / forwardAgent) immediately closes that alias's pooled connection and tunnels; later operations reconnect with the new configuration and never reuse a connection authenticated with the old credentials.
- When the SSH connection behind a tunnel drops, the tunnel retires itself: the local port stops accepting, the tunnel leaves the list, and the connection that arrives during the drop is closed without traffic instead of interrupting the host process.
- A `proxyCommand` value is a shell command executed by the DSH host process with its privileges — exactly the trust `ssh(1)` gives the same line in `~/.ssh/config`. It can only come from the user's own 0600 store file: the Agent cannot create or edit hosts, and `ssh_list` reports only whether a host has one, never the command text.
- Before the Agent uses a tool, the host must first be configured in the GUI (or imported from ~/.ssh/config).
- `ssh_upload` / `ssh_download` read/write arbitrary local paths on this machine with host-process privileges (not through the bash sandbox) — same host-local-path semantics as ssh-skill, be aware of that permission surface.
- Agent transfer tools move files only between this machine and a remote SSH host; local-file reads and writes must use the local file tools (read / write / edit / bash), never the `ssh_*` tools.
- The remote output of exec / cluster is returned verbatim (not sanitized); a command like `env` may bring secrets from the remote environment back into the conversation log.
```

</details>

**依据 7 · 作者声明**：[packages/dsh-ssh/README.md:91-97](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/README.md#L91-L97)

作者列出连接和导入限制。

```text
- exec auto-reconnect on disconnect (up to 3 times) may re-execute non-idempotent commands — watch out for side effects on long commands.
- A ProxyJump hop is either a host alias configured in this plugin or an OpenSSH `[user@]host[:port]` address; an address hop has no stored credentials, so it reuses the target host's authentication (configure a host entry when the hop needs its own).
- `proxyCommand` and `proxyJump` cannot be combined on one host (OpenSSH resolves them by "whichever appears first in the config"; a stored entry has no order, so the plugin rejects the pair), and only the first hop of a chain may declare a ProxyCommand.
- A ProxyCommand is executed through the user's shell, so it inherits the DSH process's `PATH` and environment. On Windows the shell is killed without its process group, so a client it spawned may outlive the transport.
- The ssh_config import expands `Include` (globs, `~`, several pathnames, relative to the config directory) but not environment variables or `%` tokens, and a multi-pattern `Host a b` line still imports only its first pattern.
- Resume (broken-transfer continuation) is not implemented yet.
- The transfer of Agent tools is a host-machine local path (same semantics as ssh-skill).
```

#### 缺口

- 所选代理拓扑、ssh2 实际验主机策略和不同会话的工具可见性未实测
  **影响**：不能确认它达到原 OpenSSH 流程的信任边界
  **进一步探讨**：替换测试服务器 host key 并核对拒绝行为，同时审查最小权限会话能看见的工具

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 为何应先观察，再决定是否把远端诊断纳入常用流程？

**研究主题**：效果与总成本、采用判断

#### 完整回答

远程只读诊断可能减少在终端与 DSH 间搬运输出，适用者是已有隔离测试机和低权限账户的运维人员。现阶段先核对测试别名确实指向预期主机、拒绝错误主机身份，并用可独立读取的只读输出对照现有终端。命令每次执行使用远端资源，模型调用与人工核对分开计量。若无法核验主机身份、输出带入凭据或断线后状态不明，仍用原有已审查的 SSH 终端，先从远端核对发生了什么，再考虑动作。集群需要非空筛选条件，但筛选条件可能仍匹配多台，因此单机结果不能直接外推。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-ssh/README.md:52-65](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/README.md#L52-L65)

作者安装路线。

<details>
<summary>查看原文（14行）</summary>

````text
## Install

Install the family aggregate package `@linxin666/dsh-web-all` (all plugins and skins in one) or this plugin alone:

```sh
### From npm (recommended)
dsh plugin --profile web add @linxin666/dsh-ssh@latest

### From the repository (development)
git clone https://github.com/zhu1090093659/dsh-web.git
cd dsh-web
pnpm install && pnpm -r build
dsh plugin --profile web add link:$(pwd)/packages/dsh-ssh

````

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/tools.ts:400-406](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/tools.ts#L400-L406)

集群要求至少一个筛选条件并传取消。

```text
    async execute(args, exec) {
      const hasSelector = (Array.isArray(args.aliases) && args.aliases.some((alias) => typeof alias === 'string' && alias.trim() !== '')) ||
        (typeof args.environment === 'string' && args.environment.trim() !== '') ||
        (Array.isArray(args.tags) && args.tags.some((tag) => typeof tag === 'string' && tag.trim() !== ''))
      if (!hasSelector) throw new Error('ssh_cluster requires aliases, environment, or tags to limit the target set')
      // Cancellation reaches every host's in-flight command.
      return { results: await engine.cluster({ ...args, signal: exec.signal }) }
```

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:507-518](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/engine/connection-pool.ts#L507-L518)

连接损坏时有重放边界。

<details>
<summary>查看原文（12行）</summary>

```text
    } catch (error) {
      lastError = error
      // A cancelled call is never replayed: the caller asked for it to stop,
      // and a retry would re-run a command that may not be idempotent.
      if (signal?.aborted === true) throw error
      // Retry only when the connection actually broke mid-flight: drop the
      // corpse and let the next attempt reconnect (a reconnect may replay a
      // non-idempotent command — the documented trade-off). A failure on a
      // healthy connection is a logic error and is rethrown, not replayed.
      if (!record.broken) throw error
      disposeRecord(engine, alias, record)
    } finally {
```

</details>

**依据 4 · 作者声明**：[packages/dsh-ssh/README.md:43-50](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/README.md#L43-L50)

作者说明转发、文件路径及输出限制。

```text
- Tunnels only listen on `127.0.0.1`.
- Deleting a host or changing its connection fields (host / port / user / auth / proxyJump / proxyCommand / forwardAgent) immediately closes that alias's pooled connection and tunnels; later operations reconnect with the new configuration and never reuse a connection authenticated with the old credentials.
- When the SSH connection behind a tunnel drops, the tunnel retires itself: the local port stops accepting, the tunnel leaves the list, and the connection that arrives during the drop is closed without traffic instead of interrupting the host process.
- A `proxyCommand` value is a shell command executed by the DSH host process with its privileges — exactly the trust `ssh(1)` gives the same line in `~/.ssh/config`. It can only come from the user's own 0600 store file: the Agent cannot create or edit hosts, and `ssh_list` reports only whether a host has one, never the command text.
- Before the Agent uses a tool, the host must first be configured in the GUI (or imported from ~/.ssh/config).
- `ssh_upload` / `ssh_download` read/write arbitrary local paths on this machine with host-process privileges (not through the bash sandbox) — same host-local-path semantics as ssh-skill, be aware of that permission surface.
- Agent transfer tools move files only between this machine and a remote SSH host; local-file reads and writes must use the local file tools (read / write / edit / bash), never the `ssh_*` tools.
- The remote output of exec / cluster is returned verbatim (not sanitized); a command like `env` may bring secrets from the remote environment back into the conversation log.
```

#### 缺口

- 还未确认固定宿主中的身份校验及断线行为
  **影响**：无法判断便利是否值得替换既有可信连接
  **进一步探讨**：在一次性主机核验错误指纹拒绝与断线后行为，再对照一次合格诊断

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 增加远端结果未知状态能否减少重复执行？

**研究主题**：新假设与验证

#### 完整回答

可把已发送但未收到退出码单独标作结果未知，并让默认策略只自动重试尚未发送的操作。用户可显式标记幂等命令，或用远端任务 ID 查询后再做决定。对照现有策略，在一次性主机分别制造发前断开、发送后写入前断开和写入后失回执，记录重复副作用、需人工恢复次数及完成时间。如果错误重放没有减少，或对已证幂等操作造成明显恢复退化，再修改策略。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:489-523](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/engine/connection-pool.ts#L489-L523)

池按连接坏状态决定重试。

<details>
<summary>查看原文（35行）</summary>

```text
/**
 * Run `fn` with a live client for `alias`, reconnecting (up to the
 * attempt budget) when the connection broke mid-flight.
 */
export async function withClient<T>(engine: PoolEngine, alias: string, fn: (client: Client) => Promise<T>, attempts = 3, signal?: AbortSignal): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let record = engine.pool.get(alias)
    if (record === undefined || record.broken) {
      if (record !== undefined) disposeRecord(engine, alias, record)
      record = await acquire(engine, alias)
    }
    record.idleAt = Date.now()
    record.inFlight += 1
    try {
      const result = await fn(record.client)
      record.idleAt = Date.now()
      return result
    } catch (error) {
      lastError = error
      // A cancelled call is never replayed: the caller asked for it to stop,
      // and a retry would re-run a command that may not be idempotent.
      if (signal?.aborted === true) throw error
      // Retry only when the connection actually broke mid-flight: drop the
      // corpse and let the next attempt reconnect (a reconnect may replay a
      // non-idempotent command — the documented trade-off). A failure on a
      // healthy connection is a logic error and is rethrown, not replayed.
      if (!record.broken) throw error
      disposeRecord(engine, alias, record)
    } finally {
      record.inFlight -= 1
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:593-611](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-ssh/src/engine/connection-pool.ts#L593-L611)

没有退出码时无法确定服务端结果。

<details>
<summary>查看原文（19行）</summary>

```text
        stream.on('close', (code: number | null) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          // A caller cancellation settles as cancelled, never as a broken
          // connection: the latter would send withClient into a retry that
          // re-runs a command the caller asked to stop.
          if (aborted) {
            resolve(cancelledResult())
            return
          }
          if (typeof code !== 'number' && !timedOut) {
            // The channel closed without an exit status: the connection
            // dropped mid-flight. Reject so withClient can reconnect and
            // retry within the attempt budget.
            reject(new Error('ssh: connection lost mid-flight (channel closed without an exit status)'))
            return
          }
```

</details>

#### 缺口

- 是否能可靠区分送达前与送达后未知
  **影响**：避免误标已执行，需故障对照
  **进一步探讨**：在模拟连接与一次性 SSH 主机各做三类断线并独立查远端记录

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
