# Open Managed Agents (OpenMA)

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[4ac0881](https://github.com/openma-ai/open-managed-agents/tree/4ac088137c64a39a8922a6e4b63fd421270f5fa6)

<!-- BEGIN META -->
[![GitHub ★ 342](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=342&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openma-ai/open-managed-agents)
<!-- END META -->

> **功能**：自托管 Agent 控制面与执行基础设施，组合会话持久化、模型 harness、工具、沙箱、确认和恢复，提供多种 API 与部署适配。

> **亮点**：会话/执行环境/harness分层，真工具循环、领取续租和可配置确认成为托管执行基础，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：持久租约非外部动作exactly-once；缺省许可可allow、确认/共享sandbox/凭据隔离依配置，API与云合同不同，见 [Q02](#research-q02)。

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
  - [Q01 · 这是自主工具Agent平台还是普通流程，当前入口是什么？](#detail-section-11)
  - [Q02 · 执行恢复、确认和沙箱是否足够保证业务动作可靠？](#detail-section-12)
  - [Q03 · 为什么先观察，如何建立可验收的自托管闭环？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要自行管理Agent会话、执行环境和恢复的团队；使用范围须固定harness/部署/存储合同，见 [Q01](#research-q01)。

直接模型/harness进程或外部托管Agent服务。当前把持久控制与多运行适配放自有infra，仍需模型质量、权限和业务验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 托管执行 | claim/heartbeat/harness | 后端合同与业务状态另验 |
| 模型工具 | sandbox.exec等结果回模型 | 权限/默认allow/真实副作用 |
| 确认 | always_ask→pending暂停 | 配置/恢复/接口分别验 |
| 多适配 | 模型/部署/API | 不等所有组合能力一致 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node24/控制面/DB/blob/实时事件 | 必需 | 会话和任务管理 | 必须满足存储/事务合同 |
| 模型/harness/凭据 | 必需 | 自主推理 | 不同API/模型能力不同 |
| sandbox供应商/镜像/网络 | 工具执行必需 | shell/文件/浏览器 | 生产不允test本地进程偷降级 |
| 权限/认证/租户隔离/运维 | 生产必需 | 许可/密钥/恢复 | 默认allow不等全审批 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 固定组合 | 团队选Node/Pi/DB/sandbox | 不用Any口号代合同 |
| 领取 | worker claim/fence | 失租取消/观察旧worker |
| 循环 | 模型调工具/回结果继续 | 真正任务后置验收 |
| 确认恢复 | pending/历史/外部状态 | 先对账再重试 |
| 退出 | 停执行/调度/sandbox再导出 | 撤凭据与费用源逐项核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 控制面/DB/模型/sandbox未知 | 镜像/认证/合同/权限配置 | 未部署最小组合 |
| 持续使用 | token/运行时/存储/网络未知 | 监控/升级/隔离/值守 | 自托管非自动便宜 |
| 失败恢复 | 重试/外部副作用未知 | 租约/事件/文件/对账 | 无故障恢复实测 |
| 退出 | 活跃执行/调度费用未知 | 停实例/导出/撤密钥 | 停Web不等停所有工作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自主执行 | 默认Pi与真工具循环 | 新任务质量/兼容全覆盖 |
| 恢复 | claim/fence/heartbeat | 外部副作用无重复/遗漏 |
| 控制 | 权限配置/确认暂停 | 全租户隔离/运营净收益 |

> **思考**：持久租约非外部动作exactly-once；缺省许可可allow、确认/共享sandbox/凭据隔离依配置，API与云合同不同，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：会话/执行环境/harness分层，真工具循环、领取续租和可配置确认成为托管执行基础，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

[Q02](#research-q02) claim租约和确认适配的实际接线值得借鉴，默认Pi与legacy区分清楚；不可混淆状态持久/租约与业务幂等。

<a id="detail-section-5"></a>

### 1.4 主要限制

持久租约非外部动作exactly-once；缺省许可可allow、确认/共享sandbox/凭据隔离依配置，API与云合同不同，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察并准备单组合隔离测试任务与模拟外部服务，达到权限/恢复/退出对账再扩大，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定Node/Pi代表循环/工具/租约与许可代码已核；基础设施范围大、未部署/故障/隔离验收，建议观察并准备单组合最小评估。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、apps/agent/src/harness/assembly/adapters/pi.ts、apps/agent/src/harness/builtins.ts、apps/agent/src/harness/pi-loop-tools.ts、apps/agent/src/harness/pi-loop.ts、apps/agent/src/harness/tools.ts、apps/main-node/src/components.ts、apps/main-node/src/sandbox-provider.ts、package.json、packages/control-plane-node/src/lib/node-session-execution-worker.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：四材料身份/revision/作者摘要一致，catalog无旧研究。抽核Node组装/执行worker、core registry、当前Pi循环/assembly/tool adapter、代表bash和许可、生产sandbox选择。未全审所有API/云/ACP/子代理/Vault/数据库实现与租户/镜像供应链，不读真实.env，不部署/运行。
- 下一步：无模型/Host/平台运行或认证/恢复演练；固定一套组合核文件/模拟外部动作、租约失效/DB暂断/确认中断/越权/备份恢复/退出，测完整业务结果与费用。

**分析版本**

- **仓库**：[openma-ai/open-managed-agents](https://github.com/openma-ai/open-managed-agents)
- **版本号**：0.1.0（[固定提交 4ac0881](https://github.com/openma-ai/open-managed-agents/tree/4ac088137c64a39a8922a6e4b63fd421270f5fa6)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

动作ID/许可/后置证据连接租约、事件与检查点，接手先对账，测故障重复/遗漏和总成本，未实现，见 [Q03](#research-q03)。

无模型/Host/平台运行或认证/恢复演练；固定一套组合核文件/模拟外部动作、租约失效/DB暂断/确认中断/越权/备份恢复/退出，测完整业务结果与费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 124 | 31924 | — | — | 236345 |
| .mjs | source | 28 | 4978 | 4260 | 423 | — |
| .ts | source | 1633 | 241394 | 193991 | 32245 | — |
| .ts | test | 849 | 183744 | 165062 | 7362 | — |
| .tsx | source | 128 | 34236 | 29661 | 2540 | — |
| .tsx | test | 42 | 4022 | 3535 | 55 | — |
| .md | test | 3 | 408 | — | — | 2279 |
| .mjs | test | 22 | 3870 | 3531 | 73 | — |
| .ts | example | 12 | 1653 | 1466 | 62 | — |
| .md | example | 1 | 81 | — | — | 437 |

</details>

**活跃度**

[![Issue 未关闭 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=19&color=737b86&logo=github)](https://github.com/openma-ai/open-managed-agents/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=25&color=737b86&logo=github)](https://github.com/openma-ai/open-managed-agents/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/openma-ai/open-managed-agents/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：真正自主工具循环与托管恢复是否形成可审业务执行，租约/权限/沙箱/外部副作用边界如何？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是自主工具Agent平台还是普通流程，当前入口是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

固定open-managed-agents private根包0.1.0是自托管Agent基础设施，不是DSH单插件。Node控制面组装auth/DB/blob/realtime/sandbox适配，平台把session/harness/执行环境分开；Claude/OpenAI兼容API只是不同接口合同，不能由品牌兼容推断等同原托管服务全功能。场景是团队希望在自己的基础设施持久管理可调用工具的Agent，实际需求强度仍待用户验证。

源码存在自主循环而不只是流程列表：core harness登记Pi为默认、AI SDK为legacy，ACP sandbox另有placement/duplex要求。Pi从持久事件转messages，创建Agent带模型、toolAssembly和parallel工具执行，streamSimple调用模型，订阅事件再agent.continue；tool bridge执行工具并把值回给模型。代表bash工具直接sandbox.exec带timeout并截输出。因此有模型—工具—结果继续能力，但不能从单条路径推全部harness/云/供应商等价或任务质量，需固定所用组合。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-4](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/package.json#L2-L4)

根工程版本/描述。

```text
  "name": "open-managed-agents",
  "version": "0.1.0",
  "description": "Self-host AI agents with Claude Managed Agents and OpenAI Agents API support. Sessions, tools, subagents and recovery on your infrastructure.",
```

**依据 2 · 源码核查**：[apps/main-node/src/components.ts:15-28](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/main-node/src/components.ts#L15-L28)

Node控制面实际组件依赖。

<details>
<summary>查看原文（14行）</summary>

```text
import { NodemailerSender } from "@open-managed-agents/email/adapters/nodemailer";
import {
  createNodeSecrets,
  type NodeComponentOverrides,
  type NodeComponents,
} from "@open-managed-agents/control-plane-node";
import type { SandboxFactory } from "@open-managed-agents/sandbox";

import { createBetterAuthComponent } from "./auth/node-auth.js";
import { createFilesBlobs, createMemoryBlobs } from "./blobs.js";
import type { NodeConfig } from "./config.js";
import { openNodeDatabase } from "./database.js";
import { createNodeRealtime } from "./realtime.js";
import { resolveSandboxProviderForEnvironment } from "./sandbox-provider.js";
```

</details>

**依据 3 · 源码核查**：[apps/agent/src/harness/builtins.ts:11-29](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/agent/src/harness/builtins.ts#L11-L29)

Pi默认、legacy与ACP分层。

<details>
<summary>查看原文（19行）</summary>

```text
export function registerCoreHarnesses(): void {
  const existing = getHarnessCatalog();
  const add = (descriptor: HarnessDescriptor, factory: HarnessFactory) => {
    if (!existing.data.some(({ id }) => id === descriptor.id)) registerHarness(descriptor, factory);
  };
  add({
    id: "pi", label: "Pi", description: "Pi agent loop in the control-plane host.",
    execution: { placement: "host" }, capabilities: { runtime_binding: false }, requirements: [],
  }, () => new PiHarness());
  add({
    id: "ai-sdk", label: "AI SDK (legacy)", description: "Legacy AI SDK loop in the control-plane host.",
    execution: { placement: "host" }, capabilities: { runtime_binding: false }, requirements: [],
  }, () => new DefaultHarness());
  add({
    id: "acp-sandbox", label: "ACP Sandbox", description: "ACP agent loop in the session sandbox; requires duplex process support.",
    execution: { placement: "sandbox" }, capabilities: { runtime_binding: false },
    // `a|b`: either path satisfies the requirement (explicit command or pinned registry agent).
    requirements: ["acp.agent.command|acp.agent.registry"],
  }, () => new AcpSandboxHarness());
```

</details>

**依据 4 · 源码核查**：[apps/agent/src/harness/pi-loop.ts:112-118](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/agent/src/harness/pi-loop.ts#L112-L118)

持久事件到模型历史。

```text
  private async runAgentOnce(ctx: HarnessContext): Promise<PiRunOutcome> {
    const modelMessages = await eventsToMessagesAsync(ctx.runtime.history.getEvents(), ctx.fileFetcher);
    const messages = dropTrailingAssistantPiMessages(
      modelMessagesToPi(modelMessages, ctx.pi!.model),
    );
    if (messages.length === 0) {
      throw new ModelError("Pi harness cannot continue without a user message");
```

**依据 5 · 源码核查**：[apps/agent/src/harness/pi-loop.ts:130-168](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/agent/src/harness/pi-loop.ts#L130-L168)

实际Agent/stream/工具/continue闭环。

<details>
<summary>查看原文（39行）</summary>

```text
    const toolAssembly = createPiToolAssembly(ctx);
    const bootstrapMessages = toolAssembly.bootstrapTurnMessages.map((message) => ({
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
    }));
    const agent = new Agent({
      initialState: {
        systemPrompt: toolAssembly.systemPrompt,
        model: ctx.pi!.model,
        messages: [...bootstrapMessages, ...messages],
        tools: toolAssembly.initialTools,
        // The tenant runtime maps effort to the model's supported Pi level.
        thinkingLevel: ctx.pi!.thinkingLevel,
      },
      sessionId: ctx.session_id,
      streamFn: (model, context, options) =>
        ctx.pi!.models.streamSimple(
          model,
          context,
          withPiRuntimeRequestOptions(ctx.pi!, options, context),
        ),
      toolExecution: "parallel",
    });
    toolAssembly.attach(agent);

    const unsubscribe = agent.subscribe(async (event) => {
      const result = await translatePiEvent(event, ctx, state);
      producedOutput ||= result.producedOutput;
      if (result.providerFailure) providerFailure = result.providerFailure;
    });

    const abort = () => agent.abort();
    ctx.runtime.abortSignal?.addEventListener("abort", abort, { once: true });

    try {
      const run = () => agent.continue();
      if (ctx.runtime.keepAliveWhile) await ctx.runtime.keepAliveWhile(run);
      else await run();
```

</details>

**依据 6 · 源码核查**：[apps/agent/src/harness/pi-loop-tools.ts:20-35](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/agent/src/harness/pi-loop-tools.ts#L20-L35)

工具execute与结果回传。

<details>
<summary>查看原文（16行）</summary>

```text
      execute: async (toolCallId, params, signal) => {
        if (!tool.execute) {
          ctx.runtime.pendingConfirmations ??= [];
          ctx.runtime.pendingConfirmations.push(toolCallId);
          return {
            content: [{ type: "text", text: "Tool confirmation required" }],
            details: { openmaPendingConfirmation: true },
            terminate: true,
          };
        }
        const value = await tool.execute(params, {
          toolCallId,
          messages: [],
          abortSignal: signal,
        });
        return { content: valueToPiContent(value), details: value };
```

</details>

**依据 7 · 源码核查**：[apps/agent/src/harness/tools.ts:478-494](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/agent/src/harness/tools.ts#L478-L494)

真实sandbox.exec和timeout。

<details>
<summary>查看原文（17行）</summary>

```text
        command: z.string().describe("The bash command to execute"),
        timeout: z
          .number()
          .optional()
          .describe("Timeout in milliseconds (default 120000, max 600000)"),
      }),
      execute: safe(async ({ command, timeout }) => {
        const timeoutMs = Math.min(timeout || DEFAULT_BASH_TIMEOUT, MAX_BASH_TIMEOUT);

        // Auto-background-on-timeout and the explicit
        // `run_in_background` flag were removed. Foreground bash must use
        // the Sandbox Port's bounded exec primitive directly: providers
        // implement command timeout/cancellation at the process boundary,
        // while startProcess + host polling keeps a long-lived capability
        // open and can outlive the turn when transport/status polling stalls.
        return truncateResult(await sandbox.exec(command, timeoutMs));
      }),
```

</details>

**依据 8 · 作者声明**：[README.zh-CN.md:115-120](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/README.zh-CN.md#L115-L120)

作者不同接口/后端/子代理范围。

```text
## 支持范围

- **API 覆盖：** Claude Managed Agents 和 OpenAI Agents API 各有合同，都使用 OpenMA 原生基础设施。OpenAI 适配器的限制不代表整个平台的能力范围。参见 [API 示例与兼容范围](#api-与兼容范围)。
- **子任务委派：** Node 的 OpenAI 路径支持创建、发消息、等待、中断、关闭和恢复子代理；子代理有独立历史并共享沙箱。执行基线为单层委派，托管 Cloudflare 覆盖不同。参见[兼容性报告](docs/openai-agents-compatibility-status.md)。
- **凭证：** Model Card 加密存储模型凭证，Vault 网关提供限定范围的私有服务访问。强制凭证隔离取决于供应商和运行时配置，参见[凭证出口要求](apps/docs/src/content/docs/self-host/managed-runtime-host.mdx#credential-egress)。
- **后端扩展：** 新适配器需满足事务、任务领取与重试、条件写入等语义。后台队列、Session 执行领取和 Environment Work 各有合同。参见 [Node 组装](apps/main-node/src/components.ts) 和[架构](docs/v1-architecture.md)。
```

#### 缺口

- 未部署Node或真实模型/工具任务，全部harness和接口兼容未穷核。
  **影响**：只能确认代表自主循环和组装代码，不能承诺部署可用、所有兼容API行为一致或任务质量。
  **进一步探讨**：固定一条Node/Pi/模型/sandbox/存储组合，用测试文件任务核自主执行/结果继续/事件与持久恢复，不先扩全云。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 执行恢复、确认和沙箱是否足够保证业务动作可靠？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

Node worker按容量claim得到workspace/execution与fence，heartbeat renew同fence，明确lost就cancel，临时DB错误在租约到期前报告而非立刻丢执行，续租后原位更新fence。此路径支持有界领取/重入协调，不能直接声称外部shell/API动作恰好执行一次：数据库领取和工具实际副作用不是同一事务，网络/进程中断后需按业务后置状态核。

工具许可是配置驱动，不是全部默认问：getToolPermission逐工具/MCP前缀查再default，缺省always_allow；always_ask剥execute，Pi wrapper把无execute加入pendingConfirmations并terminate，表明有真实暂停。确认恢复全链与并发租户必须另验。Node生产路径拒绝test-only local-subprocess误配置，不等每个sandbox后端都具同强度隔离；README明确凭据强制隔离取决供应商/运行时，子代理可能共享sandbox。模型、MCP、shell、browser与外部服务必须按环境授权和网络范围核，而不是“Any sandbox/cloud”当统一认证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/control-plane-node/src/lib/node-session-execution-worker.ts:215-240](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/packages/control-plane-node/src/lib/node-session-execution-worker.ts#L215-L240)

真实领取/fence/容量和执行监督。

<details>
<summary>查看原文（26行）</summary>

```text
  async #fillCapacity(): Promise<void> {
    while (this.#active.size < this.#maxConcurrent) {
      const claimedAt = this.dependencies.clock.now().toISOString();
      const claimed = await this.dependencies.coordinator.claim({
        ownerId: this.dependencies.ownerId,
        attemptId: this.dependencies.ids.nextAttemptId(),
        claimedAt,
        leaseTtlMs: this.#leaseTtlMs,
      });
      if (claimed.type === "empty") return;
      const key = JSON.stringify([
        claimed.execution.workspaceId,
        claimed.execution.id,
      ]);
      const active: ActiveExecution = {
        execution: claimed.execution,
        fence: claimed.fence,
        context: null,
        cancelled: false,
        leaseLost: false,
        promise: Promise.resolve(),
      };
      this.#active.set(key, active);
      const fiber = runSupervised(
        Effect.tryPromise({
          try: () => this.#run(active),
```

</details>

**依据 2 · 源码核查**：[packages/control-plane-node/src/lib/node-session-execution-worker.ts:328-360](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/packages/control-plane-node/src/lib/node-session-execution-worker.ts#L328-L360)

heartbeat/失租取消/更新fence。

<details>
<summary>查看原文（33行）</summary>

```text
  async #heartbeat(active: ActiveExecution): Promise<void> {
    if (active.leaseLost) return;
    let renewed: Awaited<ReturnType<NodeSessionExecutionWorkerDependencies["coordinator"]["renew"]>>;
    try {
      renewed = await withDbBoundary({
        op: "session_execution.heartbeat",
        sessionId: active.execution.sessionId,
        timeoutMs: this.#heartbeatIntervalMs,
      }, () => this.dependencies.coordinator.renew({
        fence: active.fence,
        renewedAt: this.dependencies.clock.now().toISOString(),
        leaseTtlMs: this.#leaseTtlMs,
      }));
    } catch (error) {
      if (this.#leaseDeadlinePassed(active)) {
        await this.#loseLease(active, error);
      } else {
        this.#reportError(error);
      }
      return;
    }
    if (renewed.type === "lost") {
      active.leaseLost = true;
      this.#logLeaseLost(active);
      await this.#cancel(active, "lease_lost");
      return;
    }
    // The runtime driver keeps the fence reference for the whole stream.
    // Refresh that reference in place so output emitted after a heartbeat is
    // committed with the current lease generation/expiry.
    Object.assign(active.fence, renewed.fence);
    if (renewed.interruptRequestedAt !== null) {
      await this.#cancel(active, "interrupt_requested");
```

</details>

**依据 3 · 源码核查**：[packages/control-plane-node/src/lib/node-session-execution-worker.ts:379-389](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/packages/control-plane-node/src/lib/node-session-execution-worker.ts#L379-L389)

临时异常按到期处理。

<details>
<summary>查看原文（11行）</summary>

```text
  async #loseLease(active: ActiveExecution, error: unknown): Promise<void> {
    this.#reportError(error);
    // A thrown renew/heartbeat error is not a confirmed CAS miss. Keep the
    // turn until the lease deadline actually passes.
    if (!this.#leaseDeadlinePassed(active)) return;
    active.leaseLost = true;
    try {
      await this.#cancel(active, "lease_lost");
    } catch (cancelError) {
      this.#reportError(cancelError);
    }
```

</details>

**依据 4 · 源码核查**：[apps/agent/src/harness/tools.ts:285-312](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/agent/src/harness/tools.ts#L285-L312)

许可查找与always_allow默认。

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * Resolve the permission policy for a given tool name from the agent config.
 * Checks per-tool config first, then falls back to default_config, then "always_allow".
 */
export function getToolPermission(agentConfig: AgentConfig, toolName: string): string {
  const mcpPrefix = "mcp__";
  if (toolName.startsWith(mcpPrefix)) {
    for (const toolset of agentConfig.tools) {
      if (toolset.type !== "mcp_toolset") continue;
      const ts = toolset as ToolsetConfig & { mcp_server_name?: string };
      if (!ts.mcp_server_name) continue;
      const serverPrefix = `${mcpPrefix}${ts.mcp_server_name}__`;
      if (!toolName.startsWith(serverPrefix)) continue;
      const remoteToolName = toolName.slice(serverPrefix.length);
      const cfg = ts.configs?.find((candidate) => candidate.name === remoteToolName);
      if (cfg?.permission_policy?.type) return cfg.permission_policy.type;
      return ts.default_config?.permission_policy?.type ?? "always_allow";
    }
    return "always_allow";
  }

  const toolset = agentConfig.tools.find((tool) => tool.type === "agent_toolset_20260401");
  if (toolset) {
    const ts = toolset as ToolsetConfig;
    const cfg = ts.configs?.find((candidate) => candidate.name === toolName);
    if (cfg?.permission_policy?.type) return cfg.permission_policy.type;
    if (ts.default_config?.permission_policy?.type) return ts.default_config.permission_policy.type;
  }
```

</details>

**依据 5 · 源码核查**：[apps/agent/src/harness/tools.ts:1313-1324](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/agent/src/harness/tools.ts#L1313-L1324)

always_ask剥执行。

<details>
<summary>查看原文（12行）</summary>

```text
  // Strip execute from always_ask tools so AI SDK returns them as pending calls
  // requiring user confirmation before execution
  if (options?.enforcePermissions === false) return tools;
  for (const [name, t] of Object.entries(tools)) {
    if (getToolPermission(agentConfig, name) === "always_ask") {
      tools[name] = tool({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        description: (t as any).description,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inputSchema: (t as any).parameters || (t as any).inputSchema,
        // No execute — AI SDK treats this as a pending tool call
      });
```

</details>

**依据 6 · 源码核查**：[apps/agent/src/harness/assembly/adapters/pi.ts:110-120](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/agent/src/harness/assembly/adapters/pi.ts#L110-L120)

当前Pi装配实际调用toolsToPi。

<details>
<summary>查看原文（11行）</summary>

```text
  const deferredHints = createDeferredHintCoordinator(
    toolConfig.deferredHintStrategy ?? (nativeToolLoading ? "claude_code" : "pi"),
  );
  const exposure = createToolExposureStrategy();
  const search = createToolCatalogSearch();
  const skillMounts = skillMountsFromContext(ctx);
  const mountsById = new Map(skillMounts.map((mount) => [mount.skillId, mount]));
  const allTools = toolsToPi(ctx);
  const toolCatalog = buildToolCatalog(allTools);
  const events = ctx.runtime.history.getEvents();
  const loadedTools = restoreLoadedToolNames(events);
```

</details>

**依据 7 · 源码核查**：[apps/agent/src/harness/pi-loop-tools.ts:20-35](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/agent/src/harness/pi-loop-tools.ts#L20-L35)

pending确认终止或真实执行。

<details>
<summary>查看原文（16行）</summary>

```text
      execute: async (toolCallId, params, signal) => {
        if (!tool.execute) {
          ctx.runtime.pendingConfirmations ??= [];
          ctx.runtime.pendingConfirmations.push(toolCallId);
          return {
            content: [{ type: "text", text: "Tool confirmation required" }],
            details: { openmaPendingConfirmation: true },
            terminate: true,
          };
        }
        const value = await tool.execute(params, {
          toolCallId,
          messages: [],
          abortSignal: signal,
        });
        return { content: valueToPiContent(value), details: value };
```

</details>

**依据 8 · 源码核查**：[apps/main-node/src/sandbox-provider.ts:51-77](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/main-node/src/sandbox-provider.ts#L51-L77)

生产拒test本地进程降级。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * Resolve the server composition without weakening the production provider
 * boundary. The local subprocess adapter exists solely for deterministic
 * process-level tests; setting its selector outside NODE_ENV=test fails
 * closed instead of silently running agent commands on the API host.
 */
export function resolveSandboxProviderForEnvironment(
  environment: Readonly<Record<string, string | undefined>>,
): NodeSandboxProviderSelection {
  const testProvider = environment.OPENMA_TEST_SANDBOX_PROVIDER?.trim();
  if (testProvider !== undefined && testProvider.length > 0) {
    if (environment.NODE_ENV !== "test") {
      throw new TypeError(
        "OPENMA_TEST_SANDBOX_PROVIDER is test-only and cannot be used outside NODE_ENV=test",
      );
    }
    if (testProvider !== "local-subprocess") {
      throw new TypeError(
        `OPENMA_TEST_SANDBOX_PROVIDER=${testProvider} not recognized; valid: local-subprocess`,
      );
    }
    return {
      provider: "test-local-subprocess",
      modulePath: "@open-managed-agents/sandbox/adapters/local-subprocess",
    };
  }
  return resolveSandboxProviderModule(environment.SANDBOX_PROVIDER);
```

</details>

**依据 9 · 作者声明**：[README.zh-CN.md:118-120](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/README.zh-CN.md#L118-L120)

作者共享sandbox/凭据和后端合同边界。

```text
- **子任务委派：** Node 的 OpenAI 路径支持创建、发消息、等待、中断、关闭和恢复子代理；子代理有独立历史并共享沙箱。执行基线为单层委派，托管 Cloudflare 覆盖不同。参见[兼容性报告](docs/openai-agents-compatibility-status.md)。
- **凭证：** Model Card 加密存储模型凭证，Vault 网关提供限定范围的私有服务访问。强制凭证隔离取决于供应商和运行时配置，参见[凭证出口要求](apps/docs/src/content/docs/self-host/managed-runtime-host.mdx#credential-egress)。
- **后端扩展：** 新适配器需满足事务、任务领取与重试、条件写入等语义。后台队列、Session 执行领取和 Environment Work 各有合同。参见 [Node 组装](apps/main-node/src/components.ts) 和[架构](docs/v1-architecture.md)。
```

#### 缺口

- 租约/确认重放、租户凭据/文件/网络隔离和外部动作幂等未实测。
  **影响**：不能把持久租约/默认许可或生产后端选择当外部动作exactly-once、全租户强隔离或所有调用已审批。
  **进一步探讨**：故障矩阵核worker崩溃/DB暂断/失租/确认中断，逐条检查旧worker停止、事件与外部状态；不同租户/子代理做越权和共享范围验证。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么先观察，如何建立可验收的自托管闭环？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议自托管Agent平台团队观察并先准备最小隔离评估，而非把全平台菜单一次部署当目标。相对直接现成harness，首次需Node24、控制面/数据库/对象或文件存储、sandbox供应商/镜像、模型和认证/网络/密钥；持续是模型token、sandbox运行、数据库/实时事件/文件/镜像与监控，故障要查领取/历史/文件检查点和外部副作用。迁移、备份、供应商费用、人工值守和节省比例未知，自托管只改变资源归属，不自动更便宜。

退出需停止执行/调度/子代理并确认sandbox/进程已停，再导出session/文件/配置与撤模型/外部服务凭据，不能只停Web控制面。不同Node/Cloudflare/Vercel与API合同要分别验，作者子代理单层/共享sandbox范围不提升为全云递归隔离。当前没有本轮真实工作负载/故障恢复或多租户认证。

方向是以业务动作ID、许可和后置证据串起执行租约/会话事件/沙箱检查点，区分模型完成、工具已发、外部已生效和待对账；租约接手先恢复状态而不是重放不确定动作。选一个可撤销测试文件任务和一个模拟外部服务，与直接harness/当前/动作账本版比较重复或遗漏、故障恢复、权限理解和总成本，无收益则停止。未实现，不拿基础设施规模当生产需求证明。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:36-44](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/package.json#L36-L44)

Node24/monorepo私有工程条件。

```text
  "private": true,
  "type": "module",
  "engines": {
    "node": "24.x"
  },
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
```

**依据 2 · 源码核查**：[apps/main-node/src/components.ts:15-28](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/main-node/src/components.ts#L15-L28)

auth/DB/blob/realtime/sandbox成本分层。

<details>
<summary>查看原文（14行）</summary>

```text
import { NodemailerSender } from "@open-managed-agents/email/adapters/nodemailer";
import {
  createNodeSecrets,
  type NodeComponentOverrides,
  type NodeComponents,
} from "@open-managed-agents/control-plane-node";
import type { SandboxFactory } from "@open-managed-agents/sandbox";

import { createBetterAuthComponent } from "./auth/node-auth.js";
import { createFilesBlobs, createMemoryBlobs } from "./blobs.js";
import type { NodeConfig } from "./config.js";
import { openNodeDatabase } from "./database.js";
import { createNodeRealtime } from "./realtime.js";
import { resolveSandboxProviderForEnvironment } from "./sandbox-provider.js";
```

</details>

**依据 3 · 源码核查**：[packages/control-plane-node/src/lib/node-session-execution-worker.ts:328-360](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/packages/control-plane-node/src/lib/node-session-execution-worker.ts#L328-L360)

恢复检查基础。

<details>
<summary>查看原文（33行）</summary>

```text
  async #heartbeat(active: ActiveExecution): Promise<void> {
    if (active.leaseLost) return;
    let renewed: Awaited<ReturnType<NodeSessionExecutionWorkerDependencies["coordinator"]["renew"]>>;
    try {
      renewed = await withDbBoundary({
        op: "session_execution.heartbeat",
        sessionId: active.execution.sessionId,
        timeoutMs: this.#heartbeatIntervalMs,
      }, () => this.dependencies.coordinator.renew({
        fence: active.fence,
        renewedAt: this.dependencies.clock.now().toISOString(),
        leaseTtlMs: this.#leaseTtlMs,
      }));
    } catch (error) {
      if (this.#leaseDeadlinePassed(active)) {
        await this.#loseLease(active, error);
      } else {
        this.#reportError(error);
      }
      return;
    }
    if (renewed.type === "lost") {
      active.leaseLost = true;
      this.#logLeaseLost(active);
      await this.#cancel(active, "lease_lost");
      return;
    }
    // The runtime driver keeps the fence reference for the whole stream.
    // Refresh that reference in place so output emitted after a heartbeat is
    // committed with the current lease generation/expiry.
    Object.assign(active.fence, renewed.fence);
    if (renewed.interruptRequestedAt !== null) {
      await this.#cancel(active, "interrupt_requested");
```

</details>

**依据 4 · 源码核查**：[apps/agent/src/harness/tools.ts:478-494](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/apps/agent/src/harness/tools.ts#L478-L494)

真实外部sandbox副作用。

<details>
<summary>查看原文（17行）</summary>

```text
        command: z.string().describe("The bash command to execute"),
        timeout: z
          .number()
          .optional()
          .describe("Timeout in milliseconds (default 120000, max 600000)"),
      }),
      execute: safe(async ({ command, timeout }) => {
        const timeoutMs = Math.min(timeout || DEFAULT_BASH_TIMEOUT, MAX_BASH_TIMEOUT);

        // Auto-background-on-timeout and the explicit
        // `run_in_background` flag were removed. Foreground bash must use
        // the Sandbox Port's bounded exec primitive directly: providers
        // implement command timeout/cancellation at the process boundary,
        // while startProcess + host polling keeps a long-lived capability
        // open and can outlive the turn when transport/status polling stalls.
        return truncateResult(await sandbox.exec(command, timeoutMs));
      }),
```

</details>

**依据 5 · 作者声明**：[README.zh-CN.md:118-131](https://github.com/openma-ai/open-managed-agents/blob/4ac088137c64a39a8922a6e4b63fd421270f5fa6/README.zh-CN.md#L118-L131)

作者平台/子代理/不同部署边界。

<details>
<summary>查看原文（14行）</summary>

```text
- **子任务委派：** Node 的 OpenAI 路径支持创建、发消息、等待、中断、关闭和恢复子代理；子代理有独立历史并共享沙箱。执行基线为单层委派，托管 Cloudflare 覆盖不同。参见[兼容性报告](docs/openai-agents-compatibility-status.md)。
- **凭证：** Model Card 加密存储模型凭证，Vault 网关提供限定范围的私有服务访问。强制凭证隔离取决于供应商和运行时配置，参见[凭证出口要求](apps/docs/src/content/docs/self-host/managed-runtime-host.mdx#credential-egress)。
- **后端扩展：** 新适配器需满足事务、任务领取与重试、条件写入等语义。后台队列、Session 执行领取和 Environment Work 各有合同。参见 [Node 组装](apps/main-node/src/components.ts) 和[架构](docs/v1-architecture.md)。

<a id="两种运行方式"></a>

## 自部署

| 部署方式 | 入口 | 说明 |
| --- | --- | --- |
| **原生 Node.js / Docker** | [快速开始](#quick-start-docker) · [Node 指南](https://docs.openma.ai/self-host/node-docker/) | 配置隔离执行环境与持久化存储 |
| **Fly.io** | [Fly 指南](apps/docs/src/content/docs/self-host/fly.mdx) | Node 控制面，使用固定版本的服务镜像 |
| **Vercel（Beta）** | [配置器](https://openma.ai/deploy/) · [适配器](apps/main-vercel/) | 单独配置数据库、对象存储和沙箱，受 serverless 运行边界约束 |
| **Cloudflare** | [配置向导](#快速开始cloudflare-部署) | 在你的账号中创建资源 |
```

</details>

#### 缺口

- 没有实际负载、恢复/隔离演练与总成本/用户收益对照。
  **影响**：无法判断平台迁移/值守是否抵消托管控制收益，也不能承诺停控制面后所有执行与费用都停止。
  **进一步探讨**：单组合隔离环境做最小文件任务与模拟外部状态，含重复领取、取消/确认、备份恢复和退出对账，再谈平台扩展。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
