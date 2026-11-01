# AgentRQ

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f220e2a](https://github.com/agentrq/agentrq/tree/f220e2a2b2c8e8b479bfb14e6d333671369456c0)

<!-- BEGIN META -->
[![GitHub ★ 1,175](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C175&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentrq/agentrq)
<!-- END META -->

> **功能**：为人类与 AI Agent 提供共享工作区、任务和协作入口。

> **亮点**：将任务状态与 Agent 消息及权限请求接入共享工作区。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：任务 done 是状态事件，不证明产物和测试已验收；工作区及机器权限需实际验证。[Q03](#research-q03)

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
  - [Q01 · 共享任务板相比聊天和普通看板增加什么？](#detail-section-11)
  - [Q02 · 工作区写入和审批怎样约束？](#detail-section-12)
  - [Q03 · 任务 Done 是否等于成果已经验收？](#detail-section-13)
  - [Q04 · 如何低风险采用与恢复？](#detail-section-14)
  - [Q05 · 能否以成果证据改进完成判断？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要协调多个 Agent 与人类的团队；基线是聊天与普通任务看板。[Q01](#research-q01)

在聊天和看板间手工分派、记录状态并审核结果。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 共享任务 | 分派和状态 | 状态不证明成果 |
| 工作区授权 | 限制任务写入 | 其他路径须验证 |
| 权限等待 | 人工响应敏感操作 | 超时会取消 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| AgentRQ 后端与身份 | 必需 | 任务工作区 | 不开放 |
| MCP 客户端和 Agent 机器 | 自动任务需要 | 接收与执行 | 手工处理 |
| 独立验收 | 完成必需 | 核对产物 | 不判完成 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 建立隔离工作区 | 核对授权 |
| 分派 | 低副作用任务 | 审批与状态可追溯 |
| 验收 | 检查产物 | 未通过不完成 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务和机器资源 | 身份配置 | 部署未测 |
| 持续 | 模型及服务费用未知 | 审批与验收 | 效率未测 |
| 恢复 | 断线任务资源 | 对账 | 状态不证明成果 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工作区 | 代表写入核对身份 | 所有接口隔离 |
| 完成状态 | 更新并发布事件 | 产物已验收 |

> **思考**：任务 done 是状态事件，不证明产物和测试已验收；工作区及机器权限需实际验证。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将任务状态与 Agent 消息及权限请求接入共享工作区。[Q01](#research-q01) [Q02](#research-q02)

任务写入绑定 workspace/owner；ACP 权限请求超时取消，完成状态不校验产物。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

任务 done 是状态事件，不证明产物和测试已验收；工作区及机器权限需实际验证。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离工作区先核验授权、审批和产物；不明状态停用远程操作。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定 Go 源码支持代表任务写入和 ACP 等待路径；未运行服务或模型。

- 已检查：作者 README、包清单、源码路径 README.md、backend/internal/app/workspace_task.go、backend/internal/controller/acpv1/permission.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 652 个指定扩展名文件、无排除或解析错误；额外按需检查固定 Go 对象，不运行目标。
- 下一步：固定服务与客户端，在隔离工作区验证身份、审批、断线和成果验收。

**分析版本**

- **仓库**：[agentrq/agentrq](https://github.com/agentrq/agentrq)
- **版本号**：未声明（[固定提交 f220e2a](https://github.com/agentrq/agentrq/tree/f220e2a2b2c8e8b479bfb14e6d333671369456c0)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：为完成状态附可核对产物与验收记录可降低误完结；须对照现有流程。[Q05](#research-q05)

固定服务与客户端，在隔离工作区验证身份、审批、断线和成果验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 107 | 12132 | — | — | 102388 |
| .js | source | 220 | 40419 | 22117 | 14756 | — |
| .js | test | 283 | 68265 | 52569 | 6157 | — |
| .mjs | source | 20 | 3692 | 2502 | 835 | — |
| .js | example | 12 | 3073 | 1884 | 761 | — |
| .md | example | 1 | 92 | — | — | 1019 |
| .ts | source | 7 | 1294 | 692 | 505 | — |
| .ts | test | 2 | 1029 | 780 | 44 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/agentrq/agentrq/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/agentrq/agentrq/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/agentrq/agentrq/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：共享任务板如何约束工作区与审批，任务完成是否等于成果验收？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 共享任务板相比聊天和普通看板增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要人和多个 Agent 协作任务的团队可使用共享工作区、任务状态和消息，将 Agent 操作与人类查看放在同一流程；基线是聊天记录加手工看板。作者描述 Agent 通过 MCP 拉取任务并请求权限，这提供接线但未证明任务质量或协作效率。DSH 集成插件是独立路径，根项目是协作平台。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-18](https://github.com/agentrq/agentrq/blob/f220e2a2b2c8e8b479bfb14e6d333671369456c0/README.md#L12-L18)

作者描述任务与 MCP。

```text
AgentRQ is a modern, high-performance platform designed for seamless collaboration between human operators and AI agents. It leverages the **Model Context Protocol (MCP)** to allow AI models (like Claude) to interact directly with your workspace's task management system.

## 🚀 Overview

Think of AgentRQ as a shared workspace where humans and AI agents work together seamlessly. You can break down complex goals into manageable tasks, and delegate work directly to your AI agents. 

Because agents "see" the workspace state via MCP, they can autonomously pull their assigned tasks, update statuses, request permissions for sensitive actions, and communicate with you—all synchronized instantly across the platform in real-time.
```

**依据 2 · 作者声明**：[README.md:670-677](https://github.com/agentrq/agentrq/blob/f220e2a2b2c8e8b479bfb14e6d333671369456c0/README.md#L670-L677)

作者描述 DSH 独立 profile 集成。

````text
**Installation:**
```bash
npx @deepseek-ai/dsh plugin --profile agentrq-<workspace> add @agentrq/dsh-plugin-agentrq
# pin this workspace's MCP URL in ~/.dsh/profiles/agentrq-<workspace>/cordis.patch.yml
npx @deepseek-ai/dsh --profile agentrq-<workspace>
```

Copy the filled-in commands and config block from **Workspace Settings → Setup → DeepSeek Harness**. A dsh profile serves one workspace and carries its own endpoint, so run one profile per workspace and switching workspaces is switching profiles. Delivery, startup catch-up, and reconnect behavior are configurable; see the [plugin README](plugins/deepseek-harness/README.md).
````

#### 缺口

- 未运行服务、机器守护进程、DSH 或模型
  **影响**：不能证明租户隔离、审批链和业务完成
  **进一步探讨**：固定服务与客户端，用隔离工作区验证状态和权限

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区写入和审批怎样约束？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工作区任务写入前读取任务，检查 workspace ID 和 owner，不匹配按不存在拒绝；ACP 权限处理对自身工作区工具有专门允许路径，其余请求绑定 session 和 tool call 等待结果。请求重复时旧等待被取消；超时会通知取消该 session，并清理待决请求。源码只覆盖代表路径，不能断言所有接口和部署均无越权。

#### 证据与依据

**依据 1 · 源码核查**：[backend/internal/app/workspace_task.go:19-34](https://github.com/agentrq/agentrq/blob/f220e2a2b2c8e8b479bfb14e6d333671369456c0/backend/internal/app/workspace_task.go#L19-L34)

任务写前验证 workspace 与 owner。

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

**依据 2 · 源码核查**：[backend/internal/controller/acpv1/permission.go:39-69](https://github.com/agentrq/agentrq/blob/f220e2a2b2c8e8b479bfb14e6d333671369456c0/backend/internal/controller/acpv1/permission.go#L39-L69)

会话和工具绑定及重复请求处理。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[backend/internal/controller/acpv1/permission.go:79-110](https://github.com/agentrq/agentrq/blob/f220e2a2b2c8e8b479bfb14e6d333671369456c0/backend/internal/controller/acpv1/permission.go#L79-L110)

等待、超时取消及清理。

<details>
<summary>查看原文（32行）</summary>

```text
	e.ws.HandlePermissionRequest(ctx, e.linkID, agentlink.PermissionRequest{
		RequestID: requestID, TaskID: b62(e.taskOf(s)),
		ToolName: title, Description: title, InputPreview: inputPreview(rawInput), ToolCallRowID: row,
	})

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

- 未运行服务、机器守护进程、DSH 或模型
  **影响**：不能证明租户隔离、审批链和业务完成
  **进一步探讨**：固定服务与客户端，用隔离工作区验证状态和权限

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 任务 Done 是否等于成果已经验收？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

代表状态更新函数查询工作区任务后直接设置 status 并发布事件，completed/done 触发完成通知；该路径没有看到对产物、测试或人工验收的要求。任务状态可作为协作信号，不能单凭它证明代码或外部业务完成。权限等待解决操作批准，不自动检查结果；各任务仍需独立验收。

#### 证据与依据

**依据 1 · 源码核查**：[backend/internal/app/workspace_task.go:37-75](https://github.com/agentrq/agentrq/blob/f220e2a2b2c8e8b479bfb14e6d333671369456c0/backend/internal/app/workspace_task.go#L37-L75)

状态写入和完成事件。

<details>
<summary>查看原文（39行）</summary>

```text
// setAgentTaskStatus is an agent's status change. The row only, like
// workspaceTask: a save never needs the history (#921).
//
// No "Status updated to" message in the thread: the change is recorded as a
// state transition and shown in the task's timeline.
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

**依据 2 · 源码核查**：[backend/internal/controller/acpv1/permission.go:79-110](https://github.com/agentrq/agentrq/blob/f220e2a2b2c8e8b479bfb14e6d333671369456c0/backend/internal/controller/acpv1/permission.go#L79-L110)

审批等待与超时取消。

<details>
<summary>查看原文（32行）</summary>

```text
	e.ws.HandlePermissionRequest(ctx, e.linkID, agentlink.PermissionRequest{
		RequestID: requestID, TaskID: b62(e.taskOf(s)),
		ToolName: title, Description: title, InputPreview: inputPreview(rawInput), ToolCallRowID: row,
	})

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

- 未运行服务、机器守护进程、DSH 或模型
  **影响**：不能证明租户隔离、审批链和业务完成
  **进一步探讨**：固定服务与客户端，用隔离工作区验证状态和权限

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何低风险采用与恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需后端、身份、MCP 客户端和实际运行 Agent 的机器或服务；多人共享前应验证租户、工作区和机器授权。先用隔离工作区与无副作用任务检查状态、权限超时及机器断线；完成必须附独立可核产物，异常时停止远程操作并回到原有看板。服务、模型和人工审核成本未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-18](https://github.com/agentrq/agentrq/blob/f220e2a2b2c8e8b479bfb14e6d333671369456c0/README.md#L12-L18)

作者描述协作及权限。

```text
AgentRQ is a modern, high-performance platform designed for seamless collaboration between human operators and AI agents. It leverages the **Model Context Protocol (MCP)** to allow AI models (like Claude) to interact directly with your workspace's task management system.

## 🚀 Overview

Think of AgentRQ as a shared workspace where humans and AI agents work together seamlessly. You can break down complex goals into manageable tasks, and delegate work directly to your AI agents. 

Because agents "see" the workspace state via MCP, they can autonomously pull their assigned tasks, update statuses, request permissions for sensitive actions, and communicate with you—all synchronized instantly across the platform in real-time.
```

**依据 2 · 源码核查**：[backend/internal/app/workspace_task.go:19-34](https://github.com/agentrq/agentrq/blob/f220e2a2b2c8e8b479bfb14e6d333671369456c0/backend/internal/app/workspace_task.go#L19-L34)

工作区绑定检查。

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

**依据 3 · 源码核查**：[backend/internal/controller/acpv1/permission.go:84-110](https://github.com/agentrq/agentrq/blob/f220e2a2b2c8e8b479bfb14e6d333671369456c0/backend/internal/controller/acpv1/permission.go#L84-L110)

审批超时与取消。

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

- 未运行服务、机器守护进程、DSH 或模型
  **影响**：不能证明租户隔离、审批链和业务完成
  **进一步探讨**：固定服务与客户端，用隔离工作区验证状态和权限

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否以成果证据改进完成判断？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：完成状态附上可验证产物、检查结果和验收人，可降低把状态当成果的误判。现有状态事件、工作区权限和审批是反证，额外证据不能自动证明其真实性。对照现有看板，用未产出、失败测试和重复任务样本测误完结率、审核时间、隐私及存储成本；无改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[backend/internal/app/workspace_task.go:42-75](https://github.com/agentrq/agentrq/blob/f220e2a2b2c8e8b479bfb14e6d333671369456c0/backend/internal/app/workspace_task.go#L42-L75)

已有状态更新和完成事件。

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

**依据 2 · 源码核查**：[backend/internal/controller/acpv1/permission.go:79-110](https://github.com/agentrq/agentrq/blob/f220e2a2b2c8e8b479bfb14e6d333671369456c0/backend/internal/controller/acpv1/permission.go#L79-L110)

已有权限等待。

<details>
<summary>查看原文（32行）</summary>

```text
	e.ws.HandlePermissionRequest(ctx, e.linkID, agentlink.PermissionRequest{
		RequestID: requestID, TaskID: b62(e.taskOf(s)),
		ToolName: title, Description: title, InputPreview: inputPreview(rawInput), ToolCallRowID: row,
	})

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

- 未运行服务、机器守护进程、DSH 或模型
  **影响**：不能证明租户隔离、审批链和业务完成
  **进一步探讨**：固定服务与客户端，用隔离工作区验证状态和权限

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
