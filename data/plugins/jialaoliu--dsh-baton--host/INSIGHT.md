# dsh-baton-host

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[58e0c89](https://github.com/JialaoLiu/dsh-baton/tree/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host)

<!-- BEGIN META -->
[![GitHub ★ 176](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=176&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/JialaoLiu/dsh-baton) [![npm 30d 5,184](https://img.shields.io/static/v1?label=npm+30d&message=5%2C184&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-baton-host) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-baton-host)
<!-- END META -->

> **功能**：在 DSH Host 内提供本地任务交接接口，让外部客户端投递会话任务、等待并读取结果。

> **亮点**：它用requestId和run状态把外部投递接到Harness会话，并把后台活动、问题和goal状态带回交接方。[Q01](#research-q01)、[Q02](#research-q02)

> **主要限制**：completed可能附活动查询失败，取消也可能仍busy；默认加载还会注册外部客户端配置，不能只看终态或把插件理解为只读桥。[Q03](#research-q03)、[Q04](#research-q04)

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
  - [Q01 · Host组件在跨客户端任务交接中承担什么？](#detail-section-11)
  - [Q02 · 投递和完成判断如何关联到可见会话？](#detail-section-12)
  - [Q03 · 终态、取消和重启恢复最重要的边界是什么？](#detail-section-13)
  - [Q04 · 加载插件会改哪些配置，本地控制权限如何建立？](#detail-section-14)
  - [Q05 · 怎样试用才能避免把交接状态误当任务成功？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有本地Harness与MCP客户端的开发者，可将任务投递到可见会话并读取run状态。

参照复制提示和人工看界面，本组件自动关联消息与等待；任务验收仍需原项目依据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话任务投递 | 新建或续接可见Harness会话 | 模型设置失败可留空会话 |
| run等待和goal跟随 | 返回轮次与目标状态 | 超时不取消，completed需同时读error |
| 问题回答 | 外端与Host UI协同回答 | 仅活动关联问题，非业务审批替代 |
| 会话级取消 | 停止活动并报告仍忙 | 影响同会话队列，不回滚副作用 |
| 外部MCP注册 | 让客户端可连接 | 默认改用户配置，可关闭并备份 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.15、DSH>=0.2.1-rc.2 | 必需 | 加载Host包 | 实际兼容未验收 |
| sessionController、workspaceRegistry | 必需 | 会话投递和活动管理 | 控制面不可用 |
| dsh-baton-mcp 0.6.5与外部客户端 | MCP交接条件 | stdio到本地socket | 只加载Host不保证外端工具出现 |
| 本地用户文件/管道权限 | 必需 | 限制控制面访问 | Windows ACL需独立核实 |
| 模型、账户及原工具权限 | 任务条件 | 执行原会话任务 | 余额检查有限，不能保证可交付 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份外端配置并选独立工作区 | 可关闭AUTO_REGISTER |
| 加载 | Host建socket并可注册外端MCP | 状态页报告注册，不凭加载成功判断 |
| 投递 | 外端明确session或cwd及模式 | 获run并核对可见会话 |
| 等待 | 外端读终态、error、goal与项目证据 | 超时继续核查，不自动重发 |
| 恢复 | 用户取消并查still_busy，到Host接管 | 仍忙不视作完成；退出另移MCP配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host与MCP本地资源未测 | 备份配置、检查socket与跨端 | 自动注册有用户级写入 |
| 持续 | 原模型与工具费用未知 | 区分运行终态与任务验收 | 无端到端节时对照 |
| 失败恢复 | 重试及未完工具副作用未知 | 核error、goal、still_busy与重启状态 | 最近落盘有延迟与失败窗口 |
| 退出 | 保留run与配置备份 | 停Host并移除外端MCP注册 | 任务副作用不回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可见会话交接 | controller.prompt与requestId关联 | 跨端实际兼容及合格交付 |
| 等待后台活动 | quiet确认与问题返回 | 活动查询失败时仍可能完成附error |
| 取消与恢复 | session停止重试、重启标interrupted | 取消无副作用或完整恢复 |

> **思考**：completed可能附活动查询失败，取消也可能仍busy；默认加载还会注册外部客户端配置，不能只看终态或把插件理解为只读桥。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它用requestId和run状态把外部投递接到Harness会话，并把后台活动、问题和goal状态带回交接方。[Q01](#research-q01)、[Q02](#research-q02)

[Q02](#research-q02) requestId关联与超时非取消清楚；[Q03](#research-q03) 不确定completed和落盘失败需调用者显式处理，不能只按state放行。

<a id="detail-section-5"></a>

### 1.4 主要限制

completed可能附活动查询失败，取消也可能仍busy；默认加载还会注册外部客户端配置，不能只看终态或把插件理解为只读桥。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离工作区、备份外端配置，终态逐项读error和goal并检查项目结果；未知活动或仍busy时人工接管。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持本地控制与状态交接；实际权限、跨端兼容与业务交付未验收，终态拆分是假设。

- 已检查：作者 README、包清单、源码路径 host/README.md、host/package.json、host/lib/index.js、host/lib/socket.js、host/lib/client.js、src/register.mjs 及固定范围 inventory；组件：host。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：组件Host范围统计；补读同仓src/register.mjs只核自动注册关键依赖，不把整个仓库算Host规模；未执行Host、MCP或项目测试。
- 下一步：固定外端与Host版本验证投递、问题、超时、后台失败、取消仍忙及重启，再独立检查项目验收。

**分析版本**

- **仓库**：[JialaoLiu/dsh-baton](https://github.com/JialaoLiu/dsh-baton)
- **版本号**：0.6.5（[固定提交 58e0c89](https://github.com/JialaoLiu/dsh-baton/tree/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可拆分已确认静止与不确定完成，并对配置及落盘提供修复回执；以查询失败、重启和取消故障对照检验，尚未实现。[Q05](#research-q05)

固定外端与Host版本验证投递、问题、超时、后台失败、取消仍忙及重启，再独立检查项目验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1770 | 1362 | 308 | — |
| .md | source | 1 | 76 | — | — | 893 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/JialaoLiu/dsh-baton/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/JialaoLiu/dsh-baton/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/JialaoLiu/dsh-baton/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Host控制面能否准确区分投递、运行终态与任务成功，跨客户端配置和本地权限的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Host组件在跨客户端任务交接中承担什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是dsh-baton的DSH Host插件子组件，不是根MCP程序本身。面向已有本地Harness和外部MCP客户端、希望把任务交给可见会话并取回状态的开发者；相对复制消息和人工盯界面，它提供本地控制socket、run标识、队列与等待接口。合格交接包括正确工作区/会话、投递可关联、返回终态及结果边界；任务测试是否通过和交付是否满足需求仍由原Agent及项目检查负责。README“交回完成结果”不应解释为Host自动验证业务正确性，模型与工具能力属于Harness。

#### 证据与依据

**依据 1 · 作者声明**：[host/README.md:13-17](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/README.md#L13-L17)

作者明确Host与MCP组件关系。

```text
# dsh-baton-host

The DeepSeek Harness plugin for [dsh-baton](https://github.com/JialaoLiu/dsh-baton#readme). It runs inside the Harness host (desktop app or `dsh web`) and serves a local, owner-only Unix socket (`~/.dsh-baton/host.sock`; a per-user named pipe on Windows). Through it, an MCP client can list and create workspaces, create sessions, continue a specific session, and wait for its turn to finish. All of this goes through Harness's own session controller, so the messages show up live in the Harness UI.

DeepSeek Harness 插件，配合 [dsh-baton](https://github.com/JialaoLiu/dsh-baton/blob/main/README.zh-CN.md) 使用。它运行在 Harness 内部，只开一个当前用户才能访问的本地套接字，让 MCP 客户端能新建工作区和对话、续接指定对话、等待任务完成。所有操作都走 Harness 官方会话服务，界面实时可见。
```

**依据 2 · 源码核查**：[host/lib/index.js:1340-1362](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L1340-L1362)

实际控制方法表。

<details>
<summary>查看原文（23行）</summary>

```text
  const methods = {
    ping: () => ({ name, version: VERSION, pid: process.pid }),
    workspaces,
    create_workspace: createWorkspace,
    list_sessions: listSessions,
    read_session: readSession,
    models,
    send,
    status: async ({ run_id, session_id, tail }) => {
      if (!run_id && session_id) return sessionStatus({ session_id })
      const run = getRun(run_id)
      return { ...publicRun(run, tail ?? 20), ...(isActive(run) ? {} : await goalField(run)) }
    },
    follow,
    wait,
    cancel,
    activity,
    rename_session: renameSession,
    rename_workspace: renameWorkspace,
    list_runs: ({ limit = 10, session_id } = {}) => [...runs.values()].reverse().filter((r) => !session_id || r.sessionId === session_id).slice(0, limit).map((r) => publicRun(r, 0)),
    update_queued: updateQueued,
    answer: answerQuestion,
  }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 投递和完成判断如何关联到可见会话？

**研究主题**：功能与机制

#### 完整回答

send先拒绝归档与缺少新会话路径，核对目录、计划模型设置，再创建/选择会话；创建成功但设模型或余额检查失败可能留下空会话，不能说整体无副作用。生成独立run和requestId后经controller.prompt投递，事件用source.rpcId匹配run，助手正文及工具轨迹归入接收者。turn/end成功后还检查session activity等待子Agent/后台任务，曾等待后台的会话再用2秒安静确认。wait超时返回timed_out而不取消运行，问题请求可与Harness UI竞答。局部完成指轮次/活动状态，不保证会话goal已完成，goalField另返回继续目标。

#### 证据与依据

**依据 1 · 源码核查**：[host/lib/index.js:1153-1208](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L1153-L1208)

路径、创建、模型和真实prompt接线。

<details>
<summary>查看原文（56行）</summary>

```text
  async function send({ message, session_id, cwd, workspace_id, mode: asked, sender, model, reasoning_effort }) {
    if (!message || !message.trim()) throw new Error('message is required')
    if (asked != null && asked !== 'followup' && asked !== 'steer') throw new Error('mode must be followup or steer')
    // Without a mode, a message to a busy session does what Harness's own busy-send setting says.
    const fromHarness = asked == null ? harnessBusyMode() : null
    const mode = asked ?? fromHarness ?? 'followup'
    const modeSource = asked != null ? 'explicit' : fromHarness ? 'harness' : 'default'
    if (sender != null && !SENDER_RE.test(sender)) throw new Error('sender must be 1-32 characters of a-z, 0-9 or -')
    let sessionId = session_id
    let workspace = null
    // Harness never runs a prompt sent to an archived session: the run would stay queued forever.
    if (sessionId && isArchived(sessionId)) {
      throw new Error(`Session ${sessionId} is archived. Unarchive it in Harness, or start a new session with cwd or workspace_id.`)
    }
    if (!sessionId && !cwd && !workspace_id) throw new Error('A new session needs cwd or workspace_id. Pass session_id to continue an existing one.')
    // A missing folder is not created: a mistyped path, or a project on a drive that is not
    // connected, would get an empty folder (under /Volumes, even). Checked before the registry,
    // which answers a bare ENOENT, or nothing at all for a folder registered while it was there.
    if (!sessionId) {
      const dir = workspace_id ? registry.get?.(workspace_id)?.path : normalizePath(cwd)
      if (dir && !isDirectory(dir)) {
        throw new Error(`The folder ${dir}${workspace_id ? ` (workspace ${workspace_id})` : ''} does not exist, so no session was started and nothing was sent. Check the path (a project on an external drive needs that drive connected), or create the folder first.`)
      }
    }
    const plan = await planModel(sessionId, { model, reasoning_effort })
    const isNew = !sessionId
    if (isNew) {
      // A folder that is not a workspace yet is registered first, so the new session shows in the sidebar.
      workspace = workspace_id ? { id: workspace_id } : await createWorkspace({ path: cwd, create_dir: false })
      sessionId = (await controller.create({ workspaceId: workspace.id })).sessionId
    }
    // A model that cannot be set fails the send before the prompt goes in.
    const chosen = await applyModel(sessionId, plan, isNew).catch((error) => {
      throw new Error(`${isNew ? `Session ${sessionId} was created, but no message was sent: ` : 'No message was sent: '}the model could not be set (${error?.message ?? error})`)
    })
    // A session that never picked a model runs on Harness's default.
    let provider = chosen.model?.provider
    if (!provider) try { provider = defaultModel()?.currentSelection?.()?.provider } catch { /* unknown: no check */ }
    if (provider === ACCOUNT_PROVIDER) {
      const empty = await emptyBalance()
      if (empty) throw new Error(`${isNew ? `Session ${sessionId} was created, but no message was sent` : 'No message was sent'}: the DeepSeek account has no balance left (${empty}), so the run would fail at once. Do not send again until the user has topped up (Harness → Settings → Account, or platform.deepseek.com).`)
    }
    const ahead = activeRunsFor(sessionId).map((r) => r.id)
    const run = {
      id: `hrun-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`,
      sessionId, requestId: requestIdFor(sender), ...(sender ? { sender } : {}), mode, state: 'queued', sawPrompt: false,
      startedAt: new Date().toISOString(), endedAt: null, preview: message.slice(0, 200),
      events: [], finalText: null, turnEnd: null, error: null,
      ...(chosen.model ? { model: chosen.model } : {}),
    }
    remember(run)
    try {
      await controller.prompt({ sessionId, requestId: run.requestId, content: [{ type: 'text', text: message }], mode }, signal())
      run.admitted = true // in Harness's queue (or conversation) now
    } catch (error) {
      settle(run, 'failed', { error: String(error?.message ?? error) })
```

</details>

**依据 2 · 源码核查**：[host/lib/index.js:307-386](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L307-L386)

requestId事件关联和turn结束。

<details>
<summary>查看原文（80行）</summary>

```text
  ctx.on('session/event', guard('session/event', (session, event) => {
    const data = event.data ?? {}
    if (FOLLOW_EVENTS.has(event.type)) wakeFollowers(session.id)
    // Turn state is kept only for a turn in progress and dropped at its end.
    if (event.type === 'turn/start') turns.set(session.id, { hasOutput: false })
    else if (event.type === 'assistant/message' && turns.has(session.id)) turns.get(session.id).hasOutput = true
    // A run settled as removed from the queue whose message reaches the conversation
    // after all (the removal check guessed wrong) is taken up again.
    if (event.type === 'user/message') {
      const lost = [...runs.values()].find((r) => r.removedFromQueue && r.state === 'cancelled' && r.sessionId === session.id && r.requestId === data.source?.rpcId)
      if (lost) {
        Object.assign(lost, { state: 'queued', removedFromQueue: false, error: null, endedAt: null })
        pushEvent(lost, { type: 'queue_delivered' })
      }
    }
    const active = activeRunsFor(session.id)
    if (event.type === 'turn/end' && !active.some((r) => r.sawPrompt)) turns.delete(session.id)
    if (!active.length) return
    // Something left Harness's queue: a queued run may have been removed (session stopped,
    // or Remove in the Harness UI) rather than started. Checked once the dust settles.
    if (event.type === 'agent/inbox/spliced' && data.removedCount > 0 && active.some((r) => !r.sawPrompt)) {
      scheduleQueueCheck(session.id)
      return
    }
    if (event.type === 'user/message') {
      const run = active.find((r) => r.requestId === data.source?.rpcId)
      const opensTurn = !turns.get(session.id)?.hasOutput
      // A user message no relayed run sent: someone typing in the Harness UI (or
      // another client). Mid-turn it joins the work of the runs in progress, so
      // they record it: their result then reflects that input too.
      const fromBridge = run || [...runs.values()].some((r) => r.requestId === data.source?.rpcId)
      if (data.source?.kind === 'user' && !fromBridge && !opensTurn) {
        const text = textOf(data.content).slice(0, 500)
        for (const r of outputReceiversFor(session.id)) {
          r.humanInputs = [...(r.humanInputs ?? []), { time: iso(event.time) ?? new Date().toISOString(), text }].slice(-MAX_HUMAN_INPUTS)
          pushEvent(r, { type: 'human_input', text })
        }
      }
      // A round a Harness goal starts by itself counts like a user-started turn: the run whose
      // turn just ended keeps that turn's reply instead of running on with the goal.
      if ((data.source?.kind === 'user' || data.source?.kind === 'goal') && opensTurn && run?.mode !== 'steer') {
        // A new user-started turn: runs whose own turn already ended keep their
        // result instead of absorbing this turn's output, but still wait for any
        // sub-agents or jobs they started. Turns woken by sub-agent results carry
        // no user message, and a relayed steer joins the current work, so neither
        // closes earlier runs.
        let closed = false
        for (const prev of active) {
          if (prev !== run && prev.sawPrompt && prev.turnEnd && !prev.outputClosed) {
            Object.assign(prev, { outputClosed: true, supersededBy: run?.id ?? (data.source.kind === 'goal' ? 'goal' : 'user') })
            closed = true
          }
        }
        if (closed) scheduleQuietCheck(session.id, 0)
      }
      if (run) { Object.assign(run, { sawPrompt: true, state: 'running' }); persist(run) }
      return
    }
    const receivers = outputReceiversFor(session.id)
    if (!receivers.length) return
    if (event.type === 'assistant/message') {
      const content = data.message?.content
      const text = textOf(content)
      for (const run of receivers) {
        for (const call of toolCallsOf(content)) pushEvent(run, { type: 'tool_call', ...call })
        if (text) {
          pushEvent(run, { type: 'text', text })
          run.finalText = text
        }
      }
    } else if (event.type === 'tool/result') {
      for (const run of receivers) pushEvent(run, { type: 'tool_result', status: data.status ?? (data.error ? 'error' : 'completed') })
    } else if (event.type === 'turn/end') {
      // The turn that carried these prompts is over. A failed turn ends the run; a
      // completed one ends it only once the session is quiet (no sub-agents or jobs
      // left), because Harness wakes the agent again when those report back.
      const reason = data.reason ?? null
      for (const run of receivers) { run.turnEnd = reason; persist(run) }
      if (reason?.kind && reason.kind !== 'completed') for (const run of receivers) settle(run, 'failed')
      else scheduleQuietCheck(session.id, 1000)
```

</details>

**依据 3 · 源码核查**：[host/lib/index.js:407-457](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L407-L457)

后台活动与安静确认。

<details>
<summary>查看原文（51行）</summary>

```text
  async function checkQuiet(sessionId) {
    quietTimers.delete(sessionId)
    const receivers = receiversFor(sessionId)
    if (!receivers.length) return
    let items
    try {
      items = await sessionActivity(sessionId)
      if (!Array.isArray(items)) throw new Error('session activity is not a list')
      activityErrors.delete(sessionId)
    } catch (error) {
      // Unknown is not idle: keep waiting and retry; give up only after repeated failures.
      const count = (activityErrors.get(sessionId) ?? 0) + 1
      activityErrors.set(sessionId, count)
      const message = `could not read session activity: ${error?.message ?? error}`
      if (count >= ACTIVITY_MAX_ERRORS) {
        activityErrors.delete(sessionId)
        for (const run of receivers) settle(run, 'completed', { error: `${message} (gave up after ${count} tries; sub-agents may still be running)` })
      } else {
        for (const run of receivers) run.error = message
        scheduleQuietCheck(sessionId, 3000)
      }
      return
    }
    const summary = (list) => list.map((g) => ({ kind: g.kind, count: g.items?.length ?? 0, labels: (g.items ?? []).map((i) => i.label ?? i.id) }))
    // Closed runs: the running turn belongs to a newer run, so only their
    // background work (sub-agents, jobs, reminders) keeps them open.
    const background = items.filter((g) => g.kind !== 'turn')
    for (const run of receivers.filter((r) => r.outputClosed)) {
      if (background.length === 0) settle(run, 'completed', { waitingOn: null, error: null })
      else { run.waitingOn = summary(background); persist(run) }
    }
    // A run whose own turn has not ended (and that has not seen the agent idle) is not done yet.
    const open = receivers.filter((r) => !r.outputClosed && (r.turnEnd || r.idleSeen))
    if (items.length === 0 && open.length) {
      // After waiting on sub-agents or jobs, Harness wakes the agent for a final
      // turn shortly after they finish. Confirm the quiet holds for a moment (no
      // new running status) so that last turn is not missed.
      const waited = open.some((r) => r.waitingOn)
      const quietSince = quietSinceBySession.get(sessionId)
      if (waited && (quietSince === undefined || (lastRunningAt.get(sessionId) ?? 0) > quietSince)) {
        quietSinceBySession.set(sessionId, Date.now())
        scheduleQuietCheck(sessionId, QUIET_CONFIRM_MS)
        return
      }
      quietSinceBySession.delete(sessionId)
      for (const run of open) settle(run, 'completed', { waitingOn: null, error: null })
      return
    }
    quietSinceBySession.delete(sessionId)
    for (const run of open) run.waitingOn = items.length ? summary(items) : run.waitingOn
    if (receiversFor(sessionId).length) scheduleQuietCheck(sessionId, 3000)
```

</details>

**依据 4 · 源码核查**：[host/lib/index.js:1237-1272](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L1237-L1272)

等待超时和goal另报。

<details>
<summary>查看原文（36行）</summary>

```text
  async function wait({ run_id, timeout_s = 300 }) {
    const run = getRun(run_id)
    const seconds = Number.isFinite(Number(timeout_s)) ? Math.min(Math.max(Number(timeout_s), 0), MAX_WAIT_S) : 300
    const unseenWait = () => run.state === 'waiting' && !run.waitNoticed
    const deadline = Date.now() + seconds * 1000
    // A wake can also come for another reason (the delayed one for a waiting status): wait on.
    while (isActive(run) && !unseenWait() && !stopping && Date.now() < deadline) {
      await new Promise((resolve) => {
        const set = waiters.get(run.id) ?? new Set()
        waiters.set(run.id, set)
        const done = () => {
          clearTimeout(timer)
          set.delete(done)
          resolve()
        }
        const timer = setTimeout(done, deadline - Date.now())
        set.add(done)
      })
    }
    const done = !isActive(run)
    if (!done && unseenWait()) {
      run.waitNoticed = true
      return { ...publicRun(run), needs_input: run.question ? 'answer' : 'harness-ui' }
    }
    return { ...publicRun(run), ...(done ? await goalField(run) : { timed_out: true }) }
  }

  // A run that completed in a session with a goal: the goal goes on after it.
  // The session's goal, for whoever waited on a run: one that goes on after it, or one that
  // stopped since the run began (its later rounds belong to the run's work: ended_since_run).
  // A goal complete before the run is left out.
  const goalField = async (run) => {
    const goal = run.state === 'completed' ? await goalOf(run.sessionId) : null
    if (!goal) return {}
    const since = goal.phase !== 'active' && goal.changedAt >= (Date.parse(run.startedAt) || Infinity)
    return goal.phase !== 'complete' || since ? { goal: since ? { ...goal, ended_since_run: true } : goal } : {}
```

</details>

**依据 5 · 源码核查**：[host/lib/index.js:600-637](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L600-L637)

UI与外部回答竞争及清理。

<details>
<summary>查看原文（38行）</summary>

```text
  function onQuestion(request, next) {
    const sessionId = request?.agent?.id
    const asked = sessionId && Array.isArray(request.questions) ? outputReceiversFor(sessionId) : []
    // Taken up too when someone follows the session's goal: the follow wait brings it back.
    const followed = followers.has(sessionId) || (followedUntil.get(sessionId) ?? 0) > Date.now()
    if (!asked.length && !(followed && Array.isArray(request.questions))) return next()
    const entry = { id: `q-${crypto.randomBytes(4).toString('hex')}`, sessionId, items: request.questions, answers: new Map(), runs: asked }
    const ours = new Promise((resolve) => { entry.resolve = resolve })
    questions.set(sessionId, entry)
    wakeFollowers(sessionId)
    for (const run of asked) {
      run.question = publicQuestion(entry)
      pushEvent(run, { type: 'question', question_id: entry.id, count: entry.items.length })
      needsPerson(run)
    }
    // The Harness UI (next) gets its own signal: once dsh_answer wins, aborting it tells
    // the window to drop its question card, which it otherwise keeps open.
    const ui = new AbortController()
    const harnessSignal = request.signal
    request.signal = harnessSignal ? AbortSignal.any([harnessSignal, ui.signal]) : ui.signal
    // With no Harness window to answer, only dsh_answer can: that is not a failure here.
    const theirs = Promise.resolve().then(next).catch((error) => (error?.code === 'NO_PROVIDER' || ui.signal.aborted ? new Promise(() => {}) : Promise.reject(error)))
    const aborted = new Promise((_, reject) => harnessSignal?.addEventListener('abort', () => reject(harnessSignal.reason), { once: true }))
    const answered = (by) => (value) => {
      for (const run of asked) pushEvent(run, { type: 'question_answered', question_id: entry.id, by })
      return value
    }
    const fromBaton = ours.then((value) => { ui.abort(new Error('answered through dsh-baton')); return value })
    return Promise.race([theirs.then(answered('harness')), fromBaton.then(answered('dsh-baton')), aborted]).finally(() => {
      if (questions.get(sessionId) === entry) questions.delete(sessionId)
      wakeFollowers(sessionId)
      for (const run of asked) {
        if (run.question?.question_id !== entry.id) continue
        delete run.question
        if (run.state === 'waiting') run.state = 'running'
        persist(run)
      }
    })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 终态、取消和重启恢复最重要的边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

活动查询连续失败10次时会把run标completed但同时保留error说明子Agent可能还在跑，因此调用者必须读error与waitingOn，不能只看completed。cancel按session停止活动最多三次，每次等6秒，可能返回still_busy=true；即便名义按run取消，也影响同会话其他活动和队列，不能当单任务副作用回滚。run延迟1秒批量落盘，失败仅日志后清空dirty，突发退出或写盘失败可能丢最近记录；重启将旧active标interrupted，不会自动继续原任务。可借鉴requestId关联、明确超时非取消和重启中断状态，但尚无恰好一次交接或业务结果认证。

#### 证据与依据

**依据 1 · 源码核查**：[host/lib/index.js:248-299](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L248-L299)

延迟落盘、失败与重启中断。

<details>
<summary>查看原文（52行）</summary>

```text
  function persist(run) {
    if (!store.enabled) return
    store.dirty.add(run.id)
    if (!store.timer) store.timer = setTimeout(guard('persist runs', flushRuns), PERSIST_DELAY_MS)
  }

  function writeRunFile(run) {
    const file = path.join(store.dir, `${run.id}.json`)
    const tmp = `${file}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(run), { mode: 0o600 })
    fs.renameSync(tmp, file)
  }

  function flushRuns() {
    clearTimeout(store.timer)
    store.timer = null
    for (const id of store.dirty) {
      const run = runs.get(id)
      try {
        if (run) writeRunFile(run)
        else fs.rmSync(path.join(store.dir, `${id}.json`), { force: true })
      } catch (error) { logError('persist run', error) }
    }
    store.dirty.clear()
  }

  // Load earlier records. A run that was active when Harness went away cannot
  // finish any more (Harness ends the turn on restart), so it is marked interrupted.
  function enableStore() {
    fs.mkdirSync(store.dir, { recursive: true, mode: 0o700 })
    if (!IS_WIN) fs.chmodSync(store.dir, 0o700)
    const loaded = []
    for (const name of fs.readdirSync(store.dir)) {
      const m = RUN_FILE.exec(name)
      if (!m) { if (name.endsWith('.tmp')) fs.rmSync(path.join(store.dir, name), { force: true }); continue }
      try {
        const run = JSON.parse(fs.readFileSync(path.join(store.dir, name), 'utf8'))
        if (run?.id === m[1]) loaded.push(run)
      } catch { fs.rmSync(path.join(store.dir, name), { force: true }) }
    }
    loaded.sort((a, b) => String(a.startedAt).localeCompare(String(b.startedAt)))
    for (const old of loaded.splice(0, Math.max(0, loaded.length - MAX_RUNS))) fs.rmSync(path.join(store.dir, `${old.id}.json`), { force: true })
    store.enabled = true
    for (const run of loaded) {
      if (runs.has(run.id)) continue
      run.events ??= []
      runs.set(run.id, run)
      if (isActive(run)) {
        Object.assign(run, { state: 'interrupted', endedAt: new Date().toISOString(), error: 'Harness restarted while this run was active; its turn was stopped.' })
        persist(run)
      }
    }
```

</details>

**依据 2 · 源码核查**：[host/lib/index.js:417-426](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L417-L426)

查询失败十次仍completed附error。

<details>
<summary>查看原文（10行）</summary>

```text
      // Unknown is not idle: keep waiting and retry; give up only after repeated failures.
      const count = (activityErrors.get(sessionId) ?? 0) + 1
      activityErrors.set(sessionId, count)
      const message = `could not read session activity: ${error?.message ?? error}`
      if (count >= ACTIVITY_MAX_ERRORS) {
        activityErrors.delete(sessionId)
        for (const run of receivers) settle(run, 'completed', { error: `${message} (gave up after ${count} tries; sub-agents may still be running)` })
      } else {
        for (const run of receivers) run.error = message
        scheduleQuietCheck(sessionId, 3000)
```

</details>

**依据 3 · 源码核查**：[host/lib/index.js:1291-1323](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L1291-L1323)

取消作用于session、重试和still_busy。

<details>
<summary>查看原文（33行）</summary>

```text
  async function cancel({ run_id, session_id }) {
    const run = run_id ? getRun(run_id) : null
    const sessionId = run?.sessionId ?? session_id
    if (!sessionId) throw new Error('run_id or session_id is required')
    // A stop that arrives while sub-agents are still starting can be lost: the turn
    // carries on and starts them again. Re-issue it until the session is quiet.
    let attempts = 0
    let still
    while (attempts < CANCEL_ATTEMPTS) {
      attempts++
      await registry.stopSessionActivity(sessionId)
      for (const r of receiversFor(sessionId)) settle(r, 'cancelled')
      const deadline = Date.now() + CANCEL_SETTLE_MS
      do {
        await new Promise((r) => setTimeout(r, 1000))
        still = await activity({ session_id: sessionId })
      } while (still.busy && Date.now() < deadline)
      if (!still.busy) break
    }
    // Stopping a session also empties Harness's queue: the runs waiting there are over.
    const removed = await reconcileQueue(sessionId).catch((error) => { logError('queue check', error); return [] })
    // The named run never reached the conversation (still queued, or sent to a session
    // that will not run it): settle it too, so nothing waits on it forever.
    if (run && isActive(run) && !run.sawPrompt) settle(run, 'cancelled')
    return {
      session_id: sessionId,
      ...(run ? { run: publicRun(run, 0) } : {}),
      attempts,
      still_busy: still.busy,
      activity: still.activity,
      queued_runs: activeRunsFor(sessionId).filter((r) => !r.sawPrompt).map((r) => r.id),
      ...(removed.length ? { removed_from_queue: removed } : {}),
    }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 加载插件会改哪些配置，本地控制权限如何建立？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Host包要求Node>=22.15、DSH>=0.2.1-rc.2，依赖同版本dsh-baton-mcp；sessionController与workspaceRegistry必需，模型、账户、goal等服务按能力注入。Unix创建自有目录0700及socket0600，拒占活socket；Windows映射到路径哈希named pipe，没有此源码中的Unix chmod，不能仅因名称含用户路径就证明严格ACL。协议无应用令牌，控制边界取决本地账户及系统权限。启用默认自动注册外部客户端：src/register.mjs可能复制MCP程序到用户目录，编辑Claude/Codex配置、补cwd和tool_timeout_sec、移除本组件旧hook并备份；这超出“只在Harness内部加载”的印象。AUTO_REGISTER=0可关闭。首次配置和跨端核对、持续模型/工具费用、失败与退出清理均有负担，费用和节时未量化；卸载Host之外还需移除外部MCP配置。

#### 证据与依据

**依据 1 · 源码核查**：[host/package.json:1-63](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/package.json#L1-L63)

子包入口、同版本MCP依赖及版本条件。

<details>
<summary>查看原文（63行）</summary>

```text
{
  "name": "dsh-baton-host",
  "version": "0.6.5",
  "description": "DeepSeek Harness plugin for dsh-baton: hand coding tasks from Claude Code or Codex to DeepSeek Harness on your machine. Adding it is the whole install: it registers the dsh-baton MCP server for Claude Code and Codex, runs each task live in the Harness window, wakes the main agent when the run ends and hands back the changed files, the project's own test results and a requirement-by-requirement checklist.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "dependencies": {
    "dsh-baton-mcp": "0.6.5"
  },
  "license": "MIT",
  "dsh": {
    "manifestVersion": 1,
    "engines": {
      "dsh": ">=0.2.1-rc.2"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-primitives"
      ]
    }
  },
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "mcp",
    "relay",
    "baton"
  ],
  "engines": {
    "node": ">=22.15"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/JialaoLiu/dsh-baton.git",
    "directory": "host"
  },
  "homepage": "https://github.com/JialaoLiu/dsh-baton#readme",
  "scripts": {
    "prepublishOnly": "node ../scripts/version.mjs"
  }
```

</details>

**依据 2 · 源码核查**：[host/lib/index.js:62-78](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L62-L78)

Unix路径权限与活socket检测。

<details>
<summary>查看原文（17行）</summary>

```text
async function claimSocket(sock) {
  // A named pipe has no file to own, chmod or clean up; it disappears with its
  // server. Only refuse to start when another host already answers on it.
  if (IS_WIN) {
    if (await probe(sock)) throw new Error(`another dsh-baton-host already serves ${sock}; set DSH_BATON_SOCKET for a second host`)
    return
  }
  const dir = path.dirname(sock)
  const ours = dir === batonHome() || !fs.existsSync(dir)
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 })
  if (ours) fs.chmodSync(dir, 0o700)
  let st
  try { st = fs.lstatSync(sock) } catch { return }
  if (!st.isSocket()) throw new Error(`${sock} exists and is not a socket; point DSH_BATON_SOCKET somewhere else`)
  const live = await probe(sock)
  if (live) throw new Error(`another dsh-baton-host already serves ${sock}; set DSH_BATON_SOCKET for a second host`)
  fs.unlinkSync(sock)
```

</details>

**依据 3 · 源码核查**：[host/lib/index.js:1461-1488](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L1461-L1488)

socket权限和卸载清理。

<details>
<summary>查看原文（28行）</summary>

```text
  ctx.effect(() => {
    const sock = socketPath()
    let server = null
    let disposed = false
    claimSocket(sock).then(() => {
      if (disposed) return
      try { enableStore() } catch (error) { logError('run store', error) }
      server = net.createServer(serve)
      server.on('error', (error) => ctx.logger?.error?.(`dsh-baton-host socket error: ${error.message}`))
      server.listen(sock, () => {
        if (!IS_WIN) try { fs.chmodSync(sock, 0o600) } catch { /* best effort */ }
        ctx.logger?.info?.(`dsh-baton-host listening on ${sock}`)
      })
    }).catch((error) => ctx.logger?.error?.(`dsh-baton-host not started: ${error.message}`))
    return () => {
      disposed = true
      if (store.enabled) { try { flushRuns() } catch (error) { logError('persist runs', error) } }
      store.enabled = false
      stopping = true
      // Release callers blocked in wait() and close open connections, so an
      // unloaded or reloaded plugin leaves no timers or sockets behind.
      for (const set of waiters.values()) for (const done of [...set]) done()
      waiters.clear()
      for (const set of followers.values()) for (const done of [...set]) done()
      for (const conn of connections) conn.destroy()
      if (!server) return
      server.close()
      if (!IS_WIN) try { if (fs.lstatSync(sock).isSocket()) fs.unlinkSync(sock) } catch { /* gone */ }
```

</details>

**依据 4 · 源码核查**：[host/lib/socket.js:38-48](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/socket.js#L38-L48)

Windows路径到管道映射。

<details>
<summary>查看原文（11行）</summary>

```text
// A Unix socket file on macOS and Linux. Node cannot listen on a socket file on
// Windows, so there the same path maps to a named pipe: \\.\pipe\dsh-baton-<hash of
// the path>. The default path sits in the user's own home folder, so the pipe name is
// per user. DSH_BATON_SOCKET may be either a path (mapped the same way) or a pipe name.
export function socketEndpoint(p, platform = process.platform, prefix = 'dsh-baton') {
  if (platform !== 'win32' || PIPE_PREFIX.test(p)) return p
  const key = path.win32.resolve(p).toLowerCase()
  return `\\\\.\\pipe\\${prefix}-${crypto.createHash('sha256').update(key).digest('hex').slice(0, 16)}`
}

export const socketPath = (env = process.env) => setting('SOCKET', env) || path.join(batonHome(env), 'host.sock')
```

</details>

**依据 5 · 源码核查**：[host/lib/index.js:1405-1425](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L1405-L1425)

默认自动注册及关闭开关。

<details>
<summary>查看原文（21行）</summary>

```text
  // --- MCP registration -----------------------------------------------------
  // Switching the plugin on registers the dsh-baton MCP server for Claude Code and Codex,
  // the same entries `dsh-baton setup` writes, so adding the plugin is the whole install.
  // It runs again on every Harness start: a plugin update brings the server along, and an
  // entry that is already right is left untouched. The Plugins page reads the outcome from
  // GET /dsh-baton/status (lib/client.js). DSH_BATON_AUTO_REGISTER=0 turns it off.
  let registration = { state: 'pending' }
  if (setting('AUTO_REGISTER') !== '0') {
    setImmediate(guard('register', async () => {
      const root = serverRoot()
      if (!root) { registration = { state: 'done', ok: false, error: 'no-server', clients: [] }; return }
      const { autoRegister, harnessRuntime } = await import(pathToFileURL(path.join(root, 'src', 'register.mjs')).href)
      // Inside the desktop app, its own binary can stand in for a missing Node.js.
      const fallback = process.versions.electron && harnessRuntime ? harnessRuntime(process.execPath) : null
      const result = autoRegister({ root, harnessDir: harnessDir(), fallback })
      registration = { state: 'done', ...result }
      const summary = result.clients.map((c) => `${c.label}: ${c.state}${c.error ? ` (${c.error})` : ''}`).join(', ')
      ctx.logger?.[result.ok ? 'info' : 'error']?.(`dsh-baton-host MCP registration: ${summary || result.error}${result.codexHook && result.codexHook !== 'none' ? `; old Codex Stop hook: ${result.codexHook}` : ''}`)
    }))
  } else {
    registration = { state: 'off' }
```

</details>

**依据 6 · 源码核查**：[src/register.mjs:544-620](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/src/register.mjs#L544-L620)

真实外部配置和旧hook改动。

<details>
<summary>查看原文（77行）</summary>

```text
export function autoRegister({ root, home = os.homedir(), env = process.env, node = null, harnessDir = null, fallback = null, find = findNode, app = appDir(batonHome(env, home)) } = {}) {
  const result = { ok: false, version: versionOf(root), clients: [], error: null, node: null, runtime: null, codexHook: null }
  try {
    let serverRoot = root
    if (!fs.existsSync(path.join(root, '.git')) && path.resolve(root) !== path.resolve(app)) {
      const installed = versionOf(app)
      const older = !installed || compareVersions(installed, result.version) < 0
      // Same version, other files (a fix synced before its release): copied too.
      const changed = !older && compareVersions(installed, result.version) === 0 && appDigest(app) !== appDigest(root)
      if (older || changed || !fs.existsSync(path.join(app, 'src', 'server.mjs'))) installApp(root, app)
      serverRoot = app
    }
    const script = path.join(serverRoot, 'src', 'server.mjs')
    // Whether an entry can start a server. A bare command (`npx -y dsh-baton-mcp`, as MCP
    // directories suggest) is the user's own choice and resolved on the client's PATH: kept.
    // Harness's own binary only works in Node mode.
    const bare = (cmd) => !/[\\/]/.test(cmd)
    const works = (e) => {
      if (!e?.command) return false
      // `node /old/path/server.mjs` with that file gone is still broken.
      if (bare(e.command)) return !e.args?.[0] || bare(e.args[0]) || fs.existsSync(e.args[0])
      if (!fs.existsSync(e.command) || !e.args?.[0] || !fs.existsSync(e.args[0])) return false
      return !fallback || path.resolve(e.command) !== path.resolve(fallback.command) || e.env?.ELECTRON_RUN_AS_NODE === '1'
    }
    const list = clients(env, home)
    // Whether Codex's table already had tool_timeout_sec: one written now (below, or with a
    // fresh table) is noted as new, so conversations opened without it keep 270 s.
    const codexFile = list.find((c) => c.id === 'codex')?.file
    let hadTimeout = false
    try { hadTimeout = readCodexToolTimeout(fs.readFileSync(codexFile, 'utf8')) !== null } catch { /* no config yet */ }
    let launch = node ? { command: node } : null
    for (const c of list) {
      if (!c.present) { result.clients.push({ id: c.id, label: c.label, state: 'not-installed' }); continue }
      try {
        const text = fs.existsSync(c.file) ? fs.readFileSync(c.file, 'utf8') : ''
        const current = c.read(text)
        if (works(current)) {
          const same = !bare(current.command) && path.resolve(current.args[0]) === path.resolve(script)
          result.clients.push({ id: c.id, label: c.label, state: same ? 'unchanged' : 'kept', script: current.args[0] })
          continue
        }
        if (!launch) {
          const found = find({ env, exclude: [harnessDir] })
          launch = found ? { command: found } : fallback
        }
        if (!launch) { result.clients.push({ id: c.id, label: c.label, state: 'failed', error: 'no-node' }); continue }
        rewrite(c.file, (t) => c.edit(t, { ...launch, args: [script] }))
        result.clients.push({ id: c.id, label: c.label, state: 'registered' })
      } catch (e) {
        result.clients.push({ id: c.id, label: c.label, state: 'failed', error: e.message })
      }
    }
    const codex = list.find((c) => c.id === 'codex')
    // Entries written before cwd or tool_timeout_sec existed get them here, and the old Codex
    // Stop hook goes (see removeCodexHookBlock), in one write: Codex may still have the file
    // open from the edit before, and Windows refuses to replace it then.
    result.codexHook = 'none'
    try {
      if (codex?.present && fs.existsSync(codex.file)) {
        rewrite(codex.file, (t) => {
          const timed = addCodexToolTimeout(addCodexCwd(t, home))
          const out = removeCodexHookBlock(timed, codex.file)
          result.codexHook = out === timed ? 'none' : 'removed'
          return out
        })
        noteCodexToolTimeout(codex.file, env, home, !hadTimeout)
      }
    } catch (e) {
      result.codexHook = `failed (${e.code ?? e.message})`
      // Codex then keeps 270 s waits and the old hook: say so where the Plugins page looks.
      const c = result.clients.find((x) => x.id === 'codex')
      if (c && c.state !== 'not-installed') Object.assign(c, { state: 'failed', error: `could not update ${codex.file}: ${e.code ?? e.message}` })
    }
    // State the hook of 0.6.0–0.6.3 kept that nothing reads any more (pending.json stays:
    // conversations opened before still run the hook, which reads it).
    for (const f of ['registered.json', 'trust-noted.json', 'wanted', 'alive']) {
      try { fs.rmSync(path.join(batonHome(env, home), 'codex-hook', f), { force: true }) } catch { /* left */ }
```

</details>

**依据 7 · 源码核查**：[src/register.mjs:380-411](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/src/register.mjs#L380-L411)

配置备份与临时写重试。

<details>
<summary>查看原文（32行）</summary>

```text
  let after = edit(before)
  // The edits join lines with \n; a file written with \r\n (Windows) keeps them.
  if (before.includes('\r\n') && after !== before) after = after.replace(/\r?\n/g, '\r\n')
  if (after === before) return 'unchanged'
  if (before) fs.copyFileSync(file, `${file}.bak-dsh-baton`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const tmp = `${file}.tmp-${process.pid}`
  fs.writeFileSync(tmp, after, { mode: before ? fs.statSync(file).mode : 0o600 })
  // On Windows a file another process has open (Codex reading its config just after a
  // change, an antivirus scan) refuses the rename for a moment: try again shortly. The file
  // is read again each time, so a change saved meanwhile (Codex's own settings) is kept.
  let seen = before
  for (let tries = 0; ; tries++) {
    try { fs.renameSync(tmp, file); break } catch (e) {
      if (tries < 20 && ['EPERM', 'EBUSY', 'EACCES'].includes(e.code)) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100)
        let now = seen
        try { now = fs.readFileSync(file, 'utf8') } catch { /* still locked: as before */ }
        if (now !== seen) {
          seen = now
          let next = edit(now)
          if (now.includes('\r\n') && next !== now) next = next.replace(/\r?\n/g, '\r\n')
          if (next === now) { fs.rmSync(tmp, { force: true }); return 'unchanged' }
          fs.writeFileSync(tmp, next)
        }
        continue
      }
      try { fs.rmSync(tmp, { force: true }) } catch { /* left behind */ }
      throw e
    }
  }
  return 'updated'
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样试用才能避免把交接状态误当任务成功？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可先在独立工作区和无敏感工具会话试用，禁用自动注册或备份外部客户端配置，确认外部请求投到正确会话。依次核查正常回复、等待超时、需要人回答、后台活动查询失败、取消仍busy及重启interrupted，终态必须同时读error、goal和项目交付证据。发现错误会话、completed附活动未知或取消仍忙时停止继续发送并到Harness人工接管，恢复手工交接。可推导未实现方向，将completed-with-uncertainty与已确认静止分开，并让外部配置变更与run落盘有显式回执/修复状态。对照故障注入下的误完成率、重复投递和人工排障；若只增加协议复杂度而无改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[host/lib/index.js:417-426](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L417-L426)

完成不确定性假设直接来自失败终态。

<details>
<summary>查看原文（10行）</summary>

```text
      // Unknown is not idle: keep waiting and retry; give up only after repeated failures.
      const count = (activityErrors.get(sessionId) ?? 0) + 1
      activityErrors.set(sessionId, count)
      const message = `could not read session activity: ${error?.message ?? error}`
      if (count >= ACTIVITY_MAX_ERRORS) {
        activityErrors.delete(sessionId)
        for (const run of receivers) settle(run, 'completed', { error: `${message} (gave up after ${count} tries; sub-agents may still be running)` })
      } else {
        for (const run of receivers) run.error = message
        scheduleQuietCheck(sessionId, 3000)
```

</details>

**依据 2 · 源码核查**：[host/lib/index.js:1237-1272](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L1237-L1272)

超时和goal语义。

<details>
<summary>查看原文（36行）</summary>

```text
  async function wait({ run_id, timeout_s = 300 }) {
    const run = getRun(run_id)
    const seconds = Number.isFinite(Number(timeout_s)) ? Math.min(Math.max(Number(timeout_s), 0), MAX_WAIT_S) : 300
    const unseenWait = () => run.state === 'waiting' && !run.waitNoticed
    const deadline = Date.now() + seconds * 1000
    // A wake can also come for another reason (the delayed one for a waiting status): wait on.
    while (isActive(run) && !unseenWait() && !stopping && Date.now() < deadline) {
      await new Promise((resolve) => {
        const set = waiters.get(run.id) ?? new Set()
        waiters.set(run.id, set)
        const done = () => {
          clearTimeout(timer)
          set.delete(done)
          resolve()
        }
        const timer = setTimeout(done, deadline - Date.now())
        set.add(done)
      })
    }
    const done = !isActive(run)
    if (!done && unseenWait()) {
      run.waitNoticed = true
      return { ...publicRun(run), needs_input: run.question ? 'answer' : 'harness-ui' }
    }
    return { ...publicRun(run), ...(done ? await goalField(run) : { timed_out: true }) }
  }

  // A run that completed in a session with a goal: the goal goes on after it.
  // The session's goal, for whoever waited on a run: one that goes on after it, or one that
  // stopped since the run began (its later rounds belong to the run's work: ended_since_run).
  // A goal complete before the run is left out.
  const goalField = async (run) => {
    const goal = run.state === 'completed' ? await goalOf(run.sessionId) : null
    if (!goal) return {}
    const since = goal.phase !== 'active' && goal.changedAt >= (Date.parse(run.startedAt) || Infinity)
    return goal.phase !== 'complete' || since ? { goal: since ? { ...goal, ended_since_run: true } : goal } : {}
```

</details>

**依据 3 · 源码核查**：[host/lib/index.js:1291-1323](https://github.com/JialaoLiu/dsh-baton/blob/58e0c896c4950aa7bb80e1e51ad1ac5be82e61c0/host/lib/index.js#L1291-L1323)

仍忙与会话级接管。

<details>
<summary>查看原文（33行）</summary>

```text
  async function cancel({ run_id, session_id }) {
    const run = run_id ? getRun(run_id) : null
    const sessionId = run?.sessionId ?? session_id
    if (!sessionId) throw new Error('run_id or session_id is required')
    // A stop that arrives while sub-agents are still starting can be lost: the turn
    // carries on and starts them again. Re-issue it until the session is quiet.
    let attempts = 0
    let still
    while (attempts < CANCEL_ATTEMPTS) {
      attempts++
      await registry.stopSessionActivity(sessionId)
      for (const r of receiversFor(sessionId)) settle(r, 'cancelled')
      const deadline = Date.now() + CANCEL_SETTLE_MS
      do {
        await new Promise((r) => setTimeout(r, 1000))
        still = await activity({ session_id: sessionId })
      } while (still.busy && Date.now() < deadline)
      if (!still.busy) break
    }
    // Stopping a session also empties Harness's queue: the runs waiting there are over.
    const removed = await reconcileQueue(sessionId).catch((error) => { logError('queue check', error); return [] })
    // The named run never reached the conversation (still queued, or sent to a session
    // that will not run it): settle it too, so nothing waits on it forever.
    if (run && isActive(run) && !run.sawPrompt) settle(run, 'cancelled')
    return {
      session_id: sessionId,
      ...(run ? { run: publicRun(run, 0) } : {}),
      attempts,
      still_busy: still.busy,
      activity: still.activity,
      queued_runs: activeRunsFor(sessionId).filter((r) => !r.sawPrompt).map((r) => r.id),
      ...(removed.length ? { removed_from_queue: removed } : {}),
    }
```

</details>

#### 缺口

- 没有跨MCP客户端、系统权限和项目任务的同版本实际验收。
  **影响**：不能证明本地账户隔离、端到端交接及任务质量可靠，采用限隔离试用。
  **进一步探讨**：固定客户端、Host和项目版本，分别验证权限、状态故障与项目合格交付。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
