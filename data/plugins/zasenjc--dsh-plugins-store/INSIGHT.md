# DSH Plugins Store

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[8dbdf81](https://github.com/ZASENJC/dsh-plugins-store/tree/8dbdf819ae1b38eb67a925398776b293fb85583f)

<!-- BEGIN META -->
[![GitHub ★ 74](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=74&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZASENJC/dsh-plugins-store)
<!-- END META -->

> **功能**：自动收录、分类并以固定源码验证状态组织插件市场

> **亮点**：[Q01](#research-q01) 把可定位验证记录加入发现流程。

> **主要限制**：[Q03](#research-q03) 标签有版本与环境边界，loader只测apply初始化；[Q02](#research-q02) 清理失败不撤销verified。

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
  - [Q01 · 根项目和可装插件分别做什么？](#detail-section-11)
  - [Q02 · 验证状态怎样得到？](#detail-section-12)
  - [Q03 · 沙箱和标签能证明什么？](#detail-section-13)
  - [Q04 · 用户与维护者各怎样采用退出？](#detail-section-14)
  - [Q05 · 如何验证目录带来可靠筛选？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户需区分插件候选和有限环境验证。

只读作者README或链接表。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 目录发现 | 按分类和更新信号筛候选 | 同步范围及日期限定 |
| 固定版本验证 | 生成阶段状态与报告 | Linux及smoke模式限定 |
| 公开验证记录 | 呈现SHA和环境 | 不能代替真实任务验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| GitHub搜索与token、当前分类archive | 自建同步 | 双topic分片发现和可信分类 | incomplete报错，旧classifier时回旧目录 |
| Node、Trivy/OSV/Gitleaks与固定linux镜像 | 维护者验证 | 结构与安全检查及执行 | 扫描不可用inconclusive，secret隔离 |
| Docker linux/amd64、镜像网络与命名卷 | Linux验证 | 每阶段1CPU/1GiB、128PID | timeout基础设施未知，需核卷清理 |
| 完整报告和SHA/版本元数据 | 读者筛选 | 区分expired、recorded和verified | 不匹配就回原仓库隔离验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 发现 | 同步双topic搜索，核分片完整、ID去重和include分类 | 无当前archive不冒充新验证 |
| 检查 | 扫描secret/漏洞、核manifest与patch，按类型路由 | secret隔离、扫描不可用待复核、缺契约待验证器 |
| Linux验证 | 固定SHA运行安装、load、loader apply与postflight | 明确这是初始化而非业务工具验收 |
| 发布与退出 | 核SHA/push/rc.6/linux/validator版本并生成静态API | expired回源，另核命名卷清理；停站不卸第三方 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | GitHub请求、扫描库、linux镜像及Node依赖，账单未知 | 配token、archive和验证镜像，耗时未知 | 阅读目录可免自建 |
| 持续 | 每候选联网build/install/smoke；1CPU/1GiB容器与命名卷/工件，合计未知 | 维护分类规则、合约、expired重验和误报，耗时未知 | 单容器限额不是总成本 |
| 恢复 | timeout重试、残留Docker卷与报告留存，资源未知 | 查归因、cleanupFailures及人工删卷，耗时未知 | 清理失败不会自动撤销verified |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 验证绑定 | 记录SHA、DSH和平台 | 线上投影当前一致性未知 |
| 沙箱流程 | 按计划命令判阶段结果 | 用户业务效果未知 |
| 筛选价值 | 提供报告证据入口 | 误判与耗时改善未测 |

> **思考**：[Q03](#research-q03) 标签有版本与环境边界，loader只测apply初始化；[Q02](#research-q02) 清理失败不撤销verified。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把可定位验证记录加入发现流程。

顺序runner、阶段状态和公开投影可追。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 标签有版本与环境边界，loader只测apply初始化；[Q02](#research-q02) 清理失败不撤销verified。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先读固定记录，安装第三方仍隔离验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的市场根项目怎样把发现和固定SHA验证连成边界明确的目录。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、scripts/validation/promotion.ts、packages/dsh-plugins-store/src/index.js、src/lib/github-discovery.ts、scripts/sync-github.ts、src/lib/source-classification-archive.ts、src/lib/source-classification.ts、scripts/validation/structure-check.ts、validation/sandbox/host-tool-smoke.mjs、validation/sandbox/capability-stub.mjs、scripts/validation/linux-sandbox.ts、scripts/validation/sandbox-runner.ts、packages/dsh-plugins-store/src/installer.js、src/lib/validation.ts、src/pages/catalog.json.ts、.github/workflows/validate-plugins.yml、scripts/validation/validator-router.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的市场根项目怎样把发现和固定SHA验证连成边界明确的目录。未执行目标代码或实际宿主验证。
- 下一步：保存候选原SHA、报告与用户判定。

**分析版本**

- **仓库**：[ZASENJC/dsh-plugins-store](https://github.com/ZASENJC/dsh-plugins-store)
- **版本号**：0.1.4（[固定提交 8dbdf81](https://github.com/ZASENJC/dsh-plugins-store/tree/8dbdf819ae1b38eb67a925398776b293fb85583f)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 完整报告可能降低筛选误判，尚需对照。

保存候选原SHA、报告与用户判定。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 9 | 364 | 321 | 9 | — |
| .js | source | 15 | 3841 | 3453 | 6 | — |
| .md | source | 3 | 312 | — | — | 3687 |
| .jsx | source | 2 | 729 | 689 | 0 | — |
| .js | test | 11 | 2098 | 1887 | 33 | — |
| .ts | test | 55 | 8475 | 7686 | 81 | — |
| .ts | source | 48 | 9454 | 8714 | 80 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/ZASENJC/dsh-plugins-store/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：市场根项目怎样把发现和固定SHA验证连成边界明确的目录？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目和可装插件分别做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根仓库是目录站、API、同步与验证基础设施，另含可安装Web子包。用户可先浏览候选的来源与验证进度，子包再把安装操作接入宿主。相比普通链接表，本根项目增加固定SHA与环境绑定的验证记录，而不是证明每个条目安全。root应归infrastructure，不能把子包安装命令等同根包入口。 发现查询同时要求dsh-plugin与deepseek-harness topic并排除fork/archived；GitHub搜索超过1000条按创建日期再按star区间切分，incomplete_results最多整轮重试3次，最终按仓库数字ID去重。同步消费allRepositories再经源码分类archive决定可见性，不是把所有搜索结果直接发布；旧include分类可让新push暂留发现，但可信分类须pushed_at一致。无当前classifierVersion档案时保留旧目录而非声称已更新。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-40](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/README.md#L30-L40)

作者说明市场和配套子包

<details>
<summary>查看原文（11行）</summary>

```text
DSH 插件市场面向 DeepSeek Harness 生态，自动收录同时带有 [`dsh-plugin`](https://github.com/topics/dsh-plugin) 与 `deepseek-harness` Topic 的公开项目，提供目录检索、排行榜与 [公开 API](https://api.dshmk.com/)。配套的 [DSH Web 插件](packages/dsh-plugins-store/README.md)可独立安装并接入 `/store` 和 Agent 会话；验证结果来自固定源码 SHA 的结构检查与 Linux 隔离沙箱。

[访问 DSH 插件市场（DeepSeek Harness 插件目录）](https://dshmk.com/)

## 功能

- 自动收录同时带有 `dsh-plugin` 与 `deepseek-harness` Topic 的公开仓库，并排除归档仓库、Fork 和宿主应用
- 提供独立的 [目录](https://dshmk.com/)、[已验证](https://dshmk.com/verified)和 [排行榜](https://dshmk.com/ranking)页面，支持搜索、分类、筛选和排序
- 排行榜支持 24 小时 Star 增速、最多 Star、最新发布和最近更新；项目详情展示分类依据、同标签项目和验证进度
- 每 30 分钟自动同步 GitHub 仓库数据
- 配套 DSH Web 插件支持通过 `/store`、设置页和 Agent 会话浏览市场，并在用户明确请求和确认后安装、更新或移除 Web profile 插件
```

</details>

**依据 2 · 源码核查**：[scripts/validation/promotion.ts:157-174](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/validation/promotion.ts#L157-L174)

公开记录带SHA和环境

<details>
<summary>查看原文（18行）</summary>

```text
  return {
    repositoryId: report.repository.id,
    sourceSha: report.repository.sourceSha,
    sourcePushedAt: report.repository.sourcePushedAt,
    updatedAt: report.completedAt ?? report.startedAt,
    dshVersion: report.target.dshVersion,
    platform: report.target.platform,
    validatorVersion: report.target.validatorVersion,
    ...(report.sourceClassification ? { sourceClassification: report.sourceClassification } : {}),
    structure: structureFailed
      ? { status: structureStatus, ...(structureCheckedAt ? { checkedAt: structureCheckedAt } : {}), ...evidence }
      : { status: structureStatus, ...(structureCheckedAt ? { checkedAt: structureCheckedAt } : {}) },
    sandbox: structureFailed
      ? { status: 'skipped' }
      : report.currentStatus === 'verified'
        ? { status: 'passed', ...evidence }
        : report.currentStatus === 'inconclusive'
          ? { status: 'inconclusive', ...evidence }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugins-store/src/index.js:35-59](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/packages/dsh-plugins-store/src/index.js#L35-L59)

配套子包独立注册命令工具与路由

<details>
<summary>查看原文（25行）</summary>

```text
export function apply(ctx) {
  const storeSkill = loadBundledStoreSkill()

  ctx.commands.register({
    name: 'store',
    description: 'Browse the DSH plugin store',
    handler: ({ rawInput }) => rawInput.trim() === ''
      ? { kind: 'success' }
      : { kind: 'error', text: 'Usage: /store' },
  })

  const registeredTools = registerCompatibleStoreTools(ctx.tools, createStoreTools(storeToolOptions()))
  if (registeredTools.some(({ name }) => name === 'store_install' || name === 'store_remove')) {
    ctx.on('tools/pre-execute', createStoreApprovalGate())
  }
  ctx.skills.register(storeSkill)

  ctx.webServer.register({
    kind: 'exact',
    path: INSTALL_PATH,
    handler: createInstallHandler({
      install: (plan) => installPlan(plan, {
        ...runnerOptions(),
      }),
    }),
```

</details>

**依据 4 · 源码核查**：[src/lib/github-discovery.ts:166-275](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/src/lib/github-discovery.ts#L166-L275)

分片、完整性失败和ID去重

<details>
<summary>查看原文（110行）</summary>

```text
    throw new Error('GitHub Search 无法确定 star 分片边界')
  }
  return {
    start: fewest.items[0].stargazers_count,
    end: most.items[0].stargazers_count,
  }
}

async function collectPartition(
  fetcher: SearchPageFetcher,
  partition: SearchPartition,
  firstPage: SearchPage,
  firstRequest: SearchRequestOptions,
  maxResultsPerQuery: number,
  pageSize: number,
  initialDatePartitions: SearchPartition[],
): Promise<SearchRepository[]> {
  assertComplete(firstPage)
  if (firstPage.total_count > maxResultsPerQuery) {
    let children: SearchPartition[] | null = splitDatePartition(partition)
    if (children === null && !partition.createdStart && !partition.createdEnd) {
      children = initialDatePartitions.length === 1
        ? splitDatePartition(initialDatePartitions[0])
        : initialDatePartitions
    }
    if (children === null) children = splitStarsPartition(partition)
    if (children === null && partition.starsStart === undefined) {
      const bounds = await getStarsBounds(fetcher, partition)
      children = splitStarsPartition({
        ...partition,
        starsStart: bounds.start,
        starsEnd: bounds.end,
      })
    }
    if (children === null) {
      throw new Error(
        `GitHub Search 分片仍超过 ${maxResultsPerQuery} 条且无法继续拆分：${firstPage.total_count}`,
      )
    }

    const repositories: SearchRepository[] = []
    for (const child of children) {
      const childPage = await fetcher(1, child, { sort: 'stars', order: 'desc' })
      repositories.push(...await collectPartition(
        fetcher,
        child,
        childPage,
        { sort: 'stars', order: 'desc' },
        maxResultsPerQuery,
        pageSize,
        initialDatePartitions,
      ))
    }
    return repositories
  }

  const repositories = [...firstPage.items]
  const pageCount = Math.ceil(firstPage.total_count / pageSize)
  for (let page = 2; page <= pageCount; page += 1) {
    const response = await fetcher(page, partition, firstRequest)
    assertComplete(response)
    repositories.push(...response.items)
  }
  return repositories
}

export async function fetchAllSearchRepositories(
  fetcher: SearchPageFetcher,
  options: FetchAllSearchOptions = {},
): Promise<FetchAllSearchResult> {
  const maxResultsPerQuery = options.maxResultsPerQuery ?? MAX_RESULTS_PER_QUERY
  const pageSize = options.pageSize ?? SEARCH_PAGE_SIZE
  const maxAttempts = options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS
  const initialDatePartitions = options.initialDateStart && options.initialDateEnd
    ? [{ createdStart: options.initialDateStart, createdEnd: options.initialDateEnd }]
    : buildHistoricalDatePartitions()
  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const rootPartition: SearchPartition = {}
      const rootPage = await fetcher(1, rootPartition, { sort: 'stars', order: 'desc' })
      const reportedByGitHub = rootPage.total_count
      const repositories = await collectPartition(
        fetcher,
        rootPartition,
        rootPage,
        { sort: 'stars', order: 'desc' },
        maxResultsPerQuery,
        pageSize,
        initialDatePartitions,
      )
      const uniqueRepositories = new Map<number, SearchRepository>()
      for (const repository of repositories) uniqueRepositories.set(repository.id, repository)
      const allRepositories = [...uniqueRepositories.values()].filter((repository) => (
        !repository.archived && !repository.fork
      ))
      return {
        repositories: filterEligibleRepositories(allRepositories),
        allRepositories,
        reportedByGitHub,
      }
    } catch (error) {
      lastError = error
      if (!(error instanceof Error) || !error.message.includes('incomplete_results')) throw error
    }
  }

  throw new Error(`GitHub Search 连续 ${maxAttempts} 轮仍不完整：${String(lastError)}`)
}
```

</details>

**依据 5 · 源码核查**：[scripts/sync-github.ts:284-314](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/sync-github.ts#L284-L314)

分类档案和旧目录回退

<details>
<summary>查看原文（31行）</summary>

```text
async function sync() {
  const previousCatalog = await readPreviousCatalog()
  const { repositories, allRepositories, reportedByGitHub } = await fetchRepositories()
  const classificationArchive = await readClassificationArchive()
  const currentClassificationArchive = isCurrentSourceClassificationArchive(classificationArchive)
    ? classificationArchive
    : null
  const validationRecords = validationRecordsFromArchive(currentClassificationArchive)
  const verifiedRepositoryNames = await readHistoricalVerifiedRepositoryNames()
  const catalogRepositories = filterCatalogRepositoriesByArchive(allRepositories, currentClassificationArchive)
  const installReferences = currentClassificationArchive === null
    ? new Map<number, InstallReference>()
    : await fetchInstallReferences(catalogRepositories, currentClassificationArchive)
  const generatedAt = new Date().toISOString()
  const refreshedCatalog = buildCatalog(
    catalogRepositories,
    generatedAt,
    reportedByGitHub,
    verifiedRepositoryNames,
    validationRecords,
    installReferences,
    currentClassificationArchive,
    previousCatalog,
  )
  const catalog = limitPublishedCatalog(
    currentClassificationArchive === null && previousCatalog !== null
      ? previousCatalog
      : refreshedCatalog,
  )
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8')
```

</details>

**依据 6 · 源码核查**：[src/lib/source-classification-archive.ts:543-587](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/src/lib/source-classification-archive.ts#L543-L587)

可见性与当前可信分类分开

<details>
<summary>查看原文（45行）</summary>

```text
}

export function filterCatalogRepositoriesByArchive<T extends { id: number, full_name: string }>(
  repositories: readonly T[],
  archive: SourceClassificationArchive | null,
): T[] {
  if (archive === null) return []
  return repositories.filter((repository) => isCatalogVisibleByArchive({
    repositoryId: repository.id,
    fullName: repository.full_name,
  }, archive))
}

// Catalog visibility is intentionally less strict than source-derived trust.
// A previously recognized repository may remain discoverable while a new push
// waits for classification, but every trust-bearing consumer below still
// requires the existing exact pushed_at binding.
export function isCatalogVisibleByArchive(
  repository: Pick<SourceDiscoveryRepository, 'repositoryId' | 'fullName'>,
  archive: SourceClassificationArchive | null,
): boolean {
  if (!isCurrentSourceClassificationArchive(archive)) return false
  const record = archive.records.find(({ repositoryId }) => repositoryId === repository.repositoryId)
  return record?.fullName.toLowerCase() === repository.fullName.toLowerCase()
    && record.disposition === 'include'
    && record.classification?.dshRelevance === 'recognized'
}

export function currentSourceClassification(
  repository: Pick<SourceDiscoveryRepository, 'repositoryId' | 'pushedAt'>,
  archive: SourceClassificationArchive | null,
): SourceClassification | undefined {
  const record = currentRecord(repository, archive)
  return record?.disposition === 'include' && record.classification?.dshRelevance === 'recognized'
    ? record.classification
    : undefined
}

export function isIncludedByCurrentArchive(
  repository: Pick<SourceDiscoveryRepository, 'repositoryId' | 'pushedAt'>,
  archive: SourceClassificationArchive | null,
): boolean {
  const record = currentRecord(repository, archive)
  return record?.disposition === 'include'
    && record.classification?.dshRelevance === 'recognized'
```

</details>

#### 缺口

- 站点当前公开数据是否与固定输入一致未网络核对。
  **影响**：用户可能把旧验证标签误认目标版本状态。
  **进一步探讨**：按一个候选核对SHA、环境和原报告。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 验证状态怎样得到？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

源码分类先核SHA、manifest、路径与DSH契约信号，再将workspace/patch/Skill/应用/基础设施信号分类，置信度是规则结果并非人工确认。结构检查核固定ID/SHA、公开活跃、manifest入口和bundle patch；有build的缺入口、缺patch/lock/license等多为warning而非硬失败。Trivy/Gitleaks潜在secret进入quarantined，扫描器不可用为inconclusive，已知漏洞保留warning可继续；外部registry凭据让sandbox不排队，native/skill/non-plugin不进入此Linux流程。沙箱绑定ID、SHA、DSH/platform/validator后顺序执行。当前host-tool smokeMode仅loader：核DSH profile dependency/bundle已激活、安装包名与真实路径不越界、动态import并找apply，配置用Config({})，checkOnStart布尔会强制false，以任意链可调用的Proxy stub执行apply且限30秒；不会调用已注册工具业务，不等于真实宿主能力兼容。timeout与create-volume/copy-source失败判inconclusive；依赖/build/install失败判install_failed、load失败runtime_failed、postflight失败是policy smoke_failed，其他smoke失败归plugin；首失败停止后标failed。finally执行cleanup，remove-volume非零仅加入cleanupFailures，不改已形成verified状态，remove-container非零没有记录该数组。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/source-classification.ts:213-267](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/src/lib/source-classification.ts#L213-L267)

实际源码分类信号

<details>
<summary>查看原文（55行）</summary>

```text
export function classifySource({ sourceSha, repositoryFullName, files }: SourceClassificationInput): SourceClassification {
  if (!/^[a-f0-9]{40}$/i.test(sourceSha)) throw new Error('Source classification SHA is invalid')

  const paths = Object.keys(files).sort()
  const packagePaths = paths.filter((path) => /(^|\/)package\.json$/i.test(path))
  const manifests = packagePaths.map((path) => parseJson(files[path])).filter((manifest): manifest is Record<string, unknown> => manifest !== null)
  const rootManifest = parseJson(files['package.json'])
  const topicSignals = new Set<string>()
  const contractRelevance = recognizeDshContract(files)
  const relevanceSignals = [
    ...contractRelevance.relevanceSignals,
    ...recognizeDshRepositoryName(repositoryFullName),
  ]
  const relevance = {
    dshRelevance: relevanceSignals.length > 0 ? 'recognized' as const : 'unrecognized' as const,
    relevanceSignals,
  }
  const matchedSignals: string[] = [...relevance.relevanceSignals]

  for (const path of paths) {
    words(path).forEach((token) => topicSignals.add(token))
  }
  manifests.forEach((manifest) => addManifestSignals(topicSignals, manifest))
  for (const [path, content] of Object.entries(files)) {
    if (typeof content !== 'string') continue
    if (/(^|\/)(?:package\.json|SKILL\.md|cordis\.patch\.ya?ml|dsh\.bundle\.ya?ml)$/i.test(path)) {
      words(content.slice(0, 200_000)).forEach((token) => topicSignals.add(token))
    }
  }
  for (const path of paths.filter((candidate) => /(?:cordis\.patch\.ya?ml|dsh\.bundle\.ya?ml)$/i.test(candidate))) {
    if (parseYamlDocument(files[path]) !== null) matchedSignals.push(`${path}:parsed`)
  }

  const project = classifyProjectType({
    paths,
    manifests,
    rootManifest,
    topics: topicSignals,
    signals: matchedSignals,
    dshRelevance: relevance.dshRelevance,
  })
  const categoryResult = classifyRepository({
    fullName: 'source/audit',
    name: 'source-audit',
    description: '',
    topics: [...topicSignals],
  })
  const categorySignals = categoryResult.categories.filter((category) => category !== 'other')
  const categoryConfidence: Confidence = categoryResult.category === 'other'
    ? 'low'
    : categoryResult.confidence

  return {
    sourceSha: sourceSha.toLowerCase(),
    classifierVersion: SOURCE_CLASSIFIER_VERSION,
```

</details>

**依据 2 · 源码核查**：[scripts/validation/structure-check.ts:354-457](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/validation/structure-check.ts#L354-L457)

manifest、入口、patch与凭据检查

<details>
<summary>查看原文（104行）</summary>

```text
    files: snapshot.files,
  })
  const dshContractRecognized = sourceClassification.dshRelevance === 'recognized'
  check(
    checks,
    'DSH_CONTRACT_RECOGNIZED',
    dshContractRecognized ? 'passed' : 'not-run',
    'required',
    dshContractRecognized
      ? 'A valid DSH source contract or dsh-prefixed repository name was recognized.'
      : 'No valid DSH source contract or dsh-prefixed repository name was recognized.',
  )
  if (!dshContractRecognized) {
    return {
      decision: 'inconclusive',
      queueSandbox: false,
      publicReason: '未识别到有效 DSH 插件合约',
      report: createUnrecognizedReport(snapshot, target, checks, sourceClassification),
    }
  }

  const sourceProjectType = sourceClassification.projectType !== 'unknown' && sourceClassification.typeConfidence !== 'low'
    ? sourceClassification.projectType
    : snapshot.projectType
  const classifiedSnapshot = sourceProjectType === snapshot.projectType
    ? snapshot
    : { ...snapshot, projectType: sourceProjectType }

  if (classifiedSnapshot.projectType === 'unknown') {
    check(checks, 'EXECUTION_TYPE_UNRECOGNIZED', 'not-run', 'required', 'Execution type could not be recognized.')
    return {
      decision: 'inconclusive',
      queueSandbox: false,
      publicReason: '待识别执行类型',
      report: createUnrecognizedReport(classifiedSnapshot, target, checks, sourceClassification),
    }
  }

  const manifest = getManifest(classifiedSnapshot.files) ?? {}
  const executionType = inferExecutionType({
    projectType: classifiedSnapshot.projectType,
    manifest,
    topics: classifiedSnapshot.topics,
  })

  if (executionType === 'non-plugin') {
    check(checks, 'PLUGIN_VALIDATION_NOT_APPLICABLE', 'not-run', 'required', 'Project uses a non-plugin validation channel.')
    return {
      decision: 'not-applicable',
      queueSandbox: false,
      publicReason: '非 DSH 插件验证范围',
      report: createReport({ snapshot: classifiedSnapshot, target, executionType, sourceClassification, checks, failure: null }),
    }
  }

  if (executionType === 'skill') {
    const skillFiles = Object.keys(classifiedSnapshot.files).filter((path) => /(^|\/)SKILL\.md$/i.test(path))
    check(
      checks,
      'SKILL_DOCUMENT_PRESENT',
      skillFiles.length > 0 ? 'passed' : 'warning',
      'advisory',
      skillFiles.length > 0 ? 'Skill document is present.' : 'No SKILL.md was found.',
      skillFiles[0],
    )
  } else if (executionType === 'collection') {
    const manifests = Object.keys(classifiedSnapshot.files).filter((path) => /(^|\/)package\.json$/.test(path))
    check(
      checks,
      'COLLECTION_MEMBERS_PRESENT',
      manifests.length > 1 ? 'passed' : 'warning',
      'advisory',
      manifests.length > 1 ? 'Collection contains member package manifests.' : 'Collection has no discoverable member package.',
    )
  } else {
    const packagePresent = Object.keys(manifest).length > 0
    check(
      checks,
      'PACKAGE_MANIFEST_VALID',
      packagePresent ? 'passed' : 'warning',
      packagePresent ? 'required' : 'advisory',
      packagePresent ? 'package.json is valid JSON.' : 'package.json is missing or invalid.',
      'package.json',
    )

    const scripts = asRecord(manifest.scripts) ?? {}
    const hasBuild = typeof scripts.build === 'string' || typeof scripts.prepare === 'string' || typeof scripts.prepack === 'string'
    const entrypoints = new Set<string>()
    collectEntrypoints(manifest.main, entrypoints, true)
    collectEntrypoints(manifest.exports, entrypoints)
    collectEntrypoints(manifest.bin, entrypoints, true)
    const relevantEntrypoints = [...entrypoints].filter((path) => !/(?:package\.json|cordis\.patch\.yml)$/.test(path))
    const missingEntrypoints = relevantEntrypoints.filter((path) => !hasOwnPath(snapshot.files, path))
    if (relevantEntrypoints.length === 0) {
      check(checks, 'PACKAGE_ENTRYPOINT_MISSING', 'warning', 'advisory', 'No executable package entrypoint is declared.', 'package.json')
    } else if (missingEntrypoints.length > 0 && hasBuild) {
      check(checks, 'BUILD_ARTIFACT_REQUIRES_BUILD', 'warning', 'advisory', 'Declared entrypoints require the sandbox build stage.', missingEntrypoints[0])
    } else if (missingEntrypoints.length > 0) {
      check(checks, 'PACKAGE_ENTRYPOINT_MISSING', 'warning', 'advisory', 'A declared package entrypoint is missing and no build step is declared.', missingEntrypoints[0])
    } else {
      check(checks, 'PACKAGE_ENTRYPOINTS_VALID', 'passed', 'required', 'Declared package entrypoints exist.')
    }

    if (typeof scripts.prepare === 'string') {
```

</details>

**依据 3 · 源码核查**：[scripts/validation/structure-check.ts:568-608](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/validation/structure-check.ts#L568-L608)

隔离、基础设施未知与排队判据

<details>
<summary>查看原文（41行）</summary>

```text
    check(checks, 'GITLEAKS_SCAN_QUARANTINE', 'quarantined', 'security', 'Potential secret material requires private human review.', undefined, 'gitleaks')
  } else if (snapshot.scans.gitleaks) {
    check(
      checks,
      ignoredGitleaksSecrets.length > 0 ? 'GITLEAKS_LOW_CONFIDENCE_IGNORED' : 'GITLEAKS_SCAN_CLEAN',
      ignoredGitleaksSecrets.length > 0 ? 'warning' : 'passed',
      'security',
      ignoredGitleaksSecrets.length > 0
        ? 'Low-confidence non-runtime or public-client signals were retained as warnings and did not enter security review.'
        : 'Gitleaks scan produced no secret findings.',
      undefined,
      'gitleaks',
    )
  }

  const requiredFailure = checks.find(({ status, severity }) => status === 'failed' && severity === 'required')
  let decision: StructureCheckResult['decision'] = 'passed'
  let failure: Parameters<typeof createReport>[0]['failure'] = null
  let publicReason: string | null = null
  if (secretFindings > 0) {
    decision = 'quarantined'
    publicReason = '需要人工安全复核'
    failure = { attribution: 'policy', code: 'SECURITY_REVIEW_REQUIRED', reason: publicReason }
  } else if (scannerUnavailable) {
    decision = 'inconclusive'
    publicReason = '验证基础设施暂不可用'
    failure = { attribution: 'infrastructure', code: 'SCANNER_UNAVAILABLE', reason: publicReason }
  } else if (requiredFailure) {
    decision = 'failed'
    publicReason = requiredFailure.message
    failure = { attribution: 'plugin', code: requiredFailure.code, reason: requiredFailure.message }
  }

  return {
    decision,
    queueSandbox: decision === 'passed'
      && credentialPath === undefined
      && !['native', 'skill', 'non-plugin'].includes(executionType),
    publicReason,
    report: createReport({ snapshot: classifiedSnapshot, target, executionType, sourceClassification, checks, failure }),
  }
```

</details>

**依据 4 · 源码核查**：[validation/sandbox/host-tool-smoke.mjs:1-72](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/validation/sandbox/host-tool-smoke.mjs#L1-L72)

loader真实断言

<details>
<summary>查看原文（72行）</summary>

```text
import { readFile, realpath } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

import { awaitWithTimeout, createCapabilityStub, resolvePluginConfig } from './capability-stub.mjs'

const pluginRoot = resolve(process.argv[2] ?? '')
const smokeMode = process.argv[3] ?? 'loader'
if (!pluginRoot.startsWith('/validation/workspace/')
  || smokeMode !== 'loader') throw new Error('Invalid smoke boundary')

const sourceManifest = JSON.parse(await readFile(resolve(pluginRoot, 'package.json'), 'utf8'))
const packageName = sourceManifest.name
if (typeof packageName !== 'string' || packageName.length === 0) {
  throw new Error('Plugin has no package name')
}

const dshHome = resolve(process.env.DSH_HOME ?? '')
const profileRoot = resolve(dshHome, 'profiles', 'validation')
if (!dshHome.startsWith('/validation/') || !profileRoot.startsWith(`${dshHome}${sep}`)) {
  throw new Error('Invalid DSH profile boundary')
}
const profileManifest = JSON.parse(await readFile(resolve(profileRoot, 'package.json'), 'utf8'))
if (!profileManifest.dependencies
  || !Object.hasOwn(profileManifest.dependencies, packageName)
  || !profileManifest.dsh?.profile?.bundles?.includes(packageName)) {
  throw new Error('Plugin is not activated in the DSH profile')
}

const nodeModulesRoot = resolve(profileRoot, 'node_modules')
const installedRoot = resolve(nodeModulesRoot, packageName)
if (!installedRoot.startsWith(`${nodeModulesRoot}${sep}`)) throw new Error('Invalid installed plugin boundary')
const manifest = JSON.parse(await readFile(resolve(installedRoot, 'package.json'), 'utf8'))
if (manifest.name !== packageName) throw new Error('Installed plugin identity mismatch')
const exported = manifest.exports?.['.']
const entrypoint = typeof manifest.main === 'string'
  ? manifest.main
  : typeof exported === 'string'
    ? exported
    : exported?.default
if (typeof entrypoint !== 'string') throw new Error('Plugin has no importable entrypoint')

const nodeModulesRootReal = await realpath(nodeModulesRoot)
const installedRootReal = await realpath(installedRoot)
if (!installedRootReal.startsWith(`${nodeModulesRootReal}${sep}`)) {
  throw new Error('Installed plugin escapes node_modules boundary')
}
const entrypointPath = resolve(installedRootReal, entrypoint)
const entrypointReal = await realpath(entrypointPath)
if (!entrypointReal.startsWith(`${installedRootReal}${sep}`)) {
  throw new Error('Plugin entrypoint escapes installed plugin boundary')
}

const module = await import(pathToFileURL(entrypointReal).href)
const apply = typeof module.apply === 'function'
  ? module.apply
  : typeof module.default?.apply === 'function'
    ? module.default.apply
    : typeof module.default === 'function'
      ? module.default
      : null
if (!apply) throw new Error('Plugin does not export an apply function')

// Execute the installed entrypoint with a side-effect-free capability stub. The
// real DSH profile has already proved installation and activation above; this
// call catches plugins that cannot initialize against the host plugin contract
// without exposing host files, credentials, or a Docker socket.
const context = createCapabilityStub()
const config = resolvePluginConfig(module)
await awaitWithTimeout(apply(context, config), 30_000)

process.stdout.write(`${JSON.stringify({ smokeMode, packageName, entrypoint, apply: true, invoked: true })}\n`)
```

</details>

**依据 5 · 源码核查**：[validation/sandbox/capability-stub.mjs:1-37](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/validation/sandbox/capability-stub.mjs#L1-L37)

Proxy stub、配置降级与超时

<details>
<summary>查看原文（37行）</summary>

```text
export function createCapabilityStub() {
  let capability
  const target = () => capability
  capability = new Proxy(target, {
    // Keep arbitrary capability chains callable without turning the stub into a thenable.
    get: (_target, property) => property === 'then' ? undefined : capability,
    apply: () => capability,
  })
  return capability
}

export function resolvePluginConfig(pluginModule) {
  const config = typeof pluginModule.Config === 'function' ? pluginModule.Config({}) : {}
  if (config !== null
    && typeof config === 'object'
    && !Array.isArray(config)
    && Object.hasOwn(config, 'checkOnStart')
    && typeof config.checkOnStart === 'boolean') {
    // Registration smoke must not require an external companion binary in the sandbox.
    return { ...config, checkOnStart: false }
  }
  return config
}

export async function awaitWithTimeout(value, timeoutMs) {
  let timeout
  try {
    return await Promise.race([
      Promise.resolve(value),
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Plugin apply timed out')), timeoutMs)
      }),
    ])
  } finally {
    clearTimeout(timeout)
  }
}
```

</details>

**依据 6 · 源码核查**：[scripts/validation/linux-sandbox.ts:174-198](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/validation/linux-sandbox.ts#L174-L198)

failed与inconclusive判据

<details>
<summary>查看原文（25行）</summary>

```text
export function summarizeSandboxExecution(results: SandboxStepResult[]): SandboxExecutionSummary {
  const failed = results.find((result) => result.timedOut || result.exitCode !== 0)
  if (!failed) return { finalStatus: 'verified', attribution: 'plugin', code: 'SANDBOX_PASSED' }
  if (failed.timedOut) {
    return { finalStatus: 'inconclusive', attribution: 'infrastructure', code: 'SANDBOX_TIMEOUT' }
  }
  if (failed.stepId === 'create-volume' || failed.stepId === 'copy-source') {
    return { finalStatus: 'inconclusive', attribution: 'infrastructure', code: 'SANDBOX_INFRASTRUCTURE_FAILED' }
  }
  if (failed.stepId === 'install-dependencies') {
    return { finalStatus: 'failed', failedStatus: 'install_failed', attribution: 'plugin', code: 'DEPENDENCY_INSTALL_FAILED' }
  }
  if (failed.stepId === 'build') {
    return { finalStatus: 'failed', failedStatus: 'install_failed', attribution: 'plugin', code: 'PLUGIN_BUILD_FAILED' }
  }
  if (failed.stepId === 'install-plugin') {
    return { finalStatus: 'failed', failedStatus: 'install_failed', attribution: 'plugin', code: 'PLUGIN_INSTALL_FAILED' }
  }
  if (failed.stepId === 'load') {
    return { finalStatus: 'failed', failedStatus: 'runtime_failed', attribution: 'plugin', code: 'PLUGIN_LOAD_FAILED' }
  }
  if (failed.stepId === 'postflight') {
    return { finalStatus: 'failed', failedStatus: 'smoke_failed', attribution: 'policy', code: 'SANDBOX_POSTFLIGHT_FAILED' }
  }
  return { finalStatus: 'failed', failedStatus: 'smoke_failed', attribution: 'plugin', code: 'PLUGIN_SMOKE_FAILED' }
```

</details>

**依据 7 · 源码核查**：[scripts/validation/sandbox-runner.ts:120-171](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/validation/sandbox-runner.ts#L120-L171)

首失败及cleanup失败未降状态

<details>
<summary>查看原文（52行）</summary>

```text
  const results: SandboxStepResult[] = []
  const cleanupFailures: SandboxRunResult['cleanupFailures'] = []
  try {
    for (const step of plan.steps) {
      const execution = await executor(step.command, step.id, step.timeoutMs)
      results.push({
        stepId: step.id,
        exitCode: execution.exitCode,
        timedOut: execution.timedOut,
      })
      if (execution.timedOut || execution.exitCode !== 0) break

      if (step.id === 'install-plugin') {
        report = appendValidationEvent(report, { stage: 'installation', status: 'install_passed', at: now() })
      } else if (step.id === 'load') {
        report = appendValidationEvent(report, { stage: 'runtime', status: 'runtime_passed', at: now() })
      } else if (step.id === 'postflight') {
        report = appendValidationEvent(report, { stage: 'smoke', status: 'smoke_passed', at: now() })
      }
    }

    const summary = summarizeSandboxExecution(results)
    if (summary.finalStatus === 'verified') {
      report = appendValidationEvent(report, { stage: 'final', status: 'verified', at: now() })
    } else if (summary.finalStatus === 'inconclusive') {
      report = appendValidationEvent(report, {
        stage: 'sandbox',
        status: 'inconclusive',
        at: now(),
        code: summary.code,
        reason: summary.code,
        attribution: summary.attribution,
      })
    } else {
      report = appendFailure(report, summary.failedStatus!, summary, now())
      report = appendValidationEvent(report, {
        stage: 'final',
        status: 'failed',
        at: now(),
        code: summary.code,
        reason: summary.code,
        attribution: summary.attribution,
        fingerprint: fingerprint(report, summary.code),
      })
    }
    return { report: parseValidationReport(report), summary, results, cleanupFailures }
  } finally {
    for (const cleanup of plan.cleanup) {
      const execution = await executor(cleanup.command, cleanup.id, 30_000)
      if (execution.exitCode !== 0 && cleanup.id === 'remove-volume') cleanupFailures.push(cleanup.id)
    }
  }
```

</details>

#### 缺口

- 本轮未执行验证器、受控失败插件或真实工具业务调用。
  **影响**：可确认loader断言很窄，但不能证明动态业务或清理实际成功；verified仍可能伴资源残留。
  **进一步探讨**：用激活失败、apply失败、业务工具失败和卷删除失败四类受控样例，分别核报告与清理记录。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 沙箱和标签能证明什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

Docker使用非root、只读根、cap-drop和资源限额，但build、安装及smoke网络为bridge，不能声称验证全程离线。通过只说明所计划命令无非零退出，不等于模型效果、GUI或多OS合格。配套installer限制web profile和参数形状，HTTP又有loopback和Origin门禁；这与第三方插件授权风险分开。 公开状态并非仅旧Verified名单：archive解析要求validation SHA与分类SHA一致，历史合并只复用相同SHA及pushed_at。buildValidationStatus按pushed_at变化或DSH rc.6/linux-x64/validator0.1.2目标变化将verified置expired；旧验证URL仅recorded，skipped沙箱为pending而非通过。目录API是prerender静态catalogData，Cache-Control max-age300并stale-while-revalidate3600，因此非实时重验端点。源码卡片blob补取失败，不能把UI实际渲染当已核验；仅状态投影与API正文路径已核。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/validation/linux-sandbox.ts:84-95](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/validation/linux-sandbox.ts#L84-L95)

容器限制

<details>
<summary>查看原文（12行）</summary>

```text
  return [
    'run', '--rm', '--name', containerName, '--platform=linux/amd64',
    `--network=${network}`,
    '--read-only', '--cap-drop=ALL', '--security-opt=no-new-privileges',
    '--pids-limit=128', '--memory=1g', '--cpus=1', '--user=1000:1000',
    '--tmpfs=/tmp:rw,noexec,nosuid,size=128m',
    '--mount', `type=volume,src=${volumeName},dst=/validation`,
    ...(sourceDirectory ? ['--mount', `type=bind,src=${sourceDirectory},dst=/source,readonly`] : []),
    '--env=HOME=/validation/home', '--env=DSH_HOME=/validation/dsh-home', '--env=CI=1',
    '--workdir=/validation/workspace/plugin',
    image,
    ...command,
```

</details>

**依据 2 · 源码核查**：[scripts/validation/linux-sandbox.ts:159-176](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/validation/linux-sandbox.ts#L159-L176)

联网阶段及passed判断

<details>
<summary>查看原文（18行）</summary>

```text
      makeStep('copy-source', 'acquisition', 'none', ['node', '/validator/copy-source.mjs', '/source', '/validation/workspace/plugin'], sourceDirectory),
      makeStep('install-dependencies', 'acquisition', 'bridge', dependencyInstallCommand(sourceDirectory)),
      makeStep('build', 'execution', 'bridge', ['npm', 'run', 'build', '--if-present']),
      makeStep('install-plugin', 'execution', 'bridge', ['dsh', 'plugin', '--profile', 'validation', 'add', '--ignore-scripts', 'file:/validation/workspace/plugin']),
      makeStep('load', 'execution', 'bridge', ['dsh', '--profile', 'validation', '--dump-config']),
      makeStep('smoke', 'execution', 'bridge', ['node', '/validator/host-tool-smoke.mjs', '/validation/workspace/plugin', target.smokeMode]),
      makeStep('postflight', 'execution', 'bridge', ['node', '/validator/postflight.mjs', '/validation']),
    ],
    cleanup: [
      { id: 'remove-container', command: { file: 'docker', args: ['rm', '--force', resourceName] } },
      { id: 'remove-volume', command: { file: 'docker', args: ['volume', 'rm', '--force', resourceName] } },
    ],
  }
}

export function summarizeSandboxExecution(results: SandboxStepResult[]): SandboxExecutionSummary {
  const failed = results.find((result) => result.timedOut || result.exitCode !== 0)
  if (!failed) return { finalStatus: 'verified', attribution: 'plugin', code: 'SANDBOX_PASSED' }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugins-store/src/installer.js:6-35](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/packages/dsh-plugins-store/src/installer.js#L6-L35)

安装参数范围

<details>
<summary>查看原文（30行）</summary>

```text
function assertInstallPlan(plan) {
  if (plan === null || typeof plan !== 'object' || plan.executable !== true) {
    throw new Error('安装计划不可执行')
  }
  if (plan.source !== 'github' && plan.source !== 'npm') {
    throw new Error('安装来源无效')
  }
  if (typeof plan.target !== 'string') throw new Error('安装目标无效')
  if (!Array.isArray(plan.args)
    || plan.args.length !== 5
    || plan.args[0] !== 'plugin'
    || plan.args[1] !== '--profile'
    || plan.args[2] !== 'web'
    || plan.args[3] !== 'add'
    || typeof plan.args[4] !== 'string') {
    throw new Error('安装参数无效')
  }

  const specifier = plan.args[4]
  if (plan.source === 'github') {
    const reference = /^github:([^#]+)(?:#([A-Za-z0-9][A-Za-z0-9_.:-]{0,127}))?$/i.exec(specifier)
    if (!reference || !REPOSITORY_FULL_NAME.test(reference[1])
      || reference[1].toLowerCase() !== plan.target.toLowerCase()) {
      throw new Error('GitHub 安装目标无效')
    }
  } else {
    const packageName = specifier.startsWith('npm:') ? specifier.slice(4) : specifier
    if (!NPM_PACKAGE.test(packageName) || packageName !== plan.target) {
      throw new Error('npm 安装目标无效')
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugins-store/src/installer.js:98-115](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/packages/dsh-plugins-store/src/installer.js#L98-L115)

请求来源门禁

<details>
<summary>查看原文（18行）</summary>

```text
function isLocalRequest(request) {
  return isLoopbackAddress(request.socket?.remoteAddress)
    && isLocalHost(request.headers.host)
}

export function isAuthorizedLocalRequest(request) {
  return isLocalRequest(request)
}

export function isAuthorizedRequest(request) {
  if (!isLocalRequest(request)) return false

  const origin = request.headers.origin
  if (typeof origin !== 'string' || origin.length === 0) return false
  try {
    return new URL(origin).host === request.headers.host
  } catch {
    return false
```

</details>

**依据 5 · 源码核查**：[src/lib/source-classification-archive.ts:365-391](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/src/lib/source-classification-archive.ts#L365-L391)

历史仅同SHA和push时间复用

<details>
<summary>查看原文（27行）</summary>

```text
): SourceClassificationArchive {
  const current = parseSourceClassificationArchive(currentValue)
  const currentById = new Map(current.records.map((record) => [record.repositoryId, record]))
  const latestById = new Map<number, SourceValidationResult>()

  for (const archive of [...historyValues.map(parseSourceClassificationArchive), current]) {
    for (const record of archive.records) {
      const target = currentById.get(record.repositoryId)
      const validation = record.validation
      if (!target || !validation || target.sourceSha === null
        || record.sourcePushedAt !== target.sourcePushedAt
        || record.sourceSha !== target.sourceSha
        || validation.sourceSha !== target.sourceSha) continue
      const latest = latestById.get(record.repositoryId)
      if (!latest || Date.parse(validation.checkedAt) >= Date.parse(latest.checkedAt)) {
        latestById.set(record.repositoryId, validation)
      }
    }
  }

  return parseSourceClassificationArchive({
    ...current,
    records: current.records.map((record) => {
      const validation = latestById.get(record.repositoryId)
      return validation ? { ...record, validation } : record
    }),
  })
```

</details>

**依据 6 · 源码核查**：[src/lib/validation.ts:254-322](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/src/lib/validation.ts#L254-L322)

过期、skipped和旧记录投影

<details>
<summary>查看原文（69行）</summary>

```text
  record?: ValidationRecord
  legacyVerificationUrl?: string | null
}): ValidationStatus {
  const identified = projectType !== 'unknown'
  const eligible = ELIGIBLE_PROJECT_TYPES.has(projectType)
  const defaultStages: ValidationStatus['stages'] = {
    discovery: { status: 'passed' },
    identification: { status: identified ? 'passed' : 'pending' },
    structure: { status: eligible ? 'pending' : 'skipped' },
    sandbox: { status: eligible ? 'pending' : 'skipped' },
  }

  let overall: ValidationOverall
  let level: ValidationStatus['level'] = 1
  let stages = defaultStages
  let reason: string | null = null
  if (record && record.sourcePushedAt !== repositoryPushedAt) {
    stages = { ...defaultStages, structure: record.structure, sandbox: record.sandbox }
    overall = 'expired'
    reason = buildExpiryReason(record, repositoryPushedAt)
    level = record.sandbox.status === 'passed' ? 4 : record.structure.status === 'passed' ? 3 : 2
  } else if (!identified) {
    overall = 'unrecognized'
  } else if (!eligible) {
    overall = 'not-applicable'
    level = 2
  } else if (record) {
    stages = { ...defaultStages, structure: record.structure, sandbox: record.sandbox }
    overall = resolveOverall(record)
    reason = getEvidence(record, 'reason')
    level = record.structure.status === 'passed' ? 3 : 2
    if (record.sandbox.status === 'passed') level = 4
    if (overall === 'verified' && (
      record.dshVersion !== CURRENT_VALIDATION_TARGET.dshVersion
      || record.platform !== CURRENT_VALIDATION_TARGET.platform
      || record.validatorVersion !== CURRENT_VALIDATION_TARGET.validatorVersion
    )) overall = 'expired'
    if (overall === 'expired') reason = buildExpiryReason(record, repositoryPushedAt)
  } else if (legacyVerificationUrl) {
    overall = 'recorded'
    level = 4
    stages = {
      ...defaultStages,
      structure: { status: 'passed', reportUrl: legacyVerificationUrl },
      sandbox: { status: 'passed', reportUrl: legacyVerificationUrl },
    }
  } else {
    overall = 'check-pending'
    level = 2
  }

  return {
    overall,
    label: STATUS_DEFINITION_BY_ID.get(overall)?.label ?? overall,
    tone: STATUS_TONES[overall],
    level,
    eligible,
    verified: overall === 'verified',
    updatedAt: record?.updatedAt ?? null,
    sourceSha: record?.sourceSha ?? null,
    dshVersion: record?.dshVersion ?? null,
    platform: record?.platform ?? null,
    validatorVersion: record?.validatorVersion ?? null,
    reportUrl: getEvidence(record, 'reportUrl') ?? legacyVerificationUrl,
    issueUrl: getEvidence(record, 'issueUrl'),
    reason,
    stages,
  }
}
```

</details>

**依据 7 · 源码核查**：[src/pages/catalog.json.ts:1-13](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/src/pages/catalog.json.ts#L1-L13)

API静态数据与缓存策略

<details>
<summary>查看原文（13行）</summary>

```text
import { catalogData } from '../lib/catalog-data'

export const prerender = true

export function GET(): Response {
  return new Response(JSON.stringify(catalogData), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}
```

</details>

#### 缺口

- 容器逃逸、供应链与实际运行覆盖未做安全审计。 卡片原始blob因promisor fetch SSL失败未读取。
  **影响**：不能把验证标签升级为安全认证或用户任务收益。
  **进一步探讨**：用受控网络和已知失败样例解释每个标签。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 用户与维护者各怎样采用退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

读者无需部署根项目，可按SHA和原报告作发现筛选，再在隔离profile安装目标插件。自建维护者需GitHub访问、Node依赖、Docker验证镜像与工件存储，承担网络下载和容器资源。配套Web子包是另一次安装，退出它需核对profile；停用市场不撤销已装第三方插件。 自建首次要配置GitHub token与限流重试、Node依赖、分类archive、扫描器和linux/amd64验证镜像；当前validator每容器1CPU/1GiB、128PID、128MiB tmpfs，命名卷跨步骤留源码和DSH profile。build/install/smoke桥接联网，下载、扫描库、镜像与工件留存产生资源成本；限额不能推成整轮总成本。持续维护classifier与validator版本会触发重新分类或expired并重验，外部凭据/native或缺web/mock合约应保留等待状态。恢复先核timeout与plugin失败归因，不盲目重试；最后核Docker命名卷实际已删，cleanupFailures不阻verified，需人工清理遗留。停止自建定时器/服务并归档工件即可退出目录运维；读者退出浏览无宿主副作用，已安装第三方需另卸载。

#### 证据与依据

**依据 1 · 源码核查**：[.github/workflows/validate-plugins.yml:24-49](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/.github/workflows/validate-plugins.yml#L24-L49)

workflow依赖

<details>
<summary>查看原文（26行）</summary>

```text
  prepare:
    runs-on: ubuntu-latest
    env:
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      CLASSIFICATION_RUN_ID: ${{ github.event_name == 'workflow_run' && github.event.workflow_run.id || '' }}
      CLASSIFICATION_BRANCH: ${{ github.event_name == 'workflow_run' && github.event.workflow_run.head_branch || github.ref_name }}
    steps:
      - name: Stop after a failed classification run
        if: github.event_name == 'workflow_run' && github.event.workflow_run.conclusion != 'success'
        run: |
          echo "Classification workflow did not succeed: ${{ github.event.workflow_run.conclusion }}"
          exit 1

      - name: Checkout validation source
        uses: actions/checkout@v5
        with:
          ref: ${{ github.event_name == 'workflow_run' && github.event.workflow_run.head_sha || github.ref }}

      - name: Set up Node.js
        uses: actions/setup-node@v5
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci
```

</details>

**依据 2 · 源码核查**：[scripts/validation/linux-sandbox.ts:84-95](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/validation/linux-sandbox.ts#L84-L95)

验证资源

<details>
<summary>查看原文（12行）</summary>

```text
  return [
    'run', '--rm', '--name', containerName, '--platform=linux/amd64',
    `--network=${network}`,
    '--read-only', '--cap-drop=ALL', '--security-opt=no-new-privileges',
    '--pids-limit=128', '--memory=1g', '--cpus=1', '--user=1000:1000',
    '--tmpfs=/tmp:rw,noexec,nosuid,size=128m',
    '--mount', `type=volume,src=${volumeName},dst=/validation`,
    ...(sourceDirectory ? ['--mount', `type=bind,src=${sourceDirectory},dst=/source,readonly`] : []),
    '--env=HOME=/validation/home', '--env=DSH_HOME=/validation/dsh-home', '--env=CI=1',
    '--workdir=/validation/workspace/plugin',
    image,
    ...command,
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugins-store/src/installer.js:14-20](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/packages/dsh-plugins-store/src/installer.js#L14-L20)

目标profile固定

```text
  if (!Array.isArray(plan.args)
    || plan.args.length !== 5
    || plan.args[0] !== 'plugin'
    || plan.args[1] !== '--profile'
    || plan.args[2] !== 'web'
    || plan.args[3] !== 'add'
    || typeof plan.args[4] !== 'string') {
```

**依据 4 · 源码核查**：[scripts/validation/validator-router.ts:25-58](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/validation/validator-router.ts#L25-L58)

类型验证器与缺合约等待

<details>
<summary>查看原文（34行）</summary>

```text
export function routeValidator(
  executionType: ExecutionType,
  options: ValidatorRouteOptions = {},
): ValidatorRoute {
  if (executionType === 'host-tool' || executionType === 'command') {
    return { validator: 'linux-headless', disposition: 'queue' }
  }
  if (executionType === 'web') {
    return options.webTarget
      ? { validator: 'web-playwright', disposition: 'queue' }
      : { validator: 'web-playwright', disposition: 'inconclusive', code: 'WEB_SMOKE_CONTRACT_REQUIRED' }
  }
  if (executionType === 'channel-mcp') {
    if (!options.channelContract) {
      return { validator: 'channel-mock', disposition: 'inconclusive', code: 'CHANNEL_MOCK_REQUIRED' }
    }
    try {
      parseChannelMockContract(options.channelContract)
      return { validator: 'channel-mock', disposition: 'queue' }
    } catch {
      return { validator: 'channel-mock', disposition: 'inconclusive', code: 'CHANNEL_MOCK_INVALID' }
    }
  }
  if (executionType === 'collection') {
    return options.collectionManifest
      ? { validator: 'collection', disposition: 'queue' }
      : { validator: 'collection', disposition: 'inconclusive', code: 'COLLECTION_MANIFEST_REQUIRED' }
  }
  if (executionType === 'skill') return { validator: 'skill-static', disposition: 'queue' }
  if (executionType === 'native') {
    return { validator: 'native-platform', disposition: 'inconclusive', code: 'PLATFORM_RUNNER_REQUIRED' }
  }
  return { validator: 'non-plugin', disposition: 'not-applicable' }
}
```

</details>

**依据 5 · 源码核查**：[scripts/validation/sandbox-runner.ts:165-171](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/validation/sandbox-runner.ts#L165-L171)

清理失败的真实处理

```text
    return { report: parseValidationReport(report), summary, results, cleanupFailures }
  } finally {
    for (const cleanup of plan.cleanup) {
      const execution = await executor(cleanup.command, cleanup.id, 30_000)
      if (execution.exitCode !== 0 && cleanup.id === 'remove-volume') cleanupFailures.push(cleanup.id)
    }
  }
```

#### 缺口

- 部署账单、队列规模和子包退出行为未运行。
  **影响**：自建成本和第三方清理负担无法仅由浏览便利推断。
  **进一步探讨**：优先读目录，需自建时先用两个受控候选核对资源。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证目录带来可靠筛选？

**研究主题**：新假设与验证

#### 完整回答

固定相同候选集合，比较只读README、看结构状态和看完整沙箱报告三组，记录误判、目标SHA命中与筛选用时。加入新提交、基础设施超时和业务smoke漏测反例。若标签滞后或被误解为安全，需调整展示或退回原报告，不把排行榜代替采用审核。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/validation/promotion.ts:157-174](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/validation/promotion.ts#L157-L174)

验证版本环境字段

<details>
<summary>查看原文（18行）</summary>

```text
  return {
    repositoryId: report.repository.id,
    sourceSha: report.repository.sourceSha,
    sourcePushedAt: report.repository.sourcePushedAt,
    updatedAt: report.completedAt ?? report.startedAt,
    dshVersion: report.target.dshVersion,
    platform: report.target.platform,
    validatorVersion: report.target.validatorVersion,
    ...(report.sourceClassification ? { sourceClassification: report.sourceClassification } : {}),
    structure: structureFailed
      ? { status: structureStatus, ...(structureCheckedAt ? { checkedAt: structureCheckedAt } : {}), ...evidence }
      : { status: structureStatus, ...(structureCheckedAt ? { checkedAt: structureCheckedAt } : {}) },
    sandbox: structureFailed
      ? { status: 'skipped' }
      : report.currentStatus === 'verified'
        ? { status: 'passed', ...evidence }
        : report.currentStatus === 'inconclusive'
          ? { status: 'inconclusive', ...evidence }
```

</details>

**依据 2 · 源码核查**：[scripts/validation/linux-sandbox.ts:174-178](https://github.com/ZASENJC/dsh-plugins-store/blob/8dbdf819ae1b38eb67a925398776b293fb85583f/scripts/validation/linux-sandbox.ts#L174-L178)

超时与通过区分

```text
export function summarizeSandboxExecution(results: SandboxStepResult[]): SandboxExecutionSummary {
  const failed = results.find((result) => result.timedOut || result.exitCode !== 0)
  if (!failed) return { finalStatus: 'verified', attribution: 'plugin', code: 'SANDBOX_PASSED' }
  if (failed.timedOut) {
    return { finalStatus: 'inconclusive', attribution: 'infrastructure', code: 'SANDBOX_TIMEOUT' }
```

#### 缺口

- 没有独立用户筛选对照。
  **影响**：无法确认目录降低误装或提高任务成功率。
  **进一步探讨**：保存候选原SHA、报告与用户判定。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
