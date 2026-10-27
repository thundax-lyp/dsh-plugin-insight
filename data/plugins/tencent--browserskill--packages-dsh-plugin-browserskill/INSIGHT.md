# BrowserSkill DSH 插件

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[b63f551](https://github.com/Tencent/BrowserSkill/tree/b63f551209caba4d7debfc12215b2b7c118bad49/packages/dsh-plugin-browserskill)

<!-- BEGIN META -->
[![GitHub ★ 9,474](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C474&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/BrowserSkill) [![npm 30d 27,866](https://img.shields.io/static/v1?label=npm+30d&message=27%2C866&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/browser-skill-dsh-plugin)
<!-- END META -->

> **实现功能**：为 DeepSeek Harness 提供 BrowserSkill 浏览器工具、任务预览与截图展示。

> **核心亮点**：六个域工具保留私有操作的取消、并发与呈现语义，配合技能按需显露和会话清理，使 DSH 原生接入比 shell 拼接更可管理；浏览器执行属于根产品。[Q02](#research-q02) [Q03](#research-q03)

> **风险与缺陷**：CLI、扩展与插件需要协同升级；共享标签页的上下文协议不能代替用户对网页业务操作的授权，也不提供业务回滚。[Q03](#research-q03)

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)
- [4 研究问题与完整回答](#detail-section-9)
  - [Q01 · DSH 用户为什么需要独立适配层，而非直接运行 bsk？](#detail-section-10)
  - [Q02 · 六工具如何分发并维护会话、取消和 UI？](#detail-section-11)
  - [Q03 · 压缩工具数量是否保留控制边界，最重要限制是什么？](#detail-section-12)
  - [Q04 · 怎样在可控任务试用，预算和收益如何判断？](#detail-section-13)
  - [Q05 · 会话队列设计有什么价值，能推导怎样的工具设计实验？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户在 DSH 对话中处理网页资料、表单或调试任务，希望模型能调用浏览器且人在 Web UI 看到任务进展。

用户在 DSH 对话中处理网页资料、表单或调试任务，希望模型能调用浏览器且人在 Web UI 看到任务进展。直接 shell 调用 bsk 已可完成浏览器操作，适配层的交付物是模型可见工具、技能指导和前端呈现。该包不重新实现浏览器执行引擎，实际浏览器登录、扩展和 CLI 仍由根 BrowserSkill 产品承担。包清单发布的是 lib、skill 和 cordis.patch.yml，根 package.json 为私有工作区，二者不能视为同一个 npm 发布单元。

替代基线是在 DSH shell 中直接调用 bsk --json；本层增加工具协议、技能显露及前端预览，底层操作能力并未新造。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| bsk_session | 启动、列出、停止和同步插件拥有的浏览器会话 | 共享页动作需观察得到的 contextId，一次上下文对应一次行动 |
| bsk_page | 导航、前进后退、重载和等待条件 | 需有效会话，页面等待有超时 |
| bsk_inspect | 观察、截图、HTML、网络/控制台、提取和录制 | extract 仅已加载内容；debug replay 可产生真实请求副作用 |
| bsk_interact | 点击、输入、按键、脚本和文件传输 | 目标与参数按 action 校验，已提交动作不因取消回滚 |
| bsk_tabs | 创建选择标签页、借用与归还用户页 | 使用已发现 tabId，任务结束及时归还 |
| bsk_assist | 调整窗口/设备并请求人类帮助 | 登录验证需人工，completionCriteria 是等待条件而非授权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| bsk CLI 与连接的浏览器扩展 | 必需 | 实际浏览器执行 | 工具探测告警或运行失败 |
| DSH tools 与兼容 peer | 必需 | 工具注册与宿主协议 | 加载或协议兼容未知 |
| skills 服务 | 默认 lazyTools 路径需要 | 技能调用后揭示工具 | 无可用调用入口时需核对 eager 配置 |
| Web UI / webServer | 预览需要 | 观察路由和截图呈现 | headless 可保留工具，不能推断有 UI |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户先更新 bsk CLI 与扩展并检查连接 | 0.3.3 无旧工具别名，先迁移策略 |
| 加载 | 用户 dsh plugin --profile web add @wxg-prc-cpg/browser-skill-dsh-plugin | 确保 DSH 进程 PATH 有 bsk 或配置 bskPath |
| 揭示 | 用户在对话调用 /browser-skill | 默认 lazyTools 后出现 bsk_*；未出现检查技能服务 |
| 任务 | 模型启动会话、观察后交互，Web UI 呈现预览 | 共享页每步先 sync；错误先复核页面状态 |
| 结束 | 模型 stop 会话，用户检查归还与窗口状态 | 归档/卸载触发清理；清理失败需继续核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI、浏览器和宿主资源；金额未知 | 安装三层并迁移 bsk_* 策略；耗时未知 | 0.3.3 需先更新 CLI 与扩展 |
| 持续使用 | 模型回合、浏览器与缩略图采集；金额未知 | 核对预览和网页结果；频率未知 | 队列控制同会话操作，不是业务事务 |
| 失败恢复 | 重试命令和会话清理资源；金额未知 | 检查启动日志、归档清理和已发生动作；耗时未知 | 取消有分平台宽限，已提交网页动作不可回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型接口 | 六工具将 action 分发到保留原控制规则的私有操作 | 相比多个独立 schema 的 token 与选择错误率未测 |
| 任务可见性 | ObservationService 与 WebServer 注入可形成预览路径 | 真实 DSH Web 视觉呈现未验收 |
| 退出管理 | 启动日志、会话 FIFO 和卸载清理存在实现 | 异常杀进程后是否全部收敛未执行验证 |

> **思考**：CLI、扩展与插件需要协同升级；共享标签页的上下文协议不能代替用户对网页业务操作的授权，也不提供业务回滚。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：六个域工具保留私有操作的取消、并发与呈现语义，配合技能按需显露和会话清理，使 DSH 原生接入比 shell 拼接更可管理；浏览器执行属于根产品。[Q02](#research-q02) [Q03](#research-q03)

KeyedExecutor 将同会话操作和观察采集排成 FIFO，失败尾链不拒绝，已排队任务取消时仍等待前驱收敛，避免后续任务穿越运行中的任务。资源所有权在注册前建立，加载失败也可进入清理，适合可产生外部资源的插件借鉴；移植时需为外部后端提供真实取消与收敛语义。

<a id="detail-section-5"></a>

### 1.4 使用建议

已用 DSH Web 的用户可从只读网页或测试表单试用，先核对 CLI 和扩展版本、技能显露、任务预览及结束清理，再扩展到实际工作流。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 已检查源码，固定提交 [b63f5512](https://github.com/Tencent/BrowserSkill/tree/b63f551209caba4d7debfc12215b2b7c118bad49)；研究范围为packages/dsh-plugin-browserskill的入口和本文列出的关键机制。
- 未安装、未运行目标代码或测试，未完成真实宿主与模型任务验收。
- 固定提交的源码级研究，覆盖上述核心入口与机制；不是全项目所有功能的穷尽核查。
- 根项目工程统计按工具现有规则记录 JS/TS 与 Markdown，Go/Rust 后端语义来自列出的人工源码核查，不把这些统计当作全语言 LOC。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

未验证假设是域工具加按需技能能减少上下文而不损害任务成功率，以非法 action、token 和接管次数对照检验。[Q05](#research-q05)

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 993 | — | — | 8546 |
| .mjs | source | 3 | 172 | 142 | 24 | — |
| .ts | source | 33 | 8615 | 7417 | 833 | — |
| .tsx | source | 4 | 1467 | 1315 | 68 | — |
| .ts | test | 21 | 8996 | 8321 | 273 | — |
| .tsx | test | 5 | 1551 | 1417 | 39 | — |

</details>

**活跃度**

[![Issue 未关闭 50](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=50&color=737b86&logo=github)](https://github.com/Tencent/BrowserSkill/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-24。

<a id="detail-section-9"></a>

## 4 研究问题与完整回答

**插件研究总目标**：BrowserSkill DSH 插件 如何在明确边界内形成可采用能力，且贡献与依赖如何区分？

<a id="research-q01"></a>

<a id="detail-section-10"></a>

### Q01 · DSH 用户为什么需要独立适配层，而非直接运行 bsk？

**研究主题**：场景与需求

#### 完整回答

用户在 DSH 对话中处理网页资料、表单或调试任务，希望模型能调用浏览器且人在 Web UI 看到任务进展。直接 shell 调用 bsk 已可完成浏览器操作，适配层的交付物是模型可见工具、技能指导和前端呈现。该包不重新实现浏览器执行引擎，实际浏览器登录、扩展和 CLI 仍由根 BrowserSkill 产品承担。包清单发布的是 lib、skill 和 cordis.patch.yml，根 package.json 为私有工作区，二者不能视为同一个 npm 发布单元。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-browserskill/package.json:1-18](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/packages/dsh-plugin-browserskill/package.json#L1-L18)

包身份与 0.3.3 版本。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "@wxg-prc-cpg/browser-skill-dsh-plugin",
  "description": "DeepSeek Harness tool plugin that exposes BrowserSkill browser automation (bsk_* tools) to the model",
  "version": "0.3.3",
  "license": "MIT",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Tencent/BrowserSkill.git",
    "directory": "packages/dsh-plugin-browserskill"
  },
  "homepage": "https://github.com/Tencent/BrowserSkill/tree/main/packages/dsh-plugin-browserskill#readme",
  "bugs": {
    "url": "https://github.com/Tencent/BrowserSkill/issues"
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-browserskill/package.json:32-67](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/packages/dsh-plugin-browserskill/package.json#L32-L67)

发布文件和 DSH 客户端入口。

<details>
<summary>查看原文（36行）</summary>

```text
    },
    "./client": {
      "default": "./lib/client.cjs"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "skill",
    "cordis.patch.yml",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-tool",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
      "external": [
        "@deepseek-ai/dsh-client-ui-primitives"
      ]
    }
  },
  "scripts": {
    "build": "node scripts/build-client-css.mjs && node scripts/build-skill-content.mjs && tsdown",
    "typecheck": "pnpm run build:skill && tsc --noEmit",
    "test": "pnpm run build:css && pnpm run build:skill && vitest run",
    "build:css": "node scripts/build-client-css.mjs",
    "build:skill": "node scripts/build-skill-content.mjs",
    "prepack": "pnpm run build",
    "lint:publint": "publint"
  },
```

</details>

<a id="research-q02"></a>

<a id="detail-section-11"></a>

### Q02 · 六工具如何分发并维护会话、取消和 UI？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply 建立 runner、SessionRegistry、KeyedExecutor、ObservationService 和磁盘启动日志，注册 browser-skill；默认 lazyTools 只在技能调用后显露工具，缺少技能服务的组合需检查是否能揭示。六工具以 action 找到私有操作定义，传递 contextId 和 dependsOn，再复用操作级渲染与并发规则。runner 使用参数数组 spawn bsk 并追加 --json，转换错误、超时与取消。webServer 注入后才注册观察路由，headless 组合不因此阻塞工具。需要外部 bsk、已连接扩展和兼容 DSH peer，安装包不等于 CLI 已就绪。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-browserskill/src/index.ts:86-166](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/packages/dsh-plugin-browserskill/src/index.ts#L86-L166)

真实装配、按需工具和路由。

<details>
<summary>查看原文（81行）</summary>

```text
    lazyTools: config.lazyTools ?? true,
  };
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
  });
  // Reap a conversation's browsers when the conversation itself is archived:
  // archived sessions are hidden from every surface, so their Agent Windows
  // would otherwise linger unreachable until idle timeout or unload.
  disposers.push(armArchiveCleanup(ctx, starts));

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
    },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-browserskill/src/browser-tools.ts:66-139](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/packages/dsh-plugin-browserskill/src/browser-tools.ts#L66-L139)

action 分发与上下文传递。

<details>
<summary>查看原文（74行）</summary>

```text
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
    },
    output: {
      schema: DOMAIN_RESULT,
      render(args, value) {
        const definition = definitionFor(definitions, spec.actions, args.action);
        return definition.output.render(operationArgs(args), value);
      },
    },
    isConcurrencySafe(args) {
      const definition = definitionFor(definitions, spec.actions, args.action);
      return definition.isConcurrencySafe?.(operationArgs(args)) === true;
    },
    async execute(args, exec) {
      const definition = definitionFor(definitions, spec.actions, args.action);
      return (await definition.execute(operationArgs(args), {
        ...exec,
        observationContext: args.contextId,
        observationDependencies: args.dependsOn,
      } as typeof exec)) as never;
    },
    presentCall(args) {
      const definition = definitionFor(definitions, spec.actions, args.action);
      return definition.presentCall?.(operationArgs(args));
    },
    presentResult(args, result) {
      const definition = definitionFor(definitions, spec.actions, args.action);
      return definition.presentResult?.(operationArgs(args), result);
    },
  });
}

const BROWSER_TOOL_SPECS: BrowserToolSpec[] = [
  {
    name: toolNames.session,
    description:
      "Manage plugin-owned browser sessions. Human collaboration is automatic; share is an optional compatibility alias for sync/rebinding. " +
      "sync returns current state and context_id; wait-user waits for hand-back; cooperation-status reads ownership. " +
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-browserskill/src/runner.ts:142-160](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/packages/dsh-plugin-browserskill/src/runner.ts#L142-L160)

spawn 使用参数数组和 JSON 输出。

<details>
<summary>查看原文（19行）</summary>

```text
      }
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
          // A child exiting while cancellation closes stdin may report EPIPE.
          // Process completion remains the authority for the run result.
          child.stdin?.on("error", () => {});
        } catch (error) {
          reject(error);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-12"></a>

### Q03 · 压缩工具数量是否保留控制边界，最重要限制是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

相对将每种浏览器操作单独暴露，六个域工具共享 action 分发，在减少顶层 schema 数量时保留操作级取消、呈现及并发判断。这是宿主交互和资源管理贡献，不能把根项目的浏览器自动化全部计入本层创新。contextId 与 dependsOn 为共享标签页的观察后行动提供接口，但它们本身不证明用户意图正确，也不能保证提交后的业务副作用可撤销。0.3.3 的 bsk_* 名称替代旧 browser_* 且无别名，已有策略和会话技能需迁移；CLI、扩展、插件三层版本协同是采用条件。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-browserskill/src/browser-tools.ts:95-118](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/packages/dsh-plugin-browserskill/src/browser-tools.ts#L95-L118)

观察上下文与依赖传入执行。

<details>
<summary>查看原文（24行）</summary>

```text
        description:
          "Observed refs/selectors covering all regions used for this decision. Omit to validate the whole page. The action target's region and form values are always checked.",
      },
      contextId: {
        type: "string",
        description:
          "Shared-tab actions require the context_id you actually received from bsk_session sync. One context authorizes one action; never substitute a newer context into an old plan.",
      },
    },
    output: {
      schema: DOMAIN_RESULT,
      render(args, value) {
        const definition = definitionFor(definitions, spec.actions, args.action);
        return definition.output.render(operationArgs(args), value);
      },
    },
    isConcurrencySafe(args) {
      const definition = definitionFor(definitions, spec.actions, args.action);
      return definition.isConcurrencySafe?.(operationArgs(args)) === true;
    },
    async execute(args, exec) {
      const definition = definitionFor(definitions, spec.actions, args.action);
      return (await definition.execute(operationArgs(args), {
        ...exec,
```

</details>

**依据 2 · 作者声明**：[README.md:159-172](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/README.md#L159-L172)

升级顺序和工具名称迁移说明。

<details>
<summary>查看原文（14行）</summary>

````text
## DeepSeek Harness plugin

The [DSH plugin](packages/dsh-plugin-browserskill/README.md) adds native `bsk_*` tools, browser task previews, and screenshot results to the DeepSeek Harness Web UI. It uses the same `bsk` CLI and extension and includes its own BrowserSkill skill.

**Upgrading to 0.3.3:** update the CLI and extension before the plugin. The six `browser_*` tools have been renamed to `bsk_*`, without aliases for the old names. Update custom tool calls and policies, restart the DSH profile, and invoke `/browser-skill` again in existing conversations. See the [migration guide](packages/dsh-plugin-browserskill/README.md#breaking-tool-api-migration-033).

With DeepSeek Harness, pnpm, and `bsk` installed and the extension connected, add the plugin to your profile:

```sh
dsh plugin --profile web add @wxg-prc-cpg/browser-skill-dsh-plugin
dsh --profile web
```

Replace `web` with your profile name. Make sure `bsk` is available on the PATH used to start DSH, or set the plugin's `bskPath`. In a conversation, invoke `/browser-skill` and describe the task. A separate `bsk install-skill` step is not needed.
````

</details>

<a id="research-q04"></a>

<a id="detail-section-13"></a>

### Q04 · 怎样在可控任务试用，预算和收益如何判断？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合已经使用 DSH Web 的人，在非破坏网页读取或测试站点验证一条完整流程。先安装并核对 CLI 和扩展连接，再加载插件并调用技能，观察任务是否出现、结束后窗口是否释放。首次成本是三层安装和权限配置，持续成本为模型决策、浏览器资源及预览采集，失败恢复包括悬挂会话检查、命令取消与版本回退；没有金额或人时测量。源码存在预览和清理链路，但未完成同版本宿主验收，不能升级为持续安装建议。真实网页提交应另设人工确认步骤，因为队列控制不等于业务回滚。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-browserskill/src/index.ts:121-174](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/packages/dsh-plugin-browserskill/src/index.ts#L121-L174)

清理、恢复及归档联动。

<details>
<summary>查看原文（54行）</summary>

```text
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
  });
  // Reap a conversation's browsers when the conversation itself is archived:
  // archived sessions are hidden from every surface, so their Agent Windows
  // would otherwise linger unreachable until idle timeout or unload.
  disposers.push(armArchiveCleanup(ctx, starts));

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
    },
  );
}

export { armArchiveCleanup, ownerSessionIds } from "./archive-cleanup";
export { registerBrowserTools } from "./browser-tools";
export type { ObservationEvent, ObservationOptions, SessionObservation } from "./observation";
export { ObservationService } from "./observation";
export { registerObservationRoutes } from "./observation-http";
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-browserskill/src/runner.ts:81-106](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/packages/dsh-plugin-browserskill/src/runner.ts#L81-L106)

取消与输出收敛时间边界。

<details>
<summary>查看原文（26行）</summary>

```text
// Business RPCs translate Ctrl-C / opt-in stdin EOF into cancel(rpc_id).
// Allow reconciliation before hard-killing an old or unresponsive CLI.
const KILL_GRACE_MS = 3000;
// Windows IPC may spend 5s connecting, 2s cancelling, 2s settling,
// and up to 5s releasing the entire batch of caller-owned transfers.
const WINDOWS_KILL_GRACE_MS = 15_000;
// A killed child that never reports `exit` at all must still release the caller
// once the forced kill has had its chance.
const SETTLE_AFTER_KILL_SLACK_MS = 1000;
// `close` fires only once every stdio pipe has reached EOF, which needs every
// process holding a copy of the pipe handles to be gone, not just `bsk`. When
// `bsk` auto-spawns the daemon, the daemon can end up holding those handles
// (Windows `CreateProcess` inherits every inheritable handle; issue #180), so
// after `exit` we drain what the pipes still give us and then settle, rather
// than waiting for a `close` that may never come. `close` normally follows
// `exit` within the same loop turn, so the wait is only ever paid when
// something else is holding the pipes. Bytes arriving inside the window can
// still be the child's own buffered output, so every chunk restarts the window
// and EXIT_DRAIN_MAX_MS caps the total wait.
const EXIT_DRAIN_GRACE_MS = 1000;
const EXIT_DRAIN_MAX_MS = 2000;
const SESSION_BUSY_RETRY_DELAY_MS = 100;

/** One in-flight child plus the bounded shutdown that settles its run. */
interface LiveRun {
  tag: string | undefined;
```

</details>

#### 缺口

- 没有与直接 shell bsk 的同任务对照。
  **影响**：工具收敛是否降低模型错误和总成本仍未知。
  **进一步探讨**：比较工具选择错误、任务完成率、token 与人工接管次数。

<a id="research-q05"></a>

<a id="detail-section-14"></a>

### Q05 · 会话队列设计有什么价值，能推导怎样的工具设计实验？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

KeyedExecutor 将同会话操作和观察采集排成 FIFO，失败尾链不拒绝，已排队任务取消时仍等待前驱收敛，避免后续任务穿越运行中的任务。资源所有权在注册前建立，加载失败也可进入清理，适合可产生外部资源的插件借鉴；移植时需为外部后端提供真实取消与收敛语义。未验证假设是六工具加按需技能较全量操作 schema 能降低初始上下文负担而不增加 action 参数错误。对照同模型、同任务分别用两种接口，测首轮 token、非法 action、成功率及接管次数；若参数错误抵消上下文收益，应保留分层而调整 schema。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-browserskill/src/queue.ts:14-63](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/packages/dsh-plugin-browserskill/src/queue.ts#L14-L63)

FIFO 与取消后的尾链收敛。

<details>
<summary>查看原文（50行）</summary>

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
    return task;
  }
}

function abortError(): Error {
  const error = new Error("tool call aborted");
  error.name = "AbortError";
  return error;
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-browserskill/src/index.ts:121-145](https://github.com/Tencent/BrowserSkill/blob/b63f551209caba4d7debfc12215b2b7c118bad49/packages/dsh-plugin-browserskill/src/index.ts#L121-L145)

先拥有资源再执行可能失败的注册。

<details>
<summary>查看原文（25行）</summary>

```text
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
```

</details>

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
