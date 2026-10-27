# Yao Agents

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[22a7a2c](https://github.com/YaoApp/yao/tree/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3)

<!-- BEGIN META -->
[![GitHub ★ 8,190](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8%2C190&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/YaoApp/yao)
<!-- END META -->

> **实现功能**：自托管管理多设备上的Agent、工作区与任务，提供桌面、浏览器、移动端及API接入。

> **核心亮点**：[Q03](#research-q03)识别出工作区归属、节点能力与任务队列的控制平面整合，DSH以独立runner接入。相对逐机CLI加人工任务板，增量是持续保留任务/节点身份并统一配置接线；只有跨设备任务足够频繁时才可能覆盖部署负担，不将DSH或容器能力据为原创。

> **风险与缺陷**：[Q04](#research-q04)指出workspace组织隔离不等于所有模式的OS沙箱，completed/maxTokensAsSuccess不证明交付合格，准备材料写入失败还可能只warn继续。正常完成Cleanup有意保留子进程，离线节点回退又带来数据落位未知；这些核心生命周期边界尚未形成可验证的恢复与退出契约，应先观察而非以只读小任务掩盖整个平台的采用负担。

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
  - [Q01 · 跨设备Agent工作台为谁解决哪项重复工作，交付怎样验收？](#detail-section-11)
  - [Q02 · 节点、工作区、任务与DSH执行链如何连接？](#detail-section-12)
  - [Q03 · 相对单机CLI加人工任务板，平台的具体增量是什么？](#detail-section-13)
  - [Q04 · “隔离”“停止”和“完成”各自容易被误解在哪里？](#detail-section-14)
  - [Q05 · 哪些依赖属于平台部署，哪些只属于DSH接入？](#detail-section-15)
  - [Q06 · 自托管跨设备便利把哪些成本交给使用者？](#detail-section-16)
  - [Q07 · 哪些调度与协议设计可借鉴，哪部分未审阅？](#detail-section-17)
  - [Q08 · 怎样把“任务运行结束”升级为可核查办结？](#detail-section-18)
  - [Q09 · 谁值得限定试用，何时退回分散CLI？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Yao根项目是自托管Agent应用/运行平台，不是安装进DSH的一层插件。适合已有多台工作机器、需要把对话任务与各节点工作区统一管理的开发或运营负责人。合格结果是指定任务在预期节点处理正确工作区并产出可核查文件或业务结果；任务板显示completed不等于内容合格。简单办法是分别登录机器运行DSH/CLI并用人工任务板记录，单机用户可能无需承担平台部署。README的“越用越好”仅是作者主张，本轮未发现结果提升实验。

贡献在于把工作区归属、机器能力选择、队列任务和DSH会话接到同一控制平面，用户不必每次人工选择远程节点并拼接模型配置。相比普通远程桌面，它提供任务/工作区身份和可流式API；相比单CLI，多节点任务组织是实质增量。DSH推理、模型和容器等来自上游或独立组件，不当作Yao原创；价值依赖跨设备需求真实存在，单机脚本可能更简单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 节点/工作区管理 | 统一保存归属与存储位置 | 依赖Tai节点；非所有模式均OS沙箱 |
| 任务队列 | 同会话去重及团队并发 | 并发限制不等于费用上限 |
| DSH runner | 在指定Computer运行会话 | 模型路由、环境和配置模板须匹配 |
| 跨端API | SSE/WebSocket接入任务 | 需认证和团队/Owner权限核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Yao平台/存储/认证 | 必需 | 控制面与持久任务 | 不能作为一层DSH插件替代 |
| Tai节点及Computer | 执行必需 | 工作区与子进程 | 离线/能力不匹配需核对调度 |
| 模型路由和凭据 | DSH任务必需 | 请求推理 | 配置失败或无产物 |
| Go1.25及源码依赖 | 源码构建必需 | 构建平台 | 非普通运行安装说明 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 运维在隔离环境部署与接节点 | 认证、节点在线和workspace一致 |
| 2 | 用户提交只读任务 | 指定节点/输入及独立验收 |
| 3 | 队列执行DSH并流式返回 | 核对产物，不能仅看completed |
| 4 | 用户停止或退出 | 确认进程与部分写入再接管 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 平台/机器/模型/存储 | 节点、认证、备份接入 | 总部署人时未知 |
| 持续 | 在线机器、数据库、模型 | 运维和独立验收 | 无合格任务费用对照 |
| 失败恢复 | 部分产物与日志保留 | 核对调度、强杀、遗留进程及副作用 | 不保证自动补偿 |
| 退出 | 原文件与任务状态 | 停队列、导出后回原CLI | 停平台不回滚项目 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多机组织 | workspace节点绑定与能力选择存在 | 掉线后数据与状态一致性 |
| 任务执行 | 去重、并发配额和流式DSH | completed是否业务合格 |
| 减少人工切换 | 控制面统一入口 | 总运维人时/费用收益 |

> **思考**：[Q04](#research-q04)指出workspace组织隔离不等于所有模式的OS沙箱，completed/maxTokensAsSuccess不证明交付合格，准备材料写入失败还可能只warn继续。正常完成Cleanup有意保留子进程，离线节点回退又带来数据落位未知；这些核心生命周期边界尚未形成可验证的恢复与退出契约，应先观察而非以只读小任务掩盖整个平台的采用负担。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03)识别出工作区归属、节点能力与任务队列的控制平面整合，DSH以独立runner接入。相对逐机CLI加人工任务板，增量是持续保留任务/节点身份并统一配置接线；只有跨设备任务足够频繁时才可能覆盖部署负担，不将DSH或容器能力据为原创。

[Q03](#research-q03)识别出工作区归属、节点能力与任务队列的控制平面整合，DSH以独立runner接入。相对逐机CLI加人工任务板，增量是持续保留任务/节点身份并统一配置接线；只有跨设备任务足够频繁时才可能覆盖部署负担，不将DSH或容器能力据为原创。

可借鉴daemonRegistry的同chat执行去重、团队配额队列、workspace身份绑定和分层取消。DSH会话层区分completed事件、非零退出及零退出但stderr且不完整，避免仅由退出码决定成功；取消尽量先协议结束再强杀，仍需要验证取消后副作用。迁移要携带Computer抽象、chat身份和配置模板，并处理多个平台差异。本轮只抽读这些Go关键路径，inventory的JS/TS/Markdown统计不覆盖Go主体，也不是整个框架审计。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04)指出workspace组织隔离不等于所有模式的OS沙箱，completed/maxTokensAsSuccess不证明交付合格，准备材料写入失败还可能只warn继续。正常完成Cleanup有意保留子进程，离线节点回退又带来数据落位未知；这些核心生命周期边界尚未形成可验证的恢复与退出契约，应先观察而非以只读小任务掩盖整个平台的采用负担。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议有多机需求且能承担自托管的团队先观察，在隔离节点做架构核验，不把真实业务迁入平台。源码提供集中队列和workspace身份，但准备失败仅warn、正常完成保留子进程，以及离线调度的数据落位尚未闭合。先核对准备完整、节点身份和全部持续进程，再决定是否值得小任务试用；出现不明子进程、completed缺产物或绑定节点掉线时暂停新任务，保留工作区与状态，交由节点管理员手工接管并退回逐机CLI。根仓库不是装入日常DSH的bundle。 依据 [Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前贡献由固定源码支持并含解释判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、main.go、workspace/workspace.go、workspace/manager.go、agent/sandbox/v2/node_selector.go、agent/sandbox/v2/dsh/runner.go、agent/sandbox/v2/dsh/command.go、agent/sandbox/v2/dsh/session.go、agent/task/run.go、agent/sandbox/v2/dsh/config.go、go.mod、openapi/workspace/workspace.go、agent/task/quota.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定提交源码、README、配置与相关测试定义；未安装或执行目标代码，未进行真实宿主验收。
- 下一步：未验证假设是给每个任务增加节点/workspace身份、预期产物和独立验收结果三联收据，将执行结束、结果待验和真正办结区分。由任务completed只反映执行错误，以及离线回退和取消副作用推得，可能比继续增加入口更能提高跨设备信任。最小验证在同任务注入max-token终止、节点掉线和产物缺失，对照原状态和三联收据，测错误办结识别率、重复执行及人工核对时间；若不能在副作用发生前锁定身份或维护成本超过收益则否定。此设计未在当前提交证实，不计入现有贡献。

**分析版本**

- **仓库**：[YaoApp/yao](https://github.com/YaoApp/yao)
- **版本号**：未声明（[固定提交 22a7a2c](https://github.com/YaoApp/yao/tree/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08)提出未验证的节点/workspace、预期产物与独立验收三联收据，分离运行结束和业务办结；用掉线、token终止及产物缺失对照误办结率和人工成本，若身份无法可信绑定或负担抵消收益则否定。

未验证假设是给每个任务增加节点/workspace身份、预期产物和独立验收结果三联收据，将执行结束、结果待验和真正办结区分。由任务completed只反映执行错误，以及离线回退和取消副作用推得，可能比继续增加入口更能提高跨设备信任。最小验证在同任务注入max-token终止、节点掉线和产物缺失，对照原状态和三联收据，测错误办结识别率、重复执行及人工核对时间；若不能在副作用发生前锁定身份或维护成本超过收益则否定。此设计未在当前提交证实，不计入现有贡献。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 127 | 53656 | — | — | 187799 |
| .ts | source | 11 | 4197 | 3000 | 721 | — |
| .js | source | 2 | 4 | 4 | 0 | — |
| .ts | test | 14 | 948 | 781 | 49 | — |
| .md | test | 1 | 7 | — | — | 15 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/YaoApp/yao/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本判断Yao Agents的贡献、关键质疑与可控采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨设备Agent工作台为谁解决哪项重复工作，交付怎样验收？

**研究主题**：场景与需求

#### 完整回答

Yao根项目是自托管Agent应用/运行平台，不是安装进DSH的一层插件。适合已有多台工作机器、需要把对话任务与各节点工作区统一管理的开发或运营负责人。合格结果是指定任务在预期节点处理正确工作区并产出可核查文件或业务结果；任务板显示completed不等于内容合格。简单办法是分别登录机器运行DSH/CLI并用人工任务板记录，单机用户可能无需承担平台部署。README的“越用越好”仅是作者主张，本轮未发现结果提升实验。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-49](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/README.md#L3-L49)

自托管、多设备、workspace和任务板声明

<details>
<summary>查看原文（47行）</summary>

```text
✨ **All your agents and workspaces in one place, on every device you own. Track tasks on a board, accessible from desktop, mobile, browser, or API. Self-hosted.**

![How it works](docs/how-it-works.png)

**🏠 Homepage:** [https://yaoagents.com](https://yaoagents.com)

**📚 Docs:** [https://yaoagents.com/docs](https://yaoagents.com/docs)

**🖥️ Yao Desktop:** [https://yaoagents.com/download](https://yaoagents.com/download)

**📱 Android (Beta):** [https://yaoagents.com/download/yaoagents](https://yaoagents.com/download/yaoagents)

⚡⚡⚡ **DeepSeek Harness is now integrated — use it directly in the desktop app, Android, or browser, running across your devices.** [Learn more →](https://yaoagents.com/blog/en-us/2026/release/deepseek-harness)

🧠 Jev is TypeSafe AI's System One model: it doesn't write text, it returns typed decisions with confidence. Now available in Yao Agents. [Learn more →](https://yaoagents.com/blog/en-us/2026/release/jev)

[中文](README.zh-CN.md)

---

## How it works

Agents run on your own devices. Every machine you add is another place for them to work, all managed from one place.

## Workspaces

Every workspace is isolated. Work stays separate, managed across all your computers, and accumulates into documents that become your knowledge base.

While working, agents can read what they need from any node.

![Workspaces](https://assets.yaoagents.com/en/workspace/01-workspace-index-en-dark.png)

## Task Board

Say what you need in a conversation, and it becomes a task on your board.

Keep the conversation going, keep it running, and it improves with use, growing into an agent purpose-built for this kind of work.

Connect task agents to your apps, or share them with others.

![Task Board](https://assets.yaoagents.com/en/kanban/09-kanban-daily-en-dark.png)

## Open API

Expert and task agents integrate into your own apps and workflows. They're built on standard APIs, with both SSE and WebSocket support.

Let your agents become part of your business, wherever you need them.
```

</details>

**依据 2 · 源码核查**：[main.go:25-36](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/main.go#L25-L36)

独立yao应用CLI入口

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 节点、工作区、任务与DSH执行链如何连接？

**研究主题**：功能与机制

#### 完整回答

workspace具有Owner和固定Node元数据，创建时要求节点在线并在该volume写metadata。SelectNode优先工作区绑定再检查runner和执行模式；DSH Runner准备skills、Agent定义及AGENTS.md，再按LLM路由生成Cordis配置，使用chatID作sessionID，通过Computer.Stream以工作目录/env/stdin启动进程。Task.Run用daemonRegistry阻止同chat重复执行，超配额排队，实际调用AssistantStreamFn并记录状态。该链路解释了统一管理与执行接线，不证明跨设备同步和最终输出正确。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/workspace.go:40-61](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/workspace/workspace.go#L40-L61)

持久workspace与Node/Owner

<details>
<summary>查看原文（22行）</summary>

```text
const metadataFile = ".workspace.json"

// Workspace is a persistent, user-managed storage entity.
// It is pinned to a specific Tai node (host machine) at creation time;
// containers referencing this workspace are automatically routed to that node.
type Workspace struct {
	ID        string            `json:"id"`
	Name      string            `json:"name"`
	Owner     string            `json:"owner"`
	Node      string            `json:"node"`
	Labels    map[string]string `json:"labels,omitempty"`
	CreatedAt time.Time         `json:"created_at"`
	UpdatedAt time.Time         `json:"updated_at"`
}

// CreateOptions configures a new workspace.
type CreateOptions struct {
	ID     string            // explicit ID; empty = auto-generate (uuid)
	Name   string            // human-readable name
	Owner  string            // user ID
	Node   string            // target Tai node (required)
	Labels map[string]string // arbitrary metadata
```

</details>

**依据 2 · 源码核查**：[workspace/manager.go:39-80](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/workspace/manager.go#L39-L80)

在线节点创建和metadata保存

<details>
<summary>查看原文（42行）</summary>

```text
// Create allocates storage on the target node and persists metadata.
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
	}
```

</details>

**依据 3 · 源码核查**：[agent/sandbox/v2/node_selector.go:69-107](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/node_selector.go#L69-L107)

绑定节点与runner/mode选择

<details>
<summary>查看原文（39行）</summary>

```text
// SelectNode is the centralised node selection entry point. It implements the
// full decision flow: workspace binding -> filter -> group -> pick.
func SelectNode(nodes []NodeCandidate, criteria *SelectionCriteria) (*SelectionResult, error) {
	if criteria == nil {
		return nil, fmt.Errorf("selection criteria is nil")
	}

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
```

</details>

**依据 4 · 源码核查**：[agent/sandbox/v2/dsh/runner.go:60-88](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/runner.go#L60-L88)

写准备材料与提示

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[agent/sandbox/v2/dsh/command.go:117-148](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/command.go#L117-L148)

Cordis生成与chat会话身份

<details>
<summary>查看原文（32行）</summary>

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

	// Pre-write .anonymous-user-id so all workspaces share the same DSH user_id.
	// DSH reads this file during initialize; writing before process launch is required.
	if req.ClientID != "" {
		dshHome := filepath.Join(workDir, ".dsh")
		os.MkdirAll(dshHome, 0755)
		idFile := filepath.Join(dshHome, ".anonymous-user-id")
		instanceUUID := uuid.NewSHA1(uuid.NameSpaceDNS, []byte(req.ClientID)).String()
		os.WriteFile(idFile, []byte(instanceUUID+"\n"), 0644)
	}

	// Build JSON-RPC input
	initMsg, err := buildInitializeMsg(workDir, "yao-primary", primary.Model, primary.MaxTokens)
	if err != nil {
		return command{}, err
```

</details>

**依据 6 · 源码核查**：[agent/sandbox/v2/dsh/session.go:30-57](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/session.go#L30-L57)

Computer.Stream启动

<details>
<summary>查看原文（28行）</summary>

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
	}

	return &session{
		ctx:                 ctx,
		computer:            computer,
		plat:                p,
		exec:                execStream,
		logger:              logger,
		chatID:              chatID,
		locale:              locale,
		prepareLoadingMsgID: prepareLoadingMsgID,
	}, nil
```

</details>

**依据 7 · 源码核查**：[agent/task/run.go:27-81](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/task/run.go#L27-L81)

去重与排队

<details>
<summary>查看原文（55行）</summary>

```text
// Run starts or queues a task execution. Atomic operation (no LLM enrichment).
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
		daemonWg.Add(1)
		go func() {
			defer daemonWg.Done()
			select {
			case <-entry.ready:
				defer GlobalQuota.Release(auth.TeamID)
				defer recoverDaemonPanic(dc)
				setStatus(chatID, "running", auth, nil)
				runDaemon(dc, auth, req, task)
			case <-dc.Context.Done():
				GlobalQuota.Dequeue(auth.TeamID, chatID)
				setStatus(chatID, "cancelled", auth, map[string]any{
					"cancelled_at":  time.Now(),
					"cancel_reason": "cancelled_while_queued",
				})
				dc.CloseSubscribers()
				UnregisterDaemon(chatID)
			}
		}()
		pos := GlobalQuota.QueuePosition(auth.TeamID, chatID)
		return &RunResult{ChatID: chatID, Status: "queued", RequestID: requestID, Position: pos}, nil
	}

	setStatus(chatID, "running", auth, map[string]any{"started_at": now})
	incrementRunCount(chatID)
	daemonWg.Add(1)
	go func() {
		defer daemonWg.Done()
		defer GlobalQuota.Release(auth.TeamID)
		defer recoverDaemonPanic(dc)
		runDaemon(dc, auth, req, task)
	}()
	return &RunResult{ChatID: chatID, Status: "running", RequestID: requestID}, nil
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对单机CLI加人工任务板，平台的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

贡献在于把工作区归属、机器能力选择、队列任务和DSH会话接到同一控制平面，用户不必每次人工选择远程节点并拼接模型配置。相比普通远程桌面，它提供任务/工作区身份和可流式API；相比单CLI，多节点任务组织是实质增量。DSH推理、模型和容器等来自上游或独立组件，不当作Yao原创；价值依赖跨设备需求真实存在，单机脚本可能更简单。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-49](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/README.md#L23-L49)

统一应用及API目标

<details>
<summary>查看原文（27行）</summary>

```text
## How it works

Agents run on your own devices. Every machine you add is another place for them to work, all managed from one place.

## Workspaces

Every workspace is isolated. Work stays separate, managed across all your computers, and accumulates into documents that become your knowledge base.

While working, agents can read what they need from any node.

![Workspaces](https://assets.yaoagents.com/en/workspace/01-workspace-index-en-dark.png)

## Task Board

Say what you need in a conversation, and it becomes a task on your board.

Keep the conversation going, keep it running, and it improves with use, growing into an agent purpose-built for this kind of work.

Connect task agents to your apps, or share them with others.

![Task Board](https://assets.yaoagents.com/en/kanban/09-kanban-daily-en-dark.png)

## Open API

Expert and task agents integrate into your own apps and workflows. They're built on standard APIs, with both SSE and WebSocket support.

Let your agents become part of your business, wherever you need them.
```

</details>

**依据 2 · 源码核查**：[agent/sandbox/v2/node_selector.go:69-107](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/node_selector.go#L69-L107)

节点绑定与能力选择

<details>
<summary>查看原文（39行）</summary>

```text
// SelectNode is the centralised node selection entry point. It implements the
// full decision flow: workspace binding -> filter -> group -> pick.
func SelectNode(nodes []NodeCandidate, criteria *SelectionCriteria) (*SelectionResult, error) {
	if criteria == nil {
		return nil, fmt.Errorf("selection criteria is nil")
	}

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
```

</details>

**依据 3 · 源码核查**：[agent/task/run.go:27-81](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/task/run.go#L27-L81)

任务排队和身份去重

<details>
<summary>查看原文（55行）</summary>

```text
// Run starts or queues a task execution. Atomic operation (no LLM enrichment).
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
		daemonWg.Add(1)
		go func() {
			defer daemonWg.Done()
			select {
			case <-entry.ready:
				defer GlobalQuota.Release(auth.TeamID)
				defer recoverDaemonPanic(dc)
				setStatus(chatID, "running", auth, nil)
				runDaemon(dc, auth, req, task)
			case <-dc.Context.Done():
				GlobalQuota.Dequeue(auth.TeamID, chatID)
				setStatus(chatID, "cancelled", auth, map[string]any{
					"cancelled_at":  time.Now(),
					"cancel_reason": "cancelled_while_queued",
				})
				dc.CloseSubscribers()
				UnregisterDaemon(chatID)
			}
		}()
		pos := GlobalQuota.QueuePosition(auth.TeamID, chatID)
		return &RunResult{ChatID: chatID, Status: "queued", RequestID: requestID, Position: pos}, nil
	}

	setStatus(chatID, "running", auth, map[string]any{"started_at": now})
	incrementRunCount(chatID)
	daemonWg.Add(1)
	go func() {
		defer daemonWg.Done()
		defer GlobalQuota.Release(auth.TeamID)
		defer recoverDaemonPanic(dc)
		runDaemon(dc, auth, req, task)
	}()
	return &RunResult{ChatID: chatID, Status: "running", RequestID: requestID}, nil
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · “隔离”“停止”和“完成”各自容易被误解在哪里？

**研究主题**：缺陷与关键质疑

#### 完整回答

README的workspace隔离应先理解为持久存储和归属组织，不能自动推导每种runner都在OS沙箱内：node选择区分CanBox和CanHost。运行准备会写AGENTS.md和技能目录，停止不会自动撤销。Task.run默认completed而依据timeout/cancel/error改状态，未在该完成分支检查交付物；DSH配置还设置maxTokensAsSuccess=true，因此协议/进程完成不能当业务验收。工作区绑定节点离线可fall-through普通选择，数据最终落位须进一步核查，不据此直接断言已经错写。 另有Prepare写技能、Agent定义和AGENTS.md失败只记录warn继续，正常completed的Cleanup还保留子进程；这使“启动/完成”都不足以证明准备完整或节点已无持续副作用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-31](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/README.md#L27-L31)

作者隔离与跨节点读取声明

```text
## Workspaces

Every workspace is isolated. Work stays separate, managed across all your computers, and accumulates into documents that become your knowledge base.

While working, agents can read what they need from any node.
```

**依据 2 · 源码核查**：[agent/sandbox/v2/node_selector.go:52-64](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/node_selector.go#L52-L64)

容器与Host执行能力不同

<details>
<summary>查看原文（13行）</summary>

```text
		runners := n.Capabilities.Runners
		if len(runners) == 0 {
			runners = InferRunners(n, "")
		}
		out = append(out, NodeCandidate{
			ID:      n.TaiID,
			IsLocal: n.TaiID == "local" && n.Mode == "local",
			Runners: runners,
			CanBox:  n.Capabilities.Docker || n.Capabilities.K8s,
			CanHost: n.Capabilities.HostExec,
			OS:      n.System.OS,
			Arch:    n.System.Arch,
		})
```

</details>

**依据 3 · 源码核查**：[agent/sandbox/v2/node_selector.go:94-107](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/node_selector.go#L94-L107)

绑定失效时回退

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[agent/sandbox/v2/dsh/config.go:25-29](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/config.go#L25-L29)

maxTokensAsSuccess配置

```text
const cordisTemplate = `# Generated by Yao DSH Runner
- id: yaoapp-jsonrpc-stream
  name: '@deepseek-ai/dsh-yaoapp-jsonrpc-stream'
  config:
    maxTokensAsSuccess: true
```

**依据 5 · 源码核查**：[agent/task/run.go:204-238](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/task/run.go#L204-L238)

完成状态按执行错误及异步enrich处理

<details>
<summary>查看原文（35行）</summary>

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

	dc.SetStatus(DaemonStopped)
	logTaskCompleted(dc.ChatID, columnID, task.AssistantID, status, time.Since(daemonStart), finalErr)

	isFirstRun := (task.RunCount <= 1)
	recentTexts := collectConversationText(req.Messages, dc)
	daemonWg.Add(1)
	go func() {
		defer daemonWg.Done()
		enrichTaskResult(dc.ChatID, auth, isFirstRun, finalErr, recentTexts, req.Locale)
```

</details>

**依据 6 · 源码核查**：[agent/sandbox/v2/dsh/runner.go:60-88](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/runner.go#L60-L88)

准备材料写入失败只warn，RunSteps异常才返回失败

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 7 · 源码核查**：[agent/sandbox/v2/dsh/runner.go:181-200](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/runner.go#L181-L200)

正常completed的Cleanup保留child processes，非completed才按session或通用名清理

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

#### 缺口

- 节点掉线回退后的工作区定位、准备警告、遗留子进程及交付完整性未知
  **影响**：不能把重新调度/任务completed当原工作区办结或自动回滚
  **进一步探讨**：在两个可丢弃节点中断绑定节点，核对调度、实际写路径、task状态及验收产物

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些依赖属于平台部署，哪些只属于DSH接入？

**研究主题**：依赖、兼容与流程

#### 完整回答

平台需要Yao运行环境、数据存储/认证和可用Tai节点；源码构建声明Go1.25且有V8、数据库、Docker/K8s等依赖，不能要求用户为了试一插件装整套默认服务。DSH任务另需目标Computer可执行对应平台命令、模型路由与凭据，以及配置模板列出的DSH模块。OpenAPI workspace挂OAuth.Guard并按Owner检查，实际团队/节点授权需独立验收。容器或Host模式是条件分支，不都等价安全。

#### 证据与依据

**依据 1 · 源码核查**：[go.mod:1-3](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/go.mod#L1-L3)

源码构建Go要求

```text
module github.com/yaoapp/yao

go 1.25.0
```

**依据 2 · 源码核查**：[go.mod:38-62](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/go.mod#L38-L62)

依赖栈

<details>
<summary>查看原文（25行）</summary>

```text
	github.com/pkoukk/tiktoken-go v0.1.7
	github.com/pmezard/go-difflib v1.0.0
	github.com/pquerna/otp v1.5.0
	github.com/shirou/gopsutil/v4 v4.26.5
	github.com/spf13/cast v1.9.2
	github.com/spf13/cobra v1.9.1
	github.com/stretchr/testify v1.11.1
	github.com/xuri/excelize/v2 v2.11.0
	github.com/yaoapp/gou v0.10.3
	github.com/yaoapp/kun v0.9.0
	github.com/yaoapp/xun v0.9.0
	go.mongodb.org/mongo-driver v1.17.9
	golang.org/x/crypto v0.55.0
	golang.org/x/image v0.44.0
	golang.org/x/net v0.58.0
	golang.org/x/sys v0.47.0
	golang.org/x/text v0.41.0
	google.golang.org/grpc v1.83.2
	google.golang.org/protobuf v1.36.11
	gopkg.in/natefinch/lumberjack.v2 v2.2.1
	gopkg.in/yaml.v3 v3.0.1
	k8s.io/api v0.34.1
	k8s.io/apimachinery v0.34.1
	k8s.io/client-go v0.34.1
	rogchap.com/v8go v0.9.0
```

</details>

**依据 3 · 源码核查**：[openapi/workspace/workspace.go:26-40](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/openapi/workspace/workspace.go#L26-L40)

workspace API OAuth挂载

<details>
<summary>查看原文（15行）</summary>

```text
// Attach registers workspace management routes on the given group.
//   - GET    /               — list workspaces (filtered by owner from token)
//   - POST   /               — create workspace (owner from token)
//   - GET    /:id            — get workspace (owner check)
//   - PUT    /:id            — update workspace (owner check)
//   - DELETE /:id            — delete workspace (owner check)
//   - GET    /:id/files      — list files
//   - GET    /:id/files/*path — read file
//   - PUT    /:id/files/*path — write file
//   - DELETE /:id/files/*path — delete file
//   - POST   /:id/mkdir      — create directory
//   - POST   /:id/rename     — rename file/directory
//   - GET    /:id/rootdir   — get workspace root directory absolute path
func Attach(group *gin.RouterGroup, oauth types.OAuth) {
	group.Use(oauth.Guard)
```

</details>

**依据 4 · 源码核查**：[openapi/workspace/workspace.go:84-105](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/openapi/workspace/workspace.go#L84-L105)

Owner检查逻辑

<details>
<summary>查看原文（22行）</summary>

```text
// resolveOwner returns TeamID if present, otherwise UserID.
func resolveOwner(authInfo *types.AuthorizedInfo) string {
	if authInfo != nil && authInfo.TeamID != "" {
		return authInfo.TeamID
	}
	if authInfo != nil {
		return authInfo.UserID
	}
	return ""
}

// checkWSOwner verifies the caller owns the workspace.
func checkWSOwner(c *gin.Context, w *ws.Workspace, owner string) bool {
	if owner == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "identity required to access workspace"})
		return false
	}
	if w.Owner != "" && w.Owner != owner {
		c.JSON(http.StatusForbidden, gin.H{"error": "no permission to access this workspace"})
		return false
	}
	return true
```

</details>

**依据 5 · 源码核查**：[agent/sandbox/v2/dsh/config.go:25-40](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/config.go#L25-L40)

DSH connector模块

<details>
<summary>查看原文（16行）</summary>

```text
const cordisTemplate = `# Generated by Yao DSH Runner
- id: yaoapp-jsonrpc-stream
  name: '@deepseek-ai/dsh-yaoapp-jsonrpc-stream'
  config:
    maxTokensAsSuccess: true
{{- if .PiAiRoutes }}

- id: llm-pi-ai
  name: '@deepseek-ai/dsh-llm-pi-ai'
  config:
    providers:
{{- range .PiAiRoutes }}
      {{ .Name }}:
        api: {{ .API }}
        baseURL: {{ .BaseURL }}
        apiKeyEnv: {{ .APIKeyEnv }}
```

</details>

**依据 6 · 源码核查**：[agent/sandbox/v2/dsh/config.go:86-117](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/config.go#L86-L117)

平台shell与子进程

<details>
<summary>查看原文（32行）</summary>

```text
- id: subprocess
  name: '@deepseek-ai/dsh-subprocess-local'

{{- if .IsWindows }}

- id: pwsh
  name: '@deepseek-ai/dsh-pwsh-local'
  config:
    cwd: !!js process.env.DSH_CWD ?? process.cwd()
    timeoutMs: 120000

- id: shell-env
  name: '@deepseek-ai/dsh-shell-env'

- id: tool-pwsh
  name: '@deepseek-ai/dsh-tool-pwsh'

{{- else }}

- id: bash
  name: '@deepseek-ai/dsh-bash-local'
  config:
    cwd: !!js process.env.DSH_CWD ?? process.cwd()
    timeoutMs: 120000

- id: shell-env
  name: '@deepseek-ai/dsh-shell-env'

- id: tool-bash
  name: '@deepseek-ai/dsh-tool-bash'
  config:
    enableRunInBackground: false
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 自托管跨设备便利把哪些成本交给使用者？

**研究主题**：效果与总成本

#### 完整回答

首次包括平台部署、节点接入、模型/权限配置、工作区和数据备份；持续承担机器在线、模型调用、数据库与节点维护，任务并发配额不是费用上限。DSH准备会改AGENTS.md和技能目录；取消先发RPC再shutdown、SIGTERM、强杀，只停止执行不补偿文件或外部动作。退出应先停队列并导出工作区/状态，再回到逐机CLI，已产生副作用由人工核查。金额、人时、失败重试与合格任务成本均未量化。 正常完成会有意保留child processes，因此停队列之外还要由节点管理员核对持续进程；目前没有完整进程/状态退出实证。

#### 证据与依据

**依据 1 · 源码核查**：[agent/sandbox/v2/dsh/runner.go:60-88](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/runner.go#L60-L88)

准备阶段文件副作用

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[agent/task/quota.go:24-43](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/task/quota.go#L24-L43)

并发配额非预算

<details>
<summary>查看原文（20行）</summary>

```text
// GlobalQuota is the singleton quota manager
var GlobalQuota = &QuotaManager{
	running: make(map[string]int),
	queue:   make(map[string]*priorityQueue),
	limits:  make(map[string]int),
}

const defaultQuotaLimit = 9

// TryAcquire atomically checks and increments running count.
// Returns true if slot acquired, false if at limit.
func (qm *QuotaManager) TryAcquire(teamID, roleID string) bool {
	qm.mu.Lock()
	defer qm.mu.Unlock()
	limit := qm.resolveLimit(teamID, roleID)
	if qm.running[teamID] >= limit {
		return false
	}
	qm.running[teamID]++
	return true
```

</details>

**依据 3 · 源码核查**：[agent/sandbox/v2/dsh/session.go:130-181](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/session.go#L130-L181)

分层取消与强杀

<details>
<summary>查看原文（52行）</summary>

```text
func (s *session) watchCancel() func() {
	done := make(chan struct{})
	go func() {
		select {
		case <-s.ctx.Done():
			s.logger.Info("context cancelled, initiating graceful stop")
			stdinOK := true

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

		case <-done:
		}
	}()
	return func() { close(done) }
```

</details>

**依据 4 · 源码核查**：[workspace/workspace.go:40-61](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/workspace/workspace.go#L40-L61)

持久状态与节点归属

<details>
<summary>查看原文（22行）</summary>

```text
const metadataFile = ".workspace.json"

// Workspace is a persistent, user-managed storage entity.
// It is pinned to a specific Tai node (host machine) at creation time;
// containers referencing this workspace are automatically routed to that node.
type Workspace struct {
	ID        string            `json:"id"`
	Name      string            `json:"name"`
	Owner     string            `json:"owner"`
	Node      string            `json:"node"`
	Labels    map[string]string `json:"labels,omitempty"`
	CreatedAt time.Time         `json:"created_at"`
	UpdatedAt time.Time         `json:"updated_at"`
}

// CreateOptions configures a new workspace.
type CreateOptions struct {
	ID     string            // explicit ID; empty = auto-generate (uuid)
	Name   string            // human-readable name
	Owner  string            // user ID
	Node   string            // target Tai node (required)
	Labels map[string]string // arbitrary metadata
```

</details>

**依据 5 · 源码核查**：[agent/sandbox/v2/dsh/runner.go:181-200](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/runner.go#L181-L200)

正常完成保留子进程，不能把停任务当清空节点

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

#### 缺口

- 同任务跨设备部署/维护/中断恢复总人时和资源费用未知
  **影响**：无法判断统一平台是否覆盖自托管负担
  **进一步探讨**：固定两节点任务对照逐机CLI，记录接入、日常操作、取消后清理及总模型费用

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些调度与协议设计可借鉴，哪部分未审阅？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴daemonRegistry的同chat执行去重、团队配额队列、workspace身份绑定和分层取消。DSH会话层区分completed事件、非零退出及零退出但stderr且不完整，避免仅由退出码决定成功；取消尽量先协议结束再强杀，仍需要验证取消后副作用。迁移要携带Computer抽象、chat身份和配置模板，并处理多个平台差异。本轮只抽读这些Go关键路径，inventory的JS/TS/Markdown统计不覆盖Go主体，也不是整个框架审计。

#### 证据与依据

**依据 1 · 源码核查**：[agent/task/run.go:27-81](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/task/run.go#L27-L81)

去重与配额

<details>
<summary>查看原文（55行）</summary>

```text
// Run starts or queues a task execution. Atomic operation (no LLM enrichment).
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
		daemonWg.Add(1)
		go func() {
			defer daemonWg.Done()
			select {
			case <-entry.ready:
				defer GlobalQuota.Release(auth.TeamID)
				defer recoverDaemonPanic(dc)
				setStatus(chatID, "running", auth, nil)
				runDaemon(dc, auth, req, task)
			case <-dc.Context.Done():
				GlobalQuota.Dequeue(auth.TeamID, chatID)
				setStatus(chatID, "cancelled", auth, map[string]any{
					"cancelled_at":  time.Now(),
					"cancel_reason": "cancelled_while_queued",
				})
				dc.CloseSubscribers()
				UnregisterDaemon(chatID)
			}
		}()
		pos := GlobalQuota.QueuePosition(auth.TeamID, chatID)
		return &RunResult{ChatID: chatID, Status: "queued", RequestID: requestID, Position: pos}, nil
	}

	setStatus(chatID, "running", auth, map[string]any{"started_at": now})
	incrementRunCount(chatID)
	daemonWg.Add(1)
	go func() {
		defer daemonWg.Done()
		defer GlobalQuota.Release(auth.TeamID)
		defer recoverDaemonPanic(dc)
		runDaemon(dc, auth, req, task)
	}()
	return &RunResult{ChatID: chatID, Status: "running", RequestID: requestID}, nil
```

</details>

**依据 2 · 源码核查**：[agent/sandbox/v2/dsh/session.go:60-100](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/session.go#L60-L100)

完成与退出/错误分离

<details>
<summary>查看原文（41行）</summary>

```text
func (s *session) runStream(handler message.StreamFunc) (completed bool, err error) {
	s.collectStderr()

	cleanup := s.watchCancel()
	defer cleanup()

	parser := newStreamParser(handler, s.chatID, s.locale, s.prepareLoadingMsgID)
	parseErr := parser.parse(s.ctx, s.exec.Stdout)

	s.logger.Debug("runStream: parse returned completed=%v parseErr=%v", parser.completed, parseErr)

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
```

</details>

**依据 3 · 源码核查**：[agent/sandbox/v2/dsh/session.go:130-181](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/session.go#L130-L181)

分层取消

<details>
<summary>查看原文（52行）</summary>

```text
func (s *session) watchCancel() func() {
	done := make(chan struct{})
	go func() {
		select {
		case <-s.ctx.Done():
			s.logger.Info("context cancelled, initiating graceful stop")
			stdinOK := true

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

		case <-done:
		}
	}()
	return func() { close(done) }
```

</details>

**依据 4 · 源码核查**：[go.mod:1-3](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/go.mod#L1-L3)

Go主体口径

```text
module github.com/yaoapp/yao

go 1.25.0
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 怎样把“任务运行结束”升级为可核查办结？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是给每个任务增加节点/workspace身份、预期产物和独立验收结果三联收据，将执行结束、结果待验和真正办结区分。由任务completed只反映执行错误，以及离线回退和取消副作用推得，可能比继续增加入口更能提高跨设备信任。最小验证在同任务注入max-token终止、节点掉线和产物缺失，对照原状态和三联收据，测错误办结识别率、重复执行及人工核对时间；若不能在副作用发生前锁定身份或维护成本超过收益则否定。此设计未在当前提交证实，不计入现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[agent/task/run.go:204-238](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/task/run.go#L204-L238)

执行状态与结果enrich分离

<details>
<summary>查看原文（35行）</summary>

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

	dc.SetStatus(DaemonStopped)
	logTaskCompleted(dc.ChatID, columnID, task.AssistantID, status, time.Since(daemonStart), finalErr)

	isFirstRun := (task.RunCount <= 1)
	recentTexts := collectConversationText(req.Messages, dc)
	daemonWg.Add(1)
	go func() {
		defer daemonWg.Done()
		enrichTaskResult(dc.ChatID, auth, isFirstRun, finalErr, recentTexts, req.Locale)
```

</details>

**依据 2 · 源码核查**：[agent/sandbox/v2/dsh/config.go:25-29](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/config.go#L25-L29)

maxTokensAsSuccess

```text
const cordisTemplate = `# Generated by Yao DSH Runner
- id: yaoapp-jsonrpc-stream
  name: '@deepseek-ai/dsh-yaoapp-jsonrpc-stream'
  config:
    maxTokensAsSuccess: true
```

**依据 3 · 源码核查**：[agent/sandbox/v2/node_selector.go:94-107](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/node_selector.go#L94-L107)

节点回退边界

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 谁值得限定试用，何时退回分散CLI？

**研究主题**：采用判断

#### 完整回答

当前建议有多机需求且能承担自托管的团队先观察，在隔离节点做架构核验，不把真实业务迁入平台。源码提供集中队列和workspace身份，但准备失败仅warn、正常完成保留子进程，以及离线调度的数据落位尚未闭合。先核对准备完整、节点身份和全部持续进程，再决定是否值得小任务试用；出现不明子进程、completed缺产物或绑定节点掉线时暂停新任务，保留工作区与状态，交由节点管理员手工接管并退回逐机CLI。根仓库不是装入日常DSH的bundle。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/workspace.go:40-61](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/workspace/workspace.go#L40-L61)

workspace/node身份

<details>
<summary>查看原文（22行）</summary>

```text
const metadataFile = ".workspace.json"

// Workspace is a persistent, user-managed storage entity.
// It is pinned to a specific Tai node (host machine) at creation time;
// containers referencing this workspace are automatically routed to that node.
type Workspace struct {
	ID        string            `json:"id"`
	Name      string            `json:"name"`
	Owner     string            `json:"owner"`
	Node      string            `json:"node"`
	Labels    map[string]string `json:"labels,omitempty"`
	CreatedAt time.Time         `json:"created_at"`
	UpdatedAt time.Time         `json:"updated_at"`
}

// CreateOptions configures a new workspace.
type CreateOptions struct {
	ID     string            // explicit ID; empty = auto-generate (uuid)
	Name   string            // human-readable name
	Owner  string            // user ID
	Node   string            // target Tai node (required)
	Labels map[string]string // arbitrary metadata
```

</details>

**依据 2 · 源码核查**：[agent/task/run.go:204-238](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/task/run.go#L204-L238)

独立验收必要性

<details>
<summary>查看原文（35行）</summary>

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

	dc.SetStatus(DaemonStopped)
	logTaskCompleted(dc.ChatID, columnID, task.AssistantID, status, time.Since(daemonStart), finalErr)

	isFirstRun := (task.RunCount <= 1)
	recentTexts := collectConversationText(req.Messages, dc)
	daemonWg.Add(1)
	go func() {
		defer daemonWg.Done()
		enrichTaskResult(dc.ChatID, auth, isFirstRun, finalErr, recentTexts, req.Locale)
```

</details>

**依据 3 · 源码核查**：[agent/sandbox/v2/dsh/session.go:130-181](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/session.go#L130-L181)

取消及退出边界

<details>
<summary>查看原文（52行）</summary>

```text
func (s *session) watchCancel() func() {
	done := make(chan struct{})
	go func() {
		select {
		case <-s.ctx.Done():
			s.logger.Info("context cancelled, initiating graceful stop")
			stdinOK := true

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

		case <-done:
		}
	}()
	return func() { close(done) }
```

</details>

**依据 4 · 源码核查**：[agent/sandbox/v2/dsh/runner.go:181-200](https://github.com/YaoApp/yao/blob/22a7a2c3ea76ad37d19c19bf06457115c79bd7e3/agent/sandbox/v2/dsh/runner.go#L181-L200)

观察而非直接试用由正常完成保留子进程边界支持

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
