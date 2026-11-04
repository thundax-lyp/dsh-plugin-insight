# @mstar-harness/dsh

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[dac1c78](https://github.com/btspoony/mstar-harness/tree/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh)

<!-- BEGIN META -->
[![GitHub ★ 68](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=68&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/btspoony/mstar-harness) [![npm 30d 4,104](https://img.shields.io/static/v1?label=npm+30d&message=4%2C104&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mstar-harness/dsh) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@mstar-harness/dsh)
<!-- END META -->

> **功能**：将 Morning Star 工作流门禁、命令和面板接入 DeepSeek Harness。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将工作流约定接到 DSH 事件与部分拒绝通道，同时提供面板和原生命令；引擎本身与宿主权限不归此组件独立实现。

> **主要限制**：[Q02](#research-q02) hard 调度异常仍可能退化放行，文件意图对待写正文不可见；[Q03](#research-q03) 共享 MCP 显式信任调用者提供的会话身份，不能据此声称所有入口均受控。

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
  - [Q01 · 这个 DSH 组件解决什么工作流问题，相比人工约定新增什么？](#detail-section-11)
  - [Q02 · 调度与状态写入在哪些情况下拒绝、告警或放行？](#detail-section-12)
  - [Q03 · 共享 MCP 和原生工具如何确定调用身份，部署信任边界在哪里？](#detail-section-13)
  - [Q04 · 面板从哪里读取数据，部署和维护需要什么条件？](#detail-section-14)
  - [Q05 · 将门禁覆盖与退化状态汇总到可验证视图是否减少错误信任？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Morning Star 约定的团队可在 DSH 内观察调度和工作流状态，见 [Q01](#research-q01)。

比较对象为文档约定加人工审查与宿主原有工具权限；本组件接入引擎和决策点，不证明全部操作被拦截。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 调度门禁 | 检查部分子代理和工作流调用 | 依赖工具名及 Assignment 形态；异常可能放行 |
| 状态意图检查 | 对指定工作流文件与存储权威给出决定 | 意图不含新正文；硬模式存在修复放行 |
| 原生命令工具 | 绑定计划、验证审计或清理执行状态 | 依赖引擎、命令与宿主工具服务 |
| 共享 MCP | 暴露跨宿主工作流命令 | 显式信任调用者 sessionId；桥接及 CLI 版本须核 |
| 工作流面板 | 查看会话工作区的存储快照 | 依赖 Web 服务和服务器端 cwd 解析 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH Loader 与事件 seam | Host 必需 | 注册门禁和服务 | 入口无法挂载或未触发 |
| Morning Star engine 与命令 | 验证与原生命令必需 | 规则、状态与操作 | 实际包及契约未验证 |
| 可解析 harness 根及存储 | 工作流控制条件 | 读取状态及记录 | 不存在或不可读时部分功能降级 |
| MCP bridge 与 CLI | 共享 MCP 条件 | 提供共享命令通道 | 缺失时相关工具不可用 |
| Web Client 的 slots、sessions、connection | 面板条件 | 会话右栏与快照读取 | 面板不能完整加载 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 团队在隔离 profile 核对版本、根与信任边界 | 保留原有权限和人工审查 |
| 加载 | 管理者确认插件、引擎、工具和面板挂载 | 缺服务或 degraded 时不依赖对应控制 |
| 分派 | 协调者提交明确 Assignment 并观察门禁结果 | 确认目标工具匹配且拒绝或告警符合模式 |
| 验收 | 团队核对实际状态、日志和操作结果 | 不匹配时停止自动流程并人工审查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 运行与依赖成本未知 | 配置根、角色、权限及 MCP | 版本与身份信任须核对 |
| 持续使用 | 存储、模型与子代理资源未知 | 检查告警、账本及模式 | 提效未经比较 |
| 失败恢复 | 排障与重复任务资源未知 | 调查 degraded、恢复人工审查 | 宿主故障结果未知 |
| 退出 | 状态迁移成本未知 | 恢复原配置并核对保留数据 | 卸载行为未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 调度门禁 | 监听器对匹配输入返回 deny 或告警 | 宿主覆盖与实际错误减少 |
| 工作流面板 | Client 与服务端快照入口 | 数据完整性与真实渲染 |
| 会话身份 | 原生工具从执行上下文取身份 | 共享 MCP 的实际隔离与认证 |

> **思考**：[Q02](#research-q02) hard 调度异常仍可能退化放行，文件意图对待写正文不可见；[Q03](#research-q03) 共享 MCP 显式信任调用者提供的会话身份，不能据此声称所有入口均受控。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将工作流约定接到 DSH 事件与部分拒绝通道，同时提供面板和原生命令；引擎本身与宿主权限不归此组件独立实现。

[Q02](#research-q02) 使用宿主可拒绝的 waterfall 而非只定义接口；同时明确调度异常放行、状态正文不可见与监听范围限制。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) hard 调度异常仍可能退化放行，文件意图对待写正文不可见；[Q03](#research-q03) 共享 MCP 显式信任调用者提供的会话身份，不能据此声称所有入口均受控。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在隔离 profile 先确认根、门禁模式、工具名称与 MCP 信任，出现 degraded 或身份不明时恢复人工审查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持宿主监听、原生工具与面板入口；实际引擎、宿主与 MCP 运行未验证。覆盖视图是假设。

- 已检查：作者 README、包清单、源码路径 packages/dsh/README.md、packages/dsh/package.json、packages/dsh/bundle/cordis.patch.yml、packages/dsh/src/index.ts、packages/dsh/src/gates/dispatch.ts、packages/dsh/src/gates/workflow-policy.ts、packages/dsh/src/gates/status.ts、packages/dsh/src/gates/leaf-seat.ts、packages/dsh/src/gates/native-commands.ts、packages/dsh/src/client/index.ts、packages/dsh/src/panel/panel-snapshot-endpoint.ts 及固定范围 inventory；组件：packages/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 packages/dsh 的包、bundle、Host 注册、调度和状态代表路径、原生工具、MCP 配置及 Client 和面板读取；未审完整引擎、CLI、所有门禁或宿主。
- 下一步：在隔离宿主验证 hard/warn/ask、重命名工具、存储不可用、MCP 身份与面板根；本次未运行目标代码、测试、插件或模型任务。

**分析版本**

- **仓库**：[btspoony/mstar-harness](https://github.com/btspoony/mstar-harness)
- **版本号**：4.2.0（[固定提交 dac1c78](https://github.com/btspoony/mstar-harness/tree/dac1c781bad900f938d7a752222b9f139dc42222)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设展示实际门禁覆盖、模式和 degraded 状态可减少操作者误信；尚未实现或验证。

在隔离宿主验证 hard/warn/ask、重命名工具、存储不可用、MCP 身份与面板根；本次未运行目标代码、测试、插件或模型任务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 2693 | — | — | 74637 |
| .ts | source | 56 | 23103 | 11175 | 10863 | — |
| .tsx | source | 6 | 1900 | 1405 | 417 | — |
| .ts | test | 83 | 32053 | 22306 | 6560 | — |
| .md | example | 11 | 163 | — | — | 448 |
| .ts | example | 1 | 184 | 95 | 72 | — |
| .tsx | test | 2 | 1436 | 1100 | 226 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/btspoony/mstar-harness/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 62](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=62&color=737b86&logo=github)](https://github.com/btspoony/mstar-harness/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 78](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=78&color=737b86&logo=github)](https://github.com/btspoony/mstar-harness/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对 DSH 适配的实际门禁入口、身份、面板和退化边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个 DSH 组件解决什么工作流问题，相比人工约定新增什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 Morning Star 工作流约定、希望在 DSH 中协作分派和查看进度的团队，可以用该组件把引擎验证、调度门禁、原生工具与右侧工作流面板接进宿主。相比只写文档要求执行者遵守，它在部分 DSH 文件意图和工具执行入口注册决策，并为会话提供状态读取与命令入口。它是仓库中 packages/dsh 的 Host 和 Client 插件，不等同整个 Morning Star 引擎；实际验证语法和持久化由其他包承担，模型是否遵循结果和团队是否提效仍未知。无 harness 根或相关宿主服务时部分功能降级。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh/README.md:5-9](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/README.md#L5-L9)

作者描述引擎门禁、技能挂载和宿主能力。

```text
![dsh](https://img.shields.io/badge/dsh-0.2.1--rc.5-4B32C3.svg)

[Morning Star](https://github.com/btspoony/mstar-harness) as a first-class dsh (DeepSeek Harness) host — a cordis function plugin that mounts the mstar engine in-process, implements the engine `HostAdapter` (`host: 'dsh'`), guards `{HARNESS_DIR}/status.json` writes (validate + advisory; repair-escape under hard), blocks disallowed subagent dispatches when `Enforcement: hard` is on, lints `SKILL.md` writes under the mounted skill roots, mounts the mstar `skills/` mirror through the dsh skill-filesystem provider (single canonical mount), and appends a durable `mstar-engine` catalog row (persisted-log readers also accept the legacy `mstar-engine-status` identity) to every composed agent step. Boot with a dsh Loader app; everything acts through the seam's refusal/advisory channels, never by patching the tools.

This plugin's runtime requirement comes from the dsh host: the runtime that host provides must expose the native `node:sqlite` module the mstar store requires (the capability the store gate enforces). A Bun-hosted host is not version-gated - `engines.bun` in the workspace manifests declares the development toolchain - and the store's Node version floor applies to Node entrypoints only. Node is not additionally required for this package.
```

**依据 2 · 源码核查**：[packages/dsh/package.json:16-34](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/package.json#L16-L34)

包提供 Host 与 Client 入口。

<details>
<summary>查看原文（19行）</summary>

```text
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./invariant": {
      "types": "./dist/invariant.d.ts",
      "default": "./dist/invariant.js"
    },
    "./client": {
      "types": "./dist/client.d.ts",
      "default": "./dist/client.js"
    },
    "./locale/*.json": "./locale/*.json",
    "./bundle/cordis.patch.yml": "./bundle/cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 3 · 源码核查**：[packages/dsh/src/index.ts:413-454](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/index.ts#L413-L454)

按会话工作区构造 resolver、服务和宿主 adapter。

<details>
<summary>查看原文（42行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  // Per-workspace `{HARNESS_DIR}` resolution: the probe NEVER starts from
  // the process cwd — it starts from the WORKSPACE root of the session
  // whose agent drives each event (the session cwd). At boot there is no
  // session yet, so the boot value is the explicit config or null; every
  // event path (fs intents, tools/pre-execute, agent/pre-step, tool
  // executes) resolves per its own session workspace, memoized per
  // workspace root. Repos whose harness root is not one of the probed
  // names (`.mstar/` → `.agents/` → `.plans/`/`plans/`) declare
  // `config.harnessDir`, which wins outright.
  const resolver = new HarnessResolver(config.harnessDir)
  const bootHarnessDir = resolver.forWorkspace(undefined)
  // The Service constructor registers itself on the fiber via reflect.provide,
  // so construction alone exposes `ctx.dshMstar` (dsh service convention).
  new DshMstar(ctx, { harnessDir: bootHarnessDir })
  // The Linear credential the enabled `linear-mcp` row consumes: the row's
  // `!!js` headers expression reads `ctx.mstarLinearAuth`, and this service
  // owns the silent refresh loop + the public `Fiber.restart()` reload (see
  // `linear-settings.ts`). Construction alone exposes the service.
  const linearAuth = new MstarLinearAuth(ctx)
  // Agent-flow settle pairing store : apply-scoped in-memory Maps, SAME lifetime as the
  // catalog cache below — an HMR restart resets them and completions outside
  // the window stay unpaired (documented honest degrade; no cross-apply
  // pairing). Shared by the dispatch recording (callId → dispatchRef via the
  // background jobId) and the jobs `settled` event subscription (reads jobId).
  // `catalogBySession` slot map carries the call-window child-identity join
  // (raw label → candidate, keyed by the live parent Session object) through
  // the same lifetime: a catalog outside the apply window joins nothing.
  const pairing: AgentFlowPairing = {
    dispatchByCallId: new Map(),
    dispatchByJobId: new Map(),
    // Team member child SessionId → the `spawn_teammate` dispatch that created
    // it, consumed by the member's `subagent/end` settlement (the tool return
    // is NOT a completion). Bounded by the agent-flow module.
    teamDispatchByChildId: new Map(),
    catalogBySession: new WeakMap(),
  }
  // The host-facing HostAdapter facade — the fs-intent / pre-execute gates
  // route through it (host hooks and in-plugin gates share ONE code path).
  // Constructed as a dsh service: `ctx.dshHostAdapter` is available to
  // inject consumers and host hooks after boot.
  const adapter = new DshHostAdapter(ctx, { resolver, config, pairing })
```

</details>

**依据 4 · 源码核查**：[packages/dsh/src/index.ts:811-849](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/index.ts#L811-L849)

注册文件意图、工具执行的监听器。

<details>
<summary>查看原文（39行）</summary>

```text
  // Status gate — fs intent slot (single-slot waterfall; prepend so this
  // decider runs before dsh-fs-policy regardless of mount order).
  ctx.on('fs/write-intent', (target, actor, next) => writeIntentListener(ctx, resolver, config, adapter, target, actor, next), { prepend: true })
  ctx.on('fs/edit-intent', (target, actor, next) => editIntentListener(ctx, resolver, config, adapter, target, actor, next), { prepend: true })

  // Skill-authoring lint gate — fs/write-intent slot scoped to SKILL.md
  // under the configured skill roots (same single-slot waterfall +
  // prepend + next() delegation contract as the status gate — this gate
  // also never throws except the intentional incoming-doc veto in
  // `lintSkillWrite`).
  ctx.on('fs/write-intent', (target, actor, next) => skillWriteIntentListener(ctx, resolver, config, target, actor, next), { prepend: true })

  // Artifact seam gates — fs/write-intent slots scoped per artifact
  // (design-md / audit / compound / roles; same envelope: warn advisory
  // default, hard-mode repair escape on the content-blind listener, typed
  // `SeamVetoError` on the known-document branch, degrade-to-allow). The
  // scopes are disjoint, so the four listeners never double-decide one
  // target.
  const seams: SeamId[] = ['design-md', 'audit', 'compound', 'roles']
  for (const seam of seams) {
    ctx.on('fs/write-intent', (target, actor, next) => seamWriteIntentListener(ctx, resolver, config, seam, target, actor, next), { prepend: true })
  }

  // Dispatch gate — tools/pre-execute waterfall (refusal channel:
  // PreToolDecision.deny returned without next()). Registered prepend for the
  // same reachability reason as the fs slots: an earlier-mounted
  // listener that returns a decision without next() would short-circuit the
  // chain and make this security gate unreachable — "a deny short-circuits
  // regardless of order" holds only once the listener is reached.
  ctx.on('tools/pre-execute', (exec, next) => preExecuteListener(ctx, resolver, config, adapter, exec, next), { prepend: true })

  // Leaf-seat tool boundary — the folded MCP surface's coordinator actions
  // (`plan.bind`, `plan.complete`, `session.recover`) refused for a known leaf
  // seat before the MCP client child executes, on every connection INCLUDING
  // the profile-wide generic `mstar-mcp` row: that row is launched from the
  // bundle patch and carries no `--seat`, so the server-side restriction cannot
  // cover it and this host boundary is what refuses the seat.
  // Same refusal channel and prepend reachability argument as the gate above.
  ctx.on('tools/pre-execute', (exec, next) => leafSeatToolListener(exec, next), { prepend: true })
```

</details>

**依据 5 · 源码核查**：[packages/dsh/src/client/index.ts:116-141](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/client/index.ts#L116-L141)

右侧会话面板注册。

<details>
<summary>查看原文（26行）</summary>

```text
  // ONE entry: the session's right-pane tab. The product is per-repository state,
  // so the host's GLOBAL panel list gets no row from this plugin — and with no
  // global row there is no keyed `main` seat to open, and no selection call.
  // The body seat closes over the two clients exactly as the old view-tab
  // registration did: the transport is a plugin-level concern, never a
  // host-supplied prop. The `store` option hands the seat the panel's
  // entry store (plan sidebar §L2.4): the framework caches one instance per
  // (entry, session), so the selected section survives the body's unmount
  // while another pane tab is active.
  const panelStore = createPanelStore()
  ctx.effect(
    () => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
      name: 'sidebar.right.pane.tab',
      key: MSTAR_PANEL_ID,
      locale: NS,
      store: panelStore,
    }, (props: Parameters<typeof PanelView>[0]) =>
      PanelView({
        ...props,
        picker,
        panelSnapshot,
        localeFace: ctx.locale,
        themeFace,
      }))),
    'ui-mstar-panel: panel body',
  )
```

</details>

#### 缺口

- 未做团队工作流对照或真实宿主运行
  **影响**：不能证明减少错误、提高交付速度或全部入口已受控
  **进一步探讨**：在隔离工作区核对角色分派、目标文件写入、审批及结果，再对照无插件流程。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 调度与状态写入在哪些情况下拒绝、告警或放行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 在 tools/pre-execute 注册调度监听，先处理 workflow/ralph、团队工具，再按配置名称与 Assignment 形态处理子代理；hard 且验证结果要求阻断时返回 deny，其他情况继续 next。workflowGate 默认 warn，未覆盖计划在 warn 和 ask 下均只是告警，hard 才拒绝；ask 针对未知工作流名称走宿主审批。调度内部异常被捕获，记录 degraded 后在 hard 模式也继续 next，因此不能将 hard 解读成任意故障均拒绝。文件意图针对特定 harness 文档及权威存储范围，权威性拒绝会抛出；但该意图没有传入待写正文，对已有非法文档在 hard 模式允许修复尝试，意外异常也退化放行。绕过这些宿主事件的文件操作不由此监听器证明受控。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/index.ts:811-840](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/index.ts#L811-L840)

apply 注册实际意图及工具执行监听器。

<details>
<summary>查看原文（30行）</summary>

```text
  // Status gate — fs intent slot (single-slot waterfall; prepend so this
  // decider runs before dsh-fs-policy regardless of mount order).
  ctx.on('fs/write-intent', (target, actor, next) => writeIntentListener(ctx, resolver, config, adapter, target, actor, next), { prepend: true })
  ctx.on('fs/edit-intent', (target, actor, next) => editIntentListener(ctx, resolver, config, adapter, target, actor, next), { prepend: true })

  // Skill-authoring lint gate — fs/write-intent slot scoped to SKILL.md
  // under the configured skill roots (same single-slot waterfall +
  // prepend + next() delegation contract as the status gate — this gate
  // also never throws except the intentional incoming-doc veto in
  // `lintSkillWrite`).
  ctx.on('fs/write-intent', (target, actor, next) => skillWriteIntentListener(ctx, resolver, config, target, actor, next), { prepend: true })

  // Artifact seam gates — fs/write-intent slots scoped per artifact
  // (design-md / audit / compound / roles; same envelope: warn advisory
  // default, hard-mode repair escape on the content-blind listener, typed
  // `SeamVetoError` on the known-document branch, degrade-to-allow). The
  // scopes are disjoint, so the four listeners never double-decide one
  // target.
  const seams: SeamId[] = ['design-md', 'audit', 'compound', 'roles']
  for (const seam of seams) {
    ctx.on('fs/write-intent', (target, actor, next) => seamWriteIntentListener(ctx, resolver, config, seam, target, actor, next), { prepend: true })
  }

  // Dispatch gate — tools/pre-execute waterfall (refusal channel:
  // PreToolDecision.deny returned without next()). Registered prepend for the
  // same reachability reason as the fs slots: an earlier-mounted
  // listener that returns a decision without next() would short-circuit the
  // chain and make this security gate unreachable — "a deny short-circuits
  // regardless of order" holds only once the listener is reached.
  ctx.on('tools/pre-execute', (exec, next) => preExecuteListener(ctx, resolver, config, adapter, exec, next), { prepend: true })
```

</details>

**依据 2 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:1038-1076](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L1038-L1076)

仅对 Assignment 形态调用校验，hard 决定 deny。

<details>
<summary>查看原文（39行）</summary>

```text
async function gateAssignmentText(
  ctx: Context,
  harnessDir: string | null,
  config: Config,
  adapter: DshHostAdapter,
  exec: ToolExecution,
  prompt: string,
  hintReadOf: () => SessionHintRead,
): Promise<PreToolDecision | undefined> {
  const toolName = exec.name
  // Shape guard + advisory role read run on the header region:
  // a `## Assignment` heading or field line quoted in the task body cannot
  // shape a non-assignment prompt or leak into the advisory role.
  const header = assignmentHeaderRegion(prompt)
  if (!isAssignmentShaped(header)) return undefined

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
  return undefined
```

</details>

**依据 3 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:1140-1162](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L1140-L1162)

workflow、团队和具名子代理分支的匹配。

<details>
<summary>查看原文（23行）</summary>

```text
  // WORKFLOW/RALPH BRANCH — BEFORE the subagent prompt branch: `workflow`/`ralph` carry no
  // `args.prompt`, so the prompt guard below would pass them through even
  // if the names were added to the dispatch-tool match list (W4 double
  // no-op). Keyed on the FIXED tool names — the workflow tools are gated
  // by their own branch, never by `DEFAULT_DISPATCH_TOOLS` addition.
  const workflowDecision = await gateWorkflow(ctx, harnessDir, config, adapter, exec, hintReadOf)
  if (workflowDecision !== undefined) return workflowDecision
  // AGENT TEAMS BRANCH — BEFORE and TERMINAL FOR the names it owns (the
  // workflow branch above demonstrates the same placement): the team tools
  // carry the Assignment text in a different argument field per tool and are
  // gated by their own fixed-name branch, never by addition to
  // `DEFAULT_DISPATCH_TOOLS`. Returning the branch result UNCONDITIONALLY —
  // `undefined` included — is what makes the ownership terminal: a team name
  // a caller also added to `Config.dispatchTools` can no longer fall through
  // into the subagent match below and be gated (and ledger-recorded) twice.
  if (isTeamDispatchTool(exec.name)) {
    return gateTeamDispatch(ctx, harnessDir, config, adapter, exec, hintReadOf)
  }
  if (!(config.dispatchTools ?? [...DEFAULT_DISPATCH_TOOLS]).includes(toolName)) return undefined
  const args = asRecord(exec.arguments)
  const prompt = typeof args?.prompt === 'string' ? args.prompt : undefined
  if (prompt === undefined) return undefined
  return gateAssignmentText(ctx, harnessDir, config, adapter, exec, prompt, hintReadOf)
```

</details>

**依据 4 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:1179-1204](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L1179-L1204)

异常记录 degraded 并继续下游。

<details>
<summary>查看原文（26行）</summary>

```text
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
    } catch (emitError) {
      // Best-effort observability: a throwing advisory consumer must not take
      // the gate down with it (the error log above is the durable signal).
      ctx.logger(DISPATCH_LOGGER).error(`dispatch gate degraded advisory emit failed: ${(emitError as Error).message}`)
    }
  }
  return veto ?? await next()
```

</details>

**依据 5 · 源码核查**：[packages/dsh/src/gates/workflow-policy.ts:228-255](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/workflow-policy.ts#L228-L255)

默认 warn 与未覆盖计划的模式差异。

<details>
<summary>查看原文（28行）</summary>

```text
export function workflowPolicy(config: Config, cache: WorkflowAskCache, input: WorkflowGateInput): WorkflowPolicyVerdict {
  const mode = config.workflowGate ?? 'warn'
  // The gate short-circuits `off` before the policy — kept for a total
  // policy (a caller that skips the short-circuit still cannot block).
  if (mode === 'off') return { decision: 'allow' }
  // P-b row-scope attribution — FIRST, a workspace-level red line that
  // applies to workflow AND ralph (no `meta.name` needed): the calling
  // workspace has an `InProgress` plan without a recorded row scope.
  // It preempts the name-based policies — an orphan plan means NO writable
  // fan-out should start children until the plan is recovered, regardless of
  // allowlist identity (same red line as the Assignment-keyed lease gate).
  if (input.uncoveredPlanId !== undefined) {
    if (mode === 'hard') {
      return {
        decision: 'deny',
        code: WORKFLOW_LEASE_UNCOVERED_CODE,
        reason: `workflow gate (${input.tool}) vetoed: plan "${input.uncoveredPlanId}" is InProgress without a recorded row scope (workflowGate: hard — record it through \`mstar plan prepare --worktree-path <abs> --working-branch <name>\` before writable fan-out)`,
      }
    }
    // warn / ask: allowed with an advisory verdict + one warn. The ask
    // channel is for first-seen NAMES (P-c), never a substitute for the
    // workspace red line — an uncovered workspace stays advisory-only unless
    // the deployment opts into hard.
    return {
      decision: 'warn',
      code: WORKFLOW_LEASE_UNCOVERED_CODE,
      reason: `plan "${input.uncoveredPlanId}" is InProgress without a recorded row scope (workflowGate: warn — advisory only; record it through \`mstar plan prepare\`)`,
    }
```

</details>

**依据 6 · 源码核查**：[packages/dsh/src/gates/status.ts:364-395](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/status.ts#L364-L395)

权威存储拒绝会抛出。

<details>
<summary>查看原文（32行）</summary>

```text
    if (harnessDir === null) return
    const kind = harnessDocKindOfTarget(harnessDir, target.displayPath)
    // FW-1/G4b: the store-authority refusal class is decided BEFORE any
    // document validation and vetoes in BOTH enforcement modes — a hand write
    // of the store database, or of a retired/unreadable-authority register,
    // is an authority invariant no enforcement flag governs (the dsh
    // `catalogRegistrationVeto` precedent). The pre-activation legacy register
    // route returns no refusals and keeps the document path below.
    const authorityRefusals = await storeAuthorityRefusals({
      resolvedHarnessDir: harnessDir,
      directKind: kind,
      rawPath: target.displayPath,
    })
    if (authorityRefusals.length > 0) {
      const hard = resolveHard(harnessDir, config)
      ctx.logger(LOGGER_NAME).error(
        `${target.displayPath} ${operation} VETOED (store-authority refusal class; unconditional — an authority invariant, not the enforcement flag):\n${authorityRefusals.map(formatViolation).join('\n')}`,
      )
      // The advisory is contained: a throwing consumer must not hand the
      // catch below an error it would contain as a degrade-to-allow (the
      // throw at the end of this branch IS the decision).
      try {
        ctx.emit('mstar/status-gate', { operation, target: target.displayPath, result: { ok: false, violations: authorityRefusals }, hard })
      } catch (emitError) {
        ctx.logger(LOGGER_NAME).error(`status gate veto advisory emit failed: ${(emitError as Error).message}`)
      }
      throw new StatusVetoError(
        target.displayPath,
        authorityRefusals,
        'the issue/catalog authority is not hand-writable (store-authority refusal class; unconditional — an authority invariant, not the enforcement flag)',
      )
    }
```

</details>

**依据 7 · 源码核查**：[packages/dsh/src/gates/status.ts:396-441](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/status.ts#L396-L441)

内容盲的修复放行及意外故障退化。

<details>
<summary>查看原文（46行）</summary>

```text
    if (kind === null) return
    // The adapter owns the shared status-gate core (missing file = first
    // create = pass); this listener adds enforcement + observability.
    const result = await adapter.statusGate(target.displayPath, kind, harnessDir)
    const hard = resolveHard(harnessDir, config)
    const verdict = applyEnforcement(result, { hard })
    if (!verdict.ok) {
      if (verdict.hardBlocked) {
        // The one refusal this seam CAN make: the store-authority class (see
        // CLEANUP_AUTHORITY_UNAVAILABLE_CODE). Thrown past the error-containment
        // envelope below, which contains UNEXPECTED errors only — the veto is a
        // decision, and the fs-policy channel turns it into an isError write.
        if (verdict.violations.some((violation) => violation.code === CLEANUP_AUTHORITY_UNAVAILABLE_CODE)) {
          ctx.logger(LOGGER_NAME).error(
            `status.json ${operation} VETOED (Enforcement: hard; the issue authority is unavailable, so the findings cleanup gate has no verdict — no filesystem write can repair that):\n${verdict.violations.map(formatViolation).join('\n')}`,
          )
          // The advisory is contained: a throwing consumer must not hand the
          // catch below an error it would contain as a degrade-to-allow (the
          // throw at the end of this branch IS the decision).
          try {
            ctx.emit('mstar/status-gate', { operation, target: target.displayPath, result: verdict, hard })
          } catch (emitError) {
            ctx.logger(LOGGER_NAME).error(`status gate veto advisory emit failed: ${(emitError as Error).message}`)
          }
          throw new StatusVetoError(
            target.displayPath,
            verdict.violations,
            'Enforcement: hard — the issue authority cannot be consulted, so the findings cleanup gate has no verdict and no filesystem write can repair it',
          )
        }
        // Repair escape: the current document is already invalid; this write
        // may BE the repair, so allow it — but make the degraded control
        // loud (error-level log + repair advisory, `hard: true`).
        ctx.logger(LOGGER_NAME).error(
          `status.json ${operation} ALLOWED as repair (Enforcement: hard; the current on-disk document is already invalid — the intent carries no incoming content, so the vetoable signal is only the pre-write state):\n${verdict.violations.map(formatViolation).join('\n')}`,
        )
        ctx.emit('mstar/status-gate', { operation, target: target.displayPath, result: verdict, hard, repair: true })
      } else {
        ctx.logger(LOGGER_NAME).warn(`status.json ${operation} (advisory):\n${verdict.violations.map(formatViolation).join('\n')}`)
        ctx.emit('mstar/status-gate', { operation, target: target.displayPath, result: verdict, hard })
      }
    }
  } catch (error) {
    // The typed veto is rethrown untouched (the only throw this gate makes).
    if (error instanceof StatusVetoError) throw error
    ctx.logger(LOGGER_NAME).error(`status gate degraded to allow: ${(error as Error).message}`)
```

</details>

#### 缺口

- 实际宿主各写入途径是否都触发对应意图及引擎判断未核查
  **影响**：不能声称所有文件修改或调度始终受保护
  **进一步探讨**：在固定宿主对正常、非 Assignment、异常引擎与绕过意图的操作逐一验证。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 共享 MCP 和原生工具如何确定调用身份，部署信任边界在哪里？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

bundle 插入一个共享 mstar MCP 客户端并通过 npx 启动 CLI，参数包含 trust-caller-session-id；同一 patch 的说明明确这将可提供的 sessionId 当作 bearer 身份，连接不可信调用方时需要移除此信任或加入传输认证。此 CLI 包没有在该 npx 参数中固定版本，实际拉取版本与发布制品需另核。与此不同，原生 plan bind 工具从执行上下文注入调用身份并丢弃参数中的 sessionId，对已知 leaf 先拒绝；另一个 pre-execute 监听限制已知 leaf 调用部分协调者 MCP 动作。这些局部检查不构成对整个连接或所有外部入口的完整授权审计，特别是没有实际检验 MCP 服务端实现和宿主调用者隔离。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/bundle/cordis.patch.yml:15-25](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/bundle/cordis.patch.yml#L15-L25)

共享 MCP 客户端及缺桥接依赖的结果。

<details>
<summary>查看原文（11行）</summary>

```text
# The `mstar-mcp` row launches the host-neutral MCP server
# (`npx @mstar-harness/cli mcp`, stdio) through Cordis's `mcp-client` bridge.
# It requires that bridge package in the profile's dependencies
# (`dsh plugin --profile web add @deepseek-ai/dsh-mcp-client`); app-boot
# tolerates the row failing to load without it, in which case no mstar MCP
# tools appear and `mstar-harness doctor --target dsh` reports the mismatch.
#
# Shared-only contract: this ONE row is the whole MCP channel for the host.
# The plugin registers no MCP client of its own — a per-agent MCP instance
# could not be given per-call arguments (`PreToolDecision` has no
# argument-rewrite arm), so it would buy nothing but one Node process per
```

</details>

**依据 2 · 源码核查**：[packages/dsh/bundle/cordis.patch.yml:65-89](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/bundle/cordis.patch.yml#L65-L89)

信任调用者 sessionId 的声明和未固定版本 npx 配置。

<details>
<summary>查看原文（25行）</summary>

```text
# Identity: the row passes `--trust-caller-session-id`. A stdio child has no
# host-proven caller identity, so this flag is the deployment's explicit
# statement that it owns this connection's trust boundary -- without it the
# per-call `sessionId` selector stays unpublished and a call that sends one is
# refused (`mcp.caller-identity-unavailable`). With it, the selector is
# published and its value is a BEARER identity: `executionContextFor` turns it
# into `context.caller` and the engine resolves the caller's OWN coordinator
# binding from it, so knowing a live session id is enough to act as that
# session. Authorization is still that binding row plus the optional `--expect`
# CAS token. A deployment that connects callers it does not trust must remove
# the flag (or add transport authentication); the refusal then names the
# host-proven routes -- the native tools `mstar_plan_bind`,
# `mstar_audit_validate`, `mstar_execution_clear` and the CLI.

- insert:
    - id: mstar
      name: '@mstar-harness/dsh'
      config: {}
    - id: mstar-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: mstar
        transport: stdio
        command: npx
        args: ['-y', '@mstar-harness/cli', 'mcp', '--trust-caller-session-id']
```

</details>

**依据 3 · 源码核查**：[packages/dsh/src/gates/native-commands.ts:778-794](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/native-commands.ts#L778-L794)

原生工具拒绝已知 leaf、去除模型传入身份并执行命令。

<details>
<summary>查看原文（17行）</summary>

```text
    async execute(args, exec) {
      // Fail-closed leaf guard FIRST: `plan bind` is the command that mints a
      // coordinator seat, and a known leaf seat can never own one — refuse
      // before any admission or engine round-trip.
      if (isLeafSeatHeader(sessionHeaderOf(exec))) {
        return toCanonicalValue(leafSeatRefusal(commandId))
      }
      const input = args as Record<string, unknown>
      // Identity is never model-supplied: strip the session selector before
      // admission so the shared admission resolves it from the injected
      // context (exec.agent.id) instead of an argument value.
      const { sessionId: _ignored, ...commandInput } = input
      const envelope = await executeCommand(commandId, commandInput, invocationContextOf(exec, resolver))
      // The durable adoption runs on every bind arm; `adoptNativeExecutionBinding`
      // returns the envelope untouched when the input carries neither
      // `execution: true` nor a `resumeRef`, and a refused bind is never rewritten.
      return toCanonicalValue(await adoptNativeExecutionBinding(envelope, commandInput, exec))
```

</details>

**依据 4 · 源码核查**：[packages/dsh/src/gates/native-commands.ts:1035-1055](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/native-commands.ts#L1035-L1055)

实际注册三个原生工具。

<details>
<summary>查看原文（21行）</summary>

```text
 *
 * The surface is exactly three tools (see the module header for the rule):
 * `mstar_plan_bind` (the durable-slot producer), `mstar_audit_validate` (no MCP
 * twin) and `mstar_execution_clear` (no shared command).
 * @param ctx - registrant context carrying the tool registry.
 * @param resolver - the per-workspace `{HARNESS_DIR}` resolver (the control
 * root resolves per the calling session's workspace — never the process cwd).
 */
export function registerNativeCommandTools(ctx: Context, resolver: { forAgent(agent: unknown): string | null }): void {
  ctx.inject(['tools'], (toolsCtx) => {
    const definition = getCommandDefinitions().find((candidate: CommandDefinition) => candidate.id === NATIVE_COMMAND_ID)
    if (definition === undefined) throw new Error(`no shared command definition for the native tool: ${NATIVE_COMMAND_ID}`)
    const disposers: Array<() => void> = [
      toolsCtx.tools.register(nativeCommandTool(definition, resolver)),
      toolsCtx.tools.register(auditValidateTool()),
      toolsCtx.tools.register(executionClearTool(resolver)),
    ]
    return () => {
      for (const dispose of disposers.splice(0)) dispose()
    }
  })
```

</details>

**依据 5 · 源码核查**：[packages/dsh/src/gates/leaf-seat.ts:169-177](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/leaf-seat.ts#L169-L177)

已知 leaf 的协调者动作匹配。

```text
export function leafSeatCoordinatorRefusal(exec: Pick<ToolExecution, 'name' | 'arguments' | 'agent'>): string | undefined {
  const tools = foldedSeatTools(exec.name)
  if (tools.length === 0) return undefined
  const args = exec.arguments
  if (typeof args !== 'object' || args === null || Array.isArray(args)) return undefined
  const action = (args as { action?: unknown }).action
  const commandId = tools.map((tool) => coordinatorSeatCommandFor(tool, action)).find((id) => id !== undefined)
  if (commandId === undefined) return undefined
  if (!isLeafSeatHeader(sessionHeaderOf(exec.agent))) return undefined
```

**依据 6 · 源码核查**：[packages/dsh/src/gates/leaf-seat.ts:198-204](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/leaf-seat.ts#L198-L204)

匹配时返回 deny，否则委托。

```text
/**
 * The `tools/pre-execute` listener: deny WITHOUT calling `next()` (the
 * waterfall short-circuit every refusal on this seam uses), delegate otherwise.
 */
export function leafSeatToolListener(exec: ToolExecution, next: () => Promise<PreToolDecision>): Promise<PreToolDecision> {
  const refusal = leafSeatCoordinatorRefusal(exec)
  return refusal === undefined ? next() : Promise.resolve({ kind: 'deny', reason: refusal })
```

#### 缺口

- 未核查 CLI 服务端、真实 transport 隔离或发布版本
  **影响**：无法证明 session 身份不可冒用或远程连接安全
  **进一步探讨**：在授权隔离环境核对具体 CLI 版本、服务端信任模式、跨会话调用和宿主认证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 面板从哪里读取数据，部署和维护需要什么条件？

**研究主题**：功能与机制、效果与总成本、采用判断

#### 完整回答

Client 等待 slots、sessions、locale、connection、右侧面板与主题服务，注册会话右栏并轮询 Host 的 store-backed 快照；服务端校验客户端 sessionId 与 cwd，再从服务端解析会话工作区和 harness 根读取，解析失败或不匹配返回 unavailable。源码在会话和持久记录均无 cwd 时还回退进程 cwd，因而不能简单说所有读取必然来自会话声明。包依赖较多固定系列的 DSH peer 与引擎；源码构建脚本使用 Bun、打包技能资源和引擎，实际发布包与具体宿主兼容未核。首次应在隔离配置确认根、门禁模式、角色映射、MCP 安装及身份信任；持续检查降级日志、账本匹配与角色配置。若控制未挂载、异常放行或身份不可信，停止依赖该控制并回到现有人工审查及宿主权限。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/client/index.ts:39-58](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/client/index.ts#L39-L58)

Client 所需服务及快照客户端。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Cordis service faces the plugin waits for (spec §4.4: slots + sessions +
 * locale + the wire + the tab-type registry). `sessions` is load-bearing as
 * the session standard scope's wait and `connection` carries the
 * engine-status transport; `sidebarRightTabs` is the registry `apply`
 * registers the page tab type into; `layout` is the panel-selection face the
 * panel's own surfaces drive (a cordis service, so it is declared here before
 * any selection can be reached).
 */
export const inject = ['slots', 'sessions', 'locale', 'connection', 'sidebarRightTabs', 'theme']

export function apply(ctx: ClientContext): void {
  const connection = (ctx as unknown as {
    connection?: MstarWorkflowPickerConnection & { isLoopback?: boolean }
  }).connection
  const picker = new MstarWorkflowPickerClient(connection)
  ctx.effect(() => () => picker.dispose(), 'ui-mstar-panel: workflow picker client')
  // The store-backed read: the panel polls `mstar/panelSnapshot` while its tab
  // is visible (the hook drives start/stop) — the retired emission read's
  // replacement.
```

</details>

**依据 2 · 源码核查**：[packages/dsh/src/client/index.ts:116-141](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/client/index.ts#L116-L141)

右侧面板注册与客户端传递。

<details>
<summary>查看原文（26行）</summary>

```text
  // ONE entry: the session's right-pane tab. The product is per-repository state,
  // so the host's GLOBAL panel list gets no row from this plugin — and with no
  // global row there is no keyed `main` seat to open, and no selection call.
  // The body seat closes over the two clients exactly as the old view-tab
  // registration did: the transport is a plugin-level concern, never a
  // host-supplied prop. The `store` option hands the seat the panel's
  // entry store (plan sidebar §L2.4): the framework caches one instance per
  // (entry, session), so the selected section survives the body's unmount
  // while another pane tab is active.
  const panelStore = createPanelStore()
  ctx.effect(
    () => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
      name: 'sidebar.right.pane.tab',
      key: MSTAR_PANEL_ID,
      locale: NS,
      store: panelStore,
    }, (props: Parameters<typeof PanelView>[0]) =>
      PanelView({
        ...props,
        picker,
        panelSnapshot,
        localeFace: ctx.locale,
        themeFace,
      }))),
    'ui-mstar-panel: panel body',
  )
```

</details>

**依据 3 · 源码核查**：[packages/dsh/src/panel/panel-snapshot-endpoint.ts:549-559](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/panel/panel-snapshot-endpoint.ts#L549-L559)

服务端校验身份与目录并解析根。

<details>
<summary>查看原文（11行）</summary>

```text
    const sid = nonEmptyString(sessionId)
    if (sid === undefined) return { kind: 'unavailable', reason: 'invalid-session-id' }
    const claimed = nonEmptyString(cwd)
    if (claimed === undefined) return { kind: 'unavailable', reason: 'invalid-cwd' }
    if (isRefusedPath(claimed)) return { kind: 'unavailable', reason: 'cwd-refused' }
    const session = await this.resolveSessionCwd(sid)
    if (session.kind !== 'ok') return { kind: 'unavailable', reason: session.reason }
    if (!cwdAccepted(session, claimed)) return { kind: 'unavailable', reason: 'cwd-mismatch' }
    const harnessDir = this.bootHarnessDir ?? this.resolver.forWorkspace(session.cwd)
    if (harnessDir === null || harnessDir === '') return { kind: 'no-harness' }
    return { kind: 'ok', harnessDir, sessionId: sid, cwd: session.cwd }
```

</details>

**依据 4 · 源码核查**：[packages/dsh/src/panel/panel-snapshot-endpoint.ts:638-665](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/panel/panel-snapshot-endpoint.ts#L638-L665)

缺会话 cwd 时的可用性分支与进程 cwd 回退。

<details>
<summary>查看原文（28行）</summary>

```text
  /**
   * Resolve the authoritative cwd of one session: the LIVE session first
   * (`ctx.sessions.get(id)`), then the session controller's persisted
   * `inspect(id)` fallback for a session that is not currently attached.
   */
  private async resolveSessionCwd(sessionId: string): Promise<SessionCwdResolution> {
    const sessions = this.ctx.get('sessions') as SessionsView | undefined
    const live = typeof sessions?.get === 'function' ? sessions.get(sessionId) : undefined
    const liveCwd = headerCwdOf(live)
    if (liveCwd !== undefined) return { kind: 'ok', cwd: liveCwd, source: 'live' }

    const controller = this.ctx.get('sessionController') as SessionControllerView | undefined
    if (typeof controller?.inspect !== 'function') {
      return { kind: 'unavailable', reason: live === undefined ? 'session-absent' : 'session-cwd-absent' }
    }
    let inspection: unknown
    try {
      inspection = await controller.inspect(sessionId)
    } catch {
      return { kind: 'unavailable', reason: 'session-inspect-failed' }
    }
    const persistedCwd = headerCwdOf(inspection)
    if (persistedCwd !== undefined) return { kind: 'ok', cwd: persistedCwd, source: 'persisted' }
    // Both surfaces are genuinely silent: the session declares no workspace. Read
    // the one the host was launched in rather than claiming the workspace has
    // nothing — the client's claim is still not an address (see `serve`).
    const boot = nonEmptyString(process.cwd())
    if (boot !== undefined) return { kind: 'ok', cwd: boot, source: 'boot' }
```

</details>

**依据 5 · 源码核查**：[packages/dsh/package.json:61-73](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/package.json#L61-L73)

源码构建与工具链声明。

<details>
<summary>查看原文（13行）</summary>

```text
  "scripts": {
    "pretest": "bun run build-client",
    "test": "bun test",
    "typecheck:tests": "bunx tsc --noEmit -p tests/tsconfig.json",
    "typecheck:src": "bunx tsc --noEmit -p tsconfig.json",
    "bundle-assets": "bun run scripts/bundle-harness-assets.ts",
    "build": "bun run --cwd ../commands build && bun run bundle-assets && rm -rf dist && bun build src/index.ts src/invariant.ts --target node --outdir dist --external @deepseek-ai/cordis --external @deepseek-ai/dsh-scope --external @deepseek-ai/dsh-skill-filesystem --external @deepseek-ai/dsh-tools --external @deepseek-ai/dsh-llm --external @deepseek-ai/dsh-storage-domain --external @mstar-harness/engine && bun run build-client && bunx tsc",
    "build-client": "bun run scripts/build-client-bundle.ts",
    "prepublishOnly": "bun run build"
  },
  "engines": {
    "bun": ">=1.4.0",
    "node": ">=24.18.0"
```

</details>

**依据 6 · 源码核查**：[packages/dsh/package.json:78-85](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/package.json#L78-L85)

部分 DSH peer 依赖。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.5",
    "@deepseek-ai/dsh-agent": "^0.2.1-rc.5",
    "@deepseek-ai/dsh-agent-default-model": "^0.2.1-rc.5",
    "@deepseek-ai/dsh-agent-preset": "^0.2.1-rc.5",
    "@deepseek-ai/dsh-agent-preset-registry": "^0.2.1-rc.5",
    "@deepseek-ai/dsh-api-gateway": "^0.2.1-rc.5",
    "@deepseek-ai/dsh-api-remotes": "^0.2.1-rc.5",
```

#### 缺口

- 未安装实际产物或核对全部 peer、engine 和面板后端
  **影响**：无法保证安装、根解析及持久化效果
  **进一步探讨**：在指定 DSH 版本的隔离 profile 验证真实包、根选择、面板读取、失败和卸载。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 将门禁覆盖与退化状态汇总到可验证视图是否减少错误信任？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：向操作者展示已安装的监听入口、当前生效模式、最近 degraded 原因和未覆盖的工具或写入途径，并将声明内容可用与内容盲的校验分别标示，可能减少误以为 hard 模式覆盖所有操作的情况。它必须来自同一实际注册与运行路径，不能只显示配置值；对不经宿主意图的 shell 等操作仍应标为未知。可在隔离任务中人为移除服务、重命名工具、注入引擎异常并写入目标文件，比较当前日志与候选视图中操作者识别控制缺口的准确率和处理时间；若视图显示已保护但监听未到达，或不能减少误判，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/index.ts:801-807](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/index.ts#L801-L807)

工具改名且未配置可让门禁不匹配，启动记录警告。

```text
  // Deploy-time observability: a renamed dsh subagent tool
  // (toolName) with dispatchTools unset silently disables BOTH the dispatch
  // gate and host detection — mirror the dispatchBinding warn so the absence
  // is surfaced instead of only documented.
  if (effectiveHard && config.dispatchTools === undefined) {
    ctx.logger(DISPATCH_LOGGER).warn(
      'Enforcement: hard is active but dispatchTools is unset — the dispatch gate matches the default tool names "subagent" and "subagent_fork"; a deployment renaming either dsh subagent tool (toolName) without declaring dispatchTools silently disables the gate',
```

**依据 2 · 源码核查**：[packages/dsh/src/gates/dispatch.ts:1187-1204](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/dispatch.ts#L1187-L1204)

引擎异常记 degraded 后放行。

<details>
<summary>查看原文（18行）</summary>

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
    } catch (emitError) {
      // Best-effort observability: a throwing advisory consumer must not take
      // the gate down with it (the error log above is the durable signal).
      ctx.logger(DISPATCH_LOGGER).error(`dispatch gate degraded advisory emit failed: ${(emitError as Error).message}`)
    }
  }
  return veto ?? await next()
```

</details>

**依据 3 · 源码核查**：[packages/dsh/src/gates/status.ts:426-441](https://github.com/btspoony/mstar-harness/blob/dac1c781bad900f938d7a752222b9f139dc42222/packages/dsh/src/gates/status.ts#L426-L441)

内容盲修复和异常降级边界。

<details>
<summary>查看原文（16行）</summary>

```text
        // Repair escape: the current document is already invalid; this write
        // may BE the repair, so allow it — but make the degraded control
        // loud (error-level log + repair advisory, `hard: true`).
        ctx.logger(LOGGER_NAME).error(
          `status.json ${operation} ALLOWED as repair (Enforcement: hard; the current on-disk document is already invalid — the intent carries no incoming content, so the vetoable signal is only the pre-write state):\n${verdict.violations.map(formatViolation).join('\n')}`,
        )
        ctx.emit('mstar/status-gate', { operation, target: target.displayPath, result: verdict, hard, repair: true })
      } else {
        ctx.logger(LOGGER_NAME).warn(`status.json ${operation} (advisory):\n${verdict.violations.map(formatViolation).join('\n')}`)
        ctx.emit('mstar/status-gate', { operation, target: target.displayPath, result: verdict, hard })
      }
    }
  } catch (error) {
    // The typed veto is rethrown untouched (the only throw this gate makes).
    if (error instanceof StatusVetoError) throw error
    ctx.logger(LOGGER_NAME).error(`status gate degraded to allow: ${(error as Error).message}`)
```

</details>

#### 缺口

- 覆盖视图和对照尚未实现
  **影响**：无法证明能够降低误判或操作负担
  **进一步探讨**：以固定宿主的监听注册、改名和故障注入结果对照视图输出。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
