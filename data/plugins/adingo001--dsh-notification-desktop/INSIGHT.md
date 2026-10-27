# dsh-notification-desktop

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[33f5cbf](https://github.com/Adingo001/dsh-notification-desktop/tree/33f5cbf23e00219088fca630d83e876b61fd487a)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：适配DSH 0.2.x的任务完成通知，Windows桌面经Host发送WinRT提醒。

> **亮点**：基于上游通知投影做0.2.x会话与设置适配，并以Host PowerShell/WinRT处理Windows桌面通知，价值是减少完成轮询；不是新通知协议或任务验收机制。[Q01](#research-q01)

> **主要限制**：客户端投递即记录成功、非Windows Electron仍走会直接skip的Host路径；页面关闭停止判定，不能承诺可靠跨平台后台提醒。[Q03](#research-q03)

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
  - [Q01 · 移植包解决哪种任务交接问题，贡献属于谁？](#detail-section-11)
  - [Q02 · 事件如何形成通知，重连去重有什么取舍？](#detail-section-12)
  - [Q03 · 请求成功是否表示用户已看到通知，跨平台如何？](#detail-section-13)
  - [Q04 · 首次配置、持续运行和失败恢复承担哪些负担？](#detail-section-14)
  - [Q05 · 应给什么采用建议，如何检验可靠交接假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合Windows DSH长任务期间离开前台、需要完成或错误提醒的人；不覆盖等待审批，页面必须持续运行。[Q01](#research-q01)

简单基线为手工切回窗口查看任务状态；浏览器Notification是通道基线。没有同环境独立效果比较，不将作者平台报告外推全部版本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|完成提醒|减少轮询|页面存活，不覆盖待审批|
|WinRT投递|Windows桌面通知|Windows、AUMID；HTTP成功非可见回执|
|trace诊断|分析漏提醒|核对访问控制与日志保留|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|DSH 0.2.x投影/webServer|必需|完成边和投递路由|核对服务、人工轮询|
|Windows PowerShell/WinRT|桌面投递必需|系统toast|非Windows暂缓桌面路径|
|AUMID与协议handler|Windows显示/点击必需|系统身份、返回窗口|Remove回滚或重新注册|
|存活页面|必需|通知判断|关闭后不能依赖提醒|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|装包并核查本地访问控制|用户确认设置页|暂停外部暴露|
|注册AUMID和协议|用户确认可撤销|Remove回滚|
|测试真实任务和恢复|用户确认系统可见、重连不重复|读trace并恢复人工轮询|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|未知|
|---|---|---|---|
|首次|Windows/PowerShell运行环境|安装、AUMID与协议注册|兼容及配置耗时|
|持续|页面订阅、通知进程、临时文件|处理提醒与复核|实际漏报率和时间|
|失败恢复|重试toast、重跑路径注册|查trace、恢复设置、Remove回滚|日志保留与恢复工时|

#### 效果

|效果项|源码支持|未知|
|---|---|---|
|完成边判定|单调turn投影及原因过滤|漏报和重复率|
|Windows投递|WinRT脚本与结果trace|系统可见和用户感知|
|重连去重|水合与5秒宽限|真实完成被抑制的比例|

> **思考**：客户端投递即记录成功、非Windows Electron仍走会直接skip的Host路径；页面关闭停止判定，不能承诺可靠跨平台后台提醒。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：基于上游通知投影做0.2.x会话与设置适配，并以Host PowerShell/WinRT处理Windows桌面通知，价值是减少完成轮询；不是新通知协议或任务验收机制。[Q01](#research-q01)

投影折叠及重连水合基线可借鉴；记录投递成功的时机过早，平台回退与本地路由边界需先补验收。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

客户端投递即记录成功、非Windows Electron仍走会直接skip的Host路径；页面关闭停止判定，不能承诺可靠跨平台后台提醒。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察；Windows本地隔离环境先核对路由鉴权及注册表回滚，再检查真实可见与重连；非Windows桌面Host路径不适用。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有集成机制有源码支持；节时、保真与宿主兼容未执行验证；设计假设未验证。

- 已检查：作者 README、包清单、源码路径 index.js、client.js、scripts/toast.ps1 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码级检查事件折叠、客户端重连和投递、Host路由与WinRT脚本；未审计完整宿主鉴权和全部前台激活代码，未执行。
- 下一步：后续授权后用Windows/非Windows、睡眠重连、关页、权限拒绝和错误结束检查系统可见、点击返回、重复与漏报；同时核对路由和临时文件清理。

**分析版本**

- **仓库**：[Adingo001/dsh-notification-desktop](https://github.com/Adingo001/dsh-notification-desktop)
- **版本号**：0.3.2（[固定提交 33f5cbf](https://github.com/Adingo001/dsh-notification-desktop/tree/33f5cbf23e00219088fca630d83e876b61fd487a)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是分离观察、接收、系统发出和用户处理回执，并按平台能力选通道；对照睡眠重连、关页及权限拒绝，若漏交接不降则否定。[Q05](#research-q05)

后续授权后用Windows/非Windows、睡眠重连、关页、权限拒绝和错误结束检查系统可见、点击返回、重复与漏报；同时核对路由和临时文件清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1066 | 847 | 149 | — |
| .md | source | 1 | 148 | — | — | 2465 |
| .mjs | source | 1 | 86 | 68 | 11 | — |
| .mjs | test | 2 | 290 | 237 | 18 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/Adingo001/dsh-notification-desktop/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：任务完成能否可靠交接给离开前台的用户，平台与恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 移植包解决哪种任务交接问题，贡献属于谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对象是DSH长任务期间切换去做其他工作的用户，交付物是知道一轮已完成或失败并能回到应用，不是任务结果自动验收。作者明确源于omdsh-dev/dsh-notification，Host会话投影主要继承，0.2.x会话快照/retention接线、本地设置与Windows WinRT投递是适配增量。相对反复查看窗口，通知减少轮询；相对浏览器Notification，Windows桌面路径转给Host运行PowerShell WinRT。源码支持实现差异，但作者关于系统实际静默丢弃及修复成功是作者报告，本轮没有独立复现。等待审批/回答不在移植范围，不能作为完整“任务需要关注”监控。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-24](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/README.md#L3-L24)

作者解释上游与适配范围

<details>
<summary>查看原文（22行）</summary>

```text
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

Host 半边的投影契约（`key` / `stateSchema` / `init` / `apply` / `wire` / `stateVersion`）在 0.2.1-rc.2 里没变，所以 `index.js` 基本是原逻辑。
```

</details>

**依据 2 · 源码核查**：[index.js:183-218](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/index.js#L183-L218)

Host投递实现及平台条件

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

- 缺少同任务基线的端到端收益结果
  **影响**：无法确认收益、代价或假设优于简单替代
  **进一步探讨**：按本题提出的对照记录正确率、总时间、资源与人工复核，保留失败样本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 事件如何形成通知，重连去重有什么取舍？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host reduce处理turn/start初始化、assistant/message累积文本并截400字符、tool/call名称去重、turn/end形成最后投影。注意正文是本轮累计文本的有界前缀，不保证是最后一段回复，README描述因此应收窄。浏览器订阅sessions.list，以projectionValues.notification及单调turn识别新完成，用retainedBy.mainView识别可见会话。seed记录已水合状态并设置5秒宽限，防重连历史完成集中弹出；这减少重复提示的机制也可能跳过宽限期内真实完成，需要实验量化。状态主要在页面内，关页停止判定，不能把Host投影注册当常驻后台通知服务。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:135-166](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/index.js#L135-L166)

事件折叠与有界累计文本

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

**依据 2 · 源码核查**：[client.js:328-355](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/client.js#L328-L355)

seed、水合状态及宽限

<details>
<summary>查看原文（28行）</summary>

```text
      const observed = new Map()

      // A reconnect (sleep, unlock, WS reset) rebuilds the session list before
      // the projections hydrate. Baselining those rows at "turn 0" made every
      // session look freshly completed once its history arrived, which fired a
      // toast per session on every unlock. Entries therefore carry whether the
      // projection was present when they were recorded, and a seed opens a
      // short window in which nothing may fire at all.
      const GRACE_MS = 5000
      let graceUntil = 0

      const seed = () => {
        const state = list.getSnapshot()
        observed.clear()
        if (state === undefined || !Array.isArray(state.ids)) return
        for (const id of state.ids) {
          const row = state.byId?.[id]
          const projection = row?.projectionValues?.notification
          observed.set(id, {
            turn: turnOf(row),
            hydrated: projection !== undefined && projection !== null,
            // Rows present at seed time may carry history behind them; a row
            // that shows up later is a session this page watched from birth.
            fromSeed: true,
          })
        }
        graceUntil = Date.now() + GRACE_MS
        report({ kind: 'seed', phase: state.phase, ids: state.ids.length, baselines: [...observed.entries()] })
```

</details>

**依据 3 · 作者声明**：[README.md:127-131](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/README.md#L127-L131)

作者明示页面必须存活

```text
## 已知边界

- 不提醒「等你审批 / 等你回答」这类挂起交互（原因见上）。
- 页面必须在跑：判定发生在页面里，页面关了就没有；桌面端只是把"弹"这一步交给宿主。
- `turn/end` 的 `forked` / `interrupted` 也会推进投影的 `turn`（这样客户端去重不会漏轮），但默认只在 `completed` / `error` 上弹。
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 请求成功是否表示用户已看到通知，跨平台如何？

**研究主题**：缺陷与关键质疑

#### 完整回答

不表示。client.pushToast是fire-and-forget fetch，catch被忽略；deliver随后立即记录ok:true，没有检查HTTP状态或操作系统呈现。Host showToast只在win32执行，非Windows记录skip然后返回，但客户端以electron用户代理把全部桌面壳导向Host，因此macOS/Linux Electron的这条路径不会发送浏览器通知，也没有等价Host实现。这是代码直接显示的平台限制，未运行复现。Windows helper输出TOAST-OK只说明WinRT Show返回，仍不是用户看到或点击。故关键贡献的验收必须从turn结束直到系统可见通知、点击回到对应工作界面，不能以204或trace deliver统计成功率。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:262-278](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/client.js#L262-L278)

Electron判断和不校验fetch响应

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 2 · 源码核查**：[client.js:365-387](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/client.js#L365-L387)

Host路径即时记录成功

<details>
<summary>查看原文（23行）</summary>

```text
        const deliver = () => {
          if (isDesktopShell()) {
            // On the desktop shell Chromium's Windows presenter reports success
            // and Windows drops the toast, so the host shows it instead.
            pushToast({ title, body: text, tag, turn: projection.turn })
            report({ kind: 'deliver', ok: true, via: 'host', tag, title, turn: projection.turn })
            return
          }
          const result = show(api, title, text, tag, settings.requireInteraction)
          report({
            kind: 'deliver',
            ok: result.ok,
            via: 'notification',
            message: result.ok ? '' : result.message,
            tag,
            title,
            turn: projection.turn,
          })
          if (!result.ok) console.error(`[dsh-notification-desktop] notification failed: ${result.message}`)
        }
        if (isDesktopShell()) {
          deliver()
          return
```

</details>

**依据 3 · 源码核查**：[index.js:183-186](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/index.js#L183-L186)

非Windows直接跳过

```text
function showToast(payload) {
  if (process.platform !== 'win32') {
    recordTrace({ kind: 'host-notify-skip', reason: 'not-windows' })
    return
```

**依据 4 · 源码核查**：[scripts/toast.ps1:36-42](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/scripts/toast.ps1#L36-L42)

Show成功与操作系统可见性不同

```text
$notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($aumid)
try {
  $notifier.Show($toast)
  Write-Output 'TOAST-OK'
} catch {
  Write-Output ('TOAST-FAIL ' + $_.Exception.GetType().Name + ' :: ' + $_.Exception.Message)
  exit 1
```

#### 缺口

- 缺少Windows可见通知与非Windows Electron回退的实际结果
  **影响**：代码平台分支和投递即成功的设计判断不能表述为本轮故障复现或真实送达率
  **进一步探讨**：分别在Windows与非Windows桌面测试任务完成到系统可见/点击返回，模拟Host非2xx和权限拒绝并检查回退

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次配置、持续运行和失败恢复承担哪些负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Windows桌面需要DSH 0.2.x、sessionProjections、webServer、PowerShell/WinRT和AUMID注册；点击激活还需协议handler及可选C#编译器/脚本降级。用户必须保留页面运行并设置通知原因与后台过滤。设置在localStorage，迁移设备需重新配置；注册表脚本会写HKCU并固定checkout绝对路径，移动目录需重跑，卸载需显式Remove。持续处理会话快照并写trace临时文件，内存ring限制200不限制appendFileSync的日志增长；通知正文写临时JSON，本段未见清理，需检查保留策略与敏感内容。trace/notify采用webServer非/api路径并给* CORS，组件内无身份检查；是否可被外部访问取决宿主边界，未确认漏洞，但在安全边界未核清前不能对外暴露。首次/恢复人工时间与实际系统显示率未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:93-120](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/README.md#L93-L120)

注册表、激活与路径依赖

<details>
<summary>查看原文（28行）</summary>

````text
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\fix-toast-aumid.ps1
# 撤销：加 -Remove
```

它写两个键，都不碰壳、不碰 asar、不碰快捷方式：

- `HKCU\Software\Classes\AppUserModelId\<AUMID>`（DisplayName + IconUri）—— 让 Windows 认这个 AUMID。
- `HKCU\Software\Classes\dshnotify`（URL Protocol + handler）—— **点通知能把窗口拉回前台**。

### 点通知回到前台

toast 带 `activationType="protocol" launch="dshnotify:focus"`，点它时 Windows 跑上面注册的 handler，把 `DeepSeek Harness` 的主窗口提到前台。抢前台要绕开 Windows 的前台锁，所以是三级降级、每级都校验：

1. `AttachThreadInput` 借前台线程的输入队列 → `BringWindowToTop` → `SetForegroundWindow`
2. `SwitchToThisWindow`
3. `SW_MINIMIZE` → `SW_RESTORE`（还原的窗口会拿到激活权）→ 再 `SetForegroundWindow`

**handler 不能闪黑框。** 控制台程序（`powershell.exe`）在能隐藏自己之前就已经被加载器创建了控制台窗口，所以 `-WindowStyle Hidden` 也挡不住闪一下。因此：

- 有 C# 编译器时，`fix-toast-aumid.ps1` 把 `scripts/focus-dsh.cs` 编成 **`scripts/focus-dsh.exe`**（`/target:winexe` = GUI 子系统，压根没有控制台），协议直接指向它；
- 没有编译器时退到 **`wscript.exe`**（GUI 宿主）跑 `scripts/focus.ps1` 的隐藏 PowerShell —— 同样不闪。

两个产物都在 `.gitignore` 里（构建物不入库），换机器装的时候由注册脚本现编。

为什么不用 `activationType="foreground"`：那需要给 AUMID 注册一个 `ToastActivatorCLSID` COM 服务器（还要处理 `-ToastActivated` 命令行），而桌面壳不提供；协议激活只需要一个 HKCU 注册表项。

handler 里写的是**本 checkout 的绝对路径**，所以挪动插件目录后要重跑一次 `fix-toast-aumid.ps1`。
````

</details>

**依据 2 · 源码核查**：[index.js:60-67](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/index.js#L60-L67)

trace持续追加临时日志

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

**依据 3 · 源码核查**：[index.js:247-289](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/index.js#L247-L289)

诊断路由与CORS

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

**依据 4 · 源码核查**：[index.js:299-329](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/index.js#L299-L329)

通知路由处理

<details>
<summary>查看原文（31行）</summary>

```text
    host.effect(
      () =>
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
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 应给什么采用建议，如何检验可靠交接假设？

**研究主题**：采用判断、新假设与验证

#### 完整回答

本项建议观察，Windows有明确需求者仅在核对本地路由访问控制及注册表回滚后隔离试用；其他桌面平台当前Host路径不适用。未验证假设是把“完成边被观察”“投递已接收”“系统已发出”“用户已处理”分开持久化，并以平台能力而非electron UA选通道，可降低伪成功及漏交接。额外负担是持久去重、回执和跨平台接口。最小对照用Windows与非Windows桌面、断网/睡眠恢复、页面关闭、权限拒绝和5秒窗口内完成，记录重复/漏报、可见率、点击返回与人工轮询。若仅提高日志复杂度而不减少漏交接，则否定；新假设不计为现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:365-387](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/client.js#L365-L387)

即时成功记录构成回执假设依据

<details>
<summary>查看原文（23行）</summary>

```text
        const deliver = () => {
          if (isDesktopShell()) {
            // On the desktop shell Chromium's Windows presenter reports success
            // and Windows drops the toast, so the host shows it instead.
            pushToast({ title, body: text, tag, turn: projection.turn })
            report({ kind: 'deliver', ok: true, via: 'host', tag, title, turn: projection.turn })
            return
          }
          const result = show(api, title, text, tag, settings.requireInteraction)
          report({
            kind: 'deliver',
            ok: result.ok,
            via: 'notification',
            message: result.ok ? '' : result.message,
            tag,
            title,
            turn: projection.turn,
          })
          if (!result.ok) console.error(`[dsh-notification-desktop] notification failed: ${result.message}`)
        }
        if (isDesktopShell()) {
          deliver()
          return
```

</details>

**依据 2 · 源码核查**：[index.js:183-218](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/index.js#L183-L218)

平台及子进程结果边界

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

**依据 3 · 作者声明**：[README.md:127-131](https://github.com/Adingo001/dsh-notification-desktop/blob/33f5cbf23e00219088fca630d83e876b61fd487a/README.md#L127-L131)

页面生存边界

```text
## 已知边界

- 不提醒「等你审批 / 等你回答」这类挂起交互（原因见上）。
- 页面必须在跑：判定发生在页面里，页面关了就没有；桌面端只是把"弹"这一步交给宿主。
- `turn/end` 的 `forked` / `interrupted` 也会推进投影的 `turn`（这样客户端去重不会漏轮），但默认只在 `completed` / `error` 上弹。
```

#### 缺口

- 未来设计假设的对照实验尚无结果
  **影响**：无法确认收益、代价或假设优于简单替代
  **进一步探讨**：按本题提出的对照记录正确率、总时间、资源与人工复核，保留失败样本

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
