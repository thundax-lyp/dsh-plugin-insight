# Ruflo

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[206e592](https://github.com/ruvnet/ruflo/tree/206e59259a1d620fb320119f19399ca01053658c)

<!-- BEGIN META -->
[![GitHub ★ 80,987](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=80%2C987&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ruvnet/ruflo) [![npm 30d 55,572](https://img.shields.io/static/v1?label=npm+30d&message=55%2C572&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow)
<!-- END META -->

> **功能**：独立CLI/MCP协调工具，登记角色和任务、路由模型请求并集中记录状态与策略。

> **亮点**：[Q02](#research-q02)统一角色配置/调用/结果和完成新快照重读；[Q04](#research-q04)中央policy/envelope/可选caller验证接线。

> **主要限制**：[Q03](#research-q03)complete/terminate是状态，API success非任务质量；[Q04](#research-q04)mode与caller开关决定实际防线，schema广告非授权；[Q05](#research-q05)净收益/退出仍未知。

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
  - [Q01 · 根Ruflo到底交付什么，相比原生Agent任务有何采用理由？](#detail-section-11)
  - [Q02 · stdio到登记/模型响应的真实链是什么？](#detail-section-12)
  - [Q03 · 任务完成/Agent终止和学习健康指标分别代表什么？](#detail-section-13)
  - [Q04 · 中央policy和caller身份能提供什么，默认又缺什么？](#detail-section-14)
  - [Q05 · 何时值得用，资源/状态与退出成本怎样估？](#detail-section-15)
  - [Q06 · 比加Agent数量更可证伪的方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：根项目Ruflo当前npm包名claude-flow3.72.1，是独立CLI/MCP协调工具/多包工程，非DSH原生插件。它面向确需跨会话登记角色、配置模型、分配任务/归档和治理调用的开发者，基线是原生Task/Todo和直接模型API。成功须任务产物合格、协调责任清楚且费用可核，不是Agent登记数/状态completed/模型API成功。

原生Task/Todo、直接模型API和人工协调清单，现成模型/协议能力已有。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| Agent登记 | 角色/模型配置 | registered非已跑worker |
| execute | 一次provider文本响应 | 非代码工具执行循环 |
| task状态 | 完成/取消记录 | 非独立验收/停机 |
| policy | 中央授权 | mode/caller需核 |
| 学习健康 | API结果反馈 | 非gold任务正确率 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| Node>=20/匹配dist | CLI必需 | 根代理v3/registry | 源码非成品验证 |
| provider/Key/网络/额度 | 模型调用必需 | 真文本响应 | 非代码Agent闭环证明 |
| 私有stdio/policy/身份配置 | 采用前提 | 约束调用 | 默认mode/auth不等enforce |
| 项目store/可选native嵌入依赖 | 按路径 | 状态/记忆 | 多store/成本另核 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 比较 | 先Task/Todo/直接API | 确有持续协调需要 |
| 隔离 | 私有stdio/副本/mode/keys | schema非权限 |
| 小试 | 登记一角色/请求一次 | registered非运行者 |
| 验收 | 分读状态/响应/进程/产物 | API健康非任务质量 |
| 退出 | 核真执行路径再清状态/分支 | terminate不撤HTTP |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 构建/native/模型未知 | 配dist/policy/keys | 安装可用未验 |
| 持续 | provider/fallback/嵌入/磁盘未知 | 分配/复核/合并 | 单次限制非总费用 |
| 故障 | 远端继续/状态重试未知 | 查产物/HTTP/工作者 | 多store非统一事务 |
| 退出 | 状态/记忆/转录留存未知 | 停实际worker/清凭据 | best-effort清理须核 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 登记/执行 | 真store/模型文本HTTP | 真实worker自治交付 |
| 完成/终止 | 状态持久更新 | 验收/物理停止 |
| 健康/学习 | API成功/延迟弱反馈 | 任务质量/gold效果 |
| policy | 中央mode/envelope/身份 | 实际部署enforce/隔离 |

> **思考**：[Q03](#research-q03)complete/terminate是状态，API success非任务质量；[Q04](#research-q04)mode与caller开关决定实际防线，schema广告非授权；[Q05](#research-q05)净收益/退出仍未知。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)统一角色配置/调用/结果和完成新快照重读；[Q04](#research-q04)中央policy/envelope/可选caller验证接线。

[Q02](#research-q02)中央授权/完成新快照重读有价值；[Q03](#research-q03)状态/远端生命周期与API/任务质量必须分开，[Q04](#research-q04)envelope例外/默认模式不能混同。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)complete/terminate是状态，API success非任务质量；[Q04](#research-q04)mode与caller开关决定实际防线，schema广告非授权；[Q05](#research-q05)净收益/退出仍未知。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)观察；确认需要时私有stdio/隔离副本最小请求，分别核状态/响应/物理worker/独立产物。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代表登记/模型文本调用/状态及中央策略；真实任务/worker/部署未验，观察。

- 已检查：作者 README、包清单、源码路径 README.md、bin/cli.js、package.json、v3/@claude-flow/cli/bin/cli.js、v3/@claude-flow/cli/src/mcp-client.ts、v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts、v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts、v3/@claude-flow/cli/src/mcp-tools/task-tools.ts、v3/@claude-flow/cli/src/services/policy-runtime.ts、v3/@claude-flow/security/src/mcp-caller-identity.ts、v3/@claude-flow/security/src/policy/engine.ts、v3/@claude-flow/security/src/policy/evaluator.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧12findings当前全量重核；核根/v3 stdio registry、agent登记/execute代表Anthropic文本HTTP与fallback/状态回写、task complete/cancel、policy mode/envelope/可选caller身份代表链；未全审6972文件、dist、其它provider/workflow/native worker、全密钥/anchor/HTTP与安全配置。
- 下一步：只读固定源码，不运行CLI/MCP/dist/模型/嵌入/worker/测试；无任务效果/物理退出/部署身份或经济效益独立验证。

**分析版本**

- **仓库**：[ruvnet/ruflo](https://github.com/ruvnet/ruflo)
- **版本号**：3.72.1（[固定提交 206e592](https://github.com/ruvnet/ruflo/tree/206e59259a1d620fb320119f19399ca01053658c)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)登记/响应/停止/独立验收四收据，先与人工清单/小修对照，不算当前gold学习或生命周期事务。

只读固定源码，不运行CLI/MCP/dist/模型/嵌入/worker/测试；无任务效果/物理退出/部署身份或经济效益独立验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2254 | 483419 | — | — | 2139049 |
| .cjs | source | 32 | 12720 | 8896 | 3121 | — |
| .mjs | source | 395 | 74047 | 53195 | 14980 | — |
| .js | source | 73 | 24791 | 19582 | 3953 | — |
| .ts | source | 2331 | 660125 | 467426 | 118157 | — |
| .mjs | test | 110 | 11588 | 9699 | 1109 | — |
| .ts | test | 1559 | 323577 | 253319 | 24342 | — |
| .mts | source | 6 | 598 | 568 | 25 | — |
| .ts | example | 85 | 19170 | 14333 | 2544 | — |
| .md | example | 23 | 993 | — | — | 3946 |
| .mjs | example | 3 | 68 | 51 | 9 | — |
| .cjs | test | 9 | 983 | 835 | 87 | — |
| .cjs | example | 2 | 23 | 16 | 7 | — |
| .tsx | source | 79 | 14108 | 12916 | 238 | — |
| .js | example | 1 | 2 | 1 | 1 | — |
| .md | test | 10 | 2257 | — | — | 9038 |

</details>

**活跃度**

[![Issue 未关闭 311](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=311&color=737b86&logo=github)](https://github.com/ruvnet/ruflo/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 275](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=275&color=737b86&logo=github)](https://github.com/ruvnet/ruflo/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 683](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=683&color=737b86&logo=github)](https://github.com/ruvnet/ruflo/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：重核stdio/代表Agent文本执行、任务状态与policy身份，不把登记/API健康当自治交付。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根Ruflo到底交付什么，相比原生Agent任务有何采用理由？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

根项目Ruflo当前npm包名claude-flow3.72.1，是独立CLI/MCP协调工具/多包工程，非DSH原生插件。它面向确需跨会话登记角色、配置模型、分配任务/归档和治理调用的开发者，基线是原生Task/Todo和直接模型API。成功须任务产物合格、协调责任清楚且费用可核，不是Agent登记数/状态completed/模型API成功。

作者宣称swarm/self-learning/分布式/大量角色，不能由本轮代表路径推出所有原生worker/工作流都有效。此研究核stdio registry及agent_spawn/execute、task与中央策略；根CLI代理到v3并加载dist，不把源码存在当已构建发行验收。Node>=20/MIT，实际模型凭据/网络额度、可选嵌入/原生依赖和项目状态写权限另需配置；DSH若调用只是MCP客户端，未验接线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:100-102](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/README.md#L100-L102)

作者Agent/swarm/self-learning总体主张。

```text
> **Agent = Model + Harness.** The model writes; the harness gives it tools, memory, loops, sandboxes, and controls so it can actually work. **Ruflo is the harness** — the execution layer around Claude Code and Codex that adds 100+ specialized agents, coordinated swarms, self-learning memory, federated comms across machines, and enterprise security guardrails. So agents don't just run, they collaborate.

One `npx ruflo init` gives Claude Code a nervous system: agents self-organize into swarms, learn from every task, remember across sessions, and — with federation — securely talk to agents on other machines without leaking data. You keep writing code. Ruflo handles the coordination.
```

**依据 2 · 源码核查**：[package.json:1-15](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/package.json#L1-L15)

根包身份/版本/入口。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "claude-flow",
  "version": "3.72.1",
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

**依据 3 · 源码核查**：[package.json:173-175](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/package.json#L173-L175)

Node范围。

```text
  "engines": {
    "node": ">=20.0.0"
  },
```

**依据 4 · 源码核查**：[package.json:216-216](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/package.json#L216-L216)

MIT声明。

```text
  "license": "MIT",
```

**依据 5 · 源码核查**：[bin/cli.js:1-11](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/bin/cli.js#L1-L11)

根真实代理v3入口。

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

**依据 6 · 源码核查**：[v3/@claude-flow/cli/bin/cli.js:180-190](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/bin/cli.js#L180-L190)

stdio真实加载dist registry与policy。

<details>
<summary>查看原文（11行）</summary>

```text
    process.exitCode = hook ? 0 : 1;
  }
} else if (isMCPMode) {
  // Run MCP server mode
  const { listMCPTools, callMCPTool, hasTool } = await import('../dist/src/mcp-client.js');
  const { isPolicyEnforcementEnabled, loadMcpPolicy, evaluateToolCall } =
    await import('../dist/src/mcp-tools/policy-enforcer.js');
  // ADR-524: shared MCP revision handling (2026-07-28 + legacy initialize).
  const mcpProtocol = await import('../dist/src/mcp-protocol.js');
  const MCP_CAPABILITIES = { tools: { listChanged: true }, resources: {} };

```

</details>

**依据 7 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:526-541](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L526-L541)

登记结果及作者区别三种执行路径。

<details>
<summary>查看原文（16行）</summary>

```text
        modelRoutedBy: routingResult.routedBy,
        ...(routingResult.modelId ? { modelId: routingResult.modelId } : {}),
        // #2962 — mirror the same precedence used for the stored agent
        // record, so the response a caller sees matches what was actually
        // persisted (previously this always reported the router's own
        // pick, silently dropping an explicit config.provider override).
        ...(agent.provider ? { provider: agent.provider } : {}),
        ...(routingResult.openrouterModel ? { openrouterModel: routingResult.openrouterModel } : {}),
        status: 'registered',
        createdAt: agent.createdAt,
        ...(memoryBranch ? { memoryBranch, memoryBase: agent.memoryBase } : {}),
        note: 'Agent registered for coordination. Three execution paths: ' +
          '(1) call agent_execute(agentId, prompt) — direct LLM call via Anthropic Messages API (requires ANTHROPIC_API_KEY); ' +
          '(2) Claude Code Task tool — spawns a real subagent; ' +
          '(3) claude -p — headless background instance.',
      };
```

</details>

#### 缺口

- 构建dist/安装、真实swarm/DSH组合、任务需求和净收益未验。
  **影响**：不能当所有worker自治交付或已安装DSH插件。
  **进一步探讨**：先原生Task/Todo对照；只有稳定跨会话协调需求才测隔离受控stdio代表请求。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · stdio到登记/模型响应的真实链是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

stdio tools/list广告过滤schema，tools/call先hasTool/可选外层policy，再callMCPTool；中央registry再次按工具名分类authorize，只有enforcedOutcome=allowed才handler。agent_spawn实际写agent记录/可选swarm membership和记忆分支，返回status=registered并明确需其它执行路径；登记本身不启动模型工作者。

agent_execute handler传ID/prompt等到executeAgentTask，读记录/角色指令，标busy并累计taskCount，然后调用provider router。所核Anthropic分支真实POST /v1/messages，带凭据/system/user文本/max_tokens和局部AbortController超时，提取content中的text为结果，不携带工具目录/工具执行循环。执行层可按retryable错误和环境fallback预算换模型重试，但不等独立代码产物或完整Agent自治。其它OpenRouter/Ollama分派存在，本研究不推广该分支行为到全部runtime。

成功/失败后重读最新agent store，保createdAt身份/更新，避免旧完成覆盖新注册/terminated，写lastResult/executionHistory并返回usage/文本。API success是响应可用信号，不是任务正确或用户接受。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/bin/cli.js:278-326](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/bin/cli.js#L278-L326)

真实stdio列工具/调用/结果。

<details>
<summary>查看原文（49行）</summary>

```text
      case 'tools/list': {
        const tools = mcpProtocol.sortToolsDeterministically(_filterAdvertisedMcpTools(listMCPTools()));
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
          const result = await callMCPTool(toolName, toolParams, { sessionId, transport: 'stdio', ...mcpProtocol.traceContextFields(protocol) });
          // Failed task outcomes are data; an explicit handler error is a tool failure.
          const isError = result !== null && typeof result === 'object'
            && typeof result.error === 'string' && result.error.trim().length > 0;
          return {
            jsonrpc: '2.0',
            id: message.id,
            result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }], isError },
          };
        } catch (error) {
```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-client.ts:258-286](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-client.ts#L258-L286)

真实registry→policy→handler。

<details>
<summary>查看原文（29行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:452-487](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L452-L487)

真实agent登记/swarm记录。

<details>
<summary>查看原文（36行）</summary>

```text
      const members = Array.isArray(swarm?.agents) ? swarm.agents : [];
      if (swarm && swarm.status !== 'terminated' && !members.includes(agentId)) {
        // Terminated agents stay listed in swarm.agents; they no longer hold a slot.
        const live = members.filter(
          (id) => store.agents[id] && store.agents[id].status !== 'terminated',
        ).length;
        if (live >= swarm.maxAgents) {
          return {
            success: false,
            error: `Swarm ${swarm.swarmId} is full: ${live}/${swarm.maxAgents} agents. Terminate an agent (agent_terminate) or init a swarm with a larger maxAgents.`,
            swarmId: swarm.swarmId,
            agentCount: live,
            maxAgents: swarm.maxAgents,
          };
        }
      }

      store.agents[agentId] = agent;
      saveAgentStore(store);

      if (swarm && swarmTools && swarmStore) {
        try {
          if (!Array.isArray(swarm.agents)) swarm.agents = [];
          // Idempotent — don't duplicate if agent_spawn is retried.
          if (!swarm.agents.includes(agentId)) {
            swarm.agents.push(agentId);
            swarmTools.saveSwarmStore(swarmStore);
          }
        } catch { /* swarm store unwritable — agent still registered globally */ }
      }

      // Record agent in graph database (ADR-087, best-effort)
      try {
        const { addNode } = await import('../ruvector/graph-backend.js');
        await addNode({ id: agentId, type: 'agent', name: agentType });
      } catch { /* graph-node not available */ }
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:584-602](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L584-L602)

execute工具真实调用core。

<details>
<summary>查看原文（19行）</summary>

```text
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

**依据 5 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:623-700](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L623-L700)

真实记录busy/角色配置/调用provider。

<details>
<summary>查看原文（78行）</summary>

```text
export async function executeAgentTask(input: AgentExecuteInput): Promise<AgentExecuteResult> {
  const store = loadAgentStore();
  const agent = store.agents[input.agentId];
  if (!agent) return { success: false, agentId: input.agentId, error: 'Agent not found' };
  if (agent.status === 'terminated') return { success: false, agentId: input.agentId, error: 'Agent has been terminated' };

  // ADR-149 iter 13 — first-call dispatch prefers `agent.modelId` (the
  // cost-optimal pick from the neural backend) over `MODEL_MAP[agent.model]`
  // when present. Before this fix the first attempt always used the tier
  // mapping; only the iter-7 fallback chain used modelId on retry, which
  // meant the cost-optimal pick was wasted unless the first call failed
  // with a 429/5xx.
  //
  // Rules:
  //   - agent.modelId is set AND it's a non-Anthropic slug (e.g.
  //     'inclusionai/ling-2.6-flash', 'openai/gpt-4.1') → dispatch
  //     directly via that id. callAnthropicMessages forwards non-Anthropic
  //     ids through OpenRouter (#2042), so this gets us the cost-optimal
  //     model on attempt 1.
  //   - agent.modelId starts with 'anthropic/' → strip the prefix, use the
  //     bare Anthropic id (e.g. 'anthropic/claude-haiku-4.5' → 'claude-haiku-4.5').
  //   - agent.modelId is unset (no neural backend fired) → fall back to the
  //     legacy tier-mapped MODEL_MAP path. Existing behaviour preserved.
  let firstCallModel: string;
  if (agent.modelId) {
    firstCallModel = agent.modelId.startsWith('anthropic/')
      ? agent.modelId.slice('anthropic/'.length)
      : agent.modelId;
  } else {
    firstCallModel = resolveAnthropicModel(agent.model || 'sonnet');
  }
  // Kept for legacy error-path remediation message + final-result `model` field
  // (returned when the request fully fails with no successful retry).
  const anthropicModel = firstCallModel;
  // The agent registry persists per-agent instructions, including those set
  // through agent_update. Workflow steps do not supply a systemPrompt, so
  // omitting this fallback silently discards the configured agent context.
  const configuredInstructions = typeof agent.config?.instructions === 'string' && agent.config.instructions.trim()
    ? agent.config.instructions
    : undefined;
  const systemPrompt = input.systemPrompt ||
    configuredInstructions ||
    `You are a ${agent.agentType} agent operating as part of a Ruflo swarm. ` +
    `Agent ID: ${input.agentId}. Domain: ${agent.domain ?? 'general'}. ` +
    `Respond directly and stay focused on the task. If you need information you don't have, state that explicitly.`;

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

  // ADR-149 iter 7 — fallback chain on retryable failures (429, 5xx,
  // timeout). When the cost-optimal neural backend picked a specific
  // model id and that model fails for a transient reason, fall back to
  // the next-cheapest candidate that clears the quality bar. Budget is
```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:252-335](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L252-L335)

代表Anthropic HTTP/文本提取/超时结果。

<details>
<summary>查看原文（84行）</summary>

```text
  if (!anthropicKey) {
    return {
      success: false,
      error:
        'No LLM provider configured. Set ANTHROPIC_API_KEY or ANTHROPIC_AUTH_TOKEN (Tier-3), OPENROUTER_API_KEY (#2042), or OLLAMA_API_KEY (Tier-2 — #1725).',
    };
  }
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
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '<unreadable error body>');
      return { success: false, model, error: `Anthropic API error ${res.status}: ${errText.slice(0, 400)}` };
    }
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
      durationMs: Date.now() - startedAt,
    };
  } catch (err) {
    return {
      success: false,
      model,
      error: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - startedAt,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
```

</details>

**依据 7 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:701-744](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L701-L744)

条件fallback模型重试预算。

<details>
<summary>查看原文（44行）</summary>

```text
  // bounded by CLAUDE_FLOW_ROUTER_FALLBACK_MAX_RETRIES (default 1) so
  // upstream outages don't cause retry storms.
  const configuredFallbackBudget = parseInt(process.env.CLAUDE_FLOW_ROUTER_FALLBACK_MAX_RETRIES ?? '1', 10);
  const fallbackBudget = Number.isNaN(configuredFallbackBudget) ? 1 : Math.max(0, configuredFallbackBudget);
  const fallbackHistory: Array<{ modelId: string; error: string }> = [];
  // Keep feedback for each completed attempt before switching model identity.
  const failedAttempts: Array<{ model: ClaudeModel; modelId: string }> = [];
  if (!result.success && agent.modelId && fallbackBudget > 0) {
    const isRetryable = /\b(429|500|502|503|504|timeout|ECONNRESET|ETIMEDOUT)\b/i.test(result.error ?? '');
    if (isRetryable) {
      try {
        const { nextCostOptimalAlternative } = await import('../ruvector/neural-router.js');
        // ADR-149 iter 9 — delegate to the shared task-embedder LRU. The
        // pipeline + cache are shared with agent-tools.ts, so the embedding
        // for this prompt is almost always already cached from the initial
        // routing decision (no extra inference cost in steady state).
        const { embedTaskWithCache } = await import('../ruvector/task-embedder.js');
        const embedding = await embedTaskWithCache(input.prompt);
        if (embedding) {
          const excludeIds: string[] = [agent.modelId];
          for (let attempt = 0; attempt < fallbackBudget && !result.success; attempt++) {
            fallbackHistory.push({ modelId: excludeIds[excludeIds.length - 1], error: result.error ?? '' });
            const alt = await nextCostOptimalAlternative(embedding, excludeIds);
            if (!alt || !alt.modelId) break;
            excludeIds.push(alt.modelId);
            const altResult = await callAnthropicMessages({
              model: alt.modelId,
              prompt: input.prompt,
              systemPrompt,
              maxTokens: input.maxTokens,
              temperature: input.temperature,
              timeoutMs: input.timeoutMs,
            });
            // Record the model that ACTUALLY answered (or errored). On success,
            // update agent.modelId so downstream observers see the retry winner.
            failedAttempts.push({ model: agent.model ?? 'sonnet', modelId: agent.modelId! });
            agent.modelId = alt.modelId;
            agent.model = alt.model;
            result = altResult;
          }
        }
      } catch {
        // Fallback chain is best-effort — preserve the original error result.
      }
```

</details>

**依据 8 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:839-902](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L839-L902)

完成重读/保新状态/结果与usage。

<details>
<summary>查看原文（64行）</summary>

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
  }

  persistCompletion();
  // No-provider-configured error → surface the same actionable message
  // the router built, with a #2042-aware remediation pointer.
  const noProvider = (result.error || '').includes('No LLM provider configured');
  return {
    success: false,
    agentId: input.agentId,
    model: anthropicModel,
    error: result.error || 'agent_execute failed',
    durationMs: result.durationMs ?? Date.now() - startedAt,
    ...(fallbackHistory.length > 0 ? { fallbackHistory } : {}),
    ...(noProvider && {
      remediation:
        'Set one of ANTHROPIC_API_KEY, OPENROUTER_API_KEY (+ optional OPENROUTER_BASE_URL), or OLLAMA_API_KEY. ' +
        'Or set RUFLO_PROVIDER=openrouter|ollama to force a specific provider.',
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 任务完成/Agent终止和学习健康指标分别代表什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

task_complete接受调用者result对象，直接标completed/progress100/时间，再写任务store并释放指派agent；未在此执行验收测试或核独立产物。task_cancel对未结束任务改cancelled/原因并releaseAgents，没有在此给正在执行HTTP传AbortSignal。agent_terminate标terminated/保存并best-effort处理COW memory分支；不是杀进程或中止provider请求。所核execute独立局部计时controller，终止登记不等物理退出，迟到响应仍可能返回/归档。

完成回写的最新记录重读能避免把terminated改回idle，是有用的一致性修补，但多store文件/远端请求不是统一事务。agent store直接writeFileSync，跨进程并发/崩溃需另核，不因进程内activeExecutions Map称跨实例锁。

健康历史和路由/trajectory outcome success按API无error，代码也明确api-success是弱代理，单次execute不产unified diff。选择性全transcript记录为opt-in且含prompt/response，不能当gold验收/隐私免费。指标可帮助网络/服务诊断，不能拿“self-learning”或API健康分当任务质量、持续记忆或实测节时证据。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/task-tools.ts:343-389](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/task-tools.ts#L343-L389)

真实完成只写输入结果/任务状态与释放agent。

<details>
<summary>查看原文（47行）</summary>

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

        // Sync assigned agents back to idle and increment taskCount
        updateAgents(task.assignedTo, (agent) => {
          if (agent.currentTask === taskId) {
            agent.status = 'idle';
            agent.currentTask = null;
          }
          agent.taskCount = ((agent.taskCount as number) || 0) + 1;
        });

        return {
          taskId: task.taskId,
          status: task.status,
          completedAt: task.completedAt,
          result: task.result,
        };
      }

```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/task-tools.ts:613-648](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/task-tools.ts#L613-L648)

真实cancel状态与releaseAgents。

<details>
<summary>查看原文（36行）</summary>

```text
      const vId = validateIdentifier(input.taskId, 'taskId');
      if (!vId.valid) return { success: false, error: vId.error };
      if (input.reason) {
        const v = validateText(input.reason, 'reason');
        if (!v.valid) return { success: false, error: v.error };
      }

      const store = loadTaskStore();
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

        return {
          success: true,
          taskId: task.taskId,
          status: task.status,
          previousStatus,
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:606-660](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L606-L660)

实际terminated与记忆分支best-effort，无进程kill。

<details>
<summary>查看原文（55行）</summary>

```text
    name: 'agent_terminate',
    description: 'Remove a Ruflo-tracked agent from the registry and free its swarm slot. Use when you need to (a) clean up a spawned agent so its cost-tracking row finalizes, (b) reclaim a swarm-topology slot for another agent, or (c) end a stuck agent without restarting the whole swarm. For one-shot Task tool invocations that already self-terminate, this tool is not needed. Pair with agent_list first to confirm the agentId.',
    category: 'agent',
    inputSchema: {
      type: 'object',
      properties: {
        agentId: { type: 'string', description: 'ID of agent to terminate' },
        force: { type: 'boolean', description: 'Force immediate termination' },
        promoteMemory: { type: 'boolean', description: 'When the agent has a per-agent COW memory branch (spawned with memoryBase), promote (merge) its edits into the shared base on terminate. Default false → discard the branch (throw its edits away). No-op when the agent has no branch.' },
      },
      required: ['agentId'],
    },
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
        }

        return {
          success: true,
          agentId,
          terminated: true,
          terminatedAt: new Date().toISOString(),
          ...(memory ? { memory } : {}),
        };
      }

      return {
        success: false,
        agentId,
        error: 'Agent not found',
      };
    },
  },
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:258-264](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L258-L264)

provider仅局部timeout controller。

```text
  }
  const model = input.model || DEFAULT_ANTHROPIC_MODEL;
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs || 60000);
  try {
    const baseUrl = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
```

**依据 5 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:839-875](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L839-L875)

新快照/createdAt重读及终止不复活。

<details>
<summary>查看原文（37行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:81-94](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L81-L94)

真实agent store直接写。

<details>
<summary>查看原文（14行）</summary>

```text
function loadAgentStore(): AgentStore {
  return readRecordStore(getAgentPath(), 'agents', () => ({ agents: {}, version: '3.0.0' }));
}

/** Live canonical registry members, excluding stale or duplicate swarm IDs. */
export function getLiveAgentIds(agentIds: string[]): string[] {
  const { agents } = loadAgentStore();
  return [...new Set(agentIds)].filter(id => agents[id] && agents[id].status !== 'terminated');
}

function saveAgentStore(store: AgentStore): void {
  ensureAgentDir();
  writeFileSync(getAgentPath(), JSON.stringify(store, null, 2), 'utf-8');
}
```

</details>

**依据 7 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:802-836](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L802-L836)

作者明确api-success弱代理/无diff/可选完整transcript。

<details>
<summary>查看原文（35行）</summary>

```text
        });
      } catch { /* never break execution */ }
    }
    // ADR-150 weight-eft capture seam — the ONLY place a run's full outcome is
    // known here: prompt (issue), assistant transcript, model, tier, and a
    // resolved PROXY. Gated behind CLAUDE_FLOW_RUN_TRANSCRIPTS=1 (off by
    // default; PII/retention surface, mirrors the router trajectory recorder).
    // HONESTY: `resolved` here is the WEAKEST proxy — 'api-success' means only
    // that the model returned without an API error, NOT that the output is
    // correct (ruflo has no SWE-bench gold oracle). model_patch is '' because
    // this single-shot execute path produces no unified diff. Both facts are
    // stamped so no downstream weight-eft export mistakes this for gold data.
    if (process.env.CLAUDE_FLOW_RUN_TRANSCRIPTS === '1') {
      try {
        const { recordRunTranscript, tierForModel } = await import('../ruvector/run-transcript-recorder.js');
        const modelId = agent.modelId ?? String(agent.model ?? 'unknown');
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: input.prompt });
        if (result.success && typeof result.output === 'string') {
          messages.push({ role: 'assistant', content: result.output });
        }
        recordRunTranscript({
          task: input.prompt,
          model: modelId,
          tier: tierForModel(modelId),
          resolved: outcome === 'success',
          resolvedSource: 'api-success',
          messages,
          source: 'agent-execute',
          tokens: result.usage ? { input: result.usage.inputTokens, output: result.usage.outputTokens } : undefined,
        });
      } catch { /* never break execution */ }
    }
  } catch {
```

</details>

#### 缺口

- 真实并发/进程取消/崩溃恢复和独立产物质量未验。
  **影响**：不能把状态终止/complete和学习成功当工作者停机/验收。
  **进一步探讨**：在隔离环境中断请求后核HTTP/进程/状态/产物，分别记录四个收据。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 中央policy和caller身份能提供什么，默认又缺什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

中央callMCPTool不是只靠schema过滤：实际authorize后handler。engine默认mode=legacy；evaluator中普通规则的deny/approval在enforce才转enforcedOutcome拒绝，observe只观测，legacy无命中默认允许。但capability envelope越界是显式例外，所有mode都denied，不能笼统说legacy没有防线。enforce的预算还可拒绝缺costUsd/tokens计量的调用，不据token配置推总费用实际可控。

caller auth开关只有CLAUDE_FLOW_MCP_CALLER_AUTH字面true启用，默认信环境principal/legacy-cli；启用后缺/坏token拒绝，实际verifyInvocationToken。worker lifetime wildcard token非每工具一次性票据，分发/公钥来源/本机威胁边界需核，不能把env身份或schema列表当账户/租户认证。

带capability envelope worker从git common dir求authoritative policy root，失败拒绝，避免worktree退独立legacy。此研究只核中央mode/身份/代表预算路径，不全审trust anchor/签名钥匙/HTTP transport/全部worker沙箱与规则配置。采用必须核实际mode、caller开关和密钥/stdio归属，隐藏工具不等禁止直接tools/call。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/src/mcp-client.ts:273-286](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-client.ts#L273-L286)

中央授权失败阻止handler。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/security/src/policy/engine.ts:34-48](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/security/src/policy/engine.ts#L34-L48)

默认legacy。

<details>
<summary>查看原文（15行）</summary>

```text
    this.now = options.now ?? Date.now;
    this.signingKey = options.signingKey;
    this.keyId = options.keyId;
    this.evidenceVerifier = options.evidenceVerifier;
    this.approvalIssuerVerifier = options.approvalIssuerVerifier;
    this.state = {
      version: POLICY_STATE_VERSION,
      mode: options.mode ?? 'legacy',
      rules: [...(options.rules ?? [])],
      budgets: [...(options.budgets ?? [])],
      usage: [...(options.usage ?? [])],
      approvals: [...(options.approvals ?? [])],
      receipts: [...(options.receipts ?? [])],
    };
  }
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/security/src/policy/evaluator.ts:62-86](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/security/src/policy/evaluator.ts#L62-L86)

envelope跨mode强拒。

<details>
<summary>查看原文（25行）</summary>

```text
export function evaluatePolicy(
  request: PolicyRequest,
  rules: readonly PolicyRule[],
  mode: PolicyMode,
  verifiedEvidenceIds: readonly string[] = [],
): Omit<PolicyDecision, 'receiptId'> {
  const requestId = request.requestId ?? crypto.randomUUID();
  const envelope = checkCapabilityEnvelope(
    request.action,
    request.context?.envelope,
    request.context?.now,
  );
  if (!envelope.allowed) {
    return {
      requestId,
      outcome: 'denied',
      // A capability envelope is delegated authority, not an observation-mode
      // rule. Crossing it is always blocked, including legacy installations.
      enforcedOutcome: 'denied',
      mode,
      reason: envelope.reason ?? 'capability-envelope-denied',
      matchedRules: [],
      obligations: [],
    };
  }
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/security/src/policy/evaluator.ts:102-130](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/security/src/policy/evaluator.ts#L102-L130)

普通规则/default及enforce区分。

<details>
<summary>查看原文（29行）</summary>

```text
  const approval = matched.find((rule) => rule.effect === 'require_approval');
  const allow = matched.find((rule) => rule.effect === 'allow');

  let outcome: PolicyDecision['outcome'];
  let reason: string;
  if (deny) {
    outcome = 'denied';
    reason = `denied-by:${deny.id}`;
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
  };
}
```

</details>

**依据 5 · 源码核查**：[v3/@claude-flow/security/src/policy/engine.ts:281-297](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/security/src/policy/engine.ts#L281-L297)

真实预算/缺计量在enforce拒。

<details>
<summary>查看原文（17行）</summary>

```text
      }
      if (limit.maxCostUsd !== undefined && usage.costUsd + (request.action.costUsd ?? 0) > limit.maxCostUsd) {
        return { ...decision, outcome: 'denied', enforcedOutcome: this.state.mode === 'enforce' ? 'denied' : 'allowed', reason: `budget-exceeded:${limit.id}` };
      }
      if (limit.maxCostUsd !== undefined && request.action.costUsd === undefined) {
        return { ...decision, outcome: 'denied', enforcedOutcome: this.state.mode === 'enforce' ? 'denied' : 'allowed', reason: `budget-metering-required:${limit.id}:costUsd` };
      }
      if (limit.maxTokens !== undefined && request.action.tokens === undefined) {
        return { ...decision, outcome: 'denied', enforcedOutcome: this.state.mode === 'enforce' ? 'denied' : 'allowed', reason: `budget-metering-required:${limit.id}:tokens` };
      }
      if (limit.maxTokens !== undefined && usage.tokens + (request.action.tokens ?? 0) > limit.maxTokens) {
        return { ...decision, outcome: 'denied', enforcedOutcome: this.state.mode === 'enforce' ? 'denied' : 'allowed', reason: `budget-exceeded:${limit.id}` };
      }
    }
    return decision;
  }

```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/security/src/mcp-caller-identity.ts:152-158](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/security/src/mcp-caller-identity.ts#L152-L158)

真实开关只literal true。

```text
const CALLER_AUTH_ENV = 'CLAUDE_FLOW_MCP_CALLER_AUTH';

/** Off by default — see the file header re: key distribution being out of scope pending a follow-on ADR. Only the literal `'true'` enables enforcement. */
export function isMcpCallerAuthEnabled(): boolean {
  return process.env[CALLER_AUTH_ENV] === 'true';
}

```

**依据 7 · 源码核查**：[v3/@claude-flow/cli/src/services/policy-runtime.ts:823-856](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/services/policy-runtime.ts#L823-L856)

默认env身份与启用后真实验证。

<details>
<summary>查看原文（34行）</summary>

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

  const token = decodeTokenEnvelope(encodedToken);
  if (!token) {
    throw new Error('mcp-caller-auth-enabled-but-no-token');
  }

  let publicKey;
  try {
    publicKey = publicKeyFromHex(publicKeyHex);
  } catch {
    throw new Error('mcp-caller-auth-enabled-but-no-token');
  }

  const result = verifyInvocationToken(token, publicKey, {});
  if (!result.valid) {
    throw new Error(`mcp-caller-auth-verification-failed:${result.reason}`);
  }

  return { id: token.callerId, type: 'agent' };
}

```

</details>

**依据 8 · 作者声明**：[v3/@claude-flow/cli/src/services/policy-runtime.ts:811-821](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/services/policy-runtime.ts#L811-L821)

作者wildcard/lifetime与非单调用边界。

<details>
<summary>查看原文（11行）</summary>

```text
 * Scope trade-off (deliberate — see mcp-caller-identity.ts's file header and
 * orchestrator.ts's `workerEnvironment` for the fuller rationale): the token
 * is minted once per worker spawn with a worker-lifetime TTL and a wildcard
 * `toolName: '*'`, not the single-tool, 30s-TTL shape `InvocationToken` was
 * originally designed for — so `opts.toolName` is deliberately not passed to
 * `verifyInvocationToken` here, and the tool-mismatch check is not exercised
 * for this use case. What this retains: a process that never received the
 * signed token cannot forge one, so it cannot impersonate `agent:<workerId>`.
 * What it does NOT retain: a compromised worker process can still use its
 * own valid token for every MCP call for the rest of its lifetime — the
 * token does not limit blast radius to a single call.
```

</details>

**依据 9 · 源码核查**：[v3/@claude-flow/cli/src/services/policy-runtime.ts:872-924](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/services/policy-runtime.ts#L872-L924)

capability worker root准入/身份/属性进policy。

<details>
<summary>查看原文（53行）</summary>

```text
  let projectRoot = typeof context.projectRoot === 'string' ? context.projectRoot : process.cwd();
  let processEnvelope: CapabilityEnvelope | undefined;
  if (process.env.CLAUDE_FLOW_CAPABILITY_ENVELOPE) {
    try {
      const parsed = JSON.parse(process.env.CLAUDE_FLOW_CAPABILITY_ENVELOPE) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('not an object');
      }
      processEnvelope = parsed as CapabilityEnvelope;
    } catch {
      throw new Error('invalid-worker-capability-envelope');
    }
    // Linked git worktrees share one immutable common git directory. Derive
    // the coordinator checkout from that directory so a worker cannot fall
    // back to independent legacy policy state in its isolated worktree.
    try {
      const cwd = realpathSync(process.cwd());
      const common = execFileSync(
        'git',
        ['-C', cwd, 'rev-parse', '--path-format=absolute', '--git-common-dir'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ).trim();
      projectRoot = dirname(realpathSync(common));
    } catch {
      throw new Error('authoritative-worker-policy-root-unavailable');
    }
  }
  return evaluatePolicyRequest({
    identity: resolveMcpCallerIdentity(),
    action: {
      type: attributes.actionType ?? 'mcp.tool.call',
      resource: toolName,
      tool: toolName,
      server: typeof context.serverId === 'string' ? context.serverId : 'ruflo',
      namespace: typeof input.namespace === 'string' ? input.namespace : undefined,
      environment: typeof context.environment === 'string' ? context.environment : undefined,
      costUsd: attributes.costUsd,
      tokens: attributes.tokens,
      concurrency: attributes.concurrency,
      network: attributes.network === true,
      destructive: attributes.destructive === true,
    },
    context: {
      envelope: attributes.envelope ?? processEnvelope,
      approvalIds: Array.isArray(context.approvalIds) ? context.approvalIds.map(String) : undefined,
      evidence: Array.isArray(context.evidence) ? context.evidence as PolicyEvidence[] : undefined,
      metadata: {
        inputDigest: `sha256:${createHash('sha256').update(JSON.stringify(input)).digest('hex')}`,
      },
    },
  }, projectRoot);
}

```

</details>

**依据 10 · 源码核查**：[v3/@claude-flow/cli/bin/cli.js:278-317](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/bin/cli.js#L278-L317)

schema广告过滤与调用另走registry。

<details>
<summary>查看原文（40行）</summary>

```text
      case 'tools/list': {
        const tools = mcpProtocol.sortToolsDeterministically(_filterAdvertisedMcpTools(listMCPTools()));
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
          const result = await callMCPTool(toolName, toolParams, { sessionId, transport: 'stdio', ...mcpProtocol.traceContextFields(protocol) });
```

</details>

#### 缺口

- 部署enforce/keys/调用者认证和全部policy规则未验。
  **影响**：不能把源码有安全引擎当当前部署已隔离或权限全闭环。
  **进一步探讨**：私有stdio测试直接调用隐藏工具、不同mode/envelope/过期token和预算缺计量，核失败回执。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时值得用，资源/状态与退出成本怎样估？

**研究主题**：采用判断、效果与总成本

#### 完整回答

先观察；已有多Agent跨会话配置/分配需求时，才在私有受控stdio和隔离副本登记一角色、发一模型请求，分别读状态/响应/外部工作者/独立产物。只需一次文本或会话内清单时，原生Task/Todo或直接API是更小基线，不为“60+角色/学习”口号额外引入系统。

首次Node/dist/可选native依赖、模型/嵌入及policy/key配置，持续provider token/fallback/嵌入与归档磁盘，人分配/复核/合并，以及故障远端请求/多store重试、退出凭据/状态/可选transcript留存成本均未知，不填0。单次max_tokens/timeout/fallback次数不是总费用硬上限；API接受后timeout/重试可能重复费用，状态terminate不撤远端。

退出先确认具体执行路径、外部进程/请求和文件产物，再清项目store/记忆分支/凭据/日志；分支cleanup best-effort不能当清除成功。模式、身份、状态与真实效果不一致时停新分发，回原生工具/人工清单核对，不盲重试。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:526-541](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L526-L541)

登记与不同执行路径需要分开。

<details>
<summary>查看原文（16行）</summary>

```text
        modelRoutedBy: routingResult.routedBy,
        ...(routingResult.modelId ? { modelId: routingResult.modelId } : {}),
        // #2962 — mirror the same precedence used for the stored agent
        // record, so the response a caller sees matches what was actually
        // persisted (previously this always reported the router's own
        // pick, silently dropping an explicit config.provider override).
        ...(agent.provider ? { provider: agent.provider } : {}),
        ...(routingResult.openrouterModel ? { openrouterModel: routingResult.openrouterModel } : {}),
        status: 'registered',
        createdAt: agent.createdAt,
        ...(memoryBranch ? { memoryBranch, memoryBase: agent.memoryBase } : {}),
        note: 'Agent registered for coordination. Three execution paths: ' +
          '(1) call agent_execute(agentId, prompt) — direct LLM call via Anthropic Messages API (requires ANTHROPIC_API_KEY); ' +
          '(2) Claude Code Task tool — spawns a real subagent; ' +
          '(3) claude -p — headless background instance.',
      };
```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:258-294](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L258-L294)

局部超时/max_tokens和实际付费请求。

<details>
<summary>查看原文（37行）</summary>

```text
  }
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
    });
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:701-744](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L701-L744)

fallback额外调用/预算。

<details>
<summary>查看原文（44行）</summary>

```text
  // bounded by CLAUDE_FLOW_ROUTER_FALLBACK_MAX_RETRIES (default 1) so
  // upstream outages don't cause retry storms.
  const configuredFallbackBudget = parseInt(process.env.CLAUDE_FLOW_ROUTER_FALLBACK_MAX_RETRIES ?? '1', 10);
  const fallbackBudget = Number.isNaN(configuredFallbackBudget) ? 1 : Math.max(0, configuredFallbackBudget);
  const fallbackHistory: Array<{ modelId: string; error: string }> = [];
  // Keep feedback for each completed attempt before switching model identity.
  const failedAttempts: Array<{ model: ClaudeModel; modelId: string }> = [];
  if (!result.success && agent.modelId && fallbackBudget > 0) {
    const isRetryable = /\b(429|500|502|503|504|timeout|ECONNRESET|ETIMEDOUT)\b/i.test(result.error ?? '');
    if (isRetryable) {
      try {
        const { nextCostOptimalAlternative } = await import('../ruvector/neural-router.js');
        // ADR-149 iter 9 — delegate to the shared task-embedder LRU. The
        // pipeline + cache are shared with agent-tools.ts, so the embedding
        // for this prompt is almost always already cached from the initial
        // routing decision (no extra inference cost in steady state).
        const { embedTaskWithCache } = await import('../ruvector/task-embedder.js');
        const embedding = await embedTaskWithCache(input.prompt);
        if (embedding) {
          const excludeIds: string[] = [agent.modelId];
          for (let attempt = 0; attempt < fallbackBudget && !result.success; attempt++) {
            fallbackHistory.push({ modelId: excludeIds[excludeIds.length - 1], error: result.error ?? '' });
            const alt = await nextCostOptimalAlternative(embedding, excludeIds);
            if (!alt || !alt.modelId) break;
            excludeIds.push(alt.modelId);
            const altResult = await callAnthropicMessages({
              model: alt.modelId,
              prompt: input.prompt,
              systemPrompt,
              maxTokens: input.maxTokens,
              temperature: input.temperature,
              timeoutMs: input.timeoutMs,
            });
            // Record the model that ACTUALLY answered (or errored). On success,
            // update agent.modelId so downstream observers see the retry winner.
            failedAttempts.push({ model: agent.model ?? 'sonnet', modelId: agent.modelId! });
            agent.modelId = alt.modelId;
            agent.model = alt.model;
            result = altResult;
          }
        }
      } catch {
        // Fallback chain is best-effort — preserve the original error result.
      }
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:606-660](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L606-L660)

终止/记忆清理best-effort。

<details>
<summary>查看原文（55行）</summary>

```text
    name: 'agent_terminate',
    description: 'Remove a Ruflo-tracked agent from the registry and free its swarm slot. Use when you need to (a) clean up a spawned agent so its cost-tracking row finalizes, (b) reclaim a swarm-topology slot for another agent, or (c) end a stuck agent without restarting the whole swarm. For one-shot Task tool invocations that already self-terminate, this tool is not needed. Pair with agent_list first to confirm the agentId.',
    category: 'agent',
    inputSchema: {
      type: 'object',
      properties: {
        agentId: { type: 'string', description: 'ID of agent to terminate' },
        force: { type: 'boolean', description: 'Force immediate termination' },
        promoteMemory: { type: 'boolean', description: 'When the agent has a per-agent COW memory branch (spawned with memoryBase), promote (merge) its edits into the shared base on terminate. Default false → discard the branch (throw its edits away). No-op when the agent has no branch.' },
      },
      required: ['agentId'],
    },
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
        }

        return {
          success: true,
          agentId,
          terminated: true,
          terminatedAt: new Date().toISOString(),
          ...(memory ? { memory } : {}),
        };
      }

      return {
        success: false,
        agentId,
        error: 'Agent not found',
      };
    },
  },
```

</details>

**依据 5 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:802-836](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L802-L836)

可选transcript留存。

<details>
<summary>查看原文（35行）</summary>

```text
        });
      } catch { /* never break execution */ }
    }
    // ADR-150 weight-eft capture seam — the ONLY place a run's full outcome is
    // known here: prompt (issue), assistant transcript, model, tier, and a
    // resolved PROXY. Gated behind CLAUDE_FLOW_RUN_TRANSCRIPTS=1 (off by
    // default; PII/retention surface, mirrors the router trajectory recorder).
    // HONESTY: `resolved` here is the WEAKEST proxy — 'api-success' means only
    // that the model returned without an API error, NOT that the output is
    // correct (ruflo has no SWE-bench gold oracle). model_patch is '' because
    // this single-shot execute path produces no unified diff. Both facts are
    // stamped so no downstream weight-eft export mistakes this for gold data.
    if (process.env.CLAUDE_FLOW_RUN_TRANSCRIPTS === '1') {
      try {
        const { recordRunTranscript, tierForModel } = await import('../ruvector/run-transcript-recorder.js');
        const modelId = agent.modelId ?? String(agent.model ?? 'unknown');
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: input.prompt });
        if (result.success && typeof result.output === 'string') {
          messages.push({ role: 'assistant', content: result.output });
        }
        recordRunTranscript({
          task: input.prompt,
          model: modelId,
          tier: tierForModel(modelId),
          resolved: outcome === 'success',
          resolvedSource: 'api-success',
          messages,
          source: 'agent-execute',
          tokens: result.usage ? { input: result.usage.inputTokens, output: result.usage.outputTokens } : undefined,
        });
      } catch { /* never break execution */ }
    }
  } catch {
```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:81-94](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L81-L94)

项目store持久写。

<details>
<summary>查看原文（14行）</summary>

```text
function loadAgentStore(): AgentStore {
  return readRecordStore(getAgentPath(), 'agents', () => ({ agents: {}, version: '3.0.0' }));
}

/** Live canonical registry members, excluding stale or duplicate swarm IDs. */
export function getLiveAgentIds(agentIds: string[]): string[] {
  const { agents } = loadAgentStore();
  return [...new Set(agentIds)].filter(id => agents[id] && agents[id].status !== 'terminated');
}

function saveAgentStore(store: AgentStore): void {
  ensureAgentDir();
  writeFileSync(getAgentPath(), JSON.stringify(store, null, 2), 'utf-8');
}
```

</details>

#### 缺口

- 真实模型/嵌入费用、分配/合并人工和退出清理率未知。
  **影响**：无依据声称比原生任务省钱省时或稳定生产。
  **进一步探讨**：同明确小任务对照，计调用/费用/人验/恢复，只有持续净收益再扩大。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 比加Agent数量更可证伪的方向是什么？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

独立假设：把登记、模型响应、工作者实际停止、独立任务验收分为四份可核收据，路由学习只把后者当质量反馈，记录成本和来源，可能减少“状态completed/健康1=任务做对”的误判。当前的执行历史/createdAt重读可作基础，不等已有工作者生命周期事务或gold学习数据，不计当前创新。

先和人工四项清单/原工具小修比较，若已够不新建平台。用状态complete但无产物、HTTP仍跑时terminate、并发新注册、provider错误/重试和观察mode允许等样本，测误验收、重复请求、未停工作者与包含人工在内总成本。若收据不减少错误或维护成本抵消收益则否定。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/task-tools.ts:363-381](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/task-tools.ts#L363-L381)

完成状态由输入结果而非独立验收。

<details>
<summary>查看原文（19行）</summary>

```text
      if (task) {
        if (task.status === 'completed') {
          return { taskId: task.taskId, status: task.status, completedAt: task.completedAt, result: task.result };
        }
        task.status = 'completed';
        task.progress = 100;
        task.completedAt = new Date().toISOString();
        task.result = (input.result as Record<string, unknown>) || {};
        saveTaskStore(store);

        // Sync assigned agents back to idle and increment taskCount
        updateAgents(task.assignedTo, (agent) => {
          if (agent.currentTask === taskId) {
            agent.status = 'idle';
            agent.currentTask = null;
          }
          agent.taskCount = ((agent.taskCount as number) || 0) + 1;
        });

```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:802-836](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L802-L836)

API success弱代理/无diff。

<details>
<summary>查看原文（35行）</summary>

```text
        });
      } catch { /* never break execution */ }
    }
    // ADR-150 weight-eft capture seam — the ONLY place a run's full outcome is
    // known here: prompt (issue), assistant transcript, model, tier, and a
    // resolved PROXY. Gated behind CLAUDE_FLOW_RUN_TRANSCRIPTS=1 (off by
    // default; PII/retention surface, mirrors the router trajectory recorder).
    // HONESTY: `resolved` here is the WEAKEST proxy — 'api-success' means only
    // that the model returned without an API error, NOT that the output is
    // correct (ruflo has no SWE-bench gold oracle). model_patch is '' because
    // this single-shot execute path produces no unified diff. Both facts are
    // stamped so no downstream weight-eft export mistakes this for gold data.
    if (process.env.CLAUDE_FLOW_RUN_TRANSCRIPTS === '1') {
      try {
        const { recordRunTranscript, tierForModel } = await import('../ruvector/run-transcript-recorder.js');
        const modelId = agent.modelId ?? String(agent.model ?? 'unknown');
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: input.prompt });
        if (result.success && typeof result.output === 'string') {
          messages.push({ role: 'assistant', content: result.output });
        }
        recordRunTranscript({
          task: input.prompt,
          model: modelId,
          tier: tierForModel(modelId),
          resolved: outcome === 'success',
          resolvedSource: 'api-success',
          messages,
          source: 'agent-execute',
          tokens: result.usage ? { input: result.usage.inputTokens, output: result.usage.outputTokens } : undefined,
        });
      } catch { /* never break execution */ }
    }
  } catch {
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:839-875](https://github.com/ruvnet/ruflo/blob/206e59259a1d620fb320119f19399ca01053658c/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L839-L875)

完成重读为收据身份基础。

<details>
<summary>查看原文（37行）</summary>

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
```

</details>

#### 缺口

- 四收据对任务错误/人审负担改善未验证。
  **影响**：不将方向写成现成自主交付或学习质量。
  **进一步探讨**：固定故障/人工清单对照并设总成本停止阈值。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
