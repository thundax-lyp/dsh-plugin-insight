# dsh-tts-flash

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[a23020b](https://github.com/2021Heei/dsh-tts-flash/tree/a23020b72a5c403e3dc50527b3ef43c6e55c739a)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2021Heei/dsh-tts-flash)
<!-- END META -->

> **实现功能**：DSH 桌面端流式回复语音朗读与等待短语播放插件，支持 Edge 和云端 TTS。

> **核心亮点**：把桌面浮条、等待语音和可替换 TTS 引擎接入 DSH 文本流。详见[Q01](#research-q01)。

> **风险与缺陷**：朗读音频不是完整覆盖；/engines 返回含 apiKey，探测把非401/403错误视可用，readJsonBody 异常分支引用未定义 res。详见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 朗读插件给桌面 DSH 用户带来什么交付？](#detail-section-11)
  - [Q02 · 从文本流到可取消播放如何工作？](#detail-section-12)
  - [Q03 · 云端引擎与自动探测的边界是什么？](#detail-section-13)
  - [Q04 · HTTP 路由的异常处理是否可靠？](#detail-section-14)
  - [Q05 · 什么条件下可以小范围使用或复用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：桌面会话的听读辅助与等待反馈，适合可联网/可播放音频的本机环境。详见[Q01](#research-q01)。

手工播放 TTS 或浏览器读屏可替代；插件优化流式交互但需承担音频追赶丢句。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 流式朗读 | 边生成边听 | 积压丢旧句 |
| 随读随停 | 不播旧 epoch | 合成请求不一定取消 |
| 云端配置 | 扩展音色 | 本机明文密钥与路由权限 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH webServer/llm stream | 必需 | 宿主流/路由 | 无朗读 |
| Edge TTS 网络 | 默认必需 | 默认语音 | 失效则无默认音频 |
| 云端 Key/余额 | 可选 | 替换引擎 | 云请求失败 |
| 浏览器自动播放 | 必需 | 出声 | 可能被拦截 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | 构建/pack 到 DSH | 浮条和路由出现 |
| 试听 | 用 Edge 文本长回复 | 音频/字幕同步 |
| 中断 | 停止与再发问 | 旧句不播出 |
| 云端 | 添加密钥/模型 | 权限和计费对账 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH 桌面/构建依赖 | 配浮条/音色 | 兼容未测 |
| 合成 | Edge 网络或云端计费 | 调语速/音量 | 延时与金额未知 |
| 恢复 | 重新选引擎/检查日志 | 检查权限与取消 | 后台请求仍可能完成 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 边输出边朗读 | tap+队列+SSE | 实际延时 |
| 停止 | epoch 丢旧结果 | 请求/费用取消 |
| 云端引擎 | 声明与双路径 | 所有服务兼容 |

> **思考**：朗读音频不是完整覆盖；/engines 返回含 apiKey，探测把非401/403错误视可用，readJsonBody 异常分支引用未定义 res。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把桌面浮条、等待语音和可替换 TTS 引擎接入 DSH 文本流。详见[Q01](#research-q01)。

把桌面浮条、等待语音和可替换 TTS 引擎接入 DSH 文本流。详见[Q01](#research-q01)。

分句与队列分层清楚，但音频背压有损且路由错误/凭据边界需收紧。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

朗读音频不是完整覆盖；/engines 返回含 apiKey，探测把非401/403错误视可用，readJsonBody 异常分支引用未定义 res。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离桌面试听 Edge，再用受控云密钥验证长回复、中断、权限与费用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持主要管线；语音队列丢旧句、取消不终止合成、云端密钥返回/保存与异常分支缺口；目标运行未核。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/speak-queue.ts、src/settings-store.ts、src/providers/openai-tts.provider.ts、src/segmenter.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、src/index.ts、src/speak-queue.ts、src/settings-store.ts、src/providers/openai-tts.provider.ts 等；未执行插件或目标宿主。旧 META 仅复用。
- 下一步：目标桌面试长回复、短句、取消后网络请求、云端404/500探测、GET /engines 权限及路由异常。

**分析版本**

- **仓库**：[2021Heei/dsh-tts-flash](https://github.com/2021Heei/dsh-tts-flash)
- **版本号**：0.1.0（[固定提交 a23020b](https://github.com/2021Heei/dsh-tts-flash/tree/a23020b72a5c403e3dc50527b3ef43c6e55c739a)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为传播取消信号、引擎列表脱敏、成功码探测和统一同步/异步路由错误处理。详见[Q05](#research-q05)。

目标桌面试长回复、短句、取消后网络请求、云端404/500探测、GET /engines 权限及路由异常。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 88 | 65 | 15 | — |
| .md | source | 1 | 138 | — | — | 1535 |
| .ts | source | 9 | 2129 | 1602 | 385 | — |
| .tsx | source | 2 | 1864 | 1609 | 179 | — |
| .mjs | test | 3 | 250 | 190 | 34 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2021Heei/dsh-tts-flash/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌面语音朗读在低延时、中断、云引擎凭据和异常路径上能否稳定交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 朗读插件给桌面 DSH 用户带来什么交付？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件旁路监听 llm/stream 的文本增量，分句/合并后串行合成音频，经本地 SSE 给浏览器浮条播放，等待模型输出时播报缓存短语。内置 Edge TTS，也支持配置 OpenAI 兼容云服务；适用桌面阅读辅助与听读，不等于离线或无成本。作者称流式朗读、随读随停；源码确实原样 yield 模型 chunk，但语音播报有独立积压/取消规则。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-25](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/README.md#L7-L25)

作者功能和适用场景

<details>
<summary>查看原文（19行）</summary>

```text
给 DeepSeek Harness（DSH）桌面端做的 **LLM 回复语音朗读插件**：AI 边流式输出，本地边把句子合成语音播放，随读随停；AI 思考等待期间还有"文字+语音"双通道的趣味短语反馈。

- **零配置可用**：内置微软 edge-tts，能联网就能用（几十种音色）
- **云端引擎即插即用**：任何 OpenAI 兼容 TTS 服务（OpenAI / 小米 MiMo / 硅基流动…）在设置面板里填 baseURL + API Key + 模型 id 即可添加，双协议自适应
- **等待期语音**：模型思考时浮条轮换趣味短语并同步朗读（"让子弹飞一会…"），等待不再干瞪眼

---

## 功能总览

| 模块 | 说明 |
|---|---|
| 无损流式朗读 | `llm/stream` 旁路 tap → 中英日分句 → 短句合并 → 串行合成 → SSE 推送；队列带背压上限，长回复自动追赶 |
| 多引擎 | edge-tts（内置）+ OpenAI 兼容云端 TTS（双协议自适应：`/audio/speech` → `chat/completions`） |
| 引擎即插即用 | 设置面板二级弹窗添加，或往 `~/.dsh/tts-flash/engines/` 放一个 JSON 声明自动出现 |
| 等待期语音体系 | AI 思考时轮换 5 条内置趣味短语（**文字+语音同步**，host 统一驱动）；语音按「模型-音色」前缀缓存只生成一次；等待语音模型可独立选择（默认 Edge 小艺） |
| 语音设置面板 | 朗读开关 / 语音模型 / 音量 / 语速 / 字幕流光与字号 / 云端引擎管理（二级弹窗）/ 试听区，全部实时生效 |
| 朗读悬浮条 | 纯文字胶囊，可拖动、位置记忆（相对聊天输入框锚点，窗口缩放自动适应）、长句单程滚动字幕（滚动时长 = 真实音频时长） |
| 持久化 | 运行时设置独立 JSON 文件，重启、重装插件均不丢失 |
```

</details>

**依据 2 · 源码核查**：[src/index.ts:921-978](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/index.ts#L921-L978)

旁路文本流

<details>
<summary>查看原文（58行）</summary>

```text
  // ---- llm/stream lossless tap → segment → enqueue ----
  const sessionSegmenters = new Map<string, SentenceSegmenter>()

  ctx.on('llm/stream', (options: GenerateOptions, next: () => AsyncIterable<StreamChunk>) => {
    const sessionId = options.sessionId
    // Read the live setting so the panel's toggle takes effect immediately.
    if (!settings.enabled || sessionId === undefined) return next()
    // The model is chewing: start the voiced phrase loop (text + matching
    // audio per switch) until the first real sentence takes the queue or the
    // stream ends.
    broadcast('status', { phase: 'thinking' })
    startThinkingLoop(sessionId)
    return tapStream(sessionId, next(), queue, sessionSegmenters, () => {
      stopThinkingLoop(sessionId)
      broadcast('status', { phase: 'idle' })
    })
  })
}

async function* tapStream(
  sessionId: string,
  inner: AsyncIterable<StreamChunk>,
  queue: SpeakQueue,
  sessionSegmenters: Map<string, SentenceSegmenter>,
  onDone: () => void,
): AsyncIterable<StreamChunk> {
  const segmenter = new SentenceSegmenter()
  const grouper = new SentenceGrouper()
  sessionSegmenters.set(sessionId, segmenter)
  let flushed = false
  let finishReason: unknown = null
  const flushOnce = (): void => {
    if (flushed) return
    flushed = true
    for (const s of segmenter.flush())
      for (const g of grouper.push(s)) queue.enqueue(sessionId, g)
    for (const g of grouper.flush()) queue.enqueue(sessionId, g)
  }
  try {
    for await (const chunk of inner) {
      if (chunk.type === 'text-delta' && chunk.text) {
        for (const s of segmenter.feed(chunk.text))
          for (const g of grouper.push(s)) queue.enqueue(sessionId, g)
      }
      if (chunk.type === 'finish') finishReason = chunk.reason
      yield chunk
    }
  } finally {
    // A user stop aborts the turn: the trailing half-sentence is exactly what
    // the user interrupted, so it must not be spoken.
    const aborted =
      finishReason !== null &&
      typeof finishReason === 'object' &&
      (finishReason as { kind?: unknown }).kind === 'aborted'
    if (!aborted) flushOnce()
    sessionSegmenters.delete(sessionId)
    onDone()
  }
```

</details>

**依据 3 · 源码核查**：[src/speak-queue.ts:84-110](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/speak-queue.ts#L84-L110)

语音入队和背压

<details>
<summary>查看原文（27行）</summary>

```text
  /** Enqueue one sentence for a session; starts the pump if idle. */
  enqueue(sessionId: string, text: string): void {
    let q = this.queues.get(sessionId)
    if (!q) {
      q = { pending: [], busy: false, seq: 0, epoch: 0 }
      this.queues.set(sessionId, q)
    }
    // Back-pressure: cap the per-session queue so a very long reply cannot
    // pile up unbounded; the oldest sentence is dropped and playback chases
    // the live output.
    while (q.pending.length >= MAX_PENDING) q.pending.shift()
    q.pending.push({ text, epoch: q.epoch })
    this.opts.onTextEnqueue?.(sessionId)
    void this.pump(sessionId, q)
  }

  /** Enqueue one PRE-SYNTHESIZED sentence (thinking phrase from disk cache):
   *  the pump broadcasts it as-is without calling the TTS engine. */
  enqueueAudio(sessionId: string, text: string, audio: Buffer, mime: string): void {
    let q = this.queues.get(sessionId)
    if (!q) {
      q = { pending: [], busy: false, seq: 0, epoch: 0 }
      this.queues.set(sessionId, q)
    }
    while (q.pending.length >= MAX_PENDING) q.pending.shift()
    q.pending.push({ text, epoch: q.epoch, audio, mime })
    void this.pump(sessionId, q)
```

</details>

#### 缺口

- 目标桌面浏览器自动播放和 TTS 音质未测
  **影响**：不能据源码断言朗读体验/时延
  **进一步探讨**：目标桌面多语种长回复与中断试听

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从文本流到可取消播放如何工作？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

每会话 SentenceSegmenter/短句合并形成语句，再入 SpeakQueue；每会话队列上限12，满时丢最旧句，泵串行 await provider.synthesize 后把字节转 base64 帧广播。cancel 递增 epoch 清待播句，正在合成的结果完成后被丢弃，但并未将 AbortSignal 传给 TTS 请求，网络合成仍可能继续耗时/计费。故“无损”仅为原模型输出流，音频为追赶实时性的有损覆盖。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:99-126](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/index.ts#L99-L126)

合并门槛

<details>
<summary>查看原文（28行）</summary>

```text
// ---- short-sentence coalescing before synthesis ---------------------------
// "好。" / "明白。" each triggering a full engine request is slow and choppy
// on local engines. Strong terminal punctuation releases the buffer once it
// holds a readable amount (>= STRONG_MIN); weak endings accumulate to
// SOFT_LIMIT; anything reaches HARD_LIMIT. Stream end always flushes.
const STRONG_END = /[。！？!?…；;]$/
const HARD_LIMIT = 60
const STRONG_MIN = 12
const SOFT_LIMIT = 40

class SentenceGrouper {
  private buf = ''
  push(sentence: string): string[] {
    this.buf += sentence
    if (this.buf.length >= HARD_LIMIT) return this.take()
    if (this.buf.length >= STRONG_MIN && STRONG_END.test(this.buf)) return this.take()
    if (this.buf.length >= SOFT_LIMIT) return this.take()
    return []
  }
  flush(): string[] {
    return this.take()
  }
  private take(): string[] {
    const out = this.buf ? [this.buf] : []
    this.buf = ''
    return out
  }
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:940-978](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/index.ts#L940-L978)

透传原 chunk

<details>
<summary>查看原文（39行）</summary>

```text
async function* tapStream(
  sessionId: string,
  inner: AsyncIterable<StreamChunk>,
  queue: SpeakQueue,
  sessionSegmenters: Map<string, SentenceSegmenter>,
  onDone: () => void,
): AsyncIterable<StreamChunk> {
  const segmenter = new SentenceSegmenter()
  const grouper = new SentenceGrouper()
  sessionSegmenters.set(sessionId, segmenter)
  let flushed = false
  let finishReason: unknown = null
  const flushOnce = (): void => {
    if (flushed) return
    flushed = true
    for (const s of segmenter.flush())
      for (const g of grouper.push(s)) queue.enqueue(sessionId, g)
    for (const g of grouper.flush()) queue.enqueue(sessionId, g)
  }
  try {
    for await (const chunk of inner) {
      if (chunk.type === 'text-delta' && chunk.text) {
        for (const s of segmenter.feed(chunk.text))
          for (const g of grouper.push(s)) queue.enqueue(sessionId, g)
      }
      if (chunk.type === 'finish') finishReason = chunk.reason
      yield chunk
    }
  } finally {
    // A user stop aborts the turn: the trailing half-sentence is exactly what
    // the user interrupted, so it must not be spoken.
    const aborted =
      finishReason !== null &&
      typeof finishReason === 'object' &&
      (finishReason as { kind?: unknown }).kind === 'aborted'
    if (!aborted) flushOnce()
    sessionSegmenters.delete(sessionId)
    onDone()
  }
```

</details>

**依据 3 · 源码核查**：[src/speak-queue.ts:65-110](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/speak-queue.ts#L65-L110)

队列满丢旧句

<details>
<summary>查看原文（46行）</summary>

```text
/** Max queued sentences per session before the oldest is dropped. */
const MAX_PENDING = 12

export class SpeakQueue {
  private readonly queues = new Map<string, SessionQueue>()
  private readonly listeners = new Set<FrameListener>()
  private readonly opts: SpeakQueueOptions

  constructor(opts: SpeakQueueOptions) {
    this.opts = opts
  }

  subscribe(listener: FrameListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Enqueue one sentence for a session; starts the pump if idle. */
  enqueue(sessionId: string, text: string): void {
    let q = this.queues.get(sessionId)
    if (!q) {
      q = { pending: [], busy: false, seq: 0, epoch: 0 }
      this.queues.set(sessionId, q)
    }
    // Back-pressure: cap the per-session queue so a very long reply cannot
    // pile up unbounded; the oldest sentence is dropped and playback chases
    // the live output.
    while (q.pending.length >= MAX_PENDING) q.pending.shift()
    q.pending.push({ text, epoch: q.epoch })
    this.opts.onTextEnqueue?.(sessionId)
    void this.pump(sessionId, q)
  }

  /** Enqueue one PRE-SYNTHESIZED sentence (thinking phrase from disk cache):
   *  the pump broadcasts it as-is without calling the TTS engine. */
  enqueueAudio(sessionId: string, text: string, audio: Buffer, mime: string): void {
    let q = this.queues.get(sessionId)
    if (!q) {
      q = { pending: [], busy: false, seq: 0, epoch: 0 }
      this.queues.set(sessionId, q)
    }
    while (q.pending.length >= MAX_PENDING) q.pending.shift()
    q.pending.push({ text, epoch: q.epoch, audio, mime })
    void this.pump(sessionId, q)
```

</details>

**依据 4 · 源码核查**：[src/speak-queue.ts:119-130](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/speak-queue.ts#L119-L130)

epoch 取消

<details>
<summary>查看原文（12行）</summary>

```text
  /**
   * Drop all pending sentences and invalidate the in-flight synthesis for
   * one session (stop / barge-in). Sentences enqueued after this call get
   * the new epoch and play normally.
   */
  cancel(sessionId: string): void {
    const q = this.queues.get(sessionId)
    if (q) {
      q.epoch++
      q.pending.length = 0
    }
  }
```

</details>

**依据 5 · 源码核查**：[src/speak-queue.ts:155-183](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/speak-queue.ts#L155-L183)

合成完丢失过期结果

<details>
<summary>查看原文（29行）</summary>

```text
  private async pump(sessionId: string, q: SessionQueue): Promise<void> {
    if (q.busy) return
    q.busy = true
    try {
      const provider = this.opts.resolveProvider()
      while (q.pending.length > 0) {
        const item = q.pending.shift()!
        try {
          const buf =
            item.audio ?? (await provider.synthesize(item.text, this.synthOptions(this.opts.voice)))
          // Barge-in happened while this sentence was synthesizing: drop it.
          if (item.epoch !== q.epoch) continue
          const frame: VoiceFrame = {
            sessionId,
            seq: q.seq++,
            text: item.text,
            audio: buf.toString('base64'),
            mime: item.mime ?? provider.outputFormat,
          }
          for (const fn of this.listeners) {
            try {
              fn(frame)
            } catch {
              // listener errors must not kill the pump
            }
          }
        } catch (e) {
          // One failed sentence must not stop the queue; report and continue.
          console.warn(`[tts-flash] synthesis failed: ${String(e)}`)
```

</details>

#### 缺口

- 目标 Provider 对中止/费用的行为未测
  **影响**：停止后后台网络仍可能完成并产生成本
  **进一步探讨**：长回复与中断观察实际请求/音频覆盖

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 云端引擎与自动探测的边界是什么？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

添加引擎时把 baseUrl/API Key/model 写入 ~/.dsh/tts-flash/engines/*.json，未见文件权限硬化；GET /engines 原样返回 loadEngineDeclarations，包含 apiKey，依赖宿主 Web 路由访问控制，插件自身无鉴权。OpenAI provider 的 isAvailable 只要 /models 状态不是401/403就认为可用，404/500 也可能误判；合成时仅在 /audio/speech 返回404后切 chat/completions，并记住该路径。声音请求的 60/120 秒超时及失败重试成本需验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-57](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/README.md#L39-L57)

作者引擎配置/密钥存储

<details>
<summary>查看原文（19行）</summary>

````text
### 引擎

- **Edge TTS（默认）**：零配置，音色几十种（晓晓/云希/小艺…），「语音模型」下拉选择即可
- **添加云端引擎**：设置面板「云端引擎」按钮 → 弹窗填 baseURL、API Key、模型 id（别名可选，默认与模型 id 一致）→ 点「添加」。模型 id 必须与厂商文档完全一致（如 MiMo 全小写）
- 也可以不经过面板：往 `~/.dsh/tts-flash/engines/` 放一个 JSON 声明：

```json
{
  "id": "my-engine",
  "label": "我的引擎",
  "kind": "openai",
  "url": "https://api.example.com/v1",
  "apiKey": "sk-...",
  "model": "tts-model-id",
  "stylePrompt": "可选：音色描述/风格指令（voicedesign 类模型需要）"
}
```

- API Key 保存在本机 `~/.dsh/tts-flash/engines/`（单用户本机场景）；请勿把该目录内容分享给他人
````

</details>

**依据 2 · 源码核查**：[src/settings-store.ts:151-176](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/settings-store.ts#L151-L176)

加载完整声明含 apiKey

<details>
<summary>查看原文（26行）</summary>

```text
export function loadEngineDeclarations(): EngineDeclaration[] {
  if (!existsSync(ENGINES_DIR)) return []
  let files: string[] = []
  try {
    files = readdirSync(ENGINES_DIR).filter((f) => f.toLowerCase().endsWith('.json'))
  } catch {
    return []
  }
  const out: EngineDeclaration[] = []
  for (const file of files) {
    const raw = readJson(join(ENGINES_DIR, file)) as Partial<EngineDeclaration> | undefined
    if (!raw || typeof raw.id !== 'string' || typeof raw.url !== 'string') {
      console.warn(`[tts-flash] ignoring malformed engine file: ${file}`)
      continue
    }
    const rawKind = raw.kind === 'openai' ? 'openai' : 'sidecar'
    out.push({
      id: raw.id,
      label: typeof raw.label === 'string' && raw.label ? raw.label : raw.id,
      url: raw.url,
      kind: rawKind,
      apiKey: typeof raw.apiKey === 'string' ? raw.apiKey : undefined,
      model: typeof raw.model === 'string' ? raw.model : undefined,
      voice: typeof raw.voice === 'string' ? raw.voice : undefined,
      stylePrompt: typeof raw.stylePrompt === 'string' ? raw.stylePrompt : undefined,
    })
```

</details>

**依据 3 · 源码核查**：[src/settings-store.ts:193-204](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/settings-store.ts#L193-L204)

写 JSON 声明

<details>
<summary>查看原文（12行）</summary>

```text
/** Write/update one engine declaration (used by tests + future UI). */
export function saveEngineDeclaration(decl: EngineDeclaration): void {
  try {
    ensureDir(ENGINES_DIR)
    writeFileSync(
      join(ENGINES_DIR, `${decl.id.replace(/[^\w.-]+/g, '_')}.json`),
      `${JSON.stringify(decl, null, 2)}\n`,
      'utf8',
    )
  } catch (e) {
    console.warn(`[tts-flash] could not write engine file: ${String(e)}`)
  }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:872-918](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/index.ts#L872-L918)

HTTP 增加/返回引擎

<details>
<summary>查看原文（47行）</summary>

```text
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: `${base}/engines`,
      handler: (req: unknown, res: ServerResponse) => {
        const method = (req as { method?: string }).method ?? 'GET'
        if (method !== 'POST') {
          sendJson(res, 200, { ok: true, engines: loadEngineDeclarations() })
          return
        }
        readJsonBody(req, (body) => {
          const alias = typeof body.alias === 'string' ? body.alias.trim() : ''
          const baseUrl = typeof body.baseUrl === 'string' ? body.baseUrl.trim() : ''
          const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : ''
          const model = typeof body.model === 'string' ? body.model.trim() : ''
          const voice = typeof body.voice === 'string' ? body.voice.trim() : ''
          if (!baseUrl || !apiKey || !model) {
            sendJson(res, 400, { ok: false, error: 'baseUrl / apiKey / model 必填' })
            return
          }
          if (!/^https?:\/\//i.test(baseUrl)) {
            sendJson(res, 400, { ok: false, error: 'baseUrl 必须以 http(s):// 开头' })
            return
          }
          // Alias is optional: when empty the model id doubles as the display
          // name (and the id source).
          const label = alias || model
          const id = label.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
          if (!id) {
            sendJson(res, 400, { ok: false, error: '别名/模型 id 需包含字母或数字' })
            return
          }
          saveEngineDeclaration({
            id,
            label,
            url: baseUrl,
            kind: 'openai',
            apiKey,
            model,
            voice: voice || undefined,
          })
          refreshEngine()
          enginesCache = null
          sendJson(res, 200, { ok: true, id, label })
        })
      },
    }),
```

</details>

**依据 5 · 源码核查**：[src/providers/openai-tts.provider.ts:79-118](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/providers/openai-tts.provider.ts#L79-L118)

404 回退与语音请求

<details>
<summary>查看原文（40行）</summary>

```text
  async synthesize(text: string, opts?: SynthesizeOptions): Promise<Buffer> {
    const voice = opts?.voice || this.defaultVoice
    const rate = opts?.rate ?? 0
    if (!this.chatStyle) {
      try {
        return await this.speechRequest(text, voice)
      } catch (e) {
        // 404 = the vendor has no /audio/speech endpoint (e.g. 小米 MiMo);
        // fall back to the chat/completions protocol and remember it.
        if (e instanceof SpeechHttpError && e.status === 404) {
          this.chatStyle = true
        } else {
          throw e
        }
      }
    }
    return this.chatRequest(text, voice, rate)
  }

  /** OpenAI standard: POST /audio/speech → raw audio bytes. */
  private async speechRequest(text: string, voice: string): Promise<Buffer> {
    const res = await fetch(`${this.baseUrl}/audio/speech`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        input: text,
        voice: voice || 'alloy',
        response_format: 'mp3',
      }),
      // A hung vendor must not hold the playback queue forever.
      signal: AbortSignal.timeout(60_000),
    })
    if (!res.ok) throw new SpeechHttpError(res.status, (await res.text()).slice(0, 200))
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length === 0) throw new Error('openai-tts returned empty audio')
    return buf
```

</details>

**依据 6 · 源码核查**：[src/providers/openai-tts.provider.ts:195-205](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/providers/openai-tts.provider.ts#L195-L205)

可用性探测

<details>
<summary>查看原文（11行）</summary>

```text
  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: { authorization: `Bearer ${this.apiKey}` },
        signal: AbortSignal.timeout(3000),
      })
      return res.status !== 401 && res.status !== 403
    } catch {
      return false
    }
  }
```

</details>

#### 缺口

- 宿主路由访问控制与文件 ACL 未实测
  **影响**：凭据暴露与可用性误报风险需按目标环境判定
  **进一步探讨**：目标主机检查 GET 路由权限/文件权限及404/500探测

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · HTTP 路由的异常处理是否可靠？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

readJsonBody 把请求数据累加后调用 done(body)，同步异常分支试图使用标识符 res 设500，但该辅助函数参数只有 req/done，函数体内无 res 声明；若同步 done 抛错，响应尝试会触发 ReferenceError，继而被紧邻的内层 catch 吞掉，无法完成预期 500 回包；不能将此说成 ReferenceError 必然逃逸使宿主崩溃。另回调常是 async，外层同步 try/catch 不能捕捉其 Promise 拒绝。真实异常触发条件与宿主进程结果未跑；这是固定源码的失败路径缺口，不应把正常请求等同已故障。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:442-470](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/index.ts#L442-L470)

readJsonBody 异常分支引用未定义 res

<details>
<summary>查看原文（29行）</summary>

```text
  const readJsonBody = (req: unknown, done: (body: Record<string, unknown>) => void): void => {
    const chunks: Buffer[] = []
    const r = req as {
      on: (e: string, fn: ((c: Buffer) => void) | (() => void)) => void
    }
    r.on('data', (c: Buffer) => chunks.push(c))
    r.on('end', () => {
      let body: Record<string, unknown> = {}
      try {
        const parsed = JSON.parse(Buffer.concat(chunks).toString() || '{}') as unknown
        if (parsed && typeof parsed === 'object') body = parsed as Record<string, unknown>
      } catch {
        // malformed body → treat as empty patch
      }
      // A handler bug here is a synchronous throw inside a stream 'end'
      // handler — that crashes the whole host process. Contain it.
      try {
        done(body)
      } catch (e) {
        console.error('[tts-flash] route handler failed:', e)
        try {
          res.statusCode = 500
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: 'internal error' }))
        } catch {
          // response may already be gone
        }
      }
    })
```

</details>

**依据 2 · 源码核查**：[src/index.ts:557-569](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/index.ts#L557-L569)

async config 回调作为 done

<details>
<summary>查看原文（13行）</summary>

```text
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: `${base}/config`,
      // The host router matches on path only (no method field), so GET/POST
      // share this route and branch on req.method.
      handler: async (req: unknown, res: ServerResponse) => {
        const method = (req as { method?: string }).method ?? 'GET'
        if (method !== 'POST') {
          sendJson(res, 200, await snapshot())
          return
        }
        readJsonBody(req, async (body) => {
```

</details>

**依据 3 · 源码核查**：[src/index.ts:872-882](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/index.ts#L872-L882)

引擎回调路径

<details>
<summary>查看原文（11行）</summary>

```text
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: `${base}/engines`,
      handler: (req: unknown, res: ServerResponse) => {
        const method = (req as { method?: string }).method ?? 'GET'
        if (method !== 'POST') {
          sendJson(res, 200, { ok: true, engines: loadEngineDeclarations() })
          return
        }
        readJsonBody(req, (body) => {
```

</details>

#### 缺口

- 目标宿主异常注入未做
  **影响**：路由错误时可能挂请求/未处理拒绝
  **进一步探讨**：隔离 mock 请求让同步/异步 handler 失败核验

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件下可以小范围使用或复用？

**研究主题**：采用判断、新假设与验证、依赖、兼容与流程

#### 完整回答

在桌面 DSH 隔离 profile 中先用内置 Edge TTS 验证 SSE/自动播放/中断，再用受控云端密钥测试兼容协议、超时及成本；仅向可信本机设置界面暴露 /engines，并对 engines 目录做最小权限。复用价值在旁路 tap、分句与 epoch 队列；接入关键是清楚说明“有损语音追赶”。可改进为取消向 provider 传信号、GET /engines 脱敏、探测只认成功码、修复异常处理；均未实现，需最小验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-35](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/README.md#L27-L35)

作者安装/构建

````text
## 安装

```sh
npm install && node build.mjs && npm test   # 构建 + 单测
npm pack                                    # → dsh-tts-flash-0.1.0.tgz
# 用 DSH 的插件安装流程注册该 tgz（cordis.patch.yml 会把 host 引擎 + 客户端浮条注入 profile）
```

日常迭代最快路径：把 `lib/*.js` 覆盖复制到 `~/.dsh/profiles/desktop/node_modules/dsh-tts-flash/lib/` 再重启应用。
````

**依据 2 · 作者声明**：[README.md:129-134](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/README.md#L129-L134)

作者已知限制

```text
## 已知限制

- 未点开过页面前浏览器可能拦截有声自动播放（DSH 内发过一条消息后即解除）。
- edge-tts 是微软未公开接口：无 SLA，断网即不可用；语速服务端封顶 +100%。
- client 的 `BASE` 与 host `basePath` 默认值绑定（`/dsh-tts-flash`），改 host 配置需同步 client。
- 桌面端 web server 只放行 DSH 渲染进程的请求（外部 curl 一律 forbidden，属正常）。
```

**依据 3 · 源码核查**：[src/index.ts:921-978](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/index.ts#L921-L978)

旁路流机制

<details>
<summary>查看原文（58行）</summary>

```text
  // ---- llm/stream lossless tap → segment → enqueue ----
  const sessionSegmenters = new Map<string, SentenceSegmenter>()

  ctx.on('llm/stream', (options: GenerateOptions, next: () => AsyncIterable<StreamChunk>) => {
    const sessionId = options.sessionId
    // Read the live setting so the panel's toggle takes effect immediately.
    if (!settings.enabled || sessionId === undefined) return next()
    // The model is chewing: start the voiced phrase loop (text + matching
    // audio per switch) until the first real sentence takes the queue or the
    // stream ends.
    broadcast('status', { phase: 'thinking' })
    startThinkingLoop(sessionId)
    return tapStream(sessionId, next(), queue, sessionSegmenters, () => {
      stopThinkingLoop(sessionId)
      broadcast('status', { phase: 'idle' })
    })
  })
}

async function* tapStream(
  sessionId: string,
  inner: AsyncIterable<StreamChunk>,
  queue: SpeakQueue,
  sessionSegmenters: Map<string, SentenceSegmenter>,
  onDone: () => void,
): AsyncIterable<StreamChunk> {
  const segmenter = new SentenceSegmenter()
  const grouper = new SentenceGrouper()
  sessionSegmenters.set(sessionId, segmenter)
  let flushed = false
  let finishReason: unknown = null
  const flushOnce = (): void => {
    if (flushed) return
    flushed = true
    for (const s of segmenter.flush())
      for (const g of grouper.push(s)) queue.enqueue(sessionId, g)
    for (const g of grouper.flush()) queue.enqueue(sessionId, g)
  }
  try {
    for await (const chunk of inner) {
      if (chunk.type === 'text-delta' && chunk.text) {
        for (const s of segmenter.feed(chunk.text))
          for (const g of grouper.push(s)) queue.enqueue(sessionId, g)
      }
      if (chunk.type === 'finish') finishReason = chunk.reason
      yield chunk
    }
  } finally {
    // A user stop aborts the turn: the trailing half-sentence is exactly what
    // the user interrupted, so it must not be spoken.
    const aborted =
      finishReason !== null &&
      typeof finishReason === 'object' &&
      (finishReason as { kind?: unknown }).kind === 'aborted'
    if (!aborted) flushOnce()
    sessionSegmenters.delete(sessionId)
    onDone()
  }
```

</details>

**依据 4 · 源码核查**：[src/speak-queue.ts:65-130](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/speak-queue.ts#L65-L130)

队列与取消边界

<details>
<summary>查看原文（66行）</summary>

```text
/** Max queued sentences per session before the oldest is dropped. */
const MAX_PENDING = 12

export class SpeakQueue {
  private readonly queues = new Map<string, SessionQueue>()
  private readonly listeners = new Set<FrameListener>()
  private readonly opts: SpeakQueueOptions

  constructor(opts: SpeakQueueOptions) {
    this.opts = opts
  }

  subscribe(listener: FrameListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Enqueue one sentence for a session; starts the pump if idle. */
  enqueue(sessionId: string, text: string): void {
    let q = this.queues.get(sessionId)
    if (!q) {
      q = { pending: [], busy: false, seq: 0, epoch: 0 }
      this.queues.set(sessionId, q)
    }
    // Back-pressure: cap the per-session queue so a very long reply cannot
    // pile up unbounded; the oldest sentence is dropped and playback chases
    // the live output.
    while (q.pending.length >= MAX_PENDING) q.pending.shift()
    q.pending.push({ text, epoch: q.epoch })
    this.opts.onTextEnqueue?.(sessionId)
    void this.pump(sessionId, q)
  }

  /** Enqueue one PRE-SYNTHESIZED sentence (thinking phrase from disk cache):
   *  the pump broadcasts it as-is without calling the TTS engine. */
  enqueueAudio(sessionId: string, text: string, audio: Buffer, mime: string): void {
    let q = this.queues.get(sessionId)
    if (!q) {
      q = { pending: [], busy: false, seq: 0, epoch: 0 }
      this.queues.set(sessionId, q)
    }
    while (q.pending.length >= MAX_PENDING) q.pending.shift()
    q.pending.push({ text, epoch: q.epoch, audio, mime })
    void this.pump(sessionId, q)
  }

  /** True when the session has nothing queued and no synthesis in flight. */
  isIdle(sessionId: string): boolean {
    const q = this.queues.get(sessionId)
    return !q || (q.pending.length === 0 && !q.busy)
  }

  /**
   * Drop all pending sentences and invalidate the in-flight synthesis for
   * one session (stop / barge-in). Sentences enqueued after this call get
   * the new epoch and play normally.
   */
  cancel(sessionId: string): void {
    const q = this.queues.get(sessionId)
    if (q) {
      q.epoch++
      q.pending.length = 0
    }
  }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:872-918](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/index.ts#L872-L918)

云引擎路由

<details>
<summary>查看原文（47行）</summary>

```text
  ctx.effect(() =>
    ctx.webServer.register({
      kind: 'exact',
      path: `${base}/engines`,
      handler: (req: unknown, res: ServerResponse) => {
        const method = (req as { method?: string }).method ?? 'GET'
        if (method !== 'POST') {
          sendJson(res, 200, { ok: true, engines: loadEngineDeclarations() })
          return
        }
        readJsonBody(req, (body) => {
          const alias = typeof body.alias === 'string' ? body.alias.trim() : ''
          const baseUrl = typeof body.baseUrl === 'string' ? body.baseUrl.trim() : ''
          const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : ''
          const model = typeof body.model === 'string' ? body.model.trim() : ''
          const voice = typeof body.voice === 'string' ? body.voice.trim() : ''
          if (!baseUrl || !apiKey || !model) {
            sendJson(res, 400, { ok: false, error: 'baseUrl / apiKey / model 必填' })
            return
          }
          if (!/^https?:\/\//i.test(baseUrl)) {
            sendJson(res, 400, { ok: false, error: 'baseUrl 必须以 http(s):// 开头' })
            return
          }
          // Alias is optional: when empty the model id doubles as the display
          // name (and the id source).
          const label = alias || model
          const id = label.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
          if (!id) {
            sendJson(res, 400, { ok: false, error: '别名/模型 id 需包含字母或数字' })
            return
          }
          saveEngineDeclaration({
            id,
            label,
            url: baseUrl,
            kind: 'openai',
            apiKey,
            model,
            voice: voice || undefined,
          })
          refreshEngine()
          enginesCache = null
          sendJson(res, 200, { ok: true, id, label })
        })
      },
    }),
```

</details>

#### 缺口

- 目标宿主兼容、实际语音延迟/计费/权限未知
  **影响**：不能直接承诺生产体验或凭据安全
  **进一步探讨**：按长回复、取消、权限、计费矩阵验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
