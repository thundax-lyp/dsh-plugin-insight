# LazyMind

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[742e9aa](https://github.com/LazyAGI/LazyMind/tree/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b)

<!-- BEGIN META -->
[![GitHub ★ 644](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=644&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LazyAGI/LazyMind)
<!-- END META -->

> **功能**：提供知识、技能和可审核工作流的独立运行环境，并支持连接 DSH。

> **亮点**：把外部流程的状态、人工审核点与宿主会话接起来。Core 的通知投递与执行准入分别处理，失去回执时可按持久输入对账。见 [Q01](#research-q01) 至 [Q03](#research-q03)。

> **主要限制**：宿主接收、步骤执行和文件交付是不同状态。停止仍以会话为目标，无法按预期轮次原子取消。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 根项目与 DSH 子包如何分工，实际怎么接入？](#detail-section-11)
  - [Q02 · 哪些状态来自 Core，哪些只是宿主显示？](#detail-section-12)
  - [Q03 · 投递结果未知或取消竞争时怎样恢复？](#detail-section-13)
  - [Q04 · 以非敏感样本试用需要哪些权限和代价？](#detail-section-14)
  - [Q05 · 怎样验证更清楚的投递与产物状态能否减少返工？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在生成演示稿中途审查大纲或内容的 DSH 用户，可连接 LazyMind 并在原会话核对运行。

手工把提示、材料和阶段文件交给 DSH，可维持人工控制。LazyMind 增加有状态的运行、阶段复核和向宿主投递。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH 连接 | 在宿主会话发起 LazyMind 流程 | 需 Core、连接器和私有配对 |
| 审核推进 | 按当前 Control 暂停或继续 | 以 Core 记录为准 |
| 投递对账 | 用历史输入回读接收状态 | 接收不等于执行或产物完成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| LazyMind Core 和匹配 schema | 需要 | 权限、运行与投递 | 连接器预检拒绝 |
| DSH 适配器、MCP 与所需宿主服务 | 宿主使用需要 | 工具和会话控制 | 核对 profile 与 SDK 兼容 |
| 当前账号与私有配对 | 需要 | Bridge 验证 | 停止控制并重新连接 |
| Web 或对应客户端载体 | 面板需要 | 查看阶段和产物 | 在原工作流页面核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户用测试账号连接隔离 profile | 核对安装行、账户与配对 |
| 2 | 用户发起短演示稿工作流 | DSH 和 Core 的工作流、会话 ID 对应 |
| 3 | 用户审核中间结果并导出 | 可独立打开成品，未知时核历史而不重发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Core、DSH 和模型资源，费用未知 | 配置、测试账户和 profile | 实际耗时未知 |
| 持续 | 轮询、模型及文件资源，金额未知 | 审核与核对产物 | 每份合格结果费用未知 |
| 恢复 | 重启及备份资源未知 | 按会话历史核对、断开并回原页面 | 不能假定异常可重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 接入工作流 | 安装器、配对和宿主控制有接线 | 实际发布和版本兼容 |
| 审核与恢复 | 暂停门、持久输入对账 | 用户收益、并发和异常表现 |
| 文件交付 | 作者给出演示及产物发布约定 | 实际生成质量和导出成功率 |

> **思考**：宿主接收、步骤执行和文件交付是不同状态。停止仍以会话为目标，无法按预期轮次原子取消。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把外部流程的状态、人工审核点与宿主会话接起来。Core 的通知投递与执行准入分别处理，失去回执时可按持久输入对账。见 [Q01](#research-q01) 至 [Q03](#research-q03)。

适配器与协调器分离，Core 用事务管理投递租约，回执和执行分开。取消在宿主边界仍只有会话粒度。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

宿主接收、步骤执行和文件交付是不同状态。停止仍以会话为目标，无法按预期轮次原子取消。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用测试账号连接隔离 profile，用非敏感素材做一次带人工检查点的短演示稿。分别核对同一会话、Core 状态和可重开的文件。任何一层对不上时断开并回原页面。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持连接器、宿主控制和 Core 投递机制。真实工作流效果、服务运行和产物质量仍待验证，分阶段展示为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、backend/core/workflow/control_host.go、desktop/electron/package.json、examples/deepseek-harness-ppt/README.md、integrations/dsh-workflow/README.md、integrations/dsh-workflow/cordis.patch.yml、integrations/dsh-workflow/package.json、integrations/dsh-workflow/src/bridge.ts、integrations/dsh-workflow/src/connection.ts、integrations/dsh-workflow/src/host-adapter.ts、integrations/dsh-workflow/src/host.ts、integrations/dsh-workflow/src/index.ts、integrations/dsh-workflow/src/presentation-config.ts、integrations/dsh-workflow/src/tool.ts、integrations/workflow-agent-core/src/coordinator.ts、integrations/workflow-agent-core/src/dispatcher.ts、integrations/workflow-agent-core/src/transport.ts、local/lazymind-cli/internal/adapters/mcpclient/dsh_bundle.go、local/lazymind-cli/internal/assistantbridge/workflow_host.go、local/lazymind-cli/internal/workflowhost/pairing.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 LazyMind 根组件与 DSH 子包、连接器、Bridge 和 Core 投递关键路径。没有审计全部知识库、产物工具和部署权限。
- 下一步：用非敏感工作流实测连接、权限撤销、暂停、入队后断线与文件重开，分别保存宿主及 Core 证据。

**分析版本**

- **仓库**：[LazyAGI/LazyMind](https://github.com/LazyAGI/LazyMind)
- **版本号**：未声明（[固定提交 742e9aa](https://github.com/LazyAGI/LazyMind/tree/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在面板分开呈现可确认的投递、审核和文件状态，可能减少误交付。以相同演示稿任务比较断线和返工。见 [Q05](#research-q05)。

用非敏感工作流实测连接、权限撤销、暂停、入队后断线与文件重开，分别保存宿主及 Core 证据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 155 | 17379 | — | — | 231107 |
| .js | source | 44 | 10091 | 9422 | 294 | — |
| .mjs | test | 65 | 8055 | 7432 | 189 | — |
| .cjs | source | 5 | 667 | 235 | 428 | — |
| .js | test | 50 | 4106 | 3713 | 81 | — |
| .mjs | source | 42 | 13075 | 10859 | 1512 | — |
| .md | example | 32 | 1715 | — | — | 20474 |
| .ts | source | 603 | 236783 | 170095 | 51148 | — |
| .ts | test | 310 | 28638 | 26172 | 424 | — |
| .tsx | source | 532 | 163544 | 152331 | 3271 | — |
| .tsx | test | 367 | 73200 | 67801 | 469 | — |
| .tsx | example | 2 | 107 | 101 | 2 | — |
| .md | test | 7 | 400 | — | — | 2379 |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/LazyAGI/LazyMind/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=737b86&logo=github)](https://github.com/LazyAGI/LazyMind/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/LazyAGI/LazyMind/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用 DSH 驱动可复核的 LazyMind 工作流时，如何确认接入身份、暂停和续跑状态，以及产物是否真正交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目与 DSH 子包如何分工，实际怎么接入？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

希望在 DSH 对话内执行可中途审核的写作或演示稿流程的用户，可以把 LazyMind 作为外部工作流运行环境，再连接宿主。根仓库包含独立桌面和 Core，根组件在 DSH 生态中的作用是提供工作流与知识基础设施。私有 DSH bundle 另在 integrations/dsh-workflow，声明了 Web 客户端与预编译入口，初始 patch 关闭，不能把根仓库直接当作 DSH 插件。连接器检查 Core schema 已准备且协议为 workflow.control.v1，再把内置压缩包写入本地并安装。普通路径还加对应版本的 MCP client，托管路径有独立调用。随后建立账号配对并把连接记录和命令写进启用的 profile 配置。Node 入口用该命令解析连接、加本地调度锁，然后安装工具包装和控制监听。相对把提示与中间文件逐次复制到 Agent，增量是已有工作流从原宿主进入，而成功标准是同一工作流可在面板核对、可中途审核并产出独立文件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-33](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/README.md#L15-L33)

作者定位为独立工作区和外部 Agent 接入。

<details>
<summary>查看原文（19行）</summary>

```text
LazyMind is an **AI Skill Runtime** for knowledge-intensive work: an environment that turns knowledge, expert practice, and tools into executable, recoverable tasks. It connects reusable knowledge, executable Skills, observable workflows, editable artifacts, and evaluation-driven improvement in one workspace.

Instead of repeatedly uploading context, tuning prompts, and supervising every agent step, you choose the knowledge and workflow once. LazyMind then plans, executes, exposes intermediate results, and carries accepted feedback into the next run. Use it locally in **Desktop Mode**, deploy it as a shared enterprise service, or provide knowledge, Skills, and Workflows to external agents such as Codex, Cursor, and WorkBuddy.

- **Desktop Mode** is designed for technically capable professionals whose primary job is not programming, including solution architects, product managers, operators, testers, and content creators.
- **Team and enterprise deployments** serve secondary development, project delivery, proposals, FDE work, and organization-wide knowledge collaboration with shared permissions, deployment, and evaluation capabilities.

**[Quick start](#quick-start)** · **[Showcase](#showcase)** · **[Example directory](examples/README.md)** · **[Product architecture](docs/architecture.md)** · **[Build a workflow](docs/workflow-format.md)** · **[Desktop mode](desktop/README.md)**

---

## Ways to use LazyMind

| Mode | Best for | How it works |
|------|----------|--------------|
| **Use LazyMind directly** | Local knowledge work or shared team workflows | Run the desktop app for a local-first experience, or deploy the service for your team. Create tasks, use knowledge bases, and run Skills and Workflows in the LazyMind workspace. |
| **Use LazyMind as an agent plugin** | Extending the agent environment you already use | Connect LazyMind from **Settings → Assistants**. Codex and DeepSeek Harness can then use LazyMind knowledge, Skills, and Workflows in their native sessions, including workflow progress, review checkpoints, and artifacts. |

See the [DeepSeek Harness integration](integrations/dsh-workflow/README.md) for implementation details.
```

</details>

**依据 2 · 源码核查**：[desktop/electron/package.json:1-10](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/desktop/electron/package.json#L1-L10)

根仓库内的独立桌面应用。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "lazymind-desktop",
  "version": "0.5.1-alpha.0",
  "description": "Production-ready enterprise knowledge-base and RAG chat platform with automated RAG quality optimization.",
  "author": "LazyAGI",
  "private": true,
  "main": "src/main.js",
  "type": "commonjs",
  "scripts": {
    "start": "electron .",
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-workflow/package.json:1-27](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/package.json#L1-L27)

实际私有子包、bundle、Web 依赖与 Node 声明。

<details>
<summary>查看原文（27行）</summary>

```text
{
  "name": "@lazymind/dsh-workflow",
  "private": true,
  "version": "0.1.4",
  "type": "module",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-renderer"
      ]
    }
  },
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

</details>

**依据 4 · 源码核查**：[integrations/dsh-workflow/cordis.patch.yml:1-6](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/cordis.patch.yml#L1-L6)

默认关闭的宿主行。

```text
- insert:
    - id: lazymind-workflow-panel
      name: '@lazymind/dsh-workflow'
      disabled: true
      config:
        serverName: lazymind
```

**依据 5 · 源码核查**：[local/lazymind-cli/internal/adapters/mcpclient/dsh_bundle.go:288-340](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/local/lazymind-cli/internal/adapters/mcpclient/dsh_bundle.go#L288-L340)

Core 前置校验、固定压缩包安装、配对和启用。

<details>
<summary>查看原文（53行）</summary>

```text
	var capability struct {
		SchemaReady bool   `json:"schema_ready"`
		Protocol    string `json:"protocol"`
	}
	if err := api.DoJSON(ctx, "GET", "/workflow-control/capabilities", nil, &capability); err != nil {
		return false, err
	}
	if !capability.SchemaReady || capability.Protocol != "workflow.control.v1" {
		return false, errors.New("update LazyMind Core and its database before enabling workflow control")
	}
	account, err := store.AccountScope()
	if err != nil {
		return false, err
	}
	archive := filepath.Join(a.home, "bundles", "dsh-workflow-"+dshBundleHash()[:16]+".tgz")
	if err := os.MkdirAll(filepath.Dir(archive), 0700); err != nil {
		return false, err
	}
	if err := os.WriteFile(archive, dshWorkflowArchive, 0600); err != nil {
		return false, err
	}
	run := a.dshRunner
	if run == nil {
		run = runDSHPlugin
		if a.dshCLI != "" {
			run = a.runBundledDSHPlugin
		}
	}
	args := []string{"add", "--workspace-root", "@deepseek-ai/dsh-mcp-client@" + version, archive}
	if a.dshCLI != "" {
		args = []string{"add", archive}
	}
	if err := run(ctx, a.dshProfile(), args...); err != nil {
		return false, err
	}
	for _, prepare := range beforePublish {
		if err := prepare(); err != nil {
			return false, err
		}
	}
	pair, err := workflowhost.Ensure(a.home, profile, account)
	if err != nil {
		return false, err
	}
	pairingFile := filepath.Join(a.home, "workflow-hosts", pair.ConnectorID+".json")
	configPath, err := connectorconfig.Save(connectorconfig.Config{Home: a.home, Provider: string(DeepSeekHarness), HostID: a.hostID, Profile: profile, PairingFile: pairingFile, Controlled: true})
	if err != nil {
		return false, err
	}
	if err := configureDSHWorkflow(a.dshConfigPath(), configPath, a.self, false); err != nil {
		return false, err
	}
	return true, nil
```

</details>

**依据 6 · 源码核查**：[integrations/dsh-workflow/src/index.ts:10-36](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/src/index.ts#L10-L36)

宿主注入依赖、连接解析、锁、控制安装和清理。

<details>
<summary>查看原文（27行）</summary>

```text
export const inject = ['tools', 'agents', 'sessionController']

/** Pairing and live addresses are resolved together; inherited endpoint env is ignored. */
export async function apply(ctx: Context, config: Config): Promise<void> {
  let presentation: PresentationConfig | undefined
  let lastError = ""
  installPresentationConfig(ctx, () => presentation)
  const stop = watchConnection(signal => resolveConnection(config, signal), async current => {
    const pairing = await loadPairing(current.pairingFile)
    const instance = randomUUID()
    const release = await dispatcherLock(current.pairingFile, instance)
    try {
      const dispose = installHost(ctx, new HostBridge(current.bridgeUrl, pairing), current, instance)
      presentation = current
      lastError = ""
      return async () => { try { await dispose() } finally { await release() } }
    } catch (error) { await release(); throw error }
  }, error => {
    presentation = undefined
    const message = error instanceof Error ? error.message : ''
    if (message && message !== lastError) console.warn('LazyMind Workflow:', message)
    if (message) lastError = message
  })
  ctx.effect(() => stop)
  // Login and the local runtime may recover after DSH has booted. Keep the
  // resolver alive rather than making an optional connection fatal to DSH.
  await stop.ready.catch(() => {})
```

</details>

#### 缺口

- 未核对真实桌面安装包与固定 DSH 版本的运行配合。
  **影响**：启动要求和已有安装不能证明可完成工作流。
  **进一步探讨**：以专用 profile 检查预检、配对与已启用行，再核对第一次工具调用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些状态来自 Core，哪些只是宿主显示？

**研究主题**：功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

DSH 在每个 Agent 的实际作用域包装匹配的 MCP 工具。包装执行原工具，补工作流标识和呈现元数据，必要时在当前调用结束后结束回合。工具报告非并发安全，让提交与后续工具之间形成顺序。宿主 pre-step 把标准消息中的 rpcId 交给共享协调器，检查当前 Control，暂停且没有在途授权时拒绝自动推进。手动用户消息会改变自动归属。Core 的投递请求只授予通知机会，源码明确把步骤 Begin/Claim 另行检查。Web 配置端只返回服务名和页面地址，不提供运行写权限。作者说明产物发布可先于步骤完成，因此收到卡片、看到文件和通过工作流审查要分别核对。与普通 MCP 一次调用相比，贡献在于把外部运行状态和暂停语义接到宿主；不能用界面状态替代 Core 记录或凭此推断某次输出已获批准。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-workflow/src/host.ts:40-75](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/src/host.ts#L40-L75)

在 Agent 作用域注册已匹配工具包装。

<details>
<summary>查看原文（36行）</summary>

```text
  function wrap(agent: Agent, registration: Registration) {
    const context = registration.context
    if (!context) return
    const live = new Set<string>()
    for (const schema of ctx.tools.schemas()) {
      const operation = workflowOperation(schema.name, config.serverName)
      if (operation === null) continue
      live.add(schema.name)
      const original = ctx.tools.get(schema.name)
      const previous = registration.wrappers.get(schema.name)
      if (!original || previous?.original === original) continue
      previous?.dispose()
      const definition = workflowTool(original, {
        hostSessionId: runtime.id(coordinator.driver(agent)), operation,
        afterResult: (value, exec) => own(coordinator.afterResult(value, call(exec))),
        shouldConclude: control => coordinator.shouldConclude(agent, control),
      })
      registration.wrappers.set(schema.name, { original, dispose: context.tools.register(definition) })
    }
    for (const [name, value] of registration.wrappers) if (!live.has(name)) { value.dispose(); registration.wrappers.delete(name) }
  }

  function ensure(agent: Agent): Registration {
    const existing = registrations.get(agent)
    if (existing) return existing
    coordinator.ensure(agent)
    const entry: Registration = { ready: Promise.resolve(), dispose: async () => {}, wrappers: new Map() }
    registrations.set(agent, entry)
    // Inherit the real Agent context's scope tag, never a second copy of dsh-scope.
    const registration = agent.ctx.inject(['tools'], injected => {
      entry.context = injected
      wrap(agent, entry)
    })
    entry.ready = registration.await()
    entry.dispose = () => registration.dispose()
    return entry
```

</details>

**依据 2 · 源码核查**：[integrations/dsh-workflow/src/host.ts:78-95](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/src/host.ts#L78-L95)

pre-step 读取标准消息并执行协调器决策。

<details>
<summary>查看原文（18行）</summary>

```text
  const removeHook0 = ctx.on('agent/pre-step', (payload, next) => own((async () => {
    const registration = ensure(payload.agent)
    await registration.ready
    wrap(payload.agent, registration)
    const allowed = await coordinator.beforeTurn({ ...payload, messages: payload.messages.map(message => {
      const source = object(object(message)?.source)
      return { user: source?.kind === 'user', requestId: typeof source?.rpcId === 'string' ? source.rpcId : undefined }
    }) })
    return allowed ? next() : { kind: 'reject' as const }
  })()))
  const removeHook1 = ctx.on('tools/ptc-dispatch-log', async (dispatch, next) => {
    const content = await next()
    const run = coordinator.takeNestedLink(dispatch.subCallId)
    if (!run) return content
    const { url: _url, ...identity } = run
    return [...content, { type: 'text', text: JSON.stringify({ lazymind_workflow: identity }) }]
  })
  const removeHook2 = ctx.on('agent/status', ({ agent, status }) => { if (status === 'idle') coordinator.idle(agent) })
```

</details>

**依据 3 · 源码核查**：[integrations/dsh-workflow/src/tool.ts:12-39](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/src/tool.ts#L12-L39)

保留原定义并添加顺序和呈现。

<details>
<summary>查看原文（28行）</summary>

```text
export function workflowTool(original: ToolDefinition, hooks: ToolHooks): ToolDefinition {
  return {
    ...original,
    // A submission is an ordering barrier; review must become visible before the next call.
    isConcurrencySafe: () => false,
    presentCall(args) {
      const fields = object(args)
      const rawInput = fields ? Object.fromEntries(['workflow_id', 'session_id', 'step_id', 'execution_id']
        .filter(key => typeof fields[key] === 'string').map(key => [key, fields[key]])) : undefined
      return { card: 'generic', title: `LazyMind Workflow: ${(hooks.operation ?? 'operation').replaceAll('_', ' ')}`, rawInput }
    },
    presentResult(args, result) {
      const meta = result.meta
      return original.presentResult?.(args, { ...result, meta: meta && typeof meta === 'object' && !Array.isArray(meta) && 'original' in meta ? meta.original : result.meta })
    },
    output: {
      ...original.output,
      presentationMeta(args, value) {
        const previous = original.output.presentationMeta?.(args, value)
        const control = readControl(value)
        const fields = object(object(value)?.structuredContent)
        const executionId = fields?.execution_id ?? object(fields?.execution)?.execution_id
        const hostSessionId = hooks.hostSessionId
        return control ? { lazymind_workflow: { runId: control.session_id,
          ...(hostSessionId ? { hostSessionId } : {}), ...(hooks.operation ? { operation: hooks.operation } : {}),
          ...(typeof executionId === 'string' ? { executionId } : {}),
        }, original: previous ?? null } : previous ?? null
      },
```

</details>

**依据 4 · 源码核查**：[integrations/dsh-workflow/src/tool.ts:41-55](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/src/tool.ts#L41-L55)

实际执行并更新控制数据。

<details>
<summary>查看原文（15行）</summary>

```text
    async execute(args, exec) {
      const value = await original.execute(args, exec)
      const control = hooks.afterResult ? await hooks.afterResult(value, exec) : readControl(value)
      if (hooks.shouldConclude ? hooks.shouldConclude(control, exec) : control?.continuation === 'awaiting_user') exec.concludeTurn()
      const record = object(value)
      const fields = object(record?.structuredContent)
      const earlier = readControl(value)
      if (control && fields && record && (earlier?.state_version !== control.state_version || earlier?.continuation !== control.continuation)) {
        // Binding is established synchronously after start; make that fresh fact
        // visible to the model while keeping the original tool receipt intact.
        return { ...record, structuredContent: { ...fields, control },
          ...(Array.isArray(record.content) ? { content: [...record.content, { type: 'text', text: JSON.stringify({ control }) }] } : {}),
        }
      }
      return value
```

</details>

**依据 5 · 源码核查**：[integrations/workflow-agent-core/src/coordinator.ts:197-217](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/workflow-agent-core/src/coordinator.ts#L197-L217)

区分自动与手动以及暂停检查。

<details>
<summary>查看原文（21行）</summary>

```text
  async function beforeTurn(payload: { agent: A; turn: number; messages: readonly HostInput[]; signal: AbortSignal }): Promise<boolean> {
    const scope = ensure(payload.agent)
    if (scope.turn !== payload.turn) { scope.turn = payload.turn; scope.manual = false; scope.activeOwned = scope.automatic }
    try {
      const action = await lookupInput(payload.agent, payload.messages, payload.signal)
      if (action) {
        scope.runId = action.action.session_id
        scope.activeOwned = scope.automatic = true
        scope.manual = false
        publish(scope.runId, action.control)
      } else if (payload.messages.some(message => message.user)) {
        scope.manual = true; scope.activeOwned = scope.automatic = false
      }
      if ((!scope.manual || scope.activeOwned) && !completion(scope)) await refresh(scope, payload.signal)
      if (action && !paused(scope)) resumeGoal(scope)
      suspendGoal(ensure(driver(scope.agent)))
      if (scope.runId && scope.activeOwned && paused(scope) && !scope.manual && scope.grants.size === 0 && !completion(scope)) return false
      return true
    } catch (error) {
      runtime.warn(`lazymind-workflow: control gate deferred a step: ${String(error)}`)
      return false
```

</details>

**依据 6 · 源码核查**：[backend/core/workflow/control_host.go:212-225](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/backend/core/workflow/control_host.go#L212-L225)

通知凭据不直接授权执行。

<details>
<summary>查看原文（14行）</summary>

```text
		if action.Status != "pending" {
			result.Control, err = controlstore.Read(tx, *session)
			return err
		}
		// Delivery grants no execution authority; Begin/Claim validate current Workflow state.
		secret := make([]byte, 32)
		if _, err := rand.Read(secret); err != nil {
			return err
		}
		result.DispatchToken = hex.EncodeToString(secret)
		expires := now.Add(30 * time.Second)
		if err := tx.Model(action).Updates(map[string]any{"status": "dispatching", "dispatch_owner": identity.InstanceID,
			"dispatch_token_hash": controlstore.Hash([]byte(result.DispatchToken)), "dispatch_expires_at": expires,
			"updated_at": now}).Error; err != nil {
```

</details>

**依据 7 · 源码核查**：[integrations/dsh-workflow/src/presentation-config.ts:10-34](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/src/presentation-config.ts#L10-L34)

浏览器仅得到公开呈现字段。

<details>
<summary>查看原文（25行）</summary>

```text
/** DSH loads browser plugins independently of the Node plugin's config. */
export function installPresentationConfig(ctx: Context, source: PresentationConfig | (() => PresentationConfig | undefined)): void {
  const current = () => {
    const config = typeof source === 'function' ? source() : source
    return config && presentationLink('config-check', config.webUrl)
      ? { serverName: config.serverName, webUrl: config.webUrl } : undefined
  }
  // Only public presentation data crosses this unauthenticated DSH route.
  ctx.inject(['webServer'], scope => {
    scope.effect(() => scope.webServer.register({ kind: 'exact', path: PRESENTATION_CONFIG_PATH,
      handler(req, res) {
        res.setHeader('Cache-Control', 'no-store')
        res.setHeader('Content-Type', 'application/json')
        if (req.method !== 'GET') { res.statusCode = 405; res.end(); return }
        res.end(JSON.stringify({ config: current() ?? null }))
      },
    }))
  })
  ctx.on('webserver/index-inject', table => {
    const config = current()
    if (!config) return
    table.push({ kind: 'global', name: CONFIG_KEY, value: {
      serverName: config.serverName, webUrl: config.webUrl,
    } })
  })
```

</details>

**依据 8 · 作者声明**：[integrations/dsh-workflow/README.md:54-60](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/README.md#L54-L60)

作者说明产物发布和步骤完成分离。

```text
External steps publish each output with `workflow.artifact.publish` as soon as it
is available, using a stable positive sequence per output slot. After every
publication has been acknowledged, `workflow.step.complete` records the outcome
without resending artifacts. Publications update the run page but do not finish
the step or bypass review. Explicitly controlled sessions share the Core artifact writer and external
completion service, including steps delegated to the native executor. Ordinary
LazyMind sessions retain the upstream completion and editing behavior.
```

#### 缺口

- 未检查所有工作流工具后端及模型对暂停的实际响应。
  **影响**：不能从包装本身推导每种步骤的授权或产物校验强度。
  **进一步探讨**：用带人工检查点的样本比较工具结果、面板状态、Core 步骤与最终文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 投递结果未知或取消竞争时怎样恢复？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

调度器向 Core 领取投递凭据，再用 action ID 作为 DSH 队列 prompt 的 requestId。Core 把连接器、账户拥有者、驱动会话和动作绑定，已有投递租约未过期时拒绝重复领取，过期则转成 unknown，没有重新下发凭据。宿主调用启动后出错记为未知，下一轮只在历史中找到相同 rpcId 的持久用户输入时补 accepted。找不到不能证明未入队。Core 正数事件序号路径仍检查配对与状态，但服务代码直接依赖适配器提交的序号，并没有直接重读 DSH 归档。接收也不证明模型执行或产物完成。停止时协调器先查工作流已停止及本地自动所有权，最终 DSH cancel 只带 session ID，没有目标 turn ID，检查与调用之间换轮仍可能影响别的任务。断开后应核对原工作流、输入和当前轮次，再决定手工处理，避免重复唤醒或误取消。

#### 证据与依据

**依据 1 · 源码核查**：[backend/core/workflow/control_host.go:139-153](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/backend/core/workflow/control_host.go#L139-L153)

Core 授权时核对拥有者、配对、动作和会话绑定。

<details>
<summary>查看原文（15行）</summary>

```text
func authorizeHostAction(tx *gorm.DB, session orm.WorkflowSession, owner, id string, identity WorkflowHostIdentity, action *orm.WorkflowHostAction) (controlstore.Binding, error) {
	if err := controlOwner(session, owner); err != nil {
		return controlstore.Binding{}, err
	}
	binding, err := controlstore.AuthorizeHost(session, identity.ConnectorID, identity.Credential)
	if err != nil {
		return binding, err
	}
	if err := tx.Where("id = ? AND session_id = ?", id, session.ID).First(action).Error; err != nil {
		return binding, err
	}
	if action.ConnectorID != binding.ConnectorID || action.NativeSessionID != binding.DriverSession {
		return binding, controlstore.Reject("BINDING_CONFLICT", "host action belongs to another connector or session")
	}
	return binding, nil
```

</details>

**依据 2 · 源码核查**：[backend/core/workflow/control_host.go:178-231](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/backend/core/workflow/control_host.go#L178-L231)

活跃租约与过期转未知，非 pending 不发 token。

<details>
<summary>查看原文（54行）</summary>

```text
func (s WorkflowControlService) ClaimHostAction(ctx context.Context, owner, actionID string, identity WorkflowHostIdentity) (WorkflowHostClaim, error) {
	var result WorkflowHostClaim
	if identity.InstanceID == "" || len(identity.InstanceID) > 128 {
		return result, controlstore.Reject("INVALID_COMMAND", "instance_id is required")
	}
	var hint orm.WorkflowHostAction
	if err := s.DB.WithContext(ctx).Where("id = ?", actionID).First(&hint).Error; err != nil {
		return result, err
	}
	err := controlstore.Transaction(ctx, s.DB, hint.SessionID, func(tx *gorm.DB, session *orm.WorkflowSession) error {
		action := &result.Action
		_, err := authorizeHostAction(tx, *session, owner, actionID, identity, action)
		if err != nil {
			return err
		}
		if action.ConsumedAt != nil && action.Status == "pending" {
			return controlstore.Reject("ACTION_CONSUMED", "workflow execution already consumed this continuation")
		}
		now := time.Now().UTC()
		if action.Status == "dispatching" {
			if action.DispatchExpiresAt != nil && action.DispatchExpiresAt.After(now) {
				return controlstore.Reject("DELIVERY_PENDING", "another dispatch owns this action")
			}
			// Expiry cannot prove that the former sender never reached the host.
			if err := tx.Model(action).Updates(map[string]any{"status": "unknown", "updated_at": now}).Error; err != nil {
				return err
			}
			action.Status = "unknown"
			if err := controlstore.BumpEvent(tx, session, "delivery.changed", action.ID, "", map[string]any{"status": "unknown"}); err != nil {
				return err
			}
			result.Control, err = controlstore.Read(tx, *session)
			return err
		}
		if action.Status != "pending" {
			result.Control, err = controlstore.Read(tx, *session)
			return err
		}
		// Delivery grants no execution authority; Begin/Claim validate current Workflow state.
		secret := make([]byte, 32)
		if _, err := rand.Read(secret); err != nil {
			return err
		}
		result.DispatchToken = hex.EncodeToString(secret)
		expires := now.Add(30 * time.Second)
		if err := tx.Model(action).Updates(map[string]any{"status": "dispatching", "dispatch_owner": identity.InstanceID,
			"dispatch_token_hash": controlstore.Hash([]byte(result.DispatchToken)), "dispatch_expires_at": expires,
			"updated_at": now}).Error; err != nil {
			return err
		}
		action.Status = "dispatching"
		action.DispatchOwner = identity.InstanceID
		action.DispatchExpiresAt = &expires
		result.Control, err = controlstore.Read(tx, *session)
```

</details>

**依据 3 · 源码核查**：[backend/core/workflow/control_host.go:247-277](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/backend/core/workflow/control_host.go#L247-L277)

回执转换、拥有者和 token 检查，以及事件序号例外。

<details>
<summary>查看原文（31行）</summary>

```text
func (s WorkflowControlService) SettleHostAction(ctx context.Context, owner, actionID string, receipt WorkflowHostReceipt) (orm.WorkflowHostAction, error) {
	var action orm.WorkflowHostAction
	if err := s.DB.WithContext(ctx).Where("id = ?", actionID).First(&action).Error; err != nil {
		return action, err
	}
	err := controlstore.Transaction(ctx, s.DB, action.SessionID, func(tx *gorm.DB, session *orm.WorkflowSession) error {
		identity := WorkflowHostIdentity{ConnectorID: receipt.ConnectorID, Credential: receipt.Credential, InstanceID: receipt.InstanceID}
		if _, err := authorizeHostAction(tx, *session, owner, actionID, identity, &action); err != nil {
			return err
		}
		if !controlpolicy.CanSettleDelivery(action.Status, receipt.Status) {
			return controlstore.Reject("DELIVERY_CONFLICT", "invalid delivery state transition")
		}
		if action.Status == receipt.Status {
			return nil
		}
		// A paired plugin can reconcile the exact standard input event after restart.
		if receipt.Status != "accepted" || receipt.NativeEventSeq <= 0 {
			if action.Status == "unknown" {
				return controlstore.Reject("DELIVERY_UNKNOWN", "reconciliation requires the exact durable host event")
			}
			if action.DispatchOwner != receipt.InstanceID || receipt.DispatchToken == "" || controlstore.Hash([]byte(receipt.DispatchToken)) != action.DispatchTokenHash {
				return controlstore.Reject("HOST_AUTH_REQUIRED", "receipt does not belong to the dispatch owner")
			}
		}
		now := time.Now().UTC()
		updates := map[string]any{"status": receipt.Status, "native_event_seq": receipt.NativeEventSeq, "last_error": receipt.Error, "updated_at": now}
		if receipt.Status == "accepted" {
			updates["accepted_at"] = now
		}
		if err := tx.Model(&action).Updates(updates).Error; err != nil {
```

</details>

**依据 4 · 源码核查**：[integrations/workflow-agent-core/src/dispatcher.ts:13-53](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/workflow-agent-core/src/dispatcher.ts#L13-L53)

先查历史、再领取，区分失败与未知。

<details>
<summary>查看原文（41行）</summary>

```text
    if (action.status !== 'pending') {
      // Reconcile delivery receipts, not Workflow execution eligibility.
      const current = await bridge.action(action.id, signal)
      if (!['pending', 'dispatching', 'unknown'].includes(current.action.status)) return
      if (current.action.status !== 'pending' && action.kind === 'continue') {
        const seq = await runtime.reconcile?.(action.native_session_id, action.id, signal) ?? 0
        if (seq > 0) { await bridge.settle(action.id, instanceId, '', 'accepted', seq, '', signal); return }
      }
      // An uncertain cancel is not replayable: a session may now run different work.
      // Claim only expires an outstanding lease; it never reissues an unknown delivery.
    }
    const claim = await bridge.claim(action.id, instanceId, signal)
    if (!claim.dispatch_token || claim.action.status !== 'dispatching') return
    action = claim.action
    host?.cacheClaim(claim)
    let seq = 0
    let admissionStarted = false
    try {
      if (action.kind === 'cancel' && runtime.cancellation === 'none') {
        throw new AdmissionRejected('This host does not support interrupting the current turn; Workflow is stopped in Core.')
      }
      const resolved = await runtime.resolve(action.native_session_id)
      if ('error' in resolved) throw new AdmissionRejected(resolved.error)
      if (action.kind === 'cancel') {
        if (!host) throw new AdmissionRejected('Session cancellation requires a host ownership guard.')
        const current = await bridge.action(action.id, signal)
        admissionStarted = true
        await host.cancelSession(resolved.agent, current)
      } else {
        signal.throwIfAborted()
        admissionStarted = true
        seq = await runtime.prompt(resolved.agent, { actionId: action.id, message: continuationMessage(action) }, signal)
      }
    } catch (error) {
      // Once a host call begins, failure cannot prove that it was not admitted.
      await bridge.settle(action.id, instanceId, claim.dispatch_token,
        !admissionStarted || error instanceof AdmissionRejected ? 'failed' : 'unknown', 0, String(error), signal)
      return
    }
    // Keep receipt failures separate from host failures; the next poll reconciles them.
    await bridge.settle(action.id, instanceId, claim.dispatch_token, 'accepted', seq, '', signal)
```

</details>

**依据 5 · 源码核查**：[integrations/dsh-workflow/src/host-adapter.ts:23-54](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/src/host-adapter.ts#L23-L54)

历史分页匹配持久用户消息 rpcId。

<details>
<summary>查看原文（32行）</summary>

```text
  function inputSeq(events: readonly { type: string; seq: number; data: unknown }[], requestId: string): number {
    for (const event of events) {
      if (event.type !== 'user/message') continue
      const source = object(object(event.data)?.message)?.source ?? object(event.data)?.source
      if (object(source)?.rpcId === requestId) return event.seq
    }
    return 0
  }

  async function reconcile(sessionId: string, actionId: string, caller: AbortSignal): Promise<number> {
    const controller = new AbortController()
    try {
      const frames = ctx.sessionController.follow({ address: { kind: 'session', sessionId: sessionId as SessionId }, maxMessages: 100 }, AbortSignal.any([caller, controller.signal]))
      for await (const frame of frames) {
        if (frame.type !== 'snapshot') continue
        const scan = (records: typeof frame.records) => inputSeq(records.flatMap(record => record.type === 'event' ? [record.event] : []), actionId)
        let found = scan(frame.records)
        let records = frame.records
        let more = frame.hasMore
        while (!found && more) {
          const seqs = records.map(record => record.event.seq)
          if (!seqs.length) break
          const page = await ctx.sessionController.page({ address: { kind: 'session', sessionId: sessionId as SessionId },
            throughSeq: frame.cursor, beforeSeq: Math.min(...seqs), maxMessages: 100 }, AbortSignal.any([caller, controller.signal]))
          records = page.records
          found = scan(records)
          more = page.hasMore
        }
        return found
      }
      return 0
    } finally { controller.abort() }
```

</details>

**依据 6 · 源码核查**：[integrations/dsh-workflow/src/host-adapter.ts:83-91](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/src/host-adapter.ts#L83-L91)

队列 prompt 与会话级取消。

```text
    async prompt(agent, input, signal) {
      await ctx.sessionController.prompt({ sessionId: agent.session.id,
        requestId: input.actionId as Parameters<typeof ctx.sessionController.prompt>[0]['requestId'],
        mode: 'queue', content: [{ type: 'text', text: input.message }],
      }, signal)
      return inputSeq(agent.session.snapshotEvents(), input.actionId)
    },
    cancel: agent => { ctx.sessionController.cancel({ sessionId: agent.session.id }) },
    reconcile,
```

**依据 7 · 源码核查**：[integrations/workflow-agent-core/src/coordinator.ts:223-236](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/workflow-agent-core/src/coordinator.ts#L223-L236)

取消前当前本地所有权检查。

<details>
<summary>查看原文（14行）</summary>

```text
    async cancelSession(agent: A, claim: ActionClaim) {
      const { action, control } = claim
      if (action.consumed_at || control.continuation !== 'stopped') {
        throw new AdmissionRejected('Cancellation no longer applies to this Workflow.')
      }
      const scope = ensure(agent)
      if (scope.runId !== action.session_id) return
      publish(action.session_id, control)
      // Check synchronously at the host call, after all remote reads. A user turn
      // must never inherit cancellation merely because an older execution exists.
      if (scope.activeOwned && scope.automatic && !scope.manual && runtime.isRunning?.(agent) !== false) {
        await runtime.cancel(agent)
      }
      suspendGoal(scope)
```

</details>

#### 缺口

- 未重现响应丢失、转为手动轮和并发取消。
  **影响**：不能保证各宿主版本按相同事件格式回写，取消也非原子。
  **进一步探讨**：在隔离会话分别于入队前、入队后和持久化后切断响应，另交错手动轮与取消。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 以非敏感样本试用需要哪些权限和代价？

**研究主题**：依赖、兼容与流程、采用判断、效果与总成本

#### 完整回答

已有 LazyMind 和 DSH 的用户可用测试账号连接专用 profile，拿非敏感短演示稿测试一次检查点和导出。插件从私有配对文件读取连接器标识及 token，非 Windows 检查文件权限。客户端 Bridge 只接受 loopback HTTP 或 HTTPS，附上配对身份。服务端用当前账号范围校验配对，检查启用状态并用恒时比较校验 token，才向 Core 转发。连接配置每轮重新解析，变更会先卸旧控制器，失败将公开呈现配置置空。这个行为可支持可恢复的本机试用，但不证明托管部署隔离、所有输出仅在本地或所有历史会被移除。与直接手工审稿比较，用户需要维护账号、Core、DSH 和连接器并核对同一 run 的文件。若读到错的会话、授权仍能在撤销后使用，或最终文件缺失，应断开连接并回到原工作流页面和独立文件，不把 UI 关闭当成任务取消。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-workflow/src/bridge.ts:6-16](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/src/bridge.ts#L6-L16)

读取私有配对并验证文件状态。

<details>
<summary>查看原文（11行）</summary>

```text
/** The only credential loaded is LazyMind's scoped local pairing, never DSH's signing key. */
export async function loadPairing(path: string): Promise<Pairing> {
  if (!path) throw new Error('Reconnect DeepSeek Harness from LazyMind to configure the workflow bundle')
  const info = await stat(path)
  if (!info.isFile() || (process.platform !== 'win32' && (info.mode & 0o077) !== 0)) throw new Error('Workflow pairing must be a private file')
  const value = object(JSON.parse(await readFile(path, 'utf8')))
  if (!value || typeof value.connector_id !== 'string' || typeof value.token !== 'string' || value.token.length !== 64 || value.enabled !== true) {
    throw new Error('Workflow pairing is unavailable; reconnect DeepSeek Harness from LazyMind')
  }
  return { connector_id: value.connector_id, token: value.token }
}
```

</details>

**依据 2 · 源码核查**：[integrations/workflow-agent-core/src/transport.ts:23-41](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/workflow-agent-core/src/transport.ts#L23-L41)

本机 Bridge 地址约束和配对请求。

<details>
<summary>查看原文（19行）</summary>

```text
export class HostBridge {
  private readonly base: string
  constructor(url: string, private readonly pairing: Pairing) {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol) || !['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)
      || parsed.username || parsed.password || parsed.search || parsed.hash) throw new Error('Workflow Bridge must be a loopback URL without credentials')
    this.base = parsed.href.replace(/\/$/, '') + '/v1/workflow-host'
  }

  private async request<T>(path: string, signal: AbortSignal, body?: unknown): Promise<T> {
    const response = await fetch(this.base + path, {
      method: body === undefined ? 'GET' : 'POST', signal: AbortSignal.any([signal, AbortSignal.timeout(15_000)]),
      headers: { Authorization: `Bearer ${this.pairing.token}`, 'X-LazyMind-Connector-Id': this.pairing.connector_id,
        ...(body === undefined ? {} : { 'content-type': 'application/json' }) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
    const value = await response.json()
    if (!response.ok) throw new BridgeError(typeof value.code === 'string' ? value.code : 'BRIDGE_ERROR', typeof value.error === 'string' ? value.error : 'Workflow Bridge request failed', response.status)
    return value as T
```

</details>

**依据 3 · 源码核查**：[local/lazymind-cli/internal/assistantbridge/workflow_host.go:32-49](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/local/lazymind-cli/internal/assistantbridge/workflow_host.go#L32-L49)

服务端配对认证。

<details>
<summary>查看原文（18行）</summary>

```text
func (s *Server) workflowHost(w http.ResponseWriter, r *http.Request) (workflowhost.Pairing, *coreapi.Client, bool) {
	scope, err := s.store.AccountScope()
	if err != nil {
		workflowHostError(w, err)
		return workflowhost.Pairing{}, nil, false
	}
	token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	pair, err := workflowhost.Verify(s.store.Directory(), r.Header.Get("X-LazyMind-Connector-Id"), token, scope)
	if err != nil {
		writeJSON(w, http.StatusForbidden, map[string]string{"error": err.Error()})
		return pair, nil, false
	}
	api, err := coreapi.New(s.store)
	if err != nil {
		workflowHostError(w, err)
		return pair, nil, false
	}
	return pair, api, true
```

</details>

**依据 4 · 源码核查**：[local/lazymind-cli/internal/workflowhost/pairing.go:102-116](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/local/lazymind-cli/internal/workflowhost/pairing.go#L102-L116)

校验账号范围、启用和 token。

<details>
<summary>查看原文（15行）</summary>

```text
func Verify(home, id, token, accountScope string) (Pairing, error) {
	path, err := pairingPath(home, id)
	if err != nil {
		return Pairing{}, err
	}
	body, err := os.ReadFile(path)
	if err != nil {
		return Pairing{}, errors.New("workflow host is not paired")
	}
	var pair Pairing
	if json.Unmarshal(body, &pair) != nil || !normalizeProvider(&pair) || pair.ConnectorID != id || !pair.Enabled || pair.AccountScope != accountScope || !integrationstate.Allowed(home, pair.Provider) || token == "" ||
		subtle.ConstantTimeCompare([]byte(token), []byte(pair.Token)) != 1 {
		return Pairing{}, errors.New("workflow host pairing is invalid; reconnect for the current account")
	}
	return pair, nil
```

</details>

**依据 5 · 源码核查**：[integrations/dsh-workflow/src/connection.ts:41-68](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/src/connection.ts#L41-L68)

连接更换或失效时卸旧控制器。

<details>
<summary>查看原文（28行）</summary>

```text
  const stopCurrent = async (error?: unknown) => {
    const previous = dispose
    dispose = undefined
    fingerprint = ''
    unavailable(error)
    await previous?.()
  }
  const done = (async () => {
    try {
      while (!lifetime.signal.aborted) {
        try {
          const next = await resolve(lifetime.signal)
          if (lifetime.signal.aborted) break
          const key = JSON.stringify(next)
          if (key !== fingerprint) {
            await stopCurrent()
            if (lifetime.signal.aborted) break
            dispose = await install(next)
            fingerprint = key
            readyResolve()
          }
        } catch (error) { readyReject(error); await stopCurrent(error) }
        if (!lifetime.signal.aborted) await new Promise<void>(ready => {
          const timer = setTimeout(ready, interval)
          wake = () => { clearTimeout(timer); ready() }
        })
      }
    } finally { readyResolve(); await stopCurrent() }
```

</details>

**依据 6 · 作者声明**：[examples/deepseek-harness-ppt/README.md:9-18](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/examples/deepseek-harness-ppt/README.md#L9-L18)

作者报告的演示场景。

<details>
<summary>查看原文（10行）</summary>

```text
This demo brings those decisions into one process. The user starts in DeepSeek Harness; LazyMind opens a workflow with backgrounds, content, and slides that can be reviewed before continuing.

**[Watch DeepSeek Harness × LazyMind](https://www.bilibili.com/video/BV1Xcpt6REjc/)** · 1:29 · Chinese · Published 2026-10-09

## Follow the deck from request to result

1. **Clarify the brief.** Connect LazyMind, describe the topic and style, and answer questions about requirements such as slide count.
2. **Check the visual direction.** Preview the Palace Museum backgrounds before moving on to the finished deck.
3. **Review the content page by page.** Inspect the outline and per-slide content in the workflow panel, then continue with the revisions.
4. **Inspect the deliverable.** The video shows slides with architecture and artifact photographs, followed by an exported PDF.
```

</details>

**依据 7 · 作者声明**：[integrations/dsh-workflow/README.md:38-42](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/README.md#L38-L42)

作者说明窗口关闭和断开行为。

```text
The Node host runs `internal connection resolve` to read current credentials and validate the account and pairing. It checks for changes every three seconds, releases the previous controller before replacement, and stops control when configuration is invalid or pairing is revoked. Missing login credentials leave the plugin active and waiting, so signing in again can restore the connection without restarting DSH. Browser clients poll the same-origin `/lazymind-workflow/config` route for public panel configuration and rebuild historical panel entries when it returns. The Electron file carrier receives configuration at boot and may require reloading after login or an address change. The pairing secret remains in the Node host and is never injected into browser code.

`DSH_HOME` selects the installation root and `LAZYMIND_DSH_PROFILE` selects a profile (default `web`). Desktop-managed integrations ignore inherited endpoint and executable overrides. Deliberate deployment overrides belong in the connection record's `overrides` object, for example `LAZYMIND_WEB_URL`; invalid values report a configuration error. A standalone CLI without a connection record retains explicit environment overrides. Reconnecting preserves explicit record overrides and backs up the managed client configuration. A disconnected pairing is disabled while retained for explicit reconnection to existing runs.

Closing or minimizing the window does not stop a workflow. Old runs do not gain fabricated approval records. A historical log already corrupted by the old custom event must be backed up and repaired explicitly; replacing the plugin alone cannot run before DSH's cold-reader rejects that log.
```

#### 缺口

- 实际分发、网络边界和撤销后的目标会话行为未运行。
  **影响**：涉及真实知识库、共享账号或外部发布时，当前证据不足以采用。
  **进一步探讨**：测试前备份 profile，用第二账号、撤销配对和重连验证授权，再重开独立导出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证更清楚的投递与产物状态能否减少返工？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

可以在用户看到的工作流面板分别显示持久输入已确认、当前步骤执行或审核、最终产物已重开核对三个阶段，并区分未确认状态。现有适配器已有接收回执和历史匹配，作者说明另有产物发布。拟议增量只在于让用户看懂不同阶段，不添加自动重试或把操作取消承诺提前。对照现有面板和人工短稿交接，在同一素材和检查点下分别模拟回执丢失、检查退回、文件内容与步骤状态不符。以审核后能重开的实际文件为合格任务，统计误认为已完成、重复发任务、人工复核时间和额外调用。若界面没有降低误判或需要更多重复查询才成立，应回到现有流程并保持人工文件核对。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/workflow-agent-core/src/dispatcher.ts:17-53](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/workflow-agent-core/src/dispatcher.ts#L17-L53)

历史收据和当前接受状态可用来建立对照。

<details>
<summary>查看原文（37行）</summary>

```text
      if (current.action.status !== 'pending' && action.kind === 'continue') {
        const seq = await runtime.reconcile?.(action.native_session_id, action.id, signal) ?? 0
        if (seq > 0) { await bridge.settle(action.id, instanceId, '', 'accepted', seq, '', signal); return }
      }
      // An uncertain cancel is not replayable: a session may now run different work.
      // Claim only expires an outstanding lease; it never reissues an unknown delivery.
    }
    const claim = await bridge.claim(action.id, instanceId, signal)
    if (!claim.dispatch_token || claim.action.status !== 'dispatching') return
    action = claim.action
    host?.cacheClaim(claim)
    let seq = 0
    let admissionStarted = false
    try {
      if (action.kind === 'cancel' && runtime.cancellation === 'none') {
        throw new AdmissionRejected('This host does not support interrupting the current turn; Workflow is stopped in Core.')
      }
      const resolved = await runtime.resolve(action.native_session_id)
      if ('error' in resolved) throw new AdmissionRejected(resolved.error)
      if (action.kind === 'cancel') {
        if (!host) throw new AdmissionRejected('Session cancellation requires a host ownership guard.')
        const current = await bridge.action(action.id, signal)
        admissionStarted = true
        await host.cancelSession(resolved.agent, current)
      } else {
        signal.throwIfAborted()
        admissionStarted = true
        seq = await runtime.prompt(resolved.agent, { actionId: action.id, message: continuationMessage(action) }, signal)
      }
    } catch (error) {
      // Once a host call begins, failure cannot prove that it was not admitted.
      await bridge.settle(action.id, instanceId, claim.dispatch_token,
        !admissionStarted || error instanceof AdmissionRejected ? 'failed' : 'unknown', 0, String(error), signal)
      return
    }
    // Keep receipt failures separate from host failures; the next poll reconciles them.
    await bridge.settle(action.id, instanceId, claim.dispatch_token, 'accepted', seq, '', signal)
```

</details>

**依据 2 · 源码核查**：[backend/core/workflow/control_host.go:247-277](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/backend/core/workflow/control_host.go#L247-L277)

Core 持久接受状态的写入分支。

<details>
<summary>查看原文（31行）</summary>

```text
func (s WorkflowControlService) SettleHostAction(ctx context.Context, owner, actionID string, receipt WorkflowHostReceipt) (orm.WorkflowHostAction, error) {
	var action orm.WorkflowHostAction
	if err := s.DB.WithContext(ctx).Where("id = ?", actionID).First(&action).Error; err != nil {
		return action, err
	}
	err := controlstore.Transaction(ctx, s.DB, action.SessionID, func(tx *gorm.DB, session *orm.WorkflowSession) error {
		identity := WorkflowHostIdentity{ConnectorID: receipt.ConnectorID, Credential: receipt.Credential, InstanceID: receipt.InstanceID}
		if _, err := authorizeHostAction(tx, *session, owner, actionID, identity, &action); err != nil {
			return err
		}
		if !controlpolicy.CanSettleDelivery(action.Status, receipt.Status) {
			return controlstore.Reject("DELIVERY_CONFLICT", "invalid delivery state transition")
		}
		if action.Status == receipt.Status {
			return nil
		}
		// A paired plugin can reconcile the exact standard input event after restart.
		if receipt.Status != "accepted" || receipt.NativeEventSeq <= 0 {
			if action.Status == "unknown" {
				return controlstore.Reject("DELIVERY_UNKNOWN", "reconciliation requires the exact durable host event")
			}
			if action.DispatchOwner != receipt.InstanceID || receipt.DispatchToken == "" || controlstore.Hash([]byte(receipt.DispatchToken)) != action.DispatchTokenHash {
				return controlstore.Reject("HOST_AUTH_REQUIRED", "receipt does not belong to the dispatch owner")
			}
		}
		now := time.Now().UTC()
		updates := map[string]any{"status": receipt.Status, "native_event_seq": receipt.NativeEventSeq, "last_error": receipt.Error, "updated_at": now}
		if receipt.Status == "accepted" {
			updates["accepted_at"] = now
		}
		if err := tx.Model(&action).Updates(updates).Error; err != nil {
```

</details>

**依据 3 · 作者声明**：[integrations/dsh-workflow/README.md:54-60](https://github.com/LazyAGI/LazyMind/blob/742e9aa4c2ef13ba40ab1e3d58df1d9be235c63b/integrations/dsh-workflow/README.md#L54-L60)

作者对产物与完成分离的说明。

```text
External steps publish each output with `workflow.artifact.publish` as soon as it
is available, using a stable positive sequence per output slot. After every
publication has been acknowledged, `workflow.step.complete` records the outcome
without resending artifacts. Publications update the run page but do not finish
the step or bypass review. Explicitly controlled sessions share the Core artifact writer and external
completion service, including steps delegated to the native executor. Ordinary
LazyMind sessions retain the upstream completion and editing behavior.
```

#### 缺口

- 未获得现有界面误判率或每次任务成本。
  **影响**：不能断言新增展示减少返工。
  **进一步探讨**：做配对故障实验，记录每份合格演示稿的审核时间、模型用量和重复操作。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
