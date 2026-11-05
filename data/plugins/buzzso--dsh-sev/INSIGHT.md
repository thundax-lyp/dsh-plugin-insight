# dsh-sev

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[4b0188a](https://github.com/Buzzso/dsh-sev/tree/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c)

<!-- BEGIN META -->
[![GitHub ★ 139](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=139&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Buzzso/dsh-sev) [![npm 30d 129](https://img.shields.io/static/v1?label=npm+30d&message=129&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sev) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sev)
<!-- END META -->

> **功能**：通过 SSH 隧道在本地 DSH 查看远端会话、打开界面并提交任务。

> **亮点**：[Q01](#research-q01) 聚合远端会话、面板和提交入口，减少手工切换。

> **主要限制**：[Q02](#research-q02) 回环围栏、端口连通和远端 shell 都需独立核对，超时后状态未知。

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
  - [Q01 · 远程 DSH 管理适合哪类任务？](#detail-section-11)
  - [Q02 · SSH 隧道与 headless 调用有哪些执行边界？](#detail-section-12)
  - [Q03 · 怎样试用并处理已创建但未确认排队？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有自有服务器的开发者要将可分离任务交给远端 DSH。

直接登录远端 DSH 或手动建立 SSH 转发。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 远端面板 | 查看 SSH 转发后的会话 | 须已部署并验证远端 DSH |
| 远端任务 | 持久会话投递或一次性 SSH 调用 | 实际目标、权限和完成状态需回读 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 本地 SSH 与兼容 DSH | 必需 | 注册、转发和浏览 | SSH 或宿主服务失败 |
| 已部署的测试远端 DSH | 必需 | 执行和保存远端会话 | 需核对远端模型与权限 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户设隔离远端、SSH alias 和模型 | 确认目标及回环 |
| 观察 | 用户核对隧道和实际会话 | 先用无副作用任务 |
| 退出 | 用户停用并查远端会话 | 不盲重试未知结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务器与模型支出未知 | 部署远端及 SSH | 需核对 profile |
| 持续 | 网络和模型支出未知 | 确认远端执行与文件 | 需要维护隧道 |
| 失败 | 恢复开销未知 | 检查远端会话及权限 | 超时无法证明停止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 远端协作 | 浏览远端会话并提交 | 断线后的真实连续性及节时 |

> **思考**：[Q02](#research-q02) 回环围栏、端口连通和远端 shell 都需独立核对，超时后状态未知。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 聚合远端会话、面板和提交入口，减少手工切换。

[Q02](#research-q02) 请求成功、隧道可达和实际任务完成属于不同状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 回环围栏、端口连通和远端 shell 都需独立核对，超时后状态未知。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先观察隔离远端，只用无副作用测试输入，未知状态回远端查证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持双通道及失败边界，真实远端运行、权限和恢复未验收。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/index.tsx、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Host 与客户端源码。未运行 SSH、远端 DSH、模型或插件测试。
- 下一步：验证回环、端口冲突、账户权限、两阶段提交、超时、并发和真实会话恢复。

**分析版本**

- **仓库**：[Buzzso/dsh-sev](https://github.com/Buzzso/dsh-sev)
- **版本号**：0.3.4（[固定提交 4b0188a](https://github.com/Buzzso/dsh-sev/tree/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 以稳定请求标识和会话回读减少中断后的重复提交。

验证回环、端口冲突、账户权限、两阶段提交、超时、并发和真实会话恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 445 | — | — | 3135 |
| .js | source | 2 | 1191 | 1100 | 76 | — |
| .mjs | source | 1 | 63 | 44 | 12 | — |
| .tsx | source | 1 | 578 | 512 | 36 | — |
| .js | test | 1 | 370 | 334 | 19 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Buzzso/dsh-sev/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有远端 DSH 的用户能否从本地会话查看和提交任务，并核对远端实际执行状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 远程 DSH 管理适合哪类任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有私有服务器与 DSH 的开发者可在本地面板打开远程 GUI、查看远端会话或提交长任务，并通过一次性 headless 工具做简短请求。相比远程终端和浏览器分别操作，工具把入口集中到本地工作流。长任务的执行和文件留在远端，接收成功不是完成；断开本地能否继续取决于远端 Host、会话及模型。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-21](https://github.com/Buzzso/dsh-sev/blob/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c/README.md#L12-L21)

作者的双通道定位。

<details>
<summary>查看原文（10行）</summary>

```text
## ✨ Features

- **Dual-channel remote control** — operate the remote dsh both ways: **SSH tunnels + panel** (watch its GUI, browse sessions) *and* **dsh CLI control** (the `sev_run_task` agent tool runs one-shot tasks on the remote via `ssh` + `dsh --profile headless`).
- **Remote projects** — point a task at a server folder (`cwd`); the remote agent works there and task files land on the server, retrievable via Syncthing / scp.
- **Left-sidebar mixed list** — remote sessions appear right next to your local ones (title, running pulse, relative time), Codex-style.
- **One-click remote GUI** — open the remote instance's full web UI inside the panel (iframe) or in a tab.
- **Auto-healing SSH tunnels** — dropped tunnels reconnect automatically (watchdog), and resume on app restart.
- **Remote session API** — session list / health are pulled through the tunnel from the remote host's own API.
- **Recoverable config** — host registry is a plain JSON file with an automatic rolling backup (`.bak`); deletion asks for confirmation.
- **Zero local exposure** — remote host only listens on `127.0.0.1`; you reach it via an SSH tunnel. Loopback-only API fence.
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:94-108](https://github.com/Buzzso/dsh-sev/blob/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c/src/client/index.tsx#L94-L108)

远端会话轮询。

<details>
<summary>查看原文（15行）</summary>

```text
  // M2: poll remote session summaries for hosts with live tunnels.
  useEffect(() => {
    const fetchSessions = async () => {
      for (const h of hosts) {
        if (h.tunnel?.state !== 'running') continue
        try {
          const d = await json(`${API.sessions}?id=${encodeURIComponent(h.id)}`)
          if (Array.isArray(d.sessions)) {
            setSessions((prev) => ({ ...prev, [h.id]: d.sessions }))
          }
        } catch { /* keep last */ }
      }
    }
    void fetchSessions()
    const timer = window.setInterval(() => { void fetchSessions() }, 10000)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:422-459](https://github.com/Buzzso/dsh-sev/blob/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c/lib/index.js#L422-L459)

持久会话创建和排队。

<details>
<summary>查看原文（38行）</summary>

```text
    {
      path: API.task,
      handler: withFence(async (req, res) => {
        // M3: push a LONG task to the remote instance — creates a persistent
        // session on the remote (via its own /api) and queues the task in it.
        if (req.method !== 'POST') return writeJson(res, 405, { error: 'method not allowed' })
        const body = await readJsonBody(req)
        const id = typeof body?.id === 'string' ? body.id : ''
        const content = typeof body?.content === 'string' && body.content.trim() ? body.content.trim() : ''
        const host = id && registry.find(id)
        if (!host) return writeJson(res, 404, { error: 'host not found' })
        if (!content) return writeJson(res, 400, { error: 'content required' })
        const tunnel = getTunnel(host.id)
        if (!tunnel || tunnel.state !== 'running') {
          return writeJson(res, 409, { error: 'tunnel not running', tunnel })
        }
        try {
          const base = `http://127.0.0.1:${tunnel.localPort}`
          const rpc = (method, payload) => fetch(`${base}/api/${method}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ type: 'client-request', rpcId: `sev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, method, payload }),
            signal: AbortSignal.timeout(20000),
          }).then((r) => r.json())
          const created = await rpc('session.create', typeof body?.cwd === 'string' && body.cwd ? { cwd: body.cwd } : {})
          if (!created?.result?.ok) return writeJson(res, 502, { error: created?.result?.error ?? 'session.create failed' })
          const sessionId = created.result.value.sessionId
          const prompted = await rpc('session.prompt', {
            sessionId,
            mode: 'queue',
            content: [{ type: 'text', text: content }],
          })
          if (!prompted?.result?.ok) return writeJson(res, 502, { error: prompted?.result?.error ?? 'session.prompt failed' })
          return writeJson(res, 200, { sessionId, accepted: prompted.result.value?.accepted === true, cwd: body?.cwd ?? null })
        } catch (error) {
          return writeJson(res, 502, { error: String(error) })
        }
      }),
```

</details>

**依据 4 · 源码核查**：[lib/index.js:534-559](https://github.com/Buzzso/dsh-sev/blob/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c/lib/index.js#L534-L559)

一次性工具。

<details>
<summary>查看原文（26行）</summary>

```text
function sevRunTaskTool(registry) {
  return defineTool({
    name: 'sev_run_task',
    description: 'Run a one-shot task on a registered remote DSH host through its headless CLI (ssh + `dsh --profile headless`). The remote agent executes tools on that server and replies once. Use when the user wants a task executed on a remote server / the remote DSH instance, or a quick check on the remote box. Triggers: 远程跑任务 / 在服务器上执行 / 远程 dsh 控制。Long monitored tasks should use a persistent remote session instead.',
    parameters: {
      host: { type: 'string', description: 'Remote host id or alias registered in dsh-sev (e.g. my-server).' },
      task: { type: 'string', description: 'The task text for the remote agent to perform, e.g. "run uname -a and summarize".' },
      cwd: { type: 'string', description: 'Optional working directory on the server (a "remote project" folder). Task files land here; e.g. ~/projects/my-task.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          output: { type: 'string', required: true },
          exitCode: { type: 'integer', required: true },
        },
      },
      render: (_args, value) => `exit ${value.exitCode}\n${value.output}`,
    },
    execute: async (args) => {
      const host = registry.find(args.host) ?? registry.hosts.find((h) => h.alias === args.host)
      if (!host) return { output: `host not found: ${args.host} (register it in the 远程 panel first)`, exitCode: 1 }
      const headlessHome = host.headlessHome ?? HEADLESS_HOME_DEFAULT
      return runRemoteHeadless(host.alias, args.task, headlessHome, args.cwd)
    },
```

</details>

#### 缺口

- 未运行远端或真实长任务
  **影响**：无法保证断开后执行及同步产物
  **进一步探讨**：用隔离远端检查已接受、运行与完成

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · SSH 隧道与 headless 调用有哪些执行边界？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

HTTP 路由的围栏检查对端回环、Host、cross-site 与有 Origin 时的 host 比对；缺 Origin 可通过这一层，不能作为逐调用身份。SSH 隧道 readiness 用本地 TCP connect，说明端口可连接，不验证该端口实际对应预期 DSH。watchdog 根据进程状态和冷却重启。一次性 headless 把 task 从 stdin 写固定 /tmp/.dsh-sev-task.txt，但 cwd 和 headlessHome 直接拼入远端 shell，尤其 cwd 的双引号不能阻止所有 shell 展开。固定临时文件还可能让同账户并发互相干扰。超时只杀本地 ssh，远端状态无法据此确认。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:37-50](https://github.com/Buzzso/dsh-sev/blob/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c/lib/index.js#L37-L50)

来源围栏。

<details>
<summary>查看原文（14行）</summary>

```text
// ── loopback fence (mirrors dsh-ssh) ────────────────────────────────────────
function isLoopbackRequest(request) {
  const address = request.socket.remoteAddress
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl
  try { hostUrl = new URL(`http://${host}`) } catch { return false }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === void 0) return true
  try { return new URL(origin).host === hostUrl.host } catch { return false }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:118-157](https://github.com/Buzzso/dsh-sev/blob/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c/lib/index.js#L118-L157)

隧道与探针。

<details>
<summary>查看原文（40行）</summary>

```text
function startTunnel(host, localPort) {
  const existing = tunnels.get(host.id)
  if (existing && existing.state === 'running' && (existing.proc === null || existing.proc.exitCode === null)) {
    return existing
  }
  const remotePort = host.port || DEFAULT_REMOTE_PORT
  const proc = spawn('ssh', [
    '-L', `${localPort}:127.0.0.1:${remotePort}`,
    host.alias,
    '-N',
    '-o', 'ExitOnForwardFailure=yes',
    '-o', 'ServerAliveInterval=30',
    '-o', 'ServerAliveCountMax=3',
    '-o', 'ConnectTimeout=10',
  ], { stdio: ['ignore', 'ignore', 'pipe'] })
  const record = { proc, localPort, remotePort, alias: host.alias, state: 'starting', startedAt: Date.now() }
  tunnels.set(host.id, record)
  // Readiness is detected by probing the local forward port (ssh -N prints no
  // reliable stderr marker), not by parsing log lines. Probe repeatedly: the
  // tunnel can take >1s to establish over ZeroTier, and a one-shot probe
  // misses it.
  const probe = () => {
    if (record.state !== 'starting') return
    const sock = connect({ port: localPort, host: '127.0.0.1' })
    sock.setTimeout(600)
    sock.once('connect', () => { sock.destroy(); clearTimeout(record.probeTimer); record.state = 'running' })
    sock.once('error', () => sock.destroy())
    sock.once('timeout', () => sock.destroy())
  }
  probe()
  record.probeTimer = setInterval(probe, 400)
  record.probeLimit = setTimeout(() => { clearInterval(record.probeTimer) }, 12000)
  proc.on('exit', (code) => {
    clearInterval(record.probeTimer)
    clearTimeout(record.probeLimit)
    record.state = 'exited'
    record.exitCode = code
    record.exitedAt = Date.now()
  })
  return record
```

</details>

**依据 3 · 源码核查**：[lib/index.js:165-187](https://github.com/Buzzso/dsh-sev/blob/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c/lib/index.js#L165-L187)

重连规则。

<details>
<summary>查看原文（23行）</summary>

```text
export function shouldRestartFor(desiredOn, record, now = Date.now()) {
  if (!desiredOn) return false
  if (!record) return true
  if (record.state === 'running') return false
  if (record.state === 'starting') return now - (record.startedAt ?? now) >= 10000
  // exited: cooldown so a flapping ssh does not hammer spawn
  return now - (record.exitedAt ?? 0) >= 5000
}

export function shouldRestart(id, record, now = Date.now()) {
  return shouldRestartFor(desired.get(id) === true, record, now)
}

/** One sweep pass: (re)start tunnels for hosts that want them. */
export function sweepOnce(registry) {
  const now = Date.now()
  for (const id of [...desired.keys()]) {
    if (!desired.get(id)) continue
    const host = registry.find(id)
    if (!host) continue
    if (!shouldRestartFor(true, tunnels.get(id), now)) continue
    startTunnel(host, host.localPort || DEFAULT_LOCAL_PORT)
  }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:503-531](https://github.com/Buzzso/dsh-sev/blob/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c/lib/index.js#L503-L531)

远端 shell、固定路径与超时。

<details>
<summary>查看原文（29行）</summary>

```text
import { defineTool } from '@deepseek-ai/dsh-tools'

const HEADLESS_HOME_DEFAULT = '~/.dsh-headless'
const HEADLESS_TIMEOUT_MS = 300 * 1000

/**
 * Run `ssh <alias> dsh --profile headless "<task>"` on the remote host and
 * return the agent's final answer. The task text is piped via stdin to a temp
 * file on the remote side, so arbitrary quoting in the task is safe.
 */
function runRemoteHeadless(alias, task, headlessHome, cwd) {
  return new Promise((resolve) => {
    const cd = cwd ? `cd "${cwd}" && ` : ''
    const remote = `${cd}cat > /tmp/.dsh-sev-task.txt && env DSH_HOME=${headlessHome} dsh --profile headless "$(cat /tmp/.dsh-sev-task.txt)"`
    const proc = spawn('ssh', [alias, remote], { stdio: ['pipe', 'pipe', 'pipe'] })
    let output = ''
    let stderr = ''
    const timer = setTimeout(() => { try { proc.kill('SIGKILL') } catch { /* noop */ } }, HEADLESS_TIMEOUT_MS)
    proc.stdout.on('data', (d) => { output += String(d) })
    proc.stderr.on('data', (d) => { stderr += String(d) })
    proc.on('error', (e) => { clearTimeout(timer); resolve({ output: `ssh error: ${e.message}`, exitCode: 1 }) })
    proc.on('exit', (code) => {
      clearTimeout(timer)
      const combined = (output + (stderr ? `\n[stderr] ${stderr.trim()}` : '')).trim()
      resolve({ output: combined, exitCode: code ?? 1 })
    })
    proc.stdin.write(task)
    proc.stdin.end()
  })
```

</details>

**依据 5 · 源码核查**：[lib/index.js:534-559](https://github.com/Buzzso/dsh-sev/blob/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c/lib/index.js#L534-L559)

调用输入与注册。

<details>
<summary>查看原文（26行）</summary>

```text
function sevRunTaskTool(registry) {
  return defineTool({
    name: 'sev_run_task',
    description: 'Run a one-shot task on a registered remote DSH host through its headless CLI (ssh + `dsh --profile headless`). The remote agent executes tools on that server and replies once. Use when the user wants a task executed on a remote server / the remote DSH instance, or a quick check on the remote box. Triggers: 远程跑任务 / 在服务器上执行 / 远程 dsh 控制。Long monitored tasks should use a persistent remote session instead.',
    parameters: {
      host: { type: 'string', description: 'Remote host id or alias registered in dsh-sev (e.g. my-server).' },
      task: { type: 'string', description: 'The task text for the remote agent to perform, e.g. "run uname -a and summarize".' },
      cwd: { type: 'string', description: 'Optional working directory on the server (a "remote project" folder). Task files land here; e.g. ~/projects/my-task.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          output: { type: 'string', required: true },
          exitCode: { type: 'integer', required: true },
        },
      },
      render: (_args, value) => `exit ${value.exitCode}\n${value.output}`,
    },
    execute: async (args) => {
      const host = registry.find(args.host) ?? registry.hosts.find((h) => h.alias === args.host)
      if (!host) return { output: `host not found: ${args.host} (register it in the 远程 panel first)`, exitCode: 1 }
      const headlessHome = host.headlessHome ?? HEADLESS_HOME_DEFAULT
      return runRemoteHeadless(host.alias, args.task, headlessHome, args.cwd)
    },
```

</details>

#### 缺口

- 未验证远端账户 shell、访问和断开后的状态
  **影响**：不能假设命令或权限隔离、超时停止
  **进一步探讨**：用隔离 SSH 账号验证参数处理、重复任务、端口碰撞及断开

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用并处理已创建但未确认排队？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

需要独立远端 Web DSH、可用 SSH alias 与模型凭据，先仅用测试会话和回环转发观察状态。长任务创建和 prompt 是两个 RPC，第二步失败仍可能留下会话，响应丢失也不能证明没执行。遇超时先用远端原生 UI 对账，不直接重复提交。可加入稳定请求 ID、保存已创建会话并按 ID 回读状态，比较网络中断后孤儿会话、重复提交和恢复耗时。若不能减少未知结果或增加恢复困难则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:422-457](https://github.com/Buzzso/dsh-sev/blob/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c/lib/index.js#L422-L457)

两步远端调用与响应。

<details>
<summary>查看原文（36行）</summary>

```text
    {
      path: API.task,
      handler: withFence(async (req, res) => {
        // M3: push a LONG task to the remote instance — creates a persistent
        // session on the remote (via its own /api) and queues the task in it.
        if (req.method !== 'POST') return writeJson(res, 405, { error: 'method not allowed' })
        const body = await readJsonBody(req)
        const id = typeof body?.id === 'string' ? body.id : ''
        const content = typeof body?.content === 'string' && body.content.trim() ? body.content.trim() : ''
        const host = id && registry.find(id)
        if (!host) return writeJson(res, 404, { error: 'host not found' })
        if (!content) return writeJson(res, 400, { error: 'content required' })
        const tunnel = getTunnel(host.id)
        if (!tunnel || tunnel.state !== 'running') {
          return writeJson(res, 409, { error: 'tunnel not running', tunnel })
        }
        try {
          const base = `http://127.0.0.1:${tunnel.localPort}`
          const rpc = (method, payload) => fetch(`${base}/api/${method}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ type: 'client-request', rpcId: `sev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, method, payload }),
            signal: AbortSignal.timeout(20000),
          }).then((r) => r.json())
          const created = await rpc('session.create', typeof body?.cwd === 'string' && body.cwd ? { cwd: body.cwd } : {})
          if (!created?.result?.ok) return writeJson(res, 502, { error: created?.result?.error ?? 'session.create failed' })
          const sessionId = created.result.value.sessionId
          const prompted = await rpc('session.prompt', {
            sessionId,
            mode: 'queue',
            content: [{ type: 'text', text: content }],
          })
          if (!prompted?.result?.ok) return writeJson(res, 502, { error: prompted?.result?.error ?? 'session.prompt failed' })
          return writeJson(res, 200, { sessionId, accepted: prompted.result.value?.accepted === true, cwd: body?.cwd ?? null })
        } catch (error) {
          return writeJson(res, 502, { error: String(error) })
```

</details>

**依据 2 · 源码核查**：[lib/index.js:564-579](https://github.com/Buzzso/dsh-sev/blob/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c/lib/index.js#L564-L579)

Host 注册表和自动恢复。

<details>
<summary>查看原文（16行）</summary>

```text
function apply(ctx) {
  const dshHome = process.env.DSH_HOME || join(homedir(), '.dsh')
  const registry = new Registry(join(dshHome, 'remote-hosts.json'))
  let nextLocalPort = 5636
  const allocatePort = () => { nextLocalPort += 1; return nextLocalPort }

  const routes = makeRoutes({ registry, allocatePort })

  // Resume tunnels for autoTunnel hosts after a host restart (adopts an
  // orphaned ssh on the same port, or spawns a fresh one).
  ctx.effect(() => {
    for (const h of registry.hosts) {
      if (h.autoTunnel !== false) desired.set(h.id, true)
    }
    for (const h of registry.hosts) {
      if (h.autoTunnel !== false) void resumeTunnel(h)
```

</details>

**依据 3 · 作者声明**：[README.md:58-84](https://github.com/Buzzso/dsh-sev/blob/4b0188ab2a1e2871c69d19b52bddb1dfc22ab49c/README.md#L58-L84)

作者远端部署条件。

<details>
<summary>查看原文（27行）</summary>

````text
## 🖥 Server setup (the "remote host")

Install a headless DSH on the server (Ubuntu 22.04+ example):

```bash
# 1. Node + dsh (use a mirror if you are in CN)
npm i -g pnpm
npm i -g @deepseek-ai/dsh --registry=https://registry.npmmirror.com

# 2. Model credentials — the remote instance needs its own API keys:
#    ~/.dsh/settings.yaml          (default model / provider)
#    ~/.dsh/.credentials.yaml      (DeepSeek / provider keys)
#    ~/.modlens/config.json        (vision bridge, if used)
#    export ARK_PLAN_API_KEY=...   (env-based providers, if used)

# 3. systemd unit so it survives reboots (adjust paths)
sudo tee /etc/systemd/system/dsh-web.service >/dev/null <<'EOF'
[Unit]
Description=DSH web (remote host)
After=network-online.target

[Service]
Type=simple
User=<your-user>
Environment=DSH_HOME=/home/<your-user>/.dsh
WorkingDirectory=<dsh-install-dir>
ExecStart=/usr/bin/node <dsh-install-dir>/node_modules/@deepseek-ai/dsh/lib/bin.js --profile web --host 127.0.0.1 --port 3080
````

</details>

#### 缺口

- 未实测 DSH 兼容、SSH 或未知结果恢复
  **影响**：成本与可靠性未知
  **进一步探讨**：模拟断在 create/prompt 之间并检查远端状态

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
