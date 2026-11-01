# DSH SSH

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh)

<!-- BEGIN META -->
[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 96,003](https://img.shields.io/static/v1?label=npm+30d&message=96%2C003&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh)
<!-- END META -->

> **功能**：在 DSH 中管理 SSH 主机，并提供远端命令、终端、文件传输与隧道。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示 GUI 与工具复用别名和连接 engine，集中远端操作入口；未证明比 OpenSSH 更安全或更省时。

> **主要限制**：[Q03](#research-q03) 显示目标构造未传主机验证回调，且执行取消信号未传入池的重试判断；失联后应先核实身份和远端状态，不能假定操作未发生。

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
  - [Q01 · 谁需要 DSH 内 SSH，现有 SSH 工具是否足够？](#detail-section-11)
  - [Q02 · GUI 和工具如何发起远端命令？](#detail-section-12)
  - [Q03 · 主机身份、取消与重试有什么限制？](#detail-section-13)
  - [Q04 · 终端、文件与凭据的生命周期是什么？](#detail-section-14)
  - [Q05 · 哪些前提适合试用，何时退出？](#detail-section-15)
  - [Q06 · 绑定真实目标和结果状态是否能降低误重放？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：熟悉 SSH 的用户希望在 DSH 内集中访问测试主机及其命令、终端和文件；仍需独立核对目标与结果。

OpenSSH、终端和 SFTP 客户端已能完成同类任务，本组件主要增加 DSH 内统一界面与模型工具接入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 远端命令 | 通过 alias 执行 shell 命令 | 断线可能重放，取消不保证撤销副作用 |
| 终端 | 交互式远端 shell | 独立连接，需审查权限与清理 |
| SFTP | 传输和浏览文件 | channel 会释放，部分操作状态需核对 |
| 隧道与集群 | 转发端口和多主机操作 | 仅在目标及权限明确时启用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 Node | 挂载需要 | 提供 Host 和 web 接口 | 版本不符不能假定可用 |
| SSH 服务和凭据 | 连接需要 | 访问远端 | 无服务或认证失败无法执行 |
| 已验证主机身份 | 高信任操作需要 | 确认连接目标 | 本次未发现主机 key pin，需使用已有验证方案 |
| OS 和远端权限 | 对应操作需要 | 控制文件与命令访问 | 权限决定真实影响范围 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户创建隔离 home、临时 key 与测试机 | 核实主机身份和权限 |
| 连接 | 用户选择唯一 alias | 目标不明即停止 |
| 执行 | 用户先运行审查过的只读命令 | 核对输出与真实主机 |
| 恢复 | 用户核查远端作业及残留资源 | 断线或取消状态未知时不重放写操作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 测试机、网络和密钥资源未知 | 配置目标及身份，时间未知 | 需兼容宿主 |
| 持续 | 连接、远端计算与传输成本未知 | 审核命令与目标，时间未知 | 模型工具带来额外权限判断 |
| 失败恢复 | 重连、临时文件和远端作业成本未知 | 确认副作用与清理 | 重试可能重放非幂等命令 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集成入口 | GUI 和工具共用 engine | 相对 OpenSSH 的节时和可用性 |
| 连接和清理 | 池重连及 channel 释放有实现 | 远端进程、部分传输与故障恢复结果 |
| 主机身份 | 固定库文档解释默认行为 | 实际安装和握手是否符合锁定配置 |

> **思考**：[Q03](#research-q03) 显示目标构造未传主机验证回调，且执行取消信号未传入池的重试判断；失联后应先核实身份和远端状态，不能假定操作未发生。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示 GUI 与工具复用别名和连接 engine，集中远端操作入口；未证明比 OpenSSH 更安全或更省时。

[Q02](#research-q02) 的共享 engine 和 [Q04](#research-q04) 的 SFTP finally、独立 PTY 提供可复用结构；[Q03](#research-q03) 的信号与重试边界要求单独核查调用方，不能把释放通道等同撤销远端动作。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示目标构造未传主机验证回调，且执行取消信号未传入池的重试判断；失联后应先核实身份和远端状态，不能假定操作未发生。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议熟悉 SSH 的用户只在隔离测试机和独立 home 试用人工审核的只读命令；要求 host key pin 时使用现有 SSH 方案。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码和固定依赖文档支持条件性机制判断；实际握手、断线恢复及业务效果未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-ssh/README.md、packages/dsh-ssh/package.json、packages/dsh-ssh/src/index.ts、packages/dsh-ssh/src/tools.ts、packages/dsh-ssh/src/engine.ts、packages/dsh-ssh/src/engine/connection-pool.ts、packages/dsh-ssh/src/routes.ts、packages/dsh-ssh/src/engine/pty.ts、packages/dsh-ssh/src/engine/sftp.ts、packages/dsh-ssh/src/store.ts、pnpm-lock.yaml 及固定范围 inventory；组件：packages/dsh-ssh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向检查子包入口、命令执行、连接配置、取消重试、PTY、SFTP 与配置存储，并复核固定 ssh2 1.17.0 文档；未运行插件或握手，未全审多跳、完整文件权限及认证实现。
- 下一步：固定插件和 ssh2 版本，在隔离测试机对照 known_hosts，测试断线、取消、非幂等命令、部分上传及清理；记录远端作业实际状态，不使用生产凭据。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.13（[固定提交 68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出绑定目标身份和作业状态的未验证假设；若现有 known_hosts、作业 ID 和简单修补足够，则不需新方案。

固定插件和 ssh2 版本，在隔离测试机对照 known_hosts，测试断线、取消、非幂等命令、部分上传及清理；记录远端作业实际状态，不使用生产凭据。

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

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 170](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=170&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 173](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=173&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查远端连接、命令与文件操作的真实接线，以及身份、取消与重试边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要 DSH 内 SSH，现有 SSH 工具是否足够？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在 DSH 内查看多个远端主机、执行命令或转移文件的 SSH 用户可集中操作；原办法是 OpenSSH、终端和 SFTP 客户端。README.md:18-33 描述主机管理、连接池、终端、文件、隧道与工具，是作者主张；index.ts:148-179 实际创建共享 store/engine 并挂路由和工具。增量是将 DSH 界面与工具接到共同别名配置和连接管理，不证明比成熟 SSH 工具安全或更省时。真实远端业务成功还须核对主机、命令输出与状态。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-ssh/README.md:18-33](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/README.md#L18-L33)

作者描述远端操作场景。

<details>
<summary>查看原文（16行）</summary>

```text
A dedicated remote Linux server operations and cluster management plugin for DeepSeek Harness (DSH) Web GUI and official desktop client: in-process persistent connection pool, Web GUI host inventory management, xterm.js terminal, visual SFTP file transfer, port forwarding tunnels, and 6 dedicated agent tools implemented on top of official NPM SDKs without modifying DSH core source code.

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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/index.ts:148-179](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/index.ts#L148-L179)

共享 engine 接入路由和工具。

<details>
<summary>查看原文（32行）</summary>

```text
function applyImpl(ctx: Context, config?: ResolvedConfig): void {
  const store = new HostStore()
  const engine = new SshEngine(store, { connectTimeoutMs: readConfigField(config?.connectTimeoutMs, DEFAULT_CONNECT_TIMEOUT_MS) })
  ctx.effect(() => () => { engine.dispose() }, 'dsh-ssh: engine')

  const resolve = (): { announceToAgent: boolean; enabled: boolean } => {
    let enabled = readConfigField(config?.enabled, DEFAULT_ENABLED)
    // When dsh-ssh was seeded with enabled: false (e.g. from an aggregate profile
    // line), but the profile's own entry config never set the switch AND the user
    // already has active host records in dsh-ssh.json, keep the plugin enabled so
    // existing users are not broken upon upgrade (#1250).
    if (enabled === false && profileConfig(ctx)?.enabled === undefined && store.list().length > 0) {
      enabled = true
    }
    return {
      announceToAgent: readConfigField(config?.announceToAgent, DEFAULT_ANNOUNCE),
      enabled,
    }
  }

  // The /api/dsh-ssh route family + terminal upgrade.
  const { routes, upgrade, terminalSessions } = makeRoutes({ store, engine })
  let disposeRoutes: (() => void) | undefined

  // Agent tools + their prompt sections.
  const tools = [
    sshListTool(engine),
    sshExecTool(engine),
    sshUploadTool(engine),
    sshDownloadTool(engine),
    sshTunnelTool(engine),
    sshClusterTool(engine),
```

</details>

#### 缺口

- 没有同任务用户对照
  **影响**：不能推断净节时或需求强度
  **进一步探讨**：对同一只读排障任务比较 OpenSSH 和界面的操作与结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · GUI 和工具如何发起远端命令？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

src/index.ts:148-179 创建 HostStore 和 SshEngine，同一 engine 交给路由及 ssh_exec 等工具。src/tools.ts:145-174 将 alias、command、timeout 和执行信号交给 engine.exec；engine.ts:84-88 转发至 execCommand，connection-pool.ts:493-518 按 alias 获取或重连 client，526-542 发起 client.exec。GUI routes.ts:190-205 同样调用 engine.exec，但该调用没有传 signal。两条路径共用引擎不等于目标主机身份已经核验，也不证明远端业务结果正确；实际运行与错误覆盖未验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/index.ts:148-179](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/index.ts#L148-L179)

共享 store 和 engine。

<details>
<summary>查看原文（32行）</summary>

```text
function applyImpl(ctx: Context, config?: ResolvedConfig): void {
  const store = new HostStore()
  const engine = new SshEngine(store, { connectTimeoutMs: readConfigField(config?.connectTimeoutMs, DEFAULT_CONNECT_TIMEOUT_MS) })
  ctx.effect(() => () => { engine.dispose() }, 'dsh-ssh: engine')

  const resolve = (): { announceToAgent: boolean; enabled: boolean } => {
    let enabled = readConfigField(config?.enabled, DEFAULT_ENABLED)
    // When dsh-ssh was seeded with enabled: false (e.g. from an aggregate profile
    // line), but the profile's own entry config never set the switch AND the user
    // already has active host records in dsh-ssh.json, keep the plugin enabled so
    // existing users are not broken upon upgrade (#1250).
    if (enabled === false && profileConfig(ctx)?.enabled === undefined && store.list().length > 0) {
      enabled = true
    }
    return {
      announceToAgent: readConfigField(config?.announceToAgent, DEFAULT_ANNOUNCE),
      enabled,
    }
  }

  // The /api/dsh-ssh route family + terminal upgrade.
  const { routes, upgrade, terminalSessions } = makeRoutes({ store, engine })
  let disposeRoutes: (() => void) | undefined

  // Agent tools + their prompt sections.
  const tools = [
    sshListTool(engine),
    sshExecTool(engine),
    sshUploadTool(engine),
    sshDownloadTool(engine),
    sshTunnelTool(engine),
    sshClusterTool(engine),
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/tools.ts:145-174](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/tools.ts#L145-L174)

ssh_exec 转发参数和 signal。

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

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine.ts:84-88](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/engine.ts#L84-L88)

engine 转发至 execCommand。

```text
  // ------------------------------------------------------------ exec

  /** Run one command on `alias` (reusing the pooled connection). */
  async exec(alias: string, command: string, timeoutMs?: number, signal?: AbortSignal): Promise<ExecResult> {
    return execCommand(this, alias, command, timeoutMs, signal)
```

**依据 4 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:493-518](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/engine/connection-pool.ts#L493-L518)

连接复用及故障重试。

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:525-542](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/engine/connection-pool.ts#L525-L542)

建立远端执行 channel。

<details>
<summary>查看原文（18行）</summary>

```text
/** Run one command on `alias` (reusing the pooled connection). */
export async function execCommand(engine: PoolEngine, alias: string, command: string, timeoutMs?: number, signal?: AbortSignal): Promise<ExecResult> {
  const started = Date.now()
  const budget = timeoutMs !== undefined && timeoutMs > 0 ? timeoutMs : engine.opts.defaultExecTimeoutMs
  return withClient(engine, alias, async (client) => {
    return await new Promise<ExecResult>((resolve, reject) => {
      // Caller cancellation is cooperative and quiescent: aborting closes the
      // remote channel and settles this call like a timeout does, so the
      // command stops without the pool replaying it. The channel is captured
      // in a mutable slot because abort may fire before client.exec calls back.
      let aborted = signal !== undefined && signal.aborted
      let kill = (): void => { /* channel not open yet */ }
      const onAbort = (): void => {
        aborted = true
        kill()
      }
      if (signal !== undefined && !signal.aborted) signal.addEventListener('abort', onAbort, { once: true })
      client.exec(command, (error, stream) => {
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/routes.ts:190-205](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/routes.ts#L190-L205)

GUI 路由调用相同 engine。

<details>
<summary>查看原文（16行）</summary>

```text
    {
      kind: 'exact',
      path: SSH_API.exec,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        const body = (await readJsonBody(req)) as Record<string, unknown> | null
        const alias = typeof body?.alias === 'string' ? body.alias : ''
        const command = typeof body?.command === 'string' ? body.command : ''
        if (alias === '' || command === '') {
          writeJson(res, 400, { error: 'alias and command are required' })
          return
        }
        const timeoutMs = typeof body?.timeoutMs === 'number' ? body.timeoutMs : undefined
        try {
          writeJson(res, 200, { result: await engine.exec(alias, command, timeoutMs) })
        } catch (error) {
```

</details>

#### 缺口

- 未连接真实服务器
  **影响**：目标身份、成功率与业务效果未经验证
  **进一步探讨**：使用隔离测试机验证只读命令、认证及输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 主机身份、取消与重试有什么限制？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

connection-pool.ts:76-125 构造 ssh2 ConnectConfig，含主机、用户和认证材料，但没有传 hostVerifier。仓库 pnpm-lock.yaml:1089-1102 将该子包锁到 ssh2 1.17.0；独立保留的 DEPENDENCY-SSH2.json 引用该版本上游 README 固定提交 844f1edf 中的 hostVerifier 默认契约，即未配置时自动接受主机密钥。这是源码与固定库文档的条件性解释，不是当前安装产物握手或攻击实测；要求已验证主机身份者应沿用有 known_hosts 校验的方案。

connection-pool.ts:493-518 在连接确实损坏时可重试 fn，源码承认可能重放非幂等操作；其 signal 参数若 aborted 会阻止重试。execCommand 526-542、548-553 接收 signal 并尝试发 KILL/关闭远端 channel，但 629-634 的 withClient 调用未把 signal 传给池的第五参数，不能据池的取消保护断言整个重试路径不会重放；远端收到 KILL 与副作用撤销也不是同一事实。网络断开后命令是否已执行、实际目标或状态不明时应先对账，不盲目重试。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:76-125](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/engine/connection-pool.ts#L76-L125)

构建连接配置未传 hostVerifier。

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

**依据 2 · 源码核查**：[pnpm-lock.yaml:1089-1102](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/pnpm-lock.yaml#L1089-L1102)

子包锁定 ssh2 1.17.0。

<details>
<summary>查看原文（14行）</summary>

```text
  packages/dsh-ssh:
    dependencies:
      '@deepseek-ai/schemastery':
        specifier: ^3.18.5
        version: 3.18.5
      '@xterm/addon-fit':
        specifier: ^0.11.0
        version: 0.11.0
      '@xterm/xterm':
        specifier: ^6.0.0
        version: 6.0.0
      ssh2:
        specifier: ^1.17.0
        version: 1.17.0
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:493-518](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/engine/connection-pool.ts#L493-L518)

signal 与连接损坏重试条件。

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:525-553](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/engine/connection-pool.ts#L525-L553)

执行 signal 和 channel 关闭。

<details>
<summary>查看原文（29行）</summary>

```text
/** Run one command on `alias` (reusing the pooled connection). */
export async function execCommand(engine: PoolEngine, alias: string, command: string, timeoutMs?: number, signal?: AbortSignal): Promise<ExecResult> {
  const started = Date.now()
  const budget = timeoutMs !== undefined && timeoutMs > 0 ? timeoutMs : engine.opts.defaultExecTimeoutMs
  return withClient(engine, alias, async (client) => {
    return await new Promise<ExecResult>((resolve, reject) => {
      // Caller cancellation is cooperative and quiescent: aborting closes the
      // remote channel and settles this call like a timeout does, so the
      // command stops without the pool replaying it. The channel is captured
      // in a mutable slot because abort may fire before client.exec calls back.
      let aborted = signal !== undefined && signal.aborted
      let kill = (): void => { /* channel not open yet */ }
      const onAbort = (): void => {
        aborted = true
        kill()
      }
      if (signal !== undefined && !signal.aborted) signal.addEventListener('abort', onAbort, { once: true })
      client.exec(command, (error, stream) => {
        if (error !== undefined) {
          signal?.removeEventListener('abort', onAbort)
          reject(error)
          return
        }
        kill = (): void => {
          try { stream.signal('KILL') } catch { /* channel gone */ }
          try { stream.close() } catch { /* channel gone */ }
        }
        // The abort may already have arrived while this channel opened.
        if (aborted) kill()
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:593-634](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/engine/connection-pool.ts#L593-L634)

断线重试及调用 withClient 未附 signal。

<details>
<summary>查看原文（42行）</summary>

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
        })
        stream.on('error', (streamError: Error) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          if (aborted) {
            resolve(cancelledResult())
            return
          }
          reject(streamError)
        })
      })
    })
  })
```

</details>

#### 缺口

- 没有真实握手与中断复现
  **影响**：库文档和代码仅支持条件性判断，远端副作用未知
  **进一步探讨**：隔离测试机验证身份校验、取消和断线后远端状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 终端、文件与凭据的生命周期是什么？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

src/engine/pty.ts:32-61 为交互 shell 建独立连接并在 close 时关闭 client 和跳板；src/engine/sftp.ts:116-142 为每次操作创建 channel 并在 finally 释放；这些清理逻辑不能证明远端进程或部分上传均自动回滚。src/store.ts:162-171 把 password 或私钥口令放入 host 记录，395-402 用 JSON 文件和 0600 创建临时文件后 rename；这是文件权限措施，不是加密存储保证。使用独立 DSH_HOME 和临时低权限 key，避免在试验中启用代理转发和 ProxyCommand；文件、进程及远端权限仍由部署者控制。未对所有多跳、终端重连、SFTP 路径和真实系统 ACL 做全审。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/engine/pty.ts:32-61](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/engine/pty.ts#L32-L61)

独立连接与终端关闭。

<details>
<summary>查看原文（30行）</summary>

```text
export async function openShell(
  engine: PoolEngine,
  alias: string,
  size: { cols: number; rows: number },
  onKeyboardInteractive?: KeyboardInteractiveHandler,
): Promise<ShellSession> {
  const entry = engine.store.find(alias)
  if (entry === undefined) throw new Error('alias \'' + alias + '\' not found — add it first')
  const { client, hops } = await connectChain(engine, entry, onKeyboardInteractive)
  return await new Promise<ShellSession>((resolve, reject) => {
    client.shell({ term: 'xterm-256color', cols: size.cols, rows: size.rows }, (error, stream) => {
      if (error !== undefined) {
        try { client.end() } catch { /* closed */ }
        for (const hop of hops) { try { hop.end() } catch { /* closed */ } }
        reject(error)
        return
      }
      let tornDown = false
      const teardown = (): void => {
        if (tornDown) return
        tornDown = true
        try { client.end() } catch { /* closed */ }
        for (const hop of hops) { try { hop.end() } catch { /* closed */ } }
      }
      const session: ShellSession = {
        send: (data) => { try { stream.write(data) } catch { /* channel gone */ } },
        resize: (cols, rows) => { try { stream.setWindow(rows, cols, rows, cols) } catch { /* channel gone */ } },
        close: () => {
          try { stream.close() } catch { /* channel gone */ }
          teardown()
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/sftp.ts:116-142](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/engine/sftp.ts#L116-L142)

SFTP channel 在 finally 释放。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * Open one SFTP channel, run the operation, and release the channel exactly
 * once when the operation settles (success or error). ssh2 keeps each
 * subsystem channel open until end(); without this, every transfer leaks a
 * channel until sshd's MaxSessions cap makes all later opens fail.
 */
async function withSftp<T>(client: Client, run: (sftp: SFTPWrapper) => Promise<T>): Promise<T> {
  const sftp = await sftpChannel(client)
  let ended = false
  const endOnce = (): void => {
    if (ended) return
    ended = true
    try { sftp.end() } catch { /* channel already closed */ }
  }
  // The channel can also close underneath us (peer reset, timeout); the
  // guard makes the finally below a no-op instead of ending it twice.
  sftp.once('close', endOnce)
  try {
    return await run(sftp)
  } finally {
    endOnce()
  }
}

function sftpChannel(client: Client): Promise<SFTPWrapper> {
  return new Promise((resolve, reject) => {
    client.sftp((error, sftp) => error !== undefined ? reject(error) : resolve(sftp))
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/store.ts:162-171](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/store.ts#L162-L171)

密码或口令写入 host 记录。

<details>
<summary>查看原文（10行）</summary>

```text
    const entry: SshHostEntry = {
      alias,
      host: payload.host.trim(),
      port: payload.port ?? 22,
      user: payload.user.trim(),
      auth: {
        kind: payload.auth.kind,
        keyPath: payload.auth.kind === 'key' ? expandHome(payload.auth.keyPath?.trim() ?? '') : undefined,
        passphrase: payload.auth.kind === 'key' ? payload.auth.passphrase ?? undefined : undefined,
        password: payload.auth.kind === 'password' ? payload.auth.password : undefined,
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/store.ts:395-402](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/store.ts#L395-L402)

JSON 文件权限及替换。

```text
  private save(file: StoreFile): void {
    const dir = dirname(this.path)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true, mode: 0o700 })
    const tmp = this.path + '.tmp'
    // Secrets live in this file: keep it readable by the owner only. The
    // tmp file carries the 0600 mode through the rename.
    writeFileSync(tmp, JSON.stringify(file, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 })
    renameSync(tmp, this.path)
```

#### 缺口

- 未审计全部 SFTP、跳板和 ACL
  **影响**：不能保证全部资源与远端副作用被撤销
  **进一步探讨**：核对实际部署存储权限、部分传输和终端清理。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些前提适合试用，何时退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

package.json:1-10、29-44 声明 Node 与 DSH 版本，需可访问的 SSH 服务、受限凭据和用户对目标主机负责。已有 SSH 经验的用户可在独立可弃置 home 与隔离测试机，以唯一 alias 和临时 key 先运行人工审核的只读命令，逐一检查目标及结果；无需启动模型轮次。若主机 key pin、加密凭据或文件沙箱是硬要求，应先采用具备这些条件的现有 SSH 方案。断线、取消后状态不明时停下并检查远端，不重放写操作。真实连接费、操作和恢复时间、独立用户收益均未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/package.json:1-10](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/package.json#L1-L10)

Node 版本声明。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "@linxin666/dsh-ssh",
  "description": "Remote SSH operations for the dsh web GUI: host config store (~/.dsh/dsh-ssh.json, import from ~/.ssh/config), a persistent ssh2 connection pool with jump-host support, exec / PTY web terminal / SFTP transfer / local port-forward tunnels / cluster execution, plus agent tools (ssh_list, ssh_exec, ssh_upload, ssh_download, ssh_tunnel, ssh_cluster). Hot-pluggable — mounted via ~/.dsh/cordis.patch.yml + a profile node_modules symlink, no dsh source changes.",
  "version": "0.4.13",
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/package.json:29-44](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/package.json#L29-L44)

DSH 与客户端声明。

<details>
<summary>查看原文（16行）</summary>

```text
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
      "platform": "web"
    }
  },
  "scripts": {
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:76-125](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/engine/connection-pool.ts#L76-L125)

连接及认证配置。

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

**依据 4 · 源码核查**：[packages/dsh-ssh/src/store.ts:395-402](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/store.ts#L395-L402)

持久化存储。

```text
  private save(file: StoreFile): void {
    const dir = dirname(this.path)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true, mode: 0o700 })
    const tmp = this.path + '.tmp'
    // Secrets live in this file: keep it readable by the owner only. The
    // tmp file carries the 0600 mode through the rename.
    writeFileSync(tmp, JSON.stringify(file, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 })
    renameSync(tmp, this.path)
```

#### 缺口

- 真实网络、恢复和人时成本未知
  **影响**：不能推断净收益与生产安全
  **进一步探讨**：隔离 home 和低权限测试机执行一次只读命令并记录结果。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 绑定真实目标和结果状态是否能降低误重放？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

根据 Q03 可提出未验证假设：一次任务将已验证的主机公钥、解析后的目标、配置版本和作业 ID 一起冻结，取消或断线后明确记录结果未知并先查远端，再决定是否重试。相对按 alias 自动重连，潜在增量是避免目标变化与重复副作用，但需要远端支持可查询身份及额外存储。应对照标准 SSH 的 known_hosts、作业 ID 和人工日志，以及简单的调用修补，比较断线／重配时的误重放和操作负担；若普通工具已能等价解决或远端不提供可靠识别，则不推广。没有原型及运行实验。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:493-518](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/engine/connection-pool.ts#L493-L518)

故障时可重新获取连接并重试。

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:593-634](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-ssh/src/engine/connection-pool.ts#L593-L634)

失联或取消下的执行结果处理。

<details>
<summary>查看原文（42行）</summary>

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
        })
        stream.on('error', (streamError: Error) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          if (aborted) {
            resolve(cancelledResult())
            return
          }
          reject(streamError)
        })
      })
    })
  })
```

</details>

#### 缺口

- 方案没有原型、可查询远端身份或实验
  **影响**：不能证明减少重复副作用
  **进一步探讨**：对照 known_hosts、远端作业 ID 和人工日志进行断线实验。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
