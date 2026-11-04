# odai-dsh-plugin

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ce7a999](https://github.com/orziz/odai/tree/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/plugin)

<!-- BEGIN META -->
[![GitHub ★ 119](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=119&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/orziz/odai) [![npm 30d 2,356](https://img.shields.io/static/v1?label=npm+30d&message=2%2C356&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/odai-dsh-plugin) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/odai-dsh-plugin)
<!-- END META -->

> **功能**：为 DSH profile 提供 Odai 职责路由、治理和控制中心。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将共享运行时打包为 profile 级路由、只读工具限制和控制面；由共享源码提供的实现不归因给子包单独原创。

> **主要限制**：[Q03](#research-q03) 的 guard 是可选注册、restrict 也可能缺失；控制中心 fetch 路由依赖宿主连接的鉴权，不能仅凭加载或配置宣称权限边界已生效。

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
  - [Q01 · 该子包为哪类 DSH 工作流增加什么，代码实际来自哪里？](#detail-section-11)
  - [Q02 · 路由和只读保护如何连接到实际宿主调用？](#detail-section-12)
  - [Q03 · 宿主能力缺失和控制中心连接怎样影响治理承诺？](#detail-section-13)
  - [Q04 · 默认持久状态、依赖与退出给用户带来什么成本？](#detail-section-14)
  - [Q05 · 显式验证宿主能力并展示保护状态能否减少误信？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在 DSH profile 内组织职责路由与治理的用户可观察本组件，见 [Q01](#research-q01)。

比较对象为 DSH 原有模型路由、宿主权限与人工协调；该插件在 profile 中增加一层治理，不替代底层权限或提供已验证的运行效果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Profile 路由 | 在 Agent 步骤选择控制器或职责路径 | 依赖宿主和模型配置；效果未测 |
| 工具只读边界 | 限制子代理或受保护职责的工具 | 依赖可选 guard/restrict；外部执行未覆盖 |
| 会话证据 | 保存路线、职责与工具观察 | 有 Session 身份才进入独立持久记录 |
| 本地记忆 | 管理有来源的本地记忆 | 默认 auto；采集与删除语义未完整审计 |
| 控制中心 | 查看与调整路由和证据 | 依赖连接及 Web 服务；外层鉴权未审计 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH systemPrompt、tools、subagents、sessions、llm | Host 加载必需 | 挂载共享 runtime | 必需服务缺失可能不能加载 |
| tools.guard 与 Agent restrict | 不同权限路径条件 | 工具执行检查和曝光限制 | 可选路径缺失或异常时不可假定等价保护 |
| connection 与 webServer | Web 控制中心条件 | 注册配置及证据界面 | 无 transport 时控制面不可用 |
| 可写本地状态与配置 | 持久证据/记忆条件 | 记录路线和用户选择 | 写入失败及恢复需另核 |
| 模型服务与路由配置 | 已选职责执行条件 | 调用或委派模型 | 不可用时按具体分支失败或回退 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户隔离 profile 与数据目录，核对宿主版本 | 保留原有模型和权限配置 |
| 加载 | 用户确认共享 runtime 与控制面挂载 | 检查 guard/restrict 实际能力，不只看配置 |
| 试验 | 用户用合成任务检查职责选择和只读边界 | 记录请求路线、拒绝及证据 |
| 恢复 | 用户停用插件并检查原配置及持久数据 | 能恢复宿主权限，数据按用户决定处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装与模型资源费用未知 | 版本、profile 和权限配置 | 发布品及宿主兼容未测 |
| 持续使用 | 模型路由、子代理及本地存储费用未知 | 核对职责和证据 | 效果及增量成本未对照 |
| 失败恢复 | 模型重试与排障资源未知 | 核查 guard、路线及存储 | 故障处理取决具体分支 |
| 退出 | 保留数据和迁移费用未知 | 恢复 profile 并检查证据/记忆 | 卸载不保证删除持久状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| Profile 路由 | 共享 runtime 注册 pre-step | 真实任务效果与模型费用 |
| 只读控制 | 条件性 guard 和限制接线 | 宿主实际保护覆盖 |
| 可追溯证据 | Session 标识可持久保存 | 恢复完整性和隐私符合要求 |

> **思考**：[Q03](#research-q03) 的 guard 是可选注册、restrict 也可能缺失；控制中心 fetch 路由依赖宿主连接的鉴权，不能仅凭加载或配置宣称权限边界已生效。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将共享运行时打包为 profile 级路由、只读工具限制和控制面；由共享源码提供的实现不归因给子包单独原创。

[Q02](#research-q02) 以职责范围、子代理身份和工具白名单构造 guard；[Q03](#research-q03) 这些路径依赖具体宿主能力而非自动证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的 guard 是可选注册、restrict 也可能缺失；控制中心 fetch 路由依赖宿主连接的鉴权，不能仅凭加载或配置宣称权限边界已生效。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在隔离 profile 与合成数据上核对 guard、路线、证据和退出；任一边界不符时恢复宿主原配置。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持共享运行时的 profile 接线、条件性工具 guard 与证据存储；宿主保护、发布品及真实模型路由未验证。能力面板为假设。

- 已检查：作者 README、包清单、源码路径 dsh/plugin/README.md、dsh/plugin/package.json、dsh/plugin/cordis.patch.yml、scripts/package-odai-artifact.mjs、dsh/runtime/src/index.mts、dsh/runtime/src/lifecycle-runtime.mts、dsh/runtime/src/governance.mts、dsh/runtime/src/tool-runtime.mts、dsh/runtime/src/control-center-runtime.mts、dsh/runtime/src/runtime-config.mts、dsh/runtime/src/session-evidence.mts、dsh/runtime/src/semantic-memory-store.mts 及固定范围 inventory；组件：dsh/plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查子包 manifest、patch 与构建脚本引用的共享 Host runtime 的入口、guard、pre-step、控制中心和代表性本地存储；未完整审计所有路由、Client、宿主或模型。
- 下一步：在隔离 DSH_HOME 测试缺 guard/restrict、不同角色和控制中心权限，再核对发布品；本次未构建、运行插件、测试或调用模型。

**分析版本**

- **仓库**：[orziz/odai](https://github.com/orziz/odai)
- **版本号**：0.3.3（[固定提交 ce7a999](https://github.com/orziz/odai/tree/ce7a999843ca42ecd84778561cb0ac7642c5648e)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设启动能力验证与实际保护状态展示可减少误信；尚未实现或验证。

在隔离 DSH_HOME 测试缺 guard/restrict、不同角色和控制中心权限，再核对发布品；本次未构建、运行插件、测试或调用模型。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mts | source | 1 | 37 | 33 | 0 | — |
| .md | source | 1 | 178 | — | — | 4873 |
| .mjs | test | 8 | 1630 | 1624 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/orziz/odai/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对 Profile 插件与共享运行时的路由、权限和持久状态边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 该子包为哪类 DSH 工作流增加什么，代码实际来自哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望一个 DSH profile 中的各 Agent 使用统一路由和治理的用户，可以研究该插件如何配置职责路线、只读边界和控制中心。子包的 bundle patch 插入 odai-governance，默认 routing auto 和 spawn；包声明 Host、router、governance 及 Client 导出。固定 checkout 中 runtime 与 client 是构建产物而非该子目录下的已提交源码，仓库的共享 dsh/runtime/src、dsh/client 及 skill 在打包前构建并复制到包内；因此本研究将共享源码作为本组件的构建依赖核查，而不把仓库根项目当另一独立研究结论。该包也不等同单独可选的 Odai Agent preset。

#### 证据与依据

**依据 1 · 作者声明**：[dsh/plugin/README.md:3-20](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/plugin/README.md#L3-L20)

作者描述 profile 级治理、职责路由和控制中心。

<details>
<summary>查看原文（18行）</summary>

```text
Optional writer (写作) handles drafting, rewriting, translation, and localization once direction is settled. Creative owns direction, ideation, and taste review; without a writer mapping, creative continues to handle writing as before. Writer is read-only and child-only on API and local CLI routes, returning drafts or replacement text for the controller to verify and apply.

`odai-dsh-plugin` is the profile-wide Odai bundle for DeepSeek Harness (`dsh`). Install it when every agent preset in one DSH profile should receive Odai governance and routing. It does not install or select the separate Odai Agent preset, and it leaves the provider-neutral `odai-cli` runtime unchanged.

The bundle contributes:

- canonical `skills/odai/SKILL.md` governance as a system-prompt section;
- deterministic routing that keeps ordinary work on the current controller, upgrades configured contextual decision gaps in place, and delegates only genuine independent gaps;
- monotonic write boundaries for child agents and unresolved high-impact controller turns;
- durable route decisions, upgrades, child outcomes, protections, policy denials, and compact tool outcomes stored outside DSH's core session-event vocabulary;
- actual controller/child provider-model evidence, fail-closed high-impact failures, and direct fallback only where it is safe;
- configurable compaction calls: summaries inherit the conversation provider/model by default, a user may persist a separate explicit target and optional reasoning effort, omitted reasoning keeps same-route inheritance and cross-model isolation, and retention stays at the provider default unless explicitly configured;
- a default soft-concise controller output policy, an explicit normal-mode escape, and an optional user-selected economy ceiling without changing child-agent, compaction, checkpoint, or other internal context budgets;
- local, scoped long-term semantic memory with automatic high-confidence candidate discovery, inert pending candidates, bounded relevant recall, provenance, conflict/supersession handling, and physical forget/clear controls without hidden model calls;
- separate non-crisis care and crisis-safety contracts plus an explicit, user-controlled cross-session continuity record that never profiles current mood or reaches child agents;
- adaptive agent-scoped prompt/tool exposure with a compact capability gateway, preserving uncommon-intent recovery while removing low-frequency control schemas from ordinary requests;
- task-state responsibility gaps, authenticated task-bound schema 3 packets that exclude prior-task session evidence and fail closed on unresolved bindings, inline same-model planner reuse, controller-owned implementation after planner handback, complete current reviewer evidence with controller-local incomplete-packet fallback, formal model-route preflight, and buffered compaction fallback without partial-output contamination;
- one Chinese DSH Web Control Center for the real current-turn responsibility graph, stored session evidence, structured event inspection, and validated routing configuration.
```

</details>

**依据 2 · 源码核查**：[dsh/plugin/package.json:15-30](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/plugin/package.json#L15-L30)

声明包入口和 Client 导出。

<details>
<summary>查看原文（16行）</summary>

```text
  "type": "module",
  "imports": {
    "#odai-contracts": "./skills/odai-orchestration/scripts/compose-contracts.mjs",
    "#odai-local-cli": "./skills/odai-orchestration/scripts/local-cli.mjs",
    "#odai-recognize-routing": "./skills/odai-orchestration/scripts/recognize-routing.mjs"
  },
  "main": "./runtime/index.mjs",
  "bin": {
    "odai-dsh-plugin": "./build/bin/odai-dsh-plugin.mjs"
  },
  "exports": {
    ".": "./runtime/index.mjs",
    "./router": "./runtime/router.mjs",
    "./governance": "./runtime/governance.mjs",
    "./client": "./client/client.js",
    "./package.json": "./package.json"
```

</details>

**依据 3 · 源码核查**：[dsh/plugin/cordis.patch.yml:1-6](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/plugin/cordis.patch.yml#L1-L6)

profile bundle 插入治理行并设置 auto/spawn。

```text
- insert:
    - id: odai-governance
      name: odai-dsh-plugin
      config:
        routing:
          mode: auto
```

**依据 4 · 源码核查**：[dsh/plugin/package.json:59-70](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/plugin/package.json#L59-L70)

构建与生成打包材料脚本。

<details>
<summary>查看原文（12行）</summary>

```text
  "scripts": {
    "build:dsh": "npm --prefix ../.. run build:dsh",
    "typecheck:dsh": "npm --prefix ../.. run typecheck:dsh",
    "check": "npm --prefix ../.. run check:dsh",
    "prepare:artifact": "npm run build:dsh && node ../../scripts/package-odai-artifact.mjs prepare --skill-root skills --runtime-root runtime --client-root client --client-package odai-dsh-plugin",
    "clean:artifact": "node ../../scripts/package-odai-artifact.mjs clean --skill-root skills --runtime-root runtime --client-root client --client-package odai-dsh-plugin",
    "prepare": "npm run prepare:artifact",
    "verify:version": "node ../../scripts/verify-dsh-package-versions.mjs",
    "prepack": "npm run verify:version && node ../../scripts/validate-odai-skill.mjs",
    "postpack": "npm run clean:artifact",
    "pack:dry-run": "node ../../scripts/run-package-pack.mjs --clean runtime --clean skills --clean client -- --dry-run",
    "test": "npm run verify:version && npm run build:dsh && node --test ../runtime/tests/*.test.mjs ./tests/*.test.mjs ../../scripts/dsh-web-rpc.test.mjs",
```

</details>

**依据 5 · 源码核查**：[scripts/package-odai-artifact.mjs:7-32](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/scripts/package-odai-artifact.mjs#L7-L32)

共享运行时与 Client 构建物复制进包。

<details>
<summary>查看原文（26行）</summary>

```text
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillSource = resolve(repoRoot, "skills/odai");
const runtimeSource = resolve(repoRoot, "dsh/runtime/build");
const clientSource = resolve(repoRoot, "dsh/client/build/client.js");
const [command, ...argv] = process.argv.slice(2);
const options = parseOptions(argv);
const packageRoot = process.cwd();
const skillRoot = resolveTarget(packageRoot, options.skillRoot, "skill root");
const runtimeRoot = options.runtimeRoot
  ? resolveTarget(packageRoot, options.runtimeRoot, "runtime root")
  : undefined;
const clientRoot = options.clientRoot
  ? resolveTarget(packageRoot, options.clientRoot, "client root")
  : undefined;
if ((clientRoot === undefined) !== (options.clientPackage === undefined)) {
  throw new Error("--client-root and --client-package must be supplied together");
}

if (command === "prepare") {
  await assertCanonicalSkill();
  await Promise.all([
    prepareSkills(),
    runtimeRoot ? prepareCopy(runtimeSource, runtimeRoot, runtimeRoot) : undefined,
    clientRoot && options.clientPackage
      ? prepareClient(clientRoot, options.clientPackage)
      : undefined,
```

</details>

#### 缺口

- 没有验证 npm 成品和本次源码构建字节一致
  **影响**：不能证明已发布包包含所读源码
  **进一步探讨**：在独立构建环境比对固定源码的产物与目标包，再验证宿主加载。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 路由和只读保护如何连接到实际宿主调用？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

共享 runtime 的 apply 要求 systemPrompt、tools、subagents、sessions 和 llm，构造配置、证据存储、工具及生命周期；生命周期以 prepend 注册 agent/pre-step 并调用 routePreStep，常规与不同职责分派由下游决定。工具运行时注册模型工具，并通过可选的 ctx.tools.guard 安装 childGuard、受保护控制器 guard 和重复失败检查；child 身份依据 session header，默认白名单允许读取等操作，对未列工具返回拒绝理由。active 只读责任或已建立的路由保护限制控制器；routing off 会使路由保护查询失效，但只读职责判断是另一输入。源码显示的是特定宿主 seam 的接线，不等同所有外部进程或宿主版本都执行这些保护。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/runtime/src/index.mts:48-51](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/index.mts#L48-L51)

声明必须注入的宿主服务。

```text
export const name = RUNTIME_NAME;
export { inheritCompactionReasoning, resolveConfig, resolveSkillPath, runRoutedRole };

export const inject = ["systemPrompt", "tools", "subagents", "sessions", "llm"];
```

**依据 2 · 源码核查**：[dsh/runtime/src/index.mts:77-92](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/index.mts#L77-L92)

apply 初始化配置、控制中心和证据。

<details>
<summary>查看原文（16行）</summary>

```text
export function apply(ctx: DshRuntimeContext, rawConfig: unknown): void {
  const config = resolveConfig(rawConfig);
  const logger = loggerFor(ctx);
  const disposeControlCenter = installControlCenterRuntimeWhenAvailable(ctx, {
    configPath: config.routing.configPath,
    routingMode: config.routing.mode,
    configuredRoles: config.routing.roles,
    configuredDispatch: config.routing.dispatch,
    logger,
  });
  ctx.effect?.(() => disposeControlCenter, "odai: Control Center RPC");
  const humanSafetyContinuityStorePath = resolveHumanSafetyContinuityStorePath();
  const evidence = createSessionEvidence({
    root: resolveSessionEvidenceRoot(config.routing.configPath),
    logger,
  });
```

</details>

**依据 3 · 源码核查**：[dsh/runtime/src/index.mts:340-352](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/index.mts#L340-L352)

安装工具及生命周期 runtime。

<details>
<summary>查看原文（13行）</summary>

```text
  installToolRuntime({
    appendEvent, bundled, config, ctx, evidence, explicitSkillPath,
    hasSessionEvent, humanSafetyContinuityStorePath, logger, pendingResponsibilityGap, promptRuntime,
    responsibilityRoutingFor: (agent, turn = currentAgentTurn(agent)) => responsibilityRoutingAvailable(config.routing.mode, routingSnapshotFor(agent, turn)),
    responsibilityScopes, routeProtections, selectOutputForAgent,
  });

  installLifecycleRuntime({
    refreshExecutionSurface: promptRuntime.refreshExecutionSurface,
    appendEvent, bundled, config, configuredRole, ctx, evidence, hasSessionEvent, invalidateFailedRoleRoute,
    logger, memorySettingsFor, pendingResponsibilityGap, responsibilityScopes, routeProtections,
    selectOutputForAgent,
  });
```

</details>

**依据 4 · 源码核查**：[dsh/runtime/src/lifecycle-runtime.mts:1613-1619](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/lifecycle-runtime.mts#L1613-L1619)

实际注册 pre-step 调用路由。

```text
    ctx.on("agent/pre-step", async (event: AgentRequestEvent, next: () => Promise<StepResult>) => {
      try {
        return await routePreStep(event, next);
      } finally {
        if (!event.signal.aborted) await deps.refreshExecutionSurface(event.agent);
      }
    }, { prepend: true });
```

**依据 5 · 源码核查**：[dsh/runtime/src/governance.mts:20-29](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/governance.mts#L20-L29)

子代理默认允许工具。

<details>
<summary>查看原文（10行）</summary>

```text
export const DEFAULT_CHILD_ALLOWED_TOOLS = Object.freeze([
  "odai_review_evidence",
  "read",
  "read_image",
  "glob",
  "grep",
  "web_search",
  "web_fetch",
  "odai_responsibility_return",
] as const);
```

</details>

**依据 6 · 源码核查**：[dsh/runtime/src/governance.mts:58-79](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/governance.mts#L58-L79)

根据 session header 拒绝其他工具。

<details>
<summary>查看原文（22行）</summary>

```text
export function isSubagent(agent: DshAgent | null | undefined): boolean {
  const header = agent?.session?.header;
  return header?.origin === "subagent"
    || (Number.isSafeInteger(header?.delegationDepth) && (header?.delegationDepth ?? 0) > 0);
}

export function createChildToolGuard(options: ToolGuardOptions = {}): (execution: ToolExecution) => string | undefined {
  const allowed = new Set<string>([
    ...DEFAULT_CHILD_ALLOWED_TOOLS,
    ...(Array.isArray(options.additionalAllowedTools) ? options.additionalAllowedTools : []),
  ]);
  const denied = new Set<string>(Array.isArray(options.additionalDeniedTools) ? options.additionalDeniedTools : []);
  const onDenied = typeof options.onDenied === "function" ? options.onDenied : () => {};

  return (execution) => {
    if (!isSubagent(execution?.agent)) return undefined;
    if (allowed.has(execution?.name) && !denied.has(execution?.name)) return undefined;

    const reason = `ODAI_SUBAGENT_BOUNDARY: child agents may not execute ${execution.name}; return evidence to the controller instead.`;
    onDenied(execution, reason);
    return reason;
  };
```

</details>

**依据 7 · 源码核查**：[dsh/runtime/src/tool-runtime.mts:65-90](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/tool-runtime.mts#L65-L90)

只读职责与路由保护的不同输入。

<details>
<summary>查看原文（26行）</summary>

```text
  const childGuard = createChildToolGuard({
    additionalDeniedTools: config.governance.additionalDeniedTools,
    onDenied,
  });
  // Scope policy, model mapping and dispatch are separate inputs. Only the
  // authenticated scope owner can restrict an in-place responsibility; a pending
  // gap or a matching word in the user's request cannot change permissions.
  const isReadOnlyResponsibility = (agent: DshAgent | undefined): boolean => Boolean(agent
    && responsibilityScopes.get(agent)?.continuationPolicy === "read-only-tool-chain");
  const reviewerAllowedTools = Object.freeze(["odai_review_evidence", "read", "glob", "grep"]);
  const isManagedReviewer = (agent: DshAgent): boolean =>
    isManagedRoleChild(agent) && routedRoleOf(agent) === "reviewer";
  const protectionFor = (agent: DshAgent) => config.routing.mode === "off"
    ? undefined
    : activeRouteProtection(agent, evidence.events(agent));
  const executionRestrictionFor = (agent: DshAgent): ExecutionRestriction => {
    const allow = isSubagentSession(agent)
      ? isManagedReviewer(agent) ? reviewerAllowedTools : DEFAULT_CHILD_ALLOWED_TOOLS
      : isReadOnlyResponsibility(agent) || protectionFor(agent) ? DEFAULT_PROTECTED_CONTROLLER_ALLOWED_TOOLS : undefined;
    return allow ? { allow, deny: config.governance.additionalDeniedTools } : {};
  };
  const routeProtectionGuard = createRouteProtectionGuard({
    additionalDeniedTools: config.governance.additionalDeniedTools,
    onDenied,
    isReadOnlyResponsibility,
    protectionFor,
```

</details>

**依据 8 · 源码核查**：[dsh/runtime/src/tool-runtime.mts:255-281](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/tool-runtime.mts#L255-L281)

可选 guard 内实际执行权限判断。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.tools.guard?.((execution: ToolExecution) => {
    const agent = execution.agent;
    if (agent && !isSubagentSession(agent) && config.routing.mode !== "off" && !responsibilityScopes.get(agent)) {
      const events = evidence.events(agent);
      const consumed = new Set(events.filter(event => event.type === "odai/responsibility-gap-consumed").map(event => event.data.stateDigest));
      const message = latestDirectUserMessage(agent);
      const taskId = message && leadTaskId(events, message.id, classifyPendingReviewerText(extractLatestUserText([message])) === "continue");
      const state = leadState(events);
      if (taskId && state?.enabled && Array.isArray(state.roles) && state.roles.includes("planner") && isLeadWriteTool(execution.name)) {
        const existing = events.some(event => event.type === "odai/responsibility-gap" && event.data.taskMessageId === taskId && event.data.responsibility === "planner" && event.data.timing === "start");
        if (!existing) {
          appendEvent(agent, "odai/responsibility-gap", leadGap("planner", taskId, currentAgentTurn(agent), currentAgentStep(agent) ?? 0));
          return "ODAI_NAMED_START_PENDING: 主导模式已登记规划请求，正在等待职责调度，不是渠道故障。此工具尚未执行；请停止重试工具并结束当前回复，让运行时调度规划。规划回交后由控制器继续原任务。";
        }
      }
      if (events.some(event => event.type === "odai/responsibility-gap" && event.data.userNamed === true && event.data.timing === "start" && !consumed.has(event.data.stateDigest))) {
        const reason = "ODAI_NAMED_START_PENDING: 职责请求已登记，正在等待调度，不是渠道故障。此工具尚未执行；请停止重试工具并结束当前回复，让运行时调度职责。职责回交后由控制器继续原任务。";
        onDenied({ ...execution, agent }, reason);
        return reason;
      }
    }
    if (execution.agent && isManagedReviewer(execution.agent) && !reviewerAllowedTools.includes(execution.name)) {
      const reason = "ODAI_REVIEW_READ_ONLY: managed reviewers may only inspect delegated source with read, glob, grep, and immutable evidence with odai_review_evidence";
      onDenied({ ...execution, agent: execution.agent }, reason);
      return reason;
    }
    return childGuard(execution) ?? routeProtectionGuard(execution) ?? repeatedFailure.start(execution);
```

</details>

#### 缺口

- 没有核对目标宿主的 guard 生命周期及所有外部执行路径
  **影响**：不能证明所有写入或模型调用受到该保护
  **进一步探讨**：在固定 DSH 版本注入子代理、只读职责与普通控制器，比较工具决定与实际文件写入。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 宿主能力缺失和控制中心连接怎样影响治理承诺？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

工具守卫以可选调用 ctx.tools.guard?. 注册；如果服务存在但没有该方法，代码不会在这一行安装执行 guard。自适应工具曝光另尝试 agent tools restrict，缺方法或抛错时返回当前名称并记录或保留状态；因此不能只凭插件加载就宣称 guard 与 restrict 都生效。控制中心在可注入上下文等待 connection 和 webServer：有 fetch 时注册三个 HTTP 路由并校验 RPC envelope，无 fetch 才通过 connection.rpc.handle 设置 loopback authority；fetch 分支的外层鉴权取决宿主 connection 实现，本次未审计，不能推断其可远程公开或已完全受保护。未挂载 transport 时治理主入口与 Web 控制面不能等同。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/runtime/src/tool-runtime.mts:255-281](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/tool-runtime.mts#L255-L281)

执行 guard 是可选方法调用。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.tools.guard?.((execution: ToolExecution) => {
    const agent = execution.agent;
    if (agent && !isSubagentSession(agent) && config.routing.mode !== "off" && !responsibilityScopes.get(agent)) {
      const events = evidence.events(agent);
      const consumed = new Set(events.filter(event => event.type === "odai/responsibility-gap-consumed").map(event => event.data.stateDigest));
      const message = latestDirectUserMessage(agent);
      const taskId = message && leadTaskId(events, message.id, classifyPendingReviewerText(extractLatestUserText([message])) === "continue");
      const state = leadState(events);
      if (taskId && state?.enabled && Array.isArray(state.roles) && state.roles.includes("planner") && isLeadWriteTool(execution.name)) {
        const existing = events.some(event => event.type === "odai/responsibility-gap" && event.data.taskMessageId === taskId && event.data.responsibility === "planner" && event.data.timing === "start");
        if (!existing) {
          appendEvent(agent, "odai/responsibility-gap", leadGap("planner", taskId, currentAgentTurn(agent), currentAgentStep(agent) ?? 0));
          return "ODAI_NAMED_START_PENDING: 主导模式已登记规划请求，正在等待职责调度，不是渠道故障。此工具尚未执行；请停止重试工具并结束当前回复，让运行时调度规划。规划回交后由控制器继续原任务。";
        }
      }
      if (events.some(event => event.type === "odai/responsibility-gap" && event.data.userNamed === true && event.data.timing === "start" && !consumed.has(event.data.stateDigest))) {
        const reason = "ODAI_NAMED_START_PENDING: 职责请求已登记，正在等待调度，不是渠道故障。此工具尚未执行；请停止重试工具并结束当前回复，让运行时调度职责。职责回交后由控制器继续原任务。";
        onDenied({ ...execution, agent }, reason);
        return reason;
      }
    }
    if (execution.agent && isManagedReviewer(execution.agent) && !reviewerAllowedTools.includes(execution.name)) {
      const reason = "ODAI_REVIEW_READ_ONLY: managed reviewers may only inspect delegated source with read, glob, grep, and immutable evidence with odai_review_evidence";
      onDenied({ ...execution, agent: execution.agent }, reason);
      return reason;
    }
    return childGuard(execution) ?? routeProtectionGuard(execution) ?? repeatedFailure.start(execution);
```

</details>

**依据 2 · 源码核查**：[dsh/runtime/src/tool-runtime.mts:304-329](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/tool-runtime.mts#L304-L329)

restrict 缺失或异常时的处理。

<details>
<summary>查看原文（26行）</summary>

```text
    // even when its contextual capabilities have not changed.
    const key = JSON.stringify([policy.allow ?? null, deniedNames]);
    const previous = toolExposureStates.get(agent);
    if (previous?.key === key) return activeNames;
    previous?.dispose?.();
    const agentTools = agent.ctx?.tools;
    const restrict = agentTools?.restrict;
    if (typeof restrict !== "function") {
      toolExposureStates.set(agent, Object.freeze({ key }));
      return activeNames;
    }
    try {
      const restriction = deniedNames.length > 0 || policy.allow
        ? restrict.call(agentTools, { ...policy, deny: deniedNames })
        : undefined;
      const dispose = typeof restriction === "function" ? restriction : undefined;
      toolExposureStates.set(agent, Object.freeze({ key, dispose }));
      appendEvent(agent, "odai/tool-exposure-selected", {
        ...(options.turn === undefined ? {} : { turn: options.turn }),
        ...(options.step === undefined ? {} : { step: options.step }),
        mode: "adaptive",
        activeTools: activeNames,
      });
    } catch (error) {
      logger.warn(`Odai adaptive registry restriction is unavailable; prompt filtering and execution guards remain active: ${error instanceof Error ? error.message : String(error)}`);
      toolExposureStates.set(agent, Object.freeze({ key }));
```

</details>

**依据 3 · 源码核查**：[dsh/runtime/src/control-center-runtime.mts:60-78](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/control-center-runtime.mts#L60-L78)

fetch 路由与 RPC loopback authority 的不同分支。

<details>
<summary>查看原文（19行）</summary>

```text
function registerControlCenter(connection: HostConnection,
  handler: (endpoint: string, payload: unknown, signal: AbortSignal) => Promise<ConnectionRpcResult>,
): () => Promise<void> {
  if (!connection.fetch) return connection.rpc.handle(CONTROL_CENTER_CHANNEL, handler, { authority: "loopback" });
  const disposers = [CONTROL_CENTER_ENDPOINT, CONTROL_CENTER_EVIDENCE_ENDPOINT, CONTROL_CENTER_SESSION_ENDPOINT].map((endpoint) => {
    const method = `${CONTROL_CENTER_CHANNEL.slice(1)}/${endpoint}`;
    return connection.fetch!.register({
      path: `/api/${method}`, methods: ["POST"], requestBody: "buffered",
      async fetch(request) {
        let body: unknown;
        try { body = await request.json(); } catch { return new Response("body is not JSON", { status: 400 }); }
        if (!isUnknownRecord(body) || body.type !== "client-request" || typeof body.rpcId !== "string"
          || body.rpcId.length === 0 || body.method !== method) return new Response("invalid RPC envelope", { status: 400 });
        return Response.json({ type: "server-response", rpcId: body.rpcId,
          result: await handler(endpoint, body.payload, request.signal) });
      },
    });
  });
  return async () => { for (const dispose of disposers) await dispose(); };
```

</details>

**依据 4 · 源码核查**：[dsh/runtime/src/control-center-runtime.mts:160-181](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/control-center-runtime.mts#L160-L181)

可注入宿主等待 connection 与 webServer。

<details>
<summary>查看原文（22行）</summary>

```text
export function installControlCenterRuntimeWhenAvailable(
  ctx: DshRuntimeContext,
  options: ControlCenterRuntimeOptions,
): () => Promise<void> {
  let release: (() => Promise<void>) | undefined;
  let stopped = false;
  if (ctx.inject) {
    const binding = ctx.inject(["connection", "webServer"], (available) => {
      if (stopped) return;
      const mounted = installControlCenterRuntime(available, options);
      release = mounted;
      available.effect?.(() => async () => {
        if (release === mounted) release = undefined;
        await mounted?.();
      }, "odai: Control Center transport ownership");
    });
    return async () => {
      stopped = true;
      await binding.dispose();
      const current = release;
      release = undefined;
      await current?.();
```

</details>

**依据 5 · 作者声明**：[dsh/plugin/README.md:174-178](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/plugin/README.md#L174-L178)

作者说明兼容基线与所需服务。

```text
The probe reports both compaction and exactly matched cache reads. `--ordinary-only` instead reports a clean warm/matched pair so an intervening compaction cannot refresh or contaminate a normal-dialogue cache comparison. Because it runs before the fixture session has a durable first request header, candidate mode supplies the same synthetic routed header used by the unit contract and then exercises the real relay request; production compaction reads an existing durable header. Runtime retention defaults to `provider-default`. In one isolated OpenAI `gpt-5.6-sol/xhigh` standalone compaction per arm, each shadowing about 149K measured tokens, provider-default and forced `long` both reused about 99.4% of provider input and produced equivalent immediate post-summary cache coverage. This supports the least-intervention default for that observed route; it does not establish delayed or provider-neutral retention behavior. Deployment config `compaction.cacheRetention` or `ODAI_COMPACTION_CACHE_RETENTION` can explicitly select `short`, `long`, or `none`; `provider-default` means Odai adds no retention, any explicit incoming retention remains authoritative, and configured retention still applies when host routing has already supplied reasoning. This retention policy does not add cross-model reasoning or retention.

A provider cache is still best-effort: even identical calls can miss because of upstream writes, expiry, or routing. Changing compaction to a low controller ceiling is not a valid cache fix because it risks an incomplete checkpoint; the first controller request after a landed summary must also build the new summary prefix because it no longer matches the replaced history.

The current `0.3.2` source candidate uses DSH `0.2.1-rc.2` as its minimum supported baseline. Its npm peer remains open (`*`) so later releases and prereleases are not rejected by version alone. The release matrix targets `0.2.1-rc.2`; later hosts must retain the required runtime services and are not automatically certified. Earlier releases retain their historical compatibility entries. Control Center declares both `connection` and `webServer` for RPC registration, while governance remains available without the Web transport. The shared host supports Plugin-only and Agent installations. Historical v0 Odai log migration remains outside the current claim.
```

#### 缺口

- 具体 DSH 版本是否提供 guard/restrict 及 fetch 的鉴权契约未验证
  **影响**：不能断言缺 seam 时仍有等价保护或远程安全
  **进一步探讨**：核对固定宿主 API 并在隔离部署中覆盖缺 guard、缺 restrict、外部连接与拒绝路径。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 默认持久状态、依赖与退出给用户带来什么成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

源码默认 routing auto、provider spawn，memory.mode auto；会话证据根位于 routing 配置所在目录的 session-evidence，具有效 Session ID 时会持久追加，缺 ID 则仅尝试临时附着到 session。记忆存储包含配置、条目和来源，代码使用受限文件权限、锁、临时写及替换；这不是对所有敏感数据的保密或恢复保证。首次须核对 profile 级范围、宿主版本、模型及子代理配置；持续使用可能产生模型调用、路由结果与本地持久状态，具体费用与效果未知。卸载不应假设自动清除共享记录，作者说明需单独管理；当模型路线、写限制或记录行为与预期不符时停用插件并检查现有权限和存储，再恢复原 profile。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/runtime/src/runtime-config.mts:57-77](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/runtime-config.mts#L57-L77)

默认路由、provider 与记忆模式。

<details>
<summary>查看原文（21行）</summary>

```text
export function resolveConfig(rawConfig: unknown = {}): RuntimeConfig {
  const raw = assertPlainObject(rawConfig, "config");
  const routing = assertPlainObject(raw.routing, "config.routing");
  const roles = assertPlainObject(routing.roles, "config.routing.roles");
  const dispatch = assertPlainObject(routing.dispatch, "config.routing.dispatch");
  const governance = assertPlainObject(raw.governance, "config.governance");
  const output = assertPlainObject(raw.output, "config.output");
  const compaction = assertPlainObject(raw.compaction, "config.compaction");
  const memory = assertPlainObject(raw.memory, "config.memory");
  const mode = routing.mode ?? DEFAULT_ROUTING_MODE;
  const provider = routing.provider ?? "spawn";
  const maxInputChars = routing.maxInputChars ?? 12_000;
  const configPath = resolveRoutingConfigPath(routing.configPath);
  const additionalDeniedTools = governance.additionalDeniedTools ?? [];
  const skillSource = governance.skillSource ?? "bundled";
  const skillConfigPath = resolveSkillSourceConfigPath(governance.skillConfigPath);
  const outputConfigPath = resolveOutputConfigPath(output.configPath);
  const compactionConfigPath = resolveCompactionConfigPath(compaction.configPath);
  const memoryStorePath = resolveMemoryStorePath(memory.storePath);
  const memoryMode = memory.mode ?? "auto";
  const memoryMaxRetrieved = memory.maxRetrieved ?? 6;
```

</details>

**依据 2 · 源码核查**：[dsh/runtime/src/session-evidence.mts:281-283](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/session-evidence.mts#L281-L283)

确定会话证据根目录。

```text
export function resolveSessionEvidenceRoot(routingConfigPath: string): string {
  return resolve(dirname(routingConfigPath), "session-evidence");
}
```

**依据 3 · 源码核查**：[dsh/runtime/src/session-evidence.mts:314-352](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/session-evidence.mts#L314-L352)

按 session ID 持久化或使用临时事件。

<details>
<summary>查看原文（39行）</summary>

```text
  const append = (agent: DshAgent, type: string, data: object): SessionEvidenceEvent | undefined => {
    if (typeof type !== "string" || !type.startsWith("odai/")) {
      throw new TypeError("odai evidence type must start with odai/");
    }
    const state = stateFor(agent, root, logger);
    const snapshot = snapshotData(data, type);
    if (type === "odai/responsibility-returned") {
      // Bind the handback to an actual native position, not wall-clock ordering.
      const anchor = sessionEvents(agent.session).at(-1);
      delete snapshot.nativeEventSeq;
      if (Number.isSafeInteger(anchor?.seq)) snapshot.nativeEventSeq = anchor?.seq;
    }
    const id = evidenceId(type, snapshot);
    const event = Object.freeze({ id, type, time: Date.now(), data: snapshot });
    if (state.ids.has(id)) return state.events.find((candidate) => candidate.id === id);

    if (!state.sessionId) {
      state.ids.add(id);
      state.events.push(event);
      try {
        agent?.session?.append?.(type, event.data);
      } catch (error) {
        logger.warn(`failed to append transient ${type}: ${error instanceof Error ? error.message : String(error)}`);
      }
      return event;
    }

    const record: StoredEvidenceRecord = {
      schemaVersion: STORE_SCHEMA_VERSION,
      id,
      sessionId: state.sessionId,
      type,
      time: event.time,
      data: event.data,
    };
    persistRecord(root, state.sessionId, record, logger);
    state.ids.add(id);
    state.events.push(event);
    return event;
```

</details>

**依据 4 · 源码核查**：[dsh/runtime/src/semantic-memory-store.mts:225-239](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/semantic-memory-store.mts#L225-L239)

状态写入使用锁、临时文件及替换。

<details>
<summary>查看原文（15行）</summary>

```text
function writeMemoryStore(storePath: string, store: MutableMemoryStore): Readonly<MemoryStore> {
  const value = validateStore(store, "Odai semantic memory write"); const parent = dirname(storePath); assertSafeStorePath(storePath);
  mkdirSync(parent, { recursive: true, mode: 0o700 }); const identities = assertSafeStorePath(storePath); const temporary = `${storePath}.tmp-${process.pid}-${randomUUID()}`; const noFollow = typeof constants.O_NOFOLLOW === "number" ? constants.O_NOFOLLOW : 0;
  try { let fd: number | undefined; try { fd = openSync(temporary, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | noFollow, 0o600); writeFileSync(fd, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8" }); fsyncSync(fd); } finally { if (fd !== undefined) closeSync(fd); }
    assertSafeStorePath(storePath); assertDirectoryIdentities(identities); renameSync(temporary, storePath); assertDirectoryIdentities(identities);
  } finally { rmSync(temporary, { force: true }); }
  return value;
}

export function mutateMemoryStore<TOutcome extends MemoryMutationOutcome>(storePath: string, mutate: (store: MutableMemoryStore) => TOutcome): Readonly<TOutcome & { store: Readonly<MemoryStore> }> {
  if (typeof mutate !== "function") throw new TypeError("memory mutator must be a function"); const identities = assertSafeStorePath(storePath); const releaseLock = acquireOwnedStoreLock(storePath, "Odai semantic memory");
  try { assertDirectoryIdentities(identities); const current = readMemoryStore(storePath); const mutable: MutableMemoryStore = { schemaVersion: MEMORY_STORE_SCHEMA_VERSION, settings: { ...current.settings }, entries: current.entries.map((entry) => ({ ...entry, scope: { ...entry.scope }, supersedes: [...entry.supersedes], conflictsWith: [...entry.conflictsWith], provenance: entry.provenance.map((source) => ({ ...source })) })) };
    const outcome = mutate(mutable); if (!outcome || outcome.changed !== true) return Object.freeze({ store: current, ...outcome }) as Readonly<TOutcome & { store: Readonly<MemoryStore> }>;
    const store = writeMemoryStore(storePath, mutable); return Object.freeze({ ...outcome, changed: true, store }) as Readonly<TOutcome & { store: Readonly<MemoryStore> }>;
  } finally { releaseLock(); }
```

</details>

**依据 5 · 作者声明**：[dsh/plugin/README.md:30-32](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/plugin/README.md#L30-L32)

作者说明证据位置与卸载边界。

```text
The package declares `dsh.bundle`, so DSH adds it to that profile's bundle stack and exposes Control Center without another package or command. It already contains the canonical Odai skill and runtime; a separate skill install is optional and remains inactive until the user explicitly changes the source mode. Start a new DSH process after installation. Agent-only users may install `odai-dsh-agent` instead; users may also keep both packages when they need profile-wide governance plus the selectable Agent preset. Coexistence still renders one Plugin-owned Control Center surface.

Odai audit evidence is stored under `$DSH_HOME/odai/session-evidence/`, not as private event types in DSH's core session log. This keeps every session written by the current Plugin readable when the Plugin is removed or upgraded.
```

#### 缺口

- 未实际核查记忆采集语义、权限平台差异、卸载后状态或实际模型用量
  **影响**：无法保证隐私、删除和运行成本
  **进一步探讨**：使用合成输入与隔离 DSH_HOME 核对记忆、证据、卸载残留及费用，再决定开启范围。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显式验证宿主能力并展示保护状态能否减少误信？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：在启动时检查执行 guard 和每个 Agent 的 restrict 能力，并在控制中心展示实际注册结果、作用范围及最近降级，可能比只显示路由配置更容易发现缺保护。对必需能力缺失可由部署选择停用职责路由或拒绝高风险操作，但这种行为需要明确兼容与用户控制，不能从当前可选调用推断已经实现。可在相同隔离任务中模拟 guard 缺失、restrict 抛错和断开控制中心，比较用户识别与写入结果；若界面仍显示保护而调用未被拦截，或误拒安全操作无法恢复，则假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/runtime/src/tool-runtime.mts:255-281](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/tool-runtime.mts#L255-L281)

当前 guard 为可选注册。

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.tools.guard?.((execution: ToolExecution) => {
    const agent = execution.agent;
    if (agent && !isSubagentSession(agent) && config.routing.mode !== "off" && !responsibilityScopes.get(agent)) {
      const events = evidence.events(agent);
      const consumed = new Set(events.filter(event => event.type === "odai/responsibility-gap-consumed").map(event => event.data.stateDigest));
      const message = latestDirectUserMessage(agent);
      const taskId = message && leadTaskId(events, message.id, classifyPendingReviewerText(extractLatestUserText([message])) === "continue");
      const state = leadState(events);
      if (taskId && state?.enabled && Array.isArray(state.roles) && state.roles.includes("planner") && isLeadWriteTool(execution.name)) {
        const existing = events.some(event => event.type === "odai/responsibility-gap" && event.data.taskMessageId === taskId && event.data.responsibility === "planner" && event.data.timing === "start");
        if (!existing) {
          appendEvent(agent, "odai/responsibility-gap", leadGap("planner", taskId, currentAgentTurn(agent), currentAgentStep(agent) ?? 0));
          return "ODAI_NAMED_START_PENDING: 主导模式已登记规划请求，正在等待职责调度，不是渠道故障。此工具尚未执行；请停止重试工具并结束当前回复，让运行时调度规划。规划回交后由控制器继续原任务。";
        }
      }
      if (events.some(event => event.type === "odai/responsibility-gap" && event.data.userNamed === true && event.data.timing === "start" && !consumed.has(event.data.stateDigest))) {
        const reason = "ODAI_NAMED_START_PENDING: 职责请求已登记，正在等待调度，不是渠道故障。此工具尚未执行；请停止重试工具并结束当前回复，让运行时调度职责。职责回交后由控制器继续原任务。";
        onDenied({ ...execution, agent }, reason);
        return reason;
      }
    }
    if (execution.agent && isManagedReviewer(execution.agent) && !reviewerAllowedTools.includes(execution.name)) {
      const reason = "ODAI_REVIEW_READ_ONLY: managed reviewers may only inspect delegated source with read, glob, grep, and immutable evidence with odai_review_evidence";
      onDenied({ ...execution, agent: execution.agent }, reason);
      return reason;
    }
    return childGuard(execution) ?? routeProtectionGuard(execution) ?? repeatedFailure.start(execution);
```

</details>

**依据 2 · 源码核查**：[dsh/runtime/src/tool-runtime.mts:304-329](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/tool-runtime.mts#L304-L329)

restrict 缺失与异常会退化。

<details>
<summary>查看原文（26行）</summary>

```text
    // even when its contextual capabilities have not changed.
    const key = JSON.stringify([policy.allow ?? null, deniedNames]);
    const previous = toolExposureStates.get(agent);
    if (previous?.key === key) return activeNames;
    previous?.dispose?.();
    const agentTools = agent.ctx?.tools;
    const restrict = agentTools?.restrict;
    if (typeof restrict !== "function") {
      toolExposureStates.set(agent, Object.freeze({ key }));
      return activeNames;
    }
    try {
      const restriction = deniedNames.length > 0 || policy.allow
        ? restrict.call(agentTools, { ...policy, deny: deniedNames })
        : undefined;
      const dispose = typeof restriction === "function" ? restriction : undefined;
      toolExposureStates.set(agent, Object.freeze({ key, dispose }));
      appendEvent(agent, "odai/tool-exposure-selected", {
        ...(options.turn === undefined ? {} : { turn: options.turn }),
        ...(options.step === undefined ? {} : { step: options.step }),
        mode: "adaptive",
        activeTools: activeNames,
      });
    } catch (error) {
      logger.warn(`Odai adaptive registry restriction is unavailable; prompt filtering and execution guards remain active: ${error instanceof Error ? error.message : String(error)}`);
      toolExposureStates.set(agent, Object.freeze({ key }));
```

</details>

**依据 3 · 源码核查**：[dsh/runtime/src/control-center-runtime.mts:160-181](https://github.com/orziz/odai/blob/ce7a999843ca42ecd84778561cb0ac7642c5648e/dsh/runtime/src/control-center-runtime.mts#L160-L181)

控制中心服务可延后安装或不可用。

<details>
<summary>查看原文（22行）</summary>

```text
export function installControlCenterRuntimeWhenAvailable(
  ctx: DshRuntimeContext,
  options: ControlCenterRuntimeOptions,
): () => Promise<void> {
  let release: (() => Promise<void>) | undefined;
  let stopped = false;
  if (ctx.inject) {
    const binding = ctx.inject(["connection", "webServer"], (available) => {
      if (stopped) return;
      const mounted = installControlCenterRuntime(available, options);
      release = mounted;
      available.effect?.(() => async () => {
        if (release === mounted) release = undefined;
        await mounted?.();
      }, "odai: Control Center transport ownership");
    });
    return async () => {
      stopped = true;
      await binding.dispose();
      const current = release;
      release = undefined;
      await current?.();
```

</details>

#### 缺口

- 该能力验证与用户对照尚未实现
  **影响**：无法证明能降低误信或不破坏兼容
  **进一步探讨**：控制各项宿主能力和异常，比较配置显示、实际拦截与恢复结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
