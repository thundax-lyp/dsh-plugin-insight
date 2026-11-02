# phi

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ffa6d97](https://github.com/pulseaiclub/phi/tree/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41)

<!-- BEGIN META -->
[![GitHub ★ 809](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=809&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pulseaiclub/phi)
<!-- END META -->

> **功能**：提供终端编码、权限控制、子 Agent、扩展和按需 MCP 工具发现的独立 Go 客户端。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 支持把工具发现与调用接入既有文件工具命名空间，并保留权限链；这是具体集成增量，不宣称渐进发现首创或总费用已降低。

> **主要限制**：[Q02](#research-q02) 核实autopilot源码把Ask转Deny，与README表格冲突；[Q03](#research-q03) 显示--tools不能单独禁止MCP。少量静态定义并不证明正确发现、完整授权或远端副作用可撤销。

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
  - [Q01 · 谁需要按需发现，增量相对什么成立？](#detail-section-11)
  - [Q02 · URL 从发现到远端调用如何经过权限？](#detail-section-12)
  - [Q03 · 接入、退出与失败有什么成本和范围？](#detail-section-13)
  - [Q04 · 当前采用边界和待验证方向是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：配置多个MCP服务的终端开发者，可按任务逐步发现与调用少数工具；本次不覆盖独立客户端全部编码与扩展功能。

直接基线是已有客户端前载全部工具定义，或少量固定工具的手工调用；不假定更多服务器就必然省总token。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP目录 | 查看已配服务器和工具URL | 配置可信，首次使用会连接服务 |
| MCP参数摘要 | 按目标读取SlimTool | 摘要不等于远端语义验证 |
| MCP调用 | write URL携JSON参数触发工具 | 经过KindWrite/Gate，默认外部调用Ask |
| 权限决策 | 扩展前置后按实际参数审批 | 不是OS隔离，模式/绕过会改变边界 |
| 懒连接与关闭 | 复用客户端并在退出时关闭 | 不保证远端业务被撤销 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| phi二进制或Go构建 | 必需 | 独立客户端 | 不是DSH内加载的插件 |
| 模型账号/接入 | 任务必需 | 生成工具计划与答案 | 费用与效果由配置决定，未测 |
| 可信MCP配置与服务 | MCP任务必需 | 目录和远端调用 | 项目同名配置覆盖全局，先审阅 |
| Gate与批准界面 | 外部调用通常必需 | 默认Ask审批 | headless/autopilot Ask转Deny，勿只信README |
| 服务端状态查询 | 有副作用时必需 | 判定超时后的实际结果 | 错误不能证明未执行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户固定模型和用户/项目MCP项 | 同名覆盖符合预期，先只读服务 |
| 发现 | 模型ls目录并read目标参数 | 找到正确工具和充分参数 |
| 调用 | 模型write URL，扩展前置后经过Gate | 批准范围正确，拒绝不发调用 |
| 验收 | 用户查任务结果与完整发现成本 | 不以少schema直接算省钱 |
| 异常/退出 | 用户查服务端结果再重试，禁用MCP并关闭客户端 | 不把关闭连接当远端撤销 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 二进制/构建及模型服务 | 配置MCP和权限、核同名覆盖 | 接入耗时未知 |
| 持续使用 | 模型发现/调用token与服务资源 | 批准、校验参数与任务结果 | 总费用及启动等待未知 |
| 失败恢复 | 诊断、重复调用资源 | 先查询远端实际结果 | 重试幂等取决服务，不由Pool保证 |
| 退出 | 会话和配置留存空间 | 禁用MCP或返回原客户端 | 远端副作用需服务端另行处理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 渐进披露 | 目录URL、参数摘要与按需调用 | 总任务token、漏工具与参数错误 |
| 授权链 | 扩展前置→Gate→调用→后置 | 全入口真实拒绝及外部实现可信度 |
| 懒连接 | 首次使用创建并缓存客户端 | 首任务等待和资源净节省 |
| 退出 | 关闭已创建客户端 | 远端业务取消或回滚 |

> **思考**：[Q02](#research-q02) 核实autopilot源码把Ask转Deny，与README表格冲突；[Q03](#research-q03) 显示--tools不能单独禁止MCP。少量静态定义并不证明正确发现、完整授权或远端副作用可撤销。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 支持把工具发现与调用接入既有文件工具命名空间，并保留权限链；这是具体集成增量，不宣称渐进发现首创或总费用已降低。

[Q02](#research-q02) 参数改写后再生成权限请求、URL调用仍声明KindWrite、Pool与通用工具入口分离值得借鉴；跨宿主移植需保留资源分类和未知远端结果处理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 核实autopilot源码把Ask转Deny，与README表格冲突；[Q03](#research-q03) 显示--tools不能单独禁止MCP。少量静态定义并不证明正确发现、完整授权或远端副作用可撤销。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在可信只读MCP任务中对照试用，保留真实权限配置；漏用工具、拒绝失配或总负担上升就回原客户端。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定Go源码支持有界MCP机制分析，建议只读任务对照试用；未执行客户端或真实服务，不把声明性能计作复现。混合披露是未验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、doc/mcp.md、doc/permissions.md、internal/tools/tooldef/mcpurl.go、internal/tools/writetool/write.go、internal/mcp/pool.go、internal/agent/executor.go、internal/permission/mode.go、internal/permission/builtin.go、internal/mcp/config.go、internal/agent/engine.go、cmd/runloop.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整inventory按本项目JS/TS与Markdown口径，Go不计LOC；checkout是sparse，关键Go文件从固定git blob读取并嵌入。只核MCP工具/Pool、主执行权限链与headless接入，未审计全编码引擎/扩展/子Agent。
- 下一步：固定任务、服务、模型与权限，对照全前载/当前按需/混合策略，检查质量、漏用、参数错误、全部token与人工时间，并在服务端确认拒绝和超时结果。

**分析版本**

- **仓库**：[pulseaiclub/phi](https://github.com/pulseaiclub/phi)
- **版本号**：未声明（[固定提交 ffa6d97](https://github.com/pulseaiclub/phi/tree/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出按任务仅前载高频工具的混合策略，和当前零schema及全量前载比较；若没有降低完整负担或缓存失效增加错误，就否定该新增方案。

固定任务、服务、模型与权限，对照全前载/当前按需/混合策略，检查质量、漏用、参数错误、全部token与人工时间，并在服务端确认拒绝和超时结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 4981 | — | — | 30272 |
| .ts | example | 4 | 195 | 137 | 29 | — |
| .ts | source | 8 | 2692 | 2094 | 355 | — |
| .ts | test | 6 | 1394 | 1251 | 59 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/pulseaiclub/phi/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=32&color=737b86&logo=github)](https://github.com/pulseaiclub/phi/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=32&color=737b86&logo=github)](https://github.com/pulseaiclub/phi/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查MCP按需发现从URL到授权执行的链路及完整成本，而不以静态schema量替代任务价值。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要按需发现，增量相对什么成立？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

phi 是独立 Go 终端编码客户端，不是 DSH 原生插件。这里具体研究配置多个 MCP 服务、但每次任务只用其中少数工具的开发者。它用 mcp:// 地址把服务器工具目录、参数摘要和调用映射到已有 ls/read/write，而不是为每个远端工具向模型添加一份独立定义。engine 将 Pool.ServerNames 传入 systemPrompt，MCPRead 在用户真正读工具端点时才输出 SlimTool 参数摘要。因此与将全部工具 schema 前载的方式相比，静态上下文按配置服务器名和通用入口组织，工具细节后移；这是一项明确的披露流程增量，不等于证明总任务 token 必然更少。

合格任务要选中正确工具、给出有效参数、按批准范围完成结果，且没有因参数缩略漏掉限制。只有一两个固定工具时，直接前载定义可能更省发现往返；不需要迁移客户端的开发者也可在既有宿主做类似按需发现。doc 明确称作 mcptoon way，本轮不将渐进发现归为全球首创。远端完整实现和已安装二进制不在本轮执行范围，用户规模、性能图和启动时间均不能替代这种具体任务的质量证据。

#### 证据与依据

**依据 1 · 作者声明**：[doc/mcp.md:14-34](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/doc/mcp.md#L14-L34)

作者给出前载对照及URL操作，作为场景/比较声明。

<details>
<summary>查看原文（21行）</summary>

```text
## Why this is a highlight

| Pain | Typical MCP host | phi |
| --- | --- | --- |
| Context | All schemas injected at startup | Model sees zero extra tools; URLs ride `ls` / `read` / `write` |
| Many servers | Uninstall / reload Tetris | Always configured; call on demand |
| Permissions | Separate system or wide open | Browsing is read-tier; calls go through the write Gate / Ask / Hooks |
| Footprint | Heavy SDKs, always-on processes | Hand-rolled Go stdio client, lazy start |

MCP is a **URL namespace**, not a tool set. The regular tools gain `mcp://` superpowers:

| Action | Call |
| --- | --- |
| List servers | `ls mcp://` |
| List tools on a server | `ls mcp://<server>/tools/` |
| Inspect one tool's params | `read mcp://<server>/tools/<tool>` |
| Invoke a tool | `write mcp://<server>/tools/<tool>` with content = JSON argument object |

Configured **server names** are listed in the system prompt (like Skills), so the model knows what exists without listing first. Schemas still stay out of context.

Typical rhythm: pick a server from the prompt → `ls mcp://<server>/tools/` → `read mcp://<server>/tools/<tool>` → `write` the arguments.
```

</details>

**依据 2 · 源码核查**：[internal/agent/engine.go:197-214](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/agent/engine.go#L197-L214)

真实prompt传递配置服务器名。

<details>
<summary>查看原文（18行）</summary>

```text
func (engine *Engine) systemPrompt() string {
	var mcpServers []string
	if engine.mcp != nil {
		mcpServers = engine.mcp.ServerNames()
	}
	maxConcurrent := 0
	if engine.jobs != nil {
		maxConcurrent = engine.jobs.MaxConcurrent()
	}
	// Build from the session cwd, not the process cwd: a sub-agent spawned with
	// its own workdir must load that workspace's instructions.
	return prompt.Build(
		engine.SessionCwd(),
		engine.modelCfg.SkillPaths,
		engine.jobs != nil,
		maxConcurrent,
		mcpServers,
	)
```

</details>

**依据 3 · 源码核查**：[internal/tools/tooldef/mcpurl.go:38-69](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/tools/tooldef/mcpurl.go#L38-L69)

目录访问输出工具URL而非完整schema。

<details>
<summary>查看原文（32行）</summary>

```text
func MCPList(ctx context.Context, pool *mcp.Pool, target *MCPTarget) (string, error) {
	if err := requirePool(pool); err != nil {
		return "", err
	}
	switch target.Kind {
	case urls.MCPRoot:
		names := pool.ServerNames()
		if len(names) == 0 {
			return "(no MCP servers configured)", nil
		}
		var b strings.Builder
		b.WriteString("MCP servers:\n")
		for _, name := range names {
			fmt.Fprintf(&b, "  mcp://%s/tools/\n", name)
		}
		return strings.TrimRight(b.String(), "\n"), nil
	case urls.MCPServer:
		return fmt.Sprintf("mcp://%s/tools/", target.Server), nil
	case urls.MCPTools:
		tools, err := pool.ListTools(ctx, target.Server)
		if err != nil {
			return "", fmt.Errorf("failed to list tools on server %q: %w", target.Server, err)
		}
		if len(tools) == 0 {
			return fmt.Sprintf("(no tools on server %q)", target.Server), nil
		}
		var b strings.Builder
		fmt.Fprintf(&b, "Tools on %q:\n", target.Server)
		for _, t := range tools {
			fmt.Fprintf(&b, "  mcp://%s/tools/%s\n", target.Server, t.Name)
		}
		return strings.TrimRight(b.String(), "\n"), nil
```

</details>

**依据 4 · 源码核查**：[internal/tools/tooldef/mcpurl.go:79-92](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/tools/tooldef/mcpurl.go#L79-L92)

显式读取时才返回参数摘要。

<details>
<summary>查看原文（14行）</summary>

```text
// MCPRead returns a compact parameter summary for mcp://<server>/tools/<tool>.
func MCPRead(ctx context.Context, pool *mcp.Pool, target *MCPTarget) (string, error) {
	if err := requirePool(pool); err != nil {
		return "", err
	}
	if target.Kind != urls.MCPTool {
		return "", fmt.Errorf("read expects mcp://<server>/tools/<tool>; list %s first", mcpListURL(target))
	}
	def, err := pool.Inspect(ctx, target.Server, target.Tool)
	if err != nil {
		return "", fmt.Errorf("failed to inspect %q on server %q: %w", target.Tool, target.Server, err)
	}
	header := fmt.Sprintf("@mcp %s/tools/%s", target.Server, target.Tool)
	return header + "\n" + mcp.SlimTool(*def), nil
```

</details>

#### 缺口

- 没有相同任务/模型/服务集合的前载与按需发现对照。
  **影响**：不能把减少静态定义解释成总费用或正确率优势。
  **进一步探讨**：记录schema前载、ls/read/write往返和重试费用，并以相同任务结果验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · URL 从发现到远端调用如何经过权限？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

调用端不是直接绕过执行器的裸RPC。write 工具把路径声明为 KindWrite 权限请求；runWrite 遇到有效 MCP URL 后进入 MCPWrite，解析 JSON 对象再调用 Pool.Call，后者按服务器名取得或创建客户端并调用远端工具。Executor 先执行扩展 PreTool，允许阻止或改参数，再用修改后的参数生成 PermissionRequest；Gate 拒绝或Ask未获批准就不进入 tool.Run，通过后才执行实际远端调用，之后运行扩展 PostTool。读目录和参数是只读发现，实际调用仍被当成外部写动作。默认外部URL写规则是Ask，因为本地不知道远端工具会做什么，这不是操作系统沙箱。

重要反证是不能从URL写入口或“可配置权限”就推全隔离。headless/autopilot 当前代码会把Ask折成Deny，README权限表却把autopilot说成Ask转Allow；doc/permissions和mode.go一致支持Deny，应该按固定源码理解并在启用时核实实际行为。readonly也不等于不执行任何命令，它保留已经Allow的exec，并拒绝委派。--yolo或全局允许会改变上述边界，不能用只选择某些工具当授权依据。

源码已覆盖这条调用权限链，仍未运行真实拒绝/批准，亦未核全部扩展、子Agent和外部服务实现。MCP参数摘要是可用性安排，不验证服务可信度；远端回错或连接断开不能推出远端没有执行副作用。

#### 证据与依据

**依据 1 · 源码核查**：[internal/tools/writetool/write.go:42-48](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/tools/writetool/write.go#L42-L48)

write声明路径与KindWrite。

```text
		tooldef.WithDetail(writeDetail),
		tooldef.WithHandler(func(ctx context.Context, in writeInput) (tooldef.Result, error) {
			return runWrite(ctx, pool, in)
		}),
		tooldef.WithPermission(tooldef.Declaration[writeInput]{
			Kind:  permission.KindWrite,
			Paths: func(in writeInput) ([]string, error) { return []string{in.Path}, nil },
```

**依据 2 · 源码核查**：[internal/tools/writetool/write.go:62-75](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/tools/writetool/write.go#L62-L75)

MCP URL进入调用函数。

<details>
<summary>查看原文（14行）</summary>

```text
func runWrite(ctx context.Context, pool *mcp.Pool, in writeInput) (tooldef.Result, error) {
	path := strings.TrimSpace(in.Path)
	if path == "" {
		return tooldef.Result{}, errors.New("path is required")
	}

	if target, err := tooldef.ParseMCPTarget(path); err != nil {
		return tooldef.Result{}, err
	} else if target != nil {
		body, err := tooldef.MCPWrite(ctx, pool, target, in.Content)
		if err != nil {
			return tooldef.Result{}, err
		}
		return tooldef.Result{Content: body, Detail: target.Server + "/" + target.Tool, Output: body}, nil
```

</details>

**依据 3 · 源码核查**：[internal/tools/tooldef/mcpurl.go:95-117](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/tools/tooldef/mcpurl.go#L95-L117)

参数解析与Pool.Call的接线。

<details>
<summary>查看原文（23行）</summary>

```text
// MCPWrite invokes mcp://<server>/tools/<tool>; content is the JSON argument
// object (empty content means no arguments).
func MCPWrite(ctx context.Context, pool *mcp.Pool, target *MCPTarget, content string) (string, error) {
	if err := requirePool(pool); err != nil {
		return "", err
	}
	if target.Kind != urls.MCPTool {
		return "", fmt.Errorf("write expects mcp://<server>/tools/<tool>; list %s to find tools", mcpListURL(target))
	}
	var args map[string]any
	if trimmed := strings.TrimSpace(content); trimmed != "" {
		if err := json.Unmarshal([]byte(trimmed), &args); err != nil {
			return "", fmt.Errorf("content must be a JSON object of tool arguments: %w", err)
		}
		if args == nil {
			return "", errors.New("content must be a JSON object of tool arguments, not null")
		}
	}
	out, err := pool.Call(ctx, target.Server, target.Tool, args)
	if err != nil {
		return "", fmt.Errorf("MCP call %s/tools/%s failed: %w", target.Server, target.Tool, err)
	}
	return out, nil
```

</details>

**依据 4 · 源码核查**：[internal/mcp/pool.go:89-95](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/mcp/pool.go#L89-L95)

Pool委托客户端实际CallTool。

```text
// Call invokes a tool on a server.
func (p *Pool) Call(ctx context.Context, server, tool string, args map[string]any) (string, error) {
	c, err := p.client(server)
	if err != nil {
		return "", err
	}
	return c.CallTool(ctx, tool, args)
```

**依据 5 · 源码核查**：[internal/agent/executor.go:196-225](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/agent/executor.go#L196-L225)

扩展前置→改参数→权限→执行顺序。

<details>
<summary>查看原文（30行）</summary>

```text
	// ExtensionPre → Gate → Run → ExtensionPost. Pre runs before permission Ask
	// so org policy can deny without prompting the user.
	var preContext string
	newArgs, blocked, reason, ctxText := e.ext.PreTool(ctx, call.Function.Name, call.ID, args)
	preContext = ctxText
	if blocked {
		if reason == "" {
			reason = "tool execution denied by extension"
		}
		reason = appendExtContext(reason, preContext)
		e.ext.EmitToolExecutionEnd(call.Function.Name, call.ID, true)
		return e.rejectResult(call, detail, reason, emit), false, ""
	}
	if len(newArgs) > 0 {
		args = newArgs
		if tool.DetailFromArgs != nil {
			if d := tool.DetailFromArgs(args); d != "" {
				detail = d
			}
		} else {
			detail = string(args)
		}
	}

	if msg, rejected := e.checkPermission(ctx, call, args, detail, emit); rejected {
		e.ext.EmitToolExecutionEnd(call.Function.Name, call.ID, true)
		return msg, false, ""
	}

	result, err := tool.Run(tooldef.WithToolCallID(ctx, call.ID), args)
```

</details>

**依据 6 · 源码核查**：[internal/agent/executor.go:288-335](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/agent/executor.go#L288-L335)

请求生成、Deny和Ask处理。

<details>
<summary>查看原文（48行）</summary>

```text
func (e *Executor) checkPermission(
	ctx context.Context,
	call llm.ToolCall,
	args json.RawMessage,
	detail string,
	emit func(session.ToolData) bool,
) (llm.Message, bool) {
	req, err := e.registry.PermissionRequest(call.Function.Name, args, e.cwd)
	if err != nil {
		reason := fmt.Sprintf("permission check failed: %v", err)
		return e.rejectResult(call, detail, reason, emit), true
	}

	dec, reason := e.gate.Check(ctx, req)
	switch dec {
	case permission.Allow:
		return llm.Message{}, false
	case permission.Deny:
		if reason == "" {
			reason = "tool execution denied by permissions"
		}
		return e.rejectResult(call, detail, reason, emit), true
	case permission.Ask:
		if e.ask == nil {
			if reason == "" {
				reason = "tool requires approval but no ask handler is configured"
			}
			return e.rejectResult(call, detail, reason, emit), true
		}
		res, askErr := func() (permission.AskResult, error) {
			e.askMu.Lock()
			defer e.askMu.Unlock()
			return e.ask(ctx, req, reason)
		}()
		if askErr != nil {
			msg := fmt.Sprintf("approval failed: %v", askErr)
			return e.rejectResult(call, detail, msg, emit), true
		}
		if !res.Approved {
			msg := "tool execution rejected by user"
			if res.Feedback != "" {
				msg = "This tool call was rejected by the user with feedback: " + res.Feedback
			}
			return e.rejectResult(call, detail, msg, emit), true
		}
		return llm.Message{}, false
	default:
		return e.rejectResult(call, detail, "unknown permission decision", emit), true
```

</details>

**依据 7 · 源码核查**：[internal/permission/builtin.go:97-112](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/permission/builtin.go#L97-L112)

URL调用默认Ask，非文件工作区规则。

<details>
<summary>查看原文（16行）</summary>

```text
// externalCallRules prompt instead of deciding: what a remote resource does is
// not observable here. A remote call is an external action rather than a file
// operation, so the workspace-only denies above must not swallow it first.
func externalCallRules(p Policy) []Rule {
	rules := []Rule{{
		Kind:     KindWrite,
		Resource: ResourceURL,
		Decision: Ask,
		Reason:   "external tool call requires approval: %s",
	}}
	if p.WorkspaceOnlyReads {
		rules = append(rules, Rule{
			Kind:     KindRead,
			Resource: ResourceURL,
			Decision: Ask,
			Reason:   "external resource read requires approval: %s",
```

</details>

**依据 8 · 源码核查**：[internal/permission/mode.go:29-57](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/permission/mode.go#L29-L57)

模式折叠的源码事实，autopilot Ask→Deny。

<details>
<summary>查看原文（29行）</summary>

```text
// foldMode applies mode. Interactive reports the gate's decision unchanged;
// readonly denies mutations and unknown asks outright; autopilot and
// headless-strict have nowhere to prompt, so Ask becomes Deny.
func foldMode(mode Mode, dec Decision, reason string, req Request) (Decision, string) {
	switch mode {
	case "", ModeInteractive:
		return dec, reason

	case ModeReadonly:
		if mutates(req) {
			// Allowlisted bash already passed the deny list; readonly does not
			// forbid reading through a command.
			if req.Kind == KindExec && dec == Allow {
				return Allow, reason
			}
			if dec == Allow || dec == Ask {
				return Deny, readonlyReason(req, reason)
			}
		}
		if dec == Ask {
			return Deny, askFoldReason(reason, mode)
		}
		return dec, reason

	case ModeAutopilot, ModeHeadlessStrict:
		if dec == Ask {
			return Deny, askFoldReason(reason, mode)
		}
		return dec, reason
```

</details>

**依据 9 · 作者声明**：[README.md:449-458](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/README.md#L449-L458)

作者权限表存在autopilot描述冲突。

<details>
<summary>查看原文（10行）</summary>

```text
`permissions:` in `~/.phi/config.yaml`.

Modes:

| Mode               | Behavior                                            |
| ------------------ | --------------------------------------------------- |
| `interactive`      | Default. `ask` decisions prompt in the TUI.         |
| `readonly`         | Deny writes / bash; read tools still work.          |
| `autopilot`        | Fold `ask` → allow, run unattended.                 |
| `headless-strict`  | Fold `ask` → deny (used by `phi run`).              |
```

</details>

#### 缺口

- 未执行权限拒绝、扩展改参、headless或远端副作用任务。
  **影响**：源码链支持机制但不能证明全部入口真实生效或服务安全。
  **进一步探讨**：在隔离环境核对只读、Ask、拒绝、改参和超时，并在服务端查看实际执行记录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 接入、退出与失败有什么成本和范围？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

配置合并先读用户 ~/.phi/mcp.json，再读项目配置，同名项目项覆盖用户项。采用者必须检查项目文件中的启动命令、URL和凭据来源，而不能只检查全局配置。Pool 只包住配置映射，第一次List/Inspect/Call才NewClient并缓存；Pool.Close尝试关闭已创建客户端。headless 入口在选择内建工具前加载Pool，并把Pool交给引擎，所以 --tools 选择的 read/write/ls 仍能解析 MCP URL，它不是禁止远端能力的完整边界。要明确禁用MCP，应检查配置和 PHI_MCP=off，而不是猜测工具列表已排除它。

首次投入包括phi二进制或Go构建、模型账号配置、MCP服务和权限核对；持续投入包含发现目录、参数读取、调用往返、服务启动与模型费用。懒启动把成本从启动时移到第一次任务，不会消除远端服务费用或等待。失败后客户端返回错误，但远端业务可能已执行，用户应先在服务端查询状态/操作ID，再决定重试；本轮没有发现可在所有MCP服务上统一提供业务回滚或幂等的证据。退出客户端和关闭连接也不能当成取消远端业务。

对相同合格任务，需计入前载schema和按需探索的全部token、延迟、无效参数重试及人工批准。没有这些数据，不能由README的多平台性能图比较总体效率，也不能用本仓库缺少Go LOC统计解释成实现很小或无代码。

#### 证据与依据

**依据 1 · 源码核查**：[internal/mcp/config.go:65-95](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/mcp/config.go#L65-L95)

项目同名配置覆盖用户项。

<details>
<summary>查看原文（31行）</summary>

```text
// Load merges ~/.phi/mcp.json with the project config at projectConfigPath
// (project overrides same name). Missing files yield an empty map without error.
func Load(projectConfigPath string) (map[string]ServerConfig, error) {
	servers := map[string]ServerConfig{}
	userPath, err := UserConfigPath()
	if err != nil {
		return nil, err
	}
	if err := mergeFile(userPath, servers); err != nil {
		return nil, err
	}
	if err := mergeFile(projectConfigPath, servers); err != nil {
		return nil, err
	}
	return servers, nil
}

func mergeFile(path string, into map[string]ServerConfig) error {
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return fmt.Errorf("read mcp config %s: %w", path, err)
	}
	var doc fileShape
	if err := json.Unmarshal(data, &doc); err != nil {
		return fmt.Errorf("parse mcp config %s: %w", path, err)
	}
	maps.Copy(into, doc.Servers)
	return nil
```

</details>

**依据 2 · 源码核查**：[internal/mcp/pool.go:27-48](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/mcp/pool.go#L27-L48)

构造Pool并不连接服务。

<details>
<summary>查看原文（22行）</summary>

```text
// NewPool wraps a server config map. Pass nil/empty for a no-op pool.
func NewPool(servers map[string]ServerConfig) *Pool {
	if servers == nil {
		servers = map[string]ServerConfig{}
	}
	return &Pool{
		servers: servers,
		clients: map[string]Client{},
	}
}

// LoadPool loads config for projectConfigPath (e.g. <root>/.phi/mcp.json)
// and returns a pool, or nil when disabled.
func LoadPool(projectConfigPath string) (*Pool, error) {
	if Disabled() {
		return nil, nil
	}
	servers, err := Load(projectConfigPath)
	if err != nil {
		return nil, err
	}
	return NewPool(servers), nil
```

</details>

**依据 3 · 源码核查**：[internal/mcp/pool.go:149-184](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/mcp/pool.go#L149-L184)

客户端懒创建/缓存与关闭。

<details>
<summary>查看原文（36行）</summary>

```text
// Close shuts down all live clients.
func (p *Pool) Close() error {
	if p == nil {
		return nil
	}
	p.mu.Lock()
	defer p.mu.Unlock()
	var first error
	for name, c := range p.clients {
		if err := c.Close(); err != nil && first == nil {
			first = err
		}
		delete(p.clients, name)
	}
	return first
}

func (p *Pool) client(server string) (Client, error) {
	if p == nil {
		return nil, errors.New("mcp pool is nil")
	}
	p.mu.Lock()
	defer p.mu.Unlock()
	if c, ok := p.clients[server]; ok {
		return c, nil
	}
	cfg, ok := p.servers[server]
	if !ok {
		return nil, fmt.Errorf("unknown mcp server %q", server)
	}
	c, err := NewClient(server, cfg)
	if err != nil {
		return nil, err
	}
	p.clients[server] = c
	return c, nil
```

</details>

**依据 4 · 源码核查**：[cmd/runloop.go:78-105](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/cmd/runloop.go#L78-L105)

内建工具选择前加载Pool并传递引擎。

<details>
<summary>查看原文（28行）</summary>

```text
	// Load the pool before tool selection so an explicit --tools list still
	// gets MCP-aware ls/read/write.
	var mcpPool *mcp.Pool
	if pool, err := mcp.LoadPool(bs.Proj.MCPConfigFile()); err != nil {
		fmt.Fprintln(os.Stderr, "warning: mcp:", err)
	} else if pool != nil {
		mcpPool = pool
		defer func() { _ = pool.Close() }()
	}
	engineOpts := []agent.EngineOption{
		agent.WithGate(bs.Gate),
		agent.WithExtensions(extRunner),
	}
	if opts.builtinTools != "" {
		selected, err := selectBuiltinTools(opts.builtinTools, mcpPool)
		if err != nil {
			fmt.Fprintln(os.Stderr, "phi run:", err)
			return exitCode(ExitUsage)
		}
		engineOpts = append(engineOpts, agent.WithTools(selected))
	}
	if opts.maxRounds > 0 {
		engineOpts = append(engineOpts, agent.WithMaxRounds(opts.maxRounds))
	}
	primary := bs.Config.Model()
	engineOpts = append(engineOpts, agent.WithHooks(model.HooksForConfig(primary)))
	if mcpPool != nil {
		engineOpts = append(engineOpts, agent.WithMCP(mcpPool))
```

</details>

**依据 5 · 源码核查**：[internal/tools/tooldef/mcpurl.go:113-117](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/tools/tooldef/mcpurl.go#L113-L117)

调用错误被返回，未构成业务未执行证明。

```text
	out, err := pool.Call(ctx, target.Server, target.Tool, args)
	if err != nil {
		return "", fmt.Errorf("MCP call %s/tools/%s failed: %w", target.Server, target.Tool, err)
	}
	return out, nil
```

#### 缺口

- 没有完整费用、首调用等待、实际重试和远端状态查询结果。
  **影响**：无法量化净成本或保障超时重试幂等。
  **进一步探讨**：固定服务、账号和任务，记录完整往返与远端实际结果，优先只读样例，再单独评估有副作用服务。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前采用边界和待验证方向是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前可给终端开发者一条受控试用路径，先仅配置可信只读MCP服务，固定模型和任务，与已有客户端完成相同结果；核对模型是否发现正确工具、参数摘要是否足够、拒绝是否在服务端确实没有调用，以及全部发现成本。不要先开 --yolo 来让演示顺利，因为那会改变正在评估的授权条件。若工具持续漏用、参数重试增多、权限行为与配置不符或完整费用不降，就停用MCP适配并回到原客户端或原文档手工调用。

有依据的假设是“按任务和调用频率选择性前载少数工具，保留其余按需发现”，可能比一律零schema更经济。推导来自Q01的静态节省与Q03的首次发现成本相抵；不是声称当前没有参数摘要或懒连接。最小对照使用相同服务集合与任务，一组全量前载、一组当前零schema、一组仅前载高频工具，固定模型、预算和权限，衡量合格率、遗漏工具、参数错误、发现轮数、总token、服务启动和人工时间。若零schema已同样便宜且准确，或混合策略缓存陈旧增加错误，应否定该新增策略。该假设未实现，不能算当前phi已经兑现的创新。

#### 证据与依据

**依据 1 · 源码核查**：[internal/tools/tooldef/mcpurl.go:38-92](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/tools/tooldef/mcpurl.go#L38-L92)

现有目录/摘要是待改方案的明确基线。

<details>
<summary>查看原文（55行）</summary>

```text
func MCPList(ctx context.Context, pool *mcp.Pool, target *MCPTarget) (string, error) {
	if err := requirePool(pool); err != nil {
		return "", err
	}
	switch target.Kind {
	case urls.MCPRoot:
		names := pool.ServerNames()
		if len(names) == 0 {
			return "(no MCP servers configured)", nil
		}
		var b strings.Builder
		b.WriteString("MCP servers:\n")
		for _, name := range names {
			fmt.Fprintf(&b, "  mcp://%s/tools/\n", name)
		}
		return strings.TrimRight(b.String(), "\n"), nil
	case urls.MCPServer:
		return fmt.Sprintf("mcp://%s/tools/", target.Server), nil
	case urls.MCPTools:
		tools, err := pool.ListTools(ctx, target.Server)
		if err != nil {
			return "", fmt.Errorf("failed to list tools on server %q: %w", target.Server, err)
		}
		if len(tools) == 0 {
			return fmt.Sprintf("(no tools on server %q)", target.Server), nil
		}
		var b strings.Builder
		fmt.Fprintf(&b, "Tools on %q:\n", target.Server)
		for _, t := range tools {
			fmt.Fprintf(&b, "  mcp://%s/tools/%s\n", target.Server, t.Name)
		}
		return strings.TrimRight(b.String(), "\n"), nil
	default:
		return "", fmt.Errorf(
			"cannot list a tool endpoint; read mcp://%s/tools/%s to inspect it",
			target.Server,
			target.Tool,
		)
	}
}

// MCPRead returns a compact parameter summary for mcp://<server>/tools/<tool>.
func MCPRead(ctx context.Context, pool *mcp.Pool, target *MCPTarget) (string, error) {
	if err := requirePool(pool); err != nil {
		return "", err
	}
	if target.Kind != urls.MCPTool {
		return "", fmt.Errorf("read expects mcp://<server>/tools/<tool>; list %s first", mcpListURL(target))
	}
	def, err := pool.Inspect(ctx, target.Server, target.Tool)
	if err != nil {
		return "", fmt.Errorf("failed to inspect %q on server %q: %w", target.Tool, target.Server, err)
	}
	header := fmt.Sprintf("@mcp %s/tools/%s", target.Server, target.Tool)
	return header + "\n" + mcp.SlimTool(*def), nil
```

</details>

**依据 2 · 源码核查**：[internal/mcp/pool.go:166-184](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/internal/mcp/pool.go#L166-L184)

首次连接成本后移。

<details>
<summary>查看原文（19行）</summary>

```text
func (p *Pool) client(server string) (Client, error) {
	if p == nil {
		return nil, errors.New("mcp pool is nil")
	}
	p.mu.Lock()
	defer p.mu.Unlock()
	if c, ok := p.clients[server]; ok {
		return c, nil
	}
	cfg, ok := p.servers[server]
	if !ok {
		return nil, fmt.Errorf("unknown mcp server %q", server)
	}
	c, err := NewClient(server, cfg)
	if err != nil {
		return nil, err
	}
	p.clients[server] = c
	return c, nil
```

</details>

**依据 3 · 源码核查**：[cmd/runloop.go:78-105](https://github.com/pulseaiclub/phi/blob/ffa6d970ba9eebb5a2776abc26afa1d51dde4c41/cmd/runloop.go#L78-L105)

试用必须保留真实Pool与权限接线。

<details>
<summary>查看原文（28行）</summary>

```text
	// Load the pool before tool selection so an explicit --tools list still
	// gets MCP-aware ls/read/write.
	var mcpPool *mcp.Pool
	if pool, err := mcp.LoadPool(bs.Proj.MCPConfigFile()); err != nil {
		fmt.Fprintln(os.Stderr, "warning: mcp:", err)
	} else if pool != nil {
		mcpPool = pool
		defer func() { _ = pool.Close() }()
	}
	engineOpts := []agent.EngineOption{
		agent.WithGate(bs.Gate),
		agent.WithExtensions(extRunner),
	}
	if opts.builtinTools != "" {
		selected, err := selectBuiltinTools(opts.builtinTools, mcpPool)
		if err != nil {
			fmt.Fprintln(os.Stderr, "phi run:", err)
			return exitCode(ExitUsage)
		}
		engineOpts = append(engineOpts, agent.WithTools(selected))
	}
	if opts.maxRounds > 0 {
		engineOpts = append(engineOpts, agent.WithMaxRounds(opts.maxRounds))
	}
	primary := bs.Config.Model()
	engineOpts = append(engineOpts, agent.WithHooks(model.HooksForConfig(primary)))
	if mcpPool != nil {
		engineOpts = append(engineOpts, agent.WithMCP(mcpPool))
```

</details>

#### 缺口

- 混合前载尚无实现或同条件结果。
  **影响**：不能给当前功能加节省效果或需求证明。
  **进一步探讨**：预先固定任务、质量判据和服务版本后比较三策略，计入维护失效与人工成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
