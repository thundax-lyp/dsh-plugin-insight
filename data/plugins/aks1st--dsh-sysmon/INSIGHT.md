# dsh-sysmon

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[4cb7a24](https://github.com/AKS1st/dsh-sysmon/tree/4cb7a241f0228329d12010b4846c1bd508271ec0)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-sysmon)
<!-- END META -->

> **实现功能**：DSH Web 悬浮显示宿主 CPU、内存与根文件系统使用率。

> **核心亮点**：将常规宿主指标集成到 DSH Web，分离采样和请求以避免访问放大进程启动。详见[Q02](#research-q02)。

> **风险与缺陷**：采样失败/接口故障时旧读数无时间戳或过期提示，可能被当作实时状态；同源头检查不能替代宿主鉴权。详见[Q03](#research-q03)。

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
  - [Q01 · 状态悬浮窗解决什么决策，读数代表哪台机器？](#detail-section-11)
  - [Q02 · 采样、缓存、展示与阈值如何串起来？](#detail-section-12)
  - [Q03 · 失败与访问控制会不会令读数误导？](#detail-section-13)
  - [Q04 · 安装与持续采样成本是什么？](#detail-section-14)
  - [Q05 · 怎样验证这个悬浮窗确实有用且不误报？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 Web 页面粗看运行 DSH 的 Linux 宿主资源，及时识别明显压力。

Linux top/free/df 或现有 Prometheus/系统仪表盘；本包只提供 Web 内嵌快速视图。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Host 采样 | 固定 Linux 命令 | 仅根盘，失败缓存旧值 |
| GET API | 返回内存快照 | 同源检查非鉴权 |
| Web 悬浮 | 三指标显示 | 无时间戳/告警 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| Linux /proc、nproc、df | 采集 | 保留旧快照 |
| DSH Web host shell/timer | 调度和路由 | 503 或无界面 |
| 浏览器同源访问 | 页面轮询 | 旧读数保留 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装 | Web profile 装包 | 悬浮窗出现 |
| 对照 | 与宿主 top/free/df 核读数 | 主机和根盘正确 |
| 失败测试 | 中断采样/路由 | 可识别陈旧数据 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 部署 | Linux、Web host/shell/timer | 宿主兼容 |
| 持续 | 每秒 shell + HTTP | 长期 CPU/网络开销 |
| 故障 | 核查旧读数 | 误认代价 |

| 结果 | 现行支持 | 未证实 |
| --- | --- | --- |
| 页面可见 | 三指标悬浮 | 真实用户决策改善 |
| 访问平稳 | 采样与 HTTP 解耦 | 大规模页面开销 |
| 实时性 | 一秒名义刷新 | 失败后新鲜度，实际缺信号 |

> **思考**：采样失败/接口故障时旧读数无时间戳或过期提示，可能被当作实时状态；同源头检查不能替代宿主鉴权。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将常规宿主指标集成到 DSH Web，分离采样和请求以避免访问放大进程启动。详见[Q02](#research-q02)。

将常规宿主指标集成到 DSH Web，分离采样和请求以避免访问放大进程启动。详见[Q02](#research-q02)。

Host 采样失败静默保留缓存，Client fetch/JSON 失败亦保留旧 DOM；sameOrigin 放行无 Origin/Referer 的请求。

<a id="detail-section-5"></a>

### 1.4 主要限制

采样失败/接口故障时旧读数无时间戳或过期提示，可能被当作实时状态；同源头检查不能替代宿主鉴权。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

Linux 单宿主仅作辅助观察；正式容量/告警仍用现有监控，试点时注入采样失败并确认 stale 状态。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持轻量显示；失败时旧缓存继续当作最新值返回，组件内无鉴权；未运行部署。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/collect.ts、src/client/index.ts、src/invariant.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交包、README、Host/Client/采集源码；未运行插件或测试。
- 下一步：隔离 Linux DSH Web 对照宿主指标，注入采样失败和接口中断；测读数陈旧误认率、主机识别和一小时开销。

**分析版本**

- **仓库**：[AKS1st/dsh-sysmon](https://github.com/AKS1st/dsh-sysmon)
- **版本号**：0.2.1（[固定提交 4cb7a24](https://github.com/AKS1st/dsh-sysmon/tree/4cb7a241f0228329d12010b4846c1bd508271ec0)）
- **版本日期**：2026-09-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

为快照补采样时间、主机身份及过期态，故障时明确灰显；用故障注入对照误认率和开销，尚未实现。详见[Q05](#research-q05)。

隔离 Linux DSH Web 对照宿主指标，注入采样失败和接口中断；测读数陈旧误认率、主机识别和一小时开销。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 10 | 710 | 513 | 195 | — |
| .md | source | 2 | 71 | — | — | 727 |
| .ts | source | 5 | 343 | 217 | 100 | — |
| .ts | test | 2 | 145 | 125 | 5 | — |
| .mjs | source | 1 | 30 | 29 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dsh-sysmon/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dsh-sysmon/issues?q=is%3Aissue+created%3A2026-09-22T05%3A38%3A36.172Z..2026-10-22T05%3A38%3A36.172Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dsh-sysmon/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A38%3A36.172Z..2026-10-22T05%3A38%3A36.172Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判定 Linux 宿主状态悬浮窗的正确性、陈旧数据及访问边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 状态悬浮窗解决什么决策，读数代表哪台机器？

**研究主题**：场景与需求

#### 完整回答

Web 右下角展示 CPU、内存、根磁盘三项 host 运行指标，帮助用户粗看 DSH 宿主资源压力。读数来自运行插件的 Linux 主机，不是浏览器客户端或远程工作节点；它不提供过程归因、历史、告警通知或多磁盘视图。合格交付须让用户正确理解采样机器、时间和失败状态。基线是 top/free/df、系统仪表盘。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-24](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/README.md#L1-L24)

作者展示与阈值说明。

<details>
<summary>查看原文（24行）</summary>

````text
# dsh-sysmon

DSH Web 的系统状态悬浮窗：固定在页面右下角，每 1 秒刷新显示 CPU、内存、磁盘占用率。

```
CPU 39%/16    MEM 46%    DISK 22%
```

## 显示规格

- **位置**：右下角固定悬浮，`pointer-events: none`，不遮挡界面操作。
- **配色**：默认浅灰色小字（等宽字体、11px）。
- **刷新**：1 秒一次。

### 阈值规则

| 指标 | 默认（浅灰） | 橙色 | 红色 |
| ---- | ----------- | ---- | ---- |
| CPU（x%/y） | < 90%×核心数 | x ≥ 90%×核心数 | x ≥ 98%×核心数 |
| 内存 | ≤ 80% | > 80% | > 90% |
| 磁盘 | ≤ 80% | > 80% | > 90% |

- **CPU**：`x%` 为所有核心使用率之和（可超过 100%），`y` 为总核心数；阈值按总容量比例计算。
- **内存 / 磁盘**：超过 80% 橙色、超过 90% 红色。
````

</details>

**依据 2 · 源码核查**：[src/collect.ts:18-26](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/collect.ts#L18-L26)

读取宿主 /proc、nproc、df /。

```text
export const COLLECT_COMMAND = [
  // steal ($9) counts toward busy: a virtualized tenant's CPU is being taken
  // by the hypervisor and is not idle time. guest/guest_nice are already
  // folded into user/nice and must not be added again.
  "awk '/^cpu /{t=$2+$3+$4+$5+$6+$7+$8+$9;i=$5;print t\" \"i}' /proc/stat",
  'nproc',
  "awk '/^MemTotal/{T=$2}/^MemAvailable/{A=$2}END{print T\" \"A}' /proc/meminfo",
  "df -P / | awk 'NR==2{print $2\" \"$3}'",
].join('\n')
```

**依据 3 · 作者声明**：[README.md:51-55](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/README.md#L51-L55)

作者承认 Linux 和根盘限制。

```text
## 已知限制

- **仅 Linux**——宿主采集器读取 `/proc/stat`、`/proc/meminfo` 与 `df`；其他平台需要不同的采集器。
- **仅根文件系统**——磁盘占用只报告 `/`，按挂载点选择暂缓。
- **采样窗口近似**——CPU 百分比是相邻两次采样（约 1 秒）间隔内忙时占比，窗口内瞬时突发被平均。
```

#### 缺口

- 未在实际 DSH Web 与不同部署拓扑验证。
  **影响**：用户是否误把读数看作本机或容器外主机未知。
  **进一步探讨**：隔离 Linux 宿主和远端浏览器对照读数/标签。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 采样、缓存、展示与阈值如何串起来？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host 每秒用固定命令经 ctx.shell 采样一次，解析四行输出，以相邻 /proc/stat 计数差计算全核心合计 CPU 百分比，以 MemAvailable 和 df 根盘计算内存/磁盘占比，结果只保存在内存。GET 路由仅返缓存，避免每次浏览器请求再启动进程；Client 每秒 fetch、用 in-flight 守卫并只更新三数字 DOM 节点，按阈值上色。增量是 DSH Web 内嵌轻量显示与请求/采样解耦，指标算法和展示本身常规。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:70-108](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/index.ts#L70-L108)

单采样器与缓存路由。

<details>
<summary>查看原文（39行）</summary>

```text
export function apply(ctx: HostContext): void {
  let cached: SysInfo | null = null
  let prevCpu: RawCpu | null = null
  let sampling = false
  const sample = async (): Promise<void> => {
    if (sampling) return
    sampling = true
    try {
      const spec = ctx.shell.resolve({ command: COLLECT_COMMAND, timeoutMs: 3000, stdoutMaxBytes: 4096 })
      const result = await ctx.shell.run(spec)
      if (result.exitCode !== 0) return
      const raw = parseSysInfoOutput(result.stdout.text)
      if (raw === null) return
      cached = toSysInfo(prevCpu, raw)
      prevCpu = { total: raw.total, idle: raw.idle }
    } catch (error) {
      // A transient sampler failure keeps the previous snapshot on screen.
      console.error('sysmon: sampler failed', error)
    } finally {
      sampling = false
    }
  }
  void sample()
  ctx.interval(() => { void sample() }, SAMPLER_INTERVAL_MS)
  ctx.effect(() => {
    const disposeRoute = ctx.webServer.register({
      kind: 'exact',
      path: SYSINFO_ROUTE,
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'method not allowed' })
        if (!sameOrigin(req)) return json(res, 403, { ok: false, error: 'cross-origin request rejected' })
        if (cached === null) return json(res, 503, { ok: false, error: 'no sample yet' })
        return json(res, 200, { ok: true, info: cached })
      },
    })
    return () => {
      disposeRoute()
    }
  }, 'sysmon: system-status API')
```

</details>

**依据 2 · 源码核查**：[src/collect.ts:18-26](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/collect.ts#L18-L26)

固定命令。

```text
export const COLLECT_COMMAND = [
  // steal ($9) counts toward busy: a virtualized tenant's CPU is being taken
  // by the hypervisor and is not idle time. guest/guest_nice are already
  // folded into user/nice and must not be added again.
  "awk '/^cpu /{t=$2+$3+$4+$5+$6+$7+$8+$9;i=$5;print t\" \"i}' /proc/stat",
  'nproc',
  "awk '/^MemTotal/{T=$2}/^MemAvailable/{A=$2}END{print T\" \"A}' /proc/meminfo",
  "df -P / | awk 'NR==2{print $2\" \"$3}'",
].join('\n')
```

**依据 3 · 源码核查**：[src/collect.ts:53-84](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/collect.ts#L53-L84)

解析和公式。

<details>
<summary>查看原文（32行）</summary>

```text
export function parseSysInfoOutput(stdout: string): RawSample | null {
  const lines = stdout.trim().split('\n')
  if (lines.length < 4) return null
  const cpu = lines[0].split(' ').map(Number)
  const cores = Number(lines[1]) || 1
  const mem = lines[2].split(' ').map(Number)
  const disk = lines[3].split(' ').map(Number)
  if (cpu.length < 2 || mem.length < 2 || disk.length < 2) return null
  return {
    total: cpu[0], idle: cpu[1], cores,
    memTotal: mem[0], memAvailable: mem[1],
    diskTotal: disk[0], diskUsed: disk[1],
  }
}

/**
 * Fold one fresh sample against the previous pass's cpu line into a
 * {@link SysInfo}. The CPU percentage is the busy share of the delta between
 * the two passes, scaled by the core count — the sum of all core usages
 * (0..cores*100); the first pass has no predecessor and reports 0.
 * @param prev - the previous pass's cpu line, or null on the first pass.
 * @param raw - the freshly parsed sample.
 */
export function toSysInfo(prev: RawCpu | null, raw: RawSample): SysInfo {
  const delta = raw.total - (prev?.total ?? raw.total)
  const idleDelta = raw.idle - (prev?.idle ?? raw.idle)
  const cpu = prev !== null && delta > 0
    ? Math.max(0, Math.round(((delta - idleDelta) / delta) * raw.cores * 100))
    : 0
  const mem = raw.memTotal > 0 ? Math.round(((raw.memTotal - raw.memAvailable) / raw.memTotal) * 100) : 0
  const disk = raw.diskTotal > 0 ? Math.round((raw.diskUsed / raw.diskTotal) * 100) : 0
  return { cpu, cores: raw.cores, mem, disk }
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:41-91](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/client/index.ts#L41-L91)

DOM、轮询与清理。

<details>
<summary>查看原文（51行）</summary>

```text
export function apply(ctx: ClientContext): void {
  const style = document.createElement('style')
  style.textContent = CSS
  document.head.append(style)
  const root = document.createElement('div')
  root.id = 'dsh-sysmon'
  const cpuValue = span('', '--%/--')
  const memValue = span('', '--%')
  const diskValue = span('', '--%')
  root.append(
    span('sm-group', span('sm-label', 'CPU '), cpuValue),
    span('sm-group', span('sm-label', 'MEM '), memValue),
    span('sm-group', span('sm-label', 'DISK '), diskValue),
  )
  document.body.append(root)
  /** Diff-style repaint: only the three value nodes change. */
  const render = (info: SysInfo | null): void => {
    cpuValue.textContent = info === null ? '--%/--' : `${info.cpu}%/${info.cores}`
    memValue.textContent = info === null ? '--%' : `${info.mem}%`
    diskValue.textContent = info === null ? '--%' : `${info.disk}%`
    const cpuLevel = info === null ? 'normal' : cpuWarnLevel(info.cpu, info.cores)
    const memLevel = info === null ? 'normal' : warnLevel(info.mem)
    const diskLevel = info === null ? 'normal' : warnLevel(info.disk)
    cpuValue.className = LEVEL_CLASS[cpuLevel]
    memValue.className = LEVEL_CLASS[memLevel]
    diskValue.className = LEVEL_CLASS[diskLevel]
  }
  render(null)
  let disposed = false
  let inflight = false
  const tick = async (): Promise<void> => {
    if (disposed || inflight) return
    inflight = true
    try {
      const response = await fetch(SYSINFO_ROUTE, { cache: 'no-store' })
      const body = await response.json() as SysInfoResponse
      if (!disposed && body.ok) render(body.info)
    } catch {
      // A transient route error keeps the last sample on screen.
    } finally {
      inflight = false
    }
  }
  void tick()
  const timer = window.setInterval(() => { void tick() }, 1000)
  ctx.effect(() => () => {
    disposed = true
    window.clearInterval(timer)
    root.remove()
    style.remove()
  }, 'sysmon: bottom-right status overlay')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败与访问控制会不会令读数误导？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

采样器对非零退出、解析失败和异常都保留旧 cached；路由与客户端未携带采样时间或过期标志，后续 GET 仍可返回 200/ok，页面也保留旧值，持续故障时“当前”读数会静默陈旧。初次未取样返回 503。路由只检查 GET 及请求 Origin/Referer 的 host 与 Host 头相等；无这些浏览器头的请求也放行，没有组件内鉴权。故同源限制并不等同身份认证，真实暴露取决于 DSH Web 外层保护；README 的 DNS-rebinding 保护属于作者声称，本轮未验证完整代理链。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:48-68](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/index.ts#L48-L68)

同源头检查，无头通过。

<details>
<summary>查看原文（21行）</summary>

```text
function sameOrigin(req: IncomingMessage): boolean {
  const host = req.headers.host
  if (host === undefined) return false
  const origin = req.headers.origin
  if (origin !== undefined) {
    try {
      return new URL(origin).host === host
    } catch {
      return false
    }
  }
  const referer = req.headers.referer
  if (referer !== undefined) {
    try {
      return new URL(referer).host === host
    } catch {
      return false
    }
  }
  return true
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:70-102](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/index.ts#L70-L102)

失败保留缓存，路由返回缓存。

<details>
<summary>查看原文（33行）</summary>

```text
export function apply(ctx: HostContext): void {
  let cached: SysInfo | null = null
  let prevCpu: RawCpu | null = null
  let sampling = false
  const sample = async (): Promise<void> => {
    if (sampling) return
    sampling = true
    try {
      const spec = ctx.shell.resolve({ command: COLLECT_COMMAND, timeoutMs: 3000, stdoutMaxBytes: 4096 })
      const result = await ctx.shell.run(spec)
      if (result.exitCode !== 0) return
      const raw = parseSysInfoOutput(result.stdout.text)
      if (raw === null) return
      cached = toSysInfo(prevCpu, raw)
      prevCpu = { total: raw.total, idle: raw.idle }
    } catch (error) {
      // A transient sampler failure keeps the previous snapshot on screen.
      console.error('sysmon: sampler failed', error)
    } finally {
      sampling = false
    }
  }
  void sample()
  ctx.interval(() => { void sample() }, SAMPLER_INTERVAL_MS)
  ctx.effect(() => {
    const disposeRoute = ctx.webServer.register({
      kind: 'exact',
      path: SYSINFO_ROUTE,
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'method not allowed' })
        if (!sameOrigin(req)) return json(res, 403, { ok: false, error: 'cross-origin request rejected' })
        if (cached === null) return json(res, 503, { ok: false, error: 'no sample yet' })
        return json(res, 200, { ok: true, info: cached })
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:68-85](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/client/index.ts#L68-L85)

异常保留旧读数。

<details>
<summary>查看原文（18行）</summary>

```text
  render(null)
  let disposed = false
  let inflight = false
  const tick = async (): Promise<void> => {
    if (disposed || inflight) return
    inflight = true
    try {
      const response = await fetch(SYSINFO_ROUTE, { cache: 'no-store' })
      const body = await response.json() as SysInfoResponse
      if (!disposed && body.ok) render(body.info)
    } catch {
      // A transient route error keeps the last sample on screen.
    } finally {
      inflight = false
    }
  }
  void tick()
  const timer = window.setInterval(() => { void tick() }, 1000)
```

</details>

**依据 4 · 作者声明**：[README.md:46-49](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/README.md#L46-L49)

作者的跨源保护说明。

```text
## 工作方式

- **Host**（`src/index.ts`）：通过 `ctx.interval` 挂载每秒运行且随插件生命周期清理的后台采样器，经 `ctx.shell` 采样（`/proc/stat`、`nproc`、`/proc/meminfo`、`df -P /`），把最新快照写入内存缓存。路由 `GET /dsh-sysmon/api` 只返回缓存（亚毫秒、零子进程开销），并拒绝非 GET 方法与跨源浏览器请求。CPU 使用率为相邻两次采样之间的增量（窗口约 1 秒），首次采样显示 0。
- **Client**（`src/client/index.ts`）：创建 `#dsh-sysmon` 固定定位元素，每 1 秒 `fetch` 一次路由，带 in-flight 守卫避免请求重叠；重绘只更新三个数值节点（diff 式）。纯 DOM 实现、零运行时依赖。
```

#### 缺口

- 没有宿主认证与反代配置。
  **影响**：遥测暴露范围无法判断。
  **进一步探讨**：核 DSH Web 鉴权、代理 Host/Origin 传递和外网访问。
- 未执行故障注入。
  **影响**：陈旧读数持续时间未量化。
  **进一步探讨**：模拟采样失败和接口断开核 UI/响应。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装与持续采样成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包 0.2.1 BSD-3-Clause、Node ^22.19 或 >=24，Web profile，需 webServer、shell、timer 和 Linux 的 /proc/stat、/proc/meminfo、nproc、df。Host 每秒一个有 3 秒超时、4096 字节输出上限的 shell 任务；避免重叠但仍有固定进程开销。Client 每秒请求缓存路由；随 effect 清理 DOM、定时器和路由。CPU 窗口约一秒，首次为零，根盘指标可能不等于用户关注的挂载卷。没有部署性能测量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:24-62](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/package.json#L24-L62)

Web 包与 Node 版本。

<details>
<summary>查看原文（39行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": []
    }
  },
  "files": [
    "lib",
    "cordis.patch.yml"
  ],
  "keywords": [
    "dsh",
    "deepseek-harness",
    "plugin",
    "dsh-plugin",
    "web-ui",
    "system-monitor",
    "cpu",
    "memory",
    "disk"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json && tsdown -c tsdown.config.mjs",
    "check": "tsc -p tsconfig.json --noEmit --pretty false",
    "test": "vitest run"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsdown": "^0.22.14",
    "typescript": "^6.0.3",
    "vitest": "^3.2.4"
  },
  "engines": {
    "node": "^22.19 || >=24"
  },
  "license": "BSD-3-Clause"
```

</details>

**依据 2 · 源码核查**：[src/index.ts:31-34](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/index.ts#L31-L34)

注入及节奏。

```text
export const inject = ['webServer', 'shell', 'timer']

/** Sampler cadence; also the overlay's refresh period. */
const SAMPLER_INTERVAL_MS = 1000
```

**依据 3 · 源码核查**：[src/index.ts:74-108](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/index.ts#L74-L108)

超时、限流、清理。

<details>
<summary>查看原文（35行）</summary>

```text
  const sample = async (): Promise<void> => {
    if (sampling) return
    sampling = true
    try {
      const spec = ctx.shell.resolve({ command: COLLECT_COMMAND, timeoutMs: 3000, stdoutMaxBytes: 4096 })
      const result = await ctx.shell.run(spec)
      if (result.exitCode !== 0) return
      const raw = parseSysInfoOutput(result.stdout.text)
      if (raw === null) return
      cached = toSysInfo(prevCpu, raw)
      prevCpu = { total: raw.total, idle: raw.idle }
    } catch (error) {
      // A transient sampler failure keeps the previous snapshot on screen.
      console.error('sysmon: sampler failed', error)
    } finally {
      sampling = false
    }
  }
  void sample()
  ctx.interval(() => { void sample() }, SAMPLER_INTERVAL_MS)
  ctx.effect(() => {
    const disposeRoute = ctx.webServer.register({
      kind: 'exact',
      path: SYSINFO_ROUTE,
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'method not allowed' })
        if (!sameOrigin(req)) return json(res, 403, { ok: false, error: 'cross-origin request rejected' })
        if (cached === null) return json(res, 503, { ok: false, error: 'no sample yet' })
        return json(res, 200, { ok: true, info: cached })
      },
    })
    return () => {
      disposeRoute()
    }
  }, 'sysmon: system-status API')
```

</details>

**依据 4 · 源码核查**：[src/collect.ts:18-26](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/collect.ts#L18-L26)

平台命令。

```text
export const COLLECT_COMMAND = [
  // steal ($9) counts toward busy: a virtualized tenant's CPU is being taken
  // by the hypervisor and is not idle time. guest/guest_nice are already
  // folded into user/nice and must not be added again.
  "awk '/^cpu /{t=$2+$3+$4+$5+$6+$7+$8+$9;i=$5;print t\" \"i}' /proc/stat",
  'nproc',
  "awk '/^MemTotal/{T=$2}/^MemAvailable/{A=$2}END{print T\" \"A}' /proc/meminfo",
  "df -P / | awk 'NR==2{print $2\" \"$3}'",
].join('\n')
```

**依据 5 · 源码核查**：[src/client/index.ts:84-91](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/client/index.ts#L84-L91)

客户端轮询与清理。

```text
  void tick()
  const timer = window.setInterval(() => { void tick() }, 1000)
  ctx.effect(() => () => {
    disposed = true
    window.clearInterval(timer)
    root.remove()
    style.remove()
  }, 'sysmon: bottom-right status overlay')
```

#### 缺口

- 无长期负载对照。
  **影响**：固定采样开销和资源峰值未知。
  **进一步探讨**：在不同核心/容器规模测一小时进程 CPU 与请求量。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证这个悬浮窗确实有用且不误报？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前适合 Linux 单宿主的轻量观察，不宜作为正式告警或容量决策依据。未实现的改进是假设在快照中加入采样时间、宿主身份和过期状态，失败超过两周期改灰并提示“采样中断”，同时明确根盘；可对照现行版本用断采、断路由、容器/远程访问和高负载样本测误认率、发现延迟与每小时 CPU/请求成本。更进一步需按挂载点配置和告警规则，但不算当前功能。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:70-102](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/index.ts#L70-L102)

缓存无时间戳。

<details>
<summary>查看原文（33行）</summary>

```text
export function apply(ctx: HostContext): void {
  let cached: SysInfo | null = null
  let prevCpu: RawCpu | null = null
  let sampling = false
  const sample = async (): Promise<void> => {
    if (sampling) return
    sampling = true
    try {
      const spec = ctx.shell.resolve({ command: COLLECT_COMMAND, timeoutMs: 3000, stdoutMaxBytes: 4096 })
      const result = await ctx.shell.run(spec)
      if (result.exitCode !== 0) return
      const raw = parseSysInfoOutput(result.stdout.text)
      if (raw === null) return
      cached = toSysInfo(prevCpu, raw)
      prevCpu = { total: raw.total, idle: raw.idle }
    } catch (error) {
      // A transient sampler failure keeps the previous snapshot on screen.
      console.error('sysmon: sampler failed', error)
    } finally {
      sampling = false
    }
  }
  void sample()
  ctx.interval(() => { void sample() }, SAMPLER_INTERVAL_MS)
  ctx.effect(() => {
    const disposeRoute = ctx.webServer.register({
      kind: 'exact',
      path: SYSINFO_ROUTE,
      handler: async (req: IncomingMessage, res: ServerResponse) => {
        if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'method not allowed' })
        if (!sameOrigin(req)) return json(res, 403, { ok: false, error: 'cross-origin request rejected' })
        if (cached === null) return json(res, 503, { ok: false, error: 'no sample yet' })
        return json(res, 200, { ok: true, info: cached })
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:57-85](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/src/client/index.ts#L57-L85)

页面无失败提示，保留上次值。

<details>
<summary>查看原文（29行）</summary>

```text
  const render = (info: SysInfo | null): void => {
    cpuValue.textContent = info === null ? '--%/--' : `${info.cpu}%/${info.cores}`
    memValue.textContent = info === null ? '--%' : `${info.mem}%`
    diskValue.textContent = info === null ? '--%' : `${info.disk}%`
    const cpuLevel = info === null ? 'normal' : cpuWarnLevel(info.cpu, info.cores)
    const memLevel = info === null ? 'normal' : warnLevel(info.mem)
    const diskLevel = info === null ? 'normal' : warnLevel(info.disk)
    cpuValue.className = LEVEL_CLASS[cpuLevel]
    memValue.className = LEVEL_CLASS[memLevel]
    diskValue.className = LEVEL_CLASS[diskLevel]
  }
  render(null)
  let disposed = false
  let inflight = false
  const tick = async (): Promise<void> => {
    if (disposed || inflight) return
    inflight = true
    try {
      const response = await fetch(SYSINFO_ROUTE, { cache: 'no-store' })
      const body = await response.json() as SysInfoResponse
      if (!disposed && body.ok) render(body.info)
    } catch {
      // A transient route error keeps the last sample on screen.
    } finally {
      inflight = false
    }
  }
  void tick()
  const timer = window.setInterval(() => { void tick() }, 1000)
```

</details>

**依据 3 · 作者声明**：[README.md:51-55](https://github.com/AKS1st/dsh-sysmon/blob/4cb7a241f0228329d12010b4846c1bd508271ec0/README.md#L51-L55)

作者范围限制。

```text
## 已知限制

- **仅 Linux**——宿主采集器读取 `/proc/stat`、`/proc/meminfo` 与 `df`；其他平台需要不同的采集器。
- **仅根文件系统**——磁盘占用只报告 `/`，按挂载点选择暂缓。
- **采样窗口近似**——CPU 百分比是相邻两次采样（约 1 秒）间隔内忙时占比，窗口内瞬时突发被平均。
```

#### 缺口

- 时间戳/过期提示尚未实现。
  **影响**：无法视为当前贡献。
  **进一步探讨**：实现后做故障注入对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
