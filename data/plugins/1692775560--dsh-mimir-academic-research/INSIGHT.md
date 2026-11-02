# Mimir

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[12f1c57](https://github.com/1692775560/dsh-Mimir-Academic-research/tree/12f1c576c502ad8053357a56fae99e34a1e3f60e)

<!-- BEGIN META -->
[![GitHub ★ 550](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=550&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1692775560/dsh-Mimir-Academic-research)
<!-- END META -->

> **功能**：在DSH中组织文献、论文编译、实验和研究记录，提供工具与工作台，编译或任务状态不替代研究结果核验。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 集中研究工具、编译诊断和源快照；[Q03](#research-q03) 精细job状态披露观察丢失。便利成立于DSH与原件可核，外部引擎/模型贡献分开。

> **主要限制**：[Q02](#research-q02) success、PDF时间与后置源快照不是同次输入/产物摘要绑定；[Q03](#research-q03) 实验failed可含unknown，取消不保证远端停，需查真实结果而非盲重提。

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
  - [Q01 · 研究者为何用工作台而非编辑器和终端？](#detail-section-11)
  - [Q02 · 编译、日志、PDF和快照是否绑定本次修改？](#detail-section-12)
  - [Q03 · 远端排队、停止和unknown代表什么？](#detail-section-13)
  - [Q04 · 从怎样的可核任务试用，成本和退路是什么？](#detail-section-14)
  - [Q05 · 更强研究交付收据是否还有增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有DSH且反复改稿、查实验日志的研究者，用统一项目入口组织编译与结果线索；交付仍需核原件、引用和数据。

编辑器/终端/手工项目目录是直接替代；Mimir改变入口与状态组织，不自行提供科研正确性、TeX或算力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| LaTeX诊断 | 改稿编译与定位错误 | 引擎/源目录，success不证PDF新鲜与科学正确 |
| 源快照 | 有限.tex/.bib历史 | 项目成功编译后best-effort，不含数据/PDF绑定 |
| SSH job | 远程命令排队与查询 | 账户权限，unknown/取消先核真实远端 |
| 研究工作台 | 集中入口与记录 | 工具组织非论文质量保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22/DSH宿主与模型 | 必需 | 插件和Agent会话 | 需同版本兼容验收 |
| latexmk/tectonic | 编译必需 | main.tex到PDF | 缺失给安装指引 |
| 项目目录与域存储 | 必需 | 原稿、状态和快照 | 先备份与回读 |
| SSH/凭据/远端环境 | 远程按需 | job与GPU工作 | 独立核远端结果与权限 |
| dg/可选搜索命令 | 网搜按需 | web_search | 不存在不注册，不能假装已搜索 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份小论文副本并核宿主/引擎/模型 | 不先提交昂贵远端工作 |
| 编译 | 改一处、看诊断、修复重编 | 实际PDF匹配修改与时间 |
| 远端 | 明确job状态/PID/输出与指标 | queued不完成，unknown先核 |
| 交付 | 人审引用、数据和PDF | 程序成功不等科学正确 |
| 退出 | 保留原件/日志回终端 | 远端进程单独确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型/TeX/环境下载 | 项目副本和引擎核验 | 无宿主实测 |
| 持续 | token/存储，GPU按需另计 | 引用、指标与正文核对 | 无节时数据 |
| 失败恢复 | 重编译/查远端/重跑可能另费 | 查旧PDF、unknown和原件 | 取消不证明远端停止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 编译诊断 | 上限、解析、取消与错误指引 | PDF与源版本绑定及语义正确 |
| 状态组织 | 项目状态、源快照和job终态 | 同任务效率/长期可靠性 |
| 远端实验 | 异步排队与unknown披露 | 输出完整/指标正确/实际停止 |

> **思考**：[Q02](#research-q02) success、PDF时间与后置源快照不是同次输入/产物摘要绑定；[Q03](#research-q03) 实验failed可含unknown，取消不保证远端停，需查真实结果而非盲重提。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 集中研究工具、编译诊断和源快照；[Q03](#research-q03) 精细job状态披露观察丢失。便利成立于DSH与原件可核，外部引擎/模型贡献分开。

[Q02](#research-q02) 有界日志、源快照及并发拒绝可借鉴，快照为best-effort且不认证产物；[Q03](#research-q03) 观察丢失与远端退出分开，但实验粗状态需解释，未审全链不推全面可靠。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) success、PDF时间与后置源快照不是同次输入/产物摘要绑定；[Q03](#research-q03) 实验failed可含unknown，取消不保证远端停，需查真实结果而非盲重提。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 现有DSH用户从本地论文副本编译诊断试用，核实际PDF与源修改；远端unknown不自动重提。原件/引用/指标不明即暂停并回编辑器和终端查证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核查与正式旧findings逐项复核；未安装或运行编译/模型/SSH，范围不含全部文献真实性与图表/组会质量，收据是假设。

- 已检查：作者 README、包清单、源码路径 README.md、packages/mimir/package.json、packages/mimir/src/evidence-graph.ts、packages/mimir/src/index.ts、packages/mimir/src/paper-snapshots.ts、packages/mimir/src/services/paper.ts、packages/mimir/src/services/server.ts、packages/mimir/src/tools/latex.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定README、发布包、工具注册、LaTeX/项目编译与快照、SSH job关键终态及证据图模型；未全审文献真伪、所有ledger/组会图表和客户端。
- 下一步：[Q05](#research-q05) 先查已有记录，再对照旧PDF、编译后源变化、缺指标和unknown案例的误验收与总成本，不把设计当已验证。

**分析版本**

- **仓库**：[1692775560/dsh-Mimir-Academic-research](https://github.com/1692775560/dsh-Mimir-Academic-research)
- **版本号**：未声明（[固定提交 12f1c57](https://github.com/1692775560/dsh-Mimir-Academic-research/tree/12f1c576c502ad8053357a56fae99e34a1e3f60e)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是补交付时跨源、PDF/图表、精确job和人工验收绑定；先检查已有snapshot/ledger，只有减少误验收且负担可接受才扩展。

[Q05](#research-q05) 先查已有记录，再对照旧PDF、编译后源变化、缺指标和unknown案例的误验收与总成本，不把设计当已验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 1527 | — | — | 22561 |
| .ts | test | 124 | 25593 | 21448 | 2069 | — |
| .md | example | 2 | 64 | — | — | 628 |
| .ts | source | 134 | 40750 | 27517 | 10922 | — |
| .tsx | source | 31 | 10162 | 8774 | 1075 | — |
| .tsx | test | 2 | 353 | 301 | 33 | — |
| .mjs | source | 1 | 145 | 100 | 35 | — |

</details>

**活跃度**

[![Issue 未关闭 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=32&color=737b86&logo=github)](https://github.com/1692775560/dsh-Mimir-Academic-research/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/1692775560/dsh-Mimir-Academic-research/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/1692775560/dsh-Mimir-Academic-research/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究工作台如何支持可核验的编译和远端结果，采用应限于什么条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 研究者为何用工作台而非编辑器和终端？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者将Mimir定位为DSH内研究生命周期工作台，聚合文献、实验、图表、论文编译、组会与服务器。固定源码能确认arXiv/获取文献/笔记/图表/LaTeX等工具注册，以及服务共享的服务器工具；网页搜索会探测dg或可选内置命令，不存在就不注册。它增加的是项目内操作与状态衔接，TeX排版、模型审稿和远端算力各自来自依赖。

直接基线是论文编辑器、终端和项目目录。对于习惯DSH且反复在改稿、查错误、查实验日志之间切换的人，统一入口和有界诊断有可解释便利；已有成熟写作/实验平台且不需要DSH的人未必值得迁移。合格结果仍是正确引用、可复现数据和已核验的论文产物，功能多与界面齐全不能证明科研创新或实际节时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-28](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/README.md#L20-L28)

作者工作台和工具/技能说明。

```text

## What it is

Mimir is a single npm package (`dsh-mimir`) that plugs into dsh and gives you:

- **Nine-view web workbench** (sidebar toggle → overlay, dark/light, 中/EN):
  **Overview** pipeline & stats · **Paper** Overleaf-style LaTeX studio (edit → compile → PDF preview, one-click AI fix) · **Library** arXiv + web search, AI relevance scoring, fullscreen PDF reader · **Experiments** metric charts, one-click paper figures · **Figures** upload/organize/insert into the paper · **Meetings** one-click group-meeting PPT (real paper figures + optional AI illustrations) · **Servers** GPU fleet probes + remote jobs · **Ledger** humanized research journal — idea evolution auto-captured into a worktree, six-perspective digest capsules, one-click progress report · **Venues** CCF conference-deadline countdown (ccfddl catalog, per-project watchlist) + CCF-A journal directory — every view live-refreshes over SSE as the agent writes, no manual reload
- **Agent tools & slash commands**: `/research-idea` `/research-plan` `/research-review` `/paper-write` `/paper-compile`, plus `arxiv_search`, `web_search`, `wiki_note`, `figure_save`, `latex_compile`, `meeting_deck`, `venue_search`, and the remote-compute quartet `server_list` / `server_check` / `server_submit_job` / `server_list_jobs` (same remembered servers and jobs as the Servers tab)
- **Eleven bundled research skills** (literature review, novelty check, experiment planning, citation audit, bilingual de-AI polish, rebuttal…) that teach the agent the workflow — no setup needed
```

**依据 2 · 源码核查**：[packages/mimir/src/index.ts:1275-1314](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/index.ts#L1275-L1314)

实际注册与可选搜索/服务器工具。

<details>
<summary>查看原文（40行）</summary>

```text
  ctx.tools.register(createArxivSearchTool(resolved.arxiv.maxResults))
  ctx.tools.register(createPaperFetchTool(domain))
  ctx.tools.register(createWikiNoteTool(domain))
  ctx.tools.register(createFigureSaveTool(deps.workspaceDir, domain))
  ctx.tools.register(createFigureOrganizeTool(deps.workspaceDir, domain))
  ctx.tools.register(createMeetingDeckTool(deps.workspaceDir, domain))
  ctx.tools.register(createLatexCompileTool(resolved.latex))
  ctx.tools.register(createVenueSearchTool(deps.workspaceDir))

  // Web search is optional: `auto` registers the tool when `dg` resolves on
  // PATH (probed once) or as the bundled optional dependency; an
  // explicit command always registers and reports install guidance per call
  // when missing. The panel's searchWeb Remote follows the same availability.
  const searchCommand = resolved.search.command === 'auto'
    ? (await commandOnPath(DIGDIG_COMMAND)) ? DIGDIG_COMMAND : bundledDigdigCommand()
    : resolved.search.command
  const searchConfig = searchCommand === undefined
    ? undefined
    : { command: searchCommand, timeoutMs: resolved.search.timeoutMs }
  if (searchCommand !== undefined) {
    ctx.tools.register(createWebSearchTool({
      command: searchCommand,
      timeoutMs: resolved.search.timeoutMs,
      maxResults: resolved.arxiv.maxResults,
    }))
  }
  // The panel's Servers view and the model-callable server_* tools share the
  // same server/job state through ResearchService; the tools only forward, so
  // registering them is a pure addition to the runtime the panel already
  // drives. The controller tests and the ssh-jobs harness construct the
  // service directly, so `ctx.research` may not be set in-process for the
  // full apply() wiring — resolve it lazily at execution time instead of
  // at registration time.
  if (resolved.serverTools.enabled) {
    const getResearch = () => ctx.get('research') as ResearchService | undefined
    ctx.tools.register(createServerListTool(getResearch))
    ctx.tools.register(createServerCheckTool(getResearch))
    ctx.tools.register(createServerSubmitJobTool(getResearch))
    ctx.tools.register(createServerListJobsTool(getResearch))
  }
```

</details>

**依据 3 · 源码核查**：[packages/mimir/package.json:1-18](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/package.json#L1-L18)

发布插件0.22.0而根是工作区。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-mimir",
  "description": "Research-assistant plugin suite (literature search, research wiki, LaTeX compile, independent subagent review) for the DeepSeek Harness",
  "version": "0.22.0",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/1692775560/dsh-Mimir-Academic-research.git",
    "directory": "packages/mimir"
  },
  "type": "module",
  "engines": {
    "node": ">=22"
  },
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
```

</details>

#### 缺口

- 缺乏同任务切换/交付收益对照
  **影响**：不能承诺全生命周期节时或创新质量
  **进一步探讨**：固定一个小论文改稿任务，对照现有编辑器/终端的正确交付与人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 编译、日志、PDF和快照是否绑定本次修改？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

latex_compile用latexmk或tectonic在projectDir运行main.tex，execFile设置超时、AbortSignal和16MiB缓冲，取消拒绝、引擎缺失给安装指引，非零或超时仍给可解析日志。tectonic优先磁盘main.log，磁盘读尾限1MiB，模型log_excerpt限4096字符。success只要求进程无错且解析无error，没有检查PDF内容或与源文件摘要绑定。

面板编译服务按项目拒绝并发，resolvePaperDirReal检查目录，记录observed和PDF mtime；异常保留previous的部分状态，失败不替换旧PDF时间。成功且有projectId才best-effort抓取快照，快照I/O失败吞掉，不影响编译回执；无projectId不抓取。快照收.tex/.bib并记路径、字节数和时间，保留50份，不包括PDF/图表/数据摘要；读取发生在编译结束后，不能据此证明就是引擎读到的同一源版本。

因此已有源回退与observed语义是实质反证，不能声称没有任何追踪；但“本次编译成功→当前图文/数据科学正确”仍不成立。用户须看实际PDF与修改时间并核引用/数据。有界日志、并发拒绝和原件快照可复用，截断/解析/进程退出不能取代产物验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mimir/src/tools/latex.ts:225-247](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/tools/latex.ts#L225-L247)

真实进程参数与失败处理。

<details>
<summary>查看原文（23行）</summary>

```text
): Promise<{ ok: boolean; log: string }> {
  return new Promise((resolve, reject) => {
    execFile(
      engine.executable,
      [...ENGINE_ARGS[engine.kind]],
      { cwd: projectDir, timeout: timeoutMs, signal, maxBuffer: 16 * 1024 * 1024, encoding: 'utf8' },
      (error: ExecFileException | null, stdout: string, stderr: string) => {
        if (error !== null && signal.aborted) {
          reject(new Error('latex_compile was cancelled', { cause: error }))
          return
        }
        if (error !== null && isMissingEngine(error)) {
          const reason = isAbsolute(engine.executable)
            ? `LaTeX engine '${basename(engine.executable)}' was not found: the configured absolute path does not exist or is not executable.`
            : `LaTeX engine '${basename(engine.executable)}' was not found on PATH.`
          reject(new Error(`${reason} ${INSTALL_GUIDANCE}`, { cause: error }))
          return
        }
        // A timeout kill or a non-zero exit still yields a parseable log.
        resolve({ ok: error === null, log: `${stdout}\n${stderr}` })
      },
    )
  })
```

</details>

**依据 2 · 源码核查**：[packages/mimir/src/tools/latex.ts:259-291](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/tools/latex.ts#L259-L291)

success与日志来源。

<details>
<summary>查看原文（33行）</summary>

```text
 */
export async function compileLatex(projectDir: string, options: LatexToolOptions, signal: AbortSignal): Promise<LatexCompileResult> {
  const stats = await stat(projectDir).catch(() => undefined)
  if (stats === undefined || !stats.isDirectory()) {
    throw new Error('latex_compile: project_dir is not an existing directory containing main.tex')
  }
  const engine = await resolveLatexEngine(options.engine, options.probe)
  const { ok, log } = await runEngine(engine, projectDir, options.timeoutMs, signal)
  // Prefer the on-disk TeX log tectonic leaves behind (--keep-logs): it is
  // far richer than tectonic's terse console lines. Capped at the tail — an
  // unbounded readFile let a pathological log into memory whole (#234).
  const diskLog = engine.kind === 'tectonic'
    ? await readLogTail(join(projectDir, 'main.log'))
    : undefined
  const source = diskLog ?? log
  const issues = diskLog !== undefined
    ? parseLatexErrors(diskLog)
    : engine.kind === 'tectonic'
      ? parseTectonicErrors(log)
      : parseLatexErrors(log)
  return {
    success: ok && !issues.some(issue => issue.severity === 'error'),
    engine: engine.kind,
    errors: issues.filter(issue => issue.severity === 'error'),
    warnings: issues.filter(issue => issue.severity === 'warning'),
    log_excerpt: source.slice(-LOG_EXCERPT_CHARS),
  }
}

/** Render one compile outcome as plain text for tools and commands alike. */
export function renderLatexResult(result: LatexCompileResult): string {
  const lines: string[] = [
    result.success
```

</details>

**依据 3 · 源码核查**：[packages/mimir/src/services/paper.ts:498-563](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/services/paper.ts#L498-L563)

项目目录、状态与best-effort快照。

<details>
<summary>查看原文（66行）</summary>

```text
  deps: PaperDeps,
  state: ServiceState,
  request: { projectId?: string; dir?: string | undefined },
  signal: AbortSignal,
): Promise<ResearchCompileResult> {
  const key = request.projectId ?? DEFAULT_KEY
  const record = request.projectId === undefined
    ? undefined
    : deps.domain.table('projects').get(request.projectId)
  if (request.projectId !== undefined && record === undefined) {
    return rejected({ code: 'project-not-found', projectId: request.projectId })
  }
  const dir = await resolvePaperDirReal(deps.workspaceDir, request.dir, record?.paperDir)
  if (dir === undefined) return rejected({ code: 'invalid-dir', dir: request.dir ?? record?.paperDir ?? '' })
  const previous = state.compileStatus.get(key) ?? IDLE_STATUS
  if (previous.state === 'running') {
    return rejected({ code: 'operation-failed', message: 'a compile is already running for this project' })
  }
  state.compileStatus.set(key, { ...previous, state: 'running' })

  let outcome
  try {
    outcome = await compileLatex(dir, deps.latex, signal)
  } catch (error) {
    // Missing engine (ENOENT) or missing paper directory: the run never
    // produced a log, so there are no issues to show — only the message.
    const settled: ResearchCompileStatusView = { ...previous, state: 'error', observed: true }
    state.compileStatus.set(key, settled)
    return rejected({
      code: 'operation-failed',
      message: redactDirs(
        error instanceof Error ? error.message : 'latex compile failed to run',
        deps.workspaceDir,
        dir,
      ),
    })
  }

  const settled: ResearchCompileStatusView = Object.freeze({
    state: outcome.success ? 'ok' : 'error',
    issues: Object.freeze([...outcome.errors, ...outcome.warnings]),
    engine: outcome.engine,
    pdfUpdatedAt: outcome.success
      ? await pdfMtime(join(dir, 'main.pdf'))
      : previous.pdfUpdatedAt,
    observed: true,
  })
  state.compileStatus.set(key, settled)
  await emitEvent(deps.domain, {
    actor: PANEL_ACTOR,
    action: 'writing.compile.settled',
    refs: {
      ...(request.projectId === undefined ? {} : { projectId: request.projectId }),
    },
    payload: { state: settled.state, engine: settled.engine, issues: settled.issues.length },
  })
  if (outcome.success && request.projectId !== undefined) {
    // Best-effort: a snapshot I/O failure must never fail the compile it
    // rides on. The unkeyed compile slot never snapshots (snapshots are
    // per project).
    await captureCompileSnapshot(deps, request.projectId, dir).catch(() => undefined)
  }
  return success(settled)
}

/**
```

</details>

**依据 4 · 源码核查**：[packages/mimir/src/paper-snapshots.ts:17-45](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/paper-snapshots.ts#L17-L45)

扩展名、保留数与manifest。

<details>
<summary>查看原文（29行）</summary>

```text
/** Extensions captured into a snapshot (the paper's source files). */
const SNAPSHOT_EXTENSIONS = ['.tex', '.bib'] as const

/** Snapshots retained per project; older ones are deleted after each capture. */
export const PAPER_SNAPSHOT_LIMIT = 50

/**
 * The snapshot id shape: a compact ISO-8601 UTC timestamp
 * (`20260823T063755939Z`), with a `-N` suffix disambiguating same-millisecond
 * captures. Zero-padded and fixed-width, so lexicographic order is
 * chronological order.
 */
const SNAPSHOT_ID_RE = /^\d{8}T\d{9}Z(?:-\d+)?$/

/** One file entry of one snapshot manifest. */
export interface PaperSnapshotManifestFile {
  /** Path relative to the project's paper directory (`main.tex`, `sections/intro.tex`). */
  readonly path: string
  readonly sizeBytes: number
}

/** The `manifest.json` payload of one snapshot directory. */
export interface PaperSnapshotManifest {
  readonly id: string
  /** ISO-8601 timestamp of the capture. */
  readonly createdAt: string
  readonly files: readonly PaperSnapshotManifestFile[]
}

```

</details>

**依据 5 · 源码核查**：[packages/mimir/src/paper-snapshots.ts:124-146](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/paper-snapshots.ts#L124-L146)

编译之后逐文件读取快照，不带产物hash。

<details>
<summary>查看原文（23行）</summary>

```text
export async function capturePaperSnapshot(
  projectRoot: string,
  paperDir: string,
  now: Date = new Date(),
): Promise<PaperSnapshotManifest | undefined> {
  const files = await collectSourceFiles(paperDir)
  if (files === undefined || files.length === 0) return undefined
  const createdAt = now.toISOString()
  const id = await freshSnapshotId(projectRoot, createdAt)
  const snapshotDir = join(projectRoot, id)
  const manifestFiles: PaperSnapshotManifestFile[] = []
  for (const path of files) {
    const content = await readFile(join(paperDir, path))
    const target = join(snapshotDir, path)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, content)
    manifestFiles.push({ path, sizeBytes: content.byteLength })
  }
  const manifest: PaperSnapshotManifest = { id, createdAt, files: manifestFiles }
  await writeFileAtomic(join(snapshotDir, 'manifest.json'), JSON.stringify(manifest), { mode: 0o666 })
  await prunePaperSnapshots(projectRoot, PAPER_SNAPSHOT_LIMIT)
  return manifest
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 远端排队、停止和unknown代表什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

提交先持久queued再后台运行，调用回执不是任务完成；所有服务入口依赖DSH域存储和SSH可达性、凭据及远端命令权限。SSH正常返回被记succeeded/exit0，数字退出码记failed，输出超缓冲记failed并说明session killed；时长kill且无数字退出码记unknown，明确远端可能继续运行。取消/宿主停止只abort拥有的本地SSH并记cancelled/interrupted，不证明远端子进程已终止。重启恢复将活动记录interrupted，也不能据此断言真实任务失败。

writeBackExperiment进一步把精细job终态映到实验结果，unknown/interrupted等仍可能落failed粗状态；需回job的原始终态与日志，不能看实验failed就重提昂贵训练或修改论文结果。输出超限的failed也是观察/捕获失败，仍需查远端。远程命令能力不构成多租户隔离，权限以所选SSH账户/服务器为实际边界。

这些是状态设计取舍与观察不完备，不是所有远程调用都坏。正确采用条件是能独立检查远端PID、输出和指标，遇unknown先核而不盲重试；本次未启动SSH或核各远端环境。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mimir/src/services/server.ts:504-518](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/services/server.ts#L504-L518)

提交queued语义。

<details>
<summary>查看原文（15行）</summary>

```text
 * `queued` and the run starts in the background: this call returns once
 * the record is durable, and the panel polls `listJobs` for the status
 * flips (`running`, then `succeeded`/`failed`). The command must be
 * non-empty and at most {@link JOB_COMMAND_MAX_CHARS} characters
 * (`invalid-input`), and the server must name an ssh login user (a
 * TCP-only record cannot run jobs). A given `experimentId` must name an
 * experiment record (`experiment-not-found`): a linked experiment flips
 * to `running` with the server link on submit, then to
 * `success`/`failed` when the job settles — unless a newer job linked to
 * the same experiment supersedes the settle.
 * @param deps - open wiki domain.
 * @param state - the service's mutable job counter (incremented here).
 * @param request - the target server, the command line, and the optional
 * experiment link.
 * @returns the queued record.
```

</details>

**依据 2 · 源码核查**：[packages/mimir/src/services/server.ts:611-638](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/services/server.ts#L611-L638)

删除活动job是本地取消。

<details>
<summary>查看原文（28行）</summary>

```text
 * locally-owned SSH client and retains a `cancelled` record because the remote
 * process outcome cannot be proven from a disconnected session.
 * @param deps - open wiki domain.
 * @param state - owning service state and SSH abort handles.
 * @param request - the record id.
 * @returns the affected id.
 */
export async function deleteJob(
  deps: ServerDeps,
  state: ServiceState,
  request: { id: string },
): Promise<ResearchDeleteJobResult> {
  const table = deps.domain.table('jobs')
  const existing = table.get(request.id)
  if (existing === undefined) {
    return rejected({ code: 'job-not-found', id: request.id })
  }
  const abort = state.jobAborts.get(request.id)
  if (abort !== undefined && isActiveJobStatus(existing.status)) {
    // Deleting an active row is a cancel request: the local SSH session is
    // aborted and the record settles `cancelled` (the remote process outcome
    // is unknowable once the session drops). The row stays visible until that
    // terminal flip, so the user can see what was cancelled.
    state.jobStopStatus.set(request.id, 'cancelled')
    abort.abort()
    return success({ id: request.id })
  }
  await table.delete(request.id)
```

</details>

**依据 3 · 源码核查**：[packages/mimir/src/services/server.ts:690-756](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/services/server.ts#L690-L756)

实际成功/输出限额/unknown分支。

<details>
<summary>查看原文（67行）</summary>

```text
  }
  let settled: JobRecord
  const invocation = await sshInvocation(server, running.command)
  try {
    const { stdout, stderr } = await execFileAsync('ssh', [...invocation.args], {
      timeout: deps.jobs?.timeoutMs ?? SSH_JOB_TIMEOUT_MS,
      maxBuffer: deps.jobs?.maxBufferBytes ?? SSH_JOB_MAX_BUFFER_BYTES,
      signal,
      ...(invocation.env === undefined ? {} : { env: invocation.env }),
    })
    settled = {
      ...running, status: 'succeeded', exitCode: 0,
      stdoutTail: tailOf(stdout), stderrTail: tailOf(stderr),
      finishedAt: new Date().toISOString(),
    }
  } catch (error) {
    if (signal.aborted) {
      await invocation.cleanup?.()
      await settleStoppedJob(deps, state, running, state.jobStopStatus.get(id) ?? 'cancelled', error)
      return
    }
    // execFile failures carry the child's exit code and captured output;
    // the ssh client propagates the remote command's exit code as its
    // own, so a numeric code IS the remote exit code. A non-numeric code
    // means the session itself failed (connect refused, spawn error, or
    // the timeout kill) — then the message stands in for stderr.
    const carrier = error as { code?: unknown; killed?: unknown; stdout?: unknown; stderr?: unknown }
    const stdout = typeof carrier.stdout === 'string' ? carrier.stdout : ''
    const stderrText = typeof carrier.stderr === 'string' ? carrier.stderr : ''
    // The lifecycle contract (#225) splits unobserved sessions by cause.
    if (carrier.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') {
      // Output past the capture cap: the session is killed and the record
      // fails LOUDLY — capture never silently truncates.
      const capBytes = deps.jobs?.maxBufferBytes ?? SSH_JOB_MAX_BUFFER_BYTES
      settled = {
        ...running, status: 'failed', exitCode: null,
        stdoutTail: tailOf(stdout),
        stderrTail: tailOf(`${stderrText}\noutput exceeded the ${String(Math.round(capBytes / 1024 / 1024))} MiB capture limit; the session was killed`.trim()),
        finishedAt: new Date().toISOString(),
      }
    } else if (carrier.killed === true && typeof carrier.code !== 'number') {
      // The duration-cap kill: observation was lost without user intent, so
      // the job settles `unknown` — the remote process may still be running.
      const capMs = deps.jobs?.timeoutMs ?? SSH_JOB_TIMEOUT_MS
      settled = {
        ...running, status: 'unknown', exitCode: null,
        stdoutTail: tailOf(stdout),
        stderrTail: tailOf(`${stderrText}\nsession exceeded the ${String(Math.round(capMs / 60_000))}-minute limit and was dropped; the remote process may still be running (outcome unobserved)`.trim()),
        finishedAt: new Date().toISOString(),
      }
    } else {
      const exitCode = typeof carrier.code === 'number' ? carrier.code : null
      const stderr = stderrText.trim() !== ''
        ? stderrText
        : error instanceof Error ? error.message : 'ssh job failed'
      settled = {
        ...running, status: 'failed', exitCode,
        stdoutTail: tailOf(stdout), stderrTail: tailOf(stderr),
        finishedAt: new Date().toISOString(),
      }
    }
  }
  await invocation.cleanup?.()
  await finishJob(deps, state, settled)
}

/** Abort every active SSH session this service owns (host dispose path). */
```

</details>

**依据 4 · 源码核查**：[packages/mimir/src/services/server.ts:877-923](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/services/server.ts#L877-L923)

job与实验粗状态映射。

<details>
<summary>查看原文（47行）</summary>

```text
 * lifecycle status (`succeeded` → `success`, otherwise `failed`), record
 * the outcome (exit code, wall-clock duration, finished timestamp,
 * trailing log excerpt) as the record's `lastJob`, and append one line to
 * the workspace's `EXPERIMENT_LOG.md`. An unlinked or deleted experiment
 * is skipped; the log append is best-effort and never fails the settle.
 *
 * The experiment lifecycle is deliberately coarser than the job's (#225):
 * `cancelled`/`interrupted`/`unknown` all land as `failed` there, because
 * the run produced no usable result — the job record keeps the precise
 * cause.
 *
 * Stale-settle guard: when a NEWER job is linked to the same experiment
 * (submitted after this one, in any status), that job owns the
 * experiment's state, so this late settle leaves the record untouched and
 * only lands in the log — otherwise an old job finishing last would flip
 * the status back over the newer job's write-back.
 * @param deps - open wiki domain plus workspace root.
 * @param job - the settled job record.
 */
async function writeBackExperiment(deps: ServerDeps, job: JobRecord): Promise<void> {
  if (job.experimentId === undefined) return
  const table = deps.domain.table('experiments')
  const existing = table.get(job.experimentId)
  if (existing === undefined) return
  const finishedAt = job.finishedAt ?? new Date().toISOString()
  const startedMs = job.startedAt !== undefined ? Date.parse(job.startedAt) : Number.NaN
  const finishedMs = Date.parse(finishedAt)
  const outcome: ExperimentJobOutcome = {
    jobId: job.id,
    status: job.status === 'succeeded' ? 'succeeded' : job.status === 'cancelled' ? 'cancelled' : 'failed',
    exitCode: job.exitCode,
    durationMs: Number.isFinite(startedMs) && Number.isFinite(finishedMs)
      ? Math.max(0, finishedMs - startedMs)
      : null,
    finishedAt,
    summary: jobSummaryOf(job),
  }
  if (hasNewerLinkedJob(deps, job)) {
    await appendExperimentLog(deps, existing.name, outcome).catch(() => {})
    return
  }
  await table.put(existing.id, {
    ...existing,
    status: outcome.status === 'succeeded' ? 'success' : 'failed',
    lastJob: outcome,
    updatedAt: new Date().toISOString(),
  })
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 从怎样的可核任务试用，成本和退路是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

最值得试的是已有DSH用户用论文副本做本地改稿→编译→核PDF，先不托管真实昂贵实验。确认Node>=22、DSH宿主服务、模型配置和latexmk/tectonic，保存原项目备份，再在副本验证一处有意错误、修复与PDF更新；成功标准是日志诊断匹配且实际PDF符合修改，而非工具success一项。

首次需要环境/TeX和模型准备，持续有模型token、论文/图表存储、引用数据人工核对；启用远程另有服务器/GPU/网络费用和凭据维护。失败重编译/重跑成本未知，尤其unknown先查远端而不是自动重复；退出保留原件和日志，回编辑器及终端。任何来源不明、旧PDF、新日志不匹配或实验无可核指标都应停止交付。没有时间/现金/模型耗用对照，不将聚合界面当成本下降。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:40-46](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/README.md#L40-L46)

作者Quickstart前提。

````text
## Quickstart

Prerequisites: Node.js ≥ 22, the dsh CLI (`npm install -g @deepseek-ai/dsh`), and a `DEEPSEEK_API_KEY` for agent sessions.

```sh
dsh plugin --profile web add dsh-mimir@latest   # installs and self-activates
dsh web                                          # then open http://127.0.0.1:3080
````

**依据 2 · 源码核查**：[packages/mimir/package.json:1-18](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/package.json#L1-L18)

Node版本与插件。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-mimir",
  "description": "Research-assistant plugin suite (literature search, research wiki, LaTeX compile, independent subagent review) for the DeepSeek Harness",
  "version": "0.22.0",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/1692775560/dsh-Mimir-Academic-research.git",
    "directory": "packages/mimir"
  },
  "type": "module",
  "engines": {
    "node": ">=22"
  },
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
```

</details>

**依据 3 · 源码核查**：[packages/mimir/src/tools/latex.ts:225-247](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/tools/latex.ts#L225-L247)

编译资源上限与失败负担。

<details>
<summary>查看原文（23行）</summary>

```text
): Promise<{ ok: boolean; log: string }> {
  return new Promise((resolve, reject) => {
    execFile(
      engine.executable,
      [...ENGINE_ARGS[engine.kind]],
      { cwd: projectDir, timeout: timeoutMs, signal, maxBuffer: 16 * 1024 * 1024, encoding: 'utf8' },
      (error: ExecFileException | null, stdout: string, stderr: string) => {
        if (error !== null && signal.aborted) {
          reject(new Error('latex_compile was cancelled', { cause: error }))
          return
        }
        if (error !== null && isMissingEngine(error)) {
          const reason = isAbsolute(engine.executable)
            ? `LaTeX engine '${basename(engine.executable)}' was not found: the configured absolute path does not exist or is not executable.`
            : `LaTeX engine '${basename(engine.executable)}' was not found on PATH.`
          reject(new Error(`${reason} ${INSTALL_GUIDANCE}`, { cause: error }))
          return
        }
        // A timeout kill or a non-zero exit still yields a parseable log.
        resolve({ ok: error === null, log: `${stdout}\n${stderr}` })
      },
    )
  })
```

</details>

**依据 4 · 源码核查**：[packages/mimir/src/services/server.ts:733-744](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/services/server.ts#L733-L744)

unknown需要远端核查。

<details>
<summary>查看原文（12行）</summary>

```text
      const capMs = deps.jobs?.timeoutMs ?? SSH_JOB_TIMEOUT_MS
      settled = {
        ...running, status: 'unknown', exitCode: null,
        stdoutTail: tailOf(stdout),
        stderrTail: tailOf(`${stderrText}\nsession exceeded the ${String(Math.round(capMs / 60_000))}-minute limit and was dropped; the remote process may still be running (outcome unobserved)`.trim()),
        finishedAt: new Date().toISOString(),
      }
    } else {
      const exitCode = typeof carrier.code === 'number' ? carrier.code : null
      const stderr = stderrText.trim() !== ''
        ? stderrText
        : error instanceof Error ? error.message : 'ssh job failed'
```

</details>

#### 缺口

- 没有同版本宿主/TeX/SSH与任务成本实测
  **影响**：不能持续采用或承诺节省
  **进一步探讨**：对小论文副本验收，记录环境、模型token、人工与失败恢复时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 更强研究交付收据是否还有增量？

**研究主题**：新假设与验证

#### 完整回答

当前已有源快照、编译observed/PDF时间和ledger派生证据图，不能把“增加追踪”笼统说成新贡献。证据图注释明确L0为事件，L1为每次读取派生的关系，不持久化为事实；别名去重与supports/contradicts并不验证引文和科学主张。源快照也不包含PDF与数据版本绑定。

未验证假设限为在交付时绑定实际编译输入、PDF/图表摘要、实验精确job终态和人工结果验收，标识跨产物陈旧/未知依赖。对照已有snapshot+ledger，不另做平行真相源；在隔离小项目分别放旧PDF、编译后改源、成功退出无指标和unknown任务，比较误验收、查证时间与维护负担。若现有记录已足够或新收据变成漂移状态/不减少误验收则否定。源码可推导缺口，不表示实验已做或需求已证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mimir/src/paper-snapshots.ts:124-146](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/paper-snapshots.ts#L124-L146)

现有快照范围构成增量边界。

<details>
<summary>查看原文（23行）</summary>

```text
export async function capturePaperSnapshot(
  projectRoot: string,
  paperDir: string,
  now: Date = new Date(),
): Promise<PaperSnapshotManifest | undefined> {
  const files = await collectSourceFiles(paperDir)
  if (files === undefined || files.length === 0) return undefined
  const createdAt = now.toISOString()
  const id = await freshSnapshotId(projectRoot, createdAt)
  const snapshotDir = join(projectRoot, id)
  const manifestFiles: PaperSnapshotManifestFile[] = []
  for (const path of files) {
    const content = await readFile(join(paperDir, path))
    const target = join(snapshotDir, path)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, content)
    manifestFiles.push({ path, sizeBytes: content.byteLength })
  }
  const manifest: PaperSnapshotManifest = { id, createdAt, files: manifestFiles }
  await writeFileAtomic(join(snapshotDir, 'manifest.json'), JSON.stringify(manifest), { mode: 0o666 })
  await prunePaperSnapshots(projectRoot, PAPER_SNAPSHOT_LIMIT)
  return manifest
}
```

</details>

**依据 2 · 源码核查**：[packages/mimir/src/evidence-graph.ts:9-34](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/12f1c576c502ad8053357a56fae99e34a1e3f60e/packages/mimir/src/evidence-graph.ts#L9-L34)

已有派生图、去重和撤回，不认证科学事实。

<details>
<summary>查看原文（26行）</summary>

```text
 * Layering (v1.0 §2.1): L0 facts are the `events` rows themselves — the only
 * new actions are `evidence.edge.added` and `evidence.edge.retracted`, both
 * best-effort emissions over the existing `emitEvent` contract. Everything
 * this module produces is L1: a pure fold product that exists only in Remote
 * responses and UI memory. It is NEVER persisted as fact, and there is no L2
 * cache in v1 — the whole fold reruns per read, same cost model as
 * `generateBrief`.
 *
 * Resolution rules (v1.1 §2.1):
 *  - **Dedup**: declarations sharing a `dedupKey` merge into one edge; the
 *    earliest event id survives, the rest count in `stats.duplicateEdges`.
 *  - **Retraction**: last-declaration-wins per dedupKey. A retracted edge is
 *    KEPT in `edges[]` (marked `retracted` + `retractedAt/retractedBy`), can
 *    be re-asserted back to active, and a retraction pointing at a dedupKey
 *    that never appeared counts in `stats.retractOrphans` (disclosed, never
 *    silent — I2). The fold resolves state; it does NOT enforce permissions
 *    (the service boundary owns authorization).
 *  - **Alias merge**: `keys` aliases (arxiv/doi/url/titleFp) and the fold-
 *    derived title fingerprints of `literature.paper.imported` unify
 *    literature nodes through a union-find whose root is always the
 *    lexicographically smallest key, so the canonical node key is
 *    deterministic regardless of event order. Merge counts disclose in
 *    `stats.aliasMerges`.
 *  - **Conflicts**: only the ACTIVE口径 pairs a `supports` edge against a
 *    `contradicts` edge onto the same claim node — a retracted assertion
 *    never triggers a conflict.
```

</details>

#### 缺口

- 未完整核所有ledger/图表产物绑定，也无收据对照
  **影响**：不能断言系统全无绑定或拟议机制值得做
  **进一步探讨**：先检现有接口是否已覆盖，再隔离做陈旧/未知案例净价值比较。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
