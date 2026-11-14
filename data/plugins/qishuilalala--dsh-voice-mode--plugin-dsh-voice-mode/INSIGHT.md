# DSH Voice Mode

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a00fd6a](https://github.com/qishuilalala/dsh-voice-mode/tree/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/qishuilalala/dsh-voice-mode) [![npm 30d 11,672](https://img.shields.io/static/v1?label=npm+30d&message=11%2C672&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-voice-mode) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-voice-mode)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供语音转写、可编辑草稿、按句朗读和打断。

> **亮点**：[Q02](#research-q02) 支持分段合并及可编辑草稿，[Q03](#research-q03) 将打断落实到客户端、宿主当前回合和朗读队列。

> **主要限制**：[Q03](#research-q03) 的自动检测依赖回声条件与会话状态，[Q04](#research-q04) 的本地主机 ASR、默认在线合成和主模型具有不同网络边界。

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
  - [Q01 · 相对系统听写和手动朗读，语音模式能省掉哪些步骤？](#detail-section-11)
  - [Q02 · 从麦克风到可编辑草稿，哪些条件会阻止提早发送？](#detail-section-12)
  - [Q03 · 朗读和开口打断会影响哪些会话及请求？](#detail-section-13)
  - [Q04 · 宿主识别和本地 TTS 是否等于整轮离线？](#detail-section-14)
  - [Q05 · 什么样的试用足以观察误发送、错误打断及退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用 DSH 的用户能在会话中用语音形成可编辑指令，收听按句回复。[Q01](#research-q01)

系统听写和手动朗读可以组合，插件改变同一会话上的草稿、状态可见和打断的一体操作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 流式草稿 | 口述进入可编辑文本 | 需麦克风及宿主识别 |
| 按句朗读 | 收听选定会话回复 | 引擎决定网络去向 |
| 打断控制 | 取消朗读或接管回合 | 受会话身份、设备和回声条件影响 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 可用的 DSH 客户端及宿主 | 需要 | 挂 UI、ASR 和会话流 | 改用键盘或系统听写 |
| 麦克风和权限 | 转写需要 | 采样 | 无授权则文本输入 |
| 本地识别与所选合成引擎 | 相应阶段需要 | 识别及声音输出 | 关闭朗读或校核适配 |
| 宿主模型 | 正常对话或额外纠错 | 生成文本 | 保留人工编辑 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对麦克风、模型和朗读引擎 | 状态与数据出口可说明 |
| 转写与确认 | 在新会话口述无敏感问题后检查草稿 | 只发送一条正确指令 |
| 退出 | 尝试停止朗读或关闭模式 | 确认录音结束并核对会话记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型下载、存储和运行资源未计量 | 核对宿主、麦克风和网络 | 本地与在线路径分别记录 |
| 持续 | 识别、合成和模型调用用量未知 | 确认草稿、纠正口述 | 按一次合格对话计 |
| 恢复 | 重录和重跑开销未知 | 查状态与已发消息 | 异常时改用文本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 语音变草稿 | partial 及 final 有防重复分支 | 多设备准确率 |
| 回合内打断 | 客户端与宿主分层处理 | 真实回声及长延迟效果 |
| 数据去向 | 可配置本地合成，主模型独立 | 部署现场访问和价格 |

> **思考**：[Q03](#research-q03) 的自动检测依赖回声条件与会话状态，[Q04](#research-q04) 的本地主机 ASR、默认在线合成和主模型具有不同网络边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 支持分段合并及可编辑草稿，[Q03](#research-q03) 将打断落实到客户端、宿主当前回合和朗读队列。

[Q02](#research-q02) 的启动世代检查与 [Q03](#research-q03) 的队列 epoch 能约束迟到异步结果，移植需对齐宿主的回合边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的自动检测依赖回声条件与会话状态，[Q04](#research-q04) 的本地主机 ASR、默认在线合成和主模型具有不同网络边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 用无敏感口令验证一次真实草稿和回复。若出现重复发送、未退出采音或打断失效，停用语音并回到键盘。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码已核查采音、回合、发送和合成路径。识别精度、音质、时延与跨端权限待验证。

- 已检查：作者 README、包清单、源码路径 plugin/dsh-voice-mode/README.md、plugin/dsh-voice-mode/src/client.tsx、plugin/dsh-voice-mode/src/asr.ts、plugin/dsh-voice-mode/src/asr-host.ts、plugin/dsh-voice-mode/src/index.ts、plugin/dsh-voice-mode/src/security.ts 及固定范围 inventory；组件：plugin/dsh-voice-mode。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Git 源码级核查子包。未运行目标代码、模型、设备、宿主或任何测试。
- 下一步：[Q05](#research-q05) 用短口令和带噪扬声器，分别记录文本准确、实际提交次数、打断与外部请求。

**分析版本**

- **仓库**：[qishuilalala/dsh-voice-mode](https://github.com/qishuilalala/dsh-voice-mode)
- **版本号**：0.7.37（[固定提交 a00fd6a](https://github.com/qishuilalala/dsh-voice-mode/tree/a00fd6ad15507ba889bbf6e90d834c5a30643be5)）
- **版本日期**：2026-11-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 建议试验显示将发送的草稿版本及当前自动发送动作，观察能否降低误发送并保留免手操作。

[Q05](#research-q05) 用短口令和带噪扬声器，分别记录文本准确、实际提交次数、打断与外部请求。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 22 | 3723 | 2905 | 645 | — |
| .js | source | 2 | 11377 | 10874 | 675 | — |
| .cjs | source | 4 | 23635 | 22470 | 1183 | — |
| .md | source | 4 | 1768 | — | — | 22652 |
| .cjs | example | 1 | 16 | 13 | 3 | — |
| .ts | source | 31 | 10937 | 7165 | 3466 | — |
| .tsx | source | 2 | 5786 | 4624 | 1132 | — |
| .mjs | test | 91 | 22061 | 17568 | 3727 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/qishuilalala/dsh-voice-mode/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户能否从录音得到可编辑的正确草稿，并在朗读时可靠打断，哪些数据会离开当前设备？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对系统听写和手动朗读，语音模式能省掉哪些步骤？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

双手忙于查看材料的 DSH 使用者可直接说一段问题，编辑转写草稿，随后听同一对话的回复并跟字幕复核。系统级听写与手动阅读也可完成，插件的增量是把录音、草稿、按句朗读和打断放在当前会话；客户端优先挂宿主 activity 槽，未实际挂上时再由右侧槽显示按钮。合格流程包括能看到麦克风状态、转写保持意思、确认只发送一次、朗读属于正确会话。如果用户经常需要在复杂指令中精确输入路径，先读草稿比自动发送更适合。

#### 证据与依据

**依据 1 · 作者声明**：[plugin/dsh-voice-mode/README.md:60-76](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/README.md#L60-L76)

作者说明模式和诊断能力

<details>
<summary>查看原文（17行）</summary>

```text
## ✨ 功能

- **语音模式**：输入框工具排麦克风按钮或全局快捷键 `Ctrl+Shift+V` 进入/退出；光标在输入框里时还可按 `Alt+Enter`（Mac 为 `Option+Enter`）切换（不插入换行）；全局单活（同一时刻仅一个会话处于语音模式，切换会话自动让出）
- **三种交互模式（右键麦克风或设置可切换，切换即持久化）**：
  - `toggle`（默认）持续聆听：RMS VAD 分段 → zipformer2 流式识别（边说边出字，实时字幕预览）→ 静音约 1500 毫秒断句进草稿，连续多段拼成一条消息，再静音约 1.2 秒（合计约 2.7 秒）自动发送；按住 `Ctrl` 强制立即发送
  - `hold` 按住说话：空闲时**直接按住麦克风按钮就开始录音、松手即发**（不必先点一下进入；短按仍是进入/退出）；发出后等回复结束（开朗读则读完）自动退出语音模式；关闭自动发送时松手只把文字留在输入框、不发送并直接退出；按住时没说话约 25 秒后兜底退出；滑出取消、`Esc`/失焦放弃本段；按住期间停顿不断句（上限 10 分钟）；`Ctrl` 按住即录、松开即发
  - `once` 说完就关：像 `toggle` 一样说一段，发出后关麦，等回复自然朗读完自动退出语音模式；长按麦克风或按 Ctrl 打断后恢复收音、留在语音模式，下一轮自然读完再退出（关闭自动发送时：说完这一段即退出，文字留在草稿）
- **朗读范围**（`readAloud`）：`voice`（默认）只朗读语音模式下的回复；`always` 当前可见会话的所有回复都朗读（含打字发的；同一会话开多个标签页只在最后看的那个上播；切换会话立即停下原会话朗读，待播内容一并作废）；`off` 从不朗读
- **唤醒词（可选，默认关）**：设置 `wakeWord` 后进入待机态，说出唤醒词才开始识别（如「你好小D」）。**可直接与命令连说**（「你好小D，帮我查天气」）——唤醒词会在定稿/字幕里自动剥掉、不进消息；匹配带容错（同音字替换「小莫→小墨」、首字错、前置语气词「呃/喂/我说」），建议 3-4 字；待机态状态条实时显示「说『x』开始 · 它听到的转写」，唤醒成败可自查。边界（重要）：**仅 `toggle` 模式生效**（`hold` / 手动打断下唤醒词静默失效）；**说完整一句后回到待机态需重说唤醒词**（只喊唤醒词、还没说命令时保持聆听，可停顿想好再说）；**朗读期说唤醒词不触发**（打断由 VAD 开口即触发，与唤醒词无关）
- **字幕档位**：`captionFontSize` 4 档（0=12px / 1=14px / 2=18px / 3=24px）+ `captionMaxWidth` 3 档（0=50vw / 1=70vw / 2=90vw），窄屏自适应
- **让位语义**（ADR-0008）：`backchannelYield` 默认开—— 朗读期用户插话「嗯/对」自动让位 1.5s，真要说走硬打断；让 LLM 主动让出话轮（人格层让位）；关掉恢复改造前行为
- **输出链路**：只朗读最终答复的 `text-delta`（reasoning/工具调用不读），按句合成后播放（默认 Edge 云端；可切本地 VITS/Kokoro，中英混读选 Kokoro）+ 右下角实时字幕浮层；工具调用触发提示音；全文照常写入聊天记录；口语化提示词（设置 `spokenFormat`，默认开）让回复为自然短句、不带 Markdown 排版符号
- **开口打断（barge-in）**：服务端 Silero VAD 帧级检测 + 回声门控（echoGateDb）三档灵敏度 → 本地静音 + host 合成队列作废 + 正在运行的回合取消（保留半截并自然续入新消息）；朗读中自动切超灵敏档。开启唤醒词后打断**仍是开口即打断**（打断门控是 VAD，不是唤醒词；打断后回待机态）
- **模型懒加载与进度**：首次使用自动下载识别/合成模型（`.part` 断点续传），状态条实时显示进度；可用 `npm run prefetch` 预下载
- **设置**：入口随 dsh 版本而不同（见下方「设置」），可调朗读引擎/音色/语速/打断灵敏度/静音停顿/空闲超时/模型镜像/自动发送/交互模式/唤醒词/口语化提示词/字幕档位/让位语义/让位窗口/打断语音抢救/LLM 纠错；**音色可试听**（按当前音色+语速即时合成预览，自定义 ShortName 亦可）
- **界面语言**：跟随 dsh 的语言设置（设置 → 通用 → 语言），**切换即时生效、无需刷新**——设置页、语音状态条、字幕、音色名称/性别/口音、错误提示全部随之变化；LLM 口语化提示词也按界面语言选中/英文版。插件词典注册在 dsh 官方 locale 服务的 `voice-mode` 命名空间，社区语言包可据此补充其它语言，缺失的语言回落英文。插件名称与描述在「插件」页同样按语言显示。
- **容错与诊断**：麦克风被拒红点提示、模型下载失败可见提示、TTS 连接失败状态条提示（自动退避重试）、提交失败文字留在草稿、SSE 断线自动重连；识别/打断检测通道连续失败、状态同步断连时状态条给出提示（可自愈的瞬时失败不打扰）；SenseVoice 定稿超过 2 秒时状态条显示「识别中… Ns」递增（看得见它在工作）；「复制诊断」一键复制版本/运行状态/设置快照/阶段耗时——**不含任何转写原文**（隐私口径）
```

</details>

**依据 2 · 源码核查**：[plugin/dsh-voice-mode/src/client.tsx:430-485](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/client.tsx#L430-L485)

客户端状态和按钮挂载分支

<details>
<summary>查看原文（56行）</summary>

```text
export function apply(ctx: any): void {
  // 国际化：把 zh/en 词典注册进官方 locale 服务（切换语言即时生效、可被语言包扩展）；服务不可用则回退本地实现。
  ctx.effect(() => bindLocale(ctx.get?.('locale')), 'dsh-voice-mode: locale dictionaries')
  const bus = createVoiceBus(undefined, ctx)

  // C3 加固：浏览器挂起 AudioContext 后，只有用户交互能可靠恢复播放（Safari/Chrome 的
  // 自动播放策略）。挂一次性手势监听——用户回到标签页点一下/按一下键即恢复朗读，
  // 避免「回到页面后 AI 回复无声、UI 却显示朗读中」。
  if (typeof document !== 'undefined') {
    const resumeAudio = (): void => bus.warmAudio()
    document.addEventListener('pointerdown', resumeAudio, { passive: true })
    document.addEventListener('keydown', resumeAudio, { passive: true })
  }

  // 麦克风按钮：dsh ≥0.1.7 挂 conversation.input.activity（模型选择器之后、发送键之前，与发送键同排）；
  // 更早的版本没有该槽位，退回 conversation.input.right。activity 是 single 槽位（dsh 自带的实验性
  // 语音输入 bundle 也用它，二者同开时后注册者遮住前者）。两处都注册，但 right 里的只在 activity
  // 没真正挂上时才渲染——同一页面只出现一个麦克风（各持一套录音引擎与快捷键监听，不能并存）。
  // 「挂上」以组件实际挂载为准：activity 是 single 槽位，被别的注册者（如 dsh 实验性语音输入）遮住时
  // 我们的按钮根本不渲染，right 里的兜底必须顶上，否则麦克风和快捷键一起消失。
  const activity = { declared: false, mounted: 0, listeners: new Set<() => void>() }
  const activityChanged = (): void => activity.listeners.forEach((fn) => fn())
  const ActivityMic = (props: MicProps): React.ReactElement => {
    useEffect(() => {
      activity.mounted++
      activityChanged()
      return () => {
        activity.mounted--
        activityChanged()
      }
    }, [])
    return React.createElement(MicButton, props)
  }
  const RightMic = (props: MicProps): React.ReactElement | null => {
    // activity 槽位存在时：它的按钮连续 1.5s 都没挂上（被遮住）才由 right 兜底；会话切换时
    // activity 按钮短暂卸载再挂载，这个窗口里不能闪出第二个按钮（挂载即有自动恢复/焦点上报等副作用）。
    const [show, setShow] = useState(() => !activity.declared)
    useEffect(() => {
      let timer: ReturnType<typeof setTimeout> | undefined
      const evaluate = (): void => {
        clearTimeout(timer)
        if (!activity.declared) setShow(true)
        else if (activity.mounted > 0) setShow(false)
        else timer = setTimeout(() => setShow(!activity.declared || activity.mounted === 0), 1500)
      }
      activity.listeners.add(evaluate)
      evaluate()
      return () => {
        activity.listeners.delete(evaluate)
        clearTimeout(timer)
      }
    }, [])
    return show ? React.createElement(MicButton, props) : null
  }
  ctx.slots.inject('conversation.input.activity', () => {
    activity.declared = true
```

</details>

**依据 3 · 源码核查**：[plugin/dsh-voice-mode/src/client.tsx:2947-2967](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/client.tsx#L2947-L2967)

流式草稿与定稿入口

<details>
<summary>查看原文（21行）</summary>

```text
        cancelAutoSend()
        const partialActions = actionsRef.current
        if (typeof partialActions?.setDraft !== 'function') return
        const composed = composeDraft(draftRef.current, lastPartialRef.current, text)
        if (!composed) return
        lastPartialRef.current = text.trim()
        try {
          partialActions.setDraft(composed)
        } catch {
          // 写草稿失败不阻断——预览仍在状态条
        }
      })
      engine.onSegment((text, meta) => {
        // 定稿进草稿（可编辑 Q13）。发送语义：累积模式——连续多段拼成一条消息，
        // 静音到「发送阈值」（断句后额外等固定 AUTO_SEND_EXTRA_MS=1200ms，批 5 与 silenceMs 解耦）或按住 Ctrl / hold 松手才发，
        // 不再每段定稿立即发送（长句碎片化/丢字的根因）。
        // once 等待中关麦后迟到的定稿：这句话已经发出去了，之后的残段不再写草稿/发送。
        if (onceRef.current) return
        resetIdle()
        submitInFlightRef.current = false // Issue #15 批 3（审查 I-2）：新段=新提交周期
        bus.setUi({ partial: '' }) // 定稿即清实时字幕（防旧 partial 遮蔽思考/朗读状态条）
```

</details>

#### 缺口

- 缺同一使用者的任务对比
  **影响**：不能推断语音替代键盘后节省时间
  **进一步探讨**：用相同五条指令比较键盘、系统听写和插件的合格率

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从麦克风到可编辑草稿，哪些条件会阻止提早发送？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端请求单声道和回声消除，异步授权过程中若启动序号被推翻会停掉当次 tracks。建立音频上下文后优先 AudioWorklet。增量 Float32 样本发到当前 DSH origin 的 ASR POST；宿主限制 body、offset、epoch，并拒绝非活动会话。客户端对 partial 与最终文本以尾段替换而非简单追加，避免同一段重复入草稿；定稿后的默认静音窗口允许继续编辑和累积。hold 按住时只累积，松手强制提交，但 hold 且关闭自动发送时只留草稿。普通定稿在朗读播放中不会触发自动发送，显式强制分支另行处理。已发送与已写草稿是不同状态，验收时应读回实际对话的提交条数和文本。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/dsh-voice-mode/src/asr.ts:1306-1369](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/asr.ts#L1306-L1369)

采音授权、竞态保护、AEC 与音频上下文

<details>
<summary>查看原文（64行）</summary>

```text
  const startRecorderInner = async (owned: { stream?: MediaStream; ctx?: AudioContext }): Promise<void> => {
    // 捕获本启动序号：getUserMedia 异步授权返回期间若发生 stop→start（或再次 start），
    // startSeq 被推进，据此放弃本启动。此前用模块级 curStartSeq 比较——新 start() 会覆盖
    // curStartSeq，旧启动返回时 curStartSeq===startSeq 恒真、守卫失效（对抗审查 Blocker）。
    const mySeq = startSeq
    // I3：先赋局部变量，抢占检查通过后才赋模块级 stream。此前先赋模块级后检查——
    // 旧启动(A)迟到续体会停掉新启动(B)已赋值的流 → active=true 但静默无收音。
    const myStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        // L0（研究核实）：AGC/NS 是时变非线性，放在 AEC 前破坏线性回声路径假设——
        // WebRTC GainController2 与 Speex 均把增益放 AEC 之后。禁用后原生 AEC 与
        // 自研 AEC 的输入才线性，回声消得净；AGC 放大近端语音由「残差地板门控」
        // 的归一化语义替代，不需要采集端增益。
        noiseSuppression: false,
        autoGainControl: false,
      },
    })
    // Fix8 修正：授权返回时若已被 stop() 抢占（stopRequested）或已被更新的启动取代
    // （序号落后 → 双路开麦防呆）则立即释放麦克风。注意不能用 active 判断——
    // 它在函数末尾才置 true。
    owned.stream = myStream
    if (stopRequested || mySeq !== startSeq) {
      myStream.getTracks().forEach((t) => t.stop()) // I3：只停本启动的流
      return
    }
    stream = myStream // I3：检查通过后才赋模块级（弃用分支只停 myStream）
    // A1：验证浏览器原生 AEC 是否真正生效。约束在首次 getUserMedia 建立处理链时生效，
    // track.getSettings() 是唯一可见信号；false 时外放回声几乎必然漏进 → 自打断。
    const aecOn = stream.getAudioTracks()[0]?.getSettings().echoCancellation === true
    if (!aecOn) {
      console.warn('[dsh-voice-mode] native browser echoCancellation is not in effect (speakers may self-interrupt); use headphones or manual barge-in')
    }
    // 批 7O（ADR-0006）第一级自动探测：detect 模式根据原生 AEC 实际状态落运行时打断方式。
    //   false → manual（不自打断，配合状态条提示）；true → auto。auto/manual 显式取值不探测。
    if (config.bargeInMode === 'detect') {
      runtimeBargeInMode = aecOn ? 'auto' : 'manual'
    }
    config.onAecState?.(aecOn)
    const AC: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const myCtx = new AC({ sampleRate: SAMPLE_RATE })
    owned.ctx = myCtx
    audioCtx = myCtx
    // iOS Safari：非手势栈创建的上下文初始为 suspended，不恢复则 onaudioprocess
    // 永不触发（进入语音模式后静默无反应）——在 getUserMedia 手势栈内尝试恢复。
    try {
      await audioCtx.resume?.()
    } catch {
      // 恢复失败不阻塞（部分场景仍可用；状态条会提示收音异常）
    }
    // I2：resume await 后复检抢占。此前唯一抢占检查在 getUserMedia 返回点，stop()
    // 落入 resume/addModule 异步窗口时被吞（旧 stop 在 wasActive=false 时早返、不停
    // tracks、不递增 startSeq）→ 麦道常开 + 幽灵上行（stop 后 partial 仍在飞）。
    if (stopRequested || mySeq !== startSeq) {
      await abandonStart(myStream, myCtx)
      return
    }
    // 浏览器可能忽略 sampleRate 选项（Safari 等）：记录真实采样率供重采样。
    ctxRate = audioCtx.sampleRate
    const source = audioCtx.createMediaStreamSource(stream)
    // 优先 AudioWorklet（专用音频线程，摆脱 ScriptProcessor 主线程卡顿/glitch）；
    // 不支持或 addModule 失败时回退 ScriptProcessor（跨浏览器兜底，行为与旧版一致）。
```

</details>

**依据 2 · 源码核查**：[plugin/dsh-voice-mode/src/asr.ts:455-468](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/asr.ts#L455-L468)

样本以二进制发给宿主并限时

<details>
<summary>查看原文（14行）</summary>

```text
    if (total - from <= 0) return
    const samples = sliceSince(from)
    const epoch = segmentEpoch
    partialInFlight = true
    try {
      // I1：partial 是唯一无 AbortSignal.timeout 的上行通道（对照 detect/reset 5s、
      // final 25s）——host 挂起时 fetch 永不 settle，partialInFlight 永真 → 实时字幕与
      // host VAD 端点静默死亡，且挂起不 reject 使连败提示也不触发（无头故障）。
      let res = await fetch(asrUrl(false, from, epoch), {
        method: 'POST',
        headers: { 'content-type': 'application/octet-stream' },
        body: samples.buffer as ArrayBuffer,
        signal: AbortSignal.timeout(5000),
      })
```

</details>

**依据 3 · 源码核查**：[plugin/dsh-voice-mode/src/asr-host.ts:984-1047](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/asr-host.ts#L984-L1047)

输入上限、会话和索引校验

<details>
<summary>查看原文（64行）</summary>

```text
export function handleAsrRequest(
  asr: AsrRuntime,
  activeSessionId: string | null,
  req: IncomingMessage,
  res: ServerResponse,
): void {
  const chunks: Buffer[] = []
  let received = 0
  let tooLarge = false
  req.on('data', (c: Buffer) => {
    if (tooLarge) return
    received += c.length
    if (received > MAX_ASR_BYTES) {
      tooLarge = true
      respondJson(res, 413, { code: 'payload_too_large', error: 'pcm payload too large' })
      return
    }
    chunks.push(c)
  })
  req.on('end', () => {
    if (tooLarge) return
    // 校验会话归属：仅活跃语音会话可识别（防滥用/串流）。
    const url = new URL(req.url ?? '/', 'http://localhost')
    const sessionId = url.searchParams.get('sessionId') ?? ''
    const final = url.searchParams.get('final') === '1'
    const reset = url.searchParams.get('reset') === '1'
    const epochParam = url.searchParams.get('epoch')
    const epochN = Number(epochParam)
    const epochOK = epochParam === null || (Number.isFinite(epochN) && epochN >= 0 && Number.isInteger(epochN))
    // P1-4：本包在段内的绝对样本起始索引（缺省 0 = 全量上传，兼容旧客户端）。
    const offsetParam = url.searchParams.get('offset')
    // 修复：显式 offset 必须 有限 && >=0 && ≤ 段长逻辑上限（64s）。
    // 否则 1e300/Infinity 会把数位水位毒化：fed 被抬到天文数 → 本段后续增量永不喂入。
    const offsetOK =
      offsetParam === null ||
      (Number.isFinite(Number(offsetParam)) && Number(offsetParam) >= 0 && Number(offsetParam) <= MAX_ASR_BYTES / 4)
    if (!offsetOK) {
      respondJson(res, 400, { code: 'bad_request', error: 'invalid offset' })
      return
    }
    if (!epochOK) {
      respondJson(res, 400, { code: 'bad_request', error: 'invalid epoch' })
      return
    }
    const epoch = epochParam === null ? 0 : Math.floor(epochN)
    const offset = offsetParam === null ? 0 : Math.floor(Number(offsetParam))
    if (!sessionId || sessionId !== activeSessionId) {
      respondJson(res, 403, { code: 'unknown_session', error: 'not the active voice session' })
      return
    }
    // reset=1：丢弃该会话进行中的识别段并新建流（弃段/打断后的清场）。
    if (reset) {
      asr.reset(sessionId)
      respondJson(res, 200, { ok: true })
      return
    }
    const raw = Buffer.concat(chunks)
    // P1-4 增量定稿：全部样本已随 partial 上传时为「空 body + final=1」，
    // 只补尾垫返回定稿；空 + 非 final 仍按非法载荷 400。
    const samples = raw.length === 0 ? (final ? new Float32Array(0) : null) : pcmToSamples(raw)
    if (!samples) {
      respondJson(res, 400, { code: 'bad_request', error: 'invalid pcm payload' })
      return
    }
```

</details>

**依据 4 · 源码核查**：[plugin/dsh-voice-mode/src/client.tsx:2947-3014](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/client.tsx#L2947-L3014)

partial、final、手动／自动路径与朗读门

<details>
<summary>查看原文（68行）</summary>

```text
        cancelAutoSend()
        const partialActions = actionsRef.current
        if (typeof partialActions?.setDraft !== 'function') return
        const composed = composeDraft(draftRef.current, lastPartialRef.current, text)
        if (!composed) return
        lastPartialRef.current = text.trim()
        try {
          partialActions.setDraft(composed)
        } catch {
          // 写草稿失败不阻断——预览仍在状态条
        }
      })
      engine.onSegment((text, meta) => {
        // 定稿进草稿（可编辑 Q13）。发送语义：累积模式——连续多段拼成一条消息，
        // 静音到「发送阈值」（断句后额外等固定 AUTO_SEND_EXTRA_MS=1200ms，批 5 与 silenceMs 解耦）或按住 Ctrl / hold 松手才发，
        // 不再每段定稿立即发送（长句碎片化/丢字的根因）。
        // once 等待中关麦后迟到的定稿：这句话已经发出去了，之后的残段不再写草稿/发送。
        if (onceRef.current) return
        resetIdle()
        submitInFlightRef.current = false // Issue #15 批 3（审查 I-2）：新段=新提交周期
        bus.setUi({ partial: '' }) // 定稿即清实时字幕（防旧 partial 遮蔽思考/朗读状态条）
        if (holdReleaseExitRef.current && meta?.force) {
          // hold 松手那一段（force；按住途中的 30s 滚段不算）：会发送 → 进 once 等待，回复结束再退
          // （不朗读也一样——立刻退会取消纠错 RTT 内的在途提交）；不发送（自动发送关）→ 没有回复可等，直接退。
          clearHoldExit()
          if (bootNow().autoSend === false) {
            setTimeout(() => {
              if (!holdPtrRef.current) void exitModeRef.current('manual')
            }, 300)
          } else {
            beginOnceWait()
          }
        }
        const actions = actionsRef.current
        const trimmed = text.trim()
        if (!trimmed) return
        // Issue #15 批 3：定稿**替换** partial 尾（不是追加——追加会把刚写进草稿的
        // partial 重复计入，主会话预审定位的 double-append 风险）。草稿被提交清空时
        // 尾不匹配 → composeDraft 自愈从定稿新起。
        let nextDraft = composeDraft(draftRef.current, lastPartialRef.current, trimmed)
        lastPartialRef.current = ''
        try {
          // M9：删 else-if 死分支——与 if 条件字面重复，永不可达。
          if (typeof actions?.setDraft === 'function') actions.setDraft(nextDraft)
        } catch {
          try {
            actions?.setDraft?.(trimmed)
          } catch {
            // 提交失败：文字已留在草稿（Q16）
          }
        }
        // 强制发送（按住 Ctrl / hold 松手）恒立即提交，绕过播放门与 autoSend 开关。
        if (meta?.force) {
          cancelAutoSend()
          // 按住说话 + 关闭自动发送：松手只定稿，不发送。
          if (bootNow().mode === 'hold' && bootNow().autoSend === false) return
          submitDraftNow(nextDraft)
          return
        }
        // hold 模式按住期间的非强制定稿（30s 滚段）：只累积进草稿，绝不自动发送（松手才发）。
        if (bootNow().mode === 'hold') return
        // AI 自聊修复：TTS 在播（bus.ui.playing）时不得自动发送非强制段——
        // 因 TTS 回声定稿后若无 gate 会经 onSegment 发出，进入 AI 回复→TTS→回声 → 自循环。
        if (bus.ui.playing) return
        // 自动提交门控：设置关闭时只留草稿，等待用户编辑/发送（once 照样走计时，到点收工）。
        if (bootNow().autoSend === false && bootNow().mode !== 'once') return
        // 累积模式：静音到点才发（期间再开口 → onState('speech') → cancelAutoSend 继续累积）。
        scheduleAutoSend()
```

</details>

#### 缺口

- 没用实时麦克风触发切页或按键竞态
  **影响**：不能保证所有设备都能保持草稿而不重复发送
  **进一步探讨**：在隔离浏览器测试麦克风拒绝、迟返回、多段和一次会话抢占

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 朗读和开口打断会影响哪些会话及请求？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

宿主 llm/stream 回调跳过带 purpose 的内部生成及缺会话 ID 的请求。显式活动语音会话优先，没活动语音时 always 才朗读当前焦点会话，避免两个条件同时挂 tap。宿主 tap 把选定流交给队列，客户端的硬打断先取消待发计时和纠错周期，并在当前会话运行时让宿主取消回合，同时调用 /cancel 判明是真打断。宿主使队列旧 epoch 作废、关闭旧回合闸门并标记余句不再合成，按 keepAsr 决定是否保留按住说的在途段。服务端 VAD-only 在朗读期做独立语音检测，不把这些片段送入普通识别流。detect 在捕获设置显示原生 AEC 未生效时改用手动，因而不能预期所有扬声器环境都能靠开口接管。网络取消失败还可能出现客户端已静音而宿主未完成取消，要查看下一轮状态。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/dsh-voice-mode/src/index.ts:1109-1128](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/index.ts#L1109-L1128)

选择会话和排除内部 LLM 流

<details>
<summary>查看原文（20行）</summary>

```text
  // --- llm/stream 无损 tap：仅活跃语音会话被观察，其余直达（验收点 7）。 ---
  ctx.on('llm/stream', (options: GenerateOptions, next): AsyncIterable<StreamChunk> => {
    const rawSessionId = options.sessionId
    // 只朗读主对话回合：compaction / session-title 等内部生成流带 purpose，
    // 若被 tap 会把「会话摘要/标题生成」播出来（官方 GenerateOptions.purpose 契约）。
    if (!config.enabled || rawSessionId === undefined || options.purpose !== undefined) return next()
    // dsh 0.1.2：sessionId 为 SessionId 品牌（Agent/Session 共用同一身份轴）。
    // 运行时是普通字符串，与 activeVoiceSession（来自 /toggle 的 sessionId）同源可比较，
    // 仅需消除品牌在 map 键/比较上的类型约束。
    const sessionId: string = rawSessionId as string
    // readAloud=always：客户端经 /focus 上报的当前可见会话，非语音模式的回复（含打字发送）也朗读；
    // 只认可见会话，后台子任务/其他会话的流不读。off：语音模式里也不朗读，但回合状态照常广播。
    // R15（Issue #15 Important-3）：语音模式会话与焦点会话是两个**不同**会话时必须二选一——
    // 两个条件各自独立成立会给两个会话各挂一个 tap，而它们在 TtsQueue 里是两个独立
    // SessionQueue（pump 按会话各自跑），即并发合成 + 同时广播 = 两个标签页叠播。
    // 故 alwaysRead 只在「当前没有语音模式会话」时生效：语音模式是显式用户动作（占用麦克风、
    // 带 barge-in 语义），优先级高于「当前可见」。
    const alwaysRead =
      vset.readAloud === 'always' && focusedSessionId === sessionId && activeVoiceSession === null
    if (activeVoiceSession !== sessionId && !alwaysRead) return next()
```

</details>

**依据 2 · 源码核查**：[plugin/dsh-voice-mode/src/index.ts:1146-1164](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/index.ts#L1146-L1164)

回合静音及 tap 接线

<details>
<summary>查看原文（19行）</summary>

```text
    const mute = readMuted.get(sessionId)
    const pos = turnOfSession.get(sessionId)
    if (mute !== undefined) {
      const atTurnBoundary = pos !== undefined && (mute.turn === null ? pos.step === 1 : pos.turn !== mute.turn)
      if (atTurnBoundary) {
        readMuted.delete(sessionId)
      } else if (pos === undefined || mute.turn === null) {
        // 回合位置不可知 → 继续压住，计数兜底解除（绝不永久化）。
        mute.streams += 1
        if (mute.streams > MUTED_STREAMS_WITHOUT_TURN) readMuted.delete(sessionId)
      }
      // 其余：同一回合的后续 step（位置可知、回合号相同、step>1）→ 保持静音，不计数。
    }
    tapInFlight.add(sessionId) // R15（Important-4）：回收表项前据此避让仍在飞的流
    return tapActiveStream(
      sessionId,
      next(),
      queue,
      broadcast,
```

</details>

**依据 3 · 源码核查**：[plugin/dsh-voice-mode/src/asr.ts:1334-1345](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/asr.ts#L1334-L1345)

根据 AEC 选择开口或手动

<details>
<summary>查看原文（12行）</summary>

```text
    // A1：验证浏览器原生 AEC 是否真正生效。约束在首次 getUserMedia 建立处理链时生效，
    // track.getSettings() 是唯一可见信号；false 时外放回声几乎必然漏进 → 自打断。
    const aecOn = stream.getAudioTracks()[0]?.getSettings().echoCancellation === true
    if (!aecOn) {
      console.warn('[dsh-voice-mode] native browser echoCancellation is not in effect (speakers may self-interrupt); use headphones or manual barge-in')
    }
    // 批 7O（ADR-0006）第一级自动探测：detect 模式根据原生 AEC 实际状态落运行时打断方式。
    //   false → manual（不自打断，配合状态条提示）；true → auto。auto/manual 显式取值不探测。
    if (config.bargeInMode === 'detect') {
      runtimeBargeInMode = aecOn ? 'auto' : 'manual'
    }
    config.onAecState?.(aecOn)
```

</details>

**依据 4 · 源码核查**：[plugin/dsh-voice-mode/src/asr-host.ts:1048-1056](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/asr-host.ts#L1048-L1056)

独立检测音频路径

```text
    // 打断根治：播放期检测通道（vadOnly=1）。AI 朗读中客户端常规 partial 断流
    // （自聊防护丢弃语音帧入段），此通道只喂独立检测 VAD 返回 isSpeech，
    // 不进 ASR 流、不碰端点 VAD——让「开口打断」在朗读中真实可用。
    if (url.searchParams.get('vadOnly') === '1') {
      void asr
        .detect(sessionId, samples)
        .then((out) => {
          respondJson(res, 200, { isSpeech: out.isSpeech })
        })
```

**依据 5 · 源码核查**：[plugin/dsh-voice-mode/src/client.tsx:2644-2673](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/client.tsx#L2644-L2673)

清待发、取消宿主回合并发状态请求

<details>
<summary>查看原文（30行）</summary>

```text
        bus.unduckAudio()
        // Issue #15 I1：打断即取消 pending 自动发送 + 清提交在途标记——否则纠错
        // RTT（最坏 12s）内打断后旧文本被发出（幽灵提交，复核三条件全过）。文字留草稿。
        cancelAutoSend()
        submitInFlightRef.current = false
        correctCycleRef.current++ // R2 I-1：打断废当前纠错周期（旧周期 then 令牌失配即弃）
        // 批 5：真打断优先——清 backchannel 让位窗口，避免 1.5s 丢帧阻塞用户新回合播放。
        bus.setBackchannelHold(0)
        // 立即取消当前回合（不等 cancelP/discardSegment）：否则其 3~5s 窗口内用户开口的
        // 新回合会被迟到的 cancelTurn 误取消（打断+说话竞态）。
        if (runningRef.current && sidRef.current) {
          bus.cancelTurn(sidRef.current!)
        }
        // 双重奏根治：cancel 立即发出（不等 discardSegment）→ host epoch++ 停推，
        // 缩短「skip 后旧回合帧继续到达」的窗口（在途旧帧由 client 拒绝线兜底丢弃）。
        const cancelP = fetch(`${location.origin}${BASE_PATH}/cancel`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          // hold 按压中保留 host ASR 段（松手定稿续传前半句，防吃句）。
          // reason=interrupt：host 据此可收口回合闸门（abandonTurn）——用户打断与
          // 「停止朗读」靠它区分（两者 keepAsr 都可能是 true，载荷本身区分不了）。
          body: cancelPayload({
            sessionId: sidRef.current!,
            keepAsr: engineRef.current?.holding === true,
            reason: 'interrupt',
          }),
          signal: AbortSignal.timeout(3000),
        }).catch(() => {
          // cancel 路由不可达：本地已静音
        })
```

</details>

**依据 6 · 源码核查**：[plugin/dsh-voice-mode/src/index.ts:1801-1826](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/index.ts#L1801-L1826)

宿主取消旧声音、回合及 ASR 状态

<details>
<summary>查看原文（26行）</summary>

```text
          // readAloud=always 的可见会话不在语音模式，也允许「停止朗读」只停它的 TTS。
          if (sessionId && (sessionId === activeVoiceSession || sessionId === focusedSessionId)) {
            // fork 加固：打断限流（每会话 2 次/秒）。
            if (!limiter.hit(`cancel:${sessionId}`, 2, 1000)) {
              respondJson(res, 429, { code: 'rate_limited', error: 'rate limited' })
              return
            }
            // 停 TTS（epoch++，积压与在途全弃）；hold 打断带 keepAsr=1 时保留在途
            // ASR 段（按住说的前半句已上行，松手定稿以同一 epoch 增量续传，
            // 若 reset 会把 host 流清空导致定稿缺前半句——对抗审查第三轮 Blocker）。
            queue.cancel(sessionId)
            // R15（Issue #15 Important-9）：回合以 abort / blocked / 空首步收场时，宿主**不**派发
            // agent/turn-stopping（abort 走 catch 直接重抛、blocked 走 return false），openTurns
            // 残留 → 回合闸门永不闭合 → 即便此后读尽也补不出 tts-idle，mode:once 只能等
            // ONCE_STALL_MS=10s 静默兜底。abandonTurn 只清闸门、**不补发**（补不补由 host 的
            // 上下文决定），且与上面 queue.cancel 语义**正交**：前者不碰 pending/在途，后者不碰
            // openTurns —— 两者互不覆盖，无先后依赖，调换顺序结果相同。
            if (isInterrupt) queue.abandonTurn(sessionId)
            // R15（Issue #15 Important-2 + Important-6 校正）：epoch 只作废**已入队**的句子，
            // 打断后仍在跑的 llm/stream 会把余句继续送进来（新 epoch 不作废）。此处记下
            // 「本回合静音 + 当时的回合号」，余句一律不入队（不合成、不计费、不下发）；
            // 解禁只发生在回合边界（tap 入口比对回合号），回合内的下一个 step 不解禁。
            readMuted.set(sessionId, { turn: turnOfSession.get(sessionId)?.turn ?? null, streams: 0 })
            if (!keepAsr && sessionId === activeVoiceSession) asr.reset(sessionId)
          }
          respondJson(res, 200, { ok: true })
```

</details>

#### 缺口

- 没做设备、回声、网络时延和跨标签页对照
  **影响**：不知道是否吞首音或假打断
  **进一步探讨**：用已知短语录制真实声卡的耳机和外放样本，分别观察退出及状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 宿主识别和本地 TTS 是否等于整轮离线？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

音频上行是浏览器到当前连接的 DSH 主机，不使用独立的云 ASR 接口。默认 Edge 合成走单独的微软在线服务，选择 VITS 或 Kokoro 才改变独立 TTS 目的地。主对话及可选纠错仍使用宿主模型，打开纠错会增加请求，失败回原文。ASR 的回环、Origin、POST、速率和当前会话是多层滥用约束。Origin 不存在时该检查会通过，并信任应用可见的转发 host 作为对比值，因此还应使用宿主和反代的实际网络边界来验证来源，不把它当作独立用户认证。模型下载、缓存和原生运行依赖也和主对话模型分开。

#### 证据与依据

**依据 1 · 作者声明**：[plugin/dsh-voice-mode/README.md:294-302](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/README.md#L294-L302)

作者说明语音、网络、缓存与模型路径

```text
## 🔐 权限与数据流声明

插件如实声明它会做的事（与 awesome-dsh-plugin 的能力扫描 `network / fs-read / fs-write / shell / env` 一一对应）：

| 类别 | 具体行为 | 数据去向 |
| --- | --- | --- |
| **network** | Edge 将待朗读文本发往微软在线服务；本地模型从官方源或配置镜像下载，主要模型及清单内支持文件做摘要校验，辅助目录用清单/存在性检查；插件在宿主注册 `/voice-mode/*` 路由 | 浏览器音频发送到所连接的 dsh 宿主识别，不使用独立云 ASR；提交文本及可选 LLM 纠错遵循宿主配置。切换本地 TTS 不会让宿主 LLM 自动离线 |
| **fs-read / fs-write** | 模型缓存（Linux/macOS `~/.cache/dsh-voice-mode/models/`，Windows `%LOCALAPPDATA%\dsh-voice-mode\models\`）；dsh 0.1.7+ 的设置覆盖层 `$DSH_HOME/voice-mode.settings.json`；**不读写你的工作区文件** | 全部在本机 |
| **shell（子进程）** | 本地 TTS 合成跑在独立子进程（`child_process.fork` → `lib/tts-vits-worker.cjs`）；宿主为 Electron（官方桌面端）时，为 Kokoro 额外探测并启动一个真正的 Node.js（`node -p …` 探测版本，见 ADR/兼容契约）。**不执行用户输入、不经 shell 拼接命令** | 本机 |
```

**依据 2 · 源码核查**：[plugin/dsh-voice-mode/src/index.ts:977-1001](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/index.ts#L977-L1001)

三种 TTS 的真实选择

<details>
<summary>查看原文（25行）</summary>

```text
  const makeEngine = (kind: 'edge' | 'vits' | 'kokoro'): TtsEngine => {
    if (kind === 'edge') return new EdgeTtsEngine(config.voice, config.rate)
    if (kind === 'kokoro') {
      return createSherpaKokoroEngine({
        cacheDir: config.cacheDir,
        modelHost: normalizedModelHost,
        allowCustomHost: config.allowCustomModelHost,
        model: vset.kokoroModel,
        broadcast,
      })
    }
    return createSherpaVitsEngine({
      cacheDir: config.cacheDir,
      modelHost: normalizedModelHost,
      allowCustomHost: config.allowCustomModelHost,
      broadcast,
    })
  }
  let engineKind: 'edge' | 'vits' | 'kokoro' = vset.ttsEngine ?? config.ttsEngine
  let activeKokoroModel: KokoroModel = vset.kokoroModel

  // --- TTS 队列（§8.4）：逐句合成后经 SSE 广播；epoch 机制支撑打断。 ---
  const queue = new TtsQueue({
    engine: makeEngine(engineKind),
    onError: (sessionId) => broadcast('tts-error', { sessionId }),
```

</details>

**依据 3 · 源码核查**：[plugin/dsh-voice-mode/src/index.ts:1380-1427](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/index.ts#L1380-L1427)

纠错路由的范围、限速和回退

<details>
<summary>查看原文（48行）</summary>

```text
    ctx.webServer.register({
      kind: 'exact',
      path: `${base}/correct`,
      handler: (req: IncomingMessage, res: ServerResponse) => {
        if (denyNonLoopback(req, res)) return
        if (denyCrossOrigin(req, res)) return
        collectBody(req, res, MAX_JSON_BODY, (body) => {
          let text = ''
          let lang: PromptLang = 'zh'
          try {
            const parsed = JSON.parse(body || '{}') as { text?: unknown; lang?: unknown }
            text = typeof parsed.text === 'string' ? parsed.text : ''
            // M6：lang 归一化走 prompts.ts 单一真源（早年内联 `=== 'en'` 与
            // normalizePromptLang 分叉——后者把 'en-US'/'zh-CN' 等带地区后缀的界面语言
            // 也正确归并，内联版一律判成 zh，英文界面用户的纠错提示词用错语言）。
            lang = normalizePromptLang(parsed.lang)
          } catch {
            // ignore malformed body——按空文本处理（下面原样回）
          }
          const trimmed = text.trim()
          if (!trimmed) {
            respondJson(res, 200, { text })
            return
          }
          // 限流对齐 /preview（审查 M2）：本地页面可无上限触发 LLM 调用；10 次/60s 对
          // 「每消息一次」足够。M6：键从全局 'correct' 改为 per-client（同 I4 的
          // 反代取键）——全局键下任一人点满 10 次，其余人的纠错全部静默回退原文。
          // 语义分流（审查 M6 续）：enabled=false = 功能停用，是确定性的 403
          // voice_disabled；打太猛才是 429 rate_limited。但两者对**用户可见行为**完全
          // 相同——client.tsx:1712 是 `if (!r.ok) return text`，不读 code、不弹提示，
          // 一律静默回退原文（纠错是纯附加层，不得阻断发送）。故 403/429 分流的价值在
          // **服务端可观测性**（日志/诊断能区分「停用」与「限流」）；早年注释宣称
          // 「客户端 errorText 给出语音模式已关闭」与实现不符，已更正。
          if (!config.enabled) {
            respondJson(res, 403, { code: 'voice_disabled', error: 'voice mode disabled', text: trimmed })
            return
          }
          if (!limiter.hit(`correct:${clientKey(req)}`, 10, 60000)) {
            respondJson(res, 429, { code: 'rate_limited', error: 'rate limited', text: trimmed })
            return
          }
          // .catch 恒 200 回原文（审查 B1）：correctText 理论上已全捕获，但路由层绝不
          // 让异常逃逸成未处理 rejection + HTTP 永不响应（客户端会白等 12s 超时）。
          void correctText(ctx, trimmed, lang)
            .then((corrected) => {
              respondJson(res, 200, { text: corrected })
            })
            .catch(() => respondJson(res, 200, { text: trimmed }))
```

</details>

**依据 4 · 源码核查**：[plugin/dsh-voice-mode/src/index.ts:1722-1769](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/index.ts#L1722-L1769)

ASR 入口各层

<details>
<summary>查看原文（48行）</summary>

```text
    ctx.webServer.register({
      kind: 'exact',
      path: `${base}/asr`,
      handler: (req: IncomingMessage, res: ServerResponse) => {
        if (denyNonLoopback(req, res)) return
        // M11（Issue #15 审查 Minor）：补跨源校验，与其它状态变更端点一致。
        // 缺它时 /asr 是唯一「只校验回环」的 POST 端点：跨站页面可用表单/ fetch
        // 打进来驱动 ASR（烧 CPU + 抢活跃会话识别结果）。同源客户端恒过——
        // sameOriginRequest 对无 Origin 的非浏览器请求放行，浏览器同源请求 host 相等。
        if (denyCrossOrigin(req, res)) return
        // 只接受同源 POST（形态同 /preview、/models/retry）：跨站 <img src> 的 GET **不带
        // Origin**，sameOriginRequest 会放行；本端点的限流键取自 query 的 sessionId
        // （`asr:${sid}`）——键里不含任何秘密（回环攻击面上 sid 可从 URL / SSE 载荷观察），
        // 持续打满 60 次/秒的**滑动**窗口就能把该会话的 ASR 上行一直压成 429。限流桶是给
        // 「真的要传 PCM」用的，不该被无 body 的廉价 GET 消耗，故方法校验排在**限流之前**。
        // 与 /preview 的顺序差异：/preview 的方法校验在跨源之前，本端点放在跨源之后——
        // M11 的既有锁要求「回环校验之后紧跟跨源校验」，不改那条锁。对威胁模型两者等价：
        // 跨站 <img> 的 GET 不带 Origin（跨源层放行）随后被方法校验 405；跨站带 Origin 的
        // 跨源 POST 在跨源层就 403，两者都不会进限流桶。
        // 限流的位置与配额本身不动（本地 WASM 推理那条防滥用边界是刻意选的）。
        if (req.method !== 'POST') {
          res.setHeader('allow', 'POST')
          respondJson(res, 405, { code: 'method_not_allowed', error: 'POST required' })
          return
        }
        let sid = ''
        try {
          const url = new URL(req.url ?? '/', 'http://localhost')
          sid = url.searchParams.get('sessionId') ?? ''
        } catch {
          // 忽略畸形 URL
        }
        // fork 加固：ASR 限流（每会话 60 次/秒）——识别是 WASM 推理、代价高，
        // 防本地恶意进程用活跃会话 id 打爆 CPU（回环层之外的第二道防滥用）。
        if (!limiter.hit(`asr:${sid || 'unknown'}`, 60, 1000)) {
          respondJson(res, 429, { code: 'rate_limited', error: 'rate limited' })
          return
        }
        // P2-4：回合状态机 —— partial 到达 = listening；final=1 = finalizing。
        if (sid && sid === activeVoiceSession) {
          try {
            const url = new URL(req.url ?? '/', 'http://localhost')
            setTurn(sid, url.searchParams.get('final') === '1' ? 'finalizing' : 'listening')
          } catch {
            // 忽略畸形 URL
          }
        }
        handleAsrRequest(asr, activeVoiceSession, req, res)
```

</details>

**依据 5 · 源码核查**：[plugin/dsh-voice-mode/src/security.ts:13-40](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/security.ts#L13-L40)

回环和转发 host 比较

<details>
<summary>查看原文（28行）</summary>

```text
const LOOPBACK_ADDRESSES = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])

/** 请求是否来自回环地址。 */
export function isLoopbackRequest(req: IncomingMessage): boolean {
  const addr = req.socket.remoteAddress ?? ''
  return LOOPBACK_ADDRESSES.has(addr)
}

/**
 * Origin 同源校验：POST 状态下浏览器必带 Origin；带则 host（含端口）必须等于
 * 请求自身。无 Origin（非浏览器客户端）放行——由回环层兜底。
 *
 * 反代兼容：经 HTTPS 反代访问时，dsh 只见回环 HTTP（TLS 在反代终止），
 * 此时 socket.encrypted=false 但浏览器 Origin 是 https，scheme 对不上会误拒。
 * 因此只比较 host（忽略 scheme），并优先取 X-Forwarded-Host（反代改写 Host 的场景）。
 */
export function sameOriginRequest(req: IncomingMessage): boolean {
  const origin = req.headers.origin
  if (!origin) return true
  try {
    const originHost = new URL(origin).host
    const xfh = req.headers['x-forwarded-host']
    const host = (typeof xfh === 'string' && xfh ? xfh.split(',')[0].trim() : '') || req.headers.host
    if (!host) return false
    return originHost === host
  } catch {
    return false
  }
```

</details>

#### 缺口

- 未观测部署出口或反代行为
  **影响**：不能确认远端部署的音频及正文去向
  **进一步探讨**：在隔离界面分别检查三种 TTS 和纠错的进出站请求

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么样的试用足以观察误发送、错误打断及退出？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

使用兼容 DSH 的人可在隔离会话用一条无敏感内容的口令验证草稿正确与回合完整，先关闭自动发送和纠错，手动确认。首次需核对客户端、麦克风、模型、声音引擎和缓存，持续成本包含采音／识别 CPU、可选合成或纠错、主模型及人工纠正草稿。故障时关语音并核对当前草稿和真实消息回执，退回键盘；即使停用输入，主会话已交给宿主的记录需由宿主管理。可验证的设计是让用户在发送前看见由听写、纠错或手改产生的实际草稿版本及其下一次自动操作，弱化对停顿计时的猜测。对照现有计时与显式状态提示，看误发送、重复提交和低视觉负担之间的取舍。如果提示额外妨碍免手流程且无法降低误操作，就保留按住说或手动确认。

#### 证据与依据

**依据 1 · 作者声明**：[plugin/dsh-voice-mode/README.md:124-151](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/README.md#L124-L151)

设置、模型、外部服务与成本变量

<details>
<summary>查看原文（28行）</summary>

```text
| `ttsEngine` | `edge` | 朗读引擎：`edge` 微软云端（默认，快）/ `vits` 本地中文 / `kokoro` 本地中英；**即时生效** |
| `kokoroModel` | `int8` | Kokoro 模型精度：`int8`（默认，109MB，纯 CPU/低带宽推荐）/ `fp32`（311MB，音质更好，独显/大内存推荐）；两档共用 103 音色，**即时生效** |
| `voice` | 按引擎 | 音色：VITS 五说话人；Kokoro 103 个（下拉+◀▶，62 深沉/68 浑厚/75 清亮/76 磁性置顶）；Edge 进入时自动加载全量 322 个。行内「试听」可即时预览 |
| `rate` | `1.1` | 朗读语速倍率（0.5 慢速 ～ 2.0 快速），**即时生效** |
| `interruptLevel` | `0` | 发声打断灵敏度（服务端 VAD 帧级检测 + 回声门控）：0 高门槛（3 帧）/ 1 中（2 帧）/ 2 低（1 帧） |
| `bargeInMode` | `detect` | 打断方式：`detect` 自动探测本机原生回声消除状态（默认；未生效时切为长按打断）/ `auto` 强制开口即打断（耳机、安静环境推荐）/ `manual` 长按打断（外放推荐）。批 7O 默认，I10 豁免（ADR-0006） |
| `echoGateDb` | `6` | 无原生 AEC 时的回声门兜底阈值；原生 AEC 有效时不参与。仅在兜底路径中，增大更保守、减小更易触发；先确认设备与打断模式 |
| `silenceMs` | `1500` | 说完整一句的静音停顿毫秒数 |
| `idleTimeoutMinutes` | `5` | 无活动自动退出语音模式的分钟数（朗读计为活动） |
| `modelHost` | 默认源 | 模型下载源（国内网络填 `https://hf-mirror.com`） |
| `autoSend` | `true` | 静音到点自动发送（连续多段拼成一条消息）；关闭则只进草稿（按住 `Ctrl` / hold 松手仍会发送） |
| `autoResume` | `false` | 切回上次语音会话时自动恢复语音模式（默认关）。开启后：下次进入语音会话即自动进入语音模式 + 恢复上次会话；关闭则需手动按 `Ctrl+Shift+V` 重新进入 |
| `mode` | `toggle` | 交互模式：`toggle` 持续聆听 + 1500ms 静音断句；`hold` 按住说话、松手发送（短按退出）；`once` 说一段、回复自然读完自动退出；手动打断后恢复收音并留在语音模式 |
| `readAloud` | `voice` | 朗读范围：`voice` 仅语音模式下的回复；`always` 当前可见会话的所有回复（含打字发送，切换会话即停止原朗读）；`off` 从不朗读 |
| `showStatusBar` | `true` | 输入框上方的语音状态条；关闭后状态只显示在麦克风按钮上（计时在按钮下方、提示在按钮旁） |
| `showCaptions` | `true` | 朗读时的字幕浮层 |
| `shortcut` | `Ctrl+Shift+V` | 进入 / 退出语音模式的快捷键（修饰键 Ctrl/Shift/Alt/Meta + 一个字母 / 数字 / Enter / Space / Tab）；设置页「快捷键」分组里可点「录制」直接按组合键录入（`Esc` 取消、`Backspace` 清空，缺修饰键或方向键 / F 键等不支持的键会提示）；**留空 = 禁用快捷键**，改用麦克风按钮；**即时生效** |
| `composerShortcut` | `Alt+Enter` | 光标在输入框里时切换语音模式的快捷键（Mac 上即 Option+Enter），不插入换行；格式与录制方式同 `shortcut`；**留空 = 禁用**；设置卡片自己的输入框不拦截；`Cmd/Ctrl+Enter` 不占用；**即时生效**。「恢复默认」把两项快捷键恢复为 `Ctrl+Shift+V` 与 `Alt+Enter` |
| `wakeWord` | 空（关） | 唤醒词（如「你好小D」）：进入后先说唤醒词激活，避免误触；空 = 关闭。**可与命令连说**，词头自动剥掉不进消息；匹配带容错（编辑距离 ≤1 + 前 3 字符前导窗口，吸收同音字/语气词）；**建议 3-4 字**——单字词无容错、2 字词的容错会连带吸收所有同首字的 2 字词（如「小莫」也会唤醒「小张」），介意误唤醒用 3 字以上；每句断句或打断后回待机需重说；**仅 toggle 模式生效**（hold / 手动打断下不生效）；朗读期说唤醒词不触发 |
| `toolBeep` | `false` | 工具调用提示音（默认关）：开启后 AI 调用工具时「滴」一声；关闭则全程静默 |
| `spokenFormat` | `true` | 语音会话注入口语化提示词：开启后**仅当前语音会话**的回复被注入「口语化短句、不用 Markdown 排版符号」提示词（朗读更顺），**即时生效** |
| `senseITN` | `true` | SenseVoice 逆文本归一化（数字/日期/货币规范化；默认开） |
| `senseVoice` | `true` | 定稿是否用 SenseVoice 重译（带标点 + 数字归一化，更准；默认开）。**关闭可省 ~228MB 模型**，只走流式识别（更快、精度下降） |
| `captionFontSize` | `0` | 字幕字号档位 0=12px / 1=14px / 2=18px / 3=24px（默认 0 与现状字节等价） |
| `captionMaxWidth` | `1` | 字幕宽度档位 0=50vw / 1=70vw / 2=90vw（视口 <686px 窄于 480px，≈686px 接近 480px，>686px 宽于 480px） |
| `backchannelYield` | `true` | 让位语义（ADR-0008）；朗读期说「嗯/对」自动让位 1.5s + 真要说走硬打断；关 = 行为等同改造前 |
| `bargeInSalvage` | `true` | 打断语音抢救（Issue #15 批 1 / ADR-0012）：AI 朗读时你开口打断，自动保留从开口到打断生效之间你说的话，并入识别继续发送（修「打断吃句」；关 = 丢弃打断前语音——仅外放且无回声消除的环境建议关） |
| `llmCorrect` | `false` | LLM 纠错（Issue #15 批 4，默认关）：发送前用大模型对整条语音文本做一次纠错（只改错别字/同音字/标点，保持原意；复用宿主已配置模型。开 = 每条消息多一次约 1 秒的纠错等待；纠错失败自动用原文；模型改成回答你而非纠错时同样回退原文） |
```

</details>

**依据 2 · 源码核查**：[plugin/dsh-voice-mode/src/client.tsx:2998-3014](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/client.tsx#L2998-L3014)

自动发送关及播放门

<details>
<summary>查看原文（17行）</summary>

```text
        // 强制发送（按住 Ctrl / hold 松手）恒立即提交，绕过播放门与 autoSend 开关。
        if (meta?.force) {
          cancelAutoSend()
          // 按住说话 + 关闭自动发送：松手只定稿，不发送。
          if (bootNow().mode === 'hold' && bootNow().autoSend === false) return
          submitDraftNow(nextDraft)
          return
        }
        // hold 模式按住期间的非强制定稿（30s 滚段）：只累积进草稿，绝不自动发送（松手才发）。
        if (bootNow().mode === 'hold') return
        // AI 自聊修复：TTS 在播（bus.ui.playing）时不得自动发送非强制段——
        // 因 TTS 回声定稿后若无 gate 会经 onSegment 发出，进入 AI 回复→TTS→回声 → 自循环。
        if (bus.ui.playing) return
        // 自动提交门控：设置关闭时只留草稿，等待用户编辑/发送（once 照样走计时，到点收工）。
        if (bootNow().autoSend === false && bootNow().mode !== 'once') return
        // 累积模式：静音到点才发（期间再开口 → onState('speech') → cancelAutoSend 继续累积）。
        scheduleAutoSend()
```

</details>

**依据 3 · 源码核查**：[plugin/dsh-voice-mode/src/index.ts:1808-1826](https://github.com/qishuilalala/dsh-voice-mode/blob/a00fd6ad15507ba889bbf6e90d834c5a30643be5/plugin/dsh-voice-mode/src/index.ts#L1808-L1826)

退出和打断时的局部分支

<details>
<summary>查看原文（19行）</summary>

```text
            // 停 TTS（epoch++，积压与在途全弃）；hold 打断带 keepAsr=1 时保留在途
            // ASR 段（按住说的前半句已上行，松手定稿以同一 epoch 增量续传，
            // 若 reset 会把 host 流清空导致定稿缺前半句——对抗审查第三轮 Blocker）。
            queue.cancel(sessionId)
            // R15（Issue #15 Important-9）：回合以 abort / blocked / 空首步收场时，宿主**不**派发
            // agent/turn-stopping（abort 走 catch 直接重抛、blocked 走 return false），openTurns
            // 残留 → 回合闸门永不闭合 → 即便此后读尽也补不出 tts-idle，mode:once 只能等
            // ONCE_STALL_MS=10s 静默兜底。abandonTurn 只清闸门、**不补发**（补不补由 host 的
            // 上下文决定），且与上面 queue.cancel 语义**正交**：前者不碰 pending/在途，后者不碰
            // openTurns —— 两者互不覆盖，无先后依赖，调换顺序结果相同。
            if (isInterrupt) queue.abandonTurn(sessionId)
            // R15（Issue #15 Important-2 + Important-6 校正）：epoch 只作废**已入队**的句子，
            // 打断后仍在跑的 llm/stream 会把余句继续送进来（新 epoch 不作废）。此处记下
            // 「本回合静音 + 当时的回合号」，余句一律不入队（不合成、不计费、不下发）；
            // 解禁只发生在回合边界（tap 入口比对回合号），回合内的下一个 step 不解禁。
            readMuted.set(sessionId, { turn: turnOfSession.get(sessionId)?.turn ?? null, streams: 0 })
            if (!keepAsr && sessionId === activeVoiceSession) asr.reset(sessionId)
          }
          respondJson(res, 200, { ok: true })
```

</details>

#### 缺口

- 缺识别率、延迟、费用和人工返工实测
  **影响**：不能认为自然停顿一定省步骤
  **进一步探讨**：控制设备噪声，对比单个合格语音回合的时间、误发和纠错次数

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
