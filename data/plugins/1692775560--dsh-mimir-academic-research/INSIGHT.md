# Mimir

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[32d0af2](https://github.com/1692775560/dsh-Mimir-Academic-research/tree/32d0af2004266f969ca259d07018928498fd2329)

<!-- BEGIN META -->
[![GitHub ★ 547](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=547&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1692775560/dsh-Mimir-Academic-research)
<!-- END META -->

> **功能**：在 DSH 中组织文献、论文 LaTeX、实验、图表、组会与远程任务的研究工作台

> **亮点**：[Q01](#research-q01)将研究工具和状态组织到DSH；[Q02](#research-q02)提供有界日志诊断；[Q03](#research-q03)区分远程结果unknown和本地失败，有利于避免错误重提。外部编译、模型与服务器能力分别归原依赖。

> **主要限制**：[Q02](#research-q02)编译success不绑定论文语义和PDF新鲜度；[Q03](#research-q03)实验failed可能只是远端结果未知，不能据界面状态重跑或写论文结论。

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
  - [Q01 · 相比编辑器加终端，工作台如何组织研究交付？](#detail-section-11)
  - [Q02 · latex_compile 实际检查什么，取消和诊断如何返回？](#detail-section-12)
  - [Q03 · 远程任务 queued、failed、unknown 能否代表实验结果？](#detail-section-13)
  - [Q04 · 谁适合有限试用，安装和持续成本有哪些？](#detail-section-14)
  - [Q05 · 能否把论文源码、编译 PDF 和实验收据绑定？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有DSH且习惯源码/实验文件的研究者，希望在一个会话组织编译、诊断和结果线索。

本地编辑器/LaTeX终端、文献管理器与SSH终端，保留原始论文和实验数据再人工验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地编译 | 引擎执行与结构诊断 | 不验论文科学内容 |
| 任务状态 | 远程排队与结果分类 | unknown不代表远程停止 |
| 研究工作台 | 集中工具与记录 | 九视图非本轮全部验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配DSH/Node22+与模型 | AI流程需 | 宿主工具和工作台 | 原编辑器仍保留 |
| latexmk或tectonic | 编译必需 | 生成PDF与诊断 | 缺引擎停止，不能模拟成功 |
| 检索网络、dg/SearXNG等 | 对应检索才需 | 文献与网页 | 失败回官方来源 |
| SSH授权和服务器 | 远程才需 | 运行真实实验 | unknown先核服务器进程 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 研究者备份论文并配引擎 | 原工具能读源码 |
| 编译 | 工具执行main.tex并回诊断 | 核新PDF而非只看success |
| 修订 | 作者检查内容、引用和版式 | 科学判断由人负责 |
| 异常 | 作者查旧PDF或远端job | unknown不盲重提，回原终端 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 模型、本地TeX与依赖下载 | 宿主/引擎与项目副本配置 | 无同版运行 |
| 持续使用 | 模型、存储，远程算力另计 | 引用、指标与正文审核 | 无节时或token实测 |
| 失败恢复 | 重编译/重跑可能再付资源 | 查日志、PDF时间和远端进程 | 取消不保证远程任务停止 |
| 退出 | 保留原项目与实验数据 | 回编辑器与终端 | 工作台不是科研正确性真相源 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 编译诊断 | 进程、日志解析与取消 | 论文语义和PDF版本匹配 |
| 远程任务 | queued持久化与unknown终态 | 远端实际已停止/实验成功 |
| 研究组织 | 工具和项目视图集成 | 创新质量、引用准确与真实收益 |

> **思考**：[Q02](#research-q02)编译success不绑定论文语义和PDF新鲜度；[Q03](#research-q03)实验failed可能只是远端结果未知，不能据界面状态重跑或写论文结论。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)将研究工具和状态组织到DSH；[Q02](#research-q02)提供有界日志诊断；[Q03](#research-q03)区分远程结果unknown和本地失败，有利于避免错误重提。外部编译、模型与服务器能力分别归原依赖。

[Q02](#research-q02)进程取消、日志上限和诊断封装可借鉴；[Q03](#research-q03)超时结果unknown与实验粗状态分开，避免把未观测写成真实远端失败。未审全服务不补写全面可靠性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)编译success不绑定论文语义和PDF新鲜度；[Q03](#research-q03)实验failed可能只是远端结果未知，不能据界面状态重跑或写论文结论。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从本地论文副本编译试用，不自动启用全生命周期。PDF不符或job unknown先停止并核原文件与远端。

最小验证在一个可公开小论文项目中分别制造旧PDF、成功退出但缺指标、远程unknown和正常结果，比较现有界面与绑定收据发现陈旧或不完整交付的准确率、人工时间和模型补查token。先核现有paper snapshot/ledger功能能否已承担这些绑定；若已有方案足够、收据维护变成额外漂移状态或不能降低误验收，就停止独立扩展。尚无实测节省率或需求验证。 见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

编译工具和远程状态分支有固定源码支持；真实科研质量、当前宿主、全视图与运行收益未验证。跨产物收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/mimir/package.json、packages/mimir/src/index.ts、packages/mimir/src/tools/latex.ts、packages/mimir/src/tools/server.ts、packages/mimir/src/services/server.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定32d0af2004266f969ca259d07018928498fd2329，检查README、包、工具注册、LaTeX引擎与诊断、远程job排队及关键终态；未全面审查文献真实性、ledger、图表与组会生成。
- 下一步：仅固定源码核查，未安装、运行LaTeX、SSH任务或其测试；无论文质量、合格任务成本或端到端验收。

**分析版本**

- **仓库**：[1692775560/dsh-Mimir-Academic-research](https://github.com/1692775560/dsh-Mimir-Academic-research)
- **版本号**：未声明（[固定提交 32d0af2](https://github.com/1692775560/dsh-Mimir-Academic-research/tree/32d0af2004266f969ca259d07018928498fd2329)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可提出未验证的研究交付收据，将当前论文/数据版本、模型生成或人工修改来源、编译产物摘要、实验job精确终态和人工结论验收绑定。相对工作台里分别显示编译success与实验failed，它能指出哪些图表和文字仍依赖旧PDF、未知远端任务或未核对数据。它不会把程序运行成功提升为科学主张正确。

最小验证在一个可公开小论文项目中分别制造旧PDF、成功退出但缺指标、远程unknown和正常结果，比较现有界面与绑定收据发现陈旧或不完整交付的准确率、人工时间和模型补查token。先核现有paper snapshot/ledger功能能否已承担这些绑定；若已有方案足够、收据维护变成额外漂移状态或不能降低误验收，就停止独立扩展。尚无实测节省率或需求验证。 见 [Q05](#research-q05)。

仅固定源码核查，未安装、运行LaTeX、SSH任务或其测试；无论文质量、合格任务成本或端到端验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 1523 | — | — | 21806 |
| .ts | test | 121 | 24967 | 20967 | 1978 | — |
| .md | example | 2 | 64 | — | — | 628 |
| .ts | source | 132 | 40273 | 27273 | 10707 | — |
| .tsx | source | 31 | 10164 | 8772 | 1076 | — |
| .tsx | test | 2 | 353 | 301 | 33 | — |
| .mjs | source | 1 | 145 | 100 | 35 | — |

</details>

**活跃度**

[![Issue 未关闭 35](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=35&color=737b86&logo=github)](https://github.com/1692775560/dsh-Mimir-Academic-research/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/1692775560/dsh-Mimir-Academic-research/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/1692775560/dsh-Mimir-Academic-research/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地论文编译与远程实验状态实际保障到哪里，如何避免把执行状态当科研结论？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比编辑器加终端，工作台如何组织研究交付？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户是已有DSH、习惯以论文源码和实验文件工作，需要在文献、写稿、编译和结果间切换的研究者。简单基线是编辑器/LaTeX编译器、文献库和SSH终端分开使用。Mimir把多种研究视图、工具与项目记录组织到一个会话工作台；index实际注册论文、图、编译和可选server工具，说明不只是README功能清单。

贡献是科研流程的接入与状态组织，LaTeX排版来自外部引擎、论文数据来自外部来源、实验执行来自服务器，模型和子Agent归DSH。界面显示AI相关性评分、审稿或实验success都不能自动证明论文创新、引用真实或实验结论成立；本轮聚焦编译与远程状态主链，不声称九视图全审。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:23-28](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/README.md#L23-L28)

作者定义研究视图、工具与Skills范围。

```text
Mimir is a single npm package (`dsh-mimir`) that plugs into dsh and gives you:

- **Nine-view web workbench** (sidebar toggle → overlay, dark/light, 中/EN):
  **Overview** pipeline & stats · **Paper** Overleaf-style LaTeX studio (edit → compile → PDF preview, one-click AI fix) · **Library** arXiv + web search, AI relevance scoring, fullscreen PDF reader · **Experiments** metric charts, one-click paper figures · **Figures** upload/organize/insert into the paper · **Meetings** one-click group-meeting PPT (real paper figures + optional AI illustrations) · **Servers** GPU fleet probes + remote jobs · **Ledger** humanized research journal — idea evolution auto-captured into a worktree, six-perspective digest capsules, one-click progress report · **Venues** CCF conference-deadline countdown (ccfddl catalog, per-project watchlist) + CCF-A journal directory — every view live-refreshes over SSE as the agent writes, no manual reload
- **Agent tools & slash commands**: `/research-idea` `/research-plan` `/research-review` `/paper-write` `/paper-compile`, plus `arxiv_search`, `web_search`, `wiki_note`, `figure_save`, `latex_compile`, `meeting_deck`, `venue_search`, and the remote-compute quartet `server_list` / `server_check` / `server_submit_job` / `server_list_jobs` (same remembered servers and jobs as the Servers tab)
- **Eleven bundled research skills** (literature review, novelty check, experiment planning, citation audit, bilingual de-AI polish, rebuttal…) that teach the agent the workflow — no setup needed
```

**依据 2 · 源码核查**：[packages/mimir/src/index.ts:1227-1234](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/src/index.ts#L1227-L1234)

实际注册论文/图/LaTeX等工具。

```text
  ctx.tools.register(createArxivSearchTool(resolved.arxiv.maxResults))
  ctx.tools.register(createPaperFetchTool(domain))
  ctx.tools.register(createWikiNoteTool(domain))
  ctx.tools.register(createFigureSaveTool(deps.workspaceDir, domain))
  ctx.tools.register(createFigureOrganizeTool(deps.workspaceDir, domain))
  ctx.tools.register(createMeetingDeckTool(deps.workspaceDir, domain))
  ctx.tools.register(createLatexCompileTool(resolved.latex))
  ctx.tools.register(createVenueSearchTool(deps.workspaceDir))
```

**依据 3 · 源码核查**：[packages/mimir/src/index.ts:1253-1265](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/src/index.ts#L1253-L1265)

server工具共用ResearchService的实际注册。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · latex_compile 实际检查什么，取消和诊断如何返回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具选择latexmk或tectonic，在传入project_dir中用execFile运行main.tex，设置timeout、signal和16MiB输出限制；用户取消使调用拒绝，非零退出仍返回可解析日志。tectonic优先读磁盘main.log尾部，限制1MiB，返回模型的log_excerpt再限4096字符，避免把病态日志整份灌入上下文。

success判据是进程无错误且解析结果没有error，不验证论文科学内容，也没有在这条函数中将当前源码哈希、实际PDF摘要和编译结果绑定。因此已有PDF可预览不等于本次改稿已形成新PDF；需要核对原件和产物时点。日志诊断有明确价值，但可能受解析规则与截断影响，不能代替实际PDF检查。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mimir/src/tools/latex.ts:80-91](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/src/tools/latex.ts#L80-L91)

固定引擎参数与探测。

<details>
<summary>查看原文（12行）</summary>

```text
/** Engine command line per dialect; both run inside the project directory. */
const ENGINE_ARGS: Record<LatexEngineKind, readonly string[]> = {
  latexmk: ['-pdf', '-interaction=nonstopmode', '-halt-on-error', 'main.tex'],
  tectonic: ['--keep-logs', '--synctex', 'main.tex'],
}

/** Real PATH probe: `<command> --version` runs to completion, or ENOENT says absent. */
async function probeOnPath(command: string): Promise<boolean> {
  return new Promise((resolve) => {
    execFile(command, ['--version'], { timeout: 10_000 }, (error: ExecFileException | null) => {
      resolve(error === null || !isMissingEngine(error))
    })
```

</details>

**依据 2 · 源码核查**：[packages/mimir/src/tools/latex.ts:200-215](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/src/tools/latex.ts#L200-L215)

磁盘日志尾部限制。

<details>
<summary>查看原文（16行）</summary>

```text
export async function readLogTail(logPath: string): Promise<string | undefined> {
  const stats = await stat(logPath).catch(() => undefined)
  if (stats?.isFile() !== true) return undefined
  if (stats.size <= DISK_LOG_MAX_BYTES) {
    return readFile(logPath, 'utf8').catch(() => undefined)
  }
  const handle = await open(logPath, 'r').catch(() => undefined)
  if (handle === undefined) return undefined
  try {
    const buffer = Buffer.alloc(DISK_LOG_MAX_BYTES)
    await handle.read(buffer, 0, DISK_LOG_MAX_BYTES, stats.size - DISK_LOG_MAX_BYTES)
    const text = buffer.toString('utf8')
    const firstNewline = text.indexOf('\n')
    return firstNewline === -1 ? text : text.slice(firstNewline + 1)
  } finally {
    await handle.close()
```

</details>

**依据 3 · 源码核查**：[packages/mimir/src/tools/latex.ts:219-244](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/src/tools/latex.ts#L219-L244)

execFile、取消和失败返回。

<details>
<summary>查看原文（26行）</summary>

```text
/** Run the engine once, resolving with the merged output and the exit status. */
function runEngine(
  engine: ResolvedLatexEngine,
  projectDir: string,
  timeoutMs: number,
  signal: AbortSignal,
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
```

</details>

**依据 4 · 源码核查**：[packages/mimir/src/tools/latex.ts:260-284](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/src/tools/latex.ts#L260-L284)

success只由退出与诊断判定，不绑定PDF或源码摘要。

<details>
<summary>查看原文（25行）</summary>

```text
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
```

</details>

#### 缺口

- 具体论文项目编译产物新鲜度和真实排版未运行检查。
  **影响**：不能把编译success当可交付论文，更不能承诺引用正确。
  **进一步探讨**：在文件副本改一处可见文字后编译，核对PDF内容、源码版本和诊断，再测试故意编译错误。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 远程任务 queued、failed、unknown 能否代表实验结果？

**研究主题**：缺陷与关键质疑

#### 完整回答

queued代表job记录已持久保存；submit先检查服务器、命令和关联实验，再写jobs并把关联实验标running，实际远端运行尚未完成。SSH数值退出码用于任务成功/失败，输出超cap明确failed；时长超cap杀掉的是本地观测会话，代码记unknown并说明远端进程可能还在运行。用户取消或宿主退出也保留远端结果未知说明，不能因此宣称服务器任务已停止。

实验层状态比job粗，将unknown/interrupted/cancelled映成failed用于“没有可用结果”，精确原因保留在job。这意味着看实验failed不能断言远端计算失败，须回job和服务器对账；即使SSH退出0，也不证明指标可信或论文主张通过。该区分是合理设计，操作上必须避免未知状态后盲目重提造成重复GPU任务。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mimir/src/services/server.ts:407-448](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/src/services/server.ts#L407-L448)

queued持久化与实验running先于实际完成。

<details>
<summary>查看原文（42行）</summary>

```text
export async function submitJob(
  deps: ServerDeps,
  state: ServiceState,
  request: {
    serverId: string
    command: string
    experimentId?: string | undefined
  },
): Promise<ResearchSubmitJobResult> {
  const server = deps.domain.table('servers').get(request.serverId)
  if (server === undefined) {
    return rejected({ code: 'server-not-found', id: request.serverId })
  }
  const command = request.command.trim()
  if (command === '') return rejected({ code: 'invalid-input', message: 'command must be non-empty' })
  if (command.length > JOB_COMMAND_MAX_CHARS) {
    return rejected({ code: 'invalid-input', message: `command must be at most ${String(JOB_COMMAND_MAX_CHARS)} characters` })
  }
  if (server.username === '') {
    return rejected({ code: 'invalid-input', message: `server ${server.name} has no ssh login user` })
  }
  if (request.experimentId !== undefined
    && deps.domain.table('experiments').get(request.experimentId) === undefined) {
    return rejected({ code: 'experiment-not-found', id: request.experimentId })
  }
  state.jobSeq += 1
  const job: JobRecord = {
    id: `job-${Date.now().toString(36)}-${String(state.jobSeq)}`,
    serverId: server.id,
    command,
    status: 'queued',
    // Absent, never `undefined`: an explicit undefined key would pollute the
    // stored record and trip the gateway's JSON boundary validation.
    ...(request.experimentId === undefined ? {} : { experimentId: request.experimentId }),
    exitCode: null,
    stdoutTail: '',
    stderrTail: '',
    createdAt: new Date().toISOString(),
  }
  await deps.domain.table('jobs').put(job.id, job)
  if (request.experimentId !== undefined) {
    await markExperiment(deps, request.experimentId, 'running', server.id)
```

</details>

**依据 2 · 源码核查**：[packages/mimir/src/services/server.ts:580-634](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/src/services/server.ts#L580-L634)

SSH退出与超限unknown的实际分支。

<details>
<summary>查看原文（55行）</summary>

```text
      running.command,
    ], {
      timeout: deps.jobs?.timeoutMs ?? SSH_JOB_TIMEOUT_MS,
      maxBuffer: deps.jobs?.maxBufferBytes ?? SSH_JOB_MAX_BUFFER_BYTES,
      signal,
    })
    settled = {
      ...running, status: 'succeeded', exitCode: 0,
      stdoutTail: tailOf(stdout), stderrTail: tailOf(stderr),
      finishedAt: new Date().toISOString(),
    }
  } catch (error) {
    if (signal.aborted) {
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
```

</details>

**依据 3 · 源码核查**：[packages/mimir/src/services/server.ts:650-684](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/src/services/server.ts#L650-L684)

取消/中断保留远端结果未知。

<details>
<summary>查看原文（35行）</summary>

```text
/**
 * Settle an aborted SSH session without claiming a remote process outcome:
 * `cancelled` for a user/delete cancel, `interrupted` for host dispose.
 * The preserved output tails ride any stderr the child captured before the
 * abort; a fabricated success/failure is never written for a session whose
 * remote outcome is unknowable.
 */
async function settleStoppedJob(
  deps: ServerDeps,
  state: ServiceState,
  job: JobRecord,
  status: 'cancelled' | 'interrupted',
  error?: unknown,
): Promise<void> {
  const current = deps.domain.table('jobs').get(job.id)
  if (current === undefined) {
    state.jobAborts.delete(job.id)
    state.jobStopStatus.delete(job.id)
    return
  }
  const carrier = error as { stdout?: unknown; stderr?: unknown } | undefined
  const stdout = typeof carrier?.stdout === 'string' ? carrier.stdout : ''
  const note = status === 'cancelled'
    ? 'cancelled locally; remote process outcome is unknown'
    : 'host stopped before the job outcome was known'
  const stderr = typeof carrier?.stderr === 'string' && carrier.stderr.trim() !== ''
    ? `${carrier.stderr}\n${note}`
    : note
  await finishJob(deps, state, {
    ...current,
    status,
    exitCode: null,
    stdoutTail: tailOf(stdout),
    stderrTail: tailOf(stderr),
    finishedAt: new Date().toISOString(),
```

</details>

**依据 4 · 源码核查**：[packages/mimir/src/services/server.ts:725-737](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/src/services/server.ts#L725-L737)

实验粗状态与job精状态分开。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

#### 缺口

- 重连后的远端PID、任务幂等与结果回收在目标部署未验证。
  **影响**：不能把本地取消或failed当远端已经停止，不能承诺恰好一次。
  **进一步探讨**：用无风险短任务模拟断线，核服务器进程和结果后再决定重试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁适合有限试用，安装和持续成本有哪些？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

建议已有DSH与可信本地LaTeX项目的研究者，以项目副本做一次编译、诊断修复和PDF核对的有限试用；暂不把远程GPU提交、全部文献与自动审稿纳入采用保证。Node/DSH版本要匹配，LaTeX需要本机引擎，网络检索需对应服务，远程任务需要SSH账户与服务器授权。根仓库private workspace，发布包实际在packages/mimir，不能用根包版本/名称替代发布组件。

现金包括模型、TeX首次依赖下载、远程算力和网络/存储；人工包括引用与科学结论核查、编译修复、结果对账和版本维护，未实测不计零。若PDF与源码不一致、诊断状态不清或远程任务unknown，停止进一步提交，回本地编辑器和终端查看已有原件/进程。工具缩短来回切换是可解释潜力，不是已验证科研产出或省token。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:40-62](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/README.md#L40-L62)

宿主、模型、LaTeX和可选检索前提。

<details>
<summary>查看原文（23行）</summary>

````text
## Quickstart

Prerequisites: Node.js ≥ 22, the dsh CLI (`npm install -g @deepseek-ai/dsh`), and a `DEEPSEEK_API_KEY` for agent sessions.

```sh
dsh plugin --profile web add dsh-mimir@latest   # installs and self-activates
dsh web                                          # then open http://127.0.0.1:3080
```

Got an old version (e.g. 0.11.x/0.12.x)? dsh's plugin store uses pnpm, which holds back freshly published releases by default. Pin the exact version instead: `dsh plugin --profile web remove dsh-mimir && dsh plugin --profile web add dsh-mimir@0.21.2`

Version compatibility: **0.21.2 requires dsh ≥ 0.2.0-rc.1** (upstream removed the runtime-invariants package and replaced the global current-session API with mainView retention + `uiWorkspace.openSession`; verified against 0.2.1-alpha.2). 0.21.0 and 0.21.1 are broken on dsh 0.2.x — their Typert manifest still emitted the retired `schema:` codec, so the whole `research` Remote failed to compose and every workspace read as empty; upgrade to 0.21.2. On dsh 0.1.x, pin the previous release: `dsh plugin --profile web add dsh-mimir@0.21.0`. **0.18.x–0.21.1 require dsh ≥ 0.1.2-alpha.4**; on an older dsh, pin 0.16.0.

Click **Mimir** in the sidebar footer. The wiki persists at `~/.dsh/storages/research_wiki.json`; artifacts land under `./.research`.

Optional capabilities:

- **Paper compilation** — install a LaTeX engine (`brew install tectonic` is easiest), or set `latex.engine` to a binary path
- **Web search** — the digdig CLI (`dg`) ships with the package; give it a SearXNG server with one command (Docker-free, local venv):
  ```sh
  bash scripts/setup-web-search.sh
  ```
- **Zotero** — set `zotero.apiKey` / `zotero.userId` in the plugin config (keys at zotero.org/settings/keys)
````

</details>

**依据 2 · 源码核查**：[README.md:72-85](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/README.md#L72-L85)

工作目录、备份与首次依赖下载说明。

<details>
<summary>查看原文（14行）</summary>

```text
| Key | Default | Meaning |
| --- | --- | --- |
| `workspaceDir` | `.research` | Research workspace root (artifacts, backups) |
| `latex.engine` | `auto` | `latexmk` / `tectonic` probe, or absolute binary path |
| `search.command` | `auto` | Web search: `auto` uses `dg` from PATH or the bundled copy |
| `reviewer.maxRounds` | `3` | Per-project review-round budget |
| `backup.enabled` / `intervalMinutes` / `keep` | `true` / `60` / `24` | Scheduled wiki snapshots |
| `skills.enabled` | `true` | Register the eleven bundled research skills |

## Troubleshooting

- **Plugin not found** — dsh resolves plugin names from the profile directory; install with `dsh plugin --profile web add dsh-mimir@latest`, not from your cwd.
- **LaTeX engine not found** — `brew install tectonic`, or point `latex.engine` at an absolute path. First tectonic compile downloads packages; raise `latex.timeoutMs` if it times out.
- **arXiv fails** — export `HTTPS_PROXY` before starting dsh when behind a proxy.
```

</details>

**依据 3 · 源码核查**：[packages/mimir/package.json:1-24](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/package.json#L1-L24)

实际发布组件与Node/导出。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "dsh-mimir",
  "description": "Research-assistant plugin suite (literature search, research wiki, LaTeX compile, independent subagent review) for the DeepSeek Harness",
  "version": "0.21.2",
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
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": "./lib/client.js",
```

</details>

#### 缺口

- 同版宿主、编译和真实论文流程收益未验收。
  **影响**：不足以推荐全研究生命周期自动接管或长期安装保证。
  **进一步探讨**：固定论文副本记录一次从改稿到新PDF的完整成本，失败回原工具核查。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否把论文源码、编译 PDF 和实验收据绑定？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的研究交付收据，将当前论文/数据版本、模型生成或人工修改来源、编译产物摘要、实验job精确终态和人工结论验收绑定。相对工作台里分别显示编译success与实验failed，它能指出哪些图表和文字仍依赖旧PDF、未知远端任务或未核对数据。它不会把程序运行成功提升为科学主张正确。

最小验证在一个可公开小论文项目中分别制造旧PDF、成功退出但缺指标、远程unknown和正常结果，比较现有界面与绑定收据发现陈旧或不完整交付的准确率、人工时间和模型补查token。先核现有paper snapshot/ledger功能能否已承担这些绑定；若已有方案足够、收据维护变成额外漂移状态或不能降低误验收，就停止独立扩展。尚无实测节省率或需求验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mimir/src/tools/latex.ts:260-284](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/src/tools/latex.ts#L260-L284)

编译返回与内容/产物版本未在该函数绑定。

<details>
<summary>查看原文（25行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[packages/mimir/src/services/server.ts:725-737](https://github.com/1692775560/dsh-Mimir-Academic-research/blob/32d0af2004266f969ca259d07018928498fd2329/packages/mimir/src/services/server.ts#L725-L737)

实验与job精细状态差别支持明确收据边界。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

#### 缺口

- 既有paper snapshot/ledger对跨产物绑定的完整覆盖和用户误验收频率未知。
  **影响**：不能把潜在收据机会当现有缺功能或市场结论。
  **进一步探讨**：先查既有契约，再用四类真实样例盲比，新增状态无收益则停止。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
