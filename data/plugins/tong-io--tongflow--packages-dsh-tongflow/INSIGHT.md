# dsh-tongflow

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[07037ea](https://github.com/tong-io/tongflow/tree/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow)

<!-- BEGIN META -->
[![GitHub ★ 1,049](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C049&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tong-io/tongflow) [![npm 30d 1,981](https://img.shields.io/static/v1?label=npm+30d&message=1%2C981&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tongflow) [![最新发布 2026-10-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tongflow)
<!-- END META -->

> **功能**：将 TongFlow Studio 的工具、技能和界面接入 DSH 会话。

> **亮点**：为 Studio 注入适配宿主服务、技能与界面，不等同 TongFlow 根执行引擎。[Q01](#research-q01)

> **主要限制**：异步初始化可能失败；付费确认仅为作者声明，未核验依赖实现。[Q03](#research-q03)

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
  - [Q01 · Studio 模式面向谁，较普通聊天多什么？](#detail-section-11)
  - [Q02 · 会话如何决定加载工具，客户端与 Host 是否相同？](#detail-section-12)
  - [Q03 · 加载插件就能保证 Studio 和付费保护有效吗？](#detail-section-13)
  - [Q04 · 依赖、费用和安全试用如何处理？](#detail-section-14)
  - [Q05 · 两端模式判断不一致如何减少误导？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中组织多模态项目和生成流程的用户；基线是普通聊天或自行切换 Studio。[Q01](#research-q01)

普通 DSH 会话或手动使用独立媒体工具。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 激活 | 首消息触发工具 | 一次决定 |
| 适配 | 挂接宿主会话服务 | 缺服务时能力受限 |
| Studio | 展示制作界面 | 客户端判断独立 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH tools 与 agents | 必需 | 会话级工具 | 无法装载 |
| tongflow-studio 和 Python | 必需 | Studio 执行 | 初始化失败 |
| jobs、附件、webServer | 对应功能需要 | 后台、图片与界面 | 能力受限 |
| 供应商凭据和预算 | 对应付费任务需要 | 生成 | 停止运行 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 开始 | 首消息以 @tongflow 触发 | 确认工具出现 |
| 试用 | 使用免费非敏感样例 | 核查界面和输出 |
| 运行 | 核对计费与预算 | 不明则停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Python 与插件环境 | 配置及权限核查 | 自动安装需审阅 |
| 持续 | API 或 GPU 费用 | 检查输出和账单 | 金额未测 |
| 恢复 | 任务可能已计费 | 核实供应商回执 | 不假定退款 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话集成 | scoped 激活与工具适配 | 宿主运行效果 |
| 费用控制 | 作者声明确认 | 实际保护与节费 |

> **思考**：异步初始化可能失败；付费确认仅为作者声明，未核验依赖实现。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：为 Studio 注入适配宿主服务、技能与界面，不等同 TongFlow 根执行引擎。[Q01](#research-q01)

首次消息决定 Host 会话激活；客户端独立依据记忆、首消息或标题判断，可能状态不一致。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

异步初始化可能失败；付费确认仅为作者声明，未核验依赖实现。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

从免费非敏感样例和首消息触发开始，付费前核对实际账单与确认。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子组件源码支持首次激活和服务适配；未运行宿主或依赖。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tongflow/src/index.ts、packages/dsh-tongflow/src/activation.ts、packages/dsh-tongflow/src/tools.ts、packages/dsh-tongflow/src/config.ts、packages/dsh-tongflow/src/client/studio/StudioModeWatcher.tsx、packages/dsh-tongflow/README.md 及固定范围 inventory；组件：packages/dsh-tongflow。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件 inventory 21 文件、无排除或解析错误；不引用根及依赖实现，不运行宿主。
- 下一步：固定宿主和 Studio 依赖，隔离测试触发、恢复、未确认付费任务及回退。

**分析版本**

- **仓库**：[tong-io/tongflow](https://github.com/tong-io/tongflow)
- **版本号**：0.8.4（[固定提交 07037ea](https://github.com/tong-io/tongflow/tree/07037ea1a65cd1546114b86c8dbf43b4703688be)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：共享 Host 激活状态可降低 UI 和工具状态不一致，需对照恢复与延迟场景。[Q05](#research-q05)

固定宿主和 Studio 依赖，隔离测试触发、恢复、未确认付费任务及回退。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 787 | — | — | 8998 |
| .ts | source | 8 | 750 | 592 | 114 | — |
| .tsx | source | 3 | 440 | 385 | 32 | — |
| .ts | test | 2 | 200 | 171 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/tong-io/tongflow/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/tong-io/tongflow/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/tong-io/tongflow/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH Studio 模式如何激活并接入 TongFlow 工具，执行与计费有哪些证据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Studio 模式面向谁，较普通聊天多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

想在 DSH 会话中组织多模态项目和工作流的用户可使用 Studio 界面及工具。相对普通聊天，子组件按会话注入项目/工作流工具、技能和提示；执行核心来自 tongflow-studio，不能将整套引擎归因于 DSH 适配器。无需多模态流程时普通聊天更直接。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tongflow/src/index.ts:1-7](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/index.ts#L1-L7)

Host 接入职责。

```text
/**
 * dsh-tongflow — host (Node) half.
 *
 * A Cordis plugin mounted by the dsh Loader. It stands up the Studio (paths,
 * python bootstrap, plugin registry, run manager) and registers, as effects:
 * the tongflow_* agent tools, packaged skills, a short system-prompt section
 * and the HTTP routes the embedded canvas / studio UI talk to.
```

**依据 2 · 源码核查**：[packages/dsh-tongflow/src/activation.ts:60-86](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/activation.ts#L60-L86)

激活后注册会话级工具、提示、技能。

<details>
<summary>查看原文（27行）</summary>

```text
export function installActivation(
    ctx: Context,
    options: ActivationOptions,
): void {
    const activated = new WeakSet<Agent>();
    const decided = new WeakSet<Agent>();

    const activate = (agent: Agent) => {
        if (activated.has(agent)) return;
        activated.add(agent);
        const actx = agent.ctx;
        registerTools(actx, options.env);
        actx.inject(["systemPrompt"], (pctx) => {
            pctx.effect(
                () =>
                    pctx.systemPrompt.section({
                        name: "tool:tongflow",
                        order: 150,
                        text: options.systemSection,
                    }),
                "dsh-tongflow: system prompt section (agent scope)",
            );
        });
        actx.inject(["skills"], (sctx) => registerSkills(sctx));
        options.studio.log(
            `dsh-tongflow: studio mode on for session ${agent.id}`,
        );
```

</details>

**依据 3 · 作者声明**：[packages/dsh-tongflow/README.md:83-87](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/README.md#L83-L87)

作者列举工具及方法。

```text
## Agent tools

`tongflow_project_create / _open / _list / _status` · `tongflow_workflow_new / _patch / _read / _list / _validate / _run / _compose` · `tongflow_node_catalog / _describe` · `tongflow_look` (images / video contact sheets, returned as an image block — or described through a slot when the session's model takes no images) · `tongflow_perceive` (video/audio/image understanding via TongFlow slots; billing plugins need `user_confirmed`) · `tongflow_plugins_list / _install / _uninstall` · `tongflow_run_status`. Folder structure and text files are made with dsh's ordinary file tools. Long runs go through dsh background jobs (`run_in_background`).

Skill shipped: `tongflow-studio` (the working method: research → propose a structure → one workflow per asset next to its outputs → run → review → next stage), with four method references under [`skills/references/`](skills/references/) that the agent loads only when the step needs them:
```

#### 缺口

- 未运行 DSH、Studio 或模型服务
  **影响**：不能确认工具调用、支付确认或实际输出
  **进一步探讨**：固定宿主和依赖，以隔离免费与付费样例核验激活及确认

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话如何决定加载工具，客户端与 Host 是否相同？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 在首次 agent pre-step 检查历史第一条用户文字或首条输入，以忽略前导空格、不区分大小写的 @tongflow 前缀决定；已有非触发首消息时该会话固定普通模式。激活后工具和技能注入 agent scoped context。浏览器注册 Studio 视图及 watcher，自有记忆、首消息或标题判断；两端判断并非完全相同，注释提 cwd 不等于 Host 判断代码包含 cwd。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tongflow/src/activation.ts:16-22](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/activation.ts#L16-L22)

触发前缀。

```text
export const TRIGGER = "@tongflow";

export function isTriggerText(text: string | undefined): boolean {
    return (
        typeof text === "string" &&
        text.trimStart().toLowerCase().startsWith(TRIGGER)
    );
```

**依据 2 · 源码核查**：[packages/dsh-tongflow/src/activation.ts:89-119](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/activation.ts#L89-L119)

首次决定和历史优先。

<details>
<summary>查看原文（31行）</summary>

```text
    const isStudioSession = (
        agent: Agent,
        incoming: readonly { content?: readonly unknown[] }[],
    ): boolean => {
        const logged = firstLoggedUserText(agent);
        if (logged !== undefined) return isTriggerText(logged);
        return isTriggerText(firstText(incoming[0]?.content));
    };

    // Decide once, on the first step of an agent (before the model request assembles tools).
    ctx.on("agent/pre-step", async (payload, next) => {
        const agent = payload.agent;
        if (!decided.has(agent)) {
            let studio = false;
            try {
                studio = isStudioSession(agent, payload.messages);
            } catch {
                studio = false;
            }
            if (studio) {
                decided.add(agent);
                activate(agent);
            } else if (
                payload.messages.length > 0 ||
                firstLoggedUserText(agent) !== undefined
            ) {
                // A first message exists and did not trigger: this session stays plain.
                decided.add(agent);
            }
        }
        return next();
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tongflow/src/activation.ts:60-83](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/activation.ts#L60-L83)

会话范围注册。

<details>
<summary>查看原文（24行）</summary>

```text
export function installActivation(
    ctx: Context,
    options: ActivationOptions,
): void {
    const activated = new WeakSet<Agent>();
    const decided = new WeakSet<Agent>();

    const activate = (agent: Agent) => {
        if (activated.has(agent)) return;
        activated.add(agent);
        const actx = agent.ctx;
        registerTools(actx, options.env);
        actx.inject(["systemPrompt"], (pctx) => {
            pctx.effect(
                () =>
                    pctx.systemPrompt.section({
                        name: "tool:tongflow",
                        order: 150,
                        text: options.systemSection,
                    }),
                "dsh-tongflow: system prompt section (agent scope)",
            );
        });
        actx.inject(["skills"], (sctx) => registerSkills(sctx));
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tongflow/src/client/studio/StudioModeWatcher.tsx:55-76](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/client/studio/StudioModeWatcher.tsx#L55-L76)

客户端使用记忆、首消息和标题。

<details>
<summary>查看原文（22行）</summary>

```text
const LS_PREFIX = "dsh-tongflow:studio-session:";

export function StudioModeWatcher({
    useChat,
    useSessions,
    sessionId,
}: StudioModeWatcherProps) {
    // The loaded history window may not reach the first message of a long
    // session; the session title (derived from it) and a per-session memo cover that.
    const firstText = useChat((s) => firstUserText(s.legacy.nodes));
    const title = useSessions(
        (s) => s.byId[sessionId]?.title ?? s.byId[sessionId]?.displayTitle,
    );
    const remembered =
        typeof localStorage !== "undefined" &&
        localStorage.getItem(LS_PREFIX + sessionId) === "1";
    const studioMode =
        remembered || isStudioText(firstText) || isStudioText(title);
    useEffect(() => {
        if (studioMode && !remembered)
            localStorage.setItem(LS_PREFIX + sessionId, "1");
    }, [studioMode, remembered, sessionId]);
```

</details>

#### 缺口

- 未运行 DSH、Studio 或模型服务
  **影响**：不能确认工具调用、支付确认或实际输出
  **进一步探讨**：固定宿主和依赖，以隔离免费与付费样例核验激活及确认

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 加载插件就能保证 Studio 和付费保护有效吗？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能。Host 创建 Studio 后异步 init，失败只记录警告；web 路由在 webServer 注入时注册；适配器把调用交给中立工具实现。README 声称付费运行需要每次显式确认，但本项未追踪独立依赖中计费实现或运行它，不能声称该保护在当前宿主已验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tongflow/src/index.ts:35-75](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/index.ts#L35-L75)

异步初始化与条件 web 路由。

<details>
<summary>查看原文（41行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
    const log = (line: string) => ctx.logger?.info?.(line);
    const studio = new Studio({
        config: {
            ...config,
            studioRoot:
                config.studioRoot?.trim() || join(resolveDshHome(), "tongflow"),
        },
        log,
    });
    const api = new StudioApi(studio);
    void studio.init().catch((error: unknown) => {
        ctx.logger?.warn?.(
            `dsh-tongflow: studio init failed: ${error instanceof Error ? error.message : String(error)}`,
        );
    });

    // Tools / prompt / skills attach per agent, only for studio sessions
    // (first message starts with "@tongflow", or the cwd is a studio project).
    installActivation(ctx, {
        studio,
        env: { studio, api },
        systemSection: SYSTEM_SECTION,
    });

    ctx.inject(["webServer"], (webCtx) => {
        const handler = createRouteHandler({
            studio,
            api,
            prefix: config.httpPrefix,
        });
        webCtx.effect(
            () =>
                webCtx.webServer.register({
                    kind: "prefix",
                    path: routePrefix(config.httpPrefix),
                    handler,
                }),
            "dsh-tongflow: http routes",
        );
    });
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tongflow/src/tools.ts:168-195](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/tools.ts#L168-L195)

适配工具并委托 spec.execute。

<details>
<summary>查看原文（28行）</summary>

```text
    const val = value as {
        attachment?: ImageAttachmentRef;
        summary?: string;
    } | null;
    if (!val || typeof val !== "object" || !val.attachment) return text(value);
    return [
        ...text(val.summary ?? JSON.stringify(value)),
        { type: "image", attachment: val.attachment },
    ];
}

function dshTool(ctx: Context, spec: ToolSpec): ToolDefinition {
    return defineTool({
        name: spec.name,
        description: spec.description,
        parameters: spec.parameters as ParameterSchemaSpec,
        output: {
            schema: { type: spec.returns === "string" ? "string" : "json" },
            render,
        },
        execute: (args, exec) =>
            spec.execute(args as never, toolCall(ctx, exec)) as Promise<never>,
    });
}

/** Register every tongflow_* tool on ctx.tools; registrations are effects (disposed on unload). */
export function registerTools(ctx: Context, env: ToolEnv): void {
    for (const spec of allTools(env)) {
```

</details>

**依据 3 · 作者声明**：[packages/dsh-tongflow/README.md:75-77](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/README.md#L75-L77)

作者声明付费确认。

```text
### Billing checkpoint

A run that uses a paid plugin spends the user's money — a paid API key, or GPU seconds on their Modal account (a Modal plugin also deploys on first use). So `tongflow_workflow_run` without `user_confirmed: true` does not run: it returns `needs_confirmation` with the plugins involved, how each is billed (`api` / `modal`), whether its API keys are set, the models it offers and installed alternatives. The agent puts that to the user and calls again with `user_confirmed` only after an explicit yes — **for every paid run**; nothing is remembered. Runs that use only local plugins are free and start directly. The Studio's own **Run** drawer shows the same notice and a **Confirm & run** button.
```

#### 缺口

- 未运行 DSH、Studio 或模型服务
  **影响**：不能确认工具调用、支付确认或实际输出
  **进一步探讨**：固定宿主和依赖，以隔离免费与付费样例核验激活及确认

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、费用和安全试用如何处理？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Host 强依赖 tools 和 agents，Studio 还依赖 Python、SDK、插件和供应商；后台 jobs、附件等在适配层按服务是否存在提供。付费 API 与 GPU 可能计费，需由用户核对每次运行提示、账户预算和服务商账单；先以免费非敏感样例验证，不明调用或无法确认时停止。自动安装配置默认开启须事先检查部署设置。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tongflow/src/index.ts:27-30](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/index.ts#L27-L30)

强依赖服务。

```text
export const name = "dsh-tongflow";

/** The tool registry and agent registry are the hard requirements; other seams attach when they mount. */
export const inject = ["tools", "agents"];
```

**依据 2 · 源码核查**：[packages/dsh-tongflow/src/tools.ts:114-140](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/tools.ts#L114-L140)

按存在性传递附件和后台服务。

<details>
<summary>查看原文（27行）</summary>

```text
/** One dsh execution as the neutral tools see it; absent services stay absent so the tools degrade. */
function toolCall(ctx: Context, exec: ToolRunContext): ToolCall {
    const attachments = ctx.get("attachments") as AttachmentStore | undefined;
    const jobs = ctx.get("jobs") as JobRegistry | undefined;
    const cwd = exec.agent?.session.header.cwd;
    return {
        signal: exec.signal,
        ...(exec.agent?.id ? { sessionId: String(exec.agent.id) } : {}),
        ...(cwd ? { cwd } : {}),
        takesImages: () => modelTakesImages(ctx, exec),
        ...(attachments
            ? {
                  showImage: async (image) => {
                      const attachment = await attachments.saveImage(image);
                      return {
                          attachment: attachment as unknown as JsonValue,
                          width: attachment.width,
                          height: attachment.height,
                      };
                  },
              }
            : {}),
        ...(jobs
            ? {
                  startBackground: (workflow, record) =>
                      String(
                          jobs.start(
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tongflow/src/config.ts:20-30](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/config.ts#L20-L30)

Python、SDK、并发及自动安装配置。

<details>
<summary>查看原文（11行）</summary>

```text
export const Config: z<Config> = z.object({
    studioRoot: z.string(),
    pythonPath: z.string(),
    sdkSpec: z.string().default(`tongflow==${DEFAULT_TONGFLOW_SDK_VERSION}`),
    pluginOrg: z.string().default(OFFICIAL_ORG),
    pluginGitUrls: z.dict(z.string()).default({}),
    env: z.dict(z.string()).default({}),
    maxConcurrentRuns: z.number().default(2),
    httpPrefix: z.string().default("/tongflow"),
    locale: z.string().default("en"),
    autoInstallOfficial: z.boolean().default(true),
```

</details>

**依据 4 · 作者声明**：[packages/dsh-tongflow/README.md:75-77](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/README.md#L75-L77)

作者声明计费类型与确认。

```text
### Billing checkpoint

A run that uses a paid plugin spends the user's money — a paid API key, or GPU seconds on their Modal account (a Modal plugin also deploys on first use). So `tongflow_workflow_run` without `user_confirmed: true` does not run: it returns `needs_confirmation` with the plugins involved, how each is billed (`api` / `modal`), whether its API keys are set, the models it offers and installed alternatives. The agent puts that to the user and calls again with `user_confirmed` only after an explicit yes — **for every paid run**; nothing is remembered. Runs that use only local plugins are free and start directly. The Studio's own **Run** drawer shows the same notice and a **Confirm & run** button.
```

#### 缺口

- 未运行 DSH、Studio 或模型服务
  **影响**：不能确认工具调用、支付确认或实际输出
  **进一步探讨**：固定宿主和依赖，以隔离免费与付费样例核验激活及确认

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 两端模式判断不一致如何减少误导？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：由 Host 暴露会话激活状态并让客户端显示工具可用性，可能避免 Studio 界面出现但实际工具未启用。当前客户端以记忆、首消息或标题判断，而 Host 只按首个用户消息决定，故已有各自判断是重要反证：集中状态需处理异步、恢复与服务缺失。用普通和触发会话、恢复记录及服务延迟对照测误匹配和恢复时间，收益不足则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tongflow/src/activation.ts:89-119](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/activation.ts#L89-L119)

Host 首消息判定。

<details>
<summary>查看原文（31行）</summary>

```text
    const isStudioSession = (
        agent: Agent,
        incoming: readonly { content?: readonly unknown[] }[],
    ): boolean => {
        const logged = firstLoggedUserText(agent);
        if (logged !== undefined) return isTriggerText(logged);
        return isTriggerText(firstText(incoming[0]?.content));
    };

    // Decide once, on the first step of an agent (before the model request assembles tools).
    ctx.on("agent/pre-step", async (payload, next) => {
        const agent = payload.agent;
        if (!decided.has(agent)) {
            let studio = false;
            try {
                studio = isStudioSession(agent, payload.messages);
            } catch {
                studio = false;
            }
            if (studio) {
                decided.add(agent);
                activate(agent);
            } else if (
                payload.messages.length > 0 ||
                firstLoggedUserText(agent) !== undefined
            ) {
                // A first message exists and did not trigger: this session stays plain.
                decided.add(agent);
            }
        }
        return next();
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tongflow/src/client/studio/StudioModeWatcher.tsx:55-76](https://github.com/tong-io/tongflow/blob/07037ea1a65cd1546114b86c8dbf43b4703688be/packages/dsh-tongflow/src/client/studio/StudioModeWatcher.tsx#L55-L76)

客户端独立判断。

<details>
<summary>查看原文（22行）</summary>

```text
const LS_PREFIX = "dsh-tongflow:studio-session:";

export function StudioModeWatcher({
    useChat,
    useSessions,
    sessionId,
}: StudioModeWatcherProps) {
    // The loaded history window may not reach the first message of a long
    // session; the session title (derived from it) and a per-session memo cover that.
    const firstText = useChat((s) => firstUserText(s.legacy.nodes));
    const title = useSessions(
        (s) => s.byId[sessionId]?.title ?? s.byId[sessionId]?.displayTitle,
    );
    const remembered =
        typeof localStorage !== "undefined" &&
        localStorage.getItem(LS_PREFIX + sessionId) === "1";
    const studioMode =
        remembered || isStudioText(firstText) || isStudioText(title);
    useEffect(() => {
        if (studioMode && !remembered)
            localStorage.setItem(LS_PREFIX + sessionId, "1");
    }, [studioMode, remembered, sessionId]);
```

</details>

#### 缺口

- 未运行 DSH、Studio 或模型服务
  **影响**：不能确认工具调用、支付确认或实际输出
  **进一步探讨**：固定宿主和依赖，以隔离免费与付费样例核验激活及确认

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
