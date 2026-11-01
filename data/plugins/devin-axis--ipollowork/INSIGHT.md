# iPolloWork

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d21e5d5](https://github.com/Devin-AXIS/iPolloWork/tree/d21e5d5a0f6bf493f3da3df37895abf106d88af6)

<!-- BEGIN META -->
[![GitHub ★ 7,326](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C326&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Devin-AXIS/iPolloWork)
<!-- END META -->

> **功能**：提供多 Agent 运行时、项目任务和可编辑创作产物的独立工作台。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明独立工作台提供项目与 DSH 会话适配；上游引擎、模型和 DSH 子插件不归因于根应用。

> **主要限制**：[Q03](#research-q03) 订阅关闭、执行终态和产物验收是不同事实；已有媒体检查也不覆盖视觉和全部引擎。

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
  - [Q01 · 工作台根项目与 DSH 创作子插件是什么关系？](#detail-section-11)
  - [Q02 · DSH 会话、审批和事件如何进入工作台？](#detail-section-12)
  - [Q03 · 断流与任务完成是否等于产物验收？](#detail-section-13)
  - [Q04 · 采用条件、成本和退出路径是什么？](#detail-section-14)
  - [Q05 · 如何验证统一工作台的交付价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要在项目中组织多个 Agent 会话和可编辑产物、并能独立验收结果的用户。

原生 Agent 界面加文件编辑器已能执行任务；工作台集中会话与项目入口，实际协作收益和效果尚未对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 项目工作台 | 组织多引擎会话和任务 | 根应用需单独安装和配置 |
| DSH 适配 | 在项目中调用会话及交互 | 依赖兼容上游，未验证宿主 |
| 事件桥接 | 展示实时事件与待答项 | 断流不能证明后台结束 |
| 产物检查 | 对部分媒体回执与文件做核查 | 视觉和跨引擎结果需独立验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 桌面或服务器运行环境 | 必需 | 工作台与项目服务 | 无法使用根应用 |
| 兼容 DSH 运行时 | DSH 会话必需 | prompt、事件与审批 | 该引擎不可用 |
| 模型和凭据 | 模型任务必需 | 推理调用 | 无法完成相应任务 |
| 工作区和授权 | 项目任务必需 | 访问及修改文件 | 拒绝或回原生检查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户复制项目并核对环境 | 保留原生引擎与原始文件 |
| 会话 | 启动 DSH 只读任务并检查绑定 | 状态和审批可核对 |
| 观察 | 用户检查事件及最终结果 | 断流时回查原生状态 |
| 交付 | 在原生应用打开和复核产物 | 不以单独完成状态代替验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 桌面、模型及服务费用未知 | 版本和项目迁移核对 | 平台工具链不同 |
| 使用 | 模型、存储和网络开销未知 | 审批与产物复核 | 净节时未测 |
| 失败 | 可能有重试及外部效果 | 检查原生任务与文件 | 断流不证明停止 |
| 退出 | 原始数据备份资源 | 恢复原生引擎入口 | 不自动撤销外部操作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| DSH 会话 | 工作区路由及事件映射 | 目标宿主实际可用性 |
| 可编辑产物 | 作者描述及部分媒体检查 | 跨格式、视觉和播放质量 |
| 多引擎 | 作者定义不同运行时入口 | 相同任务净收益 |

> **思考**：[Q03](#research-q03) 订阅关闭、执行终态和产物验收是不同事实；已有媒体检查也不覆盖视觉和全部引擎。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明独立工作台提供项目与 DSH 会话适配；上游引擎、模型和 DSH 子插件不归因于根应用。

[Q02](#research-q02) 对本地启动 token、workspace scope 和 pending 交互分别接线；[Q03](#research-q03) 订阅取消与 session.cancel 含义不同，不能从一个推断另一个。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 订阅关闭、执行终态和产物验收是不同事实；已有媒体检查也不覆盖视觉和全部引擎。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在副本观察一项只读 DSH 会话与原生产物；权限、终态或来源不明时停止并回原生引擎核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 DSH 代表性请求、审批及事件桥接；多引擎协作、桌面、真实产物与未来假设未执行。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、apps/server/src/routes/deepseek-harness.ts、apps/server/src/deepseek-harness-runtime.ts、apps/server/src/deepseek-harness-remote.ts、apps/server/src/artifact-media.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态检查根 README、DSH server 路由、认证、Remote 订阅与媒体代表性校验；未全审桌面、其他引擎、插件或云服务。材料仅统计 Markdown 和指定 JS/TS，其他语言未计入。
- 下一步：固定工作台和 DSH 版本，在隔离项目注入断流、取消和权限审批，独立检查原生状态与可编辑产物；按 [Q05](#research-q05) 对照跨引擎验收视图。

**分析版本**

- **仓库**：[Devin-AXIS/iPolloWork](https://github.com/Devin-AXIS/iPolloWork)
- **版本号**：0.18.0（[固定提交 d21e5d5](https://github.com/Devin-AXIS/iPolloWork/tree/d21e5d5a0f6bf493f3da3df37895abf106d88af6)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设跨引擎显示原生终态、产物版本和未知范围可降低误认完成；需对照已有媒体回执及人工方式，效果未验证。

固定工作台和 DSH 版本，在隔离项目注入断流、取消和权限审批，独立检查原生状态与可编辑产物；按 [Q05](#research-q05) 对照跨引擎验收视图。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1178 | 169398 | — | — | 1487154 |
| .mjs | source | 508 | 115712 | 106885 | 3865 | — |
| .js | source | 2 | 3895 | 2170 | 447 | — |
| .ts | source | 494 | 142073 | 126718 | 6175 | — |
| .ts | test | 249 | 67312 | 61908 | 1251 | — |
| .tsx | source | 313 | 82645 | 75980 | 1431 | — |
| .tsx | test | 16 | 1636 | 1559 | 60 | — |
| .mjs | test | 35 | 7498 | 6871 | 248 | — |
| .cjs | source | 4 | 434 | 369 | 11 | — |
| .jsx | source | 7 | 797 | 781 | 18 | — |
| .md | example | 195 | 26333 | — | — | 238387 |
| .ts | example | 145 | 26499 | 24845 | 895 | — |
| .mjs | example | 81 | 10579 | 10148 | 273 | — |
| .js | example | 27 | 13054 | 12093 | 664 | — |
| .tsx | example | 45 | 11787 | 11604 | 38 | — |
| .mts | example | 1 | 24 | 22 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 60](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=60&color=737b86&logo=github)](https://github.com/Devin-AXIS/iPolloWork/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/Devin-AXIS/iPolloWork/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Devin-AXIS/iPolloWork/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根工作台与 DSH 子插件身份、会话适配及任务成果边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工作台根项目与 DSH 创作子插件是什么关系？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

iPolloWork 根项目是独立桌面工作台，旨在让用户围绕项目组织多种 Agent 会话、任务和可编辑产物；根 package 是 private workspace，不是 DSH 插件。作者把 OpenCode 描述为默认运行时，Codex 和 DSH 是可选运行时；Design、PPT、Video 可作为独立 DSH Web 子插件安装，不能用其安装命令代表工作台本体。原办法是分别使用各 Agent 界面和文件编辑器；可能增量为同一项目视图和适配入口，而不是上游模型、DSH 或 Office 引擎。未进行同任务对照，不证明团队协作效率或产物质量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/package.json#L1-L4)

私有根工作区名称与版本。

```text
{
  "name": "@ipollo/ipollowork-workspace",
  "private": true,
  "version": "0.18.0",
```

**依据 2 · 作者声明**：[README.md:23-29](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/README.md#L23-L29)

作者描述独立工作台及多引擎定位。

```text
**The enterprise-grade, local-first Agent Workbench for people and agent teams—one workspace for multiple agent engines, one unified system for plugins and Skills, multi-agent projects and tasks, and editable creation across code, documents, presentations, websites, design, and video.**

https://github.com/user-attachments/assets/201b561a-22ec-4c8e-a4e8-f34172cf0aa3

iPolloWork is the unified workspace layer for the next agent-native way of working. It does not split projects or extensions by runtime: teams coordinate agents, tasks, schedules, plugins, Skills, tools, execution, and editable outputs from one control surface. Describe the outcome; agents plan and execute; your team reviews progress, approves actions, and keeps editing the result in the same place.

iPolloWork is not positioned as a replacement for a single coding agent. It connects [Codex](https://github.com/openai/codex), [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), OpenCode, and future agent runtimes through explicit compatibility boundaries while preserving the native strengths of each ecosystem. Coding is only the starting point: when the output is a deck, web page, visual design, or video, it remains editable instead of becoming a finished file or a chat transcript.
```

**依据 3 · 作者声明**：[README.md:45-53](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/README.md#L45-L53)

作者区分默认和可选引擎及 DSH 子插件。

```text
## Agent runtime compatibility

OpenCode is the default local execution runtime today. [Codex](https://github.com/openai/codex) and [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) are optional peer runtimes with native session and tool adapters. The [`ipollowork-ui-mcp`](https://www.npmjs.com/package/ipollowork-ui-mcp) control surface also lets external clients operate the desktop. These paths share the workbench while preserving each runtime's capabilities.

The collaboration model keeps iPolloWork as the project workspace: a task can delegate bounded work to DSH subagents when useful, then bring structured progress and results back into the same project. Each runtime retains its own agents, Skills, plugins, and execution model.

### Run iPolloWork creative plugins directly in DeepSeek Harness

DeepSeek Harness users can install iPolloWork's native Design, PPT, and Video views into the DSH Web UI and start them from any project directory:
```

**依据 4 · 作者声明**：[README.md:195-209](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/README.md#L195-L209)

作者描述工作台边界与云服务。

<details>
<summary>查看原文（15行）</summary>

````text
                                                   │
                                                   ├── local API ──> Engine Protocol ──> OpenCode (default)
                                                   │                               ├──> Codex (optional)
                                                   │                               └──> DeepSeek Harness (optional)
                                                   └── optional account/control requests ──> iPolloCloud
```

- Agent execution, task state, and streaming are normalized at the shared engine boundary while engine-native behavior remains inside its adapter.
- Portable Skills, plugins, MCP servers, and project capabilities use one lifecycle; engine-specific enhancements stay optional.
- Each conversation selects its execution engine and optional work template. Projects supply shared goals and resources. Templates provide examples, Skills and result criteria; each engine owns planning, subagents, coordination, checks and final results.
- Existing template role prompts and Skill references are projected into namespaced native OpenCode subagents and Codex role configuration. Built-in workers remain available; templates do not require a fixed worker count or execution order. Conversation-specific role edits remain scoped task guidance.
- iPolloWork displays native execution and scoped artifacts. It does not add hidden repair prompts, restart native agent work, or run a second delivery workflow in the client. Existing media and render tools remain available to the engine.
- iPolloCloud handles identity, organizations, entitlements, hosted worker lifecycle, administration, and commercial Apps.
- The Cloud connection is optional. Local iPolloWork works without an account or commercial service.
- OpenCode and DeepSeek Harness remain independent components and can continue to evolve without turning iPolloWork into a fork of either runtime.
````

</details>

#### 缺口

- 缺少多引擎真实任务、产物与人工成本比较
  **影响**：无法推断统一工作台的净收益
  **进一步探讨**：用同一任务和项目对比原生各引擎与工作台，并验收实际产物。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 会话、审批和事件如何进入工作台？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

server 的 DSH prompt 路由要求 collaborator scope、非空 sessionId、可写资源并解析实际工作区会话；确认引擎匹配后准备插件并调用 workspace runtime 的 session.prompt。RPC 路由使用方法白名单，写方法要求 collaborator，create/fork 绑定工作台会话。runtime 将 loopback 启动 URL 的 token 交换为 cookie，再用 Remote mux 发送多路订阅；事件路径把 approval/request 和 user-questions/request 映射给客户端，respond 按 pending rpcId 验证结果并回传。它连接工作台与 DSH 的现有协议，不证明 UI 已渲染、审批语义在所有引擎一致或 DSH 版本兼容。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/routes/deepseek-harness.ts:126-147](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/routes/deepseek-harness.ts#L126-L147)

prompt scope、会话绑定和真实 runtime 调用。

<details>
<summary>查看原文（22行）</summary>

```text
  addRoute(routes, "POST", "/workspace/:id/engine/deepseek-harness/prompt", "client", async (ctx) => {
    requireClientScope(ctx, "collaborator");
    let workspace: WorkspaceInfo = { ...await resolveWorkspace(config, ctx.params.id), engineId: DEEPSEEK_HARNESS_ENGINE_ID };
    const body = await readJsonBody(ctx.request);
    if (!isRecord(body.payload) || typeof body.payload.sessionId !== "string" || !body.payload.sessionId.trim()) {
      throw new ApiError(400, "invalid_payload", "A DeepSeek Harness sessionId is required");
    }
    await assertResourceWritable(config, workspace.id, body.payload.sessionId.trim());
    workspace = await resolveWorkspaceSession(config, await resolveWorkspace(config, ctx.params.id), body.payload.sessionId.trim(), { deepseekHarness: runtime });
    if (workspace.engineId !== DEEPSEEK_HARNESS_ENGINE_ID) {
      throw new ApiError(409, "session_engine_mismatch", "This conversation is bound to a different engine");
    }
    const promptPayload = await withPluginPromptInstructions(
      config,
      body.payload,
      parseEnginePluginPromptSelection(body.plugins),
    );
    rememberSessionContext(workspace.id, body.payload.sessionId.trim());
    await options.preparePlugins(workspace);
    try {
      await runtime.forWorkspace(workspace).call("session.prompt", promptPayload);
      options.monitorSessionExecution?.(workspace, body.payload.sessionId.trim());
```

</details>

**依据 2 · 源码核查**：[apps/server/src/routes/deepseek-harness.ts:154-176](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/routes/deepseek-harness.ts#L154-L176)

RPC 白名单、权限和会话校验。

<details>
<summary>查看原文（23行）</summary>

```text
  addRoute(routes, "POST", "/workspace/:id/engine/deepseek-harness/rpc", "client", async (ctx) => {
    let workspace: WorkspaceInfo = { ...await resolveWorkspace(config, ctx.params.id), engineId: DEEPSEEK_HARNESS_ENGINE_ID };
    const body = await readJsonBody(ctx.request);
    const method = typeof body.method === "string" ? body.method.trim() : "";
    if (!ALLOWED_METHODS.has(method)) {
      throw new ApiError(400, "invalid_payload", `Unsupported DeepSeek Harness method: ${method || "missing"}`);
    }
    if (!READ_METHODS.has(method)) requireClientScope(ctx, "collaborator");
    const sessionId = isRecord(body.payload) && typeof body.payload.sessionId === "string"
      ? body.payload.sessionId.trim()
      : "";
    await assertResourceWritable(config, workspace.id, sessionId);
    if (sessionId) {
      workspace = await resolveWorkspaceSession(config, await resolveWorkspace(config, ctx.params.id), sessionId, { deepseekHarness: runtime });
      if (workspace.engineId !== DEEPSEEK_HARNESS_ENGINE_ID) {
        throw new ApiError(409, "session_engine_mismatch", "This conversation is bound to a different engine");
      }
    }
    if (["session.create", "session.fork", "commands/execute"].includes(method)) await options.preparePlugins(workspace);
    try {
      const value = await runtime.forWorkspace(workspace).call(method, body.payload ?? {});
      if (method === "commands/execute" && sessionId) options.monitorSessionExecution?.(workspace, sessionId);
      if ((method === "session.create" || method === "session.fork") && isRecord(value) && typeof value.sessionId === "string") {
```

</details>

**依据 3 · 源码核查**：[apps/server/src/routes/deepseek-harness.ts:189-200](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/routes/deepseek-harness.ts#L189-L200)

客户端审批/回答入口。

<details>
<summary>查看原文（12行）</summary>

```text
  addRoute(routes, "POST", "/workspace/:id/engine/deepseek-harness/respond", "client", async (ctx) => {
    requireClientScope(ctx, "collaborator");
    const workspace: WorkspaceInfo = { ...await resolveWorkspace(config, ctx.params.id), engineId: DEEPSEEK_HARNESS_ENGINE_ID };
    const workspaceRuntime = runtime.forWorkspace(workspace);
    const body = await readJsonBody(ctx.request);
    const rpcId = typeof body.rpcId === "string" ? body.rpcId.trim() : "";
    if (!rpcId || !("result" in body)) {
      throw new ApiError(400, "invalid_payload", "rpcId and result are required");
    }
    try {
      await workspaceRuntime.respond({ rpcId, result: body.result });
      return Response.json({ ok: true });
```

</details>

**依据 4 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:455-470](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/deepseek-harness-runtime.ts#L455-L470)

只接受本地带 token 的启动 URL 并换取 cookie。

<details>
<summary>查看原文（16行）</summary>

```text
export async function authenticateDeepSeekHarness(
  launchUrl: string,
  fetcher: typeof fetch = fetch,
): Promise<{ baseUrl: string; cookie: string }> {
  const url = new URL(launchUrl);
  if (url.protocol !== "http:" || url.hostname !== "127.0.0.1" || !url.searchParams.get("token")) {
    throw new DeepSeekHarnessUnavailableError("DeepSeek Harness returned an invalid local authentication URL");
  }
  // Exchange the process token once. Never persist it or forward it to Work clients.
  const response = await fetcher(url, { redirect: "manual", signal: AbortSignal.timeout(5_000) });
  const cookie = response.headers.getSetCookie().map((value) => value.split(";", 1)[0]).join("; ");
  await response.body?.cancel();
  if (response.status !== 303 || !cookie) {
    throw new DeepSeekHarnessUnavailableError("DeepSeek Harness authentication failed");
  }
  return { baseUrl: url.origin, cookie };
```

</details>

**依据 5 · 源码核查**：[apps/server/src/deepseek-harness-remote.ts:9-24](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/deepseek-harness-remote.ts#L9-L24)

cookie mux 与流路由。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:899-910](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/deepseek-harness-runtime.ts#L899-L910)

pending 请求校验和回复。

<details>
<summary>查看原文（12行）</summary>

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
    this.#remoteResponses.delete(input.rpcId);
```

</details>

**依据 7 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:974-1004](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/deepseek-harness-runtime.ts#L974-L1004)

事件转换与待答项登记。

<details>
<summary>查看原文（31行）</summary>

```text
          for await (const frame of connection.stream("$events", {}, combined)) {
            if (frame.type === "ready" && typeof frame.clientId === "string") {
              clientId = frame.clientId;
              // Subscribe first: additions during the initial list stay queued on this stream.
              if (stream === "mux") {
                const sessions = await this.#callAtBaseUrl<{ items: Array<{ sessionId: string; cwd?: string }> }>(baseUrl, "session.list", {});
                for (const session of sessions.items) observe(session);
              }
            }
            if (frame.type === "emit" && Array.isArray(frame.args)) {
              const [first, second] = frame.args;
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
```

</details>

#### 缺口

- 未运行 DSH 目标版本、宿主和 Web 客户端
  **影响**：不能保证真实连接、审批 UI 或跨版本行为
  **进一步探讨**：隔离工作区验证 prompt、审批接受/拒绝、会话绑定和实际事件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 断流与任务完成是否等于产物验收？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Remote mux 对每个逻辑流设置 ID；取消或关闭发送该 stream 的 cancel，事件 Response 取消使订阅 lifetime 结束，这只是订阅路径的行为，不能据此证明 Agent turn 停止或已发生的外部副作用撤销。session.cancel 是另一个显式 RPC；删除会话的代表路径先在 running 时调用它，并因其他运行会话拒绝进一步删除。根项目另有媒体检查：将生成文件与 receipt 原件摘要对照，但其返回明确只覆盖保存文件、本地引用和生成回执，视觉裁切、内容及播放需预览。因而统一界面或完成状态本身不等于跨引擎任务和产物已验收；这些分支均未做断线或崩溃注入。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/deepseek-harness-remote.ts:38-60](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/deepseek-harness-remote.ts#L38-L60)

订阅关闭发送 stream cancel。

<details>
<summary>查看原文（23行）</summary>

```text
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

**依据 2 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:1015-1023](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/deepseek-harness-runtime.ts#L1015-L1023)

事件流清理与取消。

```text
        };
        void run().catch(fail).finally(() => {
          for (const id of pendingIds.keys()) this.#remoteResponses.delete(id);
          finish();
        });
      },
      cancel() { lifetime.abort(); },
    });
    return new Response(body);
```

**依据 3 · 源码核查**：[apps/server/src/routes/deepseek-harness.ts:25-46](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/routes/deepseek-harness.ts#L25-L46)

显式 session.cancel 在独立 RPC 白名单。

<details>
<summary>查看原文（22行）</summary>

```text
const ALLOWED_METHODS = new Set([
  "session.list",
  "session.search",
  "session.create",
  "session.history",
  "session.models",
  "session.selectModel",
  "session.rename",
  "session.fork",
  "session.cancel",
  "llm.providers",
  "llm.models",
  "credentials.describe",
  "credentials.set",
  "credentials.unset",
  "settings.describe",
  "settings.mutate",
  "workspace.list",
  "agentPreset.list",
  "agentPreset.select",
  "commands/execute",
]);
```

</details>

**依据 4 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:1275-1286](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/deepseek-harness-runtime.ts#L1275-L1286)

删除前显式取消及其他活跃会话边界。

<details>
<summary>查看原文（12行）</summary>

```text
  async deleteSession(workspace: WorkspaceInfo, sessionId: string) {
    const runtime = this.forWorkspace(workspace);
    const sessions = await runtime.call<{ items: Array<{ sessionId: string; cwd?: string; running: boolean; blank: boolean }> }>("session.list", {});
    const session = sessions.items.find(item => item.sessionId === sessionId);
    if (session && !workspacePathMatches(session.cwd, workspace.path)) throw new ApiError(404, "session_not_found", "Session does not belong to this project");
    if (session?.running) await runtime.call("session.cancel", { sessionId });
    if (sessions.items.some(item => item.sessionId !== sessionId && item.running)) {
      throw new ApiError(409, "deepseek_runtime_busy", "DeepSeek 的其他会话仍在运行。当前会话已停止，请在其他任务完成后重试删除。");
    }
    const home = deepSeekHarnessHome(this.#config, workspace, process.env.IPOLLOWORK_DSH_HOME?.trim(), this.#legacyWorkspaceId);
    await this.closeWorkspace(workspace.id);
    await deleteDeepSeekSessionFiles(home, session?.cwd ?? workspace.path, sessionId, session?.blank ?? true);
```

</details>

**依据 5 · 源码核查**：[apps/server/src/artifact-media.ts:340-357](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/artifact-media.ts#L340-L357)

已有媒体生成回执和哈希检查及其范围。

<details>
<summary>查看原文（18行）</summary>

```text
    let pages = 0;
    let receipt;
    do {
      const page = await listSessionArtifacts(config, workspace.id, sessionId, cursor);
      receipt = page.items.find(item => item.path === generatedPath && item.generation && item.generation.completedAt >= plan.createdAt && (need.kind !== "image" && need.kind !== "video" || item.generation.kind === need.kind));
      cursor = page.nextCursor;
    } while (!receipt && cursor !== null && ++pages < 10);
    if (!receipt) { issues.push(`${need.id}: missing_generation_receipt`); continue; }
    try {
      const original = await boundedRead(await resolveWithinRoot(workspace.path, generatedPath), 100 * 1024 * 1024);
      if (createHash("sha256").update(original).digest("hex") !== createHash("sha256").update(bytes).digest("hex")) issues.push(`${need.id}: generated_file_mismatch`);
    } catch { issues.push(`${need.id}: missing_generated_original`); }
  }
  if (args.outcomes) {
    if (config.readOnly) throw new ApiError(403, "read_only", "Cannot save media outcomes in a read-only workspace");
    await writeFile(briefPath, JSON.stringify({ ...brief, mediaOutcomes: outcomes }, null, 2) + "\n");
  }
  return { ok: true, result: { complete: issues.length === 0 && reports.length === 0, fileCanBeDelivered: issues.length === 0, issues, reportedFallbacks: reports, scope: "Saved files, local references and generation receipts only; verify rendered relevance, cropping, visibility and playback separately." } };
```

</details>

#### 缺口

- 没有跨进程中断、恢复及真实产物验收
  **影响**：不能证明后台任务停止或视觉内容正确
  **进一步探讨**：固定任务并注入订阅断线、宿主退出与取消，回读进程、会话和产物。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用条件、成本和退出路径是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者给出多平台桌面安装，以及从源码构建需要 Node、pnpm、Bun 和平台工具链；可选引擎、凭据、项目路径及扩展还需相互匹配。Cloud 被描述为可选，不代表所有模型或服务无需外部付费。首次成本包括安装和迁移项目、确认引擎权限；持续成本包括模型、文件存储、团队配置和对内容审核；错误恢复需核对原生会话及输出，金额、迁移时间和净收益未测。可在独立项目副本中先接入一个 DSH 只读会话，检查工作区、审批和产物路径；状态不明时停止操作、直接回原生引擎核对，保留原始文件，不能假设卸载自动撤销已提交的外部效果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:67-100](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/README.md#L67-L100)

作者描述桌面发行和源码构建要求。

<details>
<summary>查看原文（34行）</summary>

```text
## Install iPolloWork

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

**依据 2 · 作者声明**：[README.md:202-209](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/README.md#L202-L209)

作者区分引擎、项目和可选云。

```text
- Agent execution, task state, and streaming are normalized at the shared engine boundary while engine-native behavior remains inside its adapter.
- Portable Skills, plugins, MCP servers, and project capabilities use one lifecycle; engine-specific enhancements stay optional.
- Each conversation selects its execution engine and optional work template. Projects supply shared goals and resources. Templates provide examples, Skills and result criteria; each engine owns planning, subagents, coordination, checks and final results.
- Existing template role prompts and Skill references are projected into namespaced native OpenCode subagents and Codex role configuration. Built-in workers remain available; templates do not require a fixed worker count or execution order. Conversation-specific role edits remain scoped task guidance.
- iPolloWork displays native execution and scoped artifacts. It does not add hidden repair prompts, restart native agent work, or run a second delivery workflow in the client. Existing media and render tools remain available to the engine.
- iPolloCloud handles identity, organizations, entitlements, hosted worker lifecycle, administration, and commercial Apps.
- The Cloud connection is optional. Local iPolloWork works without an account or commercial service.
- OpenCode and DeepSeek Harness remain independent components and can continue to evolve without turning iPolloWork into a fork of either runtime.
```

**依据 3 · 源码核查**：[apps/server/src/routes/deepseek-harness.ts:126-147](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/routes/deepseek-harness.ts#L126-L147)

代表入口的 scope 与 workspace 约束。

<details>
<summary>查看原文（22行）</summary>

```text
  addRoute(routes, "POST", "/workspace/:id/engine/deepseek-harness/prompt", "client", async (ctx) => {
    requireClientScope(ctx, "collaborator");
    let workspace: WorkspaceInfo = { ...await resolveWorkspace(config, ctx.params.id), engineId: DEEPSEEK_HARNESS_ENGINE_ID };
    const body = await readJsonBody(ctx.request);
    if (!isRecord(body.payload) || typeof body.payload.sessionId !== "string" || !body.payload.sessionId.trim()) {
      throw new ApiError(400, "invalid_payload", "A DeepSeek Harness sessionId is required");
    }
    await assertResourceWritable(config, workspace.id, body.payload.sessionId.trim());
    workspace = await resolveWorkspaceSession(config, await resolveWorkspace(config, ctx.params.id), body.payload.sessionId.trim(), { deepseekHarness: runtime });
    if (workspace.engineId !== DEEPSEEK_HARNESS_ENGINE_ID) {
      throw new ApiError(409, "session_engine_mismatch", "This conversation is bound to a different engine");
    }
    const promptPayload = await withPluginPromptInstructions(
      config,
      body.payload,
      parseEnginePluginPromptSelection(body.plugins),
    );
    rememberSessionContext(workspace.id, body.payload.sessionId.trim());
    await options.preparePlugins(workspace);
    try {
      await runtime.forWorkspace(workspace).call("session.prompt", promptPayload);
      options.monitorSessionExecution?.(workspace, body.payload.sessionId.trim());
```

</details>

**依据 4 · 源码核查**：[apps/server/src/deepseek-harness-runtime.ts:1275-1286](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/deepseek-harness-runtime.ts#L1275-L1286)

取消与删除先决条件。

<details>
<summary>查看原文（12行）</summary>

```text
  async deleteSession(workspace: WorkspaceInfo, sessionId: string) {
    const runtime = this.forWorkspace(workspace);
    const sessions = await runtime.call<{ items: Array<{ sessionId: string; cwd?: string; running: boolean; blank: boolean }> }>("session.list", {});
    const session = sessions.items.find(item => item.sessionId === sessionId);
    if (session && !workspacePathMatches(session.cwd, workspace.path)) throw new ApiError(404, "session_not_found", "Session does not belong to this project");
    if (session?.running) await runtime.call("session.cancel", { sessionId });
    if (sessions.items.some(item => item.sessionId !== sessionId && item.running)) {
      throw new ApiError(409, "deepseek_runtime_busy", "DeepSeek 的其他会话仍在运行。当前会话已停止，请在其他任务完成后重试删除。");
    }
    const home = deepSeekHarnessHome(this.#config, workspace, process.env.IPOLLOWORK_DSH_HOME?.trim(), this.#legacyWorkspaceId);
    await this.closeWorkspace(workspace.id);
    await deleteDeepSeekSessionFiles(home, session?.cwd ?? workspace.path, sessionId, session?.blank ?? true);
```

</details>

#### 缺口

- 没有安装、各平台、模型费用和迁移恢复实测
  **影响**：不能证明长期采用成本可接受
  **进一步探讨**：测试副本记录安装、权限、恢复时间与账单后再决定扩展范围。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证统一工作台的交付价值？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 media 路径已经有生成回执、原文件哈希及部分交付检查，报告明确要求额外视觉预览；新增重复哈希或泛泛记录完成不是创新。未验证假设：对一个跨引擎任务保留会话 ID、任务范围、最终原生产物路径/版本及各引擎明确返回的终态，人工验收时显示覆盖与未知项，订阅断线不得自动标完成。仅在每个引擎提供可信身份和结果时才能建立关联，不能保证语义正确，也不应把媒体局部检查冒充全类型覆盖。对照原生界面、现有工作台和附加跨引擎验收视图，记录错认完成、缺失产物、人工复核时间和泄露；若现有收据已足够、未知项不可可靠关联或成本超过收益，则否定新视图。

#### 证据与依据

**依据 1 · 源码核查**：[apps/server/src/artifact-media.ts:340-357](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/artifact-media.ts#L340-L357)

现有媒体原件摘要、生成回执和视觉范围反证。

<details>
<summary>查看原文（18行）</summary>

```text
    let pages = 0;
    let receipt;
    do {
      const page = await listSessionArtifacts(config, workspace.id, sessionId, cursor);
      receipt = page.items.find(item => item.path === generatedPath && item.generation && item.generation.completedAt >= plan.createdAt && (need.kind !== "image" && need.kind !== "video" || item.generation.kind === need.kind));
      cursor = page.nextCursor;
    } while (!receipt && cursor !== null && ++pages < 10);
    if (!receipt) { issues.push(`${need.id}: missing_generation_receipt`); continue; }
    try {
      const original = await boundedRead(await resolveWithinRoot(workspace.path, generatedPath), 100 * 1024 * 1024);
      if (createHash("sha256").update(original).digest("hex") !== createHash("sha256").update(bytes).digest("hex")) issues.push(`${need.id}: generated_file_mismatch`);
    } catch { issues.push(`${need.id}: missing_generated_original`); }
  }
  if (args.outcomes) {
    if (config.readOnly) throw new ApiError(403, "read_only", "Cannot save media outcomes in a read-only workspace");
    await writeFile(briefPath, JSON.stringify({ ...brief, mediaOutcomes: outcomes }, null, 2) + "\n");
  }
  return { ok: true, result: { complete: issues.length === 0 && reports.length === 0, fileCanBeDelivered: issues.length === 0, issues, reportedFallbacks: reports, scope: "Saved files, local references and generation receipts only; verify rendered relevance, cropping, visibility and playback separately." } };
```

</details>

**依据 2 · 源码核查**：[apps/server/src/deepseek-harness-remote.ts:38-60](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/apps/server/src/deepseek-harness-remote.ts#L38-L60)

订阅取消本身只处理流。

<details>
<summary>查看原文（23行）</summary>

```text
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

**依据 3 · 作者声明**：[README.md:202-206](https://github.com/Devin-AXIS/iPolloWork/blob/d21e5d5a0f6bf493f3da3df37895abf106d88af6/README.md#L202-L206)

作者说明每个引擎负责原生结果。

```text
- Agent execution, task state, and streaming are normalized at the shared engine boundary while engine-native behavior remains inside its adapter.
- Portable Skills, plugins, MCP servers, and project capabilities use one lifecycle; engine-specific enhancements stay optional.
- Each conversation selects its execution engine and optional work template. Projects supply shared goals and resources. Templates provide examples, Skills and result criteria; each engine owns planning, subagents, coordination, checks and final results.
- Existing template role prompts and Skill references are projected into namespaced native OpenCode subagents and Codex role configuration. Built-in workers remain available; templates do not require a fixed worker count or execution order. Conversation-specific role edits remain scoped task guidance.
- iPolloWork displays native execution and scoped artifacts. It does not add hidden repair prompts, restart native agent work, or run a second delivery workflow in the client. Existing media and render tools remain available to the engine.
```

#### 缺口

- 没有跨引擎统一验收原型或真实任务数据
  **影响**：无法证明方案降低错误或值得维护
  **进一步探讨**：固定引擎和任务集，独立核对终态、工件及人工成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
