# Yao Agents

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[07b5574](https://github.com/YaoApp/yao/tree/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644)

<!-- BEGIN META -->
[![GitHub ★ 8,280](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8%2C280&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/YaoApp/yao)
<!-- END META -->

> **功能**：自托管的 Agent、任务与工作区管理平台，通过自己的设备运行任务，并接入 DeepSeek Harness。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，Yao 把多机的工作区选择、任务配额与 DSH 进程启动放在同一服务中，减少人工搬运任务与节点信息的环节。

> **主要限制**：[Q03](#research-q03) 显示，缺少协议完成事件但干净退出的分支也可以在上层返回正常 stop。结合 [Q02](#research-q02) 的节点回退，流结束与正确节点上的业务交付需要分别核对。

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
  - [Q01 · 相比逐台运行 DSH，Yao 实际增加哪些任务控制？](#detail-section-11)
  - [Q02 · 工作区和节点如何绑定到 DSH 进程？](#detail-section-12)
  - [Q03 · 完成与取消怎么发生，哪些结果仍未知？](#detail-section-13)
  - [Q04 · 何时值得隔离试用，需要哪些资源和退路？](#detail-section-14)
  - [Q05 · 能否用节点、产物和取消回执减少误办结？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要协调多台机器工作区的开发团队，可以把任务登记、节点选择和 DSH 会话接在一起。

在各台机器手动运行 DSH，指定目录并用任务板追踪结果。单机或低频跨节点使用可能无需另建平台。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工作区和节点选择 | 将任务分配到指定运行环境 | 离线回退不保证已有文件可用 |
| DSH runner | 生成配置并启动流式会话 | 节点须能运行 tai dsh |
| 任务队列 | 按团队配额等待执行 | 任务状态不替代产物核验 |
| 停止与清理 | 尝试终止 DSH 流及进程 | 已发生的远端副作用需对账 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Yao 独立服务 | 任务控制需要 | 管理聊天、工作区和节点 | 回到单机工具 |
| 可用节点与 Tai 执行路径 | DSH runner 需要 | 在工作目录启动 tai dsh | 节点选择、准备或流执行失败 |
| box 镜像 | 选择 box 时 | 准备容器运行环境 | 拉取或创建失败 |
| 模型凭据与工作区权限 | 目标任务需要 | 推理和数据访问 | 不继续真实任务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者在隔离节点绑定测试工作区 | 核对节点、目录和模型 |
| 执行 | 操作者派发一项公开样例 | 按文件和回执验收，不只看流结束 |
| 故障核对 | 操作者制造一次离线和取消 | 核对执行落点、残留进程和外部写入 |
| 退出 | 停止新增派发，保留日志与原文件 | 回到逐机 CLI 并对账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务、节点、存储和模型资源 | 配置节点、镜像和授权 | 实际部署费用未知 |
| 持续使用 | 在线机器、模型请求和数据备份 | 核对调度、权限和产物 | 合格任务费用与时延未测 |
| 失败恢复 | 保留输出、日志及重试资源 | 对照退出和外部副作用 | 进程和数据恢复耗时未知 |
| 退出 | 保存工作区和任务记录 | 清理在途并回到终端 | 停止不能撤销已产生写入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多节点组织 | 工作区绑定优先并允许选择回退 | 离线时的原数据落位 |
| DSH 启动 | 生成路由并通过 Computer 执行 | 实际宿主兼容和任务效果 |
| 终态 | 解析通知、退出和取消分支 | 产物合格、外部副作用回滚 |

> **思考**：[Q03](#research-q03) 显示，缺少协议完成事件但干净退出的分支也可以在上层返回正常 stop。结合 [Q02](#research-q02) 的节点回退，流结束与正确节点上的业务交付需要分别核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，Yao 把多机的工作区选择、任务配额与 DSH 进程启动放在同一服务中，减少人工搬运任务与节点信息的环节。

[Q02](#research-q02) 将节点选择与 Computer 接口分开，[Q03](#research-q03) 将协议取消、进程信号和流响应分层。移植时应把缺失完成事件和实际副作用作为独立状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示，缺少协议完成事件但干净退出的分支也可以在上层返回正常 stop。结合 [Q02](#research-q02) 的节点回退，流结束与正确节点上的业务交付需要分别核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 若需要验证，先让隔离节点只处理可公开样例，分别核对正常、掉线和取消。看不到预期目录或产物时，保留运行记录并交由节点操作者接管。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

任务登记、工作区选择及 DSH 启动已获源码支持。固定实现中存在无完成事件但正常返回的分支。跨节点数据与真实任务效果仍待验证。

- 已检查：作者 README、包清单、源码路径 README.md、main.go、agent/sandbox/v2/init.go、agent/task/run.go、workspace/manager.go、agent/assistant/sandbox_v2.go、agent/sandbox/v2/node_selector.go、agent/sandbox/v2/lifecycle.go、agent/computer/lookup.go、agent/sandbox/v2/dsh/runner.go、agent/sandbox/v2/dsh/command.go、agent/sandbox/v2/dsh/plat_posix.go、agent/sandbox/v2/dsh/session.go、agent/sandbox/v2/dsh/parse.go、agent/sandbox/v2/stream.go、go.mod 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件只核查工作区、任务、Go 版 DSH runner 和关键流分支。未核查各客户端或全部 ACL，也未运行节点、模型和宿主。统计仅覆盖指定扩展名，不代表 Go 主体规模。
- 下一步：以同一公开样例在两个隔离节点执行正常、掉线、安静退出和取消，分别核对实际文件、流终止、进程和外部测试回执。

**分析版本**

- **仓库**：[YaoApp/yao](https://github.com/YaoApp/yao)
- **版本号**：未声明（[固定提交 07b5574](https://github.com/YaoApp/yao/tree/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提议用可验证的节点、工作区与产物收据记录任务是否真正办结，测试掉线和不完整退出时能否减少误判。

以同一公开样例在两个隔离节点执行正常、掉线、安静退出和取消，分别核对实际文件、流终止、进程和外部测试回执。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 127 | 53660 | — | — | 187846 |
| .ts | source | 11 | 4197 | 3000 | 721 | — |
| .js | source | 2 | 4 | 4 | 0 | — |
| .ts | test | 14 | 948 | 781 | 49 | — |
| .md | test | 1 | 7 | — | — | 15 |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/YaoApp/yao/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：需要在多台机器使用 DSH 的团队，能否借 Yao 的工作区、节点和执行控制将任务发到正确环境，并能区分流结束、产物完成和取消边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比逐台运行 DSH，Yao 实际增加哪些任务控制？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对已经管理多台工作机器的开发负责人，手工做法是在指定机器启动 DSH，再将任务、命令结果和产物记入任务板。Yao 以独立 Go 应用启动，在自己的沙箱执行层将 DSH 注册为 runner。任务服务按聊天 ID 登记运行，重复登记被拒绝，团队并发配额不足时排队，并由已接入的 AssistantStreamFn 执行。这样能把聊天任务和工作区选择纳入同一控制面。合格交付仍要核对节点、目录与产物。作者声称可从多种客户端访问，固定服务研究只确认了运行和调度源码，未验证各客户端接入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-15](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/README.md#L1-L15)

作者定位自托管跨端平台，并声明集成 DSH。

<details>
<summary>查看原文（15行）</summary>

```text
# Yao Agents

✨ **All your agents and workspaces in one place, on every device you own. Track tasks on a board, accessible from desktop, mobile, browser, or API. Self-hosted.**

![How it works](docs/how-it-works.png)

**🏠 Homepage:** [https://yaoagents.com](https://yaoagents.com)

**📚 Docs:** [https://yaoagents.com/docs](https://yaoagents.com/docs)

**🖥️ Yao Desktop:** [https://yaoagents.com/download](https://yaoagents.com/download)

**📱 Android (Beta):** [https://yaoagents.com/download/yaoagents](https://yaoagents.com/download/yaoagents)

⚡⚡⚡ **DeepSeek Harness is now integrated — use it directly in the desktop app, Android, or browser, running across your devices.** [Learn more →](https://yaoagents.com/blog/en-us/2026/release/deepseek-harness)
```

</details>

**依据 2 · 源码核查**：[main.go:25-37](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/main.go#L25-L37)

固定根 Go 应用具有独立命令入口。

<details>
<summary>查看原文（13行）</summary>

```text
func main() {
	// Internal: Windows self-update helper spawned by "yao upgrade".
	if len(os.Args) >= 3 && os.Args[1] == "--finish-upgrade" {
		cmd.FinishUpgrade(os.Args[2])
		return
	}

	// go func() {
	// 	log.Println(http.ListenAndServe("localhost:6060", nil))
	// }()
	utils.Init()
	cmd.Execute()
}
```

</details>

**依据 3 · 源码核查**：[agent/sandbox/v2/init.go:12-21](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/init.go#L12-L21)

DSH 和 deepseek 在 Yao runner 注册中指向 DSH 构造器。

<details>
<summary>查看原文（10行）</summary>

```text
func init() {
	Register("claude", func() types.Runner { return claude.New() })
	Register("claude/cli", func() types.Runner { return claude.New() })
	Register("opencode", func() types.Runner { return opencode.New() })
	Register("opencode/cli", func() types.Runner { return opencode.New() })
	Register("yaocode", func() types.Runner { return yaocode.New() })
	Register("tai", func() types.Runner { return tairunner.New() })
	Register("dsh", func() types.Runner { return dsh.New() })
	Register("deepseek", func() types.Runner { return dsh.New() })
}
```

</details>

**依据 4 · 源码核查**：[agent/task/run.go:28-48](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/task/run.go#L28-L48)

任务读取、同聊天重复登记门禁和团队配额排队。

<details>
<summary>查看原文（21行）</summary>

```text
func Run(ctx context.Context, auth *process.AuthorizedInfo, chatID string, req *RunReq) (*RunResult, error) {
	task, err := Get(ctx, auth, chatID)
	if err != nil {
		return nil, err
	}

	dc := newDaemonContext(chatID)
	if _, loaded := daemonRegistry.LoadOrStore(chatID, dc); loaded {
		return nil, fmt.Errorf("task %s is already running or queued", chatID)
	}
	fmt.Printf("  • [task.run] daemon REGISTERED chatID=%s\n", chatID)

	now := time.Now()
	requestID := uuid.New().String()

	if !GlobalQuota.TryAcquire(auth.TeamID, "") {
		setStatus(chatID, "queued", auth, map[string]any{
			"queued_at":      now,
			"queue_priority": req.Priority,
		})
		entry := GlobalQuota.Enqueue(auth.TeamID, chatID, req.Priority)
```

</details>

**依据 5 · 源码核查**：[agent/task/run.go:204-228](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/task/run.go#L204-L228)

实际交给 Assistant 流式函数，再分类运行错误。

<details>
<summary>查看原文（25行）</summary>

```text
	_, err := AssistantStreamFn(task.AssistantID, agentCtx, inputToAgentMessages(req.Messages), opts)

	var finalErr error
	status := "completed"

	if stdCtx.Err() == context.DeadlineExceeded {
		finalErr = fmt.Errorf("timeout after %s", resolved.Timeout)
		status = "failed"
		markFailed(dc, auth, finalErr)
	} else if dc.Context.Err() != nil && isContextCanceled(err) {
		status = "cancelled"
		finalErr = errUserCancelled
		dc.Broadcast(&message.Message{
			Type:  "text",
			Props: map[string]interface{}{"content": "\n\n---\n*[任务已被用户取消]*"},
		})
		setStatus(dc.ChatID, "cancelled", auth, map[string]any{
			"cancelled_at":  time.Now(),
			"cancel_reason": "user_stopped",
		})
	} else if err != nil {
		finalErr = err
		status = "failed"
		markFailed(dc, auth, finalErr)
	}
```

</details>

#### 缺口

- 未量化多机用户的重复切换负担或任务交付收益。
  **影响**：能说明操作组合，不能确认该平台比逐机 CLI 更省工。
  **进一步探讨**：用两个隔离节点重复同一任务，记录人工切换、产物核对和恢复步骤。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区和节点如何绑定到 DSH 进程？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

创建工作区要求节点可用，Owner 和 Node 随元数据落到该节点 volume。Assistant 将请求的 workspace_id、可用 runner 和镜像等条件交给节点选择器。已解析且在线的工作区绑定优先，该节点不支持 runner 或模式时报错；找不到绑定节点时，选择器落回普通筛选。获得 host 或 box Computer 后还会绑定传入的工作区。host 路径若无法找到元数据会尝试创建，不能以相同 workspace_id 推断原节点文件已同步。进入 DSH runner 后，内置 Skill、定义、AGENTS.md 写入失败可告警继续，显式准备步骤错误会返回。DSH 路由配置与聊天 session ID 进入 JSON-RPC；固定 POSIX 实现写配置后调用 tai dsh，由 Computer.Stream 传工作目录、环境和 stdin。只有实际走 box 或部署自己的隔离措施才能再谈进程边界，host 分支本身是宿主执行。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/manager.go:40-79](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/workspace/manager.go#L40-L79)

创建依赖节点在线，并把所有者和节点记录在对应 volume。

<details>
<summary>查看原文（40行）</summary>

```text
func (m *Manager) Create(ctx context.Context, opts CreateOptions) (*Workspace, error) {
	if err := ValidateID(opts.ID); err != nil {
		return nil, err
	}
	if opts.Node == "" {
		return nil, ErrNodeMissing
	}

	res, ok := tai.GetResources(opts.Node)
	if !ok {
		return nil, ErrNodeOffline
	}

	id := opts.ID
	if id == "" {
		id = generateID()
	}

	now := time.Now().UTC()
	ws := &Workspace{
		ID:        id,
		Name:      opts.Name,
		Owner:     opts.Owner,
		Node:      opts.Node,
		Labels:    opts.Labels,
		CreatedAt: now,
		UpdatedAt: now,
	}

	vol := res.Volume
	if err := vol.MkdirAll(ctx, id, "."); err != nil {
		return nil, fmt.Errorf("workspace: create directory: %w", err)
	}

	data, err := marshalMeta(ws)
	if err != nil {
		return nil, err
	}
	if err := vol.WriteFile(ctx, id, metadataFile, data, 0644); err != nil {
		return nil, fmt.Errorf("workspace: write metadata: %w", err)
```

</details>

**依据 2 · 源码核查**：[agent/assistant/sandbox_v2.go:89-112](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/assistant/sandbox_v2.go#L89-L112)

实际调用节点选择器并传工作区。

<details>
<summary>查看原文（24行）</summary>

```text
	// 2. Build node snapshot + selection criteria.
	nodes := sandboxv2.BuildNodeSnapshot()

	workspaceID := ""
	if ctx.Metadata != nil {
		if ws, ok := ctx.Metadata["workspace_id"].(string); ok && ws != "" {
			workspaceID = ws
		}
	}

	criteria := &sandboxv2.SelectionCriteria{
		WorkspaceID: workspaceID,
		Preferred:   preferred,
		Allowed:     allowed,
		Image:       cfg.Computer.Image,
		Filter:      cfg.Filter,
		WSManager:   workspace.M(),
	}

	// 3. Select node.
	sel, err := sandboxv2.SelectNode(nodes, criteria)
	if err != nil {
		closeLoadingV2(ctx, loadingMsgID, "sandbox.failed")
		return nil, fmt.Errorf("select node: %w", err)
```

</details>

**依据 3 · 源码核查**：[agent/sandbox/v2/node_selector.go:76-123](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/node_selector.go#L76-L123)

绑定优先，绑定节点不支持时报错，缺席时继续普通过滤。

<details>
<summary>查看原文（48行）</summary>

```text
	// STEP 0: workspace binding (highest priority)
	if criteria.WorkspaceID != "" && criteria.WSManager != nil {
		nodeID, err := criteria.WSManager.NodeForWorkspace(context.Background(), criteria.WorkspaceID)
		if err == nil && nodeID != "" {
			found := false
			for i := range nodes {
				if nodes[i].ID == nodeID {
					found = true
					runner := ""
					if criteria.Preferred != "" && nodeHasRunner(&nodes[i], criteria.Preferred) && containsRunner(criteria.Allowed, criteria.Preferred) {
						runner = criteria.Preferred
					}
					if runner == "" {
						runner = pickRunnerOnNode(&nodes[i], criteria)
					}
					if runner == "" {
						return nil, fmt.Errorf("workspace-bound node %q does not support any of the allowed runners %v", nodeID, criteria.Allowed)
					}
					mode := resolve.ResolveMode(&nodes[i], runner, criteria.Image)
					if mode == "" {
						return nil, fmt.Errorf("workspace-bound node %q has no feasible execution mode for runner %q (CanBox=%v CanHost=%v image=%q)", nodeID, runner, nodes[i].CanBox, nodes[i].CanHost, criteria.Image)
					}
					return &SelectionResult{
						NodeID:  nodeID,
						Runner:  runner,
						Mode:    mode,
						IsLocal: nodes[i].IsLocal,
					}, nil
				}
			}
			if !found {
				log.Warn("[node_selector] workspace %q bound to node %q, but node is offline or removed; falling through to normal selection", criteria.WorkspaceID, nodeID)
			}
		}
	}

	// STEP 1: filter — keep only nodes that support at least one allowed runner
	// and pass the ComputerFilter check.
	var filtered []NodeCandidate
	for i := range nodes {
		if !nodeSupportsAny(&nodes[i], criteria.Allowed) {
			continue
		}
		if !passFilter(&nodes[i], criteria.Filter) {
			continue
		}
		filtered = append(filtered, nodes[i])
	}
```

</details>

**依据 4 · 源码核查**：[agent/sandbox/v2/lifecycle.go:117-145](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/lifecycle.go#L117-L145)

按 host 或 box 准备资源，再按节点查找 Computer。

<details>
<summary>查看原文（29行）</summary>

```text
	// --- Pipeline-specific: resource preparation ---
	switch sel.Mode {
	case "host":
		cfg.Kind = "host"
		workspaceID, identifier = ensureHostWorkspace(cfg, ownerID, workspaceID, identifier)

	case "box":
		cfg.Kind = "box"
		if _, newIdent, err := resolveBox(cfg, manager, ownerID, identifier, workspaceID); err != nil {
			return nil, identifier, err
		} else {
			identifier = newIdent
		}

	default:
		return nil, identifier, fmt.Errorf("unsupported mode %q for node %q", sel.Mode, sel.NodeID)
	}

	// --- Unified path: obtain Computer via computer.Lookup ---
	comp, err := computer.Lookup(ctx, &computer.LookupOpts{
		Auth:          ctx.Authorized,
		AssistantID:   ctx.AssistantID,
		WorkspaceID:   cfg.WorkspaceID,
		ChatID:        ctx.ChatID,
		Image:         cfg.Computer.Image,
		Lifecycle:     cfg.Lifecycle,
		NodeID:        sel.NodeID,
		BoxIdentifier: cfg.ID,
	})
```

</details>

**依据 5 · 源码核查**：[agent/sandbox/v2/lifecycle.go:152-174](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/lifecycle.go#L152-L174)

host 模式无法找到工作区时可能创建，而非自动搬运原文件。

<details>
<summary>查看原文（23行）</summary>

```text
func ensureHostWorkspace(cfg *types.SandboxConfig, ownerID, workspaceID, identifier string) (string, string) {
	if workspaceID == "" && cfg.NodeID != "" {
		workspaceID = workspace.DefaultWorkspaceID(ownerID, cfg.NodeID)
		cfg.WorkspaceID = workspaceID
		if dot := strings.LastIndex(identifier, "."); dot >= 0 {
			identifier = identifier[:dot+1] + workspaceID
			cfg.ID = identifier
		}
	}

	if workspaceID != "" {
		wsm := workspace.M()
		if _, err := wsm.Get(context.Background(), workspaceID); err != nil {
			if _, createErr := wsm.Create(context.Background(), workspace.CreateOptions{
				ID:    workspaceID,
				Owner: ownerID,
				Node:  cfg.NodeID,
				Name:  "Default",
			}); createErr != nil {
				log.Trace("[sandbox/v2] auto-create workspace %s failed: %v", workspaceID, createErr)
			}
		}
	}
```

</details>

**依据 6 · 源码核查**：[agent/computer/lookup.go:74-104](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/computer/lookup.go#L74-L104)

选定节点和模式最终绑定工作区。

<details>
<summary>查看原文（31行）</summary>

```text
	// 5. Dispatch by mode + BindWorkplace
	mgr := sandbox.M()
	switch mode {
	case "host":
		host, err := mgr.Host(ctx, nodeID)
		if err != nil {
			return nil, fmt.Errorf("computer.Lookup: host %q: %w", nodeID, err)
		}
		host.BindWorkplace(opts.WorkspaceID)
		return host, nil

	case "box":
		identifier := opts.BoxIdentifier
		if identifier == "" {
			identifier = resolve.BuildIdentifier(lifecycle, ownerID, opts.ChatID, opts.AssistantID, opts.WorkspaceID)
		}
		if identifier == "" {
			return nil, nil // oneshot without override: cannot look up
		}
		box, err := mgr.Get(ctx, identifier)
		if err != nil {
			if errors.Is(err, sandbox.ErrNotFound) {
				return nil, nil
			}
			return nil, fmt.Errorf("computer.Lookup: box %q: %w", identifier, err)
		}
		if box.IsStopped() {
			return nil, nil
		}
		box.BindWorkplace(opts.WorkspaceID)
		return box, nil
```

</details>

**依据 7 · 源码核查**：[agent/sandbox/v2/dsh/runner.go:60-92](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/runner.go#L60-L92)

系统素材准备允许告警继续，配置步骤出错时会返回。

<details>
<summary>查看原文（33行）</summary>

```text
	if ws := req.Computer.Workplace(); ws != nil {
		if err := shared.InjectSystemSkills(ws, tools.SkillsFS, ".dsh/skills"); err != nil {
			r.logger.Warn("inject system skills: %v", err)
		}
		if err := shared.InjectAgentDefinitions(ws, tools.AgentsFS, prefix+"/agents"); err != nil {
			r.logger.Warn("inject agent definitions: %v", err)
		}

		prompt, _ := tools.RenderSystemPrompt(hasVision)

		if err := shared.AppendSystemPrompt(ws, "AGENTS.md", prompt); err != nil {
			r.logger.Warn("append AGENTS.md: %v", err)
		}
	}

	if req.SkillsDir != "" {
		ws := req.Computer.Workplace()
		if ws != nil {
			src := "local:///" + req.SkillsDir
			dst := prefix + "/skills"
			if _, err := ws.Copy(src, dst); err != nil {
				r.logger.Warn("copy skills %s -> %s: %v", src, dst, err)
			}
		}
	}

	if req.RunSteps != nil && len(steps) > 0 {
		if err := req.RunSteps(ctx, steps, req.Computer, req.AssistantID, req.ConfigHash, req.AssistantDir); err != nil {
			return fmt.Errorf("dsh prepare steps: %w", err)
		}
	}

	return nil
```

</details>

**依据 8 · 源码核查**：[agent/sandbox/v2/dsh/command.go:117-133](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/command.go#L117-L133)

渲染 Cordis 配置并取聊天 ID 作为会话 ID。

<details>
<summary>查看原文（17行）</summary>

```text
	// Render cordis.yml
	cordisYAML, err := RenderCordisConfig(cfg)
	if err != nil {
		return command{}, fmt.Errorf("render cordis config: %w", err)
	}

	// debugDumpCordis(cordisYAML)

	// Build system prompt
	systemPrompt := buildSystemPrompt(req, workDir)

	// Use chatID directly as DSH session ID — same chat shares session across
	// assistant switches (as long as runner is DSH).
	sessionID := req.ChatID
	if sessionID == "" {
		sessionID = uuid.New().String()
	}
```

</details>

**依据 9 · 源码核查**：[agent/sandbox/v2/dsh/plat_posix.go:42-54](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/plat_posix.go#L42-L54)

写入工作区配置并 exec tai dsh。

<details>
<summary>查看原文（13行）</summary>

```text
func (p *posixPlatform) BuildScript(in scriptInput) (string, []byte) {
	var s strings.Builder

	s.WriteString("set -e\n")
	s.WriteString(fmt.Sprintf("mkdir -p \"$(dirname %q)\"\n", in.configFile))
	s.WriteString(fmt.Sprintf("cat << 'CORDISEOF' > %q\n", in.configFile))
	s.WriteString(in.cordisYAML)
	s.WriteString("\nCORDISEOF\n")
	s.WriteString("set +e\n")

	s.WriteString(fmt.Sprintf("exec tai dsh --config %q\n", in.configFile))

	return s.String(), []byte(in.inputJSONRPC + "\n")
```

</details>

**依据 10 · 源码核查**：[agent/sandbox/v2/dsh/session.go:30-45](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/session.go#L30-L45)

实际调用 Computer.Stream，传递工作目录、环境与 stdin。

<details>
<summary>查看原文（16行）</summary>

```text
func startSession(ctx context.Context, computer infra.Computer, p platform, cmd command, chatID string, logger *agentContext.RequestLogger, locale string, prepareLoadingMsgID string) (*session, error) {
	opts := []infra.ExecOption{
		infra.WithWorkDir(cmd.workDir),
		infra.WithEnv(cmd.env),
		infra.WithKeepStdinOpen(),
	}
	if len(cmd.stdin) > 0 {
		opts = append(opts, infra.WithStdin(cmd.stdin))
	}

	logger.Info("dsh session starting: workDir=%s platform=%s stdinLen=%d chatID=%s",
		cmd.workDir, p.OS(), len(cmd.stdin), chatID)

	execStream, err := computer.Stream(ctx, cmd.shell, opts...)
	if err != nil {
		return nil, fmt.Errorf("computer.Stream: %w", err)
```

</details>

#### 缺口

- 未实测节点掉线后实际挂载、数据是否迁移及权限隔离。
  **影响**：节点选择回退不能证明原工作区内容可用，也不能保证跨设备连续性。
  **进一步探讨**：准备两个节点各有不同标记，关闭绑定节点并观察工作区、目录、写入落点和权限。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 完成与取消怎么发生，哪些结果仍未知？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

解析器以对应会话的 session.completed 标记正常完成，idle 状态不再充当完成。turn/end 的异常原因会发错误事件，但这一分支不直接把错误作为 runner 返回。另有一条具体缺口：没有完成事件时，若解析和等待无错、进程零退出且未读取到 stderr，runStream 返回 completed=false、err=nil，Runner.Stream 最后仍返回 nil，上层可按正常 stop 构造响应。完成事件也只代表协议状态，产物是否合格仍要检查。正常完成走 shutdown，关闭 stdin、等待后尝试强杀；通用 Cleanup 在 lastCompleted 时不再额外杀子进程，因此应按本次实际路径检查存活，而不能说正常完成完全没有清理。取消路径尝试 session/cancel、shutdown、信号和强杀，失败前已产生的远端副作用不在这套清理的撤销范围。

#### 证据与依据

**依据 1 · 源码核查**：[agent/sandbox/v2/dsh/parse.go:161-188](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/parse.go#L161-L188)

只有适用会话的完成通知才设置完成，idle 不触发。

<details>
<summary>查看原文（28行）</summary>

```text
func (p *streamParser) handleSessionStatus(raw json.RawMessage) (stopped bool) {
	var params sessionStatusParams
	if err := json.Unmarshal(raw, &params); err != nil {
		return false
	}
	// session.status:idle no longer drives completion — the Node side sends
	// session.completed after all descendants (subagents, team members, goal
	// rounds) have settled.  Keeping idle as a pure status notification
	// preserves event ordering for consumers that only observe status.
	return false
}

// handleSessionCompleted processes the session.completed notification sent by
// the Node side after the root agent and all descendant subagents are quiescent.
func (p *streamParser) handleSessionCompleted(raw json.RawMessage) (stopped bool) {
	var params sessionStatusParams
	if err := json.Unmarshal(raw, &params); err != nil {
		return false
	}
	if p.promptedSessionID != "" && params.SessionID != p.promptedSessionID {
		return false
	}
	p.closeTextMessage()
	p.closeThinkMessage()
	p.closeOrphanedTools()
	p.closeActiveLoading()
	p.completed = true
	return false
```

</details>

**依据 2 · 源码核查**：[agent/sandbox/v2/dsh/parse.go:685-694](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/parse.go#L685-L694)

turn 异常通过错误事件报告，并不在该函数返回错误值。

<details>
<summary>查看原文（10行）</summary>

```text
	// Surface DSH errors with full detail from the reason payload
	if kind, ok := te.Reason["kind"].(string); ok && kind != "completed" && kind != "stop" {
		errMsg := formatTurnError(te.Reason)
		log.Warn("[dsh-parse] turn ended with error: kind=%s msg=%s", kind, errMsg)
		if p.handler != nil {
			p.handler(message.ChunkError, []byte(errMsg))
		}
	}

	return false
```

</details>

**依据 3 · 源码核查**：[agent/sandbox/v2/dsh/session.go:71-101](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/session.go#L71-L101)

无完成事件、等待正常且没有 stderr 时可返回 false 与 nil。

<details>
<summary>查看原文（31行）</summary>

```text
	if parser.completed {
		s.logger.Info("dsh stream completed normally")
		return true, nil
	}

	if parseErr != nil && !isContextErr(parseErr) {
		s.exec.Cancel()
	}

	exitErr := s.waitForExit(parseErr)
	if exitErr != nil {
		if handler != nil {
			handler(message.ChunkError, []byte(exitErr.Error()))
		}
		return false, exitErr
	}

	s.stderrMu.Lock()
	stderrStr := strings.TrimSpace(s.stderr.String())
	s.stderrMu.Unlock()
	if stderrStr != "" {
		s.logger.Warn("dsh exited with code 0 but stream incomplete and stderr present: %s", stderrStr)
		errMsg := fmt.Errorf("dsh setup failed: %s", stderrStr)
		if handler != nil {
			handler(message.ChunkError, []byte(errMsg.Error()))
		}
		return false, errMsg
	}

	return false, nil
}
```

</details>

**依据 4 · 源码核查**：[agent/sandbox/v2/dsh/session.go:275-293](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/session.go#L275-L293)

解析、等待和非零退出分别返回错误，干净退出可返回 nil。

<details>
<summary>查看原文（19行）</summary>

```text
	if parseErr != nil {
		if stderrStr != "" {
			return fmt.Errorf("%w (stderr: %s)", parseErr, stderrStr)
		}
		return parseErr
	}
	if waitErr != nil {
		if stderrStr != "" {
			return fmt.Errorf("%w (stderr: %s)", waitErr, stderrStr)
		}
		return waitErr
	}
	if exitCode != 0 {
		if stderrStr != "" {
			return fmt.Errorf("dsh exited with code %d: %s", exitCode, stderrStr)
		}
		return fmt.Errorf("dsh exited with code %d", exitCode)
	}
	return nil
```

</details>

**依据 5 · 源码核查**：[agent/sandbox/v2/dsh/runner.go:160-178](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/runner.go#L160-L178)

正常完成走 shutdown，未完成且无错误也返回 nil。

<details>
<summary>查看原文（19行）</summary>

```text
	sess, err := startSession(ctx, computer, p, cmd, cmd.sessionID, r.logger, req.Locale, req.PrepareLoadingMsgID)
	if err != nil {
		return err
	}
	defer sess.exec.Cancel()

	completed, streamErr := sess.runStream(handler)
	r.lastCompleted = completed

	if completed {
		sess.shutdown()
		return nil
	}

	if streamErr != nil {
		return streamErr
	}

	return nil
```

</details>

**依据 6 · 源码核查**：[agent/sandbox/v2/stream.go:107-127](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/stream.go#L107-L127)

Runner 无错误时构造 stop 响应。

<details>
<summary>查看原文（21行）</summary>

```text
	err := req.Runner.Stream(runnerCtx, req.StreamReq, wrappedHandler)

	if !loadingClosed && req.LoadingMsgID != "" {
		closeLoading(ctx, req.LoadingMsgID)
	}

	if err != nil {
		if errors.Is(err, context.Canceled) {
			return nil, err
		}
		return nil, fmt.Errorf("runner.Stream: %w", err)
	}

	resp := &agentContext.CompletionResponse{
		Role:         "assistant",
		FinishReason: agentContext.FinishReasonStop,
	}
	if len(textContent) > 0 {
		resp.Content = string(textContent)
	}
	return resp, nil
```

</details>

**依据 7 · 源码核查**：[agent/sandbox/v2/dsh/session.go:222-239](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/session.go#L222-L239)

完成时关闭 stdin 并在宽限后尝试强制清理。

<details>
<summary>查看原文（18行）</summary>

```text
func (s *session) shutdown() {
	s.logger.Info("shutting down completed dsh session: chatID=%s", s.chatID)

	// Close stdin → DSH detects EOF → triggers natural exit via onIdle handler.
	if s.exec.Stdin != nil {
		s.exec.Stdin.Close()
	}

	// Grace period: let DSH flush write-behind buffer (~200ms), dispose
	// plugins, and kill child processes on its own.
	time.Sleep(2 * time.Second)

	// Safety net: force kill anything still lingering.
	killCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	s.killProcess(killCtx)
	s.exec.Cancel()
}
```

</details>

**依据 8 · 源码核查**：[agent/sandbox/v2/dsh/runner.go:181-203](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/runner.go#L181-L203)

常规 Cleanup 对已完成运行早退，对未完成尝试杀进程。

<details>
<summary>查看原文（23行）</summary>

```text
// Cleanup kills any remaining DSH processes.
func (r *Runner) Cleanup(ctx context.Context, computer infra.Computer) error {
	if computer == nil {
		return nil
	}

	log.Trace("[dsh-runner] Cleanup: chatID=%s lastCompleted=%v", r.lastChatID, r.lastCompleted)

	if r.lastCompleted {
		if r.logger != nil {
			r.logger.Info("cleanup: stream completed normally, preserving child processes")
		}
		return nil
	}

	p := resolvePlatform(computer)
	if r.lastChatID != "" {
		computer.Exec(ctx, p.KillSessionCmd("dsh-"+r.lastChatID))
	} else {
		computer.Exec(ctx, p.KillCmd("dsh-jsonrpc-agent"))
	}

	return nil
```

</details>

**依据 9 · 源码核查**：[agent/sandbox/v2/dsh/session.go:138-177](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/session.go#L138-L177)

取消按 RPC、关闭、信号和强制终止逐级尝试。

<details>
<summary>查看原文（40行）</summary>

```text
			// Layer 1: session/cancel RPC (idempotent x3, 1s each)
			if stdinOK {
				for i := 0; i < 3; i++ {
					if err := s.writeStdin(s.buildCancelRPC()); err != nil {
						s.logger.Warn("stdin broken, skipping to signal layer: %v", err)
						stdinOK = false
						break
					}
					if s.waitDone(done, 1*time.Second) {
						return
					}
				}
			}

			// Layer 2: shutdown RPC (1s)
			if stdinOK {
				s.logger.Warn("cancel timeout, sending shutdown RPC")
				if err := s.writeStdin(s.buildShutdownRPC()); err != nil {
					stdinOK = false
				} else if s.waitDone(done, 1*time.Second) {
					return
				}
			}

			// Layer 3: SIGTERM (POSIX only, 2s)
			if s.plat.OS() != "windows" {
				s.logger.Warn("stdin layers exhausted, sending SIGTERM")
				s.gracefulKill()
				if s.waitDone(done, 2*time.Second) {
					return
				}
			}

			// Layer 4: SIGKILL / taskkill /F
			s.logger.Error("dsh hung, force killing")
			killCtx, killCancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer killCancel()
			s.killProcess(killCtx)
			s.exec.Cancel()

```

</details>

#### 缺口

- 没有重放安静退出、异常事件后完成和远端写入后取消。
  **影响**：能确认静态成功归类的条件，不能确定真实节点出现频率或副作用归属。
  **进一步探讨**：以受控进程发出无完成事件的零退出，另注入提交后取消，对照实际产物与任务状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得隔离试用，需要哪些资源和退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

只有频繁在多台机器管理工作区，并能维护节点、权限和模型的团队，才有机会抵消平台成本。根源码用 Go 1.25 构建，DSH 路径要求选定节点能运行 tai dsh、写配置、访问所选模型。模式可为 host 或 box，镜像检查与拉取是 box 分支额外步骤。模型 Key 随执行环境传给子进程，接入须限制使用的凭据和节点。先准备无敏感文件的两个隔离节点，执行正常任务、绑定节点掉线和一次取消，核对实际工作区、产物、遗留进程及远端状态。出现数据落位不明或无完成回执的正常结束时暂停新增任务，保留原文件、日志和在途状态，回到逐机终端与人工任务板。未取得真实部署的模型账单或运维时间。

#### 证据与依据

**依据 1 · 源码核查**：[go.mod:1-3](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/go.mod#L1-L3)

根源码构建工具链要求。

```text
module github.com/yaoapp/yao

go 1.25.0
```

**依据 2 · 源码核查**：[agent/assistant/sandbox_v2.go:169-196](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/assistant/sandbox_v2.go#L169-L196)

仅 box 模式对镜像进行预检查和拉取。

<details>
<summary>查看原文（28行）</summary>

```text
	// 6. Image pre-check + pull (box mode only).
	if sel.Mode == "box" && cfg.Computer.Image != "" && manager != nil {
		updateLoadingV2(ctx, loadingMsgID, "sandbox.starting")
		exists, existsErr := manager.ImageExists(stdCtx, sel.NodeID, cfg.Computer.Image)
		if existsErr != nil {
			log.Printf("[sandbox/v2] image exists check failed on node %s: %v", sel.NodeID, existsErr)
		}
		if existsErr == nil && !exists {
			updateLoadingV2(ctx, loadingMsgID, "sandbox.pulling_image")
			var pullUserID, pullTeamID string
			if ctx.Authorized != nil {
				pullUserID = ctx.Authorized.UserID
				pullTeamID = ctx.Authorized.TeamID
			}
			pullOpts := buildImagePullOptions(pullUserID, pullTeamID)
			ch, pullErr := manager.PullImage(stdCtx, sel.NodeID, cfg.Computer.Image, pullOpts)
			if pullErr != nil {
				log.Printf("[sandbox/v2] image pull failed on node %s: %v (will retry in Create)", sel.NodeID, pullErr)
			} else if ch != nil {
				for p := range ch {
					if p.Error != "" {
						log.Printf("[sandbox/v2] image pull progress error: %s", p.Error)
						break
					}
				}
			}
		}
	}
```

</details>

**依据 3 · 源码核查**：[agent/sandbox/v2/dsh/command.go:201-225](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/command.go#L201-L225)

模型 Key 和可选地址从连接设置写入子进程环境。

<details>
<summary>查看原文（25行）</summary>

```text
func buildEnv(req *types.StreamRequest, p platform, workDir, apiKey, baseURL, systemPrompt string) map[string]string {
	env := make(map[string]string)

	// DSH-specific — DEEPSEEK_API_KEY always set for backward compatibility
	env["DEEPSEEK_API_KEY"] = apiKey
	if baseURL != "" {
		env["DEEPSEEK_BASE_URL"] = baseURL
	}

	// Per-role API keys for pi-ai routes
	env["DSH_KEY_PRIMARY"] = apiKey
	for roleName, c := range req.Roles {
		if c == nil || roleName == "default" {
			continue
		}
		envName := "DSH_KEY_" + strings.ToUpper(roleName)
		// Prefer DB-backed role LLMRef for API key
		if req.RoleLLMs != nil {
			if ref, ok := req.RoleLLMs[roleName]; ok && ref != nil && ref.Provider != nil {
				env[envName] = ref.Provider.APIKey
				continue
			}
		}
		if lc, ok := c.(goullm.LLMConnector); ok {
			env[envName] = lc.GetKey()
```

</details>

**依据 4 · 源码核查**：[agent/sandbox/v2/dsh/plat_posix.go:42-54](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/dsh/plat_posix.go#L42-L54)

选定环境需要运行 tai dsh 并能写配置。

<details>
<summary>查看原文（13行）</summary>

```text
func (p *posixPlatform) BuildScript(in scriptInput) (string, []byte) {
	var s strings.Builder

	s.WriteString("set -e\n")
	s.WriteString(fmt.Sprintf("mkdir -p \"$(dirname %q)\"\n", in.configFile))
	s.WriteString(fmt.Sprintf("cat << 'CORDISEOF' > %q\n", in.configFile))
	s.WriteString(in.cordisYAML)
	s.WriteString("\nCORDISEOF\n")
	s.WriteString("set +e\n")

	s.WriteString(fmt.Sprintf("exec tai dsh --config %q\n", in.configFile))

	return s.String(), []byte(in.inputJSONRPC + "\n")
```

</details>

**依据 5 · 源码核查**：[agent/task/run.go:85-96](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/task/run.go#L85-L96)

停止入口触发取消或强制取消，返回本身不是完成证明。

<details>
<summary>查看原文（12行）</summary>

```text
func Stop(ctx context.Context, auth *process.AuthorizedInfo, chatID string, force bool) error {
	dc, exists := GetDaemon(chatID)
	if !exists {
		return fmt.Errorf("task %s is not running", chatID)
	}
	if force {
		dc.ForceCancel()
	} else {
		dc.Cancel()
	}
	return nil
}
```

</details>

#### 缺口

- 未实际部署客户端、节点和模型，也没有同任务费用与人时。
  **影响**：无法给出跨平台兼容与单位任务成本。
  **进一步探讨**：锁定发行物和节点，分别记录正常运行、失败接管和退出的人工与资源成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用节点、产物和取消回执减少误办结？

**研究主题**：新假设与验证

#### 完整回答

当前选择结果有节点与模式，运行流程能得到会话 ID 并对完成与错误分类。仍可在提交前为任务指定验收文件或远端收据，记录实际执行节点与工作区，再分别显示流结束、产物已核对和外部状态未知。对照只看正常结束和任务板状态的流程，给测试组注入无完成事件的零退出、切换节点和请求后丢回执。记录误判已办结、错读工作区、等待和人工对账耗时。若增加的收据无法可信绑定实际节点或误办结没有降低，或对账成本超过收益，则否定该场景的假设。

#### 证据与依据

**依据 1 · 源码核查**：[agent/sandbox/v2/node_selector.go:94-108](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/node_selector.go#L94-L108)

选择结果包含节点、runner、模式，也存在回退分支。

<details>
<summary>查看原文（15行）</summary>

```text
					mode := resolve.ResolveMode(&nodes[i], runner, criteria.Image)
					if mode == "" {
						return nil, fmt.Errorf("workspace-bound node %q has no feasible execution mode for runner %q (CanBox=%v CanHost=%v image=%q)", nodeID, runner, nodes[i].CanBox, nodes[i].CanHost, criteria.Image)
					}
					return &SelectionResult{
						NodeID:  nodeID,
						Runner:  runner,
						Mode:    mode,
						IsLocal: nodes[i].IsLocal,
					}, nil
				}
			}
			if !found {
				log.Warn("[node_selector] workspace %q bound to node %q, but node is offline or removed; falling through to normal selection", criteria.WorkspaceID, nodeID)
			}
```

</details>

**依据 2 · 源码核查**：[agent/sandbox/v2/stream.go:113-127](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/sandbox/v2/stream.go#L113-L127)

流结束可产生 stop 响应，当前此处没有业务产物验证。

<details>
<summary>查看原文（15行）</summary>

```text
	if err != nil {
		if errors.Is(err, context.Canceled) {
			return nil, err
		}
		return nil, fmt.Errorf("runner.Stream: %w", err)
	}

	resp := &agentContext.CompletionResponse{
		Role:         "assistant",
		FinishReason: agentContext.FinishReasonStop,
	}
	if len(textContent) > 0 {
		resp.Content = string(textContent)
	}
	return resp, nil
```

</details>

**依据 3 · 源码核查**：[agent/task/run.go:204-228](https://github.com/YaoApp/yao/blob/07b55742a7ed9c7ecabc92d9f04fdf133e3cc644/agent/task/run.go#L204-L228)

任务运行按流函数错误和超时分类，终态不能代替外部收据。

<details>
<summary>查看原文（25行）</summary>

```text
	_, err := AssistantStreamFn(task.AssistantID, agentCtx, inputToAgentMessages(req.Messages), opts)

	var finalErr error
	status := "completed"

	if stdCtx.Err() == context.DeadlineExceeded {
		finalErr = fmt.Errorf("timeout after %s", resolved.Timeout)
		status = "failed"
		markFailed(dc, auth, finalErr)
	} else if dc.Context.Err() != nil && isContextCanceled(err) {
		status = "cancelled"
		finalErr = errUserCancelled
		dc.Broadcast(&message.Message{
			Type:  "text",
			Props: map[string]interface{}{"content": "\n\n---\n*[任务已被用户取消]*"},
		})
		setStatus(dc.ChatID, "cancelled", auth, map[string]any{
			"cancelled_at":  time.Now(),
			"cancel_reason": "user_stopped",
		})
	} else if err != nil {
		finalErr = err
		status = "failed"
		markFailed(dc, auth, finalErr)
	}
```

</details>

#### 缺口

- 未验证收据能否真实绑定节点、文件和外部服务。
  **影响**：不能将该设想当作当前已有能力。
  **进一步探讨**：将两个测试节点、产物哈希和外部日志相互对照，再比较判断准确率与恢复工时。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
