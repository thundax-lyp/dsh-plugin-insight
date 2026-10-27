# AgentRQ

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[daecd6f](https://github.com/agentrq/agentrq/tree/daecd6f664f821cbe08b72016a532e25d6370f45)

<!-- BEGIN META -->
[![GitHub ★ 1,169](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C169&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentrq/agentrq)
<!-- END META -->

> **功能**：以共享任务板、MCP/ACP、权限请求和机器接入组织人工与多 Agent 协作。

> **亮点**：把Agent任务回写、人工审批和机器状态纳入同一工作区，减少在看板与聊天间手工同步；不证明任务真正完成。[Q01](#research-q01)

> **主要限制**：完成事件随Agent状态done/completed触发，所读路径不核产物，不能把卡片和事件当发布放行；审批也不能当OS沙箱。[Q03](#research-q03)

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
  - [Q01 · 共享任务板相对聊天和普通看板增加什么？](#detail-section-11)
  - [Q02 · 工作区任务、机器身份与审批怎样接线？](#detail-section-12)
  - [Q03 · 为什么任务Done和可远程运行仍不足以支撑生产协作？](#detail-section-13)
  - [Q04 · 如何小范围试用并验证证据驱动完成是否有增量？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多Agent和人工负责人共享任务、阻塞与工具轨迹；Done需要产物验收。[Q01](#research-q01)

普通任务板加人工抄状态/聊天；平台减少交接操作但增加服务、身份与Agent协议维护。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 共享任务 | 人机状态和消息 | 产物需独立验收 |
| ACP权限 | 请求、等待和取消 | 部分自有工具可自动allow |
| 机器接入 | token身份和心跳 | 非OS隔离/高可用证明 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Go/Node和服务配置 | 自托管必需 | 平台后端/前端 | 按固定部署规范核查 |
| OAuth与稳定JWT秘密 | 用户登录必需 | 身份会话 | 不直接用开发临时值生产化 |
| MCP/ACP Agent | 协作必需 | 取任务和权限 | 单看板不能自动执行 |
| daemon/机器token | 远程机器才需 | 执行与心跳 | 身份不明停止派发 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 用户建测试workspace和身份 | 核任务与机器owner |
| 派发 | Agent只读任务并请求权限 | 等待/取消状态一致 |
| 验收 | 负责人核产物和轨迹 | Done不自动发布 |
| 回退 | 用户停自动联动 | 普通看板人工验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Go/Node、OAuth、服务和机器 | 配身份、工作区和Agent | 部署耗时未知 |
| 持续使用 | 机器、模型、日志与服务 | 审批和产物核查 | 单任务成本未知 |
| 失败恢复 | 重启/断线和备份资源 | 核权限等待、重复任务和副作用 | 多实例未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 协作可见性 | 任务归属、消息和状态 | 实际交付效率 |
| 权限等待 | once与超时清理 | Agent不绕审批全链 |
| 完成事件 | 随done状态发布 | 产物合格和幂等副作用 |

> **思考**：完成事件随Agent状态done/completed触发，所读路径不核产物，不能把卡片和事件当发布放行；审批也不能当OS沙箱。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把Agent任务回写、人工审批和机器状态纳入同一工作区，减少在看板与聊天间手工同步；不证明任务真正完成。[Q01](#research-q01)

任务owner核查、token仅存哈希及权限一次回答可借鉴；迁移要验证协议所有权及断线重入，不依赖UI动画推断可靠性。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

完成事件随Agent状态done/completed触发，所读路径不核产物，不能把卡片和事件当发布放行；审批也不能当OS沙箱。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议有自托管能力和人工负责人的团队用非敏感只读任务试用，不从Done联动生产；归属、重复或产物不明时回普通看板人工验收。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

归属检查与权限生命周期有源码支持；多实例/机器恢复与业务产物验收未运行。证据绑定完成事件是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、backend/internal/app/workspace_task.go、backend/internal/controller/machine/auth.go、backend/internal/controller/acpv1/permission.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定README、Go任务归属/状态、机器认证及ACP权限；未全审OAuth、调度器、所有daemon和多实例，未执行服务/测试/Agent。Go不计JS/TS LOC。
- 下一步：固定双Agent任务注入断线/重复/权限超时，另比四类证据完成事件；本轮未执行。[Q04](#research-q04)

**分析版本**

- **仓库**：[agentrq/agentrq](https://github.com/agentrq/agentrq)
- **版本号**：未声明（[固定提交 daecd6f](https://github.com/agentrq/agentrq/tree/daecd6f664f821cbe08b72016a532e25d6370f45)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是在完成事件前绑定任务特定证据和摘要，比较错误下游触发、误阻及人工投入。[Q04](#research-q04)

固定双Agent任务注入断线/重复/权限超时，另比四类证据完成事件；本轮未执行。[Q04](#research-q04)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 65 | 12029 | — | — | 103083 |
| .js | source | 226 | 41507 | 23025 | 14841 | — |
| .js | test | 290 | 70647 | 54647 | 6345 | — |
| .mjs | source | 40 | 6523 | 4451 | 1489 | — |
| .mjs | test | 2 | 191 | 152 | 26 | — |
| .js | example | 12 | 3073 | 1884 | 761 | — |
| .md | example | 1 | 92 | — | — | 1019 |
| .ts | source | 7 | 1294 | 692 | 505 | — |
| .ts | test | 2 | 1029 | 780 | 44 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/agentrq/agentrq/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/agentrq/agentrq/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/agentrq/agentrq/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：共享任务平台怎样绑定任务、身份和审批，完成事件能否代表业务交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 共享任务板相对聊天和普通看板增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

多Agent与人工共同推进任务时，需要知道谁在做、等什么授权及工具实际做过什么。AgentRQ把任务、消息、权限请求、工具历史和远程机器组织成共享工作区，并让Agent经MCP参与。相对普通看板手动抄状态，它增加Agent主动取任务/回写及人工答复通道；相对原生单会话聊天，它保存跨任务协作视图。合格结果仍是业务产物与验收证据匹配，卡片到Done只是状态。README动画是示意，不能作为真实多Agent完成率、低延迟或授权不可绕过证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-21](https://github.com/agentrq/agentrq/blob/daecd6f664f821cbe08b72016a532e25d6370f45/README.md#L11-L21)

共享工作区、MCP与示意图定位。

<details>
<summary>查看原文（11行）</summary>

```text

AgentRQ is a modern, high-performance platform designed for seamless collaboration between human operators and AI agents. It leverages the **Model Context Protocol (MCP)** to allow AI models (like Claude) to interact directly with your workspace's task management system.

## 🚀 Overview

Think of AgentRQ as a shared workspace where humans and AI agents work together seamlessly. You can break down complex goals into manageable tasks, and delegate work directly to your AI agents. 

Because agents "see" the workspace state via MCP, they can autonomously pull their assigned tasks, update statuses, request permissions for sensitive actions, and communicate with you—all synchronized instantly across the platform in real-time.

<p align="center">
  <img src="docs/assets/readme/task-board.svg" width="1200" alt="AgentRQ task board: you add five tasks and five agents, claude, codex, agy, hermes and openclaw, each pick up their own. Cards move from Not Started to Ongoing; codex asks a question and its card turns Blocked until you click Allow; then every card lands in Done and the agents celebrate." />
```

</details>

**依据 2 · 作者声明**：[README.md:78-93](https://github.com/agentrq/agentrq/blob/daecd6f664f821cbe08b72016a532e25d6370f45/README.md#L78-L93)

作者描述工具历史和时间线。

<details>
<summary>查看原文（16行）</summary>

```text
</tr>
<tr>
<td colspan="2" valign="middle">

### Task Timeline

Under every task, a timeline shows each status it has been in and for how long: a dot per change, with the time spent on the line to the next, stretches waiting on you in yellow and blocked ones in red. Above it, the totals say which agent worked on it and for how long, how long it was blocked or waited for your input, and how long it took from start to close. Every status change is recorded with the task itself, so nothing moves without leaving a dot.

<img src="docs/assets/readme/task-timeline.svg" width="1200" alt="AgentRQ task timeline: under a task, a dot lands for every status it enters, with the time spent on the line to the next. claude picks up Migrate users table, waits on you to allow a command (a yellow needs-input stretch), later is blocked until you reply (a red stretch), and completes it; the totals read claude-code worked 14m, blocked 3m, needs input 2m, start to close 19m, and claude celebrates." />

</td>
</tr>
<tr>
<td colspan="2" valign="middle">

### Speech-to-Text
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区任务、机器身份与审批怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Agent任务写入先调用workspaceTask，核WorkspaceID和UserID匹配，避免单凭task存在跨空间回写。机器token按哈希查库、常量时间复核及enabled检查，并返回MachineID/UserID，心跳和释放带instanceID；这是具体身份绑定，但未全链验证多实例故障。ACP权限请求经过workspace pipeline，待选项通过once只回答一次，同请求替换取消旧等待，超时取消会话并关闭权限卡；部分识别为本工作区自有工具会直接allow，所以不能概括所有操作都需人工批准。值得借鉴是任务归属检查与权限等待生命周期显式化；移植需Agent协议和宿主工具所有权识别。

#### 证据与依据

**依据 1 · 源码核查**：[backend/internal/app/workspace_task.go:19-34](https://github.com/agentrq/agentrq/blob/daecd6f664f821cbe08b72016a532e25d6370f45/backend/internal/app/workspace_task.go#L19-L34)

写前核任务workspace和owner。

<details>
<summary>查看原文（16行）</summary>

```text
// workspaceTask reads a task an agent named, and refuses one outside the
// workspace its MCP server serves. Every write an agent makes against a task
// passes here first: the database only checks that the task exists, so without
// it one workspace's token could post into any task, in any workspace.
//
// The row only: it runs on every tool call, and a long run's task holds
// thousands of messages and tool calls (#921).
func workspaceTask(ctx context.Context, repo base.Repository, workspaceID int64, owner string, taskID int64) (model.Task, error) {
	t, err := repo.SystemGetTask(ctx, taskID)
	if err == nil && (t.WorkspaceID != workspaceID || t.UserID != monoflake.IDFromBase62(owner).Int64()) {
		err = base.ErrNotFound
	}
	if errors.Is(err, base.ErrNotFound) {
		return model.Task{}, fmt.Errorf("task %s is not in this workspace", monoflake.ID(taskID).String())
	}
	return t, err
```

</details>

**依据 2 · 源码核查**：[backend/internal/controller/machine/auth.go:31-73](https://github.com/agentrq/agentrq/blob/daecd6f664f821cbe08b72016a532e25d6370f45/backend/internal/controller/machine/auth.go#L31-L73)

token哈希、启用与instance归属。

<details>
<summary>查看原文（43行）</summary>

```text
// AuthenticateMachine turns a presented token into the machine that holds it.
//
// The lookup is by hash because that is all that is stored — the token itself
// was returned once, at enrolment, and never kept.
func (a StoreAuthenticator) AuthenticateMachine(ctx context.Context, token string) (Identity, error) {
	if token == "" {
		return Identity{}, ErrNoToken
	}

	m, err := a.Store.GetMachineByTokenHash(ctx, HashSecret(token))
	if err != nil {
		// Including "not found". A token nobody holds and a database that is
		// down are both answered the same way here; the caller says only that
		// the token was not accepted.
		return Identity{}, ErrUnknownToken
	}

	// Belt and braces against a hash collision or a malformed stored row: the
	// lookup already matched on the hash, and this confirms it in constant
	// time rather than trusting the query alone.
	if !SecretMatches(m.TokenHash, token) {
		return Identity{}, ErrUnknownToken
	}

	// Disabled is reported separately, and that difference is deliberate. It
	// is the kill switch, and somebody who has just disabled a machine and is
	// watching it disconnect deserves to see why. An unknown token gets no
	// such explanation, because it would confirm something.
	if !m.Enabled {
		return Identity{}, fmt.Errorf("%w: machine %d", ErrMachineDisabled, m.ID)
	}

	return Identity{MachineID: m.ID, UserID: m.UserID}, nil
}

// Touch records a heartbeat and which instance holds the socket.
func (a StoreAuthenticator) Touch(ctx context.Context, machineID int64, at time.Time, instanceID string) error {
	return a.Store.TouchMachine(ctx, machineID, at, instanceID)
}

// Release clears the pairing, conditional on this instance still holding it.
func (a StoreAuthenticator) Release(ctx context.Context, machineID int64, instanceID string) error {
	return a.Store.ReleaseMachine(ctx, machineID, instanceID)
```

</details>

**依据 3 · 源码核查**：[backend/internal/controller/acpv1/permission.go:39-81](https://github.com/agentrq/agentrq/blob/daecd6f664f821cbe08b72016a532e25d6370f45/backend/internal/controller/acpv1/permission.go#L39-L81)

自有工具旁路与once回答、替换取消。

<details>
<summary>查看原文（43行）</summary>

```text
	s := e.sessionByID(req.SessionID)
	if s == nil {
		return cancelled, nil
	}
	known := s.proj.toolCall(req.ToolCall.ToolCallID)
	title, rawInput := describeToolCall(known, req.ToolCall)
	name := deref(req.ToolCall.Name)
	if name == "" {
		name = known.name
	}
	if _, ours := workspaceTool(title, name, e.ownServers(), e.ws.ToolNames()); ours {
		return requestPermissionResponse{Outcome: allowOwnTool(req.Options)}, nil
	}
	// The request owns the call's row from here: the one already recorded for
	// it, else the one the request records.
	s.proj.rows.Lock()
	row := s.proj.gate(req.ToolCall.ToolCallID)
	s.proj.rows.Unlock()

	requestID := e.linkID + ":" + req.SessionID + ":" + req.ToolCall.ToolCallID
	answer := make(chan permissionOutcome, 1)
	var once sync.Once
	p := &pendingPermission{sessionID: req.SessionID, options: req.Options,
		settle: func(o permissionOutcome) { once.Do(func() { answer <- o }) }}
	e.mu.Lock()
	earlier := e.permissions[requestID]
	e.permissions[requestID] = p
	e.mu.Unlock()
	if earlier != nil {
		// Asked again for the same call: the new question takes the card over.
		earlier.settle(cancelled.Outcome)
	}
	defer func() {
		e.mu.Lock()
		if e.permissions[requestID] == p {
			delete(e.permissions, requestID)
		}
		e.mu.Unlock()
	}()

	e.ws.HandlePermissionRequest(ctx, e.linkID, agentlink.PermissionRequest{
		RequestID: requestID, TaskID: b62(e.taskOf(s)),
		ToolName: title, Description: title, InputPreview: inputPreview(rawInput), ToolCallRowID: row,
```

</details>

**依据 4 · 源码核查**：[backend/internal/controller/acpv1/permission.go:84-110](https://github.com/agentrq/agentrq/blob/daecd6f664f821cbe08b72016a532e25d6370f45/backend/internal/controller/acpv1/permission.go#L84-L110)

超时/断线权限清理。

<details>
<summary>查看原文（27行）</summary>

```text
	var timeout <-chan time.Time
	if wait := e.permissionWait(); wait > 0 {
		t := time.NewTimer(wait)
		defer t.Stop()
		timeout = t.C
	}
	select {
	case o := <-answer:
		return requestPermissionResponse{Outcome: o}, nil
	case <-timeout:
		// The turn is cancelled as well as the call: "cancelled" is the answer
		// a client gives because it cancelled, and answering alone would leave
		// the agent free to carry on and ask again. Having cancelled, the spec
		// has every other request waiting on the session answered "cancelled".
		_ = e.peer.notify(methodSessionCancel, sessionIDParams{SessionID: req.SessionID})
		e.settleAfterCancel(s)
		for _, id := range e.settlePermissions(req.SessionID) {
			if id != requestID {
				e.ws.ClosePermissionRequest(context.WithoutCancel(ctx), id)
			}
		}
		e.ws.ClosePermissionRequest(context.WithoutCancel(ctx), requestID)
		return cancelled, nil
	case <-ctx.Done():
		// The agent withdrew the request, or the connection ended for good.
		e.ws.ClosePermissionRequest(context.WithoutCancel(ctx), requestID)
		return cancelled, nil
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么任务Done和可远程运行仍不足以支撑生产协作？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

setAgentTaskStatus接收状态并更新，done/completed触发完成事件，所读路径没有要求提交可执行产物或检查证明；因此自动事件工作流若把Done当发布合格，会放大Agent自报状态。MCP/ACP接线还依赖外部Agent正确申请权限，平台卡片不是任意本机进程的OS沙箱。首次自托管涉及Go、Node、OAuth、稳定JWT秘密、数据库/服务及机器daemon；持续投入是运行机器、模型、审批和日志复核，恢复要处理离线机器、重复任务和等待权限，金额/耗时均未知。根项目AGPL-3.0-only加商业选项，daemon和单独包Apache-2.0，不能用子包许可证概括服务根。

#### 证据与依据

**依据 1 · 源码核查**：[backend/internal/app/workspace_task.go:42-75](https://github.com/agentrq/agentrq/blob/daecd6f664f821cbe08b72016a532e25d6370f45/backend/internal/app/workspace_task.go#L42-L75)

状态更新与完成事件未绑定产物验收。

<details>
<summary>查看原文（34行）</summary>

```text
func setAgentTaskStatus(ctx context.Context, repo base.Repository, ps pubsub.Service, workspaceID int64, owner string, taskID int64, status string) (model.Task, error) {
	uid := monoflake.IDFromBase62(owner).Int64()
	m, err := repo.GetTaskRow(ctx, workspaceID, taskID, uid)
	if err != nil {
		return model.Task{}, err
	}
	if m.Status == status {
		return m, nil
	}
	m.Status = status

	updated, err := repo.UpdateTask(ctx, m, "Status")
	if err != nil {
		return updated, err
	}
	publish := func(action entity.Action) {
		ps.Publish(context.Background(), pubsub.PublishRequest{
			PubSubID: entity.PubSubTopicCRUD,
			Event: entity.CRUDEvent{
				Action:       action,
				WorkspaceID:  workspaceID,
				UserID:       uid,
				ResourceType: entity.ResourceTask,
				ResourceID:   updated.ID,
				Actor:        entity.ActorAgent,
				Origin:       entity.OriginMCP,
			},
		})
	}
	if updated.Status == "completed" || updated.Status == "done" {
		publish(entity.ActionTaskComplete)
	}
	publish(entity.ActionTaskUpdate)
	return updated, nil
```

</details>

**依据 2 · 作者声明**：[README.md:380-399](https://github.com/agentrq/agentrq/blob/daecd6f664f821cbe08b72016a532e25d6370f45/README.md#L380-L399)

自托管运行条件。

<details>
<summary>查看原文（20行）</summary>

````text
## 🛠 Getting Started

### Prerequisites
- **Go** 1.27.1+
- **Node.js** 18+ (with npm)
- **OpenSSL** if `make dev` needs to generate a local JWT secret
- **Google Cloud Console**: An OAuth2 Client ID and Secret.

### Configuration
1. Edit `backend/cmd/server/_config/base.yaml` (or `development.yaml`).
2. Fill in your Google OAuth2 credentials:

```yaml
auth:
  google:
    clientId: "your-google-client-id"
    clientSecret: "your-google-client-secret"
```

3. Set `AGENTRQ_AUTH_JWT_SECRET` to a stable random value (at least 32 characters) when starting the backend directly. In the default development mode, `make dev` generates and reuses a local value if the variable is absent.
````

</details>

**依据 3 · 作者声明**：[README.md:671-677](https://github.com/agentrq/agentrq/blob/daecd6f664f821cbe08b72016a532e25d6370f45/README.md#L671-L677)

根与子组件不同许可。

```text
## 📝 License
AgentRQ is dual-licensed:

- **Open source:** [AGPL-3.0-only](LICENSE).
- **Commercial:** a binary-only [commercial licence](LICENSE-COMMERCIAL) from Contextual, Inc., for proprietary use without the AGPL's obligations. Contact [hi@agentrq.com](mailto:hi@agentrq.com).

The [`agentrqd`](daemon) machine daemon, the desktop and `agentrqd` [install scripts](installers), and the separately published packages — the [`agentrq-ws`](cli/agentrq-ws) command-line client and the plugins under [`plugins/`](plugins) — keep their own Apache-2.0 licence.
```

#### 缺口

- 任务重复执行、机器离线恢复、实际Agent权限执行和多实例隔离未验收。
  **影响**：不能把状态板当严格业务放行或高可用调度保证。
  **进一步探讨**：固定双Agent任务，注入断线、重复完成和权限超时，核产物与副作用次数。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何小范围试用并验证证据驱动完成是否有增量？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有多Agent协作和明确人工负责人、能自托管的团队可限定非敏感只读任务试用，先核归属、等待权限和状态同步，最终由人查产物；不从Done触发生产部署。若越权任务可写、机器归属不清、重复副作用或Agent自报完成却无结果，应停自动联动，回普通看板加人工验收。未验证假设是在发完成事件前绑定任务特定验证结果与产物摘要；由Q03自报状态路径推导，可减少错误下游触发，但增加定义验收责任。最小对照用“有产物/无产物/旧证据/重复完成”四任务，比较现流程和验证原型的错误触发、阻塞正确任务与人工时间；若错误仍放行或确认负担高于收益，则否定。

#### 证据与依据

**依据 1 · 源码核查**：[backend/internal/app/workspace_task.go:51-75](https://github.com/agentrq/agentrq/blob/daecd6f664f821cbe08b72016a532e25d6370f45/backend/internal/app/workspace_task.go#L51-L75)

完成事件仅从状态变化触发，构成设计动因。

<details>
<summary>查看原文（25行）</summary>

```text
	m.Status = status

	updated, err := repo.UpdateTask(ctx, m, "Status")
	if err != nil {
		return updated, err
	}
	publish := func(action entity.Action) {
		ps.Publish(context.Background(), pubsub.PublishRequest{
			PubSubID: entity.PubSubTopicCRUD,
			Event: entity.CRUDEvent{
				Action:       action,
				WorkspaceID:  workspaceID,
				UserID:       uid,
				ResourceType: entity.ResourceTask,
				ResourceID:   updated.ID,
				Actor:        entity.ActorAgent,
				Origin:       entity.OriginMCP,
			},
		})
	}
	if updated.Status == "completed" || updated.Status == "done" {
		publish(entity.ActionTaskComplete)
	}
	publish(entity.ActionTaskUpdate)
	return updated, nil
```

</details>

**依据 2 · 源码核查**：[backend/internal/controller/acpv1/permission.go:84-110](https://github.com/agentrq/agentrq/blob/daecd6f664f821cbe08b72016a532e25d6370f45/backend/internal/controller/acpv1/permission.go#L84-L110)

权限超时是小范围验收路径。

<details>
<summary>查看原文（27行）</summary>

```text
	var timeout <-chan time.Time
	if wait := e.permissionWait(); wait > 0 {
		t := time.NewTimer(wait)
		defer t.Stop()
		timeout = t.C
	}
	select {
	case o := <-answer:
		return requestPermissionResponse{Outcome: o}, nil
	case <-timeout:
		// The turn is cancelled as well as the call: "cancelled" is the answer
		// a client gives because it cancelled, and answering alone would leave
		// the agent free to carry on and ask again. Having cancelled, the spec
		// has every other request waiting on the session answered "cancelled".
		_ = e.peer.notify(methodSessionCancel, sessionIDParams{SessionID: req.SessionID})
		e.settleAfterCancel(s)
		for _, id := range e.settlePermissions(req.SessionID) {
			if id != requestID {
				e.ws.ClosePermissionRequest(context.WithoutCancel(ctx), id)
			}
		}
		e.ws.ClosePermissionRequest(context.WithoutCancel(ctx), requestID)
		return cancelled, nil
	case <-ctx.Done():
		// The agent withdrew the request, or the connection ended for good.
		e.ws.ClosePermissionRequest(context.WithoutCancel(ctx), requestID)
		return cancelled, nil
```

</details>

#### 缺口

- 证据绑定能否减少错误联动尚无实际对照。
  **影响**：设计假设不计现有能力。
  **进一步探讨**：固定四类完成情形和下游计数做隔离实验。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
