# NocoBase

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[e2868c6](https://github.com/nocobase/nocobase/tree/e2868c63edbcf3a124d50ed618eb1006732f5c81)

<!-- BEGIN META -->
[![GitHub ★ 24,868](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=24%2C868&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nocobase/nocobase)
<!-- END META -->

> **功能**：用于构建、运行和持续演进业务系统的开源应用平台，提供权限、工作流及 Agent 集成。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 表明，NocoBase 将独立 DSH 进程变成可领取任务的应用执行工具，记录配置、会话事件和结果状态，从而替代部分手工交接。

> **主要限制**：[Q03](#research-q03) 表明，runner 领用授权与 DSH 子进程权限分开。正式 DSH 路径请求全权限模式，worker 回调直接允许 ACP 权限请求，因而不能将应用任务门禁当成逐工具审批或操作系统隔离。

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
  - [Q01 · NocoBase 接入 DSH 给应用操作者增加什么？](#detail-section-11)
  - [Q02 · 从页面选择到 ACP 启动和可见消息如何接线？](#detail-section-12)
  - [Q03 · 应用级权限和 ACP 子进程副作用在哪分界？](#detail-section-13)
  - [Q04 · 隔离试点有哪些依赖、成本和退路？](#detail-section-14)
  - [Q05 · 能否用可核查的进程环境和副作用状态帮助操作者？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护 NocoBase 应用的团队可以将任务分派给已注册的 DSH runner，跟踪会话事件和交付回执。

在终端手动运行 DSH，再将结果、命令状态和待审文件回填应用。单个开发者低频使用时无需额外的 runner 调度。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Runner 任务分派 | 按工具、模型和策略领取任务 | 应用权限约束领取对象 |
| DSH ACP 会话 | 启动、续用及读取 DSH 输出 | 外部 CLI 和凭据需可用 |
| 运行结果上报 | 保存会话、事件及产物报告 | 结束回执不证明外部副作用均成功 |
| 取消处理 | 请求停止并清理进程 | 无法撤销已完成外部动作 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| NocoBase 应用和匹配的 Agent runner | 任务分派必需 | 保存任务并领取运行 | 改用终端执行 |
| DSH CLI 及模型凭据 | DSH 路径必需 | ACP 会话及推理 | 检测或正式任务报错 |
| 隔离低权限 runner | 非信任工作负载试验所需 | 限定可访问范围 | 暂停试点 |
| 可核对产物和外部回执 | 判断交付与恢复需要 | 区分已写、失败和未知 | 人工对账 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 维护者注册隔离 runner，仅启用 DSH | 工具、模型、版本与身份可定位 |
| 执行 | 操作者在无敏感样本提交一个任务 | 看到会话事件并核对实际产物 |
| 中止 | 操作者验证取消与租约失效 | 检查进程、文件及测试端点，不以状态替代对账 |
| 退出 | 停止派发并切回隔离终端 | 保留待核对记录与已产生的产物 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 应用、数据库与专用 runner 资源 | 部署、注册、工具和权限配置 | 发行物与实际耗时未知 |
| 持续使用 | 模型调用、计算、存储 | 复核任务、角色、凭据和报告 | 单位任务费用未知 |
| 失败恢复 | 重试及外部对账资源 | 核对取消、任务租约和已写结果 | 恢复时长未知 |
| 退出 | 终端环境与留存资源 | 撤去派发并归档未对账状态 | 外部写入须单独确认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| DSH 接入 | 以 ACP profile 启动，回传会话和工具事件 | 兼容范围和实际成功率 |
| 调度和交付 | 认证领取、模型选择和完成报告 | 同任务省下多少人工 |
| 停止 | 取消通知、进程停止及状态上报 | 远端写入是否已生效或可撤销 |

> **思考**：[Q03](#research-q03) 表明，runner 领用授权与 DSH 子进程权限分开。正式 DSH 路径请求全权限模式，worker 回调直接允许 ACP 权限请求，因而不能将应用任务门禁当成逐工具审批或操作系统隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 表明，NocoBase 将独立 DSH 进程变成可领取任务的应用执行工具，记录配置、会话事件和结果状态，从而替代部分手工交接。

[Q02](#research-q02) 的事件与完成报告分开，支持查找 ACP 与应用之间的停点。[Q03](#research-q03) 说明调度身份与子进程权限需分别核对，尤其不能用探测的低权限模式解释正式运行。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 表明，runner 领用授权与 DSH 子进程权限分开。正式 DSH 路径请求全权限模式，worker 回调直接允许 ACP 权限请求，因而不能将应用任务门禁当成逐工具审批或操作系统隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先隔离 runner 和样本仓库，核查实际权限、模型和受控网络。用一项正常任务和一次中止确认产物与报告。无法解释权限或外部状态时停止派发并切回人工。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有源码支持 DSH ACP 接入及应用分派。实际宿主兼容和操作系统隔离未验证。运行环境与副作用提示属于待验证设想。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/libs/acp-bridge/src/catalog.ts、packages/plugins/app-plugin-agents/client/pages/runtimes/runner-overview.tsx、packages/app/agent-runner/src/agent/worker.ts、packages/plugins/app-plugin-agents/server/routes/runners/runner.ts、packages/plugins/app-plugin-agents/shared/runners.ts、packages/app/agent-runner/src/core/loop.ts、packages/app/agent-runner/src/agent/adapters/registry.ts、packages/libs/acp-bridge/src/agent-process.ts、packages/app/agent-runner/src/agent/adapters/acp.ts、packages/plugins/app-plugin-agents/server/core/runs/claim.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定根项目的 DSH ACP 路径、部分 runner 分派和回报。未审计所有业务 ACL、平台插件、运行环境和外部模型，未执行目标。
- 下一步：固定应用、runner、DSH 和模型版本，使用专用低权限环境。按同一任务比对正常完成、超限、取消和远端回执丢失的结果与人工核对成本。

**分析版本**

- **仓库**：[nocobase/nocobase](https://github.com/nocobase/nocobase)
- **版本号**：0.0.0（[固定提交 e2868c6](https://github.com/nocobase/nocobase/tree/e2868c63edbcf3a124d50ed618eb1006732f5c81)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出绑定实际运行环境与外部副作用状态，验证是否能让操作者更准确地判断任务终止和恢复。

固定应用、runner、DSH 和模型版本，使用专用低权限环境。按同一任务比对正常完成、超限、取消和远端回执丢失的结果与人工核对成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2500 | 150505 | — | — | 1726993 |
| .cjs | source | 1 | 30 | 26 | 3 | — |
| .mjs | source | 113 | 19978 | 16614 | 2090 | — |
| .ts | source | 3605 | 592803 | 527285 | 38191 | — |
| .js | source | 88 | 1611 | 1284 | 184 | — |
| .ts | example | 626 | 77418 | 72049 | 2356 | — |
| .md | example | 84 | 12996 | — | — | 124454 |
| .ts | test | 1719 | 406737 | 379944 | 8543 | — |
| .mjs | example | 42 | 4679 | 4534 | 92 | — |
| .js | example | 18 | 119 | 89 | 12 | — |
| .tsx | source | 1088 | 213472 | 198830 | 7216 | — |
| .tsx | test | 395 | 107044 | 102087 | 922 | — |
| .tsx | example | 224 | 36170 | 34586 | 436 | — |
| .mjs | test | 55 | 12704 | 11705 | 405 | — |
| .md | test | 9 | 3358 | — | — | 30372 |

</details>

**活跃度**

[![Issue 未关闭 115](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=115&color=737b86&logo=github)](https://github.com/nocobase/nocobase/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=20&color=737b86&logo=github)](https://github.com/nocobase/nocobase/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=22&color=737b86&logo=github)](https://github.com/nocobase/nocobase/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 NocoBase 应用中接入 DeepSeek Harness 的平台团队，能否以明确身份启动会话、跟踪交付与停止，并能区分业务平台权限和宿主进程的权限边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · NocoBase 接入 DSH 给应用操作者增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合维护 NocoBase 应用、希望把重复编码任务交给已注册 runner 的团队。根项目是独立业务平台工作区，DSH 在它的 ACP 目录中是外部编码进程。与在终端手动运行 DSH、再把日志和结果贴回业务记录相比，应用可以配置 runner 允许的工具，分派指定任务，并在同一运行记录下跟踪会话、事件和结果。这改变了发起和对账步骤，上游 DSH 仍负责执行实际工具。合格结果应有可回查的任务、模型和产物，并由操作者确认，而不能只依据消息有输出或工具检测显示就绪。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-24](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/README.md#L10-L24)

作者定位为业务系统的独立应用和治理平台。

<details>
<summary>查看原文（15行）</summary>

```text
## What is NocoBase

NocoBase is the open-source platform for building, running, and evolving business systems with AI. Agents write the code and do the work, NocoBase provides the foundation and governance, and people make the decisions.

[Website](https://www.nocobase.com/) · [Documentation](https://docs.nocobase.com/) · [Quick Start](#quick-start) · [Community](https://forum.nocobase.com/)

## Why NocoBase

**AI writes code fast. Building reliable business systems is still hard.**

Your team is already developing with AI or vibe coding. Code gets written fast, but new problems come with it.

- **Every project rebuilds the foundation**

  Even with AI writing the code, permissions, workflow engines, and approvals are hard to design from scratch. They are full of edge cases and take a lot of work to maintain.
```

</details>

**依据 2 · 源码核查**：[package.json:1-10](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/package.json#L1-L10)

固定根包为私有 Node 工作区。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "nocobase-v3",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "prettier": "@nocobase/dev-config/prettier",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": ">=24.0.0"
  },
```

</details>

**依据 3 · 源码核查**：[packages/libs/acp-bridge/src/catalog.ts:304-311](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/libs/acp-bridge/src/catalog.ts#L304-L311)

DSH 以外部 CLI 和 ACP profile 接入。

```text
    {
      id: 'dsh',
      name: 'DeepSeek Harness',
      launchers: [program('dsh', ['--profile', 'acp'])],
      allowAll: true,
      signIn: 'export DEEPSEEK_API_KEY=...',
      permissionEnv: { DSH_PERMISSION_MODE: 'danger-full-access' },
    },
```

**依据 4 · 源码核查**：[packages/plugins/app-plugin-agents/client/pages/runtimes/runner-overview.tsx:148-161](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/plugins/app-plugin-agents/client/pages/runtimes/runner-overview.tsx#L148-L161)

设置页面保存启用工具列表，改变团队共享时另行确认。

<details>
<summary>查看原文（14行）</summary>

```text
      ...(JSON.stringify(enabledToolsOf(runner, switched)) ===
      JSON.stringify(
        enabledToolsOf(
          runner,
          new Set(AGENT_TOOLS.filter((tool) => toolEnabled(runner, tool))),
        ),
      )
        ? {}
        : { enabledTools: enabledToolsOf(runner, switched) }),
    };
    if (Object.keys(patch).length === 0) return;
    // Sharing with the team lets other people's runs onto it: it asks first.
    if (patch.trust === 'team') setSharing(patch);
    else onSave(patch);
```

</details>

**依据 5 · 源码核查**：[packages/app/agent-runner/src/agent/worker.ts:1216-1229](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/worker.ts#L1216-L1229)

运行完成上报摘要、处理输入、会话和仓库状态。

<details>
<summary>查看原文（14行）</summary>

```text
    try {
      await this.report(
        routePath(RUNNER_ROUTES.complete, { runId: this.runId }),
        {
          summary:
            saved === '' ? this.summary() : `${this.summary()}\n\n${saved}`,
          handledInputIds: [...this.delivered],
          usage: this.usage,
          ...(this.sessionId === undefined
            ? {}
            : { sessionId: this.sessionId }),
          repos,
        },
      );
```

</details>

#### 缺口

- 没有对比终端 DSH 与应用 runner 的任务交付耗时或团队需求。
  **影响**：可分析交接路径，不能量化效率或实际接受度。
  **进一步探讨**：用同一非敏感任务对照指派、审核和查找产物的人工步骤。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从页面选择到 ACP 启动和可见消息如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

应用设置可将工具列入 runner 的启用范围。认证的 claim 入口为 runner 分发任务，选型检查工具已启用且上报就绪，具名模型也要在可用上报范围。runner 还在启动前检查本地策略，拒绝项回报 policyRefused。执行端按任务的 tool.kind 取得 adapter，dsh 不在原生分支而走目录 ACP。它在选定 workDir 启动 dsh --profile acp，通过子进程标准流处理握手及会话通知，尝试续用已有会话，需严格恢复而不可用时拒绝继续。新会话设置模型后发送提示，消息、思考和工具通知转成运行事件。正常 end_turn 返回 completed，取消或超限另走失败分支。worker 还会处理未交付输入、停写入方、保存并上报，服务端拒收或租约丢失会有不同结局。因此 ACP 一轮结束与应用接收交付是两个阶段。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/app-plugin-agents/server/routes/runners/runner.ts:360-375](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/plugins/app-plugin-agents/server/routes/runners/runner.ts#L360-L375)

领取入口要求 runner 认证。

<details>
<summary>查看原文（16行）</summary>

```text
  router.post(
    '/claim',
    authenticated,
    describeRoute({
      tags,
      summary: 'Claim work for a runner',
      operationId: 'agentsRunnerClaimWork',
      // Runner protocol: only a runner calls it.
      ...cliRoute(false),
      description: [
        "Hands the runner work for its free slots: jobs first, up to `free`, or, when there is no job to hand out, at most one agent run. A run is handed out after a wait of up to one second after it entered the queue, longer the more of the run's coding tool the runner already holds against its limit for that tool, so the idlest runners take queued runs first; the runner asks again at once for the next. A request that ends while it waits takes nothing. With `wait=true` and nothing to hand out, the request is held as a long poll for up to `pollTimeoutMs` (25 seconds by default) until work arrives, and then answers what it found, possibly nothing; the runner asks again at once. Without `wait`, it answers immediately.",
        '',
        'A runner of a protocol this application does not serve is given no work (its poll is still held). `jobs` is present only when jobs are handed out.',
      ].join('\n'),
      security: runnerKeySecurity,
      parameters: [protocolHeader],
```

</details>

**依据 2 · 源码核查**：[packages/plugins/app-plugin-agents/shared/runners.ts:495-508](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/plugins/app-plugin-agents/shared/runners.ts#L495-L508)

工具启用和就绪进入可用判断。

<details>
<summary>查看原文（14行）</summary>

```text
/** Whether `runner` can run `tool`'s work: it is enabled there, installed and signed in. */
export function runsTool(
  runner: Pick<Runner, 'enabledTools' | 'tools'>,
  tool: AgentTool,
): boolean {
  return (
    toolEnabled(runner, tool) &&
    runner.tools.some(
      (item) =>
        item.kind === tool &&
        item.authenticated &&
        (!item.status || item.status === 'ready'),
    )
  );
```

</details>

**依据 3 · 源码核查**：[packages/plugins/app-plugin-agents/shared/runners.ts:536-556](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/plugins/app-plugin-agents/shared/runners.ts#L536-L556)

具名模型和额度条件约束任务。

<details>
<summary>查看原文（21行）</summary>

```text
export function runsEntry(
  runner: Pick<Runner, 'enabledTools' | 'tools' | 'unavailableModels'>,
  entry: Pick<RunnerModelEntry, 'tool' | 'model'>,
  now: number,
): boolean {
  if (
    !runsTool(runner, entry.tool) ||
    quotaBlocks(runner, entry, now).length > 0
  )
    return false;
  if (!entry.model) return true;
  const model = normalizeModel(entry.tool, entry.model);
  return (
    reportedModels(runner, entry.tool).includes(model) &&
    !(runner.unavailableModels ?? []).some(
      (mark) =>
        mark.reason !== 'toolQuota' &&
        mark.tool === entry.tool &&
        mark.model === model,
    )
  );
```

</details>

**依据 4 · 源码核查**：[packages/app/agent-runner/src/core/loop.ts:1230-1245](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/core/loop.ts#L1230-L1245)

runner 取到任务后检查启用与本地策略。

<details>
<summary>查看原文（16行）</summary>

```text
      if (this.stopping.signal.aborted) break;
      const refused = !(
        link.connection.registration.enabledTools ?? []
      ).includes(payload.tool.kind)
        ? 'The coding tool is disabled for this runner.'
        : refuseRun(policy.policy, payload);
      if (refused !== undefined) {
        this.options.log(`run ${payload.run.id}: refused: ${refused}`);
        await link.client
          .request(
            'POST',
            routePath(RUNNER_ROUTES.fail, { runId: payload.run.id }),
            { reason: 'policyRefused', detail: refused },
          )
          .catch(() => undefined);
        continue;
```

</details>

**依据 5 · 源码核查**：[packages/app/agent-runner/src/agent/adapters/registry.ts:16-24](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/adapters/registry.ts#L16-L24)

原生适配器清单不含 DSH。

```text
const nativeAdapters = new Map<
  string,
  (options: { env: Record<string, string> }) => AgentAdapter
>([
  ['claude', createClaudeAdapter],
  ['codex', createCodexAdapter],
  ['opencode', createOpencodeAdapter],
  ['pi', createPiAdapter],
]);
```

**依据 6 · 源码核查**：[packages/app/agent-runner/src/agent/adapters/registry.ts:42-59](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/adapters/registry.ts#L42-L59)

其余已知目录工具创建 ACP 适配器。

<details>
<summary>查看原文（18行）</summary>

```text
  const detection = { env: detectionEnv(env, passEnv, localVariables) };
  for (const kind of selected) {
    const factory = nativeAdapters.get(kind);
    const spec = AGENTS.find((agent) => agent.id === kind);
    if (kind === 'claude')
      adapters.set(
        kind,
        createClaudeAdapter({
          ...detection,
          nonessentialTraffic:
            env.NOCOBASE_RUNNER_CLAUDE_NONESSENTIAL_TRAFFIC === '1',
        }),
      );
    else if (factory) {
      adapters.set(kind, factory(detection));
    } else if (spec) adapters.set(kind, createAcpAdapter(spec, detection.env));
    else throw new Error(`Unknown coding tool: ${kind}`);
  }
```

</details>

**依据 7 · 源码核查**：[packages/app/agent-runner/src/agent/worker.ts:716-726](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/worker.ts#L716-L726)

根据固定任务工具取得实际 adapter。

<details>
<summary>查看原文（11行）</summary>

```text
  private async execute(): Promise<WorkerOutcome> {
    const { payload, deps } = this;
    const adapter = deps.adapters.get(payload.tool.kind);
    if (
      adapter === undefined ||
      !deps.connection.registration.enabledTools?.includes(payload.tool.kind)
    ) {
      return this.finishFailed(
        'setupFailed',
        `This runner has no adapter for ${payload.tool.kind}.`,
      );
```

</details>

**依据 8 · 源码核查**：[packages/app/agent-runner/src/agent/worker.ts:950-979](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/worker.ts#L950-L979)

把会话、模型、工作目录、提示和取消信号交给 adapter。

<details>
<summary>查看原文（30行）</summary>

```text
      if (payload.session?.strict && !this.sessionId)
        return this.finishFailed(
          'sessionUnavailable',
          'The original session id was not reported. Restore the session or explicitly change Agent.',
        );
      const handle = adapter.start({
        ...(payload.outputBlocks ? { outputBlocks: true } : {}),
        strictSession: payload.session?.strict,
        workDir: cwd,
        prompt,
        systemPrompt: system,
        ...(payload.tool.model === undefined
          ? {}
          : { model: payload.tool.model }),
        ...(payload.tool.effort === undefined
          ? {}
          : { effort: payload.tool.effort }),
        ...(this.sessionId === undefined
          ? {}
          : { resumeSessionId: this.sessionId }),
        ...(this.sessionId !== undefined && payload.prompt.recoveryContext
          ? { recoveryContext: payload.prompt.recoveryContext }
          : {}),
        env,
        ...(context.skills === undefined ? {} : { skills: context.skills }),
        permission,
        ...(payload.tool.policy.maxTurns === undefined
          ? {}
          : { maxTurns: payload.tool.policy.maxTurns }),
        abort: this.abort.signal,
```

</details>

**依据 9 · 源码核查**：[packages/libs/acp-bridge/src/agent-process.ts:73-97](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/libs/acp-bridge/src/agent-process.ts#L73-L97)

建立子进程标准流和 ACP 通知、权限请求接线。

<details>
<summary>查看原文（25行）</summary>

```text
    const child = startProgram(agent, options);
    const stderr = { text: '' };
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk: string) => {
      stderr.text = (stderr.text + chunk).slice(-STDERR_TAIL);
    });
    const spawned = new Promise<void>((resolve, reject) => {
      child.once('spawn', resolve);
      child.once('error', reject);
    });
    const stream = acp.ndJsonStream(
      Writable.toWeb(child.stdin),
      Readable.toWeb(child.stdout),
    );
    // Read on every message, so a process handed to another owner (`handOver`) answers to it from then on.
    const handlers = { current: options.handlers };
    const connection = acp
      .client({ name: options.client.name })
      .onNotification(acp.methods.client.session.update, (context) =>
        handlers.current.update(context.params),
      )
      .onRequest(acp.methods.client.session.requestPermission, (context) =>
        handlers.current.permission(context.params, context.signal),
      )
      .connect(stream);
```

</details>

**依据 10 · 源码核查**：[packages/app/agent-runner/src/agent/adapters/acp.ts:580-629](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/adapters/acp.ts#L580-L629)

续用或新建会话，设置模型并发提示。

<details>
<summary>查看原文（50行）</summary>

```text
      const resumed = session.resumeSessionId
        ? await continueSession(
            process,
            session.resumeSessionId,
            session.workDir,
            (active) => {
              replaying = active;
            },
          )
        : undefined;
      if (session.resumeSessionId && !resumed)
        requireRecoverableSession(session);
      const opened =
        resumed ??
        (await process.agent.request(methods.agent.session.new, {
          cwd: session.workDir,
          mcpServers: [],
        }));
      sessionId = resumed
        ? session.resumeSessionId
        : 'sessionId' in opened
          ? String(opened.sessionId)
          : undefined;
      if (!sessionId) throw new Error('The agent did not return a session id.');
      if (session.resumeSessionId && !resumed) {
        flushPendingChunk();
        emit({
          type: 'status',
          content: 'sessionRecovery',
          meta: { reason: 'The agent could not continue the earlier session.' },
        });
      }
      await configureSession(process, sessionId, opened, spec, session.model);
      if (cancelled) return { exit: 'aborted', usage: [], sessionId };
      const response = await process.agent.request(
        methods.agent.session.prompt,
        {
          sessionId,
          prompt: [
            { type: 'text', text: session.systemPrompt },
            ...(session.skills
              ? [
                  {
                    type: 'text' as const,
                    text: `Read the provided skills in ${session.skills.dir}: ${session.skills.slugs.join(', ')}.`,
                  },
                ]
              : []),
            { type: 'text', text: session.prompt },
          ],
```

</details>

**依据 11 · 源码核查**：[packages/app/agent-runner/src/agent/adapters/acp.ts:419-452](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/adapters/acp.ts#L419-L452)

文本、思考和工具更新映射到事件。

<details>
<summary>查看原文（34行）</summary>

```text
  const update = ({ update }: SessionNotification): void => {
    if (replaying) return;
    if (
      (update.sessionUpdate === 'agent_message_chunk' ||
        update.sessionUpdate === 'agent_thought_chunk') &&
      update.content.type === 'text'
    ) {
      const text = update.content.text;
      if (update.sessionUpdate === 'agent_message_chunk')
        summary = (summary + text).slice(-64 * 1024);
      emitChunk(
        update.sessionUpdate === 'agent_message_chunk' ? 'text' : 'thinking',
        text,
      );
    } else if (
      update.sessionUpdate === 'tool_call' ||
      update.sessionUpdate === 'tool_call_update'
    ) {
      flushPendingChunk();
      const previous = toolCalls.get(update.toolCallId);
      const call = {
        name: update.title ?? previous?.name ?? 'Tool',
        input: update.rawInput ?? previous?.input,
        finished: previous?.finished ?? false,
      };
      if (!previous)
        emit({
          type: 'toolUse',
          tool: call.name,
          input: call.input,
          meta: { toolUseId: update.toolCallId },
        });
      if (
        !call.finished &&
```

</details>

**依据 12 · 源码核查**：[packages/app/agent-runner/src/agent/adapters/acp.ts:651-669](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/adapters/acp.ts#L651-L669)

区分 end_turn、取消和异常停止。

<details>
<summary>查看原文（19行）</summary>

```text
      if (session.outputBlocks) flushStreamChunk();
      else flushLegacyChunk();
      if (usage.length) emit({ type: 'usage', meta: { usage } });
      if (cancelled || response.stopReason === 'cancelled')
        return { exit: 'aborted', usage, sessionId };
      if (response.stopReason !== 'end_turn')
        return {
          exit: 'error',
          usage,
          sessionId,
          error: {
            reason:
              response.stopReason === 'max_tokens'
                ? 'contextOverflow'
                : 'toolProcess',
            message: `The agent stopped: ${response.stopReason}.`,
          },
        };
      return { exit: 'completed', usage, sessionId, summary };
```

</details>

**依据 13 · 源码核查**：[packages/app/agent-runner/src/agent/worker.ts:1203-1243](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/worker.ts#L1203-L1243)

完成前清理并上报，区分未处理输入、取消与丢租约。

<details>
<summary>查看原文（41行）</summary>

```text
  private async finishCompleted(): Promise<WorkerOutcome | 'inputPending'> {
    await this.updateRecord({ phase: 'reporting' });
    await this.stopTool();
    await this.deps.stopWriters?.().catch((error: unknown) => {
      // A read-only run keeps its checkout for GC; a writer pushes nothing past a writer it could not stop.
      if (this.payload.workspace.readOnly !== true) throw error;
      this.writerStopFailure = `Process stop failed: ${String(error)}`;
    });
    const repos = await this.repoReports(false);
    const workDir = this.prepared?.workspace?.workDir;
    const saved = await this.saveLocal();
    await this.drainEvents();
    if (this.ending !== undefined) return this.finishEnding();
    try {
      await this.report(
        routePath(RUNNER_ROUTES.complete, { runId: this.runId }),
        {
          summary:
            saved === '' ? this.summary() : `${this.summary()}\n\n${saved}`,
          handledInputIds: [...this.delivered],
          usage: this.usage,
          ...(this.sessionId === undefined
            ? {}
            : { sessionId: this.sessionId }),
          repos,
        },
      );
    } catch (error) {
      if (error instanceof ApiError && error.reason === 'RUN_INPUT_PENDING')
        return 'inputPending';
      if (
        error instanceof ApiError &&
        error.reason === 'RUN_CANCEL_REQUESTED'
      ) {
        this.end({ kind: 'cancel' });
        return this.finishEnding();
      }
      if (error instanceof ApiError && LOST_CODES.has(error.reason)) {
        this.end({ kind: 'lost', code: error.reason });
        return 'leaseLost';
      }
```

</details>

#### 缺口

- 未实际发起 DSH runner 请求或验证页面、恢复和远端模型行为。
  **影响**：固定调用链无法证明兼容所有 DSH 版本或运行成功。
  **进一步探讨**：以锁定的 CLI、profile、模型和测试任务核对事件、产物及最终回执。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 应用级权限和 ACP 子进程副作用在哪分界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

应用为领用任务校验 runner 归属、模型、特性和本地策略。装配阶段还限制工作目录归属、仓库允许规则及仅团队 runner 可领用的变量。这些条件约束任务交给谁。执行时普通 ACP 启动会把目录规格的 permissionEnv 合并到进程环境，DSH 规格请求 danger-full-access，传入 cwd 只是进程工作目录。普通 worker 的权限回调直接返回 allow；ACP 适配器在工具确实发来请求时优先选择 allow_always 或 allow_once，并记录事件。检测启动另禁用默认权限注入并拒绝工具请求，不能据此推断正式任务也审批。代码显示应用门禁与实际进程隔离分开，不能把任务获准、只读配置或权限日志当作限制全部文件和网络副作用的边界。停止先发 ACP 取消并短暂等待，再停止进程或进程组；这不能撤销已经执行的外部写入。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/app-plugin-agents/server/core/runs/claim.ts:367-385](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/plugins/app-plugin-agents/server/core/runs/claim.ts#L367-L385)

领取前检查 runner 状态、能力、工具、本地策略与用户归属。

<details>
<summary>查看原文（19行）</summary>

```text
export function fitsActor(
  runner: Runner,
  agent: Agent,
  actorUserId: string,
  requires: readonly RunnerFeature[],
  now: number,
): boolean {
  if (agent.status !== 'enabled' || runnerLowOnDisk(runner)) return false;
  if (
    !isProtocolSupported(runner.protocolVersion) ||
    runner.status === 'upgrade_required' ||
    runner.status === 'revoked'
  )
    return false;
  if (!covers(runner.features, requires)) return false;
  if (!hasTool(runner, agent, now)) return false;
  if (!policyAllowsAgent(runner.policy, agent)) return false;
  return runner.trust === 'team' || runner.ownerUserId === actorUserId;
}
```

</details>

**依据 2 · 源码核查**：[packages/plugins/app-plugin-agents/server/core/runs/claim.ts:1210-1248](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/plugins/app-plugin-agents/server/core/runs/claim.ts#L1210-L1248)

工作目录、仓库与仅团队变量进入任务组装检查。

<details>
<summary>查看原文（39行）</summary>

```text
    // Its owner's local policy keeps this runner off the subject, or off one of the repositories: another runner takes
    // the run.
    if (
      !policyAllowsSubject(runner.policy, assembly.subject.key) ||
      assembly.dirs.some(
        (dir) =>
          dir.kind === 'repo' && !policyAllowsRepo(runner.policy, dir.url),
      )
    )
      throw new NotForThisRunner();
    // A directory on another runner: that runner takes the run.
    if (
      assembly.dirs.some(
        (dir) => dir.kind === 'directory' && dir.runnerId !== runner.id,
      )
    )
      throw new NotForThisRunner();
    const dirs = payloadDirs(assembly.dirs);
    const directoryKey = directoryKeyOf(runner.id, dirs);
    const { skills, variables } = await resources(agent, assembly);
    const names = variables.names;
    const requires = cleanList([
      ...view.requires,
      ...payloadRequires(
        dirs,
        skills.length,
        names.length,
        Boolean(assembly.workspaceKey),
      ),
    ]) as RunnerFeature[];
    if (!covers(runner.features, requires)) throw new NotForThisRunner();
    // A variable for shared runners only keeps a personal runner off the run.
    if (names.length > 0 && runner.trust !== 'team') {
      const teamOnly = variables.teamOnly;
      if (teamOnly.length > 0) throw new TeamRunnersOnly(teamOnly);
    }
    const env =
      names.length > 0
        ? await variables.deliver({
```

</details>

**依据 3 · 源码核查**：[packages/libs/acp-bridge/src/catalog.ts:304-311](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/libs/acp-bridge/src/catalog.ts#L304-L311)

固定 DSH 目录项声明权限环境。

```text
    {
      id: 'dsh',
      name: 'DeepSeek Harness',
      launchers: [program('dsh', ['--profile', 'acp'])],
      allowAll: true,
      signIn: 'export DEEPSEEK_API_KEY=...',
      permissionEnv: { DSH_PERMISSION_MODE: 'danger-full-access' },
    },
```

**依据 4 · 源码核查**：[packages/libs/acp-bridge/src/agent-process.ts:247-262](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/libs/acp-bridge/src/agent-process.ts#L247-L262)

正常启动合并权限默认环境并以 cwd 启动子进程。

<details>
<summary>查看原文（16行）</summary>

```text
function startProgram(
  agent: ResolvedAgent,
  options: AgentProcessOptions,
): ChildProcessByStdio<Writable, Readable, Readable> {
  const common = {
    cwd: options.cwd,
    env: {
      ...options.env,
      ...agent.spec.env,
      ...(options.permissionDefaults === false ? {} : agent.spec.permissionEnv),
      ...agent.env,
    },
    stdio: ['pipe', 'pipe', 'pipe'] as ['pipe', 'pipe', 'pipe'],
  };
  if (!windows)
    return spawn(agent.command, [...agent.args], { ...common, detached: true });
```

</details>

**依据 5 · 源码核查**：[packages/app/agent-runner/src/agent/worker.ts:894-901](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/worker.ts#L894-L901)

工作进程许可回调直接允许请求。

```text
      localVariables: registration.variables,
      workspace: payload.workspace,
    });
    // The runner is not a security boundary: every call a tool asks about is allowed.
    const permission: PermissionCheck = () => {
      this.lastActivity = Date.now();
      return Promise.resolve('allow');
    };
```

**依据 6 · 源码核查**：[packages/app/agent-runner/src/agent/adapters/acp.ts:537-575](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/adapters/acp.ts#L537-L575)

正式工具许可请求接入许可回调，映射允许选项。

<details>
<summary>查看原文（39行）</summary>

```text
      process = await AgentProcess.start(resolved, {
        cwd: session.workDir,
        env: session.env,
        client: CLIENT,
        signal: opening.signal,
        handlers: {
          update,
          permission: async (request, signal) => {
            if (cancelled || signal.aborted)
              return { outcome: { outcome: 'cancelled' } };
            const decision = await session.permission(
              request.toolCall.title ?? 'Tool',
              { input: request.toolCall.rawInput },
            );
            if (cancelled || signal.aborted)
              return { outcome: { outcome: 'cancelled' } };
            flushPendingChunk();
            const option =
              decision === 'allow'
                ? (request.options.find(
                    (item) => item.kind === 'allow_always',
                  ) ??
                  request.options.find((item) => item.kind === 'allow_once'))
                : (request.options.find(
                    (item) => item.kind === 'reject_once',
                  ) ??
                  request.options.find(
                    (item) => item.kind === 'reject_always',
                  ));
            emit({
              type: 'permission',
              tool: request.toolCall.title ?? 'Tool',
              input: request.toolCall.rawInput,
              meta: { decision: decision === 'allow' ? 'allow' : 'deny' },
            });
            return {
              outcome: option
                ? { outcome: 'selected', optionId: option.optionId }
                : { outcome: 'cancelled' },
```

</details>

**依据 7 · 源码核查**：[packages/app/agent-runner/src/agent/adapters/acp.ts:202-218](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/adapters/acp.ts#L202-L218)

检测与正式执行使用不同的默认许可和回调。

<details>
<summary>查看原文（17行）</summary>

```text
        process = await AgentProcess.start(resolved, {
          cwd,
          env: guardedEnv,
          client: CLIENT,
          signal,
          initializeTimeoutMs: 30_000,
          permissionDefaults: false,
          handlers: {
            update: () => {},
            permission: () =>
              Promise.resolve({ outcome: { outcome: 'cancelled' } }),
          },
        });
        const opened = await process.agent.request(methods.agent.session.new, {
          cwd,
          mcpServers: [],
        });
```

</details>

**依据 8 · 源码核查**：[packages/app/agent-runner/src/agent/adapters/acp.ts:510-526](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/adapters/acp.ts#L510-L526)

取消先发通知，随后有界等待并停止进程。

<details>
<summary>查看原文（17行）</summary>

```text
  let stopping: Promise<void> | undefined;
  const stop = (): Promise<void> =>
    (stopping ??= (async () => {
      cancelled = true;
      if (process && sessionId) {
        // Cancellation is a notification, followed by a bounded grace period for the turn to settle.
        void process.agent
          .notify(methods.agent.session.cancel, { sessionId })
          .catch(() => {});
        await Promise.race([
          result.then(() => {}),
          new Promise<void>((resolve) => setTimeout(resolve, 1500)),
        ]);
      }
      opening.abort();
      await process?.stop();
    })());
```

</details>

**依据 9 · 源码核查**：[packages/libs/acp-bridge/src/agent-process.ts:280-305](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/libs/acp-bridge/src/agent-process.ts#L280-L305)

Windows 与其他系统分别请求树终止或组信号。

<details>
<summary>查看原文（26行）</summary>

```text
async function stopProcess(child: ChildProcess): Promise<void> {
  if (child.pid === undefined) return;
  const exited =
    child.exitCode !== null || child.signalCode !== null
      ? Promise.resolve()
      : once(child, 'exit');
  if (windows) {
    if (child.exitCode !== null || child.signalCode !== null) return;
    endTree(child.pid);
    await exited;
    return;
  }
  signalGroup(child.pid, 'SIGTERM');
  let timer: NodeJS.Timeout | undefined;
  const forced = new Promise<void>((resolve) => {
    timer = setTimeout(() => {
      signalGroup(child.pid!, 'SIGKILL');
      resolve();
    }, STOP_GRACE_MS);
  });
  await exited;
  // A launcher can exit while its descendants still hold this isolated group.
  // Keep the force deadline even when the direct child exited before stop was called.
  if (groupExists(child.pid)) await forced;
  clearTimeout(timer);
}
```

</details>

**依据 10 · 源码核查**：[packages/app/agent-runner/src/agent/worker.ts:1311-1341](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/worker.ts#L1311-L1341)

应用确认取消前会停工具并尝试保留本地结果。

<details>
<summary>查看原文（31行）</summary>

```text
  private async finishEnding(): Promise<WorkerOutcome> {
    const ending = this.ending;
    await this.stopTool();
    if (ending?.kind === 'lost') await this.saveLocal(true);
    switch (ending?.kind) {
      case 'lost':
        this.deps.log(
          `run ${this.runId}: lease lost (${ending.code}); tool stopped`,
        );
        return 'leaseLost';
      case 'cancel': {
        const saved = await this.saveLocal(true);
        this.writeEvent({
          type: 'status',
          content: saved.includes('Recovery required:')
            ? `Cancelled. ${saved}`
            : 'Cancelled.',
          meta: { status: 'cancelled' },
        });
        await this.drainEvents();
        try {
          await this.report(
            routePath(RUNNER_ROUTES.cancelAck, { runId: this.runId }),
            {
              ...(this.confirmedSessionId === undefined
                ? {}
                : { sessionId: this.confirmedSessionId }),
              handledInputIds: [...this.delivered],
              usage: this.usage,
            },
          );
```

</details>

#### 缺口

- 未在受控环境验证 DSH 如何解释此权限模式、操作系统能约束哪些路径、取消后哪些副作用已完成。
  **影响**：不能判定不可信输入能否安全运行，也不能把取消回执当回滚。
  **进一步探讨**：用隔离低权限 runner 和无害探针核对文件可见性、网络限制与取消前后副作用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 隔离试点有哪些依赖、成本和退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者的根项目示例要求 Node 24 和 pnpm 11，使用 SQLite 启动；实际部署还需匹配应用插件、runner 及目标数据库。DSH 路径要求 runner 能找到 dsh 程序并获得所需模型凭据。检测看到空 DEEPSEEK_API_KEY 会报告未登录；非空值加握手并非实际推理成功。选单独应用和隔离低权限 runner，从没有生产凭据的样例仓库开始，记录每次任务、运行身份、CLI 版本、一次正常产物和中止结果。平台费用、模型调用和运维工时各自计算。遇到模型无法用、权限范围大于预期、取消后发现未确认外部写入时，暂停派发并保留记录，切回隔离终端 DSH 和人工回填。既有副作用要查相应远端，不能只删运行记录。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-40](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/README.md#L38-L40)

作者示例启动环境和 SQLite 边界。

```text
## Quick Start

Requires Node.js 24+ and pnpm 11. Windows users should use WSL. These examples use SQLite, so no separate database server is needed.
```

**依据 2 · 作者声明**：[README.md:56-68](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/README.md#L56-L68)

作者给出独立应用创建、配置和启动路径。

<details>
<summary>查看原文（13行）</summary>

````text
### From the terminal

Run the following commands from the parent directory where you keep your projects:

```bash
PNPM_CONFIG_MINIMUM_RELEASE_AGE=0 pnpm create @nocobase/app@beta my-app --template-tag=beta
cd my-app
pnpm nocobase config init --dialect sqlite
pnpm nocobase config check
pnpm dev
```

See the [documentation](https://docs.nocobase.com/) for more setup instructions and development guides.
````

</details>

**依据 3 · 源码核查**：[packages/app/agent-runner/src/agent/adapters/acp.ts:169-196](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/adapters/acp.ts#L169-L196)

程序未发现、缺少凭据和版本探测条件。

<details>
<summary>查看原文（28行）</summary>

```text
  const resolved = await resolveAgent(spec, env);
  if (!resolved)
    return { installed: false, authenticated: false, status: 'notInstalled' };
  if (!(await identifyProgram(resolved, spec, env, signal)))
    return {
      installed: false,
      authenticated: false,
      status: 'notInstalled',
      statusReason: 'otherProgram',
      statusDetail: statusDetailOf(
        `${resolved.command} answers to ${spec.identify!.args.join(' ')} like a different program.`,
      ),
    };
  if (spec.id === 'dsh' && !env.DEEPSEEK_API_KEY?.trim())
    return {
      installed: true,
      path: resolved.command,
      authenticated: false,
      status: 'needsLogin',
      statusReason: 'notLoggedIn',
      statusDetail: statusDetailOf(
        'Set DEEPSEEK_API_KEY and pass it to the runner with --pass-env DEEPSEEK_API_KEY, then detect again.',
      ),
    };
  const cliVersion =
    spec.id === 'dsh'
      ? await dshVersion(resolved.command, env, signal)
      : undefined;
```

</details>

**依据 4 · 源码核查**：[packages/app/agent-runner/src/agent/adapters/acp.ts:285-298](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/adapters/acp.ts#L285-L298)

握手后报告检测就绪与模型列表，不包含执行测试。

<details>
<summary>查看原文（14行）</summary>

```text
        return {
          installed: true,
          path: resolved.command,
          version: safeVersion,
          authenticated: true,
          status: 'ready',
          ...(safe ? { models: safe } : {}),
          modelsDetectionStatus:
            models === undefined
              ? 'unsupported'
              : models.length > 0 && !safe?.length
                ? 'failed'
                : 'detected',
          modelsDetectedAt: new Date().toISOString(),
```

</details>

**依据 5 · 源码核查**：[packages/app/agent-runner/src/agent/adapters/acp.ts:669-685](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/adapters/acp.ts#L669-L685)

正式任务仍能返回授权、模型或进程异常。

<details>
<summary>查看原文（17行）</summary>

```text
      return { exit: 'completed', usage, sessionId, summary };
    } catch (error) {
      const unavailable = sessionUnavailable(error);
      if (unavailable) return unavailable;
      if (session.outputBlocks && cancelled) flushStreamChunk();
      return {
        exit: cancelled ? 'aborted' : 'error',
        usage: [],
        ...(sessionId ? { sessionId } : {}),
        error: {
          reason: isAuthRequired(error)
            ? 'toolAuth'
            : error instanceof ModelSelectionError
              ? 'modelUnavailable'
              : 'toolProcess',
          message: isAuthRequired(error)
            ? `${spec.name} requires login on the runner. Run ${spec.signIn} there, then detect again. (${runFailureMessage(error, 'no further detail from the tool.')})`
```

</details>

**依据 6 · 源码核查**：[packages/app/agent-runner/src/agent/worker.ts:1311-1341](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/worker.ts#L1311-L1341)

退出时的保留与确认只是运行状态。

<details>
<summary>查看原文（31行）</summary>

```text
  private async finishEnding(): Promise<WorkerOutcome> {
    const ending = this.ending;
    await this.stopTool();
    if (ending?.kind === 'lost') await this.saveLocal(true);
    switch (ending?.kind) {
      case 'lost':
        this.deps.log(
          `run ${this.runId}: lease lost (${ending.code}); tool stopped`,
        );
        return 'leaseLost';
      case 'cancel': {
        const saved = await this.saveLocal(true);
        this.writeEvent({
          type: 'status',
          content: saved.includes('Recovery required:')
            ? `Cancelled. ${saved}`
            : 'Cancelled.',
          meta: { status: 'cancelled' },
        });
        await this.drainEvents();
        try {
          await this.report(
            routePath(RUNNER_ROUTES.cancelAck, { runId: this.runId }),
            {
              ...(this.confirmedSessionId === undefined
                ? {}
                : { sessionId: this.confirmedSessionId }),
              handledInputIds: [...this.delivered],
              usage: this.usage,
            },
          );
```

</details>

#### 缺口

- 未验证发布制品、当前供应商账单、runner 隔离和运维时长。
  **影响**：不能量化单位合格任务成本或采用成熟度。
  **进一步探讨**：用固定版本完成一次最小任务、一次权限拒绝与一次取消，记录模型、费用、工时和外部结果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用可核查的进程环境和副作用状态帮助操作者？

**研究主题**：新假设与验证

#### 完整回答

现有记录能保存 runner、工具版本、选定模型及任务结果。ACP 许可事件仅反映实际发来的请求，取消状态也不是外部写入收据。可试验在试点页面展示由 runner 产生且可核查的隔离身份、允许访问范围和写入结果状态，并在已发送而未收到回执时标为待对账。对照现有运行记录与新提示，用外部测试端点制造写成功后丢响应、取消和权限拒绝，比较操作者错误认定未写或已完成的次数、对账用时和额外配置成本。若信息不能匹配运行环境，或者没有降低误判且增加负担，则推翻在该范围的采用假设。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/app-plugin-agents/server/core/runs/claim.ts:2013-2043](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/plugins/app-plugin-agents/server/core/runs/claim.ts#L2013-L2043)

应用已经记录工具、runner、尝试和模型。

<details>
<summary>查看原文（31行）</summary>

```text
        await runsRepo(conn).updateMany({
          filter: { id: run.id },
          values: {
            payloadFingerprint: assembled.fingerprint,
            requires: [...assembled.requires],
            directoryKey: assembled.directoryKey,
            tool: assembled.entry.tool,
            executionHistory: executionHistory(run, {
              ...(selectionSnapshot ? { selection: selectionSnapshot } : {}),
              attempt: Number(run.attempt),
              runnerId: runner.id,
              runnerName: runner.name,
              runnerOwnerUserId: runner.ownerUserId,
              runnerOwnerName: runner.ownerUserId
                ? ((await deps.people?.names(conn, [runner.ownerUserId]))?.get(
                    runner.ownerUserId,
                  ) ?? runner.ownerName)
                : null,
              runnerTrust: runner.trust,
              tool: assembled.entry.tool,
              toolVersion:
                runner.tools.find((tool) => tool.kind === assembled.entry.tool)
                  ?.version ?? null,
              modelService: null,
              model: assembled.entry.model,
              actualModels: [],
              effort: assembled.entry.effort ?? null,
              dispatchedAt: nowText,
              finishedAt: null,
              failureReason: null,
            }),
```

</details>

**依据 2 · 源码核查**：[packages/app/agent-runner/src/agent/adapters/acp.ts:566-575](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/adapters/acp.ts#L566-L575)

许可事件反映 ACP 请求和回调决定。

<details>
<summary>查看原文（10行）</summary>

```text
            emit({
              type: 'permission',
              tool: request.toolCall.title ?? 'Tool',
              input: request.toolCall.rawInput,
              meta: { decision: decision === 'allow' ? 'allow' : 'deny' },
            });
            return {
              outcome: option
                ? { outcome: 'selected', optionId: option.optionId }
                : { outcome: 'cancelled' },
```

</details>

**依据 3 · 源码核查**：[packages/app/agent-runner/src/agent/worker.ts:1321-1340](https://github.com/nocobase/nocobase/blob/e2868c63edbcf3a124d50ed618eb1006732f5c81/packages/app/agent-runner/src/agent/worker.ts#L1321-L1340)

取消报告保存会话、输入和用量，未声明远端回滚。

<details>
<summary>查看原文（20行）</summary>

```text
      case 'cancel': {
        const saved = await this.saveLocal(true);
        this.writeEvent({
          type: 'status',
          content: saved.includes('Recovery required:')
            ? `Cancelled. ${saved}`
            : 'Cancelled.',
          meta: { status: 'cancelled' },
        });
        await this.drainEvents();
        try {
          await this.report(
            routePath(RUNNER_ROUTES.cancelAck, { runId: this.runId }),
            {
              ...(this.confirmedSessionId === undefined
                ? {}
                : { sessionId: this.confirmedSessionId }),
              handledInputIds: [...this.delivered],
              usage: this.usage,
            },
```

</details>

#### 缺口

- 没有从真实 runner 取得隔离证明或副作用收据，也没有测操作者判断。
  **影响**：不能把设想视作当前安全属性。
  **进一步探讨**：用可验证沙箱配置与外部测试账本对照实际状态，测误判和恢复成本。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
