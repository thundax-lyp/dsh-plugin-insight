# AgentCompare

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[29e6ab8](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/tree/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1)

<!-- BEGIN META -->
[![GitHub ★ 425](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=425&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare) [![npm 30d 96,195](https://img.shields.io/static/v1?label=npm+30d&message=96%2C195&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-compare) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agent-compare)
<!-- END META -->

> **功能**：在 DSH 主对话内生成并比较 2–4 版回答、文件或网页，选择后审查采用。

> **亮点**：把 2–4 个候选生成、共同验收、盲看/公开视图、运行 trace 与预览接入 DSH 对话，形成可比较的交付流程；这提供过程可见性，尚无证据表明候选质量或决策结果优于单版。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：工作区和依赖副本只隔离文件，不约束脚本的系统权限；pre-adopt 日志记录文件恢复点，外部副作用需另行隔离。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 比较流程面向什么任务，当前版本增加了哪些可见能力？](#detail-section-11)
  - [Q02 · 候选执行、预览和追踪如何工作，依赖与隔离边界是什么？](#detail-section-12)
  - [Q03 · 采用与恢复如何处理目标变化及工程风险？](#detail-section-13)
  - [Q04 · 如何衡量增量价值、成本及采用条件？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要比较方案、文件或页面结果的 DSH 用户。相比手动开多个会话，它把候选运行、共同验收、盲看/公开视图、追踪和采用检查整合到对话入口；集成不等于比较结果更优。当前提交的 trace 与候选 UI 增强了过程可见性，但提示或模型变化仍影响归因，盲看也无法消除文本泄露。

基线为手工完成相同任务或旧研究固定版本；没有同条件效果测量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 候选编排 | 独立生成和共同验收 | 需要模型和宿主支持 |
| 盲选与公开比较 | 查看与选择内容 | 可见结果可能暴露来源线索 |
| 导出和采用 | 保存选中结果 | 目标漂移需复核，原地采用有条件 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| Node 与 DSH | 加载候选和预览 | 以固定包声明为门槛，实际宿主另测 |
| 项目运行工具 | 安装、验收与预览 | 普通文件可走内容比较，非运行验收 |
| 模型路线 | 生成两至四份候选 | 分别计费和等待 |

| 阶段 | 操作 | 异常 |
| --- | --- | --- |
| 首次 | 普通非 Git 隔离目录用两版无敏感文件任务 | 先核查工作目录权限 |
| 持续 | 对照共同验收后挑选并导出 | 保存失败时检查保留的部分输出 |
| 退出 | 取消并查残留预览和临时副本 | 撤销冲突保留后编辑文件 |

**效果与成本**

| 成本 | 单位 | 边界 |
| --- | --- | --- |
| 模型与运行 | 每个合格结果所有候选的 token 和生成／构建时长 | 不能只计胜出一版 |
| 人工 | 比较、检查、修订与恢复时间 | 未实测 |

| 效果 | 判据 | 限制 |
| --- | --- | --- |
| 比较可追溯 | 同需求验收且可查看选择理由 | 不证明模型排名 |
| 写回有边界 | 重叠拒绝与撤销保留后编辑 | 目标宿主与外部副作用待查 |

> **思考**：工作区和依赖副本只隔离文件，不约束脚本的系统权限；pre-adopt 日志记录文件恢复点，外部副作用需另行隔离。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 2–4 个候选生成、共同验收、盲看/公开视图、运行 trace 与预览接入 DSH 对话，形成可比较的交付流程；这提供过程可见性，尚无证据表明候选质量或决策结果优于单版。[Q01](#research-q01) [Q02](#research-q02)

采用先计算预期树，按路径撤销以保留后编辑，值得复用。外部执行副作用与候选盲选仍需独立验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

工作区和依赖副本只隔离文件，不约束脚本的系统权限；pre-adopt 日志记录文件恢复点，外部副作用需另行隔离。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

仅适合需要比较候选交付且能隔离项目环境的 DSH 用户。先在无敏感数据临时项目跑两版，检查候选权限、trace、预览关闭和最终文件，再决定扩大；若出现越界网络/文件副作用、预览未退出或单个合格结果的总成本高于单版，即停止并回到人工比较。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交源码支持接线与关键机制；真实宿主、外部服务、用户效果及实际成本均未在本轮验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/host/index.js、lib/core/trace.js、lib/core/deps-warm.js、lib/core/preview.js、lib/host/trace.js、lib/core/orchestrator.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取本轮固定组件源码、既有目录统计及上一版本研究；未安装或运行插件，未执行宿主、浏览器、外部服务或真实用户验证。
- 下一步：在目标宿主隔离环境按 [Q04](#research-q04) 逐项执行小规模任务，记录失败、质量、人工时间与资源成本；任一停止条件触发则回滚。

**分析版本**

- **仓库**：[lijiaqi-AI-Product-Manager/dsh-agent-compare](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare)
- **版本号**：3.1.0（[固定提交 29e6ab8](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/tree/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1)）
- **版本日期**：2026-11-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：在需要探索方案的真实任务中，同时生成多个候选并保留运行轨迹，可减少从首个方案到合格结果的总时间，并让采用选择更可追溯。用无敏感数据临时项目比较两候选与单候选，按合格结果质量、总耗时、模型/运行成本及人工审查量计；若质量无提升或总成本更高则推翻。[Q04](#research-q04)

在目标宿主隔离环境按 [Q04](#research-q04) 逐项执行小规模任务，记录失败、质量、人工时间与资源成本；任一停止条件触发则回滚。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 33 | 3800 | — | — | 75877 |
| .tsx | example | 2 | 29 | 27 | 0 | — |
| .ts | example | 2 | 24 | 22 | 0 | — |
| .js | source | 48 | 9202 | 8332 | 895 | — |
| .cjs | source | 4 | 723 | 687 | 38 | — |
| .mjs | source | 21 | 3090 | 2877 | 143 | — |
| .tsx | source | 10 | 2527 | 2247 | 227 | — |
| .ts | source | 56 | 10731 | 8940 | 1234 | — |
| .cts | source | 3 | 544 | 487 | 37 | — |
| .ts | test | 66 | 7330 | 6749 | 173 | — |
| .mjs | test | 3 | 130 | 124 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 88](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=88&color=737b86&logo=github)](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 88](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=88&color=737b86&logo=github)](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定提交的 DSH 集成如何把多候选比较与可控采用连起来，新增过程可见性是否足以改善真实决策？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 比较流程面向什么任务，当前版本增加了哪些可见能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要比较方案、文件或页面结果的 DSH 用户。相比手动开多个会话，它把候选运行、共同验收、盲看/公开视图、追踪和采用检查整合到对话入口；集成不等于比较结果更优。当前提交的 trace 与候选 UI 增强了过程可见性，但提示或模型变化仍影响归因，盲看也无法消除文本泄露。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-43](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/README.md#L27-L43)

作者描述 2–4 个回答、文件或网页候选及选择步骤。

<details>
<summary>查看原文（17行）</summary>

```text
> **本页对应 3.1.0；npm 已发布版本见上方徽章。** DSH 桌面端与 Web 端，中英双语。在主对话内比较 2–4 版回答、文件或网页；每版的思考和工具调用都能展开查看，回复与成品同等显示。

<a id="demo"></a>

## 看一场完整的大肥鱼赛马

[![固定候选流程示例：各版工作时每版一只随进度注水的 DeepSeek 蓝鲸、实时展开过程，4 版番茄钟页面同时运行，专注 C 时回复与页面并排，选择 C 并点选理由](https://raw.githubusercontent.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/main/docs/media/comparison-preview.gif)](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/main/docs/media/comparison-workflow.mp4)

四条大肥鱼、四版番茄钟：在真实 DSH 宿主里录制的固定候选演示（3.1.0 发布候选源码，中文界面）：
- 在普通文件夹里让 4 版各写一个番茄钟页面，比较卡片有两颗彗星绕边框奔跑；
- 各版工作时打开大窗口：每版一只 DeepSeek 蓝鲸随进度注水，头上冒出想法，下方实时滚动最新的步骤；戳一下会回话；展开「过程」，看到思考和写文件；
- 回复先于页面出现，随后 4 个实时页面都能直接操作；
- 排除两版，专注 C：回复在左、页面在右；选择后揭晓每版的风格；
- 点选两个理由（布局、更简洁），主对话的下一条请求会带上它们；保存到新文件夹后，继续主对话。

视频剪去了等待，保留的部分按原速播放，本地路径已隐藏。

```

</details>

**依据 2 · 源码核查**：[lib/host/index.js:451-489](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/host/index.js#L451-L489)

宿主实际注册比较工具。

<details>
<summary>查看原文（39行）</summary>

```text
    ctx.effect(() => ctx.tools.register(defineTool({
        name: 'agent_compare_start',
        description: 'Build two to four independent versions of one task (a UI, a page, files or an answer) in isolated copies, run and serve each, and run the same bound checks on each. ' +
            'Use it when the user asks to compare versions or styles, or wants to try several approaches before choosing; do not use it for bug fixes or refactors with a single right answer. ' +
            'Returns immediately after admission with a runId; generation, verification and previews continue in the conversation A|B card while the main conversation remains available. The saved number of versions, styles, blind or open comparison, models and time budget are reused unless explicitly overridden. The user then tries every version, picks one, and reviews adoption. Use agent_compare_status for progress; do not start another comparison to poll. In a blind comparison, never claim which style or model produced which version before the user has chosen.',
        parameters: {
            task: { type: 'string', required: true, description: 'The complete task, as the user stated it, plus every requirement and constraint. Every version receives exactly this text.' },
            time_limit_minutes: { type: 'number', description: 'Optional per-version generation budget, 5 to 120 minutes; defaults to the saved conversation setting.' },
            mode: { type: 'string', enum: ['same-model', 'cross-model'], description: 'Optional override; defaults to the saved comparison mode. Same-model gives each version a saved style; cross-model uses the saved model for each version.' },
            versions: { type: 'number', description: 'Optional number of versions, 2 to 4; defaults to the saved setting. More versions use more model usage.' },
        },
        output: {
            schema: { type: 'json' },
            render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
        },
        async execute(args, exec) {
            if (exec.agent === undefined)
                throw new Error('agent_compare_start must be called by an agent');
            if (isDelegated(exec.agent))
                return { error: 'A delegated or candidate agent cannot start another comparison.' };
            return startToolComparison(args, { ...exec, agent: exec.agent }, {
                preferences: sessionId => preferences.load(sessionId), currentRoute, repoFor,
                start: input => comparer.start(input),
                // A tool call has no ticked messages; a saved manual selection falls back to the recent exchanges.
                conversationContext: async (agent, saved) => buildConversationContext(agent.session.snapshotEvents(0), contextRequestOf(saved), await pendingNotes(agent.session)),
            });
        },
    })), 'agent-compare: agent_compare_start tool');
    ctx.effect(() => ctx.tools.register(defineTool({
        name: 'agent_compare_status',
        description: 'Report the state of an AgentCompare run (or the latest one for this main conversation): candidate stages, checks, adoption eligibility, the user\'s choice and adoption result. Reconcile interruption and owned previews when a previous host has exited. In a blind comparison, style and model names appear only after the user chose; an open comparison shows them throughout.',
        parameters: { run_id: { type: 'string', description: 'Run id; omit for the latest run of this conversation.' } },
        output: { schema: { type: 'json' }, render: (_a, v) => [{ type: 'text', text: JSON.stringify(v, null, 2) }] },
        async execute(args, exec) {
            const status = await readComparisonStatus(comparer, exec.agent, args.run_id, exec.signal);
            return 'error' in status ? status : { ...brief(status.record), control: status.control };
        },
    })), 'agent-compare: agent_compare_status tool');
    ctx.inject(['commands'], (sub) => {
```

</details>

**依据 3 · 源码核查**：[lib/core/trace.js:66-75](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/trace.js#L66-L75)

traceView 支持摘要及盲选遮罩。

<details>
<summary>查看原文（10行）</summary>

```text
 * What a reader is shown of a stored trace. Before a blind pick, words that
 * name the version's style are masked. A summary keeps the counts and the
 * newest few steps, enough to show live what the version is doing.
 */
export const SUMMARY_ITEMS = 3;
export function traceView(stored, options) {
    const wanted = options.summary === true ? { ...stored, items: stored.items.slice(-SUMMARY_ITEMS) } : stored;
    return { ...(options.blind ? maskTrace(wanted, options.strategy) : wanted), masked: options.blind };
}
export function traceFile(artifacts, label) {
```

</details>

#### 缺口

- 没有真实用户研究或盲测对照，无法判断是否提升选择质量。
  **影响**：影响贡献收益判断
  **进一步探讨**：用同任务和验收规则比较人工多会话、普通并行及盲看流程。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 候选执行、预览和追踪如何工作，依赖与隔离边界是什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

预热目录被复制到候选的独立目录，内部链接重建到各自副本。逃逸或悬空链接、根重定向及非空目标使复制失败，再由候选走冻结安装。依赖副本隔离可变状态，子进程仍有宿主允许的系统权限。静态页优先由插件进程供给，失败后用辅助进程。辅助进程随机 localhost 名和空闲端口，默认等待 60 秒，只有端口冲突退出才换入口，最多三次。失败尝试杀进程树并再杀未退出子进程；停止已就绪预览等 close，5 秒未确认报错。项目脚本预览的网络和子进程行为不由静态服务器约束。作者说明旧版把含同进程预览字段的记录列为只读历史。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host/index.js:349-371](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/host/index.js#L349-L371)

宿主装配比较运行器和必要服务。

<details>
<summary>查看原文（23行）</summary>

```text
export async function apply(ctx, config = {}) {
    const { defineTool } = (await import(__rewriteRelativeImportExtension('@deepseek-ai/dsh-tools')));
    const agents = ctx.get('agents');
    const subagents = ctx.get('subagents');
    let runner;
    if (config.isolation !== 'shared-root' && typeof agents?.create === 'function')
        runner = new IsolatedSessionRunner(agents);
    else if (subagents !== undefined) {
        runner = new SubagentRunner(subagents, config.provider ?? 'spawn');
        if (config.isolation !== 'shared-root')
            ctx.logger.warn('agent-compare: no agent factory on this host; falling back to shared-root subagents (escapes are detected, not prevented)');
    }
    else
        throw new Error('agent-compare needs ctx.agents (or ctx.subagents) to run candidates');
    const environmentContract = import(__rewriteRelativeImportExtension('@deepseek-ai/dsh-subprocess')).then(service => typeof service.scrubbedParentEnv === 'function', () => false);
    const runtimeVersion = import(__rewriteRelativeImportExtension('@deepseek-ai/dsh-app-boot')).then(service => typeof service.getDshRuntimeVersion === 'function' ? service.getDshRuntimeVersion() : undefined).catch(() => undefined);
    const capabilities = async () => hostCapabilities({
        isolation: runner.isolation,
        agents,
        subagents,
        sandbox: ctx.get('sandbox'),
        commands: ctx.get('commands'),
        sessionController: ctx.get('sessionController'),
```

</details>

**依据 2 · 源码核查**：[lib/core/deps-warm.js:1-25](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/deps-warm.js#L1-L25)

依赖预热逻辑说明独立工作区和副本边界。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * Install dependencies once, while the versions are still being generated.
 *
 * Most versions do not change a project's dependencies. For an npm project
 * with a lockfile, the baseline's manifest is installed with the same frozen
 * command into a private directory of the run as soon as the copies exist.
 * A version whose manifest files are byte-identical to that baseline gets
 * its own copy of that tree instead of running its own install.
 * Anything unusual (another package manager, local `file:` packages, root
 * install scripts, a changed manifest, a failed or unfinished warm install,
 * a copy error) falls back to the version's own frozen install.
 *
 * The warm tree is outside every version's copy and each version gets its own
 * files, so no version can change the warm tree or another version.
 */
import { createHash } from 'node:crypto';
import { constants, existsSync } from 'node:fs';
import { copyFile, lstat, mkdir, opendir, readFile, readdir, realpath, rm, stat, symlink } from 'node:fs/promises';
import path from 'node:path';
/** Files that decide what `npm ci` installs. */
export const NPM_MANIFESTS = ['package.json', 'package-lock.json', 'npm-shrinkwrap.json', '.npmrc'];
const ROOT_SCRIPTS = ['preinstall', 'install', 'postinstall', 'prepare', 'prepublish'];
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
/** Fingerprint the manifest files of a project directory; absent files are recorded as absent. */
export async function manifestDigests(projectDir) {
```

</details>

**依据 3 · 源码核查**：[lib/core/preview.js:70-116](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/preview.js#L70-L116)

启动 Vite 预览并处理失败/超时。

<details>
<summary>查看原文（47行）</summary>

```text
export async function startVitePreview(dir, opts = {}) {
    const viteBin = path.join(dir, 'node_modules', 'vite', 'bin', 'vite.js');
    const project = await inspectProject(dir);
    const modernYarn = project.packageManager === 'yarn' && project.modernYarn === true;
    if (!modernYarn && !existsSync(viteBin))
        throw new PreviewError('副本里没有安装 vite', '');
    const kind = opts.kind ?? 'build';
    const timeoutMs = opts.timeoutMs ?? 60_000;
    const host = `ac-${randomBytes(16).toString('hex')}.localhost`;
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
        const port = await freePort();
        const root = `http://${host}:${port}/`;
        const args = kind === 'build' ? ['preview'] : [];
        const command = modernYarn ? ['yarn', '--cwd', dir, 'exec', 'vite'] : ['node', viteBin];
        const prepared = await prepareProjectProcess({ argv: [...command, ...args, '--host', '127.0.0.1', '--port', String(port), '--strictPort'], cwd: dir,
            env: { BROWSER: 'none', FORCE_COLOR: '0', NO_COLOR: '1' }, signal: opts.signal }, opts.prepareProjectProcess);
        const child = startLongRunning(prepared.argv, {
            cwd: dir,
            env: prepared.env,
        });
        const log = new DiagnosticLog(6000);
        let closed = false;
        const exit = new Promise((resolve) => child.once('close', () => { closed = true; resolve(); }));
        child.stdout?.setEncoding('utf8').on('data', (d) => log.push(d));
        child.stderr?.setEncoding('utf8').on('data', (d) => { log.push(d); prepared.observeStderr?.(d); });
        const entry = () => {
            const printed = new RegExp(`http://127\\.0\\.0\\.1:${port}/[^\\s\\u001b]*`).exec(log.toString())?.[0];
            const url = new URL(printed ?? root);
            url.hostname = host;
            return url.href;
        };
        const outcome = await waitReady(child, entry, timeoutMs, opts.signal);
        if (outcome === 'ready' && child.pid !== undefined) {
            const pid = child.pid;
            let stopping;
            return { url: entry(), port, pid, log, ...(modernYarn ? { launcher: 'yarn' } : {}), stop: () => closed ? Promise.resolve() : stopping ??= (async () => {
                    try {
                        await killTree(pid);
                    }
                    finally {
                        if (!closed && child.exitCode === null && child.signalCode === null)
                            child.kill('SIGKILL');
                    }
                    let timer;
                    try {
                        await Promise.race([exit, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`预览进程 ${pid} 未在终止后退出`)), 5000); })]);
```

</details>

**依据 4 · 源码核查**：[lib/core/trace.js:6-23](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/trace.js#L6-L23)

trace 设置项目数量和文本长度边界。

<details>
<summary>查看原文（18行）</summary>

```text
 * A trace is bounded: long texts are cut and a very long session keeps its
 * opening and its latest steps. It is stored next to the run's other
 * artifacts, not in the run record.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
export const TRACE_LIMITS = { items: 320, head: 40, thinking: 6000, text: 4000, input: 1500, output: 2000, target: 140 };
export function clip(text, max) {
    return text.length <= max ? { text, cut: false } : { text: `${text.slice(0, max)}…`, cut: true };
}
/** Keep the opening and the latest items of a long session. */
export function boundItems(items) {
    if (items.length <= TRACE_LIMITS.items)
        return { items, cut: false, omitted: 0 };
    const tail = TRACE_LIMITS.items - TRACE_LIMITS.head;
    return { items: [...items.slice(0, TRACE_LIMITS.head), ...items.slice(-tail)], cut: true, omitted: items.length - TRACE_LIMITS.items };
}
export const EMPTY_TRACE = { items: [], steps: 0, tools: 0, thinking: 0, truncated: false, done: false, updatedAt: 0 };
```

</details>

**依据 5 · 源码核查**：[lib/host/trace.js:48-62](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/host/trace.js#L48-L62)

从 DSH 会话事件组装候选 trace。

<details>
<summary>查看原文（15行）</summary>

```text
export function traceOf(events, startedAt = events.find(event => typeof event.time === 'number')?.time ?? Date.now()) {
    const items = [];
    const tools = new Map();
    let steps = 0, toolCount = 0, thinking = 0, cut = false, stepStarted, done = false;
    let lastTextIndex = -1;
    const at = (event) => Math.max(0, (typeof event.time === 'number' ? event.time : startedAt) - startedAt);
    const bounded = (text, max) => { const c = clip(text, max); if (c.cut)
        cut = true; return c.text; };
    for (const event of events) {
        const data = event.data ?? {};
        if (event.type === 'step/start') {
            steps++;
            stepStarted = typeof event.time === 'number' ? event.time : undefined;
            continue;
        }
```

</details>

**依据 6 · 源码核查**：[lib/core/deps-warm.js:76-106](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/deps-warm.js#L76-L106)

预热树与链接的检查。

<details>
<summary>查看原文（31行）</summary>

```text
 * Recreate `from` at `to` as an independent copy, so nothing a version's
 * checks write can reach the warm tree or another version. Files are copied
 * many at a time, and cloned where the file system can share blocks until a
 * write. Internal links are relocated into the copy. Escaping or dangling
 * links, redirected roots and a nonempty destination reject the copy so
 * the caller can use the version's own frozen install instead.
 */
export async function copyTree(from, to) {
    const plainDirectory = async (dir, role) => {
        const info = await lstat(dir);
        if (!info.isDirectory() || info.isSymbolicLink())
            throw new Error(`${role} must be a plain directory`);
    };
    const inside = (root, target) => {
        const relative = path.relative(root, target);
        return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
    };
    await plainDirectory(from, 'Dependency source');
    const sourceRoot = await realpath(from);
    await mkdir(to, { recursive: true });
    await plainDirectory(to, 'Dependency destination');
    const targetRoot = await realpath(to);
    if (inside(sourceRoot, targetRoot) || inside(targetRoot, sourceRoot))
        throw new Error('Dependency source and destination must be separate directories');
    if ((await readdir(targetRoot)).length)
        throw new Error('Dependency destination must be empty');
    const files = [];
    const links = [];
    const walk = async (src, dest) => {
        await plainDirectory(src, 'Dependency source');
        await mkdir(dest, { recursive: true });
```

</details>

**依据 7 · 源码核查**：[lib/core/deps-warm.js:124-150](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/deps-warm.js#L124-L150)

失败复制等待在途写入。

<details>
<summary>查看原文（27行）</summary>

```text
        const kind = link.directory ? 'junction' : 'file';
        const target = process.platform === 'win32' && link.directory ? link.target : path.relative(path.dirname(link.dest), link.target) || '.';
        await symlink(target, link.dest, process.platform === 'win32' ? kind : undefined);
    }
    let next = 0, failed = false;
    // A rejected copy must not leave other workers writing into the caller's
    // fallback installation. Stop queued work and drain every in-flight write.
    const results = await Promise.allSettled(Array.from({ length: Math.min(COPY_CONCURRENCY, files.length) }, async () => {
        while (!failed && next < files.length) {
            const [s, d] = files[next++];
            try {
                await copyFile(s, d, constants.COPYFILE_FICLONE);
            }
            catch (error) {
                failed = true;
                throw error;
            }
        }
    }));
    const error = results.find(result => result.status === 'rejected');
    if (error?.status === 'rejected')
        throw error.reason;
    return files.length;
}
export async function removeTree(dir) {
    await rm(dir, { recursive: true, force: true, maxRetries: 3 });
}
```

</details>

**依据 8 · 源码核查**：[lib/core/preview.js:147-161](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/preview.js#L147-L161)

静态预览实现分流。

<details>
<summary>查看原文（15行）</summary>

```text
export async function startStaticPreview(dir, entry, opts = {}) {
    if (!entry || path.isAbsolute(entry) || entry.split(/[\\/]/).includes('..'))
        throw new PreviewError('静态页面入口无效', '');
    opts.signal?.throwIfAborted();
    try {
        return await serveStaticHere(dir, entry);
    }
    catch { /* fall back to the helper process */ }
    return startStaticHelperPreview(dir, entry, opts);
}
/** The same files served by the helper process: the fallback when this process cannot listen. */
export function startStaticHelperPreview(dir, entry, opts = {}) {
    if (!entry || path.isAbsolute(entry) || entry.split(/[\\/]/).includes('..'))
        return Promise.reject(new PreviewError('静态页面入口无效', ''));
    return startHelperPreview(dir, opts, async (port, host) => ({
```

</details>

**依据 9 · 源码核查**：[lib/core/preview.js:318-370](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/preview.js#L318-L370)

预览重试、清理和停止确认。

<details>
<summary>查看原文（53行）</summary>

```text
async function startHelperPreview(dir, opts, launch) {
    if (!existsSync(PREVIEW_RUNNER))
        throw new PreviewError('预览辅助进程缺失，请重新安装插件', '');
    const timeoutMs = opts.timeoutMs ?? 60_000;
    const host = `ac-${randomBytes(16).toString('hex')}.localhost`;
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
        opts.signal?.throwIfAborted();
        const port = await freePort();
        const launched = await launch(port, host);
        const child = startLongRunning(launched.argv, { cwd: dir, env: launched.env });
        const log = new DiagnosticLog(6000);
        let closed = false;
        const exit = new Promise((resolve) => child.once('close', () => { closed = true; resolve(); }));
        child.stdout?.setEncoding('utf8').on('data', (d) => log.push(d));
        child.stderr?.setEncoding('utf8').on('data', (d) => { log.push(d); launched.observeStderr?.(d); });
        const url = `http://${host}:${port}/`;
        const outcome = await waitReady(child, () => url, timeoutMs, opts.signal, ANSWERING);
        if (outcome === 'ready' && child.pid !== undefined) {
            const pid = child.pid;
            let stopping;
            return { url, port, pid, log, stop: () => closed ? Promise.resolve() : stopping ??= (async () => {
                    try {
                        await killTree(pid);
                    }
                    finally {
                        if (!closed && child.exitCode === null && child.signalCode === null)
                            child.kill('SIGKILL');
                    }
                    let timer;
                    try {
                        await Promise.race([exit, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`预览进程 ${pid} 未在终止后退出`)), 5000); })]);
                    }
                    finally {
                        if (timer)
                            clearTimeout(timer);
                    }
                })().catch((error) => { stopping = undefined; throw error; }) };
        }
        try {
            await killTree(child.pid);
        }
        finally {
            if (!closed && child.exitCode === null && child.signalCode === null)
                child.kill('SIGKILL');
        }
        lastError = new PreviewError(outcome === 'exited' ? '预览服务在响应前退出' : outcome === 'aborted' ? 'cancelled' : `预览服务 ${Math.round(timeoutMs / 1000)} 秒内没有在指定端口响应`, log.toString());
        if (outcome === 'aborted')
            break;
        if (outcome !== 'exited' || !/(EADDRINUSE|port .* (in use|already))/i.test(log.toString()))
            break;
    }
    throw lastError ?? new PreviewError('预览服务启动失败', '');
```

</details>

#### 缺口

- 未运行预览、安装或隔离检查，外部进程权限、网络策略和退出回收未知。
  **影响**：可能让不可信项目影响工作区或留下进程
  **进一步探讨**：在一次性非敏感项目监测目录、网络及退出资源。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 采用与恢复如何处理目标变化及工程风险？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

工作区采用需要已选 ready 候选、补丁 SHA 与封存树都匹配，并先通过共同验收。纯回答不走文件采用，非 Git 目录改走目录导出，分支模式可另行检查未验收候选。工作区路径先拒绝与用户改动重叠，再计算预期树；树不同就在暂存副本重跑验收。预演失败、停止未确认或预演期间目标变化都会阻止写入。

写前固定 pre-adopt 引用并保存日志，写后核对结果树、HEAD、index 和并行变化。已触及文件正确但其他位置出现并发变化时标 needs-attention，组合结果仍未预演。预演取消入口不能撤销已开始的交接；文件恢复也不覆盖脚本和网络副作用。盲选只遮罩策略指定文本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core/orchestrator.js:1060-1116](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/orchestrator.js#L1060-L1116)

采用前复核候选/目标状态，保存恢复信息并执行写入核验。

<details>
<summary>查看原文（57行）</summary>

```text
            return { ok: false, eligible: c.verdict?.eligible === true, reasons: ['这次比较从非 Git 目录开始，请用「保存到当前目录」把选中的版本存成新文件夹'] };
        if (c.result === 'answer')
            return { ok: false, eligible: false, reasons: ['这一版只有回答，没有可以写入的文件；回答已写入主对话'] };
        const nameStatus = await nameStatusOf(r.baseline.repoRoot, r.baseline.snapshotCommit, c.candidateCommit);
        const p = await preflight({ baseline: r.baseline, candidateCommit: c.candidateCommit, nameStatus, scratchDir: this.store.artifacts(runId) });
        const verdict = c.verdict ?? { eligible: false, reasons: ['没有验收结论'], warnings: [] };
        return p.ok
            ? { ok: verdict.eligible, eligible: verdict.eligible, reasons: verdict.reasons, targetChanged: p.targetChanged, rehearsal: p.expectedTree !== c.candidateTree }
            : { ok: false, eligible: verdict.eligible, reasons: verdict.reasons, overlapping: p.overlapping };
    }
    /**
     * Land the chosen candidate.
     *
     * `worktree` (eligible candidates only): compute the tree the checkout will
     * have afterwards; when it differs from the checked candidate (the user
     * changed other files since), build and check it in a scratch copy first.
     * Only then persist a journal, write, and verify the checkout equals that
     * tree. HEAD, the index and commits are never touched.
     *
     * `branch`: create a branch with the candidate, switching nothing. Allowed
     * for any finished candidate, so an unverified one can still be inspected.
     */
    adopt(runId, mode = 'worktree') {
        if (mode === 'folder')
            return this.operation(() => this.exportPick(runId), runId);
        const controller = new AbortController();
        return this.operation(() => this.adoptRun(runId, mode, controller), runId).finally(() => {
            if (this.adoptionControllers.get(runId)?.controller === controller)
                this.adoptionControllers.delete(runId);
        });
    }
    /** Interrupt only this owner's rehearsal; file handoff must finish once writing begins. */
    async cancelAdoption(runId) {
        this.assertOpen();
        const pending = this.adoptionControllers.get(runId);
        if (!pending || pending.record.state !== 'adopting' || pending.record.adoption?.state !== 'rehearsing') {
            throw new AdoptError('state', '当前没有可停止的采用预演；文件交接开始后必须等待核验完成。');
        }
        pending.controller.abort(new Error('已停止采用预演'));
        return pending.record;
    }
    async adoptRun(runId, mode, controller) {
        const first = await this.mustLoad(runId);
        if (first.target !== undefined)
            throw new AdoptError('state', '这次比较从非 Git 目录开始，请用「保存到当前目录」把选中的版本存成新文件夹');
        return withRepositoryWrite(first.baseline.repoRoot, () => this.serial(runId, async () => {
            const r = await this.fresh(runId);
            if (r.state !== 'revealed')
                throw new AdoptError('state', `现在不能采用（${r.state}）`);
            const pick = r.choice?.pick;
            if (pick === undefined || pick === 'none')
                throw new AdoptError('state', '没有选中的候选');
            const c = r.candidates.find((x) => x.label === pick);
            if (c.stage !== 'ready' || c.candidateCommit === undefined || c.candidateTree === undefined || c.patchFile === undefined || c.patchSha256 === undefined)
                throw new AdoptError('state', '这个候选没有可采用的结果');
            if (c.result === 'answer')
                throw new AdoptError('state', '这一版只有回答，没有可以写入的文件；回答已写入主对话');
```

</details>

**依据 2 · 源码核查**：[lib/core/trace.js:52-74](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/trace.js#L52-L74)

盲选视图只遮罩策略指定文本并限制摘要项目。

<details>
<summary>查看原文（23行）</summary>

```text
export function maskTrace(trace, strategy) {
    const mask = (value) => value === undefined ? undefined : maskStyle(value, strategy);
    return {
        ...trace,
        items: trace.items.map(item => ({
            ...item,
            ...(item.text === undefined ? {} : { text: mask(item.text) }),
            ...(item.target === undefined ? {} : { target: mask(item.target) }),
            ...(item.input === undefined ? {} : { input: mask(item.input) }),
            ...(item.output === undefined ? {} : { output: mask(item.output) }),
        })),
    };
}
/**
 * What a reader is shown of a stored trace. Before a blind pick, words that
 * name the version's style are masked. A summary keeps the counts and the
 * newest few steps, enough to show live what the version is doing.
 */
export const SUMMARY_ITEMS = 3;
export function traceView(stored, options) {
    const wanted = options.summary === true ? { ...stored, items: stored.items.slice(-SUMMARY_ITEMS) } : stored;
    return { ...(options.blind ? maskTrace(wanted, options.strategy) : wanted), masked: options.blind };
}
```

</details>

**依据 3 · 源码核查**：[lib/host/index.js:451-489](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/host/index.js#L451-L489)

控制动作通过宿主工具注册路径暴露。

<details>
<summary>查看原文（39行）</summary>

```text
    ctx.effect(() => ctx.tools.register(defineTool({
        name: 'agent_compare_start',
        description: 'Build two to four independent versions of one task (a UI, a page, files or an answer) in isolated copies, run and serve each, and run the same bound checks on each. ' +
            'Use it when the user asks to compare versions or styles, or wants to try several approaches before choosing; do not use it for bug fixes or refactors with a single right answer. ' +
            'Returns immediately after admission with a runId; generation, verification and previews continue in the conversation A|B card while the main conversation remains available. The saved number of versions, styles, blind or open comparison, models and time budget are reused unless explicitly overridden. The user then tries every version, picks one, and reviews adoption. Use agent_compare_status for progress; do not start another comparison to poll. In a blind comparison, never claim which style or model produced which version before the user has chosen.',
        parameters: {
            task: { type: 'string', required: true, description: 'The complete task, as the user stated it, plus every requirement and constraint. Every version receives exactly this text.' },
            time_limit_minutes: { type: 'number', description: 'Optional per-version generation budget, 5 to 120 minutes; defaults to the saved conversation setting.' },
            mode: { type: 'string', enum: ['same-model', 'cross-model'], description: 'Optional override; defaults to the saved comparison mode. Same-model gives each version a saved style; cross-model uses the saved model for each version.' },
            versions: { type: 'number', description: 'Optional number of versions, 2 to 4; defaults to the saved setting. More versions use more model usage.' },
        },
        output: {
            schema: { type: 'json' },
            render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
        },
        async execute(args, exec) {
            if (exec.agent === undefined)
                throw new Error('agent_compare_start must be called by an agent');
            if (isDelegated(exec.agent))
                return { error: 'A delegated or candidate agent cannot start another comparison.' };
            return startToolComparison(args, { ...exec, agent: exec.agent }, {
                preferences: sessionId => preferences.load(sessionId), currentRoute, repoFor,
                start: input => comparer.start(input),
                // A tool call has no ticked messages; a saved manual selection falls back to the recent exchanges.
                conversationContext: async (agent, saved) => buildConversationContext(agent.session.snapshotEvents(0), contextRequestOf(saved), await pendingNotes(agent.session)),
            });
        },
    })), 'agent-compare: agent_compare_start tool');
    ctx.effect(() => ctx.tools.register(defineTool({
        name: 'agent_compare_status',
        description: 'Report the state of an AgentCompare run (or the latest one for this main conversation): candidate stages, checks, adoption eligibility, the user\'s choice and adoption result. Reconcile interruption and owned previews when a previous host has exited. In a blind comparison, style and model names appear only after the user chose; an open comparison shows them throughout.',
        parameters: { run_id: { type: 'string', description: 'Run id; omit for the latest run of this conversation.' } },
        output: { schema: { type: 'json' }, render: (_a, v) => [{ type: 'text', text: JSON.stringify(v, null, 2) }] },
        async execute(args, exec) {
            const status = await readComparisonStatus(comparer, exec.agent, args.run_id, exec.signal);
            return 'error' in status ? status : { ...brief(status.record), control: status.control };
        },
    })), 'agent-compare: agent_compare_status tool');
    ctx.inject(['commands'], (sub) => {
```

</details>

**依据 4 · 源码核查**：[lib/core/orchestrator.js:1101-1138](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/orchestrator.js#L1101-L1138)

候选指纹、分支模式和共同验收。

<details>
<summary>查看原文（38行）</summary>

```text
    async adoptRun(runId, mode, controller) {
        const first = await this.mustLoad(runId);
        if (first.target !== undefined)
            throw new AdoptError('state', '这次比较从非 Git 目录开始，请用「保存到当前目录」把选中的版本存成新文件夹');
        return withRepositoryWrite(first.baseline.repoRoot, () => this.serial(runId, async () => {
            const r = await this.fresh(runId);
            if (r.state !== 'revealed')
                throw new AdoptError('state', `现在不能采用（${r.state}）`);
            const pick = r.choice?.pick;
            if (pick === undefined || pick === 'none')
                throw new AdoptError('state', '没有选中的候选');
            const c = r.candidates.find((x) => x.label === pick);
            if (c.stage !== 'ready' || c.candidateCommit === undefined || c.candidateTree === undefined || c.patchFile === undefined || c.patchSha256 === undefined)
                throw new AdoptError('state', '这个候选没有可采用的结果');
            if (c.result === 'answer')
                throw new AdoptError('state', '这一版只有回答，没有可以写入的文件；回答已写入主对话');
            if (!existsSync(c.patchFile) || (await readPatchSha(c.patchFile)) !== c.patchSha256)
                throw new AdoptError('integrity', '记录的补丁和验收时的不一致');
            if ((await treeOf(r.baseline.repoRoot, c.candidateCommit)) !== c.candidateTree)
                throw new AdoptError('integrity', '候选提交和封存的内容不一致');
            const repo = r.baseline.repoRoot;
            const scratch = this.store.artifacts(runId);
            const nameStatus = await nameStatusOf(repo, r.baseline.snapshotCommit, c.candidateCommit);
            const touched = nameStatus.map((n) => n.path);
            if (mode === 'branch') {
                this.assertOpen();
                const verified = c.verdict?.eligible === true;
                const { branch } = await adoptAsBranch({ baseline: r.baseline, candidateCommit: c.candidateCommit, nameStatus, scratchDir: scratch, branch: `agent-compare/${runId}-${pick}`, ...(verified ? {} : { note: 'not verified' }) });
                r.adoption = { label: pick, mode, state: 'adopted', startedAt: Date.now(), endedAt: Date.now(), branch, message: `已创建分支 ${branch}（含一个提交）；当前 checkout、文件和 index 均未改动${verified ? '' : '。注意：这一版没有通过共同验收'}` };
                r.state = 'adopted';
                await this.save(r);
                return r;
            }
            if (c.verdict?.eligible !== true) {
                throw new AdoptError('ineligible', `这一版没有通过共同验收，不能写入工作区：${(c.verdict?.reasons ?? ['没有验收结论']).join('；')}。可以另存为分支查看。`);
            }
            if (r.adoption?.rehearsal?.stopUnconfirmed)
                throw new AdoptError('state', '先前预演的进程停止状态未知，副本仍保留；请先检查该任务进程');
```

</details>

**依据 5 · 源码核查**：[lib/core/orchestrator.js:1156-1189](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/orchestrator.js#L1156-L1189)

重叠拒绝、预演、目标重查和写前记录。

<details>
<summary>查看原文（34行）</summary>

```text
            let pf;
            try {
                pf = await preflight({ baseline: r.baseline, candidateCommit: c.candidateCommit, nameStatus, scratchDir: scratch });
            }
            catch (error) {
                return blocked(`无法完成采用检查：${error.message}。`);
            }
            if (signal.aborted)
                return blocked(this.closing ? '宿主正在停止，已取消采用。' : '已停止采用预演，候选成果仍保留。');
            if (!pf.ok)
                return blocked(`基线之后你改过这些文件，和这一版的改动重叠：${pf.overlapping.slice(0, 10).join('、')}。`, pf.overlapping);
            if (pf.expectedTree === c.candidateTree) {
                r.adoption.rehearsal = { reused: true, tree: pf.expectedTree };
            }
            else {
                const rehearsal = await this.rehearse(r, pf.expectedTree, pf.target.head, signal);
                r.adoption.rehearsal = rehearsal.record;
                if (signal.aborted)
                    return blocked(rehearsal.record.stopUnconfirmed
                        ? '已收到停止预演请求，但进程退出尚未确认；预演副本继续保留，请检查任务进程。'
                        : this.closing ? '宿主正在停止，已取消采用。' : '已停止采用预演，候选成果仍保留。');
                if (!rehearsal.ok)
                    return blocked(`把这一版接到你当前的项目上预演后，验收没有通过：${rehearsal.reasons.join('；')}。`);
            }
            const changed = await targetChanges(repo, scratch, pf.target);
            if (changed.length > 0)
                return blocked(`预演期间项目发生了变化，请检查后重新采用：${changed.slice(0, 10).join('、')}。`, changed);
            // Journal: everything needed to undo is durable before the first byte changes.
            const preAdopt = await pinPreAdopt(repo, pf.target);
            await pinRef(repo, `refs/agent-compare/${runId}/pre-adopt`, preAdopt);
            if (signal.aborted)
                return blocked(this.closing ? '宿主正在停止，已取消采用。' : '已停止采用预演，候选成果仍保留。');
            this.adoptionControllers.delete(runId);
            Object.assign(r.adoption, { state: 'writing', preAdoptCommit: preAdopt, expectedTree: pf.expectedTree, headBefore: pf.target.head, stagedBefore: pf.target.staged, writtenPaths: [], fileTransfer: newFileTransferRef(), transferDirection: 'apply' });
```

</details>

**依据 6 · 源码核查**：[lib/core/orchestrator.js:1193-1222](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/orchestrator.js#L1193-L1222)

写后并发变化判断。

<details>
<summary>查看原文（30行）</summary>

```text
            let completed = false;
            try {
                attempted = await writeCandidate(repo, c.candidateCommit, nameStatus, {
                    expected: pf.target,
                    scratchDir: scratch,
                    transfer: r.adoption.fileTransfer,
                    beforeWrite: async (paths) => {
                        r.adoption.writtenPaths = [...paths];
                        await this.save(r);
                    },
                });
                const chk = await checkWritten(repo, scratch, { expectedTree: pf.expectedTree, candidateCommit: c.candidateCommit, touched, before: pf.target });
                if (chk.mismatched.length > 0)
                    problem = `写入后这些文件和验收过的版本不一致：${chk.mismatched.slice(0, 10).join('、')}`;
                else {
                    r.adoption.endedAt = Date.now();
                    const others = [...chk.concurrent, ...(chk.headChanged ? ['HEAD'] : []), ...(chk.stagedChanged ? ['index'] : [])];
                    if (others.length > 0) {
                        r.adoption.state = 'needs-attention';
                        r.adoption.attention = others;
                        r.adoption.message = `已写入 ${touched.length} 个文件，内容与验收过的一致；但写入期间这些位置也变了，组合结果没有经过预演：${others.slice(0, 10).join('、')}`;
                    }
                    else {
                        r.adoption.state = 'adopted';
                        r.adoption.message = `已写入 ${touched.length} 个文件，项目现在与${r.adoption.rehearsal?.reused ? '验收过的版本' : '预演通过的版本'}完全一致；未提交，index 和 HEAD 未改动。采用前的原始文件已保留，可从记录撤销`;
                    }
                    r.state = 'adopted';
                    await this.save(r);
                    completed = true;
                }
```

</details>

#### 缺口

- 未实际注入并发文件修改、取消或进程崩溃，恢复和清理路径仍需验证。
  **影响**：影响是否适用于有用户改动的真实 repo
  **进一步探讨**：用一次性 repo 覆盖重叠、取消、恢复和残留进程。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何衡量增量价值、成本及采用条件？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

可先在无敏感数据的临时项目用两个候选完成一个可验收页面，再检查 trace、预览关闭和导出。待验证假设是并行候选降低探索时间并改善决策可追溯性；每个候选都消耗模型和运行资源，应按合格结果计全量候选与人工选择成本。若候选质量不一致或总等待/费用高于单版，回到单版或人工比较。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-43](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/README.md#L35-L43)

演示流程展示候选并行、查看、选择和保存。

```text
四条大肥鱼、四版番茄钟：在真实 DSH 宿主里录制的固定候选演示（3.1.0 发布候选源码，中文界面）：
- 在普通文件夹里让 4 版各写一个番茄钟页面，比较卡片有两颗彗星绕边框奔跑；
- 各版工作时打开大窗口：每版一只 DeepSeek 蓝鲸随进度注水，头上冒出想法，下方实时滚动最新的步骤；戳一下会回话；展开「过程」，看到思考和写文件；
- 回复先于页面出现，随后 4 个实时页面都能直接操作；
- 排除两版，专注 C：回复在左、页面在右；选择后揭晓每版的风格；
- 点选两个理由（布局、更简洁），主对话的下一条请求会带上它们；保存到新文件夹后，继续主对话。

视频剪去了等待，保留的部分按原速播放，本地路径已隐藏。

```

**依据 2 · 源码核查**：[lib/core/orchestrator.js:375-414](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/orchestrator.js#L375-L414)

候选运行有独立状态与预算。

<details>
<summary>查看原文（40行）</summary>

```text
                        lr.managerFailure = error.message;
                    throw error;
                }
            }
            // The first finished copy is still the untouched baseline: install its dependencies while everyone generates.
            if (!lr.warmStarted) {
                lr.warmStarted = true;
                await this.startWarmInstall(lr, projectDirectory(dir, record.baseline.projectPath), project).catch(() => { });
            }
            prepared();
            // Candidate tools may invoke Git too. Finish both copies' shared Git
            // metadata before either candidate can run a command in its copy.
            await allPrepared;
            signal.throwIfAborted();
            if (lr.managerFailure)
                throw new StageFailure('preparing', lr.managerFailure);
            await enter('generating');
            signal.throwIfAborted();
            const budget = AbortSignal.timeout(record.budget.generationMs);
            let lastSave = 0;
            // Steps are written in order, each write replacing the last; a reader sees the latest whole trace.
            const traceTarget = traceFile(this.store.artifacts(record.runId), c.label);
            let traceWrites = Promise.resolve();
            const saveTrace = (trace) => { traceWrites = traceWrites.then(() => writeTrace(traceTarget, trace)).catch(() => { }); };
            const result = await this.opts.runner.run({
                label: c.label,
                cwd: dir,
                prompt: candidatePrompt(record.task, c.strategy, record.isolation, record.conversationContext?.text, record.target ? { kind: 'folder' } : { kind: 'repository', ...(record.baseline.projectPath ? { projectPath: record.baseline.projectPath } : {}), answers: nothingToRun(record) }, { candidates: record.candidates.length, blind: record.blind !== false }),
                route: c.route,
                signal: AbortSignal.any([signal, budget]),
                hostContext: lr.hostContext,
                onProgress: (p) => {
                    c.progress = { steps: p.steps, lastActivityAt: Date.now(), ...(p.lastAction === undefined ? {} : { lastAction: p.lastAction.slice(0, 160) }), ...(p.tokens === undefined ? {} : { tokens: p.tokens }) };
                    if (p.trace)
                        saveTrace(p.trace);
                    if (Date.now() - lastSave > 3000) {
                        lastSave = Date.now();
                        void this.persist(record).catch(() => { });
                    }
                },
```

</details>

**依据 3 · 源码核查**：[lib/core/deps-warm.js:61-90](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/deps-warm.js#L61-L90)

预热复制清单并检查依赖文件。

<details>
<summary>查看原文（30行）</summary>

```text
export async function stageManifests(projectDir, warmDir) {
    await mkdir(warmDir, { recursive: true });
    for (const file of NPM_MANIFESTS) {
        const from = path.join(projectDir, file);
        if (existsSync(from))
            await copyFile(from, path.join(warmDir, file));
    }
    return { manifests: await manifestDigests(warmDir) };
}
export function sameManifests(a, b) {
    return NPM_MANIFESTS.every(file => (a[file] ?? null) === (b[file] ?? null));
}
/** Files copied at once: enough to keep the disk busy, few enough to stay clear of open-file limits. */
export const COPY_CONCURRENCY = 32;
/**
 * Recreate `from` at `to` as an independent copy, so nothing a version's
 * checks write can reach the warm tree or another version. Files are copied
 * many at a time, and cloned where the file system can share blocks until a
 * write. Internal links are relocated into the copy. Escaping or dangling
 * links, redirected roots and a nonempty destination reject the copy so
 * the caller can use the version's own frozen install instead.
 */
export async function copyTree(from, to) {
    const plainDirectory = async (dir, role) => {
        const info = await lstat(dir);
        if (!info.isDirectory() || info.isSymbolicLink())
            throw new Error(`${role} must be a plain directory`);
    };
    const inside = (root, target) => {
        const relative = path.relative(root, target);
```

</details>

**依据 4 · 源码核查**：[lib/core/preview.js:301-370](https://github.com/lijiaqi-AI-Product-Manager/dsh-agent-compare/blob/29e6ab84e7c9cd1c070b2a5f5fa4ab0ff42109e1/lib/core/preview.js#L301-L370)

项目脚本预览增加独立运行生命周期。

<details>
<summary>查看原文（70行）</summary>

```text
export function startScriptPreview(dir, command, opts = {}) {
    return startHelperPreview(dir, opts, async (port) => {
        const prepared = await prepareProjectProcess({ argv: command, cwd: dir, signal: opts.signal,
            env: { PORT: String(port), HOST: '127.0.0.1', HOSTNAME: '127.0.0.1', BROWSER: 'none', FORCE_COLOR: '0', NO_COLOR: '1', CI: '1' } }, opts.prepareProjectProcess);
        // Resolve the confined command exactly as other project processes are spawned.
        const spec = spawnSpec(prepared.argv);
        return {
            argv: [process.execPath, PREVIEW_RUNNER, 'script', '--port', String(port), '--cwd', dir, ...(spec.shell ? ['--shell', '--', spec.file] : ['--', spec.file, ...spec.args])],
            env: { ...prepared.env, ...helperEnvironment() },
            ...(prepared.observeStderr ? { observeStderr: prepared.observeStderr } : {}),
        };
    });
}
/** The helper runs on the host's own runtime, which may be Electron. */
function helperEnvironment() {
    return { ELECTRON_RUN_AS_NODE: '1', ...(process.env.SystemRoot ? { SystemRoot: process.env.SystemRoot } : {}) };
}
async function startHelperPreview(dir, opts, launch) {
    if (!existsSync(PREVIEW_RUNNER))
        throw new PreviewError('预览辅助进程缺失，请重新安装插件', '');
    const timeoutMs = opts.timeoutMs ?? 60_000;
    const host = `ac-${randomBytes(16).toString('hex')}.localhost`;
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
        opts.signal?.throwIfAborted();
        const port = await freePort();
        const launched = await launch(port, host);
        const child = startLongRunning(launched.argv, { cwd: dir, env: launched.env });
        const log = new DiagnosticLog(6000);
        let closed = false;
        const exit = new Promise((resolve) => child.once('close', () => { closed = true; resolve(); }));
        child.stdout?.setEncoding('utf8').on('data', (d) => log.push(d));
        child.stderr?.setEncoding('utf8').on('data', (d) => { log.push(d); launched.observeStderr?.(d); });
        const url = `http://${host}:${port}/`;
        const outcome = await waitReady(child, () => url, timeoutMs, opts.signal, ANSWERING);
        if (outcome === 'ready' && child.pid !== undefined) {
            const pid = child.pid;
            let stopping;
            return { url, port, pid, log, stop: () => closed ? Promise.resolve() : stopping ??= (async () => {
                    try {
                        await killTree(pid);
                    }
                    finally {
                        if (!closed && child.exitCode === null && child.signalCode === null)
                            child.kill('SIGKILL');
                    }
                    let timer;
                    try {
                        await Promise.race([exit, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`预览进程 ${pid} 未在终止后退出`)), 5000); })]);
                    }
                    finally {
                        if (timer)
                            clearTimeout(timer);
                    }
                })().catch((error) => { stopping = undefined; throw error; }) };
        }
        try {
            await killTree(child.pid);
        }
        finally {
            if (!closed && child.exitCode === null && child.signalCode === null)
                child.kill('SIGKILL');
        }
        lastError = new PreviewError(outcome === 'exited' ? '预览服务在响应前退出' : outcome === 'aborted' ? 'cancelled' : `预览服务 ${Math.round(timeoutMs / 1000)} 秒内没有在指定端口响应`, log.toString());
        if (outcome === 'aborted')
            break;
        if (outcome !== 'exited' || !/(EADDRINUSE|port .* (in use|already))/i.test(log.toString()))
            break;
    }
    throw lastError ?? new PreviewError('预览服务启动失败', '');
```

</details>

#### 缺口

- 没有相同任务质量、模型用量和人工时间对照。
  **影响**：无法判断净收益
  **进一步探讨**：记录合格候选率、所有候选用量、人工时间和退出清理结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
