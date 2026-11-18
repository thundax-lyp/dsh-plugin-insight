# dsh-ssh

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DamonKoy/dsh-web-ui)
<!-- END META -->

> **功能**：在 DeepSeek Harness 网页管理 SSH 主机、打开终端、执行命令、传输文件与转发端口。

> **亮点**：[Q01](#research-q01) 显示，界面与模型共用主机别名和 SSH 引擎，可用交互终端接手并读取各自的命令结果。

> **主要限制**：[Q02](#research-q02) 显示，模型工具直接使用宿主进程的文件与远端权限，连接配置未设置 SSH 主机密钥核验；[Q03](#research-q03) 的超时与关闭设置也不能确认远端作用已停止。

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
  - [Q01 · 浏览器和模型如何发出同一项远程检查？](#detail-section-11)
  - [Q02 · 本地请求限制能否替代调用者权限、SSH 对端身份与文件授权？](#detail-section-12)
  - [Q03 · 连接中断、命令超时和禁用时会留下什么？](#detail-section-13)
  - [Q04 · 哪种对照能验证采用收益和授权边界？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用 DSH Web 检查多台测试主机的维护者可在同一面板管理别名、开终端，并让 Agent 为已知目标采集状态。

已有 OpenSSH、SFTP 或脚本可以管理同样的主机。这个插件减少在 DSH、独立终端和主机管理表之间的切换。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 配置与别名 | 集中管理 SSH 目标及跳板 | 宿主 JSON 持有敏感字段 |
| 远程命令与终端 | 检查指定主机并回读输出 | 远端授权独立核查，超时需确认动作 |
| SFTP | 上传或下载已授权路径 | 以宿主文件权限读写 |
| 本地转发 | 从宿主访问远端服务 | 回环监听，停止时释放关联连接 |
| 集群执行 | 对多个明确目标汇总结果 | 默认可包含配置全集，需确认目标 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Cordis、webServer、后台工具服务和 DSH Web 客户端 | 正常加载需要 | 打开 SSH 面板、接口与模型工具 | 接线可能缺失 |
| SSH 服务及可用认证 | 远端操作需要 | 连接配置别名及跳板 | 拒绝连接，核对目标与凭据 |
| 已核对本地与远端身份及权限范围 | 采用需要 | 控制命令、路径和连接对象 | 保持独立 SSH 工作流 |
| 宿主可写数据路径 | 保存主机设置时需要 | 保存带凭据的 JSON | 不能完成配置变更 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者先做独立账号、无敏感测试数据和对端校验 | 可解释账号和远端身份后继续 |
| 检查 | 在已有工具中跑同一个只读命令并核对日志 | 只以指定别名与退出状态对照 |
| 退出 | 操作者停止转发和 shell，卸载后复查 | 本地监听关闭，远端状态已确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 测试机与连接环境占资源 | 配置账号、主机及授权 | 费用与安装耗时未知 |
| 持续 | SSH 池、终端流和文件使用网络与宿主 | 核实输出、批量范围和路径 | 单位任务成本未测 |
| 失败恢复 | 重试或补取文件可能再次传输 | 复核未知远端作用及本地监听 | 恢复耗时与实测失败频率未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 共享操作入口 | GUI 与模型找到同一别名并执行 | 真实宿主兼容、实际节时 |
| 诊断 | 分命令返回 stdout、stderr、超时和退出；集群逐主机报告 | 断链后的实际远端结果 |
| 退出 | 显式停隧道和完整 dispose 清理池 | 设置关闭后的终端或端口实际残留 |

> **思考**：[Q02](#research-q02) 显示，模型工具直接使用宿主进程的文件与远端权限，连接配置未设置 SSH 主机密钥核验；[Q03](#research-q03) 的超时与关闭设置也不能确认远端作用已停止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 显示，界面与模型共用主机别名和 SSH 引擎，可用交互终端接手并读取各自的命令结果。

配置存储、连接池、终端、SFTP 及面板有独立入口，逐主机结果便于定位失败。实际重连分支和作者所述次数存在差异，且禁用界面与引擎销毁作用域不同。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 显示，模型工具直接使用宿主进程的文件与远端权限，连接配置未设置 SSH 主机密钥核验；[Q03](#research-q03) 的超时与关闭设置也不能确认远端作用已停止。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先观察已有测试环境里的授权与对端身份。只有可以确认独立账号、目标路径、远端状态与退出步骤时才考虑试验；日常继续用已配置保护的原有工具。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 SSH 连接、命令、终端、SFTP 和转发接线。实际 SSH 对端、目标宿主授权与恢复状态未核验。

- 已检查：作者 README、包清单、源码路径 packages/dsh-ssh/README.md、packages/dsh-ssh/package.json、packages/dsh-ssh/cordis.patch.yml、packages/dsh-ssh/tsdown.config.ts、packages/dsh-ssh/src/index.ts、packages/dsh-ssh/src/client/index.ts、packages/dsh-ssh/src/routes.ts、packages/dsh-ssh/src/tools.ts、packages/dsh-ssh/src/engine/connection-pool.ts、packages/dsh-ssh/src/store.ts、packages/dsh-ssh/src/engine/sftp.ts、packages/dsh-ssh/src/engine/cluster.ts、packages/dsh-ssh/src/engine/tunnel.ts、packages/dsh-ssh/src/engine.ts 及固定范围 inventory；组件：packages/dsh-ssh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖固定包的实际调用。SSH 登录、目标网络和锁定制品、宿主访问控制及真实恢复未验证。
- 下一步：在隔离账号下比较两台显式别名的只读状态，复核主机身份变化、被拒本地路径、SSH 中断及禁用前后的连接状态。

**分析版本**

- **仓库**：[DamonKoy/dsh-web-ui](https://github.com/DamonKoy/dsh-web-ui)
- **版本号**：0.1.16（[固定提交 3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出为模型操作增加可核对的目标、路径和命令范围确认，用受控样本比较范围错误与完成代价。

在隔离账号下比较两台显式别名的只读状态，复核主机身份变化、被拒本地路径、SSH 中断及禁用前后的连接状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 175 | — | — | 1889 |
| .ts | source | 21 | 3558 | 2854 | 535 | — |
| .tsx | source | 8 | 1320 | 1105 | 136 | — |
| .ts | test | 10 | 2006 | 1696 | 142 | — |
| .tsx | test | 2 | 141 | 107 | 20 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：从 DSH Web 管理少量隔离测试主机时，SSH 面板和模型工具可以完成哪些操作，连接、权限与失败边界会如何改变是否采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 浏览器和模型如何发出同一项远程检查？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

重复检查几个自己管理的测试主机时，操作者可从 DSH Web 建立主机别名、手动使用终端，再把只读检查交给同一宿主里的 Agent。合格结果能辨认实际目标、命令退出、输出和另一台失败主机。手工使用 OpenSSH、SFTP 和自己的批处理脚本已经能做到这些；本包把配置与结果入口收拢到 DSH，同一引擎既处理面板又处理工具。

profile 补丁挂载模块后，宿主创建 HostStore 和 SshEngine，注册模型工具、HTTP 及 WebSocket 升级。浏览器实际挂上侧栏和面板，HTTP exec 从 JSON 读别名、命令后直调同一引擎；模型 ssh_exec 也调用同一方法，取得成功、退出码或超时等结构化结果。终端 WebSocket 则打开交互 shell，将 input 与 resize 转给会话，并把输出或退出反馈给页面；断线时关闭对应 shell。面板相对手动工具增量在于复用同一套主机配置和异步操作入口，仍需要有独立原因才把远程任务搬进模型环境。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/index.ts:77-93](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/index.ts#L77-L93)

宿主从同一实例接出 HTTP、WS 与模型工具。

<details>
<summary>查看原文（17行）</summary>

```text
  const store = new HostStore()
  const engine = new SshEngine(store)
  ctx.effect(() => () => { engine.dispose() }, 'dsh-ssh: engine')

  // The /api/dsh-ssh route family + terminal upgrade.
  const { routes, upgrade } = makeRoutes({ store, engine })
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

**依据 2 · 源码核查**：[packages/dsh-ssh/src/index.ts:124-141](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/index.ts#L124-L141)

宿主实际注册路由、升级和工具。

<details>
<summary>查看原文（18行）</summary>

```text
    disposeRoutes = ctx.effect(
      () => {
        const disposers = routes.map(route => ctx.webServer.register(route))
        const upgradeDisposer = ctx.webServer.registerUpgrade(upgrade)
        return () => {
          for (const dispose of disposers) dispose()
          upgradeDisposer()
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

**依据 3 · 源码核查**：[packages/dsh-ssh/src/client/index.ts:52-67](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/client/index.ts#L52-L67)

浏览器挂载及清理面板和侧栏。

<details>
<summary>查看原文（16行）</summary>

```text
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-ssh: dictionaries')

  const controller = new PanelController()
  const api = new SshApi()
  const disposers: Array<() => void> = []
  try {
    disposers.push(mountSidebarEntry(controller))
    disposers.push(mountPanel(controller, api))
  } catch (error) {
    // DOM failures degrade the panel, never the GUI.
    console.warn('[dsh-ssh] mount failed:', error)
  }
  ctx.effect(() => () => {
    for (const dispose of disposers.splice(0)) dispose()
  }, 'dsh-ssh: ui mounts')
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/routes.ts:231-246](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/routes.ts#L231-L246)

HTTP 入口从别名和命令触发同一 exec。

<details>
<summary>查看原文（16行）</summary>

```text
      path: SSH_API.exec,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        const body = await readJsonBody(req)
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
          writeJson(res, 500, { error: error instanceof Error ? error.message : String(error) })
        }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/tools.ts:120-147](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/tools.ts#L120-L147)

模型工具返回实际引擎结构化结果。

<details>
<summary>查看原文（28行）</summary>

```text
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
    async execute(args) {
      try {
        return await engine.exec(args.alias, args.command, args.timeoutMs)
      } catch (error) {
        return {
          success: false,
          exitCode: null,
          timedOut: false,
          stdout: '',
          stderr: '',
          durationMs: 0,
          error: error instanceof Error ? error.message : String(error),
        }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/routes.ts:488-508](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/routes.ts#L488-L508)

WebSocket 建立交互 shell 并发输出和退出。

<details>
<summary>查看原文（21行）</summary>

```text
        const closeSession = (): void => {
          const opened = session
          session = undefined
          if (opened !== undefined) opened.close()
        }
        engine.openShell(alias, {
          cols: Number.isFinite(cols) ? cols : 80,
          rows: Number.isFinite(rows) ? rows : 24,
        }).then((opened) => {
          if (ws.readyState !== WebSocket.OPEN) {
            opened.close()
            return
          }
          session = opened
          sendFrame({ type: 'ready', alias })
          opened.onData = (data) => sendFrame({ type: 'output', data: data.toString('utf8') })
          opened.onExit = (code, error) => {
            sendFrame({ type: 'exit', code, error })
            closed = true
            try { ws.close(1000) } catch { /* already closed */ }
          }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-ssh/src/routes.ts:514-533](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/routes.ts#L514-L533)

输入、尺寸及断线关闭映射到 shell。

<details>
<summary>查看原文（20行）</summary>

```text
        ws.on('message', (data) => {
          let frame: TerminalClientFrame
          try {
            frame = JSON.parse(String(data)) as TerminalClientFrame
          } catch {
            return
          }
          if (frame.type === 'input') {
            session?.send(frame.data)
          } else if (frame.type === 'resize') {
            session?.resize(Math.max(2, frame.cols), Math.max(1, frame.rows))
          }
        })
        ws.on('close', () => {
          closed = true
          closeSession()
        })
        ws.on('error', () => {
          closed = true
          closeSession()
```

</details>

#### 缺口

- 未在当前宿主实测 UI 和工具对同一 SSH 测试机的结果。
  **影响**：不能确认宿主版本或故障时 UI 操作是否足以代替现有命令。
  **进一步探讨**：对同一隔离主机比较系统 ssh、面板和工具的目标、退出码、耗时和输出。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地请求限制能否替代调用者权限、SSH 对端身份与文件授权？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

浏览器接口的代码要求来访地址和 Host 都是环回，拒绝 cross-site；Origin 缺失可通过，存在时比对 host。终端升级也调用同一检查。这约束监听面，不形成逐用户操作授权。模型工具在宿主内部直接进引擎，不经过该 HTTP 检查，设置 announceToAgent 只决定加入提示词，只有 enabled 关闭才退出工具注册。宿主是否另有确认或访问策略，当前组件自身无法证明。

组件打开 ssh2 客户端时使用别名保存的主机、用户、密码或本地私钥；给跳板和最终目标生成同类配置，没有传入 known_hosts 校验或 hostVerifier。不能凭系统 ssh 已接受合法主机就认定这个实现也会校验该对端。密码和 passphrase 原样随配置 JSON 写入，创建新临时文件时请求 0600 后重命名，没有加密过程。另一个入口 SFTP 会在 DSH 宿主进程内 resolve 指定路径并直接传输，下载还会创建本地父目录。当前代码没有将模型给出的路径限定为仓库工作区，保护取决于宿主进程权限和启用哪些工具。远端 exec 返回的 stdout、stderr 也通过模型输出进入对话，应把操作结果视为需核查的输入。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/routes.ts:41-62](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/routes.ts#L41-L62)

环回来访地址、Host、浏览器 fetch site 及 Origin 的实际检查。

<details>
<summary>查看原文（22行）</summary>

```text
/** Loopback literal check plus browser same-origin markers (mirrors the pairing routes' fence). */
function isLoopbackRequest(request: IncomingMessage): boolean {
  const address = request.socket.remoteAddress
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL(`http://${host}`)
  } catch {
    return false
  }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') return false
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

**依据 2 · 源码核查**：[packages/dsh-ssh/src/routes.ts:452-468](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/routes.ts#L452-L468)

终端升级沿用环回检查。

<details>
<summary>查看原文（17行）</summary>

```text
    path: SSH_API.terminal,
    handler: (req, socket, head) => {
      if (!isLoopbackRequest(req)) {
        socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
        socket.destroy()
        return
      }
      const url = new URL(req.url ?? '/', 'http://localhost')
      const alias = queryParam(url, 'alias')
      if (alias === undefined) {
        socket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n')
        socket.destroy()
        return
      }
      const cols = Number.parseInt(queryParam(url, 'cols') ?? '80', 10)
      const rows = Number.parseInt(queryParam(url, 'rows') ?? '24', 10)
      terminalWss.handleUpgrade(req, socket, head, (ws) => {
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/index.ts:102-141](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/index.ts#L102-L141)

announceToAgent 设置控制提示，enabled 控制需注册的接口和工具。

<details>
<summary>查看原文（40行）</summary>

```text
  const sync = (): void => {
    const value = resolve()
    if (disposeSection !== undefined) {
      disposeSection()
      disposeSection = undefined
    }
    if (disposeRoutes !== undefined) {
      disposeRoutes()
      disposeRoutes = undefined
    }
    if (disposeTools !== undefined) {
      disposeTools()
      disposeTools = undefined
    }
    if (!value.enabled) return
    if (value.announceToAgent) {
      disposeSection = ctx.systemPrompt.section({
        name: 'plugin:dsh-ssh',
        order: SECTION_ORDER,
        text: SSH_GUIDANCE,
      })
    }
    disposeRoutes = ctx.effect(
      () => {
        const disposers = routes.map(route => ctx.webServer.register(route))
        const upgradeDisposer = ctx.webServer.registerUpgrade(upgrade)
        return () => {
          for (const dispose of disposers) dispose()
          upgradeDisposer()
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

**依据 4 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:65-87](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine/connection-pool.ts#L65-L87)

SSH 连接配置包括凭据但未配置 hostVerifier。

<details>
<summary>查看原文（23行）</summary>

```text
export function buildConnectConfig(entry: SshHostEntry, sock?: ConnectConfig['sock']): ConnectConfig {
  const config: ConnectConfig = {
    host: entry.host,
    port: entry.port,
    username: entry.user,
    readyTimeout: 15_000,
    keepaliveInterval: 15_000,
    keepaliveCountMax: 3,
  }
  if (sock !== undefined) config.sock = sock
  if (entry.auth.kind === 'password') {
    config.password = entry.auth.password
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
  return config
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:139-169](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine/connection-pool.ts#L139-L169)

跳板与目标都走同一连接配置。

<details>
<summary>查看原文（31行）</summary>

```text
export async function connectChain(engine: PoolEngine, entry: SshHostEntry): Promise<{ client: Client; hops: Client[] }> {
  const hops: Client[] = []
  let sock: ConnectConfig['sock']
  const chain = entry.proxyJump
  for (let index = 0; index < chain.length; index += 1) {
    const hopAlias = chain[index]
    const hop = engine.store.find(hopAlias)
    if (hop === undefined) {
      for (const client of hops) client.end()
      throw new Error('proxyJump alias \'' + hopAlias + '\' not found — create it first')
    }
    const hopClient = await connectClient(buildConnectConfig(hop, sock))
    hops.push(hopClient)
    const next = index + 1 < chain.length ? engine.store.find(chain[index + 1]) : undefined
    const nextHost = next !== undefined ? next.host : entry.host
    const nextPort = next !== undefined ? next.port : entry.port
    sock = await new Promise<ConnectConfig['sock']>((resolve, reject) => {
      hopClient.forwardOut('127.0.0.1', 0, nextHost, nextPort, (error, stream) => {
        if (error !== undefined) {
          for (const client of hops) client.end()
          reject(error)
        } else {
          resolve(stream)
        }
      })
    })
  }
  let target: Client | undefined
  try {
    target = await connectClient(buildConnectConfig(entry, sock))
    return { client: target, hops }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/store.ts:140-146](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/store.ts#L140-L146)

认证对象保留密码或口令字段。

```text
      user: payload.user.trim(),
      auth: {
        kind: payload.auth.kind,
        keyPath: payload.auth.kind === 'key' ? expandHome(payload.auth.keyPath?.trim() ?? '') : undefined,
        passphrase: payload.auth.kind === 'key' ? payload.auth.passphrase ?? undefined : undefined,
        password: payload.auth.kind === 'password' ? payload.auth.password : undefined,
      },
```

**依据 7 · 源码核查**：[packages/dsh-ssh/src/store.ts:328-335](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/store.ts#L328-L335)

JSON 写入的 mode 和替换步骤。

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

**依据 8 · 源码核查**：[packages/dsh-ssh/src/engine/sftp.ts:37-63](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine/sftp.ts#L37-L63)

上传直接打开宿主指定文件。

<details>
<summary>查看原文（27行）</summary>

```text
  // Remote paths must be absolute: the mkdir chain and fastPut must agree
  // on one resolution (relative paths previously created dirs at the root).
  if (!remotePath.startsWith('/')) {
    throw new Error('remotePath must be an absolute path (got \'' + remotePath + '\')')
  }
  const local = resolvePath(localPath)
  if (!existsSync(local)) throw new Error('local path not found: \'' + localPath + '\'')
  return withClient(engine, alias, (client) => withSftp(client, async (sftp) => {
    const stat = statSync(local)
    let files: string[]
    if (stat.isDirectory()) {
      if (!recursive) throw new Error('\'' + localPath + '\' is a directory — enable recursive upload')
      files = walkLocalDir(local)
      await ensureRemoteDir(sftp, remotePath)
    } else {
      files = ['']
      await ensureRemoteDir(sftp, dirname(remotePath))
    }
    let bytes = 0
    for (const rel of files) {
      const src = rel === '' ? local : join(local, rel)
      // Remote paths always use forward slashes; normalize any OS separators.
      const remoteRel = rel.split(/[\\/]/).join('/')
      const dst = rel === '' ? remotePath : remotePath.replace(/\/$/, '') + '/' + remoteRel
      await fastPut(sftp, src, dst, engine.opts.sftpConcurrency, onProgress)
      bytes += statSync(src).size
    }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-ssh/src/engine/sftp.ts:75-87](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine/sftp.ts#L75-L87)

下载直接写宿主指定路径。

<details>
<summary>查看原文（13行）</summary>

```text
): Promise<{ bytes: number }> {
  return withClient(engine, alias, (client) => withSftp(client, async (sftp) => {
    const stat = await new Promise<{ isDirectory: () => boolean }>((resolve, reject) => {
      sftp.stat(remotePath, (error, stats) => error !== undefined ? reject(error) : resolve(stats))
    })
    if (stat.isDirectory()) {
      throw new Error('\'' + remotePath + '\' is a directory — directory download is not supported yet (download individual files)')
    }
    const local = resolvePath(localPath)
    if (!existsSync(dirname(local))) mkdirSync(dirname(local), { recursive: true })
    await fastGet(sftp, remotePath, local, engine.opts.sftpConcurrency, onProgress)
    return { bytes: statSync(local).size }
  }))
```

</details>

**依据 10 · 源码核查**：[packages/dsh-ssh/src/tools.ts:35-43](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/tools.ts#L35-L43)

命令 stdout、stderr 及错误进入返回文字。

```text
  const marker = result.timedOut
    ? '[timed out]'
    : `[exit code: ${result.exitCode ?? 'null'}]`
  const parts = [marker]
  if (result.stdout !== '') parts.push('stdout:\n' + result.stdout)
  if (result.stderr !== '') parts.push('stderr:\n' + result.stderr)
  if (result.error !== undefined) parts.push('error: ' + result.error)
  parts.push(`duration: ${result.durationMs} ms`)
  return parts.join('\n')
```

#### 缺口

- 未在目标 DSH 装载组合内确认模型工具授权与 SSH 服务端换钥行为。
  **影响**：无法在高权限连接上判断总体授权或错误对端是否会被拦下。
  **进一步探讨**：只在测试密钥与本地测试资源下比较合法和替换主机密钥、不同路径及模型权限的结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 连接中断、命令超时和禁用时会留下什么？

**研究主题**：功能与机制、工程质量与复用、效果与总成本

#### 完整回答

连接池按 alias 复用连接，标记 broken 后才会重新获取，闲置回收跳过在用和固定连接。withClient 虽声明默认三次尝试，但 acquire 的 await 在 try 外面，而执行回调的 try 只有 finally。回调抛错会退出函数，不能把这个版本当作自动重复三次的实现。也不宜自行重放未知效果的命令，连接断开前服务器可能已经执行。

exec 在通道回调建立后设置计时器；触发时尝试发 KILL、关通道并立即返回，返回的 timedOut 无法证明远端进程树或副作用消失。正常关闭只凭退出码判断成功，结果里的输出还可能因上限截断。集群按非空的 alias、环境、标签做筛选，省略或传空的筛选会从全部已配置主机开始；有每台结果，某台失败不回滚其他主机已经完成的动作。恢复时应先核对每台可观察状态和实际影响，再决定后续命令。

端口转发只绑定宿主环回端口，显式停止会销毁本地监听、已接入套接字及对应 pooled connection。禁用设置会卸载公开路由、升级及工具，实际 engine.dispose 另绑在插件上下文生命周期，负责池和隧道。仅凭关闭设置不能判断已存在的转发和 SSH 通道都被清理。初次配置、处理断链、确认远端状态都需要操作时间，实际节时未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:195-229](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine/connection-pool.ts#L195-L229)

按别名登记连接和 broken 处理，闲置回收跳过固定及在用项。

<details>
<summary>查看原文（35行）</summary>

```text
async function doAcquire(engine: PoolEngine, alias: string): Promise<PoolRecord> {
  const entry = engine.store.find(alias)
  if (entry === undefined) throw new Error('alias \'' + alias + '\' not found — add it first')
  const { client, hops } = await connectChain(engine, entry)
  const record: PoolRecord = { client, hops, idleAt: Date.now(), pinned: false, broken: false, inFlight: 0 }
  client.on('error', () => { record.broken = true })
  client.on('close', () => { record.broken = true })
  engine.pool.set(alias, record)
  return record
}

/**
 * Tear down one alias's record. When `record` is given and no longer the
 * pooled record for the alias (a concurrent acquire replaced it), nothing
 * is torn down — the connection belongs to someone else now.
 */
export function disposeRecord(engine: PoolEngine, alias: string, record?: PoolRecord): void {
  const current = engine.pool.get(alias)
  if (record !== undefined && current !== record) return
  if (current === undefined) return
  engine.pool.delete(alias)
  try { current.client.end() } catch { /* already closed */ }
  for (const hop of current.hops) {
    try { hop.end() } catch { /* already closed */ }
  }
}

/** Close connections idle beyond the threshold (skips pinned and in-flight). */
export function sweepPool(engine: PoolEngine): void {
  const cutoff = Date.now() - engine.opts.idleTimeoutMs
  for (const [alias, record] of engine.pool) {
    if (!record.pinned && record.inFlight === 0 && record.idleAt < cutoff) {
      disposeRecord(engine, alias, record)
    }
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:236-254](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine/connection-pool.ts#L236-L254)

重试循环的实际控制流，异常没有在这层捕获并继续。

<details>
<summary>查看原文（19行）</summary>

```text
export async function withClient<T>(engine: PoolEngine, alias: string, fn: (client: Client) => Promise<T>, attempts = 3): Promise<T> {
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
    } finally {
      record.inFlight -= 1
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:258-307](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine/connection-pool.ts#L258-L307)

SSH 通道建立后的计时、终止尝试、输出上限和退出码。

<details>
<summary>查看原文（50行）</summary>

```text
export async function execCommand(engine: PoolEngine, alias: string, command: string, timeoutMs?: number): Promise<ExecResult> {
  const started = Date.now()
  const budget = timeoutMs !== undefined && timeoutMs > 0 ? timeoutMs : engine.opts.defaultExecTimeoutMs
  return withClient(engine, alias, async (client) => {
    return await new Promise<ExecResult>((resolve, reject) => {
      client.exec(command, (error, stream) => {
        if (error !== undefined) {
          reject(error)
          return
        }
        const stdout = { text: '', truncated: false }
        const stderr = { text: '', truncated: false }
        let timedOut = false
        let settled = false
        const finish = (): void => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          resolve({
            success: false,
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
          resolve({
            success: code === 0 && !timedOut,
            exitCode: code,
            timedOut,
            stdout: stdout.text,
            stderr: stderr.text,
            durationMs: Date.now() - started,
          })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/engine/cluster.ts:19-50](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine/cluster.ts#L19-L50)

配置全集、筛选、工作者上限及逐主机结果。

<details>
<summary>查看原文（32行）</summary>

```text
export async function cluster(engine: PoolEngine, options: ClusterOptions): Promise<ClusterResult[]> {
  let targets = engine.store.list()
  if (options.aliases !== undefined && options.aliases.length > 0) {
    targets = targets.filter(entry => options.aliases!.includes(entry.alias))
  }
  if (options.environment !== undefined && options.environment !== '') {
    targets = targets.filter(entry => entry.environment === options.environment)
  }
  if (options.tags !== undefined && options.tags.length > 0) {
    // ALL semantics (matches the ssh_cluster tool description).
    targets = targets.filter(entry => options.tags!.every(tag => entry.tags.includes(tag)))
  }
  if (targets.length === 0) return []
  if (options.maxWorkers !== undefined && (!Number.isInteger(options.maxWorkers) || options.maxWorkers < 1)) {
    throw new Error('maxWorkers must be a positive integer')
  }
  const workers = Math.min(engine.opts.defaultMaxWorkers, options.maxWorkers ?? engine.opts.defaultMaxWorkers, targets.length)
  const results: ClusterResult[] = []
  const queue = [...targets]
  const run = async (): Promise<void> => {
    while (queue.length > 0) {
      const entry = queue.shift()!
      try {
        const result = await execCommand(engine, entry.alias, options.command, options.timeoutMs)
        results.push({ alias: entry.alias, ok: result.success, exitCode: result.exitCode, timedOut: result.timedOut, stdout: result.stdout, stderr: result.stderr, durationMs: result.durationMs })
      } catch (error) {
        results.push({ alias: entry.alias, ok: false, error: error instanceof Error ? error.message : String(error) })
      }
    }
  }
  await Promise.all(Array.from({ length: workers }, () => run()))
  return results
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/engine/tunnel.ts:75-92](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine/tunnel.ts#L75-L92)

监听在宿主回环并固定连接记录。

<details>
<summary>查看原文（18行）</summary>

```text
  try {
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject)
      server.listen(options.localPort ?? 0, '127.0.0.1', () => {
        server.removeListener('error', reject)
        resolve()
      })
    })
  } catch (error) {
    // Roll back: never leave an unpinned orphan connection behind.
    if (!record.pinned && record.inFlight === 0) disposeRecord(engine, alias, record)
    throw error
  }
  record.pinned = true
  const address = server.address()
  info.localPort = typeof address === 'object' && address !== null ? address.port : 0
  info.state = 'forwarding'
  engine.tunnels.set(id, { info, server, alias, sockets })
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/engine/tunnel.ts:101-112](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine/tunnel.ts#L101-L112)

停止时处理已接入套接字和池连接。

<details>
<summary>查看原文（12行）</summary>

```text
/** Stop one tunnel (closes the listener, live sockets, and the pinned connection). */
export function stopTunnel(engine: TunnelEngine, id: string): boolean {
  const tunnel = engine.tunnels.get(id)
  if (tunnel === undefined) return false
  engine.tunnels.delete(id)
  try { tunnel.server.close() } catch { /* already closed */ }
  for (const socket of tunnel.sockets) {
    try { socket.destroy() } catch { /* already closed */ }
  }
  tunnel.sockets.clear()
  disposeRecord(engine, tunnel.alias)
  return true
```

</details>

**依据 7 · 源码核查**：[packages/dsh-ssh/src/index.ts:77-83](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/index.ts#L77-L83)

引擎只通过 Cordis 生命周期触发 dispose。

```text
  const store = new HostStore()
  const engine = new SshEngine(store)
  ctx.effect(() => () => { engine.dispose() }, 'dsh-ssh: engine')

  // The /api/dsh-ssh route family + terminal upgrade.
  const { routes, upgrade } = makeRoutes({ store, engine })
  let disposeRoutes: (() => void) | undefined
```

**依据 8 · 源码核查**：[packages/dsh-ssh/src/index.ts:104-116](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/index.ts#L104-L116)

单纯禁用先解除接口和工具，再结束注册函数。

<details>
<summary>查看原文（13行）</summary>

```text
    if (disposeSection !== undefined) {
      disposeSection()
      disposeSection = undefined
    }
    if (disposeRoutes !== undefined) {
      disposeRoutes()
      disposeRoutes = undefined
    }
    if (disposeTools !== undefined) {
      disposeTools()
      disposeTools = undefined
    }
    if (!value.enabled) return
```

</details>

**依据 9 · 源码核查**：[packages/dsh-ssh/src/engine.ts:153-158](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine.ts#L153-L158)

完整引擎清理主动停止所有隧道并释放池。

```text
  /** Close every pooled connection and tunnel. */
  dispose(): void {
    if (this.sweepTimer !== undefined) clearInterval(this.sweepTimer)
    for (const id of [...this.tunnels.keys()]) stopTunnel(this, id)
    for (const alias of [...this.pool.keys()]) disposeRecord(this, alias)
  }
```

#### 缺口

- 没有执行断链、远端超时或禁用残留的宿主实验。
  **影响**：无法判断具体退出时延、历史残留和远端实际状态。
  **进一步探讨**：隔离主机记录命令标记、进程树和端口，分别触发超时、连接断开、禁用及卸载。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪种对照能验证采用收益和授权边界？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

想把几个测试主机的状态检查放进 DSH 的维护者，可先观察这一方案。进入实际试用前，需要隔离宿主用户、一次性密钥、确定的只读账号和可单独停用的模型工具，并核对 SSH 对端身份保护。限制无法确认时继续用已有 OpenSSH 和 SFTP 流程。一次验证只用显式别名及不用保密数据的短命令，对照退出码、远程标记和本地监听；任何条目意外命中别名、文件访问未限制或命令出现未明副作用时停止并回原工具核查。现有源码足以说明共享入口可以减少切换，但没有证据支持换工具后的排障总成本降低。

从同池、别名、集群筛选与未单独限制模型本地路径，可推出一个待验证的设计。模型发出操作前显示精确的目标、允许的本地路径及允许的远端命令类别，用户确认后尝试执行。将它与现有模型工具、用户独立命令行在同一组只读和被拒样本中对照。记录错主机和越目录请求被发现的比例、误拒、额外操作数和恢复时间。如果只增加确认压力，却无法减少范围错误或验收时间，就没有证明比现有手工做法有实际优势。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/engine/cluster.ts:19-35](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine/cluster.ts#L19-L35)

筛选不完整时目标集合可变大。

<details>
<summary>查看原文（17行）</summary>

```text
export async function cluster(engine: PoolEngine, options: ClusterOptions): Promise<ClusterResult[]> {
  let targets = engine.store.list()
  if (options.aliases !== undefined && options.aliases.length > 0) {
    targets = targets.filter(entry => options.aliases!.includes(entry.alias))
  }
  if (options.environment !== undefined && options.environment !== '') {
    targets = targets.filter(entry => entry.environment === options.environment)
  }
  if (options.tags !== undefined && options.tags.length > 0) {
    // ALL semantics (matches the ssh_cluster tool description).
    targets = targets.filter(entry => options.tags!.every(tag => entry.tags.includes(tag)))
  }
  if (targets.length === 0) return []
  if (options.maxWorkers !== undefined && (!Number.isInteger(options.maxWorkers) || options.maxWorkers < 1)) {
    throw new Error('maxWorkers must be a positive integer')
  }
  const workers = Math.min(engine.opts.defaultMaxWorkers, options.maxWorkers ?? engine.opts.defaultMaxWorkers, targets.length)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/sftp.ts:75-87](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/engine/sftp.ts#L75-L87)

给定路径的处理可据以设置对照边界。

<details>
<summary>查看原文（13行）</summary>

```text
): Promise<{ bytes: number }> {
  return withClient(engine, alias, (client) => withSftp(client, async (sftp) => {
    const stat = await new Promise<{ isDirectory: () => boolean }>((resolve, reject) => {
      sftp.stat(remotePath, (error, stats) => error !== undefined ? reject(error) : resolve(stats))
    })
    if (stat.isDirectory()) {
      throw new Error('\'' + remotePath + '\' is a directory — directory download is not supported yet (download individual files)')
    }
    const local = resolvePath(localPath)
    if (!existsSync(dirname(local))) mkdirSync(dirname(local), { recursive: true })
    await fastGet(sftp, remotePath, local, engine.opts.sftpConcurrency, onProgress)
    return { bytes: statSync(local).size }
  }))
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/index.ts:104-137](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/src/index.ts#L104-L137)

启停与模型工具注册的真实边界。

<details>
<summary>查看原文（34行）</summary>

```text
    if (disposeSection !== undefined) {
      disposeSection()
      disposeSection = undefined
    }
    if (disposeRoutes !== undefined) {
      disposeRoutes()
      disposeRoutes = undefined
    }
    if (disposeTools !== undefined) {
      disposeTools()
      disposeTools = undefined
    }
    if (!value.enabled) return
    if (value.announceToAgent) {
      disposeSection = ctx.systemPrompt.section({
        name: 'plugin:dsh-ssh',
        order: SECTION_ORDER,
        text: SSH_GUIDANCE,
      })
    }
    disposeRoutes = ctx.effect(
      () => {
        const disposers = routes.map(route => ctx.webServer.register(route))
        const upgradeDisposer = ctx.webServer.registerUpgrade(upgrade)
        return () => {
          for (const dispose of disposers) dispose()
          upgradeDisposer()
        }
      },
      'dsh-ssh: routes',
    )
    disposeTools = ctx.effect(
      () => {
        const disposers = tools.map(tool => ctx.tools.register(tool))
```

</details>

**依据 4 · 作者声明**：[packages/dsh-ssh/README.md:21-28](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-ssh/README.md#L21-L28)

作者也明确托管凭据和宿主文件作用域。

```text
## Security model

- All `/api/dsh-ssh/*` routes are loopback-only (with same-origin checks) — the interfaces that execute commands against remote servers are not exposed to the LAN.
- Passwords / key passphrases are stored in plain text in `~/.dsh/dsh-ssh.json`, file mode 0600, directory 0700 (the same trust model as ssh-skill writing passwords into ssh-config comments).
- Tunnels only listen on `127.0.0.1`.
- Before the Agent uses a tool, the host must first be configured in the GUI (or imported from ~/.ssh/config).
- `ssh_upload` / `ssh_download` read/write arbitrary local paths on this machine with host-process privileges (not through the bash sandbox) — same host-local-path semantics as ssh-skill, be aware of that permission surface.
- The remote output of exec / cluster is returned verbatim (not sanitized); a command like `env` may bring secrets from the remote environment back into the conversation log.
```

#### 缺口

- 没有逐操作授权的新实现和真实操作者时间记录。
  **影响**：不能判断效果改善是否抵消多一步确认。
  **进一步探讨**：固定相同测试命令和目标，分别比较误操作、完成率与人工复核成本。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
