# dsh-xiaomi-tts

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a45b46f](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/tree/a45b46f5304b29e7db350ad6f119e87bf734017a)

<!-- BEGIN META -->
[![GitHub ★ 56](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=56&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts) [![npm 30d 12,778](https://img.shields.io/static/v1?label=npm+30d&message=12%2C778&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-xiaomi-tts) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-xiaomi-tts)
<!-- END META -->

> **功能**：在 DSH 中用浏览器语音或合成提供商朗读回复，支持音频下载和可选语音设备。

> **亮点**：[Q01](#research-q01) 在回复旁提供朗读与范围选择。[Q03](#research-q03) 将默认引擎、外部注册、音频限制和引擎状态联动。

> **主要限制**：[Q01](#research-q01) 简读可能省略关键条件。[Q04](#research-q04) 能访问 Host 的链接持有者可以下载仍有效的音频。

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
  - [Q01 · 什么情况下朗读保留全文，文字实际送到哪里？](#detail-section-11)
  - [Q02 · 停止播放、上游取消和音频历史各证明什么？](#detail-section-12)
  - [Q03 · 外部引擎接管如何处理所有权、旧任务与本地模型？](#detail-section-13)
  - [Q04 · 合成请求、开放管理与下载有哪些不同权限边界？](#detail-section-14)
  - [Q05 · 怎样验证单次朗读值得保留，同时隔离可选语音入口？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：常需在手头有其他工作时听 DSH 回复的用户，希望可随时停止且仍能回原文。

手工复制到浏览器语音同样可听，插件减少切换并增加范围、流式和交付控制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 回复朗读 | 在当前回复播放 | 检查阅读范围和远端去向 |
| 音频导出 | 保存或下载语音 | 下载链接按登记和期限提供 |
| 引擎接管 | 使用单个已注册外部提供商 | 依赖启用、就绪及宿主权限 |
| 设备识别 | 将设备音频转成文字 | 需配对和识别配置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Host 与 Web 客户端 | 必需 | 合成、播放和设置 | 检查 Node 与 DSH 版本 |
| 模型、凭据或本机语音 | 按所选路径 | 生成音频 | 用公开样本核对提供商 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 隔离 Host 选择单一引擎 | 关闭自动及设备 |
| 播放 | 用户朗读公开回复并停止 | 听对关键句，声音停止 |
| 退出 | 检查历史、下载并关闭 | 发现错发或泄露就回原文 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主及提供商资源 | 配置和核权限 | 实际费用待测 |
| 持续 | 文本合成、缓存和传输 | 核听关键信息 | 无总费用实测 |
| 失败 | 重试、残留音频 | 检查计费和回收 | 取消不保证费用撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 听取回复 | 请求、范围与播放接线 | 完整性和节时 |
| 导出和取消 | Host 导出及信号传播 | 上游计费和历史持久 |

> **思考**：[Q01](#research-q01) 简读可能省略关键条件。[Q04](#research-q04) 能访问 Host 的链接持有者可以下载仍有效的音频。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在回复旁提供朗读与范围选择。[Q03](#research-q03) 将默认引擎、外部注册、音频限制和引擎状态联动。

引擎注册通过单一所有者管理，PCM 对齐和边界校验可复用。播放、提供商生成和历史状态须分别观察。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 简读可能省略关键条件。[Q04](#research-q04) 能访问 Host 的链接持有者可以下载仍有效的音频。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 仅在私人隔离 Host 用公开文本手动试用。关闭自动、设备和外部接管，核对朗读完整、停止和下载。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持音频请求、流、导出和可选设备识别。效果、权限部署和服务商成本尚未实测。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、package.json、src/client/history/audio-history.ts、src/client/index.tsx、src/client/playback/playback-controller.ts、src/host/audio-downloads.ts、src/host/engine-routes.ts、src/host/external-providers.ts、src/host/moss.ts、src/host/open-api-routes.ts、src/host/speech-files.ts、src/host/speech-service.ts、src/host/synthesis-routes.ts、src/host/xiaomi.ts、src/index.ts、src/passport.ts、src/passport/recognition.ts、src/speech-agent.ts、src/text/concise.ts、src/text/scope.ts、src/types/settings.ts、tsdown.config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码抽读 MiMo、范围、流式、外部引擎、MOSS、下载和设备识别。未审计全部适配器或运行插件。
- 下一步：同一公开文本对照听读，检查发送地址、取消、历史、下载过期与异常。

**分析版本**

- **仓库**：[ppy-web/dsh-plugin-xiaomi-mimo-tts](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts)
- **版本号**：5.3.0（[固定提交 a45b46f](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/tree/a45b46f5304b29e7db350ad6f119e87bf734017a)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将请求、到达、播放和保存分别反馈，检验能否降低故障误判及重复请求。

同一公开文本对照听读，检查发送地址、取消、历史、下载过期与异常。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 1433 | — | — | 38460 |
| .cjs | source | 1 | 46 | 44 | 1 | — |
| .ts | source | 173 | 18235 | 16578 | 558 | — |
| .tsx | source | 67 | 7694 | 7212 | 90 | — |
| .js | source | 1 | 2 | 1 | 1 | — |
| .mjs | test | 89 | 13692 | 12823 | 109 | — |
| .ts | example | 1 | 43 | 26 | 7 | — |
| .md | example | 3 | 335 | — | — | 2497 |
| .mjs | source | 9 | 468 | 422 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：读者能否在 DSH 内把回复转为可停止的语音，同时核对朗读完整度、引擎去向与音频保存边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么情况下朗读保留全文，文字实际送到哪里？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合希望边看工作边听已有 DSH 回复的人。相比手工复制到外部朗读工具，插件直接注册回复操作，并在宿主选择提供商。合格结果应能从当前回复启动、听懂关键条件、随时停止，原文仍可查。浏览器语音提供同类替代，支持能力与声音由浏览器和系统决定，不能仅凭界面名称保证离线。

阅读范围区分全文、智能和简读。智能模式自动播放取首段，手动默认为全文；自动截断还可能附提示尾句。简读先解析 Markdown，再按句选择和保留一定依赖关系，超过字符预算时仍会丢段，实时补译范围函数对简读返回空，不应把简读视为完整复述。MiMo 路径用宿主保存的 Bearer 及配置的 baseURL 发 POST，文本和语音参数在请求体。预设模型可走 pcm16 流，VoiceDesign 的这一入口明确拒绝流式。远端处理的发音、语义完整和实际响应时间仍须实听。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:282-295](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/client/index.tsx#L282-L295)

会话回复动作与音频控制器接线。

<details>
<summary>查看原文（14行）</summary>

```text
  registerSlotContribution(ctx, 'conversation.input.dock', () => ctx.slots.register({
    name: 'conversation.input.dock',
    id: 'xiaomi-mimo-tts-session-playback-observer',
    order: 998,
    inject: (_sessionId: string) => ({ playback, live, local, settings: scope, audioFocus, automaticAudioFocus, questions, automaticReading }),
  }, SessionPlaybackObserver))

  registerSlotContribution(ctx, 'conversation.chat.assistant-actions', () => ctx.slots.register({
    name: 'conversation.chat.assistant-actions',
    id: 'xiaomi-mimo-tts',
    order: 20,
    locale: NS,
    inject: (_sessionId: string) => ({ playback, live, local, settings: scope, t, audioFocus, automaticAudioFocus, automaticReading }),
  }, ReadAloudAction))
```

</details>

**依据 2 · 源码核查**：[src/text/scope.ts:44-86](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/text/scope.ts#L44-L86)

阅读范围、自动截断与简读实时路径。

<details>
<summary>查看原文（43行）</summary>

```text
export function applyTtsPlaybackScope(value: string, scope: TtsReadScope, automatic: boolean, random: () => number = Math.random, prepare = prepareTtsText): string {
  if (scope === 'concise') return applyTtsReadScope(value, scope)
  if (prepare !== prepareTtsText) {
    const text = prepare(value)
    if (resolveTtsReadScope(scope, automatic) === 'full') return text
    const scoped = splitTtsSegments(text, undefined, undefined, prepare)[0] ?? ''
    return scope === 'smart' && automatic ? appendTtsSmartTruncationOutro(text, scoped, random) : scoped
  }
  const scoped = applyTtsReadScope(value, resolveTtsReadScope(scope, automatic))
  return scope === 'smart' && automatic
    ? appendTtsSmartTruncationOutro(value, scoped, random)
    : scoped
}

/**
 * Apply the configured playback range to Breeze text without dropping its
 * documented audio tags. Breeze tags are part of the spoken text, so the
 * regular scope helpers (which normalize punctuation away) cannot be used.
 */
export function applyBreezeTtsPlaybackScope(value: string, scope: TtsReadScope, automatic: boolean, random: () => number = Math.random): string {
  if (scope === 'concise') return applyTtsReadScope(value, scope)
  const prepared = prepareBreezeTtsText(value)
  if (prepared.length === 0) return ''
  if (scope === 'full' || (scope === 'smart' && !automatic)) return prepared
  const scoped = splitBreezeTtsSentences(prepared)[0] ?? ''
  return scope === 'smart' && automatic ? appendTtsSmartTruncationOutro(prepared, scoped, random) : scoped
}

/** Apply the configured automatic range while a reply grows, adding Smart's cue only on completion. */
export function applyTtsLivePlaybackScope(
  value: string,
  scope: TtsReadScope,
  limiter: TtsFirstSegmentLimiter,
  final = false,
  random: () => number = Math.random,
  prepare = prepareTtsText,
): string {
  if (scope === 'concise') return ''
  if (resolveTtsReadScope(scope, true) === 'full') return value
  const text = prepare(value)
  const scoped = limiter.limit(text, final)
  return final && scope === 'smart'
    ? appendTtsSmartTruncationOutro(text, scoped, random)
```

</details>

**依据 3 · 源码核查**：[src/text/concise.ts:209-242](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/text/concise.ts#L209-L242)

从原文抽取、有界依赖与弃段。

<details>
<summary>查看原文（34行）</summary>

```text
export function prepareConciseTtsText(markdown: string): string {
  const { blocks, table } = readMarkdown(markdown)
  const fits = (text: string): boolean => text.length <= MAX_CHARACTERS * 2
    && [...text].length <= MAX_CHARACTERS
  if (blocks.length === 0) return fits(table) ? table : ''

  const full = joinSpeech(blocks.flatMap(block => block.map(sentence => sentence.text)))
  if (fits(full)) return full

  const all = blocks.flat()
  const blockPositions = new Map(blocks.flatMap((block, blockIndex) => block.map(sentence => [sentence, blockIndex] as const)))
  const positions = new Map(all.map((sentence, position) => [sentence, position]))
  const lengths = new Map(all.map(sentence => [sentence, sentence.text.length > MAX_CHARACTERS * 2
    ? MAX_CHARACTERS + 1 : [...sentence.text].length]))
  const separators = new Map(all.map(sentence => [sentence, TERMINAL_PUNCTUATION.test(sentence.text.at(-1)!) ? 1 : 2]))
  const speechLength = (group: readonly Sentence[]): number => group.reduce((length, sentence, index) =>
    length + lengths.get(sentence)! + (index === group.length - 1 ? 0 : separators.get(sentence)!), 0)
  const frequency = new Map<string, number>()
  for (const sentence of all) frequency.set(sentence.text, (frequency.get(sentence.text) ?? 0) + 1)

  // Cache bounded dependency groups, including failures, instead of walking each chain again.
  const excerpts = new Map<Sentence, Sentence[] | null>()
  const candidates = all.flatMap((sentence, position) => {
    const antecedent = sentence.dependsOnPrevious ? excerpts.get(sentence.previous!) : []
    const group = antecedent == null ? null : [...antecedent, sentence]
    const valid = group !== null && speechLength(group) <= MAX_CHARACTERS ? group : null
    excerpts.set(sentence, valid)
    if (valid === null) return []
    const block = blockPositions.get(sentence)!
    // Do not let repeated background crowd out the opening or the closing.
    if (!sentence.key && frequency.get(sentence.text)! > 1 && block !== 0 && block !== blocks.length - 1) return []
    return [{ sentence, position, block, group: valid }]
  })
  if (candidates.length === 0) return ''
```

</details>

**依据 4 · 源码核查**：[src/host/xiaomi.ts:11-41](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/xiaomi.ts#L11-L41)

宿主请求、远端文本、完整音频与流式限制。

<details>
<summary>查看原文（31行）</summary>

```text
function request(settings: ResolvedTtsSettings, text: string, format: string, stream: boolean, signal: AbortSignal): Promise<Response> {
  // TTS shares the chat URL, but model-oriented global fetch hooks must not rewrite its messages.
  // Undici keeps the Host's dispatcher (and proxy policy) without using those global fetch hooks.
  return fetch(chatCompletionsEndpoint(settings.apiKey, settings.baseURL), {
    method: 'POST', redirect: 'error', signal,
    headers: { authorization: `Bearer ${settings.apiKey.trim()}`, 'content-type': 'application/json', accept: stream ? 'text/event-stream' : 'application/json', 'user-agent': 'dsh-xiaomi-tts' },
    body: JSON.stringify({
      model: upstreamModel(settings), messages: requestMessages(settings, text),
      audio: settings.model === 'mimo-v2.5-tts-voicedesign' ? { format } : { format, voice: settings.voice }, stream,
    }),
  })
}

export async function synthesizeXiaomi(settings: ResolvedTtsSettings, text: string, format: CompleteAudioFormat, limit: number, controller: AbortController): Promise<Buffer> {
  const response = await request(settings, text, format, false, controller.signal)
  const parsed = await readLimitedXiaomiResponse(response, completeAudioJsonLimit(limit), controller)
  if (!response.ok) throw new TtsProviderError('xiaomi-api-error', apiErrorMessage(response.status, parsed), response.status)
  const audio = parsed?.choices?.[0]?.message?.audio?.data
  if (typeof audio !== 'string' || !audio) throw new TtsProviderError('invalid-xiaomi-response')
  return decodeCompleteAudio(audio, format, limit)
}

export async function streamXiaomi(settings: ResolvedTtsSettings, text: string, signal: AbortSignal): Promise<Response> {
  if (settings.model !== 'mimo-v2.5-tts') throw new TtsProviderError('streaming-model-unsupported', 'Realtime PCM requires the preset Xiaomi model.', 409)
  const response = await request(settings, text, 'pcm16', true, signal)
  if (!response.ok) {
    let parsed: XiaomiAudioResponse | undefined
    try { parsed = await response.json() as XiaomiAudioResponse } catch { /* use status */ }
    throw new TtsProviderError('xiaomi-api-error', apiErrorMessage(response.status, parsed), response.status)
  }
  if (!response.body) throw new TtsProviderError('invalid-xiaomi-response')
```

</details>

#### 缺口

- 未核对真实回复的合格语音及关键条件保留率
  **影响**：不宜用简读代替核对原文
  **进一步探讨**：用公开样本比较全文、智能和简读，听查否定、数字和条件

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 停止播放、上游取消和音频历史各证明什么？

**研究主题**：工程质量与复用、缺陷与关键质疑、功能与机制

#### 完整回答

浏览器可中止当前播放请求，Host 路由监听 aborted 与 close 后取消控制器，默认引擎变更也能取消绑定请求。流式播放中止可以停止后续消费，但已送到上游的文本不会因此撤回，提供商是否立即停合成或计费要看服务侧。Host PCM 路径按字节和时长限制，并对齐 16 位样本；外部流的 chunk 须为 Uint8Array，空流、尾部单字节和能识别到的 WAV 头会失败。音频的生产、播放和保存需要各自验证。

历史采用 IndexedDB，初始化失败会降级到内存，写入异常同样把状态切为 memory。能播完只证明当前浏览器收到可播内容，不能据此判定刷新后仍可找回。保留一段短测试音频后刷新，并核对历史状态。若当前用途要求保留，需要分别验证文件或持久历史路径。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/playback/playback-controller.ts:336-355](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/client/playback/playback-controller.ts#L336-L355)

播放控制清理与请求 abort。

<details>
<summary>查看原文（20行）</summary>

```text
    this.generation += 1
    this.stopCurrent()
    this.segmentedState = null
    this.liveSessions.clear()
    this.completedSessions.clear()
    this.completedMessages.clear()
    this.activeSessionId = null
    this.listeners.clear()
  }

  private stopCurrent(): void {
    this.request?.abort()
    this.request = null
    this.segmentQueue.clear()
    if (this.current !== null) this.releaseCurrentAudio(this.current.audio)
  }

  private releaseCurrentAudio(audio: HTMLAudioElement): void {
    if (this.current?.audio !== audio) return
    const current = this.current
```

</details>

**依据 2 · 源码核查**：[src/host/synthesis-routes.ts:30-64](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/synthesis-routes.ts#L30-L64)

连接关闭、引擎变化和输出缓存约束。

<details>
<summary>查看原文（35行）</summary>

```text
    async handler(req, res) {
      if (req.method !== 'POST') { res.setHeader('allow', 'POST'); json(res, 405, { error: 'method-not-allowed' }); return }
      let settings = resolveTtsSettings(current())
      let effectiveProvider: SpeechProviderId = settings.provider
      const controller = new AbortController()
      let timeout: ReturnType<typeof setTimeout> | undefined
      let disconnected = false
      let offEngine = () => {}
      const abort = () => { disconnected = true; controller.abort() }
      req.once('aborted', abort)
      res.once('close', abort)
      try {
        let body: SynthesizeBody
        try { body = await readJsonBody(req) as SynthesizeBody } catch (error) {
          throw new TtsProviderError(error instanceof Error && error.message === 'request-body-too-large' ? 'request-body-too-large' : 'invalid-json', 'Invalid synthesis request.', error instanceof Error && error.message === 'request-body-too-large' ? 413 : 400)
        }
        if (!body || typeof body !== 'object' || Array.isArray(body)) throw new TtsProviderError('invalid-request', undefined, 400)
        const service = (typeof ctx.get === 'function' ? ctx.get('speechSynthesis') : undefined) as SpeechSynthesisService | undefined
        const request = { ...body, signal: controller.signal } as SpeechRequest
        const selected = service?.resolveProvider(request)
        effectiveProvider = selected ?? settings.provider
        if (service && (body.provider === undefined || body.engineRevision !== undefined)) offEngine = service.subscribeEngine(() => controller.abort(new TtsProviderError('speech-engine-changed', undefined, 409)))
        if (service && selected?.startsWith('external:')) {
          if (!stream && body.format !== undefined && body.format !== 'mp3' && body.format !== 'wav') throw new TtsProviderError('invalid-audio-format', undefined, 400)
          if (stream) {
            await service.streamPcm(request, bytes => {
              if (res.destroyed) throw new TtsProviderError('tts-canceled', undefined, 499)
              if (res.writableLength + bytes.byteLength * 2 > settings.maxPausedPcmBytes) throw new TtsProviderError('stream-buffer-limit')
              if (!res.headersSent) {
                res.setHeader('content-type', 'text/event-stream; charset=utf-8')
                res.setHeader('cache-control', 'no-store'); res.setHeader('x-accel-buffering', 'no')
              }
              res.write(`data: ${JSON.stringify({ choices: [{ delta: { audio: { data: Buffer.from(bytes).toString('base64') } } }] })}\n\n`)
            })
            res.end('data: [DONE]\n\n')
```

</details>

**依据 3 · 源码核查**：[src/host/speech-service.ts:82-130](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/speech-service.ts#L82-L130)

流式上限、样本边界和迭代终止。

<details>
<summary>查看原文（49行）</summary>

```text
  private async streamPcmAudio(request: SpeechRequest, consume: (bytes: Uint8Array) => void | Promise<void>): Promise<void> {
    if (request.maxDurationMs !== undefined && (!Number.isFinite(request.maxDurationMs) || request.maxDurationMs <= 0)) throw new TtsProviderError('invalid-duration-limit', undefined, 400)
    const selected = this.resolveProvider(request)
    if (!selected.startsWith('external:')) {
      const controller = new AbortController()
      const signal = request.signal ? AbortSignal.any([request.signal, controller.signal]) : controller.signal
      this.controllers.add(controller)
      this.defaultJobs.add(controller)
      const timer = setTimeout(() => controller.abort(new TtsProviderError('tts-timeout')), this.current().requestTimeoutMs)
      let size = 0, carry = Buffer.alloc(0)
      try {
        signal.throwIfAborted()
        const prepared = prepareSpeechRequest(this.current(), { ...request, provider: selected })
        await streamSynthesis(prepared.settings, prepared.text, signal, async chunk => {
          size += chunk.length
          if (size > this.current().maxWavAudioBytes) throw new TtsProviderError('audio-too-large')
          if (request.maxDurationMs && size / 48 > request.maxDurationMs) throw new TtsProviderError('speech-too-long')
          const bytes = Buffer.concat([carry, chunk]), end = bytes.length - bytes.length % 2
          carry = bytes.subarray(end)
          if (end) await abortable(Promise.resolve(consume(bytes.subarray(0, end))), signal)
        }, this.runtime)
        if (!size || carry.length) throw new TtsProviderError('invalid-audio-format')
        signal.throwIfAborted()
      } finally { clearTimeout(timer); controller.abort(); this.controllers.delete(controller); this.defaultJobs.delete(controller) }
      return
    }
    return this.track(this.external.run(request, this.current(), async (provider, text, signal, state) => {
      if (!provider.streamPcm) throw new TtsProviderError('streaming-model-unsupported', undefined, 409)
      if (!state.streaming) throw new TtsProviderError('streaming-model-unsupported', undefined, 409)
      if (state.models?.find(model => model.id === (request.model ?? state.selection?.model))?.streaming === false) throw new TtsProviderError('streaming-model-unsupported', undefined, 409)
      const iterator = provider.streamPcm({ text, signal, ...externalRequestOptions(request, state) })[Symbol.asyncIterator]()
      let carry = Buffer.alloc(0)
      let size = 0
      try {
        while (true) {
          const chunk = await abortable(iterator.next(), signal)
          if (chunk.done) break
          if (!(chunk.value instanceof Uint8Array)) throw new TtsProviderError('invalid-audio-format')
          const bytes = Buffer.concat([carry, chunk.value])
          if (!size && bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WAVE') throw new TtsProviderError('invalid-audio-format')
          size += chunk.value.byteLength
          if (request.maxDurationMs && size / 48 > request.maxDurationMs) throw new TtsProviderError('speech-too-long')
          if (size > this.current().maxWavAudioBytes) throw new TtsProviderError('audio-too-large', undefined, 413)
          const aligned = bytes.length - bytes.length % 2
          carry = bytes.subarray(aligned)
          if (aligned) await abortable(Promise.resolve(consume(bytes.subarray(0, aligned))), signal)
        }
        if (!size || carry.length) throw new TtsProviderError('invalid-audio-format')
      } finally { void iterator.return?.().catch(() => {}) }
```

</details>

**依据 4 · 源码核查**：[src/client/history/audio-history.ts:36-49](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/client/history/audio-history.ts#L36-L49)

历史初始化降级。

<details>
<summary>查看原文（14行）</summary>

```text
  private chain: Promise<void>
  private disposed = false
  private storageLoaded = false
  private readonly storage: AudioHistoryStorage

  constructor(storage: AudioHistoryStorage = new IndexedDbAudioHistoryStorage()) {
    this.storage = storage
    this.chain = storage.load().then((entries) => {
      this.storageLoaded = true
      this.publish({ entries: retainAudioHistory(entries), status: 'ready', skipped: false })
    }).catch(() => this.publish({ entries: [], status: 'memory', skipped: false }))
  }

  getSnapshot = (): AudioHistoryView => this.view
```

</details>

**依据 5 · 源码核查**：[src/client/history/audio-history.ts:94-107](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/client/history/audio-history.ts#L94-L107)

写入失败更新 memory 状态。

<details>
<summary>查看原文（14行）</summary>

```text
  }

  private mutate(update: () => void): Promise<void> {
    if (this.disposed) return Promise.resolve()
    this.chain = this.chain.then(async () => {
      update()
      if (!this.storageLoaded) return
      try {
        await this.storage.replace(this.view.entries)
        if (this.view.status === 'memory') this.publish({ ...this.view, status: 'ready' })
      }
      catch { this.publish({ ...this.view, status: 'memory' }) }
    })
    return this.chain
```

</details>

#### 缺口

- 未测服务端实际停止时间、计费或浏览器持久性
  **影响**：停止播放与持久保存均需独立验收
  **进一步探讨**：对比停止后的本地声音、请求日志和可见账单，再刷新查看历史

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 外部引擎接管如何处理所有权、旧任务与本地模型？

**研究主题**：依赖、兼容与流程、工程质量与复用、功能与机制

#### 完整回答

宿主语音服务只接受一个外部提供商，登记要求 API 版本、ID、订阅和合成能力，订阅前先占所有权以抵抗重入，退出时解除。默认配置允许外部提供商，但必须有另一个实际适配器注册并就绪。外部任务按模型能力整理文本、限制长度，并带取消信号；当前引擎或配置切换会影响绑定旧 revision 的请求。配置 POST 校验同源或 Desktop 标志、JSON、提供商和 revision，仍需确认部署侧是否另有身份检查。Host 会检查 PCM 流的类型、对齐和上限，无法推定适配器怎样保存正文或是否正确响应取消。配置变更发出事件供客户端重建状态。

仓库还接入 MOSS 探测和合成，服务基址由配置决定。探测读取健康、预热和音色列表，只能证明对应端点给出响应。实际设备、模型产物、网络地址和可用性由部署提供。浏览器语音、MOSS、本包内置云端和外部适配器的去向应按具体选项核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/types/settings.ts:133-140](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/types/settings.ts#L133-L140)

外部引擎接管开关的默认值。

```text
export const DEFAULT_TTS_SETTINGS: ResolvedTtsSettings = {
  showInSidebar: false,
  showInHostSettings: true,
  showFeatureGuide: true,
  acceptExternalProviders: true,
  qqbotEnabled: false,
  qqbotMaxAutoCharacters: 0,
  qqbotMaxDurationSeconds: 0,
```

**依据 2 · 源码核查**：[src/host/external-providers.ts:116-159](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/external-providers.ts#L116-L159)

唯一注册、重入、就绪和正文限制。

<details>
<summary>查看原文（44行）</summary>

```text
  register(provider: ExternalSpeechProvider): () => void {
    if (this.disposed) throw new TtsProviderError('speech-service-disposed', undefined, 503)
    if (this.active) throw new TtsProviderError('external-provider-conflict', undefined, 409)
    if (!provider || provider.apiVersion !== 1 || !/^external:[a-z0-9][a-z0-9._-]{0,119}$/u.test(provider.id)
      || typeof provider.subscribe !== 'function' || typeof provider.synthesize !== 'function'
      || (provider.streamPcm !== undefined && typeof provider.streamPcm !== 'function')) throw new TtsProviderError('external-provider-invalid', undefined, 400)
    let state: ExternalSpeechProviderSnapshot
    try { state = snapshot(provider) } catch { throw new TtsProviderError('external-provider-invalid', undefined, 400) }
    const entry = { provider, state, off: () => {} }
    // Reserve ownership before subscribing, so reentrant registration cannot overwrite it.
    this.active = entry
    try {
      entry.off = provider.subscribe(() => {
        if (this.active !== entry || this.disposed) return
        try { entry.state = snapshot(provider) } catch { entry.state = { ...entry.state, ready: false, unavailableReason: 'external-provider-invalid' } }
        if (this.enabled) this.changed()
      })
      if (typeof entry.off !== 'function') throw new TtsProviderError('external-provider-invalid', undefined, 400)
    } catch (error) { this.active = undefined; throw externalError(error) }
    if (this.enabled) this.changed()
    return () => {
      if (this.active !== entry) return
      this.active = undefined
      try { entry.off() } finally { if (this.enabled) this.changed() }
    }
  }

  async run<T>(request: SpeechRequest, settings: ResolvedTtsSettings, action: (provider: ExternalSpeechProvider, text: string, signal: AbortSignal, state: SpeechEngineState) => Promise<T>): Promise<T> {
    const entry = this.active
    if (!this.enabled || !entry || (request.provider !== undefined && request.provider !== entry.provider.id)) throw new TtsProviderError('external-provider-unavailable', undefined, 409)
    const state = this.state(settings)!
    if (!state.ready) throw new TtsProviderError(state.unavailableReason ?? 'external-provider-not-ready', undefined, 409)
    if (['voiceDesignPrompt', 'voiceRate'].some(key => request[key as keyof SpeechRequest] !== undefined)) throw new TtsProviderError('external-option-unsupported', undefined, 400)
    externalRequestOptions(request, state)
    if (typeof request.text !== 'string') throw new TtsProviderError('text-required', undefined, 400)
    const model = state.models?.find(model => model.id === (request.model ?? state.selection?.model))
    const text = prepareExternalTtsText(request.text, model?.audioTags?.map(tag => tag.value))
    if (!text.trim()) throw new TtsProviderError('text-required', undefined, 400)
    if (text.length > state.maxTextLength) throw new TtsProviderError('text-too-long', undefined, 413)
    const controller = new AbortController()
    const signal = AbortSignal.any([controller.signal, ...(request.signal ? [request.signal] : [])])
    if (signal.aborted) throw new TtsProviderError('tts-canceled', undefined, 499)
    this.jobs.add(controller)
    const timer = setTimeout(() => controller.abort(new TtsProviderError('tts-timeout', undefined, 504)), settings.requestTimeoutMs)
```

</details>

**依据 3 · 源码核查**：[src/host/speech-service.ts:108-130](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/speech-service.ts#L108-L130)

外部 PCM 校验。

<details>
<summary>查看原文（23行）</summary>

```text
    return this.track(this.external.run(request, this.current(), async (provider, text, signal, state) => {
      if (!provider.streamPcm) throw new TtsProviderError('streaming-model-unsupported', undefined, 409)
      if (!state.streaming) throw new TtsProviderError('streaming-model-unsupported', undefined, 409)
      if (state.models?.find(model => model.id === (request.model ?? state.selection?.model))?.streaming === false) throw new TtsProviderError('streaming-model-unsupported', undefined, 409)
      const iterator = provider.streamPcm({ text, signal, ...externalRequestOptions(request, state) })[Symbol.asyncIterator]()
      let carry = Buffer.alloc(0)
      let size = 0
      try {
        while (true) {
          const chunk = await abortable(iterator.next(), signal)
          if (chunk.done) break
          if (!(chunk.value instanceof Uint8Array)) throw new TtsProviderError('invalid-audio-format')
          const bytes = Buffer.concat([carry, chunk.value])
          if (!size && bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WAVE') throw new TtsProviderError('invalid-audio-format')
          size += chunk.value.byteLength
          if (request.maxDurationMs && size / 48 > request.maxDurationMs) throw new TtsProviderError('speech-too-long')
          if (size > this.current().maxWavAudioBytes) throw new TtsProviderError('audio-too-large', undefined, 413)
          const aligned = bytes.length - bytes.length % 2
          carry = bytes.subarray(aligned)
          if (aligned) await abortable(Promise.resolve(consume(bytes.subarray(0, aligned))), signal)
        }
        if (!size || carry.length) throw new TtsProviderError('invalid-audio-format')
      } finally { void iterator.return?.().catch(() => {}) }
```

</details>

**依据 4 · 源码核查**：[src/host/engine-routes.ts:15-43](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/engine-routes.ts#L15-L43)

配置请求和版本校验入口。

<details>
<summary>查看原文（29行）</summary>

```text
      let allowed = false
      if (origin === undefined) {
        // The desktop shell checks the app origin, then strips browser origin
        // metadata. Cross-site HTML forms cannot set this marker header.
        allowed = req.headers['sec-fetch-site'] === undefined && req.headers[TTS_DESKTOP_WRITE_HEADER] === '1'
      } else {
        try { const parsed = new URL(origin); allowed = ['http:', 'https:'].includes(parsed.protocol) && parsed.host === req.headers.host } catch { /* rejected below */ }
      }
      if (!allowed || ['cross-site', 'same-site'].includes(String(req.headers['sec-fetch-site']))) { json(res, 403, { error: 'cross-origin-denied' }); return }
      if (!String(req.headers['content-type']).startsWith('application/json')) { json(res, 415, { error: 'invalid-content-type' }); return }
      const controller = new AbortController()
      const close = () => { if (!res.writableEnded) controller.abort() }
      res.once('close', close)
      try {
        const body = await readJsonBody(req, 16384) as Record<string, unknown>
        const selection = body?.selection as Record<string, unknown>
        const switching = body?.configurationId !== undefined
        if (!body || typeof body.provider !== 'string' || !body.provider.startsWith('external:') || !Number.isSafeInteger(body.engineRevision)
          || Object.keys(body).some(key => !['provider', 'engineRevision', 'selection', 'configurationId'].includes(key))
          || (switching ? selection !== undefined || typeof body.configurationId !== 'string' || !body.configurationId.trim() || body.configurationId.length > 200
            : !selection || typeof selection.model !== 'string' || typeof selection.voice !== 'string'
              || (selection.speechInstruction !== undefined && typeof selection.speechInstruction !== 'string')
              || Object.keys(selection).some(key => !['model', 'voice', 'speechInstruction'].includes(key)))) {
          json(res, 400, { error: 'external-selection-invalid' }); return
        }
        const state = await ctx.speechSynthesis.configureProvider({ provider: body.provider as `external:${string}`, engineRevision: body.engineRevision as number,
          ...(switching ? { configurationId: body.configurationId as string }
            : { selection: { model: selection.model as string, voice: selection.voice as string, ...(selection.speechInstruction === undefined ? {} : { speechInstruction: selection.speechInstruction as string }) } }), signal: controller.signal })
        json(res, 200, state)
```

</details>

**依据 5 · 源码核查**：[src/host/moss.ts:148-172](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/moss.ts#L148-L172)

MOSS 探测和合成入口。

<details>
<summary>查看原文（25行）</summary>

```text
export async function probeMoss(baseURL: string, signal: AbortSignal): Promise<MossProbeResult> {
  const normalized = normalizeMossBaseURL(baseURL)
  const health = await fetchHealth(normalized, signal)
  const warmup = await fetchWarmup(normalized, signal)
  const voices = await fetchVoices(normalized, signal)
  return { baseURL: normalized, health, warmup, voices }
}

export interface MossSynthesisOptions {
  maxAudioBytes: number
}

/**
 * Synthesize one utterance with the deployed MOSS demo server.
 *
 * `/api/generate` returns a Base64 WAV envelope; the caller owns timeouts and
 * cancellation through `signal`.
 */
export async function synthesizeMoss(baseURL: string, voice: string, text: string, signal: AbortSignal, options: MossSynthesisOptions): Promise<Buffer> {
  const normalized = normalizeMossBaseURL(baseURL)
  const demoId = voice.trim()
  if (demoId.length === 0) throw new TtsProviderError('moss-voice-required', 'Select a MOSS local voice.', 400)

  const form = new FormData()
  form.set('text', text)
```

</details>

#### 缺口

- 未接入任一第三方适配器或真实 MOSS 服务
  **影响**：不能承诺列出的供应商可运行或符合保留策略
  **进一步探讨**：注册一个受控适配器并测切换取消、格式错误及出站目的

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 合成请求、开放管理与下载有哪些不同权限边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

普通合成路由检查方法、JSON、提供商和参数，源码片段内没有开放管理的独立 token 栅栏，外部访问能力还取决于 Host 上游认证和监听范围。开放 API 的管理动作则要求配置独立 token，比较 Bearer 时用恒时比较，并拒绝显式跨站来源。公开导出入口将产物发布为 32 字节随机音频 ID，登记过期时间。下载路由只按合法 ID 查登记产物，不让 ID 直接解析任意文件路径，但没有再次调用同一个 Bearer 栅栏，持有链接且能访问 Host 的调用者可取仍有效的产物。缓存控制和 referrer 策略无法收回已被转发的链接。

Agent 文件模式另外通过 Host exportAudio 写文件，文件用 0600，工具说明返回本地路径并与发送到会话分开。用户需要根据交付方式分别处理浏览器缓存、临时 Host 文件和链接。即使只在私人 Host 试用，也先用低敏文本核对外部目的、token 与过期行为。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/synthesis-routes.ts:26-51](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/synthesis-routes.ts#L26-L51)

普通合成 Handler 检查与开放 token 的边界。

<details>
<summary>查看原文（26行）</summary>

```text
export function registerSynthesisRoutes(ctx: Context, current: () => ResolvedTtsSettings, runtime: { connectDoubao?: NonNullable<DoubaoSessionOptions['connect']> } = {}): void {
  const connection = runtime.connectDoubao ? { connect: runtime.connectDoubao } : {}
  for (const stream of [false, true]) ctx.effect(() => ctx.webServer.register({
    kind: 'exact', path: stream ? TTS_STREAM_ROUTE : TTS_ROUTE,
    async handler(req, res) {
      if (req.method !== 'POST') { res.setHeader('allow', 'POST'); json(res, 405, { error: 'method-not-allowed' }); return }
      let settings = resolveTtsSettings(current())
      let effectiveProvider: SpeechProviderId = settings.provider
      const controller = new AbortController()
      let timeout: ReturnType<typeof setTimeout> | undefined
      let disconnected = false
      let offEngine = () => {}
      const abort = () => { disconnected = true; controller.abort() }
      req.once('aborted', abort)
      res.once('close', abort)
      try {
        let body: SynthesizeBody
        try { body = await readJsonBody(req) as SynthesizeBody } catch (error) {
          throw new TtsProviderError(error instanceof Error && error.message === 'request-body-too-large' ? 'request-body-too-large' : 'invalid-json', 'Invalid synthesis request.', error instanceof Error && error.message === 'request-body-too-large' ? 413 : 400)
        }
        if (!body || typeof body !== 'object' || Array.isArray(body)) throw new TtsProviderError('invalid-request', undefined, 400)
        const service = (typeof ctx.get === 'function' ? ctx.get('speechSynthesis') : undefined) as SpeechSynthesisService | undefined
        const request = { ...body, signal: controller.signal } as SpeechRequest
        const selected = service?.resolveProvider(request)
        effectiveProvider = selected ?? settings.provider
        if (service && (body.provider === undefined || body.engineRevision !== undefined)) offEngine = service.subscribeEngine(() => controller.abort(new TtsProviderError('speech-engine-changed', undefined, 409)))
```

</details>

**依据 2 · 源码核查**：[src/host/open-api-routes.ts:14-36](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/open-api-routes.ts#L14-L36)

独立 Bearer 及同源检查。

<details>
<summary>查看原文（23行）</summary>

```text
function authorize(req: IncomingMessage, res: ServerResponse, token: string): boolean {
  const origin = req.headers.origin
  const fetchSite = req.headers['sec-fetch-site']
  let sameOrigin = false
  if (origin !== undefined) {
    try {
      const parsed = new URL(origin)
      sameOrigin = ['http:', 'https:'].includes(parsed.protocol) && parsed.host === req.headers.host
    } catch { /* reject malformed origins */ }
    if (!sameOrigin) { json(res, 403, { error: 'cross-origin-denied' }); return false }
  }
  if (fetchSite === 'cross-site' || fetchSite === 'same-site') {
    json(res, 403, { error: 'cross-origin-denied' })
    return false
  }
  const supplied = req.headers.authorization?.match(/^Bearer (.+)$/iu)?.[1] ?? ''
  const expected = Buffer.from(token.trim())
  const actual = Buffer.from(supplied)
  if (expected.length === 0) { json(res, 503, { error: 'open-api-disabled' }); return false }
  if (actual.length === expected.length && timingSafeEqual(actual, expected)) return true
  res.setHeader('www-authenticate', 'Bearer')
  json(res, 401, { error: 'open-api-unauthorized' })
  return false
```

</details>

**依据 3 · 源码核查**：[src/host/audio-downloads.ts:13-35](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/audio-downloads.ts#L13-L35)

随机 ID 登记、过期与查找。

<details>
<summary>查看原文（23行）</summary>

```text
  async publish(artifact: SpeechArtifact): Promise<SpeechDownload> {
    if (this.closed) {
      await artifact.remove()
      throw new TtsProviderError('speech-service-disposed', 'Speech service stopped.', 503)
    }
    const audioId = randomBytes(32).toString('hex')
    const expiresAt = this.now() + SPEECH_FILE_TTL_MS
    this.entries.set(audioId, { artifact, expiresAt })
    return {
      audioId, url: `audio/${audioId}`, expiresAt: new Date(expiresAt).toISOString(),
      size: artifact.size, format: artifact.format, contentType: artifact.contentType,
      ...(artifact.durationMs === undefined ? {} : { durationMs: artifact.durationMs }),
    }
  }

  async get(audioId: string): Promise<SpeechArtifact | undefined> {
    const entry = this.entries.get(audioId)
    if (!entry) return
    if (entry.expiresAt > this.now()) return entry.artifact
    this.entries.delete(audioId)
    await entry.artifact.remove()
  }

```

</details>

**依据 4 · 源码核查**：[src/host/open-api-routes.ts:119-141](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/open-api-routes.ts#L119-L141)

下载只查临时登记，无同一个 Bearer 检查。

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix', path: `${TTS_DOWNLOAD_ROUTE}/`,
    async handler(req, res) {
      if (!method(req, res, ['GET', 'HEAD'])) return
      const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
      const prefix = `${TTS_DOWNLOAD_ROUTE}/`
      const audioId = pathname.slice(pathname.lastIndexOf(prefix) + prefix.length)
      if (!/^[a-f0-9]{64}$/u.test(audioId)) { json(res, 404, { error: 'audio-not-found' }); return }
      try {
        const artifact = await downloads.get(audioId)
        if (!artifact) { json(res, 404, { error: 'audio-not-found' }); return }
        const file = await open(artifact.path, 'r')
        try {
          const info = await file.stat()
          res.setHeader('content-type', artifact.contentType)
          res.setHeader('content-length', info.size)
          res.setHeader('content-disposition', `attachment; filename="speech-${audioId}.${artifact.format}"`)
          res.setHeader('cache-control', 'no-store')
          res.setHeader('referrer-policy', 'no-referrer')
          res.setHeader('x-content-type-options', 'nosniff')
          if (req.method === 'HEAD') res.end()
          else await pipeline(file.createReadStream({ autoClose: false }), res)
        } finally { await file.close() }
```

</details>

**依据 5 · 源码核查**：[src/host/speech-files.ts:12-20](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/speech-files.ts#L12-L20)

Host 文件权限。

```text
/** The directory comes from trusted plugin code, never model arguments. */
export async function writeSpeechArtifact(audio: SpeechAudio, directory = SPEECH_AUDIO_ROOT): Promise<SpeechArtifact> {
  await mkdir(directory, { recursive: true })
  const path = join(directory, `${SPEECH_FILE_PREFIX}${randomUUID()}.${audio.format}`)
  await writeFile(path, audio.data, { flag: 'wx', mode: 0o600 })
  return {
    path, size: audio.data.length, format: audio.format, contentType: audio.contentType,
    ...(audio.durationMs === undefined ? {} : { durationMs: audio.durationMs }),
    remove: () => rm(path, { force: true }),
```

**依据 6 · 源码核查**：[src/speech-agent.ts:70-84](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/speech-agent.ts#L70-L84)

文件导出与会话交付区别。

<details>
<summary>查看原文（15行）</summary>

```text
    description: 'Generate an audio file using the configured Host speech provider. Returns a local path for download, present or another delivery tool. Does not send it to a chat. Credentials stay on the Host. If synthesis fails, you may retry once with the other configured provider; omit model and voice overrides to use that provider\'s saved settings. Do not retry a canceled request.'
      + BREEZE_AUDIO_TAG_GUIDANCE + XIAOMI_AUDIO_TAG_GUIDANCE + EXTERNAL_SPEECH_GUIDANCE,
    parameters: { type: 'object', properties: { ...selection, format: { type: 'string', enum: ['mp3', 'wav', 'silk'] } }, required: ['text'], additionalProperties: false },
    output: {
      schema: { type: 'object', properties: { path: { type: 'string' }, format: { type: 'string' }, size: { type: 'integer' } }, required: ['path', 'format', 'size'], additionalProperties: false },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
    },
    async execute(args, exec) {
      const artifact = await ctx.speechSynthesis.exportAudio(request(args, exec.signal))
      return { path: artifact.path, format: artifact.format, size: artifact.size }
    },
  })
  ctx.tools.register({
    name: 'speak',
    description: 'Read the requested text and deliver audio through this conversation\'s configured speech adapter. Use when asked to answer by voice or read a passage. A successful call already delivered the audio: do not send the file again. When the user explicitly requests an emotion, tone, dialect or delivery style, pass speechInstruction in the same language as the text and keep the saved voice and model. Use provider-specific audio tags only for Breeze or Xiaomi preset voices; use speechInstruction for Doubao and Xiaomi VoiceDesign.'
```

</details>

#### 缺口

- 实际 Host 的前置授权、缓存副本与到期清理未测
  **影响**：不能承诺 URL 不会泄露或所有副本随退出清除
  **进一步探讨**：使用隔离 Host 测无 token 请求、持链接获取和过期返回

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证单次朗读值得保留，同时隔离可选语音入口？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

先用私人隔离 DSH 和公开长回复，关闭自动播放、外部引擎接管和设备配对。对比手工浏览器语音与插件，记录从点击到听见、完整朗读所需时间、停止响应和关键信息遗漏，退出时回到原文。合成服务可能按文本或音频计费，浏览器缓存、下载和错误重试还占用磁盘、网络及人工。出现误删限定词、停止失效或音频链接流转不明，应停用插件并回到浏览器或原文。

QQ 行默认关闭，Passport 行存在但默认没有配对 token。启用 Passport 时默认识别使用 Host ASR，也可选择 MiMo 或豆包；MiMo 路径把输入 PCM 转 WAV 后编码发远端，复用已保存的内置密钥，独立于 TTS 选择。不能把它理解为只上传朗读文本。首次试用排除设备与 QQ，分别验证其交付、身份及资源代价。

待验证设计是在 UI 分别标注合成请求已发、音频到达、播放完成和写入历史，再对比当前提示。用取消、断网、储存失败和供应商换代四类任务看操作者能否定位失败和避免重复付费请求。若误判或恢复时间没有下降，应收窄到实际最常见的失败阶段。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:84-100](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/cordis.patch.yml#L84-L100)

QQ 默认禁用，Passport 默认无配对 token。

<details>
<summary>查看原文（17行）</summary>

```text
# Optional QQ transport. Generic synthesis and tools do not depend on QQBot.
- insert:
    - id: speech-delivery-qqbot
      name: 'dsh-xiaomi-tts/qqbot'
      disabled: true

# Optional Wi-Fi voice terminal. Reuses Host ASR and shared synthesis.
# Enabled by default because its settings page edits this row's own namespace,
# which DSH exposes only while the row runs. Nothing listens on the network
# until a valid pairing token is saved.
- insert:
    - id: speech-delivery-passport
      name: 'dsh-xiaomi-tts/passport'
      config:
        host: '127.0.0.1'
        port: 3101
        accessToken: ''
```

</details>

**依据 2 · 源码核查**：[src/passport.ts:28-41](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/passport.ts#L28-L41)

默认 ASR 与设备配置。

<details>
<summary>查看原文（14行）</summary>

```text
const messages = (language: string) => JSON.parse(readFileSync(new URL(`./locale/passport/${language}.json`, import.meta.resolve('dsh-xiaomi-tts/package.json')), 'utf8')).config
export const Config = z.object({
  asrProvider: z.union(['host', 'xiaomi', 'doubao', 'doubao-nostream']).default('host').volatile(),
  host: z.string().default(defaults.host).volatile(),
  port: z.number().step(1).min(1).max(65535).default(defaults.port).volatile(),
  accessToken: z.string().max(192).pattern(/^\S*$/u).role('secret').default(defaults.accessToken).volatile(),
  deviceId: z.string().default(defaults.deviceId).volatile(),
  agentPreset: z.string().default(defaults.agentPreset).volatile(),
  sessionRevision: z.string().max(128).default(defaults.sessionRevision).volatile(),
  cwd: z.string().default(defaults.cwd).volatile(),
  silenceMs: z.number().step(20).min(200).max(3000).default(defaults.silenceMs).volatile(),
  minSpeechMs: z.number().step(20).min(100).max(1000).default(defaults.minSpeechMs).volatile(),
  speechThreshold: z.number().min(0.001).max(0.5).default(defaults.speechThreshold).volatile(),
  maxRecordingSeconds: z.number().min(1).max(60).default(defaults.maxRecordingSeconds).volatile(),
```

</details>

**依据 3 · 源码核查**：[src/passport/recognition.ts:69-105](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/passport/recognition.ts#L69-L105)

选择保存密钥并将语音发给 ASR。

<details>
<summary>查看原文（37行）</summary>

```text
  choices(): RecognitionChoice[] {
    const settings = this.current()
    return [{ id: 'host', configured: true }, { id: 'xiaomi', configured: !!settings.apiKey.trim() }, { id: 'doubao', configured: !!settings.doubaoApiKey.trim() }, { id: 'doubao-nostream', configured: !!settings.doubaoApiKey.trim() }]
  }
  recognizer(source: RecognitionSource, host?: Pick<SpeechToText, 'snapshot' | 'resolve' | 'transcribe'>): PassportRecognizer {
    if (source === 'host') return hostRecognizer(host)
    const key = () => (source === 'xiaomi' ? this.current().apiKey : this.current().doubaoApiKey).trim()
    const check = () => { if (!key()) throw new Error('passport-asr-key-required') }
    return { check, create: (signal, maxBytes) => {
      check()
      const savedKey = key()
      if (source === 'doubao' || source === 'doubao-nostream') {
        if (this.doubaoKey !== savedKey) { this.doubaoKey = savedKey; this.doubaoPlan = false }
        return new DoubaoRecognition(savedKey, signal, maxBytes, this.doubaoPlan, plan => {
          if (this.doubaoKey === savedKey) this.doubaoPlan = plan
        }, this.connectDoubao, source === 'doubao-nostream' ? 'nostream' : 'async')
      }
      return bufferedRecognition(signal, maxBytes, async pcm => {
        const response = await fetch('https://api.xiaomimimo.com/v1/chat/completions', {
          method: 'POST', redirect: 'error', signal,
          headers: { 'api-key': savedKey, 'content-type': 'application/json' },
          body: JSON.stringify({ model: 'mimo-v2.5-asr', stream: false, asr_options: { language: 'auto' },
            messages: [{ role: 'user', content: [{ type: 'input_audio', input_audio: { data: `data:audio/wav;base64,${pcmWave(pcm).toString('base64')}` } }] }] }),
        })
        // Bound both successful and rejected response bodies, and never expose upstream prose.
        const reader = response.body?.getReader()
        if (!reader) throw recognitionError(response.status)
        const chunks: Buffer[] = []; let size = 0
        try {
          for (;;) {
            const item = await reader.read()
            if (item.done) break
            size += item.value.length
            if (size > 256 * 1024) throw new Error('passport-asr-invalid-response')
            chunks.push(Buffer.from(item.value))
          }
        } finally { await reader.cancel().catch(() => {}); reader.releaseLock() }
```

</details>

**依据 4 · 源码核查**：[src/host/synthesis-routes.ts:34-64](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/host/synthesis-routes.ts#L34-L64)

取消与开始输出可分。

<details>
<summary>查看原文（31行）</summary>

```text
      const controller = new AbortController()
      let timeout: ReturnType<typeof setTimeout> | undefined
      let disconnected = false
      let offEngine = () => {}
      const abort = () => { disconnected = true; controller.abort() }
      req.once('aborted', abort)
      res.once('close', abort)
      try {
        let body: SynthesizeBody
        try { body = await readJsonBody(req) as SynthesizeBody } catch (error) {
          throw new TtsProviderError(error instanceof Error && error.message === 'request-body-too-large' ? 'request-body-too-large' : 'invalid-json', 'Invalid synthesis request.', error instanceof Error && error.message === 'request-body-too-large' ? 413 : 400)
        }
        if (!body || typeof body !== 'object' || Array.isArray(body)) throw new TtsProviderError('invalid-request', undefined, 400)
        const service = (typeof ctx.get === 'function' ? ctx.get('speechSynthesis') : undefined) as SpeechSynthesisService | undefined
        const request = { ...body, signal: controller.signal } as SpeechRequest
        const selected = service?.resolveProvider(request)
        effectiveProvider = selected ?? settings.provider
        if (service && (body.provider === undefined || body.engineRevision !== undefined)) offEngine = service.subscribeEngine(() => controller.abort(new TtsProviderError('speech-engine-changed', undefined, 409)))
        if (service && selected?.startsWith('external:')) {
          if (!stream && body.format !== undefined && body.format !== 'mp3' && body.format !== 'wav') throw new TtsProviderError('invalid-audio-format', undefined, 400)
          if (stream) {
            await service.streamPcm(request, bytes => {
              if (res.destroyed) throw new TtsProviderError('tts-canceled', undefined, 499)
              if (res.writableLength + bytes.byteLength * 2 > settings.maxPausedPcmBytes) throw new TtsProviderError('stream-buffer-limit')
              if (!res.headersSent) {
                res.setHeader('content-type', 'text/event-stream; charset=utf-8')
                res.setHeader('cache-control', 'no-store'); res.setHeader('x-accel-buffering', 'no')
              }
              res.write(`data: ${JSON.stringify({ choices: [{ delta: { audio: { data: Buffer.from(bytes).toString('base64') } } }] })}\n\n`)
            })
            res.end('data: [DONE]\n\n')
```

</details>

**依据 5 · 源码核查**：[src/client/history/audio-history.ts:94-107](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/a45b46f5304b29e7db350ad6f119e87bf734017a/src/client/history/audio-history.ts#L94-L107)

持久失败可独立于音频生成。

<details>
<summary>查看原文（14行）</summary>

```text
  }

  private mutate(update: () => void): Promise<void> {
    if (this.disposed) return Promise.resolve()
    this.chain = this.chain.then(async () => {
      update()
      if (!this.storageLoaded) return
      try {
        await this.storage.replace(this.view.entries)
        if (this.view.status === 'memory') this.publish({ ...this.view, status: 'ready' })
      }
      catch { this.publish({ ...this.view, status: 'memory' }) }
    })
    return this.chain
```

</details>

#### 缺口

- 无实际音质、付费账单或故障恢复对照
  **影响**：目前只能给低敏试用条件
  **进一步探讨**：固定公开样本与同一 Host，先演练普通朗读和取消，再独立验设备

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
