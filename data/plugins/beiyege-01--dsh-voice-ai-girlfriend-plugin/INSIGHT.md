# DSH 语音 AI 女友插件

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f367998](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/tree/f367998b05f03ea3a5babf2ef57e6631065707ab)

<!-- BEGIN META -->
[![GitHub ★ 51](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=51&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin)
<!-- END META -->

> **功能**：为 DSH Web 接入语音桥的录音识别、回复朗读、数字人窗口与 QQ 双向转交。

> **亮点**：实现DSH浏览器语音输入输出与桥接播放，声学模型/数字人/QQ发送和Agent继承外部栈。见 [Q04](#research-q04)。

> **主要限制**：首回复baseline跳过、QQ历史/断线无ack且关推送不断入站；录音在途/无声缓冲、全局DH归属与停止门控缺口。见 [Q01](#research-q01)至[Q03](#research-q03)。

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
  - [Q01 · 语音如何成为真实Agent输入，回复怎样变为音频？](#detail-section-11)
  - [Q02 · QQ与数字人怎样产生外发和服务副作用？](#detail-section-12)
  - [Q03 · 桥地址、并发、持久化和停止会留下哪些边界？](#detail-section-13)
  - [Q04 · 已有方案贡献在哪里，完整部署与资源成本怎样分担？](#detail-section-14)
  - [Q05 · 当前应怎样采用，最值得先验证哪个改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有本机语音栈的Web爱好者说话并听回复，键盘+独立听写/TTS为基线。见 [Q01](#research-q01)。

DSH键盘文字聊天，系统听写/朗读单独组合；QQ交接人工核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 连续录音 | PCM识别注入 | 用户开麦/桥/无确认页 |
| 回复TTS | 逐句音频 | 首回复baseline与停用缺口 |
| 数字人 | 口型视频播放 | 全局桥code/外部GPU |
| QQ转交 | 文本双向 | 入站独立于推送off |
| 音色/形象/待机 | 外部桥偏好 | 非DSH人格/记忆 |
| 余额 | 10分钟刷新 | 桥缓存未核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH >=0.1.3-alpha.1 <0.3.0 Web | 声明 | slot/session/useChat | 旧rc.8作者指向旧包 |
| React^18.2/Host slots locale sessions | 必需 | 浏览器UI/会话 | 无真实发送 |
| bridge/FunASR/OmniVoice | 语音所需 | ASR/TTS/VAD | 本包无模型实现 |
| WSL2/FlashInfer与模型硬件 | 作者完整栈 | 合成资源 | GPU/许可未核 |
| DUIX Docker/素材 | 数字人可选 | 口型视频 | 回TTS或失败 |
| NapCat/测试账号 | QQ可选 | 外部收发 | 不接真实账号 |
| 浏览器麦克风/AudioWorklet/播放许可 | 语音所需 | 采集播放 | 拒绝/无声音 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 审查 | 固定配套桥与身份/资源 | 未通过保持文字 |
| 准备 | 隔离origin/虚构数据/断QQ | 先关朗读/DH/QQ输出 |
| 输入 | 点击录音→STT→prompt | 核正确会话/识别文本 |
| 输出 | 句TTS或DH视频 | 核首回复/历史/断线 |
| 停止 | 关麦克风/各方向/断桥 | 验在途终结，不只按钮 |
| 退出 | 停插件、另停外桥GPU/QQ | 历史媒体另清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型/GPU/素材费用未知 | 多服务部署/身份审查 | 非单包完成 |
| 持续使用 | 电费显存CPU模型费未知 | 识别纠错/更新/存储 | 无声缓冲无上限 |
| 失败恢复 | GPU/重试资源未知 | 分浏览器桥模型QQ定位 | 发送不等送达 |
| 退出 | 外桥/媒体可能留存 | 停服务/清各域数据 | 不追收已外发数据 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 麦克风输入 | PCM→STT→prompt | 识别质量/停用竞态 |
| 回复朗读 | 文本句队列 | 首回复跳过/延迟 |
| 数字人 | submit/poll/播放 | GPU完成与会话归属 |
| QQ | WS入站/首尾推送 | 历史/去重/收件人送达 |
| 余额 | 10分钟请求/显示 | 桥缓存/账号权限 |
| 总价值 | 接线减少搬运假设 | 真实收益/资源净成本 |

> **思考**：首回复baseline跳过、QQ历史/断线无ack且关推送不断入站；录音在途/无声缓冲、全局DH归属与停止门控缺口。见 [Q01](#research-q01)至[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：实现DSH浏览器语音输入输出与桥接播放，声学模型/数字人/QQ发送和Agent继承外部栈。见 [Q04](#research-q04)。

会话prompt和句流组合可借鉴；注释保证须对照首回复/停止/全局桥实际控制流。见 [Q01](#research-q01)至[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

首回复baseline跳过、QQ历史/断线无ack且关推送不断入站；录音在途/无声缓冲、全局DH归属与停止门控缺口。见 [Q01](#research-q01)至[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先审外桥并做虚构协议桩，不接日常QQ/敏感工具，停止不明就断桥回文字。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

浏览器关键录音/发送/播放/QQ/数字人/停止源码已核；外部桥未审、目标未运行。

- 已检查：作者 README、包清单、源码路径 README.md、build.mjs、package.json、src/client/BalanceBadge.tsx、src/client/DigitalHumanToggle.tsx、src/client/MicButton.tsx、src/client/PersonaToggle.tsx、src/client/QqPushToggle.tsx、src/client/VoiceToggle.tsx、src/client/bridge.ts、src/client/index.ts、src/client/voice/companion.tsx、src/client/voice/qq-bridge.tsx、src/client/voice/recorder.ts、src/client/voice/reply-listener.tsx、src/client/voice/speaker.ts、src/client/worklets/mic-capture.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核全部主要Client入口、录音worklet/STT/prompt、句流/数字人提交播放/QQ/偏好/余额与停用；未全审动画布局CSS，未审配套桥/模型/NapCat/Host实现，未运行目标。
- 下一步：先固定审外桥，再本地协议桩五条件；本次未执行。

**分析版本**

- **仓库**：[beiyege-01/dsh-voice-ai-girlfriend-plugin](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin)
- **版本号**：0.4.0（[固定提交 f367998](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/tree/f367998b05f03ea3a5babf2ef57e6631065707ab)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

复用会话绑定补交接ID/回执/取消generation，协议桩五条件证伪；桥已有则直接适配。见 [Q05](#research-q05)。

先固定审外桥，再本地协议桩五条件；本次未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 107 | 83 | 18 | — |
| .md | source | 1 | 80 | — | — | 1278 |
| .tsx | source | 13 | 2433 | 1854 | 425 | — |
| .ts | source | 13 | 1306 | 906 | 309 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：浏览器语音/数字人/QQ到Agent的调用、副作用与停止边界是否可控？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 语音如何成为真实Agent输入，回复怎样变为音频？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向已有DSH Web与配套语音桥的本机语音交互爱好者，把说话注入既有会话、将回复读出，并可选动画/口型视频。基线是键盘聊天配独立听写/TTS，而非另造Agent循环；合格要识别文本送到正确会话、能打断/停用并知道哪些内容已出站。没有需求或识别准确率独立实测，不能推断“女友”命名即有记忆/关系治理。

Host入口apply为空。浏览器在input.dock/composer.dock/input.left注册工具行、余额、回复监听、陪伴窗与QQ；sendText绑定slot传入sessionId，经sessions.binding取会话，运行中默认steer否则queue，并检查prompt结果ok。没有按说话者限制标准Agent工具；识别文本与用户输入同等进入当前DSH会话，潜在工作副作用由该会话preset/Host权限决定。

用户点击麦克风才getUserMedia，AudioWorklet把音频转16k PCM16，默认1800ms静默/语音开始后30秒上限形成片段；MicButton串行stt→sendText，没有识别确认页。读音默认开启，但麦克风独立；/api/stt送原PCM，TTS把文本POST桥接返回WAV，插件不实现FunASR/OmniVoice。播报时VAD流送桥，未连上退RMS阈值，不能沿注释断言永不误触。ReplySpeaker FIFO解码播放，用generation淘汰停止前待解码片段。

回复只取assistant-step text块，排除reasoning/tool/image；逐句TTS串行fetch，计数在请求前推进，失败console后不自动补句。历史baseline在首次见settled时取最大anchor；实际在baseline为null时直接return，意味着全新会话第一次回复运行期间不朗读，settled后又被当基线跳过，源码与注释“全新实时回复仍朗读”存在具体矛盾，未运行复现。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-10](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/index.ts#L1-L10)

Host空入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Voice chat plugin, node half.
 *
 * Deliberately empty: everything lives in the browser half (packages/client
 * convention) — mic capture, bridge calls, conversation injection, and the
 * companion window are all web-only concerns.
 */

/** Host plugin body — nothing to mount on the node side. */
export function apply(): void {}
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:66-89](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/index.ts#L66-L89)

会话绑定与实际prompt模式/结果。

<details>
<summary>查看原文（24行）</summary>

```text
  const injectFace = (sessionId: SessionId | undefined): VoiceInjected => ({
    sendText: async (text: string) => {
      if (sessionId === undefined) throw new Error('[ui-voice] no session scope for sendText')
      const binding = ctx.sessions.binding(sessionId)
      const session = binding?.session
      if (session === undefined) throw new Error('[ui-voice] session unavailable for sendText')
      // Voice input must send IMMEDIATELY: when the agent's turn is still
      // running (my reply streaming), a plain queue would sit as a pending
      // item in the input dock, needing a manual send — the "second sentence
      // stuck" bug. Default: steer, which interrupts the running turn.
      // The BusyToggle flips this to pure queue for continuous conversation
      // (let the current turn finish, then the sentence auto-sends).
      const running = session.getSnapshot()?.running === true
      let interrupt = true
      try {
        interrupt = localStorage.getItem('s2s.voice.interrupt') !== '0'
      } catch {
        // persistence unavailable — fall back to the interrupt default
      }
      const mode = running && interrupt ? 'steer' : 'queue'
      const result = await session.prompt([{ type: 'text', text }], mode)
      if (!result.ok) {
        throw new Error(`[ui-voice] prompt failed: ${result.error.code}: ${result.error.message}`)
      }
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:147-182](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/index.ts#L147-L182)

回复/陪伴/QQ确有slot挂载。

<details>
<summary>查看原文（36行）</summary>

```text
  // Hidden per-session reply listener: speaks finalized assistant text.
  ctx.slots.inject('conversation.input.left', () => ctx.slots.register(
    {
      name: 'conversation.input.left',
      id: 'voice-reply',
      order: 90,
      locale: NS,
      inject: injectFace,
    },
    ReplySpeakerMount,
  ))

  // Full-height companion animation window (idle bg-images / speaking task-videos).
  ctx.slots.inject('conversation.input.left', () => ctx.slots.register(
    {
      name: 'conversation.input.left',
      id: 'voice-companion',
      order: 95,
      locale: NS,
      inject: injectFace,
    },
    CompanionWindow,
  ))

  // Hidden QQ bridge: private-message inbound -> sendText; settled replies ->
  // bridge -> TTS voice -> QQ. Renders null; no-op when qq disabled.
  ctx.slots.inject('conversation.input.left', () => ctx.slots.register(
    {
      name: 'conversation.input.left',
      id: 'voice-qq-bridge',
      order: 96,
      locale: NS,
      inject: injectFace,
    },
    QQBridge,
  ))
```

</details>

**依据 4 · 源码核查**：[src/client/MicButton.tsx:70-101](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/MicButton.tsx#L70-L101)

串行STT和stop。

<details>
<summary>查看原文（32行）</summary>

```text
  // Drain queued utterances serially: STT -> send -> next (continuous mode).
  const drain = useCallback(async () => {
    if (drainRunningRef.current) return
    drainRunningRef.current = true
    try {
      while (queueRef.current.length > 0) {
        if (recorderRef.current === null) break // user stopped listening
        const pcm = queueRef.current.shift()!
        setPhase('transcribing')
        try {
          const { text } = await stt(pcm)
          if (text !== undefined && text.trim() !== '') {
            await sendText(text.trim())
          }
        } catch (err) {
          console.error('[ui-voice] stt/send failed:', err)
        }
      }
    } finally {
      drainRunningRef.current = false
      setPhase(recorderRef.current !== null ? 'listening' : 'idle')
    }
  }, [sendText])

  const toggle = useCallback(async () => {
    if (recorderRef.current !== null) {
      // Stop: end continuous listening, drop any queued utterances.
      recorderRef.current.stop()
      recorderRef.current = null
      queueRef.current = []
      setPhase('idle')
      return
```

</details>

**依据 5 · 源码核查**：[src/client/voice/recorder.ts:143-189](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/recorder.ts#L143-L189)

真实麦克风与worklet。

<details>
<summary>查看原文（47行）</summary>

```text
  /** Acquire the mic and start the capture worklet. */
  async start(): Promise<void> {
    this.released = false
    const ctx = new AudioContext({ latencyHint: 'interactive' })
    this.ctx = ctx
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    })
    this.stream = stream
    const workletUrl = URL.createObjectURL(
      new Blob([MIC_CAPTURE_WORKLET_SOURCE], { type: 'text/javascript' }),
    )
    try {
      await ctx.audioWorklet.addModule(workletUrl)
    } finally {
      URL.revokeObjectURL(workletUrl)
    }
    const source = ctx.createMediaStreamSource(stream)
    const node = new AudioWorkletNode(ctx, 'mic-capture', {
      numberOfInputs: 1,
      numberOfOutputs: 0,
      processorOptions: { chunkMs: 40 },
    })
    // Arm the noise gate (mirrors the original project): quiet ambient audio
    // below `noiseGateDb` is faded out of the SENT stream. The worklet already
    // carries the full attack/hold/release envelope — this message enables it.
    const gateDb = this.opts.noiseGateDb
    // dBFS values are NEGATIVE (e.g. -35); 0 or undefined means disabled —
    // a `> 0` guard would silently never arm the gate and ambient noise
    // would reach STT untouched (phantom messages).
    if (gateDb !== undefined && gateDb !== 0) {
      node.port.postMessage({ kind: 'gate', enabled: true, thresholdDb: gateDb })
    }
    node.port.onmessage = (e) => {
      if (this.released) return
      const data = e.data
      if (data instanceof ArrayBuffer) this.onChunk(data)
      else if (data !== null && typeof data === 'object' && data.kind === 'level') this.onLevel(data.rms)
    }
    source.connect(node)
    this.source = source
    this.node = node
  }
```

</details>

**依据 6 · 源码核查**：[src/client/MicButton.tsx:109-123](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/MicButton.tsx#L109-L123)

实际静默/上限/VAD配置。

<details>
<summary>查看原文（15行）</summary>

```text
    const recorder = new MicRecorder({
      minSilenceMs: 1800,
      maxUtteranceMs: 30000,
      rmsThreshold: 0.01,
      // Noise gate (original project's worklet): -35 dBFS. Tighter than the
      // original's -45 so louder ambient hums (a desk fan measured ~ -40..
      // -30 dB) get faded out of the sent stream, while normal speech
      // (~ -26..-10 dB) passes untouched.
      noiseGateDb: -35,
      // Barge-in: bridge silero VAD (real human voice only). RMS values are
      // the fallback used when the bridge lacks the /api/vad endpoint.
      vad: new VadStream(),
      interruptThreshold: 0.06,
      interruptHoldMs: 250,
      interruptConfirmMs: 180,
```

</details>

**依据 7 · 源码核查**：[src/client/voice/recorder.ts:216-244](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/recorder.ts#L216-L244)

VAD不可达时RMS回退。

<details>
<summary>查看原文（29行）</summary>

```text
  private onLevel(rms: number): void {
    if (this.released || this.paused) return

    // Barge-in mode: stream to the bridge VAD (never accumulate). Without a
    // connected VadStream (bridge without the endpoint), fall back to RMS.
    if (this.interruptMode) {
      if (this.opts.vad === undefined || !this.opts.vad.available) {
        const threshold = this.opts.interruptThreshold ?? DEFAULT_INTERRUPT_THRESHOLD
        const now = performance.now()
        if (rms >= threshold) {
          if (!this.interruptArmed) {
            this.interruptArmed = true
            this.interruptHoldStart = now
          } else if (!this.confirmArmed && now - this.interruptHoldStart >= (this.opts.interruptHoldMs ?? DEFAULT_INTERRUPT_HOLD_MS)) {
            this.opts.onSpeechInterrupt?.()
            this.confirmArmed = true
            this.confirmStart = now
          } else if (this.confirmArmed && now - this.confirmStart >= (this.opts.interruptConfirmMs ?? DEFAULT_INTERRUPT_CONFIRM_MS)) {
            this.confirmArmed = false
            this.interruptArmed = false
            this.interruptMode = false
            this.resetBuffers()
          }
        } else {
          this.interruptArmed = false
          this.confirmArmed = false
        }
      }
      return
```

</details>

**依据 8 · 源码核查**：[src/client/voice/recorder.ts:258-293](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/recorder.ts#L258-L293)

累计、静默flush和上限。

<details>
<summary>查看原文（36行）</summary>

```text
  private onChunk(buffer: ArrayBuffer): void {
    if (this.released || this.paused) return
    if (this.interruptMode) {
      // Barge-in mode: stream to the bridge VAD, never accumulate.
      this.opts.vad?.send(buffer)
      return
    }
    this.chunks.push(buffer)
    this.chunkBytes += buffer.byteLength
    if (!this.speaking) return
    const silenceMs = performance.now() - this.lastVoiceAt
    if (silenceMs >= (this.opts.minSilenceMs ?? DEFAULT_MIN_SILENCE_MS)) this.flush()
  }

  private armMaxTimer(): void {
    if (this.maxTimer !== null) clearTimeout(this.maxTimer)
    this.maxTimer = setTimeout(
      () => this.flush(),
      this.opts.maxUtteranceMs ?? DEFAULT_MAX_UTTERANCE_MS,
    )
  }

  private flush(): void {
    if (this.released) return
    if (this.maxTimer !== null) {
      clearTimeout(this.maxTimer)
      this.maxTimer = null
    }
    const pcm = this.chunkBytes > 0 ? this.concatChunks() : null
    this.chunks = []
    this.chunkBytes = 0
    if (this.speaking) {
      this.speaking = false
      this.opts.onSpeakingChange?.(false)
    }
    if (pcm !== null) this.opts.onUtterance(pcm)
```

</details>

**依据 9 · 源码核查**：[src/client/bridge.ts:33-64](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/bridge.ts#L33-L64)

音频/文本真实POST。

<details>
<summary>查看原文（32行）</summary>

```text
/** Speech to text: raw 16 kHz mono PCM16 -> { text, language }. */
export async function stt(pcm16: ArrayBuffer): Promise<{ text: string; language?: string }> {
  const resp = await fetch(`${bridgeBase()}/api/stt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-Max-Audio-Sec': '30',
    },
    body: pcm16,
  })
  if (!resp.ok) {
    const body = await resp.text().catch(() => '')
    throw new Error(`voice bridge /api/stt failed: ${resp.status} ${body}`.trim())
  }
  return resp.json() as Promise<{ text: string; language?: string }>
}

/** Text to speech: { text } -> 16 kHz mono PCM16 WAV bytes. */
export async function tts(text: string, signal?: AbortSignal): Promise<ArrayBuffer> {
  const init: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }
  if (signal !== undefined) init.signal = signal
  const resp = await fetch(`${bridgeBase()}/api/tts`, init)
  if (!resp.ok) {
    const body = await resp.text().catch(() => '')
    throw new Error(`voice bridge /api/tts failed: ${resp.status} ${body}`.trim())
  }
  return resp.arrayBuffer()
}
```

</details>

**依据 10 · 源码核查**：[src/client/voice/reply-listener.tsx:191-210](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/reply-listener.tsx#L191-L210)

baseline实际return及首回复边界。

<details>
<summary>查看原文（20行）</summary>

```text
    // First settled assistant node arrives: freeze the history baseline so
    // pre-existing replies never replay (page load, session revisit, history
    // pagination). Running nodes are live replies — they are NOT used here,
    // so a fresh reply in a new session still speaks.
    if (baselineRef.current === null) {
      let maxAnchor = 0
      let hasSettled = false
      for (const node of chatNodes(chat)) {
        if (node.kind !== 'assistant-step') continue
        const data = assistantData(node)
        if (data === undefined) continue
        if (data.status === 'settled') hasSettled = true
        if (node.anchorSeq > maxAnchor) maxAnchor = node.anchorSeq
      }
      if (hasSettled && maxAnchor > 0) {
        baselineRef.current = maxAnchor
        skipUntilRef.current = maxAnchor
      }
      return
    }
```

</details>

**依据 11 · 源码核查**：[src/client/voice/reply-listener.tsx:298-345](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/reply-listener.tsx#L298-L345)

逐句先记数后fetch，无重试。

<details>
<summary>查看原文（48行）</summary>

```text
    // Non-DH mode: collect the complete sentences that are new (beyond each
    // node's spoken count), in (anchor, index) order. A SETTLED node also
    // flushes its trailing partial (the reply ended without a terminal
    // punctuation, like a credit line); running nodes wait for the partial.
    const jobs: { anchor: number; key: string; index: number; sentence: string }[] = []
    for (const node of chatNodes(chat)) {
      if (node.kind !== 'assistant-step') continue
      if (node.anchorSeq <= skipUntilRef.current) continue
      if (node.anchorSeq === skipAnchorRef.current) continue
      const data = assistantData(node)
      if (data === undefined || data.status === 'interrupted') continue
      const { sentences, partial } = splitSentences(cleanReplyText(nodeText(data), 100000))
      const speakable = data.status === 'settled' && partial !== null
        ? [...sentences, partial]
        : sentences
      const spoken = spokenRef.current.get(node.key) ?? 0
      if (speakable.length > spoken) {
        for (let i = spoken; i < speakable.length; i++) {
          jobs.push({ anchor: node.anchorSeq, key: node.key, index: i, sentence: speakable[i]! })
        }
        spokenRef.current.set(node.key, speakable.length)
      }
    }
    if (jobs.length === 0) return
    jobs.sort((a, b) => (a.anchor - b.anchor) || (a.index - b.index))

    // Chain the fetches serially (order preserved; playback pipelines via the
    // speaker queue). Each step re-checks voice/interrupt so an abort stops
    // the rest of the chain.
    chainRef.current = jobs.reduce(
      (chain, job) => chain.then(() => {
        if (interruptRef.current || !voiceEnabled()) return
        const controller = new AbortController()
        _registerTtsAbort(controller)
        return tts(job.sentence, controller.signal)
          .then((wav) => {
            if (interruptRef.current || !voiceEnabled()) return
            speaker.speak(wav)
          })
          .catch((err) => {
            if ((err as Error | undefined)?.name !== 'AbortError') {
              console.error('[ui-voice] reply TTS failed:', err)
            }
          })
          .finally(() => _registerTtsAbort(null))
      }),
      chainRef.current,
    )
```

</details>

**依据 12 · 源码核查**：[src/client/voice/speaker.ts:68-118](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/speaker.ts#L68-L118)

解码generation和停止释放。

<details>
<summary>查看原文（51行）</summary>

```text
  private playOne(ctx: AudioContext, wav: ArrayBuffer): Promise<void> {
    const gen = this.gen
    return new Promise((resolve) => {
      void ctx.decodeAudioData(wav)
        .then((buffer) => {
          if (this.disposed || gen !== this.gen) {
            resolve()
            return
          }
          const source = ctx.createBufferSource()
          source.buffer = buffer
          source.connect(ctx.destination)
          this.playing = source
          this.emit()
          source.onended = () => {
            if (this.playing === source) {
              this.playing = null
              this.emit()
            }
            resolve()
          }
          source.start()
        })
        .catch(() => resolve())
    })
  }

  /** Stop the current clip immediately and clear the queued ones. */
  stop(): void {
    this.gen += 1
    if (this.playing !== null) {
      try {
        this.playing.stop()
      } catch {
        // already stopped
      }
      this.playing = null
    }
    this.queue = []
    this.emit()
  }

  /** Release the AudioContext (plugin teardown). */
  dispose(): void {
    this.disposed = true
    this.stop()
    if (this.ctx !== null) {
      void this.ctx.close().catch(() => {})
      this.ctx = null
    }
    this.listeners.clear()
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · QQ与数字人怎样产生外发和服务副作用？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

QQBridge挂载即开/api/qq/ws并3秒重连；“QQ开关”readQqPush只控制出站effect，入站仍接qq_message.text并直接sendText，没有浏览器端发送者/会话/账号字段校验、人工确认或dedup ID。因此关QQ推送不等禁止QQ输入，来源许可、NapCat账号绑定和桥认证必须由外部服务承担，本包未核。默认QQ推送on；不能把这一路用于可执行敏感工具的日常会话。

出站每用户轮挑第一个settled与最后一个settled文本，后者4秒静默后发；只有anchor本地ref，无持久任务/ack。lastReplyAnchor初始0，没有回复监听器的历史baseline，挂载且有历史时可挑旧回复发送；sendQq甚至在WS未open时也先推进anchor，可能以后不补发。传输只有type/reply/text，没有sessionId或收件人，桥全局路由/多标签连接替换只是注释约定，不能认证隔离。4秒timer捕获open/ws且执行时不重新读开关，关推送不保证撤销已排定消息。实际QQ语音/图片制作与账号发送不在仓库代码内，README描述不当已验证。

数字人模式需bridgeDh、陪伴可见与本地digitalHuman开关；回复首/尾文本提交/api/dh/speak取得code，先标dhSent再提交，失败返回null不会自动重试。新用户/插话请求discard当前已知code；HTTP取消不证明桥/GPU已停，尚未返回code的提交也有竞态。陪伴窗轮询全局dhStatus并按code/segments排视频，没有校验当前sessionId/本listener提交归属。数字人开关默认on，挂载会POST dhEnable同步桥，故仅安装/打开界面也可能变更外部桥开关；桥停worker/清磁盘语义只在外部实现，不能用注释认证。

窗口隐藏不是服务停机。媒体30秒刷新、DH状态4秒轮询均独立effect，窗口不可见不拆这些effect。driveDh只先核digitalHuman，不核voiceEnabled；错误/超时fallback直接tts(status.text)也不核语音总开关，已排视频/桥任务可能越过“关朗读即整条管道停止”的注释。这里只确认代码缺门控，不宣称已经发生隐私泄露或GPU事故。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/voice/qq-bridge.tsx:63-94](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/qq-bridge.tsx#L63-L94)

无条件连接/入站注入。

<details>
<summary>查看原文（32行）</summary>

```text
  // WS connect with auto-reconnect (3s). Only one tab should run this (the
  // bridge itself replaces stale connections).
  useEffect(() => {
    let closed = false
    let ws: WebSocket | null = null
    const connect = () => {
      if (closed) return
      ws = new WebSocket(qqWsUrl())
      ws.onopen = () => { wsRef.current = ws }
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(String(event.data)) as { type?: string; text?: string }
          if (msg.type === 'qq_message' && typeof msg.text === 'string' && msg.text.trim() !== '') {
            void sendText(msg.text.trim()).catch((err) => {
              console.error('[ui-voice] qq inject failed:', err)
            })
          }
        } catch {
          // malformed frame — ignore
        }
      }
      ws.onclose = () => {
        if (wsRef.current === ws) wsRef.current = null
        if (!closed) setTimeout(connect, 3000)
      }
    }
    connect()
    return () => {
      closed = true
      if (ws !== null) { try { ws.close() } catch { /* already closed */ } }
    }
  }, [sendText])
```

</details>

**依据 2 · 源码核查**：[src/client/QqPushToggle.tsx:14-21](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/QqPushToggle.tsx#L14-L21)

QQ出站默认on。

```text
const QQ_PUSH_KEY = 's2s.voice.qqPush'

export function readQqPush(): boolean {
  try {
    return localStorage.getItem(QQ_PUSH_KEY) !== '0'
  } catch {
    return true
  }
```

**依据 3 · 源码核查**：[src/client/voice/qq-bridge.tsx:102-155](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/qq-bridge.tsx#L102-L155)

历史无baseline、先推进anchor、timer捕获。

<details>
<summary>查看原文（54行）</summary>

```text
  useEffect(() => {
    if (!readQqPush()) return
    const userAnchors: number[] = []
    for (const node of chatNodes(chat)) {
      if (node.kind === 'user') userAnchors.push(node.anchorSeq)
    }
    userAnchors.sort((a, b) => a - b)
    type TurnPick = { anchor: number; text: string }
    const perUserTurn = new Map<number, { first: TurnPick; last: TurnPick }>()
    for (const node of chatNodes(chat)) {
      if (node.kind !== 'assistant-step') continue
      const data = assistantData(node)
      if (data === undefined || data.status !== 'settled') continue
      const text = cleanReplyText(nodeText(data), 100000).trim()
      if (text.length < 2) continue
      let ua = -1
      for (const u of userAnchors) {
        if (u < node.anchorSeq) ua = u
        else break
      }
      const pick: TurnPick = { anchor: node.anchorSeq, text }
      const slot = perUserTurn.get(ua)
      if (slot === undefined) {
        perUserTurn.set(ua, { first: pick, last: pick })
      } else {
        if (node.anchorSeq < slot.first.anchor) slot.first = pick
        if (node.anchorSeq > slot.last.anchor) slot.last = pick
      }
    }
    const ws = wsRef.current
    const open = ws !== null && ws.readyState === WebSocket.OPEN
    const sendQq = (pick: TurnPick): void => {
      if (pick.anchor <= lastReplyAnchorRef.current) return
      lastReplyAnchorRef.current = pick.anchor
      if (open) ws.send(JSON.stringify({ type: 'reply', text: pick.text }))
    }
    for (const [ua, { first, last }] of perUserTurn) {
      sendQq(first)
      if (first.anchor === last.anchor) {
        const existing = qqLastDebounceRef.current.get(ua)
        if (existing !== undefined) {
          clearTimeout(existing.timer)
          qqLastDebounceRef.current.delete(ua)
        }
        continue
      }
      const existing = qqLastDebounceRef.current.get(ua)
      if (existing !== undefined) clearTimeout(existing.timer)
      const timer = setTimeout(() => {
        qqLastDebounceRef.current.delete(ua)
        sendQq(last)
      }, LAST_DEBOUNCE_MS)
      qqLastDebounceRef.current.set(ua, { timer, anchor: last.anchor })
    }
```

</details>

**依据 4 · 源码核查**：[src/client/voice/reply-listener.tsx:259-293](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/reply-listener.tsx#L259-L293)

数字人先标记/提交/尾段定时。

<details>
<summary>查看原文（35行）</summary>

```text
      const submitDh = (pick: TurnPick): void => {
        const base = baselineRef.current
        if (base !== null && pick.anchor <= base) return
        if (pick.anchor === skipAnchorRef.current) return
        if (dhSentRef.current.has(pick.node.key)) return
        const text = cleanReplyText(nodeText(pick.data), 100000)
        if (text.trim().length < 2) return
        dhSentRef.current.add(pick.node.key)
        lastDhReplyAnchorRef.current = pick.anchor
        void dhSpeak(text).then((code) => {
          if (code !== null) lastDhCodeRef.current = code
        })
      }
      for (const [ua, { first, last }] of perUserTurn) {
        // FIRST segment: submit immediately (it is settled and will not change).
        submitDh(first)
        if (first.node.key === last.node.key) {
          // Pure chat turn (no tool-call churn): first === last, nothing else.
          const existing = dhLastDebounceRef.current.get(ua)
          if (existing !== undefined) {
            clearTimeout(existing.timer)
            dhLastDebounceRef.current.delete(ua)
          }
          continue
        }
        // LAST segment: debounce — replace the candidate (reset the timer) on
        // every new settled text so an intermediate text never gets submitted;
        // only a 4s-quiet turn submits its final segment.
        const existing = dhLastDebounceRef.current.get(ua)
        if (existing !== undefined) clearTimeout(existing.timer)
        const timer = setTimeout(() => {
          dhLastDebounceRef.current.delete(ua)
          submitDh(last)
        }, LAST_DEBOUNCE_MS)
        dhLastDebounceRef.current.set(ua, { timer, anchor: last.anchor })
```

</details>

**依据 5 · 源码核查**：[src/client/voice/reply-listener.tsx:167-188](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/reply-listener.tsx#L167-L188)

总闸与插话discard。

<details>
<summary>查看原文（22行）</summary>

```text
  useEffect(() => {
    if (!voiceEnabled()) return

    // 桥接开关尚未确认：先不朗读也不提交视频，等 dhStatus 返回（桥接不可达时
    // 按非 DH 处理，回复仍会 TTS 朗读）。确认后 setBridgeDh 触发重渲染，等待
    // 窗口期到达的回复会按正确的 dhMode 处理。
    if (bridgeDh === null) return
    const dhMode = bridgeDh && companionVisible() && readDigitalHuman()

    // Barge-in swallowed the CURRENT reply: remember its exact anchor so only
    // that reply's remaining sentences are skipped; replies that appear
    // later (or that already appeared) still speak. In DH mode, discard the
    // pending video task (the reply is being talked over).
    if (interruptRef.current) {
      if (dhMode) dhDiscard(lastDhCodeRef.current)
      let maxAnchor = 0
      for (const node of chatNodes(chat)) {
        if (node.kind === 'assistant-step' && node.anchorSeq > maxAnchor) maxAnchor = node.anchorSeq
      }
      if (maxAnchor > 0) skipAnchorRef.current = maxAnchor
      interruptRef.current = false
      return
```

</details>

**依据 6 · 源码核查**：[src/client/DigitalHumanToggle.tsx:18-50](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/DigitalHumanToggle.tsx#L18-L50)

数字人默认与挂载POST。

<details>
<summary>查看原文（33行）</summary>

```text
const DIGITAL_HUMAN_KEY = 's2s.voice.digitalHuman'

export function readDigitalHuman(): boolean {
  try {
    return localStorage.getItem(DIGITAL_HUMAN_KEY) !== '0'
  } catch {
    return true
  }
}

/** Full toggle props: framework runtime share + `voice` locale seat + injected face. */
export type DigitalHumanToggleProps =
  PropsRuntime<'conversation.input.left'> & PropsLocale<'voice'> & VoiceInjected

/** Talking-head glyph (inline, follows currentColor). */
function DigitalHumanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M3 3.5 4.6 5M21 3.5 19.4 5M2 10H1M23 10h-1" />
    </svg>
  )
}

export const DigitalHumanToggle = memo(function DigitalHumanToggle({ t }: DigitalHumanToggleProps) {
  const [on, setOn] = useState<boolean>(readDigitalHuman)

  // Mount: push the persisted choice to the bridge, so a reload never leaves
  // the two sides disagreeing (e.g. bridge left ON while this switch is OFF).
  useEffect(() => {
    void dhEnable(readDigitalHuman()).then(() => notifyDhChanged())
  }, [])
```

</details>

**依据 7 · 源码核查**：[src/client/voice/companion.tsx:390-423](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/companion.tsx#L390-L423)

媒体轮询独立于可见。

<details>
<summary>查看原文（34行）</summary>

```text
  const mediaJsonRef = useRef('')
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const base = bridgeBase()
        const [bg, task] = await Promise.all([
          fetch(`${base}/api/media/bg-images`).then(r => r.json() as Promise<{ media: BgMedia[] }>),
          fetch(`${base}/api/media/task-videos`).then(r => r.json() as Promise<{ videos: string[] }>),
        ])
        if (cancelled) return
        const media = Array.isArray(bg.media) ? bg.media : []
        const videos = Array.isArray(task.videos) ? task.videos : []
        const json = JSON.stringify([media, videos])
        if (json === mediaJsonRef.current) return
        mediaJsonRef.current = json
        bgMediaRef.current = media
        setBgMedia(media)
        setTaskVideos(videos.map(name => `${base}/media/task-videos/${encodeURIComponent(name)}`))
        resetBg()
      } catch (err) {
        console.error('[ui-voice] companion media list failed:', err)
      }
    }
    void load()
    const timer = window.setInterval(load, 30000)
    const onPersonaChange = () => { void load() }
    window.addEventListener('dsh-voice:persona', onPersonaChange)
    return () => {
      cancelled = true
      window.clearInterval(timer)
      window.removeEventListener('dsh-voice:persona', onPersonaChange)
    }
  }, [resetBg])
```

</details>

**依据 8 · 源码核查**：[src/client/voice/companion.tsx:503-527](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/companion.tsx#L503-L527)

DH全局轮询。

<details>
<summary>查看原文（25行）</summary>

```text

  // Digital human: poll the bridge task state every 4 s and drive playback.
  useEffect(() => {
    let cancelled = false
    const poll = async () => {
      const status = await dhStatus()
      if (cancelled || status === null) return
      setDh((prev) => {
        if (prev === null) return status
        if (
          prev.state === status.state &&
          prev.video_url === status.video_url &&
          prev.progress === status.progress &&
          prev.message === status.message
        ) return prev
        return status
      })
      driveDh(status)
    }
    void poll()
    const timer = window.setInterval(poll, 4000)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
```

</details>

**依据 9 · 源码核查**：[src/client/voice/companion.tsx:565-633](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/companion.tsx#L565-L633)

code无会话归属，fallback无总闸。

<details>
<summary>查看原文（69行）</summary>

```text

  const driveDh = (status: DhStatus): void => {
    const code = status.code
    if (!code) return
    if (!readDigitalHuman()) {
      dhQueueRef.current = []
      stopDh()
      return
    }
    if (code !== dhQueueCodeRef.current) {
      dhQueueCodeRef.current = code
      dhQueueRef.current = []
      dhQueuePlayedRef.current = 0
      handledDhRef.current.delete(code)
      stopDh()
    }
    if (handledDhRef.current.has(code)) return
    if (status.state === 'discarded') {
      handledDhRef.current.add(code)
      waitingDhRef.current = null
      dhQueueRef.current = []
      stopDh()
      return
    }
    if (status.state === 'error' && status.pending === 0) {
      handledDhRef.current.add(code)
      waitingDhRef.current = null
      dhQueueRef.current = []
      stopDh()
      if (status.text) {
        void tts(status.text)
          .then(wav => speaker.speak(wav))
          .catch(err => console.error('[ui-voice] DH fallback TTS failed:', err))
      }
      return
    }
    if (status.state === 'tts' || status.state === 'generating') {
      const now = Date.now()
      const timeoutMs = 60000 + (status.total_segments || 1) * 25000
      if (waitingDhRef.current === null || waitingDhRef.current.code !== code) {
        waitingDhRef.current = { code, at: now }
      } else if (now - waitingDhRef.current.at > timeoutMs) {
        handledDhRef.current.add(code)
        waitingDhRef.current = null
        dhQueueRef.current = []
        dhDiscard(code)
        stopDh()
        if (status.text) {
          void tts(status.text)
            .then(wav => speaker.speak(wav))
            .catch(err => console.error('[ui-voice] DH timeout TTS failed:', err))
        }
        return
      }
    }
    if (status.state === 'generating' || status.state === 'done') {
      const base = bridgeBase()
      for (const v of status.videos ?? []) {
        const url = `${base}${v.video_url}`
        if (!dhQueueRef.current.includes(url)) dhQueueRef.current.push(url)
      }
      if (status.state === 'done') {
        handledDhRef.current.add(code)
        waitingDhRef.current = null
      }
      if (!dhPlayingRef.current && dhQueuePlayedRef.current < dhQueueRef.current.length) {
        playNextDh()
      }
    }
```

</details>

#### 缺口

- 外部voice bridge/NapCat/DUIX源码与运行认证、账号allowlist/消息ack未在本组件范围。
  **影响**：不能证实真实QQ送达/多会话隔离或disable终止外部任务。
  **进一步探讨**：先独立固定审配套服务，再用虚构数据/测试账号验证入站许可、历史不推送和停用竞态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 桥地址、并发、持久化和停止会留下哪些边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

bridgeBase直接采localStorage覆盖，默认http://127.0.0.1:8765但没有loopback/scheme白名单；所有fetch/WS复用该地址，未见Authorization或token协议。不是结论“公网已开放”，而是客户端不保证本地，改地址即可把PCM、回复、余额请求交别的服务。浏览器CORS/mixed-content、桥的Origin/认证与HTTPS部署由外部保证，默认本机不替代这些合同。

开关/音色/形象/窗口位置保存在浏览器origin的localStorage，非DSH_HOME或用户身份；没有storage事件协调或按session隔离。音色选择先写localStorage再POST，快速切换无序列保护，POST未检查ok即再读列表；失败可造成本地偏好与桥不一致，刷新还会重发选择。各会话监听共用一个speaker/abort holder，多个挂载listener可能互相覆盖控制器和抢占全局桥状态，未见跨标签租约或按任务仲裁，不把注释“只一个标签”当实现。

停止麦克风清队列/track/context，正常稳态有释放路径，但在STT await之后没有再检stop，进行中的STT仍可能sendText；录音start等待getUserMedia期间stop后，没有late-resolution released检查再stop新返回track，因此存在许可延迟后的资源竞态，未运行验证。正常无声时onChunk先累积再因!speaking返回，maxTimer仅onLevel开始speaking后启动；长待机可持续积PCM，没有空闲缓冲上限，所谓30秒是说话启动后的计时，不是所有录音绝对界限。

关闭朗读会stop speaker并abort当前holder，但unmount回复监听只register(null)，没abort已发请求、没disposed标记使chain失效，晚到请求仍可能往共享speaker排队；Host插件整体dispose使speaker拒绝新音频，但不证明外部生成取消。DH/QQ已发数据、桥配置与文件、DSH消息历史不会因卸插件被回滚。余额代码实际挂载并每10分钟fetch及点击刷新；“零轮询”入口注释与实现不符，桥缓存命中/账户权限没核。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/bridge.ts:7-16](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/bridge.ts#L7-L16)

任意localStorage桥URL。

<details>
<summary>查看原文（10行）</summary>

```text
const DEFAULT_BRIDGE = 'http://127.0.0.1:8765'

/** Resolve the bridge base URL (localStorage override wins). */
export function bridgeBase(): string {
  try {
    return localStorage.getItem('s2s.voice.bridge')?.trim() || DEFAULT_BRIDGE
  } catch {
    return DEFAULT_BRIDGE
  }
}
```

</details>

**依据 2 · 源码核查**：[src/client/bridge.ts:33-64](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/bridge.ts#L33-L64)

请求未含身份token。

<details>
<summary>查看原文（32行）</summary>

```text
/** Speech to text: raw 16 kHz mono PCM16 -> { text, language }. */
export async function stt(pcm16: ArrayBuffer): Promise<{ text: string; language?: string }> {
  const resp = await fetch(`${bridgeBase()}/api/stt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-Max-Audio-Sec': '30',
    },
    body: pcm16,
  })
  if (!resp.ok) {
    const body = await resp.text().catch(() => '')
    throw new Error(`voice bridge /api/stt failed: ${resp.status} ${body}`.trim())
  }
  return resp.json() as Promise<{ text: string; language?: string }>
}

/** Text to speech: { text } -> 16 kHz mono PCM16 WAV bytes. */
export async function tts(text: string, signal?: AbortSignal): Promise<ArrayBuffer> {
  const init: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }
  if (signal !== undefined) init.signal = signal
  const resp = await fetch(`${bridgeBase()}/api/tts`, init)
  if (!resp.ok) {
    const body = await resp.text().catch(() => '')
    throw new Error(`voice bridge /api/tts failed: ${resp.status} ${body}`.trim())
  }
  return resp.arrayBuffer()
}
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:50-64](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/index.ts#L50-L64)

共享speaker与abort holder。

<details>
<summary>查看原文（15行）</summary>

```text
  // One shared speaker per plugin fiber: the reply listener plays through it
  // and the companion window reads its `speaking` state.
  const speaker = new ReplySpeaker()
  ctx.effect(() => () => speaker.dispose(), 'ui-voice: speaker teardown')

  // One shared companion controller: the window renders it, the toggle flips it.
  const companion = new CompanionController()

  // One shared TTS abort holder: the reply listener registers its current
  // AbortController; the voice toggle aborts it when turned off so the bridge
  // stops synthesizing (client disconnect) instead of draining its queue.
  let activeTtsController: AbortController | null = null
  // Barge-in handler registered by the reply listener (swallow the current
  // reply when the user starts speaking).
  let interruptHandler: (() => void) | null = null
```

</details>

**依据 4 · 源码核查**：[src/client/PersonaToggle.tsx:124-171](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/PersonaToggle.tsx#L124-L171)

恢复/先存再POST/无ok或序列。

<details>
<summary>查看原文（48行）</summary>

```text
    const savedIdle = readSaved(PERSIST.idle)
    const patch: Record<string, string> = {}
    if (savedVoice !== null && state.voices.some(v => v.name === savedVoice)) patch.voice = savedVoice
    if (savedAvatar !== null && state.avatars.some(a => a.name === savedAvatar)) patch.avatar = savedAvatar
    if (savedIdle !== null && state.idles.some(i => i.name === savedIdle)) patch.idle = savedIdle
    if (Object.keys(patch).length === 0) return
    void fetch(`${bridgeBase()}/api/persona/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
      .then(() => fetch(`${bridgeBase()}/api/persona/list`).then(r => r.json() as Promise<PersonaState>))
      .then((s) => { if (aliveRef.current) setState(s) })
      .catch(err => console.error('[ui-voice] persona restore failed:', err))
  }, [applied, state])

  const cycle = useCallback((kind: Kind) => {
    if (state === null) return
    const meta = KIND_META[kind]
    const list = kind === 'voice' ? state.voices : kind === 'avatar' ? state.avatars : state.idles
    if (list.length === 0) return
    const current = state.current[meta.key]
    const idx = list.findIndex(x => x.name === current)
    const next = list[(idx + 1) % list.length]
    if (next === undefined) return
    const patch = { [kind]: next.name }
    writeSaved(PERSIST[kind], next.name)
    void fetch(`${bridgeBase()}/api/persona/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
      .then(() => fetch(`${bridgeBase()}/api/persona/list`).then(r => r.json() as Promise<PersonaState>))
      .then((s) => {
        if (!aliveRef.current) return
        setState(s)
        // 通知 companion 立即刷新待机动画（不等 30s 轮询）。
        window.dispatchEvent(new CustomEvent('dsh-voice:persona', { detail: { kind, name: next.name } }))
      })
      .catch(err => console.error(`[ui-voice] persona ${kind} switch failed:`, err))
  }, [state])

  if (state === null) return null

  const currentVoice = state.current.voice
  const currentAvatar = state.current.avatar
  const currentIdle = state.current.idle
  const voiceLabel = state.voices.find(v => v.name === currentVoice)?.label ?? currentVoice
```

</details>

**依据 5 · 源码核查**：[src/client/MicButton.tsx:50-54](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/MicButton.tsx#L50-L54)

unmount释放当前recorder。

```text
  // Release the mic if the control unmounts mid-capture.
  useEffect(() => () => {
    recorderRef.current?.stop()
    recorderRef.current = null
  }, [])
```

**依据 6 · 源码核查**：[src/client/MicButton.tsx:70-101](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/MicButton.tsx#L70-L101)

await后无stop重验。

<details>
<summary>查看原文（32行）</summary>

```text
  // Drain queued utterances serially: STT -> send -> next (continuous mode).
  const drain = useCallback(async () => {
    if (drainRunningRef.current) return
    drainRunningRef.current = true
    try {
      while (queueRef.current.length > 0) {
        if (recorderRef.current === null) break // user stopped listening
        const pcm = queueRef.current.shift()!
        setPhase('transcribing')
        try {
          const { text } = await stt(pcm)
          if (text !== undefined && text.trim() !== '') {
            await sendText(text.trim())
          }
        } catch (err) {
          console.error('[ui-voice] stt/send failed:', err)
        }
      }
    } finally {
      drainRunningRef.current = false
      setPhase(recorderRef.current !== null ? 'listening' : 'idle')
    }
  }, [sendText])

  const toggle = useCallback(async () => {
    if (recorderRef.current !== null) {
      // Stop: end continuous listening, drop any queued utterances.
      recorderRef.current.stop()
      recorderRef.current = null
      queueRef.current = []
      setPhase('idle')
      return
```

</details>

**依据 7 · 源码核查**：[src/client/voice/recorder.ts:143-155](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/recorder.ts#L143-L155)

异步授权后直接接stream。

<details>
<summary>查看原文（13行）</summary>

```text
  /** Acquire the mic and start the capture worklet. */
  async start(): Promise<void> {
    this.released = false
    const ctx = new AudioContext({ latencyHint: 'interactive' })
    this.ctx = ctx
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    })
    this.stream = stream
```

</details>

**依据 8 · 源码核查**：[src/client/voice/recorder.ts:191-214](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/recorder.ts#L191-L214)

stop当前资源。

<details>
<summary>查看原文（24行）</summary>

```text
  /** Stop capture and release the mic / AudioContext. */
  stop(): void {
    if (this.released) return
    this.released = true
    if (this.maxTimer !== null) {
      clearTimeout(this.maxTimer)
      this.maxTimer = null
    }
    this.opts.vad?.close()
    this.node?.port.close()
    this.source?.disconnect()
    this.stream?.getTracks().forEach(track => track.stop())
    void this.ctx?.close().catch(() => {})
    this.node = null
    this.source = null
    this.stream = null
    this.ctx = null
    this.chunks = []
    this.chunkBytes = 0
    this.speaking = false
    this.interruptMode = false
    this.interruptArmed = false
    this.confirmArmed = false
  }
```

</details>

**依据 9 · 源码核查**：[src/client/voice/recorder.ts:247-293](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/recorder.ts#L247-L293)

无声累积且timer语音后启动。

<details>
<summary>查看原文（47行）</summary>

```text
    const threshold = this.opts.rmsThreshold ?? DEFAULT_RMS_THRESHOLD
    if (rms >= threshold) {
      this.lastVoiceAt = performance.now()
      if (!this.speaking) {
        this.speaking = true
        this.armMaxTimer()
        this.opts.onSpeakingChange?.(true)
      }
    }
  }

  private onChunk(buffer: ArrayBuffer): void {
    if (this.released || this.paused) return
    if (this.interruptMode) {
      // Barge-in mode: stream to the bridge VAD, never accumulate.
      this.opts.vad?.send(buffer)
      return
    }
    this.chunks.push(buffer)
    this.chunkBytes += buffer.byteLength
    if (!this.speaking) return
    const silenceMs = performance.now() - this.lastVoiceAt
    if (silenceMs >= (this.opts.minSilenceMs ?? DEFAULT_MIN_SILENCE_MS)) this.flush()
  }

  private armMaxTimer(): void {
    if (this.maxTimer !== null) clearTimeout(this.maxTimer)
    this.maxTimer = setTimeout(
      () => this.flush(),
      this.opts.maxUtteranceMs ?? DEFAULT_MAX_UTTERANCE_MS,
    )
  }

  private flush(): void {
    if (this.released) return
    if (this.maxTimer !== null) {
      clearTimeout(this.maxTimer)
      this.maxTimer = null
    }
    const pcm = this.chunkBytes > 0 ? this.concatChunks() : null
    this.chunks = []
    this.chunkBytes = 0
    if (this.speaking) {
      this.speaking = false
      this.opts.onSpeakingChange?.(false)
    }
    if (pcm !== null) this.opts.onUtterance(pcm)
```

</details>

**依据 10 · 源码核查**：[src/client/voice/reply-listener.tsx:134-140](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/reply-listener.tsx#L134-L140)

清理仅清holder和timer。

```text
  // Unmount: stop playback, release any in-flight TTS, clear DH debounce timers.
  useEffect(() => () => {
    speaker.stop()
    _registerTtsAbort(null)
    for (const { timer } of dhLastDebounceRef.current.values()) clearTimeout(timer)
    dhLastDebounceRef.current.clear()
  }, [speaker, _registerTtsAbort])
```

**依据 11 · 源码核查**：[src/client/VoiceToggle.tsx:51-64](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/VoiceToggle.tsx#L51-L64)

关闭朗读只控制当前播放/TTS。

<details>
<summary>查看原文（14行）</summary>

```text
  const toggle = useCallback(() => {
    setOn((previous) => {
      const next = !previous
      try {
        localStorage.setItem(VOICE_ENABLED_KEY, next ? '1' : '0')
      } catch {
        // persistence unavailable — state still flips for this session
      }
      if (!next) {
        speaker.stop()
        abortTts()
      }
      return next
    })
```

</details>

**依据 12 · 源码核查**：[src/client/BalanceBadge.tsx:47-83](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/BalanceBadge.tsx#L47-L83)

实际余额10分钟轮询。

<details>
<summary>查看原文（37行）</summary>

```text
const REFRESH_MS = 10 * 60 * 1000 // aligned with the bridge's 10-min cache

/** Full props: framework runtime share (composer.dock) + locale seat + face. */
export type BalanceBadgeProps =
  PropsRuntime<'conversation.composer.dock'> & PropsLocale<'voice'> & VoiceInjected

/**
 * @param props - framework runtime + locale seats.
 */
export const BalanceBadge = memo(function BalanceBadge(_props: BalanceBadgeProps) {
  const [label, setLabel] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const aliveRef = useRef(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await fetch(`${bridgeBase()}/api/balance`)
      if (!resp.ok) return
      const json = (await resp.json()) as BalanceResp
      if (aliveRef.current) setLabel(formatBalance(json))
    } catch {
      // Bridge offline: keep the previous value; the next tick retries.
    } finally {
      if (aliveRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    aliveRef.current = true
    void load()
    const timer = window.setInterval(() => { void load() }, REFRESH_MS)
    return () => {
      aliveRef.current = false
      window.clearInterval(timer)
    }
  }, [load])
```

</details>

#### 缺口

- 浏览器许可延迟/并发挂载/停用竞态和空闲内存增长未运行复现。
  **影响**：属于明确源码条件边界，不能计算发生率/延迟或判定已暴露账号。
  **进一步探讨**：隔离桥桩延迟STT/TTS/许可、两会话和长静默，观察停止后请求、track与缓冲。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 已有方案贡献在哪里，完整部署与资源成本怎样分担？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

本组件贡献是DSH浏览器到外部语音栈的接线：按会话prompt、PCM采集/端点/插话、文本句流排队、口型结果播放与QQ WebSocket转交。ASR/TTS/VAD模型、GPU生成、NapCat发信和DSH Agent/工具均来自外部。worklet明示复用hf-realtime-voice，不能算自研声学突破；数字人/音色选择是外观/声音，不更换DSH人格preset，也没有检到长期记忆治理。相对独立听写+朗读，串联了输入输出，但未解决可靠停用/跨会话/回执限制。

包0.4.0 MIT，engines.dsh>=0.1.3-alpha.1 <0.3.0，没有Node engines；README作者报告0.2.1-rc.2与0.1.3-alpha.1实测，属于作者记录非本次验收。prepare用esbuild生成lib，固定inventory无发行lib，故不能拿作者截图代本次构建通过。browser依赖Host slots/locale/sessions/useChat、React^18.2。完整使用需另一仓库voice bridge、FunASR、OmniVoice WSL2/FlashInfer，数字人另Docker DUIX及模型/形象/声音素材，QQ需NapCat与账号；这些不随装本包自动成立。浏览器麦克风权限/AudioWorklet/自动播放、可达桥与模型服务也是条件。

首次由用户部署多服务/模型和可信素材，核桥地址/身份及测试会话，不先接日常账号；持续承担GPU/显存/CPU、电费、模型服务/账号费用与历史/媒体磁盘，人工处理识别纠错、失败链与版本同步。现金/工时未量化，不能写0。失败可回键盘/原生文字，但STT或TTS已发不可追收；退出须关录音、停浏览器插件、另停桥/GPU/QQ并按各存储清理。相对既有自托管语音链，包未改变算力供给、池化、采购计价或服务责任结构，不能把局部整合或潜在节时计经济创新。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-27](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/package.json#L1-L27)

版本/DSH范围/浏览器入口。

<details>
<summary>查看原文（27行）</summary>

```text
{
  "name": "@beiyege-01/dsh-voice-ai-girlfriend",
  "version": "0.4.0",
  "description": "Voice AI girlfriend for DeepSeek Harness 0.2.x: FunASR mic input, OmniVoice TTS replies, companion animation window, QQ two-way chat. Needs the repo's voice bridge + NapCat.",
  "type": "module",
  "engines": {
    "dsh": ">=0.1.3-alpha.1 <0.3.0"
  },
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[package.json:29-47](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/package.json#L29-L47)

构建/React/许可。

<details>
<summary>查看原文（19行）</summary>

```text
  "scripts": {
    "build": "node build.mjs",
    "prepare": "node build.mjs"
  },
  "files": [
    "lib/",
    "cordis.patch.yml",
    "README.md"
  ],
  "peerDependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "esbuild": "^0.25.0",
    "typescript": "^5.0.0",
    "@types/react": "~18.3.1"
  },
  "license": "MIT"
}
```

</details>

**依据 3 · 源码核查**：[src/client/worklets/mic-capture.ts:1-9](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/worklets/mic-capture.ts#L1-L9)

采集worklet继承归因。

```text
/**
 * Embedded copy of hf-realtime-voice/worklets/mic-capture.js (verbatim from
 * the user's project) so the plugin can register it via a Blob URL — plugin
 * bundles are built by tsdown, not Vite, so ?raw imports are unavailable.
 *
 * Processor: resamples the AudioContext rate (typically 48 kHz) to 16 kHz,
 * packs little-endian Int16 PCM, posts ~40 ms chunks; also posts {kind:'level'}
 * RMS per chunk for the main-thread endpointing.
 */
```

**依据 4 · 源码核查**：[build.mjs:78-106](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/build.mjs#L78-L106)

实际构建出口非已运行。

<details>
<summary>查看原文（29行）</summary>

```text
await build({
  entryPoints: ['src/index.ts'],
  outfile: 'lib/index.js',
  bundle: false,
  format: 'esm',
  platform: 'node',
  logLevel: 'info',
})

await build({
  entryPoints: ['src/client/index.ts'],
  outfile: 'lib/client.js',
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  jsx: 'automatic',
  external: EXTERNALS,
  plugins: [dshCssModules],
  banner: {
    js:
      `window.__ModuleLoader__.load({ id: ${JSON.stringify(PKG_ID)}, factory: (require) => {\n` +
      'var module = { exports: {} }; var exports = module.exports;',
  },
  footer: {
    js: 'return module.exports; } });',
  },
  logLevel: 'info',
})

```

</details>

**依据 5 · 源码核查**：[README.md:3-25](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/README.md#L3-L25)

作者兼容实测与外部栈范围。

<details>
<summary>查看原文（23行）</summary>

```text
DeepSeek Harness 的**浏览器语音插件**：麦克风语音输入、回复朗读（TTS）、AI 女友动画窗、QQ 双向对话。

> ✅ **已适配 DSH 0.2.1（2026-10-25 实测，`v0.4.0`）**：在 `dsh 0.2.1-rc.2` / profile `web-v021` / `:3092` 上实测通过——插件正常加载、工具行与女友窗渲染、`useChat` 的 `assistant-step` 回复文本可读、回复触发桥接 `/api/tts` 与 `/api/dh/speak`、余额 pill 显示在 composer 底部统计行。0.2.x 的 Web 插件系统（`window.__ModuleLoader__.load`、`<style data-plugin-css>`、`conversation.input.dock` / `input.left` / `composer.dock` 槽位）与 0.1.3 保持同一套契约，无需改动业务代码。
>
> ✅ **兼容 dsh 0.1.3-alpha.1**（`v0.3.x` 已验证）；rc.8 请使用 `v0.3.0`。

> 🎥 **成品展示**（抖音）：
> - [口播视频效果 ①](https://www.douyin.com/user/self?from_tab_name=main&modal_id=7676326565919149339)
> - [口播视频效果 ②](https://www.douyin.com/user/self?from_tab_name=main&modal_id=7678063553395412259)

> ⚠️ **本插件是完整方案的一部分**：语音识别/合成依赖配套的 **voice bridge**（Python 服务，FunASR + OmniVoice TTS（WSL2 + FlashInfer）），QQ 对话依赖 **NapCatQQ**。请配合完整仓库使用：**[beiyege-01/dsh-voice-ai-girlfriend](https://github.com/beiyege-01/dsh-voice-ai-girlfriend)**（含桥接代码、模型准备、一键启动脚本、安装文档）。

## 适配版本

| 组件 | 适配版本 | 状态 |
|---|---|---|
| **DSH（主用）** | `dsh 0.2.1-rc.2` / profile `web-v021`（端口 3092） | ✅ 2026-10-25 实测通过 |
| **DSH（兼容）** | `dsh 0.1.3-alpha.1` / profile `web-v013`（端口 3080） | ✅ 2026-09-14 实测通过 |
| **DSH（旧版）** | `rc.8` / profile `web` | 用插件 `v0.3.0`；`v0.4.0` 声明 `engines.dsh >=0.1.3-alpha.1` |
| 本插件 | `@beiyege-01/dsh-voice-ai-girlfriend` **`v0.4.0`** | 构建：`node build.mjs` → `lib/client.js` |
| 语音桥接 | `voice_bridge.py`（FastAPI/uvicorn `:8765`，Python 3.14 venv） | 配套主仓库 |
| TTS 引擎 | OmniVoice（WSL2 + FlashInfer `:9877`） | 音色全部为 OmniVoice 克隆 |
| 数字人 | DUIX `guiji2025/duix.avatar-5090:trt10.9`（宿主 `:9000`） | 冷启动 1-3 分钟 |
```

</details>

**依据 6 · 源码核查**：[README.md:61-80](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/README.md#L61-L80)

使用桥及作者验证记录。

<details>
<summary>查看原文（20行）</summary>

````text
## 使用前提

1. 克隆主仓库并按其 README 装好 voice bridge（`start-all.cmd` 一键）
2. 本插件的桥接地址默认 `http://127.0.0.1:8765`（localStorage `s2s.voice.bridge` 可改）

## 构建

```bash
npm install
node build.mjs   # 产物 lib/client.js（browser bundle）+ lib/index.js（服务端空入口）
```

## 验证记录（DSH 0.2.1-rc.2）

- 插件入口出现在 `window.__DSH_BOOT__` 的 application batch，`/plugins/??<pkg>/client.js` 返回 200。
- 浏览器控制台出现 `[ui-voice] loaded, bridge = http://127.0.0.1:8765`，无插件异常。
- 工具行 8 个控件（音色 / 形象 / 待机 / 麦克风 / 朗读 / 数字人 / QQ / 女友窗 / 插话）全部渲染。
- 发送一条真实消息：`assistant-step` 文本被回复监听器读到，桥接收到 `POST /api/dh/speak`（数字人提交）与 `POST /api/tts`。
- **数字人端到端**（2026-10-25 补测，Docker + OmniVoice 就绪时）：短回复生成 `1/1 段`，`/media/dh/<code>-s0-r.mp4` 时长 14.56s、1024×1024，女友窗视频 `paused=false`、`opacity=1` 正常播放。
- composer 底部统计行显示 `余额 ¥128.66`。
````

</details>

#### 缺口

- 配套服务安装、模型硬件/许可、语音准确性与GPU成本不在本次实测。
  **影响**：不能承诺一装可用、全离线、600语言效果或净成本优势。
  **进一步探讨**：先固定桥和模型清单审认证/资源，再申请隔离非敏感最小实验。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前应怎样采用，最值得先验证哪个改进？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前观察，不建议直接接日常QQ/敏感Agent。已有整套自托管语音环境的开发者可先用隔离浏览器origin和虚构文本研究桥合同，默认先关QQ出站、朗读与数字人，并在桥侧断开QQ输入；本次没有启动实验。它连接说话/听回复而不改变Agent执行权限，停用缺口和外部桥身份未核妨碍把完整方案列为直接试用。不能靠QQ按钮off认定入站已停；若必须临时体验，先完成桥固定版本审查和停止后不再发送的验收，否则退键盘文字聊天。

可证伪方向是复用已有会话绑定，把每段输入/音视频/QQ交接都带sessionId、requestId、取消generation及已接受/已送达状态；UI各开关明确作用于录音、朗读、数字人生成与QQ两个方向，停用等待在途请求终结而不只清holder。依据是现有浏览器ref去重与桥全局code无会话对应，且关闭后仍有在途窗口。先做本地协议桩，不接真实账号，测首条回复、历史加载、关闭时STT未回、QQ断线/重挂、多会话五类情形，比较错误外发/漏播/停用后请求和排障时间。若配套桥已提供完整会话/幂等/撤销协议，应直接消费它；若用户只要听写或朗读，系统现成输入法/TTS与DSH组合更简单，不应增建整套GPU陪伴栈。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:66-89](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/index.ts#L66-L89)

可复用会话绑定。

<details>
<summary>查看原文（24行）</summary>

```text
  const injectFace = (sessionId: SessionId | undefined): VoiceInjected => ({
    sendText: async (text: string) => {
      if (sessionId === undefined) throw new Error('[ui-voice] no session scope for sendText')
      const binding = ctx.sessions.binding(sessionId)
      const session = binding?.session
      if (session === undefined) throw new Error('[ui-voice] session unavailable for sendText')
      // Voice input must send IMMEDIATELY: when the agent's turn is still
      // running (my reply streaming), a plain queue would sit as a pending
      // item in the input dock, needing a manual send — the "second sentence
      // stuck" bug. Default: steer, which interrupts the running turn.
      // The BusyToggle flips this to pure queue for continuous conversation
      // (let the current turn finish, then the sentence auto-sends).
      const running = session.getSnapshot()?.running === true
      let interrupt = true
      try {
        interrupt = localStorage.getItem('s2s.voice.interrupt') !== '0'
      } catch {
        // persistence unavailable — fall back to the interrupt default
      }
      const mode = running && interrupt ? 'steer' : 'queue'
      const result = await session.prompt([{ type: 'text', text }], mode)
      if (!result.ok) {
        throw new Error(`[ui-voice] prompt failed: ${result.error.code}: ${result.error.message}`)
      }
```

</details>

**依据 2 · 源码核查**：[src/client/voice/qq-bridge.tsx:131-155](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/qq-bridge.tsx#L131-L155)

本地anchor无ack。

<details>
<summary>查看原文（25行）</summary>

```text
    const ws = wsRef.current
    const open = ws !== null && ws.readyState === WebSocket.OPEN
    const sendQq = (pick: TurnPick): void => {
      if (pick.anchor <= lastReplyAnchorRef.current) return
      lastReplyAnchorRef.current = pick.anchor
      if (open) ws.send(JSON.stringify({ type: 'reply', text: pick.text }))
    }
    for (const [ua, { first, last }] of perUserTurn) {
      sendQq(first)
      if (first.anchor === last.anchor) {
        const existing = qqLastDebounceRef.current.get(ua)
        if (existing !== undefined) {
          clearTimeout(existing.timer)
          qqLastDebounceRef.current.delete(ua)
        }
        continue
      }
      const existing = qqLastDebounceRef.current.get(ua)
      if (existing !== undefined) clearTimeout(existing.timer)
      const timer = setTimeout(() => {
        qqLastDebounceRef.current.delete(ua)
        sendQq(last)
      }, LAST_DEBOUNCE_MS)
      qqLastDebounceRef.current.set(ua, { timer, anchor: last.anchor })
    }
```

</details>

**依据 3 · 源码核查**：[src/client/MicButton.tsx:70-101](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/MicButton.tsx#L70-L101)

停用在途边界。

<details>
<summary>查看原文（32行）</summary>

```text
  // Drain queued utterances serially: STT -> send -> next (continuous mode).
  const drain = useCallback(async () => {
    if (drainRunningRef.current) return
    drainRunningRef.current = true
    try {
      while (queueRef.current.length > 0) {
        if (recorderRef.current === null) break // user stopped listening
        const pcm = queueRef.current.shift()!
        setPhase('transcribing')
        try {
          const { text } = await stt(pcm)
          if (text !== undefined && text.trim() !== '') {
            await sendText(text.trim())
          }
        } catch (err) {
          console.error('[ui-voice] stt/send failed:', err)
        }
      }
    } finally {
      drainRunningRef.current = false
      setPhase(recorderRef.current !== null ? 'listening' : 'idle')
    }
  }, [sendText])

  const toggle = useCallback(async () => {
    if (recorderRef.current !== null) {
      // Stop: end continuous listening, drop any queued utterances.
      recorderRef.current.stop()
      recorderRef.current = null
      queueRef.current = []
      setPhase('idle')
      return
```

</details>

**依据 4 · 源码核查**：[src/client/voice/reply-listener.tsx:191-210](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/voice/reply-listener.tsx#L191-L210)

首回复可证伪路径。

<details>
<summary>查看原文（20行）</summary>

```text
    // First settled assistant node arrives: freeze the history baseline so
    // pre-existing replies never replay (page load, session revisit, history
    // pagination). Running nodes are live replies — they are NOT used here,
    // so a fresh reply in a new session still speaks.
    if (baselineRef.current === null) {
      let maxAnchor = 0
      let hasSettled = false
      for (const node of chatNodes(chat)) {
        if (node.kind !== 'assistant-step') continue
        const data = assistantData(node)
        if (data === undefined) continue
        if (data.status === 'settled') hasSettled = true
        if (node.anchorSeq > maxAnchor) maxAnchor = node.anchorSeq
      }
      if (hasSettled && maxAnchor > 0) {
        baselineRef.current = maxAnchor
        skipUntilRef.current = maxAnchor
      }
      return
    }
```

</details>

**依据 5 · 源码核查**：[src/client/bridge.ts:90-120](https://github.com/beiyege-01/dsh-voice-ai-girlfriend-plugin/blob/f367998b05f03ea3a5babf2ef57e6631065707ab/src/client/bridge.ts#L90-L120)

code提交/discard合同。

<details>
<summary>查看原文（31行）</summary>

```text
export function dhSpeak(text: string): Promise<string | null> {
  const body = (text || '').trim()
  if (!body) return Promise.resolve(null)
  return fetch(`${bridgeBase()}/api/dh/speak`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: body }),
  })
    .then(async (resp) => {
      if (!resp.ok) {
        const b = await resp.text().catch(() => '')
        throw new Error(`/api/dh/speak failed: ${resp.status} ${b}`.trim())
      }
      const json = (await resp.json()) as { code?: string }
      return json.code ?? null
    })
    .catch((err) => {
      console.error('[ui-voice] digital human submit failed:', err)
      return null
    })
}

/** Discard a submitted digital-human task (barge-in / new turn): its result
 *  will never be played. Safe to call with null (no-op). */
export function dhDiscard(code: string | null | undefined): void {
  if (!code) return
  void fetch(`${bridgeBase()}/api/dh/discard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  }).catch(err => console.error('[ui-voice] digital human discard failed:', err))
```

</details>

#### 缺口

- 候选协议改进及跨组件桥已有能力未核，需求对照未执行。
  **影响**：候选不算当前贡献；当前保持观察。
  **进一步探讨**：先审桥合同后做桩对照，若现成协议足够直接适配。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
