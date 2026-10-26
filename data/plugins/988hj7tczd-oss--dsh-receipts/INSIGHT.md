# dsh-receipts

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[ebc1ae1](https://github.com/988hj7tczd-oss/dsh-receipts/tree/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7)

<!-- BEGIN META -->
[![npm 30d 77](https://img.shields.io/static/v1?label=npm+30d&message=77&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-receipts) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-receipts)
<!-- END META -->

> **实现功能**：汇总本地 DSH 会话与工具痕迹，生成 Markdown 和离线 HTML 报告，可选本地 Git 提交核对。

> **核心亮点**：把会话、工具、跳过日志和本地 Git 痕迹组织成可离线复核的个人报告，比手动翻日志易查；活动指标与业务成果之间没有因果证明。详见[Q01](#research-q01)。

> **风险与缺陷**：Git 核对会忽略预标记的越界状态、未继承报告时间窗；开启路径脱敏又先改写 cwd。默认不脱敏的 HTML 还可能含会话敏感内容，不能把报告称作可信计费依据。详见[Q03](#research-q03)。

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
  - [Q01 · 报告为谁解决什么问题，哪些结果不能从活动痕迹推出？](#detail-section-11)
  - [Q02 · 从会话日志到两种报告经过哪些数据和执行边界？](#detail-section-12)
  - [Q03 · Git 交叉核对是否持续遵守允许根和选择的时间窗？](#detail-section-13)
  - [Q04 · 各阶段成本与隐私责任由谁承担？](#detail-section-14)
  - [Q05 · 怎样从 Git 核对与统计口径缺陷推出可验证的改进？](#detail-section-15)
  - [Q06 · 现阶段可以如何使用，哪些用途应暂停？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供个人回顾本地 DSH 会话与项目活动；它整理可见痕迹，不能直接证明工时、生产率或业务影响。详见[Q01](#research-q01)。

手工翻 JSONL 和 git log 可得活动线索，本包整合并格式化；但日志和提交不证明任务质量或价值，隐私审查及时间窗一致性是新增责任。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话日志挖掘 | 聚合 JSONL/zstd 活动与 skipped | 需允许日志根、解压支持；指标非成果 |
| Markdown/HTML 报告 | 离线浏览和人工复核 | 默认不脱敏，分享需逐项审查 |
| Git 提交核对 | 为项目活动加本地 commit 数 | 当前越界状态、时间窗和脱敏顺序有源码风险，建议暂关 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools/fs 与本地会话日志 | 工具运行必需 | 发现、读取和聚合日志 | 无数据或根拒绝；不能当真实零活动 |
| Node Zstd 或 zstd CLI | 压缩日志需要其一 | 解码 .zstd | 相关文件 skipped 并计数 |
| 系统 Git 与允许仓库 | 仅 Git 核对需要 | commit 数交叉 | 当前边界/时间窗有源码缺口，建议先关 |
| 输出目录及人工隐私复核 | 生成/分享需要 | 写两类报告和审读 | 默认路径不脱敏，可能泄露个人材料 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 所有者复制日志、指定允许根与周期 | 根可读且原始日志保留 |
| 挖掘 | 工具解析并汇总 | 会话/跳过数量与原件抽查一致 |
| 核对 | 当前先关闭 Git，人工核活动跨度和项目 | 不把缺失或误计当零/成果 |
| 分享 | 所有者审阅 MD/HTML 的路径与内容 | 敏感信息处理后才外发；问题则撤回重算 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地宿主、日志和解压环境；金额未知 | 核路径、权限、输出及隐私边界；耗时未知 | 开发形态需 dsh-src |
| 持续使用 | 文件 IO、zstd 解码、可选 Git 扫描；资源数未知 | 检查跳过、误分类、误归因和敏感字段；频率未知 | 活动跨度不等于劳动时长 |
| 失败恢复 | 重算/撤回报告的资源；金额未知 | 定位损坏压缩、误计与越界风险；耗时未知 | 缺真实大日志与恢复测量 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 本地活动汇总 | JSONL/zstd 解析、周期过滤和 skipped 记录 | 大日志完整性、整理节时 |
| Git 交叉核对 | 有 git log 执行链 | 当前越界、时间窗和脱敏交互下的可信度 |
| 离线分享 | Markdown 和自包含 HTML 渲染 | 敏感信息是否已充分脱敏、实际业务影响 |

> **思考**：Git 核对会忽略预标记的越界状态、未继承报告时间窗；开启路径脱敏又先改写 cwd。默认不脱敏的 HTML 还可能含会话敏感内容，不能把报告称作可信计费依据。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把会话、工具、跳过日志和本地 Git 痕迹组织成可离线复核的个人报告，比手动翻日志易查；活动指标与业务成果之间没有因果证明。详见[Q01](#research-q01)。

把会话、工具、跳过日志和本地 Git 痕迹组织成可离线复核的个人报告，比手动翻日志易查；活动指标与业务成果之间没有因果证明。详见[Q01](#research-q01)。

日志 IO 经 ctx.fs、跳过日志显式计入、报告字段转义值得借鉴；Git 子进程独立通道未保存拒绝状态和时间窗，需端到端核查。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

Git 核对会忽略预标记的越界状态、未继承报告时间窗；开启路径脱敏又先改写 cwd。默认不脱敏的 HTML 还可能含会话敏感内容，不能把报告称作可信计费依据。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，先复制日志并关闭 Git 核对，审阅原始会话与输出；对外分享须人工脱敏，不能把活动跨度或提交数当绩效证明。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

日志聚合与报告链有固定源码支持；Git 核对的越界状态、时间窗和脱敏顺序存在源码级疑点，尚未在宿主复现。未来接口改进假设未实现或验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/tools/receipts.ts、scripts/mine-transcripts.mjs、scripts/report.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核固定提交的工具入口、日志挖掘、报告渲染、README 与包声明；未执行目标插件、脚本、测试或真实宿主。前次 META 复用，不当本轮采集；源码数据流风险不是已复现泄漏。
- 下一步：先用隔离夹具检越界 cwd、窗外提交、redactPaths 开关、长空闲/并发会话，再用复制真实日志抽样核数和敏感字段；以调用路径、误计、人工复核耗时及报告可追溯性作成功/否定判据。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-receipts](https://github.com/988hj7tczd-oss/dsh-receipts)
- **版本号**：0.1.1（[固定提交 ebc1ae1](https://github.com/988hj7tczd-oss/dsh-receipts/tree/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是把已授权 Git 目标和报告时间窗一起传入纯核对接口，完成后才脱敏展示副本，并把活动跨度与人工确认的成果分栏；用越界/窗外/长空闲夹具证伪。详见[Q05](#research-q05)。

先用隔离夹具检越界 cwd、窗外提交、redactPaths 开关、长空闲/并发会话，再用复制真实日志抽样核数和敏感字段；以调用路径、误计、人工复核耗时及报告可追溯性作成功/否定判据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 267 | — | — | 3257 |
| .mjs | source | 2 | 1297 | 979 | 210 | — |
| .ts | source | 2 | 292 | 212 | 61 | — |
| .ts | test | 1 | 580 | 469 | 51 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-receipts/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-receipts 如何把本地会话痕迹形成报告，其 Git 核对、时间与隐私边界能否支撑可信个人复盘？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 报告为谁解决什么问题，哪些结果不能从活动痕迹推出？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用人群是需要回顾自己 DSH 会话、工具调用和相关仓库活动的个人或小团队。合格交付是指定周期/项目内的会话与工具活动可回查、跳过日志被标出、Markdown/HTML 能离线查看，并且读者知道统计的来源与缺失。原有办法是手动翻 JSONL 日志和 git log；插件把发现、解析、聚合、主题粗分及报告渲染串起来，能减轻整理步骤。项目把产物称为“使用与影响报告”，但会话数、工具调用数、提交数与首末事件跨度只能说明可见活动，不能证明工作质量、节省工时、生产率或业务影响。作者自述的“无人做”搜索并不是完整竞品调查，不能据此宣称生态首创。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-32](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/README.md#L12-L32)

作者定义本地日志与 Git 报告、使用影响定位及隐私主张。

<details>
<summary>查看原文（21行）</summary>

```text
从 DSH 本地会话日志挖取「使用与影响报告」（Receipts）——个人「工作流水账」。

纯本地数据构建：挖取本机 DSH 会话日志（JSONL），交叉本机 `git log`，输出
**Markdown 日报/周报/月报** + **自包含 HTML receipt**（单文件、无外链，可直接
离线打开或发给别人）。

> 项目定位（对齐上游 receipts 思路，实现自写，MIT）：
> 向主管 justify 使用/花费、自省「我到底用它干了啥」。
> 2026-08 调研：`dsh receipts worklog 工作日志` 实时搜索 0 结果，无人做。

## 特性

- **零配置**：数据源是本机 `$DSH_HOME/sessions` 下已有的会话日志（`session.jsonl` /
  `session.jsonl.zstd`），无需联网、无需注册。
- **零网络挖掘**：挖掘阶段是纯本地 Node 脚本（文件 IO + 正则 + JSON 解析），
  零 API 调用；唯一一次模型调用（可选）是「摘要 → 书面报告」润色，摘要强制
  ≤ 20KB（超出先截断再写）。
- **交叉验证**：每个仓库本地 `git log`（无网络），把 commit 活动与会话活动互相校验；
  仓库缺失时报告标注「无法交叉验证」。
- **隐私**：只读自己的 dshHome 日志；`--redact` 开关对报告中的绝对路径脱敏；
  报告绝不外发。
```

</details>

**依据 2 · 源码核查**：[scripts/mine-transcripts.mjs:519-540](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/scripts/mine-transcripts.mjs#L519-L540)

会话输出字段由日志事件聚合。

<details>
<summary>查看原文（22行）</summary>

```text
 * 聚合多会话摘要 → 顶层摘要对象（含 git 交叉验证占位）。
 */
export function aggregateSummaries(sessions, opts = {}) {
  const { repo, since, until, now = Date.now(), git = true, gitBin = 'git' } = opts

  const inWindow = sessions.filter((session) => sessionInWindow(session, since, until))
  const filtered = inWindow.filter((session) => sessionMatchesRepo(session, repo))

  const sessionsOut = filtered.map((session) => ({
    id: session.id ?? basename(dirname(session.path)),
    cwd: session.cwd,
    title: session.title,
    agentPreset: session.agentPreset,
    createdAt: session.createdAt,
    firstTime: session.firstTime,
    lastTime: session.lastTime,
    durationMs: session.durationMs,
    userMessages: session.counts.userMessages,
    toolCalls: session.counts.toolCalls,
    topTools: session.toolFreq.slice(0, 5),
    files: session.files.slice(0, 12),
    dayKeys: session.dayKeys,
```

</details>

**依据 3 · 源码核查**：[scripts/mine-transcripts.mjs:589-607](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/scripts/mine-transcripts.mjs#L589-L607)

总活动跨度、次数和时间窗来自记录计算，不是价值或工作时长测量。

<details>
<summary>查看原文（19行）</summary>

```text
  const totals = {
    sessions: sessionsOut.length,
    projects: projects.size,
    toolCalls: filtered.reduce((sum, session) => sum + session.counts.toolCalls, 0),
    toolResults: filtered.reduce((sum, session) => sum + session.counts.toolResults, 0),
    userMessages: filtered.reduce((sum, session) => sum + session.counts.userMessages, 0),
    approvals: filtered.reduce((sum, session) => sum + session.counts.approvals, 0),
    durationMs: filtered.reduce((sum, session) => sum + session.durationMs, 0),
    distinctDays: new Set(filtered.flatMap((session) => session.dayKeys)).size,
    parseErrors: filtered.reduce((sum, session) => sum + session.parseErrors, 0),
  }
  const allTimes = filtered.flatMap((session) => [session.firstTime, session.lastTime]).filter((t) => t !== undefined)
  totals.firstActivity = allTimes.length > 0 ? Math.min(...allTimes) : undefined
  totals.lastActivity = allTimes.length > 0 ? Math.max(...allTimes) : undefined

  const summary = {
    generatedAt: now,
    period: { key: opts.periodKey ?? 'month', days: Math.round((until - since) / DAY_MS), since, until },
    sourceRoot: opts.sourceRoot,
```

</details>

#### 缺口

- 没有人工确认的合格工作成果与对照整理时间
  **影响**：不能把报告数值转成节省工时或业务影响
  **进一步探讨**：抽样人工对照会话原件、提交与交付物，并记录整理总耗时和误归因

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从会话日志到两种报告经过哪些数据和执行边界？

**研究主题**：功能与机制

#### 完整回答

工具入口接受周期、项目子串、日志根、输出目录、是否脱敏和 Git 开关。先用 ctx.fs.resolve/contains 检查 sessionsRoot 与 outDir；日志发现与读取经 ctx.fs 适配，mineSessions 解析 JSONL 或 zstd，按会话活动与时间窗重叠筛选，汇总项目、工具与主题，解码失败进入 skipped 而不静默作零。之后由 renderMarkdown/renderHtml 生成文本和自包含 HTML，再经 ctx.fs 写出。脚本还有独立 CLI 路径，使用 Node 文件系统而非宿主 ctx.fs；不能把工具入口的根约束自动外推到 CLI。可选 Git 核对实际走 Node execFile，而不是 ctx.fs；它与日志读取有不同信任边界。摘要最多 20KB 并按优先级裁减细节，故报告不是无损日志档案。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/receipts.ts:145-185](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/src/tools/receipts.ts#L145-L185)

参数与根检查、ctx.fs 适配后调用 mineSessions。

<details>
<summary>查看原文（41行）</summary>

```text
    },
    async execute(args) {
      const typed = args as unknown as ReceiptsArgs
      const env = process.env
      const dshHome = resolveDshHome(env)
      const sessionsRoot = typed.sessionsRoot !== undefined && typed.sessionsRoot.trim() !== ''
        ? typed.sessionsRoot.trim()
        : resolveSessionsRoot({}, env)
      const outDir = typed.outDir !== undefined && typed.outDir.trim() !== ''
        ? typed.outDir.trim()
        : dshHome
      const period = typed.period ?? 'month'
      const repo = typed.repo !== undefined && typed.repo !== '' ? typed.repo : undefined
      const redactPaths = typed.redactPaths === true
      const gitEnabled = typed.git !== false

      // 1) 根约束（越界直接拒绝，不进入任何 IO）
      const roots = await allowedRootsOf(ctx, env)
      assertWithin(ctx, roots, await ctx.fs.resolve(sessionsRoot), 'sessionsRoot')
      assertWithin(ctx, roots, await ctx.fs.resolve(outDir), 'outDir')

      // 2) 经 ctx.fs 适配器挖掘（零子进程全权 IO）
      const adapter = fsAdapterOf(ctx)
      let summary: Record<string, any>
      try {
        summary = await mineSessions({
          root: sessionsRoot,
          period,
          repo,
          git: false,
          now: Date.now(),
          redactPaths,
          fsImpl: adapter as never,
        })
      } catch (error) {
        if (error instanceof ReceiptsError) throw error
        throw new ReceiptsError(
          'MINE_FAILED',
          `挖掘失败（可能是数据损坏或根不可读）: ${(error as Error).message}`,
        )
      }
```

</details>

**依据 2 · 源码核查**：[src/tools/receipts.ts:211-224](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/src/tools/receipts.ts#L211-L224)

渲染两种格式并写出。

<details>
<summary>查看原文（14行）</summary>

```text
      // 4) 渲染 + 经 ctx.fs 写报告
      const markdown = renderMarkdown(summary)
      const html = renderHtml(summary)
      const baseName = defaultBaseName(summary)
      const markdownPath = join(outDir, `${baseName}.md`)
      const htmlPath = join(outDir, `${baseName}.html`)
      try {
        await adapter.writeFile(markdownPath, markdown)
        await adapter.writeFile(htmlPath, html)
      } catch (error) {
        throw new ReceiptsError(
          'WRITE_FAILED',
          `报告写入失败（请确认 outDir 存在且在允许根内）: ${(error as Error).message}`,
        )
```

</details>

**依据 3 · 源码核查**：[scripts/mine-transcripts.mjs:860-887](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/scripts/mine-transcripts.mjs#L860-L887)

筛选摘要、跳过计数、Git 交叉与脱敏/容量处理顺序。

<details>
<summary>查看原文（28行）</summary>

```text
  let summary = aggregateSummaries(summaries, {
    repo,
    since: parsed.since,
    until: now,
    now,
    git: false,
  })
  summary.sourceRoot = sessionsRoot
  summary.compression = compression
  summary.period = { key: parsed.key, days: parsed.days, since: parsed.since, until: now }
  // 把 skipped 清单与计数带入报告输出（README「跳过该文件并在摘要中记录」承诺的落地）。
  summary.skipped = skippedFiles
  summary.totals = {
    ...summary.totals,
    skippedSessions: skippedFiles.length,
    // 解码失败也计入解析错误：损坏/无法解码的日志不能对 parseErrors 隐形。
    parseErrors: (summary.totals.parseErrors ?? 0) + skippedFiles.length,
  }

  await attachGitCrossCheck(summary, { since: parsed.since, until: now, gitBin, enabled: git })
  if (redactPaths) summary = redactPathsInSummary(summary)

  const capped = capSummary(summary, capBytes)
  summary = capped.summary

  if (summaryPath) {
    await fsImpl.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8')
  }
```

</details>

**依据 4 · 作者声明**：[README.md:86-105](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/README.md#L86-L105)

作者说明 zstd 失败和摘要裁减目标。

<details>
<summary>查看原文（20行）</summary>

```text
## 压缩模式（注意事项：DSH 日志默认 Zstd）

- **`compression: 'none'`**：日志为明文 UTF-8 JSONL，逐行解析，最省事。
- **默认 Zstd**：DSH 的 `session-persistence-jsonl` 把日志写成**多帧拼接**的
  `session.jsonl.zstd`（每 append 批一帧）。本插件自动解压：
  1. 优先 Node 内建 `node:zlib` 的 Zstd——先按帧边界（RFC 8878 块头布局以 DSH
     自身扫描器为准）切出每一帧，再逐帧解码拼接内容；
  2. 内建不可用时回退 `zstd -dc` CLI；
  3. 两者皆无时跳过该文件并在摘要中记录——`skipped` 清单（路径 + 原因）与
     `totals.skippedSessions` 计数进入 Markdown/HTML 报告（概览「跳过文件数」+
     告警块），提示改用 `compression: 'none'`，不会产出「假空」报告。

## 成本策略

- 挖掘阶段：零网络、零模型调用（文件 IO + 正则）。
- 报告阶段：模板渲染，同样零模型调用（比上游更省；需要叙事润色时，可用摘要
  数据让模型做一次调用）。
- 摘要上限：`SUMMARY_BYTES_CAP = 20KB`（紧凑 JSON 计字节），超出按
  「会话文件线索 → 文件改动 → 按天 → 工具频次 → 主题 → 会话条目 → 项目条目」
  的顺序逐步截断，绝不丢弃核心统计。
```

</details>

#### 缺口

- 未对真实大体量日志和压缩异常运行此版本
  **影响**：不能保证真实吞吐、内存或报告完整率
  **进一步探讨**：在复制日志上记录发现/解码/裁减/渲染各阶段数量和资源峰值

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Git 交叉核对是否持续遵守允许根和选择的时间窗？

**研究主题**：缺陷与关键质疑

#### 完整回答

默认 git=true、redactPaths=false 时，工具先遍历项目 cwd，若超出允许根，就把 gitStatus 标成 unavailable 并写“已跳过”原因，但保留原 cwd；随后 attachGitCrossCheck 对每个非空 cwd 都执行 git -C，没有按既有 gitStatus 跳过，因此越界项目仍可能被读取并把状态覆盖为 verified。这是源码数据流风险，尚未在目标宿主复现。工具调用 attachGitCrossCheck 时也没有传 summary.period.since/until，函数默认 since=0、until=当前时间，Git 提交数可能覆盖全历史而报告仍显示所选周期。开启 redactPaths=true 又会在 mineSessions 内先把 cwd 脱敏为 <redacted>/<basename>，之后工具的根检查和 Git 调用处理的是该展示文本，可能让本应核对的项目反而不可用。三条交互使 Git 数字目前不宜作可靠“交叉验证”，需先修正数据流并验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/receipts.ts:187-209](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/src/tools/receipts.ts#L187-L209)

越界仅改状态不移除 cwd；调用 attach 不传时间窗。

<details>
<summary>查看原文（23行）</summary>

```text
      // 3) git 交叉验证：越界项目目录不跑 git
      if (gitEnabled) {
        summary.projects = await Promise.all(
          (summary.projects as Array<Record<string, unknown>>).map(async (project) => {
            const cwd = String(project.cwd ?? '')
            if (cwd === '') return project
            try {
              const target = await ctx.fs.resolve(cwd)
              if (roots.some((root) => ctx.fs.contains(root as never, target as never))) return project
            } catch {
              /* resolve 失败按越界处理 */
            }
            return {
              ...project,
              gitStatus: 'unavailable',
              gitReason: '项目目录超出允许根，已跳过 git 交叉验证',
            }
          }),
        )
        summary = await attachGitCrossCheck(summary, { enabled: true, gitBin: 'git' })
      } else {
        summary = await attachGitCrossCheck(summary, { enabled: false })
      }
```

</details>

**依据 2 · 源码核查**：[scripts/mine-transcripts.mjs:652-669](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/scripts/mine-transcripts.mjs#L652-L669)

核对函数只检非空 cwd、默认全历史时间窗，并直接执行 git -C。

<details>
<summary>查看原文（18行）</summary>

```text
export async function attachGitCrossCheck(summary, opts = {}) {
  const { since = 0, until = Date.now(), gitBin = 'git', enabled = true } = opts
  if (!enabled) {
    summary.projects = summary.projects.map((project) => ({ ...project, gitStatus: 'unavailable', gitReason: 'git 交叉验证被禁用' }))
    return summary
  }
  summary.projects = await Promise.all(
    summary.projects.map(async (project) => {
      if (!project.cwd) return { ...project, gitStatus: 'unavailable', gitReason: '会话缺少 cwd，无法定位仓库' }
      const sinceIso = new Date(since).toISOString()
      const untilIso = new Date(until).toISOString()
      try {
        const { stdout } = await execFile(gitBin, ['-C', project.cwd, 'log', `--since=${sinceIso}`, `--until=${untilIso}`, '--pretty=%H'], {
          timeout: 15_000,
          maxBuffer: 16 * 1024 * 1024,
        })
        const commits = stdout.trim() === '' ? 0 : stdout.trim().split(/\r?\n/).length
        return { ...project, gitStatus: 'verified', gitCommits: commits }
```

</details>

**依据 3 · 源码核查**：[scripts/mine-transcripts.mjs:696-719](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/scripts/mine-transcripts.mjs#L696-L719)

路径脱敏会改写项目 cwd。

<details>
<summary>查看原文（24行）</summary>

```text
/** 对摘要对象做路径脱敏（sourceRoot、cwd、文件路径与 skipped 路径）。返回新对象。 */
export function redactPathsInSummary(summary) {
  const projects = summary.projects.map((project) => ({
    ...project,
    cwd: project.cwd ? redactPath(project.cwd) : project.cwd,
  }))
  const sessions = summary.sessions.map((session) => ({
    ...session,
    cwd: session.cwd ? redactPath(session.cwd) : session.cwd,
    files: session.files.map((file) => ({ ...file, path: redactPath(file.path) })),
  }))
  const fileChanges = summary.fileChanges.map((file) => ({ ...file, path: redactPath(file.path) }))
  const skipped = Array.isArray(summary.skipped)
    ? summary.skipped.map((item) => ({ ...item, path: redactPath(item.path) }))
    : summary.skipped
  return {
    ...summary,
    redacted: true,
    projects,
    sessions,
    fileChanges,
    skipped,
    sourceRoot: summary.sourceRoot ? redactPath(summary.sourceRoot) : summary.sourceRoot,
  }
```

</details>

**依据 4 · 源码核查**：[scripts/mine-transcripts.mjs:860-883](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/scripts/mine-transcripts.mjs#L860-L883)

mineSessions 在返回前执行脱敏，工具后续再做 Git 核对。

<details>
<summary>查看原文（24行）</summary>

```text
  let summary = aggregateSummaries(summaries, {
    repo,
    since: parsed.since,
    until: now,
    now,
    git: false,
  })
  summary.sourceRoot = sessionsRoot
  summary.compression = compression
  summary.period = { key: parsed.key, days: parsed.days, since: parsed.since, until: now }
  // 把 skipped 清单与计数带入报告输出（README「跳过该文件并在摘要中记录」承诺的落地）。
  summary.skipped = skippedFiles
  summary.totals = {
    ...summary.totals,
    skippedSessions: skippedFiles.length,
    // 解码失败也计入解析错误：损坏/无法解码的日志不能对 parseErrors 隐形。
    parseErrors: (summary.totals.parseErrors ?? 0) + skippedFiles.length,
  }

  await attachGitCrossCheck(summary, { since: parsed.since, until: now, gitBin, enabled: git })
  if (redactPaths) summary = redactPathsInSummary(summary)

  const capped = capSummary(summary, capBytes)
  summary = capped.summary
```

</details>

#### 缺口

- 未在隔离环境实际注入越界仓库、窗外提交与脱敏开关
  **影响**：不能量化可读出的越界数据或 Git 误计频率
  **进一步探讨**：用三个固定夹具分别验证越界 cwd、窗外提交和 redactPaths 开关，并检查是否调用 git 与报告数值

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 各阶段成本与隐私责任由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

开发形态依赖与 dsh-src 同级的源检出，需构建上游；包声明 Node >=22.18 与 DSH >=0.1.0，工具需 DSH 的 tools/fs 服务。读取本地 JSONL/zstd 时可能需要 Node 内建 Zstd 或 zstd CLI；Git 核对需要系统 git 且可能访问日志记载的项目目录。首次要确认真实日志格式、允许根、输出目录及报告分享边界；持续使用消耗本地 I/O、解压内存和可选 Git 扫描，仍需人工审查主题误分和成果归因；失败恢复要处理无法解码、裁减、误计及报告撤回。作者说挖掘阶段无网络/模型调用，但这不等于总成本为零；金额、CPU/内存、处理时间与人工复核量未测。报告默认不脱敏，redactPaths 仅改路径字段，标题、提示和文件名中仍可能有敏感信息；自包含 HTML 可直接分享反而增加泄漏责任。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-9](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/README.md#L3-L9)

开发 checkout 和 link 依赖前提。

```text
> [!IMPORTANT]
> **依赖前置：相邻 `dsh-src` 检出（`link:` 依赖）**
> 本项目在开发形态下使用 `link:` 依赖指向相邻的 DeepSeek Harness 源码检出（`dsh-src`），
> 与当前仓库保持同一父目录布局（`<parent>/dsh-src`）。克隆本仓库后：
> 1. 先把官方 `deepseek-ai/deepseek-harness` 检出到与本仓库同级的 `dsh-src/` 目录，并执行其 `pnpm install && pnpm run build`；
> 2. 再按下方「安装」一节执行本仓库的 `pnpm install --offline && pnpm build` 与测试。
> 发布到 npm 的版本会尽量把 `link:` 依赖替换为 registry 真实版本；无法替换的内部包保持 `link:`，见各包 README 说明。
```

**依据 2 · 源码核查**：[package.json:29-74](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/package.json#L29-L74)

宿主兼容、文件与命令权限及包依赖声明。

<details>
<summary>查看原文（46行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.yml"
    },
    "compatibility": {
      "node": ">=22.18.0",
      "dsh": ">=0.1.0"
    },
    "permissions": {
      "summary": "读取 DSH 会话日志（$DSH_HOME/sessions .zstd/.jsonl）→ 周期/项目聚合生成使用与影响报告（md+html）。全部文件 IO 走 ctx.fs；sessionsRoot/outDir 根约束（越界 OUT_OF_BOUNDS）。无网络；解码失败进 skipped 并计入 parseErrors。",
      "commands": [
        "zstd -dc <sessionFile> (execFile 固定 argv)",
        "git -C <root> log --since= --until= --pretty=%H (仅允许根)"
      ],
      "writePaths": [
        "<outDir>/receipts-<YYYY-MM-DD>.md",
        "<outDir>/receipts-<YYYY-MM-DD>.html"
      ],
      "externalServices": [],
      "failureBoundaries": [
        "OUT_OF_BOUNDS 根约束",
        "skipped/parseErrors 显式计入",
        "fmtTime 本地钟面"
      ],
      "lifecycleEvidence": [
        "21/21 smoke",
        "A1 ctx.fs + 越界拒绝",
        "A2 损坏 zstd 非假空",
        "A3 本地时间"
      ]
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "tsx --test tests/smoke.e2e.ts",
    "mine": "node scripts/mine-transcripts.mjs",
    "report": "node scripts/report.mjs",
    "prepublishOnly": "npm run build"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-fs": "0.1.1-rc.2",
    "@deepseek-ai/dsh-system-prompt": "0.1.1-rc.2",
    "@deepseek-ai/dsh-tools": "0.1.1-rc.2"
  },
```

</details>

**依据 3 · 作者声明**：[README.md:98-111](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/README.md#L98-L111)

作者的零模型挖掘与路径脱敏说明。

<details>
<summary>查看原文（14行）</summary>

```text
## 成本策略

- 挖掘阶段：零网络、零模型调用（文件 IO + 正则）。
- 报告阶段：模板渲染，同样零模型调用（比上游更省；需要叙事润色时，可用摘要
  数据让模型做一次调用）。
- 摘要上限：`SUMMARY_BYTES_CAP = 20KB`（紧凑 JSON 计字节），超出按
  「会话文件线索 → 文件改动 → 按天 → 工具频次 → 主题 → 会话条目 → 项目条目」
  的顺序逐步截断，绝不丢弃核心统计。

## 隐私

- 只读 `dshHome/sessions`（或显式 `sessionsRoot`），只写 `outDir`（默认 dshHome）。
- 报告默认展示绝对路径；`--redact` / `redactPaths: true` 折叠为 `<redacted>/<basename>`。
- 「零外发」是硬约束：挖掘脚本无任何网络模块（测试含网络白名单断言）。
```

</details>

**依据 4 · 源码核查**：[scripts/mine-transcripts.mjs:696-719](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/scripts/mine-transcripts.mjs#L696-L719)

脱敏只改摘要中特定路径字段。

<details>
<summary>查看原文（24行）</summary>

```text
/** 对摘要对象做路径脱敏（sourceRoot、cwd、文件路径与 skipped 路径）。返回新对象。 */
export function redactPathsInSummary(summary) {
  const projects = summary.projects.map((project) => ({
    ...project,
    cwd: project.cwd ? redactPath(project.cwd) : project.cwd,
  }))
  const sessions = summary.sessions.map((session) => ({
    ...session,
    cwd: session.cwd ? redactPath(session.cwd) : session.cwd,
    files: session.files.map((file) => ({ ...file, path: redactPath(file.path) })),
  }))
  const fileChanges = summary.fileChanges.map((file) => ({ ...file, path: redactPath(file.path) }))
  const skipped = Array.isArray(summary.skipped)
    ? summary.skipped.map((item) => ({ ...item, path: redactPath(item.path) }))
    : summary.skipped
  return {
    ...summary,
    redacted: true,
    projects,
    sessions,
    fileChanges,
    skipped,
    sourceRoot: summary.sourceRoot ? redactPath(summary.sourceRoot) : summary.sourceRoot,
  }
```

</details>

#### 缺口

- 真实日志大小、敏感文本分布与人工审查/恢复成本未知
  **影响**：无法估算每份合格报告总成本或声明分享安全
  **进一步探讨**：在复制日志上计量阶段资源、抽样敏感字段并由所有者复核对外版本

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样从 Git 核对与统计口径缺陷推出可验证的改进？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

把日志读取接入 ctx.fs、显式 skipped 清单、HTML 转义和离线模板，是可借鉴的局部设计；但 Git 辅助层另起 Node execFile，绕开先前根检查的终止语义，状态预标记未成为执行约束。活动时长是每会话首末事件差再求和，长空闲和并发会话可造成误读。未验证的改进方向是让 Git 核对接口只接收已确认允许根内的不可变目标及同一周期边界，先完成核对再对展示副本脱敏，遇越界或失败不改变拒绝状态；报告明确称“活动跨度”而非劳动时间，并另设可人工核实的成果引用。最小验证用越界仓库、时间窗外提交、长空闲/并发会话与含敏感标题的夹具，记录是否越界读取、Git 误计、跨度误解和人工核对成本。若严格边界显著损害可用性，应解释取舍，不能改回静默扩大读取。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/receipts.ts:69-97](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/src/tools/receipts.ts#L69-L97)

日志文件 IO 经 ctx.fs 适配。

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * 把 `ctx.fs` 适配成 mine-transcripts 需要的 `{ readdir, readFile, writeFile }`。
 * 所有路径先经 `ctx.fs.resolve` 再操作，读窗口/沙箱由宿主 fs 服务强制。
 */
export function fsAdapterOf(ctx: Context) {
  const fs = ctx.fs
  return {
    async readdir(dir: string) {
      const target = await fs.resolve(dir)
      const entries = await fs.listDir(target)
      return entries.map((entry: { name: string; type: string }) => ({
        name: entry.name,
        isDirectory: () => entry.type === 'directory',
        isFile: () => entry.type === 'file',
      }))
    },
    async readFile(path: string) {
      const target = await fs.resolve(path)
      if (path.endsWith(ZSTD_SUFFIX)) {
        const bytes = await fs.readBytes(target, undefined, 256 * 1024 * 1024)
        return Buffer.from(bytes)
      }
      return Buffer.from(await fs.readText(target), 'utf8')
    },
    async writeFile(path: string, data: string | Buffer) {
      const target = await fs.resolve(path)
      await fs.writeText(target, String(data))
    },
  }
```

</details>

**依据 2 · 源码核查**：[src/tools/receipts.ts:187-209](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/src/tools/receipts.ts#L187-L209)

Git 边界没有端到端保存。

<details>
<summary>查看原文（23行）</summary>

```text
      // 3) git 交叉验证：越界项目目录不跑 git
      if (gitEnabled) {
        summary.projects = await Promise.all(
          (summary.projects as Array<Record<string, unknown>>).map(async (project) => {
            const cwd = String(project.cwd ?? '')
            if (cwd === '') return project
            try {
              const target = await ctx.fs.resolve(cwd)
              if (roots.some((root) => ctx.fs.contains(root as never, target as never))) return project
            } catch {
              /* resolve 失败按越界处理 */
            }
            return {
              ...project,
              gitStatus: 'unavailable',
              gitReason: '项目目录超出允许根，已跳过 git 交叉验证',
            }
          }),
        )
        summary = await attachGitCrossCheck(summary, { enabled: true, gitBin: 'git' })
      } else {
        summary = await attachGitCrossCheck(summary, { enabled: false })
      }
```

</details>

**依据 3 · 源码核查**：[scripts/mine-transcripts.mjs:589-607](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/scripts/mine-transcripts.mjs#L589-L607)

durationMs 汇总说明可推导的统计口径缺口。

<details>
<summary>查看原文（19行）</summary>

```text
  const totals = {
    sessions: sessionsOut.length,
    projects: projects.size,
    toolCalls: filtered.reduce((sum, session) => sum + session.counts.toolCalls, 0),
    toolResults: filtered.reduce((sum, session) => sum + session.counts.toolResults, 0),
    userMessages: filtered.reduce((sum, session) => sum + session.counts.userMessages, 0),
    approvals: filtered.reduce((sum, session) => sum + session.counts.approvals, 0),
    durationMs: filtered.reduce((sum, session) => sum + session.durationMs, 0),
    distinctDays: new Set(filtered.flatMap((session) => session.dayKeys)).size,
    parseErrors: filtered.reduce((sum, session) => sum + session.parseErrors, 0),
  }
  const allTimes = filtered.flatMap((session) => [session.firstTime, session.lastTime]).filter((t) => t !== undefined)
  totals.firstActivity = allTimes.length > 0 ? Math.min(...allTimes) : undefined
  totals.lastActivity = allTimes.length > 0 ? Math.max(...allTimes) : undefined

  const summary = {
    generatedAt: now,
    period: { key: opts.periodKey ?? 'month', days: Math.round((until - since) / DAY_MS), since, until },
    sourceRoot: opts.sourceRoot,
```

</details>

**依据 4 · 源码核查**：[scripts/report.mjs:26-36](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/scripts/report.mjs#L26-L36)

Markdown 表格字段转义是现有防护的一部分。

<details>
<summary>查看原文（11行）</summary>

```text
/** Markdown 表格转义（管道符等）。 */
export function mdCell(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ')
}

/** Markdown 表头行。 */
export function mdTable(headers, rows) {
  const header = `| ${headers.join(' | ')} |`
  const divider = `| ${headers.map(() => '---').join(' | ')} |`
  const body = rows.map((row) => `| ${row.map(mdCell).join(' | ')} |`)
  return [header, divider, ...body].join('\n')
```

</details>

#### 缺口

- 新的核对接口和成果引用机制未实现或验证
  **影响**：不能把减少误计、泄漏或误解写作现有插件效果
  **进一步探讨**：按固定夹具实现最小接口原型，比较拒绝正确性、周期一致性与人工核对时间

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现阶段可以如何使用，哪些用途应暂停？

**研究主题**：采用判断

#### 完整回答

源码支持把本地日志做个人回顾，但 Git 核对链存在目标和时间窗风险，报告默认不脱敏且活动跨度不是工时。适合先在复制日志上关闭 Git 核对生成草稿，人工核查跳过文件、主题与原始会话，再决定是否保留自用。若要分享 Markdown/HTML，需由日志所有者逐项检查路径、标题、提示内容和项目名；不能靠 redactPaths=true 自动保证脱敏。依赖 Git 交叉数字、工时统计或“影响”证明向主管计费/评绩的场景，当前不应采用这些指标。推荐结论保持观察，直到越界目标和时间窗链路修复并有隔离验证；源码和作者测试声明不等于本轮运行通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/receipts.ts:187-209](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/src/tools/receipts.ts#L187-L209)

Git 交叉核对链的核心限制。

<details>
<summary>查看原文（23行）</summary>

```text
      // 3) git 交叉验证：越界项目目录不跑 git
      if (gitEnabled) {
        summary.projects = await Promise.all(
          (summary.projects as Array<Record<string, unknown>>).map(async (project) => {
            const cwd = String(project.cwd ?? '')
            if (cwd === '') return project
            try {
              const target = await ctx.fs.resolve(cwd)
              if (roots.some((root) => ctx.fs.contains(root as never, target as never))) return project
            } catch {
              /* resolve 失败按越界处理 */
            }
            return {
              ...project,
              gitStatus: 'unavailable',
              gitReason: '项目目录超出允许根，已跳过 git 交叉验证',
            }
          }),
        )
        summary = await attachGitCrossCheck(summary, { enabled: true, gitBin: 'git' })
      } else {
        summary = await attachGitCrossCheck(summary, { enabled: false })
      }
```

</details>

**依据 2 · 源码核查**：[scripts/mine-transcripts.mjs:589-607](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/scripts/mine-transcripts.mjs#L589-L607)

报告统计口径。

<details>
<summary>查看原文（19行）</summary>

```text
  const totals = {
    sessions: sessionsOut.length,
    projects: projects.size,
    toolCalls: filtered.reduce((sum, session) => sum + session.counts.toolCalls, 0),
    toolResults: filtered.reduce((sum, session) => sum + session.counts.toolResults, 0),
    userMessages: filtered.reduce((sum, session) => sum + session.counts.userMessages, 0),
    approvals: filtered.reduce((sum, session) => sum + session.counts.approvals, 0),
    durationMs: filtered.reduce((sum, session) => sum + session.durationMs, 0),
    distinctDays: new Set(filtered.flatMap((session) => session.dayKeys)).size,
    parseErrors: filtered.reduce((sum, session) => sum + session.parseErrors, 0),
  }
  const allTimes = filtered.flatMap((session) => [session.firstTime, session.lastTime]).filter((t) => t !== undefined)
  totals.firstActivity = allTimes.length > 0 ? Math.min(...allTimes) : undefined
  totals.lastActivity = allTimes.length > 0 ? Math.max(...allTimes) : undefined

  const summary = {
    generatedAt: now,
    period: { key: opts.periodKey ?? 'month', days: Math.round((until - since) / DAY_MS), since, until },
    sourceRoot: opts.sourceRoot,
```

</details>

**依据 3 · 作者声明**：[README.md:107-111](https://github.com/988hj7tczd-oss/dsh-receipts/blob/ebc1ae1cc2a24da9ce8407bb02606db0438e83a7/README.md#L107-L111)

作者说明默认展示绝对路径。

```text
## 隐私

- 只读 `dshHome/sessions`（或显式 `sessionsRoot`），只写 `outDir`（默认 dshHome）。
- 报告默认展示绝对路径；`--redact` / `redactPaths: true` 折叠为 `<redacted>/<basename>`。
- 「零外发」是硬约束：挖掘脚本无任何网络模块（测试含网络白名单断言）。
```

#### 缺口

- 未取得修复版和真实用户对报告真实性/隐私的验收
  **影响**：不能给持续安装或对外展示的结论
  **进一步探讨**：修复并核查三类 Git 夹具后，以复制日志人工审读完整报告再决定试用

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
