# Abu Cowork

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[fddf2d5](https://github.com/PM-Shawn/Abu-Cowork/tree/fddf2d5a823a15e20e867686441ca5396ed5550a)

<!-- BEGIN META -->
[![GitHub ★ 408](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=408&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PM-Shawn/Abu-Cowork) [![npm 30d 204](https://img.shields.io/static/v1?label=npm+30d&message=204&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/abu) [![最新发布 2013-04-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2013-04-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/abu)
<!-- END META -->

> **功能**：独立 AI 桌面办公客户端，以多轮模型和本机工具执行文件、命令及报告任务，提供审批、运行记录和可选沙箱。

> **亮点**：真实自主工具闭环及sidecar/审批/结果持久化接线，支持用户检查过程；未证明替代人工或净节时。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：显式非正maxTurns可无限，轮数非总费用上限；Stop可先detach不等副作用已停，平台沙箱/代理需实况，远端模型接收上下文，记录非业务验收。见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 是自主Agent还是流程/DSH插件，面向谁/替代谁？](#detail-section-11)
  - [Q02 · 模型如何连续选工具、结果回流与停止/预算？](#detail-section-12)
  - [Q03 · 审批/模式/浏览器与shell沙箱边界在哪？](#detail-section-13)
  - [Q04 · 本地优先/密钥/持久化与网络声明支持到哪？](#detail-section-14)
  - [Q05 · 办公任务的全周期成本/采用/退出？](#detail-section-15)
  - [Q06 · 可证伪生产插件方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为希望自然语言驱动本机办公任务的人，提供模型连续决策、工具执行和成果界面。见[Q01](#research-q01)。

聊天给建议再人工操作或固定脚本/现桌面Agent；增量在执行/授权/办公集成，模型和OS不是本产品原创。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自主执行 | 模型选工具→结果回流继续 | 真Agent，最终成果仍验收 |
| 文件/命令 | 本机办公产物 | 审批/OS条件分层，Stop非全副作用回滚 |
| 权限/隔离 | 模式/路径/平台限制 | Win/mac不同，proxy port与豁免另核 |
| 密钥/记录 | safeStorage及运行/结果线索 | 非所有数据加密/绝对离线或exactly-once |
| 可选外部工具 | MCP/浏览器/后台任务 | 本轮只核部分边界，不能泛推全部安全 |

**流程与依赖**

Electron/sidecar/native/模型与权限/副本为底座，浏览器/MCP按任务另需；表见[Q05](#research-q05)。

standard副本、读回有效正有限轮数与人工资源停止线→只读/单写验成果→中断核后台/请求，未知先停；步骤见[Q05](#research-q05)。

**效果与成本**

模型/工具与复核恢复成本未知；默认200轮、非正配置可无限，正有限轮数仍非总费用或时间上限，须观察实际用量；表见[Q05](#research-q05)。

真实执行/权限/记录有据，办公正确率/净时间、全工具保密和恢复效果未测；表见[Q05](#research-q05)。

> **思考**：显式非正maxTurns可无限，轮数非总费用上限；Stop可先detach不等副作用已停，平台沙箱/代理需实况，远端模型接收上下文，记录非业务验收。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：真实自主工具闭环及sidecar/审批/结果持久化接线，支持用户检查过程；未证明替代人工或净节时。见[Q01](#research-q01)、[Q02](#research-q02)。

sidecar同审批、allow后abort/文件再核与secret持久错误可见可借鉴；平台profile、前台detach与记录持久边界须共同传给业务终态。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

显式非正maxTurns可无限，轮数非总费用上限；Stop可先detach不等副作用已停，平台沙箱/代理需实况，远端模型接收上下文，记录非业务验收。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

能验产物、读回有效正有限轮数并观察资源的人可standard副本小样；超人工阈值、越界或Stop后状态未知时停扩权/重试，核真实文件/请求再恢复。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

新项无旧baseline可复核。固定源码证明自主执行Agent/独立client，定向审核心循环/审批/commandHost/秘密存储；非完整安全审计且未运行。限读回有效正有限轮数、可观察用量的副本办公小任务试用；默认200但显式非正数无限，轮数不封顶总费用，不把本地/沙箱/完成灯当全部业务保证。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、electron/main.cjs、src/components/chat/ChatView.tsx、src/core/agent/agentLoopRunner.ts、sidecar/src/agentLoopHost.ts、src/core/agent/agentLoop.ts、src/core/agent/toolExecutor.ts、src/core/tools/registry.ts、src/core/permissions/permissionMode.ts、src/core/tools/definitions/commandTools.ts、src/core/sandbox/config.ts、electron/commandHost.cjs、electron/sandbox-launcher/src/main.rs、electron/secretStore.cjs、src/core/llm/openai-compatible.ts、src/core/session/checkpoint.ts、src/core/agent/loopGuards.ts、src/stores/settingsStore.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：无旧稿/旧findings/依赖可读。当前核package/Electron主入口和ChatView→dispatch→sidecar共用loop、轮数/停止、toolExecutor/registry部分审批/结果路径、模式、commandTools/Host Seatbelt/proxy和Windows token/Job、Electron secretStore与OpenAI adapter/checkpoint。未全审4k行runner、全部registry、所有浏览器/CU/插件/MCP、后台/IM/多Agent或全部日志/迁移，不执行目标。
- 下一步：后续一次性OS用户/副本测真实文件报告、审批等待/执行中Stop、proxy失败/平台边界、密钥保存与模型/工具网络、重启恢复，比较手工总成本。 先读回Skill/Agent/global的有效正有限轮数；逐轮核模型请求及工具资源，用人工时间/费用阈值而非轮数替代总费用限制。

**分析版本**

- **仓库**：[PM-Shawn/Abu-Cowork](https://github.com/PM-Shawn/Abu-Cowork)
- **版本号**：0.60.1（[固定提交 fddf2d5](https://github.com/PM-Shawn/Abu-Cowork/tree/fddf2d5a823a15e20e867686441ca5396ed5550a)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是已有run/快照上新增成果验收与未知在途收据，比较误完成/重复动作/恢复工时，现机制已足够则否定。见[Q06](#research-q06)。

后续一次性OS用户/副本测真实文件报告、审批等待/执行中Stop、proxy失败/平台边界、密钥保存与模型/工具网络、重启恢复，比较手工总成本。 先读回Skill/Agent/global的有效正有限轮数；逐轮核模型请求及工具资源，用人工时间/费用阈值而非轮数替代总费用限制。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 152 | 30076 | — | — | 299366 |
| .mjs | source | 44 | 11327 | 9236 | 1414 | — |
| .ts | test | 1032 | 247170 | 199559 | 21108 | — |
| .ts | source | 945 | 199321 | 134339 | 51137 | — |
| .js | source | 14 | 6946 | 6074 | 634 | — |
| .md | example | 9 | 208 | — | — | 2071 |
| .cjs | source | 159 | 48331 | 36074 | 9305 | — |
| .cjs | test | 101 | 31433 | 26910 | 2364 | — |
| .tsx | test | 307 | 107132 | 88590 | 5247 | — |
| .tsx | source | 301 | 65507 | 53007 | 9293 | — |
| .mts | source | 1 | 123 | 78 | 32 | — |
| .mjs | test | 20 | 4327 | 3930 | 137 | — |
| .ts | example | 3 | 356 | 265 | 63 | — |

</details>

**活跃度**

[![Issue 未关闭 46](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=46&color=737b86&logo=github)](https://github.com/PM-Shawn/Abu-Cowork/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/PM-Shawn/Abu-Cowork/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/PM-Shawn/Abu-Cowork/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立桌面Agent的真实执行/授权/结果闭环与跨平台、网络和中断边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 是自主Agent还是流程/DSH插件，面向谁/替代谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Abu是独立本地桌面Agent客户端，package名abu 0.60.1，main electron/main.cjs，不是可装进DSH的插件。本项由另一awesome列表引用；本轮INPUT有核定仓库身份/固定commit，changes unknown不推断身份失败。ASSIGNMENTS给baseline路径实际不存在，catalog无旧稿/findings/依赖可复核，按新项源码研究，不继承空结论。

面向想自然语言驱动本机文件/命令/办公产物的个人：相比纯聊天给步骤再人工复制、或手写固定自动化脚本，用户提交目标后客户端能多轮模型决策、真实工具调用和读取结果再决定，属于自主工具执行Agent。不是仅预设节点的编排，也不是“29技能”数量就证明办公成功。

ChatView实际调用runAgentLoopDispatched；Electron桌面运行等待sidecar，无法就绪会显式失败，不静默回renderer；预览/测试环境才in-process。sidecar导入同runAgentLoop，执行循环不是另一个只返回计划的mock。集成增量是模型/本地执行/授权/版本记录/办公界面接线，底层模型、Electron、MCP/OS能力继承，不把整产品能力当DSH生态原创。

合格任务例是整理副本目录并产出可读报告，原件保留，内容/路径可人工核对，失败能说明哪些文件/外部动作已发生。文字“完成”、declared report_plan、工具返回成功都不替最终产物验收；日程、IM、浏览器/桌面与多Agent只有局部入口确认，未全审这些产品面。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-8](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/package.json#L1-L8)

独立客户端身份/主入口。

```text
{
  "name": "abu",
  "private": false,
  "license": "Apache-2.0",
  "version": "0.60.1",
  "description": "Abu - AI Desktop Office Assistant",
  "type": "module",
  "main": "electron/main.cjs",
```

**依据 2 · 源码核查**：[electron/main.cjs:1-20](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/main.cjs#L1-L20)

Electron/frontend/sidecar桥与进程归属。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Electron main process — Phase 2 dev shell.
 *
 * Loads the real Abu frontend (built with a relative base into
 * dist-electron-spike/, falling back to the slice-1 placeholder if that build
 * is absent) behind the production Tauri-IPC bridge (preload.cjs + tauriHost.cjs,
 * which now includes the generic mcp_* process bridge). Launch with
 * `npm run electron:dev`.
 *
 * Sidecar ownership (mcp 收敛): main does NOT spawn/supervise the agent sidecar
 * itself — the FRONTEND's own sidecarManager drives it via mcp_spawn/mcp_write/
 * mcp_kill (routed to electron/mcpBridge.cjs), exactly as it did on Tauri. This
 * avoids two supervisors fighting over one sidecar. The standalone
 * SidecarSupervisor (electron/sidecarSupervisor.cjs) + `npm run electron:test`
 * remain as a tested component but are no longer auto-started here.
 * No-orphan on quit is handled by mcpBridge's process 'exit' guard.
 *
 * Security posture: contextIsolation on, nodeIntegration off, sandbox ON.
 * A sandboxed preload can still require('electron') for ipcRenderer/contextBridge
 * (only Node built-ins like fs/path/os are withheld), and preload.cjs uses
```

</details>

**依据 3 · 源码核查**：[src/components/chat/ChatView.tsx:1000-1012](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/components/chat/ChatView.tsx#L1000-L1012)

用户提交到真实dispatch。

<details>
<summary>查看原文（13行）</summary>

```text
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
    } catch (error) {
      if (firstMessageOfRef.current === convId) firstMessageOfRef.current = null;
```

</details>

**依据 4 · 源码核查**：[src/core/agent/agentLoopRunner.ts:3497-3520](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoopRunner.ts#L3497-L3520)

in-process只为预览/测试。

<details>
<summary>查看原文（24行）</summary>

```text
  });
  try {
  if (inProcessEnvironment) {
    // Environment choice (web preview / unit tests): there is no desktop
    // process bridge, so the loop runs in this renderer. Not a failure
    // fallback — Electron never reaches this branch (#549).
    await ensureBuiltinBrowserRuntime();
    // The loop registers its own run, so this venue begins the record last
    // before handing over to it.
    await beginTurnRecord();
    let localUserMessageId: string | undefined;
    try {
      const result = await runAgentLoop(
        conversationId,
        userMessage,
        rendererRuntimeOptions({ ...options, ...(teamTask ? { teamTaskId: teamTask.taskId } : {}) }, (messageId) => {
          ownership.messageTaken = true;
          localUserMessageId = messageId;
          if (messageId) {
            useChatStore.getState().updateUserMessageRun(conversationId, messageId, {
              state: 'running',
            });
          }
        }),
```

</details>

**依据 5 · 源码核查**：[src/core/agent/agentLoopRunner.ts:3644-3678](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoopRunner.ts#L3644-L3678)

桌面sidecar等待/可见失败。

<details>
<summary>查看原文（35行）</summary>

```text
  // built for it. A cold or restarting sidecar is waited for (≤60s, under the
  // turn's own 「思考中」 row); a dead one fails this send visibly instead of
  // silently running here. `allowRestart` is spent only for a human-initiated
  // send — see the helper.
  try {
    await waitForSidecarVenue({
      signal: shellAbortController.signal,
      allowRestart: mayRestartSidecarForSend(options),
    });
  } catch (err) {
    if (shellAbortController.signal.aborted) {
      return finalizePreDispatchInterruptedRun(
        conversationId,
        clientMessageId,
        runId,
        'waiting_for_sidecar',
        runtimeStartedAt,
        shellAbortController.signal,
      );
    }
    return finalizePreAcceptFailure({
      conversationId,
      clientMessageId,
      runId,
      runtimeStartedAt,
      kind: 'sidecar_unavailable',
      displayMessage: getI18n().chat.sidecarNotReady,
      stage: 'sidecar_unavailable',
      errorType: err instanceof SidecarUnavailableError ? `sidecar_${err.reason}` : runtimeErrorType(err),
      userMessage,
      images: options?.images,
    });
  }

  traceRuntimeEvent('renderer.agent_params_build_started', {
```

</details>

**依据 6 · 源码核查**：[sidecar/src/agentLoopHost.ts:57-62](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/sidecar/src/agentLoopHost.ts#L57-L62)

导入同主循环。

```text
import type { ToolInvoker } from '@/core/agent/ports/toolInvoker';
import type { CapsPort } from '@/core/agent/ports/capsPort';
import type { PlanModeState } from '@/core/agent/planMode';
import { runAgentLoop, type AgentLoopOptions, type AgentLoopResult } from '@/core/agent/agentLoop';
import { isRunPermissionCeiling } from '@/core/permissions/runPermissionCeiling';
import {
```

**依据 7 · 源码核查**：[sidecar/src/agentLoopHost.ts:1229-1240](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/sidecar/src/agentLoopHost.ts#L1229-L1240)

调用同runAgentLoop。

<details>
<summary>查看原文（12行）</summary>

```text
        // explicit conversationId from the loop still wins.
        traceSidecarRuntimeEvent(`sidecar.${event}`, { conversationId, ...attributes });
      },
    };
    const result: AgentLoopResult = await agentRunContext.run(runCtx, () =>
      runAgentLoop(conversationId, params.userMessage, options),
    );
    traceSidecarRuntimeEvent('sidecar.agent_run_completed', {
      runId,
      conversationId,
      stage: 'completed',
      outcome: result.reason,
```

</details>

#### 缺口

- 代表办公任务正确率/净人工、持续需求无实测
  **影响**：只确认真执行循环，不能把产品功能多等同可代办成功
  **进一步探讨**：隔离副本做固定文件整理/报告任务，对比聊天+手工和现脚本的错误/返工/耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型如何连续选工具、结果回流与停止/预算？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

主循环while每轮先检查abort，再递增turnCount并写llm_calling checkpoint，解析当轮工具/上下文预算后adapter.chat。模型收集到tool calls则写tool_executing提示，executeToolBatch携conversation/loop/abort/allowedTools/审批和文件回调执行。不是生成一段命令让人自行跑；toolExecutor实际invoke executeAnyTool，工具结果updateToolCall，OpenAI消息转换再以role:tool和tool_call_id回传，下一轮可据观察改动作。实际继续标志先由模型done事件决定：stopReason为tool_use且有调用时continueLoop=true；截断但有可解析调用也可继续。batchResult不是置true的来源，requiresUserRecovery反而把它置false，observations参与语义循环检测；无进展等分支还能停止。while下一轮重新读会话messages并去掉新建空assistant，构建boundaryView/预算后的preparedMessages，再由withRetry(chatFn)调用adapter.chat，闭合真实结果→下一次模型请求。

执行前有run级allowlist、参数约束/计划闸和审批链，registry后置finalize后再throwIfAborted、files.assertCurrent，避免等待审批期间Stop后仍启动新动作；sidecar本地工具也先问shell approval.check，明确deny不转另一条通道再执行，allow消费前再检查abort。真实执行与授权拥有者分开是值得复用的机制，不代表每种MCP/HTTP副作用都可事务回滚。

maxTurns默认200轮，但并非任何配置都有限。真正的resolveMaxTurns按Skill→Agent definition→global的空值优先级取explicit；全部未设置才回退200，显式非正数返回Infinity。settingsStore也明确约定<=0为不限制，setter直接保存；不能采信agentLoop调用处never unlimited注释来覆盖实际函数。正值原样返回，helper没有Number.isFinite或整数校验；试用应显式选正有限整数并核对覆盖后的有效值。正有限配置下，turnCount>maxTurns会返回max_turns，不当completed；Infinity时这条轮数比较不会停止循环。无进展、等待用户、错误和abort有独立exitReason，但不能证明持续有效工具调用必在有限轮数内结束。轮数不是总tokens、时间或现金上限，单轮工具/重试也另耗资源。provider请求成功只是provider健康，业务可能停在no_progress或需用户恢复。无工具调用的截断恢复有次数预算；带有效工具调用的截断可继续且仍取决于有效maxTurns，坏调用重写有预算，防“只说没做”也有可选nudge，不保证所有任务最终完成。

前台Stop采用响应式detach：toolExecutor可在abort时先reject等待，但已经开始的invoke promise未必已结束；scoped/background run反而await原调用避免放掉authority scope时底层操作还活着。应把停止下一轮、取消具体进程/请求、撤销已完成写入分开，不能从UI idle推没有外部后果。工具输出/快照、checkpoint是记录/恢复线索，非全局业务事务。

实际关键原文（固定提交）：

```ts
// loopGuards.ts:155、171–173
export const DEFAULT_MAX_TURNS = 200;
const explicit = skillMaxTurns ?? definitionMaxTurns ?? globalMaxTurns;
if (explicit === undefined) return DEFAULT_MAX_TURNS;
return explicit > 0 ? explicit : Infinity;
```

settingsStore.ts:230的约定为 `undefined = 用默认上界 (resolveMaxTurns: DEFAULT_MAX_TURNS); <=0 = 不限制(显式 opt-in)`；1631直接 `setAgentMaxTurns: (agentMaxTurns) => set({ agentMaxTurns })`。agentLoop.ts:2483–2484为 `if (event.stopReason === 'tool_use' && collectedToolCalls.length > 0) { continueLoop = true;`；2753–2755在 `batchResult.requiresUserRecovery` 时将它置false。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/agent/agentLoop.ts:1719-1755](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L1719-L1755)

轮询/abort及checkpoint。

<details>
<summary>查看原文（37行）</summary>

```text
  while (continueLoop) {
    // Check if cancelled before starting new turn
    if (abortController.signal.aborted) {
      chatDelta.cancelStreaming(conversationId);
      abortRegistry.clearAbortController(conversationId);
      executionPort.cancelExecution(execution.id);
      deactivateAllSkills(conversationId, loopId);
      chatDelta.setConversationStatus(conversationId, 'idle');
      // Report the cancellation to callers — without this an abort between turns
      // falls through to the default 'completed', so scheduler/trigger would treat
      // a cancelled run as a success and push its partial output downstream.
      exitReason = 'aborted';
      break;
    }

    continueLoop = false;
    turnCount++;

    logger.info('Turn started', { turnCount, maxTurns });

    // Write checkpoint for crash recovery — if app crashes during this turn,
    // we can detect and offer to resume on next launch.
    import('../session/checkpoint').then(({ writeCheckpoint }) => {
      writeCheckpoint({
        conversationId,
        loopId,
        turnCount,
        lastMessageId: getConversationReader().getConversation(conversationId)?.messages.slice(-1)[0]?.id ?? '',
        status: 'llm_calling',
        timestamp: Date.now(),
      });
    }).catch(() => {});

    // Only internal system wake-ups may join the current run. User-authored
    // follow-ups stay in the shell queue until this run terminates, then start
    // as independent runs with new loopIds (agentLoopRunner.ts).
    const queuedInputs = drainSystemQueuedInputs(conversationId);
```

</details>

**依据 2 · 源码核查**：[src/core/agent/agentLoop.ts:1667-1677](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L1667-L1677)

轮数优先级。

<details>
<summary>查看原文（11行）</summary>

```text
  // maxTurns priority: skill > agent definition > global setting > sane default
  // (never unlimited — see resolveMaxTurns). Headless runs get a tighter cap.
  const globalMaxTurns = settingsReader.getSnapshot().agentMaxTurns;
  const maxTurns = resolveMaxTurns({
    skillMaxTurns: route.skill?.maxTurns,
    definitionMaxTurns: route.definition?.maxTurns,
    globalMaxTurns,
  });
  let turnCount = 0;
  // No-progress guard (mirrors subagentLoop): abort a model that emits only
  // unparseable tool calls for MAX_NO_PROGRESS_TURNS in a row — without it agentLoop
```

</details>

**依据 3 · 源码核查**：[src/core/agent/agentLoop.ts:1776-1823](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L1776-L1823)

max_turns非完成。

<details>
<summary>查看原文（48行）</summary>

```text
    if (turnCount > maxTurns) {
      // The cap is reported as a marker card, not as a sentence the assistant
      // "said": the two things the user wants here are to continue and to raise
      // the cap, and a text message could only ask them to type the first and
      // go hunting for the second. `createMaxTurnsNoticeMessage` explains why
      // the marker is role `system` without `isSystem` (visible, not in context).
      chatDelta.addMessage(
        conversationId,
        createMaxTurnsNoticeMessage({
          id: generateId(),
          timestamp: Date.now(),
          limit: maxTurns,
          // Read BEFORE the marker is appended — the streak counts the notices
          // already in the transcript, not this one.
          streak: deriveMaxTurnsStreak(
            getConversationReader().getConversation(conversationId)?.messages ?? [],
          ),
        }),
      );
      abortRegistry.clearAbortController(conversationId);
      eventRouter.route({ type: 'done', loopId, reason: 'max_turns' });
      persistExecutionSnapshot(conversationId, loopId);
      // NOT 'completed': the cap is an INCOMPLETE ending — `isIncompleteReason`
      // and the scheduler already treat it that way, and the green "done" dot
      // plus "已完成 N 轮执行" told the user (and a team leader reading the
      // conversation) the opposite. `setAgentStatus('idle')` first because
      // clearing the per-conversation agent state was a side effect of the
      // terminal 'completed' status; idle is not terminal, so the activity
      // indicator has to be retired explicitly here.
      chatDelta.setAgentStatus(conversationId, 'idle');
      chatDelta.setConversationStatus(conversationId, 'idle');
      // Hitting the turn cap means every LLM call succeeded (a failed call throws
      // to the catch) → provider is healthy; record it so a prior config-failure
      // is cleared even when the run ends via the cap rather than end_turn.
      recordProviderCallOutcome(getActiveProvider(settingsForModel)?.id, { ok: true, at: Date.now() });
      // C: report the cap to callers (scheduler/trigger) instead of 'completed'.
      exitReason = 'max_turns';
      // Same terminal cleanup as the normal end_turn path — now that the cap is
      // always finite this break is routinely reached, so skipping these would
      // leak an active skill into the next message, leave a phantom crash-recovery
      // checkpoint, and keep the Computer-Use overlay / AX session alive.
      deactivateAllSkills(conversationId, loopId);
      // Pass conversationId so a stale/late deactivate can never clobber a
      // DIFFERENT conversation's now-active CU session (ownership guard in
      // computerUseStatus.ts — see that module's doc for the contamination
      // bug this closes).
      import('./computerUseStatus').then(({ setComputerUseActive }) => {
        setComputerUseActive(false, conversationId);
```

</details>

**依据 4 · 源码核查**：[src/core/agent/agentLoop.ts:2318-2328](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L2318-L2328)

实际adapter.chat。

<details>
<summary>查看原文（11行）</summary>

```text
            safetyMarginTokens: providerBudgetResult.safetyMarginTokens,
            strategy: initialBudgetResult.strategy === 'unchanged'
              ? providerBudgetResult.strategy
              : initialBudgetResult.strategy,
          });
          primaryBudgetGateLogged = true;
        }
        return adapter.chat(providerBudgetResult.messages, chatOptions, eventHandler);
      };

      // Drive crash-protection flushes from elapsed time, not provider events.
```

</details>

**依据 5 · 源码核查**：[src/core/agent/agentLoop.ts:2705-2778](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L2705-L2778)

工具执行与恢复标记。

<details>
<summary>查看原文（74行）</summary>

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
        if (batchResult.requiresUserRecovery) {
          awaitingUserRecovery = true;
          continueLoop = false;
        }
        collectedToolCalls.forEach((toolCall, index) => {
          const observation = batchResult.observations[index];
          if (
            toolCall.name === TOOL_NAMES.TOOL_SEARCH
            && observation
            && !observation.error
          ) {
            promoteSearchedDeferredTools(
              toolCall.input,
              deferredTools,
              conversationId,
            );
          }
        });
        semanticToolHistory.push(
          ...batchResult.observations.map(minimizeToolLoopObservation),
        );
        if (semanticToolHistory.length > SEMANTIC_TOOL_LOOP_WINDOW) {
          semanticToolHistory.splice(0, semanticToolHistory.length - SEMANTIC_TOOL_LOOP_WINDOW);
        }
        semanticLoopReason = detectSemanticToolLoop(semanticToolHistory);

```

</details>

**依据 6 · 源码核查**：[src/core/agent/toolExecutor.ts:219-250](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/toolExecutor.ts#L219-L250)

allowlist/abort边界。

<details>
<summary>查看原文（32行）</summary>

```text
    if (allowedTools.length > 0 && !allowedTools.some((pattern) => matchesToolPattern(name, pattern, input))) {
      return `Error: tool "${name}" is not allowed for this agent run`;
    }
    if (blockedTools.some((pattern) => matchesToolName(name, pattern))) {
      return `Error: tool "${name}" is blocked for this agent run`;
    }
    return null;
  };
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
    }

    // Emit preToolCall hook (can block or modify input)
    const preEvent = await emitHook({
      type: 'preToolCall' as const,
      timestamp: Date.now(),
      conversationId,
      toolName: tc.name,
      toolInput: tc.input,
      abortSignal: abortController.signal,
```

</details>

**依据 7 · 源码核查**：[src/core/agent/toolExecutor.ts:304-345](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/toolExecutor.ts#L304-L345)

真实invoke与前台detach/scoped join。

<details>
<summary>查看原文（42行）</summary>

```text
      const invokeTool = () => toolInvoker.executeAnyTool(tc.name, effectiveInput, confirmCb, filePermCb, {
        ...toolContext,
        toolCallId: tc.id,
        executionStepId: params.toolCallToStepId.get(tc.id)
          ?? getExecutionPort().getExecutionByLoopId(loopId)?.steps.find((step) => step.toolCallId === tc.id)?.id,
        assistantMessageId: assistantMsgId,
        abortSignal: abortController.signal,
        reportMetadata: checkpointMetadata,
      });

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
          .then((result) => {
            if (!settled) {
              settled = true;
              abortController.signal.removeEventListener('abort', onAbort);
              resolve(result);
            }
          })
          .catch((err) => {
            if (!settled) {
              settled = true;
```

</details>

**依据 8 · 源码核查**：[src/core/agent/toolExecutor.ts:688-710](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/toolExecutor.ts#L688-L710)

结果写回会话/执行事件。

<details>
<summary>查看原文（23行）</summary>

```text

      chatDelta.updateToolCall(
        conversationId,
        assistantMsgId,
        id,
        storedResult,
        resultContent,
        error,
        hideScreenshot,
        metadata,
      );

      // Update TaskExecutionStore via EventRouter
      const stepId = toolCallToStepId.get(id);
      if (stepId) {
        if (error) {
          eventRouter.route({ type: 'step-error', loopId, stepId, error: storedResult });
        } else {
          eventRouter.route({ type: 'step-end', loopId, stepId, result: storedResult, resultContent });
        }
      }
    } else {
      // Use index to find the corresponding tool call
```

</details>

**依据 9 · 源码核查**：[src/core/llm/openai-compatible.ts:294-307](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/llm/openai-compatible.ts#L294-L307)

tool结果带id回模型。

<details>
<summary>查看原文（14行）</summary>

```text
        result.push(assistantMsg);

        // Add tool results — normalizeMessages guarantees every tool_use has a result
        // OpenAI only supports images in role:"user", not in role:"tool"
        const pendingImages: OpenAIContentPart[] = [];
        for (const tc of turn.toolCalls) {
          result.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: tc.result,
          });
          // Collect images for a follow-up user message
          for (const img of tc.resultImages) {
            pendingImages.push({
```

</details>

**依据 10 · 源码核查**：[src/core/tools/registry.ts:2638-2663](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/tools/registry.ts#L2638-L2663)

审批后abort/文件状态再核。

<details>
<summary>查看原文（26行）</summary>

```text
  let approval = await checkToolApproval(name, input, toolContext, onRequireConfirmation, onRequireFilePermission, true);
  initialApproval = approval;
  while (true) {
    const finalized = finalizeToolApproval(approval);
    if (finalized instanceof Promise) {
      approval = await finalized;
      continue;
    }
    approval = finalized;
    break;
  }
  if (approval.decision === 'deny') {
    return approval.reason ?? `Error: tool "${name}" was denied`;
  }
  // Approval may await AI review, a user confirmation, or file permission.
  // Stop can win during any of those awaits; never consume a stale allow by
  // starting a builtin/MCP side effect after the run crossed its abort fence.
  throwIfAborted();

  const files = filesForToolApproval(initialApproval);
  if (files) {
    await files.assertCurrent();
    toolContext = { ...toolContext, files };
  }

  const executionInput = approval.executionInput ?? (approval.executionPath && FILE_TOOL_PATH_MAP[name]
```

</details>

**依据 11 · 源码核查**：[sidecar/src/agentLoopHost.ts:526-569](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/sidecar/src/agentLoopHost.ts#L526-L569)

local deny终止、allow后再abort。

<details>
<summary>查看原文（44行）</summary>

```text
      // `approval.check` — this is what closes the P1-3d-1 enterprise-policy
      // gap (see checkLocalToolApproval's doc). Only a clean `'allow'`
      // proceeds to local execution.
      //
      // 🔴 P1-3d-4 fix — a plain `deny` MUST NOT fall back to `tool.invoke`.
      // The shell's `approval.check` already ran the FULL approval chain
      // (`checkToolApproval`, registry.ts) to a conclusion, including any
      // confirm/file-permission UI callback the user already answered.
      // Falling back to `tool.invoke` here would re-run that SAME chain a
      // second time — popping the SAME confirmation dialog twice for one
      // tool call (the P1-3d-3 double-popup bug this fixes). So a `'deny'`
      // is terminal: return its `reason` directly as the `ToolResult`,
      // exactly like the reverse path's own `executeAnyTool` does on a deny
      // (registry.ts: `return approval.reason ?? ...`) — never execute,
      // never retry. Only `'unavailable'` (transport failure, or a
      // malformed/unrecognized response — see `LocalApprovalOutcome`'s doc
      // for why that's NOT the same as an explicit deny) falls through to
      // the reverse `tool.invoke` path, which re-derives its own approval
      // decision (and any UI) independently and exactly once.
      const hostRoute = cache.some(tool => tool.name === name && tool.executionRoute === 'host');
      if (!hostRoute && hasLocalTool(name)) {
        const approval = await checkLocalToolApproval(runId, name, input, toWireToolContext(context as ToolExecutionContext | undefined));
        if (approval.decision === 'deny') {
          return approval.reason;
        }
        if (approval.decision === 'allow') {
          // Stop can win in the microtask gap after the shell's allow ACK is
          // received but before this local execute() begins. The shell's
          // post-approval barrier protects ACK creation; this second,
          // sidecar-local barrier protects ACK consumption.
          if (context?.abortSignal?.aborted) {
            const error = new Error('Tool execution aborted');
            error.name = 'AbortError';
            throw error;
          }
          try {
            const approvedInput = approval.executionInput ?? (approval.executionPath
              ? { ...input, path: approval.executionPath }
              : input);
            return await executeLocalTool(
              name,
              approvedInput,
              context as ToolExecutionContext | undefined,
            );
```

</details>

**依据 12 · 源码核查**：[src/core/agent/agentLoop.ts:3056-3070](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L3056-L3070)

业务停因和UI状态区别。

<details>
<summary>查看原文（15行）</summary>

```text
        // Mark conversation status — error if recovery exhausted, otherwise completed.
        // no_progress is a soft stop (visible marker, status completed) like maxTurns.
        if (awaitingUserRecovery) {
          exitReason = 'awaiting_user';
        } else if (maxTokensRecoveryExhausted) {
          exitReason = 'error';
          exitError = 'Max output tokens recovery exhausted';
        } else if (noProgressAborted || malformedToolCallGaveUp) {
          // 重写后操作仍然写坏：任务没有做成，按未完成交给调用方
          exitReason = 'no_progress';
        }
        chatDelta.setConversationStatus(
          conversationId,
          awaitingUserRecovery ? 'idle' : maxTokensRecoveryExhausted ? 'error' : 'completed',
        );
```

</details>

**依据 13 · 源码核查**：[src/core/agent/loopGuards.ts:155-174](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/loopGuards.ts#L155-L174)

真实上限定义：默认200、空值优先级、非正显式无限、正数原样返回。

<details>
<summary>查看原文（20行）</summary>

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
}
```

</details>

**依据 14 · 源码核查**：[src/stores/settingsStore.ts:230-230](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/stores/settingsStore.ts#L230-L230)

显式<=0不限制的存储约定。

```text
  agentMaxTurns?: number; // undefined = 用默认上界 (resolveMaxTurns: DEFAULT_MAX_TURNS); <=0 = 不限制(显式 opt-in)
```

**依据 15 · 源码核查**：[src/stores/settingsStore.ts:1630-1632](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/stores/settingsStore.ts#L1630-L1632)

setter不夹到正数。

```text
      setRightPanelCollapsed: (collapsed) => set({ rightPanelCollapsed: collapsed }),
      setAgentMaxTurns: (agentMaxTurns) => set({ agentMaxTurns }),
      setMaxOutputTokens: (maxOutputTokens) => set({ maxOutputTokens }),
```

**依据 16 · 源码核查**：[src/core/agent/agentLoop.ts:2480-2497](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L2480-L2497)

done先置继续，截断有效工具也可继续。

<details>
<summary>查看原文（18行）</summary>

```text
              // Track stop reason for max_tokens recovery
              lastStopReason = event.stopReason;
              // Continue if there are tool calls
              if (event.stopReason === 'tool_use' && collectedToolCalls.length > 0) {
                continueLoop = true;
                maxOutputTokensRecoveryCount = 0; // Reset on normal tool_use continuation
              } else if (shouldContinueTruncatedToolCalls(event.stopReason, collectedToolCalls)) {
                // Bug #4: max_tokens cut off the turn AFTER ≥1 well-formed tool call.
                // Executing them and sending results back IS real progress, so treat
                // this exactly like a tool_use continuation: continue and reset the
                // recovery counter. The counter is left at 0 (not incremented) because
                // it belongs to the no-tool-call text recovery path below — bumping it
                // on a productive turn would corrupt that path's 3-attempt budget. This
                // branch is bounded the same way a normal tool_use loop is (by maxTurns),
                // and shouldContinueTruncatedToolCalls refuses an all-malformed batch so
                // a broken model can't spin here.
                continueLoop = true;
                maxOutputTokensRecoveryCount = 0;
```

</details>

**依据 17 · 源码核查**：[src/core/agent/agentLoop.ts:1959-1965](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L1959-L1965)

下一轮重读带结果会话，去掉新空assistant。

```text
      );

      // Get current messages for this conversation
      const messages = getConversationReader().getConversation(conversationId)?.messages ?? [];
      // Exclude the last empty assistant message we just added. Re-read after
      // a compaction adds its divider.
      let historyMessages = messages.slice(0, -1);
```

**依据 18 · 源码核查**：[src/core/agent/agentLoop.ts:2060-2065](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L2060-L2065)

历史构成边界视图。

```text
      // What the model sees: the history as the last compaction left it. The
      // divider itself is never sent.
      let boundaryView = buildContextFromBoundary(historyMessages);
      const measurementContext = () => usageContext(effectiveModelId, effectiveSystemPrompt, tools, historyMessages);

      // Per-turn volatile context (todos, relevant memories, compression hint)
```

**依据 19 · 源码核查**：[src/core/agent/agentLoop.ts:2191-2203](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L2191-L2203)

上下文预算生成preparedMessages。

<details>
<summary>查看原文（13行）</summary>

```text
      // Step 2: Trim old screenshots dynamically based on context usage
      const usagePercent = getUsagePercent(measuredTokens, inputBudget);
      const trimmedMessages = trimOldScreenshots(boundaryView, usagePercent);

      // Step 3: Hard truncation as safety net
      const initialBudgetResult = enforceContextBudget(
        trimmedMessages,
        effectiveSystemPrompt,
        contextWindowSize,
        maxOutputTokens,
        toolTokens
      );
      let preparedMessages = initialBudgetResult.messages;
```

</details>

**依据 20 · 源码核查**：[src/core/agent/agentLoop.ts:2527-2533](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L2527-L2533)

真实withRetry调用chatFn。

```text
      // Execute with retry and context-too-long recovery
      try {
        await withRetry(
          chatFn,
          { maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 30000 },
          abortController.signal,
          (attempt, error, delayMs) => {
```

**依据 21 · 源码核查**：[src/core/agent/agentLoop.ts:2913-2930](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L2913-L2930)

语义重复/连续坏调用停止，不是通用无限配置硬限。

<details>
<summary>查看原文（18行）</summary>

```text
      let noProgressAborted = false;
      if (semanticLoopReason && !awaitingUserRecovery) {
        continueLoop = false;
        noProgressAborted = true;
        logger.warn('Semantic tool loop stopped', {
          conversationId,
          loopId,
          reason: semanticLoopReason,
          observationCount: semanticToolHistory.length,
        });
      } else if (allToolsUnparseable(collectedToolCalls)) {
        consecutiveNoProgress++;
        if (consecutiveNoProgress >= MAX_NO_PROGRESS_TURNS) {
          continueLoop = false;
          noProgressAborted = true;
        }
      } else {
        consecutiveNoProgress = 0;
```

</details>

#### 缺口

- Stop后各种外部操作是否已落地/可补偿及预算停止的真实用户理解未测
  **影响**：轮数可被显式设为无限；即便正有限轮数也非总费用/时间或业务回滚保证，不能承诺无人执行都安全
  **进一步探讨**：在隔离副本先读回有效正有限轮数，按正常多工具/坏调用/执行中Stop核实际模型请求、产物、仍跑进程及provider用量，设置人工时间/资源停止线。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审批/模式/浏览器与shell沙箱边界在哪？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

standard模式工作区普通动作可放行、危险或越界问人；smart把相应升级交reviewer；autonomous放宽普通命令/文件，但硬红线另层守。state-changing浏览器等非命令工具在三模式仍要求confirm，已有相应grant才复用。这是多层策略，不能把Full Autonomy读成不受任何约束，也不把AI review当等价人类同意。

commandTools为run_command选可信workspace/授权路径，默认30秒并将timeout夹1–300，调用run_shell_command。明确app-launcher候选可能豁免shell sandbox（Electron拒带未引用控制语法的简单绕过），cross-app AppleScript在Electron启sandbox时先阻；实际mac Seatbelt还deny osascript与appleevent-send。审批和OS限制是不同层，用户授权/关闭保护会改变边界。

当前Electron后端比README“网络只env”更具体：mac且sandbox开启，用sandbox-exec profile deny default，广泛allow file-read后挡敏感目录，file-write允许cwd/extraPaths及tmp/private/var等，并不是所有读写只在工作区。存在proxy port时deny远程outbound只allow localhost，同时设proxy env；proxy port缺失时profile走allow network*。commandHost把toggle转换为getProxyPort结果，缺port未在该段fail-closed；配置initNetworkProxy失败只log。所以不能一概称永远只env，也不能认为勾选必然已隔离，初始化失败/本地代理绕行需实际故障核验。

Windows PowerShell ConstrainedLanguage不是工作区文件沙箱；新版native launcher有restricted primary token移除权限/把管理员组deny-only，但明确保ordinary user/group access，并用Job Object控子树。实际caller也已接上：runShellCommand将spec和sandboxEnabled交给前台或后台spawn；两者先preflight launcher存在，再spawn该native程序，并通过stdin发makeLauncherConfig。Windows且sandboxEnabled=true才创建restricted token并走CreateProcessAsUserW；false走普通CreateProcessW，Job Object仍由launcher管理。包内/开发dist/target-release是路径选择，不是缺失时绕过保护；所选launcher不存在时前后台均返回code=-1和明确错误，没有改走裸PowerShell。token创建用?传播失败，CreateProcessAsUserW失败也return Err，所核分支无普通token重试。尚未运行Windows发行包，不证明交付二进制与源码一致或平台能力实测通过。这比纯语言模式多防护，却仍不证明只能访问授权工作区。mac launcher豁免/代理缺失、Windows及shell绕桌面操作应按真实平台条件收窄，而不是照README“100%安全/所有本地”口号。

本轮只核核心策略/command与部分审批分支，不全审浏览器域权限、Computer Use原生Host、所有插件/MCP或跨进程政策，不能作全产品安全审计。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/permissions/permissionMode.ts:79-161](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/permissions/permissionMode.ts#L79-L161)

三模式策略与consequence始终问。

<details>
<summary>查看原文（83行）</summary>

```text
  decideOtherTool(
    consequence?: 'read-only' | 'state-changing',
    alreadyGranted?: boolean,
  ): PermissionDecision;
}

/**
 * Shared gate for consequence-classified non-command tools.
 * Mirrors `computerUsePolicy.modePolicy`'s `approval-required` row, which asks
 * in every mode — the browser is the same high-consequence surface whether it
 * is driven by Computer Use or by the automation tools.
 */
function decideConsequentialTool(
  consequence?: 'read-only' | 'state-changing',
  alreadyGranted?: boolean,
): PermissionDecision {
  if (consequence !== 'state-changing') return 'allow';
  return alreadyGranted ? 'allow' : 'confirm';
}

/** Whether a command's content classification counts as an escalation. */
function isRiskyCommand(level: ConfirmationInfo['level']): boolean {
  return level === 'danger' || level === 'warn';
}

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
  },
};

/**
 * Get the permission strategy for a given mode. Unknown modes fall back to standard.
 */
export function getPermissionStrategy(mode: PermissionMode): PermissionStrategy {
  switch (mode) {
    case 'smart': return smartStrategy;
    case 'autonomous': return autonomousStrategy;
    case 'standard':
    default: return standardStrategy;
  }
}
```

</details>

**依据 2 · 源码核查**：[src/core/tools/registry.ts:1164-1197](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/tools/registry.ts#L1164-L1197)

授权/文件计划先行。

<details>
<summary>查看原文（34行）</summary>

```text
export async function checkToolApproval(
  name: string,
  input: Record<string, unknown>,
  toolContext?: ToolExecutionContext,
  onRequireConfirmation?: CommandConfirmCallback,
  onRequireFilePermission?: FilePermissionCallback,
  retainFileAccess = false,
): Promise<ToolApprovalDecision> {
  const operation = beginToolOperationAuthorization(name, input, toolContext);
  if (operation) input = operation.input;
  const filePlanning = operation && hasToolFileTargets(name) ? captureFilePlanningGuard() : undefined;
  let teamFileScope: string | undefined;
  let files: ToolFileAccess | undefined;
  let transferred = false;
  try {
  const inspectionBeforePlanning = operation?.authorization.inspect();
  if (inspectionBeforePlanning?.decision === 'deny') {
    recordBrowserBoundaryDenial(name, input, toolContext, 'enterprise-policy-denied');
    return { decision: 'deny', reason: inspectionBeforePlanning.reason };
  }
  const filePlan = operation ? await planToolFiles(name, input, toolContext) : null;
  filePlanning?.assertCurrent();
  if (filePlan && operation) {
    input = filePlan.input;
    for (const target of filePlan.targets) {
      const checked = await operation.authorization.authorizeFile({
        inputPath: target.inputPath, lexicalPath: target.path, canonicalPath: target.path,
        capability: target.purpose === 'write' || target.purpose === 'delete' ? 'write' : 'read',
        followFinalSymlink: target.followFinalSymlink, purpose: target.purpose, phase: 'lexical',
        pathContext: { homePath: filePlan.homePath, workspacePath: filePlan.workspacePath },
      });
      if (checked.decision === 'deny') {
        recordBrowserBoundaryDenial(name, input, toolContext, 'enterprise-policy-denied');
        return { decision: 'deny', reason: checked.reason };
```

</details>

**依据 3 · 源码核查**：[src/core/tools/definitions/commandTools.ts:134-194](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/tools/definitions/commandTools.ts#L134-L194)

launcher例外/AppleScript/工作区/timeout执行。

<details>
<summary>查看原文（61行）</summary>

```text
      // Exempt app-launcher commands from sandbox
      // macOS: `open` uses LaunchServices via XPC, blocked by Seatbelt
      // Windows: `start`/`Start-Process` exempted for consistency with ExecutionPolicy
      const isLauncherCandidate = isWindows()
        ? /^\s*(start|Start-Process)\s/i.test(resolvedCommand)
        : /^\s*open\s/.test(resolvedCommand);
      const isLauncherCmd = isLauncherCandidate
        && (
          !hasElectronCommandHost()
          || !hasUnquotedShellControlSyntax(resolvedCommand)
        );
      const sandbox = isLauncherCmd ? false : isSandboxEnabled();

      // Seatbelt does not contain the target app process: Apple Events can ask
      // that app to mutate data outside the shell profile. Electron therefore
      // blocks explicit cross-app AppleScript before spawn while Shell sandbox
      // protection is enabled. Tauri stays unchanged during coexistence.
      const preflightAppAutomationRecovery = sandbox && hasElectronCommandHost()
        ? getAppAutomationSandboxRecovery(resolvedCommand)
        : null;
      if (preflightAppAutomationRecovery) {
        context?.reportMetadata?.({
          sandboxRecovery: preflightAppAutomationRecovery,
        });
        return formatAppAutomationRecovery(preflightAppAutomationRecovery);
      }

      // Use the shell/session-owned workspace from context. Scoped unattended
      // runs fail closed when that trusted value is null/absent; only
      // unscoped interactive/direct invocations may fall back to the global
      // workspace reader.
      // The fallback must not fail the command: in the sidecar the bare getter
      // resolves an ambient-run mirror and THROWS outside a registered run —
      // treat that as "no workspace" (cwd-less spawn), matching the shell's
      // no-workspace behavior instead of erroring before the spawn.
      const workspacePath = context?.authorizationScopeId !== undefined
        ? (context.workspacePath ?? null)
        : (context?.workspacePath ?? safeGlobalWorkspacePath());
      const authorizedPaths = sandbox
        ? await getAuthorizedPathsReader().getAuthorizedWritablePaths(context?.authorizationScopeId)
        : [];
      const extraWritablePaths = [
        ...(context?.authorizationScopeId === undefined && workspacePath ? [workspacePath] : []),
        ...authorizedPaths,
      ];

      // Use custom Tauri command defined in Rust
      const output = await invokeTaskCommand<CommandOutput & { backgroundCommandId?: string; running?: boolean }>('run_shell_command', {
        command: resolvedCommand,
        cwd: cwd || workspacePath || null,
        background: background || false,
        timeout: Math.min(Math.max(1, timeout ?? 30), 300),
        sandboxEnabled: sandbox,
        networkIsolation: isNetworkIsolationEnabled(),
        extraWritablePaths,
      }, context, {
        commandIdPrefix: 'run-command',
        keepAbortListenerAfterResolve: (result) => background === true && result.code === 0,
      });

      const appAutomationRecovery = sandbox
```

</details>

**依据 4 · 源码核查**：[electron/commandHost.cjs:91-178](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/commandHost.cjs#L91-L178)

实际mac profile读写、Apple Events和网络。

<details>
<summary>查看原文（88行）</summary>

```text
  let profile = '';

  // ── Base: deny everything by default ──
  profile += '(version 1)\n';
  profile += '(deny default)\n\n';

  // ── Process operations ──
  profile += ';; Process operations\n';
  profile += '(allow process*)\n';
  // Shell sandbox protects file paths, but an Apple Event asks another
  // unsandboxed app to perform the mutation. Deny the system AppleScript
  // interpreter at the kernel policy boundary so shell wrappers, variables,
  // eval, and nested interpreters cannot bypass the renderer preflight.
  profile += '(deny process-exec (literal "/usr/bin/osascript"))\n';
  profile += '(allow signal)\n\n';

  // ── Mach IPC ──
  profile += ';; Mach IPC (required by most macOS programs)\n';
  profile += '(allow mach*)\n\n';
  // Apple Events let a sandboxed command ask another application to mutate
  // data on its behalf. Keep that channel closed even if an alternate script
  // interpreter or a renamed executable avoids the path-specific deny above.
  profile += '(deny appleevent-send)\n\n';

  // ── System info ──
  profile += ';; System info queries\n';
  profile += '(allow sysctl*)\n\n';

  // ── POSIX IPC ──
  profile += ';; POSIX IPC (pipes, shared memory, semaphores)\n';
  profile += '(allow ipc-posix*)\n';
  profile += '(allow ipc-sysv*)\n\n';

  // ── Pseudo-TTY ──
  profile += ';; Terminal operations\n';
  profile += '(allow pseudo-tty)\n\n';

  // ── Network ──
  if (networkProxyPort != null) {
    profile += ';; Network: isolated — only localhost allowed (proxy)\n';
    profile += '(deny network-outbound)\n';
    profile += '(allow network-outbound (remote ip "localhost:*"))\n';
    profile += '(allow network-inbound)\n';
    profile += '(allow system-socket)\n\n';
  } else {
    profile += ';; Network: unrestricted\n';
    profile += '(allow network*)\n\n';
  }

  // ── File reads: broadly allow, then deny sensitive paths ──
  profile += ';; File reads: allow most, deny sensitive paths\n';
  profile += '(allow file-read*)\n';
  // Prevent copying the denied interpreter to a writable path and executing
  // it under another name.
  profile += '(deny file-read* (literal "/usr/bin/osascript"))\n';
  for (const sensitive of SENSITIVE_READ_PATHS) {
    const fullPath = `${homeDir}/${sensitive}`;
    const escaped = escapeSbplPath(fullPath);
    profile += `(deny file-read* (subpath "${escaped}"))\n`;
  }
  profile += '\n';

  // ── File writes: deny by default (from deny default), allow specific ──
  profile += ';; File writes: only specific directories\n';
  profile += '(allow file-write* (subpath "/tmp"))\n';
  profile += '(allow file-write* (subpath "/private/tmp"))\n';
  profile += '(allow file-write* (subpath "/dev"))\n';
  profile += '(allow file-write* (subpath "/private/var"))\n';

  // CWD — the working directory is writable
  if (cwd) {
    const escaped = escapeSbplPath(cwd);
    profile += `(allow file-write* (subpath "${escaped}"))\n`;
  }

  // Extra writable paths (e.g. process_image output directory)
  for (const p of extraWritablePaths || []) {
    if (p) {
      const escaped = escapeSbplPath(p);
      profile += `(allow file-write* (subpath "${escaped}"))\n`;
    }
  }

  // ── File ioctl (some programs need this) ──
  profile += '\n;; File ioctl\n';
  profile += '(allow file-ioctl)\n';

  return profile;
```

</details>

**依据 5 · 源码核查**：[electron/commandHost.cjs:182-237](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/commandHost.cjs#L182-L237)

proxy env和不同平台spawn。

<details>
<summary>查看原文（56行）</summary>

```text
function proxyEnvVars(networkProxyPort) {
  if (networkProxyPort == null) return {};
  const proxyUrl = `http://127.0.0.1:${networkProxyPort}`;
  return {
    HTTP_PROXY: proxyUrl,
    HTTPS_PROXY: proxyUrl,
    http_proxy: proxyUrl,
    https_proxy: proxyUrl,
    ALL_PROXY: proxyUrl,
    NO_PROXY: 'localhost,127.0.0.1,::1',
    no_proxy: 'localhost,127.0.0.1,::1',
  };
}

/**
 * Build a shell-command spawn spec, sandboxed via sandbox-exec on macOS.
 * Port of sandbox.rs's `build_sandboxed_command`.
 *
 * macOS + sandboxEnabled: `sandbox-exec -p <profile> <shell> -lc <command>`
 * (NOTE: no `--` separator here — matches the Rust source exactly; `--` is
 * only used by the argv variant below).
 *
 * Windows parity: sandboxEnabled=true runs PowerShell in ConstrainedLanguage
 * mode with ExecutionPolicy Restricted as defense in depth. The launcher also
 * applies a restricted primary token and owns the tree through a Job Object.
 */
function buildSandboxedCommandSpec(command, cwd, extraWritablePaths, sandboxEnabled, networkProxyPort, platform = process.platform) {
  const env = proxyEnvVars(networkProxyPort);

  if (platform === 'darwin' && sandboxEnabled) {
    const homeDir = os.homedir() || '/tmp';
    const profile = generateSeatbeltProfile(cwd, extraWritablePaths, homeDir, networkProxyPort);
    const shell = process.env.SHELL || '/bin/zsh';
    return { file: 'sandbox-exec', args: ['-p', profile, shell, '-lc', command], env };
  }

  if (platform === 'win32') {
    if (sandboxEnabled) {
      return {
        file: 'powershell',
        args: [
          '-NoProfile',
          '-NonInteractive',
          '-ExecutionPolicy',
          'Restricted',
          '-Command',
          `$ExecutionContext.SessionState.LanguageMode = 'ConstrainedLanguage'; ${command}`,
        ],
        env,
      };
    }
    return { file: 'powershell', args: ['-NoProfile', '-NonInteractive', '-Command', command], env };
  }

  // Linux, or macOS without sandbox: plain shell, no sandbox-exec wrapper.
  const shell = process.env.SHELL || '/bin/zsh';
```

</details>

**依据 6 · 源码核查**：[electron/commandHost.cjs:1097-1112](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/commandHost.cjs#L1097-L1112)

proxy port缺失向下传。

<details>
<summary>查看原文（16行）</summary>

```text
  const timeoutSecs = Math.min(Math.max(1, Number(a.timeout ?? 30) || 30), 300); // default 30s, max 300s
  const commandId = typeof a.commandId === 'string' && a.commandId ? a.commandId : makeCommandId('shell');
  const sandboxEnabled = a.sandboxEnabled !== false; // unwrap_or(true)
  const extraWritablePaths = Array.isArray(a.extraWritablePaths) ? a.extraWritablePaths : [];
  const networkIsolation = !!a.networkIsolation;
  const networkProxyPort = networkIsolation ? getNetworkProxyPort() : undefined;

  const runtimeCommand = shellCommandWithBundledPath(app, command);
  const spec = buildSandboxedCommandSpec(
    runtimeCommand,
    cwd,
    extraWritablePaths,
    sandboxEnabled,
    networkProxyPort,
  );
  const envOverride = bundledRuntimeEnv(app);
```

</details>

**依据 7 · 源码核查**：[src/core/sandbox/config.ts:38-54](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/sandbox/config.ts#L38-L54)

代理初始化失败只log。

<details>
<summary>查看原文（17行）</summary>

```text
export async function initNetworkProxy(): Promise<void> {
  if (proxyStarted || !isOsSandboxCapable()) return;

  const state = getSettingsReader().getSnapshot();
  if (!state.networkIsolationEnabled) return;

  try {
    const port = await invoke<number>('start_network_proxy', {
      whitelist: state.networkWhitelist,
      allowPrivateNetworks: state.allowPrivateNetworks,
    });
    proxyStarted = true;
    console.log(`[sandbox] Network proxy started on port ${port}`);
  } catch (err) {
    console.error('[sandbox] Failed to start network proxy:', err);
  }
}
```

</details>

**依据 8 · 源码核查**：[electron/sandbox-launcher/src/main.rs:455-514](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/sandbox-launcher/src/main.rs#L455-L514)

Windows token保普通访问去特权。

<details>
<summary>查看原文（60行）</summary>

```text
    fn create_restricted_primary_token() -> Result<OwnedHandle, String> {
        let mut process_token = null_mut();
        let opened = unsafe {
            OpenProcessToken(
                GetCurrentProcess(),
                TOKEN_ASSIGN_PRIMARY | TOKEN_DUPLICATE | TOKEN_QUERY,
                &mut process_token,
            )
        };
        if opened == 0 {
            return Err(format!("OpenProcessToken failed: {}", unsafe {
                GetLastError()
            }));
        }
        let process_token = OwnedHandle::new(process_token)?;

        // Keep ordinary user/group access for tool compatibility, but remove
        // token privileges and make elevated local groups deny-only.
        let sid_types = [
            WinBuiltinAdministratorsSid,
            WinBuiltinPowerUsersSid,
            WinBuiltinBackupOperatorsSid,
        ];
        let mut sid_storage = [[0u8; SECURITY_MAX_SID_SIZE as usize]; 3];
        let mut deny_only_sids = Vec::with_capacity(sid_types.len());
        for (sid_type, storage) in sid_types.into_iter().zip(sid_storage.iter_mut()) {
            let mut sid_bytes = storage.len() as u32;
            let created = unsafe {
                CreateWellKnownSid(
                    sid_type,
                    null_mut(),
                    storage.as_mut_ptr().cast::<c_void>(),
                    &mut sid_bytes,
                )
            };
            if created == 0 {
                return Err(format!("CreateWellKnownSid failed: {}", unsafe {
                    GetLastError()
                }));
            }
            deny_only_sids.push(SID_AND_ATTRIBUTES {
                Sid: storage.as_mut_ptr().cast::<c_void>(),
                Attributes: 0,
            });
        }

        let mut restricted_token = null_mut();
        let restricted = unsafe {
            CreateRestrictedToken(
                process_token.raw(),
                DISABLE_MAX_PRIVILEGE,
                deny_only_sids.len() as u32,
                deny_only_sids.as_ptr(),
                0,
                null(),
                0,
                null(),
                &mut restricted_token,
            )
        };
```

</details>

**依据 9 · 源码核查**：[electron/sandbox-launcher/src/main.rs:524-539](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/sandbox-launcher/src/main.rs#L524-L539)

Job Object终止进程树。

<details>
<summary>查看原文（16行）</summary>

```text
        let job = OwnedHandle::new(unsafe { CreateJobObjectW(null(), null()) })?;
        let mut info: JOBOBJECT_EXTENDED_LIMIT_INFORMATION = unsafe { zeroed() };
        info.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;
        let ok = unsafe {
            SetInformationJobObject(
                job.raw(),
                JobObjectExtendedLimitInformation,
                &info as *const _ as *const _,
                size_of::<JOBOBJECT_EXTENDED_LIMIT_INFORMATION>() as u32,
            )
        };
        if ok == 0 {
            return Err(format!(
                "SetInformationJobObject(KILL_ON_JOB_CLOSE) failed: {}",
                unsafe { GetLastError() }
            ));
```

</details>

**依据 10 · 源码核查**：[README.md:186-193](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/README.md#L186-L193)

作者安全/隔离表述需对实际Electron收窄。

```text
- **Three Permission Modes** — **Request Approval** (free read/write inside workspace; out-of-bounds writes and dangerous commands need confirmation; default) / **Smart Review** (out-of-bounds ops go to an AI reviewer: allow low-risk, block high-risk, ask only when unsure) / **Full Autonomy** (everything runs automatically except hard system red-lines); global default in Settings → Sandbox, also switchable per conversation via the chip above the composer
- **Content Safety Scan** — Scans agent-authored skills / memory entries to catch dangerous instructions, prompt injection, hardware commands, and 120+ other risk patterns
- **OS Sandbox (macOS only)** — macOS Seatbelt (`sandbox-exec`) confines a shell command's file access to the workspace. **Windows has no OS-enforced sandbox**: PowerShell ConstrainedLanguage restricts in-process language features, not file access, and a child `powershell.exe` does not inherit it. Treat Windows shell containment as advisory, not as a security boundary
- **Network Isolation** — Local proxy + domain allowlist + private-network toggle. **Enforced through environment variables, not by the OS**: a command that bypasses the proxy (`curl --noproxy`, a runtime with its own proxy settings) still reaches the network. On Windows the toggle is not exposed in Settings and isolation is off by default
- **Path & Command Safety** — Sensitive directories (system folders, SSH keys, etc.) blocked by default; dangerous commands (`rm -rf /`, etc.) caught statically
- **Computer Use Safeguards** — Blocked sensitive apps (terminals, system settings, credential managers, IDEs), dangerous key interception (Cmd+Q, Cmd+Tab, Force Quit, Win+R), per-app grants you can revoke, confirmation before any consequential action, 5-minute timeout. These govern the Computer Use tool; **they do not constrain the shell tool**, which can reach the desktop by other means while no OS sandbox is in place
- **Encrypted API Key Storage** — Windows DPAPI / macOS AES-256-GCM with a hardware-UUID-derived key; keys are no longer written to localStorage in plaintext
- **Local-First** — Your data stays local, your API keys stay local — nothing goes through third-party servers
```

**依据 11 · 源码核查**：[electron/commandHost.cjs:700-745](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/commandHost.cjs#L700-L745)

选择native路径、缺失预检和sandboxEnabled帧。

<details>
<summary>查看原文（46行）</summary>

```text
function sandboxLauncherPathFor(app) {
  const exe = process.platform === 'win32' ? 'sandbox-launcher.exe' : 'sandbox-launcher';
  const packaged = path.join(resourceRoot(app), 'sandbox-launcher', process.platform, exe);
  if (app?.isPackaged || fs.existsSync(packaged)) return packaged;
  const devDist = path.join(REPO_ROOT, 'electron', 'sandbox-launcher', 'dist', process.platform, exe);
  if (fs.existsSync(devDist)) return devDist;
  return path.join(REPO_ROOT, 'electron', 'sandbox-launcher', 'target', 'release', exe);
}

/**
 * Everything about the host that must hold before a command can run at all.
 * Both conditions below used to reach the caller as the same
 * `spawn <launcherPath> ENOENT` from child_process, so neither the user nor
 * the model could tell a missing launcher from a missing working directory,
 * and neither message named anything the user could act on.
 *
 * Returns a Chinese, actionable sentence, or null when the host is fine.
 */
function preflightCommandHost(launcherPath, cwd) {
  if (!fs.existsSync(launcherPath)) {
    return `阿布的命令启动器不在应有的位置（${launcherPath}），所有命令执行都无法使用。这个文件通常是被安全软件删除或隔离了：把阿布的安装目录加入安全软件的信任列表，然后重新安装阿布。`;
  }
  if (cwd) {
    if (!fs.existsSync(cwd)) {
      return `工作目录不存在：${cwd}。请换一个存在的目录，或者先创建它。`;
    }
    if (!fs.statSync(cwd).isDirectory()) {
      return `工作目录不是一个目录：${cwd}。请换成一个目录。`;
    }
  }
  return null;
}

function makeLauncherConfig(spec, sandboxEnabled) {
  return {
    file: spec.file,
    args: spec.args,
    sandboxEnabled: sandboxEnabled === true,
    // stdin remains open after this newline-delimited frame. If Electron is
    // killed or crashes, the OS closes the pipe and the native launcher tears
    // down its process group / Job Object without relying on JavaScript hooks.
    monitorParent: true,
    // Also bind the launcher directly to Electron's main-process PID. This is
    // an independent native liveness signal on Windows, where another process
    // can briefly retain a duplicated pipe handle after abrupt termination.
    parentPid: process.pid,
```

</details>

**依据 12 · 源码核查**：[electron/commandHost.cjs:895-932](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/commandHost.cjs#L895-L932)

前台实际spawn launcher及stdin配置，缺失返回-1。

<details>
<summary>查看原文（38行）</summary>

```text
function spawnForeground(app, spec, opts, timeoutSecs, commandId) {
  ownedChildProcesses.assertAdmission();
  return new Promise((resolve) => {
    const { file, args, env } = spec;
    const launcherPath = sandboxLauncherPathFor(app);
    const hostProblem = preflightCommandHost(launcherPath, opts.cwd);
    if (hostProblem) {
      resolve({ stdout: '', stderr: hostProblem, code: -1 });
      return;
    }
    const spawnEnv = { ...process.env, ...(env || {}), ...(opts.envOverride || {}) };
    opts.assertCurrent?.();

    let child;
    try {
      child = spawn(launcherPath, [], {
        cwd: opts.cwd || undefined,
        env: spawnEnv,
        windowsHide: true,
        detached: process.platform !== 'win32',
      });
    } catch (e) {
      resolve({ stdout: '', stderr: `Failed to spawn command: ${e instanceof Error ? e.message : String(e)}`, code: -1 });
      return;
    }

    const entry = { commandId, child, completed: false, killed: false, forceKillTimer: null };
    ownedChildProcesses.track(child, () => killProcessTree(entry));
    opts.onConsumerStarted?.(() => killProcessTree(entry));
    child.once('close', () => opts.onConsumerClosed?.());
    addActiveCommand(entry);

    const stdoutC = makeCappedCollector();
    const stderrC = makeCappedCollector();
    child.stdout?.on('data', (chunk) => stdoutC.push(chunk));
    child.stderr?.on('data', (chunk) => stderrC.push(chunk));
    child.stdin?.on('error', () => {});
    child.stdin?.write(`${JSON.stringify(makeLauncherConfig({ file, args }, opts.sandboxEnabled))}\n`);
```

</details>

**依据 13 · 源码核查**：[electron/commandHost.cjs:995-1039](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/commandHost.cjs#L995-L1039)

后台同样预检、spawn launcher及配置，无缺失降级。

<details>
<summary>查看原文（45行）</summary>

```text
    const launcherPath = sandboxLauncherPathFor(app);
    const hostProblem = preflightCommandHost(launcherPath, opts.cwd);
    if (hostProblem) {
      finishOnce(-1);
      resolve({ stdout: '', stderr: hostProblem, code: -1 });
      return;
    }
    const spawnEnv = { ...process.env, ...(env || {}), ...(opts.envOverride || {}) };

    // Registered before spawn, so a table that refuses the row leaves no process behind.
    const registration = table.register({
      conversationId: opts.conversationId,
      command: opts.command,
      cwd: opts.cwd,
    });
    const backgroundCommandId = registration.id;

    let child;
    try {
      child = spawn(launcherPath, [], {
        cwd: opts.cwd || undefined,
        env: spawnEnv,
        windowsHide: true,
        detached: process.platform !== 'win32',
      });
    } catch (e) {
      table.discard(backgroundCommandId);
      finishOnce(-1);
      resolve({ stdout: '', stderr: `Failed to spawn command: ${e instanceof Error ? e.message : String(e)}`, code: -1 });
      return;
    }

    const entry = { commandId, child, completed: false, killed: false, forceKillTimer: null, backgroundCommandId };
    ownedChildProcesses.track(child, () => killProcessTree(entry));
    addActiveCommand(entry);
    // Attached before the listeners below, so the row has settled by the time
    // an early exit resolves the result.
    registration.attach({ child, stop: () => killProcessTree(entry) });

    const stdoutC = makeCappedCollector();
    const stderrC = makeCappedCollector();
    child.stdout?.on('data', (chunk) => stdoutC.push(chunk));
    child.stderr?.on('data', (chunk) => stderrC.push(chunk));
    child.stdin?.on('error', () => {});
    child.stdin?.write(`${JSON.stringify(makeLauncherConfig({ file, args }, opts.sandboxEnabled))}\n`);
```

</details>

**依据 14 · 源码核查**：[electron/commandHost.cjs:1125-1136](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/commandHost.cjs#L1125-L1136)

runShellCommand真实选择前台/后台调用。

<details>
<summary>查看原文（12行）</summary>

```text
  let result;
  if (isBackground) {
    // A background command is noted when its process exits, with its real exit code.
    result = await spawnBackground(
      app,
      spec,
      { cwd, envOverride, sandboxEnabled, conversationId, command, onFinished: noteFinished },
      commandId,
    );
  } else {
    result = await spawnForeground(app, spec, { cwd, envOverride, sandboxEnabled }, timeoutSecs, commandId);
    noteFinished(result.code);
```

</details>

**依据 15 · 源码核查**：[electron/sandbox-launcher/src/main.rs:565-579](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/sandbox-launcher/src/main.rs#L565-L579)

Job Object和有条件restricted token创建。

<details>
<summary>查看原文（15行）</summary>

```text
        let job = Arc::new(create_kill_on_close_job()?);
        let command_line_string = super::build_windows_command_line(&cfg);
        let mut command_line = wide_null(OsStr::new(&command_line_string));
        let std_handles = inherited_std_handles(cfg.stdio_passthrough)?;
        let handle_values = [
            std_handles[0].raw(),
            std_handles[1].raw(),
            std_handles[2].raw(),
        ];
        let attributes = ProcThreadAttributeList::for_handles(&handle_values)?;
        let restricted_token = if cfg.sandbox_enabled {
            Some(create_restricted_primary_token()?)
        } else {
            None
        };
```

</details>

**依据 16 · 源码核查**：[electron/sandbox-launcher/src/main.rs:595-632](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/sandbox-launcher/src/main.rs#L595-L632)

sandbox开时CreateProcessAsUserW，失败返回，不转普通CreateProcessW。

<details>
<summary>查看原文（38行）</summary>

```text
        let ok = unsafe {
            if let Some(token) = restricted_token.as_ref() {
                CreateProcessAsUserW(
                    token.raw(),
                    null(),
                    command_line.as_mut_ptr(),
                    null(),
                    null(),
                    1,
                    creation_flags,
                    null(),
                    null(),
                    &startup.StartupInfo,
                    &mut process_info,
                )
            } else {
                CreateProcessW(
                    null(),
                    command_line.as_mut_ptr(),
                    null(),
                    null(),
                    1,
                    creation_flags,
                    null(),
                    null(),
                    &startup.StartupInfo,
                    &mut process_info,
                )
            }
        };
        if ok == 0 {
            let api = if restricted_token.is_some() {
                "CreateProcessAsUserW"
            } else {
                "CreateProcessW"
            };
            return Err(format!("{api} failed: {}", unsafe { GetLastError() }));
        }
```

</details>

#### 缺口

- proxy未启动、沙箱豁免、Win普通权限与所有MCP路径实际隔离未测
  **影响**：不可承诺勾选即可安全容纳任意工具/工作区或所有平台等效
  **进一步探讨**：一次性OS用户/副本测proxy失败、直接网络、敏感路径/授权外写、launcher/嵌套shell及Stop子树。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地优先/密钥/持久化与网络声明支持到哪？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

Electron secretStore实际safeStorage加密字符串为base64密文落JSON，不是README所述Tauri AES/HW UUID格式的复现。初始化拒basic_text后端；不可用时get null、set抛，不静默明文降级；persist tmp写+fsync+rename并传播写失败，坏JSON先尝试corrupt副本后空store。这些是明确改善，但本轮未审OS keychain/全部迁移与所有日志路径，不把它们扩成全数据加密或绝对无泄漏。

本地存放聊天/工作区与密钥不等无外发：OpenAI-compatible构造fullUrl、请求含messages/工具历史，Bearer API key发所配模型服务；Claude/其它adapter或外部MCP/浏览器也按配置有各自网络。选择本地Ollama才可减少对应云请求，仍需审工具网络。README“nothing goes through third-party servers”不应解释为使用远端模型时内容不离机，不能把本地优先误当离线。

loop每轮异步写checkpoint，写失败catch为非关键无恢复提示；工具结果完成后按assistant message id尝试replaceMessageById，失败仍可暂留内存。checkpoint说明处在LLM或tool阶段有助崩溃后提示，却不证明外部动作exactly-once或能自动回滚。sidecar dispatch先持久消息、以run所有权/终态去重等结构很完整，本轮只定向核其入口/审批，未全审ledger/文件版本/退出迁移。

依赖是Electron/sidecar/native helper及所配provider，另有本机文件权限、shell/Python/办公工具、可选浏览器扩展/MCP。README列计划/定时/IM/多Agent及技能市场，本轮不逐项审，不能让某个受控工具边界为所有后台触发背书。真实业务产物、身份/审批上下文、请求/用量和未完成状态须一起检查。

#### 证据与依据

**依据 1 · 源码核查**：[electron/secretStore.cjs:1-24](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/secretStore.cjs#L1-L24)

Electron safeStorage而非Tauri密码格式。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * Electron main-side secret store (Phase 2 slice C) — safeStorage-backed
 * key→value store that backs the frontend's 7 `secret_*` commands
 * (src/utils/secretStore.ts, the frontend's single choke point for secrets).
 *
 * `safeStorage` (Electron) only offers encryptString(plaintext)->Buffer /
 * decryptString(Buffer)->string / isEncryptionAvailable()->bool — there is no
 * built-in KV store, so this module persists the encrypted blobs itself as a
 * JSON file of base64 strings, keyed by the same colon-namespaced keys the
 * frontend uses (`provider:<id>`, `aux:webSearch`, `aux:imageGen`,
 * `imagegen:<backendId>`).
 *
 * Mirrors the shape (not the crypto) of the Tauri macOS backend
 * (src-tauri/src/secrets.rs): an in-memory map loaded once at startup,
 * test-decrypted on load so entries that fail (e.g. OS keychain/key
 * rotated) are tracked in `failedKeys` rather than silently dropped, and
 * atomic (temp file + rename) persistence on every mutation.
 *
 * NOT a reproduction of secrets.bin's AES-256-GCM/HKDF format — safeStorage
 * uses the OS's own credential/keychain-backed encryption under the hood, so
 * existing Tauri-produced ciphertext is opaque to this module. See
 * docs/2026-07-22-phase2-sliceC-secret-migration-plan.md for that deferred
 * migration.
 */
```

</details>

**依据 2 · 源码核查**：[electron/secretStore.cjs:62-87](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/secretStore.cjs#L62-L87)

坏JSON保全原密文。

<details>
<summary>查看原文（26行）</summary>

```text
  }
  if (raw.trim().length === 0) return;

  try {
    const json = JSON.parse(raw);
    for (const [key, b64] of Object.entries(json)) {
      if (typeof b64 === 'string') store.set(key, b64);
    }
  } catch (err) {
    // Corrupt/unparseable file: do NOT start empty and let the next write
    // overwrite it — that would permanently discard recoverable ciphertext
    // (silent total key loss). Preserve the file aside first, THEN continue
    // empty so a fresh store can be built without destroying the old blobs.
    const aside = `${filePath}.corrupt-${Date.now()}`;
    try {
      fs.renameSync(filePath, aside);
      warn(`secrets file corrupt/unparseable — preserved as ${aside}, starting empty`, errMsg(err));
    } catch (renameErr) {
      warn('secrets file corrupt AND could not be preserved aside', errMsg(renameErr));
    }
    store = new Map();
    return;
  }

  // failedKeys is populated LAZILY by get() — the frontend reads every provider
  // key at boot, so a failed decrypt is caught there. We deliberately do NOT
```

</details>

**依据 3 · 源码核查**：[electron/secretStore.cjs:105-124](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/secretStore.cjs#L105-L124)

tmp/fsync/rename。

<details>
<summary>查看原文（20行）</summary>

```text
function persist() {
  if (!filePath) return;
  const obj = {};
  for (const [k, v] of store) obj[k] = v;
  const json = JSON.stringify(obj, null, 2);
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, json, 'utf8');
  // fsync the temp file's data blocks before the rename (Rust's sync_all), so a
  // crash/power-loss right after the (journaled) rename can't expose a
  // truncated/zero-length store — which would silently lose every key.
  const fd = fs.openSync(tmp, 'r+');
  try {
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(tmp, filePath);
}

/**
```

</details>

**依据 4 · 源码核查**：[electron/secretStore.cjs:137-154](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/secretStore.cjs#L137-L154)

不可用/basic_text限制。

<details>
<summary>查看原文（18行）</summary>

```text
    /* best-effort; write path below will surface a real error if this failed */
  }
  filePath = path.join(dir, secretStoreFileName({ isPackaged: app.isPackaged }));

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
  }
```

</details>

**依据 5 · 源码核查**：[electron/secretStore.cjs:186-201](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/secretStore.cjs#L186-L201)

set失败拒绝而非明文。

<details>
<summary>查看原文（16行）</summary>

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
}
```

</details>

**依据 6 · 源码核查**：[src/core/llm/openai-compatible.ts:402-415](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/llm/openai-compatible.ts#L402-L415)

实际远端URL。

<details>
<summary>查看原文（14行）</summary>

```text
  ): Promise<void> {
    // Full URL for POST — idempotent: a user-pasted URL that already ends in
    // /chat/completions is not double-appended. useRawUrl bypasses all
    // normalization for proxies with non-standard paths.
    const fullUrl = buildFullChatUrl(options.baseUrl, 'openai-compatible', {
      useRawUrl: options.declaredCapabilities?.useRawUrl,
    });
    // Host of the request URL — used for both the request-processor context and
    // for observability events emitted from the streaming loop below. fullUrl is
    // invariant for the whole request, so derive it once here.
    const requestHost = (() => { try { return new URL(fullUrl).host; } catch { return ''; } })();

    const hasTools = !!(options.tools && options.tools.length > 0);

```

</details>

**依据 7 · 源码核查**：[src/core/llm/openai-compatible.ts:484-508](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/llm/openai-compatible.ts#L484-L508)

Bearer和网络fetch/abort。

<details>
<summary>查看原文（25行）</summary>

```text
    applyModelRequestProcessors(body, { profile, hasTools });

    const requestHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
    if (options.apiKey) {
      requestHeaders['Authorization'] = `Bearer ${options.apiKey}`;
    }
    const fetchFn = await getTauriFetch({ localServer: options.localServer === true });
    // 尝试身份在 fetch 层铸造：下面的限额重试会再走一次 fetch，它在账本里单独
    // 占一条尝试（任务书 U02）。
    const countingFetch: typeof fetchFn = (...args) => {
      recorder.beginAttempt();
      return fetchFn(...args);
    };

    // Stream-level abort controller. The idle heartbeat (below) emits events
    // but cannot make a hung `reader.read()` return — chat() would stay pending
    // and the awaiting agent/subagent loop would hang forever. Aborting this
    // controller drives the fetch's abort path (tauriFetch errors the body
    // stream), which rejects the pending read and lets chat() unwind. Merge the
    // caller's signal via AbortSignal.any so user-initiated cancels still reach
    // the fetch (the merged signal is GC'd with chat() — no listener leak).
    const streamAbort = new AbortController();
    const effectiveSignal = options.signal
      ? anySignal([options.signal, streamAbort.signal])
      : streamAbort.signal;
```

</details>

**依据 8 · 源码核查**：[src/core/llm/openai-compatible.ts:294-307](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/llm/openai-compatible.ts#L294-L307)

工具结果进入后续请求。

<details>
<summary>查看原文（14行）</summary>

```text
        result.push(assistantMsg);

        // Add tool results — normalizeMessages guarantees every tool_use has a result
        // OpenAI only supports images in role:"user", not in role:"tool"
        const pendingImages: OpenAIContentPart[] = [];
        for (const tc of turn.toolCalls) {
          result.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: tc.result,
          });
          // Collect images for a follow-up user message
          for (const img of tc.resultImages) {
            pendingImages.push({
```

</details>

**依据 9 · 源码核查**：[src/core/session/checkpoint.ts:65-77](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/session/checkpoint.ts#L65-L77)

提示写失败非关键。

<details>
<summary>查看原文（13行）</summary>

```text
export async function writeCheckpoint(cp: Checkpoint): Promise<void> {
  try {
    const path = await checkpointPath(cp.conversationId);
    // Ensure directory exists
    const dir = path.substring(0, path.lastIndexOf('/'));
    if (!(await exists(dir))) {
      await mkdir(dir, { recursive: true });
    }
    await writeTextFile(path, JSON.stringify(cp));
  } catch {
    // Non-critical — worst case is no recovery hint on crash
  }
}
```

</details>

**依据 10 · 源码核查**：[src/core/agent/agentLoop.ts:2780-2798](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L2780-L2798)

消息结果按id持久化尝试及失败边界。

<details>
<summary>查看原文（19行）</summary>

```text
        // to disk RIGHT NOW. We must use replaceMessageById (not updateLastMessage)
        // because by the time the next turn's addMessage races with our write, the
        // "last line" may already have shifted to the next turn's placeholder, and
        // updateLastMessage would either clobber the new placeholder or update the
        // wrong line. Awaiting here adds a few ms of latency but guarantees disk
        // state matches in-memory state before the loop continues.
        const turnMsg = getConversationReader().getConversation(conversationId)
          ?.messages.find((m) => m.id === assistantMsgId);
        if (turnMsg) {
          try {
            const { replaceMessageById } = await import('../session/conversationStorage');
            await replaceMessageById(conversationId, turnMsg);
          } catch {
            // Non-critical — message still lives in memory until next finishStreaming
          }
        }

        // Handle MCP tool changes — inject notification into conversation
        if (batchResult.mcpChanged) {
```

</details>

#### 缺口

- 全产品存储/日志/遥测、密钥迁移和崩溃后副作用去重未全审
  **影响**：不能宣称100%本地/数据全加密或崩溃恢复无重做
  **进一步探讨**：隔离用户抓实际provider/工具网络并查密钥/日志脱敏，模拟写失败与执行后崩溃再核文件和恢复记录。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 办公任务的全周期成本/采用/退出？

**研究主题**：采用判断、效果与总成本

#### 完整回答

可有限试用，目标是愿意配置provider/权限、能检查产物的桌面用户，先用副本目录和非敏感办公小任务，standard模式从只读/单次写做起；先读回所选Skill/Agent/global配置，按优先级核对有效maxTurns是正有限整数，不能把<=0当有界设置；若无法确认有效值，不开始写入。不要一开始导入高价值资料/开无人值守与全自主。独立client而非DSH插件，需要评估新应用/模型成本和迁移，不是给现Host添一个入口。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容Electron应用/sidecar/native helper | 桌面运行必需 | agent循环/Host执行 | sidecar未就绪显式失败，不回renderer代跑 |
| 可用模型endpoint/key或本地模型 | 决策必需 | 多轮tool use | 远端内容会发模型服务 |
| 副本工作区/授权与成果验收能力 | 试用前提 | 读写/命令及人工复核 | 不能只看完成灯/summary |
| mac sandbox/proxy/Win策略实况 | 对应隔离需求必需 | 约束执行面 | 平台不同，toggle不等有效边界 |
| 浏览器扩展/MCP/办公运行时 | 对应任务才需 | 外部工具 | 额外网络/权限/副作用独立审 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 最小准备 | 用户选provider、standard、副本及正有限整数轮数 | 读回Skill/Agent/global并按优先级核对，<=0为无限；设人工时间/用量停止线，不能确认则不写 |
| 只读小样 | 提取副本资料成报告 | 实际内容/来源与路径可核 |
| 单写小样 | 人批准一次可逆改动 | diff/输出可读，原件不损 |
| 故障小样 | 工具中途Stop/模型失败/代理未启 | 区分未完成/仍跑/已落文件，先查再重试 |
| 退出 | 停任务并核后台/外部服务，保输出与记录 | 卸应用不撤已发请求/外部修改 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 应用/sidecar/模型或本地硬件未知 | endpoint、权限/沙箱实况和副本 | 接线/学习耗时未测 |
| 持续使用 | 多轮tokens/工具网络/本地进程未知 | 复核产物/审批、有效轮数及实际provider用量/子进程 | 正有限轮数非费用/时间封顶；<=0可无限，没净节时对照 |
| 失败恢复 | 重试/中途外部动作和副本未知 | 核真实文件/后台/请求/记录 | Stop非全动作回滚 |
| 升级退出 | 聊天/密钥/输出迁移存储未知 | 停后台/撤授权/保外部成果 | 全迁移兼容未核 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自主多步 | 模型调用→工具→结果回流真实闭环 | 代表办公任务合格率/少人操作 |
| 权限控制 | 模式/审批后再核/sidecar同门 | 全工具边界/跨平台隔离效果 |
| 秘密保护 | safeStorage拒明文降级/持久错误可见 | 全日志/迁移与端到端保密 |
| 恢复线索 | stop reason/checkpoint/消息快照 | 已发外部动作去重/补偿 |

另设单任务可接受的人工运行时间、provider用量/费用和本地资源阈值；这些是用户监测停止线，不是已确认的自动现金限额。达到阈值或用量/后台状态不可读时先Stop并核仍在跑的进程、远端请求和文件，不能从轮数耗尽推已无费用；确认真实状态后才决定重试。若输出不符、触及未授权目录/站点、proxy/sidecar状态不明、Stop后仍有未知动作或恢复记录不全，停止扩大权限/重复执行，人工核真实文件与请求，从独立副本回退。只有已知已完成的小样才逐步扩，不按作者功能数/测试数/签名版本认业务通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/agent/agentLoopRunner.ts:3644-3678](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoopRunner.ts#L3644-L3678)

sidecar失败可见。

<details>
<summary>查看原文（35行）</summary>

```text
  // built for it. A cold or restarting sidecar is waited for (≤60s, under the
  // turn's own 「思考中」 row); a dead one fails this send visibly instead of
  // silently running here. `allowRestart` is spent only for a human-initiated
  // send — see the helper.
  try {
    await waitForSidecarVenue({
      signal: shellAbortController.signal,
      allowRestart: mayRestartSidecarForSend(options),
    });
  } catch (err) {
    if (shellAbortController.signal.aborted) {
      return finalizePreDispatchInterruptedRun(
        conversationId,
        clientMessageId,
        runId,
        'waiting_for_sidecar',
        runtimeStartedAt,
        shellAbortController.signal,
      );
    }
    return finalizePreAcceptFailure({
      conversationId,
      clientMessageId,
      runId,
      runtimeStartedAt,
      kind: 'sidecar_unavailable',
      displayMessage: getI18n().chat.sidecarNotReady,
      stage: 'sidecar_unavailable',
      errorType: err instanceof SidecarUnavailableError ? `sidecar_${err.reason}` : runtimeErrorType(err),
      userMessage,
      images: options?.images,
    });
  }

  traceRuntimeEvent('renderer.agent_params_build_started', {
```

</details>

**依据 2 · 源码核查**：[src/core/agent/agentLoop.ts:1776-1823](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L1776-L1823)

上限是未完成。

<details>
<summary>查看原文（48行）</summary>

```text
    if (turnCount > maxTurns) {
      // The cap is reported as a marker card, not as a sentence the assistant
      // "said": the two things the user wants here are to continue and to raise
      // the cap, and a text message could only ask them to type the first and
      // go hunting for the second. `createMaxTurnsNoticeMessage` explains why
      // the marker is role `system` without `isSystem` (visible, not in context).
      chatDelta.addMessage(
        conversationId,
        createMaxTurnsNoticeMessage({
          id: generateId(),
          timestamp: Date.now(),
          limit: maxTurns,
          // Read BEFORE the marker is appended — the streak counts the notices
          // already in the transcript, not this one.
          streak: deriveMaxTurnsStreak(
            getConversationReader().getConversation(conversationId)?.messages ?? [],
          ),
        }),
      );
      abortRegistry.clearAbortController(conversationId);
      eventRouter.route({ type: 'done', loopId, reason: 'max_turns' });
      persistExecutionSnapshot(conversationId, loopId);
      // NOT 'completed': the cap is an INCOMPLETE ending — `isIncompleteReason`
      // and the scheduler already treat it that way, and the green "done" dot
      // plus "已完成 N 轮执行" told the user (and a team leader reading the
      // conversation) the opposite. `setAgentStatus('idle')` first because
      // clearing the per-conversation agent state was a side effect of the
      // terminal 'completed' status; idle is not terminal, so the activity
      // indicator has to be retired explicitly here.
      chatDelta.setAgentStatus(conversationId, 'idle');
      chatDelta.setConversationStatus(conversationId, 'idle');
      // Hitting the turn cap means every LLM call succeeded (a failed call throws
      // to the catch) → provider is healthy; record it so a prior config-failure
      // is cleared even when the run ends via the cap rather than end_turn.
      recordProviderCallOutcome(getActiveProvider(settingsForModel)?.id, { ok: true, at: Date.now() });
      // C: report the cap to callers (scheduler/trigger) instead of 'completed'.
      exitReason = 'max_turns';
      // Same terminal cleanup as the normal end_turn path — now that the cap is
      // always finite this break is routinely reached, so skipping these would
      // leak an active skill into the next message, leave a phantom crash-recovery
      // checkpoint, and keep the Computer-Use overlay / AX session alive.
      deactivateAllSkills(conversationId, loopId);
      // Pass conversationId so a stale/late deactivate can never clobber a
      // DIFFERENT conversation's now-active CU session (ownership guard in
      // computerUseStatus.ts — see that module's doc for the contamination
      // bug this closes).
      import('./computerUseStatus').then(({ setComputerUseActive }) => {
        setComputerUseActive(false, conversationId);
```

</details>

**依据 3 · 源码核查**：[src/core/agent/toolExecutor.ts:304-345](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/toolExecutor.ts#L304-L345)

Stop与实际在途差别。

<details>
<summary>查看原文（42行）</summary>

```text
      const invokeTool = () => toolInvoker.executeAnyTool(tc.name, effectiveInput, confirmCb, filePermCb, {
        ...toolContext,
        toolCallId: tc.id,
        executionStepId: params.toolCallToStepId.get(tc.id)
          ?? getExecutionPort().getExecutionByLoopId(loopId)?.steps.find((step) => step.toolCallId === tc.id)?.id,
        assistantMessageId: assistantMsgId,
        abortSignal: abortController.signal,
        reportMetadata: checkpointMetadata,
      });

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
          .then((result) => {
            if (!settled) {
              settled = true;
              abortController.signal.removeEventListener('abort', onAbort);
              resolve(result);
            }
          })
          .catch((err) => {
            if (!settled) {
              settled = true;
```

</details>

**依据 4 · 源码核查**：[electron/commandHost.cjs:1097-1112](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/commandHost.cjs#L1097-L1112)

平台/代理实况。

<details>
<summary>查看原文（16行）</summary>

```text
  const timeoutSecs = Math.min(Math.max(1, Number(a.timeout ?? 30) || 30), 300); // default 30s, max 300s
  const commandId = typeof a.commandId === 'string' && a.commandId ? a.commandId : makeCommandId('shell');
  const sandboxEnabled = a.sandboxEnabled !== false; // unwrap_or(true)
  const extraWritablePaths = Array.isArray(a.extraWritablePaths) ? a.extraWritablePaths : [];
  const networkIsolation = !!a.networkIsolation;
  const networkProxyPort = networkIsolation ? getNetworkProxyPort() : undefined;

  const runtimeCommand = shellCommandWithBundledPath(app, command);
  const spec = buildSandboxedCommandSpec(
    runtimeCommand,
    cwd,
    extraWritablePaths,
    sandboxEnabled,
    networkProxyPort,
  );
  const envOverride = bundledRuntimeEnv(app);
```

</details>

**依据 5 · 源码核查**：[electron/secretStore.cjs:186-201](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/electron/secretStore.cjs#L186-L201)

保存失败显式。

<details>
<summary>查看原文（16行）</summary>

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
}
```

</details>

**依据 6 · 源码核查**：[src/core/agent/loopGuards.ts:155-174](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/loopGuards.ts#L155-L174)

试用须正有限配置，非正数无限且轮数非费用。

<details>
<summary>查看原文（20行）</summary>

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
}
```

</details>

**依据 7 · 源码核查**：[src/stores/settingsStore.ts:230-230](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/stores/settingsStore.ts#L230-L230)

存储明确支持显式无限。

```text
  agentMaxTurns?: number; // undefined = 用默认上界 (resolveMaxTurns: DEFAULT_MAX_TURNS); <=0 = 不限制(显式 opt-in)
```

#### 缺口

- 总人工/费用、合格率与恢复体验无同条件对照
  **影响**：轮数不是现金/总资源上限，持续有效工具调用在显式无限配置下不受轮数终止；只能监测资源的可回退副本小样，非已验证生产替代
  **进一步探讨**：读回正有限轮数后同副本任务比较手工/现脚本/Abu，计错漏、返工、实际模型请求/tokens/费用、子进程与停止恢复时间；资源不可观察或超人工阈值则停。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 可证伪生产插件方向是什么？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是面向“办公交付验收/中断后续办”的小组件：以每次真实文件/外部工具动作的身份、授权范围、输入/输出版本和执行状态形成任务收据，要求任务终态与可读成果/未知在途一致，恢复前区分未执行/可能已执行/已验收，而不是再做一个通用多Agent聊天界面。

Abu已经有run/loop归属、checkpoint、工具结果快照/输出捕获和scoped等待，不能声称“已有助手完全没有记录”。新增待验证增量在跨外部工具的业务成果验收与可补偿状态，而非简单再存一份trace；Stop/结束灯与真实后果分离、checkpoint失败只提示边界提供具体研究动机。不会因为有收据就自动逆转发信/远端写入，也不能把审阅记录当OS隔离证明。

最小试验一组相同副本办公任务，在写前/写后未回结果/多工具中断和模型无进展时，比较现Abu记录与附收据/验收规则两组：误判完成、重复写/重复外部请求、丢成果、人工确定实际状态/恢复的时间和额外操作。若现记录已同样可判，或新组件仍无法辨未知且负担更大，则否定独立产品，优先改现有终态/记录消费；未实现不计当前评分。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/agent/toolExecutor.ts:304-345](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/toolExecutor.ts#L304-L345)

前台detach/scoped等待差别。

<details>
<summary>查看原文（42行）</summary>

```text
      const invokeTool = () => toolInvoker.executeAnyTool(tc.name, effectiveInput, confirmCb, filePermCb, {
        ...toolContext,
        toolCallId: tc.id,
        executionStepId: params.toolCallToStepId.get(tc.id)
          ?? getExecutionPort().getExecutionByLoopId(loopId)?.steps.find((step) => step.toolCallId === tc.id)?.id,
        assistantMessageId: assistantMsgId,
        abortSignal: abortController.signal,
        reportMetadata: checkpointMetadata,
      });

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
          .then((result) => {
            if (!settled) {
              settled = true;
              abortController.signal.removeEventListener('abort', onAbort);
              resolve(result);
            }
          })
          .catch((err) => {
            if (!settled) {
              settled = true;
```

</details>

**依据 2 · 源码核查**：[src/core/tools/registry.ts:2653-2680](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/tools/registry.ts#L2653-L2680)

审批后/输出捕获已有机制。

<details>
<summary>查看原文（28行）</summary>

```text
  // Stop can win during any of those awaits; never consume a stale allow by
  // starting a builtin/MCP side effect after the run crossed its abort fence.
  throwIfAborted();

  const files = filesForToolApproval(initialApproval);
  if (files) {
    await files.assertCurrent();
    toolContext = { ...toolContext, files };
  }

  const executionInput = approval.executionInput ?? (approval.executionPath && FILE_TOOL_PATH_MAP[name]
    ? { ...input, path: approval.executionPath }
    : input);

  const captureOutputs = async (result: ToolResult): Promise<void> => {
    if (!outputPlanning) return;
    toolContext?.reportMetadata?.({ outputSnapshotsHandled: true });
    const assertActive = () => {
      outputPlanning.assertCurrent();
      throwIfAborted();
      if (toolContext?.operationOwner && !toolContext.operationOwner.isCurrent()) {
        throw new FileOperationDenied('Error: output capture owner changed');
      }
    };
    assertActive();
    if (!toolContext?.conversationId) return;
    outputCapture = await snapshotToolOutputs(toolContext.conversationId, {
      id: toolContext.toolCallId ?? '', name, input: executionInput,
```

</details>

**依据 3 · 源码核查**：[src/core/agent/agentLoop.ts:2780-2798](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L2780-L2798)

既有消息结果持久化。

<details>
<summary>查看原文（19行）</summary>

```text
        // to disk RIGHT NOW. We must use replaceMessageById (not updateLastMessage)
        // because by the time the next turn's addMessage races with our write, the
        // "last line" may already have shifted to the next turn's placeholder, and
        // updateLastMessage would either clobber the new placeholder or update the
        // wrong line. Awaiting here adds a few ms of latency but guarantees disk
        // state matches in-memory state before the loop continues.
        const turnMsg = getConversationReader().getConversation(conversationId)
          ?.messages.find((m) => m.id === assistantMsgId);
        if (turnMsg) {
          try {
            const { replaceMessageById } = await import('../session/conversationStorage');
            await replaceMessageById(conversationId, turnMsg);
          } catch {
            // Non-critical — message still lives in memory until next finishStreaming
          }
        }

        // Handle MCP tool changes — inject notification into conversation
        if (batchResult.mcpChanged) {
```

</details>

**依据 4 · 源码核查**：[src/core/session/checkpoint.ts:65-77](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/session/checkpoint.ts#L65-L77)

现恢复提示不保证持久。

<details>
<summary>查看原文（13行）</summary>

```text
export async function writeCheckpoint(cp: Checkpoint): Promise<void> {
  try {
    const path = await checkpointPath(cp.conversationId);
    // Ensure directory exists
    const dir = path.substring(0, path.lastIndexOf('/'));
    if (!(await exists(dir))) {
      await mkdir(dir, { recursive: true });
    }
    await writeTextFile(path, JSON.stringify(cp));
  } catch {
    // Non-critical — worst case is no recovery hint on crash
  }
}
```

</details>

**依据 5 · 源码核查**：[src/core/agent/agentLoop.ts:3056-3070](https://github.com/PM-Shawn/Abu-Cowork/blob/fddf2d5a823a15e20e867686441ca5396ed5550a/src/core/agent/agentLoop.ts#L3056-L3070)

终态种类与UI区分。

<details>
<summary>查看原文（15行）</summary>

```text
        // Mark conversation status — error if recovery exhausted, otherwise completed.
        // no_progress is a soft stop (visible marker, status completed) like maxTurns.
        if (awaitingUserRecovery) {
          exitReason = 'awaiting_user';
        } else if (maxTokensRecoveryExhausted) {
          exitReason = 'error';
          exitError = 'Max output tokens recovery exhausted';
        } else if (noProgressAborted || malformedToolCallGaveUp) {
          // 重写后操作仍然写坏：任务没有做成，按未完成交给调用方
          exitReason = 'no_progress';
        }
        chatDelta.setConversationStatus(
          conversationId,
          awaitingUserRecovery ? 'idle' : maxTokensRecoveryExhausted ? 'error' : 'completed',
        );
```

</details>

#### 缺口

- 成果收据/补偿规则未实现、外部任务可验证性和需求未测
  **影响**：只可证伪方向，不假定新插件需求成立
  **进一步探讨**：先上述中断任务盲测，现机制已足够或成本更大则停。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
