# DeepSeek Harness ACP

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[06a7035](https://github.com/openma-ai/deepseek-harness-acp/tree/06a70350d49fa7044c451d48380f5db0603083bd)

<!-- BEGIN META -->
[![GitHub ★ 61](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=61&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/openma-ai/deepseek-harness-acp) [![npm 30d 8,391](https://img.shields.io/static/v1?label=npm+30d&message=8%2C391&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openma/deepseek-harness-acp) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@openma/deepseek-harness-acp)
<!-- END META -->

> **功能**：把 DSH Agent、会话和工具事件接入 ACP 编辑器，提供独立启动器与原生插件入口。

> **亮点**：实际增量是 DSH 会话及事件语义到 ACP 的双入口适配，含多根写范围与审批桥接；自主循环和模型能力继承宿主。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：会话始终允许会关闭该会话后续审批，MCP 挂载却按进程共享并可同名替换；多会话不能直接当隔离域，取消不撤销副作用。见 [Q02](#research-q02)。

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
  - [Q01 · ACP 编辑器怎样实际驱动 DSH，新增的是协议接入还是另一套 Agent？](#detail-section-11)
  - [Q02 · 权限、取消和 MCP 生命周期是否保持编辑器用户预期的会话边界？](#detail-section-12)
  - [Q03 · 多根目录、宿主及凭据依赖增加了什么能力与维护负担？](#detail-section-13)
  - [Q04 · 什么边界内值得试用，进一步值得验证什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 ACP 编辑器中直接使用 DSH 的 Agent 和工具，减少向独立客户端搬运任务。见 [Q01](#research-q01)。

原办法是编辑器与 DSH 客户端复制任务，或采用编辑器已有 ACP Agent；未做其他 Agent 的效果对比。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| ACP 会话 | 编辑器驱动 DSH Agent | 兼容客户端和运行时 |
| 工具事件投影 | 追踪调用、结果和终止 | 执行能力继承宿主 |
| 权限桥接 | 从编辑器批准工具 | 始终允许改变整个会话策略 |
| 多根工作区 | 扩展文件与沙箱写范围 | 客户端目录需可信 |
| MCP 接入 | 扩展外部工具 | 进程共享，同名配置可能替换 |
| 双入口 | 原生插件或独立启动 | 运行环境选择不同 |

**流程与依赖**

| 依赖 | 作用 | 必要性 | 条件与边界 |
|---|---|---|---|
| ACP 编辑器 | 协议 UI | 必需 | 客户端能力决定可呈现事件 |
| DSH 运行时 | Agent、模型、工具 | 必需 | 原生宿主或独立打包运行时 |
| Node / 凭据 | 启动及模型访问 | 必需 | Node >=22.15；未执行认证 |
| MCP 服务 | 扩展工具 | 可选 | 进程共享、同名可替换 |


| 阶段 | 操作 | 可见结果与边界 |
|---|---|---|
| 首次 | 配置启动器/原生插件及根目录 | 记录有效运行时与权限 |
| 正常 | 建会话后提交任务 | 真实 Agent 事件和工具结果回传 |
| 运行中 | 补充消息或审批 | steer；始终允许改变会话策略 |
| 异常 | 取消、核查修改并停进程 | 取消非回滚，MCP 未随会话删除 |

**效果与成本**

| 阶段 | 现金 | 人工 | 未知及控制 |
|---|---|---|---|
| 首次 | 未测 | 编辑器、运行时、凭据配置 | 一次性工作区核验 |
| 持续 | 模型及外部工具费用未测 | 版本维护和审核 | 不推算节省 |
| 失败恢复 | 重试调用未测 | 核查日志与真实副作用 | 不盲目重发 |
| 退出 | 无独立测算 | 停进程、保留或清理日志配置 | 会话关闭不清 MCP |


| 结果 | 源码支持 | 尚未确认 |
|---|---|---|
| 编辑器驱动 | 真实 Agent followup/steer | 具体编辑器完整体验 |
| 工具可追踪 | 调用、结果和终止投影 | 执行成功及语义正确 |
| 多根操作 | 文件与沙箱范围接线 | 各平台实际约束 |
| 效率 | 减少搬运的机制 | 时间、正确率、全部成本 |

> **思考**：会话始终允许会关闭该会话后续审批，MCP 挂载却按进程共享并可同名替换；多会话不能直接当隔离域，取消不撤销副作用。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：实际增量是 DSH 会话及事件语义到 ACP 的双入口适配，含多根写范围与审批桥接；自主循环和模型能力继承宿主。见 [Q01](#research-q01)、[Q03](#research-q03)。

传输无关服务、原生/独立入口及目录真实约束可借鉴；共享 MCP 和会话审批策略必须向使用者讲清。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

会话始终允许会关闭该会话后续审批，MCP 挂载却按进程共享并可同名替换；多会话不能直接当隔离域，取消不撤销副作用。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在一次性工作区逐次审批，先读后做可恢复修改，核对实际宿主、目录及 MCP；异常停进程检查副作用。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已完成固定源码核查，尚未验证编辑器与真实任务。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/bin.ts、src/bridge/index.ts、src/bridge/prompt.ts、src/bridge/translate.ts、src/harness.ts、src/multi-root/fs.ts、src/multi-root/roots.ts、src/multi-root/sandbox.ts、src/plugin.ts、src/server.ts、src/stdio.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查启动、原生服务、会话提交、事件投影、审批取消、MCP 生命周期与多根文件/沙箱接线。未全审认证 UI、所有协议扩展、历史日志迁移、全部附件类型和跨平台兼容；未安装或运行目标。
- 下一步：以已知仓库任务检查实际宿主、工具结果、读写范围、取消后副作用和同名 MCP 变化，再记录正确率、时间及总费用；回执假设另做对照，均未执行。

**分析版本**

- **仓库**：[openma-ai/deepseek-harness-acp](https://github.com/openma-ai/deepseek-harness-acp)
- **版本号**：0.4.40（[固定提交 06a7035](https://github.com/openma-ai/deepseek-harness-acp/tree/06a70350d49fa7044c451d48380f5db0603083bd)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

给每会话提供有效宿主、模型、写根、审批和 MCP 指纹回执，验证能否减少环境误判；现有 UI 若已同等明确则推翻。见 [Q04](#research-q04)。

以已知仓库任务检查实际宿主、工具结果、读写范围、取消后副作用和同名 MCP 变化，再记录正确率、时间及总费用；回执假设另做对照，均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 1448 | — | — | 12425 |
| .mjs | source | 8 | 1125 | 992 | 70 | — |
| .ts | source | 44 | 10127 | 7831 | 1596 | — |
| .ts | test | 39 | 9393 | 8477 | 225 | — |
| .mjs | test | 2 | 633 | 556 | 18 | — |
| .js | test | 1 | 80 | 79 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/openma-ai/deepseek-harness-acp/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/openma-ai/deepseek-harness-acp/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/openma-ai/deepseek-harness-acp/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：厘清协议接入的真实增量、会话权限边界与可试用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · ACP 编辑器怎样实际驱动 DSH，新增的是协议接入还是另一套 Agent？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向希望在 ACP 编辑器里使用 DSH 会话、模型和工具的开发者。原办法是在编辑器与 DSH 客户端之间复制任务和结果；这里把编辑器请求接入真实 DSH Agent，再把日志投影回协议事件，合格结果应包含可追踪的工具结果和终止状态，而不仅是文本聊天。

这是双入口组件：原生插件向宿主注册 acpServer 服务并接入 stdio；独立 dsh-acp 启动器解析指定宿主或打包运行时，再重定向 @deepseek-ai 模块。默认实际源码只选择 vendored runtime，显式路径无效就报错，不悄悄回退。两种方式不能据安装名称混为相同运行环境。

newSession 校验工作目录和额外目录，创建带工作区及 preset 的 Agent 并记录会话作用域。prompt 转换输入后调用 Agent.followup；正在运行的会话改为 steer，而非启动第二套自主循环。Agent 的工具调用、结果、文字、推理及 todo 事件被转换为 ACP 更新，prompt 等待 Agent 空闲再返回 stopReason 与可用的 usage。规划、工具执行和推理能力主要继承 DSH，组件的贡献在请求、会话控制和事件语义适配。

#### 证据与依据

**依据 1 · 源码核查**：[src/server.ts:1-34](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/server.ts#L1-L34)

传输无关服务组合真实 harness。

<details>
<summary>查看原文（34行）</summary>

```text
/** Reusable ACP server provider: one Host composition, many owned transports. */

import type { Context } from "@deepseek-ai/cordis";
import type { Stream } from "@agentclientprotocol/sdk/unstable";

import * as bridge from "./bridge/index.ts";
import { selfHarness } from "./bridge/self-harness.ts";
import type { AcpBridgeConfig } from "./bridge/index.ts";

export const name = "acp-server";
export const inject = bridge.inject;

export type Config = Omit<AcpBridgeConfig, "harness" | "stream">;

export interface AcpServer {
    connect(stream: Stream): unknown;
}

export function apply(ctx: Context, config: Config = {}): void {
    if (ctx.get("acpServer") !== undefined) return;
    const harness = selfHarness();
    const server: AcpServer = {
        connect(stream) {
            return ctx.plugin(bridge, { ...config, stream, harness });
        },
    };
    ctx.provide("acpServer", server);
}

declare module "@deepseek-ai/cordis" {
    interface Context {
        acpServer: AcpServer;
    }
}
```

</details>

**依据 2 · 源码核查**：[src/stdio.ts:1-14](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/stdio.ts#L1-L14)

stdio 接入服务。

<details>
<summary>查看原文（14行）</summary>

```text
/** Standard ACP profile transport: bind the embedded Host plugin to stdio. */

import type { Context } from "@deepseek-ai/cordis";

import { nodeAcpStream } from "./bundle.ts";
import type { AcpServer } from "./server.ts";

export const name = "acp-stdio";
export const inject = ["acpServer"];

export function apply(ctx: Context): unknown {
    const server = ctx.get("acpServer") as AcpServer;
    return server.connect(nodeAcpStream(process.stdin, process.stdout));
}
```

</details>

**依据 3 · 源码核查**：[src/harness.ts:177-204](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/harness.ts#L177-L204)

宿主解析的显式选择与默认打包运行时。

<details>
<summary>查看原文（28行）</summary>

```text
 * Resolve the single DeepSeek Harness installation this process uses.
 *
 * An explicit selection is validated and compatibility-checked; with no
 * selection (or the literal {@link BUNDLED_HOST}) the packaged runtime is
 * the only host — ambient installs are never consulted.
 *
 * @throws HarnessNotFoundError when the selection names nothing usable.
 * @throws HarnessCompatibilityError when it names an install below the floor;
 *         one newer than any tested dsh is used with a warning.
 */
export function resolveHost(explicit?: string): HarnessHost {
    if (explicit !== undefined && explicit !== BUNDLED_HOST) {
        const host = hostFromExplicit(explicit);
        if (host !== undefined) {
            if (!dshVersionSupported(host.dshVersion)) throw new HarnessCompatibilityError(host, supportedDshRange());
            if (dshVersionUntested(host.dshVersion)) logWarn(untestedMessage(host.dshVersion ?? "unknown version", host.source));
            return host;
        }
        // An explicit path that does not resolve is an error, not a fallback:
        // silently using another installation would be worse than failing.
        throw new HarnessNotFoundError([`--dsh-path/DSH_PATH: ${explicit}`], explicit);
    }
    const vendored = resolveVendoredRuntime();
    const host = vendored === undefined ? undefined : hostAt(vendored, "bundled standalone runtime");
    if (host === undefined) throw new HarnessNotFoundError(["bundled standalone runtime"]);
    if (!dshVersionSupported(host.dshVersion)) throw new HarnessCompatibilityError(host, supportedDshRange());
    return host;
}
```

</details>

**依据 4 · 源码核查**：[src/bridge/index.ts:2681-2725](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/bridge/index.ts#L2681-L2725)

创建 Agent 并登记目录作用域。

<details>
<summary>查看原文（45行）</summary>

```text
            async newSession(params: NewSessionRequest): Promise<NewSessionResponse> {
                assertOpen();
                const started = performance.now();
                let checkpoint = started;
                const mark = (name: string): void => {
                    const now = performance.now();
                    logDebug(`session/new ${name}: ${(now - checkpoint).toFixed(1)}ms (+${(now - started).toFixed(1)}ms)`);
                    checkpoint = now;
                };
                await requireCredential(config.provider);
                mark("credential");
                validateCwd(params.cwd);
                const additionalDirectories = validateAdditionalDirectories(
                    params.additionalDirectories,
                    params.cwd,
                );
                syncMcpServers(params.mcpServers, params.cwd);
                mark("request setup");
                const sessionId = SessionId(randomUUID());
                const presets = presetsService();
                const presetId = (await presets.resolve(undefined)).id;
                mark("preset resolve");
                const handle = await agents.create({
                    sessionId,
                    meta: { cwd: params.cwd, ...(presetId !== undefined ? { agentPreset: presetId } : {}) },
                    agentOptions: agentOptionsFor(config.model),
                    ...(presetSetup(presets, presetId) !== undefined
                        ? { setup: presetSetup(presets, presetId) }
                        : {}),
                } as Parameters<typeof agents.create>[0]);
                mark("agent create");
                if (closed) {
                    await handle.dispose();
                    throw internalError("connection closed during session/new");
                }
                const record = registerRecord(
                    String(sessionId),
                    handle.agent,
                    () => handle.dispose(),
                    config.model,
                    config.permissionMode ?? (permissionService().defaultPreset as SandboxMode),
                );
                if (presetId !== undefined) record.preset = presetId;
                setMultiRootScope(String(sessionId), additionalDirectories);
                persistAdditionalDirectories(handle.agent.session, additionalDirectories);
```

</details>

**依据 5 · 源码核查**：[src/bridge/index.ts:3070-3131](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/bridge/index.ts#L3070-L3131)

提交、steer 竞争处理和等待终止。

<details>
<summary>查看原文（62行）</summary>

```text
                // for the session's current provider route.
                await requireCredential(record.provider ?? config.provider);

                // Never drive a retired agent: an agent-loop reload disposes
                // agents while bridge records survive.
                if (agents.get(record.agent.id) !== record.agent) {
                    throw internalError("prompt was not queued: the agent was disposed outside the bridge");
                }

                record.cancelled = false;
                await reconcileModel(record);
                const message = createUserMessage({
                    content: converted.blocks,
                    source: { kind: "user" },
                });

                // Prompt conversion and credential lookup can yield. A second
                // request may have won the turn slot while this one awaited;
                // re-check immediately before admission so it becomes steer
                // instead of overwriting the active inflight record.
                if (record.inflight !== undefined) {
                    try {
                        deliverPrompt(record.agent, message, true);
                    } catch (error: unknown) {
                        const detail = error instanceof Error ? error.message : String(error);
                        throw internalError(`prompt was not steered: ${detail}`);
                    }
                    return { stopReason: "end_turn" };
                }

                record.projection.beginPrompt();

                const stopReason = await new Promise<StopReason>((resolve, reject) => {
                    const inflight: Inflight = { resolve, reject, messageId: message.id, turn: undefined };
                    record.inflight = inflight;
                    try {
                        deliverPrompt(record.agent, message, false);
                    } catch (error: unknown) {
                        record.inflight = undefined;
                        const detail = error instanceof Error ? error.message : String(error);
                        throw internalError(`prompt was not queued: ${detail}`);
                    }
                    // Settle at whole-agent idle: a correlated turn/end decides
                    // the stop reason; a turnless slot means admission discarded
                    // the prompt (reported as cancelled).
                    void record.agent.whenIdle().then(() => {
                        if (record.inflight !== inflight) return;
                        record.inflight = undefined;
                        if (record.cancelled) {
                            resolve("cancelled");
                            return;
                        }
                        const end =
                            inflight.turn !== undefined
                                ? record.projection.turnEndFor(inflight.turn) ?? record.projection.lastTurnEnd
                                : record.projection.lastTurnEnd;
                        resolve(end === undefined ? "cancelled" : turnEndToStopReason(end));
                    });
                });

                const usage = record.projection.promptUsage();
                return { stopReason, ...(usage !== undefined ? { usage } : {}) };
```

</details>

**依据 6 · 源码核查**：[src/bridge/translate.ts:595-631](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/bridge/translate.ts#L595-L631)

事件映射含工具结果和计划。

<details>
<summary>查看原文（37行）</summary>

```text
            return [];
        }
        if (frame.type === "end") {
            if (attemptId !== undefined) this.streamAttempts.delete(attemptId);
            return [];
        }
        if (frame.type !== "chunk" || attemptId === undefined) return [];
        const located = this.streamAttempts.get(attemptId);
        if (located === undefined) return [];
        return this.onChunk({ turn: located.turn, step: located.step, chunk: frame.chunk });
    }

    /** Project one event before optional subagent attribution is attached. */
    private projectEvent(event: HarnessEvent): SessionUpdate[] {
        const data = event.data ?? {};
        switch (event.type) {
            // Historical logs and older hosts. dsh 0.2 live deltas use
            // `agent/assistant-stream` (see onAssistantStream).
            case "assistant/chunk":
                return this.onChunk(data);
            case "tool-call-chunks":
                return this.onToolCallChunks(data);
            case "assistant/message":
                return this.onAssistantMessage(data);
            case "tool/call":
                return this.onToolCall(data);
            case "tool/result":
                return this.onToolResult(data);
            case "subagent/start":
                return this.onSubagentStart(data);
            case "subagent/end":
                return this.onSubagentEnd(data);
            case "todo/write": {
                const entries = planEntries(data);
                return entries !== undefined ? [{ sessionUpdate: "plan", entries }] : [];
            }
            case "user/message": {
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 权限、取消和 MCP 生命周期是否保持编辑器用户预期的会话边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

必须理解两个超出当前操作的授权范围。approval/request 会向 ACP 客户端提供单次允许、会话始终允许和拒绝选项；选择始终允许会把该会话的审批策略设为 never，不能理解为只记住当前工具的一种参数。这个行为在源码上明确，但是否由具体编辑器完整呈现尚未验证。

MCP 客户端挂载按进程和规范化名称共享，不是每个 ACP 会话独立实例。相同名称且配置一致复用，配置不同会 dispose 原挂载再替换；没有服务时仅警告后忽略，挂载失败也只警告。会话关闭移除自身记录并取消/释放 Agent，却不移除全局挂载。因此同一进程中后建会话能改变旧会话下一轮可见的同名 MCP，不能把多会话称为多租户隔离；这不是已复现的数据泄露结论。

cancel 标记取消、调用 Agent.cancel 并立即结算 cancelled；close 同样取消再 dispose。取消返回并不意味着已执行的文件修改、命令或外部 MCP 副作用已经撤销，底层工具是否及时停止仍取决于宿主。把错误的命令执行后取消当作事务回滚不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/bridge/index.ts:2487-2513](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/bridge/index.ts#L2487-L2513)

会话始终允许实际改变审批策略。

<details>
<summary>查看原文（27行）</summary>

```text
    // Permission requests: one-shot decisions, with an "always for this
    // session" convenience that flips the harness approval policy to 'never'.
    ctx.on("approval/request", (request, next) => {
        const record = ownedRecord(request.agent);
        const child = clientSubagents ? subagentByChild.get(String(request.agent.session.id)) : undefined;
        if ((record === undefined && child?.agent !== request.agent) || request.callId === undefined) return next();
        const sessionId = record !== undefined ? String(record.agent.session.id) : child!.childSessionId;
        return conn
            .request("session/request_permission", {
                sessionId,
                toolCall: { toolCallId: request.callId },
                options: [
                    { optionId: "allow-once", name: "Allow once", kind: "allow_once" },
                    { optionId: "allow-always", name: "Always allow (this session)", kind: "allow_always" },
                    { optionId: "reject-once", name: "Reject", kind: "reject_once" },
                ],
            })
            .then(({ outcome }) => {
                if (outcome.outcome === "cancelled") return "cancelled" as const;
                if (outcome.optionId === "allow-always") {
                    if (record !== undefined) setApprovalPolicy(record, "never");
                    else approval.setPolicy(request.agent, "never");
                    return "allowed-once" as const;
                }
                return outcome.optionId === "allow-once" ? ("allowed-once" as const) : ("rejected" as const);
            });
    });
```

</details>

**依据 2 · 源码核查**：[src/bridge/index.ts:3211-3229](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/bridge/index.ts#L3211-L3229)

关闭与取消的结算顺序。

<details>
<summary>查看原文（19行）</summary>

```text
            async closeSession(params: CloseSessionRequest): Promise<void> {
                const record = sessions.get(params.sessionId);
                if (record === undefined) return;
                sessions.delete(params.sessionId);
                multiRootScope()?.delete(params.sessionId);
                record.agent.cancel({ kind: "user" });
                settlePrompt(record, "cancelled");
                await record.dispose().catch((error: unknown) => {
                    logWarn(`session close failed: ${String(error)}`);
                });
            },

            cancel(params: CancelNotification): Promise<void> {
                const record = sessions.get(params.sessionId);
                if (record === undefined) return Promise.resolve();
                record.cancelled = true;
                record.agent.cancel({ kind: "user" });
                settlePrompt(record, "cancelled");
                return Promise.resolve();
```

</details>

**依据 3 · 源码核查**：[src/bridge/index.ts:3275-3318](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/bridge/index.ts#L3275-L3318)

进程级 MCP 挂载与配置转换。

<details>
<summary>查看原文（44行）</summary>

```text
    /**
     * Live mcp-client mounts by server name. Mounts are process-scoped, not
     * session-scoped: `session/close` disposes the ACP session record but a
     * mount lives until the process exits or a later session re-declares the
     * same name with a different config (the client edited its settings —
     * replace, so new sessions and the next turns of old ones see the new
     * server). Same name + same config is reused across sessions: clients
     * send one configured list to every session, and tool names
     * (`mcp__<name>__…`) stay stable for prompt caching.
     */
    const mcpMounts = new Map<string, { configJson: string; fiber: { dispose(): unknown } }>();
    let warnedNoMcpClient = false;

    /** mcp-client requires `[A-Za-z0-9_-]{1,32}`; ACP names are free-form. */
    const sanitizeServerName = (raw: string): string => {
        const cleaned = raw.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 32);
        return cleaned.length > 0 ? cleaned : "server";
    };

    /** Projects one ACP McpServer onto an mcp-client config, if supported. */
    const mcpConfigFor = (
        server: Record<string, unknown>,
        cwd: string,
        serverName: string,
    ): Record<string, unknown> | undefined => {
        const envList = (list: unknown): Record<string, string> =>
            Object.fromEntries(
                (Array.isArray(list) ? (list as { name: string; value: string }[]) : []).map((e) => [
                    e.name,
                    e.value,
                ]),
            );
        if (typeof server["command"] === "string") {
            return {
                transport: "stdio",
                serverName,
                command: server["command"],
                args: Array.isArray(server["args"]) ? server["args"] : [],
                env: envList(server["env"]),
                cwd: typeof server["cwd"] === "string" ? server["cwd"] : cwd,
                // A dead or misconfigured server must not take the session
                // down; the client surfaces missing tools on its own.
                failOnStartupError: false,
            };
```

</details>

**依据 4 · 源码核查**：[src/bridge/index.ts:3332-3380](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/bridge/index.ts#L3332-L3380)

同名替换、无能力及失败警告。

<details>
<summary>查看原文（49行）</summary>

```text
    /** Mounts/reuses/replaces mcp-client instances for a session's server list. */
    const syncMcpServers = (servers: NewSessionRequest["mcpServers"] | undefined, cwd: string): void => {
        if (servers === undefined || servers.length === 0) return;
        const mcpClient = harness.mcpClient;
        if (mcpClient === undefined) {
            if (!warnedNoMcpClient) {
                warnedNoMcpClient = true;
                logWarn(
                    `ignoring ${servers.length} MCP server(s): this DeepSeek Harness installation lacks @deepseek-ai/dsh-mcp-client`,
                );
            }
            return;
        }
        const taken = new Set<string>();
        for (const entry of servers) {
            const server = entry as unknown as Record<string, unknown>;
            const base = sanitizeServerName(typeof server["name"] === "string" ? server["name"] : "server");
            let serverName = base;
            for (let n = 2; taken.has(serverName); n += 1) serverName = `${base.slice(0, 28)}_${n}`;
            const cfg = mcpConfigFor(server, cwd, serverName);
            if (cfg === undefined) {
                logWarn(`skipping MCP server "${serverName}": unsupported transport`);
                continue;
            }
            const configJson = JSON.stringify(cfg);
            const existing = mcpMounts.get(serverName);
            if (existing !== undefined) {
                if (existing.configJson === configJson) {
                    taken.add(serverName);
                    continue;
                }
                try {
                    void existing.fiber.dispose();
                } catch (error: unknown) {
                    logWarn(`disposing MCP server "${serverName}": ${String(error)}`);
                }
                mcpMounts.delete(serverName);
            }
            try {
                const fiber = (
                    ctx as unknown as { plugin(module: unknown, config: unknown): { dispose(): unknown } }
                ).plugin(mcpClient, cfg);
                mcpMounts.set(serverName, { configJson, fiber });
                taken.add(serverName);
                logDebug(`mounted MCP server "${serverName}" (${String(cfg["transport"])})`);
            } catch (error: unknown) {
                logWarn(`failed to mount MCP server "${serverName}": ${String(error)}`);
            }
        }
```

</details>

#### 缺口

- 尚未运行具体 ACP 客户端及底层工具取消。
  **影响**：不能确认授权文案、取消延迟或外部副作用。
  **进一步探讨**：用一次性目录和无外部副作用工具核对权限和取消时序。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多根目录、宿主及凭据依赖增加了什么能力与维护负担？

**研究主题**：依赖、兼容与流程、效果与总成本、贡献与相对优势

#### 完整回答

多根工作区不只把路径写进提示词：目录校验要求绝对且存在，拒绝 Windows 网络/设备路径及主目录重复；文件写入重新解析目标身份，把当前会话额外目录纳入 workspace-write 的可写根，read-only 仍拒绝，danger 模式仍沿宿主定义。沙箱提供者只在 workspace-write 扩宽已知方言的 confinement 参数，遇未知方言报 SandboxUnavailableError。新增写权限来自客户端提交的目录，用户必须把它当授权输入，而非无害标签。

依赖是兼容 DSH 服务、ACP 客户端、Node、模型凭据及可选 MCP 服务。package 声明 Node >=22.15 与 DSH >=0.1.7-rc.2；原生插件拒绝过旧宿主，对未测试新宿主警告。独立入口固定运行时有利于复现，但还需更新打包依赖及协议 SDK；原生入口复用现有配置但承担宿主版本组合。不能把开发依赖版本或作者测试声明当本次运行验证。

首次成本在编辑器配置、凭据、运行时及目录授权；持续成本在模型 token、MCP/命令执行和兼容维护。恢复时要核查日志、已发生的写入及实际挂载，关闭会话不足以清除进程 MCP；退出应停进程并按所选宿主保留或清理配置/日志。没有真实完成任务数、API费用和人工修复时间，不报告省钱或单位合格结果成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/multi-root/roots.ts:85-165](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/multi-root/roots.ts#L85-L165)

额外目录验证。

<details>
<summary>查看原文（81行）</summary>

```text
 *    Invalid-params error, never resolved against the process cwd);
 *  - on Windows, UNC/device paths are refused lexically;
 *  - the path must exist and be a directory;
 *  - the canonical path must not be the primary root and must not repeat.
 *
 * `primaryRoot` is optional so the bridge can validate before a session cwd is
 * known; session creation always passes it.
 *
 * @param input - the raw ACP field.
 * @param options - primary root and platform override (tests).
 * @returns canonical additional roots, in request order.
 * @throws {RootValidationError} when any entry violates a rule.
 */
export function normalizeAdditionalDirectories(
    input: unknown,
    options: { primaryRoot?: string; platform?: NodeJS.Platform } = {},
): string[] {
    if (input === undefined || input === null) return [];
    if (!Array.isArray(input)) {
        throw new RootValidationError(
            "not-an-array",
            "additionalDirectories must be an array of absolute directory paths",
        );
    }
    const platform = options.platform ?? process.platform;
    const primary = options.primaryRoot === undefined ? undefined : canonicalRoot(options.primaryRoot);
    const seen = new Set<string>();
    const roots: string[] = [];
    for (const raw of input) {
        if (typeof raw !== "string") {
            throw new RootValidationError(
                "not-a-string",
                "additionalDirectories entries must be strings containing absolute directory paths",
            );
        }
        if (raw.trim().length === 0) {
            throw new RootValidationError(
                "not-absolute",
                "additionalDirectories entries must be non-empty absolute directory paths",
            );
        }
        if (!isAbsolute(raw)) {
            throw new RootValidationError(
                "not-absolute",
                `additionalDirectories entry must be an absolute path: ${raw}`,
            );
        }
        if (platform === "win32" && isWindowsNetworkOrDevicePath(raw)) {
            throw new RootValidationError(
                "unsupported-path",
                `additionalDirectories entry is a network or device path, which Windows ACL confinement cannot cover: ${raw}`,
            );
        }
        const canonical = canonicalRoot(raw);
        if (platform === "win32" && isWindowsNetworkOrDevicePath(canonical)) {
            throw new RootValidationError(
                "unsupported-path",
                `additionalDirectories entry resolves to a network or device path, which Windows ACL confinement cannot cover: ${raw}`,
            );
        }
        let stat;
        try {
            stat = statSync(canonical);
        } catch {
            throw new RootValidationError(
                "missing",
                `additionalDirectories entry does not exist: ${raw}`,
            );
        }
        if (!stat.isDirectory()) {
            throw new RootValidationError(
                "not-a-directory",
                `additionalDirectories entry is not a directory: ${raw}`,
            );
        }
        if (primary !== undefined && comparable(canonical, platform) === comparable(primary, platform)) {
            throw new RootValidationError(
                "equals-primary",
                `additionalDirectories entry is already the session workspace root: ${raw}`,
            );
        }
```

</details>

**依据 2 · 源码核查**：[src/multi-root/fs.ts:78-174](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/multi-root/fs.ts#L78-L174)

实际写入与可写根检查。

<details>
<summary>查看原文（97行）</summary>

```text
 * The lexical fast path handles normal canonical spellings; when spellings
 * differ, walk the target's existing ancestors and compare filesystem identity
 * with the root (Windows long-name/8.3 aliases and casing).
 */
async function isPathUnder(
    path: string,
    root: string,
    caseSensitive = process.platform !== "win32",
): Promise<boolean> {
    if (isLexicallyUnder(path, root, caseSensitive)) return true;
    const rootInfo = await statIfPresent(root);
    if (rootInfo === undefined) return false;
    let ancestor = path;
    for (;;) {
        const ancestorInfo = await statIfPresent(ancestor);
        if (ancestorInfo !== undefined && sameIdentity(ancestorInfo, rootInfo)) return true;
        const parent = dirname(ancestor);
        if (parent === ancestor) return false;
        ancestor = parent;
    }
}

export class MultiRootFileSystem extends LocalFileSystem {
    static inject = ["sandboxPolicy", "acpMultiRootScope"];

    private readonly defaultMode: SandboxMode;

    constructor(ctx: Context, config: Config) {
        super(ctx, config);
        this.defaultMode = ctx.sandboxPolicy.defaultMode;
    }

    /** The deployment default mode — the capability fact the tool layer reads. */
    override get sandboxMode(): SandboxMode {
        return this.defaultMode;
    }

    override async writeText(
        target: FsTarget,
        content: string,
        expected?: FsWriteIntent,
        signal?: AbortSignal,
        sandboxPolicy?: SandboxExecutionPolicy,
    ): Promise<FsWriteOutcome> {
        return super.writeText(await this.checkedTarget(target, sandboxPolicy), content, expected, signal);
    }

    override async editText(
        target: FsTarget,
        edit: FsEditRequest,
        expected?: { version: FsVersion },
        signal?: AbortSignal,
        sandboxPolicy?: SandboxExecutionPolicy,
    ): Promise<FsEditOutcome> {
        return super.editText(await this.checkedTarget(target, sandboxPolicy), edit, expected, signal);
    }

    /**
     * Fence one mutation: `read-only` denies; `workspace-write` re-resolves the
     * target now and requires containment under the upstream writable roots or
     * one of this session's additional roots; `danger-full-access` delegates
     * unfenced. With no additional roots this is the upstream fence exactly.
     */
    private async checkedTarget(
        target: FsTarget,
        sandboxPolicy?: SandboxExecutionPolicy,
    ): Promise<FsTarget> {
        const policy = sandboxPolicy ?? this.ctx.sandboxPolicy.resolve();
        const { mode } = policy;
        if (mode === "danger-full-access") return target;
        if (mode === "read-only") {
            throw new FsError(
                `cannot write "${target.displayPath}": file access denied under read-only mode`,
                "FS_SANDBOX_DENIED",
            );
        }
        const fresh = await this.resolve(target.displayPath);
        const roots = writableRoots(policy);
        const scope = this.ctx.get("acpMultiRootScope") as AcpMultiRootScope | undefined;
        if (scope !== undefined) {
            const extra = effectiveAdditionalRoots(
                policy.workspaceRoot,
                scope.get(policy.sessionId === undefined ? undefined : String(policy.sessionId)),
            );
            for (const root of extra) if (!roots.includes(root)) roots.push(root);
        }
        for (const root of roots) {
            if (await isPathUnder(fresh.targetKey, root)) return fresh;
        }
        throw new FsError(
            `cannot write "${target.displayPath}": file access denied under workspace-write mode`,
            "FS_SANDBOX_DENIED",
        );
    }
}

export default MultiRootFileSystem;
```

</details>

**依据 3 · 源码核查**：[src/multi-root/sandbox.ts:1-72](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/multi-root/sandbox.ts#L1-L72)

沙箱扩宽与未知方言拒绝。

<details>
<summary>查看原文（72行）</summary>

```text
/**
 * Multi-root process-sandbox provider: the upstream local runner chain with
 * one change — a `workspace-write` profile also grants the session's
 * additional roots.
 *
 * The class extends the installed `LocalSandboxProvider`, so runner selection,
 * probing, denial dialects, enforcement reporting, and the Windows ACL grant
 * mechanics stay upstream. It replaces the `sandbox` row only because Cordis
 * refuses two providers for the same service key; its empty-scope path calls
 * `super.confine` unchanged.
 *
 * @module dsh-acp/multi-root/sandbox
 */

import type { Context } from "@deepseek-ai/cordis";
import {
    SandboxUnavailableError,
    type ConfinedArgv,
    type SandboxPolicy,
} from "@deepseek-ai/dsh-sandbox";
import { LocalSandboxProvider, type Config } from "@deepseek-ai/dsh-sandbox-local";

import { DialectUnrecognizedError, widenConfinedArgv } from "./dialects.ts";
import { canonicalRoot, effectiveAdditionalRoots } from "./roots.ts";
import type { AcpMultiRootScope } from "./scope.ts";

export const name = "acp-multi-root-sandbox";
export const inject = ["acpMultiRootScope"];

export class MultiRootSandboxProvider extends LocalSandboxProvider {
    static inject = ["acpMultiRootScope"];

    constructor(ctx: Context, config: Config) {
        super(ctx, config);
    }

    /**
     * Wrap `argv` through the upstream provider, then widen a
     * `workspace-write` profile with the session's additional roots. Under
     * `read-only` and `danger-full-access` — and for every session with no
     * extra roots — the upstream result is returned untouched.
     */
    override async confine(
        argv: readonly string[],
        policy: SandboxPolicy,
        signal?: AbortSignal,
    ): Promise<ConfinedArgv> {
        const canonicalPolicy: SandboxPolicy = {
            ...policy,
            workspaceRoot: canonicalRoot(policy.workspaceRoot),
        };
        const confined = await super.confine(argv, canonicalPolicy, signal);
        if (canonicalPolicy.mode !== "workspace-write") return confined;
        const scope = this.ctx.get("acpMultiRootScope") as AcpMultiRootScope | undefined;
        if (scope === undefined) return confined;
        const roots = effectiveAdditionalRoots(
            canonicalPolicy.workspaceRoot,
            scope.get(canonicalPolicy.sessionId === undefined ? undefined : String(canonicalPolicy.sessionId)),
        );
        if (roots.length === 0) return confined;
        try {
            return widenConfinedArgv(confined, argv, canonicalPolicy, roots);
        } catch (error: unknown) {
            if (error instanceof DialectUnrecognizedError) {
                throw new SandboxUnavailableError(canonicalPolicy.mode, error.message);
            }
            throw error;
        }
    }
}

export default MultiRootSandboxProvider;
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:130-174](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/plugin.ts#L130-L174)

宿主兼容与服务挂接。

<details>
<summary>查看原文（45行）</summary>

```text
export async function apply(ctx: Context, config: Config = {}): Promise<void> {
    if (ctx.get("acpServer") !== undefined) return;
    // A standalone runtime is outside the ACP package's node_modules tree.
    // Preset health checks walk ctx.baseUrl on disk, bypassing import hooks.
    const hostBase = ctx.get("dshAcpHostBaseUrl");
    const hostCtx = typeof hostBase === "string" ? ctx.extend({ baseUrl: hostBase }) : ctx;
    // Compatibility gate (issue #157): when mounted by a host dsh (Martty's
    // plugin-mode path), that host is the runtime — refuse it with a clear
    // message when it is below the supported floor instead of failing deep
    // inside the composition. A host newer than any tested dsh is attempted
    // with a warning; API differences are feature-detected where used. The
    // standalone path already passed resolveHost's own gate, so this re-check
    // is a consistent no-op there.
    const hostDsh = dshVersionAt(String(hostCtx.baseUrl ?? import.meta.url));
    if (hostDsh !== undefined && dshVersionUntested(hostDsh.version)) {
        logWarn(untestedMessage(hostDsh.version ?? "unknown version", `dsh plugin host (${hostDsh.base})`));
    }
    if (hostDsh !== undefined && !dshVersionSupported(hostDsh.version)) {
        throw new Error(
            [
                refusalMessage(hostDsh.version ?? "unknown version", `dsh plugin host (${hostDsh.base})`, supportedDshRange()),
                "Upgrade the hosting dsh (npm install -g @deepseek-ai/dsh@latest),",
                "or run dsh-acp standalone with --dsh-path bundled.",
            ].join("\n"),
        );
    }
    // Publish the runtime identity for `_meta.dsh.runtime` in the initialize
    // response so clients can show which dsh is in use. The standalone boot
    // provides it earlier; plugin mounts fill it here.
    if (hostDsh !== undefined && ctx.get("dshAcpHost") === undefined) {
        (ctx as unknown as { provide?: (service: string, value: unknown) => void }).provide?.("dshAcpHost", {
            base: hostDsh.base,
            version: hostDsh.version,
            source: `dsh plugin host (${hostDsh.base})`,
        });
    }
    // Newer shipped presets require this Host settings owner; older hosts
    // do not export it and keep their existing delegation behavior.
    const modelSettings = "@deepseek-ai/dsh-tool-subagent/model-selection-settings";
    if (ctx.get("subagentModelSelection") === undefined && resolvedHostModule(hostCtx, modelSettings) !== modelSettings) {
        await mountService(hostCtx, "subagentModelSelection", modelSettings);
    }
    await mountService(hostCtx, "dynamicCordisRunner", "@deepseek-ai/dsh-cordis-host-runner");
    await mountAgentPresets(hostCtx);
    await ctx.plugin(server, config);
```

</details>

**依据 5 · 源码核查**：[package.json:1-56](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/package.json#L1-L56)

分发入口、版本、许可证和运行要求。

<details>
<summary>查看原文（56行）</summary>

```text
{
  "name": "@openma/deepseek-harness-acp",
  "publishConfig": {
    "access": "public"
  },
  "version": "0.4.40",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/openma-ai/deepseek-harness-acp.git"
  },
  "homepage": "https://dshsuite.dev/#other-products",
  "bugs": {
    "url": "https://github.com/openma-ai/deepseek-harness-acp/issues"
  },
  "description": "Agent Client Protocol (ACP) adapter for DeepSeek Harness — use DeepSeek Harness from ACP clients such as Zed.",
  "main": "dist/index.js",
  "bin": {
    "dsh-acp": "dist/bin.js"
  },
  "files": [
    "dist/bin.js",
    "dist/index.js",
    "dist/bridge.js",
    "dist/server.js",
    "dist/plugin.js",
    "dist/stdio.js",
    "dist/multi-root.js",
    "dist/multi-root-fs.js",
    "dist/multi-root-sandbox.js",
    "src/multi-root/NOTICE.md",
    "cordis.patch.yml",
    "README.md",
    "LICENSE",
    "package.json",
    "profile-root.cordis.yml",
    "vendor/*.json",
    "vendor/*.tgz",
    "assets/icon.svg"
  ],
  "scripts": {
    "prepack": "npm run build && npm run runtime:pack",
    "build": "node build.mjs",
    "runtime:pack": "node scripts/pack-runtime.mjs",
    "start": "node --import tsx src/index.ts",
    "pretest": "npm run build",
    "test": "vitest run",
    "test:host": "vitest run test/e2e.test.ts -t \"serves session controls through the host tree\"",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "pack:local": "npm pack"
  },
  "license": "Apache-2.0",
  "type": "module",
  "engines": {
    "node": ">=22.15",
    "dsh": ">=0.1.7-rc.2"
```

</details>

#### 缺口

- 没有跨平台运行、模型账单及维护工时对照。
  **影响**：无法评价所有宿主兼容或净效率收益。
  **进一步探讨**：在固定编辑器/宿主组合完成已知仓库任务，记录权限、结果、费用与修复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么边界内值得试用，进一步值得验证什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议有明确 DSH 使用需求的单人开发者在一次性工作区试用：先记录实际宿主版本、模型与根目录，用已知答案的读文件任务验证工具结果，再用可恢复的小改动检查审批、补充消息和取消。保持逐次审批，不在不了解会话范围时选择始终允许；同一进程只用一组受信 MCP 配置。若结果缺失、目录越出预期、权限呈现含糊或同名 MCP 替换影响旧会话，停进程，核查实际修改，再回到原 DSH 客户端。

可验证的新方向是每会话展示运行环境和授权回执：固定宿主/模型、有效写根、当前审批范围及 MCP 配置指纹，并在全局同名 MCP 变化时要求明确处理。依据是请求来自编辑器，而实际环境和共享挂载在服务端；相对现有适配，增量是让用户核对有效环境，不宣称新 Agent 算法。最小实验对照有无回执时识别错误根目录、错误宿主和 MCP 替换的成功率、额外步骤、合格任务成本；若现有编辑器已同等清楚，或回执不能减少错误且增加负担，方向不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/harness.ts:177-204](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/harness.ts#L177-L204)

运行环境选择的核对依据。

<details>
<summary>查看原文（28行）</summary>

```text
 * Resolve the single DeepSeek Harness installation this process uses.
 *
 * An explicit selection is validated and compatibility-checked; with no
 * selection (or the literal {@link BUNDLED_HOST}) the packaged runtime is
 * the only host — ambient installs are never consulted.
 *
 * @throws HarnessNotFoundError when the selection names nothing usable.
 * @throws HarnessCompatibilityError when it names an install below the floor;
 *         one newer than any tested dsh is used with a warning.
 */
export function resolveHost(explicit?: string): HarnessHost {
    if (explicit !== undefined && explicit !== BUNDLED_HOST) {
        const host = hostFromExplicit(explicit);
        if (host !== undefined) {
            if (!dshVersionSupported(host.dshVersion)) throw new HarnessCompatibilityError(host, supportedDshRange());
            if (dshVersionUntested(host.dshVersion)) logWarn(untestedMessage(host.dshVersion ?? "unknown version", host.source));
            return host;
        }
        // An explicit path that does not resolve is an error, not a fallback:
        // silently using another installation would be worse than failing.
        throw new HarnessNotFoundError([`--dsh-path/DSH_PATH: ${explicit}`], explicit);
    }
    const vendored = resolveVendoredRuntime();
    const host = vendored === undefined ? undefined : hostAt(vendored, "bundled standalone runtime");
    if (host === undefined) throw new HarnessNotFoundError(["bundled standalone runtime"]);
    if (!dshVersionSupported(host.dshVersion)) throw new HarnessCompatibilityError(host, supportedDshRange());
    return host;
}
```

</details>

**依据 2 · 源码核查**：[src/bridge/index.ts:2487-2513](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/bridge/index.ts#L2487-L2513)

授权范围回执的动因。

<details>
<summary>查看原文（27行）</summary>

```text
    // Permission requests: one-shot decisions, with an "always for this
    // session" convenience that flips the harness approval policy to 'never'.
    ctx.on("approval/request", (request, next) => {
        const record = ownedRecord(request.agent);
        const child = clientSubagents ? subagentByChild.get(String(request.agent.session.id)) : undefined;
        if ((record === undefined && child?.agent !== request.agent) || request.callId === undefined) return next();
        const sessionId = record !== undefined ? String(record.agent.session.id) : child!.childSessionId;
        return conn
            .request("session/request_permission", {
                sessionId,
                toolCall: { toolCallId: request.callId },
                options: [
                    { optionId: "allow-once", name: "Allow once", kind: "allow_once" },
                    { optionId: "allow-always", name: "Always allow (this session)", kind: "allow_always" },
                    { optionId: "reject-once", name: "Reject", kind: "reject_once" },
                ],
            })
            .then(({ outcome }) => {
                if (outcome.outcome === "cancelled") return "cancelled" as const;
                if (outcome.optionId === "allow-always") {
                    if (record !== undefined) setApprovalPolicy(record, "never");
                    else approval.setPolicy(request.agent, "never");
                    return "allowed-once" as const;
                }
                return outcome.optionId === "allow-once" ? ("allowed-once" as const) : ("rejected" as const);
            });
    });
```

</details>

**依据 3 · 源码核查**：[src/bridge/index.ts:3332-3380](https://github.com/openma-ai/deepseek-harness-acp/blob/06a70350d49fa7044c451d48380f5db0603083bd/src/bridge/index.ts#L3332-L3380)

MCP 配置变化的动因。

<details>
<summary>查看原文（49行）</summary>

```text
    /** Mounts/reuses/replaces mcp-client instances for a session's server list. */
    const syncMcpServers = (servers: NewSessionRequest["mcpServers"] | undefined, cwd: string): void => {
        if (servers === undefined || servers.length === 0) return;
        const mcpClient = harness.mcpClient;
        if (mcpClient === undefined) {
            if (!warnedNoMcpClient) {
                warnedNoMcpClient = true;
                logWarn(
                    `ignoring ${servers.length} MCP server(s): this DeepSeek Harness installation lacks @deepseek-ai/dsh-mcp-client`,
                );
            }
            return;
        }
        const taken = new Set<string>();
        for (const entry of servers) {
            const server = entry as unknown as Record<string, unknown>;
            const base = sanitizeServerName(typeof server["name"] === "string" ? server["name"] : "server");
            let serverName = base;
            for (let n = 2; taken.has(serverName); n += 1) serverName = `${base.slice(0, 28)}_${n}`;
            const cfg = mcpConfigFor(server, cwd, serverName);
            if (cfg === undefined) {
                logWarn(`skipping MCP server "${serverName}": unsupported transport`);
                continue;
            }
            const configJson = JSON.stringify(cfg);
            const existing = mcpMounts.get(serverName);
            if (existing !== undefined) {
                if (existing.configJson === configJson) {
                    taken.add(serverName);
                    continue;
                }
                try {
                    void existing.fiber.dispose();
                } catch (error: unknown) {
                    logWarn(`disposing MCP server "${serverName}": ${String(error)}`);
                }
                mcpMounts.delete(serverName);
            }
            try {
                const fiber = (
                    ctx as unknown as { plugin(module: unknown, config: unknown): { dispose(): unknown } }
                ).plugin(mcpClient, cfg);
                mcpMounts.set(serverName, { configJson, fiber });
                taken.add(serverName);
                logDebug(`mounted MCP server "${serverName}" (${String(cfg["transport"])})`);
            } catch (error: unknown) {
                logWarn(`failed to mount MCP server "${serverName}": ${String(error)}`);
            }
        }
```

</details>

#### 缺口

- 试用和回执对照均未执行。
  **影响**：尚不确认实际编辑器收益、需求规模及新增方案价值。
  **进一步探讨**：先完成上述已知任务与故障对照，记录完整合格结果成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
