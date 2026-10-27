# dsh-dictation-hotkey

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8428219](https://github.com/AndyYang12345/dsh-dictation-hotkey/tree/8428219e3e23acd6387548ca7b5e900b081d160c)

<!-- BEGIN META -->
[![npm 30d 97](https://img.shields.io/static/v1?label=npm+30d&message=97&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dictation-hotkey) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dictation-hotkey)
<!-- END META -->

> **功能**：给 DSH Web 输入框增加按住或切换式语音热键，复用宿主转写并填入/可选发送。

> **亮点**：相对宿主麦克风按钮，增量是热键录音状态机、草稿原生插入与诊断；识别引擎归 DSH 语音 bundle，不能把识别性能算本包贡献。详见[Q01](#research-q01)。

> **主要限制**：转写前后多次取当前 active seat，旧 span 冲突会向当前 seat 重试；取消没有保存转写的 AbortController 或结果代次，可能跨会话插入/误发。详见[Q03](#research-q03)。

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
  - [Q01 · 语音热键替用户省去了什么，识别能力归谁？](#detail-section-11)
  - [Q02 · 从按键到音频、转写和草稿插入的时序如何形成？](#detail-section-12)
  - [Q03 · 异步转写结果是否始终落在开始录音的会话，取消是否终止推理？](#detail-section-13)
  - [Q04 · 首次、持续与失败恢复各需哪些资源和人工投入？](#detail-section-14)
  - [Q05 · 如何从 seat 竞态推导安全落点与取消机制？](#detail-section-15)
  - [Q06 · 现在该如何低风险试用并验收热键输入？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合希望少点麦克风按钮的 Web 用户；合格结果须落入预期会话并可校对。详见[Q01](#research-q01)。

宿主已有麦克风按钮和识别引擎；插件只增加热键交互与草稿接线，效果应对比同条件点击入口而非新识别模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 按住/切换录音 | 快速触发语音输入 | 需浏览器麦克风权限，热键可能冲突 |
| 宿主转写 | 将 WAV 交给 DSH speech Remote | 识别 bundle/provider 决定准确率和处理位置 |
| 填入/自动发送 | 修改当前 composer 草稿 | 异步会话归属未固定，建议先手动发送 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 与语音输入 bundle | 必需 | Composer 与 speech Remote | 只能报识别未挂载 |
| 麦克风权限/AudioWorklet | 录音必需 | 浏览器采集并编码 WAV | 无音频或权限失败 |
| 合适的热键与 provider | 使用需要 | 避免冲突并选转写路径 | 可能无响应/走非预期处理 |
| 人工校对 | 合格发送需要 | 修正识别和目标 | 自动发送可能误发 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户启用语音 bundle、授权麦克风、关闭 autoSend | speech 可用且热键不冲突 |
| 录音 | 按键说话并释放 | 音频时长/电平与提示合理 |
| 核稿 | 查看转写的会话、草稿和光标 | 文本正确才手动发送 |
| 异常 | 切会话/取消后检查无旧结果插入 | 若误入则撤回并停用自动发送 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH Web/语音 bundle/麦克风；金额未知 | 配权限、热键、provider 和发送模式；耗时未知 | 默认 autoSend=false |
| 持续使用 | 采集编码和 speech 推理 CPU/可能 provider 费用；数值未知 | 校对错字、处理热键冲突；频率未知 | 复用引擎不等于零成本 |
| 失败恢复 | 重试/撤回误发；金额未知 | 处理权限、空音、错落点和取消；耗时未知 | 在途转写无稳定取消 token |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 热键录音 | hold/toggle 状态机、短音诊断 | 实际浏览器兼容与节省时间 |
| 转写接入 | DSH speech Remote 请求与草稿插入 | provider 准确率、实际处理位置 |
| 自动发送 | 成功插入后可 submit | 切会话/取消下误发率 |

> **思考**：转写前后多次取当前 active seat，旧 span 冲突会向当前 seat 重试；取消没有保存转写的 AbortController 或结果代次，可能跨会话插入/误发。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对宿主麦克风按钮，增量是热键录音状态机、草稿原生插入与诊断；识别引擎归 DSH 语音 bundle，不能把识别性能算本包贡献。详见[Q01](#research-q01)。

键盘/录音/设置分层和原生草稿插入可借鉴；异步音频结果需绑定发起时身份与可取消代次。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

转写前后多次取当前 active seat，旧 span 冲突会向当前 seat 重试；取消没有保存转写的 AbortController 或结果代次，可能跨会话插入/误发。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，先关闭自动发送，在测试会话和慢转写场景核落点；敏感语音先核 provider 处理位置。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持热键、采集、转写与插入接线；跨会话落点/取消风险为源码推导，未真实宿主复现；改进假设未实现。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、host/index.js、client/src/controller.js、client/src/audio.js、client/src/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、package、host/index.js、client/src/controller.js 和相关前端入口；未执行目标测试/真实麦克风/宿主；旧 META 仅复用。
- 下一步：慢转写期间切会话/新建/改草稿/失焦取消，另测热键冲突与麦克风拒绝；记录实际落点、submit、音轨释放和修复时间。

**分析版本**

- **仓库**：[AndyYang12345/dsh-dictation-hotkey](https://github.com/AndyYang12345/dsh-dictation-hotkey)
- **版本号**：0.3.0（[固定提交 8428219](https://github.com/AndyYang12345/dsh-dictation-hotkey/tree/8428219e3e23acd6387548ca7b5e900b081d160c)）
- **版本日期**：2026-10-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是绑定录音开始的 session/seat/草稿代次，目标变化则待确认，并持有 abort token 与结果代次；慢转写切会话等夹具评估误发和确认成本。详见[Q05](#research-q05)。

慢转写期间切会话/新建/改草稿/失焦取消，另测热键冲突与麦克风拒绝；记录实际落点、submit、音轨释放和修复时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 3 | 575 | 474 | 65 | — |
| .md | source | 3 | 327 | — | — | 2628 |
| .js | source | 7 | 1242 | 984 | 189 | — |

</details>

**活跃度**

[![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AndyYang12345/dsh-dictation-hotkey/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A02%3A43.519Z..2026-10-21T08%3A02%3A43.519Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-10-21。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-dictation-hotkey 如何把热键录音交给宿主语音识别，异步结果是否安全落入原会话？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 语音热键替用户省去了什么，识别能力归谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户在 DSH Web 输入框希望按住或切换热键说话，让转写进入当前草稿，默认人工检查后发送。合格交付是识别结果落到预期会话/光标位置、不在切换或取消后误发，并对空录音/失败给清楚诊断。原有办法是点宿主麦克风或手工输入；插件新增键盘状态机、录音采集到宿主 speech Remote 的接线、原生 inputActions 插入和诊断。它没有新建识别模型或证明更高识别率，作者明确复用 DSH 语音 bundle 的本地 SenseVoice；“无额外进程/云费”仅限其默认部署声明，不表示麦克风、CPU、模型下载或其他 provider 成本为零。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-36](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/README.md#L1-L36)

作者说明热键、复用语音引擎、插入和诊断。

<details>
<summary>查看原文（36行）</summary>

````text
# dsh-dictation-hotkey

Press-to-talk dictation for the DSH Web composer. Hold a key combination, speak,
release — DSH's own speech engine transcribes it and the text lands in the
composer.

The plugin adds **no second recognizer**: it drives the speech Remote that DSH
already ships with its voice-input bundle (local SenseVoice, CPU) and inserts the
result through the official composer actions.

```
hold Ctrl+Shift+Space ──▶ speak ──▶ release
        │
        ├─ microphone capture in the page (getUserMedia + AudioWorklet, muted output)
        ├─ encoded as the canonical 16 kHz mono PCM16 WAV the Remote requires
        ├─ ctx.remote.speech.transcribe()      ← official speech Remote (SenseVoice)
        └─ inputActions.insertText() / submit() ← official composer
```

## What it does

- **Push to talk**: `hold` (record while held) or `toggle` (press to start, press
  to stop) trigger modes.
- **Fill or send**: insert the transcript for review, or submit it immediately.
- **Reuses DSH's engine**: the same local SenseVoice provider the official
  microphone button uses — no extra process, model download, or cloud API.
- **Composer-native insertion**: text is spliced into the live draft through
  `inputActions.insertText`, so the caret, references, and attachments survive.
- **Configurable per browser**: hotkey, mode, send behaviour, beeps, and
  diagnostics live in a popover on the composer pill (`localStorage`).
- **Works on the new-conversation screen too**: with no session open there is no
  composer draft to splice into, so the transcript is pasted into the focused
  composer as a normal edit, and the pill returns with the first session.
- **Diagnosable**: optional per-keystroke log with audio level, audio length, and
  inference time, which separates "nothing was picked up" from "the recognizer
  missed it".
````

</details>

**依据 2 · 源码核查**：[host/index.js:1-26](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/host/index.js#L1-L26)

Host 空 apply，功能主要在浏览器。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * Host half of `dsh-dictation-hotkey` — pure UI plugin, node side.
 *
 * This body does nothing on purpose, exactly like the shipped
 * `@deepseek-ai/dsh-client-ui-input-trigger` package: the empty `apply` exists
 * so the plugin appears in the host `cordis.yml`/Loader, and the browser half
 * ships through the `dsh.client` declaration in package.json plus the
 * `exports["./client"]` bundle. All behavior lives in the browser half.
 *
 * Two constraints are load-bearing here, both learned from failing Web boots:
 *
 * - **No `@deepseek-ai/*` import.** A profile installs this package with
 *   `pnpm add <dir>`, which resolves no dependencies for a linked package, so a
 *   host-side `import z from '@deepseek-ai/schemastery'` aborts activation with
 *   ERR_MODULE_NOT_FOUND and DSH refuses to boot the whole Web GUI.
 * - **No undeclared service access.** `ctx.config` and `ctx.connection` throw
 *   `cannot get property "<name>" without inject` unless this module declares
 *   them via `inject`; the Web composition provides no `config` service at all,
 *   so declaring it parks the entry as `pending (waiting for service: config)`.
 *   Doing nothing avoids both failure modes.
 */

export const name = 'dictation-hotkey'

/** Host plugin body: no host-side behavior for this UI-only plugin. */
export function apply() {}
```

</details>

**依据 3 · 源码核查**：[client/src/controller.js:114-157](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L114-L157)

hold/toggle 键盘状态机。

<details>
<summary>查看原文（44行）</summary>

```text
  onKeyDown(event) {
    const match = parseHotkey(settings().hotkey)
    if (matchesHotkey(event, match) === false) return
    event.preventDefault()
    event.stopPropagation()
    if (event.repeat) return
    if (this.phase === 'recording') {
      if (settings().mode === 'toggle') void this.finish()
      return
    }
    if (this.phase === 'starting' || this.phase === 'transcribing') return
    // Remember which physical keys are still down. Release is matched against
    // this set, never against the combination again (see onKeyUp).
    this.heldCodes = heldCodesOf(match)
    void this.start()
  }

  onKeyUp(event) {
    const match = parseHotkey(settings().hotkey)
    const isHotkeyKey = matchesHotkey(event, match)
    if (isHotkeyKey) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (settings().mode !== 'hold') return

    // Any key that took part in starting the recording ends it, even when the
    // human lets go of Space a moment before Ctrl. Requiring the exact
    // combination here used to lose whole utterances: releasing fast produced a
    // keyup that matched nothing, so `finish()` never ran and that recording
    // simply dangled.
    const held = this.heldCodes
    if ((this.phase === 'recording' || this.phase === 'starting') && held !== null) {
      if (isHotkeyKey || held.includes(event.code)) {
        event.preventDefault()
        this.heldCodes = null
        void this.finish()
      }
      return
    }
    if (isHotkeyKey && (this.phase === 'recording' || this.phase === 'starting')) {
      void this.finish()
    }
  }
```

</details>

#### 缺口

- 未与宿主麦克风按钮做同任务、同 provider 对照
  **影响**：不能证明输入速度、识别质量或降低点击数以外收益
  **进一步探讨**：在真实宿主记录热键/按钮任务完成、误识别和改错时长

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从按键到音频、转写和草稿插入的时序如何形成？

**研究主题**：功能与机制

#### 完整回答

Controller 在页面级监听 keydown/keyup/blur，hold 模式释放组合中任一物理键结束，toggle 再按结束；启动检查可写 seat，MicRecording 从浏览器麦克风取音频并编码 WAV。停止后等待尾音、排除空/过短录音，选 active seat 捕获插入 span，再用 speech.transcribe；成功后插入草稿，可选 autoSend，首页无 session 的 active-element 桥接只填入不自动发送。配置保存在浏览器 localStorage，Host apply 为空；实际识别远端由另一个 DSH bundle 提供。音频在浏览器采集并发送给 speech Remote，providerId 可改变实际处理位置，本轮未核用户部署。

#### 证据与依据

**依据 1 · 源码核查**：[client/src/controller.js:36-72](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L36-L72)

页面监听、seat 注册和 active 选择。

<details>
<summary>查看原文（37行）</summary>

```text
  /** @returns disposer removing every listener this controller installed. */
  attach() {
    document.addEventListener('keydown', this.boundKeyDown, true)
    document.addEventListener('keyup', this.boundKeyUp, true)
    window.addEventListener('blur', this.boundBlur)
    return () => {
      document.removeEventListener('keydown', this.boundKeyDown, true)
      document.removeEventListener('keyup', this.boundKeyUp, true)
      window.removeEventListener('blur', this.boundBlur)
      void this.cancel()
    }
  }

  /** @param seat - `{actions, locked}` from a mounted composer seat. */
  addSeat(seat) {
    this.seats.push(seat)
    return () => {
      const index = this.seats.indexOf(seat)
      if (index >= 0) this.seats.splice(index, 1)
    }
  }

  /**
   * The seat that should receive the transcript: the most recently mounted one
   * that can accept text. A session seat outranks the home-screen bridge, which
   * keeps working without any session at all.
   */
  active() {
    for (let i = this.seats.length - 1; i >= 0; i -= 1) {
      if (this.seats[i].mode !== 'active-element') return this.seats[i]
    }
    return this.seats.length === 0 ? null : this.seats[this.seats.length - 1]
  }

  /** True when the only seat is the session-less bridge. */
  sessionless() {
    return this.seats.length > 0 && this.seats.every((seat) => seat.mode === 'active-element')
```

</details>

**依据 2 · 源码核查**：[client/src/controller.js:114-157](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L114-L157)

热键触发与结束。

<details>
<summary>查看原文（44行）</summary>

```text
  onKeyDown(event) {
    const match = parseHotkey(settings().hotkey)
    if (matchesHotkey(event, match) === false) return
    event.preventDefault()
    event.stopPropagation()
    if (event.repeat) return
    if (this.phase === 'recording') {
      if (settings().mode === 'toggle') void this.finish()
      return
    }
    if (this.phase === 'starting' || this.phase === 'transcribing') return
    // Remember which physical keys are still down. Release is matched against
    // this set, never against the combination again (see onKeyUp).
    this.heldCodes = heldCodesOf(match)
    void this.start()
  }

  onKeyUp(event) {
    const match = parseHotkey(settings().hotkey)
    const isHotkeyKey = matchesHotkey(event, match)
    if (isHotkeyKey) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (settings().mode !== 'hold') return

    // Any key that took part in starting the recording ends it, even when the
    // human lets go of Space a moment before Ctrl. Requiring the exact
    // combination here used to lose whole utterances: releasing fast produced a
    // keyup that matched nothing, so `finish()` never ran and that recording
    // simply dangled.
    const held = this.heldCodes
    if ((this.phase === 'recording' || this.phase === 'starting') && held !== null) {
      if (isHotkeyKey || held.includes(event.code)) {
        event.preventDefault()
        this.heldCodes = null
        void this.finish()
      }
      return
    }
    if (isHotkeyKey && (this.phase === 'recording' || this.phase === 'starting')) {
      void this.finish()
    }
  }
```

</details>

**依据 3 · 源码核查**：[client/src/controller.js:159-275](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L159-L275)

音频采集、尾音/短音过滤、转写请求。

<details>
<summary>查看原文（117行）</summary>

```text
  async start() {
    const seat = this.active()
    if (seat === null || seat.locked === true) {
      record({ event: 'skip', reason: 'no seat or locked' })
      this.flash('当前会话不可输入')
      return
    }
    const config = settings()
    this.pendingStop = false
    this.setPhase('starting')
    const capture = new MicRecording()
    this.capture = capture
    const startedAt = performance.now()
    try {
      await capture.start()
      if (this.capture !== capture) {
        await capture.dispose()
        return
      }
      this.recordingSince = performance.now()
      record({
        event: 'start',
        micStartMs: Math.round(this.recordingSince - startedAt),
        heldCodes: this.heldCodes,
      })
      if (config.beep) beep('start')
      this.setPhase('recording')
      if (this.pendingStop) {
        this.pendingStop = false
        void this.finish()
      }
    } catch (failure) {
      this.capture = null
      this.pendingStop = false
      await capture.dispose()
      record({ event: 'mic-failed', message: describe(failure) })
      this.fail(`无法使用麦克风：${describe(failure)}`)
    }
  }

  async finish() {
    try {
      await this.finishInner()
    } catch (failure) {
      record({ event: 'finish-threw', message: describe(failure) })
      this.fail(`听写异常：${describe(failure)}`)
    }
  }

  async finishInner() {
    const capture = this.capture
    if (capture === null) {
      if (this.phase === 'starting') this.pendingStop = true
      return
    }
    this.capture = null
    const config = settings()
    const releasedAt = performance.now()
    const held = this.recordingSince === 0 ? 0 : releasedAt - this.recordingSince
    this.recordingSince = 0
    this.setPhase('transcribing')
    if (config.beep) beep('stop')

    record({ event: 'stop', heldMs: Math.round(held), tailMs: Number(config.tailMs) || 0 })
    // Let the tail of the last syllable finish: without this a fast release can
    // clip the final word, which reads as "sometimes it did not recognize".
    const tail = Math.max(0, Number(config.tailMs) || 0)
    if (tail > 0) await new Promise((resolve) => window.setTimeout(resolve, tail))

    let wav
    try {
      wav = await capture.stop()
    } catch (failure) {
      record({ event: 'encode-failed', message: describe(failure) })
      this.fail(`录音失败：${describe(failure)}`)
      return
    }
    const audioBytes = wav.byteLength - 44
    const audioSeconds = audioBytes / 32000
    const peakDb = capture.peak > 0 ? Number((20 * Math.log10(capture.peak)).toFixed(1)) : -Infinity
    const level = { peakDb, quiet: peakDb < -45 }
    if (audioBytes <= 0) {
      record({ event: 'skip', reason: 'empty audio', heldMs: Math.round(held), tailMs: tail })
      this.setPhase('idle')
      return
    }
    if (held < config.minRecordMs) {
      record({
        event: 'skip',
        reason: 'shorter than minRecordMs',
        heldMs: Math.round(held),
        minRecordMs: config.minRecordMs,
        audioSeconds: Number(audioSeconds.toFixed(2)),
      })
      this.flash(`按住时间太短（${Math.round(held)}ms）`)
      return
    }
    const seat = this.active()
    if (seat === null) {
      record({ event: 'skip', reason: 'seat disappeared', heldMs: Math.round(held) })
      this.setPhase('idle')
      return
    }
    const span = seat.actions.captureInsertion()
    const speech = this.speech()
    if (speech === undefined) {
      record({ event: 'skip', reason: 'speech remote absent', heldMs: Math.round(held) })
      this.fail('语音识别未挂载：请在插件管理里启用「语音输入」')
      return
    }
    const request = { audioBase64: toBase64(wav) }
    if (config.providerId !== '') request.providerId = config.providerId
    if (config.language !== '') request.language = config.language
    const sentAt = performance.now()
    try {
      const result = await speech.transcribe(request, new AbortController().signal)
      const inferenceMs = Math.round(performance.now() - sentAt)
```

</details>

**依据 4 · 源码核查**：[client/src/controller.js:287-328](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L287-L328)

插入和可选自动发送。

<details>
<summary>查看原文（42行）</summary>

```text
      const text = String(result.value?.text ?? '').trim()
      if (text === '') {
        record({
          event: 'empty-transcript',
          heldMs: Math.round(held),
          audioSeconds: Number(audioSeconds.toFixed(2)),
          inferenceMs,
          ...level,
        })
        this.setPhase('idle')
        this.flash(level.quiet ? '没听到声音（麦克风电平过低）' : '没有识别到内容')
        return
      }
      const target = this.active() ?? seat
      if (target.mode === 'active-element') {
        // No session yet: the transcript goes into whatever composer has focus,
        // and sending stays the user's keystroke, exactly as before.
        if (target.actions.insertText(text) === false) {
          record({ event: 'insert-failed', reason: 'no focused composer', chars: text.length })
          this.fail('没有找到可写入的输入框，请先点开一个会话')
          return
        }
      } else if (target.actions.insertText(text, span) === false) {
        if (target.actions.insertText(text, target.actions.captureInsertion()) === false) {
          record({ event: 'insert-conflict', chars: text.length })
          this.fail('输入框已被改动，文字未插入')
          return
        }
      } else if (config.autoSend) {
        target.actions.submit()
      }
      record({
        event: 'ok',
        heldMs: Math.round(held),
        audioSeconds: Number(audioSeconds.toFixed(2)),
        inferenceMs,
        chars: text.length,
        autoSend: config.autoSend,
        ...level,
      })
      this.setPhase('idle')
      this.flash(config.autoSend ? '已发送' : '已填入输入框')
```

</details>

**依据 5 · 作者声明**：[README.md:80-95](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/README.md#L80-L95)

作者配置默认值与浏览器存储。

<details>
<summary>查看原文（16行）</summary>

```text
## Settings

Stored per browser under `localStorage` key `dsh-dictation-hotkey.settings`.

| Field | Default | Meaning |
|---|---|---|
| `hotkey` | `Ctrl+Shift+Space` | `+`-separated combination; `Space`, `F9`, `Alt+~`, letters and digits are understood |
| `mode` | `hold` | `hold` = record while held, `toggle` = press to start/stop |
| `autoSend` | `false` | Submit the draft as soon as the transcript is inserted |
| `beep` | `true` | Short tones for start, stop, and failure |
| `language` | *(empty)* | Recognition language hint; empty follows the DSH speech settings |
| `providerId` | *(empty)* | Speech provider id; empty uses the deployment default |
| `minRecordMs` | `150` | Presses shorter than this are rejected with a visible notice |
| `tailMs` | `180` | Audio kept after release, so a fast release does not clip a syllable |
| `maxRecordSeconds` | `60` | Safety stop |
| `debug` | `false` | Keep the keystroke log |
```

</details>

#### 缺口

- 没有实际麦克风与 speech provider 运行证据
  **影响**：不能确认音频去向、识别速度和浏览器兼容
  **进一步探讨**：固定 provider 的隔离浏览器测权限、WAV、转写、光标与发送

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 异步转写结果是否始终落在开始录音的会话，取消是否终止推理？

**研究主题**：缺陷与关键质疑

#### 完整回答

start 只检查当时 active seat，finish 停止音频后又用 this.active() 取 seat 和 span；speech.transcribe 完成时再取 this.active() ?? seat。若等待期间用户切会话或新 seat 挂载，结果可能落到新目标。旧 span 插入失败还会以当前目标的新 captureInsertion 再试，可能把冲突变为新目标插入；autoSend 在成功主分支直接 submit。cancel 只清 capture 并重置 phase，转写调用所用 new AbortController().signal 未保存，也无结果代次检查，因此取消录音不能说明已取消在途识别/后续插入。这是源码竞态风险，未在真实宿主重现；实际 seat 实现的冲突保护可能阻挡部分路径，需通过时序夹具证实。

#### 证据与依据

**依据 1 · 源码核查**：[client/src/controller.js:159-170](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L159-L170)

开始时只检查 active seat。

<details>
<summary>查看原文（12行）</summary>

```text
  async start() {
    const seat = this.active()
    if (seat === null || seat.locked === true) {
      record({ event: 'skip', reason: 'no seat or locked' })
      this.flash('当前会话不可输入')
      return
    }
    const config = settings()
    this.pendingStop = false
    this.setPhase('starting')
    const capture = new MicRecording()
    this.capture = capture
```

</details>

**依据 2 · 源码核查**：[client/src/controller.js:256-275](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L256-L275)

停止后重新取 seat，转写使用未保存的控制器 signal。

<details>
<summary>查看原文（20行）</summary>

```text
    const seat = this.active()
    if (seat === null) {
      record({ event: 'skip', reason: 'seat disappeared', heldMs: Math.round(held) })
      this.setPhase('idle')
      return
    }
    const span = seat.actions.captureInsertion()
    const speech = this.speech()
    if (speech === undefined) {
      record({ event: 'skip', reason: 'speech remote absent', heldMs: Math.round(held) })
      this.fail('语音识别未挂载：请在插件管理里启用「语音输入」')
      return
    }
    const request = { audioBase64: toBase64(wav) }
    if (config.providerId !== '') request.providerId = config.providerId
    if (config.language !== '') request.language = config.language
    const sentAt = performance.now()
    try {
      const result = await speech.transcribe(request, new AbortController().signal)
      const inferenceMs = Math.round(performance.now() - sentAt)
```

</details>

**依据 3 · 源码核查**：[client/src/controller.js:299-316](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L299-L316)

结果时再取 active、冲突重试与 autoSend。

<details>
<summary>查看原文（18行）</summary>

```text
      }
      const target = this.active() ?? seat
      if (target.mode === 'active-element') {
        // No session yet: the transcript goes into whatever composer has focus,
        // and sending stays the user's keystroke, exactly as before.
        if (target.actions.insertText(text) === false) {
          record({ event: 'insert-failed', reason: 'no focused composer', chars: text.length })
          this.fail('没有找到可写入的输入框，请先点开一个会话')
          return
        }
      } else if (target.actions.insertText(text, span) === false) {
        if (target.actions.insertText(text, target.actions.captureInsertion()) === false) {
          record({ event: 'insert-conflict', chars: text.length })
          this.fail('输入框已被改动，文字未插入')
          return
        }
      } else if (config.autoSend) {
        target.actions.submit()
```

</details>

**依据 4 · 源码核查**：[client/src/controller.js:335-341](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L335-L341)

取消只处理当前 capture 与 phase。

```text
  async cancel() {
    const capture = this.capture
    this.capture = null
    this.recordingSince = 0
    if (capture !== null) await capture.dispose()
    if (this.phase !== 'idle') this.setPhase('idle')
  }
```

#### 缺口

- 未构造切会话/取消的真实时序与 seat 行为
  **影响**：不能断言每次都会错发或取消必然失败
  **进一步探讨**：延迟转写中切会话、改草稿、失焦取消，记录实际目标和是否 submit

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与失败恢复各需哪些资源和人工投入？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首次需 DSH Web 兼容版本、官方语音输入 bundle、浏览器麦克风权限和可用 AudioWorklet/安全上下文；包声明 Node ^22.19 或 >=24，peer 版本固定到 DSH 0.2.0-rc.2 相关包。首次还要选不冲突的热键、hold/toggle、自动发送和 provider。持续消耗麦克风采集、编码、speech provider 推理和修正误识别的时间；自动发送能省一步但提高误发成本。失败恢复涉及权限拒绝、空声、Speech Remote 缺失、超时或旧结果落错会话后的撤回；仅前端日志/提示不能替代恢复机制。金额、CPU、延迟、识别率、误发率和人工修复耗时未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-60](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/README.md#L38-L60)

作者的 Web/语音 bundle 前提与安装。

<details>
<summary>查看原文（23行）</summary>

````text
## Requirements

- DSH `0.2.0-rc.2` or a compatible release, Web profile.
- The official **voice input** bundle enabled (plugin manager → 语音输入). It
  provides the speech engine; without it the pill reports that no recognizer is
  mounted.

## Install

```sh
# from a checkout
dsh plugin --profile web add /path/to/dsh-dictation-hotkey

# or straight from git (no clone, no build: the bundle is committed)
dsh plugin --profile web add github:AndyYang12345/dsh-dictation-hotkey
```

Then reload the Web UI. The bundle is committed at `client/dist/client.js`, so a
checkout works without a build step.

Updating later: `dsh plugin --profile web add github:AndyYang12345/dsh-dictation-hotkey`
again and restart `dsh web` — a profile keeps its own copy of the installed
package, so pushing to GitHub does not update an already-installed profile by
````

</details>

**依据 2 · 源码核查**：[package.json:1-70](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/package.json#L1-L70)

Node、client 和 peer 包版本声明。

<details>
<summary>查看原文（70行）</summary>

```text
{
  "name": "dsh-dictation-hotkey",
  "version": "0.3.0",
  "description": "Press-to-talk dictation: a key combination records in the DSH Web page, DSH's own speech engine transcribes, and the text lands in the composer.",
  "license": "MIT",
  "type": "module",
  "main": "host/index.js",
  "exports": {
    ".": "./host/index.js",
    "./client": {
      "default": "./client/dist/client.js"
    },
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg",
    "./package.json": "./package.json"
  },
  "files": [
    "host",
    "client/dist",
    "cordis.patch.yml",
    "locale",
    "icon.svg",
    "README.md",
    "CHANGELOG.md"
  ],
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": false
    }
  },
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "build": "node build.mjs",
    "verify": "node verify.mjs",
    "test": "node test-release.mjs"
  },
  "keywords": [
    "dsh",
    "dsh-plugin",
    "dictation",
    "speech-to-text",
    "push-to-talk",
    "voice-input",
    "sensevoice",
    "web-ui"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AndyYang12345/dsh-dictation-hotkey.git"
  },
  "bugs": {
    "url": "https://github.com/AndyYang12345/dsh-dictation-hotkey/issues"
  },
  "homepage": "https://github.com/AndyYang12345/dsh-dictation-hotkey#readme",
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-experimental-speech-to-text": "0.2.0-rc.2",
    "@deepseek-ai/dsh-experimental-api-speech-to-text": "0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-conversation": "0.2.0-rc.2"
  },
  "devDependencies": {
    "esbuild": "^0.25.0"
  }
```

</details>

**依据 3 · 源码核查**：[client/src/controller.js:236-275](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L236-L275)

音频时长/电平和转写路径。

<details>
<summary>查看原文（40行）</summary>

```text
    const audioBytes = wav.byteLength - 44
    const audioSeconds = audioBytes / 32000
    const peakDb = capture.peak > 0 ? Number((20 * Math.log10(capture.peak)).toFixed(1)) : -Infinity
    const level = { peakDb, quiet: peakDb < -45 }
    if (audioBytes <= 0) {
      record({ event: 'skip', reason: 'empty audio', heldMs: Math.round(held), tailMs: tail })
      this.setPhase('idle')
      return
    }
    if (held < config.minRecordMs) {
      record({
        event: 'skip',
        reason: 'shorter than minRecordMs',
        heldMs: Math.round(held),
        minRecordMs: config.minRecordMs,
        audioSeconds: Number(audioSeconds.toFixed(2)),
      })
      this.flash(`按住时间太短（${Math.round(held)}ms）`)
      return
    }
    const seat = this.active()
    if (seat === null) {
      record({ event: 'skip', reason: 'seat disappeared', heldMs: Math.round(held) })
      this.setPhase('idle')
      return
    }
    const span = seat.actions.captureInsertion()
    const speech = this.speech()
    if (speech === undefined) {
      record({ event: 'skip', reason: 'speech remote absent', heldMs: Math.round(held) })
      this.fail('语音识别未挂载：请在插件管理里启用「语音输入」')
      return
    }
    const request = { audioBase64: toBase64(wav) }
    if (config.providerId !== '') request.providerId = config.providerId
    if (config.language !== '') request.language = config.language
    const sentAt = performance.now()
    try {
      const result = await speech.transcribe(request, new AbortController().signal)
      const inferenceMs = Math.round(performance.now() - sentAt)
```

</details>

**依据 4 · 源码核查**：[client/src/controller.js:287-352](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L287-L352)

插入、发送、取消及诊断。

<details>
<summary>查看原文（66行）</summary>

```text
      const text = String(result.value?.text ?? '').trim()
      if (text === '') {
        record({
          event: 'empty-transcript',
          heldMs: Math.round(held),
          audioSeconds: Number(audioSeconds.toFixed(2)),
          inferenceMs,
          ...level,
        })
        this.setPhase('idle')
        this.flash(level.quiet ? '没听到声音（麦克风电平过低）' : '没有识别到内容')
        return
      }
      const target = this.active() ?? seat
      if (target.mode === 'active-element') {
        // No session yet: the transcript goes into whatever composer has focus,
        // and sending stays the user's keystroke, exactly as before.
        if (target.actions.insertText(text) === false) {
          record({ event: 'insert-failed', reason: 'no focused composer', chars: text.length })
          this.fail('没有找到可写入的输入框，请先点开一个会话')
          return
        }
      } else if (target.actions.insertText(text, span) === false) {
        if (target.actions.insertText(text, target.actions.captureInsertion()) === false) {
          record({ event: 'insert-conflict', chars: text.length })
          this.fail('输入框已被改动，文字未插入')
          return
        }
      } else if (config.autoSend) {
        target.actions.submit()
      }
      record({
        event: 'ok',
        heldMs: Math.round(held),
        audioSeconds: Number(audioSeconds.toFixed(2)),
        inferenceMs,
        chars: text.length,
        autoSend: config.autoSend,
        ...level,
      })
      this.setPhase('idle')
      this.flash(config.autoSend ? '已发送' : '已填入输入框')
    } catch (failure) {
      record({ event: 'transcribe-failed', message: describe(failure) })
      this.fail(`识别失败：${describe(failure)}`)
    }
  }

  async cancel() {
    const capture = this.capture
    this.capture = null
    this.recordingSince = 0
    if (capture !== null) await capture.dispose()
    if (this.phase !== 'idle') this.setPhase('idle')
  }

  flash(text) {
    this.setPhase('notice', text)
    window.setTimeout(() => {
      if (this.phase === 'notice') this.setPhase('idle')
    }, 1800)
  }

  fail(text) {
    if (settings().beep) beep('error')
    this.flash(text)
```

</details>

#### 缺口

- provider 实际费用/资源和用户修正成本未测
  **影响**：不能称低成本或提高效率
  **进一步探讨**：同条件测录音、推理、校对、失败重试与撤回耗时

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何从 seat 竞态推导安全落点与取消机制？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

热键、录音、配置和插入分层，物理键释放状态与短音/低电平诊断可借鉴；原生 inputActions 保留草稿结构。但异步结果的归属依赖当下 active seat，缺稳定录音身份。未验证方向是在录音开始时绑定 sessionId/seatId 与草稿代次，转写完成先校验同一 seat 与可插入代次；目标变更时放入待确认缓冲，让用户选择放回原会话或丢弃。持有一个 AbortController，取消时中止请求并使结果代次失效；即使 provider 不支持中止，代次也阻止后续插入。最小实验用慢转写、切会话、新建会话、改草稿、失焦和重复热键，比较错目标/误发、漏插与操作耗时。方案未实现。

#### 证据与依据

**依据 1 · 源码核查**：[client/src/controller.js:36-72](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L36-L72)

seat 注册与活动 seat 选择。

<details>
<summary>查看原文（37行）</summary>

```text
  /** @returns disposer removing every listener this controller installed. */
  attach() {
    document.addEventListener('keydown', this.boundKeyDown, true)
    document.addEventListener('keyup', this.boundKeyUp, true)
    window.addEventListener('blur', this.boundBlur)
    return () => {
      document.removeEventListener('keydown', this.boundKeyDown, true)
      document.removeEventListener('keyup', this.boundKeyUp, true)
      window.removeEventListener('blur', this.boundBlur)
      void this.cancel()
    }
  }

  /** @param seat - `{actions, locked}` from a mounted composer seat. */
  addSeat(seat) {
    this.seats.push(seat)
    return () => {
      const index = this.seats.indexOf(seat)
      if (index >= 0) this.seats.splice(index, 1)
    }
  }

  /**
   * The seat that should receive the transcript: the most recently mounted one
   * that can accept text. A session seat outranks the home-screen bridge, which
   * keeps working without any session at all.
   */
  active() {
    for (let i = this.seats.length - 1; i >= 0; i -= 1) {
      if (this.seats[i].mode !== 'active-element') return this.seats[i]
    }
    return this.seats.length === 0 ? null : this.seats[this.seats.length - 1]
  }

  /** True when the only seat is the session-less bridge. */
  sessionless() {
    return this.seats.length > 0 && this.seats.every((seat) => seat.mode === 'active-element')
```

</details>

**依据 2 · 源码核查**：[client/src/controller.js:256-275](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L256-L275)

span 和未保存的 signal。

<details>
<summary>查看原文（20行）</summary>

```text
    const seat = this.active()
    if (seat === null) {
      record({ event: 'skip', reason: 'seat disappeared', heldMs: Math.round(held) })
      this.setPhase('idle')
      return
    }
    const span = seat.actions.captureInsertion()
    const speech = this.speech()
    if (speech === undefined) {
      record({ event: 'skip', reason: 'speech remote absent', heldMs: Math.round(held) })
      this.fail('语音识别未挂载：请在插件管理里启用「语音输入」')
      return
    }
    const request = { audioBase64: toBase64(wav) }
    if (config.providerId !== '') request.providerId = config.providerId
    if (config.language !== '') request.language = config.language
    const sentAt = performance.now()
    try {
      const result = await speech.transcribe(request, new AbortController().signal)
      const inferenceMs = Math.round(performance.now() - sentAt)
```

</details>

**依据 3 · 源码核查**：[client/src/controller.js:299-341](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L299-L341)

结果落点、自动提交与取消。

<details>
<summary>查看原文（43行）</summary>

```text
      }
      const target = this.active() ?? seat
      if (target.mode === 'active-element') {
        // No session yet: the transcript goes into whatever composer has focus,
        // and sending stays the user's keystroke, exactly as before.
        if (target.actions.insertText(text) === false) {
          record({ event: 'insert-failed', reason: 'no focused composer', chars: text.length })
          this.fail('没有找到可写入的输入框，请先点开一个会话')
          return
        }
      } else if (target.actions.insertText(text, span) === false) {
        if (target.actions.insertText(text, target.actions.captureInsertion()) === false) {
          record({ event: 'insert-conflict', chars: text.length })
          this.fail('输入框已被改动，文字未插入')
          return
        }
      } else if (config.autoSend) {
        target.actions.submit()
      }
      record({
        event: 'ok',
        heldMs: Math.round(held),
        audioSeconds: Number(audioSeconds.toFixed(2)),
        inferenceMs,
        chars: text.length,
        autoSend: config.autoSend,
        ...level,
      })
      this.setPhase('idle')
      this.flash(config.autoSend ? '已发送' : '已填入输入框')
    } catch (failure) {
      record({ event: 'transcribe-failed', message: describe(failure) })
      this.fail(`识别失败：${describe(failure)}`)
    }
  }

  async cancel() {
    const capture = this.capture
    this.capture = null
    this.recordingSince = 0
    if (capture !== null) await capture.dispose()
    if (this.phase !== 'idle') this.setPhase('idle')
  }
```

</details>

#### 缺口

- 绑定代次/待确认缓冲未实现或做可用性评估
  **影响**：不能把零误发或更低恢复成本算现有功能
  **进一步探讨**：隔离原型按时序夹具测正确落点、误拦和额外确认负担

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现在该如何低风险试用并验收热键输入？

**研究主题**：采用判断

#### 完整回答

可先保持默认 autoSend=false，在非敏感测试会话验证按键、麦克风权限、短音/空声提示和转写后的光标位置；慢转写期间切会话与编辑草稿，确认不会落错。自动发送只有在结果落点与校对规则都确认后才考虑开启；敏感语音还需核实际 speech provider 的处理位置。采用建议 observe，原因是跨会话异步与取消边界未核，且本轮未执行目标代码或真实宿主。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:80-95](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/README.md#L80-L95)

默认自动发送关闭及配置说明。

<details>
<summary>查看原文（16行）</summary>

```text
## Settings

Stored per browser under `localStorage` key `dsh-dictation-hotkey.settings`.

| Field | Default | Meaning |
|---|---|---|
| `hotkey` | `Ctrl+Shift+Space` | `+`-separated combination; `Space`, `F9`, `Alt+~`, letters and digits are understood |
| `mode` | `hold` | `hold` = record while held, `toggle` = press to start/stop |
| `autoSend` | `false` | Submit the draft as soon as the transcript is inserted |
| `beep` | `true` | Short tones for start, stop, and failure |
| `language` | *(empty)* | Recognition language hint; empty follows the DSH speech settings |
| `providerId` | *(empty)* | Speech provider id; empty uses the deployment default |
| `minRecordMs` | `150` | Presses shorter than this are rejected with a visible notice |
| `tailMs` | `180` | Audio kept after release, so a fast release does not clip a syllable |
| `maxRecordSeconds` | `60` | Safety stop |
| `debug` | `false` | Keep the keystroke log |
```

</details>

**依据 2 · 源码核查**：[client/src/controller.js:299-341](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/client/src/controller.js#L299-L341)

结果时动态选目标与取消边界。

<details>
<summary>查看原文（43行）</summary>

```text
      }
      const target = this.active() ?? seat
      if (target.mode === 'active-element') {
        // No session yet: the transcript goes into whatever composer has focus,
        // and sending stays the user's keystroke, exactly as before.
        if (target.actions.insertText(text) === false) {
          record({ event: 'insert-failed', reason: 'no focused composer', chars: text.length })
          this.fail('没有找到可写入的输入框，请先点开一个会话')
          return
        }
      } else if (target.actions.insertText(text, span) === false) {
        if (target.actions.insertText(text, target.actions.captureInsertion()) === false) {
          record({ event: 'insert-conflict', chars: text.length })
          this.fail('输入框已被改动，文字未插入')
          return
        }
      } else if (config.autoSend) {
        target.actions.submit()
      }
      record({
        event: 'ok',
        heldMs: Math.round(held),
        audioSeconds: Number(audioSeconds.toFixed(2)),
        inferenceMs,
        chars: text.length,
        autoSend: config.autoSend,
        ...level,
      })
      this.setPhase('idle')
      this.flash(config.autoSend ? '已发送' : '已填入输入框')
    } catch (failure) {
      record({ event: 'transcribe-failed', message: describe(failure) })
      this.fail(`识别失败：${describe(failure)}`)
    }
  }

  async cancel() {
    const capture = this.capture
    this.capture = null
    this.recordingSince = 0
    if (capture !== null) await capture.dispose()
    if (this.phase !== 'idle') this.setPhase('idle')
  }
```

</details>

**依据 3 · 作者声明**：[README.md:38-43](https://github.com/AndyYang12345/dsh-dictation-hotkey/blob/8428219e3e23acd6387548ca7b5e900b081d160c/README.md#L38-L43)

语音 bundle 依赖。

```text
## Requirements

- DSH `0.2.0-rc.2` or a compatible release, Web profile.
- The official **voice input** bundle enabled (plugin manager → 语音输入). It
  provides the speech engine; without it the pill reports that no recognizer is
  mounted.
```

#### 缺口

- 浏览器/宿主中会话切换与 provider 路径未验
  **影响**：不能推荐默认开启自动发送
  **进一步探讨**：隔离真实宿主延迟识别测试后再决定

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
