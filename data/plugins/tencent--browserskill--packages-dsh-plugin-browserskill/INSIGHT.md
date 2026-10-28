# BrowserSkill DSH 插件

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[6469c47](https://github.com/Tencent/BrowserSkill/tree/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill)

<!-- BEGIN META -->
[![GitHub ★ 9,680](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C680&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/BrowserSkill) [![npm 30d 32,486](https://img.shields.io/static/v1?label=npm+30d&message=32%2C486&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin)
<!-- END META -->

> **功能**：将 BrowserSkill 浏览器自动化接入 DSH 模型工具和 Web 任务预览

> **亮点**：将域工具、按需技能、观察状态和启动清理统一接入DSH，并保留操作级队列与取消语义，提供超出shell拼接的管理机制。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：三层版本与技能显露都影响真正可用性，FIFO和取消不回滚网页提交，进程级工具显露也不是权限隔离。[Q03](#research-q03)

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
  - [Q01 · 已有 bsk CLI 的 DSH 用户为什么还需要原生插件？](#detail-section-11)
  - [Q02 · 六个域工具和观察如何实际调用浏览器？](#detail-section-12)
  - [Q03 · 队列、取消和可见窗口是否等于业务操作可回滚？](#detail-section-13)
  - [Q04 · 何时值得试用，并能形成什么可证伪改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向 DSH Web 用户，把 BrowserSkill 浏览器操作接为原生工具，并呈现可接管的任务进度。

直接shell调用bsk已能执行浏览器工作；本包增量为模型接口、原生呈现与资源管理，不重新实现浏览器引擎。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 六域浏览器工具 | 按action调用浏览器 | CLI和扩展就绪，依操作校验参数 |
| browser-skill | 按需显露工具与指导 | 默认需要技能服务 |
| Web观察 | 预览、停止和接管入口 | webServer与客户端依赖 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| bsk CLI与浏览器扩展 | 必需 | 真正执行浏览器命令 | 包加载仍可能首次调用失败 |
| DSH peer与tools | 必需 | 注册与事件语义 | 需匹配版本 |
| skills服务 | 默认延迟工具必需 | 初始能力发现 | 缺少时检查lazyTools=false |
| webServer及客户端UI | 预览必需 | SSE与缩略图 | headless保留工具但无同样界面 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装CLI、扩展和插件 | 连接可用而非仅版本探针成功 |
| 显露 | 模型/用户加载browser-skill | 六域工具进入目录 |
| 操作 | 模型观察后执行，人工接管 | 测试页面结果可核对 |
| 结束 | 归档或卸载触发清理 | 会话及借用页状态明确 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI/浏览器/宿主资源未知 | 三层安装与策略配置未知 | 不含实际兼容验收 |
| 持续使用 | 模型、截图和浏览器资源未知 | 页面适配及结果复核未知 | 队列不等于业务事务 |
| 失败恢复 | 重试及残留会话资源未知 | 核对日志和已发生动作 | 不盲目重复提交 |
| 退出 | 清理状态资源未知 | 归还借用页并确认停止 | 崩溃恢复未执行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原生接入 | 域工具真实路由与注册回滚 | token及动作错误净变化 |
| 任务可见 | SSE快照与观察通道 | 当前Web视觉和接管体验 |
| 执行管理 | FIFO、取消和启动日志 | 异常下端到端收敛 |

> **思考**：三层版本与技能显露都影响真正可用性，FIFO和取消不回滚网页提交，进程级工具显露也不是权限隔离。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将域工具、按需技能、观察状态和启动清理统一接入DSH，并保留操作级队列与取消语义，提供超出shell拼接的管理机制。[Q01](#research-q01) [Q02](#research-q02)

FIFO即使取消仍等待前驱、先拥有资源再注册、将结构化输出和观察分开，值得资源型插件借鉴；移植需外部执行端确实支持取消收敛。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

三层版本与技能显露都影响真正可用性，FIFO和取消不回滚网页提交，进程级工具显露也不是权限隔离。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

已用DSH Web者先做只读任务和可重置表单，验收技能显露、预览与停止清理；无法识别副作用或重复动作时暂停并回CLI或人工。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

工具、runner、观察及清理接线有固定源码支持；真实界面、业务效果和异常收敛未验收，接口收益为假设。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin-browserskill/package.json、packages/dsh-plugin-browserskill/src/index.ts、packages/dsh-plugin-browserskill/src/browser-tools.ts、packages/dsh-plugin-browserskill/src/runner.ts、packages/dsh-plugin-browserskill/src/observation-http.ts、packages/dsh-plugin-browserskill/src/lazy-tools.ts、packages/dsh-plugin-browserskill/src/queue.ts 及固定范围 inventory；组件：packages/dsh-plugin-browserskill。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅原生DSH子包，核查index、域工具映射、延迟注册、runner、队列、观察HTTP和package；根CLI/扩展独立研究。
- 下一步：未安装或运行目标代码，未执行测试和宿主验收；真实Web呈现、取消后业务状态与总成本仍需同版本记录。

**分析版本**

- **仓库**：[Tencent/BrowserSkill](https://github.com/Tencent/BrowserSkill)
- **版本号**：0.3.3（[固定提交 6469c47](https://github.com/Tencent/BrowserSkill/tree/6469c474423abbac1b6f70a5e2af6daaf9b1e0af)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是域工具与按需技能减少初始上下文而不损害选择正确性。以同模型同任务比较全量操作schema和六域接口，记录首轮token、非法action、合格率与接管次数；错误抵消收益即推翻。[Q04](#research-q04)

未安装或运行目标代码，未执行测试和宿主验收；真实Web呈现、取消后业务状态与总成本仍需同版本记录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 1043 | — | — | 9041 |
| .mjs | source | 3 | 172 | 142 | 24 | — |
| .ts | source | 33 | 8730 | 7531 | 833 | — |
| .tsx | source | 4 | 1503 | 1335 | 82 | — |
| .ts | test | 21 | 9067 | 8388 | 274 | — |
| .tsx | test | 5 | 1616 | 1477 | 41 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/Tencent/BrowserSkill/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 bsk CLI 的 DSH 用户为什么还需要原生插件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有 bsk CLI 的 DSH 用户为什么还需要原生插件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户是在 DSH 对话中处理网页资料、测试表单或调试请求，希望模型工具和 Web 界面同步呈现任务的人。原办法是 shell 执行 bsk，底层同样可以操作浏览器；合格交付应是指定会话的页面结果、人工可接管的进度和可解释清理状态。插件增加六个域工具、按需技能、观察通道和会话资源生命周期，浏览器执行、登录态和扩展属于根产品，不算适配层贡献。只需要一次脚本或已经能正确用 CLI 的 headless 用户，原生预览增量可能不足以抵偿宿主耦合。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-browserskill/package.json:1-4](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/package.json#L1-L4)

作者定位原生模型工具插件。

```text
{
  "name": "@wxg-prc-cpg/browser-skill-dsh-plugin",
  "description": "DeepSeek Harness tool plugin that exposes BrowserSkill browser automation (bsk_* tools) to the model",
  "version": "0.3.3",
```

**依据 2 · 源码核查**：[packages/dsh-plugin-browserskill/src/index.ts:88-110](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/index.ts#L88-L110)

创建runner、会话注册、队列、观察与启动日志。

<details>
<summary>查看原文（23行）</summary>

```text
  const runner = options.runnerFactory?.(resolved.bskPath) ?? createBskRunner(resolved.bskPath);
  const registry = new SessionRegistry(resolved.maxSessions);
  const queue = new KeyedExecutor();
  const observation = new ObservationService({
    ctx,
    runner,
    registry,
    queue,
    options: {
      enabled: resolved.observationEnabled,
      thumbnailIntervalMs: resolved.thumbnailIntervalMs,
      idleIntervalMs: resolved.idleIntervalMs,
    },
  });

  const deps: ToolDeps = { ctx, runner, registry, config: resolved, observation, queue };
  const journal =
    options.startJournal ??
    new DiskStartJournal(
      resolved.sessionStateDirectory ?? defaultStartJournalDirectory(resolved.bskPath),
    );
  if (journal instanceof DiskStartJournal) journal.recover();
  const starts = (deps.starts = new SessionStarts(deps, journal));
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-browserskill/src/index.ts:131-153](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/index.ts#L131-L153)

按需技能、工具与Web观察挂载。

<details>
<summary>查看原文（23行）</summary>

```text
  // Progressive disclosure of the BSK agent skill (catalog entry resident,
  // body on demand) through the official skill seam; silent no-op when the
  // composition lacks it. With lazyTools on, the skill entry is initially the
  // ONLY model-visible advertisement — the tool suite reveals itself on a
  // successful skill invocation (or a session whose history already has one).
  disposers.push(registerBskSkill(ctx));
  // A same-name CLI skill left in ~/.agents is discovered in the nearer preset
  // layer and shadows the global registration above. Re-register through every
  // exact agent context at startup so DSH always loads the bsk_* protocol
  // instructions; the shared CLI skill remains untouched for other agents.
  disposers.push(armAgentScopedBskSkill(ctx));
  const registerSuite = () => registerBrowserTools(deps);
  disposers.push(resolved.lazyTools ? armLazyTools(ctx, registerSuite) : registerSuite());
  // Route registration rides ctx.inject: the webServer service may be provided
  // AFTER this plugin loads, and in headless compositions it never appears (the
  // callback simply never runs, leaving the rest of the plugin unaffected).
  ctx.inject(["webServer"], (injected) => {
    return registerObservationRoutes(injected, observation, starts);
  });
  // Reap a conversation's browsers when the conversation itself is archived:
  // archived sessions are hidden from every surface, so their Agent Windows
  // would otherwise linger unreachable until idle timeout or unload.
  disposers.push(armArchiveCleanup(ctx, starts));
```

</details>

#### 缺口

- 没有同任务shell与原生工具的选择错误、人工接管和总时间对照
  **影响**：无法证明原生界面提高合格率
  **进一步探讨**：在相同模型和测试站点比较工具选择、任务正确率及接管次数。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 六个域工具和观察如何实际调用浏览器？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 创建 bsk runner、SessionRegistry、KeyedExecutor、ObservationService 和磁盘启动日志，先登记资源清理再执行注册，加载失败也能进入清理。browser-tools 用 action 映射私有操作，非法 action 直接报错，contextId 与 dependsOn 随参数传入；注册前核查缺失与不可达操作，逐项注册失败会撤销本次已注册项，但注释明确这不是原子发布。runner 用参数数组 spawn bsk 并附 --json，不把参数拼成 shell 命令。Web 观察路由在 webServer 出现后注册，SSE 用快照重新同步，headless 不依赖该服务。默认 lazyTools 在技能成功调用或历史恢复后才注册工具；注册是进程生命周期级显露，不是每个 Agent 独立权限边界。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-browserskill/src/index.ts:103-148](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/index.ts#L103-L148)

启动日志与先清理后注册顺序。

<details>
<summary>查看原文（46行）</summary>

```text
  const deps: ToolDeps = { ctx, runner, registry, config: resolved, observation, queue };
  const journal =
    options.startJournal ??
    new DiskStartJournal(
      resolved.sessionStateDirectory ?? defaultStartJournalDirectory(resolved.bskPath),
    );
  if (journal instanceof DiskStartJournal) journal.recover();
  const starts = (deps.starts = new SessionStarts(deps, journal));
  const disposers: (() => void)[] = [];
  // Own resources before eager registration can throw. Cordis unwinds this
  // effect on a failed apply as well as unload; owned starts still get stopped.
  ctx.effect(() => {
    let cleanup: Promise<void> | undefined;
    return () =>
      (cleanup ??= (async () => {
        try {
          disposeAll(disposers);
        } finally {
          try {
            await starts.dispose();
          } finally {
            observation.dispose();
          }
        }
      })());
  });
  void starts.reconcile().catch((error) => console.warn("Browser start recovery failed", error));

  // Progressive disclosure of the BSK agent skill (catalog entry resident,
  // body on demand) through the official skill seam; silent no-op when the
  // composition lacks it. With lazyTools on, the skill entry is initially the
  // ONLY model-visible advertisement — the tool suite reveals itself on a
  // successful skill invocation (or a session whose history already has one).
  disposers.push(registerBskSkill(ctx));
  // A same-name CLI skill left in ~/.agents is discovered in the nearer preset
  // layer and shadows the global registration above. Re-register through every
  // exact agent context at startup so DSH always loads the bsk_* protocol
  // instructions; the shared CLI skill remains untouched for other agents.
  disposers.push(armAgentScopedBskSkill(ctx));
  const registerSuite = () => registerBrowserTools(deps);
  disposers.push(resolved.lazyTools ? armLazyTools(ctx, registerSuite) : registerSuite());
  // Route registration rides ctx.inject: the webServer service may be provided
  // AFTER this plugin loads, and in headless compositions it never appears (the
  // callback simply never runs, leaving the rest of the plugin unaffected).
  ctx.inject(["webServer"], (injected) => {
    return registerObservationRoutes(injected, observation, starts);
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-browserskill/src/browser-tools.ts:59-102](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/browser-tools.ts#L59-L102)

action解析、contextId和依赖区域。

<details>
<summary>查看原文（44行）</summary>

```text
function operationArgs(args: unknown): Record<string, unknown> {
  const { action: _action, ...rest } = args as Record<string, unknown>;
  return rest;
}

function definitionFor(
  definitions: ReadonlyMap<string, ToolDefinition>,
  actions: Record<string, string>,
  action: unknown,
): ToolDefinition {
  const operationName = typeof action === "string" ? actions[action] : undefined;
  const definition = operationName === undefined ? undefined : definitions.get(operationName);
  if (definition === undefined) throw new Error(`unsupported browser action: ${String(action)}`);
  return definition;
}

function defineBrowserTool(
  spec: BrowserToolSpec,
  definitions: ReadonlyMap<string, ToolDefinition>,
): ToolDefinition {
  const actionNames = Object.keys(spec.actions);
  return defineTool({
    name: spec.name,
    description: spec.description,
    parameters: {
      action: {
        type: "string",
        required: true,
        enum: actionNames,
        description:
          "Operation to perform. Other arguments are action-dependent and are validated by that operation.",
      },
      ...spec.parameters,
      dependsOn: {
        type: "array",
        items: { type: "string" },
        description:
          "Observed refs/selectors covering all regions used for this decision. Omit to validate the whole page. The action target's region and form values are always checked.",
      },
      contextId: {
        type: "string",
        description:
          "Shared-tab actions require the context_id you actually received from bsk_session sync. One context authorizes one action; never substitute a newer context into an old plan.",
      },
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-browserskill/src/browser-tools.ts:450-496](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/browser-tools.ts#L450-L496)

操作闭包检查及注册回滚。

<details>
<summary>查看原文（47行）</summary>

```text
function indexOperations(definitions: ToolDefinition[]): ReadonlyMap<string, ToolDefinition> {
  const indexed = new Map<string, ToolDefinition>();
  for (const definition of definitions) {
    if (indexed.has(definition.name)) {
      throw new Error(`duplicate browser operation definition: ${definition.name}`);
    }
    indexed.set(definition.name, definition);
  }

  const routed = new Set(BROWSER_TOOL_SPECS.flatMap((spec) => Object.values(spec.actions)));
  const missing = [...routed].filter((name) => !indexed.has(name));
  const unreachable = [...indexed.keys()].filter((name) => !routed.has(name));
  if (missing.length > 0 || unreachable.length > 0) {
    throw new Error(
      [
        missing.length > 0 ? `missing operations: ${missing.join(", ")}` : undefined,
        unreachable.length > 0 ? `unreachable operations: ${unreachable.join(", ")}` : undefined,
      ]
        .filter(Boolean)
        .join("; "),
    );
  }
  return indexed;
}

/** Register all six tools or roll back this attempt; never remove foreign entries. */
export function registerBrowserTools(deps: ToolDeps): () => void {
  const operations = indexOperations(createBrowserOperationDefinitions(deps));
  // Validate every definition before publishing any schema. The host emits
  // changes per registration; this is rollback, not an atomic registry update.
  const definitions = BROWSER_TOOL_SPECS.map((spec) => defineBrowserTool(spec, operations));
  const disposers: (() => void)[] = [];
  for (const definition of definitions) {
    try {
      disposers.push(deps.ctx.tools.register(definition));
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : String(cause);
      const failure = new Error(`Failed to register ${definition.name}: ${detail}`, { cause });
      try {
        disposeAll(disposers);
      } catch (cleanupError) {
        throw new AggregateError([failure, cleanupError], failure.message, { cause });
      }
      throw failure;
    }
  }
  return () => disposeAll(disposers);
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-browserskill/src/runner.ts:143-155](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/runner.ts#L143-L155)

参数数组spawn。

<details>
<summary>查看原文（13行）</summary>

```text
      return new Promise<BskRunResult>((resolve, reject) => {
        let child: ChildProcess;
        try {
          child = spawnImpl(
            bskPath,
            [...args, "--json"],
            windows
              ? {
                  windowsHide: true,
                  env: { ...process.env, BSK_CANCEL_ON_STDIN_CLOSE: "1" },
                }
              : undefined,
          );
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-browserskill/src/observation-http.ts:8-22](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/observation-http.ts#L8-L22)

SSE快照同步及headless边界。

<details>
<summary>查看原文（15行）</summary>

```text
 *   GET  /bsk-observation/state      → one-time { sessions, available } read
 *   GET  /bsk-observation/events     → SSE snapshot, then ObservationEvent increments
 *                                    (on every connection, including reconnects)
 *                                    ?thumbnails=0: state only; =1: request screenshots
 *                                    Omitted parameter defaults to screenshots.
 *   POST /bsk-observation/interrupt  → body {sessionId?} → {interrupted: boolean}
 *   POST /bsk-observation/stop       → body {sessionId} → {stopped: boolean}
 *   GET  /bsk-observation/thumbnail/<attachmentId> → image bytes
 *
 * Live clients initialize/resynchronize from the SSE snapshot; a separate
 * /state read has no ordering guarantee relative to the stream and does not
 * request screenshots. Closing an SSE connection releases its screenshot demand.
 *
 * Routes exist only when a webServer service is mounted (web composition);
 * headless deployments skip registration entirely.
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-browserskill/src/lazy-tools.ts:1-23](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/lazy-tools.ts#L1-L23)

默认延迟注册与进程生命周期显露。

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * Lazy tool-schema injection ("progressive disclosure", final stage): with
 * `lazyTools` on (the default), the six browser tool schemas stay OUT of the
 * system prompt until the `browser-skill` skill has actually been invoked —
 * the skill catalog entry is the only advertisement. A successful model
 * invocation or a claimed user `/browser-skill` gesture reveals
 * the whole suite for the rest of the process lifetime; repeated invocations
 * are idempotent no-ops. Session resume is covered by scanning durable
 * session events for a past successful invocation (tool/call + tool/result
 * pair, or a skill-invocation sourced message) when a session is entered or
 * first observed after a reload. Later events are consumed incrementally.
 *
 * Host lifecycle boundaries:
 * - `tools/post-execute` can turn a successful skill load into an actionable
 *   error before its result reaches the model. `tools/result` is too late.
 * - There is NO official global tool-visibility switch (`ctx.tools.restrict`
 *   is agent-scoped and throws from a plain host context), so conditional
 *   registration + this hook is the intended pattern; the registry supports
 *   mid-flight register/dispose with an unfiltered `tools/change` notice, and
 *   tool-skill's per-step catalog digest treats visibility changes as a
 *   first-class cache-invalidation input. Model tool calls reveal the suite
 *   for the next step; user gestures must reveal it at agent/inbox/claimed,
 *   before assembly, so instructions and schemas reach the same request.
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 队列、取消和可见窗口是否等于业务操作可回滚？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不等于。同会话 FIFO 把模型命令与观察采集排队；即使排队项提前取消，尾链仍同时等待前驱和该项，避免后续穿越运行中任务。运行中的取消交给 runner，Unix 先SIGINT后强杀，Windows 用stdin关闭请求CLI取消并留收敛宽限；这约束进程与浏览器命令，不会撤回已发生的网页提交。共享标签页 contextId 要求使用实际观察到的上下文，每次行动一个，但它只保护观察新鲜性，不能代替用户对业务动作授权。默认延迟工具在缺少技能服务时可能没有初始发现入口，需要显式配置lazyTools=false或使用完整组合。观察路由复制loopback/Origin/JSON检查限制浏览器信任边界，仍不是多用户账号隔离证明。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-browserskill/src/queue.ts:14-54](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/queue.ts#L14-L54)

FIFO尾链兼顾前驱与取消任务。

<details>
<summary>查看原文（41行）</summary>

```text
  run<T>(key: string, fn: () => Promise<T>, signal?: AbortSignal): Promise<T> {
    const previous = this.tails.get(key) ?? Promise.resolve();
    const task = new Promise<T>((resolve, reject) => {
      let settled = false;
      const onAbort = () => {
        if (!settled) {
          settled = true;
          reject(abortError());
        }
      };
      signal?.addEventListener("abort", onAbort, { once: true });
      void previous.then(() => {
        if (settled) return;
        if (signal?.aborted) {
          settled = true;
          reject(abortError());
          return;
        }
        // Running now: cancellation flows through the task's own signal.
        signal?.removeEventListener("abort", onAbort);
        fn().then(
          (value) => {
            settled = true;
            resolve(value);
          },
          (error: unknown) => {
            settled = true;
            reject(error);
          },
        );
      });
    });
    // The stored tail never rejects, so one failure never strands the queue;
    // and it chains BOTH the previous tail and this task, so a task aborted
    // while still queued cannot let a later task overlap the one before it.
    const tail = Promise.allSettled([previous, task]).then(() => {});
    this.tails.set(key, tail);
    // Drop the entry once the queue drains, so the map tracks live keys only.
    void tail.then(() => {
      if (this.tails.get(key) === tail) this.tails.delete(key);
    });
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-browserskill/src/runner.ts:119-129](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/runner.ts#L119-L129)

分平台取消与强杀。

<details>
<summary>查看原文（11行）</summary>

```text
  function killChild(child: ChildProcess): void {
    if (child.exitCode !== null || child.signalCode !== null || cancelling.has(child)) return;
    const force = setTimeout(() => {
      if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    }, killGraceMs);
    force.unref();
    cancelling.set(child, force);
    // Node kills Windows children outright for SIGINT. EOF asks the CLI to
    // send its existing cancel RPC and wait for browser reconciliation.
    if (windows && child.stdin) child.stdin.end();
    else child.kill("SIGINT");
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-browserskill/src/index.ts:131-143](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/index.ts#L131-L143)

技能服务缺席时无操作与延迟工具配置。

<details>
<summary>查看原文（13行）</summary>

```text
  // Progressive disclosure of the BSK agent skill (catalog entry resident,
  // body on demand) through the official skill seam; silent no-op when the
  // composition lacks it. With lazyTools on, the skill entry is initially the
  // ONLY model-visible advertisement — the tool suite reveals itself on a
  // successful skill invocation (or a session whose history already has one).
  disposers.push(registerBskSkill(ctx));
  // A same-name CLI skill left in ~/.agents is discovered in the nearer preset
  // layer and shadows the global registration above. Re-register through every
  // exact agent context at startup so DSH always loads the bsk_* protocol
  // instructions; the shared CLI skill remains untouched for other agents.
  disposers.push(armAgentScopedBskSkill(ctx));
  const registerSuite = () => registerBrowserTools(deps);
  disposers.push(resolved.lazyTools ? armLazyTools(ctx, registerSuite) : registerSuite());
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-browserskill/src/browser-tools.ts:92-102](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/browser-tools.ts#L92-L102)

上下文和依赖区域约束。

<details>
<summary>查看原文（11行）</summary>

```text
      dependsOn: {
        type: "array",
        items: { type: "string" },
        description:
          "Observed refs/selectors covering all regions used for this decision. Omit to validate the whole page. The action target's region and form values are always checked.",
      },
      contextId: {
        type: "string",
        description:
          "Shared-tab actions require the context_id you actually received from bsk_session sync. One context authorizes one action; never substitute a newer context into an old plan.",
      },
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-browserskill/src/observation-http.ts:47-83](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/observation-http.ts#L47-L83)

观察通道的浏览器信任检查。

<details>
<summary>查看原文（37行）</summary>

```text
/**
 * Browser-trust fence, mirroring the one dsh applies to its /api routes (ours
 * live outside that prefix, so the checks are replicated here):
 * - Host must be a loopback authority (localhost / 127.0.0.0/8 / [::1]) — the
 *   observation channel exposes live screenshots and must never answer a LAN
 *   or DNS-rebound name;
 * - a present Origin must be same-host with the Host header (blocks cross-site
 *   reads), and `sec-fetch-site: cross-site` is refused outright;
 * - POST must be `application/json` — anything a cross-site *simple request*
 *   can send (form/plain) never reaches the handler, which kills CSRF.
 */
function fenceViolation(req: IncomingMessage): string | undefined {
  const host = req.headers.host ?? "";
  const hostname = /^\[.*\](?::\d+)?$/.test(host)
    ? host.slice(1, host.indexOf("]"))
    : host.split(":")[0];
  const isLoopback =
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "::1" ||
    /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);
  if (!isLoopback) return "host is not a loopback authority";
  const origin = req.headers.origin;
  if (origin !== undefined && origin !== "null") {
    let originHost: string | undefined;
    try {
      originHost = new URL(origin).host;
    } catch {
      return "unparseable Origin header";
    }
    if (originHost !== host) return "Origin does not match Host";
  }
  if (req.headers["sec-fetch-site"] === "cross-site") return "sec-fetch-site: cross-site";
  if (req.method === "POST") {
    const contentType = req.headers["content-type"] ?? "";
    if (!/^\s*application\/json\s*(;|$)/.test(contentType)) {
      return "POST requires an application/json body";
```

</details>

#### 缺口

- 未执行取消后网页副作用、崩溃清理与当前宿主组合验收
  **影响**：不能承诺所有会话自动收敛或业务回滚
  **进一步探讨**：用可重置测试表单执行提交、取消、重启、归档，核对实际业务与资源状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得试用，并能形成什么可证伪改进？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

需外部 bsk CLI、已连接浏览器扩展、受支持浏览器与匹配 DSH peer；装插件不等于CLI已在PATH或扩展已连接。默认观察增加截图和SSE资源，首次需安装三层，持续需复核页面与维护版本，失败需核对启动日志、借用页和已发生业务动作，金额与工时均未知。适合已用 DSH Web 的用户先做只读或可重置表单，验收技能显露、预览、人工接管和归档清理；出现动作重复、无法停止或清理不明时回到CLI/人工操作。未验证假设是六域工具加按需技能可比全量操作schema减少首轮上下文而不增加action错误。固定同模型同任务对照两种接口，计首轮token、非法action、合格率与接管次数；若action错误抵消上下文收益则否定，而不是只按schema数量证明优势。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-browserskill/package.json:68-75](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/package.json#L68-L75)

宿主peer约束。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-attachment": "^0.1.5-rc.3 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.1.5-rc.3 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-tool": "^0.1.5-rc.3 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "^0.1.5-rc.3 || ^0.2.0-rc.1",
    "@deepseek-ai/dsh-tools": "^0.1.5-rc.3 || ^0.2.0-rc.1",
    "@deepseek-ai/schemastery": "^3.18.2",
```

**依据 2 · 源码核查**：[packages/dsh-plugin-browserskill/src/index.ts:155-165](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/index.ts#L155-L165)

CLI探针只警告，不证明浏览器已连接。

<details>
<summary>查看原文（11行）</summary>

```text
  // Non-blocking install probe: warn early when bsk is missing instead of
  // failing the first tool call with a bare spawn error. Uses --version on
  // purpose — it answers without starting the daemon (`bsk status` would
  // ensure-spawn one, an expensive side effect for a probe).
  runner.run(["--version"], { timeoutMs: 10_000 }).then(
    () => {},
    (error: unknown) => {
      const detail = error instanceof Error ? error.message : String(error);
      console.warn(
        `[${name}] bsk probe failed (${detail}); browser tools will report install guidance until the bsk CLI is available`,
      );
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-browserskill/src/lazy-tools.ts:1-23](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/lazy-tools.ts#L1-L23)

按需显露为接口实验基础。

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * Lazy tool-schema injection ("progressive disclosure", final stage): with
 * `lazyTools` on (the default), the six browser tool schemas stay OUT of the
 * system prompt until the `browser-skill` skill has actually been invoked —
 * the skill catalog entry is the only advertisement. A successful model
 * invocation or a claimed user `/browser-skill` gesture reveals
 * the whole suite for the rest of the process lifetime; repeated invocations
 * are idempotent no-ops. Session resume is covered by scanning durable
 * session events for a past successful invocation (tool/call + tool/result
 * pair, or a skill-invocation sourced message) when a session is entered or
 * first observed after a reload. Later events are consumed incrementally.
 *
 * Host lifecycle boundaries:
 * - `tools/post-execute` can turn a successful skill load into an actionable
 *   error before its result reaches the model. `tools/result` is too late.
 * - There is NO official global tool-visibility switch (`ctx.tools.restrict`
 *   is agent-scoped and throws from a plain host context), so conditional
 *   registration + this hook is the intended pattern; the registry supports
 *   mid-flight register/dispose with an unfiltered `tools/change` notice, and
 *   tool-skill's per-step catalog digest treats visibility changes as a
 *   first-class cache-invalidation input. Model tool calls reveal the suite
 *   for the next step; user gestures must reveal it at agent/inbox/claimed,
 *   before assembly, so instructions and schemas reach the same request.
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-browserskill/src/browser-tools.ts:64-89](https://github.com/Tencent/BrowserSkill/blob/6469c474423abbac1b6f70a5e2af6daaf9b1e0af/packages/dsh-plugin-browserskill/src/browser-tools.ts#L64-L89)

域工具action对模型提出额外选择。

<details>
<summary>查看原文（26行）</summary>

```text
function definitionFor(
  definitions: ReadonlyMap<string, ToolDefinition>,
  actions: Record<string, string>,
  action: unknown,
): ToolDefinition {
  const operationName = typeof action === "string" ? actions[action] : undefined;
  const definition = operationName === undefined ? undefined : definitions.get(operationName);
  if (definition === undefined) throw new Error(`unsupported browser action: ${String(action)}`);
  return definition;
}

function defineBrowserTool(
  spec: BrowserToolSpec,
  definitions: ReadonlyMap<string, ToolDefinition>,
): ToolDefinition {
  const actionNames = Object.keys(spec.actions);
  return defineTool({
    name: spec.name,
    description: spec.description,
    parameters: {
      action: {
        type: "string",
        required: true,
        enum: actionNames,
        description:
          "Operation to perform. Other arguments are action-dependent and are validated by that operation.",
```

</details>

#### 缺口

- 缺乏真实宿主预览、全周期成本与接口对照数据
  **影响**：只能有条件试用，不能把schema压缩算作效果
  **进一步探讨**：先完成测试站点的正确性和退出验收，再测两种接口的净负担。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
