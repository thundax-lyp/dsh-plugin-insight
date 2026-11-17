# LoongSuite DSH Observability

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[f44ccfc](https://github.com/loongsuite/dsh-plugin/tree/f44ccfcd2255186bfcfe1c9f8c7db047204865b7)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/loongsuite/dsh-plugin) [![npm 30d 5,334](https://img.shields.io/static/v1?label=npm+30d&message=5%2C334&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@loongsuite/dsh-plugin) [![最新发布 2026-10-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@loongsuite/dsh-plugin)
<!-- END META -->

> **功能**：将 DSH 会话、模型流和工具生命周期转换为 OpenTelemetry 跟踪和指标。

> **亮点**：由 DSH 会话原生事件建立可聚合的模型、步骤和工具链路，省去部分日志拼接，见 [Q01](#research-q01)。

> **主要限制**：跟踪覆盖和字段是否符合实际预期？中途启动缺片段，内容关闭仍可发路径和标识，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 怎样从一次 DSH 失败找到实际阶段？](#detail-section-11)
  - [Q02 · 跟踪如何匹配会话和失败，何时会缺片段？](#detail-section-12)
  - [Q03 · 内容关掉以后，还会发什么？](#detail-section-13)
  - [Q04 · 怎样判断追踪能减少排障时间？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合维护 DSH 并需定位回合失败的工程人员，见 [Q01](#research-q01)。

以手工宿主日志和自建链路关联为对照，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 跟踪 | 定位模型及工具失败 | 依赖 DSH 生命周期和采集覆盖 |
| 指标 | 观察耗时与用量 | 需后端支持 |
| 字段开关 | 控制文本是否记入跟踪 | 标量元数据仍需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH sessions 和 llm | 必需 | 注册原生观察 | 无法建立完整链路 |
| OTLP 收集器 | 消费数据所需 | 接收跟踪及指标 | 日志中回查发送异常 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 配置独立本地收集器并禁用内容 | 地址和字段按预期 |
| 回放 | 触发一次失败与重试 | 核对跨度和结束状态 |
| 退出 | 停用观察并查收集器 | 回到宿主日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 收集服务 | 配置连接与样本 | 耗时未知 |
| 持续 | 批量内存、传输与存储 | 比对漏项及隐私字段 | 成本待测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 根因定位 | 事件和输出关联到跟踪 | 目标环境定位时间 |
| 退出 | 解绑并关闭服务端管线 | 异常退出的发送完整性 |

> **思考**：跟踪覆盖和字段是否符合实际预期？中途启动缺片段，内容关闭仍可发路径和标识，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：由 DSH 会话原生事件建立可聚合的模型、步骤和工具链路，省去部分日志拼接，见 [Q01](#research-q01)。

受控生命周期关闭未完成 span，专用 provider 与宿主进程内其余采集路径要区分，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

跟踪覆盖和字段是否符合实际预期？中途启动缺片段，内容关闭仍可发路径和标识，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在本地隔离 collector 检查失败回合，明确关内容并核对仍有的路径和 ID，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持原生生命周期、OTLP 管线及字段控制，宿主兼容、导出负载和性能未验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、README.md、src/index.ts、src/coordinator.ts、src/config.ts、src/mapping.ts、src/telemetry.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定组件源码和构建。未执行目标插件、实际发送或后端性能测试。
- 下一步：通过脱敏回合、模拟失败和收集器停机复核字段、关联和退出，见 [Q04](#research-q04)。

**分析版本**

- **仓库**：[loongsuite/dsh-plugin](https://github.com/loongsuite/dsh-plugin)
- **版本号**：0.1.3（[固定提交 f44ccfc](https://github.com/loongsuite/dsh-plugin/tree/f44ccfcd2255186bfcfe1c9f8c7db047204865b7)）
- **版本日期**：2026-10-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在受控收集器对照有无 cwd 等标量，测最小字段能否保留同等根因定位，见 [Q04](#research-q04)。

通过脱敏回合、模拟失败和收集器停机复核字段、关联和退出，见 [Q04](#research-q04)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 679 | — | — | 5033 |
| .md | example | 2 | 200 | — | — | 1510 |
| .ts | source | 8 | 1589 | 1367 | 114 | — |
| .ts | test | 8 | 1185 | 1086 | 21 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/loongsuite/dsh-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/loongsuite/dsh-plugin/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)

暂未获取：近30天关闭。

统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护者能否在同一跟踪中解释一次失败回合，同时控制发送的内容及采集副作用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 怎样从一次 DSH 失败找到实际阶段？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护本地或团队 DSH 的工程人员可用同一回合中的步骤、模型和工具定位延迟或失败。手工日志可审单次失败。插件的增量是原生监听、在回合内把几个阶段归到同一 trace，再用通用 OTLP 后端切片查询，省去自行写日志关联脚本。合格结果应能从工具调用 ID 查到对应结果，并看到模型尝试的真实结束，而仅凭笼统回合状态不足以定位。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-12](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/README.md#L5-L12)

作者说明原生观察与后端接口。

```text
`@loongsuite/dsh-plugin` is a standalone, open-source observability plugin for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`). It observes DSH's native
session, agent loop, LLM stream, and tool lifecycle, converts them into OpenTelemetry GenAI traces
and metrics, and exports standard OTLP/HTTP protobuf to any compatible backend.

LoongSuite is an open-source observability collection ecosystem built on OpenTelemetry. This
repository is its native DSH integration. The plugin does **not** depend on or require LoongSuite
Pilot, a sidecar, a local JSONL tap, or any particular vendor's backend.
```

**依据 2 · 源码核查**：[src/index.ts:35-64](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/index.ts#L35-L64)

注册会话和模型监听。

<details>
<summary>查看原文（30行）</summary>

```text

  const telemetry = createTelemetryPipeline(resolvedConfig)
  const coordinator = new DshTraceCoordinator(telemetry.handler, resolvedConfig, dsh.logger)

  // Adopt identity only. Replaying existing events would duplicate spans after
  // HMR, so telemetry begins at each session's next native turn/start.
  for (const session of dsh.sessions.list()) coordinator.adoptSession(session)

  const disposers = [
    dsh.on('session/created', (session) => {
      try {
        coordinator.adoptSession(session)
      } catch (error: unknown) {
        dsh.logger.warn(
          `[loongsuite-observability] failed to adopt session ${String(session.id)}: ${String(error)}`,
        )
      }
    }),
    dsh.on('session/event', (session, event) => coordinator.onSessionEvent(session, event)),
    dsh.on('session/disposed', (session) => {
      try {
        coordinator.disposeSession(session)
      } catch (error: unknown) {
        dsh.logger.warn(
          `[loongsuite-observability] failed to dispose session ${String(session.id)}: ${String(error)}`,
        )
      }
    }),
    dsh.on('llm/stream', (options, next) => coordinator.interceptLlm(options, next)),
  ]
```

</details>

**依据 3 · 源码核查**：[src/coordinator.ts:235-291](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/coordinator.ts#L235-L291)

回合、步骤与工具事件的分派。

<details>
<summary>查看原文（57行）</summary>

```text
  onSessionEvent(session: DshSession, event: DshSessionEvent): void {
    try {
      const state = this.ensureSession(session)
      switch (event.type) {
        case 'turn/start':
          this.startTurn(state, eventData<{ turn: number }>(event).turn, event.time)
          break
        case 'turn/end': {
          const data = eventData<{ turn: number; reason: DshTurnReason }>(event)
          if (state.turn?.turn === data.turn) this.closeTurn(state, data.reason, event.time)
          break
        }
        case 'step/start': {
          const data = eventData<{ turn: number; step: number }>(event)
          this.startStep(state, data.turn, data.step, event.time)
          break
        }
        case 'step/end': {
          const data = eventData<{ turn: number; step: number }>(event)
          const step = state.turn?.step
          if (step?.turn === data.turn && step.step === data.step) {
            this.closeStep(state.turn!, event.time)
          }
          break
        }
        case 'user/message':
          this.captureTurnInput(state, eventData<DshMessage>(event))
          break
        case 'assistant/message': {
          const data = eventData<{ turn: number; step: number; message: DshMessage }>(event)
          this.captureTurnOutput(state, data.turn, data.step, data.message)
          break
        }
        case 'tool/call': {
          const data = eventData<{
            turn: number
            step: number
            callId: string
            name: string
            arguments: string
          }>(event)
          this.startTool(state, data, event.time)
          break
        }
        case 'tool/result': {
          const data = eventData<{
            turn: number
            step: number
            message: DshMessage
            error?: { name: string; code: string }
          }>(event)
          this.endTool(state, data, event.time)
          break
        }
      }
    } catch (error: unknown) {
      this.warn(`failed to observe ${event.type} for session ${String(session.id)}: ${errorMessage(error)}`)
```

</details>

#### 缺口

- 缺真实团队定位任务
  **影响**：未能量化排障节时
  **进一步探讨**：比较已知模型失败和工具失败的排查过程

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 跟踪如何匹配会话和失败，何时会缺片段？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

插件需要 sessions 和 llm，通过回合与步骤事件创建父级，通过工具 callId 和流作用域挂接子级。启动时仅收集当前存在会话身份，不重播历史，因此热重载避免重复，但不会补齐正在运行的半个回合。模型流先委托给原路径，成功匹配时才观察实际流。流未正常结束、提前中止或步骤提前关停，未完子级按错误结束。卸载先解绑监听、关闭在途跟踪，再关闭 OTLP 管线。后端不可达或进程立即退出时，不能凭本地已关闭跟踪断言已经送达。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:18-41](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/index.ts#L18-L41)

宿主注入和不重放策略。

<details>
<summary>查看原文（24行）</summary>

```text
export const name = 'loongsuite-observability'
export const inject = ['sessions', 'llm'] as const
export const Config = ConfigSchema
export type Config = PluginConfig

/** Install native DSH lifecycle observation and an isolated OTLP pipeline. */
export function apply(ctx: Context, config: Config): void {
  const dsh = ctx as unknown as DshPluginContext
  const resolvedConfig = {
    ...config,
    captureContent: resolveCaptureContent(config.captureContent),
    exportMetrics: resolveExportMetrics(config.exportMetrics),
  }
  if (!resolvedConfig.enabled) {
    dsh.logger.info('[loongsuite-observability] collection is disabled')
    return
  }

  const telemetry = createTelemetryPipeline(resolvedConfig)
  const coordinator = new DshTraceCoordinator(telemetry.handler, resolvedConfig, dsh.logger)

  // Adopt identity only. Replaying existing events would duplicate spans after
  // HMR, so telemetry begins at each session's next native turn/start.
  for (const session of dsh.sessions.list()) coordinator.adoptSession(session)
```

</details>

**依据 2 · 源码核查**：[src/coordinator.ts:295-315](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/coordinator.ts#L295-L315)

包装匹配的模型流。

<details>
<summary>查看原文（21行）</summary>

```text
  interceptLlm(
    options: DshGenerateOptions,
    next: () => AsyncIterable<DshStreamChunk>,
  ): AsyncIterable<DshStreamChunk> {
    if (options.sessionId === undefined || options.purpose !== undefined) return next()

    let llm: LlmState | undefined
    try {
      llm = this.startLlm(options)
    } catch (error: unknown) {
      this.warn(`failed to start LLM telemetry for session ${options.sessionId}: ${errorMessage(error)}`)
    }

    let stream: AsyncIterable<DshStreamChunk>
    try {
      stream = next()
    } catch (error: unknown) {
      if (llm !== undefined) this.failLlm(llm, error, Date.now())
      throw error
    }
    return llm === undefined ? stream : this.observeLlmStream(llm, stream)
```

</details>

**依据 3 · 源码核查**：[src/coordinator.ts:448-474](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/coordinator.ts#L448-L474)

无结束块、取消与提前终止的处理。

<details>
<summary>查看原文（27行）</summary>

```text
    state: LlmState,
    stream: AsyncIterable<DshStreamChunk>,
  ): AsyncIterable<DshStreamChunk> {
    try {
      for await (const chunk of stream) {
        try {
          this.observeLlmChunk(state, chunk)
        } catch (error: unknown) {
          this.warn(`failed to process an LLM chunk: ${errorMessage(error)}`)
        }
        yield chunk
      }
      if (!state.ended) {
        this.failLlm(state, new Error('LLM stream ended without a finish chunk'), Date.now())
      }
    } catch (error: unknown) {
      if (!state.ended) this.failLlm(state, error, Date.now())
      throw error
    } finally {
      if (!state.ended) {
        const aborted = state.options.signal?.aborted === true
        this.failLlm(
          state,
          new Error(aborted ? 'LLM stream was aborted' : 'LLM stream consumer stopped early'),
          Date.now(),
        )
      }
```

</details>

**依据 4 · 源码核查**：[src/coordinator.ts:684-706](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/coordinator.ts#L684-L706)

步骤结束时关闭未完成跟踪。

<details>
<summary>查看原文（23行）</summary>

```text
  private closeStep(turn: TurnState, endTime: number, forcedReason?: string): void {
    const step = turn.step
    if (step === undefined) return
    for (const llm of step.llms) {
      if (!llm.ended) this.failLlm(llm, new Error('DSH step ended before the LLM stream'), endTime)
    }
    for (const tool of step.tools.values()) {
      if (!tool.ended) this.failTool(tool, new Error('DSH step ended before the tool result'), endTime)
    }
    const finishReason = forcedReason ?? step.lastFinishReason ?? 'completed'
    step.invocation.finishReason = finishReason
    const failureReason = forcedReason
      ?? (finishReason === 'error' || finishReason === 'cancelled' ? finishReason : undefined)
    if (failureReason === undefined) {
      succeed(step.invocation)
      this.handler.stopReactStep(step.invocation, endTime)
    } else {
      this.handler.failReactStep(step.invocation, {
        message: `DSH step ${failureReason}`,
        type: failureReason.toUpperCase(),
      }, endTime)
    }
    turn.step = undefined
```

</details>

**依据 5 · 源码核查**：[src/index.ts:66-74](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/index.ts#L66-L74)

解绑与管线退出。

```text
  dsh.effect(() => async () => {
    for (const dispose of disposers.reverse()) dispose()
    try {
      coordinator.closeAll()
    } catch (error: unknown) {
      dsh.logger.warn(`[loongsuite-observability] failed to close live spans: ${String(error)}`)
    }
    await telemetry.shutdown()
  }, 'loongsuite-observability: detach listeners and shutdown OTLP')
```

#### 缺口

- 未验证运行中的事件形状和发送可靠性
  **影响**：热重载及故障时存在覆盖变化
  **进一步探讨**：触发半途卸载和收集器故障并核对 trace

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 内容关掉以后，还会发什么？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

显式 captureContent 优先，其余由 OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT 的允许值启用。开启时模型、工具与回合内容按规则映射、序列化和截断，截断本身不做脱敏。关闭内容后仍发标量会话信息，代码包括工作目录、父会话、Agent 预设及回合编号。端点优先专用配置、通用配置及环境，认证头也合并。批处理限制大小和队列，批大于队列直接拒绝。指标可按配置关闭其私有 exporter，但处理器回落到全局 metrics API，因此不宜仅据开关宣称宿主的其他指标管线不可能发出记录。排障收益必须计入网络、收集器容量和漏项复核。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:60-92](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/config.ts#L60-L92)

内容与指标开关优先级。

<details>
<summary>查看原文（33行）</summary>

```text
const CONTENT_CAPTURE_ENV = 'OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT'
const SPAN_CONTENT_MODES = new Set(['SPAN_ONLY', 'SPAN_AND_EVENT'])

/**
 * Resolve the privacy-sensitive content switch.
 *
 * An explicit plugin setting always wins. When it is omitted, reuse the
 * content-capture modes understood by @loongsuite/otel-util-genai. Modes that
 * do not place content on spans remain disabled because this plugin exports
 * trace spans rather than GenAI log events.
 */
export function resolveCaptureContent(
  configured: boolean | undefined,
  environment: NodeJS.ProcessEnv = process.env,
): boolean {
  if (configured !== undefined) return configured
  const mode = environment[CONTENT_CAPTURE_ENV]?.trim().toUpperCase()
  return mode !== undefined && SPAN_CONTENT_MODES.has(mode)
}

/**
 * Resolve the metrics switch.
 *
 * An explicit plugin setting always wins. When it is omitted, the standard
 * `OTEL_METRICS_EXPORTER=none` spelling disables metrics; every other value
 * keeps the current behaviour because the plugin only ever exports OTLP.
 */
export function resolveExportMetrics(
  configured: boolean | undefined,
  environment: NodeJS.ProcessEnv = process.env,
): boolean {
  if (configured !== undefined) return configured
  return environment[METRICS_EXPORTER_ENV]?.trim().toLowerCase() !== 'none'
```

</details>

**依据 2 · 源码核查**：[src/coordinator.ts:177-196](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/coordinator.ts#L177-L196)

关闭内容仍保留的标量元数据。

<details>
<summary>查看原文（20行）</summary>

```text
function scalarAttributes(session: DshSession, turn: number): Record<string, unknown> {
  const header = session.header
  return {
    'gen_ai.agent.system': 'deepseek-harness',
    'gen_ai.session.id': String(session.id),
    'gen_ai.turn.id': `${String(session.id)}:${turn}`,
    'dsh.session.id': String(session.id),
    'dsh.turn': turn,
    ...header.cwd === undefined ? {} : { 'dsh.session.cwd': header.cwd },
    ...header.parentSession === undefined
      ? {}
      : { 'dsh.session.parent_id': String(header.parentSession) },
    ...header.origin === undefined ? {} : { 'dsh.session.origin': header.origin },
    ...header.delegationDepth === undefined
      ? {}
      : { 'dsh.session.delegation_depth': header.delegationDepth },
    ...header.agentPreset === undefined
      ? {}
      : { 'dsh.agent.preset': header.agentPreset },
    'gen_ai.agent.name': header.agentPreset || 'deepseek-harness',
```

</details>

**依据 3 · 源码核查**：[src/mapping.ts:197-227](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/mapping.ts#L197-L227)

内容序列化和截断。

<details>
<summary>查看原文（31行）</summary>

```text
/** JSON-serialize captured content with a valid, explicit truncation marker. */
export function serializeCaptured(value: unknown, maxChars: number): string {
  const serialized = JSON.stringify(value)
  if (serialized.length <= maxChars) return serialized
  return JSON.stringify({
    truncated: true,
    original_characters: serialized.length,
    limit_characters: maxChars,
  })
}

export function capturedLlmAttributes(
  options: DshGenerateOptions,
  inputMessages: readonly InputMessage[],
  outputMessages: readonly OutputMessage[],
  maxChars: number,
): Record<string, string> {
  return {
    [CONTENT_ATTRIBUTES.inputMessages]: serializeCaptured(inputMessages, maxChars),
    [CONTENT_ATTRIBUTES.outputMessages]: serializeCaptured(outputMessages.map(message => ({
      role: message.role,
      parts: message.parts,
      finish_reason: message.finishReason,
    })), maxChars),
    [CONTENT_ATTRIBUTES.systemInstructions]: serializeCaptured(mapSystemInstruction(options.system), maxChars),
    [CONTENT_ATTRIBUTES.toolDefinitions]: serializeCaptured(mapToolDefinitions(options.tools), maxChars),
  }
}

/**
 * Select the one turn-level answer consumers should treat as the agent result.
```

</details>

**依据 4 · 源码核查**：[src/telemetry.ts:80-95](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/telemetry.ts#L80-L95)

上报端点及头字段。

<details>
<summary>查看原文（16行）</summary>

```text
function resolveEndpoint(config: Config, signal: 'traces' | 'metrics'): string | undefined {
  const explicit = signal === 'traces' ? config.traceEndpoint : config.metricEndpoint
  if (explicit) return explicit.replace(/\/+$/, '')
  if (config.endpoint) return signalUrl(config.endpoint, signal)
  const signalEnv = process.env[`OTEL_EXPORTER_OTLP_${signal.toUpperCase()}_ENDPOINT`]
  if (signalEnv) return signalEnv.replace(/\/+$/, '')
  const commonEnv = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  return commonEnv ? signalUrl(commonEnv, signal) : undefined
}

function resolveHeaders(config: Config, signal: 'traces' | 'metrics'): Record<string, string> {
  const general = parseKeyValueList(process.env.OTEL_EXPORTER_OTLP_HEADERS)
  const signalHeaders = parseKeyValueList(
    process.env[`OTEL_EXPORTER_OTLP_${signal.toUpperCase()}_HEADERS`],
  )
  return { ...general, ...signalHeaders, ...config.headers }
```

</details>

**依据 5 · 源码核查**：[src/telemetry.ts:145-188](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/telemetry.ts#L145-L188)

批量队列和私有或全局指标接线。

<details>
<summary>查看原文（44行）</summary>

```text
  if (config.maxExportBatchSize > config.maxQueueSize) {
    throw new Error('loongsuite-observability: maxExportBatchSize must not exceed maxQueueSize')
  }

  const resource = overrides.resource ?? buildResource(config)
  const traceEndpoint = resolveEndpoint(config, 'traces')
  const traceExporter = overrides.traceExporter ?? new OTLPTraceExporter(traceExporterConfig(
    traceEndpoint,
    resolveHeaders(config, 'traces'),
    config.exportTimeoutMs,
  ))
  const spanProcessor = overrides.simpleSpanProcessor
    ? new SimpleSpanProcessor(traceExporter)
    : new BatchSpanProcessor(traceExporter, {
        maxExportBatchSize: config.maxExportBatchSize,
        maxQueueSize: config.maxQueueSize,
        scheduledDelayMillis: config.traceExportIntervalMs,
        exportTimeoutMillis: config.exportTimeoutMs,
      })
  const tracerProvider = new BasicTracerProvider({ resource, spanProcessors: [spanProcessor] })

  let meterProvider: MeterProvider | undefined
  let metricEndpoint: string | undefined
  if (config.exportMetrics) {
    metricEndpoint = resolveEndpoint(config, 'metrics')
    const metricExporter = overrides.metricExporter ?? new OTLPMetricExporter(metricExporterConfig(
      metricEndpoint,
      resolveHeaders(config, 'metrics'),
      config.exportTimeoutMs,
    ))
    const reader = new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: config.metricExportIntervalMs,
      exportTimeoutMillis: Math.min(config.exportTimeoutMs, config.metricExportIntervalMs),
    })
    meterProvider = new MeterProvider({ resource, readers: [reader] })
  }

  const handler = new ExtendedTelemetryHandler({
    tracerProvider: tracerProvider as ApiTracerProvider,
    meterProvider: (meterProvider ?? metrics) as ApiMeterProvider,
    instrumentationName: INSTRUMENTATION_NAME,
    instrumentationVersion: VERSION,
  })
```

</details>

#### 缺口

- 未查看实际导出的每个字段与宿主是否有全局 meter
  **影响**：外发数据范围需先核对
  **进一步探讨**：隔离 collector 用哨兵路径与文本逐项核对收到的负载

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样判断追踪能减少排障时间？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先固定宿主与本地收集器，使 captureContent 显式关闭。选包含一次模型重试和一次工具失败的脱敏任务，检查根因、错误码、子级关闭和导出是否齐全，再比较手工日志定位时间。可测试让用户可选丢弃 cwd 等标量，是否能减轻内容泄漏且保留问题关联。若丢字段后定位无法完成，或发现上报了超出预期字段、长期阻塞和发送缺档，暂停使用并退回宿主日志。

#### 证据与依据

**依据 1 · 源码核查**：[src/coordinator.ts:177-196](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/coordinator.ts#L177-L196)

说明哪些元数据可作为过滤候选。

<details>
<summary>查看原文（20行）</summary>

```text
function scalarAttributes(session: DshSession, turn: number): Record<string, unknown> {
  const header = session.header
  return {
    'gen_ai.agent.system': 'deepseek-harness',
    'gen_ai.session.id': String(session.id),
    'gen_ai.turn.id': `${String(session.id)}:${turn}`,
    'dsh.session.id': String(session.id),
    'dsh.turn': turn,
    ...header.cwd === undefined ? {} : { 'dsh.session.cwd': header.cwd },
    ...header.parentSession === undefined
      ? {}
      : { 'dsh.session.parent_id': String(header.parentSession) },
    ...header.origin === undefined ? {} : { 'dsh.session.origin': header.origin },
    ...header.delegationDepth === undefined
      ? {}
      : { 'dsh.session.delegation_depth': header.delegationDepth },
    ...header.agentPreset === undefined
      ? {}
      : { 'dsh.agent.preset': header.agentPreset },
    'gen_ai.agent.name': header.agentPreset || 'deepseek-harness',
```

</details>

**依据 2 · 源码核查**：[src/index.ts:66-74](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/index.ts#L66-L74)

卸载链。

```text
  dsh.effect(() => async () => {
    for (const dispose of disposers.reverse()) dispose()
    try {
      coordinator.closeAll()
    } catch (error: unknown) {
      dsh.logger.warn(`[loongsuite-observability] failed to close live spans: ${String(error)}`)
    }
    await telemetry.shutdown()
  }, 'loongsuite-observability: detach listeners and shutdown OTLP')
```

**依据 3 · 源码核查**：[src/telemetry.ts:190-211](https://github.com/loongsuite/dsh-plugin/blob/f44ccfcd2255186bfcfe1c9f8c7db047204865b7/src/telemetry.ts#L190-L211)

flush 和 shutdown 边界。

<details>
<summary>查看原文（22行）</summary>

```text
  let stopped = false
  return {
    handler,
    tracerProvider,
    ...meterProvider === undefined ? {} : { meterProvider },
    ...traceEndpoint === undefined ? {} : { traceEndpoint },
    ...metricEndpoint === undefined ? {} : { metricEndpoint },
    async forceFlush(): Promise<void> {
      if (stopped) return
      await Promise.all([
        tracerProvider.forceFlush(),
        meterProvider?.forceFlush(),
      ])
    },
    async shutdown(): Promise<void> {
      if (stopped) return
      stopped = true
      await Promise.allSettled([
        tracerProvider.shutdown(),
        meterProvider?.shutdown(),
      ])
    },
```

</details>

#### 缺口

- 无同版本远端和性能测试
  **影响**：采用限制在隔离试用
  **进一步探讨**：用固定合成任务与受控收集器验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
