# Ruflo

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[631c155](https://github.com/ruvnet/ruflo/tree/631c1557b5f325163c4f9f029a397bb30a61c730)

<!-- BEGIN META -->
[![GitHub ★ 79,217](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=79%2C217&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ruvnet/ruflo) [![npm 30d 49,674](https://img.shields.io/static/v1?label=npm+30d&message=49%2C674&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow)
<!-- END META -->

> **功能**：面向Claude Code、Codex等客户端的Agent元宿主，提供任务、路由、状态与协调工具。

> **亮点**：相对手工分配多个Agent，统一状态、模型执行和观察入口；增量是协调接线而非角色/工具数量或已证实自学习收益。[Q01](#research-q01)

> **主要限制**：静态关键词confidence非成功概率，API无错误也非产物正确；多个JSON状态不构成端到端任务事务，需独立验收和恢复对账。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · Ruflo是什么，协调增量在哪里？](#detail-section-11)
  - [Q02 · 状态、真实调用与恢复如何实现？](#detail-section-12)
  - [Q03 · “自组织与学习”主张的关键质疑是什么？](#detail-section-13)
  - [Q04 · 谁值得试用，如何检验产物验收门的价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有多Agent软件任务的开发者可用CLI/MCP组织分工与状态；独立元宿主，Claude专用mods不外推DSH。[Q01](#research-q01)

同模型预算的单Agent加任务清单与独立测试，是协调收益的必要基线；不能增加Agent/调用后只比较速度。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|任务/Agent状态|分工及进度观察|状态非产物验收|
|Agent执行|调用配置provider|调用费用与重试需计入|
|路由|关键词fallback及其他可选机制|本次未全审计学习路由|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|Node/npx与MCP客户端|MCP路径必需|工具启动|先核对最小连接|
|模型provider及凭据|执行必需|Agent请求|只观察状态无法办结任务|
|Claude Code指定版本/hooks|mods路径必需|原生路由及控制|其他客户端不外推|
|本地状态与独立验收|试用必需|恢复/检查产物|退回单Agent基线|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|隔离项目预览配置|开发者确认变更|恢复项目文件|
|接最小MCP跑固定任务|开发者独立验收产物|查API与任务状态|
|模拟取消崩溃并对账|开发者核对重复/丢失|恢复状态后再重试|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|未知|
|---|---|---|---|
|首次|Node/客户端和可选本地依赖|MCP、项目指令/hooks配置|安装与学习工时|
|持续|多Agent模型、重试和embedding|拆分、合并与独立验收|每合格任务成本|
|失败恢复|JSON和副作用对账、重试|清理孤儿、避免重复工作|跨状态一致性与恢复时间|

#### 效果

|效果项|抽读支持|未知|
|---|---|---|
|状态协调|PID/TTL和部分锁|整体跨文件恢复|
|模型执行|provider API接线|真实任务正确性|
|路由反馈|静态fallback及API成功标签|学习带来的最终质量提升|

> **思考**：静态关键词confidence非成功概率，API无错误也非产物正确；多个JSON状态不构成端到端任务事务，需独立验收和恢复对账。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手工分配多个Agent，统一状态、模型执行和观察入口；增量是协调接线而非角色/工具数量或已证实自学习收益。[Q01](#research-q01)

将UI退出成功与磁盘verify分开、在执行完成后重读Agent注册表保护新修改值得借鉴；仍需跨文件任务身份和业务验收，不能只复用状态看板。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

静态关键词confidence非成功概率，API无错误也非产物正确；多个JSON状态不构成端到端任务事务，需独立验收和恢复对账。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

有明确多Agent需求者可在隔离项目以最小MCP工具试用，先对照单Agent预算验收产物；不把mission/state/API成功当完成。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

抽读支持实际API接线和状态机制；整体swarm、学习及federation效果未验证；验收反馈假设未验证。

- 已检查：作者 README、包清单、源码路径 v3/@claude-flow/cli/src/mcp-tools/swarm-tools.ts、v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts、v3/@claude-flow/cli/src/mcp-tools/task-tools.ts、plugins/ruflo-mods/hooks/route/route-task.ts、plugins/ruflo-swarm/hooks/actions/controller.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：partial clone固定版本抽读swarm/task持久、Agent执行核心、静态route与swarm UI controller；inventory仅文件子集，未审计全部神经memory/federation/mods，未运行。
- 下一步：对照隐藏测试任务，记录正确率、总模型/embedding开销、重复修改、取消崩溃状态与人工恢复；不运行全部动态功能补版式。

**分析版本**

- **仓库**：[ruvnet/ruflo](https://github.com/ruvnet/ruflo)
- **版本号**：3.63.1（[固定提交 631c155](https://github.com/ruvnet/ruflo/tree/631c1557b5f325163c4f9f029a397bb30a61c730)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是将API成功与独立产物验收分通道，只让合格交付影响质量路由；同模型预算隐藏测试对照，若通过率与成本取舍不改善则否定。[Q04](#research-q04)

对照隐藏测试任务，记录正确率、总模型/embedding开销、重复修改、取消崩溃状态与人工恢复；不运行全部动态功能补版式。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：根；内容摘要：d9b95ddd9214ac4be97bc98aeb726fde74bd82442844ccdd4a36a212abe983dc。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 5 | 2516 | 1935 | 407 | — |
| .md | source | 1 | 508 | — | — | 4617 |

</details>

**活跃度**

[![Issue 未关闭 661](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=661&color=737b86&logo=github)](https://github.com/ruvnet/ruflo/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 262](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=262&color=737b86&logo=github)](https://github.com/ruvnet/ruflo/issues?q=is%3Aissue+created%3A2026-09-26T03%3A39%3A21.782Z..2026-10-26T03%3A39%3A21.782Z) [![近30天关闭 288](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=288&color=737b86&logo=github)](https://github.com/ruvnet/ruflo/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A39%3A21.782Z..2026-10-26T03%3A39%3A21.782Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Agent协调、路由和反馈能否改善软件任务办结，当前机制和证据边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Ruflo是什么，协调增量在哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它自称Claude Code/Codex的meta-harness，提供独立CLI/MCP与Claude Code专用console/mods，不是DSH专用插件。目标是把软件任务的分配、角色、记忆和运行状态组织起来，合格结果应是可验收代码/测试，而非创建mission或标记completed。README将MCP工具与Claude原生hooks/mods明确区分，并说明记录的console演示不证明swarm工作完成或memory recall。相对人工分配多个Agent，贡献是统一任务/Agent状态、路由和可观察控制入口；但“100+ agents”和工具数不是同时运行或正确交付的证据。核心模型和各客户端原生能力属于上游，不计为Ruflo自己的推理创新。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-55](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/README.md#L28-L55)

安装面与MCP/原生hook边界

<details>
<summary>查看原文（28行）</summary>

````text
<img src="docs/assets/readme/icons/plugins.svg" width="28" height="28" alt=""> **Start in Claude Code** with core tools, the visual console and runtime mods. Requires Claude Code **2.1.287 or later**. Run inside Claude Code:

```text
/plugin marketplace add ruvnet/ruflo
/plugin install ruflo-core@ruflo
/plugin install ruflo-console@ruflo
/plugin install ruflo-mods@ruflo
/reload-plugins
/ruflo
```

**Core** provides foundation tools. **Console** opens the agent cockpit. **Mods** add routing and policy enforcement inside Claude Code. Mods run with your account's permissions; review their code before installing.

<img src="docs/assets/readme/icons/terminal.svg" width="28" height="28" alt=""> **Using Codex or another MCP enabled tool?** Use NPX for Ruflo project setup and connect your client to the Ruflo MCP server. Run the setup wizard in your project terminal:

```bash
npx ruflo@latest init wizard
```

For clients that support local stdio MCP servers, configure **command** `npx` and **arguments** `["-y", "ruflo@latest", "mcp", "start"]`. The equivalent server command is:

```bash
npx -y ruflo@latest mcp start
```

MCP exposes Ruflo tools to your client. The console and mods above are Claude Code integrations; hook support depends on the client.

<img src="docs/assets/readme/icons/terminal.svg" width="28" height="28" alt=""> **Prefer a plain terminal? Optional.** The console also runs on its own, with no Claude Code: `npx ruflo tui` (add `--plain` to print one frame for scripts). It shows Overview, Cost, Swarm, Events and Missions, plus an optional AI page. [Terminal UI guide](docs/USERGUIDE.md#terminal-ui-optional)
````

</details>

**依据 2 · 作者声明**：[README.md:98-109](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/README.md#L98-L109)

作者元宿主主张及概念流声明

<details>
<summary>查看原文（12行）</summary>

```text
> **Agent = Model + Harness.** The model writes; the harness gives it tools, memory, loops, sandboxes, and controls so it can actually work. **Ruflo is the harness** — the execution layer around Claude Code and Codex that adds 100+ specialized agents, coordinated swarms, self-learning memory, federated comms across machines, and enterprise security guardrails. So agents don't just run, they collaborate.

One `npx ruflo init` gives Claude Code a nervous system: agents self-organize into swarms, learn from every task, remember across sessions, and — with federation — securely talk to agents on other machines without leaking data. You keep writing code. Ruflo handles the coordination.

<p align="center"><img src="docs/assets/readme/learning-cinematic-compact.svg" width="100%" alt="Ruflo trajectory learning: branching memory paths, outcome feedback, contrastive AI and local learning. No LLM required for local vector retrieval and contrastive updates; agent execution may still use an LLM."></p>

<sub>Conceptual learning loop. Local vector retrieval and contrastive updates can run without an LLM; embeddings and configured learning modules are still required. See the <a href="v3/@claude-flow/cli/src/services/ruvector-training.ts">RuVector training integration</a> and <a href="v3/@claude-flow/neural/src/modes/balanced.ts">trajectory contrastive learning</a>.</sub>

<details>
<summary>Architecture in text</summary>

User → Ruflo (CLI/MCP) → Router → Swarm → Agents → Memory → LLM providers. Memory feeds useful experience back into routing. This is a conceptual flow, not a live execution trace.
```

</details>

**依据 3 · 作者声明**：[README.md:148-158](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/README.md#L148-L158)

作者区分mission创建和完成工作

<details>
<summary>查看原文（11行）</summary>

```text
### One task: create a mission with Claude

<img src="docs/assets/readme/console-icon-workflows.svg" width="28" height="28" alt=""> **Watch the recorded console session below.** Claude creates a mission, opens the Learning and Security pages, and reports its actions in Overview.

1. **Set the boundary.** Install the console using the commands below, open `/ruflo`, then choose **Settings → Claude control → write + ask**.
2. **Give a concrete request.** Try: “Create a mission to add a dark mode toggle. Show me the mission and its status.”
3. **Approve creation.** Claude opens Missions and sets the goal. Confirm the pending create action in the console.
4. **Verify the result.** Check that Missions contains the goal and Overview records the action. Creating a mission does not mean the feature has been implemented.
5. **Keep control.** **Take back control** pauses Claude's console tools. A later call should be refused until you restore control.

**What the recording demonstrates:** a real Claude Haiku session with `write + auto`, mission creation, page navigation, a refused swarm stop, and control being taken back. The steps above use `ask` so you approve creation yourself. The linked workflow animation uses sample data, while the theme demo replays renderer frames. Neither is evidence of completed swarm work or memory recall.
```

</details>

#### 缺口

- 没有真实软件任务的协调收益对照
  **影响**：不能证明协调提高任务质量或降低总成本
  **进一步探讨**：同模型预算对照单Agent固定任务，独立验收产物、恢复与全调用成本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态、真实调用与恢复如何实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

swarm-tools在项目.claude-flow/swarm保存JSON，load时按PID存活或旧记录24小时TTL协调孤儿状态；save用临时文件rename，特定pheromone信号更新经wx锁/重试，提供避免幽灵running和部分并发丢写的设计。不能外推所有存储都同锁：task-tools和agent-execute-core各用自己的JSON写入路径。executeAgentTask读取角色/模型，先写busy和taskCount，再实际调用Anthropic/Ollama/OpenRouter路径，结束时重新读取注册表并保护较新createdAt和显式模型选择；这是有真实API接线的执行实现，不能全部叫stub。但这些同步JSON文件之间未在抽读中形成统一事务，进程崩溃后任务、Agent、swarm状态可能需要人工对账。controller把exitCode和磁盘verify分开呈现，值得借鉴；磁盘状态仍不是产物质量验收。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/swarm-tools.ts:79-153](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/v3/%40claude-flow/cli/src/mcp-tools/swarm-tools.ts#L79-L153)

PID/TTL孤儿协调

<details>
<summary>查看原文（75行）</summary>

```text

/**
 * #1799 — return true when `pid` belongs to a live process. process.kill(pid, 0)
 * with signal 0 is the documented liveness probe: ESRCH ⇒ dead, EPERM ⇒ alive
 * but owned by another user (still alive — don't reap), success ⇒ alive.
 */
function isPidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return (e as NodeJS.ErrnoException).code === 'EPERM';
  }
}

/**
 * #1799 — Walk swarms with status='running' and mark orphans as 'terminated':
 *
 *   - PID-based: if `pid` is set and the process is dead, the swarm is an
 *     orphan (host crashed / shell exited / daemon backgrounded poorly).
 *   - TTL fallback: pre-#1799 entries have no `pid`; reap them when their
 *     `updatedAt` is older than 24h. This is conservative — long-idle but
 *     legitimately running swarms can recover by writing a heartbeat.
 *
 * Mutates `store` in place; returns the count for the caller to decide
 * whether to persist.
 */
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
}

// #2085 — exported so `agent-tools.ts agent_spawn` can push into
// `swarm.agents` (the field `swarm_status` reads).
export function loadSwarmStore(): SwarmStore {
  let store: SwarmStore = { swarms: {}, version: '3.0.0' };
  try {
    const path = getSwarmStatePath();
    if (existsSync(path)) {
      store = JSON.parse(readFileSync(path, 'utf-8'));
    }
  } catch { /* fall through with default */ }

  // #1799 — reconcile orphans on every load and persist if anything changed.
  // Cheap (process.kill(pid, 0) is sub-millisecond) and means
  // `swarm_status`/`swarm_health` never see ghost "running" entries.
  const reconciled = reconcileOrphanSwarms(store);
  if (reconciled > 0) {
    try { saveSwarmStore(store); } catch { /* best-effort */ }
  }
  return store;
}
```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/swarm-tools.ts:155-194](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/v3/%40claude-flow/cli/src/mcp-tools/swarm-tools.ts#L155-L194)

原子文件与特定更新锁

<details>
<summary>查看原文（40行）</summary>

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
  }
}

function withSwarmStoreLock<T>(operation: () => T): T {
  ensureSwarmDir();
  const lockPath = join(getSwarmDir(), SWARM_STATE_LOCK);
  let descriptor: number | undefined;
  const waiter = new Int32Array(new SharedArrayBuffer(4));
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      descriptor = openSync(lockPath, 'wx', 0o600);
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      try {
        if (Date.now() - statSync(lockPath).mtimeMs > SWARM_LOCK_STALE_MS) {
          unlinkSync(lockPath);
          continue;
        }
      } catch { /* another writer released it */ }
      Atomics.wait(waiter, 0, 0, 10);
    }
  }
  if (descriptor === undefined) throw new Error('swarm state is busy; retry the outcome update');
  try {
    return operation();
  } finally {
    try { closeSync(descriptor); } catch { /* best effort */ }
    try { unlinkSync(lockPath); } catch { /* best effort */ }
  }
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:615-687](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L615-L687)

Agent模型、busy和实际API调用

<details>
<summary>查看原文（73行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:830-861](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L830-L861)

调用后重新读取并保护更新

<details>
<summary>查看原文（32行）</summary>

```text
  }

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
```

</details>

**依据 5 · 源码核查**：[plugins/ruflo-swarm/hooks/actions/controller.ts:39-76](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/plugins/ruflo-swarm/hooks/actions/controller.ts#L39-L76)

退出成功和状态验证分开

<details>
<summary>查看原文（38行）</summary>

```text
/** Runs one action through the configured CLI and says what happened, checked against the disk where the disk can show it. */
export async function runAction(state: State, host: Host, control: Controller, spec: ActionSpec): Promise<void> {
  const nowMs = () => Date.now()

  state.isActing = true
  state.confirm = null
  host.invalidate()

  try {
    const result = await host.run(argvOf(CLI_PREFIXES[state.options.cli], spec), RUN_MS)
    const ok = result.exitCode === 0
    let verified: 'yes' | 'no' | 'n/a' = 'n/a'

    if (spec.args[0] === 'hooks' && spec.args[1] === 'route') {
      const pick = parseRoute(result.stdout, nowMs())

      if (pick !== null) {
        state.route = pick
        control.persist()
      }

      verified = pick !== null ? 'yes' : 'no'
    } else if (spec.args[0] === 'agent' && spec.args[1] === 'logs') {
      state.detail = { title: spec.label, lines: lastLines(ok ? result.stdout : result.stderr || result.stdout, 40) }
    }

    if (ok && spec.verify !== undefined) {
      await control.refresh()
      verified = state.snapshot !== null && spec.verify(state.snapshot) ? 'yes' : 'no'
    }

    const said = lastLines(ok ? result.stdout : result.stderr || result.stdout, 1)[0] ?? ''

    state.outcome = { label: spec.label, ok, verified, detail: ok ? (verified === 'no' ? `expected ${spec.expect}` : '') : `exit ${result.exitCode}${said !== '' ? `: ${said}` : ''}`, atMs: nowMs() }
  } catch (error) {
    // A refused `$.process.run` (removed by an administrator, or denied above this mod) is a sentence, not a crash.
    state.outcome = { label: spec.label, ok: false, verified: 'n/a', detail: plain(error instanceof Error ? error.message : String(error), 160), atMs: nowMs() }
  } finally {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “自组织与学习”主张的关键质疑是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

抽读route-task是首个关键词匹配的静态规则，命中confidence固定0.6、未命中coder/0.3，不是从数据校准的成功概率，也不能代表全部neural router。其增量是本地可解释低开销fallback，复杂中文或多意图任务有明显表达边界，需实际测。execute core的可选transcript明确resolvedSource=api-success，并在注释承认只证明无API错误、不证明输出正确。这是作者诚实标记的弱反馈，不应被报告升级为“学会成功任务”。若下游把这种标签当质量奖励，可能强化流畅但错误的产物；本轮没有逐行追踪所有训练模块，不能断言已发生污染。关键验证对象应是最终代码正确性与失败恢复，而不是状态健康或API通过。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/ruflo-mods/hooks/route/route-task.ts:21-35](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/plugins/ruflo-mods/hooks/route/route-task.ts#L21-L35)

关键词表及固定先验

<details>
<summary>查看原文（15行）</summary>

```text

/** A real keyword match's heuristic prior (router.cjs, #2257). */
export const MATCH_CONFIDENCE = 0.6

/** `NO_MATCH_CONFIDENCE` in cli/src/mcp-tools/hooks-tools.ts (#3567). */
export const NO_MATCH_CONFIDENCE = 0.3

export const TASK_PATTERNS: ReadonlyArray<{ readonly tokens: readonly string[]; readonly agent: string }> = [
  { tokens: ['implement', 'create', 'build', 'add', 'write code', 'refactor', 'debug'], agent: 'coder' },
  { tokens: ['test', 'tests', 'testing', 'spec', 'specs', 'coverage', 'unit test', 'integration test'], agent: 'tester' },
  { tokens: ['review', 'audit', 'check', 'validate', 'security'], agent: 'reviewer' },
  { tokens: ['research', 'find', 'search', 'documentation', 'explore'], agent: 'researcher' },
  { tokens: ['design', 'architect', 'architecture', 'structure', 'plan'], agent: 'architect' },
  { tokens: ['api', 'endpoint', 'server', 'backend', 'database'], agent: 'backend-dev' },
  { tokens: ['ui', 'frontend', 'component', 'react', 'css', 'style'], agent: 'frontend-dev' },
```

</details>

**依据 2 · 源码核查**：[plugins/ruflo-mods/hooks/route/route-task.ts:59-76](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/plugins/ruflo-mods/hooks/route/route-task.ts#L59-L76)

首匹配及默认fallback

<details>
<summary>查看原文（18行）</summary>

```text
 *
 * @param task the prompt text; anything else routes as no-match
 */
export function routeTask(task: unknown): RouteResult {
  const text = typeof task === 'string' ? task.toLowerCase() : ''

  for (const entry of COMPILED) {
    if (entry.regex.test(text)) {
      return { agent: entry.agent, confidence: MATCH_CONFIDENCE, matched: true, reason: entry.reason }
    }
  }

  return {
    agent: 'coder',
    confidence: NO_MATCH_CONFIDENCE,
    matched: false,
    reason: 'no-match-default',
  }
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:800-823](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L800-L823)

弱API成功标签明确披露

<details>
<summary>查看原文（24行）</summary>

```text
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
```

</details>

#### 缺口

- 静态/神经路由效果及弱反馈下游使用未独立验证
  **影响**：不能证明协调提高任务质量或降低总成本
  **进一步探讨**：同模型预算对照单Agent固定任务，独立验收产物、恢复与全调用成本

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得试用，如何检验产物验收门的价值？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断、新假设与验证

#### 完整回答

建议已有多Agent任务需求且理解本地状态的开发者，在隔离项目接入最小MCP工具试用；不为一个简单任务启用所有mods、memory或federation，也不把Claude原生hook行为外推其他客户端。首次是Node/npx、客户端配置、项目指令与可选hooks修改；持续包括每Agent模型调用、重试、记忆/embedding资源和协调复核，失败恢复包含JSON状态及实际文件副作用对账，具体费用和工时未测。未验证假设是将API成功与独立产物验收分成两个反馈通道，只有测试/人工验收通过才影响质量路由，可减少弱标签偏差。以同模型预算的单Agent和现有Ruflo为基线，对照含隐藏测试的软件任务，记录通过率、重复工作、总调用及恢复人工时间；若质量不升或成本增加不值得，则否定。不把假设计为当前学习贡献。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-53](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/README.md#L39-L53)

mods权限与客户端差异

<details>
<summary>查看原文（15行）</summary>

````text
**Core** provides foundation tools. **Console** opens the agent cockpit. **Mods** add routing and policy enforcement inside Claude Code. Mods run with your account's permissions; review their code before installing.

<img src="docs/assets/readme/icons/terminal.svg" width="28" height="28" alt=""> **Using Codex or another MCP enabled tool?** Use NPX for Ruflo project setup and connect your client to the Ruflo MCP server. Run the setup wizard in your project terminal:

```bash
npx ruflo@latest init wizard
```

For clients that support local stdio MCP servers, configure **command** `npx` and **arguments** `["-y", "ruflo@latest", "mcp", "start"]`. The equivalent server command is:

```bash
npx -y ruflo@latest mcp start
```

MCP exposes Ruflo tools to your client. The console and mods above are Claude Code integrations; hook support depends on the client.
````

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:800-823](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L800-L823)

反馈门假设的弱标签依据

<details>
<summary>查看原文（24行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/task-tools.ts:13-46](https://github.com/ruvnet/ruflo/blob/631c1557b5f325163c4f9f029a397bb30a61c730/v3/%40claude-flow/cli/src/mcp-tools/task-tools.ts#L13-L46)

状态定义非产物验收

<details>
<summary>查看原文（34行）</summary>

```text
// Storage paths
const STORAGE_DIR = '.claude-flow';
const TASK_DIR = 'tasks';
const TASK_FILE = 'store.json';

export const TASK_STATUSES = ['pending', 'in_progress', 'completed', 'failed', 'cancelled'] as const;
type TaskStatus = (typeof TASK_STATUSES)[number];

// Spellings agents write for the same five states (seen in the wild: "complete").
const STATUS_ALIASES: Readonly<Record<string, TaskStatus>> = {
  complete: 'completed', done: 'completed', canceled: 'cancelled',
  running: 'in_progress', 'in-progress': 'in_progress', inprogress: 'in_progress',
};

/** The canonical status for a written one (trimmed, any case, known aliases), or null when it is none of the five. */
export function statusOf(value: unknown): TaskStatus | null {
  if (typeof value !== 'string') return null;
  const key = value.trim().toLowerCase();
  if ((TASK_STATUSES as readonly string[]).includes(key)) return key as TaskStatus;
  return Object.hasOwn(STATUS_ALIASES, key) ? STATUS_ALIASES[key] : null;
}

interface TaskRecord {
  taskId: string;
  type: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: TaskStatus;
  progress: number;
  assignedTo: string[];
  tags: string[];
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
```

</details>

#### 缺口

- 独立验收反馈的对照效果与实际协调成本未知
  **影响**：不能证明协调提高任务质量或降低总成本
  **进一步探讨**：同模型预算对照单Agent固定任务，独立验收产物、恢复与全调用成本

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
