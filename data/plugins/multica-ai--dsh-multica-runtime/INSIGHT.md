# Multica DSH Runtime

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[571d7c0](https://github.com/multica-ai/dsh-multica-runtime/tree/571d7c036d15f58ee88c89fd80afb0a6c7f0023c)

<!-- BEGIN META -->
[![GitHub ★ 77](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=77&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/multica-ai/dsh-multica-runtime)
<!-- END META -->

> **功能**：为Multica提供DSH单次JSONL执行、模型发现、会话续接与协作取消桥接。

> **亮点**：[Q01](#research-q01) 版本化单次协议与显式resume拒绝；[Q02](#research-q02) 处理子任务唤醒后的静默。

> **主要限制**：[Q02](#research-q02) drain失败不阻cancelled，EOF不取消；[Q03](#research-q03) headless自动批准依赖可信调用方。

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
  - [Q01 · JSONL桥接了什么，如何防止静默新建会话？](#detail-section-11)
  - [Q02 · 取消是否确实等到所有工作停止？](#detail-section-12)
  - [Q03 · 调用方承担什么权限、环境和运行成本？](#detail-section-13)
  - [Q04 · 结果帧增加停止置信度是否有用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要以Multica daemon驱动DSH且能管理独立运行边界的集成者。

自写CLI文本解析或直接集成DSH SDK。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| JSONL执行 | 单次任务结构化事件 | 可信调用方 |
| 模型发现 | DSH模型思考档位 | host模型服务 |
| 续接与取消 | 持久会话及根子收敛 | cwd同目录非授权 |
| MCP适配 | stdio与HTTP工具 | 自动批准需调用方控制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH与Node | 必需 | host服务及构建dist | 范围外拒载或无法启动 |
| Multica daemon | 目标集成必需 | 供JSONL与任务路径 | 源码未包含调用方授权 |
| 模型凭据 | 执行必需 | 外部推理 | 实际费用及服务波动 |
| MCP命令/服务 | 可选 | 扩展工具 | 自动批准需白名单 |
| 独立会话root | 隔离运维条件 | 避免共用会话 | 环境缺失回退普通sessions |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 构建后装专用profile并独立session root | 核probe协议1与模型列表 |
| 接入 | 白名单MCP并发一次无副作用execute | 核提交帧及stop_reason |
| 取消 | 匹配request_id并核根子工具资源 | cancelled不代表全部停止 |
| 退出 | 核终止后移除插件清token/MCP | 备份会话并验无遗留资源 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 构建与专用profile资源未测 | 核模型MCP和daemon兼容 | 不含完整Multica部署 |
| 持续 | 推理/MCP费和会话磁盘 | 保护事件日志及凭据 | stdout含任务工具内容 |
| 失败 | 停止等待可无总deadline | 外查子进程与重试副作用 | drain失败只诊断 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 协议稳定 | 严格字段与单execute | 真实daemon兼容 |
| 续接 | cwd检查与显式拒绝 | 授权及模型变更效果 |
| 取消收敛 | 根和子生命周期顺序 | 清理失败后的外部状态 |

> **思考**：[Q02](#research-q02) drain失败不阻cancelled，EOF不取消；[Q03](#research-q03) headless自动批准依赖可信调用方。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 版本化单次协议与显式resume拒绝；[Q02](#research-q02) 处理子任务唤醒后的静默。

[Q02](#research-q02) 清理诊断不能替代停止证明；[Q03](#research-q03) 自动allowed-once必须由调用方控制。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) drain失败不阻cancelled，EOF不取消；[Q03](#research-q03) headless自动批准依赖可信调用方。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 专用profile最小工具先核协议和停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码覆盖协议、事件、续接、根子取消和环境边界，未运行Multica/DSH。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、package.json、src/environment.ts、src/index.ts、src/lifecycle.ts、src/protocol.ts、src/task-env.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：DSH profile插件桥接层，Multica daemon和DSH依赖内部实现属于外部契约。
- 下一步：回放max-tokens/截断/resume拒绝，并注入drain失败、EOF和MCP启动拒绝；均未执行。

**分析版本**

- **仓库**：[multica-ai/dsh-multica-runtime](https://github.com/multica-ai/dsh-multica-runtime)
- **版本号**：0.2.0-private.1（[固定提交 571d7c0](https://github.com/multica-ai/dsh-multica-runtime/tree/571d7c036d15f58ee88c89fd80afb0a6c7f0023c)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) cleanup未知信号是否改善daemon资源回收需要故障对照。

回放max-tokens/截断/resume拒绝，并注入drain失败、EOF和MCP启动拒绝；均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 70 | — | — | 355 |
| .ts | source | 5 | 1098 | 929 | 98 | — |
| .ts | test | 3 | 399 | 327 | 13 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/multica-ai/dsh-multica-runtime/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Multica如何以JSONL驱动DSH，续接、取消与无交互批准的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · JSONL桥接了什么，如何防止静默新建会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

这是装入DSH profile的headless-runner插件，不是独立Multica客户端。probe/list-models/stdio由同一入口选模式，stdout只写版本1 JSONL。每进程只接受一次execute，按request_id匹配cancel，重复execute返回协议错误；schema拒绝多余键及错误transport，8MiB限制在readline完整收行后检查，所以不是流式内存上界。转出的是当前root session提交后的text/reasoning/tool/result/usage事件，并非网络token逐字流，也不承诺child全量事件或可重放序列。工具结果256KiB UTF8截断且带标记，最终output只保留最后非空text。

resume失败显式DSH_RESUME_REJECTED，不自动create替代；resume后比较真实cwd，realpath失败退resolve比较，目录不同dispose并拒绝。只比较cwd不是租户授权，也没有证明与原模型/MCP/权限完全相同。max-tokens被归入completed但保留stop_reason，因此消费方必须看原因和产物，不能把completed等同任务验收成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:445-494](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L445-L494)

单execute及匹配取消

<details>
<summary>查看原文（50行）</summary>

```text
async function stdio(ctx: Context): Promise<number> {
  const forwarding = await installMulticaTerminalEnvironment(ctx)
  if (forwarding !== undefined && !forwarding.forwarded) {
    // Fail loudly at boot instead of twenty seconds later, as an opaque
    // "requires a task-scoped mat_ token" refusal on the agent's first
    // `multica` call (MUL-6186).
    writeDiagnostic(
      'MULTICA_TOKEN is not reaching model-spawned subprocesses; in-task multica commands will be refused',
    )
  }
  const activeRef: { current?: ActiveRun; finished: boolean } = { finished: false }
  ctx.on('session/event', (session, event: SessionEvent) => {
    if (activeRef.current !== undefined) observeSessionEvent(activeRef.current, session, event)
  })

  const input = createInterface({ input: process.stdin, terminal: false, crlfDelay: Infinity })
  let resolveExecute: ((command: ExecuteCommand) => void) | undefined
  let rejectExecute: ((error: Error) => void) | undefined
  const firstExecute = new Promise<ExecuteCommand>((resolveCommand, rejectCommand) => {
    resolveExecute = resolveCommand
    rejectExecute = rejectCommand
  })
  input.on('line', (line) => {
    try {
      const command = parseInboundCommand(line)
      if (command.type === 'execute') {
        if (activeRef.current !== undefined || resolveExecute === undefined) {
          protocolError('DUPLICATE_EXECUTE', 'this DSH process accepts exactly one execute command')
          return
        }
        const active: ActiveRun = {
          command,
          firstSeq: Number.MAX_SAFE_INTEGER,
          cancelRequested: false,
          cancel: new AbortController(),
          lastText: '',
          toolNames: new Map(),
        }
        activeRef.current = active
        const resolveCommand = resolveExecute
        resolveExecute = undefined
        rejectExecute = undefined
        resolveCommand(command)
        return
      }
      const active = activeRef.current
      if (active === undefined || command.request_id !== active.command.request_id || activeRef.finished) return
      active.cancelRequested = true
      active.cancel.abort()
      active.agent?.cancel({ kind: 'user' })
```

</details>

**依据 2 · 源码核查**：[src/protocol.ts:230-271](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/protocol.ts#L230-L271)

命令schema及行后大小限制

<details>
<summary>查看原文（42行）</summary>

```text
export function parseInboundCommand(line: string): InboundCommand {
  if (Buffer.byteLength(line) > MAX_COMMAND_BYTES) throw new Error('protocol command exceeds 8 MiB')
  let parsed: unknown
  try {
    parsed = JSON.parse(line)
  } catch {
    throw new Error('protocol command is not valid JSON')
  }
  const command = assertRecord(parsed, 'command')
  if (command.v !== PROTOCOL_VERSION) throw new Error(`unsupported protocol version: ${String(command.v)}`)
  const type = requiredString(command.type, 'command.type')
  if (type === 'cancel') {
    assertOnlyKeys(command, ['v', 'type', 'request_id'], 'cancel command')
    return {
      v: PROTOCOL_VERSION,
      type,
      request_id: requiredString(command.request_id, 'cancel.request_id'),
    }
  }
  if (type === 'execute') {
    assertOnlyKeys(
      command,
      ['v', 'type', 'request_id', 'cwd', 'prompt', 'resume_session_id', 'model', 'reasoning_effort', 'mcp_servers'],
      'execute command',
    )
    return {
      v: PROTOCOL_VERSION,
      type,
      request_id: requiredString(command.request_id, 'execute.request_id'),
      cwd: requiredString(command.cwd, 'execute.cwd'),
      prompt: requiredString(command.prompt, 'execute.prompt'),
      ...optionalString(command.resume_session_id, 'execute.resume_session_id') === undefined
        ? {}
        : { resume_session_id: optionalString(command.resume_session_id, 'execute.resume_session_id') },
      ...parseModel(command.model) === undefined ? {} : { model: parseModel(command.model) },
      ...optionalString(command.reasoning_effort, 'execute.reasoning_effort') === undefined
        ? {}
        : { reasoning_effort: optionalString(command.reasoning_effort, 'execute.reasoning_effort') },
      mcp_servers: parseMcpServers(command.mcp_servers),
    }
  }
  throw new Error(`unsupported protocol command type: ${type}`)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:212-277](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L212-L277)

提交事件转译与工具截断

<details>
<summary>查看原文（66行）</summary>

```text
function observeSessionEvent(active: ActiveRun, session: Agent['session'], event: SessionEvent): void {
  if (active.agent?.session !== session || event.seq < active.firstSeq) return
  const requestId = active.command.request_id
  if (event.type === 'assistant/message') {
    const text = event.data.message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')
    if (text !== '') {
      active.lastText = text
      writeFrame({ v: PROTOCOL_VERSION, type: 'text', request_id: requestId, content: text })
    }
    for (const block of event.data.message.content) {
      if (block.type === 'reasoning' && block.text !== '') {
        writeFrame({ v: PROTOCOL_VERSION, type: 'thinking', request_id: requestId, content: block.text })
      }
    }
    const usage = event.data.usage
    if (usage !== undefined) {
      writeFrame({
        v: PROTOCOL_VERSION,
        type: 'usage',
        request_id: requestId,
        provider: event.data.message.source.provider,
        model: event.data.message.source.model,
        input_tokens: usage.inputTokens,
        output_tokens: usage.outputTokens,
        ...usage.cacheReadTokens === undefined ? {} : { cache_read_tokens: usage.cacheReadTokens },
        ...usage.cacheWriteTokens === undefined ? {} : { cache_write_tokens: usage.cacheWriteTokens },
        ...usage.reasoningTokens === undefined ? {} : { reasoning_tokens: usage.reasoningTokens },
      })
    }
    return
  }
  if (event.type === 'tool/call') {
    const callId = String(event.data.callId)
    active.toolNames.set(callId, event.data.name)
    writeFrame({
      v: PROTOCOL_VERSION,
      type: 'tool_call',
      request_id: requestId,
      call_id: callId,
      name: event.data.name,
      arguments: event.data.arguments,
    })
    return
  }
  if (event.type === 'tool/result') {
    // DSH 0.2 commits the tool result as a ToolMessage: the call id and error
    // flag live on the message itself and `content` is the result payload.
    const message = event.data.message
    const callId = String(message.toolCallId)
    const rendered = truncateUtf8(message.content.map(renderBlock).join(''))
    writeFrame({
      v: PROTOCOL_VERSION,
      type: 'tool_result',
      request_id: requestId,
      call_id: callId,
      name: active.toolNames.get(callId) ?? 'unknown',
      output: rendered.value,
      is_error: message.isError === true,
      ...rendered.truncated ? { truncated: true } : {},
    })
    return
  }
  if (event.type === 'turn/end') active.endReason = event.data.reason
```

</details>

**依据 4 · 源码核查**：[src/protocol.ts:287-297](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/protocol.ts#L287-L297)

UTF8截断与编码

<details>
<summary>查看原文（11行）</summary>

```text
export function truncateUtf8(value: string, maxBytes = MAX_TOOL_OUTPUT_BYTES): { value: string; truncated: boolean } {
  const bytes = Buffer.from(value)
  if (bytes.length <= maxBytes) return { value, truncated: false }
  let end = maxBytes
  while (end > 0 && (bytes[end] ?? 0) >= 0x80 && (bytes[end] ?? 0) < 0xC0) end--
  return { value: `${bytes.subarray(0, end).toString('utf8')}\n[output truncated]`, truncated: true }
}

export function encodeFrame(frame: OutboundFrame): string {
  return `${JSON.stringify(frame)}\n`
}
```

</details>

**依据 5 · 源码核查**：[src/index.ts:349-372](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L349-L372)

显式续接拒绝

<details>
<summary>查看原文（24行）</summary>

```text
  if (active.command.resume_session_id === undefined) {
    const handle = await agents.create({
      sessionId: SessionId(`multica-${randomUUID()}`),
      meta: { cwd: active.command.cwd },
      agentOptions: options,
      setup,
    })
    return { handle, resumed: false }
  }
  let handle: AgentHandle
  try {
    handle = await agents.resume({
      resumeSessionId: SessionId(active.command.resume_session_id),
      agentOptions: options,
      setup,
    })
  } catch (error: unknown) {
    throw new ResumeRejectedError(`could not resume DSH session ${active.command.resume_session_id}`, { cause: error })
  }
  if (!await sameDirectory(handle.agent.session.header.cwd, active.command.cwd)) {
    await handle.dispose()
    throw new ResumeRejectedError('the resumed DSH session belongs to a different working directory')
  }
  return { handle, resumed: true }
```

</details>

**依据 6 · 源码核查**：[src/index.ts:182-189](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L182-L189)

目录比较降级

```text
async function sameDirectory(left: string | undefined, right: string): Promise<boolean> {
  if (left === undefined) return false
  try {
    const [realLeft, realRight] = await Promise.all([realpath(left), realpath(right)])
    return realLeft === realRight
  } catch {
    return resolve(left) === resolve(right)
  }
```

**依据 7 · 源码核查**：[src/index.ts:300-326](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L300-L326)

完成与max-tokens语义

<details>
<summary>查看原文（27行）</summary>

```text
function resultFromReason(active: ActiveRun): Omit<Extract<OutboundFrame, { type: 'result' }>, 'v' | 'type' | 'request_id' | 'session_id'> {
  const reason = active.endReason
  if (active.cancelRequested) {
    return { status: 'cancelled', output: active.lastText, stop_reason: 'cancelled', resume_rejected: false }
  }
  if (reason?.kind === 'completed' || reason?.kind === 'max-tokens') {
    return { status: 'completed', output: active.lastText, stop_reason: reason.kind, resume_rejected: false }
  }
  if (reason?.kind === 'aborted') {
    return { status: 'aborted', output: active.lastText, stop_reason: reason.kind, resume_rejected: false }
  }
  if (reason?.kind === 'error') {
    return {
      status: 'failed',
      output: active.lastText,
      stop_reason: reason.kind,
      resume_rejected: false,
      error: { code: reason.error.code, message: reason.error.message },
    }
  }
  const stopReason = reason?.kind ?? 'no-turn-result'
  return {
    status: 'failed',
    output: active.lastText,
    stop_reason: stopReason,
    resume_rejected: false,
    error: { code: 'DSH_TURN_FAILED', message: `DSH turn ended with ${stopReason}` },
```

</details>

#### 缺口

- Multica消费者对截断、stop_reason和断线恢复的实现不在树内
  **影响**：帧成功可能被误当业务完成，未证端到端
  **进一步探讨**：用协议回放核消费方对max-tokens和截断处理

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 取消是否确实等到所有工作停止？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

正常路径whenIdle后仍检查子任务是否唤醒parent并比较session.seq，直到root idle且无新事件，避免只等一次idle提前结果。取消先abort等待race，再cancel根、drain后代，之后反复cancel/whenIdle直到root idle；正常结束也尝试drain。随后flush会话、dispose handle才发结果，这些是明确顺序。

边界是drain异常只写stderr诊断并继续，结果帧没有后代停止置信度；catch清理本身失败也只诊断，若cancelRequested仍可发cancelled并exit0。因此cancelled证明协议选择了取消结果，不证明所有后代/远程命令终止或副作用撤销。没有总停止deadline，根whenIdle不收敛可一直等。stdin close只在execute前拒绝，执行中EOF未触发cancel；管道断开不能靠这里推导停机。格式错误的后续输入则会取消活动任务，非匹配合法cancel被忽略。

#### 证据与依据

**依据 1 · 源码核查**：[src/lifecycle.ts:34-50](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/lifecycle.ts#L34-L50)

稳定静默循环

<details>
<summary>查看原文（17行）</summary>

```text
export async function waitForQuiescence(
  subagents: SubagentLifecycle | undefined,
  agent: QuiescentAgent,
  signal: AbortSignal,
): Promise<'settled' | 'cancelled'> {
  const aborted = new Promise<'aborted'>((resolveAborted) => {
    if (signal.aborted) resolveAborted('aborted')
    else signal.addEventListener('abort', () => resolveAborted('aborted'), { once: true })
  })
  while (true) {
    if (await Promise.race([agent.whenIdle(), aborted]) === 'aborted') return 'cancelled'
    const idleSeq = agent.session.seq
    // Child settlement can wake the parent before the child wait observes it.
    const children = await Promise.race([subagents?.waitForChildren(agent as Agent) ?? false, aborted])
    if (children === 'aborted') return 'cancelled'
    if (!children && agent.status === 'idle' && agent.session.seq === idleSeq) return 'settled'
  }
```

</details>

**依据 2 · 源码核查**：[src/lifecycle.ts:64-79](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/lifecycle.ts#L64-L79)

drain失败仍收敛根

<details>
<summary>查看原文（16行）</summary>

```text
export async function settleCancelled(
  subagents: SubagentLifecycle | undefined,
  agent: CancellableAgent,
  onDrainError: (error: unknown) => void,
): Promise<void> {
  agent.cancel({ kind: 'user' })
  try {
    await subagents?.drainDescendants([agent as Agent])
  } catch (error: unknown) {
    onDrainError(error)
  }
  do {
    agent.cancel({ kind: 'user' })
    await agent.whenIdle()
  } while (agent.status !== 'idle')
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:284-297](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L284-L297)

后代异常只诊断

<details>
<summary>查看原文（14行）</summary>

```text
/** Stop descendants, then converge the cancelled root without joining child-woken rounds. */
function settleCancelled(ctx: Context, agent: Agent): Promise<void> {
  return settleCancelledAgent(subagentLifecycle(ctx), agent, (error) => {
    writeDiagnostic(`subagent drain failed: ${errorMessage(error)}`)
  })
}

/** Settle any still-running descendants before the root handle is disposed. */
async function drainDescendants(ctx: Context, agent: Agent): Promise<void> {
  try {
    await subagentLifecycle(ctx)?.drainDescendants([agent])
  } catch (error: unknown) {
    writeDiagnostic(`subagent drain failed: ${errorMessage(error)}`)
  }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:394-441](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L394-L441)

flush dispose结果及清理失败

<details>
<summary>查看原文（48行）</summary>

```text
    let outcome: 'settled' | 'cancelled' = active.cancelRequested ? 'cancelled' : 'settled'
    if (!active.cancelRequested) {
      handle.agent.followup(createUserMessage({
        content: [{ type: 'text', text: active.command.prompt }],
        source: { kind: 'user' },
      }))
      outcome = await waitForQuiescence(subagentLifecycle(ctx), handle.agent, active.cancel.signal)
    }
    if (outcome === 'cancelled' || active.cancelRequested) await settleCancelled(ctx, handle.agent)
    else await drainDescendants(ctx, handle.agent)
    await sessions.flush(handle.agent.session)
    const sessionId = String(handle.agent.session.id)
    const result = resultFromReason(active)
    await handle.dispose()
    handle = undefined
    writeFrame({
      v: PROTOCOL_VERSION,
      type: 'result',
      request_id: active.command.request_id,
      session_id: sessionId,
      ...result,
    })
    return result.status === 'completed' || result.status === 'cancelled' ? 0 : 1
  } catch (error: unknown) {
    if (handle !== undefined) {
      try {
        await settleCancelled(ctx, handle.agent)
        await sessions.flush(handle.agent.session)
        await handle.dispose()
      } catch (cleanupError: unknown) {
        writeDiagnostic(`cleanup failed: ${errorMessage(cleanupError)}`)
      }
    }
    const resumeRejected = error instanceof ResumeRejectedError
    const cause = error instanceof Error && error.cause !== undefined ? `: ${errorMessage(error.cause)}` : ''
    writeFrame({
      v: PROTOCOL_VERSION,
      type: 'result',
      request_id: active.command.request_id,
      status: active.cancelRequested ? 'cancelled' : 'failed',
      output: active.lastText,
      resume_rejected: resumeRejected,
      error: {
        code: resumeRejected ? 'DSH_RESUME_REJECTED' : 'DSH_RUNTIME_ERROR',
        message: `${errorMessage(error)}${cause}`,
      },
    })
    return active.cancelRequested ? 0 : 1
```

</details>

**依据 5 · 源码核查**：[src/index.ts:490-513](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L490-L513)

非法命令取消与EOF边界

<details>
<summary>查看原文（24行）</summary>

```text
      const active = activeRef.current
      if (active === undefined || command.request_id !== active.command.request_id || activeRef.finished) return
      active.cancelRequested = true
      active.cancel.abort()
      active.agent?.cancel({ kind: 'user' })
    } catch (error: unknown) {
      protocolError('INVALID_COMMAND', errorMessage(error))
      const active = activeRef.current
      if (active === undefined && rejectExecute !== undefined) {
        rejectExecute(new Error(errorMessage(error)))
        resolveExecute = undefined
        rejectExecute = undefined
      } else if (active !== undefined) {
        active.cancelRequested = true
        active.cancel.abort()
        active.agent?.cancel({ kind: 'user' })
      }
    }
  })
  input.on('close', () => {
    if (activeRef.current === undefined && rejectExecute !== undefined) {
      rejectExecute(new Error('stdin closed before execute'))
    }
  })
```

</details>

#### 缺口

- 宿主drain/whenIdle及远程工具实际终止未运行
  **影响**：取消结果不够作为资源回收证明，EOF可能留运行
  **进一步探讨**：注入drain拒绝、stdin断开和挂起工具，核真实进程及终止帧

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 调用方承担什么权限、环境和运行成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

兼容DSH 0.2.1-rc.2..<0.3及Node范围由package声明，需先构建dist再装专用profile；Multica daemon必须理解version1并供应模型凭据和独立会话根。patch禁HMR/telemetry、设置会话root环境变量回退普通sessions，但不能由此说模型和MCP无数据出站。execute仅检查绝对cwd，不是允许目录白名单或租户校验，调用方必须控制stdio通道与路径归属。

headless approval监听器在未取消时直接allowed-once，不是每次人审批或政策授权；MCP由调用方传任意stdio command/args/env/cwd或HTTP url/headers，startup失败即拒绝，默认tool timeout60秒。输入schema约束形状而非目标可信性，需调用方白名单/审批授权。环境代码仅在MULTICA_TOKEN有mat_前缀时修改敏感变量正则，使该键在可达的模块实例免scrub，关闭时restore；mat_只前缀检查，不证明服务器签发、任务权限或过期。其他环境仍依赖宿主scrub契约，显式MCP env/headers另一路可带secret，不能把token例外当通用凭据防泄漏保证。

只在独立profile用无副作用任务、独立session root和最小工具白名单试probe及一次execute，记录stdout/stderr且防日志泄密；未验证前不接生产工作区。推理与MCP外部服务成本照实际任务产生，日志/会话磁盘和停止等待未测。退出先发匹配cancel并检查根/子/外部资源，再停止进程；备份会话后移除profile插件，清任务token与MCP配置，不能只依赖退出码0。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:32-35](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/package.json#L32-L35)

版本范围

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.1-rc.2 <0.3.0"
  },
```

**依据 2 · 源码核查**：[cordis.patch.yml:5-23](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/cordis.patch.yml#L5-L23)

遥测与会话根persona

<details>
<summary>查看原文（19行）</summary>

```text
- id: hmr
  disabled: true

- id: session-telemetry-otel
  disabled: true

- id: session-persistence-jsonl
  config:
    root: !!js process.env.MULTICA_DSH_SESSION_ROOT ?? dshHomePath('sessions')

# DSH 0.2 renamed `persona` to `personaPrefix` and removed the `{{cwd}}`
# variable; the working-directory service now injects the directory itself.
- id: system-prompt
  config:
    personaPrefix: >-
      You are a coding agent powered by the {{model}} model and running for Multica.
      This runtime is headless: do not call
      ask_user_question. When a genuinely user-owned decision blocks progress,
      explain the decision and available options in your final response.
```

</details>

**依据 3 · 源码核查**：[src/index.ts:338-346](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L338-L346)

自动允许和MCP安装

```text
  const setup = async (agentCtx: Context): Promise<void> => {
    installModelSelection(agentCtx, selected)
    agentCtx.on('approval/request', (_request, next) => {
      if (active.cancelRequested) return Promise.resolve<ApprovalOutcome>('cancelled')
      return Promise.resolve<ApprovalOutcome>('allowed-once').catch(() => next())
    })
    for (const server of active.command.mcp_servers) {
      await agentCtx.plugin(McpClient, mcpConfig(server, active.command.cwd))
    }
```

**依据 4 · 源码核查**：[src/index.ts:158-179](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L158-L179)

MCP传递及timeout

<details>
<summary>查看原文（22行）</summary>

```text
function mcpConfig(server: McpServerInput, taskCwd: string): McpClient.Config {
  const common = {
    serverName: normalizeMcpServerName(server.name),
    toolCallTimeoutMs: server.tool_call_timeout_ms ?? 60_000,
    failOnStartupError: true,
  }
  if (server.transport === 'stdio') {
    return {
      ...common,
      transport: 'stdio',
      command: server.command,
      args: server.args,
      env: server.env,
      cwd: server.cwd ?? taskCwd,
    }
  }
  return {
    ...common,
    transport: 'streamable-http',
    url: server.url,
    headers: server.headers,
  }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:375-385](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L375-L385)

绝对cwd条件

<details>
<summary>查看原文（11行）</summary>

```text
async function execute(ctx: Context, active: ActiveRun): Promise<number> {
  const sessions = ctx.get('sessions')
  if (sessions === undefined) throw new Error('DSH session service is unavailable')
  let handle: AgentHandle | undefined
  try {
    if (!isAbsolute(active.command.cwd)) throw new Error('execute.cwd must be an absolute path')
    const selection = await resolveSelection(ctx, active.command)
    const created = await createOrResumeAgent(ctx, active, selection)
    handle = created.handle
    active.agent = handle.agent
    await handle.agent.whenIdle()
```

</details>

**依据 6 · 源码核查**：[src/task-env.ts:1-9](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/task-env.ts#L1-L9)

mat前缀只检查

```text
/** Return the one credential DSH child tools may receive from Multica. */
export function multicaTerminalEnvironment(
  environment: NodeJS.ProcessEnv,
): Record<string, string> {
  const token = environment.MULTICA_TOKEN
  return token?.startsWith('mat_') === true && token.length > 4
    ? { MULTICA_TOKEN: token }
    : {}
}
```

**依据 7 · 源码核查**：[src/environment.ts:40-49](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/environment.ts#L40-L49)

正则精确键例外与恢复

<details>
<summary>查看原文（10行）</summary>

```text
 * @returns a disposer restoring the untouched matcher.
 */
function exemptTaskToken(pattern: RegExp): () => void {
  const originalTest = pattern.test
  const patchedTest = function (this: RegExp, value: string): boolean {
    if (value.toUpperCase() === TASK_TOKEN_KEY) return false
    return originalTest.call(this, value)
  }
  pattern.test = patchedTest
  return () => {
```

</details>

**依据 8 · 源码核查**：[src/environment.ts:105-125](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/environment.ts#L105-L125)

多实例patch及探测

<details>
<summary>查看原文（21行）</summary>

```text
 * @returns what was installed, or undefined when there is no task token to forward.
 */
export async function installMulticaTerminalEnvironment(
  ctx: Context,
  entrypoint: string | undefined = process.argv[1],
): Promise<TerminalEnvironmentReport | undefined> {
  const explicitEnvironment = multicaTerminalEnvironment(process.env)
  if (explicitEnvironment[TASK_TOKEN_KEY] === undefined) return undefined

  const host = await hostScrubModule(entrypoint)
  const { patched, dispose } = exemptTaskTokenOn(
    host === undefined
      ? [SENSITIVE_ENV_PATTERN]
      : [SENSITIVE_ENV_PATTERN, host.SENSITIVE_ENV_PATTERN],
  )
  ctx.effect(() => dispose, 'multica task environment forwarding')

  // Probe the scrub the shell tools will really call rather than trusting that
  // the patch landed. A silent miss here costs the whole task.
  const scrub = host?.scrubbedParentEnv ?? scrubbedParentEnv
  return { patched, forwarded: scrub()[TASK_TOKEN_KEY] !== undefined }
```

</details>

#### 缺口

- 真实daemon授权、token服务器校验、宿主scrub及费用未验证
  **影响**：该桥接不是多租户授权层，自动批准扩大调用方责任
  **进一步探讨**：最小权限独立profile核MCP目的地与实际环境及取消

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 结果帧增加停止置信度是否有用？

**研究主题**：新假设与验证

#### 完整回答

已有根与子收敛链路，候选增量是在drain或清理失败时输出cleanup_status=unknown并避免消费者把cancelled当全部停止。对照成功取消、drain失败、根挂起和EOF，比较消费方是否错误释放任务配额或重试重复副作用；不将新增字段假设说成现有能力。若daemon已根据进程树外部核查资源、或新字段被旧消费者忽略，则改协议未必值得，应先核兼容和状态恢复规则。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:284-297](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L284-L297)

drain失败诊断

<details>
<summary>查看原文（14行）</summary>

```text
/** Stop descendants, then converge the cancelled root without joining child-woken rounds. */
function settleCancelled(ctx: Context, agent: Agent): Promise<void> {
  return settleCancelledAgent(subagentLifecycle(ctx), agent, (error) => {
    writeDiagnostic(`subagent drain failed: ${errorMessage(error)}`)
  })
}

/** Settle any still-running descendants before the root handle is disposed. */
async function drainDescendants(ctx: Context, agent: Agent): Promise<void> {
  try {
    await subagentLifecycle(ctx)?.drainDescendants([agent])
  } catch (error: unknown) {
    writeDiagnostic(`subagent drain failed: ${errorMessage(error)}`)
  }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:417-441](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/index.ts#L417-L441)

清理失败仍结果

<details>
<summary>查看原文（25行）</summary>

```text
  } catch (error: unknown) {
    if (handle !== undefined) {
      try {
        await settleCancelled(ctx, handle.agent)
        await sessions.flush(handle.agent.session)
        await handle.dispose()
      } catch (cleanupError: unknown) {
        writeDiagnostic(`cleanup failed: ${errorMessage(cleanupError)}`)
      }
    }
    const resumeRejected = error instanceof ResumeRejectedError
    const cause = error instanceof Error && error.cause !== undefined ? `: ${errorMessage(error.cause)}` : ''
    writeFrame({
      v: PROTOCOL_VERSION,
      type: 'result',
      request_id: active.command.request_id,
      status: active.cancelRequested ? 'cancelled' : 'failed',
      output: active.lastText,
      resume_rejected: resumeRejected,
      error: {
        code: resumeRejected ? 'DSH_RESUME_REJECTED' : 'DSH_RUNTIME_ERROR',
        message: `${errorMessage(error)}${cause}`,
      },
    })
    return active.cancelRequested ? 0 : 1
```

</details>

**依据 3 · 源码核查**：[src/lifecycle.ts:64-79](https://github.com/multica-ai/dsh-multica-runtime/blob/571d7c036d15f58ee88c89fd80afb0a6c7f0023c/src/lifecycle.ts#L64-L79)

根与后代停止差异

<details>
<summary>查看原文（16行）</summary>

```text
export async function settleCancelled(
  subagents: SubagentLifecycle | undefined,
  agent: CancellableAgent,
  onDrainError: (error: unknown) => void,
): Promise<void> {
  agent.cancel({ kind: 'user' })
  try {
    await subagents?.drainDescendants([agent as Agent])
  } catch (error: unknown) {
    onDrainError(error)
  }
  do {
    agent.cancel({ kind: 'user' })
    await agent.whenIdle()
  } while (agent.status !== 'idle')
}
```

</details>

#### 缺口

- 消费者是否误判及协议升级成本未知
  **影响**：新增字段可能无效或破坏兼容
  **进一步探讨**：故障注入协议回放并核外部资源状态

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
