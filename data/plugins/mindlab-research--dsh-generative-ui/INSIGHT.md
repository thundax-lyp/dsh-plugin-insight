# DSH Generative UI

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[ed2db0a](https://github.com/MindLab-Research/dsh-generative-ui/tree/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51)

<!-- BEGIN META -->
[![GitHub ★ 137](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=137&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MindLab-Research/dsh-generative-ui) [![npm 30d 1,951](https://img.shields.io/static/v1?label=npm+30d&message=1%2C951&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-generative-ui) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-generative-ui)
<!-- END META -->

> **功能**：让回复中的 TSX 成为内联交互界面或持续画布

> **亮点**：[Q01](#research-q01) 提供可直接操作和跨轮保留的界面。

> **主要限制**：[Q03](#research-q03) 命令桥默认开启，但还要 webServer、shell 与 sandboxPolicy，关闭 allowExec 或缺服务时路由不挂载。已挂载时执行采用会话沙箱且没有逐命令审批。文件桥依赖 fs 与 sandboxPolicy，拒绝不在活动工作区清单的 cwd，拒绝码与文件不存在要区分。模型桥依赖 llm 与 agentDefaultModel，拒绝不在活动清单的 cwd，并通过宿主选中模型处理卡片 prompt。浏览器依赖加载、文件访问、命令执行和模型调用应分别检查。

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
  - [Q01 · 用户可得到什么可复用的交付物？](#detail-section-11)
  - [Q02 · 如何运行？](#detail-section-12)
  - [Q03 · 生成界面能动用哪些宿主能力？](#detail-section-13)
  - [Q04 · 如何采用、控制成本并退出？](#detail-section-14)
  - [Q05 · 什么结果支持或否定交互收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户需多次调整计算参数。

每次把新参数写进对话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 每次把新参数写进对话。 | 可直接比较 | 保留人工步骤 |
| DSH Generative UI | 提供可直接操作和跨轮保留的界面。 | 浏览器依赖与宿主桥接需分层核对。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | TSX 经客户端编译进入内联或 Canvas，宿主桥接可选能力。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户需多次调整计算参数。 | 保留原流程 |
| 试验 | TSX 经客户端编译进入内联或 Canvas，宿主桥接可选能力。 | 观察固定版本 |
| 复核 | 隔离工作区关闭命令运行，比较准确率与加载失败。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | TSX 运行时下载与 CDN 冷启动成本未知 | profile 配置和权限核对耗时未知 | 按宿主和网络记录 |
| 持续 | 依赖请求、桥接模型用量和重试成本未知 | 修卡和维护耗时未知 | 按任务分别计时 |
| 恢复 | 导出与保留文件成本未知 | 解绑 profile、恢复原流程及核对留存耗时未知 | 先备份 Canvas，再检查路由和文件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 用可编辑计算器替代多轮参数问答 | 交互面板可减少重新询问参数的轮数。 | 隔离工作区关闭命令运行，比较准确率与加载失败。 |

> **思考**：[Q03](#research-q03) 命令桥默认开启，但还要 webServer、shell 与 sandboxPolicy，关闭 allowExec 或缺服务时路由不挂载。已挂载时执行采用会话沙箱且没有逐命令审批。文件桥依赖 fs 与 sandboxPolicy，拒绝不在活动工作区清单的 cwd，拒绝码与文件不存在要区分。模型桥依赖 llm 与 agentDefaultModel，拒绝不在活动清单的 cwd，并通过宿主选中模型处理卡片 prompt。浏览器依赖加载、文件访问、命令执行和模型调用应分别检查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供可直接操作和跨轮保留的界面。

宿主按服务注册路由，客户端具备编译与导入回退。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 命令桥默认开启，但还要 webServer、shell 与 sandboxPolicy，关闭 allowExec 或缺服务时路由不挂载。已挂载时执行采用会话沙箱且没有逐命令审批。文件桥依赖 fs 与 sandboxPolicy，拒绝不在活动工作区清单的 cwd，拒绝码与文件不存在要区分。模型桥依赖 llm 与 agentDefaultModel，拒绝不在活动清单的 cwd，并通过宿主选中模型处理卡片 prompt。浏览器依赖加载、文件访问、命令执行和模型调用应分别检查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 以隔离 Web profile 装固定版本，首先试不导入外部依赖的纯 React 计算卡。采用前关闭默认开启的 allowExec，确认配置切换会重建相应 fiber。若 profile 缺文件或模型服务，相应桥接路由不会注册，内联与 Canvas 路由可独立存在。记录首屏和 CDN 开销、桥接模型请求与人工修卡时间。退出时先保存仍有用的 Canvas 源文件和结果，再移除隔离 profile 的 bundle，核对原会话能打开、桥接路由不可用，并单独检查文件和缓存留存。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的用可编辑计算器替代多轮参数问答。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/runtime/compiler.ts、src/index.ts、src/client/runtime/GenUISurface.tsx、src/client/index.ts、src/client/runtime/inline-fence.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的用可编辑计算器替代多轮参数问答。未执行目标代码或实际宿主验证。
- 下一步：[Q05](#research-q05) 固定同一计算任务、模型、宿主和三组输入，对比纯文本、内联无 npm 依赖、带 npm 依赖的 Canvas 三组。断言每组输出与参考公式一致，统计首次可操作时长、额外模型轮数、失败与恢复时间。故障组分别让 bundled 构建失败但普通构建可用，以及阻断 esm.sh 两类请求。代码会更新 URL 绕过失败缓存，后续尝试切换为非 bundle 构建并保留视觉状态，是否真的恢复要看操作与网络记录。若数值错误、重试后仍卡死、重新打开丢失关键操作能力，或额外开销超过减少的问答时间，当前配置的采用假设不成立。

**分析版本**

- **仓库**：[MindLab-Research/dsh-generative-ui](https://github.com/MindLab-Research/dsh-generative-ui)
- **版本号**：0.2.0（[固定提交 ed2db0a](https://github.com/MindLab-Research/dsh-generative-ui/tree/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 交互面板可减少重新询问参数的轮数。

[Q05](#research-q05) 固定同一计算任务、模型、宿主和三组输入，对比纯文本、内联无 npm 依赖、带 npm 依赖的 Canvas 三组。断言每组输出与参考公式一致，统计首次可操作时长、额外模型轮数、失败与恢复时间。故障组分别让 bundled 构建失败但普通构建可用，以及阻断 esm.sh 两类请求。代码会更新 URL 绕过失败缓存，后续尝试切换为非 bundle 构建并保留视觉状态，是否真的恢复要看操作与网络记录。若数值错误、重试后仍卡死、重新打开丢失关键操作能力，或额外开销超过减少的问答时间，当前配置的采用假设不成立。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 15016 | — | — | 195582 |
| .ts | source | 57 | 8252 | 4124 | 3726 | — |
| .mjs | source | 15 | 1929 | 1453 | 387 | — |
| .tsx | source | 13 | 2054 | 1516 | 445 | — |
| .ts | test | 70 | 8637 | 5742 | 2272 | — |
| .tsx | test | 59 | 3546 | 3019 | 311 | — |
| .md | test | 3 | 209 | — | — | 2283 |
| .tsx | example | 7 | 1240 | 1159 | 7 | — |
| .ts | example | 1 | 116 | 95 | 6 | — |
| .md | example | 1 | 12 | — | — | 124 |
| .js | source | 6 | 69 | 58 | 11 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/MindLab-Research/dsh-generative-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=14&color=737b86&logo=github)](https://github.com/MindLab-Research/dsh-generative-ui/issues?q=is%3Aissue+created%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/MindLab-Research/dsh-generative-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用可编辑计算器替代多轮参数问答

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户可得到什么可复用的交付物？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对于反复换参数的本地计算，现有流程每次重发输入并等待模型回答。内联适合一次性说明，Canvas 适合第二轮仍要打开的工具。客户端注册 Canvas 标签页并接管内联围栏，源材料支撑这两条可独立检查的接入路径。最小交付应能在不请求模型的情况下连续改三组参数，结果逐项匹配参考公式。Canvas 应能在继续对话后从同一会话重新打开。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:6-15](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/README.md#L6-L15)

作者描述内联、Canvas 与 npm 导入

<details>
<summary>查看原文（10行）</summary>

`````text
Generative UI for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): the agent answers with a live React interface instead of prose. It streams — the component renders while the model is still typing it.

Two places it shows up:

- **Inline** — a fenced ```` ```ui4a/tsx ```` block renders in place, between the paragraphs of the reply. Right for a chart, a form, a set of options to click, a calculation the reader will want to change a number in.
- **Canvas** — a file at `ui4a/canvases/<id>.ui4a.tsx` opens in a panel beside the conversation and stays there across turns. Right for a tool the user will come back to.

Generated code imports anything on npm (resolved from esm.sh at render time), shares the host's single React instance, and takes its colours from the app's own design tokens, so it follows the light/dark theme.

The `ui4a` in that fence is the harness this implements — **UI for Agent**, from Mind Lab: rather than coaxing an agent into a fixed UI schema, let it write ordinary frontend code and have the runtime enforce the boundaries. The reasoning, and the benchmarks behind it, are in [UI4A: A Component-Native Harness for Generative UI](https://www.mindlab.im/updates/ui4a-a-component-native-harness-for-generative-ui). This package is that harness wired into dsh's web client.
`````

</details>

**依据 2 · 源码核查**：[src/client/index.ts:218-226](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/client/index.ts#L218-L226)

注册 Canvas 标签页与浏览器

```text
    const cwdOf = (id: string) => {
      const byId = (scoped.sessions as unknown as ISessions).list.getSnapshot().byId as Record<string, { cwd?: string } | undefined>;
      return byId[id]?.cwd;
    };
    // Order matters: `openResource` throws on an address no type claims, so the type has to be
    // registered before anything can try to open one.
    scoped.effect(() => scoped.locale.register(NS, { zh, en }), "dsh-generative-ui: canvas copy");
    scoped.effect(() => scoped.sidebarRightTabs.register(canvasTabDefinition), "dsh-generative-ui: canvas tab type");
    scoped.effect(() => scoped.sidebarRightTabs.register(canvasBrowserDefinition(scoped.locale.bind(NS))), "dsh-generative-ui: canvas browser type");
```

**依据 3 · 源码核查**：[src/client/runtime/inline-fence.ts:198-210](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/client/runtime/inline-fence.ts#L198-L210)

客户端接管内联围栏

<details>
<summary>查看原文（13行）</summary>

```text
export function claimInlineFences({ segments, fences, render, t, subscribeLocale, owner, subscribeOwner, scope }: InlineFenceOptions): () => void {
  const claims = new Map<HTMLElement, Claim>();
  const root = scope ?? document.body;

  // Blocks parked until they come near the viewport. Kept so the disposer can stop observing
  // them, and so `sweep` does not re-observe one it is already watching.
  const parked = new Set<HTMLElement>();
  // Blocks the observer has woken. Kept separately because waking does NOT move the block: the
  // observer fires on entering the margin, while `getBoundingClientRect` still reads whatever
  // the layout says, so re-measuring in the sweep that the wake triggered parks it straight back
  // and the card never renders. Membership here is the permission; the sweep clears it.
  const woken = new Set<HTMLElement>();
  const nearby: IntersectionObserver | null =
```

</details>

#### 缺口

- 刷新和跨轮时的保留范围尚未实测
  **影响**：成功渲染与可复用是两个验收项
  **进一步探讨**：分别验收连续改值、继续对话和重新打开

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何运行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端编译 TSX，Canvas 通过路由读取。宿主按依赖注册文件、命令和模型能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/runtime/compiler.ts:60-80](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/client/runtime/compiler.ts#L60-L80)

客户端 TSX 编译入口

<details>
<summary>查看原文（21行）</summary>

```text

export function createBrowserTsxCompiler(): TsxCompiler {
  return {
    async compile(code, options = {}) {
      await initCompiler();
      const importMap = options.importMap;
      const build = (source: string): CompileResult => {
        const resolved = importMap?.imports ? rewriteImportMetaResolveSpecifiers(source, importMap.imports) : source;
        const result = transformTsx({ filename: options.filename ?? "_.tsx", code: resolved, target: "es2022", importMap, jsxImportSource: "react" });
        const compiled = new TextDecoder().decode(result.code);
        return { code: compiled, source, changed: compiled !== options.previousCode };
      };

      // Normalization runs for `final` too. The model does not reliably close its trailing
      // `)` and `}` before writing the fence, so compiling the raw source renders every
      // streaming frame fine and then throws `Expected ',', got '<eof>'` at the very moment
      // the block completes — measured on exactly that shape.
      if (options.partial === true) return build(normalizeGeneratedTsxCompat(code, { mode: "streaming" }));
      try {
        return build(normalizeGeneratedTsxCompat(code, { mode: "final" }));
      } catch (error) {
```

</details>

**依据 2 · 源码核查**：[src/index.ts:708-733](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/index.ts#L708-L733)

按服务注册画布、文件、命令及模型路由

<details>
<summary>查看原文（26行）</summary>

```text
    scoped.effect(() => scoped.webServer.register({ kind: "exact", path: CANVAS_READ_PATH, handler: (req, res) => serveCanvas(liveWorkspaces, req, res) }), "dsh-generative-ui: canvas reads");
    // Beside the canvas route rather than under `fs`/`shell`/`llm`: reporting a broken card needs
    // nothing but a web server, and it is worth the least on the compositions that have the most
    // missing — a card whose capability module is absent is exactly the card that fails.
    scoped.effect(() => scoped.webServer.register({ kind: "exact", path: CARD_ERROR_PATH, handler: (req, res) => serveCardError(failures, () => wake, req, res) }), "dsh-generative-ui: card failures");
    // One level deeper again: a deployment can mount a web server without an LLM runtime, and
    // losing `$dsh/ai` there should not take the wasm and canvas routes down with it.
    // Same shape again: a deployment can serve the web without a sandboxed filesystem, and
    // losing `$dsh/fs` there should not cost the routes above it.
    scoped.inject(["fs", "sandboxPolicy"], (withFs) => {
      withFs.effect(() => withFs.webServer.register({ kind: "exact", path: FS_PATH, handler: (req, res) => serveFs(withFs as unknown as FsCtx, liveWorkspaces, req, res) }), "dsh-generative-ui: workspace files");
    });
    // And again for the shell: a host may compose a web server without a command executor — and
    // now also a host that has one but has not opted in. Both mean the same thing to a card, and
    // both are expressed the same way: no route.
    if (allowExec)
      scoped.inject(["shell", "sandboxPolicy"], (withShell) => {
        withShell.effect(() => withShell.webServer.register({ kind: "exact", path: EXEC_PATH, handler: (req, res) => serveExec(withShell as unknown as ExecCtx, liveWorkspaces, req, res) }), "dsh-generative-ui: commands");
      });
    // Same nesting as the rest: a host with no web capability loses `$dsh/web` and keeps
    // everything else. `dsh-base` composes `ctx.web` with `searchProvider: deepseek-official`.
    scoped.inject(["web"], (withWeb) => {
      withWeb.effect(() => withWeb.webServer.register({ kind: "exact", path: WEB_SEARCH_PATH, handler: (req, res) => serveWebSearch(withWeb as unknown as WebCtx, liveWorkspaces, req, res) }), "dsh-generative-ui: web search");
    });
    scoped.inject(["llm", "agentDefaultModel"], (withLlm) => {
      withLlm.effect(() => withLlm.webServer.register({ kind: "exact", path: AI_STREAM_PATH, handler: (req, res) => serveAi(withLlm as unknown as LlmCtx, liveWorkspaces, req, res) }), "dsh-generative-ui: model stream");
```

</details>

#### 缺口

- 宿主组合决定 API 可用性。
  **影响**：页面能成为可操作交付物。
  **进一步探讨**：先核对只渲染方案。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 生成界面能动用哪些宿主能力？

**研究主题**：缺陷与关键质疑

#### 完整回答

命令桥默认开启，但还要 webServer、shell 与 sandboxPolicy，关闭 allowExec 或缺服务时路由不挂载。已挂载时执行采用会话沙箱且没有逐命令审批。文件桥依赖 fs 与 sandboxPolicy，拒绝不在活动工作区清单的 cwd，拒绝码与文件不存在要区分。模型桥依赖 llm 与 agentDefaultModel，拒绝不在活动清单的 cwd，并通过宿主选中模型处理卡片 prompt。浏览器依赖加载、文件访问、命令执行和模型调用应分别检查。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:74-96](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/index.ts#L74-L96)

命令审批与沙箱的边界

<details>
<summary>查看原文（23行）</summary>

```text
 * What it is NOT: an escape from the fence. The route resolves `ctx.sandboxPolicy` for the session
 * and hands it to `ctx.shell`, so a card's command opens nothing the agent's own bash has not
 * already opened, in a workdir pinned to a live session's workspace, killed after 15s and on the
 * reader closing the page.
 *
 * What it IS: the approval layer does not reach here. `approval.request()` needs an open turn and
 * an agent, and a card fires on a reader's keystroke long after its turn ended — so the per-command
 * fence is the sandbox policy alone. Under `workspace-write` a card can therefore delete inside the
 * workspace with nobody agreeing to it command by command. The prompt answers that where it can
 * ("observe, never change"; anything destructive belongs in a `sendMessage` the user agrees to),
 * which is guidance, not a fence.
 *
 * Turned on because the capability it gates is the ordinary case, not the exotic one: search
 * (`fd`, `rg`) that no `$dsh/fs` call expresses, `lint` / `check` / test runs whose output IS the
 * card, `git log`, and the twenty-`readdir` walks a single `ls -R` replaces. Off, a model reasoning
 * from a five-capability set writes those as file-by-file loops or does not write the card at all.
 */
export const Config = z.object({
  allowExec: z
    .boolean()
    .default(true)
    .description("Let generated cards run shell commands through `$dsh/exec`, under this session's own sandbox mode. Cards use it to search (`rg`, `fd`), run `lint`/`check`, and read `git`. The sandbox still applies; what does not is the per-command approval prompt, so turn this off for a session where that matters."),
});
```

</details>

**依据 2 · 源码核查**：[src/index.ts:400-411](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/index.ts#L400-L411)

执行规格带会话沙箱

<details>
<summary>查看原文（12行）</summary>

```text
    // Do not start a command for it; no await separates this check from listener registration.
    if (res.destroyed) return;
    const controller = new AbortController();
    // A completed request body is not a closed response socket.
    res.on("close", () => {
      if (!res.writableEnded) controller.abort();
    });
    const spec = ctx.shell.resolve({ command, workdir: cwd, timeoutMs: EXEC_TIMEOUT_MS, onExpiry: "kill", sandboxPolicy: ctx.sandboxPolicy.resolve({ session }), signal: controller.signal });
    const result = "execute" in ctx.shell ? await (await ctx.shell.execute(spec)).result() : await ctx.shell.run(spec);
    return json(200, {
      stdout: result.stdout.text,
      stderr: result.stderr.text,
```

</details>

**依据 3 · 作者声明**：[README.md:10-15](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/README.md#L10-L15)

作者说明第三方模块动态解析

`````text
- **Inline** — a fenced ```` ```ui4a/tsx ```` block renders in place, between the paragraphs of the reply. Right for a chart, a form, a set of options to click, a calculation the reader will want to change a number in.
- **Canvas** — a file at `ui4a/canvases/<id>.ui4a.tsx` opens in a panel beside the conversation and stays there across turns. Right for a tool the user will come back to.

Generated code imports anything on npm (resolved from esm.sh at render time), shares the host's single React instance, and takes its colours from the app's own design tokens, so it follows the light/dark theme.

The `ui4a` in that fence is the harness this implements — **UI for Agent**, from Mind Lab: rather than coaxing an agent into a fixed UI schema, let it write ordinary frontend code and have the runtime enforce the boundaries. The reasoning, and the benchmarks behind it, are in [UI4A: A Component-Native Harness for Generative UI](https://www.mindlab.im/updates/ui4a-a-component-native-harness-for-generative-ui). This package is that harness wired into dsh's web client.
`````

**依据 4 · 源码核查**：[src/index.ts:717-734](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/index.ts#L717-L734)

各路由独立依赖服务注册

<details>
<summary>查看原文（18行）</summary>

```text
    scoped.inject(["fs", "sandboxPolicy"], (withFs) => {
      withFs.effect(() => withFs.webServer.register({ kind: "exact", path: FS_PATH, handler: (req, res) => serveFs(withFs as unknown as FsCtx, liveWorkspaces, req, res) }), "dsh-generative-ui: workspace files");
    });
    // And again for the shell: a host may compose a web server without a command executor — and
    // now also a host that has one but has not opted in. Both mean the same thing to a card, and
    // both are expressed the same way: no route.
    if (allowExec)
      scoped.inject(["shell", "sandboxPolicy"], (withShell) => {
        withShell.effect(() => withShell.webServer.register({ kind: "exact", path: EXEC_PATH, handler: (req, res) => serveExec(withShell as unknown as ExecCtx, liveWorkspaces, req, res) }), "dsh-generative-ui: commands");
      });
    // Same nesting as the rest: a host with no web capability loses `$dsh/web` and keeps
    // everything else. `dsh-base` composes `ctx.web` with `searchProvider: deepseek-official`.
    scoped.inject(["web"], (withWeb) => {
      withWeb.effect(() => withWeb.webServer.register({ kind: "exact", path: WEB_SEARCH_PATH, handler: (req, res) => serveWebSearch(withWeb as unknown as WebCtx, liveWorkspaces, req, res) }), "dsh-generative-ui: web search");
    });
    scoped.inject(["llm", "agentDefaultModel"], (withLlm) => {
      withLlm.effect(() => withLlm.webServer.register({ kind: "exact", path: AI_STREAM_PATH, handler: (req, res) => serveAi(withLlm as unknown as LlmCtx, liveWorkspaces, req, res) }), "dsh-generative-ui: model stream");
    });
```

</details>

**依据 5 · 源码核查**：[src/index.ts:265-284](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/index.ts#L265-L284)

文件拒绝与错误码

<details>
<summary>查看原文（20行）</summary>

```text
  const cwd = url.searchParams.get("cwd");
  const path = url.searchParams.get("path");
  if (cwd === null || path === null || path === "") return void res.writeHead(400).end();
  if (!liveWorkspaces().has(cwd)) return void res.writeHead(403).end();
  // Before ANY read as well as before a write. `cwd` selects the allowlist entry and `session`
  // selects the policy; left independent, a GET with someone else's workspace reads it and a POST
  // writes it under another session's access mode. Reads carry `session` too.
  const sessionId = url.searchParams.get("session");
  const session = sessionId === null ? undefined : ctx.sessions.list().find((entry) => entry.id === sessionId);
  if (session === undefined || session.header.cwd !== cwd) return void res.writeHead(400).end();

  const json = (status: number, body: unknown): void => {
    res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    res.end(JSON.stringify(body));
  };
  // A denial is an answer, not a crash: the card needs to tell "you may not" from "it broke".
  const failed = (error: unknown): void => {
    const code = (error as { code?: string } | undefined)?.code;
    json(code === "FS_SANDBOX_DENIED" ? 403 : 404, { error: code ?? (error instanceof Error ? error.message : String(error)) });
  };
```

</details>

**依据 6 · 源码核查**：[src/index.ts:514-541](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/index.ts#L514-L541)

模型路由校验和模型选择

<details>
<summary>查看原文（28行）</summary>

```text
export async function serveAi(ctx: LlmCtx, liveWorkspaces: () => ReadonlySet<string>, req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== "POST") return void res.writeHead(405).end();
  const url = new URL(req.url ?? "/", "http://x");
  const cwd = url.searchParams.get("cwd");
  if (cwd === null) return void res.writeHead(400).end();
  if (!liveWorkspaces().has(cwd)) return void res.writeHead(403).end();

  let body = "";
  for await (const chunk of req) {
    body += chunk as string;
    if (body.length > MAX_BODY) return void res.writeHead(413).end();
  }

  let request: { prompt?: string; system?: string };
  try {
    request = JSON.parse(body) as typeof request;
  } catch {
    return void res.writeHead(400).end();
  }
  if (request.prompt === undefined || request.prompt === "") return void res.writeHead(400).end();
  // One user turn, deliberately: `llm.stream` will not take a bare `{role, content}` — a
  // message carries an identity and a source tag — and the assistant-side constructor wants
  // provider, model and replay state, which means a multi-turn API here would be forging
  // turns the model never produced. Anything a card needs from an earlier turn belongs in
  // the prompt it builds.
  const messages = [createUserMessage({ content: [{ type: "text", text: request.prompt }], source: { kind: "dsh-generative-ui" } })];

  const selection = ctx.agentDefaultModel.currentSelection();
```

</details>

#### 缺口

- 未运行宿主验证路径隔离
  **影响**：已挂载与未挂载的失败行为不同
  **进一步探讨**：分别禁用或移除对应能力并记录状态与副作用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何采用、控制成本并退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

以隔离 Web profile 装固定版本，首先试不导入外部依赖的纯 React 计算卡。采用前关闭默认开启的 allowExec，确认配置切换会重建相应 fiber。若 profile 缺文件或模型服务，相应桥接路由不会注册，内联与 Canvas 路由可独立存在。记录首屏和 CDN 开销、桥接模型请求与人工修卡时间。退出时先保存仍有用的 Canvas 源文件和结果，再移除隔离 profile 的 bundle，核对原会话能打开、桥接路由不可用，并单独检查文件和缓存留存。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-33](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/README.md#L17-L33)

安装和本地构建由作者说明

<details>
<summary>查看原文（17行）</summary>

````text
## Install

```sh
dsh plugin --profile web add dsh-generative-ui
```

Published npm releases carry provenance. To try an unreleased commit while preview publishing
is unavailable for the transferred repository, point the profile at a local checkout — `lib/` is
built by `prepare`, so the profile does not care that this package uses bun and dsh uses pnpm:

```sh
dsh plugin --profile web add link:/path/to/dsh-generative-ui
```

`dsh plugin` forwards to the profile's package manager, so any of these installs the package —
and adds it to `~/.dsh/profiles/web/package.json`'s `dsh.profile.bundles`, which is the list dsh
actually boots. Verified on a clean machine, the bundle list reads:
````

</details>

**依据 2 · 源码核查**：[src/index.ts:572-602](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/index.ts#L572-L602)

配置切换会重建插件 fiber

<details>
<summary>查看原文（31行）</summary>

```text
// `= Config({})` rather than a bare default: schemastery fills every declared default, so an
// omitted config is the same object the host would have built, and `allowExec` is true there.
// A host that calls `apply(ctx)` is not a hypothetical — the existing profile tests do.
export function apply(ctx: Context, config: Config = Config({})): void {
  // `current()` rather than a captured boolean: the section is live, and a user who turns
  // commands off in the settings UI means it now, not at the next restart.
  let current = () => config;
  // The prompt text and the exec route are both DECIDED at registration time, so a live setting
  // needs somewhere to re-decide them. A cordis scope is that somewhere: everything below hangs
  // off `configured`, and `onChange` disposes and rebuilds it, which re-registers the section
  // with the new text and adds or removes the route. Reading `current()` inside the effects
  // without this would change the value and leave the registrations as they were.
  // The mounted value rides ON the handle rather than in a second variable: the two would have to
  // be assigned in lockstep by hand, and an early return added between them later would desync the
  // dedup from what is actually mounted.
  let configured: { allowExec: boolean; fiber: { dispose: () => Promise<void> } } | null = null;
  const rebuild = () => {
    const value = current().allowExec;
    const allowExec = (typeof value === "boolean" ? value : value?.get()) === true;
    // `onChange` fires on every write to the section, and the section may grow other keys later.
    // Rebuilding on a value that did not move would tear down the prompt and both routes for
    // nothing — visible to a reader as a card losing its host mid-conversation.
    if (configured?.allowExec === allowExec) return;
    void configured?.fiber.dispose();
    configured = { allowExec, fiber: ctx.plugin({ name: "dsh-generative-ui:configured", apply: (scoped: Context) => applyWith(scoped, allowExec) }) };
  };
  // 无 settings 服务时下面的 inject 不执行，必须先用 entry 配置挂载；rebuild 内的值比较避免重复挂载。
  rebuild();
  // Profile edits update the reference before this owner-scoped event is emitted.
  // Legacy plain-boolean hosts keep their existing installSection callback below.
  if (typeof config.allowExec !== "boolean") ctx.on("loader/volatile-update", rebuild);
```

</details>

**依据 3 · 源码核查**：[src/index.ts:707-734](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/index.ts#L707-L734)

按服务分离渲染、文件、执行和模型路由

<details>
<summary>查看原文（28行）</summary>

```text
    scoped.effect(() => scoped.webServer.register({ kind: "prefix", path: ASSET_PREFIX, handler: (req, res) => serveAsset(req, res, file) }), "dsh-generative-ui: tsx wasm");
    scoped.effect(() => scoped.webServer.register({ kind: "exact", path: CANVAS_READ_PATH, handler: (req, res) => serveCanvas(liveWorkspaces, req, res) }), "dsh-generative-ui: canvas reads");
    // Beside the canvas route rather than under `fs`/`shell`/`llm`: reporting a broken card needs
    // nothing but a web server, and it is worth the least on the compositions that have the most
    // missing — a card whose capability module is absent is exactly the card that fails.
    scoped.effect(() => scoped.webServer.register({ kind: "exact", path: CARD_ERROR_PATH, handler: (req, res) => serveCardError(failures, () => wake, req, res) }), "dsh-generative-ui: card failures");
    // One level deeper again: a deployment can mount a web server without an LLM runtime, and
    // losing `$dsh/ai` there should not take the wasm and canvas routes down with it.
    // Same shape again: a deployment can serve the web without a sandboxed filesystem, and
    // losing `$dsh/fs` there should not cost the routes above it.
    scoped.inject(["fs", "sandboxPolicy"], (withFs) => {
      withFs.effect(() => withFs.webServer.register({ kind: "exact", path: FS_PATH, handler: (req, res) => serveFs(withFs as unknown as FsCtx, liveWorkspaces, req, res) }), "dsh-generative-ui: workspace files");
    });
    // And again for the shell: a host may compose a web server without a command executor — and
    // now also a host that has one but has not opted in. Both mean the same thing to a card, and
    // both are expressed the same way: no route.
    if (allowExec)
      scoped.inject(["shell", "sandboxPolicy"], (withShell) => {
        withShell.effect(() => withShell.webServer.register({ kind: "exact", path: EXEC_PATH, handler: (req, res) => serveExec(withShell as unknown as ExecCtx, liveWorkspaces, req, res) }), "dsh-generative-ui: commands");
      });
    // Same nesting as the rest: a host with no web capability loses `$dsh/web` and keeps
    // everything else. `dsh-base` composes `ctx.web` with `searchProvider: deepseek-official`.
    scoped.inject(["web"], (withWeb) => {
      withWeb.effect(() => withWeb.webServer.register({ kind: "exact", path: WEB_SEARCH_PATH, handler: (req, res) => serveWebSearch(withWeb as unknown as WebCtx, liveWorkspaces, req, res) }), "dsh-generative-ui: web search");
    });
    scoped.inject(["llm", "agentDefaultModel"], (withLlm) => {
      withLlm.effect(() => withLlm.webServer.register({ kind: "exact", path: AI_STREAM_PATH, handler: (req, res) => serveAi(withLlm as unknown as LlmCtx, liveWorkspaces, req, res) }), "dsh-generative-ui: model stream");
    });
```

</details>

#### 缺口

- 卸载留存和冷启动开销未知
  **影响**：决定退出是否可逆及是否适合低带宽
  **进一步探讨**：对比安装前、启用后、停用后三个状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么结果支持或否定交互收益？

**研究主题**：新假设与验证

#### 完整回答

固定同一计算任务、模型、宿主和三组输入，对比纯文本、内联无 npm 依赖、带 npm 依赖的 Canvas 三组。断言每组输出与参考公式一致，统计首次可操作时长、额外模型轮数、失败与恢复时间。故障组分别让 bundled 构建失败但普通构建可用，以及阻断 esm.sh 两类请求。代码会更新 URL 绕过失败缓存，后续尝试切换为非 bundle 构建并保留视觉状态，是否真的恢复要看操作与网络记录。若数值错误、重试后仍卡死、重新打开丢失关键操作能力，或额外开销超过减少的问答时间，当前配置的采用假设不成立。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:6-15](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/README.md#L6-L15)

作者主张流式渲染和持续画布

<details>
<summary>查看原文（10行）</summary>

`````text
Generative UI for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness): the agent answers with a live React interface instead of prose. It streams — the component renders while the model is still typing it.

Two places it shows up:

- **Inline** — a fenced ```` ```ui4a/tsx ```` block renders in place, between the paragraphs of the reply. Right for a chart, a form, a set of options to click, a calculation the reader will want to change a number in.
- **Canvas** — a file at `ui4a/canvases/<id>.ui4a.tsx` opens in a panel beside the conversation and stays there across turns. Right for a tool the user will come back to.

Generated code imports anything on npm (resolved from esm.sh at render time), shares the host's single React instance, and takes its colours from the app's own design tokens, so it follows the light/dark theme.

The `ui4a` in that fence is the harness this implements — **UI for Agent**, from Mind Lab: rather than coaxing an agent into a fixed UI schema, let it write ordinary frontend code and have the runtime enforce the boundaries. The reasoning, and the benchmarks behind it, are in [UI4A: A Component-Native Harness for Generative UI](https://www.mindlab.im/updates/ui4a-a-component-native-harness-for-generative-ui). This package is that harness wired into dsh's web client.
`````

</details>

**依据 2 · 源码核查**：[src/client/runtime/GenUISurface.tsx:257-277](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/client/runtime/GenUISurface.tsx#L257-L277)

存在 esm.sh 两种构建回退机制

<details>
<summary>查看原文（21行）</summary>

```text
 * The same import map with `bundle`/`external` dropped from every esm.sh entry.
 *
 * esm.sh serves two different builds and only one of them can fail: `?bundle` runs esbuild over
 * the package's whole tree, and a version skew anywhere in it is a hard 500. Measured on
 * `mermaid`, three attempts, deterministic — `?bundle&target=es2022&external=react,react-dom,scheduler`
 * answers **500 `esbuild: No matching export in "node_modules/d3/src/index.js" for import
 * "curveBumpX"`**, while the plain `https://esm.sh/mermaid?target=es2022` answers 200 and the
 * module imports fine. The card meanwhile renders **completely blank with nothing in the
 * console**, because an unresolvable import kills the whole module graph.
 *
 * So the retry that only busts the query re-requests the same broken build. Unbundling is a
 * genuinely different artefact on esm.sh's side, which is what makes it a second chance rather
 * than a second identical failure. It is not the first choice — the bundled build is one request
 * instead of a waterfall — which is why this is on the retry path and not on the happy one.
 */
export const unbundleFetchedImports = (imports: Record<string, string>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(imports).map(([key, url]) => {
      if (!url.startsWith("https://esm.sh/")) return [key, url];
      const parsed = new URL(url);
      parsed.searchParams.delete("bundle");
```

</details>

**依据 3 · 源码核查**：[src/client/runtime/GenUISurface.tsx:397-417](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/client/runtime/GenUISurface.tsx#L397-L417)

重试更新导入 URL 并尝试非 bundle 构建

<details>
<summary>查看原文（21行）</summary>

```text
  const retryRef = useLatest(function retry() {
    if (!aliveRef.current || renderer === null || code === "") return;
    const attempt = retriesRef.current;
    const revision = revisionRef.current;
    const sequence = ++retrySequenceRef.current;
    void mergeFallbackImports(localImports(sessionId), code)
      .then((imports) => {
        if (!aliveRef.current || revision !== revisionRef.current || sequence !== retrySequenceRef.current) return;
        // Only a retry that will actually apply may supersede the ordinary import probe.
        probeRef.current++;
        // Only the fetched esm.sh entries need busting; the local blob URLs are already fresh.
        // From the second attempt the bundled build is dropped as well: if the first failure was a
        // bundle-side 500 (see `unbundleFetchedImports`) no amount of cache-busting can clear it.
        const fresh = attempt > 0 ? unbundleFetchedImports(imports) : imports;
        renderer.setImportMap({ imports: bustFetchedImports(fresh, attempt) });
        renderer.clear({ preserveVisualState: true });
        renderer.render(code);
      })
      .catch((reason: unknown) => {
        if (revision !== revisionRef.current || sequence !== retrySequenceRef.current) return;
        handleFailureRef.current(reason instanceof Error ? reason : new Error(String(reason)), "compile", retry);
```

</details>

**依据 4 · 源码核查**：[src/client/runtime/GenUISurface.tsx:427-438](https://github.com/MindLab-Research/dsh-generative-ui/blob/ed2db0a5d1f90038a5b34b1ca99ebc2b15d09c51/src/client/runtime/GenUISurface.tsx#L427-L438)

按渲染阶段处理异常

<details>
<summary>查看原文（12行）</summary>

```text
    void GenUIRenderer.create(host, {
      compiler: compiler(),
      importmap: { imports: localImports(sessionId) },
      preserveStateOnUpdate: preserveStateRef.current,
      callbacks: {
        onError: (error, phase) => {
          if (phase === "render") threwRef.current = true;
          const action = errorAction(error.message, phase, streamingRef.current, retriesRef.current);
          // Remember what was swallowed. Only the newest matters: each frame supersedes the last,
          // so this is the state of the buffer the stream stopped on.
          if (action === "ignore") strandedRef.current = { error, phase };
          handleFailureRef.current(error, phase, () => retryRef.current());
```

</details>

#### 缺口

- 三组对照和故障恢复尚无本次复现
  **影响**：首屏变快或轮数变少均不能单独证明收益
  **进一步探讨**：保留时间线、预期计算结果和错误日志

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
