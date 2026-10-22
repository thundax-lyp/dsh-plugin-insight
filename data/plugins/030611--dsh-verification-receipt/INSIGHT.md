# dsh-verification-receipt

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[87f3fb0](https://github.com/030611/dsh-verification-receipt/tree/87f3fb0198090f0f26a37a52840db150609db748)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt) [![npm 30d 851](https://img.shields.io/static/v1?label=npm+30d&message=851&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-verification-receipt)
<!-- END META -->

> **实现功能**：被动读取DSH每轮持久事件，输出不含对话/参数/结果正文的工具计数与词法验证信号JSONL摘要。

> **核心亮点**：把持久事件投影成隐私减量的每轮工具状态/词法摘要，显式不冒充测试通过，并用关闭接收/注销/drain管理卸载。详见[Q02](#research-q02)、[Q04](#research-q04)。

> **风险与缺陷**：词法信号有误报/漏报且信任宿主结果；无keyhash可重算/关联，队列无界、写失败仅warning，无rotation/锁，路径需可信管理员。详见[Q03](#research-q03)、[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 它解决什么核查问题，什么结果有意义？](#detail-section-11)
  - [Q02 · 如何划轮次、配对调用并保护模型上下文？](#detail-section-12)
  - [Q03 · 验证信号能证明什么，哪些反例会误导？](#detail-section-13)
  - [Q04 · 隐私、完整性与持久化有哪些真实保证？](#detail-section-14)
  - [Q05 · 启动、维护与成本效果怎么判断？](#detail-section-15)
  - [Q06 · 推荐结论与可继续探讨方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合希望回看DSH每轮记录过多少工具调用、出现哪些验证形状信号，却不愿另外持久化对话/参数/输出的个人维护者。turn/end后追加本地JSONL，包含粗粒度计数/状态/类别和会话伪名。它回答“记录中有何执行迹象”，不能回答“测试是否真运行/测试足够/代码正确”。

合格结果应是轮次括号和调用状态准确、未知不当成功、输出遵守字段排除与受控持久化；日志不是模型质量门禁或可信证明。基线是人工打开完整session记录搜索命令，增量在小型可比较摘要和隐私减量，换来丢失原始论据与语义。README主动界定这一限制，比用receipt名暗示验证通过更诚实。

人工检索完整session执行记录；插件省内容暴露和检索，但不保原始论据/实际验证质量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 每轮投影 | 工具计数/状态 | 信任宿主记录，非业务正确 |
| 词法信号 | 寻找疑似验证 | 误报/漏报，非测试通过 |
| 字段减量 | 不保存消息/参数/结果正文 | 时序和稳定hash仍敏感 |
| JSONL sink | 单实例顺序与卸载排空 | 无界queue/强耐久/跨进程锁 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH0.1.2-alpha.3/4/5与Session | durable event协议 | 作者仅这些版本Windows Web acceptance，不外推0.2 |
| Node ^22.19或>=24、Schemastery3.18.2 | ESM/配置验证 | Cordis/Session宿主peer，类型省略不等于无需服务 |
| 私有可信绝对输出路径 | JSONL本地追加 | 默认DSH_HOME或~/.dsh，非防恶意链接边界 |
| 一进程一文件/外部retention | 写顺序与容量维护 | 无跨进程锁/轮转 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装前 | 核宿主精确版本与包 | 不以Windows启动记录推断当前全平台 |
| 配置 | 指私有非symlink路径，一进程一file | 核旧权限、访问者、保留期 |
| 读receipt | 对照turn与词法类别/状态 | 不把succeeded当测试通过 |
| 维护 | 看写错误/磁盘容量/队列迹象 | 缺行不是“无工具” |
| 卸载 | 正常drain后核完整JSONL尾行 | 崩溃尾行隔离，不伪造补齐 |

**效果与成本**

#### 成本

| 阶段 | 现金与资源 | 人工与时间 | 已知与未知 |
| --- | --- | --- | --- |
| 首次 | 本地包/磁盘，不自调模型 | 核版本/路径/隐私 | 无安装工时估值 |
| 持续使用 | 同步投影CPU、JSONL存储和未界定queue | 轮转保留/分类误差解释 | 代码无额外模型请求；时延/空间随事件量未知 |
| 失败恢复 | 重查源session、隔离尾行/丢弃批 | 对照写失败与漏轮次 | 无自动backfill/强制同步；恢复完整性未知 |



#### 效果

| 目标 | 源码增量 | 限制 |
| --- | --- | --- |
| 少查完整对话 | 每轮粗摘要 | 非实际验证证明 |
| 少持久化内容 | 明确最小字段 | 时序/hash仍敏感且可关联 |
| 少影响模型 | 无工具/提示/网络请求 | 同步snapshot/投影仍可能增CPU时延 |
| 写顺序 | 单实例Promise链/卸载drain | 失败/崩溃/跨进程无完整保证 |

作者compatibility记录是可追溯声明，Windows安装/配置/冷启动/卸载不等于验证receipt语义。宿主snapshotEvents自身复制/遍历全历史的成本依宿主实现，插件再slice当轮/投影；不能只按一行JSON大小估全部CPU。

> **思考**：词法信号有误报/漏报且信任宿主结果；无keyhash可重算/关联，队列无界、写失败仅warning，无rotation/锁，路径需可信管理员。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把持久事件投影成隐私减量的每轮工具状态/词法摘要，显式不冒充测试通过，并用关闭接收/注销/drain管理卸载。详见[Q02](#research-q02)、[Q04](#research-q04)。

把持久事件投影成隐私减量的每轮工具状态/词法摘要，显式不冒充测试通过，并用关闭接收/注销/drain管理卸载。详见[Q02](#research-q02)、[Q04](#research-q04)。

输出字面构造限定工具计数/类别和时序，不包含参数/原始ID/工具输出或消息文本；投影在内存仍会读取原始参数/结果做判断，不能说从不接触。sessionIdHash加domain但无key，可跨文件关联、低熵ID可猜，不是匿名。receiptHash是固定字段JSON的SHA256，任意能改文件者可重算，不发现删除/插入/回滚/重排；作者SECURITY一致承认。

writer用Promise链顺序append，mkdir0700/append0600仅请求创建模式，无chmod/realpath/lstat/锁，预存文件权限/路径链接及跨进程写均在可信本地路径边界。写失败warning后队列继续，不向宿主turn反馈“receipt已持久”。排队无容量/背压与rotation，慢盘可积压内存，崩溃丢已接受未写完项/尾行不完整。

生命周期gate→注销listener→drain的逆序effect设计与ctx.fiber.uid同步检查避免卸载再接收，较单纯dispose后flush细致；drain只等Promise settled，失败已catch仍算排队结束，不等于全部行成功。作者有真实Context+SessionStore组合测试设计，本轮只读，不冒认运行通过。

<a id="detail-section-5"></a>

### 1.4 主要限制

词法信号有误报/漏报且信任宿主结果；无keyhash可重算/关联，队列无界、写失败仅warning，无rotation/锁，路径需可信管理员。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用，精确支持宿主+私有一进程一文件，将其当启发式观察摘要，不作验证通过/防篡改审计。详见[Q06](#research-q06)。

合格结果应是轮次括号和调用状态准确、未知不当成功、输出遵守字段排除与受控持久化；日志不是模型质量门禁或可信证明。基线是人工打开完整session记录搜索命令，增量在小型可比较摘要和隐私减量，换来丢失原始论据与语义。README主动界定这一限制，比用receipt名暗示验证通过更诚实。

采用建议：有试用，精确支持宿主+私有一进程一文件，将其当启发式观察摘要，不作验证通过/防篡改审计。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。最小字段与事件括号/卸载设计明确，输出仅启发式执行摘要，持久化/关联与资源限制应保留。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、SECURITY.md、docs/compatibility-0.1.1.md、src/index.ts、src/receipt.ts、tests/receipt.spec.ts、tests/composition.spec.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：两src全链及包/兼容/SECURITY，读组合与词法测试设计；不运行测试、宿主冒烟或读取用户事件。
- 下一步：可继续以合成事件与慢/失败文件sink比较内存、回合延迟、缺行可解释性和隐私，无需模型/真实用户日志。

**分析版本**

- **仓库**：[030611/dsh-verification-receipt](https://github.com/030611/dsh-verification-receipt)
- **版本号**：0.1.1（[固定提交 87f3fb0](https://github.com/030611/dsh-verification-receipt/tree/87f3fb0198090f0f26a37a52840db150609db748)）
- **版本日期**：2026-09-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索有界队列与accepted/persisted/dropped可见计数，比较内存/延迟/丢失解释，保持摘要非审计证明；未实现。详见[Q06](#research-q06)。

可继续以合成事件与慢/失败文件sink比较内存、回合延迟、缺行可解释性和隐私，无需模型/真实用户日志。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 482 | — | — | 4515 |
| .mjs | source | 2 | 131 | 124 | 0 | — |
| .ts | source | 3 | 424 | 327 | 56 | — |
| .ts | test | 3 | 391 | 361 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt/issues?q=is%3Aissue+created%3A2026-09-22T07%3A59%3A01.907Z..2026-10-22T07%3A59%3A01.907Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/030611/dsh-verification-receipt/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A59%3A01.907Z..2026-10-22T07%3A59%3A01.907Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核轮次/调用状态投影、验证信号语义、最小字段隐私与hash、队列/卸载/磁盘边界、兼容成本及采用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它解决什么核查问题，什么结果有意义？

**研究主题：**场景与需求

#### 完整回答

适合希望回看DSH每轮记录过多少工具调用、出现哪些验证形状信号，却不愿另外持久化对话/参数/输出的个人维护者。turn/end后追加本地JSONL，包含粗粒度计数/状态/类别和会话伪名。它回答“记录中有何执行迹象”，不能回答“测试是否真运行/测试足够/代码正确”。

合格结果应是轮次括号和调用状态准确、未知不当成功、输出遵守字段排除与受控持久化；日志不是模型质量门禁或可信证明。基线是人工打开完整session记录搜索命令，增量在小型可比较摘要和隐私减量，换来丢失原始论据与语义。README主动界定这一限制，比用receipt名暗示验证通过更诚实。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-29](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/README.md#L13-L29)

作者缩小可回答问题。

<details>
<summary>查看原文（17行）</summary>

````text
> Ask a smaller, checkable question: what verification-shaped execution signals did DSH record this turn?

```sh
dsh plugin --profile web add dsh-verification-receipt
```

The receipt summarizes recorded tool counts and lexical verification-shaped signals. It does **not** prove that tests ran or that code is correct.

> Community-maintained and not an official DeepSeek project. Related trust-layer plugins: [Telemetry Redactor](https://github.com/030611/dsh-telemetry-redactor), [Evidence Audit](https://github.com/030611/qiushi-dsh-evidence-audit), and [Context Provenance](https://github.com/030611/dsh-context-provenance).

DSH Verification Receipt is a small, passive Profile Bundle for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). After each durable `turn/end`, it appends one privacy-minimal, heuristic execution summary to a local JSONL file.

![Verification Receipt data flow](https://raw.githubusercontent.com/030611/dsh-verification-receipt/main/docs/verification-flow.svg)

It records execution traces, not semantic correctness. A receipt shows only that DSH logged tool calls and that a lexical heuristic found a possible verification signal. It never proves that a test ran. It cannot show that the right command executed, that assertions were sufficient, that output was truthful, or that the assistant's conclusion was correct.

This is intentionally not an evidence-audit ledger: rows stay independent and there is no hash chain, artifact capture, claim-evidence linkage, or protocol attestation.
````

</details>

**依据 2 · 源码核查**：[src/receipt.ts:46-58](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/receipt.ts#L46-L58)

真实输出结构。

<details>
<summary>查看原文（13行）</summary>

```text
/** One JSONL record emitted after a durable `turn/end`. */
export interface VerificationReceipt {
  readonly schemaVersion: 1
  readonly kind: 'dsh-verification-receipt'
  readonly sessionIdHash: string
  readonly turn: number
  readonly turnEndSeq: number
  readonly endedAt: number
  readonly outcome: string
  readonly tools: ToolSummary
  readonly verificationSignals: readonly VerificationSignal[]
  readonly claim: 'execution-trace-only'
  readonly receiptHash: string
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何划轮次、配对调用并保护模型上下文？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

插件只注入sessions并监听session/event，遇turn/end读取snapshotEvents构造receipt；不注册模型工具/提示/发消息，也不修改session记录。投影先核end.seq索引处有turn/end，再逆找同turn start，若跨另一start或缺边界直接拒绝，避免把不完整轮次静默拼到一起。

observeCalls分别收集top-level tool/call与Code Mode dispatch-start，按callId/subCallId配最后result，缺结果unresolved，最终计calls/succeeded/failed/unresolved以及topLevel/nested。上层Code Mode调用和内部调用均计入，不能把calls当互不重叠的用户任务数。状态信任宿主记录和有限shell标记，不独立执行。

新意是最小字段投影、显式execution-trace-only、轮次配对和异步有序本地sink组合，不是新验证方法。完整session仍是原始真相；receipt不提供artifact/claim链接、签名或hashchain。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:89-110](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/index.ts#L89-L110)

被动监听与drain。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx: Context, config: Config = {}): void {
  const resolved = resolveConfig(config)
  const writer = new JsonlWriter(ctx, resolved.outputPath)
  ctx.effect(function* () {
    let accepting = true
    yield async () => writer.drain()
    yield ctx.on('session/event', (session: Session, event: SessionEvent) => {
      // Cordis clears the public fiber uid synchronously when explicit disposal
      // starts, before its async unload checkpoint can unregister this listener.
      if (!accepting || ctx.fiber.uid === null || event.type !== 'turn/end') return
      try {
        writer.enqueue(createReceipt({ id: session.id, events: session.snapshotEvents() }, event))
      } catch (error: unknown) {
        ctx.logger.warn(`verification-receipt: could not summarize turn: ${String(error)}`)
      }
    })
    // Yield in drain/listener/gate order: Cordis disposes nested effects in
    // reverse, so any unload closes the gate, unregisters, then awaits writes.
    yield () => {
      accepting = false
    }
  }, 'verification-receipt listener and JSONL drain')
```

</details>

**依据 2 · 源码核查**：[src/receipt.ts:87-126](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/receipt.ts#L87-L126)

边界校验与输出。

<details>
<summary>查看原文（40行）</summary>

```text
export function createReceipt(session: ReceiptSession, end: ReceiptEvent): VerificationReceipt {
  const storedEnd = session.events[end.seq]
  if (storedEnd === undefined || storedEnd.seq !== end.seq || storedEnd.type !== 'turn/end') {
    throw new Error('turn/end is not present at its declared seq')
  }
  const endData = record(storedEnd.data)
  const turn = numberField(endData, 'turn')
  const startIndex = findTurnStart(session.events, storedEnd.seq, turn)
  const bracket = session.events.slice(startIndex, storedEnd.seq + 1)
  const calls = observeCalls(bracket)
  const tools = summarizeTools(calls)
  const verificationSignals = calls.flatMap(verificationSignal)
  const reason = record(endData.reason)
  const withoutHash = {
    schemaVersion: 1 as const,
    kind: 'dsh-verification-receipt' as const,
    sessionIdHash: digest(`dsh-verification-receipt/session/v1\n${session.id}`),
    turn,
    turnEndSeq: storedEnd.seq,
    endedAt: storedEnd.time,
    outcome: stringField(reason, 'kind'),
    tools,
    verificationSignals,
    claim: 'execution-trace-only' as const,
  }
  return {
    ...withoutHash,
    receiptHash: digest(JSON.stringify(withoutHash)),
  }
}

/** Find the matching opening boundary and reject an incomplete event bracket. */
function findTurnStart(events: readonly ReceiptEvent[], endSeq: number, turn: number): number {
  for (let index = endSeq - 1; index >= 0; index--) {
    const candidate = events[index]
    if (candidate?.type !== 'turn/start') continue
    if (numberField(record(candidate.data), 'turn') === turn) return index
    throw new Error(`turn ${turn} crosses another turn/start boundary`)
  }
  throw new Error(`turn ${turn} has no turn/start boundary`)
```

</details>

**依据 3 · 源码核查**：[src/receipt.ts:130-177](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/receipt.ts#L130-L177)

双层调用配对。

<details>
<summary>查看原文（48行）</summary>

```text
function observeCalls(events: readonly ReceiptEvent[]): CallObservation[] {
  const topLevel: CallObservation[] = []
  const nested: CallObservation[] = []
  const topLevelResults = new Map<string, CallObservation['result']>()
  const nestedResults = new Map<string, CallObservation['result']>()

  for (const event of events) {
    const data = record(event.data)
    if (event.type === 'tool/call') {
      topLevel.push({
        id: stringField(data, 'callId'),
        name: stringField(data, 'name'),
        arguments: data.arguments,
        source: 'top-level',
      })
      continue
    }
    if (event.type === 'tool/result') {
      const block = toolResultBlock(data.message)
      if (block !== undefined) {
        topLevelResults.set(stringField(block, 'toolCallId'), {
          isError: block.isError === true,
          content: block.content,
        })
      }
      continue
    }
    if (event.type === 'tool/code-dispatch-start') {
      nested.push({
        id: stringField(data, 'subCallId'),
        name: stringField(data, 'name'),
        arguments: data.arguments,
        source: 'nested',
      })
      continue
    }
    if (event.type === 'tool/code-dispatch') {
      nestedResults.set(stringField(data, 'subCallId'), {
        isError: data.isError === true,
        content: data.content,
      })
    }
  }

  return [
    ...topLevel.map(call => ({ ...call, result: topLevelResults.get(call.id) })),
    ...nested.map(call => ({ ...call, result: nestedResults.get(call.id) })),
  ]
```

</details>

**依据 4 · 源码核查**：[src/receipt.ts:181-195](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/receipt.ts#L181-L195)

状态计数。

<details>
<summary>查看原文（15行）</summary>

```text
function summarizeTools(calls: readonly CallObservation[]): ToolSummary {
  let succeeded = 0
  let failed = 0
  let unresolved = 0
  let topLevel = 0
  let nested = 0
  for (const call of calls) {
    if (call.source === 'top-level') topLevel++
    else nested++
    const status = callStatus(call)
    if (status === 'succeeded') succeeded++
    else if (status === 'failed') failed++
    else unresolved++
  }
  return { calls: calls.length, succeeded, failed, unresolved, topLevel, nested }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 验证信号能证明什么，哪些反例会误导？

**研究主题：**缺陷与关键质疑

#### 完整回答

仅词法提示。优先tool-name命中类别；否则限定bash/pwsh/shell/shell_command/terminal/terminal_exec读字符串command或cmd，按typecheck/test/lint/build/check首个匹配类别。无shell语法解析/别名展开，echo“do not run tests”仍命中test，数组argv/自定义工具名或无可见关键词别名漏掉，这些反例有测试设计明确承认。

状态succeeded只是已见result且无isError/识别的末尾非零退出/超时kill标记。结果文本稍变、工具伪报或命令没做真正验证，都不能由该字段识别。background命令的signal强制unresolved，但tools总计仍按启动调用result为succeeded；两处口径不同有意表达启动与验证结果，不可将总成功数替代验证通过数。byName优先时只输出单类别，也不会完整列出复合命令所有验证步骤。

读取者应使用“疑似验证信号/记录调用状态”，保持未知；不应由匹配类别作CI质量闸门。createReceipt按seq作为数组索引，依赖宿主连续事件布局；缺间隔/不支持的事件结构抛错由监听器警告，可能漏receipt而非产出假的完成。

#### 证据与依据

**依据 1 · 源码核查**：[src/receipt.ts:72-79](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/receipt.ts#L72-L79)

首类别词法正则。

```text
const SHELL_TOOL = /^(?:bash|pwsh|shell|shell_command|terminal|terminal_exec)$/iu
const CATEGORY_PATTERNS: ReadonlyArray<readonly [VerificationCategory, RegExp]> = [
  ['typecheck', /(?:^|[^a-z])(?:type[-_ ]?check|tsc)(?:[^a-z]|$)/iu],
  ['test', /(?:^|[^a-z])(?:test|tests|testing|vitest|jest|pytest|unittest|cargo\s+test|go\s+test)(?:[^a-z]|$)/iu],
  ['lint', /(?:^|[^a-z])(?:lint|eslint|oxlint|ruff)(?:[^a-z]|$)/iu],
  ['build', /(?:^|[^a-z])(?:build|compile|tsdown|esbuild)(?:[^a-z]|$)/iu],
  ['check', /(?:^|[^a-z])(?:check|verify|validate)(?:[^a-z]|$)/iu],
]
```

**依据 2 · 源码核查**：[src/receipt.ts:198-245](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/receipt.ts#L198-L245)

byName优先/background/状态。

<details>
<summary>查看原文（48行）</summary>

```text
/** Return one coarse suspected-verification signal, if the call looks relevant. */
function verificationSignal(call: CallObservation): VerificationSignal[] {
  const byName = categoryFor(call.name)
  if (byName !== undefined) {
    return [{ source: 'tool-name', category: byName, status: callStatus(call) }]
  }
  if (!SHELL_TOOL.test(call.name)) return []
  const args = argumentRecord(call.arguments)
  const command = typeof args?.command === 'string'
    ? args.command
    : typeof args?.cmd === 'string'
      ? args.cmd
      : undefined
  if (command === undefined) return []
  const category = categoryFor(command)
  if (category === undefined) return []
  const background = args?.run_in_background === true
  return [{
    source: 'command',
    category,
    status: background ? 'unresolved' : callStatus(call),
  }]
}

/** Parse a tool's raw JSON arguments only for in-memory classification. */
function argumentRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'string') return recordOrUndefined(value)
  try {
    return recordOrUndefined(JSON.parse(value) as unknown)
  } catch {
    return undefined
  }
}

/** Choose the first, most-specific verification category present in text. */
function categoryFor(text: string): VerificationCategory | undefined {
  for (const [category, pattern] of CATEGORY_PATTERNS) {
    if (pattern.test(text)) return category
  }
  return undefined
}

/** Resolve a call's final state, including non-zero shell status markers. */
function callStatus(call: CallObservation): ReceiptStatus {
  if (call.result === undefined) return 'unresolved'
  if (call.result.isError) return 'failed'
  if (SHELL_TOOL.test(call.name) && failedCommandContent(call.result.content)) return 'failed'
  return 'succeeded'
```

</details>

**依据 3 · 源码核查**：[src/receipt.ts:249-269](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/receipt.ts#L249-L269)

有限末尾shell标记。

<details>
<summary>查看原文（21行）</summary>

```text
function failedCommandContent(content: unknown): boolean {
  if (!Array.isArray(content)) return false
  for (const block of content) {
    const item = recordOrUndefined(block)
    if (item?.type !== 'text' || typeof item.text !== 'string') continue
    const exit = item.text.match(/\[exit code: (-?\d+)\](?:\r?\n)?$/u)
    if (exit?.[1] !== undefined && Number(exit[1]) !== 0) return true
    if (/\[(?:killed by signal|timed out after):?[^\]]*\](?:\r?\n)?$/iu.test(item.text)) return true
  }
  return false
}

/** Extract the single tool-result block from a DSH tool message. */
function toolResultBlock(message: unknown): Record<string, unknown> | undefined {
  const content = recordOrUndefined(message)?.content
  if (!Array.isArray(content)) return undefined
  for (const block of content) {
    const item = recordOrUndefined(block)
    if (item?.type === 'tool-result') return item
  }
  return undefined
```

</details>

**依据 4 · 源码核查**：[tests/receipt.spec.ts:181-227](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/tests/receipt.spec.ts#L181-L227)

后台口径/支持与反例设计。

<details>
<summary>查看原文（47行）</summary>

```text
  it('keeps missing results and background verification work unresolved', () => {
    const end = event('turn/end', 4, { turn: 5, reason: { kind: 'completed' } })
    const fixture = session('unresolved', [
      event('turn/start', 0, { turn: 5 }),
      event('tool/call', 1, {
        turn: 5, step: 1, callId: 'missing', name: 'verify_project', arguments: '{}',
      }),
      event('tool/call', 2, {
        turn: 5, step: 1, callId: 'background', name: 'bash',
        arguments: '{"command":"pnpm test","run_in_background":true}',
      }),
      result(3, 5, 1, 'background', 'background job started'),
      end,
    ])

    const receipt = createReceipt(fixture, end)
    expect(receipt.tools).toMatchObject({ calls: 2, succeeded: 1, unresolved: 1 })
    expect(receipt.verificationSignals).toEqual([
      { source: 'tool-name', category: 'check', status: 'unresolved' },
      { source: 'command', category: 'test', status: 'unresolved' },
    ])
  })

  it.each([
    ['command JSON string', 'bash', '{"command":"pnpm test"}', 'test'],
    ['cmd object field', 'pwsh', { cmd: 'pnpm lint' }, 'lint'],
    ['case-insensitive quoted wrapper', 'SHELL_COMMAND', { command: 'bash -lc "PNPM VITEST run"' }, 'test'],
    ['PowerShell wrapper and quotes', 'terminal_exec', { command: 'pwsh -Command "npm run TYPECHECK"' }, 'typecheck'],
  ])('supports %s', (_label, name, args, category) => {
    expect(signalFor(name, args)).toMatchObject({ source: 'command', category })
  })

  it.each([
    ['array command', 'bash', { command: ['pnpm', 'test'] }],
    ['argv-only shape', 'bash', { argv: ['pnpm', 'test'] }],
    ['custom shell name', 'my_shell', { command: 'pnpm test' }],
    ['nested command', 'bash', { command: { text: 'pnpm test' } }],
    ['custom alias without keyword', 'bash', { command: 'pnpm run ci' }],
  ])('leaves unsupported %s unclassified', (_label, name, args) => {
    expect(signalFor(name, args)).toBeUndefined()
  })

  it('documents lexical false positives by classifying quoted non-execution text', () => {
    expect(signalFor('bash', { command: 'echo "do not run tests"' })).toMatchObject({
      source: 'command',
      category: 'test',
    })
```

</details>

#### 缺口

- 在目标读者真实工具命名/命令语料中的误报漏报率没有标注对照。
  **影响：**不量化发现质量或作为质量门禁。
  **进一步探讨：**用去敏合成命令矩阵加人工已知执行结果，分开词法命中、调用成功、实际验证/断言结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 隐私、完整性与持久化有哪些真实保证？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

输出字面构造限定工具计数/类别和时序，不包含参数/原始ID/工具输出或消息文本；投影在内存仍会读取原始参数/结果做判断，不能说从不接触。sessionIdHash加domain但无key，可跨文件关联、低熵ID可猜，不是匿名。receiptHash是固定字段JSON的SHA256，任意能改文件者可重算，不发现删除/插入/回滚/重排；作者SECURITY一致承认。

writer用Promise链顺序append，mkdir0700/append0600仅请求创建模式，无chmod/realpath/lstat/锁，预存文件权限/路径链接及跨进程写均在可信本地路径边界。写失败warning后队列继续，不向宿主turn反馈“receipt已持久”。排队无容量/背压与rotation，慢盘可积压内存，崩溃丢已接受未写完项/尾行不完整。

生命周期gate→注销listener→drain的逆序effect设计与ctx.fiber.uid同步检查避免卸载再接收，较单纯dispose后flush细致；drain只等Promise settled，失败已catch仍算排队结束，不等于全部行成功。作者有真实Context+SessionStore组合测试设计，本轮只读，不冒认运行通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/receipt.ts:100-115](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/receipt.ts#L100-L115)

输出最小字段/无keyhash。

<details>
<summary>查看原文（16行）</summary>

```text
  const withoutHash = {
    schemaVersion: 1 as const,
    kind: 'dsh-verification-receipt' as const,
    sessionIdHash: digest(`dsh-verification-receipt/session/v1\n${session.id}`),
    turn,
    turnEndSeq: storedEnd.seq,
    endedAt: storedEnd.time,
    outcome: stringField(reason, 'kind'),
    tools,
    verificationSignals,
    claim: 'execution-trace-only' as const,
  }
  return {
    ...withoutHash,
    receiptHash: digest(JSON.stringify(withoutHash)),
  }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:65-80](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/index.ts#L65-L80)

有序追加/模式/失败吞入warning。

<details>
<summary>查看原文（16行）</summary>

```text
  /** Enqueue one complete JSON line without returning work to the session listener. */
  enqueue(value: unknown): void {
    const line = `${JSON.stringify(value)}\n`
    this.pending = this.pending
      .then(async () => {
        await mkdir(dirname(this.outputPath), { recursive: true, mode: 0o700 })
        await appendFile(this.outputPath, line, { encoding: 'utf8', flag: 'a', mode: 0o600 })
      })
      .catch((error: unknown) => {
        this.ctx.logger.warn(`verification-receipt: could not append receipt: ${String(error)}`)
      })
  }

  /** Wait until every append accepted before disposal has settled. */
  async drain(): Promise<void> {
    await this.pending
```

</details>

**依据 3 · 源码核查**：[src/index.ts:92-110](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/index.ts#L92-L110)

关闭接收与drain时序。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.effect(function* () {
    let accepting = true
    yield async () => writer.drain()
    yield ctx.on('session/event', (session: Session, event: SessionEvent) => {
      // Cordis clears the public fiber uid synchronously when explicit disposal
      // starts, before its async unload checkpoint can unregister this listener.
      if (!accepting || ctx.fiber.uid === null || event.type !== 'turn/end') return
      try {
        writer.enqueue(createReceipt({ id: session.id, events: session.snapshotEvents() }, event))
      } catch (error: unknown) {
        ctx.logger.warn(`verification-receipt: could not summarize turn: ${String(error)}`)
      }
    })
    // Yield in drain/listener/gate order: Cordis disposes nested effects in
    // reverse, so any unload closes the gate, unregisters, then awaits writes.
    yield () => {
      accepting = false
    }
  }, 'verification-receipt listener and JSONL drain')
```

</details>

**依据 4 · 作者声明**：[SECURITY.md:7-23](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/SECURITY.md#L7-L23)

作者信任/匿名/队列边界。

<details>
<summary>查看原文（17行）</summary>

```text
## Trust model

DSH Verification Receipt is a local observer, not an enforcement or attestation system. It trusts the DSH Session event stream for tool identity and outcome. It does not independently rerun tools, inspect the workspace, validate assistant claims, sign records, or provide trusted timestamps.

The JSONL destination should be readable and writable only by the local user who runs DSH. Do not place it in an agent-visible workspace, shared directory, synced public folder, or untrusted mount. The plugin requests owner-only modes when creating its directory and file, but operating systems and pre-existing paths may apply different permissions.

Anyone able to modify the JSONL file can delete, reorder, replace, or recompute receipt rows. `receiptHash` is an integrity checksum, not authentication. Use an external signed, append-only, access-controlled sink if adversarial tamper resistance is required.

Both `sessionIdHash` and `receiptHash` are unkeyed and recomputable. Low-entropy or predictable Session ids can be guessed offline, and independent receipt rows cannot reveal deletion, insertion, reordering, truncation, rollback, or replacement. This plugin deliberately has no hash chain and is not an evidence-audit ledger.

Receipt rows omit arguments, outputs, messages, and raw Session ids. They still expose timing, turn numbers, outcome counts, coarse verification categories, and a deterministic Session-id hash. Those facts may be sensitive, and the hash allows rows for one Session to be linked.

One plugin instance serializes its own writes. Separate processes have no shared lock, so writing one path from multiple DSH processes has no guaranteed ordering or row-boundary integrity. A crash can lose queued rows or leave an incomplete tail line. The queue is unbounded under sustained filesystem backpressure.

Directory/file creation modes are best-effort: existing permissions are unchanged, Windows may ignore POSIX modes, and a pre-existing symbolic link is followed. The configured destination is a trusted-administrator boundary, not a defense against hostile path components.

## Report a vulnerability
```

</details>

**依据 5 · 源码核查**：[tests/composition.spec.ts:18-64](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/tests/composition.spec.ts#L18-L64)

组合/隐私/不改模型history设计。

<details>
<summary>查看原文（47行）</summary>

```text
  it('observes SessionStore turn/end, writes JSONL, and changes no model history', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-verification-receipt-'))
    roots.push(root)
    const outputPath = join(root, 'receipts.jsonl')
    const ctx = new Context()
    await ctx.plugin(SessionStore)
    const beforeListeners = [...ctx.events.dispatch('emit', ['session/event'])].length
    const plugin = await ctx.plugin(apply, { outputPath })
    const session = ctx.sessions.create()
    session.append('turn/start', { turn: 1 })
    session.append('step/start', { turn: 1, step: 1 })
    session.append('tool/call', {
      turn: 1,
      step: 1,
      callId: ToolCallId('c1'),
      name: 'read',
      arguments: '{"path":"private.txt"}',
    })
    session.append('tool/result', {
      turn: 1,
      step: 1,
      message: createToolResultMessage({
        callId: ToolCallId('c1'),
        content: [{ type: 'text', text: 'private result' }],
        isError: false,
      }),
    }, { surfaceOp: 'append' })
    session.append('step/end', { turn: 1, step: 1 })
    const messagesBeforeEnd = session.deriveMessages()
    session.append('turn/end', { turn: 1, reason: { kind: 'completed' } })
    expect(session.deriveMessages()).toEqual(messagesBeforeEnd)
    await plugin.dispose()

    const raw = await readFile(outputPath, 'utf8')
    expect(raw.endsWith('\n')).toBe(true)
    const lines = raw.trim().split('\n')
    expect(lines).toHaveLength(1)
    const receipt = JSON.parse(lines[0]!) as Record<string, unknown>
    expect(receipt).toMatchObject({
      kind: 'dsh-verification-receipt',
      outcome: 'completed',
      claim: 'execution-trace-only',
      tools: { calls: 1, succeeded: 1, failed: 0 },
    })
    expect(lines[0]).not.toContain('private')
    expect([...ctx.events.dispatch('emit', ['session/event'])]).toHaveLength(beforeListeners)
    await ctx.fiber.dispose()
```

</details>

**依据 6 · 源码核查**：[tests/composition.spec.ts:85-102](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/tests/composition.spec.ts#L85-L102)

卸载拒绝新事件设计。

<details>
<summary>查看原文（18行）</summary>

```text
  it('stops accepting turn events as soon as disposal begins', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-verification-receipt-dispose-'))
    roots.push(root)
    const outputPath = join(root, 'receipts.jsonl')
    const ctx = new Context()
    await ctx.plugin(SessionStore)
    const plugin = await ctx.plugin(apply, { outputPath })
    const session = ctx.sessions.create()
    session.append('turn/start', { turn: 1 })
    session.append('turn/end', { turn: 1, reason: { kind: 'completed' } })

    const disposing = plugin.dispose()
    session.append('turn/start', { turn: 2 })
    session.append('turn/end', { turn: 2, reason: { kind: 'completed' } })
    await disposing

    expect((await readFile(outputPath, 'utf8')).trim().split('\n')).toHaveLength(1)
    await ctx.fiber.dispose()
```

</details>

#### 缺口

- 持续慢盘/满盘下队列峰值、丢行与恢复表现缺少资源曲线。
  **影响：**不能承诺有界内存或完整无丢账。
  **进一步探讨：**mock延迟/拒绝append，以合成高频turn测已接受/持久/丢弃计数和内存，勿用真实对话。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、维护与成本效果怎么判断？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH0.1.2-alpha.3/4/5与Session | durable event协议 | 作者仅这些版本Windows Web acceptance，不外推0.2 |
| Node ^22.19或>=24、Schemastery3.18.2 | ESM/配置验证 | Cordis/Session宿主peer，类型省略不等于无需服务 |
| 私有可信绝对输出路径 | JSONL本地追加 | 默认DSH_HOME或~/.dsh，非防恶意链接边界 |
| 一进程一文件/外部retention | 写顺序与容量维护 | 无跨进程锁/轮转 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装前 | 核宿主精确版本与包 | 不以Windows启动记录推断当前全平台 |
| 配置 | 指私有非symlink路径，一进程一file | 核旧权限、访问者、保留期 |
| 读receipt | 对照turn与词法类别/状态 | 不把succeeded当测试通过 |
| 维护 | 看写错误/磁盘容量/队列迹象 | 缺行不是“无工具” |
| 卸载 | 正常drain后核完整JSONL尾行 | 崩溃尾行隔离，不伪造补齐 |

#### 成本

| 阶段 | 现金与资源 | 人工与时间 | 已知与未知 |
| --- | --- | --- | --- |
| 首次 | 本地包/磁盘，不自调模型 | 核版本/路径/隐私 | 无安装工时估值 |
| 持续使用 | 同步投影CPU、JSONL存储和未界定queue | 轮转保留/分类误差解释 | 代码无额外模型请求；时延/空间随事件量未知 |
| 失败恢复 | 重查源session、隔离尾行/丢弃批 | 对照写失败与漏轮次 | 无自动backfill/强制同步；恢复完整性未知 |

#### 效果

| 目标 | 源码增量 | 限制 |
| --- | --- | --- |
| 少查完整对话 | 每轮粗摘要 | 非实际验证证明 |
| 少持久化内容 | 明确最小字段 | 时序/hash仍敏感且可关联 |
| 少影响模型 | 无工具/提示/网络请求 | 同步snapshot/投影仍可能增CPU时延 |
| 写顺序 | 单实例Promise链/卸载drain | 失败/崩溃/跨进程无完整保证 |

作者compatibility记录是可追溯声明，Windows安装/配置/冷启动/卸载不等于验证receipt语义。宿主snapshotEvents自身复制/遍历全历史的成本依宿主实现，插件再slice当轮/投影；不能只按一行JSON大小估全部CPU。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:52-60](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/package.json#L52-L60)

精确宿主范围。

```text
    "compatibility": {
      "dsh": "0.1.2-alpha.3 || 0.1.2-alpha.4 || 0.1.2-alpha.5",
      "dshReleases": {
        "0.1.2-alpha.3": "compatible",
        "0.1.2-alpha.4": "compatible",
        "0.1.2-alpha.5": "compatible"
      },
      "profiles": [
        "web"
```

**依据 2 · 源码核查**：[package.json:74-88](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/package.json#L74-L88)

peer与runtime依赖。

<details>
<summary>查看原文（15行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-session": "0.1.2-alpha.3 || 0.1.2-alpha.4 || 0.1.2-alpha.5",
    "@deepseek-ai/schemastery": "^3.18.2"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": {
      "optional": true
    },
    "@deepseek-ai/dsh-session": {
      "optional": true
    }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "3.18.2"
```

</details>

**依据 3 · 作者声明**：[docs/compatibility-0.1.1.md:9-36](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/docs/compatibility-0.1.1.md#L9-L36)

作者验收范围。

<details>
<summary>查看原文（28行）</summary>

```text
| DSH release | Status | Basis |
| --- | --- | --- |
| `0.1.2-alpha.3` | `compatible` | Package gates and disposable Web Profile acceptance passed. |
| `0.1.2-alpha.4` | `compatible` | Package gates and disposable Web Profile acceptance passed. |
| `0.1.2-alpha.5` | `compatible` | Package gates and disposable Web Profile acceptance passed. |

The Node.js range is `^22.19.0 || >=24.0.0`. Acceptance used Node.js 24.19.0
and pnpm 11.19.0 on Windows. macOS and Linux remain untested; the manifest
does not infer system support from the Windows result.

## Disposable Web Profile acceptance

Date: 2026-09-04. Each DSH release used a separate, new `DSH_HOME` and the
locally packed `dsh-verification-receipt-0.1.1.tgz`. No real user Profile was
read or modified.

For each release in the matrix:

1. `dsh plugin --profile web add <local-0.1.1-tarball>` exited 0.
2. `dsh --profile web --dump-config` exited 0 and contained the additive
   plugin-owned `dsh-verification-receipt` entry.
3. `dsh --profile web --no-open --port 0` emitted a bound loopback URL and
   remained live until deliberately interrupted.
4. `dsh plugin --profile web remove dsh-verification-receipt` exited 0, and a
   subsequent config dump contained no plugin entry.

No provider or model request was made. This acceptance does not prove the
semantic correctness of a receipt, exercise external APIs, or widen the
```

</details>

**依据 4 · 源码核查**：[src/index.ts:47-53](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/index.ts#L47-L53)

默认/绝对路径。

```text
function resolveConfig(config: Config = {}): ResolvedConfig {
  const dshHome = resolve(process.env.DSH_HOME ?? join(homedir(), '.dsh'))
  const outputPath = config.outputPath ?? join(dshHome, 'verification-receipts', 'v1', 'receipts.jsonl')
  if (!isAbsolute(outputPath)) {
    throw new Error('verification-receipt: outputPath must be absolute')
  }
  return { outputPath }
```

**依据 5 · 源码核查**：[src/index.ts:98-102](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/index.ts#L98-L102)

同步snapshot与投影。

```text
      if (!accepting || ctx.fiber.uid === null || event.type !== 'turn/end') return
      try {
        writer.enqueue(createReceipt({ id: session.id, events: session.snapshotEvents() }, event))
      } catch (error: unknown) {
        ctx.logger.warn(`verification-receipt: could not summarize turn: ${String(error)}`)
```

#### 缺口

- 固定版本长会话/大参数的snapshot与投影时延、长期JSONL增长未对照。
  **影响：**不量化零成本或日常保留规模。
  **进一步探讨：**合成多轮/不同事件大小，分别统计宿主snapshot、投影、队列和存储，无需模型调用。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 推荐结论与可继续探讨方向是什么？

**研究主题：**采用判断、新假设与验证

#### 完整回答

有条件试用。适合精确支持的宿主、个人私有本地目录、把它当启发式观察摘要的维护者。字段减量、轮次边界和卸载顺序清楚，且文档主动区分hash/验证信号与真实保证。需要审计证明、全平台实时兼容、强耐久或多进程共写者不应依赖这些摘要替代原始记录。

从“业务turn不应被可选sink阻塞”与“无限队列和失败丢行会让缺记录难解释”的冲突出发，可探讨“有界队列与可见丢失收据”。将accepted/persisted/dropped/error/lastSeq计数隔离成不含内容的本地状态，容量触顶按明确策略拒绝/采样；独立验证器只核字段/序号覆盖，不把它升级成防篡改审计。参照当前无界Promise链，比较内存/turn延迟/丢失可解释性。

反例是进程突然终止且状态未持久，仍无法准确知道所有丢行；若方案声称此时零丢失便被反例证伪。最小对照包含慢盘/满盘、dispose中到达、重复turn/end、尾行半写与长参数，判据是内存有界、缺行可见且不泄露原文/不增加模型上下文。若为保计数阻塞turn或引入敏感内容，净收益不成立。方案未实现，不计当前优势。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:65-80](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/index.ts#L65-L80)

无界链与失败基线。

<details>
<summary>查看原文（16行）</summary>

```text
  /** Enqueue one complete JSON line without returning work to the session listener. */
  enqueue(value: unknown): void {
    const line = `${JSON.stringify(value)}\n`
    this.pending = this.pending
      .then(async () => {
        await mkdir(dirname(this.outputPath), { recursive: true, mode: 0o700 })
        await appendFile(this.outputPath, line, { encoding: 'utf8', flag: 'a', mode: 0o600 })
      })
      .catch((error: unknown) => {
        this.ctx.logger.warn(`verification-receipt: could not append receipt: ${String(error)}`)
      })
  }

  /** Wait until every append accepted before disposal has settled. */
  async drain(): Promise<void> {
    await this.pending
```

</details>

**依据 2 · 源码核查**：[src/index.ts:92-110](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/index.ts#L92-L110)

卸载与接收基线。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.effect(function* () {
    let accepting = true
    yield async () => writer.drain()
    yield ctx.on('session/event', (session: Session, event: SessionEvent) => {
      // Cordis clears the public fiber uid synchronously when explicit disposal
      // starts, before its async unload checkpoint can unregister this listener.
      if (!accepting || ctx.fiber.uid === null || event.type !== 'turn/end') return
      try {
        writer.enqueue(createReceipt({ id: session.id, events: session.snapshotEvents() }, event))
      } catch (error: unknown) {
        ctx.logger.warn(`verification-receipt: could not summarize turn: ${String(error)}`)
      }
    })
    // Yield in drain/listener/gate order: Cordis disposes nested effects in
    // reverse, so any unload closes the gate, unregisters, then awaits writes.
    yield () => {
      accepting = false
    }
  }, 'verification-receipt listener and JSONL drain')
```

</details>

**依据 3 · 源码核查**：[src/receipt.ts:100-115](https://github.com/030611/dsh-verification-receipt/blob/87f3fb0198090f0f26a37a52840db150609db748/src/receipt.ts#L100-L115)

最小字段基线。

<details>
<summary>查看原文（16行）</summary>

```text
  const withoutHash = {
    schemaVersion: 1 as const,
    kind: 'dsh-verification-receipt' as const,
    sessionIdHash: digest(`dsh-verification-receipt/session/v1\n${session.id}`),
    turn,
    turnEndSeq: storedEnd.seq,
    endedAt: storedEnd.time,
    outcome: stringField(reason, 'kind'),
    tools,
    verificationSignals,
    claim: 'execution-trace-only' as const,
  }
  return {
    ...withoutHash,
    receiptHash: digest(JSON.stringify(withoutHash)),
  }
```

</details>

#### 缺口

- 有界队列/丢失收据方案未实现。
  **影响：**不计现有资源与耐久优势。
  **进一步探讨：**合成延迟/失败/崩溃对照内存、延迟与丢失解释，不调用模型。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
