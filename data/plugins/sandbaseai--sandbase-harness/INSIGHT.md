# SandBase Harness

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[427b52a](https://github.com/sandbaseai/sandbase-harness/tree/427b52a96a5309ca23268407f85c237468ab6a4e)

<!-- BEGIN META -->
[![GitHub ★ 636](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=636&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sandbaseai/sandbase-harness)
<!-- END META -->

> **功能**：本地优先的 Agent 运行时，管理持久会话、工具、记忆、凭据、审计与控制台

> **亮点**：[Q01](#research-q01) 将会话和产物管理集中到独立运行时；[Q02](#research-q02) 提供真实MCP到会话API桥接。其贡献是资源管理和接入组织，模型推理与MCP协议不是本项目原创。

> **主要限制**：[Q02](#research-q02) 的idle和文本回传不等于研究报告验收。[Q03](#research-q03) 本地provider非强隔离且路径写入有末端悬空链接边界，不应对任意仓库开放执行。

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
  - [Q01 · 相比单次脚本 worker，运行时改变哪种交付责任？](#detail-section-11)
  - [Q02 · MCP 如何创建、运行及返回会话，idle代表什么？](#detail-section-12)
  - [Q03 · 本地 sandbox 是否足以执行不可信仓库内容？](#detail-section-13)
  - [Q04 · 如何计量部署、调用与人工验收成本并给出采用判断？](#detail-section-14)
  - [Q05 · 版本绑定报告契约能否使其成为可验收研究 worker？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要持久会话、产物查询与停止接口的Agent开发者，可以用它替代自行拼装脚本worker管理层；DSH通过示例MCP桥连接独立运行时。

简单基线是固定只读目录中的单次worker脚本，写报告后由父编排者读取并验收。若没有恢复与管理需求，引入独立服务可能增加负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP会话管理 | 创建、运行、查询和停止worker会话 | 需已运行服务，不自带报告验收 |
| 产物列表 | 回收会话输出线索 | 文件存在不证明研究合格 |
| 本地provider | 可信开发任务执行 | 同用户子进程，非强隔离 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node22+ 与本地独立服务 | 必需 | 运行会话API及控制台 | MCP不是自行启动全部任务环境 |
| 模型供应商密钥与匹配Agent模型 | 生成必需 | 实际执行模型轮次 | 保存配置可能需重启，错误模型ID会失败 |
| MCP客户端与正确URL/API key | MCP接入必需 | 上层调用会话接口 | 先核对已知session，勿盲目重建重跑 |
| 可验证隔离后端 | 执行不可信内容才必需 | 限制代码副作用 | 本地provider不满足强隔离，停止执行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 部署 | 开发者从核实源码构建服务并配置模型 | 模型与供应商匹配，设置生效后再接入 |
| 建会话 | 编排者选择Agent并保存session_id | 后续可查询同一资源 |
| 运行 | MCP发送消息并回收流文本 | idle仅代表状态，仍检查产物和任务完成 |
| 验收 | 父端核对固定提交、报告和证据 | 不合格补查，中断先查询再决定重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 模型账户、服务与存储，金额未知 | 构建、设置与接口核对 | 未安装运行目标代码 |
| 持续使用 | 父端和worker端模型调用及服务资源 | 逐题验收与运行时维护 | 并发吞吐和总token未知 |
| 失败恢复 | 重试可能再次消耗模型 | 查询已知会话、核对产物与副作用 | 连接失败不证明任务未执行 |
| 退出 | 保留会话和报告存储 | 停止服务并回收状态 | 需自行保全实际产物 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话调用 | MCP真实映射创建/运行/查询/停止 | 审批、预算与所有终态边界 |
| 研究交付 | 可返回文本与列产物 | 固定版本和逐题报告合格性 |
| 执行隔离 | 本地目录路径约束可查 | 不支持将其视为强隔离 |
| 成本 | 独立worker模型调用机制存在 | 主端及总token节省幅度 |

> **思考**：[Q02](#research-q02) 的idle和文本回传不等于研究报告验收。[Q03](#research-q03) 本地provider非强隔离且路径写入有末端悬空链接边界，不应对任意仓库开放执行。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将会话和产物管理集中到独立运行时；[Q02](#research-q02) 提供真实MCP到会话API桥接。其贡献是资源管理和接入组织，模型推理与MCP协议不是本项目原创。

[Q02](#research-q02) MCP handler与SDK分离，方便替换客户端和记录会话；但全量events数组会随长任务增长，idle不是成果判断。[Q03](#research-q03) local-provider明确非强隔离，已查写入边界不可据sandbox命名忽略。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的idle和文本回传不等于研究报告验收。[Q03](#research-q03) 本地provider非强隔离且路径写入有末端悬空链接边界，不应对任意仓库开放执行。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先观察，只用可信只读输入评估会话回收与产物接口；报告不绑定固定提交或结果未知时停止并回到单次脚本加人工验收。

最小验证选五个不同机制的仓库，比较当前文本回传与版本绑定结构交付，在相同报告标准下记录父端阅读token、worker额外token、补证次数和漏放错误。必须同时计算两端与重试总量；如果worker为了结构重复输出大量材料、父端仍需重查全部源码，或者完整报告质量下降，就否定省token假设。现有MCP只提供会话调用基础，报告契约、验收链及并发负载保障均不能计入当前能力。 具体见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

会话MCP适配与本地provider边界有固定源码依据；全部后端、安全隔离、并发吞吐与交付效果未验收。版本绑定研究契约仅为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、examples/deepseek-harness/cordis.yml、src/mcp/server.ts、src/sdk/client.ts、src/sandbox/local-provider.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定427b52a96a5309ca23268407f85c237468ab6a4e，检查README、package、DSH桥、MCP handler、SDK chat和本地provider关键路径；不声称全面审计运行时、审批和全部后端。
- 下一步：仅固定源码核查。未构建、运行服务、调用模型或执行仓库代码；未验证并发、安全隔离与报告效果。

**分析版本**

- **仓库**：[sandbaseai/sandbase-harness](https://github.com/sandbaseai/sandbase-harness)
- **版本号**：0.3.8（[固定提交 427b52a](https://github.com/sandbaseai/sandbase-harness/tree/427b52a96a5309ca23268407f85c237468ab6a4e)）
- **版本日期**：2026-10-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可以推导未验证的研究交付适配层。保留现有会话管理，在结果里增加固定仓库提交、问题/答案/证据、材料摘要与报告位置，并将父端逐题决定和交付摘要绑定。相对现在只返回文本和最后事件，增量是让脚本预查版本、文件和覆盖关系，父模型只检查逐题语义与关键依赖，而不重做材料整理。

最小验证选五个不同机制的仓库，比较当前文本回传与版本绑定结构交付，在相同报告标准下记录父端阅读token、worker额外token、补证次数和漏放错误。必须同时计算两端与重试总量；如果worker为了结构重复输出大量材料、父端仍需重查全部源码，或者完整报告质量下降，就否定省token假设。现有MCP只提供会话调用基础，报告契约、验收链及并发负载保障均不能计入当前能力。 具体见 [Q05](#research-q05)。

仅固定源码核查。未构建、运行服务、调用模型或执行仓库代码；未验证并发、安全隔离与报告效果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 57 | 18527 | — | — | 234498 |
| .ts | source | 300 | 73434 | 50230 | 18180 | — |
| .tsx | source | 67 | 15191 | 13896 | 591 | — |
| .md | test | 10 | 3017 | — | — | 16861 |
| .md | example | 5 | 547 | — | — | 3354 |
| .mjs | example | 6 | 524 | 368 | 117 | — |
| .mjs | source | 3 | 379 | 309 | 42 | — |
| .ts | test | 399 | 82980 | 64229 | 10002 | — |
| .tsx | test | 26 | 5563 | 4674 | 331 | — |

</details>

**活跃度**

[![近30天新建 136](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=136&color=737b86&logo=github)](https://github.com/sandbaseai/sandbase-harness/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 141](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=141&color=737b86&logo=github)](https://github.com/sandbaseai/sandbase-harness/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：开发者能否把持久会话交给独立运行时并通过MCP回收可验收研究结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比单次脚本 worker，运行时改变哪种交付责任？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对象是已经有模型密钥、需要保存多轮任务状态和回收产物的开发者。简单基线是启动一个脚本 worker，传入提示与目录，等进程退出后读文件；SandBase 把会话创建、模型执行、产物清单和停止接口放进本地运行时，再通过 MCP 给上层编排者调用。其增量是可查询的会话资源接口和统一管理，不是新的模型算法，也不能把任务输出直接视为通过验收。

根包是 private managed-agents 运行时，公开声明的 DSH bundle 只是插入 dsh-mcp-client 的示例配置，让 DSH 连接已存在的独立服务。主要条目应按带 DSH 适配的运行时工具理解，而不是所有能力都在宿主进程内的原生插件。README 警告 npm 同名包不是本项目；因此不能按名称直接安装未核实 npm 包。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:15-46](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/README.md#L15-L46)

作者定位独立运行时并列会话、工具和控制台。

<details>
<summary>查看原文（32行）</summary>

```text
A local-first runtime for AI agents. Sessions, sandboxed tools, memory,
credentials, audit trails, and a built-in Console — all running on your
machine or in your own infrastructure.

![SandBase Harness architecture](docs/assets/sandbase-harness-architecture.svg)

## Why

Agent SDKs handle the model loop. Production agents need more: persistent
sessions, tool governance, sandbox boundaries, credential handling, memory,
auditability, and a UI for humans to inspect what happened. `managed-agents`
is that runtime layer — not a visual workflow builder and not another model SDK.

| Need | What Harness provides |
| --- | --- |
| Run generated code safely | Local, Docker, Kubernetes, and self-hosted worker sandboxes |
| Inspect long-running agents | Persistent sessions, resumable event streams, audit, and replay |
| Control tool access | MCP toolsets, credential vaults, permission policies, and approvals |
| Operate any model | OpenAI, Anthropic, MiniMax, and OpenAI-compatible providers, including DeepSeek V4 |
| Keep infrastructure yours | Local-first SQLite and file storage with no required hosted control plane |

## Features

- Claude Managed Agents-style `/v1` API and local Console
- SQLite metadata by default for agents, sessions, environments, credential
  vaults, memory stores, files, skills, and API keys — local file/skill bytes
  in the workspace state directory
- Resumable Server-Sent Events for session replay and debugging
- One active model provider boundary configured through Settings V2
- Sandbox backends: local process, Docker (per-session containers), Kubernetes
  (kubectl exec/cp), self-hosted worker queue
- MCP toolsets, permission policies, built-in tools, and skill packages
```

</details>

**依据 2 · 源码核查**：[README.md:97-100](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/README.md#L97-L100)

明确 npm 同名包不是本项目。

```text
The unscoped `managed-agents` name on npm is not this project. Until an
official scoped package is announced in this repository, install only from the
tagged GitHub source release shown above. Do not run `npx managed-agents` or
`npm install managed-agents`.
```

**依据 3 · 源码核查**：[package.json:1-29](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/package.json#L1-L29)

private、CLI及DSH示例bundle入口。

<details>
<summary>查看原文（29行）</summary>

```text
{
  "name": "managed-agents",
  "version": "0.3.8",
  "private": true,
  "description": "Local-first, self-hosted AI agent runtime with Claude Managed Agents-style APIs, sandboxed sessions, memory, tools, audit, replay, and a local Console.",
  "type": "module",
  "homepage": "https://github.com/sandbaseai/sandbase-harness#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sandbaseai/sandbase-harness.git"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "dsh": {
    "bundle": {
      "patch": "./examples/deepseek-harness/cordis.yml"
    }
  },
  "bugs": {
    "url": "https://github.com/sandbaseai/sandbase-harness/issues"
  },
  "engines": {
    "node": ">=22"
  },
  "bin": {
    "managed-agents": "dist/index.js",
    "managed-agents-mcp": "dist/mcp/index.js"
```

</details>

**依据 4 · 源码核查**：[examples/deepseek-harness/cordis.yml:1-13](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/examples/deepseek-harness/cordis.yml#L1-L13)

DSH桥通过stdio MCP连接本地独立服务。

<details>
<summary>查看原文（13行）</summary>

```text
- insert:
    - id: mcp-sandbase-harness
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: sandbase
        transport: stdio
        command: node
        args:
          - !!js dshHomePath('profiles/web/node_modules/managed-agents/dist/mcp/index.js')
        env:
          MANAGED_AGENTS_URL: !!js process.env.MANAGED_AGENTS_URL ?? 'http://127.0.0.1:3000'
          MANAGED_AGENTS_API_KEY: !!js process.env.MANAGED_AGENTS_API_KEY ?? ''
        failOnStartupError: true
```

</details>

#### 缺口

- 没有同任务脚本worker与运行时的恢复、运维和交付对照。
  **影响**：不能确认多一层会话管理带来净收益。
  **进一步探讨**：固定需要恢复的仓库研究任务，比较故障后回收完整报告、恢复次数和维护时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · MCP 如何创建、运行及返回会话，idle代表什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

createManagedAgentsMcpServer 使用 ManagedAgentsClient 指向配置 URL 和 API key，注册列Agent、建会话、运行、查询、列产物和停止入口。run_session 调用 SDK sessions.chat，累积全部流事件与 delta，返回 session_id、拼接文本、最后事件类型和事件数。SDK 的 chat 实际发消息并遍历事件，到 session.status_idle 或 session.status_terminated 即返回。

因此 idle 是一轮停止流转的状态，不证明仓库问题全答完、证据有效、报告符合约定或产物可独立复现。MCP返回没有专用报告 schema、提交摘要或逐题验收决定。客户端一次等整个流结束且将事件保存在数组，长任务事件量会增加内存；中途连接失败时上层必须按已有session_id查询，不能未经确认就另建会话重跑。stop 工具描述保留sandbox以继续下一消息，也不是删除产物或撤销外部副作用。

#### 证据与依据

**依据 1 · 源码核查**：[src/mcp/server.ts:28-63](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/src/mcp/server.ts#L28-L63)

handler映射会话API，run只拼接delta并回末事件。

<details>
<summary>查看原文（36行）</summary>

```text
export function createManagedAgentsMcpHandlers(client: ManagedAgentsMcpClient) {
  return {
    async listAgents() {
      return (await client.agents.list()).data;
    },
    async createSession(input: { agent: string; environmentId?: string; title?: string }) {
      return client.sessions.create({
        agent: input.agent,
        ...(input.environmentId ? { environment_id: input.environmentId } : {}),
        ...(input.title ? { title: input.title } : {}),
      });
    },
    async runSession(input: { sessionId: string; message: string }) {
      const events: StreamedEvent[] = [];
      let text = '';
      for await (const event of client.sessions.chat(input.sessionId, input.message)) {
        events.push(event);
        if (typeof event.delta === 'string') text += event.delta;
      }
      return {
        session_id: input.sessionId,
        text,
        terminal_event: events.at(-1)?.type ?? null,
        event_count: events.length,
      };
    },
    async getSession(sessionId: string) {
      return client.sessions.get(sessionId);
    },
    async listArtifacts(sessionId: string) {
      return (await client.sessions.artifacts(sessionId)).data;
    },
    async stopSession(sessionId: string) {
      return client.sessions.stop(sessionId);
    },
  };
```

</details>

**依据 2 · 源码核查**：[src/mcp/server.ts:66-119](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/src/mcp/server.ts#L66-L119)

实际MCP注册与服务配置。

<details>
<summary>查看原文（54行）</summary>

```text
export function createManagedAgentsMcpServer(options: {
  client?: ManagedAgentsMcpClient;
  baseUrl?: string;
  apiKey?: string;
} = {}): McpServer {
  const client = options.client ?? new ManagedAgentsClient({
    baseUrl: options.baseUrl ?? process.env.MANAGED_AGENTS_URL ?? 'http://127.0.0.1:3000',
    apiKey: options.apiKey ?? process.env.MANAGED_AGENTS_API_KEY,
  });
  const handlers = createManagedAgentsMcpHandlers(client);
  const server = new McpServer({ name: 'sandbase-harness', version: '0.1.0' });

  server.registerTool('list_agents', {
    description: 'List agents available in the connected SandBase managed-agents runtime.',
  }, async () => result(await handlers.listAgents()));

  server.registerTool('create_session', {
    description: 'Create a SandBase managed-agents session for an agent.',
    inputSchema: {
      agent: z.string().describe('Agent id, for example agent_assistant'),
      environment_id: z.string().optional().describe('Optional environment id'),
      title: z.string().optional().describe('Optional session title'),
    },
  }, async ({ agent, environment_id, title }) => result(await handlers.createSession({
    agent,
    environmentId: environment_id,
    title,
  })));

  server.registerTool('run_session', {
    description: 'Send a message to a session and wait until its streamed turn becomes idle.',
    inputSchema: {
      session_id: z.string().describe('Session id'),
      message: z.string().min(1).describe('User message to run'),
    },
  }, async ({ session_id, message }) => result(await handlers.runSession({
    sessionId: session_id,
    message,
  })));

  server.registerTool('get_session', {
    description: 'Get the current state and usage of a managed-agents session.',
    inputSchema: { session_id: z.string().describe('Session id') },
  }, async ({ session_id }) => result(await handlers.getSession(session_id)));

  server.registerTool('list_artifacts', {
    description: 'List artifacts produced by a managed-agents session.',
    inputSchema: { session_id: z.string().describe('Session id') },
  }, async ({ session_id }) => result(await handlers.listArtifacts(session_id)));

  server.registerTool('stop_session', {
    description: 'Interrupt the current turn, retain the sandbox for another message, and return the session. An idle session is unchanged; an already terminal session is refused.',
    inputSchema: { session_id: z.string().describe('Session id') },
  }, async ({ session_id }) => result(await handlers.stopSession(session_id)));
```

</details>

**依据 3 · 源码核查**：[src/sdk/client.ts:877-884](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/src/sdk/client.ts#L877-L884)

chat在idle或terminated退出。

```text
  async *chat(id: string, text: string): AsyncIterable<StreamedEvent> {
    const stream = this.message(id, text);
    for await (const event of stream) {
      yield event;
      if (event.type === 'session.status_idle' || event.type === 'session.status_terminated') {
        return;
      }
    }
```

#### 缺口

- 未沿全部核心任务执行器核对每类idle与审批等待、预算耗尽的映射。
  **影响**：本轮可确认MCP结果不足业务验收，不能认定所有终止状态均已解释。
  **进一步探讨**：为需批准、预算耗尽、模型错误和成功产物各取同版事件，核对run返回与查询状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地 sandbox 是否足以执行不可信仓库内容？

**研究主题**：工程质量与复用、依赖、兼容与流程

#### 完整回答

不能按“sandbox”名称推断强隔离。本地provider明确声明 isolatedExecution:false，命令以同一操作系统用户启动；路径工具有工作目录约束，命令字符串内绝对路径不是工具路径映射。源码实际在assertExistingPathInsideWorkDir遇到不存在目标时直接返回，而writeFile随后创建目录并写文件；末端悬空符号链接指向不存在的外部路径时可能绕过现存路径的realpath校验。这是具体实现边界，不是运行验证或泛化全部后端。

适用范围是可信本地开发与隔离资料，不宜直接给任意仓库内容执行权限。README列Docker、Kubernetes和自托管worker并不证明这些后端在本轮已检查；选择它们仍需核对挂载、网络、凭据和资源限制。上层研究worker应先固定只读源码、限定可写交付目录并禁用目标代码执行；若需要执行不可信代码，本轮材料不足以推荐任何后端作为已验收安全环境。

#### 证据与依据

**依据 1 · 源码核查**：[src/sandbox/local-provider.ts:4-17](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/src/sandbox/local-provider.ts#L4-L17)

作者明确无VM隔离并标注不适合不可信输出。

<details>
<summary>查看原文（14行）</summary>

```text
 * Default execution backend: runs commands as local subprocesses.
 * Working directory: <runtime-data-dir>/sandbox/<session_id>/
 *
 * No VM-level isolation. File tools are confined to the workspace by path
 * resolution (including symlink-escape checks) and the subprocess environment
 * is reduced to an allowlist. On POSIX hosts that carry the tooling,
 * `execute` additionally wraps each command in OS-level confinement —
 * `sandbox-exec` on macOS, `bubblewrap` on Linux — which denies writes
 * outside the workdir (see `local-isolation.ts`). That is a best-effort
 * seatbelt/namespace boundary, not a kernel VM boundary: a command still runs
 * as the same OS user, can read the host filesystem, and reaches the network
 * subject to the egress policy. This is why the provider keeps
 * `isolatedExecution: false` — suitable for trusted local development, not
 * for running untrusted agent output; use `docker` for that.
```

</details>

**依据 2 · 源码核查**：[src/sandbox/local-provider.ts:312-327](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/src/sandbox/local-provider.ts#L312-L327)

不存在路径跳过realpath，命令使用本地cwd。

<details>
<summary>查看原文（16行）</summary>

```text
  private assertExistingPathInsideWorkDir(fullPath: string, inputPath: string): void {
    if (!existsSync(fullPath)) return;

    const realPath = realpathSync(fullPath);
    const realWorkDir = realpathSync(this.workDir);
    const isInside = realPath === realWorkDir || realPath.startsWith(`${realWorkDir}${sep}`);

    if (!isInside) {
      throw new Error(`Path escapes sandbox workspace: ${inputPath}`);
    }
  }

  async execute(command: string, options?: ExecOptions): Promise<ExecResult> {
    const timeout = options?.timeout ?? 300_000; // 5 minutes default
    const cwd = options?.cwd ? this.resolveInsideWorkDir(options.cwd) : this.workDir;
    this.assertExistingPathInsideWorkDir(cwd, options?.cwd ?? '.');
```

</details>

**依据 3 · 源码核查**：[src/sandbox/local-provider.ts:430-436](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/src/sandbox/local-provider.ts#L430-L436)

writeFile路径检查后直接创建和写入。

```text
  async writeFile(path: string, content: string | Buffer): Promise<void> {
    const fullPath = this.resolveInsideWorkDir(path);
    const dir = dirname(fullPath);
    this.assertExistingPathInsideWorkDir(dir, path);
    this.assertExistingPathInsideWorkDir(fullPath, path);
    mkdirSync(dir, { recursive: true });
    writeFileSync(fullPath, content);
```

#### 缺口

- 未对Docker、Kubernetes与self-hosted后端做相同范围隔离核查。
  **影响**：不能将本地后端边界泛化，也不能据产品列表认为其他后端安全。
  **进一步探讨**：先固定实际后端和权限，以只读输入与受限输出检查路径逃逸、凭据和网络边界。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何计量部署、调用与人工验收成本并给出采用判断？

**研究主题**：效果与总成本、采用判断

#### 完整回答

采用单位是一份通过父编排者验收的研究交付，而不是run_session返回一次。需要部署服务、提供模型账户、配置Agent模型、保存工作区和会话状态，并将MCP指向正确运行时。README说明保存供应商设置后要重启，Agent模型ID还需匹配供应商；这说明配置成功不等于任务可跑。现金应包括worker模型、父模型验收、重试、计算和存储；人工应包括报告补证、版本一致性检查和异常会话回收。

建议观察，适合已有多轮独立worker需求且能维护本地服务的开发者先做只读样例评估。相对一次性脚本，会话和产物查询有可解释便利，但当前MCP契约不约束研究交付，本地执行也不是强隔离，无法直接支持把任意仓库交给高并发worker的持续采用。若连接断开后无法确认会话结果、交付不绑定固定版本或必须开放宿主执行权限，停止整合并回到固定目录中的单次只读worker和人工验收。没有实测总token和通过率，不能给出节省百分比。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:50-82](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/README.md#L50-L82)

部署依赖、供应商保存需重启和Agent模型匹配。

<details>
<summary>查看原文（33行）</summary>

````text
## Quick Start

Requirements: Node.js 22+, npm 10+, and a model provider API key (OpenAI,
Anthropic, MiniMax, or any OpenAI-compatible endpoint). Docker is optional and
only needed for Docker-backed sandboxes.

```bash
git clone --branch v0.3.8 --depth 1 https://github.com/sandbaseai/sandbase-harness.git
cd sandbase-harness
npm ci
npm run build
mkdir ../my-agents && cd ../my-agents
node ../sandbase-harness/dist/index.js init
node ../sandbase-harness/dist/index.js start
```

`init` writes a workspace into the directory you run it from: an agent, a skills
folder, and `config.yaml`, whose provider reference is the `${OPENAI_API_KEY}`
environment variable. `start` serves the API and the Console on
<http://127.0.0.1:3000>.

Two steps finish the setup, both on **Settings > Setup** at
<http://127.0.0.1:3000/dashboard>:

1. **The provider.** Paste your API key into the provider form and save. The page
   then reports that the saved configuration is not active yet, so restart the
   runtime — stop it with Ctrl+C and run the `start` command again, or use the
   restart button. A saved setting only takes effect at startup. If your provider
   is not in the list, choose the OpenAI-compatible vendor and set its base URL.
2. **The model.** In the **Agent models** panel, set the model ID your provider
   actually serves — `deepseek-chat` for DeepSeek, for example. An agent carries
   its own model ID, so the `gpt-4o` that `init` writes is not valid for every
   provider, and a wrong ID fails the turn with `model_not_found`.
````

</details>

**依据 2 · 源码核查**：[src/mcp/server.ts:40-61](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/src/mcp/server.ts#L40-L61)

结果与产物查询可用但无验收契约。

<details>
<summary>查看原文（22行）</summary>

```text
    async runSession(input: { sessionId: string; message: string }) {
      const events: StreamedEvent[] = [];
      let text = '';
      for await (const event of client.sessions.chat(input.sessionId, input.message)) {
        events.push(event);
        if (typeof event.delta === 'string') text += event.delta;
      }
      return {
        session_id: input.sessionId,
        text,
        terminal_event: events.at(-1)?.type ?? null,
        event_count: events.length,
      };
    },
    async getSession(sessionId: string) {
      return client.sessions.get(sessionId);
    },
    async listArtifacts(sessionId: string) {
      return (await client.sessions.artifacts(sessionId)).data;
    },
    async stopSession(sessionId: string) {
      return client.sessions.stop(sessionId);
```

</details>

**依据 3 · 源码核查**：[src/sandbox/local-provider.ts:4-17](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/src/sandbox/local-provider.ts#L4-L17)

本地隔离负担限制试用范围。

<details>
<summary>查看原文（14行）</summary>

```text
 * Default execution backend: runs commands as local subprocesses.
 * Working directory: <runtime-data-dir>/sandbox/<session_id>/
 *
 * No VM-level isolation. File tools are confined to the workspace by path
 * resolution (including symlink-escape checks) and the subprocess environment
 * is reduced to an allowlist. On POSIX hosts that carry the tooling,
 * `execute` additionally wraps each command in OS-level confinement —
 * `sandbox-exec` on macOS, `bubblewrap` on Linux — which denies writes
 * outside the workdir (see `local-isolation.ts`). That is a best-effort
 * seatbelt/namespace boundary, not a kernel VM boundary: a command still runs
 * as the same OS user, can read the host filesystem, and reaches the network
 * subject to the egress policy. This is why the provider keeps
 * `isolatedExecution: false` — suitable for trusted local development, not
 * for running untrusted agent output; use `docker` for that.
```

</details>

#### 缺口

- 父worker两端token、合格率与并发吞吐未记录。
  **影响**：无法将模型单价或主端token下降等同总成本下降。
  **进一步探讨**：用固定仓库和同一验收标准记录父端、worker端、失败补查token以及合格报告数。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 版本绑定报告契约能否使其成为可验收研究 worker？

**研究主题**：新假设与验证

#### 完整回答

可以推导未验证的研究交付适配层。保留现有会话管理，在结果里增加固定仓库提交、问题/答案/证据、材料摘要与报告位置，并将父端逐题决定和交付摘要绑定。相对现在只返回文本和最后事件，增量是让脚本预查版本、文件和覆盖关系，父模型只检查逐题语义与关键依赖，而不重做材料整理。

最小验证选五个不同机制的仓库，比较当前文本回传与版本绑定结构交付，在相同报告标准下记录父端阅读token、worker额外token、补证次数和漏放错误。必须同时计算两端与重试总量；如果worker为了结构重复输出大量材料、父端仍需重查全部源码，或者完整报告质量下降，就否定省token假设。现有MCP只提供会话调用基础，报告契约、验收链及并发负载保障均不能计入当前能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/mcp/server.ts:40-58](https://github.com/sandbaseai/sandbase-harness/blob/427b52a96a5309ca23268407f85c237468ab6a4e/src/mcp/server.ts#L40-L58)

当前仅文本/事件与单独产物列表，给出结构契约的直接差距。

<details>
<summary>查看原文（19行）</summary>

```text
    async runSession(input: { sessionId: string; message: string }) {
      const events: StreamedEvent[] = [];
      let text = '';
      for await (const event of client.sessions.chat(input.sessionId, input.message)) {
        events.push(event);
        if (typeof event.delta === 'string') text += event.delta;
      }
      return {
        session_id: input.sessionId,
        text,
        terminal_event: events.at(-1)?.type ?? null,
        event_count: events.length,
      };
    },
    async getSession(sessionId: string) {
      return client.sessions.get(sessionId);
    },
    async listArtifacts(sessionId: string) {
      return (await client.sessions.artifacts(sessionId)).data;
```

</details>

#### 缺口

- 结构交付能否在保持逐题质量时减少父端及总token。
  **影响**：不能预先承诺节省比例或说MCP天然压缩研究成本。
  **进一步探讨**：五仓库同条件盲验并完整计量双方与重试，质量门槛下降即失败。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
