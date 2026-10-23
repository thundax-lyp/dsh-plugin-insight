# dsh-notification-desktop

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a1c9725](https://github.com/Adingo001/dsh-notification-desktop/tree/a1c9725b83b56de48f684a876f0ea997cfabaad1)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在 DSH 0.2.x 轮次结束时按原因与后台状态触发桌面或浏览器通知。

> **核心亮点**：在上游通知逻辑上适配0.2.x快照/retention并提供Windows宿主WinRT通路，区分权限与呈现。参见[Q01](#research-q01)。

> **风险与缺陷**：Electron不分OS均POST，Host却只支持Windows；投递失败不重试且提前记成功，npm files又不含运行脚本，故不能以日志成功认定系统提醒生效。参见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 哪种等待被改变，贡献归属与合格通知是什么？](#detail-section-11)
  - [Q02 · 从事件投影到toast的链路能保证显示一次吗？](#detail-section-12)
  - [Q03 · 安装、权限、发布包和恢复各有什么负担？](#detail-section-13)
  - [Q04 · 目前何时采用，怎样证伪新的可靠投递设计？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：后台长轮次用户需要完成提醒；验收为及时且不重复地知道返回查看，不把结束事件当任务质量验收。

人工查看会话或浏览器原生Notification是简单参照；上游投影与通知逻辑是继承基础，本项价值集中0.2.x和Windows适配。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 完成投影 | 观察turn/end | 不含待审批，正文是截断累积 |
| 桌面提醒 | 后台通知 | Host仅Windows，需脚本/AUMID |
| 浏览器提醒 | Web通知 | 需权限，不保证系统实际呈现 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH0.2.x投影/slots/list | 启动必需 | 完成观察和设置 | 无提醒，人工查看 |
| Windows/PowerShell/WinRT、toast脚本 | 桌面主路径必需 | 系统呈现 | 非Windows跳过，缺脚本失败 |
| AUMID及协议注册 | Windows呈现/回焦条件 | 系统归属 | 按作者说明排查/撤销 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核安装内容与系统 | 脚本在位、受支持OS |
| 2 | 用户配置注册项与设置 | 实际测试toast显示，非只granted |
| 3 | 用户后台完成非敏感轮次 | 每轮按原因提醒，查trace区分失败 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装资源、Windows注册项 | 核脚本、AUMID、权限与测试 | 金额/工时未知 |
| 持续使用 | 进程、临时日志和摘要通知 | 处理中断、控制敏感正文 | 日志文件未轮转 |
| 失败恢复 | 重试/清临时文件 | 查回执/脚本、撤销注册项 | 不保证重试不重复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 完成识别 | turn/end投影与增量门控 | 重连窗口内不漏报 |
| 通知投递 | WinRT进程/浏览器API | 实际显示、正确系统归属 |
| 诊断 | 门控与helper trace | 成功日志非显示证明，文件未轮转 |

> **思考**：Electron不分OS均POST，Host却只支持Windows；投递失败不重试且提前记成功，npm files又不含运行脚本，故不能以日志成功认定系统提醒生效。参见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：在上游通知逻辑上适配0.2.x快照/retention并提供Windows宿主WinRT通路，区分权限与呈现。参见[Q01](#research-q01)。

在上游通知逻辑上适配0.2.x快照/retention并提供Windows宿主WinRT通路，区分权限与呈现。参见[Q01](#research-q01)。

纯fold与客户端门控分离便于复用；需将观测turn、投递和显示分为不同事实。当前脚本files、跨OS路由和临时日志边界增加维护负担，详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Electron不分OS均POST，Host却只支持Windows；投递失败不重试且提前记成功，npm files又不含运行脚本，故不能以日志成功认定系统提醒生效。参见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察并核制品/路由，Windows非敏感任务以实际toast验收后再试用；Mac/Linux桌面不依当前路径。参见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

0.2.x接线与WinRT调用有源码支持；实际显示、制品完整性与访问边界待核；可靠回执为未验证假设。

- 已检查：作者 README、包清单、源码路径 index.js、client.js、package.json、scripts/toast.ps1、scripts/fix-toast-aumid.ps1 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查投影、客户端门控、路由、脚本引用和发布files；未运行系统通知或注册表修改，未审计全部原生focus实现。
- 下一步：未执行。先核制品及路由权限，再对网络/helper/脚本/OS/重连五场景记录真实显示与重复。

**分析版本**

- **仓库**：[Adingo001/dsh-notification-desktop](https://github.com/Adingo001/dsh-notification-desktop)
- **版本号**：0.3.1（[固定提交 a1c9725](https://github.com/Adingo001/dsh-notification-desktop/tree/a1c9725b83b56de48f684a876f0ea997cfabaad1)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为分层回执、session/turn幂等键与OS能力探测；只重试明确未投递，故障对照实际显示和重复。参见[Q04](#research-q04)。

未执行。先核制品及路由权限，再对网络/helper/脚本/OS/重连五场景记录真实显示与重复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1028 | 824 | 135 | — |
| .md | source | 1 | 148 | — | — | 2465 |
| .mjs | source | 1 | 86 | 68 | 11 | — |
| .mjs | test | 2 | 290 | 237 | 18 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/Adingo001/dsh-notification-desktop/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：0.2.x完成通知的投影、系统呈现与采用边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪种等待被改变，贡献归属与合格通知是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向把长轮次放后台、需要知道何时回来查看结果的DSH 0.2.x用户。合格任务是某轮结束后只提醒一次、正文不泄露不必要内容且用户能回到工作；它不检验任务结果正确。相对盯窗口，通知降低反复查看；相对上游通知插件，增量是0.2.x投影/retention接线和Windows宿主WinRT路径。

README明确基于omdsh-dev/dsh-notification移植，不能把投影模型归为原创；也明确没有移植待审批提醒。完成和待用户操作属于不同事件，本插件只覆盖完成边。系统权限granted与真正呈现分开理解是有价值的操作经验，但作者实测不能代替本轮验收。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-23](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/README.md#L1-L23)

作者列上游与完成边限制。

<details>
<summary>查看原文（23行）</summary>

```text
# dsh-notification-desktop

给 **DeepSeek Harness 0.2.x** 用的「一轮跑完就弹系统通知」插件。上游 [`omdsh-dev/dsh-notification`](https://github.com/omdsh-dev/dsh-notification) 只覆盖 0.1.1 / 0.1.2 的客户端布局，这个包是它的 0.2.x 移植版。

## 它做什么

- Host 半边注册一个 `notification` 会话投影：折叠每个会话的最后一次 `turn/end`，得到 `{ turn, reason, body, tools }`；再提供一个 `POST /dsh-notification-desktop/notify` 路由，用 WinRT 真正把 toast 弹出来。
- Client 半边盯住 `ctx.sessions.list` 里这个投影的 `turn` 单调上升，决定这一轮要不要提醒（原因过滤、后台限制、总开关）；**桌面壳里把内容 POST 给宿主去弹，浏览器里才用页面自己的 `Notification`**。正文是该轮最后一段助手回复（Host 侧截到 400 字符，Client 侧再按设置截一次）。
- 设置页在 **设置 → 完成提醒**：总开关、按结束原因过滤、仅后台提醒、通知常驻、正文长度、权限状态、发测试通知。

投影是纯函数，Host 侧只注册、不碰会话日志以外的任何东西；Client 侧只用公开的 `sessions.list` 快照和 `settings.section` 槽位。

## 相对上游 0.1.4 改了什么

| 上游 | 0.2.x 适配 |
| --- | --- |
| `dsh.client.inject` 列 `dsh-client-runtime` / `dsh-client-store` / `dsh-client-ui-slots` / `dsh-client-ui-settings` / `dsh-client-locale` | 改成 `inject: []`：`dsh-client-runtime` 在 0.2.x 里根本不存在，而顺序已经由服务 `inject: ['slots','locale']` 和 `ctx.slots.inject()` 表达；少列一个不存在的 id 就少一个模块永远等不到依赖的风险 |
| `ctx.get('sessions').list.getSnapshot()` 取 `{ ids, byId, current }` | 0.2.x 快照是 `{ ids, byId, phase, projectionsBySession }`，行内是 `projectionValues` / `displayTitle` / `retainedBy` |
| 用 `state.current` 判断「正在看的会话」 | 改读 `row.retainedBy.mainView > 0`（0.2.x 的 retention 才是权威） |
| `uiSession.pendingInteractions` 做「等你审批/回答」提醒 | **未移植**：0.2.x 的 `pendingInteraction` 只在 `ui-session` 的 Slot hook 里（`sessionStatus`），不是可订阅的根服务；只做完成边。 |
| `@deepseek-ai/dsh-client-store` 存设置 | 依赖不可解析，改成 localStorage + 一个自带的极简 observable |
| 设置页用自家 styles/组件 | 只用 React + 宿主主题 CSS 变量（`--dsw-alias-*`），不引外部组件包 |

```

</details>

**依据 2 · 源码核查**：[index.js:135-166](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/index.js#L135-L166)

投影仅在turn/end形成最后完成状态。

<details>
<summary>查看原文（32行）</summary>

```text
export function reduce(state, event) {
  switch (event.type) {
    case 'turn/start':
      return { ...state, open: { turn: event.data.turn, text: '', tools: [] } }
    case 'assistant/message': {
      const open = state.open
      if (open === null || open.turn !== event.data.turn) return state
      let text = open.text
      const content = event.data.message?.content ?? []
      for (const block of content) {
        if (block && block.type === 'text' && typeof block.text === 'string') text += block.text
      }
      text = bound(text)
      if (text === open.text) return state
      return { ...state, open: { ...open, text } }
    }
    case 'tool/call': {
      const open = state.open
      if (open === null || open.turn !== event.data.turn) return state
      if (typeof event.data.name !== 'string' || open.tools.includes(event.data.name)) return state
      return { ...state, open: { ...open, tools: [...open.tools, event.data.name] } }
    }
    case 'turn/end': {
      // Advance the turn number even when this session was observed mid-turn
      // (no turn/start in memory): the client dedupes on a monotonic turn, so
      // a silent advance is safer than a missed one.
      const open = state.open
      const sameTurn = open !== null && open.turn === event.data.turn
      const body = sameTurn ? open.text.trim() : ''
      const tools = sameTurn ? open.tools : []
      const reason = event.data.reason?.kind ?? ''
      return { open: null, last: { turn: event.data.turn, reason, body, tools } }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从事件投影到toast的链路能保证显示一次吗？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Host按turn/start、assistant/message、tool/call累积后在turn/end发布视图，body最多400字符。实际是把同轮文本追加并持续截断，不是README所称“最后一段回复”；后段答案可能不在预览。客户端首次和重连seed基线避免历史重报，turn增长后先更新observed，再按总开关/原因/后台过滤，Electron一律POST宿主，其余用浏览器Notification。

去重是尽力而为：网络失败被吞掉，observed已推进，客户端在未等HTTP结果时记录deliver ok:true，因此投递日志不等于显示成功，也没有可靠重试。Host非Windows直接跳过，意味着macOS/Linux Electron也走到不显示路径。路由204仅表示请求已受理，PowerShell退出另记trace。纯fold与门控可借鉴，但不构成端到端恰好一次通知保证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:135-166](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/index.js#L135-L166)

文本追加和400字符预算。

<details>
<summary>查看原文（32行）</summary>

```text
export function reduce(state, event) {
  switch (event.type) {
    case 'turn/start':
      return { ...state, open: { turn: event.data.turn, text: '', tools: [] } }
    case 'assistant/message': {
      const open = state.open
      if (open === null || open.turn !== event.data.turn) return state
      let text = open.text
      const content = event.data.message?.content ?? []
      for (const block of content) {
        if (block && block.type === 'text' && typeof block.text === 'string') text += block.text
      }
      text = bound(text)
      if (text === open.text) return state
      return { ...state, open: { ...open, text } }
    }
    case 'tool/call': {
      const open = state.open
      if (open === null || open.turn !== event.data.turn) return state
      if (typeof event.data.name !== 'string' || open.tools.includes(event.data.name)) return state
      return { ...state, open: { ...open, tools: [...open.tools, event.data.name] } }
    }
    case 'turn/end': {
      // Advance the turn number even when this session was observed mid-turn
      // (no turn/start in memory): the client dedupes on a monotonic turn, so
      // a silent advance is safer than a missed one.
      const open = state.open
      const sameTurn = open !== null && open.turn === event.data.turn
      const body = sameTurn ? open.text.trim() : ''
      const tools = sameTurn ? open.tools : []
      const reason = event.data.reason?.kind ?? ''
      return { open: null, last: { turn: event.data.turn, reason, body, tools } }
```

</details>

**依据 2 · 源码核查**：[index.js:183-218](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/index.js#L183-L218)

非Windows跳过与异步子进程状态。

<details>
<summary>查看原文（36行）</summary>

```text
function showToast(payload) {
  if (process.platform !== 'win32') {
    recordTrace({ kind: 'host-notify-skip', reason: 'not-windows' })
    return
  }
  const file = join(tmpdir(), `dsh-notification-toast-${process.pid}-${Date.now()}.json`)
  try {
    writeFileSync(
      file,
      JSON.stringify({ aumid: AUMID, title: String(payload.title ?? ''), body: String(payload.body ?? '') }),
      'utf8',
    )
  } catch (error) {
    recordTrace({ kind: 'host-notify-error', stage: 'write', message: String((error && error.message) || error) })
    return
  }
  try {
    const child = spawn(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', TOAST_SCRIPT, file],
      { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] },
    )
    // Capture the helper's output: a toast that silently fails is otherwise
    // indistinguishable from one that displayed.
    let output = ''
    const collect = chunk => {
      output += chunk
      if (output.length > 4000) output = output.slice(-4000)
    }
    child.stdout.on('data', collect)
    child.stderr.on('data', collect)
    child.on('error', error => {
      recordTrace({ kind: 'host-notify-error', stage: 'spawn', message: String((error && error.message) || error) })
    })
    child.on('close', code => {
      recordTrace({ kind: 'host-notify-result', code, output: output.trim() })
```

</details>

**依据 3 · 源码核查**：[client.js:261-278](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/client.js#L261-L278)

Electron检测与fire-and-forget。

<details>
<summary>查看原文（18行）</summary>

```text
    /** True inside the Electron desktop shell, whose toast path needs the host. */
    function isDesktopShell() {
      return typeof navigator !== 'undefined' && /electron/i.test(navigator.userAgent || '')
    }

    /**
     * Ask the host half to show one toast. Fire-and-forget.
     * @param {{ title: string, body: string, tag: string, turn: number }} payload
     */
    function pushToast(payload) {
      try {
        fetch(NOTIFY_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {})
      } catch {
        /* the host route is a best-effort delivery channel */
```

</details>

**依据 4 · 源码核查**：[client.js:338-350](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/client.js#L338-L350)

尚未回执就记录成功。

<details>
<summary>查看原文（13行）</summary>

```text
      const fire = (api, row, projection, settings) => {
        const title = t(REASON_TITLE[projection.reason] ?? 'titleCompleted')
        const limit = settings.bodyChars
        const body = clampBody(projection.body, limit) || t('emptyBody')
        const subtitle = sessionTitleOf(row, t)
        const tag = tagOf(row.id, projection.turn)
        const text = subtitle === '' ? body : `${subtitle}\n${body}`
        const deliver = () => {
          if (isDesktopShell()) {
            // On the desktop shell Chromium's Windows presenter reports success
            // and Windows drops the toast, so the host shows it instead.
            pushToast({ title, body: text, tag, turn: projection.turn })
            report({ kind: 'deliver', ok: true, via: 'host', tag, title, turn: projection.turn })
```

</details>

**依据 5 · 源码核查**：[client.js:388-419](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/client.js#L388-L419)

observed先推进再过滤。

<details>
<summary>查看原文（32行）</summary>

```text
        for (const id of state.ids) {
          const row = state.byId?.[id]
          if (row === undefined || row === null) continue
          const projection = row.projectionValues?.notification
          const turn = turnOf(row)
          const previous = observed.get(id)
          observed.set(id, turn)
          if (previous !== undefined && turn !== previous) changed.push({ id, from: previous, to: turn })
          if (previous === undefined || turn <= previous) continue
          if (!settings.enabled) {
            report({ kind: 'skip', id, turn, previous, skip: 'disabled' })
            continue
          }
          if (api === undefined && !isDesktopShell()) {
            report({ kind: 'skip', id, turn, previous, skip: 'no-api' })
            continue
          }
          if (projection === undefined || projection === null) {
            report({ kind: 'skip', id, turn, previous, skip: 'no-projection' })
            continue
          }
          const flag = REASON_FLAG[projection.reason]
          if (flag === undefined) {
            report({ kind: 'skip', id, turn, previous, skip: 'reason-not-mapped', reason: projection.reason })
            continue
          }
          if (settings[flag] !== true) {
            report({ kind: 'skip', id, turn, previous, skip: 'reason-off', reason: projection.reason })
            continue
          }
          if (settings.backgroundOnly && !document.hidden && isMainView(row)) {
            report({ kind: 'skip', id, turn, previous, skip: 'background-only', hidden: document.hidden, main: isMainView(row) })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装、权限、发布包和恢复各有什么负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Windows主路径依赖PowerShell/WinRT、脚本toast.ps1和已注册AUMID；fix-toast-aumid脚本还会写用户注册表与协议handler，退出需要撤销。一个发布边界是package.files没有scripts目录，而index.js用相对路径加载scripts/toast.ps1。源码/Git安装含脚本不等于npm打包产物含脚本，当前未打包实测，应先核实际制品。

trace/notify路由显式CORS星号且未在处理器内见Connection准入；是否被上层统一保护未知，外部读取日志/触发通知的安全边界不能由“本机路由”推定。trace内存200条但临时文件append不轮转，DELETE只清内存，隐私与磁盘清理需要用户负责。首次注册、日常打断和故障排查都有时间成本；无强制模型调用但系统进程、日志和通知摘要并非无资源/隐私负担。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:15-24](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/package.json#L15-L24)

files白名单不含scripts。

<details>
<summary>查看原文（10行）</summary>

```text
  "files": [
    "index.js",
    "client.js",
    "cordis.patch.yml",
    "locale/en.json",
    "locale/zh.json",
    "icon.svg",
    "README.md",
    "LICENSE"
  ],
```

</details>

**依据 2 · 源码核查**：[index.js:34-37](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/index.js#L34-L37)

运行依赖相对toast脚本。

```text
const AUMID = 'electron.app.DeepSeek Harness'

/** The ASCII-only Windows toast helper this host half spawns. */
const TOAST_SCRIPT = fileURLToPath(new URL('./scripts/toast.ps1', import.meta.url))
```

**依据 3 · 源码核查**：[index.js:60-67](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/index.js#L60-L67)

文件追加不随内存环裁剪。

```text
function recordTrace(record) {
  trace.push(record)
  if (trace.length > TRACE_LIMIT) trace.splice(0, trace.length - TRACE_LIMIT)
  try {
    appendFileSync(TRACE_FILE, `${JSON.stringify(record)}\n`, 'utf8')
  } catch {
    /* the in-memory ring is enough */
  }
```

**依据 4 · 源码核查**：[index.js:247-289](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/index.js#L247-L289)

trace CORS与DELETE行为。

<details>
<summary>查看原文（43行）</summary>

```text
  ctx.inject(['webServer'], host => {
    host.effect(
      () =>
        host.webServer.register({
          path: '/dsh-notification-desktop/trace',
          handler: async (request, response) => {
            const headers = {
              'access-control-allow-origin': '*',
              'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
              'access-control-allow-headers': 'content-type',
              'cache-control': 'no-store',
            }
            if (request.method === 'OPTIONS') {
              response.writeHead(204, headers)
              response.end()
              return
            }
            if (request.method === 'POST') {
              try {
                let body = ''
                for await (const chunk of request) {
                  body += chunk
                  if (body.length > 64 * 1024) throw new Error('body too large')
                }
                const trimmed = body.trim()
                if (trimmed !== '') recordTrace(JSON.parse(trimmed))
                response.writeHead(204, headers)
                response.end()
              } catch (error) {
                response.writeHead(400, { ...headers, 'content-type': 'application/json' })
                response.end(JSON.stringify({ ok: false, error: String((error && error.message) || error) }))
              }
              return
            }
            if (request.method === 'DELETE') {
              trace.length = 0
              response.writeHead(204, headers)
              response.end()
              return
            }
            if (request.method === 'GET') {
              response.writeHead(200, { ...headers, 'content-type': 'application/json' })
              response.end(JSON.stringify({ ok: true, file: TRACE_FILE, count: trace.length, entries: trace }))
```

</details>

**依据 5 · 源码核查**：[index.js:301-335](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/index.js#L301-L335)

notify无局部Connection检查。

<details>
<summary>查看原文（35行）</summary>

```text
        host.webServer.register({
          path: '/dsh-notification-desktop/notify',
          handler: async (request, response) => {
            const headers = {
              'access-control-allow-origin': '*',
              'access-control-allow-methods': 'POST, OPTIONS',
              'access-control-allow-headers': 'content-type',
              'cache-control': 'no-store',
            }
            if (request.method === 'OPTIONS') {
              response.writeHead(204, headers)
              response.end()
              return
            }
            if (request.method !== 'POST') {
              response.writeHead(405, headers)
              response.end()
              return
            }
            try {
              let body = ''
              for await (const chunk of request) {
                body += chunk
                if (body.length > 64 * 1024) throw new Error('body too large')
              }
              const payload = JSON.parse(body.trim() === '' ? '{}' : body)
              showToast(payload)
              recordTrace({ kind: 'host-notify', title: payload.title, turn: payload.turn })
              response.writeHead(204, headers)
              response.end()
            } catch (error) {
              response.writeHead(400, { ...headers, 'content-type': 'application/json' })
              response.end(JSON.stringify({ ok: false, error: String((error && error.message) || error) }))
            }
          },
```

</details>

#### 缺口

- 实际安装制品及上层路由保护未核验
  **影响**：可启动性和日志暴露范围影响采用
  **进一步探讨**：检查目标制品文件清单与目标宿主Connection路由契约，再隔离测试非授权Origin

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 目前何时采用，怎样证伪新的可靠投递设计？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前建议观察。Windows后台完成提醒需求明确，但依赖脚本制品、AUMID和实际呈现；Mac/Linux桌面用户不能按当前Electron检测期待可用。先核制品完整与路由权限，再在非敏感会话验证前台/后台、原因过滤、重连不重报与系统实际显示，未通过不作为唯一办结通知。

未验证假设是区分accepted、helper_ok、display_observed三层回执，并以session/turn生成幂等键，受限重试只针对明确未投递，OS选择使用能力探测。由当前成功日志早于HTTP、非Windows跳过和先推进observed推导，它可能降低静默丢失，但不能通过盲目重放保证不重复。最小验证网络断连、PowerShell缺失、脚本缺失、非Windows和重连五场景，分别统计实际toast/重复/误报成功；若增加重复而仍看不出丢失，就否定收益。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:270-278](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/client.js#L270-L278)

当前无回执重试。

```text
    function pushToast(payload) {
      try {
        fetch(NOTIFY_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {})
      } catch {
        /* the host route is a best-effort delivery channel */
```

**依据 2 · 源码核查**：[index.js:183-218](https://github.com/Adingo001/dsh-notification-desktop/blob/a1c9725b83b56de48f684a876f0ea997cfabaad1/index.js#L183-L218)

OS与helper结果分离。

<details>
<summary>查看原文（36行）</summary>

```text
function showToast(payload) {
  if (process.platform !== 'win32') {
    recordTrace({ kind: 'host-notify-skip', reason: 'not-windows' })
    return
  }
  const file = join(tmpdir(), `dsh-notification-toast-${process.pid}-${Date.now()}.json`)
  try {
    writeFileSync(
      file,
      JSON.stringify({ aumid: AUMID, title: String(payload.title ?? ''), body: String(payload.body ?? '') }),
      'utf8',
    )
  } catch (error) {
    recordTrace({ kind: 'host-notify-error', stage: 'write', message: String((error && error.message) || error) })
    return
  }
  try {
    const child = spawn(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', TOAST_SCRIPT, file],
      { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] },
    )
    // Capture the helper's output: a toast that silently fails is otherwise
    // indistinguishable from one that displayed.
    let output = ''
    const collect = chunk => {
      output += chunk
      if (output.length > 4000) output = output.slice(-4000)
    }
    child.stdout.on('data', collect)
    child.stderr.on('data', collect)
    child.on('error', error => {
      recordTrace({ kind: 'host-notify-error', stage: 'spawn', message: String((error && error.message) || error) })
    })
    child.on('close', code => {
      recordTrace({ kind: 'host-notify-result', code, output: output.trim() })
```

</details>

#### 缺口

- 端到端回执设计与真实显示未测
  **影响**：不能升级持续安装或投递保证
  **进一步探讨**：按五场景记录受理、helper、实际显示和重复数

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
