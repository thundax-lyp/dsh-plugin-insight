# DSH AI4Scholar

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[c7a4072](https://github.com/literaf/dsh-ai4scholar/tree/c7a4072e3199b1372d4ea01d346d01875c9cf325)

<!-- BEGIN META -->
[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/literaf/dsh-ai4scholar) [![npm 30d 7,967](https://img.shields.io/static/v1?label=npm+30d&message=7%2C967&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ai4scholar) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ai4scholar)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中检索和去重多个论文来源，并提供文献详情、引文及积分信息。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将来源、匹配与部分失败带入同一次筛选。

> **主要限制**：[Q03](#research-q03) 失败来源的积分未计入成功项汇总，工具显示不能单独作为完整账单。

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
  - [Q01 · 多源检索对谁有用？](#detail-section-11)
  - [Q02 · 统一入口如何合并不同论文？](#detail-section-12)
  - [Q03 · 积分合计是否代表全部已产生费用？](#detail-section-13)
  - [Q04 · 如何低范围验证后再采用？](#detail-section-14)
  - [Q05 · 为每条候选展示归并证据能否减少误引？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在若干论文平台做初筛时，将可回源的候选集中并核对失败来源。

直接在原站检索并用参考文献表人工合并。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 统一查询 | 多平台候选初筛 | 部分来源可能失败，需回原站 |
| 身份合并 | 减少跨源重复 | 题名近似与译名不能保证正确归并 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与获准来源 | 必需 | 注册与查询 | 回原站 |
| 有效 API 凭据 | 对应收费源必需 | 请求认证 | 暂停付费查询 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选单一来源与无敏感问题 | 确认数据范围 |
| 查询 | 核对 DOI、摘要和来源 | 可回到原站 |
| 扩展 | 决定是否增加来源 | 失败和积分均能对账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主和外部账户条件 | 配置凭据及选择平台 | 费用和用时未测 |
| 持续 | 按实际调用消耗 | 核对归并与账单 | 每合格条目的费用未知 |
| 失败 | 外部尝试可能已发生 | 查原站及余额 | 重复费用不由错误推定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多源初筛 | 逐源状态与合并规则 | 真实召回和误并 |
| 积分提示 | 收集成功返回的响应头 | 全部失败与重试费用 |

> **思考**：[Q03](#research-q03) 失败来源的积分未计入成功项汇总，工具显示不能单独作为完整账单。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将来源、匹配与部分失败带入同一次筛选。

[Q02](#research-q02) 按平台保留失败与候选身份，[Q03](#research-q03) 积分汇总的成功范围可定位。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 失败来源的积分未计入成功项汇总，工具显示不能单独作为完整账单。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从单源合成任务起步，检查来源和真实费用；无法对账时回原站。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定统一检索、部分失败及积分捕获代码。服务覆盖、准确性与实际计费未验收。

- 已检查：作者 README、包清单、源码路径 src/tools/unified.ts、src/api-client.ts、README_CN.md、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽查统一检索与 API 请求路径。未核查所有全文、命令、凭据界面及外部服务。
- 下一步：固定题集对比各原站，模拟一源超时并按实际账单校对费用。

**分析版本**

- **仓库**：[literaf/dsh-ai4scholar](https://github.com/literaf/dsh-ai4scholar)
- **版本号**：0.6.3（[固定提交 c7a4072](https://github.com/literaf/dsh-ai4scholar/tree/c7a4072e3199b1372d4ea01d346d01875c9cf325)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 展示每次归并的规则与失败源，可测试是否降低误引。

固定题集对比各原站，模拟一源超时并按实际账单校对费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 866 | — | — | 15188 |
| .mjs | source | 1 | 53 | 43 | 9 | — |
| .ts | source | 47 | 8609 | 6989 | 1211 | — |
| .tsx | source | 8 | 2346 | 2210 | 76 | — |
| .ts | test | 27 | 4806 | 4244 | 366 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/literaf/dsh-ai4scholar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/literaf/dsh-ai4scholar/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/literaf/dsh-ai4scholar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：做初步文献筛选的 DSH 用户能否获得可追溯的多源候选，并识别覆盖与积分缺口？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多源检索对谁有用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要同时扫论文库和预印本的研究人员，可把多个平台候选收进一张有来源的列表，减少手工合并。合格结果是保留可回源身份并识别哪个平台缺席。直接访问论文站仍适合单源准确查询，系统综述还需要保存策略和独立完整性检查。

#### 证据与依据

**依据 1 · 作者声明**：[README_CN.md:63-79](https://github.com/literaf/dsh-ai4scholar/blob/c7a4072e3199b1372d4ea01d346d01875c9cf325/README_CN.md#L63-L79)

作者给出平台选择、费用与积分。

<details>
<summary>查看原文（17行）</summary>

```text
| **论文检索** | `search_papers`——默认只查 Semantic Scholar；通过 `sources` 按需选择 PubMed、arXiv、Google Scholar、中文文献。多平台结果按 DOI / arXiv id / PMID / 标题去重合并，同时命中的排前面 | 按所选平台计 |
| **Semantic Scholar**（2 亿+ 论文，全学科） | `search_semantic`、`search_semantic_bulk`、`search_semantic_snippets`（全文片段）、`search_semantic_paper_match`（标题→论文）、`get_semantic_paper_detail`、`get_semantic_paper_batch`、`get_semantic_citations`、`get_semantic_references`、`get_semantic_paper_authors`、`search_semantic_authors`、`get_semantic_author_detail`、`get_semantic_author_batch`、`get_semantic_author_papers`、`get_semantic_recommendations`、`get_semantic_recommendations_for_paper`、`download_semantic`、`read_semantic_paper` | 积分 |
| **PubMed**（生物医学） | `search_pubmed`、`get_pubmed_paper_detail`、`get_pubmed_paper_batch`、`get_pubmed_citations`、`get_pubmed_related` | 积分 |
| **中文文献**（期刊、学位论文、会议论文；题录与可用摘要） | `search_chinese` | 积分 |
| **Google Scholar**（论文、学者与引用格式） | `search_google_scholar`、`search_google_scholar_profiles`、`get_google_scholar_author`、`get_google_scholar_citation` | 积分 |
| **Google Patents**（专利） | `search_google_patents` | 积分 |
| **arXiv** | `search_arxiv`、`download_arxiv`、`read_arxiv_paper` | 免费 |
| **bioRxiv / medRxiv** | `search_biorxiv`、`search_medrxiv`、`download_biorxiv`、`download_medrxiv`、`read_biorxiv_paper`、`read_medrxiv_paper` | 免费 |
| **任意 DOI** | `download_by_doi`、`read_by_doi`（开放获取随处可用；付费期刊需校园网/机构权限） | 免费 |
| **写作与绘图** | `auto_cite`（自动插入真实引用 + 参考文献 + BibTeX）、`sci_draw`（生成 / 编辑 / 风格 / 合成 / SVG / 矢量化科研图） | 积分 |
| **账户** | `get_ai4scholar_credits`，以及斜杠命令 `/ai4scholar` | 免费 |

**优先单平台检索。** 出厂设置下，不传 `sources`（或传 `[]`）时只查 Semantic Scholar；在插件页面修改默认平台后，同样的调用会按你的设置同时查询所选平台。生物医学或临床主题可按需选择 `sources: ["pubmed"]`。明确要求扩大覆盖面，或单平台结果不足时，再指定多个来源，例如 `["semantic-scholar", "pubmed"]`。各收费 API 请求的积分会累加；Google Scholar 按页计费，arXiv 免费。如果配置的默认平台全部被关闭，则按 Semantic Scholar、PubMed、arXiv、Google Scholar、中文文献的顺序，选择第一个已开启的平台。

所有论文列表类工具返回统一的结构——标题、作者、年份、期刊/会议、被引数、DOI/PMID/arXiv 等标识、链接、开放获取 PDF、摘要——模型（以及 Code Mode 程序）可以跨平台链式调用而无需特判。结果在 dsh Web UI 中渲染为引用卡片；全文类工具按片段返回（`offset` / `max_chars`），40 页的论文不会一次冲爆上下文。

**积分看得见。** 对话里每张计费工具卡片的标题都带本次消耗（`Semantic Scholar: protein folding · 10 credits · 4,990 left`）；模型看到的结果末尾有 `AI4Scholar credits — this call: 10 · this session: 40 · remaining: 4,960`（来自 API 的 `X-Credits-*` 响应头），并且提示词要求模型在用了计费工具的回合结尾用一句话汇报本轮消耗与余额；`/ai4scholar` 渲染成余额卡片（可用积分、明细、会员、Key 状态、本会话消耗），`get_ai4scholar_credits` 给模型同样的数字。免费源（arXiv、bioRxiv/medRxiv、DOI）不带积分行。
```

</details>

**依据 2 · 源码核查**：[src/tools/unified.ts:331-360](https://github.com/literaf/dsh-ai4scholar/blob/c7a4072e3199b1372d4ea01d346d01875c9cf325/src/tools/unified.ts#L331-L360)

返回平台级状态和合并候选。

<details>
<summary>查看原文（30行）</summary>

```text
      settled.forEach((outcome, i) => {
        const source = sources[i]!
        if (outcome.status === 'fulfilled') {
          lists.push(outcome.value.papers)
          perSource.push(compact({
            source, count: outcome.value.papers.length,
            total: outcome.value.total > outcome.value.papers.length ? outcome.value.total : undefined,
            query: outcome.value.query !== query ? outcome.value.query : undefined,
            nextOffset: outcome.value.nextOffset,
          }))
          truncated = truncated || outcome.value.truncated
          creditParts.push(outcome.value.credits)
          if (outcome.value.warning !== undefined) failures.push(`${SOURCE_LABEL[source]}: ${outcome.value.warning}`)
        } else {
          const message = outcome.reason instanceof Error ? outcome.reason.message : String(outcome.reason)
          perSource.push({ source, count: 0, error: message })
          failures.push(`${SOURCE_LABEL[source]}: ${message}`)
        }
      })
      if (lists.length === 0) throw new Error(`every platform failed — ${failures.join('; ')}`)
      const papers = mergePaperLists(lists)
      return compact({
        query,
        sources: [...sources],
        total: papers.length,
        papers,
        perSource,
        truncated,
        warning: failures.length > 0 ? failures.join('; ') : undefined,
        credits: sumCredits(creditParts),
```

</details>

#### 缺口

- 真实筛选集上的遗漏和重复未测。
  **影响**：不能用合并列表证明覆盖。
  **进一步探讨**：对固定领域题集比较原站与工具结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 统一入口如何合并不同论文？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主按配置挂载 search_papers，工具过滤已启用来源并并发等待各结果。合并依据 DOI、arXiv、PMID 等身份和标题规则。标题相同且 DOI 明确不同时拒绝这一标题匹配，只有唯一候选才合并。合并顺序及各平台原排名影响结果，跨语言无共同身份的条目仍可重复。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:304-311](https://github.com/literaf/dsh-ai4scholar/blob/c7a4072e3199b1372d4ea01d346d01875c9cf325/src/index.ts#L304-L311)

启用来源传给统一入口。

```text
  const platforms: Record<UnifiedSource, boolean> = {
    'semantic-scholar': resolved.semanticScholar,
    'pubmed': resolved.pubmed,
    'arxiv': resolved.arxiv,
    'google-scholar': resolved.googleScholar,
    'chinese': resolved.chineseLiterature,
  }
  if (resolved.unifiedSearch) applyUnifiedSearchTool(ctx, runtime, platforms, resolved.searchSources)
```

**依据 2 · 源码核查**：[src/tools/unified.ts:169-208](https://github.com/literaf/dsh-ai4scholar/blob/c7a4072e3199b1372d4ea01d346d01875c9cf325/src/tools/unified.ts#L169-L208)

标题匹配约束与合并。

<details>
<summary>查看原文（40行）</summary>

```text
export function mergePaperLists(lists: readonly (readonly Paper[])[]): Paper[] {
  const merged: Paper[] = []
  const bestRank: number[] = []
  const index = new Map<string, Set<number>>()
  const remember = (keys: readonly string[], position: number): void => {
    for (const key of keys) {
      if (!index.has(key)) index.set(key, new Set())
      index.get(key)!.add(position)
    }
  }
  for (const list of lists) {
    list.forEach((paper, rank) => {
      const keys = identityKeys(paper)
      let hit: number | undefined
      for (const key of keys) {
        const candidates = [...(index.get(key) ?? [])].filter((position) => {
          if (!key.startsWith('title')) return true
          const a = doiKey(merged[position]!), b = doiKey(paper)
          return a === undefined || b === undefined || a === b
        })
        // Identical titles with distinct DOIs remain separate. A title-only
        // record cannot safely choose between several such publications.
        if (candidates.length === 1) { hit = candidates[0]; break }
      }
      if (hit !== undefined) {
        merged[hit] = mergeInto(merged[hit]!, paper)
        bestRank[hit] = Math.min(bestRank[hit]!, rank)
        remember(keys, hit)
      } else {
        const stamped: Paper = compact({ ...paper, extra: compact({ ...(paper.extra ?? {}), foundIn: [paper.source] }) })
        merged.push(stamped)
        bestRank.push(rank)
        remember(keys, merged.length - 1)
      }
    })
  }
  const foundCount = (p: Paper): number => (Array.isArray(p.extra?.foundIn) ? (p.extra.foundIn as unknown[]).length : 1)
  // Multi-platform hits first; then each platform's own relevance rank (best rank across
  // platforms), so results interleave instead of one platform's list dominating; then citations.
  return merged
```

</details>

**依据 3 · 源码核查**：[src/tools/unified.ts:305-325](https://github.com/literaf/dsh-ai4scholar/blob/c7a4072e3199b1372d4ea01d346d01875c9cf325/src/tools/unified.ts#L305-L325)

配置解析、逐源请求及 allSettled。

<details>
<summary>查看原文（21行）</summary>

```text
    async execute(args, exec) {
      const query = requireQuery(args.query)
      const chosen = (args.sources !== undefined && args.sources.length > 0 ? args.sources : fallbackDefaults) as UnifiedSource[]
      const sources = UNIFIED_SOURCES.filter((s) => chosen.includes(s) && enabled[s])
      if (sources.length === 0) throw new Error(`sources must name at least one of: ${offered.join(', ')}`)
      // An explicit count applies to every platform; otherwise each uses its own default.
      const per = (s: UnifiedSource): number => boundResults(args.max_results_per_source, limitsFor(limits, runtime.resultsPerSource, s), PLATFORM_CAP[s])
      if (args.year_from !== undefined && args.year_to !== undefined && args.year_from > args.year_to) throw new Error('year_from must not be later than year_to')
      const s2Year = args.year_from !== undefined || args.year_to !== undefined ? `${args.year_from ?? ''}-${args.year_to ?? ''}` : undefined
      const runners: Record<UnifiedSource, () => Promise<PaperSearchValue>> = {
        'semantic-scholar': () => runSemanticSearch(runtime, { query, limit: per('semantic-scholar'), year: s2Year }, exec.signal, exec.agent),
        'pubmed': () => runPubmedSearch(runtime, { query, limit: per('pubmed'), minDate: args.year_from !== undefined ? String(args.year_from) : undefined, maxDate: args.year_to !== undefined ? String(args.year_to) : undefined }, exec.signal, exec.agent),
        'arxiv': async () => {
          const page = await runArxivSearch(runtime, { query, limit: per('arxiv'), dateFrom: args.year_from !== undefined ? `${args.year_from}-01-01` : undefined }, exec.signal)
          // arXiv has no upper date bound in the query syntax; apply it client-side.
          return args.year_to !== undefined ? { ...page, papers: page.papers.filter((p) => p.year === undefined || p.year <= args.year_to!) } : page
        },
        'google-scholar': () => runScholarSearch(runtime, { query, wanted: per('google-scholar'), yearFrom: args.year_from, yearTo: args.year_to }, exec.signal, exec.agent),
        'chinese': () => runChineseSearch(runtime, { query: args.chinese_query ?? query, limit: per('chinese'), yearFrom: args.year_from, yearTo: args.year_to }, exec.signal, exec.agent),
      }
      const settled = await Promise.allSettled(sources.map((s) => runners[s]()))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 积分合计是否代表全部已产生费用？

**研究主题**：缺陷与关键质疑

#### 完整回答

多源工具只把 fulfilled 结果的 credits 纳入合计，失败来源只返回错误。API 客户端会对部分失败重试，只有可成功解析的返回携带积分到调用结果。连接中断、非成功或 JSON 解析失败时，不能从合计反推供应方未收费；实际扣费应查独立账单或余额。查询过程也可能只覆盖部分平台。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/unified.ts:329-360](https://github.com/literaf/dsh-ai4scholar/blob/c7a4072e3199b1372d4ea01d346d01875c9cf325/src/tools/unified.ts#L329-L360)

只累计成功项并保留失败来源。

<details>
<summary>查看原文（32行）</summary>

```text
      const creditParts: (CreditsValue | undefined)[] = []
      let truncated = false
      settled.forEach((outcome, i) => {
        const source = sources[i]!
        if (outcome.status === 'fulfilled') {
          lists.push(outcome.value.papers)
          perSource.push(compact({
            source, count: outcome.value.papers.length,
            total: outcome.value.total > outcome.value.papers.length ? outcome.value.total : undefined,
            query: outcome.value.query !== query ? outcome.value.query : undefined,
            nextOffset: outcome.value.nextOffset,
          }))
          truncated = truncated || outcome.value.truncated
          creditParts.push(outcome.value.credits)
          if (outcome.value.warning !== undefined) failures.push(`${SOURCE_LABEL[source]}: ${outcome.value.warning}`)
        } else {
          const message = outcome.reason instanceof Error ? outcome.reason.message : String(outcome.reason)
          perSource.push({ source, count: 0, error: message })
          failures.push(`${SOURCE_LABEL[source]}: ${message}`)
        }
      })
      if (lists.length === 0) throw new Error(`every platform failed — ${failures.join('; ')}`)
      const papers = mergePaperLists(lists)
      return compact({
        query,
        sources: [...sources],
        total: papers.length,
        papers,
        perSource,
        truncated,
        warning: failures.length > 0 ? failures.join('; ') : undefined,
        credits: sumCredits(creditParts),
```

</details>

**依据 2 · 源码核查**：[src/api-client.ts:375-407](https://github.com/literaf/dsh-ai4scholar/blob/c7a4072e3199b1372d4ea01d346d01875c9cf325/src/api-client.ts#L375-L407)

有界尝试、429、网络错误、成功响应积分。

<details>
<summary>查看原文（33行）</summary>

```text
    const url = this.buildUrl(path, options.query)
    const attempts = Math.max(1, this.options.maxRetries)
    const timeoutMs = options.timeoutMs ?? this.options.timeoutMs
    let lastError: ApiErr = { ok: false, error: 'request not attempted', status: 0 }
    for (let attempt = 0; attempt < attempts; attempt++) {
      if (attempt > 0) {
        await sleep(this.options.retryBackoffMs * 2 ** (attempt - 1), options.signal)
      }
      try {
        const res = await fetch(url, {
          method,
          headers: this.headers(options.apiKey),
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
          signal: requestSignal(options.signal, timeoutMs),
        })
        if (res.status === 429) {
          lastError = { ok: false, ...(await describeFailure(res)), status: 429 }
          continue
        }
        if (!res.ok) return { ok: false, ...(await describeFailure(res)), status: res.status }
        const credits = creditsFromHeaders(res.headers)
        return { ok: true, data: (await res.json()) as T, ...(credits !== undefined ? { credits } : {}) }
      } catch (error) {
        if (isCallerAbort(error, options.signal)) throw error
        const message = error instanceof Error ? error.message : String(error)
        lastError = {
          ok: false,
          error: isTimeout(error) ? `request timed out after ${timeoutMs} ms` : message,
          status: 0,
        }
      }
    }
    return { ok: false, error: `${lastError.error} (after ${attempts} attempt${attempts === 1 ? '' : 's'})`, status: lastError.status, ...(lastError.code !== undefined ? { code: lastError.code } : {}) }
```

</details>

#### 缺口

- 当前各服务计费行为未独立核对。
  **影响**：缺少响应头时可能无法对账。
  **进一步探讨**：用测试账户比较服务账单和成功、超时及重复尝试的本地提示。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何低范围验证后再采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在隔离配置中先用一个获准来源和不含私人信息的题目，对照原站核查 DOI、年份与摘要。需兼容 DSH、可达外部服务以及收费源的有效凭据。扩大来源前确认实际积分和可发送查询范围。源失败、归并错配或费用无法对账时暂停扩展，回原站和独立文献管理表。

#### 证据与依据

**依据 1 · 作者声明**：[README_CN.md:73-81](https://github.com/literaf/dsh-ai4scholar/blob/c7a4072e3199b1372d4ea01d346d01875c9cf325/README_CN.md#L73-L81)

作者说明单源默认与扣费边界。

```text
| **账户** | `get_ai4scholar_credits`，以及斜杠命令 `/ai4scholar` | 免费 |

**优先单平台检索。** 出厂设置下，不传 `sources`（或传 `[]`）时只查 Semantic Scholar；在插件页面修改默认平台后，同样的调用会按你的设置同时查询所选平台。生物医学或临床主题可按需选择 `sources: ["pubmed"]`。明确要求扩大覆盖面，或单平台结果不足时，再指定多个来源，例如 `["semantic-scholar", "pubmed"]`。各收费 API 请求的积分会累加；Google Scholar 按页计费，arXiv 免费。如果配置的默认平台全部被关闭，则按 Semantic Scholar、PubMed、arXiv、Google Scholar、中文文献的顺序，选择第一个已开启的平台。

所有论文列表类工具返回统一的结构——标题、作者、年份、期刊/会议、被引数、DOI/PMID/arXiv 等标识、链接、开放获取 PDF、摘要——模型（以及 Code Mode 程序）可以跨平台链式调用而无需特判。结果在 dsh Web UI 中渲染为引用卡片；全文类工具按片段返回（`offset` / `max_chars`），40 页的论文不会一次冲爆上下文。

**积分看得见。** 对话里每张计费工具卡片的标题都带本次消耗（`Semantic Scholar: protein folding · 10 credits · 4,990 left`）；模型看到的结果末尾有 `AI4Scholar credits — this call: 10 · this session: 40 · remaining: 4,960`（来自 API 的 `X-Credits-*` 响应头），并且提示词要求模型在用了计费工具的回合结尾用一句话汇报本轮消耗与余额；`/ai4scholar` 渲染成余额卡片（可用积分、明细、会员、Key 状态、本会话消耗），`get_ai4scholar_credits` 给模型同样的数字。免费源（arXiv、bioRxiv/medRxiv、DOI）不带积分行。

**中文文献。** `search_chinese` 支持中文关键词、文献类型（期刊／学位论文／会议论文）、年份筛选、排序和分页，也可以在 `search_papers` 中通过 `sources: ["chinese"]` 使用；出厂默认不勾选。中英文联合检索可传入 `query: "bird migration"`、`chinese_query: "鸟类迁徙"`、`sources: ["semantic-scholar", "chinese"]`。各来源按共同 DOI 和规范化标题去重；较短的中文标题还需年份和第一作者相同，DOI 不同的记录不会仅凭标题合并。中英文标题不同又没有共同标识时，可能仍保留两条。中文文献目前返回题录和可用摘要，不提供全文下载。
```

**依据 2 · 作者声明**：[README_CN.md:109-116](https://github.com/literaf/dsh-ai4scholar/blob/c7a4072e3199b1372d4ea01d346d01875c9cf325/README_CN.md#L109-L116)

作者说明凭据和宿主工作台。

```text
然后在网页里配置一次：

1. **设置 → 模型**：填 DeepSeek API Key（[platform.deepseek.com](https://platform.deepseek.com) 获取）。
2. **插件 → 已安装 → dsh-ai4scholar**（也可以打开 **设置 → AI4Scholar**）：粘贴 AI4Scholar API Key（[ai4scholar.net](https://ai4scholar.net?src=dsh) 获取），点 **保存**。卡片会把它存进 dsh 的凭据存储（`$DSH_HOME/.credentials.yaml`，权限 0600，和模型页保存 DeepSeek Key 是同一个地方），立刻测试（`✓ Key 有效 · 可用积分 89,419`），下一次工具调用即生效，无需重启；「刷新」可随时再测。已保存的密钥默认隐藏，右侧显示「密钥已配置」；点击眼睛可显示或隐藏。收起、离开页面或切换到其他窗口后会清除已显示的明文。

新版 DSH Desktop 在左侧 **插件 → 已安装** 中点击 **dsh-ai4scholar**，详情页就会直接显示 Key 表单。**设置 → 内置插件** 现在是宿主清单，不再承载这个表单。旧版 Harness 仍保留原来的 **设置 → 插件 → AI4Scholar** 卡片。已保存的 Key 继续有效，各入口使用同一个凭据引用。

0.6.0 新增侧栏 **Ai4Scholar** 工作台。0.6.1 起，入口使用随主题变色的单色放大镜，与其他导航图标保持一致。选择来源、输入关键词即可直接搜索，无需先发起聊天或配置聊天模型。搜索后左侧显示结果列表，右侧显示所选文献详情；右上角的**设置**与原来的两个入口共用 API Key 和默认参数。筛选按来源提供条数、可用的年份范围和日期排序；bioRxiv/medRxiv 使用学科分类与最近天数浏览。全文片段和专利分别展示对应内容。结果与最近搜索仅保存在本次运行的内存中，回看已加载页面不会重复请求；收费来源的新搜索与新分页会使用 API 积分，结果显示接口实际返回的消耗。工作台需要宿主的认证插件 Fetch 通道，已在 Harness 0.2.2-rc.1 验证；旧版宿主仍可使用原有工具和设置入口。
```

**依据 3 · 源码核查**：[src/api-client.ts:359-388](https://github.com/literaf/dsh-ai4scholar/blob/c7a4072e3199b1372d4ea01d346d01875c9cf325/src/api-client.ts#L359-L388)

实际调用带凭据与超时。

<details>
<summary>查看原文（30行）</summary>

```text
  private headers(apiKey: string | undefined): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': this.options.userAgent,
    }
    if (apiKey !== undefined && apiKey.length > 0) headers.Authorization = `Bearer ${apiKey}`
    return headers
  }

  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    body: Record<string, unknown> | undefined,
    options: RequestOptions,
  ): Promise<ApiResult<T>> {
    const url = this.buildUrl(path, options.query)
    const attempts = Math.max(1, this.options.maxRetries)
    const timeoutMs = options.timeoutMs ?? this.options.timeoutMs
    let lastError: ApiErr = { ok: false, error: 'request not attempted', status: 0 }
    for (let attempt = 0; attempt < attempts; attempt++) {
      if (attempt > 0) {
        await sleep(this.options.retryBackoffMs * 2 ** (attempt - 1), options.signal)
      }
      try {
        const res = await fetch(url, {
          method,
          headers: this.headers(options.apiKey),
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
          signal: requestSignal(options.signal, timeoutMs),
```

</details>

#### 缺口

- 真实账户费用和处理时间未测。
  **影响**：无法判断每条可用文献的总成本。
  **进一步探讨**：按合格条目记录检索、复核和外部费用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 为每条候选展示归并证据能否减少误引？

**研究主题**：新假设与验证

#### 完整回答

可以试验附带合并命中的具体 DOI 或标题规则和失败平台提示，方便筛选者优先核查模糊归并。当前保留 foundIn 与 perSource 可作起点。构造同标题不同 DOI、中英译名及一源失败的题集，对比错误合并、漏检和耗时。若用户仍需逐项回源而正确率无提升，界面不值得加复杂度。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/unified.ts:181-201](https://github.com/literaf/dsh-ai4scholar/blob/c7a4072e3199b1372d4ea01d346d01875c9cf325/src/tools/unified.ts#L181-L201)

合并规则可作为解释依据。

<details>
<summary>查看原文（21行）</summary>

```text
      const keys = identityKeys(paper)
      let hit: number | undefined
      for (const key of keys) {
        const candidates = [...(index.get(key) ?? [])].filter((position) => {
          if (!key.startsWith('title')) return true
          const a = doiKey(merged[position]!), b = doiKey(paper)
          return a === undefined || b === undefined || a === b
        })
        // Identical titles with distinct DOIs remain separate. A title-only
        // record cannot safely choose between several such publications.
        if (candidates.length === 1) { hit = candidates[0]; break }
      }
      if (hit !== undefined) {
        merged[hit] = mergeInto(merged[hit]!, paper)
        bestRank[hit] = Math.min(bestRank[hit]!, rank)
        remember(keys, hit)
      } else {
        const stamped: Paper = compact({ ...paper, extra: compact({ ...(paper.extra ?? {}), foundIn: [paper.source] }) })
        merged.push(stamped)
        bestRank.push(rank)
        remember(keys, merged.length - 1)
```

</details>

**依据 2 · 源码核查**：[src/tools/unified.ts:335-359](https://github.com/literaf/dsh-ai4scholar/blob/c7a4072e3199b1372d4ea01d346d01875c9cf325/src/tools/unified.ts#L335-L359)

来源状态可用于缺口说明。

<details>
<summary>查看原文（25行）</summary>

```text
          perSource.push(compact({
            source, count: outcome.value.papers.length,
            total: outcome.value.total > outcome.value.papers.length ? outcome.value.total : undefined,
            query: outcome.value.query !== query ? outcome.value.query : undefined,
            nextOffset: outcome.value.nextOffset,
          }))
          truncated = truncated || outcome.value.truncated
          creditParts.push(outcome.value.credits)
          if (outcome.value.warning !== undefined) failures.push(`${SOURCE_LABEL[source]}: ${outcome.value.warning}`)
        } else {
          const message = outcome.reason instanceof Error ? outcome.reason.message : String(outcome.reason)
          perSource.push({ source, count: 0, error: message })
          failures.push(`${SOURCE_LABEL[source]}: ${message}`)
        }
      })
      if (lists.length === 0) throw new Error(`every platform failed — ${failures.join('; ')}`)
      const papers = mergePaperLists(lists)
      return compact({
        query,
        sources: [...sources],
        total: papers.length,
        papers,
        perSource,
        truncated,
        warning: failures.length > 0 ? failures.join('; ') : undefined,
```

</details>

#### 缺口

- 未验证解释是否有助于筛选。
  **影响**：实际错误率变化未知。
  **进一步探讨**：用带人工标签的候选集对照。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
