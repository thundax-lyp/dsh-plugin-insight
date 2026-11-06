# dsh-xiaomi-tts

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b6ab115](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/tree/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d)

<!-- BEGIN META -->
[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts) [![npm 30d 6,019](https://img.shields.io/static/v1?label=npm+30d&message=6%2C019&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-xiaomi-tts) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-xiaomi-tts)
<!-- END META -->

> **功能**：DSH语音bundle，组合云端/浏览器朗读、流式PCM、音频历史导出及可选联动。

> **亮点**：[Q02](#research-q02)代表云端流式/本地回退接线；[Q03](#research-q03)真实取消与有限历史；[Q04](#research-q04)音频导出/Host服务。

> **主要限制**：[Q03](#research-q03)取消不退款、历史失败memory；[Q04](#research-q04)局部身份检查不同、下载URL持有者可取/退出残留。

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
  - [Q01 · 当前根包究竟提供什么，哪些能力不能一起验收？](#detail-section-11)
  - [Q02 · 按钮如何真实生成并播放小米PCM音频？](#detail-section-12)
  - [Q03 · 停止和会话切换能阻止什么，历史保存是否可靠？](#detail-section-13)
  - [Q04 · 密钥、开放API/文件与联动的身份边界到哪里？](#detail-section-14)
  - [Q05 · 采用要如何限定，什么方向比继续加provider更值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-xiaomi-tts5.1.0是MIT的DSH原生语音bundle，仓库名保留xiaomi但当前还含Doubao/Breeze、浏览器语音、音频导出、可选角色preset/QQ与Passport设备。Node>=24.9、DSH>=0.2.2-0<0.3；不是模型推理或独立Agent，本包把既有模型回复/文本转成音频。面向要听长回复或产出可带走短音频的人，基线是浏览器Web Speech/既有TTS与手工下载，成功是内容/音色正确、实际播放/文件可验且可停止，不是认知/无障碍效果已经证实。

默认enabled true但自动播报/UI音效关、localSpeechMode auto，Key空可走浏览器语音；本地浏览器音色也可能在线，不能宣称零外发。角色preset和QQ加载行disabled，Passport行默认加载但token空：实际检查token合规才建网络bridge，依赖Host ASR/Agent等服务，不能据页面存在说设备已连接。只完整追代表手动/小米流式路径和音频历史/开放下载，其他provider、全部设备/QQ权限与运行结果未全审，不把整套宣传归为已验能力。

浏览器Web Speech/既有TTS加人工下载与费用/历史核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 云/本地朗读 | 听回复 | 外发/音质未测 |
| PCM | 实时播放 | 浏览器阻播/取消不退费 |
| 历史 | WAV/下载 | IDB失败退内存 |
| 开放接口 | 生成文件/URL | Bearer管理/持URL下载 |

**流程与依赖**

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| Node>=24.9/DSH0.2.2 | 必需 | Host/UI | 当前未运行 |
| 浏览器Audio/WebSpeech | 对应必需 | 播放/本地音色 | 不保证离线 |
| Provider Key/网络 | 云端必需 | 实际合成 | 费用/服务未知 |
| Host ASR/QQ/设备 | 可选 | 额外联动 | 根路径通过不能代验 |

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 准备 | 私人Host/公开短句 | 核版本权限 |
| 选择 | 一provider或浏览器 | 核去向/费用 |
| 样例 | 播放/停/重开历史 | 对声音与文件 |
| 退出 | 关自动/清Key音频 | 不凭停止退费 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/Key费用未知 | 配置/权限核对 | 未安装 |
| 持续 | 合成/带宽/音频未知 | 发音/费用审阅 | 无总费封顶 |
| 故障 | 重试/残留未知 | 核历史/URL/费用 | 取消不退款 |
| 退出 | Key/音频留存未知 | 清理/导出 | 云端留存另核 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 朗读 | 真请求/播放 | 内容/体验正确 |
| 停止 | 真Abort/音源stop | 服务商停止收费 |
| 导出 | 真WAV/私有文件 | 全部持久/恢复 |

> **思考**：[Q03](#research-q03)取消不退款、历史失败memory；[Q04](#research-q04)局部身份检查不同、下载URL持有者可取/退出残留。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)代表云端流式/本地回退接线；[Q03](#research-q03)真实取消与有限历史；[Q04](#research-q04)音频导出/Host服务。

[Q03](#research-q03)generation/Abort/音源停止真实链；[Q04](#research-q04)身份分层/私有文件与URL生命周期需分开核。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)取消不退款、历史失败memory；[Q04](#research-q04)局部身份检查不同、下载URL持有者可取/退出残留。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)低敏私人Host手动试用；关自动/QQ/设备，核实际声音、取消与重开历史，未知回浏览器语音。

默认enabled true但自动播报/UI音效关、localSpeechMode auto，Key空可走浏览器语音；本地浏览器音色也可能在线，不能宣称零外发。角色preset和QQ加载行disabled，Passport行默认加载但token空：实际检查token合规才建网络bridge，依赖Host ASR/Agent等服务，不能据页面存在说设备已连接。只完整追代表手动/小米流式路径和音频历史/开放下载，其他provider、全部设备/QQ权限与运行结果未全审，不把整套宣传归为已验能力。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代表小米生成→播放/取消/历史路径可追，外部服务/全部联动未验，限低敏手动受限试用。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/client/conversation/read-aloud.tsx、src/client/history/audio-history.ts、src/client/history/pcm-recording.ts、src/client/playback/live-speech-controller.ts、src/client/playback/pcm-audio-queue.ts、src/client/playback/read-aloud-playback.ts、src/client/settings/save-settings.ts、src/host/audio-downloads.ts、src/host/complete-synthesis.ts、src/host/open-api-routes.ts、src/host/speech-files.ts、src/host/synthesis-routes.ts、src/host/validation.ts、src/host/xiaomi.ts、src/index.ts、src/passport.ts、src/pcm-stream.ts、src/speech-agent.ts、src/types/playback.ts、src/types/settings.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：新项source；完整代表手动/小米HTTP流→PCM播放、Abort队列/上游取消、历史IDB/WAV、配置secret/状态、开放管理/下载/Host文件及Agent合成工具；仅核Passport默认与依赖gate，未全审Doubao/Breeze/设备/QQ/所有UI/Host外围。
- 下一步：仅固定源码只读；未运行安装目标/测试/模型/云语音/浏览器/Host/账号/设备，无独立质量/延迟/安全/费用或恢复实测。

**分析版本**

- **仓库**：[ppy-web/dsh-plugin-xiaomi-mimo-tts](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts)
- **版本号**：5.1.0（[固定提交 b6ab115](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/tree/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)区分请求/收到/播放/持久四状态，先比现有提示和人工计划。

仅固定源码只读；未运行安装目标/测试/模型/云语音/浏览器/Host/账号/设备，无独立质量/延迟/安全/费用或恢复实测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 1236 | — | — | 30983 |
| .cjs | source | 1 | 40 | 38 | 1 | — |
| .ts | source | 152 | 15349 | 13878 | 494 | — |
| .tsx | source | 60 | 6725 | 6288 | 85 | — |
| .js | source | 1 | 2 | 1 | 1 | — |
| .mjs | test | 76 | 11032 | 10346 | 85 | — |
| .ts | example | 1 | 41 | 26 | 6 | — |
| .md | example | 1 | 23 | — | — | 184 |
| .mjs | source | 8 | 416 | 374 | 12 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核TTS从用户操作到真实网络/PCM/音频文件，分清取消/身份/存储/费用边界及可选联动归属，形成可证伪采用方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前根包究竟提供什么，哪些能力不能一起验收？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

dsh-xiaomi-tts5.1.0是MIT的DSH原生语音bundle，仓库名保留xiaomi但当前还含Doubao/Breeze、浏览器语音、音频导出、可选角色preset/QQ与Passport设备。Node>=24.9、DSH>=0.2.2-0<0.3；不是模型推理或独立Agent，本包把既有模型回复/文本转成音频。面向要听长回复或产出可带走短音频的人，基线是浏览器Web Speech/既有TTS与手工下载，成功是内容/音色正确、实际播放/文件可验且可停止，不是认知/无障碍效果已经证实。

默认enabled true但自动播报/UI音效关、localSpeechMode auto，Key空可走浏览器语音；本地浏览器音色也可能在线，不能宣称零外发。角色preset和QQ加载行disabled，Passport行默认加载但token空：实际检查token合规才建网络bridge，依赖Host ASR/Agent等服务，不能据页面存在说设备已连接。只完整追代表手动/小米流式路径和音频历史/开放下载，其他provider、全部设备/QQ权限与运行结果未全审，不把整套宣传归为已验能力。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-7](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/package.json#L1-L7)

身份/版本/MIT。

```text
{
  "name": "dsh-xiaomi-tts",
  "version": "5.1.0",
  "description": "为 DSH 添加 Xiaomi MiMo TTS、豆包 Seed TTS、Breeze Blue TTS，浏览器语音；音频下载、 UI 音效、桌宠联动、QQBot 语音；",
  "icon": "./assets/plugin-icons/avatar.webp",
  "license": "MIT",
  "type": "module",
```

**依据 2 · 源码核查**：[package.json:134-151](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/package.json#L134-L151)

实际Node/DSH/peer范围。

<details>
<summary>查看原文（18行）</summary>

```text
  "engines": {
    "node": ">=24.9.0",
    "dsh": ">=0.2.2-0 <0.3.0-0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.1.0",
    "@deepseek-ai/cordis-plugin-loader": "~1.1.0",
    "@deepseek-ai/dsh-agent": ">=0.2.2-0 <0.3.0-0",
    "@deepseek-ai/dsh-agent-default-model": ">=0.2.2-0 <0.3.0-0",
    "@deepseek-ai/dsh-agent-preset": ">=0.2.2-0 <0.3.0-0",
    "@deepseek-ai/dsh-agent-preset-registry": ">=0.2.2-0 <0.3.0-0",
    "@deepseek-ai/dsh-api-session-controller": ">=0.2.2-0 <0.3.0-0",
    "@deepseek-ai/dsh-client-locale": ">=0.2.2-0 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-chat": ">=0.2.2-0 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-conversation": ">=0.2.2-0 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-plugin-manager": ">=0.2.2-0 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.2.2-0 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-renderer": ">=0.2.2-0 <0.3.0-0",
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-25](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/cordis.patch.yml#L1-L25)

原生加载/真实默认开关与限制。

<details>
<summary>查看原文（25行）</summary>

```text
# Xiaomi MiMo TTS for DSH Web.
# The one row activates both the Host half and the package's dsh.client Web half.
- insert:
    - id: xiaomi-mimo-tts
      name: 'dsh-xiaomi-tts'
      config:
        enabled: true
        apiKey: ''
        baseURL: 'https://api.xiaomimimo.com/v1'
        model: 'mimo-v2.5-tts'
        voice: '冰糖'
        voiceDesignPrompt: '青年女性，声线清亮、亲切自然，吐字清楚，语速适中，情绪温柔克制。'
        voiceDesignCustomPrompt: '青年女性，声线清亮、亲切自然，吐字清楚，语速适中，情绪温柔克制。'
        presetStylePrompt: '使用清晰、自然、准确的声音朗读，语速适中，停顿自然，语气平和克制，避免夸张表达。'
        format: 'pcm'
        autoPlay: false
        soundEnabled: false
        taskSounds: false
        clickSounds: false
        instruction: '请忠实朗读原文，根据文本语气自然表达，不添加或改写内容。'
        maxTextLength: 12000
        requestTimeoutMs: 120000
        maxMp3AudioBytes: 33554432
        maxWavAudioBytes: 134217728
        maxPausedPcmBytes: 33554432
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:27-43](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/cordis.patch.yml#L27-L43)

可选角色disabled。

<details>
<summary>查看原文（17行）</summary>

```text
# Optional companion preset: a whale maid with file, web, and question tools.
- insert:
    - id: preset-whale-girl
      name: 'dsh-xiaomi-tts/whale-girl'
      disabled: true
      config:
        id: whale-girl
        name: '鲸鱼娘'
        description: '白饭续航、机灵嘴硬，会一本正经接梗，也会温柔陪伴和可靠办事的鲸鱼娘女仆助手。'
        order: 40
        plugins:
          - id: whale-persona
            name: 'dsh-xiaomi-tts/whale-agent'

          - id: conversation-speech
            name: 'dsh-xiaomi-tts/speech-agent'
            config:
```

</details>

**依据 5 · 源码核查**：[cordis.patch.yml:84-100](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/cordis.patch.yml#L84-L100)

QQ disabled/Passport配置加载。

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

**依据 6 · 源码核查**：[src/passport.ts:72-95](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/passport.ts#L72-L95)

实际依赖注入/token不合规不监听。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.inject(['speechSynthesis', 'speechToText', 'agents', 'agentPresets', 'agentDefaultModel'], child => {
    let current: { bridge: PassportBridge; stop(): Promise<void> } | undefined
    let pending = Promise.resolve()
    let generation = 0
    let disposed = false
    const update = (): void => {
      const requested = ++generation
      pending = pending.then(async () => {
        if (disposed || requested !== generation) return
        const previous = current
        current = undefined
        connection = undefined
        lastError = undefined
        await previous?.stop()
        if (disposed || requested !== generation) return
        sessionError = undefined
        const settings = Object.fromEntries(Object.keys(defaults).map(key => [key, config[key]!.get()])) as unknown as PassportSettings
        // An unconfigured component still owns editable settings, but exposes no network listener.
        if (!isPassportAccessToken(settings.accessToken)) return
        const session = new PassportSession(child, settings.agentPreset, settings.cwd, undefined, settings.sessionRevision)
        const bridge = new PassportBridge(settings, session, child.speechToText, child.speechSynthesis,
          code => { sessionError = code; child.logger.warn(`Passport: ${code}`) },
          agent => child.emit('speech/delivered', { agent, automatic: true, result: { adapter: 'passport' } }))
        let unregister = () => {}
```

</details>

**依据 7 · 源码核查**：[src/types/settings.ts:147-176](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/types/settings.ts#L147-L176)

浏览器auto/自动播报默认等。

<details>
<summary>查看原文（30行）</summary>

```text
  enabled: true,
  apiKey: '',
  baseURL: 'https://api.xiaomimimo.com/v1',
  model: 'mimo-v2.5-tts',
  localSpeechMode: 'auto',
  localVoiceURI: '',
  localVoiceEngine: 'browser',
  mossEnabled: false,
  mossBaseURL: DEFAULT_MOSS_BASE_URL,
  mossVoice: '',
  mossVoiceName: '',
  voice: '冰糖',
  voiceDesignPrompt: '青年女性,声线清亮、亲切自然,吐字清楚,语速适中,情绪温柔克制。',
  voiceDesignCustomPrompt: '青年女性,声线清亮、亲切自然,吐字清楚,语速适中,情绪温柔克制。',
  presetStylePrompt: '',
  format: 'pcm',
  voiceDesignPlaybackMode: 'complete',
  readScope: 'smart',
  autoPlay: false,
  voiceInputCompatibility: true,
  inputAvoidance: false,
  importantAnnouncementsFirst: false,
  instruction: '',
  maxTextLength: 12000,
  requestTimeoutMs: 120000,
  maxMp3AudioBytes: DEFAULT_MAX_MP3_AUDIO_BYTES,
  maxWavAudioBytes: DEFAULT_MAX_WAV_AUDIO_BYTES,
  maxPausedPcmBytes: DEFAULT_MAX_PAUSED_PCM_BYTES,
  voiceVolume: 1,
  voiceRate: 1,
```

</details>

**依据 8 · 作者声明**：[README.md:37-39](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/README.md#L37-L39)

作者目标Host/ASR外部依赖。

```text
需要 DSH `0.2.2` 以上、Node.js 24.9+，当前适配目标为 DSH `0.2.2-rc.1`。

AI Passport 连接器还依赖宿主已启用 `@deepseek-ai/dsh-experimental-speech-to-text` 与识别 provider；该识别组件由 DSH 宿主提供，本插件不代为安装，缺少时设备无法连接（详见用户手册的 AI Passport 章节）。
```

#### 缺口

- 实际Host兼容、语音质量/需求、外部语音服务/全部设备QQ与无障碍效果未验。
  **影响**：限定代表朗读试用，不作为整套设备/团队生产验收。
  **进一步探讨**：先用公开短句在目标Host核手动朗读与文件，其他联动逐项另审。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 按钮如何真实生成并播放小米PCM音频？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

read-aloud按钮claim音频焦点后调用handleReadAloudClick→playCompletedReply，根据本地优先/Key状态/实时模型选择local、live或整段播放；auto可定向回退本地，local-first也可能失败后回云，选择不是固定离线承诺。代表live.stream调streamPcmAudio，POST文本和selection到Host，按SSE音频字段顺序consume，未收到PCM抛错。

Host POST校body/文本/配置/格式，设置AbortController/大小与超时，streamXiaomi使用undici真正Bearer请求指定baseURL/chat/completions，禁redirect且带signal，PCM preset仅mimo-v2.5-tts；返回上游流转发浏览器，不是只声明schema。浏览器解base64→小端int16→24kHz单声道AudioBuffer，BufferSource.connect/gain/start排程；source ended回收，浏览器AudioContext resume可能被权限/自动播放拒绝，收到音频不等用户听见或内容忠实。最长字数/暂停buffer/整段格式检查是资源边界，非质量/总费验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/conversation/read-aloud.tsx:98-140](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/conversation/read-aloud.tsx#L98-L140)

真实自动条件/按钮调用。

<details>
<summary>查看原文（43行）</summary>

```text
    if (!automaticReading.allowed(sessionId) || (foldedReplies === 'final' && finalMessageId !== messageId) || !ownsAudio || !automaticAudioFocus.canPlay() || text.length === 0 || settingsSnapshot.value?.enabled !== true || settingsSnapshot.value?.autoPlay !== true || (live.hasHandled(sessionId, message.identity) || local.hasHandled(sessionId, message.identity)) || running || message.latestMessageId !== messageId || message.time === null || message.time < playback.autoPlayArmedAt) return
    const cancel = window.setTimeout(() => {
      if (automaticAudioFocus.canPlay() && !live.hasHandled(sessionId, message.identity) && !local.hasHandled(sessionId, message.identity) && automaticReading.allowed(sessionId) && playback.claimAutomaticPlayback(sessionId, messageId)) { automaticReading.markAutomatic(); playCompletedReply(request, true) }
    }, 0)
    return () => window.clearTimeout(cancel)
  }, [automaticReading, foldedReplies, finalMessageId, automaticAudioFocus, ownsAudio, apiKeySupported, live, local, message.identity, message.latestMessageId, message.time, messageId, playback, resolvedSettings.localSpeechMode, resolvedSettings.localVoiceEngine, resolvedSettings.mossBaseURL, resolvedSettings.mossVoice, resolvedSettings.model, resolvedSettings.provider, resolvedSettings.doubaoModel, resolvedSettings.doubaoVoice, resolvedSettings.doubaoClonedVoice, resolvedSettings.breezeVoice, resolvedSettings.breezeInstruction, resolvedSettings.readScope, running, sessionId, settingsSnapshot.value?.autoPlay, settingsSnapshot.value?.enabled, text])

  if (settingsSnapshot.value?.enabled !== true || text.length === 0) return null

  const mine = view.sessionId === sessionId && view.messageId === messageId
  const status = mine ? view.status : 'idle'
  const source = mine ? view.source : null
  const liveActive = (source === 'live' || source === 'system') && (status === 'loading' || status === 'playing')
  const label = status === 'loading'
    ? source === 'complete' ? t('action.loading') : t('action.cancel')
    : status === 'playing'
      ? t('action.pause')
      : status === 'paused'
        ? t('action.resume')
        : status === 'error'
          ? t('action.retry')
          : t('action.play')
  const error = mine ? view.error : null
  const errorText = error === null ? null : t(PLAYBACK_ERROR_KEYS[error] ?? 'error.request')

  return (
    <>
      <Tooltip label={label} side="bottom">
        <Button
          type="button"
          variant="toolbar"
          size="sm"
          className="xmimo-tts-action"
          aria-label={label}
          aria-pressed={status === 'playing' || liveActive}
          disabled={status === 'loading' && source === 'complete'}
          onClick={() => { audioFocus.claim(); if (audioFocus.canPlay()) { automaticReading.markManual(); handleReadAloudClick(request, view) } }}
        >
          {status === 'playing'
            ? <AnimatedAudioLines size={16} />
            : <RiVoiceAiFill className={status === 'loading' ? 'xmimo-tts-pulse' : undefined} size={16} />}
        </Button>
      </Tooltip>
```

</details>

**依据 2 · 源码核查**：[src/client/playback/read-aloud-playback.ts:30-59](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/playback/read-aloud-playback.ts#L30-L59)

真实本地/云分流与单向回退。

<details>
<summary>查看原文（30行）</summary>

```text

/** Start a completed reply with one directed fallback, using the selected playback range. */
export function playCompletedReply(request: ReadAloudRequest, automatic: boolean): void {
  const { sessionId, messageId, text, settings, apiKeySupported, playback, live, local } = request
  live.configure(settings)
  playback.configure(settings)
  const scopedText = readAloudText(text, settings, automatic)
  const localText = fallbackText(scopedText, settings)
  const localFallback = settings.localSpeechMode === 'auto' ? () => local.playCompleted(sessionId, messageId, localText) : undefined
  const playRemote = (): void => {
    local.cancelSession(sessionId)
    if (!supportsRealtimeTts(settings)) {
      live.cancelSession(sessionId)
      if (splitTtsSegments(scopedText).length > 1) void playback.segmented(sessionId, messageId, scopedText, automatic, localFallback)
      else void playback.toggle(sessionId, messageId, scopedText, automatic, localFallback, 'mp3')
    } else {
      playback.cancelPlayback(sessionId)
      live.playCompleted(sessionId, messageId, scopedText, () => {
        if (localFallback !== undefined) localFallback()
        else void playback.toggle(sessionId, messageId, scopedText, automatic, undefined, 'mp3')
      })
    }
  }
  if (settings.localSpeechMode === 'local-first' || (settings.localSpeechMode === 'auto' && apiKeySupported === false)) {
    live.cancelSession(sessionId)
    playback.cancelPlayback(sessionId)
    local.playCompleted(sessionId, messageId, localText, settings.localSpeechMode === 'local-first' ? playRemote : undefined)
  } else playRemote()
}

```

</details>

**依据 3 · 源码核查**：[src/client/playback/live-speech-controller.ts:391-410](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/playback/live-speech-controller.ts#L391-L410)

真实PCM流消费/录音。

<details>
<summary>查看原文（20行）</summary>

```text
    if (!this.isCurrentStream(generation, signal)) return
    const recording = new PcmRecording()
    const sessionId = this.sessionId
    const messageId = this.messageId
    try {
      await streamPcmAudio(sentence, signal, async (pcm) => {
        if (!this.isCurrentStream(generation, signal)) return
        recording.append(pcm)
        await this.audio.enqueue(pcm)
      }, this.selection)
      if (this.isCurrentStream(generation, signal)) recording.save(this.history, {
        text: sentence, source: 'conversation',
        ...(sessionId === null ? {} : { sessionId }),
        ...(messageId === null ? {} : { messageId }),
      })
    } catch (error) {
      if (this.isCurrentStream(generation, signal)) throw error
    }
  }

```

</details>

**依据 4 · 源码核查**：[src/pcm-stream.ts:20-68](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/pcm-stream.ts#L20-L68)

真实POST/SSE/空音频错误。

<details>
<summary>查看原文（49行）</summary>

```text
/** Request one preset-model PCM16 stream and deliver each decoded SSE audio payload in order. */
export async function streamPcmAudio(text: string, signal: AbortSignal, consume: PcmChunkConsumer, selection?: TtsSelection): Promise<void> {
  if (signal.aborted) {
    return
  }
  const response = await fetch(hostRoute(TTS_STREAM_ROUTE), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text, ...(selection ?? {}) }),
    signal,
  })
  if (signal.aborted) {
    return
  }
  if (!response.ok) throw new Error(`stream-request-${response.status}`)
  if (response.body === null) throw new Error('stream-response-empty')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let pending = ''
  let receivedPcm = false
  const consumeEvents = async (events: string[]): Promise<void> => {
    for (const event of events) {
      if (signal.aborted) return
      const pcm = pcmDeltaFromSse(event)
      if (pcm === null) continue
      await consume(pcm)
      receivedPcm = true
    }
  }

  try {
    while (!signal.aborted) {
      const result = await reader.read()
      if (result.done || signal.aborted) break
      pending += decoder.decode(result.value, { stream: true })
      const parsed = parseSseRecords(pending)
      pending = parsed.remainder
      await consumeEvents(parsed.events)
    }
    pending += decoder.decode()
    if (!signal.aborted && pending.trim().length > 0) {
      await consumeEvents(parseSseRecords(`${pending}\n\n`).events)
    }
  } finally {
    reader.releaseLock()
  }

  if (!signal.aborted && !receivedPcm) throw new Error('stream-audio-empty')
```

</details>

**依据 5 · 源码核查**：[src/host/synthesis-routes.ts:25-57](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/synthesis-routes.ts#L25-L57)

真实POST/body/超时/缓冲校验。

<details>
<summary>查看原文（33行）</summary>

```text
export function registerSynthesisRoutes(ctx: Context, current: () => ResolvedTtsSettings, runtime: { connectDoubao?: NonNullable<DoubaoSessionOptions['connect']> } = {}): void {
  const connection = runtime.connectDoubao ? { connect: runtime.connectDoubao } : {}
  for (const stream of [false, true]) ctx.effect(() => ctx.webServer.register({
    kind: 'exact', path: stream ? TTS_STREAM_ROUTE : TTS_ROUTE,
    async handler(req, res) {
      if (req.method !== 'POST') { res.setHeader('allow', 'POST'); json(res, 405, { error: 'method-not-allowed' }); return }
      let settings = resolveTtsSettings(current())
      const controller = new AbortController()
      let timeout: ReturnType<typeof setTimeout> | undefined
      let disconnected = false
      const abort = () => { disconnected = true; controller.abort() }
      req.once('aborted', abort)
      res.once('close', abort)
      try {
        let body: SynthesizeBody
        try { body = await readJsonBody(req) as SynthesizeBody } catch (error) {
          throw new TtsProviderError(error instanceof Error && error.message === 'request-body-too-large' ? 'request-body-too-large' : 'invalid-json', 'Invalid synthesis request.', error instanceof Error && error.message === 'request-body-too-large' ? 413 : 400)
        }
        const prepared = prepareSpeechRequest(settings, body)
        settings = prepared.settings
        const text = prepared.text
        if (!stream && body.format !== undefined && body.format !== 'mp3' && body.format !== 'wav') throw new TtsProviderError('invalid-audio-format', 'Select MP3 or WAV.', 400)
        // Doubao owns an activity-based timeout; Xiaomi retains its total request timeout.
        if (settings.provider !== 'doubao') timeout = setTimeout(() => controller.abort(), settings.requestTimeoutMs)
        if (stream) {
          const begin = () => {
            res.statusCode = 200
            res.setHeader('content-type', 'text/event-stream; charset=utf-8')
            res.setHeader('cache-control', 'no-store')
            res.setHeader('x-accel-buffering', 'no')
          }
          const forward = (data: Uint8Array | string) => {
            if (res.destroyed) throw new TtsProviderError('tts-canceled')
```

</details>

**依据 6 · 源码核查**：[src/host/synthesis-routes.ts:67-84](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/synthesis-routes.ts#L67-L84)

真实小米流转发/清reader。

<details>
<summary>查看原文（18行）</summary>

```text
          } else {
            if (settings.provider === 'breeze') {
              const upstream = await streamBreeze(settings, text, controller.signal)
              begin()
              for await (const chunk of evenPcmChunks(upstream.body!)) {
                forward(`data: ${JSON.stringify({ choices: [{ delta: { audio: { data: chunk.toString('base64') } } }] })}\n\n`)
              }
            } else {
              const upstream = await streamXiaomi(settings, text, controller.signal)
              begin()
              const reader = upstream.body!.getReader()
              try {
                while (!controller.signal.aborted) {
                  const chunk = await reader.read()
                  if (chunk.done) break
                  forward(chunk.value)
                }
              } finally { if (!controller.signal.aborted) controller.abort(); reader.releaseLock() }
```

</details>

**依据 7 · 源码核查**：[src/host/complete-synthesis.ts:16-24](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/complete-synthesis.ts#L16-L24)

真实文本长度/配置校验。

```text
export function prepareSpeechRequest(current: ResolvedTtsSettings, body: SynthesizeBody): { settings: ResolvedTtsSettings; text: string } {
  const settings = synthesisOptions(current, body)
  const text = typeof body.text === 'string' ? prepareProviderTtsText(body.text, settings) : ''
  if (!text) throw new TtsProviderError('text-required', 'Enter text to synthesize.', 400)
  const providerLimit = settings.provider === 'breeze' ? Math.min(settings.maxTextLength, BREEZE_MAX_TEXT_LENGTH) : settings.maxTextLength
  if (text.length > providerLimit) throw new TtsProviderError('text-too-long', 'Text exceeds the configured limit.', 413)
  validateSynthesisSettings(settings)
  return { settings, text }
}
```

**依据 8 · 源码核查**：[src/host/xiaomi.ts:11-43](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/xiaomi.ts#L11-L43)

实际Bearer/undici请求/PCM模型限制与返回。

<details>
<summary>查看原文（33行）</summary>

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
  return response
}
```

</details>

**依据 9 · 源码核查**：[src/client/playback/pcm-audio-queue.ts:58-138](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/playback/pcm-audio-queue.ts#L58-L138)

实际decode/AudioContext/source.start。

<details>
<summary>查看原文（81行）</summary>

```text
  enqueue(base64: string): Promise<void> {
    return this.enqueueBytes(Uint8Array.from(atob(base64), (character) => character.charCodeAt(0)))
  }

  enqueueBytes(bytes: Uint8Array): Promise<void> {
    const revision = this.revision
    const run = this.chain.then(() => this.schedule(bytes, revision))
    this.chain = run.catch(() => {})
    return run
  }

  stop(): void {
    this.revision += 1
    this.scheduledAt = 0
    this.chain = Promise.resolve()
    this.userPaused = false
    this.queuedBytes = 0
    for (const source of this.sources) {
      try {
        source.stop()
      } catch {
        // A source may already have ended while the stop path is running.
      }
    }
    this.sources.clear()
    this.sourceBytes.clear()
    this.setBusy(false)
  }

  async dispose(): Promise<void> {
    this.stop()
    const context = this.context
    this.context = null
    this.gain?.disconnect()
    this.gain = null
    if (context !== null && context.state !== 'closed') await context.close()
  }

  private async schedule(bytes: Uint8Array, revision: number): Promise<void> {
    if (revision !== this.revision) {
      return
    }
    if (bytes.byteLength % 2) throw new Error('invalid-pcm-sample')
    if (bytes.byteLength < 2) {
      return
    }
    const context = this.getContext()
    if (context.state !== 'running' && !this.userPaused) {
      await context.resume()
    }
    if (revision !== this.revision) return

    const sampleCount = Math.floor(bytes.byteLength / 2)
    const buffer = context.createBuffer(1, sampleCount, 24000)
    const channel = buffer.getChannelData(0)
    const pcm = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    for (let index = 0; index < sampleCount; index += 1) channel[index] = pcm.getInt16(index * 2, true) / 0x8000

    const source = context.createBufferSource()
    source.buffer = buffer
    applyPcmVoiceRate(source, this.playbackRate)
    source.connect(this.getGain(context))
    const startAt = Math.max(context.currentTime + 0.03, this.scheduledAt)
    this.scheduledAt = startAt + pcmPlaybackDuration(buffer.duration, this.playbackRate)
    if (this.userPaused && this.queuedBytes + bytes.byteLength > this.maxPausedPcmBytes) throw new Error('pcm-pause-buffer-limit')
    this.sources.add(source)
    this.sourceBytes.set(source, bytes.byteLength)
    this.queuedBytes += bytes.byteLength
    source.addEventListener('ended', () => {
      if (revision !== this.revision) return
      this.sources.delete(source)
      this.queuedBytes -= this.sourceBytes.get(source) ?? 0
      this.sourceBytes.delete(source)
      if (this.sources.size === 0) this.setBusy(false)
    }, { once: true })
    try {
      source.start(startAt)
    } catch (error) {
      this.sources.delete(source)
      this.queuedBytes -= this.sourceBytes.get(source) ?? 0
      this.sourceBytes.delete(source)
```

</details>

#### 缺口

- 服务端输出质量/音色、浏览器实播/延迟/对齐与全部非小米路径未验。
  **影响**：源码链支持生成/播放机制，不证明质量/体验或offline。
  **进一步探讨**：公开固定文本核请求目的地、PCM/听感/丢段及播放权限，对照浏览器语音。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 停止和会话切换能阻止什么，历史保存是否可靠？

**研究主题**：缺陷与关键质疑、工程质量与复用、功能与机制

#### 完整回答

停止当前session通过resetState→replaceQueue递增generation/取消句子队列与duplexAbort并stop音源；句子队列真实清pending/abort当前，stream把signal给fetch，Host req.aborted/res.close再abort上游，generation拒旧PCM/晚到录音。这是代表小米HTTP取消实链，不能保证服务商未处理/不收费，更不取消Host模型任务或已发QQ消息；全部Doubao/设备取消未全审。

PCM只在当前流结束后save为WAV，溢出报skipped；浏览器历史100条/100MB限制，超过大项跳过且按新旧保留。AudioHistory初始IndexedDB读失败退memory，replace失败也仅状态memory、调用仍resolve；因此可听见/列表有条目不等重开持久。IndexedDB按origin单库而非Host用户/工作区隔离，条目带session/message可追来源但未加密；清理历史不撤回云服务商文本。卸载dispose等chain关DB/停播放不默认抹除存量音频，退出需用户自行导出/清理。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/playback/live-speech-controller.ts:230-267](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/playback/live-speech-controller.ts#L230-L267)

真实停止/取消/销毁。

<details>
<summary>查看原文（38行）</summary>

```text
  stop(sessionId: string): boolean {
    if (this.sessionId !== sessionId || (this.status !== 'loading' && this.status !== 'playing' && this.status !== 'paused')) return false
    if (this.active !== null) this.manuallyStoppedTurns.add(`${sessionId}:${this.active.turn}`)
    this.resetState()
    return true
  }

  blockTurn(sessionId: string, turn: number): void {
    if (this.sessionId !== sessionId) return
    this.manuallyStoppedTurns.add(`${sessionId}:${turn}`)
    if (this.active?.turn === turn) this.resetState()
  }

  hasHandled(sessionId: string, identity: Pick<LiveMessageIdentity, 'turn' | 'step'> | null): boolean {
    if (identity === null) return false
    return this.blockedTurn === `${sessionId}:${identity.turn}` || this.manuallyStoppedTurns.has(`${sessionId}:${identity.turn}`) || this.handled.has(`${sessionId}:${identity.turn}:${identity.step}`)
  }

  cancelSession(sessionId: string): void {
    if (this.sessionId === sessionId) this.cancel()
  }

  cancel(): void {
    this.blockedTurn = null
    this.resetState()
  }

  interrupt(): void {
    if (this.active !== null) this.blockedTurn = `${this.active.sessionId}:${this.active.turn}`
    this.resetState()
  }

  async dispose(): Promise<void> {
    this.cancel()
    this.handled.clear()
    this.manuallyStoppedTurns.clear()
    await this.audio.dispose()
  }
```

</details>

**依据 2 · 源码核查**：[src/client/playback/live-speech-controller.ts:295-307](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/playback/live-speech-controller.ts#L295-L307)

resetState真实audio.stop。

<details>
<summary>查看原文（13行）</summary>

```text
  private resetState(): void {
    this.checkpointed = false
    this.replaceQueue()
    this.audio.stop()
    this.active = null
    this.observed = ''
    this.consumed = 0
    this.pendingText = ''
    this.setStatus('idle')
    this.messageId = null
    this.completed = null
    this.audioStarted = false
  }
```

</details>

**依据 3 · 源码核查**：[src/client/playback/live-speech-controller.ts:374-410](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/playback/live-speech-controller.ts#L374-L410)

generation/队列/abort/晚到过滤。

<details>
<summary>查看原文（37行）</summary>

```text
  private replaceQueue(): void {
    this.streamGeneration += 1
    this.requestBusy = false
    this.queue.cancel()
    this.queue = this.createQueue()
    this.duplexAbort.abort()
    this.duplexAbort = new AbortController()
    this.duplexJobs = []
    this.duplexStep = null
    this.duplexRunning = false
  }

  private isCurrentStream(generation: number, signal: AbortSignal): boolean {
    return generation === this.streamGeneration && !signal.aborted
  }

  private async stream(sentence: string, signal: AbortSignal, generation: number): Promise<void> {
    if (!this.isCurrentStream(generation, signal)) return
    const recording = new PcmRecording()
    const sessionId = this.sessionId
    const messageId = this.messageId
    try {
      await streamPcmAudio(sentence, signal, async (pcm) => {
        if (!this.isCurrentStream(generation, signal)) return
        recording.append(pcm)
        await this.audio.enqueue(pcm)
      }, this.selection)
      if (this.isCurrentStream(generation, signal)) recording.save(this.history, {
        text: sentence, source: 'conversation',
        ...(sessionId === null ? {} : { sessionId }),
        ...(messageId === null ? {} : { messageId }),
      })
    } catch (error) {
      if (this.isCurrentStream(generation, signal)) throw error
    }
  }

```

</details>

**依据 4 · 源码核查**：[src/types/playback.ts:21-80](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/types/playback.ts#L21-L80)

真实句子队列cancel/abort/错误清队列。

<details>
<summary>查看原文（60行）</summary>

```text
export class AbortableSentenceQueue {
  private readonly pending: string[] = []
  private current: AbortController | null = null
  private revision = 0
  private busy = false

  constructor(
    private readonly start: (sentence: string, signal: AbortSignal) => Promise<void>,
    private readonly options: AbortableSentenceQueueOptions = {},
  ) {}

  enqueue(sentence: string): void {
    this.pending.push(sentence)
    this.setBusy(true)
    void this.pump()
  }

  cancel(): void {
    this.revision += 1
    this.pending.length = 0
    this.current?.abort()
    this.current = null
    this.setBusy(false)
  }

  private async pump(): Promise<void> {
    if (this.current !== null) return
    const sentence = this.pending.shift()
    if (sentence === undefined) {
      this.setBusy(false)
      return
    }
    const revision = this.revision
    const controller = new AbortController()
    this.current = controller
    try {
      await this.start(sentence, controller.signal)
    } catch (error) {
      if (!controller.signal.aborted && revision === this.revision) {
        this.pending.length = 0
        this.revision += 1
        this.options.onError?.(error)
      }
    } finally {
      if (this.current === controller) this.current = null
      if (revision === this.revision) {
        if (this.pending.length > 0) void this.pump()
        else this.setBusy(false)
      } else {
        this.setBusy(false)
      }
    }
  }

  private setBusy(busy: boolean): void {
    if (this.busy === busy) return
    this.busy = busy
    this.options.onBusyChange?.(busy)
  }
}
```

</details>

**依据 5 · 源码核查**：[src/host/synthesis-routes.ts:29-36](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/synthesis-routes.ts#L29-L36)

Host断连真实abort。

```text
    async handler(req, res) {
      if (req.method !== 'POST') { res.setHeader('allow', 'POST'); json(res, 405, { error: 'method-not-allowed' }); return }
      let settings = resolveTtsSettings(current())
      const controller = new AbortController()
      let timeout: ReturnType<typeof setTimeout> | undefined
      let disconnected = false
      const abort = () => { disconnected = true; controller.abort() }
      req.once('aborted', abort)
```

**依据 6 · 源码核查**：[src/host/synthesis-routes.ts:91-105](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/synthesis-routes.ts#L91-L105)

路由finally abort清监听。

<details>
<summary>查看原文（15行）</summary>

```text
          res.setHeader('content-type', format === 'wav' ? 'audio/wav' : 'audio/mpeg')
          res.setHeader('content-length', audio.length)
          res.setHeader('cache-control', 'no-store')
          res.end(audio)
        }
      } catch (error) {
        if (!disconnected) responseError(res, controller.signal.aborted && !(error instanceof CompleteAudioResponseError) ? new TtsProviderError('xiaomi-timeout', 'Synthesis timed out.', 504) : error, settings)
      } finally {
        clearTimeout(timeout)
        controller.abort()
        req.off('aborted', abort)
        res.off('close', abort)
      }
    },
  }), `xiaomi-mimo-tts: ${stream ? 'streaming ' : ''}synthesis route`)
```

</details>

**依据 7 · 源码核查**：[src/client/playback/pcm-audio-queue.ts:68-95](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/playback/pcm-audio-queue.ts#L68-L95)

实际音源停止/AudioContext销毁。

<details>
<summary>查看原文（28行）</summary>

```text

  stop(): void {
    this.revision += 1
    this.scheduledAt = 0
    this.chain = Promise.resolve()
    this.userPaused = false
    this.queuedBytes = 0
    for (const source of this.sources) {
      try {
        source.stop()
      } catch {
        // A source may already have ended while the stop path is running.
      }
    }
    this.sources.clear()
    this.sourceBytes.clear()
    this.setBusy(false)
  }

  async dispose(): Promise<void> {
    this.stop()
    const context = this.context
    this.context = null
    this.gain?.disconnect()
    this.gain = null
    if (context !== null && context.state !== 'closed') await context.close()
  }

```

</details>

**依据 8 · 源码核查**：[src/client/history/pcm-recording.ts:10-58](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/history/pcm-recording.ts#L10-L58)

实际PCM限额/WAV/保存。

<details>
<summary>查看原文（49行）</summary>

```text
  constructor(maxBytes = 100 * 1024 * 1024 - 44) { this.maxBytes = maxBytes }

  append(base64: string): void {
    const binary = atob(base64)
    this.appendBytes(Uint8Array.from(binary, (character) => character.charCodeAt(0)))
  }

  appendBytes(bytes: Uint8Array): void {
    if (this.overflow) return
    this.bytes += bytes.length
    if (this.bytes > this.maxBytes) {
      this.overflow = true
      this.chunks = []
      return
    }
    this.chunks.push(Uint8Array.from(bytes))
  }

  toWav(): Blob | null {
    if (this.overflow || this.bytes === 0 || this.bytes % 2 !== 0) return null
    const header = new ArrayBuffer(44)
    const view = new DataView(header)
    const label = (offset: number, value: string): void => {
      for (let index = 0; index < value.length; index += 1) view.setUint8(offset + index, value.charCodeAt(index))
    }
    label(0, 'RIFF')
    view.setUint32(4, 36 + this.bytes, true)
    label(8, 'WAVE')
    label(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, 24000, true)
    view.setUint32(28, 48000, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    label(36, 'data')
    view.setUint32(40, this.bytes, true)
    return new Blob([header, ...this.chunks], { type: 'audio/wav' })
  }

  save(history: AudioHistory | undefined, input: Omit<AudioHistoryInput, 'blob' | 'format'>): void {
    if (this.overflow) void history?.reportSkipped()
    const blob = this.toWav()
    this.chunks = []
    this.bytes = 0
    if (blob !== null) void history?.add({ ...input, blob, format: 'wav' })
  }
}
```

</details>

**依据 9 · 源码核查**：[src/client/history/audio-history.ts:1-3](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/history/audio-history.ts#L1-L3)

历史限额。

```text
export const AUDIO_HISTORY_MAX_ENTRIES = 100
export const AUDIO_HISTORY_MAX_BYTES = 100 * 1024 * 1024

```

**依据 10 · 源码核查**：[src/client/history/audio-history.ts:43-48](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/history/audio-history.ts#L43-L48)

初读失败memory回退。

```text
    this.chain = storage.load().then((entries) => {
      this.storageLoaded = true
      this.publish({ entries: retainAudioHistory(entries), status: 'ready', skipped: false })
    }).catch(() => this.publish({ entries: [], status: 'memory', skipped: false }))
  }

```

**依据 11 · 源码核查**：[src/client/history/audio-history.ts:89-131](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/history/audio-history.ts#L89-L131)

dispose/写失败状态与保留。

<details>
<summary>查看原文（43行）</summary>

```text
    this.stopReplay()
    this.replayStops.clear()
    this.listeners.clear()
    await this.chain
    this.storage.close()
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
  }

  private publish(view: AudioHistoryView): void {
    this.view = view
    for (const listener of this.listeners) listener()
  }
}

export function retainAudioHistory(entries: readonly AudioHistoryEntry[]): AudioHistoryEntry[] {
  let bytes = 0
  const retained: AudioHistoryEntry[] = []
  for (const entry of [...entries].sort((a, b) => b.createdAt - a.createdAt)) {
    if (entry.blob.size === 0 || entry.blob.size > AUDIO_HISTORY_MAX_BYTES) continue
    if (retained.length >= AUDIO_HISTORY_MAX_ENTRIES || bytes + entry.blob.size > AUDIO_HISTORY_MAX_BYTES) break
    bytes += entry.blob.size
    retained.push(entry)
  }
  return retained
}

class IndexedDbAudioHistoryStorage implements AudioHistoryStorage {
  private database: IDBDatabase | null = null
  private ids = new Set<string>()

```

</details>

**依据 12 · 源码核查**：[src/client/history/audio-history.ts:138-174](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/history/audio-history.ts#L138-L174)

真实origin IndexedDB load/replace/close。

<details>
<summary>查看原文（37行）</summary>

```text
        if (blocked) { request.result.close(); return }
        request.result.onversionchange = () => request.result.close()
        resolve(request.result)
      }
      request.onerror = () => reject(request.error)
      request.onblocked = () => { blocked = true; reject(new Error('audio-history-blocked')) }
    })
    return new Promise((resolve, reject) => {
      const transaction = this.database!.transaction('audio', 'readonly')
      const request = transaction.objectStore('audio').getAll()
      transaction.oncomplete = () => {
        const entries = request.result as AudioHistoryEntry[]
        this.ids = new Set(entries.map((entry) => entry.id))
        resolve(entries)
      }
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error)
    })
  }

  async replace(entries: readonly AudioHistoryEntry[]): Promise<void> {
    if (this.database === null) throw new Error('audio-history-unavailable')
    const nextIds = new Set(entries.map((entry) => entry.id))
    await new Promise<void>((resolve, reject) => {
      const transaction = this.database!.transaction('audio', 'readwrite')
      const store = transaction.objectStore('audio')
      for (const id of this.ids) if (!nextIds.has(id)) store.delete(id)
      for (const entry of entries) if (!this.ids.has(entry.id)) store.put(entry)
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error)
    })
    this.ids = nextIds
  }

  close(): void { this.database?.close(); this.database = null }
}
```

</details>

#### 缺口

- 实际断连/服务商取消收费、崩溃历史和多用户/多标签页竞态未测。
  **影响**：不可称Exactly-once/停止退费/安全云撤回或历史永不丢。
  **进一步探讨**：低敏样例测晚到/断网/阻播/IDB不可写，核重开实际内容与费用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 密钥、开放API/文件与联动的身份边界到哪里？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

Key与openApiToken声明secret，设置收集ops经Host ConfigForm.mutate，Host状态route仅回configured/supported；这是局部不回原Key证据，完整Host凭据/配置ACL和磁盘保护未审。普通合成HTTP只POST/JSON/限制，无同文件token或Origin校验，WebSocket双工另外要求Origin与Host同域；Host外围认证未知，不能推所有路由安全或公网无认证已证漏洞。enabled关闭主要挡UI与播放管理，所核prepareSpeechRequest/validateSynthesisSettings不检查enabled，不能把开关当Host所有合成访问的安全kill switch。

开放能力/导出管理API另要求非空Bearer token恒时比较并拒跨Origin/Fetch-Site，allowlist不接受调用者路径/凭据；exportAudio实际合成后写Host ~/.dsh-xiaomi-tts/audio，随机文件名wx/0600，TTL24小时清理。发布下载由进程内Map+32随机字节id，下载GET/HEAD不要求Bearer：持URL即能取至过期/撤销/进程退出，非逐用户/一次性URL。重启Map丢失但磁盘文件由后续清理收尾，无法用旧URL恢复；失败/强杀残留与清理要核。

Agent合成工具实际调用exportAudio并返回本地路径，无独立模型循环，Host工具权限/是否审批由外部治理；可选QQ/Passport还涉及消息/麦克风/Agent权限，根朗读通过不能替这些验收，本轮保持关闭不调用账号/设备。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:54-83](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/index.ts#L54-L83)

实际secret声明/设置字段。

<details>
<summary>查看原文（30行）</summary>

```text
export const XIAOMI_MIMO_TTS_SETTINGS_NAMESPACE = TTS_SETTINGS_NAMESPACE

/** Validated Host settings schema. */
export const Config = z.object({
  openApiToken: z.string().role('secret').default('').volatile(),
  showInSidebar: z.boolean().default(false).volatile(),
  showInHostSettings: z.boolean().default(DEFAULT_TTS_SETTINGS.showInHostSettings).volatile(),
  qqbotEnabled: z.boolean().default(DEFAULT_TTS_SETTINGS.qqbotEnabled).volatile(),
  qqbotMaxAutoCharacters: z.number().step(1).min(0).max(12000).default(0).volatile(),
  qqbotMaxDurationSeconds: z.number().step(1).min(0).max(6000).default(0).volatile(),
  announcementSources: z.array(z.union(ANNOUNCEMENT_SOURCES)).default(DEFAULT_TTS_SETTINGS.announcementSources).volatile(),
  provider: z.union(TTS_PROVIDERS).default(DEFAULT_TTS_SETTINGS.provider).volatile(),
  doubaoEnabled: z.boolean().default(true).volatile(),
  doubaoApiKey: z.string().role('secret').default('').volatile(),
  doubaoModel: z.union(DOUBAO_TTS_MODELS).default(DEFAULT_TTS_SETTINGS.doubaoModel).volatile(),
  doubaoVoice: z.string().default(DEFAULT_TTS_SETTINGS.doubaoVoice).volatile(),
  doubaoClonedVoice: z.string().default('').volatile(),
  doubaoInstruction: z.string().default(DEFAULT_TTS_SETTINGS.doubaoInstruction).volatile(),
  breezeEnabled: z.boolean().default(false).volatile(),
  breezeApiKey: z.string().role('secret').default(DEFAULT_TTS_SETTINGS.breezeApiKey).volatile(),
  breezeVoice: z.string().default(DEFAULT_TTS_SETTINGS.breezeVoice).volatile(),
  breezeInstruction: z.string().default(DEFAULT_TTS_SETTINGS.breezeInstruction).volatile(),
  enabled: z.boolean().default(DEFAULT_TTS_SETTINGS.enabled).volatile(),
  apiKey: z.string().role('secret').default(DEFAULT_TTS_SETTINGS.apiKey).volatile(),
  baseURL: z.string().pattern(/^https?:\/\/\S+$/iu).default(DEFAULT_TTS_SETTINGS.baseURL).volatile(),
  model: z.union(TTS_MODELS).default(DEFAULT_TTS_SETTINGS.model).volatile(),
  localSpeechMode: z.union(TTS_LOCAL_SPEECH_MODES).default(DEFAULT_TTS_SETTINGS.localSpeechMode).volatile(),
  localVoiceURI: z.string().default(DEFAULT_TTS_SETTINGS.localVoiceURI).volatile(),
  localVoiceEngine: z.union(TTS_LOCAL_VOICE_ENGINES).default(DEFAULT_TTS_SETTINGS.localVoiceEngine).volatile(),
  mossEnabled: z.boolean().default(false).volatile(),
```

</details>

**依据 2 · 源码核查**：[src/client/settings/save-settings.ts:24-52](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/settings/save-settings.ts#L24-L52)

真实Key设置ops与Host mutate拒绝。

<details>
<summary>查看原文（29行）</summary>

```text
/** Commit the draft atomically so credentials and provider selection change together. */
export async function saveSettingsDraft(scope: ConfigForm<TtsSettings>, draft: SettingsValues, changes: DraftChanges, keys: { xiaomi: string; doubao: string; breeze: string }): Promise<void> {
  const invalid = validateSettingsDraft(draft)
  if (invalid) throw new SaveSettingsError(invalid)
  for (const [provider, field] of [['xiaomi', 'apiKey'], ['doubao', 'doubaoApiKey'], ['breeze', 'breezeApiKey']] as const) {
    if (changes[field]?.kind === 'set' && keys[provider].trim() && !isSupportedTtsApiKey(keys[provider], provider)) throw new SaveSettingsError('api-key-rejected')
  }
  const snapshot = scope.getSnapshot()
  const acceptedValues = resolveTtsSettings(snapshot.value)
  const overridden = (field: string) => snapshot.user !== null && typeof snapshot.user === 'object' && Object.hasOwn(snapshot.user, field)
  const ops: Parameters<ConfigForm<TtsSettings>['mutate']>[0][number][] = []
  const write = (field: EditableSettingField, value: unknown): void => {
    const change = changes[field]
    if (!change) return
    if (change.kind === 'set' && (Array.isArray(value) ? JSON.stringify(acceptedValues[field]) === JSON.stringify(value) : Object.is(acceptedValues[field], value))) return
    if (change.kind === 'clear' && !overridden(field)) return
    ops.push(change.kind === 'clear' ? { op: 'unset', path: [field] } : { op: 'set', path: [field], value })
  }
  for (const field of EDITABLE_SETTING_FIELDS) {
    if (field !== 'provider') write(field, draft[field])
  }
  for (const [provider, field] of [['xiaomi', 'apiKey'], ['doubao', 'doubaoApiKey'], ['breeze', 'breezeApiKey']] as const) {
    if (changes[field]?.kind === 'set' && keys[provider].trim()) {
      ops.push({ op: 'set', path: [field], value: keys[provider].trim() })
    }
  }
  write('provider', draft.provider)
  if (ops.length && !await scope.mutate(ops)) throw new SaveSettingsError('host-rejected')
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:256-280](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/index.ts#L256-L280)

状态仅configured/supported与真实route注册。

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: TTS_API_KEY_STATUS_ROUTE,
    handler(req, res) {
      if (req.method !== 'GET') {
        res.setHeader('allow', 'GET')
        json(res, 405, { error: 'method-not-allowed' })
        return
      }

      const settings = current()
      const query = new URL(req.url ?? '/', 'http://localhost').searchParams.get('provider')
      if (query !== null && !TTS_PROVIDERS.includes(query as typeof TTS_PROVIDERS[number])) { json(res, 400, { error: 'invalid-provider' }); return }
      const provider = (query ?? settings.provider) as typeof TTS_PROVIDERS[number]
      const apiKey = ttsApiKey({ ...settings, provider })
      json(res, 200, {
        provider,
        configured: apiKey.length > 0,
        supported: apiKey.length > 0 && isSupportedTtsApiKey(apiKey, provider),
      })
    },
  }), 'xiaomi-mimo-tts: API key status route')

  registerSynthesisRoutes(ctx, current)
  registerMossRoutes(ctx, current)
```

</details>

**依据 4 · 源码核查**：[src/host/validation.ts:36-41](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/validation.ts#L36-L41)

实际key/voice校验无enabled。

```text
export function validateSynthesisSettings(settings: ResolvedTtsSettings): void {
  const key = ttsApiKey(settings)
  if (!key) throw new TtsProviderError('api-key-not-configured', 'Configure the selected provider API key.', 409)
  if (!isSupportedTtsApiKey(key, settings.provider)) throw new TtsProviderError('api-key-rejected', 'Unsupported API key format.', 400)
  if (!ttsSelection(settings).voice.trim()) throw new TtsProviderError('voice-required', 'Enter a voice ID.', 400)
}
```

**依据 5 · 源码核查**：[src/host/synthesis-routes.ts:25-43](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/synthesis-routes.ts#L25-L43)

HTTP局部POST/JSON控制。

<details>
<summary>查看原文（19行）</summary>

```text
export function registerSynthesisRoutes(ctx: Context, current: () => ResolvedTtsSettings, runtime: { connectDoubao?: NonNullable<DoubaoSessionOptions['connect']> } = {}): void {
  const connection = runtime.connectDoubao ? { connect: runtime.connectDoubao } : {}
  for (const stream of [false, true]) ctx.effect(() => ctx.webServer.register({
    kind: 'exact', path: stream ? TTS_STREAM_ROUTE : TTS_ROUTE,
    async handler(req, res) {
      if (req.method !== 'POST') { res.setHeader('allow', 'POST'); json(res, 405, { error: 'method-not-allowed' }); return }
      let settings = resolveTtsSettings(current())
      const controller = new AbortController()
      let timeout: ReturnType<typeof setTimeout> | undefined
      let disconnected = false
      const abort = () => { disconnected = true; controller.abort() }
      req.once('aborted', abort)
      res.once('close', abort)
      try {
        let body: SynthesizeBody
        try { body = await readJsonBody(req) as SynthesizeBody } catch (error) {
          throw new TtsProviderError(error instanceof Error && error.message === 'request-body-too-large' ? 'request-body-too-large' : 'invalid-json', 'Invalid synthesis request.', error instanceof Error && error.message === 'request-body-too-large' ? 413 : 400)
        }
        const prepared = prepareSpeechRequest(settings, body)
```

</details>

**依据 6 · 源码核查**：[src/host/synthesis-routes.ts:107-116](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/synthesis-routes.ts#L107-L116)

双工真实Origin检查。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.effect(() => {
    // Older DSH versions can keep using the HTTP Xiaomi routes.
    if (typeof ctx.webServer.registerUpgrade !== 'function') return () => {}
    const server = new WebSocketServer({ noServer: true, maxPayload: 128 * 1024, perMessageDeflate: false })
    const controllers = new Set<AbortController>()
    const remove = ctx.webServer.registerUpgrade({ path: TTS_DUPLEX_ROUTE, handler(req, socket, head) {
      let sameOrigin = false
      try { const origin = new URL(req.headers.origin ?? ''); sameOrigin = ['http:', 'https:'].includes(origin.protocol) && origin.host === req.headers.host } catch { /* reject missing/malformed Origin */ }
      if (!sameOrigin) { socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n'); return }
      server.handleUpgrade(req, socket, head, ws => {
```

</details>

**依据 7 · 源码核查**：[src/host/open-api-routes.ts:13-36](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/open-api-routes.ts#L13-L36)

管理API真实Origin/Fetch-Site/Bearer校验。

<details>
<summary>查看原文（24行）</summary>

```text
/** All management calls require a separate Host token; browser calls also stay same-origin. */
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

**依据 8 · 源码核查**：[src/host/open-api-routes.ts:74-108](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/open-api-routes.ts#L74-L108)

export字段白名单/实际调用与取消清理。

<details>
<summary>查看原文（35行）</summary>

```text
        json(res, 415, { error: 'json-required' })
        return
      }
      const controller = new AbortController()
      controllers.add(controller)
      const abort = () => controller.abort()
      req.once('aborted', abort)
      res.once('close', abort)
      try {
        let body: unknown
        try { body = await readJsonBody(req) } catch (error) {
          const large = error instanceof Error && error.message === 'request-body-too-large'
          throw new TtsProviderError(large ? 'request-body-too-large' : 'invalid-json', undefined, large ? 413 : 400)
        }
        if (!body || typeof body !== 'object' || Array.isArray(body)) throw new TtsProviderError('invalid-request', undefined, 400)
        // Explicit allowlist: callers cannot supply credentials, addresses, paths or cancellation objects.
        const input = body as Record<string, unknown>
        const allowed = ['text', 'provider', 'model', 'voice', 'voiceDesignPrompt', 'speechInstruction', 'voiceRate', 'format', 'maxDurationMs']
        if (Object.keys(input).some(key => !allowed.includes(key))) throw new TtsProviderError('unknown-request-field', undefined, 400)
        if (input.format !== undefined && !['mp3', 'wav', 'silk'].includes(input.format as string)) throw new TtsProviderError('invalid-audio-format', undefined, 400)
        const artifact = await ctx.speechSynthesis.exportAudio({ ...input, signal: controller.signal } as SpeechRequest)
        if (controller.signal.aborted) {
          await artifact.remove()
          throw new TtsProviderError('speech-service-disposed', undefined, 503)
        }
        const download = await downloads.publish(artifact)
        if (controller.signal.aborted) {
          await downloads.revoke(download.audioId)
          throw new TtsProviderError('speech-service-disposed', undefined, 503)
        }
        json(res, 201, download)
      } catch (error) {
        if (!res.destroyed && !res.writableEnded) {
          // Error codes are sufficient here; upstream prose may contain private configuration.
          if (controller.signal.aborted) json(res, 503, { error: 'speech-service-disposed' })
```

</details>

**依据 9 · 源码核查**：[src/host/open-api-routes.ts:117-150](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/open-api-routes.ts#L117-L150)

下载真实GET/HEAD按随机ID取文件，无Bearer检查。

<details>
<summary>查看原文（34行）</summary>

```text
  }))

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
      } catch (error) {
        if (res.destroyed || res.writableEnded) return
        if (res.headersSent) { res.destroy(); return }
        const missing = (error as NodeJS.ErrnoException).code === 'ENOENT'
        json(res, missing ? 404 : 500, { error: missing ? 'audio-not-found' : 'audio-download-failed' })
      }
    },
  }))
}
```

</details>

**依据 10 · 源码核查**：[src/host/audio-downloads.ts:7-55](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/audio-downloads.ts#L7-L55)

真实进程内随机Map/TTL/撤销/清理。

<details>
<summary>查看原文（49行）</summary>

```text
export class AudioDownloads {
  private readonly entries = new Map<string, { artifact: SpeechArtifact; expiresAt: number }>()
  private closed = false

  constructor(private readonly now: () => number = Date.now) {}

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

  async revoke(audioId: string): Promise<void> {
    const entry = this.entries.get(audioId)
    this.entries.delete(audioId)
    await entry?.artifact.remove()
  }

  async sweep(): Promise<void> {
    const removals: Promise<void>[] = []
    for (const [id, entry] of this.entries) {
      if (entry.expiresAt > this.now()) continue
      this.entries.delete(id)
      removals.push(entry.artifact.remove())
    }
    await Promise.all(removals)
  }

  async dispose(): Promise<void> {
    this.closed = true
    const entries = [...this.entries.values()]
    this.entries.clear()
```

</details>

**依据 11 · 源码核查**：[src/host/speech-files.ts:7-37](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/speech-files.ts#L7-L37)

真实私有文件wx0600/TTL清理。

<details>
<summary>查看原文（31行）</summary>

```text
export const SPEECH_DATA_ROOT = join(homedir(), '.dsh-xiaomi-tts')
export const SPEECH_AUDIO_ROOT = join(SPEECH_DATA_ROOT, 'audio')
export const SPEECH_FILE_PREFIX = 'dsh-speech-'
export const SPEECH_FILE_TTL_MS = 24 * 60 * 60 * 1000

/** The directory comes from trusted plugin code, never model arguments. */
export async function writeSpeechArtifact(audio: SpeechAudio, directory = SPEECH_AUDIO_ROOT): Promise<SpeechArtifact> {
  await mkdir(directory, { recursive: true })
  const path = join(directory, `${SPEECH_FILE_PREFIX}${randomUUID()}.${audio.format}`)
  await writeFile(path, audio.data, { flag: 'wx', mode: 0o600 })
  return {
    path, size: audio.data.length, format: audio.format, contentType: audio.contentType,
    ...(audio.durationMs === undefined ? {} : { durationMs: audio.durationMs }),
    remove: () => rm(path, { force: true }),
  }
}

/** Clean only files owned by this plugin, including when sharing a media root. */
export async function cleanupSpeechArtifacts(directory = SPEECH_AUDIO_ROOT, now = Date.now()): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return []
    throw error
  })
  await Promise.all(entries.filter(entry => entry.isFile() && /^dsh-speech-[a-f0-9-]+\.(?:mp3|wav|silk)$/u.test(entry.name)).map(async entry => {
    const path = join(directory, entry.name)
    try {
      const info = await stat(path)
      if (now - info.mtimeMs > SPEECH_FILE_TTL_MS) await rm(path, { force: true })
    } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error }
  }))
}
```

</details>

**依据 12 · 源码核查**：[src/speech-agent.ts:66-80](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/speech-agent.ts#L66-L80)

实际工具exportAudio返回路径。

<details>
<summary>查看原文（15行）</summary>

```text
  ctx.tools.register({
    name: 'synthesize_speech',
    description: 'Generate an audio file using the configured Host speech provider. Returns a local path for download, present or another delivery tool. Does not send it to a chat. Credentials stay on the Host. If synthesis fails, you may retry once with the other configured provider; omit model and voice overrides to use that provider\'s saved settings. Do not retry a canceled request.'
      + BREEZE_AUDIO_TAG_GUIDANCE + XIAOMI_AUDIO_TAG_GUIDANCE,
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
```

</details>

#### 缺口

- Host外围ACL/全部设置泄漏面/QQ与设备权限、真实文件清理和URL泄露风险未测。
  **影响**：只可私人可信Host低敏朗读，不能外推公网/多租户安全。
  **进一步探讨**：先核路由鉴权、关闭UI后的请求、URL有效期/文件清理与退出，不复用管理token。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用要如何限定，什么方向比继续加provider更值得验证？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

建议受限试用：有听回复或导出短音频需求的私人DSH用户，先用公开短句手动比较浏览器语音与一个已配置云端，关闭自动播报/QQ/设备联动，核目标Host版本/权限、音色/实际停止和历史重开。相对原生浏览器语音，本包增流式云端音色/可带走WAV及状态/取消管理；正确率、无障碍效果、延迟和总成本未知，不能把声音数量当工作流/触达创新。

首次Key/Host配置，持续按provider文本/请求/音色政策费用、音频存储/带宽和人审发音，失败重复请求/回退/IDB不可写/URL或磁盘残留清理，退出Key与音频留存的现金/工时未知不填0。字数/超时/buffer/条数上限不是总费用封顶，停止不退款；浏览器在线声音也可能外发。未知先停自动/云端、核费用与文件，回普通Web Speech或人工文本。

独立假设：将已请求、已收音频、已实际播放、已持久四种状态与数据去向/费用风险清楚区分，附取消/历史失败可核收据，可能比继续加音色更减少“听到了就已保存/停止就没计费”的误判。先比现有memory/error提示+人工计划，固定阻播、取消晚到、IDB失败、下载URL泄露/过期与服务已收费返回未知样例，测误判、恢复人时/费用；若现有提示足够或新负担高即否定，不算当前能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/types/settings.ts:147-176](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/types/settings.ts#L147-L176)

当前默认/限制。

<details>
<summary>查看原文（30行）</summary>

```text
  enabled: true,
  apiKey: '',
  baseURL: 'https://api.xiaomimimo.com/v1',
  model: 'mimo-v2.5-tts',
  localSpeechMode: 'auto',
  localVoiceURI: '',
  localVoiceEngine: 'browser',
  mossEnabled: false,
  mossBaseURL: DEFAULT_MOSS_BASE_URL,
  mossVoice: '',
  mossVoiceName: '',
  voice: '冰糖',
  voiceDesignPrompt: '青年女性,声线清亮、亲切自然,吐字清楚,语速适中,情绪温柔克制。',
  voiceDesignCustomPrompt: '青年女性,声线清亮、亲切自然,吐字清楚,语速适中,情绪温柔克制。',
  presetStylePrompt: '',
  format: 'pcm',
  voiceDesignPlaybackMode: 'complete',
  readScope: 'smart',
  autoPlay: false,
  voiceInputCompatibility: true,
  inputAvoidance: false,
  importantAnnouncementsFirst: false,
  instruction: '',
  maxTextLength: 12000,
  requestTimeoutMs: 120000,
  maxMp3AudioBytes: DEFAULT_MAX_MP3_AUDIO_BYTES,
  maxWavAudioBytes: DEFAULT_MAX_WAV_AUDIO_BYTES,
  maxPausedPcmBytes: DEFAULT_MAX_PAUSED_PCM_BYTES,
  voiceVolume: 1,
  voiceRate: 1,
```

</details>

**依据 2 · 源码核查**：[src/client/history/audio-history.ts:99-112](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/history/audio-history.ts#L99-L112)

现有写失败memory状态。

<details>
<summary>查看原文（14行）</summary>

```text
      update()
      if (!this.storageLoaded) return
      try {
        await this.storage.replace(this.view.entries)
        if (this.view.status === 'memory') this.publish({ ...this.view, status: 'ready' })
      }
      catch { this.publish({ ...this.view, status: 'memory' }) }
    })
    return this.chain
  }

  private publish(view: AudioHistoryView): void {
    this.view = view
    for (const listener of this.listeners) listener()
```

</details>

**依据 3 · 源码核查**：[src/host/audio-downloads.ts:13-33](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/host/audio-downloads.ts#L13-L33)

当前下载寿命/Map。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/client/playback/pcm-audio-queue.ts:104-136](https://github.com/ppy-web/dsh-plugin-xiaomi-mimo-tts/blob/b6ab1157d97cbff72d18c7bb16df8fe46ed14f1d/src/client/playback/pcm-audio-queue.ts#L104-L136)

实际播放排程与结束。

<details>
<summary>查看原文（33行）</summary>

```text
    const context = this.getContext()
    if (context.state !== 'running' && !this.userPaused) {
      await context.resume()
    }
    if (revision !== this.revision) return

    const sampleCount = Math.floor(bytes.byteLength / 2)
    const buffer = context.createBuffer(1, sampleCount, 24000)
    const channel = buffer.getChannelData(0)
    const pcm = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    for (let index = 0; index < sampleCount; index += 1) channel[index] = pcm.getInt16(index * 2, true) / 0x8000

    const source = context.createBufferSource()
    source.buffer = buffer
    applyPcmVoiceRate(source, this.playbackRate)
    source.connect(this.getGain(context))
    const startAt = Math.max(context.currentTime + 0.03, this.scheduledAt)
    this.scheduledAt = startAt + pcmPlaybackDuration(buffer.duration, this.playbackRate)
    if (this.userPaused && this.queuedBytes + bytes.byteLength > this.maxPausedPcmBytes) throw new Error('pcm-pause-buffer-limit')
    this.sources.add(source)
    this.sourceBytes.set(source, bytes.byteLength)
    this.queuedBytes += bytes.byteLength
    source.addEventListener('ended', () => {
      if (revision !== this.revision) return
      this.sources.delete(source)
      this.queuedBytes -= this.sourceBytes.get(source) ?? 0
      this.sourceBytes.delete(source)
      if (this.sources.size === 0) this.setBusy(false)
    }, { once: true })
    try {
      source.start(startAt)
    } catch (error) {
      this.sources.delete(source)
```

</details>

#### 缺口

- 真实需求/听感/延迟/可达性、全部费用/恢复和四状态收据价值未测。
  **影响**：试用不等生产/自动外部联动可采用。
  **进一步探讨**：同一公开文本对照浏览器语音，恢复/隐私/费用成本抵消声音优势即退出。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
