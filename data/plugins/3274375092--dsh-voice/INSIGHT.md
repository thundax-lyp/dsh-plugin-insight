# dsh-voice

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[de3911b](https://github.com/3274375092/dsh-voice/tree/de3911b18e4ecc9ec1bad7709c66c45b62c57f46)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/3274375092/dsh-voice) [![npm 30d 578](https://img.shields.io/static/v1?label=npm+30d&message=578&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@nn12138/dsh-voice) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@nn12138/dsh-voice)
<!-- END META -->

> **实现功能**：在 DSH 网页用麦克风或快捷键语音输入，支持本机 ASR 与浏览器识别并作为正常消息提交。

> **核心亮点**：把麦克风、热键、原生/浏览器识别和正常会话提交组合成preset无关输入通道；ASR模型和VAD来自既有组件。详见[Q01](#research-q01)。

> **风险与缺陷**：auto回退不保证音频本地处理，stop会把partial也提交，识别错词可能直接触发Agent；四会话LRU还可能断句。静态核查不等声学/隐私验证。详见[Q03](#research-q03)。

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
  - [Q01 · 输入法式语音适合谁，增量是什么？](#detail-section-11)
  - [Q02 · 音频与配置怎样从浏览器到host再提交？](#detail-section-12)
  - [Q03 · 回退、自动提交和会话池有什么限制？](#detail-section-13)
  - [Q04 · 依赖与三阶段成本是什么？](#detail-section-14)
  - [Q05 · 工程可借鉴什么，能推导怎样的采用路径？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户希望口述非敏感需求，合格结果是完整文本只发一次到正确会话，不把识别结果当无须复核的指令。详见[Q01](#research-q01)。

系统语音输入法或普通键盘为简单替代，插件增加DSH内按钮、热键和可选本机识别接线。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 语音输入 | 口述正常消息 | 停麦自动发送需注意误词 |
| 双引擎 | 本机识别/浏览器回退 | 隐私和依赖不同 |
| 会话识别池 | 分离VAD与partial | 默认四会话LRU可能断句 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| 麦克风/浏览器API | 输入采声 | 拒权或不支持回键盘 |
| DSH connection/sessions/slots | 配置和消息接线 | 需RPC与提交契约匹配 |
| 可选sherpa-onnx与模型 | 本机识别 | 缺失会回退browser |
| 浏览器识别服务 | 回退路线 | 实际网络/隐私依浏览器 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 安装并选引擎 | 用户 | 知道真实生效路线 |
| 授权麦克风试非敏感句 | 用户 | 回显完整 |
| 停麦后核对发送 | 用户/插件 | 正确会话、无重复误发 |
| 错误回退或重录 | 用户 | 不重复触发错误任务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 可选模型/原生包与磁盘 | 麦克风授权、引擎和热键核对 | 可选模型/原生包占盘；下载与授权准备时间未知 |
| 持续使用 | native CPU/内存或浏览器服务；后续Agent费用仍在 | 说话、校对和停麦 | native CPU/浏览器服务及后续Agent费依引擎；效率未测 |
| 失败恢复 | 重录、模型修复及误发后任务成本 | 改错/取消任务、回键盘 | 重录/模型修复/误发任务处置金额和工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 输入不改preset | 正常会话提交 | 不提供语音回复 |
| 离线可选 | native包和模型 | auto回退不保证本地 |
| 流式识别 | partial/final契约 | 词错/尾音/噪声效果未测 |

> **思考**：auto回退不保证音频本地处理，stop会把partial也提交，识别错词可能直接触发Agent；四会话LRU还可能断句。静态核查不等声学/隐私验证。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把麦克风、热键、原生/浏览器识别和正常会话提交组合成preset无关输入通道；ASR模型和VAD来自既有组件。详见[Q01](#research-q01)。

把麦克风、热键、原生/浏览器识别和正常会话提交组合成preset无关输入通道；ASR模型和VAD来自既有组件。详见[Q01](#research-q01)。

模型与会话分离、领域RPC解码和round失效可复用；假模型检验协议不检验识别效果，宿主手写stub不等API验证。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

auto回退不保证音频本地处理，stop会把partial也提交，识别错词可能直接触发Agent；四会话LRU还可能断句。静态核查不等声学/隐私验证。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议非敏感普通对话小范围试用，确认会话、真实引擎和停麦自动提交；误发、回退不透明或截断频繁时停止。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

输入接线、双引擎和会话状态分离有源码支持；识别效果与浏览器隐私未验证。草稿预览为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/client/index.ts、src/client/asr.ts、src/client/runtime.ts、src/client/voice-service.ts、src/core/native-asr.ts、src/core/host-asr.ts、tests/host-asr.spec.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交host/client与识别协议关键源码，未执行麦克风、模型和测试，不把作者smoke存在当通过。
- 下一步：进一步探讨从错词自动提交、引擎回退、多会话LRU和尾句收尾四类样例入手，与系统输入法比较正确发送和总修正负担。

**分析版本**

- **仓库**：[3274375092/dsh-voice](https://github.com/3274375092/dsh-voice)
- **版本号**：0.2.6（[固定提交 de3911b](https://github.com/3274375092/dsh-voice/tree/de3911b18e4ecc9ec1bad7709c66c45b62c57f46)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨停麦进入可编辑草稿并显示真实引擎/回退，以口述反例比较错误任务触发和修正总成本；当前未验证。详见[Q05](#research-q05)。

进一步探讨从错词自动提交、引擎回退、多会话LRU和尾句收尾四类样例入手，与系统输入法比较正确发送和总修正负担。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 439 | — | — | 4600 |
| .cjs | source | 5 | 308 | 250 | 41 | — |
| .mjs | source | 2 | 392 | 318 | 39 | — |
| .ts | source | 16 | 1418 | 996 | 318 | — |
| .tsx | source | 1 | 61 | 45 | 12 | — |
| .ts | test | 14 | 887 | 790 | 30 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3274375092/dsh-voice/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/3274375092/dsh-voice/issues?q=is%3Aissue+created%3A2026-09-22T05%3A06%3A16.464Z..2026-10-22T05%3A06%3A16.464Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3274375092/dsh-voice/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A06%3A16.464Z..2026-10-22T05%3A06%3A16.464Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本双引擎语音如何形成正常DSH消息，回退、自动发送和会话资源边界怎样影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 输入法式语音适合谁，增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向希望在DSH网页对话中口述需求、手不便打字或移动输入的用户。合格结果是识别文本完整、没有意外重复、发送到预期会话，并且用户理解它会作为正常消息触发后续Agent任务。它只改输入通道，不修改persona/preset；不提供语音回复或新的Agent能力。

简单替代是系统语音输入法或浏览器输入框打字。插件把麦克风按钮、快捷键、host原生流式ASR和浏览器回退接进会话提交，减少复制转写文本。zipformer2、Silero VAD和Web Speech均为既有组件，贡献是输入状态与宿主接线，不是ASR模型创新。若系统输入法已经足够、用户需要发送前仔细编辑复杂命令，自动停麦提交未必优于已有输入框。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-16](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/README.md#L5-L16)

作者限定input-only、双引擎和可选模型。

<details>
<summary>查看原文（12行）</summary>

```text
A voice input plugin for DeepSeek Harness: click 🎤 in the web UI (or press a hotkey), speak, and the recognized text is submitted as a normal chat message. **Input only** — it never touches the agent preset/persona, so it behaves like "another input method" in every mode.

[![npm](https://img.shields.io/npm/v/@nn12138/dsh-voice)](https://www.npmjs.com/package/@nn12138/dsh-voice)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Features

- 🎤 **Voice input**: microphone button (platform design-system UI) + configurable global hotkey (Ctrl+Space by default)
- ⚡ **Live recognition**: streaming partial transcripts are echoed while you speak; VAD finalization commits on stop (0.6s tail padding keeps sentence endings)
- 🧠 **Adaptive dual engine**: host-native ASR (sherpa-onnx-node zipformer2 + silero VAD, offline/private) with automatic fallback to browser Web Speech (zero extra dependencies)
- 🔌 **Preset-agnostic**: does not touch the persona/system prompt; works with code/standard/minimal/custom presets
- 📦 **Optional models**: zero-config out of the box; run `dsh-voice-models` when you want native offline recognition
```

</details>

**依据 2 · 源码核查**：[src/client/runtime.ts:186-217](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/client/runtime.ts#L186-L217)

停麦后非空文本直接提交，是合格结果及风险边界。

<details>
<summary>查看原文（32行）</summary>

```text
  /** 停止识别;定稿文本非空则作为一条用户消息提交。幂等;轮次守卫杜绝迟到回调。 */
  async stopMic(sessionId: string): Promise<void> {
    const rec = this.recognizer
    if (rec === null) {
      // 未开始或启动中(引擎探测):作废进行中的启动
      this.round += 1
      this.activeSession = null
      this.listening = false
      this.notify()
      return
    }
    const target = this.activeSession ?? sessionId
    if (this.stopping) return // 防重入:并发进来的停止直接返回,在途的负责收尾
    this.stopping = true
    try {
      await rec.stop() // 契约:resolve 后不再有任何回调
    } catch (err) {
      console.error('dsh-voice ASR 收尾失败:', err)
    }
    this.round += 1 // 作废一切迟到回调
    this.stopping = false
    this.recognizer = null
    this.activeSession = null
    const text = (this.pendingText + this.partialText).trim()
    this.pendingText = ''
    this.partialText = ''
    this.listening = false
    // 下一轮重新按当前 config 解析引擎:host /voice.config 即使在上一轮
    // 识别过程中到达,也会从下一轮开始生效。
    this.engine = null
    this.notify()
    if (text !== '') await this.deps.submit(target, text)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 音频与配置怎样从浏览器到host再提交？

**研究主题**：功能与机制

#### 完整回答

host注入connection，加载模型能力并通过/voice RPC提供ping/config/asr；config返回生效引擎与hotkey，解决loader行配置不到client的接线差异。client注册conversation.input.left麦克风和全局keydown，输入框或contenteditable聚焦时跳过快捷键。VoiceRuntime将识别轮绑定activeSession，final替换累计定稿、partial单独回显，stop后使round失效防迟到回调，拼接非空文本提交。

native路线浏览器采PCM，16k单声道分块base64经RPC送host，HostAsr按sessionId取独立VAD/stream会话，模型权重共享。browser路线用SpeechRecognition/webkitSpeechRecognition，连续模式关闭、默认zh-CN，结果和自然结束回调进入同一runtime。引擎选择由模型可用性决定，不能仅按用户原始config宣称native已启用。host源码在非browser配置下还会kick预载能力，并非绝对首次点击才加载模型。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:65-106](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/index.ts#L65-L106)

能力预载、生效引擎和RPC处理。

<details>
<summary>查看原文（42行）</summary>

```text
  /** 加载 zipformer2 + VAD;目录未配/加载失败 → null(失败由 capability 锁存)。 */
  const loadModel = deps.loadModel ?? (async (): Promise<OnnxModel | null> => {
    if (config.modelDir.trim() === '') return null
    if (model === null) model = new OnnxModel(config)
    try {
      await model.start()
      return model
    } catch (err) {
      logger.warn('native ASR 初始化失败: %s', String(err))
      return null
    }
  })
  const capability = createCapability(loadModel)
  if (config.engine !== 'browser') capability.kick() // 预载:首击零延迟;失败静默锁存

  ctx.effect(() => ctx.connection.rpc.handle(VOICE_CHANNEL, async (endpoint, payload) => {
    switch (endpoint) {
      case VOICE_ENDPOINTS.ping: {
        // 生效引擎:配置 + 模型加载结果(等待落定,不再虚报)
        const value: VoicePingResponse = { engine: resolveEngine(config.engine, (await capability.ready()) !== null) }
        return { ok: true, value }
      }
      case VOICE_ENDPOINTS.config: {
        // host 是唯一知道能力真相的一方:直接把生效引擎下发(native 不可用时
        // 已兜底降级),客户端只消费;不把 raw engine 原样透传。
        const value: VoiceClientConfig = {
          engine: resolveEngine(config.engine, (await capability.ready()) !== null),
          hotkey: config.hotkey,
        }
        return { ok: true, value }
      }
      case VOICE_ENDPOINTS.asr: {
        const req = payload as AsrChunkPayload
        const m = await capability.ready()
        const engine = resolveEngine(config.engine, m !== null)
        if (engine !== 'native' || m === null) {
          return rpcError('native_unavailable', 'native ASR 不可用')
        }
        if (hostAsr === null) {
          hostAsr = new HostAsr({ log: (msg) => logger.warn('native ASR %s', msg) })
        }
        return hostAsr.handle(m, req)
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:47-102](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/client/index.ts#L47-L102)

麦克风、热键及host配置同步。

<details>
<summary>查看原文（56行）</summary>

```text
  // 麦克风按钮(会话槽)
  ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
    name: 'conversation.input.left',
    id: 'voice-mic',
    order: 0,
    inject: (sessionId: string) => ({
      onToggle: () => {
        void runtime.toggleMic(sessionId).catch((err: unknown) => {
          console.error('dsh-voice mic:', err)
        })
      },
      hooks: { listening: listeningSource, partial: partialSource, hotkey: hotkeySource },
    }),
  }, MicButton))

  // 全局快捷键:开关当前会话的麦克风。hotkey 变量在 /voice.config 返回后
  // 原地更新,keydown 监听器每次读取最新值,无需重建 effect。
  let hotkey: ParsedHotkey | null = parseHotkey(clientConfig.hotkey)
  ctx.effect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (hotkey === null) return
      if (event.ctrlKey !== hotkey.ctrl || event.altKey !== hotkey.alt || event.shiftKey !== hotkey.shift) return
      if (event.code !== hotkey.code) return
      // 输入框/编辑器聚焦时不抢快捷键(避免与输入法/编辑操作冲突)
      const target = event.target as HTMLElement | null
      if (target !== null && (
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      )) return
      event.preventDefault()
      const current = ctx.sessions.list.getSnapshot().current
      if (current === undefined) return
      void runtime.toggleMic(current).catch((err: unknown) => {
        console.error('dsh-voice mic:', err)
      })
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, 'dsh-voice: global hotkey')

  const voice = createVoiceService((channel, endpoint, payload) =>
    ctx.connection.rpc.call(channel, endpoint, payload))

  // 行内 config 只到 host 半;client 半从这里取回真实值并覆盖 schema 默认。
  void voice.fetchConfig().then((remote) => {
    if (isVoiceEngine(remote.engine)) {
      clientConfig.engine = remote.engine
      runtime.setEngine(remote.engine)
    }
    if (typeof remote.hotkey === 'string' && remote.hotkey.trim() !== '' && remote.hotkey !== clientConfig.hotkey) {
      clientConfig.hotkey = remote.hotkey
      hotkey = parseHotkey(remote.hotkey)
      configEvents.emit()
    }
  }).catch((err: unknown) => {
    console.warn('dsh-voice: /voice.config 不可用,使用 client 默认配置', err)
  })
```

</details>

**依据 3 · 源码核查**：[src/client/asr.ts:64-101](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/client/asr.ts#L64-L101)

浏览器识别参数与回调。

<details>
<summary>查看原文（38行）</summary>

```text
  async start(): Promise<void> {
    const Ctor = (globalThis as { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition
      ?? (globalThis as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition
    if (Ctor === undefined) {
      throw new Error('浏览器不支持 SpeechRecognition(可降级键盘输入)')
    }
    this.finalized = false
    this.gotText = false
    this.userStopped = false
    this.stopPromise = null
    this.finalWaiter = null
    const recognition = new Ctor()
    recognition.lang = this.lang
    recognition.interimResults = true
    recognition.continuous = false
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // 只取最新一条:interim 会随事件更新替换,避免重复累积
      const last = event.results[event.results.length - 1]
      if (last === undefined) return
      const transcript = last[0]?.transcript ?? ''
      if (transcript === '') return
      this.gotText = true
      if (last.isFinal) {
        this.finalized = true
        this.finalWaiter?.()
        this.finalWaiter = null
      }
      this.text.emit(transcript, last.isFinal)
    }
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.errors.emit(new Error(event.error))
    }
    recognition.onend = () => {
      // 自然结束(非用户点停):识别器自判说完,通知调用方结束轮次
      if (!this.userStopped) this.ends.emit()
    }
    this.recognition = recognition
    recognition.start()
```

</details>

**依据 4 · 源码核查**：[src/client/runtime.ts:130-165](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/client/runtime.ts#L130-L165)

activeSession/round及final/partial状态。

<details>
<summary>查看原文（36行）</summary>

```text
  /** 开关一轮识别。resolve 表示状态已切换(识别结果在后续回调提交)。 */
  async toggleMic(sessionId: string): Promise<void> {
    if (this.listening) {
      await this.stopMic(this.activeSession ?? sessionId)
      return
    }
    const round = ++this.round
    this.activeSession = sessionId
    this.listening = true
    this.pendingText = ''
    this.partialText = ''
    this.notify()
    const engine = await this.getEngine()
    if (this.round !== round) return // 探测期间被 stop 打断
    const rec = this.deps.createRecognizer(engine, sessionId)
    // 定稿语义统一:final=true 交付本轮累计定稿全文(替换式)
    rec.onText((text, final) => {
      if (this.round !== round) return
      if (final) {
        this.pendingText = text
        this.partialText = ''
      } else {
        this.partialText = text
      }
      this.notify()
    })
    rec.onError((err) => {
      if (this.round !== round) return
      // 统一策略:终止本轮并丢弃文本(native 可吸收的块级失败已在 adapter 内消化)
      this.pendingText = ''
      this.partialText = ''
      void this.stopMic(sessionId).then(() => { console.error('dsh-voice ASR:', err) })
    })
    rec.onEnd(() => {
      if (this.round !== round) return
      void this.stopMic(sessionId)
```

</details>

**依据 5 · 源码核查**：[src/core/host-asr.ts:51-67](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/core/host-asr.ts#L51-L67)

base64到会话feed的返回通道。

<details>
<summary>查看原文（17行）</summary>

```text
  /** 处理一块 asr payload:解码 → 会话池取会话 → feed → 线协议结果。 */
  handle(model: AsrModelFace, req: AsrChunkPayload): ConnectionRpcResult<AsrChunkResponse> {
    const session = this.sessionFor(model, req.sessionId)
    if (session === null) {
      return rpcError('native_unavailable', 'native ASR 不可用')
    }
    const chunk = Buffer.from(req.audio, 'base64')
    const int16 = new Int16Array(chunk.buffer, chunk.byteOffset, Math.floor(chunk.byteLength / 2))
    try {
      const out = session.feed(int16, req.final)
      // 定稿优先;否则回传当前部分识别文本(边说边出字)
      const delta = out.finals.length > 0 ? out.finals.join('') : out.partial
      return { ok: true, value: { delta, final: out.finals.length > 0 } }
    } catch (err) {
      // 单次 feed 失败不报废整个识别服务(按块错误)
      this.log?.(`feed 失败: ${String(err)}`)
      return rpcError('internal', String(err))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回退、自动提交和会话池有什么限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

native离线能力不能泛化为所有模式都本地私密。模型或包不可用会选择浏览器引擎，源码使用Web Speech API而没有本地处理保证，实际处理位置与可用性依浏览器；用户应明确选择并知晓回退，而不是把auto标签当音频不离机承诺。自动提交意味着识别错词可成为真实Agent指令，stop会把未定稿partial也拼入发送，缺少发送前编辑确认，敏感命令或账号口令不适合无复核口述。

HostAsr默认只有四个会话，LRU驱逐正在说话会让VAD从零开始，可能截断一句。host handle直接按请求sessionId取池并解base64，所读片段没有最大音频块/schema验证和会话主体授权；应核对宿主loopback authority实际限制，不能将按ID分池等同访问隔离。本轮未做错误音频、跨会话或浏览器隐私运行测试，以上是源码边界。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/asr.ts:44-68](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/client/asr.ts#L44-L68)

浏览器WebSpeech在线路线和不支持时回键盘。

<details>
<summary>查看原文（25行）</summary>

```text
/** 浏览器 Web Speech API 识别(V0.5,零原生依赖,在线)。 */
export class WebSpeechRecognizer implements SpeechRecognizer {
  private recognition: SpeechRecognition | null = null
  private readonly text = new Emitter<[delta: string, final: boolean]>()
  private readonly errors = new Emitter<[err: Error]>()
  private readonly ends = new Emitter<[]>()
  /** 已收到定稿(final 到达即置位;停麦时无需再等) */
  private finalized = false
  /** 是否收到过任何文本(无文本时停麦无需等待) */
  private gotText = false
  /** 最近一次停止是否由用户发起(区分自然结束) */
  private userStopped = false
  private stopPromise: Promise<void> | null = null
  private finalWaiter: (() => void) | null = null

  constructor(
    private readonly lang = 'zh-CN',
    private readonly finalizeTimeoutMs = 500,
  ) {}

  async start(): Promise<void> {
    const Ctor = (globalThis as { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition
      ?? (globalThis as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition
    if (Ctor === undefined) {
      throw new Error('浏览器不支持 SpeechRecognition(可降级键盘输入)')
```

</details>

**依据 2 · 源码核查**：[src/client/runtime.ts:201-217](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/client/runtime.ts#L201-L217)

定稿与partial拼接后直接submit。

<details>
<summary>查看原文（17行）</summary>

```text
      await rec.stop() // 契约:resolve 后不再有任何回调
    } catch (err) {
      console.error('dsh-voice ASR 收尾失败:', err)
    }
    this.round += 1 // 作废一切迟到回调
    this.stopping = false
    this.recognizer = null
    this.activeSession = null
    const text = (this.pendingText + this.partialText).trim()
    this.pendingText = ''
    this.partialText = ''
    this.listening = false
    // 下一轮重新按当前 config 解析引擎:host /voice.config 即使在上一轮
    // 识别过程中到达,也会从下一轮开始生效。
    this.engine = null
    this.notify()
    if (text !== '') await this.deps.submit(target, text)
```

</details>

**依据 3 · 源码核查**：[src/core/host-asr.ts:11-13](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/core/host-asr.ts#L11-L13)

作者在源码说明LRU会打断语音。

```text
 * 驱逐策略:maxSessions 满时逐出最久未用的会话,经 log 回调留痕。
 * 被逐出的会话若还在说话,VAD 状态从零开始、一句话会被拆断 ——
 * 这是有意的容量取舍(防 VAD 状态无界累积),非 bug。
```

**依据 4 · 源码核查**：[src/core/host-asr.ts:51-67](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/core/host-asr.ts#L51-L67)

payload解码前仅类型断言，局部未见大小/归属验证。

<details>
<summary>查看原文（17行）</summary>

```text
  /** 处理一块 asr payload:解码 → 会话池取会话 → feed → 线协议结果。 */
  handle(model: AsrModelFace, req: AsrChunkPayload): ConnectionRpcResult<AsrChunkResponse> {
    const session = this.sessionFor(model, req.sessionId)
    if (session === null) {
      return rpcError('native_unavailable', 'native ASR 不可用')
    }
    const chunk = Buffer.from(req.audio, 'base64')
    const int16 = new Int16Array(chunk.buffer, chunk.byteOffset, Math.floor(chunk.byteLength / 2))
    try {
      const out = session.feed(int16, req.final)
      // 定稿优先;否则回传当前部分识别文本(边说边出字)
      const delta = out.finals.length > 0 ? out.finals.join('') : out.partial
      return { ok: true, value: { delta, final: out.finals.length > 0 } }
    } catch (err) {
      // 单次 feed 失败不报废整个识别服务(按块错误)
      this.log?.(`feed 失败: ${String(err)}`)
      return rpcError('internal', String(err))
```

</details>

#### 缺口

- 部署浏览器识别处理位置和宿主RPC权限/块大小限制未固定。
  **影响**：影响音频隐私、资源滥用和多会话使用边界。
  **进一步探讨**：核对浏览器/宿主固定版本契约，敏感场景明确native成功且禁回退，再对最大块和会话归属做非敏感核查。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖与三阶段成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

基础需要支持麦克风权限和相应Web API的浏览器、DSH connection/session/slots，以及可用的会话提交服务。native还需独立sherpa-onnx-node、模型目录中encoder/decoder/joiner/tokens和Silero VAD；默认用CPU两线程识别、VAD另有状态。npm插件不自动安装原生运行时或模型，用户需自行准备；浏览器回退减少安装步骤却改变隐私与网络条件。

首次成本是麦克风授权、快捷键冲突检查和可选模型下载/磁盘空间，文档约100MB是作者估计不当本轮实测。持续native消耗CPU/内存和本地音频RPC，browser依实际浏览器服务，转写触发的Agent任务仍产生原有模型/工具费用。失败恢复包括重新授权、修复模型路径、切换引擎、重录和纠正已发送消息；不能只统计单次ASR延迟。没有语音词错率、句尾丢失率、端到端提交耗时或输入法对照，不填节省比例。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/native-asr.ts:88-107](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/core/native-asr.ts#L88-L107)

实际原生包、模型文件与CPU参数。

<details>
<summary>查看原文（20行）</summary>

```text
  private load(): void {
    if (this.recognizer !== null || this.loadFailed) return
    const dir = this.options.modelDir
    const asrDir = this.options.asrDir ?? DEFAULTS.asrDir
    const onnx = require('sherpa-onnx-node') as OnnxModuleLike
    this.recognizer = new onnx.OnlineRecognizer({
      featConfig: { sampleRate: 16000, featureDim: 80 },
      modelConfig: {
        transducer: {
          encoder: join(dir, asrDir, 'encoder.int8.onnx'),
          decoder: join(dir, asrDir, 'decoder.onnx'),
          joiner: join(dir, asrDir, 'joiner.int8.onnx'),
        },
        tokens: join(dir, asrDir, 'tokens.txt'),
        numThreads: 2,
        provider: 'cpu',
        modelType: 'zipformer2',
      },
      decodingMethod: 'greedy_search',
      enableEndpoint: false,
```

</details>

**依据 2 · 源码核查**：[src/index.ts:65-78](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/index.ts#L65-L78)

加载失败锁存并回退能力。

<details>
<summary>查看原文（14行）</summary>

```text
  /** 加载 zipformer2 + VAD;目录未配/加载失败 → null(失败由 capability 锁存)。 */
  const loadModel = deps.loadModel ?? (async (): Promise<OnnxModel | null> => {
    if (config.modelDir.trim() === '') return null
    if (model === null) model = new OnnxModel(config)
    try {
      await model.start()
      return model
    } catch (err) {
      logger.warn('native ASR 初始化失败: %s', String(err))
      return null
    }
  })
  const capability = createCapability(loadModel)
  if (config.engine !== 'browser') capability.kick() // 预载:首击零延迟;失败静默锁存
```

</details>

**依据 3 · 作者声明**：[README.md:20-29](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/README.md#L20-L29)

作者原生依赖与约100MB下载说明。

<details>
<summary>查看原文（10行）</summary>

````text
```sh
# Plugin
dsh plugin --profile web add @nn12138/dsh-voice

# Optional: offline native recognition (the plugin does not auto-install this runtime)
dsh plugin --profile web add sherpa-onnx-node
dsh-voice-models            # one-shot model download (~100MB) → ./dsh-voice-models

# Optional: configuration (edit ~/.dsh/profiles/web/cordis.patch.yml)
```
````

</details>

#### 缺口

- 缺少目标语言/噪声条件下词错率、尾音和恢复成本对照。
  **影响**：不能确认语音比系统输入法更有效或更可靠。
  **进一步探讨**：固定中英文混合、命令和噪声样本，比较native/browser/系统输入法的正确文本、修正次数和提交总时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程可借鉴什么，能推导怎样的采用路径？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

可借鉴的是权重与按会话VAD状态分离、VoiceService集中解码RPC错误、两种识别器共享累计定稿契约，以及round守卫将旧回调失效。测试源码用假模型检查PCM和final传递，这能验证协议接缝但不是声学效果；手写ambient stub也无法单独证明宿主API未漂移，本轮不运行测试或下载模型。

未验证方向是将停止识别默认落入可编辑草稿，再由用户显式发送，并把当前实际引擎及回退标记一起展示。推导来自partial自动提交与auto隐私不透明，目标是减少错误指令而不是提升ASR模型精度。最小对照用相同口述命令比较自动提交和预览确认的错误任务触发、修正时间及额外点击；若确认步骤损失大于避免的错误，或用户仍不能发现错词，否定默认扩展。

建议非敏感日常对话小范围试用，先确认引擎、会话和停麦行为，不口述破坏性任务或秘密。正确发送且无漏句/重复为成功，自动误发、频繁回退或多会话截断时回键盘/系统输入法。当前没有同版本安装与禁用验收，不能给值得安装。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/voice-service.ts:22-31](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/client/voice-service.ts#L22-L31)

领域值与RPC错误集中转换。

<details>
<summary>查看原文（10行）</summary>

```text
function decode<T>(res: ConnectionRpcResult<unknown>): T {
  if (!res.ok) throw new VoiceRpcError(res.error.code, res.error.message)
  return res.value as T
}

export function createVoiceService(call: RpcCall): VoiceService {
  return {
    ping: async () => decode<VoicePingResponse>(await call(VOICE_CHANNEL, VOICE_ENDPOINTS.ping, {})),
    fetchConfig: async () => decode<VoiceClientConfig>(await call(VOICE_CHANNEL, VOICE_ENDPOINTS.config, {})),
    asr: async (payload) => decode<AsrChunkResponse>(await call(VOICE_CHANNEL, VOICE_ENDPOINTS.asr, payload)),
```

</details>

**依据 2 · 源码核查**：[tests/host-asr.spec.ts:9-27](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/tests/host-asr.spec.ts#L9-L27)

假模型协议测试。

<details>
<summary>查看原文（19行）</summary>

```text
/** 假模型:记录 openSession 调用,每次返回独立假会话(可逐会话控制 feed)。 */
function fakeModel() {
  const feeds: ReturnType<typeof vi.fn>[] = []
  const openSession = vi.fn((): AsrSessionFace | null => {
    const feed = vi.fn(() => ({ partial: '', finals: [] }))
    feeds.push(feed)
    return { feed }
  })
  return { model: { openSession }, openSession, feeds }
}

describe('HostAsr(解码 → 会话池 → feed → 线协议结果)', () => {
  it('解码:base64 → Int16 值 + final 标志原样进 feed', () => {
    const m = fakeModel()
    const pool = new HostAsr({ maxSessions: 2 })
    const res = pool.handle(m.model, payload({ audio: encodeBase64(new Int16Array([1, -2, 300])), final: false }))
    expect(res).toEqual({ ok: true, value: { delta: '', final: false } })
    const call = m.feeds[0]!.mock.calls[0]!
    expect(Array.from(call[0] as Int16Array)).toEqual([1, -2, 300])
```

</details>

**依据 3 · 源码核查**：[src/client/runtime.ts:205-217](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/client/runtime.ts#L205-L217)

轮次失效和自动发送是设计推导起点。

<details>
<summary>查看原文（13行）</summary>

```text
    this.round += 1 // 作废一切迟到回调
    this.stopping = false
    this.recognizer = null
    this.activeSession = null
    const text = (this.pendingText + this.partialText).trim()
    this.pendingText = ''
    this.partialText = ''
    this.listening = false
    // 下一轮重新按当前 config 解析引擎:host /voice.config 即使在上一轮
    // 识别过程中到达,也会从下一轮开始生效。
    this.engine = null
    this.notify()
    if (text !== '') await this.deps.submit(target, text)
```

</details>

#### 缺口

- 预览/引擎提示方案的错误任务减少效果未验证。
  **影响**：只保留假设，不能计入当前贡献评分。
  **进一步探讨**：用相同口述反例进行盲评，记录错误任务和总输入修正成本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
