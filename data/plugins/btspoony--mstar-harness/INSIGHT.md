# Morning Star Harness

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[dac1c78](https://github.com/btspoony/mstar-harness/tree/dac1c781bad900f938d7a752222b9f139dc42222)

<!-- BEGIN META -->
[![GitHub ★ 68](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=68&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/btspoony/mstar-harness)
<!-- END META -->

> **功能**：为多个编码宿主提供计划、角色分工、工作流状态与交付流程。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将跨会话计划、共享命令和多宿主入口组织为开发流程；未证明比手工治理节时或减少缺陷。

> **主要限制**：[Q03](#research-q03) 表明 DSH 部分调度默认告警，输入异常或引擎失败存在允许并提示的退化路径；不能据此推断所有宿主动作被强制阻止。

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
  - [Q01 · Morning Star 整体适合谁，相对手工项目流程增加什么？](#detail-section-11)
  - [Q02 · MCP 请求如何到共享命令，工作流状态如何读取？](#detail-section-12)
  - [Q03 · DSH 调度检查在什么情况下阻止动作？](#detail-section-13)
  - [Q04 · 使用不同宿主、身份和存储需要哪些条件？](#detail-section-14)
  - [Q05 · 怎样进行小范围评估，什么时候应停止自动推进？](#detail-section-15)
  - [Q06 · 将 gate 退化原因与覆盖范围汇总给审阅者是否有用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要跨会话组织开发计划、实现、审查和交付的团队可使用其工作流基础设施。

团队可用手工计划、Git、独立审查和 CI 管理同类交付；效果与总成本差异未测。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工作流状态 | 保存和校验计划及生命周期 | 结构有效不证明业务交付正确 |
| CLI 与 MCP | 调用共享工作流命令 | 根与身份依启动及调用条件确定 |
| DSH 调度检查 | 对部分任务调度给出提示或拒绝 | 默认告警，部分异常允许并提示 |
| 多宿主适配 | 接入不同编码环境 | 不同宿主的实际能力未本次验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容目标宿主与 Node | 使用对应入口需要 | 运行 CLI 或宿主适配 | 不同宿主能力和阻断通道不同 |
| 项目工作流目录 | 状态操作需要 | 保存和读取计划及快照 | 缺失或无效时相关路径拒绝 |
| 明确根和会话身份 | MCP 特定操作需要 | 将请求绑定正确工作区 | 默认不信任调用方自报身份 |
| Git、审查及外部服务 | 对应交付需要 | 分支、审查和发布 | 需独立授权和真实验证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选择隔离仓库及目标宿主 | 核安装、根路径和权限 |
| 计划 | 团队明确任务、流程与授权 | 记录可审阅计划 |
| 执行 | 用户核对策略后启动工作流 | 观察检查模式与退化告警 |
| 验收 | 独立审核者核实代码和证据 | 状态异常或授权不足时暂停 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主、模型及服务费用未知 | 配置仓库、权限和角色 | 多宿主条件不同 |
| 持续 | 多角色模型调用与计算费用未知 | 计划、审查和状态维护 | 无同任务对照 |
| 恢复 | 重试、状态和服务成本未知 | 核异常、状态与真实外部结果 | 退化路径不等于阻断 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 流程组织 | 工作区、共享命令与快照校验 | 更少缺陷或更快交付 |
| MCP 接入 | 根与身份条件及命令执行入口 | 全部命令真实运行 |
| DSH 调度检查 | 可选硬阻断与告警退化 | 所有宿主和动作覆盖 |

> **思考**：[Q03](#research-q03) 表明 DSH 部分调度默认告警，输入异常或引擎失败存在允许并提示的退化路径；不能据此推断所有宿主动作被强制阻止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将跨会话计划、共享命令和多宿主入口组织为开发流程；未证明比手工治理节时或减少缺陷。

[Q02](#research-q02) 对共享入口的根与身份作显式区分；[Q03](#research-q03) 的允许式退化有信号，但需部署者实际消费并决定处置。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 表明 DSH 部分调度默认告警，输入异常或引擎失败存在允许并提示的退化路径；不能据此推断所有宿主动作被强制阻止。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先在隔离仓库使用小任务，核对实际宿主策略、身份和独立审查；退化或授权不符时暂停。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持有条件的入口、状态及 DSH gate 判断；跨宿主等价性和完整交付未由本次验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/cli/package.json、packages/cli/src/mcp/register.ts、packages/engine/src/workflow.ts、packages/dsh/src/gates/dispatch.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查根包、CLI MCP 注册和身份、工作流快照及 DSH 部分调度 gate；未全面审计各宿主、全部命令、合并和外部服务，不运行目标。
- 下一步：在可弃置仓库按目标宿主测试根、会话身份、软硬 gate 与故障退化，并独立核对交付、费用及权限。

**分析版本**

- **仓库**：[btspoony/mstar-harness](https://github.com/btspoony/mstar-harness)
- **版本号**：4.2.0（[固定提交 dac1c78](https://github.com/btspoony/mstar-harness/tree/dac1c781bad900f938d7a752222b9f139dc42222)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出绑定交付版本的 gate 覆盖与退化收据，需与现有日志比较误判和审核成本。

在可弃置仓库按目标宿主测试根、会话身份、软硬 gate 与故障退化，并独立核对交付、费用及权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 649 | 44334 | — | — | 890076 |
| .mjs | source | 3 | 59913 | 52600 | 7298 | — |
| .mjs | test | 5 | 1434 | 1124 | 200 | — |
| .ts | test | 392 | 179523 | 142261 | 23031 | — |
| .ts | source | 342 | 142677 | 97853 | 37696 | — |
| .md | example | 36 | 513 | — | — | 1270 |
| .tsx | source | 40 | 9103 | 6988 | 1927 | — |
| .tsx | test | 12 | 5896 | 4692 | 724 | — |
| .mjs | example | 4 | 445 | 402 | 2 | — |
| .ts | example | 10 | 308 | 195 | 83 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/btspoony/mstar-harness/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 62](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=62&color=737b86&logo=github)](https://github.com/btspoony/mstar-harness/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 78](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=78&color=737b86&logo=github)](https://github.com/btspoony/mstar-harness/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查跨宿主流程、MCP 命令、DSH 调度检查和实际交付边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Morning Star 整体适合谁，相对手工项目流程增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要跨会话组织需求、实现、审查和交付的开发团队，可以用 Morning Star 的工作流和角色约定管理计划、状态与证据。README 描述多个宿主、角色分工及交付流程；根包是私有工作区，包含独立 CLI、引擎、宿主适配器与技能，因此本条研究对象是工作流基础设施整体，不应当作单个 DSH 插件；DSH 子包是另一个组件。相对手工计划、分支和复核，它的具体增量是把这些规则、状态和多个宿主入口组织在一起；缺乏同任务对照，不能推断更快或更可靠。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-33](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/README.md#L26-L33)

作者描述跨宿主目标和边界。

```text

Morning Star brings a delivery process to the AI coding tools you already use — dsh, omp, OpenCode, Cursor, Kimi Code, ZCode, and Codex. You describe what you want; a `project-manager` agent clarifies the request, keeps a plan, and carries the work from requirements through implementation, review, and acceptance to a pull request. Requirements, architecture, implementation, review, acceptance, and audits each go to a role that owns that part.

**Why use it**

- **From request to pull request** — describe the work once; the PM keeps the plan, brings in the right specialists, and drives everything to a pull request. If work stops partway, the plan records where it left off so the work can resume later.
- **Specialists instead of one long prompt** — a PM orchestrates; separate roles own requirements, architecture, implementation, QC, acceptance, audits, and ops, each with a narrow brief.
- **A trail you can audit** — plans, findings, review reports, and decisions are recorded under the harness directory in your repo, not just in the chat.
```

**依据 2 · 作者声明**：[README.md:35-51](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/README.md#L35-L51)

区分 CLI 与宿主原生安装。

<details>
<summary>查看原文（17行）</summary>

```text

## Install

Every host installs two ways: this CLI's `init` flow, or the host's own plugin manager — the native command installs the plugin only. Options, path layout, and host notes: [`INSTALL.md`](INSTALL.md).

- **dsh (DeepSeek Harness)** — needs the `dsh` CLI on `PATH`
  - CLI: `npx @mstar-harness/cli init --target dsh`
  - Native: `dsh plugin --profile web add @mstar-harness/dsh`
- **omp** — needs the `omp` CLI installed
  - CLI: `npx @mstar-harness/cli init --target omp`
  - Native: `omp plugin install @mstar-harness/omp`
- **OpenCode**
  - CLI: `npx @mstar-harness/cli init --target opencode`
  - Native: `@mstar-harness/opencode` for OpenCode 1.x, `@mstar-harness/opencode-v2` for OpenCode 2.x — add it to the plugin list in [`opencode.json`](INSTALL.md#opencode), then restart OpenCode
- **Cursor** — needs `git`
  - CLI: `npx @mstar-harness/cli init --target cursor`
  - Native: `git clone https://github.com/btspoony/mstar-harness.git ~/.cursor/plugins/local/morning-star-harness`, then **Developer: Reload Window**
```

</details>

**依据 3 · 源码核查**：[package.json:1-9](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/package.json#L1-L9)

根包是私有工作区及整体定位。

```text
{
  "name": "morning-star",
  "version": "4.2.0",
  "description": "Morning Star \u2014 harness engineering workflow platform: TS Harness Workflow Engine + judgment skills, shipped as an Agent Plugin",
  "private": true,
  "type": "module",
  "workspaces": [
    "packages/*"
  ],
```

**依据 4 · 源码核查**：[packages/cli/package.json:1-16](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/cli/package.json#L1-L16)

独立 CLI 和可执行入口。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "@mstar-harness/cli",
  "version": "4.2.0",
  "description": "Morning Star harness CLI \u2014 installer bootstrap, canonical command adapter, and stdio MCP server.",
  "repository": {
    "type": "git",
    "url": "https://github.com/btspoony/mstar-harness.git",
    "directory": "packages/cli"
  },
  "type": "module",
  "files": [
    "dist"
  ],
  "bin": {
    "mstar-harness": "dist/mstar-harness.js",
    "mstar": "dist/mstar-harness.js"
```

</details>

#### 缺口

- 缺独立团队和同任务对照
  **影响**：不能证明交付速度、质量或维护收益
  **进一步探讨**：用同一任务比较手工流程与工作流的完整成本和合格交付。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · MCP 请求如何到共享命令，工作流状态如何读取？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

CLI 包提供 stdio MCP；注册器从共享命令定义构造工具，未固定根的连接对需要根选择器的命令要求显式根，并默认不把调用方提供的 session ID 当作可信身份。接纳请求后解析上下文，构造冻结的调用上下文并执行已接纳命令，将校验后的结果作为文本与结构化内容返回。引擎读取工作流 snapshot 时解析 JSON 并检查 schema，违规会拒绝读取；这些机制支持入口与状态约束，不证明每条命令都完成预期业务、所有宿主身份均可信或实际工作流能恢复。

#### 证据与依据

**依据 1 · 源码核查**：[packages/cli/package.json:1-16](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/cli/package.json#L1-L16)

CLI 和 stdio MCP 包定位。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "@mstar-harness/cli",
  "version": "4.2.0",
  "description": "Morning Star harness CLI \u2014 installer bootstrap, canonical command adapter, and stdio MCP server.",
  "repository": {
    "type": "git",
    "url": "https://github.com/btspoony/mstar-harness.git",
    "directory": "packages/cli"
  },
  "type": "module",
  "files": [
    "dist"
  ],
  "bin": {
    "mstar-harness": "dist/mstar-harness.js",
    "mstar": "dist/mstar-harness.js"
```

</details>

**依据 2 · 源码核查**：[packages/cli/src/mcp/register.ts:706-745](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/cli/src/mcp/register.ts#L706-L745)

命令定义、根和身份条件。

<details>
<summary>查看原文（40行）</summary>

```text
export function registerMcpCommands(
  server: McpServer,
  definitions: readonly CommandDefinition[],
  resolveContext: ResolveContext,
  services: Array<{ close(): Promise<void> }> = [],
  onToolsRegistered?: (names: readonly string[]) => void,
): void {
  const connectionEffects = createMcpEffects(services);
  // A connection that declared no root cannot fill a root selector from a
  // launcher default, so every command that resolves its root from one must
  // receive it: publishing that selector as required is what stops a model from
  // forgetting the one fact the root resolution needs (and what makes admission
  // refuse the omission). The requirement is keyed on the DECLARED selector
  // (`rootInputs`), not on a field named `harness` — `sdd.workspace` resolves
  // its root from `controlRoot`, and advertising that as optional while the
  // resolver refuses its omission is a contract bug. A `harness` that is an
  // operation TARGET (`store.execution.*`, `rootInputs: []`) is not a root
  // selector and gains no such requirement.
  const unpinnedRootRequired = resolveContext.defaultHarness === undefined;
  // The launcher's explicit opt-in is the ONLY channel through which a
  // caller-declared session id becomes an execution identity. It is off unless
  // the deployment said otherwise (`mstar mcp --trust-caller-session-id`).
  const callerIdentity = resolveContext.callerIdentity === true;
  const prepared = new Map<string, {
    definition: CommandDefinition;
    descriptor: CommandSchemaDescriptor;
    contract: ReturnType<typeof mcpInputContract>;
    harnessDefault: boolean;
    rootInputs: readonly string[];
  }>();
  // Store-level commands are CLI-only: their payload is the whole store, so
  // publishing them on a shared connection would hand out `execution_sessions`
  // rows that no redaction can remove without breaking a restore. MCP carries
  // the runtime surface only.
  const members = definitions.filter((definition) => !isCliOnlyCommand(definition.id)).map((definition) => {
    const descriptor = getCommandSchemas([definition])[0]!;
    const selector = definition.cli.options.find((option) => option.context === "sessionId");
    const rootInputs = rootInputsOf(definition, descriptor);
    const harnessIsRoot = rootInputs.includes("harness");
    const contract = mcpInputContract(definition, descriptor, { unpinnedRootRequired, rootInputs, publishSelector: callerIdentity });
```

</details>

**依据 3 · 源码核查**：[packages/cli/src/mcp/register.ts:840-870](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/cli/src/mcp/register.ts#L840-L870)

注册工具、解析上下文及执行已接纳命令。

<details>
<summary>查看原文（31行）</summary>

```text
    server.registerTool(family.toolName, {
      description: family.description,
      inputSchema,
    }, async (admitted, extra) => {
      // The resolver and the context consume only the primitive session
      // selector and the per-call root selector; the handler value itself
      // never leaves the capability. The connection has no identity of its
      // own, so a session id here is exactly what the caller put on the wire.
      const { definition, callRoot } = admitted;
      // A harness that names an operation target is not this call's root: only
      // a declared root selector may select the connection root, and a pinned
      // connection's selectors were already replaced or removed at the seam.
      const resolved = await resolveContext(definition, admitted.sessionId, extra.mcpReq.signal, services, connectionEffects, { harness: callRoot });
      const sessionId = admitted.sessionId ?? resolved.sessionId;
      const requestContext: InvocationContext = Object.freeze({
        ...resolved,
        ...(sessionId === undefined ? {} : { sessionId }),
        ...(resolved.host === undefined ? {} : { host: resolved.host }),
        versions: Object.freeze({ ...resolved.versions }),
        signal: extra.mcpReq.signal,
        effects: connectionEffects,
      });
      const validated = await connectionEffects.withInput(admitted.stdinText, requestContext, async () => {
        const envelope = await admitted.execute(requestContext);
        return validateCommandOutcome(definition, surfaceAssignmentRecovery(definition.id, envelope));
      });
      return {
        content: [{ type: "text", text: JSON.stringify(validated) }],
        structuredContent: validated,
        isError: validated.status !== "ok",
      };
```

</details>

**依据 4 · 源码核查**：[packages/engine/src/workflow.ts:822-842](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/engine/src/workflow.ts#L822-L842)

读取和校验工作流快照。

<details>
<summary>查看原文（21行）</summary>

```text
export function readWorkflowSnapshot(dir: string): WorkflowSnapshotRead {
  const snapshotPath = join(dir, WORKFLOW_SNAPSHOT_FILE);
  if (!existsSync(snapshotPath)) {
    throw new Error(`workflow snapshot not found: ${snapshotPath}`);
  }
  let doc: unknown;
  try {
    doc = JSON.parse(readFileSync(snapshotPath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid JSON in ${snapshotPath}: ${(error as Error).message}`);
  }
  return normalizeWorkflowSnapshot(doc, snapshotPath);
}

function normalizeWorkflowSnapshot(doc: unknown, snapshotPath: string): WorkflowSnapshotRead {
  const gate = validateWorkflowSnapshot(doc);
  const migration = gate.violations.filter((v) => v.code === LEGACY_WORKTREE_PATH_CODE);
  const blocking = gate.violations.filter((v) => v.code !== LEGACY_WORKTREE_PATH_CODE);
  if (blocking.length > 0) {
    const detail = blocking.map((v) => `${v.code}: ${v.message}`).join("; ");
    throw new WorkflowSnapshotValidationError(`refusing to read invalid workflow snapshot ${snapshotPath}: ${detail}`, blocking);
```

</details>

#### 缺口

- 未执行 MCP、状态损坏与真实工作流恢复
  **影响**：不能证明完整运行时接线或所有命令正确性
  **进一步探讨**：隔离仓库验证根选择、身份、无效 snapshot 和恢复结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · DSH 调度检查在什么情况下阻止动作？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

DSH 适配器按显式配置、任务头或仓库策略解析 hard；无硬策略时为告警。被检查的调度在硬策略下若判定 hardBlocked 会返回 deny，软策略则记录 advisory 并继续；另有 workflow gate 的 warn、ask、deny 模式。需要注意不同检查条件和宿主拒绝能力各自决定效果：workflow 调用参数畸形时该路径告警并放行；dispatch pre-execute 中引擎抛异常时，即使 hard 也退化为允许并尝试发 degraded 事件。故这不是覆盖全部动作的无条件授权边界，记录的流程和审核仍需独立核实。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:189-199](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L189-L199)

硬策略解析及默认警告。

<details>
<summary>查看原文（11行）</summary>

```text
 * Resolve the hard-enforcement flag for one dispatch: explicit Config override
 * wins, else the Assignment's OWN `Enforcement: hard` header flag (opencode
 * parity — header region only, a body-quoted example never hardens), else the
 * repo `.mstarc` `[config] enforcement`, else the iteration compass
 * frontmatter, else warn-only.
 */
export function resolveDispatchHard(harnessDir: string | null, config: Config, assignmentText: string): boolean {
  if (config.enforcement === 'hard') return true
  if (config.enforcement === 'soft') return false
  if (parseEnforcementFlag(assignmentHeaderRegion(assignmentText)).hard) return true
  return harnessDir !== null && resolveRepoEnforcement(harnessDir).hard
```

</details>

**依据 2 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:880-903](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L880-L903)

workflow gate 的模式及畸形参数处理。

<details>
<summary>查看原文（24行）</summary>

```text
 * {@link DshHostAdapter.recordWorkflowVerdict}; the record is fully
 * contained and skipped when no harness dir resolved). The verdict maps to
 * the `tools/pre-execute` refusal vocabulary:
 *
 * - `allow` → undefined (delegate via `next()`; allowlisted names and ralph
 *   pass under any mode) + an `ok` verdict row.
 * - `warn` (default) → allowed WITH an advisory verdict row — the
 *   `mstar/dispatch-gate` advisory (the existing dispatch record path) +
 *   one warn (now centralized in the policy) + an
 *   `advisory` durable verdict row.
 * - `ask` → `{kind:'ask', reason}` returned WITHOUT `next()` (terminal —
 *   the registry services it through the approval waterfall; fail-closed
 *   upstream, this gate invents no answerer). P-c: first-seen names ask;
 *   resolved names (via {@link WorkflowAskCache.record}) use the cached
 *   decision, never a re-ask. The ask itself records an `ask` verdict row
 *   (pending resolution — the approval-allow outcome is observed later by
 *   the workflow-ledger consumer's run-start hook).
 * - `deny` → `{kind:'deny', reason}` WITHOUT `next()` (short-circuits the
 *   chain — the veto lands before any child starts) + a `denied` verdict
 *   row (no child ledger rows: the veto precedes start).
 *
 * Malformed args (workflow without `meta`/`meta.name`, ralph without a
 * string `objective`) → pass-through + ONE warn (fail-open, documented —
 * never crash a compliant call; under `hard` too) and NO verdict row (no
```

</details>

**依据 3 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:923-947](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L923-L947)

畸形输入与无法读取状态的降级。

<details>
<summary>查看原文（25行）</summary>

```text
  const mode = config.workflowGate ?? 'warn'
  if (mode === 'off') return undefined
  const input = workflowGateInputOf(exec)
  if (input === undefined) {
    // Fail-open + ONE warn (plan Global Constraint — a malformed call must
    // never crash a compliant run; the warn keeps the degraded control loud).
    ctx.logger(DISPATCH_LOGGER).warn(
      `workflow gate (${toolName}) (fail-open): malformed arguments — no ${toolName === 'ralph' ? 'objective' : 'meta'} to gate on; call allowed`,
    )
    return undefined
  }
  // P-b lease attribution : the status read through the contained
  // resolver path — `harnessDir` was already resolved from the calling
  // agent's session workspace by `preExecuteListener`, and the hint scopes
  // the read to the lifecycle THIS session is bound to (an unbound session
  // has no rows to attribute: the one-warn degrade below).
  const pb = await writableFanOutUncovered(harnessDir, hintReadOf().hint)
  if (pb.unreadable) {
    // Fail-open + ONE warn ( Step 3 / Clarify — a broken status
    // read must not brick fan-out): P-b is degraded for this call only;
    // P-a/P-c (name-based, no status dependency) still run below.
    const statusLabel = harnessDir === null ? STATUS_FILE : join(harnessDir, STATUS_FILE)
    ctx.logger(DISPATCH_LOGGER).warn(
      `workflow gate (${toolName}) (fail-open): cannot read ${statusLabel} — P-b lease attribution degraded; call allowed`,
    )
```

</details>

**依据 4 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:1054-1075](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L1054-L1075)

硬阻断和软告警接线。

<details>
<summary>查看原文（22行）</summary>

```text
  // The adapter owns the shared dispatch-gate core; the exec context is
  // passed so the lease gate (session-id bound — see leaseGateViolations)
  // joins the SAME verdict as the field/branch/anti-recursion checks.
  // `hard` resolves ONCE per dispatch (
  // : the adapter's record block and this gate decision share the
  // single resolution instead of each re-reading the compass.
  const hard = resolveDispatchHard(harnessDir, config, prompt)
  const result = await adapter.dispatchGate(prompt, exec, hard, hintReadOf())
  const verdict = applyEnforcement(result, { hard })
  if (verdict.hardBlocked) {
    ctx.logger(DISPATCH_LOGGER).error(
      `subagent dispatch (${toolName}) vetoed (Enforcement: hard):\n${verdict.violations.map(formatViolation).join('\n')}`,
    )
    return { kind: 'deny', reason: denyReason(toolName, verdict) }
  }
  if (!verdict.ok) {
    ctx.logger(DISPATCH_LOGGER).warn(
      `subagent dispatch (${toolName}) (advisory):\n${verdict.violations.map(formatViolation).join('\n')}`,
    )
    const role = parseAssignmentFields(header).executeAs ?? ''
    ctx.emit('mstar/dispatch-gate', { tool: toolName, role, result: verdict, hard })
  }
```

</details>

**依据 5 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:1166-1197](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L1166-L1197)

引擎异常的允许与 degraded 信号。

<details>
<summary>查看原文（32行）</summary>

```text
/**
 * `tools/pre-execute` listener. The waterfall refusal channel is the returned
 * decision: a deny is returned WITHOUT calling `next()` (short-circuits the
 * chain — downstream listeners and the registry default never run); every
 * other path calls `next()` to delegate (the registry's default is
 * `{ kind: 'allow' }`). Engine failures degrade to allow in BOTH modes (hard
 * gates are opt-in — an engine failure must not harden a workflow that was
 * soft; opencode parity) but the degrade is NEVER silent: the
 * catch path emits the plugin-owned `mstar/dispatch-gate` advisory with
 * `degraded: true` + an error log, so a hard deployment can detect a dead
 * control instead of only finding it in logs. `next()` itself is invoked
 * outside the guard so a downstream rejection propagates untouched.
 */
export async function preExecuteListener(
  ctx: Context,
  resolver: HarnessResolver,
  config: Config,
  adapter: DshHostAdapter,
  exec: ToolExecution,
  next: () => Promise<PreToolDecision>,
): Promise<PreToolDecision> {
  let veto: PreToolDecision | undefined
  try {
    const harnessDir = resolver.forAgent(exec.agent)
    // One session-hint derivation for the gate reads in this call.
    let hintRead: SessionHintRead | undefined
    const readHint = (): SessionHintRead => (hintRead ??= adapter.sessionHintFor(exec.agent))
    veto = await gateDispatch(ctx, harnessDir, config, adapter, exec, readHint)
  } catch (error) {
    ctx.logger(DISPATCH_LOGGER).error(`dispatch gate aborted (degraded, dispatch allowed): ${(error as Error).message}`)
    try {
      ctx.emit('mstar/dispatch-gate', { tool: exec.name, role: '', result: { ok: true, violations: [] }, hard: false, degraded: true })
```

</details>

#### 缺口

- 未运行不同宿主与异常注入
  **影响**：无法证明实际配置、错误告警或拒绝通道在部署中生效
  **进一步探讨**：隔离仓库分别触发软硬模式、畸形参数和引擎错误并核事件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用不同宿主、身份和存储需要哪些条件？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

根工作区由多个包组成；CLI 包声明 Node >=24.18，提供 mstar 与 stdio MCP，DSH 等宿主另有各自适配器。README 描述安装、审查和合并政策是作者工作流程，实际可阻止动作取决于宿主及配置。默认共享 MCP 连接不证明调用者身份，只有启动方显式信任时才接纳自报 session ID；未固定根则需要显式根。用户需管理仓库和流程状态、检查宿主权限以及分支、PR 和外部执行授权；额外模型调用、人工复核、状态恢复和迁移的成本均未测量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-9](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/package.json#L1-L9)

工作区组成。

```text
{
  "name": "morning-star",
  "version": "4.2.0",
  "description": "Morning Star \u2014 harness engineering workflow platform: TS Harness Workflow Engine + judgment skills, shipped as an Agent Plugin",
  "private": true,
  "type": "module",
  "workspaces": [
    "packages/*"
  ],
```

**依据 2 · 源码核查**：[packages/cli/package.json:14-27](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/cli/package.json#L14-L27)

可执行入口及 Node 版本。

<details>
<summary>查看原文（14行）</summary>

```text
  "bin": {
    "mstar-harness": "dist/mstar-harness.js",
    "mstar": "dist/mstar-harness.js"
  },
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bun run scripts/build-web.ts && bun run --cwd ../commands build && rm -rf dist && bun build src/index.ts --target node --outfile dist/mstar-harness.js && bun ../../scripts/escape-dist-literals.ts dist/mstar-harness.js",
    "check": "bun run src/index.ts --help",
    "typecheck:src": "bun run scripts/build-web.ts && bunx tsc --noEmit -p tsconfig.json",
    "test": "bun run --cwd ../engine build && bun run build && bun test",
    "prepublishOnly": "bun run build && bun run check"
  },
  "engines": {
    "node": ">=24.18.0"
```

</details>

**依据 3 · 源码核查**：[packages/cli/src/mcp/register.ts:714-740](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/cli/src/mcp/register.ts#L714-L740)

根和身份策略及 CLI-only 排除。

<details>
<summary>查看原文（27行）</summary>

```text
  // A connection that declared no root cannot fill a root selector from a
  // launcher default, so every command that resolves its root from one must
  // receive it: publishing that selector as required is what stops a model from
  // forgetting the one fact the root resolution needs (and what makes admission
  // refuse the omission). The requirement is keyed on the DECLARED selector
  // (`rootInputs`), not on a field named `harness` — `sdd.workspace` resolves
  // its root from `controlRoot`, and advertising that as optional while the
  // resolver refuses its omission is a contract bug. A `harness` that is an
  // operation TARGET (`store.execution.*`, `rootInputs: []`) is not a root
  // selector and gains no such requirement.
  const unpinnedRootRequired = resolveContext.defaultHarness === undefined;
  // The launcher's explicit opt-in is the ONLY channel through which a
  // caller-declared session id becomes an execution identity. It is off unless
  // the deployment said otherwise (`mstar mcp --trust-caller-session-id`).
  const callerIdentity = resolveContext.callerIdentity === true;
  const prepared = new Map<string, {
    definition: CommandDefinition;
    descriptor: CommandSchemaDescriptor;
    contract: ReturnType<typeof mcpInputContract>;
    harnessDefault: boolean;
    rootInputs: readonly string[];
  }>();
  // Store-level commands are CLI-only: their payload is the whole store, so
  // publishing them on a shared connection would hand out `execution_sessions`
  // rows that no redaction can remove without breaking a restore. MCP carries
  // the runtime surface only.
  const members = definitions.filter((definition) => !isCliOnlyCommand(definition.id)).map((definition) => {
```

</details>

**依据 4 · 作者声明**：[README.md:31-34](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/README.md#L31-L34)

作者声明合并政策和授权边界。

```text
- **From request to pull request** — describe the work once; the PM keeps the plan, brings in the right specialists, and drives everything to a pull request. If work stops partway, the plan records where it left off so the work can resume later.
- **Specialists instead of one long prompt** — a PM orchestrates; separate roles own requirements, architecture, implementation, QC, acceptance, audits, and ops, each with a narrow brief.
- **A trail you can audit** — plans, findings, review reports, and decisions are recorded under the harness directory in your repo, not just in the chat.
- **Boundaries are explicit** — the workflow opens pull requests and records a merge policy when an iteration starts. Under `reviewed-auto` only a settled, posted `ship it` review report at the current PR head authorizes the merge; under `owner-gated` it stops at merge-ready and waits for your written approval. A policy that was never recorded returns the run to Phase 1 rather than defaulting to either. Audits read and report, and anything that touches a real environment needs your explicit authorization.
```

**依据 5 · 作者声明**：[README.md:126-126](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/README.md#L126-L126)

作者声明默认告警与宿主差异。

```text
The engine checks the mechanically checkable parts of this process — workflow state transitions, branch and worktree alignment, dispatch preconditions, plan and issue bookkeeping. These checks are advisory by default: they report problems, and a project or iteration can opt into blocking enforcement with `enforcement: hard`; whether a violation can actually block depends on the host. Process state (plans, workflow records, findings, review reports) lives in the harness directory, `.mstar/` by default, which the scaffold's canonical `.gitignore` snippet ignores — the installer does not touch `.gitignore`.
```

#### 缺口

- 未安装各宿主、验证外部服务或比较费用
  **影响**：不能确认跨宿主等价性及端到端成本
  **进一步探讨**：在独立仓库核实目标宿主的身份、权限、状态与费用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样进行小范围评估，什么时候应停止自动推进？

**研究主题**：采用判断、效果与总成本

#### 完整回答

已有兼容宿主并能审阅工具权限和交付的团队，可先在隔离仓库选一个可回退的小任务，人工核对计划、状态、gate 的软硬模式及审查证据；把仓库整体与单独 DSH 插件的安装边界分清。若状态不可读、检查降级、身份或根指向错误、审查证据缺失或自动动作超过既定授权，应暂停推进并回到原有分支和人工审核流程。真实运行成本、审查准确性和恢复时间未知，不能因状态结构有效或检查无报错就视为交付合格。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:923-947](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L923-L947)

错误或状态不可读时的提示。

<details>
<summary>查看原文（25行）</summary>

```text
  const mode = config.workflowGate ?? 'warn'
  if (mode === 'off') return undefined
  const input = workflowGateInputOf(exec)
  if (input === undefined) {
    // Fail-open + ONE warn (plan Global Constraint — a malformed call must
    // never crash a compliant run; the warn keeps the degraded control loud).
    ctx.logger(DISPATCH_LOGGER).warn(
      `workflow gate (${toolName}) (fail-open): malformed arguments — no ${toolName === 'ralph' ? 'objective' : 'meta'} to gate on; call allowed`,
    )
    return undefined
  }
  // P-b lease attribution : the status read through the contained
  // resolver path — `harnessDir` was already resolved from the calling
  // agent's session workspace by `preExecuteListener`, and the hint scopes
  // the read to the lifecycle THIS session is bound to (an unbound session
  // has no rows to attribute: the one-warn degrade below).
  const pb = await writableFanOutUncovered(harnessDir, hintReadOf().hint)
  if (pb.unreadable) {
    // Fail-open + ONE warn ( Step 3 / Clarify — a broken status
    // read must not brick fan-out): P-b is degraded for this call only;
    // P-a/P-c (name-based, no status dependency) still run below.
    const statusLabel = harnessDir === null ? STATUS_FILE : join(harnessDir, STATUS_FILE)
    ctx.logger(DISPATCH_LOGGER).warn(
      `workflow gate (${toolName}) (fail-open): cannot read ${statusLabel} — P-b lease attribution degraded; call allowed`,
    )
```

</details>

**依据 2 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:1166-1197](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L1166-L1197)

引擎异常的退化信号。

<details>
<summary>查看原文（32行）</summary>

```text
/**
 * `tools/pre-execute` listener. The waterfall refusal channel is the returned
 * decision: a deny is returned WITHOUT calling `next()` (short-circuits the
 * chain — downstream listeners and the registry default never run); every
 * other path calls `next()` to delegate (the registry's default is
 * `{ kind: 'allow' }`). Engine failures degrade to allow in BOTH modes (hard
 * gates are opt-in — an engine failure must not harden a workflow that was
 * soft; opencode parity) but the degrade is NEVER silent: the
 * catch path emits the plugin-owned `mstar/dispatch-gate` advisory with
 * `degraded: true` + an error log, so a hard deployment can detect a dead
 * control instead of only finding it in logs. `next()` itself is invoked
 * outside the guard so a downstream rejection propagates untouched.
 */
export async function preExecuteListener(
  ctx: Context,
  resolver: HarnessResolver,
  config: Config,
  adapter: DshHostAdapter,
  exec: ToolExecution,
  next: () => Promise<PreToolDecision>,
): Promise<PreToolDecision> {
  let veto: PreToolDecision | undefined
  try {
    const harnessDir = resolver.forAgent(exec.agent)
    // One session-hint derivation for the gate reads in this call.
    let hintRead: SessionHintRead | undefined
    const readHint = (): SessionHintRead => (hintRead ??= adapter.sessionHintFor(exec.agent))
    veto = await gateDispatch(ctx, harnessDir, config, adapter, exec, readHint)
  } catch (error) {
    ctx.logger(DISPATCH_LOGGER).error(`dispatch gate aborted (degraded, dispatch allowed): ${(error as Error).message}`)
    try {
      ctx.emit('mstar/dispatch-gate', { tool: exec.name, role: '', result: { ok: true, violations: [] }, hard: false, degraded: true })
```

</details>

**依据 3 · 源码核查**：[packages/engine/src/workflow.ts:822-842](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/engine/src/workflow.ts#L822-L842)

状态解析和校验边界。

<details>
<summary>查看原文（21行）</summary>

```text
export function readWorkflowSnapshot(dir: string): WorkflowSnapshotRead {
  const snapshotPath = join(dir, WORKFLOW_SNAPSHOT_FILE);
  if (!existsSync(snapshotPath)) {
    throw new Error(`workflow snapshot not found: ${snapshotPath}`);
  }
  let doc: unknown;
  try {
    doc = JSON.parse(readFileSync(snapshotPath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid JSON in ${snapshotPath}: ${(error as Error).message}`);
  }
  return normalizeWorkflowSnapshot(doc, snapshotPath);
}

function normalizeWorkflowSnapshot(doc: unknown, snapshotPath: string): WorkflowSnapshotRead {
  const gate = validateWorkflowSnapshot(doc);
  const migration = gate.violations.filter((v) => v.code === LEGACY_WORKTREE_PATH_CODE);
  const blocking = gate.violations.filter((v) => v.code !== LEGACY_WORKTREE_PATH_CODE);
  if (blocking.length > 0) {
    const detail = blocking.map((v) => `${v.code}: ${v.message}`).join("; ");
    throw new WorkflowSnapshotValidationError(`refusing to read invalid workflow snapshot ${snapshotPath}: ${detail}`, blocking);
```

</details>

#### 缺口

- 没有真实宿主和端到端交付实验
  **影响**：不能确定收益、恢复耗时或所有动作受控
  **进一步探讨**：使用可弃置仓库记录一次完整任务和人工审核。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 将 gate 退化原因与覆盖范围汇总给审阅者是否有用？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可提出未验证假设：将每次检查的模式、适用范围、输入缺失与异常退化记录汇总为与交付版本绑定的收据，供审阅者判断哪些限制实际生效。相对已有日志和 degraded 事件，潜在增量是减少在分散记录中漏看放行；但需要证明事件完整、版本绑定可靠，还会增加状态和审核负担。以同一组正常、软模式、缺参及引擎错误案例对比现有日志与候选收据，测量误判、漏看与人工时间；若现有记录已等效或收据因遗漏制造虚假信心，则不引入。没有原型与实验。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:923-947](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L923-L947)

缺参和状态读取失败会告警退化。

<details>
<summary>查看原文（25行）</summary>

```text
  const mode = config.workflowGate ?? 'warn'
  if (mode === 'off') return undefined
  const input = workflowGateInputOf(exec)
  if (input === undefined) {
    // Fail-open + ONE warn (plan Global Constraint — a malformed call must
    // never crash a compliant run; the warn keeps the degraded control loud).
    ctx.logger(DISPATCH_LOGGER).warn(
      `workflow gate (${toolName}) (fail-open): malformed arguments — no ${toolName === 'ralph' ? 'objective' : 'meta'} to gate on; call allowed`,
    )
    return undefined
  }
  // P-b lease attribution : the status read through the contained
  // resolver path — `harnessDir` was already resolved from the calling
  // agent's session workspace by `preExecuteListener`, and the hint scopes
  // the read to the lifecycle THIS session is bound to (an unbound session
  // has no rows to attribute: the one-warn degrade below).
  const pb = await writableFanOutUncovered(harnessDir, hintReadOf().hint)
  if (pb.unreadable) {
    // Fail-open + ONE warn ( Step 3 / Clarify — a broken status
    // read must not brick fan-out): P-b is degraded for this call only;
    // P-a/P-c (name-based, no status dependency) still run below.
    const statusLabel = harnessDir === null ? STATUS_FILE : join(harnessDir, STATUS_FILE)
    ctx.logger(DISPATCH_LOGGER).warn(
      `workflow gate (${toolName}) (fail-open): cannot read ${statusLabel} — P-b lease attribution degraded; call allowed`,
    )
```

</details>

**依据 2 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:1187-1197](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L1187-L1197)

异常记录与 degraded 事件。

<details>
<summary>查看原文（11行）</summary>

```text
  let veto: PreToolDecision | undefined
  try {
    const harnessDir = resolver.forAgent(exec.agent)
    // One session-hint derivation for the gate reads in this call.
    let hintRead: SessionHintRead | undefined
    const readHint = (): SessionHintRead => (hintRead ??= adapter.sessionHintFor(exec.agent))
    veto = await gateDispatch(ctx, harnessDir, config, adapter, exec, readHint)
  } catch (error) {
    ctx.logger(DISPATCH_LOGGER).error(`dispatch gate aborted (degraded, dispatch allowed): ${(error as Error).message}`)
    try {
      ctx.emit('mstar/dispatch-gate', { tool: exec.name, role: '', result: { ok: true, violations: [] }, hard: false, degraded: true })
```

</details>

#### 缺口

- 没有聚合收据原型与用户比较
  **影响**：不能证明降低误判或值得额外状态
  **进一步探讨**：以相同故障样本对照原日志与候选收据开展盲审。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
