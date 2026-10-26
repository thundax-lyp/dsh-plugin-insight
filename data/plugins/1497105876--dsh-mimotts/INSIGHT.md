# dsh-mimotts

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[3c0a89c](https://github.com/1497105876/dsh-mimotts/tree/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：将DSH已定稿助手回复通过MiMo TTS合成为音频，提供内联播放器与多版本语音历史。

> **核心亮点**：把外部TTS接入消息动作、播放器和多版本历史，减少复制流程，语音模型能力继承服务商。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：音频省略代码/图片并可能只读长文开头，历史原文不代表音频完整；索引恢复和并发需验证。见 [Q03](#research-q03)。

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
  - [Q01 · 相比系统朗读新增什么？](#detail-section-11)
  - [Q02 · 文本到音频和历史如何流转？](#detail-section-12)
  - [Q03 · 听到的内容是否完整等同原答复？](#detail-section-13)
  - [Q04 · 依赖与单位朗读成本是什么？](#detail-section-14)
  - [Q05 · 可以验证什么，当前如何试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在DSH内听取和复听自然语言回复，以可核对内容覆盖和播放为结果。

系统朗读或复制到独立TTS是直接替代；本轮无同条件听感、理解和成本对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| TTS朗读 | 听取已定稿回复 | 外部端点，代码/图像省略和长文截断 |
| 播放器 | 暂停/定位/复听 | 浏览器音频需验收 |
| 语音历史 | 保留不同合成版本 | 本地索引恢复未验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 声明DSH接口与Web slots | 启动必需 | 配置与消息播放器 | 不兼容不假定可加载 |
| TTS端点/凭据/网络 | 合成必需 | 外部音频生成 | 返回稳定错误，不能本地替代 |
| 可读WAV样本 | 克隆可选 | 发送音色参考 | 可回预置音色配置 |
| profile磁盘/浏览器音频 | 历史与播放必需 | 保存/回放 | 需检查权限和存储状态 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户配置凭据、端点、音色和字数 | 先试听非敏感短文 |
| 2 | 用户朗读已定稿消息 | 知道实际覆盖且可暂停定位 |
| 3 | 用户核对历史/删除/禁用 | 索引与文件一致，否则回原文 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/凭据/试听资源未知 | 配置音色、长度与播放 | 端点/计费条件未实测 |
| 持续使用 | TTS调用、WAV存储和网络 | 校对省略、清理历史 | 每任务金额和时延未知 |
| 失败恢复 | 重合成与索引恢复资源未知 | 核对原请求、历史和磁盘 | 不保证费用或历史原子恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 朗读入口 | 消息slot与TTS路由存在 | 音质、可理解性和时延 |
| 历史 | 原文分组与WAV版本保存 | 并发/断电恢复 |
| 完整性 | 明确代码省略与长度截断 | 用户是否知道漏读 |

> **思考**：音频省略代码/图片并可能只读长文开头，历史原文不代表音频完整；索引恢复和并发需验证。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把外部TTS接入消息动作、播放器和多版本历史，减少复制流程，语音模型能力继承服务商。见 [Q01](#research-q01)、[Q02](#research-q02)。

把外部TTS接入消息动作、播放器和多版本历史，减少复制流程，语音模型能力继承服务商。见 [Q01](#research-q01)、[Q02](#research-q02)。

宿主凭据、表单和展示职责分离便于维护；稳定错误码有利于本地化。需将实际朗读文本/覆盖与音频绑定，索引直接写和回空策略不宜被视为可靠归档。

<a id="detail-section-5"></a>

### 1.4 主要限制

音频省略代码/图片并可能只读长文开头，历史原文不代表音频完整；索引恢复和并发需验证。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限试用非敏感短文，技术内容回读原文；先验收覆盖提示、播放、历史删除和禁用。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持朗读与历史集成；音质、理解收益和当前宿主未验证；覆盖可视化为未验证假设。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/tts.ts、src/normalize.ts、src/recordings.ts、src/client/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码抽查host、tts、normalize、recordings与client入口；未调用外部API、播放、安装或运行测试。
- 下一步：短文、长文、代码、表格与并发合成矩阵测覆盖、理解、时延、成本和历史恢复。

**分析版本**

- **仓库**：[1497105876/dsh-mimotts](https://github.com/1497105876/dsh-mimotts)
- **版本号**：0.2.0-rc.5（[固定提交 3c0a89c](https://github.com/1497105876/dsh-mimotts/tree/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的音频版本覆盖标记可能减少误解；以长文/代码/表格理解对照和定位时间证伪。见 [Q05](#research-q05)。

短文、长文、代码、表格与并发合成矩阵测覆盖、理解、时延、成本和历史恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 24 | 3934 | 2954 | 1019 | — |
| .md | source | 1 | 145 | — | — | 2426 |
| .mjs | source | 3 | 276 | 190 | 61 | — |
| .ts | source | 17 | 2410 | 1581 | 674 | — |
| .tsx | source | 6 | 722 | 564 | 121 | — |
| .mjs | test | 5 | 326 | 288 | 14 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/1497105876/dsh-mimotts/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：MiMo朗读集成是否让DSH回复更方便听取，哪些内容转换与存储条件影响完整交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比系统朗读新增什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是希望在DSH内听取已定稿回复、复听不同音色版本的人。合格结果是用户知道实际朗读了哪些内容，音频能播放/暂停/定位且历史可找回；合成接口返回WAV不等于听懂任务。相对复制到外部TTS，本插件把消息动作、播放器、配置和历史放入宿主；相对系统朗读，新增特定MiMo音色/克隆和按文本多版本，但不是独立语音模型贡献。没有听感与理解任务对照，不把语音入口宣传为已验证无障碍改进。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/README.md#L1-L5)

作者消息朗读与播放器定位

```text
# @gw/dsh-mimotts — MiMo TTS 语音合成插件（DeepSeek Harness 0.2.0-rc.2）

把助手回复"读出来"的 DSH 插件：**"插件"页里的配置卡片** + **每条已定稿助手回复动作行里的音量按钮** + **带可拖动进度条的内联播放器** + **设置页里的"语音历史"**。语音由小米 MiMo TTS（`mimo-v2.5-tts`）合成，API Key 只存在于宿主侧，浏览器只发送文本、收到 WAV。

面向 **deepseek-harness `0.2.0-rc.2`**（`engines.dsh: ">=0.2.0-rc.2 <0.3.0"`），完全按照官方插件规范实现：
```

**依据 2 · 源码核查**：[src/client/index.ts:4-18](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/client/index.ts#L4-L18)

三个宿主slot及数据流

<details>
<summary>查看原文（15行）</summary>

```text
 * Three contributions, all registered through the typed slot system:
 * - `plugins.bundle.config` (keyed by the npm package name): the plugin's
 *   configuration card on the Plugins page, mounted on the bundle's detail
 *   page — the official seat for a bundle's own configuration;
 * - `settings.section`: the `语音历史` page (recorded speech, versions,
 *   re-synthesis), mounted while the Host serves this plugin's `mimotts`
 *   configuration namespace;
 * - `conversation.chat.assistant-actions`: the volume button under every
 *   finalized assistant message, with its floating player (draggable progress
 *   bar) once audio exists.
 *
 * Neither entry owns business state: configuration flows through
 * `ctx.configForms` (`mimotts` namespace), synthesis through the Host's
 * `/api/mimotts` routes, text from the Conversation binding through `useChat`,
 * and copy through `ctx.locale`.
```

</details>

**依据 3 · 源码核查**：[src/recordings.ts:4-13](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/recordings.ts#L4-L13)

多版本历史设计

<details>
<summary>查看原文（10行）</summary>

```text
 * Every spoken text becomes one recording node; each synthesis — first pass
 * or a later re-synthesis — appends a version with its own WAV file on disk.
 * A single `index.json` records the tree so the browser can list history
 * without scanning directories. The store lives under the active profile's
 * data root (`~/.dsh/profiles/<profile>/mimotts-recordings`; the legacy global
 * `~/.dsh` when no profile is active), outside the plugin and any repository,
 * so no recording leaks into version control.
 *
 * Re-synthesis never overwrites: it adds a new version, leaving earlier
 * takes intact so the user can compare voices side by side.
```

</details>

#### 缺口

- 未采集用户听取场景、理解率和系统朗读对照
  **影响**：无法确认额外价值和可及性收益
  **进一步探讨**：同一回复比较系统朗读、外部TTS与插件的理解/回找耗时

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文本到音频和历史如何流转？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

浏览器从会话取文本，宿主路由先经connection.requestRejection验证请求，再解析凭据与当前配置。tts归一化Markdown、按maxChars截前缀，添加style后作为assistant内容发送chat/completions，音频配置为预置voice或本地WAV的base64克隆样本；回传音频统一包装WAV。录音路由先合成，再addVersion保存原request.text与WAV，返回音频并带录音ID。前后端不直接共享密钥值，凭据存储使用宿主remote接口。可借鉴的是宿主凭据/配置/slot边界与稳定错误码；外部TTS服务、PCM/WAV标准不计插件原创。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:119-127](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/index.ts#L119-L127)

请求信任栅栏

```text
  ctx.inject(['webServer', 'connection'], (child) => {
    const fence = (req: IncomingMessage, res: ServerResponse): boolean => {
      // The configured Host/Origin fence plus browser authentication: an
      // unauthenticated LAN request must not spend the operator's API credits.
      const rejection = child.connection.requestRejection(req)
      if (rejection === undefined) return false
      res.statusCode = rejection
      res.end()
      return true
```

**依据 2 · 源码核查**：[src/tts.ts:130-178](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/tts.ts#L130-L178)

归一化、voice样本和请求负载

<details>
<summary>查看原文（49行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/index.ts:243-259](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/index.ts#L243-L259)

合成后落历史与音频返回

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:62-68](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/client/index.ts#L62-L68)

宿主凭据写入

```text
  // The typed API key stores through the platform's credentials remote — the
  // same host operation the official add-model credential editor writes
  // through — so the literal key never lands in a configuration file.
  const controller = new TtsSettingsController(
    ctx.configForms.get<TtsSettings>(MIMOTTS_NAMESPACE),
    async (ref, value) => (await ctx.remote.credentials.set(ref, value)).ok,
  )
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 听到的内容是否完整等同原答复？

**研究主题**：缺陷与关键质疑

#### 完整回答

不等同。normalize把代码块替换为“代码略”、删除图片和链接目标，将表格按顺序逗号连接；这便于听取自然语言，但不能作为代码、表格关系或图像内容的完整替代。clampText超过maxChars只读开头附近句界，历史仍以原request.text存储，因而“同一文本有一段音频”不证明全部读完。最影响核心价值的质疑是用户是否知道省略/截断了什么，否则便利入口可能造成误解而非完整交付。存储另使用单index.json直接writeFile，读坏回空；当前抽查未见跨请求事务保障，需并发/断电测试，不能把版本不覆盖推成绝不丢历史。

#### 证据与依据

**依据 1 · 源码核查**：[src/normalize.ts:23-45](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/normalize.ts#L23-L45)

代码/图像/链接/表格转换

<details>
<summary>查看原文（23行）</summary>

````text
export function toSpeakableText(markdown: string): string {
  let text = markdown
  // Fenced code: one spoken note per block, whatever its language.
  text = text.replace(/```[\s\S]*?```/g, `\n${CODE_FENCE_NOTE}\n`)
  text = text.replace(/~~~[\s\S]*?~~~/g, `\n${CODE_FENCE_NOTE}\n`)
  // Inline code keeps its content, loses its ticks.
  text = text.replace(/`([^`\n]*)`/g, '$1')
  // Images: drop entirely (alt text is rarely speakable).
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  // Links keep the anchor text; the URL is never spoken.
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  text = text.replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
  // Reference definitions and HTML tags.
  text = text.replace(/^\[[^\]]*\]:\s+\S+.*$/gmu, '')
  text = text.replace(/<\/?[a-zA-Z][^>\n]*>/g, '')
  // Headings, bullets, quotes, and horizontal rules.
  text = text.replace(/^#{1,6}\s+/gmu, '')
  text = text.replace(/^\s*(?:[-*+]|\d+[.)])\s+/gmu, '')
  text = text.replace(/^\s*>\s?/gmu, '')
  text = text.replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gmu, '\n')
  // Tables: keep cell text in reading order, drop alignment and cell markup.
  text = text.replace(/^\|?[\s:|-]+\|[\s:|-]*$/gmu, '')
  text = text.replace(/\s*\|\s*/g, '，')
````

</details>

**依据 2 · 源码核查**：[src/normalize.ts:68-79](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/normalize.ts#L68-L79)

按字符预算截前缀

<details>
<summary>查看原文（12行）</summary>

```text
export function clampText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  const prefix = text.slice(0, maxChars)
  const boundary = Math.max(
    prefix.lastIndexOf('。'),
    prefix.lastIndexOf('！'),
    prefix.lastIndexOf('？'),
    prefix.lastIndexOf('!'),
    prefix.lastIndexOf('?'),
    prefix.lastIndexOf('.'),
  )
  return boundary > maxChars / 2 ? prefix.slice(0, boundary + 1) : prefix
```

</details>

**依据 3 · 源码核查**：[src/index.ts:252-254](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/index.ts#L252-L254)

历史保存原始request文本

```text
            const { recording, version } = await addVersion(
              request.text, style || undefined, voice || undefined, engine.model, wav,
            )
```

**依据 4 · 源码核查**：[src/recordings.ts:65-78](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/recordings.ts#L65-L78)

索引读坏退空与直接写

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

#### 缺口

- 省略提示、并发历史与真实播放未运行
  **影响**：完整理解及持久恢复不确定
  **进一步探讨**：测试长文/代码/表格/并发合成，核对朗读覆盖与索引

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖与单位朗读成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

启动依赖声明DSH0.2接口、配置表单/slot与宿主凭据；实际合成还依赖外部MiMo兼容端点、有效key、网络与音频设备，克隆需可读样本。密钥仅宿主处理不等于文本留在本机：正文与克隆样本会发到配置端点，用户应按内容选择。首次成本是凭据、音色、最大长度和播放验证，持续是每次合成/重合成费用与WAV存储，失败包括已发请求但响应丢失的重复费用；本轮未查询现价、发请求或估算金额。历史多版本保留便于比较，也增加磁盘与清理负担。单位应是合格听取任务，不是一次HTTP200。

#### 证据与依据

**依据 1 · 源码核查**：[src/tts.ts:142-178](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/tts.ts#L142-L178)

样本和正文进入外部请求

<details>
<summary>查看原文（37行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/recordings.ts:24-40](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/recordings.ts#L24-L40)

profile存储和全局回落

<details>
<summary>查看原文（17行）</summary>

```text
/** The legacy home-level store, used when no DSH profile is active. */
const LEGACY_RECORDINGS_DIR = join(homedir(), '.dsh', 'mimotts-recordings')

// Resolved lazily on first use and cached: the profile signals (env, argv,
// install location) only settle once the harness process is up, and the store
// must stay in one place for the process lifetime.
let cachedDir: string | undefined
function recordingsDir(): string {
  if (cachedDir === undefined) {
    cachedDir = profileScopedDefault('mimotts-recordings') ?? LEGACY_RECORDINGS_DIR
  }
  return cachedDir
}

/** The single index file mapping texts to their version trees. */
function indexFile(): string {
  return join(recordingsDir(), 'index.json')
```

</details>

**依据 3 · 作者声明**：[README.md:89-97](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/README.md#L89-L97)

宿主兼容声明边界

````text
  config:
    apiKey: !!js process.env.MIMO_API_KEY
```

## 适配版本与「按版本选适配」

**分发不会按宿主版本自动下载对应适配版本。** 本插件打包时把 `@deepseek-ai/dsh-*` 依赖锁死在某一个 release（当前 0.2.0-rc.2），别人拉到的就是同一份 `package.json`；npm 不会"看对方 dsh 版本 → 选不同版本的 dsh-* 依赖"。真正的版本闸门是 dsh 的两处兼容性声明：

- `dsh.compatibility.dshReleases`：官方字段，精确列出本包适配的 release（如 `{ "0.2.0-rc.2": "compatible" }`）。安装器/市场在对方 dsh 版本不在白名单时**拒绝或警告**，而不是自动换一个适配版本。
````

#### 缺口

- 价格、真实时延、音频大小与重试率未知
  **影响**：单位合格朗读成本不可计算
  **进一步探讨**：记录全部请求、合格听取结果、存储增量与人工时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可以验证什么，当前如何试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是把“朗读覆盖范围”与音频版本绑定，并在播放器显示省略代码/图像/尾部位置，能比只有音量按钮减少漏读误解。依据是Q03中原文与实际朗读不一致；增量是可核对覆盖，而不是再造TTS。最小实验20段含代码/表格/长文本，与现有播放器和系统朗读对照，测事实答题、遗漏发现率、定位时间及重合成成本；若覆盖提示不提高理解或显著干扰收听则否定。当前有限试用非敏感自然语言短文，先验收当前宿主的凭据、播放、长文提示、历史删除与禁用，技术细节仍回读原文；若用户无法辨识省略则停止用作完整答复替代。

#### 证据与依据

**依据 1 · 源码核查**：[src/normalize.ts:23-45](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/normalize.ts#L23-L45)

覆盖变化的可追踪基础

<details>
<summary>查看原文（23行）</summary>

````text
export function toSpeakableText(markdown: string): string {
  let text = markdown
  // Fenced code: one spoken note per block, whatever its language.
  text = text.replace(/```[\s\S]*?```/g, `\n${CODE_FENCE_NOTE}\n`)
  text = text.replace(/~~~[\s\S]*?~~~/g, `\n${CODE_FENCE_NOTE}\n`)
  // Inline code keeps its content, loses its ticks.
  text = text.replace(/`([^`\n]*)`/g, '$1')
  // Images: drop entirely (alt text is rarely speakable).
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
  // Links keep the anchor text; the URL is never spoken.
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  text = text.replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
  // Reference definitions and HTML tags.
  text = text.replace(/^\[[^\]]*\]:\s+\S+.*$/gmu, '')
  text = text.replace(/<\/?[a-zA-Z][^>\n]*>/g, '')
  // Headings, bullets, quotes, and horizontal rules.
  text = text.replace(/^#{1,6}\s+/gmu, '')
  text = text.replace(/^\s*(?:[-*+]|\d+[.)])\s+/gmu, '')
  text = text.replace(/^\s*>\s?/gmu, '')
  text = text.replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gmu, '\n')
  // Tables: keep cell text in reading order, drop alignment and cell markup.
  text = text.replace(/^\|?[\s:|-]+\|[\s:|-]*$/gmu, '')
  text = text.replace(/\s*\|\s*/g, '，')
````

</details>

**依据 2 · 源码核查**：[src/normalize.ts:68-79](https://github.com/1497105876/dsh-mimotts/blob/3c0a89cf0b5ad2efd0463ffc896b544e19bb6220/src/normalize.ts#L68-L79)

尾部截断需暴露

<details>
<summary>查看原文（12行）</summary>

```text
export function clampText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text
  const prefix = text.slice(0, maxChars)
  const boundary = Math.max(
    prefix.lastIndexOf('。'),
    prefix.lastIndexOf('！'),
    prefix.lastIndexOf('？'),
    prefix.lastIndexOf('!'),
    prefix.lastIndexOf('?'),
    prefix.lastIndexOf('.'),
  )
  return boundary > maxChars / 2 ? prefix.slice(0, boundary + 1) : prefix
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
