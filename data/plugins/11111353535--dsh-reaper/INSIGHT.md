# dsh-reaper

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[b041224](https://github.com/11111353535/dsh-reaper/tree/b0412244e623d54fbf0bded66cba5203de8c85c4)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：扫描监听端点并给进程归属分级，预览后代终止计划，经confirm后结束进程并检查端口。

> **核心亮点**：将归属理由、后代影响预览和端口回查集中，优于仅按端口kill，但非进程身份或会话授权保证。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：后代漏保护端口、信号前无身份重核，free_port不强制归属，取消和IPv4 TCP探测不足以证明安全回收。详见[Q02](#research-q02)。

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
  - [Q01 · 面向谁，盘点到释放如何工作？](#detail-section-11)
  - [Q02 · 贡献与最关键保护/确认缺口是什么？](#detail-section-12)
  - [Q03 · 依赖、权限和读者使用流程是什么？](#detail-section-13)
  - [Q04 · 三阶段成本效果和失败恢复如何判断？](#detail-section-14)
  - [Q05 · 工程复用、身份收据假设与当前采用结论？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者诊断遗留dev服务器占端口，需核完整影响和可恢复服务。

手工ss/lsof/netstat+进程树可替代，插件集中理由/计划也增加启发式误判和自动终止恢复风险。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 盘点/分级 | 整机监听与归属提示 | 父链/子串非当前会话授权 |
| 后代计划 | 展示影响/拒绝 | 子孙保护端口缺口需核 |
| 终止 | confirm后TERM/可选KILL | 无身份收据，取消缺口 |
| 端口回查 | IPv4 TCP连接 | 非所有协议/地址释放证明 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH tools/commands及宿主Schema | 必需 | 三工具和/reap | 包未声明peer不等无宿主依赖 |
| Node声明版本及系统枚举命令 | 必需 | CIM/PowerShell或ss/ps/lsof | 失败退化信息，非完整无进程 |
| 进程命令行/父链可读权限 | 归属必需 | 判定workspace/host后代 | 权限不足会削弱归属，不能猜 |
| workspaceRegistry | 可选 | 会话根归属 | 会回退current/default，非强会话绑定 |
| signal权限及恢复服务能力 | 真实结束必需 | TERM/可选KILL | EPERM报告；终止不可由预览撤回 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/包，明确目标/不可停服务及恢复步骤 | 补neverKill/protectPorts，隔离测试进程 |
| 盘点 | /reap或scan，只读核命令/父链/端点 | degraded时不推断全量归属 |
| 预览 | 明确PID/port，confirmfalse看完整后代 | 不把all归属当当前会话授权 |
| 实施/恢复 | 确认仍同进程和目标，再依真实协议查端口 | 当前版本保护存在缺口，观察为先；未知不重杀 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/系统命令及权限，金额未知 | 确定禁止结束范围/恢复步骤 | 提权扩大影响，不能补身份绑定 |
| 持续使用 | 整机扫描、第二次枚举、逐PID等待 | 审后代树、命令行和真实端点 | 每PID默认等3秒，总目标数影响时长 |
| 失败恢复 | 重启被停服务/恢复未保存状态 | 区分误归属、存活、重启和端口他人接管 | 进程结束不是可回滚事务 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 盘点归属 | 父链/命令行分级和degraded | 是当前会话遗留且获准结束 |
| 清理树 | 后代闭包/TERM与可选KILL | 执行时身份不变、全后代受保护 |
| 端口恢复 | IPv4 loopback TCP连接探测 | IPv6/特定地址/UDP真实释放和服务可用 |

> **思考**：后代漏保护端口、信号前无身份重核，free_port不强制归属，取消和IPv4 TCP探测不足以证明安全回收。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将归属理由、后代影响预览和端口回查集中，优于仅按端口kill，但非进程身份或会话授权保证。详见[Q01](#research-q01)与[Q02](#research-q02)。

将归属理由、后代影响预览和端口回查集中，优于仅按端口kill，但非进程身份或会话授权保证。详见[Q01](#research-q01)与[Q02](#research-q02)。

分层scan/attribute/plan/kill/probe、结构化降级与拒绝、纯分级/闭包、默认预览和显式force值得复用。二次进程读取有价值，但未消除身份竞态；后代depth以BFS序号而非真实层深，倒序仍通常把子孙排前，不能直接当精确深度字段。

<a id="detail-section-5"></a>

### 1.4 主要限制

后代漏保护端口、信号前无身份重核，free_port不强制归属，取消和IPv4 TCP探测不足以证明安全回收。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，以只读诊断为限；身份/后代保护/取消与精确端点协议补齐后再评估受控试用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持进程分级、后代影响预览和显式终止流程；后代保护端口、信号前身份/取消及精确端点释放仍有缺口，安全回收保证不足。身份与计划版本绑定收据尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/scan.js、lib/attribute.js、lib/index.js、lib/kill.js、lib/probe.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定扫描平台命令、分级/后代计划、工具/命令与信号/端口探测；未运行扫描、目标测试或终止进程，未证明平台运行语义。
- 下一步：进一步探讨先用保护后代/PID复用/取消/地址协议夹具核规则，再测可丢弃服务及恢复，不用生产进程验证。

**分析版本**

- **仓库**：[11111353535/dsh-reaper](https://github.com/11111353535/dsh-reaper)
- **版本号**：0.1.0（[固定提交 b041224](https://github.com/11111353535/dsh-reaper/tree/b0412244e623d54fbf0bded66cba5203de8c85c4)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨身份/计划hash绑定和精确端点回收收据，逐信号重核保护/取消并保留unknown，跨OS成本未验证。详见[Q05](#research-q05)。

进一步探讨先用保护后代/PID复用/取消/地址协议夹具核规则，再测可丢弃服务及恢复，不用生产进程验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 1944 | 1203 | 605 | — |
| .md | source | 2 | 336 | — | — | 2870 |
| .mjs | source | 1 | 77 | 42 | 26 | — |
| .mjs | test | 3 | 690 | 540 | 74 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/11111353535/dsh-reaper/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/11111353535/dsh-reaper/issues?q=is%3Aissue+created%3A2026-09-22T06%3A48%3A25.890Z..2026-10-22T06%3A48%3A25.890Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/11111353535/dsh-reaper/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A48%3A25.890Z..2026-10-22T06%3A48%3A25.890Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核遗留进程归属/后代计划/确认信号与端点恢复，区分提示安全声明和实际执行谓词。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，盘点到释放如何工作？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向开发时遇到遗留dev server/watcher占端口、需要先识别影响再收回的人。输入当前工作区或指定PID/端口/all及confirm/force，输出整机端点分级、后代计划、拒绝项与信号/端口结果。成功应是授权目标被结束、无旁损且精确协议/地址端口可重新使用，不是单纯pid消失。

系统扫描分平台用Windows CIM再fallback netstat/tasklist，Linux ss/ps，macOS lsof/ps，异常给degraded。分级依据宿主父链/后代、命令行工作区子串、服务标记/端口；all仅选agent-spawned/workspace。reap先扫描选root、再枚举进程建闭包，confirm不true只预览；true按depth倒序TERM，force才KILL，最后以端口号探测。三模型工具和/reap共用链。

#### 证据与依据

**依据 1 · 源码核查**：[lib/scan.js:392-408](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/scan.js#L392-L408)

Windowsfallback。

<details>
<summary>查看原文（17行）</summary>

```text
  degraded.push('CIM scan unavailable; fell back to netstat + tasklist')
  const [netstatOut, tasklistOut] = await Promise.all([
    tryRun('netstat', ['-ano'], { timeoutMs, signal }),
    tryRun('tasklist', ['/FO', 'CSV', '/NH'], { timeoutMs, signal }),
  ])
  const listeners = netstatOut === undefined ? [] : parseNetstat(netstatOut, { includeUdp })
  const names = tasklistOut === undefined ? new Map() : parseTasklist(tasklistOut)
  const processes = [...names].map(([pid, name]) => ({
    pid,
    ppid: 0,
    name,
    commandLine: '',
    startedAt: null,
    ageSeconds: null,
    rssBytes: null,
  }))
  return { listeners, processes }
```

</details>

**依据 2 · 源码核查**：[lib/scan.js:417-456](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/scan.js#L417-L456)

Linux/macOS命令。

<details>
<summary>查看原文（40行）</summary>

```text
async function scanLinux({ includeUdp, timeoutMs, signal, degraded }) {
  const ssArgs = includeUdp ? ['-H', '-ltnup'] : ['-H', '-ltnp']
  const [ssOut, psOut] = await Promise.all([
    tryRun('ss', ssArgs, { timeoutMs, signal }),
    tryRun('ps', ['-eo', 'pid=,ppid=,comm=,etimes=,args='], { timeoutMs, signal }),
  ])
  if (ssOut === undefined) degraded.push('ss unavailable; listening sockets could not be enumerated')
  const listeners = ssOut === undefined ? [] : parseSs(ssOut, includeUdp ? 'tcp/udp' : 'tcp')
  if (psOut === undefined) degraded.push('ps unavailable; process details are missing')
  const processes = (psOut === undefined ? [] : parsePs(psOut)).map((row) => ({
    ...row,
    startedAt: null,
    rssBytes: null,
  }))
  return { listeners, processes }
}

/**
 * macOS scan via `lsof` and `ps`.
 *
 * @param {{ includeUdp: boolean, timeoutMs: number, signal?: AbortSignal, degraded: string[] }} options
 * @returns {Promise<{ listeners: unknown[], processes: unknown[] }>}
 */
async function scanDarwin({ includeUdp, timeoutMs, signal, degraded }) {
  const [tcpOut, udpOut, psOut] = await Promise.all([
    tryRun('lsof', ['-nP', '-iTCP', '-sTCP:LISTEN', '-Fpcn'], { timeoutMs, signal }),
    includeUdp ? tryRun('lsof', ['-nP', '-iUDP', '-Fpcn'], { timeoutMs, signal }) : Promise.resolve(undefined),
    tryRun('ps', ['-eo', 'pid=,ppid=,comm=,etimes=,args='], { timeoutMs, signal }),
  ])
  if (tcpOut === undefined) degraded.push('lsof unavailable; listening sockets could not be enumerated')
  const listeners = [
    ...(tcpOut === undefined ? [] : parseLsof(tcpOut, 'tcp')),
    ...(udpOut === undefined ? [] : parseLsof(udpOut, 'udp')),
  ]
  const processes = (psOut === undefined ? [] : parsePs(psOut)).map((row) => ({
    ...row,
    startedAt: null,
    rssBytes: null,
  }))
  return { listeners, processes }
```

</details>

**依据 3 · 源码核查**：[lib/attribute.js:255-296](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/attribute.js#L255-L296)

分级与输出。

<details>
<summary>查看原文（42行）</summary>

```text
export function classify(input) {
  const byPid = indexByPid(input.processes)
  const protectPorts = new Set(input.protectPorts ?? [])
  const neverKill = (input.neverKill ?? []).map((value) => value.toLowerCase()).filter((value) => value !== '')

  /* Which pids descend from the harness host? Computed once, not per endpoint. */
  const hostDescendants = new Set()
  for (const row of input.processes) {
    if (row.pid === input.hostPid) continue
    const chain = ancestorsOf(byPid, row.pid)
    if (chain.includes(input.hostPid)) hostDescendants.add(row.pid)
  }

  const endpoints = []
  for (const listener of input.listeners) {
    const row = listener.pid === null ? undefined : byPid.get(listener.pid)
    const grade = verdictFor({ listener, row, ...input, hostDescendants, protectPorts, neverKill })
    endpoints.push({
      ...listener,
      process:
        row === undefined
          ? null
          : {
              pid: row.pid,
              ppid: row.ppid,
              name: row.name,
              commandLine: row.commandLine,
              ageSeconds: row.ageSeconds,
            },
      verdict: grade.verdict,
      reasons: grade.reasons,
      ...(grade.marker === undefined ? {} : { marker: grade.marker }),
    })
  }

  const protectedPids = new Set()
  for (const row of input.processes) {
    const verdict = verdictForProcess({ row, ...input, hostDescendants, protectPorts, neverKill })
    if (verdict.verdict === 'protected') protectedPids.add(row.pid)
  }

  return { endpoints, processes: input.processes, protectedPids }
```

</details>

**依据 4 · 源码核查**：[lib/attribute.js:406-407](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/attribute.js#L406-L407)

all可选判据。

```text
export function isAutoSelectable(verdict) {
  return verdict === 'agent-spawned' || verdict === 'workspace'
```

**依据 5 · 源码核查**：[lib/index.js:278-328](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/index.js#L278-L328)

预览/执行/回执。

<details>
<summary>查看原文（51行）</summary>

```text
async function reap(ctx, config, exec, args) {
  const scan = await runScan(ctx, config, exec, {})
  const { roots, notes } = selectRoots(scan, args)

  if (roots.length === 0) {
    return {
      confirmed: args.confirm === true,
      force: args.force === true,
      targets: [],
      refused: [],
      freedPorts: [],
      untouched: [],
      notes,
      scan,
    }
  }

  const processes = await loadProcesses(exec, config)
  const selfChain = selfChainFor(processes)
  const plan = buildKillPlan({
    processes,
    listeners: scan.endpoints,
    roots,
    selfChain,
    protectPorts: scan.protectedPorts,
    neverKill: config.neverKill,
  })

  if (args.confirm !== true) {
    return { ...plan, confirmed: false, force: args.force === true, notes, scan }
  }

  const ports = plan.freedPorts.map((row) => row.port)
  const outcome = await terminate({
    targets: plan.targets,
    force: args.force === true,
    graceMs: config.graceMs,
    signal: exec?.signal,
  })

  const release = ports.length > 0 ? await waitForPortsReleased(ports, { signal: exec?.signal }) : { released: [], stillHeld: [] }

  return {
    ...plan,
    confirmed: true,
    force: args.force === true,
    outcome,
    portsReleased: release.released,
    portsStillHeld: release.stillHeld,
    notes,
    scan,
```

</details>

**依据 6 · 源码核查**：[lib/kill.js:98-144](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/kill.js#L98-L144)

信号顺序。

<details>
<summary>查看原文（47行）</summary>

```text
  for (const target of ordered) {
    if (input.signal?.aborted === true) break
    if (!isAlive(target.pid)) {
      emit({ pid: target.pid, name: target.name, action: 'gone' })
      continue
    }

    const graceful = signalPid(target.pid, 'SIGTERM')
    if (!graceful.ok && graceful.reason !== 'already exited') {
      failed.push({ pid: target.pid, reason: graceful.reason ?? 'signal failed' })
      continue
    }
    emit({ pid: target.pid, name: target.name, action: 'sigterm' })

    const deadline = Date.now() + (force ? graceMs : graceMs)
    let alive = true
    while (Date.now() < deadline && alive) {
      await delay(100, input.signal)
      alive = isAlive(target.pid)
    }
    if (!alive) {
      terminated.push(target.pid)
      continue
    }

    if (!force) {
      survived.push(target.pid)
      emit({ pid: target.pid, name: target.name, action: 'survived', detail: 'needs force' })
      continue
    }

    const forced = signalPid(target.pid, 'SIGKILL')
    if (!forced.ok && forced.reason !== 'already exited') {
      failed.push({ pid: target.pid, reason: forced.reason ?? 'force signal failed' })
      continue
    }
    emit({ pid: target.pid, name: target.name, action: 'sigkill' })
    await delay(200, input.signal)
    if (isAlive(target.pid)) {
      survived.push(target.pid)
      emit({ pid: target.pid, name: target.name, action: 'survived', detail: 'unresponsive to SIGKILL' })
    } else {
      terminated.push(target.pid)
    }
  }

  return { terminated, survived, failed }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:355-424](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/index.js#L355-L424)

三工具与命令。

<details>
<summary>查看原文（70行）</summary>

```text
export function apply(ctx, config) {
  ctx.tools.register(
    defineTool({
      name: 'reaper_scan',
      description:
        'Inventory every listening TCP endpoint on this machine and grade its holder as agent-spawned, workspace, dev-server, unattributed, system, or protected. Read-only: signals nothing. Use this before reaping, and to answer "what is holding that port".',
      parameters: {
        includeUdp: { type: 'boolean', description: 'Also enumerate UDP endpoints. Defaults to the plugin config.' },
        workspace: { type: 'string', description: 'Workspace root used to attribute processes by command line. Defaults to the current session workspace.' },
      },
      output: { schema: { type: 'json' }, render: (_args, value) => [{ type: 'text', text: renderScan(value) }] },
      timeoutMs: 60_000,
      async execute(args, exec) {
        return await runScan(ctx, config, exec, { includeUdp: args.includeUdp, workspace: args.workspace })
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'reaper_reap',
      description:
        'Reclaim processes left behind by this session. Computes the full descendant closure of each target (so a dev-server shim does not orphan its child) and, unless confirm is true, only PREVIEWS the plan. Nothing is signalled without confirm: true. Processes in the harness process tree, pid 0-4, neverKill matches and protectPorts holders are refused unconditionally.',
      parameters: {
        pids: { type: 'array', items: { type: 'integer' }, description: 'Explicit root pids to reap. Their descendants are included automatically.' },
        ports: { type: 'array', items: { type: 'integer' }, description: 'Reap whatever holds these ports.' },
        all: { type: 'boolean', description: 'Also select every endpoint confidently attributable to this session (agent-spawned and workspace verdicts only).' },
        force: { type: 'boolean', description: 'Escalate to SIGKILL for processes that ignore SIGTERM. Defaults to false.' },
        confirm: { type: 'boolean', description: 'Actually signal the planned processes. Defaults to false, which previews only.' },
      },
      output: { schema: { type: 'json' }, render: (_args, value) => [{ type: 'text', text: renderPlan(value) }] },
      timeoutMs: 120_000,
      async execute(args, exec) {
        return await reap(ctx, config, exec, args)
      },
    }),
  )

  ctx.tools.register(
    defineTool({
      name: 'reaper_free_port',
      description:
        'Reclaim one specific port. Refuses when the holder cannot be attributed, when the port is protected, or when the holder is part of the harness itself — in those cases it reports why instead of guessing. Previews by default; pass confirm: true to signal.',
      parameters: {
        port: { type: 'integer', required: true, description: 'The TCP port to reclaim.' },
        force: { type: 'boolean', description: 'Escalate to SIGKILL if SIGTERM is ignored. Defaults to false.' },
        confirm: { type: 'boolean', description: 'Actually signal the holder. Defaults to false, which previews only.' },
      },
      output: { schema: { type: 'json' }, render: (_args, value) => [{ type: 'text', text: renderPlan(value) }] },
      timeoutMs: 120_000,
      async execute(args, exec) {
        const probe = await probePorts([args.port], { signal: exec?.signal })
        if (probe.free.includes(args.port)) {
          return {
            confirmed: false,
            force: false,
            targets: [],
            refused: [],
            freedPorts: [],
            untouched: [],
            notes: [`port ${args.port} is already free (connection refused)`],
          }
        }
        return await reap(ctx, config, exec, { ports: [args.port], force: args.force, confirm: args.confirm })
      },
    }),
  )

  ctx.commands.register({
    name: 'reap',
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 贡献与最关键保护/确认缺口是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把端口盘点、归属理由、后代影响预览、默认不发信号和端口回查接成流程，优于只按端口直接kill。明确拒绝宿主祖先/低PID/neverKill和root持有protectPorts是正向约束，但注释/README声称的绝对保护比代码更强。

第一，buildKillPlan对root检查protectPorts，后代循环只查selfChain/低PID/neverKill，没查后代所持保护端口；根被接受后持受保护端口的子进程仍可能在targets。terminate也未逐信号重读规则/身份，只isAlive后kill，与文件注释“immediately before each signal重查”不同。第二次枚举改善新鲜度但仍用旧scan.endpoints端口/PID选择，没有startTime身份绑定，预览与confirm也不绑定同一计划，PID复用/父链变化仍是条件性风险。

第二，workspace是大小写折叠/盘符规整后子串，不是边界目录身份；同宿主所有后代不等当前会话专属，all不是会话授权证据。well-known端口在host/workspace/dev标记返回之后才system，可被前者优先，不等绝不自动选基础设施。free_port按port选择也未拒绝unattributed，描述“拒绝不能归属”没有对应过滤。

第三，端口验证只用IPv4 loopback TCP且只保留端口号，不能证明扫描中的IPv6/特定地址/UDP释放。取消probe返回false，可能报告free；terminate取消发生在grace等待中，循环不查abort、delay立即返回，force分支仍可发KILL。以上是静态分支核查，未实际发送信号/复现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/attribute.js:439-466](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/attribute.js#L439-L466)

root保护端口。

<details>
<summary>查看原文（28行）</summary>

```text
  for (const pid of input.roots) {
    const row = byPid.get(pid)
    if (row === undefined) {
      refused.push({ pid, reason: 'no such process' })
      continue
    }
    if (input.selfChain.has(pid)) {
      refused.push({ pid, reason: 'part of the harness process tree' })
      continue
    }
    if (row.pid <= 4) {
      refused.push({ pid, reason: 'operating-system process' })
      continue
    }
    const loweredName = row.name.toLowerCase()
    const loweredLine = row.commandLine.toLowerCase()
    const hit = neverKill.find((pattern) => loweredName.includes(pattern) || loweredLine.includes(pattern))
    if (hit !== undefined) {
      refused.push({ pid, reason: `matches neverKill pattern "${hit}"` })
      continue
    }
    const held = input.listeners.filter((listener) => listener.pid === pid)
    const protectedPort = held.find((listener) => protectPorts.has(listener.port))
    if (protectedPort !== undefined) {
      refused.push({ pid, reason: `holds protected port ${protectedPort.port}` })
      continue
    }
    accepted.push(pid)
```

</details>

**依据 2 · 源码核查**：[lib/attribute.js:483-503](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/attribute.js#L483-L503)

后代未检查保护端口。

<details>
<summary>查看原文（21行）</summary>

```text
  for (const pid of closure) {
    const row = byPid.get(pid)
    if (row === undefined) continue
    if (input.selfChain.has(pid) || row.pid <= 4) {
      untouched.push(pid)
      continue
    }
    const loweredName = row.name.toLowerCase()
    const loweredLine = row.commandLine.toLowerCase()
    if (neverKill.some((pattern) => loweredName.includes(pattern) || loweredLine.includes(pattern))) {
      untouched.push(pid)
      continue
    }
    targets.push({
      pid: row.pid,
      ppid: row.ppid,
      name: row.name,
      commandLine: row.commandLine,
      root: rootOf.get(pid) ?? row.pid,
      depth: depthOf.get(pid) ?? 0,
    })
```

</details>

**依据 3 · 源码核查**：[lib/kill.js:98-129](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/kill.js#L98-L129)

信号前仅存活及取消缺口。

<details>
<summary>查看原文（32行）</summary>

```text
  for (const target of ordered) {
    if (input.signal?.aborted === true) break
    if (!isAlive(target.pid)) {
      emit({ pid: target.pid, name: target.name, action: 'gone' })
      continue
    }

    const graceful = signalPid(target.pid, 'SIGTERM')
    if (!graceful.ok && graceful.reason !== 'already exited') {
      failed.push({ pid: target.pid, reason: graceful.reason ?? 'signal failed' })
      continue
    }
    emit({ pid: target.pid, name: target.name, action: 'sigterm' })

    const deadline = Date.now() + (force ? graceMs : graceMs)
    let alive = true
    while (Date.now() < deadline && alive) {
      await delay(100, input.signal)
      alive = isAlive(target.pid)
    }
    if (!alive) {
      terminated.push(target.pid)
      continue
    }

    if (!force) {
      survived.push(target.pid)
      emit({ pid: target.pid, name: target.name, action: 'survived', detail: 'needs force' })
      continue
    }

    const forced = signalPid(target.pid, 'SIGKILL')
```

</details>

**依据 4 · 源码核查**：[lib/index.js:295-315](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/index.js#L295-L315)

旧端点/新进程混合。

<details>
<summary>查看原文（21行）</summary>

```text
  const processes = await loadProcesses(exec, config)
  const selfChain = selfChainFor(processes)
  const plan = buildKillPlan({
    processes,
    listeners: scan.endpoints,
    roots,
    selfChain,
    protectPorts: scan.protectedPorts,
    neverKill: config.neverKill,
  })

  if (args.confirm !== true) {
    return { ...plan, confirmed: false, force: args.force === true, notes, scan }
  }

  const ports = plan.freedPorts.map((row) => row.port)
  const outcome = await terminate({
    targets: plan.targets,
    force: args.force === true,
    graceMs: config.graceMs,
    signal: exec?.signal,
```

</details>

**依据 5 · 源码核查**：[lib/attribute.js:222-225](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/attribute.js#L222-L225)

工作区子串。

```text
export function mentionsPath(commandLine, needle) {
  if (needle === undefined || needle === '') return false
  const normalize = (value) => value.replaceAll('\\', '/').replace(/^[a-z]:\//iu, '/').toLowerCase()
  return normalize(commandLine).includes(normalize(needle))
```

**依据 6 · 源码核查**：[lib/attribute.js:346-370](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/attribute.js#L346-L370)

分级优先序。

<details>
<summary>查看原文（25行）</summary>

```text
  if (row.pid <= 4 || SYSTEM_NAMES.has(loweredName)) {
    return { verdict: 'system', reasons: [`"${row.name}" is an operating-system process`] }
  }
  if (port !== undefined && WELL_KNOWN_PORTS.has(port)) {
    reasons.push(`port ${port} is a well-known service port`)
  }

  if (hostDescendants.has(row.pid)) reasons.push('descends from the harness process')
  if (workspaceRoot !== undefined && mentionsPath(row.commandLine, workspaceRoot)) {
    reasons.push('command line names this workspace')
  }
  const marker = devServerMarker(row.commandLine)
  if (marker !== undefined) reasons.push(`looks like a dev server ("${marker}")`)
  if (port !== undefined && isDevPort(port)) reasons.push(`port ${port} is in a dev range`)

  if (hostDescendants.has(row.pid)) return { verdict: 'agent-spawned', reasons, marker }
  if (workspaceRoot !== undefined && mentionsPath(row.commandLine, workspaceRoot)) {
    return { verdict: 'workspace', reasons, marker }
  }
  if (marker !== undefined) return { verdict: 'dev-server', reasons, marker }

  /* Nothing ties it to this session. A holder of a well-known service port is
   * the machine's own infrastructure — same "hands off" grade as an OS process,
   * and the reasons say which port made it so. */
  if (port !== undefined && WELL_KNOWN_PORTS.has(port)) return { verdict: 'system', reasons }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:232-244](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/index.js#L232-L244)

按port不做归属拒绝。

<details>
<summary>查看原文（13行）</summary>

```text
  for (const port of args.ports ?? []) {
    const matches = scan.endpoints.filter((row) => row.port === port)
    if (matches.length === 0) {
      notes.push(`port ${port}: nothing is listening`)
      continue
    }
    for (const row of matches) {
      if (row.pid === null) {
        notes.push(`port ${port}: holder pid unknown, refusing`)
        continue
      }
      roots.add(row.pid)
    }
```

</details>

**依据 8 · 源码核查**：[lib/index.js:405-418](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/index.js#L405-L418)

freeport路径。

<details>
<summary>查看原文（14行）</summary>

```text
      async execute(args, exec) {
        const probe = await probePorts([args.port], { signal: exec?.signal })
        if (probe.free.includes(args.port)) {
          return {
            confirmed: false,
            force: false,
            targets: [],
            refused: [],
            freedPorts: [],
            untouched: [],
            notes: [`port ${args.port} is already free (connection refused)`],
          }
        }
        return await reap(ctx, config, exec, { ports: [args.port], force: args.force, confirm: args.confirm })
```

</details>

**依据 9 · 源码核查**：[lib/probe.js:29-57](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/probe.js#L29-L57)

地址/协议与取消假空闲。

<details>
<summary>查看原文（29行）</summary>

```text
export function isPortHeld(port, signal, options = {}) {
  const host = options.host ?? '127.0.0.1'
  const timeoutMs = options.timeoutMs ?? PROBE_TIMEOUT_MS
  if (signal?.aborted === true) return Promise.resolve(false)

  return new Promise((resolve) => {
    let settled = false
    const socket = createConnection({ port, host })

    const finish = (held) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
      socket.destroy()
      resolve(held)
    }

    const timer = setTimeout(() => finish(true), timeoutMs)
    function onAbort() {
      finish(false)
    }

    socket.once('connect', () => finish(true))
    socket.once('error', (error) => {
      const code = /** @type {NodeJS.ErrnoException} */ (error).code
      /* ECONNREFUSED is the one answer that proves the port is free. */
      if (code === 'ECONNREFUSED') finish(false)
      else if (code === 'EADDRNOTAVAIL' || code === 'ENETUNREACH') finish(false)
```

</details>

**依据 10 · 源码核查**：[lib/kill.js:154-169](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/kill.js#L154-L169)

只按端口号探测。

<details>
<summary>查看原文（16行）</summary>

```text
export async function waitForPortsReleased(ports, options = {}) {
  const timeoutMs = options.timeoutMs ?? 2000
  const { isPortHeld } = await import('./probe.js')
  const deadline = Date.now() + timeoutMs
  let held = new Set(ports)

  while (held.size > 0 && Date.now() < deadline && options.signal?.aborted !== true) {
    const next = new Set()
    for (const port of held) {
      if (await isPortHeld(port, options.signal)) next.add(port)
    }
    held = next
    if (held.size > 0) await delay(120, options.signal)
  }

  const released = ports.filter((port) => !held.has(port))
```

</details>

#### 缺口

- 真实进程生命周期/身份复用与取消时刻的副作用未由静态快照保证。
  **影响**：不能承诺不会误终止或取消后绝不发信号。
  **进一步探讨**：可从受控夹具核身份token、逐目标拒绝、abort优先与绑定计划版本入手，再研究隔离进程。
- 跨平台端点可释放性与服务恢复没有协议/地址精确验证。
  **影响**：TCP loopback失败不等UDP或IPv6可重新绑定。
  **进一步探讨**：可按原端点保留协议/地址并核实际重新bind，而非把所有port统一探测。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、权限和读者使用流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包0.1.0声明Node^22.19.0或>=24，入口实际导入dsh-tools及schemastery并注册commands；不声明peer不表示无宿主版本依赖。整机命令行可能包含敏感参数，scan结果进入模型时属于额外暴露面；无需为了让归属更完整直接提权。workspaceRegistry可缺失并回退current/default，不能把显示工作区当调用者唯一身份。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH tools/commands及宿主Schema | 必需 | 三工具和/reap | 包未声明peer不等无宿主依赖 |
| Node声明版本及系统枚举命令 | 必需 | CIM/PowerShell或ss/ps/lsof | 失败退化信息，非完整无进程 |
| 进程命令行/父链可读权限 | 归属必需 | 判定workspace/host后代 | 权限不足会削弱归属，不能猜 |
| workspaceRegistry | 可选 | 会话根归属 | 会回退current/default，非强会话绑定 |
| signal权限及恢复服务能力 | 真实结束必需 | TERM/可选KILL | EPERM报告；终止不可由预览撤回 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/包，明确目标/不可停服务及恢复步骤 | 补neverKill/protectPorts，隔离测试进程 |
| 盘点 | /reap或scan，只读核命令/父链/端点 | degraded时不推断全量归属 |
| 预览 | 明确PID/port，confirmfalse看完整后代 | 不把all归属当当前会话授权 |
| 实施/恢复 | 确认仍同进程和目标，再依真实协议查端口 | 当前版本保护存在缺口，观察为先；未知不重杀 |

confirmtrue是参数开关，没有独立用户授权持久收据；人工核计划需包含全部后代及保护服务，不能只看root或端口空闲。当前缺陷下优先只读盘点。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:45-52](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/index.js#L45-L52)

实际宿主导入。

```text
import { setTimeout as sleep } from 'node:timers/promises'

import { defineTool } from '@deepseek-ai/dsh-tools'
import Schema from '@deepseek-ai/schemastery'

import { buildKillPlan, classify, isAutoSelectable, verdictRank } from './attribute.js'
import { renderPlan, renderScan } from './format.js'
import { terminate, waitForPortsReleased } from './kill.js'
```

**依据 2 · 源码核查**：[lib/index.js:134-154](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/index.js#L134-L154)

工作区回退。

<details>
<summary>查看原文（21行）</summary>

```text
function workspaceRootFor(ctx, exec) {
  try {
    const registry = typeof ctx.get === 'function' ? ctx.get('workspaceRegistry') : undefined
    if (registry === undefined) return undefined
    const session = exec?.agent?.session
    if (session !== undefined && typeof registry.forSession === 'function') {
      const root = registry.forSession(session)
      if (typeof root === 'string' && root !== '') return root
    }
    if (typeof registry.current === 'function') {
      const root = registry.current()
      if (typeof root === 'string' && root !== '') return root
    }
    if (typeof registry.defaultRoot === 'function') {
      const root = registry.defaultRoot()
      if (typeof root === 'string' && root !== '') return root
    }
  } catch {
    /* Attribution is best-effort; a broken registry must not break the scan. */
  }
  return undefined
```

</details>

**依据 3 · 源码核查**：[lib/index.js:166-188](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/index.js#L166-L188)

扫描/命令行分级。

<details>
<summary>查看原文（23行）</summary>

```text
async function runScan(ctx, config, exec, options = {}) {
  const includeUdp = options.includeUdp ?? config.includeUdp
  const raw = await scanSystem({
    includeUdp,
    timeoutMs: config.scanTimeoutMs,
    signal: exec?.signal,
  })

  const selfChain = selfChainFor(raw.processes)
  const protectPorts = [
    ...new Set([...config.protectPorts, ...defaultProtectedPorts(process.env.DSH_WEB_URL)]),
  ]
  const workspaceRoot = options.workspace ?? workspaceRootFor(ctx, exec)

  const graded = classify({
    listeners: raw.listeners,
    processes: raw.processes,
    hostPid: process.pid,
    selfChain,
    workspaceRoot,
    protectPorts,
    neverKill: config.neverKill,
  })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:306-315](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/index.js#L306-L315)

确认开关。

<details>
<summary>查看原文（10行）</summary>

```text
  if (args.confirm !== true) {
    return { ...plan, confirmed: false, force: args.force === true, notes, scan }
  }

  const ports = plan.freedPorts.map((row) => row.port)
  const outcome = await terminate({
    targets: plan.targets,
    force: args.force === true,
    graceMs: config.graceMs,
    signal: exec?.signal,
```

</details>

**依据 5 · 源码核查**：[package.json:1-4](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/package.json#L1-L4)

版本。

```text
{
  "name": "dsh-reaper",
  "version": "0.1.0",
  "description": "Orphan process and port reaper for DeepSeek Harness: find the dev servers, watchers and background processes an agent left behind, attribute them to a workspace, preview the blast radius, and reclaim the ports.",
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 三阶段成本效果和失败恢复如何判断？

**研究主题**：效果与总成本

#### 完整回答

扫描命令带timeout和8MiB缓冲上限，跨平台fallback提高可读性，但缺命令/权限不是没有监听者。一次reap会两次scanSystem，随后每个目标默认grace3秒，目标多时可超过外部工具timeout；端口验证逐个尝试也增加等待。结束服务可能丢未保存状态/任务，不能用释放端口数量代表净收益。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/系统命令及权限，金额未知 | 确定禁止结束范围/恢复步骤 | 提权扩大影响，不能补身份绑定 |
| 持续使用 | 整机扫描、第二次枚举、逐PID等待 | 审后代树、命令行和真实端点 | 每PID默认等3秒，总目标数影响时长 |
| 失败恢复 | 重启被停服务/恢复未保存状态 | 区分误归属、存活、重启和端口他人接管 | 进程结束不是可回滚事务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 盘点归属 | 父链/命令行分级和degraded | 是当前会话遗留且获准结束 |
| 清理树 | 后代闭包/TERM与可选KILL | 执行时身份不变、全后代受保护 |
| 端口恢复 | IPv4 loopback TCP连接探测 | IPv6/特定地址/UDP真实释放和服务可用 |

TERM与KILL语义依平台而异；终止已发生后取消不能回滚，服务监督器也可能重新启动进程。恢复应核真实服务/任务状态和新持有者，不能对同PID/port自动再次结束。

#### 证据与依据

**依据 1 · 源码核查**：[lib/scan.js:18-45](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/scan.js#L18-L45)

命令上限/失败降级。

<details>
<summary>查看原文（28行）</summary>

```text
/** Hard cap so a runaway `netstat`/`ps` cannot blow up the tool result. */
const MAX_BUFFER = 8 * 1024 * 1024

/** Default per-command timeout, in milliseconds. */
const DEFAULT_TIMEOUT_MS = 20_000

/**
 * Run a command and return stdout, or `undefined` when the binary is missing
 * or the command fails. Enumeration is best-effort: one broken probe must not
 * take down the whole scan.
 *
 * @param {string} file - executable to run.
 * @param {string[]} args - argument vector.
 * @param {{ timeoutMs?: number, signal?: AbortSignal }} [options]
 * @returns {Promise<string | undefined>} stdout, trimmed of a trailing newline.
 */
async function tryRun(file, args, options = {}) {
  try {
    const { stdout } = await run(file, args, {
      timeout: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      maxBuffer: MAX_BUFFER,
      windowsHide: true,
      signal: options.signal,
      encoding: 'utf8',
    })
    return stdout
  } catch {
    return undefined
```

</details>

**依据 2 · 源码核查**：[lib/index.js:278-295](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/index.js#L278-L295)

两次枚举入口。

<details>
<summary>查看原文（18行）</summary>

```text
async function reap(ctx, config, exec, args) {
  const scan = await runScan(ctx, config, exec, {})
  const { roots, notes } = selectRoots(scan, args)

  if (roots.length === 0) {
    return {
      confirmed: args.confirm === true,
      force: args.force === true,
      targets: [],
      refused: [],
      freedPorts: [],
      untouched: [],
      notes,
      scan,
    }
  }

  const processes = await loadProcesses(exec, config)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:343-345](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/index.js#L343-L345)

第二次系统扫描。

```text
async function loadProcesses(exec, config) {
  const raw = await scanSystem({ includeUdp: false, timeoutMs: config.scanTimeoutMs, signal: exec?.signal })
  return raw.processes
```

**依据 4 · 源码核查**：[lib/kill.js:86-117](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/kill.js#L86-L117)

逐目标等待。

<details>
<summary>查看原文（32行）</summary>

```text
export async function terminate(input) {
  const force = input.force === true
  const graceMs = Number.isFinite(input.graceMs) ? Number(input.graceMs) : 3000
  const emit = input.onEvent ?? (() => {})

  /* Deepest first: a supervisor re-spawns what it is watching, not what it is. */
  const ordered = [...input.targets].sort((a, b) => b.depth - a.depth)

  const terminated = []
  const survived = []
  const failed = []

  for (const target of ordered) {
    if (input.signal?.aborted === true) break
    if (!isAlive(target.pid)) {
      emit({ pid: target.pid, name: target.name, action: 'gone' })
      continue
    }

    const graceful = signalPid(target.pid, 'SIGTERM')
    if (!graceful.ok && graceful.reason !== 'already exited') {
      failed.push({ pid: target.pid, reason: graceful.reason ?? 'signal failed' })
      continue
    }
    emit({ pid: target.pid, name: target.name, action: 'sigterm' })

    const deadline = Date.now() + (force ? graceMs : graceMs)
    let alive = true
    while (Date.now() < deadline && alive) {
      await delay(100, input.signal)
      alive = isAlive(target.pid)
    }
```

</details>

**依据 5 · 源码核查**：[lib/kill.js:154-169](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/kill.js#L154-L169)

逐端口回查。

<details>
<summary>查看原文（16行）</summary>

```text
export async function waitForPortsReleased(ports, options = {}) {
  const timeoutMs = options.timeoutMs ?? 2000
  const { isPortHeld } = await import('./probe.js')
  const deadline = Date.now() + timeoutMs
  let held = new Set(ports)

  while (held.size > 0 && Date.now() < deadline && options.signal?.aborted !== true) {
    const next = new Set()
    for (const port of held) {
      if (await isPortHeld(port, options.signal)) next.add(port)
    }
    held = next
    if (held.size > 0) await delay(120, options.signal)
  }

  const released = ports.filter((port) => !held.has(port))
```

</details>

#### 缺口

- 无多平台/负载下误归属率、旁损、总时延和完整恢复人时数据。
  **影响**：不能承诺all安全或固定清理效率。
  **进一步探讨**：可用合成树/端点先测拒绝和收据，再用可丢弃服务比较手工诊断/终止的误伤与总恢复时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程复用、身份收据假设与当前采用结论？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

分层scan/attribute/plan/kill/probe、结构化降级与拒绝、纯分级/闭包、默认预览和显式force值得复用。二次进程读取有价值，但未消除身份竞态；后代depth以BFS序号而非真实层深，倒序仍通常把子孙排前，不能直接当精确深度字段。

可探讨未验证的“身份绑定与精确端点回收收据”。扫描记录PID+启动时间/可核句柄、原协议/地址，预览给计划hash/过期时间；确认重核相同身份/完整后代及所有保护端口，变化必须重新预览。每次TERM/KILL前以同规则和abort检查，取消/探测不可达保留unknown，不映射free。回查原端点及获准服务健康，保存结果仅用于恢复核对。代价是跨OS句柄/权限、PID复用协议和受控状态存储。用保护端口后代、路径前缀碰撞、基础设施host后代、PID复用、grace中取消及IPv6/UDP夹具检验；任一可绕保护就先改执行契约。

推荐observe，当前只读盘点可供有经验维护者辅助，但不要把all或free_port的描述当安全终止保证。继续研究可先完成逐后代保护/身份/取消和精确探测，再评估受控dev进程试用。遇归属不清、degraded、计划变化、保护子孙、取消已发、端点核验不明即停，保留日志并由维护者确认恢复；本轮未操作本机进程。

#### 证据与依据

**依据 1 · 源码核查**：[lib/scan.js:34-45](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/scan.js#L34-L45)

结构化失败边界。

<details>
<summary>查看原文（12行）</summary>

```text
async function tryRun(file, args, options = {}) {
  try {
    const { stdout } = await run(file, args, {
      timeout: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      maxBuffer: MAX_BUFFER,
      windowsHide: true,
      signal: options.signal,
      encoding: 'utf8',
    })
    return stdout
  } catch {
    return undefined
```

</details>

**依据 2 · 源码核查**：[lib/attribute.js:469-503](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/attribute.js#L469-L503)

闭包/BFS序号。

<details>
<summary>查看原文（35行）</summary>

```text
  const closure = descendantClosure(byPid, accepted)
  const rootOf = new Map()
  const depthOf = new Map()
  for (const root of accepted) {
    const members = descendantClosure(byPid, [root])
    members.forEach((pid, index) => {
      if (rootOf.has(pid)) return
      rootOf.set(pid, root)
      depthOf.set(pid, index)
    })
  }

  const targets = []
  const untouched = []
  for (const pid of closure) {
    const row = byPid.get(pid)
    if (row === undefined) continue
    if (input.selfChain.has(pid) || row.pid <= 4) {
      untouched.push(pid)
      continue
    }
    const loweredName = row.name.toLowerCase()
    const loweredLine = row.commandLine.toLowerCase()
    if (neverKill.some((pattern) => loweredName.includes(pattern) || loweredLine.includes(pattern))) {
      untouched.push(pid)
      continue
    }
    targets.push({
      pid: row.pid,
      ppid: row.ppid,
      name: row.name,
      commandLine: row.commandLine,
      root: rootOf.get(pid) ?? row.pid,
      depth: depthOf.get(pid) ?? 0,
    })
```

</details>

**依据 3 · 源码核查**：[lib/index.js:306-328](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/index.js#L306-L328)

预览与结果。

<details>
<summary>查看原文（23行）</summary>

```text
  if (args.confirm !== true) {
    return { ...plan, confirmed: false, force: args.force === true, notes, scan }
  }

  const ports = plan.freedPorts.map((row) => row.port)
  const outcome = await terminate({
    targets: plan.targets,
    force: args.force === true,
    graceMs: config.graceMs,
    signal: exec?.signal,
  })

  const release = ports.length > 0 ? await waitForPortsReleased(ports, { signal: exec?.signal }) : { released: [], stillHeld: [] }

  return {
    ...plan,
    confirmed: true,
    force: args.force === true,
    outcome,
    portsReleased: release.released,
    portsStillHeld: release.stillHeld,
    notes,
    scan,
```

</details>

**依据 4 · 源码核查**：[lib/kill.js:98-144](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/kill.js#L98-L144)

身份/abort假设起点。

<details>
<summary>查看原文（47行）</summary>

```text
  for (const target of ordered) {
    if (input.signal?.aborted === true) break
    if (!isAlive(target.pid)) {
      emit({ pid: target.pid, name: target.name, action: 'gone' })
      continue
    }

    const graceful = signalPid(target.pid, 'SIGTERM')
    if (!graceful.ok && graceful.reason !== 'already exited') {
      failed.push({ pid: target.pid, reason: graceful.reason ?? 'signal failed' })
      continue
    }
    emit({ pid: target.pid, name: target.name, action: 'sigterm' })

    const deadline = Date.now() + (force ? graceMs : graceMs)
    let alive = true
    while (Date.now() < deadline && alive) {
      await delay(100, input.signal)
      alive = isAlive(target.pid)
    }
    if (!alive) {
      terminated.push(target.pid)
      continue
    }

    if (!force) {
      survived.push(target.pid)
      emit({ pid: target.pid, name: target.name, action: 'survived', detail: 'needs force' })
      continue
    }

    const forced = signalPid(target.pid, 'SIGKILL')
    if (!forced.ok && forced.reason !== 'already exited') {
      failed.push({ pid: target.pid, reason: forced.reason ?? 'force signal failed' })
      continue
    }
    emit({ pid: target.pid, name: target.name, action: 'sigkill' })
    await delay(200, input.signal)
    if (isAlive(target.pid)) {
      survived.push(target.pid)
      emit({ pid: target.pid, name: target.name, action: 'survived', detail: 'unresponsive to SIGKILL' })
    } else {
      terminated.push(target.pid)
    }
  }

  return { terminated, survived, failed }
```

</details>

**依据 5 · 源码核查**：[lib/probe.js:29-57](https://github.com/11111353535/dsh-reaper/blob/b0412244e623d54fbf0bded66cba5203de8c85c4/lib/probe.js#L29-L57)

精确端点/unknown假设。

<details>
<summary>查看原文（29行）</summary>

```text
export function isPortHeld(port, signal, options = {}) {
  const host = options.host ?? '127.0.0.1'
  const timeoutMs = options.timeoutMs ?? PROBE_TIMEOUT_MS
  if (signal?.aborted === true) return Promise.resolve(false)

  return new Promise((resolve) => {
    let settled = false
    const socket = createConnection({ port, host })

    const finish = (held) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
      socket.destroy()
      resolve(held)
    }

    const timer = setTimeout(() => finish(true), timeoutMs)
    function onAbort() {
      finish(false)
    }

    socket.once('connect', () => finish(true))
    socket.once('error', (error) => {
      const code = /** @type {NodeJS.ErrnoException} */ (error).code
      /* ECONNREFUSED is the one answer that proves the port is free. */
      if (code === 'ECONNREFUSED') finish(false)
      else if (code === 'EADDRNOTAVAIL' || code === 'ENETUNREACH') finish(false)
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
