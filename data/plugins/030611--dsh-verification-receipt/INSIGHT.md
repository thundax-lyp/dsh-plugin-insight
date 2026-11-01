# DSH Verification Receipt

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ee3c616](https://github.com/030611/dsh-verification-receipt/tree/ee3c6167f1b323f66f9412907f1ef6697cbf488d)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/030611/dsh-verification-receipt) [![npm 30d 905](https://img.shields.io/static/v1?label=npm+30d&message=905&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verification-receipt) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-verification-receipt)
<!-- END META -->

> **功能**：将 DSH 每轮观察到的验证信号写成简要 JSONL 回执。

> **亮点**：[Q02](#research-q02) 将验证信号聚合为紧凑回执并保持主流程非等待写入。

> **主要限制**：[Q03](#research-q03) 状态不是独立验证，hash 不证明完整或不可篡改。

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
  - [Q01 · 验证回执为谁减少什么工作？](#detail-section-11)
  - [Q02 · 回执如何生成并写入？](#detail-section-12)
  - [Q03 · succeeded 与 hash 能证明测试通过且未篡改吗？](#detail-section-13)
  - [Q04 · 怎样安全保存和使用摘要？](#detail-section-14)
  - [Q05 · 如何帮助审查者处理未完成验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望快速回看 Agent 轮次验证信号的开发者或审查者。

审查者可直接回看会话和 CI 原始结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 验证分类 | 快速定位线索 | 词面匹配可能误判 |
| 回执摘要 | 精简每轮结果 | 不独立执行验证 |
| 异步写入 | 不等待磁盘 | 崩溃可丢队列 |
| 内容 hash | 检查记录内容 | 不证明来源和历史完整 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH sessions 事件 | 必需 | 提供观察数据 | 不生成有效摘要 |
| 可信绝对路径及写权限 | 必需 | 持久化 JSONL | 写入警告，摘要可能丢失 |
| 原始会话或 CI | 审核必需 | 独立复核验证 | 不能只凭回执断定通过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户配置可信私有绝对路径和插件 | 路径错误时修正 |
| 观察 | 插件在轮次结束后异步写摘要 | 查看日志与文件，写失败不阻止任务 |
| 验收 | 审查者将摘要与原始记录对照 | unresolved 或缺失需回溯 |
| 恢复 | 用户隔离损坏尾行并检查源事件 | 无法恢复部分明确未知 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 存储费用未知 | 配置私有路径时间未知 | 需兼容 DSH |
| 持续使用 | 文件与内存使用量未知 | 审查与维护耗时未知 | 队列无界，词面分析随事件大小增长 |
| 失败恢复 | 恢复资源费用未知 | 核对原始事件时间未知 | 崩溃可丢队列且不回填 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 轮次摘要 | turn/end 提取并异步追加 | 完整性及节省时间 |
| 状态 | 从观察结果和标记分类 | 真实验证通过率 |
| hash | 每条记录摘要 | 删除、重排检测及真实性 |

> **思考**：[Q03](#research-q03) 状态不是独立验证，hash 不证明完整或不可篡改。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将验证信号聚合为紧凑回执并保持主流程非等待写入。

[Q02](#research-q02) 异步队列降低主路径等待，但可丢记录；[Q03](#research-q03) hash 不是签名链。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 状态不是独立验证，hash 不证明完整或不可篡改。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在可信独立路径使用摘要，并核对原始记录。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码静态核查；未运行宿主、验证或文件写入。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/receipt.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根源码静态检查；未运行目标或模拟文件故障。
- 下一步：隔离宿主测试遗漏、崩溃、并发文件写入和原始记录对照。

**分析版本**

- **仓库**：[030611/dsh-verification-receipt](https://github.com/030611/dsh-verification-receipt)
- **版本号**：0.1.1（[固定提交 ee3c616](https://github.com/030611/dsh-verification-receipt/tree/ee3c6167f1b323f66f9412907f1ef6697cbf488d)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照已有 unresolved 状态提供匿名回溯线索，须测误放行与隐私。

隔离宿主测试遗漏、崩溃、并发文件写入和原始记录对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 545 | — | — | 5272 |
| .mjs | source | 2 | 149 | 138 | 3 | — |
| .ts | source | 3 | 424 | 327 | 56 | — |
| .ts | test | 3 | 391 | 361 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/030611/dsh-verification-receipt/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查回执生成、分类、持久性和可信边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 验证回执为谁减少什么工作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望回看 DSH 任务中是否出现测试、构建等验证信号的使用者，可按轮次查看本地摘要；原始会话日志也能查证，摘要减少检索而不能代替复现和审查。实际任务频次与审查耗时尚未测。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:89-103](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/src/index.ts#L89-L103)

turn/end 时生成摘要。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[README.md:170-174](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/README.md#L170-L174)

已观察范围与非独立验证。

```text
- Receipts cover events observed by the running plugin. Constructor seed history and turns completed while it was unloaded are not backfilled.
- A process crash can lose a queued receipt because `turn/end` does not synchronously wait for this optional local sink. Normal plugin/application disposal drains accepted writes.
- Disposal first closes the enqueue gate, then unregisters listeners, then drains accepted writes. Abrupt process termination cannot run that lifecycle.
- Receipt rows are independent; deletion, reordering, truncation, and rollback are not detectable.
- Receipt status repeats DSH's recorded tool outcome and recognized shell markers. It does not independently execute or validate anything.
```

#### 缺口

- 未进行日志对照
  **影响**：无法量化审查节省
  **进一步探讨**：对相同历史任务比较检索耗时和漏判。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 回执如何生成并写入？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

监听 session/event，仅 turn/end 用会话快照生成；writer 在单 fiber 中串行异步 append，失败只记警告，正常卸载等待已接受写入。摘要将调用和结果关联，以工具名或命令词面识别类别；缺结果及后台命令标 unresolved。回执 hash 是记录内容摘要，不是签名或可检测删除重排的链。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:56-80](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/src/index.ts#L56-L80)

异步有序写入与失败警告。

<details>
<summary>查看原文（25行）</summary>

```text
/** Ordered, non-blocking appends owned by one plugin fiber. */
class JsonlWriter {
  private pending: Promise<void> = Promise.resolve()

  constructor(
    private readonly ctx: Context,
    private readonly outputPath: string,
  ) {}

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

**依据 2 · 源码核查**：[src/index.ts:89-110](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/src/index.ts#L89-L110)

turn/end 与正常卸载。

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

**依据 3 · 源码核查**：[src/receipt.ts:192-218](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/src/receipt.ts#L192-L218)

词面与后台状态。

<details>
<summary>查看原文（27行）</summary>

```text
    else if (status === 'failed') failed++
    else unresolved++
  }
  return { calls: calls.length, succeeded, failed, unresolved, topLevel, nested }
}

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
```

</details>

**依据 4 · 源码核查**：[README.md:170-177](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/README.md#L170-L177)

独立记录及崩溃/多进程边界。

```text
- Receipts cover events observed by the running plugin. Constructor seed history and turns completed while it was unloaded are not backfilled.
- A process crash can lose a queued receipt because `turn/end` does not synchronously wait for this optional local sink. Normal plugin/application disposal drains accepted writes.
- Disposal first closes the enqueue gate, then unregisters listeners, then drains accepted writes. Abrupt process termination cannot run that lifecycle.
- Receipt rows are independent; deletion, reordering, truncation, and rollback are not detectable.
- Receipt status repeats DSH's recorded tool outcome and recognized shell markers. It does not independently execute or validate anything.
- Projection cost grows with the number and size of events in a turn; unusually large tool arguments can add end-of-turn CPU time while they are classified in memory.
- The in-process write queue is ordered but unbounded. A slow or stuck filesystem can grow memory usage until writes recover or the process ends.
- There is no cross-process lock. Two DSH processes targeting one file have no guaranteed row order or row-boundary integrity; use one file per process. A crash can leave an incomplete final line, which readers must reject or quarantine.
```

#### 缺口

- 未运行宿主和文件系统
  **影响**：无法验证部署环境下的事件及写入
  **进一步探讨**：隔离会话测试 turn/end、写入失败、进程崩溃和并发。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · succeeded 与 hash 能证明测试通过且未篡改吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

状态从工具结果和有限 shell 输出标记推断；命令词面匹配可能误识别，缺结果是 unresolved。hash 未对作者身份签名，行独立也不能发现删除、排序或回滚，因此不能把摘要当真实验证、完整历史或防篡改证书。仅重复已观察到的事件，插件未加载期间也不补历史。

#### 证据与依据

**依据 1 · 源码核查**：[src/receipt.ts:232-257](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/src/receipt.ts#L232-L257)

分类与结果有限识别。

<details>
<summary>查看原文（26行）</summary>

```text
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
}

/** Recognize DSH shell render markers without retaining the result text. */
function failedCommandContent(content: unknown): boolean {
  if (!Array.isArray(content)) return false
  for (const block of content) {
    const item = recordOrUndefined(block)
    if (item?.type !== 'text' || typeof item.text !== 'string') continue
    const exit = item.text.match(/\[exit code: (-?\d+)\](?:\r?\n)?$/u)
    if (exit?.[1] !== undefined && Number(exit[1]) !== 0) return true
    if (/\[(?:killed by signal|timed out after):?[^\]]*\](?:\r?\n)?$/iu.test(item.text)) return true
  }
```

</details>

**依据 2 · 源码核查**：[README.md:168-174](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/README.md#L168-L174)

覆盖、丢失与非独立验证。

```text
## Known limitations

- Receipts cover events observed by the running plugin. Constructor seed history and turns completed while it was unloaded are not backfilled.
- A process crash can lose a queued receipt because `turn/end` does not synchronously wait for this optional local sink. Normal plugin/application disposal drains accepted writes.
- Disposal first closes the enqueue gate, then unregisters listeners, then drains accepted writes. Abrupt process termination cannot run that lifecycle.
- Receipt rows are independent; deletion, reordering, truncation, and rollback are not detectable.
- Receipt status repeats DSH's recorded tool outcome and recognized shell markers. It does not independently execute or validate anything.
```

#### 缺口

- 未与原始工具记录全面比较
  **影响**：假阳性、漏检及不同宿主格式未知
  **进一步探讨**：抽样逐条回溯原始会话和实际 CI 结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样安全保存和使用摘要？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要 DSH sessions 事件和可写绝对路径；默认权限是创建时请求，不能修复已有权限或阻止符号链接。异常可能仅记日志或崩溃丢队列，跨进程无锁；使用可信私有目录、每进程独立文件并将异常交人工复查。运行开销、漏判和审计成本未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:46-53](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/src/index.ts#L46-L53)

绝对路径检查。

```text
/** Resolve and validate the JSONL destination at plugin load. */
function resolveConfig(config: Config = {}): ResolvedConfig {
  const dshHome = resolve(process.env.DSH_HOME ?? join(homedir(), '.dsh'))
  const outputPath = config.outputPath ?? join(dshHome, 'verification-receipts', 'v1', 'receipts.jsonl')
  if (!isAbsolute(outputPath)) {
    throw new Error('verification-receipt: outputPath must be absolute')
  }
  return { outputPath }
```

**依据 2 · 源码核查**：[src/index.ts:65-75](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/src/index.ts#L65-L75)

写入与警告。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[README.md:170-178](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/README.md#L170-L178)

崩溃、多进程和权限局限。

```text
- Receipts cover events observed by the running plugin. Constructor seed history and turns completed while it was unloaded are not backfilled.
- A process crash can lose a queued receipt because `turn/end` does not synchronously wait for this optional local sink. Normal plugin/application disposal drains accepted writes.
- Disposal first closes the enqueue gate, then unregisters listeners, then drains accepted writes. Abrupt process termination cannot run that lifecycle.
- Receipt rows are independent; deletion, reordering, truncation, and rollback are not detectable.
- Receipt status repeats DSH's recorded tool outcome and recognized shell markers. It does not independently execute or validate anything.
- Projection cost grows with the number and size of events in a turn; unusually large tool arguments can add end-of-turn CPU time while they are classified in memory.
- The in-process write queue is ordered but unbounded. A slow or stuck filesystem can grow memory usage until writes recover or the process ends.
- There is no cross-process lock. Two DSH processes targeting one file have no guaranteed row order or row-boundary integrity; use one file per process. A crash can leave an incomplete final line, which readers must reject or quarantine.
- Creation modes request `0700`/`0600` on supporting POSIX filesystems only. Existing permissions are not tightened, Windows may ignore POSIX modes, and pre-existing symbolic links are followed. Configure a trusted, private, non-symlink path.
```

#### 缺口

- 无目标部署及文件系统实测
  **影响**：无法保证持久、私密或完整
  **进一步探讨**：验证权限、磁盘故障、断电及审查恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助审查者处理未完成验证？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有 unresolved 状态用于缺结果和后台命令，是直接反证；假设在现有摘要上展示可回溯的匿名事件序号和“需回原会话核实”，帮助审查者决定是否阻止交付或继续复查。对照现有回执，在缺结果、后台仍运行、假阳性词面和正常结束场景下比较错误放行、漏检、回溯时长和隐私暴露；若错误放行不降、误导或泄漏/审查成本抵消收益则否定。未穷尽全部消费端已有展示。

#### 证据与依据

**依据 1 · 源码核查**：[src/receipt.ts:204-218](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/src/receipt.ts#L204-L218)

后台状态 unresolved。

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/receipt.ts:240-245](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/src/receipt.ts#L240-L245)

缺结果 unresolved。

```text
/** Resolve a call's final state, including non-zero shell status markers. */
function callStatus(call: CallObservation): ReceiptStatus {
  if (call.result === undefined) return 'unresolved'
  if (call.result.isError) return 'failed'
  if (SHELL_TOOL.test(call.name) && failedCommandContent(call.result.content)) return 'failed'
  return 'succeeded'
```

**依据 3 · 源码核查**：[README.md:170-174](https://github.com/030611/dsh-verification-receipt/blob/ee3c6167f1b323f66f9412907f1ef6697cbf488d/README.md#L170-L174)

已有事件覆盖和可信边界。

```text
- Receipts cover events observed by the running plugin. Constructor seed history and turns completed while it was unloaded are not backfilled.
- A process crash can lose a queued receipt because `turn/end` does not synchronously wait for this optional local sink. Normal plugin/application disposal drains accepted writes.
- Disposal first closes the enqueue gate, then unregisters listeners, then drains accepted writes. Abrupt process termination cannot run that lifecycle.
- Receipt rows are independent; deletion, reordering, truncation, and rollback are not detectable.
- Receipt status repeats DSH's recorded tool outcome and recognized shell markers. It does not independently execute or validate anything.
```

#### 缺口

- 未核查全部消费端或隐私需求
  **影响**：不能声称无等价展示或已改善
  **进一步探讨**：以匿名事件链接原型与现有 JSONL 进行盲测。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
