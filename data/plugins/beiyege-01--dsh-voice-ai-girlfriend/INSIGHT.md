# DSH 语音 AI 女友套件

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f1a6286](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/tree/f1a62862104c8e54c85a02d83d2e466e75666e72)

<!-- BEGIN META -->
[![GitHub ★ 731](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=731&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/beiyege-01/dsh-voice-ai-girlfriend)
<!-- END META -->

> **功能**：为 DSH 会话接入本地语音识别、回复朗读、数字人口播及可选 QQ 通信。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)支持的贡献是既有DSH会话与STT/TTS/数字人的集成和打断/排队接线，不是新语音模型，也不证明0.5秒或情感效果。

> **主要限制**：[Q03](#research-q03)显示请求前已推进spoken，失败只日志，后端512字符截断也可能与整句前端不对齐；能开口不代表完整朗读。bridge的loopback/CORS不是身份认证，可选QQ也会外发，不能用本地宣传概括整个数据流。

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
  - [Q01 · 整套产品相对文字会话增加什么？](#detail-section-11)
  - [Q02 · 回复怎样进入TTS并按序播放？](#detail-section-12)
  - [Q03 · 失败或长句会怎样，loopback是否等于认证？](#detail-section-13)
  - [Q04 · 为什么暂不推荐普通用户部署整套？](#detail-section-14)
  - [Q05 · 将排队、合成与播放完成分开能否减少漏读？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有兼容GPU和多服务运维能力、确需语音/数字人交互的用户，可进一步评估分层方案。

系统朗读和独立TTS是低复杂度参照；套件增加会话/数字人/QQ接线，模型和口型引擎能力归原项目，不算根套件新算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 回复朗读 | assistant拆句合成播放 | 512截断/失败计数需核对 |
| 数字人 | 回复合成为口播任务 | 独立GPU/DUIX及队列，不保证即时 |
| QQ通信 | 文本/语音发送 | NapCat与明确外发目标 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容DSH和麦克风浏览器 | 会话语音必需 | 采集与监听 | 回文字 |
| Python bridge/语音模型 | 是 | STT与TTS | 服务不可用 |
| WSL/GPU及DUIX/Docker | 按配置/数字人 | 推理与视频 | 关闭视频不等于修复语音 |
| NapCat/QQ | 可选 | 外发通信 | 不启用以免扩大流向 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 定需求 | 用户先选纯语音或视频 | 不默认全栈 |
| 核查 | 固定地址、服务与数据流 | 不清则观察 |
| 后续验证 | 非敏感长句/失败/打断 | 完整性逐段可核对 |
| 退出 | 关闭相关服务及QQ | 回文字或系统朗读 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | GPU、模型和磁盘，实际量未知 | Windows/WSL/Docker多服务配置 | README硬件数为作者报告 |
| 持续 | 电力、显存、模型API/视频存储未知 | 版本、音色和数据流维护 | QQ非本地闭环 |
| 恢复 | 重合成与排障资源未知 | 核对漏读、关服务及退文字 | 成功开口非完整播放 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 语音接线 | assistant拆句到TTS/WAV播放 | 失败长句完整性及实测延迟 |
| 数字人 | 最新排队替换和discard code | 实际音画同步/显存收益 |
| 用户体验 | 多媒介集成 | 情感价值、理解率和总成本 |

> **思考**：[Q03](#research-q03)显示请求前已推进spoken，失败只日志，后端512字符截断也可能与整句前端不对齐；能开口不代表完整朗读。bridge的loopback/CORS不是身份认证，可选QQ也会外发，不能用本地宣传概括整个数据流。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)支持的贡献是既有DSH会话与STT/TTS/数字人的集成和打断/排队接线，不是新语音模型，也不证明0.5秒或情感效果。

[Q02](#research-q02)协作取消与anchor历史保护可借鉴，但[Q03](#research-q03)前置spoken不能等同播放完成，后端限长必须与客户端分段对齐；移植要明确每阶段成功含义及数据离机范围。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)显示请求前已推进spoken，失败只日志，后端512字符截断也可能与整句前端不对齐；能开口不代表完整朗读。bridge的loopback/CORS不是身份认证，可选QQ也会外发，不能用本地宣传概括整个数据流。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 当前观察，先分清纯语音、数字人与QQ的独立需求，核对桥地址、接口权限和完整朗读，再谈试用；重要内容不要在未知数据流中处理，异常外发或漏读时停服务回文字。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查回复到TTS播放、取消和数字人队列源码；发现前置spoken计数及512截断的完整性风险，未运行复现；建议观察，段级状态账本未验证。

- 已检查：作者 README、包清单、源码路径 README.md、dsh-plugin/package.json、dsh-plugin/src/index.ts、dsh-plugin/src/client/voice/reply-listener.tsx、dsh-plugin/src/client/bridge.ts、bridge/voice_bridge.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定全栈根下DSH客户端监听、HTTP桥及Python语音/数字人/QQ关键端点源码；未执行服务、模型、目标测试或硬件测量，不作完整接口安全审计。
- 下一步：先静态核对speaker回调、长度和重试状态，再对固定非敏感回复记录遗漏、重复、延迟和资源；本轮不运行模型。

**分析版本**

- **仓库**：[beiyege-01/dsh-voice-ai-girlfriend](https://github.com/beiyege-01/dsh-voice-ai-girlfriend)
- **版本号**：未声明（[固定提交 f1a6286](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/tree/f1a62862104c8e54c85a02d83d2e466e75666e72)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出与anchor/code兼容的段级排队、合成、播放完成账本假设，先核对现有speaker回调再对照长句、失败和打断；未实现且不自动重放整轮。

先静态核对speaker回调、长度和重试状态，再对固定非敏感回复记录遗漏、重复、延迟和资源；本轮不运行模型。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1075 | — | — | 18212 |
| .mjs | source | 1 | 107 | 83 | 18 | — |
| .tsx | source | 13 | 2433 | 1854 | 425 | — |
| .ts | source | 13 | 1306 | 906 | 309 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH会话语音和数字人全栈如何接线，是否完整、可恢复且值得目标用户承担部署成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 整套产品相对文字会话增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向希望听读回复、语音交流并可选择数字人口播的DSH用户，目标是把既有会话内容转成语音/画面，而不是新增独立LLM。Python bridge明确只实例化STT/TTS，DSH仍承担模型；插件Node apply为空，主要在浏览器捕获和播放。相对系统朗读或独立TTS，增量是会话逐句监听、打断及可选数字人/QQ接线；不应把FunASR、OmniVoice或DUIX能力算本项目原创，也不以拟人描述推断情感效果。仓库根是全栈套件，真正DSH包在dsh-plugin。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-22](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/README.md#L11-L22)

作者主张语音、数字人与QQ整合。

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

**依据 2 · 源码核查**：[bridge/voice_bridge.py:1-17](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/bridge/voice_bridge.py#L1-L17)

Python职责与DSH LLM分工。

<details>
<summary>查看原文（17行）</summary>

```text
"""
Voice bridge — reuse the speech-to-speech STT / TTS handlers as a local HTTP
service for the DSH voice plugin.

Pipeline of the original backend (VAD -> STT -> LLM -> TTS) is NOT started:
this service instantiates only the STT and TTS handlers and exposes them over
HTTP, so the DSH agent itself plays the LLM role.

Buildout (see DSH-语音接入-设计方案.md):
  T1  skeleton + /api/health                          done
  T2  /api/stt   (WhisperSTTHandler, lazy load)       done
  T3  /api/tts   (Qwen3TTSHandler, lazy load)         done
  T8  /api/media/* lists + /media/* static mounts     <- current step

Run:
  D:\\speech-to-speech\\venv-speech\\Scripts\\python.exe -m uvicorn voice_bridge:app \
      --host 127.0.0.1 --port 8765
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/index.ts:1-10](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/dsh-plugin/src/index.ts#L1-L10)

Node半为空，浏览器负责功能。

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

#### 缺口

- 用户实际听读需求与相对系统朗读的价值未验证
  **影响**：不能认定拟人界面带来长期收益
  **进一步探讨**：用同一DSH回复比较系统朗读和套件的理解、打断、完整性与资源负担

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 回复怎样进入TTS并按序播放？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

listener读取useChat中的assistant-step，过滤中断和应跳过anchor，把清理文本拆句，按anchor/index排序；串行Promise链通过bridge.tts发送每句，成功拿WAV后speaker.speak，AbortController及总开关在发起前后检查。bridgeBase默认loopback但可被localStorage覆盖；tts POST JSON带signal。Python/api/tts取文本，infer_lock串行模型工作，watch_disconnect每0.2秒置线程取消事件；这是协作取消设计，不能证明所有外部引擎都即时释放GPU。数字人另有任务code，队列只保留正在运行及最新未开始任务，discard去掉排队并标记结果作废。依赖浏览器音频权限、匹配DSH节点契约及独立Python/模型服务，数字人再需DUIX和Docker。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/client/voice/reply-listener.tsx:301-345](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/dsh-plugin/src/client/voice/reply-listener.tsx#L301-L345)

真实assistant节点→句子→HTTP TTS→播放链。

<details>
<summary>查看原文（45行）</summary>

```text
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

**依据 2 · 源码核查**：[dsh-plugin/src/client/bridge.ts:7-15](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/dsh-plugin/src/client/bridge.ts#L7-L15)

loopback默认及浏览器覆盖地址。

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

**依据 3 · 源码核查**：[dsh-plugin/src/client/bridge.ts:50-63](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/dsh-plugin/src/client/bridge.ts#L50-L63)

实际HTTP/AbortSignal调用。

<details>
<summary>查看原文（14行）</summary>

```text
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

**依据 4 · 源码核查**：[bridge/voice_bridge.py:311-350](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/bridge/voice_bridge.py#L311-L350)

锁、断连监控及WAV返回。

<details>
<summary>查看原文（40行）</summary>

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
        logger.info("TTS cancelled by client disconnect")
        raise HTTPException(status_code=499, detail="TTS cancelled by client")
    wav = _pcm16_to_wav(samples)
    logger.info("TTS OK: %d chars -> %.2fs wav (%d bytes)", len(text), len(samples) / 16000.0, len(wav))
```

</details>

**依据 5 · 源码核查**：[bridge/voice_bridge.py:919-959](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/bridge/voice_bridge.py#L919-L959)

数字人排队替换与discard语义。

<details>
<summary>查看原文（41行）</summary>

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败或长句会怎样，loopback是否等于认证？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

有两个可从源码判断的完整性风险。listener在请求前就把spoken计数推进到全部可读句数，TTS失败catch只日志，不回退计数；同一节点若未再增长，失败句不会因本计数自动重试。Python TTS把超过512字符的文本直接截断，前端这里按完整句传入，没有在所读路径按512再拆，长无标点句可能只读前段；本轮未运行复现，不能称已听到漏读。bridge CORS允许配置来源及任意localhost端口，所读tts/dh/qq端点无请求身份校验；loopback限制网络暴露不等于浏览器或本机访问认证。QQ发送使用配置NapCat token/目标用户，可形成外发；这些服务不能按“全本地”概括。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/client/voice/reply-listener.tsx:309-339](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/dsh-plugin/src/client/voice/reply-listener.tsx#L309-L339)

请求前更新spoken且失败只日志。

<details>
<summary>查看原文（31行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[bridge/voice_bridge.py:319-324](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/bridge/voice_bridge.py#L319-L324)

单次TTS512字符截断明确存在。

```text
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty text")
    if len(text) > 512:
        logger.warning("TTS text truncated from %d to 512 chars", len(text))
        text = text[:512]
```

**依据 3 · 源码核查**：[bridge/voice_bridge.py:78-85](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/bridge/voice_bridge.py#L78-L85)

CORS允许loopback任意端口，非身份认证。

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

**依据 4 · 源码核查**：[bridge/voice_bridge.py:1732-1763](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/bridge/voice_bridge.py#L1732-L1763)

QQ token与可选择目标的外发路径。

<details>
<summary>查看原文（32行）</summary>

```text
@app.post("/api/qq/send")
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
            async with models.infer_lock:
                if PERSONAS.get(_current_persona, {}).get("engine", "qwen3") == "qwen3":
                    handler = await models.ensure_tts()
                else:
                    handler = None  # OmniVoice 引擎不需要 Qwen3 handler
                samples = await asyncio.to_thread(_synthesize, handler, text, cancel)
            result = send_voice(base, token, user_id, samples.astype("<i2").tobytes())
        else:
            result = send_text(base, token, user_id, req.text.strip()[:2000])
        return {"ok": True, "user_id": user_id, "napcat": result}
```

</details>

#### 缺口

- 长句漏读/失败恢复实际表现及全接口安全覆盖未执行
  **影响**：不能承诺完整朗读和即时打断，更不能公开暴露bridge
  **进一步探讨**：以长无标点回复、临时TTS失败和受控取消核对音频内容；静态继续核查接口身份及实际监听配置

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 为什么暂不推荐普通用户部署整套？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前观察，适合已有Windows/NVIDIA/WSL/Docker运维能力者进一步评估，不适合只想简单朗读的普通DSH用户默认安装。README建议16GB显存、30GB磁盘并列出全链峰值约15GB，这些是作者特定环境报告，不能当本轮硬件实测或最低保证。首次需要多模型、桥、TTS服务、Docker及可选QQ，持续有GPU占用、电力、模型API和版本维护，声音样本与生成视频也需管理。关闭数字人可减少图像链负担，但不会自动解决语音失败完整性与接口认证。先核清数据流和完整朗读再讨论试用；出现桥地址意外改变、QQ外发不符预期或长句/失败漏读时，停相关服务并退回文字或系统朗读。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:51-85](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/README.md#L51-L85)

多服务启动、版本及开关的作者报告。

<details>
<summary>查看原文（35行）</summary>

````text
## 一键全栈启动（推荐 · 2026-09-14 新增）

重启电脑后只需要做两件事：**自己先打开 Docker Desktop**，然后**双击 `bridge/start-full-stack.cmd`**（也可拷到桌面建快捷方式）。脚本会按正确顺序把整条链路拉起来，最后打印一张自检表；浏览器会用带 token 的链接自动打开。

| 步骤 | 做什么 | 幂等性 |
|---|---|---|
| 1/6 | 检查 Docker 引擎与 DUIX 容器；容器没起就 `docker start` 并等 `:9000` 应答 | 已在运行则跳过 |
| 2/6 | 调用 `start-omnivoice-wsl.ps1`：起 WSL2 OmniVoice（`:9877`）+ 同步 bridge-config 的 IP + 拉起桥接（`:8765`） | 已在运行则跳过 |
| 3/6 | 桥接保险：没起来就启动；缺 `DEEPSEEK_API_KEY` 时自动重启修复（余额徽章不再 503） | 幂等 |
| 4/6 | 启动 DSH Web（默认最新 `0.2.1-rc.2` / profile `web-v021`，`:3092`）并打开带 token 的链接 | 该端口已在服务则绝不打断现有会话 |
| 5/6 | 数字人状态：开关 / 容器 / 段进度 / `submits`、`segment_submits` 计数 | 只读 |
| 6/6 | 汇总自检表：每条链路 OK / FAIL | 只读 |

参数：`-NoDsh`（只起语音栈）、`-V013`（改用 dsh 0.1.3 / profile `web-v013` / `:3080`）、`-Rc8`（旧版 rc.8 / profile `web`）、`-Port <端口>`、`-Harness <路径>`、`-Profile <名字>`、`-NoBrowser`、`-WithQQ`（额外拉起 NapCat）、`-SkipDockerCheck`。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File bridge\start-full-stack.ps1 -NoBrowser
```

## 版本适配与维护节奏（2026-10-25）

| 组件 | 适配版本 |
|---|---|
| **DSH（主用）** | `dsh 0.2.1-rc.2` / profile `web-v021`（`:3092`） |
| **DSH（兼容）** | `dsh 0.1.3-alpha.1` / profile `web-v013`（`:3080`） |
| **DSH（旧版）** | `rc.8` / profile `web`（用插件 `v0.3.0`） |
| 插件 | `@beiyege-01/dsh-voice-ai-girlfriend` **v0.4.0**（独立包仓库同步；`node build.mjs` 构建） |
| 桥接 | `bridge/voice_bridge.py`（FastAPI/uvicorn `:8765`，Python 3.14 venv） |
| TTS 引擎 | OmniVoice（WSL2 + FlashInfer，`:9877`） |
| 数字人 | DUIX `guiji2025/duix.avatar-5090:trt10.9`（宿主 `:9000`，冷启动 1-3 分钟） |
| Docker | Docker Desktop 29.x（DUIX 容器随「数字人开关」`docker start/stop`） |

**v0.4.0（DSH 0.2.1 适配）**：2026-10-25 在 `dsh 0.2.1-rc.2`（profile `web-v021`，`:3092`）实测通过——插件加载、工具行/女友窗渲染、`useChat` 的 `assistant-step` 读取、回复触发 `/api/tts` 与 `/api/dh/speak`、**数字人端到端出片（1/1 段，女友窗视频实际播放）**、余额 pill 全部正常。0.2.x 的 Web 插件系统（`__ModuleLoader__` 闭包、`<style data-plugin-css>`、`conversation.input.dock` / `input.left` / `composer.dock` 槽位、`sessions.prompt`）与 0.1.3 保持同一套契约，业务代码无需改动；余额徽章从「依赖本地 harness 的 stats-extras 补丁」改为**真正的 composer stats pill**（官方 0.2.x 可直接显示，点击刷新）；`package.json` 增加 `engines.dsh` 兼容范围，供新版插件管理器检查。

本轮桥接侧新增（v0.3.0 配套）：`POST /api/dh/enable` **运行时开关**（关掉＝清队列、停预热、零 DUIX 流量，并可联动 `docker stop` 释放显存；打开＝`docker start` + 就绪后预热）、轮转日志 `logs/bridge.log`、`/api/dh/status` 附带 `duix` 容器状态与 `stats` 计数（`submits` / `segment_submits` / `status_polls`，用于核对「任务到底提交了没有」）。
````

</details>

**依据 2 · 作者声明**：[README.md:118-138](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/README.md#L118-L138)

硬件与资源需求是作者环境范围。

<details>
<summary>查看原文（21行）</summary>

```text
### 1. 检查你的电脑

| 检查项 | 要求 | 验证命令 |
|---|---|---|
| 系统 | Windows 10/11 64 位 | `winver` |
| 显卡 | NVIDIA 独立显卡（显存建议 16GB 或以上） | `nvidia-smi`（能显示显卡信息即可） |
| 磁盘 | 至少 30GB 剩余空间 | — |
| 内存 | 建议 16GB 以上 | — |

> `nvidia-smi` 不是 NVIDIA 显卡也能显示吗？不能——如果没有 NVIDIA 显卡或驱动没装好，会提示"不是内部或外部命令"或报错。**没有 NVIDIA 显卡就装不了本项目**（模型推理依赖 CUDA GPU）。

**显存占用**（运行时实测）：

| 模式 | 显存占用 |
|---|---|
| **推荐：OmniVoice TTS（WSL2 + FlashInfer）** | ~5.3GB（空闲）~ 11GB（推理峰值，CUDA graph 分桶缓存） |
| Qwen3-TTS 1.7B（fp16，备选降级） | ~3.7GB |
| FunASR Paraformer-large（fp16） | ~1GB |
| DUIX 数字人（视频生成时） | ~4-6GB |

> 全链路（TTS + 数字人同时工作）实测峰值约 **15GB**，16GB 显存基本吃满；OmniVoice 与 DUIX 建议错峰（TTS 合成完再生成视频）。16GB 显存为推荐配置，8GB 会非常紧张不推荐。
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/client/bridge.ts:7-15](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/dsh-plugin/src/client/bridge.ts#L7-L15)

地址覆盖会改变语音数据去向。

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

**依据 4 · 源码核查**：[bridge/voice_bridge.py:1732-1763](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/bridge/voice_bridge.py#L1732-L1763)

QQ是实际外发依赖。

<details>
<summary>查看原文（32行）</summary>

```text
@app.post("/api/qq/send")
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
            async with models.infer_lock:
                if PERSONAS.get(_current_persona, {}).get("engine", "qwen3") == "qwen3":
                    handler = await models.ensure_tts()
                else:
                    handler = None  # OmniVoice 引擎不需要 Qwen3 handler
                samples = await asyncio.to_thread(_synthesize, handler, text, cancel)
            result = send_voice(base, token, user_id, samples.astype("<i2").tobytes())
        else:
            result = send_text(base, token, user_id, req.text.strip()[:2000])
        return {"ok": True, "user_id": user_id, "napcat": result}
```

</details>

#### 缺口

- 具体硬件资源、恢复时间、视频存储与端到端延迟未知
  **影响**：不能兑现0.5秒和低成本承诺
  **进一步探讨**：分纯语音/数字人/QQ分别计量资源与数据流，先固定小任务完整性而非全栈一次验收

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 将排队、合成与播放完成分开能否减少漏读？

**研究主题**：新假设与验证

#### 完整回答

从spoken先于HTTP成功推进与512截断，可推导未验证的句段状态账本：先把长句按限制拆为稳定段ID，再分别记排队、合成成功和实际播放结束；失败只提示可核对重试，不自动重放整轮，打断需准确丢弃旧段。它应与现有anchor去重和数字人code兼容，不替换已有历史重播保护。对固定长回复注入一次合成失败并中途打断，对比遗漏字数、重复播放和恢复操作；若增加状态却不能减少遗漏或打断后仍重播，则否定。此方案尚未实现，不能计作已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/client/voice/reply-listener.tsx:309-339](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/dsh-plugin/src/client/voice/reply-listener.tsx#L309-L339)

现有spoken前置与失败不回退的推导依据。

<details>
<summary>查看原文（31行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[bridge/voice_bridge.py:319-324](https://github.com/beiyege-01/dsh-voice-ai-girlfriend/blob/f1a62862104c8e54c85a02d83d2e466e75666e72/bridge/voice_bridge.py#L319-L324)

后端长度限制要求前端分段对齐。

```text
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Empty text")
    if len(text) > 512:
        logger.warning("TTS text truncated from %d to 512 chars", len(text))
        text = text[:512]
```

#### 缺口

- speaker是否已有足够结束/错误回调以及现有段ID契约未知
  **影响**：不能直接认定方案可无缝实现
  **进一步探讨**：先核对播放完成回调与现有anchor/数字人code，再构造可观察的段级对照

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
