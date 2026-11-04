# Abu Cowork

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7e6d171](https://github.com/PM-Shawn/Abu-Cowork/tree/7e6d17126241cd6d89b1df0f60e7f98c144377ad)

<!-- BEGIN META -->
[![GitHub ★ 418](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=418&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PM-Shawn/Abu-Cowork) [![npm 30d 231](https://img.shields.io/static/v1?label=npm+30d&message=231&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/abu) [![最新发布 2013-04-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2013-04-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/abu)
<!-- END META -->

> **功能**：本地桌面助手，通过模型与工具协作处理文件和办公任务。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示桌面输入、模型和工具循环相连，支持检查执行过程；尚不能证明产物正确或替代人工验收。

> **主要限制**：[Q03](#research-q03) 显示权限随模式及工具变化、Stop 回执不等于所有副作用已撤销；[Q04](#research-q04) 的轮数也不是总费用上限。

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
  - [Q01 · 谁用这个项目，它和普通模型聊天有什么不同？](#detail-section-11)
  - [Q02 · 用户输入如何到达模型与工具，怎样形成运行状态？](#detail-section-12)
  - [Q03 · 权限和停止是否保证所有副作用受控？](#detail-section-13)
  - [Q04 · 依赖、资源和使用条件是什么？](#detail-section-14)
  - [Q05 · 哪些改进能通过对照验证或否定？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望用自然语言辅助本地文件和办公任务的用户，可以在桌面应用中发起任务并检查结果。

普通聊天需要用户手工处理文件，脚本自动化可执行固定流程；本项目把模型驱动的决策和工具执行整合到桌面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面任务 | 从聊天输入发起工作 | 依赖运行环境和 sidecar |
| 模型与工具循环 | 根据模型调用执行工具 | 权限依工具和模式变化 |
| 停止请求 | 请求取消正在运行的任务 | 回执不是已撤销所有副作用 |
| 密钥存储 | 在系统加密可用时保存凭据 | 其他数据及日志保护未全审 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容桌面运行环境与 sidecar | 桌面任务需要 | 运行界面和代理循环 | 启动或桥接失败需恢复 |
| 模型服务与凭据 | 模型任务需要 | 处理上下文并产生工具调用 | 服务不可用任务不能继续 |
| 授权工作区及工具 | 对应操作需要 | 访问文件和执行动作 | 权限不足按策略处理 |
| 系统加密存储 | 保存密钥需要 | 加密持久密钥 | 不可用时拒绝保存 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户建立非敏感工作区副本并核模式 | 无法确认权限或预算时停止 |
| 下达 | 用户限定小任务和目标文件 | 输入经 sidecar 进入模型循环 |
| 执行 | 用户审查升级请求与实际工具状态 | 超预算或越界时停止 |
| 验收 | 用户回读文件及外部系统状态 | 停止后状态不明时先核对再重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 桌面资源与模型费用未知 | 配置提供商、权限及副本 | 平台兼容未实测 |
| 持续 | token、网络与工具费用未知 | 观察轮数、操作及结果 | 有限轮数不是总成本上限 |
| 失败恢复 | 重试和备份资源未知 | 检查文件及外部副作用 | Stop 回执不保证撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型工具循环 | UI 到 sidecar、adapter 和工具执行接线 | 办公任务成功率与节时 |
| 权限与停止 | 有模式与取消协议 | 各平台及所有工具的实际隔离 |
| 密钥保存 | 加密不可用时拒绝写入 | 其他数据与日志是否保密 |

> **思考**：[Q03](#research-q03) 显示权限随模式及工具变化、Stop 回执不等于所有副作用已撤销；[Q04](#research-q04) 的轮数也不是总费用上限。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示桌面输入、模型和工具循环相连，支持检查执行过程；尚不能证明产物正确或替代人工验收。

[Q02](#research-q02) 的 sidecar 复用循环和 [Q03](#research-q03) 的取消回执提供可追踪边界；前台可分离的在途动作和各平台权限必须在验收时单独核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示权限随模式及工具变化、Stop 回执不等于所有副作用已撤销；[Q04](#research-q04) 的轮数也不是总费用上限。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议能核查实际文件和资源使用的用户先在 standard 模式对副本试小任务；停止后状态不明时先查真实结果。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已定向核查固定源码的主要调用链；真实桌面、平台安全和业务效果未验证。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、src/components/chat/ChatView.tsx、src/core/agent/agentLoopRunner.ts、sidecar/src/agentLoopHost.ts、src/core/agent/agentLoop.ts、src/core/agent/toolExecutor.ts、src/core/agent/loopGuards.ts、src/core/permissions/permissionMode.ts、electron/secretStore.cjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：复核旧场景、机制、分发、依赖、成本、采用、价值、工程、贡献、质疑和假设；定向检查 Chat 分发、sidecar、代理循环、权限模式、停止和密钥存储。未运行目标、模型或桌面，未全审各平台沙箱、浏览器、MCP、后台与多 Agent。
- 下一步：固定桌面版本与提供方，在隔离工作区测试模型调用、权限提升、文件执行、Stop、崩溃恢复及外部回读。

**分析版本**

- **仓库**：[PM-Shawn/Abu-Cowork](https://github.com/PM-Shawn/Abu-Cowork)
- **版本号**：0.61.1（[固定提交 7e6d171](https://github.com/PM-Shawn/Abu-Cowork/tree/7e6d17126241cd6d89b1df0f60e7f98c144377ad)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出可回读的副作用收据及结果未知状态；若故障对照中现有记录足够或负担过高则否定。

固定桌面版本与提供方，在隔离工作区测试模型调用、权限提升、文件执行、Stop、崩溃恢复及外部回读。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 152 | 30159 | — | — | 300368 |
| .mjs | source | 45 | 11384 | 9291 | 1415 | — |
| .ts | test | 1043 | 249798 | 202014 | 21115 | — |
| .ts | source | 954 | 200284 | 135241 | 51160 | — |
| .js | source | 14 | 6947 | 6075 | 634 | — |
| .md | example | 9 | 208 | — | — | 2071 |
| .cjs | source | 164 | 50735 | 38400 | 9358 | — |
| .cjs | test | 102 | 31751 | 27215 | 2364 | — |
| .tsx | test | 309 | 107246 | 88695 | 5249 | — |
| .tsx | source | 303 | 65655 | 53154 | 9293 | — |
| .mts | source | 1 | 123 | 78 | 32 | — |
| .mjs | test | 20 | 4368 | 3969 | 136 | — |
| .ts | example | 3 | 356 | 265 | 63 | — |

</details>

**活跃度**

[![Issue 未关闭 47](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=47&color=737b86&logo=github)](https://github.com/PM-Shawn/Abu-Cowork/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/PM-Shawn/Abu-Cowork/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/PM-Shawn/Abu-Cowork/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查桌面任务从输入到 sidecar、模型、工具、权限和停止的主要源码链。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用这个项目，它和普通模型聊天有什么不同？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望用自然语言处理本地文件或办公任务的人，可以通过桌面客户端发起任务并查看执行过程。普通模型聊天可以生成文本，用户再手动处理文件；本项目将模型请求与可执行工具、权限策略和会话界面组合，因而能在条件满足时发起实际操作。它是独立 Electron 桌面客户端，目录收录不使它成为 DSH 原生插件。具体任务是否正确、是否节省时间及所有动作是否安全并未由源码接线证明。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-8](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/package.json#L1-L8)

声明独立应用名称、版本与 Electron 主入口。

```text
{
  "name": "abu",
  "private": false,
  "license": "Apache-2.0",
  "version": "0.61.1",
  "description": "Abu - AI Desktop Office Assistant",
  "type": "module",
  "main": "electron/main.cjs",
```

**依据 2 · 作者声明**：[README.md:7-12](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/README.md#L7-L12)

作者定位为桌面办公助手。

```text
# Abu

**Your AI Desktop Office Assistant — Just Leave It to Abu**

A locally-run AI desktop assistant inspired by Claude Code's Cowork mode.
Tell Abu what you need — it reads files, runs commands, writes docs, and builds reports, all on your machine.
```

**依据 3 · 源码核查**：[src/components/chat/ChatView.tsx:1001-1012](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/components/chat/ChatView.tsx#L1001-L1012)

聊天界面把用户输入交给分发入口。

<details>
<summary>查看原文（12行）</summary>

```text
    // Sent from the new-task page: the page changes once the runner has added the message.
    const sentFromNewTaskPage = !activeConv || activeConv.messages.length === 0;
    if (sentFromNewTaskPage) firstMessageOfRef.current = convId;
    let dispatch: AgentLoopDispatchResult;
    try {
      dispatch = await runAgentLoopDispatched(convId, sendText, {
        images,
        onMessageTaken: () => onAccepted?.(),
        // A human typed this — attended, even inside a scheduled/trigger
        // conversation (the browser gate offers dialogs on that basis).
        initiatedBy: 'user',
      });
```

</details>

#### 缺口

- 没有对同一办公任务的实测比较
  **影响**：无法量化成功率或净节时
  **进一步探讨**：在隔离副本比较人工和客户端的结果、步骤及人工复核时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 用户输入如何到达模型与工具，怎样形成运行状态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

聊天界面将输入传给 runAgentLoopDispatched；其 Electron 路径建立任务并通过 agent.run 请求 sidecar，而 sidecar 在运行上下文内调用同一 runAgentLoop。循环调用选定模型 adapter，并在模型返回工具调用时将其交给 executeToolBatch，再处理观察和持久化本轮状态。工具执行器在执行前检查边界和取消信号。代码有状态和检查点接线，但抽查不能证明全部工具、浏览器、后台任务和宿主组合均能正常工作，运行记录也不等于业务成果已验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/components/chat/ChatView.tsx:1001-1012](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/components/chat/ChatView.tsx#L1001-L1012)

用户输入实际进入分发。

<details>
<summary>查看原文（12行）</summary>

```text
    // Sent from the new-task page: the page changes once the runner has added the message.
    const sentFromNewTaskPage = !activeConv || activeConv.messages.length === 0;
    if (sentFromNewTaskPage) firstMessageOfRef.current = convId;
    let dispatch: AgentLoopDispatchResult;
    try {
      dispatch = await runAgentLoopDispatched(convId, sendText, {
        images,
        onMessageTaken: () => onAccepted?.(),
        // A human typed this — attended, even inside a scheduled/trigger
        // conversation (the browser gate offers dialogs on that basis).
        initiatedBy: 'user',
      });
```

</details>

**依据 2 · 源码核查**：[src/core/agent/agentLoopRunner.ts:3323-3333](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/agent/agentLoopRunner.ts#L3323-L3333)

区分本地预览与 Electron sidecar 分发路径。

<details>
<summary>查看原文（11行）</summary>

```text
 * `runAgentLoopDispatched` — the drop-in dispatch entrypoint. IDENTICAL
 * signature to `runAgentLoop` (design doc §4: "selectAgentLoopRunner only
 * `'running'` walks sidecar... 8 caller-side call sites all switch line" —
 * the 4th reuse of the `selectChatAdapter`/`runSubagent` zero-risk-switch
 * shape). Every existing caller of `runAgentLoop` switches to this.
 *
 * - Web preview / unit tests (no desktop process bridge,
 *   `isInProcessAgentEnvironment()`) → `runAgentLoop` in this renderer. This
 *   is an environment choice, never a recovery path.
 * - Electron → concurrency guard, durable user row, wait for the sidecar
 *   (≤60s, visible), build params, `agent.start` + `agent.run`.
```

</details>

**依据 3 · 源码核查**：[src/core/agent/agentLoopRunner.ts:3954-3965](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/agent/agentLoopRunner.ts#L3954-L3965)

发起 agent.run 并等待 RPC 或终态。

<details>
<summary>查看原文（12行）</summary>

```text
  try {
    await establishAgentStart(params, session);
    if (session.terminal) return await settleFromTerminal(session.terminal);

    const rpcOutcome = sidecarRequest(
      'agent.run',
      agentRunRequestFor(params),
      0,
      session.transportAbortController!.signal,
    ).then((raw) => ({ source: 'rpc' as const, raw }));
    const terminalOutcome = terminalPromise.then((terminal) => ({ source: 'terminal' as const, terminal }));
    const outcome = await Promise.race([rpcOutcome, terminalOutcome]);
```

</details>

**依据 4 · 源码核查**：[sidecar/src/agentLoopHost.ts:1225-1235](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/sidecar/src/agentLoopHost.ts#L1225-L1235)

sidecar 调用共享循环。

<details>
<summary>查看原文（11行）</summary>

```text
      loopId: runId,
      runtimeEvent: (event, attributes) => {
        // Stamp the conversation so loop-emitted sidecar events join the same
        // run timeline as the renderer/main planes during diagnosis; an
        // explicit conversationId from the loop still wins.
        traceSidecarRuntimeEvent(`sidecar.${event}`, { conversationId, ...attributes });
      },
    };
    const result: AgentLoopResult = await agentRunContext.run(runCtx, () =>
      runAgentLoop(conversationId, params.userMessage, options),
    );
```

</details>

**依据 5 · 源码核查**：[src/core/agent/agentLoop.ts:2323-2326](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/agent/agentLoop.ts#L2323-L2326)

循环调用模型 adapter。

```text
          primaryBudgetGateLogged = true;
        }
        return adapter.chat(providerBudgetResult.messages, chatOptions, eventHandler);
      };
```

**依据 6 · 源码核查**：[src/core/agent/agentLoop.ts:2704-2752](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/agent/agentLoop.ts#L2704-L2752)

模型工具调用交给批量执行器。

<details>
<summary>查看原文（49行）</summary>

```text
      let semanticLoopReason: SemanticToolLoopReason | null = null;

      // If there are tool calls, execute them via toolExecutor
      if (collectedToolCalls.length > 0) {
        const confirmCb = options?.commandConfirmCallback ?? requestCommandConfirmation;
        const filePermCb = options?.filePermissionCallback ?? requestFilePermission;

        // Move the crash checkpoint from "waiting on the model" to "running
        // tools" before any side effect starts, so recovery can tell which of
        // the two a crash interrupted. App.tsx already renders the
        // 'tool_executing' wording; until now nothing ever wrote that status.
        import('../session/checkpoint').then(({ writeCheckpoint }) => {
          writeCheckpoint({
            conversationId,
            loopId,
            turnCount,
            lastMessageId: assistantMsgId,
            status: 'tool_executing',
            currentTool: collectedToolCalls.map((tc) => tc.name).join(', '),
            timestamp: Date.now(),
          });
        }).catch(() => {});

        // 按工具的 inputSchema 修复写错形状的参数（档案打开该护栏时）；修不好的
        // 原样交给工具，由工具把错误返回给模型
        const dispatchToolCalls = repairToolCallsForProfile(collectedToolCalls, tools, modelProfile, logger);
        const batchResult = await executeToolBatch({
          collectedToolCalls: dispatchToolCalls,
          toolCallToStepId,
          conversationId,
          assistantMsgId,
          loopId,
          abortController,
          eventRouter,
          executionId: execution.id,
          inputValidators,
          agentToolPolicy: agentToolPolicyForRoute(route),
          blockedTools: iterationBlockedTools,
          allowedTools: options?.allowedTools,
          imContext: options?.imContext,
          unattendedApproval: options?.unattendedApproval,
          confirmCb,
          filePermCb,
          toolContext,
          continueLoop,
          toolInvoker,
          settingsReader: entrySettingsReader,
          parallelToolCalls: modelProfile.capabilities.parallelToolCalls,
        });
```

</details>

**依据 7 · 源码核查**：[src/core/agent/toolExecutor.ts:227-240](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/agent/toolExecutor.ts#L227-L240)

工具边界和执行前取消检查。

<details>
<summary>查看原文（14行）</summary>

```text
  const checkToolBoundary = (name: string, input: Record<string, unknown>): string | null => {
    const refusal = boundaryRefusal(name, input);
    return refusal && withOfferedToolsHint(refusal, name, toolContext.offeredToolNames);
  };

  const executeSingleTool = async (tc: typeof collectedToolCalls[number]): Promise<ToolExecResult> => {
    const boundaryError = checkToolBoundary(tc.name, tc.input);
    if (boundaryError) {
      return { id: tc.id, result: boundaryError, resultContent: undefined, error: true, duration: 0 };
    }

    // Check if cancelled before executing
    if (abortController.signal.aborted) {
      return { id: tc.id, result: TOOL_RESULT_CANCELLED_MARKER, resultContent: undefined, error: false, duration: 0 };
```

</details>

#### 缺口

- 未执行 Electron、sidecar 或模型
  **影响**：不能确认真实任务链、结果持久化与重启恢复
  **进一步探讨**：在隔离工作区用可回读文件测试请求、工具和终态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限和停止是否保证所有副作用受控？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

源码的 standard 策略对工作区内部分读写和安全命令允许，危险命令或工作区外写入需要确认；smart 将相同升级交给评审，autonomous 策略允许更多操作，但其他独立硬限制仍可能适用。权限因工具、模式和平台不同，不能把一种策略表述成所有操作都先人工批准。停止时前端发送 agent.abort，sidecar 回执说明请求进入 aborting；前台工具执行支持响应式 detach，因此本地界面结束不一定证明已发出的 HTTP、MCP 或本机动作全部撤销。应在重试前检查真实文件和外部系统状态。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/permissions/permissionMode.ts:1-12](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/permissions/permissionMode.ts#L1-L12)

三种权限模式及独立硬限制说明。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * Permission Mode System — controls tool execution confirmation behavior.
 *
 * Three tiers along a single autonomy axis (the workspace is the boundary):
 * - standard:   Inside the workspace, read/write/commands run freely. Escalations
 *               (writes to new directories, dangerous commands) require confirmation.
 * - smart:      Same boundary as standard, but escalations are routed to an AI
 *               reviewer instead of the user. (Reviewer lands in Phase 2; until then
 *               the gate degrades 'review' to 'confirm'.)
 * - autonomous: Everything runs automatically. Block-level commands, sensitive-path
 *               hard-blocks and the content guard still apply — they are enforced
 *               independently of the mode, not via these strategies.
```

</details>

**依据 2 · 源码核查**：[src/core/permissions/permissionMode.ts:104-147](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/permissions/permissionMode.ts#L104-L147)

具体模式对命令、文件和其他工具的决策。

<details>
<summary>查看原文（44行）</summary>

```text
/** standard: workspace-internal is free; escalations ask the user. Matches the old `default` behavior. */
const standardStrategy: PermissionStrategy = {
  decideCommand(info, readOnly, boundary) {
    if (readOnly) return 'allow';
    if (isRiskyCommand(info.level)) return 'confirm';
    // Safe content but writing outside the workspace → escalate.
    if (boundary === 'outside') return 'confirm';
    return 'allow';
  },
  decideFileAccess(_capability, needsPermission) {
    // needsPermission === true means the path isn't in an authorized working dir yet.
    return needsPermission ? 'confirm' : 'allow';
  },
  decideOtherTool(consequence, alreadyGranted) {
    return decideConsequentialTool(consequence, alreadyGranted);
  },
};

/** smart: same boundary as standard, but escalations go to the AI reviewer. */
const smartStrategy: PermissionStrategy = {
  decideCommand(info, readOnly, boundary) {
    if (readOnly) return 'allow';
    return (isRiskyCommand(info.level) || boundary === 'outside') ? 'review' : 'allow';
  },
  decideFileAccess(_capability, needsPermission) {
    return needsPermission ? 'review' : 'allow';
  },
  decideOtherTool(consequence, alreadyGranted) {
    return decideConsequentialTool(consequence, alreadyGranted);
  },
};

/** autonomous: everything proceeds. Block-level/sensitive-path/content-guard floors are enforced elsewhere. */
const autonomousStrategy: PermissionStrategy = {
  decideCommand() {
    return 'allow';
  },
  decideFileAccess() {
    return 'allow';
  },
  // Even here the browser stays gated: `computerUsePolicy.modePolicy` keeps
  // `approval-required` at 'confirm' in autonomous for exactly this surface.
  decideOtherTool(consequence, alreadyGranted) {
    return decideConsequentialTool(consequence, alreadyGranted);
```

</details>

**依据 3 · 源码核查**：[src/core/agent/agentLoopRunner.ts:1277-1316](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/agent/agentLoopRunner.ts#L1277-L1316)

停止请求、ACK 与看门狗。

<details>
<summary>查看原文（40行）</summary>

```text
function requestSidecarRunAbort(session: RunSession): Promise<void> {
  if (session.abortRequestPromise) return session.abortRequestPromise;
  session.abortRequested = true;
  markRuntimeRunStage(session.runId ?? session.loopId, 'abort_requested');
  traceRuntimeEvent('renderer.agent_abort_requested', {
    runId: session.runId ?? session.loopId,
    method: 'agent.abort',
    stage: 'abort_requested',
    reason: typeof session.shellAbortController.signal.reason === 'string'
      ? session.shellAbortController.signal.reason
      : session.shellAbortController.signal.reason instanceof Error
        ? session.shellAbortController.signal.reason.name
        : 'unspecified',
  });
  session.abortWatchdog = setTimeout(() => {
    traceRuntimeEvent('renderer.agent_abort_watchdog_fired', {
      runId: session.runId ?? session.loopId,
      method: 'agent.abort',
      stage: 'force_finalize',
      outcome: 'stalled',
    });
    void finalizeAbortedRun(session, 'watchdog').catch(() => undefined);
  }, AGENT_ABORT_FORCE_FINALIZE_MS);

  session.abortRequestPromise = sidecarRequest(
    'agent.abort',
    { runId: session.runId },
    AGENT_ABORT_ACK_TIMEOUT_MS,
  ).then(async () => {
    traceRuntimeEvent('renderer.agent_abort_ack_received', {
      runId: session.runId ?? session.loopId,
      method: 'agent.abort',
      stage: 'ack_received',
      outcome: 'success',
    });
    await finalizeAbortedRun(session, 'ack');
  }).catch((err: unknown) => {
    // A pre-ACK timeout is not terminal: the sidecar may have received and
    // acted on the request. The watchdog owns deterministic local cleanup.
    logger.warn('agent.abort ACK unavailable; waiting for force-finalize watchdog', {
```

</details>

**依据 4 · 源码核查**：[sidecar/src/agentLoopHost.ts:1372-1417](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/sidecar/src/agentLoopHost.ts#L1372-L1417)

sidecar abort 回执为 aborting 或 not_found。

<details>
<summary>查看原文（46行）</summary>

```text
export interface AgentAbortAck {
  accepted: boolean;
  state: 'aborting' | 'not_found';
}

/**
 * `{ runId }` — abort THIS run's conversation-scoped AbortController and
 * return an acknowledgement. Flushing before the ACK creates an ordering
 * barrier: every frame emitted before Stop is already on stdout before the
 * shell receives this response and performs its own idempotent finalization.
 * Unknown/already-finished runIds are still safe and idempotent.
 */
export async function handleAgentAbort(rawParams: unknown): Promise<AgentAbortAck> {
  const { runId } = parseAbortParams(rawParams);
  const run = activeRuns.get(runId);
  traceSidecarRuntimeEvent('sidecar.agent_abort_received', {
    runId,
    method: 'agent.abort',
    stage: run ? 'aborting' : 'not_found',
  });
  if (!run) {
    // A ledger start still reading its history owns the runId before the
    // registry does; the flag it carries reaches the entry that read creates.
    const pendingStart = pendingLedgerStarts.get(runId);
    if (pendingStart) {
      pendingStart.cancel.requested = true;
      return { accepted: true, state: 'aborting' };
    }
    const registered = runRegistry.get(runId);
    if (!registered || registered.state === 'terminal') {
      return { accepted: false, state: 'not_found' };
    }
    registered.cancelRequested = true;
    return { accepted: true, state: 'aborting' };
  }
  run.coalescer.flush();
  run.controllers.get(run.conversationId)?.abort();
  await run.chatDelta.drain();
  run.coalescer.flush();
  traceSidecarRuntimeEvent('sidecar.agent_abort_ack_ready', {
    runId,
    method: 'agent.abort',
    stage: 'aborting',
    outcome: 'success',
  });
  return { accepted: true, state: 'aborting' };
```

</details>

**依据 5 · 源码核查**：[src/core/agent/toolExecutor.ts:314-335](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/agent/toolExecutor.ts#L314-L335)

前台 Stop 可从已开始的工具 promise 分离。

<details>
<summary>查看原文（22行）</summary>

```text
      // Foreground Stop keeps its long-standing responsive detach behavior.
      // A scoped/background run is an authority owner, however: its caller
      // must not release the scope or start the next session turn while the
      // already-started MCP/HTTP/native operation is still alive. Keep the
      // original promise joined in that case; UI terminalization is handled
      // independently by the shell-side runner.
      const rawResult: ToolResult = isScopedRun
        ? await invokeTool()
        : await new Promise<ToolResult>((resolve, reject) => {
        if (abortController.signal.aborted) {
          reject(new DOMException('Aborted', 'AbortError'));
          return;
        }
        let settled = false;
        const onAbort = () => {
          if (!settled) {
            settled = true;
            reject(new DOMException('Aborted', 'AbortError'));
          }
        };
        abortController.signal.addEventListener('abort', onAbort, { once: true });
        invokeTool()
```

</details>

#### 缺口

- 未对各平台、工具及实际副作用执行停止测试
  **影响**：不能证明所有权限和取消覆盖
  **进一步探讨**：隔离环境分别检查文件、命令和外部请求的停止后状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、资源和使用条件是什么？

**研究主题**：效果与总成本、采用判断、缺陷与关键质疑

#### 完整回答

客户端需要运行时、模型提供方、授权的工作区和所需工具；模型请求会把选择的上下文传给所配置的适配器，不能因为本地桌面运行就推断所有数据留在本机。最大轮数缺省为 200，显式非正值表示无限；即使设为有限值，也不是总 token、费用或时间上限。Electron 密钥存储检查系统加密可用性，不可用时拒绝存储而不静默写明文；这不证明其他数据或日志均加密。模型、网络、工具和人工验收成本未知。能检查实际操作和预算的用户可在 standard 模式及无敏感副本上从小任务试起；超出人工阈值、异常扩权或停止后状态不明时暂停并先核对文件或外部结果。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/agent/loopGuards.ts:155-173](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/agent/loopGuards.ts#L155-L173)

默认轮数与显式非正无限。

<details>
<summary>查看原文（19行）</summary>

```text
export const DEFAULT_MAX_TURNS = 200;

/**
 * Resolve the per-run turn cap. Shared by agentLoop and subagentLoop. Explicit
 * settings stay authoritative (skill > agent definition > global setting); only
 * when none is set do we fall back to {@link DEFAULT_MAX_TURNS} — never
 * unlimited-by-default. An explicit non-positive setting (`<= 0`) is the opt-in
 * escape hatch for truly unlimited turns (returns `Infinity`), preserving the
 * capability the old `undefined` default used to give implicitly.
 */
export function resolveMaxTurns(params: {
  skillMaxTurns?: number;
  definitionMaxTurns?: number;
  globalMaxTurns?: number;
}): number {
  const { skillMaxTurns, definitionMaxTurns, globalMaxTurns } = params;
  const explicit = skillMaxTurns ?? definitionMaxTurns ?? globalMaxTurns;
  if (explicit === undefined) return DEFAULT_MAX_TURNS;
  return explicit > 0 ? explicit : Infinity;
```

</details>

**依据 2 · 源码核查**：[src/core/agent/agentLoop.ts:2323-2326](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/agent/agentLoop.ts#L2323-L2326)

上下文传到所选模型 adapter。

```text
          primaryBudgetGateLogged = true;
        }
        return adapter.chat(providerBudgetResult.messages, chatOptions, eventHandler);
      };
```

**依据 3 · 源码核查**：[electron/secretStore.cjs:141-153](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/electron/secretStore.cjs#L141-L153)

不可用加密时的降级。

<details>
<summary>查看原文（13行）</summary>

```text
  try {
    encryptionAvailable = safeStorage.isEncryptionAvailable() && safeStorage.getSelectedStorageBackend?.() !== 'basic_text';
  } catch (err) {
    encryptionAvailable = false;
    warn('safeStorage.isEncryptionAvailable() threw', errMsg(err));
  }

  if (!encryptionAvailable) {
    warn(
      'safeStorage encryption is NOT available on this system — operating in degraded mode: ' +
        'secret_get returns null, secret_set throws (surfaced to the renderer) rather than ' +
        'silently storing plaintext.'
    );
```

</details>

**依据 4 · 源码核查**：[electron/secretStore.cjs:186-200](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/electron/secretStore.cjs#L186-L200)

拒绝不安全密钥写入并持久化加密内容。

<details>
<summary>查看原文（15行）</summary>

```text
function set(key, value) {
  if (!encryptionAvailable) {
    // A write silently dropped would look like a successful save (the key just
    // "didn't stick"). Surface it to the renderer instead.
    const msg = 'safeStorage encryption unavailable — cannot store secret securely';
    warn(msg);
    throw new Error(msg);
  }
  // No swallowing catch: an encrypt or persist (durability) failure must reject
  // secret_set so the user learns the key wasn't saved, rather than seeing a
  // fake success and finding it gone after restart (matches the Tauri backend).
  const buf = safeStorage.encryptString(String(value));
  store.set(key, buf.toString('base64'));
  failedKeys.delete(key);
  persist();
```

</details>

**依据 5 · 源码核查**：[src/core/permissions/permissionMode.ts:104-115](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/permissions/permissionMode.ts#L104-L115)

standard 对命令与文件的决策。

<details>
<summary>查看原文（12行）</summary>

```text
/** standard: workspace-internal is free; escalations ask the user. Matches the old `default` behavior. */
const standardStrategy: PermissionStrategy = {
  decideCommand(info, readOnly, boundary) {
    if (readOnly) return 'allow';
    if (isRiskyCommand(info.level)) return 'confirm';
    // Safe content but writing outside the workspace → escalate.
    if (boundary === 'outside') return 'confirm';
    return 'allow';
  },
  decideFileAccess(_capability, needsPermission) {
    // needsPermission === true means the path isn't in an authorized working dir yet.
    return needsPermission ? 'confirm' : 'allow';
```

</details>

#### 缺口

- 未检查全部日志、平台沙箱和提供商策略
  **影响**：无法判断完整数据保护、成本或平台兼容
  **进一步探讨**：固定提供商与平台核对实际网络、设置、权限和成本记录。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些改进能通过对照验证或否定？

**研究主题**：新假设与验证

#### 完整回答

可探索让每项已发出的副作用记录可核对的操作 ID、完成或结果未知状态，并在用户重试前展示外部回读结果。现有循环已经记录执行与检查点，停止也有 abort 协议；新增的是业务成果与在途动作的可核验收据，不是声称目前完全没有记录。对照模拟提交后断线和停止时在途任务，测量误判完成、重复操作和恢复时间；若现有日志足以辨别或收据维护成本过高，则否定。它尚未实现或实测。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/agent/agentLoop.ts:2706-2725](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/agent/agentLoop.ts#L2706-L2725)

工具执行前写检查点。

<details>
<summary>查看原文（20行）</summary>

```text
      // If there are tool calls, execute them via toolExecutor
      if (collectedToolCalls.length > 0) {
        const confirmCb = options?.commandConfirmCallback ?? requestCommandConfirmation;
        const filePermCb = options?.filePermissionCallback ?? requestFilePermission;

        // Move the crash checkpoint from "waiting on the model" to "running
        // tools" before any side effect starts, so recovery can tell which of
        // the two a crash interrupted. App.tsx already renders the
        // 'tool_executing' wording; until now nothing ever wrote that status.
        import('../session/checkpoint').then(({ writeCheckpoint }) => {
          writeCheckpoint({
            conversationId,
            loopId,
            turnCount,
            lastMessageId: assistantMsgId,
            status: 'tool_executing',
            currentTool: collectedToolCalls.map((tc) => tc.name).join(', '),
            timestamp: Date.now(),
          });
        }).catch(() => {});
```

</details>

**依据 2 · 源码核查**：[src/core/agent/agentLoop.ts:2777-2785](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/src/core/agent/agentLoop.ts#L2777-L2785)

持久化工具执行状态的设计路径。

```text
        semanticLoopReason = detectSemanticToolLoop(semanticToolHistory);

        // ★ Persist this turn's full message state (including completed tool calls)
        // to disk RIGHT NOW. We must use replaceMessageById (not updateLastMessage)
        // because by the time the next turn's addMessage races with our write, the
        // "last line" may already have shifted to the next turn's placeholder, and
        // updateLastMessage would either clobber the new placeholder or update the
        // wrong line. Awaiting here adds a few ms of latency but guarantees disk
        // state matches in-memory state before the loop continues.
```

**依据 3 · 源码核查**：[sidecar/src/agentLoopHost.ts:1377-1383](https://github.com/PM-Shawn/Abu-Cowork/blob/7e6d17126241cd6d89b1df0f60e7f98c144377ad/sidecar/src/agentLoopHost.ts#L1377-L1383)

停止请求与回执语义。

```text
/**
 * `{ runId }` — abort THIS run's conversation-scoped AbortController and
 * return an acknowledgement. Flushing before the ACK creates an ordering
 * barrier: every frame emitted before Stop is already on stdout before the
 * shell receives this response and performs its own idempotent finalization.
 * Unknown/already-finished runIds are still safe and idempotent.
 */
```

#### 缺口

- 业务收据方案尚无实现和试验
  **影响**：不能宣称可减少重复或恢复工作量
  **进一步探讨**：用隔离副作用及断线场景对照误完成、重复和人工耗时。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
