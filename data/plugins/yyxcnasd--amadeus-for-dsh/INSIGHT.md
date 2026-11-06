# Amadeus for DSH

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ffc2872](https://github.com/yyxcnasd/amadeus-for-dsh/tree/ffc28723fea81bf7efaa43e6063dd12f92edf27e)

<!-- BEGIN META -->
[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yyxcnasd/amadeus-for-dsh)
<!-- END META -->

> **功能**：DSH角色Live2D面板，组合日中聊天、外部语音、主动通知与共享持久记忆。

> **亮点**：[Q02](#research-q02)JP/CN流/情绪/语音队列接线；[Q03](#research-q03)常驻worker/词边界；[Q04](#research-q04)共享角色记忆。

> **主要限制**：[Q02](#research-q02)超时非取消/可能重复；[Q04](#research-q04)RPC token/client不匹配、共享config回传及提权/落盘丢摘要。

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
  - [Q01 · 角色助手的真实边界与依赖是什么？](#detail-section-11)
  - [Q02 · 面板消息如何真实调用模型并显示，超时是实际取消吗？](#detail-section-12)
  - [Q03 · 语音真实发往哪里，进程/音频结果怎样结束？](#detail-section-13)
  - [Q04 · 记忆、配置和路由的身份及持久边界是什么？](#detail-section-14)
  - [Q05 · 何时值得采用，下一方向怎样与现有方案比较？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Amadeus-for-DSH2.4.6是MIT的DSH原生角色界面/语音聊天bundle，package导出host.mjs和client.js并patch加载；面向明确喜欢角色Live2D/日语陪伴交互的人，基线是普通聊天UI+既有角色提示/语音播放组合，而非科研、心理支持或生产任务Agent。版权/角色素材授权、真实体验和日语质量未全核，MIT包代码不证明全部素材可再分发。

Host必须fs/webServer/subprocess，timer也声明注入；聊天可用独立兼容API Key或Host llm，Edge需Python+edge_tts，其他TTS/语音识别依赖服务/网络/Key。配置/记忆/临时音频在DSH_HOME/amadeus，非会话工作区内独立存储。默认voice/chat/call/idleChat开、persona注入关，安装不等仅静态皮肤；无独立Agent工具循环，主要模型聊天/语音/通知，副作用需明确审。

普通角色提示+聊天UI/现有语音与手工备份，不以角色体验替生产Agent效果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 角色聊天 | JP/CN流 | 非事实/任务验收 |
| 语音 | 真合成/播放 | 外发/浏览器阻播 |
| 记忆 | JSON/facts/摘要 | 共享/失败可丢失 |
| 设置 | RPC/config | client token未匹配 |

**流程与依赖**

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| DSH fs/web/subprocess/timer | 必需 | Host路径 | 外围权限未知 |
| 模型/Key或Host llm | 聊天需 | 文本/摘要/facts | 费用/重复请求 |
| Python/edge_tts/curl | 对应语音需 | 真音频/worker | 外部服务未审 |
| 浏览器mic/audio/资产 | 对应UI需 | 输入/输出 | 许可/播放未测 |

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 边界 | 核私有Host/RPC/Key去向 | 不用真实秘密 |
| 配置 | 关主动/核语音目的地 | 控后台请求 |
| 样例 | 公开短句/读回文件 | 不凭done |
| 退出 | 停worker/备份清临时凭据 | 无全请求撤回保证 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型/语音/Host未知 | Python/权限/资产核对 | 未安装 |
| 持续 | 聊天/主动/摘要/语音未知 | 管记忆/费用 | 无硬总额 |
| 故障 | 重复请求/临时音频未知 | 核晚到/丢摘要 | timeout非取消 |
| 退出 | 数据/Key留存未知 | 备份/清理 | 卸载非自动抹除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 体验 | 真模型/音频接线 | 满意度/自然度 |
| 记忆 | 真写/模型提取 | 正确/完整落盘 |
| 任务提示 | 事件通知 | 真任务验收 |

> **思考**：[Q02](#research-q02)超时非取消/可能重复；[Q04](#research-q04)RPC token/client不匹配、共享config回传及提权/落盘丢摘要。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)JP/CN流/情绪/语音队列接线；[Q03](#research-q03)常驻worker/词边界；[Q04](#research-q04)共享角色记忆。

[Q02](#research-q02)超时不是终止；[Q03](#research-q03)真实进程/语音完成边界；[Q04](#research-q04)提权与持久失败不可被界面掩盖。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)超时非取消/可能重复；[Q04](#research-q04)RPC token/client不匹配、共享config回传及提权/落盘丢摘要。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)观察；先核私人路由/RPC/数据去向，费用/恢复不明回普通聊天与备份。

Host必须fs/webServer/subprocess，timer也声明注入；聊天可用独立兼容API Key或Host llm，Edge需Python+edge_tts，其他TTS/语音识别依赖服务/网络/Key。配置/记忆/临时音频在DSH_HOME/amadeus，非会话工作区内独立存储。默认voice/chat/call/idleChat开、persona注入关，安装不等仅静态皮肤；无独立Agent工具循环，主要模型聊天/语音/通知，副作用需明确审。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

有真实模型/语音/记忆接线，但静态RPC和隐私/恢复边界显著，观察。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、cordis.patch.yml、host.mjs、package.json、plugin/web/panel.js、tools/llm_chat.py、tools/mem_save.py、tools/stt.py、tools/tts_emote.py、tools/tts_server.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：新项source；核打包host/client与面板、模型HTTP/Host流/回退、语音worker/Edge/代表Quest与STT、记忆保存/fs+Python/摘要失败、RPC token/共享路由/config与卸载；未全审资产/所有providers/辅助安装脚本/Host外围。
- 下一步：仅只读固定Git；Python同提交原件绑定source_paths，未运行安装目标/测试/语音/模型/Host/账户/浏览器，无独立效果/安全/费用验证。

**分析版本**

- **仓库**：[yyxcnasd/amadeus-for-dsh](https://github.com/yyxcnasd/amadeus-for-dsh)
- **版本号**：2.4.6（[固定提交 ffc2872](https://github.com/yyxcnasd/amadeus-for-dsh/tree/ffc28723fea81bf7efaa43e6063dd12f92edf27e)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)先比较关主动+手工备份，再验去向/费用/落盘状态与真实取消的用户控制。

仅只读固定Git；Python同提交原件绑定source_paths，未运行安装目标/测试/语音/模型/Host/账户/浏览器，无独立效果/安全/费用验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 5135 | 4684 | 288 | — |
| .mjs | source | 4 | 2775 | 2458 | 210 | — |
| .md | source | 7 | 380 | — | — | 4603 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/yyxcnasd/amadeus-for-dsh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核角色UI→真实聊天/语音/记忆，区分演示体验与任务效果，检查身份/外发/取消/持久副作用及独立采用方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 角色助手的真实边界与依赖是什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

Amadeus-for-DSH2.4.6是MIT的DSH原生角色界面/语音聊天bundle，package导出host.mjs和client.js并patch加载；面向明确喜欢角色Live2D/日语陪伴交互的人，基线是普通聊天UI+既有角色提示/语音播放组合，而非科研、心理支持或生产任务Agent。版权/角色素材授权、真实体验和日语质量未全核，MIT包代码不证明全部素材可再分发。

Host必须fs/webServer/subprocess，timer也声明注入；聊天可用独立兼容API Key或Host llm，Edge需Python+edge_tts，其他TTS/语音识别依赖服务/网络/Key。配置/记忆/临时音频在DSH_HOME/amadeus，非会话工作区内独立存储。默认voice/chat/call/idleChat开、persona注入关，安装不等仅静态皮肤；无独立Agent工具循环，主要模型聊天/语音/通知，副作用需明确审。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-13](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/package.json#L1-L13)

当前版本/实际导出。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "amadeus-for-dsh",
  "version": "2.4.6",
  "description": "Steins;Gate 0 Amadeus (Makise Kurisu) 助手：Live2D 翻盖手机 + 日语语音 + 长期记忆，DeepSeek Harness 插件",
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./host.mjs",
    "./index.js": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "files": [
```

</details>

**依据 2 · 源码核查**：[package.json:35-47](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/package.json#L35-L47)

原生bundle/client注入。

<details>
<summary>查看原文（13行）</summary>

```text
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-theme",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar-right"
      ]
    }
  },
  "keywords": [
```

</details>

**依据 3 · 源码核查**：[package.json:56-60](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/package.json#L56-L60)

代码MIT许可。

```text
  "devDependencies": {
    "esbuild": "^0.25.12"
  },
  "license": "MIT"
}
```

**依据 4 · 源码核查**：[cordis.patch.yml:1-6](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/cordis.patch.yml#L1-L6)

真实Host加载patch。

```text
# Amadeus（牧濑红莉栖）bundle 层。
# dsh plugin add 安装本包后会自动把它加入该 profile 的 dsh.profile.bundles，
# 本补丁层向组合树插入 amadeus 加载行（由 dsh 加载器按 name 解析包）。
- insert:
    - id: amadeus
      name: amadeus-for-dsh
```

**依据 5 · 源码核查**：[host.mjs:13-53](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L13-L53)

必需服务/真实数据与Python路径。

<details>
<summary>查看原文（41行）</summary>

```text
export const inject = ['timer', 'fs', 'webServer', 'subprocess']
export function apply(ctx) {
    const fs = ctx.get('fs')
    const webServer = ctx.get('webServer')
    const subprocess = ctx.get('subprocess')
    const systemPrompt = ctx.get('systemPrompt')
    const sandboxPolicy = ctx.get('sandboxPolicy')
    if (fs === undefined || webServer === undefined || subprocess === undefined) {
      console.error('[amadeus] 缺少必需服务: fs/webServer/subprocess')
      return
    }

    // ---------------- 常量 ----------------
    // 路径说明：静态安装后 ROOT = 插件安装目录（tools/build_static.mjs 会整体重写本段，
    // 用 import.meta.url 推导）。开发/动态模式可用环境变量 AMADEUS_ROOT 覆盖。
    // 运行数据（配置/记忆/临时文件）放在 DSH 数据目录 %DSH_HOME%/amadeus，重装插件不丢失。
        // 静态版路径（由 tools/build_static.mjs 生成，勿手改）
    const MODULE_DIR = dirname(fileURLToPath(import.meta.url))
    const ROOT = (typeof process !== 'undefined' && process.env && process.env.AMADEUS_ROOT && process.env.AMADEUS_ROOT.length > 0) ? process.env.AMADEUS_ROOT : MODULE_DIR
    const DATA_DIR = (() => {
      const env = (typeof process !== 'undefined' && process.env) ? process.env : {}
      // DSH_HOME 优先；其次按平台取家目录（Windows: USERPROFILE，POSIX: HOME），
      // 避免 Linux 下退化为「当前工作目录/amadeus」导致数据随启动目录漂移。
      let dshHome = env.DSH_HOME || ''
      if (!dshHome) {
        const home = env.USERPROFILE || env.HOME || ''
        if (home) dshHome = home + '/.dsh'
      }
      return (dshHome || (typeof process !== 'undefined' && process.cwd ? process.cwd() : '.')) + '/amadeus'
    })()
    const CONFIG_PATH = DATA_DIR + '/config/amadeus.json'
    const MANIFEST_PATH = ROOT + '/config/manifest.json'
    const PERSONA_PATH = ROOT + '/persona/prompt.txt'
    const CHAT_PERSONA_PATH = ROOT + '/persona/chat-persona.txt'
    const MEMORY_PATH = DATA_DIR + '/memory/amadeus-memory.json'
    const TTS_EMOTE_PY = ROOT + '/tools/tts_emote.py'
    const STT_PY = ROOT + '/tools/stt.py'
    const LLM_CHAT_PY = ROOT + '/tools/llm_chat.py'
    const MEM_SAVE_PY = ROOT + '/tools/mem_save.py'
    const TTS_SERVER_PY = ROOT + '/tools/tts_server.py'
    const TMP_DIR = DATA_DIR + '/tmp'
```

</details>

**依据 6 · 源码核查**：[host.mjs:107-150](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L107-L150)

真实语音/聊天/来电/空闲/人格默认。

<details>
<summary>查看原文（44行）</summary>

```text
    const DEFAULT_CONFIG = {
      voiceOn: true,
      personaOn: false,
      themeOn: true,
      chatOn: true,
      callOn: true,
      voiceName: 'ja-JP-NanamiNeural',
      rate: '+0%',
      pitch: '+0Hz',
      provider: 'edge',
      questSpeaker: 8,
      maxCharsPerTurn: 1400,
      emotionIntensity: 1.0,
      fallbackToQuest: false,
      voiceStability: true,
      sttProvider: 'auto',
      sttApiUrl: '',
      sttApiKey: '',
      sttModel: 'whisper-1',
      aquaUrl: 'http://127.0.0.1:8000',
      aquaVoice: '',
      aquaRefAudio: '',
      aquaPromptText: '',
      aquaTextLanguage: '日文',
      aquaPromptLanguage: '日文',
      aquaPreset: 'fast',
      aquaApiKey: '',
      aquaEmotionVoices: {},
      voicevoxUrl: 'http://127.0.0.1:50021',
      voicevoxSpeaker: 8,
      voicevoxEmotionSpeakers: {},
      openaiTtsUrl: '',
      openaiTtsApiKey: '',
      openaiTtsModel: 'tts-1',
      openaiTtsVoice: 'nova',
      openaiTtsSpeed: 1,
      chatApiKey: '',
      chatBaseUrl: 'https://api.deepseek.com/v1',
      chatModel: 'deepseek-chat',
      callIntervalMs: 36000000,
      idleChatOn: true,
      idleChatMs: 1200000,
    }

```

</details>

**依据 7 · 作者声明**：[README.md:1-5](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/README.md#L1-L5)

作者角色/语音/记忆定位。

```text
# AMADEUS for DSH

《命运石之门 0》Amadeus —— 牧濑红莉栖（Makise Kurisu）智能助手，DeepSeek Harness 插件。

红发翻盖手机里的她：**Live2D 立绘 + 日语语音 + 长期记忆 + 主动来电 + AI 聊天**。
```

#### 缺口

- Host版本、全部语音/Live2D资产授权/体验、模型供应商/需求未验证。
  **影响**：不把宣传“助手/长期记忆”当可信任务执行或全部素材许可。
  **进一步探讨**：只在私人低敏环境核来源/权限与一份固定文本体验；需要素材商业分发另核授权。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 面板消息如何真实调用模型并显示，超时是实际取消吗？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

面板GET /chat?text截到400字，收到chatId后每140ms轮询chatstream；Host限500字、全局chatBusy串行，异步amadeusChat→模型→解析JP/CN情绪→历史入内存并触发保存，stream部分语句可先入语音队列。它是直接模型文本生成，不是接Host Agent工具执行循环；返回chatId只是接受，done也非事实正确或记忆已落盘。

独立Key优先fetch /chat/completions，Bearer+完整persona/最近10条history/summary/facts出站；无Key选Host默认模型或首个可用provider/model再llm.stream。直接fetch失败/超时会回退Python读含Key请求JSON再urllib调用并写结果。Promise.race超时没有AbortController/signal传给fetch/llm，外层超时把chatBusy释放但旧操作仍可能继续语音/历史/费用；不能声称超时已取消、重试无重复生成或稳定全局串行。Python也有候选地址重试，服务已受理而返回未知时重复付费未排除。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/web/panel.js:1588-1645](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/plugin/web/panel.js#L1588-L1645)

面板真实GET/轮询done/error/missing。

<details>
<summary>查看原文（58行）</summary>

```text
    var text = chatInput ? chatInput.value.trim() : ''
    if (text.length === 0 || chatBusy) return
    if (cfg.chatOn === false) { updateChip('⚠ chat off', true); return }
    lastInteractionAt = Date.now()
    setChatBusy(true)
    chatInput.value = ''
    addHistory({ role: 'user', content: text })
    try {
      var resp = await fetch('/amadeus/chat?text=' + encodeURIComponent(text.slice(0, 400)), { cache: 'no-store' })
      var data = await resp.json().catch(function () { return null })
      if (!resp.ok || !(data && data.chatId)) {
        var em = data && data.error ? data.error : ('http ' + resp.status)
        report('chat fail: ' + em)
        updateChip('⚠ ' + em.slice(0, 24), true)
        if (historyEl) {
          var err = makeAmadeusMsg()
          err.bubble.textContent = '⚠ ' + em
          err.bubble.style.color = '#ffb4ab'
          err.bubble.style.border = '1px solid rgba(255,111,97,0.5)'
          addTimeTo(err.bubble, Date.now())
          historyEl.appendChild(err.wrap)
          historyEl.scrollTop = historyEl.scrollHeight
        }
        setChatBusy(false)
        return
      }
      var m2 = makeAmadeusMsg()
      var body = document.createElement('span')
      m2.bubble.appendChild(body)
      addTimeTo(m2.bubble, Date.now())
      historyEl.appendChild(m2.wrap)
      var lastShown = ''
      var finalSt = await new Promise(function (resolve) {
        var timer = window.setInterval(function () {
          fetch('/amadeus/chatstream?chatId=' + data.chatId, { cache: 'no-store' })
            .then(function (r2) { return r2.json() })
            .then(function (st) {
              if (!st) return
              if (st.status === 'done') {
                body.textContent = st.cn || st.jp || ''
                window.clearInterval(timer)
                resolve(st)
                return
              }
              if (st.status === 'error') {
                body.textContent = '⚠ ' + String(st.error || 'error').slice(0, 60)
                window.clearInterval(timer)
                resolve(null)
                return
              }
              if (st.status === 'missing') {
                window.clearInterval(timer)
                resolve(null)
                return
              }
              var partial = ''
              var cnM = (st.raw || '').match(/CN[:：]\s*([\s\S]*)/)
              var jpM = (st.raw || '').match(/JP[:：]\s*([\s\S]*)/)
```

</details>

**依据 2 · 源码核查**：[host.mjs:1628-1679](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1628-L1679)

真实chatBusy/chatId/超时/状态写。

<details>
<summary>查看原文（52行）</summary>

```text
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: '/amadeus/chat',
      handler: async (req, res) => {
        noteHost(req)
        try {
          if (config.chatOn !== true) { sendJson(res, 403, { error: 'chat disabled' }); return }
          const q = parseQuery(req.url)
          const text = typeof q.text === 'string' ? q.text.trim() : ''
          if (text.length === 0) { sendJson(res, 400, { error: 'missing text' }); return }
          if (text.length > 500) { sendJson(res, 400, { error: 'text too long' }); return }
          lastInteractionAt = Date.now()
          if (chatBusy) { sendJson(res, 429, { error: 'busy' }); return }
          chatBusy = true
          const chatId = ++chatSeq
          chatStreams.set(chatId, { status: 'running', raw: '', jp: '', cn: '', emotion: 'neutral', at: Date.now() })
          // 清理旧流
          const nowMs = Date.now()
          for (const [k, v] of chatStreams) {
            if (k !== chatId && nowMs - v.at > 300000) chatStreams.delete(k)
          }
          ;(async () => {
            try {
              const result = await Promise.race([
                amadeusChat(text, (delta) => {
                  const s = chatStreams.get(chatId)
                  if (s && typeof delta === 'string') s.raw += delta
                }),
                ctx.timeout(CHAT_TIMEOUT_MS).then(() => { throw new Error('llm timeout') }),
              ])
              const s = chatStreams.get(chatId)
              if (s) {
                s.status = 'done'
                s.jp = result.jp
                s.cn = result.cn
                s.emotion = result.emotion
                s.streamed = result._streamed === true
              }
            } catch (e) {
              const s = chatStreams.get(chatId)
              if (s) {
                s.status = 'error'
                s.error = e && e.message ? e.message : String(e)
              }
            } finally {
              chatBusy = false
            }
          })()
          sendJson(res, 200, { ok: true, chatId })
        } catch (e) {
          chatBusy = false
          sendJson(res, 502, { error: e && e.message ? e.message : String(e) })
```

</details>

**依据 3 · 源码核查**：[host.mjs:1239-1248](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1239-L1248)

persona/summary/facts/history进入模型。

<details>
<summary>查看原文（10行）</summary>

```text
    async function amadeusChat(text, onDelta) {
      const persona = await readChatPersona()
      const facts = factsText()
      const summary = memory.summary ? '過去の会話の要約：\n' + memory.summary : ''
      const system = persona + (summary ? '\n\n' + summary : '') + (facts ? '\n\n' + facts : '') + CHAT_FORMAT_RULES
      const history = memory.history.slice(-10).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.role === 'user' ? m.content : ('【' + (m.emotion || 'neutral') + '】\nJP: ' + m.jp + '\nCN: ' + m.cn),
      }))
      const messages = history.concat([{ role: 'user', content: text }])
```

</details>

**依据 4 · 源码核查**：[host.mjs:1068-1093](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1068-L1093)

真实外部fetch/Bearer/正文，无signal。

<details>
<summary>查看原文（26行）</summary>

```text
    async function aiCompleteHttp(system, messages, maxTokens, onDelta) {
      // 直连 OpenAI 兼容 API，stream=true：不用再起 Python 子进程、不用等整段生成完，
      // 首字延迟和整句延迟都明显更低，同时 onDelta 让日语句子边生成边朗读。
      const base = String(config.chatBaseUrl || 'https://api.deepseek.com/v1').replace(/\/+$/, '')
      const url = base.endsWith('/chat/completions') ? base : base + '/chat/completions'
      const payload = {
        model: config.chatModel || 'deepseek-chat',
        messages: [{ role: 'system', content: system }].concat(messages),
        max_tokens: maxTokens || 300,
        temperature: 0.9,
        stream: true,
      }
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + config.chatApiKey,
          'User-Agent': 'Amadeus-DSH/1.0',
        },
        body: JSON.stringify(payload),
      })
      if (!resp.ok) {
        let detail = ''
        try { detail = String((await resp.text()).slice(0, 300)) } catch (e) { /* ignore */ }
        throw new Error('llm http ' + resp.status + ' ' + detail)
      }
```

</details>

**依据 5 · 源码核查**：[host.mjs:1123-1165](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1123-L1165)

超时后Python回退与Key请求文件。

<details>
<summary>查看原文（43行）</summary>

```text

    async function aiComplete(system, messages, maxTokens, onDelta) {
      const useApi = typeof config.chatApiKey === 'string' && config.chatApiKey.length > 0
      if (useApi) {
        if (typeof fetch === 'function') {
          try {
            return await Promise.race([
              aiCompleteHttp(system, messages, maxTokens, onDelta),
              ctx.timeout(CHAT_TIMEOUT_MS).then(() => { throw new Error('llm timeout') }),
            ])
          } catch (e) {
            // 直连失败时保留 Python 子进程兜底，保证有 key 就能用
            console.error('[amadeus] llm http fallback:', e && e.message ? e.message : String(e))
          }
        }
        const slot = nextSlot()
        const reqPath = TMP_DIR + '/chat-req-' + slot + '.json'
        const outPath = TMP_DIR + '/chat-out-' + slot + '.json'
        const req = {
          baseUrl: config.chatBaseUrl || 'https://api.deepseek.com/v1',
          apiKey: config.chatApiKey,
          model: config.chatModel || 'deepseek-chat',
          system,
          messages,
          maxTokens: maxTokens || 300,
          temperature: 0.9,
        }
        await writeTextSafe(reqPath, JSON.stringify(req))
        await runPython([LLM_CHAT_PY, reqPath, outPath], 'llm_chat')
        const outText = await readTextFile(outPath)
        if (outText === null) throw new Error('llm_chat: no output')
        const parsed = JSON.parse(outText)
        if (!parsed.ok) throw new Error('llm_chat: ' + (parsed.error || 'unknown'))
        return parsed.content
      }
      const llm = ctx.get('llm')
      if (llm === undefined) throw new Error('llm service unavailable')
      const adm = ctx.get('agentDefaultModel')
      let provider = null
      let model = null
      try {
        const sel = adm ? adm.currentSelection() : undefined
        if (sel && typeof sel.provider === 'string' && typeof sel.model === 'string') {
```

</details>

**依据 6 · 源码核查**：[tools/llm_chat.py:58-88](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/tools/llm_chat.py#L58-L88)

真实请求Key/模型/urllib候选与结果写。

<details>
<summary>查看原文（31行）</summary>

```text
def main():
    infile, outfile = sys.argv[1], sys.argv[2]
    with open(infile, 'r', encoding='utf-8') as f:
        req = json.load(f)
    body = json.dumps({
        'model': req.get('model') or 'deepseek-chat',
        'messages': [{'role': 'system', 'content': req.get('system') or ''}] + list(req.get('messages') or []),
        'max_tokens': int(req.get('maxTokens') or 300),
        'temperature': float(req.get('temperature') or 0.9),
        'stream': False,
    }).encode('utf-8')
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (req.get('apiKey') or ''),
        'User-Agent': 'Amadeus-DSH/1.0',
    }
    candidates = build_candidates(req.get('baseUrl'))
    last_err = None
    content = None
    for url in candidates:
        try:
            content = call_once(url, body, headers)
            break
        except Exception as e:
            last_err = e
    if content is None:
        with open(outfile, 'w', encoding='utf-8') as f:
            json.dump({'ok': False, 'error': str(last_err)}, f, ensure_ascii=False)
        return
    with open(outfile, 'w', encoding='utf-8') as f:
        json.dump({'ok': True, 'content': content}, f, ensure_ascii=False)
```

</details>

**依据 7 · 源码核查**：[host.mjs:1166-1218](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1166-L1218)

Host默认/首provider模型与llm.stream。

<details>
<summary>查看原文（53行）</summary>

```text
          provider = sel.provider
          model = sel.model
        }
      } catch (e) { /* ignore */ }
      if (provider === null || model === null) {
        try {
          const providers = llm.listProviders()
          if (Array.isArray(providers) && providers.length > 0) {
            provider = providers[0].provider || providers[0].id
            const models = await llm.listModels(provider)
            if (Array.isArray(models) && models.length > 0) model = models[0].model || models[0].id
          }
        } catch (e) { /* ignore */ }
      }
      if (provider === null || model === null) throw new Error('no model available')
      // DSH 0.2 起消息来源类型固定为 user/model/tool/system-prompt：
      // user 轮用 RequestUserInput（无需 id/source），assistant 轮用 model 来源。
      const llmMessages = messages.map((m) => {
        if (m.role === 'assistant') {
          return {
            id: 'amad-' + Math.random().toString(36).slice(2, 10),
            role: 'assistant',
            content: [{ type: 'text', text: m.content }],
            source: { kind: 'model', provider, model },
          }
        }
        return { role: 'user', content: [{ type: 'text', text: m.content }] }
      })
      const options = {
        provider,
        model,
        messages: llmMessages,
        system,
        temperature: 0.9,
        maxTokens: maxTokens || 300,
      }
      let out = ''
      for await (const chunk of llm.stream(options)) {
        if (chunk === null || typeof chunk !== 'object') continue
        if (chunk.type === 'text-delta' && typeof chunk.text === 'string') {
          out += chunk.text
          if (onDelta) { try { onDelta(chunk.text) } catch (e) { /* ignore */ } }
        }
        if (chunk.type === 'finish') break
      }
      return out
    }

    function parseStructured(raw) {
      const text = String(raw || '').trim()
      let emotion = 'neutral'
      let jp = ''
      let cn = ''
```

</details>

**依据 8 · 源码核查**：[host.mjs:1290-1317](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1290-L1317)

真实结果解析/语音与历史写/维护调用。

<details>
<summary>查看原文（28行）</summary>

```text
      const raw = await aiComplete(system, messages, 360, wrappedDelta)
      const parsed = parseStructured(raw)
      // 流式模式下，把最后可能未推送的剩余日语句子补上
      if (streamedSegments) {
        const finalSentences = splitSentences(parsed.jp)
        for (let i = pushedJpSentences; i < finalSentences.length && pushedJpSentences < 3; i++) {
          const rawS = finalSentences[i]
          if (!rawS || rawS.trim().length === 0) continue
          const segTag = rawS.match(/^【(happy|excited|elated|sad|angry|furious|question|soft|neutral)】/)
          const segEmotion = segTag ? segTag[1] : (parsed.emotion || streamEmotion)
          const s = segTag ? rawS.slice(segTag[0].length).trim() : rawS
          if (!s) continue
          // 同样逐句立即推送，避免最后剩余句子被合并延迟
          pushUtterances([s], false, segEmotion || emotionFor(s) || parsed.emotion || streamEmotion)
          firstSegmentPushed = true
          pushedJpSentences++
        }
        flushBatch(emotionFor(pendingBatch) || parsed.emotion || streamEmotion || 'neutral')
        parsed._streamed = true
      }
      memory.history.push({ role: 'user', content: text, t: Date.now() })
      lastInteractionAt = Date.now()
      memory.history.push({ role: 'assistant', jp: parsed.jp, cn: parsed.cn, emotion: parsed.emotion, t: Date.now() })
      scheduleSaveMemory()
      maybeMaintainFacts()
      maybeCompactHistory()
      return parsed
    }
```

</details>

#### 缺口

- 实际网络超时/重复计费、兼容流格式与结果正确率未测。
  **影响**：不能把响应超时/聊天done当已取消或任务验收。
  **进一步探讨**：固定无敏感文本模拟延迟/断流，核请求次数、晚到历史和费用，超时先对账不盲重发。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 语音真实发往哪里，进程/音频结果怎样结束？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

Edge路径先懒启Python常驻worker，Host用curl向其loopback /synth送文本/输出路径，失败退逐句Python；Python edge_tts.Communicate实际stream音频写.mp3并记录词边界，口型材料来自时间戳，不是语音自然度/对齐独立测评。worker只绑127.0.0.1，但接收out字段直接写，所核worker无令牌/目录归一；不可当本机不可信进程的安全隔离。

语音provider可选quest/voicevox/openai/aqua；默认Edge失败不会自动公共fallback，只有显式fallbackToQuest且声线稳定关才可能切Quest，Quest实际将文本放公共URL并curl下载。不应把作者“免费”当长期费用/可用保证，外部edge服务与依赖实现未审。STT上传音频至Host先base64临存，Python读取并multipart+B​​earer发兼容转录API，API Key还在进程argv；浏览器mic是显式采集，音频/文本/凭据和临时文件须按敏感数据管。

runPython/runCurl等待done race，超时terminate对应子进程，但不证明所有远端已停止；浏览器audio.play有onended/onerror和自动播放拒绝提示，Host合成成功也不等用户已听到。启动会预热worker，卸载仅显式teardown常驻worker，不能据此保证所有已发请求和临时音频清空。本轮未运行/安装，不依据README旧“自动pip”推当前脚本动态安装已成立。

#### 证据与依据

**依据 1 · 源码核查**：[host.mjs:681-696](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L681-L696)

真实worker spawn。

<details>
<summary>查看原文（16行）</summary>

```text
    async function ensureTtsWorker() {
      if (ttsWorker !== null) return ttsWorker.disabled === true ? null : ttsWorker.port
      if (config.provider !== 'edge' && config.provider !== 'auto') return null
      let proc
      try {
        const py = await resolvePython()
        proc = subprocess.spawn({
          // cwd 用数据目录而非安装目录：Windows 上常驻进程的 cwd 会锁住安装目录，
          // 导致下次重装时 Remove-Item 失败。worker 全部使用绝对路径，不依赖 cwd。
          argv: [py, TTS_SERVER_PY, '--root', TMP_DIR],
          cwd: TMP_DIR,
          stdio: { stdin: 'ignore', stdout: 'pipe', stderr: { maxBytes: 8192 } },
          graceMs: 5000,
        })
        const port = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('tts worker ready timeout')), 10000)
```

</details>

**依据 2 · 源码核查**：[host.mjs:742-783](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L742-L783)

真实curl worker→逐句Python回退→读音频/词边界。

<details>
<summary>查看原文（42行）</summary>

```text
    async function synthesizeEdge(text, voice, rate, pitch, emotion) {
      ttsFileSeq = (ttsFileSeq + 1) % 8
      const slot = nextSlot()
      const intensity = typeof config.emotionIntensity === 'number' ? config.emotionIntensity : 1
      // 1) 常驻 worker 优先
      try {
        const port = await ensureTtsWorker()
        if (port !== null) {
          const outPath = TMP_DIR + '/w-' + ttsFileSeq + '-' + slot + '-' + Date.now() + '.mp3'
          const reqPath = TMP_DIR + '/wreq-' + ttsFileSeq + '-' + slot + '.json'
          const respPath = TMP_DIR + '/wresp-' + ttsFileSeq + '-' + slot + '.json'
          await writeTextSafe(reqPath, JSON.stringify({
            text, voice: voice || 'ja-JP-NanamiNeural', emotion,
            rate: rate || '+0%', pitch: pitch || '+0Hz',
            intensity, out: outPath,
          }))
          await runCurl(['-sS', '--max-time', '45', '-X', 'POST', '-H', 'Content-Type: application/json', '--data-binary', '@' + reqPath, 'http://127.0.0.1:' + port + '/synth', '-o', respPath])
          const j = await readTextFile(respPath)
          const parsed = j ? JSON.parse(j) : null
          if (!parsed || parsed.ok !== true) throw new Error('tts worker: ' + (parsed && parsed.error ? parsed.error : 'no response'))
          const bytes = await readFileBytes(parsed.out, MAX_TTS_BYTES)
          if (bytes === null || bytes.length < 200) throw new Error('edge: empty audio')
          let words = []
          if (Array.isArray(parsed.words)) words = parsed.words.filter((w) => w && typeof w.o === 'number' && typeof w.d === 'number')
          return { bytes, words, mime: 'audio/mpeg' }
        }
      } catch (e) {
        console.warn('[amadeus] worker 合成失败，回退逐句 python:', e && e.message ? e.message : String(e))
      }
      // 2) 回退：逐句 python 子进程
      const outPath = TMP_DIR + '/tts-' + ttsFileSeq + '-' + slot + '.mp3'
      await runPython([TTS_EMOTE_PY, text, voice, emotion, outPath, rate || '+0%', pitch || '+0Hz', String(intensity)], 'edge_tts')
      const bytes = await readFileBytes(outPath, MAX_TTS_BYTES)
      if (bytes === null || bytes.length < 200) throw new Error('edge: empty audio')
      let words = []
      try {
        const wb = await readFileBytes(outPath + '.words.json', 262144)
        if (wb !== null) {
          const wj = JSON.parse(new TextDecoder('utf-8').decode(wb))
          if (wj && Array.isArray(wj.words)) words = wj.words.filter((w) => w && typeof w.o === 'number' && typeof w.d === 'number')
        }
      } catch (e) { /* words unavailable */ }
```

</details>

**依据 3 · 源码核查**：[tools/tts_server.py:33-62](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/tools/tts_server.py#L33-L62)

真实请求out→合成写文件，无局部身份校验。

<details>
<summary>查看原文（30行）</summary>

```text
    def do_POST(self):
        try:
            n = int(self.headers.get('Content-Length') or 0)
            req = json.loads(self.rfile.read(n).decode('utf-8') or '{}')
            text = req.get('text', '')
            if not text:
                raise ValueError('empty text')
            out = req.get('out') or os.path.join(
                self.root, 'w-' + uuid.uuid4().hex[:12] + '.mp3')
            asyncio.run(tts_emote.synth(
                text,
                req.get('voice') or DEFAULT_VOICE,
                req.get('emotion') or 'neutral',
                out,
                req.get('rate') or '+0%',
                req.get('pitch') or '+0Hz',
                float(req.get('intensity') or 1.0),
            ))
            words = []
            words_path = out + '.words.json'
            if os.path.exists(words_path):
                try:
                    with open(words_path, encoding='utf-8') as f:
                        w = json.load(f)
                    words = w.get('words', []) if isinstance(w, dict) else []
                finally:
                    os.unlink(words_path)
            self._json(200, {'ok': True, 'out': out, 'words': words})
        except Exception as e:  # noqa: BLE001
            self._json(500, {'ok': False, 'error': str(e)})
```

</details>

**依据 4 · 源码核查**：[tools/tts_server.py:76-89](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/tools/tts_server.py#L76-L89)

worker实际仅loopback监听。

<details>
<summary>查看原文（14行）</summary>

```text
def main():
    ap = argparse.ArgumentParser(add_help=False)
    ap.add_argument('--root', default=os.path.expanduser('~/.dsh/amadeus/tmp'))
    ap.add_argument('--port', type=int, default=0)
    args = ap.parse_args()
    os.makedirs(args.root, exist_ok=True)
    server = ThreadingHTTPServer(('127.0.0.1', args.port), _Handler)
    _Handler.root = args.root
    port = server.server_address[1]
    print('READY:%d' % port, flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
```

</details>

**依据 5 · 源码核查**：[tools/tts_emote.py:117-147](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/tools/tts_emote.py#L117-L147)

edge_tts真实音频stream/词边界写。

<details>
<summary>查看原文（31行）</summary>

```text
    words = []
    last_err = None
    for attempt in (style, None):
        _style = attempt
        words = []
        try:
            communicate = edge_tts.Communicate(
                text, voice,
                rate=rate, pitch=pitch, volume=vol,
                boundary='WordBoundary',
            )
            with open(out, 'wb') as f:
                async for chunk in communicate.stream():
                    ctype = chunk.get('type')
                    if ctype == 'audio':
                        f.write(chunk['data'])
                    elif ctype == 'WordBoundary':
                        # offset/duration 单位 100ns → 毫秒
                        words.append({
                            'o': int(chunk['offset'] / 10000),
                            'd': int(chunk['duration'] / 10000),
                        })
            break
        except Exception as e:  # express-as 不支持时退回纯 prosody
            last_err = e
            _style = None
    else:
        raise last_err if last_err else RuntimeError('tts failed')
    _style = None
    with open(out + '.words.json', 'w', encoding='utf-8') as wf:
        json.dump({'words': words}, wf)
```

</details>

**依据 6 · 源码核查**：[host.mjs:787-803](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L787-L803)

Quest真实公共文本URL/下载。

<details>
<summary>查看原文（17行）</summary>

```text
    async function synthesizeQuest(text) {
      const speaker = config.questSpeaker || 8
      const slot = nextSlot()
      const qPath = TMP_DIR + '/quest-' + slot + '.json'
      const oPath = TMP_DIR + '/quest-' + slot + '.mp3'
      const api = 'https://api.tts.quest/v3/voicevox/synthesis?text=' + encURI(text) + '&speaker=' + speaker
      await runCurl(['-sS', '--max-time', '25', api, '-o', qPath])
      const qBytes = await readFileBytes(qPath, 65536)
      if (qBytes === null) throw new Error('quest: no response')
      const json = JSON.parse(new TextDecoder('utf-8').decode(qBytes))
      const mp3Url = json && json.mp3DownloadUrl
      if (typeof mp3Url !== 'string' || mp3Url.length === 0) throw new Error('quest: no download url')
      await runCurl(['-sS', '--max-time', '25', '-L', mp3Url, '-o', oPath])
      const bytes = await readFileBytes(oPath, MAX_TTS_BYTES)
      if (bytes === null || bytes.length < 200) throw new Error('quest: empty audio')
      return { bytes, words: [], mime: 'audio/mpeg' }
    }
```

</details>

**依据 7 · 源码核查**：[host.mjs:936-953](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L936-L953)

Edge fallback实际条件。

<details>
<summary>查看原文（18行）</summary>

```text
          if (!entry) {
            throw new Error('auto TTS failed: ' + (errors.join(' | ') || 'no provider available'))
          }
        } else {
          try {
            entry = await synthesizeEdge(text, voice, rate, pitch, emo)
          } catch (e1) {
            if (config.fallbackToQuest === true && config.voiceStability !== true) {
              try {
                entry = await synthesizeQuest(text)
              } catch (e2) {
                throw new Error('edge failed: ' + (e1 && e1.message ? e1.message : e1) + ' | quest failed: ' + (e2 && e2.message ? e2.message : e2))
              }
            } else {
              // 声线稳定优先：失败不切公共 API；前端默认也不降级到浏览器语音。
              throw new Error('edge failed: ' + (e1 && e1.message ? e1.message : e1))
            }
          }
```

</details>

**依据 8 · 源码核查**：[host.mjs:1471-1497](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1471-L1497)

STT文件/Key argv/读取输出。

<details>
<summary>查看原文（27行）</summary>

```text
      const slot = nextSlot()
      const b64Path = TMP_DIR + '/stt-upload-' + slot + '.b64'
      const outPath = TMP_DIR + '/stt-out-' + slot + '.json'
      await writeTextSafe(b64Path, toBase64(audioBuf))
      const baseUrl = config.sttApiUrl || config.chatBaseUrl || 'https://api.openai.com/v1'
      const apiKey = config.sttApiKey || config.chatApiKey || ''
      if (!apiKey) throw new Error('STT: missing API key')
      await runPython([
        STT_PY,
        b64Path,
        outPath,
        baseUrl,
        apiKey,
        config.sttModel || 'whisper-1',
        lang || '',
      ], 'stt')
      const outText = await readTextFile(outPath)
      if (outText === null) throw new Error('STT: no output')
      const parsed = JSON.parse(outText)
      if (!parsed.ok) throw new Error('STT: ' + (parsed.error || 'unknown'))
      return parsed.text
    }

    async function serveFile(res, absPath, maxBytes, cache) {
      let bytes
      try {
        bytes = await readFileBytes(absPath, maxBytes)
```

</details>

**依据 9 · 源码核查**：[tools/stt.py:54-80](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/tools/stt.py#L54-L80)

真实音频multipart/Key与urllib外发。

<details>
<summary>查看原文（27行）</summary>

```text
def call_once(url, api_key, model, audio_bytes, lang):
    boundary = "----AmadeusSTT" + uuid.uuid4().hex
    fields = [
        ("model", model, None, None),
        ("response_format", "json", None, None),
        (
            "file",
            audio_bytes,
            "amadeus-mic.webm",
            "audio/webm",
        ),
    ]
    if lang:
        fields.append(("language", lang, None, None))
    body = multipart_body(fields, boundary)
    headers = {
        "Authorization": "Bearer " + api_key,
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "User-Agent": "Amadeus-DSH/1.0",
    }
    req = urllib.request.Request(url, data=body, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    if isinstance(data, dict):
        text = data.get("text") or data.get("result") or ""
        if text:
            return text
```

</details>

**依据 10 · 源码核查**：[tools/stt.py:88-112](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/tools/stt.py#L88-L112)

真实读音频/候选调用/结果写。

<details>
<summary>查看原文（25行）</summary>

```text
    b64file, outfile, base_url, api_key, model = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]
    lang = sys.argv[6] if len(sys.argv) >= 7 else ""
    try:
        with open(b64file, "r", encoding="utf-8-sig") as f:
            audio_bytes = base64.b64decode(f.read().strip())
        if len(audio_bytes) < 100:
            raise RuntimeError("audio too small")
        candidates = build_candidates(base_url)
        if not candidates:
            raise RuntimeError("missing STT base URL")
        last_err = None
        text = None
        for url in candidates:
            try:
                text = call_once(url, api_key, model, audio_bytes, lang)
                break
            except Exception as e:
                last_err = e
        if text is None:
            raise RuntimeError("STT failed: " + str(last_err))
        with open(outfile, "w", encoding="utf-8") as f:
            json.dump({"ok": True, "text": text}, f, ensure_ascii=False)
    except Exception as e:
        with open(outfile, "w", encoding="utf-8") as f:
            json.dump({"ok": False, "error": str(e)}, f, ensure_ascii=False)
```

</details>

**依据 11 · 源码核查**：[host.mjs:590-601](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L590-L601)

实际超时terminate对应proc。

<details>
<summary>查看原文（12行）</summary>

```text
    async function raceDone(proc, label) {
      const res = await Promise.race([
        proc.done.then((o) => ({ t: 'done', o }), (e) => ({ t: 'spawn-error', e })),
        ctx.timeout(TTS_TIMEOUT_MS).then(() => ({ t: 'timeout' })),
      ])
      if (res.t === 'timeout') {
        try { proc.terminate() } catch (e) { /* ignore */ }
        throw new Error(label + ' timeout')
      }
      if (res.t === 'spawn-error') throw new Error(label + ' spawn failed: ' + (res.e && res.e.message ? res.e.message : res.e))
      if (res.o.exitCode !== 0) throw new Error(label + ' exited ' + res.o.exitCode)
    }
```

</details>

**依据 12 · 源码核查**：[plugin/web/panel.js:330-360](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/plugin/web/panel.js#L330-L360)

真实audio.play与完成/错误/解锁。

<details>
<summary>查看原文（31行）</summary>

```text
  function playAudioUrl(url, onStart) {
    return new Promise(function (resolve, reject) {
      ensureAudioEl()
      attachAnalyser()
      var el = audioEl
      el.src = url
      var done = false
      el.onended = function () { if (done) return; done = true; resolve() }
      el.onerror = function () {
        if (done) return
        done = true
        var err = el.error
        reject(new Error(err && err.message ? err.message : 'audio error'))
      }
      var p
      try { p = el.play() } catch (e) { p = Promise.reject(e) }
      if (p && p.then) {
        p.then(function () {
          if (onStart) { try { onStart() } catch (e) { /* ignore */ } }
          if (actx && actx.state === 'suspended') { try { actx.resume() } catch (e) { /* ignore */ } }
          hideUnlock()
          markUnlocked()
        }).catch(function (err) {
          if (done) return
          report('audio blocked: ' + (err && err.message ? err.message : err))
          showUnlock()
          reject(err)
        })
      }
    })
  }
```

</details>

#### 缺口

- 外部语音服务、延迟/准确率/口型/收费、全部临时清理与子进程隔离未测。
  **影响**：不建议秘密文本/音频；合成/进程done非用户听见或远端取消保证。
  **进一步探讨**：固定公开短句核网络目的地/音频与词边界，审本机worker和临时留存再决定。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 记忆、配置和路由的身份及持久边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

本Host所有会话共享memory与config，/memory回最近50历史/30facts/summary，/poll返回整个config和语音队列并从全局队列移除已served项；未见这些handler用户/会话身份、Origin或RPC令牌校验，Key可能作为config字段返回。公网是否被Host外围认证拦截未知，不能断言外部可读，但只能限私人可信Host，不能宣称多用户隔离。

/rpc单独要求loopback+随机/环境token，当前打包client.js却普通fetch无x-amadeus-token，也不检查HTTP状态即json；静态接线下RPC会403，设置/测试能力不能从界面按钮推运行可用，是否额外Host注入header未知。其他聊天/记忆路由不能自动继承这段RPC校验。

writeTextSafe显式请求danger-full-access策略再fs.writeText；配置保存异常只console.error。记忆先尝试该写入，失败Python mem_save从本机/memory拉取并tmp+os.replace，fallback只保facts/history/lastCallAt/callCount而漏summary，且/memory仅最近50条；两路径失败只日志不向聊天结果传播。每十交流用模型抽facts，>60历史先截到30再请求summary，压缩失败也不恢复旧历史；模型事实/摘要非可信真相。保存调用不统一队列/版本事务，非完整审计账本；卸载仅结束worker未见等待所有保存flush，重装数据保留需用户清理/备份。

#### 证据与依据

**依据 1 · 源码核查**：[host.mjs:71-91](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L71-L91)

RPC独立loopback/token检查。

<details>
<summary>查看原文（21行）</summary>

```text
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: '/amadeus/rpc',
      handler: async (req, res) => {
        noteHost(req)
        // V-002（社区 PR #1）：RPC 仅允许本机回环访问，避免网络侧任意调用
        const remoteAddr = req.socket && req.socket.remoteAddress
        const isLocalHost = remoteAddr === '127.0.0.1' || remoteAddr === '::1' || remoteAddr === '::ffff:127.0.0.1'
        if (!isLocalHost) { sendJson(res, 403, { error: 'forbidden' }); return }
        const reqToken = req.headers && (req.headers['x-amadeus-token'] || req.headers['X-Amadeus-Token'])
        if (reqToken !== RPC_TOKEN) { sendJson(res, 403, { error: 'forbidden' }); return }
        const q = parseQuery(req.url)
        const m = q.m
        const h = typeof m === 'string' ? rpcHandlers.get(m) : undefined
        if (h === undefined) { sendJson(res, 404, { error: 'no such rpc' }); return }
        let args = {}
        if (typeof q.args === 'string' && q.args.length > 0) {
          try { args = JSON.parse(q.args) } catch (e) { /* ignore */ }
        }
        try { sendJson(res, 200, await h(args)) } catch (e) {
          sendJson(res, 500, { error: e && e.message ? e.message : String(e) })
```

</details>

**依据 2 · 源码核查**：[client.js:39-48](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/client.js#L39-L48)

实际client RPC fetch无token且直接json。

<details>
<summary>查看原文（10行）</summary>

```text
function apply(ctx) {
  const slots = ctx.get("slots");
  if (slots === void 0) return;
  const layout = ctx.get("layout");
  const hostLocal = {
    call: async (m, args) => {
      const res = await fetch("/amadeus/rpc?m=" + encodeURIComponent(m) + "&args=" + encodeURIComponent(JSON.stringify(args || {})), { cache: "no-store" });
      return await res.json();
    }
  };
```

</details>

**依据 3 · 源码核查**：[host.mjs:1605-1626](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1605-L1626)

poll真实返回config/队列并消耗served项。

<details>
<summary>查看原文（22行）</summary>

```text
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: '/amadeus/poll',
      handler: async (req, res) => {
        noteHost(req)
        const q = parseQuery(req.url)
        let after = Number(q.after)
        if (!isFinite(after)) after = -1
        let items = []
        if (after >= 0) {
          items = queue.filter((u) => u.id > after).map((u) => ({ id: u.id, kind: u.kind || 'say', text: u.text, cn: u.cn || '', force: !!u.force, emotion: u.emotion || 'neutral', expr: u.expr || '', ts: u.ts || 0, announce: u.announce === true, idle: u.idle === true }))
          const served = new Set(items.map((u) => u.id))
          queue = queue.filter((u) => !served.has(u.id))
        }
        sendJson(res, 200, {
          cursor: maxIssuedId,
          config,
          utterances: items,
          tts: config.provider,
        })
      },
    }))
```

</details>

**依据 4 · 源码核查**：[host.mjs:1756-1770](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1756-L1770)

memory实际返回全局历史/facts/summary。

<details>
<summary>查看原文（15行）</summary>

```text
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: '/amadeus/memory',
      handler: async (req, res) => {
        noteHost(req)
        sendJson(res, 200, {
          history: memory.history.slice(-50),
          facts: memory.facts.slice(-30),
          summary: memory.summary || '',
          lastCallAt: memory.lastCallAt,
          callCount: memory.callCount || 0,
        })
      },
    }))

```

</details>

**依据 5 · 源码核查**：[host.mjs:372-382](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L372-L382)

真实danger-full-access写策略。

<details>
<summary>查看原文（11行）</summary>

```text
    async function writeTextSafe(absPath, content) {
      const t = await fs.resolve(absPath)
      // dsh ≥ 0.1.1：writeText(target, content, expected, signal, sandboxPolicy)
      // fs-sandbox 后端第 5 参接收 per-call 策略；缺省按 workspace-write 拦截 ~/.dsh 外的写入
      // （8/20 后记忆/配置冻结的根因），因此必须显式解析 danger-full-access 提权。
      let policy
      try {
        policy = sandboxPolicy !== undefined ? sandboxPolicy.resolve({ mode: 'danger-full-access' }) : undefined
      } catch (e) { /* backend 默认 */ }
      return fs.writeText(t, content, undefined, undefined, policy)
    }
```

</details>

**依据 6 · 源码核查**：[host.mjs:428-435](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L428-L435)

配置写失败仅日志。

```text
    async function saveConfig() {
      try {
        await writeTextSafe(CONFIG_PATH, JSON.stringify(config, null, 2))
      } catch (e) {
        console.error('[amadeus] 保存配置失败:', e && e.message ? e.message : String(e))
      }
    }

```

**依据 7 · 源码核查**：[host.mjs:565-581](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L565-L581)

真实记忆保存/fs失败Python兜底/失败日志。

<details>
<summary>查看原文（17行）</summary>

```text
    function scheduleSaveMemory() {
      saveMemoryNow().catch((e) => console.error('[amadeus] 保存记忆失败:', e && e.message ? e.message : e))
    }

    async function saveMemoryNow() {
      try {
        await writeTextSafe(MEMORY_PATH, JSON.stringify(memory, null, 2))
        return
      } catch (e) {
        // fs 沙箱可能拦截写入 → python 子进程兜底（已验证可写盘）
      }
      try {
        await runPython([MEM_SAVE_PY, lastHostPort, MEMORY_PATH], 'mem_save')
      } catch (e2) {
        console.error('[amadeus] 记忆落盘失败(fs+py):', e2 && e2.message ? e2.message : String(e2))
      }
    }
```

</details>

**依据 8 · 源码核查**：[tools/mem_save.py:13-33](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/tools/mem_save.py#L13-L33)

真实loopback读截取数据/遗漏summary/tmp replace。

<details>
<summary>查看原文（21行）</summary>

```text
def main():
    port = sys.argv[1] if len(sys.argv) > 1 else '3080'
    out = sys.argv[2] if len(sys.argv) > 2 else 'memory/amadeus-memory.json'
    url = 'http://127.0.0.1:' + port + '/amadeus/memory'
    with urllib.request.urlopen(url, timeout=10) as r:
        data = json.loads(r.read().decode('utf-8'))
    payload = {
        'facts': data.get('facts', []),
        'history': data.get('history', []),
        'lastCallAt': data.get('lastCallAt', 0),
        'callCount': data.get('callCount', 0),
    }
    tmp = out + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    import os
    os.replace(tmp, out)
    print('mem_save ok, history=%d' % len(payload['history']))


if __name__ == '__main__':
```

</details>

**依据 9 · 源码核查**：[host.mjs:1320-1361](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1320-L1361)

真实facts抽取/截历史后压缩及失败处理。

<details>
<summary>查看原文（42行）</summary>

```text
      const exchangeCount = memory.history.filter((m) => m.role === 'assistant').length
      if (exchangeCount % 10 !== 0 || exchangeCount === 0) return
      try {
        const lines = memory.history.slice(-20).map((m) => (m.role === 'user' ? 'ユーザー: ' + m.content : '紅莉栖: ' + (m.cn || m.jp))).join('\n')
        const system = '以下はユーザーとAmadeus（紅莉栖）の会話記録です。ユーザーについての重要な長期的事実（好み、身分、進行中のプロジェクト、関係、習慣など）を抽出し、一行一項目の簡潔なリストで出力してください。既存の事実は：\n- ' + (memory.facts || []).join('\n- ') + '\n\n既存の事実と重複するものは含めず、新しい事実のみ最大5件出力。新しい事実がなければ「なし」とだけ出力。'
        const raw = await aiComplete(system, [{ role: 'user', content: lines }], 300)
        const newFacts = String(raw).split(/\n+/).map((s) => s.replace(/^[-•・]\s*/, '').trim()).filter((s) => s.length > 2 && s.length < 120 && s !== 'なし' && !/^なし/.test(s)).slice(0, 5)
        for (const f of newFacts) {
          if (memory.facts.indexOf(f) < 0) memory.facts.push(f)
        }
        if (memory.facts.length > 30) memory.facts.splice(0, memory.facts.length - 30)
        scheduleSaveMemory()
      } catch (e) {
        console.error('[amadeus] 记忆维护失败:', e && e.message ? e.message : e)
      }
    }

    async function maybeCompactHistory() {
      // 只保留最近 30 条，更早的对话压缩成 summary，避免无限堆积原始聊天记录。
      if (memory.history.length <= 60) return
      const keep = memory.history.slice(-30)
      const old = memory.history.slice(0, memory.history.length - 30)
      memory.history = keep
      if (old.length < 8) {
        scheduleSaveMemory()
        return
      }
      try {
        const lines = old.map((m) => (m.role === 'user' ? 'ユーザー: ' + m.content : '紅莉栖: ' + (m.cn || m.jp))).join('\n')
        const system = '以下は古い会話ログです。重要な出来事、ユーザーの好み、約束、進行中タスクだけを簡潔に要約してください。無関係な雑談や挨拶は含めない。3〜6行以内で。'
        const raw = await aiComplete(system, [{ role: 'user', content: lines }], 300)
        const summary = String(raw || '').trim()
        if (summary.length > 10) {
          memory.summary = ((memory.summary || '') + '\n' + summary).trim()
          if (memory.summary.length > 2000) memory.summary = memory.summary.slice(-2000)
        }
      } catch (e) {
        console.error('[amadeus] 历史压缩失败:', e && e.message ? e.message : e)
      }
      scheduleSaveMemory()
    }

```

</details>

**依据 10 · 源码核查**：[host.mjs:2048-2066](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L2048-L2066)

定时记忆/卸载worker/人格注入。

<details>
<summary>查看原文（19行）</summary>

```text
    ctx.effect(() => ctx.interval(() => {
      if (memory.history.length === 0 && memory.facts.length === 0) return
      try { scheduleSaveMemory() } catch (e) { /* ignore */ }
    }, 60000))

    // 卸载插件时终止常驻 TTS worker
    ctx.effect(() => {
      return () => { teardownTtsWorker() }
    })

    // ---------------- 人格注入 ----------------
    if (systemPrompt !== undefined) {
      ctx.effect(() => systemPrompt.section({
        name: 'amadeus-persona',
        order: 500,
        text: () => (config.personaOn === true ? personaText : ''),
      }))
    }

```

</details>

#### 缺口

- Host外围认证、client token补齐可能性、多用户/并发持久/卸载与敏感Key暴露实际可达性未验证。
  **影响**：默认不能安全接生产凭据/私密记忆；聊天完成和保存日志不足可靠落盘。
  **进一步探讨**：先检查私有路由访问/屏蔽Key、核RPC实际403与正式授权方案；用可丢弃记忆触发fs失败和压缩失败。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时值得采用，下一方向怎样与现有方案比较？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

建议观察：只有明确需要角色语音体验的私人低敏场景值得进一步验证；先核静态RPC令牌接线、Host路由权限和模型/语音目的地，暂不接真实Key/敏感对话。普通角色提示+现有聊天/语音足够时无需引入独立记忆、Python worker和额外路由；本包当前不证明工作任务组织、外部客户新触达或供给/收费/风险结构变化。

首次Host/素材/模型/语音/Python配置，持续聊天/事实提取/摘要/主动来电/闲聊模型请求、TTS/STT网络与磁盘，故障晚到/重复请求/记忆丢失/Key清理和退出数据备份的现金/人工未知不填0；默认主动功能开启也非用户每次点聊才产生成本，无费用总封顶证据。体验、正确率、需求与净节时未独立验证。

独立假设：比继续加动作/音色，先让用户可见并选择每条输入的模型/语音去向、后台主动请求、保存接受/落盘/删除状态，结合真实取消与按用户隔离，可能更降低隐私/费用与“记住了”误判。先比关闭主动功能+手工备份+既有聊天UI，固定RPC403、超时晚到、fs兜底漏summary、压缩失败和双面板poll消费样例，测误判、恢复人时与费用；若现有清单足够或负担更高则否定，不算现有能力。

#### 证据与依据

**依据 1 · 源码核查**：[host.mjs:107-150](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L107-L150)

当前默认主动功能/模型Key设置。

<details>
<summary>查看原文（44行）</summary>

```text
    const DEFAULT_CONFIG = {
      voiceOn: true,
      personaOn: false,
      themeOn: true,
      chatOn: true,
      callOn: true,
      voiceName: 'ja-JP-NanamiNeural',
      rate: '+0%',
      pitch: '+0Hz',
      provider: 'edge',
      questSpeaker: 8,
      maxCharsPerTurn: 1400,
      emotionIntensity: 1.0,
      fallbackToQuest: false,
      voiceStability: true,
      sttProvider: 'auto',
      sttApiUrl: '',
      sttApiKey: '',
      sttModel: 'whisper-1',
      aquaUrl: 'http://127.0.0.1:8000',
      aquaVoice: '',
      aquaRefAudio: '',
      aquaPromptText: '',
      aquaTextLanguage: '日文',
      aquaPromptLanguage: '日文',
      aquaPreset: 'fast',
      aquaApiKey: '',
      aquaEmotionVoices: {},
      voicevoxUrl: 'http://127.0.0.1:50021',
      voicevoxSpeaker: 8,
      voicevoxEmotionSpeakers: {},
      openaiTtsUrl: '',
      openaiTtsApiKey: '',
      openaiTtsModel: 'tts-1',
      openaiTtsVoice: 'nova',
      openaiTtsSpeed: 1,
      chatApiKey: '',
      chatBaseUrl: 'https://api.deepseek.com/v1',
      chatModel: 'deepseek-chat',
      callIntervalMs: 36000000,
      idleChatOn: true,
      idleChatMs: 1200000,
    }

```

</details>

**依据 2 · 源码核查**：[host.mjs:1123-1145](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1123-L1145)

超时后回退非取消。

<details>
<summary>查看原文（23行）</summary>

```text

    async function aiComplete(system, messages, maxTokens, onDelta) {
      const useApi = typeof config.chatApiKey === 'string' && config.chatApiKey.length > 0
      if (useApi) {
        if (typeof fetch === 'function') {
          try {
            return await Promise.race([
              aiCompleteHttp(system, messages, maxTokens, onDelta),
              ctx.timeout(CHAT_TIMEOUT_MS).then(() => { throw new Error('llm timeout') }),
            ])
          } catch (e) {
            // 直连失败时保留 Python 子进程兜底，保证有 key 就能用
            console.error('[amadeus] llm http fallback:', e && e.message ? e.message : String(e))
          }
        }
        const slot = nextSlot()
        const reqPath = TMP_DIR + '/chat-req-' + slot + '.json'
        const outPath = TMP_DIR + '/chat-out-' + slot + '.json'
        const req = {
          baseUrl: config.chatBaseUrl || 'https://api.deepseek.com/v1',
          apiKey: config.chatApiKey,
          model: config.chatModel || 'deepseek-chat',
          system,
```

</details>

**依据 3 · 源码核查**：[host.mjs:1337-1361](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1337-L1361)

压缩前截历史及失败。

<details>
<summary>查看原文（25行）</summary>

```text
    async function maybeCompactHistory() {
      // 只保留最近 30 条，更早的对话压缩成 summary，避免无限堆积原始聊天记录。
      if (memory.history.length <= 60) return
      const keep = memory.history.slice(-30)
      const old = memory.history.slice(0, memory.history.length - 30)
      memory.history = keep
      if (old.length < 8) {
        scheduleSaveMemory()
        return
      }
      try {
        const lines = old.map((m) => (m.role === 'user' ? 'ユーザー: ' + m.content : '紅莉栖: ' + (m.cn || m.jp))).join('\n')
        const system = '以下は古い会話ログです。重要な出来事、ユーザーの好み、約束、進行中タスクだけを簡潔に要約してください。無関係な雑談や挨拶は含めない。3〜6行以内で。'
        const raw = await aiComplete(system, [{ role: 'user', content: lines }], 300)
        const summary = String(raw || '').trim()
        if (summary.length > 10) {
          memory.summary = ((memory.summary || '') + '\n' + summary).trim()
          if (memory.summary.length > 2000) memory.summary = memory.summary.slice(-2000)
        }
      } catch (e) {
        console.error('[amadeus] 历史压缩失败:', e && e.message ? e.message : e)
      }
      scheduleSaveMemory()
    }

```

</details>

**依据 4 · 源码核查**：[host.mjs:1605-1626](https://github.com/yyxcnasd/amadeus-for-dsh/blob/ffc28723fea81bf7efaa43e6063dd12f92edf27e/host.mjs#L1605-L1626)

全局poll配置/消费边界。

<details>
<summary>查看原文（22行）</summary>

```text
    ctx.effect(() => webServer.register({
      kind: 'exact',
      path: '/amadeus/poll',
      handler: async (req, res) => {
        noteHost(req)
        const q = parseQuery(req.url)
        let after = Number(q.after)
        if (!isFinite(after)) after = -1
        let items = []
        if (after >= 0) {
          items = queue.filter((u) => u.id > after).map((u) => ({ id: u.id, kind: u.kind || 'say', text: u.text, cn: u.cn || '', force: !!u.force, emotion: u.emotion || 'neutral', expr: u.expr || '', ts: u.ts || 0, announce: u.announce === true, idle: u.idle === true }))
          const served = new Set(items.map((u) => u.id))
          queue = queue.filter((u) => !served.has(u.id))
        }
        sendJson(res, 200, {
          cursor: maxIssuedId,
          config,
          utterances: items,
          tts: config.provider,
        })
      },
    }))
```

</details>

#### 缺口

- 真实体验/需求/语音质量、素材许可、总费用与改进净收益未测。
  **影响**：只能观察，不将角色演示当生产采用/心理效果证明。
  **进一步探讨**：低敏固定体验对照普通角色聊天UI，恢复/隐私/费用不清即停止。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
