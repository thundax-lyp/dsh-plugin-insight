# DSH SSH

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5cdf871](https://github.com/zhu1090093659/dsh-web/tree/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh)

<!-- BEGIN META -->
[![GitHub ★ 10,442](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C442&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 113,620](https://img.shields.io/static/v1?label=npm+30d&message=113%2C620&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh) [![最新发布 2026-11-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh)
<!-- END META -->

> **功能**：在 DSH Web 统一管理 SSH 主机并使用远端命令、终端、文件传输和隧道。

> **亮点**：[Q01](#research-q01) 将同一配置的远端命令与终端接到 DSH，便于在会话中核对和追踪输出。[Q02](#research-q02) 连接池把健康操作失败和需重连的情况分开。

> **主要限制**：[Q02](#research-q02) 缺退出码时结果可能已经在远端生效，重放风险取决于命令。[Q03](#research-q03) 回环准入与远端身份都需要核对，凭据文件权限并不加密字段。

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
  - [Q01 · 谁能用同一别名完成一次远端诊断？](#detail-section-11)
  - [Q02 · 断线、取消与超时各能证明执行到了哪里？](#detail-section-12)
  - [Q03 · 本机路由和远端主机身份有哪些独立约束？](#detail-section-13)
  - [Q04 · 上传失败和退出后仍要确认什么？](#detail-section-14)
  - [Q05 · 结果未知提示能否减少远端重复动作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合需要在 DSH 调查会话和远端客户端之间核对同一测试机状态的人。

[Q01](#research-q01) 已配置的 OpenSSH 客户端可以完成同样的诊断，插件主要增加在 DSH 内共享别名和工具上下文。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 别名与会话 | 从模型工具或浏览器找到远端 | 需核对主机身份及连接条件 |
| SSH 命令 | 获取退出码、输出与错误 | 断开或超时时不能单靠回执判断 |
| 文件上传 | 暂存并向远端 SFTP | 字节受限，本地和远端留存需查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=24.9.0、DSH >=0.2.2-rc.3 及 Web 服务 | 按清单必需 | 挂载两侧并注册 SSH | 固定发布包和宿主要额外核验 |
| 可核实身份的一次性远端测试主机 | 代表任务必需 | 核对同一别名和输出 | 先用原终端验证身份 |
| 低权限认证和可控网络 | 代表任务必需 | 限制错误代价 | 出现未核实密钥或地址就退出 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户从原终端核对一次性测试机及身份，再配置别名 | 目标和权限能独立确认 |
| 使用 | 在 DSH 请求一个只读命令 | 同一主机，退出码和输出可回查 |
| 异常 | 保留回执，回原终端确认效果 | 缺退出码不盲重发 |
| 退出 | 释放终端和隧道，停用或解除挂载 | 核对实际连接、暂存与凭据保留范围 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 测试机和网络资源未量化 | 核对端点、认证、别名与宿主环境 | 主机身份须独立确认 |
| 持续使用 | 连接、转发和传输负荷未知 | 回看输出、重试与残留会话 | 未测相对原终端节时 |
| 失败恢复 | 远端重复或临时文件资源未知 | 检查已经执行哪部分再清理 | 中断回执不能直接说明远端状态 |
| 退出 | 本地和远端留存占用未知 | 关终端、隧道及回收试用凭据 | 真实撤出未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 远端回查 | 同一别名有工具和终端 | 多机实测结果及节时 |
| 重连 | 池按连接状态处理失败和重试 | 无退出码时真实副作用 |
| 文件流 | 限流、暂存及结果帧 | 所有断连的本地与远端清理 |

> **思考**：[Q02](#research-q02) 缺退出码时结果可能已经在远端生效，重放风险取决于命令。[Q03](#research-q03) 回环准入与远端身份都需要核对，凭据文件权限并不加密字段。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将同一配置的远端命令与终端接到 DSH，便于在会话中核对和追踪输出。[Q02](#research-q02) 连接池把健康操作失败和需重连的情况分开。

[Q02](#research-q02) 取消和模型工具共享同一信号，断线重试保留各自条件。[Q04](#research-q04) 上传错误逐路径回收，真实清理仍需要验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 缺退出码时结果可能已经在远端生效，重放风险取决于命令。[Q03](#research-q03) 回环准入与远端身份都需要核对，凭据文件权限并不加密字段。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅在能独立核对身份的一次性隔离机上用只读命令试一次，不用共享生产凭据。若身份或退出回执无法核实，从原终端检查并结束试用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核查 SSH Web 接线、连接池和代表性上传。远端主机密钥校验、真实行为与故障收益未测。

- 已检查：作者 README、包清单、源码路径 packages/dsh-ssh/README.md、packages/dsh-ssh/src/index.ts、packages/dsh-ssh/src/tools.ts、packages/dsh-ssh/src/engine/connection-pool.ts、packages/dsh-ssh/src/routes.ts、packages/dsh-ssh/src/loopback.ts、packages/dsh-ssh/src/store.ts、packages/dsh-ssh/src/client/index.ts、packages/dsh-ssh/src/client/telemetry.ts 及固定范围 inventory；组件：packages/dsh-ssh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅查固定子包的双入口、Web HTTP 与升级路由、认证配置、连接池和代表性上传。未连接远端、未执行测试或组件。
- 下一步：[Q05](#research-q05) 用隔离主机核对一次只读回执，同时专门验证主机密钥匹配分支，再做带已知远端记录的断线对照。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.19（[固定提交 5cdf871](https://github.com/zhu1090093659/dsh-web/tree/5cdf8717475b6cbf85604f3c5428f332416c978b)）
- **版本日期**：2026-11-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将无明确退出的动作标成结果未知，并要求远端状态查证后才重试，能否减少重复写入需在一次性主机对照。

[Q05](#research-q05) 用隔离主机核对一次只读回执，同时专门验证主机密钥匹配分支，再做带已知远端记录的断线对照。

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

Issue 活跃度数据暂未获取（查询日期：2026-11-17），可前往 [GitHub Issues](https://github.com/zhu1090093659/dsh-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：怎样用同一 SSH 别名完成一次可复核的远端诊断，断线、认证与停用分别有什么边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁能用同一别名完成一次远端诊断？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有一台允许只读排查的测试机时，使用 DSH 分析告警的人可在模型工具和 Web 终端间用同一别名查主机状态。相对回到原 SSH 客户端复用主机列表，增量主要是将工具输出直接放回 DSH 调查，从同一别名访问终端。常规命令仍需明确目标、退出码和来源。作者说明面板切页后的终端与转发在宿主维护；本次确认宿主注册 WebSocket、普通路由与模型工具，切走界面不应被视为远端退出。若原终端已有验证指纹与审计，切换的节省不一定抵消额外配置。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-ssh/README.md:24-35](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/README.md#L24-L35)

作者列出共享别名、终端、存续与模型工具。

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/dsh-ssh/src/index.ts:219-239](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/index.ts#L219-L239)

真实注册路由、升级和模型工具。

<details>
<summary>查看原文（21行）</summary>

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
      'dsh-ssh: tools',
    )
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/tools.ts:145-174](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/tools.ts#L145-L174)

命令工具使用同一 engine 和取消信号。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

#### 缺口

- 未有真实运维频率或对照。
  **影响**：收益仅指有同一别名的路径，不能估算时间。
  **进一步探讨**：用一台一次性测试机对比同一命令与原终端。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 断线、取消与超时各能证明执行到了哪里？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

执行用别名拿连接池连接，健康连接失败直接抛出，损坏连接可重连并在预算内重试。远端通道关闭没有数字退出码且没有被标超时，会被解释为连接中途丢失；若连接记录同时标坏，重连路径可能再次发起已部分或全部执行的命令。取消不会触发这条重试，超时会尝试发信号并关闭，再于本地截止先返回，无论远端确认是否到达。在跳板连接失败时封装错误保留跳板与原原因，便于识别搭链失败；这不说明已有远端副作用。只读任务可重查，涉及写入先用独立观察确认何处已生效。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:363-395](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/engine/connection-pool.ts#L363-L395)

跳板顺序、传输互斥与错误 cause。

<details>
<summary>查看原文（33行）</summary>

```text
  if (chain.length > 0 && entry.proxyCommand !== undefined) {
    throw new Error('entry \'' + entry.alias + '\' declares both proxyCommand and proxyJump — pick one transport per host')
  }
  /** Transports this call started; destroyed on every failure path. */
  const transports: Duplex[] = []
  const startTransport = (owner: SshHostEntry): ConnectConfig['sock'] => {
    const { stream } = startProxyCommand(owner.proxyCommand as string, proxyTargetOf(owner))
    transports.push(stream)
    return stream
  }
  let sock: ConnectConfig['sock'] = entry.proxyCommand !== undefined ? startTransport(entry) : undefined
  try {
    for (let index = 0; index < chain.length; index += 1) {
      const spec = chain[index]
      const hop = resolveHop(engine, entry, spec)
      if (index > 0 && hop.proxyCommand !== undefined) {
        throw new Error('proxyJump hop \'' + spec + '\' declares a proxyCommand, which is only supported on the first hop')
      }
      const hopSock = index === 0 && hop.proxyCommand !== undefined ? startTransport(hop) : sock
      let hopClient: Client
      try {
        hopClient = await connectClient(buildConnectConfig(hop, hopSock, engine.opts), onKeyboardInteractive)
      } catch (error) {
        // Name the hop: an address hop (or a typo'd alias) must stay
        // diagnosable from the error alone.
        throw new Error('proxyJump hop \'' + spec + '\' (' + hop.user + '@' + hop.host + ':' + hop.port + '): '
          + (error instanceof Error ? error.message : String(error)), { cause: error })
      }
      hops.push(hopClient)
      const next = index + 1 < chain.length ? resolveHop(engine, entry, chain[index + 1]) : undefined
      const nextHost = next !== undefined ? next.host : entry.host
      const nextPort = next !== undefined ? next.port : entry.port
      sock = await new Promise<ConnectConfig['sock']>((resolve, reject) => {
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:495-522](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/engine/connection-pool.ts#L495-L522)

区分健康异常、已取消与已坏连接重连。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:575-620](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/engine/connection-pool.ts#L575-L620)

超时与无退出码分支。

<details>
<summary>查看原文（46行）</summary>

```text
            exitCode: null,
            timedOut,
            stdout: stdout.text,
            stderr: stderr.text,
            durationMs: Date.now() - started,
            error: timedOut ? 'command timed out after ' + budget + ' ms' : undefined,
          })
        }
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
            success: code === 0,
            exitCode: code,
            timedOut,
            stdout: stdout.text,
            stderr: stderr.text,
            durationMs: Date.now() - started,
          })
        })
```

</details>

#### 缺口

- 未验证实际丢包、远端进程状态和中途重复。
  **影响**：无退出码不能证明命令未执行。
  **进一步探讨**：在一次性主机记录远端副作用并模拟回执前断连。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本机路由和远端主机身份有哪些独立约束？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

实际 HTTP 守卫查回环，判断包含 socket、Host、跨站标记和转发头。它控制谁可从浏览器进入插件，与连接到的 SSH 远端身份是两件事。构造 ssh2 的配置实际支持密码、代理或从本地读密钥，代理转发是额外显式开关，缺代理端点报错。检阅 buildConnectConfig 未见传入 hostVerifier 或已知主机指纹，不能把 OpenSSH 的主机验证习惯转到此路径。配置写入 JSON 临时文件并以 0600 模式换名，文件权限约束不提供字段加密。只有端点与网络身份在隔离环境中可独立核对时才考虑只读验证，保留原客户端作为实际身份复核。Web apply 还在启动尝试市场心跳，和 SSH 成功无关。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/routes.ts:69-77](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/routes.ts#L69-L77)

宿主守卫拒绝非回环。

```text
  const guard = (req: IncomingMessage, res: ServerResponse, method: string): boolean => {
    if (!isLoopbackRequest(req)) {
      writeJson(res, 403, { error: 'forbidden: loopback-only' })
      return false
    }
    if (req.method !== method) {
      writeJson(res, 405, { error: `method not allowed: ${req.method}` })
      return false
    }
```

**依据 2 · 源码核查**：[packages/dsh-ssh/src/loopback.ts:59-92](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/loopback.ts#L59-L92)

检查转发、socket、Host 和浏览器条件。

<details>
<summary>查看原文（34行）</summary>

```text
export function isProxiedRequest(request: IncomingMessage): boolean {
  return request.headers['cf-connecting-ip'] !== undefined
    || request.headers['x-forwarded-for'] !== undefined
}

/**
 * Request-level trust fence: a loopback socket address AND a loopback Host
 * header, plus browser same-origin markers. The socket address is
 * authoritative for a direct connection; a request that carries a forwarding
 * header is refused outright, because a proxy in front of the host makes both
 * the socket address and the Host header describe the proxy rather than the
 * client. X-Forwarded-For is therefore never evidence *for* loopback.
 */
export function isLoopbackRequest(request: IncomingMessage): boolean {
  if (!isLoopbackAddress(request.socket.remoteAddress)) return false
  if (isProxiedRequest(request)) return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:76-125](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/engine/connection-pool.ts#L76-L125)

列出实际 ssh2 连接选项，未见显式 hostVerifier。

<details>
<summary>查看原文（50行）</summary>

```text
/** Build the ssh2 connect config for one entry (key read from disk). */
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
        + 'set SSH_AUTH_SOCK, start Pageant on Windows, or configure an agent path')
    }
    config.agent = agentPath
    config.agentForward = true
  }
  return config
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/store.ts:395-403](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/store.ts#L395-L403)

私有模式的明文 JSON 持久化。

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

**依据 5 · 源码核查**：[packages/dsh-ssh/src/client/index.ts:74-84](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/client/index.ts#L74-L84)

Web 启动尝试遥测。

<details>
<summary>查看原文（11行）</summary>

```text
export function apply(ctx: ClientContext): void {
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-ssh' }])

  ctx.effect(() => {
    try {
      return ctx.locale.register(NS, { zh, en })
    } catch {
      return () => {}
    }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/client/telemetry.ts:119-150](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/client/telemetry.ts#L119-L150)

随机标识、去重和实际请求。

<details>
<summary>查看原文（32行）</summary>

```text
    // First guard: a stored opt-out or the browser's Do Not Track stops every
    // read below from minting an id, marking the day, or reaching the network.
    if (isTelemetrySuppressed()) return
    if (items.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    // Automation contexts (CDP-driven QA browsers, fresh isolated profiles)
    // mint a new visitor id per run and would inflate instance counts.
    if (navigator.webdriver) return
    if (localStorage.getItem(DAY_KEY_PREFIX + today) !== null) return
    const visitor = visitorId()
    if (visitor === null) return
    pruneDayKeys(today)
    const payloadItems = items.map((item) => {
      const out: Record<string, string> = { name: item.name }
      const version = item.version ?? bakedVersion()
      if (version !== undefined) out.version = version
      if (item.channel !== undefined) out.channel = item.channel
      return out
    })
    const body = JSON.stringify({ kind: 'heartbeat', visitor, items: payloadItems })
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).then((response) => {
      // Mark the day only after an accepted send, so offline browsers retry
      // on a later mount instead of going dark until tomorrow.
      if (response.ok) localStorage.setItem(DAY_KEY_PREFIX + today, '1')
    }).catch(() => { /* unreachable endpoint: stay silent */ })
  } catch { /* never break the host UI over telemetry */ }
}
```

</details>

#### 缺口

- 真机主机校验、代理与网络模式未运行。
  **影响**：不能将该研究用于生产端点身份保证。
  **进一步探讨**：使用自有隔离机核对错误主机密钥行为，生产沿用已验证客户端。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 上传失败和退出后仍要确认什么？

**研究主题**：效果与总成本、采用判断、缺陷与关键质疑

#### 完整回答

浏览器上传先检查声明长度，也累计分块实际字节，用 0600 的随机临时文件暂存。写流结束后通过 SFTP 上传，返回结果和进度。失败路径发结果，处理打开尚未结束的 sink 并尽量清除临时文件，清理出错被吞掉，且此前的远端上传能否清理要另查。固定版本只把已有清理函数移到共同作用域，未取得实际断连结果。初次使用要准备隔离机并核查主机身份和别名，持续要维护路由、认证、输出及活动终端。先不做上传或写命令，用原终端对照一次只读命令；若退出码缺失、目标不符或响应失去可信归属，停用并回原终端。关闭面板与卸载不同，后者才由 effect 释放 HTTP、升级路由、工具和终端会话。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/routes.ts:317-352](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/routes.ts#L317-L352)

预检大小和临时文件，清理失败会吞掉。

<details>
<summary>查看原文（36行）</summary>

```text
        if (alias === undefined || remotePath === undefined) {
          writeJson(res, 400, { error: 'alias and remotePath query parameters are required' })
          return
        }
        const declared = Number(req.headers['content-length'])
        if (Number.isFinite(declared) && declared > maxUploadBytes) {
          writeJson(res, 413, { error: 'upload body too large' })
          return
        }
        res.writeHead(200, {
          'content-type': 'application/x-ndjson; charset=utf-8',
          'cache-control': 'no-cache',
          'referrer-policy': 'no-referrer',
        })
        const emit = (line: unknown): void => {
          try { res.write(JSON.stringify(line) + '\n') } catch { /* client gone */ }
        }
        // Stage the uploaded bytes, then SFTP them out with progress frames.
        const tmp = join(staging, `upload-${randomBytes(6).toString('hex')}`)
        const sink = createWriteStream(tmp, { mode: 0o600 })
        let settled = false
        // End the response only after the tmp file is gone, and unlink only
        // after the sink is fully closed: destroying a WriteStream whose
        // fs.open is still pending lets the open RE-CREATE the file after
        // an early unlink, leaving staging populated (this raced the
        // response end and made the byte-cap test flaky).
        const cleanup = (): void => {
          void unlink(tmp).catch(() => undefined).finally(() => {
            try { res.end() } catch { /* closed */ }
          })
        }
        // Every terminal path (sink error, client abort, response loss) must
        // emit a result frame, end the response, and remove the tmp file.
        const fail = (error: unknown): void => {
          if (settled) return
          settled = true
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/routes.ts:350-385](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/routes.ts#L350-L385)

失败、断开、实际字节上限与清理。

<details>
<summary>查看原文（36行）</summary>

```text
        const fail = (error: unknown): void => {
          if (settled) return
          settled = true
          emit({ type: 'result', ok: false, error: error instanceof Error ? error.message : String(error) })
          if (sink.destroyed) {
            cleanup()
          } else {
            sink.once('close', cleanup)
            try { sink.destroy() } catch { cleanup() }
          }
        }
        const done = (): void => {
          if (settled) return
          settled = true
          try { res.end() } catch { /* closed */ }
        }
        sink.on('error', (error) => fail(error))
        req.on('error', (error) => fail(error))
        req.on('aborted', () => fail('upload aborted by the client'))
        res.on('error', () => fail('response stream closed'))
        res.on('close', () => { if (!res.writableEnded) fail('connection closed') })
        // The content-length pre-check above can be bypassed by chunked or
        // header-less requests: count the bytes as they actually arrive and
        // abort the moment the cap is exceeded.
        let received = 0
        let capped = false
        req.on('data', (chunk: Buffer) => {
          received += chunk.byteLength
          if (received > maxUploadBytes && !capped) {
            capped = true
            fail('upload body too large')
            // Keep the socket alive until the response flush finishes:
            // destroying the request here races res.end() and the client
            // sees a hang-up instead of the result frame. Drain the rest of
            // the body so the socket can close cleanly afterwards.
            res.on('finish', () => { try { req.destroy() } catch { /* closed */ } })
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/routes.ts:389-401](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/routes.ts#L389-L401)

SFTP 从本地暂存发出并报告。

<details>
<summary>查看原文（13行）</summary>

```text
        req.pipe(sink)
        sink.on('finish', async () => {
          if (settled) return
          emit({ type: 'progress', progress: { phase: 'connecting', file: remotePath, transferred: 0, total: 0, percent: 0 } })
          try {
            const outcome = await engine.upload(alias, tmp, remotePath, false, progress => emit({ type: 'progress', progress }))
            emit({ type: 'result', ok: true, transferredBytes: outcome.bytes })
          } catch (error) {
            emit({ type: 'result', ok: false, error: error instanceof Error ? error.message : String(error) })
          } finally {
            await unlink(tmp).catch(() => undefined)
            done()
          }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/index.ts:219-239](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/index.ts#L219-L239)

释放路由、终端与工具。

<details>
<summary>查看原文（21行）</summary>

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
      'dsh-ssh: tools',
    )
```

</details>

#### 缺口

- 未观察远端文件、清理用时和实际开销。
  **影响**：无法保证所有遗留数据已删除。
  **进一步探讨**：失败后检查宿主 staging 与远端目录，记录恢复动作。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 结果未知提示能否减少远端重复动作？

**研究主题**：新假设与验证

#### 完整回答

假设在命令已发但没有退出结果时，将状态标为未知且先查远端，能比直重发减少重复写入。用同一隔离测试主机和可对账的临时写入，在发出前、执行中和执行完未返退出码的位置断开。对照旧重试策略与先核对标识再决定，记实际命令次数、重复状态、恢复时间和漏完成。若重复没有减少，或漏完成和恢复代价超过可控范围，不建议扩展。该设计尚待验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:507-521](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/engine/connection-pool.ts#L507-L521)

连接失败重试对非幂等命令有影响。

<details>
<summary>查看原文（15行）</summary>

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
      record.inFlight -= 1
    }
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:593-619](https://github.com/zhu1090093659/dsh-web/blob/5cdf8717475b6cbf85604f3c5428f332416c978b/packages/dsh-ssh/src/engine/connection-pool.ts#L593-L619)

无退出码及正常返回分支。

<details>
<summary>查看原文（27行）</summary>

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
          resolve({
            success: code === 0,
            exitCode: code,
            timedOut,
            stdout: stdout.text,
            stderr: stderr.text,
            durationMs: Date.now() - started,
          })
```

</details>

#### 缺口

- 未执行故障注入。
  **影响**：暂无重复率、恢复时间依据。
  **进一步探讨**：使用可恢复的测试状态在各断点追实际操作。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
