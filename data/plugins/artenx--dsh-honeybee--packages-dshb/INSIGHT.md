# DSH-HoneyBee

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[ab3a9a4](https://github.com/Artenx/dsh-honeybee/tree/ab3a9a4aad213dd6d2f9e773644583bde9180b29/packages/dshb)

<!-- BEGIN META -->
[![npm 30d 2,574](https://img.shields.io/static/v1?label=npm+30d&message=2%2C574&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@artenx/dshb) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@artenx/dshb)
<!-- END META -->

> **实现功能**：将 DSH 文件、命令和终端操作路由到本地、SSH 或 Docker 节点，并管理认证与工作区绑定。

> **核心亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持控制端保持会话、执行面按工作区映射到节点的资源组织变化。最长前缀binding和unrouted显式失败减少误本机执行风险；SSH、Docker及Cookie本身继承成熟技术。

> **风险与缺陷**：[Q03](#research-q03) 表明连接重试不能解决有副作用命令的结果未知，认证入口也不是多租户隔离。它把用户SSH终端负担转为管理端运维，须把这部分算入采用成本。

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
  - [Q01 · 多节点路由优于手开SSH在哪里？](#detail-section-11)
  - [Q02 · 单一安装如何把工具操作送到正确节点？](#detail-section-12)
  - [Q03 · 登录门与SSH重试能否证明远端操作安全可恢复？](#detail-section-13)
  - [Q04 · 多节点便利是否值得运维负担？](#detail-section-14)
  - [Q05 · 执行身份与完成凭证可否改善重连恢复？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向从Web甚至手机发起DSH任务、但代码和工具在另一台主机或容器的人。合格结果是同一会话在指定节点读写文件、执行命令并取回产物；手开SSH需用户同步目录、终端和对话上下文。此包将会话与模型控制留在管理端，把文件、shell和PTY指向绑定节点，改变执行资源组织而非新增模型能力。它适合单管理员工作台，不能因有认证就宣称多租户隔离。

参照手开SSH/Docker终端与本地DSH工作流，未宣称运行效率或安全排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工作区节点绑定 | 同会话路由文件和命令 | 最长镜像路径前缀，provider缺失报错 |
| SSH执行 | 访问远端文件与进程 | 目标账号权限和网络 |
| Docker节点管理 | 供给及使用容器执行环境 | 需Docker Engine和镜像 |
| 单管理员认证门 | 限制Web入口 | loopback例外，不代表多租户隔离 |
| PTY路由 | 在绑定节点终端执行 | 依赖terminalController兼容 |

#### 启动与依赖
| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.13与对应DSH | 声明必需 | 运行bundle | 其他版本未知 |
| webServer/credentials/fs/shell/subprocess | 必需 | 管理与路由 | 子入口可能无法加载 |
| SSH目标账号及网络 | SSH操作必需 | 执行与文件访问 | auth或网络失败 |
| Docker Engine与镜像 | Docker操作必需 | 容器供给 | 不能建相应world |
| 单管理员可信部署 | 采用必要 | 限定权限范围 | 多租户未获证据 |

#### 启动步骤
| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 加载 | 用户安装并重启Web profile | 多子入口齐备 |
| 建节点 | 用户配置SSH/Docker并测试 | 账号和节点身份正确 |
| 绑定 | 用户从目录树选工作区 | mirror映射到预期remotePath |
| 验收 | 用户试fs/shell/PTY和断线 | 文件在远端，失败不落本地 |

#### 成本
| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 管理端、云机或Docker资源 | 配凭据、节点、目录绑定 | 价格与耗时未知 |
| 持续使用 | 模型仍在管理端，远端算力网络镜像 | 更新宿主、镜像、信任与连接 | 心跳每5分钟 |
| 失败恢复 | 重连与潜在重复任务资源 | 查控制端和远端副作用、重建绑定 | 结果未知不能盲重跑 |

#### 效果
| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨节点执行 | binding与provider路由 | 端到端工具/PTY兼容 |
| 误本机降级保护 | unrouted明确报错 | 所有装饰分支一致性 |
| 远端管理 | 注册表和心跳 | 长时间运行与恢复负担 |

> **思考**：[Q03](#research-q03) 表明连接重试不能解决有副作用命令的结果未知，认证入口也不是多租户隔离。它把用户SSH终端负担转为管理端运维，须把这部分算入采用成本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持控制端保持会话、执行面按工作区映射到节点的资源组织变化。最长前缀binding和unrouted显式失败减少误本机执行风险；SSH、Docker及Cookie本身继承成熟技术。

[Q01](#research-q01) 与 [Q02](#research-q02) 支持控制端保持会话、执行面按工作区映射到节点的资源组织变化。最长前缀binding和unrouted显式失败减少误本机执行风险；SSH、Docker及Cookie本身继承成熟技术。

WorldResolver使文件与进程共享节点选择，可复用为多后端路由；最长前缀匹配与不可路由显式错误值得保留。直接装饰宿主服务带来加载顺序和升级耦合，移植须逐个验证fs、shell、subprocess及PTY契约。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 表明连接重试不能解决有副作用命令的结果未知，认证入口也不是多租户隔离。它把用户SSH终端负担转为管理端运维，须把这部分算入采用成本。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已会维护SSH或Docker、单管理员、能用可丢弃工作区验收的开发者先试。首次需要管理端、目标节点、凭据、目录绑定及Docker引擎；持续承担云机、网络、镜像与连接心跳，模型仍在管理端计费。失败需分清控制端、通道和执行端，查远端文件和进程而不能盲重跑。用一个只写测试文件的任务验证fs、shell、PTY同节点和产物读回，模拟断线确认不会误落本机；若节点身份混淆、权限超预期或副作用无法解释，应停止。资源金额、延迟和恢复耗时未测。 [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

bundle接线、binding和工具路由有源码支持；远端全链安全、断线和宿主组合未验收；执行凭证是假设。

- 已检查：作者 README、包清单、源码路径 README.md、packages/dshb/README.md、packages/dshb/cordis.patch.yml、packages/dshb/src/index.ts、packages/dshb/src/ui/index.ts、packages/dshb/src/core/index.ts、packages/dshb/src/core/workspace-bindings.ts、packages/dshb/src/router/resolve.ts、packages/dshb/src/router/index.ts、packages/dshb/src/auth/gate.ts、packages/dshb/src/exec-ssh/connection.ts 及固定范围 inventory；组件：packages/dshb。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：限定packages/dshb组件；核对bundle、core、binding、router、auth gate和SSH连接。根README仅作作者背景，不把全仓统计归组件。
- 下一步：- 已检查固定组件源码和bundle。
- 未执行远端、Docker、认证、测试或真实宿主。
- 断线完成状态及多装饰组合保留具体未知。

**分析版本**

- **仓库**：[Artenx/dsh-honeybee](https://github.com/Artenx/dsh-honeybee)
- **版本号**：0.1.15（[固定提交 ab3a9a4](https://github.com/Artenx/dsh-honeybee/tree/ab3a9a4aad213dd6d2f9e773644583bde9180b29)）
- **版本日期**：2026-09-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出节点/工作区身份与幂等请求完成凭证，未验证；按断线三个阶段测重复副作用和人工核对时间，不能将任意shell自动化重试。

- 已检查固定组件源码和bundle。
- 未执行远端、Docker、认证、测试或真实宿主。
- 断线完成状态及多装饰组合保留具体未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 18 | — | — | 75 |
| .ts | source | 58 | 6099 | 5472 | 52 | — |
| .tsx | source | 6 | 2494 | 2200 | 155 | — |
| .ts | test | 19 | 1642 | 1478 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Artenx/dsh-honeybee/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多执行节点路由能否让DSH工作区可靠转移到SSH或Docker并保住权限边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多节点路由优于手开SSH在哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向从Web甚至手机发起DSH任务、但代码和工具在另一台主机或容器的人。合格结果是同一会话在指定节点读写文件、执行命令并取回产物；手开SSH需用户同步目录、终端和对话上下文。此包将会话与模型控制留在管理端，把文件、shell和PTY指向绑定节点，改变执行资源组织而非新增模型能力。它适合单管理员工作台，不能因有认证就宣称多租户隔离。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-33](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/README.md#L22-L33)

作者说明控制面与执行面分工及单管理员范围。

<details>
<summary>查看原文（12行）</summary>

```text
一个 Web 入口同时驱动多台云主机或 Docker 容器。Agent 对话、LLM 调用、会话与持久化集中在管理端，文件读写、命令执行、终端操作透明分发到本地或远端节点执行。插件交付，不修改上游源码。适配手机浏览器，移动操作随手可及。

---

## 特性

- **多节点执行**：本地宿主、本地 Docker、远程 SSH、远程 Docker 四类工作节点，连接由管理端统一发起
- **容器生命周期管理**：创建带镜像的 Docker 节点自动供给容器，支持拉起 / 重启 / 停止
- **按需拉取产物**：远端产生的文件点击即下载查看，无需回写本地
- **凭据托管**：SSH 密码 / 私钥由管理端统一托管
- **节点管理 UI**：节点增删改查、测试连接、目录树式添加工作区，内置移动端屏幕适配
- **单管理员认证**：登录页 + 会话 Cookie，限制网络暴露入口
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 单一安装如何把工具操作送到正确节点？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

包根只导出UI入口，完整能力依赖cordis.patch插入auth、startup、core、router、SSH与Docker多个子入口。core提供NodeRegistry、KnownHosts、WorkspaceBindings并连接共享WorldResolver；binding按最长mirrorPath前缀映射nodeId和remotePath。router装饰fs、subprocess、shell与terminalController；没有绑定走local，有绑定却无provider返回unrouted并报错，而不是静默在本机执行。只有这条bundle接线全部成立，模型工具才会透明走远端。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dshb/cordis.patch.yml:1-17](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/packages/dshb/cordis.patch.yml#L1-L17)

整包能力由bundle多入口组合。

<details>
<summary>查看原文（17行）</summary>

```text
- id: web-startup
  disabled: true
- insert:
    - id: dshb-auth
      name: "@artenx/dshb/auth"
    - id: dshb-web-startup
      name: "@artenx/dshb/auth/startup"
    - id: dshb-core
      name: "@artenx/dshb/core"
    - id: dshb-router
      name: "@artenx/dshb/router"
    - id: dshb-exec-ssh
      name: "@artenx/dshb/exec-ssh"
    - id: dshb-exec-docker
      name: "@artenx/dshb/exec-docker"
    - id: dshb-ui
      name: "@artenx/dshb"
```

</details>

**依据 2 · 源码核查**：[packages/dshb/src/core/index.ts:19-42](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/packages/dshb/src/core/index.ts#L19-L42)

注册表、bindings和路由注入。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(ctx: Context): void {
  const knownHosts = new KnownHostsStore()
  const registry = new NodeRegistry(ctx)
  const bindings = new WorkspaceBindingsStore()
  let workspaceRegistry: { list(): Array<{ path: string; title: string }> } | undefined
  if (typeof ctx.inject === 'function') {
    ctx.inject(['workspaceRegistry'], (workspaceCtx: Context) => {
      workspaceRegistry = (workspaceCtx as unknown as { workspaceRegistry?: typeof workspaceRegistry }).workspaceRegistry
    })
  }
  ctx.provide('nodeRegistry', registry)
  ctx.provide('knownHosts', knownHosts)
  ctx.provide('workspaceBindings', bindings)
  ctx.provide('dshbAudit', sharedAuditLogger())
  sharedWorldResolver().setBindings(bindings)
  void registerNodeRoutes(ctx, registry, bindings, () => workspaceRegistry)
  void registerSshConfigRoutes(ctx, knownHosts)
  void registerWorkspaceRoutes(ctx, registry, bindings)
  void registerRemoteDownloadRoutes(ctx, registry, bindings)
  void registerWorkspaceInstructionRoutes(ctx, sharedWorkspaceInstructionStore())
  registerWorkspaceInstructionInjector(ctx)
  warmupWorlds(ctx, registry, bindings)
  startHeartbeat(ctx, registry)
  reprovisionDockerNodes(ctx, registry)
```

</details>

**依据 3 · 源码核查**：[packages/dshb/src/core/workspace-bindings.ts:76-90](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/packages/dshb/src/core/workspace-bindings.ts#L76-L90)

最长前缀映射。

<details>
<summary>查看原文（15行）</summary>

```text
  resolve(path: string): BindingHit | undefined {
    this.load()
    const target = normalize(path)
    let best: WorkspaceBinding | undefined
    for (const b of this.bindings) {
      const root = normalize(b.mirrorPath)
      if (target === root || target.startsWith(`${root}/`)) {
        if (!best || root.length > normalize(best.mirrorPath).length) best = b
      }
    }
    if (!best) return undefined
    const root = normalize(best.mirrorPath)
    const remoteRoot = normalize(best.remotePath)
    const suffix = target === root ? '' : target.slice(root.length)
    return { nodeId: best.nodeId, remotePath: normalize(`${remoteRoot}${suffix}`) }
```

</details>

**依据 4 · 源码核查**：[packages/dshb/src/router/index.ts:28-42](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/packages/dshb/src/router/index.ts#L28-L42)

PTY执行的local/unrouted/remote分支。

<details>
<summary>查看原文（15行）</summary>

```text
function decorateTerminalController(ctx: Context): void {
  ctx.inject(['terminalController'], (terminalCtx: Context) => {
    const controller = (terminalCtx as unknown as { terminalController: TerminalControllerLike }).terminalController
    const originalExecution = controller.execution.bind(controller)

    controller.execution = (agent) => {
      const execution = originalExecution(agent)
      const ref = sharedWorldResolver().resolve(agent.session.header.cwd)
      if (ref.kind === 'local') return execution
      if (ref.kind === 'unrouted') throw new Error(`node ${ref.nodeId} world not available`)

      const subprocess = Object.create(execution.subprocess) as SubprocessRuntime
      subprocess.terminalEnvironment = ref.provider.subprocess.terminalEnvironment.bind(ref.provider.subprocess)
      subprocess.resolveExecutable = ref.provider.subprocess.resolveExecutable.bind(ref.provider.subprocess)
      return { ...execution, subprocess }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 登录门与SSH重试能否证明远端操作安全可恢复？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

AuthGate对登录路径豁免、loopback放行、其余凭session Cookie判断，这是单管理员Web入口控制，不是对每个远端文件的权限证明。SSH权限仍取决于目标账号和容器权限。连接分类对auth/hostkey错误不重试，其他最多重试5次；连接恢复不等于已发命令可安全重做，断线时副作用是否发生仍需查目标。管理端对宿主服务做装饰，和其他装饰插件及宿主升级的组合行为也需验证。当前仅源码检查，不判断外网暴露或多用户部署安全。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dshb/src/auth/gate.ts:11-22](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/packages/dshb/src/auth/gate.ts#L11-L22)

loopback与cookie分支，范围为入口。

<details>
<summary>查看原文（12行）</summary>

```text
  decide(req: IncomingMessage): GateDecision {
    const path = new URL(req.url ?? '/', 'http://x').pathname
    if (path === '/login' || path.startsWith('/api/auth/')) return 'exempt'
    if (isLoopbackRequest(req.socket.remoteAddress, req.headers.host)) return 'allow'
    const secret = this.store.sessionSecret
    const username = this.store.username
    if (secret && username) {
      const value = readCookie(req.headers.cookie, SESSION_COOKIE)
      if (verifySession(value, secret, username)) return 'allow'
    }
    if (this.isPageRequest(req)) return 'redirect-login'
    return 'reject'
```

</details>

**依据 2 · 源码核查**：[packages/dshb/src/exec-ssh/connection.ts:94-125](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/packages/dshb/src/exec-ssh/connection.ts#L94-L125)

连接复用与错误分类重试。

<details>
<summary>查看原文（32行）</summary>

```text
  async getClient(): Promise<Client> {
    if (this.closed) throw toConnectionError(new Error('connection closed'))
    if (this.client) return this.client
    if (this.connecting) return this.connecting
    this.connecting = this.connectWithRetry()
    try {
      this.client = await this.connecting
      this.client.on('close', () => {
        this.client = null
      })
      this.client.on('error', () => {
        this.client = null
      })
      return this.client
    } finally {
      this.connecting = null
    }
  }

  private async connectWithRetry(): Promise<Client> {
    let lastErr: unknown
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (this.closed) throw toConnectionError(new Error('connection closed'))
      try {
        return await this.connectOnce()
      } catch (err) {
        lastErr = err
        const cat = classifySshError(err)
        if (cat === 'auth' || cat === 'hostkey') throw toConnectionError(err)
        if (attempt < MAX_RETRIES) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt)
          await new Promise((r) => setTimeout(r, delay))
```

</details>

**依据 3 · 源码核查**：[packages/dshb/src/router/index.ts:12-17](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/packages/dshb/src/router/index.ts#L12-L17)

宿主服务装饰耦合。

```text
export function apply(ctx: Context): void {
  ctx.provide('dshbRouter', sharedWorldResolver())
  decorateFileSystem(ctx.fs)
  decorateSubprocess(ctx.subprocess)
  decorateShell(ctx.shell)
  decorateTerminalController(ctx)
```

#### 缺口

- 断线命令完成状态、凭据/主机密钥信任全链及装饰组合未实测。
  **影响**：不能保证自动重连不会产生人工状态核对负担，也不能给生产暴露安全结论。
  **进一步探讨**：固定宿主、目标账号和容器权限，在任务中断时核对实际文件与进程，再检查认证和主机密钥拒绝路径。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 多节点便利是否值得运维负担？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合已会维护SSH或Docker、单管理员、能用可丢弃工作区验收的开发者先试。首次需要管理端、目标节点、凭据、目录绑定及Docker引擎；持续承担云机、网络、镜像与连接心跳，模型仍在管理端计费。失败需分清控制端、通道和执行端，查远端文件和进程而不能盲重跑。用一个只写测试文件的任务验证fs、shell、PTY同节点和产物读回，模拟断线确认不会误落本机；若节点身份混淆、权限超预期或副作用无法解释，应停止。资源金额、延迟和恢复耗时未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-42](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/README.md#L37-L42)

明确运行时与Docker前提。

```text
### 前置要求

- Node.js >= 22.13
- pnpm >= 11
- 一份可运行的 DSH 环境
- 使用 Docker 节点需目标宿主机预装 Docker Engine
```

**依据 2 · 源码核查**：[packages/dshb/src/core/index.ts:45-61](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/packages/dshb/src/core/index.ts#L45-L61)

每5分钟心跳是持续管理工作。

<details>
<summary>查看原文（17行）</summary>

```text
const HEARTBEAT_MS = 5 * 60 * 1000

function startHeartbeat(ctx: Context, registry: NodeRegistry): void {
  const tick = async (): Promise<void> => {
    const sshTester = ctx.get('dshbSshPool') as SshHandshakeTester | undefined
    const dockerTester = ctx.get('dshbDockerTester') as DockerNodeTester | undefined
    for (const node of registry.list()) {
      try {
        await testNode(registry, node.id, sshTester, undefined, dockerTester)
      } catch {
        // 单节点心跳失败不影响其他节点
      }
    }
  }
  const timer = setInterval(() => void tick(), HEARTBEAT_MS)
  ctx.effect(() => () => clearInterval(timer))
  setImmediate(() => void tick())
```

</details>

**依据 3 · 源码核查**：[packages/dshb/src/router/resolve.ts:27-34](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/packages/dshb/src/router/resolve.ts#L27-L34)

unrouted保留错误而非local降级。

```text
  resolve(absPath: string): WorldRef {
    const r = resolveWorld(absPath, this.bindings)
    if (r.kind === 'local') return { kind: 'local' }
    for (const reg of this.registries) {
      const provider = reg.get(r.nodeId)
      if (provider) return { kind: 'remote', provider, remotePath: r.remotePath }
    }
    return { kind: 'unrouted', nodeId: r.nodeId }
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 执行身份与完成凭证可否改善重连恢复？

**研究主题**：新假设与验证

#### 完整回答

binding已提供nodeId和remotePath，推导未验证方向是每次有副作用操作再绑定节点指纹、工作区身份及幂等请求ID，执行端保存完成凭证供断线后查询。相对只恢复连接，它可帮助区分没开始、完成和结果未回传，但需目标端持久日志、凭证回收与权限定义；不能假定shell任意命令都可自动幂等。最小实验让写文件任务在发送前、执行中和回传前断线，比较重复副作用、未知状态与人工排查时间；若凭证不能可靠归属节点或日志丢失，则否定其恢复优势。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dshb/src/core/workspace-bindings.ts:5-9](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/packages/dshb/src/core/workspace-bindings.ts#L5-L9)

现有绑定身份字段提供起点。

```text
export interface WorkspaceBinding {
  mirrorPath: string
  nodeId: string
  remotePath: string
  workspaceId?: string
```

**依据 2 · 源码核查**：[packages/dshb/src/exec-ssh/connection.ts:94-109](https://github.com/Artenx/dsh-honeybee/blob/ab3a9a4aad213dd6d2f9e773644583bde9180b29/packages/dshb/src/exec-ssh/connection.ts#L94-L109)

当前恢复连接不表达任务提交结果。

<details>
<summary>查看原文（16行）</summary>

```text
  async getClient(): Promise<Client> {
    if (this.closed) throw toConnectionError(new Error('connection closed'))
    if (this.client) return this.client
    if (this.connecting) return this.connecting
    this.connecting = this.connectWithRetry()
    try {
      this.client = await this.connecting
      this.client.on('close', () => {
        this.client = null
      })
      this.client.on('error', () => {
        this.client = null
      })
      return this.client
    } finally {
      this.connecting = null
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
