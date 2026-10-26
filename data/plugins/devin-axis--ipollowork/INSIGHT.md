# iPolloWork

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[0de1cc5](https://github.com/Devin-AXIS/iPolloWork/tree/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e)

<!-- BEGIN META -->
[![GitHub ★ 7,286](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C286&color=yellow&logo=github&style=flat)](https://github.com/Devin-AXIS/iPolloWork)
<!-- END META -->

> **实现功能**：独立桌面工作台，连接多种Agent运行时、项目任务与可编辑创作产物。

> **核心亮点**：[Q02](#research-q02)DSH接入采用认证mux和显式pending交互回复，较终端嵌入有协议层增量；根工作台的可编辑产物闭环尚未由这段适配证明。

> **风险与缺陷**：[Q03](#research-q03)流关闭不证明后台turn停止，统一界面也不能代替跨引擎权限和产物恢复验收；当前研究范围不足支撑迁移生产任务。

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
  - [Q01 · 工作台根项目与可单独安装的DSH创作插件是什么关系？](#detail-section-11)
  - [Q02 · DSH会话和审批如何进入工作台？](#detail-section-12)
  - [Q03 · 一个统一界面是否等于统一且可恢复的任务状态？](#detail-section-13)
  - [Q04 · 迁移到独立工作台的投入和退路是什么？](#detail-section-14)
  - [Q05 · 怎样检验工作台统一是否产生可交付价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：iPolloWork根项目是独立桌面工作台，默认OpenCode、可接Codex和DSH；Design/PPT/Video另有可在DSH Web装入的子产品，不能用子插件安装命令代表根应用。目标是多人或多Agent项目将任务、会话与可编辑产物集中管理，原办法为多个运行时界面加文件编辑器。合格结果应是任务与实际产物保持对应、可继续编辑和核对，而非只在一个窗内出现多个引擎名称。本轮聚焦DSH适配切面，尚不足支持全套团队创作闭环收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| DSH会话接入 | 结构化状态和审批事件 | 依赖兼容host协议 |
| 项目工作台 | 组织任务与创作入口 | 完整产物闭环未在本轮验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配系统桌面应用 | 必需 | 独立工作台 | 非根包DSH插件 |
| DSH与provider | 相应会话必需 | 执行 | host不可用 |
| Node/pnpm/Bun及原生工具链 | 源码构建必需 | 桌面/sidecar | 构建无法完成 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户装匹配桌面包 | 工作台启动 |
| 2 | 接DSH测试会话 | 事件与审批对应 |
| 3 | 核对交付物和退出保真 | 不清楚则保留原流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 桌面与sidecar | runtime/provider配置 | 构建更重 |
| 持续 | 模型与编辑进程 | 多版本维护 | 资源成本未知 |
| 失败恢复 | 恢复会话和产物 | 状态对账、迁移 | 保真未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| DSH结构化接入 | mux与pending响应 | 完整交互与断线恢复 |
| 可编辑交付 | 作者定位 | 根应用真实闭环 |

> **思考**：[Q03](#research-q03)流关闭不证明后台turn停止，统一界面也不能代替跨引擎权限和产物恢复验收；当前研究范围不足支撑迁移生产任务。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)DSH接入采用认证mux和显式pending交互回复，较终端嵌入有协议层增量；根工作台的可编辑产物闭环尚未由这段适配证明。

[Q02](#research-q02)DSH接入采用认证mux和显式pending交互回复，较终端嵌入有协议层增量；根工作台的可编辑产物闭环尚未由这段适配证明。

mux逻辑订阅与连接清理、审批pending响应校验有复用价值。当前只抽读DSH切面，未把vendor或全仓LOC当原创与全审计，也不以多个runtime数量证明生产价值。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)流关闭不证明后台turn停止，统一界面也不能代替跨引擎权限和产物恢复验收；当前研究范围不足支撑迁移生产任务。

<a id="detail-section-6"></a>

### 1.5 使用建议

需要多Agent项目与可编辑创作工作台的用户可关注iPolloWork。源码显示DSH结构化会话和审批接入，但根应用的产物闭环及交接节时尚未核查。若当前项目不能验证迁移与退出保真，就继续用原DSH界面和现有编辑器。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、apps/server/src/deepseek-harness-runtime.ts、apps/server/src/deepseek-harness-remote.ts、apps/app/src/react-app/domains/session/engine/deepseek-harness-conversation-engine.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[Devin-AXIS/iPolloWork](https://github.com/Devin-AXIS/iPolloWork)
- **版本号**：0.18.0（[固定提交 0de1cc5](https://github.com/Devin-AXIS/iPolloWork/tree/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出以单项真实交付和可编辑修订闭环验证统一价值的未验证假设，对照原DSH Web加编辑器检查搬运和保真。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1178 | 169354 | — | — | 1485966 |
| .mjs | source | 503 | 115281 | 106468 | 3831 | — |
| .js | source | 2 | 3895 | 2170 | 447 | — |
| .ts | source | 494 | 142034 | 126691 | 6166 | — |
| .ts | test | 249 | 67144 | 61747 | 1244 | — |
| .tsx | source | 313 | 82656 | 75988 | 1431 | — |
| .tsx | test | 16 | 1636 | 1559 | 60 | — |
| .mjs | test | 33 | 7188 | 6578 | 240 | — |
| .cjs | source | 4 | 434 | 369 | 11 | — |
| .jsx | source | 7 | 797 | 781 | 18 | — |
| .md | example | 195 | 26332 | — | — | 238217 |
| .ts | example | 145 | 26487 | 24833 | 895 | — |
| .mjs | example | 81 | 10570 | 10139 | 273 | — |
| .js | example | 27 | 13054 | 12093 | 664 | — |
| .tsx | example | 45 | 11787 | 11604 | 38 | — |
| .mts | example | 1 | 24 | 22 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 60](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=60&color=grey&logo=github&style=flat)](https://github.com/Devin-AXIS/iPolloWork/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=grey&logo=github&style=flat)](https://github.com/Devin-AXIS/iPolloWork/issues?q=is%3Aissue+created%3A2026-09-26T09%3A32%3A03.449Z..2026-10-26T09%3A32%3A03.449Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Devin-AXIS/iPolloWork/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A32%3A03.449Z..2026-10-26T09%3A32%3A03.449Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查iPolloWork的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工作台根项目与可单独安装的DSH创作插件是什么关系？

**研究主题**：场景与需求、采用判断

#### 完整回答

iPolloWork根项目是独立桌面工作台，默认OpenCode、可接Codex和DSH；Design/PPT/Video另有可在DSH Web装入的子产品，不能用子插件安装命令代表根应用。目标是多人或多Agent项目将任务、会话与可编辑产物集中管理，原办法为多个运行时界面加文件编辑器。合格结果应是任务与实际产物保持对应、可继续编辑和核对，而非只在一个窗内出现多个引擎名称。本轮聚焦DSH适配切面，尚不足支持全套团队创作闭环收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-29](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/README.md#L23-L29)

根工作台的产品定位

```text
**The enterprise-grade, local-first Agent Workbench for people and agent teams—one workspace for multiple agent engines, one unified system for plugins and Skills, multi-agent projects and tasks, and editable creation across code, documents, presentations, websites, design, and video.**

https://github.com/user-attachments/assets/201b561a-22ec-4c8e-a4e8-f34172cf0aa3

iPolloWork is the unified workspace layer for the next agent-native way of working. It does not split projects or extensions by runtime: teams coordinate agents, tasks, schedules, plugins, Skills, tools, execution, and editable outputs from one control surface. Describe the outcome; agents plan and execute; your team reviews progress, approves actions, and keeps editing the result in the same place.

iPolloWork is not positioned as a replacement for a single coding agent. It connects [Codex](https://github.com/openai/codex), [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), OpenCode, and future agent runtimes through explicit compatibility boundaries while preserving the native strengths of each ecosystem. Coding is only the starting point: when the output is a deck, web page, visual design, or video, it remains editable instead of becoming a finished file or a chat transcript.
```

**依据 2 · 作者声明**：[README.md:45-65](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/README.md#L45-L65)

默认runtime和独立DSH创作插件区别

<details>
<summary>查看原文（21行）</summary>

````text
## Agent runtime compatibility

OpenCode is the default local execution runtime today. [Codex](https://github.com/openai/codex) and [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) are optional peer runtimes with native session and tool adapters. The [`ipollowork-ui-mcp`](https://www.npmjs.com/package/ipollowork-ui-mcp) control surface also lets external clients operate the desktop. These paths share the workbench while preserving each runtime's capabilities.

The collaboration model keeps iPolloWork as the project workspace: a task can delegate bounded work to DSH subagents when useful, then bring structured progress and results back into the same project. Each runtime retains its own agents, Skills, plugins, and execution model.

### Run iPolloWork creative plugins directly in DeepSeek Harness

DeepSeek Harness users can install iPolloWork's native Design, PPT, and Video views into the DSH Web UI and start them from any project directory:

<p>
  <a href="https://www.npmjs.com/package/deepseek-idesign"><img src="https://img.shields.io/npm/v/deepseek-idesign?label=DeepSeek%20Design&amp;logo=npm&amp;color=CB3837" alt="deepseek-idesign npm version" /></a>
  <a href="https://www.npmjs.com/package/deepseek-ivideo"><img src="https://img.shields.io/npm/v/deepseek-ivideo?label=DeepSeek%20Video&amp;logo=npm&amp;color=CB3837" alt="deepseek-ivideo npm version" /></a>
</p>

```bash
npx @deepseek-ai/dsh plugin --profile web add deepseek-idesign deepseek-ippt deepseek-ivideo
npx @deepseek-ai/dsh web
```

Open [http://127.0.0.1:3080](http://127.0.0.1:3080), start a conversation, and choose **Design**, **PPT**, or **Video**. If the `dsh` command is already installed, replace `npx @deepseek-ai/dsh` with `dsh`. DeepSeek Harness is currently a developer preview, so plugin compatibility follows its active release line.
````

</details>

#### 缺口

- 根应用团队协作与多种编辑产物的真实闭环未覆盖。
  **影响**：根应用核心产物与团队交付仍只有定位，限制直接推荐迁移。
  **进一步探讨**：跟踪一个真实任务从DSH会话到具体编辑器产物、修订和退出导出，核对关联与保真。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH会话和审批如何进入工作台？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

runtime启动参数为web profile加独立patch、随机端口和no-open；RemoteMux用cookie连接/api/remote.mux，在一条连接承载多逻辑订阅。host waterfall收到approval/request或user-questions/request后保留eventId和clientId并向前端emit，respond只接受仍pending且形状有效的回答，再写回$events/result。取消会删除pending映射。相对仅嵌入终端，这是结构化会话与交互适配，可复用原生DSH能力；本轮没有证明整个工作台在所有运行时执行同一种授权语义。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:101-107](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/apps/server/src/deepseek-harness-runtime.ts#L101-L107)

host启动参数

```text
export function deepSeekHarnessWebArgs(
  configuredCli: string,
  patchPath: string,
): string[] {
  const webArgs = ["--profile", "web", "--patch", patchPath, "--port", "0", "--no-open"];
  return configuredCli ? [configuredCli, ...webArgs] : webArgs;
}
```

**依据 2 · 源码核查**：[apps/server/src/deepseek-harness-remote.ts:9-35](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/apps/server/src/deepseek-harness-remote.ts#L9-L35)

cookie认证mux与连接生命周期

<details>
<summary>查看原文（27行）</summary>

```text
/** One authenticated connection carries all logical subscriptions for a consumer. */
export class DeepSeekRemoteMux {
  #socket: WebSocket;
  #streams = new Map<string, { open: () => void; receive: (frame: Record<string, unknown>) => void; finish: (error?: unknown) => void }>();
  #closed = false;

  constructor(baseUrl: string, cookie: string) {
    const url = new URL("/api/remote.mux", baseUrl);
    url.protocol = "ws:";
    this.#socket = new WebSocket(url, { headers: { cookie } });
    this.#socket.on("open", () => { for (const stream of this.#streams.values()) stream.open(); });
    this.#socket.on("message", (data) => {
      try {
        const frame = remoteRecord(JSON.parse(data.toString()));
        if (typeof frame.streamId === "string") this.#streams.get(frame.streamId)?.receive(frame);
      } catch (error) { this.close(error); }
    });
    this.#socket.on("error", (error) => this.close(error));
    this.#socket.on("close", () => this.close(new Error("DSH Remote connection closed")));
  }

  close(error?: unknown) {
    if (this.#closed) return;
    this.#closed = true;
    for (const stream of this.#streams.values()) stream.finish(error);
    if (this.#socket.readyState === WebSocket.OPEN) this.#socket.close();
    else if (this.#socket.readyState === WebSocket.CONNECTING) this.#socket.terminate();
```

</details>

**依据 3 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:899-909](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/apps/server/src/deepseek-harness-runtime.ts#L899-L909)

pending响应验证

<details>
<summary>查看原文（11行）</summary>

```text
  async respond(input: { rpcId: string; result: unknown }): Promise<void> {
    const baseUrl = await this.#ensureStarted();
    const pending = this.#remoteResponses.get(input.rpcId);
    if (!pending) throw new DeepSeekHarnessUnavailableError("DeepSeek Harness request is no longer pending");
    const result = remoteRecord(input.result);
    const value = remoteRecord(result.value);
    const answer = pending.event === "approval/request" ? value.outcome : value.answer;
    if (result.ok !== true || answer === undefined) throw new DeepSeekHarnessUnavailableError("Invalid DeepSeek Harness response");
    await this.#callAtBaseUrl(baseUrl, "$events/result", {
      clientId: pending.clientId, eventId: input.rpcId, outcome: { kind: "result", value: answer },
    });
```

</details>

**依据 4 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:995-1012](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/apps/server/src/deepseek-harness-runtime.ts#L995-L1012)

审批事件投影和取消

<details>
<summary>查看原文（18行）</summary>

```text
            }
            if (stream !== "host") continue;
            if (frame.type === "waterfall" && typeof frame.eventId === "string" && typeof frame.event === "string") {
              if (frame.event !== "approval/request" && frame.event !== "user-questions/request") continue;
              this.#remoteResponses.set(frame.eventId, { clientId, event: frame.event });
              pendingIds.set(frame.eventId, { event: frame.event, sessionId: frame.agentId });
              emit({ ...remoteRecord(frame.request), sessionId: frame.agentId, approvalId: frame.eventId,
                type: frame.event === "approval/request" ? "approval/requested" : "question/requested",
              }, frame.eventId);
            }
            if (frame.type === "cancel" && typeof frame.eventId === "string") {
              const pending = pendingIds.get(frame.eventId);
              if (pending) emit({
                type: pending.event === "approval/request" ? "approval/resolved" : "question/resolved",
                sessionId: pending.sessionId, approvalId: frame.eventId, questionRpcId: frame.eventId,
              });
              this.#remoteResponses.delete(frame.eventId);
              pendingIds.delete(frame.eventId);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 一个统一界面是否等于统一且可恢复的任务状态？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

不是。mux断开会finish所有stream，并将关闭作为错误，启动就绪有15秒期限；它解决流资源释放，不能自动证明持久turn停止或重发无副作用。runtime pending表在内存中，重启后的悬挂交互与会话归属需要继续核对。前端权限列表区分read-only/workspace-write/full-access，真正执行边界仍在对应DSH宿主和插件配置。多引擎共同UI不能代替逐引擎协议验收，也不能把local-first解释为模型数据不离开机器。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/deepseek-harness-remote.ts:30-60](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/apps/server/src/deepseek-harness-remote.ts#L30-L60)

断流和等待就绪边界

<details>
<summary>查看原文（31行）</summary>

```text
  close(error?: unknown) {
    if (this.#closed) return;
    this.#closed = true;
    for (const stream of this.#streams.values()) stream.finish(error);
    if (this.#socket.readyState === WebSocket.OPEN) this.#socket.close();
    else if (this.#socket.readyState === WebSocket.CONNECTING) this.#socket.terminate();
  }

  async *stream(endpoint: string, args: Record<string, unknown>, signal: AbortSignal): AsyncGenerator<Record<string, unknown>> {
    signal.throwIfAborted();
    if (this.#closed) throw new Error("DSH Remote connection is closed");
    const socket = this.#socket;
    const streamId = randomUUID();
    let controller: ReadableStreamDefaultController<Record<string, unknown>>;
    let closed = false;
    const finish = (error?: unknown) => {
      if (closed) return;
      closed = true;
      clearTimeout(timeout);
      signal.removeEventListener("abort", abort);
      if (error) controller.error(error);
      else controller.close();
      this.#streams.delete(streamId);
      if (!this.#closed && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: "cancel", streamId }));
    };
    const abort = () => finish(signal.reason);
    const source = new ReadableStream<Record<string, unknown>>({
      start(value) { controller = value; },
      cancel() { finish(); },
    });
    const timeout = setTimeout(() => finish(new Error("DSH Remote stream did not become ready")), 15_000);
```

</details>

**依据 2 · 源码核查**：[apps/app/src/react-app/domains/session/engine/deepseek-harness-conversation-engine.ts:47-55](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/apps/app/src/react-app/domains/session/engine/deepseek-harness-conversation-engine.ts#L47-L55)

前端权限选项

```text
function defaultPermissionSelect(): PermissionSelect {
  return {
    currentValue: "workspace-write",
    options: [
      { value: "read-only", name: "read-only" },
      { value: "workspace-write", name: "workspace-write" },
      { value: "danger-full-access", name: "danger-full-access" },
    ],
  };
```

**依据 3 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:995-1012](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/apps/server/src/deepseek-harness-runtime.ts#L995-L1012)

pending是内存映射

<details>
<summary>查看原文（18行）</summary>

```text
            }
            if (stream !== "host") continue;
            if (frame.type === "waterfall" && typeof frame.eventId === "string" && typeof frame.event === "string") {
              if (frame.event !== "approval/request" && frame.event !== "user-questions/request") continue;
              this.#remoteResponses.set(frame.eventId, { clientId, event: frame.event });
              pendingIds.set(frame.eventId, { event: frame.event, sessionId: frame.agentId });
              emit({ ...remoteRecord(frame.request), sessionId: frame.agentId, approvalId: frame.eventId,
                type: frame.event === "approval/request" ? "approval/requested" : "question/requested",
              }, frame.eventId);
            }
            if (frame.type === "cancel" && typeof frame.eventId === "string") {
              const pending = pendingIds.get(frame.eventId);
              if (pending) emit({
                type: pending.event === "approval/request" ? "approval/resolved" : "question/resolved",
                sessionId: pending.sessionId, approvalId: frame.eventId, questionRpcId: frame.eventId,
              });
              this.#remoteResponses.delete(frame.eventId);
              pendingIds.delete(frame.eventId);
```

</details>

#### 缺口

- UI审批卡到真实目标操作、重启恢复及跨引擎权限一致性尚未验收。
  **影响**：断流与挂起审批可能形成未知执行结果，权限UI不能独立证明执行边界。
  **进一步探讨**：在隔离项目核对审批卡回传到宿主操作、取消和重启后pending状态，以及各引擎权限映射。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 迁移到独立工作台的投入和退路是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次下载匹配OS/CPU的桌面包并配置runtime/provider；源码构建另需Node22+、pnpm11、Bun及平台原生工具链。持续维护桌面、sidecar、DSH和创作编辑器多版本，模型及外部服务成本仍取决于用户渠道。失败时可退回原DSH Web/CLI，但任务与工作台编辑产物的迁移保真尚不明确。没有端到端收益与恢复数据前，不建议仅为“多引擎统一”迁移正在交付的项目；可以关注独立创作插件，但不能用它们替代根应用验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:69-100](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/README.md#L69-L100)

安装与源码构建依赖

<details>
<summary>查看原文（32行）</summary>

```text
### Download the desktop app

Official installers are published on [GitHub Releases](https://github.com/Devin-AXIS/iPolloWork/releases). If you prefer a manual download, choose the file that matches both your operating system and CPU:

| System | CPU | Installer to use |
| --- | --- | --- |
| macOS | Apple Silicon (M-series) | `ipollowork-mac-arm64-<version>.dmg` |
| macOS | Intel | `ipollowork-mac-x64-<version>.dmg` |
| Windows | Intel/AMD 64-bit | `ipollowork-win-x64-<version>.exe` |
| Windows | ARM64 | `ipollowork-win-arm64-<version>.exe` |
| Linux | Intel/AMD 64-bit | `ipollowork-linux-x64-<version>.AppImage` |
| Linux | ARM64 | `ipollowork-linux-arm64-<version>.AppImage` |

The macOS `.zip` and Linux `.tar.gz` files are portable/update artifacts; most users should choose `.dmg`, `.exe`, or `.AppImage`. If the Releases page does not yet contain an installer for your system, run or package the app from source below.

Installation after downloading:

- **macOS:** open the `.dmg`, then drag **iPolloWork** into Applications.
- **Windows:** run the `.exe` installer. A locally built, unsigned installer may trigger Microsoft Defender SmartScreen.
- **Linux:** make the AppImage executable with `chmod +x ipollowork-*.AppImage`, then run it. The `.tar.gz` package can be extracted and run without installation.

### Requirements for source development and packaging

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download) 22 or newer
- pnpm 11, enabled through Corepack with `corepack enable`
- [Bun](https://bun.sh/docs/installation) 1.3.10 or newer, used to build the local Orchestrator sidecar
- macOS: Xcode Command Line Tools (`xcode-select --install`)
- Windows: [Visual Studio 2022 Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with **Desktop development with C++** and the Windows SDK; use PowerShell or Command Prompt
- Linux: a standard Electron build environment with a C/C++ toolchain, Python 3, `pkg-config`, and the desktop libraries required by Electron; the release build uses Ubuntu 22.04

OpenCode is downloaded and prepared as a separate sidecar during the first desktop build. iPolloWork does not fork or rewrite OpenCode, and OpenCode can continue to be upgraded independently.
```

</details>

**依据 2 · 作者声明**：[README.md:45-65](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/README.md#L45-L65)

原生runtime与插件单独入口

<details>
<summary>查看原文（21行）</summary>

````text
## Agent runtime compatibility

OpenCode is the default local execution runtime today. [Codex](https://github.com/openai/codex) and [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) are optional peer runtimes with native session and tool adapters. The [`ipollowork-ui-mcp`](https://www.npmjs.com/package/ipollowork-ui-mcp) control surface also lets external clients operate the desktop. These paths share the workbench while preserving each runtime's capabilities.

The collaboration model keeps iPolloWork as the project workspace: a task can delegate bounded work to DSH subagents when useful, then bring structured progress and results back into the same project. Each runtime retains its own agents, Skills, plugins, and execution model.

### Run iPolloWork creative plugins directly in DeepSeek Harness

DeepSeek Harness users can install iPolloWork's native Design, PPT, and Video views into the DSH Web UI and start them from any project directory:

<p>
  <a href="https://www.npmjs.com/package/deepseek-idesign"><img src="https://img.shields.io/npm/v/deepseek-idesign?label=DeepSeek%20Design&amp;logo=npm&amp;color=CB3837" alt="deepseek-idesign npm version" /></a>
  <a href="https://www.npmjs.com/package/deepseek-ivideo"><img src="https://img.shields.io/npm/v/deepseek-ivideo?label=DeepSeek%20Video&amp;logo=npm&amp;color=CB3837" alt="deepseek-ivideo npm version" /></a>
</p>

```bash
npx @deepseek-ai/dsh plugin --profile web add deepseek-idesign deepseek-ippt deepseek-ivideo
npx @deepseek-ai/dsh web
```

Open [http://127.0.0.1:3080](http://127.0.0.1:3080), start a conversation, and choose **Design**, **PPT**, or **Video**. If the `dsh` command is already installed, replace `npx @deepseek-ai/dsh` with `dsh`. DeepSeek Harness is currently a developer preview, so plugin compatibility follows its active release line.
````

</details>

#### 缺口

- 真实迁移/退出时编辑产物和任务历史保真、部署人时及资源占用未知。
  **影响**：迁移可能增加工作台专属状态与恢复负担。
  **进一步探讨**：导出/重开同一任务和编辑产物，记录保真、凭据清理、部署与失败恢复人时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验工作台统一是否产生可交付价值？

**研究主题**：新假设与验证

#### 完整回答

由结构化DSH事件和独立编辑产物定位，推导未验证假设：将一项真实交付限定为“需求—执行会话—可编辑产物—用户修订”并保存稳定对应关系，可能比扩大引擎名单更能降低交接遗漏。与原DSH Web加原编辑器对照同一小型交付，记录修订后是否仍可编辑、任务状态是否正确和人工搬运时间。若只能聚合聊天而不能保留产物语义与退出保真，就不把它视为新生产工作流。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-29](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/README.md#L27-L29)

可编辑产物主张

```text
iPolloWork is the unified workspace layer for the next agent-native way of working. It does not split projects or extensions by runtime: teams coordinate agents, tasks, schedules, plugins, Skills, tools, execution, and editable outputs from one control surface. Describe the outcome; agents plan and execute; your team reviews progress, approves actions, and keeps editing the result in the same place.

iPolloWork is not positioned as a replacement for a single coding agent. It connects [Codex](https://github.com/openai/codex), [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), OpenCode, and future agent runtimes through explicit compatibility boundaries while preserving the native strengths of each ecosystem. Coding is only the starting point: when the output is a deck, web page, visual design, or video, it remains editable instead of becoming a finished file or a chat transcript.
```

**依据 2 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:985-1012](https://github.com/Devin-AXIS/iPolloWork/blob/0de1cc50c24395fed7cfbb21ff6d933cdce1f52e/apps/server/src/deepseek-harness-runtime.ts#L985-L1012)

会话事件可作为对应关系基础

<details>
<summary>查看原文（28行）</summary>

```text
              if (stream === "mux" && frame.event === "api-session/added") {
                const session = remoteRecord(first);
                if (typeof session.sessionId === "string") observe({ sessionId: session.sessionId,
                  cwd: typeof session.cwd === "string" ? session.cwd : undefined });
              }
              if (stream === "host" && typeof first === "string") {
                if (frame.event === "api-session/removed") emit({ type: "host/session-removed", sessionId: first });
                if (frame.event === "api-session/error") emit({ type: "host/agent-error", sessionId: first, message: second });
                if (frame.event === "api-session/status") emit({ type: "host/session-status", sessionId: first, running: second });
              }
            }
            if (stream !== "host") continue;
            if (frame.type === "waterfall" && typeof frame.eventId === "string" && typeof frame.event === "string") {
              if (frame.event !== "approval/request" && frame.event !== "user-questions/request") continue;
              this.#remoteResponses.set(frame.eventId, { clientId, event: frame.event });
              pendingIds.set(frame.eventId, { event: frame.event, sessionId: frame.agentId });
              emit({ ...remoteRecord(frame.request), sessionId: frame.agentId, approvalId: frame.eventId,
                type: frame.event === "approval/request" ? "approval/requested" : "question/requested",
              }, frame.eventId);
            }
            if (frame.type === "cancel" && typeof frame.eventId === "string") {
              const pending = pendingIds.get(frame.eventId);
              if (pending) emit({
                type: pending.event === "approval/request" ? "approval/resolved" : "question/resolved",
                sessionId: pending.sessionId, approvalId: frame.eventId, questionRpcId: frame.eventId,
              });
              this.#remoteResponses.delete(frame.eventId);
              pendingIds.delete(frame.eventId);
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
