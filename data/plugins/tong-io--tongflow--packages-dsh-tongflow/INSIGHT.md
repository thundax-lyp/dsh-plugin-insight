# dsh-tongflow

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[0087122](https://github.com/tong-io/tongflow/tree/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow)

<!-- BEGIN META -->
[![GitHub ★ 1,046](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C046&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tong-io/tongflow) [![npm 30d 2,027](https://img.shields.io/static/v1?label=npm+30d&message=2%2C027&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tongflow) [![最新发布 2026-10-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tongflow)
<!-- END META -->

> **功能**：将TongFlow媒体工作流、项目树和画布接入DSH会话，支持资产生成与审阅。

> **亮点**：将DSH会话、附件和后台任务接入共用媒体工作流，让人和Agent编辑同一资产生成文件；增益在多轮协作与追溯，核心引擎贡献归TongFlow而非适配层。[Q01](#research-q01) [Q04](#research-q04)

> **主要限制**：付费确认依赖Agent提交布尔值，未见绑定用户交互与工作流摘要的许可校验，因此不能作为强预算隔离；首次自动下载及外部插件权限也需用户承担。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 工作流与资产并置解决谁的什么问题，贡献属于哪一层？](#detail-section-11)
  - [Q02 · 首消息激活与付费确认能约束到什么程度？](#detail-section-12)
  - [Q03 · 首次接入、持续制作和失败恢复各付出什么？](#detail-section-13)
  - [Q04 · 哪些适配设计可复用，维护代价是什么？](#detail-section-14)
  - [Q05 · 怎样让逐次付费确认更可靠，而不增加每节点确认？](#detail-section-15)
  - [Q06 · 谁值得试用，什么条件下应退回简单工具？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合需要反复制作角色图、配音和分镜的DSH用户，以工作流、产物及生成记录作为交付物。

简单替代为单一媒体API或供应商界面加文件整理。一次性生成不一定需要保存图结构；多阶段复用才更可能体现价值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工作流创建、修改与运行 | 保存资产生成过程并反复编辑 | 依赖Studio及具体生成插件 |
| 项目与运行状态 | 查询文件与长任务 | 先核对现有运行再重试 |
| 图片与媒体审阅 | 附件展示或调用描述插件 | 非视觉模型可能额外调用付费服务 |
| 会话局部工具 | 普通会话避免加载媒体工具组 | 首消息需触发Studio模式 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配peer范围的DSH、Node ≥22.19、Python ≥3.10 | 启动必需 | 宿主加载和SDK虚拟环境 | 不匹配版本可能拒载，本文未实测 |
| Git、PyPI及插件来源可达 | 首次准备必需 | 安装SDK和官方插件 | 准备失败需排查网络 |
| 模型密钥或Modal账户 | 相应生成必需 | 执行选定工作流 | 不能完成对应节点 |
| ffmpeg、视觉模型 | 特定审阅操作 | 视频联系表、图像检查 | 使用替代感知链路或人工审阅 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核对宿主范围后加载插件 | 可见Studio入口，加载失败先查版本 |
| 2 | 用户以@tongflow发起新会话并配置插件 | 工具与项目树出现，密钥不在聊天粘贴 |
| 3 | Agent保存并检查工作流，用户确认付费执行 | 保存编号产物并人工审阅 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | SDK和插件下载、磁盘 | Python/Git配置、密钥管理 | 耗时及安装成功率未测 |
| 持续使用 | 模型API或GPU、资产存储 | 逐轮确认和媒体复核 | 无合格任务单位成本 |
| 失败恢复 | 可能重复计费 | 查运行记录、确认已产出后再决定重跑 | 不覆盖编号输出不等于远端任务幂等 |
| 退出 | 保留本地文件 | 备份项目并禁用插件，按需撤销密钥 | 完整卸载未实测 |

普通项目文件有利于保留已有成果，但密钥写在studioRoot/env.json，0600权限只是本机文件限制，不是隔离外部插件代码。共享运行工具保留后台runId，因此用户应先查询运行状态，再决定是否重试，不能把一次超时当作未发生调用。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 人与Agent共用工作流 | 文件与画布共用的设计及工具接线 | 实际编辑成功率 |
| 多轮产物追溯 | 编号输出和运行记录规范 | 远端重试幂等性 |
| 制作效率 | 减少手工关联工作流与资产的可能 | 同条件节时和费用 |

> **思考**：付费确认依赖Agent提交布尔值，未见绑定用户交互与工作流摘要的许可校验，因此不能作为强预算隔离；首次自动下载及外部插件权限也需用户承担。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将DSH会话、附件和后台任务接入共用媒体工作流，让人和Agent编辑同一资产生成文件；增益在多轮协作与追溯，核心引擎贡献归TongFlow而非适配层。[Q01](#research-q01) [Q04](#research-q04)

中立 allTools(env) 转换成宿主 defineTool，将附件显示与后台jobs放入ToolCall，而不是把DSH类型散布到每个媒体工具。scope effect随着Agent释放，首消息决策用WeakSet防止重复注册，适用于仅部分会话启用的大工具组。

代价是宿主API兼容逻辑需维护。backgroundJobSpec按jobs是否暴露events区分两个接口，输出同时填result和output；模型模态查询异常默认接受图像，以免自动描述重复触发付费运行。这些是明确取舍，不足以证明所有预发布宿主都兼容。Studio初始化失败仅告警，工具后续是否能给出良好错误仍需运行检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

付费确认依赖Agent提交布尔值，未见绑定用户交互与工作流摘要的许可校验，因此不能作为强预算隔离；首次自动下载及外部插件权限也需用户承担。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

有多轮媒体资产任务的DSH用户可在副本项目限制额度试用；先核对宿主版本、Python与外部插件权限，人工审阅每轮产物；若需要强预算隔离或只偶发出图，退回供应商界面或简单脚本。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

适配和确认分支有源码支持；节时、兼容及生成质量未实测；许可绑定属于未验证假设。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tongflow/README.md、packages/dsh-tongflow/src/activation.ts、packages/dsh-tongflow/src/tools.ts、packages/dsh-tongflow/src/index.ts、packages/tongflow-studio/src/tools/run-tools.ts、packages/tongflow-studio/src/api.ts、packages/dsh-tongflow/src/config.ts 及固定范围 inventory；组件：packages/dsh-tongflow。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查DSH适配器及共享运行工具的确认链路，未完整审计所有媒体插件、供应商与HTTP路由。
- 下一步：先以低价值副本项目比较完整交付时间和重跑费用；另核对确认后换参和重复提交，不能以正常路径出图证明授权安全。

**分析版本**

- **仓库**：[tong-io/tongflow](https://github.com/tong-io/tongflow)
- **版本号**：0.8.4（[固定提交 0087122](https://github.com/tong-io/tongflow/tree/0087122f5900073dfbdb0e7a1e2ff497245e1f21)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可尝试一次性许可绑定工作流摘要、模型和预算，比较换参及重放的误执行率与确认负担；当前尚未实现或验证。[Q05](#research-q05)

先以低价值副本项目比较完整交付时间和重跑费用；另核对确认后换参和重复提交，不能以正常路径出图证明授权安全。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 787 | — | — | 8998 |
| .ts | source | 8 | 750 | 592 | 114 | — |
| .tsx | source | 3 | 440 | 385 | 32 | — |
| .ts | test | 2 | 200 | 171 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/tong-io/tongflow/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/tong-io/tongflow/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/tong-io/tongflow/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的DSH适配器能否支持可复查媒体资产制作，确认与恢复负担是否支持小范围试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工作流与资产并置解决谁的什么问题，贡献属于哪一层？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已使用 DSH、需要反复制作角色图、分镜及配音的创作者。合格产物不是一张临时预览，而是资产文件、能重新编辑的工作流和每轮生成记录。相较聊天中直接调用图像 API，再手工整理文件，此方案将每个资产的生成步骤保存成旁边的 .tongflow.json，允许人从同一画布修改后再次运行。

适配器的贡献是把项目树、画布、附件及后台任务接入 DSH；节点语法、引擎与多模态插件来自同仓库 tongflow-studio 和 TongFlow，不能算作适配器新算法。一次性出图可继续使用单一生成工具，保存图结构反而增加准备步骤。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-tongflow/README.md:5-15](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/README.md#L5-L15)

作者明确区分宿主、Agent和引擎所有权，并说明工作流文件与画布共用。

<details>
<summary>查看原文（11行）</summary>

```text
Three layers, never mixed up:

| Layer | Owns |
|---|---|
| **dsh** | the harness: sessions, model routing, tools, jobs, web UI |
| **the agent** | creativity: the plan, the folder structure, briefs, scripts, prompts, review notes — plain files |
| **TongFlow** | deterministic generation: every image / voice / music / video / 3D asset is produced by **running a saved workflow file** (`<name>.tongflow.json`) through the TongFlow engine and its plugins |

The studio itself is host-neutral — [`tongflow-studio`](../tongflow-studio) holds the projects, the engine runner and the `tongflow_*` tools, and serves the same tools as an MCP server (and a [Claude Code plugin](../../claude-plugin/tongflow)). This package is the dsh adapter: it adds the Studio panel and the embedded canvas.

There is deliberately no "generate an image" tool and no project template. The agent studies what the user wants to make (with web research when useful), proposes a folder structure, writes it down, and then — for every asset — creates a workflow file where that asset belongs, runs it, reviews the result, and builds the next stage on it. Users open the same `.tongflow.json` on the embedded canvas, tweak it, and re-run; they can also reorganize the folders by hand at any time.
```

</details>

**依据 2 · 作者声明**：[packages/dsh-tongflow/README.md:58-73](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/README.md#L58-L73)

项目规范记录了工作流、编号输出和来源记录。

<details>
<summary>查看原文（16行）</summary>

````text
**The one rule:** every AI-generated asset comes from a workflow file that sits next to its outputs.

```
characters/mei/
  mei.md                    what the agent wrote about her
  mei_ref.tongflow.json     the workflow that renders her reference sheet
  mei_ref.01.png            run 1
  mei_ref.02.png            run 2  (a run never overwrites — fix the workflow, run again)
  mei_ref.runs.json         provenance of every run: inputs, plugins, note, timing
```

- Multi-output runs keep the workflow's output names: `mei_ref.03.image.png` + `mei_ref.03.caption.txt`; text outputs are written as `.txt` too.
- Workflows reference project files by **path**: `./mei_ref.02.png` / `../style/palette.png` (relative to the workflow file) or `characters/mei/mei_ref.02.png` (relative to the project root); URLs pass through.
- Text files can be **included** in prompts: `{{../style.md}} {{./mei.md}} full-body sheet` — expanded at run time, so a shared style note is written once.
- **Compose**: `tongflow_workflow_compose({ folder })` merges the small workflows of a folder (or an explicit list) into one `<folder>_all.tongflow.json` — a data node that references another part's output file (`./ref.01.png`) becomes an edge from that part's producing node, parts are ordered by those dependencies, every stage stays an output labelled after its part (`shot_all.01.i2v.mp4` via `meta.outputLabels`), the parts are untouched.
- The Studio tree nests a workflow's outputs under it; the user may rename / move / delete anything by hand and **upload files** (header button → the selected folder, or drag & drop onto a folder view; default `uploads/`) — the agent re-reads the tree (`tongflow_project_status`) before acting.
````

</details>

**依据 3 · 源码核查**：[packages/dsh-tongflow/src/index.ts:35-58](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/src/index.ts#L35-L58)

适配器创建共享Studio并委托会话激活。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 首消息激活与付费确认能约束到什么程度？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

agent/pre-step 在首次用户消息上检查 @tongflow，决定后保持普通或 Studio 会话；激活通过 agent 自己的 context 注册工具、提示和 Skill。工具执行把宿主会话、cwd、附件和 jobs 接给共享工具。

付费运行确有未确认时返回 needs_confirmation 的分支，但确认字段是模型可提交的 user_confirmed 布尔值，未在这条调用链中看到绑定用户交互、工作流摘要或一次性票据的校验。其作用是在遵守指令的 Agent 中提醒逐次确认，不能据此保证模型绝不会越权消费。计费分类也按 needsDeploy 和必填环境变量推断，不是供应商报价或费用上限；本地分类不证明资源无成本。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tongflow/src/activation.ts:67-95](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/src/activation.ts#L67-L95)

工具按Agent作用域激活，读取首条持久化消息。

<details>
<summary>查看原文（29行）</summary>

```text
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
    };

    const isStudioSession = (
        agent: Agent,
        incoming: readonly { content?: readonly unknown[] }[],
    ): boolean => {
        const logged = firstLoggedUserText(agent);
        if (logged !== undefined) return isTriggerText(logged);
        return isTriggerText(firstText(incoming[0]?.content));
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tongflow/src/activation.ts:98-120](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/src/activation.ts#L98-L120)

首消息决定后不因后来消息重复改变。

<details>
<summary>查看原文（23行）</summary>

```text
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
    });
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tongflow/src/tools.ts:114-151](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/src/tools.ts#L114-L151)

宿主能力通过中立ToolCall传入。

<details>
<summary>查看原文（38行）</summary>

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
                              backgroundJobSpec(
                                  jobs,
                                  exec.agent,
                                  workflow,
                                  record,
                              ),
                          ),
                      ),
              }
            : {}),
    };
```

</details>

**依据 4 · 源码核查**：[packages/tongflow-studio/src/tools/run-tools.ts:215-241](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/tongflow-studio/src/tools/run-tools.ts#L215-L241)

确认仅由调用参数决定，true直接进入startRun。

<details>
<summary>查看原文（27行）</summary>

```text
                user_confirmed: {
                    type: "boolean",
                    description:
                        "Set to true ONLY after the user explicitly agreed, in this conversation, to this run and its billing (the plugins / models listed in the needs_confirmation answer). Required whenever the workflow uses a paid plugin.",
                },
            },
            async execute(args, call) {
                const pid = await resolveProjectId(env, call, args.project);
                if (!args.user_confirmed) {
                    const paid = await api.paidPlugins(pid, args.workflow);
                    if (paid.length > 0) {
                        return compact({
                            ok: false,
                            needs_confirmation: true,
                            plugins: paid,
                            hint: "This run costs money. Tell the user which plugin(s) / model(s) will run and how they are billed (mention alternatives when there are any, and missing API keys), ask whether to go ahead, and only after they say yes call again with user_confirmed=true. Ask every time; do not assume a previous yes still holds.",
                        });
                    }
                }
                const record = await api.startRun({
                    projectId: pid,
                    workflowKey: args.workflow,
                    ...(args.inputs
                        ? { inputs: args.inputs as Record<string, unknown> }
                        : {}),
                    ...(args.note ? { note: args.note } : {}),
                });
```

</details>

**依据 5 · 源码核查**：[packages/tongflow-studio/src/api.ts:388-415](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/tongflow-studio/src/api.ts#L388-L415)

付费分类来自部署标识和必填环境变量。

<details>
<summary>查看原文（28行）</summary>

```text
    /** How a plugin is billed, from what the registry knows about it. */
    async pluginBilling(
        pluginId: string,
    ): Promise<{ billing: PluginBilling; note: string }> {
        const { registry, meta } = await this.studio.registry.get();
        const plugin = registry.plugins[pluginId] as
            | { needsDeploy?: boolean }
            | undefined;
        const env = meta[pluginId]?.env ?? [];
        if (plugin?.needsDeploy) {
            return {
                billing: "modal",
                note: "Runs on your Modal account: GPU time is billed per second while it runs (plus a cold start); the first run deploys the app, which can take minutes.",
            };
        }
        if (env.some((e) => e.required)) {
            return {
                billing: "api",
                note: `Calls a paid API with your own key (${env
                    .filter((e) => e.required)
                    .map((e) => e.key)
                    .join(", ")}); every run is billed by that provider.`,
            };
        }
        return {
            billing: "local",
            note: "Runs locally / free of charge as far as the studio knows.",
        };
```

</details>

#### 缺口

- 未见确认票据及费用额度绑定；是否由宿主外围实现另有约束未核实。
  **影响**：不能把逐次确认提示当成强制预算隔离。
  **进一步探讨**：比较用户拒绝后模型提交true、确认后修改工作流两种路径，核对是否拒绝执行。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 首次接入、持续制作和失败恢复各付出什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配peer范围的DSH、Node ≥22.19、Python ≥3.10 | 启动必需 | 宿主加载和SDK虚拟环境 | 不匹配版本可能拒载，本文未实测 |
| Git、PyPI及插件来源可达 | 首次准备必需 | 安装SDK和官方插件 | 准备失败需排查网络 |
| 模型密钥或Modal账户 | 相应生成必需 | 执行选定工作流 | 不能完成对应节点 |
| ffmpeg、视觉模型 | 特定审阅操作 | 视频联系表、图像检查 | 使用替代感知链路或人工审阅 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核对宿主范围后加载插件 | 可见Studio入口，加载失败先查版本 |
| 2 | 用户以@tongflow发起新会话并配置插件 | 工具与项目树出现，密钥不在聊天粘贴 |
| 3 | Agent保存并检查工作流，用户确认付费执行 | 保存编号产物并人工审阅 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | SDK和插件下载、磁盘 | Python/Git配置、密钥管理 | 耗时及安装成功率未测 |
| 持续使用 | 模型API或GPU、资产存储 | 逐轮确认和媒体复核 | 无合格任务单位成本 |
| 失败恢复 | 可能重复计费 | 查运行记录、确认已产出后再决定重跑 | 不覆盖编号输出不等于远端任务幂等 |
| 退出 | 保留本地文件 | 备份项目并禁用插件，按需撤销密钥 | 完整卸载未实测 |

普通项目文件有利于保留已有成果，但密钥写在studioRoot/env.json，0600权限只是本机文件限制，不是隔离外部插件代码。共享运行工具保留后台runId，因此用户应先查询运行状态，再决定是否重试，不能把一次超时当作未发生调用。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-tongflow/README.md:25-27](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/README.md#L25-L27)

作者列出宿主版本、首次自动下载及会话入口。

```text
Requirements: dsh ≥ 0.1.2-rc.1 — the 0.1.2-rc, 0.1.3-alpha, 0.1.5, 0.1.7, 0.2.0 and 0.2.1-alpha lines are supported (`engines.dsh`; verified releases are listed in `dsh.compatibility.dshReleases`); 0.1.1-rc and older are not (the client `Runtime` package they build on was removed upstream, so upgrade dsh rather than pinning an old plugin). Because npm only matches a prerelease when a range clause carries its exact `major.minor.patch`, each new dsh prerelease line needs its own clause in `peerDependencies`. From 0.2.0 on dsh checks those ranges itself and **does not load** a plugin whose `@deepseek-ai/dsh-*` peers exclude the running version (unless you grant `dsh plugin allow-version`), so a host on a line newer than the ones listed needs a newer plugin. Also Node ≥ 22.19, **Python ≥ 3.10** on `PATH` (or `pythonPath` in the plugin config), `git`, and `ffmpeg` for video contact sheets. On first use the plugin creates `~/.dsh/tongflow/venv` with the `tongflow` SDK and shallow-clones every official TongFlow plugin into `~/.dsh/tongflow/plugins` (the live list from `config/official-plugins.json`; set `autoInstallOfficial: false` to install by hand), so the canvas offers the same node/plugin catalog as the hosted app. Keys and Modal deploys are only needed when something runs.

Start a session whose **first message begins with `@tongflow`** — that session becomes a studio session: the conversation view turns into the Studio (chat column · the project's folder tree · preview / editor / canvas · a runs drawer, all in the UI language of your browser), and the agent gets the `tongflow_*` tools and skill. Any other session is untouched dsh. In the Studio: create a project (a title and a brief — what you want to make), install TongFlow plugins and paste API keys under **Plugins & keys**, then talk to the agent — or click any file to preview / edit it, click a workflow to open it on the canvas.
```

**依据 2 · 作者声明**：[packages/dsh-tongflow/README.md:98-105](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/README.md#L98-L105)

作者披露文件权限、明文密钥和子进程网络。

```text
## Permissions and external services

The plugin runs with the dsh process's permissions and needs all of these to work:

- **Files:** reads and writes project folders and `studioRoot` (`<DSH_HOME>/tongflow`: projects, venv, cloned plugins, run data). API keys pasted under **Plugins & keys** are stored in plain text in `studioRoot/env.json` (mode 0600) and handed to plugin processes as environment variables.
- **Commands:** `python` (creates the venv, `pip install`s the `tongflow` SDK and plugin requirements, runs plugin processes), `git` (shallow-clones plugins), `ffmpeg` (video contact sheets). A plugin process runs that plugin's own code.
- **Network:** GitHub (`raw.githubusercontent.com` for the official plugin list, `github.com/tong-io/*` clones), PyPI, and whatever service a plugin calls when a workflow runs — model APIs, or your own Modal account for GPU plugins. Paid runs ask the user first (see *Billing checkpoint*).
- **Runtime dependencies:** `tongflow` (the workflow core, same repo) and `@deepseek-ai/schemastery`.
```

**依据 3 · 源码核查**：[packages/tongflow-studio/src/tools/run-tools.ts:234-255](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/tongflow-studio/src/tools/run-tools.ts#L234-L255)

后台调用返回运行ID，用户可查询现有运行。

<details>
<summary>查看原文（22行）</summary>

```text
                const record = await api.startRun({
                    projectId: pid,
                    workflowKey: args.workflow,
                    ...(args.inputs
                        ? { inputs: args.inputs as Record<string, unknown> }
                        : {}),
                    ...(args.note ? { note: args.note } : {}),
                });
                if (args.run_in_background) {
                    const runId = record.summary.runId;
                    if (call.startBackground)
                        return compact({
                            kind: "background",
                            jobId: call.startBackground(args.workflow, record),
                            runId,
                            hint: "poll with job_output or wait for the completion notice; then tongflow_look the new file",
                        });
                    return compact({
                        kind: "background",
                        runId,
                        hint: `poll with tongflow_run_status({ runId: "${runId}" }) until it is no longer running; then tongflow_look the new file`,
                    });
```

</details>

#### 缺口

- 未测供应商失败或断连后的收费与重复执行行为。
  **影响**：不能确认重试会保留预算或复用远端结果。
  **进一步探讨**：对同一低价值任务记录远端任务ID和运行ID，故障后先对账再重试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些适配设计可复用，维护代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

中立 allTools(env) 转换成宿主 defineTool，将附件显示与后台jobs放入ToolCall，而不是把DSH类型散布到每个媒体工具。scope effect随着Agent释放，首消息决策用WeakSet防止重复注册，适用于仅部分会话启用的大工具组。

代价是宿主API兼容逻辑需维护。backgroundJobSpec按jobs是否暴露events区分两个接口，输出同时填result和output；模型模态查询异常默认接受图像，以免自动描述重复触发付费运行。这些是明确取舍，不足以证明所有预发布宿主都兼容。Studio初始化失败仅告警，工具后续是否能给出良好错误仍需运行检查。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tongflow/src/tools.ts:63-111](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/src/tools.ts#L63-L111)

后台任务适配兼容两个jobsAPI并转发取消。

<details>
<summary>查看原文（49行）</summary>

```text
/**
 * Background job spec for a workflow run, valid on both job APIs we support.
 * dsh >= 0.1.7 keys ownership by session id, passes a JobHandle to `run` for
 * streaming output, and returns the final value as `result`. dsh 0.1.5 took
 * the live Agent as owner, pulled `readOutput()`, and read `output`. The newer
 * registry is the one exposing `events` (0.1.5 had `onJobDone`).
 */
function backgroundJobSpec(
    jobs: JobRegistry,
    agent: ToolRunContext["agent"],
    workflow: string,
    record: RunRecord,
): JobSpec {
    const modern = "events" in jobs;
    const owner = agent ? { owner: modern ? agent.id : agent } : {};
    return {
        kind: "tongflow",
        label: `tongflow ${workflow}`,
        ...owner,
        run: (job?: JobHandle) => {
            let stop = () => {};
            if (job) {
                const append = (text: string) => {
                    if (text) job.append(`${text}\n`);
                };
                append(record.readOutput());
                stop = record.subscribe((event) => append(formatEvent(event)));
            }
            return {
                cancel: (reason?: string) => record.cancel(reason),
                done: record.done.then((r) => {
                    stop();
                    const final = JSON.stringify(runResult(r), null, 2);
                    return {
                        status:
                            r.summary.status === "completed"
                                ? ("completed" as const)
                                : r.summary.status === "cancelled"
                                  ? ("killed" as const)
                                  : ("failed" as const),
                        ...(r.error ? { detail: r.error } : {}),
                        result: final,
                        output: final,
                    };
                }),
                readOutput: () => record.readOutput(),
            };
        },
    } as JobSpec;
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tongflow/src/tools.ts:179-201](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/src/tools.ts#L179-L201)

共享工具经单一适配器注册，effect负责释放。

<details>
<summary>查看原文（23行）</summary>

```text
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
        const tool = dshTool(ctx, spec);
        ctx.effect(
            () => ctx.tools.register(tool),
            `dsh-tongflow: tool ${tool.name}`,
        );
    }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tongflow/src/tools.ts:45-60](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/src/tools.ts#L45-L60)

模型信息失败默认允许图像。

<details>
<summary>查看原文（16行）</summary>

```text
export async function modelTakesImages(
    ctx: Context,
    exec: ToolRunContext,
): Promise<boolean> {
    const llm = ctx.get("llm") as LlmRuntime | undefined;
    const { provider, model } = exec.agent?.options ?? {};
    if (!llm || !provider || !model) return true;
    try {
        const info = await llm.resolveModelInfo(provider, model, exec.signal);
        return (
            info.inputModalities === undefined ||
            info.inputModalities.includes("image")
        );
    } catch {
        return true;
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tongflow/src/index.ts:45-50](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/src/index.ts#L45-L50)

异步初始化错误仅记录日志。

```text
    const api = new StudioApi(studio);
    void studio.init().catch((error: unknown) => {
        ctx.logger?.warn?.(
            `dsh-tongflow: studio init failed: ${error instanceof Error ? error.message : String(error)}`,
        );
    });
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样让逐次付费确认更可靠，而不增加每节点确认？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把付费确认从可自由传入的布尔值改为一次性执行许可。许可绑定工作流内容摘要、所用插件与模型、输入和预算范围；由用户界面确认后签发，启动运行时原子消费。任一内容变更都要求重新确认，同时一次工作流内不再逐节点打扰用户。

推导来自Q02中确认提示完整但参数未绑定的差距。这是已有确认思路的强化，不能称为本插件已实现能力。最小对照包含当前布尔接口与许可接口，检查拒绝后直接传true、确认后换模型、同许可重放及正常取消。若强约束没有减少误执行，或常见编辑造成高频重复确认而抵消收益，应缩小绑定字段或停止方案。

#### 证据与依据

**依据 1 · 源码核查**：[packages/tongflow-studio/src/tools/run-tools.ts:215-241](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/tongflow-studio/src/tools/run-tools.ts#L215-L241)

当前确认参数与startRun之间没有票据校验。

<details>
<summary>查看原文（27行）</summary>

```text
                user_confirmed: {
                    type: "boolean",
                    description:
                        "Set to true ONLY after the user explicitly agreed, in this conversation, to this run and its billing (the plugins / models listed in the needs_confirmation answer). Required whenever the workflow uses a paid plugin.",
                },
            },
            async execute(args, call) {
                const pid = await resolveProjectId(env, call, args.project);
                if (!args.user_confirmed) {
                    const paid = await api.paidPlugins(pid, args.workflow);
                    if (paid.length > 0) {
                        return compact({
                            ok: false,
                            needs_confirmation: true,
                            plugins: paid,
                            hint: "This run costs money. Tell the user which plugin(s) / model(s) will run and how they are billed (mention alternatives when there are any, and missing API keys), ask whether to go ahead, and only after they say yes call again with user_confirmed=true. Ask every time; do not assume a previous yes still holds.",
                        });
                    }
                }
                const record = await api.startRun({
                    projectId: pid,
                    workflowKey: args.workflow,
                    ...(args.inputs
                        ? { inputs: args.inputs as Record<string, unknown> }
                        : {}),
                    ...(args.note ? { note: args.note } : {}),
                });
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁值得试用，什么条件下应退回简单工具？

**研究主题**：采用判断

#### 完整回答

建议有多轮媒体资产制作任务且熟悉DSH与Python环境的用户，在副本项目中先试一个工作流。比较同一资产从提示调整到人工验收所需时间、失败重跑费用和文件整理负担，而不是比较单次生成速度。

试用应限制所接插件和账户额度，保留人工确认与运行状态核对。若只做偶发图片、不能维护Python环境，或需要强预算授权而只有模型自报确认，则继续使用单一供应商界面或已有脚本。仅完成源码核查，不建议写成值得持续安装。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-tongflow/README.md:13-15](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/README.md#L13-L15)

作者描述资产工作流和共用画布。

```text
The studio itself is host-neutral — [`tongflow-studio`](../tongflow-studio) holds the projects, the engine runner and the `tongflow_*` tools, and serves the same tools as an MCP server (and a [Claude Code plugin](../../claude-plugin/tongflow)). This package is the dsh adapter: it adds the Studio panel and the embedded canvas.

There is deliberately no "generate an image" tool and no project template. The agent studies what the user wants to make (with web research when useful), proposes a folder structure, writes it down, and then — for every asset — creates a workflow file where that asset belongs, runs it, reviews the result, and builds the next stage on it. Users open the same `.tongflow.json` on the embedded canvas, tweak it, and re-run; they can also reorganize the folders by hand at any time.
```

**依据 2 · 作者声明**：[packages/dsh-tongflow/README.md:98-105](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/dsh-tongflow/README.md#L98-L105)

环境及权限负担明确。

```text
## Permissions and external services

The plugin runs with the dsh process's permissions and needs all of these to work:

- **Files:** reads and writes project folders and `studioRoot` (`<DSH_HOME>/tongflow`: projects, venv, cloned plugins, run data). API keys pasted under **Plugins & keys** are stored in plain text in `studioRoot/env.json` (mode 0600) and handed to plugin processes as environment variables.
- **Commands:** `python` (creates the venv, `pip install`s the `tongflow` SDK and plugin requirements, runs plugin processes), `git` (shallow-clones plugins), `ffmpeg` (video contact sheets). A plugin process runs that plugin's own code.
- **Network:** GitHub (`raw.githubusercontent.com` for the official plugin list, `github.com/tong-io/*` clones), PyPI, and whatever service a plugin calls when a workflow runs — model APIs, or your own Modal account for GPU plugins. Paid runs ask the user first (see *Billing checkpoint*).
- **Runtime dependencies:** `tongflow` (the workflow core, same repo) and `@deepseek-ai/schemastery`.
```

**依据 3 · 源码核查**：[packages/tongflow-studio/src/tools/run-tools.ts:215-241](https://github.com/tong-io/tongflow/blob/0087122f5900073dfbdb0e7a1e2ff497245e1f21/packages/tongflow-studio/src/tools/run-tools.ts#L215-L241)

确认约束不足影响试用范围。

<details>
<summary>查看原文（27行）</summary>

```text
                user_confirmed: {
                    type: "boolean",
                    description:
                        "Set to true ONLY after the user explicitly agreed, in this conversation, to this run and its billing (the plugins / models listed in the needs_confirmation answer). Required whenever the workflow uses a paid plugin.",
                },
            },
            async execute(args, call) {
                const pid = await resolveProjectId(env, call, args.project);
                if (!args.user_confirmed) {
                    const paid = await api.paidPlugins(pid, args.workflow);
                    if (paid.length > 0) {
                        return compact({
                            ok: false,
                            needs_confirmation: true,
                            plugins: paid,
                            hint: "This run costs money. Tell the user which plugin(s) / model(s) will run and how they are billed (mention alternatives when there are any, and missing API keys), ask whether to go ahead, and only after they say yes call again with user_confirmed=true. Ask every time; do not assume a previous yes still holds.",
                        });
                    }
                }
                const record = await api.startRun({
                    projectId: pid,
                    workflowKey: args.workflow,
                    ...(args.inputs
                        ? { inputs: args.inputs as Record<string, unknown> }
                        : {}),
                    ...(args.note ? { note: args.note } : {}),
                });
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
