# dsh-ssh

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[6b984b1](https://github.com/zhu1090093659/dsh-web/tree/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh)

<!-- BEGIN META -->
[![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 85,040](https://img.shields.io/static/v1?label=npm+30d&message=85%2C040&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh)
<!-- END META -->

> **实现功能**：在 DSH 中管理 SSH 主机，提供远端命令、Web 终端、文件传输、隧道和集群工具。

> **核心亮点**：相对另开SSH终端和重复填写主机配置，它让界面与6个模型工具共用受控主机清单、连接池和生命周期，配置变更时清理旧连接与隧道，集群调用要求非空选择器。SSH协议及SFTP来自ssh2；本插件贡献是DSH工作流接线与主机配置归属。[Q02](#research-q02)

> **风险与缺陷**：连接断开且没有退出状态时会在预算内重连重放命令，因而非幂等操作可能已经在远端成功却再次执行；取消分支不重放只是局部保护。传输还使用宿主本机权限读写路径，密码可明文保存在私有文件。这些是明确设计边界，不能把loopback路由或默认提示当作远端业务副作用保证。[Q03](#research-q03)

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
  - [Q01 · 模型接入远端运维改变了什么交接，什么才算办结？](#detail-section-11)
  - [Q02 · 如何统一主机身份、连接和模型工具？](#detail-section-12)
  - [Q03 · 断线重试会不会重复远端操作，权限边界在哪里？](#detail-section-13)
  - [Q04 · 凭据、主机权限和恢复成本由谁承担？](#detail-section-14)
  - [Q05 · 如何处理结果未知而非一律重放，谁能先试？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为需要从 DSH 查看和操作远程服务器的运维开发者，将主机清单、终端、文件传输、隧道与集群命令接到同一宿主连接池和模型工具。合格交付应是正确主机上的预期远端状态与可追溯结果，连接成功或命令退出码本身不足以验收部署。

终端OpenSSH、SFTP客户端和运维脚本为直接替代。比较要固定主机、命令与权限，计入对账和失败补偿，不用工具数量衡量收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| ssh_list/ssh_exec | 发现配置主机并执行远端命令 | 用户先配置；断线可能重放非幂等命令 |
| ssh_upload/ssh_download | 本机与远端传文件 | 本机路径使用宿主权限，不继承bash工作区沙箱 |
| ssh_tunnel | 访问远端服务 | 本地监听loopback，主机信任仍需核对 |
| ssh_cluster | 多主机并发执行 | 必须提供非空选择器，业务副作用需独立约束 |
| Web终端与主机面板 | 用户直接管理与交互 | 凭据私有文件不等于加密；输出可能含敏感信息 |

<a id="dependencies-and-flow"></a>

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH >=0.2.1-rc.3、Node ^22.19或>=24 | 启动必需 | 挂载宿主与Web工具面 | 版本兼容本轮未运行验收 |
| 用户配置主机与SSH认证 | 远端操作必需 | 确定目标和权限 | 模型不能自行创建主机配置 |
| 可达远端与足够账号权限 | 效果必需 | 命令、传输和隧道 | 断线可能触发重放，先评估命令幂等性 |
| 私有本地配置文件与可信主机 | 凭据使用必需 | 保存主机配置或agent路径 | 密码/口令为明文；转发agent扩大远端信任 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户安装并配置测试主机 | 先验证身份、权限和只读命令 |
| 2 | 用户选择目标与允许的任务 | 集群必须给非空alias/environment/tags |
| 3 | 工具通过共享池执行并回传结果 | 核对目标状态；输出可能含敏感数据 |
| 4 | 断线后用户核对实际远端副作用 | 非幂等任务不以缺退出码当作未执行 |
| 5 | 用户禁用或改配置 | 检查连接、终端和隧道确实释放 |

<a id="cost-and-value"></a>

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 远端机器、网络和插件资源 | 主机配置、认证和权限核对 | 金额与配置时间未测 |
| 持续使用 | 连接、命令、文件流量及模型调用 | 审核命令、目标选择和结果 | 连接复用不代表业务成本下降 |
| 失败恢复 | 重连、重复命令或传输资源 | 远端对账、去重复与补偿 | 非幂等重放及无续传增加恢复负担 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 配置复用 | UI和工具共享HostStore/SshEngine | 相比终端总耗时变化 |
| 生命周期 | 改配置或删alias清理连接和隧道 | 断网、多跳和终端的真实恢复 |
| 远端交付 | 超时、输出和集群范围约束 | 最终业务状态正确、无重复执行 |

> **思考**：连接断开且没有退出状态时会在预算内重连重放命令，因而非幂等操作可能已经在远端成功却再次执行；取消分支不重放只是局部保护。传输还使用宿主本机权限读写路径，密码可明文保存在私有文件。这些是明确设计边界，不能把loopback路由或默认提示当作远端业务副作用保证。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对另开SSH终端和重复填写主机配置，它让界面与6个模型工具共用受控主机清单、连接池和生命周期，配置变更时清理旧连接与隧道，集群调用要求非空选择器。SSH协议及SFTP来自ssh2；本插件贡献是DSH工作流接线与主机配置归属。[Q02](#research-q02)

相对另开SSH终端和重复填写主机配置，它让界面与6个模型工具共用受控主机清单、连接池和生命周期，配置变更时清理旧连接与隧道，集群调用要求非空选择器。SSH协议及SFTP来自ssh2；本插件贡献是DSH工作流接线与主机配置归属。[Q02](#research-q02)

单一engine与配置变更清理避免旧凭据连接残留，取消与逻辑错误不重放值得复用。需要将连接恢复与业务操作恢复分开，宿主路径权限和明文凭据也必须明确呈现。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

连接断开且没有退出状态时会在预算内重连重放命令，因而非幂等操作可能已经在远端成功却再次执行；取消分支不重放只是局部保护。传输还使用宿主本机权限读写路径，密码可明文保存在私有文件。这些是明确设计边界，不能把loopback路由或默认提示当作远端业务副作用保证。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉SSH权限与远端状态核对的用户，可在无重要凭据的测试主机先试只读命令和小文件传输。先验证断线、取消、目标选择及禁用后资源释放；生产变更和非幂等命令需有独立审批、备份与结果对账。若需要把工具限制在工作区沙箱或要求凭据加密存储，当前方案应先观察。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持统一运维入口和连接生命周期；明文凭据、宿主路径权限与断线重放为明确边界；未运行远端任务，结果对账假设未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-ssh/README.md、packages/dsh-ssh/package.json、packages/dsh-ssh/src/index.ts、packages/dsh-ssh/src/store.ts、packages/dsh-ssh/src/engine.ts、packages/dsh-ssh/src/tools.ts、packages/dsh-ssh/src/tool-surface.ts、packages/dsh-ssh/src/engine/connection-pool.ts 及固定范围 inventory；组件：packages/dsh-ssh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读宿主接线、store、engine门面、工具和连接池重试；未全审SSH身份验证、多跳、PTY及SFTP实现，不连接远端或执行任何任务。
- 下一步：临时服务器验证目标选择、只读exec、文件传输和禁用清理，再用标记写操作在完成后断网，核对重试次数与远端状态。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.8（[固定提交 6b984b1](https://github.com/zhu1090093659/dsh-web/tree/6b984b10950f78f1f4a5b5adf4c16636b5e6113d)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是将命令区分只读/幂等/未知副作用，未知副作用断线后先进入结果待对账状态，以操作ID和远端结果探针核对，再由用户决定是否重放。由“无退出码→重连”的不确定结果推导，增量是恢复语义而非更激进重试。临时服务器中故意在副作用完成后断网，比较重复写入、人工对账和恢复时间；若远端无法提供可靠结果探针，保持未知，不自动补跑。[Q05](#research-q05)

临时服务器验证目标选择、只读exec、文件传输和禁用清理，再用标记写操作在完成后断网，核对重试次数与远端状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：packages/dsh-ssh；内容摘要：def05ce103df616ca425151067d78bcf334d49e3fb90ce7a35b66c67983cc493。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 101 | — | — | 1649 |
| .ts | source | 6 | 2020 | 1440 | 471 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/zhu1090093659/dsh-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查共享SSH运维入口的机制贡献、重连重放与宿主权限边界，以及可控试用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模型接入远端运维改变了什么交接，什么才算办结？

**研究主题**：场景与需求

#### 完整回答

用户在GUI建立主机清单后，模型才可使用6个SSH工具，与Web终端、SFTP和隧道共用配置。基线是OpenSSH命令、独立终端和文件传输客户端，成熟协议不是本项目原创。它减少重复目标配置与界面切换，但合格任务要核对目标主机上的最终结果，例如文件内容与服务状态；一次echo或退出码0仅支持对应命令。集群任务还须限定明确选择器，不能把所有服务器作为默认目标。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-ssh/README.md:18-35](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/README.md#L18-L35)

作者定义能力及共享配置

<details>
<summary>查看原文（18行）</summary>

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
| Web terminal | xterm.js + WebSocket PTY terminal, auto-sizing, real-time output |
| File transfer | SFTP upload (browser file picker, NDJSON progress stream), download (progress bar + browser save); remote directory browsing |
| Port forwarding | Local port-forward tunnel (listens on 127.0.0.1 only) to reach a remote database / intranet service; list / stop supported |
| Cluster execution | One command run concurrently across many hosts (filter by alias / environment / tag, default concurrency 8) |
| Agent tools | `ssh_list` / `ssh_exec` / `ssh_upload` / `ssh_download` / `ssh_tunnel` / `ssh_cluster`; GUI and Agent share the same host config |

The panel loads its contents on first open. Closing and reopening it preserves the selected tab, form drafts and terminal session. The tunnel list refreshes every five seconds while its tab, panel and browser page are visible; automatic reads pause when hidden, resume immediately on return, and do not overlap slow reads. Port forwarding itself continues in the Host.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/tools.ts:400-406](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/src/tools.ts#L400-L406)

集群工具要求明确范围

```text
    async execute(args, exec) {
      const hasSelector = (Array.isArray(args.aliases) && args.aliases.some((alias) => typeof alias === 'string' && alias.trim() !== '')) ||
        (typeof args.environment === 'string' && args.environment.trim() !== '') ||
        (Array.isArray(args.tags) && args.tags.some((tag) => typeof tag === 'string' && tag.trim() !== ''))
      if (!hasSelector) throw new Error('ssh_cluster requires aliases, environment, or tags to limit the target set')
      // Cancellation reaches every host's in-flight command.
      return { results: await engine.cluster({ ...args, signal: exec.signal }) }
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何统一主机身份、连接和模型工具？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

apply建立HostStore与SshEngine实例，用effect在卸载时dispose；6个工具绑定同一engine，启用状态统一控制其注册。engine门面把每alias的连接池、SFTP、PTY和tunnel模块接到同一实例，dropAlias清理该alias隧道和连接，防止配置更新后复用旧凭据。HostStore用临时文件加rename保存，坏文件移旁留待恢复。贡献在宿主工作流和配置生命周期，不是SSH加密或SFTP协议。全局工具可见性需要宿主scope限制，不能把普通引导提示当权限系统。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/index.ts:148-180](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/src/index.ts#L148-L180)

统一store/engine和6工具接线

<details>
<summary>查看原文（33行）</summary>

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
  ]
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine.ts:117-162](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/src/engine.ts#L117-L162)

传输、隧道和alias清理

<details>
<summary>查看原文（46行）</summary>

```text
  /** Upload one local file (or directory tree) to a remote path. */
  async upload(alias: string, localPath: string, remotePath: string, recursive: boolean, onProgress?: (progress: TransferProgress) => void): Promise<{ bytes: number; files: number }> {
    return upload(this, alias, localPath, remotePath, recursive, onProgress)
  }

  /** Download one remote file to a local path. */
  async download(alias: string, remotePath: string, localPath: string, onProgress?: (progress: TransferProgress) => void): Promise<{ bytes: number }> {
    return download(this, alias, remotePath, localPath, onProgress)
  }

  /** List a remote directory (file browser). */
  async ls(alias: string, path: string): Promise<import('./protocol.ts').RemoteDirEntry[]> {
    return ls(this, alias, path)
  }

  // ------------------------------------------------------------- tunnel

  /** Start a local port-forward tunnel (listens on 127.0.0.1 only). */
  async startTunnel(alias: string, options: { remotePort: number; remoteHost?: string; localPort?: number }): Promise<TunnelInfo> {
    return startTunnel(this, alias, options)
  }

  /** All active tunnels. */
  listTunnels(): TunnelInfo[] {
    return listTunnels(this)
  }

  /** Stop one tunnel (closes the listener, live sockets, and the pinned connection). */
  stopTunnel(id: string): boolean {
    return stopTunnel(this, id)
  }

  /** Stop all tunnels (optionally for one alias). */
  stopAllTunnels(alias?: string): number {
    return stopAllTunnels(this, alias)
  }

  /**
   * Drop every live artifact bound to one alias: stop its tunnels and close
   * the pooled connection. Host entries that are deleted or whose connection
   * fields change must never keep serving a stale, previously authenticated
   * connection — the next operation re-connects from the current config.
   */
  dropAlias(alias: string): void {
    stopAllTunnels(this, alias)
    disposeRecord(this, alias)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/store.ts:383-403](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/src/store.ts#L383-L403)

坏文件保留与私有原子写入

<details>
<summary>查看原文（21行）</summary>

```text
    } catch {
      // A corrupt store must not brick the plugin — and must not be silently
      // overwritten by the next save: rename it aside for manual recovery
      // (the plugin then starts from an empty list).
      this.cache = undefined
      try {
        renameSync(this.path, `${this.path}.corrupt-${Date.now()}`)
      } catch { /* best effort */ }
      return { version: FORMAT_VERSION, hosts: [] }
    }
  }

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

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/tool-surface.ts:13-18](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/src/tool-surface.ts#L13-L18)

共享工具全局注册与scope限制的归属

```text
 * - 21 of the 22 official tool packages register their tools GLOBALLY and gate
 *   them with a setting, not per agent. Only the Agent Teams tool package —
 *   whose tools belong to one membership — installs into each `agent.ctx`.
 *   This family follows the majority: registration stays global so the
 *   registry's per-scope `restrict()` mask (which filters inherited global
 *   tools and REJECTS scope-local names) can still withhold these tools.
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 断线重试会不会重复远端操作，权限边界在哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

withClient只在连接被标记broken时重试，取消signal直接抛出而不重放，健康连接上的逻辑错误也不重试。这些是有价值的边界。但exec通道关闭没有数字退出状态且没有超时时会reject，促使broken连接重连；远端可能已经完成写入而结果未回到客户端，故不能保证at-most-once。README直接说明非幂等命令重放风险。工具传输把localPath交给engine，没有在该工具入口看到workspace沙箱限定，作者也声明为宿主权限读写。密码/口令明文由0600文件保护，不是加密存储。未做故障实验，不能宣称已发生重复部署或泄露。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:493-522](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/src/engine/connection-pool.ts#L493-L522)

重试与取消、健康错误边界

<details>
<summary>查看原文（30行）</summary>

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
      record.inFlight -= 1
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:598-609](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/src/engine/connection-pool.ts#L598-L609)

无退出状态触发重连路径

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/tools.ts:190-220](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/src/tools.ts#L190-L220)

本机路径直接转交上传engine

<details>
<summary>查看原文（31行）</summary>

```text
/** The upload tool. */
export function sshUploadTool(engine: SshEngine) {
  return defineTool({
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
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) }
```

</details>

**依据 4 · 作者声明**：[packages/dsh-ssh/README.md:39-50](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/README.md#L39-L50)

作者凭据与权限模型

<details>
<summary>查看原文（12行）</summary>

```text
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

#### 缺口

- 未验证副作用完成后断网的实际重放条件
  **影响**：不能确认特定服务器和命令是否产生重复结果
  **进一步探讨**：在临时服务器以带唯一标记的写操作制造断网，核对真实写入次数及返回状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 凭据、主机权限和恢复成本由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

package指定Node与DSH版本，SSH连接依赖用户GUI或配置导入、目标认证和网络。连接池降低重复握手的潜力，但每个命令仍有远端资源、模型审核和敏感输出负担；密码及口令存于私有明文配置，agent认证则只存socket路径。首次要核对主机身份与权限，持续要复核选择范围和结果，失败要对账远端副作用和部分文件。金额、耗时与恢复频率未知，尤其没有续传时不能按一次成功传输估算成本。表格见[成本与效果](#cost-and-value)，运行条件见[依赖与流程](#dependencies-and-flow)。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/package.json:7-10](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/package.json#L7-L10)

Node要求

```text
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

**依据 2 · 源码核查**：[packages/dsh-ssh/package.json:25-40](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/package.json#L25-L40)

DSH与client要求

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "engines": {
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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/store.ts:395-403](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/src/store.ts#L395-L403)

本地配置私有文件而非加密

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

**依据 4 · 作者声明**：[packages/dsh-ssh/README.md:87-97](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/README.md#L87-L97)

作者重连、代理与续传限制

<details>
<summary>查看原文（11行）</summary>

```text
## Known limitations

- The remote target path of an upload must be an absolute path (relative paths are rejected).
- Download does not support a whole directory yet (download files individually); upload supports recursive directories (walks the local directory and transfers file by file).
- exec auto-reconnect on disconnect (up to 3 times) may re-execute non-idempotent commands — watch out for side effects on long commands.
- A ProxyJump hop is either a host alias configured in this plugin or an OpenSSH `[user@]host[:port]` address; an address hop has no stored credentials, so it reuses the target host's authentication (configure a host entry when the hop needs its own).
- `proxyCommand` and `proxyJump` cannot be combined on one host (OpenSSH resolves them by "whichever appears first in the config"; a stored entry has no order, so the plugin rejects the pair), and only the first hop of a chain may declare a ProxyCommand.
- A ProxyCommand is executed through the user's shell, so it inherits the DSH process's `PATH` and environment. On Windows the shell is killed without its process group, so a client it spawned may outlive the transport.
- The ssh_config import expands `Include` (globs, `~`, several pathnames, relative to the config directory) but not environment variables or `%` tokens, and a multi-pattern `Host a b` line still imports only its first pattern.
- Resume (broken-transfer continuation) is not implemented yet.
- The transfer of Agent tools is a host-machine local path (same semantics as ssh-skill).
```

</details>

#### 缺口

- 缺并发、文件规模与失败恢复样本
  **影响**：不能量化总成本或相对OpenSSH的节时优势
  **进一步探讨**：同任务比较终端与插件，纳入模型审核、重复修正和传输失败

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何处理结果未知而非一律重放，谁能先试？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前实现对取消与断线分开处理，说明可以继续细化结果语义。提议对命令按副作用性质和可靠结果探针建模，断线后先进入unknown，不在缺退出码时假定没执行。只读命令可明确允许重试，写任务需操作ID和远端记录，无法对账时保留未知并交用户。对照测试以临时远端同一写入任务在完成后断网，观察重放、遗漏及人工恢复时间；不能仅用命令返回“成功”计分。当前可控采用限定测试主机、只读任务和小文件，生产改变另需独立恢复方案。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:507-517](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/src/engine/connection-pool.ts#L507-L517)

取消、连接状态和重放的分支

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:598-609](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-ssh/src/engine/connection-pool.ts#L598-L609)

结果未知触发重试是改进依据

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

#### 缺口

- 副作用分类和远端结果探针可用性未验证
  **影响**：新设计不能承诺exactly-once，也不能计入现有能力
  **进一步探讨**：先验证带操作ID的单一业务，再比较未知结果与自动重放的恢复质量

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
