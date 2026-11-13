# dsh-baton-host

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[eeedd0e](https://github.com/JialaoLiu/dsh-baton/tree/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host)

<!-- BEGIN META -->
[![GitHub ★ 216](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=216&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/JialaoLiu/dsh-baton) [![npm 30d 8,357](https://img.shields.io/static/v1?label=npm+30d&message=8%2C357&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-baton-host) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-baton-host)
<!-- END META -->

> **功能**：把 Claude Code 或 Codex 的任务交给可见的 DSH 会话，并将结果交回原客户端。

> **亮点**：它把外部任务与 DSH 会话中的 requestId、run 和可回读历史关联。Team 开关使用宿主现有服务，可在送入第一条消息前配置该会话。[Q01](#research-q01) [Q02](#research-q02) 客户端在具备 BEFORE 槽的宿主上保留普通消息原渲染器，仅加来源提示。[Q05](#research-q05)

> **主要限制**：活动查询持续失败时，回执可以是 completed 并附 error。会话级取消可能仍忙，启用插件默认还会改外端 MCP 注册配置。[Q02](#research-q02) [Q03](#research-q03) steering 和旧宿主仍包装渲染器，找不到 Inner 时包装返回空，来源标签也仅来自请求元数据。[Q05](#research-q05)

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
  - [Q01 · 从 Claude Code 或 Codex 投递后，DSH 是否已执行任务，Team 开关在哪里生效？](#detail-section-11)
  - [Q02 · 等待、goal 跟踪和历史读取能否证明会话已经交付？](#detail-section-12)
  - [Q03 · 启用、停止与退出交接分别写入什么，谁负责处理失败？](#detail-section-13)
  - [Q04 · 如何试验把未知终态独立标出是否真的减少误接收？](#detail-section-14)
  - [Q05 · 发送者标签怎样与 0.2.2 前后的普通消息和 steering 渲染共存？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在使用 Claude Code 或 Codex 的同时需要让 DSH 在可见工作区执行独立任务的开发者，可将任务绑定到明确会话。

手工复制任务与观察 DSH 窗口可完成同样的任务执行，人工需负责对应投递、后台活动和项目验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话交接 | 对接本机外部客户端 | Team 依赖 DSH 服务与 live agent |
| 运行追踪 | 查询问题、历史和目标状态 | 仍需读取 error 与项目结果 |
| 会话取消 | 停止活动并报告仍忙 | 同会话其他运行也可能受影响 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 会话控制器、工作区注册表 | 必需 | 投递、活动查询与取消 | 核心控制面无法工作 |
| 同版本 MCP 包 | 外端接入必需 | 连接本地 socket | 客户端可能无法投递 |
| Agent Teams 服务与 live agent | Team 开关必需 | 设置单会话 Team 模式 | 拒绝消息，某些错误会留下新会话 |
| Web 槽位与对应消息渲染器 | 可见来源标签必需 | 新普通消息走 BEFORE，steering 与旧普通消息需 Inner | 包装找不到 Inner 时返回空 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选独立工作区并备份外端配置 | 核对 Host 与 MCP 版本 |
| 投递 | 外端指定会话或目录并提交任务 | 核对 run、会话和入队状态 |
| 验收 | 外端读 wait、goal、error 并运行项目验收 | 未知活动时停止自动续接 |
| 退出 | 用户停止 Host 并移除外端 MCP 注册 | 检查队列和工作区是否还有变更 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地 Host 与外端运行开销未测 | 备份并核对版本和注册 | 安装改变外端配置 |
| 持续 | 模型和项目测试费用取决于原任务 | 查 run、活动和测试 | 单位合格任务人时未测 |
| 失败恢复 | 续接与重新运行可能重复消耗 | 停会话、处理仍忙、检查产物 | 工作区写入需自行恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 投递可追溯 | run 与 requestId 绑定 prompt | 跨端真实兼容 |
| 等待与回读 | 问题、超时、goal 及日志有独立路径 | 活动错误时的人工误判率 |
| 会话取消 | 停止会话并返回仍忙及队列 | 平台权限及任务副作用恢复 |

> **思考**：活动查询持续失败时，回执可以是 completed 并附 error。会话级取消可能仍忙，启用插件默认还会改外端 MCP 注册配置。[Q02](#research-q02) [Q03](#research-q03) steering 和旧宿主仍包装渲染器，找不到 Inner 时包装返回空，来源标签也仅来自请求元数据。[Q05](#research-q05)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把外部任务与 DSH 会话中的 requestId、run 和可回读历史关联。Team 开关使用宿主现有服务，可在送入第一条消息前配置该会话。[Q01](#research-q01) [Q02](#research-q02) 客户端在具备 BEFORE 槽的宿主上保留普通消息原渲染器，仅加来源提示。[Q05](#research-q05)

分页通过首个 cursor 固定读取窗口，兼容旧 inspect。活动查询与取消回执包含异常信息，调用者需组合多个字段判断。[Q02](#research-q02) [Q03](#research-q03) 新版普通消息改用独立子槽，减少覆盖原始渲染，steering 与旧版仍需关注渲染器优先级。[Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

活动查询持续失败时，回执可以是 completed 并附 error。会话级取消可能仍忙，启用插件默认还会改外端 MCP 注册配置。[Q02](#research-q02) [Q03](#research-q03) steering 和旧宿主仍包装渲染器，找不到 Inner 时包装返回空，来源标签也仅来自请求元数据。[Q05](#research-q05)

<a id="detail-section-6"></a>

### 1.5 使用建议

选隔离会话投递单一有测试判据的任务。先备份外部 MCP 配置，错误或仍忙时从 Host 回查再决定是否续接。[Q03](#research-q03) [Q04](#research-q04) 测试普通及 steering 消息正文与标签；验收交付时以事件、run 与项目结果为准。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持本地任务投递和回读。实际宿主兼容、权限与交付效果仍待验收，显式未知态属于待验证假设。

- 已检查：作者 README、包清单、源码路径 host/package.json、host/cordis.patch.yml、host/README.md、host/lib/index.js、src/core.mjs、host/lib/client.js 及固定范围 inventory；组件：host。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：聚焦 Host 子组件、外端 Team 入参和客户端来源标签。对比最后完成研究与当前固定提交的关键路径。未执行目标插件、外部 MCP、真实宿主或项目任务。
- 下一步：以两版宿主和隔离项目对照普通投递、Team 开关失败、历史分页、查询失败、重启和取消仍忙。 两版宿主分别检查普通/steering 标签和正文，附带无 Inner 与其他消息插件的覆盖。

**分析版本**

- **仓库**：[JialaoLiu/dsh-baton](https://github.com/JialaoLiu/dsh-baton)
- **版本号**：0.6.13（[固定提交 eeedd0e](https://github.com/JialaoLiu/dsh-baton/tree/eeedd0e3855bcf2798bdc72180f87d8761c21f35)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

单列未知静止状态，并把项目验收与 run 终态分开记录，可能降低过早复用结果的概率。该假设可用固定故障轨迹对照。[Q04](#research-q04)

以两版宿主和隔离项目对照普通投递、Team 开关失败、历史分页、查询失败、重启和取消仍忙。 两版宿主分别检查普通/steering 标签和正文，附带无 Inner 与其他消息插件的覆盖。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1851 | 1420 | 328 | — |
| .md | source | 2 | 57 | — | — | 532 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/JialaoLiu/dsh-baton/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/JialaoLiu/dsh-baton/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/JialaoLiu/dsh-baton/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：外部客户端将工作交给可见的 DSH 会话时，固定版能如何明确已入队、仍在执行、需人工介入和实际交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从 Claude Code 或 Codex 投递后，DSH 是否已执行任务，Team 开关在哪里生效？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

用户需要在外部编辑 Agent 的同时把实现交给可见的 Harness 会话；手工复制任务和观察窗口无法把后续等待与该次提交稳定关联。Host 先选会话和模型，若显式传 team 则从 live agent registry 取该会话对应对象，必要时 resolveAgent，再调用 Agent Teams 服务，随后记录 run 和 requestId 并向会话控制器发 prompt。admitted 只说明接收进会话或 Harness 队列。旧对话工具表可能把 team 发送成字符串，外端对 true/false 做有限归一；Host 仍要求布尔值并检查服务存在。服务缺失会在建会话前拒绝；服务存在但设置失败可能留下刚创建的会话和已修改的模型，不能据报错假定本地无变化。

#### 证据与依据

**依据 1 · 作者声明**：[host/README.md:3-13](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/README.md#L3-L13)

作者将任务交接描述为两端可见流程。

<details>
<summary>查看原文（11行）</summary>

```text
Hand coding tasks from Claude Code or Codex to DeepSeek Harness: they run live in this window and come back with the changed files and test results. [Full guide](https://github.com/JialaoLiu/dsh-baton#readme)

让 Claude Code 或 Codex 把编码任务交给 DeepSeek Harness：任务在这个窗口里实时跑，做完带着改动文件和测试结果交回去。[完整说明](https://github.com/JialaoLiu/dsh-baton/blob/main/README.zh-CN.md)

## Install / 安装

**Install / 安装**: Plugins / 插件 → Add plugin / 添加插件 → `dsh-baton-host` → Install / 安装 → Enable now / 立即启用. That registers dsh-baton for Claude Code and Codex. / 启用后会为 Claude Code 和 Codex 注册 dsh-baton。

**Check / 验证**:
1. Open a new chat in Claude Code or Codex; Codex asks once to approve the dsh-baton tools. / 在 Claude Code 或 Codex 里新开对话，Codex 第一次会请你批准 dsh-baton 的工具。
2. Ask it to call `dsh_list_workspaces`; it lists your Harness workspaces. / 让它调用 `dsh_list_workspaces`，会列出你的 Harness 工作区。
```

</details>

**依据 2 · 源码核查**：[src/core.mjs:876-882](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/src/core.mjs#L876-L882)

外端兼容旧工具表的有限字符串布尔值，并检查 Host team feature。

```text
    // A client whose tool list predates team (a conversation open since before an update) sends
    // it as the string "true" or "false": take that as the boolean it means.
    if (typeof a.team === 'string' && /^(true|false)$/i.test(a.team.trim())) a = { ...a, team: a.team.trim().toLowerCase() === 'true' }
    // Agent Teams live in Harness itself; a plugin without the team feature would drop it silently.
    if (a.team != null) {
      if (!host) throw new Error('Agent Teams need the dsh-baton-host plugin running inside DeepSeek Harness. Nothing was sent.')
      if (!hostFeatures.includes('team')) throw new Error(`The Harness plugin dsh-baton-host ${hostVersion} is too old to turn on Agent Teams; this MCP server is ${VERSION}. Nothing was sent. Update the plugin (Plugins → dsh-baton-host → Update to ${VERSION}), or send without team.`)
```

**依据 3 · 源码核查**：[host/lib/index.js:1182-1207](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L1182-L1207)

Host 检查 Team 服务并解析注册表中的 live agent。

<details>
<summary>查看原文（26行）</summary>

```text
  const TEAMS_UNSUPPORTED = 'this DeepSeek Harness cannot turn Agent Teams on per session; that needs Harness 0.2.2-rc.2 or later: update Harness, or send without team'
  async function setTeam(sessionId, enabled) {
    if (typeof teamsService?.setEnabled !== 'function') throw new Error(TEAMS_UNSUPPORTED)
    // The exact live Agent from Harness's registry, as its own UI lookup takes it: Team rejects
    // any other object ("subagent tree access requires the exact live caller"). A session not
    // loaded yet is loaded first.
    let agent = agentsService?.get?.(sessionId)
    if (!agent && typeof controller.resolveAgent === 'function') {
      await controller.resolveAgent(sessionId)
      agent = agentsService?.get?.(sessionId)
    }
    // A finished sub-agent's session is never loaded again: name the likely cause.
    if (!agent) throw new Error(`session ${sessionId} is not loaded in Harness; if it is a sub-agent's (teammate's) session, change Team mode on its root session instead`)
    await teamsService.setEnabled(agent, enabled)
  }

  async function send({ message, session_id, cwd, workspace_id, mode: asked, sender, model, reasoning_effort, team }) {
    if (!message || !message.trim()) throw new Error('message is required')
    if (asked != null && asked !== 'followup' && asked !== 'steer') throw new Error('mode must be followup or steer')
    if (team != null && typeof team !== 'boolean') throw new Error('team must be true or false')
    // Checked before a new session is made, so a Harness without them is left as it was.
    if (team != null && typeof teamsService?.setEnabled !== 'function') throw new Error(`Nothing was sent: ${TEAMS_UNSUPPORTED}`)
    // Without a mode, a message to a busy session does what Harness's own busy-send setting says.
    const fromHarness = asked == null ? harnessBusyMode() : null
    const mode = asked ?? fromHarness ?? 'followup'
    const modeSource = asked != null ? 'explicit' : fromHarness ? 'harness' : 'default'
```

</details>

**依据 4 · 源码核查**：[host/lib/index.js:1232-1262](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L1232-L1262)

先应用模型和 Team，再建立 run 并调用 prompt；失败被登记。

<details>
<summary>查看原文（31行）</summary>

```text
    // A model that cannot be set fails the send before the prompt goes in.
    const chosen = await applyModel(sessionId, plan, isNew).catch((error) => {
      throw new Error(`${isNew ? `Session ${sessionId} was created, but no message was sent: ` : 'No message was sent: '}the model could not be set (${error?.message ?? error})`)
    })
    // Team mode goes on (or off) before the prompt, so the first step already has the Team tools.
    if (team != null) {
      await setTeam(sessionId, team).catch((error) => {
        throw new Error(`${isNew ? `Session ${sessionId} was created, but no message was sent: ` : 'No message was sent: '}Agent Teams could not be turned ${team ? 'on' : 'off'} (${error?.message ?? error})`)
      })
    }
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

#### 缺口

- 未测具体 DSH release 对 live agent 与 Team 服务的接线
  **影响**：静态通过不能保证第一轮具备 Team 工具
  **进一步探讨**：对支持和缺失服务两种 profile 投递并核对首轮工具和空会话

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 等待、goal 跟踪和历史读取能否证明会话已经交付？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

wait 可以首次返回需人工处理的问题，仍活跃到截止则返回 timed_out，完成时可能附 goal。quiet 检查把活动读取异常视为未知并重试，但达到上限后仍设为 completed 并附错误，外端必须解释 error，不能按终态自动确认。现代宿主用 events 逆向分页，首个 cursor 用于固定后续读取切点，回放按 seq 去重；老宿主仍走 inspect。无事件页或重复游标会提前结束，last 只在完整读入后切片，因此长会话开销和兼容性需要检验。工作是否达标仍按变更、测试和任务需求分别核对。

#### 证据与依据

**依据 1 · 源码核查**：[host/lib/index.js:409-435](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L409-L435)

活动错误累计后走 completed + error，正常分支须观察后台为空。

<details>
<summary>查看原文（27行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[host/lib/index.js:742-781](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L742-L781)

日志调用按 inspect/events 分支，分页固定 cursor 并排序归并。

<details>
<summary>查看原文（40行）</summary>

```text
  // A session's whole event log and its folder. Harness up to 0.2.1 has sessionController.inspect;
  // 0.2.2 replaced it with paged history (events): the newest page first, beforeSeq walks back,
  // throughSeq pins every page to the same cut. The folder then comes from the session list.
  async function sessionLog(sessionId) {
    if (typeof controller.inspect === 'function') return controller.inspect(sessionId, signal())
    if (typeof controller.events !== 'function') throw new Error('This DeepSeek Harness version cannot read a session log.')
    const address = { kind: 'session', sessionId }
    const pages = []
    let throughSeq
    let beforeSeq
    for (;;) {
      const page = await controller.events({ address, maxMessages: 500, ...(throughSeq === undefined ? {} : { throughSeq }), ...(beforeSeq === undefined ? {} : { beforeSeq }) }, signal())
      throughSeq ??= page.cursor
      const events = (page.records ?? []).filter((r) => r?.type === 'event' && r.event).map((r) => r.event)
      pages.unshift(events)
      if (!page.hasMore || !events.length || events[0].seq === beforeSeq) break
      beforeSeq = events[0].seq
    }
    const seen = new Set()
    const events = pages.flat().filter((e) => (seen.has(e.seq) ? false : (seen.add(e.seq), true)))
    const { items } = await controller.list({}, signal())
    return { meta: { cwd: items.find((it) => it.sessionId === sessionId)?.cwd ?? null }, events }
  }

  async function readSession({ session_id, last = 10 }) {
    const { meta, events } = await sessionLog(session_id)
    const messages = []
    let title = null
    for (const e of events) {
      if (e.type === 'session/title') title = e.data?.title ?? title
      else if (e.type === 'user/message' && e.data?.source?.kind === 'user') {
        messages.push({ role: 'user', time: iso(e.time), text: textOf(e.data.content) })
      } else if (e.type === 'assistant/message') {
        const content = e.data?.message?.content
        const tools = toolCallsOf(content).map((t) => t.name ?? t.kind)
        const text = textOf(content)
        if (text || tools.length) messages.push({ role: 'assistant', time: iso(e.time), text, ...(tools.length ? { tools } : {}) })
      }
    }
    return { session_id, ...(isArchived(session_id) ? { archived: true } : {}), cwd: meta?.cwd ?? null, title, total_messages: messages.length, messages: messages.slice(-last) }
```

</details>

**依据 3 · 源码核查**：[host/lib/index.js:913-929](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L913-L929)

goal 跟踪依赖 projections，并同时取得会话日志。

<details>
<summary>查看原文（17行）</summary>

```text
  async function follow({ session_id, until = 'goal', cursor, since_ms, every_s = 600, timeout_s = 300 }) {
    if (!session_id) throw new Error('session_id is required')
    if (until !== 'goal' && until !== 'turn') throw new Error('until must be goal or turn')
    if (typeof controller.projections !== 'function') throw new Error('This DeepSeek Harness version has no session projections, so its goals cannot be followed.')
    const every = Math.max(1, Number(every_s) || 600) * 1000
    const seconds = Number.isFinite(Number(timeout_s)) ? Math.min(Math.max(Number(timeout_s), 0), MAX_WAIT_S) : 300
    const deadline = Date.now() + seconds * 1000
    let mark = parseCursor(cursor)
    const since = !mark && Number(since_ms) > 0 ? Number(since_ms) : null
    let sawGoal = false
    for (;;) {
      // Followed from now on (a question that comes while the log is read is taken up), and
      // the events so far, to tell whether one came during the read.
      followedUntil.set(session_id, Date.now() + 60_000)
      const gen = eventGen.get(session_id) ?? 0
      const [goal, log] = await Promise.all([goalOf(session_id), sessionLog(session_id)])
      const { ended, running, runningSince } = turnsOf(log?.events)
```

</details>

**依据 4 · 源码核查**：[host/lib/index.js:1292-1327](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L1292-L1327)

wait 分别返回问题、超时和可能附带的 goal。

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

#### 缺口

- 未测并发写日志、空页和长历史下的实际返回
  **影响**：日志覆盖与等待耗时仍待验证
  **进一步探讨**：用固定页长跨页生成历史，同时追加消息并检查 seq 与回执

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启用、停止与退出交接分别写入什么，谁负责处理失败？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑、采用判断

#### 完整回答

Host 需要匹配的 MCP 依赖及 DSH 会话服务，默认自动注册到外部客户端，需先备份用户配置或用 AUTO_REGISTER 关闭，再由外端检查实际连接。run 本地以临时文件后重命名写入；重启扫描可将活动 run 标成 interrupted，不能替代对工作区写入的检查。取消调用会停止整个会话活动、对同会话接收项 settle，并核对队列；仍忙时回执暴露 still_busy。回滚项目变更需依赖项目自己的 Git，移除外端注册还须执行卸载指引。初次增加版本和配置核对，日常增加回执查阅，异常仍要人工接管；原模型成本及单位合格任务人时未测。

#### 证据与依据

**依据 1 · 源码核查**：[host/package.json:22-35](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/package.json#L22-L35)

固定 MCP 依赖版本和最低 DSH 声明。

<details>
<summary>查看原文（14行）</summary>

```text
  "dependencies": {
    "dsh-baton-mcp": "0.6.13"
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
```

</details>

**依据 2 · 源码核查**：[host/lib/index.js:251-298](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L251-L298)

run 通过临时文件持久化，活动记录重启时标为 interrupted。

<details>
<summary>查看原文（48行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[host/lib/index.js:1350-1377](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L1350-L1377)

取消为会话级并回报仍忙及队列信息。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[host/lib/index.js:1461-1482](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L1461-L1482)

自动注册默认启用，结果保存在注册状态。

<details>
<summary>查看原文（22行）</summary>

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
  }
```

</details>

**依据 5 · 作者声明**：[host/README.md:23-25](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/README.md#L23-L25)

作者说明卸载后另移除外端注册。

```text
## Remove / 卸载

Uninstall, then run `npx -y dsh-baton-mcp setup --remove`. / 卸载插件后运行 `npx -y dsh-baton-mcp setup --remove`。
```

#### 缺口

- 未验收 Windows 管道 ACL、自动注册写入与异常卸载
  **影响**：不清楚目标环境能否完全恢复原配置
  **进一步探讨**：隔离用户下对照注册文件、管道访问和卸载后配置

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试验把未知终态独立标出是否真的减少误接收？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可在单一隔离仓库选择一项可用固定测试验收的交接任务，先记录手工复制和当前回执的错误确认数，再模拟后台查询失败、续接已忙会话、取消仍忙和宿主重启。假设：将 completed + error 单列为未确认静止，并把项目验收单独记录，可减少过早复用未完成结果。若操作者已稳定读取错误字段，或显式状态只提高跟进时间却不降低误判，则放弃假设。现有版先选单一会话试用并分别记录 run、活动、变更与测试；出现仍忙或活动未知就暂停自动续接，人工在 Host 检查。

#### 证据与依据

**依据 1 · 源码核查**：[host/lib/index.js:417-428](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L417-L428)

后端未知时可返回 completed 附错误，构成显式未知态的比较基线。

<details>
<summary>查看原文（12行）</summary>

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
      }
      return
```

</details>

**依据 2 · 源码核查**：[host/lib/index.js:1350-1377](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L1350-L1377)

会话取消仍忙字段可用于故障注入的观察。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 发送者标签怎样与 0.2.2 前后的普通消息和 steering 渲染共存？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用、采用判断

#### 完整回答

Host 在 requestId 中编码经过正则限制的 sender，客户端读取 source.rpcId 的 baton 或早期 bridge 前缀，据此展示名称。这是来源提示，不校验发送方身份，也不证明任务已执行。若用户消息注册项声明 conversation.chat.user.before 子槽，插件用该槽的 source 渲染标签，不包装普通消息。无该槽的旧宿主仍包装普通消息，steering 一直使用包装。包装从同 key 的其他非字符串组件中按优先级选择 Inner；找不到时直接返回 null，因此该分支可能无法显示内容。若 renderSlotChain 已有则保留，缺失时给 Inner 一个空实现以满足新版渲染器的函数依赖。试用应核对有标签和无标签的正文都能正常渲染，普通消息与 steering 分别测试，兼容性问题时禁用插件的界面路径并从会话事件核对交接。

#### 证据与依据

**依据 1 · 源码核查**：[host/lib/index.js:30-34](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L30-L34)

Host 将 sender 写入 requestId。

```text
const PERSIST_DELAY_MS = 1000
// A relayed prompt's request id carries its sender ("dsh-baton.<sender>.<uuid>"), so the
// client half (lib/client.js) can label the message in the chat without any extra state.
const SENDER_RE = /^[a-z0-9-]{1,32}$/
const requestIdFor = (sender) => (sender ? `dsh-baton.${sender}.${crypto.randomUUID()}` : crypto.randomUUID())
```

**依据 2 · 源码核查**：[host/lib/index.js:1198-1208](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/index.js#L1198-L1208)

sender 正则只验证形式，Team 和 mode 另行检查。

<details>
<summary>查看原文（11行）</summary>

```text
  async function send({ message, session_id, cwd, workspace_id, mode: asked, sender, model, reasoning_effort, team }) {
    if (!message || !message.trim()) throw new Error('message is required')
    if (asked != null && asked !== 'followup' && asked !== 'steer') throw new Error('mode must be followup or steer')
    if (team != null && typeof team !== 'boolean') throw new Error('team must be true or false')
    // Checked before a new session is made, so a Harness without them is left as it was.
    if (team != null && typeof teamsService?.setEnabled !== 'function') throw new Error(`Nothing was sent: ${TEAMS_UNSUPPORTED}`)
    // Without a mode, a message to a busy session does what Harness's own busy-send setting says.
    const fromHarness = asked == null ? harnessBusyMode() : null
    const mode = asked ?? fromHarness ?? 'followup'
    const modeSource = asked != null ? 'explicit' : fromHarness ? 'harness' : 'default'
    if (sender != null && !SENDER_RE.test(sender)) throw new Error('sender must be 1-32 characters of a-z, 0-9 or -')
```

</details>

**依据 3 · 源码核查**：[host/lib/client.js:26-33](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/client.js#L26-L33)

包装键和识别的 RPC 前缀、展示名。

```text
    const SLOT = 'conversation.chat.node'
    const KEYS = ['user', 'steering']
    const PRIORITY = -100
    const NS = 'dsh-baton'
    // dsh-bridge: messages sent before the project was renamed.
    const RPC_RE = /^dsh-(?:baton|bridge)\.([a-z0-9-]{1,32})\./
    // Codex shows as ChatGPT, the way the ChatGPT app labels its own cross-chat messages.
    const NAMES = { claude: 'Claude', codex: 'ChatGPT' }
```

**依据 4 · 源码核查**：[host/lib/client.js:155-161](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/client.js#L155-L161)

客户端从 source.rpcId 获取 sender。

```text
    function senderFrom(source) {
      const rpcId = source?.rpcId
      const m = typeof rpcId === 'string' ? RPC_RE.exec(rpcId) : null
      return m ? m[1] : null
    }
    const senderOf = (node) => senderFrom(node?.data?.source)
    const nameOf = (sender) => NAMES[sender] ?? sender.charAt(0).toUpperCase() + sender.slice(1)
```

**依据 5 · 源码核查**：[host/lib/client.js:191-209](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/client.js#L191-L209)

选择 Inner，缺失直接返回 null，并补 renderSlotChain 空实现。

<details>
<summary>查看原文（19行）</summary>

```text
    // The renderer this wrapper shadows: the best-ranked entry for the key that is not ours.
    function shipped(ctx, key, own) {
      return ctx.slots.entries(SLOT)
        .filter((e) => e.options?.key === key && e.component !== own && typeof e.component !== 'string')
        .sort((a, b) => (a.options?.priority ?? 0) - (b.options?.priority ?? 0))[0]?.component
    }

    function wrapperFor(ctx, key, t) {
      function DshBatonUserMessage(props) {
        const Inner = shipped(ctx, key, DshBatonUserMessage)
        if (!Inner) return null
        // Harness 0.2.2 hands each renderer the chain renderer of its own registration; a wrapper
        // has none to pass on, so the shipped renderer gets one that draws nothing.
        const inner = h(Inner, props.renderSlotChain ? props : { ...props, renderSlotChain: () => null })
        const sender = senderOf(props.node)
        if (!sender) return inner
        return h('div', { style: { display: 'flex', flexDirection: 'column' } },
          h(Label, { sender, text: t('sentFrom', { name: nameOf(sender) }) }),
          inner)
```

</details>

**依据 6 · 源码核查**：[host/lib/client.js:214-239](https://github.com/JialaoLiu/dsh-baton/blob/eeedd0e3855bcf2798bdc72180f87d8761c21f35/host/lib/client.js#L214-L239)

探测子槽，普通 user 有槽即跳过包装，steering 仍包装。

<details>
<summary>查看原文（26行）</summary>

```text
    // Harness 0.2.2 and later: the chat declares a seat above each user message (BEFORE) and
    // hands it the message's source, so the label sits there and the user renderer is left alone.
    // Steering messages do not get that seat, so they keep the wrapper.
    const BEFORE = 'conversation.chat.user.before'
    const seatsBefore = (e) => e?.options?.key === 'user' && !!(e.children?.[BEFORE] ?? e.options?.children?.[BEFORE])
    function beforeLabel(t) {
      return function DshBatonSender({ matched }) {
        return h(Label, { sender: matched, text: t('sentFrom', { name: nameOf(matched) }) })
      }
    }

    module.exports.name = 'dsh-baton-host'
    module.exports.inject = ['slots', 'locale']
    module.exports.apply = function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-baton: dictionaries')
      const t = ctx.locale.bind(NS)
      ctx.slots.inject(SLOT, function* () {
        const seated = ctx.slots.entries(SLOT).some(seatsBefore)
        // locale 'chat': the shipped renderer reads its strings through the `t` it is handed.
        for (const key of KEYS) {
          if (key === 'user' && seated) continue
          yield ctx.slots.register({ name: SLOT, key, priority: PRIORITY, locale: 'chat' }, wrapperFor(ctx, key, t))
        }
      })
      // Runs only in a Harness that declares the seat; older ones never declare it.
      ctx.slots.inject(BEFORE, () => ctx.slots.register({ name: BEFORE, select: ({ source }) => senderFrom(source) }, beforeLabel(t)))
```

</details>

#### 缺口

- 未验收真实 0.2.1/0.2.2 槽位或其他 UI 插件的排序
  **影响**：不能确认每一布局都保留正文和唯一标签
  **进一步探讨**：对两版宿主发送带和不带 sender 的普通及 steering 消息，并覆盖无 Inner 与已有链渲染器

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
