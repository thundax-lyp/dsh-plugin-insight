# dsh-plugin-mac-notify

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a9ef943](https://github.com/AK-blank/dsh-plugin-mac-notify/tree/a9ef9439a1e8f7957a402c742bc639919ab1d1c8)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-mac-notify)
<!-- END META -->

> **实现功能**：在macOS通知中心提醒DSH回合结束、等待回答、等待批准与错误，并可点击返回DSH页面。

> **核心亮点**：把回合、问题、批准和错误转成可配置Mac通知，并用argv传正文、公开可注入runtime及可选点击返回形成完整接线；贡献属于成熟系统能力的事件集成。详见[Q02](#research-q02)。

> **风险与缺陷**：去重key不含会话，紧急事件也先受同正文去重；点击按URL前缀只保证尝试返回页面。默认正文及trace含任务内容，均需隐私和多会话判断，未做漏报或误聚焦复现。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁需要哪些事件通知，什么才算任务完成？](#detail-section-11)
  - [Q02 · 事件到通知与点击返回的链路及贡献是什么？](#detail-section-12)
  - [Q03 · 哪些限制会影响隐私或返回正确性，工程可借鉴什么？](#detail-section-13)
  - [Q04 · 启动、生效与失败恢复依赖什么？](#detail-section-14)
  - [Q05 · 通知收益和全程成本能确定到哪里？](#detail-section-15)
  - [Q06 · 采用结论和后续设计假设如何落地？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Mac个人用户让长会话自行运行后收到人工接手提醒，合格结果须能识别事件并返回处理，不把idle当业务成功。

手工查看DSH或终端是直接替代；插件减少主动观察步骤，未证明人工响应时长下降。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 回合及错误通知 | 告知idle或报错 | 不代表业务目标完成 |
| 问题与批准提醒 | 呼叫人工回到DSH | urgent跳过pacing但仍受同内容去重 |
| 通知过滤 | 开关、子Agent排除、节奏控制 | key不含会话，跨会话同正文可能抑制 |
| 点击返回 | 聚焦运行浏览器或open | 需notifier和Automation；前缀匹配非精确会话 |
| 调试trace | 区分发送、跳过和失败 | 包含banner正文，需控制敏感留存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| macOS与Node>=18 | 通知必需/包声明 | 宿主ESM与系统通知 | 非macOS返回无发送的runtime清理 |
| DSH宿主事件与ctx.on | 接线必需 | 全局接收状态、问题和批准 | 单事件注册失败记warning，其余继续 |
| osascript | 基础通知后端 | 系统内建横幅 | 失败记trace，不能保证可见 |
| terminal-notifier与通知授权 | 点击返回分支需要 | 可点击横幅及系统声音 | 缺binary退osascript；存在但权限拒绝记失败 |
| 浏览器Automation权限 | 聚焦分支需要 | 读标签并激活 | 拒绝后尝试open，可能新开标签 |
| 正确URL或webServer端口 | 返回入口需要 | 确定实例目标 | 无目标时没有可用返回链接 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认正文可进入通知中心，检查系统通知策略 | 不把截断当脱敏 |
| 加载 | 安装固定来源宿主bundle，升级后重启DSH | 宿主事件监听生效，不依赖刷新网页 |
| 授权 | 如需点击，用户安装并允许notifier及浏览器Automation | 无权限时接受降级或关闭点击 |
| 使用与排查 | 用轨迹和trace区分disabled/duplicate/paced/failure | trace也含正文，应控制留存 |
| 退出 | 关闭事件或总开关，移除后重启 | 不假定已排队子进程被即时取消 |

不要把“无npm运行依赖”理解成无外部程序或权限。后端选择只检测notifier路径，通知权限失败并不等价于binary不存在，因此不能保证自动改用osascript。宿主服务读取缺失会降级副标题和自动URL，但这也可能减少正确定位信息。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地宿主/notifier/浏览器资源，金额未知 | 安装、重启、通知及Automation授权、隐私判断 | 没有通用配置耗时 |
| 持续使用 | 发送及声音子进程、点击时逐浏览器探测 | 处理横幅、辨别会话、复核正文 | 每通知开销和中断负担未测 |
| 失败恢复 | 重新通知、open新标签、trace文件留存 | 诊断权限、核对URL、发现被去重通知 | 需要回DSH轨迹确认未处理事件 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 提醒人工接手 | 状态、问题、批准、错误处理器可查 | 真正被用户看到及处理的比例 |
| 降低打扰 | 子Agent过滤、去重和节奏 | 降噪收益是否超过跨会话漏报风险 |
| 返回入口 | 运行浏览器前缀聚焦及open回退 | 是否回到准确实例/会话及响应耗时 |

串行pending避免同时起通知链，但积压会拖延后续紧急通知；urgent只跳过节奏，不插队。每个通知进程有超时，点击helper每个探测也有超时，不等于全流程固定上限。没有任务成功数、总人工时间和失败恢复次数，不能给净节时、低打扰或ROI数值。

> **思考**：去重key不含会话，紧急事件也先受同正文去重；点击按URL前缀只保证尝试返回页面。默认正文及trace含任务内容，均需隐私和多会话判断，未做漏报或误聚焦复现。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把回合、问题、批准和错误转成可配置Mac通知，并用argv传正文、公开可注入runtime及可选点击返回形成完整接线；贡献属于成熟系统能力的事件集成。详见[Q02](#research-q02)。

把回合、问题、批准和错误转成可配置Mac通知，并用argv传正文、公开可注入runtime及可选点击返回形成完整接线；贡献属于成熟系统能力的事件集成。详见[Q02](#research-q02)。

最关键的可靠性限制在跨会话去重。key只由title与body构成，未包含sessionId或subtitle；5秒内不同会话发相同问题或批准内容可被当重复跳过。紧急类型绕过的是pacing，不绕过更早的duplicate检查，因此作者“问题或批准总能通过”不是无条件成立。lastSentAt在真正发送成功前更新，发送失败后的相同通知也可能暂时被去重。本次为源码推导，未执行漏报复现。

点击只匹配URL字符串前缀，不按origin与端口边界解析，也不携带目标会话路由。目标http://127.0.0.1:3080可与30800前缀重叠，先找到的页签未必就是预期实例；即便实例正确，也只保证返回DSH页面而非本次发通知的会话。浏览器权限拒绝会降级新开标签，不提供已聚焦或用户已读确认。

隐私上，默认最后回复与提问/批准文本进入通知中心，启用JSONL trace还把banner内容写文件。截断是长度限制，不是敏感信息脱敏。工程优点是纯构造函数、可注入exec/exists/clock、事件异常隔离和disposer清理；自测用stub支持逻辑核查，不证明系统通知授权或真实浏览器自动化。发送pending在dispose时未取消，只清内存状态，热停用后的排队通知还需具体生命周期研究。

<a id="detail-section-5"></a>

### 1.4 主要限制

去重key不含会话，紧急事件也先受同正文去重；点击按URL前缀只保证尝试返回页面。默认正文及trace含任务内容，均需隐私和多会话判断，未做漏报或误聚焦复现。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

Mac个人用户可先在非敏感任务试用需要的提醒，核对多会话和返回归属；通知漏掉关键事件时回DSH直接观察，不当作审批执行或业务完成证明。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持宿主事件到系统通知的集成贡献；用户响应收益未测，跨会话去重与前缀返回有静态限制；事件收据为未实现假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/click.mjs、selftest.mjs、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码检查宿主事件、runtime、argv、点击helper及部分自测结构；未执行通知、声音、浏览器或安装，未复现静态风险。
- 下一步：进一步探讨可从双会话同问、发送失败重试和双端口浏览器页签入手，比较关键事件覆盖、误聚焦、重复打扰与正文留存。

**分析版本**

- **仓库**：[AK-blank/dsh-plugin-mac-notify](https://github.com/AK-blank/dsh-plugin-mac-notify)
- **版本号**：1.0.0（[固定提交 a9ef943](https://github.com/AK-blank/dsh-plugin-mac-notify/tree/a9ef9439a1e8f7957a402c742bc639919ab1d1c8)）
- **版本日期**：2026-10-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索按会话/请求身份去重与分层发送收据，在双会话同问和失败重试中比较覆盖、重复噪声与敏感留存；未实现，不冒称用户已读。详见[Q06](#research-q06)。

进一步探讨可从双会话同问、发送失败重试和双端口浏览器页签入手，比较关键事件覆盖、误聚焦、重复打扰与正文留存。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 3 | 1215 | 948 | 154 | — |
| .js | source | 1 | 890 | 623 | 193 | — |
| .md | source | 2 | 417 | — | — | 3621 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-mac-notify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-mac-notify/issues?q=is%3Aissue+created%3A2026-09-22T04%3A52%3A29.427Z..2026-10-22T04%3A52%3A29.427Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-mac-notify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A52%3A29.427Z..2026-10-22T04%3A52%3A29.427Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**判断固定版本Mac通知链的人工接手价值、隐私与可靠性边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要哪些事件通知，什么才算任务完成？

**研究主题：**场景与需求

#### 完整回答

面向在Mac上让DSH长任务自行运行、暂时离开浏览器或终端的个人用户。插件在running转idle、需要回答、需要批准和Agent报错时发系统横幅，帮助用户回来处理卡点。合格结果应是关键事件被及时提醒、能辨别所属任务并回到对应处理界面；横幅出现本身不能证明用户已经处理或任务交付合格。

原有办法是频繁查看DSH、观察终端或手工加系统提醒。插件把宿主事件变成统一通知，减少主动轮询。默认不提醒子Agent，避免多Agent放大噪声；但idle只代表一轮结束，不代表业务成功。源码根据本轮是否观察到错误调整结束标题，仍不知道用户目标是否满足。

通知正文会展示最后助手文本、问题选项或批准原因，因此适合能接受本机通知中心呈现任务摘要的人。对共享屏幕、锁屏隐私敏感场景或要求精确回到某个会话的人，默认行为和返回范围都需额外判断。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-30](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/README.md#L19-L30)

作者列出事件、正文和降噪主张。

<details>
<summary>查看原文（12行）</summary>

```text
## What it notifies

| Host event | When | Banner |
|---|---|---|
| `agent/status` → `idle` | the turn ended (a `running` → `idle` transition) | `DSH · 任务完成`, body = the last assistant text |
| `user-questions/request` | the agent called `ask_user_question` and is blocked | `DSH · 需要你的回答`, body = header · question · options |
| `approval/request` | the agent is waiting on an approval decision | `DSH · 需要你的批准`, body = the reason or the tool name |
| `agent/error` | a step or turn errored | `DSH · 执行出错`; the closing banner then reads `任务结束（有报错）` |

Subagent children stay silent (`includeSubagents: false` by default), identical
banners inside 5 s collapse into one, and consecutive non-urgent banners respect
a pacing gap — while a question or approval always gets through.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:643-670](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L643-L670)

仅running到idle触发完成，标题随错误状态变化，不校验业务交付。

<details>
<summary>查看原文（28行）</summary>

```text
  /** `agent/status` — the only signal that says "the turn is over". */
  const status = (payload) => {
    try {
      const agent = payload?.agent
      const next = payload?.status
      if (!agent || (next !== 'idle' && next !== 'running')) return
      const previous = state.status.get(agent.id)
      state.status.set(agent.id, next)
      if (next === 'running') {
        state.errored.set(agent.id, false)
        return
      }
      if (previous !== 'running') return
      const failed = state.errored.get(agent.id) === true
      const text = state.lastText.get(agent.id)
      const body = text
        ? truncate(text, config.bodyMaxChars)
        : failed
          ? copy.errorFallback
          : copy.finishFallback
      void notify(
        'finish',
        {
          title: title(failed ? copy.finishError : copy.finish),
          subtitle: workspaceOf(agent.id),
          body,
        },
        agent.id,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 事件到通知与点击返回的链路及贡献是什么？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

宿主apply创建runtime并仅在darwin注册8类全局事件。session事件缓存最后文本和头信息，状态、错误、问题与批准处理器拼装标题、副标题和正文。问题/批准处理器始终继续调用next，通知失败也不阻塞原交互。notify先按开关和子Agent过滤，再进行同内容去重和非紧急节奏控制，最终经串行pending链发送。

后端优先寻找terminal-notifier，不存在则用系统osascript。前者支持点击执行helper或打开URL，后者只提供文字和声音。通知文本作为execFile argv进入固定AppleScript；click命令中的Node路径、helper与URL逐个shell quote，避免把正文插入执行源码。点击目标优先配置URL，其次宿主webServer端口，最后环境变量。

helper先用pgrep寻找正在运行的候选浏览器，再通过AppleScript首个URL前缀匹配激活页签，找不到则用open。贡献是把DSH的关键人工接手点、降噪、系统声音和返回入口组合为可配置的本机通知链。系统通知、AppleScript和浏览器激活属于成熟机制，不能归为插件新发明；可借鉴的是事件失败隔离与数据/代码分离，而非已证明的用户响应速度提升。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:851-888](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L851-L888)

macOS范围、全局事件注册和disposer。

<details>
<summary>查看原文（38行）</summary>

```text
export function apply(ctx, config) {
  const runtime = createRuntime({ ctx, config, env: process.env })
  const { handlers } = runtime

  if (!runtime.supported) {
    ctx.logger?.debug?.('[mac-notify] macOS only: delivery is disabled on this platform')
    return () => runtime.dispose()
  }

  const listeners = [
    ['agent/status', handlers.status],
    ['agent/error', handlers.error],
    ['agent/disposed', handlers.agentDisposed],
    ['session/created', handlers.sessionCreated],
    ['session/event', handlers.sessionEvent],
    ['session/disposed', handlers.sessionDisposed],
    ['user-questions/request', handlers.question],
    ['approval/request', handlers.approval],
  ]

  const disposers = []
  for (const [name, listener] of listeners) {
    try {
      disposers.push(ctx.on(name, listener, { global: true }))
    } catch (error) {
      ctx.logger?.warn?.(`[mac-notify] could not subscribe ${name}: ${error?.message ?? error}`)
    }
  }

  return () => {
    for (const dispose of disposers) {
      try {
        dispose?.()
      } catch {
        /* ignore */
      }
    }
    runtime.dispose()
```

</details>

**依据 2 · 源码核查**：[lib/index.js:603-635](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L603-L635)

过滤、去重、节奏和发送队列。

<details>
<summary>查看原文（33行）</summary>

```text
  const notify = (kind, notification, sessionId) => {
    const refused = (() => {
      if (!config[KIND_SWITCH[kind]] || !allows(sessionId)) return 'disabled'
      const at = now()
      const key = `${notification.title}\u0000${notification.body}`
      if (key === state.lastKey && at - state.lastSentAt < IDENTICAL_WINDOW_MS) return 'duplicate'
      if (!URGENT_KINDS.has(kind) && config.minIntervalMs > 0 && at - state.lastSentAt < config.minIntervalMs) {
        return 'paced'
      }
      state.lastKey = key
      state.lastSentAt = at
      return ''
    })()

    if (refused) {
      state.skipped += 1
      trace(env, { event: 'skip', kind, reason: refused, ...notification })
      return Promise.resolve({ delivered: false, reason: refused })
    }

    const banner = {
      title: notification.title,
      subtitle: notification.subtitle ?? '',
      body: notification.body,
      sound: config.sound,
    }
    state.pending = state.pending.then(
      () => post(banner),
      () => post(banner),
    )
    return state.pending.then((result) => ({
      delivered: result.ok === true,
      reason: result.dryRun ? 'dry-run' : undefined,
```

</details>

**依据 3 · 源码核查**：[lib/index.js:242-291](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L242-L291)

文本argv与点击命令构造。

<details>
<summary>查看原文（50行）</summary>

```text
export function buildOsascriptArgs(notification) {
  const { title, subtitle, body, sound } = notification
  const lines = [
    'on run argv',
    'set theTitle to item 1 of argv',
    'set theSubtitle to item 2 of argv',
    'set theBody to item 3 of argv',
    'set theSound to item 4 of argv',
    'if theSubtitle is "" then',
    'if theSound is "" then',
    'display notification theBody with title theTitle',
    'else',
    'display notification theBody with title theTitle sound name theSound',
    'end if',
    'else',
    'if theSound is "" then',
    'display notification theBody with title theTitle subtitle theSubtitle',
    'else',
    'display notification theBody with title theTitle subtitle theSubtitle sound name theSound',
    'end if',
    'end if',
    'end run',
  ]
  const args = []
  for (const line of lines) args.push('-e', line)
  args.push(String(title ?? ''), String(subtitle ?? ''), String(body ?? ''), String(sound ?? ''))
  return args
}

/** Single-quote one shell word for the `sh -c` that runs a click command. */
export function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`
}

/**
 * Build the `terminal-notifier` argv for one banner.
 * @param notification - `{ title, subtitle, body, sound }` plus the click action.
 * @param click - `{ mode, url, command }`.
 * @returns argv for the notifier binary.
 */
export function buildTerminalNotifierArgs(notification, click) {
  const args = [
    '-title', String(notification.title ?? ''),
    '-message', String(notification.body ?? ''),
  ]
  if (notification.subtitle) args.push('-subtitle', String(notification.subtitle))
  if (notification.sound) args.push('-sound', String(notification.sound))
  if (click?.mode === 'focus' && click.command) args.push('-execute', click.command)
  else if (click?.mode === 'open' && click.url) args.push('-open', click.url)
  return args
```

</details>

**依据 4 · 源码核查**：[lib/click.mjs:111-126](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/click.mjs#L111-L126)

顺序查找运行浏览器，失败回退open。

<details>
<summary>查看原文（16行）</summary>

```text
async function main() {
  target = String(process.argv[2] ?? '').trim()
  if (!/^https?:\/\//.test(target)) return

  const candidates = [
    ...CHROMIUM.map((entry) => ({ ...entry, script: CHROMIUM_SCRIPT })),
    ...WEBKIT.map((entry) => ({ ...entry, script: WEBKIT_SCRIPT })),
  ]

  for (const candidate of candidates) {
    if (!(await isRunning(candidate.process))) continue
    // The source reads the URL from argv, so no value is interpolated as code.
    if (await focusIn(candidate.app, candidate.script)) return
  }

  await run('/usr/bin/open', [target])
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些限制会影响隐私或返回正确性，工程可借鉴什么？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

最关键的可靠性限制在跨会话去重。key只由title与body构成，未包含sessionId或subtitle；5秒内不同会话发相同问题或批准内容可被当重复跳过。紧急类型绕过的是pacing，不绕过更早的duplicate检查，因此作者“问题或批准总能通过”不是无条件成立。lastSentAt在真正发送成功前更新，发送失败后的相同通知也可能暂时被去重。本次为源码推导，未执行漏报复现。

点击只匹配URL字符串前缀，不按origin与端口边界解析，也不携带目标会话路由。目标http://127.0.0.1:3080可与30800前缀重叠，先找到的页签未必就是预期实例；即便实例正确，也只保证返回DSH页面而非本次发通知的会话。浏览器权限拒绝会降级新开标签，不提供已聚焦或用户已读确认。

隐私上，默认最后回复与提问/批准文本进入通知中心，启用JSONL trace还把banner内容写文件。截断是长度限制，不是敏感信息脱敏。工程优点是纯构造函数、可注入exec/exists/clock、事件异常隔离和disposer清理；自测用stub支持逻辑核查，不证明系统通知授权或真实浏览器自动化。发送pending在dispose时未取消，只清内存状态，热停用后的排队通知还需具体生命周期研究。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:603-619](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L603-L619)

去重先于urgent pacing，key不含会话及subtitle。

<details>
<summary>查看原文（17行）</summary>

```text
  const notify = (kind, notification, sessionId) => {
    const refused = (() => {
      if (!config[KIND_SWITCH[kind]] || !allows(sessionId)) return 'disabled'
      const at = now()
      const key = `${notification.title}\u0000${notification.body}`
      if (key === state.lastKey && at - state.lastSentAt < IDENTICAL_WINDOW_MS) return 'duplicate'
      if (!URGENT_KINDS.has(kind) && config.minIntervalMs > 0 && at - state.lastSentAt < config.minIntervalMs) {
        return 'paced'
      }
      state.lastKey = key
      state.lastSentAt = at
      return ''
    })()

    if (refused) {
      state.skipped += 1
      trace(env, { event: 'skip', kind, reason: refused, ...notification })
```

</details>

**依据 2 · 源码核查**：[lib/click.mjs:37-65](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/click.mjs#L37-L65)

AppleScript以URL starts with target首匹配，不做origin解析。

<details>
<summary>查看原文（29行）</summary>

```text
const CHROMIUM_SCRIPT = `on run argv
set target to item 1 of argv
tell application "%APP%"
repeat with w in windows
set i to 0
repeat with t in tabs of w
set i to i + 1
if (URL of t) starts with target then
set active tab index of w to i
set index of w to 1
activate
return "focused"
end if
end repeat
end repeat
end tell
return "absent"
end run`

const WEBKIT_SCRIPT = `on run argv
set target to item 1 of argv
tell application "%APP%"
repeat with w in windows
repeat with t in tabs of w
if (URL of t) starts with target then
set current tab of w to t
set index of w to 1
activate
return "focused"
```

</details>

**依据 3 · 源码核查**：[lib/index.js:550-583](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L550-L583)

trace写入banner/payload；长度限制不等于脱敏。

<details>
<summary>查看原文（34行）</summary>

```text
  const post = async (banner) => {
    const chosen = backend()
    const click = chosen.kind === 'terminal-notifier' ? clickFor() : { mode: 'none' }

    // A dry run must observe the decision without spawning anything.
    if (dryRun) {
      trace(env, { event: 'deliver', backend: chosen.kind, dryRun, click: click.mode, ...banner })
      return { ok: true, dryRun: true }
    }

    let soundName = ''
    let soundFile = ''
    if (config.sound === 'default') {
      const resolved = await resolveAlertSound()
      soundName = resolved.name
      soundFile = resolved.name ? '' : resolved.path
    } else if (config.sound !== 'off') {
      soundName = config.sound
    }
    const payload = { ...banner, sound: soundName }

    trace(env, { event: 'deliver', backend: chosen.kind, dryRun, click: click.mode, ...payload })

    // The banner is the graded job; a fallback sound rides along and never gates it.
    const sound = soundFile
      ? runExec(exec, AFPLAY, [soundFile], { timeout: 10_000 }).then((outcome) => {
          if (!outcome.ok) trace(env, { event: 'sound-failed', error: outcome.error })
        })
      : Promise.resolve()

    const notice =
      chosen.kind === 'terminal-notifier'
        ? runExec(exec, chosen.path, buildTerminalNotifierArgs(payload, click), { timeout: 10_000 })
        : runExec(exec, OSASCRIPT, buildOsascriptArgs(payload), { timeout: 10_000 })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:818-825](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L818-L825)

dispose只清状态表，没有取消pending队列。

```text
    /** Await every queued delivery (tests and shutdown paths). */
    flush: () => state.pending,
    dispose: () => {
      state.status.clear()
      state.lastText.clear()
      state.errored.clear()
      state.headers.clear()
    },
```

#### 缺口

- 跨会话相同正文抑制、前缀误匹配及热停用队列行为未做复现。
  **影响：**不能保证每个紧急请求都提醒，也不能保证点击返回正确实例或会话。
  **进一步探讨：**继续探讨可从双会话同问、3080/30800双实例和发送中禁用的可控事件序列入手，观察丢失与归属。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、生效与失败恢复依赖什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| macOS与Node>=18 | 通知必需/包声明 | 宿主ESM与系统通知 | 非macOS返回无发送的runtime清理 |
| DSH宿主事件与ctx.on | 接线必需 | 全局接收状态、问题和批准 | 单事件注册失败记warning，其余继续 |
| osascript | 基础通知后端 | 系统内建横幅 | 失败记trace，不能保证可见 |
| terminal-notifier与通知授权 | 点击返回分支需要 | 可点击横幅及系统声音 | 缺binary退osascript；存在但权限拒绝记失败 |
| 浏览器Automation权限 | 聚焦分支需要 | 读标签并激活 | 拒绝后尝试open，可能新开标签 |
| 正确URL或webServer端口 | 返回入口需要 | 确定实例目标 | 无目标时没有可用返回链接 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认正文可进入通知中心，检查系统通知策略 | 不把截断当脱敏 |
| 加载 | 安装固定来源宿主bundle，升级后重启DSH | 宿主事件监听生效，不依赖刷新网页 |
| 授权 | 如需点击，用户安装并允许notifier及浏览器Automation | 无权限时接受降级或关闭点击 |
| 使用与排查 | 用轨迹和trace区分disabled/duplicate/paced/failure | trace也含正文，应控制留存 |
| 退出 | 关闭事件或总开关，移除后重启 | 不假定已排队子进程被即时取消 |

不要把“无npm运行依赖”理解成无外部程序或权限。后端选择只检测notifier路径，通知权限失败并不等价于binary不存在，因此不能保证自动改用osascript。宿主服务读取缺失会降级副标题和自动URL，但这也可能减少正确定位信息。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-44](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/README.md#L32-L44)

作者说明平台、notifier与通知权限条件。

<details>
<summary>查看原文（13行）</summary>

```text
## Requirements

- macOS. On any other platform the plugin activates, logs a debug line, and
  sends nothing.
- Optional, for click-to-open: [`terminal-notifier`](https://github.com/julienXX/terminal-notifier)
  (`brew install terminal-notifier`). Without it the plugin falls back to the
  `osascript` banner every macOS ships — same text, same sound, no click action.

On recent macOS an ad-hoc signed notifier is refused until you allow it once:
**System Settings → Notifications → terminal-notifier → Allow Notifications**
(style *Banners*, *Play notification sound* on). Until then
`terminal-notifier -diagnose` reports `authorization: not requested yet` and
sending returns `Notifications are not allowed for this application`.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:479-490](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L479-L490)

后端根据路径与缓存选择，不是根据权限失败切换。

<details>
<summary>查看原文（12行）</summary>

```text
  const backend = () => {
    if (config.notifier === 'osascript') return { kind: 'osascript', path: '' }
    if (config.notifier === 'terminal-notifier') {
      const path = findNotifier(exists, env)
      return path ? { kind: 'terminal-notifier', path } : { kind: 'osascript', path: '' }
    }
    const at = now()
    if (state.backend && at - state.backendCheckedAt < BACKEND_TTL_MS) return state.backend
    const path = findNotifier(exists, env)
    state.backend = path ? { kind: 'terminal-notifier', path } : { kind: 'osascript', path: '' }
    state.backendCheckedAt = at
    return state.backend
```

</details>

**依据 3 · 源码核查**：[lib/index.js:465-470](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L465-L470)

点击URL来源顺序。

```text
  const targetUrl = () => {
    if (config.url) return config.url
    const port = readService('webServer')?.port
    if (typeof port === 'number' && Number.isFinite(port)) return `http://127.0.0.1:${port}`
    const fromEnv = String(env.DSH_WEB_URL ?? '').trim()
    return /^https?:\/\//.test(fromEnv) ? fromEnv : ''
```

**依据 4 · 作者声明**：[README.md:112-115](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/README.md#L112-L115)

作者说明浏览器Automation权限与open降级。

```text
Reading another app's tabs needs macOS Automation permission, which the system
grants per browser on first use (click *Allow* on the “terminal-notifier wants
to control …” prompt). A denial is not fatal: the helper falls through to
`open`, so you land on the DSH page in a new tab instead of the existing one.
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 通知收益和全程成本能确定到哪里？

**研究主题：**效果与总成本

#### 完整回答

单位任务应是一次需要人工接手的会话事件被注意到并正确处理。只统计横幅发送数不能证明减少等待或减少人工轮询。源码给出节奏、去重和过滤，但没有用户到达时间、误报/漏报率或任务恢复数据。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地宿主/notifier/浏览器资源，金额未知 | 安装、重启、通知及Automation授权、隐私判断 | 没有通用配置耗时 |
| 持续使用 | 发送及声音子进程、点击时逐浏览器探测 | 处理横幅、辨别会话、复核正文 | 每通知开销和中断负担未测 |
| 失败恢复 | 重新通知、open新标签、trace文件留存 | 诊断权限、核对URL、发现被去重通知 | 需要回DSH轨迹确认未处理事件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 提醒人工接手 | 状态、问题、批准、错误处理器可查 | 真正被用户看到及处理的比例 |
| 降低打扰 | 子Agent过滤、去重和节奏 | 降噪收益是否超过跨会话漏报风险 |
| 返回入口 | 运行浏览器前缀聚焦及open回退 | 是否回到准确实例/会话及响应耗时 |

串行pending避免同时起通知链，但积压会拖延后续紧急通知；urgent只跳过节奏，不插队。每个通知进程有超时，点击helper每个探测也有超时，不等于全流程固定上限。没有任务成功数、总人工时间和失败恢复次数，不能给净节时、低打扰或ROI数值。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:580-591](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L580-L591)

通知/声音子进程与失败保留。

<details>
<summary>查看原文（12行）</summary>

```text
    const notice =
      chosen.kind === 'terminal-notifier'
        ? runExec(exec, chosen.path, buildTerminalNotifierArgs(payload, click), { timeout: 10_000 })
        : runExec(exec, OSASCRIPT, buildOsascriptArgs(payload), { timeout: 10_000 })

    const [result] = await Promise.all([notice, sound])
    if (result?.ok) state.sent += 1
    else {
      state.failures.push(result?.error ?? 'unknown')
      if (state.failures.length > 20) state.failures.shift()
      trace(env, { event: 'failure', error: result?.error })
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:603-635](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L603-L635)

urgent并不插队，所有发送进入串行pending。

<details>
<summary>查看原文（33行）</summary>

```text
  const notify = (kind, notification, sessionId) => {
    const refused = (() => {
      if (!config[KIND_SWITCH[kind]] || !allows(sessionId)) return 'disabled'
      const at = now()
      const key = `${notification.title}\u0000${notification.body}`
      if (key === state.lastKey && at - state.lastSentAt < IDENTICAL_WINDOW_MS) return 'duplicate'
      if (!URGENT_KINDS.has(kind) && config.minIntervalMs > 0 && at - state.lastSentAt < config.minIntervalMs) {
        return 'paced'
      }
      state.lastKey = key
      state.lastSentAt = at
      return ''
    })()

    if (refused) {
      state.skipped += 1
      trace(env, { event: 'skip', kind, reason: refused, ...notification })
      return Promise.resolve({ delivered: false, reason: refused })
    }

    const banner = {
      title: notification.title,
      subtitle: notification.subtitle ?? '',
      body: notification.body,
      sound: config.sound,
    }
    state.pending = state.pending.then(
      () => post(banner),
      () => post(banner),
    )
    return state.pending.then((result) => ({
      delivered: result.ok === true,
      reason: result.dryRun ? 'dry-run' : undefined,
```

</details>

**依据 3 · 源码核查**：[lib/click.mjs:74-105](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/click.mjs#L74-L105)

每个探测有超时且按浏览器逐一查询。

<details>
<summary>查看原文（32行）</summary>

```text
function run(file, args) {
  return new Promise((resolve) => {
    let settled = false
    const done = (value) => {
      if (settled) return
      settled = true
      resolve(value)
    }
    try {
      execFile(file, args, { timeout: TIMEOUT_MS }, (error, stdout) => {
        done({ ok: !error, stdout: String(stdout ?? '') })
      })
    } catch {
      done({ ok: false, stdout: '' })
    }
  })
}

/** Whether a process with this exact name is running. */
async function isRunning(processName) {
  const { ok } = await run('/usr/bin/pgrep', ['-x', processName])
  return ok
}

/** Ask one running browser to surface its DSH tab. */
async function focusIn(app, script) {
  const lines = script.replace('%APP%', app).split('\n')
  const args = []
  for (const line of lines) args.push('-e', line)
  args.push(target)
  const { ok, stdout } = await run('/usr/bin/osascript', args)
  return ok && stdout.includes('focused')
```

</details>

#### 缺口

- 没有真实提醒到达率、人工响应时间和跨会话漏报对照。
  **影响：**只能确认发送机制，不能证明通知改善任务效率。
  **进一步探讨：**可用相同长任务/等待事件比较主动轮询与通知模式，记录用户到达、误报漏报和中断时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 采用结论和后续设计假设如何落地？

**研究主题：**新假设与验证、采用判断

#### 完整回答

建议试用，适合Mac个人用户在非敏感任务中让长会话呼叫自己回来，同时愿意保留DSH轨迹为实际状态依据。不适合把通知当审批执行、可靠送达收据或业务完成证明。先明确通知中心正文暴露范围，只开启需要的事件，核对多会话相同问题、点击正确实例和权限拒绝的降级；漏掉关键请求或不能解释返回归属时，应回到DSH直接观察。

可以推导按会话和事件身份的通知收据假设。当前去重仅看标题正文，会跨会话合并；若改为稳定会话/请求ID加事件类型去重，并将“尝试发送”“后端接受”“用户聚焦”分开记录，可能减少误抑制并让故障归因更清楚。系统仍未提供用户真正处理请求的证明，不能伪造已读状态。新增收据状态和保留策略也增加隐私与维护负担。

最小对照是在两个会话中安排相同问题、相同批准、发送失败重试以及多浏览器返回，比较提醒覆盖、重复打扰、错误聚焦和日志敏感内容。若精确身份只增加重复噪声或敏感留存而未减少漏报，应否定收益。该方向未实现，不加入现有创新评分；没有本轮真实安装、通知核心功能和卸载验收，不能给值得安装结论。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:603-613](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L603-L613)

身份不进入去重key，是按请求收据假设的起点。

<details>
<summary>查看原文（11行）</summary>

```text
  const notify = (kind, notification, sessionId) => {
    const refused = (() => {
      if (!config[KIND_SWITCH[kind]] || !allows(sessionId)) return 'disabled'
      const at = now()
      const key = `${notification.title}\u0000${notification.body}`
      if (key === state.lastKey && at - state.lastSentAt < IDENTICAL_WINDOW_MS) return 'duplicate'
      if (!URGENT_KINDS.has(kind) && config.minIntervalMs > 0 && at - state.lastSentAt < config.minIntervalMs) {
        return 'paced'
      }
      state.lastKey = key
      state.lastSentAt = at
```

</details>

**依据 2 · 源码核查**：[lib/index.js:633-636](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js#L633-L636)

delivered只是后端结果，未包含用户已读或处理确认。

```text
    return state.pending.then((result) => ({
      delivered: result.ok === true,
      reason: result.dryRun ? 'dry-run' : undefined,
    }))
```

**依据 3 · 源码核查**：[lib/click.mjs:120-126](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/click.mjs#L120-L126)

点击仅尝试聚焦或open，不知道用户处理结果。

```text
  for (const candidate of candidates) {
    if (!(await isRunning(candidate.process))) continue
    // The source reads the URL from argv, so no value is interpolated as code.
    if (await focusIn(candidate.app, candidate.script)) return
  }

  await run('/usr/bin/open', [target])
```

#### 缺口

- 按事件身份的通知收据是否兼顾提醒覆盖、噪声与隐私尚无结果。
  **影响：**仍是设计假设，不提升当前可靠性保证。
  **进一步探讨：**可先用可控双会话事件与发送失败重试比较漏报和重复提醒，再评估收据保留边界。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
