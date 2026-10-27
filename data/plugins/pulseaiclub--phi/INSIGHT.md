# phi

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[be915a2](https://github.com/pulseaiclub/phi/tree/be915a2d5acbfa525ab16d11caa3df7c62158cf3)

<!-- BEGIN META -->
[![GitHub ★ 681](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=681&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pulseaiclub/phi)
<!-- END META -->

> **功能**：提供多模型、技能、子 Agent、权限控制与渐进 MCP 工具访问的终端编码客户端。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 的增量是将 MCP 工具发现、详情与调用映射到既有文件工具；减少静态工具定义并保留按需探索路径，实际总 token 未测。

> **主要限制**：[Q02](#research-q02) 未完整核验全部 Agent 调度权限链，[Q03](#research-q03) 显示 --tools 仅约束内建工具；渐进披露不能自动代表完整隔离或远端副作用可撤销。

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
  - [Q01 · phi 是 DSH 插件还是独立客户端，渐进 MCP 解决什么任务？](#detail-section-11)
  - [Q02 · read/write 如何到达 MCP，权限声明覆盖到哪里？](#detail-section-12)
  - [Q03 · 接入、持续和失败成本由谁承担？](#detail-section-13)
  - [Q04 · 谁值得试用，怎样反证渐进披露节省总成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：终端开发者连接多个 MCP 服务，在编码任务中按需发现与调用工具。

比较启动时预载全部 MCP 工具 Schema 的编码客户端；已有少量固定工具时直接预载更简单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 渐进 MCP | 按需读取工具定义与调用 | 需要服务配置，不证明业务成功 |
| 无头任务 | 输出机器可读事件 | ask 默认拒绝，工具范围须另核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| phi 二进制或 Go 构建环境 | 必需 | 启动独立客户端 | 无法运行 |
| 模型配置 | 必需 | 编码推理 | 无法完成 Agent 任务 |
| MCP 服务及账号 | 对应操作必需 | 远端工具 | 工具查询或调用失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者配置模型和只读权限 | 能启动且不跳过权限 |
| 发现 | Agent 列服务并读取工具 | 找到正确参数 |
| 调用 | Agent 通过 write 传参数 | 检查远端业务结果 |
| 验收 | 用户比较任务和总 token | 无收益回原客户端 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 二进制或构建资源 | 模型和 MCP 配置 | 耗时未知 |
| 持续使用 | 模型和远端服务费用 | 管理权限与任务核对 | 未测总 token |
| 失败恢复 | 重试资源 | 核对远端结果再决定重试 | 无业务回滚保证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工具发现 | URL 访问工具信息及调用 | 相对预载总成本 |
| 权限策略 | URL 与文件主体分离 | 全调用链和真实拒绝结果 |

> **思考**：[Q02](#research-q02) 未完整核验全部 Agent 调度权限链，[Q03](#research-q03) 显示 --tools 仅约束内建工具；渐进披露不能自动代表完整隔离或远端副作用可撤销。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 的增量是将 MCP 工具发现、详情与调用映射到既有文件工具；减少静态工具定义并保留按需探索路径，实际总 token 未测。

[Q02](#research-q02) MCP Pool 和工具入口分离便于复用；Go 文件不在本仓库 JS/TS LOC 口径中，不能将统计缺失当实现规模为零。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 未完整核验全部 Agent 调度权限链，[Q03](#research-q03) 显示 --tools 仅约束内建工具；渐进披露不能自动代表完整隔离或远端副作用可撤销。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只读任务中对照试用，核对全部工具调用、任务正确性及额外发现费用；失配则回原客户端。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

URL 分发和按需客户端有源码支持；完整权限覆盖及任务收益未独立验证。

- 已检查：作者 README、包清单、源码路径 README.md、internal/tools/writetool/write.go、internal/tools/readtool/read.go、internal/mcp/pool.go、internal/permission/gate.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：独立客户端的 MCP URL、池与权限主体，以及 README；未覆盖整个编码引擎与全部扩展协议。
- 下一步：比较同模型同 MCP 的完整预载与按需披露，并测试只读拒绝和写操作未知结果；未执行。

**分析版本**

- **仓库**：[pulseaiclub/phi](https://github.com/pulseaiclub/phi)
- **版本号**：未声明（[固定提交 be915a2](https://github.com/pulseaiclub/phi/tree/be915a2d5acbfa525ab16d11caa3df7c62158cf3)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出以合格任务总 token 检验渐进披露；若额外探索抵消 Schema 减少，或漏用工具增加，则否定成本优势。

比较同模型同 MCP 的完整预载与按需披露，并测试只读拒绝和写操作未知结果；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 4891 | — | — | 29687 |
| .ts | example | 4 | 195 | 137 | 29 | — |
| .ts | source | 8 | 2692 | 2094 | 355 | — |
| .ts | test | 6 | 1394 | 1251 | 59 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/pulseaiclub/phi/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=32&color=737b86&logo=github)](https://github.com/pulseaiclub/phi/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 34](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=34&color=737b86&logo=github)](https://github.com/pulseaiclub/phi/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：渐进 MCP 能否在多工具编码任务中减少总负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · phi 是 DSH 插件还是独立客户端，渐进 MCP 解决什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

phi 是独立 Go 编码客户端，不是 DSH 插件。用户在终端或无头任务中读写代码，并连接多个 MCP 服务；其具体增量是用已有 ls/read/write 工具把服务工具作为 URL 名字空间按需发现，而非启动时给模型全部工具 Schema。原办法完整预载能减少探索步骤，本方案减少未使用工具描述但增加先列举再读取的调用。README 的体积、首帧与节省数字属于作者陈述，本轮不据此判断真实任务成本优势。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:101-113](https://github.com/pulseaiclub/phi/blob/be915a2d5acbfa525ab16d11caa3df7c62158cf3/README.md#L101-L113)

独立 CLI 与核心工具的作者说明。

<details>
<summary>查看原文（13行）</summary>

````text
Or build from source (Go 1.26.3+, see `go.mod`):

```sh
make build          # produces ./phi
make install        # build and install into $GOBIN
```

On first start, phi automatically creates `~/.phi/{bin,skills,hooks,session}`. Search
tools (`fd`, `rg`) download into `~/.phi/bin` in the background when missing.

The TUI gives the model four core tools — `read`, `write`, `edit`, and
`bash` — plus `grep`, `find`, and `ls`. The model uses these to
fulfill your requests. External HTTP fetch is available via MCP when configured.
````

</details>

**依据 2 · 作者声明**：[README.md:519-544](https://github.com/pulseaiclub/phi/blob/be915a2d5acbfa525ab16d11caa3df7c62158cf3/README.md#L519-L544)

渐进 MCP 对比及操作路径。

<details>
<summary>查看原文（26行）</summary>

````text
## MCP

**Configure 100 MCP servers. Pay ~0 schema tokens until you call one.**

Most MCP hosts dump every `tools/list` schema into the model context before
you ask a question — browser stacks alone can burn 50k+ tokens. phi does not.

Instead MCP is a **URL namespace** on the regular tools, and the system prompt lists configured **server names** (no schemas):

| Action | Call |
| --- | --- |
| List tools on a server | `ls mcp://<server>/tools/` |
| Fetch a slim parameter summary | `read mcp://<server>/tools/<tool>` |
| Invoke | `write mcp://<server>/tools/<tool>` with content = JSON args |

Flow: pick a server from the prompt → `ls` → `read` → `write`. Subprocesses start **lazily** on first use.
Browsing is read-tier; invokes still go through PreHooks → write Gate / Ask → Run → PostHooks.

```sh
phi mcp add browsermcp -- npx @browsermcp/mcp@latest
phi mcp doctor
# In the TUI, the model can use configured servers without guessing MCP exists
```

Config: `~/.phi/mcp.json` (project `<cwd>/.phi/mcp.json` overrides by name).
Disable with `PHI_MCP=off`. Stdio and HTTP in v1.
````

</details>

#### 缺口

- 无同任务全部 token 对照
  **影响**：不能宣称节省比例
  **进一步探讨**：记录发现、读取、调用及模型重复推理的总 token

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · read/write 如何到达 MCP，权限声明覆盖到哪里？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

write 的 runWrite 先解析 MCP URL，命中则交 MCPWrite 并返回远端正文，否则进入本地建目录和写文件；因此 URL 名字空间确实接在现有工具入口。Pool 的 ListTools、Inspect、Call 分别查客户端并调用，client 在首次需求时创建并缓存客户端，未知服务返回错误。权限 Gate 将 URL 保留为 URL 主体，并将普通路径解析成真实位置再评规则，这有助于避免将远端地址当成本地文件权限。这里实查了分发和策略主体，尚未逐层核完整个 Agent 调度前后钩子，因此不能把 README 的完整权限承诺升级为已证明全部调用不可绕过。

#### 证据与依据

**依据 1 · 源码核查**：[internal/tools/writetool/write.go:62-89](https://github.com/pulseaiclub/phi/blob/be915a2d5acbfa525ab16d11caa3df7c62158cf3/internal/tools/writetool/write.go#L62-L89)

MCP 分支与本地写入在同一个实际入口。

<details>
<summary>查看原文（28行）</summary>

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
	}

	path, err := tooldef.ResolveToCwd(ctx, path)
	if err != nil {
		return tooldef.Result{}, err
	}

	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return tooldef.Result{}, fmt.Errorf("failed to create parent directories: %w", err)
	}

	//nolint:gosec // G306: source files should stay world-readable
	if err := os.WriteFile(path, []byte(in.Content), 0o644); err != nil {
		return tooldef.Result{}, fmt.Errorf("failed to write file %s: %w", path, err)
```

</details>

**依据 2 · 源码核查**：[internal/mcp/pool.go:71-95](https://github.com/pulseaiclub/phi/blob/be915a2d5acbfa525ab16d11caa3df7c62158cf3/internal/mcp/pool.go#L71-L95)

远端列表、详情和调用方法。

<details>
<summary>查看原文（25行）</summary>

```text
// ListTools lists tools for a server (lazy connect).
func (p *Pool) ListTools(ctx context.Context, server string) ([]ToolDefinition, error) {
	c, err := p.client(server)
	if err != nil {
		return nil, err
	}
	return c.ListTools(ctx)
}

// Inspect returns one tool definition.
func (p *Pool) Inspect(ctx context.Context, server, tool string) (*ToolDefinition, error) {
	c, err := p.client(server)
	if err != nil {
		return nil, err
	}
	return c.FindTool(ctx, tool)
}

// Call invokes a tool on a server.
func (p *Pool) Call(ctx context.Context, server, tool string, args map[string]any) (string, error) {
	c, err := p.client(server)
	if err != nil {
		return "", err
	}
	return c.CallTool(ctx, tool, args)
```

</details>

**依据 3 · 源码核查**：[internal/mcp/pool.go:166-184](https://github.com/pulseaiclub/phi/blob/be915a2d5acbfa525ab16d11caa3df7c62158cf3/internal/mcp/pool.go#L166-L184)

按需客户端创建、缓存与未知服务错误。

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

**依据 4 · 源码核查**：[internal/permission/gate.go:72-101](https://github.com/pulseaiclub/phi/blob/be915a2d5acbfa525ab16d11caa3df7c62158cf3/internal/permission/gate.go#L72-L101)

URL 与真实文件路径分开评估。

<details>
<summary>查看原文（30行）</summary>

```text
// subjects splits a request into the things rules look at: the command, or one
// subject per path. URLs stay verbatim; files resolve once, up front, so every
// rule compares the same spelling. A path that cannot be resolved denies the
// whole call: an unjudgeable path must not fall through to allow.
func (g *staticGate) subjects(req Request) (subjectSet, string) {
	env := newCheckEnv(g.workspaceReal, len(req.Paths))
	if req.Kind == KindExec {
		// Commands are matched and quoted trimmed: the policy regexes were
		// always anchored against the trimmed spelling.
		return subjectSet{
			env:      env,
			subjects: []subject{{kind: subjectCommand, text: strings.TrimSpace(req.Command)}},
		}, ""
	}
	if len(req.Paths) == 0 {
		return subjectSet{env: env, subjects: []subject{{kind: subjectNone}}}, ""
	}
	out := make([]subject, 0, len(req.Paths))
	for _, path := range req.Paths {
		if IsInternalURL(path) {
			out = append(out, subject{kind: subjectURL, text: path})
			continue
		}
		real, err := env.resolve(path)
		if err != nil {
			return subjectSet{}, fmt.Sprintf("cannot resolve path %q: %v", path, err)
		}
		out = append(out, subject{kind: subjectPath, text: path, real: real})
	}
	return subjectSet{env: env, subjects: out}, ""
```

</details>

#### 缺口

- Agent 全调度链与所有扩展入口未逐层核验
  **影响**：不能宣称完整权限不变量已验证
  **进一步探讨**：针对 MCP 写操作和扩展调用补录授权拒绝、超时及重复执行用例

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 接入、持续和失败成本由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

客户端启动需要发布二进制或 Go 源码构建，以及模型配置；MCP 操作还需相应服务器、账号和权限。无头模式对 ask 拒绝，--tools 仅限制内建工具而 MCP 和 Agent 工具仍会追加，不能把工具名单当完整隔离边界；--yolo 跳过权限应避免用于普通试用。渐进发现可以减少未使用 Schema，但远端服务成本与模型总费用不因此归零。失败时需判断远端操作是否已经发生，再决定重试；源码返回错误本身不足以证明外部副作用回滚。用户可禁用 MCP 或退回现有编码客户端，迁移会话及配置的时间未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:81-109](https://github.com/pulseaiclub/phi/blob/be915a2d5acbfa525ab16d11caa3df7c62158cf3/README.md#L81-L109)

模型配置和安装、构建前提。

<details>
<summary>查看原文（29行）</summary>

````text
First launch needs a model. Open the config editor (creates `~/.phi` layout
and writes `~/.phi/config.yaml`):

```sh
phi config
```

Or set env vars for a one-off run:

```sh
export PHI_MODEL=gpt-4o
export PHI_API_KEY=sk-...
```

Then start the TUI:

```sh
phi
```

Or build from source (Go 1.26.3+, see `go.mod`):

```sh
make build          # produces ./phi
make install        # build and install into $GOBIN
```

On first start, phi automatically creates `~/.phi/{bin,skills,hooks,session}`. Search
tools (`fd`, `rg`) download into `~/.phi/bin` in the background when missing.
````

</details>

**依据 2 · 作者声明**：[README.md:379-403](https://github.com/pulseaiclub/phi/blob/be915a2d5acbfa525ab16d11caa3df7c62158cf3/README.md#L379-L403)

无头工具范围及审批限制。

<details>
<summary>查看原文（25行）</summary>

```text
| Flag                 | Description                                    |
| -------------------- | ---------------------------------------------- |
| `-p, --prompt STRING`| Prompt to run (required)                       |
| `--jsonl`            | Emit JSONL events to stdout                    |
| `--yolo`             | Skip all permission checks for this run (benchmarks / CI only) |
| `--max-rounds N`     | Cap tool rounds (default 64)                   |
| `--timeout DURATION` | Limit the agent run wall-clock time (e.g. `10m`; disabled by default) |
| `--session ID`       | Resume a persisted session by id or unique prefix |
| `--continue-last`    | Resume the newest persisted session for this directory |
| `--session-dir DIR`  | Override the session storage directory         |
| `--tools LIST`       | Enable only these comma-separated built-in tools |

`--tools` accepts built-in names such as `read,ls,grep`. MCP and agent tools
still append when configured; the flag only scopes the built-in toolset.

Exit codes: `0` success · `1` runtime/LLM error · `2` max rounds reached ·
`3` config/usage error.

In the interactive TUI, exhausting the tool-round budget prompts Continue /
Stop. Headless `phi run` has no confirmation UI, so it exits with code 2.

In headless mode, permission `ask` decisions are denied (there is no approval
UI), so `readonly`-style safety applies without extra flags. For benchmarks
that need arbitrary shell (`pytest`, `npm test`, …), pass `--yolo` to skip the
permission gate for that run only.
```

</details>

**依据 3 · 源码核查**：[internal/mcp/pool.go:89-95](https://github.com/pulseaiclub/phi/blob/be915a2d5acbfa525ab16d11caa3df7c62158cf3/internal/mcp/pool.go#L89-L95)

调用直接委托远端，不含业务事务回滚。

```text
// Call invokes a tool on a server.
func (p *Pool) Call(ctx context.Context, server, tool string, args map[string]any) (string, error) {
	c, err := p.client(server)
	if err != nil {
		return "", err
	}
	return c.CallTool(ctx, tool, args)
```

#### 缺口

- 远端失败后的业务结果与恢复成本未知
  **影响**：不能把重试当无副作用
  **进一步探讨**：只读任务先试，写操作由服务侧回执核对

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得试用，怎样反证渐进披露节省总成本？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合已配置多 MCP 服务、能独立管理权限的终端开发者在只读仓库任务中试用。设计假设是按任务发现工具可以比预载全部 Schema 更省总上下文，但应把额外 ls/read 工具往返和模型选错工具计入；如果只有一个小工具集，预载可能更简单。固定模型、任务、服务器和权限比较完整预载与渐进路径，验收任务正确性及全部 token、首结果延迟和人工接管。若任务漏用工具、重复探索或授权边界难判断，停止迁移并回到原客户端；这并不是已经证明替代 DSH 的结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:526-535](https://github.com/pulseaiclub/phi/blob/be915a2d5acbfa525ab16d11caa3df7c62158cf3/README.md#L526-L535)

按需披露也增加发现步骤，是对照起点。

<details>
<summary>查看原文（10行）</summary>

```text
Instead MCP is a **URL namespace** on the regular tools, and the system prompt lists configured **server names** (no schemas):

| Action | Call |
| --- | --- |
| List tools on a server | `ls mcp://<server>/tools/` |
| Fetch a slim parameter summary | `read mcp://<server>/tools/<tool>` |
| Invoke | `write mcp://<server>/tools/<tool>` with content = JSON args |

Flow: pick a server from the prompt → `ls` → `read` → `write`. Subprocesses start **lazily** on first use.
Browsing is read-tier; invokes still go through PreHooks → write Gate / Ask → Run → PostHooks.
```

</details>

**依据 2 · 源码核查**：[internal/tools/writetool/write.go:68-75](https://github.com/pulseaiclub/phi/blob/be915a2d5acbfa525ab16d11caa3df7c62158cf3/internal/tools/writetool/write.go#L68-L75)

统一写入口供边界验证。

```text
	if target, err := tooldef.ParseMCPTarget(path); err != nil {
		return tooldef.Result{}, err
	} else if target != nil {
		body, err := tooldef.MCPWrite(ctx, pool, target, in.Content)
		if err != nil {
			return tooldef.Result{}, err
		}
		return tooldef.Result{Content: body, Detail: target.Server + "/" + target.Tool, Output: body}, nil
```

#### 缺口

- 渐进披露对实际任务的收益未验证
  **影响**：仍为机制假设
  **进一步探讨**：以同预算合格任务率与总 token 决定继续

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
