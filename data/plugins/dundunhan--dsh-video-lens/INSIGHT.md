# DSH Video Lens

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[9ef313c](https://github.com/dundunhan/dsh-video-lens/tree/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9)

<!-- BEGIN META -->
[![GitHub ★ 112](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=112&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dundunhan/dsh-video-lens) [![npm 30d 2,425](https://img.shields.io/static/v1?label=npm+30d&message=2%2C425&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-video-lens) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-video-lens)
<!-- END META -->

> **功能**：将本地视频抽样、可选转写和视觉问答接入 DSH

> **亮点**：[Q01](#research-q01) 通过时间窗口和语音线索减少候选片段。

> **主要限制**：[Q03](#research-q03) 帧抽样会漏事件，外部端点可收到媒体内容。

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
  - [Q01 · 可验收的任务是什么？](#detail-section-11)
  - [Q02 · 如何缩小样本？](#detail-section-12)
  - [Q03 · 哪些数据离开宿主？](#detail-section-13)
  - [Q04 · 部署与退出成本是什么？](#detail-section-14)
  - [Q05 · 什么情况否定采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户要快速定位录屏中的某个事件。

手工拖动进度条并听录音。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 手工拖动进度条并听录音。 | 可直接比较 | 保留人工步骤 |
| DSH Video Lens | 通过时间窗口和语音线索减少候选片段。 | 帧抽样会漏事件，外部端点可收到媒体内容。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 探测、抽帧与可选 ASR 后发送至配置模型并返回时标。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户要快速定位录屏中的某个事件。 | 保留原流程 |
| 试验 | 探测、抽帧与可选 ASR 后发送至配置模型并返回时标。 | 观察固定版本 |
| 复核 | 只用虚构短片验收抽样、时间和传输。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 按时间定位视频中的事实并给出证据 | 明确时间的问答或可节约回看时间。 | 只用虚构短片验收抽样、时间和传输。 |

> **思考**：[Q03](#research-q03) 帧抽样会漏事件，外部端点可收到媒体内容。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 通过时间窗口和语音线索减少候选片段。

可选转写失败被记录，显式时间有越界检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 帧抽样会漏事件，外部端点可收到媒体内容。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只用虚构短片验收抽样、时间和传输。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的按时间定位视频中的事实并给出证据。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.js、src/vlm.js、src/asr.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的按时间定位视频中的事实并给出证据。未执行目标代码或实际宿主验证。
- 下一步：保存视频标注、响应和错误日志。

**分析版本**

- **仓库**：[dundunhan/dsh-video-lens](https://github.com/dundunhan/dsh-video-lens)
- **版本号**：0.3.2（[固定提交 9ef313c](https://github.com/dundunhan/dsh-video-lens/tree/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9)）
- **版本日期**：2026-09-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 明确时间的问答或可节约回看时间。

保存视频标注、响应和错误日志。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 224 | — | — | 1668 |
| .js | source | 6 | 1234 | 990 | 143 | — |
| .mjs | test | 5 | 734 | 553 | 117 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/dundunhan/dsh-video-lens/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/dundunhan/dsh-video-lens/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/dundunhan/dsh-video-lens/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：按时间定位视频中的事实并给出证据

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 可验收的任务是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要从录屏定位某一操作的用户可以先探测元数据，再用显式时间或语音关键词问答。与手工拖进度条相比，交付应包含正确事件、可跳转时间与所依据画面或语音。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-13](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/README.md#L5-L13)

作者列出元数据、分析及时间问答

```text
A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) plugin that lets text-only LLM agents understand local video files. It provides two tools:

| Tool | What it does |
|---|---|
| `video_probe` | Cheap, instant metadata via `ffprobe`: container, duration, resolution, fps, codecs, audio tracks, subtitles. |
| `video_analyze` | Content understanding: **scene-change-aware frame sampling** (`ffmpeg scdet`), **optional ASR transcript** (speech with timestamps), fused with any OpenAI-compatible vision model into structured evidence JSON. |
| `video_ask` | **Time-anchored Q&A**: parses explicit time references ("at 3:20", "第2分钟") or locates relevant speech via transcript keyword matching, re-samples frames from the matched windows, and answers with grounded evidence (answer + confidence + supporting timestamps). |

> v0.3.2. The plugin never locks you into a provider: vision and ASR are both OpenAI-compatible endpoints configured via `baseUrl` + `model` + key env var.
```

**依据 2 · 源码核查**：[src/index.js:346-367](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/src/index.js#L346-L367)

解析时间范围或根据转写找窗口

<details>
<summary>查看原文（22行）</summary>

```text
        const explicit = parseTimeQuery(question)
        let matchedSegments = []
        let windows = []
        if (explicit) {
          // Clamp explicit windows to the video duration; refuse windows that
          // fall entirely outside it with a clear, actionable error.
          const start = Math.max(0, Math.min(explicit.start, duration))
          const end = Math.max(0, Math.min(explicit.end, duration))
          if (end <= start || start >= duration) {
            return (
              `ERROR: requested time window [${explicit.start}s-${explicit.end}s] falls entirely ` +
              `outside the video duration (${Math.round(duration)}s).`
            )
          }
          windows = [{ start, end }]
        } else if (transcript && transcript.text) {
          const normSegments = transcript.segments.map((s) =>
            s.end == null ? { ...s, end: duration } : s,
          )
          const terms = extractQueryTerms(question)
          matchedSegments = matchSegments(normSegments, terms).slice(0, 5)
          windows = buildWindows(matchedSegments, config.askPaddingSec, duration)
```

</details>

#### 缺口

- 置信词不等于模型已校准。
  **影响**：可以减少人工翻找。
  **进一步探讨**：用带已知时间标记的视频测试。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何缩小样本？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

先做场景检测并按计划抽帧，空帧时报错。语音转写可选且失败单独记录。明确时间窗口会被裁到片长范围，语音匹配则从最多五个片段建窗口。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:179-211](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/src/index.js#L179-L211)

抽帧与可选转写

<details>
<summary>查看原文（33行）</summary>

```text
          threshold: config.sceneThreshold,
          signal: exec?.signal,
        })
        const timestamps = planShotTimestamps(duration, shots, frameCount)
        const frames = await extractFrames({
          videoPath: path,
          timestamps,
          maxWidth: frameWidth,
          quality: config.frameQuality,
          signal: exec?.signal,
        })

        if (frames.length === 0) {
          return 'ERROR: ffmpeg extracted no frames - the file may be audio-only or corrupted.'
        }

        // Optional ASR: missing key or provider failure degrades gracefully —
        // the visual path always completes, and the error is surfaced in the
        // evidence so operators can tell "no key" from "provider error".
        let transcript = null
        let transcriptError = null
        if (metadata.hasAudio) {
          try {
            transcript = await transcribe(path, {
              asrBaseUrl: config.asrBaseUrl,
              asrModel: config.asrModel,
              asrApiKeyEnv: config.asrApiKeyEnv,
              timeoutMs: config.asrTimeoutMs,
              signal: exec?.signal,
            })
          } catch (err) {
            transcriptError = err.message
          }
```

</details>

**依据 2 · 源码核查**：[src/index.js:343-367](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/src/index.js#L343-L367)

显式时间和关键词路径

<details>
<summary>查看原文（25行）</summary>

```text
        // transcript keyword matching; otherwise fall back to the whole film.
        // Untimed segments (text-only ASR) are normalized to the full
        // duration so matching still works.
        const explicit = parseTimeQuery(question)
        let matchedSegments = []
        let windows = []
        if (explicit) {
          // Clamp explicit windows to the video duration; refuse windows that
          // fall entirely outside it with a clear, actionable error.
          const start = Math.max(0, Math.min(explicit.start, duration))
          const end = Math.max(0, Math.min(explicit.end, duration))
          if (end <= start || start >= duration) {
            return (
              `ERROR: requested time window [${explicit.start}s-${explicit.end}s] falls entirely ` +
              `outside the video duration (${Math.round(duration)}s).`
            )
          }
          windows = [{ start, end }]
        } else if (transcript && transcript.text) {
          const normSegments = transcript.segments.map((s) =>
            s.end == null ? { ...s, end: duration } : s,
          )
          const terms = extractQueryTerms(question)
          matchedSegments = matchSegments(normSegments, terms).slice(0, 5)
          windows = buildWindows(matchedSegments, config.askPaddingSec, duration)
```

</details>

#### 缺口

- 视频未见画面可能被抽样漏过。
  **影响**：控制推理输入和成本。
  **进一步探讨**：让短事件分别出现在切镜和长镜头中。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些数据离开宿主？

**研究主题**：缺陷与关键质疑

#### 完整回答

视频帧作为 JPEG data URL 发送给配置的视觉接口；若设置 ASR 密钥，提取出的 WAV 作为文件发送给转写服务。带文本转写的视觉 prompt 还可能把语音内容交给视觉服务。

#### 证据与依据

**依据 1 · 源码核查**：[src/vlm.js:38-63](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/src/vlm.js#L38-L63)

向视觉模型 POST 图像和文本

<details>
<summary>查看原文（26行）</summary>

```text
  const content = [{ type: 'text', text: prompt }]
  for (const frame of frames) {
    content.push({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${frame.base64}` },
    })
  }

  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  const signalAll = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal

  const res = await fetch(joinUrl(baseUrl, '/chat/completions'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content }],
      max_tokens: maxTokens,
      temperature: 0,
    }),
    signal: signalAll,
```

</details>

**依据 2 · 源码核查**：[src/asr.js:36-55](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/src/asr.js#L36-L55)

有 key 时上传 WAV

<details>
<summary>查看原文（20行）</summary>

```text
  const apiKey = process.env[asrApiKeyEnv]
  if (!apiKey) return null

  const { wavPath, dir } = await extractAudio({ videoPath, signal })
  try {
    const blob = new Blob([await readFile(wavPath)], { type: 'audio/wav' })
    const form = new FormData()
    form.append('file', blob, 'audio.wav')
    form.append('model', asrModel)
    form.append('response_format', 'verbose_json')

    const timeoutSignal = AbortSignal.timeout(timeoutMs)
    const signalAll = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal

    const res = await fetch(joinUrl(asrBaseUrl, '/audio/transcriptions'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      signal: signalAll,
    })
```

</details>

**依据 3 · 源码核查**：[src/index.js:198-221](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/src/index.js#L198-L221)

转写用于视觉分析 prompt

<details>
<summary>查看原文（24行）</summary>

```text
        let transcript = null
        let transcriptError = null
        if (metadata.hasAudio) {
          try {
            transcript = await transcribe(path, {
              asrBaseUrl: config.asrBaseUrl,
              asrModel: config.asrModel,
              asrApiKeyEnv: config.asrApiKeyEnv,
              timeoutMs: config.asrTimeoutMs,
              signal: exec?.signal,
            })
          } catch (err) {
            transcriptError = err.message
          }
        }

        let prompt = buildAnalysisPrompt({ metadata, frames, transcript })
        if (question) {
          prompt += `\n\nPay special attention to: ${question}`
        }

        const raw = await chatWithVision({
          baseUrl: config.visionBaseUrl,
          apiKey,
```

</details>

#### 缺口

- 本地视频路径不意味着全流程本地。
  **影响**：画面、音轨和文字的授权边界要分别验证。
  **进一步探讨**：以本地模拟端点记录请求形状。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署与退出成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

安装需 Node 与 ffmpeg/ffprobe，分析需视觉 API 配置，ASR 可选。记录抽帧、转写、视觉调用和临时文件的时间与空间。停用后移除 bundle、撤销或清理测试密钥并检查临时目录。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-38](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/README.md#L25-L38)

作者给出依赖和分发方式

<details>
<summary>查看原文（14行）</summary>

````text
- Scene changes are detected with ffmpeg's `scdet` filter (ffmpeg ≥ 6.0). Videos without detectable cuts fall back to uniform midpoint sampling.
- ASR is **strictly additive**: if `asrApiKeyEnv` is unset or the provider fails, the visual analysis still completes and `transcript` is `null`.
- All media work is delegated to `ffmpeg`/`ffprobe` on `PATH` — no native decoding in the agent.

## Install

Prerequisites: Node.js ≥ 20, `ffmpeg` ≥ 6.0 (recommended) with `ffprobe` on PATH (`brew install ffmpeg` / `apt install ffmpeg`).

### Option A — npm (recommended)

```bash
# in your DSH profile directory (the one containing package.json)
pnpm add dsh-video-lens
```
````

</details>

**依据 2 · 源码核查**：[src/index.js:143-159](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/src/index.js#L143-L159)

文件与视觉密钥检查

<details>
<summary>查看原文（17行）</summary>

```text
      try {
        assertSafePath(path)
      } catch (err) {
        return toolErrorMessage(err)
      }

      if (!(await assertReadable(path))) {
        return `ERROR: file not found or not readable: ${path}`
      }

      const apiKey = process.env[config.visionApiKeyEnv]
      if (!apiKey) {
        return (
          `ERROR: vision API key not set. Export ${config.visionApiKeyEnv} with a key for ` +
          `${config.visionBaseUrl} (model: ${config.visionModel}), or point the plugin's ` +
          'visionBaseUrl/visionModel config at any OpenAI-compatible vision endpoint.'
        )
```

</details>

**依据 3 · 源码核查**：[src/asr.js:36-55](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/src/asr.js#L36-L55)

转写可省略

<details>
<summary>查看原文（20行）</summary>

```text
  const apiKey = process.env[asrApiKeyEnv]
  if (!apiKey) return null

  const { wavPath, dir } = await extractAudio({ videoPath, signal })
  try {
    const blob = new Blob([await readFile(wavPath)], { type: 'audio/wav' })
    const form = new FormData()
    form.append('file', blob, 'audio.wav')
    form.append('model', asrModel)
    form.append('response_format', 'verbose_json')

    const timeoutSignal = AbortSignal.timeout(timeoutMs)
    const signalAll = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal

    const res = await fetch(joinUrl(asrBaseUrl, '/audio/transcriptions'), {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      signal: signalAll,
    })
```

</details>

#### 缺口

- 服务限额与长视频资源成本未知。
  **影响**：先用短片验证，再看并发。
  **进一步探讨**：分别记录只有探测、视觉分析、启用 ASR。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么情况否定采用？

**研究主题**：新假设与验证

#### 完整回答

对照手工回看、仅视觉、视觉与语音三组，记录时间误差、正确率、耗时和发送字节。构造持续一秒的动作、嘈杂语音、越界查询和 API 故障。关键事件反复漏检、证据与时间不匹配或失败时无可见解释，则缩小到探测或明确时间任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:191-211](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/src/index.js#L191-L211)

空帧和转写异常可验

<details>
<summary>查看原文（21行）</summary>

```text
        if (frames.length === 0) {
          return 'ERROR: ffmpeg extracted no frames - the file may be audio-only or corrupted.'
        }

        // Optional ASR: missing key or provider failure degrades gracefully —
        // the visual path always completes, and the error is surfaced in the
        // evidence so operators can tell "no key" from "provider error".
        let transcript = null
        let transcriptError = null
        if (metadata.hasAudio) {
          try {
            transcript = await transcribe(path, {
              asrBaseUrl: config.asrBaseUrl,
              asrModel: config.asrModel,
              asrApiKeyEnv: config.asrApiKeyEnv,
              timeoutMs: config.asrTimeoutMs,
              signal: exec?.signal,
            })
          } catch (err) {
            transcriptError = err.message
          }
```

</details>

**依据 2 · 源码核查**：[src/index.js:346-367](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/src/index.js#L346-L367)

时间越界与语音匹配可验

<details>
<summary>查看原文（22行）</summary>

```text
        const explicit = parseTimeQuery(question)
        let matchedSegments = []
        let windows = []
        if (explicit) {
          // Clamp explicit windows to the video duration; refuse windows that
          // fall entirely outside it with a clear, actionable error.
          const start = Math.max(0, Math.min(explicit.start, duration))
          const end = Math.max(0, Math.min(explicit.end, duration))
          if (end <= start || start >= duration) {
            return (
              `ERROR: requested time window [${explicit.start}s-${explicit.end}s] falls entirely ` +
              `outside the video duration (${Math.round(duration)}s).`
            )
          }
          windows = [{ start, end }]
        } else if (transcript && transcript.text) {
          const normSegments = transcript.segments.map((s) =>
            s.end == null ? { ...s, end: duration } : s,
          )
          const terms = extractQueryTerms(question)
          matchedSegments = matchSegments(normSegments, terms).slice(0, 5)
          windows = buildWindows(matchedSegments, config.askPaddingSec, duration)
```

</details>

**依据 3 · 源码核查**：[src/vlm.js:38-63](https://github.com/dundunhan/dsh-video-lens/blob/9ef313c3a0a7e9786f9464cfc23b675ac1dfb8f9/src/vlm.js#L38-L63)

可计量视觉载荷

<details>
<summary>查看原文（26行）</summary>

```text
  const content = [{ type: 'text', text: prompt }]
  for (const frame of frames) {
    content.push({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${frame.base64}` },
    })
  }

  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  const signalAll = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal

  const res = await fetch(joinUrl(baseUrl, '/chat/completions'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content }],
      max_tokens: maxTokens,
      temperature: 0,
    }),
    signal: signalAll,
```

</details>

#### 缺口

- 暂无本次运行和准确率数据。
  **影响**：将节省回看与正确性分别量化。
  **进一步探讨**：保存视频标注、响应和错误日志。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
