# DSH Remote

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[1d49c36](https://github.com/Blank-not-black/dsh-Remote/tree/1d49c36260f66aa511ba889834540582d2381174)

<!-- BEGIN META -->
[![GitHub ★ 73](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=73&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Blank-not-black/dsh-Remote)
<!-- END META -->

> **功能**：以网关和移动/桌面客户端远程续接DSH会话、审批与文件

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 添加移动操作、配对与弱网回执，不新增Agent执行内核。

> **主要限制**：[Q03](#research-q03) [Q03](#research-q03) 广文件根和子插件直连管理认证缺口需先处理。

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
  - [Q01 · 根系统和子插件各是什么？](#detail-section-11)
  - [Q02 · 远程动作怎样认证、代理并抗重复？](#detail-section-12)
  - [Q03 · 访问范围和集成链有哪些关键反证？](#detail-section-13)
  - [Q04 · 启动、费用、持续状态和退出怎样安排？](#detail-section-14)
  - [Q05 · 如何证伪远程续接的收益与可靠性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有DSH用户希望离开电脑后续接消息、批准和文件。

原DSH界面经可信隧道或通用反向代理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 远程会话与批准 | 原Host消息和allowed-once/rejected回答 | token代表广宿主访问，非多租户ACL |
| 文件与操作回执 | 根检查、传输、ID冲突和unknown恢复 | 默认根较广；无业务exactly-once |
| Web恢复与可选native加密 | generation拒旧帧、ticket及TLS pin参考链 | 平台差异独立验，不宣称全端加密 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 原DSH与可信上游 | 必需 | 执行会话/模型/工具 | Remote不替代宿主认证授权 |
| 独立网关Node/单文件程序 | 必需 | HTTP/WS、凭据与文件 | 默认LAN监听须收窄 |
| 私密token/设备配对与精简FS_ROOT | 必需 | 防止广文件和宿主控制外泄 | 先验证子插件管理直连门禁 |
| 浏览器或对应设备构建权限 | 按客户端 | Web/Android/Harmony接入 | CI源码不等真机与分发 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 隔离准备 | loopback、测试目录与无真实账号DSH | 核未认证管理访问应拒绝 |
| 续接 | 核会话/批准/文件hash和operations终态 | unknown查Host不盲重放 |
| 停止 | 停客户端及认证网关，插件写off并核监督器 | 撤token/cookie；Agent工具效果另停验 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 网关/客户端及测试Host资源未知 | 配对、文件根和认证核验耗时未知 | 实际准备费用/耗时未知 |
| 持续 | 长连接、文件磁盘、日志与原宿主模型工具用量未知 | 维护多协议与设备权限耗时未知 | 估算费用非供应商账单 |
| 恢复 | operations/文件块/缓存及残留监督器未知 | 核停止、撤凭据与查未知效果耗时未知 | 关闭网关不回滚Agent任务，恢复耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 远程接线 | 认证、批准转发和文件检查可查 | 跨平台正确率与使用效率未测 |
| 重复/未知结果 | ID+凭据范围回执及重启unknown | 业务exactly-once和远端取消未验 |
| 加密及访问 | native参考链校pin且legacy需同意 | 真机行为/Host外层管理鉴权仍未验 |

> **思考**：[Q03](#research-q03) [Q03](#research-q03) 广文件根和子插件直连管理认证缺口需先处理。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q01](#research-q01) 添加移动操作、配对与弱网回执，不新增Agent执行内核。

主链聚焦gateway认证/文件/回执与Web批准，native加密只核相关参考链，未运行目标。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) [Q03](#research-q03) 广文件根和子插件直连管理认证缺口需先处理。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) [Q04](#research-q04) 暂观察，隔离loopback核门禁与停止，不开放真实宿主。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的判断远程会话控制、文件与弱网回执怎样形成可核权限和退出边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、public/app.js、gateway.js、packages/plugin/index.mjs、relay/e2ee-channel.cjs、relay/e2ee-connect.cjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的判断远程会话控制、文件与弱网回执怎样形成可核权限和退出边界。未执行目标代码或实际宿主验证。
- 下一步：保留会话事件、请求id、文件hash、网络/进程记录，以反例否定采用

**分析版本**

- **仓库**：[Blank-not-black/dsh-Remote](https://github.com/Blank-not-black/dsh-Remote)
- **版本号**：0.8.4（[固定提交 1d49c36](https://github.com/Blank-not-black/dsh-Remote/tree/1d49c36260f66aa511ba889834540582d2381174)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) [Q05](#research-q05) 在权限和副作用不失真的条件下验证远程便利。

保留会话事件、请求id、文件hash、网络/进程记录，以反例否定采用

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 165 | 11701 | — | — | 275124 |
| .cjs | source | 23 | 11198 | 10280 | 539 | — |
| .js | source | 106 | 55070 | 52162 | 1381 | — |
| .ts | source | 2 | 12 | 10 | 4 | — |
| .mjs | source | 27 | 4273 | 3842 | 309 | — |
| .js | test | 161 | 23620 | 22154 | 667 | — |
| .cjs | example | 7 | 660 | 625 | 18 | — |
| .mjs | example | 4 | 142 | 141 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Blank-not-black/dsh-Remote/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断远程会话控制、文件与弱网回执怎样形成可核权限和退出边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根系统和子插件各是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根项目为client系统，包含独立gateway、移动/桌面Web、Android壳、HarmonyOS源码及可安装packages/plugin；manifest0.8.4而README版本段仍0.8.0-rc.9。用户从另一设备读会话、发消息、回答批准/问题、传文件，执行仍在原DSH，非移动端新Agent。相比直接暴露DSH或通用反向代理，增量是配对凭据、弱网状态/回执、文件根检查和移动操作界面；子插件只管宿主入口、管理网关和专有命令。不能把作者跨平台截图或release配置当本轮真机/公开分发验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-20](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/package.json#L1-L20)

根身份与0.8.4范围

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "dsh-remote",
  "version": "0.8.4",
  "androidVersionCode": 8029,
  "private": true,
  "dsh": {
    "bundle": {
      "patch": "./packages/plugin/cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-slots"
      ],
      "platform": "web"
    }
  },
  "description": "DSH 移动远程控制台: DSH 插件(内置网关自启停) + 独立网关 + Android App 一体",
  "updateNotes": "0.8.4：新增 Android 试验性端到端加密中转、独立设备配对与到期撤销，关闭加密需逐次确认，连接失败不自动降级；新增按需生成的审批中文摘要，确认后调用当前会话模型并提示 token 消耗，摘要仅供参考；新增主机插件一键更新，失败停止并保留恢复入口，Remote 最后更新；完善旧历史缓存迁移、界面资源更新检测和升级时配置保留；修复 Windows 并发读取导致插件任务元数据原子替换偶发 EPERM，只对元数据改名做有界重试；优化审批及长公告操作栏，复制 md/markdown 块内原文并提供块内轻量复制按钮。浏览器和鸿蒙暂不支持新配对加密入口，基础赞助档仍不包含文件传输。",
  "bin": "gateway.js",
```

</details>

**依据 2 · 作者声明**：[README.md:21-52](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/README.md#L21-L52)

作者系统与平台边界

<details>
<summary>查看原文（32行）</summary>

```text

[Documentation](docs/README.md) · [Installation](docs/getting-started.md) · [Troubleshooting](docs/troubleshooting.md) · [Downloads](https://github.com/Blank-not-black/dsh-Remote/releases/latest) · [Issues](https://github.com/Blank-not-black/dsh-Remote/issues)

For task-based instructions and AI-assisted diagnosis, use the [operation and troubleshooting knowledge base (Chinese)](docs/wiki/README.md) or the [AI reading index](llms.txt). The plugin includes the same knowledge base as offline Doctor references.

The detailed guides are currently in Chinese. This page and the plugin README provide an English overview and installation path.

The current source is **0.8.0-rc.9** (2026-10-22), a candidate for validation before the stable release. See the [rc.9 notes](docs/rc-0.8.0-rc.9.md) for scope and evidence; a local candidate does not establish npm or GitHub release availability.

## Capabilities

| Area | Features |
| --- | --- |
| Sessions | History and realtime messages, model/reasoning selection, approvals, questions, goals, queues, subagents and turn branches |
| Learning and diagnosis | Eight-step mobile guide, read-only AI diagnosis, local operation logs and feedback |
| Files and images | Host browsing, previews, downloads, resumable chunks and image attachments |
| Host status | Gateway/DSH status, mux/host channels, devices, tokens and cost estimates |
| Plugins | Installed/discovered plugins, details, configuration toggles and operation records |
| Session insights | Optional dsh-context summaries and dsh-cost-meter costs/quotas |
| Weak networks and recovery | Independent long polling, WS backoff, local history, gzip/ETag and bounded crash recovery |
| Connections and themes | Multiple pairing addresses, groups, LAN/Tailscale and six Web themes; Blue Fat Fish is the default |

Mobile navigation is **Sessions, Files, More**. The session home shows workspaces, recent sessions and items needing attention. More groups host connections, plugins, receipts and preferences. Desktop uses the same three entry points with a wider conversation layout. See [platform differences](docs/usage.md).

The [mobile guide](docs/onboarding-guided-practice.md) teaches connection, chat, files, branches, diagnosis and feedback. Finishing or skipping the entire guide removes its home invitation; reopen it at **More → Preferences and maintenance → Getting started**. Blue Fat Fish applies when no valid theme is saved; existing selections are preserved.

Image understanding depends on DSH and the model. Cost estimates do not replace provider bills. Insights require the corresponding host plugins and display unavailable states when data is missing. DSH UI renders a [safe read-only subset](docs/dsh-ui-support.md).

## Quick start: DSH Web plugin

Confirm that DSH Web works, then run as the same user:

```

</details>

**依据 3 · 源码核查**：[public/app.js:4419-4437](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/public/app.js#L4419-L4437)

实际批准交互与结果

<details>
<summary>查看原文（19行）</summary>

```text
async function approveApproval(id, allow) {
  const connection = captureConnection()
  const a = state.approvals.find(x => x.approvalId === id)
  if (!a) return
  let ok
  try {
    ok = await respond(a.rpcId, { sessionId: a.sessionId, approvalId: a.approvalId, outcome: allow ? 'allowed-once' : 'rejected' })
  } catch (e) {
    if (!connection.valid()) return
    if (e.message === 'AUTH') authFailure()
    else toast(t('pending.submitFailed', { msg: e.message || t('fs.networkError') }), 'err')
    return
  }
  if (!connection.valid()) return
  toast(ok ? (allow ? t('pending.allowed') : t('pending.rejected')) : t('pending.stale'), ok ? 'ok' : 'err')
  if (ok) clearPendingNotification({ type: 'approval/resolved', approvalId: a.approvalId })
  state.approvals = state.approvals.filter(x => x.rpcId !== a.rpcId)
  renderPending()
}
```

</details>

#### 缺口

- Android/Harmony真机、发行附件与远程体验未运行核实
  **影响**：不能承诺各平台同能力或下载可用，移动批准任务仍需真实宿主验证
  **进一步探讨**：先选Web+隔离网关验证同任务，再分平台独立验收

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 远程动作怎样认证、代理并抗重复？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

gateway生成/读取master token，设备key开启后普通authorized只认设备token，admin另认master；WS ticket随机24字节、限TTL且4次使用，升级先鉴权。客户端POST取ticket且用connection/generation拒旧结果；双stream各自generation/retry，旧WS不能更新新连接。HTTP代理剥来客Cookie/Auth再使用网关上游Cookie，/remote命令注入master。批准通过rpcId匹配modern pending event，转$events/result，accepted后才解pending；用户端仅allowed-once/rejected，不发全局授权。durable operations按upstream+凭据+id散列隔离，相同payload复用、不同payload409，重启running变unknown，网络/非确定响应也unknown，保存回执失败不回成功；不是把超时当未执行。

#### 证据与依据

**依据 1 · 源码核查**：[gateway.js:2155-2210](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/gateway.js#L2155-L2210)

token/device/ticket认证

<details>
<summary>查看原文（56行）</summary>

```text
function tokenOf(req, url) {
  const auth = req.headers.authorization || ''
  const m = /^Bearer\s+(.+)$/i.exec(auth)
  if (m) return m[1]
  return url.searchParams.get('token')
}

function authorized(req, url, options = {}) {
  const presented = tokenOf(req, url)
  if (!deviceKeyState.enabled && safeTokenEqual(presented, TOKEN)) {
    req.dshRemoteAuth = { type: 'shared', id: 'shared' }
    return true
  }
  if (deviceKeyState.enabled) {
    const record = findDeviceKeyByToken(presented)
    if (record) {
      req.dshRemoteAuth = { type: 'device', id: record.id }
      rememberDeviceKeyUse(record, req)
      return true
    }
  }
  if (options.consumeTicket) {
    const ticket = url.searchParams.get('ticket')
    const record = ticket && wsTickets.get(ticket)
    if (record && record.expiresAt > Date.now()) {
      req.dshRemoteAuth = record.auth || { type: 'shared', id: 'shared' }
      record.uses--
      if (record.uses <= 0) wsTickets.delete(ticket)
      return true
    }
    if (ticket) wsTickets.delete(ticket)
  }
  return false
}

function adminAuthorized(req, url) {
  const ok = safeTokenEqual(tokenOf(req, url), TOKEN)
  if (ok) req.dshRemoteAuth = { type: 'admin', id: 'admin' }
  return ok
}

function controlAuthorized(req, url) {
  return adminAuthorized(req, url) || authorized(req, url)
}

function issueWsTicket(auth) {
  const now = Date.now()
  for (const [ticket, record] of wsTickets) {
    if (record.expiresAt <= now) wsTickets.delete(ticket)
  }
  const ticket = crypto.randomBytes(24).toString('base64url')
  wsTickets.set(ticket, { expiresAt: now + WS_TICKET_TTL_MS, uses: 4, auth: auth || { type: 'shared', id: 'shared' } })
  return { ticket, expiresAt: now + WS_TICKET_TTL_MS }
}

// ---------- 设备监控 ----------
```

</details>

**依据 2 · 源码核查**：[public/app.js:500-533](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/public/app.js#L500-L533)

ticket连接身份与过期结果

<details>
<summary>查看原文（34行）</summary>

```text
async function getWsTicket() {
  // Share only an in-flight request. A completed ticket may be exhausted or
  // belong to the gateway instance that just exited.
  if (wsTicketPromise && wsTicketConnection?.valid()) return wsTicketPromise
  const connection = captureConnection()
  const token = state.token
  const server = state.server
  const job = (async () => {
    if (activeGatewayCapability('wsTicket') === false) throw Object.assign(new Error('ws ticket unsupported'), { unsupported: true })
    const read = async signal => {
      const res = await fetch(apiUrl('/api/ws-ticket'), {
        method: 'POST',
        signal,
        headers: {
          authorization: 'Bearer ' + token,
          'x-dsh-remote-client': CAP?.isNativePlatform?.() ? 'app' : 'web',
          ...clientIdHeaders(),
        }
      })
      if (!res.ok) throw Object.assign(new Error('ws ticket HTTP ' + res.status), { unsupported: [404, 405, 501].includes(res.status) })
      return res.json()
    }
    const data = await (globalThis.DshNetwork?.readWithDeadline
      ? globalThis.DshNetwork.readWithDeadline(read,8000)
      : read(AbortSignal.timeout(8000)))
    if (!connection.valid()) throw new Error('stale ws ticket')
    if (!data?.ticket || !Number(data.expiresAt)) throw new Error('invalid ws ticket')
    state.wsTicket = { token, server, value: data.ticket, expiresAt: Number(data.expiresAt) }
    return data.ticket
  })()
  wsTicketPromise = job
  wsTicketConnection = connection
  try { return await job } finally { if (wsTicketPromise === job) { wsTicketPromise = null; wsTicketConnection = null } }
}
```

</details>

**依据 3 · 源码核查**：[public/app.js:1264-1295](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/public/app.js#L1264-L1295)

stream代际退出

<details>
<summary>查看原文（32行）</summary>

```text
function streamIsCurrent(kind, ws, generation) {
  return streams[kind] === ws && streamMeta[kind].generation === generation
}

function aggregateStreamFailures() {
  state.errCount = Math.max(streamMeta.mux.failures, streamMeta.host.failures)
}

function markStreamInfo(kind, patch) {
  state.streamInfo[kind] = { ...state.streamInfo[kind], ...patch }
}

function allStreamsOpen() {
  return streams.mux?.readyState === WebSocket.OPEN && streams.host?.readyState === WebSocket.OPEN
}

function clearStreamRetry(kind) {
  const meta = streamMeta[kind]
  if (meta.retryTimer) clearTimeout(meta.retryTimer)
  meta.retryTimer = null
}

function closeStream(kind) {
  const meta = streamMeta[kind]
  clearStreamRetry(kind)
  meta.generation++
  const ws = streams[kind]
  streams[kind] = null
  state.streamsOk[kind] = false
  try { ws?.close() } catch {}
}

```

</details>

**依据 4 · 源码核查**：[gateway.js:7230-7250](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/gateway.js#L7230-L7250)

剥离来客凭据与上游身份

<details>
<summary>查看原文（21行）</summary>

```text
  const headers = {}
  const connectionHeaders = String(req.headers.connection || '').toLowerCase().split(',').map(value => value.trim())
  for (const [k, v] of Object.entries(req.headers)) {
    if (v === undefined) continue
    const key = k.toLowerCase()
    if (['host', 'authorization', 'cookie', 'connection', 'keep-alive', 'transfer-encoding', 'upgrade',
      'proxy-connection', 'te', 'trailer', 'proxy-authenticate', 'proxy-authorization', 'accept-encoding', 'origin', 'referer',
      'sec-fetch-site', 'sec-fetch-mode', 'sec-fetch-dest', 'sec-fetch-user',
      'x-dsh-remote-client'].includes(key)) continue
    if (!connectionHeaders.includes(key)) headers[k] = v
  }
  headers.host = UPSTREAM.host
  Object.assign(headers, dshUpstreamHeaders())
  // /remote/* 由 DSH 插件端点处理；插件侧用网关自身 token 鉴权。
  if (url.pathname.startsWith('/remote/')) headers.authorization = 'Bearer ' + TOKEN

  let responseDone = false
  const upstreamReq = UPSTREAM_TRANSPORT.request({
    hostname: UPSTREAM_HOSTNAME,
    port: UPSTREAM_PORT,
    method: req.method,
```

</details>

**依据 5 · 源码核查**：[gateway.js:7174-7200](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/gateway.js#L7174-L7200)

批准实际转发和accepted

<details>
<summary>查看原文（27行）</summary>

```text
  let raw = ''
  try {
    raw = await readApiRequest(req)
    const body = JSON.parse(raw || '{}')
    cors(res)
    if (url.pathname === '/api/respond') {
      const eventId = body.rpcId
      const pending = modernState.pendingEvents.get(eventId)
      if (!pending || !modernState.eventClientId) {
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end(JSON.stringify({ accepted: false }))
        return true
      }
      const value = body.result?.value
      const answer = pending.event === 'approval/request' ? value?.outcome : value?.answer
      pending.outcome = answer
      const response = await callUpstreamRemote('$events/result', {
        clientId: modernState.eventClientId,
        eventId,
        outcome: { kind: 'result', value: answer },
      })
      const accepted = response.status === 200 && response.body?.result?.ok === true
      if (accepted) resolveModernPendingEvent(eventId, false)
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
      res.end(JSON.stringify({ accepted }))
      return true
    }
```

</details>

**依据 6 · 源码核查**：[gateway.js:7086-7118](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/gateway.js#L7086-L7118)

操作范围及冲突

<details>
<summary>查看原文（33行）</summary>

```text
  const reply = (status, value) => sendHttpBody(res, status, {
    'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store'
  }, JSON.stringify(value), true)
  if (req.method === 'OPTIONS') return reply(204, {})
  if (!['GET', 'POST'].includes(req.method)) return reply(405, { error: 'method-not-allowed' })
  if (!controlAuthorized(req, url)) return reply(401, { error: 'unauthorized' })
  touchDevice(req)
  const id = String(url.searchParams.get('id') || '')
  if (!/^[A-Za-z0-9_-]{16,80}$/.test(id)) return reply(400, { error: 'bad-operation-id' })
  // Credentials and upstream participate in the scope. An address alias is not
  // automatically trusted as the same logical host, and device keys cannot read
  // the shared token's operation results.
  const key = operationHash(UPSTREAM.origin + '\0' + String(tokenOf(req, url) || '') + '\0' + id)
  let old = loadOperation(key)
  if (req.method === 'GET') return old ? reply(200, operationSnapshot(old)) : reply(404, { error: 'operation-not-found' })
  let body
  try { body = JSON.parse(await readApiRequest(req)) } catch (error) { return reply(error.status === 413 ? 413 : 400, { error: error.status === 413 ? 'body-too-large' : 'bad-operation' }) }
  if (!OPERATION_METHODS.has(body?.method) || !body.payload || typeof body.payload !== 'object' || Array.isArray(body.payload)) {
    return reply(400, { error: 'unsupported-operation' })
  }
  const fingerprint = operationHash(operationJson({ method: body.method, payload: body.payload }))
  old = loadOperation(key) // The request body yielded; another POST may have won.
  if (old) {
    if (old.fingerprint !== fingerprint) return reply(409, { error: 'operation-conflict' })
    return reply(old.phase === 'running' ? 202 : 200, operationSnapshot(old))
  }
  // Bounded receipts. Never evict an uncertain intent merely to allow replay.
  try {
    fs.mkdirSync(OPERATION_DIR, { recursive: true, mode: 0o700 })
    for (const name of fs.readdirSync(OPERATION_DIR)) {
      if (!/^[a-f0-9]{64}\.json$/.test(name)) continue
      const target = path.join(OPERATION_DIR, name)
      if (Date.now() - fs.statSync(target).mtimeMs > OPERATION_TTL) {
```

</details>

**依据 7 · 源码核查**：[gateway.js:7060-7082](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/gateway.js#L7060-L7082)

未知结果与落盘失败

<details>
<summary>查看原文（23行）</summary>

```text
        try { body = JSON.parse(legacy.raw) } catch { throw Object.assign(new Error('upstream-uncertain'), { httpStatus: legacy.status, receiptCategory: 'invalid-response' }) }
      }
    }
    stage = 'response-validation'
    if (typeof body?.result?.ok !== 'boolean' || Buffer.byteLength(JSON.stringify(body)) > 256 * 1024) throw Object.assign(new Error('upstream-uncertain'), { receiptCategory: 'invalid-response', httpStatus: responseStatus })
    job.result = operationResult(body)
    job.phase = body.result.ok === true ? 'complete' : 'rejected'
  } catch (error) {
    job.phase = 'unknown'
    job.error = 'result-unconfirmed'
    job.diagnostic = operationFailureFacts(error, stage, job.createdAt)
  }
  job.completedAt = Date.now()
  if (job.diagnostic) {
    const facts = { method: job.method, phase: job.phase, ...job.diagnostic }
    recordCompatibility('operation-result', facts)
    console.warn('[operation]', JSON.stringify(facts))
  }
  try { saveOperation(key, job) } catch {
    // The durable intent remains running and becomes unknown after restart.
    // Do not return a success that could not be durably recorded.
    job.phase = 'unknown'; delete job.result; job.error = 'receipt-save-failed'
  }
```

</details>

#### 缺口

- 真实弱网、重复提交和宿主幂等未运行
  **影响**：receipt只防该操作范围内重复，不证明业务exactly-once或授权对象正确
  **进一步探讨**：相同id/异payload/断网后成功/重启unknown分别注入，外部查会话与效果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 访问范围和集成链有哪些关键反证？

**研究主题**：缺陷与关键质疑

#### 完整回答

持token获得广泛宿主操作，不是租户/会话ACL隔离。文件默认家目录，Windows还加C以外可用盘；FS_ROOT显式限制之外POSIX可加入DSH登记工作区，列表失败保留上次cache，故撤workspace不立即保证撤权。路径resolve和realpath及protectedPath阻穿越，但仍用宿主用户权限，不能等同只读沙箱。CORS只响应允许Origin不是认证。集成插件的直连/remote/admin/api/state返回master token却无该分支authorizeIndex，只有browser-launch有明确调用，插件prefix也无统一门禁；若Host外层未保护会绕过网关admin鉴权，源码缺局部门禁已确认，可利用性未运行。可选native加密中转用本地可信配对证书和TLS1.3 pin，无TOFU/缓存session；reference connect legacy需acknowledgeDisclosure，但不能扩称浏览器/Harmony均端到端加密。

#### 证据与依据

**依据 1 · 源码核查**：[gateway.js:1706-1735](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/gateway.js#L1706-L1735)

默认文件根

<details>
<summary>查看原文（30行）</summary>

```text
// 允许访问的根目录: DSH_REMOTE_FS_ROOT 使用系统路径分隔符分隔多个根,
// POSIX 为 ':'、Windows 为 ';'；Windows 默认用户目录及 C 盘以外的可用盘符。
// 所有 /fs/* 路径 resolve 后都必须位于某个根内, 已存在的路径还会用 realpath
// 复核一次, 防止 ../ 穿越与符号链接逃逸。
const FS_DEFAULT_ROOT = path.resolve(os.homedir())
function fsConfiguredRoot(value) {
  const raw = String(value || '').trim()
  if (!raw || raw === '~') return raw === '~' ? FS_DEFAULT_ROOT : ''
  if (/^~[\\/]/.test(raw)) return path.resolve(FS_DEFAULT_ROOT, raw.slice(2))
  return path.resolve(raw)
}
function fsDefaultRoots(platform, home, isDirectory) {
  const roots = [home]
  if (platform === 'win32') {
    for (const letter of 'ABDEFGHIJKLMNOPQRSTUVWXYZ') {
      const root = `${letter}:\\`
      try { if (isDirectory(root)) roots.push(root) } catch {}
    }
  }
  return roots
}
const FS_ROOTS = process.env.DSH_REMOTE_FS_ROOT
  ? process.env.DSH_REMOTE_FS_ROOT.split(path.delimiter).map(fsConfiguredRoot).filter(Boolean)
  : fsDefaultRoots(process.platform, FS_DEFAULT_ROOT, root => fs.statSync(root).isDirectory())
const FS_WINDOWS_DEFAULT = process.platform === 'win32' && !process.env.DSH_REMOTE_FS_ROOT
const FS_WORKSPACE_CACHE_MS = durationEnv('DSH_REMOTE_FS_WORKSPACE_CACHE_MS', 15_000, 1000, 10 * 60_000)
const FS_MAX_UPLOAD = Number(process.env.DSH_REMOTE_FS_MAX_UPLOAD) || 2 * 1024 * 1024 * 1024
const FS_UPLOAD_TTL_MS = durationEnv('DSH_REMOTE_FS_UPLOAD_TTL_MS', 24 * 60 * 60 * 1000, 60_000, 7 * 24 * 60 * 60 * 1000)
let FS_ROOT_REALS = null
let fsWorkspaceRootsCache = { roots: [], reals: [], fetchedAt: 0 }
```

</details>

**依据 2 · 源码核查**：[gateway.js:5736-5814](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/gateway.js#L5736-L5814)

workspace缓存与路径检查

<details>
<summary>查看原文（79行）</summary>

```text

async function loadFsWorkspaceRoots(force = false) {
  const now = Date.now()
  if (!force && now - fsWorkspaceRootsCache.fetchedAt < FS_WORKSPACE_CACHE_MS) return fsWorkspaceRootsCache
  if (fsWorkspaceRootsFetch) return fsWorkspaceRootsFetch
  fsWorkspaceRootsFetch = (async () => {
    try {
      let value
      if (await detectUpstreamApiFlavor() === 'modern') {
        value = modernState.workspaces
        // The slash protocol receives workspace state over a stream. Immediately
        // after a protocol switch that baseline may not have arrived yet; retain
        // a working dotted workspace.list implementation when this particular
        // DSH release still exposes it instead of denying an otherwise valid root.
        if (!Array.isArray(value?.items) || !value.items.length) {
          try {
            const legacy = await forwardLegacyRpc(new URL('/api/workspace.list', UPSTREAM), JSON.stringify({
              type: 'client-request', rpcId: crypto.randomUUID(), method: 'workspace.list', payload: {},
            }))
            const body = JSON.parse(legacy.raw || '{}')
            if (legacy.status === 200 && body?.result?.ok) value = body.result.value
          } catch {}
        }
      } else {
        const target = new URL('/api/workspace.list', UPSTREAM)
        const res = await fetch(target, {
          method: 'POST',
          headers: dshUpstreamHeaders({ 'content-type': 'application/json' }),
          body: JSON.stringify({ type: 'client-request', rpcId: crypto.randomUUID(), method: 'workspace.list', payload: {} }),
          signal: AbortSignal.timeout(Math.min(8000, UPSTREAM_REQUEST_TIMEOUT_MS)),
        })
        if (!res.ok) throw new Error(`workspace.list HTTP ${res.status}`)
        const body = await res.json()
        value = body?.result?.ok ? body.result.value : null
      }
      const items = Array.isArray(value?.items) ? value.items : []
      const roots = [...new Set(items.map(fsWorkspacePath).filter(Boolean))]
      const reals = roots.map(root => { try { return (fs.realpathSync.native || fs.realpathSync)(root) } catch { return null } }).filter(Boolean)
      fsWorkspaceRootsCache = { roots, reals, fetchedAt: Date.now() }
    } catch {
      // DSH 重启期间保留上次成功的工作区根；缓存为空时仍仅允许显式 FS_ROOTS。
      fsWorkspaceRootsCache = { ...fsWorkspaceRootsCache, fetchedAt: Date.now() }
    } finally {
      fsWorkspaceRootsFetch = null
    }
    return fsWorkspaceRootsCache
  })()
  return fsWorkspaceRootsFetch
}

/** 把用户给的 path 解析为绝对路径，并仅允许显式根或 DSH 已登记工作区。 */
async function fsResolve(input) {
  const raw = String(input ?? '').trim()
  let abs
  if (!raw || raw === '~') abs = FS_ROOTS[0]
  else if (/^~[\\/]/.test(raw)) abs = path.resolve(FS_DEFAULT_ROOT, raw.slice(2))
  else if (path.isAbsolute(raw)) abs = path.resolve(raw)
  else abs = path.resolve(FS_ROOTS[0], raw) // 相对路径按默认根解析
  if (fsProtectedPath(abs)) return { error: 'forbidden' }
  if (FS_ROOTS.some(root => fsInsideRoot(abs, root))) return { abs }
  if (FS_WINDOWS_DEFAULT) return { error: 'forbidden' }
  let workspaces = await loadFsWorkspaceRoots(false)
  if (workspaces.roots.some(root => fsInsideRoot(abs, root))) return { abs }
  // 新建/刚加入的工作区可能还没进入 15s 缓存，未命中时强制刷新一次。
  workspaces = await loadFsWorkspaceRoots(true)
  if (workspaces.roots.some(root => fsInsideRoot(abs, root))) return { abs }
  return { error: 'forbidden' }
}

/** realpath 复核: 符号链接目标也必须落在允许根内。 */
function fsRealChecked(abs) {
  let real
  try {
    real = (fs.realpathSync.native || fs.realpathSync)(abs)
  } catch (err) {
    return { error: err.code === 'ENOENT' ? 'not-found' : 'permission-denied' }
  }
  if (!fsInsideReal(real)) return { error: 'forbidden' }
  if (fsProtectedPath(real)) return { error: 'forbidden' }
```

</details>

**依据 3 · 源码核查**：[packages/plugin/index.mjs:1210-1227](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1210-L1227)

browser-launch明确prefix需鉴权

<details>
<summary>查看原文（18行）</summary>

```text
async function serveStatic(req, res, ctx) {
  const pathname = new URL(req.url ?? '/', 'http://x').pathname
  if (pathname === `${MOUNT}/admin/api/browser-launch`) {
    res.setHeader('cache-control', 'no-store')
    res.setHeader('referrer-policy', 'no-referrer')
    if (req.method !== 'POST') return sendJson(res, 405, { ok: false, code: 'method-not-allowed' })
    if (req.headers['x-dsh-remote-client'] !== 'entry') return sendJson(res, 403, { ok: false, code: 'explicit-entry-required' })
    if ([...new URL(req.url, 'http://x').searchParams].length) return sendJson(res, 400, { ok: false, code: 'invalid-query' })
    // Prefix routes are not automatically authenticated by DSH. Require its
    // signed browser cookie before minting a browser launch URL.
    if (typeof ctx.connection?.authorizeIndex !== 'function') return sendJson(res, 503, { ok: false, code: 'browser-auth-unavailable' })
    if (!ctx.connection.authorizeIndex(req, res)) return
    // Never accept a destination/Host header or expose a Remote gateway token.
    let url
    try { url = browserLaunchUrl(ctx) } catch (_) {}
    return sendJson(res, url ? 200 : 503, url ? { ok: true, url } : { ok: false, code: 'browser-auth-unavailable' })
  }
  if (pathname === `${MOUNT}/api/doctor/target` || pathname === `${MOUNT}/admin/api/doctor-target`) {
```

</details>

**依据 4 · 源码核查**：[packages/plugin/index.mjs:1359-1388](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1359-L1388)

直连state回master token

<details>
<summary>查看原文（30行）</summary>

```text

  // 管理控制台数据: 优先代理本地网关(设备监控/更新检查完整), 网关不可用回退插件状态
  if (pathname === `${MOUNT}/admin/api/state`) {
    void ensureGateway() // 自愈: 开关为 on 而网关没起来时, 后台拉起, 下个轮询即可见网关
    const health = await gatewayRunning() // 新网关可在健康探测时恢复缺失的令牌文件
    const localToken = gatewayToken()
    const proxied = await proxyGateway('/admin/api/state', 'GET', '')
    if (proxied?.status === 200 && proxied.json.ok === true) {
      // 主机端 DSH 面板本身已登录本机用户, 管理页无需令牌门禁;
      // 把真实网关令牌一并返回, 抽屉里直接显示并允许复制(供手机 App 使用)。
      sendJson(res, proxied.status, { ...proxied.json, token: localToken, mode: 'gateway', via: 'gateway', gatewayInstalled, gatewayRuntime: await gatewayRuntimeForStatus(proxied.json.gatewayRuntime ?? null, health) })
      return
    }
    if (health.running && proxied?.status >= 500) {
      sendJson(res, proxied.status, { ...proxied.json, gatewayRunning: true })
      return
    }
    sendJson(res, 200, {
      ok: true,
      mode: 'plugin',
      gatewayRunning: health.running,
      gatewayAuthError: health.running && (!localToken || proxied?.status === 401 || proxied?.status === 403) ? GATEWAY_AUTH_HINT : '',
      gatewayVersion: health.version || '',
      gatewayRuntime: await gatewayRuntimeForStatus(null, health),
      version,
      token: health.running ? '' : localToken || '',
      gatewayInstalled,
      platform: process.platform,
      hostname: hostname(),
      lanIPs: lanIPs(),
```

</details>

**依据 5 · 源码核查**：[relay/e2ee-channel.cjs:13-37](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/relay/e2ee-channel.cjs#L13-L37)

可信配对与pin校验

<details>
<summary>查看原文（25行）</summary>

```text

// Call ONLY with a certificate obtained directly from the owner's host through
// a trusted local pairing step. Fetching it from the relay defeats pinning.
function createPairing(certificate, hostname) {
  if (typeof certificate !== 'string' || certificate.length > 8192
      || (certificate.match(/-----BEGIN CERTIFICATE-----/g) || []).length !== 1
      || typeof hostname !== 'string' || !/^[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?$/i.test(hostname)) {
    throw fault('INVALID_E2EE_PAIRING')
  }
  let cert
  try { cert = new X509Certificate(certificate) } catch { throw fault('INVALID_E2EE_CERTIFICATE') }
  if (tls.checkServerIdentity(hostname, cert.toLegacyObject())) throw fault('E2EE_HOSTNAME_MISMATCH')
  return Object.freeze({ protocol: PROTOCOL, hostname, certificate: cert.toString(), fingerprint: fingerprint(cert.raw) })
}

function validatePairing(value) {
  if (!value || ![PROTOCOL,DEVICE_PROTOCOL].includes(value.protocol) || typeof value.fingerprint !== 'string'
      || !/^[a-f0-9]{64}$/.test(value.fingerprint)) throw fault('INVALID_E2EE_PAIRING')
  // Snapshot inputs before opening a connection. No trust-on-first-use or pin refresh.
  const pair = createPairing(value.certificate, value.hostname)
  if (!timingSafeEqual(Buffer.from(pair.fingerprint, 'hex'), Buffer.from(value.fingerprint, 'hex'))) {
    throw fault('E2EE_PIN_MISMATCH')
  }
  if(value.protocol===DEVICE_PROTOCOL){
    if(!/^[a-f0-9]{32}$/.test(value.deviceId||'')||!/^[A-Za-z0-9_-]{43}$/.test(value.deviceSecret||'')||!Number.isFinite(value.expiresAt)||value.expiresAt<=Date.now())throw fault('INVALID_E2EE_DEVICE_PAIRING')
```

</details>

**依据 6 · 源码核查**：[relay/e2ee-connect.cjs:8-38](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/relay/e2ee-connect.cjs#L8-L38)

加密连接与legacy显式同意

<details>
<summary>查看原文（31行）</summary>

```text
function connectRelay(pairing, { ca, timeoutMs = 10000, lookup, mode = 'encrypted', acknowledgeDisclosure = false } = {}) {
  return new Promise((resolve, reject) => {
    let url, pinned, routeToken
    try {
      pinned = validatePairing(pairing); routeToken = pairing.routeToken
      if (!['encrypted','legacy'].includes(mode) || mode === 'legacy' && acknowledgeDisclosure !== true) throw fault('RELAY_DISCLOSURE_ACK_REQUIRED')
      url = new URL(pairing.relayUrl)
      if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/relay/v1/e2ee' || url.search || url.hash
          || !/^[A-Za-z0-9_-]{43}$/.test(pairing.routeToken || '') || !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 30000) throw fault('INVALID_E2EE_PAIRING')
    } catch (error) { reject(error); return }
    if (mode === 'legacy') url.pathname = '/relay/v1/plain'
    const upgrade = mode === 'legacy' ? 'dsh-relay-plain-v1' : 'dsh-e2ee-v1'
    const request = https.request(url, { ca, lookup, agent: false, headers: {
      connection: 'Upgrade', upgrade, authorization: 'DSHRelay ' + routeToken,
    } })
    let finished = false
    const timer = setTimeout(() => request.destroy(fault('E2EE_RELAY_TIMEOUT', 408)), timeoutMs)
    request.once('error', error => { clearTimeout(timer); if (!finished) { finished = true; reject(error) } })
    request.once('response', response => {
      clearTimeout(timer); response.destroy(); request.destroy()
      if (!finished) { finished = true; reject(fault('E2EE_RELAY_REJECTED', response.statusCode)) }
    })
    request.once('upgrade', (response, socket, head) => {
      clearTimeout(timer)
      if (finished || String(response.headers.upgrade).toLowerCase() !== upgrade) {
        socket.destroy(); if (!finished) { finished = true; reject(fault('INVALID_E2EE_UPGRADE')) }; return
      }
      finished = true; socket.pause(); if (head.length) socket.unshift(head)
      if (mode === 'legacy') { socket.resume(); resolve(socket); return }
      connectPinned({ socket, pairing: pinned, timeoutMs }).then(resolve, reject)
    })
```

</details>

#### 缺口

- Host外层直连管理认证、系统文件竞态及真机加密端到端行为未测试
  **影响**：若可达管理route泄露token，文件/命令权限显著扩大；不能直接开放公网或宣称端到端安全
  **进一步探讨**：先隔离核无cookie管理返回401、缩FS_ROOT、禁广网络，独立真机抓包验加密失败不降级

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、费用、持续状态和退出怎样安排？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先确认原DSH正常，再用独立Node网关或子插件；默认0.0.0.0:8787与upstream127.0.0.1:3080，必须先loopback/可信私网、私密配对二维码和精简文件根。插件部署会默认自启独立systemd用户单元或detached supervise进程；卸载不自动停网关。Web可先测试，Android权限/后台和Harmony构建签名另验。首次有~/.dsh-remote token/upstream Cookie、设备记录/operations/文件上传与日志；持续网络、磁盘及原宿主模型/工具费用，成本估算非账单。退出停止客户端通知/重连并显式停网关、写插件off，核监督进程与监听端口，撤设备/master凭据、cookie和不需缓存/传输数据；已受理Agent命令、批准后工具或远端作业须另取消并确认，网关关闭不回滚这些效果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:56-79](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/README.md#L56-L79)

启动与可信网络边界

<details>
<summary>查看原文（24行）</summary>

````text
```

1. Fully restart DSH Web, hard-refresh with Ctrl+F5, and use the left navigation's More → 手机连接（DSH Remote） to open pairing in a browser. A first-use card explains where to find it; older hosts keep a bottom-left connection button.
2. Confirm the gateway is running and open `http://127.0.0.1:8787/health` on the host.
3. Generate a connection QR in the plugin wizard or admin console and scan it in More → Hosts and connections → Scan to connect. The APK download QR only installs the app.
4. For manual pairing, use `http://PC-LAN-IP:8787` and the token. A phone's localhost refers to the phone.

The example targets the `web` profile; use your actual profile name. DSH Desktop uses its own plugin manager and requires a complete exit/reopen. Installing into Web does not install into Desktop. For a published candidate, use its exact `@<version>`; check npm before relying on `@next` or `@latest`.

For standalone gateways, multiple addresses, pinned versions and Git-source installation, see the [installation guide](docs/getting-started.md). A standalone executable can run with `--supervise`; defaults are `0.0.0.0:8787` and upstream `http://127.0.0.1:3080`.

> Pairing QR codes contain credentials. Use a trusted LAN or Tailscale; keep tokens private and avoid directly exposing the gateway to the public Internet.

## Screenshots

Captured on 2026-10-22: **rc.9 mobile WebUI** with an isolated test host and sample data, showing the default fish skin and the updated More page. These are browser captures, not Android device captures. Older emulator, desktop and admin images remain in the [screenshot archive with provenance](docs/screenshots/README.md).

<table>
  <tr>
    <td align="center"><img src="docs/screenshots/mobile-home-0.8.0-rc.9-web.jpg" alt="rc.9 mobile WebUI home with isolated sample data" width="280"></td>
    <td align="center"><img src="docs/screenshots/mobile-more-0.8.0-rc.9-web.jpg" alt="rc.9 More page with Getting started in the preference list" width="280"></td>
  </tr>
</table>

````

</details>

**依据 2 · 源码核查**：[packages/plugin/index.mjs:873-889](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L873-L889)

进程独立user单元

<details>
<summary>查看原文（17行）</summary>

```text
      yield candidate
    }
  }
  for await (const candidate of runtimeCandidates()) {
    // 首选 systemd-run: 网关成为独立 user 单元, DSH 重启/升级不会连带杀掉它
    let sysd = false
    try {
      await runExit('systemctl', ['--user', 'reset-failed', 'dsh-remote-gateway'])
      sysd = (await runExit('systemd-run', [
        '--user', '--unit=dsh-remote-gateway', '--service-type=exec',
        ...gatewaySystemdEnvArgs(),
        '--setenv=PORT=' + port, '--setenv=HOST=' + host, '--setenv=DSH_UPSTREAM=' + upstream,
        '--', candidate.executable, script, '--supervise',
      ])) === 0
    } catch {}
    if (sysd) {
      try {
```

</details>

**依据 3 · 源码核查**：[packages/plugin/index.mjs:1016-1022](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1016-L1022)

stop写off

```text
async function stopGateway() {
  const health = await gatewayRunning()
  if (!await killGateway(health)) return { ok: false, running: health.running, error: health.running ? GATEWAY_AUTH_HINT : '网关未运行' }
  setGatewayEnabled(false)
  return { ok: true, running: false, bye: true }
}

```

**依据 4 · 源码核查**：[gateway.js:5580-5598](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/gateway.js#L5580-L5598)

网关认证退出

<details>
<summary>查看原文（19行）</summary>

```text
  if (sub === '/shutdown' && req.method === 'POST') {
    if (!adminAuthorized(req, url)) {
      authFailures++
      touchDevice(req, { failedAuth: true })
      res.writeHead(401, { 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: 'unauthorized' }))
      return
    }
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ ok: true, bye: true }))
    // 给响应留出发送时间, 然后退出; 由插件/系统按需再拉起
    setTimeout(() => {
      recordCrash('gateway','manual-stop')
      console.log('[shutdown] 收到管理端停止指令, 网关退出')
      process.exit(0)
    }, 150)
    return
  }
  if (sub === '/note' && req.method === 'POST') {
```

</details>

**依据 5 · 源码核查**：[gateway.js:6967-7000](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/gateway.js#L6967-L7000)

持久operations与未知重启

<details>
<summary>查看原文（34行）</summary>

```text
const OPERATION_METHODS = new Set(['session.fork', 'session.create', 'session.prompt', 'session.updateQueue',
  'session.selectModel', 'session.rename', 'session.cancel', 'workspace.create',
  'workspace.archiveSession', 'goal.edit', 'goal.pause', 'goal.resume', 'goal.complete', 'goal.clear'])
const OPERATION_DIR = path.join(path.dirname(TOKEN_FILE), 'operations')
const OPERATION_TTL = 24 * 60 * 60 * 1000
const operationJobs = new Map()
function operationHash(value) { return crypto.createHash('sha256').update(value).digest('hex') }
function operationJson(value) {
  if (Array.isArray(value)) return '[' + value.map(operationJson).join(',') + ']'
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + operationJson(value[k])).join(',') + '}'
  return JSON.stringify(value)
}
function saveOperation(key, job) {
  fs.mkdirSync(OPERATION_DIR, { recursive: true, mode: 0o700 })
  const target = path.join(OPERATION_DIR, key + '.json')
  fs.writeFileSync(target + '.tmp', JSON.stringify(job), { mode: 0o600 })
  fs.renameSync(target + '.tmp', target)
}
function loadOperation(key) {
  if (operationJobs.has(key)) {
    const job = operationJobs.get(key)
    if (Date.now() - job.createdAt <= OPERATION_TTL) return job
    operationJobs.delete(key)
  }
  try {
    const job = JSON.parse(fs.readFileSync(path.join(OPERATION_DIR, key + '.json'), 'utf8'))
    if (Date.now() - job.createdAt > OPERATION_TTL) return null
    if (job.phase === 'running') { job.phase = 'unknown'; job.error = 'gateway-restarted'; saveOperation(key, job) }
    operationJobs.set(key, job)
    return job
  } catch { return null }
}
function operationSnapshot(job) {
  return { id: job.id, method: job.method, phase: job.phase, createdAt: job.createdAt,
```

</details>

#### 缺口

- 本轮未部署、传文件、跑手机后台或停止监督器，费用和恢复耗时未知
  **影响**：不能以关浏览器/卸载认定止访问、止模型调用或删除残留
  **进一步探讨**：分阶段验loopback→可信私网；每阶段核PID/端口、文件与任务终态，不先碰真实资料

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何证伪远程续接的收益与可靠性？

**研究主题**：新假设与验证

#### 完整回答

相同DSH任务比较桌面原界面、可信隧道和Remote Web，独立核会话消息、一次批准、文件hash和总交互时间。注入过期ticket、换主机旧generation帧、同id异payload、断网后unknown、工作区撤销后cache以及未认证管理路径。再对Android/Harmony独立验后台通知、权限和加密，不混入Web通过率。若错主机批准/重复执行、文件越范围或无cookie可得master token，则停开放部署，回可信隧道和原DSH界面；当前不计入省时或安全收益。

#### 证据与依据

**依据 1 · 源码核查**：[public/app.js:1264-1295](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/public/app.js#L1264-L1295)

旧连接代际拒绝可测

<details>
<summary>查看原文（32行）</summary>

```text
function streamIsCurrent(kind, ws, generation) {
  return streams[kind] === ws && streamMeta[kind].generation === generation
}

function aggregateStreamFailures() {
  state.errCount = Math.max(streamMeta.mux.failures, streamMeta.host.failures)
}

function markStreamInfo(kind, patch) {
  state.streamInfo[kind] = { ...state.streamInfo[kind], ...patch }
}

function allStreamsOpen() {
  return streams.mux?.readyState === WebSocket.OPEN && streams.host?.readyState === WebSocket.OPEN
}

function clearStreamRetry(kind) {
  const meta = streamMeta[kind]
  if (meta.retryTimer) clearTimeout(meta.retryTimer)
  meta.retryTimer = null
}

function closeStream(kind) {
  const meta = streamMeta[kind]
  clearStreamRetry(kind)
  meta.generation++
  const ws = streams[kind]
  streams[kind] = null
  state.streamsOk[kind] = false
  try { ws?.close() } catch {}
}

```

</details>

**依据 2 · 源码核查**：[public/app.js:4419-4437](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/public/app.js#L4419-L4437)

批准回执可测

<details>
<summary>查看原文（19行）</summary>

```text
async function approveApproval(id, allow) {
  const connection = captureConnection()
  const a = state.approvals.find(x => x.approvalId === id)
  if (!a) return
  let ok
  try {
    ok = await respond(a.rpcId, { sessionId: a.sessionId, approvalId: a.approvalId, outcome: allow ? 'allowed-once' : 'rejected' })
  } catch (e) {
    if (!connection.valid()) return
    if (e.message === 'AUTH') authFailure()
    else toast(t('pending.submitFailed', { msg: e.message || t('fs.networkError') }), 'err')
    return
  }
  if (!connection.valid()) return
  toast(ok ? (allow ? t('pending.allowed') : t('pending.rejected')) : t('pending.stale'), ok ? 'ok' : 'err')
  if (ok) clearPendingNotification({ type: 'approval/resolved', approvalId: a.approvalId })
  state.approvals = state.approvals.filter(x => x.rpcId !== a.rpcId)
  renderPending()
}
```

</details>

**依据 3 · 源码核查**：[gateway.js:7086-7118](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/gateway.js#L7086-L7118)

操作冲突可测

<details>
<summary>查看原文（33行）</summary>

```text
  const reply = (status, value) => sendHttpBody(res, status, {
    'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store'
  }, JSON.stringify(value), true)
  if (req.method === 'OPTIONS') return reply(204, {})
  if (!['GET', 'POST'].includes(req.method)) return reply(405, { error: 'method-not-allowed' })
  if (!controlAuthorized(req, url)) return reply(401, { error: 'unauthorized' })
  touchDevice(req)
  const id = String(url.searchParams.get('id') || '')
  if (!/^[A-Za-z0-9_-]{16,80}$/.test(id)) return reply(400, { error: 'bad-operation-id' })
  // Credentials and upstream participate in the scope. An address alias is not
  // automatically trusted as the same logical host, and device keys cannot read
  // the shared token's operation results.
  const key = operationHash(UPSTREAM.origin + '\0' + String(tokenOf(req, url) || '') + '\0' + id)
  let old = loadOperation(key)
  if (req.method === 'GET') return old ? reply(200, operationSnapshot(old)) : reply(404, { error: 'operation-not-found' })
  let body
  try { body = JSON.parse(await readApiRequest(req)) } catch (error) { return reply(error.status === 413 ? 413 : 400, { error: error.status === 413 ? 'body-too-large' : 'bad-operation' }) }
  if (!OPERATION_METHODS.has(body?.method) || !body.payload || typeof body.payload !== 'object' || Array.isArray(body.payload)) {
    return reply(400, { error: 'unsupported-operation' })
  }
  const fingerprint = operationHash(operationJson({ method: body.method, payload: body.payload }))
  old = loadOperation(key) // The request body yielded; another POST may have won.
  if (old) {
    if (old.fingerprint !== fingerprint) return reply(409, { error: 'operation-conflict' })
    return reply(old.phase === 'running' ? 202 : 200, operationSnapshot(old))
  }
  // Bounded receipts. Never evict an uncertain intent merely to allow replay.
  try {
    fs.mkdirSync(OPERATION_DIR, { recursive: true, mode: 0o700 })
    for (const name of fs.readdirSync(OPERATION_DIR)) {
      if (!/^[a-f0-9]{64}\.json$/.test(name)) continue
      const target = path.join(OPERATION_DIR, name)
      if (Date.now() - fs.statSync(target).mtimeMs > OPERATION_TTL) {
```

</details>

**依据 4 · 源码核查**：[packages/plugin/index.mjs:1359-1388](https://github.com/Blank-not-black/dsh-Remote/blob/1d49c36260f66aa511ba889834540582d2381174/packages/plugin/index.mjs#L1359-L1388)

直连凭据暴露可测

<details>
<summary>查看原文（30行）</summary>

```text

  // 管理控制台数据: 优先代理本地网关(设备监控/更新检查完整), 网关不可用回退插件状态
  if (pathname === `${MOUNT}/admin/api/state`) {
    void ensureGateway() // 自愈: 开关为 on 而网关没起来时, 后台拉起, 下个轮询即可见网关
    const health = await gatewayRunning() // 新网关可在健康探测时恢复缺失的令牌文件
    const localToken = gatewayToken()
    const proxied = await proxyGateway('/admin/api/state', 'GET', '')
    if (proxied?.status === 200 && proxied.json.ok === true) {
      // 主机端 DSH 面板本身已登录本机用户, 管理页无需令牌门禁;
      // 把真实网关令牌一并返回, 抽屉里直接显示并允许复制(供手机 App 使用)。
      sendJson(res, proxied.status, { ...proxied.json, token: localToken, mode: 'gateway', via: 'gateway', gatewayInstalled, gatewayRuntime: await gatewayRuntimeForStatus(proxied.json.gatewayRuntime ?? null, health) })
      return
    }
    if (health.running && proxied?.status >= 500) {
      sendJson(res, proxied.status, { ...proxied.json, gatewayRunning: true })
      return
    }
    sendJson(res, 200, {
      ok: true,
      mode: 'plugin',
      gatewayRunning: health.running,
      gatewayAuthError: health.running && (!localToken || proxied?.status === 401 || proxied?.status === 403) ? GATEWAY_AUTH_HINT : '',
      gatewayVersion: health.version || '',
      gatewayRuntime: await gatewayRuntimeForStatus(null, health),
      version,
      token: health.running ? '' : localToken || '',
      gatewayInstalled,
      platform: process.platform,
      hostname: hostname(),
      lanIPs: lanIPs(),
```

</details>

#### 缺口

- 没有本轮对照/网络或设备验收
  **影响**：不能从实现完整度推可靠远程控制与净便利
  **进一步探讨**：保留会话事件、请求id、文件hash、网络/进程记录，以反例否定采用

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
