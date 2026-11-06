# DSH Data Quality

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[195b7da](https://github.com/PerryLink/dsh-data-quality/tree/195b7da055959627b17d041f0421fac7f644e455)

<!-- BEGIN META -->
[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-data-quality) [![npm 30d 3,462](https://img.shields.io/static/v1?label=npm+30d&message=3%2C462&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-data-quality) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-data-quality)
<!-- END META -->

> **功能**：在 DSH 中确定性分析、清理、校验表格数据，提供 citation 核值服务与持久报告回读。

> **亮点**：把列分析、声明式清理/校验和citation四状态接成Host服务与报告回读，避免模型心算；采样/分数有明确有限语义，见 [Q01](#research-q01)、[Q02](#research-q02)、[Q04](#research-q04)。

> **主要限制**：词法路径不是文件系统隔离，输出先写后contract/报告且可覆盖目标；报告键缺workspace/操作唯一性，accuracy/verified不能被当现实真相，见 [Q02](#research-q02)至 [Q05](#research-q05)。

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
  - [Q01 · 真实插件给谁什么增量，是否只是模型算术？](#detail-section-11)
  - [Q02 · 输入路径、采样、统计与分数的边界是什么？](#detail-section-12)
  - [Q03 · 清理/校验是提交门禁吗，失败是否会保持文件不变？](#detail-section-13)
  - [Q04 · citation契约证明了什么，快照与未知状态如何解释？](#detail-section-14)
  - [Q05 · 持久报告、会话审计、隔离和取消怎样落地？](#detail-section-15)
  - [Q06 · 应该如何试用、付出什么成本，有何可证伪改进？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在可信本地项目重复检查CSV/JSON的数据维护者，可用明确规则和统计报告辅助复核，见 [Q01](#research-q01)。

表格手查/临时脚本；本项增量是Agent接入的规则计算、报告和可复用核值契约，不原创统计方法或证明数据真相。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| profile | 列统计/全表分数 | sample不绕过加载cap |
| clean | 顺序规则/干跑/可选写出 | 输出先于contract/报告 |
| verify | 声明规则/expectation | passed不等事实真相 |
| citation服务 | 当前位置核值 | 非来源核验/历史快照 |
| data_report | key/kind回读 | profile共享无会话过滤 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 缺失/边界 |
| --- | --- | --- |
| Node ^22.19或>=24.9 | Host计算 | 按package非旧README下限 |
| DSH >=0.2.1-0 <0.3及Cordis/tools/storage peers | 服务/工具/报告 | 未验真实宿主 |
| storage-json/domain stack | 保存与回读 | 不等底层耐久已审 |
| agent会话cwd/服务workspaceRoot | 输入范围 | 仅词法限制非沙箱 |
| 人工规则/业务定义 | 解释和决策 | 分数/核值不能代真相 |

#### 步骤

| 步骤 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 无链接脱敏副本/独立profile | 不接关键源文件 |
| 分析 | profile小文件 | 看sampled/全表与分数含义 |
| 干跑 | clean dryRun，核规则/变null | 不传outputPath |
| 校验 | 用明确规则verify | passed=false非异常 |
| 停止 | 查报告/原文件，停插件 | 输出未知先查不重试 |

**效果与成本**

#### 成本

| 阶段 | 资源/现金 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 首次 | 兼容DSH/Node/storage | cwd/规则/副本配置 | 未测安装时间 |
| 持续 | 全文件内存/全表统计与报告 | 业务解释/抽查 | 模型费未知非0 |
| 失败 | 已写输出/部分报告 | 三状态核对 | 无共同事务回滚 |
| 退出 | domain/输出材料 | 按保留策略导出删除 | 无自动清理证明 |

#### 效果

| 效果 | 支持 | 未确认 |
| --- | --- | --- |
| 规则计算 | 本地确定性引擎 | 业务规则正确 |
| 统计/分数 | 有限定定义 | 现实准确率/需求收益 |
| citation | 当前位置值四状态 | 来源真实/历史输入重放 |
| 报告 | domain回读接线 | 唯一性/耐久/隔离验收 |

> **思考**：词法路径不是文件系统隔离，输出先写后contract/报告且可覆盖目标；报告键缺workspace/操作唯一性，accuracy/verified不能被当现实真相，见 [Q02](#research-q02)至 [Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把列分析、声明式清理/校验和citation四状态接成Host服务与报告回读，避免模型心算；采样/分数有明确有限语义，见 [Q01](#research-q01)、[Q02](#research-q02)、[Q04](#research-q04)。

接线可追，失败语义需收窄：写后contract/报告非门禁、key非唯一操作、会话事件可能跳过；路径和报告共享不构成安全隔离，见 [Q02](#research-q02)至 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

词法路径不是文件系统隔离，输出先写后contract/报告且可覆盖目标；报告键缺workspace/操作唯一性，accuracy/verified不能被当现实真相，见 [Q02](#research-q02)至 [Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

试用限定可信无链接副本的小文件分析与clean dryRun，人工核规则/分数，不提供outputPath。根/结果语义不明或状态冲突就停并回已有脚本/原件，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定入口/Provider、路径加载、采样/代表统计与分数、清理/核值、报告和事件关键链已查；未执行或绑定宿主storage耐久实现。只建议可信无链接副本profile/clean dryRun，不开放写出。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、package.json、src/clean.ts、src/config.ts、src/dataset.ts、src/events.ts、src/index.ts、src/profile.ts、src/provider-local.ts、src/scorecard.ts、src/store.ts、src/tools/clean.ts、src/tools/profile.ts、src/tools/report.ts、src/tools/shared.ts、src/verify.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：包/patch、Host/service/Provider与四工具执行、dataset路径/读取/采样、profile代表计算/全表划分、scorecard有限定义、clean顺序/强转、verify核值/结果、store和events；未执行，未全审每一行业preset/算法/HTML renderer及宿主storage实现。
- 下一步：- 下一步用无链接脱敏小文件对照原脚本核统计/规则/报告。
- 再用三故障样本核输出/报告状态，未明确前不开放写出。
- 未运行插件/宿主或数据实验。

**分析版本**

- **仓库**：[PerryLink/dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)
- **版本号**：0.3.26（[固定提交 195b7da](https://github.com/PerryLink/dsh-data-quality/tree/195b7da055959627b17d041f0421fac7f644e455)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向为contract前置与绑定输入hash/真实路径/operationId的提交收据，以三故障样本核误覆盖/重试，等价宿主机制或需求不足则放弃，见 [Q06](#research-q06)。

- 下一步用无链接脱敏小文件对照原脚本核统计/规则/报告。
- 再用三故障样本核输出/报告状态，未明确前不开放写出。
- 未运行插件/宿主或数据实验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 2492 | — | — | 26167 |
| .mjs | source | 9 | 567 | 417 | 103 | — |
| .ts | source | 24 | 4537 | 3415 | 881 | — |
| .ts | test | 17 | 2406 | 1939 | 193 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/PerryLink/dsh-data-quality/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核本地数据计算、清理写出、citation核值和报告持久真实边界，判断可信副本试用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真实插件给谁什么增量，是否只是模型算术？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

0.3.26是原生Host插件，入口提供ctx.dataQuality本地服务及profile/clean/verify/report四工具；无Web客户端。面向在可信本地项目处理CSV/TSV/JSON/JSONL、希望让Agent做重复结构检查而非心算的人，合格结果是规则/统计/可回看报告，不能从工具成功推导数据业务真实。参照表格手查或临时脚本：把确定性TypeScript计算、清理规则日志和跨插件citation核值接进Agent，并可从reportKey回读。统计方法/均值/IQR不是原创，模型仍负责选规则、单位/业务解释与后续决策。README图表/作者样例不作本轮执行结果；package workshop的兼容/安装声明也不是本轮宿主验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:11-20](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/package.json#L11-L20)

Host入口导出。

<details>
<summary>查看原文（10行）</summary>

```text
  "main": "./lib/index.js",
  "types": "./lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
```

</details>

**依据 2 · 源码核查**：[src/index.ts:29-31](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/index.ts#L29-L31)

真实服务依赖。

```text
export const name = 'data-quality'
/** The four model tools and the durable report domain. */
export const inject = ['tools', 'storageDomain']
```

**依据 3 · 源码核查**：[src/index.ts:129-142](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/index.ts#L129-L142)

四工具注册。

<details>
<summary>查看原文（14行）</summary>

```text
  // Service Provider: constructs the local DataQualityService (which publishes ctx.dataQuality) and registers the four model tools below through ctx.tools.register. The registrations live in one effect whose disposer unregisters them in reverse order, so an unmount during apply can neither lose a registration nor leave one behind.
  const service = new LocalDataQualityService(ctx, resolved, { store, now: Date.now })
  ctx.effect(() => {
    const disposers = [
      ctx.tools.register(defineProfileTool(service)),
      ctx.tools.register(defineCleanTool(service)),
      ctx.tools.register(defineVerifyTool(service)),
      ctx.tools.register(defineReportTool(service)),
    ]
    return () => {
      for (const dispose of disposers.reverse()) dispose()
    }
  }, 'dsh-data-quality: tools')
  logger.info(`dsh-data-quality ${VERSION} mounted: ctx.dataQuality + data_profile/data_clean/data_verify/data_report`)
```

</details>

**依据 4 · 源码核查**：[src/provider-local.ts:89-105](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/provider-local.ts#L89-L105)

profile到本地引擎/报告。

<details>
<summary>查看原文（17行）</summary>

```text
  override async profileDataset(request: ProfileRequest): Promise<ProfileReport> {
    throwIfAborted(request.signal)
    const absolute = resolveWorkspacePath(request.workspace, request.dataset, this.config)
    const table = await loadTable(absolute, this.config, request.signal)
    const declaredSchema = request.industryPreset === undefined ? undefined : resolveIndustryPreset(request.industryPreset).columns
    const report = profileTable(table, {
      dataset: request.dataset,
      sample: request.sample,
      generatedAt: this.deps.now(),
      signal: request.signal,
      duplicateSampleLimit: this.config.evidenceRowLimit,
      declaredSchema,
      scorecardWeights: this.config.scorecardWeights,
    })
    const reportKey = await this.persist('profile', request.dataset, report as unknown as Record<string, unknown>)
    this.emitEvent(request.session, 'profile', request.dataset, reportKey, { rows: report.rowCount, columns: report.columnCount })
    return { ...report, ...(reportKey !== undefined ? { reportKey } : {}) }
```

</details>

**依据 5 · 源码核查**：[src/tools/report.ts:116-135](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/tools/report.ts#L116-L135)

报告读取实际执行。

<details>
<summary>查看原文（20行）</summary>

```text
    async execute(args, _exec): Promise<DataReportValue> {
      const hasKey = args.key !== undefined
      const hasKind = args.kind !== undefined
      if (hasKey === hasKind) {
        throw new Error('data_report needs exactly one of key/kind')
      }
      const format = (args.format ?? 'json') as 'json' | 'html'
      if (hasKey) {
        const record = await service.getReport(args.key as string)
        return {
          key: args.key as string,
          records: [toView(record, true)],
          ...(format === 'html' ? { html: renderRecordHtml(record) } : {}),
        }
      }
      if (format === 'html') {
        throw new Error('data_report html format requires key (exactly one report)')
      }
      const records = await service.listReports(args.kind as ReportRecord['kind'])
      return { kind: args.kind as ReportRecord['kind'], records: records.map(record => toView(record, args.includeReports === true)) }
```

</details>

#### 缺口

- 没有真实数据质量改善/规则选择与用户需求测量。
  **影响**：只能证明有可核计算接线，不证明适合任意行业决策。
  **进一步探讨**：同一脱敏数据集用现有脚本/表格与插件对照行数、缺失和业务误判。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 输入路径、采样、统计与分数的边界是什么？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

模型工具以exec.agent.session.header.cwd为workspace，非agent调用拒绝；服务级citation用配置workspaceRoot或process.cwd，两者不能混。resolveWorkspacePath用path.resolve和字符串前缀、扩展白名单约束，read先stat大小再普通open读取。它没有realpath/O_NOFOLLOW，符号链接或别名可能让真实读写越过词法边界；此为源码可见未覆盖条件，未实测利用。stat后文件变大会在readFile分配前缺二次硬界限，不能视沙箱/流式大数据加载。

默认64MiB/20万行且整文件读/解析后才profile采样，sample不能绕过文件/行硬限制。采样是从0每ceil(total/count)行取，列统计采样，重复检测和scorecard仍用全表；不能把它当随机代表性或省掉全表开销。numericProfile为JS number计算/六位舍入，IQR=0时outliers返回0，非异常不存在保证。timeliness只度量非未来日期比例；accuracy有schema也只是推断列类型符合度、无schema则null，不是现实准确率。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/shared.ts:19-25](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/tools/shared.ts#L19-L25)

工具从会话cwd取根。

```text
export function workspaceOf(exec: ToolExecution): string {
  const cwd = exec.agent?.session.header.cwd
  if (cwd === undefined) {
    throw new Error('data-quality tools require an agent-owned session workspace')
  }
  return path.resolve(cwd)
}
```

**依据 2 · 源码核查**：[src/provider-local.ts:62-65](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/provider-local.ts#L62-L65)

服务根的另一来源。

```text
  /** The absolute root for service-level calls without a session workspace. */
  serviceRoot(): string {
    return this.config.workspaceRoot !== '' ? path.resolve(this.config.workspaceRoot) : process.cwd()
  }
```

**依据 3 · 源码核查**：[src/dataset.ts:76-95](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/dataset.ts#L76-L95)

词法路径/白名单限制。

<details>
<summary>查看原文（20行）</summary>

```text
export function resolveWorkspacePath(root: string, requested: string, config: ResolvedConfig): string {
  if (requested.trim() === '') {
    throw new DatasetError('path-escape', 'dataset path must not be empty')
  }
  const resolvedRoot = path.resolve(root)
  const resolved = path.resolve(resolvedRoot, requested)
  if (resolved !== resolvedRoot && !resolved.startsWith(resolvedRoot + path.sep)) {
    throw new DatasetError(
      'path-escape',
      `path ${JSON.stringify(requested)} resolves outside the workspace root ${JSON.stringify(resolvedRoot)}`,
    )
  }
  const ext = path.extname(resolved).toLowerCase()
  if (!config.allowedExtensions.includes(ext)) {
    throw new DatasetError(
      'extension-denied',
      `extension ${JSON.stringify(ext)} is not in allowedExtensions (${config.allowedExtensions.join(', ')})`,
    )
  }
  return resolved
```

</details>

**依据 4 · 源码核查**：[src/dataset.ts:147-173](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/dataset.ts#L147-L173)

stat后普通读取，非真实路径/流式界限。

<details>
<summary>查看原文（27行）</summary>

```text
export async function readDatasetFile(absolutePath: string, config: ResolvedConfig, signal?: AbortSignal): Promise<{ text: string; encoding: EncodingInfo }> {
  throwIfAborted(signal)
  let info
  try {
    info = await stat(absolutePath)
  } catch {
    throw new DatasetError('not-found', `dataset file not found: ${absolutePath}`)
  }
  if (!info.isFile()) {
    throw new DatasetError('not-found', `dataset path is not a file: ${absolutePath}`)
  }
  const capBytes = config.maxFileSizeMB * 1024 * 1024
  if (info.size > capBytes) {
    throw new DatasetError(
      'too-large',
      `dataset is ${(info.size / 1024 / 1024).toFixed(1)} MiB, above the ${config.maxFileSizeMB} MiB cap; split the file or raise maxFileSizeMB`,
    )
  }
  const handle = await open(absolutePath, 'r')
  try {
    throwIfAborted(signal)
    const buffer = await handle.readFile()
    const encoding = detectEncoding(buffer)
    return { text: decodeUtf8Text(buffer, encoding), encoding }
  } finally {
    await handle.close()
  }
```

</details>

**依据 5 · 源码核查**：[src/dataset.ts:366-415](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/dataset.ts#L366-L415)

解析后系统采样。

<details>
<summary>查看原文（50行）</summary>

```text
export async function loadTable(absolutePath: string, config: ResolvedConfig, signal?: AbortSignal): Promise<Table> {
  const { text, encoding } = await readDatasetFile(absolutePath, config, signal)
  const ext = path.extname(absolutePath).toLowerCase()
  throwIfAborted(signal)
  if (ext === '.csv') return { ...parseDelimited(text, ',', config, signal), encoding }
  if (ext === '.tsv') return { ...parseDelimited(text, '\t', config, signal), encoding }
  return { ...parseJsonTable(text, ext, config, signal), encoding }
}

/**
 * Load a dataset as a citation-checkable document root: CSV/TSV become
 * `{ columns, rows }` (so `rows[3].nav` resolves), JSON is the parsed value,
 * JSONL is the array of parsed lines.
 * @param absolutePath - normalized absolute dataset path.
 * @param config - resolved config.
 * @param signal - optional abort signal.
 * @returns the document root.
 */
export async function loadDocument(absolutePath: string, config: ResolvedConfig, signal?: AbortSignal): Promise<DocumentRoot> {
  const ext = path.extname(absolutePath).toLowerCase()
  if (ext === '.json') {
    const { text } = await readDatasetFile(absolutePath, config, signal)
    return { kind: 'json', value: parseJsonDocument(text) }
  }
  if (ext === '.jsonl') {
    const { text } = await readDatasetFile(absolutePath, config, signal)
    return { kind: 'json', value: parseJsonLines(text) }
  }
  const table = await loadTable(absolutePath, config, signal)
  return { kind: 'table', columns: table.columns, rows: table.rows }
}

/**
 * Deterministic systematic sample: every `ceil(total / count)`-th row from
 * index 0. No clock, no RNG — the same input always yields the same sample.
 * @param rows - full row list.
 * @param count - requested sample size.
 * @returns the sampled rows (identity when `count >= rows.length`).
 */
export function sampleRows(rows: Row[], count: number): Row[] {
  if (!Number.isSafeInteger(count) || count <= 0) {
    throw new DatasetError('malformed', `sample must be a positive integer, got ${String(count)}`)
  }
  if (count >= rows.length) return rows
  const stride = Math.ceil(rows.length / count)
  const out: Row[] = []
  for (let i = 0; i < rows.length; i += stride) {
    out.push(rows[i] as Row)
  }
  return out
```

</details>

**依据 6 · 源码核查**：[src/config.ts:69-77](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/config.ts#L69-L77)

默认文件/行/报告设置。

```text
export const Config: z<Config> = z.object({
  enabled: z.boolean().default(true),
  maxRows: z.number().default(200_000),
  maxFileSizeMB: z.number().default(64),
  defaultTolerance: z.number().default(1e-9),
  evidenceRowLimit: z.number().default(20),
  allowedExtensions: z.array(z.string()).default(['.csv', '.tsv', '.json', '.jsonl']),
  workspaceRoot: z.string().default(''),
  storeReports: z.boolean().default(true),
```

**依据 7 · 源码核查**：[src/profile.ts:279-305](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/profile.ts#L279-L305)

采样列、全表重复/分数分别处理。

<details>
<summary>查看原文（27行）</summary>

```text
): ProfileReport {
  throwIfAborted(options.signal)
  const profiled = options.sample === undefined ? table.rows : sampleRows(table.rows, options.sample)
  const columns = table.columns.map((column) => profileColumn(profiled, column, options.signal))
  const detection = detectDuplicateRows(table, { sampleLimit: options.duplicateSampleLimit ?? DEFAULT_DUPLICATE_SAMPLE_LIMIT, signal: options.signal })
  const scorecard = computeScorecard(table, {
    now: options.generatedAt,
    duplicateRows: detection.duplicateRows,
    declaredSchema: options.declaredSchema,
    weights: options.scorecardWeights,
    signal: options.signal,
  })
  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    dataset: options.dataset,
    rowCount: table.rows.length,
    sampled: profiled.length !== table.rows.length,
    profiledRows: profiled.length,
    columnCount: table.columns.length,
    duplicateRows: detection.duplicateRows,
    duplicateRate: detection.duplicateRate,
    duplicateSampleRowIndexes: detection.duplicateSampleRowIndexes,
    scorecard,
    ...(table.encoding !== undefined ? { encoding: table.encoding } : {}),
    columns,
    generatedAt: options.generatedAt,
  }
```

</details>

**依据 8 · 源码核查**：[src/dataset.ts:203-211](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/dataset.ts#L203-L211)

解析阶段先拒超行数，采样不绕过加载。

```text
    }
    records.push(record)
    record = []
    if (records.length % 1024 === 0) throwIfAborted(signal)
    if (records.length - 1 > config.maxRows) {
      throw new DatasetError(
        'too-many-rows',
        `dataset exceeds the ${config.maxRows} row cap; use the sample parameter or raise maxRows`,
      )
```

**依据 9 · 源码核查**：[src/tools/profile.ts:35-43](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/tools/profile.ts#L35-L43)

profile工具真实传workspace/session/signal。

```text
    async execute(args, exec) {
      return service.profileDataset({
        dataset: args.path,
        sample: args.sample,
        ...(args.industryPreset !== undefined ? { industryPreset: args.industryPreset } : {}),
        workspace: workspaceOf(exec),
        session: exec.agent?.session,
        signal: exec.signal,
      })
```

**依据 10 · 源码核查**：[src/profile.ts:108-128](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/profile.ts#L108-L128)

实际数值/IQR计算。

<details>
<summary>查看原文（21行）</summary>

```text
export function numericProfile(values: readonly number[]): NumericProfile | undefined {
  if (values.length === 0) return undefined
  const sorted = [...values].sort((a, b) => a - b)
  const sum = sorted.reduce((acc, value) => acc + value, 0)
  const p25 = quantile(sorted, 0.25)
  const p75 = quantile(sorted, 0.75)
  const iqr = p75 - p25
  const lowFence = p25 - 1.5 * iqr
  const highFence = p75 + 1.5 * iqr
  const outliers = iqr === 0 ? 0 : sorted.filter((value) => value < lowFence || value > highFence).length
  return {
    count: sorted.length,
    distinct: new Set(sorted).size,
    min: round6(sorted[0] as number),
    max: round6(sorted[sorted.length - 1] as number),
    mean: round6(sum / sorted.length),
    median: round6(quantile(sorted, 0.5)),
    p25: round6(p25),
    p75: round6(p75),
    outliers,
  }
```

</details>

**依据 11 · 源码核查**：[src/scorecard.ts:181-191](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/scorecard.ts#L181-L191)

timeliness和整体分数。

<details>
<summary>查看原文（11行）</summary>

```text
  const timeliness: ScorecardDimension =
    dateCells === 0
      ? { name: 'timeliness', score: null, note: 'undetermined: no date cells' }
      : dimension('timeliness', round6(1 - futureDateCells / dateCells), dateCells - futureDateCells, dateCells)

  const accuracy = computeAccuracy(stats, table, options.declaredSchema)

  const dimensions = [completeness, uniqueness, validity, consistency, timeliness, accuracy]
  const scores = dimensions.map((entry) => entry.score).filter((score): score is number => score !== null)
  const overall = scores.length === 0 ? null : round6(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  const weightedOverall = computeWeightedOverall(dimensions, options.weights)
```

</details>

**依据 12 · 源码核查**：[src/scorecard.ts:220-243](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/scorecard.ts#L220-L243)

accuracy限于声明类型。

<details>
<summary>查看原文（24行）</summary>

```text
  declaredSchema: Readonly<Record<string, InferredType>> | undefined,
): ScorecardDimension {
  if (declaredSchema === undefined || Object.keys(declaredSchema).length === 0) {
    return { name: 'accuracy', score: null, note: 'undetermined: no declared schema or external truth to compare against; accuracy is never fabricated' }
  }
  let checked = 0
  let matched = 0
  const mismatches: string[] = []
  for (const column of table.columns) {
    const declared = declaredSchema[column]
    if (declared === undefined) continue
    checked += 1
    const inferred = inferType(stats.get(column) as ColumnStats)
    if (inferred === declared) matched += 1
    else mismatches.push(`${column}: declared ${declared}, inferred ${inferred}`)
  }
  if (checked === 0) {
    return { name: 'accuracy', score: null, note: 'undetermined: declared schema covers none of the dataset columns' }
  }
  return {
    name: 'accuracy',
    score: round6(matched / checked),
    note: `${matched}/${checked} columns match their declared type` + (mismatches.length > 0 ? `; mismatches: ${mismatches.join(', ')}` : ''),
  }
```

</details>

#### 缺口

- 未测路径别名、文件竞争、内存或统计误差。
  **影响**：不能对恶意目录/大型数据/行业准确率作保证。
  **进一步探讨**：只在无链接的可信副本首试；再用链接/增长文件与周期数据样本核边界和采样偏差。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 清理/校验是提交门禁吗，失败是否会保持文件不变？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

clean复制表、按数组顺序逐规则改写并存日志；coerce失败会把值置null并记录，不能说失败值都保留原样。dryRun=true跳文件和报告保存，仍可能emit会话事件；不传outputPath只预览但默认保存报告，故两者副作用不同。真正写outputPath只比较规范字符串不等输入，mkdir后直接writeFile默认可覆盖已有目标，没有exclusive或temp+rename。输出符号链接/同inode别名在这种检查下不能保证源不被覆盖，工具NEVER overwritten描述强于实现。

更关键的是输出写在contract/diff计算和两个报告persist之前；contract是摘要不是通过才准写的门禁。后续取消、统计或存储失败可使工具报错但输出已改变，两个报告也不共同事务，不可盲重试当“未做”。verify返回passed=false是正常规则/expectation不满足，不是执行异常；规则未知等才抛错。确定性仅指给定输入/规则/时钟的计算，规则正确与业务含义由调用者负责。

#### 证据与依据

**依据 1 · 源码核查**：[src/clean.ts:316-357](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/clean.ts#L316-L357)

复制并按序应用规则。

<details>
<summary>查看原文（42行）</summary>

```text
export function applyCleanRules(table: Table, rules: readonly CleanRule[], options: { signal?: AbortSignal | undefined } = {}): CleanResult {
  if (rules.length === 0) {
    throw new CleanRuleError(0, 'rules must be a non-empty array')
  }
  let current: Table = { columns: [...table.columns], rows: table.rows.map((row) => ({ ...row })) }
  const logs: CleanRuleLog[] = []
  for (const [ruleIndex, rule] of rules.entries()) {
    throwIfAborted(options.signal)
    let step: { table: Table; log: CleanRuleLog }
    switch (rule.rule) {
      case 'dedupe':
        step = applyDedupe(current, rule, ruleIndex, options.signal)
        break
      case 'fill-missing':
        step = applyFillMissing(current, rule, ruleIndex, options.signal)
        break
      case 'coerce-type':
        step = applyCoerceType(current, rule, ruleIndex, options.signal)
        break
      case 'normalize-unit':
        step = applyNormalizeUnit(current, rule, ruleIndex, options.signal)
        break
      case 'trim':
        step = applyTrim(current, rule, ruleIndex, options.signal)
        break
      case 'map-values':
        step = applyMapValues(current, rule, ruleIndex, options.signal)
        break
      default:
        throw new CleanRuleError(ruleIndex, `rule ${ruleIndex}: unknown rule type ${JSON.stringify((rule as CleanRule).rule)}`)
    }
    current = step.table
    logs.push(step.log)
  }
  return {
    columns: current.columns,
    rows: current.rows,
    logs,
    inputRows: table.rows.length,
    outputRows: current.rows.length,
  }
}
```

</details>

**依据 2 · 源码核查**：[src/clean.ts:161-203](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/clean.ts#L161-L203)

强制类型失败置missing。

<details>
<summary>查看原文（43行）</summary>

```text
  const rows = table.rows.map((row, index) => {
    if (index % 1024 === 0) throwIfAborted(signal)
    const cell = row[rule.column]
    if (isMissing(cell)) return row
    let value: Cell | undefined
    switch (rule.to) {
      case 'number': {
        const numeric = parseNumeric(cell)
        value = numeric === undefined ? undefined : numeric
        break
      }
      case 'date': {
        const epoch = parseDate(cell)
        if (epoch === undefined) {
          value = undefined
        } else {
          const date = new Date(epoch)
          value = date.getUTCHours() === 0 && date.getUTCMinutes() === 0 && date.getUTCSeconds() === 0
            ? date.toISOString().slice(0, 10)
            : date.toISOString()
        }
        break
      }
      case 'boolean': {
        const bool = parseBoolean(cell)
        value = bool === undefined ? undefined : String(bool)
        break
      }
    }
    if (value === undefined) {
      failed += 1
      if (failureExamples.length < 3) failureExamples.push(JSON.stringify(cell))
      return { ...row, [rule.column]: null }
    }
    coerced += 1
    return { ...row, [rule.column]: value }
  })
  const detail = `${coerced} value(s) coerced to ${rule.to}` +
    (failed > 0 ? `; ${failed} failure(s) set to missing (e.g. ${failureExamples.join(', ')})` : '')
  return {
    table: { columns: table.columns, rows },
    log: { ruleIndex, rule: 'coerce-type', affectedRows: coerced, detail },
  }
```

</details>

**依据 3 · 源码核查**：[src/provider-local.ts:109-183](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/provider-local.ts#L109-L183)

写文件在contract/diff/persist之前，dryRun分支。

<details>
<summary>查看原文（75行）</summary>

```text
  override async cleanDataset(request: CleanRequest): Promise<CleanRunReport> {
    throwIfAborted(request.signal)
    const dryRun = request.dryRun === true
    const absolute = resolveWorkspacePath(request.workspace, request.dataset, this.config)
    const table = await loadTable(absolute, this.config, request.signal)
    const result = applyCleanRules(table, request.rules, { signal: request.signal })

    let writtenPath: string | undefined
    if (!dryRun && request.outputPath !== undefined) {
      const outputAbsolute = resolveWorkspacePath(request.workspace, request.outputPath, this.config)
      if (outputAbsolute === absolute) {
        throw new Error(`outputPath ${JSON.stringify(request.outputPath)} would overwrite the input dataset; choose a different path`)
      }
      const ext = path.extname(outputAbsolute).toLowerCase()
      const text = ext === '.csv' || ext === '.tsv'
        ? serializeDelimited(result.columns, result.rows, ext === '.csv' ? ',' : '\t')
        : ext === '.jsonl'
          ? `${result.rows.map((row) => JSON.stringify(row)).join('\n')}\n`
          : `${JSON.stringify(result.rows, null, 2)}\n`
      await mkdir(path.dirname(outputAbsolute), { recursive: true })
      throwIfAborted(request.signal)
      await writeFile(outputAbsolute, text, 'utf8')
      writtenPath = request.outputPath
    }

    const generatedAt = this.deps.now()
    // The contract summary is part of the model-visible canonical value, so it
    // must also be part of the durable report (model-visible ⟺ logged).
    const contract = computeCleanContract(result, request.rules, { signal: request.signal })
    const outputTable = {
      columns: result.columns,
      rows: result.rows,
      ...(table.encoding !== undefined ? { encoding: table.encoding } : {}),
    }
    // The before/after profile diff preview is the expected diff in a dry run
    // and the durable audit artifact (separate `clean-diff` record) otherwise.
    const diff = computeCleanProfileDiff(table, outputTable, {
      dataset: request.dataset,
      generatedAt,
      scorecardWeights: this.config.scorecardWeights,
      signal: request.signal,
    })
    // The preview is part of the model-visible canonical value, so it must
    // also be part of the durable report: otherwise the clean result's preview
    // could not be reconstructed from the session log (model-visible ⟺ logged).
    const preview = { columns: result.columns, rows: result.rows.slice(0, this.config.evidenceRowLimit).map((row) => truncateRow(row)) }

    if (dryRun) {
      this.emitEvent(request.session, 'clean', request.dataset, undefined, { rows: result.outputRows, columns: result.columns.length, rules: result.logs.length })
      return {
        dataset: request.dataset,
        inputRows: result.inputRows,
        outputRows: result.outputRows,
        dryRun: true,
        logs: result.logs,
        contract,
        preview,
        diffPreview: diff,
        generatedAt,
      }
    }

    const reportKey = await this.persist('clean', request.dataset, {
      dataset: request.dataset,
      inputRows: result.inputRows,
      outputRows: result.outputRows,
      dryRun: false,
      logs: result.logs,
      contract,
      preview,
      ...(writtenPath !== undefined ? { outputPath: writtenPath } : {}),
      generatedAt,
    } as unknown as Record<string, unknown>)
    await this.persist('clean-diff', request.dataset, diff as unknown as Record<string, unknown>)
    this.emitEvent(request.session, 'clean', request.dataset, reportKey, { rows: result.outputRows, columns: result.columns.length, rules: result.logs.length })
```

</details>

**依据 4 · 源码核查**：[src/tools/clean.ts:93-101](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/tools/clean.ts#L93-L101)

工具宣称源不覆盖及参数。

```text
      'Apply declarative cleaning rules to a workspace CSV/TSV/JSON/JSONL dataset with deterministic TypeScript computation (no mental math).',
      'Rules apply in array order: dedupe (by column group), fill-missing (constant/mean/median/forward), coerce-type (number/date/boolean; failures counted and set to missing), normalize-unit (e.g. 万/亿 suffixes to base units), trim (whitespace), map-values (enum mapping).',
      'The source file is NEVER overwritten. Without outputPath the run is preview-only; with outputPath the cleaned dataset is written there (workspace-confined, .csv/.tsv/.json/.jsonl). Returns the per-rule audit log, the pre-delivery contract summary (with per-column decision trace), and a bounded preview. Pass dryRun: true to skip the write and get the cleaning plan plus the expected contract/diff preview instead. The full report persists to the data_quality storage domain (reportKey).',
    ].join('\n'),
    parameters: {
      path: { type: 'string', required: true, description: 'Workspace-relative dataset path (.csv/.tsv/.json/.jsonl).' },
      rules: { ...CLEAN_RULE_SCHEMA, required: true },
      outputPath: { type: 'string', description: 'Optional workspace-relative output path for the cleaned dataset (must differ from path).' },
      dryRun: { type: 'boolean', description: 'When true, do not write any output file; return the cleaning plan and expected contract/diff preview instead (default false).' },
```

**依据 5 · 源码核查**：[src/tools/clean.ts:213-222](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/tools/clean.ts#L213-L222)

实际传session/signal。

<details>
<summary>查看原文（10行）</summary>

```text
    async execute(args, exec) {
      return service.cleanDataset({
        dataset: args.path,
        rules: args.rules as unknown as readonly CleanRule[],
        ...(args.outputPath !== undefined ? { outputPath: args.outputPath } : {}),
        ...(args.dryRun !== undefined ? { dryRun: args.dryRun } : {}),
        workspace: workspaceOf(exec),
        session: exec.agent?.session,
        signal: exec.signal,
      })
```

</details>

**依据 6 · 源码核查**：[src/verify.ts:470-482](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/verify.ts#L470-L482)

未知规则抛错，正常passed汇总。

<details>
<summary>查看原文（13行）</summary>

```text
      default:
        throw new VerifyRuleError(ruleIndex, `rule ${ruleIndex}: unknown rule type ${JSON.stringify((rule as VerifyRule).rule)}`)
    }
    results.push(result)
  }
  const expectations = verifyExpectations(table, options.expectations ?? [], options.defaultTolerance ?? 1e-9, options.signal)
  return {
    passed: results.every((result) => result.passed) && expectations.every((expectation) => expectation.passed),
    rowCount: table.rows.length,
    rules: results,
    expectations,
    generatedAt: options.now(),
  }
```

</details>

#### 缺口

- 未执行输出别名/取消后写入或报告失败样本。
  **影响**：静态风险不说已发生；采用排除真实写文件。
  **进一步探讨**：在临时副本模拟输出已存在/指向源、write后abort和第二次persist失败，核磁盘/报告/返回三状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · citation契约证明了什么，快照与未知状态如何解释？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

verifyCitations按服务根重新loadDocument，CSV/TSV为{columns,rows}、JSON保留文档结构；locator是点键/数组下标，own-property遍历，缺失/不合法路径not-found。数值可解析字符串，按双方绝对值最大值乘相对容差比较；字符串只精确字符串，类型不可比unverifiable，差异mismatch，符合verified。verified只是当前加载文档位置值相合，不证明外部来源真实、语义引述恰当、单位一致或当时历史快照。

该服务不接收请求signal，不从会话cwd授权；配置根是调用插件共同约定而非租户身份。citation单项tolerance由请求直接取，checkCitations内未像expectation那样显式范围校验，TypeScript类型不是运行时可信输入门禁；不把跨插件调用当不可信网络API。报告保存结果/路径/时间，未保存原始文档hash/字节，未来同路径变动不能仅用reportKey重放旧输入。固定契约可复用是贡献，不能叫独立事实核验。

#### 证据与依据

**依据 1 · 源码核查**：[src/provider-local.ts:252-270](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/provider-local.ts#L252-L270)

服务级重载/调用/保存结果。

<details>
<summary>查看原文（19行）</summary>

```text
  override async verifyCitations(request: CitationCheckRequest): Promise<CitationCheckResult> {
    const absolute = resolveWorkspacePath(this.serviceRoot(), request.dataset, this.config)
    const document = await loadDocument(absolute, this.config)
    const result = checkCitations(document, request.citations, this.config.defaultTolerance)
    const verified = result.results.filter((entry) => entry.status === 'verified').length
    const mismatched = result.results.filter((entry) => entry.status === 'mismatch').length
    const notFound = result.results.filter((entry) => entry.status === 'not-found').length
    const unverifiable = result.results.filter((entry) => entry.status === 'unverifiable').length
    await this.persist('citations', request.dataset, {
      dataset: request.dataset,
      checked: result.results.length,
      verified,
      mismatched,
      notFound,
      unverifiable,
      results: result.results,
      generatedAt: this.deps.now(),
    } as unknown as Record<string, unknown>)
    return result
```

</details>

**依据 2 · 源码核查**：[src/dataset.ts:384-395](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/dataset.ts#L384-L395)

文档加载语义。

<details>
<summary>查看原文（12行）</summary>

```text
export async function loadDocument(absolutePath: string, config: ResolvedConfig, signal?: AbortSignal): Promise<DocumentRoot> {
  const ext = path.extname(absolutePath).toLowerCase()
  if (ext === '.json') {
    const { text } = await readDatasetFile(absolutePath, config, signal)
    return { kind: 'json', value: parseJsonDocument(text) }
  }
  if (ext === '.jsonl') {
    const { text } = await readDatasetFile(absolutePath, config, signal)
    return { kind: 'json', value: parseJsonLines(text) }
  }
  const table = await loadTable(absolutePath, config, signal)
  return { kind: 'table', columns: table.columns, rows: table.rows }
```

</details>

**依据 3 · 源码核查**：[src/verify.ts:518-554](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/verify.ts#L518-L554)

locator/own-property与相对容差公式。

<details>
<summary>查看原文（37行）</summary>

```text
export function parseLocator(locator: string): LocatorSegment[] {
  if (locator.trim() === '') throw new Error('citation path must not be empty')
  const segments: LocatorSegment[] = []
  for (const part of locator.split('.')) {
    const match = /^([A-Za-z0-9_$-]*)((?:\[\d+\])*)$/u.exec(part)
    if (match === null || (match[1] === '' && match[2] === '')) {
      throw new Error(`unparsable citation path segment ${JSON.stringify(part)} in ${JSON.stringify(locator)}`)
    }
    const indices = [...(match[2] ?? '').matchAll(/\[(\d+)\]/gu)].map((index) => Number(index[1]))
    segments.push({ key: match[1] === '' ? undefined : match[1], indices })
  }
  return segments
}

/** Sentinel for a failed locator walk (distinguishable from an actual `undefined` value). */
const NOT_FOUND = Symbol('not-found')

/** Walk the document root along the parsed locator; returns {@link NOT_FOUND} when any step misses. */
function walkLocator(root: DocumentRoot, segments: readonly LocatorSegment[]): unknown {
  let current: unknown = root.kind === 'table' ? { columns: root.columns, rows: root.rows } : root.value
  for (const segment of segments) {
    if (segment.key !== undefined) {
      if (typeof current !== 'object' || current === null || Array.isArray(current)) return NOT_FOUND
      if (!Object.prototype.hasOwnProperty.call(current, segment.key)) return NOT_FOUND
      current = (current as Record<string, unknown>)[segment.key]
    }
    for (const index of segment.indices) {
      if (!Array.isArray(current) || index >= current.length) return NOT_FOUND
      current = current[index]
    }
  }
  return current
}

/** Relative-tolerance numeric comparison (never raw `===` on floats). */
function numericClose(actual: number, cited: number, tolerance: number): boolean {
  return Math.abs(actual - cited) <= tolerance * Math.max(Math.abs(actual), Math.abs(cited), Number.MIN_VALUE)
```

</details>

**依据 4 · 源码核查**：[src/verify.ts:577-641](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/verify.ts#L577-L641)

四种结果及tolerance直接使用。

<details>
<summary>查看原文（65行）</summary>

```text
export function checkCitations(
  root: DocumentRoot,
  citations: CitationCheckRequest['citations'],
  defaultTolerance: number,
): CitationCheckResult {
  const results: CitationCheckResult['results'] = []
  for (const citation of citations) {
    let located: unknown
    try {
      located = walkLocator(root, parseLocator(citation.path))
    } catch (error) {
      results.push({
        id: citation.id,
        status: 'not-found',
        note: `path ${JSON.stringify(citation.path)} is not a valid locator: ${error instanceof Error ? error.message : String(error)}`,
      })
      continue
    }
    if (located === NOT_FOUND) {
      results.push({ id: citation.id, status: 'not-found', note: `nothing found at ${JSON.stringify(citation.path)}` })
      continue
    }
    if (typeof citation.value === 'number') {
      const actualNumber = typeof located === 'number' ? located : parseNumeric(located as Cell)
      if (actualNumber === undefined) {
        const display = displayActual(located)
        results.push({
          id: citation.id,
          status: 'unverifiable',
          ...(display !== undefined ? { actual: display } : {}),
          note: `value at ${JSON.stringify(citation.path)} is not numeric and cannot be compared to ${citation.value}`,
        })
        continue
      }
      const tolerance = citation.tolerance ?? defaultTolerance
      if (numericClose(actualNumber, citation.value, tolerance)) {
        results.push({ id: citation.id, status: 'verified', actual: actualNumber, note: `within relative tolerance ${tolerance}` })
      } else {
        results.push({
          id: citation.id,
          status: 'mismatch',
          actual: actualNumber,
          note: `cited ${citation.value} differs from actual ${actualNumber} beyond relative tolerance ${tolerance}`,
        })
      }
      continue
    }
    // Cited a string: exact comparison against a string actual only.
    if (typeof located === 'string') {
      if (located === citation.value) {
        results.push({ id: citation.id, status: 'verified', actual: located })
      } else {
        results.push({ id: citation.id, status: 'mismatch', actual: located, note: `cited ${JSON.stringify(citation.value)} != actual ${JSON.stringify(located)}` })
      }
      continue
    }
    const display = displayActual(located)
    results.push({
      id: citation.id,
      status: 'unverifiable',
      ...(display !== undefined ? { actual: display } : {}),
      note: `value at ${JSON.stringify(citation.path)} is ${typeof located}, not comparable to cited string`,
    })
  }
  return { results }
```

</details>

**依据 5 · 源码核查**：[src/verify.ts:170-187](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/verify.ts#L170-L187)

expectation另有运行时校验作为对照。

<details>
<summary>查看原文（18行）</summary>

```text
/** Throw unless the expectation is well-formed (metric/column/tolerance). */
function validateExpectation(table: Table, expectation: VerifyExpectation, index: number): void {
  if (!VERIFY_METRICS.includes(expectation.metric)) {
    throw new VerifyExpectationError(index, `expectation ${index}: unknown metric ${JSON.stringify(expectation.metric)} (expected one of ${VERIFY_METRICS.join(', ')})`)
  }
  if (expectation.metric !== 'rowCount') {
    if (expectation.column === undefined || expectation.column === '') {
      throw new VerifyExpectationError(index, `expectation ${index}: metric ${expectation.metric} requires a column`)
    }
    if (!table.columns.includes(expectation.column)) {
      throw new VerifyExpectationError(index, `expectation ${index}: unknown column ${JSON.stringify(expectation.column)} (columns: ${table.columns.join(', ')})`)
    }
  } else if (expectation.column !== undefined) {
    throw new VerifyExpectationError(index, `expectation ${index}: metric rowCount takes no column, got ${JSON.stringify(expectation.column)}`)
  }
  if (expectation.tolerance !== undefined && (typeof expectation.tolerance !== 'number' || !Number.isFinite(expectation.tolerance) || expectation.tolerance < 0 || expectation.tolerance > 1)) {
    throw new VerifyExpectationError(index, `expectation ${index}: tolerance must be a finite number in [0, 1], got ${String(expectation.tolerance)}`)
  }
```

</details>

#### 缺口

- 未验证跨插件调用方和历史快照复现。
  **影响**：不支持可信来源核验/审计时点重放保证。
  **进一步探讨**：传明确根和有限容差，绑定文档内容hash后用改文件/错单位/无路径/非法容差样本核结果，拒把verified当真相。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 持久报告、会话审计、隔离和取消怎样落地？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

storeReports默认true，入口open data_quality domain，put等待完成才返key；未配关闭时不存、get/list报错。open后若fiber已销毁关新handle，工具effect反序注销，domain结束close。持久性最终由宿主storage backend承担，本项未绑定底层fsync/事务实现，不称本轮已验断电耐久。报告工具使用_exec忽略workspace，按key或kind读取本profile domain，无额外会话过滤；报告含样本/路径，不能当多租户数据隔离。

key是毫秒时间+kind+调用方dataset字符串的8位路径hash，不含workspace/内容/随机operationId；同毫秒同kind同path会同key，底层put可能覆盖，不能据“每run一份”主张唯一。clean主报告和clean-diff两次persist，第二次失败可留下第一份；事件在保存后执行，KNOWN类型直接append，否则用函数源码含ignorable启发式，不能则静默跳过。append失败无catch仍可发生在数据/报告已完成之后。signal在读取/算法分段检查，但普通writeFile/persist无signal/回滚；同步计算检查不能保证事件循环能及时收到取消，返回失败不等无副作用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:101-126](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/index.ts#L101-L126)

domain与真实put/list。

<details>
<summary>查看原文（26行）</summary>

```text
  let store: ReportStore | undefined
  let domain: Domain<typeof dataQualityDomainSpec> | undefined
  if (resolved.storeReports) {
    domain = await ctx.storageDomain.open(dataQualityDomainSpec)
    // Disposal during the open await: the fiber is gone, so nothing may be
    // registered any more — release the freshly opened handle instead of
    // leaking it (the storage facility is single-open per name, so an
    // unreleased handle also blocks a later remount).
    if (ctx.fiber.uid === null) {
      await domain.close()
      return
    }
    const reports = domain.table('reports')
    store = {
      put: async (record) => {
        const key = reportKeyOf(record)
        await reports.put(key, record)
        return key
      },
      get: (key) => reports.get(key),
      list: (kind) =>
        [...reports.entries()]
          .filter(([, record]) => record.kind === kind)
          .sort(([keyA], [keyB]) => (keyA < keyB ? -1 : keyA > keyB ? 1 : 0))
          .map(([key, record]) => ({ key, ...record })),
    }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:129-148](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/index.ts#L129-L148)

工具注销与domain关闭。

<details>
<summary>查看原文（20行）</summary>

```text
  // Service Provider: constructs the local DataQualityService (which publishes ctx.dataQuality) and registers the four model tools below through ctx.tools.register. The registrations live in one effect whose disposer unregisters them in reverse order, so an unmount during apply can neither lose a registration nor leave one behind.
  const service = new LocalDataQualityService(ctx, resolved, { store, now: Date.now })
  ctx.effect(() => {
    const disposers = [
      ctx.tools.register(defineProfileTool(service)),
      ctx.tools.register(defineCleanTool(service)),
      ctx.tools.register(defineVerifyTool(service)),
      ctx.tools.register(defineReportTool(service)),
    ]
    return () => {
      for (const dispose of disposers.reverse()) dispose()
    }
  }, 'dsh-data-quality: tools')
  logger.info(`dsh-data-quality ${VERSION} mounted: ctx.dataQuality + data_profile/data_clean/data_verify/data_report`)

  if (domain !== undefined) {
    const handle = domain
    ctx.effect(() => async () => {
      await handle.close()
    })
```

</details>

**依据 3 · 源码核查**：[src/provider-local.ts:68-85](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/provider-local.ts#L68-L85)

保存后事件。

<details>
<summary>查看原文（18行）</summary>

```text
  private async persist(kind: ReportRecord['kind'], dataset: string, report: Record<string, unknown>): Promise<string | undefined> {
    const store = this.deps.store
    if (store === undefined) return undefined
    const record: ReportRecord = { kind, at: this.deps.now(), dataset, report }
    const key = reportKeyOf(record)
    await store.put({ ...record })
    return key
  }

  /** Emit the adaptive session event when the call carries a session. */
  emitEvent(session: Session | undefined, kind: 'profile' | 'clean' | 'verify', dataset: string, reportKey: string | undefined, summary: { rows: number; columns?: number; rules?: number; failedRules?: number; passed?: boolean; expectations?: number; failedExpectations?: number }): void {
    if (session === undefined) return
    appendDataQualityEvent(session, `data-quality/${kind}`, {
      kind,
      dataset,
      ...(reportKey !== undefined ? { reportKey } : {}),
      summary,
    })
```

</details>

**依据 4 · 源码核查**：[src/provider-local.ts:171-196](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/provider-local.ts#L171-L196)

两报告串行且无共同事务。

<details>
<summary>查看原文（26行）</summary>

```text
    const reportKey = await this.persist('clean', request.dataset, {
      dataset: request.dataset,
      inputRows: result.inputRows,
      outputRows: result.outputRows,
      dryRun: false,
      logs: result.logs,
      contract,
      preview,
      ...(writtenPath !== undefined ? { outputPath: writtenPath } : {}),
      generatedAt,
    } as unknown as Record<string, unknown>)
    await this.persist('clean-diff', request.dataset, diff as unknown as Record<string, unknown>)
    this.emitEvent(request.session, 'clean', request.dataset, reportKey, { rows: result.outputRows, columns: result.columns.length, rules: result.logs.length })

    return {
      dataset: request.dataset,
      inputRows: result.inputRows,
      outputRows: result.outputRows,
      dryRun: false,
      logs: result.logs,
      contract,
      preview,
      ...(writtenPath !== undefined ? { outputPath: writtenPath } : {}),
      ...(reportKey !== undefined ? { reportKey } : {}),
      generatedAt,
    }
```

</details>

**依据 5 · 源码核查**：[src/provider-local.ts:200-220](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/provider-local.ts#L200-L220)

读取/禁存错误。

<details>
<summary>查看原文（21行）</summary>

```text
  override async getReport(key: string): Promise<StoredReport> {
    if (!isValidReportKey(key)) {
      throw new Error(`invalid reportKey ${JSON.stringify(key)}: expected the deterministic <timestamp>-<kind>-<fingerprint> format`)
    }
    const store = this.deps.store
    if (store === undefined) {
      throw new Error('report storage is disabled (storeReports is false); no persisted reports to read')
    }
    const record = store.get(key)
    if (record === undefined) {
      throw new Error(`no persisted report found for reportKey ${JSON.stringify(key)}`)
    }
    return { key, ...record }
  }

  /** @inheritdoc DataQualityService.listReports */
  override async listReports(kind: ReportRecord['kind']): Promise<StoredReport[]> {
    const store = this.deps.store
    if (store === undefined) {
      throw new Error('report storage is disabled (storeReports is false); no persisted reports to read')
    }
```

</details>

**依据 6 · 源码核查**：[src/tools/report.ts:116-135](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/tools/report.ts#L116-L135)

忽略exec、按key/kind读取。

<details>
<summary>查看原文（20行）</summary>

```text
    async execute(args, _exec): Promise<DataReportValue> {
      const hasKey = args.key !== undefined
      const hasKind = args.kind !== undefined
      if (hasKey === hasKind) {
        throw new Error('data_report needs exactly one of key/kind')
      }
      const format = (args.format ?? 'json') as 'json' | 'html'
      if (hasKey) {
        const record = await service.getReport(args.key as string)
        return {
          key: args.key as string,
          records: [toView(record, true)],
          ...(format === 'html' ? { html: renderRecordHtml(record) } : {}),
        }
      }
      if (format === 'html') {
        throw new Error('data_report html format requires key (exactly one report)')
      }
      const records = await service.listReports(args.kind as ReportRecord['kind'])
      return { kind: args.kind as ReportRecord['kind'], records: records.map(record => toView(record, args.includeReports === true)) }
```

</details>

**依据 7 · 源码核查**：[src/store.ts:94-100](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/store.ts#L94-L100)

毫秒/kind/path hash键。

```text
export function reportKeyOf(record: ReportRecord): string {
  const date = new Date(record.at)
  const stamp =
    `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}` +
    `${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}${String(date.getUTCMilliseconds()).padStart(3, '0')}`
  return `${stamp}-${record.kind}-${pathFingerprint(record.dataset)}`
}
```

**依据 8 · 源码核查**：[src/dataset.ts:103-110](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/dataset.ts#L103-L110)

路径hash与取消检查。

```text
export function pathFingerprint(datasetPath: string): string {
  return createHash('sha256').update(datasetPath).digest('hex').slice(0, 8)
}

/** Assert the abort signal has not fired; throws the signal reason otherwise. */
export function throwIfAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted === true) {
    throw signal.reason instanceof Error ? signal.reason : new Error('operation aborted')
```

**依据 9 · 源码核查**：[src/events.ts:99-107](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/events.ts#L99-L107)

真实事件兼容分支。

```text
export function appendDataQualityEvent(session: Session, type: DataQualityEventType, data: DataQualityEventData): void {
  if (KNOWN_SESSION_EVENT_TYPES.has(type)) {
    session.append(type, data)
    return
  }
  const append = session.append as AppendProbe
  if (Function.prototype.toString.call(append).includes('ignorable')) {
    append.call(session, type, data, { ignorable: true })
  }
```

#### 缺口

- 宿主storage耐久/覆盖语义与事件兼容未执行。
  **影响**：不能保证唯一报告、每会话隔离或每次运行都有会话审计。
  **进一步探讨**：补绑定实际storage版本，在同毫秒同path跨workspace/第二报告失败/事件异常样本核残留，再决定跨会话共享。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 应该如何试用、付出什么成本，有何可证伪改进？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议已有兼容DSH/storage的本地数据维护者在无链接、无敏感数据的独立profile副本，先profile一小文件、明确采样/分数定义，再clean dryRun，人工核类型变null/规则顺序和diff；另verify规则用passed而非工具成功判质量。首试不提供outputPath、不将citation verified当来源真实；读取/报告会把样本给模型和本地storage，不能因计算本地就忽略隐私。出现根不明、分数被当现实准确率或输出/报告状态冲突就停，回原文件与已有脚本。

首次需Node ^22.19或>=24.9、DSH engines/peers与storage stack、可信cwd和规则解释；持续是整文件内存/全表统计、报告无自动清理、模型解释token和人工抽查。插件不调用模型算术不等Agent会话零模型费，现金/时间收益未测。失败保留输入副本/另核已有输出与报告，退出停插件、按保留策略导出/删除domain与输出，输入原件不依赖插件存续。

候选改进是先计算并通过明确contract，再以同一operationId记录输入内容hash/真实路径、目标提交和报告状态，使写结果未知可查；相对当前“写后报告”，用输出别名、写后abort、第二persist失败三样本比较误覆盖/误重试和成本。若只读dryRun已满足需求、提交协调开销大于收益或宿主已有等价事务，则推翻，不计本版已有能力。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:99-114](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/package.json#L99-L114)

Node/DSH engines和peer要求。

<details>
<summary>查看原文（16行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.9.0",
    "dsh": ">=0.2.1-0 <0.3.0 || >=0.2.2-0 <0.3.0"
  },
  "packageManager": "pnpm@11.7.0",
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.5",
    "@deepseek-ai/dsh-session": ">=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0 || >=0.2.0-0 <0.3.0 || >=0.2.1-0 <0.3.0 || >=0.2.2-0 <0.3.0",
    "@deepseek-ai/dsh-storage": ">=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0 || >=0.2.0-0 <0.3.0 || >=0.2.1-0 <0.3.0 || >=0.2.2-0 <0.3.0",
    "@deepseek-ai/dsh-storage-domain": ">=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0 || >=0.2.0-0 <0.3.0 || >=0.2.1-0 <0.3.0 || >=0.2.2-0 <0.3.0",
    "@deepseek-ai/dsh-storage-json": ">=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0 || >=0.2.0-0 <0.3.0 || >=0.2.1-0 <0.3.0 || >=0.2.2-0 <0.3.0",
    "@deepseek-ai/dsh-tools": ">=0.1.2-rc.1 <0.2.0 || >=0.1.5-alpha.1 <0.2.0 || >=0.1.6-0 <0.2.0 || >=0.1.7-0 <0.2.0 || >=0.2.0-0 <0.3.0 || >=0.2.1-0 <0.3.0 || >=0.2.2-0 <0.3.0",
    "@deepseek-ai/schemastery": "^3.18.5-alpha.1"
  },
  "dependencies": {
    "zod": "4.4.3"
```

</details>

**依据 2 · 作者声明**：[cordis.patch.yml:6-9](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/cordis.patch.yml#L6-L9)

裸profile需storage stack。

```text
# The shipped profiles (web/headless/sdk/acp) compose the storage stack
# (storage + storage-json + storage-domain) through the dsh-base bundle, so
# this patch mounts only the plugin row. A bare profile without dsh-base must
# compose the storage stack itself.
```

**依据 3 · 源码核查**：[src/provider-local.ts:109-183](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/provider-local.ts#L109-L183)

实际dryRun与提交顺序。

<details>
<summary>查看原文（75行）</summary>

```text
  override async cleanDataset(request: CleanRequest): Promise<CleanRunReport> {
    throwIfAborted(request.signal)
    const dryRun = request.dryRun === true
    const absolute = resolveWorkspacePath(request.workspace, request.dataset, this.config)
    const table = await loadTable(absolute, this.config, request.signal)
    const result = applyCleanRules(table, request.rules, { signal: request.signal })

    let writtenPath: string | undefined
    if (!dryRun && request.outputPath !== undefined) {
      const outputAbsolute = resolveWorkspacePath(request.workspace, request.outputPath, this.config)
      if (outputAbsolute === absolute) {
        throw new Error(`outputPath ${JSON.stringify(request.outputPath)} would overwrite the input dataset; choose a different path`)
      }
      const ext = path.extname(outputAbsolute).toLowerCase()
      const text = ext === '.csv' || ext === '.tsv'
        ? serializeDelimited(result.columns, result.rows, ext === '.csv' ? ',' : '\t')
        : ext === '.jsonl'
          ? `${result.rows.map((row) => JSON.stringify(row)).join('\n')}\n`
          : `${JSON.stringify(result.rows, null, 2)}\n`
      await mkdir(path.dirname(outputAbsolute), { recursive: true })
      throwIfAborted(request.signal)
      await writeFile(outputAbsolute, text, 'utf8')
      writtenPath = request.outputPath
    }

    const generatedAt = this.deps.now()
    // The contract summary is part of the model-visible canonical value, so it
    // must also be part of the durable report (model-visible ⟺ logged).
    const contract = computeCleanContract(result, request.rules, { signal: request.signal })
    const outputTable = {
      columns: result.columns,
      rows: result.rows,
      ...(table.encoding !== undefined ? { encoding: table.encoding } : {}),
    }
    // The before/after profile diff preview is the expected diff in a dry run
    // and the durable audit artifact (separate `clean-diff` record) otherwise.
    const diff = computeCleanProfileDiff(table, outputTable, {
      dataset: request.dataset,
      generatedAt,
      scorecardWeights: this.config.scorecardWeights,
      signal: request.signal,
    })
    // The preview is part of the model-visible canonical value, so it must
    // also be part of the durable report: otherwise the clean result's preview
    // could not be reconstructed from the session log (model-visible ⟺ logged).
    const preview = { columns: result.columns, rows: result.rows.slice(0, this.config.evidenceRowLimit).map((row) => truncateRow(row)) }

    if (dryRun) {
      this.emitEvent(request.session, 'clean', request.dataset, undefined, { rows: result.outputRows, columns: result.columns.length, rules: result.logs.length })
      return {
        dataset: request.dataset,
        inputRows: result.inputRows,
        outputRows: result.outputRows,
        dryRun: true,
        logs: result.logs,
        contract,
        preview,
        diffPreview: diff,
        generatedAt,
      }
    }

    const reportKey = await this.persist('clean', request.dataset, {
      dataset: request.dataset,
      inputRows: result.inputRows,
      outputRows: result.outputRows,
      dryRun: false,
      logs: result.logs,
      contract,
      preview,
      ...(writtenPath !== undefined ? { outputPath: writtenPath } : {}),
      generatedAt,
    } as unknown as Record<string, unknown>)
    await this.persist('clean-diff', request.dataset, diff as unknown as Record<string, unknown>)
    this.emitEvent(request.session, 'clean', request.dataset, reportKey, { rows: result.outputRows, columns: result.columns.length, rules: result.logs.length })
```

</details>

**依据 4 · 源码核查**：[src/profile.ts:279-305](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/profile.ts#L279-L305)

全表统计负担。

<details>
<summary>查看原文（27行）</summary>

```text
): ProfileReport {
  throwIfAborted(options.signal)
  const profiled = options.sample === undefined ? table.rows : sampleRows(table.rows, options.sample)
  const columns = table.columns.map((column) => profileColumn(profiled, column, options.signal))
  const detection = detectDuplicateRows(table, { sampleLimit: options.duplicateSampleLimit ?? DEFAULT_DUPLICATE_SAMPLE_LIMIT, signal: options.signal })
  const scorecard = computeScorecard(table, {
    now: options.generatedAt,
    duplicateRows: detection.duplicateRows,
    declaredSchema: options.declaredSchema,
    weights: options.scorecardWeights,
    signal: options.signal,
  })
  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    dataset: options.dataset,
    rowCount: table.rows.length,
    sampled: profiled.length !== table.rows.length,
    profiledRows: profiled.length,
    columnCount: table.columns.length,
    duplicateRows: detection.duplicateRows,
    duplicateRate: detection.duplicateRate,
    duplicateSampleRowIndexes: detection.duplicateSampleRowIndexes,
    scorecard,
    ...(table.encoding !== undefined ? { encoding: table.encoding } : {}),
    columns,
    generatedAt: options.generatedAt,
  }
```

</details>

**依据 5 · 源码核查**：[src/store.ts:94-100](https://github.com/PerryLink/dsh-data-quality/blob/195b7da055959627b17d041f0421fac7f644e455/src/store.ts#L94-L100)

现有key不含操作/内容身份。

```text
export function reportKeyOf(record: ReportRecord): string {
  const date = new Date(record.at)
  const stamp =
    `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}` +
    `${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}${String(date.getUTCMilliseconds()).padStart(3, '0')}`
  return `${stamp}-${record.kind}-${pathFingerprint(record.dataset)}`
}
```

#### 缺口

- 未安装/跑数据/测恢复或总成本。
  **影响**：仅只读/干跑副本有受控试用依据，不给生产自动清理许可。
  **进一步探讨**：记录小文件正确性、人工复核分钟和模型usage；三故障样本对照后再决定是否实现提交收据或开放写出。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
