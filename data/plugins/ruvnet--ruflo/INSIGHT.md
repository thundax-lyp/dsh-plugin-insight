# Ruflo

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e580bbc](https://github.com/ruvnet/ruflo/tree/e580bbc8204874f762d132fe441b18192979211b)

<!-- BEGIN META -->
[![GitHub ★ 80,349](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=80%2C349&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ruvnet/ruflo) [![npm 30d 52,361](https://img.shields.io/static/v1?label=npm+30d&message=52%2C361&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow)
<!-- END META -->

> **功能**：提供 CLI 和 MCP 工具以登记 Agent、组织任务并调用模型服务。

> **亮点**：[Q02](#research-q02) 显示统一登记、模型调用与结果归档，以及中央策略接线；相对原生任务的净收益未知，登记不是已启动工作者。

> **主要限制**：[Q03](#research-q03) 显示 task 完成和终止是状态操作；[Q04](#research-q04) 的 schema 过滤也不是授权。不能把 API 成功、隐藏 schema 或状态终止当成产物验收和物理退出。

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
  - [Q01 · 根组件是什么，为谁组织何种工作？](#detail-section-11)
  - [Q02 · MCP 登记与 agent_execute 实际执行什么？](#detail-section-12)
  - [Q03 · 任务完成和终止是否证明产物与进程终态？](#detail-section-13)
  - [Q04 · 工具展示与策略授权的真实边界是什么？](#detail-section-14)
  - [Q05 · 使用依赖、成本及退出条件是什么？](#detail-section-15)
  - [Q06 · 独立验收收据是否能减少误判？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有协调需求的开发者可以登记角色并组织模型调用；产物审查和业务验收仍由使用者负责。

宿主原生子 Agent 与人工任务清单也能组织工作；本次未做同模型、同任务的质量和费用对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Agent 登记 | 保存角色与模型设置 | 登记不启动工作者 |
| 模型调用 | 对登记 Agent 发出文本请求 | 代表路径未显示工具回灌循环 |
| 任务状态 | 保存分配、完成和取消 | 不等同产物验收或物理停止 |
| MCP 策略 | 在 handler 前判断调用 | legacy、observe 和 enforce 行为不同 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配的 Node 与构建 dist | CLI 需要 | 加载 v3 入口 | 缺失时不能推断能运行 |
| 模型 provider 与额度 | 模型调用需要 | 返回文本 | 凭据或服务不可用则请求失败 |
| 受控 stdio 和政策配置 | 按部署需要 | 控制调用者与操作 | schema 过滤不构成授权 |
| 项目状态写权限 | 持久化需要 | 保存 Agent 和任务 | 状态失败或并发冲突需核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户建立隔离副本和受控 stdio | 确认 root、策略、模型和费用 |
| 登记 | 用户或调用者创建 Agent 记录 | 记录存在，不当作工作已启动 |
| 请求 | 调用者发起模型请求 | 核对模型、停止原因与响应 |
| 验收 | 用户独立检查产物和状态 | 无验收证据或退出不明时停止并人工核查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 安装、构建及模型资源未知 | 配置 root、权限及隔离 | 需匹配 dist |
| 持续 | provider、重试及可选嵌入成本未知 | 分配、复核与合并 | 单次限制不等整体费用上限 |
| 失败恢复 | 状态、日志与重试成本未知 | 核对真实运行和副作用 | 状态停止不保证物理退出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 登记和文本调用 | MCP 接线及代表 provider 请求 | 自主代码交付和合格率 |
| 中央策略 | handler 前有策略判断 | 当前部署是否启用 enforce 与身份认证 |
| 任务状态 | 可以登记完成或取消 | 产物是否已独立验证 |

> **思考**：[Q03](#research-q03) 显示 task 完成和终止是状态操作；[Q04](#research-q04) 的 schema 过滤也不是授权。不能把 API 成功、隐藏 schema 或状态终止当成产物验收和物理退出。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 显示统一登记、模型调用与结果归档，以及中央策略接线；相对原生任务的净收益未知，登记不是已启动工作者。

[Q02](#research-q02) 的策略集中入口和结果重读有具体作用；[Q03](#research-q03) 的状态文件与实际运行生命周期不是同一事务，需要调用者独立核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示 task 完成和终止是状态操作；[Q04](#research-q04) 的 schema 过滤也不是授权。不能把 API 成功、隐藏 schema 或状态终止当成产物验收和物理退出。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先观察；确有需要时在隔离副本及私有受控 stdio 只测一个明确模型请求，分别核查状态、返回和独立产物。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持代表调用与状态路径；自主交付、运行表现和未来设计未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、bin/cli.js、v3/@claude-flow/cli/bin/cli.js、v3/@claude-flow/cli/src/mcp-client.ts、v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts、v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts、v3/@claude-flow/cli/src/mcp-tools/task-tools.ts、v3/@claude-flow/cli/src/mcp-tools/swarm-tools.ts、v3/@claude-flow/cli/src/services/policy-runtime.ts、v3/@claude-flow/security/src/policy/engine.ts、v3/@claude-flow/security/src/policy/evaluator.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向检查固定根包、stdio registry、agent 代表 provider、task 状态和 policy；未执行目标、已构建 dist、真实模型或 MCP，未全审其他 provider、workflow、native workers 和所有权限配置。
- 下一步：固定构建与 provider，在无敏感数据的副本对照宿主原生任务，测 policy 模式、终止后请求、实际产物、人工时间及费用。

**分析版本**

- **仓库**：[ruvnet/ruflo](https://github.com/ruvnet/ruflo)
- **版本号**：3.68.0（[固定提交 e580bbc](https://github.com/ruvnet/ruflo/tree/e580bbc8204874f762d132fe441b18192979211b)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出分别保存登记、响应、工作者停止和独立验收收据的未验证假设；若人工清单或原工具小修足够则不增加新系统。

固定构建与 provider，在无敏感数据的副本对照宿主原生任务，测 policy 模式、终止后请求、实际产物、人工时间及费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2235 | 482034 | — | — | 2121952 |
| .cjs | source | 32 | 12565 | 8783 | 3090 | — |
| .mjs | source | 386 | 72852 | 52213 | 14831 | — |
| .js | source | 73 | 24755 | 19559 | 3939 | — |
| .ts | source | 2308 | 656046 | 464458 | 117318 | — |
| .mjs | test | 107 | 11470 | 9595 | 1105 | — |
| .ts | test | 1458 | 312027 | 243663 | 23646 | — |
| .mts | source | 6 | 598 | 568 | 25 | — |
| .ts | example | 85 | 19167 | 14331 | 2543 | — |
| .md | example | 23 | 993 | — | — | 3946 |
| .mjs | example | 3 | 68 | 51 | 9 | — |
| .cjs | test | 9 | 859 | 732 | 77 | — |
| .cjs | example | 2 | 23 | 16 | 7 | — |
| .tsx | source | 79 | 14108 | 12916 | 238 | — |
| .js | example | 1 | 2 | 1 | 1 | — |
| .md | test | 10 | 2257 | — | — | 9038 |

</details>

**活跃度**

[![Issue 未关闭 667](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=667&color=737b86&logo=github)](https://github.com/ruvnet/ruflo/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 240](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=240&color=737b86&logo=github)](https://github.com/ruvnet/ruflo/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 262](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=262&color=737b86&logo=github)](https://github.com/ruvnet/ruflo/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根工具的 MCP 代表调用、状态、授权及与实际任务验收的关系。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根组件是什么，为谁组织何种工作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根 package.json:1-15 定义 claude-flow 3.68.0 的 CLI 包，bin/cli.js:1-11 代理到 v3 CLI；它是独立 CLI/MCP 工具而不是 DSH 原生插件。对于需要登记角色、分派任务和查看调用结果的开发者，潜在价值是统一状态及模型路由；人工清单和宿主原生子 Agent 是替代。相对已有工具的质量、净人工时间和费用没有同条件实测，模型收到的 prompt 可能包含用户数据；源码可见登记不等于自主工作。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-15](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/package.json#L1-L15)

根包身份及 CLI。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "claude-flow",
  "version": "3.68.0",
  "workspaces": [
    "v3/@claude-flow/codex",
    "v3/@claude-flow/mcp",
    "v3/@claude-flow/plugin-agent-federation",
    "v3/@claude-flow/security"
  ],
  "description": "Ruflo - Enterprise AI agent orchestration for Claude Code. Deploy 60+ specialized agents in coordinated swarms with self-learning, fault-tolerant consensus, vector memory, and MCP integration",
  "main": "dist/index.js",
  "type": "module",
  "bin": {
    "claude-flow": "bin/cli.js"
  },
```

</details>

**依据 2 · 源码核查**：[bin/cli.js:1-11](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/bin/cli.js#L1-L11)

入口代理 v3 CLI。

<details>
<summary>查看原文（11行）</summary>

```text
#!/usr/bin/env node
/**
 * Claude Flow CLI - Umbrella entry point
 * Proxies to @claude-flow/cli bin for cross-platform compatibility.
 */
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, '..', 'v3', '@claude-flow', 'cli', 'bin', 'cli.js');
await import(pathToFileURL(cliPath).href);
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:372-393](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L372-L393)

创建登记记录。

<details>
<summary>查看原文（22行）</summary>

```text
      const agent: AgentRecord = {
        agentId,
        agentType,
        ...(name ? { name } : {}),
        status: 'idle',
        health: 1.0,
        taskCount: 0,
        config,
        createdAt: new Date().toISOString(),
        domain: input.domain as string,
        model: routingResult.model,
        modelRoutedBy: routingResult.routedBy,
        ...(routingResult.modelId ? { modelId: routingResult.modelId } : {}),
        ...(explicitConfigProvider
          ? { provider: explicitConfigProvider }
          : routingResult.provider ? { provider: routingResult.provider } : {}),
        ...(routingResult.openrouterModel ? { openrouterModel: routingResult.openrouterModel } : {}),
      };

      const store = loadAgentStore();
      store.agents[agentId] = agent;
      saveAgentStore(store);
```

</details>

#### 缺口

- 缺同条件编码任务和用户对照
  **影响**：不能推断相对宿主 Agent 的净收益
  **进一步探讨**：比较同一代码任务的验收结果、人工时间和费用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · MCP 登记与 agent_execute 实际执行什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

v3/@claude-flow/cli/bin/cli.js:283-322 区分 tools/list 与 tools/call；src/mcp-client.ts:255-288 从注册表查工具，先调用中央授权再执行 handler。src/mcp-tools/agent-tools.ts:372-393 的 agent_spawn 保存 idle Agent 记录；520-543 的 agent_execute 校验输入后调用 executeAgentTask。agent-execute-core.ts:661-687 将记录标 busy，调用 provider；251-285 的 Anthropic 分支发送一条用户消息，291-312 抽取文本、stop reason 和 usage；832-877 重读注册表后保存结果。该代表分支是真实文本 API 请求，但并未展示工具结果回灌循环，不能把该次成功写成自主修改仓库。其他 provider、workflow 和已构建 dist 未完整核查或运行。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/bin/cli.js:283-322](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/bin/cli.js#L283-L322)

stdio 列出和调用工具。

<details>
<summary>查看原文（40行）</summary>

```text
      case 'tools/list': {
        const tools = _filterAdvertisedMcpTools(listMCPTools());
        return {
          jsonrpc: '2.0',
          id: message.id,
          result: {
            tools: tools.map(tool => ({
              name: tool.name,
              description: tool.description,
              inputSchema: tool.inputSchema,
            })),
          },
        };
      }

      case 'tools/call': {
        const toolName = params.name;
        const toolParams = params.arguments || {};

        if (!hasTool(toolName)) {
          return {
            jsonrpc: '2.0',
            id: message.id,
            error: { code: -32601, message: `Tool not found: ${toolName}` },
          };
        }

        if (isPolicyEnforcementEnabled()) {
          const check = evaluateToolCall(loadMcpPolicy(), sessionId, toolName);
          if (!check.allowed) {
            return {
              jsonrpc: '2.0',
              id: message.id,
              error: { code: -32001, message: `Policy denied: ${check.reason}` },
            };
          }
        }

        try {
          const result = await callMCPTool(toolName, toolParams, { sessionId, transport: 'stdio' });
```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-client.ts:255-288](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-client.ts#L255-L288)

注册表调用及策略。

<details>
<summary>查看原文（34行）</summary>

```text
export async function callMCPTool<T = unknown>(
  toolName: string,
  input: Record<string, unknown> = {},
  context?: Record<string, unknown>
): Promise<T> {
  // Look up tool in registry
  const tool = TOOL_REGISTRY.get(toolName);

  if (!tool) {
    throw new MCPClientError(
      `MCP tool not found: ${toolName}`,
      toolName
    );
  }

  try {
    // ADR-324: one policy chokepoint for every local CLI/MCP invocation.
    // Policy administration is not exempt: authorization calls the engine
    // directly, so there is no recursive MCP dispatch. In enforce mode an
    // administrator must explicitly allow policy.* actions or use the local
    // CLI bootstrap path.
    const decision = await authorizeMcpTool(toolName, input, context, classifyMcpTool(toolName));
    if (decision.enforcedOutcome !== 'allowed') {
      throw new Error(`policy-${decision.enforcedOutcome}:${decision.reason}; receipt=${decision.receiptId}`);
    }
    // Call the tool handler
    const result = await tool.handler(input, context);
    // ADR-146 P2: scan every tool result for indirect-injection before it
    // returns to the caller. The screen is opt-in via env (default off in
    // 3.10.34 — flip to default in v4) so existing pipelines keep their
    // exact behaviour while the call site is exercised by tests and
    // adopters. Telemetry from the screen lands in the shared
    // GuardrailEvent sink (P5).
    return applyContentBoundaryGuardrail(toolName, result) as T;
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:372-393](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L372-L393)

保存 Agent 元数据。

<details>
<summary>查看原文（22行）</summary>

```text
      const agent: AgentRecord = {
        agentId,
        agentType,
        ...(name ? { name } : {}),
        status: 'idle',
        health: 1.0,
        taskCount: 0,
        config,
        createdAt: new Date().toISOString(),
        domain: input.domain as string,
        model: routingResult.model,
        modelRoutedBy: routingResult.routedBy,
        ...(routingResult.modelId ? { modelId: routingResult.modelId } : {}),
        ...(explicitConfigProvider
          ? { provider: explicitConfigProvider }
          : routingResult.provider ? { provider: routingResult.provider } : {}),
        ...(routingResult.openrouterModel ? { openrouterModel: routingResult.openrouterModel } : {}),
      };

      const store = loadAgentStore();
      store.agents[agentId] = agent;
      saveAgentStore(store);
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:520-543](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L520-L543)

校验后执行共享 core。

<details>
<summary>查看原文（24行）</summary>

```text
    handler: async (input) => {
      const vId = validateIdentifier(input.agentId, 'agentId');
      if (!vId.valid) return { success: false, error: `Input validation failed: ${vId.error}` };
      const vP = validateText(input.prompt as string, 'prompt');
      if (!vP.valid) return { success: false, error: `Input validation failed: ${vP.error}` };
      const pheromone = pheromoneAgentEligibility(input.agentId as string);
      if (!pheromone.eligible) {
        return {
          success: false,
          agentId: input.agentId,
          suspended: true,
          error: pheromone.reason,
        };
      }

      // Delegate to the shared core (also used by the workflow runtime).
      return executeAgentTask({
        agentId: input.agentId as string,
        prompt: input.prompt as string,
        systemPrompt: input.systemPrompt as string | undefined,
        maxTokens: input.maxTokens as number | undefined,
        temperature: input.temperature as number | undefined,
        timeoutMs: input.timeoutMs as number | undefined,
      });
```

</details>

**依据 5 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:661-687](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L661-L687)

调用 provider 并更新记录。

<details>
<summary>查看原文（27行）</summary>

```text
  const initialModelId = agent.modelId;
  const initialModel = agent.model;
  agent.status = 'busy';
  agent.taskCount = (agent.taskCount || 0) + 1;
  saveAgentStore(store);

  const executionKey = JSON.stringify([getAgentPath(), input.agentId, agent.createdAt]);
  activeExecutions.set(executionKey, (activeExecutions.get(executionKey) || 0) + 1);
  try {
  const startedAt = Date.now();

  // #2042 — delegate to callAnthropicMessages so the v3 provider router
  // (Anthropic / Ollama / OpenRouter) governs which backend is hit.
  // #2962 — forward the agent's own explicit provider (set at spawn time
  // from --provider / persisted config) so it outranks env-var inference.
  // Only the first-attempt call; the ADR-149 fallback-retry call below is
  // driven by the cost-optimal neural router picking model-id alternatives,
  // an orthogonal mechanism left as-is to avoid unintended interaction.
  let result = await callAnthropicMessages({
    model: anthropicModel,
    prompt: input.prompt,
    systemPrompt,
    maxTokens: input.maxTokens,
    temperature: input.temperature,
    timeoutMs: input.timeoutMs,
    provider: agent.provider,
  });
```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:251-285](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L251-L285)

Anthropic 单次请求。

<details>
<summary>查看原文（35行）</summary>

```text
  const model = input.model || DEFAULT_ANTHROPIC_MODEL;
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs || 60000);
  try {
    const baseUrl = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
    const res = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        ...(anthropicAuthToken
          ? { Authorization: `Bearer ${anthropicAuthToken}` }
          : { 'x-api-key': anthropicKey }),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: input.maxTokens || 1024,
        // #2357 — omit temperature for models that reject sampling params
        // (Fable 5 / Opus 4.8 / Opus 4.7 → 400 "Extra inputs are not
        // permitted"); keep the 0.7 default unchanged for models that still
        // accept it (sonnet / haiku / opus ≤4.6).
        ...(modelRejectsSamplingParams(model)
          ? {}
          : { temperature: typeof input.temperature === 'number' ? input.temperature : 0.7 }),
        // #8 prompt caching (hermes-agent pattern): mark the (often large,
        // stable) system prompt as an ephemeral cache breakpoint so repeated
        // agent_execute calls with the same system prompt hit Anthropic's
        // prompt cache (~90% discount on cached input tokens, 5-min TTL).
        ...(input.systemPrompt
          ? { system: [{ type: 'text', text: input.systemPrompt, cache_control: { type: 'ephemeral' } }] }
          : {}),
        messages: [{ role: 'user', content: input.prompt }],
      }),
      signal: controller.signal,
```

</details>

**依据 7 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:291-312](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L291-L312)

文本、usage 和停止原因。

<details>
<summary>查看原文（22行）</summary>

```text
    const data = await res.json() as {
      id: string;
      model: string;
      content: Array<{ type: string; text?: string }>;
      stop_reason: string;
      usage: { input_tokens: number; output_tokens: number };
    };
    const textOut = data.content
      .filter(c => c.type === 'text' && typeof c.text === 'string')
      .map(c => c.text as string)
      .join('');
    return {
      success: true,
      model: data.model,
      messageId: data.id,
      stopReason: data.stop_reason,
      output: textOut,
      usage: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
```

</details>

**依据 8 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:832-877](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L832-L877)

完成重读与归档。

<details>
<summary>查看原文（46行）</summary>

```text
  const remaining = (activeExecutions.get(executionKey) || 1) - 1;
  const persistCompletion = (out?: AgentExecuteResult): void => {
    // Awaited provider/feedback work may have overlapped registration, updates,
    // termination or deletion. Never replace that newer registry snapshot.
    const latest = loadAgentStore();
    const current = latest.agents[input.agentId];
    if (!current || current.createdAt !== agent.createdAt) return;
    if (current.status === 'busy') current.status = remaining > 0 ? 'busy' : 'idle';
    if (agent.modelId !== initialModelId && current.modelId === initialModelId) {
      // A fallback may also change its tier. Carry that change with the model
      // ID, but preserve any selection the user edited during the request.
      if (agent.model !== initialModel && current.model === initialModel) current.model = agent.model;
      current.modelId = agent.modelId;
    }
    if (out) current.lastResult = out as unknown as Record<string, unknown>;
    const previousMeasuredHealth = summarizeAgentExecutions(current.executionHistory).health;
    const mayUpdateStoredHealth = previousMeasuredHealth === null
      ? current.health === agent.health
      : current.health === previousMeasuredHealth;
    current.executionHistory = appendAgentExecution(current.executionHistory, {
      at: new Date().toISOString(),
      success: result.success,
      durationMs: result.durationMs ?? Date.now() - startedAt,
    });
    // An explicit agent_update during the provider call still wins. The
    // measured value remains available from executionHistory in agent_health.
    if (mayUpdateStoredHealth) {
      current.health = summarizeAgentExecutions(current.executionHistory).health ?? current.health;
    }
    saveAgentStore(latest);
  };

  if (result.success) {
    const out: AgentExecuteResult = {
      success: true,
      agentId: input.agentId,
      messageId: result.messageId,
      model: result.model,
      stopReason: result.stopReason,
      output: result.output,
      usage: result.usage,
      durationMs: result.durationMs ?? Date.now() - startedAt,
      ...(fallbackHistory.length > 0 ? { fallbackHistory } : {}),
    };
    persistCompletion(out);
    return out;
```

</details>

#### 缺口

- 未运行目标及其它 provider/工作流
  **影响**：代表文本请求不证明自主执行或任务合格
  **进一步探讨**：固定 dist 和 provider，测试真实产物、失败及结果回流。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 任务完成和终止是否证明产物与进程终态？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

task-tools.ts:294-322 的 task_complete 把调用者提供的 result 写为 completed 和 100%，没有在这条分支独立运行产物验证；550-571 的 task_cancel 写 cancelled 并释放关联 Agent。agent-tools.ts:559-583 的 terminate 标记记录 terminated，附带可选 memory 处理；未见该分支中取消正在进行的 provider HTTP 调用。agent-execute-core.ts:832-846 完成时重读并保留非 busy 的新状态，但仍可能保存返回结果。swarm-tools.ts:106-131、155-164 有孤儿状态判断和临时文件 rename，这不将多个状态文件变成一个原子事务，也不证明终止远端进程或撤销副作用。中断、多进程和外部状态尚未实测。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/task-tools.ts:294-322](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/task-tools.ts#L294-L322)

task_complete 写状态和调用者结果。

<details>
<summary>查看原文（29行）</summary>

```text
    name: 'task_complete',
    description: 'Mark task as complete Use when native TodoWrite is wrong because you need cross-session task persistence, agent assignment, dependency tracking, or completion analytics in the .swarm/memory.db. For in-session checklists native TodoWrite is simpler and faster.',
    category: 'task',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: { type: 'string', description: 'Task ID' },
        result: { type: 'object', description: 'Task result data' },
      },
      required: ['taskId'],
    },
    handler: async (input) => {
      // Validate user-provided input (#1425)
      const vId = validateIdentifier(input.taskId, 'taskId');
      if (!vId.valid) return { success: false, error: vId.error };

      const store = loadTaskStore();
      const taskId = input.taskId as string;
      const task = store.tasks[taskId];

      if (task) {
        if (task.status === 'completed') {
          return { taskId: task.taskId, status: task.status, completedAt: task.completedAt, result: task.result };
        }
        task.status = 'completed';
        task.progress = 100;
        task.completedAt = new Date().toISOString();
        task.result = (input.result as Record<string, unknown>) || {};
        saveTaskStore(store);
```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/task-tools.ts:550-571](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/task-tools.ts#L550-L571)

取消写状态及释放 Agent。

<details>
<summary>查看原文（22行）</summary>

```text
      const taskId = input.taskId as string;
      const task = store.tasks[taskId];

      if (task) {
        const previousStatus = task.status;
        // A finished task keeps its outcome: cancelling it used to overwrite a
        // completed task's result and completedAt with a cancel reason.
        if (previousStatus === 'completed' || previousStatus === 'failed' || previousStatus === 'cancelled') {
          return {
            success: false,
            taskId,
            status: previousStatus,
            previousStatus,
            error: `Task is already ${previousStatus}`,
          };
        }

        task.status = 'cancelled';
        task.completedAt = new Date().toISOString();
        task.result = { cancelReason: input.reason || 'Cancelled by user' };
        saveTaskStore(store);
        releaseAgents(task.assignedTo, taskId);
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:559-583](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L559-L583)

终止记录及 memory 分支。

<details>
<summary>查看原文（25行）</summary>

```text
    handler: async (input) => {
      const v = validateIdentifier(input.agentId, 'agentId');
      if (!v.valid) return { success: false, error: `Input validation failed: ${v.error}` };

      const store = loadAgentStore();
      const agentId = input.agentId as string;

      if (store.agents[agentId]) {
        const rec = store.agents[agentId];
        rec.status = 'terminated';
        saveAgentStore(store);

        // ACOW — resolve the agent's COW memory branch on teardown: promote
        // (merge into base) when asked, else discard. Non-fatal — a failure
        // here never blocks termination. Discard needs no agenticow (pure fs),
        // so cleanup still works in the degraded path.
        let memory: Record<string, unknown> | undefined;
        if (rec.memoryBranch) {
          try {
            const { SwarmMemoryBranches } = await import('../services/swarm-memory-branches.js');
            const svc = new SwarmMemoryBranches();
            memory = input.promoteMemory
              ? (await svc.promoteAgent(agentId)) as unknown as Record<string, unknown>
              : (await svc.discardAgent(agentId)) as unknown as Record<string, unknown>;
          } catch { /* best-effort teardown */ }
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:832-846](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L832-L846)

请求完成时重读并写结果。

<details>
<summary>查看原文（15行）</summary>

```text
  const remaining = (activeExecutions.get(executionKey) || 1) - 1;
  const persistCompletion = (out?: AgentExecuteResult): void => {
    // Awaited provider/feedback work may have overlapped registration, updates,
    // termination or deletion. Never replace that newer registry snapshot.
    const latest = loadAgentStore();
    const current = latest.agents[input.agentId];
    if (!current || current.createdAt !== agent.createdAt) return;
    if (current.status === 'busy') current.status = remaining > 0 ? 'busy' : 'idle';
    if (agent.modelId !== initialModelId && current.modelId === initialModelId) {
      // A fallback may also change its tier. Carry that change with the model
      // ID, but preserve any selection the user edited during the request.
      if (agent.model !== initialModel && current.model === initialModel) current.model = agent.model;
      current.modelId = agent.modelId;
    }
    if (out) current.lastResult = out as unknown as Record<string, unknown>;
```

</details>

**依据 5 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/swarm-tools.ts:106-131](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/swarm-tools.ts#L106-L131)

孤儿状态检查。

<details>
<summary>查看原文（26行）</summary>

```text
const ORPHAN_TTL_MS = 24 * 60 * 60 * 1000;
function reconcileOrphanSwarms(store: SwarmStore): number {
  let reconciled = 0;
  const nowIso = new Date().toISOString();
  const nowMs = Date.now();
  for (const swarm of Object.values(store.swarms)) {
    if (swarm.status !== 'running') continue;
    let orphanReason: string | null = null;
    if (typeof swarm.pid === 'number') {
      if (!isPidAlive(swarm.pid)) {
        orphanReason = `host process ${swarm.pid} exited`;
      }
    } else {
      const ageMs = nowMs - new Date(swarm.updatedAt).getTime();
      if (Number.isFinite(ageMs) && ageMs > ORPHAN_TTL_MS) {
        orphanReason = `no pid recorded and heartbeat is ${Math.round(ageMs / 3600000)}h stale`;
      }
    }
    if (orphanReason) {
      swarm.status = 'terminated';
      swarm.terminationReason = orphanReason;
      swarm.updatedAt = nowIso;
      reconciled++;
    }
  }
  return reconciled;
```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/swarm-tools.ts:155-164](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/swarm-tools.ts#L155-L164)

单文件临时写和 rename。

<details>
<summary>查看原文（10行）</summary>

```text
export function saveSwarmStore(store: SwarmStore): void {
  ensureSwarmDir();
  const target = getSwarmStatePath();
  const temporary = `${target}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
  try {
    writeFileSync(temporary, JSON.stringify(store, null, 2), { encoding: 'utf-8', mode: 0o600 });
    renameSync(temporary, target);
  } catch (error) {
    try { unlinkSync(temporary); } catch { /* already renamed or never created */ }
    throw error;
```

</details>

#### 缺口

- 未运行进程取消及并发恢复
  **影响**：状态不能证明外部动作停止或多文件事务
  **进一步探讨**：隔离环境中断请求并核对进程、状态和实际副作用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工具展示与策略授权的真实边界是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

CLI bin/cli.js:41-58、283-322 仅对 tools/list 调用广告过滤，tools/call 仍通过 hasTool 检索完整注册表；因此隐藏 schema 不是调用权限。mcp-client.ts:270-281 在 handler 前调用 authorizeMcpTool 并依据 enforcedOutcome 拒绝，是真正的中央策略路径；security/src/policy/engine.ts:398-403 的初始状态是 legacy，evaluator.ts:110-128 中只有 enforce 模式把规则 outcome 用作 enforcedOutcome，其他模式返回 allowed。policy-runtime.ts:823-835 的调用者身份认证在未启用时采用环境身份或 legacy，启用后要求凭据。不能以代码存在推断当前部署启用了 enforce、身份验证或多租户隔离；应按实际 root、配置和可信 stdio 边界审计。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/bin/cli.js:41-58](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/bin/cli.js#L41-L58)

可筛选工具广告。

<details>
<summary>查看原文（18行）</summary>

```text
function _filterAdvertisedMcpTools(tools) {
  const argv = process.argv.slice(2);
  const toolsIndex = argv.findIndex((arg) => arg === '--tools');
  const inlineTools = argv.find((arg) => arg.startsWith('--tools='));
  const configured = process.env.CLAUDE_FLOW_MCP_TOOLS
    || (toolsIndex >= 0 ? argv[toolsIndex + 1] : undefined)
    || (inlineTools ? inlineTools.slice('--tools='.length) : undefined);
  if (!configured || configured.trim().toLowerCase() === 'all') return tools;
  const selectors = new Set(
    configured.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean),
  );
  if (selectors.size === 0) return tools;
  return tools.filter((tool) => {
    const name = tool.name.toLowerCase();
    const category = typeof tool.category === 'string' ? tool.category.toLowerCase() : '';
    return selectors.has(name)
      || selectors.has(category)
      || Array.from(selectors).some((selector) => name.startsWith(`${selector}_`));
```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/bin/cli.js:283-322](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/bin/cli.js#L283-L322)

list 筛选与 call 查询全注册表。

<details>
<summary>查看原文（40行）</summary>

```text
      case 'tools/list': {
        const tools = _filterAdvertisedMcpTools(listMCPTools());
        return {
          jsonrpc: '2.0',
          id: message.id,
          result: {
            tools: tools.map(tool => ({
              name: tool.name,
              description: tool.description,
              inputSchema: tool.inputSchema,
            })),
          },
        };
      }

      case 'tools/call': {
        const toolName = params.name;
        const toolParams = params.arguments || {};

        if (!hasTool(toolName)) {
          return {
            jsonrpc: '2.0',
            id: message.id,
            error: { code: -32601, message: `Tool not found: ${toolName}` },
          };
        }

        if (isPolicyEnforcementEnabled()) {
          const check = evaluateToolCall(loadMcpPolicy(), sessionId, toolName);
          if (!check.allowed) {
            return {
              jsonrpc: '2.0',
              id: message.id,
              error: { code: -32001, message: `Policy denied: ${check.reason}` },
            };
          }
        }

        try {
          const result = await callMCPTool(toolName, toolParams, { sessionId, transport: 'stdio' });
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-client.ts:270-288](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-client.ts#L270-L288)

调用中央策略再执行 handler。

<details>
<summary>查看原文（19行）</summary>

```text
  try {
    // ADR-324: one policy chokepoint for every local CLI/MCP invocation.
    // Policy administration is not exempt: authorization calls the engine
    // directly, so there is no recursive MCP dispatch. In enforce mode an
    // administrator must explicitly allow policy.* actions or use the local
    // CLI bootstrap path.
    const decision = await authorizeMcpTool(toolName, input, context, classifyMcpTool(toolName));
    if (decision.enforcedOutcome !== 'allowed') {
      throw new Error(`policy-${decision.enforcedOutcome}:${decision.reason}; receipt=${decision.receiptId}`);
    }
    // Call the tool handler
    const result = await tool.handler(input, context);
    // ADR-146 P2: scan every tool result for indirect-injection before it
    // returns to the caller. The screen is opt-in via env (default off in
    // 3.10.34 — flip to default in v4) so existing pipelines keep their
    // exact behaviour while the call site is exercised by tests and
    // adopters. Telemetry from the screen lands in the shared
    // GuardrailEvent sink (P5).
    return applyContentBoundaryGuardrail(toolName, result) as T;
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/security/src/policy/engine.ts:398-403](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/security/src/policy/engine.ts#L398-L403)

默认 legacy 状态。

```text
export function createLegacyCompatibleState(source = 'pre-ADR-324'): PolicyState {
  return {
    version: POLICY_STATE_VERSION,
    mode: 'legacy',
    migratedFrom: source,
    migratedAt: Date.now(),
```

**依据 5 · 源码核查**：[v3/@claude-flow/security/src/policy/evaluator.ts:110-128](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/security/src/policy/evaluator.ts#L110-L128)

enforce 与其他模式的实际结果。

<details>
<summary>查看原文（19行）</summary>

```text
  } else if (approval) {
    outcome = 'approval_required';
    reason = `approval-required-by:${approval.id}`;
  } else if (allow) {
    outcome = 'allowed';
    reason = `allowed-by:${allow.id}`;
  } else {
    outcome = mode === 'legacy' ? 'allowed' : 'denied';
    reason = mode === 'legacy' ? 'legacy-default-allow' : 'default-deny';
  }

  return {
    requestId,
    outcome,
    enforcedOutcome: mode === 'enforce' ? outcome : 'allowed',
    mode,
    reason,
    matchedRules: matched.map((rule) => rule.id),
    obligations: approval ? ['valid-human-approval'] : [],
```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/cli/src/services/policy-runtime.ts:823-835](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/services/policy-runtime.ts#L823-L835)

调用者认证开关与缺凭据处理。

<details>
<summary>查看原文（13行）</summary>

```text
function resolveMcpCallerIdentity(): { id: string; type: 'agent' | 'legacy' } {
  if (!isMcpCallerAuthEnabled()) {
    return {
      id: process.env.CLAUDE_FLOW_PRINCIPAL_ID ?? 'legacy-cli',
      type: process.env.CLAUDE_FLOW_PRINCIPAL_ID ? 'agent' : 'legacy',
    };
  }

  const encodedToken = process.env.CLAUDE_FLOW_MCP_INVOCATION_TOKEN;
  const publicKeyHex = process.env.CLAUDE_FLOW_MCP_CALLER_PUBKEY;
  if (!encodedToken || !publicKeyHex) {
    throw new Error('mcp-caller-auth-enabled-but-no-token');
  }
```

</details>

#### 缺口

- 实际部署 root、策略及调用者认证未验证
  **影响**：不能推断生产隔离或授权强度
  **进一步探讨**：读取受控部署的配置并在隔离 stdio 验证拒绝路径。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 使用依赖、成本及退出条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

Node、匹配的构建 dist、私有受控 stdio、有效模型/额度及可写项目状态是代表路径的条件。agent-execute-core.ts:251-285 发出带用户 prompt 的模型请求并设置输出 token 和超时；689-700 的可重试故障在 modelId 存在时默认最多一次 fallback，因此单次超时或 maxTokens 不是整个任务及费用的完整上限。741-789 的 API 成功反馈可用于路由训练，其 success 标签并不检查任务是否正确，且可选轨迹涉及任务文本。建议先观察；如确有需求，再在独立账号、无敏感数据副本和受控 stdio 使用单项小样，明确模型、输出限额和关闭 fallback，并分开核对状态、响应与独立产物验收。身份、费用、root 或退出状态不明即停止并人工核查；实际费用、隐私留存与收益未经测试。

#### 证据与依据

**依据 1 · 源码核查**：[bin/cli.js:9-11](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/bin/cli.js#L9-L11)

加载 v3 CLI 的前提。

```text
const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, '..', 'v3', '@claude-flow', 'cli', 'bin', 'cli.js');
await import(pathToFileURL(cliPath).href);
```

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:251-285](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L251-L285)

真实请求、超时和 token 配置。

<details>
<summary>查看原文（35行）</summary>

```text
  const model = input.model || DEFAULT_ANTHROPIC_MODEL;
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs || 60000);
  try {
    const baseUrl = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
    const res = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        ...(anthropicAuthToken
          ? { Authorization: `Bearer ${anthropicAuthToken}` }
          : { 'x-api-key': anthropicKey }),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: input.maxTokens || 1024,
        // #2357 — omit temperature for models that reject sampling params
        // (Fable 5 / Opus 4.8 / Opus 4.7 → 400 "Extra inputs are not
        // permitted"); keep the 0.7 default unchanged for models that still
        // accept it (sonnet / haiku / opus ≤4.6).
        ...(modelRejectsSamplingParams(model)
          ? {}
          : { temperature: typeof input.temperature === 'number' ? input.temperature : 0.7 }),
        // #8 prompt caching (hermes-agent pattern): mark the (often large,
        // stable) system prompt as an ephemeral cache breakpoint so repeated
        // agent_execute calls with the same system prompt hit Anthropic's
        // prompt cache (~90% discount on cached input tokens, 5-min TTL).
        ...(input.systemPrompt
          ? { system: [{ type: 'text', text: input.systemPrompt, cache_control: { type: 'ephemeral' } }] }
          : {}),
        messages: [{ role: 'user', content: input.prompt }],
      }),
      signal: controller.signal,
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:689-700](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L689-L700)

有限条件下默认 fallback。

<details>
<summary>查看原文（12行）</summary>

```text
  // ADR-149 iter 7 — fallback chain on retryable failures (429, 5xx,
  // timeout). When the cost-optimal neural backend picked a specific
  // model id and that model fails for a transient reason, fall back to
  // the next-cheapest candidate that clears the quality bar. Budget is
  // bounded by CLAUDE_FLOW_ROUTER_FALLBACK_MAX_RETRIES (default 1) so
  // upstream outages don't cause retry storms.
  const configuredFallbackBudget = parseInt(process.env.CLAUDE_FLOW_ROUTER_FALLBACK_MAX_RETRIES ?? '1', 10);
  const fallbackBudget = Number.isNaN(configuredFallbackBudget) ? 1 : Math.max(0, configuredFallbackBudget);
  const fallbackHistory: Array<{ modelId: string; error: string }> = [];
  // Keep feedback for each completed attempt before switching model identity.
  const failedAttempts: Array<{ model: ClaudeModel; modelId: string }> = [];
  if (!result.success && agent.modelId && fallbackBudget > 0) {
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:753-789](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L753-L789)

API outcome 与可选轨迹反馈。

<details>
<summary>查看原文（37行）</summary>

```text
    const tier: 'haiku' | 'sonnet' | 'opus' | 'inherit' =
      agent.model === 'opus-4.7' ? 'opus' :
      (agent.model as 'haiku' | 'sonnet' | 'opus' | 'inherit' | undefined) ?? 'sonnet';
    const outcome: 'success' | 'failure' = result.success ? 'success' : 'failure';
    for (const attempt of failedAttempts) {
      recordModelOutcome(input.prompt, attempt.model === 'opus-4.7' ? 'opus' : attempt.model, 'failure');
      recordModelOutcomeByModelId(input.prompt, attempt.modelId, 'failure');
    }
    recordModelOutcome(input.prompt, tier, outcome);
    // ADR-149 — also write to the shadow per-modelId priors when the cost-
    // optimal neural backend picked a concrete model id. Selection logic
    // still uses tier priors, but the per-modelId data accumulates so a
    // future refactor can switch the selector over.
    if (agent.modelId) {
      recordModelOutcomeByModelId(input.prompt, agent.modelId, outcome);
    }
    // ADR-149 iter 17 — close the production-data side of the feedback loop.
    // The trajectory recorder (CLAUDE_FLOW_ROUTER_TRAJECTORY=1) writes
    // per-decision rows to .swarm/model-router-trajectories.jsonl from the
    // model-router itself. Now we ALSO write outcome rows here so future
    // training (scripts/train-from-trajectories.mjs, follow-up) can pair
    // decision+outcome by task_hash and produce DRACO-shaped retraining
    // rows from real production traffic. quality = 1.0 on success, 0.0 on
    // failure (coarse signal; finer-grained quality from user ratings or
    // regression-detection is a separate hook).
    if (process.env.CLAUDE_FLOW_ROUTER_TRAJECTORY === '1') {
      try {
        const { recordTrajectoryOutcome } = await import('../ruvector/router-trajectory.js');
        const scores: Record<string, number> | undefined = agent.modelId
          ? { [agent.modelId]: outcome === 'success' ? 1.0 : 0.0 }
          : undefined;
        // iter 31 — pass token usage + modelId so the recorder can compute
        // USD spend at write time. Consumers (`router decisions`, cost-
        // savings reports) get cost without their own price table.
        recordTrajectoryOutcome({
          task: input.prompt,
          quality: outcome === 'success' ? 1.0 : 0.0,
```

</details>

**依据 5 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:559-583](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L559-L583)

终止记录范围。

<details>
<summary>查看原文（25行）</summary>

```text
    handler: async (input) => {
      const v = validateIdentifier(input.agentId, 'agentId');
      if (!v.valid) return { success: false, error: `Input validation failed: ${v.error}` };

      const store = loadAgentStore();
      const agentId = input.agentId as string;

      if (store.agents[agentId]) {
        const rec = store.agents[agentId];
        rec.status = 'terminated';
        saveAgentStore(store);

        // ACOW — resolve the agent's COW memory branch on teardown: promote
        // (merge into base) when asked, else discard. Non-fatal — a failure
        // here never blocks termination. Discard needs no agenticow (pure fs),
        // so cleanup still works in the degraded path.
        let memory: Record<string, unknown> | undefined;
        if (rec.memoryBranch) {
          try {
            const { SwarmMemoryBranches } = await import('../services/swarm-memory-branches.js');
            const svc = new SwarmMemoryBranches();
            memory = input.promoteMemory
              ? (await svc.promoteAgent(agentId)) as unknown as Record<string, unknown>
              : (await svc.discardAgent(agentId)) as unknown as Record<string, unknown>;
          } catch { /* best-effort teardown */ }
```

</details>

#### 缺口

- 实际费用、保留策略及净人工未知
  **影响**：不能按超时或模型成功估算整体成本
  **进一步探讨**：隔离账号、显式模型及零 fallback 执行代表样本并核对账单。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 独立验收收据是否能减少误判？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

由 task_complete 直接记录状态、agent_execute 将 API 成功映射为弱反馈，可提出未验证假设：将登记、模型响应、工作者停止和独立产物验收分别作为有来源的收据，能减少将 API 成功误作任务完成的误解。它会增加调用与审核成本，并须先核对既有 quality hook 能否承担；对照原生任务、人工清单和本地小修，以相同任务记录误判、重复工作与人工时间。如果简单方案已足够或额外收据没有改善合格结果，应放弃独立编排扩展。无原型和效果实验。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/task-tools.ts:310-322](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/task-tools.ts#L310-L322)

任务状态由输入结果驱动。

<details>
<summary>查看原文（13行）</summary>

```text
      const store = loadTaskStore();
      const taskId = input.taskId as string;
      const task = store.tasks[taskId];

      if (task) {
        if (task.status === 'completed') {
          return { taskId: task.taskId, status: task.status, completedAt: task.completedAt, result: task.result };
        }
        task.status = 'completed';
        task.progress = 100;
        task.completedAt = new Date().toISOString();
        task.result = (input.result as Record<string, unknown>) || {};
        saveTaskStore(store);
```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:753-789](https://github.com/ruvnet/ruflo/blob/e580bbc8204874f762d132fe441b18192979211b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L753-L789)

API 成功映射为反馈。

<details>
<summary>查看原文（37行）</summary>

```text
    const tier: 'haiku' | 'sonnet' | 'opus' | 'inherit' =
      agent.model === 'opus-4.7' ? 'opus' :
      (agent.model as 'haiku' | 'sonnet' | 'opus' | 'inherit' | undefined) ?? 'sonnet';
    const outcome: 'success' | 'failure' = result.success ? 'success' : 'failure';
    for (const attempt of failedAttempts) {
      recordModelOutcome(input.prompt, attempt.model === 'opus-4.7' ? 'opus' : attempt.model, 'failure');
      recordModelOutcomeByModelId(input.prompt, attempt.modelId, 'failure');
    }
    recordModelOutcome(input.prompt, tier, outcome);
    // ADR-149 — also write to the shadow per-modelId priors when the cost-
    // optimal neural backend picked a concrete model id. Selection logic
    // still uses tier priors, but the per-modelId data accumulates so a
    // future refactor can switch the selector over.
    if (agent.modelId) {
      recordModelOutcomeByModelId(input.prompt, agent.modelId, outcome);
    }
    // ADR-149 iter 17 — close the production-data side of the feedback loop.
    // The trajectory recorder (CLAUDE_FLOW_ROUTER_TRAJECTORY=1) writes
    // per-decision rows to .swarm/model-router-trajectories.jsonl from the
    // model-router itself. Now we ALSO write outcome rows here so future
    // training (scripts/train-from-trajectories.mjs, follow-up) can pair
    // decision+outcome by task_hash and produce DRACO-shaped retraining
    // rows from real production traffic. quality = 1.0 on success, 0.0 on
    // failure (coarse signal; finer-grained quality from user ratings or
    // regression-detection is a separate hook).
    if (process.env.CLAUDE_FLOW_ROUTER_TRAJECTORY === '1') {
      try {
        const { recordTrajectoryOutcome } = await import('../ruvector/router-trajectory.js');
        const scores: Record<string, number> | undefined = agent.modelId
          ? { [agent.modelId]: outcome === 'success' ? 1.0 : 0.0 }
          : undefined;
        // iter 31 — pass token usage + modelId so the recorder can compute
        // USD spend at write time. Consumers (`router decisions`, cost-
        // savings reports) get cost without their own price table.
        recordTrajectoryOutcome({
          task: input.prompt,
          quality: outcome === 'success' ? 1.0 : 0.0,
```

</details>

#### 缺口

- 没有原型及任务质量实验
  **影响**：不能证明增加收据值得
  **进一步探讨**：与原生任务及人工清单比较误判、人工和成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
