# dsh-speak

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a29bf66](https://github.com/Alan2Z/dsh-speak/tree/a29bf66a88a9f775769da3f0d380112751efd76f)

<!-- BEGIN META -->
[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alan2Z/dsh-speak) [![npm 30d 2,033](https://img.shields.io/static/v1?label=npm+30d&message=2%2C033&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-speak) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-speak)
<!-- END META -->

> **功能**：通过系统语音播报 DSH 最终回复、审批和提问，提供重播与播放控制

> **亮点**：把最终回复筛选、审批/提问与宿主FIFO、重播和可更新设置接进注意力交接，减少手工复制；语音引擎继承OS，队列上游归属明确。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：新普通消息会检查automaticSpeech，但已有timer不二次检查；全插件共享lastText/timer可被跨会话事件清理或错配。进程退出也不证明可听，声音不能作唯一验收。[Q03](#research-q03)

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
  - [Q01 · 声音提醒给谁解决什么任务，贡献归于哪里？](#detail-section-11)
  - [Q02 · DSH事件如何成为可控声音？](#detail-section-12)
  - [Q03 · 当前自动开关与双会话并发有什么边界？](#detail-section-13)
  - [Q04 · 权限、隐私、平台与全周期成本是什么？](#detail-section-14)
  - [Q05 · 现在如何采用，什么改进可证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本机等待长任务又不想一直盯屏的个人用户，需要可停止且可回文字核对的提醒。

宿主视觉通知、人工复制到系统TTS或手动重播；合成由OS提供，不把模型任务成功归于声音。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自动语音 | 最终回复、审批和提问提醒 | 共享待播状态，不作唯一验收 |
| FIFO与重播 | 单进程播放、替换与停止 | Host拥有播放，关浏览器不停止 |
| 系统TTS | macOS say/Windows SAPI | 系统音色和设备决定可听效果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18与DSH接口 | 启动必需 | 事件、Config与webclient | 声明>=0.1.7-rc.2，作者tested0.2.1-rc.4；其余未保证 |
| macOS say/bash/perl或Windows PowerShell/SAPI | 播放必需 | 本地系统合成 | 缺引擎/音色/设备可能静默，无声不能当成功 |
| ws与Host webServer | 重播状态必需 | 控制与同步 | 外层身份需核清 |
| 私密听觉环境 | 敏感任务必需 | 避免回复外泄 | 否则静音回看文字 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户确保仅一个bundle row并核Host版本 | 重复row会使设置拒写，应清重复后重载 |
| 2 | 用户以非敏感文字试声音和系统音色 | 真实可听而非进程退出 |
| 3 | 用户核手动重播、切换、停止与设置保存 | 异常先静音，不当唯一提醒 |
| 4 | 用户双会话交错核内容/session | 错配或关开关后播报则退回手动重播 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本机语音/设备、可选音色资源；金额未知 | 安装与单路注册、系统音色配置 | 无新增LLM入口不等于零成本 |
| 持续使用 | 语音进程与声道占用未知 | 回看长文、处理干扰/排队 | 不计声音为业务成果 |
| 失败恢复 | 重播与临时存储未知 | 查日志、会话与声音对应 | 失败/重试应计入 |
| 退出 | 日志/临时残留未知 | 静音、停进程并核残留 | 敏感片段可能在日志 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 声音交接 | 事件过滤、FIFO、OS合成调用 | 可听性、正确会话与响应时间 |
| 控制 | 重播/停止、主开关与设置接线 | 在途automatic切换、跨会话可靠性 |
| 少盯屏幕 | 自动提醒提供可能机制 | 净节时、漏播/干扰实测 |

> **思考**：新普通消息会检查automaticSpeech，但已有timer不二次检查；全插件共享lastText/timer可被跨会话事件清理或错配。进程退出也不证明可听，声音不能作唯一验收。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把最终回复筛选、审批/提问与宿主FIFO、重播和可更新设置接进注意力交接，减少手工复制；语音引擎继承OS，队列上游归属明确。[Q01](#research-q01) [Q02](#research-q02)

临时文件参数传递、token防旧进程回调、资源dispose、静态Config与单实例提示值得复用；代价是全局待播状态、best-effort静默和外层认证未核。需要将事件身份与播放权限一起保留，而非只拷贝FIFO。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

新普通消息会检查automaticSpeech，但已有timer不二次检查；全插件共享lastText/timer可被跨会话事件清理或错配。进程退出也不证明可听，声音不能作唯一验收。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

观察；先用单会话非敏感内容核手动重播和停止，不能以声音作为唯一审批/完成判断。跨会话或静音行为不符就关自动，保留原生文字通知。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

事件到队列/本地引擎与设置接线为源码支持；在途开关和跨会话问题为源码推导未实机复现。真实声音、外层认证及收益未知；分区为未来假设。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、adapters/dsh/speech-hook.js、engine/speak.sh、engine/speak.ps1 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交根组件完整inventory，实读adapter、macOS/Windows引擎关键段、package和README。未运行目标/测试，未验证实际声音和外部自然音色。 本轮重新读取相同固定提交的关键入口、状态与失败分支，采用判断由这些材料复核。
- 下一步：隔离profile以20组双会话交错轨迹、慢TTS、timer内关闭设置及卸载为矩阵，记录内容/session、漏播、审批等待和停止延迟；任何错配即停止自动采用。

**分析版本**

- **仓库**：[Alan2Z/dsh-speak](https://github.com/Alan2Z/dsh-speak)
- **版本号**：1.8.4（[固定提交 a29bf66](https://github.com/Alan2Z/dsh-speak/tree/a29bf66a88a9f775769da3f0d380112751efd76f)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是session+turn分区待播并在出队重验开关，加入有界审批优先级；20组双会话轨迹核错配、漏播、等待与饥饿，任一错配未归零或最终回复饥饿即否定。[Q05](#research-q05)

隔离profile以20组双会话交错轨迹、慢TTS、timer内关闭设置及卸载为矩阵，记录内容/session、漏播、审批等待和停止延迟；任何错配即停止自动采用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 9 | 2952 | 2083 | 744 | — |
| .md | source | 4 | 1918 | — | — | 20141 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/Alan2Z/dsh-speak/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地TTS能否可靠交接注意力，开关与会话边界在哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 声音提醒给谁解决什么任务，贡献归于哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向本机等待长任务、离开屏幕后仍要知道最终回复、审批或提问的个人用户。合格结果是正确会话的可识别声音，能停止并回界面确认；“完成”声音不是业务成功证明。相对手工复制文本到系统TTS和纯原生视觉通知，插件接入事件筛选、节流、FIFO与重播，减少注意力交接中的手动复制。语音合成继承macOS say和Windows SAPI，队列与重播源于所标注PR #2；不能称原创TTS。包1.8.4是真实DSH bundle及web client，宽host版本声明与作者tested0.2.1-rc.4仍需区分。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:11-39](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/README.md#L11-L39)

作者目标、提醒/重播/设置用途。

<details>
<summary>查看原文（29行）</summary>

```text
Let your agent **tell you** when a long task is done — no more staring at the screen.

dsh-speak reads the final assistant reply aloud through system speech synthesis,
using whatever voice the operating system is set to — on Windows the default SAPI
voice (natural packs on Windows 11, or [NaturalVoiceSAPIAdapter] on Windows 10);
on macOS the system reading voice (`say`, Siri voices included). It was built
for [DeepSeek Harness](https://github.com/deepseek-ai/dsh)
and is structured so any harness can plug in.

## Features

- **Automatic**: DSH web plugin watches the session event stream and announces the
  final reply (skips reasoning/tool-call narration, merges multi-step messages).
- **Gets your attention**: announces approval requests (hears "需要你的审批" when
  the agent is waiting on you) and questions the agent asks via `ask_user_question`.
- **Final-reply replay** (1.7.0): every final reply (turn tail) has a 🔊 button
  in its action bar — click to replay that message, click again to stop, click
  another to switch. Speech execution stays fully owned by the DSH host (keeps
  speaking even with the browser closed).
- **Host speech queue** (1.7.0): only one native speech process runs at a time;
  queued items continue automatically. A WebSocket syncs the live state (which
  message is speaking, queue length) to the UI.
- **Optional event announcements** (1.6.0): turn end, command done, goal changes,
  tool errors, and todo updates can each be announced, toggled independently
  (off by default).
- **Visual configuration** (1.7.0): a dedicated Settings → dsh-speak settings
  page — every option (master switch, automatic speech, Markdown cleaning, code
  blocks, event toggles, fixed prompt, …) is editable from the Web UI, no
  hand-edited YAML.
```

</details>

**依据 2 · 源码核查**：[package.json:1-36](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/package.json#L1-L36)

主入口与bundle/client注册。

<details>
<summary>查看原文（36行）</summary>

```text
{
  "name": "dsh-speak",
  "version": "1.8.4",
  "description": "Make your AI harness speak — voice announcements for DSH and other AI coding harnesses (Windows SAPI5 + macOS system voices)",
  "main": "adapters/dsh/speech-hook.js",
  "exports": {
    ".": "./adapters/dsh/speech-hook.js",
    "./client": "./client/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "adapters/dsh/speech-hook.js",
    "adapters/dsh/install.ps1",
    "cordis.patch.yml",
    "client/",
    "engine/",
    "docs/",
    "README.md",
    "README.zh-CN.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "external": [
        "@deepseek-ai/dsh-client-ui-primitives"
      ]
    }
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/speech-hook.js:7-21](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L7-L21)

源码注明队列与重播上游归属。

<details>
<summary>查看原文（15行）</summary>

```text
// Since 1.7.0 this is the merged host of the original dsh-speak behavior and
// victorwads' PR #2 (turn-level replay + host FIFO speech queue + WebSocket
// state sync + native Speak settings page):
//
//   * a host-owned FIFO speech queue: only one native speech process runs at a
//     time; queued items continue automatically when the current one finishes
//   * every eligible item (final reply, approvals, questions, optional events,
//     manual replay) is enqueued, so the WebSocket state (which message is
//     speaking, queue length) is always truthful — even for automatic replies
//   * `queueAllMessages` (default off) switches between two automatic modes:
//       - off (default): final replies are throttled/merged as before, plus the
//         optional event announcements; tool calls cancel pending narration
//       - on: every assistant/message is enqueued immediately as it arrives
//   * a `/dsh-speak/control` POST route (play/stop/status) and a
//     `/dsh-speak/ws` WebSocket publish the authoritative speech state
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH事件如何成为可控声音？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

session/event处理assistant/message、approval/asked、ask_user_question等；默认模式用pendingText/timer合并并在tool/call取消旁白，turn/end补未播最终文本。所有eligible item进入宿主FIFO，只有activeSpeech为空才启动；文本写UTF-8临时文件，通过spawn参数数组传给bash或powershell，避免把回复拼成shell代码。macOS通过say，Windows SpeechSynthesizer分段完整重播。进程exit/error都settle，删除临时文件、清活动状态再下一项；stop杀macOS进程组或Windows子进程，卸载清队列、连接和进程。host拥有播放意味着关浏览器不一定停播。可借鉴分离事件适配与OS引擎，但“进程退出”不证明声音实际可听，系统音色、音量和设备仍需验收。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/speech-hook.js:420-470](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L420-L470)

临时文件、参数数组spawn和token settle。

<details>
<summary>查看原文（51行）</summary>

```text
    function startOne(item) {
      // master switch: nothing is ever spoken while disabled
      if (!cfg.enabled) { log('总开关关闭，跳过播报（文本长度:', item.text.length, '）'); return false }
      if (!item || !item.text.trim() || activeSpeech) return false
      const tmp = path.join(os.tmpdir(), `dsh-speech-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.txt`)
      try { fs.writeFileSync(tmp, item.text, 'utf8') } catch (e) { log('write temp failed:', e.message); return false }
      log('speech start', item.source, item.sessionId || '-', item.turn == null ? '-' : item.turn, item.messageId || '-', item.text.slice(0, 80))
      let child
      // 手动重播完整朗读：replayFullRead 打开时，重播跳过 heading 截断完整朗读
      const fullRead = item.manual === true && cfg.replayFullRead === true
      if (process.platform === 'darwin') {
        const args = ['-f', tmp, '-m', String(cfg.maxChars), '-M', cfg.longTextMode, '-l', cfg.longTextMessage, '-C', cfg.cleanMarkdownFormatting ? '1' : '0', '-I', cfg.readInlineCode ? '1' : '0', '-B', cfg.codeBlocks, '-K', String(cfg.codeBlockMaxChars), '-R', cfg.codeBlockReplacementText]
        if (cfg.rate > 0) args.push('-r', String(cfg.rate))
        if (fullRead) args.push('-F')
        child = spawn('/bin/bash', [cfg.engine].concat(args), { detached: true, stdio: 'ignore' })
      } else {
        // Windows 语速 = SAPI 刻度（-10 到 10，0 = 正常；负值变慢），直接透传，
        // 不要把 0/负值替换成 1（否则无法回到正常语速/减慢）。
        // 不传任何嗓音参数：引擎用系统默认 SAPI 嗓音，换嗓音请在 Windows 设置里改。
        const winArgs = ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', cfg.engine, '-File', tmp, '-Volume', String(cfg.volume), '-Rate', String(cfg.rate), '-MaxChars', String(cfg.maxChars), '-LongTextMode', cfg.longTextMode, '-LongTextMessage', cfg.longTextMessage, '-CleanMarkdownFormatting', cfg.cleanMarkdownFormatting ? '1' : '0', '-ReadInlineCode', cfg.readInlineCode ? '1' : '0', '-CodeBlocks', cfg.codeBlocks, '-CodeBlockMaxChars', String(cfg.codeBlockMaxChars), '-CodeBlockReplacementText', cfg.codeBlockReplacementText, '-FullRead', fullRead ? '1' : '0']
        child = spawn('powershell.exe', winArgs, { windowsHide: true, stdio: 'ignore' })
        log('engine spawn: powershell.exe')
      }
      const token = ++speechToken
      activeSpeech = { process: child, tmp, token, item, gapMs: item.gapMs || 0 }
      publishState()
      const settle = () => {
        removeTemp(tmp)
        if (!activeSpeech || activeSpeech.token !== token) return
        const gap = activeSpeech.gapMs || 0
        activeSpeech = null
        publishState()
        const proceed = () => {
          gapTimer = null
          if (replacement) {
            const next = replacement
            replacement = null
            startOne(next)
          } else {
            startNext()
          }
        }
        // 队列项之间可配置停顿（如多个提问之间留 2 秒）
        if (gap > 0) {
          gapTimer = setTimeout(proceed, gap)
        } else {
          proceed()
        }
      }
      child.once('exit', settle)
      child.once('error', settle)
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/speech-hook.js:480-513](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L480-L513)

FIFO入口、停止与替换。

<details>
<summary>查看原文（34行）</summary>

```text
    function enqueue(item) {
      if (!item || !item.text || !item.text.trim()) return
      speechQueue.push(item)
      publishState()
      startNext()
    }
    function stopActive() {
      const active = activeSpeech
      if (!active) return false
      try {
        if (process.platform === 'darwin' && active.process.pid) process.kill(-active.process.pid, 'SIGTERM')
        else active.process.kill()
      } catch (e) { log('stop speech failed:', e.message) }
      return true
    }
    function clearAndStop() {
      if (gapTimer) { clearTimeout(gapTimer); gapTimer = null }
      speechQueue.length = 0
      publishState()
      return stopActive()
    }
    function replaceWith(item) {
      if (gapTimer) { clearTimeout(gapTimer); gapTimer = null }
      speechQueue.length = 0
      replacement = item
      publishState()
      if (!activeSpeech) {
        const next = replacement
        replacement = null
        startOne(next)
        return
      }
      stopActive()
    }
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/speech-hook.js:602-655](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L602-L655)

真实提问/审批解析和入队。

<details>
<summary>查看原文（54行）</summary>

```text
        // tool-call round: ask_user_question announces the parsed question; any
        // other tool call cancels the pending throttled narration
        if (type === 'tool/call') {
          if (event.data && event.data.name === 'ask_user_question' && cfg.announceQuestions) {
            let items = []
            try {
              const args = JSON.parse(event.data.arguments || '{}')
              const questions = Array.isArray(args.questions) ? args.questions : []
              // 每个问题单独入队播报：带"问题N"序号（多问题时）与"选项N"序号
              // （序号用数字，与 UI 的自动编号一致；中文 TTS 自然读成"一/二/三"）
              items = questions.map((question, qi) => {
                const mode = question.multi_select ? '多选' : '单选'
                const opts = Array.isArray(question.options) ? question.options : []
                const optText = opts.map((option, oi) => {
                  const label = option && option.label ? String(option.label) : ''
                  return label ? `选项${oi + 1}，${label}` : ''
                }).filter(Boolean).join('；')
                const head = questions.length > 1 ? `问题${qi + 1}，` : ''
                // question 文案已含"单选/多选"字样时不再追加模式后缀，避免重复
                const modeSuffix = /单选|多选/.test(question.question || '') ? '' : `（${mode}）`
                const body = [question.question || '', modeSuffix, optText ? '，' + optText : ''].join('')
                return (head + body).trim()
              }).filter(Boolean)
            } catch (e) { /* ignore malformed arguments */ }
            if (items.length > 0) {
              cancelPending()
              // 问题已单独播报，标记当前最后文本为已播，避免 turn/end 兜底重复
              lastSpokenText = lastText
              // 多条问题按 FIFO 串行播报，之间停顿 cfg.questionGapMs（默认 2 秒）
              const gap = cfg.questionGapMs > 0 && items.length > 1 ? cfg.questionGapMs : 0
              items.forEach((itemText, i) => {
                const item = hostItem('question', session, event, itemText, null)
                item.gapMs = i < items.length - 1 ? gap : 0
                enqueue(item)
              })
            }
            return
          }
          cancelPending()
          return
        }
        // approval requested: announce right away
        if (type === 'approval/asked' && cfg.announceApprovals) {
          cancelPending()
          let reason = String((event.data && event.data.reason) || '')
          if (cfg.stripApprovalPrefix) {
            // 通用剥离行首"动作标签: "前缀（英文动作短语 + 冒号，如
            // "Store decision fact in workspace memory (dsh-speak): <内容>"、
            // "escalate sandbox to danger-full-access: <原因>"），只念冒号后的
            // 具体内容；中文开头或无冒号的 reason 原样保留（如"删除 xxx"）。
            reason = reason.replace(/^[A-Za-z][^:：\n]*?[:：]\s*/, '').trim()
          }
          enqueue(hostItem('approval', session, event, reason || '需要你的审批，请查看界面。', null))
          return
```

</details>

**依据 4 · 源码核查**：[engine/speak.sh:128-132](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/engine/speak.sh#L128-L132)

macOS实际say调用。

```text

if [ "$FULL_READ" != "1" ] && [ "$MAX_CHARS" -gt 0 ] && [ "${#TEXT}" -gt "$MAX_CHARS" ]; then TEXT="$LONG_MSG"; fi
[ -n "$TEXT" ] || exit 0

say -r "$RATE" "$TEXT"
```

**依据 5 · 源码核查**：[engine/speak.ps1:173-205](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/engine/speak.ps1#L173-L205)

SAPI合成与长文分段。

<details>
<summary>查看原文（33行）</summary>

```text
# ---------- speak ----------
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Volume = $Volume
$synth.Rate = $Rate

# ---------- 完整朗读（FullRead，手动重播） ----------
# Windows SAPI 单次 Speak 有约 375-470 字上限，超长会静默失败；因此按句末
# 标点切成不超过 450 字的段，逐段朗读（自动播报不经过这里，走上面的守卫）。
$SPEAK_CHUNK = 400
if ($fullReadMode -and $text.Length -gt $SPEAK_CHUNK) {
    # 分句标点同样用 \u 转义（纯 ASCII 源码）
    $parts = [regex]::Split($text, '(?<=[\u3002\uff01\uff1f\uff1b.!?;])')
    $chunk = ''
    foreach ($part in $parts) {
        if ($part.Length -eq 0) { continue }
        if ($chunk.Length + $part.Length -gt $SPEAK_CHUNK) {
            if ($chunk) { $synth.Speak($chunk); $chunk = '' }
            # 单段仍超长：硬切
            while ($part.Length -gt $SPEAK_CHUNK) {
                $synth.Speak($part.Substring(0, $SPEAK_CHUNK))
                $part = $part.Substring($SPEAK_CHUNK)
            }
            $chunk = $part
        } else {
            $chunk += $part
        }
    }
    if ($chunk) { $synth.Speak($chunk) }
} else {
    $synth.Speak($text)
}
exit 0
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 当前自动开关与双会话并发有什么边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

当前assistant/message在设置pendingText前检查automaticSpeech，因此关闭后新来的普通正文不会建立朗读定时器；不能继续说该分支完全不检查开关。但已建立timer的callback不再次检查automaticSpeech，volatile-update仅重读cfg而不清pending，故在等待期间关闭自动朗读仍可入队；startOne只重验enabled主开关。lastText、lastSpokenText、lastMessageId和timer为整个apply共享，另一个会话turn/start会清同一pending，turn/end也可能拿共享lastText配当前session，因而跨会话错配/漏播是源码可推出的风险。单实例guard防双挂重复播放但不提供会话分区。声音必须作为附加通道，不能作为唯一审批/完成依据。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/speech-hook.js:381-385](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L381-L385)

设置变化仅替换cfg。

```text
    // A settings write commits into the running fiber's config references and
    // emits this event; re-deriving cfg is what makes the edit audible without
    // restarting dsh.
    ctx.on('loader/volatile-update', () => {
      try { cfg = readConfig() } catch (e) { log('settings 变更应用失败:', e && e.message) }
```

**依据 2 · 源码核查**：[adapters/dsh/speech-hook.js:574-600](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L574-L600)

共享待播状态及任意会话turn/start清理。

<details>
<summary>查看原文（27行）</summary>

```text
    let timer = null
    let pendingText = ''
    /** 当前回合内最后一条助手消息文本（turn/end 兜底播报用） */
    let lastText = ''
    /** 已通过节流播报过的文本（防止 turn/end 兜底重复播报） */
    let lastSpokenText = ''
    /** 最后一条助手消息 id（兜底播报时带上） */
    let lastMessageId = null
    /** cancel a pending throttled announcement (default mode, tool-call round) */
    function cancelPending() {
      if (timer) { clearTimeout(timer); timer = null }
      pendingText = ''
    }

    ctx.on('session/event', (session, event) => {
      try {
        const type = event && event.type
        if (type !== 'assistant/chunk') {
          log('事件 type=', type, 'surfaceOp=', event && event.surfaceOp, 'seq=', event && event.seq)
        }
        // 新回合开始：清空上一回合的兜底状态，避免跨回合残留
        if (type === 'turn/start') {
          cancelPending()
          lastText = ''
          lastSpokenText = ''
          lastMessageId = null
          return
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/speech-hook.js:657-666](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L657-L666)

turn/end使用共享lastText构造当前session item。

<details>
<summary>查看原文（10行）</summary>

```text
        // 回合结束：兜底播报最终回复（被工具调用取消的节流文本在此补播，
        // 已播过的不重复），随后按需播报"第 N 轮对话完成"可选事件
        if (type === 'turn/end') {
          if (cfg.automaticSpeech && !cfg.queueAllMessages && lastText && lastText !== lastSpokenText) {
            const itemText = lastText
            const itemMessageId = lastMessageId
            cancelPending()
            lastText = ''
            lastSpokenText = itemText
            enqueue(hostItem('automatic', session, event, itemText, itemMessageId))
```

</details>

**依据 4 · 源码核查**：[adapters/dsh/speech-hook.js:753-770](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L753-L770)

新消息检查automaticSpeech，但timeout无二次检查。

<details>
<summary>查看原文（18行）</summary>

```text
        // default mode: throttle/merge the final reply; a tool/call cancels it,
        // and turn/end 兜底补播 lastText（见上方 turn/end 分支）。
        // lastText 的追踪无条件进行：turn/end 的「完成摘要」（speakTurnEndSummary）
        // 也要用它——若被 automaticSpeech 开关挡在赋值之前，关掉正文朗读时摘要
        // 会永远拿不到文本（2026-10-21 修复 1.8.2 漏检时引入的次生问题）。
        cancelPending()
        lastText = text
        lastMessageId = message && message.id ? String(message.id) : null
        if (!cfg.automaticSpeech) return
        pendingText = text
        timer = setTimeout(() => {
          if (!pendingText) return
          const itemText = pendingText
          pendingText = ''
          timer = null
          lastSpokenText = itemText
          enqueue(hostItem('automatic', session, event, itemText, lastMessageId))
        }, cfg.throttleMs)
```

</details>

#### 缺口

- 双会话交错和等待期间关开关的实际声音未复现。
  **影响**：不能把源码推导写成实机故障，仍足以限制多会话采用。
  **进一步探讨**：用两会话交错assistant/turn/start/end及timer前后切换设置，核声音内容、UI session与漏播；出现错配即保持手动重播。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 权限、隐私、平台与全周期成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

运行依赖本机TTS设备、macOS bash/perl/say或Windows PowerShell/System.Speech和对应系统默认音色；插件不选择云音色。没有新增LLM调用路径并不等于资源和人工零成本。控制POST和WS直接注册到webServer，源码handler没有身份admit；1MiB请求限制只控制正文大小，不能证明调用者被授权，远程Host必须核外层准入。文本临时全文、日志开头80字符和开放空间声音可能暴露内容；正常settle清临时文件，但崩溃残留和日志保留要用户处理。Config静态导出、volatile更新和重复row提示改善设置接线，仍依赖变化中的宿主API；作者tested范围不等于所有>=版本兼容。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/speech-hook.js:50-65](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L50-L65)

日志和引擎路径。

<details>
<summary>查看原文（16行）</summary>

```text
  try { fs.appendFileSync(LOG, `[${new Date().toISOString()}] ${args.join(' ')}\n`) } catch (e) { /* ignore */ }
}

const ENGINE_NAME = process.platform === 'darwin' ? 'speak.sh' : 'speak.ps1'

/**
 * Locate the engine script:
 *   1. explicit override (config `engine`)
 *   2. <this package>/engine/<speak.ps1|speak.sh> — repo checkout or profile install
 *   3. legacy file-copy location (~/.dsh/hooks/<speak.ps1|speak.sh>)
 */
function resolveEngine(override) {
  if (override) return override
  const bundled = path.join(__dirname, '..', '..', 'engine', ENGINE_NAME)
  if (fs.existsSync(bundled)) return bundled
  return path.join(os.homedir(), '.dsh', 'hooks', ENGINE_NAME)
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/speech-hook.js:327-385](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L327-L385)

static Config、单实例和volatile设置。

<details>
<summary>查看原文（59行）</summary>

```text
module.exports = {
  // Static settings form schema projected by the settings service (DSH >=
  // 0.1.7). Undefined when the schemastery peer cannot be resolved.
  Config: buildConfig(),

  apply(ctx, config) {
    // ---- duplicate-entry guard ----------------------------------------------
    // One profile must mount this plugin exactly ONCE. A second row with the same
    // id (or the legacy `speech-hook` id) is easy to create by accident — adding
    // `dsh-speak` to `dsh.profile.bundles` while the hand-written insert row is
    // still there is the usual way. Two live instances would mean two FIFO queues
    // announcing everything twice and two claims on the `/dsh-speak/ws` route.
    //
    // The claim is keyed on `globalThis`, not on a module variable: two rows may
    // name this file differently (a `file:///…` URL beside the bare package name)
    // and Node would then evaluate the module twice, each copy seeing its own
    // module-scope flag. The extra instance stays inert and says so in the log —
    // remove the duplicate row and reload to hand ownership over.
    //
    // This guard protects SPEECH only. A duplicated entry id also breaks the
    // settings page in a way this half cannot fix: DSH's config editor keeps only
    // uniquely-ided entries, so every write is refused with
    // `settings/rejected: Configuration for "dsh-speak" is overridden by a home
    // patch or command-line overlay` while speech keeps working. Hence the hint in
    // the log line below.
    const claim = Symbol.for('dsh-speak.active')
    if (globalThis[claim] !== undefined) {
      log('已有实例在运行，本行不再挂载（条目 id =', settingsNamespace(ctx),
        '）：请删掉重复的 dsh-speak 行后重载 —— 重复的 id 还会让设置页的写入被拒（overridden by a home patch）')
      return
    }
    globalThis[claim] = true
    ctx.effect(() => () => { if (globalThis[claim] === true) delete globalThis[claim] }, 'dsh-speak: single-instance claim')

    // Live configuration: the references inside `config` are updated in place
    // by a settings write, so cfg is re-derived from them (see below).
    const readConfig = () => resolveConfig(rawConfig(config))
    let cfg = readConfig()

    // ---- settings presentation ----------------------------------------------
    // This plugin ships a hand-written settings page (client/client.js), so the
    // entry opts out of the shell's automatically generated form — otherwise the
    // same fields would appear twice. Presentation-only and non-fatal: a host
    // without the settings service simply has no pages at all.
    ctx.inject(['settings'], scopedCtx => {
      if (!ctx.fiber) return
      try {
        scopedCtx.effect(() => scopedCtx.settings.configure({ auto: false }, ctx.fiber))
        log('settings 表单由 settings 服务投影（entry =', settingsNamespace(ctx), '，自动页面已关闭）')
      } catch (e) {
        log('settings.configure 失败，保留默认页面策略:', e && e.message)
      }
    })

    // A settings write commits into the running fiber's config references and
    // emits this event; re-deriving cfg is what makes the edit audible without
    // restarting dsh.
    ctx.on('loader/volatile-update', () => {
      try { cfg = readConfig() } catch (e) { log('settings 变更应用失败:', e && e.message) }
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/speech-hook.js:424-447](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L424-L447)

临时正文、前80字日志与清理。

<details>
<summary>查看原文（24行）</summary>

```text
      const tmp = path.join(os.tmpdir(), `dsh-speech-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.txt`)
      try { fs.writeFileSync(tmp, item.text, 'utf8') } catch (e) { log('write temp failed:', e.message); return false }
      log('speech start', item.source, item.sessionId || '-', item.turn == null ? '-' : item.turn, item.messageId || '-', item.text.slice(0, 80))
      let child
      // 手动重播完整朗读：replayFullRead 打开时，重播跳过 heading 截断完整朗读
      const fullRead = item.manual === true && cfg.replayFullRead === true
      if (process.platform === 'darwin') {
        const args = ['-f', tmp, '-m', String(cfg.maxChars), '-M', cfg.longTextMode, '-l', cfg.longTextMessage, '-C', cfg.cleanMarkdownFormatting ? '1' : '0', '-I', cfg.readInlineCode ? '1' : '0', '-B', cfg.codeBlocks, '-K', String(cfg.codeBlockMaxChars), '-R', cfg.codeBlockReplacementText]
        if (cfg.rate > 0) args.push('-r', String(cfg.rate))
        if (fullRead) args.push('-F')
        child = spawn('/bin/bash', [cfg.engine].concat(args), { detached: true, stdio: 'ignore' })
      } else {
        // Windows 语速 = SAPI 刻度（-10 到 10，0 = 正常；负值变慢），直接透传，
        // 不要把 0/负值替换成 1（否则无法回到正常语速/减慢）。
        // 不传任何嗓音参数：引擎用系统默认 SAPI 嗓音，换嗓音请在 Windows 设置里改。
        const winArgs = ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', cfg.engine, '-File', tmp, '-Volume', String(cfg.volume), '-Rate', String(cfg.rate), '-MaxChars', String(cfg.maxChars), '-LongTextMode', cfg.longTextMode, '-LongTextMessage', cfg.longTextMessage, '-CleanMarkdownFormatting', cfg.cleanMarkdownFormatting ? '1' : '0', '-ReadInlineCode', cfg.readInlineCode ? '1' : '0', '-CodeBlocks', cfg.codeBlocks, '-CodeBlockMaxChars', String(cfg.codeBlockMaxChars), '-CodeBlockReplacementText', cfg.codeBlockReplacementText, '-FullRead', fullRead ? '1' : '0']
        child = spawn('powershell.exe', winArgs, { windowsHide: true, stdio: 'ignore' })
        log('engine spawn: powershell.exe')
      }
      const token = ++speechToken
      activeSpeech = { process: child, tmp, token, item, gapMs: item.gapMs || 0 }
      publishState()
      const settle = () => {
        removeTemp(tmp)
```

</details>

**依据 4 · 源码核查**：[adapters/dsh/speech-hook.js:531-571](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L531-L571)

控制/WS准入未内建及卸载清理。

<details>
<summary>查看原文（41行）</summary>

```text
    // ---- WebSocket + control route (PR #2) ----
    ctx.inject(['webServer'], webCtx => {
      webCtx.effect(() => webCtx.webServer.registerUpgrade({
        path: '/dsh-speak/ws',
        handler: (req, socket, head) => speechWss.handleUpgrade(req, socket, head, client => {
          speechSockets.add(client)
          client.once('close', () => speechSockets.delete(client))
          client.once('error', () => speechSockets.delete(client))
          try { client.send(JSON.stringify(state())) } catch (e) { speechSockets.delete(client) }
        }),
      }), 'dsh-speak speech-state websocket')
      webCtx.effect(() => webCtx.webServer.register({
        kind: 'exact', path: '/dsh-speak/control', handler: async (req, res) => {
          const reply = (status, value) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(value)) }
          if (req.method !== 'POST' || !String(req.headers['content-type'] || '').startsWith('application/json')) { reply(405, { error: 'POST application/json required' }); return }
          try {
            const chunks = []; let size = 0
            for await (const chunk of req) { size += chunk.length; if (size > 1024 * 1024) throw new Error('request too large'); chunks.push(chunk) }
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
            if (body.action === 'status') { reply(200, state()); return }
            if (body.action === 'stop') {
              replacement = null
              clearAndStop()
              reply(200, state())
              return
            }
            if (body.action !== 'play' || typeof body.text !== 'string' || !body.text.trim()) { reply(400, { error: 'invalid control request' }); return }
            replaceWith({ source: 'manual', manual: true, sessionId: body.sessionId == null ? null : String(body.sessionId), turn: Number.isFinite(body.turn) ? body.turn : null, messageId: body.messageId == null ? null : String(body.messageId), text: body.text })
            reply(200, state())
          } catch (e) { reply(e.message === 'request too large' ? 413 : 400, { error: e.message }) }
        },
      }), 'dsh-speak replay control route')
    })

    ctx.effect(() => () => {
      replacement = null
      clearAndStop()
      for (const socket of speechSockets) { try { socket.close() } catch (e) { /* closed */ } }
      speechSockets.clear()
      try { speechWss.close() } catch (e) { /* closed */ }
    }, 'dsh-speak speech cleanup')
```

</details>

**依据 5 · 源码核查**：[package.json:58-64](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/package.json#L58-L64)

ws和宽Node/DSH声明。

```text
  "dependencies": {
    "ws": "^8.18.0"
  },
  "engines": {
    "node": ">=18",
    "dsh": ">=0.1.7-rc.2"
  },
```

#### 缺口

- 宿主外层认证、实际听觉与崩溃后的临时/日志残留未验证。
  **影响**：不适合直接用于敏感内容或公网共享Host；安装成本与退出清洁未知。
  **进一步探讨**：隔离profile核未登录控制、播放停止、设置持久与崩溃残留；敏感回复改静音并回看文字。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 现在如何采用，什么改进可证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前建议观察，不把语音作为唯一通道；单会话个人用户若只想方便重播，可以在隔离profile以非敏感文本试核声音和停止，再决定是否使用自动提醒。多会话和严格静音要求要先解决共享待播和在途开关问题。未验证假设是以session+turn分区pending状态，并在出队/播放前重新检查对应开关，审批/提问有有界优先级，可减少错配和关键请求排队。最小验证20组双会话交错事件，覆盖慢播、关闭自动/主开关、队列替换和卸载，比较错配、漏播、审批等待、最终回复饥饿与停止延迟。错配不归零或优先级使最终回复饥饿即否定方案；未验证假设不能算现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/speech-hook.js:574-600](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L574-L600)

共享状态是分区假设起点。

<details>
<summary>查看原文（27行）</summary>

```text
    let timer = null
    let pendingText = ''
    /** 当前回合内最后一条助手消息文本（turn/end 兜底播报用） */
    let lastText = ''
    /** 已通过节流播报过的文本（防止 turn/end 兜底重复播报） */
    let lastSpokenText = ''
    /** 最后一条助手消息 id（兜底播报时带上） */
    let lastMessageId = null
    /** cancel a pending throttled announcement (default mode, tool-call round) */
    function cancelPending() {
      if (timer) { clearTimeout(timer); timer = null }
      pendingText = ''
    }

    ctx.on('session/event', (session, event) => {
      try {
        const type = event && event.type
        if (type !== 'assistant/chunk') {
          log('事件 type=', type, 'surfaceOp=', event && event.surfaceOp, 'seq=', event && event.seq)
        }
        // 新回合开始：清空上一回合的兜底状态，避免跨回合残留
        if (type === 'turn/start') {
          cancelPending()
          lastText = ''
          lastSpokenText = ''
          lastMessageId = null
          return
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/speech-hook.js:753-770](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L753-L770)

播放前再检查开关的缺口。

<details>
<summary>查看原文（18行）</summary>

```text
        // default mode: throttle/merge the final reply; a tool/call cancels it,
        // and turn/end 兜底补播 lastText（见上方 turn/end 分支）。
        // lastText 的追踪无条件进行：turn/end 的「完成摘要」（speakTurnEndSummary）
        // 也要用它——若被 automaticSpeech 开关挡在赋值之前，关掉正文朗读时摘要
        // 会永远拿不到文本（2026-10-21 修复 1.8.2 漏检时引入的次生问题）。
        cancelPending()
        lastText = text
        lastMessageId = message && message.id ? String(message.id) : null
        if (!cfg.automaticSpeech) return
        pendingText = text
        timer = setTimeout(() => {
          if (!pendingText) return
          const itemText = pendingText
          pendingText = ''
          timer = null
          lastSpokenText = itemText
          enqueue(hostItem('automatic', session, event, itemText, lastMessageId))
        }, cfg.throttleMs)
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/speech-hook.js:480-513](https://github.com/Alan2Z/dsh-speak/blob/a29bf66a88a9f775769da3f0d380112751efd76f/adapters/dsh/speech-hook.js#L480-L513)

FIFO与替换为优先级约束基线。

<details>
<summary>查看原文（34行）</summary>

```text
    function enqueue(item) {
      if (!item || !item.text || !item.text.trim()) return
      speechQueue.push(item)
      publishState()
      startNext()
    }
    function stopActive() {
      const active = activeSpeech
      if (!active) return false
      try {
        if (process.platform === 'darwin' && active.process.pid) process.kill(-active.process.pid, 'SIGTERM')
        else active.process.kill()
      } catch (e) { log('stop speech failed:', e.message) }
      return true
    }
    function clearAndStop() {
      if (gapTimer) { clearTimeout(gapTimer); gapTimer = null }
      speechQueue.length = 0
      publishState()
      return stopActive()
    }
    function replaceWith(item) {
      if (gapTimer) { clearTimeout(gapTimer); gapTimer = null }
      speechQueue.length = 0
      replacement = item
      publishState()
      if (!activeSpeech) {
        const next = replacement
        replacement = null
        startOne(next)
        return
      }
      stopActive()
    }
```

</details>

#### 缺口

- 分区与优先级是否减少漏播而不增加干扰未知。
  **影响**：不能宣称已改善可靠性或省时。
  **进一步探讨**：同事件轨迹比较单FIFO和候选实现，记录准确内容/会话与人为中断；没有改善则保留手动重播。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
