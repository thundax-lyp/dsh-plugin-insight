# dsh-speak

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5c23e7d](https://github.com/Alan2Z/dsh-speak/tree/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee)

<!-- BEGIN META -->
[![GitHub ★ 18](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=18&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alan2Z/dsh-speak) [![npm 30d 1,635](https://img.shields.io/static/v1?label=npm+30d&message=1%2C635&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-speak) [![最新发布 2026-09-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-speak)
<!-- END META -->

> **功能**：为DSH提供最终回复、审批与提问的语音播报、消息重播和设置界面。

> **亮点**：相对手工复制文本调用系统TTS，增量是把最终回复筛选、审批/提问、FIFO重播和配置整合到DSH注意力交接流程。合成能力继承操作系统，队列与重播上游归属PR #2，不主张原创TTS或生态唯一。[Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：可靠提醒是否真受用户控制？默认assistant/message定时器不检查automaticSpeech，关闭自动朗读仍可能入队；全插件共享lastText/timer缺少会话隔离，可被另一会话开始事件取消或错配。此为源码推导而非运行复现，足以收窄采用范围。[Q04](#research-q04)

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
  - [Q01 · 什么场景需要语音，合格交付是什么？](#detail-section-11)
  - [Q02 · 事件如何转换为可控制的本地语音？](#detail-section-12)
  - [Q03 · 相比简单TTS包装的增量是什么？](#detail-section-13)
  - [Q04 · 能否依赖自动开关和多会话状态保证准确提醒？](#detail-section-14)
  - [Q05 · 启动与恢复由哪些依赖及人承担？](#detail-section-15)
  - [Q06 · 一个合格提醒的效果与总成本可知到什么程度？](#detail-section-16)
  - [Q07 · 哪些设计可复用，静态测试有哪些边界？](#detail-section-17)
  - [Q08 · 怎样把可靠提醒变成可证伪的改进假设？](#detail-section-18)
  - [Q09 · 当前是否值得采用，如何验证和退出？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向本机等待长任务、需要从屏幕之外获知结果或审批请求的个人使用者，交付可识别且可停止的声音提醒。[Q01](#research-q01)

简单基线是定期查看DSH网页或手工复制文本调用say/SAPI；没有固定宿主原生音频与竞品对照，因此不主张超越全部替代方案。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自动事件播报 | 回复结束、审批、提问提醒 | 仅text与已识别事件；自动开关/跨会话限制见Q04 |
| 消息重播/停止 | 主动复听与切换 | 宿主机器音频，不向远端浏览器传音 |
| FIFO与状态同步 | 单进程串行播放及UI提示 | 进程状态不等于声音送达 |
| 设置与本机TTS | 平台音色和长文处理 | API/平台版本依赖；长文可能替代提示 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途/必要性 | 失效与替代 |
|---|---|---|
| Node>=18、DSH>=0.1.7-rc.2 | 包声明启动环境；未验收 | 旧宿主不保证设置API兼容 |
| ws、schemastery与web服务 | 状态同步及设置 | peer缺失影响表单 |
| macOS bash/perl/say或Windows PowerShell/SAPI | 播放必需 | 自然音色可选，Linux无独立分支 |
| 宿主可用音频与隐私空间 | 效果必需 | 远程浏览器不会转发音频，保留网页确认 |

#### 启动步骤

| 步骤 | 执行者 | 成功判据/失败处理 |
|---|---|---|
| 安装并只选一种注册方式 | 用户 | 插件单实例加载；重复注册先移除 |
| 配置音色和profile选项 | 用户 | 重启后设置保留；旧配置检查顶层config |
| 验证短文、长文、提问与停止 | 用户 | 对应音频且关闭生效；失败停止采用 |
| 执行任务并在界面确认结果 | 用户与宿主 | 声音只作辅助通知，不替代任务验收 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工/时间 | 边界 |
|---|---|---|---|
| 首次 | 本机TTS与设备；金额未知 | 安装、单路注册、音色/设置验收，工时未知 | Node/DSH版本与平台需匹配 |
| 持续 | 本机进程与播放占用，未计量 | 回看长文、处理干扰，未知 | 无新增LLM计费入口不等于零成本 |
| 恢复/退出 | 重试资源未知 | 排查日志、漏播与进程，工时未知 | 计入失败尝试，不只统计成功播报 |

#### 效果

| 合格交付 | 实现支持 | 实际效果 | 验证条件 |
|---|---|---|---|
| 正确会话的可听提醒 | 事件过滤与本机TTS | 未测，存在共享状态限制 | 双会话交错事件与声音对应 |
| 可控制的重播/停止 | 宿主control与进程终止 | 未测，自动开关逻辑有缺口 | 关闭、停止、重新启动矩阵 |
| 降低盯屏时间 | 自动触发可能减少轮询 | 无收益测量 | 同任务统计响应时间/干扰/回看 |

> **思考**：可靠提醒是否真受用户控制？默认assistant/message定时器不检查automaticSpeech，关闭自动朗读仍可能入队；全插件共享lastText/timer缺少会话隔离，可被另一会话开始事件取消或错配。此为源码推导而非运行复现，足以收窄采用范围。[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手工复制文本调用系统TTS，增量是把最终回复筛选、审批/提问、FIFO重播和配置整合到DSH注意力交接流程。合成能力继承操作系统，队列与重播上游归属PR #2，不主张原创TTS或生态唯一。[Q02](#research-q02) [Q03](#research-q03)

文本通过临时文件传入引擎，避免把文本拼为shell代码；token和dispose约束旧进程回调与资源清理。mock测试不能证明音频成功；日志含前80字符且临时全文可能异常残留，需评估本地保密条件。[Q07](#research-q07)

<a id="detail-section-5"></a>

### 1.4 主要限制

可靠提醒是否真受用户控制？默认assistant/message定时器不检查automaticSpeech，关闭自动朗读仍可能入队；全插件共享lastText/timer缺少会话隔离，可被另一会话开始事件取消或错配。此为源码推导而非运行复现，足以收窄采用范围。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

观察。当前不把语音作为唯一审批或完成判断通道；修复自动开关及会话隔离后，以隔离profile验收播放、停止、设置持久和退出。[Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定版本源码；宿主语音集成贡献有材料支持，自动开关和跨会话隔离存在静态逻辑限制；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 adapters/dsh/speech-hook.js、client/client.js、engine/speak.sh、engine/speak.ps1、scripts/test-speech-hook.js、README.md、README.zh-CN.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定提交源码级核查，未安装、未执行目标代码或测试，未验证外部音色服务、宿主认证和实际声音。
- 下一步：本轮仅阅读源码。下一步先修复并静态回归automaticSpeech门控和session+turn状态隔离，再在固定宿主/OS中验证声音、响应时间、关停和卸载；未来设计实验见[Q08](#research-q08)。

**分析版本**

- **仓库**：[Alan2Z/dsh-speak](https://github.com/Alan2Z/dsh-speak)
- **版本号**：1.8.2（[固定提交 5c23e7d](https://github.com/Alan2Z/dsh-speak/tree/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee)）
- **版本日期**：2026-09-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：以session+turn分区待播状态，审批/提问优先并在播放前再次检查开关，可减少错配和关键请求等待。用两会话交错20组事件比较错配、漏播、饥饿和停止延迟；若错配不归零或最终回复饥饿则否定方案，不计入当前插件贡献。[Q08](#research-q08)

本轮仅阅读源码。下一步先修复并静态回归automaticSpeech门控和session+turn状态隔离，再在固定宿主/OS中验证声音、响应时间、关停和卸载；未来设计实验见[Q08](#research-q08)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 9 | 2771 | 1955 | 695 | — |
| .md | source | 4 | 1911 | — | — | 19817 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Alan2Z/dsh-speak/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Alan2Z/dsh-speak/issues?q=is%3Aissue+created%3A2026-09-23T05%3A06%3A15.400Z..2026-10-23T05%3A06%3A15.400Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Alan2Z/dsh-speak/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T05%3A06%3A15.400Z..2026-10-23T05%3A06%3A15.400Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的dsh-speak是否能把DSH任务结束与用户介入请求可靠转为语音，并解释其相对增量和采用边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么场景需要语音，合格交付是什么？

**研究主题**：场景与需求

#### 完整回答

作者面向等待长任务的AI编程用户，期望无需持续盯屏就知道最终回复、审批和提问。合格交付不是发出任何声音，而是在对应会话需用户介入或结束时，读出足以辨认的内容，且可停止、不漏关键请求。简单替代是用户定期看网页，或把选中文本交给系统TTS；后者不必安装DSH插件，但需要人工触发。该插件改变的是注意力交接，不产生代码交付物，也未证明视障无障碍完整性。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-38](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/README.md#L13-L38)

作者声明自动回复、审批提问、重播和队列用途

<details>
<summary>查看原文（26行）</summary>

```text
dsh-speak reads the final assistant reply aloud through system speech synthesis —
on Windows using natural voices (Windows 11 built-in, or
[NaturalVoiceSAPIAdapter] on Windows 10) with graceful fallback to stock voices;
on macOS using the built-in `say` (can follow a Siri natural voice). It was built
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
```

</details>

#### 缺口

- 没有独立用户频率和漏看率数据
  **影响**：需求强度与真实注意力收益未知
  **进一步探讨**：在单会话长任务中比较轮询与语音的响应时间及干扰次数

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 事件如何转换为可控制的本地语音？

**研究主题**：功能与机制

#### 完整回答

宿主监听session/event，visibleText只提取text块；默认助手消息经过节流，普通tool/call取消待播，turn/end对最后文本补播。审批原因及ask_user_question的题目选项分别入队。宿主维护FIFO和activeSpeech，同一时刻启动一个引擎子进程；退出或error后清理临时文件并继续。浏览器通过POST控制和WebSocket状态实现重播/停止，音频在宿主机器输出而非浏览器。macOS调用bash再调用say，其他平台走powershell.exe与SAPI。因此远程浏览器并不自动得到远端音频；Linux也未见独立引擎分支。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/speech-hook.js:462-476](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L462-L476)

text块过滤及携带会话标识

<details>
<summary>查看原文（15行）</summary>

```text
    function visibleText(message) {
      if (!message) return ''
      if (typeof message.content === 'string') return message.content
      if (!Array.isArray(message.content)) return ''
      return message.content.filter(block => block && block.type === 'text' && typeof block.text === 'string').map(block => block.text).join('')
    }
    function hostItem(source, session, event, text, messageId) {
      const sessionValue = session && (session.id != null ? session.id : session.sessionId)
      return {
        source,
        sessionId: sessionValue != null ? String(sessionValue) : null,
        turn: event && event.data && Number.isFinite(event.data.turn) ? event.data.turn : null,
        messageId: messageId == null ? null : String(messageId),
        text,
      }
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/speech-hook.js:371-419](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L371-L419)

临时文件、平台进程和退出清理

<details>
<summary>查看原文（49行）</summary>

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
        // 不要把 0/负值替换成 1（否则无法回到正常语速/减慢）
        child = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', cfg.engine, '-File', tmp, '-Volume', String(cfg.volume), '-Rate', String(cfg.rate), '-MaxChars', String(cfg.maxChars), '-LongTextMode', cfg.longTextMode, '-LongTextMessage', cfg.longTextMessage, '-CleanMarkdownFormatting', cfg.cleanMarkdownFormatting ? '1' : '0', '-ReadInlineCode', cfg.readInlineCode ? '1' : '0', '-CodeBlocks', cfg.codeBlocks, '-CodeBlockMaxChars', String(cfg.codeBlockMaxChars), '-CodeBlockReplacementText', cfg.codeBlockReplacementText, '-FullRead', fullRead ? '1' : '0'], { windowsHide: true, stdio: 'ignore' })
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
      return true
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/speech-hook.js:479-510](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L479-L510)

HTTP控制和WebSocket状态

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[adapters/dsh/speech-hook.js:552-614](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L552-L614)

提问、审批和回合兜底

<details>
<summary>查看原文（63行）</summary>

```text
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
        }
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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比简单TTS包装的增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

可识别的贡献是把事件筛选、串行语音、消息重播和实时配置组合成DSH工作流。手工调用say或SAPI仅完成文本转语音，不知道何时审批、哪个回复应播和何时取消；插件为这些条件提供适配层。队列/宿主状态降低了多个播放入口各自启动音频的冲突机会，但仍是常规FIFO与本地TTS集成，不构成新合成算法。源码顶部明确将回合重播、队列和WebSocket归于victorwads的PR #2，不应把全部能力归为单一作者原创。没有检查同类插件或当前DSH原生音频功能，故相对优势仅对手工朗读基线成立，不宣称生态独有。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/speech-hook.js:8-21](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L8-L21)

源码明确上游PR归属及组合机制

<details>
<summary>查看原文（14行）</summary>

```text
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

**依据 2 · 源码核查**：[engine/speak.sh:123-135](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/engine/speak.sh#L123-L135)

复用系统say而非自研TTS

<details>
<summary>查看原文（13行）</summary>

```text
# Retain all letters (including Portuguese accents) and numbers, while removing
# emoji/symbols that make the native synthesizer unreliable.
TEXT=$(printf '%s' "$TEXT" | /usr/bin/perl -CSD -pe '
  s/[^\p{L}\p{N}\p{Han}\x{3000}-\x{303F}\x{FF00}-\x{FFEF}\x{2000}-\x{206F}\x{20}-\x{7E}]//g;
  s/\s+/ /g;
')
TEXT=$(printf '%s' "$TEXT" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')

if [ "$FULL_READ" != "1" ] && [ "$MAX_CHARS" -gt 0 ] && [ "${#TEXT}" -gt "$MAX_CHARS" ]; then TEXT="$LONG_MSG"; fi
[ -n "$TEXT" ] || exit 0

if [ -n "$VOICE" ]; then say -v "$VOICE" -r "$RATE" "$TEXT"; else say -r "$RATE" "$TEXT"; fi
exit 0
```

</details>

#### 缺口

- 未固定并比较DSH原生能力和同类插件
  **影响**：无法主张独有优势或领先
  **进一步探讨**：另固定宿主与竞品版本，以相同任务比较

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否依赖自动开关和多会话状态保证准确提醒？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键质疑是用户能否信任自动播报的控制边界。支持面是master enabled在startOne中检查，事件有过滤与回合结束兜底。然而automaticSpeech仅约束queueAllMessages和turn/end分支，默认assistant/message分支仍无条件设置定时器并enqueue；按静态可达路径，cfg.enabled=true且automaticSpeech=false时，只要收到非空助手文本的append消息（或未设surfaceOp），并且throttle到期前没有tool/call或turn/start取消，仍会enqueue并尝试启动语音进程。这是源码可定位的控制逻辑缺陷，未作为运行复现。另一限制是timer、pendingText、lastText和lastSpokenText都在整个插件闭包共享，turn/start不按session分组：会话B开始可取消A的待播，交错结束可能将A的文本标为B会话。FIFO的串行播放不能修复前置事件状态混用。子进程settle也不检查退出码，WebSocket的speaking只表示进程状态，不能证明用户听到声音。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/speech-hook.js:521-548](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L521-L548)

全局单份待播状态及无会话隔离清空

<details>
<summary>查看原文（28行）</summary>

```text
    // ---- session event handling ----
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

**依据 2 · 源码核查**：[adapters/dsh/speech-hook.js:674-698](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L674-L698)

默认路径未检查automaticSpeech

<details>
<summary>查看原文（25行）</summary>

```text
        if (!event || type !== 'assistant/message') return
        if (event.surfaceOp && event.surfaceOp !== 'append') return
        const message = event.data && (event.data.message || event.data)
        const text = visibleText(message)
        if (!text.trim()) return

        // queueAllMessages mode (PR #2): enqueue every assistant message now
        if (cfg.queueAllMessages && cfg.automaticSpeech) {
          enqueue(hostItem('automatic', session, event, text, message && message.id))
          return
        }
        // default mode: throttle/merge the final reply; a tool/call cancels it,
        // and turn/end 兜底补播 lastText（见上方 turn/end 分支）
        cancelPending()
        pendingText = text
        lastText = text
        lastMessageId = message && message.id ? String(message.id) : null
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

**依据 3 · 源码核查**：[adapters/dsh/speech-hook.js:607-615](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L607-L615)

回合补播有开关检查，与定时器路径不同

```text
        if (type === 'turn/end') {
          if (cfg.automaticSpeech && !cfg.queueAllMessages && lastText && lastText !== lastSpokenText) {
            const itemText = lastText
            const itemMessageId = lastMessageId
            cancelPending()
            lastText = ''
            lastSpokenText = itemText
            enqueue(hostItem('automatic', session, event, itemText, itemMessageId))
          }
```

**依据 4 · 源码核查**：[adapters/dsh/speech-hook.js:394-418](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L394-L418)

settle未区分成功与失败退出

<details>
<summary>查看原文（25行）</summary>

```text
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

#### 缺口

- 缺少真实宿主交错事件和设置切换记录
  **影响**：实际触发频率与宿主是否串行事件未知
  **进一步探讨**：用两个会话交错发送start/message/end，并关闭automaticSpeech检查音频启动数

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动与恢复由哪些依赖及人承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

package声明Node>=18、DSH>=0.1.7-rc.2、ws与schemastery peer；web客户端依赖slots、timer、configForms、locale。这是版本声明，不是本轮兼容验收。macOS需要bash、perl与say，Windows需要PowerShell/System.Speech和可用音色，自然音色是额外条件而非所有播放的启动必需。只选bundle或手工insert一种注册方式，重复加载保护可防双播，但不能修复宿主设置id冲突。配置保存在profile，首次安装和升级旧配置都由用户维护。失败时先验证系统引擎，再检查注册、设置和临时日志；仅静态材料不能确定宿主统一认证是否覆盖插件控制路由，远程部署前需独立核查。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:58-73](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/package.json#L58-L73)

运行时与peer要求

<details>
<summary>查看原文（16行）</summary>

```text
  "dependencies": {
    "ws": "^8.18.0"
  },
  "engines": {
    "node": ">=18",
    "dsh": ">=0.1.7-rc.2"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Alan2Z/dsh-speak.git"
  },
  "author": "Alan2Z",
  "license": "MIT",
  "peerDependencies": {
    "@deepseek-ai/schemastery": "^3.18.1"
  },
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/speech-hook.js:283-310](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L283-L310)

单实例保护及重复id限制

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[client/client.js:175-177](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/client/client.js#L175-L177)

浏览器服务依赖

```text
    module.exports.inject = ['slots', 'timer', 'configForms', 'locale']
    module.exports.apply = function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-speak: dictionaries')
```

**依据 4 · 源码核查**：[engine/speak.sh:49-51](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/engine/speak.sh#L49-L51)

文本读取依赖perl

```text
if [ -n "$FILE" ]; then
  [ -f "$FILE" ] || exit 0
  TEXT=$(/usr/bin/perl -CSD -e 'print <>' "$FILE")
```

**依据 5 · 源码核查**：[adapters/dsh/speech-hook.js:479-510](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L479-L510)

本插件未自行实现路由认证，宿主边界未知

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

#### 缺口

- 未核实同版本DSH宿主认证契约是否覆盖本插件HTTP与WebSocket路由
  **影响**：不能确认远程控制接口的访问边界，远程部署建议受限
  **进一步探讨**：固定DSH版本，检查webServer路由与upgrade认证中间件契约及注册方式。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 一个合格提醒的效果与总成本可知到什么程度？

**研究主题**：效果与总成本

#### 完整回答

计量单位为一次正确会话的最终回复/审批提醒，必须可听、可停且未漏关键请求。源码使用本机TTS，没有引入LLM摘要服务或云语音API调用，因此未发现额外模型计费入口；这不等于系统音色/设备与人工成本为零。默认节流1500ms只是等待参数，不是端到端延迟测量。Windows默认长文限额可换成固定提示，macOS默认不限，因而“听完全文”不是统一默认交付标准。首次成本包括安装、单一路径注册、音色与设置验收；持续成本包括播放占用、干扰和人工回看；恢复成本包括漏播排查、日志检查及重新确认真实任务状态。漏播率、有效响应时间、恢复耗时和单位合格提醒现金金额都未知。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/speech-hook.js:157-188](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L157-L188)

节流与平台长文配置

<details>
<summary>查看原文（32行）</summary>

```text
function resolveConfig(value) {
  value = value || {}
  return {
    enabled: value.enabled !== false,
    automaticSpeech: value.automaticSpeech !== false,
    cleanMarkdownFormatting: value.cleanMarkdownFormatting !== false,
    readInlineCode: value.readInlineCode !== false,
    codeBlocks: ['all', 'smart', 'replace'].includes(value.codeBlocks) ? value.codeBlocks : 'smart',
    codeBlockMaxChars: configNumber('codeBlockMaxChars', value.codeBlockMaxChars, 300, 0, Number.MAX_SAFE_INTEGER),
    codeBlockReplacementText: String(value.codeBlockReplacementText || 'You can see the code in our history.'),
    queueAllMessages: value.queueAllMessages === true,
    throttleMs: configNumber('throttleMs', value.throttleMs, 1500, 0, Number.MAX_SAFE_INTEGER),
    replayFullRead: value.replayFullRead === true,
    engine: resolveEngine(value.engine || ''),
    announceApprovals: value.announceApprovals !== false,
    announceQuestions: value.announceQuestions !== false,
    stripApprovalPrefix: value.stripApprovalPrefix !== false,
    questionGapMs: configNumber('questionGapMs', value.questionGapMs, 2000, 0, Number.MAX_SAFE_INTEGER),
    longTextMode: value.longTextMode === 'heading' ? 'heading' : 'message',
    longTextMessage: String(value.longTextMessage || SCHEMA_DEFAULTS.longTextMessage),
    maxChars: configNumber('maxChars', value.maxChars, DEFAULT_MAX_CHARS, 0, Number.MAX_SAFE_INTEGER),
    volume: configNumber('volume', value.volume, 50, 0, 100),
    // Windows: SAPI scale -10..10. macOS: words per minute (0 = engine default),
    // where the engine passes -r only for a positive value anyway.
    rate: process.platform === 'darwin'
      ? configNumber('rate', value.rate, 0, 0, Number.MAX_SAFE_INTEGER)
      : configNumber('rate', value.rate, 0, -10, 10),
    announceTurnEnd: value.announceTurnEnd === true,
    announceCommandDone: value.announceCommandDone === true,
    announceGoalChange: value.announceGoalChange === true,
    announceToolErrors: value.announceToolErrors === true,
    announceTodoWrite: value.announceTodoWrite === true,
```

</details>

**依据 2 · 源码核查**：[engine/speak.sh:131-135](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/engine/speak.sh#L131-L135)

超长替代与本机say

```text
if [ "$FULL_READ" != "1" ] && [ "$MAX_CHARS" -gt 0 ] && [ "${#TEXT}" -gt "$MAX_CHARS" ]; then TEXT="$LONG_MSG"; fi
[ -n "$TEXT" ] || exit 0

if [ -n "$VOICE" ]; then say -v "$VOICE" -r "$RATE" "$TEXT"; else say -r "$RATE" "$TEXT"; fi
exit 0
```

**依据 3 · 源码核查**：[engine/speak.ps1:172-184](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/engine/speak.ps1#L172-L184)

本地System.Speech及自然音色选择

<details>
<summary>查看原文（13行）</summary>

```text
# ---------- speak ----------
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Volume = $Volume

# prefer a zh natural voice (NaturalVoiceSAPIAdapter-registered), fall back to any zh
$voices = $synth.GetInstalledVoices()
$voice = $voices | Where-Object {
    $_.VoiceInfo.Culture.Name -like 'zh*' -and
    ($_.VoiceInfo.Name + ' ' + $_.VoiceInfo.Description) -match 'Natural|Online'
} | Select-Object -First 1
if (-not $voice) { $voice = $voices | Where-Object { $_.VoiceInfo.Culture.Name -like 'zh*' } | Select-Object -First 1 }
if ($voice) { $synth.SelectVoice($voice.VoiceInfo.Name) }
```

</details>

#### 缺口

- 没有运行时延、漏播率及人工时间记录
  **影响**：无法量化节省时间或单位成本
  **进一步探讨**：同一批任务统计总尝试、正确提醒、响应时延、人工回看和恢复工时

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些设计可复用，静态测试有哪些边界？

**研究主题**：工程质量与复用

#### 完整回答

值得借鉴的是宿主适配与TTS引擎分离、文本经临时文件传递而非拼接shell命令、token保护旧子进程回调和统一队列控制。移植需重写事件映射、客户端槽位和配置服务接线，语音引擎仍受OS与音色限制。测试代码用mock spawn及事件ctx，能表达队列/事件预期，却不能证明扬声器声音、SAPI自然音色或当前宿主认证。源码同步追加日志，而且speech start记前80字符；全文写入os.tmpdir，正常退出清除，但异常中断可能残留。日志和声音都可能暴露私有内容，应将其作为试用条件。没有运行这些测试，也未做全仓安全审计。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/speech-hook.js:375-395](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L375-L395)

文本临时文件、前80字日志及token

<details>
<summary>查看原文（21行）</summary>

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
        // 不要把 0/负值替换成 1（否则无法回到正常语速/减慢）
        child = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', cfg.engine, '-File', tmp, '-Volume', String(cfg.volume), '-Rate', String(cfg.rate), '-MaxChars', String(cfg.maxChars), '-LongTextMode', cfg.longTextMode, '-LongTextMessage', cfg.longTextMessage, '-CleanMarkdownFormatting', cfg.cleanMarkdownFormatting ? '1' : '0', '-ReadInlineCode', cfg.readInlineCode ? '1' : '0', '-CodeBlocks', cfg.codeBlocks, '-CodeBlockMaxChars', String(cfg.codeBlockMaxChars), '-CodeBlockReplacementText', cfg.codeBlockReplacementText, '-FullRead', fullRead ? '1' : '0'], { windowsHide: true, stdio: 'ignore' })
      }
      const token = ++speechToken
      activeSpeech = { process: child, tmp, token, item, gapMs: item.gapMs || 0 }
      publishState()
      const settle = () => {
        removeTemp(tmp)
```

</details>

**依据 2 · 源码核查**：[scripts/test-speech-hook.js:20-40](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/scripts/test-speech-hook.js#L20-L40)

mock进程而非真实播放

<details>
<summary>查看原文（21行）</summary>

```text
// Capture spoken text via fs.writeFileSync; the queue writes a temp file per
// item before spawning the engine.
const announced = []
const origWrite = fs.writeFileSync
fs.writeFileSync = (file, text, enc) => {
  // only capture speech temp files (dsh-speech-<ts>-<rand>.txt), NOT the
  // diagnostic log (dsh-speech-hook.log) which also matches 'dsh-speech-'
  if (typeof file === 'string' && file.includes('dsh-speech-') && file.endsWith('.txt') && !file.includes('hook.log')) {
    announced.push(String(text))
  }
  return origWrite.call(fs, file, text, enc)
}

// Mock spawn: return an EventEmitter so the queue's settle() (exit) can fire.
const spawned = []
cp.spawn = (cmd, args, opts) => {
  const child = new EventEmitter()
  child.pid = 4242
  child.kill = () => { child.emit('exit', 0); return true }
  spawned.push({ cmd, args, child })
  return child
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/speech-hook.js:434-460](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L434-L460)

停止/替换及进程组终止

<details>
<summary>查看原文（27行）</summary>

```text
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
```

</details>

#### 缺口

- 未检验异常中断清理和日志留存权限
  **影响**：敏感文本残留规模未知
  **进一步探讨**：在隔离环境中终止宿主并检查临时文件与日志访问权限

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 怎样把可靠提醒变成可证伪的改进假设？

**研究主题**：新假设与验证

#### 完整回答

提出尚未实现、未验证的“按会话分区的待播状态与优先级提醒”假设。由Q04共享节流状态和Q06串行播放成本推导：把timer/lastText以session+turn为键保存，最终回复维持低优先级，审批/提问置高优先级；在调度时与播放前都检查自动开关，记录失败结果而不把进程退出等同已送达。相对现有FIFO增加了明确状态所有权和重要请求优先；代价是公平性、过期提醒丢弃及更多测试。最小验证固定两会话交错的20组事件，比较当前逻辑与分区实现，记录错配、漏播、重复、审批等待和停止延迟。若错配未降至0，或审批等待改善以大量最终回复永久饥饿为代价，应否定此设计；真实声音仍需独立验收，不由模拟结果替代。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/speech-hook.js:521-548](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L521-L548)

假设由共享状态限制推导

<details>
<summary>查看原文（28行）</summary>

```text
    // ---- session event handling ----
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

**依据 2 · 源码核查**：[adapters/dsh/speech-hook.js:421-432](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L421-L432)

当前单FIFO无优先级调度

<details>
<summary>查看原文（12行）</summary>

```text
    function startNext() {
      if (activeSpeech || replacement) return
      const item = speechQueue.shift()
      if (!item) { publishState(); return }
      publishState()
      startOne(item)
    }
    function enqueue(item) {
      if (!item || !item.text || !item.text.trim()) return
      speechQueue.push(item)
      publishState()
      startNext()
```

</details>

#### 缺口

- 改进设计未实现或执行
  **影响**：不能计入插件现有贡献与效果
  **进一步探讨**：先做事件序列模型验证，再做固定平台真实播放对照

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 当前是否值得采用，如何验证和退出？

**研究主题**：采用判断

#### 完整回答

当前建议观察，不建议直接持续安装。适合个人本机、允许公开发声且愿意做兼容排查的DSH使用者；不适合把语音作为唯一审批通道、多会话可靠告警或隐私敏感共享空间。观察的决定来自Q04控制开关与会话隔离缺陷，而不是创新低或缺少热度。后续可在隔离profile进行有界试用，先检查总开关/自动开关/停止，再覆盖短回复、长回复、审批、提问、双会话交错及宿主退出；验收必须确认对应音频、无串播、无残留进程和配置重启持久。任一关闭后仍自动播放、错会话或停不下来即停止试用。退出时移除对应profile注册和包，核查引擎进程结束，清理经用户确认的日志/临时文本。源码没有提供本轮已验收的卸载保证，因此不能使用install结论。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/speech-hook.js:513-519](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L513-L519)

dispose尝试停止并清理连接

```text
    ctx.effect(() => () => {
      replacement = null
      clearAndStop()
      for (const socket of speechSockets) { try { socket.close() } catch (e) { /* closed */ } }
      speechSockets.clear()
      try { speechWss.close() } catch (e) { /* closed */ }
    }, 'dsh-speak speech cleanup')
```

**依据 2 · 源码核查**：[adapters/dsh/speech-hook.js:674-698](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js#L674-L698)

自动开关限制直接影响建议

<details>
<summary>查看原文（25行）</summary>

```text
        if (!event || type !== 'assistant/message') return
        if (event.surfaceOp && event.surfaceOp !== 'append') return
        const message = event.data && (event.data.message || event.data)
        const text = visibleText(message)
        if (!text.trim()) return

        // queueAllMessages mode (PR #2): enqueue every assistant message now
        if (cfg.queueAllMessages && cfg.automaticSpeech) {
          enqueue(hostItem('automatic', session, event, text, message && message.id))
          return
        }
        // default mode: throttle/merge the final reply; a tool/call cancels it,
        // and turn/end 兜底补播 lastText（见上方 turn/end 分支）
        cancelPending()
        pendingText = text
        lastText = text
        lastMessageId = message && message.id ? String(message.id) : null
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

**依据 3 · 作者声明**：[README.zh-CN.md:427-444](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/README.zh-CN.md#L427-L444)

作者排障与日志位置

<details>
<summary>查看原文（18行）</summary>

```text
## 排障

| 现象 | 原因 | 解决 |
| ---- | ---- | ---- |
| 完全没有声音、无报错 | 未启用/安装自然语音 | Win11：在 设置 → 讲述人/语音 中启用自然语音；Win10：安装 NaturalVoiceSAPIAdapter 并下载语音包。直接测 `speak.ps1` |
| 长回复从不播报 | 适配器单次 `Speak` 有字数上限 | 已默认在 300 字处守卫——必要时调低 `-MaxChars` |
| 念到第二行就停/像是被切断 | `longTextMode: heading` 下，文本超过 `maxChars` 且整段没有 markdown 标题时，旧版引擎只念第一个非空行（1.8.0 之前） | 1.8.0 已修（改念"有头有尾的开头"）；想换策略可用 `message` 模式或调高 `maxChars` |
| 听到 `工具调用出错：Error: cannot read …` | "是否中文"的详情判据只检查"含有汉字"，英文报错里夹着中文目录名就能骗过它（1.8.0 引入的回归） | 1.8.0 已修——详情需满足"汉字数量多于拉丁字母数量" |
| 含大量 emoji 的文本静默 | SAPI 遇到 emoji 会静默失败 | 引擎已自动剥离 |
| 插件加载失败 | 插件名用了 Windows 原始路径 | 改用 `file:///C:/…` URL 形式（安装脚本会自动处理） |
| 升级到 1.8.2 后设置页不出现 | profile patch 那行写着 `disabled: true`，或条目 id 既不是 `dsh-speak` 也不是旧 id `speech-hook` | 去掉 `disabled`，并把 `id` 改成两者之一 |
| 设置页能开、但每次改动都被弹回 | DSH < 0.1.7（`configForms` 已取代 `settingsScope`） | 升级 DSH，或继续用 dsh-speak 1.8.1 |
| DSH 0.1.7+ 上每次改动都被弹回，且插件日志出现 `已有实例在运行` | 条目被注册了**两次**（例如包既在 `dsh.profile.bundles` 里、又手写了一行 `insert:`）：id 不再唯一，config-editor 会拒绝每次写入（`settings/rejected: Configuration for "dsh-speak" is overridden by a home patch or command-line overlay`）；语音照常工作，所以特别难查 | 只保留一种注册方式（见「方式 A」），然后重启 |
| 改完立刻生效，但重启后变回旧值 | `config:` 块嵌在 profile patch 的 `insert:` 行里——DSH 的 config-editor 只会就地改写**顶层**行，嵌套写入会被静默回滚（仍然回 `ok: true`） | 按「DSH 插件配置」把 `config` 放到顶层行；`python scripts/settings-ui-check.py` 会断言写入真的落盘 |
| macOS：音色突然变成"婷婷" | 打开过"朗读内容 / Siri 声音"设置面板导致系统朗读声音漂移 | 系统设置 → 辅助功能 → 阅读与朗读 → 系统声音 → ⓘ 入口重新选择 |
| macOS：在 `/tmp` 找不到日志 | `os.tmpdir()` 是 `/var/folders/.../T`，不是 `/tmp` | 日志在 `$TMPDIR/dsh-speech-hook.log` |

插件诊断日志：Windows `%TEMP%\dsh-speech-hook.log`；macOS `$TMPDIR/dsh-speech-hook.log`
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
