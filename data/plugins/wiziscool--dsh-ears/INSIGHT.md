# dsh-ears

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ccc24a2](https://github.com/WizisCool/dsh-ears/tree/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WizisCool/dsh-ears) [![npm 30d 4,550](https://img.shields.io/static/v1?label=npm+30d&message=4%2C550&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ears) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ears)
<!-- END META -->

> **功能**：在 DeepSeek Harness 输入栏加入语音转写和可选润色，将识别结果写入可编辑草稿。

> **亮点**：[Q01](#research-q01) 将麦克风、后端选择、转写进度和可编辑草稿放在同一 DSH 会话，保留手工发送。[Q04](#research-q04) 本地 Whisper 由独立进程处理原生调用，故障可通过 IPC 返回以便检查或更换后端。

> **主要限制**：[Q03](#research-q03) 录音文件准备基于客户端捕获后端，Host 取提交时配置，切换选项后需要核对实际音频出口。转写为本地也仍可能触发独立的默认润色模型 [Q05](#research-q05)。

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
  - [Q01 · 经常在 DSH 口述任务的人能完成什么，和键盘或系统听写相比增加什么？](#detail-section-11)
  - [Q02 · 宿主如何采集音频，工作流什么时候真正开始识别？](#detail-section-12)
  - [Q03 · 云识别经过哪个出口，连接失败与录音中调整配置有哪些边界？](#detail-section-13)
  - [Q04 · 本地 Whisper 如何准备模型和隔离失效，超时与系统退出覆盖到哪？](#detail-section-14)
  - [Q05 · 清除草稿、继续编辑或取消润色时，哪些内容会继续留在输入栏？](#detail-section-15)
  - [Q06 · 哪些人适合限定试用，如何区分源码、作者验证和采用成本？](#detail-section-16)
  - [Q07 · 锁定录音时后端并公开润色差分，能否减少用户误送音频或误提交修改？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常在 DSH Web 口述较长中文任务、愿意手动校对的人，可用一段无敏感内容先评估能否更快得到合格草稿。

系统听写可把文字输入现有编辑器，键盘更容易精确输入标识和格式。插件让 DSH 维护独立的后端配置和进度状态，再把结果按当前语音会话提交。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH 输入栏录音 | 在当前会话发起和停止语音 | 浏览器权限；悬停等交互可能先预热 |
| 浏览器 Web Speech | 输出实时文字 | 浏览器实现决定权限与处理地点 |
| 本地 Whisper | 录音结束后在 Host 转写 | native 和已校验模型；初始化和转写超时分开 |
| 云端识别 | 按后端提交录音或实时帧 | 使用前核对目标与凭据，录音中不改后端 |
| 润色 | 把当前转写改成可编辑结果 | 独立模型调用，发送前人工复核格式和含义 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web、Node 和浏览器麦克风权限 | 主流程所需 | 加载界面、录音和提交 | 权限不足时返回键盘 |
| DSH settings、llm 和遥控服务 | Host 接线所需 | 路由管理、ASR 与润色 | 检查插件和服务加载 |
| 特定浏览器识别能力 | Web Speech 路线所需 | 实时产生草稿片段 | 浏览器可用性与外发需另查 |
| native 变体和有效模型文件 | 本地 Whisper 所需 | 转写录音文件 | 对应状态不可用或需要重启 |
| 云 ASR 凭据、端点与所需格式 | 云端路线所需 | 接收文件或实时流 | 无效时停止，不更换到未知后端 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户明确后端并先关闭润色 | 核对站点、麦克风权限和所用服务 |
| 录制 | 在试验会话口述一段无秘密的内容 | 开始、停止指示可观察，录音期间不变更后端 |
| 验收 | 核对原草稿、文本和格式，再决定手动发送 | 留下正确稿件，异常则停录改键盘 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型磁盘、宿主和设备 | 权限、模型与后端核实 | 下载及设置耗时未知 |
| 持续 | CPU／GPU 或上游请求与配额 | 审核转写、数字与格式 | 单位合格稿总成本未知 |
| 失败与退出 | 可能有已提交的云片段或临时音频 | 停止、清草稿、确认权限并改键盘 | 各后端真实保留与恢复未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同会话成稿 | 转写插入草稿且由用户发出 | 真实语料准确率与节时 |
| 选择识别模式 | 浏览器、Host 本地或许可云端 | 各浏览器和上游稳定性 |
| 失效隔离 | native 独立进程、取消与过期处理 | 初次挂住、平台重启条件与效果 |

> **思考**：[Q03](#research-q03) 录音文件准备基于客户端捕获后端，Host 取提交时配置，切换选项后需要核对实际音频出口。转写为本地也仍可能触发独立的默认润色模型 [Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将麦克风、后端选择、转写进度和可编辑草稿放在同一 DSH 会话，保留手工发送。[Q04](#research-q04) 本地 Whisper 由独立进程处理原生调用，故障可通过 IPC 返回以便检查或更换后端。

[Q04](#research-q04) 将原生上下文与 Host 进程分开，已建立的转写阶段可以取消和终止，模型初始化与排队仍需分开核对。[Q05](#research-q05) 草稿提交做过期校验，润色比对会折叠空白，用户有最后复核的实际任务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 录音文件准备基于客户端捕获后端，Host 取提交时配置，切换选项后需要核对实际音频出口。转写为本地也仍可能触发独立的默认润色模型 [Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 用隔离会话做一次短而无敏感内容的口述，选定后端并先关闭润色。核对已有草稿、专有词、数字和格式。若发生非预期麦克风使用或不清楚实际出口，停止并改用键盘 [Q02](#research-q02) [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查草稿提交、后端和润色分流、麦克风预热、Host worker 以及版本边界。未运行真实设备、所有后端或原生模型，配置锁和润色差分尚为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、tsdown.config.ts、src/client/index.ts、src/client/voice-flow.ts、src/index.ts、src/client/MicrophoneButton.tsx、src/asr/media-recorder.ts、src/asr/web-speech.ts、src/client/local-whisper-audio.ts、src/polish/service.ts、src/asr/openai-compatible.ts、src/asr/whisper-models.ts、src/asr/local-whisper.ts、src/asr/whisper-worker-client.ts、src/settings/polishing.ts、CHANGELOG.md、scripts/verify-package.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Host 和 Web 接线、录音、通用 POST、实时生命周期、本地 worker 和润色。未运行浏览器／麦克风、模型、Mac Metal 或目标平台，未逐一检查所有云厂商的出站协议与条款。
- 下一步：先以合成语音、固定 Host、浏览器、本地 ASR 或模拟上游复现开麦、转写、取消、重载及草稿变更。两种设置下校验后端、临时文件和 Host 出站请求，再与键盘短任务对照。

**分析版本**

- **仓库**：[WizisCool/dsh-ears](https://github.com/WizisCool/dsh-ears)
- **版本号**：0.4.4（[固定提交 ccc24a2](https://github.com/WizisCool/dsh-ears/tree/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07) 可以在录音时锁住后端修订，并把润色先作为差分提示。用固定的路由交替和草稿编辑对照，验证误路由和误覆盖是否下降。

先以合成语音、固定 Host、浏览器、本地 ASR 或模拟上游复现开麦、转写、取消、重载及草稿变更。两种设置下校验后端、临时文件和 Host 出站请求，再与键盘短任务对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 2834 | — | — | 44163 |
| .mjs | source | 5 | 971 | 818 | 70 | — |
| .ts | source | 63 | 13309 | 11682 | 574 | — |
| .tsx | source | 4 | 1706 | 1593 | 23 | — |
| .ts | test | 46 | 11685 | 10302 | 244 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/WizisCool/dsh-ears/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/WizisCool/dsh-ears/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/WizisCool/dsh-ears/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户在 DSH 通过麦克风生成可发出的编辑草稿时，插件如何处理采集、后端选择和异步更新，何时应保留键盘或原始转写？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 经常在 DSH 口述任务的人能完成什么，和键盘或系统听写相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已经在 DSH Web 写需求或交代长些的自然语言任务的人，可以按按钮或快捷键讲话，拿到当前会话可编辑的文字，然后校对专有词、数字或路径，最后由人发送。宿主在输入栏右侧注册按钮及下方进度条，按 sessionId 传入相应语音会话。完成转写时插件写草稿，后续可单独请求润色；所阅完成分支没有发送调用。相对直接键盘可能减少输入摩擦，相对系统听写的具体增量是 DSH 内可选择的后端、录音／转写进度、已有草稿保护以及可选润色。如果系统听写已经能准确处理短句，单加这个插件的收益可能主要是集中配置。输出的合格标准是已校对、语义完整的草稿，语音输入本身不能保证敏感字段或指令准确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:85-93](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/README.md#L85-L93)

作者规定手动检查和发送。

```text
## 使用

1. 点击麦克风图标，或按下 `Ctrl+Shift+Space`（可在设置页更改）
2. 开始说话
3. 再次按下快捷键或点击麦克风，停止录音并开始转写
4. 开启润色后，原始转写会先写入草稿，润色完成后再更新，期间的手动编辑会被保留
5. 检查内容后手动发送

转写结果始终写入可编辑草稿，不会自动发送。如果所选后端尚未就绪，麦克风图标会变灰，悬停即可查看原因。
```

**依据 2 · 源码核查**：[src/client/index.ts:63-98](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/index.ts#L63-L98)

按宿主会话挂麦克风和状态条。

<details>
<summary>查看原文（36行）</summary>

```text
    remoteCtx.slots.inject('conversation.input.right', () =>
      remoteCtx.slots.register(
        {
          name: 'conversation.input.right',
          id: 'dsh-ears-voice',
          order: 30,
          locale: LOCALE_NAMESPACE,
          inject: (sessionId) => ({
            remote: earsRemote,
            useEarsSettings: settingsHook,
            useEarsBackends: backendHook,
            useEarsWhisper: whisperHook,
            voiceSession: voiceSessionFor(sessionId),
            useUiLocale,
            earsT
          })
        },
        MicrophoneButton
      )
    )

    remoteCtx.slots.inject('conversation.input.dock', () =>
      remoteCtx.slots.register(
        {
          name: 'conversation.input.dock',
          id: 'dsh-ears-recognition-bar',
          order: 15,
          locale: LOCALE_NAMESPACE,
          inject: (sessionId) => ({
            voiceSession: voiceSessionFor(sessionId),
            earsT
          })
        },
        VoiceRecognitionBar
      )
    )
```

</details>

**依据 3 · 源码核查**：[src/client/voice-flow.ts:29-69](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/voice-flow.ts#L29-L69)

提交 setDraft，润色路径独立。

<details>
<summary>查看原文（41行）</summary>

```text
export function commitTranscript(options: CommitTranscriptOptions): void {
  const transcript = options.transcript.trim()
  if (transcript === '') {
    options.setState('idle')
    return
  }
  const draftBase = resolveCommitDraftBase(options)
  if (draftBase === null) {
    options.setState('idle')
    return
  }

  const draftAtStop = options.transcriptAlreadyApplied ? options.latestDraftRef.current : appendToDraft(draftBase, transcript)
  options.latestDraftRef.current = draftAtStop
  options.actionsRef.current.setDraft(draftAtStop)
  // Honor the local toggle so an off switch never flashes "polishing".
  // An enabled toggle still asks the Host even with an empty local pair;
  // the Host resolves dsh's agent-default-model selection in that case.
  if (options.isCurrent !== undefined && !options.isCurrent()) {
    options.setState('idle')
    return
  }
  if (!shouldRequestPolish(options.settings)) {
    options.setState('idle')
    return
  }
  void polishDraft({
    transcript,
    baseDraft: draftBase,
    originalDraft: options.baseDraft,
    draftAtStop,
    provider: options.settings.polishProvider,
    model: options.settings.polishModel,
    reasoningEffort: options.settings.polishReasoningEffort,
    remote: options.remote,
    setState: options.setState,
    latestDraftRef: options.latestDraftRef,
    actionsRef: options.actionsRef,
    polishAbortRef: options.polishAbortRef,
    isCurrent: options.isCurrent
  })
```

</details>

#### 缺口

- 没有同话语、同设备的听写和键盘对照
  **影响**：未确定改错后是否省时
  **进一步探讨**：使用同样指令比较保留语义、修改次数和到合格草稿的时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主如何采集音频，工作流什么时候真正开始识别？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

根补丁加载 Host，Host 依赖 settings 并安装 Remote，Web 模块绑定到对话输入 UI。快捷键过滤重复、输入法组合、模态和不可见状态。切换时选浏览器 Web Speech、实时云或 MediaRecorder。Web Speech 由浏览器接口出中间及最终文字，相应的底层处理是否离线由实现决定。非 Web Speech 的按钮可在 pointerenter、pointerdown 或 focus 预热麦克风；空闲且接口可用时就调用 getUserMedia，并可暂持 stream，点击开始录制时再复用。预热获取麦克风权限和真正记录／上传是不同动作，不应以未点击证明麦克风未开启。录音文件后端停止后才准备音频，丢弃过小录音；本地和部分云渠道在浏览器解码转 16k PCM16 WAV，再向 Host Remote 提交。实时路径开 Host 连接后以帧发送，局部文本逐步写草稿。卸载和取消会中止已知捕获及其请求。依赖浏览器权限、所选平台服务与当前宿主。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:10-21](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/index.ts#L10-L21)

Host settings 与 Remote 初始化。

<details>
<summary>查看原文（12行）</summary>

```text
/** The settings service owns the profile entry config this plugin reads and writes. */
export const inject = ['settings']

export async function apply(ctx: Context): Promise<void> {
  // dsh-ears ships its own settings page, so the loader entry must not also
  // render an automatically generated form. `configure` binds the policy to the
  // calling fiber — the loader entry here, not the nested service below it.
  const disposePresentation = ctx.settings.configure({ auto: false })
  ctx.effect(() => disposePresentation, 'dsh-ears settings presentation')

  await ctx.plugin(PolishService)

```

</details>

**依据 2 · 源码核查**：[src/client/MicrophoneButton.tsx:93-111](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/MicrophoneButton.tsx#L93-L111)

实际快捷键限制。

<details>
<summary>查看原文（19行）</summary>

```text
    const onKeyDown = (event: KeyboardEvent) => {
      const current = settingsRef.current
      if (current.voiceShortcutEnabled === false) return
      if (event.isComposing || event.repeat) return
      if (!matchesShortcut(current.voiceShortcut, event)) return
      const target = event.target
      if (target instanceof Element && target.closest('[role="dialog"]') !== null) return
      if (document.visibilityState !== 'visible') return
      const element = buttonRef.current
      if (element === null || element.offsetParent === null) return
      event.preventDefault()
      event.stopPropagation()
      if (gateRef.current !== null) {
        if (document.activeElement !== element) element.focus()
        return
      }
      toggleRef.current?.()
    }
    window.addEventListener('keydown', onKeyDown, true)
```

</details>

**依据 3 · 源码核查**：[src/client/MicrophoneButton.tsx:578-601](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/MicrophoneButton.tsx#L578-L601)

预热与三种触发分支。

<details>
<summary>查看原文（24行）</summary>

```text
  const prewarmMicrophone = () => {
    if (settingsRef.current.voiceSoundsEnabled !== false) resumeSounds()
    if (active || busy) return
    if (resolveCaptureBackend(settingsRef.current.asrBackend) === 'web-speech') return
    warmMicrophone()
  }

  const toggle = () => {
    if (settingsRef.current.voiceSoundsEnabled !== false) resumeSounds()
    if (active) {
      void stopRecording()
      return
    }
    if (busy) return
    playToggleClick(settingsRef.current, 0.5)

    const nextBackend = resolveCaptureBackend(settingsRef.current.asrBackend)
    if (nextBackend === 'web-speech') {
      void startWebSpeech()
    } else if (nextBackend === 'cloud-openai' && isCloudAsrRealtime(settingsRef.current)) {
      void startRealtimeRecording()
    } else if (nextBackend === 'local-whisper' || nextBackend === 'cloud-openai') {
      void startMediaRecording(nextBackend)
    }
```

</details>

**依据 4 · 源码核查**：[src/client/MicrophoneButton.tsx:625-632](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/MicrophoneButton.tsx#L625-L632)

悬停、按下与焦点触发预热。

```text
        aria-pressed={active}
        disabled={busy}
        className={styles.button}
        data-state={state}
        onPointerEnter={prewarmMicrophone}
        onPointerDown={prewarmMicrophone}
        onFocus={prewarmMicrophone}
        onClick={toggle}
```

**依据 5 · 源码核查**：[src/asr/media-recorder.ts:56-96](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/asr/media-recorder.ts#L56-L96)

预热可调用浏览器麦克风并暂持 stream。

<details>
<summary>查看原文（41行）</summary>

```text
export function warmMicrophone(): void {
  if (!isMediaRecorderAvailable()) return
  if (warmStream !== undefined && streamLive(warmStream)) {
    armWarmRelease()
    return
  }
  if (warming !== undefined) return
  const generation = warmGeneration
  const pending = requestMicrophone().then((stream) => {
    if (generation !== warmGeneration) {
      stopTracks(stream)
      return
    }
    warmStream = stream
    armWarmRelease()
  })
  warming = pending
  void pending.catch(() => undefined).finally(() => {
    if (warming === pending) warming = undefined
  })
}

async function acquireMicrophone(): Promise<MediaStream> {
  if (warming !== undefined) {
    try {
      await warming
    } catch {
      // A failed warmup must not block a fresh permission prompt on click.
    }
  }
  if (warmStream !== undefined && streamLive(warmStream)) {
    const stream = warmStream
    warmStream = undefined
    clearWarmTimer()
    return stream
  }
  return requestMicrophone()
}

function requestMicrophone(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({ audio: VOICE_AUDIO_CONSTRAINTS })
```

</details>

**依据 6 · 源码核查**：[src/asr/web-speech.ts:79-105](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/asr/web-speech.ts#L79-L105)

浏览器识别实现实际调用接口。

<details>
<summary>查看原文（27行）</summary>

```text
  constructor(options: WebSpeechSessionOptions) {
    const Recognition = getSpeechRecognitionConstructor()
    if (Recognition === undefined) {
      throw new Error('Speech recognition is unavailable in this browser')
    }

    this.options = options
    this.recognition = new Recognition()
    this.recognition.lang = options.language
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.maxAlternatives = 1
    this.recognition.onstart = () => options.onStart?.()
    this.recognition.onresult = (event) => this.handleResult(event)
    this.recognition.onerror = (event) => this.handleError(event)
    this.recognition.onend = () => this.handleEnd()
  }

  start(): void {
    if (this.active || this.ended || this.silent) return
    this.active = true
    this.stopping = false

    try {
      this.recognition.start()
    } catch (error) {
      this.fail(error instanceof Error ? error : new Error(String(error)))
```

</details>

**依据 7 · 源码核查**：[src/client/MicrophoneButton.tsx:407-425](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/MicrophoneButton.tsx#L407-L425)

实时数据帧和中间草稿。

<details>
<summary>查看原文（19行）</summary>

```text
      const epoch = voiceSession.captureEpoch()
      realtimeCaptureRef.current = capture
      realtimeRemoteSessionIdRef.current = started.value.sessionId
      realtimeBaseDraftRef.current = baseDraft
      realtimeDraftRef.current = baseDraft
      capture.start(async (audioBase64) => {
        const result = await remote.sendRealtimeAudio(sessionId!, audioBase64)
        if (!mountedRef.current || !voiceSession.isCurrentEpoch(epoch)) return
        if (!result.ok) throw result.error
        const transcript = result.value.text.trim()
        if (transcript === '') return
        if (latestDraftRef.current !== realtimeDraftRef.current) {
          if (latestDraftRef.current.trim() !== '') return
          realtimeBaseDraftRef.current = ''
        }
        realtimeDraftRef.current = updateDraft(realtimeBaseDraftRef.current, transcript, latestDraftRef, actionsRef)
      })
      setState('recording')
      armRecordingTimer(recordingTimerRef, effectiveRecordingSeconds(settingsRef.current), () => void stopRecording())
```

</details>

**依据 8 · 源码核查**：[src/client/MicrophoneButton.tsx:478-504](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/MicrophoneButton.tsx#L478-L504)

录音停止后准备并提交 Remote。

<details>
<summary>查看原文（27行）</summary>

```text
    const controller = new AbortController()
    transcribeAbortRef.current = controller
    try {
      const audio = await session.stop()
      if (!mountedRef.current) return
      if (mediaBackend === null) {
        applyVoiceFailure(voiceSession, 'asr', new Error('Media recording backend snapshot is missing'))
        return
      }
      if (isTrivialRecording(base64ByteLength(audio.base64), Date.now() - startedAt)) {
        setState('idle')
        return
      }
      setState('transcribing')
      const epoch = voiceSession.captureEpoch()
      const transcribeAudio = await prepareRecordedAudioForBackend(mediaBackend, audio, { signal: controller.signal, cloudProvider: settingsRef.current.cloudAsrProvider })
      if (!isTranscriptionStillCurrent({
        mounted: mountedRef.current,
        signal: controller.signal,
        captureIsCurrent: voiceSession.isCurrentEpoch(epoch)
      })) return
      const result = await remote.transcribe(transcribeAudio.base64, transcribeAudio.mimeType, controller.signal)
      if (!isTranscriptionStillCurrent({
        mounted: mountedRef.current,
        signal: controller.signal,
        captureIsCurrent: voiceSession.isCurrentEpoch(epoch)
      })) return
```

</details>

**依据 9 · 源码核查**：[src/client/local-whisper-audio.ts:32-42](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/local-whisper-audio.ts#L32-L42)

不同 ASR 的格式准备。

<details>
<summary>查看原文（11行）</summary>

```text
export function prepareRecordedAudioForBackend(
  backend: MediaCaptureBackend,
  audio: RecordedAudioPayload,
  options: LocalWhisperAudioOptions = {}
): Promise<RecordedAudioPayload> {
  if (backend === 'local-whisper') return normalizeRecordedAudioForLocalWhisper(audio, options)
  if (backend === 'cloud-openai') {
    return (options.cloudProvider === 'tencent' || options.cloudProvider === 'mimo' || options.cloudProvider === 'volcengine')
      ? normalizeRecordedAudioForLocalWhisper(audio, options)
      : Promise.resolve(audio)
  }
```

</details>

#### 缺口

- 不同浏览器的权限提示、Web Speech 外发和录音停止结果未实测
  **影响**：麦克风图标与具体权限行为可能不同
  **进一步探讨**：在隔离浏览器记录悬停、开始、停止、换会话和卸载时的指示及网络

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 云识别经过哪个出口，连接失败与录音中调整配置有哪些边界？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

录音文件由 Host 在 transcribe 调用里读取当时后端、端点、模型与凭据。兼容 OpenAI 的普通 POST 路径发送 multipart 文件和模型，带凭据要求 HTTPS，拒绝 URL 内用户信息并不自动跟随重定向。这些措施只覆盖该适配器和所阅调用，不能推断全部 ASR 或可自定义端点对音频的处理。实时路径启动时建立选定 provider 的流并登记随机会话 ID，发送失败、正常 finish、显式取消和空闲计时都会清理当前映射与流；清理不能推断回滚已上游处理的片段。录音文件路径在浏览器开始时保存用于编码的后端，停止提交 Remote 只传音频和类型，Host 再读配置。这给录音期间切换 backend 留下不同选择窗口。例如本地开始的 WAV 可能在 stop 时遭遇另外一个 Host 后端，造成误路由或拒绝；未做浏览器 UI 实测，不能声称已观察到音频外发。尽量只在停止和清空后调整渠道，首验用无敏感语句。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/MicrophoneButton.tsx:538-556](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/MicrophoneButton.tsx#L538-L556)

开录保存用于浏览器捕获的后端。

<details>
<summary>查看原文（19行）</summary>

```text
  const startMediaRecording = async (backend: MediaCaptureBackend) => {
    const baseDraft = draft
    const generation = ++mediaStartGenerationRef.current
    mediaStartCancelledRef.current = false
    setState('starting')
    let session: MediaRecorderSession | undefined
    try {
      session = await MediaRecorderSession.create()
      if (isSupersededMediaCapture(mediaStartGenerationRef.current, generation) || shouldAbandonPendingCapture(mountedRef.current, mediaStartCancelledRef.current)) {
        session.abort()
        return
      }
      mediaSessionRef.current = session
      mediaBackendRef.current = backend
      mediaBaseDraftRef.current = baseDraft
      mediaStartedAtRef.current = Date.now()
      session.start()
      setState('recording')
      armRecordingTimer(recordingTimerRef, effectiveRecordingSeconds(settingsRef.current), () => void stopRecording())
```

</details>

**依据 2 · 源码核查**：[src/client/MicrophoneButton.tsx:480-504](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/MicrophoneButton.tsx#L480-L504)

停止 prepare 后仅传 base64 与 MIME。

<details>
<summary>查看原文（25行）</summary>

```text
    try {
      const audio = await session.stop()
      if (!mountedRef.current) return
      if (mediaBackend === null) {
        applyVoiceFailure(voiceSession, 'asr', new Error('Media recording backend snapshot is missing'))
        return
      }
      if (isTrivialRecording(base64ByteLength(audio.base64), Date.now() - startedAt)) {
        setState('idle')
        return
      }
      setState('transcribing')
      const epoch = voiceSession.captureEpoch()
      const transcribeAudio = await prepareRecordedAudioForBackend(mediaBackend, audio, { signal: controller.signal, cloudProvider: settingsRef.current.cloudAsrProvider })
      if (!isTranscriptionStillCurrent({
        mounted: mountedRef.current,
        signal: controller.signal,
        captureIsCurrent: voiceSession.isCurrentEpoch(epoch)
      })) return
      const result = await remote.transcribe(transcribeAudio.base64, transcribeAudio.mimeType, controller.signal)
      if (!isTranscriptionStillCurrent({
        mounted: mountedRef.current,
        signal: controller.signal,
        captureIsCurrent: voiceSession.isCurrentEpoch(epoch)
      })) return
```

</details>

**依据 3 · 源码核查**：[src/polish/service.ts:309-341](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/polish/service.ts#L309-L341)

Host 根据当前设置选择后端和凭据。

<details>
<summary>查看原文（33行）</summary>

```text
  async transcribe(audioBase64: string, mimeType: string, signal: AbortSignal): Promise<RemoteTextResult> {
    try {
      signal.throwIfAborted()
      const settings = this.requireSettings()
      const audio = decodeAudio(audioBase64)
      const backend = asrBackend(settings.asrBackend)
      if (backend === 'web-speech') throw new EarsError(EARS_ERROR_CODES.asrUnsupportedBackend, 'Web Speech recordings are transcribed in the browser')
      if (backend === 'local-whisper') {
        const model = whisperModel(settings.localWhisperModel)
        const acceleration = this.whisperAcceleration(settings.localWhisperAcceleration)
        const runtimeAvailable = await this.whisperIsAvailable(acceleration)
        const state = await this.whisperModels.getWhisperModelState(model, runtimeAvailable)
        validateWhisperTranscription(state)
        const text = await transcribeWithWhisper({
          audio,
          mimeType,
          language: settings.localWhisperLanguage,
          model,
          variant: acceleration,
          signal
        })
        signal.throwIfAborted()
        return remoteTextSuccess(text)
      }

      const endpoint = cloudAsrEndpointFor(settings)
      const model = cloudAsrModelFor(settings)
      if (model === '') throw new EarsError(EARS_ERROR_CODES.asrModelNotConfigured, 'The cloud ASR model is not configured')
      const providerEntry = cloudProviderEntry(settings.cloudAsrProvider)
      if (providerEntry === undefined) throw new EarsError(EARS_ERROR_CODES.asrProviderUnknown, `Unknown dsh-ears cloud ASR provider: ${settings.cloudAsrProvider}`, { provider: settings.cloudAsrProvider })
      const credential = cloudAsrCredentialFor(settings)
      if (providerEntry.apiKeyRequired && credential === '') throw new EarsError(EARS_ERROR_CODES.asrApiKeyNotConfigured, 'The cloud ASR API key is not configured')
      if (providerEntry.protocol === 'deepgram') {
```

</details>

**依据 4 · 源码核查**：[src/asr/openai-compatible.ts:22-47](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/asr/openai-compatible.ts#L22-L47)

具体 multipart 与不跟随重定向行为。

<details>
<summary>查看原文（26行）</summary>

```text
  const credential = options.credential?.trim()
  const endpoint = validateEndpoint(options.endpoint, Boolean(credential))
  const model = options.model.trim()
  if (model === '') throw new EarsError(EARS_ERROR_CODES.asrModelNotConfigured, 'The cloud ASR model is not configured')

  const form = new FormData()
  form.set('file', new Blob([new Uint8Array(options.audio)], { type: options.mimeType || 'application/octet-stream' }), fileName(options.mimeType))
  form.set('model', model)
  const language = languageCode(options.language)
  if (language !== 'auto') form.set('language', language)

  const headers: Record<string, string> = {}
  if (credential) headers.Authorization = `Bearer ${credential}`
  const timeout = new AbortController()
  const timer = setTimeout(() => timeout.abort(new EarsError(EARS_ERROR_CODES.asrRequestTimedOut, 'Cloud ASR request timed out')), REQUEST_TIMEOUT_MS)
  const forwardAbort = () => timeout.abort(options.signal.reason)
  options.signal.addEventListener('abort', forwardAbort, { once: true })
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: form,
      redirect: 'manual',
      signal: timeout.signal
    })
    const body = await readBoundedText(response, MAX_RESPONSE_BYTES, timeout.signal)
```

</details>

**依据 5 · 源码核查**：[src/asr/openai-compatible.ts:64-74](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/asr/openai-compatible.ts#L64-L74)

HTTPS 和 URL 凭据约束。

<details>
<summary>查看原文（11行）</summary>

```text
function validateEndpoint(value: string, credentialConfigured: boolean): string {
  let url: URL
  try {
    url = new URL(value.trim())
  } catch {
    throw new EarsError(EARS_ERROR_CODES.asrEndpointInvalid, 'Cloud ASR endpoint must use HTTP or HTTPS')
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new EarsError(EARS_ERROR_CODES.asrEndpointInvalid, 'Cloud ASR endpoint must use HTTP or HTTPS')
  if (credentialConfigured && url.protocol !== 'https:') throw new EarsError(EARS_ERROR_CODES.asrEndpointInvalid, 'Cloud ASR endpoints with credentials must use HTTPS')
  if (url.username !== '' || url.password !== '') throw new EarsError(EARS_ERROR_CODES.asrEndpointHasCredentials, 'Cloud ASR endpoint must not contain credentials')
  return url.toString()
```

</details>

**依据 6 · 源码核查**：[src/polish/service.ts:482-490](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/polish/service.ts#L482-L490)

实时流与随机 ID。

```text
      await session.open(signal)
      signal.throwIfAborted()
      const sessionId = randomUUID()
      this.realtimeSessions.set(sessionId, {
        session,
        timer: this.scheduleRealtimeSessionExpiry(sessionId, session)
      })
      registered = true
      return { sessionId }
```

**依据 7 · 源码核查**：[src/polish/service.ts:500-556](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/polish/service.ts#L500-L556)

错误、停止、空闲清理。

<details>
<summary>查看原文（57行）</summary>

```text
  async sendRealtimeAudio(sessionId: string, audioBase64: string, signal: AbortSignal): Promise<{ text: string; final: boolean }> {
    signal.throwIfAborted()
    const entry = this.realtimeSessions.get(sessionId)
    if (entry === undefined) throw new EarsError(EARS_ERROR_CODES.asrUnexpected, 'Realtime session was not found')
    const audio = decodeAudio(audioBase64)
    try {
      const result = await entry.session.sendAudio(audio, signal)
      if (this.realtimeSessions.get(sessionId) === entry) this.refreshRealtimeSessionExpiry(sessionId, entry)
      return result
    } catch (error) {
      // A failed send leaves the provider stream's state uncertain. Release
      // the socket and registry entry so later calls cannot use a dead stream.
      this.removeRealtimeSession(sessionId, entry.session)
      throw error
    }
  }

  async finishRealtime(sessionId: string, signal: AbortSignal): Promise<RemoteTextResult> {
    const entry = this.realtimeSessions.get(sessionId)
    try {
      signal.throwIfAborted()
      if (entry === undefined) throw new EarsError(EARS_ERROR_CODES.asrUnexpected, 'Realtime session was not found')
      const text = await entry.session.finish(signal)
      return remoteTextSuccess(text)
    } catch (error) {
      return toRemoteTextFailure(error, signal, EARS_ERROR_CODES.asrUnexpected, 'Realtime recognition failed')
    } finally {
      this.removeRealtimeSession(sessionId, entry?.session)
    }
  }

  async cancelRealtime(sessionId: string): Promise<{ cancelled: true }> {
    this.removeRealtimeSession(sessionId)
    return { cancelled: true }
  }

  private scheduleRealtimeSessionExpiry(sessionId: string, session: GenericRealtimeAsrSession): ReturnType<typeof setTimeout> {
    return setTimeout(() => {
      const entry = this.realtimeSessions.get(sessionId)
      if (entry?.session !== session) return
      entry.session.close()
      clearTimeout(entry.timer)
      this.realtimeSessions.delete(sessionId)
    }, REALTIME_SESSION_IDLE_TIMEOUT_MS)
  }

  private refreshRealtimeSessionExpiry(sessionId: string, entry: RealtimeSessionEntry): void {
    clearTimeout(entry.timer)
    entry.timer = this.scheduleRealtimeSessionExpiry(sessionId, entry.session)
  }

  private removeRealtimeSession(sessionId: string, expectedSession?: GenericRealtimeAsrSession): void {
    const entry = this.realtimeSessions.get(sessionId)
    if (entry === undefined || (expectedSession !== undefined && entry.session !== expectedSession)) return
    clearTimeout(entry.timer)
    entry.session.close()
    this.realtimeSessions.delete(sessionId)
```

</details>

#### 缺口

- 不同前端是否允许在录音窗口真正写入新后端、以及服务实际结果未测
  **影响**：只能确认非同一设置读取点，不能量化数据路径风险
  **进一步探讨**：用本地 mock，录音时更改后端并观测实际请求路由及错误

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地 Whisper 如何准备模型和隔离失效，超时与系统退出覆盖到哪？

**研究主题**：工程质量与复用、依赖、兼容与流程

#### 完整回答

本地 Whisper 先确认 native 变体能解析、模型已准备；模型仓库下载必须满足固定大小和 SHA-256，成功改名后写完成标记，读取时也会校验标记和文件。浏览器正常准备为 PCM16 WAV，Host 校验后放临时文件给独立 fork worker，使用 IPC 取结果。这把 native 崩溃限制为 worker 退出后的请求错误，Host 可在后续请求创建新 worker。Host 内串行队列持有模型操作，转写阶段准备取消计时器与强制终止；已开始的任务停下时清理临时 WAV 属尽力，进程异常时留下文件与否未测。尤其转写计时器是在等待 ensureContext 之后才设置，init IPC 调用没有 timeoutMs；因此转写超时不能承诺包含初次加载，取消外层 Promise 也未证明能打断挂住的模型初始化。加速变体可能要求重启，集成受平台 native 模块与磁盘预算影响。

#### 证据与依据

**依据 1 · 源码核查**：[src/asr/whisper-models.ts:424-448](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/asr/whisper-models.ts#L424-L448)

下载校验、最终改名和完成标记。

<details>
<summary>查看原文（25行）</summary>

```text
        await file.close()
      }

      handle.controller.signal.throwIfAborted()
      if (handle.bytes !== definition.bytes) throw new Error(`Whisper model size mismatch: expected ${definition.bytes} bytes, received ${handle.bytes ?? 0}`)
      const digest = hash.digest('hex')
      if (digest !== definition.sha256) throw new Error('Whisper model checksum verification failed')

      await rm(handle.filePath, { force: true })
      handle.controller.signal.throwIfAborted()
      await rename(handle.partialPath, handle.filePath)
      handle.controller.signal.throwIfAborted()
      await writeFile(handle.markerPath, JSON.stringify({ version: 1, model: handle.model, sha256: definition.sha256, bytes: definition.bytes } satisfies CompletionMarker), 'utf8')
      handle.progress = 1
      handle.bytes = definition.bytes
      handle.totalBytes = definition.bytes
    } catch (error) {
      if (!handle.cancelRequested && !isAbortError(error)) {
        const detail = error instanceof Error ? error.message : String(error)
        handle.error = detail
        handle.errorCode = EARS_ERROR_CODES.whisperDownloadFailed
        handle.errorParams = { detail }
      }
      await this.removeArtifacts(handle).catch((error) => {
        const detail = error instanceof Error ? error.message : String(error)
```

</details>

**依据 2 · 源码核查**：[src/asr/local-whisper.ts:69-74](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/asr/local-whisper.ts#L69-L74)

Host 串行队列和外层取消。

```text
  async transcribe(options: LocalWhisperOptions): Promise<string> {
    if (this.disposed) throw new EarsError(EARS_ERROR_CODES.backendLocalUnavailable, 'Local Whisper has been disposed')
    const run = this.queue.then(() => this.transcribeNow(options))
    this.queue = run.then(() => undefined, () => undefined)
    return rejectOnAbort(run, options.signal)
  }
```

**依据 3 · 源码核查**：[src/asr/local-whisper.ts:146-190](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/asr/local-whisper.ts#L146-L190)

设置转写计时器前需等模型加载；临时文件与取消。

<details>
<summary>查看原文（45行）</summary>

```text
  private async transcribeNow(options: LocalWhisperOptions): Promise<string> {
    if (this.disposed) throw new EarsError(EARS_ERROR_CODES.backendLocalUnavailable, 'Local Whisper has been disposed')
    options.signal.throwIfAborted()
    if (options.audio.byteLength === 0) throw new EarsError(EARS_ERROR_CODES.asrAudioEmpty, 'The recorded audio is empty')
    if (options.audio.byteLength > MAX_AUDIO_BYTES) throw new EarsError(EARS_ERROR_CODES.asrAudioTooLarge, 'The recorded audio is too large')
    assertPcm16Wav(options.audio, options.mimeType)
    options.signal.throwIfAborted()

    const modelPath = options.modelPath ?? whisperModelPath(options.model)
    const variant = options.variant ?? 'default'
    if (this.loadedVariant !== undefined && this.loadedVariant !== variant) {
      throw new WhisperRestartRequiredError(this.loadedVariant, variant)
    }
    const useGpu = options.useGpu ?? defaultWhisperUseGpu(variant)
    const worker = await this.ensureContext(modelPath, variant, useGpu)
    const directory = await mkdtemp(join(tmpdir(), 'dsh-ears-whisper-node-'))
    const inputPath = join(directory, 'recording.wav')
    const timeoutController = new AbortController()
    const timer = setTimeout(() => timeoutController.abort(new EarsError(EARS_ERROR_CODES.asrRequestTimedOut, 'Local Whisper transcription request timed out')), options.timeoutMs ?? TRANSCRIPTION_TIMEOUT_MS)
    const combined = new AbortController()
    const forwardAbort = (signal: AbortSignal) => {
      if (!combined.signal.aborted) combined.abort(signal.reason)
    }
    const forwardExternalAbort = () => forwardAbort(options.signal)
    const forwardTimeoutAbort = () => forwardAbort(timeoutController.signal)
    let killTimer: ReturnType<typeof setTimeout> | undefined
    const stopOnAbort = () => {
      worker.cancelActive()
      // A native call that ignores cooperative cancellation must not wedge the
      // serial queue forever; the worker is sacrificial by design.
      killTimer = setTimeout(() => worker.kill(), CANCEL_GRACE_MS)
    }
    options.signal.addEventListener('abort', forwardExternalAbort, { once: true })
    timeoutController.signal.addEventListener('abort', forwardTimeoutAbort, { once: true })
    combined.signal.addEventListener('abort', stopOnAbort, { once: true })

    try {
      options.signal.throwIfAborted()
      await writeFile(inputPath, options.audio)
      combined.signal.throwIfAborted()
      const request = worker.request({
        type: 'transcribe',
        audioPath: inputPath,
        language: normalizeLanguage(options.language) ?? null
      })
```

</details>

**依据 4 · 源码核查**：[src/asr/local-whisper.ts:206-213](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/asr/local-whisper.ts#L206-L213)

结束后释放本地临时文件。

```text
    } finally {
      clearTimeout(timer)
      if (killTimer !== undefined) clearTimeout(killTimer)
      options.signal.removeEventListener('abort', forwardExternalAbort)
      timeoutController.signal.removeEventListener('abort', forwardTimeoutAbort)
      combined.signal.removeEventListener('abort', stopOnAbort)
      await rm(directory, { recursive: true, force: true }).catch(() => undefined)
    }
```

**依据 5 · 源码核查**：[src/asr/local-whisper.ts:216-253](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/asr/local-whisper.ts#L216-L253)

init 请求没有超时参数，退出回收 worker。

<details>
<summary>查看原文（38行）</summary>

```text
  private async ensureContext(modelPath: string, variant: LibVariant, useGpu: boolean): Promise<LocalWhisperWorker> {
    if (this.loadedVariant !== undefined && this.loadedVariant !== variant) {
      throw new WhisperRestartRequiredError(this.loadedVariant, variant)
    }
    const key = `${modelPath}\0${variant}\0${useGpu ? 'gpu' : 'cpu'}`
    const current = this.worker
    if (current?.alive === true && this.contextKey === key) return current

    const worker = this.ensureWorker()
    // The worker releases any superseded context before loading this one, so
    // the old key no longer describes worker state once init is in flight.
    this.contextKey = undefined
    await worker.request({ type: 'init', modelPath, variant, useGpu })
    this.contextKey = key
    this.loadedVariant = variant
    return worker
  }

  private ensureWorker(): LocalWhisperWorker {
    const current = this.worker
    if (current?.alive === true) return current
    let worker: LocalWhisperWorker
    try {
      worker = this.createWorker()
    } catch (error) {
      if (error instanceof EarsError) throw error
      throw new EarsError(
        EARS_ERROR_CODES.whisperWorkerFailed,
        'The Local Whisper worker process could not start',
        { detail: sanitizeEarsErrorText(errorText(error)) }
      )
    }
    this.worker = worker
    worker.onExit(() => {
      if (this.worker === worker) {
        this.worker = undefined
        this.contextKey = undefined
      }
```

</details>

**依据 6 · 源码核查**：[src/asr/whisper-worker-client.ts:70-92](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/asr/whisper-worker-client.ts#L70-L92)

独立 fork 和 IPC。

<details>
<summary>查看原文（23行）</summary>

```text
    const scriptPath = options.scriptPath ?? WhisperWorkerClient.scriptPath()
    const spawnChild = options.fork ?? fork
    if (options.fork === undefined && !existsSync(scriptPath)) {
      throw workerFailure('The Local Whisper worker entry is missing', 'lib/asr/whisper-worker.js')
    }

    try {
      this.child = spawnChild(scriptPath, [], {
        cwd: process.cwd(),
        // The desktop host runs inside Electron. Plain Node ignores this flag,
        // while an Electron executable launched with it behaves as Node.
        env: { ...process.env, ...options.env, ELECTRON_RUN_AS_NODE: '1' },
        execArgv: [],
        stdio: ['ignore', 'ignore', 'pipe', 'ipc']
      })
    } catch (error) {
      throw workerFailure('The Local Whisper worker process could not start', errorText(error))
    }

    this.child.on('message', (message) => this.handleMessage(message))
    this.child.on('exit', (code, signal) => this.handleExit(code, signal))
    this.child.on('error', (error) => this.handleProcessError(error))
    this.child.stderr?.on('data', (chunk: Buffer | string) => this.appendStderr(String(chunk)))
```

</details>

**依据 7 · 源码核查**：[src/asr/whisper-worker-client.ts:117-142](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/asr/whisper-worker-client.ts#L117-L142)

timeoutMs 仅提供时启用。

<details>
<summary>查看原文（26行）</summary>

```text
  request(payload: WhisperWorkerRequestPayload, options: { timeoutMs?: number } = {}): Promise<WhisperWorkerValue> {
    if (this.exited) return Promise.reject(this.unexpectedExitError())

    const id = this.nextId()
    if (payload.type === 'transcribe') this.activeRequestId = id
    let timer: ReturnType<typeof setTimeout> | undefined
    return new Promise<WhisperWorkerValue>((resolve, reject) => {
      let settled = false
      const finish = (error: EarsError | undefined, value?: WhisperWorkerValue) => {
        if (settled) return
        settled = true
        if (timer !== undefined) clearTimeout(timer)
        if (this.pending.get(id) === pending) this.pending.delete(id)
        if (this.activeRequestId === id) this.activeRequestId = undefined
        if (error !== undefined) reject(error)
        else resolve(value as WhisperWorkerValue)
      }
      const pending: PendingRequest = {
        resolve: (value) => finish(undefined, value),
        reject: (error) => finish(error)
      }
      this.pending.set(id, pending)
      if (options.timeoutMs !== undefined) {
        timer = setTimeout(() => {
          finish(workerFailure(`The Local Whisper worker did not answer "${payload.type}" in time`, `${options.timeoutMs} ms elapsed`))
        }, options.timeoutMs)
```

</details>

#### 缺口

- 初次模型加载挂起、真实 macOS Metal 崩溃和恢复未验证
  **影响**：独立进程隔离不等于每个平台都已通过
  **进一步探讨**：分别让 init 挂起、触发长转写和 native worker 崩溃，检查 Host 是否还能继续

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 清除草稿、继续编辑或取消润色时，哪些内容会继续留在输入栏？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

转写完成会先写原草稿加本轮文字，再决定是否润色。录音文件路径提交前要求基准未变，显式清空视为新的插入点；冲突的非空编辑则可丢弃迟到的转写。润色只提交 transcript 给 Host，默认开，缺指定模型可按 Host Agent 默认路由，实际发给已配置 LLM；本地 ASR 完成本身不能确定润色仍在本机。若失败、取消或草稿变化不符合可应用条件，通常保留现有文字。相等比较将空白折叠后判断，允许忽略换行或多空格变更；且原 base 符合条件时可以重建结果。因此作者的保留编辑要理解为防止多种非空变更覆盖，而不能承诺逐字保护格式。语音作命令草稿时应核对文字、数字、分隔符，并关闭意外的独立文字外发。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/voice-flow.ts:29-69](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/voice-flow.ts#L29-L69)

原稿先保存，再依据用户开关请求润色。

<details>
<summary>查看原文（41行）</summary>

```text
export function commitTranscript(options: CommitTranscriptOptions): void {
  const transcript = options.transcript.trim()
  if (transcript === '') {
    options.setState('idle')
    return
  }
  const draftBase = resolveCommitDraftBase(options)
  if (draftBase === null) {
    options.setState('idle')
    return
  }

  const draftAtStop = options.transcriptAlreadyApplied ? options.latestDraftRef.current : appendToDraft(draftBase, transcript)
  options.latestDraftRef.current = draftAtStop
  options.actionsRef.current.setDraft(draftAtStop)
  // Honor the local toggle so an off switch never flashes "polishing".
  // An enabled toggle still asks the Host even with an empty local pair;
  // the Host resolves dsh's agent-default-model selection in that case.
  if (options.isCurrent !== undefined && !options.isCurrent()) {
    options.setState('idle')
    return
  }
  if (!shouldRequestPolish(options.settings)) {
    options.setState('idle')
    return
  }
  void polishDraft({
    transcript,
    baseDraft: draftBase,
    originalDraft: options.baseDraft,
    draftAtStop,
    provider: options.settings.polishProvider,
    model: options.settings.polishModel,
    reasoningEffort: options.settings.polishReasoningEffort,
    remote: options.remote,
    setState: options.setState,
    latestDraftRef: options.latestDraftRef,
    actionsRef: options.actionsRef,
    polishAbortRef: options.polishAbortRef,
    isCurrent: options.isCurrent
  })
```

</details>

**依据 2 · 源码核查**：[src/client/voice-flow.ts:76-85](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/voice-flow.ts#L76-L85)

空白重置和非空冲突。

<details>
<summary>查看原文（10行）</summary>

```text
function resolveCommitDraftBase(options: CommitTranscriptOptions): string | null {
  if (!options.requireUnchanged) return options.baseDraft
  const expectedDraft = options.expectedDraft ?? options.baseDraft
  const currentDraft = options.latestDraftRef.current
  if (currentDraft === expectedDraft) return options.baseDraft
  // Clearing the composer is an intentional reset of the old draft, not a
  // conflicting edit. The transcript should become the new draft instead of
  // being discarded by stale-result protection.
  if (currentDraft.trim() === '') return ''
  return null
```

</details>

**依据 3 · 源码核查**：[src/client/voice-flow.ts:104-135](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/voice-flow.ts#L104-L135)

等待、取消和应用润色结果。

<details>
<summary>查看原文（32行）</summary>

```text
export async function polishDraft(options: PolishDraftOptions): Promise<void> {
  if (options.isCurrent !== undefined && !options.isCurrent()) return
  const controller = new AbortController()
  options.polishAbortRef.current = controller
  options.setState('polishing')

  try {
    const result = await options.remote.polish(options.transcript, options.provider, options.model, options.reasoningEffort, controller.signal)
    if (controller.signal.aborted) return
    if (!shouldApplyPolishResult(options.latestDraftRef.current, options.draftAtStop, options.baseDraft, options.originalDraft)) {
      if (!controller.signal.aborted) options.setState('idle')
      return
    }

    if (!result.ok) {
      const detailCode = isEarsErrorCode(result.error.code) ? result.error.code : undefined
      const detail = remoteFailureDetail(result.error)
      if (detailCode === undefined) options.setState('polish-error', detail)
      else options.setState('polish-error', detail, detailCode)
      return
    }
    if (result.value.status === 'error') {
      const detailCode = isEarsErrorCode(result.value.code) ? result.value.code : undefined
      const detail = remoteFailureDetail(result.value)
      if (detailCode === undefined) options.setState('polish-error', detail)
      else options.setState('polish-error', detail, detailCode, result.value.params)
      return
    }
    const text = result.value.text.trim() !== '' ? result.value.text.trim() : options.transcript
    const nextDraft = appendToDraft(options.baseDraft, text)
    options.latestDraftRef.current = nextDraft
    options.actionsRef.current.setDraft(nextDraft)
```

</details>

**依据 4 · 源码核查**：[src/client/voice-flow.ts:154-163](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/voice-flow.ts#L154-L163)

应用条件使用空白折叠。

<details>
<summary>查看原文（10行）</summary>

```text
export function shouldApplyPolishResult(currentDraft: string, draftAtStop: string, baseDraft: string, originalDraft = baseDraft): boolean {
  const current = collapseDraft(currentDraft)
  const effectiveBase = collapseDraft(baseDraft)
  const original = collapseDraft(originalDraft)
  return current === collapseDraft(draftAtStop) || (original !== '' && effectiveBase === original && current === original)
}

function collapseDraft(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}
```

</details>

**依据 5 · 源码核查**：[src/settings/polishing.ts:11-17](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/settings/polishing.ts#L11-L17)

默认启用。

```text
export const DEFAULT_POLISHING_SETTINGS: PolishingSettings = Object.freeze({
  enabled: true,
  provider: '',
  model: '',
  reasoningEffort: '',
  prompt: ''
})
```

**依据 6 · 源码核查**：[src/polish/service.ts:559-578](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/polish/service.ts#L559-L578)

Host route 取 Agent 默认的条件。

<details>
<summary>查看原文（20行）</summary>

```text
  async polish(transcript: string, provider: string, model: string, reasoningEffort: string, signal: AbortSignal): Promise<RemoteTextResult> {
    try {
      signal.throwIfAborted()
      const raw = transcript.trim()
      if (raw === '' || raw.length > MAX_TRANSCRIPT_CHARACTERS) return remoteTextSuccess(raw)
      const settings = this.optionalSettings()
      const storedPrompt = settings.polishPrompt
      const finish = (text: string): RemoteTextResult => remoteTextSuccess(storedPrompt.trim() === '' ? applySpokenEnumerationLayout(text) : text)
      // Keep the local fields empty to mean "follow dsh"; never persist or
      // expose the Agent default as a second dsh-ears route.
      const defaultRoute = settings.polishingEnabled ? this.agentDefaultModelSelection() : undefined
      const route = resolvePolishRoute(settings, provider, model, defaultRoute)
      if (route === null) return finish(raw)
      const routeProvider = route.provider
      const routeModel = route.model

      const timeout = new AbortController()
      const timer = setTimeout(() => timeout.abort(), POLISH_TIMEOUT_MS)
      const forwardAbort = () => timeout.abort(signal.reason)
      signal.addEventListener('abort', forwardAbort, { once: true })
```

</details>

**依据 7 · 源码核查**：[src/polish/service.ts:631-654](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/polish/service.ts#L631-L654)

准备模型并提交文字及系统提示。

<details>
<summary>查看原文（24行）</summary>

```text
  private async completePolish(
    provider: string,
    model: string,
    raw: string,
    storedPrompt: string,
    effort: string | undefined,
    signal: AbortSignal
  ): Promise<string> {
    const prepared = await this.ctx.llm.prepareCall({
      provider,
      model,
      ...(effort === undefined ? {} : { reasoningEffort: effort as ReasoningEffortId })
    }, signal)
    const message = createUserMessage({
      content: [{ type: 'text', text: polishUserText(raw) }],
      source: { kind: 'user' }
    })
    const output = await collectText(prepared.stream({
      ...prepared.config,
      messages: [message],
      system: resolvePolishSystemPrompt(storedPrompt),
      signal
    }), MAX_POLISHED_CHARACTERS)
    if (output === '') throw new EarsError(EARS_ERROR_CODES.polishNoText, 'The dsh LLM route returned no polished text')
```

</details>

#### 缺口

- 真实宿主的输入归一化及用户何时会只改空白还需复测
  **影响**：不能承诺所有格式编辑保留
  **进一步探讨**：录制后只改行分隔和实际数字，分别比较进入润色前后的草稿

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些人适合限定试用，如何区分源码、作者验证和采用成本？

**研究主题**：采用判断、效果与总成本

#### 完整回答

经常口述普通需求且能自行校对的 DSH Web 用户，可以在隔离测试会话用一段无敏感内容，优先单一已核对后端、先关闭润色，再检查原始文字及原有草稿。可逆退路是停止录音、清除草稿、撤回麦克风权限并用键盘。首次成本包括宿主版本、权限、模型下载和验证，持续要对比转写等待、校对和 CPU／GPU 或云 API 配额，识别错误时回退和重录；无一项已有同条件量化。根包要求 Node 22.19 对应范围及 DSH RC；CHANGELOG 指定 0.2.1-rc.4 为编译和验收基线，作者报告 CI 和 package 检查，但没有复跑 macOS Metal 或新真实麦克风确认。脚本确实要求 worker 和客户端存在，范围只能支撑已发表的工程检查条件。若草稿内容或格式异常、麦克风状态不明确、路由与预期不符，及时停止并回退。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:28-52](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/package.json#L28-L52)

宿主运行及模块版本条件。

<details>
<summary>查看原文（25行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.1"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/client.d.ts",
      "default": "./lib/client.js"
    },
    "./typert": {
      "types": "./lib/typert.d.ts",
      "default": "./lib/typert.js"
    },
    "./remote": {
      "types": "./lib/remote.d.ts",
      "default": "./lib/remote.js"
    },
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 作者声明**：[CHANGELOG.md:16-27](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/CHANGELOG.md#L16-L27)

作者声明测试覆盖与明确空缺。

<details>
<summary>查看原文（12行）</summary>

```text
### Changed

- **The compile and certification baseline is dsh `0.2.1-rc.4`** while the supported minimum stays `>=0.2.0-rc.1`. The dsh family and `@deepseek-ai/dsh-client-store` move together, and CI certifies `0.2.0-rc.1` and `0.2.1-rc.4`. `0.2.2-rc.1` needs a separate cordis 4.1 / schemastery 3.19 port (D-062).
- **The open dependency updates ride the same validated tree:** tsdown `0.23.4`, vitest `5.1.0`, zustand `5.0.16`, immer `11.2.9`, `@thesvg/react` `4.0.4`, and pnpm/action-setup `v6.1.1`.
- **Two Local Whisper failure codes are localized.** `whisper.workerFailed` and `whisper.releaseFailed` join the structured voice-error copy in Chinese and English.

### Verification notes

- `pnpm check`, `pnpm test` (610 tests), `pnpm build`, `pnpm verify:package`, and `pnpm release:check` pass.
- The CI matrix passes on Ubuntu and Windows, the dependency audit passes, and both DSH compatibility smokes (`0.2.0-rc.1` and `0.2.1-rc.4`) pass.
- A built-worker smoke loaded the real native addon inside the child, failed only on a deliberately missing model file, and exited 0; the Host bundle contains no native reference.
- The macOS Metal SIGABRT reproducer was not re-run: no Metal-capable machine is available here, so the real-GPU smoke remains an owed manual gate. The tooltip fix carries the reporter's desktop A/B verification; no new real-renderer or real-microphone click-through is claimed.
```

</details>

**依据 3 · 源码核查**：[scripts/verify-package.mjs:51-67](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/scripts/verify-package.mjs#L51-L67)

包构建查 worker、Host、Web/Remote 导出。

<details>
<summary>查看原文（17行）</summary>

```text
if (typeof manifest.name !== 'string' || manifest.name === '') fail('package name is missing')
if (typeof manifest.version !== 'string' || manifest.version === '') fail('package version is missing')
if (manifest.engines?.node !== '^22.19.0 || >=24.0.0') {
  fail('engines.node must match the supported Node range')
}

requireFile('main', manifest.main)
requireFile('types', manifest.types)
requireFile('whisper worker entry', 'lib/asr/whisper-worker.js')
requireExport('.', 'default')
requireExport('.', 'types')
requireExport('./client', 'default')
requireExport('./client', 'types')
requireExport('./typert', 'default')
requireExport('./typert', 'types')
requireExport('./remote', 'default')
requireExport('./remote', 'types')
```

</details>

**依据 4 · 源码核查**：[src/client/MicrophoneButton.tsx:120-132](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/MicrophoneButton.tsx#L120-L132)

取消请求和实时路径。

<details>
<summary>查看原文（13行）</summary>

```text
    const cancel = voiceSession.onCancelRequested(() => {
      transcribeAbortRef.current?.abort()
      polishAbortRef.current?.abort()
      mediaStartCancelledRef.current = true
      realtimeStartAbortRef.current?.abort()
      realtimeStartAbortRef.current = null
      const realtimeCapture = realtimeCaptureRef.current
      realtimeCaptureRef.current = null
      realtimeCapture?.abort()
      const sessionId = realtimeRemoteSessionIdRef.current
      realtimeRemoteSessionIdRef.current = null
      if (sessionId !== null) void remote.cancelRealtime(sessionId)
    })
```

</details>

#### 缺口

- 无本次同版本录音、真实 Host 或时延对照
  **影响**：试用结论仅限低风险材料与可逆流程
  **进一步探讨**：先固定浏览器、Host、模式、语句及对照，记录正确率、CPU／GPU 或云用量

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 锁定录音时后端并公开润色差分，能否减少用户误送音频或误提交修改？

**研究主题**：新假设与验证

#### 完整回答

提出未验证设计。录音时固化捕获类型和 Host 后端配置版本，到停止请求用该版本并校验是否仍获授权；如有变化则暂停并显示需确认。润色返回先显示针对原文本的差分，若草稿版本已变化，不自动替换。推导来自录制时只有客户端快照、Host stop 才选择当前设置，以及折叠空白比较可能覆盖格式。对照当前与改进版，以可记录的 mock ASR 和合成会话复现中途更换后端、删除原草稿、只调整格式和取消。分别统计传向非预期模拟路由的片段、需撤销的覆盖、点击次数及完成草稿耗时。若误送仍存在，或阻碍普通更正导致可用稿耗时明显增加，则不能确认收益。真实生产敏感音频不应用于这项检查。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/MicrophoneButton.tsx:493-504](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/MicrophoneButton.tsx#L493-L504)

提交没有显式后端修订。

<details>
<summary>查看原文（12行）</summary>

```text
      const transcribeAudio = await prepareRecordedAudioForBackend(mediaBackend, audio, { signal: controller.signal, cloudProvider: settingsRef.current.cloudAsrProvider })
      if (!isTranscriptionStillCurrent({
        mounted: mountedRef.current,
        signal: controller.signal,
        captureIsCurrent: voiceSession.isCurrentEpoch(epoch)
      })) return
      const result = await remote.transcribe(transcribeAudio.base64, transcribeAudio.mimeType, controller.signal)
      if (!isTranscriptionStillCurrent({
        mounted: mountedRef.current,
        signal: controller.signal,
        captureIsCurrent: voiceSession.isCurrentEpoch(epoch)
      })) return
```

</details>

**依据 2 · 源码核查**：[src/polish/service.ts:309-316](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/polish/service.ts#L309-L316)

Host 从当前设置取路由。

```text
  async transcribe(audioBase64: string, mimeType: string, signal: AbortSignal): Promise<RemoteTextResult> {
    try {
      signal.throwIfAborted()
      const settings = this.requireSettings()
      const audio = decodeAudio(audioBase64)
      const backend = asrBackend(settings.asrBackend)
      if (backend === 'web-speech') throw new EarsError(EARS_ERROR_CODES.asrUnsupportedBackend, 'Web Speech recordings are transcribed in the browser')
      if (backend === 'local-whisper') {
```

**依据 3 · 源码核查**：[src/client/voice-flow.ts:154-163](https://github.com/WizisCool/dsh-ears/blob/ccc24a24f94d0afb2bf52771bd9b74c3e26d7e92/src/client/voice-flow.ts#L154-L163)

空白折叠是设计待对照点。

<details>
<summary>查看原文（10行）</summary>

```text
export function shouldApplyPolishResult(currentDraft: string, draftAtStop: string, baseDraft: string, originalDraft = baseDraft): boolean {
  const current = collapseDraft(currentDraft)
  const effectiveBase = collapseDraft(baseDraft)
  const original = collapseDraft(originalDraft)
  return current === collapseDraft(draftAtStop) || (original !== '' && effectiveBase === original && current === original)
}

function collapseDraft(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}
```

</details>

#### 缺口

- 配置锁和差分均未实现或验证
  **影响**：不可当作现有防护
  **进一步探讨**：在两个 mock provider 及固定输入下复现所有竞态后再评估

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
