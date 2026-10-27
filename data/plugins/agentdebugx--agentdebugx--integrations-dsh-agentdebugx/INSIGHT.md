# dsh-agentdebugx

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[2437c73](https://github.com/AgentDebugX/AgentDebugX/tree/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx)

<!-- BEGIN META -->
[![GitHub ★ 67](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=67&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AgentDebugX/AgentDebugX) [![npm 30d 784](https://img.shields.io/static/v1?label=npm+30d&message=784&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agentdebugx) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agentdebugx)
<!-- END META -->

> **实现功能**：连接 DSH 会话与 AgentDebugX，支持保存会话发现、当前或历史轨迹诊断和本地查看。

> **核心亮点**：将DSH完成边界、Zstandard日志、模型工具和Python诊断接成一条本地流程，保留deep失败与原任务结果；核心诊断算法仍归AgentDebugX。详见[Q01](#research-q01)。

> **风险与缺陷**：持久DSH日志分支只作词法root核对后读取，和Python通用轨迹真实路径检查不一致；超时也未见终止后台诊断。静态风险未复现，足以收窄当前采用。详见[Q03](#research-q03)。

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
  - [Q01 · 适配器解决什么任务，相对CLI多了什么？](#detail-section-11)
  - [Q02 · 完成边界、桥协议及降级如何工作？](#detail-section-12)
  - [Q03 · 路径、历史选择和超时的边界是什么？](#detail-section-13)
  - [Q04 · 安装与长期诊断依赖什么？](#detail-section-14)
  - [Q05 · 首次、持续、恢复成本及工程设计如何？](#detail-section-15)
  - [Q06 · 可提出何种假设，当前该怎样采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者解释Agent失败/重试，需要把已完成会话变成可回指事件的诊断报告；不以无finding当任务成功。详见[Q01](#research-q01)。

手工导出DSH日志并用AgentDebugX CLI归一化/诊断/打开为简单替代，适配器减少交接但扩大模型可读历史和运行环境责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 保存会话发现 | 找到待诊断对象 | root及候选确认重要 |
| heuristic/deep诊断 | 形成报告 | deep非独立验证且消耗模型 |
| 本地查看与记录 | 回指事件和结果 | SQLite含敏感数据，dashboard需边界 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| DSH sessions/tools/commands/systemPrompt/llm | 工具与模型回调 | API/事件变更影响接线 |
| Python和AgentDebugX UI | 诊断及viewer | npm不自动准备 |
| SQLite/本地dashboard | 保存与查看 | 敏感数据和端口需管理 |
| 可选模型route | deep诊断 | 失败降级，费用仍适用 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 分别准备Python和DSH包 | 维护者 | 环境/模块可达 |
| 缩窄roots并选模式 | 用户 | 历史访问与费用明确 |
| 先列保存候选再确认 | 用户/Agent | 确定目标而非猜测会话 |
| 诊断并复核结果 | Agent/用户 | 区分mode/deepError/recordedOutcome |
| 超时先核对状态再重试 | 用户 | 不假定后台已停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Python/依赖、SQLite与本地端口 | 独立环境和root配置 | 需Python/SQLite/端口与root配置；初始化费用/时间未知 |
| 持续使用 | heuristic CPU/I/O；deep复用模型仍收费 | 选择轨迹、检查诊断与根因 | deep复用宿主模型仍计费；长日志解压CPU/IO与等待未知 |
| 失败恢复 | 后台可能继续，重试可能重复费用/记录 | 核对超时状态、已写报告和敏感输入 | 超时后台可继续且重试可重复收费；诊断有效率/恢复工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| DSH轨迹接入 | 完成seq和原生日志映射 | 长日志同步解压开销未知 |
| deep降级 | 失败保留heuristic及deepError | 诊断正确率未测 |
| 本地报告 | SQLite和dashboard | 含敏感提示及工具数据 |

> **思考**：持久DSH日志分支只作词法root核对后读取，和Python通用轨迹真实路径检查不一致；超时也未见终止后台诊断。静态风险未复现，足以收窄当前采用。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将DSH完成边界、Zstandard日志、模型工具和Python诊断接成一条本地流程，保留deep失败与原任务结果；核心诊断算法仍归AgentDebugX。详见[Q01](#research-q01)。

将DSH完成边界、Zstandard日志、模型工具和Python诊断接成一条本地流程，保留deep失败与原任务结果；核心诊断算法仍归AgentDebugX。详见[Q01](#research-q01)。

lazy桥、请求id/route lease、完成边界和模式降级可借鉴；根路径与取消状态仍需统一，跨语言协议成功不代表根因有效。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

持久DSH日志分支只作词法root核对后读取，和Python通用轨迹真实路径检查不一致；超时也未见终止后台诊断。静态风险未复现，足以收窄当前采用。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，先修明物理路径与取消契约，缩窄历史root，之后再考虑不敏感当前工作区轨迹；同模型自诊断不作为独立效果证明。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

DSH事件映射、按需桥和模式降级有源码支持；路径物理边界及取消状态有缺口。输入/任务收据为未验证方向。

- 已检查：作者 README、包清单、源码路径 integrations/dsh-agentdebugx/README.md、integrations/dsh-agentdebugx/package.json、integrations/dsh-agentdebugx/index.js、integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py、integrations/dsh-agentdebugx/test/plugin.test.js 及固定范围 inventory；组件：integrations/dsh-agentdebugx。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定组件源码核查，涉及JS桥/路径/完成边界与Python降级，不审计AgentDebugX全部核心算法，不运行诊断或模型。
- 下一步：进一步探讨可先核对持久日志symlink和超时取消，再用有独立标签的固定故障轨迹比较手工CLI、heuristic与deep的正确率、费用和复核投入。

**分析版本**

- **仓库**：[AgentDebugX/AgentDebugX](https://github.com/AgentDebugX/AgentDebugX)
- **版本号**：0.1.0（[固定提交 2437c73](https://github.com/AgentDebugX/AgentDebugX/tree/2437c73c3183e6b6495259dfbb12464a7f07f6b8)）
- **版本日期**：2026-09-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究绑定确认对象、真实路径/hash、完成边界与取消状态的输入/任务收据，用保存会话及symlink/超时反例验证是否减少错对象诊断与重复执行。当前未验证。详见[Q06](#research-q06)。

进一步探讨可先核对持久日志symlink和超时取消，再用有独立标签的固定故障轨迹比较手工CLI、heuristic与deep的正确率、费用和复核投入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 1526 | 1339 | 94 | — |
| .md | source | 2 | 346 | — | — | 2161 |
| .js | test | 1 | 747 | 672 | 24 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/AgentDebugX/AgentDebugX/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AgentDebugX/AgentDebugX/issues?q=is%3Aissue+created%3A2026-09-22T04%3A58%3A06.313Z..2026-10-22T04%3A58%3A06.313Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AgentDebugX/AgentDebugX/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A58%3A06.313Z..2026-10-22T04%3A58%3A06.313Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定DSH适配器如何把当前与保存会话变为AgentDebugX诊断，输入边界、结果可信度和采用成本是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适配器解决什么任务，相对CLI多了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向想解释DSH Agent失败、重试或异常工具序列的开发者，输入是当前已完成轮次或明确选中的保存轨迹，交付是可回指事件的诊断报告及本地查看入口，而不是自动修复成功。简单替代是导出会话再手工用AgentDebugX CLI归一化、诊断和打开viewer；适配器把这些交接接入模型工具和/agentdebug。

已有增量是保留DSH turn/step/tool关联、原生串联Zstandard日志读取、按需启动桥和模型回调，以及在诊断失败时不丢确定性报告。核心Detect-Attribute-Recover和DeepDebug来自AgentDebugX，不归作DSH适配器原创。没有findings只说明启发式未命中，不意味着任务成功；桥保留recordedOutcome可帮助区分输入任务结果与诊断发现。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh-agentdebugx/README.md:1-18](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/README.md#L1-L18)

作者定义适配器职责与隔离目录。

<details>
<summary>查看原文（18行）</summary>

```text
# dsh-agentdebugx

A separately packaged DeepSeek Harness plugin kept under the AgentDebugX
repository. It connects Harness sessions to AgentDebugX without coupling
Harness-specific code into the `agentdebug` Python package.

The plugin:

- starts no AgentDebugX process when Harness loads the plugin;
- captures and diagnoses Harness turns only when an AgentDebugX tool or command
  is explicitly used;
- stores trajectories in AgentDebugX SQLite storage;
- exposes `/agentdebug status|capabilities|diagnose|open`;
- exposes model-facing saved-session discovery, session diagnosis, saved-trace
  analysis, and capability-discovery tools;
- reads Harness's own persisted sessions, including the concatenated-Zstandard
  `session.jsonl.zstd` container;
- opens the AgentDebugX viewer only when explicitly requested or configured;
```

</details>

**依据 2 · 源码核查**：[integrations/dsh-agentdebugx/index.js:318-355](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L318-L355)

DSH日志转同shape，保留事件而非通用扁平转换。

<details>
<summary>查看原文（38行）</summary>

```text
/**
 * Read a persisted Harness session log into the same snapshot shape the live
 * `session/event` feed produces, so on-disk sessions reuse the bridge's
 * Harness-aware event mapping instead of generic trace auto-detection.
 */
export function readSessionLog(target) {
  const file = resolveSessionLog(target)
  const raw = readFileSync(file)
  const text = file.endsWith('.zstd')
    ? scanZstdFrames(raw)
      .map(frame => zstdDecompressSync(raw.subarray(frame.start, frame.end)).toString('utf8'))
      .join('')
    : raw.toString('utf8')

  let header = {}
  let id
  const events = []
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue
    let record
    try {
      record = JSON.parse(line)
    } catch {
      // A crashed writer can leave a partial trailing line; keep the events
      // that were already durable.
      continue
    }
    if (record.type === 'session') {
      header = record
      id = record.id
      continue
    }
    events.push(record)
  }
  if (events.length === 0) {
    throw new Error(`session log has no events: ${file}`)
  }
  return { id: id ?? path.basename(path.dirname(file)), header, events }
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py:388-397](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py#L388-L397)

存轨迹和报告并返回原记录outcome。

<details>
<summary>查看原文（10行）</summary>

```text
    store = _store(store_path)
    store.save_trajectory(trajectory)
    store.save_report(report)
    summary = _summary(report, dashboard_url)
    summary['mode'] = 'deep' if deep_ran else 'heuristic'
    if deep_error is not None:
        summary['deepError'] = deep_error
    outcome = _recorded_outcome(trajectory)
    if outcome is not None:
        summary['recordedOutcome'] = outcome
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 完成边界、桥协议及降级如何工作？

**研究主题**：功能与机制

#### 完整回答

入口注入sessions/tools/commands/systemPrompt/llm，注册四个工具和用户命令。当前会话诊断先寻找最新completed turn并snapshot到该seq，没有完成边界即报错，防止对尚未稳定的当前轮给最终诊断。它向会话追加agentdebug/start，桥请求完成或失败后追加result，包含analysisId和坐标。

PythonBridge第一次request才start，按JSONL id关联pending、超时和响应；Python将snapshot归一化成AgentTrajectory并交给已有pipeline。heuristic不调用模型，deep通过租借route让桥回调宿主llm，结束finally释放lease。deep异常或没有任何模型调用成功时回到local_default并标记deepError，仍保存trajectory/report。Dashboard独立按需准备，外部健康实例可复用。上述是源码流程，不证明根因诊断准确。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-agentdebugx/index.js:1066-1073](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L1066-L1073)

只取已完成边界。

```text
function requireStableSnapshot(session) {
  const throughSeq = latestCompletedSeq(session)
  if (throughSeq === undefined) {
    throw new Error(
      'AgentDebugX requires at least one completed turn; finish the current turn and retry.',
    )
  }
  return snapshot(session, throughSeq)
```

**依据 2 · 源码核查**：[integrations/dsh-agentdebugx/index.js:1114-1165](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L1114-L1165)

模式租约、事件和错误记录。

<details>
<summary>查看原文（52行）</summary>

```text
async function withMode(bridge, config, session, mode, run) {
  if (mode !== 'deep') return run({ mode: 'heuristic' }, config.timeoutMs)
  const route = resolveRoute(config, session)
  const lease = bridge.lend(route)
  try {
    return await run(
      { mode: 'deep', llm: { token: lease.token, model: route.model } },
      config.deepTimeoutMs,
    )
  } finally {
    lease.release()
  }
}

async function diagnoseSession(bridge, config, session, signal, mode = 'heuristic') {
  const stable = requireStableSnapshot(session)
  const analysisId = `analysis-${randomUUID()}`
  const boundary = stable.events.at(-1)
  const coordinates = {
    analysisId,
    turn: boundary?.data?.turn ?? 0,
    step: boundary?.data?.step ?? 0,
  }
  appendAnalysisEvent(session, 'agentdebug/start', { ...coordinates, mode })
  try {
    const result = await withMode(bridge, config, session, mode, (modeParams, timeoutMs) =>
      bridge.request(
        'diagnose',
        {
          session: stable,
          store: config.store,
          dashboardUrl: config.dashboardUrl,
          ...modeParams,
        },
        signal,
        { timeoutMs },
      ))
    appendAnalysisEvent(session, 'agentdebug/result', {
      ...coordinates,
      mode,
      traceId: result.summary.traceId,
      reportId: result.summary.reportId,
      summary: result.summary.summary,
    })
    return result.summary
  } catch (error) {
    appendAnalysisEvent(session, 'agentdebug/result', {
      ...coordinates,
      mode,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-agentdebugx/index.js:947-968](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L947-L968)

lazy请求、pending和计时器。

<details>
<summary>查看原文（22行）</summary>

```text
  request(method, params = {}, signal, { timeoutMs = this.timeoutMs } = {}) {
    this.start()
    if (signal?.aborted) return Promise.reject(abortError(signal))
    const id = `agentdebugx-${++this.sequence}`
    return new Promise((resolve, reject) => {
      const onAbort = () => {
        this.finish(id)
        reject(abortError(signal))
      }
      const timer = setTimeout(() => {
        this.finish(id)
        reject(new Error(`AgentDebugX ${method} timed out after ${timeoutMs}ms`))
      }, timeoutMs)
      this.pending.set(id, { resolve, reject, timer, signal, onAbort })
      signal?.addEventListener('abort', onAbort, { once: true })
      const payload = `${JSON.stringify({ id, method, params })}\n`
      this.process.stdin.write(payload, error => {
        if (error === null || error === undefined) return
        this.finish(id)
        reject(error)
      })
    })
```

</details>

**依据 4 · 源码核查**：[integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py:349-397](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py#L349-L397)

deep失败和无成功模型调用降级，保存结果。

<details>
<summary>查看原文（49行）</summary>

```text
def _diagnose_trajectory(
    trajectory: AgentTrajectory,
    *,
    store_path: str,
    dashboard_url: Optional[str],
    llm: Any = None,
) -> JsonObject:
    deep_error: Optional[str] = None
    deep_ran = False
    if llm is None:
        report = DiagnosePipeline.local_default().run(trajectory).report
    else:
        try:
            report = _diagnose_deep(trajectory, llm)
            deep_ran = True
        except Exception as exc:
            # DeepDebug refuses to answer when it cannot ground a root cause in
            # a real event, and the host model can be unavailable. Neither is a
            # reason to throw away the deterministic result the caller would
            # otherwise have received.
            host_error = getattr(llm, 'first_error', None)
            deep_error = (
                f'host model call failed: {host_error}' if host_error
                else f'{type(exc).__name__}: {_safe_text(str(exc))}'
            )
        if getattr(llm, 'completed', 0) == 0:
            # DeepDebug's tiers absorb failed calls and can still assemble a
            # verdict from their fallbacks. A verdict no model ever saw must
            # not be presented as a model-backed diagnosis.
            deep_ran = False
            deep_error = (
                f'no host model call succeeded: {llm.first_error}'
                if getattr(llm, 'first_error', None)
                else 'no host model call succeeded'
            )
        elif deep_ran and getattr(llm, 'first_error', None):
            deep_error = f'some host model calls failed: {llm.first_error}'
        if not deep_ran:
            report = DiagnosePipeline.local_default().run(trajectory).report
    store = _store(store_path)
    store.save_trajectory(trajectory)
    store.save_report(report)
    summary = _summary(report, dashboard_url)
    summary['mode'] = 'deep' if deep_ran else 'heuristic'
    if deep_error is not None:
        summary['deepError'] = deep_error
    outcome = _recorded_outcome(trajectory)
    if outcome is not None:
        summary['recordedOutcome'] = outcome
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路径、历史选择和超时的边界是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

历史会话发现被设计成先列候选再请用户确认，tool描述和SYSTEM_PROMPT承载这一行为规则，不能视为工具内部强制人类批准。默认会把DSH_HOME/sessions附加到traceRoots，意味着模型可能读到当前工作区之外的历史提示和工具结果，应由用户明确决定是否关闭历史根。候选列表有数量和摘要限制，但可读取的诊断内容仍敏感，SQLite和dashboard需要本地信任边界。

路径限制还有具体不一致。Python通用轨迹路径先Path.resolve核对真实路径，Node持久DSH日志分支却先用path.resolve/path.relative作词法检查，再readSessionLog，stat/read会跟随符号链接；目录里session.jsonl符号链接也可能指向根外。列表发现拒绝symlink不等于直接analyze_trace同样受保护。这是静态可见的越界读取条件风险，本轮不创建反例或读取敏感文件。request超时仅finish pending并reject，片段没有向Python发送取消诊断，因此超时后是否仍在计算/写库不能假定停止。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-agentdebugx/index.js:358-368](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L358-L368)

Node根判断为词法规范化。

<details>
<summary>查看原文（11行）</summary>

```text
function assertInsideRoots(target, roots) {
  const resolved = path.resolve(target)
  const allowed = roots.some(root => {
    const base = path.resolve(root)
    const relative = path.relative(base, resolved)
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
  })
  if (!allowed) {
    throw new Error(`trace path is outside configured traceRoots: ${resolved}`)
  }
  return resolved
```

</details>

**依据 2 · 源码核查**：[integrations/dsh-agentdebugx/index.js:1169-1189](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L1169-L1189)

DSH日志分支检查后直接读snapshot。

<details>
<summary>查看原文（21行）</summary>

```text
async function diagnosePath(bridge, config, roots, args, signal, session = undefined) {
  const mode = args.mode === 'deep' ? 'deep' : 'heuristic'
  const format = args.format ?? 'auto'
  // A persisted Harness session is read here rather than in Python: the log is
  // a concatenated-Zstandard container Node decodes natively, and routing it
  // through the session mapper preserves turn, step, and tool-call linkage
  // that generic trace detection would flatten.
  if (format === 'dsh_session' || (format === 'auto' && isSessionLogPath(args.path))) {
    assertInsideRoots(args.path, roots)
    const result = await withMode(bridge, config, session, mode, (modeParams, timeoutMs) =>
      bridge.request(
        'diagnose',
        {
          session: readSessionLog(args.path),
          store: config.store,
          dashboardUrl: config.dashboardUrl,
          ...modeParams,
        },
        signal,
        { timeoutMs },
      ))
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py:284-292](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py#L284-L292)

通用Python路径使用真实resolve。

```text
def _allowed_path(raw_path: Any, raw_roots: Any) -> Path:
    path = Path(str(raw_path)).expanduser().resolve()
    roots = raw_roots if isinstance(raw_roots, list) else []
    for raw_root in roots:
        root = Path(str(raw_root)).expanduser().resolve()
        if path == root or root in path.parents:
            return path
    raise PermissionError(
        f'trace path is outside configured traceRoots: {path}'
```

**依据 4 · 源码核查**：[integrations/dsh-agentdebugx/index.js:453-480](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L453-L480)

发现列表拒绝symlink根。

<details>
<summary>查看原文（28行）</summary>

```text
export function listPersistedSessions(sessionsRoot, options = {}) {
  const query = normalizedQuery(options?.query)
  const limit = effectiveSessionLimit(options?.limit)
  const root = sessionsRoot === undefined || sessionsRoot === null || sessionsRoot === ''
    ? ''
    : path.resolve(sessionsRoot)
  const result = {
    sessions: [],
    scanned: 0,
    skipped: 0,
    query,
    limit,
    root,
    available: false,
    warnings: [],
  }
  const warn = text => {
    if (result.warnings.length < 5) result.warnings.push(boundedText(text, 300))
  }
  if (root === '') {
    warn('DSH persisted-session discovery is disabled because no sessions root is configured.')
    return result
  }
  try {
    const rootStats = lstatSync(root)
    if (!rootStats.isDirectory() || rootStats.isSymbolicLink()) {
      warn('The configured DSH sessions root is unavailable or is a symbolic link.')
      return result
```

</details>

**依据 5 · 源码核查**：[integrations/dsh-agentdebugx/index.js:947-958](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L947-L958)

超时只结束调用者pending。

<details>
<summary>查看原文（12行）</summary>

```text
  request(method, params = {}, signal, { timeoutMs = this.timeoutMs } = {}) {
    this.start()
    if (signal?.aborted) return Promise.reject(abortError(signal))
    const id = `agentdebugx-${++this.sequence}`
    return new Promise((resolve, reject) => {
      const onAbort = () => {
        this.finish(id)
        reject(abortError(signal))
      }
      const timer = setTimeout(() => {
        this.finish(id)
        reject(new Error(`AgentDebugX ${method} timed out after ${timeoutMs}ms`))
```

</details>

#### 缺口

- 持久日志分支的真实路径限制与bridge取消协议未形成完整核查。
  **影响**：影响可读取边界和失败后的重复诊断/费用。
  **进一步探讨**：逐层核对文件与目录realpath及协议取消，先用非敏感固定样例确认根外symlink与超时后任务状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装与长期诊断依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

组件与Python AgentDebugX分开安装，Node清单要求^22.19.0或>=24，README要求Python3.9+和agentdebugx[ui]0.3.x；组件导入的宿主工具、llm与schema包及session事件shape也必须匹配。安装npm不自动准备Python，配置python应指向装有所需包的环境，失败需由维护者处理，而非假设宿主SDK内置Python可复用。

持久存储是可配置SQLite，默认.agentdebug/agentdebug.sqlite；dashboard默认127.0.0.1:7777，外网暴露要另设认证和TLS。autoCapture和autoOpen默认关闭，显式诊断会准备viewer但不必弹浏览器；开启自动采集则扩大数据和资源范围。ctx.effect关闭插件拥有的bridge/dashboard，不能替用户删除已保存轨迹或退出外部复用服务。宿主目标为早期0.1.1-rc.2，当前部署其它版本需单独核查，不以peer optional当可用保证。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-agentdebugx/index.js:13-23](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L13-L23)

注入和默认配置。

<details>
<summary>查看原文（11行）</summary>

```text
export const name = 'agentdebugx'
export const inject = ['sessions', 'tools', 'commands', 'systemPrompt', 'llm']

export const Config = Schema.object({
  python: Schema.string().default(process.platform === 'win32' ? 'python' : 'python3'),
  store: Schema.string().default('.agentdebug/agentdebug.sqlite'),
  dashboardUrl: Schema.string().default('http://127.0.0.1:7777'),
  timeoutMs: Schema.number().default(120000),
  autoCapture: Schema.boolean().default(false),
  traceRoots: Schema.array(Schema.string()).default([process.cwd()]),
  dshSessionsRoot: Schema.string(),
```

</details>

**依据 2 · 源码核查**：[integrations/dsh-agentdebugx/index.js:1209-1252](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L1209-L1252)

历史root自动追加、桥回调与进程清理。

<details>
<summary>查看原文（44行）</summary>

```text
export function apply(ctx, config) {
  // Harness keeps its own persisted sessions under $DSH_HOME/sessions, so that
  // directory is readable by default; without it the model could not debug the
  // very traces this plugin talks about.
  const sessionsRoot = config.dshSessionsRoot === ''
    ? undefined
    : config.dshSessionsRoot
      ?? (process.env.DSH_HOME === undefined
        ? undefined
        : path.join(process.env.DSH_HOME, 'sessions'))
  const traceRoots = sessionsRoot === undefined
    ? config.traceRoots
    : [...config.traceRoots, sessionsRoot]

  const bridge = new PythonBridge({
    python: config.python,
    timeoutMs: config.timeoutMs,
    onStderr: text => {
      if (text.length > 0) ctx.logger.warn(`[agentdebugx] ${text}`)
    },
  })

  // AgentDebugX's LLM tiers run on the model this session already uses, so the
  // bridge calls back through here instead of needing its own API credentials.
  bridge.serve('llm.complete', (route, params) => completeWithHost(ctx, route, params))

  const viewer = new TraceViewer({
    dashboardUrl: config.dashboardUrl,
    mode: config.autoOpen,
    onWarn: text => ctx.logger.warn(`[agentdebugx] ${text}`),
  })

  const dashboard = new DashboardProcess({
    python: config.python,
    store: config.store,
    dashboardUrl: config.dashboardUrl,
    onStderr: text => {
      if (text.length > 0) ctx.logger.warn(`[agentdebugx dashboard] ${text}`)
    },
  })

  ctx.effect(() => {
    return () => Promise.all([bridge.close(), dashboard.close()])
  }, 'agentdebugx: lazy runtime cleanup')
```

</details>

**依据 3 · 作者声明**：[integrations/dsh-agentdebugx/README.md:31-49](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/README.md#L31-L49)

作者独立Node/Python安装前提。

<details>
<summary>查看原文（19行）</summary>

````text

## Install from npm

Prerequisites:

- Node.js 22.19+ or 24+;
- a Node-installed DeepSeek Harness profile;
- Python 3.9+;
- AgentDebugX with the optional dashboard dependencies.

Install the Python runtime and the DSH bundle independently:

```powershell
python -m pip install "agentdebugx[ui]>=0.3.1,<0.4"
dsh plugin --profile web add dsh-agentdebugx
dsh --profile web --dump-config
dsh web
```

````

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 首次、持续、恢复成本及工程设计如何？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

按需启动避免纯加载就开Python/dashboard，桥与viewer独立且effect清理，诊断请求id和模式lease适合跨语言集成借鉴。记录已完成边界、保留失败事件、deep退回heuristic不伪装模型结果，也比单纯抛错更便于审计。测试源码专门断言构造bridge不启动Python；本轮只阅读测试，不执行Python或模型。

首次成本包括独立Python依赖、profile配置、SQLite目录和dashboard端口；持续heuristic消耗CPU/I/O和轨迹存储，deep还调用宿主模型。没有额外API Key只表示复用已有路由，不表示免模型费用，同一模型自诊断也不构成独立评价。保存日志同步读全文件并解压全部帧，长日志内存/等待未知。失败恢复要检查是否已写报告、超时后台是否继续及是否重复捕获，再决定重试；不能把工具超时当原子回滚。单位合格诊断的费用、正确根因率和人工收益没有本轮结果。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-agentdebugx/test/plugin.test.js:37-45](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/test/plugin.test.js#L37-L45)

lazy构造的测试预期。

```text
test('Python bridge reports AgentDebugX availability', async () => {
  const bridge = new PythonBridge({
    python,
    timeoutMs: 10_000,
  })
  assert.equal(bridge.process, undefined, 'constructing the plugin must not start Python')
  try {
    const status = await bridge.request('status')
    assert.equal(status.ok, true)
```

**依据 2 · 源码核查**：[integrations/dsh-agentdebugx/index.js:323-330](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L323-L330)

同步读取和全帧解压。

```text
export function readSessionLog(target) {
  const file = resolveSessionLog(target)
  const raw = readFileSync(file)
  const text = file.endsWith('.zstd')
    ? scanZstdFrames(raw)
      .map(frame => zstdDecompressSync(raw.subarray(frame.start, frame.end)).toString('utf8'))
      .join('')
    : raw.toString('utf8')
```

**依据 3 · 源码核查**：[integrations/dsh-agentdebugx/index.js:1114-1125](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L1114-L1125)

模型路由lease和finally释放。

<details>
<summary>查看原文（12行）</summary>

```text
async function withMode(bridge, config, session, mode, run) {
  if (mode !== 'deep') return run({ mode: 'heuristic' }, config.timeoutMs)
  const route = resolveRoute(config, session)
  const lease = bridge.lend(route)
  try {
    return await run(
      { mode: 'deep', llm: { token: lease.token, model: route.model } },
      config.deepTimeoutMs,
    )
  } finally {
    lease.release()
  }
```

</details>

**依据 4 · 源码核查**：[integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py:388-394](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/bridge/agentdebug_bridge.py#L388-L394)

写轨迹报告并明确模式。

```text
    store = _store(store_path)
    store.save_trajectory(trajectory)
    store.save_report(report)
    summary = _summary(report, dashboard_url)
    summary['mode'] = 'deep' if deep_ran else 'heuristic'
    if deep_error is not None:
        summary['deepError'] = deep_error
```

#### 缺口

- 缺少代表性故障集的根因正确率、长日志开销和deep总成本。
  **影响**：无法比较手工CLI、heuristic和deep何者更划算。
  **进一步探讨**：固定已知故障轨迹与独立结果标签，对比准确诊断、总调用费、人工复核和超时后状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 可提出何种假设，当前该怎样采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是给诊断增加可核对的“输入授权和任务状态收据”，同时绑定用户确认的会话候选、真实路径/hash、完成边界、正在运行或取消状态以及报告id。推导来自提示层确认与路径实现不同步、超时后后台状态不明的问题。最小验证用同一批保存会话和symlink/超时反例，比较用户能否确认“读了谁、是否还运行、结果对应哪里”；若收据不绑定实际读取或增加负担却未减少误诊断对象，就否定方案。

本轮建议观察。适配器的流程整合有价值，但先补持久DSH日志的物理路径边界，再确认超时和敏感历史root，才能为当前工作区不敏感轨迹制定可控试用。独立模型或人工标签应作为根因效果依据，不能让同一模型自评自动成为有效。对于不愿让模型访问历史内容或不愿维护Python的用户，手工CLI导出更易控制。没有同版本安装/核心功能/卸载验收，不能给值得安装。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-agentdebugx/index.js:358-368](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L358-L368)

物理路径绑定缺口是推导依据。

<details>
<summary>查看原文（11行）</summary>

```text
function assertInsideRoots(target, roots) {
  const resolved = path.resolve(target)
  const allowed = roots.some(root => {
    const base = path.resolve(root)
    const relative = path.relative(base, resolved)
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
  })
  if (!allowed) {
    throw new Error(`trace path is outside configured traceRoots: ${resolved}`)
  }
  return resolved
```

</details>

**依据 2 · 源码核查**：[integrations/dsh-agentdebugx/index.js:1169-1189](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L1169-L1189)

诊断对象真实读取链。

<details>
<summary>查看原文（21行）</summary>

```text
async function diagnosePath(bridge, config, roots, args, signal, session = undefined) {
  const mode = args.mode === 'deep' ? 'deep' : 'heuristic'
  const format = args.format ?? 'auto'
  // A persisted Harness session is read here rather than in Python: the log is
  // a concatenated-Zstandard container Node decodes natively, and routing it
  // through the session mapper preserves turn, step, and tool-call linkage
  // that generic trace detection would flatten.
  if (format === 'dsh_session' || (format === 'auto' && isSessionLogPath(args.path))) {
    assertInsideRoots(args.path, roots)
    const result = await withMode(bridge, config, session, mode, (modeParams, timeoutMs) =>
      bridge.request(
        'diagnose',
        {
          session: readSessionLog(args.path),
          store: config.store,
          dashboardUrl: config.dashboardUrl,
          ...modeParams,
        },
        signal,
        { timeoutMs },
      ))
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-agentdebugx/index.js:947-958](https://github.com/AgentDebugX/AgentDebugX/blob/2437c73c3183e6b6495259dfbb12464a7f07f6b8/integrations/dsh-agentdebugx/index.js#L947-L958)

状态/取消收据需要覆盖超时。

<details>
<summary>查看原文（12行）</summary>

```text
  request(method, params = {}, signal, { timeoutMs = this.timeoutMs } = {}) {
    this.start()
    if (signal?.aborted) return Promise.reject(abortError(signal))
    const id = `agentdebugx-${++this.sequence}`
    return new Promise((resolve, reject) => {
      const onAbort = () => {
        this.finish(id)
        reject(abortError(signal))
      }
      const timer = setTimeout(() => {
        this.finish(id)
        reject(new Error(`AgentDebugX ${method} timed out after ${timeoutMs}ms`))
```

</details>

#### 缺口

- 根外symlink限制、请求取消和诊断输入确认没有统一协议。
  **影响**：阻碍当前直接升级为可控常规试用。
  **进一步探讨**：先在非敏感固定数据核对这三个契约，再比较诊断收益。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
