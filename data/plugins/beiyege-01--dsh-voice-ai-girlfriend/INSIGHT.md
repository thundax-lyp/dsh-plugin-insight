# dsh-voice-ai-girlfriend

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7e1274e](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/tree/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03)

<!-- BEGIN META -->
[![GitHub ★ 877](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=877&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/beiyege-01/dsh-voice-ai-girlfriend)
<!-- END META -->

> **功能**：全栈工具套件把DSH接到语音识别、回复朗读、数字人和可选QQ双向通信，完整播放与数据流需分层核验。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把既有DSH与STT/TTS/数字人接成界面和anchor/代际/code控制，外部模型能力分开；不据作者延迟宣称实测。

> **主要限制**：[Q03](#research-q03) spoken请求前推进、失败日志与512截断不保证完整朗读；loopback/CORS非认证，可选QQ外发与可改bridge地址不能统称本地闭环。

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
  - [Q01 · 语音、数字人与QQ分别满足什么，根是什么类型？](#detail-section-11)
  - [Q02 · 拆句、队列、anchor和播放怎样接线？](#detail-section-12)
  - [Q03 · spoken、限长和本地接口能保证什么？](#detail-section-13)
  - [Q04 · 采用前需核什么，全周期成本和退路是什么？](#detail-section-14)
  - [Q05 · 段级账本如何超出现有anchor/code和onended？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有GPU/多服务运维且明确需要语音或数字人的用户，各层需求独立，正确完整交互非单次开口。

原生文字聊天/系统朗读与手工语音脚本；贡献为集成与打断/排队，不是新模型或情感效力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| STT/TTS | 语音输入/回复 | 模型服务与目标会话、512截断/played未知 |
| WAV播放 | 串行朗读/打断 | FIFO/onended非句完成反馈 |
| 数字人 | 视频口播 | latest替换，code取消不等计算回滚 |
| QQ | 远程双向交流 | NapCat真实外发，隐私单核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 同版DSH子插件/浏览器音频 | 必需 | 监听/输入/播放 | 宿主范围声明非验收 |
| Python bridge/语音模型 | 语音必需 | STT/TTS | 子包安装不等就绪 |
| GPU/驱动/权重磁盘 | 按所选模型 | 推理/数字人 | 作者数字非本次测量 |
| DUIX等数字人服务 | 可选 | 视频口播 | 不需则单独不用 |
| NapCat/QQ与授权 | 可选 | 外发/接收 | 不属于全本地流 |
| 可信桥地址/接口权限 | 采用前提 | 保护音频文本 | CORS非身份认证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 分层 | 先定纯语音/数字人/QQ需求 | 不直接开全栈 |
| 预检 | 核模型许可/地址/权限和副本 | 非敏感短消息 |
| 验收 | STT目标/短长句/失败打断核完整 | spoken不当played |
| 停止 | 漏读/异常外发停相关服务 | 回文字、核运行code/已发QQ |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | GPU/模型/磁盘 | Windows/WSL/Docker/Python多服务 | 硬件与许可需另核，量未知 |
| 持续 | 电力/显存/API/视频存储 | 音色/版本/数据流维护 | 无实测延迟/费用 |
| 失败恢复 | 重合成/重复计算 | 漏读/停止/外发核对 | 声音开始非完整结束 |
| 退出 | 音视频/配置留存 | 停服务并另处理QQ消息 | 停插件不撤已外发 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 语音链 | 拆句/TTS/WAV队列 | 长句失败完整性和实际延迟 |
| 数字人 | code/latest/discard | 实际音画同步/资源收益 |
| 交互体验 | 多媒介入口 | 理解率/情感与净成本收益 |

> **思考**：[Q03](#research-q03) spoken请求前推进、失败日志与512截断不保证完整朗读；loopback/CORS非认证，可选QQ外发与可改bridge地址不能统称本地闭环。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把既有DSH与STT/TTS/数字人接成界面和anchor/代际/code控制，外部模型能力分开；不据作者延迟宣称实测。

[Q02](#research-q02) anchor/代际与协作取消值得保留；[Q03](#research-q03) 句段排队/合成/播放必须分成功，后端限长对齐前端，数据离机范围明确。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) spoken请求前推进、失败日志与512截断不保证完整朗读；loopback/CORS非认证，可选QQ外发与可改bridge地址不能统称本地闭环。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 观察并先分层核纯语音、桥权限与完整朗读，不处理重要内容；漏读/异常外发停相关服务回文字，QQ/视频任务单独核状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定全栈根和子插件关键监听/播放/桥端点重新核查全部findings；未执行服务/模型/硬件/接口或目标测试，非全接口安全审计。

- 已检查：作者 README、包清单、源码路径 README.md、bridge/voice_bridge.py、dsh-plugin/package.json、dsh-plugin/src/client/bridge.ts、dsh-plugin/src/client/voice/reply-listener.tsx、dsh-plugin/src/client/voice/speaker.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根全栈及DSH监听/桥/播放/Python TTS数字人QQ关键端点；未全审录音/所有UI/模型权重/数字人内部或完整API安全。
- 下一步：[Q05](#research-q05) 长句/错误/decode/打断/切会话/队列替换对照漏读重复及全资源，尚未运行。

**分析版本**

- **仓库**：[beiyege-01/dsh-voice-ai-girlfriend](https://github.com/beiyege-01/dsh-voice-ai-girlfriend)
- **版本号**：未声明（[固定提交 7e1274e](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/tree/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证段级完成/失败账本与一致分段，参照已有anchor/code/onended测漏读/重复及总代价，不自动重放整轮。

[Q05](#research-q05) 长句/错误/decode/打断/切会话/队列替换对照漏读重复及全资源，尚未运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 1287 | — | — | 19956 |
| .mjs | source | 1 | 107 | 83 | 18 | — |
| .tsx | source | 13 | 2433 | 1854 | 425 | — |
| .ts | source | 13 | 1306 | 906 | 309 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：文本如何形成完整语音/数字人交互，失败取消和数据流边界支持怎样采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 语音、数字人与QQ分别满足什么，根是什么类型？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

根是包含Python服务、模型启动和DSH子插件的全栈工具套件，实际插件在dsh-plugin，不是根单包安装即全栈就绪。作者以语音陪伴定位，用户可分别需要麦克风→STT→DSH回复→TTS、数字人口播或QQ双向转发，三者应按需求独立评估。适合已有兼容GPU和多服务运维能力者，普通DSH文字聊天/系统朗读是直接低成本替代。

本包贡献是把既有ASR/TTS/数字人模型接会话、播放与打断/队列，不是新语音模型，也不保证情感效果、0.5秒响应或无漏读。模型/驱动/权重、NapCat/QQ和网络各自承担能力与许可条件；硬件/延迟数量为作者报告，未本地验证。合格结果为正确输入进入目标会话、回应完整可听且取消和外发可解释，而非单次开口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-22](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/README.md#L11-L22)

作者语音/数字人/QQ目标和延迟主张。

<details>
<summary>查看原文（12行）</summary>

```text
这是一位住在你电脑里的 AI 女友：点一下麦克风，她听你说话、跟你拌嘴、把回答一字一句念给你听；你出门了，她追到你的 QQ 上继续聊；旁边那个窗口里的姑娘也不是摆设——她闲着会发呆，说话时会开口。

她有点小脾气，但你大概也会喜欢上这些：

- ⚡ **嘴快**：你说完话，她 0.5 秒内开口 —— FunASR 中文识别只要 150ms、TTS 几乎秒开，反应比你还快
- 🎧 **耳朵挑**：-35dB 噪声门 + silero VAD 双重把关 —— 风扇、键盘、电视声统统进不来，只有你说话她才理
- 📱 **粘人**：她的回复自动推到你的 **QQ**（文本 + 语音 + 图片）—— 你不在电脑前，她也能找到你
- 👧 **会动**：右侧数字人窗口，空闲时发呆、说话时开口 —— 一个会呼吸的 AI，不是冷冰冰的对话框
- 🎬 **会演**：回复不只是声音——**流式数字人**（DUIX）把你的回复实时生成口播视频：长回复切成 ≤10 秒小段，边生成画面边合成下一段语音，一段接一段连续播放，TTS 与口型同步开口
- 🔇 **懂打断**：你插嘴她就闭嘴听你说；想让她把话说完，点一下开关就切回排队模式
- 🔊 **声音是你的**：TTS 声音克隆（OmniVoice，600+ 语言），音色由你给的参考音频决定，或直接用参数设计音色——她可以长成你喜欢的样子
- 🎛️ **随你调配**：数字人开关（开=视频+声音同步 / 关=接近即时的纯语音朗读）、QQ 推送开关、女友窗开关、插话/排队模式，全部工具行一键切换
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/package.json:1-24](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/dsh-plugin/package.json#L1-L24)

子插件与宿主版本声明。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/client/bridge.ts:33-63](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/dsh-plugin/src/client/bridge.ts#L33-L63)

STT/TTS桥分层。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

#### 缺口

- 无真实GPU/语音/目标宿主与用户效果测试
  **影响**：不能承诺硬件适配、低延迟或陪伴收益
  **进一步探讨**：分纯语音/数字人/QQ非敏感小任务验完整交互和资源，先不全栈。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 拆句、队列、anchor和播放怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端监听assistant-step，用anchor保护挂载前旧历史并在打断时精确跳当前回复；运行中收完整句，settled补尾句，按anchor/index排TTS请求串行，播放队列可流水衔接。TTS经bridgeBase（localStorage可覆盖）POST文本取WAV，speaker FIFO解码并onended推进，stop增generation、停当前并清队列，dispose关AudioContext。

Python TTS infer_lock串行，监视请求disconnect设thread event供合成循环协作停止，不是网络abort就证明所有GPU工作瞬停。数字人是独立后台code队列，新提交替换未开始旧任务，discard标code并移排队，不保证已运行计算完全回滚。已有anchor/code/代际与协作取消是正向工程设计，可移植但每阶段成功语义须分。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/client/voice/reply-listener.tsx:84-103](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/dsh-plugin/src/client/voice/reply-listener.tsx#L84-L103)

历史和打断anchor基线。

<details>
<summary>查看原文（20行）</summary>

```text
  // Per-node complete sentences already spoken (node.key -> count).
  const spokenRef = useRef(new Map<string, number>())
  // History replay protection: baseline anchor. On mount the conversation
  // snapshot can be EMPTY (session history loads asynchronously after a
  // restart), so a one-shot seed there would miss the history and every old
  // reply would replay. Instead we wait until the first SETTLED assistant
  // node arrives, then set the baseline to the current max anchor — nothing
  // at or below it ever speaks. Live (running) nodes are never used for the
  // baseline, so a fresh reply in a brand-new session still speaks.
  const baselineRef = useRef<number | null>(null)
  // Serial TTS fetch chain: sentence N+1's fetch starts after N's resolves
  // (playback drains independently through the speaker queue — pipelined).
  const chainRef = useRef<Promise<void>>(Promise.resolve())
  // Barge-in: swallow the CURRENT reply only. We record the exact anchor of
  // the reply being interrupted (never a "<= max" line): if the interrupt
  // flag is consumed after a NEW reply already appeared in the snapshot, a
  // range-based skip would swallow that fresh reply too — the "new reply
  // never speaks" bug. Exact-anchor skip lets later replies play normally.
  const interruptRef = useRef(false)
  const skipAnchorRef = useRef(0)
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/client/voice/reply-listener.tsx:299-343](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/dsh-plugin/src/client/voice/reply-listener.tsx#L299-L343)

拆句/请求/播放队列。

<details>
<summary>查看原文（45行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/client/voice/speaker.ts:68-118](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/dsh-plugin/src/client/voice/speaker.ts#L68-L118)

onended、decode失败、stop代际和dispose。

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

**依据 4 · 源码核查**：[bridge/voice_bridge.py:311-346](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/bridge/voice_bridge.py#L311-L346)

限长、disconnect和推理锁。

<details>
<summary>查看原文（36行）</summary>

```text
@app.post("/api/tts")
async def tts(req: TTSRequest, request: Request) -> Response:
    """Text to speech: { text } -> 16 kHz mono PCM16 WAV (Xiaoya voice clone).

    Cooperative cancellation: while the client aborts its fetch (the voice
    toggle turned off), the request disconnects here; a watchdog sets a
    threading event and the synthesis loop stops between chunks, so the GPU
    is freed immediately instead of draining the queue."""
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty text")
    if len(text) > 512:
        logger.warning("TTS text truncated from %d to 512 chars", len(text))
        text = text[:512]

    cancel = threading.Event()

    async def watch_disconnect() -> None:
        while True:
            if await request.is_disconnected():
                cancel.set()
                return
            await asyncio.sleep(0.2)

    watcher = asyncio.create_task(watch_disconnect())
    try:
        async with models.infer_lock:
            if PERSONAS.get(_current_persona, {}).get("engine", "qwen3") == "qwen3":
                handler = await models.ensure_tts()
            else:
                handler = None  # OmniVoice 引擎不需要 Qwen3 handler
            samples = await asyncio.to_thread(_synthesize, handler, text, cancel)
    finally:
        watcher.cancel()

    if cancel.is_set():
```

</details>

**依据 5 · 源码核查**：[bridge/voice_bridge.py:919-963](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/bridge/voice_bridge.py#L919-L963)

数字人排队/替换/discard。

<details>
<summary>查看原文（45行）</summary>

```text
@app.post("/api/dh/speak")
async def dh_speak(req: DHSpeakRequest) -> dict:
    """提交一段回复文本，生成数字人口播视频（后台排队，最新替换未开始任务）。"""
    if not _dh_enabled_now():
        _dh_stat("rejected")
        _dh_stats["last_reject"] = "数字人开关关闭（/api/dh/enable {enabled:true} 可打开）"
        raise HTTPException(status_code=400, detail="digital_human disabled (POST /api/dh/enable {enabled:true} to turn on)")
    text = (req.text or "").strip()
    if not text:
        _dh_stat("rejected")
        _dh_stats["last_reject"] = "空文本"
        raise HTTPException(status_code=400, detail="Empty text")
    if len(text) > DH_MAX_TEXT:
        logger.warning("DH text truncated from %d to %d chars", len(text), DH_MAX_TEXT)
        text = text[:DH_MAX_TEXT]
    code = str(uuid4())
    with _dh_lock:
        # 只保留正在运行的任务，未开始的旧排队任务被最新提交替换
        _dh_queue[:] = [t for t in _dh_queue if t["started"]]
        _dh_queue.append({"code": code, "text": text, "started": False})
        pending = sum(1 for t in _dh_queue if not t["started"])
    logger.info("DH enqueue: %s (%d chars), pending=%d", code, len(text), pending)
    _dh_stat("submits")
    _dh_stats["last_submit_at"] = time.time()
    return {"ok": True, "code": code}


class DHDiscardRequest(BaseModel):
    code: str


@app.post("/api/dh/discard")
async def dh_discard(req: DHDiscardRequest) -> dict:
    """作废一个已提交的数字人任务（用户打断/放弃该回复）：结果不再播放。"""
    code = (req.code or "").strip()
    if not code:
        raise HTTPException(status_code=400, detail="Empty code")
    with _dh_lock:
        _dh_discarded.add(code)
        # 若它还在排队，直接移除
        _dh_queue[:] = [t for t in _dh_queue if t.get("code") != code]
    logger.info("DH discard: %s", code)
    return {"ok": True}


```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · spoken、限长和本地接口能保证什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

spokenRef在TTS发起前一次推进到所有speakable数量；请求失败仅console.error，没有按段回退/重试状态，speaker.speak只是入队，decode失败也resolve。故spoken名称不等播放完成，长句无标点可超512而后端直接截前512，前端仍认为整句已处理；能听到开头不代表完整回应。现有onended只推进WAV FIFO，不把句ID/文本完成反馈回listener，不能据该回调说已解决账本。

bridge默认loopback地址与CORS本地主机正则不是身份认证；所读TTS/DH/QQ端点没有应用鉴权门，宿主/部署防护须另核，不能据此声称已可远程越权。bridgeBase可改地址，麦克风/文本可送所选服务；QQ启用经NapCat真实外发，不是全本地闭环。QQ语音同样512截断、数字人latest-wins也意味着部分中间回复刻意不完整保留，产品取舍应告知。未读真实QQ/音频或运行接口，不写实际泄漏。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/client/voice/reply-listener.tsx:313-342](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/dsh-plugin/src/client/voice/reply-listener.tsx#L313-L342)

请求前标spoken及失败仅日志。

<details>
<summary>查看原文（30行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/client/voice/speaker.ts:82-92](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/dsh-plugin/src/client/voice/speaker.ts#L82-L92)

结束无段反馈、decode失败吞。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[bridge/voice_bridge.py:311-324](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/bridge/voice_bridge.py#L311-L324)

后端512截断。

<details>
<summary>查看原文（14行）</summary>

```text
@app.post("/api/tts")
async def tts(req: TTSRequest, request: Request) -> Response:
    """Text to speech: { text } -> 16 kHz mono PCM16 WAV (Xiaoya voice clone).

    Cooperative cancellation: while the client aborts its fetch (the voice
    toggle turned off), the request disconnects here; a watchdog sets a
    threading event and the synthesis loop stops between chunks, so the GPU
    is freed immediately instead of draining the queue."""
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty text")
    if len(text) > 512:
        logger.warning("TTS text truncated from %d to 512 chars", len(text))
        text = text[:512]
```

</details>

**依据 4 · 源码核查**：[bridge/voice_bridge.py:78-85](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/bridge/voice_bridge.py#L78-L85)

CORS非身份门。

```text
app = FastAPI(title="voice-bridge")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CONFIG.get("cors_origins", ["http://127.0.0.1:3080"]),
    allow_origin_regex=r"http://(127\.0\.0\.1|localhost):\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**依据 5 · 源码核查**：[dsh-plugin/src/client/bridge.ts:7-15](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/dsh-plugin/src/client/bridge.ts#L7-L15)

桥地址可覆盖。

```text
const DEFAULT_BRIDGE = 'http://127.0.0.1:8765'

/** Resolve the bridge base URL (localStorage override wins). */
export function bridgeBase(): string {
  try {
    return localStorage.getItem('s2s.voice.bridge')?.trim() || DEFAULT_BRIDGE
  } catch {
    return DEFAULT_BRIDGE
  }
```

**依据 6 · 源码核查**：[bridge/voice_bridge.py:1733-1753](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/bridge/voice_bridge.py#L1733-L1753)

QQ启用后外发及截断。

<details>
<summary>查看原文（21行）</summary>

```text
async def qq_send(req: QQSendRequest) -> dict:
    """Send { text } (and optionally TTS voice) to the configured QQ."""
    qq = CONFIG.get("qq", {})
    if not qq.get("enabled"):
        raise HTTPException(status_code=400, detail="QQ push disabled in bridge-config.json")
    base = qq.get("napcat_base", "http://127.0.0.1:3000")
    token = qq.get("napcat_token", "")
    user_id = req.user_id or qq.get("target_qq")
    if not user_id:
        raise HTTPException(status_code=400, detail="target_qq not configured")
    if not req.text.strip() and not req.voice:
        raise HTTPException(status_code=400, detail="Empty text")

    from qq_bridge import send_text, send_voice

    try:
        if req.voice:
            if not req.text.strip():
                raise HTTPException(status_code=400, detail="voice needs text to synthesize")
            text = (req.text or "").strip()[:512]
            cancel = threading.Event()
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用前需核什么，全周期成本和退路是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议观察，先分纯语音/数字人/QQ独立需求，在非敏感副本确认桥地址、接口权限和目标会话，再做短句/长句/失败/打断的完整朗读核验；不要因README“本地/快”就输入重要内容或打开QQ。STT文本正确及目标提交、实际声音/视频都要核，子插件加载不是全链完成。

首次GPU/驱动/模型权重/磁盘与Windows/WSL/Docker/Python服务、音色素材授权是明显负担；持续电力/显存、模型API与视频存储、版本/音色/数据流维护，金额/量未知。失败重合成排障可能重复计算或漏读，停止音频/关服务并退文字，同时核是否已外发/数字人code仍跑；关插件不撤回QQ消息。退出保留原文字/配置备份，停选定服务并单独处理音视频与QQ数据，未核自动清理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:53-59](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/README.md#L53-L59)

作者多服务启动流程。

```text
重启电脑后只需要做两件事：**自己先打开 Docker Desktop**，然后**双击 `bridge/start-full-stack.cmd`**（也可拷到桌面建快捷方式）。脚本会按正确顺序把整条链路拉起来，最后打印一张自检表；浏览器会用带 token 的链接自动打开。

| 步骤 | 做什么 | 幂等性 |
|---|---|---|
| 1/6 | 检查 Docker 引擎与 DUIX 容器；容器没起就 `docker start` 并等 `:9000` 应答 | 已在运行则跳过 |
| 2/6 | 调用 `start-omnivoice-wsl.ps1`：起 WSL2 OmniVoice（`:9877`）+ 同步 bridge-config 的 IP + 拉起桥接（`:8765`） | 已在运行则跳过 |
| 3/6 | 桥接保险：没起来就启动；缺 `DEEPSEEK_API_KEY` 时自动重启修复（余额徽章不再 503） | 幂等 |
```

**依据 2 · 源码核查**：[dsh-plugin/package.json:1-8](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/dsh-plugin/package.json#L1-L8)

子包明确bridge/NapCat依赖。

```text
{
  "name": "@beiyege-01/dsh-voice-ai-girlfriend",
  "version": "0.4.0",
  "description": "Voice AI girlfriend for DeepSeek Harness 0.2.x: FunASR mic input, OmniVoice TTS replies, companion animation window, QQ two-way chat. Needs the repo's voice bridge + NapCat.",
  "type": "module",
  "engines": {
    "dsh": ">=0.1.3-alpha.1 <0.3.0"
  },
```

**依据 3 · 源码核查**：[dsh-plugin/src/client/bridge.ts:19-29](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/dsh-plugin/src/client/bridge.ts#L19-L29)

语音总闸含数字人。

<details>
<summary>查看原文（11行）</summary>

```text
 * 语音总开关（composer 上的喇叭按钮，localStorage `s2s.voice.enabled`）。
 *
 * ⚠️ 它是整条回复管道的总闸：关掉时 reply-listener 直接 return，逐句 TTS 与
 * 数字人提交**都不会发生**（数字人本质是「用视频代替朗读」，所以跟着总闸走）。
 * 界面据此给出提示，避免「我开了数字人怎么没反应」。
 */
export function readVoiceEnabled(): boolean {
  try {
    return localStorage.getItem('s2s.voice.enabled') !== '0'
  } catch {
    return true
```

</details>

**依据 4 · 源码核查**：[bridge/voice_bridge.py:1733-1753](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/bridge/voice_bridge.py#L1733-L1753)

外发与成本需单独核。

<details>
<summary>查看原文（21行）</summary>

```text
async def qq_send(req: QQSendRequest) -> dict:
    """Send { text } (and optionally TTS voice) to the configured QQ."""
    qq = CONFIG.get("qq", {})
    if not qq.get("enabled"):
        raise HTTPException(status_code=400, detail="QQ push disabled in bridge-config.json")
    base = qq.get("napcat_base", "http://127.0.0.1:3000")
    token = qq.get("napcat_token", "")
    user_id = req.user_id or qq.get("target_qq")
    if not user_id:
        raise HTTPException(status_code=400, detail="target_qq not configured")
    if not req.text.strip() and not req.voice:
        raise HTTPException(status_code=400, detail="Empty text")

    from qq_bridge import send_text, send_voice

    try:
        if req.voice:
            if not req.text.strip():
                raise HTTPException(status_code=400, detail="voice needs text to synthesize")
            text = (req.text or "").strip()[:512]
            cancel = threading.Event()
```

</details>

#### 缺口

- 无硬件/许可/服务权限/完整朗读和退出恢复验收、实际全成本
  **影响**：不支持常规试用或情感/节时承诺
  **进一步探讨**：先离线非敏感纯语音分层矩阵，确认数据流/模型许可，记录资源和人工，完整性不满足先修。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 段级账本如何超出现有anchor/code和onended？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是以会话anchor+句段ID记录queued、synthesized、playing、played/failed/cancelled，将后端长度约束前置一致分段并回传speaker完成；打断保已知状态而非自动重放整轮。已有anchor历史保护、generation、code与onended是参照，不能笼统把加取消或播放回调当新贡献。

在长无标点/跨512、TTS失败、WAV decode失败、切会话/打断与latest数字人替换对照当前实现，测漏读/重复、段完成归属和等待/显存/维护成本。若现有speaker状态已够用、细账本导致过度重试/重复外发或净负担更高，则否定。尚未执行，不纳现有能力与评分。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/client/voice/reply-listener.tsx:313-342](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/dsh-plugin/src/client/voice/reply-listener.tsx#L313-L342)

段提前完成缺口。

<details>
<summary>查看原文（30行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/client/voice/speaker.ts:68-107](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/dsh-plugin/src/client/voice/speaker.ts#L68-L107)

已有结束与代际构成基线。

<details>
<summary>查看原文（40行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[bridge/voice_bridge.py:939-963](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/7e1274ead12d7f5fe6f0e7227b3ede70803d6e03/bridge/voice_bridge.py#L939-L963)

已有code/替换取消基线。

<details>
<summary>查看原文（25行）</summary>

```text
        pending = sum(1 for t in _dh_queue if not t["started"])
    logger.info("DH enqueue: %s (%d chars), pending=%d", code, len(text), pending)
    _dh_stat("submits")
    _dh_stats["last_submit_at"] = time.time()
    return {"ok": True, "code": code}


class DHDiscardRequest(BaseModel):
    code: str


@app.post("/api/dh/discard")
async def dh_discard(req: DHDiscardRequest) -> dict:
    """作废一个已提交的数字人任务（用户打断/放弃该回复）：结果不再播放。"""
    code = (req.code or "").strip()
    if not code:
        raise HTTPException(status_code=400, detail="Empty code")
    with _dh_lock:
        _dh_discarded.add(code)
        # 若它还在排队，直接移除
        _dh_queue[:] = [t for t in _dh_queue if t.get("code") != code]
    logger.info("DH discard: %s", code)
    return {"ok": True}


```

</details>

#### 缺口

- 未做段反馈/对齐分段版本对照
  **影响**：不能认定账本改善听觉完整性或值得成本
  **进一步探讨**：隔离文本/假失败比漏读重复和总资源，安全退出不自动重放QQ。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
