# dsh-mimotts

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[6fdad4e](https://github.com/1497105876/dsh-mimotts/tree/6fdad4e64da2206747c0ec57bdcf77e85e4cff87)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：为 DSH 助手回复合成语音，提供内联播放器、语音历史和工作区 WAV 工具。

> **亮点**：[Q01](#research-q01) 将回复朗读、播放与版本回听连接到 DSH 会话。

> **主要限制**：[Q02](#research-q02) 请求会传文本和配置的声音样本，历史索引并发写入与失败仍需核对。

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
  - [Q01 · DSH 用户如何从回复得到可回听的音频？](#detail-section-11)
  - [Q02 · 宿主侧密钥、文本和声音样本如何流动？](#detail-section-12)
  - [Q03 · 怎样试用，并降低合成成功但历史丢失的代价？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要听取助手回复或为后续渠道制作语音文件。

复制回复到外部 TTS，单独保存、播放与发送。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 回复朗读 | 播放助手消息并回听历史 | 需可达 TTS 和可披露文本 |
| WAV 工具 | 生成工作区语音文件 | 实际发送由其他渠道完成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Host、客户端与凭据服务 | 必需 | 挂载工具与播放 | 组合不全时入口缺失 |
| 可达 TTS 端点及测试凭据 | 必需 | 生成 WAV | 无密钥或响应异常会失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户配置测试凭据与披露范围 | 端点、文本和样本经核对 |
| 试听 | 用户朗读短消息并回听历史 | 确认 WAV、文本及实际播放 |
| 退出 | 用户停用并回文字 | 检查历史与工作区副本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务费用未知 | 配置凭据及测试文本 | 样本路径可选 |
| 持续 | 每次请求与磁盘成本未知 | 复核截断和历史 | 重新合成会再请求 |
| 失败 | 恢复耗时未知 | 区分上游失败与存储失败 | 避免盲目重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 消息朗读 | 客户端可发起并回听 WAV | 真实声音和节时 |
| 工作区语音 | Host 工具生成文件 | 渠道发送需另验收 |

> **思考**：[Q02](#research-q02) 请求会传文本和配置的声音样本，历史索引并发写入与失败仍需核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将回复朗读、播放与版本回听连接到 DSH 会话。

[Q02](#research-q02) WAV 和 JSON 索引分开写入，并发及中断可能影响版本列表。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 请求会传文本和配置的声音样本，历史索引并发写入与失败仍需核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用可披露文本，核对音频、索引和失败再扩大使用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态确认 Host 与客户端接线，真实播放、音质及并发历史未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/index.ts、src/index.ts、src/tool.ts、src/tts.ts、src/recordings.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Host 与客户端源码。未运行上游、DSH、模型或目标测试。
- 下一步：对照文本截断、无密钥、缺失音频、并发写入、失败及回听。

**分析版本**

- **仓库**：[1497105876/dsh-mimotts](https://github.com/1497105876/dsh-mimotts)
- **版本号**：2.1.201（[固定提交 6fdad4e](https://github.com/1497105876/dsh-mimotts/tree/6fdad4e64da2206747c0ec57bdcf77e85e4cff87)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 让历史更新可串行提交，并区分上游成功和保存失败。

对照文本截断、无密钥、缺失音频、并发写入、失败及回听。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 25 | 4082 | 3088 | 1033 | — |
| .md | source | 1 | 151 | — | — | 2630 |
| .mjs | source | 3 | 276 | 190 | 61 | — |
| .ts | source | 18 | 2615 | 1740 | 706 | — |
| .tsx | source | 6 | 722 | 564 | 121 | — |
| .mjs | test | 6 | 413 | 363 | 19 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1497105876/dsh-mimotts/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/1497105876/dsh-mimotts/issues?q=is%3Aissue+created%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1497105876/dsh-mimotts/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户能否从 DSH 得到可回听的语音，并理解上游数据与本地历史边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 用户如何从回复得到可回听的音频？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户可在助手消息旁请求合成并在会话播放，历史页保留录音版本。支持 tools 服务时还可把文本合成为工作区 WAV；这一路返回路径，发送给聊天渠道仍需其他工具。相比复制到外部 TTS，插件将发起、配置及回听留在当前会话。合格结果要听到预期内容，并核对长文本截取，不能用文件存在代表语音可用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-39](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/README.md#L19-L39)

作者描述读屏和工具交付。

<details>
<summary>查看原文（21行）</summary>

```text
1. **「插件」页 → @gw/dsh-mimotts 详情页的配置卡片**（官方 `plugins.bundle.config` 席位，key = 包名）
   - API Key（只写输入框：粘贴即经官方 `credentials/set` 通道存入宿主凭据存储，页面不回显；显示"已配置/未配置"，清空保存不改动已存密钥）
   - 接口地址（默认 `https://api.xiaomimimo.com/v1`）、模型（默认 `mimo-v2.5-tts`）
   - 预置音色（**官方 9 音色下拉**：mimo_default、冰糖、茉莉、苏打、白桦、Mia、Chloe、Milo、Dean）/ 音色克隆样本（宿主本地 WAV 路径，24kHz/16bit/单声道，5–15s）
   - 默认风格（如"开心""语速慢""东北话"；留空由模型自行判断，推荐）、单次最大字符数、请求超时
   - **试听**：用卡片当前（含未保存修改）的风格/音色合成一句示例，内联播放
   - 标准表单行为：脏值预览、"已覆盖/恢复默认"徽标、保存/放弃、只读部署提示
2. **每条已定稿助手回复底部的音量按钮**（位于该消息动作行，复制/分支之间）
   - 点击 → 宿主合成（Markdown 归一化：不朗读代码块/URL/标记符号）→ 自动播放
   - 播放器浮层：**播放/暂停 + 可拖动进度条（pointer 拖拽、单击定位、键盘 ←→/Home/End）** + 时间读数
   - 同时只有一条在播；播放中动作行不再悬停淡出
   - 失败就地提示（未配置/超时/上游拒绝/无文本等稳定错误码 → 本地化文案）
3. **设置 → 语音历史**
   - 每次朗读自动保存；按文本分组、多版本并列
   - 逐版本回放、「重新合成」（用当前配置重读并保留旧版本对比）、「删除」
4. **Agent 工具 `mimo-tts-gw-say`**（`tools` 服务在的组合里注册）
   - 参数：`text`（必填）、`voice`、`style`（可选覆盖）
   - 行为：合成 → 写 `<会话工作区>/tts/speech-<时间戳>-<8位随机>.wav` → 返回绝对路径 + 字节数 + 时长；同一份音频再追加进「语音历史」
   - **只产出文件，不发消息**：要真的发出去，把返回的 path 交给聊天渠道的发语音工具（QQ 通道是 `qq_chat_gw_send_voice`）
   - 为什么写进工作区：渠道侧的发送工具通常只接受工作区内的路径，写到录音目录会被拒
   - 工具描述里写清了「用户要求语音回复、或内容适合朗读时才用」，平时的回复还是文字
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:74-100](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/client/index.ts#L74-L100)

真实配置、历史与消息动作注册。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.effect(
    () => ctx.configForms.whileServed([MIMOTTS_NAMESPACE], () => {
      // Keyed by the package name: the Plugins page dispatches
      // `plugins.bundle.config` with `entryKey: pkg.name`.
      const offCard = ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
        name: 'plugins.bundle.config',
        key: MIMOTTS_PACKAGE_KEY,
        locale: NS,
        inject: () => controller.inject(),
      }, BundleConfigCard))
      const offPage = ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'mimotts',
        order: 20,
        label: () => t('nav'),
        locale: NS,
      }, RecordingsPage))
      return () => { offPage(); offCard() }
    }),
    'dsh-mimotts: plugins-page card and history page',
  )

  ctx.slots.inject('conversation.chat.assistant-actions', () => ctx.slots.register({
    name: 'conversation.chat.assistant-actions',
    id: 'mimotts',
    order: 20,
    locale: NS,
```

</details>

**依据 3 · 源码核查**：[src/index.ts:120-145](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/index.ts#L120-L145)

工具注入及历史写入。

<details>
<summary>查看原文（26行）</summary>

```text
  // Agent tool: text → WAV in the session workspace. Only compositions that
  // expose a `tools` service (chat / agent sessions) get it; the browser half
  // and pure web compositions simply never enter this callback.
  ctx.inject(['tools'], (child) => {
    child.effect(() => {
      const tools = (child as unknown as { tools?: { register?(tool: unknown): unknown } }).tools
      // 没有 tools 服务（纯 Web 组合）时什么都不注册，但 effect 仍要返回一个清理函数
      if (typeof tools?.register !== 'function') return () => {}
      const dispose = tools.register(createSayTool({
        synthesize: async (request) => {
          const engine = await resolveEngineSnapshot(ctx, config)
          const wav = await synthesizeSpeech(engine, request)
          const style = (request.style ?? '').trim() || engine.style
          const voice = (request.voice ?? '').trim() || engine.voice
          return { wav, model: engine.model, style, voice }
        },
        // 同一份音频再进一次录音历史，设置页里可以回放对比
        persist: async (request, outcome) => {
          await addVersion(
            request.text,
            outcome.style === '' ? undefined : outcome.style,
            outcome.voice === '' ? undefined : outcome.voice,
            outcome.model,
            outcome.wav,
          )
        },
```

</details>

**依据 4 · 源码核查**：[src/tool.ts:137-164](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/tool.ts#L137-L164)

工作区 WAV 的落盘路径。

<details>
<summary>查看原文（28行）</summary>

```text
    async execute(args: unknown, exec: unknown): Promise<{ path: string; bytes: number; durationMs: number }> {
      const shape = (exec ?? {}) as ToolExec
      const cwd = shape.agent?.session?.header?.cwd
      if (typeof cwd !== 'string' || cwd === '') {
        throw new Error('拿不到当前会话的工作区，语音文件没地方写。')
      }
      const input = (args ?? {}) as Record<string, unknown>
      const text = typeof input.text === 'string' ? input.text.trim() : ''
      if (text === '') throw new Error('缺少要念的文本（text）。')
      const voice = typeof input.voice === 'string' && input.voice.trim() !== '' ? input.voice.trim() : undefined
      const style = typeof input.style === 'string' && input.style.trim() !== '' ? input.style.trim() : undefined
      shape.signal?.throwIfAborted?.()

      const request: SayRequest = { text, ...(voice === undefined ? {} : { voice }), ...(style === undefined ? {} : { style }) }
      const outcome = await deps.synthesize(request)
      shape.signal?.throwIfAborted?.()

      const dir = join(cwd, SPEECH_DIR)
      await mkdir(dir, { recursive: true })
      const path = join(dir, speechFileName())
      await writeFile(path, outcome.wav)
      deps.log?.(`[mimotts] 合成语音 ${path}（${outcome.wav.length} 字节）`)

      if (deps.persist !== undefined) {
        try {
          await deps.persist(request, outcome)
        } catch (error) {
          deps.log?.(`[mimotts] 语音归档失败（不影响发送）：${error instanceof Error ? error.message : String(error)}`)
```

</details>

#### 缺口

- 未在目标宿主比较播放和外部 TTS
  **影响**：不能确定读音、可访问性和操作节时
  **进一步探讨**：用短回复和含代码的长回复比较实际播放

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主侧密钥、文本和声音样本如何流动？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

浏览器通过宿主凭据接口保存密钥引用，Host 解析后向配置的 baseUrl 发请求，密钥放 api-key 头。文本经可朗读归一化与字符截断；如配置 voiceSamplePath，Host 读该文件并把 Base64 字节作为语音样本一同发送。浏览器不需获得密钥不等于文本或样本留在本地。请求设 timeout，成功 JSON 仍需音频块，返回分支对非空 Base64 字节检查不等于有效 WAV。历史索引保留原文本，先写 WAV 再直接覆盖 JSON，两个并发 add 可能基于同一旧索引，损坏读索引回空。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:62-69](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/client/index.ts#L62-L69)

凭据写入路径。

```text
  // The typed API key stores through the platform's credentials remote — the
  // same host operation the official add-model credential editor writes
  // through — so the literal key never lands in a configuration file.
  const controller = new TtsSettingsController(
    ctx.configForms.get<TtsSettings>(MIMOTTS_NAMESPACE),
    async (ref, value) => (await ctx.remote.credentials.set(ref, value)).ok,
  )
  ctx.effect(() => () => { controller.dispose() }, 'dsh-mimotts: settings form')
```

**依据 2 · 源码核查**：[src/index.ts:81-104](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/index.ts#L81-L104)

Host 解析及配置。

<details>
<summary>查看原文（24行）</summary>

```text
async function resolveEngineSnapshot(ctx: Context, config: Config): Promise<ReturnType<typeof resolveEngineConfig>> {
  const credentials = (ctx as unknown as { get?(name: string): unknown }).get?.('credentials') as
    | CredentialsService
    | undefined
  const ref = (config.apiKeyEnv.get() ?? '').trim()
  let apiKey = ''
  if (credentials !== undefined && ref !== '') {
    try {
      const resolved = await credentials.resolve(credentialRef(ref))
      apiKey = (resolved?.value ?? '').trim()
    } catch {
      apiKey = ''
    }
  }
  return resolveEngineConfig({
    apiKey,
    baseUrl: config.baseUrl.get(),
    model: config.model.get(),
    voice: config.voice.get(),
    voiceSamplePath: config.voiceSamplePath.get(),
    style: config.style.get(),
    maxChars: config.maxChars.get(),
    timeoutMs: config.timeoutMs.get(),
  })
```

</details>

**依据 3 · 源码核查**：[src/tts.ts:126-179](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/tts.ts#L126-L179)

文本、样本与请求。

<details>
<summary>查看原文（54行）</summary>

```text
export async function synthesizeSpeech(
  config: TtsEngineConfig,
  request: TtsSynthesis,
  deps: TtsEngineDeps = nodeDeps,
): Promise<Uint8Array> {
  if (config.apiKey === '') {
    throw new TtsError('not-configured', 'No MiMo API key is configured; add the credential in the credentials store and reference it in Settings → 语音合成.')
  }
  const speakable = clampText(toSpeakableText(request.text ?? ''), config.maxChars)
  if (speakable === '') {
    throw new TtsError('bad-request', 'The message carries no speakable text.')
  }
  const style = (request.style ?? '').trim() || config.style
  const content = style === '' ? speakable : `<style>${style}</style>${speakable}`
  const voice = (request.voice ?? '').trim() || config.voice

  let audio: Record<string, unknown>
  if (config.voiceSamplePath !== '') {
    let sample: Uint8Array
    try {
      sample = await deps.readVoiceSample(config.voiceSamplePath)
    } catch (cause) {
      throw new TtsError(
        'voice-sample-unreadable',
        `The voice-clone sample at ${config.voiceSamplePath} could not be read.`,
        cause,
      )
    }
    audio = {
      format: 'wav',
      voice_audio: { format: 'wav', data: Buffer.from(sample).toString('base64') },
    }
  } else {
    audio = { format: 'wav', voice }
  }

  const payload = {
    model: config.model,
    audio,
    messages: [{ role: 'assistant', content }],
  }
  const endpoint = `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`
  let response: Response
  try {
    response = await deps.fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'api-key': config.apiKey,
        'user-agent': 'dsh-mimotts/0.1.0',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(config.timeoutMs),
    })
```

</details>

**依据 4 · 源码核查**：[src/tts.ts:229-236](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/tts.ts#L229-L236)

音频块检查。

```text
  const encoded = root.choices?.[0]?.message?.audio?.data
  if (typeof encoded !== 'string' || encoded === '') {
    throw new TtsError('invalid-audio', 'MiMo TTS returned no audio block in choices[0].message.audio.data.')
  }
  const data = new Uint8Array(Buffer.from(encoded, 'base64'))
  if (data.length === 0) throw new TtsError('invalid-audio', 'MiMo TTS returned an empty audio block.')
  return data
}
```

**依据 5 · 源码核查**：[src/recordings.ts:65-79](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/recordings.ts#L65-L79)

索引失败及写法。

<details>
<summary>查看原文（15行）</summary>

```text
async function readIndex(): Promise<TtsRecordingsIndex> {
  try {
    const raw = await readFile(indexFile(), 'utf8')
    const parsed = JSON.parse(raw) as Partial<TtsRecordingsIndex>
    return Array.isArray(parsed.entries) ? parsed as TtsRecordingsIndex : EMPTY_INDEX
  } catch {
    return EMPTY_INDEX
  }
}

/** Persist the index, creating the directory first. */
async function writeIndex(index: TtsRecordingsIndex): Promise<void> {
  await ensureDir()
  await writeFile(indexFile(), JSON.stringify(index), 'utf8')
}
```

</details>

**依据 6 · 源码核查**：[src/recordings.ts:111-135](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/recordings.ts#L111-L135)

音频先写、索引后写。

<details>
<summary>查看原文（25行）</summary>

```text
export async function addVersion(
  text: string,
  style: string | undefined,
  voice: string | undefined,
  model: string,
  wav: Uint8Array,
): Promise<AddedVersion> {
  await ensureDir()
  const index = await readIndex()
  const version: TtsRecordingVersion = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    style: style ?? null,
    voice: voice ?? null,
    model,
  }
  let recording = index.entries.find(entry => entry.text === text)
  if (recording === undefined) {
    recording = { id: randomUUID(), text, createdAt: version.createdAt, versions: [] }
    index.entries.unshift(recording)
  }
  recording.versions.unshift(version)
  await writeFile(versionFilePath(recording.id, version.id), Buffer.from(wav))
  await writeIndex(index)
  return { recording, version }
```

</details>

#### 缺口

- 未验证服务端协议、实际音质和并发历史
  **影响**：无法确认音频及记录可靠性
  **进一步探讨**：以合成样本覆盖上游错误、空 WAV、并发版本和丢失索引

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用，并降低合成成功但历史丢失的代价？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

在兼容 DSH profile 使用测试凭据和可披露文本，确认端点归属、工具和网页路径。网页历史写入后才返回 WAV，存储失败可能让用户以为合成从未发生，重试可能再发上游请求。停用后回文字阅读，先检查已有 WAV 与历史文本的留存位置。可对照序列化历史更新与原子索引提交，并分开标记上游已生成和历史写入失败，测并发、磁盘中断及错误重试。若未降低丢记录和重复合成则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:254-303](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/index.ts#L254-L303)

网页合成、保存与错误。

<details>
<summary>查看原文（50行）</summary>

```text
    child.effect(() => child.webServer.register({
      kind: 'exact',
      path: MIMOTTS_RECORDINGS_PATH,
      handler: (req, res) => {
        if (fence(req, res)) return
        if (req.method === 'GET') {
          void listRecordings().then((index: TtsRecordingsIndex) => sendJson(res, 200, index))
          return
        }
        if (req.method !== 'POST') {
          sendError(res, 405, { error: { code: 'bad-request', message: 'GET or POST only.' } })
          return
        }
        void (async () => {
          const parsed = await readJsonBody(req)
          if (parsed === undefined) {
            sendError(res, 400, { error: { code: 'bad-request', message: 'Request body is not a JSON object.' } })
            return
          }
          const request = parsed as Partial<TtsSynthesizeRequest>
          if (typeof request.text !== 'string' || request.text.trim() === '') {
            sendError(res, 400, { error: { code: 'bad-request', message: 'A non-empty `text` string is required.' } })
            return
          }
          const engine = await resolveEngineSnapshot(ctx, config)
          try {
            const wav = await synthesizeSpeech(engine, {
              text: request.text,
              style: typeof request.style === 'string' ? request.style : undefined,
              voice: typeof request.voice === 'string' ? request.voice : undefined,
            })
            const style = (typeof request.style === 'string' ? request.style : '').trim() || engine.style
            const voice = (typeof request.voice === 'string' ? request.voice : '').trim() || engine.voice
            const { recording, version } = await addVersion(
              request.text, style || undefined, voice || undefined, engine.model, wav,
            )
            res.statusCode = 200
            res.setHeader('content-type', 'audio/wav')
            res.setHeader('cache-control', 'no-store')
            res.setHeader(MIMOTTS_RECORDING_HEADER, Buffer.from(JSON.stringify({ recId: recording.id, verId: version.id })).toString('base64'))
            res.end(Buffer.from(wav))
          } catch (error) {
            const failure = error instanceof TtsError
              ? error
              : new TtsError('upstream-error', error instanceof Error ? error.message : String(error))
            const status = failure.code === 'not-configured' ? 503
              : failure.code === 'bad-request' || failure.code === 'text-too-long' ? 400
                : failure.code === 'timeout' ? 504
                  : 502
            sendError(res, status, { error: { code: failure.code, message: failure.message } })
```

</details>

**依据 2 · 源码核查**：[src/index.ts:385-413](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/index.ts#L385-L413)

历史按已有 ID 回读。

<details>
<summary>查看原文（29行）</summary>

```text
    child.effect(() => child.webServer.register({
      kind: 'exact',
      path: `${MIMOTTS_RECORDINGS_PATH}/file`,
      handler: (req, res) => {
        if (fence(req, res)) return
        if (req.method !== 'GET') {
          sendError(res, 405, { error: { code: 'bad-request', message: 'GET only.' } })
          return
        }
        const recId = readQuery(req).get('rec')
        const verId = readQuery(req).get('ver')
        if (recId === null || verId === null) {
          sendError(res, 400, { error: { code: 'bad-request', message: 'The `rec` and `ver` queries are required.' } })
          return
        }
        void (async () => {
          if (!(await hasVersion(recId, verId))) {
            sendError(res, 404, { error: { code: 'bad-request', message: 'Unknown recording or version.' } })
            return
          }
          try {
            const data = await readFile(versionFilePath(recId, verId))
            res.statusCode = 200
            res.setHeader('content-type', 'audio/wav')
            res.setHeader('cache-control', 'no-store')
            res.end(data)
          } catch {
            sendError(res, 404, { error: { code: 'bad-request', message: 'File missing on disk.' } })
          }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:420-445](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/index.ts#L420-L445)

入站 JSON 上限。

<details>
<summary>查看原文（26行）</summary>

```text
/** JSON body size limit; settings and one speak request are small. */
const MAX_BODY_BYTES = 1024 * 1024

/**
 * Read one JSON object request body under the size limit.
 * @param req - inbound request.
 * @returns the parsed object, or undefined when the body is absent, oversized,
 * malformed, or not a JSON object.
 */
async function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown> | undefined> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    const buffer = chunk as Buffer
    size += buffer.length
    if (size > MAX_BODY_BYTES) return undefined
    chunks.push(buffer)
  }
  if (chunks.length === 0) return undefined
  try {
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : undefined
  } catch {
    return undefined
```

</details>

**依据 4 · 源码核查**：[src/recordings.ts:111-135](https://github.com/1497105876/dsh-mimotts/blob/6fdad4e64da2206747c0ec57bdcf77e85e4cff87/src/recordings.ts#L111-L135)

分离的两文件写入。

<details>
<summary>查看原文（25行）</summary>

```text
export async function addVersion(
  text: string,
  style: string | undefined,
  voice: string | undefined,
  model: string,
  wav: Uint8Array,
): Promise<AddedVersion> {
  await ensureDir()
  const index = await readIndex()
  const version: TtsRecordingVersion = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    style: style ?? null,
    voice: voice ?? null,
    model,
  }
  let recording = index.entries.find(entry => entry.text === text)
  if (recording === undefined) {
    recording = { id: randomUUID(), text, createdAt: version.createdAt, versions: [] }
    index.entries.unshift(recording)
  }
  recording.versions.unshift(version)
  await writeFile(versionFilePath(recording.id, version.id), Buffer.from(wav))
  await writeIndex(index)
  return { recording, version }
```

</details>

#### 缺口

- 未运行真实 DSH、模型及并发回放
  **影响**：接入、服务费用和恢复耗时未知
  **进一步探讨**：在隔离 profile 以桩上游演练并发、磁盘失败与退出

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
